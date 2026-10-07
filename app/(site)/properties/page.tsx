import type { Metadata } from "next";
import { Suspense } from "react";
import CategoryCard from "@/components/properties/CategoryCard";
import LocalityCard from "@/components/properties/LocalityCard";
import PropertyBrowser from "@/components/properties/PropertyBrowser";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { getPropertyListItems } from "@/lib/content/properties";
import { categories } from "@/lib/data/categories";
import { localities } from "@/lib/data/localities";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Explore premium residential and commercial properties for sale in Gurgaon and Delhi NCR — new launches, ready-to-move homes, and SCO plots.",
};

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

/*
 * Live properties.php order: .properties-hero (.6 flat), .search-filter-section overlapping the
 * hero, "Top Localities to Invest" (h3, left), the four .category-cards, "Featured Collection"
 * on white with 9 cards per page, then the .bg-light market copy.
 */
export default async function PropertiesPage() {
  const properties = await getPropertyListItems();

  return (
    <>
      <PageHero
        image="/images/heroes/properties.jpg"
        title="Premium Properties"
        breadcrumbCurrent="Properties"
        height="75vh"
        overlay="bg-black/60"
      />

      {/* PropertyBrowser reads ?category= via useSearchParams, which a prerendered
          page requires a Suspense boundary around. The hero above and the market
          copy below stay outside it, so the page's indexable text is still in the
          static HTML. */}
      <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
        <PropertyBrowser
          properties={properties}
          locations={["All Locations", "Delhi", "Dubai", "Faridabad", "Gurgaon", "Manesar", "Noida"]}
          types={["All Types", "Commercial", "Industrial Plots", "Residential", "SCO Plots"]}
          between={
            <>
              <section className="bg-white py-12">
                <div className="container">
                  <h3 className="mb-2 text-2xl font-bold text-dark-black">Top Localities to Invest</h3>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {localities.map((locality, index) => (
                      <Reveal key={locality.name} delay={delaySequence[index % delaySequence.length]}>
                        <LocalityCard {...locality} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-white pb-12">
                <div className="container">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                      <Reveal key={category.title} delay={delaySequence[index % delaySequence.length]}>
                        <CategoryCard {...category} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            </>
          }
        />
      </Suspense>

      <section className="bg-bs-light py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-muted-2">
            <h2 className="text-center text-3xl font-bold text-dark-black">
              Real Estate Market in Gurgaon &amp; Delhi NCR
            </h2>
            <p className="mt-6">
              Gurgaon has emerged as one of the leading real estate destinations in India,
              offering a mix of premium residential projects, high-end commercial spaces, and
              lucrative investment opportunities. With excellent connectivity via the
              Delhi-Gurgaon Expressway, Dwarka Expressway, and the Rapid Metro, the city has
              become a hub for multinational corporations and luxury living.
            </p>
            <h3 className="mt-8 text-xl font-bold text-dark-black">Why Invest in Gurgaon?</h3>
            <p className="mt-4">
              Investing in Gurgaon real estate offers high returns due to rapid infrastructure
              development. Areas like Golf Course Road, Sohna Road, and New Gurgaon are witnessing
              significant appreciation. Whether you are looking for ready-to-move apartments,
              under-construction projects, or SCO plots, Gurgaon offers a diverse portfolio for
              every investor.
            </p>
            <h3 className="mt-8 text-xl font-bold text-dark-black">
              Types of Properties We Offer
            </h3>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-dark-black">Luxury Apartments:</strong> High-rise
                condominiums with world-class amenities.
              </li>
              <li>
                <strong className="text-dark-black">Independent Floors:</strong> Low-rise living
                with privacy and security.
              </li>
              <li>
                <strong className="text-dark-black">Commercial Spaces:</strong> Grade A office
                spaces and retail shops in prime locations.
              </li>
              <li>
                <strong className="text-dark-black">SCO Plots:</strong> Shop-cum-office plots
                ideal for businesses and investors.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
