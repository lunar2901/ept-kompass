import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  listAllLessons,
  listPublishedLessons,
  loadLessonBySlug,
} from "@/lib/content";
import { renderLessonMDX } from "@/lib/mdx";
import { resolveLessonContext } from "@/lib/navigation";
import {
  extractLessonFormulas,
  extractLessonTerms,
} from "@/lib/lesson-extract";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LessonSidebar } from "@/components/lesson/lesson-sidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const lessons = await listAllLessons().catch(() => []);
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await loadLessonBySlug(slug);
  if (!lesson) return { title: "Lektion nicht gefunden" };
  return {
    title: lesson.name_de,
    description: lesson.name_en,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = await loadLessonBySlug(slug);
  if (!lesson) notFound();

  const all = await listPublishedLessons();
  const idx = all.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const ctx = await resolveLessonContext(lesson.slug);
  const terms = extractLessonTerms(lesson.bodyMdx);
  const formulas = extractLessonFormulas(lesson.bodyMdx);
  const { content } = await renderLessonMDX(lesson.bodyMdx);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: "Start", href: "/" },
          ...(ctx
            ? [
                {
                  label: `Track ${ctx.track.code} — ${ctx.track.name_de}`,
                },
                { label: ctx.module.name_de, href: ctx.module.href },
                { label: ctx.chapter.name_de },
                { label: lesson.name_de },
              ]
            : [{ label: lesson.name_de }]),
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0">
          <header className="mb-8">
            <h1 className="font-sans text-3xl font-semibold tracking-tight">
              {lesson.name_de}
            </h1>
            <p className="mt-1 text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
              {lesson.name_en}
            </p>
            {lesson.estimated_minutes && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                <Clock className="size-3.5" aria-hidden />
                {lesson.estimated_minutes} min
              </p>
            )}
          </header>

          <div className="lesson-body">{content}</div>

          {/* Next / previous */}
          <nav
            aria-label="Lektions-Navigation"
            className="mt-12 grid gap-3 border-t border-[color:var(--border)] pt-6 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/lektion/${prev.slug}`}
                className="group rounded border border-[color:var(--border)] p-3 transition-colors hover:border-[color:var(--accent)]"
              >
                <div className="flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                  <ChevronLeft className="size-3.5" aria-hidden />
                  vorherige Lektion
                </div>
                <div className="mt-0.5 font-serif font-semibold group-hover:text-[color:var(--accent)]">
                  {prev.name_de}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/lektion/${next.slug}`}
                className="group rounded border border-[color:var(--border)] p-3 text-right transition-colors hover:border-[color:var(--accent)]"
              >
                <div className="flex items-center justify-end gap-1 text-xs text-[color:var(--muted-foreground)]">
                  nächste Lektion
                  <ChevronRight className="size-3.5" aria-hidden />
                </div>
                <div className="mt-0.5 font-serif font-semibold group-hover:text-[color:var(--accent)]">
                  {next.name_de}
                </div>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <LessonSidebar
          slug={lesson.slug}
          terms={terms}
          formulas={formulas}
        />
      </div>
    </div>
  );
}
