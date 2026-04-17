/**
 * MDX component contracts for EPT-Kompass lesson content.
 *
 * Every `.mdx` lesson file imports these from "@/components/lesson".
 * Implement them once here; do not scatter alternative versions.
 *
 * Claude Code: these are the authoritative prop shapes. If a new lesson
 * needs a component not in this file, add it HERE first, then use it in MDX.
 */

import type { JSX, ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────
// GermanTerm — the inline chip that appears in English prose
// ─────────────────────────────────────────────────────────────────
// Renders as a clickable pill showing the German term. Clicking opens
// a popover with article, plural, English equivalent, IPA, and a link
// to the full glossary entry. Also adds the term to the student's
// spaced-repetition queue on first exposure.
export interface GermanTermProps {
  de: string;                                     // the German term, e.g. "Systemgrenze"
  en: string;                                     // English equivalent
  article?: "der" | "die" | "das";                // omit for non-nouns (adjectives, verbs)
  plural?: string;                                // e.g. "Systemgrenzen"
  ipa?: string;                                   // e.g. "/zʏsˈteːm/"
  /**
   * If this term exists in the glossary, prefer providing the glossary
   * id — the popover will then link to the full glossary entry.
   * If omitted, the glossary is searched by `de` at render time.
   */
  termId?: string;
}

// ─────────────────────────────────────────────────────────────────
// FormulaCard — a named, derivable formula
// ─────────────────────────────────────────────────────────────────
// Renders as a bordered card with the German and English names, the
// LaTeX formula, a variable legend, and optional children MDX for
// the "why" / derivation. The card can be expanded to full screen
// and added to the student's formula sheet.
export interface FormulaVariable {
  symbol: string;         // LaTeX, e.g. "\\dot{Q}"
  name_de: string;        // "Wärmestrom"
  name_en: string;        // "heat flow rate"
  unit: string;           // SI, e.g. "W" or "—" for dimensionless
  typical?: string;       // optional order-of-magnitude hint
}

export interface FormulaCardProps {
  name_de: string;
  name_en: string;
  latex?: string;                     // display maths; omit if the card is purely qualitative
  variables?: FormulaVariable[];
  /** If this formula lives in the `formulas` DB table, the id. */
  formulaId?: string;
  children?: ReactNode;               // MDX body: derivation, intuition, caveats
}

// ─────────────────────────────────────────────────────────────────
// Exercise — inline graded question with full pedagogical payload
// ─────────────────────────────────────────────────────────────────
// Every exercise is keyed by a stable `id` that matches the DB row.
// Answers submitted through this component are logged to
// `exercise_attempts` for the current user and feed the SRS queue
// on incorrect answers.
//
// Every exercise has FOUR educational components accessible from its
// UI, revealed progressively so the student learns actively:
//
//   1. `hint_en`  — one gentle nudge for when the student is stuck
//                   but does not want the answer yet
//   2. `solution_mdx` — the full worked solution (MDX, so it can
//                   contain formulas, sub-calculations, German text)
//   3. `common_mistakes` — the specific wrong answers students
//                   typically give, with why each is tempting and
//                   what the correct reasoning is
//   4. `discussion_mdx` — variations on the problem, edge cases,
//                   connections to other topics, historical notes
//
// The UI reveals these in order: Hint first (tap "Hint"), then on
// submission the Solution + Common Mistakes + Discussion open as
// tabs in a result panel. A student who got the question right
// should still read the Discussion — that is where exam-level
// understanding lives.

export type ExerciseDifficulty = "easy" | "medium" | "klausur";

export interface ExerciseOption {
  id: string;        // "a" | "b" | ...
  de: string;        // option text in German (exam-style)
  en: string;        // English translation (hidden in Klausur-Modus)
}

export interface CommonMistake {
  wrong: string;               // a short label of the wrong answer or mistake
  why_en: string;              // 2–5 sentences explaining the reasoning trap
}

// The pedagogical payload is identical across all exercise types.
// Only the question shape (numeric / multiple_choice / ...) differs.
interface ExerciseBase {
  id: string;
  difficulty: ExerciseDifficulty;
  question_de: string;
  question_en?: string;
  /** One gentle nudge shown on demand before submission. */
  hint_en?: string;
  /**
   * The full worked solution in MDX. Must be written.
   * Use TU Berlin Klausur-format headings where appropriate:
   * Gegeben / Gesucht / Annahmen / Systemgrenze / Lösungsweg / Ergebnis.
   */
  solution_mdx: string;
  /**
   * 2–4 specific wrong answers students typically give, each with
   * 2–5 sentences diagnosing the reasoning trap. Required — do not
   * ship an exercise without at least two of these.
   */
  common_mistakes: CommonMistake[];
  /**
   * Extended discussion (MDX): variations of the problem, edge cases,
   * connections to other lessons and later modules, historical or
   * practical notes. This is where exam-level understanding lives.
   * Required — at least 150 words.
   */
  discussion_mdx: string;
}

export type ExerciseProps =
  | (ExerciseBase & {
      type: "numeric";
      correct: number;
      unit?: string;               // expected unit, e.g. "kJ/kg"
      tolerance?: number;          // absolute; default 1% of |correct|
    })
  | (ExerciseBase & {
      type: "multiple_choice";
      options: ExerciseOption[];
      correct: string;
    })
  | (ExerciseBase & {
      type: "multi_select";
      options: ExerciseOption[];
      correct: string[];
    })
  | (ExerciseBase & {
      type: "short_derivation";
      /** Symbolic answer as LaTeX; grader normalises via mathjs. */
      correct_latex?: string;
    })
  | (ExerciseBase & {
      type: "order_steps";
      steps: { id: string; de: string; en: string }[];
      correct_order: string[];
    })
  | (ExerciseBase & {
      type: "label_diagram";
      svgSrc: string;
      hotspots: {
        id: string;
        x: number; y: number;      // percentage coords of hotspot centre
        correct_label_de: string;
        correct_label_en: string;
      }[];
    });

// ─────────────────────────────────────────────────────────────────
// VocabBlock — the German vocabulary list at the top of a lesson
// ─────────────────────────────────────────────────────────────────
// Written in MDX as YAML-looking children; parsed by a remark plugin.
// Renders as a collapsible card. All terms here are auto-added to SRS.
export interface VocabEntry {
  term: string;
  en: string;
  plural?: string;
  ipa?: string;
  example_de?: string;
  example_en?: string;
}

export interface VocabBlockProps {
  entries?: VocabEntry[];        // passed explicitly, or via children YAML
  children?: ReactNode;
}

// ─────────────────────────────────────────────────────────────────
// Callout — intuition / exam-tip / warning blocks
// ─────────────────────────────────────────────────────────────────
export interface CalloutProps {
  variant: "intuition" | "exam-tip" | "warning" | "note" | "historical";
  title?: string;
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────
// DiagramP_and_ID — process / flow / thermodynamic cycle diagrams
// ─────────────────────────────────────────────────────────────────
// Renders a Mermaid diagram with bilingual captions. For real P&IDs,
// prefer uploading an SVG and using <DiagramSVG> instead (below).
export interface DiagramP_and_IDProps {
  mermaid: string;
  caption_de: string;
  caption_en: string;
}

export interface DiagramSVGProps {
  src: string;                   // /diagrams/thermo-1/turbine.svg
  caption_de: string;
  caption_en: string;
  alt: string;                   // text alternative for accessibility
}

// ─────────────────────────────────────────────────────────────────
// InteractivePlot — sliders that update a live plot
// ─────────────────────────────────────────────────────────────────
// Example: let the student drag T₁ and watch the Carnot efficiency
// change. Implemented with Recharts + useState. The mathematical
// function is passed as a string that the runtime evaluates with
// mathjs (never with eval).
export interface InteractivePlotProps {
  id: string;
  title_de: string;
  title_en: string;
  xLabel: { de: string; en: string; unit: string };
  yLabel: { de: string; en: string; unit: string };
  /** Expression in mathjs syntax, e.g. "1 - T_cold / T_hot". */
  expression: string;
  variables: {
    name: string;                 // must match a symbol in `expression`
    label_de: string;
    label_en: string;
    min: number;
    max: number;
    step: number;
    initial: number;
    unit: string;
  }[];
  /** The variable that is swept along the x-axis. */
  xVariable: string;
}

// ─────────────────────────────────────────────────────────────────
// Export aggregator — MDXProvider reads from here
// ─────────────────────────────────────────────────────────────────
export type LessonMDXComponents = {
  GermanTerm: (p: GermanTermProps) => JSX.Element;
  FormulaCard: (p: FormulaCardProps) => JSX.Element;
  Exercise: (p: ExerciseProps) => JSX.Element;
  VocabBlock: (p: VocabBlockProps) => JSX.Element;
  Callout: (p: CalloutProps) => JSX.Element;
  DiagramP_and_ID: (p: DiagramP_and_IDProps) => JSX.Element;
  DiagramSVG: (p: DiagramSVGProps) => JSX.Element;
  InteractivePlot: (p: InteractivePlotProps) => JSX.Element;
};
