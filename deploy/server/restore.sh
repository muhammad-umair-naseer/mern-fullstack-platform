#!/usr/bin/env bash
# Restore from a backup made by backup.sh. Run on the server with sudo.
#
#   sudo bash restore.sh list                  # backups here and on Google Drive
#   sudo bash restore.sh fetch <name>          # download one from Drive
#   sudo bash restore.sh test  <archive>       # SAFE: checks the archive and restores the
#                                              # database into a throwaway copy, then drops it
#   sudo bash restore.sh apply <archive>       # DESTRUCTIVE: puts the files back and replaces
#                                              # the live database (asks you to type RESTORE)
#
# apply also works on a fresh server: run Task A (01-05) first, then fetch + apply.
# It loses everything written since that backup was made.
set -euo pipefail
LOCAL=/var/backups/cortexis
REMOTE="${REMOTE:-cortexis-backup:}"
APP_DIR=/opt/cortexis
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
cmd="${1:-}"; arg="${2:-}"

extract_dump() {   # extract_dump ARCHIVE DIR -> DIR/db/cortexis.dump
  tar -xzf "$1" -C "$2" db/cortexis.dump
  test -s "$2/db/cortexis.dump"
}

case "$cmd" in
  list)
    echo "-- Here:"; ls -1sh "$LOCAL"/daily "$LOCAL"/weekly 2>/dev/null || true
    echo "-- Google Drive:"; rclone lsl "${REMOTE}" --include 'cortexis-*.tar.gz'
    ;;
  fetch)
    [ -n "$arg" ] || { echo "Usage: restore.sh fetch <name>"; exit 1; }
    mkdir -p "$LOCAL/restore"
    rclone copy "${REMOTE}daily/$arg" "$LOCAL/restore/" 2>/dev/null ||
      rclone copy "${REMOTE}weekly/$arg" "$LOCAL/restore/"
    test -s "$LOCAL/restore/$arg" && echo "Saved $LOCAL/restore/$arg"
    ;;
  test)
    [ -f "$arg" ] || { echo "Usage: restore.sh test <archive>"; exit 1; }
    tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
    tar -tzf "$arg" | grep -E '^(db/cortexis.dump|opt/cortexis/\.env|etc/ssl/cloudflare/.+)$' | sed 's/^/  found: /'
    extract_dump "$arg" "$tmp"
    cd "$APP_DIR" && bash deploy/restore-drill.sh "$tmp/db/cortexis.dump"
    ;;
  apply)
    [ -f "$arg" ] || { echo "Usage: restore.sh apply <archive>"; exit 1; }
    echo "This REPLACES the live database and config files with the backup $arg."
    read -rp "Type RESTORE to continue: " ok; [ "$ok" = RESTORE ] || { echo "Cancelled."; exit 1; }
    tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
    extract_dump "$arg" "$tmp"
    tar -xzf "$arg" -C / opt etc                            # files, .env, nginx, ssl, cron
    chown -R deploy:deploy "$APP_DIR"
    ln -sf /etc/nginx/sites-available/cortexis /etc/nginx/sites-enabled/cortexis
    nginx -t && systemctl reload nginx
    cd "$APP_DIR"
    docker compose stop cortexis-website admin 2>/dev/null || true
    docker compose up -d --wait postgres
    docker compose exec -T postgres pg_restore -U cortexis -d cortexis --clean --if-exists --no-owner \
      --exit-on-error < "$tmp/db/cortexis.dump"
    echo "Database restored. Rebuilding and starting the site:"
    sudo -u deploy bash deploy/server/remote-deploy.sh
    ;;
  *) sed -n '2,13p' "$0"; exit 1 ;;
esac
