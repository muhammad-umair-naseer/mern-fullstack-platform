# Cloudflare cache: deployment reminder

Recorded: 9 November 2026 (Asia/Karachi).
Evidence: settings and curl output supplied by the user in the deployment chat;
not a fresh independent inspection of the Cloudflare account.

## Operator reminder

Same URL wali cached JS/CSS/image/font update ya delete ki hai? Successful deploy
ke BAAD us URL ka Cloudflare cache purge karo. Naya content-hashed URL ho to
normally purge ki zaroorat nahi. Local edit save karna production deployment nahi.

## Recorded rules

- `Cortexis versioned assets`: main host `cortexissolutionhub.com`, `/assets/`,
  extensions js, css, png, jpg, jpeg, webp, avif, svg, ico, woff, woff2, ttf, otf.
  Edge TTL override: 1 day. Browser TTL left at its existing/default setting.
- `Cortexis public static files`: Edge TTL override 2 hours; Browser TTL Bypass.
  Same extension allowlist. Main host paths: `/media/reel/`,
  `/vendor/standard_fonts/`, plus exact `/favicon.ico`, `/favicon-32x32.png`,
  `/favicon-16x16.png`, `/apple-touch-icon.png`, `/cortexis-mark.png`,
  `/cx-intro-head.js`.
  Game hosts: gotcha, typedash, pickparty, sketch under cortexissolutionhub.com.
  Game paths: `/css/`, `/js/`, `/img/`, `/vendor/gif/`, plus exact
  `/shared/scoring.js` and `/favicon.svg`.
- These rules do not target HTML, API/login responses, admin, or `/socket.io/`.
- Samples of website JS/CSS/images, a public TTF font, game CSS and a game image
  returned HTTP 200 with the expected content types and `CF-Cache-Status: HIT`.
  This is sample verification, not proof that every asset is cached.
- TypeDash `server/fonts` files were found on disk, but were not verified as
  public URLs. Do not expose internal files just to cache them.

Recheck current rules when changing this policy; dashboard settings can drift.

## Before and after a release

1. Identify changed/deleted cached public URLs. Include exact query-string variants
   used by pages (for example favicon URLs with `?v=2`). Do not ignore query strings
   in cache keys merely to simplify invalidation.
2. If a changed asset gets a new content hash and pages reference the new URL,
   normally no purge is needed for that new asset. Do not assume game filenames
   are versioned: `/js/main.js` and `/css/style.css` currently keep their names.
3. Deploy first, confirm readiness, and confirm the origin serves the new content.
4. Purge changed/deleted same-URL assets through the domain's Cloudflare cache
   purge controls, using Custom Purge / URL-based purge. Supply full HTTPS URLs;
   target affected URLs rather than Purge Everything. If the UI has changed,
   consult current Cloudflare documentation.
5. Fetch affected public URLs, check status/content type and compare expected
   content or checksums with the deployed origin. Repeat to check cache behavior.
   A HIT proves cached delivery, not that the cached content is the new version.
6. Check affected pages and game flows. Record whether invalidation completed or
   remains pending. Apply the same procedure to rollbacks.

Cloudflare purge does not clear copies already stored in visitors' browsers or
update an already-open page. Versioned URLs are preferred for reliable releases.
For same-URL resources, consider browser cache headers as well as Edge TTL.

## Automation status and boundary

Automatic purge helpers and the remote-deploy hook are installed per user-supplied
server output. A manual live run purged and verified 602 URLs; the second run had
zero changes. The downloaded script contains the hook, and the user reported its
bash syntax check passed. A full hooked deployment and source-branch synchronization
remain pending. See [installation and limitations](CLOUDFLARE-AUTOPURGE.md).

For future deployment pipelines: integrate targeted URL invalidation after
readiness, using narrowly scoped Cloudflare purge credentials stored outside
the repository. Check API success and new content;
report purge failures distinctly from a successful application deployment. Never
print tokens, put them in chat, or store them in tracked configuration.

The user's live server uses `/opt/cortexis/deploy/server/remote-deploy.sh`, executed
as `deploy`. The patched live script has been downloaded to this checkout, but
other live build/deploy files may still be absent. Do not overwrite the live
deployment workflow by uploading this older checkout wholesale.

## Reference

- https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/
- https://developers.cloudflare.com/cache/concepts/cache-responses/
