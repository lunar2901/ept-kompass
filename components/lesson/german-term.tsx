"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import type { GermanTermProps } from "../lesson-components";

/**
 * Inline GermanTerm pill. Clicking opens a Radix popover with the
 * full glossary row: article, plural, IPA, English equivalent.
 *
 * Styling is in globals.css under `.german-term-chip` (not Tailwind
 * arbitrary values) so a future CSS-pipeline change can't silently
 * drop the chip visual. The Klausur-Modus CSS variant collapses
 * the pill to plain dotted-underlined text — same behaviour, exam
 * appearance.
 */
export function GermanTerm({
  de,
  en,
  article,
  plural,
  ipa,
  termId,
}: GermanTermProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="german-term-chip"
          aria-label={`Deutsches Fachwort: ${article ? article + " " : ""}${de}. Englisch: ${en}. Klicken für Details.`}
          data-de={de}
          data-en={en}
        >
          {article && <span className="german-term-article">{article}</span>}
          <span className="german-term-word">{de}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 max-w-sm rounded-lg border p-4 shadow-lg bg-[color:var(--card)] text-[color:var(--card-foreground)] border-[color:var(--border)]"
          sideOffset={6}
          collisionPadding={12}
        >
          <div className="space-y-1.5 text-sm">
            <div className="font-serif text-base font-semibold">
              {article ? `${article} ${de}` : de}
            </div>
            {plural && (
              <div className="text-[color:var(--muted-foreground)]">
                Plural: <span className="font-medium">{plural}</span>
              </div>
            )}
            {ipa && (
              <div className="text-[color:var(--muted-foreground)] font-mono">
                {ipa}
              </div>
            )}
            <div className="pt-1">
              <span className="text-[color:var(--muted-foreground)]">
                EN:{" "}
              </span>
              <span className="font-medium">{en}</span>
            </div>
            {termId && (
              <a
                href={`/glossar/${termId}`}
                className="mt-2 inline-block text-xs text-[color:var(--accent)] hover:underline"
              >
                Mehr im Glossar →
              </a>
            )}
          </div>
          <Popover.Arrow className="fill-[color:var(--card)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
