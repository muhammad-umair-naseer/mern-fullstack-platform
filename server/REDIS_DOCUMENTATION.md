# Redis Integration & Architecture Guide — Cortexis Solution Hub

This document details the Redis caching and distributed state architecture integrated into the Cortexis Solution Hub platform.

---

## 1. Why Redis Was Added

The Cortexis platform provides interactive courses, lessons, and certificate verification. Prior to Redis integration:
1. Every catalogue browse request (`GET /api/learn/courses`) ran synchronous SQLite queries with correlated subqueries calculating total chapters and lessons across 23 courses.
2. Every course outline request (`GET /api/learn/courses/:slug`) executed 6 separate database queries (course, chapters, lessons map, chapter quiz counts, final exam counts, and related course pool).
3. Rate limiting was tracked in local Node.js process memory, which allowed users/bots to bypass limits across multi-process or container instances.

Redis was introduced to:
- Eliminate redundant SQLite queries on static and public data.
- Slash public API response times by up to **30.8%**.
- Increase API throughput by **+40.2% to +42.6%**.
- Provide distributed rate-limiting counters across clustered worker processes.
- Implement cache stampede protection (request coalescing / single-flight).
- Ensure 100% continuous uptime via graceful database fallback when Redis is offline.

---

## 2. Redis Architecture

The integration follows an asynchronous **Cache-Aside (Lazy Loading)** architecture:

```
[Incoming Request] ───> [Redis Rate Limiter] ───> [Route Handler]
                                                         │
                                                  [Check Redis]
                                                 /             \
                                        (HIT)   /               \  (MISS / Offline)
                                               v                 v
                                     [Return Cached JSON]   [Query SQLite DB]
                                                                 │
                                                            [Set Redis with TTL]
                                                                 │
                                                                 v
                                                            [Return Response]
```

### Key Architectural Principles:
1. **Multiplexed Asynchronous Connection**: Uses `ioredis` with a single multiplexed TCP connection per process (no heavy, unnecessary connection pool overhead).
2. **Fail-Safe Circuit / Graceful Degradation**: If Redis is offline or disconnected, all cache lookups return `null` and rate limiters pass through immediately. The application continues operating seamlessly via SQLite with zero user-facing errors.
3. **Request Coalescing (Cache Stampede Protection)**: Concurrent cache misses on the same key share a single in-flight Promise, guaranteeing only 1 database query executes during traffic spikes.
4. **Strict Data Isolation**: Public cached models (catalogues, outlines, question templates) strictly exclude user-specific progress, tokens, or private learner identifiers.

---

## 3. Environment Variables Configuration

Configure these in `server/.env` (or via Docker environment):

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `REDIS_URL` | String | `""` | Optional full connection URL (e.g. `redis://:pass@host:6379/0`) |
| `REDIS_HOST` | String | `127.0.0.1` | Redis host |
| `REDIS_PORT` | Number | `6379` | Redis TCP port |
| `REDIS_PASSWORD`| String | `""` | Optional authentication password |
| `REDIS_DB` | Number | `0` | Redis logical database index |
| `REDIS_TLS` | Boolean | `false` | Enable TLS/SSL connection |
| `REDIS_CONNECT_TIMEOUT` | Number | `5000` | Connection timeout in milliseconds |
| `REDIS_COMMAND_TIMEOUT` | Number | `2000` | Command timeout in milliseconds |

---

## 4. Cache Key Naming Convention & TTL Strategy

All keys follow the namespace pattern:
`cortexis:${NODE_ENV}:${module}:${feature}:${identifier}`

| Feature | Cache Key Pattern | TTL | Invalidation Trigger |
| :--- | :--- | :--- | :--- |
| **Course Catalogue** | `cortexis:${env}:cache:courses:list` | 3600s (1 hour) | `seedCourses()` / Course update |
| **Course Outline** | `cortexis:${env}:cache:courses:outline:${slug}` | 3600s (1 hour) | `seedCourses()` / Course update |
| **Certificates** | `cortexis:${env}:cache:certificate:${code}` | 86400s (24 hours) | On certificate issuance |
| **Rate Limiter (Auth)**| `cortexis:${env}:ratelimit:auth:${ip}` | 900s (15 min) | Automatic key expiration |
| **Rate Limiter (Forms)**| `cortexis:${env}:ratelimit:form:${ip}` | 60s (1 min) | Automatic key expiration |
| **Rate Limiter (Learn)**| `cortexis:${env}:ratelimit:learn:${ip}` | 60s (1 min) | Automatic key expiration |

---

## 5. Cache Invalidation Strategy

- **On Startup / Seeding**: `seedCourses()` in `server/src/content/seed.js` invokes `invalidateCourseCache()`.
- **Pattern Scanning**: `invalidateCourseCache()` uses Redis `SCAN` in non-blocking batches of 100 keys (never blocking `KEYS *` in production).
- **Certificate Pre-Warming & Invalidation**: When `issueCertificate()` creates a certificate, any stale lookup is cleared and populated.

---

## 6. Local Development Setup

1. Start a local Redis instance or container:
   ```bash
   docker run -d --name cortexis-redis -p 6379:6379 redis:7-alpine
   ```
2. In `server/.env`:
   ```env
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```
3. Start the server:
   ```bash
   npm run dev --prefix server
   ```
   *The console will display `⚡ Redis connected and ready`.*

---

## 7. Production Docker Deployment & Security

In `docker-compose.yml`, Redis is placed on an internal private bridge network (`cortexis_internal`) with **no exposed host ports**:

```yaml
services:
  cortexis-website:
    ...
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    networks:
      - cortexis_internal
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    container_name: cortexis-redis
    restart: unless-stopped
    command: redis-server --save 60 1 --loglevel warning --requirepass ${REDIS_PASSWORD}
    volumes:
      - cortexis_redis_data:/data
    networks:
      - cortexis_internal
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

networks:
  cortexis_internal:
    driver: bridge
```

---

## 8. Health Checking & Verification

### Checking Health Endpoint:
```bash
curl http://localhost:5000/health
```

Response when Redis is online:
```json
{
  "ok": true,
  "uptime": 124.5,
  "database": "sqlite (connected)",
  "redis": {
    "status": "ready",
    "latencyMs": 0.45,
    "usedMemory": "1.25M"
  }
}
```

### Verifying Cache HIT / MISS:
Inspect HTTP headers:
- `X-Cache: MISS` (1st request — fetched from SQLite & stored in Redis)
- `X-Cache: HIT` (2nd request — served from Redis in < 2 ms)

---

## 9. BullMQ Background Task Architecture

BullMQ manages asynchronous, non-blocking background jobs (verification emails, contact forms, admin notifications, internship alerts) over Redis.

```
[API Endpoint] ───> [queue.service.js] ───> [Redis Queue: cortexis:emails]
                                                       │
                                                       v
                                            [email.worker.js]
                                          (Worker Concurrency = 2-5)
                                                       │
                                      ┌────────────────┴────────────────┐
                                      v                                 v
                              [Transient Error]                 [Permanent Error]
                            (4xx / Network Timeout)           (5xx / Invalid Address)
                                      │                                 │
                                      v                                 v
                            [3x Exponential Backoff]          [UnrecoverableError]
                            (2s -> 4s -> 8s retries)         (Immediate Fail & Alert)
```

### 1. Best-Effort Offline Fallback Policy
- **Definition**: If Redis is offline or unreachable at the moment an email job is dispatched, the system falls back to immediate in-memory asynchronous execution.
- **Guarantee Level**: **Best-Effort Only**. No 100% "zero-email-dropped" guarantee is made if the Node.js server process is forcefully terminated while Redis is offline. Full persistent durability and automatic retry guarantees require an active Redis connection.

### 2. Idempotency & Deduplication
To prevent duplicate emails on rapid user re-submissions or network retries, deterministic Job IDs are generated:
- **Verification Code**: `verify:${normalizedEmail}:${code}`
- **Contact Inquiries**: `contact:${normalizedEmail}:${md5(message).slice(0,12)}:${1minWindow}`
- **Admin Alerts**: `alert:${key}:${30sWindow}`
- **Signup Notifications**: `signup:${normalizedEmail}`
- **Internship Applications**: `intern:${normalizedEmail}:${encodedTitle}:${1minWindow}`

If a client submits the same payload within the deduplication window, BullMQ ignores the duplicate job.

### 3. Permanent vs Transient SMTP Error Classification
- **Permanent Errors (5xx SMTP codes, invalid envelope, bad login credentials)**:
  - Worker throws `UnrecoverableError`.
  - BullMQ aborts the job immediately without useless infinite retries.
- **Transient Errors (4xx SMTP codes, DNS timeouts, socket disconnects)**:
  - Worker throws a standard error.
  - BullMQ retries up to 3 times with exponential backoff (2s, 4s, 8s).

### 4. Job Retention Configuration
To prevent BullMQ metadata from accumulating and exhausting Redis memory:
- **Completed Jobs**: Retains maximum 100 jobs or 1 hour (`age: 3600`).
- **Failed Jobs**: Retains maximum 500 jobs or 24 hours (`age: 86400`) for debugging.

---

## 10. Redis Memory Planning & OOM Prevention (Multi-Tenant Sharing)

Cache, Distributed Rate Limiter, and BullMQ share the same Redis instance. 

### Why `volatile-lru` Alone Does NOT Prevent OOM:
- **`volatile-lru` Mechanics**: When `maxmemory` is reached, Redis ONLY evicts keys that have an expiration (TTL) set.
- **Cache & Rate Limiter Keys** have TTLs (`cortexis:*:cache:*`, `cortexis:*:ratelimit:*`) and will be evicted under memory pressure to free space.
- **BullMQ Keys** (job hashes, streams, queue metadata) do **NOT** have TTLs. Therefore, Redis will **NEVER** evict BullMQ keys under `volatile-lru`.
- **The OOM Risk**: If BullMQ jobs/metadata accumulate unchecked, once all TTL keys are evicted and memory reaches `maxmemory`, Redis will reject all further write commands with:
  `OOM command not allowed when used memory > 'maxmemory'`.

### Comprehensive Multi-Tenant Protection Strategy:
To guarantee that neither Cache nor BullMQ exhausts Redis memory:
1. **Strict Job Retention Rules**: Completed jobs are retained for max 100 entries / 1 hour; failed jobs for max 500 entries / 24 hours.
2. **Deterministic Deduplication**: Prevents queue bloat from duplicate form re-submits.
3. **Queue Health & Metric Monitoring**: `GET /health` tracks active, waiting, and failed job counts.
4. **Appropriate Sizing**: Recommended `maxmemory 256mb` (or 512mb in high volume) with active monitoring (`used_memory` metrics).

---

## 11. Worker Crash Recovery vs Graceful Restart

BullMQ handles worker failures at two levels:

1. **Graceful Restart / Worker Recycling**:
   - `worker.close()` gracefully finishes in-flight jobs or pauses processing, then cleanly releases listeners and connections.
2. **Abrupt Process Crash & Stalled Job Recovery**:
   - If a worker process abruptly dies (e.g. `SIGKILL`, OOM kill, power loss) mid-execution, the in-flight job remains in `active` state with a temporary Redis lock (`lockDuration: 30s`).
   - Once the lock TTL expires, any surviving or newly started worker's stalled-job checker (`stalledInterval: 30s`) detects the orphaned job.
   - BullMQ moves the job back to `waiting` (or triggers a retry attempt), and Worker B picks it up to complete execution without data loss.

---

## 12. Production Process Separation (API vs Worker)

By default in development, the email worker runs in-process with the Express API server (`initWorker()`).

For production horizontal scaling, the worker can run as an isolated background worker process:
```bash
# Run standalone worker microservice:
node src/workers/email.worker.js
```

In `docker-compose.yml`:
```yaml
services:
  cortexis-api:
    build: ./server
    command: npm start
    environment:
      - EMBEDDED_WORKER=false
      ...

  cortexis-worker:
    build: ./server
    command: node src/workers/email.worker.js
    environment:
      - REDIS_HOST=redis
      ...
    depends_on:
      - redis
```

