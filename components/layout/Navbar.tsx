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

export default function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Detail pages start on a white background instead of a dark hero, so they
  // need the opaque navbar — otherwise the white nav links sit on white.
  const solid = SOLID_NAV_SECTIONS.some((section) => pathname.startsWith(`${section}/`));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]" : "bg-transparent",
        scrolled ? "py-[10px]" : "py-[15px]"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src={solid ? "/images/dark-logo.png" : "/images/Elite-pro-logo.png"}
            alt="Elite Pro Infraventure"
            width={180}
            height={50}
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

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Toggle navigation menu"
          className={clsx(
            "inline-flex h-10 w-10 items-center justify-center rounded-md xl:hidden",
            solid ? "text-dark-black" : "text-white"
          )}
        >
          <i className="fas fa-bars text-xl" aria-hidden="true" />
        </button>
      </div>

      <MobileNavMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
