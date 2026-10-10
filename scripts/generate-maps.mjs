#!/usr/bin/env node
/**
 * Draws the two footprint maps on the home page as real vector artwork.
 *
 *   npm run maps:generate
 *
 * Writes:
 *   public/images/maps/india.svg   36 states and union territories
 *   public/images/maps/world.svg   world countries, our three markets picked out
 *   lib/maps/fits.generated.ts     the viewBox each one was drawn into
 *
 * All three are committed. This script only needs re-running when the source
 * boundaries or the styling below change — the site never runs it, and the
 * network fetches here never happen during `next build`.
 *
 * WHY A GENERATOR AND NOT A MAP LIBRARY
 * The page needs two static pictures, not a pannable slippy map. Projecting the
 * boundaries once at build time keeps react-simple-maps, d3-geo, topojson and a
 * megabyte of TopoJSON out of the bundle, and leaves behind two plain SVG files
 * the browser caches on its own. The projections live in lib/maps/projections.ts
 * so that the pin overlay at runtime can place markers in the very same space.
 *
 * ON THE INDIA BOUNDARY
 * Natural Earth draws India along de-facto lines of control, which leaves out
 * Pakistan-administered Kashmir and Aksai Chin — a depiction that is incorrect
 * in India and legally fraught to publish there. So India is NOT taken from the
 * world dataset. It comes from india-maps-data, which follows the Survey of
 * India depiction (northern tip at 37.08°N, Arunachal Pradesh, Andaman and
 * Nicobar and Lakshadweep all included), and on the world map it is drawn last
 * so it covers the neighbouring Natural Earth polygons rather than being
 * trimmed by them.
 *
 * Sources (both public domain / CC0-equivalent, see SOURCES below).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  INDIA_RAW_PROJECTION,
  WORLD_RAW_PROJECTION,
} from "@/lib/maps/projections";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(projectRoot, "scripts", ".map-cache");
const outputDir = join(projectRoot, "public", "images", "maps");

const SOURCES = {
  // Census 2011 district boundaries dissolved to states, on the official
  // Survey of India outline. MIT licensed.
  india: {
    url: "https://raw.githubusercontent.com/udit-001/india-maps-data/main/topojson/india.json",
    file: "india-states.topo.json",
  },
  // Natural Earth 1:110m admin-0, repackaged as TopoJSON. Public domain. The
  // 50m edition is also published, but at the width this map is drawn its extra
  // detail is sub-pixel and it quadruples the file.
  world: {
    url: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    file: "world-countries-110m.topo.json",
  },
  // Natural Earth 1:10m populated places — 7,342 real cities with populations.
  // These are the "city lights" scattered over the land; they are actual towns
  // in their actual places, not decorative noise.
  places: {
    url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson",
    file: "ne-10m-populated-places.geojson",
  },
};

/* ---------------------------------------------------------------- styling */

/**
 * The maps are drawn as the earth at night: deep navy land, a coastline lit in
 * gold, and real cities glowing on top of it. Picked against `bg-map-panel` in
 * app/globals.css — change one and you have to change the other.
 */
const PALETTE = {
  /** Landmass: deep navy, a shade off the panel it sits on. */
  land: "#0f1e38",
  /** Internal borders — states, neighbouring countries — cool and dim. */
  internalBorder: "#4a6fa8",
  /**
   * The countries around India on its card. Darker than India itself and
   * barely edged, so the eye reads one lit country surrounded by land rather
   * than a cut-out floating in the sea.
   */
  neighbour: "#091123",
  neighbourBorder: "#1b2d4e",
  /** The lit coastline. This is the line the glow filter is hung on. */
  coast: "#f3c65d",
  /** Markets we work in: land warmed towards gold so it sits forward. */
  highlight: "#3a2f14",
  /** City lights. Radius and opacity come from the tiers below. */
  light: "#ffd27a",
};

/**
 * How big and how bright a city's light is, by population. Smallest first; a
 * place takes the last tier whose `from` it clears.
 */
const LIGHT_TIERS = [
  { from: 0, radius: 1.5, opacity: 0.45 },
  { from: 500_000, radius: 2.1, opacity: 0.65 },
  { from: 1_500_000, radius: 2.9, opacity: 0.8 },
  { from: 5_000_000, radius: 3.8, opacity: 0.95 },
];

/**
 * Smallest city drawn on each map. India takes every town Natural Earth knows
 * of, because the whole card is one country and it should look inhabited. The
 * world at that threshold would be a solid sheet of light — and 7,000 circles
 * of file — so it keeps only the places still distinguishable at its scale.
 */
const MIN_POPULATION = { india: 0, world: 400_000, neighbours: 300_000 };

/**
 * How far around India to draw its neighbours, in degrees. The outer pair is a
 * sanity bound on which source rings are even considered: Lambert conformal
 * conic is only meaningful near its central meridian, and a ring from the far
 * side of the world wraps around the cone's apex into nonsense. The viewBox
 * crops whatever of the rest falls outside the card.
 */
const INDIA_NEIGHBOURHOOD = { west: 20, east: 150, south: -25, north: 60 };

/** Countries picked out on the world map, by Natural Earth numeric id. */
const HIGHLIGHT_COUNTRY_IDS = new Set([
  "784", // United Arab Emirates
  "702", // Singapore
]);

/** Widths in SVG user units; the files scale to whatever the layout gives them. */
const INDIA_WIDTH = 760;
const WORLD_WIDTH = 1200;
/** Breathing room around the artwork so strokes are not clipped by the viewBox. */
const PADDING = 6;
/** Widest-to-tallest the India card is allowed to be; see fitToWidth. */
const INDIA_MIN_ASPECT = 1.25;

/**
 * How finely each map is drawn, in SVG user units: the Douglas-Peucker
 * `tolerance`, the `minArea` under which a ring has no shape worth drawing, and
 * what to do with those — see shapeToPath for `tinyRings` and `speckRadius`.
 *
 * India is drawn 760 units wide but renders about 350px wide (it is the taller
 * map, so the frame height is what bounds it), and the world is drawn 1200 and
 * renders about 620px. Both are therefore shrunk roughly 2:1, which is what
 * lets these thresholds take the India source from 4MB of district detail down
 * to a few tens of kilobytes with nothing visibly lost.
 */
const INDIA_DETAIL = { tolerance: 0.45, minArea: 2, tinyRings: "speck", speckRadius: 2 };
const WORLD_DETAIL = { tolerance: 0.55, minArea: 0.6, tinyRings: "drop" };

/**
 * Lakshadweep, by hand, because the source does not have it.
 *
 * india-maps-data is derived from the Census district boundaries, and its
 * Lakshadweep is a single triangle around Minicoy — the whole northern
 * archipelago is absent. A map of India has to show its island territories, so
 * the inhabited islands are listed here as [lng, lat] and drawn as specks, the
 * way an atlas renders them at this scale. Minicoy is included too; it doubles
 * up with the source's triangle, which is far too small to see either way.
 */
const LAKSHADWEEP_ISLANDS = [
  [72.705, 11.695], // Chetlat
  [72.1833, 11.6], // Bitra
  [73.0, 11.4833], // Kiltan
  [72.7833, 11.2167], // Kadmat
  [72.7333, 11.12], // Amini
  [72.2833, 10.9333], // Bangaram
  [72.1833, 10.85], // Agatti
  [73.6833, 10.8167], // Andrott
  [72.642, 10.5669], // Kavaratti
  [73.65, 10.0667], // Kalpeni
  [73.05, 8.2833], // Minicoy
];

/* ------------------------------------------------------------- topojson */

/** Expands TopoJSON's quantized delta encoding back into [lng, lat] pairs. */
function decodeArcs(topology) {
  const transform = topology.transform;
  return topology.arcs.map((arc) => {
    if (!transform) return arc.map(([x, y]) => [x, y]);
    const [scaleX, scaleY] = transform.scale;
    const [translateX, translateY] = transform.translate;
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scaleX + translateX, y * scaleY + translateY];
    });
  });
}

/** A negative arc index means "this arc, walked backwards". */
function arcPoints(arcs, index) {
  return index < 0 ? arcs[~index].slice().reverse() : arcs[index];
}

/** Every polygon of a geometry as ring-of-arc-indices, Polygon or Multi alike. */
function polygonsOf(geometry) {
  if (geometry.type === "Polygon") return [geometry.arcs];
  if (geometry.type === "MultiPolygon") return geometry.arcs;
  return [];
}

function ringToCoordinates(arcs, ring) {
  const points = [];
  for (const index of ring) {
    const segment = arcPoints(arcs, index);
    // Consecutive arcs share their joining vertex; drop the repeat.
    points.push(...(points.length ? segment.slice(1) : segment));
  }
  return points;
}

/**
 * Dissolves a set of geometries into their shared outline.
 *
 * Because TopoJSON stores each boundary once and references it from both sides,
 * an arc used in one direction by one polygon and the other direction by its
 * neighbour is an interior border; everything left over is the outer edge. The
 * survivors are then walked end-to-start into closed rings. This is what turns
 * 36 states into one national outline without any polygon-clipping library.
 */
function dissolve(arcs, geometries) {
  const usage = new Map();
  const forEachRing = (visit) => {
    for (const geometry of geometries) {
      for (const polygon of polygonsOf(geometry)) {
        for (const ring of polygon) visit(ring);
      }
    }
  };

  forEachRing((ring) => {
    for (const index of ring) {
      const key = index < 0 ? ~index : index;
      const counts = usage.get(key) ?? { forward: 0, reverse: 0 };
      if (index < 0) counts.reverse += 1;
      else counts.forward += 1;
      usage.set(key, counts);
    }
  });

  const remaining = new Set();
  forEachRing((ring) => {
    for (const index of ring) {
      const counts = usage.get(index < 0 ? ~index : index);
      if (counts.forward > 0 && counts.reverse > 0) continue;
      remaining.add(index);
    }
  });

  const pointKey = (point) => `${point[0].toFixed(6)},${point[1].toFixed(6)}`;
  const startingAt = new Map();
  for (const index of remaining) {
    const key = pointKey(arcPoints(arcs, index)[0]);
    const bucket = startingAt.get(key);
    if (bucket) bucket.push(index);
    else startingAt.set(key, [index]);
  }

  const rings = [];
  let openChains = 0;
  while (remaining.size > 0) {
    const first = remaining.values().next().value;
    remaining.delete(first);
    let points = arcPoints(arcs, first).slice();

    while (pointKey(points[0]) !== pointKey(points[points.length - 1])) {
      const candidates = startingAt.get(pointKey(points[points.length - 1])) ?? [];
      const next = candidates.find((index) => remaining.has(index));
      if (next === undefined) {
        openChains += 1;
        break;
      }
      remaining.delete(next);
      points = points.concat(arcPoints(arcs, next).slice(1));
    }
    rings.push(points);
  }

  if (openChains > 0) {
    throw new Error(
      `dissolve left ${openChains} unclosed chain(s) — the source topology is not ` +
        "shared-arc clean, so the outline would render with gaps"
    );
  }
  return rings;
}

/* ----------------------------------------------------------- projection */

/**
 * Cuts a ring wherever it jumps the ±180° meridian, returning the pieces.
 *
 * Natural Earth keeps Russia and Fiji as single rings that run off one edge of
 * the world and carry on from the other — d3-geo would clip them on the sphere,
 * but a flat projection draws the wrap as a grey band straight across the map.
 * Each crossing becomes a pair of points on the two edges instead, and the ring
 * is split between them.
 *
 * Only correct for rings that do not enclose a pole. Antarctica, the one shape
 * here that does, is dropped before this runs.
 */
function splitAtAntimeridian(ring) {
  const pieces = [];
  let current = [ring[0]];

  for (let i = 1; i < ring.length; i += 1) {
    const [lng1, lat1] = ring[i - 1];
    const [lng2, lat2] = ring[i];
    const delta = lng2 - lng1;

    if (Math.abs(delta) <= 180) {
      current.push(ring[i]);
      continue;
    }
    // Follow the short way round the globe so the crossing latitude is right.
    const unwrapped = lng2 - Math.sign(delta) * 360;
    const edge = lng1 > 0 ? 180 : -180;
    const latitude = lat1 + ((edge - lng1) / (unwrapped - lng1)) * (lat2 - lat1);
    current.push([edge, latitude]);
    pieces.push(current);
    current = [[-edge, latitude], ring[i]];
  }
  pieces.push(current);

  if (pieces.length > 1) {
    // The ring is closed, so whatever trails off the end rejoins the start.
    const tail = pieces.pop();
    pieces[0] = tail.concat(pieces[0].slice(1));
  }
  return pieces.filter((piece) => piece.length >= 3);
}

function projectRing(ring, project) {
  return ring.map(([lng, lat]) => {
    const { x, y } = project(lng, lat);
    return [x, y];
  });
}

/** Perpendicular distance from `point` to the segment `start`–`end`, squared. */
function segmentDistanceSquared(point, start, end) {
  let [x, y] = start;
  let dx = end[0] - x;
  let dy = end[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) [x, y] = end;
    else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

/** Douglas-Peucker, iterative so a 10,000-point coastline cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length <= 2) return points;
  const toleranceSquared = tolerance * tolerance;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop();
    let worst = 0;
    let worstIndex = -1;
    for (let i = first + 1; i < last; i += 1) {
      const distance = segmentDistanceSquared(points[i], points[first], points[last]);
      if (distance > worst) {
        worst = distance;
        worstIndex = i;
      }
    }
    if (worstIndex !== -1 && worst > toleranceSquared) {
      keep[worstIndex] = 1;
      stack.push([first, worstIndex], [worstIndex, last]);
    }
  }
  return points.filter((_, index) => keep[index] === 1);
}

/** Shoelace area, unsigned — zero for a sliver, however long it is. */
function ringArea(points) {
  let total = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    total += points[j][0] * points[i][1] - points[i][0] * points[j][1];
  }
  return Math.abs(total) / 2;
}

function ringExtent(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Measures every shape, then works out the scale and offset that drops them
 * into a `width`-wide viewBox. Returned in the shape lib/maps/projections.ts
 * expects, so the runtime overlay projects into the identical space.
 */
function fitToWidth(ringsInRawUnits, width, padding, minAspect = 0) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of ringsInRawUnits) {
    const extent = ringExtent(ring);
    minX = Math.min(minX, extent.minX);
    minY = Math.min(minY, extent.minY);
    maxX = Math.max(maxX, extent.maxX);
    maxY = Math.max(maxY, extent.maxY);
  }

  // India's own bounding box is taller than it is wide, which leaves a portrait
  // picture sitting in a landscape card. Widening the box evenly on both sides
  // shows more of the neighbours instead of more empty panel.
  const span = maxX - minX;
  if (minAspect > 0 && span / (maxY - minY) < minAspect) {
    const grow = ((maxY - minY) * minAspect - span) / 2;
    minX -= grow;
    maxX += grow;
  }

  const scale = (width - padding * 2) / (maxX - minX);
  const height = Math.round((maxY - minY) * scale + padding * 2);
  return {
    scale,
    translateX: padding - minX * scale,
    translateY: padding - minY * scale,
    width,
    height,
  };
}

function applyFit(ring, fit) {
  return ring.map(([x, y]) => [x * fit.scale + fit.translateX, y * fit.scale + fit.translateY]);
}

/* ------------------------------------------------------------------ svg */

/** `M x y L x y … Z`, rounded to a tenth of a unit with the repeats squeezed out. */
function ringToPath(points) {
  const round = (value) => {
    const rounded = Math.round(value * 10) / 10;
    // Avoid "-0", which costs a byte on every coordinate that lands on an edge.
    return Object.is(rounded, -0) ? 0 : rounded;
  };
  let path = "";
  let previousX = NaN;
  let previousY = NaN;
  for (const [rawX, rawY] of points) {
    const x = round(rawX);
    const y = round(rawY);
    if (x === previousX && y === previousY) continue;
    path += `${path === "" ? "M" : "L"}${x} ${y}`;
    previousX = x;
    previousY = y;
  }
  return path === "" ? "" : `${path}Z`;
}

/** A circle as a path, for an island with no room left to have a shape. */
function speckToPath(points, radius) {
  const x = points.reduce((total, point) => total + point[0], 0) / points.length;
  const y = points.reduce((total, point) => total + point[1], 0) / points.length;
  const round = (value) => Math.round(value * 10) / 10;
  return (
    `M${round(x - radius)} ${round(y)}` +
    `a${radius} ${radius} 0 1 0 ${radius * 2} 0` +
    `a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z`
  );
}

/**
 * One `d` attribute per shape, holes and islands included as sub-paths.
 *
 * `tinyRings` decides what becomes of a ring with less than `minArea` to it —
 * an island under a pixel across, or one of the zero-area slivers the source's
 * quantization leaves behind. The world map drops them: they are unnamed rocks,
 * and keeping them is most of the file. The India map draws each as a speck
 * instead, nudged up to a size that survives the shrink to display width,
 * because a map of India that loses its island territories is simply wrong.
 */
function shapeToPath(rings, fit, { tolerance, minArea, tinyRings, speckRadius }) {
  return rings
    .map((ring) => {
      const fitted = applyFit(ring, fit);
      if (ringArea(fitted) < minArea) {
        return tinyRings === "speck" ? speckToPath(fitted, speckRadius) : "";
      }
      return ringToPath(simplify(fitted, tolerance));
    })
    .filter(Boolean)
    .join("");
}

function escapeXml(value) {
  return value.replace(/[<>&"]/g, (character) => {
    if (character === "<") return "&lt;";
    if (character === ">") return "&gt;";
    if (character === "&") return "&amp;";
    return "&quot;";
  });
}

/**
 * The halo on the coastline. Blurs a copy of the stroke, doubles it to deepen
 * the bloom, then lays the crisp stroke back on top.
 *
 * Hung on a <g> rather than each path so the filter runs once per layer instead
 * of once per country, and `color-interpolation-filters="sRGB"` because the
 * linearRGB default washes a warm colour out to something pale.
 */
function glowFilter(id, blur) {
  return (
    `<filter id="${id}" x="-8%" y="-15%" width="116%" height="130%" ` +
    `color-interpolation-filters="sRGB">` +
    `<feGaussianBlur stdDeviation="${blur}" result="b"/>` +
    `<feMerge><feMergeNode in="b"/><feMergeNode in="b"/>` +
    `<feMergeNode in="SourceGraphic"/></feMerge></filter>`
  );
}

function pathsBody(paths) {
  return paths
    .map((path) => `<path${path.id ? ` id="${path.id}"` : ""} d="${path.d}"/>`)
    .join("");
}

/**
 * City lights, bucketed by tier so the radius and opacity each live on a group
 * instead of on every one of a couple of thousand circles.
 */
function lightsBody(lights) {
  return LIGHT_TIERS.map((tier, index) => {
    const members = lights.filter((light) => light.tier === index);
    if (members.length === 0) return "";
    return (
      `<g fill-opacity="${tier.opacity}">` +
      members
        .map(({ x, y }) => `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${tier.radius}"/>`)
        .join("") +
      `</g>`
    );
  }).join("");
}

/** `layers` are `{ attrs, body }`: attrs go on a <g>, body is its content. */
function renderSvg({ fit, title, defs = "", layers }) {
  const body = layers.map((layer) => `<g ${layer.attrs}>${layer.body}</g>`).join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fit.width} ${fit.height}" ` +
    `role="img" aria-label="${escapeXml(title)}" fill-rule="evenodd">` +
    `<title>${escapeXml(title)}</title>` +
    (defs ? `<defs>${defs}</defs>` : "") +
    `${body}</svg>\n`
  );
}

/* ------------------------------------------------------------ pipeline */

async function loadSource({ url, file }) {
  const path = join(cacheDir, file);
  if (!existsSync(path)) {
    process.stdout.write(`  fetching ${url}\n`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${url} responded ${response.status} ${response.statusText}`);
    }
    await mkdir(cacheDir, { recursive: true });
    await writeFile(path, Buffer.from(await response.arrayBuffer()));
  }
  return JSON.parse(await readFile(path, "utf8"));
}

/**
 * Real cities, projected and bucketed into brightness tiers.
 *
 * `inside` keeps the India map from scattering Lahore and Kathmandu across its
 * neighbours' territory, which is drawn as empty sea on that card.
 */
function prepareLights(places, project, fit, { minPopulation, inside, outside }) {
  return places.features
    .filter((feature) => {
      const { pop_max: population, adm0name: country } = feature.properties;
      if ((population ?? 0) < minPopulation) return false;
      if (inside && country !== inside) return false;
      if (outside && country === outside) return false;
      return true;
    })
    .map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const { x, y } = project(lng, lat);
      const population = feature.properties.pop_max ?? 0;
      let tier = 0;
      LIGHT_TIERS.forEach((candidate, index) => {
        if (population >= candidate.from) tier = index;
      });
      return { x: x * fit.scale + fit.translateX, y: y * fit.scale + fit.translateY, tier };
    })
    // Anything off the card is bytes nobody will ever see.
    .filter(({ x, y }) => x > -4 && y > -4 && x < fit.width + 4 && y < fit.height + 4);
}

/**
 * The land around India, for its own card: every source ring near enough for
 * the projection to make sense of, left for the viewBox to crop.
 */
function prepareNeighbours(worldTopology) {
  const arcs = decodeArcs(worldTopology);
  const { west, east, south, north } = INDIA_NEIGHBOURHOOD;

  return worldTopology.objects.countries.geometries
    .filter((geometry) => geometry.id !== "356") // India is drawn properly.
    .flatMap((geometry) => polygonsOf(geometry).flat())
    .map((ring) => ringToCoordinates(arcs, ring))
    .filter((coordinates) => {
      const longitudes = coordinates.map(([lng]) => lng);
      const latitudes = coordinates.map(([, lat]) => lat);
      return (
        Math.min(...longitudes) > west &&
        Math.max(...longitudes) < east &&
        Math.min(...latitudes) > south &&
        Math.max(...latitudes) < north
      );
    })
    .map((coordinates) => projectRing(coordinates, INDIA_RAW_PROJECTION));
}

/** Named shapes plus the dissolved outline, all still in raw projected units. */
function prepareIndia(topology) {
  const arcs = decodeArcs(topology);
  const geometries = topology.objects.states.geometries;
  const project = INDIA_RAW_PROJECTION;

  const states = geometries.map((geometry) => ({
    name: geometry.properties.st_nm,
    rings: polygonsOf(geometry)
      .flat()
      .map((ring) => projectRing(ringToCoordinates(arcs, ring), project)),
  }));
  const outline = dissolve(arcs, geometries).map((ring) => projectRing(ring, project));
  // Single-point "rings", which shapeToPath turns straight into specks.
  const lakshadweep = LAKSHADWEEP_ISLANDS.map(([lng, lat]) => projectRing([[lng, lat]], project));
  return { states, outline, lakshadweep };
}

function prepareWorld(topology, indiaTopology) {
  const arcs = decodeArcs(topology);
  const project = WORLD_RAW_PROJECTION;
  const geometries = topology.objects.countries.geometries.filter(
    // Antarctica is a band of white across the bottom of every equirectangular
    // map and says nothing about where we work, so it is left off.
    (geometry) => geometry.properties?.name !== "Antarctica"
  );

  const countries = [];
  const highlighted = [];
  for (const geometry of geometries) {
    // India is replaced wholesale further down; see the note at the top.
    if (geometry.id === "356") continue;
    const rings = polygonsOf(geometry)
      .flat()
      .flatMap((ring) => splitAtAntimeridian(ringToCoordinates(arcs, ring)))
      .map((ring) => projectRing(ring, project));
    (HIGHLIGHT_COUNTRY_IDS.has(geometry.id) ? highlighted : countries).push({
      name: geometry.properties?.name ?? geometry.id,
      rings,
    });
  }

  const indiaArcs = decodeArcs(indiaTopology);
  const india = {
    name: "India",
    rings: dissolve(indiaArcs, indiaTopology.objects.states.geometries).map((ring) =>
      projectRing(ring, project)
    ),
  };
  highlighted.push(india);

  return { countries, highlighted };
}

function formatFits(fits) {
  const entry = ([name, fit]) =>
    `export const ${name}: ProjectionFit = {\n` +
    `  scale: ${fit.scale},\n` +
    `  translateX: ${fit.translateX},\n` +
    `  translateY: ${fit.translateY},\n` +
    `  width: ${fit.width},\n` +
    `  height: ${fit.height},\n` +
    `};\n`;

  return (
    `// GENERATED by scripts/generate-maps.mjs — do not edit by hand.\n` +
    `//\n` +
    `// How the artwork in public/images/maps/ sits inside its viewBox. Regenerate\n` +
    `// this and the SVGs together with \`npm run maps:generate\`; a fit that does not\n` +
    `// match its SVG puts every pin in the wrong place.\n` +
    `import type { ProjectionFit } from "./projections";\n\n` +
    Object.entries(fits).map(entry).join("\n")
  );
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const [indiaTopology, worldTopology, places] = await Promise.all([
    loadSource(SOURCES.india),
    loadSource(SOURCES.world),
    loadSource(SOURCES.places),
  ]);

  const india = prepareIndia(indiaTopology);
  const indiaFit = fitToWidth(india.outline, INDIA_WIDTH, PADDING, INDIA_MIN_ASPECT);
  const indiaLights = prepareLights(places, INDIA_RAW_PROJECTION, indiaFit, {
    minPopulation: MIN_POPULATION.india,
    inside: "India",
  });
  const neighbourLights = prepareLights(places, INDIA_RAW_PROJECTION, indiaFit, {
    minPopulation: MIN_POPULATION.neighbours,
    outside: "India",
  });
  const neighbours = prepareNeighbours(worldTopology);
  const indiaOutline = shapeToPath(india.outline, indiaFit, INDIA_DETAIL);
  const indiaSvg = renderSvg({
    fit: indiaFit,
    title: "Map of India showing all states and union territories",
    defs: glowFilter("coast", 3.2),
    layers: [
      {
        attrs: `fill="${PALETTE.neighbour}" stroke="${PALETTE.neighbourBorder}" stroke-width="0.7" stroke-linejoin="round"`,
        body: pathsBody([{ id: "neighbours", d: shapeToPath(neighbours, indiaFit, WORLD_DETAIL) }]),
      },
      {
        // `opacity` rather than `fill-opacity`: the tier groups inside set
        // their own fill-opacity, which would override it instead of combining.
        attrs: `fill="${PALETTE.light}" stroke="none" opacity="0.4"`,
        body: lightsBody(neighbourLights),
      },
      {
        attrs: `fill="${PALETTE.land}" stroke="${PALETTE.internalBorder}" stroke-width="0.7" stroke-linejoin="round" stroke-opacity="0.55"`,
        body: pathsBody(
          india.states.map((state) => ({
            id: `state-${state.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
            d: shapeToPath(state.rings, indiaFit, INDIA_DETAIL),
          }))
        ),
      },
      {
        attrs: `fill="${PALETTE.light}" stroke="none"`,
        body: lightsBody(indiaLights),
      },
      {
        // Last, and lit: the coastline reads as the edge of the country rather
        // than as one more border once it is the only glowing line on the map.
        attrs: `fill="none" stroke="${PALETTE.coast}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" filter="url(#coast)"`,
        body: pathsBody([{ d: indiaOutline }]),
      },
      {
        // The island territories are drawn as specks a couple of units across;
        // the coast stroke above would swallow them, so they get their own.
        attrs: `fill="${PALETTE.coast}" stroke="none"`,
        body: pathsBody([
          { id: "lakshadweep", d: shapeToPath(india.lakshadweep, indiaFit, INDIA_DETAIL) },
        ]),
      },
    ],
  });

  const world = prepareWorld(worldTopology, indiaTopology);
  const worldFit = fitToWidth(
    [...world.countries, ...world.highlighted].flatMap((country) => country.rings),
    WORLD_WIDTH,
    PADDING
  );
  const worldLights = prepareLights(places, WORLD_RAW_PROJECTION, worldFit, {
    minPopulation: MIN_POPULATION.world,
  });
  // Stored once in <defs> and drawn twice: filled navy, then stroked in glowing
  // gold. Inlining both passes would put every coastline in the file twice.
  const worldShapes =
    `<g id="land">` +
    pathsBody(
      world.countries.map((country) => ({
        d: shapeToPath(country.rings, worldFit, WORLD_DETAIL),
      }))
    ) +
    `</g><g id="markets">` +
    pathsBody(
      world.highlighted.map((country) => ({
        d: shapeToPath(country.rings, worldFit, WORLD_DETAIL),
      }))
    ) +
    `</g>`;
  const worldSvg = renderSvg({
    fit: worldFit,
    title: "World map highlighting India, the United Arab Emirates and Singapore",
    defs: glowFilter("coast", 2.2) + worldShapes,
    layers: [
      {
        attrs: `fill="${PALETTE.land}" stroke="${PALETTE.internalBorder}" stroke-width="0.5" stroke-linejoin="round"`,
        body: `<use href="#land"/>`,
      },
      {
        attrs: `fill="${PALETTE.highlight}" stroke="${PALETTE.internalBorder}" stroke-width="0.5" stroke-linejoin="round"`,
        body: `<use href="#markets"/>`,
      },
      {
        attrs: `fill="${PALETTE.light}" stroke="none"`,
        body: lightsBody(worldLights),
      },
      {
        attrs: `fill="none" stroke="${PALETTE.coast}" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" filter="url(#coast)"`,
        body: `<use href="#land"/><use href="#markets"/>`,
      },
    ],
  });

  await writeFile(join(outputDir, "india.svg"), indiaSvg);
  await writeFile(join(outputDir, "world.svg"), worldSvg);
  await writeFile(
    join(projectRoot, "lib", "maps", "fits.generated.ts"),
    formatFits({ INDIA_FIT: indiaFit, WORLD_FIT: worldFit })
  );

  const kilobytes = (text) => `${(Buffer.byteLength(text) / 1024).toFixed(1)} kB`;
  process.stdout.write(
    `  india.svg  ${indiaFit.width}x${indiaFit.height}  ${kilobytes(indiaSvg)}  ` +
      `${indiaLights.length} city lights\n` +
      `  world.svg  ${worldFit.width}x${worldFit.height}  ${kilobytes(worldSvg)}  ` +
      `${worldLights.length} city lights\n` +
      `  lib/maps/fits.generated.ts written\n`
  );
}

await main();
