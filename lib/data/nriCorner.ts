import type { FaqItem } from "@/lib/data/faq";
import type { IconTextItem, Stat } from "@/lib/types";

export const investNowReasons: Stat[] = [
  { value: "6.3-6.8%", label: "Projected Annual GDP Growth" },
  { value: "60%", label: "National Highway Network Expansion" },
  { value: "20+", label: "Cities With Metro Networks" },
];

export const investmentGuide: IconTextItem[] = [
  {
    icon: "fas fa-list-check",
    title: "Buying Process",
    description:
      "Property identification, financing through NRE/FCNR accounts, Power of Attorney execution, and registration procedures.",
  },
  {
    icon: "fas fa-scale-balanced",
    title: "FEMA & Legal Guidelines",
    description:
      "NRIs and PIOs do not require special RBI permission to buy immovable property, excluding agricultural land and farmhouses.",
  },
  {
    icon: "fas fa-receipt",
    title: "Taxes & Repatriation",
    description:
      "Understand long-term vs. short-term capital gains taxation. NRIs can repatriate sale proceeds of up to USD 1 million per financial year.",
  },
  {
    icon: "fas fa-folder-open",
    title: "Required Documents",
    description:
      "Passport, PAN card, address proofs, photographs, bank account details, and Power of Attorney if applicable.",
  },
];

export const nriCornerFaqs: FaqItem[] = [
  {
    question: "Can NRIs purchase agricultural land in India?",
    answer:
      "No. NRIs cannot purchase agricultural land, farmhouses, or plantation property, though they may inherit such property.",
  },
  {
    question: "Do I need to be physically present to grant Power of Attorney?",
    answer:
      "A Power of Attorney can be executed and notarized at an Indian embassy or consulate abroad, so you don't need to travel to India.",
  },
  {
    question: "Can NRIs get home loans in India?",
    answer:
      "Yes, most major Indian banks offer home loans to NRIs, typically covering 75-80% of the property value, subject to eligibility.",
  },
];
