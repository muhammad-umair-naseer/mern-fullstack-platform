# Automatic purge: installed on VPS; next release verification pending

9 November 2026. The user requested automatic cache invalidation after deployment.
User-supplied server output confirms protected credentials were saved, 602 URLs
were purged and content verified, and an immediate second run purged zero URLs.
The guarded installer added the hook and the user reported bash syntax checking
passed. The downloaded `deploy/server/remote-deploy.sh` was inspected locally and
contains the hook after readiness and before the success message. A full deployment
with the hook installed has NOT yet been observed. Local tests (10 passing) use
fake API responses and a real Node collector. The helpers and patched script must
be merged/synchronized to the actual deployment source used by both operators.
This review branch is based on feature/vps-deploy; the original Windows checkout
is on main. Do not upload either checkout wholesale over newer live code.

The first dry-run exposed false query URLs from JS fragments. The corrected
script rejects those; the second dry-run and successful live run used 602 URLs.

## Behavior

- Run the purge helper after a successful deployment/readiness check, as `deploy`.
- It inventories actual RUNNING website/game containers, not a possibly newer
  source checkout. The known public roots and cache-rule paths are allowlisted.
- Hashes public assets and compares against the last successfully verified state.
  New, changed, and deleted eligible URLs are targeted. A first run targets all
  discovered eligible URLs because there is no trusted baseline yet.
- Includes query variants found as literal references in HTML/CSS/JS. Arbitrary
  runtime-generated query strings and custom Cloudflare cache keys are not covered;
  inspect those before adding new asset URL schemes. Do not change query-string
  cache behavior to compensate without reviewing the app.
- Sends at most 100 URLs per API request, retries transient failures, and never
  uses `purge_everything`. Rejects redirects from the credentialed API request.
- Checks public response bytes against deployed file hashes after API success.
  Removed URLs are compared with the current origin response (including a possible
  SPA fallback). Cloudflare transforms could cause a verification failure; review
  that failure rather than disabling verification blindly.
- Advances its baseline only after every purge/verification succeeds. A failure
  exits nonzero with PURGE PENDING; retry the helper without redeploying the app.
- Stores only public URL/hash state in `/var/lib/cortexis-cache/assets.json` and
  uses a Linux file lock to serialize hook runs. Continue to serialize DEPLOYS as
  well; this hook alone does not lock the full deployment process.
- Defaults to all five currently deployed services. For a separate game release,
  run the helper after that release with e.g. `--services gotcha`. The website
  deployment script does not deploy game images for you.

## One-time setup reference (steps 1-6 completed per user output)

1. Cloudflare profile -> API Tokens -> Create Custom Token:
   permission **Zone / Cache Purge / Purge**, scoped to the specific zone
   `cortexissolutionhub.com`. No DNS-edit or all-zone permission is needed.
   Record the Zone ID from the domain Overview. Never paste the token into chat.
2. From the Windows workspace root, transfer the helpers:

   ```powershell
   scp ".\MERN PROJECT\deploy\cloudflare-purge.py" ".\MERN PROJECT\deploy\install-cache-hook.py" abdullah@13.140.220.173:~/
   ```

3. In the server SSH session, install only the new helper files (do not replace
   the actual deployment script with this older checkout):

   ```bash
   sudo install -o deploy -g deploy -m 755 ~/cloudflare-purge.py /opt/cortexis/deploy/cloudflare-purge.py
   sudo install -o deploy -g deploy -m 755 ~/install-cache-hook.py /opt/cortexis/deploy/install-cache-hook.py
   sudo mkdir -p /etc/cortexis
   sudo install -d -o deploy -g deploy -m 700 /var/lib/cortexis-cache
   ```

4. Create credentials with a hidden prompt. This refuses to overwrite an existing
   credential file; inspect existing configuration before rotating it.

   ```bash
   sudo python3 - <<'PY'
   import getpass, json, os, pwd, re
   zone = input('Cloudflare Zone ID: ') if os.isatty(0) else None
   if zone is None:
       with open('/dev/tty') as tty:
           print('Cloudflare Zone ID: ', end='', flush=True)
           zone = tty.readline().strip()
   if not re.fullmatch(r'[a-fA-F0-9]{32}', zone):
       raise SystemExit('Invalid Zone ID; nothing saved.')
   token = getpass.getpass('Cloudflare purge token (hidden): ')
   if not token or re.search(r'\s', token):
       raise SystemExit('Invalid token format; nothing saved.')
   owner = pwd.getpwnam('deploy')
   fd = os.open('/etc/cortexis/cloudflare-purge.json', os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
   with os.fdopen(fd, 'w') as out:
       os.fchown(out.fileno(), owner.pw_uid, owner.pw_gid)
       json.dump({'zone_id': zone, 'api_token': token}, out)
       out.write('\n')
   print('Credentials saved privately; token was not printed.')
   PY
   ```

5. Check the planned URLs without an API call, then run the initial purge and
   verification. The first run can take several minutes:

   ```bash
   sudo -u deploy python3 /opt/cortexis/deploy/cloudflare-purge.py --dry-run
   sudo -u deploy python3 /opt/cortexis/deploy/cloudflare-purge.py
   ```

   Stop on errors; resolve them before installing the automatic hook. Confirm a
   second run reports zero changes. Check website/login/game flows.

6. Inspect the current live script. The installer only accepts the exact readiness
   branch already reviewed in chat and makes a timestamped backup before editing:

   ```bash
   sudo -u deploy python3 /opt/cortexis/deploy/install-cache-hook.py /opt/cortexis/deploy/server/remote-deploy.sh
   sudo -u deploy python3 /opt/cortexis/deploy/install-cache-hook.py /opt/cortexis/deploy/server/remote-deploy.sh --apply
   bash -n /opt/cortexis/deploy/server/remote-deploy.sh
   ```

   The hook runs before the existing success message. It reports explicitly if
   the website deployed but purge failed. Failed readiness never invokes it.

7. **Persist the helper files AND the patched live remote-deploy.sh in the actual
   source branch used by both operators.** The friend's Mac uploader can otherwise
   overwrite the live hook with an older script. Do not copy the whole stale local
   checkout over production. Never copy the credential file into source control.

8. At the next authorized release, verify the hook executes, purge succeeds, and
   the changed public content matches. Until that happens report the hook as
   installed but not verified in a real deployment. Deployments that bypass the
   hooked script must explicitly call the helper after readiness.

## Failure/recovery

An API/token/public-verification failure does not roll back a healthy application.
It returns exit code 2 and leaves the previous baseline, so after fixing the error
rerun `sudo -u deploy python3 /opt/cortexis/deploy/cloudflare-purge.py`.
Do not erase state just to suppress a failure. Rollbacks also require running the
helper after the restored application is ready. Cloudflare purge does not remove
browser caches or refresh already-open tabs.

## Validation

```text
python3 -m unittest discover -s deploy -p test_cloudflare_purge.py -v
```

Tests cover allowed paths, changed/deleted/rollback detection, query variants,
the real Node collector, API batching/retry/error handling, stale-content
rejection, deleted-URL fallbacks, and guarded/idempotent hook insertion.

References:
- https://developers.cloudflare.com/api/resources/cache/methods/purge/
- https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- https://developers.cloudflare.com/cache/how-to/purge-cache/
