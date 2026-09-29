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
        `,
        [
          q('A helper schedules itself again with process.nextTick on every call, forever. What happens to HTTP requests already waiting for a database reply?', [
            'They stall, since microtasks drain to empty before the poll phase',
            'Libuv threads keep serving them until the tick queue drains',
            'Each is delayed one loop turn and then completes as normal',
            'Node raises a stack overflow and the loop carries on',
          ], 0, 'Node empties the nextTick queue between callbacks and before moving on, so a queue that refills itself means the loop never reaches the poll phase where I/O callbacks live.'),
          q('Your p95 latency has doubled, CPU sits at 30 percent, and the loop lag probe never prints above 5 ms. What does that combination point at?', [
            'A CPU heavy handler blocking the loop between callbacks',
            'A recursive nextTick call starving the poll phase',
            'Timers firing late because the check phase is saturated',
            'Waiting on something external, since the loop keeps up',
          ], 3, 'Low lag proves callbacks are being picked up promptly, so the extra time is spent waiting on a slow dependency such as the database rather than on blocked JavaScript.'),
          q('A CommonJS entry file logs \'sync\', then schedules a process.nextTick callback and a resolved promise callback. In what order do the three print?', [
            'sync, then the promise callback, then the nextTick callback',
            'sync, then the nextTick callback, then the promise callback',
            'The nextTick callback, then sync, then the promise callback',
            'sync, then both callbacks during the next timers phase',
          ], 1, 'Synchronous code finishes first, and Node drains the nextTick queue before the promise microtask queue, which is why the ES module version of the same file prints them the other way round.'),
        ]
      ),
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
        `,
        [
          q('A Docker build runs npm install and ships a minor release of express that nobody tested. Which change stops that happening again?', [
            'Move the dependency into devDependencies before building',
            'Change the range from ^4.19.2 to ~4.19.2 in package.json',
            'Use npm ci, which installs the lockfile exactly as recorded',
            'Delete package-lock.json so the tree resolves the same way',
          ], 2, 'npm ci installs the exact tree written in package-lock.json and fails when the lockfile and package.json disagree, so a build cannot quietly resolve a newer version.'),
          q('Three different files import \'./db.js\', which creates a connection pool at module scope. How many pools does the process end up holding?', [
            'Three, one for each importing module',
            'Three, unless db.js uses a default export',
            'One for every event loop turn that touches it',
            'One, because Node caches a module by resolved path',
          ], 3, 'A module body executes once and later imports receive the cached exports, which is exactly what makes a module the natural place to hold a single pool or logger.'),
          q('An ES module runs import { helper } from \'./utils\' and Node throws ERR_MODULE_NOT_FOUND, even though utils.js sits in the same directory. Why?', [
            'Relative imports in ESM require the file extension',
            'Named exports need a default export beside them',
            'Bare specifiers are only resolved inside node_modules',
            'The file has to be renamed utils.mjs to be importable',
          ], 0, 'ESM does not guess extensions the way CommonJS resolution did, so the specifier has to name the file exactly, as in \'./utils.js\'.'),
        ]
      ),
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
        `,
        [
          q('A handler sets Content-Length to body.length and some JSON responses arrive truncated, mostly for users with accented names. What went wrong?', [
            'JSON.stringify adds a trailing newline that was not counted',
            'String length counts characters, while the header wants bytes',
            'The header must be set after the first write, not before',
            'Content-Length is capped at the size of one socket chunk',
          ], 1, 'Multi-byte UTF-8 characters make the byte count larger than the character count, so the declared length falls short and the client stops reading early; Buffer.byteLength gives the real figure.'),
          q('A route branch validates the request, decides it is fine, and returns early without ever calling res.end. What does the client experience?', [
            'An immediate 500 from a default handler inside Node',
            'An empty 204 response that Node writes automatically',
            'A connection left open until something times out',
            'ERR_HTTP_HEADERS_SENT raised on the following request',
          ], 2, 'Nothing finishes a response for you, so the socket stays open and the request hangs until the client or a proxy gives up on it.'),
          q('Why does the readJson helper track a running byte total and call req.destroy once the limit is passed?', [
            'Because req emits data faster than JSON.parse consumes it',
            'Because Node spills request bodies to disk past 1 MB',
            'Because the chunks array cannot exceed 1024 entries',
            'Because one client could otherwise exhaust process memory',
          ], 3, 'Without a cap the server buffers whatever a caller sends, so a single large upload can consume the heap and take the whole process down.'),
        ]
      ),
            lesson('The libuv Thread Pool', 13, `
Your login endpoint hashes passwords with \`crypto.pbkdf2\` at roughly 200 ms of work per call. One login takes 200 ms. Four logins arriving together still take 200 ms each, in parallel. The fifth takes 400 ms, and no amount of spare CPU changes that.

Node ships a thread pool of four.

### Which calls actually use it

The event loop hands most waiting to the kernel. A socket read, a timer, a response being flushed: none of those need a thread, because epoll and kqueue can watch thousands of descriptors from the loop itself. A handful of operations cannot be done that way, so libuv runs them on a small pool of real OS threads and posts the result back when they finish.

| Goes to the pool | Stays on the loop |
|---|---|
| \`fs.*\`, almost all of it | TCP, TLS, and HTTP sockets |
| \`zlib\` async compression | timers and \`setImmediate\` |
| \`crypto.pbkdf2\`, \`scrypt\`, async \`randomBytes\` | \`dns.resolve4\` and friends |
| \`dns.lookup\` | anything watched by \`epoll\` |

That last pairing catches people. \`dns.lookup\` calls the system resolver \`getaddrinfo\`, which is a blocking C function, so it occupies a pool thread for as long as the lookup takes. \`dns.resolve4\` speaks DNS over UDP and never leaves the loop.

### Measuring the wall

\`\`\`js
import { pbkdf2 } from 'node:crypto';

const t0 = Date.now();
for (let i = 0; i < 8; i++) {
  pbkdf2('correct horse', 'salt', 200_000, 32, 'sha512', () => {
    console.log('call', i, 'finished at', Date.now() - t0, 'ms');
  });
}
\`\`\`

Four callbacks land together near 180 ms, the other four near 360 ms. Two clean waves. Give it more threads and the second wave disappears:

\`\`\`bash
UV_THREADPOOL_SIZE=8 node bench.js
\`\`\`

### The incident this really causes

An API reads an email template from disk on every request and calls an upstream billing service. At 50 requests per second everything is fine. At 300 the p95 triples, CPU sits at 20%, and a CPU profile shows nothing hot at all.

Here is the mechanism. Each outbound call does a \`dns.lookup\` first, the resolver is answering in 120 ms, and four slow lookups fill every thread. The template reads queue behind them. Two subsystems that share no code are fighting over four slots, and nothing in your source mentions threads.

Fix it in this order: cache the DNS answers, stop reading a static file on every request, and only then consider a bigger pool. Removing pool work beats adding threads every time.

### Raising it, carefully

\`UV_THREADPOOL_SIZE\` is read the first time the pool is used, and it is fixed for the rest of the process life. Set it in the environment rather than in JavaScript: in ESM every \`import\` is evaluated before your first statement runs, so a dependency may already have touched the pool by the time your assignment executes.

More threads is not free. Each carries a stack, and when the work is CPU bound, such as key derivation or gzip, sixteen threads on a two core container mostly buys context switching. The pool is also per process, so eight replicas at 16 threads means 128 concurrent readers hitting the same disk or NFS mount.

### What the pool is not for

Your own JavaScript never runs there. The pool serves specific built-in APIs implemented in C, and a loop over 200,000 rows in your handler stays on the main thread whatever you set the variable to.

| Mechanism | Runs what | Memory |
|---|---|---|
| libuv pool | built-in fs, zlib, crypto, dns work | internal to Node |
| worker thread | your own JavaScript | separate heap, messages |
| child process | a separate program | nothing shared |

The tell for a saturated pool is distinctive: latency climbs in steps the size of one operation, not smoothly, and it climbs while both the CPU and the event loop lag probe look healthy. Steps mean queueing for a thread. Smooth growth means something else is slow.
      `,
        [
          q('Eight concurrent pbkdf2 calls on a default Node process finish in two clean waves rather than all together. What explains the split?', [
            'The pool holds four threads, so four calls wait their turn',
            'The event loop batches crypto callbacks once per phase',
            'V8 limits background crypto work to half the cores',
            'Each call yields after 50 ms so others can start',
          ], 0, 'Key derivation runs on the libuv pool, which defaults to four threads, so the fifth through eighth calls only start once earlier ones release a thread.'),
          q('Which of these does its waiting without occupying a libuv pool thread?', [
            'fs.readFile on a 40 MB log file',
            'zlib.gzip compressing a response body',
            'An incoming socket read on your HTTP server',
            'dns.lookup while opening an outbound request',
          ], 2, 'Sockets are watched by the kernel through epoll or kqueue and report readiness straight to the event loop, while file, compression, and getaddrinfo work all need a real thread.'),
          q('Why set UV_THREADPOOL_SIZE in the environment rather than assigning it in your entry file?', [
            'Values assigned from JavaScript are clamped back to four',
            'Imports run before your first line, so the pool may exist',
            'process.env is only read once the first request arrives',
            'libuv rereads it per call, so both places would conflict',
          ], 1, 'The size is fixed when the pool is first used, and every ES module import is evaluated before your own statements, so a dependency can create the pool before your assignment ever runs.'),
        ]
      ),
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
        `,
        [
          q('app.post(\'/api/notes\', createNote) is registered on line 10 and app.use(express.json()) on line 12. What does req.body hold inside createNote?', [
            'The parsed JSON, since parsers are hoisted by Express',
            'Nothing useful, because the parser never ran for that route',
            'A Buffer holding the raw bytes of the request body',
            'An empty object, since the parser ran and found no body',
          ], 1, 'Middleware only applies to routes registered after it, so a parser added below the route is never part of that request\'s pipeline and the body is left unread.'),
          q('A filter endpoint has worked for months, then ?tag=js&tag=node returns 500 with \'req.query.tag.trim is not a function\'. What changed?', [
            'Express rejects duplicate keys unless extended parsing is on',
            'The second value silently overwrites the first as a number',
            'A repeated parameter arrives as an array, which has no trim',
            'Query values are parsed lazily and stay undefined until read',
          ], 2, 'Express gives you a string for a single occurrence and an array when the key repeats, so any code that assumes a string breaks the first time a user repeats the parameter.'),
          q('A logger mounted with app.use(\'/api\', logger) prints req.url, and during an incident you cannot tell /api/notes apart from /admin/notes. What is missing?', [
            'The query string, which is stripped at the mount point',
            'The method, which lives on req.route rather than req',
            'Nothing, req.url and req.originalUrl always match here',
            'The /api prefix, which is removed from req.url when mounted',
          ], 3, 'Anything mounted on a path sees req.url with that prefix stripped, so a logger should print req.originalUrl, which is never rewritten.'),
        ]
      ),
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
        `,
        [
          q('A comments router mounted at \'/:noteId/comments\' reads req.params.noteId and gets undefined, so every query returns the wrong rows. What fixes it?', [
            'Create the child router with Router({ mergeParams: true })',
            'Read the value from req.query.noteId instead of params',
            'Move the mount above the notes routes inside server.js',
            'Declare the parameter again in the child route path',
          ], 0, 'Each router keeps its own params object by default, so the parent\'s dynamic segment is invisible until mergeParams tells Express to pass it down.'),
          q('Inside a router mounted with app.use(\'/api/notes\', notesRouter), a route is declared as router.get(\'/api/notes/:id\'). Which path does it actually serve?', [
            '/api/notes/:id, since Express removes the duplicated prefix',
            '/api/notes/api/notes/:id, because router paths are relative',
            '/:id, because the mount prefix replaces the route path',
            'None, Express refuses to register an absolute path there',
          ], 1, 'Paths inside a router are relative to the mount point, so repeating the prefix concatenates it twice and produces a 404 that reads like a typo.'),
          q('A 404 handler is added just above app.use(\'/api/users\', usersRouter), and now every user route returns 404. Why?', [
            'Routers must be mounted before any other app.use call',
            'A 404 handler needs four arguments to be skipped properly',
            'The catch-all matches first, since registration order decides',
            'The router inherits the handler through merged parameters',
          ], 2, 'Express walks the stack in registration order, so a handler that matches every path responds before anything registered after it is ever reached.'),
        ]
      ),
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
        `,
        [
          q('The error handler sends err.message to the caller only when err.expose is true. What is that flag protecting you from?', [
            'Express stripping messages from errors it did not create',
            'Errors without a message property serialising as null',
            'Messages longer than the response header limit allows',
            'Leaking internals, since a 5xx message often names them',
          ], 3, 'Errors you raised deliberately carry text meant for the caller, while an unexpected failure can mention file paths, drivers, or connection strings that must not leave the server.'),
          q('A CSV export fails halfway through streaming and the error handler calls res.status(500).json(...). What should it do instead once res.headersSent is true?', [
            'Pass the error to next(err) so Node aborts the response',
            'Retry the write once and then send the 500 body',
            'Call res.end with an empty payload and log the failure',
            'Set the status header again before writing the JSON',
          ], 0, 'The status line and headers are already on the wire, so no new status can be sent; delegating lets Node destroy the connection, which is the only honest signal left.'),
          q('Why log and exit on uncaughtException rather than swallowing it to keep the server serving traffic?', [
            'Node refuses new connections after any uncaught error',
            'The process state is unknown, so more work may corrupt data',
            'The stack trace is only readable during the exit sequence',
            'Handlers registered later would stop receiving any errors',
          ], 1, 'An uncaught exception means a bug left invariants broken, so continuing risks half written transactions, and a supervisor can restart a clean process in seconds.'),
        ]
      ),
            lesson('CORS and the Browser Preflight', 12, `
The same POST works from \`curl\` and fails from the browser with "blocked by CORS policy". Your access log for that minute shows one line, and it is not the POST:

\`\`\`text
OPTIONS /api/notes 404 1.2ms
\`\`\`

The browser asked permission first, your app answered 404, and the real request was never sent. That log line is the whole lesson: almost every CORS failure is a question your server answered badly, not a mystery.

### The rule belongs to the browser

An origin is scheme plus host plus port. \`http://localhost:5173\` and \`http://localhost:3000\` are different origins because the port differs, which is why a Vite dev server hits this on day one.

The part people get backwards: for a simple request the browser **sends** it anyway, your handler runs, the row is written, and then the browser refuses to hand the response to JavaScript because the headers did not grant access. A CORS error in the console never proves the write did not happen. Servers, scripts, and mobile apps ignore all of this, so CORS is not a security boundary. It protects the user's session, not your data.

### Simple requests versus preflight

| Request | Preflight |
|---|---|
| \`GET /api/notes\` | no |
| \`POST\` with \`Content-Type: text/plain\` | no |
| \`POST\` with \`Content-Type: application/json\` | yes |
| Any request with an \`Authorization\` header | yes |
| \`PATCH\` or \`DELETE\` | yes |

So a JSON API preflights nearly everything. The preflight is a real \`OPTIONS\` request carrying \`Access-Control-Request-Method\` and \`Access-Control-Request-Headers\`, and it must be answered with matching \`Access-Control-Allow-*\` headers before the browser will send the actual call.

### Wire it up, and mind the order

\`\`\`js
import cors from 'cors';

const ALLOWED = new Set([
  'https://app.example.com',
  'http://localhost:5173',
]);

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || ALLOWED.has(origin)),
  credentials: true,
  maxAge: 600,                       // cache the preflight for 10 minutes
  exposedHeaders: ['X-Request-Id'],
}));

app.use(express.json({ limit: '100kb' }));
app.use('/api/notes', notesRouter);
app.use((req, res) => res.status(404).json({ message: 'Not found' }));
\`\`\`

Register it above the routes and well above the catch-all 404. Put it below them and the preflight falls through to the 404 handler, which is exactly the log line at the top of this page: a routing bug that reports itself as a CORS bug.

Without \`exposedHeaders\`, client JavaScript can read only a handful of default response headers. Your carefully returned \`X-Request-Id\` is invisible to the frontend team until you list it.

### Credentials change everything

\`\`\`js
app.use(cors({ origin: '*', credentials: true }));   // browser rejects this
\`\`\`

A wildcard and credentials cannot be combined. With \`credentials: true\` the response must name one concrete origin, which means echoing the caller's origin after checking it against your list, and that in turn means the response varies by request:

\`\`\`js
res.setHeader('Vary', 'Origin');
\`\`\`

Miss that header and any cache in front of you, a CDN or a shared proxy, can store the response it built for \`app.example.com\` and serve it, headers and all, to a different origin. The \`cors\` package sets \`Vary\` for you when you pass a function; hand-rolled middleware usually forgets.

Reflecting the origin unconditionally, \`origin: true\`, is the same as allowing every site on the internet to make credentialed calls as your logged in user. It is the single most common way this gets misconfigured, and it looks like it works perfectly.

### Errors need the headers too

Your error handler returns a 500 without the \`Access-Control-Allow-Origin\` header, because the CORS middleware sets it on the way in only when it recognises the route. The browser then reports a CORS failure and the developer never sees the 500. When a response mysteriously loses its status in the browser but shows correctly in the network tab, check whether the headers survived the error path.

Cookies add one more rule on top: a cross site cookie needs \`SameSite=None; Secure\`, or it is simply not sent, and no amount of CORS configuration brings it back.
      `,
        [
          q('A browser reports a CORS error for POST /api/notes while the same call succeeds from curl. What does the server access log most likely show?', [
            'No entry at all, because the browser blocked the request',
            'A POST that returned 403 from the auth middleware',
            'An OPTIONS request answered 404 by the catch-all handler',
            'Two POST requests, the first of them without a body',
          ], 2, 'A JSON POST is preflighted, so the browser sends OPTIONS first, and CORS middleware registered below the catch-all lets that preflight fall through to the 404 handler.'),
          q('An API is configured with origin: \'*\' and credentials: true, and every authenticated call from the frontend fails. Why?', [
            'The wildcard applies to methods only, never to origins',
            'Credentials require the request to be preflighted twice',
            'Cookies are stripped whenever maxAge is left unset',
            'A wildcard origin is not accepted alongside credentials',
          ], 3, 'When credentials are involved the browser demands one concrete origin in Access-Control-Allow-Origin, so the wildcard response is rejected before your code ever sees it.'),
          q('Your API echoes the caller\'s origin back after checking an allow-list, and a CDN sits in front of it. What breaks without a Vary: Origin header?', [
            'A response cached for one origin is served to another',
            'The preflight is cached forever because maxAge is ignored',
            'Cookies are dropped from the cached copy by the browser',
            'The cache key includes credentials, so nothing ever hits',
          ], 0, 'The cache treats the responses as interchangeable unless Vary names Origin, so it can hand a stored Access-Control-Allow-Origin header to a request from a completely different site.'),
        ]
      ),
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
        `,
        [
          q('A mobile client on a flaky connection never sees the response and retries the same call. Which method is required to leave the same end state?', [
            'POST, since it creates exactly one resource per call',
            'PUT, because repeating it yields the same stored state',
            'Any of them, once the first attempt returned a 2xx',
            'Only GET, because writes can never be repeated safely',
          ], 1, 'Idempotency means a repeated request leaves the resource as it was after the first one, which GET, PUT, and DELETE guarantee and POST does not.'),
          q('A signed in editor requests an admin only report and their token is perfectly valid. Which status belongs in the response?', [
            '401, because the token carries no admin claim',
            '400, since the request asks for something invalid',
            '403, because you know who they are and refuse anyway',
            '409, because the role conflicts with the resource',
          ], 2, '401 asks the caller to authenticate, while 403 says authentication succeeded and the answer is still no, which is the case here.'),
          q('GET /api/notes reads perPage from the query string and passes it straight to the repository with no cap. What is the practical risk?', [
            'One caller asking for 500000 rows loads them all at once',
            'Express rejects the query once it passes the body limit',
            'The offset overflows and the query returns duplicate rows',
            'Sorting turns unstable because rows shift while reading',
          ], 0, 'An uncapped page size is a denial of service endpoint you wrote yourself, since a single request can pull the whole table into memory and serialise it.'),
        ]
      ),
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
        `,
        [
          q('The validate middleware assigns the parsed result to req.valid, but a controller still reads fields from req.body. What is the consequence?', [
            'The controller sees coerced types but no defaults applied',
            'Nothing, because Express replaces req.body with the result',
            'Raw unvalidated values keep flowing into the handler',
            'The schema runs a second time for every property read',
          ], 2, 'Parsing does not mutate req.body, so reading the raw object skips every coercion, default, and unknown key rejection the schema performed.'),
          q('Every item in an orders array is validated strictly, yet one request causes 100000 inserts. What did the schema forget?', [
            'A maximum length on the array itself',
            'A tighter regex on the sku field',
            'Coercion of qty from string to number',
            'A uniqueness rule across the items',
          ], 0, 'Per item rules say nothing about how many items are allowed, so an unbounded array passes validation and then does unbounded work in the handler.'),
          q('A title passes z.string().max(200) and is later interpolated into a SQL string. What does that tell you about validation?', [
            'The schema should reject quote characters outright',
            'Accepting a value is separate from using it safely',
            'Validation applies to the body but never to params',
            'The value must be revalidated after the middleware',
          ], 1, 'Validation decides whether to accept a request, while escaping happens at each boundary where it matters, so a perfectly valid string is still dangerous in a concatenated query.'),
        ]
      ),
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
        `,
        [
          q('Why is SHA-256 the wrong function for storing user passwords, even with a per user salt?', [
            'Its digest is too short to store in a text column',
            'It is fast, so a stolen table falls to a GPU quickly',
            'It cannot be salted the way argon2 or bcrypt can',
            'It is reversible for inputs under 32 bytes long',
          ], 1, 'Password hashing has to be deliberately expensive, and a fast general purpose hash lets an attacker try billions of candidates per second against a leaked table.'),
          q('A team puts the user\'s plan, internal account notes, and a support flag into the JWT payload because it saves a lookup. What is wrong with that?', [
            'Anyone holding the token can decode and read all of it',
            'Custom fields are dropped unless registered as claims',
            'Signing fails once the payload passes the header limit',
            'jwt.verify ignores extra fields when checking signatures',
          ], 0, 'A JWT is signed rather than encrypted, so the payload is readable by anyone who has the token, including the browser and anything that logs it.'),
          q('A handler runs requireAuth and then repo.find(req.params.id) with no ownership check, and the whole test suite passes. Why do the tests miss it?', [
            'Test tokens expire before the query ever runs',
            'Supertest strips path parameters by default',
            'The repository caches rows between test cases',
            'The suite only ever asks for ids the test user owns',
          ], 3, 'An insecure direct object reference only shows up when you request somebody else\'s id, and fixtures written from the owner\'s point of view never do that.'),
        ]
      ),
            lesson('Password Resets and Email Verification', 13, `
A support ticket lands: a customer clicked the reset link in their email and ended up logged in as somebody else. The link was \`/reset?token=Mzk\`, and \`Mzk\` is base64 for \`39\`. Every user id in the database was a valid reset token, and the person on the ticket had simply mistyped a character.

A reset token is a temporary password you email to someone. Treat it exactly that seriously.

### Random, hashed at rest, single use

\`\`\`js
import crypto from 'node:crypto';

const token = crypto.randomBytes(32).toString('base64url');   // goes in the email
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

await pool.query(
  \`INSERT INTO password_resets (user_id, token_hash, expires_at)
   VALUES ($1, $2, now() + interval '30 minutes')\`,
  [user.id, tokenHash]
);
\`\`\`

Store the hash, never the token. Your database backups, your read replica, and anyone with a SELECT on that table would otherwise hold a live key to every account that asked for a reset today.

Here is the part that surprises people who learned password hashing first: a fast hash is correct here. Argon2 exists because a password has maybe 30 bits of entropy and needs to be expensive to guess. This token has 256 bits of randomness, so SHA-256 is fine and you can look it up by index. Slow hashing would only mean you cannot find the row.

### Redeem it atomically

\`\`\`js
// Broken: two clicks, two tabs, or a retry all succeed
const row = await db.findByHash(tokenHash);
if (row && !row.used_at) { await db.markUsed(row.id); await setPassword(row.user_id); }
\`\`\`

The check and the write are separate, so two requests can both pass the check. Claim the row in one statement instead and trust the row count:

\`\`\`sql
UPDATE password_resets SET used_at = now()
WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
RETURNING user_id;
\`\`\`

Zero rows back means expired, already spent, or forged, and all three deserve the same reply: "This link is no longer valid."

### Do not answer the question "does this email exist"

\`\`\`js
router.post('/auth/forgot', async (req, res) => {
  const user = await users.findByEmail(req.valid.body.email);
  if (user) await resets.createAndQueueEmail(user);   // queue, do not await SMTP
  res.status(202).json({ message: 'If that address exists, a link is on its way.' });
});
\`\`\`

Returning 404 for an unknown address turns the endpoint into a membership oracle: feed it a breach list and learn who banks with you. Same status, same body, and queue the mail rather than sending it inline so the response time does not leak the answer either.

### Finish the job after the reset

Changing the password is not the end of the incident. Whoever prompted the reset may still be holding a valid session or refresh token.

| Step | Why |
|---|---|
| Delete every session for the user | The attacker's cookie dies with them |
| Revoke outstanding refresh tokens | A 15 minute access token expires on its own |
| Invalidate other unused reset rows | One request, one live link |
| Send a "your password changed" email | The real owner finds out fast |

### The link leaks in places you did not plan for

Corporate mail filters and link scanners fetch every URL in a message before the human sees it. If a \`GET\` on the reset URL consumes the token, the scanner burns it and your user gets "no longer valid" for a link they never clicked. Let the \`GET\` render a form and have the form \`POST\` the token to actually change the password.

The same reasoning covers email verification links, which are the identical mechanism with a longer expiry and no session revocation attached. Two more habits worth keeping: rate limit \`/auth/forgot\` per address as well as per IP, since a script can otherwise mail-bomb one customer, and never put the token in a redirect or a page that loads third party scripts, because the \`Referer\` header carries the URL straight to them.
      `,
        [
          q('Why store only a SHA-256 of the reset token rather than the token that was emailed?', [
            'The raw token is too long for an indexed column',
            'Hashing lets one token be reused across accounts',
            'It allows comparison without reading the database',
            'A leaked table would otherwise open every account',
          ], 3, 'The emailed token is a temporary password, so keeping it in plain text means backups, replicas, and anyone with read access hold working keys to those accounts.'),
          q('POST /auth/forgot returns 404 for an address with no account and 202 for one that has an account. What have you accidentally built?', [
            'A retry loop, since clients treat 404 as permanent',
            'A cache miss that makes the mailer run twice',
            'An enumeration oracle for anyone with an email list',
            'A validation error that hides the real failure',
          ], 2, 'Different responses let an attacker test addresses one by one and learn exactly who has an account with you, which is why the endpoint should answer identically either way.'),
          q('A customer says the reset link was already used the first time they opened it, and the logs show it was redeemed two seconds after the email was sent. What happened?', [
            'The row expired before the mail server delivered it',
            'Two reset rows were inserted for the same request',
            'The browser prefetched the page from the address bar',
            'A corporate link scanner fetched the URL before them',
          ], 3, 'Mail security tools open every link in a message, so any reset that is consumed by a GET gets spent by the scanner; render a form on GET and consume the token on POST.'),
        ]
      ),
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
        `,
        [
          q('Signup checks whether an email exists and then inserts. Two requests arrive together, both pass the check, and you get two accounts. What actually prevents this?', [
            'Running both inserts inside one shared transaction',
            'A UNIQUE constraint, with error 23505 mapped to a 409',
            'Retrying the check after a short randomised delay',
            'Selecting with ORDER BY id LIMIT 1 before inserting',
          ], 1, 'Anything that checks and then writes leaves a gap between the two statements, while a database constraint is evaluated at write time and cannot be raced.'),
          q('A list endpoint loads 50 notes and then queries the author of each one, giving 51 round trips. What does the fix look like?', [
            'Cache each author lookup for the life of the request',
            'Raise the pool max so the 51 queries run in parallel',
            'Fetch every author at once with WHERE id = ANY($1)',
            'Move the author lookup into a view queried per row',
          ], 2, 'Collecting the author ids and asking for them in a single query turns 51 round trips into 2, which is the whole point of avoiding an N plus 1 pattern.'),
          q('Why can a parameterised value never be executed as SQL, no matter what characters it contains?', [
            'The value travels separately from the statement text',
            'Quotes inside the value are escaped by the driver first',
            'The pool rejects any value containing SQL keywords',
            'Placeholders are substituted after the statement runs',
          ], 0, 'The database parses and plans the statement before the parameters arrive, so a value can only ever be data and never becomes part of the query text.'),
        ]
      ),
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
        `,
        [
          q('source.on(\'data\', chunk => dest.write(chunk)) works fine until the destination gets slow, and then memory climbs steadily. What is going wrong?', [
            'The data event fires more often as the writer slows',
            'Each chunk is copied once per stream in the chain',
            'Object mode holds rows until the stream is destroyed',
            'write returns false and nothing ever pauses the reader',
          ], 3, 'A false return means the destination buffer is full and the producer should wait for the drain event, so ignoring it lets unwritten chunks pile up in memory.'),
          q('An export endpoint streams rows into res, and the database query fails after 200000 rows have gone out. Why can you not return a 500?', [
            'The status line and headers were sent long ago',
            'Express clears the error handler once piping starts',
            'A 500 needs the whole body buffered in memory',
            'The transform swallowed the error passed to its callback',
          ], 0, 'Once the first chunk is on the wire the response status is fixed, so the only honest option left is destroying the connection, which is why validation belongs before writing starts.'),
          q('A Transform throws inside its transform function instead of calling cb(err). What is the result?', [
            'The chain retries that chunk and then carries on',
            'It escapes stream error handling as an uncaught exception',
            'The stream stalls until the highWaterMark is raised',
            'The error is emitted on the destination as a warning',
          ], 1, 'Streams route failures through the callback, so a thrown error bypasses the error event that pipeline listens for and takes the process down instead.'),
        ]
      ),
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
        `,
        [
          q('Validation rejects an upload after multer has already written it to disk, and the handler returns a clean 400. What else has to happen?', [
            'Reset the multer limits before the next request',
            'Send Content-Disposition so the browser drops it',
            'Unlink the file, or rejected uploads fill the disk',
            'Close the request stream so the client stops sending',
          ], 2, 'Multer stores the file before your checks run, so every rejection path must delete it or a retry loop quietly fills the volume and takes logs and the database with it.'),
          q('Why is path.join(UPLOAD_DIR, file.originalname) dangerous even when the directory is correct?', [
            'Long names get truncated and silently collide',
            'originalname is URL encoded and needs decoding',
            'join normalises separators and breaks on Windows',
            'The name comes from the client and can traverse up',
          ], 3, 'A filename such as ../../../etc/cron.d/pwn is joined and normalised into a path outside the upload directory, which is why you generate your own name instead.'),
          q('Ten users each upload a 50 MB file to an endpoint configured with multer.memoryStorage. What is the immediate cost?', [
            'Around 500 MB of heap held at the same time',
            'Ten pooled connections held until writes finish',
            'The event loop blocks for each transfer in turn',
            'Each file is written twice, to memory and disk',
          ], 0, 'Memory storage keeps the whole file in the process heap until the handler finishes, so concurrent uploads add up and push the process towards an out of memory kill.'),
        ]
      ),
            lesson('Schema Migrations Without Downtime', 13, `
The deploy went out at 14:02. By 14:03 every write to \`notes\` was timing out and the dashboard was red. The change was one line:

\`\`\`sql
CREATE INDEX notes_user_id_idx ON notes (user_id);
\`\`\`

On a laptop with 200 rows that runs in 8 ms. On 8 million rows it took 90 seconds, and for all 90 it held a lock that blocked every \`INSERT\` and \`UPDATE\` on the table. The query was correct, well reviewed, and an outage.

Schema changes are deploys. They need the same care, and they have their own failure modes.

### One file, applied once, in order

\`\`\`text
migrations/
  20250114093000_create_notes.sql
  20250128140200_add_notes_status.sql
  20250203101500_index_notes_user_id.sql
\`\`\`

A runner (node-pg-migrate, Knex, Flyway, Prisma Migrate) keeps a \`schema_migrations\` table listing what has run, usually with a checksum of each file. That checksum is why you never edit a migration that has already been applied: staging and production silently diverge, and the runner either refuses to start or, worse, does not notice. Wrong column type in yesterday's migration? Write a new file that alters it.

### Run them once per deploy, not once per replica

The tempting shortcut is calling the migrator when the app boots. With six replicas rolling out at the same time, six processes race to apply the same file. One wins, two crash on a duplicate object, and the rest restart into a half applied schema.

Make migrations a separate step: a job that runs before the new version starts, or a boot path that takes a lock everyone contends on.

\`\`\`js
await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);
try { await runPendingMigrations(client); }
finally { await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID]); }
\`\`\`

### Expand and contract

During a rolling deploy, old code and new code run at the same time against one database. That single fact rules out most of what people want to write.

Renaming \`user_name\` to \`full_name\` in one statement breaks every instance of the old version instantly. Split it into three deploys:

| Deploy | Migration | Application |
|---|---|---|
| 1 | add nullable \`full_name\`, backfill | write both columns, read \`user_name\` |
| 2 | none | read \`full_name\` |
| 3 | drop \`user_name\` | read and write \`full_name\` only |

The rule underneath: every migration must be compatible with the version currently running and the version about to start. Additive changes are safe. Drops and renames are safe only after nothing reads them.

### Locks and long transactions

Three habits keep a migration from becoming an incident:

\`\`\`sql
SET lock_timeout = '3s';
CREATE INDEX CONCURRENTLY notes_user_id_idx ON notes (user_id);
ALTER TABLE notes ADD CONSTRAINT notes_status_check CHECK (status IN ('draft','published')) NOT VALID;
ALTER TABLE notes VALIDATE CONSTRAINT notes_status_check;
\`\`\`

\`CONCURRENTLY\` builds the index without blocking writes, at the cost of two passes and no wrapping transaction. \`NOT VALID\` then \`VALIDATE\` adds a constraint in two cheap steps rather than one long table scan under a heavy lock. And \`lock_timeout\` matters more than it looks: a blocked \`ALTER TABLE\` sits at the head of the lock queue, so every ordinary \`SELECT\` behind it waits too. Without a timeout, one migration that cannot get its lock stops the whole table.

Backfills get the same treatment. A single \`UPDATE\` over 12 million rows holds one transaction for twenty minutes, blocks vacuum, and bloats the table with dead tuples. Walk it in batches:

\`\`\`js
let cursor = 0;
for (;;) {
  const { rows } = await pool.query(
    \`UPDATE notes SET status = 'draft'
     WHERE id > $1 AND status IS NULL
     ORDER BY id LIMIT 5000 RETURNING id\`, [cursor]);
  if (rows.length === 0) break;
  cursor = rows.at(-1).id;
  await new Promise(r => setTimeout(r, 100));   // let replication catch up
}
\`\`\`

### Down migrations are for your laptop

Write them, use them locally, and do not plan a production rollback around them. Reversing \`DROP COLUMN\` does not bring the data back. In production the recovery path is a new forward migration and a redeploy, which is another argument for shipping small additive changes you never need to undo.
      `,
        [
          q('Six replicas each run pending migrations when they boot, and a rolling deploy starts them within a second of each other. What is the likely outcome?', [
            'The runner queues them safely in file order',
            'They race, and losers crash on a partly applied change',
            'Each replica applies the changes to its own copy',
            'Only the first boots and the rest stay pending',
          ], 1, 'Nothing coordinates the six processes, so several try to create the same object and fail, which is why migrations belong in one step or behind an advisory lock.'),
          q('During a rolling deploy the old and new versions run against one database for several minutes. Which migration is safe to ship with the new version?', [
            'Renaming user_name to full_name in one statement',
            'Dropping a column the previous version still writes',
            'Adding a nullable column that only new code writes',
            'Adding NOT NULL to a column that has empty rows',
          ], 2, 'An additive nullable column leaves the running version working exactly as before, while renames, drops, and new constraints break whichever version has not caught up.'),
          q('A migration adds an index without CONCURRENTLY on a large table, and within seconds ordinary SELECT queries on that table are timing out too. Why do reads suffer?', [
            'The planner ignores the table while an index is built',
            'Each SELECT rebuilds the partial index as it goes',
            'Reads are rerouted to a replica that is behind',
            'They queue behind the blocked change in the lock queue',
          ], 3, 'A statement waiting on a heavy lock sits at the head of the queue, so requests that would otherwise be compatible with each other pile up behind it until it completes.'),
        ]
      ),
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
        `,
        [
          q('Nothing validates process.env at startup, and JWT_SECRET is missing from the production environment. What does that failure look like?', [
            'The server refuses to start and names the missing variable',
            'The server boots normally and the first login attempt throws inside jwt.sign, hours later',
            'Every route returns 500 as soon as the first request arrives',
            'Node substitutes an empty string, so tokens sign but fail verification',
          ], 1, 'Without a boot-time check the process starts happily and the missing value only surfaces at the moment some code actually reads it, which is long after the deploy and far from the cause.'),
          q('A user reports an error and quotes the x-request-id they were shown. What makes that id worth returning?', [
            'It is a UUID, so it cannot collide with another request',
            'It lets the client retry the request without duplicating work',
            'Pino redacts it automatically before the line is written',
            'Every line logged during that request carries it, so one filter rebuilds the whole path',
          ], 3, 'A child logger stamps the same id onto every downstream line, so a single query in the aggregator reconstructs that request across middleware, handler, and error handler.'),
          q('Why is logging whole request bodies at info level still a bad idea on a service that already configures pino\'s redact option?', [
            'redact only masks the paths you listed, so new fields leak and the volume buries real signal',
            'redact runs after the line has been shipped to the aggregator',
            'info is disabled in production, so those lines are silently lost',
            'Pino cannot serialise nested objects without a custom serialiser',
          ], 0, 'Redaction is an allow-list of known paths and a safety net rather than a policy, so any field nobody thought to list ends up in backups and laptops alongside the noise it adds.'),
        ]
      ),
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
        `,
        [
          q('app.listen() is called at the bottom of app.js, and every test file imports that module. What goes wrong?', [
            'Supertest cannot send requests to an app that is already listening',
            'Express refuses to register routes once the server is listening',
            'Each test file binds the port, so the second dies with EADDRINUSE or the run never exits',
            'The test files share one database connection and interfere with each other',
          ], 2, 'Binding happens at import time, so every importer opens the same port and the live server also keeps the event loop alive after the assertions finish.'),
          q('A test posts a note, asserts that the status is 201, and passes. Why is that not a sufficient test?', [
            'A handler that answers 201 and writes nothing to the database passes it too',
            'Supertest does not follow the Location header by default',
            'A create endpoint should answer 200 rather than 201',
            'The assertion runs before the response body has been parsed',
          ], 0, 'A status code only proves the handler replied, so the test must also assert the body shape and the side effect that the row was actually created.'),
          q('Which dependency is the right one to stub out in an API test?', [
            'The repository layer, so the test never depends on SQL',
            'The database, swapped for an in-memory object store',
            'The Express router, so each route is exercised in isolation',
            'The payment provider\'s HTTP endpoint, because you do not own it',
          ], 3, 'You stub what sits outside your boundary and cannot be controlled, while your own SQL, constraints, and cascades have to run for real or the test proves nothing about them.'),
        ]
      ),
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
        `,
        [
          q('The API sits behind a load balancer and app.set(\'trust proxy\', 1) was never added. What is the consequence?', [
            'TLS termination fails and requests arrive unencrypted',
            'Every request appears to come from the proxy, so rate limiting throttles all users as one',
            'Express cannot parse the x-forwarded-for header at all',
            'Keep-alive connections are closed after every response',
          ], 1, 'Without trusting the proxy, req.ip resolves to the balancer\'s address for every caller, so a per-IP limiter collapses all traffic into a single bucket.'),
          q('Why put a version segment such as v1 into a Redis cache key like courses:v1:2?', [
            'It lets you shard the keys across several Redis instances',
            'Redis expires versioned keys sooner than unversioned ones',
            'A shape change ships new code that would otherwise read the old JSON still under that key',
            'It stops two workers writing the same key at the same moment',
          ], 2, 'Cached entries outlive the deploy, so bumping the version gives the new code a fresh namespace instead of parsing documents written by the previous shape.'),
          q('Why should a readiness endpoint start failing the instant SIGTERM arrives, given the server is already draining?', [
            'So the load balancer stops sending new requests before the process stops accepting',
            'So the platform restarts the container faster once the drain finishes',
            'So in-flight requests are cancelled and retried by the client',
            'So the liveness endpoint can keep reporting the process as alive',
          ], 0, 'Removal from the pool is not instant, so failing readiness first gives the balancer time to stop routing work that the closing server would otherwise refuse.'),
        ]
      ),
            lesson('Schema Migrations on a Live Deploy', 13, `
A rolling deploy replaces four replicas one at a time, so for roughly ninety seconds the old image and the new image are both serving traffic against the same database. Rename \`users.name\` to \`users.full_name\` in a single migration and every request that lands on a replica still running the old code dies with \`column "name" does not exist\`. The migration was correct. The rollout was not.

### Expand, migrate, contract

A rename is three releases, not one.

| Release | Schema change | Application code |
|---|---|---|
| 1 expand | add nullable \`full_name\`, backfill it | write both columns, read \`name\` |
| 2 migrate | none | read \`full_name\`, still write both |
| 3 contract | drop \`name\` | read and write \`full_name\` only |

Each step leaves the previous version of the code working, which is the whole point: you can roll the deployment back at any moment without touching the database. Slow, and boring, and it never wakes anybody up.

### Migrations run once, not once per replica

\`\`\`js
// BUG: this is in the entry file, so every replica runs it
await migrator.up();
app.listen(config.PORT);
\`\`\`

Four containers start within the same second and four processes try to create the same index. Three of them crash, the platform restarts them, and you spend an hour reading application logs for what is really a race between copies of your own boot code. Run migrations as a separate step that finishes before any new replica starts: a Kubernetes init job, a release phase, a \`npm run migrate\` stage in the pipeline.

If they genuinely must run in-process, take a lock first so the other three wait rather than collide.

\`\`\`sql
SELECT pg_advisory_lock(72401);   -- the other processes block here
\`\`\`

### The statement that locks the table

Some DDL is instant and some rewrites forty million rows while holding a lock that every query in the system queues behind.

\`\`\`sql
-- blocks all writes to events for the nine minutes the build takes
CREATE INDEX idx_events_user ON events (user_id);

-- lets writes through, at the cost of a longer build
CREATE INDEX CONCURRENTLY idx_events_user ON events (user_id);
\`\`\`

Adding \`NOT NULL\` to an existing column scans the whole table. Changing a column type rewrites it. Adding a nullable column with a constant default is cheap on modern Postgres, which is exactly why the expand step above is safe.

Then there is the failure nobody predicts. Your \`ALTER TABLE\` waits behind one long-running \`SELECT\` for its exclusive lock, and every query that arrives afterwards queues behind the waiting \`ALTER\`. The table is not locked yet and the API is already timing out. Guard against it:

\`\`\`sql
SET lock_timeout = '3s';
\`\`\`

A migration that cannot get its lock in three seconds should fail and be retried, not hold the door shut.

### Backfill in batches

\`\`\`js
let updated;
do {
  ({ rowCount: updated } = await pool.query(\`
    UPDATE users SET full_name = name
    WHERE id IN (SELECT id FROM users WHERE full_name IS NULL LIMIT 5000)
  \`));
  await sleep(200);
} while (updated > 0);
\`\`\`

One \`UPDATE\` across ten million rows holds a single transaction open for minutes, bloats the table with dead tuples, and blocks autovacuum the entire time. Batches of a few thousand with a short pause let ordinary traffic through, and can be stopped halfway without losing anything.

### Roll back the deployment, not the schema

Down migrations feel responsible and are usually a trap. A \`down\` that drops \`full_name\` destroys everything the new release wrote before you noticed the problem, and it runs at the worst possible moment. Keep migrations additive so the previous image still runs against the new schema, then fix mistakes with a new forward migration.

One rule carries most of this: never ship code and the migration that removes what the previous version reads in the same release.
      `,
        [
          q('A rolling deploy is halfway done when a migration renames users.name to users.full_name, and requests fail intermittently for about a minute. What is happening?', [
            'The connection pool caches the old table definition until it is recycled',
            'The migration ran inside a transaction that has not committed yet',
            'Postgres invalidates prepared statements whenever a column is renamed',
            'Replicas still running the old image query a column that no longer exists',
          ], 3, 'During a rolling deploy both versions of the code serve traffic against one database, so a destructive rename breaks every request handled by a replica that has not been replaced yet.'),
          q('Four replicas each call migrator.up() during boot, and three of them crash on startup. What is the right fix?', [
            'Retry the migration with exponential backoff inside every replica',
            'Run migrations as a separate step that completes before any replica starts',
            'Give each replica its own schema so the migrations cannot collide',
            'Move the call after app.listen so the port is bound first',
          ], 1, 'Migrations are a once-per-release operation, so moving them out of process boot removes the race entirely instead of making the replicas fight more politely.'),
          q('A migration adds an index to a forty million row table and every write to it times out for the duration. Which change keeps the API serving?', [
            'Wrap the CREATE INDEX in an explicit transaction',
            'Raise the statement timeout so the index has time to build',
            'Build it with CREATE INDEX CONCURRENTLY so writes keep flowing',
            'Drop the table\'s other indexes first to speed the build up',
          ], 2, 'A plain CREATE INDEX holds a lock that blocks writes for the whole build, while the concurrent form trades a longer build for a table that stays writable.'),
        ]
      ),
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
        `,
        [
          q('You start the server with --cpu-prof, drive the slow endpoint for a minute, then stop the container with kill -9. The prof directory is empty. Why?', [
            'The profile is only written when the process exits through Node\'s own exit path',
            '--cpu-prof needs --cpu-prof-interval to be set alongside it',
            'Profiles are discarded unless an inspector session is attached',
            'The directory is created only once the first sample has been taken',
          ], 0, 'The profiler flushes its data during a clean shutdown, so a signal that terminates the process immediately leaves nothing on disk and no warning about it.'),
          q('In the flame chart, Router.handle spans eighty percent of the width. Why is that not where the CPU is actually going?', [
            'Width shows how often a frame was sampled, not how long it ran',
            'Framework frames are excluded from self time by DevTools',
            'Width includes everything the frame called, so the cost belongs to a frame below it',
            'Express frames recurse, so the same frame is counted more than once',
          ], 2, 'A wide frame is usually just a caller that was on the stack the whole time, which is why you sort by self time to find the function burning the cycles.'),
          q('A profile blames a synchronous PDF render holding 240 ms of self time. You tune it down to 190 ms. What has that bought you?', [
            'The endpoint now fits inside a normal request budget',
            'Almost nothing, because the loop is still blocked for every other request',
            'The garbage collector gets room to run between requests',
            'Throughput scales with the number of cluster workers again',
          ], 1, 'Any long synchronous block stalls the whole process, so the fix is to move the work to a worker thread rather than to shave a percentage off it.'),
        ]
      ),
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
        `,
        [
          q('The external figure from process.memoryUsage() climbs steadily while heapUsed stays flat. Where do you look first?', [
            'The V8 old space, which is sized independently of the heap',
            'Closures captured by long-lived route handlers',
            'String concatenation inside the structured logger',
            'Buffers: a stream nobody destroyed, or chunks kept in a reachable array',
          ], 3, 'Buffer memory is allocated outside the JavaScript heap and counted as external, so growth there points at binary data being retained rather than at ordinary objects.'),
          q('Why take three heap snapshots and compare the third against the second, rather than reading the largest object in a single snapshot?', [
            'The comparison shows only what was allocated in that window and is still alive',
            'A single snapshot omits objects that native code is holding',
            'DevTools cannot open a snapshot larger than the heap itself',
            'Two snapshots are needed before a major collection will run',
          ], 0, 'The biggest object in one snapshot is usually something legitimate, whereas the delta between two windows of the same traffic isolates exactly what is accumulating.'),
          q('A container capped at 512 MB keeps disappearing with exit code 137 and no JavaScript error. What do you change?', [
            'Call global.gc() on a timer to keep the heap small',
            'Write a heap snapshot on every request to catch the leak',
            'Set --max-old-space-size to roughly 75% of the container limit',
            'Raise the container limit until the process stops dying',
          ], 2, 'V8 sizes its old space from what it believes is available, so telling it the real ceiling makes it collect before the platform kills the process from outside.'),
        ]
      ),
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
        `,
        [
          q('A catch block does throw new AppError(502, err.message) and the incident takes an hour longer than it should. What was thrown away?', [
            'The status code, which the error handler then has to guess',
            'The original stack, so nothing shows where the failure actually started',
            'The message, because AppError overwrites what it is given',
            'The request id, which lived on the original error object',
          ], 1, 'A fresh Error captures the stack at the line that created it, so the frames pointing at the socket timeout underneath are gone unless the original is carried along as cause.'),
          q('Why keep the AsyncLocalStorage store down to ids and flags instead of putting req into it?', [
            'The store is serialised to JSON on every await',
            'Express reuses the same req object between requests',
            'getStore() returns a shallow copy, so req would go stale',
            'Anything that captures the store, such as an interval, then retains the whole request',
          ], 3, 'The store is captured by every callback started inside run(), so a large object in it stays reachable for as long as any of those callbacks live.'),
          q('Every stack frame in production points at dist/server.js line 1. What is missing from the runtime configuration?', [
            '--enable-source-maps, so frames map back to the files you wrote',
            'Error.stackTraceLimit raised above the default of ten frames',
            '--trace-warnings, which attaches a stack to every warning',
            'A child logger, which would name the module for you',
          ], 0, 'Bundled output collapses the whole application into one generated file, and only source map support translates those positions back into your original modules.'),
        ]
      ),
            lesson('Diagnostic Reports and Processes That Refuse to Exit', 13, `
Two failures leave you with nothing to read. The container disappears and the last log line is an ordinary request. Or the opposite: every deploy takes exactly thirty seconds because the process ignores your drain and the platform eventually kills it. In both cases the runtime knows the answer and will write it down if you ask.

### The report Node writes for you

\`\`\`bash
node --report-on-fatalerror \\
     --report-uncaught-exception \\
     --report-directory=/var/log/node \\
     src/server.js
\`\`\`

A diagnostic report is a JSON file holding the JavaScript stack, the native stack, V8 heap statistics, resource usage, the environment, OS limits, and a list of every open libuv handle. On a fatal \`JavaScript heap out of memory\` the process is already past the point where your own handlers can run, so this file is usually the only artifact that survives.

You can also ask for one at any moment:

\`\`\`js
process.on('SIGHUP', () => {
  const file = process.report.writeReport();
  logger.warn({ file }, 'diagnostic report written');
});

// or keep it in the log pipeline instead of on a disk that vanishes with the pod
logger.warn({ report: process.report.getReport() }, 'snapshot');
\`\`\`

Mind the signal. \`--report-on-signal\` listens on \`SIGUSR2\` by default, which is the same signal a heap snapshot handler usually claims, and the two quietly fight over it. \`SIGUSR1\` is worse, because Node uses it to open the inspector. Pick a signal nothing else wants, or trigger the report from an admin route.

### Reading the handle list

The \`libuv\` array is the part people never open, and it answers the question no log can.

\`\`\`bash
jq '.libuv[] | select(.is_active) | {type, is_referenced, details}' report.json
\`\`\`

\`\`\`json
{ "type": "tcp", "is_referenced": true, "details": "192.168.4.11:3000 connected" }
{ "type": "timer", "is_referenced": true, "details": "repeat: 60000, timeout expires in 41120 ms" }
\`\`\`

Anything active and referenced is a reason the process is still alive. A referenced timer with a sixty second repeat is a \`setInterval\` somebody forgot to \`.unref()\`. A referenced tcp handle after \`server.close()\` is the classic drain bug from Chapter 5:

\`\`\`js
server.close(() => process.exit(0));      // waits for open connections
server.closeIdleConnections();            // and this is what actually lets it finish
\`\`\`

\`server.close()\` stops accepting new connections but waits for existing ones, and browsers hold keep-alive sockets open for a minute doing nothing. That is the thirty second deploy: the callback never fires, the hard timeout fires instead, and the exit code is 1 rather than 0 on a perfectly healthy release. Closing idle connections, or setting \`server.keepAliveTimeout\` below your platform's grace period, fixes it.

For a quick check without a report, the runtime exposes the same idea in one line:

\`\`\`js
console.log(process.getActiveResourcesInfo());
// [ 'TCPSocketHandle', 'Timeout', 'Timeout', 'TTYWrap' ]
\`\`\`

### Exit codes name the killer

| Code | Meaning |
|---|---|
| 0 | clean exit, your drain ran |
| 1 | uncaught exception, or an explicit process.exit(1) |
| 130 | SIGINT, someone pressed Ctrl-C |
| 134 | SIGABRT, V8 aborted itself, usually a fatal out of memory |
| 137 | SIGKILL, the kernel or platform killed it from outside |
| 143 | SIGTERM without a handler that exits cleanly |

The pair worth learning is 134 against 137. At 134 the process died from the inside and wrote a report if you enabled one. At 137 it was shot from the outside, nothing ran, and no report exists, so the evidence has to come from the platform: the container memory limit, the OOM killer, a failing liveness probe restarting a process that was merely slow.

Turn all of this on before you need it. A report flag costs nothing while the service is healthy and is the difference between a diagnosis and a shrug at 2 a.m.
      `,
        [
          q('Your SIGTERM handler calls server.close(), yet every deploy still burns the full thirty second grace period before the container is killed. What is holding the process open?', [
            'The connection pool, which refuses to end while a query is queued',
            'The readiness endpoint, which keeps the balancer sending traffic',
            'Idle keep-alive sockets, which server.close() waits for rather than closing',
            'A pending DNS lookup sitting in the libuv thread pool',
          ], 2, 'server.close() stops accepting new connections but waits for existing ones, and a browser keep-alive socket doing nothing still counts as an existing connection.'),
          q('A process dies with exit code 134 and the last log line is an ordinary request. Which flag would have left you something to read?', [
            '--trace-warnings, which attaches a stack to each warning',
            '--report-on-fatalerror, which writes the native stack and handle list',
            '--inspect, so a debugger could have caught the abort',
            '--expose-gc, so heap usage is sampled before the crash',
          ], 1, 'Code 134 means V8 aborted from inside the process, which is past the point where JavaScript handlers run, and the diagnostic report is written by the runtime itself at that moment.'),
          q('A service already writes a heap snapshot on SIGUSR2, and you add --report-on-signal to the start command. What goes wrong?', [
            'Reports and snapshots cannot be written into the same directory',
            'SIGUSR2 is reserved by the platform for container restarts',
            'The report comes out empty because a snapshot pauses the process',
            'Both handlers claim SIGUSR2, so one signal triggers work you did not intend',
          ], 3, 'The report signal defaults to SIGUSR2, which is the same signal the snapshot handler listens on, so a single kill fires both paths and each blocks the process for seconds.'),
        ]
      ),
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
        `,
        [
          q('A dependency comes back from a brief outage and is immediately flattened again by its clients. Which part of the retry policy is missing?', [
            'A cap on the total number of attempts',
            'A shorter timeout on each individual attempt',
            'Random jitter, so retries do not all fire at the same instant',
            'A circuit breaker that stays open for longer',
          ], 2, 'Clients that failed together retry together, so a purely fixed backoff schedules one synchronised wave that arrives the moment the dependency is able to answer.'),
          q('An upstream call returns 422 with a validation message about the payload. What should your client do?', [
            'Stop, because the identical request will fail identically',
            'Retry twice with exponential backoff before giving up',
            'Retry once after reading the Retry-After header',
            'Retry until the circuit breaker trips open',
          ], 0, 'A 422 is a deterministic rejection of what you sent, so repeating it only burns your timeout budget and adds load to a service that is working correctly.'),
          q('A handler opens a database transaction, calls a payment API inside it, and commits afterwards. The provider slows to two seconds per call. What is the damage?', [
            'The transaction is rolled back automatically after one second',
            'Only the payment endpoint slows down, since the rest is unaffected',
            'The provider sees duplicate charges from a retry inside the transaction',
            'Every request holds a row lock and a pooled client for two extra seconds',
          ], 3, 'An open transaction pins one connection from the pool and keeps its locks held, so an upstream stall turns into pool exhaustion and lock contention for unrelated routes.'),
        ]
      ),
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
        `,
        [
          q('A controller adds a welcome email job and then commits the transaction that created the user. The job fails on all five attempts. What happened?', [
            'The queue rejects payloads that reference an uncommitted row',
            'The worker picked the job up before the row was visible to it',
            'The email service rate limits repeated sends to one address',
            'BullMQ retries any job that was added inside an open transaction',
          ], 1, 'Redis and the database know nothing about each other, so a job enqueued before the commit can be dequeued in the window where that user does not exist yet.'),
          q('Why does a job payload carry userId rather than the whole user object?', [
            'Redis rejects payloads larger than sixty four kilobytes',
            'BullMQ cannot serialise nested objects reliably',
            'The worker has no access to the database connection',
            'The copy goes stale the moment anything edits that row, and it bloats the queue',
          ], 3, 'A job may sit in the queue for minutes and be retried for hours, so the worker should re-read current state rather than act on a snapshot taken at enqueue time.'),
          q('A nightly report is scheduled with setInterval inside the API process, which runs as four replicas. What do users get?', [
            'Four copies of the report, one from each replica',
            'One report, because only the primary replica runs timers',
            'No report, because the interval is cleared on every deploy',
            'A report whose contents differ between the replicas',
          ], 0, 'Nothing coordinates timers across processes, so each replica fires its own interval and the work needs a repeatable job holding a lock or a single scheduler process.'),
        ]
      ),
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
        `,
        [
          q('A webhook handler catches every error and answers 200 so the provider stops retrying. What has that actually done?', [
            'Told the provider to retry the event later',
            'Made the endpoint idempotent for repeated deliveries',
            'Told the provider the event was handled, so it is deleted from their queue',
            'Moved the failure into the provider\'s own error budget',
          ], 2, 'The status code is an instruction, and a 2xx means durably accepted, so an event you failed to process is discarded by the sender and never comes back.'),
          q('Why is the timestamp signed together with the body instead of the body alone?', [
            'It lets the receiver order events that arrive out of sequence',
            'Without it, a captured request stays valid forever and can be replayed',
            'It gives timingSafeEqual two buffers of matching length',
            'It identifies which version of the secret signed the request',
          ], 1, 'A signature over the body alone verifies for as long as the secret lives, so binding a timestamp into the digest lets you reject anything outside a short freshness window.'),
          q('subscription.updated arrives before subscription.created for the same subscription. How should the handler cope?', [
            'Key off the event\'s own timestamp, or re-fetch the object from the provider',
            'Reject anything that arrives out of order with a 400',
            'Buffer events for thirty seconds and sort them before applying',
            'Ask the provider to enable ordered delivery for your endpoint',
          ], 0, 'Delivery order is not guaranteed, so state must be derived from data that carries its own ordering rather than from the sequence in which requests happen to land.'),
        ]
      ),
            lesson('Long Running Requests and Job Status', 13, `
A CSV export of four hundred thousand orders takes about forty seconds. The handler awaits it. The load balancer closes any connection idle for thirty, so the user sees a network error, presses the button again, and now two exports are running on a database that was already busy. Nothing in your logs records a failure, because from the server's point of view both requests are still working happily.

### Accept the work, then hand back a receipt

\`\`\`js
router.post('/exports', asyncHandler(async (req, res) => {
  const job = await repo.createExport({ userId: req.user.id, filters: req.valid.body });
  await exportQueue.add('orders', { exportId: job.id });

  res.status(202)
     .location(\`/api/exports/\${job.id}\`)
     .json({ data: { id: job.id, status: 'queued' } });
}));
\`\`\`

\`202 Accepted\` says the request was understood and stored, and the outcome is somewhere else. The \`Location\` header names that somewhere. The client polls it:

| Status | Body |
|---|---|
| \`queued\` | \`{ "status": "queued", "position": 3 }\` |
| \`running\` | \`{ "status": "running", "processed": 180000, "total": 400000 }\` |
| \`succeeded\` | \`{ "status": "succeeded", "url": "/api/exports/8f3/download" }\` |
| \`failed\` | \`{ "status": "failed", "error": "Date range exceeds 2 years" }\` |

The row in \`exports\` is the source of truth, not the queue. Queues expire completed jobs, get flushed, and lose their Redis instance on a bad Tuesday; a table row still says what happened three weeks later, survives a redeploy, and can be read by a user who refreshed the page. Have the worker update \`processed\` every few thousand rows and set the final state in the same transaction that stores the result.

### Polling that does not become the load

Naive polling melts the API it is asking about. Four hundred open tabs at two requests a second is eight hundred requests a second on a status endpoint, and each one is a database read.

\`\`\`js
// client: back off, and respect what the server tells you
let delay = 500;
for (;;) {
  const res = await fetch(url);
  const job = await res.json();
  if (job.status === 'succeeded' || job.status === 'failed') return job;
  delay = Math.min(delay * 1.5, 10_000);
  await sleep(delay);
}
\`\`\`

On the server, send \`Retry-After: 5\` on a pending job so the interval is your decision rather than the client's, and keep the status handler cheap: one indexed read by primary key, no joins.

### Server sent events when live really matters

\`\`\`js
router.get('/exports/:id/events', asyncHandler(async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const beat = setInterval(() => res.write(': ping\\n\\n'), 15_000);
  const off = progress.subscribe(req.params.id, (job) =>
    res.write(\`data: \${JSON.stringify(job)}\\n\\n\`));

  res.on('close', () => { clearInterval(beat); off(); });   // the client left
}));
\`\`\`

Three details decide whether this works. Compression middleware buffers the stream and the browser receives absolutely nothing until the job ends, which is why \`no-transform\` and disabling compression on this route matter. Proxies close a quiet connection after a minute, so the comment heartbeat is load bearing. And every open stream is a held socket plus a subscription, so \`res.on('close')\` is what stops a slow leak of both (Chapter 6).

### Finish the jobs nobody finished

A worker killed mid-export leaves a row saying \`running\` forever, and the user watches a progress bar that will never move. Run a sweeper:

\`\`\`sql
UPDATE exports SET status = 'failed', error = 'Worker died'
WHERE status = 'running' AND heartbeat_at < now() - interval '10 minutes';
\`\`\`

Have the worker touch \`heartbeat_at\` as it goes. An honest failure the user can retry beats a spinner that spins until they give up and open a support ticket.
      `,
        [
          q('A forty second CSV export is awaited inside the request handler, behind a load balancer with a thirty second idle timeout. What is the right change?', [
            'Raise the balancer idle timeout above the slowest known export',
            'Send the CSV with a longer keep-alive timeout on the socket',
            'Move the export onto a worker thread to free the event loop',
            'Answer 202 with a job id, and expose the result as its own resource',
          ], 3, 'Tying a user\'s outcome to one open connection fails on any timeout, refresh, or deploy, whereas a job resource can be polled again from anywhere until it finishes.'),
          q('A server sent events endpoint works locally, but in production the browser receives nothing until the job finishes and the stream closes. What is different?', [
            'The proxy strips the Content-Type header from streamed responses',
            'Production runs several replicas, so the client reaches a different one',
            'Compression middleware buffers the response instead of flushing each event',
            'The heartbeat interval is longer than the browser\'s own read timeout',
          ], 2, 'A compression layer collects output to compress it in blocks, which holds every event until the response ends and turns a live stream into one delayed delivery.'),
          q('A worker is killed mid-export and the row still reads running two days later, so the progress bar never moves. What keeps the UI honest?', [
            'A shorter job timeout configured on the queue',
            'A sweeper that fails rows whose heartbeat has gone stale',
            'Retrying the job whenever the status endpoint is polled',
            'Deleting rows that have no matching job left in Redis',
          ], 1, 'Nothing writes the final state when a process dies mid-job, so a periodic sweep over stale heartbeats is what converts a stuck row into a failure the user can retry.'),
        ]
      ),
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
      chapter(
      'Caching, Limits, and Load Shedding',
      'Serving repeat work from a cache, capping what any single caller can take, and failing small when demand outruns what the process can actually do.',
      [
      lesson('Conditional Requests and Cache Headers', 13, `
A mobile app polls \`GET /api/courses\` every 30 seconds. Forty thousand devices, a 180 KB response, and a catalogue that changes twice a day. That is roughly 240 GB of egress every day to hand clients bytes they already have. Conditional requests turn almost all of it into a 200 byte answer that says nothing changed.

### The 304 handshake

You send a validator, the client sends it back, you compare.

\`\`\`http
GET /api/courses HTTP/1.1
If-None-Match: W/"42-1755993600000"

HTTP/1.1 304 Not Modified
ETag: W/"42-1755993600000"
Cache-Control: private, max-age=0, must-revalidate
\`\`\`

Express computes an ETag for you by hashing the rendered body. That saves bandwidth and nothing else: the query ran, the rows serialised, the JSON was built, and only then did Express discover the client already had it. To save the **work**, derive the validator from something cheap.

\`\`\`js
router.get('/api/courses', asyncHandler(async (req, res) => {
  const { count, updatedAt } = await repo.coursesVersion();   // one indexed aggregate, ~1 ms
  const etag = \`W/"\${count}-\${updatedAt.getTime()}"\`;

  res.set('ETag', etag);
  res.set('Cache-Control', 'private, max-age=0, must-revalidate');
  res.set('Vary', 'Accept-Encoding, Authorization');

  if (req.headers['if-none-match'] === etag) return res.status(304).end();

  res.json({ data: await repo.listCourses() });
}));
\`\`\`

The count is in there on purpose. A deleted row does not move \`MAX(updated_at)\`, so a validator built from the timestamp alone will happily tell forty thousand devices that a course which no longer exists is still current.

Set the headers **before** the comparison. A 304 must carry the same \`ETag\`, \`Cache-Control\` and \`Vary\` it would have carried on a 200, because caches refresh their stored metadata from the 304 itself.

### The directives people get wrong

| Directive | What it actually does |
|---|---|
| \`no-store\` | never written to disk or memory anywhere |
| \`no-cache\` | stored, but revalidated before every reuse |
| \`max-age=60\` | fresh for 60 seconds in any cache |
| \`s-maxage=300\` | overrides \`max-age\`, for shared caches only |
| \`private\` | the browser may store it, a CDN may not |
| \`stale-while-revalidate=300\` | serve stale for 5 more minutes while refreshing behind the scenes |

\`no-cache\` does not mean do not cache. It means do not reuse without asking first. Put it on \`/api/me\` believing you blocked storage and the response, session details and all, is still sitting in a shared proxy. The header you wanted was \`no-store\`.

### Last-Modified has a one second floor

\`Last-Modified\` and \`If-Modified-Since\` carry HTTP dates, so their resolution is one whole second. Edit a course at 12:00:00.100 and again at 12:00:00.800 and the second edit is invisible to every client that revalidated in between, and they keep the intermediate body until something else changes. An ETag built from a row version has no such floor, and when a client sends both validators, \`If-None-Match\` wins.

### Two more that bite

**Compression.** A proxy that gzips after you set the validator is serving a different byte sequence under the same ETag. Send \`Vary: Accept-Encoding\` so a cache never hands a gzipped body to a client that asked for identity, and keep the validator weak (\`W/\`) unless you are certain it is byte exact, because strong ETags are what range requests stitch partial responses together with.

**Authorization.** A shared cache will not store a response to a request that carried an \`Authorization\` header unless you explicitly mark it \`public\`. That default is protecting you. Mark a per user dashboard \`public, s-maxage=60\` behind a CDN and the first customer through the door fills the cache for everyone else. Per user payloads stay \`private\`, always.
      `,
        [
          q('An endpoint returns account details with Cache-Control: no-cache, and the team believes that stops any proxy from keeping a copy. What actually happens?', [
            'Nothing is stored, since no-cache forbids writing the body',
            'The body is stored, and merely revalidated before each reuse',
            'Only the browser stores it, while shared proxies must not',
            'Express strips the body from any response marked no-cache',
          ], 1, 'no-cache permits storage and forbids only reuse without revalidation, so the payload still sits in the cache; no-store is the directive that forbids writing it anywhere.'),
          q('Express generates an ETag automatically, yet the route\'s database time does not drop at all once clients start sending If-None-Match. Why not?', [
            'Weak ETags are ignored by browsers, so the header never returns',
            'Express compares ETags only on routes that set Last-Modified too',
            'A 304 skips the response body but repeats the query afterwards',
            'The ETag hashes the finished body, so the query already ran',
          ], 3, 'The default validator is derived from the rendered response, so the handler has already queried and serialised everything before the comparison happens, which leaves bandwidth as the only saving.'),
          q('A course row is edited twice inside the same second, and clients keep serving the intermediate version for hours. Which validator explains that?', [
            'Last-Modified, whose HTTP date resolution is one whole second',
            'A weak ETag, because weak comparison ignores small changes',
            'If-None-Match, which only matches on the very first request',
            'Vary: Accept-Encoding, which pins the response per encoding',
          ], 0, 'HTTP dates carry no sub second precision, so the second edit produces an identical Last-Modified value and every cache concludes that nothing has changed.'),
        ]
      ),
      lesson('A Shared Cache Without Stampedes', 13, `
A Redis key called \`home:v3\` holds the home page payload with a 60 second TTL. Traffic is 9,000 requests a second. At 14:02:00 the key expires, the query behind it takes 40 milliseconds, and in those 40 milliseconds 360 requests all miss and all run it. The database goes from 4% CPU to pinned, the query stretches to 900 ms, and now 8,100 requests are queued behind it. The cache did not fail. The cache is what caused the outage.

### One refresh, not three hundred

Deduplicate inside the process first. It costs nothing and removes most of the problem:

\`\`\`js
const inflight = new Map();

export function once(key, fn) {
  let p = inflight.get(key);
  if (!p) {
    p = fn().finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return p;                          // 360 callers, one query
}
\`\`\`

Twelve instances now means twelve queries instead of 360, and for most workloads you can stop right there. When a single rebuild is genuinely expensive, add a lock so only one instance does it: \`SET lock:home:v3 <instanceId> NX PX 5000\` returns null for everybody who lost.

### Never let a hot key expire

The real fix is to stop treating expiry as a miss. Store a soft expiry inside the value and set the hard TTL far beyond it:

\`\`\`js
const HARD_TTL = 600, SOFT_MS = 60_000;

export async function cached(key, build) {
  const raw = await redis.get(key);
  if (!raw) return once(key, () => refresh(key, build));            // cold: block

  const entry = JSON.parse(raw);
  if (Date.now() > entry.softAt &&
      await redis.set(\`lock:\${key}\`, '1', 'NX', 'PX', 5000)) {
    once(key, () => refresh(key, build))
      .catch((err) => log.warn({ err, key }, 'background refresh failed'));
  }
  return entry.value;                                               // seconds stale, served in 1 ms
}

async function refresh(key, build) {
  const value = await build();
  await redis.set(key, JSON.stringify({ value, softAt: Date.now() + SOFT_MS }), 'EX', HARD_TTL);
  return value;
}
\`\`\`

Expiry now produces one background refresh instead of a miss storm, and a slow database slows nobody. The price is data up to a minute out of date, which is free for a catalogue page and unacceptable for an account balance. That decision is per key, not per system.

### The TTLs that all end together

Warm 500 keys in a deploy loop with \`EX 300\` and all 500 expire inside the same second, five minutes later. Jitter them: \`300 + Math.floor(Math.random() * 60)\`. It is the same reasoning as retry jitter (Chapter 7), where synchronised clients, not raw load, are what flattens a dependency.

Cache the misses too. A crawler asking for \`/api/users/99999999\` costs a query on every single request forever, because there is nothing to store. Write a tombstone with a 30 second TTL and that traffic drops to two queries a minute.

### A cache hit is not free

Here is the part that surprises people. \`JSON.parse\` on a 400 KB cached blob takes roughly 4 ms, and it is synchronous, so it happens on the one thread that serves everything (Chapter 1). At 2,000 hits a second that is 8 seconds of CPU demanded per second of wall clock: your cache is now the bottleneck the database used to be. Cache small objects rather than whole rendered responses, and prefer many small keys to one enormous one.

### The key is the contract

Every input that changes the answer belongs in the key: tenant, role, locale, page. Miss one and it stops being a staleness bug and becomes a data leak.

| Key | Problem |
|---|---|
| \`orders:page:1\` | no tenant, serves one customer's rows to another |
| \`orders:t42:page:1\` | no version, new code parses the old shape |
| \`orders:v2:t42:page:1\` | safe |
      `,
        [
          q('A key with a 60 second TTL fronts a 40 ms query on a service taking 9,000 requests a second. What happens the instant it expires?', [
            'Redis blocks new readers until one writer refreshes the key',
            'Requests queue on Redis, which serves them once it is rebuilt',
            'Roughly 360 requests all miss and all run the same query',
            'The old value is served while a single refresh runs behind it',
          ], 2, 'Nothing coordinates the readers, so every request arriving during the rebuild window finds an empty key and issues its own copy of the query, which is what flattens the database.'),
          q('A deploy hook warms 500 cache keys in a loop, each written with EX 300. What goes wrong five minutes later?', [
            'All 500 expire together, so one second carries every rebuild',
            'Redis evicts the keys early because they share one expiry time',
            'The keys survive, since EX is reset whenever a key is read',
            'Rebuilds spread out naturally as each key is requested again',
          ], 0, 'Keys written inside the same loop share an expiry instant, so their misses arrive as one synchronised wave instead of spreading across the window.'),
          q('Cache hit rate is 98% and the database is idle, yet p95 latency is worse than before the cache existed. Entries are 400 KB each. What is the likely cause?', [
            'Redis round trips add latency to every one of those hits',
            'The 2% of misses now run against a completely cold buffer pool',
            'Serialising to JSON on write costs more than the query saved',
            'JSON.parse on each hit blocks the loop for several milliseconds',
          ], 3, 'Parsing a 400 KB payload is synchronous work on the single thread that serves every request, so at a high hit rate the deserialisation itself becomes the queueing bottleneck.'),
        ]
      ),
      lesson('Rate Limits, Quotas, and Fair Use', 12, `
Your limit is 100 requests a minute per API key, enforced with a counter that resets on the minute. A client sends 100 requests at 12:00:59 and 100 more at 12:01:00. Both windows are legal, both pass, and you just served 200 requests in one second against a capacity plan that assumed 100. A fixed window does not bound a rate. It bounds a total per bucket, which is not the same thing.

### Four ways to count, and what each costs

| Algorithm | Memory per key | Burst at the boundary |
|---|---|---|
| Fixed window | one integer | up to twice the limit |
| Sliding log | one timestamp per request | none, but 100 entries per key |
| Sliding window counter | two integers | small, a weighted estimate |
| Token bucket | two fields | exactly the bucket size |

Token bucket usually wins for an API, because the burst is a number you picked rather than an accident of clock alignment. Capacity 100 with refill at 100/60 per second means a client that has been quiet may spend 100 at once, then settles to 1.67 a second.

### Read, modify, write is a race

\`\`\`js
const used = Number(await redis.get(key)) || 0;    // broken across 12 instances
if (used >= limit) return res.status(429).end();
await redis.set(key, used + 1, 'EX', 60);
\`\`\`

Two requests on two instances both read 99, both allow, both write 100. Under real load that leaks a steady few percent over the limit, which is precisely when you needed it to hold. Make the whole decision atomic by running it inside Redis:

\`\`\`lua
-- token_bucket.lua   KEYS[1]=bucket   ARGV: capacity, refillPerSec, nowMs, cost
local b = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local cap, rate = tonumber(ARGV[1]), tonumber(ARGV[2])
local now, cost = tonumber(ARGV[3]), tonumber(ARGV[4])
local tokens = tonumber(b[1]) or cap
local ts = tonumber(b[2]) or now
tokens = math.min(cap, tokens + (now - ts) / 1000 * rate)
local ok = tokens >= cost
if ok then tokens = tokens - cost end
redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
redis.call('PEXPIRE', KEYS[1], 120000)
return { ok and 1 or 0, tostring(math.floor(tokens)) }
\`\`\`

A script runs to completion on one Redis node with nothing interleaved, so the read and the write cannot separate. \`INCR\` is atomic too, but it can only build a fixed window.

### Key on who, not on the socket

\`req.ip\` is the load balancer's address unless \`trust proxy\` is set (Chapter 5), and even when correct it is a poor identity. A university, an office, or a mobile carrier NAT is one address shared by thousands of people, so a per IP limit of 60 a minute locks out an entire company the moment one of them opens a spreadsheet integration. Key on the API key or user id, and fall back to IP only where there is no identity yet.

Layer limits rather than picking one:

| Scope | Limit | What it protects |
|---|---|---|
| per key, all routes | 1,000/min | fair use between customers |
| per key, \`POST /exports\` | 5/min | one costly path |
| per IP, \`POST /auth/login\` | 20/min | credential stuffing |
| process wide, in flight | 200 | the box itself |

### Charge by cost, and say so

\`GET /orders/8f3\` and \`GET /orders?limit=500&include=items\` are not one request each. Spend tokens by weight: 1 for a point read, 10 for a search, 50 for an export. Then tell the caller where they stand on every response, not only on the rejection.

\`\`\`http
RateLimit-Limit: 1000
RateLimit-Remaining: 42
RateLimit-Reset: 37
Retry-After: 37
\`\`\`

Two placement mistakes finish the job. A limiter registered after \`express.json()\` and password hashing has already read a 5 MB body and burnt 80 ms of bcrypt before it says no, so put a cheap IP limiter first and the identity based one after auth. And decide deliberately what happens when Redis is unreachable: failing open keeps reads alive through a blip, failing closed protects a login route. Leave it undecided and you get whatever your client library throws, which is a 500 on every request.
      `,
        [
          q('A fixed window limiter allows 100 requests a minute per key. How does a client take 200 in one second without breaking any rule?', [
            'By opening 200 connections, since the counter is per connection',
            'By sending 100 at the end of one window and 100 at the start of the next',
            'By retrying rejected requests, which are not counted a second time',
            'By spreading requests across instances that each hold a counter',
          ], 1, 'The counter resets on the boundary rather than measuring a rolling interval, so two adjacent windows can both be spent in full within a fraction of a second.'),
          q('A limiter reads the counter with GET, compares it, then writes it back with SET. What breaks once twelve instances share that Redis?', [
            'GET returns a string, so the comparison is never numeric',
            'Redis rejects concurrent writes to one key with an error',
            'Two requests read the same value and both spend the last slot',
            'The counter drifts low, so callers are limited too aggressively',
          ], 2, 'The read and the write are separate round trips, so concurrent requests interleave between them and each one allows itself on a value that is already out of date.'),
          q('Where should the cheap per IP limiter sit in an Express stack, and why there?', [
            'Before body parsing, so a rejected 5 MB upload is never read',
            'After body parsing, so the limiter can key on fields in the body',
            'After authentication, so every limit can key on the user id',
            'Inside each route handler, so only that route pays the cost',
          ], 0, 'Any work done ahead of the limiter is work an abusive caller gets for free, so the cheap address based check belongs before body parsing while the identity based limit runs after auth.'),
        ]
      ),
      lesson('Shedding Load Before It Sheds You', 14, `
A service answers 500 requests a second. Traffic arrives at 700. Every second, 200 requests join a queue nothing ever drains, and the process accepts every one of them because \`app.listen\` has no idea what your capacity is. A minute later the queue holds 12,000 requests, the oldest has waited 24 seconds, and every client gave up at 10. The box is at 100% CPU producing answers for sockets that already closed. Useful throughput: zero. That is congestion collapse, and the only cure is refusing work early.

### Refusing is cheap, serving is not

Rejecting a request costs about 0.1 ms. Serving one costs 40. At 700 rps, shedding 200 of them spends 20 ms of CPU a second and buys the other 500 an answer inside their deadline. The trade is not close.

The signal to shed is event loop delay, because that measures the resource which actually runs out (Chapter 6):

\`\`\`js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const loop = monitorEventLoopDelay({ resolution: 20 });
loop.enable();
setInterval(() => loop.reset(), 1_000).unref();

app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/ready') return next();
  if (loop.mean / 1e6 > 100) {
    res.set('Retry-After', '2');
    return res.status(503).json({ error: { code: 'overloaded', message: 'Try again shortly' } });
  }
  next();
});
\`\`\`

Notice the exemption on the first line. Shed your own health check and the orchestrator decides the pod is dead, kills it, and hands its traffic to the survivors, which were already overloaded. That is how one hot instance turns into a whole cluster restarting in a loop.

### Serve the newest request first

Here is the counter intuitive part. Under sustained overload, FIFO is the worst order available, because it serves whoever has waited longest, and those are exactly the callers who already timed out. Every one of them is work delivered to nobody, paid for at full price. Switch to LIFO once the queue is deep and the freshest requests, the only ones still answerable in time, go first. The ones you drop were doomed either way.

Run FIFO while healthy and LIFO while drowning. Fairness matters when everybody gets served. When somebody must be dropped, drop the request that is already dead.

### Deadlines beat timeouts

A timeout says how long you are willing to wait. A deadline says when the answer stops being worth producing, and it travels with the request:

\`\`\`js
const deadline = Number(req.headers['x-deadline-ms']) || Date.now() + 3_000;
const budget = deadline - Date.now();

if (budget < 250) throw new AppError(503, 'Not enough time budget left');   // do not even start
const rows = await repo.search(req.valid.query.q, {
  signal: AbortSignal.timeout(budget - 50),
});
\`\`\`

Starting a 400 ms query with 80 ms of budget left is pure waste: you pay for the whole thing, then throw the result away because the client is gone.

### Bound the concurrency, not just the rate

Rate limits cap arrivals. They say nothing about how many expensive things run at once, so one slow dependency turns an acceptable rate into an unbounded pile of in flight work.

\`\`\`js
const slots = new Semaphore(20);              // at most 20 reports building at a time

router.post('/reports', asyncHandler(async (req, res) => {
  if (!slots.tryAcquire()) {
    return res.status(503).set('Retry-After', '5').json(BUSY);
  }
  try { res.json({ data: await buildReport(req.valid.body) }); }
  finally { slots.release(); }
}));
\`\`\`

\`tryAcquire\` instead of \`await acquire\` is the entire point. Waiting for a free slot rebuilds the very queue you were trying to avoid, just one layer deeper where nothing monitors it.

### Your clients can undo all of it

Shed 200 requests a second and a client retrying three times without jitter turns them into 600 (Chapter 7), so offered load climbs at the exact moment capacity is lowest.

| Response | What a good client does |
|---|---|
| 429 with \`Retry-After\` | wait that long, then retry |
| 503 with \`Retry-After\` | wait, retry, count it against a budget |
| 503 with no header | back off exponentially with jitter |

Cap retries as a fraction of traffic, ten percent being a common budget, and honour \`Retry-After\` instead of treating it as advice.
      `,
        [
          q('A service that handles 500 rps receives 700 rps for a minute with no shedding, and clients time out after 10 seconds. What is the process doing at the end of that minute?', [
            'Sitting idle, because timed out clients released their requests',
            'Doing 500 rps of useful work while 200 rps are rejected cleanly',
            'Waiting on the kernel, which now refuses further connections',
            'Working flat out on requests whose clients have already left',
          ], 3, 'Nothing removes queued work when a client disconnects, so the process spends its entire capacity producing answers that can no longer be delivered to anybody.'),
          q('Why does switching a deep request queue from FIFO to LIFO raise the number of requests answered inside their deadline?', [
            'LIFO reduces the total time each individual request spends queued',
            'The oldest entries have already expired, so serving them helps nobody',
            'LIFO lets the runtime batch similar requests and share their work',
            'Newer requests are cheaper because their caches are still warm',
          ], 1, 'Under sustained overload the front of a FIFO queue is full of requests whose clients have already timed out, so that capacity produces nothing while fresher requests still could be answered.'),
          q('A load shedding middleware returns 503 whenever event loop delay is high, and it applies to /health as well. What does the cluster do?', [
            'Nothing changes, since health checks tolerate occasional failures',
            'Traffic shifts away from the hot pod until its loop recovers',
            'The pod is killed and its load moves onto equally busy neighbours',
            'The orchestrator scales the deployment up to absorb the load',
          ], 2, 'A failing health check reads as a dead process, so the orchestrator restarts it and redistributes its traffic to instances that were already saturated, spreading the overload rather than relieving it.'),
        ]
      ),
      ],
      [
      q('A per user dashboard is served through a CDN with Cache-Control: public, s-maxage=60. What is the consequence?', [
        'One user\'s dashboard is stored and served to everybody else',
        'The CDN refuses to store it because the request had a cookie',
        'Each user gets a private copy, keyed by their session token',
        'The response is revalidated per user before every reuse',
      ], 0, 'public tells shared caches the response is not tied to the caller, so the CDN keeps the first one it sees and hands that body to every later request for the same URL.'),
      q('Which change stops a hot cache key from producing a burst of identical queries every time it expires?', [
        'Shortening the TTL so each rebuild covers less traffic',
        'Lengthening the TTL so the key expires far less often',
        'Storing the value in process memory on each instance instead',
        'Serving the stale value while one holder of a lock refreshes it',
      ], 3, 'Expiry causes a storm only because every reader is forced to rebuild, so keeping a usable stale copy and letting a single lock winner refresh it removes the simultaneous misses.'),
      q('An API rate limits on req.ip behind a load balancer, and trust proxy was never configured. What is the observable effect?', [
        'Each client gets its own bucket, but the counters reset too often',
        'Every request shares one bucket, so all customers throttle together',
        'Limits apply per backend instance rather than per calling client',
        'The limiter never triggers, since the address changes per request',
      ], 1, 'Without trust proxy the only address Express sees is the balancer\'s, so every caller hashes to the same key and the entire user base competes for one allowance.'),
      q('A service starts shedding with plain 503 responses and its offered load promptly triples. What was missing from those responses?', [
        'A larger accept queue so shed requests could wait their turn',
        'A 429 status, which clients treat as final rather than temporary',
        'Retry-After plus a client retry budget, so retries do not multiply',
        'A higher shed threshold, so fewer requests were rejected at once',
      ], 2, 'A bare 503 invites every client to retry at once and repeatedly, so naming a wait time and capping retries as a share of traffic is what stops shedding from amplifying the overload.'),
      ]
    ),
    chapter(
      'The Data Layer at Scale',
      'Reading query plans, sizing pools across many instances, routing reads to replicas, and surviving lock contention once the tables are large.',
      [
      lesson('Reading a Query Plan', 13, `
The endpoint that lists a user's recent notes ran in 38 ms in staging and 4.2 seconds in production. Same code, same index, same query. The only difference was six million rows instead of forty thousand. The plan tells you why in about ten seconds. Guessing tells you nothing in about two days.

### EXPLAIN guesses, EXPLAIN ANALYZE measures

\`EXPLAIN\` prints the planner's intention. \`EXPLAIN (ANALYZE, BUFFERS)\` runs the statement and prints what actually happened. Use the second one, and wrap writes in a transaction you roll back so you are not measuring an \`UPDATE\` into live data.

\`\`\`sql
BEGIN;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM notes
WHERE user_id = 4821 AND created_at > now() - interval '30 days'
ORDER BY created_at DESC
LIMIT 20;
ROLLBACK;
\`\`\`

The slow plan, trimmed:

\`\`\`text
Limit  (cost=248901.12..248901.17 rows=20) (actual time=4176.8..4176.9 rows=20 loops=1)
  ->  Sort  (cost=248901.12..249015.40 rows=45712) (actual time=4176.8..4176.8 rows=20 loops=1)
        Sort Method: top-N heapsort  Memory: 27kB
        ->  Seq Scan on notes  (actual time=0.9..4160.2 rows=38104 loops=1)
              Filter: ((user_id = 4821) AND (created_at > now() - '30 days'::interval))
              Rows Removed by Filter: 5966008
              Buffers: shared read=189422
\`\`\`

Read it inside out. Postgres touched six million rows and threw almost all of them away to find 38 thousand, then sorted those to return 20.

### The four numbers that matter

| Field | What it tells you |
|---|---|
| \`rows=\` against \`actual rows=\` | how wrong the planner's estimate was |
| \`actual time=start..end\` | milliseconds for that node, per loop |
| \`loops=\` | multiply by actual time for the real cost |
| \`Rows Removed by Filter\` | work done to produce nothing |

\`cost=\` is in arbitrary planner units. It is not milliseconds, and comparing costs across two machines means nothing. The estimate gap is the real signal: a plan that expected 12 rows and got 90,000 chose a nested loop that now runs 90,000 times, and that is a statistics problem, fixed by \`ANALYZE\` or a raised statistics target, not by another index.

### Column order in a composite index is not cosmetic

\`\`\`sql
CREATE INDEX CONCURRENTLY notes_user_created
  ON notes (user_id, created_at DESC);
\`\`\`

The same query now reports \`Index Scan using notes_user_created\`, \`actual time=0.02..0.31\`, \`Buffers: shared hit=24\`. Twenty four buffers instead of 189 thousand.

Equality columns first, then the range or sort column. An index on \`(created_at, user_id)\` looks equivalent and is not: it walks the whole 30 day range and rechecks every row for the user. \`CONCURRENTLY\` matters too, since a plain \`CREATE INDEX\` holds a write lock on the table for the duration.

### Why your new index gets ignored

Three causes cover most of it.

- A function wrapping the column. \`WHERE lower(email) = $1\` will never use an index on \`email\`. Build \`CREATE INDEX ON users (lower(email))\` instead.
- A type mismatch. A \`bigint\` column compared against a text parameter forces a cast per row and the index is unusable.
- Low selectivity. If 70 percent of rows match, a sequential scan really is faster and the planner is right to refuse.

### Two lines worth grepping for

\`Sort Method: external merge  Disk: 41792kB\` means the sort spilled to disk because it did not fit in \`work_mem\`. Either raise that memory for the session or add an index that already provides the order.

And deep pagination: \`OFFSET 10000 LIMIT 20\` reads 10,020 rows and discards 10,000 of them, so page 500 is 500 times slower than page 1. Keyset pagination, \`WHERE (created_at, id) < ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20\`, stays flat at any depth because the index seeks straight to the cursor.
      `,
        [
          q('A plan node estimated rows=12 but reports actual rows=90412, and the node above it is a nested loop that is now the slowest part of the query. What is the underlying problem?', [
            'The index on the join column is bloated and needs a rebuild',
            'The nested loop node is never valid above ten thousand rows',
            'The row estimate was badly wrong, so the join type is wrong',
            'The query selects too many columns for the loop to stay fast',
          ], 2, 'A nested loop is a sensible plan for twelve rows and a disaster for ninety thousand, so the repair is better statistics for the planner rather than yet another index.'),
          q('Why does an index on (created_at, user_id) fail to speed up a query filtering on user_id 4821 and the last thirty days, ordered by created_at descending?', [
            'It must scan the whole date range and recheck each row for the user',
            'Postgres cannot use a composite index when a LIMIT clause is present',
            'The descending order makes the second column of any index unusable',
            'An index is used only when every column in it appears in the WHERE',
          ], 0, 'Leading with the range column means the index can only narrow to thirty days of rows for every user, while leading with the equality column seeks straight to that user\'s rows already in date order.'),
          q('A report page uses OFFSET 10000 LIMIT 20 and gets slower with every page, even though the plan shows the intended index being used. Why?', [
            'The planner switches to a sequential scan once the OFFSET is large',
            'Each page re-sorts the table because OFFSET invalidates the sort order',
            'The buffer cache is evicted between pages, so every page reads disk',
            'The database still reads and discards all ten thousand skipped rows',
          ], 3, 'OFFSET is applied after rows have been produced, so the work grows linearly with the page number, which is why keyset pagination carries the last row\'s values in the WHERE clause instead.'),
        ]
      ),
      lesson('Pooling Across Many Instances', 13, `
At 03:10 the autoscaler added four pods and every request in the fleet started failing with \`FATAL: sorry, too many clients already\`. The database CPU sat at 31 percent. It was not busy. It had simply run out of permission slips.

### Do the multiplication before the incident does it for you

Chapter 4 gave you one pool per process. At scale the number that matters is the product:

\`\`\`text
replicas 12  x  cluster workers 4  x  pool.max 10   = 480
worker service    3 x 1 x 5                          =  15
migration job, cron, psql, monitoring                =  10
                                                total = 505
\`\`\`

Against a \`max_connections\` of 100, that fleet was oversubscribed five times over. It worked for months because traffic never opened more than about 80 at once. The autoscaler changed that in one step.

Budget the other way round. Take \`max_connections\`, subtract \`superuser_reserved_connections\` and a handful for migrations and human beings, then divide by the total process count.

\`\`\`js
const totalProcesses = Number(process.env.REPLICAS) * Number(process.env.WEB_CONCURRENCY);
export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: Math.max(2, Math.floor(Number(process.env.DB_CONNECTION_BUDGET) / totalProcesses)),
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 3_000,   // reject fast, never queue forever
  maxLifetimeSeconds: 1_800,        // recycle so a failover does not strand sockets
});
\`\`\`

### More connections make the database slower

This is the counter-intuitive part. Postgres forks an operating system process per connection, several megabytes of private memory each, and every one of them competes for the same CPUs and the same lock manager. Throughput against an 8 vCPU instance peaks somewhere around 20 to 30 concurrently active connections and then falls. Push 400 at it and total throughput drops while every individual query gets slower.

So queueing is not the enemy. Queueing in the right place is the design. Waiting 4 ms for a pooled connection in your Node process is cheap; 400 backends thrashing the database is not.

### The knobs, and what they really control

| Setting | What it decides |
|---|---|
| \`max\` | how many backends this one process can hold |
| \`connectionTimeoutMillis\` | how long a request waits before you shed it |
| \`idleTimeoutMillis\` | how fast the pool shrinks when traffic drops |
| \`pool.waitingCount\` | requests queued right now, your saturation signal |

Export \`totalCount\`, \`idleCount\` and \`waitingCount\` as gauges. A \`waitingCount\` that is nonzero for more than a few seconds means the pool is the bottleneck. The reflex is to raise \`max\`. Resist it: check first whether one slow query is holding connections, because raising \`max\` moves the queue from your process, where it is measurable and boundable, into the database, where it is neither.

\`\`\`js
setInterval(() => {
  metrics.gauge('db.pool.waiting', pool.waitingCount);
  metrics.gauge('db.pool.total', pool.totalCount);
}, 5_000).unref();

process.on('SIGTERM', async () => { await pool.end(); });
\`\`\`

### PgBouncer, and the state it quietly drops

When the process count genuinely has to be large, put PgBouncer in transaction mode in front. Two hundred client connections multiplex onto twenty server connections, because a backend is only borrowed for the length of a transaction.

The catch is everything that lives longer than a transaction. Session state does not survive: \`SET search_path\`, \`LISTEN/NOTIFY\`, temporary tables, session advisory locks and server side named prepared statements all break, because your next statement may land on a different backend. With \`node-postgres\` that means avoiding named prepared statements, and with an ORM it usually means a specific flag such as Prisma's \`pgbouncer=true\`.

Serverless deployments hit the same wall harder: each concurrent invocation is its own process with its own pool, so the connection count tracks concurrency directly and an external pooler stops being optional.
      `,
        [
          q('Twelve replicas each run four cluster workers with a pool max of 10, against a max_connections of 100. Traffic doubles and every request fails with too many clients while database CPU sits at 31 percent. What is the fault?', [
            'The pool leaked connections because release was never called',
            'The fleet can open 480 backends against a server limit of 100',
            'The database needs a much larger shared buffer for that load',
            'Cluster workers share one pool, so the max was set far too low',
          ], 1, 'Pool size is counted per process, so the fleet total is replicas multiplied by workers multiplied by max, and that product has to fit inside the server\'s connection limit.'),
          q('pool.waitingCount sits at 30 through every peak. Why is raising max from 10 to 40 usually the wrong first move?', [
            'The pool ignores max once its connections are already open',
            'Raising max forces every idle connection to reconnect first',
            'Node cannot keep more than sixteen sockets busy per process',
            'It moves the queue into the database, where it costs more',
          ], 3, 'Postgres throughput peaks at a few dozen active backends and then declines, so pushing the contention into the server makes every query slower instead of addressing the slow query that is holding connections.'),
          q('After PgBouncer is put in front of the API in transaction mode, an endpoint that ran SET search_path at connect time starts reading the wrong schema. Why?', [
            'A backend is borrowed per transaction, so session state is lost',
            'Transaction mode strips any statement that is not a plain query',
            'PgBouncer rewrites search_path back to public for every client',
            'The pool opens a brand new connection for each statement sent',
          ], 0, 'In transaction pooling the next statement can land on a different server connection, so anything outliving one transaction, including search_path, temporary tables and named prepared statements, stops being reliable.'),
        ]
      ),
      lesson('Read Replicas and Replication Lag', 13, `
A user renames their workspace, gets a 200, the page reloads, and the old name is still there. They rename it again. Same result. The support ticket says the save button is broken. Nothing is broken: the write went to the primary and the reload was served by a replica that was 380 ms behind.

### Replication is asynchronous, and that is a feature you are paying for

The primary streams its write ahead log to each replica, which replays it. It does not wait for them. That is why replicas cost you almost nothing in write latency, and it is exactly why a read taken immediately after a write can see the world before that write existed.

Measure the lag rather than assuming it:

\`\`\`sql
-- run on the replica
SELECT
  now() - pg_last_xact_replay_timestamp() AS lag_time,
  pg_wal_lsn_diff(pg_last_wal_receive_lsn(), pg_last_wal_replay_lsn()) AS lag_bytes;
\`\`\`

Steady state on a healthy pair is single digit milliseconds. It goes bad in bursts: a nightly batch job writing two million rows, a big \`VACUUM\`, or a long analytics query on the replica itself blocking replay. Lag is spiky, not linear, so a p50 of 3 ms tells you nothing about the 4 second spike at 02:00.

### Route explicitly, never by sniffing the SQL

The tempting shortcut is to send anything starting with \`SELECT\` to a replica. It breaks on the first \`SELECT ... FOR UPDATE\`, on \`SELECT create_invoice(...)\` calling a function that writes, and on any read inside an open transaction. Make the caller state its intent.

\`\`\`js
export const db = {
  write: (text, params) => primary.query(text, params),
  read: async (text, params, { fresh = false } = {}) => {
    if (fresh || (await replicaLagMs()) > 5_000) return primary.query(text, params);
    return replica.query(text, params);
  },
};

await db.read('SELECT id, name FROM workspaces WHERE owner_id = $1', [userId]);
await db.read('SELECT * FROM invoices WHERE id = $1', [id], { fresh: true });
\`\`\`

Default the ambiguous cases to the primary. A read served from the wrong place is correct but slower; a read served from a stale replica is fast and wrong.

### Read your own writes

The rename bug has two standard fixes.

**Session pinning.** After a write, record a timestamp for that user and send their reads to the primary until it passes. Five seconds covers almost every real lag spike.

\`\`\`js
// after any successful mutation
await redis.set(\`fresh:\${userId}\`, '1', 'PX', 5_000);

// in the read path
const mustBeFresh = Boolean(await redis.get(\`fresh:\${req.user.id}\`));
const { rows } = await db.read(sql, params, { fresh: mustBeFresh });
\`\`\`

**LSN waiting.** Capture \`pg_current_wal_lsn()\` when you commit, pass it back to the client, and have the read path check the replica has replayed at least that far. More precise, more plumbing, and worth it only when the pinning window costs you real read capacity.

### What replicas do not buy you

| Problem | Replicas help? |
|---|---|
| Read heavy dashboard traffic | Yes, this is the case they exist for |
| Long analytics queries hurting the API | Yes, isolate them onto their own replica |
| Write throughput at the limit | No, every replica replays every write |
| One badly indexed query | No, you now run it slowly in two places |

A replica also replays writes single threaded by default, so a replica under heavy read load can fall behind precisely when traffic is highest. Alert on lag, health check it in the router as shown above, and fail back to the primary automatically. The failure mode you are avoiding is not an error page. It is quiet, plausible, stale data that nobody reports for a week.
      `,
        [
          q('A user updates their profile, receives a 200, and the next page load shows the old value because reads are routed to a replica. What fixes it without giving up replica reads?', [
            'Turn on synchronous commit so all replicas confirm each write',
            'Invalidate the profile cache entry inside the update handler',
            'Send that user\'s reads to the primary for a few seconds after a write',
            'Retry the read once whenever the returned row version looks old',
          ], 2, 'Pinning only the person who just wrote keeps every other reader on the replica while guaranteeing that user sees their own change, which is exactly the read your own writes problem.'),
          q('A router sends any statement whose text begins with SELECT to a read replica. Which of these queries breaks first?', [
            'SELECT count(*) FROM orders WHERE status = \'paid\'',
            'SELECT * FROM jobs WHERE id = $1 FOR UPDATE',
            'SELECT id, name FROM users ORDER BY created_at DESC',
            'SELECT sum(amount) FROM invoices GROUP BY tenant_id',
          ], 1, 'FOR UPDATE takes a row lock and therefore needs a writable connection, so it fails on a read only standby, which is why the caller should declare intent rather than have it inferred from the SQL text.'),
          q('Write throughput on the primary is already at its limit. What do two additional read replicas change?', [
            'They split incoming writes across three primaries automatically',
            'They halve write latency by sharing the write ahead log volume',
            'They cut primary disk usage by moving old rows onto standbys',
            'They add read capacity and leave write throughput unchanged',
          ], 3, 'Every replica replays the full write stream from the primary, so replication adds places to read from but never reduces the amount of writing the primary itself must do.'),
        ]
      ),
      lesson('Locks, Long Transactions, and Hot Rows', 14, `
Sale day. Checkout p99 goes from 60 ms to 9 seconds. No errors, no CPU, no disk. Database CPU is 14 percent. Four hundred sessions are sitting in \`pg_locks\` waiting on a single row: the inventory record for the one SKU everybody wants.

### A hot row serialises your whole endpoint

An \`UPDATE\` takes a row level exclusive lock and holds it until the transaction commits or rolls back. Everyone else updating that row waits. So the maximum throughput on a contended row is one divided by how long you hold it.

Hold it for 5 ms and that row supports 200 updates per second. Hold it for 800 ms and it supports 1.2, no matter how many pods you add.

\`\`\`js
// Broken: the row is locked across a network call
await client.query('BEGIN');
await client.query('UPDATE inventory SET qty = qty - 1 WHERE sku = $1', [sku]);
const charge = await stripe.charges.create({ amount, source });  // 600 to 900 ms
await client.query('INSERT INTO orders (sku, charge_id) VALUES ($1, $2)', [sku, charge.id]);
await client.query('COMMIT');
\`\`\`

Every one of those 400 sessions is queued behind somebody's payment provider. The fix is structural, not a tuning knob: reserve stock in a short transaction, commit, call the provider outside any transaction, then record the result in a second short transaction. The reservation gives you the thing to reconcile if the charge fails.

### Set the three timeouts today

| Setting | Stops |
|---|---|
| \`statement_timeout\` | one runaway query eating a connection forever |
| \`lock_timeout\` | piling up behind a lock instead of failing fast |
| \`idle_in_transaction_session_timeout\` | an open transaction nobody will ever commit |

The third is the one that bites Node code specifically. A handler runs \`BEGIN\`, awaits something that throws, and the \`catch\` forgets to roll back or the process is killed mid await. That transaction stays open, holds its locks, and blocks \`VACUUM\` from cleaning up dead rows anywhere in the database. Bloat grows, plans degrade, and the cause is one missing \`finally\` from hours earlier.

\`\`\`sql
ALTER ROLE api_user SET statement_timeout = '10s';
ALTER ROLE api_user SET lock_timeout = '3s';
ALTER ROLE api_user SET idle_in_transaction_session_timeout = '15s';
\`\`\`

### Deadlocks are an ordering bug

Two transfers run at once. One updates account 17 then account 42, the other updates 42 then 17. Each holds what the other needs. After \`deadlock_timeout\`, Postgres kills one with SQLSTATE \`40P01\`.

Adding a retry hides it. Locking in a consistent order removes it:

\`\`\`js
const ids = [fromId, toId].sort((a, b) => a - b);   // always ascending
for (const id of ids) {
  await client.query('SELECT 1 FROM accounts WHERE id = $1 FOR UPDATE', [id]);
}
\`\`\`

Any total order works as long as every code path uses the same one. Sorting by primary key is the easiest to review.

### The migration that locks everything

\`ALTER TABLE\` needs an \`ACCESS EXCLUSIVE\` lock. It queues politely behind a 30 second analytics query, and while it waits, every ordinary \`SELECT\` queues behind it. One slow report plus one harmless column addition equals a fully locked table and a total outage.

\`\`\`sql
SET lock_timeout = '2s';
ALTER TABLE notes ADD COLUMN archived_at timestamptz;
\`\`\`

Fail fast and retry rather than block the queue. Adding a nullable column with no default is instant in modern Postgres; adding a \`NOT NULL\` column with a volatile default, or a \`CHECK\` constraint without \`NOT VALID\`, rewrites the whole table under that lock.

### When the row is hot by design

A per tenant counter updated on every request cannot be made faster by shortening transactions alone, because the contention is inherent. Write append only rows and aggregate them, or shard the counter across sixteen rows keyed by \`hashtext(tenant) % 16\` and sum on read. For queue tables, \`SELECT ... FOR UPDATE SKIP LOCKED\` lets ten workers each grab different rows instead of nine of them waiting.
      `,
        [
          q('A checkout handler runs BEGIN, updates one inventory row, awaits an 800 ms payment call, then commits. Roughly what is the ceiling on checkouts per second for that one SKU?', [
            'About one, because the row lock is held for the whole call',
            'About eighty, because the pool allows eighty concurrent writes',
            'Unlimited, because Postgres versions rows instead of locking them',
            'About two hundred, limited only by the payment provider quota',
          ], 0, 'Concurrent updates to the same row serialise on that row\'s lock, so throughput is one divided by the transaction duration, and holding the lock across a network call pins that at roughly one per second.'),
          q('Two transfer transactions update accounts 17 and 42 in opposite orders, and one dies with SQLSTATE 40P01. What is the correct fix?', [
            'Wrap both updates in a single larger transaction per request',
            'Raise deadlock_timeout so the detector runs less aggressively',
            'Retry the failed transaction with exponential backoff and jitter',
            'Lock the rows in one consistent order, such as ascending id',
          ], 3, 'The deadlock exists only because two sessions acquire the same locks in different orders, so imposing one global order on every code path makes the cycle impossible instead of merely survivable.'),
          q('An ALTER TABLE notes ADD COLUMN is issued while a thirty second analytics query is still running on that table. What do ordinary API reads see meanwhile?', [
            'They run normally, since adding a column takes no table lock',
            'They queue behind the ALTER, which is queued behind the report',
            'They fail at once with a lock not available error from the server',
            'They run against the old table definition until the ALTER lands',
          ], 1, 'The ALTER waits for an ACCESS EXCLUSIVE lock and every new lock request queues behind it, so one long running read turns a trivial migration into a full table outage until that read finishes.'),
        ]
      ),
      ],
      [
      q('Which symptom points at the connection budget rather than at a slow query?', [
        'One endpoint is slow while p99 across the rest of the API stays flat',
        'A plan reports Rows Removed by Filter running into the millions',
        'waitingCount is nonzero fleet wide while database CPU stays low',
        'Standby lag climbs to four seconds during the nightly batch job',
      ], 2, 'Requests queueing for pooled connections while the server is barely working means the constraint is how many backends you are allowed to open, not how much work each query performs.'),
      q('You add an index on the email column, and the plan for a lookup on lower(email) still shows a sequential scan. Why?', [
        'The function on the column makes a plain column index unusable',
        'Postgres refuses indexes on text columns above 255 characters',
        'The index needs ANALYZE to run before it can ever be chosen',
        'A parameter placeholder stops the planner from using any index',
      ], 0, 'An index on email stores the raw values, so the planner cannot match it against lower(email), and an expression index built on lower(email) is what makes that lookup indexable.'),
      q('A nightly job writes two million rows. While it runs, the dashboard shows figures from several seconds ago, then catches up. What is happening?', [
        'The pool is recycling connections and losing the newest commits',
        'Replay on the standby is behind, so the replica reads are stale',
        'The index behind the dashboard query is rebuilt during the job',
        'The primary defers commits while a bulk insert is in progress',
      ], 1, 'A burst of write ahead log gives the standby more to replay than it can keep up with, so reads routed there return a consistent but older snapshot until replay catches up.'),
      q('Which change most directly protects the database from a Node handler that opens a transaction and then throws before committing or rolling back?', [
        'Lowering pool.max so fewer transactions can be open at any time',
        'Routing more of the read traffic to a replica during peak hours',
        'Adding a covering index to shorten the transaction\'s own queries',
        'Setting idle_in_transaction_session_timeout on the API database role',
      ], 3, 'That timeout terminates a session sitting inside an open transaction doing nothing, which releases its locks and unblocks vacuum instead of letting the abandoned transaction hold them indefinitely.'),
      ]
    ),
    chapter(
      'Hardening a Public API',
      'Hostile payloads that pass validation, authorisation that holds across tenants, secrets you can actually rotate, and the several hundred packages you did not write.',
      [
      lesson('Hostile Input That Passes Validation', 13, `
Ninety four bytes, and every field matched the schema:

\`\`\`json
{ "theme": "dark", "preferences": { "__proto__": { "isAdmin": true } } }
\`\`\`

\`PATCH /api/settings\` accepts user defined preferences, so that part of the schema is \`z.record(z.unknown())\` and honestly has to be. The handler deep merged the parsed body into the stored document. Twelve minutes later every object created anywhere in the process reported \`isAdmin: true\`, including the ones the authorisation code was building.

### A merge that edits every object in the process

\`JSON.parse\` is not the bug. It creates a plain own property named \`__proto__\` and touches nothing else. The merge is the bug:

\`\`\`js
function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object') {
      target[key] ??= {};
      merge(target[key], source[key]);   // target['__proto__'] hits the setter
    } else {
      target[key] = source[key];
    }
  }
}
\`\`\`

Assignment through \`target['__proto__']\` walks into \`Object.prototype\`, and the change is process wide and permanent until restart. Three defences, cheapest first: refuse the keys \`__proto__\`, \`constructor\` and \`prototype\` before merging, build parsed maps with \`Object.create(null)\`, and start the process with \`node --disable-proto=throw\` so the accessor does not exist at all.

Note that a \`.strict()\` schema would have caught this, because \`Object.keys\` does list \`__proto__\`. Free form objects are exactly where you lose that protection.

### A regex that costs the whole process

This slug rule looks careful:

\`\`\`js
const slug = z.string().max(64).regex(/^([a-z0-9]+-?)+$/);
\`\`\`

The nested quantifier makes the engine try every way to split the input before it gives up:

| Input | Length | Time to fail |
|---|---|---|
| \`quarterly-report\` | 16 | under 1 ms |
| \`aaaaaaaaaaaaaaaaaaaaaaaa!\` | 25 | about 40 ms |
| \`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!\` | 31 | about 2.6 s |

Every extra character roughly doubles it. Node's regex engine backtracks synchronously, so those 2.6 seconds are 2.6 seconds in which no other request in the process is served. Six of them arriving together is an outage.

The \`.max(64)\` does not save you either. Zod runs the string checks it was given and collects every issue rather than stopping at the first, so the pattern still executes against a 50,000 character value. Bound the body at the parser, write the pattern without nested quantifiers (\`/^[a-z0-9]+(-[a-z0-9]+)*$/\`), and for patterns that come from users, use a linear time engine such as \`re2\` instead.

### Valid URLs that point back at you

\`\`\`js
webhookUrl: z.string().url(),
\`\`\`

\`http://169.254.169.254/latest/meta-data/iam/security-credentials/\` is a perfectly valid URL. Fetch it from an EC2 host and hand the body back to the caller and you have posted your instance credentials to a stranger. A blocklist of hostnames loses: \`http://[::ffff:169.254.169.254]\` is the same address, a domain the attacker controls can resolve to it, and a \`302\` after your check redirects you there anyway.

What works is narrower. Allow-list the hosts you actually integrate with, resolve the name yourself and reject private, loopback and link local ranges, set \`redirect: 'error'\` on the fetch, and route outbound calls through an egress proxy that enforces the same rules.

### The type you assumed

\`\`\`text
GET /api/notes?owner[$ne]=null
\`\`\`

Express parses query strings with \`qs\` by default, so \`req.query.owner\` arrives as the object \`{ $ne: null }\`, not a string. Hand that to a Mongo filter and it matches every document in the collection. \`z.string()\` rejects it instantly; \`z.any()\`, or no schema on the query at all, does not. If you never use nested query syntax, \`app.set('query parser', 'simple')\` removes the shape entirely.

Validation proves shape. It does not bound cost, it does not decide meaning, and it has no idea where the value goes next.
      `,
        [
          q('A settings endpoint accepts free form preferences and deep merges the parsed body into a stored document. A request containing a __proto__ key changes behaviour for unrelated users. Which step introduced the flaw?', [
            'JSON.parse, which set the object\'s prototype from that key',
            'The z.record schema, which coerced the nested value',
            'The recursive merge, which assigns through the setter',
            'The serialiser, which walked the prototype chain',
          ], 2, 'JSON.parse only creates a plain own property, so nothing is polluted until code assigns through target[\'__proto__\'], which the recursive merge does and which writes onto Object.prototype for the whole process.'),
          q('A field is declared z.string().max(64).regex(/^([a-z0-9]+-?)+$/) and a 50000 character value freezes the API for seconds. Why did the length limit not prevent it?', [
            'Zod runs every string check and collects issues rather than stopping',
            'The max check counts bytes while the pattern counts code points',
            'Anchored patterns are evaluated before any length constraint',
            'Pattern checks run on a worker thread outside zod\'s control',
          ], 0, 'Zod does not short circuit once one check fails, so the pattern still executes against the full value, and a nested quantifier backtracks exponentially on a long string that cannot match.'),
          q('You block the hostname 169.254.169.254 on a user supplied webhook URL, and instance credentials still leak. Which of these defeats a hostname blocklist?', [
            'A URL longer than the parser\'s maximum length',
            'A body sent with chunked transfer encoding',
            'A scheme of https rather than plain http',
            'A name the attacker controls that resolves there',
          ], 3, 'The check runs on the string while the connection goes to whatever DNS returns, so an attacker controlled domain, an IPv6 mapped form, or a redirect all reach the same address, which is why you resolve the name and reject private ranges.'),
        ]
      ),
      lesson('Authorization and Tenant Isolation', 13, `
The monthly revenue CSV went to the right inbox with the wrong company's numbers in it. The query behind it was four joins deep:

\`\`\`sql
SELECT i.id, i.total, li.sku, li.amount
FROM invoices i
JOIN line_items li ON li.invoice_id = i.id
WHERE i.tenant_id = $1 AND i.issued_at >= $2;
\`\`\`

Correct. The report that broke joined \`line_items\` to \`products\` and filtered on \`invoices.issued_at\` only, because someone rewrote it for speed and dropped the scoping predicate from the outer query. Nothing failed. The numbers just came from everywhere.

### Push the check below the handler

The version that always eventually leaks looks responsible:

\`\`\`js
const note = await db.one('SELECT * FROM notes WHERE id = $1', [id]);
if (note.tenant_id !== req.user.tenantId) throw new AppError(404, 'Not found');
\`\`\`

It works for the first forty queries and fails on the forty first, and the forty first is written at 6pm by someone shipping a hotfix. Make the unscoped question impossible to ask:

\`\`\`js
export const forTenant = (tenantId) => ({
  notes: {
    find: (id) => pool.query(
      'SELECT * FROM notes WHERE id = $1 AND tenant_id = $2', [id, tenantId]),
    list: (limit, offset) => pool.query(
      'SELECT * FROM notes WHERE tenant_id = $1 ORDER BY id LIMIT $2 OFFSET $3',
      [tenantId, limit, offset]),
  },
});
\`\`\`

Handlers receive \`req.repo = forTenant(req.user.tenantId)\` and never see the raw pool. A new method still has to be written correctly, but there is exactly one file to review.

### Row level security, and the pooling trap

Postgres can enforce it beneath your code, which survives even a raw query someone runs from a script:

\`\`\`sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
\`\`\`

\`\`\`js
await client.query('BEGIN');
await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
\`\`\`

That third argument is the whole lesson. \`true\` means local to the transaction. Pass \`false\`, or use plain \`SET\`, and the setting binds to the *connection*, which then goes back to the pool still carrying tenant A's id. The next handler that forgets to set it reads A's rows and gets a clean 200. \`FORCE\` matters too, because the table owner bypasses its own policies by default, and your migration user is usually the owner.

### Where the tenant id goes missing

| Place | What goes wrong |
|---|---|
| Cache keys | \`report:2026-08\` with no tenant serves A's payload to B |
| Background jobs | No request, so nothing scopes the query the worker runs |
| Aggregates | Parent table scoped, joined child table not |
| Object storage | \`/exports/august.csv\` guessable across accounts |
| Search index | One index, and the query filters on text only |
| Support tooling | Built for staff, reachable by anyone who finds the path |

Jobs deserve special care. Put \`tenantId\` in the payload, then build the same scoped repository inside the worker rather than trusting the handler that enqueued it, because a job row is input too.

### The tenant id comes from the token

Reading \`X-Tenant-Id\` from the request and using it is not a subtle bug, it is a login form with no password. Derive the tenant from the session or the signed claims. When a user genuinely belongs to several tenants, let them ask for one, check that membership against the database on every request, and treat the checked value as the only tenant id in scope for the rest of the call.

### Prove it in the test suite

Two fixtures, tenant A and tenant B, and one test per route that authenticates as B and requests A's id:

\`\`\`js
for (const route of protectedRoutes) {
  it(\`\${route.method} \${route.path} hides other tenants\`, async () => {
    await request(app)[route.method](route.path.replace(':id', tenantA.noteId))
      .set('Authorization', \`Bearer \${tenantB.token}\`)
      .expect(404);
  });
}
\`\`\`

Drive it from the route table and a new endpoint without isolation fails the build the day it is added.
      `,
        [
          q('A service sets the tenant with a plain SET app.tenant_id rather than set_config with the local flag inside a transaction. What is the failure once connections are pooled?', [
            'Row level security is skipped entirely for that session',
            'The setting stays on the connection and leaks onward',
            'Every query opens a new connection and drains the pool',
            'The policy compares text against a uuid and errors',
          ], 1, 'A non local setting binds to the connection rather than the transaction, so the client goes back to the pool still carrying the previous tenant id and a later handler that forgets to set it reads that tenant\'s rows.'),
          q('A nightly worker builds each customer report from a job payload that carries only a report id. Why is that a tenant isolation risk?', [
            'Workers connect as a different database user than the API',
            'A job payload cannot be validated the way a body can',
            'Queued jobs are retried, so the report is built twice',
            'There is no request, so nothing scopes the worker\'s queries',
          ], 3, 'Scoping normally rides on the authenticated request, and a worker has none, so the payload has to carry the tenant id and the worker has to build the same scoped repository before it queries anything.'),
          q('An API reads the tenant from an X-Tenant-Id request header because the front end already knows the value. What does that allow?', [
            'Any authenticated caller to read another tenant\'s data',
            'Proxies to cache one tenant\'s response for another',
            'A load balancer to strip the header before routing',
            'Requests to slip past the JSON body size limit',
          ], 0, 'A client supplied header is input like any other, so anyone who edits it becomes whichever tenant they name, which is why the tenant has to come from the session or signed claims and be checked against membership.'),
        ]
      ),
      lesson('Secrets, Keys, and Rotation', 13, `
At 14:02 someone replaced \`JWT_SECRET\` in the secret manager and restarted the API. Every access token issued in the previous fifteen minutes stopped verifying at once, the mobile clients hammered the refresh endpoint with refresh tokens signed by the old key, and the support queue took 400 tickets in nine minutes. The rotation itself was correct. The system just had no way to hold two keys at the same time.

That is the rule worth carrying out of here: a secret you cannot rotate without an outage is a secret nobody will ever rotate. Which means it stays in place for four years, through three team changes and one laptop theft.

### Sign with one key, verify with a set

\`\`\`js
const KEYS = Object.assign(Object.create(null), {
  '2026-08': process.env.JWT_KEY_2026_08,
  '2026-05': process.env.JWT_KEY_2026_05,
});
const ACTIVE = '2026-08';

const token = jwt.sign(payload, KEYS[ACTIVE], {
  algorithm: 'HS256', keyid: ACTIVE, expiresIn: '15m',
});

const claims = jwt.verify(token, (header, cb) => {
  const key = KEYS[header.kid];
  cb(key ? null : new Error('unknown kid'), key);
}, { algorithms: ['HS256'] });
\`\`\`

Two details in there are load bearing. \`algorithms: ['HS256']\` must be passed explicitly, because a verifier that lets the token pick its own algorithm accepts \`alg: none\`, and accepts an HS256 token signed with your public RSA key when you thought you were doing RS256. And \`KEYS\` is built on a null prototype: a token claiming \`kid: "constructor"\` against a plain object hands your callback a function rather than \`undefined\`, which is the previous topic showing up in an unexpected place.

### The rotation runbook

| Step | What it changes | How long to wait |
|---|---|---|
| 1 | New key deployed to the verify set only | until every instance has restarted |
| 2 | Signing switches to the new kid | one deploy |
| 3 | Old key still verifying | the longest token lifetime, plus slack |
| 4 | Old key removed, alert if any kid misses | done |

The 14:02 outage skipped step 1. Webhook secrets follow the same shape: verify the body against the current secret and the previous one, accept if either matches, and remove the old one after the provider's retry window closes.

### Secrets leak where you are not looking

Environment variables keep a secret out of git, which is where chapter 5 left it. They do not keep it out of these:

- Logs. Redact by path (\`redact: ['req.headers.authorization', 'req.body.password', 'res.headers["set-cookie"]']\`) rather than hoping.
- Error objects. Several database drivers put the full connection string, password included, into the message of a connection failure that you then log at error level.
- Child processes. They inherit \`process.env\`, and a shelled out \`curl -H "Authorization: Bearer $TOKEN"\` shows the token in \`ps\` output to every user on the box.
- Image layers. A secret passed as a Docker build \`ARG\` is visible forever in \`docker history\`.
- Any route that dumps configuration for debugging.

### Prefer credentials that expire on their own

Rotation you perform by hand happens once. Rotation the platform performs happens hourly. A database broker that issues a username and password with a 60 minute lease, or cloud OIDC federation in CI so the pipeline holds no stored key at all, removes the secret rather than scheduling maintenance on it.

One catch when you get there: \`const KEY = process.env.SIGNING_KEY\` at module scope is read once, at import, and a long lived process never sees the new value. Fetch from the secret manager through a small cache with a TTL shorter than the rotation interval, and make sure the verify set refreshes before the signing key moves.

### When one actually leaks

Order the response: revoke first, rotate second, investigate third. Removing the commit does nothing, because the history is already cloned, and the credential was scraped by a bot within minutes of the push. Assume every token that key ever signed is live, and end those sessions too.
      `,
        [
          q('A team replaces the JWT signing secret and restarts every instance at once, and existing sessions break immediately. Which step of the rotation was skipped?', [
            'Shortening the access token lifetime before the change',
            'Restarting instances one at a time rather than together',
            'Recording the new secret in the deployment changelog',
            'Shipping the new key to the verify set before signing',
          ], 3, 'Rotation avoids an outage only when both keys verify for at least one token lifetime, so the new key has to reach every verifier first and the signing key moves afterwards.'),
          q('Why must jwt.verify be given an explicit algorithms list rather than letting the token\'s own header decide?', [
            'Otherwise the kid header is ignored during key lookup',
            'A token can claim alg none, or swap RS256 for HS256',
            'The library defaults to a slower algorithm than HS256',
            'Expiry is only checked when the algorithm is pinned',
          ], 1, 'Trusting the token\'s header lets an attacker present an unsigned token, or force the verifier to treat your public RSA key as an HMAC secret, so the accepted algorithms have to be fixed by the server.'),
          q('A long running API caches its signing key in a module level const read from process.env. What happens after the platform rotates that secret?', [
            'New tokens are signed without any kid header at all',
            'The process crashes the next time it signs a token',
            'The process keeps using the old key until it restarts',
            'Verification works but expiry is calculated wrongly',
          ], 2, 'Module scope is evaluated once at import, so a running process never observes the new value and keeps signing with a key the rest of the system is about to retire, which is why the key needs a cache with a TTL shorter than the rotation interval.'),
        ]
      ),
      lesson('The Dependencies You Did Not Write', 13, `
Run \`npm ci\` on a plain Express API with zod, pino and a Postgres driver and count what lands in \`node_modules\`. It is around 200 packages. Add a test runner, a linter and a bundler and you are past 600, from several hundred separate publishers, any of whom can push a new patch version tonight. Chapter 1's habit of committing the lockfile and installing with \`npm ci\` is the floor here, not the ceiling.

### Installing is running

Every package may declare \`preinstall\`, \`install\` and \`postinstall\` scripts, and npm executes them as whatever user runs the install. On a CI runner that user usually holds your deploy credentials, your registry token and a network path to production. A compromised maintainer account does not need your code to do anything; it needs your build to run once.

\`\`\`ini
# .npmrc, committed
ignore-scripts=true
fund=false
\`\`\`

Then rebuild the handful that genuinely need it, explicitly:

\`\`\`bash
npm ci
npm rebuild sharp
\`\`\`

The cost is real: native modules such as \`sharp\` or \`bcrypt\` will not build without their scripts. Half the time the answer is a pure JavaScript or prebuilt alternative, and the other half you accept two named exceptions instead of six hundred silent ones.

### The lockfile is the only version you have

\`"express": "^4.19.2"\` is a range. The lockfile pins the resolved version plus an integrity hash for every package in the tree, which is why \`npm ci\` is reproducible and \`npm install\` is not. Two habits on top of that:

\`\`\`json
{
  "overrides": { "tar-fs": "3.0.6" }
}
\`\`\`

\`overrides\` forces a fixed version of a transitive package whose parent has not shipped a fix yet, which beats waiting on someone else's release cycle. And treat brand new versions as unproven: most malicious publishes are caught and unpublished within a day or two, so a policy of not adopting anything younger than a week costs nothing and dodges the entire window.

### Audit output is a list of advisories, not a list of your risks

Fourteen "high" findings on a Friday afternoon is how teams learn to ignore the tool. Sort by whether the code is reachable from a request:

| Advisory | Where it runs | Exposed |
|---|---|---|
| ReDoS in a CLI table formatter, dev only | build machine | no |
| Prototype pollution in a deep merge used by a body parser | every PATCH | yes |
| Path traversal in a tar extractor you call on uploads | upload route | yes |
| Command injection in a package nothing imports | nowhere | no |

Fix the reachable ones today and schedule the rest. Resist \`npm audit fix --force\`, which happily bumps a major version and breaks the build, because that is the change that makes people stop running audit at all.

The gotcha worth remembering: audit compares your tree against published advisories. A malicious version uploaded four hours ago has no advisory, so the report says zero vulnerabilities with total confidence.

### Shrink what ships, contain what runs

- \`npm ci --omit=dev\` in the runtime image. Your test runner is not a production dependency and every package you do not install cannot run.
- A multi stage build so the final image carries no package manager and no compiler.
- Run as a non root user on a read only filesystem, with \`/tmp\` as the only writable mount.
- Restrict egress. A stolen registry token is close to worthless if the process cannot open a connection to anywhere you did not allow.
- On Node 22 and newer, \`node --permission --allow-fs-read=/app --allow-fs-write=/tmp server.js\` stops a dependency from reading \`/root/.aws/credentials\` even when it is running inside your process.

### Before you add one

\`\`\`bash
npm view chalk dependencies      # what comes with it
npm ls semver                    # who already pulled this in
\`\`\`

Weekly download counts say nothing about whether anyone still maintains it. Check the last publish date, the open advisories, and whether \`node:crypto\`, \`node:fs/promises\` or \`Intl\` already does the job. Forty lines you own and can read beat a subtree you will never audit.
      `,
        [
          q('Why does setting ignore-scripts=true in .npmrc reduce supply chain risk more than pinning versions alone does?', [
            'It stops packages executing code while they install',
            'It prevents transitive packages from being installed',
            'It makes npm verify each integrity hash a second time',
            'It stops the registry resolving unpublished versions',
          ], 0, 'Lifecycle scripts run as the user performing the install, which on a build runner holds deploy credentials and registry tokens, so refusing to run them removes code execution from the act of installing.'),
          q('npm audit reports zero vulnerabilities on a tree that already contains a version published four hours ago with a backdoor in it. Why?', [
            'Audit inspects direct dependencies but never transitive ones',
            'The integrity hash in the lockfile suppresses the warning',
            'Audit matches your tree against advisories that already exist',
            'Audit skips any version released within the last day',
          ], 2, 'The tool is a lookup against a database of reported advisories, so a malicious release nobody has reported yet looks exactly like a clean one, which is the argument for not adopting brand new versions immediately.'),
          q('Four advisories land in one tree on the same morning. Which of them deserves to be fixed before the others?', [
            'A backtracking pattern in a formatter used only at build time',
            'Prototype pollution in a merge library on the request path',
            'Command injection in a package that nothing in the app imports',
            'A weak default in a package pinned by an unused override',
          ], 1, 'Severity labels say nothing about exposure, so triage by whether a request can reach the code, and a pollution bug in a library that parses every PATCH body is reachable by anyone on the internet.'),
        ]
      ),
      ],
      [
      q('A payload passes a strict schema, carries only declared fields of the right types, and still causes an incident. Which explanation fits?', [
        'The schema rejected unknown keys, so coercion never ran',
        'Strict schemas skip validation of nested arrays by design',
        'Type checks are applied after the handler reads the body',
        'Shape says nothing about cost, meaning, or destination',
      ], 3, 'A schema proves the structure of a value, while a backtracking pattern, a server side fetch of a user supplied URL, and an unscoped merge each take a well formed value and turn it into a failure.'),
      q('Which change makes a cross tenant leak least likely in a codebase that many people change every week?', [
        'Scoping in a repository that handlers cannot bypass',
        'A code review checklist item about tenant filters',
        'Returning 404 rather than 403 on a tenant mismatch',
        'Logging the tenant id alongside every database query',
      ], 0, 'Checks written per handler fail on the one handler somebody forgets, so the durable fix is making the unscoped query impossible to express, with row level security underneath as a second line.'),
      q('What is the practical consequence of a design in which only one signing key can be valid at any moment?', [
        'Tokens must carry a kid header to be verified at all',
        'The key never gets rotated, because rotating logs everyone out',
        'Verification cost grows with the number of retired keys',
        'Refresh tokens have to be stored on the client instead',
      ], 1, 'Rotation that causes an outage is rotation that gets postponed forever, so the key stays in place through team changes and lost laptops, which is exactly the risk rotation was meant to remove.'),
      q('A dependency inside your runtime image tries to read /root/.aws/credentials while serving a request. Which measure actually stops it?', [
        'Committing the lockfile and installing with npm ci',
        'Running npm audit on every pull request build',
        'Starting Node with the permission model and fs allowances',
        'Moving that package from dependencies to devDependencies',
      ], 2, 'Pinning and auditing lower the chance of shipping bad code, but only a runtime restriction such as the permission model, a non root user, or a read only filesystem denies the read once the code is already executing.'),
      ]
    ),
    chapter(
      'Tracing, Metrics, and Service Levels',
      'Following one request across services, measuring what users actually feel rather than what the box reports, and running the incident when those numbers go bad.',
      [
      lesson('Tracing a Request Across Services', 14, `
The checkout endpoint's p99 is 4.2 seconds. Your own logs say the handler finished in 90 ms. Both numbers are true, and neither tells you where the other four seconds went, because that request crossed an edge service, your API, a queue, and a payment provider before the browser saw anything.

A trace is the missing picture: one request, every hop, drawn as a tree.

### A trace is a tree of spans sharing one id

A **span** is a named interval: start time, end time, a parent span id, and a bag of attributes. A **trace** is every span carrying the same trace id. The edge opens the root span, and everything it calls opens a child.

The whole tree travels in one header. W3C \`traceparent\` looks like this:

\`\`\`text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^  ^                                ^                ^
        version  32 hex trace id                 16 hex span id   flags (01 = sampled)
\`\`\`

Chapter 6 carried a request id through async work with \`AsyncLocalStorage\` and forwarded it on outbound calls. This is that idea with an agreed format, so the service on the other end, which is not yours and is written in Go, can join your tree instead of starting its own.

### Start the SDK before the modules it needs to patch

\`\`\`js
// instrument.mjs
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

new NodeSDK({
  serviceName: 'orders-api',
  instrumentations: [getNodeAutoInstrumentations()],
}).start();
\`\`\`

\`\`\`bash
node --import ./instrument.mjs src/server.js
\`\`\`

Auto instrumentation works by monkey patching modules as they load: \`http\`, \`express\`, \`pg\`, \`ioredis\`. Import order therefore decides whether it works at all.

\`\`\`js
// server.js: produces traces with exactly one span, and nobody can see why
import express from 'express';   // already loaded, already unpatched
import './instrument.js';        // too late for everything above
\`\`\`

That is the single most common "tracing is not working" report. The \`--import\` flag fixes it because the SDK runs before your first application import.

### The spans you still have to write

Auto instrumentation sees I/O. It cannot see the 900 ms you spend turning 40,000 rows into a PDF.

\`\`\`js
import { trace } from '@opentelemetry/api';
const tracer = trace.getTracer('orders');

await tracer.startActiveSpan('render-invoice-pdf', async (span) => {
  span.setAttribute('order.id', order.id);
  span.setAttribute('order.line_count', lines.length);
  try {
    return await render(lines);
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: 2 });   // ERROR
    throw err;
  } finally {
    span.end();
  }
});
\`\`\`

Attributes are where traces beat every other signal. \`order.id\`, \`tenant.id\`, and \`user.plan\` are all welcome here. High cardinality is a trace's job, and the next topic explains why the same values would wreck a metric.

### Two places the tree quietly breaks

**Queues.** A job enqueued during a request and run forty seconds later in a worker (Chapter 7) starts a fresh root trace unless you carry the context yourself.

\`\`\`js
// producer
const carrier = {};
propagation.inject(context.active(), carrier);      // { traceparent: '00-...' }
await emailQueue.add('receipt', { orderId, carrier });

// worker
const ctx = propagation.extract(context.active(), job.data.carrier);
context.with(ctx, () => handle(job));
\`\`\`

**Sampling.** If every service rolls its own dice at 10 percent, you collect fragments: a child kept whose parent was dropped, a gap in the middle of a tree. Decide at the edge and honour the incoming flag everywhere else, which is what a parent based sampler does by default.

The volume is worth respecting. At 5,000 requests per second and 14 spans each, that is 70,000 spans per second, and at roughly 500 bytes a span it is 35 MB every second before compression. Sample hard at the edge, then let a collector's tail sampler keep 100 percent of traces that carry an error or breach your latency target.

One last habit that pays for itself during an incident: put the active trace id into every log line, next to the request id from Chapter 5. A grep then lands you in the exact waterfall instead of the right neighbourhood.
      `,
        [
          q('Auto instrumentation is installed and the collector is receiving data, but every trace from the API contains exactly one span covering the whole request. What explains it?', [
            'The sampler is set to 10 percent, so child spans are dropped',
            'Incoming requests carry no traceparent header to attach to',
            'The SDK started after express and pg were imported, so nothing got patched',
            'The service name is unset, so children are grouped under the wrong tree',
          ], 2, 'Auto instrumentation patches modules as they load, so any module imported before the SDK starts keeps its original unwrapped functions and never emits a span.'),
          q('A request enqueues a receipt job, and the worker\'s spans arrive as their own root traces with no link back to the request that created the job. What is missing?', [
            'Trace context injected into the job payload and extracted in the worker',
            'A longer span export timeout configured on the worker process',
            'The same service name set on both the producer and the worker',
            'A single shared collector endpoint used by both processes',
          ], 0, 'A queue breaks the in process async chain, so the parent trace and span ids only survive if you serialise them into the job data and restore them before the handler runs.'),
          q('Each of four services in a call chain makes its own independent random sampling decision at 10 percent. What do you end up with?', [
            'Ten percent of traces, each one complete from edge to database',
            'Complete traces, but with span ids that collide between services',
            'Every trace retained, since one sampled service forces the rest',
            'Fragments, because a service can keep a span whose parent was dropped',
          ], 3, 'Independent dice mean the keep decisions do not line up, so you collect orphaned children and gaps in the middle of trees instead of whole request trees.'),
        ]
      ),
      lesson('Metrics That Answer Questions', 13, `
Mean response time on the dashboard: 60 ms. In the inbox: a screenshot of a spinner. Both are honest. Take 100 requests where 99 finish in 20 ms and one takes four seconds, and the average is 60 ms. The average hid the only request anybody complained about.

Pick instruments that can answer the question you will actually ask at 3 a.m.

### Four instruments, four kinds of question

| Instrument | Holds | Good for |
|---|---|---|
| Counter | a number that only goes up | requests, errors, retries, jobs done |
| Gauge | a value right now | pool connections in use, queue depth, loop lag |
| Histogram | counts per bucket | latency, payload size, batch size |
| Up/down counter | a number that moves both ways | in flight requests, open sockets |

Counters look wrong until you understand that you never read them directly. You read \`rate(orders_created_total[5m])\` at query time, and the query engine handles the restart to zero. Export a \`requests_per_second\` gauge you compute yourself and you have destroyed information: it cannot be re-aggregated across pods, and it lies for one scrape after every deploy.

### Histograms answer "how many were slow"

\`\`\`js
import client from 'prom-client';

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],   // 0.3 is the SLO edge
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path ?? 'unmatched', status: res.statusCode });
  });
  next();
});
\`\`\`

Two traps live in that block. The first is bucket choice: prom-client's defaults stop at 10 seconds, so on a route that sometimes takes 30 seconds everything slow piles into \`+Inf\` and your p99 is reported as "greater than 10", forever. Put a bucket edge exactly where your objective sits.

The second is that **percentiles do not average**. Pod A at p99 300 ms and pod B at p99 900 ms does not make a fleet p99 of 600 ms. You have to sum the buckets first:

\`\`\`promql
histogram_quantile(0.99, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m])))
\`\`\`

### Labels multiply, so spend them like money

\`\`\`js
// broken: req.path is /orders/8813, /orders/8814, /orders/8815 ...
end({ method: req.method, route: req.path, status: res.statusCode });
\`\`\`

Series count is the product of label value counts. Every order id creates its own series, and each histogram series is one time series per bucket, so 200,000 orders becomes millions of series. The scrape target's memory climbs first, the time series database falls over second, and neither failure names the label that caused it. Using \`req.route?.path\` gives you \`/orders/:id\`: one series, all the information you needed.

Keep every label under a few hundred distinct values. No user ids, no request ids, no full URLs, no error messages. Those are trace attributes and log fields, which is exactly why the previous topic exists.

### RED, plus the one people forget

Rate, errors, and duration per route tell you what users feel. Saturation tells you how close you are to the wall: pool connections in use over pool size, queue depth, and the event loop lag from Chapter 1 exported as a gauge. Latency rises slowly and then vertically; saturation is what warns you before the knee.

### Cluster hides half your data

Chapter 5's \`cluster\` setup gives every worker its own registry, so a scrape of \`/metrics\` returns whatever the worker that won the accept happens to know. Four workers, four different answers, and none of them the truth.

\`\`\`js
const aggregator = new client.AggregatorRegistry();
// in the primary only
app.get('/metrics', async (req, res) => {
  res.type(client.register.contentType).send(await aggregator.clusterMetrics());
});
\`\`\`

Same problem, same shape, whenever you run more than one process per host.
      `,
        [
          q('A dashboard shows the mean of the p99 latency reported by each of eight API pods. Why is that number meaningless?', [
            'The pods scrape on different schedules, so the samples are stale',
            'Percentiles cannot be averaged, so the buckets must be summed first',
            'A histogram keeps only the newest observation in each bucket',
            'The pods serve different routes, so their label sets do not match',
          ], 1, 'A percentile is a position in a distribution rather than a quantity, so the fleet figure has to be recomputed from the summed bucket counts across all pods.'),
          q('A latency histogram is labelled with req.path, and a week after launch the time series database starts falling over. What happened?', [
            'The histogram retains every observation, so memory grows with traffic',
            'Path labels are rejected by the scrape and retried indefinitely',
            'The finish event fires twice per request, doubling every counter',
            'Every order id produced its own series, one for each bucket',
          ], 3, 'Series count is the product of label value counts, so a label holding raw ids multiplies by the bucket count and turns one metric into millions of series.'),
          q('prom-client\'s default buckets are left in place on a route that sometimes takes 30 seconds, and the team needs its 99th percentile. What breaks?', [
            'Everything past ten seconds falls into +Inf, so the p99 is unknowable',
            'Observations past ten seconds are discarded, so the count is wrong',
            'The histogram silently degrades into a summary above that range',
            'The rate function returns zero once a bucket stops incrementing',
          ], 0, 'The default bucket edges stop at ten seconds, so every slower request is only known to be somewhere above that and no quantile in the tail can be estimated.'),
        ]
      ),
      lesson('Service Level Objectives and Error Budgets', 13, `
Someone in the meeting says "let's target four nines". Here is what they just signed up for, per 30 day month:

| Target | Allowed bad time | Feels like |
|---|---|---|
| 99% | 7 h 12 m | one bad afternoon a month |
| 99.9% | 43 m 12 s | one bad deploy a month |
| 99.95% | 21 m 36 s | you must roll back in minutes |
| 99.99% | 4 m 19 s | no human is in the loop |

Four nines means a person cannot read the page, open a laptop, and decide anything. Everything that matters has to be automatic. That is a staffing and architecture decision disguised as a percentage.

### An SLI is a ratio of good events to valid events

"The API is up" is not measurable. This is:

> the proportion of GET and POST requests to \`/v1/orders*\`, excluding health checks, that return a non 5xx status within 300 ms, measured at the load balancer.

Every clause is doing work. Which requests count. What good means. And crucially where you measure: a request that died inside the load balancer never reached your process, so server side metrics score it as though it never existed, while the user watched it fail. Measure as close to the user as you can reach.

Notice the latency half is written as a proportion, not a percentile. That is deliberate, and it is the payoff from the previous topic: counts add up across instances and percentiles do not.

\`\`\`promql
sum(rate(http_request_duration_seconds_bucket{route=~"/v1/orders.*", le="0.3", status!~"5.."}[28d]))
/
sum(rate(http_request_duration_seconds_count{route=~"/v1/orders.*"}[28d]))
\`\`\`

### The error budget is the interesting half

An SLO of 99.9% over 28 days does not say "do not fail". It says you may fail 0.1% of the time and nobody will complain. On 20 million requests that is 20,000 permitted failures, which is a real allowance you can spend on risky deploys, migrations, and load tests.

**Burn rate** is how fast you are spending it, where 1 means exactly on schedule and the budget runs out precisely at the end of the window. Alert on burn rate, not on raw thresholds:

| Budget burned | Long window | Short window | Burn rate | Action |
|---|---|---|---|---|
| 2% | 1 hour | 5 min | 14.4 | page someone |
| 5% | 6 hours | 30 min | 6 | page someone |
| 10% | 3 days | 6 hours | 1 | file a ticket |

The short window is there so a page stops firing once the incident has actually ended, instead of ringing for the next hour because the long window still remembers.

Compare that to the alert most teams start with: p99 latency above 500 ms for two minutes. It fires during cache warmup, during a batch job, at every deploy. Nobody was harmed, so everybody learns to swipe it away, and then the alert that mattered arrives at 4 a.m. and gets the same swipe. A burn rate alert scales with damage: a small blip never pages, and a real outage pages in minutes.

### The ceiling you did not set

Checkout calls a payment provider synchronously on every request. The provider publishes 99.9%. Your checkout SLO cannot beat 99.9%, no matter how good your code is, because their bad minutes are automatically yours. You have three honest options: lower the target, take the call off the critical path (accept the order, confirm payment asynchronously), or degrade gracefully when the provider is down. Multiply dependencies and it gets worse: three 99.9% dependencies in series is roughly 99.7%.

### A budget with no consequence is a wall chart

Write the policy down before you need it: when the budget for the window is spent, feature work stops and reliability work starts until the window rolls forward. When there is budget to spare, ship faster and take the risk, because an unspent budget means you are shipping too slowly for the reliability you are paying for.
      `,
        [
          q('A service on a 30 day availability SLO burns 5 percent of its error budget in a single hour. What is the burn rate, and what does it imply?', [
            '0.05x, and the budget comfortably outlasts the window',
            '5x, and the budget is exhausted in roughly six days',
            '12x, and the budget is exhausted in about two and a half days',
            '36x, and the budget is gone in a little under a day',
          ], 3, 'An hour is one seven hundred and twentieth of a 30 day window, so spending 5 percent of the budget in it is 36 times the sustainable rate and empties the budget in 20 hours.'),
          q('Checkout calls a payment provider synchronously on every request, and that provider publishes a 99.9 percent availability target. What does that mean for a proposed 99.99 percent checkout SLO?', [
            'It is fine, because client side retries recover most provider failures',
            'It is unreachable while that call stays on the critical path',
            'It still applies, since third party time is excluded from the SLI',
            'It holds as long as the provider spreads its failures evenly',
          ], 1, 'A synchronous dependency\'s bad minutes become your bad minutes, so your objective cannot be tighter than the dependency you block on unless you remove or degrade that call.'),
          q('Why is a latency SLI normally written as the proportion of requests faster than 300 ms rather than as a p99 figure?', [
            'Percentiles are too expensive to compute inside the request path',
            'A proportion responds faster to a sudden change in latency',
            'A ratio of counts aggregates correctly across every instance',
            'The p99 ignores requests that time out before they finish',
          ], 2, 'Good and valid event counts can be summed across pods, regions, and windows, whereas percentiles from separate instances cannot be combined into a fleet number.'),
        ]
      ),
      lesson('Running and Learning from an Incident', 13, `
03:14. The pager fires: checkout availability at 88%, burning error budget at 30 times the sustainable rate. Two engineers are already in the channel arguing about a database index. Nobody has looked at what shipped at 02:54.

The fastest incidents are not the ones with the smartest diagnosis. They are the ones where somebody stops the bleeding first.

### Mitigate, then understand

Rolling back a suspicious deploy takes 90 seconds and needs no theory. Understanding why a change broke checkout takes forty minutes and helps nobody who is currently failing to pay you.

\`\`\`text
Mitigations, in order of how fast they work:
  1. roll back the last deploy          seconds, no theory required
  2. turn off the feature flag          seconds, if the change was flagged
  3. drain the bad instance or region   a minute
  4. shed the noisy traffic             a minute
  5. scale out                          minutes, and only helps saturation
\`\`\`

The move that costs you the incident is "let me add a log line and redeploy so I can see". You have now pushed a second untested change into a broken system and lost your one clean control. Revert to the last good build, watch the SLI recover, and read the diff afterwards with the pressure off.

### Roles, because three people debugging is not a response

| Role | Owns | Rule |
|---|---|---|
| Incident commander | decisions, priorities, the clock | does not type |
| Operations lead | every change to production | the only person who types |
| Comms | status page, support, stakeholders | updates every 20 min, even with nothing new |
| Scribe | the timeline | writes it live, not afterwards |

On a team of four, one person can hold two hats. Not these two: the commander and the operator. Someone seven frames deep in a stack trace loses the clock, forgets the customers, and stops noticing that the mitigation from ten minutes ago never actually worked.

### Write the timeline while it is still happening

One channel, timestamps, what you saw and what you changed:

\`\`\`text
03:14  page: checkout availability SLI 88%, burn rate 30x
03:16  IC: priya. comms: dan. ops: sam
03:19  deploy 4c19f went out 02:54, timing matches
03:22  rollback of 4c19f started
03:27  SLI at 99.2% and climbing, no new 5xx in 3 min
03:35  comms: status page updated to monitoring
03:41  resolved. cause not yet known, 4c19f held back
\`\`\`

Two numbers fall straight out of that. Time to detect: the deploy landed at 02:54 and the page fired at 03:14, so 20 minutes. Time to mitigate: 03:14 to 03:27, so 13 minutes. Track both across every incident. They are the honest measure of your operations, and if a customer told you before your alerting did, that is the finding, not the bug.

### The postmortem is about the class, not the bug

Blameless is not politeness, it is accuracy. "Sam shipped a migration that dropped a column" stops the investigation at a person. "A migration that dropped a live column could be merged and deployed with no check that anything still read it" keeps going until it reaches something you can change.

Four questions worth more than a narrative:

- What made this possible?
- What delayed detection?
- What made mitigation slow or risky?
- What went right, and how do we keep it?

Then action items, each with a named owner and a date, tracked on the same board as features. Cap the list at about five. A postmortem with 22 action items produces zero of them, and everyone quietly learns that postmortems are paperwork.

One counter-intuitive rule for choosing those five: the detection and rollback items usually beat the bug fix. Fixing the bug prevents this incident happening again. Cutting time to detect from 20 minutes to two shortens every incident you have not had yet, including the ones nobody could have predicted.
      `,
        [
          q('Errors spike four minutes after a deploy. Two engineers want to attach a debugger and find the cause before touching anything. What should the incident commander call?', [
            'Roll back to the last good build, then diagnose the diff',
            'Add log lines, redeploy, and watch the next few minutes',
            'Hold for ten minutes to see whether the spike settles alone',
            'Scale the service out while the debugging session is set up',
          ], 0, 'Rollback is fast and needs no theory, so it stops user harm immediately and leaves the failing build available for a calm investigation afterwards.'),
          q('Why should the incident commander avoid also being the person running commands against production?', [
            'Two people typing will produce conflicting changes on one host',
            'Command history must be attributable to one named operator',
            'Someone deep in a stack trace stops tracking the clock and customers',
            'Commanders are expected to have production access revoked',
          ], 2, 'Hands on debugging consumes full attention, so the same person cannot reliably keep time, coordinate comms, and notice that a mitigation quietly failed.'),
          q('A postmortem\'s only action item reads \'be more careful when reviewing migrations\'. What is actually wrong with it?', [
            'It names an individual, which the blameless format forbids',
            'It changes nothing about the system that let the change ship',
            'It belongs in the timeline section rather than the action list',
            'It carries no severity rating, so it cannot be prioritised',
          ], 1, 'Asking for more care leaves every mechanism exactly as it was, so the next tired reviewer hits the identical gap and the same incident becomes available again.'),
        ]
      ),
      ],
      [
      q('A single request was slow, and you have logs, metrics, and traces for it. Which question is the trace the right tool for answering?', [
        'How many requests to this route were slow over the last week',
        'Whether the error rate has crossed the paging threshold yet',
        'How much of the month\'s error budget the last hour consumed',
        'Which of the six downstream calls consumed the four seconds',
      ], 3, 'A trace is the per request waterfall, so it is the only signal that attributes elapsed time to individual hops inside one specific request.'),
      q('You need to find out which tenant is sending the pathological requests. Where does the tenant id belong?', [
        'On span attributes, where high cardinality costs nothing extra',
        'As a label on the request duration histogram',
        'As one counter per tenant kept in the registry',
        'In a gauge holding the current worst tenant id',
      ], 0, 'Spans are stored per request rather than as time series, so identifiers with unbounded values are cheap there and catastrophic as metric labels.'),
      q('An alert fires whenever p99 latency exceeds 500 ms for two minutes, and the team has learned to swipe it away. What should replace it?', [
        'The same threshold evaluated over a fifteen minute window',
        'A multiwindow burn rate alert tied to the latency SLO',
        'A page whenever any single request exceeds two seconds',
        'A daily report listing the worst p99 seen in each hour',
      ], 1, 'Burn rate alerts fire in proportion to how much user visible budget is being destroyed, so small harmless blips stay quiet while a real outage pages within minutes.'),
      q('An incident was mitigated in six minutes but only detected forty minutes in, by a customer email. Which action item is worth the most?', [
        'Rewrite the handler that produced the original error',
        'Add a runbook entry describing the rollback steps',
        'Add an SLI alert that catches this class in minutes',
        'Move to two on call engineers for every night shift',
      ], 2, 'Mitigation was already fast, so the forty minutes of undetected user harm is the dominant cost and only better detection shortens it here and in future incidents.'),
      ]
    ),
    chapter(
      'Evolving a Live System',
      'Changing an API, a deployment, and a datastore that thousands of clients already depend on, without breaking any of them on the way.',
      [
      lesson('Versioning and Deprecating a Public API', 13, `
The removal notice went out in March. The field came out in November, and at 09:14 that Tuesday, 412 integrations started reading \`undefined\` where a number used to be. Nobody had read the changelog. The notice email went to the account owner, and the account owner left the company in June.

Deprecation is not an announcement. It is a measurement problem.

### What actually counts as breaking

| Change | Breaking |
|---|---|
| Adding an optional field to a response | No |
| Adding a required field to a request body | Yes |
| Adding a value to an existing enum | Yes for generated clients |
| Rejecting input that used to pass validation | Yes |
| Changing the default page size from 50 to 20 | Yes in practice |
| Renaming a field, even to a better name | Yes |

The two that surprise people are the enum and the tightened validation. A client generated from your OpenAPI schema with a closed enum throws the moment you return \`status: "partially_refunded"\`, and it throws inside their deserialiser, before their code ever sees the payload. Loosening what you accept is safe. Tightening it is a breaking change wearing a bug fix costume.

### Version the representation, not the logic

Path (\`/v1/orders\`), media type (\`Accept: application/vnd.acme.v2+json\`), or a date pinned per account. Pick one and stop debating it. What matters far more is what you duplicate behind it.

\`\`\`js
// src/api/presenters/order.js
export const v1 = (order) => ({
  id: order.id,
  total: order.totalCents / 100,                 // v1 shipped a float, so v1 keeps it
  status: order.status === 'partially_refunded' ? 'refunded' : order.status,
});

export const v2 = (order) => ({
  id: order.id,
  total: { amount: order.totalCents, currency: order.currency },
  status: order.status,
});
\`\`\`

\`\`\`js
app.use('/v1/orders', v1Router);   // different presenters, one service and one repo
app.use('/v2/orders', v2Router);
\`\`\`

Fork the controllers instead and you now maintain two refund implementations, which drift inside a quarter and disagree during an incident. The presenter above is the entire cost of keeping v1 alive, and it fits on one screen.

### Announce it in the response, not the newsletter

Machine readable deprecation is the only kind that reaches a running client:

\`\`\`http
HTTP/1.1 200 OK
Deprecation: Sun, 01 Mar 2026 00:00:00 GMT
Sunset: Wed, 01 Jul 2026 00:00:00 GMT
Link: <https://api.acme.com/docs/v2-migration>; rel="deprecation"
\`\`\`

\`\`\`js
export const sunset = (on, doc) => (req, res, next) => {
  res.set('Sunset', on.toUTCString());
  res.set('Link', \`<\${doc}>; rel="deprecation"\`);
  metrics.increment('api.deprecated_hit', { route: req.path, key: req.apiKey.id });
  next();
};
\`\`\`

That counter is the part you cannot skip. Before removing anything, query it: which keys, how many calls, last seen when. Retiring a route that three keys hit twice a month is an email. Retiring one a payments partner calls 90,000 times a day is a project with a named owner on their side.

### The brownout

Announcements reach nobody. Errors reach everybody. Publish a calendar and take the old version down briefly, on purpose:

| Date and window | Behaviour of v1 |
|---|---|
| 4 May, 10:00 to 10:05 | returns 410 Gone |
| 18 May, 10:00 to 10:30 | returns 410 Gone |
| 1 June | removed |

Five announced minutes of 410 will find every integration nobody remembered, while their owners still have six weeks to fix them. Doing this unannounced is an outage you caused. Doing it on a published schedule is the kindest item on this list.

### Retire versions or drown in them

Every supported version is a test suite, an on-call surface, and a migration you have merely postponed. Two live versions is normal. Five means you never finished anything. Give each version a sunset date on the day it ships, before anyone depends on it.
      `,
        [
          q('A client generated from your OpenAPI schema starts throwing the day you add partially_refunded to the order status enum. Was adding a value a breaking change?', [
            'No, because nothing that existed before was removed or renamed',
            'No, because clients are expected to ignore unknown enum values',
            'Yes, a closed enum in generated code rejects the value on parse',
            'Yes, but only for clients that did not pin an API version',
          ], 2, 'Generated clients deserialise into a closed set of values, so an unexpected member fails before the caller\'s own code runs, which makes adding an enum value a breaking change for them.'),
          q('You want to delete a v1 endpoint that was deprecated eight months ago. Which evidence should decide whether it is safe?', [
            'How long ago the deprecation notice and headers went out',
            'Per key call counts and last seen times for that exact route',
            'The share of total API traffic that v1 receives overall',
            'Whether any support tickets have mentioned the endpoint',
          ], 1, 'Only per key usage tells you who would actually break and how badly, since an endpoint with three low volume callers and one with a partner sending 90,000 calls a day need completely different plans.'),
          q('Your team schedules v1 to return 410 Gone for five announced minutes twice before removing it. What does that achieve that another email cannot?', [
            'It lowers the load the old version puts on the database',
            'It proves the v2 presenters return the same fields as v1',
            'It allows the removal to be undone without a redeploy',
            'It surfaces live integrations while owners can still fix them',
          ], 3, 'A short scheduled failure produces errors in the callers\' own monitoring, which reaches teams that never read changelogs while there is still time for them to migrate.'),
        ]
      ),
      lesson('Feature Flags and Canary Releases', 13, `
At 10:00 the new pricing engine was serving 1 percent of traffic. At 10:04 that 1 percent was failing 22 percent of its requests, an automated check set the flag back to zero, and the other 99 percent of customers never noticed anything. The build had been sitting in production for nine days.

Deploying and releasing had become separate operations, which is what turned a Tuesday morning rollback into a non-event.

### Four kinds of flag, four lifetimes

| Kind | Example | Lives for |
|---|---|---|
| Release | \`pricing.v2\` | days, then deleted |
| Kill switch | \`search.suggestions\` | forever, off during incidents |
| Permission | \`beta.bulk_export\` | as long as the plan exists |
| Experiment | \`checkout.copy_b\` | until the test reads out |

Deleting a release flag is part of shipping the feature, not a cleanup ticket for later. Treat all four the same and you arrive at 240 flags nobody dares touch.

### Bucket deterministically or corrupt data

Here is the version that ships and quietly damages rows:

\`\`\`js
// BUG: the same user flips between engines on every request
if (Math.random() < 0.01) return priceV2(cart);
return priceV1(cart);
\`\`\`

A customer adds one item under v2, refreshes into v1, and their order now carries two rounding conventions. Hash the identity instead:

\`\`\`js
import { createHash } from 'node:crypto';

export const bucketOf = (flag, subject) => {
  const h = createHash('sha1').update(\`\${flag}:\${subject}\`).digest();
  return h.readUInt32BE(0) % 10000;                   // 0 to 9999
};

export const enabled = (flag, subject, percent) =>
  bucketOf(flag, subject) < percent * 100;
\`\`\`

Same user, same flag, same answer, on every replica, with no shared state and no network call. Putting the flag name inside the hash matters more than it looks: leave it out and every 1 percent rollout selects the same unlucky customers, who then experience every bug you ever ship.

Evaluate once per request into \`req.flags\`. Ten call sites means ten evaluations and a real chance the value changes halfway through a handler.

### The canary that looks healthy and is not

Route 2 percent of traffic to the new version and compare. Three things lie to you here.

It is cold. Empty caches, unwarmed connection pools, a JIT that has not settled. A fresh replica has a worse p99 for roughly its first minute no matter what changed, so judging inside that window rolls back good releases.

The baseline is wrong. Compare canary against the rest of the fleet with the same labels, same route, same window: \`http_request_duration_seconds{version="canary",route="/api/orders"}\`. Comparing a small cold sample against a large warm aggregate is not a comparison.

The sample is not representative. If three tenants generate 60 percent of your requests, a random 2 percent of requests reaches them, but a random 2 percent of tenants may not, and the query that only hurts at their row counts never runs on the canary.

### Roll back on a number, not on a feeling

\`\`\`js
// release job, every 30 seconds
const bad = canary.errorRate > 3 * baseline.errorRate && canary.requests > 500;
if (bad) await flags.set('pricing.v2', { percent: 0 });
\`\`\`

The request-count guard is what people leave out, and it is why automated rollbacks fire at 04:00. Two failures out of eleven requests is an 18 percent error rate that means nothing at all.

Recovery here is a flag write, so it takes four seconds instead of the eleven minutes a rebuild and redeploy costs. That gap is the whole argument for flags.

### Flag debt is real debt

Every flag doubles a code path. Ten independent flags describe a thousand combinations, and you tested maybe four. Store an expiry date on the flag record, fail the build when one is 30 days past it, and delete the losing branch the day the rollout hits 100 percent.
      `,
        [
          q('A 1 percent rollout decides per request with Math.random() rather than hashing the user id. What breaks first?', [
            'One user hits both code paths, so a session writes mixed data',
            'The rollout share drifts above 1 percent as traffic grows',
            'Each replica enrols a different set of users into the test',
            'The flag can no longer be turned off without a redeploy',
          ], 0, 'Random per request selection gives the same user different code on consecutive calls, so one session can produce rows written under two different implementations.'),
          q('A canary replica shows a p99 three times the fleet p99 two minutes after it starts taking traffic. What should you check before rolling back?', [
            'Whether the canary runs the same image the fleet is running',
            'Whether the fleet p99 already includes the canary\'s requests',
            'Whether the sample is warm and compared per route and window',
            'Whether the balancer is sending it more than its share',
          ], 2, 'A freshly started replica has cold caches and pools for about a minute, and comparing its small sample against a large warm fleet aggregate exaggerates the difference further.'),
          q('An automated rollback fires at 04:00 because the canary error rate was more than three times baseline, on 2 failures out of 11 requests. What is missing from the rule?', [
            'A baseline measured from the same hour on the previous day',
            'A cooldown period after each rollback before retrying it',
            'A rule that ignores 5xx responses caused by client retries',
            'A minimum request count before the ratio is trusted at all',
          ], 3, 'Ratios computed over a handful of requests swing wildly by chance, so the comparison needs a volume floor before its result carries any information.'),
        ]
      ),
      lesson('Extracting a Service with the Strangler Pattern', 14, `
Eleven months, four engineers, a complete rewrite of the order system. It passed every test it had and never served a single production request, because by the time it was ready the original had 60 features it did not. The rewrite was cancelled. The same team then moved orders out for real in fourteen weeks, one route at a time, and the first route was live in nine days.

### Start with a seam inside the process

Nothing crosses a network until the code has a boundary. In a monolith the order tables are joined from 40 places, and extraction cannot begin until they are joined from one.

\`\`\`js
// src/orders/service.js  the only module allowed to touch order tables
export const getOrder = (id) => repo.findOrder(id);
export const refund = (id, amountCents, actor) => repo.withTx(/* ... */);
\`\`\`

Then delete the direct queries elsewhere, one caller per pull request, with the monolith shipping normally the whole time. That refactor is boring, reviewable and reversible, and it is about 70 percent of the total work. Teams that skip it find out mid-cutover that the reporting page joins \`orders\` to \`users\` in hand written SQL.

### Move traffic route by route

Put a facade in front of the boundary and let a flag decide who serves each request:

\`\`\`js
import { request } from 'undici';

app.use('/api/orders', async (req, res, next) => {
  if (!req.flags.ordersExtracted) return next();          // old in-process router
  const up = await request(ORDERS_URL + req.originalUrl, {
    method: req.method,
    headers: forwardable(req.headers),
    body: req.rawBody,
    headersTimeout: 2000,
    bodyTimeout: 5000,
  });
  res.status(up.statusCode).set(safeHeaders(up.headers));
  up.body.pipe(res);
});
\`\`\`

Take \`GET /api/orders/:id\` first, because it is idempotent and its output can be compared against the old path safely. Writes go last, when you already trust the deployment, the metrics and the on-call runbook for the new service.

### The database is the real boundary

A service does not own its data until nothing else writes it. There are three honest states:

| State | Monolith access | Risk |
|---|---|---|
| Shared, both write | full | drift, no owner, hardest to unwind |
| Shared, monolith reads only | SELECT | tolerable for a few weeks |
| Owned, monolith calls the API | none | the goal |

Enforce the middle state with a grant, not a code review:

\`\`\`sql
REVOKE INSERT, UPDATE, DELETE ON orders, order_items FROM monolith_app;
\`\`\`

A comment saying "do not write here" survives about two sprints. A revoked grant survives forever, and it fails in staging on a Tuesday afternoon rather than in production at midnight.

### What the seam costs

The call that took 0.2 ms and could not fail now takes 40 ms and can fail six ways: timeout, connection refused, 503, slow body, DNS, and a deploy of the other service. Every extracted boundary needs the timeout, retry budget and circuit breaker from Chapter 7, plus a fallback that is a product decision rather than a technical one. If orders is unreachable, does checkout fail loudly or queue the request?

The transaction is gone too. What used to be \`BEGIN; insert order; decrement stock; COMMIT;\` is now two systems that can disagree. The standard repair is an outbox row written in the same local transaction as the change, drained by a worker, with the consumer treating a repeat as a no-op.

### Done means deleted

An extraction ends when the old code is gone, not when the new service is live. Until then you run two implementations, two on-call paths, and a flag someone will flip at 02:00 into a branch that has not executed in eight months. Track the real state:

| Route | Traffic on the new service | Old code |
|---|---|---|
| GET /api/orders/:id | 100% | deleted |
| POST /api/orders | 100% | deleted |
| POST /api/orders/:id/refund | 25% | live |

The rows that say 100 percent while the old code is still present are the ones that hurt you later.
      `,
        [
          q('Why does a strangler extraction begin with a refactor inside the monolith instead of a new repository and a new deployment?', [
            'A separate repository cannot reuse the monolith\'s test fixtures',
            'Network clients need the interface typed before they compile',
            'Until one module owns the tables there is no edge to move',
            'The deployment pipeline requires both to build together first',
          ], 2, 'Extraction moves a boundary across the network, so the boundary has to exist in the code first, otherwise the forty places that query those tables directly all break at the cutover.'),
          q('The plan says the monolith stops writing order tables once the new service owns them. What actually enforces that during the transition?', [
            'A checklist item reviewers apply to every pull request',
            'Revoking write grants from the monolith\'s database role',
            'Moving the tables into a schema the monolith does not read',
            'A trigger that logs any write arriving from the monolith',
          ], 1, 'A revoked grant fails the offending query immediately and in every environment, while conventions and review checklists decay as soon as someone is shipping under pressure.'),
          q('A refund used to update orders and stock in one SQL transaction. After the orders service is extracted, what replaces that guarantee?', [
            'A distributed lock held across both services for the call',
            'A retry loop in the caller that repeats until both agree',
            'A longer transaction opened against both databases at once',
            'An outbox row written with the local change, drained by a worker',
          ], 3, 'Once the two changes live in different systems there is no shared transaction, so the local write and its intent to notify the other service must commit together and be delivered afterwards with idempotent handling.'),
        ]
      ),
      lesson('Dual Writes, Shadow Reads, and the Cutover', 14, `
The backfill finished at 03:20. The cutover flipped reads to the new store at 09:00. Between those two moments the application wrote 1,142 orders, and every one of them existed only in the old store. Customers found out before the dashboard did.

The backfill was not wrong. It ran against a system that kept moving.

### The sequence with no gap in it

| Step | Writes go to | Reads come from | Source of truth |
|---|---|---|---|
| 1 | old | old | old |
| 2 | old and new | old | old |
| 3 | old and new, backfill running | old | old |
| 4 | old and new | old, compared against new | old |
| 5 | old and new | new | new |
| 6 | new | new | new |

Dual writing starts before the backfill, not after. That single ordering is the fix for those 1,142 rows: once every new write lands in both stores, the backfill only has to cover rows created before it began, and that set stops growing while you work on it.

### Dual writes fail asymmetrically

The new store is not the source of truth yet, so a failure there must not fail the request. Swallowing it in silence is worse than failing.

\`\`\`js
export const createOrder = async (input) => {
  const saved = await legacy.insertOrder(input);       // authoritative, may throw

  try {
    await ledger.insertOrder(saved);                   // shadow, must not throw
  } catch (err) {
    metrics.increment('dualwrite.failed', { store: 'ledger' });
    await outbox.enqueue({ type: 'order.replay', id: saved.id });
    log.warn({ err, orderId: saved.id }, 'shadow write failed');
  }
  return saved;
};
\`\`\`

\`dualwrite.failed\` gets an alert whose target is zero, and the outbox is what makes the drift repairable rather than permanent. A catch block containing only a log line is how a migration reaches its cutover looking green and 0.3 percent wrong.

### Backfill without clobbering live writes

The classic corruption: the backfill reads a row at 03:04, a customer updates it at 03:05, and the backfill writes its stale snapshot at 03:06. The newer value is gone and nothing logged an error.

\`\`\`sql
INSERT INTO ledger.orders (id, total_cents, updated_at)
SELECT id, total_cents, updated_at FROM legacy.orders
WHERE created_at < '2026-03-14T02:00:00Z'
ON CONFLICT (id) DO UPDATE
   SET total_cents = EXCLUDED.total_cents,
       updated_at  = EXCLUDED.updated_at
 WHERE ledger.orders.updated_at < EXCLUDED.updated_at;
\`\`\`

Two guards, both load bearing: only rows older than the moment dual writing began, and never overwrite a row that is newer than what you are holding. Run it in batches for the reasons Chapter 4 covers.

### Shadow reads tell you whether you are ready

Read both, serve the old one, compare off the request path:

\`\`\`js
const order = await legacy.getOrder(id);

setImmediate(async () => {
  try {
    const shadow = await ledger.getOrder(id);
    const diff = compare(normalise(order), normalise(shadow));
    metrics.increment(diff ? 'shadow.mismatch' : 'shadow.match');
    if (diff) log.info({ id, diff }, 'shadow mismatch');
  } catch { metrics.increment('shadow.error'); }
});

return order;
\`\`\`

The first run reported a 41 percent mismatch rate, and almost all of it was representation: microsecond timestamps against millisecond ones, \`null\` against a missing key, \`1200\` cents against \`12.0\`. Normalise before comparing or the signal drowns. Whatever survives normalisation is the real list, and it is usually short, specific, and fixable in a day.

Sample it too. Comparing every read doubles the load on a store that may already be at 70 percent utilisation.

### The cutover is a flag, and so is the way back

Flip reads per tenant, smallest first, using the same deterministic bucketing a canary uses. Keep writing both stores for a week afterwards. That week is your rollback: if the new store turns out to be wrong on Thursday, you set one flag to zero and the old store is still correct to the second, with no restore, no replay, and no incident channel.

Stop dual writing only after a full week of clean comparisons at 100 percent read traffic. Then delete the old writer, the comparison job, and the flag, in that order.
      `,
        [
          q('A team runs the full backfill first and switches dual writes on afterwards, six hours before the cutover. What is wrong with that order?', [
            'Rows written between the two steps exist only in the old store',
            'The backfill overwrites rows the application changed while running',
            'The new store rejects duplicate keys once dual writes begin',
            'Every backfilled row is reported as a mismatch by comparison',
          ], 0, 'Nothing copies writes that happen after the backfill has passed them, so the window between the two steps produces records that never reach the new store at all.'),
          q('The shadow write to the new store throws while the authoritative write to the old store has already succeeded. What should the handler do?', [
            'Retry inline until it succeeds so the two stores stay in step',
            'Count the failure, queue a replay of that id, return the row',
            'Roll back the authoritative write so the stores cannot drift',
            'Log the error and move on, since the new store is not truth',
          ], 1, 'The request must not fail for a store that is not yet authoritative, but the divergence still has to be repaired, so the failure needs a metric and a queued replay rather than only a log line.'),
          q('Shadow read comparison reports a 41 percent mismatch rate on its first day of running against real traffic. What explains that number?', [
            'Representation differences that normalising removes before compare',
            'A backfill that skipped rows created before dual writes started',
            'Sampling every read and overloading the store being compared',
            'The new store answering reads from a replica that is behind',
          ], 0, 'Raw comparison flags harmless differences such as timestamp precision, missing keys against explicit nulls, and cents against decimal amounts, which is why both sides must be normalised before anything is counted as a real mismatch.'),
        ]
      ),
      ],
      [
      q('You add a required field to a request body and keep the same /v1 path. Why do existing integrations break even though nothing was removed?', [
        'Generated clients strip request fields they do not recognise',
        'The extra field invalidates every cached response for that route',
        'Callers still send bodies without it, and validation now rejects them',
        'Path based versions are pinned, so the router never sees the field',
      ], 2, 'Tightening what the API accepts turns previously valid requests into errors, which is a breaking change even though the change itself was additive.'),
      q('A release ships behind a flag rather than being enabled by the deploy that carries it. What changes when the feature turns out to be broken?', [
        'The broken code never reached the production servers at all',
        'The rollback rebuilds only that service instead of the fleet',
        'Tests for the old code path can be deleted once the flag exists',
        'Recovery is a flag write in seconds, not a rebuild and redeploy',
      ], 3, 'Separating deploy from release means the fix is changing a value that every replica reads, so recovery takes seconds and does not depend on a build pipeline being healthy.'),
      q('You are extracting an orders service and moving routes one at a time. Which route belongs first in the sequence?', [
        'The write endpoint carrying the most business value per call',
        'An idempotent read, whose output can be compared safely',
        'The endpoint with the fewest callers anywhere in the API',
        'Whichever route the new service already implements fully',
      ], 1, 'An idempotent read can be replayed and compared against the old implementation without risking duplicated or lost writes, so it proves the plumbing before anything irreversible moves.'),
      q('Reads have been flipped to the new store and comparisons matched for a full day. Why keep writing both stores for another week?', [
        'It keeps the old store current, so rolling back is a flag flip',
        'It gives the backfill time to finish rows it could not reach',
        'It spreads write load across two stores through the peak period',
        'It keeps the comparison job supplied with fresh rows to check',
      ], 0, 'As long as the old store is still receiving every write it stays a valid source of truth, so reverting is a configuration change rather than a restore from backup.'),
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
      q('A hot Redis key with a 60 second TTL fronts a 40 ms query on a service taking 9,000 requests a second. The team adds SET lock:<key> <id> NX PX 5000 so that only one instance rebuilds the key. Latency still spikes once a minute. What did the lock fail to address?', [
      'The lock is per instance, so twelve instances still run twelve separate rebuilds',
      'Redis serialises the SET NX calls, so waiting requests now queue inside Redis',
      'The key still expires, so everyone who lost the lock has nothing left to serve',
      'The 5 second lock TTL outlives the query and blocks the next scheduled refresh',
    ], 2, 'A lock reduces a miss storm to a single rebuild but does nothing about the gap itself, because once the key is gone the losers have no value to return and must wait; keeping a soft expiry inside the value with a much longer hard TTL means expiry triggers one background refresh while every caller is still served a slightly stale entry in about a millisecond.'),
    q('Twelve replicas run four cluster workers each with pool max 10 against an 8 vCPU Postgres, pool.waitingCount sits near 30 through every peak, and the slowest endpoint pages with OFFSET 20000 LIMIT 20. Someone proposes raising max to 40. What is the likely result?', [
      'Throughput falls, because roughly 1,900 backends fight over a box that peaks near 30',
      'Throughput rises until connectionTimeoutMillis begins rejecting and then holds steady',
      'Nothing changes, because waitingCount counts idle sockets rather than queued requests',
      'Reads get faster and writes get slower, since the pool stops recycling its connections',
    ], 0, 'Raising max only moves the queue out of the Node process, where it is measurable and boundable, and into the database, where each connection is an operating system process competing for the same CPUs and lock manager, so total throughput drops; the real culprit is the deep offset scan holding connections, and keyset pagination fixes it without touching the pool.'),
    q('A JWT verifier looks the signing key up by header.kid in a plain object literal and rejects the token when the lookup is falsy. A token arrives claiming kid: "constructor". Why is that more dangerous than an unrecognised kid?', [
      'The lookup returns undefined, and jwt.verify quietly falls back to the active key',
      'The lookup finds an inherited function, so the unknown-kid rejection never runs',
      'The JWT header is unsigned, so any kid an attacker picks is accepted as genuine',
      'Object property order decides the match, so the oldest key in the set is chosen',
    ], 1, 'Property lookup on a plain object walks the prototype chain, so kid values such as constructor or toString resolve to inherited functions rather than undefined, and the guard that was meant to reject an unknown key id hands a function to the verifier instead; building the key map with Object.create(null) removes the inherited properties, which is the same prototype problem that hostile request payloads exploit.'),
    q('A latency objective is written as: the mean of the p99 reported by each of eight pods stays under 300 ms, measured from a histogram whose bucket edges are 0.05, 0.1, 0.25, 1 and 5 seconds. What is wrong with that definition?', [
      'Eight pods is too small a sample for a p99, so it swings on every scrape interval',
      'A histogram cannot represent latency, which is the job of a summary instrument',
      'The 5 second top edge caps the estimate, so slower requests are read as 5 seconds',
      'Percentiles do not average across pods, and no bucket edge sits at the 300 ms line',
    ], 3, 'A fleet percentile has to be computed by summing each bucket counter across pods first, because averaging per-pod quantiles produces a number that describes no request anywhere, and with no edge at 300 ms the count of requests inside the objective can only be interpolated; writing the SLI as the proportion of requests below a 300 ms bucket edge fixes both, since counts add up across instances and percentiles do not.'),
    q('A storage migration runs the whole backfill overnight, switches dual writes on when it finishes, and flips reads to the new store an hour later. Which rows are absent from the new store on cutover day?', [
      'Those written after the backfill read a row but before dual writing was switched on',
      'Those written after dual writing began, which the finished backfill never covered',
      'Those whose shadow write threw and left nothing behind except a warning log line',
      'Those updated mid backfill, whose newer value the ON CONFLICT guard then discarded',
    ], 0, 'Dual writing has to start before the backfill so that the set of rows the backfill must cover stops growing while it runs; run it the other way around and every row created between the backfill reading a table and the dual write going live exists only in the old store, which is why the correct sequence backfills with a created_at cutoff at the moment dual writes began.'),
    q('A canary is bucketed by hashed tenant id at 2 percent, runs an hour with no error or latency regression, and the release then goes fleetwide and database latency collapses within minutes. Three tenants hold most of the rows. What did the canary miss?', [
      'Hashing is not stable across replicas, so the canary sample changed on every request',
      'The canary pods were still cold, so warm-up noise hid the regression for that hour',
      'Two percent is below the request volume any automated comparison can call a signal',
      'Two percent of tenants left out every large one, so no query ran at their row counts',
    ], 3, 'Bucketing by tenant makes the sample representative of tenants rather than of data volume, so a query whose plan only degrades into a sequential scan at the largest tenants\' row counts is never exercised by the canary; when the risk depends on data size, either bucket per request or put the big tenants into the canary group deliberately.'),
    q('A login handler hashes passwords with `crypto.pbkdf2Sync`, costing about 200 ms per call. Why does switching to the callback-based `crypto.pbkdf2` help other requests?', [
      'The hash runs on a libuv pool thread, so the event loop stays free',
      'The async version uses a faster algorithm and finishes sooner',
      'Node spawns a separate child process for each async hash call',
      'The async version skips hashing whenever the event loop is busy',
    ], 0, 'pbkdf2 is one of the operations Node hands to the libuv thread pool, so the 200 ms of work no longer pins the single JavaScript thread that serves every request.'),
    q('A project sets `"type": "module"` in package.json, and one file still starts with `const express = require(\'express\')`. What happens when it runs?', [
      'It works, because Node accepts both forms in any .js file',
      'It throws, because require does not exist in an ES module',
      'It works, but only for packages that ship CommonJS builds',
      'It loads the package twice, once as ESM and once as CJS',
    ], 1, 'With type module every .js file is an ES module, where require and __dirname are not defined, so the file must use import instead.'),
    q('A service reads its config file with readFileSync once at startup, and reads an email template with readFileSync inside a busy request handler. Which read is the problem?', [
      'Only the startup read, because sync calls are forbidden before listen',
      'Both, since any synchronous file read blocks requests the same way',
      'Only the handler read, which blocks every in-flight request while it runs',
      'Neither, because file reads always run on the libuv thread pool',
    ], 2, 'Synchronous APIs are fine before the server accepts traffic, but inside a handler they block the single thread, and with it every other request.'),
    q('A validation middleware calls `res.status(400).json(...)` when the title is missing, then calls `next()` unconditionally. What happens on a request with no title?', [
      'Express notices a response was sent and skips the remaining handlers',
      'The client receives both responses, one after the other, on the socket',
      'The handler\'s 201 replaces the 400 before anything is sent to the client',
      'The route handler also runs and its reply throws ERR_HTTP_HEADERS_SENT',
    ], 3, 'A middleware must do exactly one of respond, next() or next(err); doing two means a second reply tries to write headers that are already on the wire.'),
    q('Inside a router mounted with `app.use(\'/admin\', adminRouter)`, the router calls `adminRouter.use(requireAdmin)`. Which requests does requireAdmin run for?', [
      'Every request to the app, because use() registers globally',
      'Only requests routed into the admin router, under /admin',
      'Only the first route declared inside the admin router',
      'No requests, until it is also registered with app.use',
    ], 1, 'A router is a mini app, so middleware registered on it runs only for requests that reach that router through its mount point.'),
    q('On Express 5, an async route handler awaits a repository call that rejects, and the handler has no try/catch. What happens?', [
      'The request hangs until the client eventually times out',
      'The process crashes with an unhandled promise rejection',
      'Express retries the handler once before reporting an error',
      'Express passes the rejection on to the error-handling middleware',
    ], 3, 'Express 5 forwards rejected promises from handlers to the error pipeline automatically, which Express 4 does not do without a wrapper.'),
    q('`DELETE /api/notes/42` succeeds and there is nothing useful to send back. Which response follows the course\'s REST conventions?', [
      '204 with no body',
      '201 with the deleted note in the body',
      '202 with an empty body',
      '410 with no body',
    ], 0, 'A successful delete with nothing to say is 204 No Content; 201 means something was created, 202 means work was only accepted, and 410 describes a resource already gone.'),
    q('Why generate a password reset token with `crypto.randomBytes(32)` rather than from `Math.random()`?', [
      'Math.random only returns integers, which are too short for a token',
      'randomBytes tokens expire on their own after fifteen minutes',
      'Math.random is predictable, so an attacker could work out valid tokens',
      'randomBytes makes the token safe to store in the database as is',
    ], 2, 'A reset token is effectively a temporary password, so it must come from a cryptographically secure source; Math.random is not designed to resist prediction.'),
    q('A session cookie is set with `httpOnly: true, secure: true, sameSite: \'lax\'`. What does httpOnly specifically add?', [
      'Page JavaScript cannot read it, so an XSS bug cannot steal it',
      'It is sent only over HTTPS connections, never over plain HTTP',
      'It is not sent on cross-site POST requests, which blunts CSRF',
      'It expires when the browser closes, whatever maxAge says',
    ], 0, 'httpOnly hides the cookie from document.cookie, which blunts token theft through XSS; HTTPS-only is the secure flag and the CSRF protection comes from sameSite.'),
    q('A transfer debits account 1 and credits account 2 with two separate queries and no transaction. The process crashes between them. What is the result?', [
      'Postgres rolls back the debit because the credit never ran',
      'The debit is saved and the credit is lost, so the money disappears',
      'Both updates are lost, since the app never confirmed either',
      'The credit runs automatically when the process restarts',
    ], 1, 'Without BEGIN and COMMIT each statement commits on its own, so only a transaction makes the two updates succeed or fail together.'),
    q('An upload route uses multer with disk storage and no `limits` option. What can a single client do?', [
      'Nothing, because multer caps each file at 1 MB by default',
      'Upload only the image types that the route is expecting',
      'Send an arbitrarily large file and fill the server\'s disk',
      'Skip authentication, since limits also enforce the login',
    ], 2, 'multer accepts files of any size unless limits such as fileSize, files and fields are set, which is why limits come before anything else.'),
    q('A migration backfills a new column with one `UPDATE notes SET status = \'draft\' WHERE status IS NULL` across 12 million rows. What is the problem, and the fix?', [
      'Postgres rejects any single UPDATE touching over a million rows',
      'Nothing, since Postgres only rewrites the column metadata here',
      'It must run on a read replica so the primary is not affected',
      'One long transaction bloats the table; update in batches walked by id',
    ], 3, 'A single UPDATE over millions of rows holds one transaction for minutes, blocks vacuum and leaves dead tuples, so backfills run in small batches keyed by id.'),
    q('On SIGTERM during a deploy, which shutdown order avoids dropping requests?', [
      'Close the database pool first, then stop accepting new connections',
      'Stop accepting, let in-flight requests finish, close the pool, then exit',
      'Exit immediately, since the platform replays any dropped requests',
      'Keep accepting new requests until the process has been idle a while',
    ], 1, 'server.close stops new connections and waits for in-flight ones, the pool is closed after that, and a hard timeout caps the whole drain.'),
    q('An API is reported slow and the team has three competing theories. What does the course say to gather before changing any code?', [
      'The average response time of the whole API over the past month',
      'Host CPU usage, since high CPU always means the code is slow',
      'A list of the largest npm dependencies ranked by install size',
      'p95 latency per route, event loop lag, and database time per request',
    ], 3, 'Performance work without measurement is superstition, and those three numbers show which route is slow and whether the time goes to the loop or the database.'),
    q('On Node 20 with default settings, a promise rejects and nothing ever handles the rejection. What happens?', [
      'The process exits with an error, as with an uncaught exception',
      'Node prints a warning and keeps running as before',
      'The rejection is silently ignored after one tick',
      'Node retries the rejected promise once, then warns',
    ], 0, 'Since Node 15 an unhandled rejection is treated like an uncaught exception and takes the whole process down.'),
    q('Why must the Node inspector never be started with `--inspect=0.0.0.0` on a production host?', [
      'It doubles memory use, because a second V8 heap is created',
      'It disables the JIT, so every request runs several times slower',
      'Anyone who can reach the port can run arbitrary code in the process',
      'It blocks the event loop until a debugger client has attached',
    ], 2, 'The inspector protocol can evaluate code, so a publicly bound inspector is remote code execution; bind it to 127.0.0.1 and tunnel over SSH.'),
    q('A payment provider retries a webhook it believes timed out, and your handler receives the same event twice. What prevents it being processed twice?', [
      'Record each event id under a unique constraint and skip repeats',
      'Verify the HMAC signature a second time before processing',
      'Return a 500 on the repeat delivery so the provider stops',
      'Drop any event whose timestamp is more than a minute old',
    ], 0, 'Providers deliver at least once, so the handler inserts the event id with ON CONFLICT DO NOTHING and only queues work the first time it sees that id.'),
    q('An order commits, and the process crashes before the confirmation email job is enqueued. Which pattern guarantees the job is recorded whenever the order commits?', [
      'Enqueue the job before starting the database transaction',
      'Write the job to an outbox table inside the same transaction',
      'Retry the enqueue in a loop until the queue accepts it',
      'Send the email synchronously inside the request handler',
    ], 1, 'An outbox row commits or rolls back with the order itself, and a small poller then moves committed rows onto the queue.'),
    q('A dependency is down, and every call to it waits out a 3 second timeout before failing. What does adding a circuit breaker change?', [
      'Calls are queued until the dependency recovers, then sent in order',
      'The timeout doubles on each failure so slow replies can still arrive',
      'Calls fail instantly for a while instead of each waiting out the timeout',
      'Failed calls are answered from a cached copy of the dependency',
    ], 2, 'After repeated failures the breaker opens and rejects immediately, turning a three second wait into a fast 503 so the rest of the API stays responsive.'),
    q('Which rate limiting algorithm lets you set the allowed burst size separately from the sustained rate?', [
      'Fixed window counter',
      'Sliding log',
      'Per-key concurrency cap',
      'Token bucket',
    ], 3, 'A token bucket has a capacity, which is the burst, and a refill rate, which is the average, so the burst is a number you chose rather than an accident of window alignment.'),
    q('A client exceeds its rate limit. What should the response be?', [
      '403, since the client is no longer allowed to call',
      '429 with a Retry-After header saying when to try again',
      '503 with no headers, so the client backs off alone',
      '200 with an empty body, so the client stops retrying',
    ], 1, '429 Too Many Requests names the actual condition, and Retry-After tells a well-behaved client exactly how long to wait.'),
    q('`GET /api/me` returns the signed-in user\'s profile. Which header lets the browser reuse the response for a minute while keeping shared caches and CDNs from storing it?', [
      'Cache-Control: public, s-maxage=60',
      'Cache-Control: public, max-age=60',
      'Cache-Control: no-store, max-age=60',
      'Cache-Control: private, max-age=60',
    ], 3, 'private restricts storage to the user\'s own browser, while public lets shared caches keep a copy and no-store forbids storing it anywhere.'),
    q('A notes feed pages with `OFFSET ... LIMIT 20`, and deep pages keep getting slower. What should replace it?', [
      'Keyset pagination that seeks past the last row\'s (created_at, id)',
      'A larger LIMIT, so that fewer pages are needed to reach the end',
      'An index on the OFFSET value so the skip becomes a single lookup',
      'Caching every page in Redis for the life of the user\'s session',
    ], 0, 'OFFSET reads and discards every skipped row, while WHERE (created_at, id) < ($1, $2) lets the index seek straight to the cursor at any depth.'),
    q('Ten workers poll a jobs table with `SELECT ... FOR UPDATE LIMIT 1`, and nine of them sit waiting on the row the first one locked. Which change lets each worker take a different job?', [
      'Drop FOR UPDATE so that every worker can read the row freely',
      'Raise lock_timeout so the waiting workers give up sooner',
      'Add SKIP LOCKED so a worker passes over rows already locked',
      'Run the poll on a read replica to spread the lock load',
    ], 2, 'FOR UPDATE SKIP LOCKED makes each worker ignore rows another transaction holds, so ten workers claim ten different jobs instead of queuing on one.'),
    q('A webhook feature fetches URLs that users supply. Which defence holds up against server-side request forgery?', [
      'Resolve the name yourself and reject private and link-local addresses',
      'Block any URL whose text contains 169.254.169.254 or localhost',
      'Accept only URLs that start with https:// instead of http://',
      'Validate the URL against a strict regex before calling fetch',
    ], 0, 'A text blocklist is defeated by DNS names, alternative IP forms and redirects, so the check has to apply to the address the connection will actually reach.'),
    q('A handler passes `req.query.owner` straight into a Mongo filter, with no schema on the query string. A request arrives as `GET /api/notes?owner[$ne]=null`. What happens?', [
      'It arrives as the literal text "[$ne]=null" and matches nothing',
      'It becomes the object { $ne: null } and matches every document',
      'Express rejects it, because brackets are not allowed in a query',
      'It becomes null, so the filter matches notes that have no owner',
    ], 1, 'Express parses query strings with qs, which turns bracket syntax into nested objects, so a schema such as z.string() must reject it at the edge.'),
    q('A service computes and exports its own `requests_per_second` gauge instead of a request counter. What has it lost?', [
      'Gauges are dropped by Prometheus unless they carry a unit suffix',
      'A gauge can only hold whole numbers, so fractional rates are lost',
      'It cannot be re-aggregated across pods; export a counter and use rate()',
      'Nothing, since gauges and counters are stored the same way',
    ], 2, 'A counter read through rate() at query time can be summed across pods and survives restarts, while a precomputed rate cannot be combined and lies after every deploy.'),
    q('Rate, errors and duration per route show what users feel. Which additional signal warns you before latency turns vertical?', [
      'Mean response time averaged across every route',
      'Total requests served since the process last started',
      'Database host CPU averaged over the previous day',
      'Saturation, such as pool connections in use over pool size',
    ], 3, 'Latency rises slowly and then suddenly, and saturation measures such as pool usage, queue depth and event loop lag show how close you are to that wall.'),
    q('An endpoint is deprecated. How should it announce its removal date so that running clients, not just people, can detect it?', [
      'An email to each account owner listing the removal date',
      'Deprecation and Sunset headers on every response it sends',
      'A changelog entry linked from the documentation homepage',
      'A 301 redirect from the old endpoint to its v2 replacement',
    ], 1, 'Machine-readable Deprecation and Sunset headers, with a link to the migration guide, reach every integration that calls the endpoint, while emails and changelogs go unread.'),
    q('A bucketing helper hashes only the user id, not the flag name, to decide every percentage rollout. What happens across many 1 percent rollouts?', [
      'Users flip between the old and new versions on each request',
      'Each rollout reaches a different random 1 percent of users',
      'Rollouts stop being deterministic across the replicas',
      'The same small group of users gets every rollout, and every bug, first',
    ], 3, 'Without the flag name in the hash every flag ranks users identically, so the same 1 percent land in the first bucket of every release.'),
  ],
});
