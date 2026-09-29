#!/usr/bin/env bash
#
# Roll the site back to a previously deployed release. RUN ON THE SERVER.
#
#   sudo -u elite bash /var/www/eliteproinfra/shared/aws-rollback.sh            # previous release
#   sudo -u elite bash /var/www/eliteproinfra/shared/aws-rollback.sh <sha12>    # a specific one
#   sudo -u elite bash /var/www/eliteproinfra/shared/aws-rollback.sh --list     # what is available
#
# Rollback is a symlink repoint plus a PM2 reload: the target release is
# already built, so this takes seconds and needs no network, no npm and no
# rebuild. That is the whole reason for the atomic-release layout.
#
# SCOPE — READ THIS BEFORE RELYING ON IT:
#   This rolls back APPLICATION CODE ONLY. It does not touch the database.
#   The project has no down-migrations (scripts/db-setup.mjs applies
#   lib/db/schema.sql with CREATE TABLE IF NOT EXISTS and never drops
#   anything), so a schema change is not reversed by rolling code back. If a
#   deploy changed the schema, restore the database from the nightly S3 dump
#   as well — see deploy/AWS.md, "Restore procedure".
#   In practice the current schema is additive-only, so a code rollback is
#   safe today. Re-check that if a future release starts altering columns.

set -euo pipefail

APP_ROOT="/var/www/eliteproinfra"
APP_NAME="eliteproinfra"
HEALTH_URL="http://127.0.0.1:3000/health"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31mROLLBACK FAILED: %s\033[0m\n' "$1" >&2; exit 1; }

CURRENT_REAL=""
[ -L "$APP_ROOT/current" ] && CURRENT_REAL="$(readlink -f "$APP_ROOT/current")"

list_releases() {
  printf '%-14s  %-20s  %s\n' "RELEASE" "BUILT" "ACTIVE"
  # shellcheck disable=SC2012
  ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | while read -r d; do
    d="${d%/}"
    mark=""
    [ "$(readlink -f "$d")" = "$CURRENT_REAL" ] && mark="<-- current"
    printf '%-14s  %-20s  %s\n' "$(basename "$d")" "$(date -r "$d" '+%Y-%m-%d %H:%M:%S')" "$mark"
  done
}

if [ "${1:-}" = "--list" ]; then
  list_releases
  exit 0
fi

step "Available releases"
list_releases

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  # Newest release that is not the one currently serving.
  # shellcheck disable=SC2012
  TARGET="$(ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | while read -r d; do
      d="${d%/}"
      [ "$(readlink -f "$d")" = "$CURRENT_REAL" ] && continue
      basename "$d"
      break
    done)"
  [ -n "$TARGET" ] || fail "no previous release to roll back to"
  echo
  echo "auto-selected previous release: $TARGET"
fi

TARGET_DIR="$APP_ROOT/releases/$TARGET"
[ -d "$TARGET_DIR" ] || fail "release $TARGET does not exist (try --list)"
[ -d "$TARGET_DIR/.next" ] || fail "release $TARGET has no build output — it was never successfully deployed"
[ "$(readlink -f "$TARGET_DIR")" = "$CURRENT_REAL" ] && fail "$TARGET is already the current release"

step "Repointing current -> $TARGET"
ln -sfn "$TARGET_DIR" "$APP_ROOT/current.tmp"
mv -Tf "$APP_ROOT/current.tmp" "$APP_ROOT/current"
readlink -f "$APP_ROOT/current"

step "Reloading PM2"
pm2 reload "$APP_NAME" --update-env || pm2 restart "$APP_NAME"
pm2 save --force >/dev/null

step "Health check"
OK=0
for i in $(seq 1 30); do
  if BODY="$(curl -fsS --max-time 5 "$HEALTH_URL" 2>/dev/null)"; then
    if [ "$(printf '%s' "$BODY" | jq -r '.status // empty')" = "ok" ]; then
      echo "healthy: $BODY"
      OK=1
      break
    fi
  fi
  echo "  attempt $i: not healthy yet"
  sleep 2
done

[ "$OK" -eq 1 ] || {
  echo "--- last 40 log lines ---" >&2
  tail -40 /var/log/eliteproinfra/app-error.log 2>/dev/null >&2 || true
  fail "rolled back to $TARGET but it is not healthy"
}

step "Rolled back to $TARGET"
pm2 status "$APP_NAME"
echo
echo "Reminder: this reverted code only. If the release you rolled back FROM"
echo "changed the database schema, restore the database as well."
