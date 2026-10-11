"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createAward,
  deleteAward,
  moveAward,
  nextAwardSortOrder,
  updateAward,
} from "@/lib/db/queries";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

/** Every page that renders the gallery. The homepage carousel reads the same
 *  rows as /awards, so a reorder has to clear both. */
function revalidateAwards() {
  revalidatePath("/awards");
  revalidatePath("/");
  revalidatePath("/admin/awards");
}

function readId(formData: FormData): number {
  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/awards?error=Invalid+id");
  return id;
}

export async function addAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  const image = String(formData.get("image") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  if (!image) redirect("/admin/awards?error=An+image+path+is+required");

  // Blank means "put it last", which is what someone adding an award almost
  // always wants. Typing a number still overrides it.
  const typed = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = typed === "" ? await nextAwardSortOrder() : Number(typed) || 0;

  await createAward(image, caption, sortOrder);
  revalidateAwards();
  redirect("/admin/awards?saved=1");
}

export async function updateAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = readId(formData);
  const image = String(formData.get("image") ?? "").trim();

  // Saving a blank path would leave a card with a broken image and no way back
  // to the old one, so it is refused the same way adding one is.
  if (!image) redirect("/admin/awards?error=An+image+path+is+required");

  await updateAward(id, {
    image,
    caption: String(formData.get("caption") ?? "").trim(),
    sortOrder: Number(String(formData.get("sortOrder") ?? "")) || 0,
    isPublished: formData.get("isPublished") === "on",
  });

  revalidateAwards();
  redirect("/admin/awards?saved=1");
}

export async function moveAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = readId(formData);
  const direction = String(formData.get("direction") ?? "") === "up" ? -1 : 1;

  await moveAward(id, direction);
  revalidateAwards();
  redirect("/admin/awards?saved=1");
}

export async function deleteAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  await deleteAward(readId(formData));
  revalidateAwards();
  redirect("/admin/awards?deleted=1");
}
