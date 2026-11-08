#!/usr/bin/env python3
"""Insert a hook only into the known live deployment readiness branch."""
import argparse
from datetime import datetime, timezone
from pathlib import Path
import shutil

MARKER = '    echo "Website is ready."\n'
TAG = "# Cortexis automatic cache purge (after readiness)"
HOOK = '''    # Cortexis automatic cache purge (after readiness)
    if ! python3 "$APP_DIR/deploy/cloudflare-purge.py"; then
      echo "Website deployed, but cache purge/verification failed. Run deploy/cloudflare-purge.py again after fixing the error." >&2
      exit 2
    fi
'''


def patched(source):
    if TAG in source:
        if HOOK not in source:
            raise RuntimeError("Existing hook differs; inspect it before changing.")
        return source
    if source.count(MARKER) != 1 or 'http://127.0.0.1:5000/ready; then\n' not in source:
        raise RuntimeError("Deployment script differs from reviewed version; inspect it first.")
    before = source.split(MARKER)[0]
    if not before.endswith('  if curl -fsS -o /dev/null http://127.0.0.1:5000/ready; then\n'):
        raise RuntimeError("Readiness branch differs; refusing to guess hook location.")
    return source.replace(MARKER, HOOK + MARKER)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("script", type=Path)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    source = args.script.read_text()
    result = patched(source)
    if result == source:
        print("Hook already installed.")
    elif not args.apply:
        print("Compatible script. No changes made; use --apply after credential and purge tests.")
    else:
        backup = args.script.with_name(args.script.name + ".before-cache-" +
                                      datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + ".bak")
        shutil.copy2(args.script, backup)
        args.script.write_text(result)
        print("Hook installed. Previous script saved as " + str(backup))
