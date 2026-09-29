"use client";

import { useId, useState } from "react";
import { adminInputClass } from "./FormField";

export type RepeaterColumn = {
  key: string;
  label: string;
  placeholder?: string;
  /** Rendered as a textarea instead of a single-line input (FAQ answers). */
  multiline?: boolean;
};

/**
 * Edits an array of flat objects (specs, amenities, FAQs, experts) and submits
 * it as JSON in one hidden input, so the server action reads a single field.
 *
 * These live in JSON columns rather than child tables because the page always
 * reads and writes a listing whole, and renders these rows in the author's
 * order — see the note in lib/db/schema.sql.
 */
export default function RepeaterField<T extends Record<string, string>>({
  name,
  label,
  columns,
  defaultValue = [],
  hint,
  addLabel = "Add row",
}: {
  name: string;
  label: string;
  columns: RepeaterColumn[];
  defaultValue?: T[];
  hint?: string;
  addLabel?: string;
}) {
  const blank = () =>
    Object.fromEntries(columns.map((column) => [column.key, ""])) as unknown as T;

  const [rows, setRows] = useState<T[]>(defaultValue.length ? defaultValue : []);
  const baseId = useId();

  function update(index: number, key: string, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function move(index: number, delta: number) {
    setRows((prev) => {
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
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, blank()])}
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-dark-black hover:bg-neutral-50"
        >
          <i className="fas fa-plus mr-1.5 text-primary-gold" aria-hidden="true" />
          {addLabel}
        </button>
      </div>
      {hint ? <p className="mb-2 text-xs text-neutral-500">{hint}</p> : null}

      {/* One hidden input carries the whole array to the server action. */}
      <input type="hidden" name={name} value={JSON.stringify(rows)} readOnly />

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
          None yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => (
            <li
              key={`${baseId}-${index}`}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {columns.map((column) => (
                  <div key={column.key} className={column.multiline ? "sm:col-span-2" : undefined}>
                    <label
                      htmlFor={`${baseId}-${index}-${column.key}`}
                      className="mb-1 block text-xs font-semibold text-neutral-500"
                    >
                      {column.label}
                    </label>
                    {column.multiline ? (
                      <textarea
                        id={`${baseId}-${index}-${column.key}`}
                        rows={3}
                        value={row[column.key] ?? ""}
                        placeholder={column.placeholder}
                        onChange={(event) => update(index, column.key, event.target.value)}
                        className={adminInputClass}
                      />
                    ) : (
                      <input
                        id={`${baseId}-${index}-${column.key}`}
                        type="text"
                        value={row[column.key] ?? ""}
                        placeholder={column.placeholder}
                        onChange={(event) => update(index, column.key, event.target.value)}
                        className={adminInputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  <i className="fas fa-arrow-up" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Move down"
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  <i className="fas fa-arrow-down" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                  className="ml-auto rounded border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
