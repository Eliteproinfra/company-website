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
      { label: "Commercial", href: "/properties?category=commercial" },
      { label: "Industrial Plots", href: "/properties?category=industrial-plots" },
      { label: "Residential", href: "/properties?category=residential" },
      { label: "SCO Plots", href: "/properties?category=sco-plots" },
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
