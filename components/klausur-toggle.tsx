"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "ept.klausur-mode";
const CLASS_NAME = "klausur-mode";

/**
 * Klausur-Modus toggle. Adds/removes `.klausur-mode` on the <html> element,
 * which hides every English translation tagged with the `klausur-hide-en`
 * variant. The setting persists across page loads via localStorage so a
 * student mid-revision doesn't keep re-enabling it.
 *
 * Keyboard shortcut `k` toggles from anywhere in the document.
 */
export function KlausurToggle() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) === "1";
    setActive(saved);
    document.documentElement.classList.toggle(CLASS_NAME, saved);

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (e.key === "k" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains(CLASS_NAME);
    document.documentElement.classList.toggle(CLASS_NAME, next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    setActive(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-sm",
        "border-[color:var(--border)] bg-[color:var(--card)]",
        active &&
          "border-[color:var(--accent)] bg-[color:var(--accent-muted)] text-[color:var(--accent)]",
      )}
      title="Klausur-Modus: Englisch ausblenden (Tastenkürzel: k)"
      aria-pressed={active}
    >
      {active ? (
        <EyeOff className="size-3.5" aria-hidden />
      ) : (
        <Eye className="size-3.5" aria-hidden />
      )}
      Klausur-Modus
    </button>
  );
}
