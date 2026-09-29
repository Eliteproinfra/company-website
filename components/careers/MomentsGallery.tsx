"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Moment = { image: string; caption: string; description: string };

/**
 * Live life-at-elite.php `.moments-grid`: two columns of 260px `.event-item`s (8px radius);
 * the image scales 1.1 and a black->transparent overlay with the caption slides up on hover.
 * Clicking opens the photo in a zoom modal (live `#momentsZoomModal`).
 */
export default function MomentsGallery({ items }: { items: Moment[] }) {
  const [zoom, setZoom] = useState<Moment | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setZoom(null);
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [zoom]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.image}
            type="button"
            onClick={() => setZoom(item)}
            aria-label={`Open ${item.caption}`}
            className="group relative h-[210px] overflow-hidden rounded-lg text-left md:h-[260px]"
          >
            <Image
              src={item.image}
              alt={item.caption}
              fill
              sizes="50vw"
              className="object-cover transition-transform duration-[800ms] group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 translate-y-5 bg-linear-to-t from-black/90 to-transparent p-[18px] text-white opacity-0 transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100">
              <h4 className="text-base font-bold">{item.caption}</h4>
            </div>
          </button>
        ))}
      </div>

      {zoom ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.caption}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            onClick={() => setZoom(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white"
          >
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
          <Image
            src={zoom.image}
            alt={zoom.caption}
            width={1400}
            height={1000}
            className="max-h-[82vh] w-auto rounded-lg shadow-bs"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
