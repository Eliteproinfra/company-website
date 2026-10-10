import { INDIA_FIT, WORLD_FIT } from "./fits.generated";
import {
  createFittedProjection,
  INDIA_RAW_PROJECTION,
  WORLD_RAW_PROJECTION,
} from "./projections";

/**
 * The two footprint maps, each pairing a projection with the viewBox its
 * artwork in `public/images/maps/` was drawn into. Project a coordinate through
 * one of these and it lands on the same spot as the coastline beneath it.
 */
export const indiaMap = createFittedProjection(INDIA_RAW_PROJECTION, INDIA_FIT);
export const worldMap = createFittedProjection(WORLD_RAW_PROJECTION, WORLD_FIT);

export type { FittedProjection, ProjectedPoint } from "./projections";
