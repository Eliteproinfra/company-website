import { categories, categoryHref } from "@/lib/data/categories";

export type NavLeaf = { label: string; href: string; children?: NavLeaf[] };
export type NavItem = { label: string; href?: string; children?: NavLeaf[] };

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story & Journey", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Social Commitment (CSR)", href: "/social-commitment" },
      {
        label: "Our Management",
        href: "/about/sales-portfolio-management",
        children: [
          { label: "Sales Portfolio management", href: "/about/sales-portfolio-management" },
          { label: "Leasing Portfolio management", href: "/about/leasing-portfolio-management" },
          { label: "CRM & Marketing", href: "/about/crm-marketing" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services/property-management",
    children: [
      { label: "Investment Sales Advisory", href: "/services/investment-sales-advisory" },
      { label: "NRI Advisory", href: "/services/nri-advisory" },
      { label: "Property Management", href: "/services/property-management" },
      { label: "Land & Acquisition", href: "/services/land-acquisition" },
    ],
  },
  {
    label: "Properties",
    href: "/properties",
    children: [
      { label: "All Properties", href: "/properties" },
      // Built from the category list so a rename cannot leave these pointing at a
      // ?category= slug the browser no longer recognises, and in that list's own
      // order so the dropdown, the cards and the filter all read the same way.
      ...categories.map((category) => ({ label: category.title, href: categoryHref(category.title) })),
    ],
  },
  {
    label: "Media & Insights",
    href: "/media-press",
    children: [
      { label: "Media & Press", href: "/media-press" },
      { label: "Insights & Blogs", href: "/insights-blog" },
      { label: "News & Updates", href: "/news-updates" },
      { label: "Life at Elite Pro Infra", href: "/life-at-elite" },
      { label: "Awards & Recognitions", href: "/awards" },
    ],
  },
  { label: "NRI Corner", href: "/nri-corner" },
  { label: "Careers", href: "/careers" },
];
