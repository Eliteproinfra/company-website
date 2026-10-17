"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  PHONE_INPUT_MAX_DIGITS,
  countryCodes,
  defaultCountry,
  validatePhoneNumber,
} from "@/lib/data/countryCodes";
import { submitEnquiry, submitErrorMessage } from "@/lib/forms/submitEnquiry";

// Dark glass fields for the homepage's dark contact card; focus lights a gold ring.
const inputClass =
  "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/40 transition-all duration-200 hover:border-white/20 focus:border-primary-gold focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] focus:outline-none [&>option]:bg-[#111111] [&>option]:text-white";

/** Positions a gold icon inside a field; the field itself needs `pl-11`. */
function FieldIcon({ icon, top = false }: { icon: string; top?: boolean }) {
  return (
    <i
      className={`${icon} pointer-events-none absolute left-4 text-sm text-primary-gold/80 ${
        top ? "top-[1.15rem]" : "top-1/2 -translate-y-1/2"
      }`}
      aria-hidden="true"
    />
  );
}

const MESSAGE_WORD_LIMIT = 500;

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

/**
 * The phone field takes digits and nothing else: letters, spaces, dashes and a "+" are dropped
 * as they are typed rather than rejected, so pasting "+91 99686-86868" still lands a usable
 * number. The cap is E.164's 15 digits — wide enough to hold a pasted international number
 * whatever the country — and validatePhoneNumber judges the length from there.
 */
const toPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, PHONE_INPUT_MAX_DIGITS);

type Status = "idle" | "submitting" | "success" | "error";

export default function HomeEnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [country, setCountry] = useState(defaultCountry.iso);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");

  const messageWords = countWords(message);
  const messageTooLong = messageWords > MESSAGE_WORD_LIMIT;

  if (status === "success") {
    return (
      <div className="relative mt-10 rounded-2xl border border-primary-gold/30 bg-primary-gold/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/10 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h4 className="mt-4 font-bold text-white">Thank you for reaching out</h4>
        <p className="mt-2 text-sm text-white/60">
          We&apos;ve received your enquiry and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setPhone("");
            setPhoneError("");
            setMessage("");
            setStatus("idle");
          }}
          className="mt-4 text-sm font-semibold text-primary-gold hover:underline"
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
        const form = event.currentTarget;

        const check = validatePhoneNumber(country, phone);
        if (!check.ok) {
          setPhoneError(check.error);
          form.querySelector<HTMLInputElement>("#home-phone")?.focus();
          return;
        }
        setPhoneError("");
        if (messageTooLong) {
          form.querySelector<HTMLTextAreaElement>("#home-message")?.focus();
          return;
        }

        setStatus("submitting");
        setErrorMessage("");
        const data = new FormData(form);
        try {
          await submitEnquiry({
            source: "Homepage",
            fields: {
              Name: String(data.get("name") ?? ""),
              Email: String(data.get("email") ?? ""),
              Phone: check.e164,
              Interest: String(data.get("interest") ?? ""),
              Message: message.trim(),
            },
          });
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(submitErrorMessage(error));
        }
      }}
      className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="relative">
        <label htmlFor="home-name" className="sr-only">
          Your Name
        </label>
        <FieldIcon icon="fas fa-user" />
        <input
          id="home-name"
          name="name"
          type="text"
          placeholder="Your Name"
          required
          className={`${inputClass} w-full pl-11`}
        />
      </div>
      <div className="relative">
        <label htmlFor="home-email" className="sr-only">
          Your Email
        </label>
        <FieldIcon icon="fas fa-envelope" />
        <input
          id="home-email"
          name="email"
          type="email"
          placeholder="Your Email"
          required
          className={`${inputClass} w-full pl-11`}
        />
      </div>
      <div>
        <div className="flex gap-2">
          <label htmlFor="home-country" className="sr-only">
            Country code
          </label>
          <select
            id="home-country"
            name="countryCode"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setPhoneError("");
            }}
            className={`${inputClass} shrink-0`}
          >
            {countryCodes.map((item) => (
              <option key={item.iso} value={item.iso}>
                {item.dial} ({item.short})
              </option>
            ))}
          </select>
          <label htmlFor="home-phone" className="sr-only">
            Phone Number
          </label>
          <div className="relative min-w-0 flex-1">
            <FieldIcon icon="fas fa-phone" />
            <input
              id="home-phone"
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
              onBlur={(event) => {
                const value = event.target.value.trim();
                if (!value) return;
                const check = validatePhoneNumber(country, value);
                setPhoneError(check.ok ? "" : check.error);
              }}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? "home-phone-error" : undefined}
              className={`${inputClass} w-full pl-11`}
            />
          </div>
        </div>
        {phoneError ? (
          <p id="home-phone-error" role="alert" className="mt-1.5 text-sm font-semibold text-red-400">
            {phoneError}
          </p>
        ) : null}
      </div>
      <div className="relative self-start">
        <label htmlFor="home-interest" className="sr-only">
          Interested In
        </label>
        <FieldIcon icon="fas fa-building" />
        <select
          id="home-interest"
          name="interest"
          defaultValue=""
          required
          className={`${inputClass} w-full pl-11 invalid:text-white/40`}
        >
          <option value="" disabled>
            Select Interest
          </option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="investment">Investment</option>
          <option value="consulting">Consulting</option>
        </select>
      </div>
      <div className="relative sm:col-span-2">
        <label htmlFor="home-message" className="sr-only">
          Your Message
        </label>
        <FieldIcon icon="fas fa-comment-dots" top />
        <textarea
          id="home-message"
          name="message"
          placeholder="Leave a message here"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={messageTooLong ? true : undefined}
          aria-describedby="home-message-count"
          className={`${inputClass} block w-full resize-none pl-11`}
        />
        <p
          id="home-message-count"
          aria-live="polite"
          className={`mt-1.5 text-right text-sm ${
            messageTooLong ? "font-semibold text-red-400" : "text-white/40"
          }`}
        >
          {messageTooLong
            ? `${messageWords} words — please keep it to ${MESSAGE_WORD_LIMIT} words or fewer.`
            : `${messageWords} / ${MESSAGE_WORD_LIMIT} words`}
        </p>
      </div>
      {status === "error" ? (
        <p role="alert" className="sm:col-span-2 text-sm font-semibold text-red-400">
          {errorMessage}
        </p>
      ) : null}
      <Button
        type="submit"
        iconRight="fas fa-paper-plane"
        className="mx-auto w-full sm:col-span-2 sm:w-auto sm:min-w-[280px]"
        disabled={status === "submitting" || messageTooLong}
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
