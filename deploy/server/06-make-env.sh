#!/usr/bin/env bash
# Run on the server as deploy. Creates the production settings files, ON THE
# SERVER ONLY (both are git-ignored and never leave the server):
#   /opt/cortexis/.env                     read by docker compose
#   /opt/cortexis/client/.env.production   public values baked into the website build
#
# Secrets are generated here with openssl and never printed. Safe to re-run:
# an existing value is never changed (changing POSTGRES_PASSWORD after the
# first start would lock the app out of its own database); only missing keys
# are added.
#
#   bash deploy/server/06-make-env.sh
#
# SMTP starts as placeholders so the site can run; add your Brevo login and key
# yourself with:  nano /opt/cortexis/.env   then redeploy.
set -euo pipefail
cd "$(dirname "$0")/../.."

ENV_FILE=.env
DOMAIN=cortexissolutionhub.com
OWNER_EMAIL="${OWNER_EMAIL:-cortexis.solution.hub@gmail.com}"

umask 077
touch "$ENV_FILE"
chmod 600 "$ENV_FILE"

# 48 random bytes, base64url without padding: about 64 characters.
secret() { openssl rand -base64 48 | tr '+/' '-_' | tr -d '=\n'; }

added=()
set_default() {   # set_default KEY VALUE: only when KEY is not in the file yet
  local key="$1" value="$2"
  if ! grep -q "^${key}=" "$ENV_FILE"; then
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
    added+=("$key")
  fi
}

# --- Addresses ---------------------------------------------------------------
set_default SITE_URL      "https://$DOMAIN"
set_default ADMIN_URL     "https://admin.$DOMAIN"
set_default CORS_ORIGINS  "https://$DOMAIN,https://admin.$DOMAIN"
set_default GAME_ORIGINS  ""                       # games come in a later phase

# --- Secrets (generated, never printed) ----------------------------------------
set_default JWT_SECRET          "$(secret)"
set_default GAME_SSO_SECRET     "$(secret)"
set_default EMAIL_QUEUE_SECRET  "$(secret)"
set_default POSTGRES_PASSWORD   "$(secret)"
set_default APP_DB_PASSWORD     "$(secret)"
set_default REDIS_PASSWORD      "$(secret)"

# --- The one admin account ------------------------------------------------------
set_default ADMIN_EMAIL     "$OWNER_EMAIL"
set_default ADMIN_PASSWORD  "$(openssl rand -base64 24 | tr '+/' '-_' | tr -d '=\n')"

# --- Email (Brevo). Placeholders until you add the real values with nano. --------
set_default SMTP_HOST      "smtp-relay.brevo.com"
set_default SMTP_PORT      "587"
set_default SMTP_USER      "SET_BREVO_SMTP_LOGIN"
set_default SMTP_PASS      "SET_BREVO_SMTP_KEY"
set_default SMTP_FROM      "no-reply@$DOMAIN"            # bare address; the app adds the name "Cortexis"
set_default SMTP_REPLY_TO  "$OWNER_EMAIL"                # replies to any email reach this inbox
set_default CONTACT_TO     "$OWNER_EMAIL"
set_default ADMIN_ALERT_TO "$OWNER_EMAIL"

# --- Runtime --------------------------------------------------------------------
set_default EMBEDDED_WORKER "true"

# --- Public build-time values for the website (no secrets in here) ----------------
CLIENT_ENV=client/.env.production
if [ ! -f "$CLIENT_ENV" ]; then
  cat > "$CLIENT_ENV" <<EOF
# Public values compiled into the website bundle. Not secret.
REACT_APP_SITE_URL=https://$DOMAIN
REACT_APP_API_BASE_URL=
REACT_APP_YOURBOT_URL=
REACT_APP_GAME_GOTCHA_URL=
REACT_APP_GAME_TYPEDASH_URL=
REACT_APP_GAME_PICKPARTY_URL=
REACT_APP_GAME_SKETCH_URL=
EOF
  chmod 644 "$CLIENT_ENV"
  added+=("client/.env.production")
fi

echo "Settings file: $(pwd)/$ENV_FILE (mode $(stat -c %a "$ENV_FILE"))"
if [ ${#added[@]} -gt 0 ]; then echo "Added: ${added[*]}"; else echo "Nothing to add; all keys already set."; fi
echo "Keys present (values hidden):"; cut -d= -f1 "$ENV_FILE" | sed 's/^/  /'
grep -q "SET_BREVO" "$ENV_FILE" && echo "Reminder: SMTP_USER / SMTP_PASS are still placeholders (emails will not send)."
echo "To read the admin password on the server: grep '^ADMIN_PASSWORD=' $(pwd)/$ENV_FILE"
