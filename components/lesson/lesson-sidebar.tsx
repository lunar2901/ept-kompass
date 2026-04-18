"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { BookOpen, Sigma, Pencil, X, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { KatexInline } from "./katex";
import type {
  LessonFormula,
  LessonTerm,
} from "@/lib/lesson-extract";

interface Props {
  slug: string;
  terms: LessonTerm[];
  formulas: LessonFormula[];
}

/**
 * Sticky right-side lesson sidebar (desktop) + bottom-sheet drawer
 * (mobile). Three tabs:
 *
 *   Glossar  → every German term this lesson touches, with article,
 *              plural, IPA, English gloss. Sourced from the union
 *              of inline <GermanTerm> chips and the <VocabBlock>
 *              at the top of the MDX body.
 *   Formeln  → every <FormulaCard> in the lesson, each clickable to
 *              scroll the main pane to that card.
 *   Notizen  → a plain markdown textarea, auto-persisted to
 *              localStorage keyed by the lesson slug. Post-v0 will
 *              migrate this to the Supabase `lesson_notes` table
 *              once auth ships; the storage key stays stable.
 */
export function LessonSidebar({ slug, terms, formulas }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reactiveId = useId();

  return (
    <>
      {/* Desktop sticky column */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-[4.5rem] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--card)]">
          <SidebarTabs slug={slug} terms={terms} formulas={formulas} tabsId={reactiveId} />
        </div>
      </aside>

      {/* Mobile floating button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cn(
          "lg:hidden fixed bottom-4 right-4 z-40 rounded-full shadow-lg",
          "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
          "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium",
        )}
        aria-label="Seitenleiste öffnen"
      >
        <Library className="size-4" aria-hidden />
        Extras
      </button>

      {/* Mobile bottom-sheet drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50",
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
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[80dvh] rounded-t-xl border-t border-[color:var(--border)] bg-[color:var(--card)] shadow-xl",
            "flex flex-col transition-transform",
            mobileOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-3 py-2">
            <span className="text-sm font-semibold">Lektions-Extras</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded p-1 hover:bg-[color:var(--muted)]"
              aria-label="Schließen"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="overflow-y-auto">
            <SidebarTabs slug={slug} terms={terms} formulas={formulas} tabsId={reactiveId + "-m"} />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarTabs({
  slug,
  terms,
  formulas,
  tabsId,
}: {
  slug: string;
  terms: LessonTerm[];
  formulas: LessonFormula[];
  tabsId: string;
}) {
  return (
    <Tabs.Root defaultValue="glossar" className="flex flex-col">
      <Tabs.List className="flex border-b border-[color:var(--border)] bg-[color:var(--muted)]/40">
        <SidebarTab value="glossar" icon={BookOpen} label={`Glossar (${terms.length})`} />
        <SidebarTab value="formeln" icon={Sigma} label={`Formeln (${formulas.length})`} />
        <SidebarTab value="notizen" icon={Pencil} label="Notizen" />
      </Tabs.List>

      <Tabs.Content value="glossar" className="p-3">
        <GlossarPanel terms={terms} />
      </Tabs.Content>
      <Tabs.Content value="formeln" className="p-3">
        <FormelnPanel formulas={formulas} />
      </Tabs.Content>
      <Tabs.Content value="notizen" className="p-3">
        <NotizenPanel slug={slug} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

function SidebarTab({
  value,
  icon: Icon,
  label,
}: {
  value: string;
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium border-b-2 border-transparent",
        "text-[color:var(--muted-foreground)]",
        "data-[state=active]:border-[color:var(--accent)] data-[state=active]:text-[color:var(--foreground)] data-[state=active]:bg-[color:var(--card)]",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="truncate">{label}</span>
    </Tabs.Trigger>
  );
}

function GlossarPanel({ terms }: { terms: LessonTerm[] }) {
  if (terms.length === 0) {
    return (
      <p className="text-xs text-[color:var(--muted-foreground)] italic">
        Keine Fachbegriffe in dieser Lektion markiert.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {terms.map((t) => (
        <li
          key={t.de}
          className="border-b border-[color:var(--border)] pb-2 last:border-0 last:pb-0"
        >
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {t.article && (
              <span className="text-[0.65rem] text-[color:var(--muted-foreground)] uppercase tracking-wide">
                {t.article}
              </span>
            )}
            <span className="font-serif text-sm font-semibold">{t.de}</span>
            {t.plural && (
              <span className="text-xs text-[color:var(--muted-foreground)]">
                pl. {t.plural}
              </span>
            )}
          </div>
          {t.ipa && (
            <div className="mt-0.5 font-mono text-[0.7rem] text-[color:var(--muted-foreground)]">
              {t.ipa}
            </div>
          )}
          {t.en && (
            <div className="mt-0.5 text-xs text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
              {t.en}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function FormelnPanel({ formulas }: { formulas: LessonFormula[] }) {
  if (formulas.length === 0) {
    return (
      <p className="text-xs text-[color:var(--muted-foreground)] italic">
        Keine Formelkarten in dieser Lektion.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {formulas.map((f, i) => (
        <li key={`${f.anchorId}-${i}`}>
          <a
            href={`#${f.anchorId}`}
            className="block rounded border border-[color:var(--border)] p-2 hover:border-[color:var(--accent)] hover:bg-[color:var(--muted)]/50"
          >
            <div className="font-sans text-sm font-medium leading-snug">
              {f.name_de}
            </div>
            {f.name_en && (
              <div className="text-xs text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                {f.name_en}
              </div>
            )}
            {f.latex && (
              <div className="mt-1 overflow-x-auto text-xs">
                <KatexInline expression={f.latex} />
              </div>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

function NotizenPanel({ slug }: { slug: string }) {
  const storageKey = `ept.notes.${slug}`;
  const [text, setText] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) setText(existing);
    } catch {
      // localStorage disabled (private browsing) — silently fall back to in-memory
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Debounced save
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        if (text) localStorage.setItem(storageKey, text);
        else localStorage.removeItem(storageKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
      } catch {
        // ignore
      }
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [text, storageKey]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[color:var(--muted-foreground)]">
        Plain markdown. Auto-gespeichert im Browser (localStorage) — wird
        beim Ausloggen / Browser-Wechsel nicht mitgenommen.
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Deine Gedanken zur Lektion …"
        className="min-h-[14rem] rounded border border-[color:var(--border)] bg-[color:var(--background)] p-2 text-sm font-mono leading-relaxed focus:outline-none focus:border-[color:var(--accent)]"
      />
      <div className="flex items-center justify-between text-[0.7rem] text-[color:var(--muted-foreground)]">
        <span>{text.length} Zeichen</span>
        <span className={cn(saved ? "opacity-100" : "opacity-0", "transition-opacity")}>
          gespeichert
        </span>
      </div>
    </div>
  );
}
