#!/usr/bin/env bash
# Run on the server with sudo, ONLY after you have confirmed that
#   ssh deploy@<server-ip>   and   sudo whoami
# both work from your Mac. This turns off password logins and direct root
# login over SSH, so the only way in is the deploy user with your SSH key.
# If you lose your Mac's key, use Contabo's VNC console to get back in.
# Safe to re-run.
#
#   sudo bash deploy/server/05-ssh-lockdown.sh
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }
DEPLOY_USER="${DEPLOY_USER:-deploy}"

[ -s "/home/$DEPLOY_USER/.ssh/authorized_keys" ] \
  || { echo "$DEPLOY_USER has no SSH key; refusing to lock SSH down."; exit 1; }

# sshd keeps the FIRST value it reads, and drop-ins are read in name order.
# "00-" puts ours ahead of the image's own files (Ubuntu cloud images ship
# 50-cloud-init.conf with PasswordAuthentication yes), so ours wins.
rm -f /etc/ssh/sshd_config.d/90-cortexis.conf      # older name of this file
cat > /etc/ssh/sshd_config.d/00-cortexis.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
EOF
sshd -t                                   # refuse to apply a broken config
# Prove the effective settings before reloading.
# (read once into a variable: piping into grep -q under pipefail can fail falsely)
effective="$(sshd -T)"
grep -qx "passwordauthentication no" <<<"$effective" || { echo "Password login would still be on; not reloading."; exit 1; }
grep -qx "permitrootlogin no" <<<"$effective" || { echo "Root login would still be on; not reloading."; exit 1; }
systemctl reload ssh 2>/dev/null || systemctl reload sshd
echo "SSH now accepts only key logins, and not as root."
echo "Keep this session open and test in a NEW window: ssh $DEPLOY_USER@<server-ip>"
