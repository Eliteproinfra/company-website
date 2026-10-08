#!/usr/bin/env node
/**
 * Imports the existing static content in lib/data/*.ts into MySQL.
 *
 * Usage:
 *   npm run db:seed          # insert missing rows, leave existing ones alone
 *   npm run db:seed -- --force   # also overwrite rows that already exist
 *
 * This is the migration path off hardcoded data: the site keeps rendering the
 * same content, but the admin can now edit it. Idempotent by default, so it is
 * safe to re-run after adding more static entries.
 *
 * Most lib/data modules only use `import type`, which Node's type stripping
 * removes — but properties.ts, insightsHub.ts and signatureProjects.ts import
 * real values through the `@/` alias, and plain node does not read tsconfig
 * paths. So this runs with scripts/alias-register.mjs, which teaches the
 * loader that alias. Run via `npm run db:seed`, which wires up both that and
 * `--experimental-transform-types`; invoking this file with bare `node` fails
 * with "Cannot find package '@/lib'".
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import mysql from "mysql2/promise";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");

function readEnvFile(name) {
  try {
    const contents = readFileSync(resolve(projectRoot, name), "utf8");
    const values = {};
    for (const line of contents.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
    return values;
  } catch {
    return {};
  }
}

const env = { ...readEnvFile(".env.local"), ...process.env };

const load = (relative) => import(pathToFileURL(resolve(projectRoot, relative)).href);

/** Live pages show dates like "12 Aug 2025"; the DATE column needs YYYY-MM-DD. */
function toSqlDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

async function main() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error("Missing database config in .env.local.");
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    database: DB_NAME,
    charset: "utf8mb4_unicode_ci",
  });

  const { sanitizeArticleHtml } = await load("lib/db/sanitize.ts");
  const { propertyDetails } = await load("lib/data/propertyDetails.ts");
  const { featuredProperties } = await load("lib/data/properties.ts");
  const { articles } = await load("lib/data/articles.ts");
  const { jobListings } = await load("lib/data/careers.ts");
  const { awardImages } = await load("lib/data/awards.ts");
  const { salesTeam, leasingTeam, crmTeam } = await load("lib/data/teams.ts");

  const featuredTitles = new Set(featuredProperties.map((p) => p.title));
  const stats = { properties: 0, articles: 0, jobs: 0, awards: 0, team: 0, skipped: 0 };

  // -------------------------------------------------------- properties ---
  for (const [index, property] of propertyDetails.entries()) {
    const [existing] = await connection.execute("SELECT id FROM properties WHERE slug = ?", [
      property.slug,
    ]);
    if (existing.length && !force) {
      stats.skipped++;
      continue;
    }

    const values = [
      property.slug,
      property.title,
      property.category ?? "",
      property.badgeVariant ?? "residential",
      property.category ?? "",
      property.location ?? "",
      property.price ?? "",
      property.priceNote ?? "",
      "",
      "",
      sanitizeArticleHtml(property.description ?? ""),
      property.mapUrl ?? null,
      JSON.stringify(property.images ?? []),
      JSON.stringify(property.specs ?? []),
      JSON.stringify(property.amenities ?? []),
      JSON.stringify(property.faqs ?? []),
      JSON.stringify(property.experts ?? []),
      JSON.stringify(property.relatedIds ?? []),
      JSON.stringify(property.developer ?? null),
      featuredTitles.has(property.title) ? 1 : 0,
      1,
      index,
    ];

    if (existing.length) {
      await connection.execute(
        `UPDATE properties SET slug=?, title=?, category=?, badge_variant=?, badge_text=?,
           location=?, price=?, price_note=?, beds=?, area=?, description=?, map_url=?,
           images=?, specs=?, amenities=?, faqs=?, experts=?, related_ids=?, developer=?,
           is_featured=?, is_published=?, sort_order=? WHERE id=?`,
        [...values, existing[0].id]
      );
    } else {
      // The original numeric id is preserved so relatedIds keep pointing at the
      // right listings.
      await connection.execute(
        `INSERT INTO properties (id, slug, title, category, badge_variant, badge_text, location,
           price, price_note, beds, area, description, map_url, images, specs, amenities, faqs,
           experts, related_ids, developer, is_featured, is_published, sort_order)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [property.id ?? null, ...values]
      );
    }
    stats.properties++;
  }

  // ---------------------------------------------------------- articles ---
  for (const article of articles) {
    const [existing] = await connection.execute(
      "SELECT id FROM articles WHERE kind = ? AND slug = ?",
      [article.kind, article.slug]
    );
    if (existing.length && !force) {
      stats.skipped++;
      continue;
    }

    const values = [
      article.kind,
      article.slug,
      article.title,
      toSqlDate(article.date),
      article.excerpt ?? "",
      article.image ?? "",
      article.imageWidth ?? 0,
      article.imageHeight ?? 0,
      // Re-sanitised on the way in even though it was cleaned at build time —
      // this is the last gate before it becomes editable, rendered content.
      sanitizeArticleHtml(article.content ?? ""),
      JSON.stringify(article.relatedIds ?? []),
      1,
    ];

    if (existing.length) {
      await connection.execute(
        `UPDATE articles SET kind=?, slug=?, title=?, published_on=?, excerpt=?, image=?,
           image_width=?, image_height=?, content=?, related_ids=?, is_published=? WHERE id=?`,
        [...values, existing[0].id]
      );
    } else {
      await connection.execute(
        `INSERT INTO articles (id, kind, slug, title, published_on, excerpt, image, image_width,
           image_height, content, related_ids, is_published)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [article.id ?? null, ...values]
      );
    }
    stats.articles++;
  }

  // -------------------------------------------------------------- jobs ---
  for (const [index, job] of jobListings.entries()) {
    const [existing] = await connection.execute(
      "SELECT id, summary FROM job_listings WHERE title = ? AND department = ?",
      [job.title, job.department ?? ""]
    );

    if (existing.length && !force) {
      // The description columns were added after the first release, so rows
      // seeded before that have them empty. Backfill those without --force,
      // which would otherwise be the only way to get a description onto an
      // existing posting — and --force overwrites admin edits everywhere else.
      // A posting that already has a description is left alone.
      if (!existing[0].summary) {
        await connection.execute(
          `UPDATE job_listings SET summary=?, qualifications=?, responsibilities=?, bullet=?
           WHERE id=?`,
          [
            job.summary ?? "",
            JSON.stringify(job.qualifications ?? []),
            JSON.stringify(job.responsibilities ?? []),
            job.bullet ?? "•",
            existing[0].id,
          ]
        );
        stats.jobs++;
      } else {
        stats.skipped++;
      }
      continue;
    }

    const values = [
      job.title,
      job.department ?? "",
      job.location ?? "",
      job.type ?? "",
      job.experience ?? "",
      job.summary ?? "",
      JSON.stringify(job.qualifications ?? []),
      JSON.stringify(job.responsibilities ?? []),
      // Live typed these lists with an inconsistent glyph; preserved so seeded
      // postings keep rendering as they do today (see schema.sql).
      job.bullet ?? "•",
      index,
    ];

    if (existing.length) {
      await connection.execute(
        `UPDATE job_listings SET title=?, department=?, location=?, type=?, experience=?,
           summary=?, qualifications=?, responsibilities=?, bullet=?, sort_order=? WHERE id=?`,
        [...values, existing[0].id]
      );
    } else {
      await connection.execute(
        `INSERT INTO job_listings (title, department, location, type, experience, summary,
           qualifications, responsibilities, bullet, sort_order)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        values
      );
    }
    stats.jobs++;
  }

  // ------------------------------------------------------- team members ---
  // Keyed on (department, name): the static rosters carry no ids, and the same
  // person legitimately appears on two pages (Dev Verma is in sales and in
  // leasing), so the department has to be part of the key.
  const rosters = [
    ["sales", salesTeam],
    ["leasing", leasingTeam],
    ["crm", crmTeam],
  ];

  for (const [department, roster] of rosters) {
    for (const [index, member] of roster.entries()) {
      const [existing] = await connection.execute(
        "SELECT id FROM team_members WHERE department = ? AND name = ?",
        [department, member.name]
      );
      if (existing.length && !force) {
        stats.skipped++;
        continue;
      }

      // Preserves the order the page lists them in today — the rosters are not
      // alphabetical and the seniority order is deliberate.
      const values = [
        department,
        member.name,
        member.title ?? "",
        member.experience ?? "",
        member.photo ?? "",
        member.phone ?? "",
        member.email ?? "",
        member.linkedin ?? "",
        1,
        index,
      ];

      if (existing.length) {
        await connection.execute(
          `UPDATE team_members SET department=?, name=?, title=?, experience=?, photo=?,
             phone=?, email=?, linkedin=?, is_published=?, sort_order=? WHERE id=?`,
          [...values, existing[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO team_members (department, name, title, experience, photo, phone,
             email, linkedin, is_published, sort_order)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          values
        );
      }
      stats.team++;
    }
  }

  // ------------------------------------------------------------ awards ---
  for (const [index, image] of awardImages.entries()) {
    const [existing] = await connection.execute("SELECT id FROM awards WHERE image = ?", [image]);
    if (existing.length) {
      stats.skipped++;
      continue;
    }
    await connection.execute("INSERT INTO awards (image, sort_order) VALUES (?,?)", [image, index]);
    stats.awards++;
  }

  await connection.end();

  console.log("\nSeed complete.");
  console.log(`  properties : ${stats.properties}`);
  console.log(`  articles   : ${stats.articles}`);
  console.log(`  jobs       : ${stats.jobs}`);
  console.log(`  awards     : ${stats.awards}`);
  console.log(`  team       : ${stats.team}`);
  console.log(`  skipped    : ${stats.skipped} (already present — use --force to overwrite)\n`);
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
