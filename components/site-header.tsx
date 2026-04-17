import Link from "next/link";
import { KlausurToggle } from "./klausur-toggle";

/**
 * Minimal top nav. Branding on the left, Klausur-Modus toggle on the
 * right. Kept intentionally sparse — a loud global chrome distracts
 * from the serif lesson body.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="font-sans text-base font-semibold tracking-tight">
          EPT-Kompass
        </Link>
        <div className="flex items-center gap-2">
          <KlausurToggle />
        </div>
      </div>
    </header>
  );
}
