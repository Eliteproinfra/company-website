/**
 * What the /careers job accordion renders — SERVER ONLY.
 *
 * Same contract as the other resolvers in this directory: the database when it
 * is configured and has rows, the hardcoded lib/data/careers.ts otherwise.
 *
 * Only the postings come from the database. The culture highlights, the photo
 * strip and the "how to apply" points on that page are page furniture rather
 * than records the admin manages, so they stay in lib/data/careers.ts.
 */
import "server-only";
import { cache } from "react";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listJobs, type JobRecord } from "@/lib/db/queries";
import { jobListings, type JobListing } from "@/lib/data/careers";

function toJobListing(record: JobRecord): JobListing {
  return {
    id: record.id,
    title: record.title,
    department: record.department,
    location: record.location,
    type: record.type,
    experience: record.experience,
    summary: record.summary ?? "",
    qualifications: record.qualifications,
    responsibilities: record.responsibilities,
    // Narrowed back to the two glyphs the type allows; anything else in the
    // column (it is a VARCHAR) falls back to the bullet rather than rendering
    // a stray character in front of every line.
    bullet: record.bullet === "*" ? "*" : "•",
  };
}

/** Published postings in the admin's sort order. */
export const getJobListings = cache(async (): Promise<JobListing[]> => {
  if (!isDatabaseConfigured()) return jobListings;

  try {
    const records = await listJobs();
    // No rows means the seed has not been run, not that hiring has stopped.
    if (records.length === 0) return jobListings;
    return records.map(toJobListing);
  } catch (error) {
    console.error("[careers] database unavailable, serving the static postings:", error);
    return jobListings;
  }
});
