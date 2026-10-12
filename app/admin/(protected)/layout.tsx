import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "../login/actions";
import { AdminSidebarNav, AdminMobileNav, type AdminNavItem } from "@/components/admin/AdminNav";
import AdminScrollReset from "@/components/admin/AdminScrollReset";

/** The scrolling pane, named so AdminScrollReset can find it. */
const ADMIN_SCROLL_ID = "admin-content";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Elite Pro Admin" },
  robots: { index: false, follow: false },
};

/**
 * The admin is authenticated per request against the database, so nothing here
 * may be cached or prerendered.
 */
export const dynamic = "force-dynamic";

const NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "fas fa-gauge-high", exact: true },
  { href: "/admin/properties", label: "Properties", icon: "fas fa-building" },
  { href: "/admin/articles?kind=press", label: "PR & Media", icon: "fas fa-newspaper" },
  { href: "/admin/articles?kind=blog", label: "Insights & Blogs", icon: "fas fa-pen-nib" },
  { href: "/admin/articles?kind=news", label: "News & Updates", icon: "fas fa-bullhorn" },
  { href: "/admin/team", label: "Our Management", icon: "fas fa-users" },
  { href: "/admin/careers", label: "Careers", icon: "fas fa-briefcase" },
  { href: "/admin/awards", label: "Awards", icon: "fas fa-trophy" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "fas fa-inbox" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // THE security boundary. proxy.ts only checks that a cookie exists; this
  // validates the session against MySQL on every single request, so a revoked
  // or expired session stops working immediately.
  const session = await getSession();

  if (session.status === "anonymous") {
    // The login route renders its own standalone page and is excluded from this
    // layout by the route structure, so reaching here unauthenticated is always
    // a redirect.
    redirect("/admin/login");
  }

  // The session could not be checked at all, which is not the same as being
  // signed out and must not be shown as one. Access is still denied — nothing
  // below this point renders — but the operator is told what is actually wrong
  // instead of getting the bare 500 this used to produce.
  if (session.status === "unavailable") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600"
            aria-hidden="true"
          >
            <i className="fas fa-database" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-dark-black">Admin unavailable</h1>
          <p className="mt-2 text-sm text-neutral-600">
            The database could not be reached, so your sign-in could not be verified. The public
            site is unaffected — it serves published content without the database.
          </p>
          <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2 text-left font-mono text-xs text-neutral-500">
            {/* The driver's message — host, port, refused — which is what makes
                this diagnosable. Safe to show: reaching this page at all
                required a 64-character session cookie. */}
            {session.reason}
          </p>
          <p className="mt-4 text-xs text-neutral-500">
            Check <code className="font-semibold">/health</code> and the DB_* settings, then reload.
          </p>
        </div>
      </main>
    );
  }

  const { user } = session;

  return (
    /**
     * A viewport-height shell, not a page that grows: the sidebar, the top bar
     * and the mobile nav stay put and only <main> scrolls. The editor forms are
     * long enough that scrolling the whole document put "Sign out" and the
     * section links off-screen exactly when they were wanted.
     *
     * h-dvh behind a support query, matching HeroVideo and AboutHero: on mobile
     * Safari 100vh is the height with the browser chrome hidden, so h-screen
     * alone would push the bottom nav under the address bar.
     *
     * `fixed inset-0` rather than a plain full-height block. globals.css sets
     * `body { overflow-x: hidden }`, which makes overflow-y compute to `auto`
     * and leaves the document with a scrollable range even when nothing is
     * visibly overflowing: a wheel did nothing, but any window.scrollTo — an
     * in-page anchor, the browser restoring a position on Back — slid the whole
     * shell up and showed blank space under it. Out of flow, there is nothing
     * for the document to scroll.
     *
     * `overflow-clip`, not `overflow-hidden`: a hidden box is still a scroll
     * container, so focusing anything positioned past its edge scrolled the
     * shell itself and blanked the panel (the Upload buttons did exactly
     * this). A clipped box cannot be scrolled at all.
     */
    <div className="fixed inset-0 flex h-screen overflow-clip bg-neutral-100 supports-[height:100dvh]:h-dvh">
      <aside className="hidden h-full w-64 shrink-0 flex-col bg-dark-black lg:flex">
        <div className="shrink-0 border-b border-white/10 px-6 py-5">
          <Link href="/admin" className="block">
            {/* The light mark — the sidebar is dark-black. */}
            <Image
              src="/images/Elite-pro-logo.png"
              alt="Elite Pro Infraventure"
              width={845}
              height={249}
              className="h-8 w-auto object-contain"
            />
            <span className="mt-2 block font-bold text-white">Admin Panel</span>
          </Link>
        </div>
        {/* useSearchParams suspends, and this layout wraps every admin page, so
            the boundary keeps one slow nav from blocking the whole shell. */}
        <Suspense fallback={<div className="flex-1 p-4" aria-hidden="true" />}>
          <AdminSidebarNav items={NAV} />
        </Suspense>
        <div className="shrink-0 border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <i className="fas fa-arrow-up-right-from-square w-4 text-primary-gold" aria-hidden="true" />
            View site
          </Link>
        </div>
      </aside>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
          <div className="lg:hidden">
            <Link href="/admin" className="flex items-center gap-2">
              {/* The dark mark — this bar is white, unlike the sidebar. */}
              <Image
                src="/images/dark-logo.png"
                alt="Elite Pro Infraventure"
                width={252}
                height={81}
                className="h-7 w-auto object-contain"
              />
              <span className="sr-only">Admin</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              Signed in as <strong className="text-dark-black">{user.displayName}</strong>
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-dark-black transition-colors hover:bg-neutral-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* The only scrolling element. Horizontal scroll is contained here too,
            so wide tables never make the whole page scroll sideways. */}
        <main id={ADMIN_SCROLL_ID} className="min-w-0 flex-1 overflow-auto p-6">
          {children}
        </main>

        {/* Next resets window scroll on navigation, which does nothing when the
            document itself never scrolls — without this, opening a listing from
            halfway down the list would start halfway down the form. */}
        <Suspense fallback={null}>
          <AdminScrollReset targetId={ADMIN_SCROLL_ID} />
        </Suspense>

        <Suspense fallback={null}>
          <div className="shrink-0">
            <AdminMobileNav items={NAV} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
