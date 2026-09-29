import { listJobs } from "@/lib/db/queries";
import { deleteJobAction, saveJobAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { adminInputClass } from "@/components/admin/FormField";

export const metadata = { title: "Careers" };

/**
 * Job listings are five short fields, so the whole thing is edited inline —
 * every row is its own form, plus one blank row for adding. No separate editor
 * page to click through.
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
      <div>
        <h1 className="text-2xl font-bold text-dark-black">Careers</h1>
        <p className="mt-1 text-sm text-neutral-500">{rows.length} job listing(s).</p>
      </div>

      <AdminNotice saved={params.saved} deleted={params.deleted} error={params.error ?? dbError} />

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 font-bold text-dark-black">Add a listing</h2>
        <form action={saveJobAction} className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <input type="hidden" name="id" value="new" />
          <input type="hidden" name="isPublished" value="on" />
          <input name="title" placeholder="Title" required className={`${adminInputClass} md:col-span-2`} aria-label="Title" />
          <input name="department" placeholder="Department" className={adminInputClass} aria-label="Department" />
          <input name="location" placeholder="Location" className={adminInputClass} aria-label="Location" />
          <input name="type" placeholder="Full Time" className={adminInputClass} aria-label="Type" />
          <input name="experience" placeholder="4-7 years" className={adminInputClass} aria-label="Experience" />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827] md:col-span-6 md:justify-self-start"
          >
            Add listing
          </button>
        </form>
      </section>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 bg-white px-4 py-10 text-center text-sm text-neutral-500">
            No job listings yet.
          </p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <form action={saveJobAction} className="grid grid-cols-1 gap-3 md:grid-cols-6">
                <input type="hidden" name="id" value={row.id} />
                <input name="title" defaultValue={row.title} className={`${adminInputClass} md:col-span-2`} aria-label="Title" />
                <input name="department" defaultValue={row.department} className={adminInputClass} aria-label="Department" />
                <input name="location" defaultValue={row.location} className={adminInputClass} aria-label="Location" />
                <input name="type" defaultValue={row.type} className={adminInputClass} aria-label="Type" />
                <input name="experience" defaultValue={row.experience} className={adminInputClass} aria-label="Experience" />
                <div className="flex flex-wrap items-center gap-4 md:col-span-6">
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
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1"
                    />
                  </label>
                  <button
                    type="submit"
                    className="ml-auto rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                  >
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteJobAction} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete listing
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
