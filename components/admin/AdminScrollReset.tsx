"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Scrolls the admin's content pane back to the top on navigation.
 *
 * The admin shell is viewport-height with `<main>` as the only scrollable
 * element, so the document never scrolls and Next's own scroll restoration —
 * which acts on the window — has nothing to reset. Without this, going from
 * halfway down the properties list into a listing opens the form already
 * scrolled past the Basics section.
 *
 * Keyed on the query string as well as the path because the three article
 * sections are one route distinguished only by `?kind=`, the same reason
 * AdminNav watches it.
 */
export default function AdminScrollReset({ targetId }: { targetId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pane = document.getElementById(targetId);
    // `instant`, not the page's smooth default: a navigation should land at the
    // top, not animate there after the new content has already painted.
    pane?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, searchParams, targetId]);

  return null;
}
