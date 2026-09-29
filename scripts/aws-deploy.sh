#!/usr/bin/env bash
#
# Atomic-release deploy for the AWS EC2 box. RUN ON THE SERVER — GitHub Actions
# invokes it through SSM SendCommand.
#
#   sudo -u elite bash /var/www/eliteproinfra/shared/aws-deploy.sh <commit-sha>
#
# Layout it maintains:
#   /var/www/eliteproinfra/
#   ├── releases/<sha>/     one extracted+built source tree per deploy
#   ├── shared/
#   │   ├── .env.local      secrets (600), rendered from SSM Parameter Store
#   │   ├── uploads/        admin uploads, symlinked into each release
#   │   └── next-cache/     Next build cache, symlinked to .next/cache
#   └── current -> releases/<sha>
#
# WHY A SOURCE ARTIFACT FROM S3 RATHER THAN `git clone`:
#   The GitHub repository is private. Cloning on the server would mean keeping a
#   GitHub deploy key or PAT on the box permanently. Instead CI uploads a source
#   tarball to S3 and the instance role grants read-only access to releases/*.
#   The server holds no GitHub credential at all.
#
# WHY ATOMIC RELEASES RATHER THAN IN-PLACE `git pull && npm run build`:
#   1. `next build` writes into .next/ while `next start` is reading from it —
#      building in place can break the running site mid-deploy.
#   2. public/uploads is gitignored, so an in-place rebuild orphans every admin
#      upload. Here it is a symlink into shared/ and survives.
#   3. Rollback becomes a symlink repoint plus a reload.
#
# The deploy FAILS AND AUTOMATICALLY ROLLS BACK if the health check does not
# pass. A completed SSM command is never treated as a successful deploy.

set -euo pipefail

APP_ROOT="/var/www/eliteproinfra"
APP_NAME="eliteproinfra"
BUCKET="elitepro-website-983814062994"
REGION="ap-south-1"
HEALTH_URL="http://127.0.0.1:3000/health"
KEEP_RELEASES=5

SHA="${1:-}"
[ -n "$SHA" ] || { echo "usage: aws-deploy.sh <commit-sha>" >&2; exit 2; }
SHORT="${SHA:0:12}"
RELEASE="$APP_ROOT/releases/$SHORT"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31mDEPLOY FAILED: %s\033[0m\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- preflight
step "Preflight"
[ -f "$APP_ROOT/shared/.env.local" ] || fail "shared/.env.local missing — run shared/render-env.sh"
[ -s "$APP_ROOT/shared/.env.local" ] || fail "shared/.env.local is empty"
for c in node npm pm2 aws jq curl; do
  command -v "$c" >/dev/null || fail "$c is not installed"
done
echo "node $(node -v) | npm $(npm -v) | pm2 $(pm2 --version)"

PREVIOUS=""
if [ -L "$APP_ROOT/current" ]; then
  PREVIOUS="$(readlink -f "$APP_ROOT/current")"
  echo "current release: $PREVIOUS"
else
  echo "no current release — first deploy"
fi

# ------------------------------------------------------------------- fetch
step "Fetching artifact for $SHORT"
TARBALL="/tmp/${SHORT}.tar.gz"
rm -f "$TARBALL"
aws s3 cp "s3://${BUCKET}/releases/${SHA}.tar.gz" "$TARBALL" --region "$REGION" \
  || fail "no artifact at s3://${BUCKET}/releases/${SHA}.tar.gz"
echo "downloaded $(du -h "$TARBALL" | cut -f1)"

step "Extracting to $RELEASE"
rm -rf "$RELEASE"
mkdir -p "$RELEASE"
tar -xzf "$TARBALL" -C "$RELEASE"
rm -f "$TARBALL"

# ------------------------------------------------------------------ wiring
step "Linking shared state"
ln -sfn "$APP_ROOT/shared/.env.local" "$RELEASE/.env.local"

# public/uploads is gitignored, so the artifact contains no such directory.
mkdir -p "$RELEASE/public"
rm -rf "$RELEASE/public/uploads"
ln -sfn "$APP_ROOT/shared/uploads" "$RELEASE/public/uploads"

# Reuse the Next build cache between releases: the difference between a ~1min
# and a ~4min build on a 2-vCPU box.
mkdir -p "$RELEASE/.next" "$APP_ROOT/shared/next-cache"
rm -rf "$RELEASE/.next/cache"
ln -sfn "$APP_ROOT/shared/next-cache" "$RELEASE/.next/cache"

# Stamp the commit so /health can prove which build is actually serving.
# `next start` reads .env.production; the symlinked .env.local still takes
# precedence for everything else, so this cannot shadow a secret.
printf 'APP_COMMIT=%s\n' "$SHORT" > "$RELEASE/.env.production"

# Keep the server-side copies of the deploy tooling in step with the release.
for f in aws-deploy.sh aws-rollback.sh; do
  [ -f "$RELEASE/scripts/$f" ] && install -m 750 "$RELEASE/scripts/$f" "$APP_ROOT/shared/$f"
done
[ -f "$RELEASE/deploy/ecosystem.aws.config.js" ] && \
  install -m 640 "$RELEASE/deploy/ecosystem.aws.config.js" "$APP_ROOT/shared/ecosystem.aws.config.js"

# ------------------------------------------------------------------- build
step "Installing dependencies (npm ci)"
cd "$RELEASE"
npm ci --no-audit --no-fund

step "Building"
# On failure `set -e` aborts here, before the symlink is touched, so the
# previous release keeps serving.
npm run build

# ------------------------------------------------------------------ release
step "Activating $SHORT"
ln -sfn "$RELEASE" "$APP_ROOT/current.tmp"
# rename(2) over an existing symlink is atomic — there is no instant in which
# `current` does not exist.
mv -Tf "$APP_ROOT/current.tmp" "$APP_ROOT/current"
readlink -f "$APP_ROOT/current"

step "Reloading PM2"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start "$APP_ROOT/shared/ecosystem.aws.config.js"
fi
pm2 save --force >/dev/null

# ------------------------------------------------------------------- verify
step "Health check"
OK=0
for i in $(seq 1 30); do
  if BODY="$(curl -fsS --max-time 5 "$HEALTH_URL" 2>/dev/null)"; then
    GOT_STATUS="$(printf '%s' "$BODY" | jq -r '.status // empty')"
    GOT_COMMIT="$(printf '%s' "$BODY" | jq -r '.commit // empty')"
    if [ "$GOT_STATUS" = "ok" ] && [ "$GOT_COMMIT" = "$SHORT" ]; then
      echo "healthy: $BODY"
      OK=1
      break
    fi
    echo "  attempt $i: status=${GOT_STATUS:-?} commit=${GOT_COMMIT:-?} (want ok/$SHORT)"
  else
    echo "  attempt $i: no response yet"
  fi
  sleep 2
done

if [ "$OK" -ne 1 ]; then
  printf '\n\033[1;31mHealth check failed — rolling back\033[0m\n' >&2
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    ln -sfn "$PREVIOUS" "$APP_ROOT/current.tmp"
    mv -Tf "$APP_ROOT/current.tmp" "$APP_ROOT/current"
    pm2 reload "$APP_NAME" --update-env || pm2 restart "$APP_NAME"
    sleep 5
    if curl -fsS --max-time 5 "$HEALTH_URL" >&2; then
      echo "rolled back to $PREVIOUS and it is healthy" >&2
    else
      echo "WARNING: rolled back to $PREVIOUS but it is NOT healthy" >&2
    fi
  else
    echo "no previous release to roll back to — the app is DOWN" >&2
  fi
  echo "--- last 40 log lines ---" >&2
  tail -40 /var/log/eliteproinfra/app-error.log 2>/dev/null >&2 || true
  fail "health check did not pass for $SHORT"
fi

# ------------------------------------------------------------------- prune
step "Pruning old releases (keeping $KEEP_RELEASES)"
CURRENT_REAL="$(readlink -f "$APP_ROOT/current")"
# shellcheck disable=SC2012
ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | while read -r old; do
  old="${old%/}"
  [ "$(readlink -f "$old")" = "$CURRENT_REAL" ] && continue
  echo "  removing $old"
  rm -rf "$old"
done
ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | sed 's|^|  keep: |'

step "Deployed $SHORT"
pm2 status "$APP_NAME"
