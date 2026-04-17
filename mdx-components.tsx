import type { MDXComponents } from "mdx/types";
import {
  GermanTerm,
  FormulaCard,
  Exercise,
  Callout,
  VocabBlock,
  DiagramP_and_ID,
  DiagramSVG,
  InteractivePlot,
} from "@/components/lesson";

/**
 * Global MDX components. Picked up by @next/mdx for static `.mdx` pages
 * (e.g. the rendering-test page). The runtime lesson renderer registers
 * the same set when compiling lesson body MDX from the database.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    GermanTerm,
    FormulaCard,
    Exercise,
    Callout,
    VocabBlock,
    DiagramP_and_ID,
    DiagramSVG,
    InteractivePlot,
  };
}
