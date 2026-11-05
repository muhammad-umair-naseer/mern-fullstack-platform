#!/usr/bin/env bash
# Run on the server with sudo, from the repo folder. Installs the Nginx site
# config (deploy/nginx/cortexis.conf) after checking the Cloudflare Origin
# Certificate is in place, tests it, and reloads Nginx. Also schedules a
# weekly refresh of Cloudflare's IP ranges. Safe to re-run.
#
#   sudo bash deploy/server/04-nginx-site.sh
#
# Before running: create the Origin Certificate in Cloudflare and save it on
# the server (see deploy/server/README.md, step A5):
#   /etc/ssl/cloudflare/cortexissolutionhub.com.pem   (certificate)
#   /etc/ssl/cloudflare/cortexissolutionhub.com.key   (private key)
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
cd "$(dirname "$0")/../.."

CERT=/etc/ssl/cloudflare/cortexissolutionhub.com.pem
KEY=/etc/ssl/cloudflare/cortexissolutionhub.com.key

echo "== Certificate files"
install -d -m 700 /etc/ssl/cloudflare
for f in "$CERT" "$KEY"; do
  [ -s "$f" ] || { echo "Missing $f. Create it first (README step A5)."; exit 1; }
done
chmod 644 "$CERT"; chmod 600 "$KEY"
# The key and certificate must belong together.
[ "$(openssl x509 -noout -pubkey -in "$CERT" | openssl sha256)" = "$(openssl pkey -pubout -in "$KEY" | openssl sha256)" ] \
  || { echo "The key does not match the certificate."; exit 1; }
openssl x509 -noout -subject -enddate -ext subjectAltName -in "$CERT"

echo "== Real visitor IPs from Cloudflare"
bash deploy/server/03-cloudflare-realip.sh || true
cat > /etc/cron.d/cloudflare-realip <<EOF
# Refresh Cloudflare's IP ranges for Nginx, Mondays 04:30.
30 4 * * 1 root bash $(pwd)/deploy/server/03-cloudflare-realip.sh >/dev/null 2>&1
EOF

echo "== Site config"
install -m 644 deploy/nginx/cortexis.conf /etc/nginx/sites-available/cortexis
ln -sf /etc/nginx/sites-available/cortexis /etc/nginx/sites-enabled/cortexis
nginx -t
systemctl reload nginx
echo "Nginx is serving the Cortexis config."
