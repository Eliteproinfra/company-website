import type { Stat } from "@/lib/types";

// Homepage "Why Choose Elite Pro?"
export const whyChooseStats: Stat[] = [
  { icon: "fas fa-trophy", value: "15+", label: "Years of Experience" },
  { icon: "fas fa-user-tie", value: "150+", label: "Professionals" },
  { icon: "fas fa-award", value: "100+", label: "Industry Awards" },
  { icon: "fas fa-building", value: "180+", label: "Projects Onboard" },
  { icon: "fas fa-headset", value: "Dedicated", label: "CRM Team" },
  { icon: "fas fa-handshake", value: "100+", label: "A Grade Developer Partners" },
  { icon: "fas fa-file-signature", value: "100%", label: "Transparent Deals" },
  { icon: "fas fa-users", value: "700+", label: "Investors Advised" },
];

// Leadership page team stats
export const leadershipStats: Stat[] = [
  { value: "150+", label: "Professionals" },
  { value: "15+", label: "Years Experience" },
];

// Property Management page (matches the live property-management.php content)
export const propertyManagementStats: Stat[] = [
  { value: "₹200Cr+", label: "Assets Managed" },
  { value: "98%", label: "Occupancy Rate" },
  { value: "100%", label: "On-Time Rent" },
  { value: "0", label: "Hidden Charges" },
];
