import Link from "next/link";
import type { NavItem } from "@/lib/data/navigation";

export default function NavDropdown({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className="group relative inline-block rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10"
      >
        {item.label}
        <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary-gold transition-all duration-300 group-hover:w-4/5" />
      </Link>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={item.href ?? "#"}
        className="relative inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10"
      >
        {item.label}
        <i
          className="fas fa-chevron-down text-[10px] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden="true"
        />
        <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-primary-gold transition-all duration-300 group-hover:w-4/5" />
      </Link>
      <div className="invisible absolute left-0 top-full z-20 w-72 translate-y-2 rounded-xl border border-white/10 bg-dark-black/95 p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {item.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="block rounded-lg px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-primary-gold"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
