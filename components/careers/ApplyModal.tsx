"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { applyPoints, type JobListing } from "@/lib/data/careers";

/**
 * Live `.career-apply-modal`: 18px-radius white dialog; header `linear-gradient(135deg,
 * #111827, #0b1220)` with the logo tile, "Apply for Position" and "Role • Department";
 * left `.career-apply-side` panel `linear-gradient(135deg, rgba(212,175,55,.16),
 * rgba(17,24,39,.04))` with rgba(255,255,255,.75) point chips; right form with
 * `.career-apply-input`s and a full-width `.btn-gold`.
 */
const inputClass =
  "w-full rounded-xl border border-black/[0.12] bg-white px-3.5 py-3 text-dark-black placeholder:text-bs-muted focus:border-primary-gold/65 focus:shadow-input-focus focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplyModal({ job, onClose }: { job: JobListing | null; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("No file selected");

  // State resets per job because the parent remounts this with `key={job.id}`.
  useEffect(() => {
    if (!job) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-title"
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[18px] bg-white shadow-bs-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[linear-gradient(135deg,#111827,#0b1220)] p-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.08] p-1.5">
              <Image src="/images/Elite-pro-logo.png" alt="" width={845} height={249} className="h-auto w-full object-contain" />
            </div>
            <div>
              <div id="apply-title" className="text-xl font-extrabold leading-tight text-white">
                Apply for Position
              </div>
              <div className="mt-1 text-[0.92rem] font-semibold text-white/70">
                {job.title}
                <span className="mx-2">•</span>
                {job.department}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
          >
            <i className="fas fa-xmark text-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4 border-b border-black/[0.06] bg-[linear-gradient(135deg,rgba(212,175,55,0.16),rgba(17,24,39,0.04))] p-[22px] lg:border-b-0 lg:border-r">
            <div className="text-[1.05rem] font-black text-ink">Why work with us</div>
            <div className="grid gap-2.5">
              {applyPoints.map((point) => (
                <div
                  key={point.text}
                  className="flex items-start gap-2.5 rounded-[14px] border border-black/[0.06] bg-white/75 p-3"
                >
                  <i className={`${point.icon} mt-0.5 text-primary-gold`} aria-hidden="true" />
                  <span className="text-[0.92rem] font-bold leading-[1.35] text-ink">{point.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2.5 rounded-[14px] border border-black/[0.06] bg-ink/[0.04] p-3 text-[0.9rem] font-bold text-ink/75">
              <i className="fas fa-lock text-primary-gold" aria-hidden="true" />
              <span>Your details are shared only with our HR team.</span>
            </div>
          </div>

          <form
            className="p-[22px]"
            onSubmit={async (event) => {
              event.preventDefault();
              setStatus("submitting");
              setMessage("");
              const data = new FormData(event.currentTarget);
              data.set("jobTitle", job.title);
              try {
                const res = await fetch("/api/career-application", { method: "POST", body: data });
                if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
                setStatus("success");
                setMessage("Application submitted. Our HR team will be in touch.");
              } catch (error) {
                setStatus("error");
                setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
              }
            }}
          >
            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="apply-company-website">Leave this field empty</label>
              <input id="apply-company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            {message ? (
              <div
                role="alert"
                className={
                  status === "success"
                    ? "mb-3 rounded-xl border border-[#a3cfbb] bg-[#d1e7dd] px-4 py-3 text-[#0a3622]"
                    : "mb-3 rounded-xl border border-[#f1aeb5] bg-[#f8d7da] px-4 py-3 text-[#58151c]"
                }
              >
                {message}
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="apply-name" className="mb-2 block text-bs-dark">Full Name</label>
                <input id="apply-name" name="name" required placeholder="Enter your full name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="apply-phone" className="mb-2 block text-bs-dark">Phone Number</label>
                <input id="apply-phone" name="phone" type="tel" required placeholder="Enter phone number" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="apply-email" className="mb-2 block text-bs-dark">Email Address</label>
                <input id="apply-email" name="email" type="email" required placeholder="Enter your email" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="apply-resume" className="mb-2 block text-bs-dark">Upload Resume</label>
                <input
                  id="apply-resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "No file selected")}
                  className={`${inputClass} file:mr-3 file:border-0 file:bg-transparent file:font-semibold file:text-bs-dark`}
                />
                <div className="mt-2 flex flex-wrap gap-2.5 text-[0.86rem] text-bs-muted">
                  <span>Allowed: PDF/DOC/DOCX</span>
                  <span>•</span>
                  <span>{fileName}</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="apply-cover" className="mb-2 block text-bs-dark">Cover Letter (Optional)</label>
                <textarea id="apply-cover" name="coverLetter" rows={4} placeholder="Tell us why you’re a good fit" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className="w-full rounded-xl border border-black/[0.08] bg-gold-gradient px-[22px] py-3 text-sm font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:opacity-70"
                >
                  {status === "submitting" ? "Submitting…" : "Submit Application"}
                </button>
                <div className="mt-2.5 text-center text-[0.85rem] font-semibold text-ink/65">
                  By submitting, you confirm the information provided is accurate.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
