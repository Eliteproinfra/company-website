import Link from "next/link";
import { listJobs } from "@/lib/db/queries";
import { deleteJobAction, setJobVisibilityAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";

export const metadata = { title: "Careers" };

/**
 * Overview only. A posting now carries a summary and two bullet lists, which do
 * not fit an inline row — and more importantly a form that cannot see those
 * fields must never be the thing that saves a posting, or every reorder would
 * blank the description. Editing happens in [id]/page.tsx; the controls here go
 * through setJobVisibilityAction, which writes only the two columns it shows.
 */
export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;

  let rows: Awaited<ReturnType<typeof listJobs>> = [];
  let dbError: string | null = null;
  try {
    rows = await listJobs({ includeUnpublished: true });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database error";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">Careers</h1>
          <p className="mt-1 text-sm text-neutral-500">{rows.length} job listing(s).</p>
        </div>
        <Link
          href="/admin/careers/new"
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827]"
        >
          New listing
        </Link>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
          No job listings yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/admin/careers/${row.id}`}
                    className="font-bold text-dark-black hover:text-primary-gold"
                  >
                    {row.title}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    {[row.department, row.location, row.type, row.experience]
                      .filter(Boolean)
                      .join(" · ") || "No details yet"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {row.summary ? "Has a description" : "No description yet"} ·{" "}
                    {row.qualifications.length} qualification(s) ·{" "}
                    {row.responsibilities.length} responsibility(s)
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    row.is_published
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {row.is_published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-neutral-100 pt-3">
                <form action={setJobVisibilityAction} className="flex flex-wrap items-center gap-4">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark-black">
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={Boolean(row.is_published)}
                      className="h-4 w-4 accent-[#d4af37]"
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm text-neutral-500">
                    Order
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={row.sort_order}
                      aria-label={`Sort order for ${row.title}`}
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                  >
                    Apply
                  </button>
                </form>

                <Link
                  href={`/admin/careers/${row.id}`}
                  className="ml-auto rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-dark-black hover:bg-neutral-50"
                >
                  Edit
                </Link>
                <form action={deleteJobAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Delete listing
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
