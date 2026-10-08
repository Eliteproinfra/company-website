/** One card in the homepage "Insights Hub" tabs. Built by
 *  lib/content/insightsHub.ts from whatever the database holds, so an article
 *  added in the admin reaches the homepage. */
export type InsightHubItem = {
  image: string;
  title: string;
  excerpt: string;
  href: string;
};

export type InsightHubCategory = {
  key: string;
  label: string;
  hubHref: string;
  hubLabel: string;
  items: InsightHubItem[];
};

/*
 * For reference: before this was wired to the database each tab listed a fixed
 * set of article ids copied from the live site —
 *   PR & Media  132, 130, 129, 128, 127
 *   Blog        169, 162, 161, 157, 156, 152, 148, 144, 93, 91
 *   News        171, 170, 168, 165, 164, 163, 159, 158
 * Each tab now shows its section's newest items instead.
 */
