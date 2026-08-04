"use client";

import clsx from "clsx";
import { useState } from "react";

type PropertySearchFilterProps = {
  locations: string[];
  types: string[];
  showBudget?: boolean;
  onSearch?: (location: string, type: string) => void;
};

const selectClasses =
  "w-full rounded-md border border-neutral-200 px-3 py-2.5 text-dark-black focus:border-primary-gold focus:outline-none";
const labelClasses = "mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500";

export default function PropertySearchFilter({
  locations,
  types,
  showBudget,
  onSearch,
}: PropertySearchFilterProps) {
  const [location, setLocation] = useState(locations[0]);
  const [type, setType] = useState(types[0]);

  return (
    <div className="relative z-10 -mt-14 rounded-xl border-t-4 border-primary-gold bg-white p-6 shadow-[0_5px_20px_rgba(0,0,0,0.08)] sm:p-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(location, type);
        }}
        className={clsx(
          "grid grid-cols-1 items-end gap-4 sm:grid-cols-2",
          showBudget ? "lg:grid-cols-4" : "lg:grid-cols-3"
        )}
      >
        <div>
          <label className={labelClasses} htmlFor="filter-location">
            Location
          </label>
          <select
            id="filter-location"
            className={selectClasses}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="filter-type">
            Property Type
          </label>
          <select
            id="filter-type"
            className={selectClasses}
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        {showBudget ? (
          <div>
            <label className={labelClasses} htmlFor="filter-budget">
              Budget
            </label>
            <input
              id="filter-budget"
              type="text"
              placeholder="Any Budget"
              disabled
              className={clsx(selectClasses, "cursor-not-allowed bg-neutral-50 text-neutral-400")}
            />
          </div>
        ) : null}
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-4 py-2.5 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105"
        >
          Search Properties
        </button>
      </form>
    </div>
  );
}
