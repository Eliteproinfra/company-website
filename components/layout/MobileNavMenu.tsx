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
          "fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col gap-1 overflow-y-auto bg-dark-black p-6 shadow-2xl transition-transform duration-300 xl:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="mb-4 ml-auto flex h-10 w-10 items-center justify-center rounded-md text-white"
        >
          <i className="fas fa-xmark text-xl" aria-hidden="true" />
        </button>
        {navItems.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.label}
                href={item.href!}
                onClick={onClose}
                className="rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-white/10"
              >
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
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-white/10"
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
                  {item.children.map((child) => (
                    <div key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="block rounded-md py-2.5 pl-6 text-sm text-white/70 hover:bg-white/10 hover:text-primary-gold"
                      >
                        {child.label}
                      </Link>
                      {/* Nested group (About → Our Management) stays expanded on mobile. */}
                      {child.children?.map((leaf) => (
                        <Link
                          key={leaf.href}
                          href={leaf.href}
                          onClick={onClose}
                          className="block rounded-md py-2 pl-10 text-sm text-white/60 hover:bg-white/10 hover:text-primary-gold"
                        >
                          {leaf.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <Button href="/contact" onClick={onClose} className="mt-4 justify-center">
          Contact Us
        </Button>
      </div>
    </>
  );
}
