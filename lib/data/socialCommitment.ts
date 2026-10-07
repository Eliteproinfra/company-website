export type Pillar = {
  image: string;
  icon: string;
  /** Small gold uppercase tag, e.g. "Women Empowerment". */
  tag: string;
  title: string;
  description: string;
};

/** Live social-commitment.php `.csr-pillars-card`s, verbatim. */
export const pillars: Pillar[] = [
  {
    image: "/images/social-commitment/pillar_1_1774092712_69be81a8aa2b6.webp",
    icon: "fas fa-star",
    tag: "Women Empowerment",
    title: "Creating independent futures",
    description:
      "Skill-building, financial literacy, and livelihood initiatives that help women lead financially independent and confident lives.",
  },
  {
    image: "/images/social-commitment/pillar_2_1774092712_69be81a8aa4df.webp",
    icon: "fas fa-star",
    tag: "Skill Development",
    title: "Building employable talent",
    description:
      "Certified training for youth and workers to improve employability, safety standards, and long-term career growth.",
  },
  {
    image: "/images/social-commitment/pillar_3_1774092712_69be81a8aa69c.webp",
    icon: "fas fa-star",
    tag: "Community Welfare",
    title: "Supporting every frontline",
    description:
      "Health camps, winter relief, education drives and on-ground support for labor colonies and underserved neighborhoods.",
  },
];

/** Live philosophy section's 2x2 photo grid (self-hosted copies of its Unsplash images). */
export const philosophyImages = [
  ["/images/bg/csr-skill.jpg", "/images/bg/csr-education.jpg"],
  ["/images/bg/csr-community.jpg", "/images/bg/csr-hands-2.jpg"],
];
