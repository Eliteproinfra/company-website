"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Live `.footer-newsletter`: a Bootstrap input-group with a `.form-control bg-dark
 * border-secondary text-white` field (#212529 / #6c757d) and a `.btn-gold.text-dark` arrow
 * button, followed by an italic white note. On the home page `body.index-page` wraps it in a
 * #f5f5f5 8px-radius box, turns the input white with #222 text and a #ddd border, and the
 * note #444.
 */
export default function NewsletterForm() {
  const isHome = usePathname() === "/";
  const [status, setStatus] = useState<Status>("idle");

  return (
    <div className={clsx("mt-6", isHome && "rounded-lg bg-copyright-bg p-4")}>
      {status === "success" ? (
        <p className="flex items-center gap-2 text-sm text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" /> Subscribed! Thanks for joining.
        </p>
      ) : (
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
        >
          <div className="flex">
            <input
              name="email"
              type="email"
              required
              placeholder="Your Email"
              disabled={status === "submitting"}
              className={clsx(
                "w-full min-w-0 rounded-l-md border px-3 py-2 text-[0.9rem] focus:border-primary-gold focus:outline-none disabled:opacity-70",
                isHome
                  ? "border-border-input bg-white text-pill-text placeholder:text-bs-muted"
                  : "border-bs-secondary bg-bs-dark text-white placeholder:text-white/65"
              )}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              aria-label="Subscribe"
              className="flex shrink-0 items-center justify-center rounded-r-md border border-black/[0.08] bg-gold-gradient px-4 font-bold text-bs-dark transition-[filter] hover:brightness-[1.03] disabled:opacity-70"
            >
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
          {status === "error" ? (
            <p role="alert" className="mt-2 text-sm text-red-400">
              Couldn&apos;t subscribe right now &mdash; please try again.
            </p>
          ) : null}
        </form>
      )}
      <p className={clsx("mt-2 block text-xs italic", isHome ? "text-muted-3" : "text-white")}>
        Subscribe for exclusive updates.
      </p>
    </div>
  );
}
