"use client";

import Image from "next/image";
import { useState } from "react";
import AwardLightbox from "@/components/awards/AwardLightbox";

/** Live awards.php gallery: four 280px tiles per row with no card chrome; on hover the image
 *  scales 1.05 under an rgba(0,0,0,.5) overlay carrying a white zoom icon. */
export default function AwardsGrid({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View award ${index + 1} of ${images.length} enlarged`}
            className="group relative flex h-[280px] cursor-pointer items-center justify-center overflow-hidden"
          >
            <Image
              src={image}
              alt="Elite Pro Infraventure award recognition"
              width={300}
              height={280}
              sizes="(min-width: 992px) 25vw, (min-width: 768px) 33vw, (min-width: 576px) 50vw, 100vw"
              className="h-auto max-h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <i className="fas fa-search-plus text-3xl text-white" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      <AwardLightbox
        images={images}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}
