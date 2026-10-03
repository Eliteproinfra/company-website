"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  /** Match the path exactly. Only Dashboard needs it: every other href is a
   *  prefix of its own detail pages, but "/admin" is a prefix of all of them. */
  exact?: boolean;
};

/**
 * The admin sidebar and mobile nav. A Client Component because marking the
 * current section needs the live URL, which a Server Component layout cannot
 * see — layouts are not given `searchParams` at all.
 *
 * The query string matters here, not just the path: PR & Media, Insights &
 * Blogs and News & Updates are one route (/admin/articles) distinguished only
 * by `?kind=`, so matching on pathname alone would light up all three at once.
 */
function useActiveMatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (href: string, exact?: boolean) => {
    const [path, query] = href.split("?");
    const wantedKind = query ? new URLSearchParams(query).get("kind") : null;

    if (exact) return pathname === path;

    if (wantedKind) {
      const currentKind = searchParams.get("kind");
      // The list page with no ?kind= falls back to "press" (normalizeKind), so
      // mirror that or PR & Media would look inactive on its own default view.
      if (pathname === path) return (currentKind ?? "press") === wantedKind;
      // On a detail page (/admin/articles/42) the kind is only knowable when the
      // link carried it. Without it, highlight nothing rather than guess wrong.
      if (pathname.startsWith(`${path}/`)) return currentKind === wantedKind;
      return false;
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };
}

export function AdminSidebarNav({ items }: { items: AdminNavItem[] }) {
  const isActive = useActiveMatcher();

  return (
    <nav className="flex-1 space-y-1 p-4" aria-label="Admin sections">
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary-gold/15 font-semibold text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <i
              className={clsx(item.icon, "w-4", active ? "text-primary-gold" : "text-primary-gold/70")}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav({ items }: { items: AdminNavItem[] }) {
  const isActive = useActiveMatcher();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-t border-neutral-200 bg-white p-2 lg:hidden"
      aria-label="Admin sections"
    >
      {items.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold",
              active ? "bg-dark-black text-white" : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
