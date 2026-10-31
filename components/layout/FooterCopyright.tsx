"use client";

import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const reraRegistrations = [
  { authority: "HARERA Gurugram", number: "RC/HARERA/GGM/1770/1365/2022/138" },
  { authority: "UP RERA", number: "UPRERAAGT24781" },
  { authority: "Delhi RERA", number: "DLRERA2026A0008" },
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
      <div
        className={clsx(
          "container mb-4 flex flex-col items-center gap-3 border-b pb-4",
          isHome ? "border-copyright-border" : "border-white/10"
        )}
      >
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-primary-gold">
          <i className="fas fa-shield-halved" aria-hidden="true" />
          RERA Registered
        </p>
        <ul className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          {reraRegistrations.map((rera) => (
            <li
              key={rera.number}
              className={clsx(
                "inline-flex items-center overflow-hidden rounded-xl border text-xs sm:rounded-full",
                isHome ? "border-primary-gold/40 bg-white" : "border-primary-gold/30 bg-white/5"
              )}
            >
              <span className="self-stretch whitespace-nowrap bg-gold-gradient px-3 py-1.5 font-bold uppercase tracking-wide text-ink">
                {rera.authority}
              </span>
              {/* <wbr> after each "/" so a narrow phone wraps the long HARERA number between segments. */}
              <span className="min-w-0 px-3 py-1.5 font-semibold sm:whitespace-nowrap sm:tracking-wide">
                {rera.number.split("/").map((segment, i, segments) => (
                  <Fragment key={i}>
                    {segment}
                    {i < segments.length - 1 ? (
                      <>
                        /<wbr />
                      </>
                    ) : null}
                  </Fragment>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="container flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <p>&copy; {new Date().getFullYear()} ElitePro Infra. All rights reserved.</p>
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
