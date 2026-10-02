#!/usr/bin/env bash
#
# Restore the database or uploads from an S3 backup. RUN ON THE SERVER AS ROOT.
#
#   aws-restore.sh --list              what backups exist
#   aws-restore.sh --test <key>        restore into a scratch DB and verify (SAFE)
#   aws-restore.sh --db <key>          restore OVER the live database (DESTRUCTIVE)
#   aws-restore.sh --uploads <key>     restore uploads (merges, deletes nothing)
#
# --test is the one to reach for first, and the one the backup job's health
# depends on: it restores into elitepro_restore_test, counts rows, checks
# multi-byte text survived, then drops the scratch schema. A backup that has
# never been restored is a guess, not a backup.
#
# --db is deliberately awkward: it requires an explicit confirmation string
# and takes a safety dump of the current database first, so restoring the
# wrong file is itself recoverable.
#
# Connects as MySQL root over the unix socket (auth_socket) — no password.

set -euo pipefail

APP_ROOT=/var/www/eliteproinfra
ENV_FILE="$APP_ROOT/shared/.env.local"
BUCKET=elitepro-website-983814062994
REGION=ap-south-1
STAGING=/var/backups/eliteproinfra
TEST_DB=elitepro_restore_test

log()  { printf '[restore] %s\n' "$1"; }
fail() { printf '[restore] FAILED: %s\n' "$1" >&2; exit 1; }

[ "$(id -u)" = "0" ] || fail "must run as root (uses MySQL auth_socket)"
DB_NAME=$(grep '^DB_NAME=' "$ENV_FILE" 2>/dev/null | cut -d= -f2-)
[ -n "$DB_NAME" ] || fail "could not read DB_NAME"

my() { mysql --default-character-set=utf8mb4 "$@"; }

fetch() {
  local key="$1" dest="$STAGING/$(basename "$1")"
  mkdir -p "$STAGING"
  [ -f "$dest" ] || aws s3 cp "s3://$BUCKET/$key" "$dest" --region "$REGION" --only-show-errors >&2
  printf '%s' "$dest"
}

case "${1:-}" in
  --list)
    log "available backups:"
    aws s3 ls "s3://$BUCKET/backups/" --recursive --region "$REGION" --human-readable \
      | awk '{printf "  %s %s  %8s %-2s  %s\n", $1, $2, $3, $4, $5}'
    ;;

  --test)
    KEY="${2:-}"; [ -n "$KEY" ] || fail "usage: --test <s3-key>"
    SRC="$(fetch "$KEY")"
    log "restoring $KEY into scratch schema $TEST_DB"

    my -e "DROP DATABASE IF EXISTS \`$TEST_DB\`;
           CREATE DATABASE \`$TEST_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

    # The dump was taken with --databases, so it carries its own CREATE
    # DATABASE / USE naming the production schema. Rewrite exactly those two
    # statements so the restore lands in the scratch schema and cannot touch
    # production even by accident.
    zcat "$SRC" \
      | sed -E "s/^CREATE DATABASE[^;]*\`${DB_NAME}\`/CREATE DATABASE IF NOT EXISTS \`${TEST_DB}\`/; s/^USE \`${DB_NAME}\`/USE \`${TEST_DB}\`/" \
      | my "$TEST_DB" || fail "restore into scratch schema failed"

    log "row counts in the restored copy:"
    my -N -B "$TEST_DB" -e "
      SELECT 'admin_users',  COUNT(*) FROM admin_users
      UNION ALL SELECT 'properties',   COUNT(*) FROM properties
      UNION ALL SELECT 'articles',     COUNT(*) FROM articles
      UNION ALL SELECT 'job_listings', COUNT(*) FROM job_listings
      UNION ALL SELECT 'awards',       COUNT(*) FROM awards
      UNION ALL SELECT 'enquiries',    COUNT(*) FROM enquiries;" \
      | awk '{printf "    %-14s %s\n", $1, $2}'

    PROPS=$(my -N -B "$TEST_DB" -e "SELECT COUNT(*) FROM properties;")
    ARTS=$(my  -N -B "$TEST_DB" -e "SELECT COUNT(*) FROM articles;")
    MB=$(my    -N -B "$TEST_DB" -e "SELECT COUNT(*) FROM properties WHERE LENGTH(price) > CHAR_LENGTH(price);")
    BAD=$(my   -N -B "$TEST_DB" -e "SELECT COUNT(*) FROM articles WHERE INSTR(content, _utf8mb4 0xEFBFBD) > 0;")
    HASH=$(my  -N -B "$TEST_DB" -e "SELECT COUNT(*) FROM admin_users WHERE password_hash LIKE 'scrypt\$%';")

    log "multi-byte prices preserved : $MB"
    log "U+FFFD corruption           : $BAD (must be 0)"
    log "scrypt password hashes      : $HASH"

    my -e "DROP DATABASE \`$TEST_DB\`;"

    [ "$PROPS" -gt 0 ] && [ "$ARTS" -gt 0 ] || fail "restored copy is empty"
    [ "$BAD" = "0" ] || fail "restored copy contains replacement characters"
    log "RESTORE TEST PASSED (scratch schema dropped)"
    ;;

  --db)
    KEY="${2:-}"; [ -n "$KEY" ] || fail "usage: --db <s3-key>"
    echo "This OVERWRITES the live database '$DB_NAME'."
    read -r -p "Type RESTORE-PRODUCTION to proceed: " ans
    [ "$ans" = "RESTORE-PRODUCTION" ] || fail "not confirmed"

    mkdir -p "$STAGING"
    SAFETY="$STAGING/pre-restore-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
    log "safety dump of the current database -> $SAFETY"
    mysqldump --single-transaction --quick --routines --triggers \
      --default-character-set=utf8mb4 --databases "$DB_NAME" | gzip -9 > "$SAFETY"

    SRC="$(fetch "$KEY")"
    log "restoring $KEY over $DB_NAME"
    zcat "$SRC" | my || fail "restore failed — undo with: zcat $SAFETY | mysql"
    log "done. Reload the app:  sudo -u elite -H pm2 reload eliteproinfra --update-env"
    log "to undo:               zcat $SAFETY | mysql"
    ;;

  --uploads)
    KEY="${2:-}"; [ -n "$KEY" ] || fail "usage: --uploads <s3-key>"
    SRC="$(fetch "$KEY")"
    log "merging uploads into $APP_ROOT/shared (overwrites same-named files, deletes nothing)"
    tar -xzf "$SRC" -C "$APP_ROOT/shared"
    chown -R elite:elite "$APP_ROOT/shared/uploads"
    log "restored; $(find "$APP_ROOT/shared/uploads" -type f | wc -l) files now present"
    ;;

  *)
    sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
    exit 2
    ;;
esac
