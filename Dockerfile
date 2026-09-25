# syntax=docker/dockerfile:1

# ---------------------------------------------------------------- client build
# Builds the React client AND prerenders every public route into static HTML.
# The prerender needs two things a plain build stage does not have: a browser,
# and the API (it reads the course catalogue through it). Both are provided
# here, so an image built anywhere — CI, a laptop, the production host — ships
# the same crawlable pages. Without them the build still succeeds, but the
# prerender step quietly skips and search engines get an empty shell.
FROM node:24-alpine AS client-builder

RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./

ENV CHROME_PATH=/usr/bin/chromium \
    PRERENDER_API=http://127.0.0.1:5000

# Boot a throwaway API on SQLite for the duration of the build, wait for it,
# build (blog, sitemap, bundle, prerender), then prove the prerender happened.
RUN set -eu; \
    ( cd /app/server && \
      NODE_ENV=test PORT=5000 EMBEDDED_WORKER=false \
      JWT_SECRET=build-time-only-secret-never-used-at-runtime-000 \
      DATABASE_FILE=/tmp/prerender.db \
      REDIS_HOST=127.0.0.1 REDIS_PORT=1 REDIS_CONNECT_TIMEOUT=500 \
      node src/server.js > /tmp/api.log 2>&1 & ); \
    for i in $(seq 1 60); do wget -qO- http://127.0.0.1:5000/health > /dev/null 2>&1 && break; sleep 1; done; \
    wget -qO- http://127.0.0.1:5000/health > /dev/null || { cat /tmp/api.log; exit 1; }; \
    npm run build; \
    test -f build/index.html; \
    test -f build/sitemap.xml; \
    test -f build/tools/pdf-merger/index.html || { echo "prerender did not run"; cat /tmp/api.log; exit 1; }

# -------------------------------------------------------------------- runtime
FROM node:24-alpine AS runner

ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./

# The compiled, prerendered client the API serves on its own origin.
COPY --from=client-builder /app/client/build /app/client/build

# SQLite lives here when DATABASE_URL is not set; production points at Postgres.
RUN mkdir -p /app/server/data && chown -R node:node /app
USER node

EXPOSE 5000
VOLUME ["/app/server/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health > /dev/null || exit 1

CMD ["node", "src/server.js"]
