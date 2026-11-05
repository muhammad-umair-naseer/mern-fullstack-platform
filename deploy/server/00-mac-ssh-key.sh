#!/usr/bin/env bash
# Run on your Mac (not the server). Creates an SSH key if you have none and
# installs it for root on the VPS, so later logins need no password.
# Safe to re-run: an existing key is reused, and ssh-copy-id skips a key the
# server already has.
#
#   bash deploy/server/00-mac-ssh-key.sh 13.140.220.173
set -euo pipefail

SERVER_IP="${1:?usage: bash deploy/server/00-mac-ssh-key.sh <server-ip>}"
KEY="$HOME/.ssh/id_ed25519"

# 1. A modern ed25519 key. You will be asked for an optional passphrase:
#    one is recommended; macOS can remember it in the Keychain.
if [ ! -f "$KEY" ]; then
  ssh-keygen -t ed25519 -C "umair-macbook" -f "$KEY"
fi

# 2. Remember the passphrase in the macOS Keychain so you type it once.
grep -q "UseKeychain yes" "$HOME/.ssh/config" 2>/dev/null || cat >> "$HOME/.ssh/config" <<'EOF'

Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
EOF
chmod 600 "$HOME/.ssh/config"
# Store the passphrase in the Keychain now (the config above alone only
# offers to; this is what stops the prompt after every restart).
ssh-add --apple-use-keychain "$KEY"

# 3. Copy the public key to root on the server. This asks for the root
#    password ONE last time (type it into the Terminal, never into chat).
ssh-copy-id -i "$KEY.pub" "root@$SERVER_IP"

echo "Done. Test: ssh root@$SERVER_IP  (it should not ask for the server password)"
