#!/usr/bin/env bash
# Run on your Mac, from anywhere in this repo. Uploads the code to the server
# and runs the build and release there (deploy/server/remote-deploy.sh).
#
#   bash deploy/deploy.sh
#
# What is uploaded: every file git tracks, plus new files git does not ignore.
# What never is: .env files, node_modules, build output, local game data, the
# local-only cortexis-tools folder. The server keeps its own .env and data.
set -euo pipefail
SERVER="${SERVER:-deploy@13.140.220.173}"
APP_DIR="${APP_DIR:-/opt/cortexis}"
cd "$(git rev-parse --show-toplevel)"

echo "Deploying branch $(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD) to $SERVER"
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Note: you have uncommitted changes; they will be deployed too."
fi

list="$(mktemp)"
trap 'rm -f "$list"' EXIT
git ls-files -co --exclude-standard | grep -vE '^(cortexis-tools/|logooo\.png$)' > "$list"

rsync -az --files-from="$list" ./ "$SERVER:$APP_DIR/"
ssh "$SERVER" "bash $APP_DIR/deploy/server/remote-deploy.sh"
echo
echo "Done: https://cortexissolutionhub.com"
