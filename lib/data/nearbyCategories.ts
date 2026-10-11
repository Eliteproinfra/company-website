/**
 * The buckets the "Locality & Commute" box groups its landmarks into.
 *
 * A fixed list rather than free text because the public page renders one tab
 * per category: two listings spelling it "Schools" and "School" would open two
 * tabs for the same thing. The admin picks from here; the icon is what the tab
 * shows beside the name.
 *
 * Classes are checked against the installed Font Awesome build (v7, which still
 * resolves the v5 names used across this codebase).
 */
export const nearbyCategories = [
  { name: "Schools", icon: "fas fa-school" },
  { name: "Hospitals", icon: "fas fa-hospital" },
  { name: "Shopping Malls", icon: "fas fa-shopping-bag" },
  { name: "Metro Stations", icon: "fas fa-subway" },
  { name: "Banks & ATMs", icon: "fas fa-university" },
  { name: "Restaurants", icon: "fas fa-utensils" },
  { name: "Parks", icon: "fas fa-tree" },
  { name: "Office Parks", icon: "fas fa-building" },
  { name: "Hotels", icon: "fas fa-hotel" },
  { name: "Petrol Pumps", icon: "fas fa-gas-pump" },
  { name: "Airports", icon: "fas fa-plane-departure" },
  { name: "Temples", icon: "fas fa-place-of-worship" },
] as const;

export const nearbyCategoryNames = nearbyCategories.map((category) => category.name);

/** The tab icon for a category, or a generic pin for a value saved before that
 *  category was on the list. */
export function nearbyCategoryIcon(name: string): string {
  return (
    nearbyCategories.find((category) => category.name === name)?.icon ??
    "fas fa-map-marker-alt"
  );
}
