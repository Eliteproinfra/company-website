export type Leader = {
  photo: string;
  name: string;
  title: string;
  /** One-line statement printed between the title and the bio. */
  tagline: string;
  /** One entry per paragraph. */
  bio: string[];
  /** The leader's own words, closing the profile. */
  quote?: string;
  /** The longer profile live prints on /our-story (falls back to `bio`). */
  storyBio?: string[];
};

export const leaders: Leader[] = [
  {
    photo: "/images/leadership/viren-mehta-portrait.png",
    name: "Mr. Viren Mehta",
    title: "Founder & Director – Sales",
    tagline: "The vision behind our growth.",
    bio: [
      "Mr. Viren Mehta is the founder of Elite Pro Infra and the leader of its sales vision. He has a deep understanding of market dynamics and of what clients truly need. He brings that insight to every part of the business, from sales strategy and business development to the key client relationships that define how Elite Pro Infra is trusted.",
      "His leadership is built on strategic growth and revenue excellence. By pairing high-performance sales execution with a long-term outlook, he ensures that expansion stays sustainable and that every engagement creates lasting value for clients and stakeholders alike.",
    ],
  },
  {
    photo: "/images/leadership/robin-pahuja.png",
    name: "Mr. Robin Pahuja",
    title: "Co-Founder & Managing Director",
    tagline: "Strategy shaped by trust.",
    bio: [
      "Mr. Robin Pahuja brings strategic foresight and operational excellence to Elite Pro Infra. He has a sharp eye for high-growth opportunities, and he makes sure each one is carried out seamlessly. He keeps the company’s sales strategy closely aligned with evolving client expectations, so its direction stays relevant to the people it serves.",
      "As Managing Director, he is also a committed mentor who shapes the team and its culture. He builds an environment where high performance and ethical practice go hand in hand.",
    ],
    quote: "“Excellence is built on trust and deep market understanding.”",
    storyBio: [
      "Mr. Robin Pahuja, Co-founder & Director of ElitePro Infra, is a visionary entrepreneur who transitioned from a successful business background into diverse sectors like agriculture and coal mining, showcasing strong operational and execution expertise.",
      "In real estate, he played a key role in rebranding Elite Landbase into ElitePro Infra, introducing a customer-first approach focused on enhanced experience and reliability. With his expansion into the Dubai market, he continues to drive growth, innovation, and transformation, aiming to elevate industry standards and deliver exceptional value.",
    ],
  },
  {
    photo: "/images/leadership/rajat-mehta.png",
    name: "Mr. Rajat Mehta",
    title: "Co-Founder & Director – Operations",
    tagline: "The standard behind every experience.",
    bio: [
      "Mr. Rajat Mehta is the operational backbone of Elite Pro Infra. He ensures the company’s promise of quality is delivered in every interaction, from the first conversation to the final detail. His work reflects a clear commitment to precision and efficiency.",
      "He oversees the technological and administrative frameworks that empower the sales teams, so they can focus on clients while the systems behind them run smoothly. This keeps the company agile and innovative in a competitive market.",
    ],
    quote: "“We are devoted to serving data-driven, insight-led, genuine experiences.”",
    storyBio: [
      "Mr. Rajat Mehta is the Director at ElitePro Infra, with over 17 years of experience across the hospitality and real estate sectors. His expertise lies in operations, sales & marketing, and end-to-end project execution, ensuring seamless coordination from strategy to successful closure.",
      "Since joining ElitePro Infra in 2017, he has been instrumental in expanding the company's presence across the dynamic markets of Delhi NCR and UAE. Transitioning from hospitality to real estate, he initially led CRM and accounting, gaining deep insights into client relations and financial management before moving into core sales and marketing.",
      "With a strong foundation built through his tenure with renowned hospitality brands like The Leela, Radisson, and Sarovar Hotels & Resorts, Mr. Mehta brings a customer-centric approach and operational excellence to real estate. Known for his hands-on leadership and strategic mindset, he consistently drives business growth, builds strong brand positioning, and delivers high-value outcomes in competitive markets.",
    ],
  },
];
