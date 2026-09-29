export type Leader = {
  photo: string;
  name: string;
  title: string;
  /**
   * The live site spells Viren's title differently on /leadership than on
   * /our-story; this keeps both pages matching their reference.
   */
  leadershipTitle?: string;
  bio: string;
  /** The longer profile live prints on /our-story (falls back to `bio`). */
  storyBio?: string[];
};

export const leaders: Leader[] = [
  {
    photo: "/images/leadership/viren-mehta.png",
    name: "Mr. Viren Mehta",
    title: "Founder & Director - Sales",
    leadershipTitle: "Founder & Director-Sales",
    bio: "Mr. Viren Mehta is the visionary Founder and Director – Sales, leading the company with a strong focus on strategic growth and revenue excellence. With a deep understanding of market dynamics and customer needs, he oversees sales strategy, business development, and key client relationships. His leadership ensures sustainable expansion, high-performance sales execution, and long-term value creation for clients and stakeholders.",
  },
  {
    photo: "/images/leadership/robin-pahuja.png",
    name: "Mr. Robin Pahuja",
    title: "Co-Founder & Managing - Director",
    bio: "Mr. Robin Pahuja brings strategic foresight and operational excellence to the table. Believing that “Excellence is built on trust and deep market understanding,” he aligns the company's sales strategies with evolving client expectations. His expertise lies in identifying high-growth opportunities and ensuring seamless execution. He plays a pivotal role in mentoring the team and fostering a culture of high performance and ethical practices.",
    storyBio: [
      "Mr. Robin Pahuja, Co-founder & Director of ElitePro Infra, is a visionary entrepreneur who transitioned from a successful business background into diverse sectors like agriculture and coal mining, showcasing strong operational and execution expertise.",
      "In real estate, he played a key role in rebranding Elite Landbase into ElitePro Infra, introducing a customer-first approach focused on enhanced experience and reliability. With his expansion into the Dubai market, he continues to drive growth, innovation, and transformation, aiming to elevate industry standards and deliver exceptional value.",
    ],
  },
  {
    photo: "/images/leadership/rajat-mehta.png",
    name: "Mr. Rajat Mehta",
    title: "Co-Founder & Director - Operations",
    bio: "As the operational backbone of Elite Pro Infra, Mr. Rajat Mehta ensures that the company's promise of quality is delivered in every interaction. His motto, “We are devoted to serving data-driven, insight-led, genuine experiences,” reflects his commitment to precision and efficiency. He oversees the technological and administrative frameworks that empower the sales teams, ensuring that the company remains agile and innovative in a competitive landscape.",
    storyBio: [
      "Mr. Rajat Mehta is the Director at ElitePro Infra, with over 17 years of experience across the hospitality and real estate sectors. His expertise lies in operations, sales & marketing, and end-to-end project execution, ensuring seamless coordination from strategy to successful closure.",
      "Since joining ElitePro Infra in 2017, he has been instrumental in expanding the company's presence across the dynamic markets of Delhi NCR and UAE. Transitioning from hospitality to real estate, he initially led CRM and accounting, gaining deep insights into client relations and financial management before moving into core sales and marketing.",
      "With a strong foundation built through his tenure with renowned hospitality brands like The Leela, Radisson, and Sarovar Hotels & Resorts, Mr. Mehta brings a customer-centric approach and operational excellence to real estate. Known for his hands-on leadership and strategic mindset, he consistently drives business growth, builds strong brand positioning, and delivers high-value outcomes in competitive markets.",
    ],
  },
];
