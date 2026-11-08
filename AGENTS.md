# Cortexis deployment instructions

## Required cache review

User preference recorded 9 November 2026: when updating or deploying the website
or games, remember Cloudflare cache invalidation without being prompted.

- Read `deploy/CLOUDFLARE-CACHE.md` before a deployment or public asset change.
- Determine the actual changed public URLs from the release being deployed.
  Never derive production filenames from an old conversation example.
- New content-hashed asset URLs normally need no purge. Changed or deleted
  cached files whose public URLs remain the same need targeted invalidation
  after the updated origin is ready, including on rollback.
- If deployment and cache invalidation are authorized and an approved Cloudflare
  connection or securely provisioned credentials are available, purge the affected
  URLs and verify the result. Do not silently broaden to Purge Everything.
- Otherwise give the user a clear reminder with the exact affected URLs and
  manual steps. Never report a purge as completed without execution evidence.
- For local-only edits, record that a purge is needed AFTER deployment; do not
  invalidate the live cache before those changes are deployed.
- End deployment reports with one of: cache purge not needed (new URLs), targeted
  purge completed and checked, or purge pending (list URLs and next action).
- Never request API tokens/passwords in chat or commit secrets. A dashboard login
  does not establish that this agent has API access.

The automatic purge hook is installed on the live remote-deploy.sh per user output
and the downloaded script. A manual live purge verified 602 URLs; a second run
purged zero. Bash syntax checking passed per the user. Verification during a full
deployment is still pending. See `deploy/CLOUDFLARE-AUTOPURGE.md`. This review branch preserves the hook and helpers on top of feature/vps-deploy.
Merge and synchronize them into the source checkout used by every deployment
operator before the next upload, so an old script cannot overwrite the live hook.
Manual releases that bypass the hooked script must run the helper after readiness.
The live server's deploy scripts may differ from this local checkout. Inspect the
current scripts before modifying or running deployment automation.
