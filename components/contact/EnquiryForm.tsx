"use client";

import { useState } from "react";

/**
 * Live contact.php `#contactForm` inside `.form-container` (#f9f9f9, 50px padding, 10px radius,
 * 0 10px 40px rgba(0,0,0,.05)). Text inputs are the global `.form-control` (no border, 2px #eee
 * bottom border, gold on focus); selects are Bootstrap `.form-select` (white, #dee2e6 border).
 * Choosing an enquiry type swaps in that type's `.dynamic-fields` block, exactly as live does.
 */
const inputClass =
  "w-full rounded-none border-0 border-b-2 border-border-card bg-transparent px-0 py-[15px] text-dark-black placeholder:text-bs-muted focus:border-primary-gold focus:outline-none";

const selectClass =
  "w-full rounded-md border border-bs-border bg-white px-3 py-2.5 text-bs-dark focus:border-primary-gold focus:outline-none";

type EnquiryType = "general" | "buy" | "sell" | "lease" | "career" | "partner";

const enquiryTypes: { value: EnquiryType; label: string }[] = [
  { value: "general", label: "General Enquiry" },
  { value: "buy", label: "Buying / Investing" },
  { value: "sell", label: "Selling Property" },
  { value: "lease", label: "Leasing (Commercial/Retail)" },
  { value: "career", label: "Careers & Jobs" },
  { value: "partner", label: "Channel Partner / Associate" },
];

function Select({ name, options }: { name: string; options: string[] }) {
  return (
    <>
      <label htmlFor={name} className="sr-only">
        {options[0]}
      </label>
      <select id={name} name={name} defaultValue={options[0]} className={selectClass}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </>
  );
}

function Input({ name, placeholder, type = "text" }: { name: string; placeholder: string; type?: string }) {
  return (
    <>
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <input id={name} name={name} type={type} placeholder={placeholder} className={inputClass} />
    </>
  );
}

function DynamicFields({ type }: { type: EnquiryType }) {
  switch (type) {
    case "buy":
      return (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Select name="propertyType" options={["Property Type", "Residential Apartment", "Villa / Independent Floor", "Commercial Office", "Retail Shop", "SCO Plots"]} />
          </div>
          <div>
            <Select name="budget" options={["Budget Range", "₹ 1 Cr - 2 Cr", "₹ 2 Cr - 5 Cr", "₹ 5 Cr - 10 Cr", "₹ 10 Cr+"]} />
          </div>
          <div className="sm:col-span-2">
            <Select name="location" options={["Preferred Location", "Gurgaon", "Delhi", "Noida", "Mumbai", "Dubai"]} />
          </div>
        </div>
      );
    case "sell":
      return (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input name="propertyAddress" placeholder="Property Address / Location" />
          </div>
          <div>
            <Select name="sellPropertyType" options={["Property Type", "Residential", "Commercial", "Land / Plot"]} />
          </div>
          <div>
            <Input name="expectedPrice" placeholder="Expected Price" />
          </div>
        </div>
      );
    case "lease":
      return (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Select name="requirementType" options={["Requirement Type", "Office Space", "Retail Showroom", "Warehouse"]} />
          </div>
          <div>
            <Input name="areaRequired" placeholder="Area Required (sq. ft.)" />
          </div>
        </div>
      );
    case "career":
      return (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Select name="position" options={["Position Applied For", "Sales Manager", "Digital Marketing", "HR Executive", "Internship"]} />
          </div>
          <div>
            <label htmlFor="contact-resume" className="mb-2 block text-sm text-bs-muted">
              Upload Resume (PDF/Doc)
            </label>
            <input
              id="contact-resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className={`${selectClass} file:mr-3 file:border-0 file:bg-transparent file:text-bs-dark`}
            />
          </div>
          <div className="sm:col-span-2">
            <Input name="linkedin" placeholder="LinkedIn Profile URL (Optional)" />
          </div>
        </div>
      );
    case "partner":
      return (
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input name="companyName" placeholder="Company Name" />
          </div>
          <div>
            <Input name="reraId" placeholder="RERA ID" />
          </div>
          <div>
            <Input name="city" placeholder="City of Operation" />
          </div>
        </div>
      );
    default:
      return (
        <div className="mb-5">
          <Input name="subject" placeholder="Subject" />
        </div>
      );
  }
}

type Status = "idle" | "submitting" | "success" | "error";

export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState<EnquiryType>("general");

  if (status === "success") {
    return (
      <div className="rounded-[10px] bg-leader-profile p-8 text-center shadow-contact-form sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-gold/10 text-2xl text-primary-gold">
          <i className="fas fa-check" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-dark-black">Thank you for reaching out</h3>
        <p className="mt-2 text-muted">
          We&apos;ve received your enquiry and a member of our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-primary-gold hover:underline"
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
        const form = event.currentTarget;
        const data = new FormData(form);
        const fields: Record<string, string> = {
          Name: `${data.get("first-name")} ${data.get("last-name")}`.trim(),
          Email: String(data.get("email") ?? ""),
          Phone: String(data.get("mobile") ?? ""),
          "Enquiry Type": enquiryTypes.find((t) => t.value === type)?.label ?? type,
          Message: String(data.get("message") ?? ""),
        };
        // Everything the active dynamic block collected, minus the file input.
        data.forEach((value, key) => {
          if (typeof value === "string" && value && !(key in fields) && !["first-name", "last-name", "email", "mobile", "message", "company-website", "consent"].includes(key)) {
            fields[key] = value;
          }
        });
        try {
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: "Contact Page", honeypot: data.get("company-website"), fields }),
          });
          if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
          setStatus("success");
        } catch (error) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        }
      }}
      className="h-full rounded-[10px] bg-leader-profile p-8 shadow-contact-form sm:p-[50px]"
    >
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="company-website">Leave this field empty</label>
        <input id="company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mb-6">
        <label htmlFor="enquiry-type" className="mb-2 block text-xs font-bold uppercase tracking-wide text-bs-muted">
          I am interested in:
        </label>
        <select
          id="enquiry-type"
          name="enquiry-type"
          value={type}
          onChange={(event) => setType(event.target.value as EnquiryType)}
          className={`${selectClass} px-4 py-3 text-lg`}
        >
          {enquiryTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="sr-only">First Name</label>
          <input id="first-name" name="first-name" type="text" placeholder="First Name *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="last-name" className="sr-only">Last Name</label>
          <input id="last-name" name="last-name" type="text" placeholder="Last Name *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="mobile" className="sr-only">Mobile Number</label>
          <input id="mobile" name="mobile" type="tel" placeholder="Mobile Number *" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email Address</label>
          <input id="email" name="email" type="email" placeholder="Email Address *" required className={inputClass} />
        </div>
      </div>

      <DynamicFields type={type} />

      <div className="mb-5">
        <label htmlFor="message" className="sr-only">Message</label>
        <textarea id="message" name="message" rows={4} placeholder="Your Message / Additional Details" className={inputClass} />
      </div>

      <div className="mb-6 flex items-start gap-3">
        <input id="consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-bs-border text-primary-gold focus:ring-primary-gold" />
        <label htmlFor="consent" className="text-sm text-bs-muted">
          I authorize Elite Pro Infra to contact me via Email, SMS, or Call.
        </label>
      </div>

      {status === "error" ? (
        <p role="alert" className="mb-4 text-sm font-semibold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl border border-black/[0.08] bg-gold-gradient py-3.5 font-bold uppercase tracking-[0.8px] text-ink shadow-btn-gold transition-all hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
