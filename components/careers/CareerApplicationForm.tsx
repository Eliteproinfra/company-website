"use client";

import { useState } from "react";

/** Live `.career-apply-input`: 12px radius, rgba(0,0,0,.12) border; focus -> rgba(212,175,55,.65)
 *  border with a 0 0 0 .22rem rgba(212,175,55,.18) ring. The form sits in the white
 *  `.career-apply-modal .modal-content` (18px radius). */
const inputClass =
  "w-full rounded-xl border border-black/[0.12] bg-white px-3.5 py-3 text-dark-black placeholder:text-bs-muted focus:border-primary-gold/65 focus:shadow-input-focus focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export default function CareerApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "success") {
    return (
      <div className="rounded-[18px] border border-black/[0.06] bg-white p-8 text-center shadow-card-lg sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-2xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-dark-black">Application received</h3>
        <p className="mt-2 text-muted">
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
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        setErrorMessage("");
        const form = event.currentTarget;
        const data = new FormData(form);
        try {
          const res = await fetch("/api/career-application", { method: "POST", body: data });
          if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        }
      }}
      className="rounded-[18px] border border-black/[0.06] bg-white p-8 shadow-card-lg sm:p-12"
    >
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="career-company-website">Leave this field empty</label>
        <input id="career-company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="career-name" className="sr-only">
            Full Name
          </label>
          <input id="career-name" name="name" type="text" placeholder="Full Name *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="career-phone" className="sr-only">
            Phone Number
          </label>
          <input id="career-phone" name="phone" type="tel" placeholder="Phone Number *" required className={inputClass} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="career-email" className="sr-only">
          Email Address
        </label>
        <input id="career-email" name="email" type="email" placeholder="Email Address *" required className={inputClass} />
      </div>

      <div className="mt-5">
        <label htmlFor="career-resume" className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/65">
          Resume (PDF/DOC/DOCX)
        </label>
        <input
          id="career-resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary-gold/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-gold hover:file:bg-primary-gold/20"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="career-cover-letter" className="sr-only">
          Cover Letter
        </label>
        <textarea
          id="career-cover-letter"
          name="coverLetter"
          rows={4}
          placeholder="Cover Letter (Optional)"
          className={inputClass}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-xl border border-black/[0.08] bg-gold-gradient py-3.5 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
      <p className="mt-2.5 text-center text-[0.85rem] font-semibold text-ink/65">
        Our HR team reviews every application personally.
      </p>
    </form>
  );
}
