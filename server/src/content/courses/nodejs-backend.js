import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'nodejs-backend',
  title: 'Node.js Backend Development',
  category: 'Web',
  level: 'Intermediate',
  duration: '8 weeks',
  accent: 'emerald',
  coverKey: 'nodejs-backend',
  summary:
    'Build Node APIs that survive real traffic — the event loop, Express internals, validation, auth, databases, streams, logging, tests, and a deploy that does not drop requests.',
  description:
    'You build a production-shaped HTTP API layer by layer: raw Node server, Express pipeline, validated REST endpoints, sessions and JWTs, a parameterised data layer, streamed uploads, and structured logs. Each chapter ends with you able to diagnose a specific class of backend failure — a blocked event loop, middleware registered in the wrong order, an unvalidated payload that escalates a role, an injectable query, a leaked file handle, and a deploy that kills in-flight requests.',
  chapters: [
    chapter(
      'The Node Runtime',
      'How Node actually executes your code, how modules load, and what an HTTP server is underneath a framework.',
      [
        lesson('The Event Loop and Non-Blocking I/O', 14, `
Node runs **your JavaScript on a single thread**. It still serves thousands of concurrent connections, and understanding why is the difference between an API that holds up under load and one that mysteriously freezes for everybody at once.

### One thread for your code, other threads for the waiting

When you ask for a file, a database row, or a DNS lookup, Node hands the job to **libuv**, which uses the operating system's async facilities (epoll, kqueue, IOCP) or a small background thread pool. Your thread does not wait. It returns to the **event loop**, picks up the next ready callback, and runs that instead. The result arrives later as a callback or a resolved promise.

So "non-blocking" does not mean fast. It means *your thread is free while something else is slow*.

\`\`\`js
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

// Non-blocking: the loop serves other requests while the disk works
const a = await readFile('./big.json', 'utf8');

// Blocking: nothing else in the entire process runs until this returns
const b = readFileSync('./big.json', 'utf8');
\`\`\`

Sync APIs are fine at startup, before you accept traffic. Called inside a request handler on a busy server, one 200 ms \`readFileSync\` adds 200 ms to *every* request currently in flight, not just its own.

### The phases, in the order they run

Each turn of the loop walks a fixed set of phases:

| Phase | What runs there |
|---|---|
| timers | \`setTimeout\` / \`setInterval\` callbacks whose time has come |
| poll | I/O callbacks — the phase where a server spends most of its life |
| check | \`setImmediate\` callbacks |
| close | \`'close'\` events, e.g. a destroyed socket |

Between **every** callback, Node drains two microtask queues first: \`process.nextTick\` callbacks, then resolved promise callbacks. Microtasks always beat the next phase.

\`\`\`js
console.log('1 sync');
setTimeout(() => console.log('4 timer'), 0);
setImmediate(() => console.log('5 check'));
process.nextTick(() => console.log('2 nextTick'));
Promise.resolve().then(() => console.log('3 promise'));
// CommonJS top level: 1, 2, 3 in that order.
// ES module top level: 1, 3, 2 - the module body already runs inside a microtask,
// so the promise callback drains before Node revisits the nextTick queue.
// 4 and 5 race from the main module either way.
\`\`\`

That last line surprises people. From the top level of a module, \`setTimeout(fn, 0)\` versus \`setImmediate(fn)\` depends on how long the process took to start, so the order genuinely varies between runs. Inside an **I/O callback** it is deterministic: the poll phase is followed immediately by check, so \`setImmediate\` always fires before a zero timer.

A recursive \`process.nextTick\` will starve the loop entirely — the microtask queue is drained to empty before Node ever reaches I/O again. Use \`setImmediate\` when you want to yield.

### The mistake that takes a server down

CPU work has nowhere to go. There is no thread pool for your own loops.

\`\`\`js
// Every request pays, because the loop is pinned for ~300 ms
app.get('/report', (req, res) => {
  const rows = loadAll();                 // 200k rows
  const csv = rows.map(serialiseRow).join('\\n');
  res.type('text/csv').send(csv);
});
\`\`\`

Under one user this looks fine. Under fifty it looks like an outage, because a blocked loop cannot even accept new connections. The tells are identical for \`JSON.parse\` on a huge payload, image resizing in-process, synchronous crypto, and a regex with catastrophic backtracking.

Move that work off the loop: a \`worker_threads\` worker, a background job queue, or a streamed response (Chapter 4) that yields between chunks.

### Measure it, do not guess

\`\`\`js
let last = process.hrtime.bigint();
setInterval(() => {
  const now = process.hrtime.bigint();
  const lag = Number(now - last) / 1e6 - 500;   // ms beyond the scheduled 500
  last = now;
  if (lag > 50) console.warn('event loop lag', Math.round(lag), 'ms');
}, 500).unref();
\`\`\`

Event loop lag is the single most useful Node health metric. When p95 latency rises but CPU looks idle, lag tells you whether you are blocked or merely waiting.
        `),
        lesson('Modules, package.json, and Dependencies', 12, `
Node has two module systems, and mixing them carelessly produces some of the most confusing errors you will meet.

### ESM is the default you should pick

\`\`\`json
{ "name": "api", "type": "module", "engines": { "node": ">=20" } }
\`\`\`

With \`"type": "module"\`, every \`.js\` file is an ES module:

\`\`\`js
// db.js
export const query = (sql, params) => pool.query(sql, params);
export default pool;

// server.js
import pool, { query } from './db.js';          // extension is REQUIRED in ESM
import express from 'express';                   // bare specifier: node_modules
import { readFile } from 'node:fs/promises';     // node: prefix for builtins
\`\`\`

Three rules people trip over: relative imports need the **file extension**, there is no \`require\` and no \`__dirname\`, and \`import\` statements are **hoisted and evaluated before any code in the file runs**.

Replacing \`__dirname\`:

\`\`\`js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
\`\`\`

CommonJS (\`require\` / \`module.exports\`) still runs everywhere and is what most tutorials show. You can \`import\` a CommonJS package from ESM; \`require\` of an ES module works only from Node 20.19 / 22.12 onward, and still fails with \`ERR_REQUIRE_ASYNC_MODULE\` when that module uses top-level await. Pick one style per project and keep it.

### A module body runs exactly once

Node caches modules by resolved path. The first import executes the file top to bottom; every later import gets the same exports object. That makes a module a natural singleton — one connection pool, one logger — but it also creates the classic startup bug:

\`\`\`js
// config.js — runs at IMPORT time, not when you call something
export const config = { dbUrl: process.env.DATABASE_URL };

// server.js
import { config } from './config.js';   // hoisted: runs FIRST
import 'dotenv/config';                 // too late, env was already read
\`\`\`

\`config.dbUrl\` is \`undefined\`, and because \`undefined\` stringifies happily into a connection URL, the error you get is a baffling DNS failure rather than "you forgot to load .env". Load environment variables before anything else — \`node --env-file=.env server.js\`, or make the very first line of your entry file \`import 'dotenv/config'\` and import nothing else above it.

### package.json is a contract, not a formality

\`\`\`json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "node --test"
  },
  "dependencies": { "express": "^4.19.2" },
  "devDependencies": { "supertest": "^7.0.0" }
}
\`\`\`

- **dependencies** ship to production; **devDependencies** do not. Putting your test runner in \`dependencies\` bloats every image; putting \`express\` in \`devDependencies\` breaks the deploy.
- \`^4.19.2\` accepts any later \`4.x\` release (\`>=4.19.2 <5.0.0\`). \`~4.19.2\` accepts later \`4.19.x\` patches. A bare \`4.19.2\` pins exactly.
- \`package-lock.json\` records the **exact tree**, transitive dependencies included. Commit it.
- In CI and Docker, run \`npm ci\`, not \`npm install\`. \`ci\` installs the lockfile verbatim and fails if it disagrees with \`package.json\`; \`install\` may quietly resolve new versions, which is how "it works on my machine" happens.

### Before you add a dependency

Check when it was last published, how many transitive packages it drags in, and whether the built-in module already does it. \`node:crypto\` gives you UUIDs and hashing, \`node:fs/promises\` gives you file work, and \`fetch\` is global since Node 18. Every dependency is code you ship, audit, and patch.
        `),
        lesson('HTTP Servers Without a Framework', 13, `
Express is a convenience layer over \`node:http\`. Writing a server without it once makes every later abstraction legible.

### The smallest correct server

\`\`\`js
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000, () => console.log('listening on 3000'));
\`\`\`

\`req\` is a **readable stream** and \`res\` is a **writable stream**. That is not trivia — it is why bodies arrive in chunks and why you can pipe a file straight to a response (Chapter 4).

### Reading a request body

There is no \`req.body\`. Nothing has parsed anything for you:

\`\`\`js
async function readJson(req, limitBytes = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {          // req is an async iterable of Buffers
    size += chunk.length;
    if (size > limitBytes) {
      req.destroy();                        // stop reading; do not buffer forever
      throw Object.assign(new Error('Payload too large'), { status: 413 });
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
\`\`\`

Two things matter here. Chunks are **Buffers, not strings** — concatenating with \`+\` corrupts any multi-byte character that straddles a chunk boundary. And without the size check, one client can hand you a body big enough to exhaust the process memory. \`express.json({ limit: '100kb' })\` exists precisely because this is easy to forget.

### Routing by hand

\`\`\`js
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true, uptime: process.uptime() });
  }

  if (req.method === 'POST' && url.pathname === '/api/notes') {
    try {
      const body = await readJson(req);
      if (!body.title) return send(res, 400, { message: 'title is required' });
      return send(res, 201, { id: crypto.randomUUID(), ...body });
    } catch (err) {
      return send(res, err.status ?? 400, { message: 'Invalid request body' });
    }
  }

  send(res, 404, { message: 'Not found' });
});

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),   // BYTES, not characters
  });
  res.end(body);
}
\`\`\`

\`Buffer.byteLength\` rather than \`body.length\`: a string of ten emoji is forty bytes while \`.length\` reports twenty, and a wrong \`Content-Length\` truncates the response.

Chain that \`if\` ladder ten more times and you have reinvented Express badly — no route params, no shared middleware, no error pipeline. That is the argument for a framework, and now you know exactly what it is doing.

### The two failure modes to internalise

**Never calling \`res.end()\`** leaves the connection open until the client times out. Every early \`return\` in a handler must have sent a response, which is why the code above returns the result of \`send\`.

**Responding twice** throws \`ERR_HTTP_HEADERS_SENT\`, because the second reply writes a status line and headers that are already on the wire. (A bare second \`res.end()\` is quieter: it emits \`ERR_STREAM_WRITE_AFTER_END\` on the response instead.) It happens when a callback fires after you already responded — an error handler that logs *and* replies to a request that already succeeded.

### Headers are lowercase and can repeat

\`req.headers\` keys are always lower-cased, so read \`req.headers['content-type']\`. Set headers before the first byte of body; after that they are on the wire and \`res.setHeader\` throws.
        `),
      ],
      [
        q('A request handler calls JSON.parse on a 40 MB payload, taking 400 ms of CPU. What is the effect on other in-flight requests?', [
          'They continue normally on other threads',
          'Only requests to the same route are delayed',
          'All of them stall, because the event loop is blocked for 400 ms',
          'Node moves the parse to the libuv thread pool automatically',
        ], 2, 'Your JavaScript runs on one thread, so CPU-bound work pauses every other callback in the process until it finishes.'),
        q('server.js imports config.js on line 1 and dotenv on line 2, and DATABASE_URL comes out undefined. Why?', [
          'ES module imports are hoisted, so config.js read process.env before dotenv ran',
          'dotenv cannot be used with ES modules',
          'process.env is read-only in ESM',
          'config.js needs a .mjs extension',
        ], 0, 'All import statements are evaluated before any other code in the file, so config.js ran first and captured an empty env.'),
        q('Why concatenate request chunks with Buffer.concat instead of a string +=?', [
          'Buffers compress better',
          'String concatenation is slower for small chunks',
          'Node forbids string concatenation on streams',
          'A multi-byte character split across two chunks is corrupted when each chunk is decoded separately',
        ], 3, 'Decoding each chunk independently cuts UTF-8 sequences in half; concatenating the bytes first and decoding once preserves them.'),
        q('Inside an I/O callback you schedule both setTimeout(fn, 0) and setImmediate(fn). Which runs first?', [
          'setTimeout, because 0 ms has already elapsed',
          'setImmediate, because the check phase follows the poll phase',
          'Whichever was registered first',
          'They run in parallel',
        ], 1, 'From inside an I/O callback the loop is in the poll phase, and check (setImmediate) comes immediately after it.'),
      ]
    ),
    chapter(
      'Express in Depth',
      'The middleware pipeline, routers, and an error path that never leaks internals or hangs a request.',
      [
        lesson('Routing and the Middleware Pipeline', 13, `
Express is a **list of functions applied in registration order**. Almost every Express bug is really a question about that order.

### Every handler has the same shape

\`\`\`js
import express from 'express';
const app = express();

app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${Date.now() - started}ms\`);
  });
  next();                        // omit this and the request hangs forever
});

app.use(express.json({ limit: '100kb' }));   // parses only Content-Type: application/json
app.get('/api/notes', listNotes);
app.listen(3000);
\`\`\`

A middleware may do exactly one of three things: **respond**, **call \`next()\`** to pass control on, or **call \`next(err)\`** to jump to the error pipeline. Doing two of them is the bug that produces \`ERR_HTTP_HEADERS_SENT\`:

\`\`\`js
app.post('/api/notes', (req, res, next) => {
  if (!req.body.title) res.status(400).json({ message: 'title required' });
  next();                        // BUG: no return, so the handler runs anyway
});
\`\`\`

Write \`return res.status(400).json(...)\` every time. The \`return\` is not stylistic.

### Order is the whole model

\`\`\`js
app.get('/api/notes', listNotes);
app.use(express.json());          // BUG: registered after the route
\`\`\`

\`req.body\` is \`undefined\` inside \`listNotes\`, because the parser never ran for that request. The same trap catches \`cookieParser\`, \`cors\`, session middleware, and authentication guards. Rule of thumb for a real app:

1. \`helmet()\` and \`cors()\`
2. body parsers
3. request id / logger
4. session or auth token decoding
5. routes
6. 404 handler
7. error handler (four arguments, always last)

### Route matching is first-match-wins

\`\`\`js
app.get('/users/:id', getUser);
app.get('/users/me', getCurrentUser);   // unreachable
\`\`\`

\`/users/me\` matches \`/users/:id\` first, with \`id === 'me'\`, and your database lookup fails with a cast error. **Static segments must be registered before dynamic ones.** This is the single most common routing mistake in real Express codebases, and it is invisible until someone adds the \`:id\` route above the specific one.

### Where the data lives

| Source | Access | Type |
|---|---|---|
| \`/notes/:id\` | \`req.params.id\` | always a string |
| \`?page=2&tag=js\` | \`req.query.page\` | string, or array if repeated |
| JSON body | \`req.body\` | whatever the parser produced |
| Headers | \`req.headers['x-request-id']\` | lower-cased keys |

\`req.query.page\` is \`'2'\`, not \`2\`. \`Number(req.query.limit) || 20\` is the honest conversion; without it \`req.query.limit + 1\` concatenates into \`'201'\` and \`req.query.page === 1\` is never true. Repeated parameters (\`?tag=a&tag=b\`) give you an **array**, so code that calls \`.trim()\` on \`req.query.tag\` crashes only when a user repeats the parameter — a genuine production 500 waiting to happen.

### Mounting rewrites the path

\`\`\`js
app.use('/api', (req, res, next) => {
  req.originalUrl;   // '/api/notes/42?tag=js' — never rewritten
  req.baseUrl;       // '/api'
  req.url;           // '/notes/42?tag=js' — the mount prefix is stripped
  next();
});
\`\`\`

Anything mounted on a path sees \`req.url\` with that prefix removed, which is exactly what lets a router be mounted anywhere without editing it. Log \`req.originalUrl\`: a logger mounted under \`/api\` that prints \`req.url\` drops the prefix, so \`/api/notes\` and \`/admin/notes\` become the same line and you cannot tell them apart during an incident.

### Scoping middleware

Middleware applies to everything registered after it, optionally narrowed by path or attached per route:

\`\`\`js
app.use('/api/admin', requireAuth, requireRole('admin'));   // path-scoped
app.post('/api/notes', requireAuth, validate(noteSchema), createNote);  // per route
\`\`\`

Handlers listed on one route run left to right, each calling \`next()\`. That is how a guard, a validator, and a controller compose without any of them knowing about the others.
        `),
        lesson('Routers and Project Structure', 12, `
A 900-line \`server.js\` is not a style problem, it is a merge-conflict machine. Express \`Router\` splits it along the same seams your API already has.

### A router is a mini-app

\`\`\`js
// routes/notes.routes.js
import { Router } from 'express';
import * as controller from '../controllers/notes.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);                 // applies to every route in this file

router.get('/', controller.list);        // GET  /api/notes
router.post('/', controller.create);     // POST /api/notes
router.get('/:id', controller.getOne);   // GET  /api/notes/:id

export default router;

// server.js
app.use('/api/notes', notesRouter);
\`\`\`

Paths inside a router are **relative to the mount point**, so \`router.get('/')\` serves \`/api/notes\`. Writing \`router.get('/api/notes')\` inside a mounted router gives you \`/api/notes/api/notes\` — a 404 that reads like a typo you cannot find.

### Nested routers need mergeParams

\`\`\`js
const comments = Router({ mergeParams: true });
comments.get('/', (req, res) => {
  res.json({ noteId: req.params.noteId });   // undefined without mergeParams
});

notesRouter.use('/:noteId/comments', comments);
\`\`\`

By default each router gets its own \`params\` object and the parent's \`:noteId\` is invisible. \`mergeParams: true\` is the fix, and forgetting it produces \`undefined\` ids that silently query the wrong rows.

### Four layers, one direction

| Layer | Knows about | Never touches |
|---|---|---|
| route | HTTP paths and middleware order | SQL, business rules |
| controller | \`req\` / \`res\`, status codes | SQL |
| service | business rules, transactions | \`req\` / \`res\` |
| repository | queries and the schema | HTTP anything |

\`\`\`js
// controllers/notes.controller.js — thin: parse in, service, respond
export async function create(req, res) {
  const note = await notesService.create(req.user.id, req.body);
  res.status(201).location(\`/api/notes/\${note.id}\`).json({ data: note });
}

// services/notes.service.js — no req, no res, unit-testable
export async function create(userId, input) {
  if (await notesRepo.countForUser(userId) >= 100) {
    throw new AppError(409, 'Note limit reached');
  }
  return notesRepo.insert({ ...input, userId });
}
\`\`\`

The value of the boundary shows up the first time you need the same rule from a CLI script, a cron job, or a queue worker: the service is callable, the controller is not. The failure mode is the opposite — a service that takes \`req\` — and it spreads until every unit test has to fake an HTTP request.

### A layout that survives growth

\`\`\`text
src/
  app.js            # express() wiring only — no listen
  server.js         # listen + graceful shutdown
  config.js         # validated environment (Chapter 5)
  routes/           # notes.routes.js, users.routes.js
  controllers/      # HTTP in, HTTP out
  services/         # business rules, transactions
  repositories/     # SQL and nothing else
  middleware/       # auth.js, validate.js, errorHandler.js
\`\`\`

Group by layer while the app is small and the layers are obvious. Past roughly twenty routes, group by feature instead (\`features/notes/\` holding its own route, controller, service, and repository), because that is the boundary a change actually follows — one feature, four files, one directory.

### The 404 and the error handler go last

\`\`\`js
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);                    // four arguments, registered last
\`\`\`

Anything registered after a catch-all never runs. If \`/api/users\` returns 404 for every path, check whether a catch-all was registered above it.

### Keep the app importable

\`\`\`js
// app.js
export const app = express();
// ...wire everything

// server.js
import { app } from './app.js';
app.listen(process.env.PORT ?? 3000);
\`\`\`

Separating construction from \`listen()\` costs nothing now and is what makes the API testable in Chapter 5 without binding a port.
        `),
        lesson('Errors That Tell the Truth', 14, `
An error path has three jobs: never hang the request, never leak internals to the caller, and never lose the detail you need to debug it.

### One error class, one shape

\`\`\`js
export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.expose = status < 500;   // 4xx messages are safe to show the caller
    this.details = details;
  }
}

throw new AppError(404, 'Note not found');
throw new AppError(409, 'Email already registered');
\`\`\`

The \`expose\` flag is the whole trick: errors you raised deliberately carry a message meant for the caller, while anything else is assumed to be a bug and gets a generic reply.

### The handler has four arguments

\`\`\`js
export function errorHandler(err, req, res, next) {   // 4 args = error middleware
  const status = err.status ?? 500;

  req.log.error({ err, status, path: req.originalUrl }, 'request failed');

  if (res.headersSent) return next(err);   // response already started: let Node abort it

  res.status(status).json({
    message: err.expose ? err.message : 'Internal server error',
    details: err.expose ? err.details : undefined,
    requestId: req.id,
  });
}
\`\`\`

Express identifies error middleware **by arity**. Write \`(err, req, res)\` with three parameters and Express registers it as ordinary middleware, so it receives a normal request instead of your error and nothing works. Never drop the unused \`next\`.

Returning \`requestId\` is the small detail that makes support possible: the user quotes an id, you grep one line out of the logs.

### Never send a stack trace

\`\`\`js
res.status(500).json({ error: err.stack });   // leaks paths, versions, sometimes secrets
\`\`\`

A stack trace names your directory layout, your dependency versions, and occasionally a connection string inside an error message. Log it; send \`{ message: 'Internal server error' }\`.

### Async handlers are not caught for you

In Express 4, a rejected promise inside a handler is **not** routed to the error handler. Nothing responds to the request, and on Node 15 and later the unhandled rejection takes the whole process down:

\`\`\`js
app.get('/api/notes/:id', async (req, res) => {
  const note = await repo.find(req.params.id);   // rejects -> unhandled, request hangs
  res.json(note);
});
\`\`\`

Wrap once, use everywhere:

\`\`\`js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/notes/:id', asyncHandler(async (req, res) => {
  const note = await repo.find(req.params.id);
  if (!note) throw new AppError(404, 'Note not found');
  res.json({ data: note });
}));
\`\`\`

Express 5 forwards rejections automatically, but most codebases you join are still on 4 — and a mixed codebase where *some* handlers are wrapped is worse than one where none are. Wrap every async route.

### Operational versus programmer errors

An **operational** error is expected: bad input, a row that does not exist, a database that is briefly down. Handle it, return a status, carry on. A **programmer** error is a bug — \`undefined\` is not a function — and the process state after one is unknown.

\`\`\`js
process.on('unhandledRejection', (err) => { throw err; });
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaught exception, shutting down');
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 5000).unref();   // do not hang forever
});
\`\`\`

Log and exit; let your supervisor (systemd, PM2, Kubernetes) restart a clean process. Swallowing an uncaught exception to "keep the server up" leaves you serving traffic from a process whose invariants are already broken — which is how a half-written transaction becomes a corrupt row.
        `),
      ],
      [
        q('app.get("/users/:id") is registered before app.get("/users/me"), and /users/me 500s. What is happening?', [
          'Express caches the first matching route per path',
          'Both routes match and Express merges them',
          '/users/me matches the :id route first, so id is the string "me"',
          'app.get cannot be called twice for the same prefix',
        ], 2, 'Routes are matched in registration order, so the dynamic segment swallows the literal one; register static paths first.'),
        q('An error middleware written as (err, req, res) never runs. Why?', [
          'It must be registered before the routes',
          'Error handlers must be async',
          'Express only allows one error handler per app',
          'Express detects error middleware by its four-parameter arity',
        ], 3, 'With three parameters Express treats the function as ordinary middleware, so errors pass it by.'),
        q('An async route handler awaits a repository call that rejects, and the request never receives a response. On Express 4, the fix is to', [
          'Wrap the handler so the rejection is passed to next()',
          'Add a try/finally that calls res.end()',
          'Register the error handler before the route',
          'Set NODE_ENV=production',
        ], 0, 'Express 4 does not catch promise rejections; forwarding them with .catch(next) routes them into the error handler.'),
        q('Why does a service function that accepts req and res become a problem?', [
          'It is slower because req is a large object',
          'It cannot be reused by a cron job, a queue worker, or a unit test without faking HTTP',
          'Express forbids passing req outside a handler',
          'It prevents the error handler from running',
        ], 1, 'Business rules coupled to HTTP objects can only be invoked through an HTTP request, which blocks reuse and makes tests fragile.'),
      ]
    ),
    chapter(
      'APIs, Validation, and Authentication',
      'Designing endpoints callers can predict, rejecting bad input at the edge, and proving who someone is.',
      [
        lesson('Designing a REST API People Can Use', 13, `
A REST API is a vocabulary. Callers should be able to guess the next endpoint from the last one, and that predictability comes from a handful of decisions made consistently.

### URLs name things, methods do things

| Request | Meaning | Success status |
|---|---|---|
| \`GET /api/notes\` | list, filtered and paginated | 200 |
| \`GET /api/notes/42\` | one note | 200 or 404 |
| \`POST /api/notes\` | create | 201 + \`Location\` header |
| \`PATCH /api/notes/42\` | partial update | 200 |
| \`PUT /api/notes/42\` | full replacement | 200 |
| \`DELETE /api/notes/42\` | remove | 204, no body |

\`POST /api/getNotes\` or \`POST /api/notes/42/delete\` throw away everything HTTP gives you: caching, retries, proxy behaviour, and a reader's ability to guess. The method is the verb; keep verbs out of the path.

**Idempotency** is the property that makes retries safe. \`GET\`, \`PUT\`, and \`DELETE\` must produce the same end state when repeated; \`POST\` need not. It matters the moment a mobile client on a flaky connection retries a request whose response it never saw.

### Status codes that mean what they say

\`\`\`js
res.status(200).json({ data });                 // fetched or updated
res.status(201).location(\`/api/notes/\${id}\`).json({ data });
res.status(204).end();                          // deleted, nothing to say
res.status(400).json({ message: 'Validation failed', details });
res.status(401)  // who are you? (no or bad credentials)
res.status(403)  // I know who you are, and no
res.status(404)  // no such resource
res.status(409)  // conflict: email already registered, version mismatch
res.status(422)  // syntactically fine, semantically impossible
res.status(429)  // rate limited — include Retry-After
\`\`\`

The 401/403 split is worth memorising: 401 means *authenticate*, 403 means *authenticated and still refused*. And returning \`200 { success: false }\` for a failure is the anti-pattern that forces every client to parse the body before it knows whether anything worked — it also defeats retry logic, alerting, and every HTTP-aware tool in the stack.

### One envelope, one error shape

\`\`\`js
// success
{ "data": { "id": 42, "title": "Event loop" } }
{ "data": [ ... ], "meta": { "page": 2, "perPage": 20, "total": 137 } }

// failure
{ "message": "Validation failed",
  "details": [{ "field": "email", "issue": "must be a valid email" }],
  "requestId": "01J7X..." }
\`\`\`

Pick a shape on day one and never deviate. Clients write one unwrapping function and one error handler instead of a special case per endpoint.

### Pagination is not optional

\`GET /api/notes\` with no limit is a denial-of-service endpoint you built yourself: it works for three months and then a customer with 200,000 rows takes the server down.

\`\`\`js
const perPage = Math.min(Number(req.query.perPage) || 20, 100);   // cap it
const page = Math.max(Number(req.query.page) || 1, 1);
const rows = await repo.list({ limit: perPage, offset: (page - 1) * perPage });
\`\`\`

Offset pagination is simple and fine up to a point; deep offsets get slow, and rows shift under the reader as new records arrive. **Cursor pagination** — \`?after=<id or timestamp>\` — is stable and stays fast at any depth, and is worth the extra work for feeds and exports.

### Filtering, sorting, and versioning

Accept filters as query parameters (\`?tag=js&status=published\`) and validate every one against an allow-list. Never interpolate a sort field straight into SQL — that is Chapter 4's injection hole.

Version when you must break a contract, in the path (\`/api/v1/...\`) for how obvious it is. Adding a field is not breaking; removing one, renaming one, or changing a type is. Clients you do not control will depend on details you consider incidental.
        `),
        lesson('Validating Every Request', 12, `
**Every value from a client is hostile until proven otherwise** — body, query, params, headers, cookies, filenames. Browser-side validation is a courtesy for honest users; anyone can send whatever they like with \`curl\`.

### Declare the shape, parse at the edge

\`\`\`js
import { z } from 'zod';

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    content: z.string().max(50_000).default(''),
    tags: z.array(z.string().max(30)).max(10).default([]),
    publishedAt: z.coerce.date().optional(),
  }).strict(),                                  // reject unknown keys outright
  query: z.object({}).optional(),
});
\`\`\`

\`.strict()\` (or \`stripUnknown\` in Joi) is a security control, not tidiness. Without it:

\`\`\`js
// Client sends { "title": "hi", "role": "admin", "userId": 1 }
await repo.insert({ ...req.body, userId: req.user.id });
\`\`\`

That is **mass assignment**. The spread carries \`role: 'admin'\` into the row, and whether it escalates privilege depends entirely on your schema — which is not a defence you want to rely on. Either strip unknown keys or pick fields explicitly; never spread a raw body into a write.

### One middleware, every route

\`\`\`js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body, query: req.query, params: req.params,
  });

  if (!result.success) {
    return next(new AppError(400, 'Validation failed',
      result.error.issues.map(i => ({ field: i.path.join('.'), issue: i.message }))));
  }

  req.valid = result.data;      // use req.valid downstream, never raw req.body
  next();
};

router.post('/', validate(createNoteSchema), asyncHandler(controller.create));
\`\`\`

Assigning the parsed result to \`req.valid\` matters. If handlers keep reading \`req.body\`, the validation is decorative — someone will add a field, forget the schema, and it will flow straight through.

### Query strings are always strings

\`\`\`js
z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  includeDrafts: z.enum(['true', 'false']).default('false')
    .transform(v => v === 'true'),
});
\`\`\`

\`?includeDrafts=false\` arrives as the **string** \`'false'\`, which is truthy. Code that writes \`if (req.query.includeDrafts)\` publishes everyone's drafts, and it passes review because the line looks obviously correct. Coerce deliberately, every time.

Repeated parameters produce arrays (\`?tag=a&tag=b\`), so a schema expecting a string must either accept both or normalise.

### Validate more than the body

- **Params**: \`z.coerce.number().int().positive()\` on \`:id\` turns a garbage id into a clean 400 instead of a database cast error surfacing as a 500.
- **Size**: \`express.json({ limit: '100kb' })\` — and a separate, larger limit only on the routes that need it.
- **Content-Type**: reject a \`POST\` that is not JSON rather than silently receiving an empty \`req.body\`.
- **Allow-lists over deny-lists**: enumerate what is permitted. Blocking \`<script>\` is a game you lose; accepting \`z.enum(['draft','published'])\` is one you win.

### Nested objects and arrays need bounds too

\`\`\`js
z.object({
  items: z.array(z.object({
    sku: z.string().regex(/^[A-Z0-9-]{3,20}$/),
    qty: z.coerce.number().int().min(1).max(99),
  })).min(1).max(50),                       // bound the ARRAY, not just the item
});
\`\`\`

An unbounded array is an open invitation: 100,000 items pass every per-item rule and then your handler runs 100,000 inserts. Cap the length, cap the string sizes inside it, and keep the JSON body limit small enough that a deeply nested payload cannot exhaust the parser.

### Validation is not sanitisation

A valid string can still be dangerous downstream. Escaping happens at the boundary where it matters: parameterised queries for SQL (Chapter 4), contextual escaping for HTML, \`path.basename\` for filenames. Validation decides whether to accept the request; sanitisation decides how to use it safely.
        `),
        lesson('Authentication: Sessions and JWTs', 15, `
Authentication answers *who are you*. Authorisation answers *what may you do*. Conflating them is how the most expensive backend bugs happen.

### Store hashes, never passwords

\`\`\`js
import argon2 from 'argon2';

const hash = await argon2.hash(password);            // signup
const ok = await argon2.verify(user.passwordHash, password);  // login
\`\`\`

\`bcrypt\` with a cost of 12 is also fine. What matters is that the algorithm is **deliberately slow and salted per user**. SHA-256 is the wrong tool precisely because it is fast: a stolen table of SHA-256 password hashes falls to a commodity GPU in hours.

Two rules around the login endpoint itself: return the **same message** for an unknown email and a wrong password ("Invalid email or password"), or an attacker enumerates your user base; and rate-limit it per IP *and* per account, or a stolen credential list gets tried at leisure.

### Sessions: state on the server

\`\`\`js
res.cookie('sid', sessionId, {
  httpOnly: true,      // JavaScript cannot read it — blunts XSS token theft
  secure: true,        // HTTPS only
  sameSite: 'lax',     // blunts CSRF
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: '/',
});
\`\`\`

The cookie holds an opaque random id; the real data lives in Redis or a table. Logging out, banning a user, or forcing a password change is a single delete, and it takes effect on the next request.

### JWTs: state in the token

\`\`\`js
import jwt from 'jsonwebtoken';

const token = jwt.sign({ sub: user.id, role: user.role },
  process.env.JWT_SECRET, { expiresIn: '15m' });

const payload = jwt.verify(token, process.env.JWT_SECRET);  // throws if tampered/expired
\`\`\`

A JWT is **signed, not encrypted**. Anyone holding it can decode the payload — paste one into a decoder and read it. Never put anything secret in there, and never trust a client-supplied \`role\` claim you did not sign yourself.

| | Session | JWT |
|---|---|---|
| Revocation | immediate | not until expiry |
| Storage | server lookup per request | none |
| Scaling | needs a shared store | any instance verifies |
| Payload staleness | always fresh | as old as the token |

The honest default for a single web application is **sessions**. JWTs earn their place across services or for stateless mobile clients, and the standard pattern is a short-lived access token (15 minutes) plus a long-lived **refresh token** stored server-side so it *can* be revoked. "Long-lived JWT in localStorage" gives you the worst of both: no revocation and readable by any injected script.

### The guard

\`\`\`js
export const requireAuth = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError(401, 'Authentication required');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }

  req.user = { id: payload.sub, role: payload.role };
  next();   // outside the try, or a downstream error is reported as a 401
});
\`\`\`

### The bug that leaks other people's data

\`\`\`js
router.get('/:id', requireAuth, async (req, res) => {
  res.json({ data: await repo.find(req.params.id) });   // any id, any owner
});

router.get('/:id', requireAuth, async (req, res) => {
  const note = await repo.findForUser(req.params.id, req.user.id);   // scoped
  if (!note) throw new AppError(404, 'Note not found');
  res.json({ data: note });
});
\`\`\`

The first version authenticates and never authorises: change \`42\` to \`43\` in the URL and you read someone else's record. This is **IDOR**, it is one of the most commonly exploited API flaws in the wild, and it never shows up in testing because your own ids always belong to you. Scope every query by the authenticated user, and return 404 rather than 403 when you would rather not confirm the row exists.
        `),
      ],
      [
        q('An endpoint returns HTTP 200 with { success: false, error: "not found" }. What is the practical cost?', [
          'Every client, proxy, and monitoring tool must parse the body to learn the request failed',
          'The response is larger than a 404',
          'Browsers refuse to cache it',
          'Express cannot log it correctly',
        ], 0, 'The status code is the machine-readable outcome; hiding failure in a 200 body defeats caching, retries, and alerting.'),
        q('A schema does not reject unknown keys, and the handler does repo.insert({ ...req.body, userId }). What is the risk?', [
          'The request body may exceed the size limit',
          'Unknown keys are stored as strings',
          'Mass assignment — a client-supplied field such as role can be written to the row',
          'The spread operator drops the userId',
        ], 2, 'Spreading an unvalidated body lets a caller set any column your write accepts, which is how privilege escalation happens.'),
        q('?includeDrafts=false is read as if (req.query.includeDrafts) and drafts leak. Why?', [
          'Express lower-cases query values',
          'The value is the string "false", which is truthy',
          'Boolean query parameters are unsupported',
          'The parameter was never parsed',
        ], 1, 'Query values are always strings, and any non-empty string is truthy — coerce explicitly instead of testing raw.'),
        q('You need to revoke a compromised login immediately across all instances. Which design supports that?', [
          'A 30-day JWT with a long random secret',
          'A JWT signed with RS256 instead of HS256',
          'Storing the JWT in an httpOnly cookie',
          'Server-side sessions, or short access tokens plus a revocable refresh token',
        ], 3, 'Only server-held state can be deleted; a self-contained token stays valid until it expires no matter what you do.'),
      ]
    ),
    chapter(
      'Data, Streams, and Files',
      'Querying safely, moving bytes without buffering them all, and accepting uploads from strangers.',
      [
        lesson('Talking to a Database Safely', 14, `
The data layer is where a small mistake becomes a breach. Three habits prevent almost all of it: parameterise, pool, and wrap in transactions.

### Parameterise. Always. No exceptions.

\`\`\`js
// Catastrophic
const { rows } = await pool.query(
  \`SELECT * FROM users WHERE email = '\${req.body.email}'\`
);

// Correct — the value never becomes part of the statement
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1', [req.body.email]
);
\`\`\`

With the first version, an email of \`' OR '1'='1' --\` returns every user, and \`'; DROP TABLE users; --\` does what it looks like. Parameters are sent to the database **separately from the SQL text**, so a value can never be re-read as code. Template literals make injection look neat, which is exactly why it survives review.

### Identifiers cannot be parameterised

This is the part people miss. Placeholders work for *values*, not for table names, column names, or sort direction:

\`\`\`js
// Injectable: ?sort=id; DROP TABLE notes--
await pool.query(\`SELECT * FROM notes ORDER BY \${req.query.sort}\`);

// Safe: an allow-list, mapped by hand
const SORTS = { newest: 'created_at DESC', title: 'title ASC' };
const orderBy = SORTS[req.query.sort] ?? SORTS.newest;
await pool.query(\`SELECT * FROM notes ORDER BY \${orderBy} LIMIT $1\`, [limit]);
\`\`\`

Dynamic \`ORDER BY\` and dynamic filter columns are the two places injection still lives in codebases that "use parameters everywhere". An allow-list object is the entire fix.

### Pool connections, and always release them

\`\`\`js
import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                      // per process — multiply by your instance count
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
\`\`\`

Opening a connection per request is slow and will exhaust the server's connection limit under load. One pool per process, created once at import time, is the pattern.

### Transactions need try / catch / finally

\`\`\`js
export async function transferOwnership(noteId, fromUserId, toUserId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rowCount } = await client.query(
      'UPDATE notes SET user_id = $1 WHERE id = $2 AND user_id = $3',
      [toUserId, noteId, fromUserId]
    );
    if (rowCount === 0) throw new AppError(404, 'Note not found');
    await client.query('INSERT INTO audit_log (note_id, action) VALUES ($1, $2)',
      [noteId, 'transfer']);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();            // omit this and the pool drains, then everything hangs
  }
}
\`\`\`

A missing \`release()\` is the classic production hang: the app runs perfectly for hours, then every request blocks forever waiting for a connection that will never come back. The \`finally\` block is not optional.

### Let the database enforce what it can

\`\`\`sql
email TEXT NOT NULL UNIQUE,
UNIQUE (user_id, note_id),
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
\`\`\`

"Check whether the email exists, then insert" loses a race between the check and the insert; a \`UNIQUE\` constraint does not. Catch the resulting error code (\`23505\` in Postgres) and turn it into a clean 409.

### Two performance rules

**Index what you filter and join on.** Without an index, finding one row means reading every row, and that only hurts once the table is big — which is always in production first.

**Watch for N+1.** Loading 50 notes and then querying the author of each is 51 round trips:

\`\`\`js
// One query instead of N
await pool.query('SELECT * FROM users WHERE id = ANY($1)', [authorIds]);
\`\`\`

ORMs make N+1 invisible; log your queries in development and count them.
        `),
        lesson('Streams and Buffers', 13, `
A stream lets you process data that is **larger than memory, or not finished arriving**. Getting comfortable with them is what separates an API that exports 2 GB of CSV from one that crashes at 500 MB.

### Buffers are raw bytes

\`\`\`js
const buf = Buffer.from('héllo', 'utf8');
buf.length;                    // 6 — BYTES
'héllo'.length;                // 5 — characters
Buffer.byteLength('héllo');    // 6

buf.toString('utf8');
buf.toString('base64');        // encode for transport
\`\`\`

Anything Node reads from a socket, file, or crypto function is a Buffer until you decode it. Decoding a *slice* of a multi-byte sequence gives you replacement characters, which is why per-chunk \`toString()\` is a bug and \`Buffer.concat(chunks).toString()\` is not.

### Read, transform, write

\`\`\`js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

// Constant memory regardless of file size
await pipeline(
  createReadStream('export.csv'),
  createGzip(),
  createWriteStream('export.csv.gz')
);
\`\`\`

Compare with the naive version — \`readFile\`, gzip in memory, \`writeFile\` — which holds the whole file twice and takes the process down on a large input.

### pipeline, not pipe

\`\`\`js
source.pipe(gzip).pipe(dest);          // errors do NOT propagate; streams leak
await pipeline(source, gzip, dest);     // errors propagate, everything destroyed
\`\`\`

If \`dest\` errors mid-transfer with \`.pipe()\`, \`source\` keeps reading into a dead pipe: the file handle stays open, memory grows, and the request never finishes. \`pipeline\` destroys every stream in the chain and rejects. Use it every time — this is the most common streams bug in real Node code.

### Backpressure is the point

A fast reader and a slow writer would fill memory forever. \`write()\` returns \`false\` when the destination's buffer is full; a correct producer pauses until \`'drain'\`. \`pipe\` and \`pipeline\` handle that for you, which is the real reason to prefer them over a manual \`on('data')\` loop:

\`\`\`js
// Ignores backpressure entirely — RAM climbs until the process dies
source.on('data', (chunk) => dest.write(chunk));
\`\`\`

### Streaming a response

\`res\` is a writable stream, so a big export never has to exist in memory:

\`\`\`js
app.get('/api/notes/export', asyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="notes.csv"');

  const rows = repo.streamForUser(req.user.id);   // a Readable of row objects
  await pipeline(rows, toCsvTransform(), res);
}));
\`\`\`

Two details. The client starts downloading after the first chunk, so **time to first byte collapses**. And because headers went out early, an error halfway through cannot become a 500 — you can only destroy the connection. Validate before you start writing.

### Async iteration when you want the loop

\`\`\`js
import { createInterface } from 'node:readline';

const rl = createInterface({ input: createReadStream('access.log'), crlfDelay: Infinity });
let errors = 0;
for await (const line of rl) {          // one line at a time, constant memory
  if (line.includes(' 500 ')) errors++;
}
\`\`\`

\`for await\` respects backpressure automatically: the stream stays paused while the body of your loop awaits, so a slow database write inside the loop throttles the reader instead of filling memory. That is the readable alternative to a manual \`on('data')\` handler, and it is why \`Readable.from(asyncGenerator)\` is often the simplest way to produce a stream from your own code.

### Writing a Transform

\`\`\`js
import { Transform } from 'node:stream';

const toCsvTransform = () => new Transform({
  objectMode: true,                      // input is objects, output is strings
  transform(row, _enc, cb) {
    cb(null, \`\${row.id},"\${String(row.title).replaceAll('"', '""')}"\\n\`);
  },
});
\`\`\`

\`objectMode\` matters: without it a stream only accepts Buffers and strings. Call \`cb(err)\` on failure rather than throwing — a thrown error inside \`transform\` escapes the stream's error handling and becomes an uncaught exception.
        `),
        lesson('File Uploads Without Getting Owned', 13, `
An upload endpoint accepts an attacker-chosen filename, an attacker-chosen content type, and attacker-chosen bytes. Treat all three as hostile.

### Multipart needs its own parser

\`express.json()\` cannot read \`multipart/form-data\`. Use \`multer\`, and set limits before anything else:

\`\`\`js
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const upload = multer({
  storage: multer.diskStorage({
    destination: '/var/app/uploads',                 // outside the web root
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
      cb(null, \`\${crypto.randomUUID()}\${ALLOWED_EXT.has(ext) ? ext : ''}\`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10 },
});

router.post('/avatar', requireAuth, upload.single('avatar'), controller.setAvatar);
\`\`\`

\`memoryStorage\` is tempting and wrong for anything user-facing: ten concurrent 50 MB uploads is 500 MB of heap.

### Never use the client's filename

\`\`\`js
// Path traversal: originalname can be "../../../etc/cron.d/pwn"
fs.writeFileSync(path.join(UPLOAD_DIR, file.originalname), file.buffer);
\`\`\`

Generate your own name — a UUID — and store the original only as a display label in the database. If you insist on deriving from it, \`path.basename()\` first, strip anything outside \`[a-z0-9._-]\`, and cap the length. Null bytes, leading dots, Windows reserved names, and 4,000-character names are all real attacks.

### The mimetype is client-supplied

\`file.mimetype\` comes from the request. It is a hint, not evidence. Check the actual bytes:

\`\`\`js
import { fileTypeFromFile } from 'file-type';

const type = await fileTypeFromFile(file.path);
if (!type || !['image/png', 'image/jpeg', 'image/webp'].includes(type.mime)) {
  await fs.promises.unlink(file.path);            // clean up before rejecting
  throw new AppError(400, 'Only PNG, JPEG, or WebP images are accepted');
}
\`\`\`

Note the \`unlink\`. Multer has already written the file by the time your validation runs, so every rejection path must delete it — otherwise a rejected-upload loop fills the disk, and a full disk takes down the database and the logs with it.

### Serving what you stored

- Serve user content from a **separate origin or bucket**, never from the same domain as your app. An HTML file uploaded and served from your origin runs JavaScript with your cookies.
- Send \`Content-Disposition: attachment\` and \`X-Content-Type-Options: nosniff\` for anything you did not generate yourself.
- Never pass a user-supplied path to \`res.sendFile\`. Look the record up by id, and let the database tell you the real path.

\`\`\`js
const file = await repo.findFileForUser(req.params.id, req.user.id);
if (!file) throw new AppError(404, 'Not found');
res.sendFile(file.storedPath, { root: UPLOAD_DIR });
\`\`\`

### At scale, do not proxy the bytes

Uploading through your API means every byte occupies a Node process. The standard pattern is a **presigned URL**: your API authorises and returns a short-lived S3 URL, the browser uploads directly, and a callback records the result. Your server handles two small JSON requests instead of a 200 MB transfer, and a slow mobile uploader no longer ties up a worker.

### Handling multer's own errors

Multer rejects an oversized file with \`err.code === 'LIMIT_FILE_SIZE'\`. Map it to a 413 with a useful message in your error handler, or the user sees a generic 500 and tries again with the same file.
        `),
      ],
      [
        q('All values are parameterised, yet ?sort=title;DROP-- still injects. Where is the hole?', [
          'The database driver is out of date',
          'The parameter array was passed in the wrong order',
          'JSON bodies bypass parameterisation',
          'ORDER BY takes an identifier, which placeholders cannot bind, so it was interpolated',
        ], 3, 'Placeholders bind values only; column and direction must be mapped through an allow-list before interpolation.'),
        q('An API works for hours, then every request hangs with no errors. Transactions use BEGIN/COMMIT with a catch that rolls back. The likely cause is', [
          'A pooled client is never released, so the pool is exhausted',
          'The database ran out of disk',
          'COMMIT was called twice',
          'The connection string expired',
        ], 0, 'Without release() in a finally block, each request leaks a connection until the pool has none left to hand out.'),
        q('source.pipe(gzip).pipe(res) leaks memory and file handles when the client disconnects. What fixes it?', [
          'Increasing the highWaterMark',
          'Calling source.pause() on disconnect',
          'stream.pipeline(source, gzip, res), which propagates errors and destroys every stream',
          'Reading the file with readFile first',
        ], 2, 'pipe does not forward errors or clean up the chain; pipeline destroys all streams and rejects on any failure.'),
        q('An upload endpoint validates file.mimetype against an image allow-list. Why is that insufficient?', [
          'mimetype is only set for files over 1 MB',
          'multer normalises every mimetype to application/octet-stream',
          'mimetype comes from the client and can claim anything; only the file bytes are evidence',
          'The value is URL-encoded and needs decoding first',
        ], 2, 'The multipart Content-Type header is attacker-controlled, so the real type must be read from the file signature.'),
      ]
    ),
    chapter(
      'Production Node',
      'Configuration, logs you can search, tests that catch regressions, and a deploy that does not drop requests.',
      [
        lesson('Configuration and Structured Logging', 12, `
Two things separate a hobby server from an operable one: it refuses to start when misconfigured, and its logs answer questions.

### Config comes from the environment, and is validated once

\`\`\`js
// config.js — imported exactly once, at the top of the entry file
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);                    // fail fast, at boot, loudly
}

export const config = parsed.data;
\`\`\`

**Fail at startup, not at 3 a.m.** Without this check, a missing \`JWT_SECRET\` means \`jwt.sign(payload, undefined)\` throws on the first login attempt — hours after deploy, on a Friday. A missing \`DATABASE_URL\` becomes the string \`"undefined"\` in a connection string and surfaces as a DNS error that names nothing useful.

Read \`process.env\` in exactly one module. Scattered \`process.env.X\` reads mean nobody can list what the service needs, and typos are silent.

Keep real values in \`.env\` (git-ignored), commit a \`.env.example\` with the **names** and dummy values, and treat any secret that reaches a repository as compromised — deleting the commit does not help, because the history is already cloned.

### Logs are data, not prose

\`console.log('user ' + id + ' logged in')\` cannot be filtered, aggregated, or alerted on. Structured JSON can:

\`\`\`js
import pino from 'pino';

export const logger = pino({
  level: config.LOG_LEVEL,
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],
  transport: config.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }        // human-readable locally, JSON in production
    : undefined,
});

logger.info({ userId, durationMs: 42 }, 'login succeeded');
// {"level":30,"time":...,"pid":8123,"hostname":"api-1","userId":17,"durationMs":42,"msg":"login succeeded"}
\`\`\`

Now \`level>=50 AND userId=17\` is a query rather than a grep-and-hope.

### One request, one id, every line

\`\`\`js
import { randomUUID } from 'node:crypto';

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] ?? randomUUID();
  req.log = logger.child({ requestId: req.id, method: req.method, path: req.path });
  res.setHeader('x-request-id', req.id);
  next();
});
\`\`\`

A child logger stamps every downstream line with the same id, so one filter reconstructs the whole request — including the error handler's entry from Chapter 2 and the id you returned to the user.

### What never goes in a log

Passwords, tokens, full card numbers, session ids, and personal data you have no reason to keep. Logs are copied to aggregators, backups, and laptops; a password in a log line is a password in a dozen places. The \`redact\` option above is a safety net, not a licence to log request bodies wholesale.

### Levels that mean something

| Level | Use for |
|---|---|
| \`error\` | a request failed and someone should look |
| \`warn\` | degraded but handled — retry succeeded, cache miss storm |
| \`info\` | lifecycle: started, shutting down, migration applied |
| \`debug\` | off in production, on when you are hunting |

Log at \`info\` on the way out. If every request writes six \`info\` lines, the signal disappears and the bill arrives.
        `),
        lesson('Testing APIs', 13, `
Backend tests are worth writing because the contract is small and stable: a request goes in, a status and a body come out, and the database changed or it did not.

### Export the app, listen somewhere else

\`\`\`js
// app.js
export const app = express();
// ...middleware and routes

// server.js — the only file that binds a port
import { app } from './app.js';
app.listen(config.PORT);
\`\`\`

If \`app.listen()\` runs at import time, every test file binds the port and the second one dies with \`EADDRINUSE\`, or the process never exits because a live server keeps the loop alive. Supertest starts an ephemeral server per test from the exported app, so the split is what makes the whole approach work.

### The shape of an API test

\`\`\`js
import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';

beforeEach(async () => { await resetDatabase(); });

test('POST /api/notes creates a note for the authed user', async () => {
  const token = await signInAsFixtureUser();

  const res = await request(app)
    .post('/api/notes')
    .set('Authorization', \`Bearer \${token}\`)
    .send({ title: 'Event loop' })
    .expect(201);

  assert.equal(res.body.data.title, 'Event loop');
  assert.match(res.headers.location, /^\\/api\\/notes\\/\\d+$/);

  const { rows } = await db.query('SELECT * FROM notes');   // the side effect
  assert.equal(rows.length, 1);
});

test('POST /api/notes rejects a missing title', async () => {
  const token = await signInAsFixtureUser();
  const res = await request(app).post('/api/notes')
    .set('Authorization', \`Bearer \${token}\`)
    .send({}).expect(400);
  assert.equal(res.body.details[0].field, 'body.title');
});
\`\`\`

Assert three things: the **status**, the **body shape**, and the **side effect**. A test that only checks a 201 passes happily against a handler that returns 201 and writes nothing.

### Test the boundaries, not the happy path only

For each endpoint: unauthenticated (401), authenticated-but-not-the-owner (404 or 403 — the IDOR case from Chapter 3), invalid payload (400), missing resource (404), duplicate (409). These are the cases that break during refactors, and each is three lines.

### Make tests independent

Run against a **real** database — a disposable one in Docker — not a mock. Mocking your data layer means your SQL, constraints, and cascades are never exercised, and those are exactly what breaks. Reset between tests by truncating the tables or wrapping each test in a transaction that is rolled back afterwards.

Shared state between tests produces the worst failure mode in this trade: a suite that passes in order, fails in isolation, and fails differently in CI.

### Do not mock what you are testing

Mock things you do not own and cannot control: a payment provider, an email service, the clock. \`nock\` intercepts outbound HTTP; injecting a \`now()\` function beats \`Date.now\` monkey-patching. Everything inside your own boundary should run for real.

### Never sleep

\`await new Promise(r => setTimeout(r, 500))\` is a flaky test with a timer attached. Await the promise, await the request, or poll a condition with a timeout. A suite with sleeps in it slows down forever and still fails under CI load.
        `),
        lesson('Performance, Clustering, and Deploying', 14, `
Performance work without measurement is superstition. Get numbers first: p95 latency per route, event loop lag (Chapter 1), and database time per request.

### Cache the expensive and the repeated

\`\`\`js
// HTTP-level: let the client and any proxy skip the work entirely
app.get('/api/courses', asyncHandler(async (req, res) => {
  const data = await repo.listCourses();
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.json({ data });
}));

// Application-level: shared across instances, with a TTL
const key = \`courses:v1:\${page}\`;
const hit = await redis.get(key);
if (hit) return res.json(JSON.parse(hit));

const data = await repo.listCourses(page);
await redis.set(key, JSON.stringify(data), 'EX', 60);
\`\`\`

Two rules that save pain. **Version your cache keys** (\`v1\`) so a shape change does not serve old data to new code. And prefer a short TTL to clever invalidation — the fastest way to a support ticket is a user updating something and being shown the previous value.

An in-process \`Map\` cache is fine for one instance and actively harmful across four: each has its own copy, invalidation reaches one of them, and users see different answers depending on which they hit.

### Clustering uses the other cores

One Node process uses one core. Run one process per core:

\`\`\`js
import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());     // replace a dead worker
} else {
  app.listen(config.PORT);                      // workers share the port
}
\`\`\`

In containers, prefer replicas managed by your platform over in-process clustering — one process per container is simpler to observe and restart. Either way, clustering multiplies throughput; it does **not** fix a blocked event loop, because each worker blocks exactly the same way. Four workers pinned by a 300 ms CPU loop is still a broken service.

Clustering also breaks anything held in process memory: in-memory sessions, rate-limit counters, and caches must move to Redis or they behave randomly as requests land on different workers.

### Shut down gracefully

The default \`SIGTERM\` behaviour kills the process instantly, so every in-flight request becomes a client error on every deploy:

\`\`\`js
const server = app.listen(config.PORT);

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, draining');
  server.close(async () => {                // stop accepting, finish in-flight
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();   // hard cap
});
\`\`\`

Pair it with a readiness endpoint that starts failing the moment \`SIGTERM\` arrives, so the load balancer stops sending new work before the drain begins.

### The deployment checklist

- \`NODE_ENV=production\`, and \`npm ci --omit=dev\` in the image.
- Secrets from the environment or a secret manager, never the image.
- \`helmet()\`, CORS restricted to real origins, rate limiting on auth and writes.
- \`app.set('trust proxy', 1)\` behind a load balancer, or every client IP is the proxy's and rate limiting groups all users together.
- Run as a non-root user; expose only the app port.
- \`/health\` (is the process alive) and \`/ready\` (can it reach the database) as separate endpoints.
- Backups on a schedule, with a restore you have actually performed.
- Alerts on error rate, p95 latency, and event loop lag — not on CPU alone.

### Where to go next

Message queues for work that must not happen inside a request, OpenTelemetry for tracing across services, and a load test you run before your users do.
        `),
      ],
      [
        q('Why validate environment variables at startup and exit on failure?', [
          'It prevents secrets from being logged',
          'It removes the need for a .env file',
          'A missing value otherwise surfaces later as a confusing runtime error, in production, under load',
          'Node caches process.env after the first read',
        ], 2, 'Failing fast at boot converts a silent undefined into an immediate, readable startup error before traffic arrives.'),
        q('A test suite passes when run together but fails when a single test is run alone. The most likely cause is', [
          'The assertion library is out of date',
          'Supertest needs an explicit port',
          'The database is too slow',
          'Tests share state — one depends on data another created',
        ], 3, 'Order-dependent tests rely on leftover state, so each test must create what it needs and reset afterwards.'),
        q('An API is deployed as four clustered workers and still saturates at the same throughput, with high event loop lag. Why?', [
          'The workers are competing for the same port',
          'Each worker blocks on the same CPU-bound work, so more processes do not unblock the loop',
          'Cluster mode disables the thread pool',
          'Redis is rate limiting the workers',
        ], 1, 'Clustering adds parallel loops but each still blocks on synchronous CPU work; the fix is to move that work off the loop.'),
        q('Every deploy produces a burst of client-side connection errors. What is missing?', [
          'A SIGTERM handler that stops accepting connections and drains in-flight requests',
          'A larger connection pool',
          'HTTP keep-alive on the load balancer',
          'A longer cache TTL',
        ], 0, 'Without a graceful shutdown the process is killed mid-request, so every in-flight request fails on each rollout.'),
      ]
    ),
    chapter(
      'Diagnosing a Running Server',
      'Finding the blocked loop, the leak, and the lost request on a process that is already serving traffic.',
      [
        lesson('Profiling a Slow Process', 14, `
The service is slow, the dashboard is red, and everyone has a theory. Profiling replaces the theories with a number and a stack frame.

### Start with one measurement, not a hunch

Chapter 1's lag probe is good enough for an alert. For diagnosis, use the histogram the runtime already keeps:

\`\`\`js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const loop = monitorEventLoopDelay({ resolution: 10 });
loop.enable();

setInterval(() => {
  logger.info({
    p50: Math.round(loop.percentile(50) / 1e6),
    p99: Math.round(loop.percentile(99) / 1e6),
    max: Math.round(loop.max / 1e6),
  }, 'event loop delay');
  loop.reset();                    // report per window, not since boot
}, 30_000).unref();
\`\`\`

With that line in the logs, the first question answers itself:

| Symptom | What it means | Look at |
|---|---|---|
| p95 up, loop p99 in the hundreds of ms | your JavaScript is blocking | a CPU profile |
| p95 up, loop p99 near 1 ms, CPU idle | you are waiting on someone else | query timing, upstream latency |
| p95 up, CPU pinned, loop fine | not enough CPU for the traffic | caching, more instances |
| memory climbing, latency fine | a leak | a heap snapshot (next lesson) |

Profiling a process whose loop is idle wastes an afternoon: the flame graph shows a process asleep in \`epoll_wait\`, which is precisely what a healthy waiting server looks like.

### Capture a CPU profile

\`\`\`bash
# Restart with profiling on, drive the slow endpoint, then shut the process down cleanly.
node --cpu-prof --cpu-prof-dir=./prof src/server.js
# writes ./prof/CPU.<yyyymmdd>.<hhmmss>.<pid>.<tid>.<seq>.cpuprofile
\`\`\`

\`--cpu-prof\` writes the file only when the process exits through Node's own exit path, so the drain handler from Chapter 5 has to run. A bare Ctrl-C on a server with no \`SIGINT\` handler, or a \`kill -9\`, ends the process with an empty \`./prof\` directory and no warning.

Drop that file into Chrome DevTools (Performance, then Load profile) or the VS Code flame chart. Sort by **self time** first. The widest frame is often just a caller; the frame with the largest self time is where the CPU actually is. In an Express API the usual culprits are \`JSON.stringify\` on a fat response, per-row regex work, synchronous template rendering, and password hashing on a login route that is being brute-forced.

When you cannot restart the container, profile in place:

\`\`\`js
import { Session } from 'node:inspector/promises';
import { writeFile } from 'node:fs/promises';

export async function profileFor(ms) {
  const session = new Session();
  session.connect();
  await session.post('Profiler.enable');
  await session.post('Profiler.start');
  await new Promise((r) => setTimeout(r, ms));
  const { profile } = await session.post('Profiler.stop');
  session.disconnect();
  await writeFile(\`/tmp/cpu-\${Date.now()}.cpuprofile\`, JSON.stringify(profile));
}
\`\`\`

Expose that behind an admin-only route, or trigger it from a signal handler. \`kill -SIGUSR1 <pid>\` also opens the inspector on an already-running process. **Never bind the inspector to a public interface** — \`--inspect=0.0.0.0\` is remote code execution with a pleasant UI. Bind \`127.0.0.1\` and tunnel over SSH.

### Move the work rather than micro-optimising it

If the profile blames a genuinely CPU-bound function, shaving 20% off it does not help; a 240 ms block is still an outage under load (Chapter 1). Move it off the loop:

\`\`\`js
import Piscina from 'piscina';

const pool = new Piscina({ filename: new URL('./render.worker.js', import.meta.url).href });

app.post('/api/reports', asyncHandler(async (req, res) => {
  const pdf = await pool.run(req.valid.body);   // runs on a worker thread
  res.type('application/pdf').send(pdf);
}));
\`\`\`

A pool, not a \`new Worker\` per request: spinning up a worker costs tens of milliseconds and its own V8 heap.

### Prove the fix with the same measurement

\`\`\`bash
npx autocannon -c 50 -d 20 http://localhost:3000/api/notes
\`\`\`

Compare p97.5 before and after, against production-shaped data. A profile taken over ten seeded rows tells you nothing about the query that scans four hundred thousand.
        `),
        lesson('Memory Leaks and Heap Snapshots', 13, `
Node does not leak memory on its own. Your code holds a reference it should have dropped, and the entire skill is working out which one.

### Learn the shape of healthy memory first

\`\`\`js
setInterval(() => {
  const m = process.memoryUsage();
  logger.info({
    rssMb: Math.round(m.rss / 1e6),
    heapUsedMb: Math.round(m.heapUsed / 1e6),
    externalMb: Math.round(m.external / 1e6),   // Buffers live here, outside the JS heap
  }, 'memory');
}, 60_000).unref();
\`\`\`

Healthy memory is a **sawtooth**: \`heapUsed\` climbs, a major collection drops it back to roughly the same floor. A leak is a **staircase** — the floor after each collection sits higher than the last. Judge the floor, never the peak. A 900 MB reading taken just before a GC is not a diagnosis.

\`external\` rising while \`heapUsed\` stays flat points at Buffers: a stream nobody destroyed, or chunks pushed into an array that is still reachable (Chapter 4).

### Three snapshots, then compare

\`\`\`js
import v8 from 'node:v8';

process.on('SIGUSR2', () => {
  const file = v8.writeHeapSnapshot();   // stops the world; needs disk about the size of the heap
  logger.warn({ file }, 'heap snapshot written');
});
\`\`\`

Take one after warmup, run the suspect traffic for a few minutes, take a second, run the same traffic again, take a third. Load all three into Chrome DevTools under Memory, select the third and switch the view to **Comparison** against the second. Everything allocated in that window and still alive is your leak, and the retainers pane names the object holding it.

Do this on one instance pulled out of the load balancer — the snapshot blocks the process for seconds on a large heap.

### The four leaks you will actually meet

**An unbounded module-level cache.** Module scope means process lifetime (Chapter 1):

\`\`\`js
const cache = new Map();
export async function getUser(id) {
  if (!cache.has(id)) cache.set(id, await repo.findUser(id));
  return cache.get(id);              // nothing ever evicts
}
\`\`\`

The leak grows with the *variety* of your traffic, which is why it never appears in staging. Bound it:

\`\`\`js
import { LRUCache } from 'lru-cache';
const cache = new LRUCache({ max: 5_000, ttl: 60_000 });
\`\`\`

**A listener added per request to a long-lived emitter.**

\`\`\`js
app.use((req, res, next) => {
  pool.on('error', () => req.log.error('pool error'));   // pool outlives every request
  next();
});
\`\`\`

That closure retains \`req\`, \`res\`, and everything they reference, forever. Node prints \`MaxListenersExceededWarning\` at eleven listeners: it is a leak report, not noise. Subscribe to the pool once at startup, and use \`res.on('finish')\` for anything per-request, since that emitter dies with the response.

**Timers started per request.** A \`setInterval\` keeps its callback and closure alive until cleared; clear it in \`res.on('close')\`.

**An uncapped array of recent things** — recent errors, active users, last payloads — in module scope.

### Not every growth curve is a leak

V8 sizes the old space from the memory it thinks it has. A container limited to 512 MB with no flag can be OOM-killed by the platform while V8 still believes there is room, and the tell is a process that vanishes with **exit code 137** and no JavaScript error. Set \`--max-old-space-size\` to roughly 75% of the container limit so V8 collects aggressively before the kernel intervenes.

To measure the floor without waiting for a natural collection, run locally with \`node --expose-gc\`, call \`global.gc()\` between samples, and compare \`heapUsed\` readings taken at the same point in each loop.
        `),
        lesson('Request Context and Honest Stack Traces', 13, `
By the time an error reaches your log it is three awaits away from the request that caused it. Two runtime features put the story back together.

### AsyncLocalStorage carries context through awaits

Chapter 5 stamped a request id onto \`req.log\`. That works until a repository twelve calls deep wants the same id and you start threading \`req\` through every signature — exactly the coupling Chapter 2 warned about.

\`\`\`js
// context.js
import { AsyncLocalStorage } from 'node:async_hooks';
export const requestContext = new AsyncLocalStorage();

// app.js — registered BEFORE the routes
app.use((req, res, next) => {
  requestContext.run({ requestId: req.id, userId: req.user?.id }, next);
});

// repositories/notes.js — no req, no plumbing
export async function query(sql, params) {
  const started = performance.now();
  const result = await pool.query(sql, params);
  logger.info({ ...requestContext.getStore(), ms: Math.round(performance.now() - started) }, 'query');
  return result;
}
\`\`\`

The store follows the async chain: every promise, timer, and I/O callback started inside \`run()\` sees it, and two concurrent requests never see each other's values.

Three things break it, and all three produce a silent \`undefined\` rather than an error. Registering the middleware **after** the routes leaves handlers running outside any store. Reading the store at module top level captures \`undefined\` once and keeps it. And a callback attached to an object created before the store — a pool listener, a shared emitter — runs in the context that created *that* object, not yours.

Keep the store small: ids and flags. Putting \`req\` in it means anything that captures the store, such as an interval, retains the entire request (last lesson).

### Do not destroy the stack you were handed

\`\`\`js
catch (err) {
  throw new AppError(502, err.message);     // stack now starts here; the origin is gone
}
\`\`\`

You kept the sentence and threw away the evidence. Carry the original along instead:

\`\`\`js
catch (err) {
  const wrapped = new AppError(502, 'Payment provider unavailable');
  wrapped.cause = err;          // pino and util.inspect print the whole chain
  throw wrapped;
}
\`\`\`

The log then shows both frames: your boundary, and the socket timeout underneath it. If you ship compiled output — TypeScript, esbuild — run with \`--enable-source-maps\` or every frame points into a bundle nobody can read. On a service with deep async chains, \`Error.stackTraceLimit = 30\` is worth setting at boot; the default of ten frames often stops just short of your own code.

### Make warnings say where they came from

\`\`\`bash
node --trace-warnings src/server.js
\`\`\`

A bare \`MaxListenersExceededWarning\` or deprecation notice carries no stack. \`--trace-warnings\` attaches one and turns "somewhere in node_modules" into a file and a line. Route them into the structured logger too, so they are searchable alongside everything else:

\`\`\`js
process.on('warning', (w) => logger.warn({ name: w.name, stack: w.stack }, w.message));
\`\`\`

### From ids to traces

The same store scales across services. Put a \`traceId\` in it, forward it on every outbound call as a \`traceparent\` header (Chapter 7), and read it on the way in when it is present. That is all distributed tracing is; OpenTelemetry automates the plumbing, but the model is the one you just built by hand.
        `),
      ],
      [
        q('p95 latency has doubled. CPU sits at 20% and the event loop delay histogram reports a p99 of 1 ms. What does that combination tell you?', [
          'The process is blocked by synchronous work in a handler',
          'The heap is near its limit and garbage collection is thrashing',
          'The process is idle while awaiting something external, so the latency is downstream',
          'Cluster workers are competing for the same port',
        ], 2, 'A near-zero loop delay means callbacks are being served promptly, so the time is being spent waiting on a database or upstream call rather than in your JavaScript.'),
        q('heapUsed drops back to a higher floor after every major GC, week after week. What does that pattern indicate?', [
          'A leak: something retains a growing set of objects across collections',
          'Normal behaviour, since V8 grows the heap under load',
          'Fragmentation that a restart would not fix',
          'The snapshot was taken before a collection ran',
        ], 0, 'A healthy process returns to roughly the same floor after each collection, so a rising floor means live, still-reachable objects are accumulating.'),
        q('A middleware calls pool.on("error", ...) on every request and Node starts printing MaxListenersExceededWarning. What is the underlying problem?', [
          'The pool is emitting more errors than it can queue',
          'The warning threshold of ten is too low for a busy server',
          'Express re-registers middleware on each request',
          'A listener is added per request to an emitter that outlives the request, retaining req and res forever',
        ], 3, 'The pool lives for the life of the process, so each closure it holds keeps that request alive in memory long after the response was sent.'),
        q('requestContext.getStore() returns undefined inside a route handler, although the middleware calling run() is present. What is the most likely cause?', [
          'AsyncLocalStorage does not survive an await',
          'The middleware was registered after the routes, so the handler runs outside the store',
          'The store must be created inside each request',
          'getStore() only works in CommonJS modules',
        ], 1, 'Express runs middleware in registration order, so a handler registered above the run() call executes outside any active store and sees nothing.'),
      ]
    ),
    chapter(
      'Integrations and Background Work',
      'Calling services that fail, moving slow work out of the request, and accepting webhooks you can trust.',
      [
        lesson('Calling Services That Fail', 14, `
Every outbound call goes to a process you do not control, over a network you do not control, possibly mid-deploy. Design for that and a dependency's bad afternoon stays theirs.

### Global fetch has no timeout worth the name

\`\`\`js
const res = await fetch('https://billing.example/charges', { method: 'POST', body });
\`\`\`

If billing accepts the connection and then never answers, this await hangs for **five minutes** — undici's default \`headersTimeout\` is 300 seconds — and only then rejects with \`UND_ERR_HEADERS_TIMEOUT\`. For a request handler that is indistinguishable from never. Meanwhile it keeps its socket, its pooled database client (Chapter 4), and its memory until the client gives up. A hundred of those exhaust the pool while your event loop reports itself perfectly healthy — and that is the single most common way one slow dependency takes down an unrelated service.

\`\`\`js
const ac = new AbortController();
res.on('close', () => ac.abort());          // client hung up: stop working for nobody

const upstream = await fetch(url, {
  signal: AbortSignal.any([ac.signal, AbortSignal.timeout(2_000)]),
});
\`\`\`

Timeouts are a **budget**, not a decoration. If your own SLA is three seconds, two sequential two-second upstream calls do not fit, and the client times out before your handler ever gets to reply.

### Retry the retryable, and nothing else

| Outcome | Retry? |
|---|---|
| \`ECONNRESET\`, \`ETIMEDOUT\`, socket hang up | yes |
| 502, 503, 504 | yes |
| 429 | yes, after \`Retry-After\` |
| 400, 401, 404, 422 | never — it will fail identically |
| 500 | only for reads; it may be deterministic |

\`\`\`js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function callJson(url, { retries = 2, timeoutMs = 2_000, ...init } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    } catch (err) {                                    // network error or timeout
      if (attempt === retries) throw new AppError(504, 'Upstream timed out');
      await sleep(Math.random() * Math.min(200 * 2 ** attempt, 2_000));   // full jitter
      continue;
    }
    if (res.ok) return res.json();
    if (res.status < 500 && res.status !== 429) {
      throw new AppError(502, \`Upstream rejected the request (\${res.status})\`);
    }
    if (attempt === retries) throw new AppError(502, 'Upstream unavailable');
    const after = Number(res.headers.get('retry-after'));   // absent -> null -> 0, so test > 0
    const backoff = Math.random() * Math.min(200 * 2 ** attempt, 2_000);
    await sleep(after > 0 ? after * 1_000 : backoff);
  }
}
\`\`\`

**Jitter is not a detail.** A fixed backoff synchronises every client that failed at the same instant, so the dependency recovers and is immediately flattened again by a perfectly aligned retry wave.

And a retry is only safe if the call is idempotent (Chapter 3). Retrying a charge without an idempotency key bills the customer twice:

\`\`\`js
headers: { 'Idempotency-Key': \`charge:\${order.id}\` }
\`\`\`

### Fail fast when it is already down

\`\`\`js
let failures = 0, openedAt = 0;
const THRESHOLD = 5, COOLDOWN_MS = 10_000;

export async function charge(order) {
  if (failures >= THRESHOLD && Date.now() - openedAt < COOLDOWN_MS) {
    throw new AppError(503, 'Billing temporarily unavailable');   // circuit open
  }
  try {
    const out = await callJson(BILLING_URL, { method: 'POST', body: JSON.stringify(order) });
    failures = 0;                                                 // closed again
    return out;
  } catch (err) {
    if (++failures >= THRESHOLD) openedAt = Date.now();           // re-arm, not just the first trip
    throw err;
  }
}
\`\`\`

Once a dependency is down, queueing more work against it only converts one broken feature into a queue of stuck requests. A breaker turns a three-second timeout into an instant 503 and lets the rest of the API stay responsive.

Two habits that go with all of this: reuse connections (\`undici\`'s pooled global dispatcher saves a TLS handshake per call), and **never hold an open transaction across an HTTP call** — a two-second upstream stall becomes two seconds of a held row lock and a drained pool.
        `),
        lesson('Background Jobs and Queues', 13, `
A request should do the smallest amount of work that lets you answer honestly. Everything else — email, thumbnails, exports, third-party sync — belongs on a queue.

### What moves out of the request

Anything that is slow, anything that may fail and should be retried, and anything CPU-bound (Chapter 1). The rule of thumb: if it does not change what you return, it does not belong in the handler.

\`\`\`js
// queue.js — the API imports this
import { Queue } from 'bullmq';
export const emailQueue = new Queue('email', { connection: { url: config.REDIS_URL } });

// controller — after the transaction has committed
await emailQueue.add('welcome', { userId: user.id }, {
  jobId: \`welcome:\${user.id}\`,                    // same id enqueues once
  attempts: 5,
  backoff: { type: 'exponential', delay: 1_000 },
  removeOnComplete: 1_000,
  removeOnFail: 5_000,
});
res.status(201).json({ data: user });
\`\`\`

**Pass ids, not objects.** A payload carrying the whole user is stale the moment anything edits that row, and it bloats Redis. The worker re-reads the current state:

\`\`\`js
// worker.js — its OWN process, started separately from the API
import { Worker } from 'bullmq';

const worker = new Worker('email', async (job) => {
  const user = await repo.findUser(job.data.userId);
  if (!user || user.welcomeSentAt) return;        // idempotent: safe to run twice
  await mailer.sendWelcome(user);
  await repo.markWelcomeSent(user.id);
}, { connection, concurrency: 5 });

worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'job failed'));

process.on('SIGTERM', async () => {
  await worker.close();     // stop taking new jobs, finish the active ones
  process.exit(0);
});
\`\`\`

Running workers inside the API process defeats the point: a job that pegs the CPU blocks the same loop serving requests. Same repository, same image, different command — \`node src/worker.js\`.

### Every queue delivers at least once

A worker can crash after sending the email and before marking it sent; the job is retried and the customer gets two. There is no configuration that fixes this — **the handler must be idempotent**, which is what the \`welcomeSentAt\` check above buys you. The general tools are a unique constraint on a natural key (Chapter 4), a deterministic \`jobId\`, or a \`processed_events\` table.

### The dual write nobody notices

\`\`\`js
await emailQueue.add('welcome', { userId: user.id });   // BUG: enqueued first
await tx.commit();                                      // if this throws, the job runs anyway
\`\`\`

The worker picks up the job, looks for a user that was never committed, and fails five times. Reverse it and you get the opposite hazard: the commit succeeds, the process dies, and the email is never queued. Enqueue **after** commit for anything you can tolerate losing; for anything you cannot, write the job into an \`outbox\` table inside the same transaction and let a small poller move rows onto the queue.

### Operate it like a service

| Signal | Meaning |
|---|---|
| queue depth rising | workers cannot keep up — add concurrency or instances |
| oldest job age | latency your users actually feel |
| failed set growing | a bug, or a dependency that is down |
| stalled jobs | workers being killed before \`close()\` finishes |

Alert on the failed set. A queue silently retrying and discarding jobs is the quietest way to lose customer data, because nothing in the API logs ever shows an error.

Scheduled work gets its own trap: a \`setInterval\` in the API process runs once per instance, so four replicas send four nightly reports. Use the queue's repeatable jobs, which hold a lock in Redis, or a single dedicated scheduler process.
        `),
        lesson('Receiving Webhooks You Can Trust', 13, `
A webhook endpoint is an unauthenticated POST from the public internet that claims to be your payment provider. Everything below is about earning that claim.

### The signature is over the raw bytes

This is the classic bug, and it burns an afternoon every time. \`express.json()\` parses the body and throws the original bytes away; \`JSON.stringify(req.body)\` gives you different whitespace and key order, so the HMAC never matches and the secret looks wrong.

\`\`\`js
// The webhook route gets a raw-body parser of its own, mounted before express.json()
router.post('/stripe',
  express.raw({ type: 'application/json', limit: '1mb' }),
  asyncHandler(handleStripe));
\`\`\`

If a global \`express.json()\` is registered above this route it has already consumed the stream (Chapter 2's ordering rule), and \`req.body\` arrives as an object rather than a Buffer. Either mount the webhook router first, or capture the bytes as they are parsed:

\`\`\`js
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
\`\`\`

### Verify in constant time, and check the clock

\`\`\`js
import crypto from 'node:crypto';

function verify(rawBody, header, secret) {
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=').map((s) => s.trim()))
  );                                                  // "t=1755690000,v1=9f86d0..."
  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > 300) return false;   // replay window

  const expected = crypto.createHmac('sha256', secret)
    .update(\`\${timestamp}.\`)
    .update(rawBody)                                  // Buffer, not a re-serialised string
    .digest();
  const given = Buffer.from(parts.v1 ?? '', 'hex');

  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
\`\`\`

Two details that are easy to skip. \`timingSafeEqual\` **throws** on buffers of different lengths, so compare lengths first. And signing the timestamp along with the body is what stops a captured request from being replayed a week later — without a freshness check, a valid signature is valid forever.

### Answer immediately, work later

\`\`\`js
async function handleStripe(req, res) {
  if (!verify(req.body, req.headers['stripe-signature'] ?? '', config.STRIPE_WEBHOOK_SECRET)) {
    throw new AppError(400, 'Invalid signature');     // do not make them retry a forgery
  }
  const event = JSON.parse(req.body.toString('utf8'));

  // INSERT ... ON CONFLICT DO NOTHING — returns 0 rows if we have seen this id
  const first = await repo.recordEventOnce(event.id);
  if (first) await webhookQueue.add(event.type, { eventId: event.id });

  res.status(200).end();                              // before any real work
}
\`\`\`

Providers time out in five to ten seconds and retry. Do the fulfilment inline and a slow database turns one order into three, because each retry re-runs the whole handler. Verify, persist the event, enqueue (previous lesson), acknowledge.

Your status code is an instruction: **2xx** means "durably accepted, stop sending", **4xx** means "this will never work, give up", **5xx** means "try again later". Returning 200 from a \`catch\` block tells the provider the event was handled and it is deleted from their queue forever.

### Two guarantees you do not get

Delivery is at-least-once, so the \`recordEventOnce\` dedupe is load-bearing, not defensive. And **order is not guaranteed** — \`subscription.updated\` can land before \`subscription.created\`. Never derive state by applying events in arrival order; key off the event's own timestamp, or re-fetch the object from the provider's API and store what it says.

When you send webhooks yourself, be the provider you want: sign with a timestamped HMAC, include a stable event id, retry with exponential backoff and jitter, and give receivers a way to replay a missed event.
        `),
      ],
      [
        q('A handler calls fetch() on a payment API with no timeout, and that API starts accepting connections without responding. What happens to your service?', [
          'Node aborts the request after its default 30-second timeout',
          'Only the payment endpoint is affected',
          'The event loop blocks and lag spikes',
          'Handlers pile up holding sockets and pooled database clients until the pool is exhausted',
        ], 3, 'A pending fetch never settles on its own, so each stuck handler keeps its resources and the shortage spreads to endpoints that never touch that dependency.'),
        q('A charge request times out, the client retries, and the customer is billed twice. What prevents this?', [
          'Retrying with exponential backoff and jitter',
          'Sending an Idempotency-Key so the provider recognises the repeat',
          'Treating a timeout as a permanent failure',
          'Wrapping the call in a database transaction',
        ], 1, 'A timeout does not tell you whether the work happened, so the second attempt must be identifiable as the same operation rather than a new one.'),
        q('Webhook signature verification fails for every request even though the secret is correct. What is the most likely cause?', [
          'express.json() replaced the raw bytes, and re-serialising the object changes what gets hashed',
          'The provider signs the response, not the request',
          'crypto.timingSafeEqual cannot compare HMAC digests',
          'The signature header name is case-sensitive',
        ], 0, 'HMAC is computed over the exact bytes sent, so any parse-and-re-stringify round trip produces a different input and a mismatched digest.'),
        q('A queue worker sends an email, crashes before acknowledging the job, and the job is retried. What is the correct fix?', [
          'Set attempts to 1 so jobs are never retried',
          'Increase the job timeout so the acknowledgement has time to land',
          'Make the handler idempotent, so re-running it is a no-op',
          'Move the worker into the API process to avoid the network hop',
        ], 2, 'Queues guarantee at-least-once delivery, so the handler has to be safe to run twice rather than depending on delivery never repeating.'),
      ]
    ),
  ],
  final: [
    q('A route handler runs a 400 ms synchronous loop. What happens to the other 30 requests currently in flight?', [
      'They are handled by libuv worker threads',
      'They all wait, because the single event loop is blocked',
      'Only requests to the same route wait',
      'Node spawns an additional process automatically',
    ], 1, 'Your JavaScript runs on one thread, so CPU-bound work stalls every pending callback in the process.'),
    q('req.body is undefined inside a POST handler. The most likely cause is', [
      'The client sent no Content-Length',
      'Express requires body access inside an async function',
      'The route uses a router instead of the app',
      'express.json() was registered after the route',
    ], 3, 'Middleware runs in registration order, so a parser registered below the route never touched that request.'),
    q('GET /users/me returns a database cast error. What is wrong?', [
      'A /users/:id route was registered first and matched "me" as an id',
      'The route needs mergeParams',
      'req.params is read-only',
      'Express cannot match two-segment paths',
    ], 0, 'First match wins, so literal segments must be registered before dynamic ones.'),
    q('Which response correctly signals that an authenticated user may not touch a resource they do not own?', [
      '200 with { success: false }',
      '400 Bad Request',
      '404 or 403, with the query scoped to the authenticated user',
      '401 Unauthorized',
    ], 2, 'Authentication succeeded, so 401 is wrong; the real defence is scoping the query by req.user rather than trusting the id.'),
    q('A schema uses .strict() to reject unknown keys. Which attack does that block?', [
      'SQL injection through the request body',
      'Mass assignment of fields such as role or isAdmin',
      'Cross-site request forgery',
      'Oversized request payloads',
    ], 1, 'Unknown keys spread into a database write let a caller set columns the endpoint never intended to expose.'),
    q('Why is argon2 or bcrypt preferred over SHA-256 for storing passwords?', [
      'They are deliberately slow and salted, making offline brute force impractical',
      'They produce shorter digests',
      'They can be reversed with the server key',
      'They are the only algorithms Node ships with',
    ], 0, 'Speed is a liability for password hashing; a fast general-purpose hash lets a GPU test billions of guesses per second.'),
    q('Every value is parameterised, yet a sort parameter allows injection. Why?', [
      'The driver does not support arrays',
      'Placeholders only work on SELECT statements',
      'The body parser decoded the value twice',
      'Placeholders bind values, not identifiers, so ORDER BY was string-interpolated',
    ], 3, 'Column names and sort direction cannot be bound; they must be mapped through an allow-list.'),
    q('Which correctly moves a large file to the client without loading it into memory?', [
      'readFile then res.send',
      'res.json with a base64 string',
      'pipeline(createReadStream(path), res)',
      'source.pipe(res) with no error handling',
    ], 2, 'pipeline streams in constant memory and destroys the chain on error, which bare pipe does not.'),
    q('A transaction helper omits client.release() in its finally block. What is the symptom?', [
      'Requests eventually hang forever once the pool is exhausted',
      'Every transaction rolls back',
      'Queries return stale data',
      'The database rejects new connections with a syntax error',
    ], 0, 'Leaked connections are never returned to the pool, so new requests wait indefinitely for one.'),
    q('An in-memory Map cache works on one server but shows users stale, inconsistent data after scaling to four instances. Why?', [
      'Map has a maximum size of 1,000 entries',
      'Node clears module state between requests',
      'The cache keys collide across processes',
      'Each process holds its own copy, so an invalidation only reaches the instance that handled it',
    ], 3, 'Process-local caches diverge across instances; shared state belongs in Redis or another shared store.'),
    q('p95 latency has doubled, CPU sits at 20%, and the event loop delay histogram reports a p99 of 1 ms. Where is the time going?', [
      'The loop is blocked by synchronous work in a handler',
      'Waiting on something external, such as a slow query or an upstream call',
      'Garbage collection, because the heap is near its limit',
      'The process needs more cluster workers',
    ], 1, 'A near-zero loop delay means callbacks are served promptly, so the latency belongs to a dependency the process is merely awaiting.'),
    q('RSS climbs all week and the heap floor after each major GC is higher than the last. A module-level Map memoises every user ever fetched. What is the fix?', [
      'Call global.gc() on a timer',
      'Raise --max-old-space-size so the heap has room',
      'Write a heap snapshot on every request',
      'Bound the cache with a maximum size and a TTL so entries can be evicted',
    ], 3, 'A module-scope Map lives for the life of the process, so entries must be evicted deliberately or the leak grows with traffic variety.'),
    q('A queue worker sends a welcome email, crashes before acknowledging the job, and the retried job sends it again. Which change prevents the duplicate?', [
      'Make the handler idempotent — re-read the user and skip if welcomeSentAt is already set',
      'Set attempts to 1 so the job is never retried',
      'Increase the job timeout',
      'Run the worker inside the API process',
    ], 0, 'Queues deliver at least once, so the handler must be safe to run twice instead of relying on delivery never repeating.'),
    q('A webhook route verifies an HMAC signature and every request fails the check, although the secret is correct. What is wrong?', [
      'The signature header is lower-cased by Express',
      'timingSafeEqual cannot compare hex-encoded digests',
      'express.json() consumed the body, so the exact bytes the sender signed no longer exist',
      'The provider signs the response rather than the request',
    ], 2, 'The signature covers the raw request bytes, and re-serialising a parsed object changes whitespace and key order, so the digest never matches.'),
  ],
});
