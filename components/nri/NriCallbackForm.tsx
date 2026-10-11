"use client";

import { useState } from "react";
import {
  PHONE_INPUT_MAX_DIGITS,
  countryCodes,
  defaultCountry,
  findCountry,
  validatePhoneNumber,
} from "@/lib/data/countryCodes";
import { submitEnquiry, submitErrorMessage } from "@/lib/forms/submitEnquiry";

/**
 * Live nri-corner.php "Request Callback" form: `.bg-dark.p-5.rounded.border.border-secondary`
 * (#212529, #6c757d border) holding `.nri-form-control` fields (rgba(255,255,255,.05) fill,
 * rgba(255,255,255,.1) border, rgba(255,255,255,.55) placeholder; focus fill .1 + gold border)
 * and a full-width `.btn-gold`.
 */
const inputClass =
  "w-full border border-white/10 bg-white/5 p-[15px] text-white placeholder:text-white/55 focus:border-primary-gold focus:bg-white/10 focus:outline-none";

/**
 * This form carried its own four-entry list of dial-code strings — "+91 (IND)",
 * "+1 (USA)", "+44 (UK)", "+971 (UAE)" — and submitted whatever digits were
 * typed beside it without checking them.
 *
 * On this page of all pages that was the wrong list. It is the NRI desk's own
 * callback form, and an NRI in Singapore, Saudi, Qatar, Oman, Canada, Australia
 * or anywhere else in lib/data/countryCodes had no code to pick: the dropdown
 * offered four and the submitted "Phone" was a dial code the visitor did not
 * live under. The shared module already holds ~40 corridors with per-country
 * digit ranges and is what the homepage form and the timed popup use, so this
 * now uses it too rather than keeping a third spelling of the same idea.
 */
const toPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, PHONE_INPUT_MAX_DIGITS);

type Status = "idle" | "submitting" | "success" | "error";

export default function NriCallbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [country, setCountry] = useState(defaultCountry.iso);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        // Validated before the request goes out, so a wrong-length number is
        // corrected in place instead of landing in the inbox uncallable.
        const check = validatePhoneNumber(country, phone);
        if (!check.ok) {
          setPhoneError(check.error);
          form.querySelector<HTMLInputElement>("#nri-phone")?.focus();
          return;
        }
        setPhoneError("");

        setStatus("submitting");
        setErrorMessage("");
        const data = new FormData(form);
        try {
          await submitEnquiry({
            source: "NRI Corner",
            fields: {
              Name: `${String(data.get("firstName") ?? "")} ${String(
                data.get("lastName") ?? ""
              )}`.trim(),
              Email: String(data.get("email") ?? ""),
              // E.164, the same shape the homepage form sends, so the admin's
              // Enquiries inbox shows one phone format throughout.
              Phone: check.e164,
              Country: findCountry(country).name,
              Interest: String(data.get("interest") ?? ""),
            },
          });
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(submitErrorMessage(error));
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
          <select
            id="nri-code"
            name="code"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              // The old number was judged against the old country's digit
              // range, so its error no longer means anything.
              setPhoneError("");
            }}
            className={`${inputClass} md:col-span-4`}
          >
            {countryCodes.map((option) => (
              <option key={option.iso} value={option.iso} className="bg-bs-dark">
                {option.dial} ({option.short})
              </option>
            ))}
          </select>
          <div className="md:col-span-8">
            <label className="sr-only" htmlFor="nri-phone">Phone Number</label>
            <input
              id="nri-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(event) => {
                setPhone(toPhoneDigits(event.target.value));
                if (phoneError) setPhoneError("");
              }}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? "nri-phone-error" : undefined}
              className={inputClass}
            />
            {phoneError ? (
              <p id="nri-phone-error" role="alert" className="mt-2 text-sm font-semibold text-red-400">
                {phoneError}
              </p>
            ) : null}
          </div>
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
