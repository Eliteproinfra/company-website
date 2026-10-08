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

const STATIC_BY_TITLE = new Map(
  jobListings.map((job) => [job.title.trim().toLowerCase(), job])
);

function toJobListing(record: JobRecord): JobListing {
  const listing: JobListing = {
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

  // The summary, qualifications and responsibilities columns were added after
  // the first release. A row seeded before that has all three empty until
  // `npm run db:seed` backfills it — and seeding is a manual step, so a deploy
  // reaches production first and the accordion would render its headings with
  // nothing underneath. Where the static file still has that posting's copy,
  // use it rather than show an empty description.
  //
  // Deliberately all-or-nothing: a posting an author has actually written is
  // never partly overwritten, and once any copy exists this never applies
  // again. Safe to delete once every environment has been seeded.
  const isEmpty =
    !listing.summary && !listing.qualifications.length && !listing.responsibilities.length;
  if (!isEmpty) return listing;

  const fallback = STATIC_BY_TITLE.get(record.title.trim().toLowerCase());
  if (!fallback) return listing;

  return {
    ...listing,
    summary: fallback.summary,
    qualifications: fallback.qualifications,
    responsibilities: fallback.responsibilities,
    bullet: fallback.bullet,
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
