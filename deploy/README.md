# Deploying to the Hostinger VPS

The site runs as a normal Node.js server: `next start` behind nginx, kept alive by PM2.
Nothing is static-exported, so the two mail API routes
(`/api/enquiry`, `/api/career-application`) work exactly as they do locally.

**Hostinger's shared and Cloud plans cannot run this** — they serve static files and PHP
only. These instructions assume a **VPS** with root or sudo SSH access.

Staging target: **new.eliteproinfra.com**. The live PHP site on the apex domain is not
touched until you deliberately cut over ([see below](#cutting-over-to-the-live-domain)).

---

## Files in this repo

| File | Purpose |
| --- | --- |
| [`ecosystem.config.js`](../ecosystem.config.js) | PM2 process definition (port 3000, fork mode) |
| [`deploy/nginx-staging.conf`](nginx-staging.conf) | nginx server block for `new.eliteproinfra.com` |
| [`scripts/deploy.sh`](../scripts/deploy.sh) | Run on the server for every deploy after the first |
| [`scripts/build.sh`](../scripts/build.sh) | Local lint + typecheck + build, before you push |

---

## One-time server setup

Run everything below over SSH on the VPS.

### 1. DNS

In Hostinger hPanel → **Domains → DNS Zone** for `eliteproinfra.com`, add:

```
Type: A     Name: new     Points to: <your VPS IPv4>     TTL: 3600
```

Propagation is usually minutes. Verify before continuing — certbot will fail if the
record has not landed yet:

```bash
dig +short new.eliteproinfra.com
```

### 2. Node.js 22, nginx, PM2, git

Next.js 16 requires Node >= 20.9; use 22 to match what the Netlify config already pins.
On Ubuntu:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v            # expect v22.x

sudo npm install -g pm2
```

### 3. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Port 3000 stays closed to the internet on purpose — nginx reaches it over localhost.

### 4. Clone the repo

```bash
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/Eliteproinfra/company-website.git eliteproinfra
cd eliteproinfra
```

The repo is private, so git will ask for credentials. Use a **GitHub personal access
token** as the password (classic token with `repo` scope), or add a deploy key.

### 5. SMTP credentials

Both forms mail through SMTP. Without this file the forms return a 500 and
`scripts/deploy.sh` refuses to run.

```bash
cp .env.example .env.local
nano .env.local        # fill in SMTP_PASS (Gmail app password, 16 characters)
chmod 600 .env.local
```

`.env.local` is gitignored — it is never committed, and it must be recreated by hand on
any new server.

### 6. First build and start

```bash
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup          # prints one sudo command — run it, so PM2 survives reboots
```

Check the server is answering locally before wiring nginx:

```bash
curl -I http://127.0.0.1:3000     # expect HTTP/1.1 200 OK
```

### 7. nginx

```bash
sudo cp deploy/nginx-staging.conf /etc/nginx/sites-available/new.eliteproinfra.com
sudo ln -s /etc/nginx/sites-available/new.eliteproinfra.com /etc/nginx/sites-enabled/
sudo nginx -t                     # must say "syntax is ok" / "test is successful"
sudo systemctl reload nginx
```

nginx serves `/_next/static/` straight off disk, so its user needs to traverse the app
directory:

```bash
sudo chmod o+x /var/www /var/www/eliteproinfra
```

### 8. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d new.eliteproinfra.com
```

Certbot edits the nginx file in place, adding the `443` block and the HTTP→HTTPS
redirect. Renewal is automatic via its systemd timer; confirm with
`sudo certbot renew --dry-run`.

Open <https://new.eliteproinfra.com> and check: a few pages, the contact form, and the
careers form with a real PDF attached.

---

## Every deploy after that

Locally, before pushing:

```bash
bash scripts/build.sh        # lint + typecheck + build
git push origin main
```

On the server:

```bash
cd /var/www/eliteproinfra
bash scripts/deploy.sh
```

That pulls, `npm ci`s, rebuilds, and reloads PM2. If the build fails, the script stops
before touching PM2 — the old version keeps serving.

Useful:

```bash
pm2 logs eliteproinfra        # live logs, including form-send errors
pm2 status
pm2 restart eliteproinfra
```

> Editing `ecosystem.config.js` or `.env.local` needs `pm2 reload eliteproinfra
> --update-env` (which `deploy.sh` already does) — a plain restart keeps the old
> environment.

---

## Cutting over to the live domain

Only after staging has been signed off:

1. **Back up the existing PHP site and its database** from hPanel. This is the one step
   with no undo.
2. Copy the nginx config to `/etc/nginx/sites-available/eliteproinfra.com`, change
   `server_name` to `eliteproinfra.com www.eliteproinfra.com`, and delete the
   `location = /robots.txt` block — that block exists only to keep staging out of
   Google, and leaving it in would deindex the real site.
3. Enable it, `sudo nginx -t`, reload.
4. Issue a certificate: `sudo certbot --nginx -d eliteproinfra.com -d www.eliteproinfra.com`
5. Point the apex `A` record (and `www`) at the VPS IP in hPanel DNS.
6. Once traffic is confirmed on the new site, remove the staging subdomain and its DNS
   record.

Note that URLs changed from the PHP site's `?id=` query strings to slugs. Before cutover,
add 301 redirects for the old URLs in `next.config.ts` so existing Google rankings and
any printed/shared links survive.

---

## Notes

- [`netlify.toml`](../netlify.toml) is unrelated to this deployment and is ignored by the
  VPS. Delete it once you are sure Netlify is not being used as a fallback.
- Image optimization runs on the server via `sharp`. On glibc Linux it can hold more
  memory than expected; if PM2 starts hitting the 512M `max_memory_restart` ceiling,
  that is the first place to look.
