import type { MapAnnotation, PresenceBanner, PresenceMarker } from "@/lib/types";

/**
 * The two banners in the home page's "Nationwide & Global Reach" section,
 * shown full-bleed because they are 16:9 artwork with their own titling.
 *
 * Supplied as artwork, not generated — so the places they mark are fixed in
 * the pixels. If the offices change, the images have to be redrawn; nothing
 * here can move a pin. The alt text names every marker on them for anyone who
 * cannot see the picture.
 */
export const presenceBanners: PresenceBanner[] = [
  {
    image: "/images/presence/presence-india.webp",
    alt:
      "Night map of India marking ElitePro Infra's Gurugram head office and its " +
      "offices in Sonipat, Noida and Goa.",
    title: "Pan-India Presence",
    description:
      "We actively operate across 20+ major cities in India, supported by a strong regional " +
      "partner and execution network to ensure seamless service delivery nationwide.",
  },
  {
    image: "/images/presence/presence-world.webp",
    alt:
      "Night map of the world marking ElitePro Infra's three markets — India, Dubai and " +
      "Singapore — joined by flight paths.",
    title: "Global Presence",
    description:
      "Our footprint extends across key international markets, enabling us to serve global " +
      "clients through strategic alliances and trusted international partners.",
  },
];

/**
 * Where the home page's "Nationwide & Global Reach" maps put their pins.
 *
 * Not read by anything today — the banners above are what ships. This is the
 * data behind the unwired PresenceMap component; see the note at the top of it.
 *
 * Coordinates are real city centroids to four decimals, which is far finer than
 * the maps can show — they are kept exact so the data stays reusable if the maps
 * are ever drawn larger or zoomed to a region.
 *
 * The Indian list is the evidence for the "20+ major cities" claim in the copy
 * next to it; keep the two in step if cities are added or removed.
 */
export const indiaPresence: PresenceMarker[] = [
  // "below" because the label hangs off the one pin tall enough to need the
  // room, and there is open country under Delhi but neighbours either side.
  { name: "Delhi NCR", lat: 28.52, lng: 77.1, kind: "hub", note: "Head office", labelSide: "below" },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, kind: "city" },
  { name: "Dehradun", lat: 30.3165, lng: 78.0322, kind: "city" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, kind: "city" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, kind: "city" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, kind: "city" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, kind: "city" },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362, kind: "city" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, kind: "city" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, kind: "city" },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, kind: "city" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, kind: "city" },
  { name: "Surat", lat: 21.1702, lng: 72.8311, kind: "city" },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, kind: "city" },
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245, kind: "city" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, kind: "city" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, kind: "city" },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, kind: "city" },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, kind: "city" },
  { name: "Goa", lat: 15.4909, lng: 73.8278, kind: "city" },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, kind: "city" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, kind: "city" },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558, kind: "city" },
  { name: "Kochi", lat: 9.9312, lng: 76.2673, kind: "city" },
];

/**
 * Lettering on the India map: who is next door and what the water is called.
 *
 * Every one of these has to sit inside the map's own bounding box, which is
 * cropped tight to India — so the sea names are placed in the nearest open
 * water rather than out where an atlas would print them.
 */
export const indiaMapAnnotations: MapAnnotation[] = [
  { text: "Pakistan", lat: 31.5, lng: 71.0, kind: "land" },
  { text: "China", lat: 34.5, lng: 85.0, kind: "land" },
  { text: "Nepal", lat: 29.0, lng: 84.5, kind: "land" },
  { text: "Bangladesh", lat: 23.9, lng: 90.4, kind: "land" },
  { text: "Myanmar", lat: 22.0, lng: 93.8, kind: "land" },
  { text: "Arabian Sea", lat: 16.0, lng: 71.3, kind: "water" },
  { text: "Bay of Bengal", lat: 15.0, lng: 87.0, kind: "water" },
  // No "Indian Ocean": the viewBox is cropped to India's own bounding box and
  // stops at the Nicobars, so the only water left to put it in would be the
  // Palk Strait, which it is not.
];

/**
 * The three markets the world map calls out. Gurgaon and Dubai are the offices
 * in lib/data/offices.ts; Singapore is a partner market, not a staffed office,
 * so its note says so rather than implying a branch.
 */
export const globalPresence: PresenceMarker[] = [
  {
    name: "India",
    lat: 28.4595,
    lng: 77.0266,
    kind: "hub",
    note: "Gurgaon HQ",
    labelSide: "right",
  },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, kind: "office", note: "UAE office", labelSide: "left" },
  {
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    // Not in lib/data/offices.ts, so not staffed — "city" in the sense of
    // somewhere we operate rather than somewhere we sit.
    kind: "city",
    note: "Partner market",
    // Far enough east that a label beside it would hang out of the column, and
    // there is nothing but ocean underneath.
    labelSide: "below",
  },
];
