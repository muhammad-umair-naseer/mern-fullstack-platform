#!/usr/bin/env bash
# Add a teammate: SSH by key only, sudo WITH a password, docker access.
# Run on the server as deploy:
#   sudo bash /opt/cortexis/deploy/server/08-add-user.sh <username> "<Full Name>" "<ssh public key>"
#
# Safe to re-run: the user, groups and key are only added when missing, and
# the sudo password is set only the first time (never overwrites one he has
# since changed with `passwd`). The password is never printed: it is saved to
# /root/<username>-sudo-password.txt (mode 600) for you to read and pass on.
#
# Note: the docker group can control every container and is effectively root.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
[ "$#" -eq 3 ] || { echo "Usage: $0 <username> \"<Full Name>\" \"<ssh public key>\""; exit 1; }
user="$1"; name="$2"; key="$3"

[[ "$user" =~ ^[a-z][a-z0-9_-]{0,31}$ ]] || { echo "Username must be lowercase letters, digits, - or _."; exit 1; }
# Reject anything that is not one valid public key line (also shows its fingerprint).
printf '%s\n' "$key" | ssh-keygen -l -f - || { echo "That is not a valid SSH public key."; exit 1; }

if ! id "$user" >/dev/null 2>&1; then
  adduser --disabled-password --comment "$name" "$user" >/dev/null
  echo "Created user $user ($name)"
fi
usermod -aG sudo,docker "$user"

home="$(getent passwd "$user" | cut -d: -f6)"
install -d -m 700 -o "$user" -g "$user" "$home/.ssh"
auth="$home/.ssh/authorized_keys"
touch "$auth"
grep -qxF "$key" "$auth" || printf '%s\n' "$key" >> "$auth"
chown "$user:$user" "$auth"; chmod 600 "$auth"

# Sudo password, first run only ("P" = a usable password is already set).
passfile="/root/$user-sudo-password.txt"
if [ "$(passwd -S "$user" | awk '{print $2}')" != P ]; then
  pw="$(openssl rand -base64 18 | tr -d '/+=\n')"
  printf '%s:%s\n' "$user" "$pw" | chpasswd
  ( umask 077; printf 'sudo password for %s: %s\n' "$user" "$pw" > "$passfile" )
  unset pw
  echo "Sudo password set and saved to $passfile (not shown here)"
fi

echo "Groups: $(id -nG "$user")"
echo "Keys in $auth: $(grep -c . "$auth")"
