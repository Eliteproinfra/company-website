"use client";

import { useState } from "react";
import { adminInputClass } from "./FormField";

/**
 * Turns a failed upload response into something the admin can act on.
 *
 * The body is not assumed to be ours. This is the same defect lib/forms/
 * submitEnquiry.ts removed from the nine public forms — `res.json()` on an HTML
 * body throws a SyntaxError, and since every caller here wraps the upload in
 * its own try/catch, that SyntaxError became the message in the red error slot:
 * "Unexpected token '<', \"<html>\"... is not valid JSON" shown to someone
 * adding a photo. The admin upload was simply missed by that sweep.
 *
 * Each of these is answered in front of Next.js, so the body is nginx's HTML:
 *   - 413 from client_max_body_size (12 MB, deploy/nginx-aws.conf), which is
 *     reached before the route's own 8 MB check can answer in JSON — so a
 *     20 MB camera original never gets the route's tidy message
 *   - 429 from limit_req (deploy/nginx-ratelimit.conf); the gallery field posts
 *     a multi-file selection in a tight loop, which is what trips it
 *   - 502/504 while PM2 restarts mid-deploy
 */
async function uploadErrorMessage(res: Response): Promise<string> {
  // Status before body: for these the body is never ours, whatever it holds.
  if (res.status === 413) {
    return "That image is too large. Please upload one under 8 MB.";
  }
  if (res.status === 429) {
    return "Too many uploads at once. Wait a minute, then add the rest.";
  }
  if (res.status === 401) {
    // The property form is long enough to outlive a session. Nothing typed is
    // lost — this is a fetch, not a navigation — so the advice is to sign in
    // elsewhere and retry rather than to reload and start again.
    return "Your sign-in has expired. Sign in again in another tab, then upload again — nothing you have typed here is lost.";
  }
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return "The server is briefly unavailable. Please try again in a moment.";
  }

  try {
    const payload = (await res.json()) as { error?: string } | null;
    // Only a non-empty string is usable — `{}` and `{ error: null }` have to
    // fall through rather than render "null" at the admin.
    if (payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Not JSON — an HTML error page or an empty body. Nothing to recover.
  }

  return `Upload failed (${res.status}). Please try again.`;
}

/** Posts one file to the admin upload route and returns its public path.
 *  Shared with RepeaterField's image columns (floor plans), so every upload in
 *  the admin goes through the same endpoint and the same error handling. */
export async function uploadAdminImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body });
  } catch {
    // fetch() rejects only on a network-level failure, which is not the server
    // saying no — and on a patchy connection mid-upload this is the whole story.
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  if (!res.ok) throw new Error(await uploadErrorMessage(res));

  let url: unknown;
  try {
    ({ url } = (await res.json()) as { url?: unknown });
  } catch {
    // A 200 whose body is not ours: something in front of Next answered. The
    // image may or may not have been written, so say so rather than guess.
    throw new Error("The server's reply could not be read. Reload the page and check whether the image was added.");
  }

  if (typeof url !== "string" || !url) {
    throw new Error("The upload did not come back with an image path. Please try again.");
  }
  return url;
}

/** Single image path, with an upload button. The path stays editable by hand so
 *  existing /images/... assets can be referenced without re-uploading. */
export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
  /** Defaults to `name`. Pass one when the same field appears more than once on
   *  a page — the awards gallery renders an edit form per row — so the ids stay
   *  unique and each label still points at its own input. */
  id = name,
  compact,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  id?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label
        htmlFor={id}
        className={
          compact
            ? "mb-1 block text-xs font-semibold text-neutral-500"
            : "mb-1.5 block text-sm font-bold text-dark-black"
        }
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={id}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/images/... or /uploads/..."
          className={`${adminInputClass} min-w-0 flex-1`}
        />
        <label
          // `relative` is load-bearing — see the note on the gallery's Upload.
          className={`relative shrink-0 cursor-pointer rounded-lg border border-neutral-200 font-semibold text-dark-black hover:bg-neutral-50 ${
            compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
          }`}
        >
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setError(null);
              try {
                setValue(await uploadAdminImage(file));
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
              } finally {
                setBusy(false);
                event.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {error ? <p className="mt-1 text-xs font-semibold text-red-600">{error}</p> : null}
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
      {/* The card already shows the award itself, so a second copy under the
          path input would just take up room. */}
      {value && !compact ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-24 w-auto rounded border border-neutral-200 object-cover"
        />
      ) : null}
    </div>
  );
}

/** Ordered gallery of image paths, submitted as a JSON array in one hidden field. */
export function ImageListField({
  name,
  label,
  defaultValue = [],
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  hint?: string;
}) {
  const [items, setItems] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, delta: number) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold text-dark-black">{label}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, ""])}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
          >
            Add path
          </button>
          {/* `relative` is load-bearing. The sr-only input is position:absolute,
              and without a positioned label its containing block is the admin
              shell (`fixed inset-0`), outside the scrolling <main>. It then sits
              at its unscrolled offset — hundreds of pixels below the shell —
              and when the click focuses it the browser scrolls the shell to
              reveal it: overflow-hidden still scrolls programmatically. The
              whole panel slid up and left a blank grey page. */}
          <label className="relative cursor-pointer rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50">
            {busy ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={busy}
              onChange={async (event) => {
                const files = Array.from(event.target.files ?? []);
                if (!files.length) return;
                setBusy(true);
                setError(null);
                try {
                  const urls: string[] = [];
                  for (const file of files) urls.push(await uploadAdminImage(file));
                  setItems((prev) => [...prev, ...urls]);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setBusy(false);
                  event.target.value = "";
                }
              }}
            />
          </label>
        </div>
      </div>
      {hint ? <p className="mb-2 text-xs text-neutral-500">{hint}</p> : null}
      {error ? <p className="mb-2 text-xs font-semibold text-red-600">{error}</p> : null}

      <input type="hidden" name={name} value={JSON.stringify(items.filter(Boolean))} readOnly />

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
          No images yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2">
              {item ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
              ) : (
                <span className="h-12 w-16 shrink-0 rounded bg-neutral-200" />
              )}
              <input
                type="text"
                value={item}
                onChange={(event) =>
                  setItems((prev) => prev.map((v, i) => (i === index ? event.target.value : v)))
                }
                className={`${adminInputClass} min-w-0 flex-1`}
              />
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                aria-label="Move up"
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs disabled:opacity-40">
                <i className="fas fa-arrow-up" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}
                aria-label="Move down"
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs disabled:opacity-40">
                <i className="fas fa-arrow-down" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                className="rounded border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
