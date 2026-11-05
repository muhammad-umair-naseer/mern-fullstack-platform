# syntax=docker/dockerfile:1
# Build and prerender client first (npm ci --prefix client && npm run build --prefix client).
# CI promotes that checked artifact; Chromium and build tools do not belong on the small VPS.
FROM node:24-bookworm-slim
ENV NODE_ENV=production PORT=5000 HOST=0.0.0.0
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node server/src ./src
COPY --chown=node:node server/scripts ./scripts
COPY --chown=node:node client/build /app/client/build
RUN test -s /app/client/build/index.html && test -s /app/client/build/prerender-manifest.json
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 CMD node -e "fetch('http://127.0.0.1:5000/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "src/server.js"]
