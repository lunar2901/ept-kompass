"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import type { GermanTermProps } from "../lesson-components";
import { cn } from "@/lib/utils";

/**
 * Inline clickable chip showing a German term in an English sentence.
 * Clicking opens a popover with article, plural, English equivalent, IPA.
 *
 * When a full glossary browser ships, the "mehr im Glossar" link becomes a
 * real route. For now it is inert.
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
  const display = article ? `${article} ${de}` : de;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline px-1.5 py-0 rounded-sm border align-baseline cursor-pointer",
            "border-[color:var(--chip-border)] bg-[color:var(--chip-bg)] text-[color:var(--chip-fg)]",
            "font-medium text-[0.95em] leading-[inherit]",
            "hover:brightness-105 focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]",
            "klausur-hide-en:text-[color:var(--foreground)] klausur-hide-en:bg-transparent klausur-hide-en:border-transparent klausur-hide-en:px-0",
          )}
          aria-label={`German term: ${display}. English: ${en}. Click for details.`}
          data-de={de}
          data-en={en}
        >
          {de}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            "z-50 max-w-sm rounded-lg border p-4 shadow-lg",
            "bg-[color:var(--card)] text-[color:var(--card-foreground)] border-[color:var(--border)]",
          )}
          sideOffset={6}
          collisionPadding={12}
        >
          <div className="space-y-1.5 text-sm">
            <div className="font-serif text-base font-semibold">{display}</div>
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
              <span className="text-[color:var(--muted-foreground)]">EN: </span>
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
