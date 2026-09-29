"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { navItems } from "@/lib/data/navigation";

type MobileNavMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Live mobile `.navbar-collapse` (<= 991.98px): slides in from the LEFT, width
 * min(86vw, 380px), background linear-gradient(180deg, #0b1220, #070c16), shadow
 * 0 18px 50px rgba(0,0,0,.45); links rgba(255,255,255,.92) -> white on rgba(255,255,255,.08);
 * nested dropdowns rgba(255,255,255,.06) with rgba(255,255,255,.10) border, 14px radius;
 * backdrop rgba(0,0,0,.55).
 */
const linkClasses =
  "rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-wide text-white/[0.92] transition-colors hover:bg-white/[0.08] hover:text-white";

const itemClasses =
  "block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/[0.08] hover:text-white";

export default function MobileNavMenu({ open, onClose }: MobileNavMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/55 transition-opacity duration-300 xl:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[min(86vw,380px)] flex-col gap-1 overflow-y-auto bg-linear-to-b from-drawer-start to-drawer-end px-4 pb-[22px] pt-4 shadow-drawer transition-transform duration-300 xl:hidden",
          open ? "translate-x-0" : "-translate-x-[105%]"
        )}
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="min-w-0">
            <p className="truncate text-base font-black leading-tight text-white">Elite Pro Infra</p>
            <p className="truncate text-[0.82rem] font-semibold text-white/65">Premium Real Estate</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] text-white/[0.92]"
          >
            <i className="fas fa-xmark text-xl" aria-hidden="true" />
          </button>
        </div>
        {navItems.map((item) => {
          if (!item.children) {
            return (
              <Link key={item.label} href={item.href!} onClick={onClose} className={linkClasses}>
                {item.label}
              </Link>
            );
          }

          const isExpanded = expanded === item.label;

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : item.label)}
                aria-expanded={isExpanded}
                className={clsx(linkClasses, "flex w-full items-center justify-between")}
              >
                {item.label}
                <i
                  className={clsx(
                    "fas fa-chevron-down text-xs transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                className={clsx(
                  "grid overflow-hidden transition-all duration-300",
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0">
                  <div className="mt-1.5 rounded-[14px] border border-white/10 bg-white/[0.06] p-2">
                    {item.children.map((child) => (
                      <div key={child.href}>
                        <Link href={child.href} onClick={onClose} className={itemClasses}>
                          {child.label}
                        </Link>
                        {/* Nested group (About -> Our Management) stays expanded on mobile. */}
                        {child.children ? (
                          <div className="ml-2.5 mt-2 rounded-[14px] border border-white/[0.12] bg-white/[0.06] p-2">
                            {child.children.map((leaf) => (
                              <Link
                                key={leaf.href}
                                href={leaf.href}
                                onClick={onClose}
                                className={itemClasses}
                              >
                                {leaf.label}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <Button href="/contact" onClick={onClose} className="mt-4 w-full rounded-[14px]">
          Contact Us
        </Button>
      </div>
    </>
  );
}
