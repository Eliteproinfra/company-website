"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createDeveloper,
  deleteDeveloper,
  DuplicateDeveloperName,
  updateDeveloper,
  type DeveloperInput,
} from "@/lib/db/queries";

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

function readDeveloperInput(form: FormData): DeveloperInput {
  return {
    name: str(form, "name"),
    logo: str(form, "logo"),
    about: str(form, "about"),
    experience: str(form, "experience"),
    projects: str(form, "projects"),
    delivered: str(form, "delivered"),
  };
}

export async function saveDeveloperAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const isNew = !idValue || idValue === "new";
  const back = `/admin/developers/${isNew ? "new" : idValue}`;
  const input = readDeveloperInput(formData);

  if (!input.name) redirect(`${back}?error=${encodeURIComponent("A name is required.")}`);

  let changedSlugs: string[] = [];
  try {
    if (isNew) {
      await createDeveloper(input);
    } else {
      const id = Number(idValue);
      if (!Number.isInteger(id) || id <= 0) redirect("/admin/developers?error=Invalid+id");
      changedSlugs = await updateDeveloper(id, input);
    }
  } catch (error) {
    if (error instanceof DuplicateDeveloperName) {
      redirect(`${back}?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  // An edit rewrote the "About Developer" box on every listing using it.
  if (changedSlugs.length) {
    revalidatePath("/properties");
    for (const slug of changedSlugs) revalidatePath(`/properties/${slug}`);
  }
  revalidatePath("/admin/developers");
  redirect("/admin/developers?saved=1");
}

export async function deleteDeveloperAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/developers?error=Invalid+id");

  const deleted = await deleteDeveloper(id);
  if (!deleted) {
    redirect(
      `/admin/developers?error=${encodeURIComponent(
        "That developer is still used by one or more properties. Pick a different developer on those listings first, then delete it."
      )}`
    );
  }
  revalidatePath("/admin/developers");
  redirect("/admin/developers?deleted=1");
}
