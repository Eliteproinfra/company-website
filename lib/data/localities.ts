import type { LocalityItem } from "@/lib/types";

export const localities: LocalityItem[] = [
  {
    icon: "fas fa-map-marker-alt",
    name: "Golf Course Rd",
    area: "Gurgaon",
    city: "Gurgaon",
    keywords: ["Golf Course Road"],
  },
  {
    icon: "fas fa-road",
    name: "Dwarka Expy",
    area: "Gurgaon",
    city: "Gurgaon",
    keywords: ["Dwarka Expressway"],
  },
  {
    icon: "fas fa-tree",
    name: "New Gurgaon",
    area: "Sec 80-90",
    city: "Gurgaon",
    keywords: ["New Gurgaon"],
    sectors: [80, 90],
  },
  {
    icon: "fas fa-city",
    name: "Cyber City",
    area: "Gurgaon",
    city: "Gurgaon",
    keywords: ["Cyber City"],
  },
];

/** The `?locality=` slug a locality card links with. */
export function localitySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/** The /properties link that lands on this locality's listings. The hash carries
 *  the visitor past the locality and category rows to the grid that just changed. */
export function localityHref(name: string): string {
  return `/properties?locality=${localitySlug(name)}#listings`;
}

/** Resolves `?locality=` back to its card. Undefined for a missing or
 *  unrecognised slug, which shows everything. */
export function localityFromSlug(slug: string | null | undefined): LocalityItem | undefined {
  if (!slug) return undefined;
  return localities.find((locality) => localitySlug(locality.name) === slug);
}

/** Words that mean the copy is naming a place the project is *near*, not *in*:
 *  "seamless connectivity to Golf Course Road", "minutes from Cyber City". */
const PASSING_MENTION =
  /connect|access|close to|near|proximity|minutes|away|reach|hubs? like|roads? such as/i;

/** How far back from a place name to look for one of those words. Long enough to
 *  span a list — "connectivity to NH-48, MG Road, Sohna Road and Cyber City". */
const LOOKBEHIND = 90;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The locality slugs a listing belongs under, worked out from its own copy.
 *
 * A listing carries a city ("Gurgaon") but no locality field, so this reads the
 * description: a locality counts when it is named as where the project stands
 * ("located along Golf Course Road"), and not when it is only somewhere the
 * project connects to. Sector numbers count for a locality that is defined by a
 * range of them. Only localities of the listing's own city are considered, so a
 * Manesar project that compares itself to Golf Course Road is not filed there.
 */
export function localitiesInText(text: string, city: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);

  return localities
    .filter((locality) => {
      if (locality.city !== city) return false;
      const names = new RegExp(locality.keywords.map(escapeRegExp).join("|"), "gi");

      for (const sentence of sentences) {
        for (const match of sentence.matchAll(names)) {
          const before = sentence.slice(Math.max(0, match.index - LOOKBEHIND), match.index);
          if (!PASSING_MENTION.test(before)) return true;
        }

        if (locality.sectors) {
          const [from, to] = locality.sectors;
          for (const match of sentence.matchAll(/\bsec(?:tor)?[\s.-]*(\d{1,3})\b/gi)) {
            const sector = Number(match[1]);
            const before = sentence.slice(Math.max(0, match.index - LOOKBEHIND), match.index);
            if (sector >= from && sector <= to && !PASSING_MENTION.test(before)) return true;
          }
        }
      }
      return false;
    })
    .map((locality) => localitySlug(locality.name));
}
