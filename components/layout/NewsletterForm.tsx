"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

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
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        const data = new FormData(event.currentTarget);
        try {
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "Newsletter Signup",
              fields: { Email: data.get("email"), Type: "Newsletter subscription" },
            }),
          });
          if (!res.ok) throw new Error();
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
      className="mt-6"
    >
      <div className="flex overflow-hidden rounded-lg bg-white">
        <input
          name="email"
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
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-2 text-sm text-red-400">
          Couldn&apos;t subscribe right now — please try again.
        </p>
      ) : null}
    </form>
  );
}
