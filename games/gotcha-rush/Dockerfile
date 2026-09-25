FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=3000
ENV DATA_FILE=/data/gotcharush.json
# the puzzle bank ships pre-verified; the live Lab stays off unless RUNNER=docker|judge0 and RUNNER_LIVE=1
ENV RUNNER=off
VOLUME ["/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/healthz || exit 1
CMD ["node", "server/index.js"]
