"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-white/25 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/60 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

type Status = "idle" | "submitting" | "success" | "error";

export default function PropertyEnquiryForm({ propertyTitle }: { propertyTitle: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/15 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-bold text-white">Enquiry received</h3>
        <p className="mt-2 text-sm text-white/70">
          A relationship manager will call you back with pricing and site-visit options.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-primary-gold hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-bold text-primary-gold">Quick Enquiry</h3>
      <p className="mb-4 mt-2 text-sm text-white/60">
        Get details, pricing, and site visit assistance.
      </p>
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
                source: `Property Enquiry — ${propertyTitle}`,
                honeypot: String(data.get("company") ?? ""),
                fields: {
                  Property: propertyTitle,
                  Name: String(data.get("name") ?? ""),
                  Phone: String(data.get("phone") ?? ""),
                  Email: String(data.get("email") ?? ""),
                  Message: String(data.get("message") ?? ""),
                },
              }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
            setStatus("success");
          } catch (error) {
            setStatus("error");
            setErrorMessage(
              error instanceof Error ? error.message : "Something went wrong. Please try again."
            );
          }
        }}
        className="space-y-3"
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <div>
          <label htmlFor="pe-name" className="sr-only">
            Your Name
          </label>
          <input id="pe-name" name="name" type="text" placeholder="Your Name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="pe-phone" className="sr-only">
            Phone Number
          </label>
          <input id="pe-phone" name="phone" type="tel" placeholder="Phone Number" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="pe-email" className="sr-only">
            Your Email
          </label>
          <input id="pe-email" name="email" type="email" placeholder="Your Email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="pe-message" className="sr-only">
            Message
          </label>
          <textarea
            id="pe-message"
            name="message"
            rows={2}
            placeholder="Message"
            required
            className={inputClass}
          />
        </div>
        {status === "error" ? (
          <p role="alert" className="text-sm font-semibold text-red-400">
            {errorMessage}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-4 py-2.5 text-sm font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </>
  );
}
