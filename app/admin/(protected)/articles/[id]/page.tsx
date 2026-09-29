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
            <TextField name="title" label="Title" defaultValue={article?.title ?? ""} required />
            <TextField
              name="slug"
              label="Slug"
              defaultValue={article?.slug ?? ""}
              hint="Blank generates from the title. Unique within the section."
            />
            <TextField
              name="publishedOn"
              label="Published on"
              type="date"
              defaultValue={article?.published_on ?? ""}
            />
          </div>
          <div className="mt-4">
            <TextAreaField
              name="excerpt"
              label="Excerpt"
              rows={3}
              defaultValue={article?.excerpt ?? ""}
              hint="Shown on listing cards."
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Cover image</h2>
          <ImageField name="image" label="Image" defaultValue={article?.image ?? ""} />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="imageWidth"
              label="Image width"
              type="number"
              defaultValue={article?.image_width ?? 0}
              hint="Intrinsic pixel width — must match the real file or next/image warns."
            />
            <TextField
              name="imageHeight"
              label="Image height"
              type="number"
              defaultValue={article?.image_height ?? 0}
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Body</h2>
          <TextAreaField
            name="content"
            label="Content (HTML)"
            rows={20}
            defaultValue={article?.content ?? ""}
            hint="Sanitised on save: only formatting tags survive. script/iframe/style, event handlers and javascript: URLs are stripped."
          />
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-dark-black">Publishing</h2>
          <TextField
            name="relatedIds"
            label="Related article IDs"
            defaultValue={(article?.relatedIds ?? []).join(", ")}
            hint="Comma-separated numeric IDs."
          />
          <div className="mt-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={article ? Boolean(article.is_published) : true}
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
