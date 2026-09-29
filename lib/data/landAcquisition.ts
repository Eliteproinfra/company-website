import type { IconTextItem, ProcessStepItem } from "@/lib/types";

/** Live's "Land Acquisition Strategies" cards — copy matches land-acquisition.php verbatim. */
export const acquisitionStrategies: IconTextItem[] = [
  {
    icon: "fas fa-bullseye",
    title: "Goal Determination",
    description:
      "We start by defining the purpose—commercial, residential, or mixed-use. A clear vision prevents overspending and ensures the land serves future scalability.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Market Dynamics",
    description:
      "We analyze demand patterns, price trajectories, and infrastructure forecasts. Identifying areas with upward momentum before they peak is our expertise.",
  },
  {
    icon: "fas fa-scale-balanced",
    title: "Legal & Zoning",
    description:
      "Our legal team conducts rigorous title checks and zoning reviews. We ensure no encumbrances, disputes, or environmental restrictions derail your project.",
  },
  {
    icon: "fas fa-road",
    title: "Accessibility Check",
    description:
      "Connectivity drives value. We evaluate proximity to highways, logistics hubs, and future metro lines to ensure seamless access for end-users.",
  },
  {
    icon: "fas fa-people-group",
    title: "Local Relations",
    description:
      "We leverage deep ties with local brokers, municipal officials, and community leaders to access off-market deals that never hit public listings.",
  },
  {
    icon: "fas fa-calculator",
    title: "ROI Assessment",
    description:
      "We calculate potential returns by factoring in development costs, taxes, and resale value. We ensure the investment makes sense today and tomorrow.",
  },
];

/**
 * Live renders these as a check-circle list ("Infrastructure Boom:" in bold, then the
 * sentence), so they carry no per-item icon.
 */
export const landRushDrivers: { title: string; description: string }[] = [
  {
    title: "Infrastructure Boom",
    description: "New expressways and airports are unlocking value in peripheral regions.",
  },
  {
    title: "Urbanization",
    description: "Rapid migration to Tier-1 cities is driving demand for integrated townships.",
  },
  {
    title: "Policy Support",
    description: "RERA and digital land records have increased transparency and confidence.",
  },
];

/** The numbered 01–04 boxes sitting beside "India's Land Rush" on live. */
export const growthIndicators: ProcessStepItem[] = [
  {
    number: "01",
    title: "Strategic Location",
    description: "Identifying growth corridors before the boom.",
  },
  {
    number: "02",
    title: "Due Diligence",
    description: "100% verified titles and clean paperwork.",
  },
  {
    number: "03",
    title: "Future Ready",
    description: "Land parcels suitable for modern mixed-use projects.",
  },
  {
    number: "04",
    title: "High ROI",
    description: "Maximizing returns through timely acquisition.",
  },
];
