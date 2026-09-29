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
        `,
        [
          q('You want to measure lead time for changes today, using data you already have. What do you compare?', [
            'The number of commits in the last thirty days against the number of deploys',
            'How long the average pull request stayed open before it was approved',
            'The interval between the last two production releases',
            'The commit timestamp of the revision currently deployed against the timestamp of the deploy that shipped it',
          ], 3, 'Lead time is the commit-to-production gap, and git log -1 --format=%cI HEAD plus your pipeline deploy record already give you both ends of it.'),
          q('How do the ideas of flow and feedback differ?', [
            'Flow applies to developers and feedback applies to operations',
            'Flow is about tooling choices, feedback is about team culture',
            'Flow is making work move left to right without waiting; feedback is making problems visible fast and close to whoever caused them',
            'Flow is measured by deployment frequency and feedback by change failure rate',
          ], 2, 'Flow removes waiting from the path to production, while feedback shortens the distance between a mistake and the signal that it happened.'),
          q('A team adopts Kubernetes before it has a build that produces the same artifact twice. What does that get them?', [
            'The original reproducibility problem, plus a distributed systems problem on top of it',
            'A slower pipeline but a more reliable production environment',
            'No change until they also adopt infrastructure as code',
            'Better DORA numbers, because orchestration shortens lead time',
          ], 0, 'Tooling layered on an unrepeatable build does not repair the build; it adds a second class of failure to debug alongside the first.'),
        ]
      ),
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
        `,
        [
          q('A service runs perfectly for weeks, then the machine reboots at 3am and it never comes back. What was most likely missed?', [
            'systemctl daemon-reload after the unit file was written',
            'systemctl enable, which is what makes a unit start automatically on boot',
            'A restart policy in the Dockerfile',
            'Persistent journald storage, so the unit lost its recorded state',
          ], 1, 'start runs a unit now, enable is what links it into the boot sequence, and forgetting the second one is invisible until a reboot.'),
          q('Which octal mode gives the owner read and write, the group read only, and everyone else nothing?', [
            '750',
            '660',
            '640',
            '604',
          ], 2, 'Read is 4 and write is 2, so the owner is 6, the group is 4, and others are 0.'),
          q('A production box is alerting on a full root filesystem. Which pair of commands narrows it down fastest?', [
            'df -h to find which filesystem is full, then du -sh /var/log/* | sort -h to find what is eating it',
            'top -o %MEM followed by ps aux to find the process responsible',
            'journalctl -u api -f followed by systemctl restart api',
            'ls -l /var/log then chmod 640 on the largest file',
          ], 0, 'df identifies the filesystem and du attributes the usage inside it, which is the fastest route to the log directory that is almost always the cause.'),
        ]
      ),
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
        `,
        [
          q('Why does `sort | uniq -c` need the sort, when uniq is the part doing the counting?', [
            'sort converts the stream into the tab-separated format uniq expects',
            'uniq requires numeric input before it can count',
            'uniq only collapses adjacent duplicate lines, so unsorted input produces one count per run rather than one per value',
            'Without sort, uniq counts characters instead of whole lines',
          ], 2, 'uniq compares each line only against the one before it, so identical lines scattered through the file are counted separately.'),
          q('A health check script runs `curl -sS https://api.example.com/healthz` and reports a service healthy while it is returning 500. What is missing?', [
            '-f, which makes curl exit non-zero on an HTTP error status',
            '--max-time, so a hung request cannot report success',
            '-o /dev/null, so the error page is not treated as output',
            '-L, so the redirect to the real health endpoint is followed',
          ], 0, 'Without -f, curl considers fetching an error page a success and exits 0, so the script never sees the failure.'),
          q('A deploy script creates a temporary directory and switches on maintenance mode. Which construct guarantees cleanup even when it exits early on an error?', [
            'Putting the cleanup commands on the last line of the script',
            'Running the script under set -e so failures stop it immediately',
            'Wrapping the body of the script in a subshell',
            'A `trap ... EXIT` handler, which runs whichever path the script exits by',
          ], 3, 'EXIT traps fire on success, on an error under set -e, and on an early return alike, which is the only way cleanup is unconditional.'),
        ]
      ),
        lesson('Networking From the Command Line', 14, `
Every "it cannot connect" ticket is the same four questions asked in order: does the name resolve, is anything listening, can packets get through, and does TLS check out. Jumping straight to the last one is how people lose an afternoon.

### 1. Does the name resolve

\`\`\`bash
dig +short api.acme.dev              # 203.0.113.41
getent hosts api.acme.dev            # what the system resolver actually returns
\`\`\`

Check both. \`dig\` queries a DNS server directly and ignores \`/etc/hosts\` and the local caching resolver, so it can give you the right answer while your application quietly receives a different one. \`getent\` goes through the same path the application does.

Every DNS answer carries a **TTL**, and clients hold on to it for that long after you change the record. Drop the TTL to 60 seconds a day *before* a cutover, not on the morning of it — otherwise a share of your traffic keeps reaching the old address for an hour and there is nothing you can do about it.

### 2. Is anything listening, and on which interface

\`\`\`bash
ss -ltnp
# LISTEN 0 511 127.0.0.1:3000 users:(("node",pid=4821,fd=21))
\`\`\`

Read the address, not just the port. \`127.0.0.1:3000\` accepts connections only from the same machine or the same network namespace; \`0.0.0.0:3000\` accepts them from anywhere. That one column answers the published-port puzzle from Chapter 2 and a good half of the "the process is running but nothing works" reports you will receive.

### 3. Refused and timed out mean opposite things

| Symptom | What happened | Where to look |
|---|---|---|
| \`Connection refused\` | A machine replied with a TCP reset — nothing is listening on that port | The service, its bind address, the port number |
| \`Connection timed out\` | The packets vanished; nobody replied at all | Firewall, security group, route, wrong host |
| \`Name or service not known\` | Resolution never happened | Resolver config, the record itself, a typo |
| Connects, then hangs | TCP is fine; the application is not answering | The app, its connection pool, its dependencies |

This is the most useful distinction in the lesson. **A refusal is a fast answer from a real machine, so the fault is usually yours. A timeout is silence, so the fault is usually a policy between you and the service.** Reaching for firewall rules because of a refusal, or restarting the application because of a timeout, is the standard way to spend an hour on the wrong layer.

### 4. Split the latency before you blame the network

\`\`\`bash
curl -o /dev/null -s \\
  -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}' \\
  https://api.acme.dev/healthz
# dns=0.004 connect=0.011 tls=0.061 ttfb=0.402 total=0.404
\`\`\`

Four milliseconds of DNS, eleven of TCP handshake, fifty of TLS, then 340ms waiting for the first byte. The network did its part in 60ms and the server took the rest. That readout ends the "is it us or the network?" argument in one command, and it measures exactly what the p95 latency in Chapter 5 aggregates.

### 5. Certificates expire, always inconveniently

\`\`\`bash
echo | openssl s_client -connect api.acme.dev:443 -servername api.acme.dev 2>/dev/null \\
  | openssl x509 -noout -subject -dates -issuer
# notAfter=Nov 14 09:14:22 2026 GMT
\`\`\`

\`-servername\` is not optional. One address serves many certificates by SNI, and without it you are handed the default virtual host — usually a certificate for a name you have never heard of, which people then debug as a mis-issuance. Alert 21 days before expiry; it is one of the very few outages you can put in a calendar.

To test a new server before you move DNS, override resolution for that single request:

\`\`\`bash
curl --resolve api.acme.dev:443:203.0.113.41 https://api.acme.dev/healthz
\`\`\`

The Host header and the SNI name stay correct, so you exercise the real virtual host and the real certificate. Do this instead of editing \`/etc/hosts\` — a hosts entry added during an incident and never removed is a bug that outlives everyone who knew about it.

### Ping proves nothing about your service

ICMP and TCP are filtered by different rules, and most cloud security groups drop ICMP by default. A host that answers \`ping\` may drop every packet to port 443, and a host that ignores \`ping\` entirely may be serving traffic perfectly. **Concluding "the network is down" from a failed ping is the classic mistake here.** Test the port you actually care about:

\`\`\`bash
nc -vz api.acme.dev 443      # succeeded, refused, or timed out — straight back to the table above
\`\`\`
        `,
        [
          q('curl reports `Connection refused` against one host and `Connection timed out` against another. What is the difference?', [
            'Refused means DNS failed, timed out means the certificate could not be validated',
            'They are the same condition; the wording depends on the client library',
            'Refused means a machine answered with a reset, so nothing is listening there; timed out means the packets were dropped, which points at a firewall, security group, or route',
            'Refused means the server is overloaded, timed out means it has been stopped',
          ], 2, 'A reset is a real reply from a real host, while silence means the packets never arrived, so the two symptoms send you to completely different layers.'),
          q('Why check `getent hosts` rather than relying on `dig` alone?', [
            'getent goes through the system resolver, so it accounts for /etc/hosts and the local cache the way the application does',
            'dig cannot query A records without an explicit type argument',
            'getent is faster because it never touches the network',
            'dig ignores TTLs and always returns a cached answer',
          ], 0, 'dig talks to a DNS server directly and can be correct while the application, which goes through the system resolver, still gets something else.'),
          q('You run `openssl s_client -connect api.acme.dev:443` without `-servername` and are handed a certificate for an unrelated domain. Why?', [
            'The server is misconfigured and serves that certificate to every client',
            'Without SNI the server cannot tell which virtual host you want, so it returns its default certificate',
            'openssl hides the real subject when the chain has not been verified',
            'The chain was truncated, so only the root certificate is displayed',
          ], 1, 'SNI is what tells a shared address which certificate to present, so omitting it produces a perfectly healthy but irrelevant default.'),
        ]
      ),
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
        `,
        [
          q('What is the difference between an image and a container?', [
            'An image runs directly on the host kernel while a container runs inside a small virtual machine',
            'An image is the running process and a container is the artifact stored in the registry',
            'They are the same thing under two names, one used by Docker and one by the registry',
            'An image is a read-only stack of layers plus metadata; a container is a process started from it with a thin writable layer on top',
          ], 3, 'The image is an inert build artifact and the container is a running process with its own writable layer, which is why deleting the container loses nothing that belongs to the image.'),
          q('A container built on an Apple Silicon laptop exits immediately on an ordinary cloud VM with `exec format error`. What happened?', [
            'The entrypoint used the shell form instead of the exec form',
            'The image was built for arm64 and the VM is amd64',
            'The image has no CMD, so the runtime had nothing to execute',
            'The registry stripped the platform field from the manifest',
          ], 1, 'The binaries inside the image are compiled for a different CPU architecture, which the kernel reports as an exec format error the instant it tries to start them.'),
          q('Why does `docker logs` work without you configuring any log file?', [
            'Docker bind-mounts the host /var/log directory into every container',
            'The default logging driver tails files written under /var/log inside the container',
            'A well-behaved container writes to stdout and stderr, and the runtime captures those two streams',
            'The runtime reads buffered output directly out of the process memory',
          ], 2, 'Log collection is built on the container writing to standard output and standard error rather than managing files of its own.'),
        ]
      ),
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
        `,
        [
          q('Why use `npm ci` rather than `npm install` in a Dockerfile?', [
            'It installs exactly what the lockfile specifies and fails when the lockfile and package.json disagree, so the same input always produces the same image',
            'It skips the lockfile, which makes the resulting layer smaller',
            'It installs devDependencies, which the runtime stage needs',
            'It writes node_modules outside the layer so the final image stays small',
          ], 0, 'Reproducibility is the whole point of building in a container, and ci is the command that refuses to quietly resolve a different dependency tree than the one you committed.'),
          q('A Dockerfile downloads a 400MB archive in one RUN and deletes it in the next. What happens to the image size?', [
            'It shrinks by 400MB once the layers are compressed on push',
            'It shrinks only when the deletion happens in the final build stage',
            'Nothing — layers are additive, so the bytes stay in the earlier layer and remain extractable',
            'It grows by 400MB twice, once for the download and once for the deletion record',
          ], 2, 'A later layer can only record that a file is gone; the data underneath it is still shipped and still recoverable, which is the same reason a secret cannot be deleted after the fact.'),
          q('What does a missing `.dockerignore` most dangerously allow into a published image?', [
            'A larger build context, which makes the build slower',
            'Your local node_modules built for the wrong architecture, and your .env containing real credentials',
            'The Dockerfile itself, which reveals the build steps to anyone who pulls',
            'Test fixtures, which increase the attack surface of the runtime',
          ], 1, 'COPY . . takes everything the context contains, so an ignored file list is what keeps host-built binaries and live secrets out of a published artifact.'),
        ]
      ),
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
        `,
        [
          q('When is a bind mount the right choice rather than a named volume?', [
            'For database files, because bind mounts have lower write latency',
            'For anything that must survive `docker rm`',
            'For secrets, because bind mounts do not appear in docker inspect',
            'For live-reloading source during development, since a bind mount maps a real host path into the container',
          ], 3, 'Bind mounts tie the container to a specific host path, which is exactly what you want for editing source and exactly what you do not want for portable data.'),
          q('Why does plain `depends_on: [db]` still let the API crash on a cold machine?', [
            'Compose starts services in alphabetical order and ignores depends_on entirely',
            'It waits only for the container to start, not for Postgres to finish initialising and accept connections',
            'depends_on applies only when the stack is started with --build',
            'The API needs a healthcheck of its own before depends_on has any effect',
          ], 1, 'Container started and database ready are different events, which is why the condition: service_healthy form exists and why the application should still retry.'),
          q('Which command removes the containers and the Postgres data along with them?', [
            'docker compose down -v',
            'docker compose down',
            'docker compose stop',
            'docker compose rm',
          ], 0, 'The -v flag deletes the named volumes, and the named volume is where the database files live; plain down leaves them intact.'),
        ]
      ),
        lesson('Registries, Digests, and Multi-Arch Builds', 13, `
An image reference has four parts, and knowing which of them are stable is the difference between a deploy you can reproduce and one you cannot.

\`\`\`
ghcr.io / acme/api : 9f3c1a2 @ sha256:0f2a1b6d7c...
registry   repository   tag      digest
\`\`\`

The **tag** is a mutable pointer — a label somebody can move to different bytes tomorrow, exactly like a git branch. The **digest** is the SHA-256 of the image manifest, so it names content and can never be repointed, exactly like a commit SHA. Tagging with the commit SHA, as this chapter recommended, makes a tag that nobody *intends* to move; a digest is one that nobody *can* move.

### Log in without leaking the token

\`\`\`bash
echo "$GHCR_TOKEN" | docker login ghcr.io -u acme --password-stdin
\`\`\`

Never pass a token as an argument. The full command line of every process is readable by other users on the machine, and in an interactive shell it lands in your history file as well. \`--password-stdin\` exists for exactly this reason.

### Push once, then record the digest

\`\`\`bash
docker push ghcr.io/acme/api:9f3c1a2
docker inspect --format '{{index .RepoDigests 0}}' ghcr.io/acme/api:9f3c1a2
# ghcr.io/acme/api@sha256:0f2a1b6d7c...
\`\`\`

Have the pipeline capture that digest as the output of the build job. Chapter 3 asks you to promote one artifact through every environment; the digest is the identifier that turns "the same artifact" into a claim anyone can verify rather than a hope.

### A multi-arch image is a manifest list

Earlier in this chapter you built for one architecture with \`--platform\`. To publish something that runs on both an arm64 laptop and an amd64 server, build both and publish a **manifest list**: an index whose entries each point at one image per platform, so a client pulling the same reference automatically receives the right one.

\`\`\`bash
docker buildx create --use --name multi
docker buildx build --platform linux/amd64,linux/arm64 \\
  -t ghcr.io/acme/api:9f3c1a2 --push .
\`\`\`

\`--push\` rather than \`--load\` is a requirement, not a preference: the local image store holds one image per reference and cannot represent an index at all, so \`--load\` on a multi-platform build fails outright. The image only exists as a whole once it is in a registry.

### Pull limits will break your pipeline before they break your app

Anonymous pulls from public registries are rate-limited per source address, and CI runners share addresses with a lot of strangers. The symptom is a workflow that has worked for months failing with \`toomanyrequests\` on a Tuesday afternoon, with no change on your side. Authenticate the pull, or mirror the base images you depend on into your own registry.

### Retention rules delete the thing you are running

Registries fill up. Every commit on every branch pushes an image, and re-tagging leaves untagged manifests behind, so somebody eventually adds a cleanup rule: *delete untagged manifests older than seven days*. Weeks later a node reschedules a Pod and gets \`ImagePullBackOff\` for the version that is in production, because the deployment referenced it by digest and the digest is gone. The rollback target from Chapter 5 went with it.

Write the rule as a keep-list instead:

| Keep | Why |
|---|---|
| Anything a live deployment references | It must be pullable when a node replaces a Pod |
| The last N images from the default branch | These are your rollback targets |
| Anything signed or tagged as released | Provenance and audit (Chapter 7) |
| Everything else, 14 days | Branch builds nobody will ever deploy |

### Reclaim local disk deliberately

\`\`\`bash
docker system df                                  # where the space actually went
docker image prune -a --filter 'until=168h'       # images unused for a week
docker builder prune --keep-storage 10GB          # the build cache, usually the largest item
\`\`\`

On a build machine the layer cache grows without bound and eventually takes the host down with the disk-full failure from Chapter 1. Prune on a schedule rather than during an incident: \`docker system prune -a --volumes\` typed in a hurry is also the standard way people delete a database volume they meant to keep.
        `,
        [
          q('What does `@sha256:...` give you that the tag `:9f3c1a2` does not?', [
            'A checksum the runtime verifies, although the reference can still resolve to different bytes after a rebuild',
            'Compression, so the pull transfers fewer bytes',
            'It names the exact content, so unlike a tag it can never be repointed at different bytes',
            'Authentication, since digests are only valid for the account that pushed them',
          ], 2, 'A digest is derived from the manifest content itself, so it is immutable by construction while a tag is only immutable by convention.'),
          q('Why does `docker buildx build --platform linux/amd64,linux/arm64` require `--push` instead of `--load`?', [
            'The result is a manifest list referencing one image per platform, which the local image store cannot represent',
            '--load works only with the default builder driver, which buildx replaces',
            'Multi-platform builds run on remote builders that have no local filesystem',
            '--push applies the compression that multi-arch indexes require',
          ], 0, 'The local store keeps a single image per reference, so an index of per-platform images can only exist in a registry.'),
          q('A cleanup job deletes every untagged manifest older than a week. What breaks?', [
            'Nothing, because an untagged manifest is unreferenced by definition',
            'Pushes begin to fail because the registry loses its layer index',
            'Running containers are killed as soon as their layers are removed',
            'Anything deployed by digest can no longer be pulled, so a replacement node cannot start the running version and the rollback target is gone too',
          ], 3, 'Untagged does not mean unused: a deployment pinned to a digest still needs those bytes every time a Pod is rescheduled or rolled back.'),
        ]
      ),
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
        `,
        [
          q('What separates continuous delivery from continuous deployment?', [
            'Delivery runs the test suite; deployment also runs it against production',
            'Delivery means every passing commit produces a deployable artifact and releasing is a button press, while deployment means that button presses itself',
            'Delivery covers staging only, deployment covers production',
            'Delivery requires feature flags and deployment does not',
          ], 1, 'Both require a commit that is always releasable; the only difference is whether a human still initiates the release.'),
          q('Why should lint and typecheck run before the image build in a pipeline?', [
            'Linters need a clean workspace that a Docker build would dirty',
            'Docker builds cannot run in parallel with other steps',
            'Lint results are not reproducible once an image has been built',
            'Stages are ordered cheapest and most likely to fail first, so a style error does not cost a five-minute build to discover',
          ], 3, 'Feedback time is what makes a pipeline useful, and putting the fast, frequently failing checks first minimises the wait for the most common failures.'),
          q('A test fails about 5% of the time and the team has learned to simply re-run the job. Why is that treated as a production bug?', [
            'Once re-running is the habit, a genuine failure gets re-run too and ships',
            'Flaky tests consume runner minutes that are billed by the second',
            'A flaky test cannot be cached, so every pipeline run gets slower',
            'Re-running invalidates the build artifact and forces a rebuild per environment',
          ], 0, 'The damage is to trust: a pipeline people reflexively re-run no longer gates anything, so it costs the same and provides false assurance.'),
        ]
      ),
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
        `,
        [
          q('Why do two jobs in the same workflow not share the checked-out repository or the installed dependencies?', [
            'The checkout action deletes the workspace when a job completes',
            'The workspace is shared per workflow but locked to one job at a time',
            'Each job runs on a fresh runner, so anything that must cross a job boundary has to be uploaded as an artifact or pushed to a registry',
            'Jobs run in parallel, and concurrent writes to a shared workspace would corrupt it',
          ], 2, 'A job gets a clean machine with nothing carried over, which is why build outputs move between jobs through artifacts or a registry.'),
          q('What does a `concurrency` group with `cancel-in-progress: true` achieve?', [
            'It stops two steps within the same job running simultaneously',
            'A new push to the same branch cancels the run already in progress, so runners are not spent finishing a superseded commit',
            'It serialises deploys across every repository in the organisation',
            'It automatically retries a cancelled job once a runner frees up',
          ], 1, 'Only the newest commit on a branch is worth testing, and cancelling the older run returns capacity and shortens the queue.'),
          q('Why pin a third-party action to a full commit SHA rather than to `@v1`?', [
            'A SHA resolves faster because the runner skips a tag lookup',
            'Tags cannot be used when calling reusable workflows',
            'Dependabot can only propose updates for SHA-pinned actions',
            'A tag is mutable, so whoever controls that repository can change what v1 points at, and it then runs in your pipeline with your secrets',
          ], 3, 'A third-party action is code you execute with full access to the job, so the reference must name exact content rather than a label someone else can move.'),
        ]
      ),
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
        `,
        [
          q('Why validate required environment variables at boot rather than at first use?', [
            'Values read at boot are cached, which avoids a lookup per request',
            'The container exits before the health check can pass, so traffic never shifts and the previous version keeps serving',
            'process.env is only populated during the first few seconds of startup',
            'It allows the platform to inject the missing values automatically',
          ], 1, 'A fast, loud failure is caught by the deploy, while a lazily discovered missing variable becomes a partial outage hours later on one endpoint.'),
          q('GitHub masks known secret values in workflow logs. Why is that not a control you can rely on?', [
            'Masking matches exact strings, so a base64-encoded or JSON-embedded secret still prints in the clear',
            'Masking is applied only to the default GITHUB_TOKEN and not to repository secrets',
            'Masked values remain visible to anyone with read access to the repository',
            'Masking is disabled for workflows triggered by pull_request events',
          ], 0, 'Any transformation of the value defeats the match, so masking is a safety net behind the discipline of never printing secrets at all.'),
          q('A cloud access key was committed, then removed by a follow-up commit and a force push. What is the correct response?', [
            'Nothing further, since the force push removed it from the branch history',
            'Add the file to .gitignore and rewrite the history with a filter tool',
            'Rotate the credential immediately, because it exists in every clone and fork and scanners find committed keys within minutes',
            'Make the repository private, which invalidates any copies that were taken',
          ], 2, 'Once pushed, the value is out of your control, so rotation is the only real fix and history scrubbing is cleanup afterwards.'),
        ]
      ),
        lesson('Trunk-Based Development and Merge Gates', 13, `
Continuous integration means integrating continuously. A branch that lives for three weeks is not integrating — it is deferring a merge, and deferring a merge defers the discovery of every conflict inside it.

### The arithmetic of a long branch

Two developers branch from the same commit on Monday. One merges on Tuesday: the diff is small, the conflict surface is a few lines, and CI has been testing the combination since Tuesday afternoon. The other merges three weeks later, by which point main has moved four hundred commits and the branch has fifty. Nobody can review that safely, the conflicts are structural rather than textual, and all of the risk lands in a single event.

**Short-lived branches are the practice**: branch, work for a day or two, merge. If the work is not finished, merge it anyway behind a feature flag (Chapter 5) — the flag is precisely what lets incomplete code be integrated without being released.

### Branch protection is where the pipeline grows teeth

A pipeline nobody is obliged to pass is a suggestion. On the default branch, require:

| Rule | What it prevents |
|---|---|
| Required status checks | Merging red code |
| Require branches up to date before merging | Merging against a main you never actually tested against |
| Required review, with CODEOWNERS on infrastructure paths | Unreviewed changes to the things that page people at night |
| Linear history, no force push, no branch deletion | A history nobody can bisect or trust |
| Dismiss stale approvals on new commits | An approval that refers to a diff which no longer exists |

### The semantic conflict, and why merge queues exist

Two pull requests are open. One renames \`getUser\` to \`fetchUser\`. The other adds a new caller of \`getUser\`. Both are green against main, both merge cleanly, because git merges *text* and neither touched the same lines. Main is now broken and neither author did anything wrong.

That is a **semantic conflict**, and the only thing that catches it is testing the combination before it lands. A **merge queue** does exactly that: it takes pull requests in order, builds each one on top of the ones ahead of it, runs the required checks against that combination, and merges only what passes.

It also fixes the scaling problem hiding in "require branches up to date". Without a queue, every merge invalidates every other open pull request, so on a busy repository everyone spends the day rebasing and re-running CI to win a race. The queue batches that work and does it once.

### The required-check trap that blocks every merge

\`\`\`yaml
on:
  pull_request:
    paths: ['src/**', 'package-lock.json']    # skip CI for documentation-only changes
\`\`\`

Then somebody marks that job as a required status check. A pull request touching only \`README.md\` never triggers it, so the check never reports — and **a required check that never reports is pending forever, not passing**. The pull request cannot merge, and nothing in the interface explains why. This is the single most common way a team locks itself out of its own default branch.

The fix is one job that always runs and reports the outcome of the conditional work:

\`\`\`yaml
  ci-required:
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    steps:
      - run: |
          if [ "\${{ needs.test.result }}" = "failure" ]; then exit 1; fi
\`\`\`

Make \`ci-required\` the required check and let it be the only gate. It reports on every pull request, and it passes when the real job passed or was legitimately skipped.

### Keep the pull request small

Review quality falls off a cliff somewhere around four hundred changed lines. Past that, reviewers stop reading and start approving, and the review becomes a ritual rather than a check. Small pull requests are the batch-size argument from Chapter 1 applied one level down: less to understand, fewer places for a defect to hide, and a revert that only removes one idea.

### The deployable identifier is still the commit

Release tags and generated changelogs are useful for humans, but nothing downstream should key on them. The image is tagged with the commit SHA (Chapter 2), the deploy record names that SHA, and the rollback names it too. A version number is documentation; the SHA is the identity.
        `,
        [
          q('Two pull requests are each green against main. Merged together, main breaks. What happened?', [
            'One of them was not rebased, so git produced a silent textual conflict',
            'The pipeline restored a stale dependency cache for the second run',
            'Neither was ever tested against the other, and git merges text rather than meaning, so a semantic conflict landed — which is what a merge queue prevents',
            'The required checks ran against the head commit rather than the merge commit',
          ], 2, 'A rename in one branch and a new caller in another conflict in meaning but not in text, so only building the combination before merging can catch it.'),
          q('A required status check is skipped because the pull request touched no files matching the path filter. What happens?', [
            'The pull request can never merge, because a required check that never reports counts as pending rather than passing',
            'The platform treats a skipped check as passing and the merge proceeds normally',
            'The job runs anyway, since being marked required overrides the path filter',
            'Branch protection is bypassed automatically for that pull request',
          ], 0, 'Required means the check must report success, and a job that never triggered reports nothing at all, which leaves the merge blocked indefinitely.'),
          q('What is the argument against a feature branch that lives for three weeks?', [
            'Long-lived branches consume storage quota on the remote',
            'Reviewers cannot open a diff once it exceeds a thousand lines',
            'CI is unable to cache dependencies across branches',
            'It defeats continuous integration: main and the branch drift apart, so every integration problem is discovered at once in a large, late, risky merge',
          ], 3, 'The point of integrating continuously is to meet conflicts while they are small, which a branch held open for weeks makes impossible.'),
        ]
      ),
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
        `,
        [
          q('What are you actually buying with a managed Postgres service rather than Postgres on a VM you run?', [
            'A build of Postgres tuned by the provider that runs measurably faster',
            'Unlimited connections, because the provider pools them on your behalf',
            'Freedom from the query and index work an application still has to do',
            'Automated backups, point-in-time recovery, patching, failover to a standby, and metrics',
          ], 3, 'The database process is the same software either way; what the service sells is the operational work around it, including the part that happens at 3am.'),
          q('An application serves user uploads from its instances in one region to users worldwide, and the bill is far above the compute estimate. Which line item is the likely cause?', [
            'Data egress, charged per gigabyte leaving the provider',
            'Block storage IOPS on the instance disks',
            'The hourly charge for the load balancer',
            'Backup retention on the managed database',
          ], 0, 'Egress is the charge that scales with user traffic rather than with infrastructure size, which is why serving assets from the application instead of a CDN is so expensive.'),
          q('You are deciding between spreading a new service across availability zones or across regions. What does the lesson advise?', [
            'Multi-region first, since it protects against strictly more failure modes',
            'Multi-AZ first: it is cheap and covers the most common failure, one datacentre losing power or network, while multi-region is disaster recovery and adds real complexity',
            'Neither, until the service has paying customers',
            'Multi-region for stateless services and multi-AZ for anything holding data',
          ], 1, 'Zone redundancy addresses the failure that actually happens regularly and costs almost nothing, while region redundancy is a much larger commitment aimed at a different problem.'),
        ]
      ),
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
        `,
        [
          q('Why run database migrations as an explicit deploy step rather than on application start?', [
            'Migration tools cannot run inside a container image',
            'Application start happens before environment variables are injected',
            'Every replica starts at once and races to apply the same migration, and many tools respond by corrupting the migration table',
            'Migrations require a database user the application should not hold',
          ], 2, 'Rollouts start several replicas concurrently, so boot-time migration turns a single ordered operation into a race between identical processes.'),
          q('An Express app behind a load balancer logs the proxy address for every request, and its rate limiter throttles the whole world as one client. What is missing?', [
            'Telling Express to trust the proxy, so req.ip and req.protocol reflect the forwarded headers',
            'A request ID header set by the proxy and read by the application',
            'TLS termination inside the application rather than at the proxy',
            'Stripping X-Forwarded-For, which the rate limiter requires to be absent',
          ], 0, 'Without trusting the proxy, every request appears to come from the proxy address, so per-client logic collapses onto a single identity.'),
          q('Zero-downtime rolling deploys need spare capacity and one further guarantee. What is it?', [
            'That the new version starts faster than the load balancer health check interval',
            'That the old and new versions can run simultaneously against the same database',
            'That the old version is fully drained before the new image is built',
            'That the rollout is scheduled outside peak hours',
          ], 1, 'During a rollout both versions serve traffic at once, so the schema must satisfy both, which is exactly what expand and contract migrations guarantee.'),
        ]
      ),
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
        `,
        [
          q('What makes a declarative infrastructure tool idempotent?', [
            'It compares the declared desired state against reality and changes only the difference, so a second apply is a no-op',
            'It records every command it has run and refuses to execute the same one twice',
            'It wraps each cloud API call in a retry with backoff',
            'It names resources deterministically so the provider rejects duplicates',
          ], 0, 'Describing the end state rather than the steps is what lets the tool run repeatedly and converge instead of accumulating resources.'),
          q('Someone resolves an incident by editing a security group in the cloud console and nothing else is done. What happens next?', [
            'The tool imports the change into state during the next plan',
            'Nothing, because console changes are invisible to the tool',
            'The code no longer matches reality, and the next apply silently reverts the fix, often at the worst possible moment',
            'The state file stays locked until the drift is reconciled by hand',
          ], 2, 'Drift means the declared state and the real state disagree, and the tool resolves that disagreement in favour of the code without asking.'),
          q('Why should staging and production be the same module with different variable files?', [
            'It halves the size of the state file',
            'The tool cannot manage two directories that use the same provider',
            'Modules cannot be duplicated without renaming every resource inside them',
            'Copy-pasted configurations diverge over time, and once staging differs from production it stops predicting anything about it',
          ], 3, 'Staging is only useful while it is a faithful smaller copy, and shared code with different variables is what keeps the two honest.'),
        ]
      ),
        lesson('VPCs, Subnets, and Security Groups', 14, `
A VPC is a private network you own inside somebody else's datacentre. Two decisions inside it — where a subnet routes, and what a security group admits — decide whether a mistake is a contained incident or a publicly reachable database.

### Choose the address range as though you will regret it

\`\`\`
10.20.0.0/16          production VPC       65,536 addresses
  10.20.0.0/20        public    az-a       load balancers, NAT gateway
  10.20.16.0/20       public    az-b
  10.20.32.0/20       private   az-a       application instances and Pods
  10.20.48.0/20       private   az-b
  10.20.64.0/22       isolated  az-a       databases and caches
  10.20.68.0/22       isolated  az-b
\`\`\`

**Give every environment and every account a different range.** Most tutorials use \`10.0.0.0/16\`, so teams end up with staging, production, and the account they inherited last year all on identical addresses — and the day you need to peer them, or attach a VPN, the ranges overlap and simply cannot be routed. Renumbering a live VPC means rebuilding it.

Kubernetes needs room too: on most cloud CNIs every Pod takes an address from the subnet, so a \`/24\` behind a node group that will eventually run 300 Pods becomes a cluster that stops scheduling with an unhelpful message about available addresses.

### Public, private, isolated — it is only the route table

A subnet is **public** if its route table sends \`0.0.0.0/0\` to an **internet gateway**. That is the entire definition; nothing else about the subnet is different.

A **private** subnet sends \`0.0.0.0/0\` to a **NAT gateway** that lives in a public subnet, so instances can reach out to pull packages or call an API while nothing on the internet can open a connection to them. An **isolated** subnet has no default route at all, which is where a database belongs.

Load balancer in public, application in private, database in isolated. The only thing of yours that anyone can reach is then the load balancer, which is exactly the blast radius you want.

### Security groups describe identity, not addresses

A security group is a **stateful** allow-list attached to a resource: permit the inbound rule and the reply is automatically allowed back. Network ACLs are the subnet-wide equivalent and are **stateless**, so an ACL that allows inbound 443 but forgets the outbound ephemeral range 1024-65535 produces a connection that establishes and then hangs. Use security groups for policy and leave ACLs alone unless you have a specific reason.

The pattern worth internalising is referencing groups rather than ranges:

\`\`\`hcl
resource "aws_security_group_rule" "db_from_app" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.db.id
  source_security_group_id = aws_security_group.app.id   # identity, not an address range
}
\`\`\`

A rule saying \`from 10.20.0.0/16\` admits everything in the VPC, including the CI runner and the marketing site. \`from sg-app\` admits only workloads carrying that identity, and it stays correct as addresses change, replicas scale, and subnets are added later.

### Nothing gets 0.0.0.0/0 on port 22 or 5432

Not temporarily, not for one debugging session. Use the provider session service to get a shell with no inbound rule at all, so there is no SSH port to attack and no bastion host to patch:

\`\`\`bash
aws ssm start-session --target i-0abc123
\`\`\`

### The symptom that identifies a network rule

A security group drops packets silently, so the client sees a **timeout**, never a refusal — the distinction from Chapter 1. If \`nc -vz db.internal 5432\` hangs, stop restarting Postgres and go read the rule. If it comes back refused, the network delivered your packets and the database is the thing that is not listening.

### NAT gateways appear on the bill twice

They charge per hour *and* per gigabyte processed, and every package download, object storage read, and log shipment from a private subnet passes through one. A **VPC endpoint** for object storage keeps that traffic inside the provider network entirely: in a small account it is often the single largest saving available, and it removes a shared failure point at the same time.
        `,
        [
          q('What makes a subnet public?', [
            'Its instances have security groups permitting inbound traffic from the internet',
            'Its route table sends the default route to an internet gateway',
            'It uses an address range outside the private RFC 1918 blocks',
            'It has a NAT gateway attached to it',
          ], 1, 'Public and private are properties of routing alone; the security group controls who may connect, not whether the subnet can reach the internet.'),
          q('Why write a database rule as "allow 5432 from the application security group" rather than "allow 5432 from 10.20.0.0/16"?', [
            'CIDR rules are evaluated more slowly by the packet filter',
            'Security groups cannot express address ranges for stateful protocols',
            'A CIDR rule stops applying as soon as the VPC gains another subnet',
            'The CIDR rule admits everything in the VPC, while the group reference admits only workloads carrying that identity and stays correct as addresses change',
          ], 3, 'Referencing a group turns the rule into a statement about which workloads may connect, which survives scaling, re-addressing, and new subnets.'),
          q('A connection to a database in a private subnet times out rather than being refused. What does that indicate?', [
            'A network rule — a security group or a missing route — is dropping the packets, rather than the database being stopped',
            'The Postgres process has crashed, which always presents as a timeout',
            'DNS resolved the name to the wrong address',
            'TLS negotiation failed before the connection could complete',
          ], 0, 'A stopped database still answers with a reset, so silence points at something between you and the host discarding the traffic.'),
        ]
      ),
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
        `,
        [
          q('Why should a containerised process not write its logs to a file?', [
            'File writes block the Node event loop under load',
            'Log libraries cannot perform rotation from inside a container',
            'The logs die with the container and quietly fill the host disk in the meantime, while the runtime already captures stdout and stderr for you',
            'Files written inside a container are not readable by the application user',
          ], 2, 'Containers are disposable, so anything written inside one is lost on replacement while still consuming host storage until then.'),
          q('What does attaching a request ID to every log line give you that timestamps cannot?', [
            'One filterable trail across every service a single request touched, which timestamps cannot reconstruct because clocks disagree and concurrent requests interleave',
            'Smaller log volume, because the ID replaces repeated fields',
            'Automatic redaction of sensitive values in the same line',
            'Guaranteed ordering of lines emitted by a single process',
          ], 0, 'Correlating by time fails as soon as two requests overlap or two machines drift, whereas an explicit identifier is exact.'),
          q('A handler logs the entire request body whenever validation fails. What is the consequence?', [
            'Log ingestion slows down enough that lines are dropped under load',
            'Passwords, tokens, and card numbers land in a system with broad read access and months of retention',
            'The body is truncated at the first nested object, so the log is useless anyway',
            'Structured backends cannot index nested objects, making the field unqueryable',
          ], 1, 'It is the most common way sensitive data escapes an otherwise careful application, which is why redaction has to be configured explicitly.'),
        ]
      ),
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
        `,
        [
          q('A 99.9% monthly success SLO leaves how much error budget, and what is the budget for?', [
            'About four hours, reserved for planned maintenance windows',
            'About 43 minutes, which must never be spent',
            'About 43 minutes, and it is a decision tool: with budget intact you ship faster, and while it is burning you stop feature work and fix reliability',
            'About seven hours, divided evenly between the services behind the endpoint',
          ], 2, 'A tenth of a percent of a month is roughly 43 minutes, and treating it as a budget rather than a taboo is what makes the number useful.'),
          q('Why alert on error rate rather than on CPU above 80%?', [
            'CPU metrics are unreliable inside containers',
            'Error rate is cheaper to evaluate at high request volume',
            'CPU alerts cannot carry a for: clause or a runbook link',
            'High CPU is often an autoscaling group doing its job, while a raised error rate means a user is having a bad time right now, and pages must be both urgent and actionable',
          ], 3, 'Symptoms are what users experience; resource causes fire constantly during healthy behaviour and train people to ignore the pager.'),
          q('What does the `for: 5m` clause on an alert rule do?', [
            'It delays evaluating the expression until the rule has been loaded for five minutes',
            'It requires the condition to hold continuously for five minutes, which suppresses momentary spikes',
            'It re-sends the page every five minutes until somebody acknowledges it',
            'It averages the expression over a trailing five-minute window',
          ], 1, 'Sustained conditions are what deserve a page, and requiring the expression to stay true removes the single-scrape blips.'),
        ]
      ),
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
        `,
        [
          q('Which rollout strategy exposes the fewest users to a bad release while it is still being evaluated?', [
            'Canary — a small share of traffic goes to the new version and is compared against the old before widening',
            'Blue/green — both versions run and all traffic flips at once',
            'Rolling — instances are replaced a few at a time',
            'All three expose the same proportion of users; only rollback speed differs',
          ], 0, 'A canary limits exposure to a few percent while the comparison runs, whereas blue/green and rolling both reach everyone.'),
          q('An incident is in progress and the cause is not yet understood. What does the lesson say to do first?', [
            'Capture a heap dump before anything changes state',
            'Scale up to absorb the errors while you investigate',
            'Turn on debug logging across every replica',
            'Roll back to stop the bleeding, then diagnose — the artifact and the logs are still there afterwards',
          ], 3, 'Restoring service costs you nothing diagnostically, because the failing image and its logs remain available once users are safe.'),
          q('Why is a rollback procedure that has never been executed described as a hypothesis?', [
            'Rollback commands change with every platform release',
            'Untested steps hide missing permissions, wrong version identifiers, and gaps nobody notices until the one moment they must work',
            'A rollback is only valid for the most recent deployment',
            'Rehearsal is required as compliance evidence rather than for technical reasons',
          ], 1, 'Rehearsing converts a document into a verified capability, and the failures it exposes are exactly the ones an incident cannot absorb.'),
        ]
      ),
        lesson('Tracing a Request Across Services', 14, `
A request that touches four services produces four sets of logs and four latency histograms, and none of them says where the 900ms went. **Tracing** does: one request becomes one tree, with a timing bar for every step.

### The vocabulary, once

A **trace** is one request end to end. A **span** is one unit of work inside it — an HTTP handler, a database query, an outbound call — carrying a start time, a duration, a parent, and attributes. A trace is therefore a tree of spans that share a trace ID.

Services stay connected because the caller passes the context in a header. The W3C standard is \`traceparent\`:

\`\`\`
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ver  trace id (16 bytes)              span id (8)      flags
\`\`\`

The receiving service reads that, creates its spans as children of the given span ID, and passes its own down the chain. Nothing else is shared — no clock synchronisation, no central coordinator.

### Instrumenting a Node service

\`\`\`js
// tracing.js — MUST load before the application: node --import ./tracing.js src/server.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? 'api',
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
}).start();
\`\`\`

Auto-instrumentation works by patching modules as they are loaded — http, express, pg, redis. That is why the load order is not negotiable. **Starting the SDK inside \`server.js\`, after Express has already been imported, is the classic mistake:** everything looks configured, the exporter connects happily, and you receive no HTTP spans at all, because those modules were resolved before the patches were installed.

Add spans for the business steps that no library can infer:

\`\`\`js
import { trace, SpanStatusCode } from '@opentelemetry/api';
const tracer = trace.getTracer('checkout');

await tracer.startActiveSpan('reserve_inventory', async (span) => {
  span.setAttribute('order.id', orderId);
  try {
    await reserve(orderId);
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw err;
  } finally {
    span.end();               // a span you never end is a trace that never arrives
  }
});
\`\`\`

### Reading a waterfall

Four shapes explain most of what you will find:

| What you see | What it means |
|---|---|
| A parent span far longer than the sum of its children | Time in your own code, or waiting on a saturated event loop |
| Forty identical short child spans | An N+1 query — the fix is a join, not more replicas (Chapter 7) |
| One child covering almost the whole parent | A slow dependency; the rest of the service is innocent |
| A gap before the first child starts | Queueing, connection pool exhaustion, or a cold start |

### Attributes may be high-cardinality; labels may not

People get this backwards. A Prometheus label carrying an order ID creates a new stored time series per order and takes your monitoring down, as earlier in this chapter. A **span attribute** carrying the same order ID costs one field on one event — and it is what lets you go from an angry customer with an order number straight to the trace of their request. Spans are individual events; metrics are aggregates. Identifiers belong on spans and log lines, never on metric labels.

### Sample, or pay for everything

Tracing every request is affordable at 50 requests per second and ruinous at 5,000. **Head sampling** decides at the start of the trace — typically 1% to 10% — and the decision travels in the \`traceparent\` flags, so a trace is never collected half way. **Tail sampling** buffers the whole trace and decides at the end, which lets you keep 100% of errors and slow requests alongside 1% of the uneventful ones. Tail sampling is what you want; head sampling is what you start with.

### Stitch the three signals together

Put the trace ID into every log line and into a response header:

\`\`\`js
const span = trace.getActiveSpan();
logger.info({ traceId: span?.spanContext().traceId, event: 'checkout_ok' }, 'checkout');
\`\`\`

Now the alert links to the trace, the trace links to the logs of that exact request, and those logs already carry the request ID from earlier in this chapter. Three signals, one identifier, and no more correlating by timestamp.
        `,
        [
          q('What does the `traceparent` header carry between two services?', [
            'The full tree of spans collected so far, serialised into the header',
            'The trace ID and the calling span ID, so the next service can attach its spans as children of the right parent',
            'The sampling budget remaining for the current minute',
            'The name and version of the calling service',
          ], 1, 'Only identifiers and flags travel on the wire; the spans themselves are exported separately and reassembled by the backend using those IDs.'),
          q('A Node service with OpenTelemetry auto-instrumentation produces no HTTP spans at all. What is the most likely cause?', [
            'The exporter endpoint is missing a trailing slash',
            'Auto-instrumentation covers outbound calls only, never inbound handlers',
            'The default sampler is always-off until a sampling rate is configured',
            'The SDK is started after the application modules were imported, so the libraries were never patched',
          ], 3, 'Instrumentation works by wrapping modules at load time, so anything imported before the SDK starts is left untouched.'),
          q('Why is an order ID acceptable as a span attribute but not as a Prometheus metric label?', [
            'Span attributes are hashed before storage, so cardinality does not grow',
            'Tracing backends automatically drop attributes above a cardinality threshold',
            'Spans are individual events, so a unique value costs one field on one event, whereas a metric label creates an entire new stored time series',
            'Metric labels are limited to sixteen characters, which an order ID exceeds',
          ], 2, 'Metrics storage scales with distinct label combinations while event storage does not, which is why identifiers belong on spans and logs.'),
        ]
      ),
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
        `,
        [
          q('Which object gives a constantly changing set of Pods one stable address?', [
            'The ReplicaSet, because it keeps the Pod names constant',
            'The Ingress, which assigns each Pod its own DNS record',
            'The Service, a stable virtual IP and DNS name that selects Pods by label',
            'The Deployment, whose name resolves inside the cluster',
          ], 2, 'Pods get new names and new addresses on every restart, so the Service is the layer that does not move.'),
          q('A Service is declared with type ClusterIP. Who can reach it?', [
            'Only clients inside the cluster, which is the right default for service-to-service calls',
            'Any client on the node network, through a fixed port on every node',
            'The internet, through a cloud load balancer provisioned automatically',
            'Only Pods running in the same namespace',
          ], 0, 'ClusterIP allocates an address routable inside the cluster only; exposing it publicly requires a LoadBalancer or an Ingress in front.'),
          q('Why change a running Deployment with `kubectl apply -f` rather than `kubectl edit` or `kubectl set image`?', [
            'apply is the only command that triggers a rolling update',
            'set image bypasses the readiness probe during the rollout',
            'edit is unable to change a container image',
            'Imperative changes drift from the manifests in git, and the next apply silently reverts whoever was fixing an incident',
          ], 3, 'The manifests are the declared state, so any change made outside them survives only until somebody applies the files again.'),
        ]
      ),
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
        `,
        [
          q('What does `maxSurge: 1` with `maxUnavailable: 0` mean for a rollout?', [
            'One Pod is deleted and then replaced at a time, so capacity dips by one throughout',
            'A new Pod must reach Ready before an old one is removed, which requires room for one extra Pod',
            'The rollout pauses after the first new Pod until a human approves it',
            'Every old Pod is kept until the entire new ReplicaSet is Ready',
          ], 1, 'Zero unavailable forbids dropping below the declared replica count, so the surge Pod is what creates the space to replace one.'),
          q('An HPA targeting 70% CPU utilisation never scales the Deployment at all. Which mistake causes that?', [
            'The Deployment has no readiness probe, so its Pods are excluded from metrics',
            'minReplicas and maxReplicas default to the same value',
            'The metrics pipeline samples every 15 seconds, which is slower than the traffic spike',
            'The Pod has no CPU request, and the HPA computes utilisation as a percentage of the request',
          ], 3, 'Utilisation is a ratio against the request, so with no request there is nothing to take a percentage of and the controller can never act.'),
          q('Every rollout scatters a handful of 502s even though the application handles SIGTERM correctly. What explains it?', [
            'Endpoint removal and SIGTERM propagate concurrently, so a Pod can stop accepting connections a moment before every proxy has stopped routing to it — a short preStop sleep lets removal propagate first',
            'The grace period is too short and Pods are SIGKILLed mid-request, so terminationGracePeriodSeconds must be raised',
            'The readiness probe interval is longer than the rollout, so traffic reaches unready Pods',
            'The Service caches its endpoint list, which is fixed by disabling session affinity',
          ], 0, 'Shutdown and deregistration are asynchronous and independent, so the pause is what closes the window in which traffic is still being routed to a closing Pod.'),
        ]
      ),
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
        `,
        [
          q('A Pod is stuck in `Pending`. Where does the explanation almost always live?', [
            'In the container log, which records each scheduling attempt',
            'In the endpoint list of the Service that selects it',
            'In the Events section at the bottom of `kubectl describe pod` — insufficient CPU or memory, an unbound volume, or a taint',
            'In the exit code of the previous container instance',
          ], 2, 'Pending means no node has accepted the Pod yet, so there is no container and no log; the scheduler records its reason as an event.'),
          q('A container exits with code 139. What does that suggest?', [
            '128+11, a segmentation fault — usually a native module built for the wrong architecture',
            '128+9, a SIGKILL from exceeding the memory limit',
            'A clean exit that the Deployment restarted anyway',
            'Three consecutive liveness probe failures',
          ], 0, 'Codes above 128 encode the signal that killed the process, and signal 11 is a segfault, which in a container almost always means a binary that does not match the platform.'),
          q('A port-forward straight to the Pod serves `/readyz` correctly, but requests through the Service fail. What has that isolated?', [
            'The application, since port-forward bypasses the probes that would have failed',
            'The wiring — labels, ports, or readiness — rather than the application itself',
            'Cluster DNS, which port-forward also depends on',
            'The Ingress certificate, as the only remaining layer',
          ], 1, 'The Pod answered, so the process is healthy and the fault lies in the selector, the port mapping, or the readiness state that keeps it out of the endpoint list.'),
        ]
      ),
        lesson('ConfigMaps, Secrets, and Persistent Volumes', 14, `
This chapter has referenced \`secretKeyRef\` and \`CreateContainerConfigError\` without saying where those values live. This is that lesson: how configuration, credentials, and disks attach to a Pod, and which of the three will surprise you.

### ConfigMap and Secret are the same shape with different intent

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: api-config }
data:
  LOG_LEVEL: "info"
  FEATURE_NEW_CHECKOUT: "false"
---
apiVersion: v1
kind: Secret
metadata: { name: api-secrets }
type: Opaque
stringData:                      # write plain text; the API server encodes it for you
  database-url: postgres://app:devsecret@db.internal:5432/app
\`\`\`

\`\`\`yaml
      envFrom:
        - configMapRef: { name: api-config }      # every key becomes an env var
      env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef: { name: api-secrets, key: database-url }
\`\`\`

If that key does not exist, the container does not crash — it never starts, and the Pod reports \`CreateContainerConfigError\`. That status appeared in the debugging table for a reason: the fix is in the manifest, never in the application.

### A Secret is base64, and base64 is not encryption

\`\`\`bash
kubectl get secret api-secrets -o jsonpath='{.data.database-url}' | base64 -d
\`\`\`

Anyone who can read Secrets in that namespace has the credential. Encoding is a transport detail, not protection. What actually protects it is **RBAC** — very few subjects should hold \`get\` on secrets — plus encryption at rest for etcd, and short-lived credentials wherever the provider offers them (Chapter 3). Better still, sync from your cloud secret manager with the External Secrets Operator or the Secrets Store CSI driver, so the manager stays the source of truth and rotation happens in one place.

Two habits worth adopting: never run \`kubectl create secret --from-literal\` on a shared machine, because the value lands in shell history; and never commit a Secret manifest, because base64 in git is a plaintext credential with one extra step.

### Env vars are a snapshot; mounted files are live

**Environment variables are read once, when the container starts.** Update the ConfigMap and nothing happens — not after a minute, not ever. This is the most common "Kubernetes ignored my change" report, and the object is behaving exactly as designed.

Mounted ConfigMaps and Secrets *do* update in place, within a minute or so, but your process has to notice and re-read the file, which most do not. So the practical answer is to force a rollout whenever configuration changes, by putting a hash of that configuration into the Pod template:

\`\`\`yaml
  template:
    metadata:
      annotations:
        checksum/config: "8f14e45fceea167a5a36dedd4bea2543"
\`\`\`

Changing an annotation on the template changes the template, which creates a new ReplicaSet and rolls the Deployment — with the surge and probe behaviour from earlier in this chapter, so it is a safe rollout rather than a restart storm. Generate the hash in your pipeline; Helm and Kustomize both have a one-line idiom for it.

### Storage: three options, in order of preference

| Volume | Lifetime | Use for |
|---|---|---|
| \`emptyDir\` | Dies with the Pod | Scratch space, and the writable \`/tmp\` that a read-only root filesystem needs (Chapter 7) |
| \`PersistentVolumeClaim\` | Independent of the Pod | Genuinely stateful workloads |
| Object storage or a managed database | Independent of the cluster | Almost everything else (Chapter 4) |

The trap is the access mode. **\`ReadWriteOnce\` means one node, not one Pod.** A Deployment with three replicas mounting a single RWO claim schedules whichever Pods land on the node holding the volume and leaves the rest \`Pending\` indefinitely, with an event about a multi-attach error. Shared filesystems need \`ReadWriteMany\` and a backing store that supports it, which is slower and more expensive than people expect.

If a workload genuinely owns its data, use a **StatefulSet**: each replica gets a stable name (\`db-0\`, \`db-1\`) and its own claim from a \`volumeClaimTemplate\`, and that claim is deliberately *not* deleted with the Pod. For a stateless web service none of this applies — and that is the point. Push state out to the managed services from Chapter 4 and your Deployments stay disposable, which is what makes every rollout, drain, and rollback in this chapter safe.
        `,
        [
          q('A team stores a database password in a Secret and considers it protected because the stored value is base64. What is wrong?', [
            'Base64 corrupts values that contain special characters such as slashes',
            'Secrets are capped at 1MB, so long credentials are silently truncated',
            'Base64 is encoding rather than encryption: anyone able to read Secrets in that namespace recovers the value, so RBAC and encryption at rest are what actually protect it',
            'The value is stored in plaintext in the manifest but encrypted in etcd, so only the manifest matters',
          ], 2, 'Encoding is reversible by anyone, which is why access control and encryption at rest, not the encoding, are the real protections.'),
          q('You update a ConfigMap that a Deployment consumes through environment variables, and nothing changes. Why?', [
            'Environment variables are read from the ConfigMap when the container starts and are never refreshed, so a rollout is required',
            'ConfigMap updates only propagate to Pods that define a readiness probe',
            'The kubelet caches ConfigMaps for one hour by default',
            'envFrom ignores later changes, although individual valueFrom entries would have updated',
          ], 0, 'The values are injected into the process environment at start, so the only way to pick up new ones is to replace the Pods.'),
          q('A Deployment with three replicas mounts one ReadWriteOnce PersistentVolumeClaim on a multi-node cluster. What happens?', [
            'All three mount it read-only and their writes fail silently',
            'Kubernetes clones the volume so each replica gets a copy',
            'Writes are serialised through the first Pod, which becomes a bottleneck',
            'Only Pods scheduled onto the node that has the volume attached can run; the others stay Pending, because ReadWriteOnce means one node',
          ], 3, 'The access mode is a constraint on how many nodes may attach the volume, so replicas landing elsewhere can never start.'),
        ]
      ),
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
        `,
        [
          q('Why set `ignore-unfixed: true` on the image scan gate?', [
            'Vulnerabilities without a fix are usually false positives',
            'A build that fails on advisories with no available patch teaches the team the scanner is noise, after which the one exploitable finding scrolls past with the rest',
            'Scanners cannot assign a severity to an unfixed issue',
            'It halves the scan time by skipping the vulnerability database refresh',
          ], 1, 'A gate is only useful while people respect it, so blocking on findings nobody can act on destroys the value of the findings they can.'),
          q('A headline vulnerability in a widely used library is announced. What turns "which of our services ship this library?" into a query rather than a week of grep?', [
            'An SBOM generated and stored alongside each image',
            'The scan report from the most recent pipeline run',
            'The Renovate configuration listing the allowed version ranges',
            'The signature attestation attached to the image',
          ], 0, 'A software bill of materials records the full dependency inventory per artifact, which is exactly the index that question needs.'),
          q('What does `readOnlyRootFilesystem: true` most often break, and what is the right fix?', [
            'Log output, fixed by changing the logging driver',
            'The liveness probe, fixed by allowing privilege escalation',
            'Package installation at container start, fixed by baking the packages in at build time',
            'An application that writes into its own directory, fixed by mounting a writable volume exactly where it writes rather than turning the flag off',
          ], 3, 'The flag is doing its job, so the fix is to give the process the one writable path it genuinely needs instead of restoring write access everywhere.'),
        ]
      ),
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
        `,
        [
          q('What is the "knee" you are looking for in a load test?', [
            'The load at which CPU utilisation crosses 70%',
            'The load at which the error rate first becomes non-zero',
            'The point where added load stops adding throughput and starts adding only latency',
            'The maximum number of concurrent connections the load generator can create',
          ], 2, 'Below the knee more traffic means more work completed; above it requests simply queue, so that point is your real capacity per instance.'),
          q('Why is load testing against a nearly empty database misleading?', [
            'A table with a thousand rows never reveals the missing index that matters at ten million, so the result says nothing about production',
            'Empty tables cause the connection pool to close idle connections early',
            'Query planners refuse to use indexes below a row threshold, which inflates the measured latency',
            'The database caches the entire dataset, exactly as production does',
          ], 0, 'Query cost is dominated by data volume and plan choice, both of which only appear at production-sized tables.'),
          q('A popular cache key expires and five hundred concurrent requests all miss at once. What is that called, and what prevents it?', [
            'Cache poisoning, prevented by signing cache entries',
            'A cache stampede, prevented by single-flight locking or stale-while-revalidate so that one request refreshes the key',
            'A cold start, prevented by setting a much longer TTL',
            'Thrashing, prevented by raising the eviction threshold',
          ], 1, 'The herd must be collapsed into one refresh, which is what a single-flight lock or serving stale data during revalidation achieves.'),
        ]
      ),
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
        `,
        [
          q('Which workload is the wrong fit for spot or preemptible instances?', [
            'CI runners',
            'Batch jobs that can be restarted',
            'Stateless replicas behind a queue',
            'The primary database',
          ], 3, 'Reclaim at two minutes notice is survivable for anything replaceable, but not for the one component holding state you cannot lose.'),
          q('Why configure a stabilisation window so that scale-in is slower than scale-out?', [
            'Providers bill a minimum of one hour per instance regardless of runtime',
            'A short lull otherwise removes capacity you need again ninety seconds later, so you pay for the cold start twice',
            'Scaling in during a lull would trigger a rolling update of the remaining Pods',
            'The autoscaler cannot evaluate both directions on the same interval',
          ], 1, 'Adding capacity should be eager and removing it reluctant, because a premature scale-in costs both latency and money when traffic returns.'),
          q('Why does the readiness review insist on a restore you have personally performed rather than on backups being configured?', [
            'Restore duration is needed to compute the error budget',
            'Providers only guarantee backups that have been read at least once',
            'A backup nobody has restored is a belief, and the discovery that it has been writing empty files for weeks always happens on the day you need it',
            'Configured backups expire unless a restore refreshes the retention window',
          ], 2, 'Only a restore proves the data is recoverable; a successful backup job proves nothing more than that a file was written.'),
        ]
      ),
        lesson('Backups, Restores, and Disaster Recovery', 13, `
"Do we have backups?" is the wrong question. The right ones are: how much data can we afford to lose, how long can we afford to be down, and when did we last prove both numbers by actually doing it.

### Two numbers, agreed before anything is built

**RPO** — recovery point objective — is how much data you can lose, and it is set by how often you capture. **RTO** — recovery time objective — is how long you can be down, and it is set by how fast you can restore *and how much you have practised*.

| Design | RPO | RTO | Cost |
|---|---|---|---|
| Nightly snapshot | Up to 24 hours | Hours | Almost nothing |
| Snapshot plus continuous write-ahead log archiving | Under 5 minutes | 30–90 minutes | Low |
| Warm standby, replicated continuously | Seconds | Minutes | One extra database |
| Synchronous standby across zones | Zero | Seconds, automatic | Double, plus write latency |

Write both numbers down and have the business agree them. Every argument about backup spending is really an argument about these two numbers, conducted without naming them.

### A replica is not a backup

Replication copies everything faithfully, mistakes included. \`DELETE FROM orders\` with a bad \`WHERE\` clause reaches the replica in milliseconds. So does a migration that drops the wrong column, and so does anyone holding your production credentials.

A backup has to be **a point in the past** and **outside the blast radius**: a separate account or project, credentials production does not hold, and object-lock or immutability set so that nothing — including your own automation — can delete it before its retention expires. Backups sitting in the same account behind the same keys as production protect you against exactly one failure mode, hardware, which is the one the provider already handles.

### What to back up, and what not to

Back up the database (point-in-time recovery, plus a periodic logical dump for portability), object storage (versioning on, replicated to a second account), the contents of your secret manager, and the Terraform state from Chapter 4. Do **not** back up application servers: they are rebuilt from an image and a manifest, which is precisely what immutable infrastructure bought you.

\`\`\`bash
# The portability escape hatch: works across providers, and survives losing the account
pg_dump --format=custom --no-owner "$DATABASE_URL" > orders-2026-08-19.dump
pg_restore --clean --if-exists --dbname "$SCRATCH_URL" orders-2026-08-19.dump
\`\`\`

### Verify the restore, never the backup

A backup job exiting 0 proves a file was written. It does not prove the file contains rows. Restore into a scratch database on a schedule and assert something real:

\`\`\`sql
SELECT count(*) AS orders_yesterday
FROM orders
WHERE created_at > now() - interval '1 day';   -- expect around 4,000; zero means an empty dump
\`\`\`

Automate that assertion and alert on it. Empty-backup incidents are almost never found by the backup system; they are found by the person who needed the data.

### Rehearse it, and time it

Put a restore drill in the calendar every quarter and treat it exactly like the rollback rehearsal from Chapter 5. Restore into a scratch environment, point a copy of the application at it, run a smoke test, and **write down the wall-clock time**.

The number is usually unwelcome. A 400GB snapshot can take 40 minutes to restore and another 20 before the cache is warm enough to serve real traffic. If your stated RTO is 15 minutes, the drill has just told you that snapshots are not your recovery plan and you need a warm standby — and you now have evidence rather than an opinion with which to fund it.

Record in the runbook who is allowed to declare a restore, where the credentials for the backup account live, the exact commands, and how success is verified. Then check the thing everybody forgets: that the person on call can actually reach the backup account at 3am. Access you have never tested is access you do not have.
        `,
        [
          q('A service takes a nightly snapshot at 02:00 and loses its database at 17:00. What recovery point does that design imply?', [
            'Zero, because the snapshot is transactionally consistent',
            'Up to 24 hours of loss, here 15 hours, since everything written after 02:00 is gone',
            'Whatever the restore takes, which is the number that matters',
            'Five minutes, because write-ahead logs cover the interval',
          ], 1, 'The recovery point is decided by capture frequency, so a daily snapshot means losing everything written since the last one.'),
          q('Why is a read replica not a backup?', [
            'Replicas always lag, so they are slightly out of date',
            'A replica cannot be promoted without downtime',
            'Replica traffic is billed per gigabyte transferred',
            'A destructive change replicates in milliseconds, so the replica loses the same rows the primary did — recovery needs a point in the past and a copy production credentials cannot delete',
          ], 3, 'Replication faithfully reproduces mistakes, so it protects against hardware failure and nothing else.'),
          q('Your stated RTO is 15 minutes, and a drill shows the 400GB snapshot restore takes 40 minutes plus 20 more before the cache is warm. What has the drill established?', [
            'That snapshot restore is not the recovery plan for this service, and meeting the stated RTO requires a warm standby or a faster tier',
            'That the recovery point objective should be lowered to compensate',
            'That the snapshot is corrupt, since a healthy restore would be faster',
            'That the drill should be repeated off-peak to obtain a representative number',
          ], 0, 'The measured restore time is the real RTO, so a drill that exceeds the target is telling you to change the design rather than the target.'),
        ]
      ),
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
      chapter(
      'Reliability Engineering: SLOs, On-Call, and Incidents',
      'Turning a latency target into an error budget, a pager rotation people can survive, and an incident response that produces learning rather than blame.',
      [
      lesson('Error Budgets and Burn-Rate Alerts', 14, `
Your API ran at 99.95% availability last month, comfortably inside its 99.9% target, and the team still lost three nights to the pager. The alert from Chapter 5, error rate above 2% for five minutes, fired every time a rollout restarted a Pod and a handful of in-flight requests were refused. Twelve pages. Zero of them worth waking anyone.

The alert was not wrong about the errors. It was wrong about whether those errors mattered, because it never looked at the budget they were spending.

### Burn rate is the only number that matters

A 99.9% monthly SLO leaves a budget ratio of 0.001, which is about 43 minutes of full outage across 30 days. **Burn rate** is your observed bad-event ratio divided by that budget ratio. At 1.4% errors, the burn rate is 0.014 / 0.001 = 14, so you would spend the entire month's budget in roughly 51 hours.

That single number lets one alert cover both the slow leak and the cliff.

| Burn rate | Budget spent | Long window | Short window | Response |
|---|---|---|---|---|
| 14.4 | 2% in 1 hour | 1h | 5m | page immediately |
| 6 | 5% in 6 hours | 6h | 30m | page |
| 1 | 10% in 3 days | 3d | 6h | ticket, business hours |

### Why two windows and not one

A 1 hour window alone keeps the condition true for nearly an hour after the incident ends, so the pager stays lit while everyone stares at a recovered graph. Requiring a short window at one twelfth the length to agree means the alert resolves within minutes of the errors stopping.

\`\`\`yaml
- alert: CheckoutFastBurn
  expr: |
    (
      sum(rate(ingress_requests_total{svc="checkout",code=~"5.."}[1h]))
      / sum(rate(ingress_requests_total{svc="checkout"}[1h]))       > 0.0144
    )
    and
    (
      sum(rate(ingress_requests_total{svc="checkout",code=~"5.."}[5m]))
      / sum(rate(ingress_requests_total{svc="checkout"}[5m]))       > 0.0144
    )
  for: 2m
  labels:   { severity: page }
  annotations:
    summary: "checkout burning error budget at 14.4x, ~2 days to exhaustion"
    runbook: "https://wiki.acme.dev/runbooks/checkout-slo"
\`\`\`

### Measure where the user is, not where the code is

The metric above comes from the ingress, and that is deliberate. Instrument the ratio inside the application process and you build an alert with a hole in the middle: when the service crashloops it serves nothing, emits nothing, and the ratio becomes 0/0. Prometheus returns no samples, the comparison is never true, and the total outage is the one case your outage alert cannot see. Count at the load balancer, where the 503 the user actually received is recorded even when nothing is running behind it.

### The trap at low traffic

A service handling 20 requests per minute puts about 100 requests in a 5 minute window. One failure is 1%, a burn rate of 10 against a 99.9% target, and a single retryable blip pages someone at 4am. Three fixes, in order of preference: lengthen the short window to 30 minutes, add a minimum-volume guard, or admit the SLO is unmeasurable at that volume and pick a target the traffic can resolve.

\`\`\`promql
and sum(rate(ingress_requests_total{svc="checkout"}[5m])) > 1
\`\`\`

Chasing 99.99% on a low-traffic internal service is a common and expensive mistake. Four nines is 4.3 minutes a month. You cannot distinguish that from noise without millions of requests, and you will pay for the attempt in pages.

### Write the policy before you need it

An error budget that triggers nothing is a dashboard decoration. Agree the consequences in advance, with product in the room, while nobody is angry:

| Budget remaining | What changes |
|---|---|
| Above 50% | ship normally, risky experiments allowed |
| 25% to 50% | no config changes on Fridays, rollouts stay canaried |
| Below 25% | feature freeze, the next sprint is reliability work |
| Exhausted | freeze holds until the budget recovers and the postmortem items close |

The argument you want to avoid is the one held at 25% remaining, in a room where somebody has a launch date. Sign the table in a quiet week and the burn-rate page becomes arithmetic instead of politics.
      `,
        [
          q('A burn-rate alert requires both a 1 hour window and a 5 minute window to exceed the threshold. What does the short window contribute?', [
            'It lowers the effective threshold so smaller error spikes still page someone',
            'It smooths the ratio so that one failed request can never trigger the rule',
            'It clears the alert within minutes of the errors stopping, rather than an hour later',
            'It measures latency while the long window is responsible for the error ratio',
          ], 2, 'A long window stays true long after an incident ends, so the short window is what makes the alert resolve promptly once the bad events stop.'),
          q('Your SLI ratio is computed from counters inside the application process. The service crashloops and serves nothing at all. What happens to the burn-rate alert?', [
            'No requests are recorded, so the ratio has no samples and the alert never fires',
            'It fires immediately, because every metrics scrape now returns an error',
            'It fires once the Pod restarts and the counters are backfilled by Prometheus',
            'It fires at burn rate 1, since the budget drains at the default rate',
          ], 0, 'A ratio built from in-process counters disappears when the process does, so the total outage becomes the one failure the outage alert cannot see, which is why the SLI is measured at the ingress.'),
          q('A service handles about 20 requests per minute against a 99.9% target. Why does a 5 minute short window generate noisy pages?', [
            'Prometheus cannot evaluate rate() reliably on fewer than 60 samples per window',
            'The long window dominates the and expression whenever request volume is low',
            'Low traffic services require a lower SLO target rather than a longer window',
            'One failure in about 100 requests is a 10x burn rate, so a single blip crosses it',
          ], 3, 'At low volume a single request is a large fraction of the window, so ordinary retryable errors produce burn rates high enough to page.'),
        ]
      ),
      lesson('An On-Call Rotation People Can Survive', 13, `
Six people, one week each, under two pages a shift. Those three numbers decide whether your rotation is a job or a slow-motion resignation letter.

Start with the part nobody does on paper.

| Engineers | Shift | Gap between shifts | What actually happens |
|---|---|---|---|
| 3 | 1 week | 3 weeks | one third of every month owned by the pager, attrition within two quarters |
| 4 | 1 week | 4 weeks | every fourth weekend, forever, and no slack when someone takes leave |
| 6 | 1 week | 6 weeks | sustainable, provided pages stay under two per shift |
| 8 | 1 week | 8 weeks | comfortable, but skills decay between shifts, so pair it with game days |

Four is the number most teams land on by accident, because four is how many people happen to be on the team. It commits every engineer to a quarter of their evenings and weekends indefinitely, which is a compensation and retention decision being made silently by a scheduling tool.

### Primary, secondary, and an escalation that ends at a human

\`\`\`hcl
resource "pagerduty_escalation_policy" "checkout" {
  name      = "checkout-production"
  num_loops = 2

  rule {                                  # primary has 5 minutes to acknowledge
    escalation_delay_in_minutes = 5
    target { type = "schedule_reference", id = pagerduty_schedule.primary.id }
  }
  rule {                                  # then the secondary, who is also asleep
    escalation_delay_in_minutes = 10
    target { type = "schedule_reference", id = pagerduty_schedule.secondary.id }
  }
  rule {                                  # then the manager, deliberately
    escalation_delay_in_minutes = 15
    target { type = "user_reference", id = var.engineering_manager_id }
  }
}
\`\`\`

A rotation with no secondary has a single point of failure wearing pyjamas. One phone left on silent and nobody comes, and the first person to notice the outage is a customer on Twitter.

The manager tier is not there to debug. It is there so that a page which nobody acknowledged at 3am lands on the desk of the person who can fund fixing it. Alert quality improves fastest when its cost is visible to whoever owns the roadmap.

### Budget the interrupts like you budget the errors

Pages per shift is a metric. Chart it next to the SLO. The rule that works: **any alert that pages more than three times a month is either fixed or deleted in the next sprint**, no exceptions, no "we will get to it".

And the shift itself is capacity, not a bonus. An on-call engineer assigned a full load of story points does neither job. Their sprint commitment is the pager, the runbook fixes, and the open postmortem action items.

### The handoff is written, not spoken

\`\`\`md
## Handoff 2026-08-24 -> 2026-08-31, checkout-production
Pages: 3 (2x fast burn during the 21:00 deploy, 1x cert expiry warning)
Open: replica lag alert firing intermittently, INC-4471, not yet root caused
Silenced: NodeDiskPressure on node-pool-b, expires 2026-08-26 09:00 UTC, owner: Priya
Watch: payments provider has a maintenance window Thursday 02:00 to 04:00 UTC
\`\`\`

Every silence carries an expiry and an owner. A silence with neither is the standard way an outage runs for six hours with nobody hearing about it, and it is always discovered afterwards, in the postmortem, by someone reading the alertmanager config for an unrelated reason.

### Nobody goes primary first

Run a shadow shift. The new engineer carries the pager alongside the primary for one full week and takes every page while the primary watches and says nothing unless it is going wrong. Then reverse it. The first page someone handles alone should not also be the first page they have ever seen, at 3am, on the service they joined six weeks ago.

Test the runbooks the same way. Hand one to a person who has never run it and watch them follow it literally. Every step they cannot complete is a step the author filled in from memory, and memory is exactly what is missing at 3am.
      `,
        [
          q('A team of four runs one week on-call shifts. What does that arithmetic actually commit each engineer to?', [
            'About two weeks of pager duty per quarter, which most teams absorb easily',
            'Every fourth week and every fourth weekend of their life, with no cover for leave',
            'A shift every four weeks, which the chapter treats as the sustainable floor',
            'Roughly one page per week, assuming the alert rules are reasonably tuned',
          ], 1, 'Four people on weekly shifts means a quarter of all evenings and weekends belong to the pager permanently, and any absence leaves the rotation with no slack.'),
          q('Why does the escalation policy end at an engineering manager instead of looping back through the on-call engineers again?', [
            'Managers hold the credentials required to authorise a production rollback',
            'Compliance rules require a named approver for any change made during an incident',
            'It shortens the acknowledgement window for pages raised during business hours',
            'It puts the cost of an unacknowledged page in front of whoever can fund fixing it',
          ], 3, 'The manager tier is not a debugging resource, it exists so that alert quality problems become visible to the person who controls the roadmap.'),
          q('A handoff note lists an alert that has been silenced with no expiry and no owner. What failure does that set up?', [
            'The condition returns, nothing pages, and the outage runs with nobody aware',
            'The silence blocks the escalation policy from delivering any other alert',
            'The incoming shift is unable to acknowledge pages until it has been cleared',
            'The silenced period is counted against the service error budget for the month',
          ], 0, 'An open-ended silence quietly disables an alert forever, so the next occurrence of that condition produces no page at all.'),
        ]
      ),
      lesson('Incident Command: Roles, Severity, and Comms', 13, `
Eleven people joined the bridge. Three of them ran the same query against the same replica. Two argued about rolling back while a fourth quietly rolled back anyway. Nobody wrote anything down, and the status page said "we are investigating an issue" for ninety minutes.

The database failover took twelve minutes. The other seventy-eight were coordination failure, and coordination failure is the part you can fix with a page of rules.

### Four roles, one hard rule

| Role | Owns | Never does |
|---|---|---|
| Incident commander | severity, decisions, who does what next | touches a keyboard |
| Operations lead | every change made to the system | talks to customers |
| Comms lead | status page, support, executive updates | debugs |
| Scribe | timeline in UTC, decisions and their times | investigates |

The rule is the commander does not debug. The instant they open a terminal, the incident loses its only decision maker and becomes eleven engineers with opinions. On a small team one person can hold commander and comms together. Never commander and operations.

Pick whoever is available to command, not the most senior engineer available. That person is usually your best debugger, and putting them in command takes your best debugger off the keyboard for the whole incident.

### Severity is a routing decision, not a verdict

| Sev | Meaning | Who wakes | Comms |
|---|---|---|---|
| SEV1 | core flow broken, no workaround, budget burning above 14.4x | primary, secondary, commander, manager | status page within 15 minutes, update every 30 |
| SEV2 | degraded or partial, workaround exists | primary, plus commander if it runs past 30 minutes | internal channel, hourly |
| SEV3 | single customer or cosmetic, no budget impact | nobody, ticket in business hours | none |

Teams under-declare because declaring feels like admitting you broke something. Fix that by making declaration cost one command and downgrading completely routine:

\`\`\`text
/incident declare sev2 "checkout 5xx at 6% since 21:12 UTC, fast burn firing"
  -> opens #inc-2026-08-24-checkout-5xx
  -> pages the commander on rotation
  -> drafts the status page entry, unpublished
  -> starts the timeline, timestamps every message in the channel
\`\`\`

A SEV2 downgraded to SEV3 after ten minutes costs one interrupted coffee. A SEV2 that stayed undeclared for an hour costs the postmortem its timeline and the customer their trust.

### The status update, broken and fixed

Broken:

\`\`\`text
We are investigating an issue affecting some users. We will update shortly.
\`\`\`

That tells a customer nothing except to keep refreshing, and "shortly" generates more support tickets than the outage itself.

Fixed:

\`\`\`text
21:24 UTC. Checkout is failing for roughly 1 in 15 attempts. Browsing, cart
and account pages are unaffected. Cause identified: a failing database replica.
We are shifting reads to the primary now. Next update 21:45 UTC or sooner.
\`\`\`

Impact in the user's language, what still works, what you are doing, and a committed time for the next update. Publish the next update at 21:45 even if nothing has changed, because silence after a promised time is read as a bigger outage than the one you have.

### One channel, and no direct messages

Everything happens in the incident channel, in UTC, including the decisions. A conversation held in a DM cannot be recorded by the scribe, so the postmortem timeline develops a hole in exactly the place the important decision was made, and the reconstruction two days later is guesswork by tired people.

When an incident crosses hours, hand over command explicitly and in the channel: who is taking it, what is known, what has been tried, what is next. An implicit handover is how a SEV1 ends up with nobody in charge at 2am.
      `,
        [
          q('Why is the incident commander told never to touch a keyboard during an incident?', [
            'Command decisions must be entered by the scribe so the timeline stays accurate',
            'A commander with shell access invalidates the change audit trail for the incident',
            'Debugging takes their attention off coordination and the incident loses its decision maker',
            'The operations lead cannot apply changes while a second person is also connected',
          ], 2, 'Command is a full-time job during an incident, and a commander who starts investigating leaves a room full of engineers with no one directing them.'),
          q('Your team consistently declares incidents late or not at all. Which change addresses the cause?', [
            'Require a manager to approve any severity higher than SEV3 before declaring',
            'Make declaring cost one command and make downgrading a completely routine act',
            'Reserve SEV1 strictly for outages that fully exhaust the monthly error budget',
            'Page every engineer on the team so that no declaration can be quietly missed',
          ], 1, 'People hesitate because declaring feels like an admission, so the fix is to lower its cost and remove the stigma of downgrading afterwards.'),
          q('What is actually wrong with a status page reading \'We are investigating an issue and will update shortly\'?', [
            'It discloses an outage before the legal team has approved the wording',
            'It commits to a resolution time that the responders cannot yet promise',
            'It should not be published at all until the root cause has been confirmed',
            'It gives no impact, no unaffected surface, and no next update time, so customers refresh and file tickets',
          ], 3, 'A useful update names the user-visible impact, what still works, the current action, and a committed time for the next message, and the vague version simply generates support load.'),
        ]
      ),
      lesson('Blameless Postmortems and Game Days', 13, `
"Action item: be more careful when editing production configuration." Six people signed that postmortem in January. In March the same class of config change took checkout down again, and the second postmortem produced the same sentence.

Nothing about the system had changed, because nothing in the action items proposed changing it.

### Blameless means counterfactual free

| Instead of | Write |
|---|---|
| Dana should have noticed the diff | The deploy tool showed no diff of what was about to change |
| The engineer forgot to check staging | Nothing in the pipeline blocked a prod apply that skipped staging |
| Human error during a manual step | The step is manual, ordered, and has no confirmation prompt |

Sentences on the left describe a world that did not happen and prescribe nothing. Sentences on the right name something you can go and build on Monday. Human error is where an investigation starts, never where it ends: the useful question is what made that action look correct at the time, given the information on the screen.

### Carry the numbers

| Measure | This incident | What it points at |
|---|---|---|
| Time to detect | 41 min | alerting, and the burn-rate windows from earlier |
| Time to acknowledge | 3 min | rotation and escalation are healthy |
| Time to mitigate | 6 min | the rollback path works |
| Time to resolve | 3h 10m | fine, users were already served |

Read that table and the work is obvious. Detection ate 41 of the 47 minutes users suffered, so this is an alerting problem, not an architecture problem, and rewriting the failover logic would improve nothing.

### Action items that survive contact with a sprint

| Weak | Strong |
|---|---|
| Improve monitoring | Add a 14.4x burn-rate alert on the checkout SLI, owner Priya, INC-4471-1, due 2026-09-05 |
| Document the failover | Runbook step executed by a first-time reader at the next game day |
| Be careful with config | Deploy tool prints the diff and requires the environment name typed to confirm |

Every item takes a named person, not a team, a ticket ID, and a date. Then measure the only statistic that predicts repeat incidents: the share of action items closed within 30 days. Below about 70% and your postmortem process is theatre with good formatting.

### Game days: the failover you have not tested does not work

Configured is not tested. Run it on purpose, in daylight, with everyone watching.

\`\`\`bash
# Game day 2026-09-12. Hypothesis: checkout stays inside its SLO with the cache tier gone.
# Abort if burn rate exceeds 14.4 for 5 minutes, or 5% of the monthly budget is spent.

kubectl -n prod scale deploy/redis-proxy --replicas=6   # <- write the undo command FIRST
kubectl -n prod scale deploy/redis-proxy --replicas=0   # 14:02 UTC, start the clock
\`\`\`

Four things exist in writing before anything is injected: the hypothesis, the blast radius, the abort criterion, and one person watching the SLO who is not participating and whose only job is calling the abort.

The findings surprise people. They are almost never technical. The runbook links to a dashboard deleted in last quarter's migration. The escalation policy points at someone who left in June. The failover procedure is known by exactly one person, who is on a plane. The machines usually behave; the documentation and the humans are what fail.

A game day where everything works smoothly was scoped too small. Take the next one closer to the thing that scares you, run it at 14:00 on a Tuesday with the whole team present, and find out then rather than at 3am with one tired engineer and a runbook written from memory.
      `,
        [
          q('Why does the chapter reject \'be more careful when editing production configuration\' as an action item?', [
            'It proposes no change to the system, so the same mistake stays exactly as easy',
            'It belongs in the timeline section of the document rather than the action list',
            'It lacks an owner, which is the single thing every action item must carry',
            'Careful cannot be measured, so the item can never be given a sensible due date',
          ], 0, 'An action item has to alter the system, the tooling or the process, because exhorting people to be careful leaves the conditions that produced the incident untouched.'),
          q('A postmortem records time to detect at 41 minutes and time to mitigate at 6 minutes. Where should the follow-up work go?', [
            'Into the rollback path, since mitigation is the half the user actually experiences',
            'Into the on-call rotation, because acknowledgement was clearly the slow step here',
            'Into alerting, because detection consumed nearly all of the user-visible outage',
            'Into capacity work, because a very fast mitigation implies a load related cause',
          ], 2, 'Detection accounted for 41 of the 47 minutes users suffered, so improving alerting is the only change that would meaningfully shorten a repeat.'),
          q('A game day runs exactly as designed and nothing breaks anywhere. What does the chapter say that most likely means?', [
            'The abort criteria were set so tightly that the injected failure never developed',
            'The blast radius was scoped too small to test anything the team was unsure about',
            'The hypothesis was written after the injection instead of agreed in advance',
            'Staging had drifted from production and absorbed the fault before it spread',
          ], 1, 'A clean run means the exercise avoided the parts of the system that actually worry you, so the next game day should move closer to them.'),
        ]
      ),
      ],
      [
      q('A 99.9% monthly SLO is burning error budget at 14.4x. Roughly how long before the whole month\'s budget is gone?', [
        'About six hours',
        'About twelve hours',
        'About one day',
        'About two days',
      ], 3, 'A 14.4x burn spends about 2% of the monthly budget every hour, so the full budget lasts roughly fifty hours, which is why that threshold pages rather than files a ticket.'),
      q('During a SEV1, which pairing of role and responsibility matches the model the chapter describes?', [
        'The scribe owns the status page and all outbound customer communication',
        'The comms lead owns customer updates and takes no part in debugging',
        'The incident commander owns the rollback command and writes the timeline',
        'The operations lead owns severity decisions and briefs the executive team',
      ], 1, 'Comms owns everything customer facing precisely so that nobody debugging or commanding is also drafting updates.'),
      q('Your rotation averages seven pages a shift and roughly half of them require no action. What does the chapter say to do first?', [
        'Spend the next sprint deleting or fixing the noisiest alert rather than shipping features',
        'Add a third and fourth engineer to the rotation so the load is spread more thinly',
        'Raise the SLO target so that fewer conditions manage to cross the alert threshold',
        'Route the noisy alerts to the secondary responder so the primary can sleep properly',
      ], 0, 'Alert noise is treated as a defect with a sprint cost, because a rotation drowning in unactionable pages will eventually ignore the one that matters.'),
      q('What do the error budget policy, the page budget per shift, and the postmortem action item list have in common?', [
        'All three are owned by the incident commander for the duration of a SEV1',
        'Each is a compliance artifact that gets reviewed during the quarterly audit',
        'Each turns a judgement call into a number that was agreed before the pressure arrived',
        'Each is derived automatically from the thresholds set on the burn-rate alerts',
      ], 2, 'Every one of them replaces an argument held under stress with a threshold and a consequence written down in a calm week.'),
      ]
    ),
    chapter(
      'Progressive Delivery and GitOps',
      'Letting the cluster pull its own desired state out of Git, and promoting a release with a canary that aborts itself on the metrics you already collect.',
      [
      lesson('GitOps: The Cluster Pulls Its Own Changes', 14, `
A production incident at 02:40. Someone runs \`kubectl scale deploy/api --replicas=20\` to absorb a traffic spike, the errors stop, everybody goes back to bed. At 09:15 an unrelated merge triggers CI, the pipeline runs \`kubectl apply -f k8s/\`, and the replica count drops back to 3 because that is what the manifest in git says. The spike is still there. The second outage is worse than the first, and nobody connects the two for an hour.

That is the push model failing the way it always fails. The cluster's real state and the repository's declared state drift apart, and nothing notices until an apply happens to overwrite one with the other.

### Push versus pull

| | Push (CI runs kubectl) | Pull (agent in the cluster) |
|---|---|---|
| Credentials | Cluster admin token lives in CI | Never leave the cluster |
| Drift | Invisible until the next apply | Detected on every reconcile loop |
| Deploy record | A pipeline run somebody has to find | A commit in a repo |
| Network | CI must reach the API server | Cluster reaches out to git |

In the pull model an agent inside the cluster, Argo CD or Flux, watches a git repository and reconciles continuously, roughly every three minutes by default plus a webhook for speed. Git holds the desired state, the controller closes the gap. It is the same control loop the Deployment controller runs, moved one level up so that the declaration itself is the thing under version control.

### Two repositories, one commit per deploy

The application repo holds source and the Dockerfile. A separate config repo holds manifests. The last step of the build pipeline is not a deploy, it is a commit:

\`\`\`yaml
- name: Point prod at the image we just built
  run: |
    git clone https://x-access-token:\${{ secrets.CFG_TOKEN }}@github.com/acme/platform-config.git
    cd platform-config/apps/api/overlays/prod
    kustomize edit set image ghcr.io/acme/api=ghcr.io/acme/api@\${{ steps.build.outputs.digest }}
    git commit -am "api \${{ github.sha }}"
    git push
\`\`\`

Deploy history is now \`git log\`. What changed at 14:02 is a query, who approved it is the pull request, and rollback is \`git revert\`, which is a normal reviewable change rather than a special emergency command with its own permissions.

### The Application object

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: api-prod, namespace: argocd }
spec:
  source:
    repoURL: https://github.com/acme/platform-config.git
    targetRevision: main
    path: apps/api/overlays/prod
  destination: { server: https://kubernetes.default.svc, namespace: prod }
  syncPolicy:
    automated: { prune: true, selfHeal: true }
\`\`\`

\`selfHeal: true\` reverts anything changed outside git within minutes. That is the feature, not a bug: the 02:40 hotfix stops being a silent time bomb and becomes an immediate, visible reversion.

### The fight nobody expects: HPA versus git

Leave \`replicas: 3\` in a manifest for a Deployment that an HPA also controls and you have built a loop that scales you down during a traffic spike. The HPA sets 12, Argo CD sees drift from 3, selfHeal applies 3, the HPA sets 12 again. Delete the field from the manifest, or exclude it:

\`\`\`yaml
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers: ["/spec/replicas"]
\`\`\`

The same trap catches anything a mutating webhook injects: sidecars, default resource fields, cert-manager annotations.

### Prune is sharper than it looks

\`prune: true\` deletes resources this Application previously applied that are no longer in the source. Deleting a manifest actually removes the resource, which is exactly what you want. It also means a rename is a delete plus a create. Rename a StatefulSet and the old one goes away, its Pods with it, while the new one comes up bound to fresh claims and the data sits in orphaned PVCs. Mark anything stateful with \`argocd.argoproj.io/sync-options: Prune=false\` and rename it deliberately.

### Ordering with sync waves

A migration Job has to finish before the new Pods start. Annotate it:

\`\`\`yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
    argocd.argoproj.io/hook: Sync
\`\`\`

Lower waves apply first and the sync waits for each wave to go healthy. That is how declarative ordering replaces a numbered runbook.
      `,
        [
          q('A Deployment\'s manifest in git says replicas: 3 while an HPA has scaled it to 12 during a traffic spike, and Argo CD has automated sync with selfHeal enabled. What happens?', [
            'The HPA wins, because it writes to the scale subresource rather than the Deployment',
            'Argo CD marks the app OutOfSync and waits for a human to approve the difference',
            'Argo CD scales the Deployment back to 3, cutting capacity in the middle of the spike',
            'Argo CD updates the manifest in git to 12 so that the two sides agree again',
          ], 2, 'selfHeal reapplies whatever git declares, so a replica count left in the manifest fights the autoscaler and wins, which is why the field is removed or added to ignoreDifferences.'),
          q('Why does the pull model remove long-lived cluster admin credentials from the CI system?', [
            'The agent runs inside the cluster and reads git, so CI only needs write access to a config repo',
            'CI authenticates with a short-lived token that the cluster mints for every pipeline run',
            'The cluster proxies kubectl calls through the git host, which performs the authentication',
            'Credentials are still required, but they are scoped down to a single target namespace',
          ], 0, 'Reconciliation happens from inside the cluster outward, so the API server credential never has to exist anywhere else and a compromised runner cannot reach production.'),
          q('An Application syncs with prune enabled, and a pull request renames a StatefulSet from orders-db to orders-postgres. What is the risk?', [
            'Argo CD refuses to sync at all, because StatefulSet names cannot be changed',
            'Both resources run side by side until somebody deletes the older one by hand',
            'The rename applies in place and the Pods restart under their new names',
            'The old StatefulSet is pruned and the new one starts on fresh claims, orphaning the data',
          ], 3, 'A rename is a delete plus a create to a reconciler that matches by name, so anything stateful needs the Prune=false sync option and a deliberate migration.'),
        ]
      ),
      lesson('Helm, Kustomize, and Encrypted Secrets', 13, `
Two directories, \`k8s/staging/\` and \`k8s/prod/\`, each holding a full copy of nine manifests. During an incident somebody raises the prod memory limit to 1Gi and never touches staging. Six weeks later a load test proves the service is comfortable at 512Mi, then prod OOMKills under identical load because the two files disagree about four other things as well. Copies drift, and once they drift the test environment stops testing anything.

The fix is to store the difference between environments, not a second copy of everything.

### Kustomize: a base plus the delta

\`\`\`yaml
# apps/api/overlays/prod/kustomization.yaml
resources: [../../base]
namespace: prod
images:
  - name: ghcr.io/acme/api
    digest: sha256:8c41d9e2ab7f0c
replicas:
  - { name: api, count: 6 }
patches:
  - target: { kind: Deployment, name: api }
    patch: |
      - op: replace
        path: /spec/template/spec/containers/0/resources/limits/memory
        value: 1Gi
\`\`\`

\`kustomize build apps/api/overlays/prod\` prints the exact YAML that will be applied, so you can diff two environments and read their entire difference in a few lines. There is no templating language, which means no \`{{ if }}\` blocks and no chance of producing YAML that is syntactically valid and semantically nonsense.

### Helm: a package with parameters and a release history

Helm renders Go templates against a values file and records each install as a release. It earns its place for software you did not write:

\`\`\`bash
helm upgrade --install cert-manager jetstack/cert-manager \\
  --version 1.15.3 -f values-prod.yaml --atomic --timeout 5m
\`\`\`

\`--atomic\` rolls back automatically if the release fails to go healthy, which turns a half applied upgrade into a no-op.

| Situation | Reach for |
|---|---|
| Manifests your team owns | Kustomize overlays |
| Third party software | A pinned Helm chart |
| A chart missing one field you need | \`helm template\` piped into a Kustomize patch |

The gotcha is \`helm rollback\`. Release history lives in Secrets in the namespace and defaults to the last ten revisions, so the version you want during an incident may already be gone. Under GitOps the point is moot anyway: the agent renders the chart and applies plain manifests, so recovery is reverting a commit, not a Helm subcommand.

### Secrets, which cannot sit in git as plaintext

| Approach | Where the key lives | Best for |
|---|---|---|
| SOPS with age | A key the platform team holds, plus cloud KMS | Reviewable diffs, few secrets |
| Sealed Secrets | A controller keypair inside the cluster | Simple setup, one cluster |
| External Secrets Operator | Your cloud secret manager | Rotation, audit, many clusters |

SOPS encrypts values and leaves keys readable, so a pull request still shows what changed:

\`\`\`yaml
stringData:
    DATABASE_URL: ENC[AES256_GCM,data:9k2QpH4x,iv:7c1a,tag:Rm9v,type:str]
    STRIPE_KEY: ENC[AES256_GCM,data:Lb03Ttz9,iv:44de,tag:QUJD,type:str]
\`\`\`

A reviewer sees that \`STRIPE_KEY\` was rotated without seeing the value. Encrypt the whole file with gpg instead and every diff is one unreadable blob that nobody can review.

Two failures worth writing down. First, Sealed Secrets are encrypted against one controller's private key, so a cluster rebuilt after a region failure cannot decrypt a single one of them unless that key was in your backups. Second, and more common day to day:

\`\`\`yaml
# rotating the value in AWS Secrets Manager updates the Kubernetes Secret,
# and the running Pod keeps the old value forever
kind: ExternalSecret
spec:
  refreshInterval: 1h
  secretStoreRef: { name: aws-sm, kind: ClusterSecretStore }
  target: { name: api-secrets }
  dataFrom:
    - extract: { key: prod/api }
\`\`\`

Environment variables are read once at process start. The Secret updates, the Pod does not, and the rotation looks successful until the old credential is revoked. Mount the secret as a file and reload it, or run something like Reloader that annotates the Deployment with a checksum so a changed Secret triggers a normal rolling update.
      `,
        [
          q('Staging and prod each keep a complete copy of the same nine manifests. Which failure does an overlay structure prevent?', [
            'Two copies double the work the reconciler does on every sync interval',
            'A change made to one copy and not the other means staging stops testing prod',
            'Kubernetes rejects identical resource names when they exist in two namespaces',
            'A build tool cannot render a directory that contains duplicated resource files',
          ], 1, 'Storing only the delta means the shared parts cannot diverge, so a test against staging remains evidence about the configuration prod actually runs.'),
          q('Why is helm rollback a weaker safety net than reverting a commit in the config repository?', [
            'Rollback restores ConfigMaps and Secrets but leaves Deployments at the new version',
            'Rollback re-renders the templates using whichever values file is current on disk',
            'Helm keeps only the last ten revisions by default, so the target may already be gone',
            'Release history lives in etcd directly and is compacted on every upgrade attempt',
          ], 2, 'The history limit silently discards older revisions, whereas a git history keeps every applied state and makes the reversion a reviewable change.'),
          q('A cluster is rebuilt from scratch after a region failure and every SealedSecret fails to decrypt. What was missing from the plan?', [
            'The controller\'s private key was never backed up, and a new cluster generates its own',
            'Sealed secrets must be resealed per namespace before they can be applied anywhere',
            'The manifests were committed before the controller was installed into the repository',
            'Sealed secrets carry a ninety day expiry and had all quietly passed it by then',
          ], 0, 'Sealing is done against one controller keypair, so that key is a restore dependency exactly like a database backup and belongs in the disaster recovery test.'),
        ]
      ),
      lesson('Automated Canary Analysis and Traffic Shifting', 15, `
The canary ran for four minutes at 5% and passed every check. The full rollout took the checkout error rate from 0.3% to 4%, and the pager fired eleven minutes later. Look at the arithmetic before blaming the tool: the service handles 5 requests per second, so 5% of it for four minutes is about 60 requests. One error in 60 is 1.7%, zero errors is 0%, and no threshold separates a healthy build from a broken one at that sample size. The canary was theatre.

Chapter 5 established why canaries beat big-bang releases. What makes them actually work is the traffic mechanism, the query, and the sample size.

### Shift traffic honestly

Approximating weight with replica counts, one canary Pod out of twenty, is close enough for stateless HTTP/1.1 behind a round-robin Service and wrong everywhere else. A long-lived HTTP/2 or gRPC connection pins a client to whichever Pod it dialled, so a handful of chatty callers can land 40% of requests on your 5% canary. Real weights come from the ingress controller or the mesh:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      canaryService: api-canary
      stableService: api-stable
      trafficRouting:
        nginx: { stableIngress: api }
      analysis:
        templates: [{ templateName: error-rate }]
        args: [{ name: canary-hash, valueFrom: { fieldRef: { fieldPath: "metadata.labels['rollouts-pod-template-hash']" } } }]
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: { duration: 5m }
\`\`\`

### The analysis is a query, so read it like one

\`\`\`yaml
kind: AnalysisTemplate
metadata: { name: error-rate }
spec:
  args: [{ name: canary-hash }]
  metrics:
    - name: http-5xx-ratio
      interval: 1m
      count: 10
      failureLimit: 2
      successCondition: result[0] <= 0.01
      provider:
        prometheus:
          address: http://prometheus.monitoring:9090
          query: |
            sum(rate(http_requests_total{job="api",code=~"5..",
              rollouts_pod_template_hash="{{args.canary-hash}}"}[2m]))
            /
            sum(rate(http_requests_total{job="api",
              rollouts_pod_template_hash="{{args.canary-hash}}"}[2m]))
\`\`\`

That label selector is the whole trick. Leave \`rollouts_pod_template_hash\` out and the query measures both versions together, so the stable version's clean traffic dilutes the canary's failures nineteen to one and a 20% canary error rate reads as 1% overall. The check passes forever and nobody notices until it matters.

\`failureLimit: 2\` matters too. One scrape returning no data, or a divide by zero during the first seconds when the canary has served nothing, should not abort a release.

### Compare against a baseline of the same age

Comparing a brand new canary against Pods that have been running for six days is comparing two different things. The canary has a cold cache, an unwarmed connection pool, and a JIT that has not settled, so its p95 is legitimately worse for the first minute or two. Deploy a **baseline**, one Pod running the old image started at the same moment, and compare canary against baseline. Now the only variable left is the code.

### Sample size decides how long you wait

| Service traffic | Canary at 5% | Requests in 10 min | Smallest regression visible |
|---|---|---|---|
| 5 rps | 0.25 rps | 150 | around 3% |
| 50 rps | 2.5 rps | 1500 | around 0.6% |
| 200 rps | 10 rps | 6000 | around 0.2% |

Low traffic services should not run a 5% canary at all. Go straight to 50% for five minutes, or skip the canary and lean on a fast rollback, which is honest rather than reassuring.

### What a canary cannot see

It sees the requests you point the query at. It does not see the nightly billing job, the Kafka consumer that now crashes on one message type, the migration that silently doubled query time, or the 0.4% of requests taking the code path you actually changed. Point one metric at the SLI from Chapter 8 so the abort condition matches the harm users feel, then add a second metric aimed specifically at whatever this release touched.
      `,
        [
          q('A service handles 5 requests per second and its canary takes 5% of traffic for five minutes. Why can that analysis not detect a 1% error rate regression?', [
            'Prometheus scrapes every 15 seconds, so short evaluation windows discard samples',
            'Ratio queries need at least one full hour of data before they stabilise',
            'Roughly 75 requests reach the canary, so one error and none look the same',
            'The canary and the stable version publish metrics under identical label sets',
          ], 2, 'At that sample size the expected number of failures is under one, so the observed error rate cannot distinguish a broken build from a healthy one and the check is decorative.'),
          q('Why compare a canary against a baseline Pod started at the same time rather than against the long-running stable Pods?', [
            'The stable Pods serve far more traffic, which biases their error ratio downward',
            'Fresh Pods have cold caches and unwarmed pools, so age alone skews the comparison',
            'A metrics backend cannot query two versions of one Deployment in a single expression',
            'The stable ReplicaSet is scaled to zero as soon as the rollout begins its first step',
          ], 1, 'Comparing a new process against a warmed one measures startup effects as well as the code change, so the baseline holds age constant and leaves the code as the only variable.'),
          q('Every canary metric passed and the release still broke a subset of users. Which explanation fits best?', [
            'The traffic weight was applied by replica count rather than at the ingress layer',
            'The analysis interval was shorter than the metrics backend scrape interval',
            'The rollout skipped its pause steps because one metric returned no data at all',
            'The failure was in a background consumer that the analysis never queried',
          ], 3, 'Canary analysis only measures the signals its queries name, so asynchronous work and rarely taken code paths pass unexamined unless a metric targets them.'),
        ]
      ),
      lesson('Coordinating a Release Across Many Services', 14, `
Thirty services, one release, and a runbook with a step 7 that says deploy orders, wait for green, then step 8, deploy checkout. Orders went out at 10:04. At 10:31 an approved pull request auto-merged and checkout deployed early, sending an \`amount\` object that orders would only understand after step 8. Sixty two minutes of failed payments, caused not by a bug in either service but by the ordering requirement itself.

Any release that requires services to deploy in a particular order is a distributed monolith with extra network hops. The work is not building better coordination, it is removing the need for it.

### Make ordering unnecessary with additive contracts

\`\`\`json
// what checkout sends today
{ "orderId": "A-8812", "amountCents": 4990 }

// broken: replaces the field in one release
{ "orderId": "A-8812", "amount": { "cents": 4990, "currency": "PKR" } }

// additive: emit both for one release cycle
{ "orderId": "A-8812", "amountCents": 4990,
  "amount": { "cents": 4990, "currency": "PKR" } }
\`\`\`

That is the expand and contract pattern from Chapter 5 applied to the wire format instead of a table. Three releases, in any order: emit both fields, move consumers onto the new one, remove the old field once no consumer reads it. On the receiving side be a tolerant reader, which means ignore unknown fields rather than rejecting the payload. A strict schema validator that fails on an extra key turns every producer deploy into a coordinated one.

### Prove compatibility in CI, not in production

Consumer driven contract tests move the ordering constraint from a runbook into a build:

\`\`\`bash
# orders pipeline, before the image is published
pact-provider-verifier --provider orders \\
  --broker-url https://pact.acme.internal \\
  --provider-version "$GIT_SHA" \\
  --enable-pending
\`\`\`

Checkout publishes what it expects from orders. The orders build replays every consumer expectation against the new code and fails before anything ships. A human forgetting step 8 is now impossible, because step 8 no longer exists.

### When simultaneity is genuinely required, flip a flag

Some changes really do need four services to switch together: a new pricing model, a currency rollout, a replacement identity provider. Ship all four dark across the week, each deploying independently and each carrying both paths, then flip one flag at 10:00 on Tuesday. Reverting is another flip, effective in seconds, with no deploy and no ordering. Compare that to rolling back four services in reverse order under pressure.

### Promotion moves a digest, it does not rebuild

\`\`\`diff
 # apps/api/overlays/prod/kustomization.yaml
 images:
   - name: ghcr.io/acme/api
-    digest: sha256:0f2a1b6d7c9e
+    digest: sha256:8c41d9e2ab7f
\`\`\`

Rebuilding from the same commit for prod can produce different bytes, because a base image moved or a transitive dependency republished. Promote the artifact staging tested, identified by the digest from Chapter 2. For a change spanning twelve services, one pull request bumps twelve digests, one merge promotes them together, and one revert takes them all back.

### The services nobody deploys

| Deploys per month | What the deploy path is | Risk |
|---|---|---|
| 20 or more | Rehearsed constantly | Low |
| 2 to 5 | Mostly reliable | Manageable |
| 0 for months | An untested hypothesis | Discovered during an incident |

The service that has not shipped since March is the one that fails when a security patch forces it out at 23:00: its credentials expired, its base image no longer builds, its pipeline references a deleted action. Deploy every service on a schedule even when nothing changed. A release path used weekly is a capability, and one used twice a year is a document.
      `,
        [
          q('A release runbook says service A must deploy before service B or checkout breaks. What does that requirement actually reveal?', [
            'A shared contract was changed in a way that is not backward compatible',
            'Service B needs a longer readiness probe than it is currently configured with',
            'The sync tool is missing wave annotations that would order the two applications',
            'The two services are too small and should be merged into a single deployable',
          ], 0, 'Ordering is only necessary when one version cannot talk to the other, so the durable fix is an additive change that leaves both combinations working.'),
          q('How does a feature flag let a change spanning four services ship without an enforced deploy order?', [
            'The flag holds each service\'s rollout until the previous one reports itself healthy',
            'Flags route around the ingress, so old and new code paths never share live traffic',
            'Every service ships both paths dark, then a single flip switches them together',
            'The flag service translates old payload shapes for any consumer still lagging behind',
          ], 2, 'Deploying and releasing become separate events, so the services can arrive over days in any order while the behaviour changes at one instant that is also reversible in seconds.'),
          q('Why is promoting the same image digest from staging to prod better than rebuilding from the same commit?', [
            'A rebuild picks a different base image tag and would fail the admission policy',
            'A rebuild can produce different bytes, so prod would run something never tested',
            'Rebuilding invalidates the layer cache and roughly doubles total pipeline time',
            'Digests are mandatory whenever the reconciler has pruning turned on for the app',
          ], 1, 'Base images move and dependencies get republished, so only the exact digest that passed staging carries the evidence you gathered about it.'),
        ]
      ),
      ],
      [
      q('In a GitOps setup, which artifact is the authoritative record that a deploy happened?', [
        'The pipeline run that built and pushed the container image',
        'The event stream the reconciler keeps inside the cluster',
        'The mutable tag that was applied to the image in the registry',
        'The commit in the config repository that changed the digest',
      ], 3, 'Desired state lives in git, so the commit that changed it is both the trigger and the auditable record, which makes revert the standard rollback.'),
      q('Which secret handling approach keeps a cloud secret manager as the single source of truth?', [
        'SOPS encrypting values with an age key that the platform team holds',
        'The External Secrets Operator syncing values into a Kubernetes Secret',
        'Sealed Secrets encrypted against the keypair of the in-cluster controller',
        'A ConfigMap of base64 values protected by tight RBAC on that namespace',
      ], 1, 'The operator pulls from the manager on a refresh interval, so rotation and audit stay in one system and the cluster only ever holds a synced copy.'),
      q('Why is an SLI burn rate a better canary abort condition than a CPU threshold?', [
        'It measures the harm users are experiencing, which is what a rollback exists to stop',
        'It is averaged over a longer window and therefore produces far less noise',
        'Resource metrics are unavailable to analysis providers during an active rollout',
        'Queries over service level indicators evaluate faster because they touch less data',
      ], 0, 'Aborting should be driven by user visible symptoms, since a canary can be busy without failing anyone and can fail everyone while using very little CPU.'),
      q('The reconciler reports OutOfSync for an application whose repository nobody has touched. What is the most likely cause?', [
        'The target revision points at a branch that has since been deleted upstream',
        'The image digest referenced by the manifest was overwritten by a newer push',
        'Something changed the live resources outside git and reconciliation sees the drift',
        'The repository credentials expired, so the desired state can no longer be read',
      ], 2, 'OutOfSync compares live state against the declared state, so with the repo unchanged the difference has to come from a change made directly against the cluster.'),
      ]
    ),
    chapter(
      'Platform Engineering: Paved Roads for Many Teams',
      'Infrastructure code, cloud accounts, and guardrails at the size where dozens of engineers ship daily and nobody can review every change by hand.',
      [
      lesson('Terraform Modules, Remote State, and Stack Boundaries', 14, `
One root module. 640 resources. \`terraform plan\` takes nine minutes, because refresh calls the provider API once per resource, and every engineer who wants to change anything waits behind whoever holds the lock. Then a reviewer approves a plan that contains a queue rename and a routing table change in the same diff, at 18:40 on a Friday.

The fix is not a faster machine. It is smaller stacks.

### Draw boundaries by rate of change and blast radius

A stack is the unit of \`apply\`, the unit of locking, and the unit of blame. Group resources that move together and separate resources whose failure modes differ.

| Stack | Changes | Holds | If it goes wrong |
|---|---|---|---|
| \`network\` | Yearly | VPC, subnets, transit gateway, DNS zones | Every service in the region |
| \`data\` | Monthly | RDS, ElastiCache, S3 buckets, KMS keys | Data loss, not a rollback |
| \`platform\` | Weekly | EKS cluster, node groups, ingress, observability | All workloads at once |
| \`service\` | Daily | One app's tasks, queues, alarms, DNS record | One service |

Forty daily service changes now plan in twenty seconds against a state file holding thirty resources, and none of them can touch the VPC.

### Stacks talk through published contracts

Once split, the service stack needs subnet IDs it no longer creates. Two ways to get them:

\`\`\`hcl
# Tight: reads the producer's entire state file
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "cortexis-tfstate"
    key    = "network/eu-west-1.tfstate"
    region = "eu-west-1"
  }
}

# Loose: a narrow published contract any tool can read
data "aws_ssm_parameter" "private_subnets" {
  name = "/platform/eu-west-1/private_subnet_ids"
}
\`\`\`

\`terraform_remote_state\` needs every consumer to hold read access to the producer's state file, and state files store attributes in plaintext, including generated passwords. Publishing the three values consumers actually need to SSM or tagging resources and looking them up with a data source keeps the contract narrow and the state file private.

### Locking, and one key per stack

\`\`\`hcl
terraform {
  backend "s3" {
    bucket       = "cortexis-tfstate"
    key          = "service/payments-api/prod.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true   # S3 conditional write, Terraform 1.10+. Before that, a DynamoDB table.
  }
}
\`\`\`

Two concurrent applies against an unlocked key produce a state file that describes neither reality nor either engineer's intent. Recovery is manual \`terraform state rm\` and \`import\` against a versioned S3 object, at whatever hour you discover it.

### \`count\` renumbers, \`for_each\` does not

Broken, and extremely common:

\`\`\`hcl
variable "services" { default = ["billing", "payments", "search"] }

resource "aws_ecr_repository" "svc" {
  count = length(var.services)
  name  = var.services[count.index]
}
\`\`\`

Drop \`billing\` from that list. Index 0 is now \`payments\`, index 1 is \`search\`, index 2 is gone. Terraform sees three addresses whose \`name\` changed, and \`name\` forces replacement: it plans to destroy and recreate the repositories, taking every image tag inside them with it.

\`\`\`hcl
resource "aws_ecr_repository" "svc" {
  for_each = toset(var.services)
  name     = each.value
}
\`\`\`

Addresses become \`aws_ecr_repository.svc["payments"]\`, stable no matter what else leaves the list. Migrate existing resources with \`moved\` blocks rather than state surgery:

\`\`\`hcl
moved {
  from = aws_ecr_repository.svc[1]
  to   = aws_ecr_repository.svc["payments"]
}
\`\`\`

### Modules are interfaces, so version them

A shared module is an API you are promising to support. Few required inputs, defaults for everything else, outputs that hide the resource names inside so you can refactor later. Pin the source:

\`\`\`hcl
module "service" {
  source = "git::ssh://git@github.com/cortexis/tf-modules.git//service?ref=v2.4.0"
  name   = "payments-api"
  cpu    = 512
}
\`\`\`

Unpinned, a colleague's merge into \`main\` changes your next production plan without you touching a file.

The mistake at the other end is the mega module: one wrapper around everything, growing a new variable every time somebody has a new requirement, until it has sixty inputs that are pure passthroughs. That is a second, worse Terraform layered on Terraform. Compose small modules in a root module instead, and let the root module hold the opinions.
      `,
        [
          q('Two engineers run apply against the same state key at the same time, and the backend has no locking configured. What is the likely outcome?', [
            'The second apply queues behind the first and runs once the lock clears',
            'The state file ends up describing neither reality nor either engineer\'s intent',
            'Terraform aborts both runs because the state serial numbers disagree',
            'Each apply writes into its own workspace, so the two never collide',
          ], 1, 'Without a lock both runs read the same starting state and write over each other, leaving a state file that matches no real infrastructure and has to be repaired by hand.'),
          q('Why is reading another stack with data terraform_remote_state a tighter coupling than reading a published SSM parameter?', [
            'It re-runs the producer stack\'s plan before it will return any outputs',
            'It only works when both stacks use the same backend type and region',
            'It caches outputs locally, so consumers see stale values after an apply',
            'It needs read access to the producer\'s whole state file, secrets included',
          ], 3, 'State files hold resource attributes in plaintext, so granting every consumer read access to the producer\'s state widens the secret exposure far beyond the two or three values they actually need.'),
          q('Three ECR repositories are created with count over a list of service names, and the first name is removed from that list. What does the next plan do?', [
            'Destroys and recreates repositories, taking the image tags inside with them',
            'Removes only the repository whose name left the list, leaving the rest alone',
            'Renames the two remaining repositories in place without any replacement',
            'Refuses to plan until a moved block reconciles the shifted addresses',
          ], 0, 'With count, every index below the removed element shifts down, so Terraform sees the name attribute change on each address and name forces replacement of the repository and its contents.'),
        ]
      ),
      lesson('Multi-Account Landing Zones and Federated Identity', 14, `
A trust policy in a production account was four lines long and had been reviewed twice. It checked that the incoming token came from GitHub and that its audience was \`sts.amazonaws.com\`. Both true. Both true for every GitHub Actions job on the internet, which is why anyone who created a public repository could assume that role and read the account.

That bug is a two line fix. The structure that limits what it reaches is this topic.

### The account is the failure boundary

IAM decides what a principal may do. The account decides what a mistake can reach. Service quotas, API rate limits, billing, and default cross-account deny all stop at the account line, and none of them stop at a tag.

Run a load test in a shared account and it burns the same Lambda concurrency limit and the same EC2 API rate that production depends on. Run it in its own account and the blast radius is exactly one account. Isolation by naming convention is a policy you can typo.

| Organisational unit | Accounts | Guardrails applied |
|---|---|---|
| \`Security\` | \`log-archive\`, \`audit\` | Nobody can delete logs, read-only access outward |
| \`Infrastructure\` | \`network\`, \`shared-services\` | Transit gateway, DNS, CI runners |
| \`Workloads/Prod\` | \`payments-prod\`, \`search-prod\` | Region deny, root usage deny, deletion protection |
| \`Workloads/NonProd\` | \`payments-stg\`, \`search-stg\` | Hard budget cap, large instance types denied |
| \`Sandbox\` | One per engineer | 30 day expiry, low budget, no peering to anything |

### Service control policies subtract, never add

An SCP cannot grant a permission. Effective access is the intersection of the SCP and the IAM policy, so a principal with \`AdministratorAccess\` in an account under a region deny still cannot create an instance in Tokyo.

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideApprovedRegions",
    "Effect": "Deny",
    "NotAction": ["iam:*", "organizations:*", "route53:*", "cloudfront:*", "support:*"],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": { "aws:RequestedRegion": ["eu-west-1", "eu-west-2"] },
      "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::*:role/BreakGlass" }
    }
  }]
}
\`\`\`

Two things surprise people here. Global services live in \`us-east-1\`, so \`NotAction\` has to exempt IAM, Route 53, CloudFront and support or you lock yourself out of DNS. And **SCPs do not apply to the management account at all**, which is why that account should own zero workloads and hold nothing but the organisation itself.

### Humans and machines both federate, nobody gets a key

Target state: zero IAM users, zero long-lived access keys. People sign in through the identity provider and land in a permission set that assumes a role with a one hour session. Pipelines exchange an OIDC token for a role, valid for the length of the job.

Here is the broken trust policy, in full:

\`\`\`json
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
  }
}
\`\`\`

And the fix, which pins the identity of the caller rather than the identity of GitHub:

\`\`\`json
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:cortexis/payments-api:ref:refs/heads/main"
  }
}
\`\`\`

Use \`StringLike\` with a wildcard only where you genuinely need one, and never \`repo:cortexis/*\` for a production role: that grants any repository in the organisation, including the one somebody creates this afternoon.

### Account vending, because the tenth account is where discipline dies

A new account should arrive complete: CloudTrail shipping to \`log-archive\`, config rules on, a budget alarm at 80 percent, cost allocation tags, an OIDC provider, a deploy role scoped to one repository, and membership of the right OU. Automate it on day one.

Create accounts by hand and the arithmetic catches up with you. Forty accounts later, nine have no recorded owner, three never had CloudTrail enabled, and the one that gets compromised is always from that group.
      `,
        [
          q('A team argues separate accounts are unnecessary because IAM policies and resource tags already separate their environments. What are they giving up?', [
            'The ability to attach IAM permission boundaries per environment',
            'Cross-account role assumption, which tags cannot express at all',
            'Quota and rate limit isolation, so a load test can throttle production',
            'Encryption keys scoped to a single environment\'s workloads only',
          ], 2, 'Service quotas and API rate limits are counted per account, so workloads sharing an account compete for the same ceiling regardless of how carefully their IAM policies and tags are written.'),
          q('A GitHub Actions trust policy checks only that the aud claim equals sts.amazonaws.com. Who can assume that role?', [
            'Any GitHub Actions workflow anywhere, since every job carries that audience',
            'Only workflows in repositories owned by the same GitHub organisation',
            'Only workflows running on the branch named in the role\'s description',
            'Nobody, because the sub claim must match before a token is even issued',
          ], 0, 'The audience claim identifies the token\'s intended recipient rather than the caller, so pinning it alone lets any repository on GitHub present a valid token, which is why the sub claim has to be matched too.'),
          q('An SCP denying ec2 actions outside two regions is attached to the root of the organisation. Which principal does it fail to restrict?', [
            'A role in a sandbox account that has AdministratorAccess attached',
            'A role assumed through the identity provider rather than an IAM user',
            'A service-linked role created automatically by an AWS service',
            'Any principal inside the organisation\'s management account',
          ], 3, 'Service control policies never apply to the management account, which is exactly why that account should hold the organisation and nothing else.'),
        ]
      ),
      lesson('Policy as Code and Admission Guardrails', 13, `
The webhook that enforced every policy in the cluster ran two replicas, and the scheduler had put both on the same node. The node was drained during a routine upgrade. \`failurePolicy: Fail\` did the rest: the API server could not reach the webhook, so it rejected every Pod creation in the cluster, including the two replacements for the webhook itself.

That is what a guardrail looks like when it fails closed and nobody thought about it. Guardrails are still the right answer, because at forty engineers and two hundred pull requests a week, nobody is reading every plan.

### Two enforcement points, doing different jobs

| Where | Runs at | Feedback | Can be skipped |
|---|---|---|---|
| Pre-merge, over the plan JSON | Pull request, seconds | Precise, with the file and line | Yes, by applying from a laptop |
| Admission, in the cluster | Object creation | Terse, late in the loop | No |
| Cloud side, SCP or Org Policy | The provider API | Opaque \`AccessDenied\` | No |

Pre-merge exists for feedback. Admission and cloud-side controls exist for enforcement. You want both, because the fast one is the one people learn from and the unskippable one is the one that holds when somebody is tired.

### Testing the plan, not the code

Terraform will hand you the whole diff as JSON, which is far more reliable than pattern matching HCL:

\`\`\`bash
terraform plan -out=tfplan
terraform show -json tfplan > plan.json
conftest test --policy policy/ plan.json
\`\`\`

\`\`\`rego
package terraform.rds

deny contains msg if {
  r := input.resource_changes[_]
  r.type == "aws_db_instance"
  "create" == r.change.actions[_]
  not r.change.after.storage_encrypted
  msg := sprintf("%s creates an unencrypted database", [r.address])
}
\`\`\`

That runs in about 400 milliseconds and posts the resource address straight into the pull request. A human reviewer at 18:00 on a Friday does not.

### Admission policies, rolled out in the right order

\`\`\`yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-memory-limit
spec:
  validationFailureAction: Audit   # Enforce only once the count is near zero
  rules:
    - name: memory-limit-required
      match:
        any:
          - resources:
              kinds: [Pod]
      validate:
        message: "every container needs resources.limits.memory"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
\`\`\`

Ship it as \`Audit\` and read the report. A realistic first day is 312 violations across 41 namespaces, most of them from three old Deployments and a Helm chart nobody owns. Two weeks of small pull requests takes it to 9, and then you flip to \`Enforce\` and nothing breaks.

Ship it as \`Enforce\` on day one and you spend that day being the reason nothing deploys, and the first exception you grant under pressure becomes permanent.

### Make the guardrail survive its own failure

\`\`\`yaml
webhooks:
  - name: validate.kyverno.svc
    failurePolicy: Fail
    timeoutSeconds: 5
    namespaceSelector:
      matchExpressions:
        - key: kubernetes.io/metadata.name
          operator: NotIn
          values: [kube-system, kyverno]
\`\`\`

Three replicas, a PodDisruptionBudget, a topology spread constraint across nodes, a short timeout, and a \`namespaceSelector\` that excludes the control plane namespaces and the policy engine's own namespace. Without that exclusion the engine cannot restart itself, and a cluster in that state needs someone with cluster-admin to delete the webhook configuration by hand.

### Mutate before you validate

Validation argues with people. Mutation just fixes the object: inject a default seccomp profile, add the standard topology spread, set a missing \`runAsNonRoot\`. Every rule you can express as a mutation is a rule that never generates a rejection, a Slack message, or an exception request.

Then give exceptions a front door. Every one carries an owner, a reason, and an expiry date, checked in next to the policy. A policy with forty permanent exceptions is not a policy, it is a document, and everyone can tell the difference.
      `,
        [
          q('A validating admission webhook configured with failurePolicy Fail loses both of its replicas at once. What happens next?', [
            'The API server falls back to the last cached admission decision',
            'Object creation is rejected cluster-wide, including the webhook\'s replacements',
            'The webhook configuration is marked Ignore until it reports healthy again',
            'Only objects in namespaces carrying the policy label are affected',
          ], 1, 'Fail means the API server rejects anything it cannot get an admission decision for, so with no healthy webhook the cluster blocks the very Pods that would bring the webhook back.'),
          q('Why run a new cluster policy in Audit mode for a couple of weeks before switching it to Enforce?', [
            'Enforce mode cannot evaluate objects that already exist in the cluster',
            'Audit is the only mode that writes policy reports back to the API server',
            'It surfaces the real violation backlog so it is fixed before anything blocks',
            'The engine requires one completed audit pass before Enforce is selectable',
          ], 2, 'Existing workloads almost always violate a new rule, so auditing first turns a day of blocked deploys into a fortnight of small pull requests that end with a clean switch to Enforce.'),
          q('Your pre-merge Conftest check already rejects unencrypted databases. Why also enforce the same rule with a cloud-side control?', [
            'Pre-merge checks only see changes that go through the pipeline at all',
            'Rego cannot express encryption requirements for managed database services',
            'Cloud-side policies evaluate faster than a policy engine reading plan JSON',
            'Conftest cannot read plan JSON for resources created inside a module',
          ], 0, 'A pull request check is skipped by anyone applying from a laptop or clicking in the console, so enforcement has to sit at the provider API where nothing can route around it.'),
        ]
      ),
      lesson('Golden Paths and the Internal Developer Platform', 13, `
Time from \`git init\` to a new service taking production traffic: 19 days at one company, 40 minutes at another. Same cloud, same language, similar headcount. The 19 days were not engineering time. They were fourteen tickets, a networking request, an argument about which dashboard template to copy, and a week of waiting for someone to add the service to the pager rota.

### A golden path is the cheap route, not the compulsory one

One repository template, one CI workflow, one deploy mechanism, one observability stack, one way to register an on-call rota. You are allowed to leave it. If you do, you own the wiring, and nobody will fix your alerting at 03:00 because nobody else understands it. That trade is honest, and it is why paved roads win without a mandate.

### What the scaffold actually produces

\`\`\`bash
cortexis new service --name payments-api --lang node --tier 1
\`\`\`

| Artifact | Where it lands |
|---|---|
| Repo from template, Dockerfile, \`/healthz\` and \`/readyz\` | \`github.com/cortexis/payments-api\` |
| CI calling a versioned reusable workflow | \`.github/workflows/ci.yml\`, pinned to \`v3.4.0\` |
| Terraform stack calling the shared service module | \`stacks/services/payments-api\` |
| Dashboard with RED panels and two symptom alerts | Provisioned as code, not clicked |
| Catalog entry naming owner, tier and rota | \`catalog-info.yaml\` |

\`\`\`yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: payments-api
  annotations:
    pagerduty.com/service-id: PXY42Q
spec:
  type: service
  owner: team-payments
  lifecycle: production
  tier: "1"
  dependsOn: [resource:postgres-payments, component:ledger-api]
\`\`\`

That file turns "who owns this and who gets paged" from an archaeology project into a query, which is exactly what the rota in Chapter 8 needs to exist at all.

### Templates rot, versioned components do not

Here is the mistake almost everyone makes on the first attempt: a fat template with all the build logic inlined. A template forks the moment it is used. Eight months and sixty services later, a security fix to the build steps is sixty pull requests against six drifting copies of the same YAML, and half of them fail because the copy diverged.

Keep the template thin and move everything that changes into something versioned.

| Belongs in the template | Belongs in a versioned component |
|---|---|
| Service name, owner, port | Build and test steps, as a reusable workflow |
| The first handler and its test | Base image and runtime hardening |
| The catalog entry | Terraform service module |
| Local dev compose file | Alert rules and dashboard definitions |

Now a fix is a version bump delivered by a dependency bot, and "how many services are still on \`v3.2\` of the workflow?" is one query rather than a survey.

### The platform is a product, and adoption is the score

If every request arrives as a ticket, you have built operations with a new name. Self-service means an engineer runs the thing and no human is in the loop. Three numbers tell you whether that is true:

- **Time to first production deploy for a new service.** Target under a day. This is the headline number, and it is the one leadership understands.
- **Share of services on the paved road.** Below 60 percent, the path is not paved, it is suggested.
- **Platform tickets per engineer per month.** Rising while service count is flat means self-service broke somewhere and people are routing around it.

### Build the escape hatch first

An abstraction that fits 80 percent of services with no way out gets forked by the other 20 percent, and then you maintain two platforms with one team. Every layer should let someone drop one level down: print the generated manifest, run the underlying command directly, take ownership of a copy.

The teams that leave the paved road and come back six months later are the most useful feedback you will get all year. They can tell you precisely which part was not worth it.
      `,
        [
          q('A platform team ships a fat repository template with all the build logic inlined. Sixty services later, what does a security fix to that build cost?', [
            'One version bump, applied to every repository by the dependency bot',
            'A single edit to the template, inherited by the existing repositories',
            'Nothing, because generated repositories re-sync from their template',
            'Sixty pull requests against six drifting copies of the same logic',
          ], 3, 'A template forks at generation time and never receives updates, so inlined logic diverges across every repository and each copy has to be fixed individually.'),
          q('Platform team tickets per engineer have climbed for three months while the number of services has stayed flat. What does that most likely mean?', [
            'The golden path is being adopted faster than the team can document it',
            'Self-service has broken somewhere, so the platform is now an ops queue',
            'Engineers are bypassing the paved road and running their own tooling',
            'The catalog is missing owners, so requests land on the wrong team',
          ], 1, 'Ticket volume rising without service growth means engineers cannot complete something themselves any more, which is the definition of a platform that has stopped being self-service.'),
          q('Why does every layer of a golden path need an escape hatch rather than a single supported route?', [
            'Compliance rules require a manual override path for any audited change',
            'Generated code cannot be edited once its catalog entry has been created',
            'Without one, teams the abstraction does not fit fork it and you support two',
            'Escape hatches are how the scaffolder rolls back a failed generation',
          ], 2, 'An abstraction that covers most cases with no way out pushes the remaining teams into building a parallel platform, which costs the same team far more than supporting a documented drop-down path.'),
        ]
      ),
      ],
      [
      q('You are splitting one Terraform state holding 640 resources into several. What should decide where the boundaries fall?', [
        'Rate of change and blast radius, so daily edits never plan beside the VPC',
        'The team that owns each resource, so every team gets exactly one state',
        'The provider each resource uses, keeping AWS and Datadog stacks apart',
        'Resource count, splitting whenever a stack passes about a hundred',
      ], 0, 'Stacks are the unit of apply, locking and blame, so grouping resources that change together and separating those with very different consequences is what shrinks both plan time and risk.'),
      q('Which combination gives engineers fast feedback and also gives you enforcement that cannot be skipped?', [
        'Admission policies left in Audit mode plus a nightly drift report',
        'A pull request review checklist plus a quarterly compliance audit',
        'Pre-merge policy tests plus a required approval from the platform team',
        'Pre-merge policy tests plus an admission or cloud-side control',
      ], 3, 'The pre-merge check is the one that teaches, because it names the resource in the pull request, and the admission or provider-side control is the one nothing can route around.'),
      q('Why should a new cloud account be created by automation rather than by a person working through the console?', [
        'Manually created accounts cannot be moved into an organisational unit',
        'Baseline logging, budgets, guardrails and a deploy role arrive every time',
        'Providers charge a lower rate for programmatically created accounts',
        'Console creation skips the OIDC provider that service control policies need',
      ], 1, 'Vending an account with its baseline attached is what stops the fortieth account from being the one with no owner and no audit trail, which is reliably the one that gets compromised.'),
      q('A team leaves the golden path to run their own CI and deployment tooling. What does the platform team owe them?', [
        'A mandate returning them to the supported path within a single quarter',
        'The same support level, funded out of the platform team\'s own budget',
        'Nothing past the escape hatches, plus real attention to why they left',
        'A forked copy of the platform, maintained alongside the main one',
      ], 2, 'A paved road works because it is cheaper, not because it is compulsory, so leaving it means owning the wiring while their reasons remain the most valuable roadmap input available.'),
      ]
    ),
    chapter(
      'Performance Forensics Under Real Load',
      'Finding the component that is actually saturated in a live system, from queueing and flame graphs to the tail latency that only appears at production fan-out.',
      [
      lesson('Saturation, Queueing, and Why Latency Explodes', 13, `
Traffic climbs from 400 to 700 requests per second and p99 holds steady at 310ms. At 780 it is 4.2 seconds. Nobody deployed, no dependency broke, and CPU only moved from 58% to 71%. The graph looks like a cliff because it is one, and the shape is not a bug in your code. It is arithmetic.

### The last 10% of headroom costs more than the first 90%

Wherever requests wait for a resource that serves one at a time, mean wait grows with \`1 / (1 - utilisation)\`. That factor is unremarkable right up until it is not.

| Utilisation | Multiplier | 40ms of work becomes |
|---|---|---|
| 50% | 2x | 80ms |
| 70% | 3.3x | 133ms |
| 80% | 5x | 200ms |
| 90% | 10x | 400ms |
| 95% | 20x | 800ms |
| 99% | 100x | 4.0s |

Between 80% and 90% you add ten points of load and double what every user waits. That is why a service which shrugged off a 40% traffic increase falls over on the next 5%: the first increase happened on the flat part of the curve, the second did not.

### Little's Law gives you the ceiling without a load test

Concurrency equals arrival rate times latency. It holds for any stable system, with no assumption at all about how requests are distributed.

A worker pool of 8 with a mean service time of 40ms tops out at 8 / 0.040 = 200 requests per second. Point 5,000 clients at it and it still completes 200 per second, it just makes the other 4,800 wait. At 180 rps you are sitting at 90% utilisation, which the table above prices at 10x.

Run the law backwards to measure rather than predict: if tracing shows 12 requests in flight on average while you serve 300 per second, mean latency is 12 / 300 = 40ms. No stopwatch needed.

### Utilisation is not saturation, and saturation is the honest signal

Utilisation is the fraction of time a resource was busy. Saturation is the work that could not start. A box can sit at 65% CPU with fourteen threads queued behind it, and the queue is the part your users feel.

\`\`\`bash
# The "r" column is threads ready to run but waiting for a CPU. Read it, not "us".
vmstat 1 3
# procs -----------memory---------- ------cpu-----
#  r  b   swpd   free   buff  cache  us sy id wa
# 14  0      0 812344  92160 3221224 61  9 30  0
\`\`\`

For a Node service the equivalent number is event loop delay, and it is the most useful gauge you can add in five lines:

\`\`\`js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const loop = monitorEventLoopDelay({ resolution: 10 });
loop.enable();
setInterval(() => {
  gauge('event_loop_delay_p99_ms', loop.percentile(99) / 1e6);
  loop.reset();
}, 10_000);
\`\`\`

A p99 loop delay of 240ms means every request paid 240ms of queueing before the first line of your handler ran. No profiler will show that as time inside your function, because it was not.

### Averages hide the saturation you are hunting

A one minute average of 65% utilisation is equally consistent with a steady 65% and with 100% for six seconds out of every ten. Traffic arrives in bursts, so it is usually the second. Scrape every 10 to 15 seconds and chart the p99 of queue depth rather than the mean of utilisation, or the interesting part gets smoothed into a flat line that reassures everybody.

### The mistake: making the queue bigger

Requests get rejected at peak, so somebody raises the listen backlog from 128 to 4096, grows the worker queue, or bumps the pool size. Capacity does not move, because capacity is set by service time and parallelism, never by how many people are allowed to stand in line. What actually changes is that fast rejections become slow timeouts: the client waits nine seconds, gives up, retries, and the queue now holds work nobody is waiting for any more. A bounded queue plus an immediate 503 is the honest answer, and it is the one that recovers on its own.
      `,
        [
          q('Your worker pool runs at 80% utilisation and a 12% traffic rise pushes it to roughly 90%. Why does p99 more than double?', [
            'Because the extra 12% of requests all happen to arrive in the same second',
            'Because mean wait scales as 1 over 1 minus utilisation, so 5x becomes 10x',
            'Because the scheduler switches to a fairer but noticeably slower policy',
            'Because garbage collection frequency rises in step with the request rate',
          ], 1, 'Queueing delay grows with 1/(1 - utilisation), so moving from 0.8 to 0.9 takes the multiplier on service time from about 5x to about 10x.'),
          q('A worker pool of 8 handles requests with a mean service time of 40ms. What is the throughput ceiling and why?', [
            '8 per second, since each worker completes one request at a time',
            '400 per second, because 40ms of work fits ten times into a second',
            '1000 per second, since the pool bounds concurrency and not rate',
            '200 per second, because concurrency equals arrival rate times latency',
          ], 3, 'Little\'s Law rearranges to arrival rate equals concurrency divided by latency, giving 8 / 0.040 = 200 requests per second as the ceiling.'),
          q('Requests are being rejected at peak, so someone raises the listen backlog from 128 to 4096. What does that actually change?', [
            'Nothing about capacity: fast rejections become slow timeouts instead',
            'Throughput rises, because the kernel can now batch accepted sockets',
            'Latency falls, since fewer clients have to reconnect and try again',
            'The knee moves higher, because the queue absorbs the extra arrivals',
          ], 0, 'Capacity is set by service time and parallelism, so a deeper queue only lets more requests wait longer before timing out.'),
        ]
      ),
      lesson('Profiling a Live Service Safely', 13, `
Two days, three engineers, and a p99 of 900ms on a service whose CPU never rose above 35%. They had a flame graph. It was flat and boring, so they decided the profiler was broken. The profiler was fine. They were reading the wrong axis of the wrong kind of profile.

### A flame graph is not a timeline

Width is the share of stack samples that contained that frame. Height is stack depth. The horizontal order is alphabetical, chosen so identical subtrees merge into one box. Two boxes side by side did not run one after the other, and a wide box was not necessarily entered once and held: it may have been entered 40,000 times for 20 microseconds each.

Read it as the answer to exactly one question. While a CPU was busy, what was it busy with?

### Sampling beats instrumentation, and 99Hz beats 100Hz

A sampling profiler interrupts the process about a hundred times a second and records the stack. Its cost tracks the sample rate, not how much work your code does, so a hot loop costs the same to profile as an idle one. The odd frequency is deliberate: at exactly 100Hz you risk locking step with timers that fire on a 10ms boundary and sampling the same frame every single time.

Wire it to a signal and fire it on the replica that is actually slow:

\`\`\`js
// Trigger with: kubectl exec deploy/api -- kill -USR2 1
import { Session } from 'node:inspector/promises';
import { writeFileSync } from 'node:fs';

const session = new Session();
session.connect();

process.on('SIGUSR2', async () => {
  await session.post('Profiler.enable');
  await session.post('Profiler.setSamplingInterval', { interval: 1000 }); // microseconds
  await session.post('Profiler.start');
  await new Promise((r) => setTimeout(r, 30_000));
  const { profile } = await session.post('Profiler.stop');
  writeFileSync(\`/tmp/cpu-\${Date.now()}.cpuprofile\`, JSON.stringify(profile));
});
\`\`\`

Leave the pod in the load balancer while that runs. Pulling it out first is the reflex, and it destroys the measurement: pools drain, caches go cold, and you profile a machine in a state production never reaches.

### Off CPU time is where the 900ms went

A CPU profiler can only sample threads that are on a CPU. A request spending 700ms awaiting Postgres contributes nothing to the graph. Flat profile plus high latency always means the same thing: the time went somewhere a CPU profiler cannot see, such as a socket, a lock, a disk, or a queue.

The service above parsed a 9MB JSON body synchronously. That blocks the event loop for roughly 120ms, so the eighth request in flight waits 960ms while consuming no CPU of its own, exactly the queueing from the previous topic. Total CPU stayed near 35% because only one of four cores was ever doing the parsing. The graph did show \`JSON.parse\`, at 4% width, which nobody looked at twice.

| Tool | Overhead | Answers |
|---|---|---|
| Sampling CPU profiler at 99Hz | 1 to 3% | which functions burn CPU |
| Continuous eBPF profiler | under 1%, always on | the same, fleet wide, with history |
| Heap snapshot | seconds of stop the world | what is retaining memory |
| Trace spans | 1 to 5% at full sampling | where the wall clock actually went |

### The button that kills the pod

A heap snapshot walks the entire object graph, pauses the process for seconds, and roughly doubles resident memory while it builds. On a container with a 512Mi limit and 300Mi in use, the snapshot is what killed the pod, and the incident review then blames a memory leak that was never there. Take snapshots on a canary replica with a raised limit, or on a copy replaying captured traffic.

### Symbols, or a graph full of \`Ae\` and \`t\`

Profile a minified bundle and every frame carries a one letter name. Ship source maps and run with \`--enable-source-maps\`, or profile an unminified build shaped like production. Compiled languages hit the same wall as stripped binaries in a slim runtime image, worth checking before an incident rather than during one.

### The last trap

Your profile is dominated by the 99% of requests that were fine. With p50 at 20ms and p99 at 900ms, the slow ones are 1% of traffic and easy to walk straight past. Tag profiles by endpoint, or start from a trace you already know was slow and profile only the path it touched.
      `,
        [
          q('In a flame graph, what does the width of a frame actually represent?', [
            'The wall clock order in which that function was called',
            'The elapsed time between entering and leaving the function',
            'The share of collected stack samples that had it on a CPU',
            'The number of times the function was invoked during the run',
          ], 2, 'A flame graph aggregates samples rather than recording a timeline, so width is the proportion of samples containing that frame while a CPU was busy.'),
          q('You take a heap snapshot on a live production pod with a 512Mi memory limit and 300Mi in use. What is the likely result?', [
            'The process pauses and its resident memory doubles, so it is OOM killed',
            'The snapshot streams to disk lazily, so only write latency increases',
            'The runtime refuses it, because snapshots need a debugger attached first',
            'It succeeds but records only objects allocated after the snapshot began',
          ], 0, 'Building a snapshot walks the whole object graph in memory, roughly doubling RSS while the process is stopped, which pushes a tightly limited container past its limit.'),
          q('Wall clock p99 is 900ms but the CPU profile shows the process nearly idle. What should you reach for next?', [
            'A higher sampling frequency, to catch the short bursts of work',
            'A heap snapshot, since idle CPU usually points at memory pressure',
            'A longer profiling window, so more samples land in the hot path',
            'Off CPU data: span waterfalls, lock waits, or event loop delay',
          ], 3, 'A CPU profiler can only sample threads that are running, so time spent waiting on I/O, locks, or a blocked event loop is invisible to it and has to be measured another way.'),
        ]
      ),
      lesson('The Database Is Usually the Bottleneck', 13, `
The slowest query in your database is almost never the one worth fixing. Rank by total time instead of mean time and the list usually rearranges itself completely.

\`\`\`sql
SELECT substr(query, 1, 28) AS q, calls,
       round(mean_exec_time::numeric, 2)           AS mean_ms,
       round((total_exec_time / 1000)::numeric, 1) AS total_s
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 3;
\`\`\`

\`\`\`text
              q              |  calls  | mean_ms | total_s
-----------------------------+---------+---------+---------
 SELECT * FROM order_items W | 4821900 |    0.41 |  1977.0
 SELECT id, total_cents FROM |   38200 |   14.90 |   569.2
 WITH monthly AS (SELECT dat |      12 | 8210.00 |    98.5
\`\`\`

The eight second report that everyone complains about costs 98 seconds an hour. The 0.41ms lookup costs 33 minutes, because it runs 200 times per request. Fix the loop issuing it and you free more capacity than a week spent on the report.

### EXPLAIN (ANALYZE, BUFFERS), read in three numbers

\`\`\`text
Seq Scan on orders  (cost=0.00..412300.00 rows=1 width=20)
                    (actual time=812.4..8209.7 rows=52184 loops=1)
  Filter: ((status = 'pending') AND (created_at > now() - '7 days'::interval))
  Rows Removed by Filter: 11947816
  Buffers: shared hit=1024 read=311902
Execution Time: 8214.9 ms
\`\`\`

Estimated \`rows=1\` against an actual 52184 is the first number, and it is the important one: the planner picked this plan from that estimate, so anything joining to it got a nested loop that now runs 52184 times instead of once. \`Rows Removed by Filter\` is the second, and it is pure waste. \`Buffers: read=311902\` is the third, roughly 2.4GB pulled off disk at 8KB per block, which is why the timing is in seconds rather than milliseconds.

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_status_created
  ON orders (status, created_at) INCLUDE (total_cents);
\`\`\`

\`\`\`text
Index Only Scan using idx_orders_status_created
  (actual time=0.05..12.7 rows=52184 loops=1)
  Heap Fetches: 0
  Buffers: shared hit=421
Execution Time: 18.3 ms
\`\`\`

### Equality first, range last

Column order in a composite index is not cosmetic. A B-tree can only range scan on the last column it uses, so put equality predicates ahead of the range. On \`(status, created_at)\` the scan jumps straight to pending rows from the last seven days. On \`(created_at, status)\` it walks seven days of every status and filters, which on a table with 3% pending rows means reading roughly thirty times more index.

\`INCLUDE (total_cents)\` is what buys \`Heap Fetches: 0\`: every column the query needs lives in the index, so the table is never touched. The gotcha nobody expects is that this depends on the visibility map being current. Bulk update a million rows and the same query silently drops to heap fetches, latency triples, and nothing in your code changed. Autovacuum fixes it when it gets there, which may be an hour later.

### The mistake: one index per slow query

Fourteen indexes on \`orders\` means every insert and update maintains fourteen B-trees. Write latency triples, the table bloats faster, and half of those indexes serve one report nobody runs. Audit them:

\`\`\`sql
SELECT relname, indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes WHERE idx_scan < 50 ORDER BY pg_relation_size(indexrelid) DESC;
\`\`\`

### When the plan is not the problem

| What you see | Likely cause | Where to look |
|---|---|---|
| Query fast, request slow | waiting for a pool connection | your pool's wait time metric |
| Fast alone, slow under load | row level lock contention | \`pg_stat_activity\` where \`wait_event_type = 'Lock'\` |
| Steady decay over weeks | dead tuples and bloat | \`n_dead_tup\` in \`pg_stat_user_tables\` |
| Sudden change, no deploy | the plan flipped after stats moved | \`ANALYZE\`, then compare plans |

The one that catches most teams is \`idle in transaction\`. A handler that opens a transaction, calls a slow HTTP API, then commits holds its locks and blocks vacuum for the whole call. The query is 2ms. The transaction is nine seconds.
      `,
        [
          q('pg_stat_statements shows a report at 8210ms mean over 12 calls and an item lookup at 0.41ms over 4.8 million calls. Which do you work on first?', [
            'The report, because its mean is four orders of magnitude worse',
            'The lookup, because its total execution time is twenty times larger',
            'Whichever runs at peak, since mean time is load dependent anyway',
            'Neither yet, because mean time excludes time spent waiting on locks',
          ], 1, 'Total time is mean multiplied by calls, so the cheap query costs about 33 minutes an hour against the report\'s 98 seconds and returns far more capacity when fixed.'),
          q('EXPLAIN ANALYZE reports rows=1 for a node whose actual row count is 52184. Why does that matter beyond the bad guess?', [
            'The estimate is what the reported timing column is computed from',
            'Rows Removed by Filter is derived from the estimate, not the actual',
            'The planner chose the plan from that estimate, so it likely picked a nested loop',
            'A mismatch means ANALYZE is running concurrently and skewing the timings',
          ], 2, 'Plan selection happens before execution using the estimate, so an estimate that is wrong by five orders of magnitude produces a join strategy sized for one row and then runs it tens of thousands of times.'),
          q('For WHERE status = \'pending\' AND created_at > now() - interval \'7 days\', why is an index on (status, created_at) better than (created_at, status)?', [
            'Equality first lets the range scan touch only the pending rows',
            'Column order affects only the index size, never the chosen plan',
            'Timestamps must be the trailing column or the index cannot be used',
            'The planner always reads composite indexes in declaration order',
          ], 0, 'A B-tree can only range scan on the last column it uses, so leading with the equality predicate narrows the scan to pending rows before the date range is applied.'),
        ]
      ),
      lesson('Chasing p99 Across a Fan-Out', 13, `
One in a hundred calls to your search backend takes over a second. A search page fans out to fifty of them in parallel. What fraction of search pages take over a second? The intuitive answer is 1%. The real answer is 39.5%, because the page is only as fast as its slowest call, and 1 minus 0.99 to the fiftieth is 0.395.

| Parallel calls | Chance the slowest exceeds 1s |
|---|---|
| 1 | 1.0% |
| 5 | 4.9% |
| 20 | 18.2% |
| 50 | 39.5% |
| 100 | 63.4% |

This is why your p99 is your dependency's p99.98, and why every averaging instinct you have is wrong here. Parent latency is the maximum of its children, not the mean, and maxima do not average away as you add more of them. They get worse.

### Cut the fan-out before you tune anything

Fifty single key calls become one batched call and the exposure drops from 39.5% back to 1%. One request means one chance to be slow. It is the cheapest fix available and it is almost always skipped in favour of something more interesting.

### Hedge what you cannot batch

Send a second copy of the request once the first has already taken longer than usual, and take whichever answers first.

\`\`\`js
async function hedged(send, hedgeAfterMs = 90) {
  const a = new AbortController();
  const b = new AbortController();
  const first = send(a.signal);
  const second = new Promise((resolve, reject) => {
    const t = setTimeout(() => send(b.signal).then(resolve, reject), hedgeAfterMs);
    first.then(() => clearTimeout(t), () => clearTimeout(t));
  });
  try {
    return await Promise.race([first, second]);
  } finally {
    a.abort();
    b.abort();
  }
}
\`\`\`

Set \`hedgeAfterMs\` to the measured p95, so only 5% of calls are ever duplicated. You pay about 5% extra load and the tail collapses, because the second attempt usually lands on a different replica that is not garbage collecting at that instant. Two conditions, both non negotiable: the call must be idempotent, and you must have real headroom. Hedging a backend already near its knee adds load to the exact system that has none, and you have made the outage worse while feeling clever.

### Propagate a deadline, do not restate a timeout

Four hops, each with its own fixed 2 second timeout, can spend 8 seconds on a request the browser abandoned at 3. Every second after that is work nobody will read, occupying workers that live requests need.

\`\`\`js
const deadline = Number(req.headers['x-deadline-ms']) || Date.now() + 3000;
const budget = deadline - Date.now() - 50;   // 50ms held back to serialise the response
if (budget <= 0) return res.status(504).json({ error: 'deadline_exceeded' });

const r = await fetch(url, {
  headers: { 'x-deadline-ms': String(deadline) },
  signal: AbortSignal.timeout(budget),
});
\`\`\`

An absolute deadline shrinks automatically at every hop. Pair it with cancellation: when a hedged race resolves or a client disconnects, abort the losers, or you have built a system that keeps doing work for people who left.

### You cannot average percentiles

Three replicas report p99 of 400ms, 420ms and 2100ms for the same endpoint. The service p99 is not 973ms, and it is not 2100ms either. It is not computable from those three numbers at all. Percentiles only merge if you keep the histograms and add the buckets, which is exactly what \`histogram_quantile\` over a summed bucket series does, and exactly what taking the mean of three pre-computed p99s does not.

To find the guilty hop, pull twenty traces above your threshold and put them beside twenty median traces. The span that is thirty times wider, or present in one set and absent from the other, is your answer in about a minute. Exemplars make this quicker still, by linking a latency bucket straight to a trace id.

| Tail source | Signature in the data |
|---|---|
| Garbage collection pause | every endpoint spikes together, tracks heap growth |
| Head of line blocking | one large request delays small ones sharing a worker |
| Cold instance | tail jumps right after a scale out or a rollout |
| Retry storm | duplicate spans carrying the same request id |
| Noisy neighbour | the tail belongs to one node, never the others |
      `,
        [
          q('A page fans out to 50 backend calls in parallel and each has a 1% chance of exceeding one second. What share of pages exceed one second?', [
            'Around 1%, because each of the calls is independent of the others',
            'Around 5%, roughly the square root of the combined failure rate',
            'Around 20%, since only a fifth of the calls sit on the slow tail',
            'Around 40%, because 1 minus 0.99 raised to the 50th is 0.395',
          ], 3, 'The page waits for the slowest of the fifty, so the chance that none of them is slow is 0.99 to the fiftieth power, leaving about 39.5% of pages over a second.'),
          q('When hedging a request, why send the second copy at the measured p95 rather than immediately?', [
            'Sending both at once would return the slower of the two answers',
            'Waiting until p95 duplicates only 5% of calls, so the extra load stays small',
            'The second replica needs the delay to warm its cache before answering',
            'Client libraries cannot open two connections to one host at the same time',
          ], 1, 'Delaying the hedge to the p95 means only the slowest twentieth of calls are ever duplicated, which buys most of the tail reduction for roughly 5% extra load.'),
          q('Three replicas report p99 latencies of 400ms, 420ms and 2100ms for the same endpoint. What is the p99 for the service?', [
            '973ms, which is the arithmetic mean of the three reported values',
            '2100ms, since the service is only as fast as its slowest replica',
            'Not computable from those numbers; merge the replica histograms instead',
            '1260ms, weighting each replica by its share of the total traffic',
          ], 2, 'Percentiles are not additive or averageable, so the only correct route is to sum the underlying histogram buckets and take the quantile from the combined distribution.'),
        ]
      ),
      ],
      [
      q('A queue sitting at 80% utilisation is pushed to 90%. What happens to the mean wait a request experiences?', [
        'It roughly doubles, going from about 5x the service time to about 10x',
        'It rises about 12%, in direct proportion to the extra load applied',
        'It stays flat until utilisation passes 95%, then climbs very steeply',
        'It falls slightly, because batching improves at higher occupancy',
      ], 0, 'The 1/(1 - utilisation) relationship means the multiplier on service time moves from 5 to 10 across that ten point change, which is why the last slice of headroom is the expensive one.'),
      q('A service holds a 900ms p99 while its CPU flame graph is almost empty. What is the most likely explanation?', [
        'The profiler sampled at too low a frequency to catch any of the work',
        'Source maps were missing, so the hot frames were silently dropped',
        'A heap snapshot overwrote the profile before it was written to disk',
        'The time is off CPU: waiting on I/O, a lock, or a blocked event loop',
      ], 3, 'Sampling profilers record only threads that are running, so latency spent waiting produces no samples at all and has to be found with traces or event loop delay.'),
      q('A team adds one index for every slow query and now runs 14 indexes on the orders table. What cost did they not plan for?', [
        'Reads slow down, because the planner must evaluate every index each time',
        'Every insert and update maintains 14 B-trees, so write latency climbs',
        'The visibility map is disabled, so index only scans stop working entirely',
        'Statistics go stale faster, so the planner stops choosing any index at all',
      ], 1, 'Each index is a separate structure that must be kept current on write, so indexes bought for read speed are paid for on every insert, update, and delete.'),
      q('Four services in a chain each apply their own fixed 2 second timeout. What goes wrong?', [
        'The first hop cancels the chain before the last one has even started',
        'Each hop retries the previous one, multiplying total load fourfold',
        'The chain can spend 8 seconds on a request the browser abandoned at 3',
        'The deadline header gets stripped, so hops fall back to no timeout',
      ], 2, 'Per hop timeouts add up instead of shrinking, so an absolute deadline passed down the chain is what keeps the total bounded and stops work continuing for a client that has gone.'),
      ]
    ),
    chapter(
      'Multi-Region Architecture and Live Migration',
      'Designing for failure domains bigger than one region, and moving a running production system onto new infrastructure without dropping a request.',
      [
      lesson('Failure Domains, Cells, and Static Stability', 14, `
On 13 December the control plane in us-east-1 stopped answering for four hours. Instances that were already running kept running. Nobody could launch a new one, retarget a load balancer, or read a parameter out of the config store. A lot of teams discovered that afternoon that their failover plan required the region they were failing away from.

### Name the failure domains before you design against them

A failure domain is a set of components that break together. Draw yours honestly.

| Domain | What is shared | Blast radius |
|---|---|---|
| Process | one container | one Pod, seconds |
| Node | kernel, disk, hypervisor | the Pods on it |
| Availability zone | power, cooling, one campus | a third of capacity |
| Region | regional control plane, regional services | everything you run there |
| Account | quotas, IAM, billing | every environment inside it |
| Global | DNS, identity, your pipeline, a config push | all regions at once |

That last row is the one that gets people. Multi-region buys you nothing against a bad feature flag or a broken IAM policy that every region accepts within ninety seconds of each other. Regional isolation only helps when the change itself is rolled region by region, with a soak in between.

### Static stability

A statically stable system keeps serving in its current state without needing a control plane to do anything for it. That is the property that survived the four hour outage.

Compare two failover plans for the same service. The dynamic plan says: when Virginia fails, the autoscaler grows Frankfurt from 12 tasks to 24. That plan depends on the scaling API answering, on spare capacity existing in that instance family at the exact moment a very large correlated failure just created demand for it, on the registry serving image pulls, and on a warm-up nobody has timed. The static plan says: Frankfurt already runs 24 tasks, all the time, and failover changes only where traffic goes.

Static stability costs money, and the arithmetic decides how much.

| Regions | Steady utilisation | After losing one | Verdict |
|---|---|---|---|
| 2 | 50% | 100% | works, roughly double the bill |
| 2 | 70% | 140% | brownout, then cascade |
| 3 | 60% | 90% | works, about 1.5x |
| 4 | 70% | 93% | works, about 1.4x |

More regions make headroom cheaper, which is the counter-intuitive part. Two regions is the most expensive way to be resilient.

### Cells shrink the blast radius inside a region

A region is still one failure domain for your own bugs. A cell is a complete, independent copy of the stack, its own database, cache and queue, serving a fixed slice of tenants. Sixteen cells means a poisoned cache entry, a runaway migration or a bad shard of data hurts 6% of customers rather than everyone, and deploys roll cell by cell with a real soak.

\`\`\`js
// Cell count is fixed at 16. Changing it reshards every tenant, so decide once.
const CELLS = 16;
function cellFor(tenantId) {
  const h = createHash('sha256').update(tenantId).digest().readUInt32BE(0);
  return \`cell-\${String(h % CELLS).padStart(2, '0')}\`;
}
\`\`\`

The mistake is putting the tenant to cell mapping in a global lookup service. You have just invented a new global failure domain and routed every request through it. Bake the mapping into the edge config as static data, or compute it with a pure hash like the one above, so routing keeps working when nothing else answers.

Every design here answers to one test. If the control plane in the failed region never answers again, and no new capacity can be provisioned anywhere, does the plan still work? If the honest answer is no, the plan is a hope.
      `,
        [
          q('Two regions each normally run at 70% of their capacity. One region is lost. What does the surviving region face?', [
            'It absorbs the load, because 70% leaves 30% of headroom in reserve',
            'It scales automatically, so utilisation settles back near 70% within a minute',
            'It needs about 140% of its capacity, so it browns out and then cascades',
            'It sheds exactly half the traffic and serves the rest at normal latency',
          ], 2, 'Failing over doubles the surviving region\'s traffic, and two regions at 70% each means the survivor is asked for 140% of what it can serve.'),
          q('A failover plan says the autoscaler will grow the surviving region from 12 tasks to 24. Why is that considered statically unstable?', [
            'Recovery depends on the scaling API, spare capacity and image pulls at the worst possible moment',
            'Autoscalers cannot change desired count while a health check is failing anywhere',
            'Doubling task count always exceeds the connection pool limit on the database',
            'Scaling events are billed at a premium rate during a regional incident',
          ], 0, 'Static stability means surviving without asking a control plane to do anything, and a plan that provisions capacity during a large correlated failure depends on the systems most likely to be busy or broken.'),
          q('A team splits into 16 cells but stores the tenant to cell mapping in one global lookup service. What has that done to the design?', [
            'Nothing important, since the lookup result can be cached at the edge for an hour',
            'It reduces blast radius further, because routing is now centrally observable',
            'It makes rebalancing tenants harder but leaves availability unchanged',
            'It creates a new global failure domain that every request must pass through',
          ], 3, 'Cells only limit blast radius if routing survives, so a mapping that requires a global service to answer puts every cell behind a single point of failure.'),
        ]
      ),
      lesson('Replicating Data Across Regions', 14, `
Frankfurt to northern Virginia is about 6,400 km of cable. Light in fibre moves at roughly 200,000 km per second, the route is not a straight line, and real measurements land near 90ms for the round trip. Turn on synchronous cross-region replication and every single write pays that. A checkout that performs four writes goes from 8ms to about 368ms, and no amount of tuning will fix it, because the limit is geography.

### Pick your replication mode by the number you can defend

| Mode | Added write latency | Data lost if the region dies | Use for |
|---|---|---|---|
| Sync, same zone | under 1ms | none | the default |
| Sync, across zones in a region | 1 to 3ms | none | any real production database |
| Sync, across regions | 80 to 150ms | none | ledgers, only if latency is acceptable |
| Async, across regions | none | whatever had not shipped | almost everything else |

Async is the normal answer, and it means you own an RPO. That RPO is not a policy, it is your replication lag, measured.

### Measure lag with a heartbeat, not with the obvious query

\`\`\`sql
-- The tempting one, and it lies on a quiet system
SELECT extract(epoch FROM now() - pg_last_xact_replay_timestamp()) AS lag_seconds;
\`\`\`

On an idle primary that number climbs steadily even though the replica is perfectly caught up, because there are no new transactions to replay and the timestamp of the last one keeps getting older. At 3am your lag alert fires on a database doing nothing. Write a heartbeat instead and measure staleness:

\`\`\`sql
-- primary, once per second
UPDATE replication_heartbeat SET beat_at = now() WHERE id = 1;
-- any replica, alert above 30 seconds
SELECT extract(epoch FROM now() - beat_at) AS staleness FROM replication_heartbeat;
\`\`\`

### Read your writes, or explain yourself to support

A customer in Singapore updates a shipping address. The write goes to the primary in Virginia. The confirmation page reads from the Singapore replica 400ms later, before replication has arrived, and shows the old address. They edit it again. Now there are two support tickets and one very confused person.

Two fixes, both cheap. Pin the session to the primary for a few seconds after any write, or capture the write position and only use a replica that has caught up to it:

\`\`\`js
const { rows } = await primary.query('SELECT pg_current_wal_lsn() AS lsn');
res.cookie('rw_lsn', rows[0].lsn, { maxAge: 10_000, httpOnly: true });
// On a later read: if the cookie is present and the replica has not replayed
// that LSN yet, send the query to the primary instead.
\`\`\`

### Two writers means conflicts, and last write wins loses data

Active-active sounds like the grown up option until two regions accept a write to the same order within the same 50ms. Last write wins resolves that by comparing clocks that disagree, then discarding one version silently. Nobody gets an error. A field simply reverts, days later, in a way no log explains.

The boring correct answer is single writer per key. Give every row a home region: European tenants write in Frankfurt, American tenants write in Virginia, both read locally everywhere. Where you genuinely need concurrent writes, use structures where merging is defined, counters and sets and CRDT documents, or a database that runs consensus for you such as Spanner, CockroachDB or DynamoDB global tables.

### The stores people forget

Cross-region bucket replication is async too, typically seconds but with an SLA measured in minutes. After a failover an invoice row can exist while its PDF returns 404, so readers must tolerate that. Your secret manager, container registry and Terraform state from Chapter 4 also need a copy in the second region, otherwise the surviving region can serve traffic but cannot deploy a fix.

Write the RPO on the runbook as a number, then prove it during a game day by killing replication and reading the heartbeat.
      `,
        [
          q('Why is synchronous replication between Frankfurt and Virginia rarely used for a checkout flow?', [
            'Synchronous replicas cannot serve reads, so half the fleet sits idle',
            'Every write waits for a round trip of roughly 90ms, which geography sets and tuning cannot fix',
            'Postgres refuses synchronous standbys outside the primary\'s own region',
            'Conflicts become likely once the two copies are far enough apart',
          ], 1, 'The round trip between those regions is about 90ms, so each synchronous write pays it and a four write checkout becomes hundreds of milliseconds slower.'),
          q('A customer updates their address, the confirmation page reads from a local replica, and the old value comes back. Which fix addresses the cause?', [
            'Increase the replica\'s shared buffers so recent rows stay in memory',
            'Turn on synchronous commit for the whole cluster to remove the lag',
            'Cache the confirmation page per user so the stale read is never repeated',
            'Record the write position and use the primary until the replica has replayed it',
          ], 3, 'The read arrived before replication did, so the fix is to make the read wait for, or bypass, a replica that has not yet caught up to that write.'),
          q('Your lag alert on pg_last_xact_replay_timestamp fires at 3am on a healthy cluster. What is happening?', [
            'The primary is idle, so the last replayed transaction keeps ageing and the query measures quiet, not lag',
            'The replica reconnected overnight and restarted its replay from an older restart point',
            'Autovacuum holds the replay slot during its nightly run, which stalls apply',
            'The clocks on the two hosts drift apart most during low traffic periods',
          ], 0, 'With no new transactions to replay, the timestamp of the last one simply gets older, so the query reports growing lag on a replica that is perfectly caught up, which is why a heartbeat row is the right signal.'),
        ]
      ),
      lesson('Traffic Steering and Regional Failover', 13, `
The record had a 60 second TTL and the runbook promised failover in about a minute. Thirty minutes after the flip, 11% of requests were still arriving at the dead region. Nothing was misconfigured. DNS simply does not do what the TTL implies: recursive resolvers apply their own floors, some corporate resolvers cap TTLs at 30 minutes, older JVMs cache resolved addresses for the life of the process, and every client with an open HTTP connection pool keeps using sockets it already has and never re-resolves at all.

### Four ways to steer, with honest numbers

| Mechanism | Real failover time | Granularity | The catch |
|---|---|---|---|
| DNS with health checks | 1 to 30 minutes | per hostname | clients cache, pools never re-resolve |
| Anycast BGP | seconds | per IP prefix | a flow can move mid connection |
| Global edge load balancer | under a second | per request | the edge becomes a global dependency |
| Client SDK with a region list | immediate | per call | you must control every client |

DNS is where most teams start and it is fine as the outer layer, as long as the runbook says tens of minutes rather than one. If you need seconds, the decision has to be made somewhere that sees every request.

### Health checks that lie in both directions

A shallow check that returns 200 unconditionally passes happily while every real request returns 500. So people write deep checks that query the database, and then invent a worse problem: if that dependency is global, every region fails its check at the same instant, the steering layer marks all targets unhealthy, and it has nowhere left to send traffic. Good implementations fail open and send traffic everywhere when nothing is healthy. Confirm yours does before you rely on it.

The arrangement that works is three checks with three jobs. Keep the shallow liveness probe from Chapter 6 for the orchestrator. Give the load balancer a readiness check that touches only region local dependencies. Then drive failover decisions from synthetic probes that run a real transaction from several outside locations.

\`\`\`hcl
resource "aws_route53_health_check" "checkout_frankfurt" {
  fqdn              = "eu.acme.dev"
  type              = "HTTPS"
  resource_path     = "/ready"
  request_interval  = 10  # seconds
  failure_threshold = 3   # 30s to declare down, before any DNS caching
  regions           = ["us-east-1", "eu-west-1", "ap-northeast-1"]
}
\`\`\`

Several checkers voting matters. One checker sitting behind a congested transit link will fail you out of a healthy region on its own.

### Automatic or human, and the floor either way

Automatic failover has a false positive rate, and a false positive moves 100% of traffic into a region sized for 50%. The automation then causes the outage it existed to prevent. For most teams the right shape is automated detection, an automated runbook, and one command a human runs, rehearsed monthly as a game day.

If you do automate the trigger, give it two floors: never fail out the last healthy region, and never move traffic twice within an hour. Without flap damping a marginal link will oscillate your entire user base between continents.

### Drain out, ramp back in

Cutting traffic is not one step. Mark the region unready, stop new arrivals, then let in flight work finish for 30 to 60 seconds before anything is torn down. Long lived connections need explicit handling: a websocket or SSE stream will happily sit on a doomed region until you close it and let the client reconnect.

Coming back is where people get hurt twice. A region that has been dark for four hours has cold caches, empty connection pools, unwarmed JIT and a stale local replica still catching up. Send it 50% of peak and it falls over, which reads as a second incident. Ramp: 1%, then 10%, then 50%, watching p99 and error rate at each step, and hold at each level long enough for the caches to fill.
      `,
        [
          q('You publish a 60 second TTL, fail over, and 11% of traffic still reaches the dead region half an hour later. Why?', [
            'The health check has not yet reached its failure threshold in every checker region',
            'Negative caching keeps the old answer alive until the record\'s SOA minimum expires',
            'Resolvers apply their own floors, some runtimes cache addresses for process life, and open connection pools never re-resolve',
            'Weighted records drain gradually by design, shifting a fixed percentage per interval',
          ], 2, 'TTL is a hint that resolvers and client runtimes routinely ignore, and clients holding established connections do not perform a lookup at all, so DNS failover takes tens of minutes in practice.'),
          q('A readiness check queries a globally shared dependency, and that dependency goes down. What does the steering layer do?', [
            'It routes everything to the region with the lowest observed latency',
            'It marks every region unhealthy at once and has no healthy target left to choose',
            'It holds the last known good routing until an operator intervenes manually',
            'It fails the check only in the region that owns the dependency\'s primary',
          ], 1, 'A check that depends on something global fails everywhere simultaneously, which is why the check should touch only region local dependencies and the steering layer should fail open when nothing is healthy.'),
          q('A region has been dark for four hours. You bring it back at 50% of peak traffic immediately. What is the likely result?', [
            'It performs better than usual, because its caches were cleared of stale entries',
            'Traffic rebalances smoothly, since the load balancer weights new targets gradually',
            'Latency is unchanged, because capacity was pre-provisioned for a full failover',
            'Cold caches, empty pools and a lagging replica make it fail again as a second incident',
          ], 3, 'A recovered region has none of the warm state it had before, so it must be ramped through 1%, 10% and 50% while p99 and error rate are watched at each step.'),
        ]
      ),
      lesson('Migrating a Live System Without Downtime', 14, `
The plan said 2am Sunday, a 90 minute window, move the 400GB orders database from a self managed box in Virginia onto a managed instance in Frankfurt. The restore took 70 minutes. The service then refused to start because one connection string in the secret store still pointed at the old host. At 04:40 the call was made to roll back, and rolling back meant discarding the 900 orders the new database had already accepted. Nobody had built a way home.

Windows are the problem, not the solution. Migrate live instead, in steps you can reverse.

### Expand, migrate, contract

1. Expand so both old and new are acceptable at once. No destructive change to schema, config or contract.
2. Migrate the bulk continuously while traffic keeps flowing.
3. Verify by comparing, not by hoping.
4. Move reads by percentage.
5. Move writes with a freeze measured in seconds.
6. Contract only after a long soak.

### Continuous replication is what buys the short freeze

Copy the 400GB while the system is live, then keep it current. The cutover stops being a copy and becomes a wait.

\`\`\`bash
# Frankfurt subscribes to the live Virginia primary; the initial copy runs under traffic
psql "$NEW_URL" -c "CREATE SUBSCRIPTION orders_sub
  CONNECTION 'host=old.acme.internal dbname=orders'
  PUBLICATION orders_pub WITH (copy_data = true);"

# Cutover gate: refuse to proceed until this is under one second
psql "$NEW_URL" -c "SELECT now() - max(beat_at) AS staleness FROM replication_heartbeat;"
\`\`\`

Now the trap that catches almost everyone once. Logical replication copies rows. It does not copy sequences, and it does not replicate DDL. You cut over, the first insert asks the sequence for an id, it answers 1, and you get duplicate key violations on a table holding three million rows. Fix it inside the freeze, before writes are accepted:

\`\`\`sql
SELECT setval('orders_id_seq', (SELECT max(id) FROM orders));
\`\`\`

### Dual write is a trap

Writing to both systems from the application looks obvious and is not atomic. The process dies between the two writes, or the second times out after the first committed, and the stores diverge with nothing recording that they did. The gap grows quietly for a week. Prefer one write plus replication, so ordering and durability stay the database's problem. If you truly must dual write, commit an outbox row in the same transaction as the primary write and let a worker drain it.

### Verify with shadow reads

\`\`\`js
const legacyResult = await legacy.getOrder(id);
queueMicrotask(async () => {              // never on the request path
  if (Math.random() > 0.01) return;       // sample 1%
  const migrated = await newStore.getOrder(id);
  if (!deepEqual(strip(legacyResult), strip(migrated))) {
    log.warn({ id, legacyResult, migrated }, 'shadow mismatch');
  }
});
return legacyResult;
\`\`\`

Serve the old answer, compare in the background, alert on the mismatch rate. Back that with a checksum sweep over id ranges, because sampling finds systematic errors and misses rare ones.

### Build the way home first

The instant the new store takes writes, the old one is stale, and rollback loses those writes unless replication now runs the other way. Configure new to old replication before the cut, not after.

| Step | Duration | Reversible |
|---|---|---|
| Backfill and CDC running | 3 days | yes |
| Shadow reads at 1% | 2 days | yes |
| Reads at 10%, then 100% | 3 days | yes, instantly |
| Freeze, setval, promote | about 6 seconds | yes, reverse replication |
| Decommission the old store | after 14 days | no |

Exactly one step is irreversible, and it happens a fortnight later on a Tuesday afternoon when nobody is nervous.
      `,
        [
          q('Why is application level dual write a poor way to keep an old and a new datastore in step?', [
            'The two writes are not one transaction, so a crash between them diverges the stores silently',
            'It doubles write latency, which pushes the checkout flow past its latency target',
            'Most ORMs cannot hold two connection pools open inside a single request',
            'The new store rejects writes until its initial bulk copy has finished',
          ], 0, 'Two separate writes have no shared atomicity, so a failure between them leaves the stores disagreeing with nothing recording it, and the divergence grows unnoticed.'),
          q('You cut over with logical replication, and the first inserts fail with duplicate key errors. What was missed?', [
            'The publication was created without copy_data, so older rows never arrived',
            'The subscription was still applying changes when writes were accepted',
            'Sequences are not replicated, so the id sequence restarted from 1',
            'The new instance uses a different collation, which reordered the primary key',
          ], 2, 'Logical replication copies row data but not sequence state or DDL, so setval must be run against the sequence inside the freeze before the new store accepts writes.'),
          q('Which step makes a rollback possible after the new store has already accepted writes?', [
            'Keeping the old store running read only for two weeks after the cut',
            'Configuring replication from new back to old before the cutover happens',
            'Taking a snapshot of the old store immediately before the write freeze',
            'Holding reads at 10% until the mismatch rate has been zero for a day',
          ], 1, 'Once the new store takes writes the old one is stale, so the only way back without losing those writes is reverse replication that was already running before the cut.'),
        ]
      ),
      ],
      [
      q('A service runs in two regions, but its deploy pipeline, secret store and DNS control all live in region A. What is true of this design?', [
        'It is acceptable, because those systems are needed for changes rather than for serving',
        'It is fine as long as region B holds a nightly copy of the secrets and the pipeline config',
        'It halves availability, since two regions now share one control plane',
        'Losing region A removes the ability to execute the failover away from region A',
      ], 3, 'A failover path that depends on the region being failed away from is not a failover path, so control plane dependencies must exist in every region you plan to survive on.'),
      q('Cross-region replication runs asynchronously with a measured lag of about 3 seconds. A region is lost abruptly. What is the data outcome?', [
        'Up to a few seconds of committed writes never left the failed region and are gone',
        'Nothing is lost, because commits are acknowledged only after the remote apply',
        'Nothing is lost, but the replica must replay a backlog before accepting traffic',
        'Whole transactions survive while partial ones roll back, so no write is lost',
      ], 0, 'Asynchronous replication acknowledges the client before shipping the change, so measured lag is the recovery point objective and anything still in flight when the region died is unrecoverable.'),
      q('Why do many mature teams automate failover detection but keep a human on the trigger?', [
        'Providers only support manual promotion of a cross-region standby',
        'A false positive would move all traffic into a region that cannot serve it',
        'Automated failover cannot drain long lived connections before cutting traffic',
        'Compliance rules generally require an approval before any production change',
      ], 1, 'Detection has a false positive rate, and acting on a wrong signal shifts full load onto capacity sized for a fraction of it, so the automation causes the outage it was meant to prevent.'),
      q('A live database migration keeps its write freeze to about 6 seconds. What makes that possible?', [
        'The migration runs during the lowest traffic hour, so few writes are blocked',
        'Reads were already served from the new store, so only writes need to pause',
        'Continuous replication moved the bulk beforehand, leaving only a wait for lag to reach zero',
        'The old store is placed in read only mode, which speeds up the final export',
      ], 2, 'The freeze is short only because the 400GB was copied and kept current under live traffic, so the cutover waits for lag rather than performing a restore.'),
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
      q('An internal admin tool serving about 20 requests a minute has its availability target raised from 99.9% to 99.99% to show that the team takes reliability seriously. What follows from that decision?', [
      'The burn-rate alert needs only a longer long window, since four nines just moves the ratio threshold',
      'Detection gets sharper, because a tighter target lets the same short window resolve smaller regressions',
      'The target is finer than the traffic can measure, so one retryable failure pages a rotation that cannot act',
      'Nothing operational changes until the error budget policy is renegotiated with product in a quiet week',
    ], 2, 'Four nines is about 4.3 minutes a month and only around 100 requests land in a five minute window, so a single failed request reads as a 10x burn rate; the alert is measuring noise, and every page it produces spends the rotation\'s page budget while giving nobody anything to fix.'),
    q('A canary takes 5% of traffic and its analysis query filters only on job="api", with no rollouts_pod_template_hash label. A build that errors on 20% of the requests it serves passes every check. Why?', [
      'The query measures both versions at once, so nineteen parts of clean stable traffic dilute the canary failures',
      'The failureLimit of 2 tolerates two consecutive scrapes above the success condition before it aborts',
      'The canary served too few requests for the interval and count settings to finish ten measurements',
      'The baseline Pod running the old image absorbs the errors, since both report under the same job label',
    ], 0, 'The pod template hash label is what scopes the ratio to the new version; without it the stable version\'s healthy requests sit in the same numerator and denominator, so a 20% canary error rate averages down to roughly 1% overall and the threshold is never crossed no matter how broken the build is.'),
    q('A production stack calls a shared module with a git source and no ref argument, on a pipeline that runs terraform init from a clean checkout. A colleague merges an unrelated change into that module repo\'s main branch. What happens next?', [
      'Nothing until somebody bumps the version, because the state file records the module source it applied',
      'terraform init fails with a checksum mismatch against the dependency lock file until it is upgraded',
      'The next plan is unaffected, since the dependency lock file pins module sources as well as providers',
      'The next plan can propose changes to files nobody edited, since the source resolves to whatever main is now',
    ], 3, 'An unpinned git source is re-resolved every time init runs, and the dependency lock file pins provider versions only, so a merge in a repository the consuming team does not watch turns into a production diff that no reviewer in that repository asked for.'),
    q('A search backend sits at about 92% utilisation and its p99 is the tail everyone complains about. Someone proposes hedging each call at the measured p95 to collapse that tail. What is the likely result?', [
      'The tail collapses, because the duplicate lands on a different replica that is not garbage collecting',
      'It adds about 5% more load to a queue already priced at a 12x wait multiplier, so the tail gets worse',
      'Nothing measurable, since the hedged copy is aborted the moment the first response wins the race',
      'Latency improves but correctness suffers, because a hedged call is not idempotent by default',
    ], 1, 'Hedging buys a shorter tail by spending spare capacity, and at 92% utilisation there is none left: the extra copies join the same queue whose wait already multiplies service time roughly twelvefold, so the remedy feeds the saturation that produced the tail in the first place.'),
    q('A platform runs 16 cells spread across three regions, and a feature flag flipped at 14:00 takes every cell down inside ninety seconds. What does that outage reveal about the design?', [
      'Cells isolate data but never code, so any rollout mechanism reaches all of them simultaneously',
      'The cell count is too low, so each poisoned cell still holds too large a share of the tenants',
      'The flag delivery path is a global failure domain, and cells only help when a change rolls cell by cell',
      'The tenant hash needs a version component so that a bad flag reshards traffic onto healthy cells',
    ], 2, 'Cells bound the damage from data, load and deploys that arrive one cell at a time, but anything pushed everywhere at once, such as a flag, an IAM policy or a DNS change, is its own domain spanning every cell, so flag rollouts have to be staged with a soak exactly the way deploys are.'),
    q('Across sixty services, a page for a failing service takes about twenty-five minutes to reach a team that can act on it. Which change addresses the cause rather than the symptom?', [
      'Add a manager tier to every escalation policy so an unacknowledged page reaches someone with authority',
      'Have the service scaffold emit a catalog entry naming owner, tier and rota, so routing becomes a lookup',
      'Raise the severity of ambiguous alerts so that more of the organisation wakes and someone recognises it',
      'Cut the primary acknowledgement window from five minutes to two so that escalation begins much sooner',
    ], 1, 'Escalation tiers and shorter acknowledgement timers only move a page faster once it is already on the correct rotation, whereas those twenty-five minutes are ownership archaeology, and a catalog entry generated by the golden path is what lets the paging system resolve owner and rota itself.'),
    q('A company creates a new "DevOps team" whose job is to take finished code from developers and handle every deployment for them. Why does this miss what DevOps means?', [
      'It adds one more handoff between a change and production instead of shortening that path',
      'DevOps requires every developer to hold full administrator rights on production servers',
      'A separate team cannot use the same pipeline tooling that the developers use day to day',
      'DevOps rules out specialist roles, so operations staff must all be retrained as developers',
    ], 0, 'DevOps is a set of practices for shortening the distance from a change existing to it running safely for users, so inserting a new team between developers and operations adds a handoff rather than removing one.'),
    q('A config file has mode 640, owner `deploy` and group `app`. A service running as user `web`, which is a member of group `app`, reads the file and later tries to write to it. What happens?', [
      'Both the read and the write succeed, because group membership grants both',
      'The read succeeds and the write fails with a permission denied error',
      'Both fail, because only the owner can access a file with mode 640',
      'The read fails and the write succeeds, because group bits govern writes',
    ], 1, 'In 640 the owner has read and write (6), the group has read only (4) and everyone else has nothing (0), so a group member can read the file but not write it.'),
    q('`curl https://orders.internal/healthz` fails straight away with `Could not resolve host`. What does that tell you?', [
      'The service is running, but nothing is listening on port 443',
      'A firewall dropped the packets before they reached the host',
      'The name did not resolve, so no connection was even attempted',
      'The TLS certificate does not match the hostname requested',
    ], 2, 'Name resolution is the first connectivity question; if the name does not resolve, curl never gets an address to connect to, so ports, firewalls and TLS have not been tested yet.'),
    q('An app container writes uploaded files to `/app/uploads`, with no volume or bind mount. The container is removed and a new one is started from the same image. What does the new container find in `/app/uploads`?', [
      'All of the earlier uploads, because Docker commits changes back into the image',
      'The uploads from the last clean shutdown, which Docker snapshots automatically',
      'A read-only copy of the old files that must be remounted before writing',
      'Only what the image shipped with, since the uploads died with the old container',
    ], 3, 'A container\'s writes go to its own writable layer, which is deleted along with the container, so anything that must outlive it belongs in a volume or in object storage.'),
    q('An API image is 1.2GB because it still contains compilers, devDependencies and a build cache that were needed only while building. Which change fixes this at the source?', [
      'A multi-stage build that copies only the runtime files into a slim final stage',
      'A final RUN step that deletes the build tools after everything else has run',
      'Compressing the image with docker save before pushing it to the registry',
      'Switching the base image from a pinned version tag to the latest tag',
    ], 0, 'In a multi-stage build the build tools live in an earlier stage and never reach the final image, whereas deleting files in a later RUN leaves their bytes in the earlier layer.'),
    q('Production runs the image `api:latest`. A release goes bad, and the rollback runbook simply redeploys `api:latest`. Why does the rollback change nothing?', [
      'The registry locks an overwritten tag for an hour before serving it',
      'The tag now points at the bad build, so the rollback runs the same image',
      'Registries cache the latest tag for a day before serving a newer digest',
      'Rollbacks only work for images built with the exec form of CMD',
    ], 1, 'A tag is a mutable pointer, so after the bad release `latest` names the bad bytes; deploying immutable commit-SHA tags or digests is what keeps the previous version addressable.'),
    q('A GitHub Actions workflow defines jobs `test` and `deploy`, and `deploy` has no `needs` key. A commit with a failing test is pushed. What happens?', [
      'deploy waits for test automatically, because it appears later in the file',
      'GitHub skips deploy, because any failed job cancels the whole workflow',
      'Both jobs start in parallel, so deploy can succeed while test fails',
      'deploy runs only after test has finished, but it ignores the result',
    ], 2, 'Jobs run in parallel by default and only `needs` creates an ordering between them, so without `needs: test` the deploy job never waits for the tests.'),
    q('Workflows triggered by `pull_request` from forks get no secrets, so someone switches the trigger to `pull_request_target` and checks out the fork\'s code to run its tests. What have they done?', [
      'Fixed it safely, since pull_request_target runs jobs in a read-only sandbox',
      'Broken the workflow, since pull_request_target cannot check out fork code',
      'Nothing risky, since GitHub masks every secret value in the job logs',
      'Let any outside contributor run their own code with the repository\'s secrets',
    ], 3, 'pull_request_target runs with the base repository\'s secrets, so executing a fork\'s code under it hands that untrusted code the secret store.'),
    q('Under trunk-based development, how does code for a half-built feature reach main every day or two without being released to users?', [
      'It is merged in small pieces behind a feature flag that stays switched off',
      'It stays on a long-lived branch that is rebased onto main every morning',
      'It is committed to main but excluded from the build by a path filter',
      'It collects on a release branch that is merged once the feature is done',
    ], 0, 'Short-lived branches merge even unfinished work, and the feature flag is what lets that code be integrated without being released.'),
    q('Instances in a private subnet must download OS packages from the internet, yet nothing on the internet may open a connection to them. What provides this?', [
      'A default route from the private subnet directly to the internet gateway',
      'A default route to a NAT gateway that sits in a public subnet',
      'A security group rule that allows inbound 0.0.0.0/0 on port 443',
      'A peering connection to a subnet in another VPC in the same region',
    ], 1, 'A private subnet sends 0.0.0.0/0 to a NAT gateway in a public subnet, which lets instances open outbound connections while nothing outside can initiate one to them.'),
    q('In a small account, the largest bill line is NAT gateway data processing, and most of that traffic is private instances reading from object storage. What is the most effective fix?', [
      'Move the instances to a larger type with more network bandwidth',
      'Add a second NAT gateway so the traffic is spread across both',
      'Add a VPC endpoint for object storage so that traffic skips the NAT',
      'Turn on bucket versioning so fewer objects need to be downloaded',
    ], 2, 'NAT gateways charge per gigabyte processed, and a VPC endpoint keeps object storage traffic inside the provider network so it never passes through the NAT at all.'),
    q('Which rollout strategy keeps the previous version fully running so that rollback is a traffic flip taking seconds, but exposes every user to the new version at once?', [
      'Canary',
      'Rolling update',
      'Recreate',
      'Blue/green',
    ], 3, 'Blue/green runs both versions and flips all traffic at once, so rollback is flipping back, whereas a canary limits exposure to a small share and a rolling update replaces the old instances.'),
    q('Services A and B both emit spans, but each request that A forwards to B shows up as two unrelated traces. What is the most likely cause?', [
      'The trace context is not carried from A to B in the traceparent header',
      'B uses a different head sampling rate from the one A uses for its spans',
      'The two services write their log lines to different stdout streams',
      'B has no Prometheus metric label recording the incoming trace ID',
    ], 0, 'Spans join one trace only when the caller passes the trace context, via the W3C traceparent header, and the receiver continues it; without that, B starts a fresh trace.'),
    q('Tracing keeps 1% of requests, decided at the start of each trace, and the rare slow checkout requests you need to study are almost never kept. What fixes that?', [
      'Raising the head sampling rate to 2% so twice as many are captured',
      'Tail sampling, which decides at the end and keeps every slow or failed trace',
      'Adding request duration as a label on the checkout latency metric',
      'Logging each full request body so slow ones can be rebuilt later',
    ], 1, 'Tail sampling buffers the whole trace and decides once it is complete, so it can keep all errors and slow requests alongside a small share of normal ones.'),
    q('A new Pod stays Pending with `Insufficient cpu`, yet monitoring shows every node using only about 20% of its CPU. Why?', [
      'The CPU limit is set below the request, so no node can satisfy it',
      'Monitoring averages over a minute and hides spikes close to 100%',
      'The scheduler counts CPU requests already reserved, not actual usage',
      'The liveness probe fails before the scheduler can place the Pod',
    ], 2, 'Requests are a scheduling contract: a Pod is placed only on a node with that much unreserved capacity, so nodes full of generous requests turn new Pods away however idle they are.'),
    q('A Deployment uses `maxSurge: 1` and `maxUnavailable: 0`. The new version has a bug that makes its readiness probe fail forever. What do users experience?', [
      'An outage, because an old Pod is removed before each new Pod starts',
      'Errors on a share of requests while the broken Pod receives traffic',
      'A short outage while Kubernetes rolls the Deployment back by itself',
      'No change, because the rollout stalls and the old Pods keep serving',
    ], 3, 'With maxUnavailable at 0 an old Pod is removed only after a new one is Ready, and a Pod that never passes readiness never receives Service traffic, so the rollout simply stops.'),
    q('A team adds an annotation holding a hash of a ConfigMap\'s contents to the Pod template of the Deployment that consumes it. What does that achieve?', [
      'A changed config gives a new hash, so the template changes and Pods roll',
      'The kubelet uses the hash to reload environment variables in running containers',
      'The API server rejects any ConfigMap edit whose hash no longer matches',
      'The hash encrypts the ConfigMap so that it can safely hold passwords',
    ], 0, 'Pods read environment values only at start, and a changed annotation changes the Pod template, which creates a new ReplicaSet and rolls the Pods with the usual surge and probe behaviour.'),
    q('A load test shows one instance holds its latency target up to about 200 requests per second and degrades sharply beyond that. Peak traffic is 1,000 requests per second. What is wrong with running exactly five instances?', [
      'Five instances cannot share one load balancer without sticky sessions',
      'Each instance would sit at its knee, with no room for a deploy, a failure or growth',
      'Load tests overstate capacity, so the real knee is always half the measured one',
      'Databases always hit their connection limit at five application instances',
    ], 1, 'Five times 200 is exactly peak, so every instance runs where latency climbs and one lost instance or rollout surge pushes the rest past it; capacity needs headroom below the knee.'),
    q('A payments client calls `POST /charges`. Sometimes the charge succeeds but the response is lost to a timeout, and the client retries with backoff. What must be in place so the customer is never charged twice?', [
      'Jitter on each retry, so retries from different clients spread apart',
      'A circuit breaker that opens after a few failures and rejects calls',
      'An idempotency key on the request, so a repeat cannot charge again',
      'A request timeout shorter than the first backoff interval',
    ], 2, 'Retrying a non-idempotent POST repeats the charge, so the request needs an idempotency key that lets the server recognise the repeat and return the original result.'),
    q('When right-sizing a service\'s instances, which figure should the size be based on?', [
      'The highest utilisation ever recorded, so the service never runs short',
      'Average utilisation over the last day, since it reflects current traffic',
      'The instance type used in the load test, whatever production shows',
      'p95 utilisation over a fortnight, plus headroom for a surge and a lost zone',
    ], 3, 'Sizing from p95 over a representative period, plus headroom for the rollout surge and one zone failing, avoids paying every hour for a peak that happened once.'),
    q('An error budget policy says a feature freeze begins when less than 25% of the budget remains. Two weeks into the month 15% remains, and a feature launch is planned for Friday. What does the policy call for?', [
      'Hold the launch and make the next sprint reliability work',
      'Launch on schedule, since the budget is not yet exhausted',
      'Raise the SLO target so the remaining budget climbs past 25%',
      'Launch behind a canary, which the policy permits at any level',
    ], 0, 'Below 25% the agreed consequence is a feature freeze with reliability work next, and agreeing that in advance is what turns the decision into arithmetic instead of a negotiation.'),
    q('A postmortem finds that an engineer ran a destructive command against production while believing the terminal was connected to staging. Which action item fits a blameless review?', [
      'Require that engineer to complete extra training before rejoining on-call',
      'Route that kind of change through a reviewed pipeline instead of a shell',
      'Add a runbook line reminding everyone to check which terminal they use',
      'Name the engineer in the report so the whole team learns from the mistake',
    ], 1, 'A blameless review asks how the system allowed the mistake and changes the system, whereas reminders and individual training rely on people being more careful next time.'),
    q('In a GitOps setup, what is the last step of an application\'s build pipeline once the new image has been pushed?', [
      'A kubectl apply run from CI with a cluster-admin credential',
      'A helm upgrade that CI runs directly against the production cluster',
      'A commit to the config repository pointing at the new image digest',
      'A call that tells the reconciler to bypass Git and pull the image',
    ], 2, 'In the pull model CI never touches the cluster; it commits the new digest to the config repository, the reconciler applies whatever Git says, and deploy history becomes git log.'),
    q('Checkout will start sending the `amount` field to the orders service as an object instead of a number. Which sequence avoids breaking orders without a coordinated deploy?', [
      'Deploy both services in the same pipeline run so they update together',
      'Deploy checkout first and let the errors in orders trigger a rollback',
      'Pin both services to one shared image tag so they always match',
      'Deploy orders first so it accepts both shapes, then deploy checkout',
    ], 3, 'Making the consumer tolerant of both the old and new shapes first removes the ordering dependency, so each service can then ship on its own schedule.'),
    q('Why should a CI pipeline assume its cloud role through OIDC federation rather than use long-lived access keys stored as repository secrets?', [
      'Each job gets a short-lived token, so there is no standing key to leak',
      'OIDC tokens are encrypted, while repository secrets are kept in plain text',
      'Long-lived access keys cannot be used from GitHub-hosted runners at all',
      'OIDC lets the role skip its trust policy and its IAM permission checks',
    ], 0, 'Federation exchanges the job\'s identity for a role that is valid only for the length of the job, so no permanent cloud credential sits in the repository to be stolen.'),
    q('A refactor moves `aws_s3_bucket.logs` into a module, so its address becomes `module.logging.aws_s3_bucket.this`. With no `moved` block, what does the next plan propose?', [
      'Nothing, because Terraform matches resources by their cloud ID',
      'Destroying the existing bucket and creating a new one at the new address',
      'Renaming the address in state, since the bucket name is unchanged',
      'An error that halts planning until the old address is imported',
    ], 1, 'Terraform tracks resources by address, so the vanished address is planned for destruction and the new one for creation unless a moved block says they are the same object.'),
    q('A service receives 300 requests per second, and each request holds a database connection for its whole 200ms duration. On average, how many connections are in use?', [
      'About 1,500',
      'About 300',
      'About 60',
      'About 15',
    ], 2, 'Little\'s Law says concurrency equals arrival rate times latency, so 300 per second times 0.2 seconds is 60 connections in use on average.'),
    q('Why is a sampling profiler that captures stacks about a hundred times a second safe to run on a live production service?', [
      'It records every function call but writes the results asynchronously',
      'It runs only while the service is idle, so it never competes for CPU',
      'It profiles a forked copy of the process rather than the live one',
      'Its cost follows the sample rate rather than how much work the code does',
    ], 3, 'A sampling profiler interrupts at a fixed rate and records the stack, so its overhead is set by that rate, unlike instrumentation, which pays on every call.'),
    q('Customers in Europe and America can edit the same records, and the team runs active-active writes in Frankfurt and Virginia with last-writer-wins. What goes wrong, and what is the usual fix?', [
      'Concurrent edits are silently lost; give each record one home region for writes',
      'Every write gets slower; switch the two regions to synchronous replication',
      'Reads return stale data; send every read to the region holding the primary',
      'Nothing goes wrong, because last-writer-wins merges conflicting edits safely',
    ], 0, 'Last-writer-wins resolves conflicts by discarding one version without any error, so the usual answer is a single writer per key, with each row homed in one region.'),
    q('In a live database migration, the bulk copy has finished and continuous replication is keeping the new store current. What should happen before any reads move to it?', [
      'Switch all writes over first, since reads are harmless to move afterwards',
      'Compare data between the two stores to prove they match, rather than assume',
      'Stop replication so the new store holds a stable snapshot for testing',
      'Drop the old database so that replication cannot drift back into it',
    ], 1, 'The migration sequence is copy, keep current, verify by comparing, then move reads by percentage and writes last, so verification comes before any traffic moves.'),
  ],
});
