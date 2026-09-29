import type { MetadataRoute } from "next";
import { articleHref, articles } from "@/lib/data/articles";
import { propertyDetails } from "@/lib/data/propertyDetails";

// Already prerendered in the server build; stated explicitly because a static
// export (scripts/export.sh) errors on any metadata route that has not opted in.
export const dynamic = "force-static";

const baseUrl = "https://eliteproinfra.com";

const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/leadership", changeFrequency: "monthly", priority: 0.6 },
  { path: "/social-commitment", changeFrequency: "monthly", priority: 0.5 },
  { path: "/about/sales-portfolio-management", changeFrequency: "monthly", priority: 0.4 },
  { path: "/about/leasing-portfolio-management", changeFrequency: "monthly", priority: 0.4 },
  { path: "/about/crm-marketing", changeFrequency: "monthly", priority: 0.4 },
  { path: "/services/investment-sales-advisory", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services/nri-advisory", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services/property-management", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services/land-acquisition", changeFrequency: "monthly", priority: 0.7 },
  { path: "/properties", changeFrequency: "weekly", priority: 0.9 },
  { path: "/nri-corner", changeFrequency: "monthly", priority: 0.7 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/media-press", changeFrequency: "weekly", priority: 0.6 },
  { path: "/insights-blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/news-updates", changeFrequency: "weekly", priority: 0.6 },
  { path: "/life-at-elite", changeFrequency: "monthly", priority: 0.5 },
  { path: "/awards", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...routes.map(({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...propertyDetails.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}${articleHref(article)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
