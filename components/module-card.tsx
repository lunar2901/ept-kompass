import Link from "next/link";
import type { NavModule } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Clock, BookOpen } from "lucide-react";

/**
 * Module card for the homepage Track sections. Shows German + English
 * title, one-line description, and a lesson-count summary. Modules
 * without any authored content are muted and show "bald verfügbar".
 */
export function ModuleCard({ module }: { module: NavModule }) {
  const available = module.hasContent;
  return (
    <Link
      href={module.href}
      className={cn(
        "group block rounded-lg border p-4 transition-colors",
        "border-[color:var(--border)] bg-[color:var(--card)]",
        available
          ? "hover:border-[color:var(--accent)]"
          : "opacity-60 hover:opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-[color:var(--accent)]">
            {module.name_de}
          </h3>
          <p className="mt-0.5 text-sm text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
            {module.name_en}
          </p>
        </div>
        {!available && (
          <span className="shrink-0 rounded bg-[color:var(--muted)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
            bald verfügbar
          </span>
        )}
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--foreground)]/85">
        {module.description_de}
      </p>

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--muted-foreground)] font-mono">
        <div className="flex items-center gap-1">
          <BookOpen className="size-3" aria-hidden />
          <span>
            {module.publishedLessons} von {Math.max(module.totalLessons, module.publishedLessons)} Lektionen
            {available ? " verfügbar" : ""}
          </span>
        </div>
        {module.semester && (
          <div className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            <span>Semester {module.semester}</span>
          </div>
        )}
        {module.ects && <div>{module.ects} ECTS</div>}
      </dl>
    </Link>
  );
}
