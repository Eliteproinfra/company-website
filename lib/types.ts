export type IconTextItem = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  highlight?: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type Stat = {
  value: string;
  label: string;
  icon?: string;
  highlight?: boolean;
};

export type OfficeInfo = {
  name: string;
  icon: string;
  address: string;
  phone?: string;
  email?: string;
};

/**
 * A place pinned on one of the home page footprint maps. The coordinates are
 * real WGS84 degrees — components/home/PresenceMap projects them with the same
 * projection the artwork was drawn in, so a pin sits on its actual city.
 */
export type PresenceMarker = {
  name: string;
  /** Degrees north, positive. */
  lat: number;
  /** Degrees east, positive. */
  lng: number;
  /**
   * "hub" is the place we are based in and gets the emphasised pin. The other
   * two draw alike today and are kept apart because the distinction is real:
   * an "office" is staffed, a "city" is somewhere we operate.
   */
  kind: "hub" | "office" | "city";
  /** Second line under an always-on label. */
  note?: string;
  /**
   * Where an always-on label sits relative to its pin. Only set on the world
   * map, where the three labels are permanent and have to be placed by hand so
   * they neither overlap each other nor run out of the column. Defaults to
   * "right".
   */
  labelSide?: "left" | "right" | "below";
};

/**
 * One of the home page's full-bleed footprint banners. The artwork carries its
 * own titling, but it is set small on a phone and unreadable to a screen
 * reader, so `title` and `description` repeat it as real text underneath.
 */
export type PresenceBanner = {
  image: string;
  alt: string;
  title: string;
  description: string;
};

/**
 * A place name printed straight onto a footprint map — a neighbouring country
 * or a sea. Positioned by coordinate like a marker, so it stays put when the
 * map is redrawn, but it is lettering rather than a pin: nothing we operate.
 */
export type MapAnnotation = {
  text: string;
  lat: number;
  lng: number;
  kind: "land" | "water";
};

export type LocalityItem = {
  icon: string;
  name: string;
  area: string;
};

export type CategoryItem = {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  /** The listing badge variant this category files under on /properties. */
  variant: PropertyBadgeVariant;
};

export type Award = {
  image: string;
  /** Alt text for the tile. Falls back to a generic label when blank. */
  caption: string;
};

export type PropertyBadgeVariant =
  | "residential"
  | "commercial"
  | "sco"
  | "industrial"
  | "residential-plots";

export type PropertyItem = {
  image: string;
  badgeText: string;
  badgeVariant: PropertyBadgeVariant;
  title: string;
  location: string;
  beds?: string;
  area?: string;
  price: string;
  /** Detail-page path; falls back to /contact when the listing has no page yet. */
  href?: string;
  /** `?developer=` slug of the partner this listing belongs to, resolved once on
   *  the server — the homepage's developer logos filter the grid on it. Absent
   *  when the listing matches no partner. */
  developerSlug?: string;
};

export type ProcessStepItem = {
  number: string;
  title: string;
  description: string;
};

export type ArticleItem = {
  title: string;
  date: string;
  excerpt: string;
  href: string;
  image: string;
};

/** One Instagram video/reel, already validated and normalised by lib/instagram.ts. */
export type InstagramReel = {
  id: string;
  /** Public instagram.com URL of the post — validated, safe to use as an href. */
  permalink: string;
  /** Poster frame served by Instagram's CDN. Always rendered first; the video fades in over it. */
  thumbnailUrl: string;
  /** Direct MP4 from the Graph API, for muted in-viewport autoplay. Null when the
   *  API omitted it or returned something that failed validation — the card then
   *  stays on the poster frame. */
  videoUrl: string | null;
  caption: string | null;
  /** Pre-formatted on the server (UTC) so the client render cannot drift and break hydration. */
  postedOn: string | null;
  /** True for Reels, false for ordinary feed videos — only changes the badge label. */
  isReel: boolean;
};
