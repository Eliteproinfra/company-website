"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useScrolled";
import { navItems } from "@/lib/data/navigation";
import MobileNavMenu from "./MobileNavMenu";
import NavDropdown from "./NavDropdown";

export default function Navbar() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300",
        scrolled ? "py-[10px]" : "py-[15px]"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/Elite-pro-logo.png"
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
                <NavDropdown item={item} />
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white xl:hidden"
        >
          <i className="fas fa-bars text-xl" aria-hidden="true" />
        </button>
      </div>

      <MobileNavMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
