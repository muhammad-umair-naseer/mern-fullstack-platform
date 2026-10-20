FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY . .
ENV PORT=3000
ENV DB_PATH=/data/sketch.db
RUN mkdir -p /data && chown -R node:node /data
VOLUME ["/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/healthz || exit 1
USER node
CMD ["node", "server/index.js"]
