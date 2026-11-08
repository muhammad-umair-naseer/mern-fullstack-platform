# Main website deployment: Contabo VPS + Cloudflare DNS

> Production update, 9 November 2026: the existing live server has automatic
> Cloudflare purge installed after deployment readiness. See
> [automation status and setup](CLOUDFLARE-AUTOPURGE.md) and
> [cache policy](CLOUDFLARE-CACHE.md). Manual purge/content verification passed;
> a full release through the installed hook is still pending. The older guide
> below predates the live deployment. This change preserves the server-supplied
> remote-deploy script and builder; it is not a complete first-install workflow.

Use a Linux VPS with root/SSH access, not ordinary PHP/shared hosting. Begin with the website, PostgreSQL, Redis and staff portal; games are an optional Compose profile. The intended low-cost VPS must be load-tested before promising a traffic capacity. No VPS has been purchased or configured by these changes.

## Before building

1. Choose the final website domain and `admin.<domain>`. Set DNS A records to the VPS; add AAAA only if IPv6 actually works.
2. Use Ubuntu 24.04 LTS or a supported Debian release. Install security updates, Docker Engine with Compose, Nginx and Certbot from their official distribution instructions.
3. Use SSH keys. Allow SSH, TCP 80 and 443 through the host/provider firewall. PostgreSQL/Redis have no host port mappings; website/admin/game mappings bind only to 127.0.0.1. Check externally that 5000, 6001, 3001, 4001, 5001, 7001, 5432 and 6379 are unreachable.
4. Copy `.env.example` to `.env` and restrict it with `chmod 600 .env`. Generate DISTINCT random JWT_SECRET, GAME_SSO_SECRET and EMAIL_QUEUE_SECRET values. Set a strong unique admin password and real SMTP credentials. Never paste credentials into issues or logs. Historical exposed keys are revoked; local rotation does not rotate copies on another machine.
5. Set SITE_URL, ADMIN_URL and exact CORS_ORIGINS; include website and admin origins. HTTPS is required in production. Nginx overwrites forwarded addresses and Express trusts one proxy hop. If enabling Cloudflare proxying, configure Nginx real-IP handling using Cloudflare's published current IP ranges and verify client-IP limits with two clients. Until then, use DNS-only mode; do not trust arbitrary forwarded headers.
6. Verify the SMTP sender/domain, SPF, DKIM and DMARC with the provider. Production requires authenticated TLS SMTP (587 STARTTLS or 465). A queue acknowledgment is not proof of inbox delivery.
7. On the build machine set client/.env.production public values: REACT_APP_SITE_URL and, if available, HTTPS YourBot/game URLs. These are compiled into the bundle; changing runtime env does not change them. Production games without a URL are unavailable. Configure each game HTTPS subdomain before enabling its profile.

## Build and deploy

```sh
npm ci --prefix server
npm ci --prefix client
npm run lint
npm run check --prefix server
npm test --prefix client
# Run backend tests against a separate cortexis_test* PostgreSQL database and Redis first.
npm run build --prefix client
test -s client/build/prerender-manifest.json
docker build -t cortexis-website:release .
docker compose config -q
docker compose up -d postgres redis
docker compose --profile maintenance run --rm --build cortexis-migrate
docker compose up -d --build cortexis-website admin
docker compose ps
curl --fail http://127.0.0.1:5000/ready
```

Build on CI/local hardware and transfer the image to the VPS using a private registry or `docker save`/`docker load`. Preserve its exact tag/digest for rollback. The checked-in Compose builds from an already built client artifact; it does not rebuild the frontend. Keep the previous image.

Compose uses a restricted `cortexis_runtime` database login and `SCHEMA_MANAGEMENT=external`. Set a distinct random base64url APP_DB_PASSWORD of at least 32 characters. The one-shot maintenance command applies additive migrations as the database owner and provisions the runtime login with table/sequence access, without superuser, role creation or schema-creation privileges. Run it before first startup and before each schema upgrade. Only that short-lived container receives POSTGRES_PASSWORD; the web/worker containers receive APP_DB_PASSWORD. Catalogue seeding runs under a separate transaction lock. For a managed external database, apply migrations as its schema owner and adapt `deploy/runtime-role.sql`. Back up before upgrades; arbitrary backward schema rollback is not automated.

The embedded email worker is enabled by default. For a separate worker, set EMBEDDED_WORKER=false and run `docker compose --profile worker up -d cortexis-worker`. Both must use the SAME EMAIL_QUEUE_SECRET and Redis target. Before upgrading old plaintext job formats or rotating the queue key, drain queued messages; retained encrypted jobs cannot be decrypted with a different key.

## HTTPS and reverse proxy

1. Start with an HTTP Nginx server for ACME challenges on both domains. Obtain a certificate containing website and admin names using Certbot.
2. Copy and adapt `deploy/nginx.conf.example`; replace domains and certificate paths. Run `nginx -t`, then reload Nginx.
3. Set Cloudflare SSL/TLS to Full (strict) when proxying is enabled. Never use Flexible. Test certificate renewal with `certbot renew --dry-run`.
4. HTTPS checks: /health (liveness), /ready (DB + Redis readiness), unknown /api/... (JSON 404), unauthorized /api/admin/... (401), allowed and rejected CORS origins, security headers, no plaintext/mixed-content requests.
5. Run a real signup, receive the code in a real mailbox, verify, log in, complete a sample course/certificate, submit contact and internship forms and confirm staff can view them. Test staff access from a non-admin account.
6. Games: set HTTPS origins in REACT_APP_GAME_*_URL at build time and GAME_ORIGINS/CORS_ORIGINS at runtime; configure Nginx WebSocket forwarding and `docker compose --profile games up -d`. Test every selected game's login bridge, persistence and restart. These game services need their own acceptance/security checks before public enablement.

## Operations and rollback

- Readiness failure must alert an operator. Docker health checks alone do not restart an unhealthy process; configure an external HTTPS monitor and notifications. Fatal application errors exit so the restart policy can recover.
- Admin health exposes queue failed/waiting counts. Alert on sustained failed jobs, prolonged backlog, high latency, low disk, CPU/RAM pressure and database errors.
- Logs rotate at 10 MB x3 per container. Keep logs access-controlled; never enable body/token/OTP logging.
- Run `bash deploy/backup.sh` on a daily schedule. Encrypt/copy backups off the VPS, choose retention, and alert on backup failure. Same-disk backups are insufficient.
- Run `bash deploy/restore-drill.sh backups/<dump>` against the isolated restore database after setup and periodically. Game data volumes need separate backups.
- Rollback: stop writers if schema compatibility is uncertain, keep a fresh backup, restore the previous image tag and known-compatible configuration. Restore a DB backup only with a deliberate recovery decision; it loses newer writes.
- Start with modest traffic. Measure p95 API latency, PostgreSQL connections, Redis memory, queue age and free disk. Do not run the offline GGUF assistant on the same low-cost production VPS.
- Remote DB: DATABASE_SSL=true with verified certificates; supply DATABASE_CA_FILE for a private CA. Do not disable verification to bypass a certificate error.

## Remaining live acceptance gates

Public domain/DNS/certificate issuance, actual SMTP inbox delivery/provider limits, offsite backup credentials, external monitoring, VPS firewall checks and representative production load are owner/infrastructure setup tasks. Local tests cannot certify them.
