#!/usr/bin/env python3
"""Purge changed public assets from RUNNING containers after a successful release.

Python standard library only. Never sends purge_everything. Credentials are read
from a protected file, never command-line arguments. See CLOUDFLARE-AUTOPURGE.md.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler, urlopen

DOMAIN = "cortexissolutionhub.com"
EXTENSIONS = {"js", "css", "png", "jpg", "jpeg", "webp", "avif", "svg",
              "ico", "woff", "woff2", "ttf", "otf"}
ROOT_FILES = {"/favicon.ico", "/favicon-32x32.png", "/favicon-16x16.png",
              "/apple-touch-icon.png", "/cortexis-mark.png", "/cx-intro-head.js"}
SERVICES = {
    "website": ("cortexis-website", DOMAIN, 5000, "/ready",
                [["/app/client/build", "/"]]),
    "gotcha": ("cortexis-gotcha-rush", "gotcha." + DOMAIN, 3001, "/healthz",
               [["/app/public", "/"], ["/app/shared", "/shared/"]]),
    "typedash": ("cortexis-typedash", "typedash." + DOMAIN, 4001, "/healthz",
                 [["/app/public", "/"]]),
    "pickparty": ("cortexis-pickparty", "pickparty." + DOMAIN, 5001, "/healthz",
                  [["/app/public", "/"], ["/app/shared", "/shared/"]]),
    "sketch": ("cortexis-sketch-and-guess", "sketch." + DOMAIN, 7001, "/healthz",
               [["/app/public", "/"], ["/app/node_modules/gif.js/dist", "/vendor/gif/"]]),
}

# Runs inside the already deployed Node containers; does not require host Node.
COLLECT = r'''
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const roots = JSON.parse(process.argv[1]), files = {}, refs = [];
function walk(root, prefix) {
  for (const e of fs.readdirSync(root, {withFileTypes:true})) {
    const full = path.join(root, e.name), url = prefix + encodeURIComponent(e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) { walk(full, url + '/'); continue; }
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).slice(1).toLowerCase();
    if (!['js','css','png','jpg','jpeg','webp','avif','svg','ico','woff','woff2','ttf','otf','html'].includes(ext)) continue;
    const data = fs.readFileSync(full);
    files[url] = crypto.createHash('sha256').update(data).digest('hex');
    if (['html','css','js'].includes(ext)) {
      for (const m of data.toString('utf8').matchAll(/["'(]([^\s"'<>`)]*\?[^\s"'<>`)]*)["')]/g))
        refs.push([url, m[1]]);
    }
  }
}
for (const [root, prefix] of roots) walk(root, prefix);
process.stdout.write(JSON.stringify({files, refs}));
'''


def eligible(url):
    p = urlsplit(url)
    if p.scheme != "https" or p.netloc not in {s[1] for s in SERVICES.values()}:
        return False
    if p.fragment or p.path.rsplit(".", 1)[-1].lower() not in EXTENSIONS:
        return False
    if p.netloc == DOMAIN:
        return p.path in ROOT_FILES or p.path.startswith(
            ("/assets/", "/media/reel/", "/vendor/standard_fonts/"))
    return p.path in {"/shared/scoring.js", "/favicon.svg"} or p.path.startswith(
        ("/css/", "/js/", "/img/", "/vendor/gif/"))


def manifest(host, collected):
    base = "https://" + host
    files = {base + p: h for p, h in collected["files"].items() if eligible(base + p)}
    for source, ref in collected["refs"]:
        # Regex scanning JS also finds ternaries/regex fragments starting with ?.
        # Require an explicit asset filename and a literal, URL-safe query.
        # Dynamic expressions and query-only references require manual review.
        if not re.fullmatch(
                r"[^\s\\\"'<>`(){}\[\]|?]+\.(?:js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|otf)"
                r"\?[A-Za-z0-9_.~%=&+,:/@;!-]+(?:#[A-Za-z0-9_.~-]+)?", ref,
                flags=re.IGNORECASE):
            continue
        url = urljoin(base + source, ref).split("#", 1)[0]
        parsed = urlsplit(url)
        # Only query variants of real, public files on this same service.
        if parsed.netloc == host and eligible(url) and base + parsed.path in files:
            files[url] = files[base + parsed.path]
    return files


def changed_urls(old, new):
    return sorted(u for u in old.keys() | new.keys() if old.get(u) != new.get(u))


def collect(name):
    container, host, port, health, roots = SERVICES[name]
    with urlopen("http://127.0.0.1:%d%s" % (port, health), timeout=15) as r:
        if r.status != 200:
            raise RuntimeError("Readiness failed: " + name)
    result = subprocess.run(["docker", "exec", container, "node", "-e", COLLECT,
                             json.dumps(roots)], capture_output=True, check=False, timeout=90)
    if result.returncode:
        raise RuntimeError("Cannot inventory running container: " + container)
    current = manifest(host, json.loads(result.stdout))
    if not current:
        raise RuntimeError("No eligible assets found: " + name)
    return current


def credentials(path):
    path = Path(path)
    if os.name == "posix" and stat.S_IMODE(path.stat().st_mode) & 0o077:
        raise RuntimeError("Credential file must have mode 600 (no group/other access).")
    value = json.loads(path.read_text())
    zone, token = value.get("zone_id", ""), value.get("api_token", "")
    if not isinstance(zone, str) or not re.fullmatch(r"[a-fA-F0-9]{32}", zone):
        raise RuntimeError("Invalid Cloudflare zone_id.")
    if not isinstance(token, str) or not token or re.search(r"\s", token):
        raise RuntimeError("Invalid Cloudflare api_token.")
    return zone, token


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def purge(urls, zone, token):
    if not all(eligible(u) for u in urls):
        raise RuntimeError("Refusing purge outside the recorded static URL allowlist.")
    opener = build_opener(NoRedirect())
    for offset in range(0, len(urls), 100):
        batch = urls[offset:offset + 100]
        req = Request("https://api.cloudflare.com/client/v4/zones/" + zone + "/purge_cache",
                      data=json.dumps({"files": batch}).encode(), method="POST",
                      headers={"Authorization": "Bearer " + token,
                               "Content-Type": "application/json"})
        for attempt in range(4):
            try:
                with opener.open(req, timeout=30) as response:
                    result = json.load(response)
                if result.get("success") is not True:
                    raise RuntimeError("Cloudflare rejected purge; state was not advanced.")
                break
            except HTTPError as exc:
                if (exc.code == 429 or exc.code >= 500) and attempt < 3:
                    time.sleep(5 * (attempt + 1))
                    continue
                raise RuntimeError("Cloudflare purge HTTP %d; state was not advanced." % exc.code) from None
            except (URLError, TimeoutError):
                if attempt < 3:
                    time.sleep(5 * (attempt + 1))
                    continue
                raise RuntimeError("Cloudflare connection failed; state was not advanced.") from None
        print("Purge API accepted %d URLs." % len(batch), flush=True)
        if offset + 100 < len(urls):
            time.sleep(1)


def fetch_content(url, host=None):
    command = ["curl", "--silent", "--show-error", "--max-time", "25",
               "--header", "Accept-Encoding: identity", "--write-out", "\n%{http_code}"]
    if host:
        command.extend(["--header", "Host: " + host, "--header", "X-Forwarded-Proto: https"])
    result = subprocess.run(command + [url], capture_output=True, timeout=30)
    body, _, status = result.stdout.rpartition(b"\n")
    if result.returncode or not re.fullmatch(rb"[1-5][0-9]{2}", status):
        raise RuntimeError("Cannot fetch asset for verification: " + url)
    return status, hashlib.sha256(body).hexdigest()


def verify(urls, expected):
    # Verify all changed/deleted URLs, not just whether CF reports HIT.
    for index, url in enumerate(urls, 1):
        if url in expected:
            target = (b"200", expected[url])
        else:
            # A removed URL may correctly return an SPA fallback with status 200.
            # Match the actual current origin rather than accepting any 200 page.
            parsed = urlsplit(url)
            port = next(s[2] for s in SERVICES.values() if s[1] == parsed.netloc)
            local = "http://127.0.0.1:%d%s" % (port, parsed.path)
            if parsed.query:
                local += "?" + parsed.query
            target = fetch_content(local, parsed.netloc)
            if target[0].startswith(b"5"):
                raise RuntimeError("Origin error for removed asset: " + url)
        good = False
        for attempt in range(3):
            try:
                good = fetch_content(url) == target
            except RuntimeError:
                good = False
            if good:
                break
            if attempt < 2:
                time.sleep(2)
        if not good:
            raise RuntimeError("Public content verification failed: " + url)
        if index % 25 == 0 or index == len(urls):
            print("Verified public content: %d/%d URLs." % (index, len(urls)), flush=True)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--credentials", default="/etc/cortexis/cloudflare-purge.json")
    p.add_argument("--state-dir", default="/var/lib/cortexis-cache")
    p.add_argument("--services", nargs="+", choices=list(SERVICES), default=list(SERVICES))
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()
    state_dir = Path(args.state_dir)
    state_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    import fcntl  # Live server is Linux; locks concurrent hook runs.
    with (state_dir / "purge.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        state_file = state_dir / "assets.json"
        old = json.loads(state_file.read_text()) if state_file.exists() else {}
        new = dict(old)
        selected_hosts = {SERVICES[n][1] for n in args.services}
        previous = {u: h for u, h in old.items() if urlsplit(u).netloc in selected_hosts}
        current = {}
        for name in args.services:
            current.update(collect(name))
        urls = changed_urls(previous, current)
        if args.dry_run:
            print("DRY RUN: %d URLs need purge. No API call or baseline update." % len(urls))
            for url in urls:
                print(url)
            return
        if urls:
            zone, token = credentials(args.credentials)
            purge(urls, zone, token)
            verify(urls, current)
        for url in previous:
            new.pop(url, None)
        new.update(current)
        temp = state_dir / "assets.json.tmp"
        temp.write_text(json.dumps(new, indent=2) + "\n")
        temp.replace(state_file)
        print("Cache check complete: %d URLs purged and content verified." % len(urls))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Never dump raw HTTP bodies or credentials on errors.
        message = str(exc) if isinstance(exc, RuntimeError) else type(exc).__name__
        print("PURGE PENDING: " + message, file=sys.stderr)
        sys.exit(2)
