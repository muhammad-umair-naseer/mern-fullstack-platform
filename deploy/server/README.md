# Phase 1 server setup (Task A): main site + admin

Contabo Cloud VPS, Ubuntu, IP 13.140.220.173, behind Cloudflare (orange cloud).
Run each step only when the previous one checks out. Every script is safe to
re-run. Keep one SSH session open while you test changes in a second window.

SSH always uses the IP, never the domain (Cloudflare proxies the domain).

## A1. SSH key (on your Mac)

```sh
cd ~/"Documents/Raja/MERN PROJECT"   # this repo
bash deploy/server/00-mac-ssh-key.sh 13.140.220.173
ssh root@13.140.220.173 'lsb_release -a'   # no password prompt now
```
Type the root password into the Terminal when asked, never into a chat.

## A2. Copy the repo to the server

```sh
# on your Mac
rsync -az --delete --exclude node_modules --exclude .git --exclude 'client/build' \
  --exclude '*.log' ./ root@13.140.220.173:/opt/cortexis/
```
(Task B replaces this with `deploy/deploy.sh`.)

## A3. Hardening + deploy user (on the server, as root)

```sh
ssh root@13.140.220.173
cd /opt/cortexis && bash deploy/server/01-base-hardening.sh
```
Then, in a NEW Mac Terminal window (keep the root one open):
```sh
ssh deploy@13.140.220.173
sudo whoami        # prints: root
```
Only when that works: `sudo bash /opt/cortexis/deploy/server/05-ssh-lockdown.sh`
(turns off password and root logins). Test `ssh deploy@...` again in a new window.
From now on use `ssh deploy@13.140.220.173`.

## A4. Docker + Nginx (as deploy)

```sh
sudo chown -R deploy:deploy /opt/cortexis
cd /opt/cortexis && sudo bash deploy/server/02-install-docker-nginx.sh
exit                      # log out and back in so the docker group applies
ssh deploy@13.140.220.173 'docker run --rm hello-world'
```

## A5. Cloudflare Origin Certificate (in the browser, then the server)

1. dash.cloudflare.com → your domain → **SSL/TLS → Origin Server → Create Certificate**.
2. Keep "Generate private key and CSR with Cloudflare", key type **RSA (2048)**.
3. Hostnames: `cortexissolutionhub.com` and `*.cortexissolutionhub.com`
   (the wildcard covers www, admin, staging and later the games). Validity: 15 years. **Create**.
4. The page shows the **Origin Certificate** and the **Private Key**. The key is shown
   ONCE. On the server:
   ```sh
   sudo install -d -m 700 /etc/ssl/cloudflare
   sudo nano /etc/ssl/cloudflare/cortexissolutionhub.com.pem   # paste the certificate, Ctrl+O Enter Ctrl+X
   sudo nano /etc/ssl/cloudflare/cortexissolutionhub.com.key   # paste the private key
   ```
   Paste only into nano on the server, never into chat or a repo.
5. Install the site config:
   ```sh
   cd /opt/cortexis && sudo bash deploy/server/04-nginx-site.sh
   ```
6. Back in Cloudflare: **SSL/TLS → Overview → Full (strict)**. Also
   **SSL/TLS → Edge Certificates → Always Use HTTPS: On**.

The website itself answers once Task B starts the containers; until then
https://cortexissolutionhub.com shows a 502 from Nginx, which is expected.

## A6. Admin behind Cloudflare Access (free)

1. dash.cloudflare.com → **Zero Trust** (left sidebar). First time: pick a team
   name (e.g. `cortexis`) and the **Free** plan (it may ask for a card for
   verification; Free costs nothing).
2. **Settings → Authentication → Login methods**: "One-time PIN" should be listed
   (it is on by default). It emails a code; no password to manage.
3. **Access → Applications → Add an application → Self-hosted**.
   - Application name: `Cortexis Admin`; session duration: `24 hours`.
   - Public hostname: subdomain `admin`, domain `cortexissolutionhub.com`, path empty.
   - Next.
4. Add a policy: name `Owners`, action **Allow**, include **Emails** →
   your email and Abdullah's. Save the policy, then **Save** the application.
5. Test in a private window: https://admin.cortexissolutionhub.com should show a
   Cloudflare sign-in page; enter your email, then the code it sends you.
   Anyone else is refused before they ever reach the server.

## A7. Email with Brevo (free tier, about 300 emails a day)

1. Sign up at brevo.com. **Settings (cog) → Senders, domains & IPs → Domains →
   Add a domain** → `cortexissolutionhub.com`.
2. If offered, choose to authenticate with **Cloudflare automatically**;
   otherwise "authenticate yourself", and add each record Brevo shows in
   Cloudflare **DNS → Records → Add record**. Copy the values exactly from Brevo:
   - **TXT** `@` → `brevo-code:...` (ownership code)
   - **DKIM**: the record(s) Brevo lists (CNAME `brevo1._domainkey` /
     `brevo2._domainkey`, or one TXT), **Proxy status: DNS only (grey cloud)**
   - **SPF**: one TXT on `@` only. If you have none:
     `v=spf1 include:spf.brevo.com ~all`. If one exists (e.g. Cloudflare Email
     Routing's), add `include:spf.brevo.com` to it; never create a second SPF record.
   - **DMARC**: TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:<address>`.
     Easiest: Cloudflare **Email → DMARC Management → Enable**, which adds the
     record with a free report address. Move to `p=quarantine` after a few
     clean weeks.
3. Back in Brevo press **Authenticate / Verify**; all records should turn green
   (DNS can take a few minutes).
4. **Settings → SMTP & API → SMTP → Generate a new SMTP key**. You get:
   server `smtp-relay.brevo.com`, port `587`, a login, and the key. These go into
   the server's `.env` in Task B (`SMTP_HOST`, `SMTP_PORT=587`, `SMTP_USER`,
   `SMTP_PASS`, `SMTP_FROM="Cortexis <no-reply@cortexissolutionhub.com>"`).
   Never paste the key into chat.

## Checklist after Task A

- [ ] `ssh deploy@13.140.220.173` works with no password; `ssh root@...` is refused
- [ ] `sudo ufw status` shows OpenSSH, 80, 443 allowed
- [ ] `sudo fail2ban-client status sshd` shows the jail running
- [ ] `docker run --rm hello-world` works as deploy
- [ ] `sudo nginx -t` passes; Cloudflare is on Full (strict)
- [ ] https://staging.cortexissolutionhub.com shows "Staging is not set up yet."
- [ ] https://admin.cortexissolutionhub.com asks for the Cloudflare email code
- [ ] Brevo shows the domain as authenticated

Take a **manual Contabo snapshot** (Contabo panel → your VPS → Snapshots) after
A4 and before every big change.

# Task B: deployment

Build happens ON THE SERVER inside a throwaway Node 24 + Chromium container
(`deploy/build.Dockerfile`); nothing but Docker and Nginx is installed on the host.

## B1. Production settings (server only, once)
```sh
ssh deploy@13.140.220.173
cd /opt/cortexis && bash deploy/server/06-make-env.sh
```
Creates `/opt/cortexis/.env` (mode 600, secrets generated there, never printed)
and `client/.env.production` (public values only). Re-running only adds missing
keys; it never changes an existing value.

Read your admin password on the server: `grep '^ADMIN_PASSWORD=' /opt/cortexis/.env`

Add Brevo later yourself: `nano /opt/cortexis/.env` → set `SMTP_USER` and
`SMTP_PASS`, save, then redeploy (B3). Until then the site runs but sends no email.

## B2. Admin stays closed
`admin.cortexissolutionhub.com` returns 403 from Nginx until Cloudflare Access is
set up (deploy/nginx/cortexis.conf explains how to open it). Apply with:
`sudo bash /opt/cortexis/deploy/server/04-nginx-site.sh`

## B3. Deploy (and every future redeploy), from your Mac
```sh
bash deploy/deploy.sh
```
Uploads the code, then on the server: builds the website, backs up the
database (keeps the last 5 in /opt/cortexis/backups/predeploy), builds the
images (the previous website image is tagged `cortexis-website:rollback`),
runs migrations, restarts the website and admin, and waits for `/ready`.

## Rollback
```sh
ssh deploy@13.140.220.173
cd /opt/cortexis
docker tag cortexis-website:rollback cortexis-cortexis-website   # the compose image name
docker compose up -d --no-build cortexis-website
```
Database rollbacks are a deliberate decision: restore from
`backups/predeploy/*.dump` only if a migration went wrong (it loses newer writes).

## Checklist after Task B
- [ ] https://cortexissolutionhub.com loads (flush the Mac DNS cache if it says not found)
- [ ] https://cortexissolutionhub.com/ready returns OK
- [ ] A course page and a blog guide render; sign-up shows the form
- [ ] https://admin.cortexissolutionhub.com returns 403
- [ ] `docker compose ps` shows postgres, redis, cortexis-website, admin healthy

## Task C: backups

Daily at 22:00 UTC (03:00 Pakistan), `backup.sh` makes one archive: the database dump, the site files with both `.env` files, our Nginx config, the SSL certificate and key, and the cron files. It keeps 7 daily and 4 weekly (Sunday) archives in `/var/backups/cortexis` and the same set on Google Drive, encrypted by rclone in the folder `cortexis-backups`. The log is `/var/log/site-backup.log`, and any failure exits non-zero.

### C1. Authorize Google Drive (on your Mac, once)
1. Download rclone (no install needed):
   `cd ~/Downloads && curl -LO https://downloads.rclone.org/rclone-current-osx-amd64.zip && unzip -o rclone-current-osx-amd64.zip`
2. Run: `~/Downloads/rclone-*-osx-amd64/rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlLmZpbGUifQ"`
   (the last argument means scope `drive.file`: rclone can see only the files it creates, nothing else in your Drive).
3. A browser opens. Sign in as cortexis.solution.hub@gmail.com and click Allow. If Google says the app is unverified, use Advanced, then Go to rclone.
4. The terminal prints a token between `--->` and `<---End paste`. Copy the `{...}` line. It is a secret: never paste it into chat. It goes only into the server prompt in C2.

### C1b. Your own Google OAuth client (needed: rclone's shared one hits Google's rate limit)
1. https://console.cloud.google.com (signed in as cortexis.solution.hub@gmail.com): create a project, e.g. `cortexis-backup`.
2. APIs & Services, Library: enable **Google Drive API**.
3. Google Auth Platform (OAuth consent screen): set it up as **External**, app name `cortexis-backup`, your email. Under Data access, add the scope `.../auth/drive.file`. Under Audience, click **Publish app**. Otherwise Google expires the login after 7 days. drive.file needs no Google review.
4. Clients, Create client: type **Desktop app**. Keep the Client ID and Client secret on screen. Never paste them into chat.
5. On the Mac (zsh; it asks for the ID and the hidden secret, then opens the browser):
   ```
   read "cid?Client ID: "; read -s "csec?Client secret: "; echo
   ~/Downloads/rclone-*-osx-amd64/rclone authorize "drive" "$(printf '{"scope":"drive.file","client_id":"%s","client_secret":"%s"}' "$cid" "$csec" | base64 | tr -d '=\n')"
   unset cid csec
   ```
6. On the server: `sudo bash /opt/cortexis/deploy/server/07-backup-setup.sh --reauth` asks for the client ID, the secret and the new token, with all input hidden.

### C2. Set up on the server
`sudo bash /opt/cortexis/deploy/server/07-backup-setup.sh`: paste the token when asked (the input is hidden). Then read `/root/cortexis-backup-passwords.txt` (`sudo cat`) and save both passwords in your password manager. Without them, the Drive copies cannot be decrypted.

### C3. First backup and restore test
- `sudo bash /opt/cortexis/deploy/server/backup.sh` runs a backup now.
- `sudo bash /opt/cortexis/deploy/server/restore.sh list` lists the backups here and on Drive.
- `sudo bash /opt/cortexis/deploy/server/restore.sh fetch <name>` downloads one from Drive.
- `sudo bash /opt/cortexis/deploy/server/restore.sh test <archive>` is safe: it restores into a throwaway database, counts users and courses, then drops it.
- `restore.sh apply <archive>` is destructive: it replaces the live database and config files. It asks you to type RESTORE. On a new server, run Task A (01–05) first, then `fetch` + `apply`.

Repeat the Drive `fetch` + `test` once a month.

### Contabo snapshots
Before risky changes (OS upgrades, Nginx/SSH changes), take a manual snapshot in the Contabo panel (Your services, then Snapshots). It is a quick whole-disk rollback. It does not replace the offsite backups, because it lives with Contabo.
