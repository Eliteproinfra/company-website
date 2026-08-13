"use client";

import { useState } from "react";

type Field = { id: string; label: string; type: string; placeholder: string };

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-dark-black placeholder:text-neutral-400 focus:border-primary-gold focus:outline-none focus:ring-1 focus:ring-primary-gold";

type Status = "idle" | "submitting" | "success" | "error";

export default function ServiceLeadForm({
  fields,
  submitLabel,
  source = "Service Enquiry",
}: {
  fields: Field[];
  submitLabel: string;
  source?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-neutral-50 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-gold/10 text-xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-bold text-dark-black">Thank you for reaching out</h3>
        <p className="mt-2 text-sm text-neutral-500">
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
      className="grid grid-cols-1 gap-4 rounded-2xl bg-neutral-50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:grid-cols-3 sm:items-end sm:p-10"
    >
      {fields.map((field) => (
        <div key={field.id} className="sm:col-span-1">
          <label htmlFor={field.id} className="sr-only">
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required
            className={inputClass}
          />
        </div>
      ))}
      {status === "error" ? (
        <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-3">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-xl bg-gradient-to-br from-primary-gold to-secondary-gold px-6 py-3 font-bold uppercase tracking-[0.8px] text-[#111827] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-3"
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
