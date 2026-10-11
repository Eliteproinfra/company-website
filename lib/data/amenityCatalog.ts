/**
 * The amenities an admin can pick from, with the icon each one gets.
 *
 * The admin used to type the Font Awesome class by hand next to the name, which
 * is why the seeded listings carry icons that have nothing to do with the label
 * — "CCTV surveillance" with a swimming pool, "Lift" with a spa. Pairing the two
 * here means the icon can no longer drift from the name: the picker writes both
 * from the same row.
 *
 * Every class below is checked against the installed @fortawesome/fontawesome-free
 * build. Note that it is version 7, not 5 — the v5 names still resolve because
 * Font Awesome keeps them as aliases, so the names already saved in the database
 * keep working, but anything new should be checked before it is added here.
 *
 * Names are the identity of a row: they are what the public page prints and what
 * the picker matches a saved amenity against, so renaming one here renames it on
 * every listing the next time that listing is saved. Add a new entry instead.
 *
 * The groups and much of the list follow how the big portals present this, so a
 * listing reads familiarly against them.
 */

export type AmenityCatalogEntry = {
  /** Printed on the public tile, and the unique key of the entry. */
  name: string;
  /** Full Font Awesome class, "fas " prefix included. */
  icon: string;
};

export type AmenityCatalogGroup = {
  title: string;
  items: AmenityCatalogEntry[];
};

export const amenityCatalog: AmenityCatalogGroup[] = [
  {
    title: "Sports & fitness",
    items: [
      { name: "GYM", icon: "fas fa-dumbbell" },
      { name: "Swimming Pool", icon: "fas fa-swimming-pool" },
      { name: "Kids' Pool", icon: "fas fa-swimmer" },
      { name: "Children Play Area", icon: "fas fa-child" },
      { name: "Playground", icon: "fas fa-futbol" },
      { name: "Basketball court", icon: "fas fa-basketball-ball" },
      { name: "Badminton Court", icon: "fas fa-feather" },
      { name: "Tennis Court", icon: "fas fa-table-tennis" },
      { name: "Table Tennis", icon: "fas fa-table-tennis" },
      { name: "Cricket ground", icon: "fas fa-baseball-ball" },
      { name: "Football ground", icon: "fas fa-futbol" },
      { name: "Snooker / Billiards", icon: "fas fa-bowling-ball" },
      { name: "Jogging/Walking Track", icon: "fas fa-running" },
      { name: "Bicycle Tracks", icon: "fas fa-bicycle" },
      { name: "Yoga Area", icon: "fas fa-pray" },
      { name: "Indoor Games", icon: "fas fa-chess" },
    ],
  },
  {
    title: "Convenience",
    items: [
      { name: "Power backup", icon: "fas fa-bolt" },
      { name: "Lift", icon: "fas fa-elevator" },
      { name: "24x7 Water Supply", icon: "fas fa-tint" },
      { name: "Treated Water Supply", icon: "fas fa-water" },
      { name: "Car Parking", icon: "fas fa-car" },
      { name: "Parking and Transportation Access", icon: "fas fa-parking" },
      { name: "EV Charging Point", icon: "fas fa-charging-station" },
      { name: "Wi-Fi Connectivity", icon: "fas fa-wifi" },
      { name: "Maintenance Staff", icon: "fas fa-concierge-bell" },
      { name: "Housekeeping", icon: "fas fa-broom" },
      { name: "Convenience Store", icon: "fas fa-shopping-basket" },
      { name: "ATM Facility", icon: "fas fa-credit-card" },
      { name: "Coffee Shop", icon: "fas fa-mug-hot" },
      { name: "Laundry Facility", icon: "fas fa-tshirt" },
      { name: "Community Center", icon: "fas fa-users" },
      { name: "School", icon: "fas fa-school" },
      { name: "Library", icon: "fas fa-book" },
    ],
  },
  {
    title: "Safety",
    items: [
      { name: "24x7 Security", icon: "fas fa-user-shield" },
      { name: "CCTV surveillance", icon: "fas fa-video" },
      { name: "Fire Fighting Systems", icon: "fas fa-fire-extinguisher" },
      { name: "Intercom Facility", icon: "fas fa-phone-volume" },
      { name: "Video Door Phone", icon: "fas fa-bell" },
      { name: "Gated Community", icon: "fas fa-shield-alt" },
      { name: "Emergency exits", icon: "fas fa-door-open" },
    ],
  },
  {
    title: "Leisure",
    items: [
      { name: "Clubhouse", icon: "fas fa-landmark" },
      { name: "SPA", icon: "fas fa-spa" },
      { name: "Sauna", icon: "fas fa-hot-tub" },
      { name: "Jacuzzi", icon: "fas fa-bath" },
      { name: "Party Hall", icon: "fas fa-glass-cheers" },
      { name: "Amphitheatre", icon: "fas fa-theater-masks" },
      { name: "Barbecue Area", icon: "fas fa-fire" },
      { name: "Lounge Areas", icon: "fas fa-couch" },
      { name: "Pet Area", icon: "fas fa-dog" },
    ],
  },
  {
    title: "Environment",
    items: [
      { name: "Park", icon: "fas fa-tree" },
      { name: "Landscaped Garden", icon: "fas fa-leaf" },
      { name: "Large Green Area", icon: "fas fa-seedling" },
      { name: "Rain Water Harvesting", icon: "fas fa-cloud-rain" },
      { name: "Sewage Treatment Plant", icon: "fas fa-recycle" },
      { name: "Solar Power", icon: "fas fa-solar-panel" },
      { name: "Eco Friendly", icon: "fas fa-globe-americas" },
      { name: "Inside River", icon: "fas fa-water" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { name: "Office Amenities", icon: "fas fa-briefcase" },
      { name: "Ergonomic Furniture", icon: "fas fa-chair" },
      { name: "Vaastu Compliant", icon: "fas fa-compass" },
    ],
  },
];

/** The icon a hand-typed amenity gets when the admin does not supply one. */
export const FALLBACK_AMENITY_ICON = "fas fa-check";

/**
 * Case and spacing are not part of a name's identity here, only for matching: a
 * listing saved as "power backup" must light up the "Power backup" tile rather
 * than sit beside it as a second, near-identical row.
 */
export function amenityKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const byKey = new Map(
  amenityCatalog.flatMap((group) => group.items.map((item) => [amenityKey(item.name), item])),
);

/** The catalog entry a saved amenity name belongs to, or undefined if it is one
 *  of the free-text ones an admin added before the picker existed. */
export function findCatalogAmenity(name: string): AmenityCatalogEntry | undefined {
  return byKey.get(amenityKey(name));
}
