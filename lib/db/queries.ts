/**
 * Typed data access for the admin CMS and the public pages — SERVER ONLY.
 *
 * Every statement is parameterised. Column lists are written out rather than
 * `SELECT *` so a schema change surfaces as a TypeScript error instead of an
 * undefined field at render time.
 */
import "server-only";
import { execute, query, queryOne, type SqlParam } from "@/lib/db/client";
import { sanitizeArticleHtml } from "@/lib/db/sanitize";
import { reorderedIds } from "@/lib/reorder";
import { sanitizeSlug, slugify } from "@/lib/slug";
import type { PropertyBadgeVariant } from "@/lib/types";
import type {
  PropertyAmenity,
  PropertyDeveloper,
  PropertyExpert,
  PropertyFaq,
  PropertyFloorPlan,
  PropertyFurnishing,
  PropertyKeyFact,
  PropertyNearby,
  PropertyPriceTrend,
  PropertyProjectInfo,
  PropertyReview,
  PropertySpec,
  PropertyVideo,
} from "@/lib/data/propertyDetails";

export type ArticleKind = "press" | "blog" | "news";

/** MySQL JSON columns come back parsed by mysql2, but a legacy TEXT column (or a
 *  hand-edited row) may still hold a string — so parse defensively. */
function asJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

// ------------------------------------------------------------- properties ---

export type PropertyRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  badge_variant: PropertyBadgeVariant;
  badge_text: string;
  location: string;
  price: string;
  price_note: string;
  beds: string;
  area: string;
  description: string | null;
  map_url: string | null;
  images: unknown;
  specs: unknown;
  amenities: unknown;
  faqs: unknown;
  experts: unknown;
  related_ids: unknown;
  developer: unknown;
  key_facts: unknown;
  furnishings: unknown;
  floor_plans: unknown;
  nearby: unknown;
  project_info: unknown;
  videos: unknown;
  reviews: unknown;
  price_trends: unknown;
  is_featured: number;
  is_published: number;
  sort_order: number;
  updated_at: string;
};

export type PropertyRecord = Omit<
  PropertyRow,
  | "images"
  | "specs"
  | "amenities"
  | "faqs"
  | "experts"
  | "related_ids"
  | "developer"
  | "key_facts"
  | "furnishings"
  | "floor_plans"
  | "nearby"
  | "project_info"
  | "videos"
  | "reviews"
  | "price_trends"
> & {
  images: string[];
  specs: PropertySpec[];
  amenities: PropertyAmenity[];
  faqs: PropertyFaq[];
  experts: PropertyExpert[];
  relatedIds: number[];
  developer: PropertyDeveloper | null;
  keyFacts: PropertyKeyFact[];
  furnishings: PropertyFurnishing[];
  floorPlans: PropertyFloorPlan[];
  nearby: PropertyNearby[];
  projectInfo: PropertyProjectInfo | null;
  videos: PropertyVideo[];
  reviews: PropertyReview[];
  priceTrends: PropertyPriceTrend[];
};

const PROPERTY_COLUMNS = `id, slug, title, category, badge_variant, badge_text, location,
  price, price_note, beds, area, description, map_url, images, specs, amenities, faqs,
  experts, related_ids, developer, key_facts, furnishings, floor_plans, nearby,
  project_info, videos, reviews, price_trends, is_featured, is_published, sort_order,
  updated_at`;

function toPropertyRecord(row: PropertyRow): PropertyRecord {
  return {
    ...row,
    images: asJson<string[]>(row.images, []),
    specs: asJson(row.specs, [] as PropertyRecord["specs"]),
    amenities: asJson(row.amenities, [] as PropertyRecord["amenities"]),
    faqs: asJson(row.faqs, [] as PropertyRecord["faqs"]),
    experts: asJson(row.experts, [] as PropertyRecord["experts"]),
    relatedIds: asJson<number[]>(row.related_ids, []),
    developer: asJson<PropertyRecord["developer"]>(row.developer, null),
    keyFacts: asJson(row.key_facts, [] as PropertyRecord["keyFacts"]),
    furnishings: asJson(row.furnishings, [] as PropertyRecord["furnishings"]),
    floorPlans: asJson(row.floor_plans, [] as PropertyRecord["floorPlans"]),
    nearby: asJson(row.nearby, [] as PropertyRecord["nearby"]),
    projectInfo: asJson<PropertyRecord["projectInfo"]>(row.project_info, null),
    videos: asJson(row.videos, [] as PropertyRecord["videos"]),
    reviews: asJson(row.reviews, [] as PropertyRecord["reviews"]),
    priceTrends: asJson(row.price_trends, [] as PropertyRecord["priceTrends"]),
  };
}

export async function listProperties(options: { includeUnpublished?: boolean } = {}) {
  const where = options.includeUnpublished ? "" : "WHERE is_published = 1";
  const rows = await query<PropertyRow>(
    `SELECT ${PROPERTY_COLUMNS} FROM properties ${where} ORDER BY sort_order ASC, id DESC`
  );
  return rows.map(toPropertyRecord);
}

export async function getPropertyById(id: number) {
  const row = await queryOne<PropertyRow>(
    `SELECT ${PROPERTY_COLUMNS} FROM properties WHERE id = ?`,
    [id]
  );
  return row ? toPropertyRecord(row) : null;
}

export async function getPropertyBySlug(slug: string) {
  const row = await queryOne<PropertyRow>(
    `SELECT ${PROPERTY_COLUMNS} FROM properties WHERE slug = ? AND is_published = 1`,
    [slug]
  );
  return row ? toPropertyRecord(row) : null;
}

export type PropertyInput = {
  slug?: string;
  title: string;
  category: string;
  badgeVariant: PropertyBadgeVariant;
  badgeText: string;
  location: string;
  price: string;
  priceNote: string;
  beds: string;
  area: string;
  description: string;
  mapUrl: string;
  images: string[];
  specs: PropertyRecord["specs"];
  amenities: PropertyRecord["amenities"];
  faqs: PropertyRecord["faqs"];
  experts: PropertyRecord["experts"];
  relatedIds: number[];
  developer: PropertyRecord["developer"];
  keyFacts: PropertyRecord["keyFacts"];
  furnishings: PropertyRecord["furnishings"];
  floorPlans: PropertyRecord["floorPlans"];
  nearby: PropertyRecord["nearby"];
  projectInfo: PropertyRecord["projectInfo"];
  videos: PropertyRecord["videos"];
  reviews: PropertyRecord["reviews"];
  priceTrends: PropertyRecord["priceTrends"];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

function propertyParams(input: PropertyInput, slug: string): SqlParam[] {
  return [
    slug,
    input.title,
    input.category,
    input.badgeVariant,
    input.badgeText,
    input.location,
    input.price,
    input.priceNote,
    input.beds,
    input.area,
    // Description is rendered as HTML on the detail page, so it goes through the
    // same allowlist as article bodies.
    sanitizeArticleHtml(input.description),
    input.mapUrl,
    JSON.stringify(input.images ?? []),
    JSON.stringify(input.specs ?? []),
    JSON.stringify(input.amenities ?? []),
    JSON.stringify(input.faqs ?? []),
    JSON.stringify(input.experts ?? []),
    JSON.stringify(input.relatedIds ?? []),
    JSON.stringify(input.developer ?? null),
    JSON.stringify(input.keyFacts ?? []),
    JSON.stringify(input.furnishings ?? []),
    JSON.stringify(input.floorPlans ?? []),
    JSON.stringify(input.nearby ?? []),
    JSON.stringify(input.projectInfo ?? null),
    JSON.stringify(input.videos ?? []),
    JSON.stringify(input.reviews ?? []),
    JSON.stringify(input.priceTrends ?? []),
    input.isFeatured ? 1 : 0,
    input.isPublished ? 1 : 0,
    input.sortOrder,
  ];
}

/** Returns the slug actually written — `uniqueSlug` may differ from the input,
 *  and the caller needs it to revalidate the right public page. */
export async function createProperty(input: PropertyInput): Promise<{ id: number; slug: string }> {
  const slug = await uniqueSlug("properties", input.slug || slugify(input.title));
  const { insertId } = await execute(
    `INSERT INTO properties
      (slug, title, category, badge_variant, badge_text, location, price, price_note,
       beds, area, description, map_url, images, specs, amenities, faqs, experts,
       related_ids, developer, key_facts, furnishings, floor_plans, nearby,
       project_info, videos, reviews, price_trends, is_featured, is_published,
       sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    propertyParams(input, slug)
  );
  return { id: insertId, slug };
}

/** Returns the slug actually written — see {@link createProperty}. */
export async function updateProperty(id: number, input: PropertyInput): Promise<{ slug: string }> {
  const slug = await uniqueSlug("properties", input.slug || slugify(input.title), id);
  await execute(
    `UPDATE properties SET
       slug=?, title=?, category=?, badge_variant=?, badge_text=?, location=?, price=?,
       price_note=?, beds=?, area=?, description=?, map_url=?, images=?, specs=?,
       amenities=?, faqs=?, experts=?, related_ids=?, developer=?, key_facts=?,
       furnishings=?, floor_plans=?, nearby=?, project_info=?, videos=?, reviews=?,
       price_trends=?, is_featured=?, is_published=?, sort_order=?
     WHERE id=?`,
    [...propertyParams(input, slug), id]
  );
  return { slug };
}

export async function deleteProperty(id: number): Promise<void> {
  await execute("DELETE FROM properties WHERE id = ?", [id]);
}

// --------------------------------------------------------------- articles ---

export type ArticleRow = {
  id: number;
  kind: ArticleKind;
  slug: string;
  title: string;
  published_on: string | null;
  excerpt: string | null;
  image: string;
  image_width: number;
  image_height: number;
  content: string | null;
  related_ids: unknown;
  is_published: number;
  updated_at: string;
};

export type ArticleRecord = Omit<ArticleRow, "related_ids"> & { relatedIds: number[] };

const ARTICLE_COLUMNS = `id, kind, slug, title, published_on, excerpt, image, image_width,
  image_height, content, related_ids, is_published, updated_at`;

function toArticleRecord(row: ArticleRow): ArticleRecord {
  return { ...row, relatedIds: asJson<number[]>(row.related_ids, []) };
}

export async function listArticles(
  kind?: ArticleKind,
  options: { includeUnpublished?: boolean } = {}
) {
  const clauses: string[] = [];
  const params: SqlParam[] = [];
  if (kind) {
    clauses.push("kind = ?");
    params.push(kind);
  }
  if (!options.includeUnpublished) clauses.push("is_published = 1");
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = await query<ArticleRow>(
    `SELECT ${ARTICLE_COLUMNS} FROM articles ${where}
     ORDER BY published_on IS NULL, published_on DESC, id DESC`,
    params
  );
  return rows.map(toArticleRecord);
}

export async function getArticleById(id: number) {
  const row = await queryOne<ArticleRow>(
    `SELECT ${ARTICLE_COLUMNS} FROM articles WHERE id = ?`,
    [id]
  );
  return row ? toArticleRecord(row) : null;
}

export async function getArticleBySlug(kind: ArticleKind, slug: string) {
  const row = await queryOne<ArticleRow>(
    `SELECT ${ARTICLE_COLUMNS} FROM articles WHERE kind = ? AND slug = ? AND is_published = 1`,
    [kind, slug]
  );
  return row ? toArticleRecord(row) : null;
}

export type ArticleInput = {
  kind: ArticleKind;
  slug?: string;
  title: string;
  publishedOn: string | null;
  excerpt: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  content: string;
  relatedIds: number[];
  isPublished: boolean;
};

/** Returns the slug actually written — uniqueSlug may differ from the input,
 *  and the caller needs it to revalidate the right public page. */
export async function createArticle(input: ArticleInput): Promise<{ id: number; slug: string }> {
  const slug = await uniqueSlug("articles", input.slug || slugify(input.title), undefined, {
    column: "kind",
    value: input.kind,
  });
  const { insertId } = await execute(
    `INSERT INTO articles
       (kind, slug, title, published_on, excerpt, image, image_width, image_height,
        content, related_ids, is_published)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      input.kind,
      slug,
      input.title,
      input.publishedOn || null,
      input.excerpt,
      input.image,
      input.imageWidth,
      input.imageHeight,
      sanitizeArticleHtml(input.content),
      JSON.stringify(input.relatedIds ?? []),
      input.isPublished ? 1 : 0,
    ]
  );
  return { id: insertId, slug };
}

/** Returns the slug actually written — see {@link createArticle}. */
export async function updateArticle(id: number, input: ArticleInput): Promise<{ slug: string }> {
  const slug = await uniqueSlug("articles", input.slug || slugify(input.title), id, {
    column: "kind",
    value: input.kind,
  });
  await execute(
    `UPDATE articles SET kind=?, slug=?, title=?, published_on=?, excerpt=?, image=?,
       image_width=?, image_height=?, content=?, related_ids=?, is_published=?
     WHERE id=?`,
    [
      input.kind,
      slug,
      input.title,
      input.publishedOn || null,
      input.excerpt,
      input.image,
      input.imageWidth,
      input.imageHeight,
      sanitizeArticleHtml(input.content),
      JSON.stringify(input.relatedIds ?? []),
      input.isPublished ? 1 : 0,
      id,
    ]
  );
  return { slug };
}

export async function deleteArticle(id: number): Promise<void> {
  await execute("DELETE FROM articles WHERE id = ?", [id]);
}

// ------------------------------------------------------------------- jobs ---

export type JobRow = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string | null;
  qualifications: unknown;
  responsibilities: unknown;
  bullet: string;
  is_published: number;
  sort_order: number;
};

export type JobRecord = Omit<JobRow, "qualifications" | "responsibilities"> & {
  qualifications: string[];
  responsibilities: string[];
};

const JOB_COLUMNS = `id, title, department, location, type, experience, summary,
  qualifications, responsibilities, bullet, is_published, sort_order`;

function toJobRecord(row: JobRow): JobRecord {
  return {
    ...row,
    qualifications: asJson<string[]>(row.qualifications, []),
    responsibilities: asJson<string[]>(row.responsibilities, []),
  };
}

export async function listJobs(options: { includeUnpublished?: boolean } = {}) {
  const where = options.includeUnpublished ? "" : "WHERE is_published = 1";
  const rows = await query<JobRow>(
    `SELECT ${JOB_COLUMNS} FROM job_listings ${where} ORDER BY sort_order ASC, id ASC`
  );
  return rows.map(toJobRecord);
}

export async function getJobById(id: number) {
  const row = await queryOne<JobRow>(
    `SELECT ${JOB_COLUMNS} FROM job_listings WHERE id = ?`,
    [id]
  );
  return row ? toJobRecord(row) : null;
}

export type JobInput = {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  qualifications: string[];
  responsibilities: string[];
  isPublished: boolean;
  sortOrder: number;
};

/** The bullet glyph is not part of JobInput — see the column comment in
 *  schema.sql. Existing rows keep theirs; new rows take the column default. */
function jobParams(input: JobInput): SqlParam[] {
  return [
    input.title,
    input.department,
    input.location,
    input.type,
    input.experience,
    input.summary,
    JSON.stringify(input.qualifications ?? []),
    JSON.stringify(input.responsibilities ?? []),
    input.isPublished ? 1 : 0,
    input.sortOrder,
  ];
}

export async function createJob(input: JobInput): Promise<number> {
  const { insertId } = await execute(
    `INSERT INTO job_listings (title, department, location, type, experience, summary,
       qualifications, responsibilities, is_published, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    jobParams(input)
  );
  return insertId;
}

export async function updateJob(id: number, input: JobInput): Promise<void> {
  await execute(
    `UPDATE job_listings SET title=?, department=?, location=?, type=?, experience=?,
       summary=?, qualifications=?, responsibilities=?, is_published=?, sort_order=?
     WHERE id=?`,
    [...jobParams(input), id]
  );
}

/**
 * Publish state and ordering only, for the quick controls on the listing page.
 *
 * Deliberately a separate statement rather than a full updateJob: that form
 * carries no description, so reusing the full update would blank the summary,
 * qualifications and responsibilities every time someone reordered a posting.
 */
export async function setJobVisibility(
  id: number,
  isPublished: boolean,
  sortOrder: number
): Promise<void> {
  await execute("UPDATE job_listings SET is_published=?, sort_order=? WHERE id=?", [
    isPublished ? 1 : 0,
    sortOrder,
    id,
  ]);
}

export async function deleteJob(id: number): Promise<void> {
  await execute("DELETE FROM job_listings WHERE id = ?", [id]);
}

// ----------------------------------------------------------- team members ---

export type TeamDepartment = "sales" | "leasing" | "crm";

export type TeamMemberRow = {
  id: number;
  department: TeamDepartment;
  name: string;
  title: string;
  experience: string;
  photo: string;
  phone: string;
  email: string;
  linkedin: string;
  is_published: number;
  sort_order: number;
};

const TEAM_COLUMNS = `id, department, name, title, experience, photo, phone, email,
  linkedin, is_published, sort_order`;

export async function listTeamMembers(
  department?: TeamDepartment,
  options: { includeUnpublished?: boolean } = {}
) {
  const clauses: string[] = [];
  const params: SqlParam[] = [];
  if (department) {
    clauses.push("department = ?");
    params.push(department);
  }
  if (!options.includeUnpublished) clauses.push("is_published = 1");
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  return query<TeamMemberRow>(
    `SELECT ${TEAM_COLUMNS} FROM team_members ${where}
     ORDER BY sort_order ASC, id ASC`,
    params
  );
}

export async function getTeamMemberById(id: number) {
  return queryOne<TeamMemberRow>(`SELECT ${TEAM_COLUMNS} FROM team_members WHERE id = ?`, [id]);
}

export type TeamMemberInput = {
  department: TeamDepartment;
  name: string;
  title: string;
  experience: string;
  photo: string;
  phone: string;
  email: string;
  linkedin: string;
  isPublished: boolean;
  sortOrder: number;
};

function teamMemberParams(input: TeamMemberInput): SqlParam[] {
  return [
    input.department,
    input.name,
    input.title,
    input.experience,
    input.photo,
    input.phone,
    input.email,
    input.linkedin,
    input.isPublished ? 1 : 0,
    input.sortOrder,
  ];
}

export async function createTeamMember(input: TeamMemberInput): Promise<number> {
  const { insertId } = await execute(
    `INSERT INTO team_members
       (department, name, title, experience, photo, phone, email, linkedin,
        is_published, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    teamMemberParams(input)
  );
  return insertId;
}

export async function updateTeamMember(id: number, input: TeamMemberInput): Promise<void> {
  await execute(
    `UPDATE team_members SET department=?, name=?, title=?, experience=?, photo=?,
       phone=?, email=?, linkedin=?, is_published=?, sort_order=? WHERE id=?`,
    [...teamMemberParams(input), id]
  );
}

export async function deleteTeamMember(id: number): Promise<void> {
  await execute("DELETE FROM team_members WHERE id = ?", [id]);
}

// ----------------------------------------------------------------- awards ---

export type AwardRow = {
  id: number;
  image: string;
  caption: string;
  is_published: number;
  sort_order: number;
};

export async function listAwards(options: { includeUnpublished?: boolean } = {}) {
  const where = options.includeUnpublished ? "" : "WHERE is_published = 1";
  return query<AwardRow>(
    `SELECT id, image, caption, is_published, sort_order FROM awards ${where}
     ORDER BY sort_order ASC, id ASC`
  );
}

/** One past the last award's position, for a new row that should land at the
 *  end. Without this a new award takes sort_order 0 and jumps to the *front*
 *  of a gallery whose rows were numbered from 0 upwards by the seed. */
export async function nextAwardSortOrder(): Promise<number> {
  const row = await queryOne<{ next: number | null }>(
    "SELECT MAX(sort_order) + 1 AS next FROM awards"
  );
  return row?.next ?? 0;
}

export async function createAward(image: string, caption: string, sortOrder: number) {
  const { insertId } = await execute(
    "INSERT INTO awards (image, caption, sort_order) VALUES (?,?,?)",
    [image, caption, sortOrder]
  );
  return insertId;
}

export type AwardInput = {
  image: string;
  caption: string;
  sortOrder: number;
  isPublished: boolean;
};

export async function updateAward(id: number, input: AwardInput): Promise<void> {
  await execute(
    "UPDATE awards SET image=?, caption=?, sort_order=?, is_published=? WHERE id=?",
    [input.image, input.caption, input.sortOrder, input.isPublished ? 1 : 0, id]
  );
}

/**
 * Moves one award one place up or down the gallery.
 *
 * Renumbers every row rather than swapping the pair's two sort_order values,
 * because they are frequently equal: createAward defaults to 0, so a gallery
 * can easily be a dozen rows all at 0 whose order comes from the `id ASC`
 * tiebreak in listAwards. Swapping two zeroes would do nothing at all, and the
 * admin would click the arrow and watch the row not move.
 *
 * One statement, so the gallery is never left half-renumbered.
 */
export async function moveAward(id: number, direction: -1 | 1): Promise<void> {
  const rows = await query<{ id: number }>(
    "SELECT id FROM awards ORDER BY sort_order ASC, id ASC"
  );

  const next = reorderedIds(rows.map((row) => row.id), id, direction);
  if (!next) return;

  // UPDATE … CASE id WHEN ? THEN ? … so the whole reorder lands at once.
  const cases = next.map(() => "WHEN ? THEN ?").join(" ");
  const params: SqlParam[] = next.flatMap((awardId, index) => [awardId, index]);
  await execute(
    `UPDATE awards SET sort_order = CASE id ${cases} ELSE sort_order END
      WHERE id IN (${next.map(() => "?").join(",")})`,
    [...params, ...next]
  );
}

export async function deleteAward(id: number): Promise<void> {
  await execute("DELETE FROM awards WHERE id = ?", [id]);
}

// -------------------------------------------------------------- enquiries ---

export type EnquiryRow = {
  id: number;
  source: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  extra: unknown;
  is_read: number;
  created_at: string;
};

/** How many enquiries the admin inbox shows per page. */
export const ENQUIRIES_PER_PAGE = 25;

/**
 * One page of the inbox, newest first.
 *
 * This used to take a bare `limit` defaulting to 200 and return every one of
 * them, so the page grew without bound: with a 5,000-character message allowed
 * per lead (the cap in /api/enquiry), 200 rows is up to a megabyte of HTML
 * rendered on every visit to the page, and past 200 the oldest leads became
 * simply unreachable through the UI. Paging fixes both.
 *
 * `ORDER BY created_at DESC` is served by idx_enquiries_recent — see the
 * migration at the end of schema.sql for why the older composite index could
 * not do it.
 */
export async function listEnquiries(options: { limit?: number; offset?: number } = {}) {
  // MySQL will not accept a bound parameter for LIMIT/OFFSET in a prepared
  // statement, so both are clamped to safe integers and interpolated. Never
  // pass raw input: these two Math.trunc calls are the only thing between a
  // query string and the SQL text.
  const safeLimit = Math.min(Math.max(Math.trunc(Number(options.limit) || ENQUIRIES_PER_PAGE), 1), 200);
  const safeOffset = Math.min(Math.max(Math.trunc(Number(options.offset) || 0), 0), 100_000);

  return query<EnquiryRow>(
    `SELECT id, source, name, email, phone, message, extra, is_read, created_at
       FROM enquiries ORDER BY created_at DESC, id DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
}

/** Totals for the inbox header and the pager. One round trip, not two. */
export async function countEnquiries(): Promise<{ total: number; unread: number }> {
  const row = await queryOne<{ total: number; unread: number }>(
    "SELECT COUNT(*) AS total, SUM(is_read = 0) AS unread FROM enquiries"
  );
  return {
    total: Number(row?.total ?? 0),
    // SUM() returns NULL over an empty table, and MySQL hands DECIMAL back as
    // a string — so this is coerced rather than trusted.
    unread: Number(row?.unread ?? 0),
  };
}

export async function createEnquiry(input: {
  source: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  extra: Record<string, string>;
}): Promise<number> {
  const { insertId } = await execute(
    "INSERT INTO enquiries (source, name, email, phone, message, extra) VALUES (?,?,?,?,?,?)",
    [
      input.source.slice(0, 120),
      input.name.slice(0, 190),
      input.email.slice(0, 190),
      input.phone.slice(0, 60),
      input.message,
      JSON.stringify(input.extra ?? {}),
    ]
  );
  return insertId;
}

export async function markEnquiryRead(id: number, read: boolean): Promise<void> {
  await execute("UPDATE enquiries SET is_read = ? WHERE id = ?", [read ? 1 : 0, id]);
}

export async function deleteEnquiry(id: number): Promise<void> {
  await execute("DELETE FROM enquiries WHERE id = ?", [id]);
}

// ------------------------------------------------------------------ misc ---

/**
 * Ensures a slug is unique, appending -2, -3, ... when taken. `scope` restricts
 * uniqueness to a subset (articles are unique per kind, not globally).
 *
 * Table and column names are interpolated, so callers must only ever pass the
 * literals used in this file — never user input.
 */
async function uniqueSlug(
  table: "properties" | "articles",
  base: string,
  excludeId?: number,
  scope?: { column: "kind"; value: string }
): Promise<string> {
  // Every slug the CMS writes passes through here, which is why the sanitising
  // lives here rather than at each call site: `base` is either slugify(title),
  // already safe, or whatever was typed into the admin's slug field, which is
  // not. A space in that field used to be stored as-is and the listing then
  // 404'd, its URL carrying a %20 that matches no route.
  const clean = sanitizeSlug(base) || "item";
  let candidate = clean;
  let suffix = 1;

  while (true) {
    const params: SqlParam[] = [candidate];
    let sql = `SELECT id FROM ${table} WHERE slug = ?`;
    if (scope) {
      sql += ` AND ${scope.column} = ?`;
      params.push(scope.value);
    }
    if (excludeId) {
      sql += " AND id <> ?";
      params.push(excludeId);
    }
    const clash = await queryOne<{ id: number }>(sql, params);
    if (!clash) return candidate;
    suffix += 1;
    candidate = `${clean}-${suffix}`;
  }
}

export async function dashboardCounts() {
  const [properties, articles, jobs, enquiries, unread] = await Promise.all([
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM properties"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM articles"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM job_listings"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM enquiries"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM enquiries WHERE is_read = 0"),
  ]);
  return {
    properties: properties?.n ?? 0,
    articles: articles?.n ?? 0,
    jobs: jobs?.n ?? 0,
    enquiries: enquiries?.n ?? 0,
    unreadEnquiries: unread?.n ?? 0,
  };
}
