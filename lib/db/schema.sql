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
  badge_variant ENUM('residential','commercial','sco','industrial')
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
  is_published TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_listing (is_published, sort_order)
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
