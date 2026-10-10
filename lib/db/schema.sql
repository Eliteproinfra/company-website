-- Admin CMS schema.
--
-- Derived from the shapes the public site already consumes (lib/types.ts and
-- lib/data/*.ts), not from the live PHP admin — that panel is behind a login and
-- its source was not available. The frontend is therefore the source of truth:
-- every column here exists because a rendered page reads it.
--
-- utf8mb4 throughout: listing copy carries ₹, en dashes and emoji.

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  email         VARCHAR(190) NOT NULL UNIQUE,
  -- scrypt, stored as `scrypt$<N>$<r>$<p>$<salt-b64>$<hash-b64>`. Never plaintext.
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(120) NOT NULL DEFAULT '',
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME     NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side sessions. A random opaque token lives in an httpOnly cookie; the
-- authoritative record is here, so a session can actually be revoked (a signed
-- JWT could not be).
CREATE TABLE IF NOT EXISTS admin_sessions (
  token      CHAR(64)     NOT NULL PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  CONSTRAINT fk_session_user FOREIGN KEY (user_id)
    REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_sessions_expiry (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS properties (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(190) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  category      VARCHAR(80)  NOT NULL DEFAULT '',
  -- Drives the card badge colour; mirrors PropertyBadgeVariant in lib/types.ts.
  badge_variant ENUM('residential','commercial','sco','industrial','residential-plots')
                NOT NULL DEFAULT 'residential',
  badge_text    VARCHAR(80)  NOT NULL DEFAULT '',
  location      VARCHAR(190) NOT NULL DEFAULT '',
  price         VARCHAR(80)  NOT NULL DEFAULT '',
  price_note    VARCHAR(190) NOT NULL DEFAULT '',
  beds          VARCHAR(80)  NOT NULL DEFAULT '',
  area          VARCHAR(80)  NOT NULL DEFAULT '',
  description   MEDIUMTEXT   NULL,
  map_url       VARCHAR(500) NULL,
  -- Repeating sub-records (gallery, specs, amenities, FAQs, experts, related).
  -- Held as JSON rather than six child tables: they are always read and written
  -- as a whole listing, never queried across, and the page renders them in the
  -- author's order.
  images        JSON         NULL,
  specs         JSON         NULL,
  amenities     JSON         NULL,
  faqs          JSON         NULL,
  experts       JSON         NULL,
  related_ids   JSON         NULL,
  developer     JSON         NULL,
  is_featured   TINYINT(1)   NOT NULL DEFAULT 0,
  is_published  TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_properties_listing (is_published, sort_order),
  INDEX idx_properties_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PR & Media, Insights & Blogs and News & Updates share one shape on the public
-- site (lib/data/articles.ts), so they share one table keyed by `kind`.
CREATE TABLE IF NOT EXISTS articles (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kind         ENUM('press','blog','news') NOT NULL,
  slug         VARCHAR(190) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  published_on DATE         NULL,
  excerpt      TEXT         NULL,
  image        VARCHAR(500) NOT NULL DEFAULT '',
  image_width  INT          NOT NULL DEFAULT 0,
  image_height INT          NOT NULL DEFAULT 0,
  -- Sanitised HTML. Written through sanitizeArticleHtml() in lib/db/sanitize.ts,
  -- never stored raw: the previous host was compromised and injected markup into
  -- exactly this kind of column.
  content      MEDIUMTEXT   NULL,
  related_ids  JSON         NULL,
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_article_kind_slug (kind, slug),
  INDEX idx_articles_listing (kind, is_published, published_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_listings (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(190) NOT NULL,
  department   VARCHAR(120) NOT NULL DEFAULT '',
  location     VARCHAR(120) NOT NULL DEFAULT '',
  type         VARCHAR(80)  NOT NULL DEFAULT '',
  experience   VARCHAR(80)  NOT NULL DEFAULT '',
  -- The accordion body on /careers: an opening paragraph and two bullet lists.
  summary        TEXT       NULL,
  qualifications JSON       NULL,
  responsibilities JSON     NULL,
  -- Live entered these lists with an inconsistent glyph ("*" on three postings,
  -- "•" on the rest). Kept so existing postings render as they always have; the
  -- admin does not expose it and new rows take the default.
  bullet       VARCHAR(4)   NOT NULL DEFAULT '•',
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_listing (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The three "Our Management" pages (/about/sales-portfolio-management,
-- /about/leasing-portfolio-management, /about/crm-marketing) render the same
-- card and differ only in whose roster they list, so they share one table keyed
-- by `department` — the same shape as articles/`kind`.
CREATE TABLE IF NOT EXISTS team_members (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  department   ENUM('sales','leasing','crm') NOT NULL,
  name         VARCHAR(190) NOT NULL,
  title        VARCHAR(190) NOT NULL DEFAULT '',
  -- Free text, not a number: the live site lists "10yrs", "19 years" and "7".
  experience   VARCHAR(80)  NOT NULL DEFAULT '',
  photo        VARCHAR(500) NOT NULL DEFAULT '',
  phone        VARCHAR(60)  NOT NULL DEFAULT '',
  email        VARCHAR(190) NOT NULL DEFAULT '',
  linkedin     VARCHAR(500) NOT NULL DEFAULT '',
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_team_listing (department, is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS awards (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image        VARCHAR(500) NOT NULL,
  caption      VARCHAR(255) NOT NULL DEFAULT '',
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_awards_listing (is_published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Captured from the public forms (/api/enquiry, /api/career-application), which
-- currently only email. Storing them means a lead survives an SMTP outage.
CREATE TABLE IF NOT EXISTS enquiries (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source     VARCHAR(120) NOT NULL DEFAULT '',
  name       VARCHAR(190) NOT NULL DEFAULT '',
  email      VARCHAR(190) NOT NULL DEFAULT '',
  phone      VARCHAR(60)  NOT NULL DEFAULT '',
  message    TEXT         NULL,
  -- Whatever extra fields that particular form carried (budget, country, ...).
  extra      JSON         NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_enquiries_inbox (is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------- migrations
--
-- Everything above is CREATE TABLE IF NOT EXISTS, which is a no-op against a
-- database that already has the table — so a column added to one of those
-- definitions never reaches an existing deployment. Columns added after the
-- first release therefore need an explicit ALTER here as well.
--
-- MySQL 8 has no ADD COLUMN IF NOT EXISTS, so each one is guarded against
-- information_schema and executed through a prepared statement; re-running is
-- a no-op. scripts/db-setup.mjs applies this file top to bottom on every
-- deploy (npm run db:migrate), so these must stay idempotent.

SET @m := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_listings' AND COLUMN_NAME = 'summary') = 0,
  'ALTER TABLE job_listings ADD COLUMN summary TEXT NULL AFTER experience', 'DO 0');
PREPARE stmt FROM @m;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @m := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_listings' AND COLUMN_NAME = 'qualifications') = 0,
  'ALTER TABLE job_listings ADD COLUMN qualifications JSON NULL AFTER summary', 'DO 0');
PREPARE stmt FROM @m;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @m := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_listings' AND COLUMN_NAME = 'responsibilities') = 0,
  'ALTER TABLE job_listings ADD COLUMN responsibilities JSON NULL AFTER qualifications', 'DO 0');
PREPARE stmt FROM @m;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @m := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_listings' AND COLUMN_NAME = 'bullet') = 0,
  'ALTER TABLE job_listings ADD COLUMN bullet VARCHAR(4) NOT NULL DEFAULT ''•'' AFTER responsibilities', 'DO 0');
PREPARE stmt FROM @m;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- "Residential Plots" joined the category list after the first release, so the
-- badge_variant ENUM above needs the value adding to databases that already have
-- the table — without it the admin's Save writes '' and the listing drops out of
-- every Property Type filter. Appending to the end of an ENUM leaves the existing
-- rows' values untouched. Guarded on COLUMN_TYPE so a re-run is a no-op rather
-- than another table rebuild.
SET @m := IF((SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'properties'
    AND COLUMN_NAME = 'badge_variant' AND COLUMN_TYPE LIKE '%residential-plots%') = 0,
  'ALTER TABLE properties MODIFY badge_variant
     ENUM(''residential'',''commercial'',''sco'',''industrial'',''residential-plots'')
     NOT NULL DEFAULT ''residential''', 'DO 0');
PREPARE stmt FROM @m;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Slugs typed into the admin used to be stored verbatim, so a space in the
-- "Slug (web address)" field became a %20 in the path and the page 404'd:
-- /properties/M3M-CFC-Sector%20113-Gurugram was unreachable while the listing
-- itself was published. uniqueSlug() in lib/db/queries.ts now runs every slug
-- through sanitizeSlug(); these two repair the rows written before it did.
--
-- Capitalisation is deliberately left alone, matching sanitizeSlug: the
-- already-indexed /properties/DLF-The-Aureva-Sector-63-Gurgaon has to keep
-- working. The WHERE clause is the statement's own output, so a second run
-- matches nothing.
--
-- UPDATE IGNORE rather than UPDATE: slug is UNIQUE, and a repair that happened
-- to collide with an existing row should leave that row for a human to rename
-- rather than abort the deploy's migration step.
UPDATE IGNORE properties
   SET slug = TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '[^A-Za-z0-9]+', '-'))
 WHERE slug <> TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '[^A-Za-z0-9]+', '-'));

UPDATE IGNORE articles
   SET slug = TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '[^A-Za-z0-9]+', '-'))
 WHERE slug <> TRIM(BOTH '-' FROM REGEXP_REPLACE(slug, '[^A-Za-z0-9]+', '-'));
