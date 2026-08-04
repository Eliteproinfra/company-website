"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClass =
  "rounded-lg border border-neutral-200 px-4 py-3 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

type Status = "idle" | "submitting" | "success";

export default function HomeEnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "success") {
    return (
      <div className="mt-6 rounded-lg border border-primary-gold/30 bg-primary-gold/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/10 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h4 className="mt-4 font-bold text-dark-black">Thank you for reaching out</h4>
        <p className="mt-2 text-sm text-neutral-500">
          We&apos;ve received your enquiry and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-primary-gold hover:underline"
        >
          Submit another enquiry
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
      className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <input type="text" placeholder="Your Name" required className={inputClass} />
      <input type="email" placeholder="Your Email" required className={inputClass} />
      <input type="tel" placeholder="Phone Number" required className={inputClass} />
      <select defaultValue="" required className={`${inputClass} text-neutral-500`}>
        <option value="" disabled>
          Select Interest
        </option>
        <option value="buy">Buying / Investing</option>
        <option value="nri">NRI Services</option>
        <option value="commercial">Commercial Leasing</option>
        <option value="management">Property Management</option>
      </select>
      <textarea
        placeholder="Your Message"
        rows={4}
        className={`sm:col-span-2 ${inputClass}`}
      />
      <Button
        type="submit"
        iconRight="fas fa-paper-plane"
        className="sm:col-span-2"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
