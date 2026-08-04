"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Reveal from "@/components/ui/Reveal";
import SignatureProjectCard from "@/components/home/SignatureProjectCard";
import type { SignatureProject } from "@/lib/data/signatureProjects";

const delaySequence = [0, 100, 200, 300, 400, 500] as const;

export default function SignatureProjectsGrid({ projects }: { projects: SignatureProject[] }) {
  const cities = useMemo(
    () => Array.from(new Set(projects.map((project) => project.city))),
    [projects]
  );
  const [active, setActive] = useState(cities[0]);
  const filtered = projects.filter((project) => project.city === active);

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((project, index) => (
          <Reveal key={project.title} delay={delaySequence[index % delaySequence.length]}>
            <SignatureProjectCard {...project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
