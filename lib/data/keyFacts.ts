/**
 * Icons for the key-fact tiles under the listing title.
 *
 * Matched on the label the admin typed rather than asked for separately —
 * "Built-up Area", "Carpet Area" and "Area" should all get the ruler without
 * anyone having to know that. Matching is on a normalised substring, so
 * "Super Built-up Area (sq.ft.)" still finds it.
 *
 * Order matters: the first rule that matches wins, so the more specific words
 * come first ("bathroom" before "bath", "total floors" before "floor").
 */
const RULES: { match: string[]; icon: string }[] = [
  { match: ["bathroom", "washroom", "toilet"], icon: "fas fa-bath" },
  { match: ["bedroom", "bhk", "bed", "configuration"], icon: "fas fa-bed" },
  { match: ["area", "size", "sq"], icon: "fas fa-ruler-combined" },
  { match: ["balcony"], icon: "fas fa-door-open" },
  { match: ["facing", "direction", "vaastu", "vastu"], icon: "fas fa-compass" },
  { match: ["possession", "ready", "handover"], icon: "fas fa-calendar-check" },
  { match: ["floor", "storey", "tower", "block"], icon: "fas fa-layer-group" },
  { match: ["furnish"], icon: "fas fa-couch" },
  { match: ["parking", "car"], icon: "fas fa-car" },
  { match: ["price", "rate", "cost", "budget"], icon: "fas fa-money-bill-wave" },
  { match: ["view"], icon: "fas fa-mountain" },
  { match: ["age", "built", "year"], icon: "fas fa-hourglass-half" },
  { match: ["status", "launch"], icon: "fas fa-flag" },
  { match: ["rera", "approval", "licence", "license"], icon: "fas fa-stamp" },
  { match: ["type", "category"], icon: "fas fa-building" },
  { match: ["location", "locality", "address", "city", "sector"], icon: "fas fa-map-marker-alt" },
];

export function keyFactIcon(label: string): string {
  const needle = label.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some((word) => needle.includes(word))) return rule.icon;
  }
  return "fas fa-circle-info";
}
