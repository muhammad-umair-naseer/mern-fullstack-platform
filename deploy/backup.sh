#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."
backup_dir="${BACKUP_DIR:-./backups}"
mkdir -p "$backup_dir"
backup_file="$backup_dir/cortexis-$(date -u +%Y%m%dT%H%M%SZ).dump"
docker compose exec -T postgres pg_dump -U cortexis -d cortexis --format=custom > "$backup_file"
test -s "$backup_file"
# Reading the archive verifies its structure; restore-drill.sh verifies restoration.
docker compose exec -T postgres pg_restore --list < "$backup_file" >/dev/null
printf 'Backup created: %s\n' "$backup_file"
# Copy encrypted backups off this VPS using your backup provider; configure retention there.
