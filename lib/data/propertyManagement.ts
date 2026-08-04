import type { IconTextItem, ProcessStepItem } from "@/lib/types";

export const whyChooseUsFeatures: IconTextItem[] = [
  { icon: "fas fa-shield-alt", title: "Secure", description: "End-to-end security protocols" },
  { icon: "fas fa-chart-line", title: "Growth", description: "Consistent value appreciation" },
  { icon: "fas fa-headset", title: "24/7 Support", description: "Round the clock assistance" },
  {
    icon: "fas fa-file-contract",
    title: "Transparent",
    description: "Real-time reporting & updates",
  },
];

// Live site's "Full-Spectrum Management" — 8 core offerings
export const pmServices: IconTextItem[] = [
  {
    icon: "fas fa-magnifying-glass",
    title: "Tenant Discovery",
    description: "Proactive sourcing and screening of quality, verified tenants.",
  },
  {
    icon: "fas fa-file-signature",
    title: "Lease Management",
    description: "End-to-end lease drafting, renewals, and compliance handling.",
  },
  {
    icon: "fas fa-rupee-sign",
    title: "Rent Collection",
    description: "Reliable, on-time rent collection with zero default guarantee.",
  },
  {
    icon: "fas fa-tools",
    title: "Maintenance & Repairs",
    description: "Proactive maintenance schedules and rapid repair response.",
  },
  {
    icon: "fas fa-clipboard-check",
    title: "Regular Inspections",
    description: "Scheduled property inspections to protect your asset's condition.",
  },
  {
    icon: "fas fa-chart-bar",
    title: "Financial Reporting",
    description: "Monthly statements, tax documentation, and ROI analysis.",
  },
  {
    icon: "fas fa-headset",
    title: "Tenant Support",
    description: "Round-the-clock support to keep tenants satisfied and retained.",
  },
  {
    icon: "fas fa-arrow-trend-up",
    title: "Yield Optimization",
    description: "Data-driven pricing strategies to maximize rental yield.",
  },
];

// Live site's 4-stage workflow
export const processSteps: ProcessStepItem[] = [
  {
    number: "01",
    title: "Onboarding",
    description: "Property audits and a customized management plan.",
  },
  {
    number: "02",
    title: "Marketing & Tenant Search",
    description: "Professional listings and rigorous tenant screening.",
  },
  {
    number: "03",
    title: "Agreement & Move-In",
    description: "Lease agreements, documentation, and smooth move-in.",
  },
  {
    number: "04",
    title: "Ongoing Management",
    description: "Rent collection, maintenance, and regular owner updates.",
  },
];
