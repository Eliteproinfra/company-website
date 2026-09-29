import type { FaqItem } from "@/lib/data/faq";
import type { IconTextItem, Stat } from "@/lib/types";

/**
 * Live's "Why Invest in India Now?" boxes. Each carries a supporting sentence under the
 * label, so this is a Stat plus a `detail` line rather than a bare Stat.
 */
export const nriMarketInsights: (Stat & { detail: string })[] = [
  {
    value: "4th",
    label: "Largest Economy by 2025",
    detail:
      "India is on track to become a global economic powerhouse, driving real estate demand.",
  },
  {
    value: "138B",
    label: "NRI Remittances (2024-25)",
    detail: "Record-breaking inflows indicate growing global trust in Indian assets.",
  },
  {
    value: "12-15%",
    label: "Average CRE Returns",
    detail:
      "Commercial Real Estate in India offers significantly higher yields than global averages.",
  },
];

export const eliteAdvantage: IconTextItem[] = [
  {
    icon: "fas fa-laptop",
    title: "Digital Onboarding",
    description:
      "No need to travel. Complete KYC and documentation digitally from anywhere in the world.",
  },
  {
    icon: "fas fa-scale-balanced",
    title: "FEMA & Tax Compliance",
    description: "Expert guidance on NRE/NRO accounts, capital gains, and repatriation rules.",
  },
  {
    icon: "fas fa-hand-holding-heart",
    title: "Post-Investment Care",
    description: "From property management to rental collection and resale support.",
  },
];

/** Live's "Tailored NRI Services" cards — copy matches nri-advisory.php verbatim. */
export const nriExpertise: IconTextItem[] = [
  {
    icon: "fas fa-house-circle-check",
    title: "Property Acquisition",
    description:
      "Access to pre-launch offers and Grade-A commercial assets across India's top metros.",
  },
  {
    icon: "fas fa-briefcase",
    title: "Portfolio Management",
    description: "Active monitoring and rebalancing of your real estate portfolio to maximize ROI.",
  },
  {
    icon: "fas fa-gavel",
    title: "Legal & Tax Advisory",
    description:
      "Seamless coordination with chartered accountants and lawyers for full compliance.",
  },
  {
    icon: "fas fa-key",
    title: "Property Management",
    description: "Tenant screening, rent collection, and property maintenance services.",
  },
  {
    icon: "fas fa-hand-holding-dollar",
    title: "Loan Assistance",
    description:
      "Facilitating home loans for NRIs with leading Indian banks at competitive rates.",
  },
  {
    icon: "fas fa-arrows-rotate",
    title: "Resale & Liquidation",
    description: "Strategic exit planning to help you liquidate assets at the right time.",
  },
];

export const nriFaqs: FaqItem[] = [
  {
    question: "Can NRIs buy property in India?",
    answer:
      "Yes, NRIs are allowed to purchase both residential and commercial properties in India under FEMA guidelines. However, they cannot purchase agricultural land, plantation property, or farmhouses without specific RBI approval.",
  },
  {
    question: "Do I need an NRE/NRO account?",
    answer:
      "Yes, all financial transactions regarding property purchase must be routed through NRE (Non-Resident External) or NRO (Non-Resident Ordinary) accounts.",
  },
  {
    question: "Can I avail a home loan in India?",
    answer:
      "Most leading Indian banks offer home loans to NRIs, subject to eligibility criteria such as income, credit history, and country of residence.",
  },
];
