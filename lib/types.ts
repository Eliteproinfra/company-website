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
};

export type Award = {
  image: string;
  /** Alt text for the tile. Falls back to a generic label when blank. */
  caption: string;
};

export type PropertyBadgeVariant = "residential" | "commercial" | "sco" | "industrial";

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
