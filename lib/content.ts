import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/**
 * Filesystem-backed content loader for MVP. Reads `content/**\/*.mdx`,
 * parses frontmatter, returns lesson records.
 *
 * Rationale: Supabase is configured (see step 2) and the seed script
 * populates `lessons.body_mdx` in the database, but the rendering path
 * for MVP reads MDX directly from the filesystem. Two benefits:
 *
 *   1. The app works with zero external service — useful before the
 *      Supabase project is provisioned, and for offline development.
 *   2. MDX compiled at request time has access to the filesystem slug,
 *      so relative-path imports and image references behave predictably.
 *
 * Step 8 onward can route published lessons through Supabase for the
 * authenticated experience. Anonymous dev stays on the filesystem path.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface LessonFrontmatter {
  id: string;
  module: string;
  chapter: string;
  position: number;
  name_de: string;
  name_en: string;
  estimated_minutes?: number;
  prerequisites?: string[];
  status?: "stub" | "draft" | "published";
}

export interface LessonRecord extends LessonFrontmatter {
  slug: string; // chapter-dir-slug + filename-slug, e.g. "thermo-1-kap-1-01-system-und-umgebung"
  track: string; // first path segment under content/, e.g. "thermo-1"
  filePath: string; // absolute
  bodyMdx: string; // MDX source with frontmatter stripped
}

export async function listAllLessons(): Promise<LessonRecord[]> {
  const files = await walk(CONTENT_DIR);
  const lessons = await Promise.all(
    files.filter((f) => f.endsWith(".mdx")).map(readLesson),
  );
  return lessons.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function listPublishedLessons(): Promise<LessonRecord[]> {
  const all = await listAllLessons().catch(() => [] as LessonRecord[]);
  return all.filter((l) => l.status === "published");
}

export async function loadLessonBySlug(
  slug: string,
): Promise<LessonRecord | null> {
  const all = await listAllLessons().catch(() => [] as LessonRecord[]);
  return all.find((l) => l.slug === slug) ?? null;
}

async function readLesson(filePath: string): Promise<LessonRecord> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as Partial<LessonFrontmatter>;

  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, "/");
  const segments = rel.split("/");
  const track = segments[0] ?? "unknown";
  const fileSlug = path.basename(filePath, ".mdx");
  const slug = segments.slice(0, -1).concat(fileSlug).join("-");

  return {
    id: fm.id ?? slug,
    module: fm.module ?? segments[0] ?? "unknown",
    chapter: fm.chapter ?? segments[1] ?? "unknown",
    position: fm.position ?? 1,
    name_de: fm.name_de ?? fileSlug,
    name_en: fm.name_en ?? fileSlug,
    estimated_minutes: fm.estimated_minutes,
    prerequisites: fm.prerequisites ?? [],
    status: (fm.status as LessonRecord["status"]) ?? "stub",
    slug,
    track,
    filePath,
    bodyMdx: parsed.content,
  };
}

async function walk(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
