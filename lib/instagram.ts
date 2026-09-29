/**
 * Instagram feed — SERVER ONLY. Never import this from a "use client" module:
 * it reads INSTAGRAM_ACCESS_TOKEN, and a client import would put the token in
 * the browser bundle. Client components may `import type { InstagramReel }`
 * from "@/lib/types" instead, which is erased at compile time.
 *
 * Uses the official **Instagram API with Instagram Login** (graph.instagram.com),
 * the supported replacement for the Basic Display API that Meta shut down in
 * December 2024. Nothing here scrapes instagram.com.
 *
 * Point INSTAGRAM_API_BASE at graph.facebook.com instead if the account is
 * wired up through the Facebook-Login flavour of the API — the /{user-id}/media
 * edge and the field names are identical across both. See .env.example.
 */
import type { InstagramReel } from "@/lib/types";

const DEFAULT_API_BASE = "https://graph.instagram.com/v23.0";
const DEFAULT_REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;
/** Pulled per request, then filtered down to videos — the edge mixes in photos. */
const FETCH_LIMIT = 25;
const CACHE_TAG = "instagram-feed";

/** `media_product_type` distinguishes Reels from feed videos but is not on every
 *  API flavour, so a request rejecting it is retried with the core field set. */
const FULL_FIELDS =
  "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp";
const CORE_FIELDS =
  "id,caption,media_type,permalink,thumbnail_url,media_url,timestamp";

const PERMALINK_HOSTS = ["instagram.com"];
const THUMBNAIL_HOSTS = ["cdninstagram.com", "fbcdn.net", "instagram.com"];

const MAX_CAPTION_LENGTH = 200;

export type InstagramFeedStatus =
  /** Fresh data from the API. */
  | "ok"
  /** API call failed, serving the last successful response from this process. */
  | "stale"
  /** INSTAGRAM_ACCESS_TOKEN is not set. */
  | "not-configured"
  /** API answered, but the account has no video/reel posts. */
  | "empty"
  /** Token rejected — expired, revoked, or missing the required permission. */
  | "auth-error"
  /**
   * Meta is refusing the app itself, not the token ("API access blocked.",
   * code 200). Regenerating the token does not clear this — it is fixed in the
   * App Dashboard, not here.
   */
  | "access-blocked"
  | "rate-limited"
  | "error";

export type InstagramFeedResult = {
  items: InstagramReel[];
  status: InstagramFeedStatus;
};

type RawMedia = {
  id?: unknown;
  caption?: unknown;
  media_type?: unknown;
  media_product_type?: unknown;
  permalink?: unknown;
  thumbnail_url?: unknown;
  media_url?: unknown;
  timestamp?: unknown;
};

class InstagramApiError extends Error {
  constructor(
    readonly httpStatus: number,
    readonly apiCode: number | null,
    readonly apiType: string | null,
    message: string
  ) {
    super(message);
    this.name = "InstagramApiError";
  }
}

/**
 * Last successful feed, kept in module memory so a transient API outage during
 * revalidation still renders the cards. Deliberately not persisted: it is a
 * best-effort cushion on top of Next's fetch cache, and a fresh process (a
 * deploy, or a cold serverless instance) simply starts without one.
 */
let lastGoodFeed: InstagramReel[] | null = null;

function parsePositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Accepts a value only if it is an https URL on one of `hosts` (or a subdomain
 *  of one). Guards against a compromised/garbled API response handing us a
 *  `javascript:` href or an off-site image. */
function parseHttpsUrl(value: unknown, hosts: string[]): string | null {
  if (typeof value !== "string" || !value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  const allowed = hosts.some((base) => host === base || host.endsWith(`.${base}`));
  return allowed ? url.toString() : null;
}

function sanitizeCaption(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Collapse newlines/runs of whitespace and drop control characters, so a
  // multi-paragraph caption cannot blow out the two-line card layout.
  const cleaned = value
    .replace(/\p{Cc}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;
  return cleaned.length > MAX_CAPTION_LENGTH
    ? `${cleaned.slice(0, MAX_CAPTION_LENGTH).trimEnd()}…`
    : cleaned;
}

function formatPostedOn(value: unknown): { label: string | null; time: number } {
  if (typeof value !== "string") return { label: null, time: 0 };
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return { label: null, time: 0 };
  const label = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(time);
  return { label, time };
}

/** Keeps only video/reel posts, drops anything malformed or duplicated, and
 *  orders newest first (the edge is already sorted, but do not rely on it). */
function normalize(raw: unknown): InstagramReel[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const withTime: Array<{ reel: InstagramReel; time: number }> = [];

  for (const entry of raw as RawMedia[]) {
    if (!entry || typeof entry !== "object") continue;
    const id = typeof entry.id === "string" ? entry.id : null;
    if (!id || seen.has(id)) continue;

    const mediaType = typeof entry.media_type === "string" ? entry.media_type.toUpperCase() : "";
    const productType =
      typeof entry.media_product_type === "string" ? entry.media_product_type.toUpperCase() : "";
    const isReel = productType === "REELS" || productType === "CLIPS";
    if (mediaType !== "VIDEO" && !isReel) continue;

    const permalink = parseHttpsUrl(entry.permalink, PERMALINK_HOSTS);
    if (!permalink) continue;

    // The poster frame is mandatory: it renders first, it is what a card falls
    // back to, and it keeps the section useful even with no playable video.
    const thumbnailUrl = parseHttpsUrl(entry.thumbnail_url, THUMBNAIL_HOSTS);
    if (!thumbnailUrl) continue;

    // `media_url` on a VIDEO is a direct MP4. Optional by design — a card with
    // no usable video stays on its poster frame instead of being dropped.
    const videoUrl = parseHttpsUrl(entry.media_url, THUMBNAIL_HOSTS);

    const { label, time } = formatPostedOn(entry.timestamp);
    seen.add(id);
    withTime.push({
      reel: {
        id,
        permalink,
        thumbnailUrl,
        videoUrl,
        caption: sanitizeCaption(entry.caption),
        postedOn: label,
        isReel,
      },
      time,
    });
  }

  return withTime.sort((a, b) => b.time - a.time).map((entry) => entry.reel);
}

/** Resolves the API promise, or rejects once REQUEST_TIMEOUT_MS is up, so a
 *  hanging Instagram request can never hold the whole page render open. An
 *  AbortSignal would be tidier but opts the fetch out of Next's request
 *  memoization, so the render is bounded here instead. */
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Instagram API did not respond within ${REQUEST_TIMEOUT_MS}ms`)),
      REQUEST_TIMEOUT_MS
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function requestMedia(
  apiBase: string,
  userId: string,
  accessToken: string,
  fields: string,
  revalidate: number
): Promise<unknown> {
  const endpoint = new URL(`${apiBase.replace(/\/+$/, "")}/${encodeURIComponent(userId)}/media`);
  endpoint.searchParams.set("fields", fields);
  endpoint.searchParams.set("limit", String(FETCH_LIMIT));
  endpoint.searchParams.set("access_token", accessToken);

  const response = await withTimeout(
    fetch(endpoint, {
      headers: { accept: "application/json" },
      // Server-side cache: Instagram is hit at most once per `revalidate`
      // window per deployment, well inside the Graph API rate limits. The tag
      // allows an on-demand revalidateTag("instagram-feed") later if wanted.
      next: { revalidate, tags: [CACHE_TAG] },
    })
  );

  if (!response.ok) {
    // Never echo the response body or the endpoint anywhere user-facing — both
    // carry the access token / account internals.
    const body = await response.text().catch(() => "");
    let apiCode: number | null = null;
    let apiType: string | null = null;
    let apiMessage = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(body) as { error?: { code?: number; type?: string; message?: string } };
      apiCode = typeof parsed.error?.code === "number" ? parsed.error.code : null;
      apiType = typeof parsed.error?.type === "string" ? parsed.error.type : null;
      if (parsed.error?.message) apiMessage = parsed.error.message;
    } catch {
      /* Non-JSON error body (gateway HTML, empty response) — HTTP status is all we get. */
    }
    throw new InstagramApiError(response.status, apiCode, apiType, apiMessage);
  }

  const payload = (await response.json()) as { data?: unknown };
  return payload?.data;
}

/** True when the API rejected the request purely because it does not know the
 *  `media_product_type` field, which is worth one retry without it. */
function isUnknownFieldError(error: unknown): boolean {
  return (
    error instanceof InstagramApiError &&
    error.httpStatus === 400 &&
    /media_product_type|nonexisting field|unknown fields?/i.test(error.message)
  );
}

function classify(error: unknown): InstagramFeedStatus {
  if (!(error instanceof InstagramApiError)) return "error";
  // Throttles first: Meta reports them as OAuthException too, so checking the
  // type before the codes would file every rate limit as a dead token.
  // 4 = app-level, 17 = user-level, 32 = page-level, 613 = custom rate limit.
  if ([4, 17, 32, 613].includes(error.apiCode ?? -1) || error.httpStatus === 429) {
    return "rate-limited";
  }
  // App-level refusals, before the OAuthException catch-all below — Meta sends
  // these as OAuthException too, so checking type first would file them as a
  // dead token and send you off to regenerate a token that is perfectly fine.
  // 200 = "API access blocked." / permissions error; 10 = the app is not
  // permitted this action. Neither is fixed by refreshing the token.
  if (error.apiCode === 200 || error.apiCode === 10) {
    return "access-blocked";
  }
  // 190 = invalid/expired access token; 102 = session expired; any other
  // OAuthException means the token is missing the permission it needs.
  if (error.apiCode === 190 || error.apiCode === 102 || error.apiType === "OAuthException") {
    return "auth-error";
  }
  return "error";
}

function describe(status: InstagramFeedStatus): string {
  switch (status) {
    case "auth-error":
      return "access token was rejected — it has expired, been revoked, or lacks the instagram_business_basic permission. Refresh it with `npm run instagram:token`.";
    case "access-blocked":
      return "Meta is blocking API access for the app itself, not the token — regenerating the token will NOT help. Check the Meta App Dashboard: app mode/status, whether the Instagram product is still added, and any policy or enforcement notice.";
    case "rate-limited":
      return "rate limit hit — consider raising INSTAGRAM_REVALIDATE_SECONDS.";
    default:
      return "request failed.";
  }
}

/**
 * The latest `limit` Instagram video/reel posts for the configured account.
 *
 * Never throws and never returns a partially-valid item: every failure mode
 * (missing config, dead token, rate limit, network error, malformed payload)
 * comes back as an empty `items` plus a status the UI turns into a fallback,
 * so the rest of the page renders regardless.
 */
export async function getLatestInstagramReels(limit = 3): Promise<InstagramFeedResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return { items: [], status: "not-configured" };
  }

  const apiBase = process.env.INSTAGRAM_API_BASE?.trim() || DEFAULT_API_BASE;
  if (!apiBase.startsWith("https://")) {
    console.error("[instagram] INSTAGRAM_API_BASE must be an https:// URL — refusing to send the access token.");
    return { items: [], status: "error" };
  }
  const userId = process.env.INSTAGRAM_USER_ID?.trim() || "me";
  const revalidate =
    parsePositiveInt(process.env.INSTAGRAM_REVALIDATE_SECONDS) ?? DEFAULT_REVALIDATE_SECONDS;

  try {
    let data: unknown;
    try {
      data = await requestMedia(apiBase, userId, accessToken, FULL_FIELDS, revalidate);
    } catch (error) {
      if (!isUnknownFieldError(error)) throw error;
      data = await requestMedia(apiBase, userId, accessToken, CORE_FIELDS, revalidate);
    }

    const items = normalize(data).slice(0, limit);
    if (items.length === 0) {
      return { items: [], status: "empty" };
    }

    lastGoodFeed = items;
    return { items, status: "ok" };
  } catch (error) {
    const status = classify(error);
    // warn, not error: every branch here is already handled — the caller gets a
    // status and the section falls back to its follow-us panel, so the page is
    // fine. Logging at error level makes a working render look like a crash in
    // the Next dev overlay and in error tracking. The text still says what to fix.
    console.warn(
      `[instagram] ${describe(status)}`,
      error instanceof Error ? error.message : error
    );
    if (lastGoodFeed?.length) {
      return { items: lastGoodFeed.slice(0, limit), status: "stale" };
    }
    return { items: [], status };
  }
}
