import type { CSSProperties } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

type JourneyStep = {
  year: string;
  title: string;
  description: string;
  icon?: string;
};

/* Pin geometry for the wide layout, as a percentage of the panel height: `node` is where
   the glowing trail passes, `badge` where the year sits above it. The gap between the two
   is what the text drops into, so it has to clear the tallest block in that column.
   Each step hands its pair to the stylesheet as custom properties. */
const pins = [
  { node: 52, badge: 24 },
  { node: 62, badge: 34 },
  { node: 72, badge: 43 },
  { node: 81, badge: 54 },
  { node: 90, badge: 54 },
];

/* The trail, drawn in a 1000x800 box stretched to the panel: a flat run under each
   pin, then a dip down to the next one. Node x values line up with the badge centres. */
const TRAIL =
  "M 0,404 C 8,412 12,416 24,416 C 95,416 135,494 213,496 C 300,498 330,574 401,576 C 485,578 515,646 590,648 C 672,650 702,716 779,720 C 865,722 930,738 1000,746";

/* A dark halo so the trail never cuts through a glyph where it passes behind a block. */
const HALO = "[text-shadow:0_1px_14px_rgba(0,0,0,0.95)]";

const delays = [0, 100, 200, 300, 400] as const;

/*
 * One list, two readings. Up to 1400px it is a plain vertical timeline; from there — the
 * width at which `.container` reaches 1320px and five columns stay legible — the items
 * become grid cells pinned along the trail, each sitting at its own `--badge` height.
 */
export default function JourneyTimeline({ steps }: { steps: JourneyStep[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-dark-black py-20 text-white">
      <Image
        src="/images/hero-skyline.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="-z-10 object-cover opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_80%_at_85%_65%,rgba(212,175,55,0.22),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-dark-black via-dark-black/65 to-dark-black"
      />

      <div className="container">
        <Reveal className="text-center">
          <p className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[4px] text-primary-gold/90">
            <span className="h-px w-14 bg-linear-to-r from-transparent to-primary-gold/60" />
            Our Path
            <span className="h-px w-14 bg-linear-to-l from-transparent to-primary-gold/60" />
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-white/95 sm:text-5xl min-[1400px]:text-7xl">
            The Journey of{" "}
            <em className="bg-linear-to-r from-[#f7ead0] via-primary-gold to-[#b8902a] bg-clip-text text-transparent">
              Excellence
            </em>
          </h2>
        </Reveal>

        <div className="relative mt-12 min-[1400px]:mt-0">
          <svg
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full min-[1400px]:block"
          >
            <path
              d={TRAIL}
              fill="none"
              stroke="#d4af37"
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.5}
              vectorEffect="non-scaling-stroke"
              style={{ filter: "blur(7px)" }}
            />
            <path
              d={TRAIL}
              fill="none"
              stroke="#f3dc93"
              strokeWidth={1.6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span
            aria-hidden="true"
            className="absolute inset-y-2 left-7 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-primary-gold/50 to-transparent min-[1400px]:hidden"
          />

          {/* The last column runs wider: its block carries the longest heading and copy. */}
          <ol className="relative mx-auto max-w-3xl space-y-10 min-[1400px]:grid min-[1400px]:h-[900px] min-[1400px]:max-w-none min-[1400px]:grid-cols-[1fr_1fr_1fr_1fr_1.3fr] min-[1400px]:space-y-0">
            {steps.map((step, index) => {
              const pin = pins[index] ?? pins[pins.length - 1];

              return (
                <Reveal
                  as="li"
                  key={step.year}
                  delay={delays[index] ?? 400}
                  className="relative"
                  style={
                    {
                      "--badge": `${pin.badge}%`,
                      "--node": `${pin.node}%`,
                    } as CSSProperties
                  }
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-8 hidden h-[calc(var(--node)_-_var(--badge)_-_64px)] w-px -translate-x-1/2 bg-linear-to-b from-primary-gold/70 to-primary-gold/25 top-[calc(var(--badge)_+_64px)] min-[1400px]:block"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-8 top-[var(--node)] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffeab0] shadow-[0_0_18px_6px_rgba(212,175,55,0.55)] min-[1400px]:block"
                  />

                  <div className="flex gap-5 min-[1400px]:absolute min-[1400px]:inset-x-0 min-[1400px]:top-[var(--badge)] min-[1400px]:gap-4 min-[1400px]:pr-6">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary-gold/80 bg-black/45 font-serif text-base text-primary-gold shadow-[0_0_28px_rgba(212,175,55,0.35)] backdrop-blur-[2px] min-[1400px]:h-16 min-[1400px]:w-16 min-[1400px]:text-lg ${HALO}`}
                    >
                      {step.year}
                    </span>
                    <div className="pt-1">
                      {step.icon ? (
                        <i
                          className={`${step.icon} text-lg text-primary-gold/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]`}
                          aria-hidden="true"
                        />
                      ) : null}
                      <h3
                        className={`mt-2 font-serif text-xl leading-tight text-white min-[1400px]:text-[22px] ${HALO}`}
                      >
                        {step.title}
                      </h3>
                      <p className={`mt-2 text-sm leading-relaxed text-white/75 ${HALO}`}>
                        {step.description}
                      </p>
                      <span
                        aria-hidden="true"
                        className="mt-3 block h-px w-10 bg-primary-gold/50"
                      />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
