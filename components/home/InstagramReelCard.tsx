"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useInView } from "@/hooks/useInView";
import type { InstagramReel } from "@/lib/types";

/**
 * A single reel: optimised poster frame, with the video autoplaying muted on
 * top of it once the card scrolls into view.
 *
 * Two separate interactions, which is why the root is a div rather than an
 * anchor — an <a> may not contain a <button>:
 *   - the stretched link over the whole card opens the post on instagram.com
 *   - the sound badge unmutes the video in place, without leaving the site
 *
 * Nothing is downloaded until the card is actually visible — `preload="none"`
 * plus a src that stays undefined until then — so three reels cost three lazy
 * images on page load, not three videos. Playback pauses again off-screen.
 *
 * The poster never unmounts. Every degraded path (autoplay blocked by the
 * browser, reduced-motion preference, data-saver on, expired CDN URL, missing
 * media_url) simply leaves the still image showing with a play badge on it.
 */
export default function InstagramReelCard({ reel }: { reel: InstagramReel }) {
  const [cardRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.35,
    once: false,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  /** Latches on first visibility so scrolling back up does not re-download. */
  const [hasLoadedVideo, setHasLoadedVideo] = useState(false);
  /** Resolved on the client only; assume allowed so the server render matches. */
  const [autoplayAllowed, setAutoplayAllowed] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Respect Data Saver / metered connections too — three autoplaying reels is
    // real bandwidth on mobile.
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    );
    const update = () => setAutoplayAllowed(!reduceMotion.matches && !saveData);
    update();
    reduceMotion.addEventListener("change", update);
    return () => reduceMotion.removeEventListener("change", update);
  }, []);

  const canPlay = Boolean(reel.videoUrl) && autoplayAllowed && !videoFailed;

  // Adjusting state during render rather than in an effect: this latch only ever
  // flips false -> true, so it converges on the same pass instead of costing an
  // extra render the way an effect would.
  if (canPlay && isInView && !hasLoadedVideo) {
    setHasLoadedVideo(true);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (canPlay && isInView) {
      // Rejects when the browser declines autoplay; `onPlaying` then simply
      // never fires and the poster frame stays put, which is the intended
      // fallback. Nothing to handle.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [canPlay, isInView]);

  // React does not reliably reflect the `muted` prop onto the element, so the
  // property is driven here instead. Autoplay starts muted because every
  // browser refuses anything else; the badge below is the user gesture that
  // earns sound.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    // The click is the user gesture, so unmuted playback is allowed from here.
    if (!nextMuted) void video.play().catch(() => {});
  }

  const kind = reel.isReel ? "Reel" : "Video";
  const description = reel.caption ?? `${kind} by ElitePro Infra on Instagram`;

  return (
    <div
      ref={cardRef}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-light-black transition-all duration-300 hover:-translate-y-1 hover:border-primary-gold/60 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
    >
      {thumbnailFailed ? (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-light-black to-dark-black">
          <i className="fab fa-instagram text-4xl text-white/25" aria-hidden="true" />
        </span>
      ) : (
        <Image
          src={reel.thumbnailUrl}
          alt={description}
          fill
          loading="lazy"
          sizes="(min-width: 768px) 33vw, 384px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setThumbnailFailed(true)}
        />
      )}

      {canPlay ? (
        <video
          ref={videoRef}
          src={hasLoadedVideo ? (reel.videoUrl ?? undefined) : undefined}
          muted
          loop
          playsInline
          preload="none"
          // Decorative: the link's aria-label and the poster's alt already
          // describe this card, so a screen reader should not meet it twice.
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setVideoFailed(true)}
          className={clsx(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            isPlaying ? "opacity-100" : "opacity-0"
          )}
        />
      ) : null}

      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
        <i className="fab fa-instagram" aria-hidden="true" />
        {kind}
      </span>

      {/* Only meaningful while the still frame is what you are looking at —
          it would read as a broken control sitting over a playing video. */}
      <span
        className={clsx(
          "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-gold group-hover:text-dark-black",
          isPlaying && "opacity-0"
        )}
      >
        <i className="fas fa-play translate-x-0.5 text-lg" aria-hidden="true" />
      </span>

      <span className="absolute inset-x-0 bottom-0 block p-4">
        {reel.caption ? (
          <span className="line-clamp-2 block text-sm leading-snug text-white/90">
            {reel.caption}
          </span>
        ) : null}
        {reel.postedOn ? (
          <span className="mt-1 block text-xs text-white/50">{reel.postedOn}</span>
        ) : null}
      </span>

      {/* Stretched link, above the artwork so a click anywhere on the card opens
          the post — but below the sound button, which needs the taps it gets. */}
      <a
        href={reel.permalink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on Instagram: ${description}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-gold"
      />

      {/* Sound lives in place: tapping here unmutes the reel on the page rather
          than sending the visitor off to Instagram for it. */}
      {isPlaying ? (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute this reel" : "Mute this reel"}
          className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-primary-gold hover:text-dark-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-black"
        >
          <i
            className={isMuted ? "fas fa-volume-xmark" : "fas fa-volume-high"}
            aria-hidden="true"
          />
          {isMuted ? "Tap for sound" : "Sound on"}
        </button>
      ) : null}
    </div>
  );
}
