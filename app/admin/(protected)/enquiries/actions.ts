"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteEnquiry, markEnquiryRead } from "@/lib/db/queries";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

export async function toggleEnquiryReadAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/enquiries?error=Invalid+id");

  await markEnquiryRead(id, String(formData.get("read") ?? "") === "1");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/enquiries?error=Invalid+id");

  await deleteEnquiry(id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect("/admin/enquiries?deleted=1");
}
