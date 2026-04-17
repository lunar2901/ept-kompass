import type { FormulaCardProps } from "../lesson-components";
import { cn } from "@/lib/utils";
import { KatexInline } from "./katex";

/**
 * Bordered card displaying a named formula with bilingual variable legend.
 * LaTeX is rendered server-side via KaTeX. The "why" MDX children render
 * below the legend.
 */
export function FormulaCard({
  name_de,
  name_en,
  latex,
  variables,
  children,
}: FormulaCardProps) {
  return (
    <section
      className={cn(
        "my-6 rounded-lg border p-5",
        "border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]",
      )}
    >
      <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h4 className="font-sans text-base font-semibold">{name_de}</h4>
        <span className="text-sm text-[color:var(--muted-foreground)]">
          {name_en}
        </span>
      </header>

      {latex && (
        <div className="my-3 overflow-x-auto text-center">
          <KatexInline expression={latex} displayMode />
        </div>
      )}

      {variables && variables.length > 0 && (
        <div className="my-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[color:var(--muted-foreground)]">
                <th className="py-1 pr-3 font-medium">Symbol</th>
                <th className="py-1 pr-3 font-medium">Deutsch</th>
                <th className="py-1 pr-3 font-medium">English</th>
                <th className="py-1 pr-3 font-medium">Einheit</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((v) => (
                <tr
                  key={v.symbol}
                  className="border-t border-[color:var(--border)]"
                >
                  <td className="py-1.5 pr-3 align-top">
                    <KatexInline expression={v.symbol} />
                  </td>
                  <td className="py-1.5 pr-3 align-top">{v.name_de}</td>
                  <td className="py-1.5 pr-3 align-top text-[color:var(--muted-foreground)]">
                    {v.name_en}
                  </td>
                  <td className="py-1.5 pr-3 align-top font-mono text-xs">
                    {v.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {children && (
        <div className="lesson-body mt-2 text-[0.95rem] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  );
}
