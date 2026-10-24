"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export type SearchFilters = {
  location: string;
  type: string;
  status: string;
  /** A budget preset such as "2 Cr"; empty for "any". */
  budget: string;
  /** The search box as typed. */
  query: string;
};

type PropertySearchFilterProps = {
  locations: string[];
  types: string[];
  statuses: string[];
  /** What the controls start on. */
  initial: SearchFilters;
  onSearch?: (filters: SearchFilters) => void;
};

/** Budget ceilings offered in the Budget chip; the value is what `parseBudget` reads. */
const budgetOptions = [
  { value: "", label: "Any Budget" },
  { value: "50 Lakh", label: "Under 50 Lakh" },
  { value: "1 Cr", label: "Under 1 Cr" },
  { value: "2 Cr", label: "Under 2 Cr" },
  { value: "5 Cr", label: "Under 5 Cr" },
  { value: "10 Cr", label: "Under 10 Cr" },
];

type DropdownOption = { value: string; label: string };

/**
 * A button that opens a list of choices beneath it. Closes on a pick, a click
 * elsewhere or Escape. `label` is what the button shows; `active` tints it to
 * say a filter other than the default is picked.
 */
function Dropdown({
  id,
  icon,
  label,
  ariaLabel,
  options,
  value,
  onChange,
  active,
  className,
  menuClassName,
}: {
  id: string;
  icon: string;
  label: string;
  ariaLabel: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  active?: boolean;
  className?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={`${ariaLabel}: ${label}`}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className={clsx("flex items-center gap-2.5 whitespace-nowrap font-semibold", className)}
      >
        <i
          className={clsx(icon, active ? "text-primary-gold" : "text-primary-gold/80")}
          aria-hidden="true"
        />
        <span>{label}</span>
        <i
          className={clsx(
            "fas fa-chevron-down text-xs text-muted-4 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          id={`${id}-menu`}
          role="listbox"
          aria-label={ariaLabel}
          className={clsx(
            "absolute top-full z-30 mt-2 min-w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white py-1 shadow-card",
            menuClassName
          )}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={clsx(
                  "block w-full whitespace-nowrap px-5 py-2.5 text-center text-[15px] transition-colors",
                  selected
                    ? "bg-gold-gradient font-semibold text-ink"
                    : "text-dark-black hover:bg-primary-gold/10"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const chipClasses =
  "rounded-full border bg-white px-4 py-2.5 text-[15px] text-dark-black shadow-sm transition-colors hover:border-primary-gold";
/** An unpicked chip needs an outline on the white phone panel, none on the glass one. */
const idleChipBorder = "border-bs-border sm:border-transparent";

export default function PropertySearchFilter({
  locations,
  types,
  statuses,
  initial,
  onSearch,
}: PropertySearchFilterProps) {
  const [location, setLocation] = useState(initial.location);
  const [type, setType] = useState(initial.type);
  const [status, setStatus] = useState(initial.status);
  const [budget, setBudget] = useState(initial.budget);
  const [query, setQuery] = useState(initial.query);

  const toOptions = (list: string[]) => list.map((item) => ({ value: item, label: item }));
  const budgetLabel = budgetOptions.find((option) => option.value === budget)?.label;

  return (
    // On a phone the stacked controls are too tall to sit on the hero, so the
    // panel turns white where it hangs over the page instead of glass on the image.
    <div className="relative z-20 -mt-14 rounded-[2rem] bg-white p-3 shadow-card sm:-mt-48 sm:border sm:border-white/15 sm:bg-black/35 sm:p-4 sm:backdrop-blur-md">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.({ location, type, status, budget, query: query.trim() });
        }}
      >
        <div className="flex flex-col gap-2 rounded-3xl border border-bs-border bg-white sm:border-4 sm:border-white/70 p-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-1.5">
          <Dropdown
            id="filter-location"
            icon="fas fa-map-marker-alt"
            label={location}
            ariaLabel="Location"
            options={toOptions(locations)}
            value={location}
            onChange={setLocation}
            active={location !== locations[0]}
            className="w-full px-4 py-2.5 text-lg text-dark-black sm:w-auto sm:pl-6 sm:pr-5"
            menuClassName="left-0"
          />
          <div className="hidden h-9 w-px bg-bs-border sm:block" aria-hidden="true" />
          <label htmlFor="filter-query" className="sr-only">
            Search properties
          </label>
          <input
            id="filter-query"
            type="search"
            autoComplete="off"
            placeholder='Search "Flats under 2 Cr"'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 border-t border-bs-border bg-transparent px-4 py-3 text-lg text-dark-black placeholder:text-muted-4 focus:outline-none sm:border-t-0 sm:px-5"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-3 rounded-full border border-black/[0.08] bg-gold-gradient px-8 py-3.5 text-lg font-bold text-ink shadow-btn-gold transition-all hover:brightness-[1.03]"
          >
            <i className="fas fa-search" aria-hidden="true" />
            Search
          </button>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-3 sm:mt-4">
          <Dropdown
            id="filter-budget"
            icon="fas fa-rupee-sign"
            label={budget ? (budgetLabel ?? budget) : "Budget"}
            ariaLabel="Budget"
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
            active={budget !== ""}
            className={clsx(chipClasses, budget ? "border-primary-gold" : idleChipBorder)}
            menuClassName="left-1/2 -translate-x-1/2"
          />
          <Dropdown
            id="filter-type"
            icon="fas fa-home"
            label={type === types[0] ? "Property Type" : type}
            ariaLabel="Property Type"
            options={toOptions(types)}
            value={type}
            onChange={setType}
            active={type !== types[0]}
            className={clsx(
              chipClasses,
              type !== types[0] ? "border-primary-gold" : idleChipBorder
            )}
            menuClassName="left-1/2 -translate-x-1/2"
          />
          <Dropdown
            id="filter-status"
            icon="far fa-check-circle"
            label={status === statuses[0] ? "Construction Status" : status}
            ariaLabel="Construction Status"
            options={toOptions(statuses)}
            value={status}
            onChange={setStatus}
            active={status !== statuses[0]}
            className={clsx(
              chipClasses,
              status !== statuses[0] ? "border-primary-gold" : idleChipBorder
            )}
            menuClassName="left-1/2 -translate-x-1/2"
          />
        </div>
      </form>
    </div>
  );
}
