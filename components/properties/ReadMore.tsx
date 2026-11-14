"use client";

import { useState } from "react";

/** Long description text, clamped to a few lines until the visitor asks for the rest. */
export default function ReadMore({ text, limit = 420 }: { text: string; limit?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;

  return (
    <div>
      <p className="whitespace-pre-line leading-[1.9] text-muted-2">
        {open || !long ? text : `${text.slice(0, limit).trimEnd()}…`}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-secondary-gold hover:text-dark-black"
        >
          {open ? "Show less" : "Read more"}
          <i className={`fas fa-chevron-${open ? "up" : "down"} text-xs`} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
