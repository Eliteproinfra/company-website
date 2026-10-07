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
          <h2 className="font-bold text-dark-black">Basics</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            The headline facts. These drive the listing card, the page heading and the
            /properties filters.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="title"
              label="Title"
              defaultValue={property?.title ?? ""}
              required
              placeholder="M3M Paragon"
              hint="The project name, exactly as it should read on the card and the page heading."
            />
            <TextField
              name="slug"
              label="Slug (web address)"
              defaultValue={property?.slug ?? ""}
              placeholder="m3m-paragon"
              hint="The ending of the public URL: /properties/m3m-paragon. Leave blank to build it from the title. Lowercase, dashes instead of spaces, and unique across all listings."
            />
            <TextField
              name="category"
              label="Category"
              defaultValue={property?.category ?? ""}
              placeholder="Residential"
              hint="Printed on the card badge and as the dark pill on the detail page. Type one of: Residential, Commercial, SCO Plots, Industrial."
            />
            <SelectField
              name="badgeVariant"
              label="Property type (filter)"
              defaultValue={property?.badge_variant ?? "residential"}
              options={[
                { value: "residential", label: "Residential" },
                { value: "commercial", label: "Commercial" },
                { value: "sco", label: "SCO Plots" },
                { value: "industrial", label: "Industrial Plots" },
              ]}
              hint="Decides which “Type” the /properties filter files this listing under. Set it to match the Category."
            />
            <TextField
              name="badgeText"
              label="Badge text"
              defaultValue={property?.badge_text ?? ""}
              hint="Leave blank. The card badge prints the Category above — this is a stored override that nothing shows today."
            />
            <TextField
              name="location"
              label="Location"
              defaultValue={property?.location ?? ""}
              placeholder="Gurgaon"
              hint="City name only, spelled exactly as in the filter: Delhi, Dubai, Faridabad, Gurgaon, Manesar or Noida. Adding a sector (“Gurgaon, Sector 59”) means the filter will never find it."
            />
            <TextField
              name="price"
              label="Price"
              defaultValue={property?.price ?? ""}
              placeholder="₹ 18.75 Cr*"
              hint="Shown word for word — type the ₹ and the unit yourself. Write “Price On Request” if there is no figure. Stick to Cr: the price sort reads the first number and ignores the unit, so a Lakh figure sorts above a Cr one."
            />
            <TextField
              name="priceNote"
              label="Price note"
              defaultValue={property?.price_note ?? ""}
              placeholder="Starting price. Taxes & charges extra."
              hint="Small grey line printed under the price on the detail page. Leave blank to hide it."
            />
            <TextField
              name="beds"
              label="Beds"
              defaultValue={property?.beds ?? ""}
              placeholder="3 & 4 BHK"
              hint="Shown on the card beside a bed icon, word for word — include the unit, as nothing is added."
            />
            <TextField
              name="area"
              label="Area"
              defaultValue={property?.area ?? ""}
              placeholder="2,150 sq. ft."
              hint="Shown on the card beside a ruler icon, word for word — include the unit."
            />
          </div>
          <div className="mt-4">
            <TextAreaField
              name="description"
              label="Description"
              rows={8}
              defaultValue={property?.description ?? ""}
              hint="Plain prose about the project. The page prints it as one paragraph, so HTML tags and blank lines will not show. Also used as the Google search description, so lead with the strongest sentence."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Gallery</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            Project photos. Order matters — use the arrows to rearrange.
          </p>
          <ImageListField
            name="images"
            label="Images"
            defaultValue={property?.images ?? []}
            hint="Put the best photo first: image 1 becomes the card thumbnail, the large photo at the top of the detail page, and the preview when the link is shared on WhatsApp or Facebook. Add two or more to get the clickable thumbnail strip. Upload files, or type a path to an existing /images/properties/... photo."
          />
        </section>

        <section className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Details</h2>
          <p className="-mt-3 text-xs text-neutral-500">
            The boxes down the detail page. Each one is hidden on the public page when you
            leave it empty.
          </p>
          <RepeaterField
            name="specs"
            label="Specifications"
            addLabel="Add spec"
            hint="Rows of the “Property Overview” box. Existing listings carry Location, Category and Developer — add Configuration, Possession, RERA No. and the like. Do not repeat the same label twice."
            columns={[
              { key: "label", label: "Label (left)", placeholder: "Configuration" },
              { key: "value", label: "Value (right)", placeholder: "3 & 4 BHK" },
            ]}
            defaultValue={property?.specs ?? []}
          />
          <RepeaterField
            name="amenities"
            label="Amenities"
            addLabel="Add amenity"
            hint="Tiles in the “Amenities” grid. The icon is a Font Awesome 5 class and must keep the “fas ” prefix — e.g. fas fa-dumbbell, fas fa-swimming-pool, fas fa-car. A name that is not a real class leaves an empty gold square, so copy it from fontawesome.com/v5/search. Do not repeat the same name twice."
            columns={[
              { key: "icon", label: "Icon class", placeholder: "fas fa-dumbbell" },
              { key: "name", label: "Amenity name", placeholder: "Gymnasium" },
            ]}
            defaultValue={property?.amenities ?? []}
          />
          <RepeaterField
            name="faqs"
            label="FAQs"
            addLabel="Add FAQ"
            hint="The drop-down accordion near the bottom of the page. The first one sits open when the page loads, so put the most asked question first. Answers are plain text — no links, no bullet points, no blank lines."
            columns={[
              { key: "question", label: "Question", placeholder: "Is the project RERA approved?" },
              { key: "answer", label: "Answer", multiline: true, placeholder: "Yes. Contact us for the RERA number and documentation." },
            ]}
            defaultValue={property?.faqs ?? []}
          />
          <RepeaterField
            name="experts"
            label="Contact experts"
            addLabel="Add expert"
            hint="The “Top Experts” cards. The phone and email are never printed — they only power the Call and Email buttons, and a button is left out when its box is blank. Give every expert a different email, as that is what keeps the cards apart."
            columns={[
              { key: "name", label: "Name", placeholder: "Mr. Vishal Laller" },
              { key: "role", label: "Designation", placeholder: "GM - Sales" },
              { key: "image", label: "Photo path (blank = initials)", placeholder: "/images/team/..." },
              { key: "phone", label: "Phone (Call button)", placeholder: "9968686868" },
              { key: "email", label: "Email (Email button)", placeholder: "name@eliteproinfra.com" },
            ]}
            defaultValue={property?.experts ?? []}
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Developer</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            Fills the “About Developer” box on the detail page. This box always shows, so
            fill the name in even if the rest is unknown.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="developerName"
              label="Developer name"
              defaultValue={property?.developer?.name ?? ""}
              placeholder="M3M"
              hint="The builder’s name. Leaving this blank throws the logo and the text below away too."
            />
            <ImageField
              name="developerLogo"
              label="Developer logo"
              defaultValue={property?.developer?.logo ?? ""}
              hint="Upload, or type a path to an existing /images/partners/... logo. Shown about 128×80, fitted whole — a wide logo on a transparent background works best."
            />
          </div>
          <div className="mt-4">
            <TextAreaField
              name="developerAbout"
              label="About the developer"
              defaultValue={property?.developer?.about ?? ""}
              placeholder="Developer details will be updated soon."
              hint="A short paragraph under the logo. Plain text — tags and blank lines will not show."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Publishing</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            Where this listing points, what it sits next to, and whether anyone can see it.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="mapUrl"
              label="Map link"
              defaultValue={property?.map_url ?? ""}
              placeholder="https://maps.app.goo.gl/..."
              hint="Paste a Google Maps embed address (the one containing /maps/embed, from Share → Embed a map) to show the map inside the page. Any other link, including a short maps.app.goo.gl share link, turns into a “View on Google Maps” button instead. Blank hides the whole section."
            />
            <TextField
              name="relatedIds"
              label="Related property IDs"
              defaultValue={(property?.relatedIds ?? []).join(", ")}
              placeholder="138, 137, 136"
              hint="The ID numbers of the listings to show under “Related Properties”, separated by commas — three is usual. Each listing’s ID is in the address bar when you open it from the list. IDs that no longer exist are quietly skipped."
            />
            <TextField
              name="sortOrder"
              label="Sort order"
              type="number"
              defaultValue={property?.sort_order ?? 0}
              hint="Position in the listing grid, lowest number first. Ties fall back to the newest listing first."
            />
          </div>
          <div className="mt-4 space-y-3">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={property ? Boolean(property.is_published) : true}
              hint="Unticked, the listing stays here as a draft and disappears from the public site."
            />
            <CheckboxField
              name="isFeatured"
              label="Featured on the homepage"
              defaultChecked={Boolean(property?.is_featured)}
              hint="Pins the listing to the front of its city’s tab in the homepage “Signature Projects” grid. Each tab shows at most eight, so featuring a listing is how you make sure it is one of them."
            />
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
