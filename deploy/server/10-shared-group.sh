#!/usr/bin/env bash
# Shared "cortexis" group so either operator (deploy, abdullah) can deploy and
# run the Cloudflare cache purge, whoever deployed last.
# Run on the server:  sudo bash /opt/cortexis/deploy/server/10-shared-group.sh
#
# - Both users join the group (takes effect at their next login / ssh session).
# - /opt/cortexis: group cortexis, group read/write, setgid on every folder so
#   new files and folders inherit the group. File owners are left as they are.
#   Root-only (700) folders in the top level are someone's private backups and
#   are skipped.
# - Purge credentials and purge state: readable/writable by the group.
# deploy/deploy.sh uploads with group-writable permissions and
# remote-deploy.sh builds with umask 002, so it stays that way. Safe to re-run.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
APP=/opt/cortexis
GROUP=cortexis

groupadd -f "$GROUP"
for u in deploy abdullah; do usermod -aG "$GROUP" "$u"; done

# Everything under the app folder except root-only top-level folders.
shared() { find "$APP" -xdev \( -type d -user root -perm 700 -regex "$APP/[^/]*" \) -prune -o "$@"; }
shared -exec chgrp -h "$GROUP" {} +
shared ! -type l -exec chmod g+rwX {} +
shared -type d -exec chmod g+s {} +

# Cloudflare purge: credentials readable by the group, state writable by it.
chgrp "$GROUP" /etc/cortexis/cloudflare-purge.json && chmod 640 /etc/cortexis/cloudflare-purge.json
STATE=/var/lib/cortexis-cache
mkdir -p "$STATE"
chgrp -R "$GROUP" "$STATE" && chmod 2770 "$STATE" && find "$STATE" -type f -exec chmod 660 {} +

echo "== group: $(getent group "$GROUP")"
echo "== app:   $(stat -c '%U:%G %a' "$APP"), not group-writable: $(shared ! -type l ! -perm -g+w -print | wc -l)"
echo "== purge: $(stat -c '%U:%G %a' /etc/cortexis/cloudflare-purge.json) creds, $(stat -c '%U:%G %a' "$STATE") state"
