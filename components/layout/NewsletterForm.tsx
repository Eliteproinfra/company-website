"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "success") {
    return (
      <p className="mt-6 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-sm text-primary-gold">
        <i className="fas fa-check" aria-hidden="true" /> Subscribed! Thanks for joining.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("submitting");
        window.setTimeout(() => setStatus("success"), 500);
      }}
      className="mt-6 flex overflow-hidden rounded-lg bg-white"
    >
      <input
        type="email"
        required
        placeholder="Your Email"
        disabled={status === "submitting"}
        className="w-full min-w-0 px-3 py-2.5 text-sm text-dark-black focus:outline-none disabled:bg-neutral-100"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        aria-label="Subscribe"
        className="flex shrink-0 items-center justify-center bg-primary-gold px-4 text-dark-black disabled:opacity-70"
      >
        <i className="fas fa-arrow-right" aria-hidden="true" />
      </button>
    </form>
  );
}
