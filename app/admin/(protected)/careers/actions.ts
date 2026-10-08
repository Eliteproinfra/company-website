"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createJob,
  deleteJob,
  setJobVisibility,
  updateJob,
  type JobInput,
} from "@/lib/db/queries";

/** Public pages that render job data, refreshed after every write. */
function revalidateCareers() {
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
}

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** One bullet per line, blanks dropped — the editor presents these as textareas
 *  rather than a repeater because they are plain sentences, often a dozen of
 *  them, usually pasted in from a job description. */
function lines(form: FormData, key: string): string[] {
  return str(form, key)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function readJobInput(form: FormData): JobInput {
  return {
    title: str(form, "title"),
    department: str(form, "department"),
    location: str(form, "location"),
    type: str(form, "type"),
    experience: str(form, "experience"),
    summary: str(form, "summary"),
    qualifications: lines(form, "qualifications"),
    responsibilities: lines(form, "responsibilities"),
    isPublished: form.get("isPublished") === "on",
    sortOrder: Number(str(form, "sortOrder")) || 0,
  };
}

export async function saveJobAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const input = readJobInput(formData);
  if (!input.title) {
    redirect(`/admin/careers/${idValue || "new"}?error=Title+is+required`);
  }

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/careers?error=Invalid+id");
    await updateJob(id, input);
  } else {
    await createJob(input);
  }

  revalidateCareers();
  redirect("/admin/careers?saved=1");
}

/** The listing page's publish checkbox and order box. Touches only those two
 *  columns — see setJobVisibility for why it is not a full save. */
export async function setJobVisibilityAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/careers?error=Invalid+id");

  await setJobVisibility(
    id,
    formData.get("isPublished") === "on",
    Number(str(formData, "sortOrder")) || 0
  );

  revalidateCareers();
  redirect("/admin/careers?saved=1");
}

export async function deleteJobAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/careers?error=Invalid+id");

  await deleteJob(id);
  revalidateCareers();
  redirect("/admin/careers?deleted=1");
}
