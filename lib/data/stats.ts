import type { Stat } from "@/lib/types";

// Homepage "Why Choose Elite Pro?"
export const whyChooseStats: Stat[] = [
  { icon: "fas fa-users", value: "32000+", label: "Trusted Investors & Buyers" },
  { icon: "fas fa-user-tie", value: "350+", label: "Professionals" },
  { icon: "fas fa-sitemap", value: "15000+", label: "Brokers | Global Network" },
  { icon: "fas fa-map-marked-alt", value: "20+", label: "States Covered" },
  { icon: "fas fa-headset", value: "Dedicated", label: "CRM Team" },
  { icon: "fas fa-handshake", value: "100+", label: "A Grade Developer Partners" },
  { icon: "fas fa-trophy", value: "14", label: "Years of Trusted Excellence" },
  { icon: "fas fa-file-signature", value: "100%", label: "Transparent Deals" },
];

// Homepage "Transaction Stats" banner
export const transactionStats: Stat[] = [
  { value: "38,750+", label: "Transactions" },
  { value: "1 Lakh CR+", label: "Worth Property Sold" },
  { value: "150+", label: "Projects Onboard" },
  { value: "55 Million", label: "sq.ft. Area Sold" },
];

// Leadership page team stats
export const leadershipStats: Stat[] = [
  { value: "100+", label: "Professionals" },
  { value: "15+", label: "Years Experience" },
];

// Property Management page (matches the live property-management.php content)
export const propertyManagementStats: Stat[] = [
  { value: "₹200Cr+", label: "Assets Managed" },
  { value: "98%", label: "Occupancy Rate" },
  { value: "100%", label: "On-Time Rent" },
  { value: "0", label: "Hidden Charges" },
];
