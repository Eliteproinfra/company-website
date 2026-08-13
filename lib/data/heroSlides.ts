import type { HeroSlide } from "@/lib/types";

// The live site runs two hero carousels — a 2-slide desktop one and a 3-slide
// mobile one — swapped at the md breakpoint. Both are mirrored here.
export const heroSlides: HeroSlide[] = [
  {
    image: "/images/sliders/1773133806-web-p.png",
    eyebrow: "Welcome to Elitepro Infra Pvt Ltd",
    heading: "Vision • Transparency • Commitment",
    subheading:
      "From iconic residences to high-value commercial spaces, we connect you with properties that elevate lifestyle and investment potential.",
    align: "left",
  },
  { image: "/images/sliders/1771651144-branded.png" },
];

export const heroSlidesMobile: HeroSlide[] = [
  {
    image: "/images/sliders/1776432133-mobile-banner-1.webp",
    eyebrow: "Vision • Transparency • Commitment",
    heading: "WELCOME TO ELITEPRO INFRA PVT LTD",
    subheading:
      "From iconic residences to high-value commercial spaces, we connect you with properties that elevate lifestyle and investment potential.",
    align: "left",
  },
  { image: "/images/sliders/1776432151-mobile-banner-2.webp" },
  { image: "/images/sliders/1776432161-mobile-banner-3.webp" },
];
