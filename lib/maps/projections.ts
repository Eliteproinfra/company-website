/**
 * Map projections, shared by the build-time artwork generator
 * (`scripts/generate-maps.mjs`) and the runtime marker overlay
 * (`components/home/PresenceMap.tsx`).
 *
 * Both sides import from here on purpose: the generator draws the coastlines
 * with these functions and the component places the pins with them, so a pin
 * can never drift off the city it is pointing at. The generator also measures
 * the artwork it drew and writes the resulting viewBox fit to
 * `fits.generated.ts`, which is what turns a raw projection into a fitted one.
 */

const DEG = Math.PI / 180;

export type ProjectedPoint = { x: number; y: number };

/**
 * Degrees to an arbitrary, unscaled plane with y growing southwards (SVG's
 * direction). Units are whatever the projection's own math produces; only the
 * fit below gives them a meaning.
 */
export type RawProjection = (lng: number, lat: number) => ProjectedPoint;

/** How a raw projection's plane maps onto a `0 0 width height` viewBox. */
export type ProjectionFit = {
  scale: number;
  translateX: number;
  translateY: number;
  width: number;
  height: number;
};

export type FittedProjection = {
  readonly width: number;
  readonly height: number;
  /** A point in SVG user units inside `0 0 width height`. */
  project(lng: number, lat: number): ProjectedPoint;
  /** The same point as a percentage of the viewBox, for CSS-placed overlays. */
  projectToPercent(lng: number, lat: number): ProjectedPoint;
};

/** Plate carrée. Straight parallels and meridians — the flat world map look. */
export function equirectangular(): RawProjection {
  return (lng, lat) => ({ x: lng, y: -lat });
}

/**
 * Lambert conformal conic: two standard parallels where the scale is true,
 * stretching gently away from them. It is the projection the Survey of India
 * uses, and it keeps the country's shape honest over its 30° of latitude in a
 * way that Mercator (which would inflate Kashmir against Kerala) does not.
 */
export function lambertConformalConic(
  standardParallelSouth: number,
  standardParallelNorth: number,
  centralMeridian: number,
  originLatitude: number
): RawProjection {
  const phi1 = standardParallelSouth * DEG;
  const phi2 = standardParallelNorth * DEG;
  const lambda0 = centralMeridian * DEG;
  const phi0 = originLatitude * DEG;

  // Distance from the cone's apex, as a function of latitude.
  const apexDistance = (phi: number) => Math.tan(Math.PI / 4 + phi / 2);

  const n =
    Math.log(Math.cos(phi1) / Math.cos(phi2)) /
    Math.log(apexDistance(phi2) / apexDistance(phi1));
  const f = (Math.cos(phi1) * apexDistance(phi1) ** n) / n;
  const rho0 = f / apexDistance(phi0) ** n;

  return (lng, lat) => {
    // The poles are infinitely far from the apex; clamp so a stray coordinate
    // cannot produce a non-finite path command.
    const phi = Math.max(-89.9, Math.min(89.9, lat)) * DEG;
    const rho = f / apexDistance(phi) ** n;
    const theta = n * (lng * DEG - lambda0);
    return { x: rho * Math.sin(theta), y: rho * Math.cos(theta) - rho0 };
  };
}

/** The projection `public/images/maps/india.svg` is drawn in. */
export const INDIA_RAW_PROJECTION = lambertConformalConic(12.472944, 35.172806, 80, 24);

/** The projection `public/images/maps/world.svg` is drawn in. */
export const WORLD_RAW_PROJECTION = equirectangular();

export function createFittedProjection(
  raw: RawProjection,
  fit: ProjectionFit
): FittedProjection {
  const project = (lng: number, lat: number): ProjectedPoint => {
    const point = raw(lng, lat);
    return {
      x: point.x * fit.scale + fit.translateX,
      y: point.y * fit.scale + fit.translateY,
    };
  };

  return {
    width: fit.width,
    height: fit.height,
    project,
    projectToPercent(lng, lat) {
      const point = project(lng, lat);
      return { x: (point.x / fit.width) * 100, y: (point.y / fit.height) * 100 };
    },
  };
}
