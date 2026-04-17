"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { KlausurToggle } from "./klausur-toggle";
import { cn } from "@/lib/utils";

/**
 * Top nav. Menu button (mobile only) opens the curriculum sidebar;
 * brand link on the left; Klausur-Modus toggle on the right.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70">
      <div className="flex items-center justify-between gap-3 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("ept:open-sidebar"))}
            className={cn(
              "inline-flex items-center rounded p-1.5 text-sm lg:hidden",
              "hover:bg-[color:var(--muted)]",
            )}
            aria-label="Curriculum-Menü öffnen"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <Link
            href="/"
            className="font-sans text-base font-semibold tracking-tight"
          >
            EPT-Kompass
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <KlausurToggle />
        </div>
      </div>
    </header>
  );
}
