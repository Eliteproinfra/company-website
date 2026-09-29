import type { IconTextItem, ProcessStepItem } from "@/lib/types";

/**
 * Live's "Why Owners Trust Us?" check-list, sitting under the section copy. Rendered as a
 * bold label plus sentence, so no per-item icon.
 */
export const pmTrustPoints: { title: string; description: string }[] = [
  { title: "Verified Tenants", description: "Rigorous background checks and credit scoring." },
  {
    title: "Proactive Maintenance",
    description: "Regular inspections to prevent costly repairs.",
  },
  { title: "Legal Safeguards", description: "Iron-clad rental agreements and dispute resolution." },
  {
    title: "Tech-Enabled",
    description: "Real-time dashboard for owners to track rent and expenses.",
  },
];

export const whyChooseUsFeatures: IconTextItem[] = [
  {
    icon: "fas fa-user-shield",
    title: "Safety First",
    description: "Tenant verification & security audits.",
  },
  {
    icon: "fas fa-wallet",
    title: "Max ROI",
    description: "Strategic pricing & minimal vacancy.",
  },
  { icon: "fas fa-tools", title: "Upkeep", description: "24/7 maintenance support." },
  {
    icon: "fas fa-file-contract",
    title: "Compliance",
    description: "Legal & tax assistance.",
  },
];

/** Live's "Full-Spectrum Management" — 8 core offerings, copy and icons match the PHP page. */
export const pmServices: IconTextItem[] = [
  {
    icon: "fas fa-search-location",
    title: "Tenant Discovery",
    description:
      "Marketing your property on premium platforms, conducting viewings, and selecting high-quality tenants.",
  },
  {
    icon: "fas fa-file-signature",
    title: "Lease Management",
    description:
      "Drafting legally sound agreements, handling renewals, and managing move-in/move-out formalities.",
  },
  {
    icon: "fas fa-hand-holding-usd",
    title: "Rent Collection",
    description: "Automated invoicing and follow-ups to ensure rent is deposited on time.",
  },
  {
    icon: "fas fa-hard-hat",
    title: "Maintenance & Repairs",
    description: "Coordinating with vetted vendors for all maintenance work.",
  },
  {
    icon: "fas fa-clipboard-check",
    title: "Regular Inspections",
    description: "Periodic property visits with detailed reports.",
  },
  {
    icon: "fas fa-file-invoice-dollar",
    title: "Financial Reporting",
    description: "Quarterly statements of income and expenses.",
  },
  {
    icon: "fas fa-headset",
    title: "Tenant Support",
    description: "Responsive support for tenant queries and requests.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Yield Optimization",
    description: "Data-backed recommendations to improve rental yield.",
  },
];

/** Live's 4-stage workflow. */
export const processSteps: ProcessStepItem[] = [
  {
    number: "01",
    title: "Onboarding",
    description: "Initial audit and recommendations to make the property market-ready.",
  },
  {
    number: "02",
    title: "Marketing & Tenant Search",
    description: "Listings and screening to find the right tenant.",
  },
  {
    number: "03",
    title: "Agreement & Move-In",
    description: "Paperwork, deposit collection, and move-in checks.",
  },
  {
    number: "04",
    title: "Ongoing Management",
    description: "Rent collection, maintenance, and owner updates.",
  },
];
