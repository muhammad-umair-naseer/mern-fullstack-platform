#!/usr/bin/env bash
# Run on the server with sudo. Installs what this project needs on the host:
# Docker Engine + the Compose plugin (runs the website, API, Postgres, Redis,
# admin) and Nginx (the public front door with HTTPS). Node, Postgres and
# Redis are NOT installed on the host: they run inside containers.
# Safe to re-run.
#
#   sudo bash deploy/server/02-install-docker-nginx.sh
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
export DEBIAN_FRONTEND=noninteractive
. /etc/os-release
echo "Ubuntu $VERSION_ID ($VERSION_CODENAME)"

echo "== Docker"
if ! command -v docker >/dev/null 2>&1; then
  # Docker's own repository when it already publishes packages for this
  # Ubuntu release; Ubuntu's packaged Docker otherwise (new releases can be
  # a few weeks ahead of Docker's repo).
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  if curl -fsI "https://download.docker.com/linux/ubuntu/dists/$VERSION_CODENAME/Release" >/dev/null; then
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $VERSION_CODENAME stable" \
      > /etc/apt/sources.list.d/docker.list
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  else
    echo "Docker's repo has no $VERSION_CODENAME release yet; using Ubuntu's packages."
    rm -f /etc/apt/sources.list.d/docker.list
    apt-get update -y
    apt-get install -y docker.io docker-compose-v2 docker-buildx
  fi
fi
systemctl enable --now docker
# Lets the deploy user run docker without sudo.
usermod -aG docker "$DEPLOY_USER"

# Keep container logs from filling the disk (the compose file also caps them).
if [ ! -f /etc/docker/daemon.json ]; then
  cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
  systemctl restart docker
fi
docker --version
docker compose version

echo "== Nginx"
apt-get install -y nginx
systemctl enable --now nginx
# Drop Ubuntu's welcome page; our own config replaces it in step 04.
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
nginx -v

echo
echo "Done. Log out and back in as $DEPLOY_USER so the docker group applies, then:"
echo "  docker run --rm hello-world"
