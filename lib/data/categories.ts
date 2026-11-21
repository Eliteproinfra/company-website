import type { CategoryItem, PropertyStage } from "@/lib/types";

/** Live /properties `.category-card`s: every badge reads "Category", every subtitle "Explore properties".
 *
 *  This is the one running order for the header dropdown, the category cards and the
 *  Property Type filter — list order, not A-Z, so the categories can be arranged by
 *  how the business wants them read rather than by spelling. */
export const categories: CategoryItem[] = [
  {
    image: "/images/properties/gallery_1777363429_69f069e5787db.webp",
    badge: "Category",
    title: "Residential",
    subtitle: "Explore properties",
    variant: "residential",
  },
  {
    image: "/images/properties/prop_1784286795_6a5a0e4ba6f05.jpeg",
    badge: "Category",
    title: "Commercial",
    subtitle: "Explore properties",
    variant: "commercial",
  },
  {
    image: "/images/properties/prop_1779782420_6a155314a6343.webp",
    badge: "Category",
    title: "SCO Plots",
    subtitle: "Explore properties",
    variant: "sco",
  },
  {
    image: "/images/property-categories/cat_1775596616_69d574489add5.png",
    badge: "Category",
    title: "Industrial Plots",
    subtitle: "Explore properties",
    variant: "industrial",
  },
  {
    image: "/images/property-categories/residential-plots-layout.webp",
    badge: "Category",
    title: "Residential Plots",
    subtitle: "Explore properties",
    variant: "residential-plots",
  },
];

/** Construction-stage options, filtered on the listing's Status rather than its category. */
export const typeToStage: Record<string, PropertyStage> = {
  "Ready To Move": "ready-to-move",
  "Under Construction": "under-construction",
  "New Launch": "new-launch",
  "Nearing Possession": "nearing-possession",
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** The last day of the possession date named in text such as "Dec 2027",
 *  "Possession: March, 2027", "Q2 2027" or "2028". */
function possessionDue(text: string): Date | undefined {
  const month = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?[\s,'-]*(20\d\d)\b/);
  if (month) return new Date(Number(month[2]), MONTHS.indexOf(month[1]) + 1, 0);
  const quarter = text.match(/\bq([1-4])[\s,'-]*(?:fy)?[\s-]*(20\d\d)\b/);
  if (quarter) return new Date(Number(quarter[2]), Number(quarter[1]) * 3, 0);
  const year = text.match(/\b(20\d\d)\b/);
  if (year) return new Date(Number(year[1]), 12, 0);
  return undefined;
}

/** Property Type dropdown options on /properties — "All Types", then the categories in order. */
export const propertyTypeOptions: string[] = [
  "All Types",
  ...categories.map((category) => category.title),
];

/** Construction Status dropdown options on /properties — "Any Status", then the stages. */
export const propertyStatusOptions: string[] = ["Any Status", ...Object.keys(typeToStage)];

/**
 * Reads a stage out of free text such as "Ready To Move", "New Launch", "Under
 * Construction" or "Possession Dec 2027" — the listing's Status and Possession
 * fact, joined. A possession date within the next twelve months makes an
 * under-construction listing Nearing Possession; a later one, Under Construction.
 * A date already past says nothing on its own (handed over, or running late).
 */
export function stageFromText(
  text: string | undefined,
  now: Date = new Date()
): PropertyStage | undefined {
  const value = text?.toLowerCase() ?? "";
  if (/ready\s*-?\s*to\s*-?\s*move|ready for possession|immediate possession/.test(value)) {
    return "ready-to-move";
  }
  if (/nearing\s+possession|possession\s+soon/.test(value)) return "nearing-possession";
  if (/new(?:ly)?\s*-?\s*launch|pre\s*-?\s*launch/.test(value)) return "new-launch";

  const due = possessionDue(value);
  if (due && due >= now) {
    const yearOut = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    return due <= yearOut ? "nearing-possession" : "under-construction";
  }
  if (/under\s*-?\s*construction/.test(value)) return "under-construction";
  return undefined;
}

/** Property Type label -> the `badgeVariant` the listings carry, for the /properties filter. */
export const typeToVariant: Record<string, CategoryItem["variant"]> = Object.fromEntries(
  categories.map((category) => [category.title, category.variant])
);

/**
 * The `?category=` slug that preselects a Property Type on /properties — the one
 * spelling shared by the header dropdown, the category cards and the browser, so
 * a renamed category cannot leave a link pointing at a filter that no longer exists.
 */
export function categorySlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

/** The /properties link that lands on this category, pre-filtered. */
export function categoryHref(title: string): string {
  return `/properties?category=${categorySlug(title)}`;
}

/** Resolves `?category=` back to the Property Type label the browser filters on.
 *  Returns undefined for a missing or unrecognised slug, which shows everything. */
export function typeFromCategorySlug(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  return categories.find((category) => categorySlug(category.title) === slug)?.title;
}
