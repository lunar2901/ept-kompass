"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { DiagramP_and_IDProps } from "../lesson-components";

/**
 * Renders a Mermaid diagram client-side. Mermaid is dynamically imported
 * so it does not bloat the initial JS. Falls back to code text if Mermaid
 * fails to load or parse (e.g. offline PWA with an unknown diagram type).
 */
export function DiagramP_and_ID({
  mermaid,
  caption_de,
  caption_en,
}: DiagramP_and_IDProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = (await import("mermaid")).default;
        m.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "default",
          fontFamily:
            "var(--font-sans, Inter), system-ui, -apple-system, sans-serif",
        });
        const { svg } = await m.render(`mermaid-${id}`, mermaid.trim());
        if (!cancelled) setSvg(svg);
      } catch (e) {
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

  return (
    <figure className="my-6 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div
        ref={ref}
        className="mermaid flex justify-center overflow-x-auto"
        aria-label={caption_en}
      >
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : error ? (
          <pre className="text-xs text-[color:var(--danger)]">{error}</pre>
        ) : (
          <pre className="text-xs text-[color:var(--muted-foreground)] whitespace-pre">
            {mermaid.trim()}
          </pre>
        )}
      </div>
      <figcaption className="mt-3 text-sm">
        <div className="font-serif italic">{caption_de}</div>
        <div className="text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {caption_en}
        </div>
      </figcaption>
    </figure>
  );
}
