import { listJobs } from "@/lib/db/queries";
import { deleteJobAction, saveJobAction } from "./actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { adminInputClass } from "@/components/admin/FormField";

export const metadata = { title: "Careers" };

/**
 * One labelled cell of the six-column job row. Labels are repeated on every row
 * rather than sitting in a header strip, so they survive the single-column
 * mobile layout — and `id` is scoped per row to keep them unique on the page.
 */
function JobField({
  name,
  label,
  hint,
  placeholder,
  defaultValue,
  className,
  required,
  rowId = "new",
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  rowId?: string | number;
}) {
  const id = `job-${rowId}-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-neutral-500">
        {label}
        {hint ? <span className="ml-1 font-normal text-neutral-400">({hint})</span> : null}
      </label>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={adminInputClass}
      />
    </div>
  );
}

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
        <h2 className="font-bold text-dark-black">Add a listing</h2>
        <p className="mb-4 mt-1 text-xs text-neutral-500">
          Every box is printed on the careers page word for word. Only the job title is
          required; the rest are left off the card when blank.
        </p>
        <form action={saveJobAction} className="grid grid-cols-1 gap-3 md:grid-cols-6">
          <input type="hidden" name="id" value="new" />
          <input type="hidden" name="isPublished" value="on" />
          <JobField
            name="title"
            label="Job title"
            hint="Required"
            placeholder="Sales Manager"
            className="md:col-span-2"
            required
          />
          <JobField name="department" label="Department" placeholder="Sales" />
          <JobField name="location" label="Location" placeholder="Gurgaon" />
          <JobField name="type" label="Employment type" placeholder="Full Time" />
          <JobField name="experience" label="Experience needed" placeholder="4-7 years" />
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
                <JobField rowId={row.id} name="title" label="Job title" defaultValue={row.title} placeholder="Sales Manager" className="md:col-span-2" />
                <JobField rowId={row.id} name="department" label="Department" defaultValue={row.department} placeholder="Sales" />
                <JobField rowId={row.id} name="location" label="Location" defaultValue={row.location} placeholder="Gurgaon" />
                <JobField rowId={row.id} name="type" label="Employment type" defaultValue={row.type} placeholder="Full Time" />
                <JobField rowId={row.id} name="experience" label="Experience needed" defaultValue={row.experience} placeholder="4-7 years" />
                <div className="flex flex-wrap items-center gap-4 md:col-span-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark-black">
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={Boolean(row.is_published)}
                      className="h-4 w-4 accent-[#d4af37]"
                    />
                    Published
                    <span className="font-normal text-neutral-400">(untick to hide it from the site)</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-neutral-500">
                    Order
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={row.sort_order}
                      className="w-20 rounded-lg border border-neutral-200 px-2 py-1"
                    />
                    <span className="text-neutral-400">(lowest first)</span>
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
