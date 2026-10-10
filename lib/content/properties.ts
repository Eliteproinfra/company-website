/**
 * What the public property pages render — SERVER ONLY.
 *
 * The database when it is configured and has rows, the hardcoded
 * lib/data/propertyDetails.ts otherwise. Same contract as lib/content/teams.ts,
 * and for the same reasons: `npm run export` builds the static site on a machine
 * that may have no MySQL at all, and a database that is configured but
 * unreachable should fall back rather than 500 the listing pages.
 *
 * This is the ONLY place the public site reads properties from. Pages import
 * from here, never from lib/db/queries or lib/data/propertyDetails directly, so
 * there is one conversion from the database row shape to the render shape and
 * one fallback rule.
 *
 * Writes go the other way: the admin's savePropertyAction revalidates
 * /properties, /properties/[slug] and / so an edit is visible without a rebuild.
 */
import "server-only";
import { cache } from "react";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listProperties, type PropertyRecord } from "@/lib/db/queries";
import { propertyDetails, type PropertyDetail } from "@/lib/data/propertyDetails";
import { partnerForListing, partnerSlug } from "@/lib/data/partners";
import type { SignatureProject } from "@/lib/data/signatureProjects";
import type { PropertyItem } from "@/lib/types";

/** Homepage tabs, in the live site's order. Cities the database knows about but
 *  this list does not are appended, so a listing in a new city still surfaces. */
const CITY_ORDER = ["Gurgaon", "Manesar", "Delhi", "Noida"];

/** Cards per city tab on the homepage — live shows at most eight. */
const SIGNATURE_PER_CITY = 8;

function toDetail(record: PropertyRecord): PropertyDetail {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    category: record.category,
    badgeVariant: record.badge_variant,
    location: record.location,
    price: record.price,
    priceNote: record.price_note,
    images: record.images,
    specs: record.specs,
    // The detail page hides these sections when they are absent, so an empty
    // column has to become undefined rather than "".
    description: record.description || undefined,
    amenities: record.amenities,
    mapUrl: record.map_url || undefined,
    developer: record.developer ?? undefined,
    faqs: record.faqs,
    experts: record.experts,
    relatedIds: record.relatedIds,
    beds: record.beds || undefined,
    area: record.area || undefined,
    isFeatured: Boolean(record.is_featured),
  };
}

/**
 * Every published listing, in the order the admin's sort order defines.
 *
 * `cache` dedupes this within a single render: the detail route alone would
 * otherwise query once in generateStaticParams, once in generateMetadata and
 * once in the page body.
 */
export const getProperties = cache(async (): Promise<PropertyDetail[]> => {
  if (!isDatabaseConfigured()) return propertyDetails;

  try {
    const records = await listProperties();
    // No rows means the seed has not been run, not that the catalogue is empty.
    if (records.length === 0) return propertyDetails;
    return records.map(toDetail);
  } catch (error) {
    console.error("[properties] database unavailable, serving the static catalogue:", error);
    return propertyDetails;
  }
});

export async function getPropertyBySlug(slug: string): Promise<PropertyDetail | undefined> {
  return (await getProperties()).find((property) => property.slug === slug);
}

export async function getPropertyById(id: number): Promise<PropertyDetail | undefined> {
  return (await getProperties()).find((property) => property.id === id);
}

/** The card shape the /properties grid and the related-properties strip render. */
export function toPropertyItem(property: PropertyDetail): PropertyItem {
  const partner = partnerForListing({
    title: property.title,
    developer: property.developer?.name,
  });

  return {
    image: property.images[0] ?? "",
    badgeText: property.category,
    badgeVariant: property.badgeVariant,
    title: property.title,
    location: property.location,
    beds: property.beds,
    area: property.area,
    price: property.price,
    href: `/properties/${property.slug}`,
    developerSlug: partner && partnerSlug(partner.name),
  };
}

/** Cards for the /properties "Featured Collection" grid — every published listing. */
export async function getPropertyListItems(): Promise<PropertyItem[]> {
  return (await getProperties()).map(toPropertyItem);
}

/**
 * The homepage "Signature Projects" tabs: listings grouped by location, each tab
 * capped at {@link SIGNATURE_PER_CITY}.
 *
 * Within a city, listings flagged "Featured on the homepage" come first; the rest
 * follow in the admin's sort order, which getProperties has already applied. A
 * newly added listing therefore appears in its city's tab straight away, and
 * ticking Featured pins it to the front.
 */
export async function getSignatureProjects(): Promise<SignatureProject[]> {
  const properties = await getProperties();

  const byCity = new Map<string, PropertyDetail[]>();
  for (const property of properties) {
    if (!property.location) continue;
    const bucket = byCity.get(property.location);
    if (bucket) bucket.push(property);
    else byCity.set(property.location, [property]);
  }

  const cities = [
    ...CITY_ORDER.filter((city) => byCity.has(city)),
    ...[...byCity.keys()].filter((city) => !CITY_ORDER.includes(city)),
  ];

  return cities.flatMap((city) =>
    (byCity.get(city) ?? [])
      // Stable: getProperties is already in sort order, and only the featured
      // flag reorders it, so unfeatured listings keep their relative places.
      .slice()
      .sort((a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false))
      .slice(0, SIGNATURE_PER_CITY)
      .map((property) => ({
        image: property.images[0] ?? "",
        title: property.title,
        city,
        location: property.location,
        price: property.price,
        badgeText: property.category,
        badgeVariant: property.badgeVariant,
        href: `/properties/${property.slug}`,
      }))
  );
}
