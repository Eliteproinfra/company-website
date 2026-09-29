import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Snapshot of a hacked webroot kept only as evidence — an older static export of
    // this site plus injected malware. Not project source; its minified bundles are
    // the only thing in the repo that trips the linter.
    "_public_html/**",
  ]),
]);

export default eslintConfig;
