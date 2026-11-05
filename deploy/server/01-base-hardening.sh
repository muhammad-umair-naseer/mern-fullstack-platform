#!/usr/bin/env bash
# Run on the server as root. Basic hardening for a fresh Ubuntu VPS.
# Safe to re-run: every step checks before it changes anything.
#
#   sudo bash deploy/server/01-base-hardening.sh
#
# What it does, in order:
#   1. Installs security updates and a few tools.
#   2. Firewall (ufw): allows SSH FIRST, then web traffic (80, 443), then turns
#      it on. Allowing SSH before enabling is what keeps you from locking
#      yourself out.
#   3. fail2ban: bans IPs that keep guessing SSH passwords.
#   4. unattended-upgrades: installs security patches automatically every day.
#   5. Creates the "deploy" user with sudo and copies root's SSH key to it.
#      Root login is NOT disabled here; that is a later, separate step once
#      you have confirmed the deploy user works.
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
[ "$(id -u)" -eq 0 ] || { echo "Run as root (or with sudo)."; exit 1; }
export DEBIAN_FRONTEND=noninteractive

echo "== 1. Updates and tools"
apt-get update -y
apt-get upgrade -y
apt-get install -y ufw fail2ban unattended-upgrades apt-listchanges \
  curl ca-certificates gnupg git rsync jq htop

echo "== 2. Firewall"
ufw allow OpenSSH            # first, always
ufw allow 80/tcp             # HTTP (redirects to HTTPS)
ufw allow 443/tcp            # HTTPS
ufw default deny incoming
ufw default allow outgoing
ufw --force enable           # no-op if already enabled
ufw status verbose

echo "== 3. fail2ban (SSH brute-force protection)"
# A local override file: package upgrades never overwrite it.
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd

[sshd]
enabled = true
EOF
systemctl enable --now fail2ban
systemctl restart fail2ban

echo "== 4. Automatic security updates"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl enable --now unattended-upgrades

echo "== 5. The deploy user"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG sudo "$DEPLOY_USER"
# sudo without a password for this key-only user, so scripts can run unattended.
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/90-$DEPLOY_USER"
chmod 440 "/etc/sudoers.d/90-$DEPLOY_USER"
visudo -cf "/etc/sudoers.d/90-$DEPLOY_USER"
# Same SSH key as root, so you log in as deploy from your Mac.
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
if [ -f /root/.ssh/authorized_keys ]; then
  install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /root/.ssh/authorized_keys "/home/$DEPLOY_USER/.ssh/authorized_keys"
else
  echo "WARNING: root has no authorized_keys yet. Run 00-mac-ssh-key.sh from your Mac first."
fi

echo
echo "Done. From your Mac, test in a NEW Terminal window (keep this one open):"
echo "  ssh $DEPLOY_USER@$(curl -s -4 ifconfig.me || echo '<server-ip>')"
echo "  sudo whoami      # should print: root"
