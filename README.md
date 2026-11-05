# Cortexis website

React 19 + Vite frontend, Express API, PostgreSQL, Redis/BullMQ email jobs, separate staff portal, and optional game services. Node 24 is required. This is not a MongoDB deployment.

## Structure

- `client/src/features/`: auth, learning, forms, tools, games, blog, marketing.
- `client/src/components/`, `lib/`, `hooks/`, `seo/`, `data/`: shared UI and browser utilities.
- `server/src/features/`: auth, learning, forms, admin.
- `server/src/config/`, `middleware/`, `setup/`, `services/`, `workers/`: configuration and shared infrastructure.
- `server/src/content/`: maintained course catalogue; `client/content/blog/`: maintained posts.
- `admin/`: staff interface; `games/`: independent optional game applications.
- `deploy/`: Nginx, backup, restore drill and production instructions.
- `data/`: runtime game data. Do not delete it as project cleanup.

Legacy standalone tool projects, audit output and generated guides are not part of this repository or deployment. Keep local archives outside this checkout. Generated PDF/OCR vendor assets are recreated from the client lockfile by `npm run sync:vendors --prefix client` (also run automatically before development and builds); do not commit them. Other hand-maintained vendor assets remain tracked.

## Local development

1. Install Node 24, PostgreSQL and Redis.
2. Copy `server/.env.example` to `server/.env`; set local database, Redis, SMTP and fresh random signing keys. Configure a real SMTP test account or use the automated synthetic-mail tests.
3. Run `npm run install:all`, then `npm start --prefix server` and `npm start --prefix client`.
4. Optional staff portal: `npm run start:admin`. Game launch scripts retain their individual names.

Registration requires successful queue acceptance or direct SMTP acceptance. Verification codes are not printed to logs. Passwords use bcrypt; verification codes use an HMAC digest. Previously issued website sessions are intentionally invalid after the signing-key and JWT-claims upgrade.

## Checks and build

```sh
npm run lint
npm run check --prefix server
# Must name an isolated database cortexis_test*. Never point this at application data.
DATABASE_URL=postgresql://test_user:password@127.0.0.1:5432/cortexis_test_local \
REDIS_TEST_URL=redis://127.0.0.1:6379/15 npm test --prefix server
npm test --prefix client
node --test admin/test/*.test.js
npm run check --prefix client/public/toolkit
npm test --prefix client/public/toolkit
REACT_APP_SITE_URL=https://your-domain.example npm run build --prefix client
docker build -t cortexis-website:release .
```

Chrome/Chromium is required for prerendering; set `CHROME_PATH` if auto-detection fails. The build fails if prerendering fails. `client/build/prerender-manifest.json` records completion. Build in CI or on a development machine, then deploy the image; do not install Chromium on a small VPS just to build.

Frontend variables are public build-time values. Never put credentials in `REACT_APP_*`. See [deployment instructions](deploy/README.md). No remote deployment or live provider email delivery is implied by local passing tests.
