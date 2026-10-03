import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "../login/actions";
import { AdminSidebarNav, AdminMobileNav, type AdminNavItem } from "@/components/admin/AdminNav";

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
  { href: "/admin/careers", label: "Careers", icon: "fas fa-briefcase" },
  { href: "/admin/awards", label: "Awards", icon: "fas fa-trophy" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "fas fa-inbox" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // THE security boundary. proxy.ts only checks that a cookie exists; this
  // validates the session against MySQL on every single request, so a revoked
  // or expired session stops working immediately.
  const user = await getCurrentUser();

  if (!user) {
    // The login route renders its own standalone page and is excluded from this
    // layout by the route structure, so reaching here unauthenticated is always
    // a redirect.
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-dark-black lg:flex">
        <div className="border-b border-white/10 px-6 py-5">
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
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <i className="fas fa-arrow-up-right-from-square w-4 text-primary-gold" aria-hidden="true" />
            View site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
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

        {/* Horizontal scroll is contained here so wide tables never make the
            whole page scroll sideways. */}
        <main className="min-w-0 flex-1 overflow-x-auto p-6">{children}</main>

        <Suspense fallback={null}>
          <AdminMobileNav items={NAV} />
        </Suspense>
      </div>
    </div>
  );
}
