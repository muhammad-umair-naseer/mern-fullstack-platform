# syntax=docker/dockerfile:1

# ---------------------------------------------------------------- client build
FROM node:24-alpine AS client-builder
WORKDIR /app

# The sitemap and the prerender import the course catalogue from the server
# tree; the course files themselves import the authoring helpers beside them,
# so the whole content directory comes along, not just courses/.
COPY server/src/content /app/server/src/content

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
ENV NODE_ENV=production

# Two ways to arrive here. CI hands in a client/build it has already built and
# prerendered against a live API and Postgres — the marker file proves it —
# and that build is used as-is. A host building on its own has no API to
# prerender against, so it builds the bundle here; the prerender step notices
# there is no API and skips itself, and the site still works, just without
# static HTML behind each route. Ship CI-built images to production.
RUN if [ -f build/.ci-build ] && [ -f build/tools/pdf-merger/index.html ]; then \
      echo "Using the prebuilt, prerendered client from CI"; \
    else \
      echo "No prebuilt client; building here (no prerender without an API)"; \
      rm -rf build && npm run build; \
    fi \
    && test -f build/index.html && test -f build/sitemap.xml

# -------------------------------------------------------------------- runtime
FROM node:24-alpine AS runner

ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./

# The compiled client the API serves on its own origin.
COPY --from=client-builder /app/client/build /app/client/build

RUN chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health > /dev/null || exit 1

CMD ["node", "src/server.js"]
