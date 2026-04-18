"use client";

import { useEffect, useId, useState } from "react";

/**
 * Client-only Mermaid renderer. Loaded via `next/dynamic({ssr: false})`
 * by `diagram-mermaid.tsx`, so this module is never touched during
 * server rendering — and its heavy dependency tree (cytoscape, d3,
 * dagre, …) stays out of the RSC bundle entirely.
 *
 * Three states:
 *   - `svg === null && error === null` → loading (empty div, page-
 *     level skeleton from the parent's dynamic loader handled this)
 *   - `svg !== null` → render the compiled SVG via innerHTML
 *   - `error !== null` → show a diagnostic with the source text
 *
 * `securityLevel: "loose"` is safe because every Mermaid string in
 * this app comes from authored MDX files in the repo, never from
 * user input. Strict mode stripped `<br/>` and a few directives we
 * use in P&ID captions.
 */
export function DiagramMermaidClient({ mermaid }: { mermaid: string }) {
  const id = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import("mermaid");
        const mermaidLib = mod.default ?? mod;
        mermaidLib.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "default",
          fontFamily:
            'var(--font-sans, Inter), system-ui, -apple-system, "Segoe UI", sans-serif',
        });
        const result = await mermaidLib.render(id, mermaid.trim());
        if (!cancelled) setSvg(result.svg);
      } catch (e) {
        console.error("Mermaid render failed:", e);
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Mermaid konnte nicht geladen werden",
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mermaid, id]);

  if (svg) {
    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  }
  if (error) {
    return (
      <div className="w-full text-xs">
        <div className="mb-2 rounded border border-[color:var(--danger)] bg-[color:var(--danger)]/10 p-2 text-[color:var(--danger)]">
          Mermaid-Fehler: {error}
        </div>
        <pre className="whitespace-pre overflow-x-auto rounded bg-[color:var(--muted)] p-2 text-[color:var(--muted-foreground)]">
          {mermaid.trim()}
        </pre>
      </div>
    );
  }
  return (
    <div className="flex h-40 items-center justify-center text-xs text-[color:var(--muted-foreground)]">
      Diagramm wird geladen …
    </div>
  );
}
