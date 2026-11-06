#!/usr/bin/env bash
# Daily backup, run by cron as root (installed by 07-backup-setup.sh):
#   /etc/cron.d/cortexis-backup -> logs to /var/log/site-backup.log
#
# One archive per run, /var/backups/cortexis/daily/cortexis-<UTC time>.tar.gz:
#   db/cortexis.dump     the database (pg_dump, verified by deploy/backup.sh)
#   opt/cortexis/        site files and both .env files (no node_modules/build)
#   etc/nginx/...        our Nginx site and Cloudflare real-IP config
#   etc/ssl/cloudflare/  the origin certificate and key
#   etc/cron.d/...       our cron jobs
# Sundays also go to weekly/. Keeps the newest 7 daily + 4 weekly, both here
# and on Google Drive (rclone remote "cortexis-backup", encrypted).
# Safe to re-run; any failure exits non-zero (cron logs it).
#
#   sudo bash /opt/cortexis/deploy/server/backup.sh
set -euo pipefail
APP_DIR=/opt/cortexis
LOCAL=/var/backups/cortexis
REMOTE="${REMOTE:-cortexis-backup:}"
KEEP_DAILY=7
KEEP_WEEKLY=4

[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)."; exit 1; }
echo "== $(date -u '+%F %T UTC') backup start"
umask 077
mkdir -p "$LOCAL/daily" "$LOCAL/weekly"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

# 1. Database dump (deploy/backup.sh dumps and checks the archive reads back).
BACKUP_DIR="$stage/db" bash "$APP_DIR/deploy/backup.sh"
mv "$stage"/db/*.dump "$stage/db/cortexis.dump"

# 2. One compressed archive. Only paths that exist, so a missing cron file
#    never fails the backup.
name="cortexis-$(date -u +%Y%m%dT%H%M%SZ).tar.gz"
paths=()
for p in opt/cortexis etc/nginx/sites-available/cortexis etc/nginx/conf.d/cloudflare-realip.conf \
         etc/ssl/cloudflare etc/cron.d/cortexis-backup etc/cron.d/cloudflare-realip; do
  [ -e "/$p" ] && paths+=("$p")
done
tar -czf "$LOCAL/daily/$name" \
  --exclude='node_modules' --exclude='opt/cortexis/client/build' \
  --exclude='opt/cortexis/.npm-cache' --exclude='opt/cortexis/backups' \
  -C "$stage" db -C / "${paths[@]}"
tar -tzf "$LOCAL/daily/$name" >/dev/null          # the archive reads back
[ "$(date -u +%u)" = 7 ] && cp "$LOCAL/daily/$name" "$LOCAL/weekly/$name"
echo "Archive: $LOCAL/daily/$name ($(du -h "$LOCAL/daily/$name" | cut -f1))"

# 3. Offsite copy. rclone checks size and hash after each upload.
rclone copy "$LOCAL/daily/$name" "${REMOTE}daily/"
[ -f "$LOCAL/weekly/$name" ] && rclone copy "$LOCAL/weekly/$name" "${REMOTE}weekly/"
echo "Uploaded to Google Drive."

# 4. Retention: names sort by time, so drop all but the newest N.
prune_local()  { find "$1" -maxdepth 1 -name 'cortexis-*.tar.gz' | sort | head -n -"$2" | xargs -r rm -f; }
prune_remote() { rclone lsf "$1" --include 'cortexis-*.tar.gz' | sort | head -n -"$2" |
                   while read -r f; do rclone deletefile "$1$f"; done; }
prune_local "$LOCAL/daily" "$KEEP_DAILY"
prune_local "$LOCAL/weekly" "$KEEP_WEEKLY"
prune_remote "${REMOTE}daily/" "$KEEP_DAILY"
prune_remote "${REMOTE}weekly/" "$KEEP_WEEKLY"

echo "== $(date -u '+%F %T UTC') backup OK"
