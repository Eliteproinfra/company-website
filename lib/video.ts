/**
 * Turns a video address an admin pasted into one this site is willing to frame.
 *
 * Only YouTube and Vimeo are recognised, and the returned src is always built
 * from scratch out of the extracted id rather than passed through: the value
 * comes from a form field and ends up in an iframe `src`, so nothing of the
 * original string is allowed to survive into the page. Anything unrecognised
 * returns null and the caller renders a plain link instead of a player.
 */

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

/** YouTube ids are 11 characters of base64url; Vimeo ids are digits. */
const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;

export function videoEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();

  if (YOUTUBE_HOSTS.has(host)) {
    // youtu.be/<id>, /embed/<id>, /shorts/<id>, or /watch?v=<id>
    const path = url.pathname.split("/").filter(Boolean);
    const id =
      host.endsWith("youtu.be")
        ? path[0]
        : path[0] === "embed" || path[0] === "shorts" || path[0] === "v"
          ? path[1]
          : url.searchParams.get("v");
    return id && YOUTUBE_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (VIMEO_HOSTS.has(host)) {
    const id = url.pathname.split("/").filter(Boolean).pop();
    return id && VIMEO_ID.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
