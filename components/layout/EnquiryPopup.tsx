"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PHONE_INPUT_MAX_DIGITS,
  countryCodes,
  defaultCountry,
  validatePhoneNumber,
} from "@/lib/data/countryCodes";

/**
 * A site-wide lead-capture modal that opens on a timer and keeps coming back.
 *
 * Mounted in the `(site)` layout, which does not remount between routes, so the
 * timer keeps running as the visitor moves around instead of restarting on
 * every page.
 *
 * It posts to the same `/api/enquiry` route as every other form on the site —
 * the route takes an arbitrary set of labelled fields — so a popup lead lands in
 * the admin Enquiries inbox and the notification email like any other.
 */

/** How long after landing — and after each dismissal — the popup opens. */
const POPUP_INTERVAL_MS = 60_000;

/**
 * Set once a visitor actually submits. Kept in `sessionStorage` so a converted
 * lead stops being interrupted for the rest of the visit, while a new visit
 * starts the cycle again.
 */
const CONVERTED_KEY = "epi-enquiry-popup-converted";

/**
 * Read when the timer fires rather than mirrored into state: nothing about the
 * render depends on it, and reading it on the client only keeps it away from the
 * server render, where `sessionStorage` does not exist.
 */
function hasConverted() {
  try {
    return Boolean(sessionStorage.getItem(CONVERTED_KEY));
  } catch {
    // Private mode or blocked storage — fall back to the in-page ref.
    return false;
  }
}

/** `enquiries.source` is VARCHAR(120); a long property slug would overflow it. */
const SOURCE_MAX = 120;

/**
 * No `w-full` here on purpose: the country code and phone number share a flex
 * row, where a full-width basis stops the select shrinking and pushes the phone
 * field out past the edge of the card. Standalone fields add `w-full` themselves.
 */
const fieldClass =
  "rounded-md border border-bs-border bg-white px-3 py-2.5 text-bs-dark placeholder:text-bs-muted focus:border-primary-gold focus:outline-none";

const toPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, PHONE_INPUT_MAX_DIGITS);

/**
 * True while the visitor is part-way through one of the page's own forms — the
 * contact page's enquiry form, the career application, the property callback.
 * Stealing focus mid-sentence to ask for the same details is worse than waiting,
 * so the popup skips that cycle and tries again on the next one.
 */
function isBusyInAnotherForm() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  const tag = active.tagName;
  if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") return false;
  return Boolean(active.closest("form"));
}

/** Tab and Shift+Tab stay inside the dialog while it is open. */
function trapTab(event: KeyboardEvent, container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

type Status = "idle" | "submitting" | "success" | "error";

export default function EnquiryPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [country, setCountry] = useState(defaultCountry.iso);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  /** Backs up CONVERTED_KEY for the page view when storage is unavailable. */
  const convertedRef = useRef(false);

  // The reopen cycle. Re-runs whenever the popup closes, which is what makes it
  // come back POPUP_INTERVAL_MS after each dismissal as well as after landing.
  useEffect(() => {
    if (open) return;

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        // A visitor who already submitted is left alone for the rest of the visit.
        if (convertedRef.current || hasConverted()) return;
        // Opening into a background tab burns the appearance — the visitor comes
        // back to a modal they never saw open. Wait for the next cycle instead.
        if (document.hidden || isBusyInAnotherForm()) {
          schedule();
          return;
        }
        setOpen(true);
      }, POPUP_INTERVAL_MS);
    };

    schedule();
    return () => clearTimeout(timer);
  }, [open]);

  // Modal behaviour: scroll lock, Escape to close, focus in and back out again.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key === "Tab" && dialogRef.current) trapTab(event, dialogRef.current);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        // Backdrop only — a click that started inside the card must not close it.
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-popup-title"
        className="relative my-auto w-full max-w-md animate-fade-in-up rounded-[10px] bg-leader-profile p-6 shadow-contact-form sm:p-8"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-bs-muted transition-colors hover:bg-black/5 hover:text-dark-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold"
        >
          <i className="fas fa-xmark text-lg" aria-hidden="true" />
        </button>

        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-2xl text-primary-gold">
              <i className="fas fa-check" aria-hidden="true" />
            </div>
            <h3 id="enquiry-popup-title" className="mt-5 text-xl font-bold text-dark-black">
              Thank you for reaching out
            </h3>
            <p className="mt-2 text-sm text-muted">
              We&apos;ve received your details and a member of our team will call you shortly.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 text-sm font-semibold text-primary-gold hover:underline"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 id="enquiry-popup-title" className="pr-10 text-xl font-bold text-dark-black">
              Looking for the right property?
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              Leave your details and one of our advisors will call you back.
            </p>

            <form
              className="mt-5 grid grid-cols-1 gap-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;

                const check = validatePhoneNumber(country, phone);
                if (!check.ok) {
                  setPhoneError(check.error);
                  form.querySelector<HTMLInputElement>("#popup-phone")?.focus();
                  return;
                }
                setPhoneError("");
                setStatus("submitting");
                setErrorMessage("");

                const data = new FormData(form);
                try {
                  const res = await fetch("/api/enquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      source: `Popup — ${pathname}`.slice(0, SOURCE_MAX),
                      honeypot: data.get("company-website"),
                      fields: {
                        Name: String(data.get("name") ?? ""),
                        Email: String(data.get("email") ?? ""),
                        Phone: check.e164,
                        Interest: String(data.get("interest") ?? ""),
                      },
                    }),
                  });
                  if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
                  setStatus("success");
                  // Stop the reopen cycle for the rest of the visit.
                  convertedRef.current = true;
                  try {
                    sessionStorage.setItem(CONVERTED_KEY, "1");
                  } catch {
                    // Storage blocked — the ref still holds for this page view.
                  }
                } catch (error) {
                  setStatus("error");
                  setErrorMessage(
                    error instanceof Error ? error.message : "Something went wrong. Please try again."
                  );
                }
              }}
            >
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="popup-company-website">Leave this field empty</label>
                <input
                  id="popup-company-website"
                  name="company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="popup-name" className="sr-only">
                  Your Name
                </label>
                <input
                  ref={firstFieldRef}
                  id="popup-name"
                  name="name"
                  type="text"
                  placeholder="Your Name *"
                  required
                  className={`w-full ${fieldClass}`}
                />
              </div>

              <div>
                <div className="flex gap-2">
                  <label htmlFor="popup-country" className="sr-only">
                    Country code
                  </label>
                  <select
                    id="popup-country"
                    name="countryCode"
                    value={country}
                    onChange={(event) => {
                      setCountry(event.target.value);
                      setPhoneError("");
                    }}
                    className={`${fieldClass} shrink-0`}
                  >
                    {countryCodes.map((item) => (
                      <option key={item.iso} value={item.iso}>
                        {item.dial} ({item.short})
                      </option>
                    ))}
                  </select>
                  <label htmlFor="popup-phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="popup-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="Phone Number *"
                    required
                    value={phone}
                    onChange={(event) => {
                      setPhone(toPhoneDigits(event.target.value));
                      if (phoneError) setPhoneError("");
                    }}
                    onBlur={(event) => {
                      const value = event.target.value.trim();
                      if (!value) return;
                      const check = validatePhoneNumber(country, value);
                      setPhoneError(check.ok ? "" : check.error);
                    }}
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={phoneError ? "popup-phone-error" : undefined}
                    className={`${fieldClass} min-w-0 flex-1`}
                  />
                </div>
                {phoneError ? (
                  <p id="popup-phone-error" role="alert" className="mt-1.5 text-sm font-semibold text-red-600">
                    {phoneError}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="popup-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="popup-email"
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  required
                  className={`w-full ${fieldClass}`}
                />
              </div>

              <div>
                <label htmlFor="popup-interest" className="sr-only">
                  Interested In
                </label>
                <select
                  id="popup-interest"
                  name="interest"
                  defaultValue=""
                  required
                  className={`w-full ${fieldClass}`}
                >
                  <option value="" disabled>
                    Select Interest
                  </option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Investment">Investment</option>
                  <option value="Consulting">Consulting</option>
                </select>
              </div>

              {status === "error" ? (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-xl border border-black/[0.08] bg-gold-gradient py-3 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Sending…" : "Request a Callback"}
              </button>

              <p className="text-center text-xs text-bs-muted">
                By submitting, you authorize Elite Pro Infra to contact you via Email, SMS, or Call.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
