"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Separator from "@/components/ui/Separator";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearchFilter from "@/components/properties/PropertySearchFilter";
import Pagination from "@/components/properties/Pagination";
import { typeFromCategorySlug, typeToVariant } from "@/lib/data/categories";
import { localityFromSlug, localitySlug } from "@/lib/data/localities";
import { partnerFromSlug, partnerSlug } from "@/lib/data/partners";
import { parseBudget, priceInRupees } from "@/lib/price";
import type { PropertyItem } from "@/lib/types";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;
const PAGE_SIZE = 9;

/** "On Request" / "Price on Request" sort last, whichever way the list runs. */
function byPrice(a: PropertyItem, b: PropertyItem, direction: 1 | -1): number {
  const priceA = priceInRupees(a.price);
  const priceB = priceInRupees(b.price);
  if (priceA === undefined || priceB === undefined) {
    return Number(priceA === undefined) - Number(priceB === undefined);
  }
  return (priceA - priceB) * direction;
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

  /** `?city=Gurgaon`, set by the footer's "Property in India" links. Matched
   *  against the dropdown's own options so a city we do not list — or a different
   *  casing — falls back to All Locations instead of emptying the grid. */
  const urlCity = searchParams.get("city");
  const urlLocation = urlCity
    ? locations.find((option) => option.toLowerCase() === urlCity.toLowerCase())
    : undefined;

  /** `?developer=dlf`, set by the homepage's developer logos. Unlike the
   *  location and type dropdowns this one has no control of its own, so it is
   *  never overridden by a Search — it stays until the visitor follows the
   *  "View all properties" link out of it. */
  const developer = partnerFromSlug(searchParams.get("developer"));

  /** `?locality=golf-course-rd`, set by the "Top Localities" cards. Like the
   *  developer it has no control in the search box, so it holds until the
   *  visitor follows "View all properties" out of it. */
  const locality = localityFromSlug(searchParams.get("locality"));

  const [chosenLocation, setChosenLocation] = useState<string | null>(null);
  const [chosenType, setChosenType] = useState<string | null>(null);
  /** The budget as typed; empty is "any". Kept as text so the box can show it back. */
  const [budget, setBudget] = useState("");
  const [sort, setSort] = useState<"recommended" | "low-high" | "high-low">("recommended");
  const [page, setPage] = useState(1);

  // An explicit Search beats the URL; otherwise the URL's category leads, and
  // anything unrecognised falls back to showing everything. The `typeToVariant`
  // guard keeps a category with no matching badge variant from filtering the
  // list down to nothing.
  const location = chosenLocation ?? urlLocation ?? locations[0];
  const type = chosenType ?? (urlType && urlType in typeToVariant ? urlType : types[0]);

  const filtered = useMemo(() => {
    let list = properties;
    if (developer) {
      const slug = partnerSlug(developer.name);
      list = list.filter((property) => property.developerSlug === slug);
    }
    if (locality) {
      const slug = localitySlug(locality.name);
      list = list.filter((property) => property.localities?.includes(slug));
    }
    if (location !== locations[0]) {
      list = list.filter((property) => property.location === location);
    }
    if (type !== types[0]) {
      list = list.filter((property) => property.badgeVariant === typeToVariant[type]);
    }
    // The budget is a ceiling on the starting price. A listing priced "On
    // Request" states no figure to hold against it, so it drops out rather than
    // being passed off as within budget.
    const maxPrice = parseBudget(budget);
    if (maxPrice !== undefined) {
      list = list.filter((property) => {
        const price = priceInRupees(property.price);
        return price !== undefined && price <= maxPrice;
      });
    }
    if (sort === "low-high") {
      list = [...list].sort((a, b) => byPrice(a, b, 1));
    } else if (sort === "high-low") {
      list = [...list].sort((a, b) => byPrice(a, b, -1));
    }
    return list;
  }, [properties, developer, locality, location, type, budget, sort, locations, types]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function applyFilters(nextLocation: string, nextType: string, nextBudget: string) {
    setChosenLocation(nextLocation);
    setChosenType(nextType);
    setBudget(nextBudget);
    setPage(1);
    // The grid sits below the locality and category rows, so without this a
    // Search changes nothing the visitor can see.
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  const scope = developer ?? locality;

  return (
    <>
      <section className="relative z-10 bg-white">
        <div className="container">
          <PropertySearchFilter
            // Remounting on an applied change re-seeds the two dropdowns, so the
            // boxes show the filter actually in force — including the one a
            // ?category= link arrived with. After a Search the drafts already
            // equal the applied values, so nothing the user picked is lost.
            key={`${location}|${type}|${budget}`}
            locations={locations}
            types={types}
            initialLocation={location}
            initialType={type}
            initialBudget={budget}
            showBudget
            onSearch={applyFilters}
          />
        </div>
      </section>

      {between}

      <section id="listings" className="scroll-mt-24 bg-white py-20">
        <div className="container">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark-black">
                {developer
                  ? `${developer.name} Projects`
                  : locality
                    ? `Properties in ${locality.name}`
                    : "Featured Collection"}
              </h2>
              <Separator align="left" width={80} className="mt-4" />
              {scope && (
                <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-gold"
                >
                  <i className="fas fa-arrow-left text-xs" aria-hidden="true" /> View all properties
                </Link>
              )}
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
              {/* Keyed on href, not title: two listings can legitimately carry the
                  same name (a relaunch, or the same project re-entered), and the
                  slug behind the href is what the admin keeps unique. */}
              {pageItems.map((property, index) => (
                <Reveal key={property.href} delay={delaySequence[index % delaySequence.length]}>
                  <PropertyCard {...property} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-card py-16 text-center text-muted">
              {developer ? (
                <>
                  We have no {developer.name} listings online right now — we broker their
                  inventory, so{" "}
                  <a href="/contact" className="font-semibold text-primary-gold">
                    get in touch
                  </a>{" "}
                  and we&apos;ll share what&apos;s available.
                </>
              ) : locality ? (
                <>
                  We have no {locality.name} listings online that match right now —{" "}
                  <a href="/contact" className="font-semibold text-primary-gold">
                    get in touch
                  </a>{" "}
                  and we&apos;ll share what&apos;s available there.
                </>
              ) : (
                <>
                  No properties match your filters right now — try a different location, type or
                  budget, or{" "}
                  <a href="/contact" className="font-semibold text-primary-gold">
                    get in touch
                  </a>{" "}
                  and we&apos;ll help you find one.
                </>
              )}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </>
  );
}
