"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavTrack } from "@/lib/navigation";

interface SidebarProps {
  tracks: NavTrack[];
}

/**
 * Curriculum tree. Persistent on desktop (sticky column), drawer on
 * mobile (controlled by `#ept-sidebar-open` body class toggled from
 * the header Menu button).
 *
 * Tracks collapse/expand; the track containing the current route
 * starts expanded. The current module and lesson row are highlighted.
 */
export function SiteSidebar({ tracks }: SidebarProps) {
  const pathname = usePathname();
  const currentLessonSlug = extractLessonSlug(pathname);
  const currentModuleCode =
    extractModuleCode(pathname) ??
    (currentLessonSlug ? findModuleForLesson(tracks, currentLessonSlug) : null);
  const currentTrackCode =
    tracks.find((t) => t.modules.some((m) => m.code === currentModuleCode))?.code ??
    null;

  const [openTracks, setOpenTracks] = useState<Set<string>>(() => {
    return new Set(currentTrackCode ? [currentTrackCode] : [tracks[0]?.code ?? ""]);
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Re-open the current track whenever the route changes.
  useEffect(() => {
    if (currentTrackCode) {
      setOpenTracks((prev) => {
        if (prev.has(currentTrackCode)) return prev;
        const next = new Set(prev);
        next.add(currentTrackCode);
        return next;
      });
    }
    setMobileOpen(false);
  }, [pathname, currentTrackCode]);

  // Listen for the header's menu-button click.
  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener("ept:open-sidebar", open);
    return () => window.removeEventListener("ept:open-sidebar", open);
  }, []);

  const toggleTrack = (code: string) => {
    setOpenTracks((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const content = (
    <div className="flex flex-col gap-1 p-3">
      <div className="mb-2 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
        Curriculum
      </div>
      {tracks.map((track) => {
        const expanded = openTracks.has(track.code);
        return (
          <div key={track.code} className="mb-1">
            <button
              type="button"
              onClick={() => toggleTrack(track.code)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left hover:bg-[color:var(--muted)]"
              aria-expanded={expanded}
            >
              <span className="flex-1">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                  Track {track.code}
                </span>
                <span className="block text-sm font-medium">{track.name_de}</span>
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform",
                  expanded ? "rotate-0" : "-rotate-90",
                )}
                aria-hidden
              />
            </button>
            {expanded && (
              <ul className="mt-0.5 space-y-0.5">
                {track.modules.map((module) => {
                  const isCurrentModule = module.code === currentModuleCode;
                  return (
                    <li key={module.code}>
                      <Link
                        href={module.href}
                        className={cn(
                          "block rounded px-2 py-1 text-sm",
                          isCurrentModule
                            ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)] font-medium"
                            : "hover:bg-[color:var(--muted)]",
                          !module.hasContent && "text-[color:var(--muted-foreground)] italic",
                        )}
                      >
                        <span className="block truncate">{module.name_de}</span>
                        {module.publishedLessons > 0 && (
                          <span className="font-mono text-[0.65rem] text-[color:var(--muted-foreground)]">
                            {module.publishedLessons} Lektion
                            {module.publishedLessons === 1 ? "" : "en"}
                          </span>
                        )}
                      </Link>
                      {isCurrentModule && module.chapters.length > 0 && (
                        <ul className="ml-3 mt-1 space-y-0.5 border-l border-[color:var(--border)] pl-2">
                          {module.chapters.flatMap((chapter) =>
                            chapter.lessons.map((lesson) => {
                              const active = lesson.slug === currentLessonSlug;
                              return (
                                <li key={lesson.slug}>
                                  <Link
                                    href={lesson.href}
                                    className={cn(
                                      "block rounded px-1.5 py-0.5 text-xs",
                                      active
                                        ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                                        : "hover:bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]",
                                    )}
                                  >
                                    {lesson.name_de}
                                  </Link>
                                </li>
                              );
                            }),
                          )}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex w-72 shrink-0 flex-col border-r border-[color:var(--border)] bg-[color:var(--background)] h-[calc(100dvh-3.25rem)] sticky top-[3.25rem] overflow-y-auto"
        aria-label="Curriculum-Navigation"
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-[color:var(--background)] border-r border-[color:var(--border)] shadow-xl transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-3 py-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="size-4" aria-hidden />
              Curriculum
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded p-1 hover:bg-[color:var(--muted)]"
              aria-label="Navigation schließen"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          {content}
        </aside>
      </div>
    </>
  );
}

function extractModuleCode(pathname: string | null): string | null {
  if (!pathname) return null;
  const mod = /^\/modul\/([^/]+)/.exec(pathname);
  return mod ? mod[1] : null;
}

function extractLessonSlug(pathname: string | null): string | null {
  if (!pathname) return null;
  const m = /^\/lektion\/([^/]+)/.exec(pathname);
  return m ? m[1] : null;
}

function findModuleForLesson(tracks: NavTrack[], lessonSlug: string): string | null {
  for (const t of tracks) {
    for (const m of t.modules) {
      for (const c of m.chapters) {
        if (c.lessons.some((l) => l.slug === lessonSlug)) return m.code;
      }
    }
  }
  return null;
}
