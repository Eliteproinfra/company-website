"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createAward, deleteAward } from "@/lib/db/queries";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

export async function addAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  const image = String(formData.get("image") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") ?? "")) || 0;

  if (!image) redirect("/admin/awards?error=An+image+path+is+required");

  await createAward(image, caption, sortOrder);
  revalidatePath("/awards");
  revalidatePath("/");
  revalidatePath("/admin/awards");
  redirect("/admin/awards?saved=1");
}

export async function deleteAwardAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/awards?error=Invalid+id");

  await deleteAward(id);
  revalidatePath("/awards");
  revalidatePath("/");
  revalidatePath("/admin/awards");
  redirect("/admin/awards?deleted=1");
}
