import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById } from "@/lib/db/queries";
import { saveJobAction } from "../actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { CheckboxField, TextAreaField, TextField } from "@/components/admin/FormField";

export const metadata = { title: "Edit job listing" };

export default async function JobEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  const job = isNew ? null : await getJobById(Number(id));
  if (!isNew && !job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-black">
          {isNew ? "New job listing" : job?.title}
        </h1>
        <Link
          href="/admin/careers"
          className="text-sm font-semibold text-neutral-500 hover:text-dark-black"
        >
          ← Back to list
        </Link>
      </div>

      <AdminNotice error={error} />

      <form action={saveJobAction} className="space-y-6">
        <input type="hidden" name="id" value={isNew ? "new" : String(job?.id)} />

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Basics</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            The line of detail shown on the closed accordion row. Printed word for word.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="title"
              label="Job title"
              defaultValue={job?.title ?? ""}
              required
              placeholder="GM - Sales"
              hint="Shown as the heading of the row candidates click to expand."
            />
            <TextField
              name="department"
              label="Department"
              defaultValue={job?.department ?? ""}
              placeholder="Sales"
              hint="Also the filter the Department tabs on /careers use, so match an existing spelling."
            />
            <TextField
              name="location"
              label="Location"
              defaultValue={job?.location ?? ""}
              placeholder="Gurugram"
            />
            <TextField
              name="type"
              label="Employment type"
              defaultValue={job?.type ?? ""}
              placeholder="Full Time"
            />
            <TextField
              name="experience"
              label="Experience needed"
              defaultValue={job?.experience ?? ""}
              placeholder="7-10 years"
              hint="Free text — the row prints it as typed."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Job description</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            What opens when the row is expanded. Leave a box empty to drop that part of
            the posting.
          </p>
          <div className="space-y-4">
            <TextAreaField
              name="summary"
              label="Summary"
              rows={5}
              defaultValue={job?.summary ?? ""}
              placeholder="The General Manager Sales will be based in Gurgaon and…"
              hint="One opening paragraph under “Job Description”. Plain text — it prints as a single block."
            />
            <TextAreaField
              name="qualifications"
              label="Qualifications"
              rows={9}
              defaultValue={(job?.qualifications ?? []).join("\n")}
              placeholder={"Proven track record in strategic leadership.\nProficiency in CRM software such as Salesforce."}
              hint="One per line. Each line becomes its own bullet — do not type the bullet character yourself."
            />
            <TextAreaField
              name="responsibilities"
              label="Responsibilities"
              rows={9}
              defaultValue={(job?.responsibilities ?? []).join("\n")}
              placeholder={"Lead the development of sales and marketing strategies.\nManage and optimise the sales pipeline."}
              hint="One per line, same as above."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Publishing</h2>
          <TextField
            name="sortOrder"
            label="Sort order"
            type="number"
            defaultValue={job?.sort_order ?? 0}
            hint="Position in the list, lowest first. Ties fall back to the oldest listing first."
          />
          <div className="mt-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={job ? Boolean(job.is_published) : true}
              hint="Unticked, the listing stays here as a draft and disappears from /careers."
            />
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            {isNew ? "Create listing" : "Save changes"}
          </button>
          <Link
            href="/admin/careers"
            className="rounded-xl border border-neutral-200 px-6 py-3 font-semibold text-dark-black hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
