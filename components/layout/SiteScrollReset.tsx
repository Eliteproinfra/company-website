"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Sends the public site back to the top whenever the page changes.
 *
 * Next's App Router only scrolls on navigation when the new page's top is out
 * of view, so going from halfway down one page to another navbar tab often
 * left the visitor mid-page. This forces a reset on every forward navigation.
 *
 * Left alone on purpose:
 * - Back/Forward (popstate): the browser restores where the visitor was.
 * - Links with a #hash: those mean to land on a section, not the top.
 * - The first load: the browser already handles it.
 * - Query-string changes (property filters): keyed on the path only, so
 *   changing a filter does not jump the results list.
 */
export default function SiteScrollReset() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryNav = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNav.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isHistoryNav.current) {
      isHistoryNav.current = false;
      return;
    }
    if (window.location.hash) return;

    // `instant`, not the site's smooth default: a new page should open at the
    // top, not animate up after it has painted.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
