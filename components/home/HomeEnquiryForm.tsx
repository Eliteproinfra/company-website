"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  PHONE_INPUT_MAX_DIGITS,
  countryCodes,
  defaultCountry,
  validatePhoneNumber,
} from "@/lib/data/countryCodes";

const inputClass =
  "rounded-md border-0 bg-bs-light px-3 py-3.5 text-bs-dark placeholder:text-bs-muted focus:outline-none";

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
      <div className="mt-6 rounded-lg border border-primary-gold/30 bg-primary-gold/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/10 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h4 className="mt-4 font-bold text-dark-black">Thank you for reaching out</h4>
        <p className="mt-2 text-sm text-muted">
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
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "Homepage",
              fields: {
                Name: data.get("name"),
                Email: data.get("email"),
                Phone: check.e164,
                Interest: data.get("interest"),
                Message: message.trim(),
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
      className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <label htmlFor="home-name" className="sr-only">
        Your Name
      </label>
      <input
        id="home-name"
        name="name"
        type="text"
        placeholder="Your Name"
        required
        className={inputClass}
      />
      <label htmlFor="home-email" className="sr-only">
        Your Email
      </label>
      <input
        id="home-email"
        name="email"
        type="email"
        placeholder="Your Email"
        required
        className={inputClass}
      />
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
            className={`${inputClass} min-w-0 flex-1`}
          />
        </div>
        {phoneError ? (
          <p id="home-phone-error" role="alert" className="mt-1.5 text-sm font-semibold text-red-600">
            {phoneError}
          </p>
        ) : null}
      </div>
      <label htmlFor="home-interest" className="sr-only">
        Interested In
      </label>
      <select
        id="home-interest"
        name="interest"
        defaultValue=""
        required
        className={`${inputClass} text-bs-muted`}
      >
        <option value="" disabled>
          Select Interest
        </option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
        <option value="investment">Investment</option>
        <option value="consulting">Consulting</option>
      </select>
      <div className="sm:col-span-2">
        <label htmlFor="home-message" className="sr-only">
          Your Message
        </label>
        <textarea
          id="home-message"
          name="message"
          placeholder="Leave a message here"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={messageTooLong ? true : undefined}
          aria-describedby="home-message-count"
          className={`w-full ${inputClass}`}
        />
        <p
          id="home-message-count"
          aria-live="polite"
          className={`mt-1.5 text-right text-sm ${
            messageTooLong ? "font-semibold text-red-600" : "text-muted"
          }`}
        >
          {messageTooLong
            ? `${messageWords} words — please keep it to ${MESSAGE_WORD_LIMIT} words or fewer.`
            : `${messageWords} / ${MESSAGE_WORD_LIMIT} words`}
        </p>
      </div>
      {status === "error" ? (
        <p role="alert" className="sm:col-span-2 text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}
      <Button
        type="submit"
        iconRight="fas fa-paper-plane"
        className="sm:col-span-2"
        disabled={status === "submitting" || messageTooLong}
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
