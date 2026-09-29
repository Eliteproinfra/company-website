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
 * The lib/data modules only ever use `import type`, which Node's type stripping
 * removes, so they can be imported directly here without any path-alias setup.
 * Run under `node --experimental-transform-types` (the npm script does this).
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

  const featuredTitles = new Set(featuredProperties.map((p) => p.title));
  const stats = { properties: 0, articles: 0, jobs: 0, awards: 0, skipped: 0 };

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
      "SELECT id FROM job_listings WHERE title = ? AND department = ?",
      [job.title, job.department ?? ""]
    );
    if (existing.length && !force) {
      stats.skipped++;
      continue;
    }
    if (!existing.length) {
      await connection.execute(
        `INSERT INTO job_listings (title, department, location, type, experience, sort_order)
         VALUES (?,?,?,?,?,?)`,
        [job.title, job.department ?? "", job.location ?? "", job.type ?? "", job.experience ?? "", index]
      );
      stats.jobs++;
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
  console.log(`  skipped    : ${stats.skipped} (already present — use --force to overwrite)\n`);
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
