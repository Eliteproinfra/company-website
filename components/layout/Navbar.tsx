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

const PHONE_HREF = "tel:+919968686868";
const PHONE_LABEL = "+91 9968686868";

const SOLID_NAV_SECTIONS =["/properties", "/media-press", "/insights-blog", "/news-updates"];

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
              the computed width disagree with the prop on both.

              `sizes` is what stops those intrinsic numbers becoming a download
              size. The image docs are explicit that it is needed when CSS makes
              an image responsive, and without it Next derives the srcset from
              `width` alone — so the light logo asked for w=1080 at 1x and
              w=1920 at 2x, i.e. the whole 17KB source file, to paint a mark
              136-170px wide. And because this one is preloaded, that download
              competes with the real LCP on every page of the site. The widths
              below are the rendered ones: h-10 -> 40px tall -> 40 x 845/249 =
              136px, h-11 -> 149px, h-[50px] -> 170px. The browser now picks a
              256px or 384px rendition (4.7KB / 7.3KB). */}
          <Image
            src={solid ? "/images/dark-logo.png" : "/images/Elite-pro-logo.png"}
            alt="ElitePro Infra"
            width={solid ? 252 : 845}
            height={solid ? 81 : 249}
            sizes="(min-width: 1280px) 170px, (min-width: 768px) 150px, 136px"
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
            <li className="ml-2">
              {/* At 1280px the number would wrap Media & Insights / NRI Corner onto two lines. */}
              <PhoneLink solid={solid} numberClassName="hidden min-[1400px]:flex" />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3 xl:hidden">
          <PhoneLink solid={solid} />
          {/* Live `.mobile-nav-toggle`: rgba(255,255,255,.28) border, 12px radius, white icon;
              `.navbar.scrolled` -> rgba(17,24,39,.18) border, rgba(255,255,255,.85) fill, #111827 icon. */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
            className={clsx(
              "inline-flex items-center justify-center rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:shadow-input-focus",
              solid ? "border-ink/[0.18] bg-white/85 text-ink" : "border-white/[0.28] text-white"
            )}
          >
            <i className="fas fa-bars text-[1.1rem]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileNavMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

/**
 * Pill with a pulsing gold call badge and a "Call Us" caption over the number: frosted glass
 * over the transparent hero, a gold-tinted outline once the navbar turns solid. By default the
 * caption + number hide below `sm` (badge only) to leave room for the logo.
 */
function PhoneLink({
  solid,
  numberClassName = "hidden sm:flex",
}: {
  solid: boolean;
  numberClassName?: string;
}) {
  return (
    <a
      href={PHONE_HREF}
      aria-label={`Call us on ${PHONE_LABEL}`}
      className={clsx(
        "group inline-flex items-center gap-2 rounded-full border p-1 whitespace-nowrap transition-all duration-300 hover:-translate-y-px hover:border-primary-gold hover:shadow-[0_6px_20px_rgba(212,175,55,0.35)]",
        solid
          ? "border-primary-gold/40 bg-gold-tint text-black"
          : "border-white/25 bg-white/10 text-white backdrop-blur-md"
      )}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 animate-ping rounded-full bg-primary-gold/50 [animation-duration:2s] motion-reduce:hidden"
          aria-hidden="true"
        />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#f3d77a] via-primary-gold to-[#a8841f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <i
            className="fas fa-phone-volume text-[0.9rem] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
            aria-hidden="true"
          />
        </span>
      </span>
      <span className={clsx(numberClassName, "flex-col pr-3 leading-tight")}>
        <span className="text-[0.62rem] font-bold uppercase tracking-[2px] text-primary-gold">
          Call Us
        </span>
        <span className="text-sm font-bold tracking-wide">{PHONE_LABEL}</span>
      </span>
    </a>
  );
}
