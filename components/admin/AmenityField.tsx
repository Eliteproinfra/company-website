"use client";

import { useMemo, useState } from "react";
import {
  amenityCatalog,
  amenityKey,
  FALLBACK_AMENITY_ICON,
  findCatalogAmenity,
} from "@/lib/data/amenityCatalog";
import { adminInputClass } from "./FormField";

type Amenity = { icon: string; name: string };

/**
 * Picks the “Amenities” tiles from a fixed list instead of asking the admin to
 * type a Font Awesome class beside each name — the job RepeaterField used to do
 * here, and the reason half the seeded listings show an icon that contradicts
 * its label.
 *
 * Submits the same shape as before (one hidden input holding
 * [{ icon, name }, ...] as JSON), so savePropertyAction is untouched.
 *
 * Amenities already saved under a name the catalog does not know are kept as
 * they are, listed under Selected and removable, rather than being dropped or
 * renamed behind the admin's back. The same escape hatch is open for new ones:
 * "Add your own" still takes any name.
 */
export default function AmenityField({
  name,
  label = "Amenities",
  hint,
  defaultValue = [],
}: {
  name: string;
  label?: string;
  hint?: string;
  defaultValue?: Amenity[];
}) {
  const [rows, setRows] = useState<Amenity[]>(() =>
    // An amenity the catalog knows takes the catalog's icon, even when it was
    // saved with another one — that mismatch is the bug this field exists to
    // end, and leaving the old class in place would carry it into the next save.
    // The name is never rewritten, only the icon, so nothing the public page
    // prints changes. Unknown names keep whatever icon they were given.
    defaultValue.map((row) => {
      const known = findCatalogAmenity(row.name);
      return known ? { icon: known.icon, name: row.name } : row;
    }),
  );
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");

  const selectedKeys = useMemo(
    () => new Set(rows.map((row) => amenityKey(row.name))),
    [rows],
  );

  /** Catalog filtered by the search box, with emptied groups dropped. */
  const groups = useMemo(() => {
    const needle = amenityKey(search);
    if (!needle) return amenityCatalog;
    return amenityCatalog
      .map((group) => ({
        title: group.title,
        items: group.items.filter((item) => amenityKey(item.name).includes(needle)),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  function toggle(item: Amenity) {
    const key = amenityKey(item.name);
    setRows((prev) =>
      selectedKeys.has(key)
        ? prev.filter((row) => amenityKey(row.name) !== key)
        : [...prev, { icon: item.icon, name: item.name }],
    );
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

  function addCustom() {
    const trimmed = customName.trim();
    if (!trimmed || selectedKeys.has(amenityKey(trimmed))) return;
    // Typing a name the catalog already covers should still get its icon.
    const known = findCatalogAmenity(trimmed);
    setRows((prev) => [
      ...prev,
      known ? { ...known } : { icon: FALLBACK_AMENITY_ICON, name: trimmed },
    ]);
    setCustomName("");
  }

  const customIsDuplicate =
    customName.trim().length > 0 && selectedKeys.has(amenityKey(customName));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold text-dark-black">{label}</span>
        <span className="text-xs font-semibold text-neutral-500">
          {rows.length} selected
        </span>
      </div>
      {hint ? <p className="mb-2 text-xs text-neutral-500">{hint}</p> : null}

      {/* One hidden input carries the whole array to the server action. */}
      <input type="hidden" name={name} value={JSON.stringify(rows)} readOnly />

      {/* Selected, in the order the public grid will print them. */}
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500">
          None yet. Tick the ones this project has.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {rows.map((row, index) => (
            <li
              // Indexed, because a row saved before the picker could be a duplicate.
              key={`${index}-${amenityKey(row.name)}`}
              className="flex items-center gap-2 rounded-lg border border-primary-gold/40 bg-primary-gold/10 py-1 pl-3 pr-1 text-sm"
            >
              <i className={`${row.icon} text-primary-gold`} aria-hidden="true" />
              <span className="font-semibold text-dark-black">{row.name}</span>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${row.name} earlier`}
                className="rounded px-1 text-xs text-neutral-500 hover:text-dark-black disabled:opacity-30"
              >
                <i className="fas fa-arrow-left" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label={`Move ${row.name} later`}
                className="rounded px-1 text-xs text-neutral-500 hover:text-dark-black disabled:opacity-30"
              >
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => toggle(row)}
                aria-label={`Remove ${row.name}`}
                className="rounded px-1.5 text-xs text-red-700 hover:bg-red-50"
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search amenities…"
          aria-label="Search amenities"
          className={adminInputClass}
        />

        {groups.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            Nothing matches “{search.trim()}”. Add it by name below.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.title} className="mt-3">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
                {group.title}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const checked = selectedKeys.has(amenityKey(item.name));
                  return (
                    <label
                      key={item.name}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                        checked
                          ? "border-primary-gold bg-primary-gold/10 font-semibold text-dark-black"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item)}
                        className="h-4 w-4 accent-[#d4af37]"
                      />
                      <i
                        className={`${item.icon} w-4 text-center ${checked ? "text-primary-gold" : "text-neutral-400"}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3">
        <label htmlFor={`${name}-custom`} className="mb-1 block text-xs font-semibold text-neutral-500">
          Add your own (only when the list above has nothing close)
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`${name}-custom`}
            type="text"
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            onKeyDown={(event) => {
              // Enter inside a form submits it; here it should add the row.
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
            placeholder="Helipad"
            className={`${adminInputClass} w-auto flex-1`}
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customName.trim() || customIsDuplicate}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-dark-black hover:bg-neutral-50 disabled:opacity-40"
          >
            <i className="fas fa-plus mr-1.5 text-primary-gold" aria-hidden="true" />
            Add amenity
          </button>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          {customIsDuplicate
            ? "That one is already selected."
            : "A name added here gets a plain tick icon."}
        </p>
      </div>
    </div>
  );
}
