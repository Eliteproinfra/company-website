"use client";

import { useState } from "react";

/**
 * Live nri-corner.php "Request Callback" form: `.bg-dark.p-5.rounded.border.border-secondary`
 * (#212529, #6c757d border) holding `.nri-form-control` fields (rgba(255,255,255,.05) fill,
 * rgba(255,255,255,.1) border, rgba(255,255,255,.55) placeholder; focus fill .1 + gold border)
 * and a full-width `.btn-gold`.
 */
const inputClass =
  "w-full border border-white/10 bg-white/5 p-[15px] text-white placeholder:text-white/55 focus:border-primary-gold focus:bg-white/10 focus:outline-none";

const countryCodes = ["+91 (IND)", "+1 (USA)", "+44 (UK)", "+971 (UAE)"];

type Status = "idle" | "submitting" | "success" | "error";

export default function NriCallbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        setErrorMessage("");
        const data = new FormData(event.currentTarget);
        try {
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "NRI Corner",
              fields: {
                Name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
                Email: data.get("email"),
                Phone: `${data.get("code")} ${data.get("phone")}`,
                Interest: data.get("interest"),
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
      className="rounded-md border border-bs-secondary bg-bs-dark p-8 sm:p-12"
    >
      <h3 className="mb-6 text-2xl font-bold text-white">Request Callback</h3>
      {status === "success" ? (
        <p className="flex items-center gap-2 text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" /> Thanks! Our NRI desk will call you back
          shortly.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <label className="sr-only" htmlFor="nri-first">First Name</label>
          <input id="nri-first" name="firstName" placeholder="First Name" required className={`${inputClass} md:col-span-6`} />
          <label className="sr-only" htmlFor="nri-last">Last Name</label>
          <input id="nri-last" name="lastName" placeholder="Last Name" required className={`${inputClass} md:col-span-6`} />
          <label className="sr-only" htmlFor="nri-email">Email Address</label>
          <input id="nri-email" name="email" type="email" placeholder="Email Address" required className={`${inputClass} md:col-span-12`} />
          <label className="sr-only" htmlFor="nri-code">Country code</label>
          <select id="nri-code" name="code" defaultValue={countryCodes[0]} className={`${inputClass} md:col-span-4`}>
            {countryCodes.map((code) => (
              <option key={code} value={code} className="bg-bs-dark">
                {code}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="nri-phone">Phone Number</label>
          <input id="nri-phone" name="phone" type="tel" placeholder="Phone Number" required className={`${inputClass} md:col-span-8`} />
          <label className="sr-only" htmlFor="nri-interest">I am interested in</label>
          <textarea id="nri-interest" name="interest" rows={3} placeholder="I am interested in..." className={`${inputClass} md:col-span-12`} />
          {status === "error" ? (
            <p role="alert" className="text-sm font-semibold text-red-400 md:col-span-12">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-xl border border-black/[0.08] bg-gold-gradient py-3 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:opacity-70 md:col-span-12"
          >
            {status === "submitting" ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      )}
    </form>
  );
}
