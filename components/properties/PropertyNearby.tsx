"use client";

import { useMemo, useState } from "react";
import type { PropertyNearby as Landmark } from "@/lib/data/propertyDetails";
import { nearbyCategoryIcon } from "@/lib/data/nearbyCategories";

const ALL = "All";

/**
 * "Locality & Commute": landmarks under one tab per category, in the order the
 * admin entered them.
 *
 * Tabs are built from the rows themselves rather than from the category list,
 * so a category nobody filled in does not show an empty tab, and a row saved
 * under a category since removed from the list still appears.
 */
export default function PropertyNearby({ items }: { items: Landmark[] }) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      const category = item.category?.trim() || "Other";
      if (!seen.includes(category)) seen.push(category);
    }
    return seen;
  }, [items]);

  const [active, setActive] = useState(ALL);

  const shown = items.filter(
    (item) => active === ALL || (item.category?.trim() || "Other") === active,
  );

  return (
    <div>
      {categories.length > 1 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {[ALL, ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={category === active}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${
                category === active
                  ? "border-primary-gold bg-primary-gold/10 text-dark-black"
                  : "border-black/[0.06] bg-white text-muted hover:border-primary-gold/40"
              }`}
            >
              {category === ALL ? null : (
                <i className={`${nearbyCategoryIcon(category)} text-primary-gold`} aria-hidden="true" />
              )}
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shown.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-black/[0.06] px-3 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-gold/10 text-primary-gold">
              <i className={nearbyCategoryIcon(item.category)} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-dark-black">
              {item.name}
            </span>
            {item.distance ? (
              <span className="shrink-0 text-sm font-bold text-muted">{item.distance}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
