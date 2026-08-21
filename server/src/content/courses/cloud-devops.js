import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'cloud-devops',
  title: 'Cloud & DevOps Essentials',
  category: 'DevOps',
  level: 'Intermediate',
  duration: '8 weeks',
  accent: 'cyan',
  coverKey: 'cloud-devops',
  summary:
    'Take an application from your laptop to a monitored, automatically deployed, instantly rollback-able production service — containers, pipelines, cloud primitives, and the operational habits that keep it up.',
  description:
    'You containerise a Node service, build a GitHub Actions pipeline that tests it and publishes an immutable image, provision cloud infrastructure as code, and deploy it behind a load balancer with health checks and graceful shutdown. Then you instrument it with structured logs, percentile metrics, and alerts that only fire when a user is actually suffering, and rehearse the rollback before you need it.',
  chapters: [
    chapter(
      'DevOps and the Linux Foundation',
      'What the practice actually is, and the Linux and shell skills every step after this depends on.',
      [
        lesson('What DevOps Actually Means', 12, `
DevOps is not a job title, a product you can buy, or a team you insert between developers and operations. It is a set of practices for shortening the distance between "a change exists" and "the change is safely running in front of users" — and for keeping the people who write code responsible for how it behaves once it is out there.

### The wall it removes

The old arrangement gave developers one incentive (ship features) and operations the opposite one (change nothing, stay up). Work piled into quarterly releases: four hundred commits landing at once, at midnight, on a Saturday. When it broke, nobody could say which of the four hundred did it, and the fix was another release.

Small batches invert every part of that. Ship four commits instead of four hundred and the failure surface is tiny, the cause is obvious, and the rollback is one step. **Batch size is the single biggest lever you have**, and almost everything else in this course exists to make small batches cheap.

### The four numbers that define the practice

The DORA research program found that four measurements separate high performers from low, and that they move together — you do not trade speed for stability, you get both or neither.

| Metric | What it measures | Strong | Weak |
|---|---|---|---|
| **Deployment frequency** | How often you release | On demand, many per day | Monthly or less |
| **Lead time for changes** | Commit → running in production | Under an hour | Months |
| **Change failure rate** | Deploys causing a degradation | Under 15% | 40%+ |
| **Time to restore** | How fast you recover | Under an hour | Days |

You can measure the first two today with data you already have:

\`\`\`bash
# Commit timestamp of what is currently deployed
git log -1 --format=%cI HEAD        # 2026-08-19T09:14:22+05:00
# Compare with the deploy timestamp from your pipeline. That gap is lead time.
git log --oneline --since="30 days ago" | wc -l   # change volume in a month
\`\`\`

### Three ideas underneath

**Flow** — make work move left to right without waiting. Anything a human does more than twice becomes a script.

**Feedback** — make problems visible fast and close to the person who caused them. A test that fails in six minutes on a pull request is worth ten times a bug report in three weeks.

**Continuous learning** — treat incidents as information, not as misconduct. A **blameless postmortem** asks what made the mistake easy to make, because "be more careful" has never prevented a single outage.

### What this looks like in practice

Everything is in version control: application code, the Dockerfile, the pipeline definition, the infrastructure. Every change goes through the same automated path to production, and that path is the *only* way to production — no one SSHes into a box to patch a file, because a change nobody can see is a change nobody can reproduce. Deployments are boring, frequent, and reversible.

### The classic mistake

Two of them, and they are everywhere. The first is hiring a "DevOps engineer" to sit between development and operations, translating between them — you have not removed the wall, you have staffed it. The second is buying the tooling first: teams adopt Kubernetes before they have a build that runs the same way twice, and end up with the original problem plus a distributed systems problem.

Start at the bottom instead. A repeatable build, an automated test suite, a one-command deploy, and a rollback you have actually rehearsed will beat any platform you can name. The rest of this course builds exactly those, in that order.
        `),
        lesson('The Linux You Actually Need', 14, `
Almost every server you deploy to runs Linux, and almost every container image is a Linux userland. You do not need to be a sysadmin, but you do need to be able to find a log, read a permission, and restart a service without guessing.

### Where things live

| Path | Holds |
|---|---|
| \`/etc\` | System and service configuration |
| \`/var/log\` | Logs — the first place you look |
| \`/var/lib\` | Service data (databases, container state) |
| \`/usr/bin\`, \`/usr/local/bin\` | Executables on your \`PATH\` |
| \`/home/<user>\` | Per-user files, including \`~/.ssh\` |
| \`/proc\` | The kernel's live view of running processes |
| \`/opt\` | Self-contained third-party software |

### Permissions in thirty seconds

\`\`\`bash
ls -l deploy.sh
# -rwxr-x---  1 deploy  app  1204 Aug 19 09:14 deploy.sh
\`\`\`

Read that first field in three groups of three after the type character: **owner** \`rwx\`, **group** \`r-x\`, **everyone else** \`---\`. As octal, r=4, w=2, x=1:

\`\`\`bash
chmod 750 deploy.sh      # owner rwx, group r-x, others nothing
chmod 600 .env           # owner read/write only — correct for a secrets file
chown deploy:app deploy.sh
\`\`\`

**\`chmod 777\` is the classic mistake.** It is what people reach for when something "won't work", and it fixes the symptom by making the file writable by every process on the box, including whatever gets compromised next. Worse, SSH actively refuses to use a private key that others can read, and sshd's \`StrictModes\` check ignores a \`~/.ssh\` or \`authorized_keys\` that is group- or world-writable — so 777 is frequently the thing that breaks the login you were trying to fix. Work out the actual owner and set 600 or 640.

### Processes and services

\`\`\`bash
ps aux | grep node            # what is running
top -o %MEM                   # live view, sorted by memory
kill -TERM 4821               # ask politely: run your shutdown handler
kill -9 4821                  # last resort: the process cannot react at all
\`\`\`

\`SIGTERM\` versus \`SIGKILL\` matters more than it looks. \`-9\` gives your application no chance to finish in-flight requests or close database connections; every deploy that uses it drops user traffic. Chapter 4 shows the handler that makes \`SIGTERM\` graceful.

Long-running services are managed by **systemd**:

\`\`\`bash
sudo systemctl status api      # is it running, and why did it stop
sudo systemctl restart api
sudo systemctl enable api      # start automatically on boot
sudo journalctl -u api -f      # follow this service's logs
sudo journalctl -u api --since "10 min ago" -p err
\`\`\`

Forgetting \`enable\` is a quiet trap: the service runs perfectly until the machine reboots at 3am and never comes back.

### Packages and users

\`\`\`bash
sudo apt-get update && sudo apt-get install -y nginx    # Debian/Ubuntu
sudo dnf install -y nginx                               # Fedora/RHEL
\`\`\`

Always pin versions in anything automated. \`apt-get install nodejs\` gives a different version this month than last, which is exactly the reproducibility problem containers exist to solve.

Run applications as a dedicated unprivileged user, never root. A bug in code running as root is a compromised machine; the same bug as \`app\` is a compromised directory.

### SSH the right way

\`\`\`bash
ssh-keygen -t ed25519 -C "deploy@ci"        # modern, short, fast
ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
\`\`\`

Then disable password authentication in \`/etc/ssh/sshd_config\` (\`PasswordAuthentication no\`) and restart sshd. Password logins on a public IP are attacked continuously within minutes of the machine existing.

### The failure that takes servers down most often

Disk full — usually logs.

\`\`\`bash
df -h                            # which filesystem is full
du -sh /var/log/* | sort -h      # what is eating it
\`\`\`

Set up log rotation before you need it, and remember that a container writing logs to a file inside itself is quietly filling the host.
        `),
        lesson('Shell Skills That Compound', 13, `
The shell is how you interrogate a server you have never seen before and how you glue every tool in this course together. Five techniques cover the overwhelming majority of real use.

### Pipes turn small tools into one answer

Each program does one thing and passes text to the next. A concrete question — which URLs returned 5xx most often today?

\`\`\`bash
awk '$9 ~ /^5/ {print $7}' /var/log/nginx/access.log \\
  | sort | uniq -c | sort -rn | head
#   412 /api/checkout
#    38 /api/search
\`\`\`

\`awk\` picks the path from lines whose status field starts with 5, \`sort\` groups identical lines together, \`uniq -c\` counts each group, and \`sort -rn\` puts the biggest first. \`uniq\` only collapses *adjacent* duplicates, which is why the first \`sort\` is not optional — leaving it out is the most common reason this pipeline returns nonsense.

Other daily tools: \`grep -c ERROR app.log\` to count, \`grep -A3 -B3\` for surrounding context, \`tail -f\` to follow, \`sed -n '100,120p'\` to read a slice, \`jq '.level'\` for JSON logs.

### Exit codes are the control flow

Every command returns 0 for success, non-zero for failure.

\`\`\`bash
curl -fsS https://api.example.com/healthz   # -f makes HTTP 500 a non-zero exit
echo $?                                     # 0 = healthy

npm test && ./deploy.sh          # deploy only if tests pass
./migrate.sh || ./rollback.sh    # rollback only if migrate failed
\`\`\`

Without \`-f\`, \`curl\` exits 0 even for a 500 — it fetched the page successfully, it just happened to be an error page. Health check scripts get this wrong constantly and report a dead service as healthy.

### Strict mode, on every script you write

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`

- \`-e\` — abort on the first failing command instead of ploughing on.
- \`-u\` — abort on an undefined variable instead of substituting an empty string.
- \`-o pipefail\` — a pipeline fails if *any* stage fails, not just the last one.

Those three lines are the difference between a deploy script that stops when the build fails and one that cheerfully uploads nothing to production. \`set -u\` in particular converts the catastrophic \`rm -rf "\${BUILD_DIR}"/*\` with an unset \`BUILD_DIR\` into an immediate error instead of \`rm -rf /*\`.

### Quote every variable

\`\`\`bash
DIR="/var/my app"
rm -rf $DIR      # BUG: two arguments — "/var/my" and "app"
rm -rf "$DIR"    # one argument, as intended
\`\`\`

Unquoted expansion splits on whitespace and expands globs. **This is the single most common bug in shell scripts**, and it is invisible until a path, a filename, or a CI variable contains a space. Quote everything; use \`"$@"\` to forward arguments.

### Variables, defaults, and cleanup

\`\`\`bash
ENVIRONMENT="\${1:-staging}"        # first argument, defaulting to staging
IMAGE_TAG="\$(git rev-parse --short HEAD)"
: "\${DATABASE_URL:?DATABASE_URL is required}"   # fail loudly if unset

TMP="\$(mktemp -d)"
trap 'rm -rf "\$TMP"' EXIT          # runs even if the script exits early
\`\`\`

\`trap ... EXIT\` is how you guarantee cleanup — temp files removed, maintenance mode turned off, a lock released — regardless of which branch exited.

### Make the machine check your work

Install **ShellCheck** and run it in your pipeline. It catches unquoted variables, useless \`cat\`, and misused \`[ ]\` tests before they reach a server. A shell script that touches production deserves review like any other code — because it is exactly as capable of destroying data.
        `),
      ],
      [
        q('Why does shipping four commits at a time beat shipping four hundred?', [
          'Small deploys use less bandwidth',
          'Reviewers only need to read one file',
          'The failure surface is small, so the cause of a break is obvious and the rollback is one step',
          'It reduces the number of tests you have to write',
        ], 2, 'Batch size determines how hard a failure is to diagnose and reverse — small batches make cause and rollback trivially findable.'),
        q('An application cannot read its config file, so a colleague runs chmod 777 on it. What is the real problem with that?', [
          'It makes the file writable by every process on the machine, including a compromised one, and it breaks SSH key files outright',
          'It only applies to the owner, so it will not help',
          'It removes the execute bit that services need',
          'Nothing — 777 is the standard fix for permission errors',
        ], 0, '777 grants write access to everyone rather than fixing ownership; ssh also refuses a private key others can read, and sshd ignores an authorized_keys file that is group- or world-writable.'),
        q('Why does a deploy script that uses kill -9 to stop the old process drop user traffic?', [
          'SIGKILL restarts the process before it exits',
          'SIGKILL is queued and may arrive minutes later',
          'The load balancer treats SIGKILL as an error status',
          'SIGKILL cannot be handled, so in-flight requests and open connections are severed instantly',
        ], 3, 'SIGKILL gives the process no chance to run shutdown code, so requests being served are cut off mid-response.'),
        q('What does adding `set -euo pipefail` change about a deploy script?', [
          'It enables verbose logging of every command',
          'It aborts on the first failure, on an undefined variable, and when any stage of a pipeline fails',
          'It runs the script in a subshell for isolation',
          'It automatically quotes variable expansions',
        ], 1, 'Without it a failing build step exits non-zero and the script simply continues to the deploy step with nothing to deploy.'),
      ]
    ),
    chapter(
      'Containers with Docker',
      'Images, layers, volumes, and Compose — and why containers actually solve "works on my machine".',
      [
        lesson('Images, Containers, and the End of "Works on My Machine"', 13, `
"Works on my machine" is never mysterious once you list what actually differs between two machines: Node 18 versus 20, a system OpenSSL version, a globally installed CLI, a \`TZ\` environment variable, a case-insensitive filesystem on macOS that hides a wrong import path. A container eliminates the whole category by shipping the userland with the code.

### Image versus container

An **image** is a read-only stack of filesystem layers plus metadata (default command, environment, exposed port, working directory). It is a build artifact — inert, versioned, identified by a content digest.

A **container** is a *process* started from an image, with a thin writable layer on top and a set of kernel features restricting what it can see: **namespaces** give it its own view of the process table, network interfaces, mounts, and hostname; **cgroups** cap how much CPU and memory it can consume.

That is the whole trick. There is no guest operating system:

| | Virtual machine | Container |
|---|---|---|
| Kernel | Its own, booted | Shares the host's |
| Start time | Tens of seconds | Milliseconds |
| Size | Gigabytes | Tens of megabytes |
| Isolation | Hardware-level, strong | Kernel-level, good |

Because the kernel is shared, a Linux container needs a Linux kernel. On macOS and Windows, Docker quietly runs a small Linux VM for you.

### Running one

\`\`\`bash
docker run --rm -it -p 8080:3000 \\
  -e NODE_ENV=production \\
  --name api ghcr.io/acme/api:9f3c1a2
\`\`\`

- \`--rm\` — delete the container when it exits, so you do not accumulate hundreds of dead ones.
- \`-p 8080:3000\` — **host port : container port**, in that order. Reversing them is a rite of passage.
- \`-e\` — set an environment variable; this is how configuration gets in (Chapter 3).
- \`-it\` — interactive terminal, useful for debugging, dropped for real deployments (\`-d\` detaches instead).

**The classic mistake here is binding to localhost inside the container.** If your server calls \`app.listen(3000, '127.0.0.1')\`, it is listening on the container's own loopback interface, and \`-p 8080:3000\` will connect to nothing. Bind \`0.0.0.0\`. The symptom — "the port is published but curl says connection reset" — sends people hunting through firewall rules for hours.

### Containers are disposable by design

The writable layer belongs to the container, not the image. \`docker rm\` destroys it. Anything that must outlive the process — database files, uploaded images — goes into a volume or an external service, which is the third lesson of this chapter. Treat a container as something you can delete at any moment, because your platform will.

### Looking inside

\`\`\`bash
docker ps                     # running containers
docker ps -a                  # including exited ones and their exit codes
docker logs -f api            # follow stdout/stderr
docker exec -it api sh        # shell inside a running container
docker inspect api            # full JSON: mounts, env, network, health
docker stats                  # live CPU and memory per container
\`\`\`

\`docker logs\` works because a well-behaved container writes to stdout and stderr rather than to files — the runtime captures those streams and your platform ships them onward.

### The architecture trap

Building on an Apple Silicon laptop produces an \`arm64\` image. Deploy it to a typical \`amd64\` cloud VM and the container dies immediately with \`exec format error\`. Build for the target explicitly:

\`\`\`bash
docker build --platform linux/amd64 -t ghcr.io/acme/api:9f3c1a2 .
\`\`\`

Better still, build in CI on a Linux runner (Chapter 3), so the artifact that reaches production is never one that was produced by a laptop at all.
        `),
        lesson('Dockerfiles: Layers, Cache, and Small Images', 15, `
A Dockerfile is a recipe, and each instruction produces a layer that is cached by content. Understanding that one sentence is the difference between a 45-second build of a 90MB image and a six-minute build of a 1.2GB one.

### The naive version, and why it is slow

\`\`\`dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/server.js"]
\`\`\`

Every layer's cache key includes the layers before it. \`COPY . .\` changes whenever *any* source file changes, so \`npm install\` re-runs on every build — even when \`package.json\` has not been touched for a month. It is also enormous, ships your \`.git\` directory, and runs as root.

### The version to actually use

\`\`\`dockerfile
# ---- build dependencies in a throwaway stage ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev          # deterministic; fails if the lockfile disagrees

# ---- runtime image ----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./            # Node needs it at runtime for "type": "module"
COPY src ./src
USER node                       # never run as root
EXPOSE 3000
CMD ["node", "src/server.js"]
\`\`\`

Three deliberate choices:

**Copy the lockfile before the source.** Dependencies change rarely, source changes constantly. Ordering instructions from least to most volatile is the entire art of Docker caching, and this one reordering typically cuts rebuild time by 80%.

**\`npm ci\`, not \`npm install\`.** It installs exactly what the lockfile says and errors if the lockfile is out of sync — the same input produces the same output every time.

**Multi-stage.** Compilers, dev dependencies, and build caches live in \`deps\` and never reach the final image. Only \`node_modules\`, \`package.json\`, and \`src\` are copied forward.

### Deleting a file in a later layer does not shrink the image

\`\`\`dockerfile
RUN curl -O https://example.com/toolkit.tar.gz && tar -xzf toolkit.tar.gz
RUN rm toolkit.tar.gz      # image is still 400MB larger
\`\`\`

Layers are additive; the second layer records a deletion but the bytes remain in the layer beneath, and anyone can extract them. Do the download, use, and cleanup in **one** \`RUN\`, or better, in a discarded build stage. The same rule is why a secret written into an early layer is not removed by deleting it later — it is permanently recoverable from the image.

### .dockerignore is not optional

\`\`\`
node_modules
.git
.env
*.log
coverage
\`\`\`

Without it, \`COPY . .\` bakes your local \`node_modules\` (wrong architecture) and your \`.env\` (real credentials) into a published image. Treat a leaked \`.env\` in an image exactly like a leaked commit: rotate the secrets.

### CMD, ENTRYPOINT, and PID 1

\`\`\`dockerfile
CMD ["node", "src/server.js"]     # exec form — node is PID 1, receives SIGTERM
CMD node src/server.js            # shell form — /bin/sh is PID 1
\`\`\`

**The shell form is the classic production bug.** The shell becomes PID 1 and does not forward signals to its child, so \`SIGTERM\` on shutdown is swallowed, the container hangs for the full 10-second grace period, and then gets \`SIGKILL\`ed mid-request. Deploys mysteriously drop a handful of requests each time. Always use the JSON exec form.

Use \`ENTRYPOINT\` for the fixed executable and \`CMD\` for default arguments the caller may override.

### Tag with something immutable

\`\`\`bash
docker build -t ghcr.io/acme/api:"$(git rev-parse --short HEAD)" .
\`\`\`

\`:latest\` is a moving pointer. It cannot answer "what is running in production?", and it makes rollback impossible because the previous \`latest\` no longer exists under any name. Tag with the commit SHA — every deploy becomes traceable to a diff, and rolling back is running an older tag (Chapter 5).
        `),
        lesson('Volumes, Networks, and Docker Compose', 14, `
A container filesystem dies with the container and a container has its own network stack. Persisting data and letting services find each other are the two things you must configure explicitly.

### Two kinds of mount

| | Bind mount | Named volume |
|---|---|---|
| Syntax | \`-v ./src:/app/src\` | \`-v pgdata:/var/lib/postgresql/data\` |
| Lives | A path on the host | Docker-managed storage |
| Use for | Live-reload of source in development | Database files, uploads |
| Portability | Tied to a host path | Portable, backup-friendly |

\`\`\`bash
docker run -d --name db \\
  -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=devsecret postgres:16
\`\`\`

Without that \`-v\`, \`docker rm db\` deletes the database. With it, the data survives container replacement, upgrades, and image changes — which is exactly what you want, because the container is the disposable part.

### Networking: services find each other by name

Containers on the same user-defined network get DNS entries for their names, and reach each other on the **container** port. Published ports (\`-p\`) are for traffic coming from outside.

**The classic mistake:** the API's connection string says \`postgres://app@localhost:5432/app\` and it works locally, then fails in containers with \`ECONNREFUSED\`. Inside a container, \`localhost\` is *that container* — the database is a different network namespace entirely. The host is \`db\`, the service name.

### Compose describes the whole environment

\`\`\`yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:devsecret@db:5432/app   # host is the service name
      NODE_ENV: development
    volumes:
      - ./src:/app/src          # bind mount for hot reload
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: devsecret
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:
\`\`\`

\`\`\`bash
docker compose up --build      # build and start everything
docker compose logs -f api     # follow one service
docker compose exec db psql -U app
docker compose down            # stop and remove containers
docker compose down -v         # ...and delete the volumes. Deletes your data.
\`\`\`

This file is the real payoff of containers for a team: a new developer clones the repository, runs one command, and has the exact Postgres version production uses. No install instructions, no "which version of Postgres do you have?", no drift.

### depends_on does not mean "ready"

Plain \`depends_on: [db]\` waits only for the container to *start*, not for Postgres to finish initialising and accept connections. Your API starts, connects instantly, gets refused, and crashes — reliably on a cold machine, never on a warm one, which makes it look flaky rather than wrong.

The \`condition: service_healthy\` form above fixes it by waiting for the healthcheck. Even so, **make the application retry its initial connection with backoff.** In production there is no Compose to sequence anything, databases fail over, and networks blip. Startup resilience is the application's job.

### Keep dev and prod honest

Use Compose for local development and CI integration tests, and keep the same image in both. Where they must differ — bind mounts, dev dependencies, debug logging — use a \`docker-compose.override.yml\` rather than a second Dockerfile. The moment development builds a different image from production, you are back to guessing which environment a bug belongs to.
        `),
      ],
      [
        q('A container publishes port 8080:3000 but connections are refused, even though the process is running. What is the most likely cause?', [
          'The image was built for the wrong CPU architecture',
          'The server is bound to 127.0.0.1 inside the container instead of 0.0.0.0',
          'The host port and container port are reversed',
          'Docker requires EXPOSE before a port can be published',
        ], 1, 'Binding to loopback means the process only accepts connections from inside its own network namespace, so the published port has nothing to forward to.'),
        q('Why does copying package.json and running npm ci before COPY . . make rebuilds dramatically faster?', [
          'npm ci is faster than npm install regardless of ordering',
          'It lets Docker parallelise the two instructions',
          'Alpine caches node_modules globally',
          'Layer caching is invalidated by content, so dependency install is only re-run when the lockfile changes',
        ], 3, 'Ordering instructions from least to most frequently changed keeps the expensive layer cached across ordinary source edits.'),
        q('Why is `CMD node src/server.js` (shell form) a production hazard?', [
          '/bin/sh becomes PID 1 and does not forward SIGTERM, so shutdown is not graceful',
          'It cannot read environment variables',
          'It ignores the WORKDIR setting',
          'It prevents the container from being tagged',
        ], 0, 'With the shell as PID 1 the signal never reaches Node, so the container is eventually SIGKILLed and in-flight requests are cut off.'),
        q('In a Compose file, why must the API use `db` rather than `localhost` in its database URL?', [
          'Compose blocks loopback traffic for security',
          'localhost resolves to the host machine, which is not running Postgres',
          'Each container has its own network namespace, so localhost is that container itself; `db` is the service DNS name',
          'Postgres refuses connections from localhost by default',
        ], 2, 'Service names resolve over the user-defined network, while localhost inside a container never leaves that container.'),
      ]
    ),
    chapter(
      'CI/CD with GitHub Actions',
      'Automating the path to production: pipelines, workflows, and secrets that stay secret.',
      [
        lesson('What a Pipeline Is For', 12, `
A pipeline exists to answer one question automatically and repeatedly: **is this commit safe to release?** Everything else — badges, notifications, dashboards — is decoration on that.

### Three terms people use interchangeably and should not

**Continuous integration** — everyone merges to the main branch frequently (at least daily), and every push is automatically built and tested. The point is that integration problems surface in hours, not at the end of a quarter.

**Continuous delivery** — every commit that passes produces a deployable artifact, and releasing is a button press. You are *always* ready to ship.

**Continuous deployment** — that button presses itself. Passing commits go to production with no human step.

Most teams should target continuous delivery first. The gap between "we could deploy right now" and "we do deploy automatically" is a matter of confidence, and confidence comes from the tests and the rollback (Chapter 5), not from the automation.

### The shape of a good pipeline

| Stage | Typical time | Fails on |
|---|---|---|
| Lint + typecheck | 20–40s | Style, obvious type errors |
| Unit tests | 1–3 min | Logic regressions |
| Build image | 1–3 min | Broken build, missing dependency |
| Integration tests | 2–5 min | Wiring, migrations, contracts |
| Deploy to staging | 1 min | Configuration, infrastructure |
| Smoke tests | 30s | "Did it actually come up?" |
| Deploy to production | 1–2 min | — |

Order stages **cheapest and most likely to fail first**. A lint error should not cost you a five-minute Docker build to discover. Aim to keep total pull-request feedback under ten minutes; past that, people context-switch away and stop reading the results.

### Build once, promote the same artifact

\`\`\`bash
# In CI, exactly once per commit:
docker build -t ghcr.io/acme/api:"$GITHUB_SHA" .
docker push ghcr.io/acme/api:"$GITHUB_SHA"

# Then deploy that identical image, unchanged, to each environment:
deploy staging    ghcr.io/acme/api:"$GITHUB_SHA"
deploy production ghcr.io/acme/api:"$GITHUB_SHA"
\`\`\`

**The classic mistake is rebuilding per environment.** A "production build" job that runs \`docker build\` again produces a different image than the one you tested: a dependency published a patch, a base image moved, a timestamp differs. Whatever staging proved, it did not prove anything about the bytes now running in production. Build once, and let *configuration* — environment variables, not source — be the only difference between environments.

### The pipeline must be the only road

If someone can SSH in and \`git pull\`, they will, usually during an incident at 2am, and the next automated deploy will silently revert their fix. One path to production gives you a complete audit trail, reproducibility, and a rollback that always works the same way.

### Flaky tests destroy pipelines

A test that fails 5% of the time on a ten-job pipeline fails something on roughly four of every ten runs. People start re-running jobs reflexively, and once "just re-run it" is the habit, a *real* failure gets re-run too and ships. Treat a flaky test as a production bug: quarantine it out of the required set immediately, then fix or delete it. A pipeline nobody believes is worse than no pipeline, because it costs the same and provides false assurance.

### Keep local and CI identical

Whatever CI runs, make it runnable locally with one command — \`npm run verify\`, a Makefile target, or Compose. When CI fails in a way you cannot reproduce, you are debugging the pipeline instead of the code.
        `),
        lesson('GitHub Actions in Practice', 15, `
GitHub Actions runs **workflows** (YAML files in \`.github/workflows/\`) made of **jobs** (each on a fresh runner VM) made of **steps** (a shell command or a reusable action).

### A complete CI workflow

\`\`\`yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

# A new push to the same branch cancels the run already in progress
concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:                       # a real database for integration tests
        image: postgres:16
        env: { POSTGRES_PASSWORD: test, POSTGRES_DB: test }
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 5s --health-retries 10
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm                  # caches ~/.npm keyed on the lockfile
      - run: npm ci
      - run: npm run lint
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/test

  build:
    needs: test                       # only runs if test succeeded
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write                 # least privilege for the job token
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3   # gha cache needs the container driver
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

### The pieces worth understanding

**Jobs are parallel by default; \`needs\` builds a DAG.** Run lint, unit tests, and typecheck as three parallel jobs and your feedback time is the slowest one, not the sum.

**Every job starts on a clean runner.** Nothing carries over — not the checkout, not \`node_modules\`, not files written by another job. To pass a build artifact between jobs, use \`actions/upload-artifact\` and \`download-artifact\`, or push to a registry as above.

**Caching is keyed on a hash.** \`cache: npm\` hashes the lockfile; a change means a cache miss and a full install, which is correct. Cache the package *download* directory, never \`node_modules\` itself — restoring a stale \`node_modules\` across a dependency change produces failures that make no sense.

**Matrices multiply a job.**

\`\`\`yaml
strategy:
  fail-fast: false
  matrix:
    node: [18, 20, 22]
\`\`\`

### The security details people skip

**Pin third-party actions.** \`uses: some-org/some-action@v1\` follows a mutable tag; whoever controls that repository can change what \`v1\` points at, and it runs in your pipeline with your secrets. Pin to a full commit SHA for anything outside \`actions/\` and \`docker/\`.

**Set \`permissions\` explicitly.** The default \`GITHUB_TOKEN\` can be far broader than a job needs. Declare the minimum per job, as above.

**Never run untrusted code with secrets.** Workflows triggered by \`pull_request\` from a fork deliberately do not receive secrets. \`pull_request_target\` does — and combining it with a checkout of the fork's code is a well-known way to hand an attacker your entire secret store.

**The classic mistake:** interpolating untrusted input into a \`run\` block. \`run: echo "\${{ github.event.pull_request.title }}"\` substitutes the title *into the shell script* before it executes, so a PR titled with a shell command executes that command on your runner. Pass it through \`env:\` and reference the variable instead.
        `),
        lesson('Configuration and Secrets', 13, `
The same image runs in development, staging, and production. What differs is **configuration**, and getting the boundary between config and code right is what makes "build once, promote" possible.

### Config lives in the environment

Anything that varies by deployment — database URL, API endpoints, log level, feature toggles, credentials — comes from environment variables. Anything that does not vary is code.

Validate it at boot, not at first use:

\`\`\`js
// config.js — one place, checked once, fails before serving traffic
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(\`Missing required env vars: \${missing.join(', ')}\`);
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: process.env.LOG_LEVEL ?? 'info',
  isProduction: process.env.NODE_ENV === 'production',
};
\`\`\`

A container that exits immediately with \`Missing required env vars: JWT_SECRET\` is a good deploy failure — the health check never passes, traffic never shifts, the old version keeps serving. A container that starts fine and throws \`undefined\` two hours later, on one endpoint, is a bad one.

### Three tiers, handled differently

| Tier | Example | Where it lives |
|---|---|---|
| Non-secret config | \`LOG_LEVEL\`, \`REGION\` | Plain env vars, committed defaults |
| Secrets | \`DATABASE_URL\`, API keys | Secret manager, injected at runtime |
| Build constants | Version, commit SHA | Build args, baked into the image |

Commit a \`.env.example\` listing every variable *name* with dummy values, and git-ignore \`.env\`. The example file is documentation that cannot drift, because the boot check above fails when someone adds a variable and forgets it.

### Never bake a secret into an image

\`\`\`dockerfile
ARG API_KEY                 # visible forever in docker history
ENV API_KEY=$API_KEY        # and readable by anyone who pulls the image
\`\`\`

Layers are immutable (Chapter 2), so a secret written during a build is permanently extractable — deleting it in a later instruction changes nothing. If a build genuinely needs a credential, use BuildKit's \`--mount=type=secret\`, which exposes it only for that one \`RUN\` and never persists it. Runtime secrets are injected when the container starts, never at build time.

### Secrets in the pipeline

Store them as repository or environment secrets and reference them explicitly:

\`\`\`yaml
- run: ./deploy.sh
  env:
    DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
\`\`\`

GitHub masks known secret values in logs, but masking is a safety net, not a control — it only matches exact strings, so a base64-encoded or JSON-embedded secret prints in the clear. Never \`echo\` a secret, never \`set -x\` in a script that handles one, and never pass one as a command-line argument, because the full process list is readable.

**Prefer short-lived credentials.** OIDC federation lets a workflow exchange its identity for a cloud role valid for minutes, so there is no long-lived cloud key sitting in your repository at all. A static access key in CI is the single most commonly stolen cloud credential.

### When a secret leaks

Assume compromise and **rotate immediately**. Deleting the commit does not help: the value exists in every clone, every fork, and GitHub's history, and automated scanners find committed keys within minutes of a push. Rotation is the only real fix; scrubbing history is cleanup afterwards. Add a secret scanner to your pipeline so the leak is caught at the pull request instead of by whoever finds it first.
        `),
      ],
      [
        q('Why should the pipeline build the container image once and deploy that same image to staging and production?', [
          'Because rebuilding produces a different artifact, so what staging tested is not what production runs',
          'Because registries charge per push',
          'Because Docker cannot build the same Dockerfile twice',
          'Because staging and production must use different tags',
        ], 0, 'Base images and transitive dependencies move between builds, so a rebuild invalidates everything the staging run proved.'),
        q('A CI job caches node_modules directly and restores it across dependency changes. What goes wrong?', [
          'Caches larger than 100MB are rejected',
          'npm refuses to run against a restored directory',
          'A stale or partially matching tree is restored, producing failures unrelated to the actual code change',
          'The cache key cannot include a lockfile hash',
        ], 2, 'node_modules is a resolved tree tied to an exact lockfile; caching the package download directory instead keeps installs both fast and correct.'),
        q('Why is `run: echo "${{ github.event.pull_request.title }}"` dangerous?', [
          'Titles may exceed the shell argument limit',
          'The expression is substituted into the script before it runs, so a crafted title executes as a command on the runner',
          'It exposes the pull request to forks',
          'echo writes to stderr in Actions runners',
        ], 1, 'Expression interpolation happens at script-assembly time, making untrusted text part of the shell command; pass it via env: instead.'),
        q('A build passes an API key with `ARG API_KEY` and it is only used during `npm run build`. Why is it still compromised?', [
          'ARG values are printed to the workflow log automatically',
          'BuildKit uploads build args to the registry',
          'Docker rejects builds that contain credentials',
          'Image layers are immutable, so the value stays permanently readable in the build history and layer contents',
        ], 3, 'Nothing written into a layer can be removed later; use --mount=type=secret for build-time credentials and inject runtime secrets at start.'),
      ]
    ),
    chapter(
      'Cloud Fundamentals and Deployment',
      'The primitives every provider sells, getting a Node service running on them, and describing it as code.',
      [
        lesson('The Cloud Building Blocks', 14, `
Every cloud provider sells the same handful of primitives under different names. Learn the primitives and the vendor documentation becomes a translation exercise.

| Primitive | AWS | Google Cloud | Azure |
|---|---|---|---|
| Virtual machine | EC2 | Compute Engine | Virtual Machines |
| Managed containers | ECS / App Runner | Cloud Run | Container Apps |
| Functions | Lambda | Cloud Functions | Functions |
| Object storage | S3 | Cloud Storage | Blob Storage |
| Managed Postgres | RDS | Cloud SQL | Database for PostgreSQL |
| Load balancer | ALB | Cloud Load Balancing | Application Gateway |
| Secret storage | Secrets Manager | Secret Manager | Key Vault |

### Compute: a spectrum of how much you operate

**Virtual machines** give you a whole Linux box. Maximum control, maximum responsibility — patching, log rotation, and the disk-full problem from Chapter 1 are yours.

**Managed container platforms** take the image you built in Chapter 2 and run N copies of it with health checks, rolling deploys, and autoscaling. For most web services this is the right default: containers give you reproducibility, the platform gives you the operations.

**Functions** run one handler per request with no idle cost, and charge per invocation. Excellent for spiky, event-driven work; awkward for anything needing a warm connection pool or a long request.

### Storage: pick the right shape

**Block storage** is a virtual disk attached to exactly one machine. Fast, but it goes where the machine goes.

**Object storage** (S3 and friends) holds blobs addressed by key over HTTP, is effectively infinite, and costs cents per gigabyte. It is not a filesystem — no partial writes, no renames, no directories, only a flat keyspace with slashes in the names.

**The classic mistake:** writing user uploads to local disk. It works perfectly with one instance and breaks the moment there are two — instance A stores the avatar, instance B serves the next request and returns a 404 — and every file vanishes at the next deploy, because containers are replaced, not updated. Uploads go to object storage. Always.

### Managed databases

What you are paying for is not the Postgres process, it is automated backups, point-in-time recovery, patching, failover to a standby, and metrics. Running your own database on a VM means you own all of that, including the 3am part.

Two things to configure deliberately: **connection limits** (Postgres handles a few hundred connections; ten containers with a pool of 20 each is 200 before you have any traffic — put a pooler like PgBouncer in front) and **network placement** (a database should live in a private subnet with no public IP; the only thing that reaches it is your application's security group).

### Load balancers

A load balancer terminates TLS, spreads requests across healthy instances in multiple availability zones, and — critically — *removes* instances that fail their health check. That last behaviour is what makes rolling deployments and instance failures invisible to users.

Sticky sessions are a smell. If a user must return to the same instance, that instance is holding state it should not; move sessions to Redis or a signed cookie and any instance can serve anyone.

### Regions, zones, and blast radius

A **region** is a geographic location; an **availability zone** is an isolated datacentre within it. Spreading across zones is cheap and protects against the single most common failure — one datacentre losing power or network. Spreading across regions is expensive and complicated, and is about disaster recovery, not uptime. Do multi-AZ first, and only consider multi-region when you can articulate the specific failure it protects against.

### The cost model

You pay per hour of compute, per gigabyte-month of storage, per request, and — the line that surprises everyone — **per gigabyte of data leaving the provider**. Egress is where a cheap-looking architecture becomes an expensive bill. Set a budget alert on day one, before the first invoice.
        `),
        lesson('Deploying a Node App for Real', 14, `
You have an image tagged with a commit SHA (Chapter 2) pushed by a pipeline (Chapter 3). Turning that into a service that survives deploys, restarts, and traffic takes four specific things in the application itself.

### 1. Take the port from the environment, bind to all interfaces

\`\`\`js
const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, '0.0.0.0');
\`\`\`

Platforms assign a port and pass it in; hardcoding one means the health check probes a port nothing is listening on. And as Chapter 2 established, \`127.0.0.1\` is unreachable from outside the container.

### 2. Health endpoints — and the difference between them

\`\`\`js
// Liveness: am I alive? Nothing else. Failing this restarts the process.
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Readiness: should I receive traffic right now?
app.get('/readyz', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});
\`\`\`

**The classic mistake is checking the database in the liveness probe.** A five-second database blip then fails liveness on every instance simultaneously, the platform restarts all of them, and a brief degradation becomes a full outage with a cold-start stampede on top. Liveness answers "is this process wedged?"; only readiness may depend on anything external.

### 3. Graceful shutdown

\`\`\`js
process.on('SIGTERM', () => {
  server.close(() => {          // stop accepting new connections, drain in-flight
    db.end().then(() => process.exit(0));
  });
  // Never hang forever waiting on a stuck socket
  setTimeout(() => process.exit(1), 10_000).unref();
});
\`\`\`

Every deploy sends \`SIGTERM\` and then \`SIGKILL\`s after a grace period. Without a handler, in-flight requests are severed and users see errors on every single deploy — the reason teams start deploying "only at night", which is exactly backwards.

Two supporting details: the exec-form \`CMD\` from Chapter 2, so Node is PID 1 and actually receives the signal; and a short delay before \`server.close()\` on platforms where load balancer deregistration is eventual, so no request is routed to an instance already closing.

### 4. Migrations are a deploy step, not a boot step

\`\`\`bash
# Correct: one run, before the new version starts serving
docker run --rm --env-file /etc/api.env ghcr.io/acme/api:9f3c1a2 npm run migrate
\`\`\`

Running migrations on application start means all five replicas race to apply the same migration on rollout. Some tools take an advisory lock and survive it; many corrupt the migration table instead. Make it an explicit, single, ordered step.

### Putting it together

\`\`\`bash
SHA="$(git rev-parse --short HEAD)"
docker build --platform linux/amd64 -t ghcr.io/acme/api:"$SHA" .
docker push ghcr.io/acme/api:"$SHA"

# On the target, or through your platform's CLI
docker run -d --name api-"$SHA" --restart unless-stopped \\
  --env-file /etc/api.env -p 3001:3000 ghcr.io/acme/api:"$SHA"

curl -fsS http://localhost:3001/readyz    # verify before shifting traffic
\`\`\`

### TLS and the proxy in front

Terminate HTTPS at the load balancer or at a reverse proxy such as Caddy or nginx with automatic certificates; do not put certificate handling in your application. When you do, tell Express so it reads the forwarded headers correctly:

\`\`\`js
app.set('trust proxy', 1);   // req.ip and req.protocol now reflect the real client
\`\`\`

Skip this and every client IP in your logs and rate limiter is the proxy's — so your rate limiter throttles the whole world as one user, or nobody at all.

### Zero downtime, concretely

Start the new version, wait for \`/readyz\`, add it to the load balancer, remove an old instance, repeat. This requires spare capacity (N+1) and — crucially — that both versions can run simultaneously against the same database, which is what the expand/contract migration pattern in Chapter 5 exists to guarantee.
        `),
        lesson('Infrastructure as Code', 13, `
Clicking through a cloud console creates infrastructure nobody can review, reproduce, or explain six months later. Infrastructure as code puts the same resources in a file, in git, in a pull request — subject to exactly the same review as application code.

### Declarative beats imperative

A shell script that calls \`aws ec2 run-instances\` is imperative: run it twice, get two servers. It has no idea what already exists.

Declarative tools describe the **desired state** and compute the difference themselves:

\`\`\`hcl
resource "aws_db_instance" "app" {
  identifier              = "app-prod"
  engine                  = "postgres"
  engine_version          = "16.3"
  instance_class          = "db.t4g.small"
  allocated_storage       = 20
  backup_retention_period = 7          # daily backups kept a week
  multi_az                = true       # standby in a second zone
  publicly_accessible     = false      # private subnet only
  vpc_security_group_ids  = [aws_security_group.db.id]
}
\`\`\`

Run it once and the database is created. Run it again and nothing happens, because reality already matches. This is **idempotence**, and it is what makes the file a trustworthy description of production rather than a historical record of commands somebody ran.

### Plan before apply

\`\`\`bash
terraform plan     # a diff: what will be created, changed, destroyed
terraform apply    # make it so
\`\`\`

\`plan\` output belongs in the pull request. The line that saves careers reads \`Plan: 1 to add, 0 to change, 1 to destroy\` next to a database resource — some attribute changes force replacement, and a reviewer who reads the plan catches it before it deletes production data. Read the destroy count every single time.

### State is the part that bites

The tool keeps a **state file** mapping your resource names to real cloud IDs. Two rules:

1. **Store it remotely with locking** (S3 plus DynamoDB, Terraform Cloud, GCS). Local state on a laptop means the next person's apply tries to recreate everything that already exists, and two simultaneous applies corrupt it.
2. **Never commit it.** State contains resource attributes in plaintext, including generated passwords and connection strings. It is a secrets file.

### Drift, and the rule that prevents it

Someone fixes an incident by changing a security group in the console. The code no longer matches reality. The next \`apply\` reverts their fix — often at the worst moment. **If it is in code, change it in code.** Emergency console changes are sometimes right; the discipline is to backport them the same day, and to run \`plan\` on a schedule so drift is detected rather than discovered.

### Environments are variables, not copies

\`\`\`hcl
module "api" {
  source        = "./modules/service"
  environment   = var.environment
  instance_size = var.instance_size    # t4g.small in staging, m7g.large in prod
  min_replicas  = var.min_replicas      # 1 in staging, 3 in prod
}
\`\`\`

Staging and production should be the *same module* with different variable files. Copy-pasting the configuration into two directories guarantees they diverge, and then staging stops predicting anything about production — which was the entire reason for having it.

### Immutable infrastructure

Do not patch running servers. Build a new image, launch new instances, remove the old ones. A server that has been modified in place for two years is a **snowflake** — unreproducible, and unrecoverable when its disk fails. Between container images and IaC you can rebuild the entire stack from a git repository, which is the real test: if the region disappeared tonight, could you recreate everything from what is committed?
        `),
      ],
      [
        q('An app writes user avatar uploads to local disk. It works with one instance. What breaks when you scale to three?', [
          'Disk writes become a CPU bottleneck',
          'The load balancer cannot health check instances that write files',
          'Nothing, as long as all instances are in the same availability zone',
          'Each instance has its own filesystem, so uploads are missing on the other two and vanish on redeploy',
        ], 3, 'Container filesystems are local and disposable, so shared user content belongs in object storage.'),
        q('Why should a liveness probe not query the database?', [
          'Health endpoints must respond in under 10ms',
          'A brief database outage fails liveness everywhere at once, restarting every instance and turning degradation into a full outage',
          'Database drivers cannot be used inside HTTP handlers',
          'Liveness probes run before the process has connected to anything',
        ], 1, 'Liveness answers whether the process itself is wedged; dependency checks belong in readiness, which removes traffic without restarting.'),
        q('What does a graceful SIGTERM handler that calls server.close() actually accomplish?', [
          'It prevents the platform from ever sending SIGKILL',
          'It flushes the application log buffer to disk',
          'It stops accepting new connections while letting in-flight requests finish, so deploys do not return errors to users',
          'It re-registers the instance with the load balancer',
        ], 2, 'Without draining, every rollout severs requests mid-flight and users see errors on each deploy.'),
        q('Why must Terraform state be stored remotely with locking rather than committed to git?', [
          'It contains plaintext resource attributes including secrets, and concurrent local applies corrupt it',
          'Git cannot store JSON files larger than 1MB',
          'Remote state runs the plan faster',
          'Terraform refuses to read state from a working directory',
        ], 0, 'State is effectively a secrets file and a shared lock target, so it needs a locked remote backend and must stay out of version control.'),
      ]
    ),
    chapter(
      'Operate It: Observability and Rollback',
      'Logs, metrics, alerts, and the deployment strategies that let you undo a bad release in minutes.',
      [
        lesson('Logs That Answer Questions', 13, `
The test of a logging setup is not how much it records. It is whether you can answer "what happened to order 4821 at 14:03?" with a single query, at 3am, without SSHing anywhere.

### Write to stdout and stop thinking about files

\`\`\`js
console.log(JSON.stringify({ level: 'info', msg: 'started' }));   // the container runtime captures this
\`\`\`

A containerised process should not manage log files. The runtime captures stdout and stderr and ships them to your log system. Writing to a file inside a container means the logs die with the container (Chapter 2) and quietly fill the host disk (Chapter 1) in the meantime.

### Structured, not prose

\`\`\`js
// Unsearchable: you can grep for it only if you remember the exact wording
console.log('User ' + userId + ' failed checkout: ' + err.message);

// Queryable: filter by field, aggregate, alert on it
import pino from 'pino';
const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });

logger.error(
  { event: 'checkout_failed', userId, orderId, requestId: req.id, err: err.message },
  'checkout failed'
);
\`\`\`

With structured logs, "how many checkout failures for this order, grouped by error" is a query. With prose it is a regular expression somebody writes during an incident and gets wrong.

### Levels, used consistently

| Level | Use for | Pages someone? |
|---|---|---|
| \`error\` | Broken for a user; needs investigation | Possibly |
| \`warn\` | Recovered, but suspicious — retry succeeded, fallback used | No |
| \`info\` | Business events — order placed, deploy started | No |
| \`debug\` | Developer detail, off in production | No |

If everything is \`error\`, nothing is. Reserve it for things you would genuinely act on.

### Correlation IDs make distributed logs readable

\`\`\`js
import { randomUUID } from 'node:crypto';

app.use((req, res, next) => {
  req.id = req.header('x-request-id') ?? randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});
\`\`\`

Attach \`requestId\` to every log line and forward the header on outbound calls. One request touching four services now produces one filterable trail instead of four disconnected streams you must correlate by timestamp — which does not work, because clocks disagree and concurrent requests interleave.

### The mistake with real consequences

\`\`\`js
logger.error({ body: req.body }, 'validation failed');   // just logged a password
\`\`\`

Logging the whole request body on error feels helpful and captures passwords, tokens, card numbers, and personal data into a system with broad read access and months of retention. It is the most common way sensitive data escapes an otherwise careful application. Redact explicitly:

\`\`\`js
const logger = pino({
  redact: ['req.headers.authorization', 'body.password', 'body.token', '*.cardNumber'],
});
\`\`\`

### Volume costs money

Log ingestion is usually billed per gigabyte. A \`debug\` line in a hot path can cost more per month than the server producing it. Keep \`debug\` off in production, sample high-volume success paths (log 1% of them), and set retention deliberately: 30 days hot for debugging, cheaper archival storage beyond that if compliance requires it.

### One habit worth building

When an incident ends, ask what one log line would have made the cause obvious in thirty seconds — then add it. Logging improved reactively, incident by incident, converges on exactly what you need far faster than logging designed up front.
        `),
        lesson('Metrics and Alerts That Do Not Cry Wolf', 14, `
Logs tell you about one request. **Metrics** tell you about all of them at once, cheaply, over time — and they are what alerts should be built on.

| Signal | Answers | Cost |
|---|---|---|
| Logs | What happened in this specific request | High per event |
| Metrics | How is the system behaving overall | Very low |
| Traces | Where did the time go across services | Medium, usually sampled |

### What to measure

**RED**, for every service you run: **R**ate (requests per second), **E**rrors (how many failed), **D**uration (how long they took). **USE**, for every resource: **U**tilisation, **S**aturation (queue depth), **E**rrors. Between them you can characterise almost any incident.

### Averages lie — this is the classic mistake

A thousand requests: 980 finish in 50ms, 20 take 5 seconds.

\`\`\`
mean = (980 x 0.05 + 20 x 5) / 1000 = 0.149s   -> "149ms, looks fine"
p50  = 0.05s      p99 = 5s
\`\`\`

The dashboard shows a comfortable 149ms while 2% of your users stare at a five-second page. At scale that 2% is thousands of people daily, and they are disproportionately your heaviest users, because slow requests correlate with large accounts. **Always chart p50, p95, and p99.** An average latency graph is worse than no graph, because it provides confidence you have not earned.

### Instrumenting a Node service

\`\`\`js
import client from 'prom-client';

client.collectDefaultMetrics();          // event loop lag, heap, GC

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 3],  // include your SLO threshold as a boundary
});

app.use((req, res, next) => {
  const done = httpDuration.startTimer();
  res.on('finish', () => {
    // req.route.path -> "/orders/:id", NOT "/orders/4821"
    done({ method: req.method, route: req.route?.path ?? 'unknown', status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
\`\`\`

**Label cardinality is the trap.** Each unique label combination is a separate stored time series. Using the raw path, or a user ID, as a label turns one metric into millions and takes down your monitoring system — often during the incident you needed it for. Labels must be low-cardinality: route templates, methods, status codes.

### SLOs turn opinions into arithmetic

Pick a target users would recognise: "99.9% of requests succeed in under 500ms, measured monthly". That allows **43 minutes** of budget per month. The error budget is not a failure allowance to avoid — it is a decision tool. Budget intact, ship faster. Budget burning, stop feature work and fix reliability.

### Alert on symptoms, not causes

\`\`\`yaml
# Bad: pages at 3am for a healthy autoscaling group doing its job
- alert: HighCPU
  expr: avg(cpu_usage) > 0.8

# Good: a user is currently having a bad time
- alert: HighErrorRate
  expr: sum(rate(http_requests_total{status=~"5.."}[5m]))
        / sum(rate(http_requests_total[5m])) > 0.02
  for: 5m
  annotations:
    summary: "Over 2% of requests failing for 5 minutes"
    runbook: "https://wiki.acme.dev/runbooks/api-errors"
\`\`\`

High CPU is not a problem; high CPU *with degraded latency* is. The \`for:\` clause suppresses momentary spikes, and every alert must carry a runbook link — a page that arrives with no instructions is a page that wakes someone up to read source code.

### Alert fatigue causes outages

If a pager fires ten times a week and nine are noise, the tenth is dismissed too. Delete or downgrade any alert that has not led to an action in three months. **Page only for things that are both urgent and actionable**; everything else is a dashboard or a ticket.
        `),
        lesson('Deploy Safely and Roll Back Fast', 13, `
Every deploy will eventually be a bad one. The measure of an operations practice is not how rarely that happens, it is how fast you can undo it — and rollback is a capability you build in advance, not improvise during an incident.

### Three rollout strategies

| Strategy | How it works | Blast radius | Rollback speed |
|---|---|---|---|
| **Rolling** | Replace instances a few at a time | Gradual, all users eventually | Minutes (roll forward the old tag) |
| **Blue/green** | Run both versions; flip traffic at once | All users instantly | Seconds — flip back |
| **Canary** | 5% of traffic to the new version, watch, widen | 5% of users | Seconds — drop the canary |

Canary plus automated metric checks is the strongest option: send 5% of traffic to the new version, compare its error rate and p95 against the old for ten minutes, and abort automatically if either regresses. Most bad deploys are then seen by a twentieth of your users for ten minutes instead of everyone for an hour.

### Immutable tags make rollback trivial

\`\`\`bash
# Because every build was tagged with its commit SHA (Chapter 2), the previous
# version still exists, byte for byte
docker run -d ghcr.io/acme/api:7d21b4e     # last known good
\`\`\`

This is why \`:latest\` was ruled out earlier: rolling back to it is meaningless, because it now points at the broken build. With SHA tags, rollback is "run the previous tag" — no rebuild, no branch, no waiting for CI.

### Feature flags separate deploying from releasing

\`\`\`js
if (flags.isEnabled('new-checkout', { userId })) {
  return newCheckout(req, res);
}
return legacyCheckout(req, res);
\`\`\`

Deploying is moving code to a server; releasing is exposing it to users. With a flag you can ship dark code all week, enable it for staff, then 1%, then everyone — and turn it off in **seconds** when something is wrong, without a deploy at all. Note the tradeoff: every flag is a branch that must be tested and eventually deleted. Flags are temporary by design.

### The thing that makes rollback impossible: your database

Code rolls back. Data does not. A migration that renames a column deploys fine, and the moment you roll the application back the old version queries a column that no longer exists — a total outage with no way out.

Use **expand/contract**, across three separate deploys:

\`\`\`sql
-- Deploy 1 (expand): additive only, old code is completely unaffected
ALTER TABLE users ADD COLUMN full_name TEXT;
-- Application writes both columns, reads the old one.

-- Deploy 2 (migrate): backfill, then switch reads to full_name.
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Deploy 3 (contract): days later, once rollback to v1 is off the table
ALTER TABLE users DROP COLUMN name;
\`\`\`

The rule: **every migration must leave the previous application version working.** Additive changes — new nullable columns, new tables, new indexes — are always safe. Renames, drops, and \`NOT NULL\` additions are never safe in a single step.

### Have a rollback runbook, and rehearse it

Write down: how to identify the currently deployed version, the exact command to deploy the previous one, how to verify recovery, and who to tell. Then actually run it on a quiet Tuesday. A rollback procedure that has never been executed is a hypothesis.

### During an incident: stop the bleeding first

Roll back, *then* diagnose. Debugging a live outage while users suffer is a decision people regret in the postmortem every time. Once service is restored, the artifact and logs are still there.

Afterwards, run a **blameless postmortem**: timeline, contributing factors, and concrete action items with owners. The useful question is never "who broke it" — it is "what made this failure possible, and what makes the next one visible faster?" That question, asked consistently, is what the whole practice comes down to.
        `),
      ],
      [
        q('Why is average response time a misleading metric to alert on?', [
          'Averages are expensive to compute at high request rates',
          'It cannot be computed per endpoint',
          'A small tail of very slow requests barely moves the mean, so a healthy-looking average can hide a p99 measured in seconds',
          'Averages ignore failed requests entirely',
        ], 2, 'With 980 requests at 50ms and 20 at 5s the mean is a comfortable 149ms while 2% of users wait five seconds — percentiles expose that, averages bury it.'),
        q('Adding userId as a Prometheus metric label causes what problem?', [
          'Each unique label combination creates a separate time series, so cardinality explodes and the metrics backend falls over',
          'Prometheus rejects string labels',
          'Metrics become unqueryable by route',
          'It doubles the scrape interval',
        ], 0, 'Metrics storage scales with the number of distinct label combinations, so high-cardinality labels must stay in logs and traces instead.'),
        q('A release renames a column with a single migration. Why is the application now impossible to roll back?', [
          'Migrations cannot be run twice',
          'The rollback would need a new image build',
          'Connection pools cache the old schema indefinitely',
          'The previous application version queries a column that no longer exists, so reverting the code produces an outage',
        ], 3, 'Code reverts but data does not, so every migration must leave the prior version working — hence expand, migrate, then contract.'),
        q('What is the main advantage of feature flags over redeploying to disable a broken feature?', [
          'They remove the need for staging environments',
          'A flag turns the feature off in seconds without a deploy, and can target a small subset of users first',
          'They make database migrations reversible',
          'They eliminate the need for canary releases',
        ], 1, 'Flags separate deploy from release, so exposure is controlled and reversible instantly rather than at the speed of a pipeline.'),
      ]
    ),
    chapter(
      'Orchestration with Kubernetes',
      'The object model, the resource and probe settings that decide whether a rollout is safe, and how to read a Pod that refuses to start.',
      [
        lesson('Pods, Deployments, and Services', 14, `
Kubernetes is a set of control loops. You declare the state you want in YAML, and controllers spend their entire lives comparing that declaration against reality and closing the gap. Nothing else about it makes sense until that sentence does — every "why did it come back after I deleted it?" question has the same answer.

### The four objects you touch daily

A **Pod** is one or more containers sharing a network namespace, an IP, and a lifecycle. It is the smallest schedulable unit, and you almost never write one by hand.

A **Deployment** declares "I want N Pods from this image". It creates a **ReplicaSet**, which creates Pods. Delete a Pod and the ReplicaSet replaces it within seconds — that is the control loop working, not a bug.

A **Service** is a stable virtual IP and DNS name in front of a changing set of Pods. Pods are cattle with random names and new IPs on every restart; the Service is the address that does not move.

An **Ingress** (or Gateway) maps hostnames and paths to Services and terminates TLS, filling the role the load balancer played in Chapter 4.

### A Deployment that is actually production-shaped

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }          # must match the template labels exactly
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: ghcr.io/acme/api:9f3c1a2    # SHA tag, never :latest (Chapter 2)
          ports: [{ containerPort: 3000 }]
          env:
            - name: PORT
              value: "3000"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef: { name: api-secrets, key: database-url }
\`\`\`

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector: { app: api }     # selects Pods by label, not by Deployment name
  ports:
    - port: 80               # what the Service listens on
      targetPort: 3000       # the port inside the container
\`\`\`

### Labels are the entire wiring system

Nothing in Kubernetes is connected by name. A Service does not know the Deployment exists; it selects Pods whose labels match, and anything wearing the right label is in.

**The classic mistake is a selector that does not match the template** — \`app: api\` on the Service and \`app: api-server\` on the Pods. Both objects apply cleanly, the Deployment reports three healthy replicas, and the Service returns connection refused because it sits in front of nothing at all. One command settles it:

\`\`\`bash
kubectl get endpoints api        # ENDPOINTS <none>  -> the selector matches no Pods
\`\`\`

### The commands that matter

\`\`\`bash
kubectl apply -f k8s/                    # declarative: converge to what the files say
kubectl get pods -l app=api -w           # watch them come up
kubectl rollout status deploy/api        # blocks until the rollout succeeds or fails
kubectl describe pod api-7d9f4c-xk2p9    # the Events list at the bottom explains most failures
kubectl port-forward svc/api 8080:80     # reach it locally without an Ingress
\`\`\`

Keep manifests in git and change them with \`apply\`, not with \`kubectl edit\` or \`kubectl set image\`. A cluster modified imperatively drifts from its manifests in exactly the way console-clicked infrastructure drifts from Terraform (Chapter 4), and the next \`apply\` silently reverts whoever was fixing an incident.

### Service types in one table

| Type | Reachable from | Use for |
|---|---|---|
| \`ClusterIP\` | Inside the cluster only | Service-to-service calls — the default, and usually right |
| \`NodePort\` | A fixed port on every node | Local clusters, rarely production |
| \`LoadBalancer\` | The internet, via a cloud LB | One public entry point |
| \`Ingress\` | The internet, by host and path | Many services behind one load balancer and one certificate |

Inside the cluster, \`api\` resolves from the same namespace and \`api.prod.svc.cluster.local\` from anywhere. That is the same rule Compose taught in Chapter 2: services find each other by name, and \`localhost\` inside a Pod is still only that Pod.

### Namespaces are not a security boundary

Namespaces partition names, quotas, and RBAC. They do **not** isolate the network by default — every Pod can reach every other Pod across every namespace until you say otherwise, which is the NetworkPolicy work in Chapter 7.
        `),
        lesson('Resources, Probes, and Safe Rollouts', 15, `
Two numbers and three probes decide whether your service survives a busy node and a bad release. Almost every "Kubernetes is unstable" complaint traces back to one of them being unset.

### Requests and limits are different things

\`\`\`yaml
resources:
  requests: { cpu: "100m", memory: "256Mi" }   # what the scheduler reserves for you
  limits:   { memory: "512Mi" }                # hard ceiling enforced at runtime
\`\`\`

**Requests** are a scheduling contract: the scheduler only places the Pod on a node with that much unclaimed capacity. **Limits** are enforced while running, and CPU and memory are enforced in completely different ways:

| Resource | Over the limit | What you observe |
|---|---|---|
| CPU | Throttled by the kernel | Latency spikes, p99 collapses, no errors, nothing in the log |
| Memory | Process killed immediately | Exit code 137, reason \`OOMKilled\`, container restarts |

That asymmetry drives the practical rule: always set memory requests and limits, always set a CPU request, and think hard before setting a CPU limit at all. A tight CPU limit throttles a service while the node has idle cores, and produces the worst class of incident — slow, intermittent, and invisible to every error-rate alert you built in Chapter 5.

**Setting neither requests nor limits is the classic mistake.** The Pod lands in the \`BestEffort\` quality class, the scheduler happily packs eight of them onto one node, they starve each other under load, and they are first in line for eviction when the node comes under pressure.

### Three probes, and why the startup one exists

\`\`\`yaml
startupProbe:   { httpGet: { path: /healthz, port: 3000 }, periodSeconds: 2, failureThreshold: 30 }
livenessProbe:  { httpGet: { path: /healthz, port: 3000 }, periodSeconds: 10, failureThreshold: 3 }
readinessProbe: { httpGet: { path: /readyz,  port: 3000 }, periodSeconds: 5 }
\`\`\`

Chapter 4 set the rule: readiness may check dependencies, liveness must not. Kubernetes adds a third probe for a specific failure. A service that takes forty seconds to warm a cache fails liveness during startup, gets restarted, and never finishes starting — a \`CrashLoopBackOff\` that looks like a crash but is pure probe misconfiguration. The \`startupProbe\` suspends the other two until the app answers once, buying sixty seconds here (30 × 2s) without weakening steady-state detection afterwards.

### Rollouts have a capacity knob

\`\`\`yaml
strategy:
  rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
\`\`\`

\`maxUnavailable: 0\` means never drop below the declared replica count: a new Pod must go Ready before an old one is removed. It needs room for one extra Pod, which is Chapter 4's N+1 rule expressed as configuration.

\`\`\`bash
kubectl rollout status deploy/api --timeout=120s || kubectl rollout undo deploy/api
\`\`\`

That one line is Chapter 5's rollback as a pipeline step. Kubernetes keeps the previous ReplicaSet precisely so \`undo\` is a scale-up of something that already exists rather than a rebuild.

### The drain race that costs you a few requests per deploy

On shutdown the kubelet sends \`SIGTERM\`, waits \`terminationGracePeriodSeconds\` (30 by default), then \`SIGKILL\`s. Your handler from Chapter 4 is what uses that window, and the exec-form \`CMD\` from Chapter 2 is what lets the signal reach Node at all.

But endpoint removal and \`SIGTERM\` happen **concurrently**, propagating to every node asynchronously. The Pod can stop accepting connections a moment before the last proxy stops routing to it:

\`\`\`yaml
lifecycle:
  preStop: { exec: { command: ["sleep", "5"] } }   # let endpoint removal propagate first
\`\`\`

Without that pause, every rollout scatters a handful of 502s — the well-known "we lose a few requests on each deploy and nobody knows why".

### Autoscale on a signal that means something

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
\`\`\`

The HPA computes utilisation against the **request**, so an HPA on a Pod with no CPU request does nothing at all. And CPU is a weak proxy for a Node service that spends its time waiting on I/O — scale on requests per second or queue depth when you can measure them.
        `),
        lesson('Debugging a Pod That Will Not Start', 14, `
The failure states are a short, finite list, and each has a distinct signature. Learn the triage order and most "Kubernetes is broken" tickets resolve in ninety seconds.

### The triage sequence, always in this order

\`\`\`bash
kubectl get pods -l app=api            # 1. what state, and how many restarts
kubectl describe pod api-7d9f4c-xk2p9  # 2. read the Events at the bottom first
kubectl logs api-7d9f4c-xk2p9 --previous   # 3. the container that died, not the new one
kubectl get events --sort-by=.lastTimestamp | tail -20
\`\`\`

**Forgetting \`--previous\` is the classic mistake.** A \`CrashLoopBackOff\` Pod restarted two seconds ago, so plain \`kubectl logs\` shows the *current* attempt, which has printed nothing yet — and people conclude the application logs nothing. \`--previous\` shows the container that actually failed, where the stack trace is.

### What each state means

| Status | Means | Where to look |
|---|---|---|
| \`Pending\` | No node can fit it | \`describe\` events: insufficient cpu/memory, unbound volume, taints |
| \`ImagePullBackOff\` | The registry said no | Tag typo, private repo with no imagePullSecret, wrong architecture |
| \`CrashLoopBackOff\` | Starts, exits, repeats with backoff | \`logs --previous\`, then the exit code |
| \`Running\` but \`0/1 READY\` | Readiness probe failing | Probe path and port, and the dependency it checks |
| \`CreateContainerConfigError\` | A referenced Secret or ConfigMap key is missing | The \`valueFrom\` blocks in the manifest |
| \`Terminating\` for minutes | Nothing handled SIGTERM | PID 1 and the exec-form \`CMD\` (Chapter 2) |

### Exit codes carry real information

| Code | Meaning |
|---|---|
| 0 | Clean exit — and a Deployment restarts it anyway; long-running means long-running |
| 1 | Uncaught application error; the log has it |
| 137 | 128+9, SIGKILL — almost always \`OOMKilled\` |
| 139 | 128+11, segfault — usually a native module built for the wrong architecture |
| 143 | 128+15, SIGTERM — a normal, graceful stop |

\`\`\`bash
kubectl get pod api-7d9f4c-xk2p9 -o jsonpath='{.status.containerStatuses[0].lastState.terminated}'
# {"exitCode":137,"reason":"OOMKilled","startedAt":"2026-08-19T09:14:02Z"}
\`\`\`

\`OOMKilled\` means this container exceeded **its own memory limit**, not that the node ran out. Raise the limit or fix the leak; Node's heap grows to fill whatever it is given, so a container limit slightly above your expected heap plus overhead is the setting you want.

### Configuration failures look like crashes

This is where the boot-time validation from Chapter 3 earns its keep. A process that exits immediately with \`Missing required env vars: JWT_SECRET\` turns a mystery into a one-line answer in \`logs --previous\`. A process that starts happily and throws \`undefined\` on one endpoint two hours later gives you nothing at all.

### Getting inside a Pod

\`\`\`bash
kubectl exec -it api-7d9f4c-xk2p9 -- sh
kubectl debug -it api-7d9f4c-xk2p9 --image=nicolaka/netshoot --target=api
\`\`\`

Distroless and scratch images have no shell, so \`exec\` fails outright — exactly the images Chapter 7 recommends. \`kubectl debug\` attaches an ephemeral container that shares the Pod's namespaces, giving you a full toolbox against the real network and process view without changing the image.

### Split the question: is it the app or the wiring?

\`\`\`bash
kubectl port-forward pod/api-7d9f4c-xk2p9 8080:3000   # bypasses Service and Ingress entirely
curl -fsS http://localhost:8080/readyz
kubectl run tmp --rm -it --image=busybox --restart=Never -- wget -qO- http://api/healthz
\`\`\`

If the port-forward to the Pod works and the Service does not, the fault is labels, ports, or readiness. If the Pod itself fails, it is your application and the cluster is innocent. Answering that one question before you touch Ingress, DNS, or certificates is what turns a lost afternoon into ten minutes.
        `),
      ],
      [
        q('A Deployment reports three healthy Pods, but requests to its Service are refused and `kubectl get endpoints api` shows `<none>`. What is wrong?', [
          'The Service needs a NodePort before it can route traffic',
          'The Pods have no readiness probe, so they are never considered ready',
          "The Service's label selector does not match the Pod template labels, so it fronts no Pods",
          'targetPort and containerPort must be identical for routing to work',
        ], 2, 'Everything in Kubernetes is wired by labels, so a selector matching nothing produces a Service with an empty endpoint list and no backend to forward to.'),
        q('Why is exceeding a CPU limit a different class of problem from exceeding a memory limit?', [
          'CPU is throttled, so the symptom is silent latency, while memory over-limit kills the container with exit code 137',
          'CPU limits are advisory and used only by the scheduler, while memory limits are enforced',
          'Memory is throttled while CPU over-limit causes the Pod to be evicted from the node',
          'Both restart the container, but CPU restarts wait for the grace period first',
        ], 0, 'Throttling degrades latency without producing a single error, so a tight CPU limit causes incidents that no error-rate alert will ever catch.'),
        q('A service needs 40 seconds to warm its cache and its Pods sit in CrashLoopBackOff, although the application never throws. What fixes it?', [
          'Increase the replica count so at least one Pod is always warm',
          'Move the warm-up work into the readiness probe handler',
          'Raise terminationGracePeriodSeconds so shutdown has more time',
          'Add a startupProbe, which suspends liveness and readiness until the app answers once',
        ], 3, 'The liveness probe is killing a legitimately slow start, and a startupProbe gives a bounded warm-up window without weakening steady-state liveness checks.'),
        q('A Pod is in CrashLoopBackOff and `kubectl logs` prints nothing. Why?', [
          'Logs are only retained for Pods in the Running state, so use describe instead',
          'You are reading the container that just restarted and has not logged yet; `kubectl logs --previous` shows the one that died',
          'CrashLoopBackOff suppresses stdout capture until the backoff expires',
          'The node needs the json-file log driver enabled to capture crashed containers',
        ], 1, 'Each restart starts a fresh container with an empty log, so the stack trace lives in the previous container instance.'),
      ]
    ),
    chapter(
      'Harden It: Supply Chain, Scale, and Cost',
      'Proving that what you run is what you built, surviving a traffic spike without taking the database with you, and keeping the bill and the blast radius small.',
      [
        lesson('Securing the Supply Chain', 14, `
Your own code is a small fraction of what you deploy. A typical Node image is a base operating system, several hundred transitive dependencies, and a handful of third-party CI actions — every one of them code that runs in production with your credentials.

### Scan in the pipeline, with a threshold people will accept

\`\`\`yaml
- name: Scan the image we just built
  uses: aquasecurity/trivy-action@0.24.0
  with:
    image-ref: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
    severity: CRITICAL,HIGH
    exit-code: '1'           # fail the build, do not just print a report
    ignore-unfixed: true     # no patch exists yet, so blocking achieves nothing
\`\`\`

\`ignore-unfixed\` is the difference between a gate a team respects and one somebody disables in week two. A build that fails on forty unfixable advisories teaches people that the scanner is noise, and then the one exploitable finding scrolls past with the rest.

Most findings come from the base image rather than your code, so the highest-leverage fix is a smaller base. \`node:20-alpine\` carries a fraction of the packages of \`node:20\`, and a distroless runtime image has no shell and no package manager — nothing for an attacker to pivot with once inside.

### Pin by digest, not by tag

\`\`\`dockerfile
FROM node:20-alpine@sha256:0f2a1b6d7c...   # this exact image, permanently
\`\`\`

\`node:20-alpine\` is a moving pointer, the same problem as \`:latest\` in Chapter 2. Pinned by digest, a rebuild during an incident produces the bytes you tested rather than whatever the publisher pushed this morning. Upgrade deliberately with a bot that opens a pull request — Renovate or Dependabot — so the base image bump gets reviewed and tested like any other change.

### Sign what you build, verify what you run

\`\`\`bash
# Keyless: the signing identity is the CI job's OIDC token. No key to steal.
cosign sign --yes ghcr.io/acme/api@sha256:0f2a1b6d7c...

cosign verify ghcr.io/acme/api@sha256:0f2a1b6d7c... \\
  --certificate-identity-regexp '^https://github.com/acme/' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
\`\`\`

A signature answers one question: did *our* pipeline build these exact bytes? Enforce it with an admission policy and an attacker who steals registry credentials still cannot get their image to run, because it was never signed by your build identity. Generate an **SBOM** alongside it, so that when the next headline vulnerability lands, "which of our services ship this library?" is a query rather than a week of grep.

### Least privilege in three places

| Boundary | Weak version | Strong version |
|---|---|---|
| CI → cloud | Long-lived access key in a repo secret | OIDC federation, a token valid for minutes (Chapter 3) |
| Container → host | Runs as root with full capabilities | Non-root user, read-only filesystem, capabilities dropped |
| Workload → cloud | One shared account with broad rights | Per-service identity scoped to the buckets and queues it uses |

\`\`\`yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true       # mount an emptyDir at /tmp if you need scratch space
  capabilities: { drop: ["ALL"] }
\`\`\`

A web service needs none of the Linux capabilities. The one thing this reliably breaks is an application that writes into its own directory, and the fix is a writable volume mounted exactly where it writes — not turning the flag back off.

### Default-deny the network

Chapter 6 noted that namespaces do not isolate traffic: by default every Pod can open a connection to every other Pod, and often to the database Chapter 4 put in a private subnet. A default-deny NetworkPolicy plus explicit allows turns a single compromised service into a single compromised service, rather than a foothold with cluster-wide reach.

### The classic mistake: mistaking the scan report for a security programme

A clean Trivy run says nothing about an admin route with no authorization check, a deploy token pasted into a chat channel, or a public storage bucket. Scanners find known vulnerabilities in known packages, which is real but narrow work. Short-lived credentials, least privilege, network segmentation, and the secret rotation from Chapter 3 are design decisions — and design is where the incidents actually come from.
        `),
        lesson('Scaling and Resilience Under Load', 15, `
Capacity questions are answered by measurement, never by intuition. Before you scale anything you need one number: how many requests per second does a single instance serve, at acceptable latency, before it degrades?

### Load test to find the knee

\`\`\`js
// k6 run load.js  — run it against staging with production-shaped data
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },    // warm up
    { duration: '2m',  target: 200 },   // push well past expected peak
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // under 1% errors
    http_req_duration: ['p(95)<500'],   // the SLO from Chapter 5, as a pass/fail gate
  },
};

export default function () {
  const res = http.get('https://staging.acme.dev/api/orders?limit=20');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
\`\`\`

You are looking for the **knee**: the point where added load stops adding throughput and starts adding only latency. Below it, more traffic means more work done; above it, requests queue and every user waits. Testing against an empty database is the usual way to get a meaningless answer — a table with a thousand rows never reveals the missing index that matters at ten million.

The most common surprise is that the knee is not CPU. For a Node service it is usually the database connection pool.

### Fix the ceilings before you add replicas

**The connection pool.** Chapter 4's arithmetic bites hardest here: 10 replicas with a pool of 20 is 200 connections, against a Postgres default of 100. An autoscaler that adds replicas during a spike then takes the database down at precisely the worst moment. Put PgBouncer in front, and size the per-instance pool as \`max_connections / max_replicas\` on purpose.

**Local state.** In-memory sessions, per-process caches, rate-limit counters, and cron jobs that fire on every replica all behave differently the moment there are three of you.

**N+1 queries.** A request issuing 200 queries does not need more replicas; it needs a join. Scaling out an inefficient request multiplies load on the one component you cannot easily scale.

### Timeouts, retries, and the retry storm

Every outbound call needs a timeout. Without one, a slow dependency turns into exhausted sockets and a queue of requests that will never be answered.

\`\`\`js
const res = await fetch(url, { signal: AbortSignal.timeout(2000) });   // never wait forever
\`\`\`

Retries need **exponential backoff with jitter**:

\`\`\`js
async function withRetry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1 || !isRetryable(err)) throw err;
      const backoff = 200 * 2 ** i;              // 200ms, then 400ms before the final attempt
      const jitter = Math.random() * backoff;    // spread the herd apart
      await new Promise((r) => setTimeout(r, backoff + jitter));
    }
  }
}
\`\`\`

**Retrying without backoff is the classic mistake, and it is how a small problem becomes an outage.** A dependency slows down, every client immediately retries three times, the struggling dependency now receives four times its normal traffic, and it stops answering entirely. Jitter matters as much as backoff: without it every instance retries in the same millisecond and recreates the spike it was meant to smooth. Retry only idempotent operations, or carry an idempotency key — retrying a POST that charged a card charges it twice.

### Shed load rather than queueing it

When a dependency is failing, fail fast. A **circuit breaker** opens after N consecutive failures, rejects immediately for thirty seconds, then lets a single request through to test recovery. It protects *you*, by not spending your event loop and your sockets waiting on something that will not answer.

The same logic applies to your own front door. If concurrent requests exceed known capacity, return 503 with \`Retry-After\` instead of accepting work you cannot finish. A service that answers 80% of requests in 200ms beats one that answers 100% of them in 30 seconds, because at 30 seconds the client has already given up — and retried.

### Cache with a plan for the stampede

A CDN in front of static assets and cacheable GETs, Redis for computed results, and in-process memory only for tiny hot lookups you can tolerate being stale per replica. Always set a TTL. The failure mode to design for is the **cache stampede**: a popular key expires, five hundred concurrent requests all miss, and all five hundred hit the database in the same instant. Single-flight locking or stale-while-revalidate turns that thundering herd back into one query.
        `),
        lesson('Cost, Capacity, and the Readiness Review', 13, `
A cloud bill is not a finance problem, it is an architecture readout. Every line item names a decision somebody made, and the expensive ones are almost never the instance type.

### Where the money actually goes

| Line item | Usual driver | First fix |
|---|---|---|
| Compute | Instances sized for a peak that never comes | Right-size from p95 utilisation |
| Egress | Cross-zone chatter, assets served by the app | CDN, keep traffic in-zone, compress |
| Logs and metrics | \`debug\` in a hot path, high-cardinality labels | Sample, shorten retention, drop labels (Chapter 5) |
| Storage | Snapshots and build artifacts nobody deletes | Lifecycle rules from day one |
| Non-production | Staging identical to prod, running 24/7 | Schedule it off nights and weekends |

The largest saving in most accounts is not a cheaper instance type, it is switching off what nobody is using. Staging that runs all week sits idle for roughly 128 of 168 hours. The arithmetic on right-sizing is worth doing explicitly too: moving twenty instances from an 8 vCPU type at about \$0.32/hour to a 4 vCPU type at \$0.16 saves 0.16 × 20 × 730 ≈ \$2,300 a month — and if p95 CPU was 20%, you gave up no headroom at all.

### Size from percentiles, not from anxiety

Chapter 5's lesson about percentiles applies to capacity as much as to latency. Look at p95 utilisation over a fortnight, add headroom for the rollout surge (Chapter 6's \`maxSurge\`) and for one zone failing, and size to that. Sizing to the highest number you ever saw means paying every hour of every month for a Black Friday that happens once.

**Spot or preemptible instances** run 60–90% cheaper and can be reclaimed at short notice — two minutes on AWS, about thirty seconds on Google Cloud and Azure. That is a good trade for CI runners, batch jobs, and stateless replicas behind a queue. It is never a trade for your database.

Tag every resource with owner, service, and environment before the first invoice arrives. Untagged infrastructure produces a bill that is one line called "compute", which nobody can act on and therefore nobody does.

### Autoscaling is a cost control, not only a capacity one

Scaling out is the half everyone configures; scaling *in* is the half that saves money. Set a stabilisation window so scale-in is slower than scale-out — otherwise a two-minute lull removes capacity you need again ninety seconds later, and you pay for the cold start twice.

### The production readiness review

Before a service takes real traffic, walk one checklist honestly:

- Does it run a SHA-tagged image, built exactly once by the pipeline? (Chapters 2, 3)
- Is config read from the environment and validated at boot, with secrets injected at runtime? (Chapter 3)
- Are there separate \`/healthz\` and \`/readyz\` endpoints, with liveness independent of every dependency? (Chapter 4)
- Does it handle \`SIGTERM\` gracefully, with an exec-form \`CMD\` so the signal actually arrives? (Chapters 2, 4)
- Are requests and limits set, and does the autoscaler use a signal that means something? (Chapter 6)
- Structured logs with a request ID and redaction, and RED metrics charted at p50, p95, p99? (Chapter 5)
- At least one symptom-based alert, carrying a runbook link? (Chapter 5)
- A rehearsed rollback, and migrations that follow expand/contract? (Chapter 5)
- Backups — and a restore you have personally performed?
- A named owner, an on-call rotation, and a written escalation path?

**The last two are the ones teams skip, and they are the expensive ones.** A backup nobody has restored is a belief rather than a backup, and the discovery that it has been writing empty files for six weeks always happens on the day you need it. A service with no named owner is a service where every alert is somebody else's problem, right up until it is everybody's incident.

### Where to go from here

Take one service you already run and put it through that checklist. Fix what fails, in the order the list is written, and you will have done more for its reliability than any new tool would have.

The tools in this course are all replaceable — a different registry, a different CI system, a different orchestrator next year. The four habits underneath them are not: ship small batches, keep exactly one automated road to production, deploy an artifact you can identify by commit, and rehearse the rollback before you need it. Everything else is detail.
        `),
      ],
      [
        q('Why pin a base image by digest (`node:20-alpine@sha256:...`) rather than by tag?', [
          'Digests pull faster because the registry skips a manifest lookup',
          'A tag is a moving pointer, so the same Dockerfile can produce a different image tomorrow than the one you tested',
          'Signing an image requires that its base was referenced by digest',
          'Private registries do not support tags on base images',
        ], 1, 'Tags are mutable, so tag-based builds are not reproducible and a rebuild during an incident can quietly ship a base image nobody has tested.'),
        q('A dependency slows down and every caller immediately retries three times. What happens?', [
          'Very little, because failed requests are cheap and return quickly',
          'The callers deadlock waiting on each other, which a longer timeout resolves',
          'The dependency autoscales to absorb the retries, so latency recovers on its own',
          'The struggling dependency receives several times its normal load, which is why retries need exponential backoff with jitter and must be limited to idempotent calls',
        ], 3, 'Unbacked-off retries multiply traffic against a service that is already failing, turning a slowdown into a full outage.'),
        q('An image scan reports zero CRITICAL and HIGH vulnerabilities. What does that establish?', [
          'Very little on its own — scanners find known flaws in known packages, not missing authorization, exposed routes, or leaked credentials',
          'That the service is safe to expose publicly without a network policy',
          'That the base image does not need updating this quarter',
          'That runtime privileges can be relaxed, since the packages are patched',
        ], 0, 'Vulnerability scanning covers one narrow class of risk, while least privilege, segmentation, and short-lived credentials are design work no scanner evaluates.'),
        q('Staging runs 24/7 on production-sized instances. What is the most effective first cost action?', [
          'Move staging to a cheaper region',
          'Cut staging log retention to one day',
          'Schedule it off outside working hours, since you are paying for roughly 128 of 168 hours a week that nobody uses',
          'Buy reserved capacity for staging to lock in a discount',
        ], 2, 'Idle non-production environments are usually the largest easy saving, and reserving capacity you do not need simply commits you to the waste.'),
      ]
    ),
  ],
  final: [
    q('Which pair of DORA metrics move together in high-performing teams, rather than trading off?', [
      'Deployment frequency and time to restore service — speed and stability improve together',
      'Deployment frequency and change failure rate, which must be traded against each other',
      'Lead time and team size',
      'Change failure rate and number of environments',
    ], 0, 'The research finding is that shipping more often and recovering faster reinforce each other, because both come from small batches and automation.'),
    q('What actually isolates a container from the host and from other containers?', [
      'A lightweight hypervisor bundled with the runtime',
      'A separate guest kernel per container',
      'A chroot jail and a firewall rule',
      'Kernel namespaces for its view of processes and network, plus cgroups for resource limits',
    ], 3, 'Containers share the host kernel; namespaces restrict what the process can see and cgroups cap what it can consume.'),
    q('Why does copying package.json and running npm ci before copying source code speed up rebuilds?', [
      'npm ci skips the lockfile when run early',
      'The dependency layer stays cached because its inputs did not change when source files did',
      'Docker runs early instructions in parallel',
      'Alpine images cache node_modules on the host',
    ], 1, 'Layer cache keys are content-based, so ordering stable inputs before volatile ones keeps the expensive layer valid.'),
    q('A pipeline runs `docker build` separately for staging and for production. What is wrong?', [
      'It uses twice the registry storage',
      'Production images must be built on a production runner',
      'The two builds can differ, so the artifact tested in staging is not the artifact running in production',
      'Docker cannot tag the same Dockerfile twice',
    ], 2, 'Base images and transitive dependencies move between builds; only promoting one identical artifact preserves what testing proved.'),
    q('Where should a runtime secret such as DATABASE_URL come from?', [
      'Injected as an environment variable at container start, from a secret manager or CI secret store',
      'A build ARG so it is available to the whole image',
      'A .env file committed alongside .env.example for consistency',
      'Hardcoded in config.js and excluded from the repository search index',
    ], 0, 'Image layers are immutable and readable, so anything baked in at build time is permanently exposed; runtime injection keeps it out of the artifact.'),
    q('Why must a service take its listening port from PORT and bind 0.0.0.0 rather than 127.0.0.1?', [
      'Node cannot bind loopback in production mode',
      'It halves TLS handshake time',
      'Only 0.0.0.0 supports IPv6 clients',
      'The platform assigns the port, and loopback is unreachable from outside the container so health checks and published ports fail',
    ], 3, 'Loopback only accepts connections from inside the same network namespace, so nothing outside the container can ever reach it.'),
    q('What does `terraform plan` protect you from that `terraform apply` alone does not?', [
      'Syntax errors in the configuration',
      'Applying with stale provider credentials',
      'Seeing that an innocuous-looking attribute change will destroy and recreate a database before it happens',
      'Two engineers applying at the same time',
    ], 2, 'Some attribute changes force resource replacement, and the destroy count in the plan is the review step that catches it.'),
    q('Why should a readiness probe check the database but a liveness probe must not?', [
      'Readiness probes run less frequently than liveness probes',
      'Failing liveness restarts every instance at once during a database blip, escalating degradation into a total outage',
      'Liveness probes cannot make network calls',
      'Readiness probes are cached by the load balancer',
    ], 1, 'Readiness removes an instance from rotation temporarily; liveness kills the process, so dependency failures must never drive it.'),
    q('Which change is safe to deploy in a single migration while keeping the previous app version working?', [
      'Adding a new nullable column',
      'Renaming an existing column',
      'Adding NOT NULL to an existing column',
      'Dropping a column the new version no longer reads',
    ], 0, 'Additive changes leave the old code path intact, which is exactly what makes an application rollback possible.'),
    q('An alert fires whenever CPU exceeds 80% and has never once led to an action. What should you do?', [
      'Raise the threshold to 95% and keep paging',
      'Route it to a second on-call engineer for confirmation',
      'Add a longer for: duration and keep it as a page',
      'Replace it with a symptom-based alert on error rate or p95 latency, and stop paging on the cause',
    ], 3, 'Pages must be urgent and actionable; alerting on user-visible symptoms rather than resource causes is what prevents alert fatigue.'),
    q('Deleting a Pod that a Deployment created brings back an identical one within seconds. Why?', [
      'The kubelet replays the last container image it cached on that node',
      'kubectl delete only removes the Pod from the Service endpoint list',
      'A controller continuously reconciles actual state toward the declared replica count, so it recreates the missing Pod',
      'Pods are immutable and cannot be deleted while a Service selects them',
    ], 2, 'Kubernetes is a set of control loops closing the gap between declared and actual state, so removing something permanently means changing the declaration.'),
    q('A container is killed with exit code 137 and the reason OOMKilled. What happened?', [
      'It exceeded its own memory limit and was killed, so raise the limit or fix the leak',
      'The node ran out of disk and the kubelet evicted it',
      'The liveness probe failed three consecutive times',
      'The image was built for the wrong CPU architecture',
    ], 0, '137 is 128+9, a SIGKILL, and the OOMKilled reason points at this container passing its own memory limit rather than at any node-level pressure.'),
    q('Why can autoscaling an API from 5 to 20 replicas take the database down instead of absorbing the traffic?', [
      'More replicas multiply cross-zone egress charges until the network saturates',
      'The HPA scales on CPU, which a Node process cannot report accurately',
      'Rolling updates run any pending migration once per replica',
      'Each replica opens its own connection pool, so total connections multiply past the database limit',
    ], 3, 'Connections scale with replicas — a pool of 20 across 20 replicas is 400 against a Postgres default of 100 — so size the pool per replica or put a pooler in front.'),
    q('What does signing an image and verifying that signature at admission actually prevent?', [
      'A dependency with a known CVE from reaching production',
      'An attacker holding registry credentials from getting an unauthorised image to run in your cluster',
      'A secret baked into a build layer from being extracted later',
      'A rollout from continuing when the readiness probe fails',
    ], 1, 'A signature attests to provenance — that your pipeline produced these exact bytes — so only images your build identity signed are ever admitted.'),
  ],
});
