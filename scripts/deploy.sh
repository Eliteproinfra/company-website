#!/usr/bin/env bash
#
# Deploy the current git branch on the Hostinger VPS.
#
# Run this ON THE SERVER, from the app directory:
#   cd /var/www/eliteproinfra && bash scripts/deploy.sh
#
# It pulls, installs from the lockfile, builds, and reloads PM2. The build runs
# before the reload, so a failing build leaves the previous version serving —
# `set -e` aborts the script before pm2 is ever touched.
#
# First-time server setup is NOT done here; see deploy/README.md.

set -euo pipefail

cd "$(dirname "$0")/.."

APP_NAME="eliteproinfra"
BRANCH="${1:-main}"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

if [ ! -f .env.local ]; then
  echo "ERROR: .env.local is missing. The contact and career forms need the SMTP_*" >&2
  echo "       credentials from .env.example. Create it before deploying." >&2
  exit 1
fi

step "Fetching origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

step "Installing dependencies from lockfile"
# `npm ci`, not `npm install` — it installs exactly what package-lock.json pins
# and never silently rewrites the lockfile on the server.
npm ci

step "Building"
npm run build

step "Reloading PM2 process: $APP_NAME"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  echo "Process not running yet — starting it for the first time."
  pm2 start ecosystem.config.js
fi
pm2 save

step "Deployed"
pm2 status "$APP_NAME"
echo
echo "Logs: pm2 logs $APP_NAME"
