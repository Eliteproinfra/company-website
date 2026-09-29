"use client";

import clsx from "clsx";
import { useState } from "react";
import ApplyModal from "@/components/careers/ApplyModal";
import { departments, type JobListing } from "@/lib/data/careers";

/**
 * Live career.php #openings: a `.bg-light` "Departments" filter box (gold "All Openings",
 * #212529 items with a small circle icon) beside `.job-item`s. Each `.job-card` (white, 1px #eee,
 * 10px radius; hover -> gold border + translateX(10px)) carries the title, #666 meta with gold
 * icons, the #0a0a0a `.apply-btn` pill and a round toggle. Expanding shows the `.job-detail`
 * panel (white, #eee border, no top border) with "Job Description", "Qualifications and
 * Skills" and "Roles and Responsibilities". Clicking Apply opens the live modal.
 */
export default function JobOpenings({ jobs }: { jobs: JobListing[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [applying, setApplying] = useState<JobListing | null>(null);

  const visible = filter ? jobs.filter((job) => job.department === filter) : jobs;

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="rounded-md bg-bs-light p-6">
            <h5 className="mb-3 text-xl font-bold text-dark-black">Departments</h5>
            <ul className="space-y-2">
              {departments.map((dept) => {
                const active = dept.filter === filter;
                return (
                  <li key={dept.label}>
                    <button
                      type="button"
                      onClick={() => setFilter(dept.filter)}
                      className={clsx(
                        "text-left",
                        active ? "font-bold text-primary-gold" : "text-bs-dark hover:text-primary-gold"
                      )}
                    >
                      <i
                        className={clsx("mr-2", dept.filter === null ? "fas fa-briefcase" : "fas fa-circle text-[0.6em]")}
                        aria-hidden="true"
                      />
                      {dept.label}
                      {dept.count ? ` (${dept.count})` : ""}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-9">
          {visible.length === 0 ? (
            <p className="rounded-[10px] border border-border-card bg-white p-[25px] text-muted">
              No openings in this department right now.
            </p>
          ) : null}
          {visible.map((job) => {
            const open = openId === job.id;
            return (
              <div key={job.id} className="mb-5">
                <div
                  className={clsx(
                    "flex flex-wrap items-center justify-between gap-4 border border-border-card bg-white p-[25px] transition-all duration-300",
                    open
                      ? "rounded-t-[10px] border-primary-gold shadow-card"
                      : "rounded-[10px] hover:translate-x-2.5 hover:border-primary-gold hover:shadow-card"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : job.id)}
                    aria-expanded={open}
                    className="text-left"
                  >
                    <h4 className="text-[1.2rem] font-bold text-dark-black">{job.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-[15px] text-[0.9rem] text-muted">
                      <span>
                        <i className="fas fa-map-marker-alt mr-1.5 text-primary-gold" aria-hidden="true" />
                        {job.location}
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1.5 text-primary-gold" aria-hidden="true" />
                        {job.type}
                      </span>
                      <span>
                        <i className="fas fa-briefcase mr-1.5 text-primary-gold" aria-hidden="true" />
                        {job.experience}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setApplying(job)}
                      className="rounded-full bg-dark-black px-[25px] py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-primary-gold"
                    >
                      Apply Now
                      <i className="fas fa-arrow-right ml-2" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : job.id)}
                      aria-label={open ? `Collapse ${job.title}` : `Expand ${job.title}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border-card bg-white text-dark-black transition-colors hover:border-primary-gold hover:text-primary-gold"
                    >
                      <i
                        className={clsx("fas fa-chevron-down transition-transform duration-[250ms]", open && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div
                  className={clsx(
                    "grid overflow-hidden rounded-b-[10px] border border-t-0 border-border-card bg-white transition-all duration-[350ms]",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent"
                  )}
                >
                  <div className="min-h-0">
                    <div className="max-h-[70vh] overflow-y-auto px-[25px] pb-[22px] pt-[18px]">
                      <div className="mb-2.5 text-base font-extrabold text-dark-black">Job Description</div>
                      <div className="space-y-4 text-[0.95rem] leading-[1.65] text-muted-3">
                        <p>{job.summary}</p>
                        <div>
                          <p>Qualifications and Skills</p>
                          {job.qualifications.map((q) => (
                            <p key={q}>
                              {job.bullet} {q}
                            </p>
                          ))}
                        </div>
                        <div>
                          <p>Roles and Responsibilities</p>
                          {job.responsibilities.map((r) => (
                            <p key={r}>
                              {job.bullet} {r}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ApplyModal key={applying?.id ?? "none"} job={applying} onClose={() => setApplying(null)} />
    </>
  );
}
