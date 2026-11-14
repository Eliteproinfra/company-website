"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

/**
 * Mosaic gallery: one large frame on the left and up to four tiles on the
 * right. Clicking a tile puts it in the large frame; the arrows step through
 * every photo, including ones that don't get a tile. When there are more
 * photos than tiles, the last tile shows how many are left.
 */
export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  const tiles = images.slice(0, 4);
  const hidden = images.length - tiles.length;
  const step = (delta: number) =>
    setActive((current) => (current + delta + images.length) % images.length);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="group relative h-[280px] overflow-hidden rounded-2xl bg-neutral-100 sm:h-[380px] lg:h-[460px]">
        {/* `loading="eager"` + `fetchPriority="high"` rather than `preload`:
            `main` changes when a tile is picked, and preloading inserts a
            <link> per src, so clicking through would pile up preloads for
            images already on screen. */}
        {main ? (
          <Image
            key={main}
            src={main}
            alt={title}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="animate-fade-in object-cover"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/50 to-transparent" />

        {images.length > 1 ? (
          <>
            <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <i className="fas fa-camera mr-1.5" aria-hidden="true" />
              {active + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark-black shadow-lg transition hover:bg-primary-gold lg:opacity-0 lg:group-hover:opacity-100"
            >
              <i className="fas fa-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark-black shadow-lg transition hover:bg-primary-gold lg:opacity-0 lg:group-hover:opacity-100"
            >
              <i className="fas fa-chevron-right" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 lg:grid-rows-2">
          {tiles.map((image, index) => {
            const isLast = index === tiles.length - 1 && hidden > 0;
            return (
              <button
                key={image}
                type="button"
                onClick={() => setActive(isLast ? tiles.length : index)}
                aria-label={isLast ? `Show ${hidden} more photos` : `Photo ${index + 1}`}
                aria-current={index === active}
                className={clsx(
                  "group relative h-[72px] overflow-hidden rounded-xl bg-neutral-100 sm:h-[100px] lg:h-full",
                  index === active
                    ? "ring-2 ring-primary-gold ring-offset-2"
                    : "opacity-90 hover:opacity-100"
                )}
              >
                <Image
                  src={image}
                  alt={`${title} — photo ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 16vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isLast ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white sm:text-lg">
                    +{hidden} Photos
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
