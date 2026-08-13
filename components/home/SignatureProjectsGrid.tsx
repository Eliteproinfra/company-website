"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import PropertyCard from "@/components/properties/PropertyCard";
import type { SignatureProject } from "@/lib/data/signatureProjects";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function SignatureProjectsGrid({ projects }: { projects: SignatureProject[] }) {
  const cities = useMemo(
    () => Array.from(new Set(projects.map((project) => project.city))),
    [projects]
  );
  const [active, setActive] = useState(cities[0]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setActive(city)}
            className={clsx(
              "rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
              active === city
                ? "border-primary-gold bg-primary-gold text-dark-black"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-primary-gold/50 hover:text-dark-black"
            )}
          >
            {city}
          </button>
        ))}
      </div>
      {/* Every city's panel stays in the DOM so all listings ship in the HTML,
          the way the reference site's tab panes do. */}
      {cities.map((city) => (
        <div
          key={city}
          role="tabpanel"
          aria-label={`${city} projects`}
          className={clsx(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
            city !== active && "hidden"
          )}
        >
          {projects
            .filter((project) => project.city === city)
            .map((project, index) => (
              <Reveal key={project.href} delay={delaySequence[index % delaySequence.length]}>
                <PropertyCard
                  image={project.image}
                  title={project.title}
                  location={project.location}
                  price={project.price}
                  badgeText={project.badgeText}
                  badgeVariant={project.badgeVariant}
                  href={project.href}
                  detailsLabel="Details"
                />
              </Reveal>
            ))}
        </div>
      ))}
    </div>
  );
}
