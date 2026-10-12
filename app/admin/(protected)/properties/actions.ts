"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import type { EditorFormState } from "@/components/admin/EditorForm";
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

/**
 * Thrown when a repeater's hidden JSON field arrives unreadable. Carries the
 * field name so the admin is told which section failed rather than just that
 * something did.
 */
class MalformedField extends Error {
  constructor(readonly field: string) {
    super(`The "${field}" field could not be read.`);
    this.name = "MalformedField";
  }
}

/**
 * Every repeater on the form — images, specs, amenities, furnishings, floor
 * plans, nearby landmarks, videos, reviews, price trends, FAQs, experts —
 * posts its rows as JSON in a hidden input. An empty or absent field is
 * legitimately an empty list; a field that is present but unreadable is a bug,
 * and the two must not be treated the same.
 *
 * This used to `return []` on a parse failure, which was silent data loss of
 * the worst kind: the empty array went straight into updateProperty, which
 * overwrites the column unconditionally, so a truncated or corrupted payload
 * wiped every photo and amenity off a published listing — and the admin was
 * redirected to "Saved." with no indication anything had gone wrong and no way
 * to get the images back. Refusing the write is always better than destroying
 * a row to keep a form submission looking successful.
 */
function parseJsonArray<T>(value: FormDataEntryValue | null, field: string): T[] {
  if (typeof value !== "string" || !value.trim()) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new MalformedField(field);
  }
  // Valid JSON of the wrong shape ("{}", "null", a bare string) is just as
  // wrong as unparseable JSON, and used to fall into the same silent [].
  if (!Array.isArray(parsed)) throw new MalformedField(field);

  return parsed as T[];
}

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPropertyInput(form: FormData): PropertyInput {
  const rawVariant = str(form, "badgeVariant") as PropertyBadgeVariant;
  const badgeVariant = BADGE_VARIANTS.includes(rawVariant) ? rawVariant : "residential";

  const developerName = str(form, "developerName");

  const projectStatus = str(form, "projectStatus");
  const projectSize = str(form, "projectSize");
  const projectConfigurations = str(form, "projectConfigurations");
  const projectPriceRange = str(form, "projectPriceRange");
  const projectRera = str(form, "projectRera");
  // One bullet per line, the way the careers admin takes its lists.
  const projectHighlights = str(form, "projectHighlights")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
    images: parseJsonArray<string>(form.get("images"), "Images"),
    specs: parseJsonArray(form.get("specs"), "Specifications"),
    amenities: parseJsonArray(form.get("amenities"), "Amenities"),
    faqs: parseJsonArray(form.get("faqs"), "FAQs"),
    experts: parseJsonArray(form.get("experts"), "Experts"),
    keyFacts: parseJsonArray(form.get("keyFacts"), "Key facts"),
    furnishings: parseJsonArray(form.get("furnishings"), "Furnishing details"),
    floorPlans: parseJsonArray(form.get("floorPlans"), "Floor plans"),
    nearby: parseJsonArray(form.get("nearby"), "Nearby landmarks"),
    videos: parseJsonArray(form.get("videos"), "Videos"),
    reviews: parseJsonArray(form.get("reviews"), "Reviews"),
    priceTrends: parseJsonArray(form.get("priceTrends"), "Price trends"),
    // Stored as one object or not at all, like `developer`: the whole "About
    // the project" box is hidden when every field of it is blank, and writing
    // {} instead of null would make the empty box render.
    projectInfo: projectStatus ||
    projectSize ||
    projectConfigurations ||
    projectPriceRange ||
    projectRera ||
    projectHighlights.length
      ? {
          status: projectStatus,
          size: projectSize,
          configurations: projectConfigurations,
          priceRange: projectPriceRange,
          rera: projectRera,
          highlights: projectHighlights,
        }
      : null,
    relatedIds: str(form, "relatedIds")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((n) => Number.isInteger(n) && n > 0),
    developer: developerName
      ? {
          name: developerName,
          logo: str(form, "developerLogo"),
          about: str(form, "developerAbout"),
          experience: str(form, "developerExperience"),
          projects: str(form, "developerProjects"),
          delivered: str(form, "developerDelivered"),
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

/**
 * A refusal is RETURNED, never redirected to.
 *
 * This used to `redirect()` back to the editor with `?error=…`, which re-renders
 * the page from the server and so discarded everything the editor holds in React
 * state: every uploaded photo, every repeater row, every amenity. For a new
 * listing those rebuild from an empty `defaultValue`, so one refused save threw
 * away an afternoon's work and, from down at the Gallery section, looked exactly
 * like the image upload had silently failed. Returning the message instead keeps
 * the page mounted — see components/admin/EditorForm.
 *
 * Success still redirects: there is nothing left to preserve once the row is
 * written, and the listing page is where the author wants to end up.
 */
export async function savePropertyAction(
  _state: EditorFormState,
  formData: FormData
): Promise<EditorFormState> {
  await requireUser();

  const idValue = String(formData.get("id") ?? "");

  // Read before writing anything. A MalformedField here means the submission
  // cannot be trusted to describe the listing, so nothing is saved and the
  // admin is told which section failed — the alternative, which this used to
  // do, was to save it with that section blanked out.
  let input: PropertyInput;
  try {
    input = readPropertyInput(formData);
  } catch (error) {
    if (error instanceof MalformedField) {
      console.error(`[admin] refused a property save: ${error.message}`);
      return {
        error: `${error.message} Nothing was saved, and nothing on this page has been lost — fix that section and save again.`,
      };
    }
    throw error;
  }

  if (!input.title) {
    return { error: "Title is required." };
  }

  let written: string;
  let previousSlug: string | undefined;

  if (idValue && idValue !== "new") {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id <= 0) {
      return { error: "That listing id is not valid. Reload the page and try again." };
    }
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
