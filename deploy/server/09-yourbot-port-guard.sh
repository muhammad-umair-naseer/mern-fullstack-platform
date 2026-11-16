#!/usr/bin/env bash
# RETIRED 2026-11-16: YourBot now binds its ports to 127.0.0.1 and publishes no
# database port, so this guard was removed from the server (unit, helper and
# DOCKER-USER rules). Kept for reference; re-run only if a container publishes
# on 0.0.0.0 again.
#
# Temporary guard: keep YourBot's published Docker ports off the internet.
# Run on the server as deploy:  sudo bash /opt/cortexis/deploy/server/09-yourbot-port-guard.sh
#
# YourBot (/home/abdullah/yourbot, containers watibot_*) publishes 5432
# (Postgres), 8000, 5173, 5174 and 5175 on 0.0.0.0 and ::. Docker writes its
# own firewall rules for published ports, which bypass ufw, so they answer
# from the internet. This drops new connections to those ports that arrive on
# the public interface, in Docker's DOCKER-USER chain (IPv4 and IPv6). Nginx
# reaches them on 127.0.0.1 (loopback, never the public interface), so
# yourbot.cortexissolutionhub.com keeps working.
#
# Survives reboots and Docker restarts: installs /usr/local/sbin/yourbot-port-guard
# and a systemd unit that runs it whenever docker.service starts. Safe to re-run.
# Remove it once YourBot binds its ports to 127.0.0.1 (docker-compose change):
#   sudo systemctl disable --now yourbot-port-guard && sudo rm /etc/systemd/system/yourbot-port-guard.service /usr/local/sbin/yourbot-port-guard
#   (then restart Docker or delete the rules: iptables/ip6tables -D DOCKER-USER ...)
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo."; exit 1; }

install -m 755 /dev/stdin /usr/local/sbin/yourbot-port-guard <<'GUARD'
#!/usr/bin/env bash
# Drops new internet connections to YourBot's published ports (see
# /opt/cortexis/deploy/server/09-yourbot-port-guard.sh). Idempotent.
set -euo pipefail
IFACE="$(ip -o route get 1.1.1.1 | grep -oP 'dev \K\S+')"   # the public interface (eth0)
PORTS=(5432 8000 5173:5175)                                  # conntrack takes one port or a range
for ipt in iptables ip6tables; do
  $ipt -L DOCKER-USER -n >/dev/null 2>&1 || continue         # chain exists once Docker has started
  for p in "${PORTS[@]}"; do
    # --ctorigdstport is the port the client dialled, before Docker's DNAT.
    rule=(-i "$IFACE" -p tcp -m conntrack --ctdir ORIGINAL --ctorigdstport "$p" -m comment --comment yourbot-port-guard -j DROP)
    $ipt -C DOCKER-USER "${rule[@]}" 2>/dev/null || $ipt -I DOCKER-USER 1 "${rule[@]}"
  done
done
GUARD

cat > /etc/systemd/system/yourbot-port-guard.service <<'UNIT'
[Unit]
Description=Keep YourBot's published Docker ports off the internet (DOCKER-USER)
After=docker.service
PartOf=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/sbin/yourbot-port-guard

[Install]
WantedBy=docker.service multi-user.target
UNIT

systemctl daemon-reload
systemctl enable yourbot-port-guard.service >/dev/null
systemctl restart yourbot-port-guard.service
echo "== DOCKER-USER (IPv4)"; iptables -S DOCKER-USER | grep yourbot-port-guard
echo "== DOCKER-USER (IPv6)"; ip6tables -S DOCKER-USER | grep yourbot-port-guard
echo "== unit: $(systemctl is-enabled yourbot-port-guard) / $(systemctl is-active yourbot-port-guard)"
