#!/usr/bin/env bash
# Runs ON THE SERVER as deploy (deploy/deploy.sh calls it after uploading the
# code). Builds the website, backs up the database, applies migrations and
# swaps in the new containers. Safe to re-run; stops at the first error.
#
#   bash /opt/cortexis/deploy/server/remote-deploy.sh
set -euo pipefail
cd "$(dirname "$0")/../.."
APP_DIR="$(pwd)"
log() { printf '\n== %s\n' "$*"; }

[ -f .env ] || { echo "No .env yet. Run: bash deploy/server/06-make-env.sh"; exit 1; }
[ -f client/.env.production ] || { echo "No client/.env.production. Run 06-make-env.sh."; exit 1; }

log "1/6 Build environment (Node 24 + Chromium, cached after the first time)"
docker build -q -t cortexis-builder -f deploy/build.Dockerfile deploy >/dev/null

log "2/6 Build the website (install, blog, sitemap, Vite, SEO prerender)"
# Runs as the deploy user so the files it writes stay ours; the npm cache lives
# in the repo folder (never uploaded or committed) so later builds are faster.
docker run --rm --user "$(id -u):$(id -g)" \
  -e HOME=/tmp -e npm_config_cache=/src/.npm-cache -e NODE_ENV=production \
  -v "$APP_DIR:/src" cortexis-builder \
  sh -c 'npm ci --include=dev --no-audit && npm run build'
test -s client/build/index.html
test -s client/build/prerender-manifest.json
echo "Built: $(find client/build -name '*.html' | wc -l) pages"

log "3/6 Back up the database before changing anything (if it is running)"
mkdir -p backups/predeploy
if docker compose ps --status running --services 2>/dev/null | grep -qx postgres; then
  f="backups/predeploy/cortexis-$(date -u +%Y%m%dT%H%M%SZ).dump"
  docker compose exec -T postgres pg_dump -U cortexis -d cortexis --format=custom > "$f"
  test -s "$f" && echo "Saved $f"
  ls -1t backups/predeploy/*.dump 2>/dev/null | tail -n +6 | xargs -r rm -f   # keep the last 5
else
  echo "Database not running yet (first deploy); nothing to back up."
fi

log "4/6 Build the app images (the previous website image is kept for rollback)"
prev="$(docker compose images -q cortexis-website 2>/dev/null | head -1 || true)"
[ -n "$prev" ] && docker tag "$prev" cortexis-website:rollback && echo "Previous image tagged cortexis-website:rollback"
docker compose build cortexis-website admin

log "5/6 Database: start, then apply migrations as the owner"
docker compose up -d postgres redis
docker compose --profile maintenance run --rm --build cortexis-migrate

log "6/6 Start the new website and admin"
docker compose up -d cortexis-website admin
for i in $(seq 1 45); do
  if curl -fsS -o /dev/null http://127.0.0.1:5000/ready; then
    # Cortexis automatic cache purge (after readiness)
    if ! python3 "$APP_DIR/deploy/cloudflare-purge.py"; then
      echo "Website deployed, but cache purge/verification failed. Run deploy/cloudflare-purge.py again after fixing the error." >&2
      exit 2
    fi
    echo "Website is ready."
    docker compose ps
    exit 0
  fi
  sleep 2
done
echo "The website did not become ready in 90 seconds. Recent logs:"
docker compose logs --tail=60 cortexis-website
exit 1
