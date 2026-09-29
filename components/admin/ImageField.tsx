"use client";

import { useState } from "react";
import { adminInputClass } from "./FormField";

async function upload(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
  return json.url;
}

/** Single image path, with an upload button. The path stays editable by hand so
 *  existing /images/... assets can be referenced without re-uploading. */
export function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-dark-black">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/images/... or /uploads/..."
          className={`${adminInputClass} min-w-0 flex-1`}
        />
        <label className="shrink-0 cursor-pointer rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-dark-black hover:bg-neutral-50">
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
                setValue(await upload(file));
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
      {value ? (
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
          <label className="cursor-pointer rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50">
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
                  for (const file of files) urls.push(await upload(file));
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
