/**
 * Seed EPT-Kompass content into Supabase.
 *
 * Walks `content/**\/*.mdx`, parses frontmatter, and upserts the
 * track → module → chapter → lesson tree. The MDX body is written
 * verbatim to `lessons.body_mdx` so the render path can reuse the
 * exact same string it loaded from the filesystem.
 *
 * Also imports `scripts/seed-glossary.json` into `glossary_terms`.
 *
 * The MVP does NOT extract per-exercise rows into the `exercises`
 * table — the body_mdx carries the `<Exercise>` JSX inline, and the
 * lesson renderer handles grading via the Exercise RSC. Per-row
 * `exercises` rows arrive alongside `exercise_attempts` tracking in
 * the post-auth step 8.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run with:
 *   npm run seed
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CHAPTERS, MODULES, TRACKS } from "./curriculum";

interface LessonRow {
  slug: string;
  module_code: string;
  chapter_code: string;
  position: number;
  name_de: string;
  name_en: string;
  body_mdx: string;
  estimated_minutes: number | null;
  prerequisites: string[];
  status: "stub" | "draft" | "published";
}

interface GlossarySeedEntry {
  term_de: string;
  article?: "der" | "die" | "das" | "none" | null;
  plural_de?: string | null;
  term_en: string;
  definition_de?: string | null;
  definition_en?: string | null;
  ipa?: string | null;
}

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const GLOSSARY_PATH = path.join(ROOT, "scripts", "seed-glossary.json");

async function main() {
  const supabase = createClientFromEnv();
  console.log("→ Seeding tracks…");
  await seedTracks(supabase);
  console.log("→ Seeding modules…");
  await seedModules(supabase);
  console.log("→ Seeding chapters…");
  await seedChapters(supabase);
  console.log("→ Walking content/**/*.mdx for lessons…");
  const lessons = await collectLessons();
  console.log(`  found ${lessons.length} lessons`);
  await seedLessons(supabase, lessons);
  console.log("→ Seeding glossary from scripts/seed-glossary.json…");
  await seedGlossary(supabase);
  console.log("✓ Seed complete.");
}

/* ─── Supabase client ──────────────────────────────────────── */

function createClientFromEnv(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Copy .env.example to .env.local, then run with:\n" +
        '  node -r dotenv/config --experimental-loader tsx ./node_modules/tsx/dist/cli.mjs scripts/seed.ts dotenv_config_path=.env.local\n' +
        "or simply `npm run seed` with .env.local present.",
    );
    process.exit(1);
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* ─── Upserts ──────────────────────────────────────────────── */

async function seedTracks(sb: SupabaseClient) {
  const rows = TRACKS.map((t) => ({
    code: t.code,
    name_de: t.name_de,
    name_en: t.name_en,
    description_en: t.description_en ?? null,
    position: t.position,
  }));
  const { error } = await sb
    .from("tracks")
    .upsert(rows, { onConflict: "code" });
  if (error) throw error;
}

async function seedModules(sb: SupabaseClient) {
  const { data: tracks, error: tErr } = await sb
    .from("tracks")
    .select("id, code");
  if (tErr) throw tErr;
  const trackIdByCode = new Map((tracks ?? []).map((t) => [t.code, t.id]));

  const rows = MODULES.map((m) => {
    const trackId = trackIdByCode.get(m.track_code);
    if (!trackId)
      throw new Error(
        `Module ${m.code} references unknown track ${m.track_code}`,
      );
    return {
      code: m.code,
      track_id: trackId,
      name_de: m.name_de,
      name_en: m.name_en,
      semester: m.semester,
      ects: m.ects,
      position: m.position,
      description_en: m.description_en ?? null,
    };
  });
  const { error } = await sb
    .from("modules")
    .upsert(rows, { onConflict: "code" });
  if (error) throw error;
}

async function seedChapters(sb: SupabaseClient) {
  const { data: modules, error: mErr } = await sb
    .from("modules")
    .select("id, code");
  if (mErr) throw mErr;
  const moduleIdByCode = new Map((modules ?? []).map((m) => [m.code, m.id]));

  const rows = CHAPTERS.map((c) => {
    const moduleId = moduleIdByCode.get(c.module_code);
    if (!moduleId)
      throw new Error(
        `Chapter ${c.code} references unknown module ${c.module_code}`,
      );
    return {
      code: c.code,
      module_id: moduleId,
      name_de: c.name_de,
      name_en: c.name_en,
      position: c.position,
    };
  });

  // chapters is unique on (module_id, code), not on code alone — upsert
  // by merging on both columns. Supabase wants a string.
  const { error } = await sb
    .from("chapters")
    .upsert(rows, { onConflict: "module_id,code" });
  if (error) throw error;
}

/* ─── Lessons ──────────────────────────────────────────────── */

async function collectLessons(): Promise<LessonRow[]> {
  const files = await walk(CONTENT_DIR);
  const out: LessonRow[] = [];
  for (const filePath of files) {
    if (!filePath.endsWith(".mdx")) continue;
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as Record<string, unknown>;
    const fileSlug = path.basename(filePath, ".mdx");
    const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, "/");
    const segments = rel.split("/");
    const slug = segments.slice(0, -1).concat(fileSlug).join("-");
    out.push({
      slug,
      module_code: String(fm.module ?? segments[0] ?? "unknown"),
      chapter_code: String(fm.chapter ?? segments[1] ?? "unknown"),
      position: Number(fm.position ?? 1),
      name_de: String(fm.name_de ?? fileSlug),
      name_en: String(fm.name_en ?? fileSlug),
      body_mdx: content,
      estimated_minutes:
        typeof fm.estimated_minutes === "number" ? fm.estimated_minutes : null,
      prerequisites: Array.isArray(fm.prerequisites)
        ? fm.prerequisites.map(String)
        : [],
      status:
        (["stub", "draft", "published"] as const).includes(
          fm.status as "stub" | "draft" | "published",
        )
          ? (fm.status as "stub" | "draft" | "published")
          : "stub",
    });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function seedLessons(sb: SupabaseClient, lessons: LessonRow[]) {
  const { data: chapters, error: cErr } = await sb
    .from("chapters")
    .select("id, code, module_id, modules!inner(code)");
  if (cErr) throw cErr;

  type ChapterRow = {
    id: string;
    code: string;
    modules: { code: string };
  };

  const chapterIdByKey = new Map<string, string>();
  for (const c of (chapters ?? []) as unknown as ChapterRow[]) {
    chapterIdByKey.set(`${c.modules.code}::${c.code}`, c.id);
  }

  const rows = lessons.map((l) => {
    const chapterId = chapterIdByKey.get(`${l.module_code}::${l.chapter_code}`);
    if (!chapterId)
      throw new Error(
        `Lesson ${l.slug} references unknown chapter ${l.module_code}/${l.chapter_code}`,
      );
    return {
      chapter_id: chapterId,
      slug: l.slug,
      name_de: l.name_de,
      name_en: l.name_en,
      position: l.position,
      body_mdx: l.body_mdx,
      estimated_minutes: l.estimated_minutes,
      prerequisites: l.prerequisites,
      status: l.status,
    };
  });

  // unique (chapter_id, slug)
  const { error } = await sb
    .from("lessons")
    .upsert(rows, { onConflict: "chapter_id,slug" });
  if (error) throw error;
}

/* ─── Glossary ─────────────────────────────────────────────── */

async function seedGlossary(sb: SupabaseClient) {
  const raw = await fs.readFile(GLOSSARY_PATH, "utf8");
  const parsed = JSON.parse(raw) as { terms?: GlossarySeedEntry[] };
  const terms = parsed.terms ?? [];
  if (terms.length === 0) {
    console.warn("  (no glossary entries in seed file)");
    return;
  }

  // glossary_terms has no unique key on term_de at the schema level, so do
  // an in-place re-sync: delete all rows then insert the seed. This is safe
  // because the glossary is authored, not user-generated.
  const { error: delErr } = await sb
    .from("glossary_terms")
    .delete()
    .not("id", "is", null);
  if (delErr) throw delErr;

  const rows = terms.map((t) => ({
    term_de: t.term_de,
    article: t.article ?? null,
    plural_de: t.plural_de ?? null,
    term_en: t.term_en,
    definition_de: t.definition_de ?? null,
    definition_en: t.definition_en ?? null,
    ipa: t.ipa ?? null,
    related_lesson_ids: [],
  }));

  const { error } = await sb.from("glossary_terms").insert(rows);
  if (error) throw error;
  console.log(`  ${rows.length} glossary terms inserted`);
}

/* ─── helpers ──────────────────────────────────────────────── */

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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
