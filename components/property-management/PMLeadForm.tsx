"use client";

import { useState } from "react";

const inputClasses =
  "h-[58px] rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60 focus:border-primary-gold focus:outline-none";

type Status = "idle" | "submitting" | "success";

export default function PMLeadForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "success") {
    return (
      <div className="flex h-[58px] items-center justify-center gap-2 rounded-xl border border-primary-gold/40 bg-white/10 px-4 text-sm font-semibold text-primary-gold md:col-span-3">
        <i className="fas fa-check" aria-hidden="true" /> Thanks! We&apos;ll call you back shortly.
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
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <div>
        <label htmlFor="pm-cta-name" className="sr-only">
          Name
        </label>
        <input
          id="pm-cta-name"
          type="text"
          placeholder="Name"
          required
          className={`w-full ${inputClasses}`}
        />
      </div>
      <div>
        <label htmlFor="pm-cta-phone" className="sr-only">
          Phone Number
        </label>
        <input
          id="pm-cta-phone"
          type="tel"
          placeholder="Phone Number"
          required
          className={`w-full ${inputClasses}`}
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex h-[58px] items-center justify-center rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-4 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting…" : "Get Free Consultation"}
      </button>
    </form>
  );
}
