import Link from "next/link";
import { listProperties } from "@/lib/db/queries";
import { deletePropertyAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Properties" };

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;

  let rows: Awaited<ReturnType<typeof listProperties>> = [];
  let dbError: string | null = null;
  try {
    rows = await listProperties({ includeUnpublished: true });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">Properties</h1>
          <p className="mt-1 text-sm text-neutral-500">{rows.length} listing(s).</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
        >
          Add property
        </Link>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No properties yet. Run <code className="font-mono">npm run db:seed</code> to import
                  the existing listings, or add one manually.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/properties/${row.id}`}
                      className="font-semibold text-dark-black hover:text-primary-gold"
                    >
                      {row.title}
                    </Link>
                    <p className="text-xs text-neutral-400">/{row.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{row.category || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.location || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.price || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.is_published
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {row.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties/${row.id}`}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
