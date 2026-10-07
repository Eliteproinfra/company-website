import type { PropertyBadgeVariant } from "@/lib/types";

/** One card in the homepage "Signature Projects" tabs. Built by
 *  lib/content/properties.ts `getSignatureProjects` from whatever the database
 *  holds, so adding a listing in the admin puts it on the homepage. */
export type SignatureProject = {
  image: string;
  title: string;
  /** Which tab the card sits under — the listing's location. */
  city: string;
  location: string;
  price: string;
  badgeText: string;
  badgeVariant: PropertyBadgeVariant;
  href: string;
};

/*
 * For reference: before the homepage grid was wired to the database it listed a
 * fixed set of ids per city, copied from the live site —
 *   Gurgaon  142, 141, 140, 139, 138, 137, 136, 135
 *   Manesar  117, 16, 7
 *   Delhi    80, 53, 52, 38, 22, 21, 20, 19
 *   Noida    8
 * The tabs are now derived from each listing's location instead, newest first,
 * with "Featured on the homepage" pinning a listing to the front of its tab.
 */
