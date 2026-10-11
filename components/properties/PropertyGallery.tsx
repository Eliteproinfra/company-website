"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <div className="relative h-[260px] overflow-hidden rounded-xl bg-neutral-100 lg:h-[360px]">
          {/* `loading="eager"` + `fetchPriority="high"` rather than the
              deprecated `priority` (Next 16 replaced it with `preload`), and
              deliberately not `preload` either: `main` changes when a thumbnail
              is picked, and preloading inserts a <link> in the head for each
              src, so a visitor clicking through the gallery would accumulate
              preloads for images already on screen. The image docs recommend
              these two for that reason. The first frame is still the LCP
              element and still loads eagerly at high priority. */}
          {main ? (
            <Image
              src={main}
              alt={title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-2 gap-2.5 self-start">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Photo ${index + 1}`}
              aria-current={index === active}
              className={clsx(
                "relative h-[86px] overflow-hidden rounded-xl border border-black/[0.06] bg-neutral-100",
                index === active && "outline outline-2 outline-offset-1 outline-primary-gold"
              )}
            >
              <Image
                src={image}
                alt={`${title} — photo ${index + 1}`}
                fill
                sizes="180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
