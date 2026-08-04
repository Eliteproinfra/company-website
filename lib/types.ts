export type HeroSlide = {
  image: string;
  mobileImage?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  showCta?: boolean;
  align?: "center" | "left";
  imagePosition?: string;
};

export type IconTextItem = {
  icon: string;
  title: string;
  description: string;
  href?: string;
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
};
