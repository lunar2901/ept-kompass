import { cache } from "react";
import {
  CHAPTERS,
  MODULES,
  TRACKS,
  type ChapterSeed,
  type ModuleSeed,
  type TrackSeed,
} from "./curriculum-data";
import { listAllLessons, type LessonRecord } from "./content";

/**
 * Hierarchical navigation model: Track → Module → Chapter → Lesson.
 *
 * `buildNavigation()` reads every MDX under `content/`, joins it to
 * the static metadata in `curriculum-data.ts`, and returns a tree
 * the UI can iterate on. Results are cached per-render with React's
 * built-in `cache` so multiple components on the same page share one
 * filesystem walk.
 */

export interface NavLesson {
  slug: string;
  name_de: string;
  name_en: string;
  position: number;
  estimated_minutes?: number;
  status: LessonRecord["status"];
  href: string;
}

export interface NavChapter extends ChapterSeed {
  lessons: NavLesson[];
}

export interface NavModule extends ModuleSeed {
  chapters: NavChapter[];
  totalLessons: number;
  publishedLessons: number;
  href: string;
  hasContent: boolean;
}

export interface NavTrack extends TrackSeed {
  modules: NavModule[];
  totalLessons: number;
  publishedLessons: number;
}

export const buildNavigation = cache(async (): Promise<NavTrack[]> => {
  const lessons = await listAllLessons().catch(() => [] as LessonRecord[]);

  // Group lessons by (module_code, chapter_code)
  const byKey = new Map<string, LessonRecord[]>();
  for (const l of lessons) {
    const key = `${l.module}::${l.chapter}`;
    const arr = byKey.get(key) ?? [];
    arr.push(l);
    byKey.set(key, arr);
  }

  // Also compute dynamic chapters discovered from the filesystem for
  // modules that authors started writing before updating curriculum-data.
  // We merge declared CHAPTERS with filesystem-found ones (declared wins).
  const declaredByKey = new Map<string, ChapterSeed>(
    CHAPTERS.map((c) => [`${c.module_code}::${c.code}`, c]),
  );

  const chaptersByModule = new Map<string, NavChapter[]>();
  for (const m of MODULES) {
    const declared = CHAPTERS.filter((c) => c.module_code === m.code);
    const discovered: ChapterSeed[] = [];
    for (const l of lessons.filter((x) => x.module === m.code)) {
      const key = `${m.code}::${l.chapter}`;
      if (!declaredByKey.has(key) && !discovered.some((c) => c.code === l.chapter)) {
        discovered.push({
          code: l.chapter,
          module_code: m.code,
          name_de: toTitle(l.chapter),
          name_en: toTitle(l.chapter),
          position: 99,
        });
      }
    }
    const all = [...declared, ...discovered].sort(
      (a, b) => a.position - b.position,
    );
    const navChapters: NavChapter[] = all.map((c) => {
      const chLessons = (byKey.get(`${c.module_code}::${c.code}`) ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(
          (l): NavLesson => ({
            slug: l.slug,
            name_de: l.name_de,
            name_en: l.name_en,
            position: l.position,
            estimated_minutes: l.estimated_minutes,
            status: l.status,
            href: `/lektion/${l.slug}`,
          }),
        );
      return { ...c, lessons: chLessons };
    });
    chaptersByModule.set(m.code, navChapters);
  }

  // Build module nodes
  const navModules: NavModule[] = MODULES.map((m) => {
    const chs = chaptersByModule.get(m.code) ?? [];
    const publishedLessons = chs.reduce(
      (sum, c) => sum + c.lessons.filter((l) => l.status === "published").length,
      0,
    );
    const totalLessons = chs.reduce((sum, c) => sum + c.lessons.length, 0);
    return {
      ...m,
      chapters: chs,
      totalLessons,
      publishedLessons,
      href: `/modul/${m.code}`,
      hasContent: totalLessons > 0,
    };
  });

  // Group modules under tracks
  const navTracks: NavTrack[] = TRACKS.map((t) => {
    const mods = navModules
      .filter((m) => m.track_code === t.code)
      .sort((a, b) => a.position - b.position);
    return {
      ...t,
      modules: mods,
      publishedLessons: mods.reduce((s, m) => s + m.publishedLessons, 0),
      totalLessons: mods.reduce((s, m) => s + m.totalLessons, 0),
    };
  }).sort((a, b) => a.position - b.position);

  return navTracks;
});

export async function findModuleByCode(code: string): Promise<NavModule | null> {
  const tracks = await buildNavigation();
  for (const t of tracks) {
    const m = t.modules.find((x) => x.code === code);
    if (m) return m;
  }
  return null;
}

export async function findTrackForModule(
  moduleCode: string,
): Promise<NavTrack | null> {
  const tracks = await buildNavigation();
  for (const t of tracks) {
    if (t.modules.some((m) => m.code === moduleCode)) return t;
  }
  return null;
}

/** For breadcrumbs on a lesson page, resolve the full Track → Module → Chapter. */
export async function resolveLessonContext(
  slug: string,
): Promise<{
  track: NavTrack;
  module: NavModule;
  chapter: NavChapter;
  lesson: NavLesson;
} | null> {
  const tracks = await buildNavigation();
  for (const track of tracks) {
    for (const module of track.modules) {
      for (const chapter of module.chapters) {
        const lesson = chapter.lessons.find((l) => l.slug === slug);
        if (lesson) return { track, module, chapter, lesson };
      }
    }
  }
  return null;
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
