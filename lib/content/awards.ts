/**
 * What the public awards gallery and the homepage carousel render — SERVER ONLY.
 *
 * Same contract as lib/content/teams.ts and lib/content/properties.ts: the
 * database when it is configured and has rows, the hardcoded lib/data/awards.ts
 * otherwise. The fallback covers an unconfigured `npm run export` build, an
 * unreachable database, and a deploy that has not been seeded yet.
 */
import "server-only";
import { cache } from "react";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listAwards } from "@/lib/db/queries";
import { awardImages } from "@/lib/data/awards";
import type { Award } from "@/lib/types";

const STATIC_AWARDS: Award[] = awardImages.map((image) => ({ image, caption: "" }));

/** Published awards in the admin's sort order. */
export const getAwards = cache(async (): Promise<Award[]> => {
  if (!isDatabaseConfigured()) return STATIC_AWARDS;

  try {
    const rows = await listAwards();
    if (rows.length === 0) return STATIC_AWARDS;
    return rows.map((row) => ({ image: row.image, caption: row.caption }));
  } catch (error) {
    console.error("[awards] database unavailable, serving the static gallery:", error);
    return STATIC_AWARDS;
  }
});
