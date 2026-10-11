"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyFloorPlan } from "@/lib/data/propertyDetails";

/** One tab per configuration, the plan image beside its figures. */
export default function PropertyFloorPlans({ plans }: { plans: PropertyFloorPlan[] }) {
  const [active, setActive] = useState(0);
  const plan = plans[active] ?? plans[0];
  if (!plan) return null;

  return (
    <div>
      {plans.length > 1 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {plans.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
                index === active
                  ? "border-primary-gold bg-primary-gold/10 text-dark-black"
                  : "border-black/[0.06] bg-white text-muted hover:border-primary-gold/40"
              }`}
            >
              {item.name || `Plan ${index + 1}`}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {plan.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.06] bg-neutral-50">
            <Image
              src={plan.image}
              alt={`${plan.name || "Floor"} plan`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-3"
            />
          </div>
        ) : null}

        <dl className="grid content-start gap-3">
          {plan.name ? (
            <div className="rounded-xl border border-black/[0.06] p-3">
              <dt className="text-[0.78rem] font-bold text-muted">Configuration</dt>
              <dd className="mt-0.5 text-[0.98rem] font-extrabold text-ink">{plan.name}</dd>
            </div>
          ) : null}
          {plan.area ? (
            <div className="rounded-xl border border-black/[0.06] p-3">
              <dt className="text-[0.78rem] font-bold text-muted">Area</dt>
              <dd className="mt-0.5 text-[0.98rem] font-extrabold text-ink">{plan.area}</dd>
            </div>
          ) : null}
          {plan.price ? (
            <div className="rounded-xl border border-black/[0.06] p-3">
              <dt className="text-[0.78rem] font-bold text-muted">Price</dt>
              <dd className="mt-0.5 text-[0.98rem] font-extrabold text-ink">{plan.price}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
