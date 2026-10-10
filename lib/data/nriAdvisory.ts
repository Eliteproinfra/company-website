import type { FaqItem } from "@/lib/data/faq";
import type { IconTextItem, Stat } from "@/lib/types";

/**
 * Live's "Why Invest in India Now?" boxes. Each carries a supporting sentence under the
 * label, so this is a Stat plus a `detail` line rather than a bare Stat.
 *
 * Deliberately diverges from live: live still runs the 2025 figures, which have since gone
 * stale or been overtaken. Refreshed 2026-10-10 — don't let a parity diff revert these.
 *   - Growth: IMF Oct 2026 WEO trims FY27 to 6.4% (from 6.5% in April), India still the
 *     fastest-growing major economy. Replaces live's "4th Largest Economy by 2025": the
 *     April 2026 WEO puts India 6th at $4.15T, behind the UK and Japan, after MoSPI rebased
 *     GDP to 2022-23 and the rupee slid to ~88.5/USD. The rank claim is no longer true.
 *   - Remittances: RBI balance-of-payments net private transfers, a record $144.8B in
 *     FY2025-26 (up from $135.46B in FY25 — live's "138B" was never the published figure).
 *   - Yields: 6-10% is the supported range for commercial rent (office 6-10%, retail 5-8%,
 *     warehouse 7-9%) against 3-5% residential. Live's "12-15%" is not a rental yield.
 */
export const nriMarketInsights: (Stat & { detail: string })[] = [
  {
    value: "6.4%",
    label: "FY27 GDP Growth (IMF)",
    detail:
      "The world's fastest-growing major economy, driving sustained real estate demand.",
  },
  {
    value: "145B",
    label: "NRI Remittances (FY 2025-26)",
    detail: "Record-breaking inflows indicate growing global trust in Indian assets.",
  },
  {
    value: "6-10%",
    label: "Commercial Rental Yields",
    detail:
      "Indian commercial real estate yields roughly double residential, and beat most global markets.",
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
    question: "Can NRIs invest in residential and commercial properties in India?",
    answer:
      "Yes, Non-Resident Indians (NRIs) can purchase residential and commercial properties in India without prior RBI approval, subject to applicable FEMA regulations. However, NRIs generally cannot purchase agricultural land, farmhouses, or plantation properties.",
  },
  {
    question: "How does Elite Pro Infra assist NRI property investors?",
    answer:
      "Elite Pro Infra provides personalized property consultation, project comparisons, virtual site visits, documentation guidance, and purchase coordination. Our team helps NRIs explore suitable investment opportunities while managing much of the property selection process remotely.",
  },
  {
    question: "Can NRIs buy property in India without visiting the country?",
    answer:
      "Yes, NRIs can purchase property in India without being physically present. They can use a properly executed Power of Attorney (PoA) to authorize a representative to complete permitted formalities. Documentation, registration, and verification requirements depend on the property's location and applicable regulations.",
  },
  {
    question: "What documents are required for NRIs to buy property in India?",
    answer:
      "NRIs typically require a valid Indian passport, PAN card, overseas address proof, photographs, and relevant banking documents. Additional documents, such as a Power of Attorney, may be necessary depending on the purchase process and financing arrangements.",
  },
  {
    question: "Can NRIs get a home loan to buy property in India?",
    answer:
      "Yes, eligible NRIs can apply for home loans from Indian banks and financial institutions. Loan approval, interest rates, repayment terms, and required documents depend on the lender's policies, income verification, and applicant's credit profile.",
  },
  {
    question: "How can NRIs make payments for property purchases in India?",
    answer:
      "NRIs can make property payments through permitted banking channels, including inward remittances and eligible NRE, NRO, or FCNR(B) accounts. Payments must comply with RBI and FEMA regulations.",
  },
  {
    question: "Can NRIs earn rental income from properties in India?",
    answer:
      "Yes, NRIs can rent out their residential or commercial properties in India and earn rental income. Such income is generally taxable in India, subject to applicable tax provisions and potential benefits under Double Taxation Avoidance Agreements (DTAA).",
  },
  {
    question: "Can NRIs sell their property in India and transfer the money abroad?",
    answer:
      "Yes, NRIs can sell eligible properties in India and repatriate sale proceeds abroad, subject to RBI regulations, applicable limits, documentation, and tax compliance. The specific conditions depend on how the property was originally purchased and funded.",
  },
];
