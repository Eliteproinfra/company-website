"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

/**
 * Live `.footer-copyright`: `border-top border-secondary border-opacity-10 bg-black` with white
 * text on inner pages; on the home page `body.index-page` overrides it to #f5f5f5 with a #e0e0e0
 * top border and #333 text/links.
 */
export default function FooterCopyright() {
  const isHome = usePathname() === "/";

  return (
    <div
      className={clsx(
        "relative z-[1] border-t py-4 text-sm",
        isHome
          ? "border-copyright-border bg-copyright-bg text-muted-5"
          : "border-bs-secondary/10 bg-black text-white"
      )}
    >
      <div className="container flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <p>&copy; {new Date().getFullYear()} Elite Pro Infraventure. All rights reserved.</p>
        <ul className="flex items-center gap-6">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx("transition-colors", isHome ? "text-muted-5" : "hover:text-white")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
