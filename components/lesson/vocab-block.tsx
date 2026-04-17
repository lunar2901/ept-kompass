import type { VocabBlockProps, VocabEntry } from "../lesson-components";
import { cn } from "@/lib/utils";
import yaml from "yaml";
import type { ReactNode } from "react";

/**
 * Collapsed-by-default card listing the Schlüsselbegriffe for a lesson.
 *
 * Accepts either:
 *   - explicit `entries` prop, OR
 *   - a single Markdown list child where each top-level item is a
 *     YAML-style entry (as written in the reference MDX).
 *
 * The reference lesson syntax is:
 *
 *   <VocabBlock>
 *     - term: das System
 *       en: system
 *       ipa: /zʏsˈteːm/
 *       ...
 *   </VocabBlock>
 *
 * After MDX compiles that list, `children` contains a <ul> of <li>'s
 * whose text runs look like `term: das System\nen: system\n...`. We
 * parse that text via the `yaml` package — the result matches VocabEntry.
 */
export function VocabBlock({ entries, children }: VocabBlockProps) {
  const items = entries ?? extractEntriesFromChildren(children);
  if (!items || items.length === 0) return null;

  return (
    <details
      className="my-6 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-0 overflow-hidden"
      open
    >
      <summary className="cursor-pointer list-none select-none px-4 py-3 font-sans text-sm font-semibold uppercase tracking-wide border-b border-[color:var(--border)] bg-[color:var(--muted)]">
        Schlüsselbegriffe — {items.length} Fachbegriffe
      </summary>
      <ul className="divide-y divide-[color:var(--border)]">
        {items.map((e, i) => (
          <li key={i} className="px-4 py-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-base font-semibold">
                {e.term}
              </span>
              <span className="text-sm text-[color:var(--muted-foreground)]">
                {e.en}
              </span>
              {e.ipa && (
                <span className="font-mono text-xs text-[color:var(--muted-foreground)]">
                  {e.ipa}
                </span>
              )}
              {e.plural && (
                <span className="text-xs text-[color:var(--muted-foreground)]">
                  pl. {e.plural}
                </span>
              )}
            </div>
            {(e.example_de || e.example_en) && (
              <div className="mt-1.5 space-y-0.5 text-sm">
                {e.example_de && (
                  <div className="font-serif italic">„{e.example_de}"</div>
                )}
                {e.example_en && (
                  <div className="text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                    {e.example_en}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * Extract VocabEntry[] from MDX children where the user wrote a Markdown
 * list with YAML-style lines per item. We walk the React tree and gather
 * text from each <li>, then pass each blob through `yaml.parse`.
 */
function extractEntriesFromChildren(children: ReactNode): VocabEntry[] {
  const texts = collectListItemTexts(children);
  const entries: VocabEntry[] = [];
  for (const t of texts) {
    try {
      const parsed = yaml.parse(t) as Partial<VocabEntry> | null;
      if (parsed && typeof parsed === "object" && parsed.term && parsed.en) {
        entries.push(parsed as VocabEntry);
      }
    } catch {
      // Skip un-parseable items silently — lesson authors get a visible
      // fallback (blank row) instead of a crashed page.
    }
  }
  return entries;
}

function collectListItemTexts(node: ReactNode): string[] {
  const out: string[] = [];
  visit(node, out);
  return out;
}

function visit(node: ReactNode, out: string[]) {
  if (node == null || typeof node === "boolean") return;
  if (typeof node === "string" || typeof node === "number") return;
  if (Array.isArray(node)) {
    for (const c of node) visit(c, out);
    return;
  }
  if (typeof node === "object" && "props" in node) {
    const el = node as { type?: unknown; props?: { children?: ReactNode } };
    if (el.type === "li") {
      const text = flatten(el.props?.children);
      if (text.trim()) out.push(text);
      return;
    }
    visit(el.props?.children, out);
  }
}

function flatten(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as { props?: { children?: ReactNode } };
    return flatten(el.props?.children) + "\n";
  }
  return "";
}
