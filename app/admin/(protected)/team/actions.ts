"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
  type TeamMemberInput,
} from "@/lib/db/queries";
import { DEPARTMENT_BASE, normalizeDepartment } from "./departments";

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

function readTeamMemberInput(form: FormData): TeamMemberInput {
  return {
    department: normalizeDepartment(str(form, "department")),
    name: str(form, "name"),
    title: str(form, "title"),
    experience: str(form, "experience"),
    photo: str(form, "photo"),
    phone: str(form, "phone"),
    email: str(form, "email"),
    linkedin: str(form, "linkedin"),
    isPublished: form.get("isPublished") === "on",
    sortOrder: Number(str(form, "sortOrder")) || 0,
  };
}

export async function saveTeamMemberAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const input = readTeamMemberInput(formData);

  if (!input.name) {
    redirect(
      `/admin/team/${idValue || "new"}?department=${input.department}&error=A+name+is+required`
    );
  }

  // The department is editable, so an existing member may be moving between
  // pages — the one they came from has to be revalidated as well as the one
  // they land on.
  const previousDepartment = normalizeDepartment(str(formData, "previousDepartment"));

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/team?error=Invalid+id");
    await updateTeamMember(id, input);
  } else {
    await createTeamMember(input);
  }

  revalidatePath(DEPARTMENT_BASE[input.department]);
  revalidatePath(DEPARTMENT_BASE[previousDepartment]);
  revalidatePath("/admin/team");

  redirect(`/admin/team?department=${input.department}&saved=1`);
}

export async function deleteTeamMemberAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  const department = normalizeDepartment(String(formData.get("department") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/team?error=Invalid+id");

  await deleteTeamMember(id);
  revalidatePath(DEPARTMENT_BASE[department]);
  revalidatePath("/admin/team");

  redirect(`/admin/team?department=${department}&deleted=1`);
}
