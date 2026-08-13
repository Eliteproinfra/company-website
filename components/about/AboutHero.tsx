const TILE_TEXT = "ALL IN ONE PLACE";

const rows = [
  { size: "text-2xl sm:text-4xl", reverse: false, opacity: "opacity-[0.05]" },
  { size: "text-xl sm:text-3xl", reverse: true, opacity: "opacity-[0.06]" },
  { size: "text-3xl sm:text-5xl", reverse: false, opacity: "opacity-[0.07]" },
  { size: "text-xl sm:text-3xl", reverse: true, opacity: "opacity-[0.06]" },
  { size: "text-2xl sm:text-4xl", reverse: false, opacity: "opacity-[0.05]" },
];

export default function AboutHero() {
  return (
    <section className="relative flex h-[70vh] min-h-[480px] items-center justify-center overflow-hidden bg-dark-black text-white sm:h-[85vh]">
      {/* Tiled, slow-scrolling background rows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-around select-none">
        {rows.map((row, index) => (
          <div key={index} className="overflow-hidden">
            <div
              className={`flex w-max shrink-0 gap-16 whitespace-nowrap font-serif font-bold uppercase tracking-widest text-white ${row.size} ${row.opacity} ${
                row.reverse ? "animate-marquee-reverse" : "animate-marquee"
              }`}
            >
              {Array.from({ length: 2 }).map((_, group) => (
                <span key={group} className="flex shrink-0 gap-16">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i}>{TILE_TEXT}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Center glow + vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      <h1 className="relative z-10 px-4 text-center font-serif text-4xl font-bold uppercase tracking-[0.06em] sm:text-6xl lg:text-7xl">
        <span className="animate-shine bg-[linear-gradient(110deg,#ffffff33_40%,#ffffff_50%,#ffffff33_60%)] bg-[length:250%_100%] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(255,255,255,0.15)]">
          All In One Place
        </span>
      </h1>
    </section>
  );
}
