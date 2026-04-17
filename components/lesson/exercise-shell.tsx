"use client";

import { useMemo, useState, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Check,
  X,
  Lightbulb,
  BookOpen,
  AlertTriangle,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExerciseProps } from "../lesson-components";

type Mistake = { wrong: string; why: ReactNode };

interface ExerciseShellProps {
  payload: ExerciseProps;
  solutionEl: ReactNode;
  discussionEl: ReactNode;
  mistakes: Mistake[];
}

/**
 * Client-side interactive exercise. Holds form state, grading, and the
 * four-tab result panel. All pedagogical MDX (solution, discussion,
 * mistake-why) is pre-compiled server-side and passed as React elements.
 *
 * Submit flow:
 *   1. grade() produces { correct: bool, student: string, matchedMistake? }
 *   2. result panel opens with tabs: Lösung · Häufige Fehler · Diskussion · Meine Antwort
 *   3. if a common-mistake row matches the student's wrong answer, its
 *      row is pre-highlighted and scrolled into view in the Häufige Fehler tab
 *
 * Later (step 8 onward): every submission POSTs to
 *   supabase.exercise_attempts  { user_id, exercise_id, submitted_answer,
 *                                 correct, saw_hint, saw_solution }
 * For MVP with auth skipped, the write is a no-op stub.
 */
export function ExerciseShell({
  payload,
  solutionEl,
  discussionEl,
  mistakes,
}: ExerciseShellProps) {
  const [showEn, setShowEn] = useState(false);
  const [sawHint, setSawHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState<unknown>(initialAnswer(payload));
  const graded = useMemo(() => grade(payload, answer), [payload, answer]);
  const matchedMistakeIdx = useMemo(
    () => findMatchingMistake(payload, answer, mistakes),
    [payload, answer, mistakes],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Post to exercise_attempts (stub until auth lands):
    //   POST /api/attempts { exercise_id, submitted_answer, correct, saw_hint }
  };

  const diffBadge = difficultyLabel(payload.difficulty);

  return (
    <section
      className={cn(
        "my-6 rounded-lg border p-5",
        "border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]",
      )}
      aria-labelledby={`ex-${payload.id}-title`}
    >
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide",
              diffBadge.className,
            )}
          >
            {diffBadge.label}
          </span>
          <span className="text-xs text-[color:var(--muted-foreground)] font-mono">
            {payload.id}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowEn((v) => !v)}
          className="text-xs text-[color:var(--muted-foreground)] hover:text-[color:var(--accent)] klausur-hide-en:hidden"
        >
          {showEn ? "Deutsch" : "English"}
        </button>
      </header>

      <h4
        id={`ex-${payload.id}-title`}
        className="font-serif text-base leading-snug"
      >
        {payload.question_de}
      </h4>
      {showEn && payload.question_en && (
        <p className="mt-1 text-sm text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {payload.question_en}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <AnswerInput
          payload={payload}
          value={answer}
          onChange={setAnswer}
          disabled={submitted}
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {payload.hint_en && (
            <button
              type="button"
              onClick={() => setSawHint(true)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-sm",
                "border-[color:var(--border)] hover:border-[color:var(--accent)]",
                sawHint && "bg-[color:var(--accent-muted)] border-[color:var(--accent)]",
              )}
            >
              <Lightbulb className="size-3.5" aria-hidden />
              {sawHint ? "Hinweis angezeigt" : "Hinweis"}
            </button>
          )}
          {!submitted && (
            <button
              type="submit"
              disabled={!hasAnswer(payload, answer)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-3 py-1 text-sm font-medium",
                "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
                "hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              Antwort prüfen
            </button>
          )}
        </div>

        {sawHint && payload.hint_en && !submitted && (
          <div className="mt-2 rounded border-l-2 border-[color:var(--accent)] bg-[color:var(--accent-muted)] p-3 text-sm klausur-hide-en:hidden">
            <strong className="mr-1.5">Hint.</strong>
            {payload.hint_en}
          </div>
        )}
      </form>

      {submitted && (
        <div className="mt-5" aria-live="polite">
          <div
            className={cn(
              "mb-3 flex items-center gap-2 rounded px-3 py-2 text-sm font-medium",
              graded.correct
                ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                : "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
            )}
          >
            {graded.correct ? (
              <>
                <Check className="size-4" /> Richtig.
              </>
            ) : (
              <>
                <X className="size-4" /> Nicht ganz — lies die Lösung und die
                häufigen Fehler.
              </>
            )}
          </div>

          <Tabs.Root
            defaultValue={graded.correct ? "discussion" : "mistakes"}
            className="rounded border border-[color:var(--border)] bg-[color:var(--background)]"
          >
            <Tabs.List className="flex flex-wrap border-b border-[color:var(--border)]">
              <TabTrigger value="solution" icon={BookOpen} label="Lösung" />
              <TabTrigger
                value="mistakes"
                icon={AlertTriangle}
                label={`Häufige Fehler (${mistakes.length})`}
                highlight={matchedMistakeIdx !== -1}
              />
              <TabTrigger
                value="discussion"
                icon={MessageSquare}
                label="Diskussion"
              />
              <TabTrigger value="own" icon={Pencil} label="Meine Antwort" />
            </Tabs.List>

            <Tabs.Content value="solution" className="p-4">
              <div className="lesson-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {solutionEl}
              </div>
            </Tabs.Content>

            <Tabs.Content value="mistakes" className="p-4 space-y-3">
              {mistakes.length === 0 && (
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Keine häufigen Fehler dokumentiert.
                </p>
              )}
              {mistakes.map((m, i) => (
                <details
                  key={i}
                  className={cn(
                    "rounded border p-3",
                    i === matchedMistakeIdx
                      ? "border-[color:var(--danger)] bg-[color:var(--danger)]/10"
                      : "border-[color:var(--border)]",
                  )}
                  open={i === matchedMistakeIdx}
                >
                  <summary className="cursor-pointer font-sans text-sm font-medium">
                    {i === matchedMistakeIdx && (
                      <span className="mr-2 rounded bg-[color:var(--danger)] px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-white">
                        Deine Antwort
                      </span>
                    )}
                    {m.wrong}
                  </summary>
                  <div className="mt-2 lesson-body text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {m.why}
                  </div>
                </details>
              ))}
            </Tabs.Content>

            <Tabs.Content value="discussion" className="p-4">
              <div className="lesson-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {discussionEl}
              </div>
            </Tabs.Content>

            <Tabs.Content value="own" className="p-4 space-y-3 text-sm">
              <div>
                <div className="text-[color:var(--muted-foreground)]">
                  Deine Antwort:
                </div>
                <div className="font-mono">{renderStudentAnswer(payload, answer)}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted-foreground)]">
                  Korrekte Antwort:
                </div>
                <div className="font-mono">{renderCorrectAnswer(payload)}</div>
              </div>
              <div className="text-[color:var(--muted-foreground)]">
                Hinweis gesehen: {sawHint ? "ja" : "nein"} · Lösung geöffnet: ja
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      )}
    </section>
  );
}

/* ─── subcomponents ────────────────────────────────────────── */

function TabTrigger({
  value,
  icon: Icon,
  label,
  highlight,
}: {
  value: string;
  icon: typeof Lightbulb;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 border-transparent",
        "text-[color:var(--muted-foreground)]",
        "data-[state=active]:border-[color:var(--accent)] data-[state=active]:text-[color:var(--foreground)]",
        highlight &&
          "after:ml-1 after:size-1.5 after:rounded-full after:bg-[color:var(--danger)] after:inline-block",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </Tabs.Trigger>
  );
}

function AnswerInput({
  payload,
  value,
  onChange,
  disabled,
}: {
  payload: ExerciseProps;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  switch (payload.type) {
    case "numeric":
      return (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-40 rounded border border-[color:var(--border)] bg-[color:var(--background)] px-2 py-1 font-mono text-sm"
            aria-label="numeric answer"
          />
          {payload.unit && (
            <span className="font-mono text-sm text-[color:var(--muted-foreground)]">
              {payload.unit}
            </span>
          )}
        </div>
      );
    case "multiple_choice":
      return (
        <div className="space-y-1.5">
          {payload.options.map((o) => (
            <label
              key={o.id}
              className={cn(
                "flex gap-2 rounded border px-3 py-2 cursor-pointer",
                "border-[color:var(--border)] hover:border-[color:var(--accent)]",
                value === o.id &&
                  "border-[color:var(--accent)] bg-[color:var(--accent-muted)]",
              )}
            >
              <input
                type="radio"
                name={`ex-${payload.id}`}
                value={o.id}
                checked={value === o.id}
                onChange={() => onChange(o.id)}
                disabled={disabled}
                className="mt-0.5 accent-[color:var(--accent)]"
              />
              <span className="flex-1">
                <span className="font-serif">{o.de}</span>
                <span className="ml-2 text-xs text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                  {o.en}
                </span>
              </span>
            </label>
          ))}
        </div>
      );
    case "multi_select": {
      const selected = (value as string[]) ?? [];
      return (
        <div className="space-y-1.5">
          {payload.options.map((o) => {
            const checked = selected.includes(o.id);
            return (
              <label
                key={o.id}
                className={cn(
                  "flex gap-2 rounded border px-3 py-2 cursor-pointer",
                  "border-[color:var(--border)] hover:border-[color:var(--accent)]",
                  checked &&
                    "border-[color:var(--accent)] bg-[color:var(--accent-muted)]",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked)
                      onChange([...selected, o.id].sort());
                    else onChange(selected.filter((x) => x !== o.id));
                  }}
                  disabled={disabled}
                  className="mt-0.5 accent-[color:var(--accent)]"
                />
                <span className="flex-1">
                  <span className="font-serif">{o.de}</span>
                  <span className="ml-2 text-xs text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                    {o.en}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      );
    }
    case "short_derivation":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="LaTeX, z. B. \\frac{a}{b}"
          className="w-full rounded border border-[color:var(--border)] bg-[color:var(--background)] px-2 py-1 font-mono text-sm"
          aria-label="LaTeX derivation"
        />
      );
    case "order_steps": {
      const order = (value as string[]) ?? payload.steps.map((s) => s.id);
      return (
        <ol className="space-y-1.5">
          {order.map((sid, i) => {
            const step = payload.steps.find((s) => s.id === sid);
            if (!step) return null;
            return (
              <li
                key={sid}
                className="flex gap-2 rounded border border-[color:var(--border)] px-3 py-2"
              >
                <span className="font-mono text-xs text-[color:var(--muted-foreground)]">
                  {i + 1}.
                </span>
                <span className="flex-1 font-serif text-sm">{step.de}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (i === 0) return;
                    const next = [...order];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                  disabled={disabled || i === 0}
                  className="text-xs px-1 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (i === order.length - 1) return;
                    const next = [...order];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}
                  disabled={disabled || i === order.length - 1}
                  className="text-xs px-1 disabled:opacity-30"
                >
                  ▼
                </button>
              </li>
            );
          })}
        </ol>
      );
    }
    case "label_diagram":
      return (
        <div className="text-sm text-[color:var(--muted-foreground)]">
          Diagramm-Beschriftung: klicke die Hotspots an, um sie zu
          beschriften. (UI kommt in Step 8.)
        </div>
      );
  }
}

function initialAnswer(payload: ExerciseProps): unknown {
  switch (payload.type) {
    case "numeric":
    case "short_derivation":
      return "";
    case "multiple_choice":
      return null;
    case "multi_select":
      return [];
    case "order_steps":
      return payload.steps.map((s) => s.id);
    case "label_diagram":
      return {};
  }
}

function hasAnswer(payload: ExerciseProps, v: unknown): boolean {
  switch (payload.type) {
    case "numeric":
    case "short_derivation":
      return typeof v === "string" && v.trim().length > 0;
    case "multiple_choice":
      return typeof v === "string" && v.length > 0;
    case "multi_select":
      return Array.isArray(v) && v.length > 0;
    case "order_steps":
      return Array.isArray(v) && v.length === payload.steps.length;
    case "label_diagram":
      return true;
  }
}

function grade(payload: ExerciseProps, v: unknown) {
  switch (payload.type) {
    case "numeric": {
      const n = Number(v);
      if (!Number.isFinite(n)) return { correct: false };
      const tol = payload.tolerance ?? Math.abs(payload.correct) * 0.01;
      return { correct: Math.abs(n - payload.correct) <= tol };
    }
    case "multiple_choice":
      return { correct: v === payload.correct };
    case "multi_select": {
      const got = Array.isArray(v) ? [...v].sort() : [];
      const want = [...payload.correct].sort();
      return {
        correct:
          got.length === want.length && got.every((x, i) => x === want[i]),
      };
    }
    case "short_derivation":
      return { correct: false }; // normaliser lands in step 8
    case "order_steps": {
      const got = Array.isArray(v) ? v : [];
      return {
        correct:
          got.length === payload.correct_order.length &&
          got.every((x, i) => x === payload.correct_order[i]),
      };
    }
    case "label_diagram":
      return { correct: false };
  }
}

function findMatchingMistake(
  payload: ExerciseProps,
  v: unknown,
  mistakes: Mistake[],
): number {
  // Simple heuristic for MVP: only multiple_choice / multi_select wrong
  // answers auto-highlight a mistake row whose label starts with the
  // option id ("c — ..." or "b — ..."). Numeric and derivation matching
  // lands in step 8 alongside the real grader.
  if (payload.type === "multiple_choice" && typeof v === "string") {
    return mistakes.findIndex((m) => m.wrong.toLowerCase().startsWith(v));
  }
  return -1;
}

function renderStudentAnswer(payload: ExerciseProps, v: unknown): string {
  if (v == null) return "(keine Antwort)";
  if (Array.isArray(v)) return v.join(", ") || "(leer)";
  return String(v);
}

function renderCorrectAnswer(payload: ExerciseProps): string {
  switch (payload.type) {
    case "numeric":
      return `${payload.correct}${payload.unit ? " " + payload.unit : ""}`;
    case "multiple_choice":
      return payload.correct;
    case "multi_select":
      return payload.correct.join(", ");
    case "short_derivation":
      return payload.correct_latex ?? "—";
    case "order_steps":
      return payload.correct_order.join(" → ");
    case "label_diagram":
      return payload.hotspots.map((h) => h.correct_label_de).join(", ");
  }
}

function difficultyLabel(d: ExerciseProps["difficulty"]) {
  switch (d) {
    case "easy":
      return {
        label: "leicht",
        className:
          "bg-[color:var(--success)]/15 text-[color:var(--success)]",
      };
    case "medium":
      return {
        label: "mittel",
        className: "bg-[color:var(--warn)]/15 text-[color:var(--warn)]",
      };
    case "klausur":
      return {
        label: "Klausur",
        className:
          "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
      };
  }
}
