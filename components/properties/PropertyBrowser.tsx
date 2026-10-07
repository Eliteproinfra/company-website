"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Separator from "@/components/ui/Separator";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearchFilter from "@/components/properties/PropertySearchFilter";
import Pagination from "@/components/properties/Pagination";
import { typeFromCategorySlug } from "@/lib/data/categories";
import type { PropertyItem } from "@/lib/types";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;
const PAGE_SIZE = 9;

const typeToVariant: Record<string, PropertyItem["badgeVariant"]> = {
  Residential: "residential",
  Commercial: "commercial",
  "SCO Plots": "sco",
  "Industrial Plots": "industrial",
};

function priceRank(price: string): number {
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  if (!match) return Number.POSITIVE_INFINITY; // "On Request" / "Price on Request" sort last
  return parseFloat(match[0]);
}

export default function PropertyBrowser({
  properties,
  locations,
  types,
  between,
}: {
  properties: PropertyItem[];
  locations: string[];
  types: string[];
  /** Sections rendered between the search filter and the listing (live: localities + categories). */
  between?: React.ReactNode;
}) {
  /**
   * `?category=commercial`, set by the header dropdown and the category cards.
   *
   * Read client-side rather than from the page's `searchParams` prop because this
   * page is also built by the static-export target (next.config `output: "export"`),
   * where there is no request-time render to read them on the server.
   *
   * Derived straight into `type` below instead of being pushed into state by an
   * effect, so arriving on a category link renders filtered on the first paint
   * rather than flashing the full list — and so a later in-app click on another
   * category is picked up, which a mount-only effect would miss.
   */
  const searchParams = useSearchParams();
  const urlType = typeFromCategorySlug(searchParams.get("category"));

  const [chosenLocation, setChosenLocation] = useState<string | null>(null);
  const [chosenType, setChosenType] = useState<string | null>(null);
  const [sort, setSort] = useState<"recommended" | "low-high" | "high-low">("recommended");
  const [page, setPage] = useState(1);

  // An explicit Search beats the URL; otherwise the URL's category leads, and
  // anything unrecognised falls back to showing everything. The `typeToVariant`
  // guard keeps a category with no matching badge variant from filtering the
  // list down to nothing.
  const location = chosenLocation ?? locations[0];
  const type = chosenType ?? (urlType && urlType in typeToVariant ? urlType : types[0]);

  const filtered = useMemo(() => {
    let list = properties;
    if (location !== locations[0]) {
      list = list.filter((property) => property.location === location);
    }
    if (type !== types[0]) {
      list = list.filter((property) => property.badgeVariant === typeToVariant[type]);
    }
    if (sort === "low-high") {
      list = [...list].sort((a, b) => priceRank(a.price) - priceRank(b.price));
    } else if (sort === "high-low") {
      list = [...list].sort((a, b) => priceRank(b.price) - priceRank(a.price));
    }
    return list;
  }, [properties, location, type, sort, locations, types]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function applyFilters(nextLocation: string, nextType: string) {
    setChosenLocation(nextLocation);
    setChosenType(nextType);
    setPage(1);
  }

  return (
    <>
      <section className="relative z-10 bg-white">
        <div className="container">
          <PropertySearchFilter
            // Remounting on an applied change re-seeds the two dropdowns, so the
            // boxes show the filter actually in force — including the one a
            // ?category= link arrived with. After a Search the drafts already
            // equal the applied values, so nothing the user picked is lost.
            key={`${location}|${type}`}
            locations={locations}
            types={types}
            initialLocation={location}
            initialType={type}
            showBudget
            onSearch={applyFilters}
          />
        </div>
      </section>

      {between}

      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark-black">Featured Collection</h2>
              <Separator align="left" width={80} className="mt-4" />
            </div>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as typeof sort);
                setPage(1);
              }}
              aria-label="Sort properties"
              className="rounded-md border border-bs-border px-4 py-2 text-sm text-dark-black focus:border-primary-gold focus:outline-none"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((property, index) => (
                <Reveal key={property.title} delay={delaySequence[index % delaySequence.length]}>
                  <PropertyCard {...property} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-card py-16 text-center text-muted">
              No properties match your filters right now — try a different location or type, or{" "}
              <a href="/contact" className="font-semibold text-primary-gold">
                get in touch
              </a>{" "}
              and we&apos;ll help you find one.
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </>
  );
}
