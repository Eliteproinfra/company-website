/**
 * Next 16 renamed the `middleware` file convention to `proxy` — this is that
 * file, not a legacy middleware.ts.
 *
 * Cheap gate only. The docs are explicit that proxy runs separately from render
 * code and must not rely on shared modules, so it deliberately does NOT hit the
 * database. It does two things, neither of which needs one: bounce anyone with
 * no session cookie away from /admin, and repair a detail URL whose slug cannot
 * be routed. The authoritative auth check (is the token real, unexpired, and
 * the user active?) happens in app/admin/layout.tsx, which can query MySQL.
 *
 * Treat this as a redirect convenience, never as the security boundary.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sanitizeSlug } from "@/lib/slug";

const SESSION_COOKIE = "elite_admin_session";

/**
 * Detail sections whose last path segment is a CMS slug.
 *
 * Why the repair has to happen here and not in the page: a segment containing
 * a space never reaches the page at all. /properties/M3M-CFC-Sector%20113-
 * Gurugram was a published listing, but the router rejects the decoded space
 * before any component runs, so notFound() was not even ours to intercept —
 * the request just 404'd. The proxy is the first and only place that sees it.
 *
 * Verified against the running server, not assumed: %2D in a slug resolves
 * fine, %20 does not.
 */
const SLUG_SECTIONS = ["/properties", "/media-press", "/insights-blog", "/news-updates"];

/**
 * The routable spelling of `pathname`, or null when it is already fine.
 *
 * Unlike the page-level rescue this cannot check that the target exists — no
 * database here — so it is a pure normalisation, in the same spirit as the
 * trailing-slash redirect. An unknown slug still 404s, just at its tidied
 * address. Returning null unless something actually changed is what keeps this
 * from looping.
 */
function routableSlugPath(pathname: string): string | null {
  const section = SLUG_SECTIONS.find((candidate) => pathname.startsWith(`${candidate}/`));
  if (!section) return null;

  const segment = pathname.slice(section.length + 1);
  // Only the detail page itself. Anything deeper is not a slug.
  if (!segment || segment.includes("/")) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // A malformed escape cannot be repaired into anything meaningful.
    return null;
  }

  const repaired = sanitizeSlug(decoded);
  if (!repaired || repaired === decoded) return null;

  return `${section}/${repaired}`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // The login page itself must stay reachable without a session.
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      // Send the visitor back where they were headed after signing in. Only the
      // path+query is kept, so this cannot be turned into an open redirect.
      url.search = `?next=${encodeURIComponent(pathname + request.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const repaired = routableSlugPath(pathname);
  if (repaired) {
    const url = request.nextUrl.clone();
    url.pathname = repaired;
    // 308, not 307: the old spelling is never coming back, and search engines
    // should move whatever they have indexed over to the working address.
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/properties/:slug",
    "/media-press/:slug",
    "/insights-blog/:slug",
    "/news-updates/:slug",
  ],
};
