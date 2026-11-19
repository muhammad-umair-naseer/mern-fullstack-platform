# GTA VI article SEO follow-up — 19 November 2026

Canonical: https://cortexissolutionhub.com/blog/gta-6-how-to-play-pc-requirements-price

## What changed

- Added an original PC-readiness worksheet: identify CPU/GPU, separate system RAM from VRAM, distinguish storage capacity from free space, and record intended resolution/frame rate. No invented game specifications or benchmarks.
- Added three ownership scenarios to distinguish a missing platform release from a hardware or streaming problem.
- Added a reproducible Pakistan price calculation with explicitly hypothetical FX/fees, checked arithmetic for both editions, and an explanation of all-in access cost. The PKR values are examples, not current market quotes.
- Added contextual incoming links from three existing standalone articles: GPU prices, free browser coding games, and Sketch & Guess. These are body links rather than only automatic related-post cards.
- Kept one article slug, self-canonical, dated source snapshot, Article/FAQ/Breadcrumb schema, compressed images and the existing production rendering pipeline.

## Live checks before deploying this follow-up

The base GTA VI post was already live during this audit. Read-only HTTP checks on 19 November returned:

| Check | Result |
| --- | --- |
| Exact article URL | HTTP 200, no redirect |
| Canonical in returned source | Exact URL above |
| Article meta noindex / X-Robots-Tag | No noindex found; no X-Robots-Tag header |
| Live XML sitemap | HTTP 200; article URL present |
| Three source articles | HTTP 200, own canonicals, no noindex |
| Deliberately nonexistent blog slug | HTTP 404 |

The source articles are crawlable/indexable. Actual Google indexing and Google's chosen canonical have not been verified: that requires Search Console URL Inspection. An HTTP 200 alone does not rule out Google's soft-404 classification; the source/body and real missing-route response provide supporting technical evidence, not access to Google's verdict. No plagiarism score or web-wide uniqueness claim is made.

Run `node scripts/check-gta6-seo.mjs` from `client` after a build/prerender and with a preview at `http://127.0.0.1:3011` (override `BLOG_PREVIEW_URL` if needed). The check verifies static article content, exact canonical, single title structure, no noindex, sitemap inclusion, three contextual inbound links, FAQ schema, image dimensions/size/loading, price arithmetic and desktop/mobile rendering. It simulates a visitor rather than the deployment branch's webdriver prerender path.

## Server release

The deployment branch is `feature/vps-deploy`. Pull only after checking that `/opt/cortexis` is a Git checkout of the correct repository and that its working tree is clean. If it is an upload-managed directory without Git, use the existing uploader from a clean checkout of that branch; do not replace the server from the old local `main` workspace.

After source synchronization, run the existing `/opt/cortexis/deploy/server/remote-deploy.sh` as `deploy`. It runs a full production build. Do not upload a local build made with `ONLY_ROUTES`: that is selected-route QA only. Keep server environment files and deployment-specific configuration intact.

Verify the origin `/ready`, the article body, canonical and sitemap after release. Inspect the purge hook's success output. New content-hashed bundles need no manual purge; the three versioned article images are unchanged in this follow-up. Under the recorded rules, article HTML and sitemap are not cached. If custom HTML caching has since been added, invalidate the article, `/blog`, the three linking articles and `/sitemap.xml` only after origin readiness. Never purge live cache for local-only edits.

Cache review for this follow-up: no changed same-URL cached static asset; no manual purge needed under recorded rules. Live deployment of this follow-up remains a separate action.
