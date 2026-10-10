import Image from "next/image";
import clsx from "clsx";
import type { FittedProjection, ProjectedPoint } from "@/lib/maps";
import type { MapAnnotation, PresenceMarker } from "@/lib/types";

type LabelMode = "always" | "hover";

/** A marker with its spot on the artwork worked out, as a percentage of it. */
type PlacedMarker = PresenceMarker & { x: number; y: number };

type PresenceMapProps = {
  /** Which generated map this is; also supplies the viewBox the pins sit in. */
  projection: FittedProjection;
  /** A file under public/images/maps, drawn by scripts/generate-maps.mjs. */
  src: string;
  alt: string;
  markers: PresenceMarker[];
  /**
   * "always" keeps every label on screen — right for the three world markets,
   * though even they need a wide enough column, so the labels drop out below
   * lg. "hover" reveals a label on pointer-over, which is the only way two
   * dozen Indian cities fit without the labels stacking on top of each other.
   *
   * Either way the names also belong in the card's copy as plain text, which
   * is what touch screens, screen readers and crawlers actually get.
   */
  labels: LabelMode;
  /**
   * Draws a travelling gold arc from the hub to every other marker. Reads as
   * reach on the world map's three markets; on two dozen Indian cities it
   * would just be a gold scribble, so that map leaves it off.
   */
  connect?: boolean;
  /** Neighbouring countries and seas, lettered onto the map. */
  annotations?: MapAnnotation[];
  /**
   * Where the night panel stops.
   *
   * "frame" lets it fill the slot: right for the world map, whose artwork is
   * land floating in transparent ocean, so a panel taller than the picture
   * just reads as more sea. "artwork" clips it to the picture, which the India
   * map needs — its land runs right to the edge of the viewBox, and any panel
   * wider than that shows a hard rectangular seam where the land stops.
   */
  panel?: "frame" | "artwork";
  className?: string;
};

const PANEL = "overflow-hidden rounded-xl bg-map-panel ring-1 ring-primary-gold/20";

/**
 * Height of the box each map is centred in. The artwork's own width follows
 * from its aspect ratio and is capped at the column, so portrait India and a
 * letterbox world map fill the same slot — which is what keeps the two cards'
 * headings on the same line instead of one floating half a card above the
 * other.
 */
const FRAME_HEIGHT = "clamp(250px, 36vw, 450px)";

/**
 * A quadratic curve between two points on the artwork, bowed upwards by a
 * share of its own length so a short hop and a long one look of a piece.
 */
function arcPath(from: ProjectedPoint, to: ProjectedPoint) {
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.22;
  const controlX = (from.x + to.x) / 2;
  const controlY = (from.y + to.y) / 2 - lift;
  return `M${from.x} ${from.y}Q${controlX} ${controlY} ${to.x} ${to.y}`;
}

/**
 * The arcs, as one overlay drawn in the artwork's own coordinates. Same viewBox
 * and same fit as the `<Image>` underneath it, so the curves land on the pins.
 */
function ConnectionArcs({
  projection,
  markers,
}: {
  projection: FittedProjection;
  markers: PresenceMarker[];
}) {
  const hub = markers.find((marker) => marker.kind === "hub");
  if (!hub) return null;
  const origin = projection.project(hub.lng, hub.lat);
  const routes = markers
    .filter((marker) => marker !== hub)
    .map((marker) => ({
      name: marker.name,
      d: arcPath(origin, projection.project(marker.lng, marker.lat)),
    }));

  return (
    <svg
      viewBox={`0 0 ${projection.width} ${projection.height}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="arc-glow" x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      {/* A soft bed of light under the route, then the crisp line, then dashes
          running along it — the same three passes the coastline gets. */}
      <g fill="none" stroke="#d4af37" strokeLinecap="round">
        <g strokeOpacity={0.55} strokeWidth={3} filter="url(#arc-glow)">
          {routes.map((route) => (
            <path key={route.name} d={route.d} />
          ))}
        </g>
        <g strokeOpacity={0.45} strokeWidth={1.1}>
          {routes.map((route) => (
            <path key={route.name} d={route.d} />
          ))}
        </g>
        <g
          stroke="#ffe3a0"
          strokeWidth={2}
          strokeDasharray="6 7"
          className="animate-map-arc motion-reduce:animate-none"
        >
          {routes.map((route) => (
            <path key={route.name} d={route.d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/**
 * The gold teardrop with a building in it and rings spreading from its foot.
 * Stands about 26px tall, which is why only the hub and the three world
 * markets get one — two dozen of these would bury the India map.
 */
function BadgePin() {
  return (
    <span className="relative block">
      {/* The pin's point lands on the bottom of this box, so the rings and the
          bloom are hung there. Squashed on the y axis, which reads as rings
          lying on the ground rather than a target painted over it. */}
      <span className="absolute bottom-0 left-1/2 size-0 scale-y-[0.45]" aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-gold/20" />
        <span className="absolute left-1/2 top-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-gold/35" />
        <span className="absolute left-1/2 top-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-primary-gold/60 motion-reduce:animate-none" />
      </span>
      <span
        className="absolute bottom-0 left-1/2 size-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-gold/50 blur-[5px]"
        aria-hidden="true"
      />
      {/* location-pin, not location-dot: the latter is a ring, and the icon
          inside it would be sitting on the map rather than on the pin. */}
      <i
        className="fas fa-location-pin relative block text-[26px] leading-none text-primary-gold drop-shadow-[0_0_9px_rgb(212_175_55/0.75)]"
        aria-hidden="true"
      />
      <i
        className="fas fa-building absolute left-1/2 top-[6px] -translate-x-1/2 text-[9px] text-dark-black"
        aria-hidden="true"
      />
    </span>
  );
}

function Pin({ marker, labels }: { marker: PlacedMarker; labels: LabelMode }) {
  const badge = labels === "always" || marker.kind === "hub";
  // A badge pin has earned a standing label; the city dots reveal theirs on
  // hover, or the India map would be a wall of chips.
  const pinned = badge;
  const labelSide = marker.labelSide ?? "right";

  return (
    <span
      className={clsx(
        // pointer-events-none so the pin never blocks the pin behind it; the
        // hit area below opts itself back in.
        "group pointer-events-none absolute hover:z-10",
        // A pin points at the ground beneath it; a light sits on the spot.
        badge ? "-translate-x-1/2 -translate-y-full" : "-translate-x-1/2 -translate-y-1/2"
      )}
      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
    >
      {badge ? (
        <BadgePin />
      ) : (
        <span className="relative block">
          {/* A halo ring, so an operating city is distinguishable from the
              city lights of the map it is standing on. */}
          <span
            className="absolute left-1/2 top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-gold/30"
            aria-hidden="true"
          />
          <span
            className="block size-[7px] rounded-full bg-primary-gold shadow-[0_0_9px_rgb(212_175_55/0.95)] transition-transform duration-200 group-hover:scale-150"
            aria-hidden="true"
          />
          {/* A 7px dot is a hard thing to point at; this widens the target. */}
          <span
            className="pointer-events-auto absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
        </span>
      )}

      <span
        className={clsx(
          // Smoked glass rather than a white chip: a white box on the dark
          // panel punches a hole in it and pulls focus off the pins.
          "pointer-events-none absolute whitespace-nowrap rounded-md bg-dark-black/80 px-1.5 py-[3px] text-center shadow-bs backdrop-blur-sm ring-1 ring-primary-gold/30",
          pinned
            ? clsx(
                // The world map's three labels need a label's width of clear
                // space either side of a pin, which the column only has at lg
                // and up. A lone HQ chip always fits.
                labels === "always" ? "hidden lg:block" : "block",
                labelSide === "below"
                  ? "left-1/2 top-full mt-1 -translate-x-1/2"
                  : clsx(
                      "top-1/2 -translate-y-1/2",
                      labelSide === "left" ? "right-full mr-2" : "left-full ml-2"
                    )
              )
            : "bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        )}
      >
        <span className="block text-[10px] font-bold leading-tight text-white">{marker.name}</span>
        {marker.note && (
          <span className="block text-[9px] leading-tight text-text-gray">{marker.note}</span>
        )}
      </span>
    </span>
  );
}

/**
 * A footprint map: generated vector artwork with the pins laid over it in HTML.
 *
 * NOT CURRENTLY RENDERED. The home page's "Nationwide & Global Reach" section
 * ships the supplied 16:9 artwork in lib/data/presence.ts instead, so this
 * component, PresenceCard, lib/maps, scripts/generate-maps.mjs (`npm run
 * maps:generate`), the generated SVGs in public/images/maps/ and the
 * indiaPresence/globalPresence marker data are all kept but unwired. They are
 * the alternative: maps whose pins are projected from real coordinates, so the
 * offices can be moved in data rather than redrawn. Delete the set together if
 * that is settled against.
 *
 * Keeping the pins out of the SVG is deliberate. The artwork stays a plain,
 * separately cached file, while the labels are real text that inherits the
 * site's font, scales with the user's text size and can be restyled without
 * regenerating anything. The two line up because both sides project through
 * lib/maps — see the note at the top of scripts/generate-maps.mjs.
 */
export default function PresenceMap({
  projection,
  src,
  alt,
  markers,
  labels,
  connect = false,
  annotations = [],
  panel = "frame",
  className,
}: PresenceMapProps) {
  const placed: PlacedMarker[] = markers.map((marker) => ({
    ...marker,
    ...projection.projectToPercent(marker.lng, marker.lat),
  }));

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        panel === "frame" && PANEL,
        className
      )}
      style={{ height: FRAME_HEIGHT }}
    >
      <div
        className={clsx("relative", panel === "artwork" && PANEL)}
        style={{
          aspectRatio: `${projection.width} / ${projection.height}`,
          width: `min(100%, calc(${FRAME_HEIGHT} * ${projection.width / projection.height}))`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          // SVG is already as small as it is going to get, and the optimizer
          // refuses it anyway unless `dangerouslyAllowSVG` is turned on.
          unoptimized
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-contain"
        />
        {/* Lettering first: the pins and their labels belong over the top of
            it, never the other way round. Held back until lg, where the map is
            finally wide enough for 8px letterspaced caps to be legible. */}
        {annotations.map((note) => {
          const { x, y } = projection.projectToPercent(note.lng, note.lat);
          return (
            <span
              key={note.text}
              className={clsx(
                "pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 text-center text-[8px] uppercase leading-[1.4] lg:block",
                note.kind === "water"
                  ? "max-w-[66px] tracking-[0.2em] text-white/30"
                  : "font-semibold tracking-[0.14em] text-white/45"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {note.text}
            </span>
          );
        })}
        {connect && <ConnectionArcs projection={projection} markers={markers} />}
        {placed.map((marker) => (
          <Pin key={marker.name} marker={marker} labels={labels} />
        ))}
        {/*
          Every pin label on these maps is visual only: the dense map reveals
          one on hover, and the other hides its labels until the column is wide
          enough. Nothing on the page writes the places out any more, so this is
          what a screen reader, a phone's accessibility tree and a crawler get.
          It belongs here rather than in `alt`, which should describe the
          picture, not recite two dozen names.
        */}
        <ul className="sr-only">
          {markers.map((marker) => (
            <li key={marker.name}>
              {marker.note ? `${marker.name} — ${marker.note}` : marker.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
