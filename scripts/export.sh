#!/usr/bin/env bash
#
# Generate a static `out/` folder — plain HTML/CSS/JS/images, no Node server.
#
# Usage:
#   bash scripts/export.sh
#
# ONLY for file-based hosting (Hostinger shared/Cloud hPanel, or any plain
# webserver). The VPS deployment does NOT use this — it runs the real Node
# server via scripts/deploy.sh, where the forms work.
#
# WHAT DOES NOT WORK IN out/:
#   - /api/enquiry and /api/career-application do not exist. Every form on the
#     site (contact, home, newsletter, property, service, property-management,
#     careers) will fail at submit. They need a server-side replacement — a PHP
#     mail script or a hosted form service — before this build goes public.
#   - next/image optimization is off; originals are served at full size.
#
# A static export cannot contain POST route handlers, or any route marked
# `dynamic = "force-dynamic"`, at all — `next build` errors out on them rather
# than skipping them. So this script moves the server-only routes out of the
# tree for the duration of the build and puts them back afterwards, including
# when the build fails.

set -euo pipefail

cd "$(dirname "$0")/.."

# Directories moved out of the tree for the duration of the export build. Each
# is stashed at ".<basename>-stash".
#
#   app/api       POST handlers: the mail APIs and the admin upload endpoint.
#   app/uploads   force-dynamic: it reads admin uploads off disk per request,
#                 which needs a running server and an admin to have uploaded
#                 anything. A static export has neither — /uploads/ images in
#                 out/ are whatever is sitting in public/uploads at build time,
#                 served directly as files.
#   tests         not build input, but tsconfig includes every .ts in the repo
#                 and `next build` runs that type check. tests/uploads.test.ts
#                 imports the route stashed above, so leaving it in place fails
#                 the build on a module the build itself just removed.
#
# NOTE: this script does not currently get as far as a finished out/ — the
# export build fails on app/health (force-dynamic) and then on the admin's
# Server Actions, both of which predate the entries below and neither of which
# this change set touches. The entries below exist so that app/uploads is not
# one more reason it fails.
STASH_DIRS=("app/api" "app/uploads" "tests")

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

stash_path() { echo ".$(basename "$1")-stash"; }

# copy-then-delete rather than `mv`: Git Bash on Windows cannot rename a watched
# directory and fails with EPERM. Copying works on both Windows and Linux.
restore_stashed() {
  for dir in "${STASH_DIRS[@]}"; do
    stash="$(stash_path "$dir")"
    if [ -d "$stash" ]; then
      rm -rf "$dir"
      cp -r "$stash" "$dir"
      rm -rf "$stash"
      echo "Restored $dir"
    fi
  done
}
# Runs on success, on error, and on Ctrl-C — these must never be left stashed.
trap restore_stashed EXIT

for dir in "${STASH_DIRS[@]}"; do
  stash="$(stash_path "$dir")"
  if [ -d "$stash" ]; then
    echo "ERROR: $stash already exists — a previous export was interrupted." >&2
    echo "       Inspect it and move it back to $dir by hand before retrying." >&2
    trap - EXIT
    exit 1
  fi
done

step "Stashing server-only routes and tests (not statically exportable)"
for dir in "${STASH_DIRS[@]}"; do
  cp -r "$dir" "$(stash_path "$dir")"
  rm -rf "$dir"
  echo "Stashed $dir"
done

step "Building static export"
rm -rf out
NEXT_EXPORT=true npx next build

step "Adding .htaccess"
cp deploy/htaccess-static out/.htaccess

step "Done"
echo "Static site is in out/ ($(find out -type f | wc -l | tr -d ' ') files, $(du -sh out | cut -f1))."
echo
echo "Upload the CONTENTS of out/ to public_html via hPanel File Manager or FTP."
echo "Reminder: every form is dead in this build — see the header of this script."
