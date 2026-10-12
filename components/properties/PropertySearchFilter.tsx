"use client";

import clsx from "clsx";
import { useState } from "react";
import { parseBudget } from "@/lib/price";

type PropertySearchFilterProps = {
  locations: string[];
  types: string[];
  /** What the boxes start on. Defaults to the "All …" entry at the head of each list. */
  initialLocation?: string;
  initialType?: string;
  initialBudget?: string;
  showBudget?: boolean;
  /** `budget` is the text as typed, empty for "any". */
  onSearch?: (location: string, type: string, budget: string) => void;
};

const selectClasses =
  "w-full rounded-md border border-bs-border px-3 py-2.5 text-bs-dark focus:border-primary-gold focus:outline-none";
const labelClasses = "mb-2 block text-xs font-bold uppercase tracking-wide text-bs-muted";

export default function PropertySearchFilter({
  locations,
  types,
  initialLocation,
  initialType,
  initialBudget,
  showBudget,
  onSearch,
}: PropertySearchFilterProps) {
  const [location, setLocation] = useState(initialLocation ?? locations[0]);
  const [type, setType] = useState(initialType ?? types[0]);
  const [budget, setBudget] = useState(initialBudget ?? "");
  const [budgetError, setBudgetError] = useState(false);

  return (
    <div className="relative z-10 -mt-14 rounded-lg border-t-4 border-primary-gold bg-white p-6 shadow-card sm:p-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const typed = budget.trim();
          // Something typed that holds no figure would otherwise search as "any
          // budget" and look as though the box had been ignored.
          if (typed && parseBudget(typed) === undefined) {
            setBudgetError(true);
            return;
          }
          onSearch?.(location, type, typed);
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
          <div className="relative">
            <label className={labelClasses} htmlFor="filter-budget">
              Budget
            </label>
            <input
              id="filter-budget"
              type="text"
              autoComplete="off"
              placeholder="Any Budget (e.g. 5 Cr)"
              value={budget}
              onChange={(event) => {
                setBudget(event.target.value);
                setBudgetError(false);
              }}
              aria-invalid={budgetError}
              aria-describedby={budgetError ? "filter-budget-error" : undefined}
              className={clsx(
                selectClasses,
                "placeholder:text-muted-4",
                budgetError && "border-red-500 focus:border-red-500"
              )}
            />
            {/* Absolute, so the message does not push this column taller and
                knock the row's bottom-aligned controls out of line. */}
            {budgetError ? (
              <p
                id="filter-budget-error"
                role="alert"
                className="absolute left-0 top-full mt-1 text-xs text-red-600"
              >
                Enter an amount like 5 Cr or 50 Lakh.
              </p>
            ) : null}
          </div>
        ) : null}
        <button
          type="submit"
          className="rounded-xl border border-black/[0.08] bg-gold-gradient px-4 py-2.5 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03]"
        >
          Search Properties
        </button>
      </form>
    </div>
  );
}
