import Link from "next/link";
import { dashboardCounts, listEnquiries } from "@/lib/db/queries";

export const metadata = { title: "Dashboard" };

type Tile = { label: string; value: number; href: string; icon: string; accent?: boolean };

export default async function AdminDashboard() {
  let counts = { properties: 0, articles: 0, jobs: 0, enquiries: 0, unreadEnquiries: 0 };
  let recent: Awaited<ReturnType<typeof listEnquiries>> = [];
  let dbError: string | null = null;

  try {
    [counts, recent] = await Promise.all([dashboardCounts(), listEnquiries(5)]);
  } catch (error) {
    // A missing/incorrect DB config is the likeliest cause and should be
    // actionable on screen rather than a stack trace.
    dbError = error instanceof Error ? error.message : "Unknown database error";
  }

  const tiles: Tile[] = [
    { label: "Properties", value: counts.properties, href: "/admin/properties", icon: "fas fa-building" },
    { label: "Articles", value: counts.articles, href: "/admin/articles?kind=press", icon: "fas fa-newspaper" },
    { label: "Job listings", value: counts.jobs, href: "/admin/careers", icon: "fas fa-briefcase" },
    { label: "Unread enquiries", value: counts.unreadEnquiries, href: "/admin/enquiries", icon: "fas fa-inbox", accent: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Content and enquiries at a glance.</p>
      </div>

      {dbError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-800">Database not reachable</p>
          <p className="mt-2 text-sm text-red-700">{dbError}</p>
          <p className="mt-3 text-sm text-red-700">
            Set <code className="font-mono">DB_HOST</code>, <code className="font-mono">DB_USER</code>,{" "}
            <code className="font-mono">DB_PASSWORD</code> and <code className="font-mono">DB_NAME</code>{" "}
            in <code className="font-mono">.env.local</code>, then run{" "}
            <code className="font-mono">npm run db:setup</code>.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-500">{tile.label}</span>
              <i className={`${tile.icon} text-primary-gold`} aria-hidden="true" />
            </div>
            <p
              className={`mt-3 text-3xl font-bold ${
                tile.accent && tile.value > 0 ? "text-primary-gold" : "text-dark-black"
              }`}
            >
              {tile.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-bold text-dark-black">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-primary-gold hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-neutral-500">No enquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Source</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recent.map((row) => (
                  <tr key={row.id} className={row.is_read ? "" : "bg-primary-gold/5"}>
                    <td className="px-6 py-3 font-semibold text-dark-black">{row.name || "—"}</td>
                    <td className="px-6 py-3 text-neutral-500">{row.source || "—"}</td>
                    <td className="px-6 py-3 text-neutral-500">{row.email || row.phone || "—"}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-neutral-500">{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
