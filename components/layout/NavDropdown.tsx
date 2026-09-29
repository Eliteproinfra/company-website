import clsx from "clsx";
import Link from "next/link";
import type { NavItem } from "@/lib/data/navigation";

/**
 * Live `.nav-link`: white (or `.link-black` #000 once the navbar is solid), no hover
 * colour change - only the 2px gold underline growing to 80%. Dropdowns are Bootstrap's
 * white panel with the live overrides (gold/30 border, 6px radius, 0 10px 30px shadow,
 * gold item text on hover).
 */
const itemClasses =
  "block px-4 py-2 text-sm text-bs-dark transition-colors hover:bg-bs-dropdown-hover hover:text-primary-gold";

const panelClasses =
  "invisible absolute z-20 rounded-md border border-primary-gold/30 bg-white py-2 opacity-0 shadow-dropdown transition-all duration-200";

export default function NavDropdown({ item, solid = false }: { item: NavItem; solid?: boolean }) {
  const triggerClasses = clsx(
    "relative px-3 py-2 text-sm font-medium uppercase tracking-[1px] transition-colors",
    solid ? "text-black" : "text-white"
  );

  if (!item.children) {
    return (
      <Link href={item.href!} className={clsx("group inline-block", triggerClasses)}>
        {item.label}
        <span className="absolute bottom-[5px] left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary-gold transition-all duration-300 group-hover:w-4/5" />
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link href={item.href ?? "#"} className={clsx("inline-flex items-center gap-1.5", triggerClasses)}>
        {item.label}
        <i
          className="fas fa-chevron-down text-[10px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden="true"
        />
        <span className="absolute bottom-[5px] left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary-gold transition-all duration-300 group-hover:w-4/5" />
      </Link>
      <div
        className={clsx(
          panelClasses,
          "left-0 top-full w-72 translate-y-2 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        )}
      >
        {item.children.map((child) =>
          child.children ? (
            <div key={child.href} className="group/sub relative">
              <Link
                href={child.href}
                className={clsx(itemClasses, "flex items-center justify-between gap-2")}
              >
                {child.label}
                <i className="fas fa-chevron-right text-[10px]" aria-hidden="true" />
              </Link>
              <div
                className={clsx(
                  panelClasses,
                  "left-full top-[-7px] z-30 w-64 group-hover/sub:visible group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:opacity-100"
                )}
              >
                {child.children.map((leaf) => (
                  <Link key={leaf.href} href={leaf.href} className={itemClasses}>
                    {leaf.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={child.href} href={child.href} className={itemClasses}>
              {child.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
