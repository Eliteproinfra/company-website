"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-dark-black placeholder:text-neutral-400 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

type Status = "idle" | "submitting" | "success" | "error";

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-neutral-50 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-2xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-dark-black">Thank you for reaching out</h3>
        <p className="mt-2 text-neutral-500">
          We&apos;ve received your enquiry and a member of our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary-gold hover:underline"
        >
          Submit another enquiry
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
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "Contact Page",
              honeypot: data.get("company-website"),
              fields: {
                Name: `${data.get("first-name")} ${data.get("last-name")}`.trim(),
                Email: data.get("email"),
                Phone: data.get("mobile"),
                "Enquiry Type": data.get("enquiry-type"),
                Subject: data.get("subject"),
                Message: data.get("message"),
              },
            }),
          });
          if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        }
      }}
      className="rounded-2xl bg-neutral-50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-12"
    >
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="company-website">Leave this field empty</label>
        <input id="company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mb-5">
        <label
          htmlFor="enquiry-type"
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-500"
        >
          I am interested in:
        </label>
        <select id="enquiry-type" name="enquiry-type" defaultValue="general" className={inputClass}>
          <option value="general">General Enquiry</option>
          <option value="buy">Buying / Investing</option>
          <option value="sell">Selling Property</option>
          <option value="lease">Leasing (Commercial/Retail)</option>
          <option value="career">Careers &amp; Jobs</option>
          <option value="partner">Channel Partner / Associate</option>
        </select>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="sr-only">
            First Name
          </label>
          <input id="first-name" name="first-name" type="text" placeholder="First Name *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="last-name" className="sr-only">
            Last Name
          </label>
          <input id="last-name" name="last-name" type="text" placeholder="Last Name *" required className={inputClass} />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="mobile" className="sr-only">
            Mobile Number
          </label>
          <input id="mobile" name="mobile" type="tel" placeholder="Mobile Number *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input id="email" name="email" type="email" placeholder="Email Address *" required className={inputClass} />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="subject" className="sr-only">
          Subject
        </label>
        <input id="subject" name="subject" type="text" placeholder="Subject" className={inputClass} />
      </div>

      <div className="mb-5">
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Your Message / Additional Details"
          className={inputClass}
        />
      </div>

      <div className="mb-6 flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-gold focus:ring-primary-gold"
        />
        <label htmlFor="consent" className="text-sm text-neutral-500">
          I authorize Elite Pro Infra to contact me via Email, SMS, or Call.
        </label>
      </div>

      {status === "error" ? (
        <p role="alert" className="mb-4 text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold py-3.5 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
