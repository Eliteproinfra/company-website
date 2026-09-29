"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

type AwardLightboxProps = {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function AwardLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: AwardLightboxProps) {
  const open = index !== null;

  const step = useCallback(
    (direction: 1 | -1) => {
      if (index === null || images.length === 0) return;
      onIndexChange((index + direction + images.length) % images.length);
    },
    [images.length, index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open, step]);

  if (index === null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Award image viewer"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close award viewer"
        autoFocus
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-primary-gold hover:text-black sm:right-6 sm:top-6"
      >
        <i className="fas fa-xmark text-xl" aria-hidden="true" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Previous award"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-primary-gold hover:text-black sm:left-6"
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Next award"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-primary-gold hover:text-black sm:right-6"
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </>
      )}

      <div
        className="relative h-[78vh] w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`Elite Pro Infraventure award recognition ${index + 1} of ${images.length}`}
          fill
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-contain"
        />
      </div>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
