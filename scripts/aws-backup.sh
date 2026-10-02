#!/usr/bin/env bash
#
# Nightly backup of everything on this box that is not reproducible from git.
# RUN ON THE SERVER AS ROOT (systemd unit elitepro-backup.service invokes it).
#
#   sudo bash /var/www/eliteproinfra/shared/aws-backup.sh
#
# WHAT IS BACKED UP, AND WHY ONLY THIS
#   1. the MySQL database — CMS content and captured enquiries. Nothing else
#      holds this.
#   2. shared/uploads/    — admin-uploaded images. gitignored, so losing the
#      instance loses them permanently.
#   3. shared/.env.local  — deliberately NOT backed up. It is rendered from
#      SSM Parameter Store, which is already durable and encrypted; copying
#      secrets into S3 would widen their blast radius for nothing. Rebuild it
#      with shared/render-env.sh.
#   Application code lives in GitHub and release artifacts in S3, so neither
#   is duplicated here.
#
# AUTHENTICATION: connects as MySQL root over the unix socket (auth_socket),
# which needs no password at all. The application user eliteweb deliberately
# lacks EVENT and global privileges, so it cannot take a complete dump; and
# using root this way keeps the DB password out of temp files, /proc and `ps`.
#
# RETENTION is enforced by the bucket lifecycle rule (90 days), not by this
# script deleting remote objects — a compromised instance must not be able to
# erase backup history.

set -euo pipefail

APP_ROOT=/var/www/eliteproinfra
ENV_FILE="$APP_ROOT/shared/.env.local"
BUCKET=elitepro-website-983814062994
REGION=ap-south-1
STAGING=/var/backups/eliteproinfra
KEEP_LOCAL_DAYS=3

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
PREFIX="backups/$(date -u +%Y/%m)"

log()  { printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$1"; }
fail() { printf '[%s] BACKUP FAILED: %s\n' "$(date -u +%H:%M:%S)" "$1" >&2; exit 1; }

[ "$(id -u)" = "0" ] || fail "must run as root (uses MySQL auth_socket)"
[ -f "$ENV_FILE" ] || fail "$ENV_FILE missing"
DB_NAME=$(grep '^DB_NAME=' "$ENV_FILE" | cut -d= -f2-)
[ -n "$DB_NAME" ] || fail "could not read DB_NAME from $ENV_FILE"

mkdir -p "$STAGING"; chmod 700 "$STAGING"

# --------------------------------------------------------------- database
DUMP="$STAGING/db-${STAMP}.sql.gz"
log "dumping $DB_NAME"
# --single-transaction takes a consistent InnoDB snapshot without locking, so
# the site keeps serving normally throughout.
mysqldump --single-transaction --quick --routines --triggers --events \
  --default-character-set=utf8mb4 --databases "$DB_NAME" \
  2>/dev/null | gzip -9 > "$DUMP" || fail "mysqldump failed"

# A file that exists but contains no tables is the classic silent backup
# failure. Prove the dump has real content before trusting it.
gzip -t "$DUMP" || fail "dump is not valid gzip"
TABLES=$(zcat "$DUMP" | grep -c '^CREATE TABLE' || true)
[ "$TABLES" -ge 7 ] || fail "dump has $TABLES CREATE TABLE statements, expected >= 7"
ROWS=$(zcat "$DUMP" | grep -c '^INSERT INTO' || true)
log "dump ok: $(du -h "$DUMP" | cut -f1), $TABLES tables, $ROWS insert statements"

# ---------------------------------------------------------------- uploads
UPLOADS="$STAGING/uploads-${STAMP}.tar.gz"
log "archiving uploads"
tar -czf "$UPLOADS" -C "$APP_ROOT/shared" uploads 2>/dev/null || fail "uploads archive failed"
log "uploads ok: $(du -h "$UPLOADS" | cut -f1), $(tar -tzf "$UPLOADS" | wc -l) entries"

# -------------------------------------------------------------------- s3
log "uploading to s3://$BUCKET/$PREFIX/"
for f in "$DUMP" "$UPLOADS"; do
  aws s3 cp "$f" "s3://$BUCKET/$PREFIX/$(basename "$f")" \
    --region "$REGION" --only-show-errors || fail "upload of $(basename "$f") failed"
done

# Confirm each object is actually present at the right size rather than
# trusting the copy's exit code.
for f in "$DUMP" "$UPLOADS"; do
  local_size=$(stat -c%s "$f")
  remote_size=$(aws s3api head-object --bucket "$BUCKET" --key "$PREFIX/$(basename "$f")" \
                  --region "$REGION" --query ContentLength --output text 2>/dev/null || echo 0)
  [ "$local_size" = "$remote_size" ] \
    || fail "size mismatch for $(basename "$f"): local=$local_size remote=$remote_size"
  log "verified $(basename "$f") ($remote_size bytes)"
done

# --------------------------------------------------------------- local prune
# A few days kept locally for fast restores; S3 lifecycle owns long retention.
find "$STAGING" -name '*.gz' -mtime +$KEEP_LOCAL_DAYS -delete 2>/dev/null || true

log "backup complete: s3://$BUCKET/$PREFIX/$(basename "$DUMP")"
