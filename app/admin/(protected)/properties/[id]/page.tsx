import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/db/queries";
import { savePropertyAction } from "../actions";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField, ImageListField } from "@/components/admin/ImageField";
import RepeaterField from "@/components/admin/RepeaterField";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/FormField";

export const metadata = { title: "Edit property" };

export default async function PropertyEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  const property = isNew ? null : await getPropertyById(Number(id));
  if (!isNew && !property) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">
            {isNew ? "New property" : property?.title}
          </h1>
          {!isNew ? <p className="mt-1 text-sm text-neutral-500">/properties/{property?.slug}</p> : null}
        </div>
        <Link href="/admin/properties" className="text-sm font-semibold text-neutral-500 hover:text-dark-black">
          ← Back to list
        </Link>
      </div>

      <AdminNotice error={error} />

      <form action={savePropertyAction} className="space-y-6">
        <input type="hidden" name="id" value={isNew ? "new" : String(property?.id)} />

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Basics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField name="title" label="Title" defaultValue={property?.title ?? ""} required />
            <TextField
              name="slug"
              label="Slug"
              defaultValue={property?.slug ?? ""}
              hint="Leave blank to generate from the title. Must be unique."
            />
            <TextField name="category" label="Category" defaultValue={property?.category ?? ""} />
            <SelectField
              name="badgeVariant"
              label="Badge colour"
              defaultValue={property?.badge_variant ?? "residential"}
              options={[
                { value: "residential", label: "Residential" },
                { value: "commercial", label: "Commercial" },
                { value: "sco", label: "SCO Plots" },
                { value: "industrial", label: "Industrial" },
              ]}
            />
            <TextField name="badgeText" label="Badge text" defaultValue={property?.badge_text ?? ""}
              hint="Defaults to the badge colour name when blank." />
            <TextField name="location" label="Location" defaultValue={property?.location ?? ""} />
            <TextField name="price" label="Price" defaultValue={property?.price ?? ""} placeholder="₹ 18.75 Cr*" />
            <TextField name="priceNote" label="Price note" defaultValue={property?.price_note ?? ""} />
            <TextField name="beds" label="Beds" defaultValue={property?.beds ?? ""} />
            <TextField name="area" label="Area" defaultValue={property?.area ?? ""} />
          </div>
          <div className="mt-4">
            <TextAreaField
              name="description"
              label="Description (HTML)"
              rows={8}
              defaultValue={property?.description ?? ""}
              hint="Sanitised on save — script/iframe/style and event handlers are stripped."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Gallery</h2>
          <ImageListField name="images" label="Images" defaultValue={property?.images ?? []} />
        </section>

        <section className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Details</h2>
          <RepeaterField
            name="specs"
            label="Specifications"
            addLabel="Add spec"
            columns={[
              { key: "label", label: "Label", placeholder: "Configuration" },
              { key: "value", label: "Value", placeholder: "3 & 4 BHK" },
            ]}
            defaultValue={property?.specs ?? []}
          />
          <RepeaterField
            name="amenities"
            label="Amenities"
            addLabel="Add amenity"
            columns={[
              { key: "icon", label: "Icon class", placeholder: "fas fa-dumbbell" },
              { key: "name", label: "Name", placeholder: "Gymnasium" },
            ]}
            defaultValue={property?.amenities ?? []}
          />
          <RepeaterField
            name="faqs"
            label="FAQs"
            addLabel="Add FAQ"
            columns={[
              { key: "question", label: "Question" },
              { key: "answer", label: "Answer", multiline: true },
            ]}
            defaultValue={property?.faqs ?? []}
          />
          <RepeaterField
            name="experts"
            label="Contact experts"
            addLabel="Add expert"
            columns={[
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "image", label: "Photo path" },
              { key: "phone", label: "Phone" },
              { key: "email", label: "Email" },
            ]}
            defaultValue={property?.experts ?? []}
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Developer</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField name="developerName" label="Developer name" defaultValue={property?.developer?.name ?? ""} />
            <ImageField name="developerLogo" label="Developer logo" defaultValue={property?.developer?.logo ?? ""} />
          </div>
          <div className="mt-4">
            <TextAreaField name="developerAbout" label="About the developer" defaultValue={property?.developer?.about ?? ""} />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Publishing</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField name="mapUrl" label="Map URL" defaultValue={property?.map_url ?? ""} />
            <TextField
              name="relatedIds"
              label="Related property IDs"
              defaultValue={(property?.relatedIds ?? []).join(", ")}
              hint="Comma-separated numeric IDs."
            />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={property?.sort_order ?? 0} />
          </div>
          <div className="mt-4 space-y-3">
            <CheckboxField name="isPublished" label="Published" defaultChecked={property ? Boolean(property.is_published) : true} />
            <CheckboxField name="isFeatured" label="Featured on the homepage" defaultChecked={Boolean(property?.is_featured)} />
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            {isNew ? "Create property" : "Save changes"}
          </button>
          <Link
            href="/admin/properties"
            className="rounded-xl border border-neutral-200 px-6 py-3 font-semibold text-dark-black hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
