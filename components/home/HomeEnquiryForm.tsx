"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClass =
  "rounded-md border-0 bg-bs-light px-3 py-3.5 text-bs-dark placeholder:text-bs-muted focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export default function HomeEnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
              source: "Homepage",
              fields: {
                Name: data.get("name"),
                Email: data.get("email"),
                Phone: data.get("phone"),
                Interest: data.get("interest"),
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
      <label htmlFor="home-phone" className="sr-only">
        Phone Number
      </label>
      <input
        id="home-phone"
        name="phone"
        type="tel"
        placeholder="Phone Number"
        required
        className={inputClass}
      />
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
      <label htmlFor="home-message" className="sr-only">
        Your Message
      </label>
      <textarea
        id="home-message"
        name="message"
        placeholder="Leave a message here"
        rows={4}
        className={`sm:col-span-2 ${inputClass}`}
      />
      {status === "error" ? (
        <p role="alert" className="sm:col-span-2 text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}
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
