const VIDEO_SRC = "/videos/elite-pro-promo.mp4";

export default function AboutHero() {
  // Full viewport height: the navbar is `fixed`, so it floats over the video rather than
  // stealing height from it. `dvh` keeps the hero from being cropped by mobile browser
  // chrome, with `100vh` as the fallback where it is unsupported.
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-dark-black text-white supports-[height:100dvh]:h-dvh">
      {/* The promo reel replaces the tiled "ALL IN ONE PLACE" marquee that used to fill this
          hero. It is a title sequence that animates that line itself and ends on the logo,
          so no copy is drawn over it. Autoplay only survives browser policy when the video
          is muted, and iOS Safari additionally needs playsInline or it opens fullscreen. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-contain motion-reduce:hidden lg:object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* A light vignette only: the footage is already dark and its own type must stay crisp. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45 motion-reduce:hidden" />

      {/* The page still needs its heading; it is only drawn when the video is suppressed
          for a reduced-motion preference, which would otherwise leave an empty black box. */}
      <h1 className="sr-only px-4 text-center font-serif text-4xl font-bold uppercase tracking-[0.06em] motion-reduce:not-sr-only motion-reduce:relative motion-reduce:z-10 sm:text-6xl lg:text-7xl">
        {/* Without the sweep the gradient freezes at its 20%-white end stop and the words
            all but vanish, so reduced motion gets flat white type instead. */}
        <span className="bg-[linear-gradient(110deg,#ffffff33_40%,#ffffff_50%,#ffffff33_60%)] bg-[length:250%_100%] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(255,255,255,0.15)] motion-safe:animate-shine motion-reduce:bg-none motion-reduce:text-white">
          All In One Place
        </span>
      </h1>
    </section>
  );
}
