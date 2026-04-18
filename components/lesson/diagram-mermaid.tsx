"use client";

import dynamic from "next/dynamic";
import type { DiagramP_and_IDProps } from "../lesson-components";

/**
 * Server-safe wrapper. The actual Mermaid rendering happens in a
 * client-only module loaded via `next/dynamic` with `ssr: false`
 * — this guarantees the raw Mermaid source never lands in the
 * initial HTML (it would have shown as a code block on the page
 * until hydration completed, and it persisted forever on any
 * prod build where the client bundle failed to load Mermaid).
 *
 * While the client bundle is loading we show a low-noise skeleton
 * placeholder with the German caption, so the page layout doesn't
 * shift and the student sees the caption immediately. If Mermaid
 * fails at runtime, the inner component shows an error banner +
 * the raw source so it can still be diagnosed.
 */
const DiagramMermaidClient = dynamic(
  () => import("./diagram-mermaid-client").then((m) => m.DiagramMermaidClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center text-xs text-[color:var(--muted-foreground)]">
        Diagramm wird geladen …
      </div>
    ),
  },
);

export function DiagramP_and_ID(props: DiagramP_and_IDProps) {
  return (
    <figure className="my-6 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div
        className="mermaid flex justify-center overflow-x-auto"
        aria-label={props.caption_en}
      >
        <DiagramMermaidClient mermaid={props.mermaid} />
      </div>
      <figcaption className="mt-3 text-sm">
        <div className="font-serif italic">{props.caption_de}</div>
        <div className="text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {props.caption_en}
        </div>
      </figcaption>
    </figure>
  );
}
