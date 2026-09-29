/**
 * Registers the `@/*` resolution hooks (scripts/alias-hooks.mjs) on the module
 * loader before the entry script runs.
 *
 * Passed with `--import` rather than the deprecated `--experimental-loader`:
 *   node --experimental-transform-types --import ./scripts/alias-register.mjs scripts/db-seed.mjs
 *
 * Hooks run on a separate loader thread, which is why they live in their own
 * file and are registered from here rather than being defined inline.
 */
import { register } from "node:module";

register("./alias-hooks.mjs", import.meta.url);
