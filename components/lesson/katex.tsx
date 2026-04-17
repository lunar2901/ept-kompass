import katex from "katex";

interface KatexProps {
  expression: string;
  displayMode?: boolean;
}

/**
 * Server-rendered KaTeX. Use for FormulaCard symbols and any non-MDX
 * math label. Inside MDX prose, `$...$` and `$$...$$` delimiters are
 * preferred — those go through remark-math + rehype-katex.
 */
export function KatexInline({ expression, displayMode = false }: KatexProps) {
  const html = katex.renderToString(expression, {
    throwOnError: false,
    displayMode,
    strict: "ignore",
    trust: true,
    output: "htmlAndMathml",
  });
  return (
    <span
      className={displayMode ? "katex-display-wrapper" : "katex-inline-wrapper"}
      // KaTeX output is trusted and hard-coded. Not user-generated at runtime.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
