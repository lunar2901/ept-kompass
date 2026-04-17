import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import {
  GermanTerm,
  FormulaCard,
  Exercise,
  Callout,
  VocabBlock,
  DiagramP_and_ID,
  DiagramSVG,
  InteractivePlot,
  KatexInline,
} from "@/components/lesson";

/**
 * Single source of truth for the MDX render pipeline used at runtime —
 * i.e. anywhere we take an MDX string (from the filesystem or the DB)
 * and want to render it as React elements inside a Server Component.
 *
 * The plugin list must stay aligned with the one in `next.config.mjs`,
 * which handles .mdx files compiled at build time.
 */
export async function renderLessonMDX(
  source: string,
): Promise<{ content: ReactElement }> {
  const { content } = await compileMDX({
    source,
    components: {
      GermanTerm,
      FormulaCard,
      Exercise,
      Callout,
      VocabBlock,
      DiagramP_and_ID,
      DiagramSVG,
      InteractivePlot,
      KatexInline,
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [
          (await import("remark-math")).default,
          (await import("remark-gfm")).default,
        ],
        rehypePlugins: [
          [
            (await import("rehype-katex")).default,
            {
              strict: "ignore",
              trust: true,
              output: "htmlAndMathml",
            },
          ],
        ],
      },
    },
  });
  return { content };
}
