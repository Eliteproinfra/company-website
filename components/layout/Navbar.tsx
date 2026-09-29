"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useScrolled";
import { navItems } from "@/lib/data/navigation";
import MobileNavMenu from "./MobileNavMenu";
import NavDropdown from "./NavDropdown";

const SOLID_NAV_SECTIONS = ["/properties", "/media-press", "/insights-blog", "/news-updates"];

/**
 * Live `.navbar.fixed-top`: transparent with a 1px rgba(255,255,255,.1) bottom border and
 * 15px padding at the top of the page; once `scrollY > 50` the script adds `.scrolled`
 * (rgb(255 255 255 / 95%) background, 0 4px 20px rgba(0,0,0,.1) shadow, 10px padding),
 * turns the links black and swaps in the dark logo.
 */
export default function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detail pages start on a white background instead of a dark hero, so they
  // need the opaque navbar from the start - otherwise the white nav links sit on white.
  const solid =
    scrolled || SOLID_NAV_SECTIONS.some((section) => pathname.startsWith(`${section}/`));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "bg-white/95 shadow-nav" : "border-b border-white/10 bg-transparent",
        scrolled ? "py-[10px]" : "py-[15px]"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="shrink-0">
          {/* width/height are each file's intrinsic size, not a nominal box: the
              two logos have different aspect ratios (845x249 vs 252x81), and the
              CSS sizes by height with `w-auto`. A shared nominal pair would make
              the computed width disagree with the prop on both. */}
          <Image
            src={solid ? "/images/dark-logo.png" : "/images/Elite-pro-logo.png"}
            alt="Elite Pro Infraventure"
            width={solid ? 252 : 845}
            height={solid ? 81 : 249}
            preload
            className="h-10 w-auto md:h-11 xl:h-[50px]"
          />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavDropdown item={item} solid={solid} />
              </li>
            ))}
            <li className="ml-2">
              <Button href="/contact" size="sm">
                Contact Us
              </Button>
            </li>
          </ul>
        </nav>

        {/* Live `.mobile-nav-toggle`: rgba(255,255,255,.28) border, 12px radius, white icon;
            `.navbar.scrolled` -> rgba(17,24,39,.18) border, rgba(255,255,255,.85) fill, #111827 icon. */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Toggle navigation menu"
          className={clsx(
            "inline-flex items-center justify-center rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:shadow-input-focus xl:hidden",
            solid ? "border-ink/[0.18] bg-white/85 text-ink" : "border-white/[0.28] text-white"
          )}
        >
          <i className="fas fa-bars text-[1.1rem]" aria-hidden="true" />
        </button>
      </div>

      <MobileNavMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
