"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createArticle,
  deleteArticle,
  updateArticle,
  type ArticleInput,
} from "@/lib/db/queries";
import { KIND_BASE, normalizeKind } from "./kinds";

/** Server Actions are public endpoints; the authenticated layout does not cover them. */
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
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

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?error=Invalid+id");
    await updateArticle(id, input);
  } else {
    await createArticle(input);
  }

  const base = KIND_BASE[input.kind];
  revalidatePath(base);
  if (input.slug) revalidatePath(`${base}/${input.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/articles");

  redirect(`/admin/articles?kind=${input.kind}&saved=1`);
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  const kind = normalizeKind(String(formData.get("kind") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?error=Invalid+id");

  await deleteArticle(id);
  revalidatePath(KIND_BASE[kind]);
  revalidatePath("/");
  revalidatePath("/admin/articles");

  redirect(`/admin/articles?kind=${kind}&deleted=1`);
}
