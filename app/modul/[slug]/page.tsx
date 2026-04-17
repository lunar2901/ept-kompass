import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, ChevronRight } from "lucide-react";
import {
  buildNavigation,
  findModuleByCode,
  findTrackForModule,
  type NavChapter,
} from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tracks = await buildNavigation();
  const modules = tracks.flatMap((t) => t.modules);
  return modules.map((m) => ({ slug: m.code }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = await findModuleByCode(slug);
  if (!module) return { title: "Modul nicht gefunden" };
  return {
    title: module.name_de,
    description: module.description_en,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const module = await findModuleByCode(slug);
  if (!module) notFound();
  const track = await findTrackForModule(module.code);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: "Start", href: "/" },
          ...(track ? [{ label: `Track ${track.code} — ${track.name_de}` }] : []),
          { label: module.name_de },
        ]}
      />

      <header className="mt-5 mb-10 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)] font-mono uppercase tracking-wider">
          <span>Modul</span>
          {module.semester && <span>· Semester {module.semester}</span>}
          {module.ects && <span>· {module.ects} ECTS</span>}
        </div>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
          {module.name_de}
        </h1>
        <p className="mt-1 text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {module.name_en}
        </p>
        <p className="mt-4 leading-relaxed text-[color:var(--foreground)]/90">
          {module.description_de}
        </p>
        <p className="mt-1 text-sm italic text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {module.description_en}
        </p>
      </header>

      {module.chapters.length === 0 ? (
        <StubPlaceholder />
      ) : (
        <section className="space-y-5">
          {module.chapters.map((chapter) => (
            <ChapterSection key={chapter.code} chapter={chapter} />
          ))}
        </section>
      )}
    </div>
  );
}

function ChapterSection({ chapter }: { chapter: NavChapter }) {
  if (chapter.lessons.length === 0) {
    return (
      <details
        open
        className="rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4 opacity-60"
      >
        <summary className="cursor-pointer list-none font-sans text-sm font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
          {chapter.name_de}
        </summary>
        <p className="mt-2 text-sm italic text-[color:var(--muted-foreground)]">
          Noch keine Lektionen veröffentlicht.
        </p>
      </details>
    );
  }
  return (
    <details
      open
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] overflow-hidden"
    >
      <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-3 font-sans font-semibold border-b border-[color:var(--border)] bg-[color:var(--muted)]/50 hover:bg-[color:var(--muted)]">
        <span className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
            Kapitel
          </span>
          <span className="font-serif text-base">{chapter.name_de}</span>
        </span>
        <span className="font-mono text-xs text-[color:var(--muted-foreground)]">
          {chapter.lessons.length} Lektion{chapter.lessons.length === 1 ? "" : "en"}
        </span>
      </summary>
      <ul className="divide-y divide-[color:var(--border)]">
        {chapter.lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={lesson.href}
              className="group flex items-center gap-3 px-4 py-3 hover:bg-[color:var(--muted)]/60"
            >
              <span className="font-mono text-xs text-[color:var(--muted-foreground)] w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-base leading-snug group-hover:text-[color:var(--accent)]">
                  {lesson.name_de}
                </span>
                <span className="block text-xs text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                  {lesson.name_en}
                </span>
              </span>
              {lesson.estimated_minutes && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[color:var(--muted-foreground)] font-mono">
                  <Clock className="size-3" aria-hidden />
                  {lesson.estimated_minutes} min
                </span>
              )}
              <ChevronRight
                className="size-4 shrink-0 text-[color:var(--muted-foreground)]/50 group-hover:text-[color:var(--accent)]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function StubPlaceholder() {
  return (
    <section className="rounded-lg border-2 border-dashed border-[color:var(--border)] bg-[color:var(--muted)]/30 p-8 text-center">
      <p className="font-sans text-sm font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
        Bald verfügbar
      </p>
      <p className="mt-3 text-sm text-[color:var(--foreground)]/80 max-w-xl mx-auto">
        Für dieses Modul sind noch keine Lektionen geschrieben. Es ist bereits
        im Curriculum-Baum hinterlegt, damit der Studienplan-Generator es
        einplanen kann, sobald der Inhalt folgt.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block text-sm text-[color:var(--accent)] underline"
      >
        Zurück zur Übersicht
      </Link>
    </section>
  );
}
