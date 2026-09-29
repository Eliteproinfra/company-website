/**
 * Next 16 renamed the `middleware` file convention to `proxy` — this is that
 * file, not a legacy middleware.ts.
 *
 * Cheap gate only. The docs are explicit that proxy runs separately from render
 * code and must not rely on shared modules, so it deliberately does NOT hit the
 * database — it just bounces anyone with no session cookie away from /admin.
 * The authoritative check (is the token real, unexpired, and the user active?)
 * happens in app/admin/layout.tsx, which can query MySQL.
 *
 * Treat this as a redirect convenience, never as the security boundary.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "elite_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

export const config = {
  matcher: ["/admin/:path*"],
};
