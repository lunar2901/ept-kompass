import nextMDX from "@next/mdx";

/**
 * Next 16 + Turbopack requires MDX plugin options to be serialisable —
 * pass plugin IDs as strings, not imported functions. The runtime lesson
 * renderer (compileMDX from next-mdx-remote/rsc) is configured separately
 * inside components/lesson/exercise.tsx and lib/mdx.ts so keep the two
 * plugin lists aligned if you change either.
 */
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-math"], ["remark-gfm"]],
    rehypePlugins: [
      [
        "rehype-katex",
        {
          strict: "ignore",
          trust: true,
          output: "htmlAndMathml",
        },
      ],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
