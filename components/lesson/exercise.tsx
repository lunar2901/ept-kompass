import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import type { ExerciseProps, CommonMistake } from "../lesson-components";
import { ExerciseShell } from "./exercise-shell";

/**
 * Async RSC wrapper. Pre-compiles every MDX string in the exercise
 * payload on the server so the client bundle never ships an MDX compiler.
 * The inner <ExerciseShell> is a client component that handles the form,
 * the hint toggle, and the result-panel tabs.
 */
export async function Exercise(props: ExerciseProps) {
  const solution = await compile(props.solution_mdx);
  const discussion = await compile(props.discussion_mdx);
  const mistakes = await Promise.all(
    props.common_mistakes.map(async (m: CommonMistake) => ({
      wrong: m.wrong,
      why: await compile(m.why_en),
    })),
  );

  return (
    <ExerciseShell
      payload={props}
      solutionEl={solution}
      discussionEl={discussion}
      mistakes={mistakes}
    />
  );
}

async function compile(source: string | undefined) {
  const src = (source ?? "").trim();
  if (!src) return null;
  const { content } = await compileMDX({
    source: src,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [
          [
            rehypeKatex,
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
  return content;
}
