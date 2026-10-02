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
# The password is never printed. The SMTP AUTH exchange is done with a
# base64-encoded credential that is built in-memory and never echoed.

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
echo "=== 3. authenticate against the SMTP server directly ==="
# AUTH PLAIN payload: \0user\0pass, base64. Built here and never printed.
AUTH=$(printf '\0%s\0%s' "$SMTP_USER" "$SMTP_PASS" | base64 -w0)
RESP=$(printf 'EHLO eliteproinfra.com\r\nAUTH PLAIN %s\r\nQUIT\r\n' "$AUTH" \
  | timeout 25 openssl s_client -starttls smtp -connect "${SMTP_HOST}:${SMTP_PORT}" -crlf -quiet 2>/dev/null)

if printf '%s' "$RESP" | grep -q "235"; then
  P "SMTP authentication accepted (235)"
elif printf '%s' "$RESP" | grep -q "535"; then
  F "SMTP rejected the credentials (535)"
  printf '%s\n' "$RESP" | grep -E "^5[0-9][0-9]" | head -3 | sed 's/^/        /'
  echo "        -> wrong app password, or app passwords are disabled for this"
  echo "           Workspace user (Admin console > Security > Less secure apps /"
  echo "           app passwords), or 2-Step Verification is not enabled."
  exit 1
else
  F "unexpected SMTP response"
  printf '%s\n' "$RESP" | tail -5 | sed 's/^/        /'
  exit 1
fi

echo
echo "=== 4. reload the app with the new environment ==="
sudo -u elite -H pm2 reload eliteproinfra --update-env >/dev/null 2>&1
sleep 6
curl -s http://127.0.0.1:3000/health | jq -c '{status,commit}' | sed 's/^/  /'

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
tail -20 /var/log/eliteproinfra/app-error.log 2>/dev/null | grep -i "smtp\|mail\|enquiry" | tail -5 | sed 's/^/  /' \
  || echo "  (no mail errors logged)"

echo
printf '\n===== %d passed, %d failed =====\n' "$pass" "$fail"
if [ "$fail" -eq 0 ]; then
  echo "Check ${SMTP_TO} for a message titled:"
  echo "  \"New enquiry - deployment smoke test from Deployment test ${STAMP}\""
fi
exit "$fail"
