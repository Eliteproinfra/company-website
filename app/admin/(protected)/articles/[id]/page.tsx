import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db/queries";
import { saveArticleAction } from "../actions";
import { KIND_BASE, KIND_LABEL, KINDS, normalizeKind } from "../kinds";
import AdminNotice from "@/components/admin/AdminNotice";
import { ImageField } from "@/components/admin/ImageField";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/FormField";

export const metadata = { title: "Edit article" };

export default async function ArticleEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string; error?: string }>;
}) {
  const { id } = await params;
  const { kind: kindParam, error } = await searchParams;
  const isNew = id === "new";

  const article = isNew ? null : await getArticleById(Number(id));
  if (!isNew && !article) notFound();

  const kind = article ? article.kind : normalizeKind(kindParam);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-black">
            {isNew ? `New ${KIND_LABEL[kind]} item` : article?.title}
          </h1>
          {!isNew ? (
            <p className="mt-1 text-sm text-neutral-500">
              {KIND_BASE[kind]}/{article?.slug}
            </p>
          ) : null}
        </div>
        <Link
          href={`/admin/articles?kind=${kind}`}
          className="text-sm font-semibold text-neutral-500 hover:text-dark-black"
        >
          ← Back to list
        </Link>
      </div>

      <AdminNotice error={error} />

      <form action={saveArticleAction} className="space-y-6">
        <input type="hidden" name="id" value={isNew ? "new" : String(article?.id)} />

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Basics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              name="kind"
              label="Section"
              defaultValue={kind}
              options={KINDS.map((option) => ({ value: option, label: KIND_LABEL[option] }))}
              hint="Moving an item between sections changes its public URL."
            />
            <TextField
              name="title"
              label="Title"
              defaultValue={article?.title ?? ""}
              required
              hint="The headline, shown on the listing card and at the top of the article."
            />
            <TextField
              name="slug"
              label="Slug (web address)"
              defaultValue={article?.slug ?? ""}
              placeholder="gurgaon-market-outlook-2026"
              hint="The ending of the public URL. Leave blank to build it from the title. Lowercase, dashes instead of spaces, and unique within this section."
            />
            <TextField
              name="publishedOn"
              label="Published on"
              type="date"
              defaultValue={article?.published_on ?? ""}
              hint="The date printed on the card and the article. Pick it from the calendar."
            />
          </div>
          <div className="mt-4">
            <TextAreaField
              name="excerpt"
              label="Excerpt (card summary)"
              rows={3}
              defaultValue={article?.excerpt ?? ""}
              hint="The two or three line teaser under the title on listing cards. Plain text — write it yourself rather than pasting the first paragraph."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Cover image</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            The photo on the listing card and at the top of the article.
          </p>
          <ImageField
            name="image"
            label="Image"
            defaultValue={article?.image ?? ""}
            hint="Upload a file, or type a path to an existing /images/... photo. A wide, landscape picture works best."
          />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="imageWidth"
              label="Image width (pixels)"
              type="number"
              defaultValue={article?.image_width ?? 0}
              placeholder="1200"
              hint="The real pixel size of the file, not the size you want it shown at. In Windows, right-click the file → Properties → Details. Guessing here makes the page jump about while it loads."
            />
            <TextField
              name="imageHeight"
              label="Image height (pixels)"
              type="number"
              defaultValue={article?.image_height ?? 0}
              placeholder="630"
              hint="From the same Properties → Details panel as the width."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Body</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            The article itself.
          </p>
          <TextAreaField
            name="content"
            label="Content (HTML)"
            rows={20}
            defaultValue={article?.content ?? ""}
            placeholder="<p>First paragraph…</p>"
            hint="Written as HTML — wrap each paragraph in <p>…</p>, as plain line breaks are ignored. Headings, lists, bold, italics and links all work. Anything unsafe is stripped out when you save: scripts, embedded frames, style blocks and javascript: links."
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-bold text-dark-black">Publishing</h2>
          <p className="mb-4 mt-1 text-xs text-neutral-500">
            What this sits next to, and whether anyone can see it.
          </p>
          <TextField
            name="relatedIds"
            label="Related article IDs"
            defaultValue={(article?.relatedIds ?? []).join(", ")}
            placeholder="21, 18, 14"
            hint="The ID numbers of the articles to suggest at the end, separated by commas. Each article’s ID is in the address bar when you open it from the list. IDs that no longer exist are quietly skipped."
          />
          <div className="mt-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={article ? Boolean(article.is_published) : true}
              hint="Unticked, the item stays here as a draft and disappears from the public site."
            />
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827]"
          >
            {isNew ? "Create item" : "Save changes"}
          </button>
          <Link
            href={`/admin/articles?kind=${kind}`}
            className="rounded-xl border border-neutral-200 px-6 py-3 font-semibold text-dark-black hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
