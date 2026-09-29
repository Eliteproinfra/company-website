"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createJob, deleteJob, updateJob, type JobInput } from "@/lib/db/queries";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readJobInput(form: FormData): JobInput {
  return {
    title: str(form, "title"),
    department: str(form, "department"),
    location: str(form, "location"),
    type: str(form, "type"),
    experience: str(form, "experience"),
    isPublished: form.get("isPublished") === "on",
    sortOrder: Number(str(form, "sortOrder")) || 0,
  };
}

export async function saveJobAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const input = readJobInput(formData);
  if (!input.title) redirect("/admin/careers?error=Title+is+required");

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/careers?error=Invalid+id");
    await updateJob(id, input);
  } else {
    await createJob(input);
  }

  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  redirect("/admin/careers?saved=1");
}

export async function deleteJobAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/careers?error=Invalid+id");

  await deleteJob(id);
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  redirect("/admin/careers?deleted=1");
}
