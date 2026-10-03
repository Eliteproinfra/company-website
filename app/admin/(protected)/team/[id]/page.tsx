import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/db/queries";
import { saveTeamMemberAction } from "../actions";
import {
  DEPARTMENTS,
  DEPARTMENT_BASE,
  DEPARTMENT_LABEL,
  normalizeDepartment,
} from "../departments";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField } from "@/components/admin/ImageField";
import { CheckboxField, SelectField, TextField } from "@/components/admin/FormField";

export const metadata = { title: "Edit team member" };

export default async function TeamMemberEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ department?: string; error?: string }>;
}) {
  const { id } = await params;
  const { department: departmentParam, error } = await searchParams;
  const isNew = id === "new";

  const member = isNew ? null : await getTeamMemberById(Number(id));
  if (!isNew && !member) notFound();

  const department = member ? member.department : normalizeDepartment(departmentParam);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">
            {isNew ? `New ${DEPARTMENT_LABEL[department]} member` : member?.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{DEPARTMENT_BASE[department]}</p>
        </div>
        <Link
          href={`/admin/team?department=${department}`}
          className="text-sm font-semibold text-neutral-500 hover:text-dark-black"
        >
          ← Back to list
        </Link>
      </div>

      <AdminNotice error={error} />

      <form action={saveTeamMemberAction} className="space-y-6">
        <input type="hidden" name="id" value={isNew ? "new" : String(member?.id)} />
        {/* Lets the action revalidate the page this person is leaving, not just
            the one they are moving to. */}
        <input type="hidden" name="previousDepartment" value={department} />

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Basics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              name="department"
              label="Page"
              defaultValue={department}
              options={DEPARTMENTS.map((option) => ({
                value: option,
                label: DEPARTMENT_LABEL[option],
              }))}
              hint="Which of the three Our Management pages this person appears on."
            />
            <TextField
              name="name"
              label="Name"
              defaultValue={member?.name ?? ""}
              required
              hint="Shown exactly as typed, honorific included — e.g. “Mr. Vishal Laller”."
            />
            <TextField
              name="title"
              label="Designation"
              defaultValue={member?.title ?? ""}
              placeholder="GM - Sales"
            />
            <TextField
              name="experience"
              label="Experience"
              defaultValue={member?.experience ?? ""}
              placeholder="10 years"
              hint="Free text — the card prints it after “Experience:”."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Photo</h2>
          <ImageField
            name="photo"
            label="Portrait"
            defaultValue={member?.photo ?? ""}
            hint="Upload, or point at an existing /images/team/... path. Left blank, the card shows the initial on gold instead."
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Contact</h2>
          <p className="mb-4 text-xs text-neutral-500">
            Each one filled in adds its icon to the card’s hover overlay; blank ones are left out.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField name="phone" label="Phone" defaultValue={member?.phone ?? ""} />
            <TextField name="email" label="Email" type="email" defaultValue={member?.email ?? ""} />
            <TextField
              name="linkedin"
              label="LinkedIn URL"
              defaultValue={member?.linkedin ?? ""}
              placeholder="https://www.linkedin.com/in/..."
              className="md:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Publishing</h2>
          <TextField
            name="sortOrder"
            label="Sort order"
            type="number"
            defaultValue={member?.sort_order ?? 0}
            hint="Low to high. Ties fall back to the order they were added in."
          />
          <div className="mt-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={member ? Boolean(member.is_published) : true}
              hint="Unpublished members stay here but disappear from the public page."
            />
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            {isNew ? "Create member" : "Save changes"}
          </button>
          <Link
            href={`/admin/team?department=${department}`}
            className="rounded-xl border border-neutral-200 px-6 py-3 font-semibold text-dark-black hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
