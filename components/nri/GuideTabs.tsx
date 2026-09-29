"use client";

import clsx from "clsx";
import { useState } from "react";
import type { GuideTab } from "@/lib/data/nriCorner";

/**
 * Live nri-corner.php "Knowledge Bank": Bootstrap vertical `.nav-pills.service-tab-nav`
 * (white, shadow-sm, rounded; links #555 with a 2px transparent bottom border, the active one
 * gold text + gold bottom border) beside a white `.tab-content` card (p-4/p-lg-5, rounded,
 * shadow-sm). Every pane stays in the DOM, only the active one is shown.
 */
export default function GuideTabs({ tabs }: { tabs: GuideTab[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <div className="flex flex-col rounded-md bg-white p-1 shadow-bs-sm" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={clsx(
                // Live: the global `.nav-pills .nav-link` override wins, so the active tab is a
                // gold-filled pill with white text; the rest are #222 with a 1px #e5e5e5 border.
                "m-1.5 rounded-md border px-[25px] py-[15px] text-left text-xs font-semibold uppercase tracking-wide transition-colors",
                active === index
                  ? "border-primary-gold bg-primary-gold text-white"
                  : "border-border-pill bg-transparent text-pill-text hover:text-primary-gold"
              )}
            >
              <i className={`${tab.icon} mr-2`} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-9">
        <div className="h-full rounded-md bg-white p-6 shadow-bs-sm lg:p-12">
          {tabs.map((tab, index) => (
            <div key={tab.label} role="tabpanel" hidden={active !== index}>
              <h3 className="mb-6 text-2xl font-bold text-bs-dark">{tab.heading}</h3>
              {tab.intro ? <p className="text-bs-muted">{tab.intro}</p> : null}
              {tab.callout ? (
                <div className="mt-4 rounded border-l-4 border-bs-warning bg-bs-light px-4 py-3 text-bs-dark">
                  <strong>{tab.callout.label}</strong> {tab.callout.text}
                </div>
              ) : null}
              {tab.pointsHeading ? (
                <p className="mb-2 mt-4 font-bold text-bs-dark">{tab.pointsHeading}</p>
              ) : null}
              {tab.points ? (
                <ul className={clsx("space-y-2", tab.pointsHeading && "text-sm text-bs-muted")}>
                  {tab.points.map((point) => (
                    <li key={point.label} className="flex items-start gap-3 py-1">
                      <i
                        className={clsx(
                          "mt-1 text-primary-gold",
                          tab.pointsHeading ? "fas fa-angle-right" : "fas fa-check"
                        )}
                        aria-hidden="true"
                      />
                      <div className="text-bs-dark">
                        <strong>{point.label}</strong> {point.text}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              {tab.secondHeading ? (
                <>
                  <p className="mb-2 mt-6 font-bold text-bs-dark">{tab.secondHeading}</p>
                  <p className="text-sm text-bs-muted">{tab.secondText}</p>
                </>
              ) : null}
              {tab.documents ? (
                <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                  {[tab.documents.slice(0, 3), tab.documents.slice(3)].map((column, col) => (
                    <ul key={col} className="divide-y divide-transparent">
                      {column.map((doc) => (
                        <li key={doc} className="py-2 text-bs-dark">
                          <i className="far fa-file-alt mr-2 text-primary-gold" aria-hidden="true" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
