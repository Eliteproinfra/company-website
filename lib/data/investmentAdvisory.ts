import type { IconTextItem, ProcessStepItem, Stat } from "@/lib/types";

export const investmentFocusAreas = [
  "Comprehensive market analysis",
  "Risk assessment and mitigation",
  "ROI-focused strategies",
];

export const investmentServices: IconTextItem[] = [
  {
    icon: "fas fa-building-columns",
    title: "Acquisition Services",
    description: "Sourcing and structuring acquisitions aligned to your investment goals.",
  },
  {
    icon: "fas fa-right-left",
    title: "Disposition Strategy",
    description: "Optimally timed exits that maximize realized returns.",
  },
  {
    icon: "fas fa-layer-group",
    title: "Asset Management",
    description: "Ongoing portfolio oversight to protect and grow asset value.",
  },
  {
    icon: "fas fa-coins",
    title: "Capital Markets",
    description: "Access to institutional capital and structured financing solutions.",
  },
  {
    icon: "fas fa-earth-asia",
    title: "NRI Advisory",
    description: "Specialized advisory for cross-border and non-resident investors.",
  },
  {
    icon: "fas fa-calculator",
    title: "Valuation & Advisory",
    description: "Independent valuations backed by deep market intelligence.",
  },
];

export const investmentStats: Stat[] = [
  { value: "500+", label: "Transactions Closed" },
  { value: "₹200 Cr+", label: "Value Transacted" },
  { value: "150+", label: "Corporate Clients" },
  { value: "15+", label: "Years Experience" },
];

export const investmentProcess: ProcessStepItem[] = [
  {
    number: "01",
    title: "Strategic Assessment",
    description: "Understanding your objectives, risk appetite, and timeline.",
  },
  {
    number: "02",
    title: "Market Intelligence & Sourcing",
    description: "Identifying opportunities backed by deep market data.",
  },
  {
    number: "03",
    title: "Negotiation & Due Diligence",
    description: "Rigorous vetting and terms negotiated in your favor.",
  },
  {
    number: "04",
    title: "Execution & Post-Transaction Support",
    description: "Seamless closing with continued support after the deal.",
  },
];
