# Build stage for React frontend
FROM node:24-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
ENV NODE_ENV=production
RUN npm run build

# Production runtime stage
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server application
COPY server/ ./

# Copy compiled frontend from client-builder stage
COPY --from=client-builder /app/client/build /app/client/build

EXPOSE 5000

CMD ["node", "src/server.js"]

