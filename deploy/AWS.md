# Production runbook — eliteproinfra.com on AWS

The live site. Everything below describes the AWS EC2 deployment that serves
<https://eliteproinfra.com>.

**No secrets appear in this file.** Every credential lives in AWS SSM
Parameter Store; this document only ever names the parameter.

> The older [`README.md`](README.md) in this directory describes the previous
> **Hostinger VPS** deployment. It is kept for reference and no longer
> reflects where the site runs.

---

## 1. Architecture

```
                         eliteproinfra.com / www
                                   │
                    DNS: Hostinger (pixel/byte.dns-parking.com)
                           A -> 3.111.235.72
                                   │  HTTPS
                                   ▼
        ┌──────────────────────────────────────────────────┐
        │ EC2  i-078337884c031bc59  t3.medium  ap-south-1a │
        │                                                  │
        │  nginx :80 ──301──▶ :443  (Let's Encrypt)        │
        │    ├─ /_next/static/ → disk, immutable 1y        │
        │    ├─ /uploads/      → shared/uploads            │
        │    └─ /              → 127.0.0.1:3000            │
        │                                                  │
        │  Next.js 16.3.7 `next start`  127.0.0.1:3000     │
        │    PM2 fork mode, user `elite`, never root       │
        │                                                  │
        │  MySQL 8.0.46       127.0.0.1:3306               │
        └───────────────┬──────────────────────────────────┘
                        ├──▶ CloudWatch  metrics, logs, 5 alarms
                        └──▶ S3          release artifacts + nightly backups

  GitHub Actions ──OIDC──▶ IAM role ──ssm:SendCommand──▶ EC2
```

One origin. The Next.js app serves pages, Server Actions and the API routes
from a single process — there is no separate backend and no `api.` subdomain.

**Deliberately not used:** load balancer, CloudFront, ECR, ECS/EKS, Docker,
RDS. A single low-traffic Node process does not benefit from any of them, and
each would add cost and a failure mode.

---

## 2. AWS resources

| Resource | Identifier |
|---|---|
| Region | `ap-south-1` (Mumbai) |
| EC2 instance | `i-078337884c031bc59` — `elitepro-web-prod`, t3.medium |
| AMI | Ubuntu 24.04 LTS |
| Elastic IP | `3.111.235.72` (`elitepro-web-prod-eip`) |
| EBS | 30 GB gp3, encrypted, delete-on-termination |
| Security group | `sg-001b54f118ef09a56` — `elitepro-web-prod-sg` |
| Instance IAM role | `elitepro-web-prod-instance-role` |
| CI/CD IAM role | `elitepro-web-prod-github-deploy-role` |
| S3 bucket | `elitepro-website-983814062994` |
| SNS topic | `elitepro-website-alerts` |
| Parameter Store | `/elitepro-website/prod/*` |

Termination protection is **on**. IMDSv2 is **required**.

> A separate instance `i-02055bfa785182dcb` (`elite-crm-prod-simple`,
> EIP `13.233.210.31`) runs the CRM application. It is unrelated to this site
> and must not be touched by any procedure here.

### Security group

| Dir | Port | Source | Why |
|---|---|---|---|
| In | 80 | `0.0.0.0/0` | HTTP → HTTPS redirect, ACME renewal |
| In | 443 | `0.0.0.0/0` | the site |
| Out | all | `0.0.0.0/0` | GitHub, npm, AWS APIs, SMTP |

**There is no port 22 rule.** Administration is via SSM Session Manager.
`ssh.socket` is socket-activated on the host but unreachable, and is left in
place only as a break-glass path: if SSM ever fails, add a temporary port-22
rule scoped to your own IP, fix the problem, then remove the rule.

### IAM — least privilege

`elitepro-web-prod-instance-role`
- `AmazonSSMManagedInstanceCore`, `CloudWatchAgentServerPolicy`
- inline: read/write `/elitepro-website/*` in Parameter Store
- inline: `s3:GetObject` on `releases/*`, `s3:PutObject` on `backups/*` only

`elitepro-web-prod-github-deploy-role` — assumed only via GitHub OIDC, pinned to
```
repo:Eliteproinfra@302557693/company-website@1322515503:ref:refs/heads/main
```
That subject carries immutable numeric org and repo IDs, so the trust survives
a rename and cannot be claimed by a renamed squatter. It can only
`s3:PutObject` under `releases/*` and `ssm:SendCommand` to this one instance.
**No AWS access keys exist in the repository or its GitHub secrets.**

---

## 3. DNS

Hosted at **Hostinger**, nameservers `pixel.dns-parking.com` /
`byte.dns-parking.com`.

| Type | Name | Value | Purpose |
|---|---|---|---|
| A | `@` | `3.111.235.72` | the site |
| A | `www` | `3.111.235.72` | redirects to apex |
| MX | `@` | *(mail provider)* | **company email — never change while debugging the site** |
| TXT | `@` | SPF | **company email** |
| CNAME | `autodiscover`, `autoconfig` | mail provider | **company email** |

The apex is canonical: [`app/layout.tsx`](../app/layout.tsx) sets
`metadataBase` to `https://eliteproinfra.com` and
[`app/sitemap.ts`](../app/sitemap.ts) emits apex URLs, so nginx 301s `www` to
the apex.

> **The site and the email live in the same zone.** Website changes touch only
> the `@` and `www` A records. Removing or editing MX/SPF/autodiscover breaks
> company email, which also breaks the site's contact forms, since they send
> over SMTP.

---

## 4. TLS

Let's Encrypt, covering `eliteproinfra.com` and `www.eliteproinfra.com`.

- Initial issuance used HTTP-01 via the webroot `/var/www/certbot`.
- Renewal is automatic: `certbot.timer`, plus the deploy hook
  `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh`.
- **That hook is load-bearing.** Certbot renews the file on disk but nginx
  keeps the old certificate in memory; without the reload the site would serve
  an expired certificate while renewal reported success.

TLS parameters are in [`nginx-ssl-params.conf`](nginx-ssl-params.conf): TLS
1.2/1.3 only, forward-secret AEAD ciphers, session tickets off. No OCSP
stapling — Let's Encrypt retired OCSP and its certificates carry no responder
URL.

```bash
sudo certbot certificates          # expiry
sudo certbot renew --dry-run       # prove unattended renewal works
```

---

## 5. Environment variables

**Parameter Store is the source of truth.** `shared/.env.local` is a rendered
artefact (`600 elite:elite`) and can be rebuilt at any time.

| Variable | Req | Purpose |
|---|---|---|
| `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` | ✅ | MySQL connection |
| `DB_PASSWORD` | ✅ | SecureString |
| `DB_POOL_SIZE` | ⬜ | pool size, default 10 |
| `SMTP_HOST` `SMTP_PORT` `SMTP_SECURE` `SMTP_USER` `SMTP_TO` | ✅ | form delivery |
| `SMTP_PASS` | ✅ | SecureString — **forms return 500 without it** |
| `INSTAGRAM_ACCESS_TOKEN` | ⬜ | SecureString, 60-day expiry |
| `INSTAGRAM_REVALIDATE_SECONDS` | ⬜ | default 120 |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | ✅ | SecureString — see below |
| `APP_COMMIT` | auto | written per release into `.env.production` |
| `NODE_ENV` `PORT` | auto | set by PM2 |

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` is fixed deliberately. Next 16 generates a
fresh key per build, and every release here is a new build, so without a stable
key a visitor with an already-open tab gets "Failed to find Server Action"
after each deploy — which would hit every admin form.

To change a value:
```bash
aws ssm put-parameter --region ap-south-1 \
  --name "/elitepro-website/prod/SMTP_PASS" \
  --type SecureString --overwrite --value '<value>'

sudo bash /var/www/eliteproinfra/shared/render-env.sh
sudo -u elite -H pm2 reload eliteproinfra --update-env
```

---

## 6. Database

MySQL 8.0.46 on the instance, bound to `127.0.0.1` — unreachable from off-box
even if the security group were misconfigured.

- `root` uses `auth_socket`: no password, cannot authenticate over TCP.
- App user `eliteweb@localhost` has `SELECT, INSERT, UPDATE, DELETE, CREATE,
  INDEX, ALTER, REFERENCES` on `elitepro_web` only — **no `DROP`, no
  `GRANT OPTION`, no access to any other schema.**
- Schema: [`lib/db/schema.sql`](../lib/db/schema.sql), 7 tables, utf8mb4.

**There is no migration framework.** `scripts/db-setup.mjs` applies the schema
idempotently (`CREATE TABLE IF NOT EXISTS`) and never drops anything. A schema
change is therefore additive-only and is *not* reversed by a code rollback.

```bash
cd /var/www/eliteproinfra/current
sudo -u elite -H npm run db:setup              # schema + first admin user
sudo -u elite -H npm run db:seed               # import lib/data content
sudo -u elite -H npm run db:passwd -- --user admin   # rotate, revokes sessions
```

---

## 7. Deployment

Atomic releases:

```
/var/www/eliteproinfra/
├── releases/<sha12>/      extracted + built, 5 kept
├── shared/
│   ├── .env.local         600, rendered from Parameter Store
│   ├── uploads/           admin uploads, symlinked into each release
│   └── next-cache/        Next build cache, symlinked to .next/cache
└── current -> releases/<sha12>
```

This layout exists for three concrete reasons:
1. `next build` writes into `.next/` while `next start` reads from it —
   building in place can break the running site mid-deploy.
2. `public/uploads` is gitignored, so an in-place rebuild would orphan every
   admin-uploaded image. Here it is a symlink into `shared/`.
3. Rollback becomes a symlink repoint plus a reload.

**Normal path:** merge to `main`. CI runs; if it passes, CD deploys
automatically. Nothing manual.

**Manual deploy:**
```bash
gh workflow run deploy.yml --ref main            # or with -f sha=<commit>
```

**On the server directly** (needs the artifact already in S3):
```bash
sudo -u elite -H bash /var/www/eliteproinfra/shared/aws-deploy.sh <full-sha>
```

The script **fails and automatically rolls back** if `/health` does not report
`ok` with the expected commit. A completed SSM command is never treated as a
successful deploy.

---

## 8. CI/CD

`.github/workflows/ci.yml` — on PRs and pushes to `main`:
`npm ci` → lint → typecheck (`next typegen` + `tsc`) → production build →
`npm audit --omit=dev --audit-level=high`.

`.github/workflows/deploy.yml` — on CI success for `main`, or manual dispatch:
1. check out the exact commit CI validated
2. `git archive` a source artifact
3. **refuse to ship** if it contains `_public_html/`, any `.env`, a `.pem` or `node_modules`
4. assume the deploy role via OIDC
5. upload to `s3://…/releases/<sha>.tar.gz`
6. run `aws-deploy.sh` over SSM
7. verify **from outside the instance** that the public site reports healthy on
   that commit and the homepage returns 200

Ordering is enforced by `workflow_run`, so a red build cannot reach production.

---

## 9. Rollback

```bash
sudo -u elite -H bash /var/www/eliteproinfra/shared/aws-rollback.sh --list
sudo -u elite -H bash /var/www/eliteproinfra/shared/aws-rollback.sh          # previous
sudo -u elite -H bash /var/www/eliteproinfra/shared/aws-rollback.sh <sha12>  # specific
```

Takes about 2 seconds: the target release is already built, so no network, no
npm, no rebuild. Verified in a live drill.

**Limitation — read this before relying on it.** Rollback reverts
**application code only**. There are no down-migrations, so a schema change is
not undone. The current schema is additive-only, so code rollback is safe
today; if a future release alters or drops columns, restore the database too.

---

## 10. Backups

Nightly at 02:30 IST via `elitepro-backup.timer`.

- MySQL dump (`--single-transaction`, no locking) and an uploads archive, both
  gzipped to `s3://elitepro-website-983814062994/backups/YYYY/MM/`.
- 90-day retention via the bucket lifecycle rule, **not** by the script
  deleting remote objects — a compromised instance must not be able to erase
  backup history.
- `.env.local` is deliberately **not** backed up: it is rendered from Parameter
  Store, which is already durable and encrypted.
- The job verifies rather than assumes: valid gzip, ≥7 `CREATE TABLE`
  statements, and each S3 object present at exactly the local byte size.

```bash
sudo /var/www/eliteproinfra/shared/aws-backup.sh            # run now
sudo /var/www/eliteproinfra/shared/aws-restore.sh --list
```

### Restore

```bash
# SAFE — restores into a scratch schema, asserts row counts and
# multi-byte integrity, then drops it. Run this periodically.
sudo /var/www/eliteproinfra/shared/aws-restore.sh --test backups/2026/10/db-….sql.gz

# DESTRUCTIVE — overwrites the live database. Requires typing
# RESTORE-PRODUCTION and takes a safety dump first.
sudo /var/www/eliteproinfra/shared/aws-restore.sh --db  backups/2026/10/db-….sql.gz
sudo -u elite -H pm2 reload eliteproinfra --update-env

# Uploads (merges; deletes nothing)
sudo /var/www/eliteproinfra/shared/aws-restore.sh --uploads backups/2026/10/uploads-….tar.gz
```

### Full rebuild from nothing

1. Launch a t3.medium Ubuntu 24.04 instance with `elitepro-web-prod-instance-role`.
2. Install Node 22, nginx, MySQL 8, PM2, Certbot, AWS CLI.
3. Create the directory layout and the `elite` user.
4. `render-env.sh` to rebuild `.env.local` from Parameter Store.
5. Create the database and user; restore the newest dump.
6. Deploy the newest release artifact from S3.
7. Restore uploads.
8. Re-issue the certificate, move the Elastic IP, install the nginx config.

---

## 11. Monitoring

Alarms publish to the `elitepro-website-alerts` SNS topic.

| Alarm | Fires when |
|---|---|
| `elitepro-web-site-down` | `/health` not `ok` for 10 min (missing data = breaching) |
| `elitepro-web-instance-unhealthy` | EC2/system status check fails 3 min |
| `elitepro-web-cpu-high` | CPU > 85% for 15 min |
| `elitepro-web-disk-high` | root volume > 80% |
| `elitepro-web-memory-high` | memory > 90% for 15 min |

`elitepro-health.timer` curls the **public** URL every 5 minutes and publishes
`ElitePro/Website HealthCheckOk`, so the check exercises DNS, TLS, nginx and
the app together rather than just the local process.

Logs shipped to CloudWatch: `/elitepro/website/nginx-error`,
`/elitepro/website/app-error` (30-day retention).

---

## 12. Common commands

All run over SSM Session Manager (`EC2 → Connect → Session Manager`), or:
```bash
aws ssm start-session --target i-078337884c031bc59 --region ap-south-1
```

```bash
# application
sudo -u elite -H pm2 status
sudo -u elite -H pm2 logs eliteproinfra --lines 100
sudo -u elite -H pm2 reload eliteproinfra --update-env
readlink -f /var/www/eliteproinfra/current          # which release is live

# health
curl -s https://eliteproinfra.com/health | jq

# nginx
sudo nginx -t && sudo systemctl reload nginx
sudo tail -f /var/log/nginx/eliteproinfra.error.log

# database
sudo mysql elitepro_web                              # root via auth_socket
sudo mysql -N -B elitepro_web -e "SELECT COUNT(*) FROM enquiries;"

# secrets
aws ssm get-parameters-by-path --region ap-south-1 \
  --path /elitepro-website/prod --query 'Parameters[].Name' --output table

# first admin password (generated once, stored, never printed to a log)
aws ssm get-parameter --region ap-south-1 \
  --name /elitepro-website/prod/ADMIN_INITIAL_PASSWORD \
  --with-decryption --query Parameter.Value --output text
```

---

## 13. Troubleshooting

**Site returns 502** — the Node process is down.
```bash
sudo -u elite -H pm2 status
sudo -u elite -H pm2 logs eliteproinfra --err --lines 50
sudo -u elite -H pm2 restart eliteproinfra
```

**`/health` returns 503** — MySQL is configured but unreachable. The public
pages still render (they read `lib/data`, not the database), but `/admin` is
broken.
```bash
sudo systemctl status mysql
sudo mysql -e "SELECT 1;"
```

**Forms return 500** — almost always a missing or wrong `SMTP_PASS`.
```bash
sudo -u elite -H pm2 logs eliteproinfra --err | grep -i smtp
```

**Deploy failed** — the script health-gates and auto-rolls-back, so the site
should still be up on the previous release. Check the Actions log, then
`readlink -f /var/www/eliteproinfra/current`.

**Certificate expiring** — check the renewal timer and the reload hook:
```bash
sudo certbot renew --dry-run
systemctl list-timers certbot.timer
```

**Visitors getting 429** — rate limiting is working, or the limits are too
tight. Zones are in `/etc/nginx/conf.d/elitepro-ratelimit.conf`.
```bash
grep "limiting requests" /var/log/nginx/eliteproinfra.error.log | tail
```

**Instagram section shows a fallback panel** — the token expired (60 days) or
Meta blocked the app. It degrades gracefully and never breaks the page.
Refresh with `npm run instagram:token`.

---

## 14. Known gaps

Pre-existing issues, outside the scope of the migration, recorded so they are
not rediscovered as surprises.

1. **The admin CMS is not wired to the public site.** Every public page reads
   `lib/data/*.ts`; only `/admin` reads MySQL. Content edited in the admin is
   saved to the database but **will not appear on the site**. The admin actions
   already call `revalidatePath`, so the remaining work is switching the page
   components over to the query layer.

2. **No Content-Security-Policy.** The site loads Google Fonts, embeds a Google
   Maps iframe, pulls Instagram CDN images and inlines schema.org JSON-LD. A
   CSP must be written and tested against all four or it will silently break
   the page.

3. **Instagram feed is blocked by Meta** at the app level (error code 200), not
   a token problem. The section falls back to a static panel.

4. **Single instance, single AZ.** Correct for this traffic, but it is a single
   point of failure. Recovery is the rebuild procedure in §10.

5. **`_public_html/`** in the repo working tree is an infected snapshot of the
   compromised previous host. It is gitignored and has never been deployed.
   Deployment is git-archive based specifically so it cannot be.
