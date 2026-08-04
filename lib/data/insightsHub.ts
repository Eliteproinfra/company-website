export type InsightHubItem = {
  image: string;
  title: string;
};

export type InsightHubCategory = {
  key: string;
  label: string;
  hubHref: string;
  hubLabel: string;
  items: InsightHubItem[];
};

export const insightsHub: InsightHubCategory[] = [
  {
    key: "media",
    label: "PR & Media",
    hubHref: "/media-press",
    hubLabel: "View All Press",
    items: [
      { image: "/images/insights/pr-hindustan-times.png", title: "Hry simplifies building code, eases FAR norms" },
      {
        image: "/images/insights/pr-abp.png",
        title: "Dubai's Golden Visa: What the New Residency Route Really Means For Indians",
      },
      {
        image: "/images/insights/pr-business-standard.png",
        title: "Homebuyers should reject possession without OC, seek legal recourse",
      },
      {
        image: "/images/insights/pr-news18.png",
        title: "Budget 2025: Real Estate Seeks Industry Status, Duty Cuts, Tax Sops",
      },
      {
        image: "/images/insights/pr-moneycontrol.png",
        title: "Closing Smarter: AI helps developers lift home sales by 20%",
      },
    ],
  },
  {
    key: "blog",
    label: "Insights & Blogs",
    hubHref: "/insights-blog",
    hubLabel: "Read More Insights",
    items: [
      {
        image: "/images/insights/blog-gurgaon-luxury.png",
        title: "Gurgaon Luxury Real Estate: India's Safest Long-Term Investment",
      },
      {
        image: "/images/insights/blog-elan-imperial-mall.jpg",
        title: "Is Elan Imperial Mall The Next Big Thing in Gurgaon?",
      },
      {
        image: "/images/insights/blog-m3m-golf-hills.jpg",
        title: "Why Invest In the M3M Golf Hills Project In Sector 79 Gurgaon?",
      },
    ],
  },
  {
    key: "news",
    label: "News & Updates",
    hubHref: "/news-updates",
    hubLabel: "See All Updates",
    items: [
      {
        image: "/images/skyline.webp",
        title: "Delhi-NCR tops housing market, sales rise 8 per cent; Gurugram drives growth",
      },
    ],
  },
];
