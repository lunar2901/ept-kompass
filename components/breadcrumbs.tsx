import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Simple breadcrumb trail. The last item is styled as the current page
 * (no link). Intermediate items are clickable.
 *
 *   Home › Track B › Thermodynamik I › Kap. 1 › System und Umgebung
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-[color:var(--muted-foreground)]"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  className="size-3 text-[color:var(--muted-foreground)]/60"
                  aria-hidden
                />
              )}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="hover:text-[color:var(--foreground)] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    last && "font-semibold text-[color:var(--foreground)]",
                  )}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
