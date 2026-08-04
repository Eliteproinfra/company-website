"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-dark-black placeholder:text-neutral-400 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

type Status = "idle" | "submitting" | "success";

export default function CareerApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-neutral-50 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-2xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-dark-black">Application received</h3>
        <p className="mt-2 text-neutral-500">
          Thank you for applying. Our HR team will review your profile and reach out if it&apos;s a
          match.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary-gold hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("submitting");
        window.setTimeout(() => setStatus("success"), 600);
      }}
      className="rounded-2xl bg-neutral-50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-12"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="career-name" className="sr-only">
            Full Name
          </label>
          <input id="career-name" type="text" placeholder="Full Name *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="career-phone" className="sr-only">
            Phone Number
          </label>
          <input id="career-phone" type="tel" placeholder="Phone Number *" required className={inputClass} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="career-email" className="sr-only">
          Email Address
        </label>
        <input id="career-email" type="email" placeholder="Email Address *" required className={inputClass} />
      </div>

      <div className="mt-5">
        <label htmlFor="career-resume" className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500">
          Resume (PDF/DOC/DOCX)
        </label>
        <input
          id="career-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-gold/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-gold hover:file:bg-primary-gold/20"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="career-cover-letter" className="sr-only">
          Cover Letter
        </label>
        <textarea
          id="career-cover-letter"
          rows={4}
          placeholder="Cover Letter (Optional)"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold py-3.5 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
