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
# Safe to re-run; any failure exits non-zero (cron logs it) and emails
# ADMIN_ALERT_TO. Test the alert: sudo bash backup.sh --test-alert
#
#   sudo bash /opt/cortexis/deploy/server/backup.sh
set -euo pipefail
APP_DIR=/opt/cortexis
LOCAL=/var/backups/cortexis
REMOTE="${REMOTE:-cortexis-backup:}"
KEEP_DAILY=7
KEEP_WEEKLY=4

[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)."; exit 1; }

# Failure alert: emails ADMIN_ALERT_TO through Brevo with curl, straight from
# this host, so it works even when the app or database is down. The SMTP
# login goes to curl on stdin, never on the command line.
#   sudo bash backup.sh --test-alert    sends a test alert and exits
envval() { sed -n "s/^$1=//p" "$APP_DIR/.env" | tail -1 | sed "s/^'\(.*\)'\$/\1/"; }
alert() {   # alert SUBJECT BODY
  local to from host port
  to="$(envval ADMIN_ALERT_TO)"; from="$(envval SMTP_FROM)"
  host="$(envval SMTP_HOST)"; port="$(envval SMTP_PORT)"
  [ -n "$to" ] && [ -n "$from" ] && [ -n "$host" ] || { echo "No alert sent: SMTP/ADMIN_ALERT_TO not set."; return 1; }
  printf 'From: Cortexis server <%s>\r\nTo: %s\r\nSubject: %s\r\nDate: %s\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n%s\r\n' \
    "$from" "$to" "$1" "$(date -R)" "$2" > "$stage/alert.eml"
  printf 'user = "%s:%s"\n' "$(envval SMTP_USER)" "$(envval SMTP_PASS)" |
    curl -sS --max-time 30 --ssl-reqd --url "smtp://$host:${port:-587}" \
      --mail-from "$from" --mail-rcpt "$to" --upload-file "$stage/alert.eml" -K - \
    && echo "Alert emailed to $to"
}
on_exit() {
  local rc=$?
  if [ "$rc" -ne 0 ] && [ "${TEST_ALERT:-}" != 1 ]; then
    alert "Cortexis backup FAILED on $(hostname) (exit $rc)" \
      "The daily backup failed at $(date -u '+%F %T UTC'). Last lines of /var/log/site-backup.log:

$(tail -n 30 /var/log/site-backup.log 2>/dev/null)" || true
  fi
  rm -rf "$stage"
}

umask 077
stage="$(mktemp -d)"
trap on_exit EXIT
if [ "${1:-}" = "--test-alert" ]; then
  TEST_ALERT=1
  alert "Cortexis backup alert test from $(hostname)" "Test only: backup failure alerts reach this inbox."
  exit
fi
echo "== $(date -u '+%F %T UTC') backup start"
mkdir -p "$LOCAL/daily" "$LOCAL/weekly"

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
