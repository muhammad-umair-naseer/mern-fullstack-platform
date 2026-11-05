#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test "$#" -eq 1 || { echo "Usage: bash deploy/restore-drill.sh backups/file.dump"; exit 1; }
test -f "$1"
# A new disposable database only; never restore over the production database.
restore_db="cortexis_restore_$(date -u +%Y%m%d%H%M%S)"
docker compose exec -T postgres createdb -U cortexis "$restore_db"
cleanup() { docker compose exec -T postgres dropdb -U cortexis "$restore_db"; }
trap cleanup EXIT
docker compose exec -T postgres pg_restore -U cortexis -d "$restore_db" --exit-on-error --no-owner < "$1"
docker compose exec -T postgres psql -U cortexis -d "$restore_db" -v ON_ERROR_STOP=1 -c 'SELECT count(*) AS users FROM users; SELECT count(*) AS courses FROM courses;'
echo "Restore drill passed."
