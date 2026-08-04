import type { FaqItem } from "@/lib/data/faq";
import type { IconTextItem, Stat } from "@/lib/types";

export const nriMarketInsights: Stat[] = [
  { value: "4th", label: "Largest Economy by 2025" },
  { value: "$138B", label: "NRI Remittances (2024-25)" },
  { value: "12-15%", label: "Average CRE Returns" },
];

export const eliteAdvantage: IconTextItem[] = [
  {
    icon: "fas fa-laptop",
    title: "Digital Onboarding",
    description: "Complete the entire investment process remotely — no travel required.",
  },
  {
    icon: "fas fa-scale-balanced",
    title: "FEMA & Tax Compliance",
    description: "Full guidance on FEMA regulations, TDS, and repatriation rules.",
  },
  {
    icon: "fas fa-hand-holding-heart",
    title: "Post-Investment Care",
    description: "Ongoing property, tenant, and portfolio management after purchase.",
  },
];

export const nriExpertise: IconTextItem[] = [
  {
    icon: "fas fa-house-circle-check",
    title: "Property Acquisition",
    description: "End-to-end support finding and securing the right property.",
  },
  {
    icon: "fas fa-briefcase",
    title: "Portfolio Management",
    description: "Ongoing oversight across multiple properties and asset classes.",
  },
  {
    icon: "fas fa-gavel",
    title: "Legal & Tax Advisory",
    description: "FEMA-compliant documentation and taxation guidance.",
  },
  {
    icon: "fas fa-key",
    title: "Property Management",
    description: "Tenant management, maintenance, and rent collection, handled remotely.",
  },
  {
    icon: "fas fa-hand-holding-dollar",
    title: "Loan Assistance",
    description: "Facilitation of NRI home loans with partner banks.",
  },
  {
    icon: "fas fa-arrows-rotate",
    title: "Resale & Liquidation",
    description: "Strategic exit support when it's time to sell.",
  },
];

export const nriFaqs: FaqItem[] = [
  {
    question: "Can NRIs buy residential and commercial property in India?",
    answer:
      "Yes. NRIs and PIOs can freely purchase residential and commercial property in India without special RBI permission, except for agricultural land, farmhouses, and plantation property.",
  },
  {
    question: "Do I need an NRE or NRO account to invest?",
    answer:
      "Property payments must be made through an NRE, NRO, or FCNR account via normal banking channels — cash transactions are not permitted.",
  },
  {
    question: "Can NRIs avail home loans in India?",
    answer:
      "Yes, most leading Indian banks offer home loans to NRIs, typically financing 75-80% of the property value, subject to income and eligibility checks.",
  },
];
