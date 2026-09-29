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
# A static export cannot contain POST route handlers at all — `next build` errors
# out on them rather than skipping them. So this script moves app/api out of the
# tree for the duration of the build and puts it back afterwards, including when
# the build fails.

set -euo pipefail

cd "$(dirname "$0")/.."

API_DIR="app/api"
API_STASH=".api-stash"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

# copy-then-delete rather than `mv`: Git Bash on Windows cannot rename a watched
# directory and fails with EPERM. Copying works on both Windows and Linux.
restore_api() {
  if [ -d "$API_STASH" ]; then
    rm -rf "$API_DIR"
    cp -r "$API_STASH" "$API_DIR"
    rm -rf "$API_STASH"
    echo "Restored $API_DIR"
  fi
}
# Runs on success, on error, and on Ctrl-C — app/api must never be left stashed.
trap restore_api EXIT

if [ -d "$API_STASH" ]; then
  echo "ERROR: $API_STASH already exists — a previous export was interrupted." >&2
  echo "       Inspect it and move it back to $API_DIR by hand before retrying." >&2
  trap - EXIT
  exit 1
fi

step "Stashing $API_DIR (route handlers cannot be statically exported)"
cp -r "$API_DIR" "$API_STASH"
rm -rf "$API_DIR"

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
