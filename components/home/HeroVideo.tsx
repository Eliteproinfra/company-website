import clsx from "clsx";
import Button from "@/components/ui/Button";

type HeroVideoProps = {
  src: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  showCta?: boolean;
  align?: "center" | "left";
  /** Still shown in the video's box until the first frame paints. */
  poster?: string;
};

/**
 * Replaces the old `.hero-carousel` with a single muted, looping background video.
 * The caption keeps the live site's hero type scale (h5 `.text-gold`, h1 white,
 * p `.text-white-50`); unlike the image hero it sits over a soft bottom-up scrim,
 * because moving footage underneath makes plain white copy hard to read.
 */
export default function HeroVideo({
  src,
  eyebrow,
  heading,
  subheading,
  showCta,
  align = "left",
  poster,
}: HeroVideoProps) {
  // Full viewport height: the navbar is `fixed`, so it floats over the video rather
  // than stealing height from it. `dvh` keeps the hero from being cropped by mobile
  // browser chrome, with `100vh` as the fallback where it is unsupported.
  return (
    <section className="relative h-screen w-full overflow-hidden bg-dark-black supports-[height:100dvh]:h-dvh">
      <video
        // Autoplay only survives browser policy when the video is muted, and iOS
        // Safari additionally needs playsInline or it opens fullscreen.
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Two scrims keep the caption legible over the footage's bright sky without
          flattening it: a flat wash over the whole frame, then a heavier left-to-right
          ramp behind the copy, leaving the right of the skyline clear. */}
      <div aria-hidden="true" className="absolute inset-0 bg-dark-black/40" />
      <div
        aria-hidden="true"
        className={clsx(
          "absolute inset-0",
          align === "left"
            ? "bg-gradient-to-r from-dark-black/80 via-dark-black/45 to-transparent"
            : "bg-gradient-to-t from-dark-black/75 via-dark-black/35 to-dark-black/45"
        )}
      />

      <div
        className={clsx(
          "relative z-10 flex h-full items-center px-6 text-white",
          align === "left" ? "justify-start text-left" : "justify-center text-center"
        )}
      >
        <div className="container animate-fade-in-up">
          {eyebrow ? (
            <p className="mb-3 text-[0.95rem] uppercase tracking-[2px] text-primary-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{heading}</h1>
          {/* Live uses `.text-white-50`; over moving footage that reads as noise, so this
              sits at 80% instead. */}
          {subheading ? (
            <p className="mt-5 max-w-3xl text-lg font-light text-white/80 sm:text-xl">
              {subheading}
            </p>
          ) : null}
          {showCta ? (
            <div
              className={clsx(
                "mt-8 flex flex-wrap items-center gap-4",
                align === "left" ? "justify-start" : "justify-center"
              )}
            >
              <Button href="/properties">Explore Properties</Button>
              <Button href="/contact" variant="outline">
                Get in Touch
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
