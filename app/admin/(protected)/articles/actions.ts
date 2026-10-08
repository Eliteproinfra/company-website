"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  updateArticle,
  type ArticleInput,
  type ArticleKind,
} from "@/lib/db/queries";
import { KIND_BASE, normalizeKind } from "./kinds";

/** Server Actions are public endpoints; the authenticated layout does not cover them. */
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

type ArticleLocation = { kind: ArticleKind; slug: string };

/**
 * Public pages that render article data, refreshed after every write.
 *
 * Takes every location the write touched. Renaming an item, or moving it between
 * sections, changes its public URL, and the page at the old one has to be
 * cleared too — otherwise the prerendered copy keeps being served.
 */
function revalidateArticles(...locations: (ArticleLocation | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/admin/articles");
  const seen = new Set<string>();
  for (const location of locations) {
    if (!location) continue;
    const base = KIND_BASE[location.kind];
    if (!seen.has(base)) {
      seen.add(base);
      revalidatePath(base);
    }
    const href = `${base}/${location.slug}`;
    if (location.slug && !seen.has(href)) {
      seen.add(href);
      revalidatePath(href);
    }
  }
}

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readArticleInput(form: FormData): ArticleInput {
  const publishedOn = str(form, "publishedOn");
  return {
    kind: normalizeKind(str(form, "kind")),
    slug: str(form, "slug"),
    title: str(form, "title"),
    // <input type="date"> gives YYYY-MM-DD, which is what the DATE column wants.
    publishedOn: /^\d{4}-\d{2}-\d{2}$/.test(publishedOn) ? publishedOn : null,
    excerpt: str(form, "excerpt"),
    image: str(form, "image"),
    imageWidth: Number(str(form, "imageWidth")) || 0,
    imageHeight: Number(str(form, "imageHeight")) || 0,
    content: str(form, "content"),
    relatedIds: str(form, "relatedIds")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((n) => Number.isInteger(n) && n > 0),
    isPublished: form.get("isPublished") === "on",
  };
}

export async function saveArticleAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const input = readArticleInput(formData);

  if (!input.title) {
    redirect(`/admin/articles/${idValue || "new"}?kind=${input.kind}&error=Title+is+required`);
  }

  let written: string;
  let previous: { kind: ArticleKind; slug: string } | undefined;

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?error=Invalid+id");
    // Read before writing: a renamed item, or one moved to another section, has
    // to clear the page at its old address as well as the new one.
    const existing = await getArticleById(id);
    if (existing) previous = { kind: existing.kind, slug: existing.slug };
    ({ slug: written } = await updateArticle(id, input));
  } else {
    ({ slug: written } = await createArticle(input));
  }

  revalidateArticles({ kind: input.kind, slug: written }, previous);
  redirect(`/admin/articles?kind=${input.kind}&saved=1`);
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  const kind = normalizeKind(String(formData.get("kind") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?error=Invalid+id");

  // Read before deleting — afterwards there is no row to learn the slug from,
  // and its page still needs clearing.
  const existing = await getArticleById(id);
  await deleteArticle(id);
  revalidateArticles(existing ? { kind: existing.kind, slug: existing.slug } : { kind, slug: "" });

  redirect(`/admin/articles?kind=${kind}&deleted=1`);
}
