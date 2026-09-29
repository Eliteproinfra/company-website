import type { FaqItem } from "@/lib/data/faq";
import type { IconTextItem } from "@/lib/types";

/** Live nri-corner.php "The Growth Story" `.growth-card`s. */
export const growthReasons: IconTextItem[] = [
  {
    icon: "fas fa-chart-line",
    title: "Strong EeeeEconomic Growth",
    description:
      "India's real GDP is projected to grow 6.3% - 6.8% annually. Rising private consumption (highest in two decades) fuels demand for premium housing.",
  },
  {
    icon: "fas fa-road",
    title: "Infrastructure Boom",
    description:
      "National highways expanded by 60%. Metro networks now span 20+ cities (1,011 km). New airports (like Navi Mumbai) are unlocking new realty hotspots.",
  },
  {
    icon: "fas fa-city",
    title: "Capital Appreciation",
    description:
      "With urbanization and \"Smart City\" initiatives, property values in Tier-1 cities are seeing steady appreciation, offering lucrative ROI for long-term investors.",
  },
];

export type GuidePoint = { label: string; text: string };

export type GuideTab = {
  icon: string;
  label: string;
  heading: string;
  /** Free intro paragraph shown above the points (FEMA tab). */
  intro?: string;
  /** Highlighted callout (live: `.alert.alert-light.border-start.border-warning`). */
  callout?: GuidePoint;
  /** Sub-heading printed before `points` (e.g. "Lease vs License:"). */
  pointsHeading?: string;
  points?: GuidePoint[];
  /** Second block (Taxes tab: "Repatriation of Funds:"). */
  secondHeading?: string;
  secondText?: string;
  /** Two-column plain list (Documentation tab). */
  documents?: string[];
};

/** Live "Knowledge Bank" vertical tabs, content verbatim. */
export const guideTabs: GuideTab[] = [
  {
    icon: "fas fa-shopping-cart",
    label: "Buying Process",
    heading: "Step-by-Step Buying Guide",
    points: [
      {
        label: "Identify Property:",
        text: "NRIs can buy residential and commercial properties (excluding agricultural land/farmhouses).",
      },
      {
        label: "Financing:",
        text: "Funds must come from inward remittances (NRE/FCNR accounts) or NRO accounts. Home loans are available for NRIs.",
      },
      {
        label: "Power of Attorney (PoA):",
        text: "If you cannot travel, a specific PoA can be executed to a trusted person in India for registration.",
      },
      {
        label: "Registration:",
        text: "Pay stamp duty and registration charges. The sale deed must be registered with the local Sub-Registrar.",
      },
    ],
  },
  {
    icon: "fas fa-gavel",
    label: "FEMA & Legal",
    heading: "FEMA & Legal Guidelines",
    intro: "Under the Foreign Exchange Management Act (FEMA) and RBI guidelines:",
    callout: {
      label: "Who can buy?",
      text: "NRIs (Non-Resident Indians) and PIOs (Persons of Indian Origin) / OCIs (Overseas Citizens of India) do not require special RBI permission to buy immovable property (residential/commercial).",
    },
    pointsHeading: "Lease vs License:",
    points: [
      {
        label: "Lease:",
        text: "Transfer of right to enjoy property for a defined time. Requires stamping and registration.",
      },
      {
        label: "Leave & License:",
        text: "Right to use premises for a limited duration without interest in the property. Also requires registration in many states like Maharashtra.",
      },
    ],
  },
  {
    icon: "fas fa-file-invoice-dollar",
    label: "Taxes & Repatriation",
    heading: "Taxes & Repatriation",
    pointsHeading: "Capital Gains Tax (CGT):",
    points: [
      {
        label: "Long Term (LTCG):",
        text: "If held for >2 years. Taxed at ~20% (with indexation). Exemptions available under Section 54 if reinvested.",
      },
      {
        label: "Short Term (STCG):",
        text: "If held for <2 years. Taxed as per the NRI's applicable income tax slab.",
      },
    ],
    secondHeading: "Repatriation of Funds:",
    secondText:
      "NRIs can repatriate the sale proceeds of up to USD 1 Million per financial year, provided taxes are paid and the property was purchased as per FEMA guidelines.",
  },
  {
    icon: "fas fa-folder-open",
    label: "Documentation",
    heading: "Required Documents",
    documents: [
      "Passport & Visa/OCI Card",
      "PAN Card (Mandatory)",
      "Address Proof (Overseas & India)",
      "Passport Size Photographs",
      "NRE/NRO Account Details",
      "Power of Attorney (if applicable)",
    ],
  },
];

export const nriCornerFaqs: FaqItem[] = [
  {
    question: "Can NRIs buy agricultural land in India?",
    answer:
      "No. Under the general permission, NRIs and PIOs cannot purchase agricultural land, plantation property, or farmhouses in India. Such properties can only be inherited or received as a gift from a resident Indian.",
  },
  {
    question: "Is it mandatory to have a Power of Attorney (PoA)?",
    answer:
      "It is not mandatory if you are present in India for the registration. However, if you cannot travel, a Specific Power of Attorney (PoA) is highly recommended to authorize a trusted person to complete the formalities on your behalf.",
  },
  {
    question: "Can I get a home loan in India?",
    answer:
      "Yes, RBI permits banks and housing finance companies to grant loans to NRIs for buying residential property. The loan amount can be up to 80% of the property value, subject to income eligibility.",
  },
];
