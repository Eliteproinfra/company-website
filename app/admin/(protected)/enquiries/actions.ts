"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteEnquiry, markEnquiryRead } from "@/lib/db/queries";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

/**
 * `?page=` for the redirect back, so marking the fourth page of leads read
 * returns to the fourth page instead of the top of the inbox.
 *
 * Re-derived from the form rather than trusted: the value is turned into a
 * number and only a positive integer is kept, so it cannot smuggle anything
 * into the redirect target.
 */
function pageQuery(formData: FormData): string {
  const page = Math.trunc(Number(String(formData.get("page") ?? "")));
  return Number.isFinite(page) && page > 1 ? `&page=${page}` : "";
}

export async function toggleEnquiryReadAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/enquiries?error=Invalid+id");

  await markEnquiryRead(id, String(formData.get("read") ?? "") === "1");
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  // `saved=1` is the flash param AdminNotice already understands, and the
  // other admin sections use it for the same purpose. Marking read used to
  // redirect with no confirmation at all.
  redirect(`/admin/enquiries?saved=1${pageQuery(formData)}`);
}

export async function deleteEnquiryAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/enquiries?error=Invalid+id");

  await deleteEnquiry(id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect(`/admin/enquiries?deleted=1${pageQuery(formData)}`);
}
