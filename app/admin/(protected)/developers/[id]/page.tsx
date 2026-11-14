import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeveloperById } from "@/lib/db/queries";
import { saveDeveloperAction } from "../actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField } from "@/components/admin/ImageField";
import { TextAreaField, TextField } from "@/components/admin/FormField";

export const metadata = { title: "Edit developer" };

export default async function DeveloperEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  const developer = isNew ? null : await getDeveloperById(Number(id));
  if (!isNew && !developer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">
            {isNew ? "New developer" : developer?.name}
          </h1>
          {developer ? (
            <p className="mt-1 text-sm text-neutral-500">
              Used by {developer.property_count} propert
              {developer.property_count === 1 ? "y" : "ies"} — saving updates the “About
              Developer” box on all of them.
            </p>
          ) : null}
        </div>
        <Link
          href="/admin/developers"
          className="text-sm font-semibold text-neutral-500 hover:text-dark-black"
        >
          ← Back to list
        </Link>
      </div>

      <AdminNotice error={error} />

      <form action={saveDeveloperAction} className="space-y-6">
        <input type="hidden" name="id" value={isNew ? "new" : String(developer?.id)} />

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Developer</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            Fills the “About Developer” box on the detail page of every property that picks this
            developer.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="name"
              label="Developer name"
              defaultValue={developer?.name ?? ""}
              required
              placeholder="M3M"
              hint="The builder’s name, as it shows in the property drop-down and on the page. Must be unique."
            />
            <ImageField
              name="logo"
              label="Developer logo"
              defaultValue={developer?.logo ?? ""}
              hint="Upload, or type a path to an existing /images/partners/... logo. Shown about 128×80, fitted whole — a wide logo on a transparent background works best."
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextField
              name="experience"
              label="Years of experience"
              defaultValue={developer?.experience ?? ""}
              placeholder="12"
              hint="Printed as “12 Years”, so type the number alone."
            />
            <TextField
              name="projects"
              label="Total projects"
              defaultValue={developer?.projects ?? ""}
              placeholder="65"
            />
            <TextField
              name="delivered"
              label="Projects delivered"
              defaultValue={developer?.delivered ?? ""}
              placeholder="11"
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            The three stat tiles beside the logo. A tile is left out when its box is blank.
          </p>
          <div className="mt-4">
            <TextAreaField
              name="about"
              label="About the developer"
              defaultValue={developer?.about ?? ""}
              placeholder="Developer details will be updated soon."
              hint="A short paragraph under the logo. Plain text — tags and blank lines will not show."
            />
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            {isNew ? "Create developer" : "Save changes"}
          </button>
          <Link
            href="/admin/developers"
            className="rounded-xl border border-neutral-200 px-6 py-3 font-semibold text-dark-black hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
