import type { CategoryItem } from "@/lib/types";

/** Live /properties `.category-card`s: every badge reads "Category", every subtitle "Explore properties".
 *
 *  This is the one running order for the header dropdown, the category cards and the
 *  Property Type filter — list order, not A-Z, so the categories can be arranged by
 *  how the business wants them read rather than by spelling. */
export const categories: CategoryItem[] = [
  {
    image: "/images/property-categories/cat_1773829112_69ba7bf8e0155.jpg",
    badge: "Category",
    title: "Residential",
    subtitle: "Explore properties",
    variant: "residential",
  },
  {
    image: "/images/property-categories/cat_1773829073_69ba7bd16f4e4.jpg",
    badge: "Category",
    title: "Commercial",
    subtitle: "Explore properties",
    variant: "commercial",
  },
  {
    image: "/images/property-categories/cat_1773829129_69ba7c0908559.jpg",
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
    image: "/images/property-categories/cat_1773828639_69ba7a1f2c5ab.jpg",
    badge: "Category",
    title: "Residential Plots",
    subtitle: "Explore properties",
    variant: "residential-plots",
  },
];

/** Property Type dropdown options on /properties — "All Types" then the categories in order. */
export const propertyTypeOptions: string[] = [
  "All Types",
  ...categories.map((category) => category.title),
];

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
