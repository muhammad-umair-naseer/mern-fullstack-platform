FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=3000
ENV DATA_FILE=/data/gotcharush.json
# runs as the image's unprivileged node user; /data is made theirs before the
# volume is declared, so a fresh named volume starts out writable by them
RUN mkdir -p /data && chown -R node:node /data
# the puzzle bank ships pre-verified; the live Lab stays off unless RUNNER=docker|judge0 and RUNNER_LIVE=1
ENV RUNNER=off
VOLUME ["/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/healthz || exit 1
USER node
CMD ["node", "server/index.js"]
