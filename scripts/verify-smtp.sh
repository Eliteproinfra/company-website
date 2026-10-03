#!/usr/bin/env bash
#
# Apply the SMTP credential from Parameter Store and prove mail actually
# sends. RUN ON THE SERVER AS ROOT.
#
#   sudo bash /var/www/eliteproinfra/shared/verify-smtp.sh
#
# Run this after setting /elitepro-website/prod/SMTP_PASS. It re-renders the
# env file, reloads the app, authenticates against the SMTP server directly,
# and finally submits a real enquiry through the public form so the whole
# path is exercised end to end.
#
# The password is never printed. It reaches the auth check through the
# environment rather than argv, which /proc exposes to every local user.
#
# A failing check no longer aborts the run: the app is reloaded first, and the
# remaining steps still report, so one bad signal cannot hide the rest. The
# script's exit status is the number of failed checks.

set -uo pipefail

APP_ROOT=/var/www/eliteproinfra
ENV_FILE="$APP_ROOT/shared/.env.local"
pass=0; fail=0
P(){ printf '  PASS  %s\n' "$1"; pass=$((pass+1)); }
F(){ printf '  FAIL  %s\n' "$1"; fail=$((fail+1)); }

echo "=== 1. re-render .env.local from Parameter Store ==="
bash "$APP_ROOT/shared/render-env.sh" | sed 's/^/  /'

SMTP_HOST=$(grep '^SMTP_HOST=' "$ENV_FILE" | cut -d= -f2-)
SMTP_PORT=$(grep '^SMTP_PORT=' "$ENV_FILE" | cut -d= -f2-)
SMTP_USER=$(grep '^SMTP_USER=' "$ENV_FILE" | cut -d= -f2-)
SMTP_PASS=$(grep '^SMTP_PASS=' "$ENV_FILE" | cut -d= -f2-)
SMTP_TO=$(grep   '^SMTP_TO='   "$ENV_FILE" | cut -d= -f2-)

echo
echo "=== 2. configuration ==="
printf '  host=%s port=%s user=%s to=%s\n' "$SMTP_HOST" "$SMTP_PORT" "$SMTP_USER" "$SMTP_TO"
if [ -n "$SMTP_PASS" ]; then
  # Google app passwords are 16 characters, often shown in groups of four.
  # A pasted value containing spaces still works, but flag it so a wrong
  # paste is obvious.
  P "SMTP_PASS present (${#SMTP_PASS} characters)"
  case "$SMTP_PASS" in
    *" "*) echo "        note: contains spaces - Google displays the app password" ;;
    *)     ;;
  esac
else
  F "SMTP_PASS is still empty - set it first:"
  echo "        aws ssm put-parameter --region ap-south-1 \\"
  echo "          --name /elitepro-website/prod/SMTP_PASS \\"
  echo "          --type SecureString --overwrite --value '<16-char app password>'"
  exit 1
fi

echo
echo "=== 3. reload the app with the new environment ==="
# Before the auth check, deliberately. Step 1 has already rewritten .env.local,
# so from here on the file and the running process disagree; aborting in between
# used to leave the app serving stale credentials while the env file looked
# correct — a confusing half-applied state. Reload first, diagnose after.
sudo -u elite -H pm2 reload eliteproinfra --update-env >/dev/null 2>&1
sleep 6
curl -s http://127.0.0.1:3000/health | jq -c '{status,commit}' | sed 's/^/  /'

echo
echo "=== 4. authenticate against the SMTP server ==="
# Uses the app's own nodemailer rather than a hand-rolled openssl exchange.
# The previous version piped EHLO + AUTH PLAIN + QUIT in a single write, which
# is command pipelining before the server has advertised PIPELINING; Gmail
# answers "451-4.5.0 SMTP protocol violation" and the check failed against
# credentials that were in fact valid. Driving the real client also means this
# tests the exact code path the forms use.
#
# The password is passed through the environment, never on the command line
# (argv is world-readable via /proc) and never printed.
AUTH_OUT=$(cd /var/www/eliteproinfra/current && \
  SMTP_HOST="$SMTP_HOST" SMTP_PORT="$SMTP_PORT" SMTP_USER="$SMTP_USER" SMTP_PASS="$SMTP_PASS" \
  timeout 40 node -e '
    const nodemailer = require("nodemailer");
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    }).verify()
      .then(() => console.log("OK"))
      .catch((e) => { console.log("ERR " + e.message.replace(/\s+/g, " ")); });
  ' 2>&1)

case "$AUTH_OUT" in
  OK*) P "SMTP authentication accepted" ;;
  *"Invalid login"*|*535*)
    F "SMTP rejected the credentials"
    printf '        %s\n' "$AUTH_OUT"
    echo "        -> wrong app password, or app passwords are disabled for this"
    echo "           Workspace user (Admin console > Security > Less secure apps /"
    echo "           app passwords), or 2-Step Verification is not enabled."
    ;;
  *)
    F "could not verify SMTP auth"
    printf '        %s\n' "$AUTH_OUT"
    ;;
esac

echo
echo "=== 5. submit a REAL enquiry through the public form ==="
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
BODY=$(curl -s -X POST -H 'Content-Type: application/json' \
  -H 'Host: eliteproinfra.com' --resolve eliteproinfra.com:443:127.0.0.1 -k \
  --data "{\"source\":\"deployment smoke test\",\"fields\":{\"Name\":\"Deployment test ${STAMP}\",\"Email\":\"noreply@eliteproinfra.com\",\"Message\":\"Automated post-deployment check. Safe to delete.\"}}" \
  https://eliteproinfra.com/api/enquiry)
echo "  response: $BODY"
printf '%s' "$BODY" | grep -q '"ok":true' && P "enquiry form accepted and sent" || F "enquiry form did not send"

echo
echo "=== 6. application log ==="
# PM2 appends its instance number, so the file is app-error-0.log, not
# app-error.log. The old glob-less path matched nothing, so this step reported
# "no mail errors logged" even while every submission was failing — the
# 500s on 2026-10-03 sat in app-error-0.log unnoticed. Glob it.
LOGS=$(ls /var/log/eliteproinfra/app-error*.log 2>/dev/null)
if [ -z "$LOGS" ]; then
  echo "  (no application error log found)"
else
  # shellcheck disable=SC2086
  MAIL_ERRS=$(grep -ih "smtp\|mail\|enquiry" $LOGS 2>/dev/null | tail -5)
  if [ -n "$MAIL_ERRS" ]; then
    printf '%s\n' "$MAIL_ERRS" | sed 's/^/  /'
  else
    echo "  (no mail errors logged)"
  fi
fi

echo
printf '\n===== %d passed, %d failed =====\n' "$pass" "$fail"
if [ "$fail" -eq 0 ]; then
  echo "Check ${SMTP_TO} for a message titled:"
  echo "  \"New enquiry - deployment smoke test from Deployment test ${STAMP}\""
fi
exit "$fail"
