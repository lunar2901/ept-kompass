/**
 * Public entry point. Lesson MDX files and the lesson renderer import
 * every component from here:
 *
 *   import { GermanTerm, FormulaCard, Exercise, Callout, VocabBlock,
 *            DiagramP_and_ID, DiagramSVG, InteractivePlot } from "@/components/lesson"
 *
 * Contract types live in `../lesson-components.ts` and are re-exported
 * below for anyone who needs to type-check an MDX author's call site.
 */

export { GermanTerm } from "./german-term";
export { FormulaCard } from "./formula-card";
export { Exercise } from "./exercise";
export { Callout } from "./callout";
export { VocabBlock } from "./vocab-block";
export { DiagramP_and_ID } from "./diagram-mermaid";
export { DiagramSVG } from "./diagram-svg";
export { InteractivePlot } from "./interactive-plot";
export { KatexInline } from "./katex";

export type {
  GermanTermProps,
  FormulaCardProps,
  FormulaVariable,
  ExerciseProps,
  ExerciseDifficulty,
  ExerciseOption,
  CommonMistake,
  VocabBlockProps,
  VocabEntry,
  CalloutProps,
  DiagramP_and_IDProps,
  DiagramSVGProps,
  InteractivePlotProps,
} from "../lesson-components";
