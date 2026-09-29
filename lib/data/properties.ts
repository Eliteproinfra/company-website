import type { PropertyItem } from "@/lib/types";
import { propertyDetails } from "@/lib/data/propertyDetails";

/**
 * The live /properties "Featured Collection" is every listing, newest first, nine per page.
 * Derived from the detail records so titles, prices, badges and hero images stay in sync.
 */
export const featuredProperties: PropertyItem[] = propertyDetails
  .filter((property) => property.id >= 112)
  .map((property) => ({
    image: property.images[0],
    badgeText: property.category,
    badgeVariant: property.badgeVariant,
    title: property.title,
    location: property.location,
    price: property.price,
    href: `/properties/${property.slug}`,
  }));
