"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { categories } from "@/lib/data/categories";
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  updateProperty,
  type PropertyInput,
} from "@/lib/db/queries";
import type { PropertyBadgeVariant } from "@/lib/types";

/**
 * Server Actions are publicly reachable endpoints — being rendered behind an
 * authenticated layout does NOT protect them. Every action re-checks the session
 * itself.
 */
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Taken from the category list so a category added there is accepted here too. */
const BADGE_VARIANTS: PropertyBadgeVariant[] = categories.map((category) => category.variant);

function parseJsonArray<T>(value: FormDataEntryValue | null): T[] {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPropertyInput(form: FormData): PropertyInput {
  const rawVariant = str(form, "badgeVariant") as PropertyBadgeVariant;
  const badgeVariant = BADGE_VARIANTS.includes(rawVariant) ? rawVariant : "residential";

  const developerName = str(form, "developerName");

  return {
    slug: str(form, "slug"),
    title: str(form, "title"),
    category: str(form, "category"),
    badgeVariant,
    badgeText: str(form, "badgeText") || badgeVariant,
    location: str(form, "location"),
    price: str(form, "price"),
    priceNote: str(form, "priceNote"),
    beds: str(form, "beds"),
    area: str(form, "area"),
    description: str(form, "description"),
    mapUrl: str(form, "mapUrl"),
    images: parseJsonArray<string>(form.get("images")),
    specs: parseJsonArray(form.get("specs")),
    amenities: parseJsonArray(form.get("amenities")),
    faqs: parseJsonArray(form.get("faqs")),
    experts: parseJsonArray(form.get("experts")),
    relatedIds: str(form, "relatedIds")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((n) => Number.isInteger(n) && n > 0),
    developer: developerName
      ? {
          name: developerName,
          logo: str(form, "developerLogo"),
          about: str(form, "developerAbout"),
        }
      : null,
    isFeatured: form.get("isFeatured") === "on",
    isPublished: form.get("isPublished") === "on",
    sortOrder: Number(str(form, "sortOrder")) || 0,
  };
}

/**
 * Public pages that render property data, refreshed after every write.
 *
 * Takes every slug the write touched, not just the current one: renaming a
 * listing has to clear the page at its old address too, and deleting one has to
 * clear the page that no longer exists — otherwise the stale copy keeps being
 * served from the prerendered output.
 */
function revalidateProperties(...slugs: (string | undefined | null)[]) {
  revalidatePath("/properties");
  revalidatePath("/");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/properties/${slug}`);
  }
}

export async function savePropertyAction(formData: FormData): Promise<void> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");
  const input = readPropertyInput(formData);

  if (!input.title) {
    redirect(`/admin/properties/${idValue || "new"}?error=Title+is+required`);
  }

  let written: string;
  let previousSlug: string | undefined;

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) redirect("/admin/properties?error=Invalid+id");
    // Read before writing so a renamed listing can clear its old URL.
    previousSlug = (await getPropertyById(id))?.slug;
    ({ slug: written } = await updateProperty(id, input));
  } else {
    ({ slug: written } = await createProperty(input));
  }

  revalidateProperties(written, previousSlug);
  revalidatePath("/admin/properties");
  redirect("/admin/properties?saved=1");
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  await requireUser();

  const id = Number(String(formData.get("id") ?? ""));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/properties?error=Invalid+id");

  // Read before deleting — afterwards there is no row to learn the slug from,
  // and its detail page still needs clearing.
  const deletedSlug = (await getPropertyById(id))?.slug;
  await deleteProperty(id);
  revalidateProperties(deletedSlug);
  revalidatePath("/admin/properties");
  redirect("/admin/properties?deleted=1");
}
