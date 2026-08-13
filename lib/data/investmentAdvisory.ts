import type { IconTextItem, ProcessStepItem, Stat } from "@/lib/types";

export const investmentFocusAreas = [
  "Comprehensive Market Analysis",
  "Risk Assessment & Mitigation",
  "ROI-Focused Strategies",
];

// "Aacquisition" is spelled that way on the live site.
export const investmentServices: IconTextItem[] = [
  {
    icon: "fas fa-building-columns",
    title: "Aacquisition Services",
    description:
      "Identifying and securing high-value assets that align with your investment criteria. We conduct thorough due diligence to ensure every acquisition drives growth.",
  },
  {
    icon: "fas fa-right-left",
    title: "Disposition Strategy",
    description:
      "Maximizing returns upon exit. We design tailored marketing campaigns and leverage our global network to find the right buyers and secure the best price.",
  },
  {
    icon: "fas fa-layer-group",
    title: "Asset Management",
    description:
      "Optimizing the performance of your portfolio. From tenant retention to operational efficiency, we enhance value throughout the ownership lifecycle.",
  },
  {
    icon: "fas fa-coins",
    title: "Capital Markets",
    description:
      "Connecting you with the right capital. We assist with debt structuring, equity placement, and refinancing to support your investment goals.",
  },
  {
    icon: "fas fa-earth-asia",
    title: "NRI Advisory",
    description:
      "Specialized services for Non-Resident Indians looking to invest in the Indian real estate market, ensuring compliance and seamless transactions.",
  },
  {
    icon: "fas fa-calculator",
    title: "Valuation & Advisory",
    description:
      "Accurate, data-backed property valuations and feasibility studies to support informed decision-making and strategic planning.",
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
    description:
      "We begin by understanding your investment objectives, risk tolerance, and time horizon. Our team conducts a comprehensive analysis of your current portfolio and market opportunities.",
  },
  {
    number: "02",
    title: "Market Intelligence & Sourcing",
    description:
      "Leveraging our proprietary data and network, we identify off-market opportunities and high-potential assets that match your criteria. We provide detailed financial modeling and competitive analysis.",
  },
  {
    number: "03",
    title: "Negotiation & Due Diligence",
    description:
      "Our experts handle the negotiation process to secure the best terms. We coordinate all aspects of due diligence, legal review, and compliance to ensure a smooth transaction.",
  },
  {
    number: "04",
    title: "Execution & Post-Transaction Support",
    description:
      "We ensure a seamless closing process. Beyond the transaction, we offer ongoing asset management support and strategic advice for future growth or exit.",
  },
];
