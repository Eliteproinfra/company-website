import type { CategoryItem } from "@/lib/types";

/** Live /properties `.category-card`s: every badge reads "Category", every subtitle "Explore properties". */
export const categories: CategoryItem[] = [
  {
    image: "/images/property-categories/cat_1773829073_69ba7bd16f4e4.jpg",
    badge: "Category",
    title: "Commercial",
    subtitle: "Explore properties",
  },
  {
    image: "/images/property-categories/cat_1775596616_69d574489add5.png",
    badge: "Category",
    title: "Industrial Plots",
    subtitle: "Explore properties",
  },
  {
    image: "/images/property-categories/cat_1773829112_69ba7bf8e0155.jpg",
    badge: "Category",
    title: "Residential",
    subtitle: "Explore properties",
  },
  {
    image: "/images/property-categories/cat_1773829129_69ba7c0908559.jpg",
    badge: "Category",
    title: "SCO Plots",
    subtitle: "Explore properties",
  },
];

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
