import type { DiagramSVGProps } from "../lesson-components";

/**
 * Static SVG diagram from `/public/diagrams/...`. Use for P&IDs or
 * hand-drawn figures that Mermaid can't express.
 */
export function DiagramSVG({ src, caption_de, caption_en, alt }: DiagramSVGProps) {
  return (
    <figure className="my-6 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="flex justify-center overflow-x-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto"
          loading="lazy"
          decoding="async"
        />
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
