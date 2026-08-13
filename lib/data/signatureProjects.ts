import { getPropertyById, type PropertyDetail } from "@/lib/data/propertyDetails";
import type { PropertyBadgeVariant } from "@/lib/types";

export type SignatureProject = {
  image: string;
  title: string;
  city: string;
  location: string;
  price: string;
  badgeText: string;
  badgeVariant: PropertyBadgeVariant;
  href: string;
};

// The exact per-city sets the live homepage's "Signature Projects" tabs show.
const cityListings: { city: string; ids: number[] }[] = [
  { city: "Gurgaon", ids: [142, 141, 140, 139, 138, 137, 136, 135] },
  { city: "Manesar", ids: [117, 16, 7] },
  { city: "Delhi", ids: [80, 53, 52, 38, 22, 21, 20, 19] },
  { city: "Noida", ids: [8] },
];

export const signatureProjects: SignatureProject[] = cityListings.flatMap(({ city, ids }) =>
  ids
    .map((id) => getPropertyById(id))
    .filter((property): property is PropertyDetail => property !== undefined)
    .map((property) => ({
      image: property.images[0],
      title: property.title,
      city,
      location: property.location,
      price: property.price,
      badgeText: property.category,
      badgeVariant: property.badgeVariant,
      href: `/properties/${property.slug}`,
    }))
);
