import Link from "next/link";
import { listDevelopers } from "@/lib/db/queries";
import { deleteDeveloperAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Developers" };

export default async function AdminDevelopersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;

  let rows: Awaited<ReturnType<typeof listDevelopers>> = [];
  let dbError: string | null = null;
  try {
    rows = await listDevelopers();
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">Developers</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {rows.length} developer(s). Each one appears in the Developer drop-down when you add
            or edit a property.
          </p>
        </div>
        <Link
          href="/admin/developers/new"
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
        >
          Add developer
        </Link>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Developer</th>
              <th className="px-4 py-3 font-semibold">Experience</th>
              <th className="px-4 py-3 font-semibold">Projects</th>
              <th className="px-4 py-3 font-semibold">Delivered</th>
              <th className="px-4 py-3 font-semibold">Used by</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No developers yet. Add one, and it becomes selectable on every property.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.logo}
                          alt=""
                          className="h-10 w-16 shrink-0 rounded border border-neutral-100 object-contain p-1"
                        />
                      ) : (
                        <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-neutral-100 text-sm font-semibold text-neutral-500">
                          {row.name.charAt(0)}
                        </span>
                      )}
                      <Link
                        href={`/admin/developers/${row.id}`}
                        className="font-semibold text-dark-black hover:text-primary-gold"
                      >
                        {row.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {row.experience ? `${row.experience} Years` : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{row.projects || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.delivered || "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {row.property_count} propert{row.property_count === 1 ? "y" : "ies"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/developers/${row.id}`}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                      {row.property_count > 0 ? (
                        <span
                          className="cursor-not-allowed rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-400"
                          title="Still used by a property — pick a different developer on those listings first."
                        >
                          Delete
                        </span>
                      ) : (
                        <form action={deleteDeveloperAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      )}
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
