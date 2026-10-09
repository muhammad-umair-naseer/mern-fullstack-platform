FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=4000
ENV DATA_FILE=/data/typedash.json
# runs as the image's unprivileged node user; /data is made theirs before the
# volume is declared, so a fresh named volume starts out writable by them
RUN mkdir -p /data && chown -R node:node /data
# accounts, points and streaks live here — mount a volume so they survive redeploys
VOLUME ["/data"]
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/healthz || exit 1
USER node
CMD ["node", "server/index.js"]
