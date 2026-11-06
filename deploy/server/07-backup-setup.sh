#!/usr/bin/env bash
# Run once on the server as deploy:  sudo bash /opt/cortexis/deploy/server/07-backup-setup.sh
# Safe to re-run: anything already set up is left as it is.
#
# 1. Installs the official rclone (rclone.org, checksum-verified).
# 2. Remote "gdrive": Google Drive of cortexis.solution.hub@gmail.com, scope
#    drive.file (rclone sees only the files it made, nothing else in Drive).
#    Asks for the token from `rclone authorize` on your Mac; input is hidden
#    and never stored in shell history.
# 3. Remote "cortexis-backup": encrypts everything into gdrive:cortexis-backups.
#    The archives hold .env and the SSL key, so Google only ever sees
#    encrypted data. Two random passwords are generated and saved to
#    /root/cortexis-backup-passwords.txt. Copy them to your password manager:
#    without them the Drive copies cannot be decrypted.
#    Re-run with --reauth to switch to your own Google OAuth client.
# 4. Cron: backup.sh daily at 22:00 UTC (03:00 Pakistan time).
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
export RCLONE_CONFIG=/root/.config/rclone/rclone.conf
PASSFILE=/root/cortexis-backup-passwords.txt
umask 077

# Official rclone from rclone.org (checksum-verified) into /usr/local/bin, not
# Ubuntu's old package: tokens from a current `rclone authorize` on the Mac
# need a matching version. Re-running upgrades to the latest release.
install_rclone() {
  local ver have arch tmp zip
  ver="$(curl -fsS https://downloads.rclone.org/version.txt | awk '{print $2}')"   # e.g. v1.71.2
  have="$(/usr/local/bin/rclone version 2>/dev/null | awk 'NR==1{print $2}' || true)"
  if [ "$have" != "$ver" ]; then
    arch="$(dpkg --print-architecture)"; zip="rclone-$ver-linux-$arch.zip"; tmp="$(mktemp -d)"
    curl -fsSL -o "$tmp/$zip" "https://downloads.rclone.org/$ver/$zip"
    curl -fsSL -o "$tmp/SHA256SUMS" "https://downloads.rclone.org/$ver/SHA256SUMS"
    grep " $zip\$" "$tmp/SHA256SUMS" > "$tmp/sum"
    (cd "$tmp" && sha256sum -c sum)
    python3 -m zipfile -e "$tmp/$zip" "$tmp/x"
    install -m 755 "$tmp"/x/rclone-*/rclone /usr/local/bin/rclone
    rm -rf "$tmp"
  fi
  if dpkg -s rclone >/dev/null 2>&1; then apt-get remove -y -q rclone >/dev/null; fi
  hash -r
}
install_rclone
echo "rclone: $(rclone version | head -1) at $(command -v rclone)"

# Turn whatever `rclone authorize` printed into the token JSON the config
# needs: plain {...} JSON first, else strict base64 (standard or URL-safe) of
# that JSON. Exits non-zero on anything else, never printing the token.
fix_token() { python3 -c '
import sys, json, base64, binascii
t = sys.stdin.read().strip()
def fail(why):
    sys.exit("Token not understood (%s; %d characters). Nothing was changed." % (why, len(t)))
if t.startswith("{"):
    try: d = json.loads(t)
    except ValueError: fail("starts with { but is not valid JSON")
else:
    raw = None
    for alt in (None, b"-_"):
        try: raw = base64.b64decode(t + "=" * (-len(t) % 4), altchars=alt, validate=True); break
        except (binascii.Error, ValueError): pass
    if raw is None: fail("neither JSON nor base64; copy only the line between ---> and <---End paste")
    try: d = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, ValueError): fail("base64 but not JSON inside")
if isinstance(d, dict) and "access_token" not in d and "token" in d:
    d = d["token"]
    if isinstance(d, str):
        try: d = json.loads(d)
        except ValueError: fail("inner token is not JSON")
if not (isinstance(d, dict) and "access_token" in d): fail("no access_token in it")
print(json.dumps(d))'; }

# Each token is converted into a variable FIRST: under set -e a failure there
# stops the script, whereas inside a command argument it would be ignored.
if [ "${1:-}" = "--reauth" ]; then
  # Switch "gdrive" to your own Google OAuth client (rclone's shared one hits
  # Google's rate limit on large uploads). Secret and token input is hidden.
  rclone listremotes | grep -qx 'gdrive:' || { echo "No gdrive remote yet; run without --reauth first."; exit 1; }
  read -rp  "Client ID: " cid
  read -rsp "Client secret: " csec; echo
  echo "Paste the new token from your Mac (the line between ---> and <---End paste), then press Enter:"
  read -rs token; echo
  [ -n "$cid" ] && [ -n "$csec" ] && [ -n "$token" ] || { echo "Missing input; nothing changed."; exit 1; }
  tok="$(printf %s "$token" | fix_token)"
  rclone config update gdrive client_id="$cid" client_secret="$csec" token="$tok" --non-interactive >/dev/null
  unset cid csec token tok
elif ! rclone listremotes | grep -qx 'gdrive:'; then
  echo "Paste the token from your Mac (the line between ---> and <---End paste), then press Enter:"
  read -rs token; echo
  [ -n "$token" ] || { echo "No token given."; exit 1; }
  tok="$(printf %s "$token" | fix_token)"
  rclone config create gdrive drive scope=drive.file token="$tok" --non-interactive >/dev/null
  unset token tok
elif ! rclone lsd gdrive: >/dev/null 2>&1; then
  echo "Repairing the saved Drive token format."
  saved="$(rclone config dump | python3 -c 'import sys, json; print(json.load(sys.stdin)["gdrive"]["token"])')"
  tok="$(printf %s "$saved" | fix_token)"
  rclone config update gdrive token="$tok" --non-interactive >/dev/null
  unset saved tok
fi
rclone lsd gdrive: >/dev/null || { echo "Google Drive is not reachable; nothing else was changed."; exit 1; }
echo "gdrive: connected"

if ! rclone listremotes | grep -qx 'cortexis-backup:'; then
  p1="$(openssl rand -base64 32 | tr -d '=\n')"
  p2="$(openssl rand -base64 32 | tr -d '=\n')"
  printf 'rclone crypt remote cortexis-backup -> gdrive:cortexis-backups\npassword=%s\npassword2=%s\n' "$p1" "$p2" > "$PASSFILE"
  chmod 600 "$PASSFILE"
  rclone config create cortexis-backup crypt remote=gdrive:cortexis-backups \
    password="$p1" password2="$p2" --obscure --non-interactive >/dev/null
  unset p1 p2
  echo "cortexis-backup: created; passwords saved to $PASSFILE (save them offline)"
fi
rclone mkdir cortexis-backup:daily
rclone mkdir cortexis-backup:weekly

cat > /etc/cron.d/cortexis-backup <<'EOF'
# Cortexis daily backup (deploy/server/backup.sh). 22:00 UTC = 03:00 Pakistan.
# rclone lives in /usr/local/bin, which cron's default PATH leaves out.
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0 22 * * * root /opt/cortexis/deploy/server/backup.sh >> /var/log/site-backup.log 2>&1
EOF
chmod 644 /etc/cron.d/cortexis-backup
touch /var/log/site-backup.log && chmod 640 /var/log/site-backup.log
chmod 755 /opt/cortexis/deploy/server/backup.sh /opt/cortexis/deploy/server/restore.sh
echo "Cron installed: /etc/cron.d/cortexis-backup (log: /var/log/site-backup.log)"
