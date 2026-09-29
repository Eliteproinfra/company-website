#!/usr/bin/env bash
#
# Full production build for the Elite Pro Infraventure site.
#
# Runs the same checks a deploy should pass, in the order that fails cheapest
# first: lint -> types -> build. Next 16 dropped linting from `next build` and
# moved route-type generation into its own `next typegen` command, so neither
# happens for free any more — both are run explicitly here.
#
# Usage:
#   bash scripts/build.sh            # lint + typecheck + build
#   bash scripts/build.sh --clean    # also wipe .next and reinstall from lockfile
#   bash scripts/build.sh --fast     # build only, skip lint and typecheck
#
# Works from Git Bash on Windows and from Linux CI (Netlify) alike.

set -euo pipefail

cd "$(dirname "$0")/.."

CLEAN=0
FAST=0
for arg in "$@"; do
  case "$arg" in
    --clean) CLEAN=1 ;;
    --fast)  FAST=1 ;;
    -h|--help)
      sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $arg (try --help)" >&2
      exit 2
      ;;
  esac
done

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

if [ "$CLEAN" -eq 1 ]; then
  step "Cleaning .next and reinstalling dependencies"
  rm -rf .next tsconfig.tsbuildinfo
  npm ci
elif [ ! -d node_modules ]; then
  step "node_modules missing — installing from lockfile"
  npm ci
fi

if [ "$FAST" -eq 0 ]; then
  step "Lint (eslint)"
  npm run lint

  step "Typecheck (next typegen + tsc --noEmit)"
  # typegen writes route types to .next/types; tsc alone would not see them.
  npx next typegen
  npx tsc --noEmit
fi

step "Production build (next build)"
npm run build

step "Done"
echo "Output in .next/ — Netlify publishes this directory via @netlify/plugin-nextjs."
echo "Run 'npm start' to serve the production build locally on :3000."
