/**
 * Node module-resolution hooks that understand the `@/*` path alias.
 *
 * WHY THIS EXISTS
 * `tsconfig.json` maps `"@/*": ["./*"]`, and Next.js honours that when it
 * builds. Plain `node` does not read tsconfig at all, so to it `@/lib/types`
 * looks like a bare package specifier and resolution fails with
 * "Cannot find package '@/lib'".
 *
 * That only bites the standalone scripts (npm run db:seed), which import the
 * lib/data modules directly with `node --experimental-transform-types`.
 * scripts/db-seed.mjs assumed those modules "only ever use `import type`" —
 * type-only imports are erased by type stripping, so the alias never has to
 * resolve. That is true of 15 of the 18 files, but not of:
 *     lib/data/properties.ts        imports { propertyDetails }
 *     lib/data/insightsHub.ts       imports { articleHref, getArticleById }
 *     lib/data/signatureProjects.ts imports { getPropertyById }
 * which are real value imports, so the seed script could never run.
 *
 * Used via scripts/alias-register.mjs; see the db:seed script in package.json.
 * This is build/ops tooling only — nothing here affects the application at
 * runtime, where Next.js resolves the alias itself.
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

// Mirrors how TypeScript resolves an extensionless specifier, in the same
// order, so a stray `@/lib/data/foo` behaves the way the editor says it will.
const CANDIDATE_SUFFIXES = ["", ".ts", ".tsx", ".mjs", ".js", "/index.ts", "/index.tsx"];

export function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const base = join(projectRoot, specifier.slice(2));
  for (const suffix of CANDIDATE_SUFFIXES) {
    const candidate = base + suffix;
    if (existsSync(candidate)) {
      return nextResolve(pathToFileURL(candidate).href, context);
    }
  }

  throw new Error(
    `Could not resolve "${specifier}" under ${projectRoot} — tried: ` +
      CANDIDATE_SUFFIXES.map((s) => `${specifier}${s}`).join(", ")
  );
}
