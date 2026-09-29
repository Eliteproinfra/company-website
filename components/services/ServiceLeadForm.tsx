"use client";

import clsx from "clsx";
import { useState } from "react";

type Field = { id: string; label: string; type: string; placeholder: string };

/**
 * Input surfaces copied from live:
 * - `light`: the global `.form-control` (no border, 2px #eee bottom border, transparent,
 *   gold bottom border on focus).
 * - `dark`: `.land-cta .land-cta-form .form-control` / `.pm-cta-form` (rgba(255,255,255,.06)
 *   fill, rgba(255,255,255,.18) border with a 2px rgba(255,255,255,.35) bottom, 10px radius).
 * - `nri`: `.nri-form-control` on nri-corner's #contact-nri (rgba(255,255,255,.05) fill,
 *   rgba(255,255,255,.1) border, rgba(255,255,255,.55) placeholder, focus fill .1 + gold border).
 */
type Tone = "light" | "dark" | "nri";

/**
 * `grid`: fields side by side with screen-reader-only labels (live's land CTA and the
 * NRI-corner strip). `stacked`: one field per row with visible labels above, matching
 * live's boxed consultation form on nri-advisory.
 */
type Layout = "grid" | "stacked";

const inputToneClass: Record<Tone, string> = {
  light:
    "w-full rounded-none border-0 border-b-2 border-border-card bg-transparent px-0 py-[15px] text-dark-black placeholder:text-bs-muted focus:border-primary-gold focus:outline-none",
  dark: "h-[58px] w-full rounded-[10px] border border-white/[0.18] border-b-2 border-b-white/35 bg-white/[0.06] px-4 text-white placeholder:text-white/65 focus:border-primary-gold focus:outline-none",
  nri: "w-full border border-white/10 bg-white/5 p-[15px] text-white placeholder:text-white/55 focus:border-primary-gold focus:bg-white/10 focus:outline-none",
};

// Literal Tailwind class names so the JIT scanner picks up every column count.
const gridColumnsClass: Record<number, string> = {
  1: "sm:grid-cols-2",
  2: "sm:grid-cols-3",
  3: "sm:grid-cols-3",
};

const gridSubmitSpanClass: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-3",
  3: "sm:col-span-3",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ServiceLeadForm({
  fields,
  submitLabel,
  source = "Service Enquiry",
  tone = "light",
  layout = "grid",
  className,
}: {
  fields: Field[];
  submitLabel: string;
  source?: string;
  tone?: Tone;
  layout?: Layout;
  /** Overrides the form's own surface - used where live boxes the form itself. */
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isStacked = layout === "stacked";
  const isDark = tone !== "light";
  const columns = gridColumnsClass[fields.length] ?? gridColumnsClass[3];
  const submitSpan = gridSubmitSpanClass[fields.length] ?? gridSubmitSpanClass[3];
  // Only the light grid form carries its own card (live `.contact-form-wrapper`); dark
  // tones sit bare on the section and stacked takes its surface from `className`.
  const defaultSurface =
    !isStacked && tone === "light" ? "bg-white p-8 shadow-contact-form sm:p-[50px]" : "";

  if (status === "success") {
    return (
      <div
        className={clsx(
          "p-8 text-center sm:p-10",
          isDark ? "border border-white/15 bg-white/[0.06]" : "bg-white shadow-contact-form",
          className
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/10 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className={clsx("mt-4 font-bold", isDark ? "text-white" : "text-dark-black")}>
          Thank you for reaching out
        </h3>
        <p className={clsx("mt-2 text-sm", isDark ? "text-white/70" : "text-muted")}>
          We&apos;ve received your details and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-primary-gold hover:underline"
        >
          Submit another request
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
        const values: Record<string, string> = {};
        fields.forEach((field) => {
          values[field.label] = String(data.get(field.id) ?? "");
        });
        try {
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source, fields: values }),
          });
          if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        }
      }}
      className={clsx(
        isStacked ? "grid grid-cols-1 gap-4 text-left" : clsx("grid grid-cols-1 gap-4 sm:items-end", columns),
        defaultSurface,
        className
      )}
    >
      {fields.map((field) => (
        <div key={field.id} className={isStacked ? undefined : "sm:col-span-1"}>
          <label
            htmlFor={field.id}
            className={
              isStacked
                ? "mb-2 block font-bold text-dark-black"
                : "sr-only"
            }
          >
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required
            className={inputToneClass[tone]}
          />
        </div>
      ))}
      {status === "error" ? (
        <p
          role="alert"
          className={clsx("text-sm font-semibold", isDark ? "text-red-400" : "text-red-600", !isStacked && submitSpan)}
        >
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={clsx(
          "border border-black/[0.08] bg-gold-gradient px-6 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70",
          tone === "dark" ? "h-[58px] rounded-[10px]" : "rounded-xl py-3",
          !isStacked && submitSpan
        )}
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
