import type { CalloutProps } from "../lesson-components";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  GraduationCap,
  TriangleAlert,
  Info,
  BookOpenText,
} from "lucide-react";

const CONFIG: Record<
  CalloutProps["variant"],
  {
    icon: typeof Lightbulb;
    label: string;
    border: string;
    bg: string;
    iconColor: string;
  }
> = {
  intuition: {
    icon: Lightbulb,
    label: "Intuition",
    border: "border-[color:var(--accent)]",
    bg: "bg-[color:var(--accent-muted)]",
    iconColor: "text-[color:var(--accent)]",
  },
  "exam-tip": {
    icon: GraduationCap,
    label: "Klausur-Tipp",
    border: "border-[color:var(--warn)]",
    bg: "bg-[color:var(--chip-bg)]",
    iconColor: "text-[color:var(--warn)]",
  },
  warning: {
    icon: TriangleAlert,
    label: "Achtung",
    border: "border-[color:var(--danger)]",
    bg: "bg-[color:var(--danger)]/10",
    iconColor: "text-[color:var(--danger)]",
  },
  note: {
    icon: Info,
    label: "Hinweis",
    border: "border-[color:var(--border)]",
    bg: "bg-[color:var(--muted)]",
    iconColor: "text-[color:var(--muted-foreground)]",
  },
  historical: {
    icon: BookOpenText,
    label: "Historisch",
    border: "border-[color:var(--border)]",
    bg: "bg-[color:var(--muted)]",
    iconColor: "text-[color:var(--muted-foreground)]",
  },
};

export function Callout({ variant, title, children }: CalloutProps) {
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;
  return (
    <aside
      className={cn(
        "my-6 rounded-lg border-l-4 p-4 pl-5",
        cfg.border,
        cfg.bg,
      )}
      role="note"
    >
      <div className="flex items-center gap-2 mb-2 font-sans text-sm font-semibold uppercase tracking-wide">
        <Icon className={cn("size-4", cfg.iconColor)} aria-hidden />
        <span>{title ?? cfg.label}</span>
      </div>
      <div className="lesson-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
