import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'docker-kubernetes',
  title: 'Docker & Kubernetes',
  category: 'DevOps',
  level: 'Beginner → Intermediate',
  duration: '7 weeks',
  accent: 'sky',
  coverKey: 'docker-kubernetes',
  summary:
    'Go from your first container to running real applications on Kubernetes: Dockerfiles, Compose, pods, deployments, services, ingress, config, storage, autoscaling, Helm, security and troubleshooting, with CKAD exam preparation.',
  description:
    'You start with why containers changed deployment and run your first containers, then write Dockerfiles, build small and secure images, and manage data, networks and multi-container apps with Docker Compose. You then move to Kubernetes: its architecture, a local cluster with kind or minikube, and kubectl. You run workloads with pods, deployments, jobs and cronjobs, expose them with services, ingress and the Gateway API, and configure them with ConfigMaps, Secrets and persistent storage. You add probes, resource limits and autoscaling, package apps with Helm and Kustomize, deliver them through CI/CD, secure them with RBAC and security contexts, and troubleshoot like a professional. The course ends with managed Kubernetes, a complete deployment and preparation for the CKAD exam.',
  chapters: [
    chapter(
      'Containers From First Principles',
      'Understand why containers transformed software deployment, how they differ from virtual machines, install Docker and run your first containers, and learn how images, layers and registries fit together.',
      [
      lesson('Why Containers Changed Deployment', 13, `
For years, deploying software was fragile. An application that worked perfectly on a developer's laptop failed on the server because of a different library version, a missing system package or a different configuration. Teams spent days on "environment problems" instead of building features. Containers largely solved this, and they now underpin how most modern software is shipped.

### The "works on my machine" problem

Imagine Sana, a developer in Lahore, builds an API with Node.js 20 and a particular image-processing library. The production server has Node.js 18 and an older library version. The code is identical, but the environment is not, so production crashes.

\`\`\`text
Developer laptop            Production server
Node.js 20                  Node.js 18
libvips 8.15                libvips 8.12
Ubuntu 24.04                Ubuntu 20.04
-> works                    -> crashes
\`\`\`

### What a container is

A container packages an application together with everything it needs to run: the runtime, libraries, system tools and configuration defaults. The package, called an image, runs the same way on any machine with a container runtime.

\`\`\`text
Container image:
  Application code
  Node.js 20 runtime
  libvips 8.15
  Minimal operating system files
-> runs identically on the laptop, test server and production
\`\`\`

### What changed for teams

| Before containers | With containers |
|---|---|
| Servers configured by hand, drifting over time | Environments defined in a file and rebuilt identically |
| "Works on my machine" arguments | Same image everywhere |
| New developers spend days setting up | One command starts the whole stack |
| Deployments risky and slow | Deploy a tested image; roll back to the previous one quickly |
| One application per server to avoid conflicts | Many isolated applications share a server efficiently |

### Containers and modern architecture

Containers made several modern practices practical:

- **Microservices**: many small services, each in its own container with its own dependencies.
- **CI/CD pipelines**: build an image once, test it, then deploy exactly that image.
- **Cloud platforms**: services such as managed container platforms and Kubernetes run containers at scale.
- **Reproducible development**: databases, caches and message brokers start locally in seconds.

### Docker and the wider ecosystem

Docker popularised containers from 2013 onwards with simple tools for building and running them. Today, containers follow open standards from the Open Container Initiative (OCI), so images built with Docker run on other runtimes too, such as containerd, which Kubernetes commonly uses. Learning Docker teaches concepts that apply across the whole ecosystem.

### Where Kubernetes fits

Docker runs containers on one machine. When you need to run hundreds of containers across many machines, restart them when they fail, scale them with traffic and update them without downtime, you need an orchestrator. Kubernetes is the most widely used one. This course follows that path: the first four chapters master Docker, and the rest build real Kubernetes skills.

### Why this matters for your career

Almost every modern software team uses containers. Developers are expected to write Dockerfiles and run local stacks with Compose; DevOps and platform engineers are expected to operate Kubernetes. These skills are in steady demand in Pakistan's software houses, fintechs and telecoms, and in remote roles abroad.
      `,
        [
          q('What problem do containers mainly solve?', [
            'Writing application code faster',
            'Differences between environments breaking applications',
            'Designing user interfaces',
            'Reducing internet costs',
          ], 1, 'Containers package the app with its environment, so it runs the same everywhere.'),
          q('What does a container image include?', [
            'Only the application source code',
            'A full copy of the host\'s hard drive',
            'The application with its runtime, libraries and defaults',
            'The production database\'s data',
          ], 2, 'An image bundles everything the application needs to run consistently.'),
          q('Why is an orchestrator like Kubernetes needed?', [
            'Docker cannot run a single container',
            'Containers only work on Kubernetes',
            'It replaces the need for images',
            'To run, heal and scale many containers across many machines',
          ], 3, 'Orchestrators manage large numbers of containers across clusters, handling failures and scaling.'),
        ]
      ),
      lesson('Containers Versus Virtual Machines', 13, `
Containers and virtual machines both isolate applications, and both let many workloads share hardware. But they work at different levels, with different trade-offs. Understanding the difference explains why containers start in a second and why they are not a complete security boundary on their own.

### How virtual machines work

A virtual machine (VM) emulates a whole computer. A hypervisor runs several VMs on one physical server, and each VM runs its own full operating system, with its own kernel.

\`\`\`text
Physical server
  Hypervisor
    VM 1: full OS (kernel) + libraries + App A
    VM 2: full OS (kernel) + libraries + App B
    VM 3: full OS (kernel) + libraries + App C
\`\`\`

### How containers work

Containers share the host operating system's kernel. Each container has its own isolated view of processes, files and network, created with Linux kernel features:

- **Namespaces** isolate what a process can see: its own process list, network interfaces, hostname and filesystem view.
- **Control groups (cgroups)** limit what a process can use: CPU, memory and I/O.

\`\`\`text
Physical server or VM
  Host OS (one shared kernel)
    Container runtime
      Container 1: libraries + App A
      Container 2: libraries + App B
      Container 3: libraries + App C
\`\`\`

A container is essentially an isolated, resource-limited set of processes on the host.

### Comparing them

| | Virtual machines | Containers |
|---|---|---|
| Isolation level | Hardware-level, separate kernels | Process-level, shared kernel |
| Startup time | Tens of seconds to minutes | Usually around a second |
| Size | Gigabytes | Megabytes to a few hundred megabytes |
| Density | Fewer per server | Many more per server |
| OS flexibility | Any OS per VM | Must match the host kernel type (Linux containers on a Linux kernel) |
| Security boundary | Strong | Good, but weaker than VMs by default |

### They work together

In practice, containers often run inside VMs. Cloud providers give you VMs, and you run containers on them. Kubernetes worker nodes are usually VMs. The VM provides strong isolation between customers; containers provide efficient packaging and density within your own workloads.

### Docker on Windows and macOS

Linux containers need a Linux kernel. On Windows and macOS, Docker Desktop runs a lightweight Linux VM behind the scenes, and your containers run inside it. That is why Docker Desktop needs some memory and CPU allocated, and why file sharing between your laptop and containers can be slower than on Linux. On Windows, WSL 2 provides that Linux environment efficiently.

### Security implications

Because containers share the host kernel, a vulnerability in the kernel or a badly configured container can potentially affect the host. Good practices, covered in later chapters, reduce the risk:

- Run containers as non-root users.
- Avoid privileged containers.
- Keep images minimal and updated.
- Limit resources so one container cannot starve others.

For running untrusted code from different customers, stronger isolation such as separate VMs or sandboxed runtimes is used.

### A useful mental model

\`\`\`text
VM:        a separate house with its own foundations
Container: a separate flat in one building, sharing the foundation
\`\`\`

Flats are cheaper and faster to set up, but residents share the building's structure. Both have their place.
      `,
        [
          q('What do containers share that virtual machines do not?', [
            'Their application code',
            'Their network cables',
            'The host operating system\'s kernel',
            'Their container images',
          ], 2, 'Containers run as isolated processes on a shared kernel, while each VM runs its own kernel.'),
          q('What do Linux namespaces provide for containers?', [
            'An isolated view of processes, network and filesystem',
            'Limits on CPU and memory',
            'Encryption of container data',
            'Automatic image updates',
          ], 0, 'Namespaces isolate what a container can see; cgroups limit what it can use.'),
          q('Why does Docker Desktop on macOS run a lightweight Linux VM?', [
            'macOS cannot run any software',
            'To make containers slower on purpose',
            'Docker only supports Windows',
            'Linux containers need a Linux kernel',
          ], 3, 'The hidden VM supplies the Linux kernel that Linux containers require.'),
        ]
      ),
      lesson('Installing Docker and Running Your First Container', 13, `
Reading about containers only goes so far. In this walkthrough you install Docker, run real containers, and see how quickly a complete service can start. Every later chapter builds on these hands-on basics.

### Installing Docker

| Platform | Recommended option |
|---|---|
| Windows | Docker Desktop with the WSL 2 backend |
| macOS | Docker Desktop, or alternatives such as Colima or OrbStack |
| Linux | Docker Engine from Docker's official repository for your distribution |

Docker Desktop is free for personal use, education and small businesses, but larger companies need a paid subscription; check Docker's current licence terms for your situation. On Linux servers, Docker Engine itself is open source.

After installing, check that it works:

\`\`\`bash
docker version
docker run hello-world
\`\`\`

The second command downloads a tiny image and runs it, printing a message that explains what just happened. If you see it, Docker is working.

### Linux permissions

On Linux, Docker commands may need \`sudo\`. Adding your user to the \`docker\` group avoids that, but note that membership of this group effectively grants root-level access to the machine, so only do it on your own development machine.

### Running a web server

\`\`\`bash
docker run -d --name web -p 8080:80 nginx:1.27
\`\`\`

| Part | Meaning |
|---|---|
| \`docker run\` | Create and start a container |
| \`-d\` | Detached: run in the background |
| \`--name web\` | Give the container a readable name |
| \`-p 8080:80\` | Map port 8080 on your machine to port 80 in the container |
| \`nginx:1.27\` | The image and tag to run |

Open \`http://localhost:8080\` in a browser and you will see the Nginx welcome page. A complete web server, downloaded and running in seconds, with nothing installed on your machine except Docker.

### Seeing what is running

\`\`\`bash
docker ps              # running containers
docker ps -a           # all containers, including stopped ones
docker logs web        # the container's output
docker stop web        # stop it
docker start web       # start it again
docker rm -f web       # stop and remove it
\`\`\`

### Interactive containers

You can also run a container interactively, like opening a shell on a fresh machine:

\`\`\`bash
docker run -it --rm ubuntu:24.04 bash
\`\`\`

\`-it\` gives you an interactive terminal; \`--rm\` removes the container when you exit. Inside, try \`cat /etc/os-release\` and \`ls /\`. You are in an Ubuntu environment, even if your laptop runs Windows or macOS. Type \`exit\` to leave, and the container disappears.

### Running a database in one line

\`\`\`bash
docker run -d --name pg -e POSTGRES_PASSWORD=devpass -p 5432:5432 postgres:16
\`\`\`

A PostgreSQL server is now running locally. This is one of the most practical everyday uses of Docker for developers: databases, caches and message brokers start and stop in seconds without cluttering your machine.

### Cleaning up

Containers and images accumulate. Useful commands:

\`\`\`bash
docker images                 # list images
docker system df              # disk space used by Docker
docker system prune           # remove stopped containers, unused networks and dangling images
\`\`\`

Read the confirmation carefully before pruning, especially with extra flags that also remove volumes, because volumes may contain data you want to keep.
      `,
        [
          q('In docker run -p 8080:80 nginx, what does 8080:80 mean?', [
            'The container uses 8080 megabytes of memory',
            'Port 8080 on the host maps to port 80 in the container',
            'The container runs for 80 minutes',
            'Nginx version 8080 runs on port 80',
          ], 1, 'Port mapping is host port first, container port second.'),
          q('What does the --rm flag do?', [
            'Removes the image after download',
            'Removes all other containers',
            'Runs the container as root',
            'Removes the container automatically when it exits',
          ], 3, '--rm cleans up the container when its main process ends.'),
          q('Why be careful with extra prune flags that remove volumes?', [
            'Volumes cannot be recreated at all',
            'Volumes may contain data you want to keep',
            'Pruning volumes deletes Docker itself',
            'Volumes store the Docker licence',
          ], 1, 'Volumes often hold database data, so deleting them can lose important information.'),
        ]
      ),
      lesson('Images, Layers and Registries Explained', 13, `
When you ran \`nginx:1.27\`, Docker downloaded an image from a registry and started a container from it. Understanding images, layers, tags and registries makes the rest of Docker logical, and it explains why builds can be fast or slow and why image sizes matter.

### Images and containers

| Concept | Analogy | Description |
|---|---|---|
| Image | A class, or a recipe | A read-only template containing the filesystem and settings |
| Container | An object, or a cooked meal | A running (or stopped) instance of an image, with its own writable layer |

You can start many containers from one image. Changes made inside a container, such as files written, live in that container's writable layer and disappear when the container is removed, unless stored in a volume (chapter 4).

### Layers

An image is built from layers, each representing a set of filesystem changes:

\`\`\`text
Layer 4: application code          (small, changes often)
Layer 3: npm dependencies          (medium, changes sometimes)
Layer 2: Node.js runtime           (larger, changes rarely)
Layer 1: base OS files             (larger, changes rarely)
\`\`\`

Layers are shared and cached. If ten images use the same base layer, it is stored once. When you pull a new version of an image, Docker downloads only the layers that changed. When building, unchanged layers are reused from cache, which is why ordering instructions well in a Dockerfile makes builds much faster (chapter 3).

\`\`\`bash
docker history nginx:1.27     # shows the layers of an image
\`\`\`

### Tags

An image reference looks like:

\`\`\`text
registry/repository:tag
docker.io/library/nginx:1.27
ghcr.io/mehranmart/bazaar-api:2.3.1
\`\`\`

If you omit the registry, Docker Hub is assumed. If you omit the tag, \`latest\` is assumed. Despite its name, \`latest\` is just a default tag, not a guarantee of the newest version. Pin explicit versions in anything important, so builds and deployments are predictable.

### Digests

Tags can be moved to point to different images. A digest identifies exact image content:

\`\`\`text
nginx@sha256:<64 hexadecimal characters identifying the exact content>
\`\`\`

Deploying by digest guarantees the exact same image every time, which is useful for strict production and security requirements.

### Registries

A registry stores and distributes images:

| Registry | Notes |
|---|---|
| Docker Hub | Default public registry with official images; pull rate limits apply to anonymous and free users |
| GitHub Container Registry (ghcr.io) | Convenient for projects hosted on GitHub |
| Amazon ECR, Google Artifact Registry, Azure Container Registry | Private registries integrated with each cloud |
| Self-hosted, such as Harbor | For organisations wanting full control |

\`\`\`bash
docker pull postgres:16
docker tag bazaar-api:dev ghcr.io/mehranmart/bazaar-api:2.3.1
docker login ghcr.io
docker push ghcr.io/mehranmart/bazaar-api:2.3.1
\`\`\`

### Official and trusted images

Prefer official images and images from verified publishers for base images. Random images from unknown accounts may be outdated or even malicious. Check how an image is maintained, how often it is updated and what it contains before building on it.

### Multi-architecture images

Many images support several CPU architectures, such as amd64 for most servers and arm64 for Apple Silicon laptops and some cloud servers. Docker pulls the right variant automatically. When building your own images for mixed environments, Docker can build multi-architecture images too.
      `,
        [
          q('What happens to files written inside a container when the container is removed?', [
            'They are saved into the image automatically',
            'They are uploaded to Docker Hub',
            'They are lost, unless stored in a volume',
            'They move to the host\'s desktop',
          ], 2, 'Container changes live in a writable layer that is deleted with the container, unless volumes are used.'),
          q('What does the latest tag guarantee?', [
            'The newest version of the image',
            'A security-scanned image',
            'The smallest version of the image',
            'Nothing special; it is just a default tag name',
          ], 3, 'latest is only the default tag, so explicit version tags are safer for predictable deployments.'),
          q('Why are image layers efficient?', [
            'They are cached and shared, so unchanged layers are reused',
            'They compress the application code only',
            'They remove the need for registries',
            'Each layer runs as a separate container',
          ], 0, 'Shared, cached layers reduce storage, speed up pulls and make rebuilds faster.'),
        ]
      ),
      ],
      [
      q('Which statement best describes a container?', [
        'A full virtual computer with its own kernel',
        'Isolated processes on the host with limited resources',
        'A backup of an application\'s database',
        'A cloud server rented by the hour',
      ], 1, 'Containers are isolated, resource-limited processes sharing the host kernel.'),
      q('Which command lists running containers?', [
        'docker images',
        'docker pull',
        'docker history',
        'docker ps',
      ], 3, 'docker ps lists running containers; docker ps -a includes stopped ones.'),
      q('What is the difference between an image and a container?', [
        'They are the same thing',
        'A container is stored in a registry, an image runs',
        'An image is a read-only template; a container is a running instance of it',
        'Images only exist on Kubernetes',
      ], 2, 'Images are templates; containers are instances created from them with a writable layer.'),
      q('Why pin explicit image versions like postgres:16 instead of latest?', [
        'Explicit tags download faster',
        'latest images cannot be run',
        'Registries reject latest tags',
        'Builds and deployments stay predictable',
      ], 3, 'Pinned versions prevent unexpected changes when a default tag moves to a new image.'),
      ]
    ),
    chapter(
      'Working With Docker Every Day',
      'Use the Docker commands you will need daily, containerise your own application with a Dockerfile, configure containers with environment variables, ports and logs, and debug running containers with exec, inspect and stats.',
      [
      lesson('Everyday Docker Commands', 12, `
A small set of Docker commands covers most daily work. Knowing them well, including their most useful flags, makes you fast and confident, and the same concepts reappear later with \`kubectl\` in Kubernetes.

### The container lifecycle

\`\`\`text
docker create  ->  created
docker start   ->  running
docker stop    ->  exited (graceful: SIGTERM, then SIGKILL after a timeout)
docker kill    ->  exited (immediate: SIGKILL by default)
docker rm      ->  removed
docker run     =   create + start in one command
\`\`\`

### Commands by task

| Task | Command |
|---|---|
| Run in the background | \`docker run -d --name api -p 3000:3000 bazaar-api:1.0\` |
| List running containers | \`docker ps\` |
| List all containers | \`docker ps -a\` |
| Follow logs | \`docker logs -f api\` |
| Open a shell inside | \`docker exec -it api sh\` |
| Stop and remove | \`docker rm -f api\` |
| Restart | \`docker restart api\` |
| List images | \`docker images\` |
| Remove an image | \`docker rmi bazaar-api:1.0\` |
| Resource usage | \`docker stats\` |

### Useful run flags

\`\`\`bash
docker run -d \\
  --name api \\
  -p 3000:3000 \\
  -e NODE_ENV=production \\
  --restart unless-stopped \\
  --memory 512m \\
  --cpus 1.0 \\
  bazaar-api:1.0
\`\`\`

| Flag | Purpose |
|---|---|
| \`--restart unless-stopped\` | Restart automatically after crashes or reboots, unless you stopped it |
| \`--memory 512m\` | Limit memory; the container is killed if it exceeds this |
| \`--cpus 1.0\` | Limit CPU to one core's worth |
| \`-e\` | Set an environment variable |
| \`-v\` | Mount a volume (chapter 4) |
| \`--network\` | Attach to a network (chapter 4) |

### Filtering and formatting output

On a busy machine, listing everything is noisy:

\`\`\`bash
docker ps --filter "status=exited"
docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
docker images --filter "dangling=true"
\`\`\`

The \`--format\` option uses Go templates; it is handy in scripts.

### Copying files

\`\`\`bash
docker cp api:/app/logs/error.log ./error.log   # from container to host
docker cp ./config.json api:/app/config.json    # from host to container
\`\`\`

Copying into a running container is useful for quick debugging, but not for real configuration changes, which should be built into images or supplied through environment variables and volumes.

### Graceful stopping

\`docker stop\` sends SIGTERM, giving the application time (10 seconds by default) to finish requests and close connections, then sends SIGKILL. Applications should handle SIGTERM properly; the Dockerfile lesson explains a common mistake that prevents this.

### Getting help

Every command has built-in help:

\`\`\`bash
docker run --help
docker logs --help
\`\`\`

The official documentation is excellent too. With a few weeks of practice, these commands become second nature, and the equivalent Kubernetes commands later will feel familiar.
      `,
        [
          q('What does docker stop do?', [
            'Deletes the container immediately',
            'Removes the image from the machine',
            'Sends SIGTERM, then SIGKILL after a timeout',
            'Pauses the container without stopping processes',
          ], 2, 'docker stop allows a graceful shutdown before forcing termination.'),
          q('What does --restart unless-stopped do?', [
            'Prevents the container from ever restarting',
            'Restarts the container after crashes or reboots unless you stopped it',
            'Restarts the container every hour',
            'Removes the container after it stops',
          ], 1, 'This restart policy keeps services running while respecting manual stops.'),
          q('What happens if a container exceeds its --memory limit?', [
            'It is given more memory automatically',
            'Docker ignores the limit',
            'The host machine restarts',
            'The container is killed',
          ], 3, 'Exceeding the memory limit triggers the out-of-memory killer, stopping the container.'),
        ]
      ),
      lesson('Writing Your First Dockerfile', 14, `
A Dockerfile is a text file with instructions for building an image. Writing one for your own application is the most important Docker skill for developers. Let us containerise a small Node.js API, \`bazaar-api\`, used by a Karachi grocery delivery startup.

### The application

\`\`\`text
bazaar-api/
  package.json
  package-lock.json
  src/server.js
\`\`\`

The server listens on the port given in the \`PORT\` environment variable, defaulting to 3000.

### A first Dockerfile

\`\`\`dockerfile
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

USER node
CMD ["node", "src/server.js"]
\`\`\`

### Instruction by instruction

| Instruction | Meaning |
|---|---|
| \`FROM node:20-slim\` | Start from an official Node.js image |
| \`WORKDIR /app\` | Set the working directory; later instructions run here |
| \`COPY package*.json ./\` | Copy dependency manifests first, for better caching |
| \`RUN npm ci --omit=dev\` | Install production dependencies exactly as locked |
| \`COPY src ./src\` | Copy the application code |
| \`ENV NODE_ENV=production\` | Set an environment variable in the image |
| \`EXPOSE 3000\` | Document the port the app listens on (does not publish it) |
| \`USER node\` | Run as the non-root \`node\` user provided by the base image |
| \`CMD [...]\` | The default command when the container starts |

### Building and running

\`\`\`bash
docker build -t bazaar-api:1.0 .
docker run -d --name api -p 3000:3000 bazaar-api:1.0
curl http://localhost:3000/health
\`\`\`

The \`.\` at the end of \`docker build\` is the build context: the folder whose files are available to \`COPY\`.

### The .dockerignore file

Without it, Docker sends everything in the folder to the build, including \`node_modules\`, \`.git\` and local secrets:

\`\`\`text
node_modules
.git
.env
*.log
coverage
\`\`\`

A good \`.dockerignore\` speeds up builds, keeps images smaller and prevents secrets such as \`.env\` files leaking into images.

### CMD and ENTRYPOINT

| | CMD | ENTRYPOINT |
|---|---|---|
| Purpose | Default command or arguments | The fixed executable |
| Overridden by | Arguments after the image name in \`docker run\` | The \`--entrypoint\` flag |

Most application images need only \`CMD\`. \`ENTRYPOINT\` suits images that behave like a command-line tool.

### Exec form versus shell form

\`\`\`dockerfile
CMD ["node", "src/server.js"]    # exec form: recommended
CMD node src/server.js           # shell form: runs via /bin/sh -c
\`\`\`

With the shell form, the shell becomes the main process (PID 1) and may not forward SIGTERM to your application, so \`docker stop\` waits for the timeout and then kills it abruptly. The exec form makes your application PID 1, receiving signals directly and shutting down gracefully. Always prefer the exec form.

### Build arguments

\`ARG\` passes values at build time, such as a version:

\`\`\`dockerfile
ARG APP_VERSION=dev
LABEL org.opencontainers.image.version=$APP_VERSION
\`\`\`

\`\`\`bash
docker build --build-arg APP_VERSION=1.0.0 -t bazaar-api:1.0.0 .
\`\`\`

Never pass secrets as build arguments; they can be visible in the image history. Chapter 3 covers safer approaches.
      `,
        [
          q('Why copy package.json and run npm ci before copying the source code?', [
            'npm requires source code to be missing',
            'It makes the image run as root',
            'Dependency installation stays cached when only code changes',
            'Docker forbids copying source code first',
          ], 2, 'Separating dependency installation from code copying lets Docker reuse the cached dependency layer.'),
          q('What does EXPOSE 3000 do?', [
            'Publishes port 3000 to the internet',
            'Opens a firewall port on the host',
            'Forces the app to use port 3000',
            'Documents the port; publishing still needs -p',
          ], 3, 'EXPOSE is documentation and metadata; -p actually maps ports when running.'),
          q('Why prefer the exec form of CMD?', [
            'The app becomes PID 1 and receives stop signals for graceful shutdown',
            'It makes the image smaller',
            'It allows secrets in the Dockerfile',
            'It is the only form Docker supports',
          ], 0, 'With the exec form, SIGTERM reaches the application directly instead of a shell that may not forward it.'),
        ]
      ),
      lesson('Environment Variables, Ports and Logs', 13, `
The same image should run in development, testing and production, with only configuration changing. Environment variables supply that configuration, port mappings connect containers to the outside world, and logs show what is happening inside. Getting these right follows the widely used twelve-factor app principles.

### Configuration through environment variables

\`\`\`bash
docker run -d --name api \\
  -e PORT=3000 \\
  -e DATABASE_URL=postgres://app:secret@db:5432/bazaar \\
  -e LOG_LEVEL=info \\
  -p 3000:3000 \\
  bazaar-api:1.0
\`\`\`

For many variables, use an env file:

\`\`\`text
# .env.production  (never commit real secrets)
PORT=3000
LOG_LEVEL=info
DATABASE_URL=postgres://app:secret@db:5432/bazaar
\`\`\`

\`\`\`bash
docker run -d --env-file .env.production -p 3000:3000 bazaar-api:1.0
\`\`\`

Values set with \`ENV\` in the Dockerfile are defaults; \`-e\` and \`--env-file\` override them at runtime.

### Secrets need extra care

Environment variables are visible through \`docker inspect\` to anyone with Docker access on the host. For production, use your platform's secret management: Docker secrets in Swarm, Kubernetes Secrets (chapter 8) or a cloud secret manager. Never bake secrets into images, where anyone who can pull the image can read them.

### Ports

\`\`\`text
-p 8080:3000          host 8080 -> container 3000, on all host interfaces
-p 127.0.0.1:8080:3000  only reachable from the host itself
-p 3000               random host port -> container 3000
\`\`\`

Binding to \`127.0.0.1\` is useful for databases in development, so they are not exposed to your whole network. On a server, publishing a database port to all interfaces can expose it to the internet, a common and dangerous mistake. Check with \`docker port api\`.

### Listen on 0.0.0.0 inside the container

A frequent beginner problem: the app works inside the container but is unreachable from the host. Often the application is listening on \`127.0.0.1\` (localhost) inside the container, which only accepts connections from within the container itself. Configure the app to listen on \`0.0.0.0\`, all interfaces, so the port mapping works.

### Logging: write to stdout and stderr

Containers should write logs to standard output and standard error, not to files inside the container. Docker captures these streams:

\`\`\`bash
docker logs api                 # all logs
docker logs -f api              # follow new logs
docker logs --tail 100 api      # last 100 lines
docker logs --since 10m api     # last 10 minutes
\`\`\`

Writing to stdout lets the platform, Docker, Kubernetes or a cloud service, collect, rotate and ship logs centrally. Files written inside containers are lost when the container is replaced and can fill the disk.

### Log size and rotation

By default, Docker's json-file log driver can grow without limit on busy containers. Configure rotation, either per container or globally in Docker's daemon settings:

\`\`\`bash
docker run -d --log-opt max-size=10m --log-opt max-file=3 bazaar-api:1.0
\`\`\`

Many production setups instead send logs to a central system with a different log driver or a log collector.

### Structured logs

Logging in JSON, one object per line, makes logs searchable in central systems:

\`\`\`json
{"level":"info","msg":"order created","orderId":"A-1042","city":"Karachi","ms":84}
\`\`\`

Combined with request IDs, structured logs make it possible to trace a problem through thousands of lines in seconds.
      `,
        [
          q('How do runtime -e values relate to ENV values in the Dockerfile?', [
            'ENV values always win',
            'Both are ignored in production',
            'Runtime values override the Dockerfile defaults',
            'They must be identical',
          ], 2, 'ENV sets defaults in the image, while -e and --env-file override them at runtime.'),
          q('An app works inside the container but is unreachable through the mapped port. What is a common cause?', [
            'The image is too large to accept connections',
            'The app listens only on 127.0.0.1 inside',
            'Docker logging has been disabled for the container',
            'The container name is longer than allowed',
          ], 1, 'Listening only on localhost inside the container rejects connections arriving through port mapping.'),
          q('Why should containers log to stdout and stderr?', [
            'Files cannot be created inside containers',
            'stdout logs are encrypted automatically',
            'It makes the image smaller',
            'The platform can collect and ship logs, and nothing is lost with the container',
          ], 3, 'Standard streams let Docker or Kubernetes capture logs centrally instead of storing them in disposable containers.'),
        ]
      ),
      lesson('Debugging Containers With exec and inspect', 13, `
Containers fail in many ways: they exit immediately, restart in a loop, cannot reach a database or use too much memory. A systematic debugging approach, using a handful of Docker commands, finds most problems in minutes. The same approach carries over to Kubernetes later.

### Step 1: is it running, and how did it exit?

\`\`\`bash
docker ps -a --filter name=api
\`\`\`

The STATUS column shows \`Up 5 minutes\`, \`Exited (1) 2 seconds ago\` or \`Restarting\`. The exit code is a strong clue:

| Exit code | Usual meaning |
|---|---|
| 0 | The main process finished normally; perhaps it was not meant to run as a server |
| 1 | Application error; check the logs |
| 126 or 127 | Command not executable or not found; check CMD, ENTRYPOINT and paths |
| 137 | Killed by SIGKILL, often out of memory |
| 143 | Terminated by SIGTERM, a normal stop |

### Step 2: read the logs

\`\`\`bash
docker logs --tail 50 api
\`\`\`

Most failures explain themselves in the last lines: a missing environment variable, a connection refused, a syntax error.

### Step 3: look inside

\`\`\`bash
docker exec -it api sh
\`\`\`

Inside the running container you can check files, environment variables and connectivity:

\`\`\`bash
env | sort
ls -la /app
cat /etc/hosts
wget -qO- http://localhost:3000/health
\`\`\`

Minimal images may not include \`bash\`, \`curl\` or other tools; \`sh\` is usually present. For very minimal images without a shell, debug with a separate helper container attached to the same network, or use Docker's debugging features where available.

If the container exits immediately, you cannot exec into it. Instead, start a new container from the same image with a shell, overriding the command:

\`\`\`bash
docker run -it --rm --entrypoint sh bazaar-api:1.0
\`\`\`

### Step 4: inspect the configuration

\`\`\`bash
docker inspect api
docker inspect -f '{{.State.OOMKilled}}' api
docker inspect -f '{{json .Config.Env}}' api
docker inspect -f '{{json .NetworkSettings.Networks}}' api
\`\`\`

\`docker inspect\` shows everything Docker knows: environment variables, mounts, networks, restart counts, and whether the container was killed for running out of memory.

### Step 5: check resources

\`\`\`bash
docker stats api
docker top api
\`\`\`

\`docker stats\` shows live CPU, memory and network use. A container steadily climbing towards its memory limit suggests a memory leak or a limit set too low.

### A debugging checklist

\`\`\`text
1. docker ps -a              status and exit code
2. docker logs               the error message
3. docker inspect            config, env, mounts, OOMKilled
4. docker exec / run sh      look inside, test connectivity
5. docker stats              resource pressure
\`\`\`

### Common problems and fixes

| Symptom | Likely cause |
|---|---|
| Exits instantly with code 0 | The command finishes instead of running a server |
| Exit 137 with OOMKilled true | Memory limit too low or a leak |
| "Connection refused" to a database | Wrong host name; using localhost instead of the database container's name (chapter 4) |
| Permission denied writing files | Running as a non-root user without write access to that folder |
| Works locally, fails on the server | Different architecture, missing environment variables or network rules |

The \`localhost\` mistake is particularly common: inside a container, \`localhost\` means the container itself, not your laptop or another container.
      `,
        [
          q('A container shows Exited (137) and OOMKilled is true. What happened?', [
            'The app finished normally',
            'The command was not found',
            'It exceeded its memory limit and was killed',
            'It was stopped gracefully with SIGTERM',
          ], 2, 'Exit code 137 means SIGKILL, and OOMKilled confirms the out-of-memory killer stopped it.'),
          q('How can you debug an image whose container exits immediately?', [
            'Use docker exec on the exited container',
            'Delete the image and hope',
            'Run a new container with --entrypoint sh to look inside',
            'Increase the restart count',
          ], 2, 'Overriding the entrypoint starts a shell in the image, letting you inspect files and settings.'),
          q('Inside a container, what does localhost refer to?', [
            'The container itself',
            'The developer\'s laptop',
            'The database container',
            'The Docker registry',
          ], 0, 'Each container has its own network namespace, so localhost points back to the container.'),
        ]
      ),
      ],
      [
      q('Which command opens an interactive shell in a running container named api?', [
        'docker run api sh',
        'docker logs -it api',
        'docker inspect api sh',
        'docker exec -it api sh',
      ], 3, 'docker exec runs a new process, such as a shell, inside an existing running container.'),
      q('What should a .dockerignore file usually exclude?', [
        'The Dockerfile itself',
        'The application\'s source code',
        'package.json',
        'node_modules, .git and .env files',
      ], 3, 'Excluding these speeds up builds, reduces image size and prevents secrets leaking into images.'),
      q('Why should secrets not be baked into images?', [
        'Anyone who can pull the image can read them',
        'Images cannot store text files',
        'Secrets make images too large',
        'Docker deletes secrets during builds',
      ], 0, 'Image contents are readable by anyone with access to the image, so secrets must be supplied at runtime.'),
      q('Which command shows live CPU and memory usage of containers?', [
        'docker history',
        'docker images',
        'docker stats',
        'docker port',
      ], 2, 'docker stats streams live resource usage for running containers.'),
      ]
    ),
    chapter(
      'Building Better Images',
      'Speed up builds with layer caching and BuildKit features, shrink images with multi-stage builds, choose base images deliberately, and harden images by scanning for vulnerabilities and running as a non-root user.',
      [
      lesson('Layer Caching and Build Speed', 13, `
A slow Docker build wastes minutes on every change, and in CI pipelines those minutes add up to hours each week. Most slow builds are caused by instruction order that defeats the layer cache. Understanding how the cache works is the single biggest improvement you can make.

### How the cache works

Each instruction in a Dockerfile creates a layer. When rebuilding, Docker reuses a cached layer if the instruction and its inputs have not changed. As soon as one layer changes, every layer after it must be rebuilt.

\`\`\`text
FROM node:20-slim          cached
WORKDIR /app               cached
COPY . .                   CHANGED (you edited one file)
RUN npm ci                 rebuilt (slow!) because an earlier layer changed
CMD ["node","server.js"]   rebuilt
\`\`\`

In this ordering, editing a single line of code forces a full reinstall of dependencies.

### Order from least to most frequently changing

\`\`\`dockerfile
FROM node:20-slim
WORKDIR /app

# 1. Dependencies change rarely: copy manifests and install first
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2. Code changes often: copy it last
COPY src ./src

CMD ["node", "src/server.js"]
\`\`\`

Now, editing code only rebuilds the last layers, and the expensive \`npm ci\` step comes from cache. The same principle applies to every language: copy \`requirements.txt\` before Python code, \`pom.xml\` before Java sources, \`go.mod\` before Go files.

### Combine related commands

Each \`RUN\` creates a layer. Files deleted in a later layer still exist in the earlier one, so cleanup must happen in the same \`RUN\`:

\`\`\`dockerfile
# Leaves the apt cache inside an earlier layer
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# Better: one layer, cache removed in the same step
RUN apt-get update \\
 && apt-get install -y --no-install-recommends curl \\
 && rm -rf /var/lib/apt/lists/*
\`\`\`

### BuildKit cache mounts

Docker's modern builder, BuildKit, supports cache mounts that keep package manager caches between builds without storing them in the image:

\`\`\`dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
\`\`\`

Even when \`package-lock.json\` changes, npm reuses previously downloaded packages, making dependency updates much faster.

### Build secrets safely

Sometimes a build needs a secret, such as a token for a private package registry. Never use \`ARG\` or \`COPY\` for secrets, since they can remain in the image or its history. Use secret mounts instead:

\`\`\`dockerfile
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
\`\`\`

\`\`\`bash
docker build --secret id=npmrc,src=$HOME/.npmrc -t bazaar-api:1.1 .
\`\`\`

The secret is available only during that \`RUN\` step and is not saved in any layer.

### Caching in CI

CI runners often start with an empty cache, so every build starts from scratch. Solutions include exporting and importing build cache to a registry or to the CI system's cache storage, which BuildKit and tools like GitHub Actions' Docker actions support. With remote caching, CI builds can be nearly as fast as local rebuilds.

### Measure

\`\`\`bash
docker build --progress=plain -t bazaar-api:dev .
\`\`\`

Plain progress output shows which steps were cached (\`CACHED\`) and how long each took. Improve the slowest uncached step first.
      `,
        [
          q('Why does COPY . . before RUN npm ci make builds slow?', [
            'npm ci cannot run after any COPY instruction',
            'Any code change forces the install to rerun',
            'COPY . . deletes the whole build cache',
            'It makes the image run as the root user',
          ], 1, 'Changing a layer forces all later layers to rebuild, so dependencies reinstall on every code change.'),
          q('Why should apt cache cleanup be in the same RUN as the install?', [
            'Docker forbids multiple RUN instructions',
            'Separate RUN steps cannot delete files',
            'Files deleted in a later layer still take space in the earlier layer',
            'It makes the install faster',
          ], 2, 'Layers are additive, so cleanup must happen in the same step to actually reduce size.'),
          q('How should a private registry token be provided during a build?', [
            'As a build ARG',
            'Copied into the image and deleted later',
            'Written directly in the Dockerfile',
            'Through a BuildKit secret mount',
          ], 3, 'Secret mounts expose the value only during one step without saving it in any layer.'),
        ]
      ),
      lesson('Multi-Stage Builds for Small Images', 13, `
Building software often needs compilers, build tools and development dependencies that the running application never uses. Shipping them in production images wastes space, slows deployments and adds security risks. Multi-stage builds separate building from running, producing small, clean final images.

### The idea

A multi-stage Dockerfile has several \`FROM\` instructions. Earlier stages build the application; the final stage copies only the results:

\`\`\`dockerfile
# Stage 1: build
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build          # e.g. compiles TypeScript into dist/

# Stage 2: runtime
FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
\`\`\`

The TypeScript compiler, test libraries and source files stay in the build stage. The final image contains only production dependencies and compiled output.

### Size differences in practice

| Image | Typical contents | Relative size |
|---|---|---|
| Single stage with full build tools | Compiler, dev dependencies, sources | Largest |
| Multi-stage with a slim runtime | Runtime plus production dependencies | Much smaller |
| Multi-stage with distroless or scratch (compiled languages) | Just the binary and essentials | Smallest |

Exact sizes vary, but multi-stage builds commonly reduce images by a large fraction.

### Compiled languages: dramatic savings

For Go, the final image can contain a single static binary:

\`\`\`dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api ./cmd/api

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/api /api
USER nonroot
ENTRYPOINT ["/api"]
\`\`\`

The runtime image has no shell or package manager, only the application.

### Front-end applications

A React app needs Node.js to build, but only a web server to serve the result:

\`\`\`dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
\`\`\`

The final image serves static files with Nginx, without Node.js or any source code.

### Useful multi-stage techniques

- **Named stages** (\`AS build\`) make \`COPY --from=build\` readable.
- **Test stage**: add a stage that runs tests; CI can build it with \`--target test\`, while production builds skip it.
- **Build a specific stage**: \`docker build --target build .\` stops at that stage, useful for debugging.
- **Copy from other images**: \`COPY --from=nginx:1.27 /etc/nginx/nginx.conf /tmp/\` copies files from any image.

### Why small images matter

- Faster pulls, so deployments and scaling happen quicker.
- Less storage in registries and on nodes.
- Fewer packages, so fewer vulnerabilities to patch.
- A smaller attack surface if the container is compromised.

Aim for the smallest image that still runs reliably and can be debugged when needed; the next lesson discusses that balance.
      `,
        [
          q('What is the main purpose of a multi-stage build?', [
            'Running several applications in one container',
            'Keeping build tools out of the final runtime image',
            'Building images without a Dockerfile',
            'Storing images in several registries',
          ], 1, 'Earlier stages build the app, and only the needed output is copied into the final image.'),
          q('What does COPY --from=build do?', [
            'Downloads files from the internet',
            'Copies files from the host machine',
            'Copies the build cache to a registry',
            'Copies files from the earlier stage named build',
          ], 3, 'COPY --from takes files from another stage or image rather than the build context.'),
          q('Why do smaller images improve security?', [
            'Small images are encrypted automatically',
            'Registries scan only small images',
            'Fewer packages mean fewer vulnerabilities and a smaller attack surface',
            'Small images cannot be pulled by attackers',
          ], 2, 'Every extra package is potential attack surface and something else to patch.'),
        ]
      ),
      lesson('Choosing Base Images Wisely', 12, `
Every image starts from a base image, and that choice affects size, compatibility, security updates and how easy the container is to debug. There is no single best base image; each option trades something for something else.

### The main families

| Base image type | Examples | Strengths | Trade-offs |
|---|---|---|---|
| Full distribution | \`node:20\`, \`python:3.12\` | Many tools included; easy to debug | Large; more packages to patch |
| Slim variants | \`node:20-slim\`, \`python:3.12-slim\` | Much smaller Debian-based images | Fewer tools; install what you need |
| Alpine | \`node:20-alpine\`, \`alpine:3.20\` | Very small | Uses musl instead of glibc; some native packages behave differently |
| Distroless | \`gcr.io/distroless/...\` | Minimal, no shell or package manager | Harder to debug; needs multi-stage builds |
| Hardened minimal images | Various vendors' minimal, frequently rebuilt images | Few vulnerabilities, regularly updated | Vendor-specific; check licences |
| Scratch | \`scratch\` | Empty; nothing but your binary | Only for fully static binaries |

### Alpine: small, but check compatibility

Alpine Linux is popular for its tiny size. It uses the musl C library rather than glibc, which most Linux distributions use. Most applications run fine, but some native modules, prebuilt binaries and performance-sensitive workloads behave differently or need extra build steps. Python packages with compiled extensions, for instance, may need to build from source on Alpine, making builds slower. When in doubt, a slim Debian-based image is a safe, compatible default.

### Distroless: minimal by design

Distroless images contain the language runtime and your application, but no shell, package manager or common utilities. Attackers who break in find very little to work with. The trade-off is debugging: you cannot \`exec\` a shell into them. Many teams use distroless in production and a debug variant, or ephemeral debug containers in Kubernetes, when investigating issues.

### Pin versions, and consider digests

\`\`\`dockerfile
FROM node:20.14-slim
\`\`\`

Pinning to a specific version prevents surprise changes. For stricter reproducibility, pin by digest, as chapter 1 described. But pinned images do not update themselves; you must rebuild regularly to receive security patches. Automated tools such as Dependabot or Renovate can open pull requests when new base image versions are released.

### Official and trusted sources

Use official images or images from verified publishers as bases. Check:

- How often the image is updated.
- Whether the publisher is trustworthy and active.
- What the image contains, using \`docker history\` or its published Dockerfile.

### A decision guide

\`\`\`text
Just starting, want compatibility       -> official slim image
Compiled static binary (Go, Rust)       -> distroless static or scratch
Need the smallest image, no native deps -> alpine variant
Security-sensitive production           -> distroless or hardened minimal images
Need to debug often                     -> slim now, move to minimal later
\`\`\`

### Rebuild regularly

Base images receive security updates frequently. An image built a year ago and never rebuilt likely contains known vulnerabilities, even if your code has not changed. Schedule regular rebuilds, weekly or monthly, through CI, and redeploy after they pass tests.
      `,
        [
          q('What is a known trade-off of Alpine-based images?', [
            'They are larger than full images',
            'They cannot run Node.js',
            'They include a full desktop environment',
            'musl instead of glibc can cause compatibility differences',
          ], 3, 'Alpine\'s musl C library occasionally causes issues with native modules and prebuilt binaries.'),
          q('What is a trade-off of distroless images?', [
            'No shell, which makes debugging harder',
            'They include too many packages',
            'They only run on Windows',
            'They cannot run compiled binaries',
          ], 0, 'Distroless images omit shells and tools, improving security but complicating debugging.'),
          q('Why rebuild images regularly even when code has not changed?', [
            'Docker deletes old images automatically',
            'Registries require monthly uploads',
            'Base images receive security patches that old builds lack',
            'It makes the image name shorter',
          ], 2, 'Rebuilding picks up patched base layers, removing known vulnerabilities.'),
        ]
      ),
      lesson('Scanning Images and Running as Non-Root', 13, `
Containers in production face real attacks. Two practical defences go a long way: scanning images for known vulnerabilities before they are deployed, and running containers with the least privilege possible, starting with a non-root user.

### Vulnerability scanning

Scanners compare the packages in your image with databases of known vulnerabilities (CVEs):

| Tool | Notes |
|---|---|
| Docker Scout | Built into Docker Desktop and the CLI |
| Trivy | Popular open-source scanner, easy to use in CI |
| Grype | Open-source scanner from Anchore |
| Registry scanning | Many registries scan images on push |

\`\`\`bash
trivy image bazaar-api:1.1
docker scout cves bazaar-api:1.1
\`\`\`

Results list vulnerabilities by severity, the affected package and whether a fixed version exists.

### Acting on scan results

Not every finding requires immediate action. A practical approach:

\`\`\`text
1. Fix critical and high vulnerabilities that have fixes available,
   usually by updating the base image or dependency.
2. Check whether the vulnerable code is actually used or reachable.
3. Record accepted risks with a reason and review date.
4. Fail CI builds on new critical vulnerabilities with available fixes.
\`\`\`

Often, simply switching to a newer or smaller base image removes most findings at once.

### Why root inside containers is risky

By default, processes in many images run as root. Container isolation limits what root can do, but if an attacker exploits the application and a container misconfiguration or kernel vulnerability exists, root access makes escaping to the host much easier. Running as a non-root user removes a large class of risks.

### Running as a non-root user

Many official images include a non-root user, such as \`node\` in Node.js images. Otherwise, create one:

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --chown=appuser:appuser . .
RUN pip install --no-cache-dir -r requirements.txt
USER appuser
CMD ["python", "app.py"]
\`\`\`

\`COPY --chown\` gives the user ownership of the application files. Ports below 1024 require extra privileges, so non-root applications typically listen on ports such as 3000 or 8080, with the port mapping or Kubernetes Service handling port 80 or 443 externally.

### Further hardening at runtime

\`\`\`bash
docker run -d \\
  --read-only \\
  --tmpfs /tmp \\
  --cap-drop ALL \\
  --security-opt no-new-privileges \\
  -p 3000:3000 bazaar-api:1.1
\`\`\`

| Option | Effect |
|---|---|
| \`--read-only\` | The container filesystem cannot be modified |
| \`--tmpfs /tmp\` | Provides a writable temporary directory in memory |
| \`--cap-drop ALL\` | Removes Linux capabilities the app does not need |
| \`no-new-privileges\` | Prevents gaining extra privileges, for example through setuid binaries |

Never run containers with \`--privileged\` unless you fully understand why it is needed; it removes most isolation. Kubernetes applies the same ideas through security contexts, covered in chapter 11.

### Supply chain basics

Beyond scanning, teams increasingly sign images and generate software bills of materials (SBOMs), lists of every component in an image, so they can prove where images came from and quickly find affected images when a new vulnerability is announced.
      `,
        [
          q('What does an image vulnerability scanner do?', [
            'Removes all packages from an image',
            'Encrypts the image layers',
            'Compares image packages against databases of known vulnerabilities',
            'Speeds up image builds',
          ], 2, 'Scanners identify packages with known CVEs, their severity and available fixes.'),
          q('Why do non-root applications usually listen on ports like 8080?', [
            'Ports below 1024 need extra privileges',
            'Port 80 is blocked by Docker',
            'Non-root users cannot use networking',
            'Browsers only connect to port 8080',
          ], 0, 'Low ports are privileged, so non-root apps use higher ports and rely on mapping for external ports.'),
          q('What does --cap-drop ALL do?', [
            'Deletes all files in the container',
            'Removes all network access',
            'Stops all containers on the host',
            'Removes Linux capabilities the app does not need',
          ], 3, 'Dropping capabilities reduces what a compromised process could do.'),
        ]
      ),
      ],
      [
      q('Which Dockerfile order gives the best caching for a Node.js app?', [
        'Copy all code, then install dependencies',
        'Copy package files, install dependencies, then copy code',
        'Install dependencies after CMD',
        'Copy code twice for safety',
      ], 1, 'Installing dependencies before copying code lets code changes reuse the cached install layer.'),
      q('What does a multi-stage build for a React app typically ship?', [
        'Node.js, source code and the build tools',
        'Only the package.json file',
        'The built static files served by a web server like Nginx',
        'The TypeScript compiler',
      ], 2, 'Node.js builds the app in an earlier stage, and only static files are served in the final image.'),
      q('Which base image choice is safest for compatibility when starting out?', [
        'scratch',
        'A random image from an unknown account',
        'Alpine for every language',
        'An official slim image',
      ], 3, 'Official slim images balance size with broad glibc-based compatibility.'),
      q('Why should containers avoid running as root?', [
        'Root containers cannot open ports',
        'Root processes use more memory',
        'Docker does not allow root',
        'A compromise is much more dangerous with root privileges',
      ], 3, 'Least privilege limits what an attacker can do if the application is exploited.'),
      ]
    ),
    chapter(
      'Data, Networks and Docker Compose',
      'Keep data safe with volumes and bind mounts, connect containers through networks and built-in DNS, define multi-container applications with Docker Compose, and build fast local development workflows.',
      [
      lesson('Volumes and Bind Mounts', 13, `
Containers are disposable: remove one and its writable layer disappears. That is perfect for application code, which lives in images, but disastrous for data such as database files and uploaded images. Volumes and bind mounts store data outside the container's lifecycle.

### Three ways to store data

| Type | Where data lives | Best for |
|---|---|---|
| Named volume | A storage area managed by Docker | Database data, persistent application data |
| Bind mount | A specific folder on the host | Source code in development, config files |
| tmpfs mount | Host memory only | Temporary, sensitive or fast scratch data |

### Named volumes

\`\`\`bash
docker volume create pgdata

docker run -d --name db \\
  -e POSTGRES_PASSWORD=devpass \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16
\`\`\`

PostgreSQL stores its files in \`/var/lib/postgresql/data\` inside the container, which is now backed by the \`pgdata\` volume. Remove the container, start a new one with the same volume, and the data is still there.

\`\`\`bash
docker volume ls
docker volume inspect pgdata
docker volume rm pgdata      # deletes the data permanently
\`\`\`

Docker manages where volumes live on disk, which makes them portable and suitable for production data.

### Bind mounts

Bind mounts map a host folder into the container:

\`\`\`bash
docker run -d --name web \\
  -v "$(pwd)/site:/usr/share/nginx/html:ro" \\
  -p 8080:80 nginx:1.27
\`\`\`

Edit files in \`./site\` on your laptop and Nginx serves the changes immediately. The \`:ro\` suffix makes the mount read-only inside the container, a good default when the container only needs to read.

The longer \`--mount\` syntax is more explicit and is often clearer in scripts:

\`\`\`bash
--mount type=bind,source="$(pwd)/site",target=/usr/share/nginx/html,readonly
\`\`\`

### Choosing between them

| Question | Choose |
|---|---|
| Is it data that must survive container replacement? | Named volume |
| Do I need to edit files from the host during development? | Bind mount |
| Is it temporary or secret, and should never touch disk? | tmpfs |

Bind mounts depend on the host's folder structure and permissions, so they are less portable. In production, named volumes or external storage are usually preferred.

### Permissions

A common problem: a container running as a non-root user cannot write to a mounted folder owned by root. Solutions include setting correct ownership on the host folder, using named volumes that the image initialises with correct permissions, or matching user IDs. Check with \`ls -la\` inside the container when "permission denied" appears.

### Backing up data

Volumes survive container removal, but not disk failure or accidental deletion. For databases, use the database's own tools, which produce consistent backups:

\`\`\`bash
docker exec db pg_dump -U postgres bazaar > bazaar-backup.sql
\`\`\`

For other volumes, a temporary container can archive the data:

\`\`\`bash
docker run --rm -v uploads:/data -v "$(pwd)":/backup alpine \\
  tar czf /backup/uploads.tgz -C /data .
\`\`\`

Store backups off the machine, and test restoring them. A backup that has never been restored is only a hope.

### Data and scaling

When an application runs several containers, they should not write to the same local volume as if it were a shared database. Keep shared state in proper services, such as a database, object storage or a cache, and keep application containers stateless. This principle becomes essential in Kubernetes.
      `,
        [
          q('Which storage type suits PostgreSQL data that must survive container replacement?', [
            'The container\'s writable layer',
            'A named volume',
            'A tmpfs mount',
            'An environment variable',
          ], 1, 'Named volumes persist independently of containers and are managed by Docker.'),
          q('What is a bind mount especially useful for?', [
            'Storing production database files across servers',
            'Encrypting secrets in memory',
            'Sharing images between registries',
            'Editing source files on the host during development',
          ], 3, 'Bind mounts map host folders into containers, so changes on the host appear immediately.'),
          q('What is the most reliable way to back up a PostgreSQL container\'s data?', [
            'Copying the container\'s writable layer',
            'Taking a screenshot of the database',
            'Using the database\'s own dump tool, like pg_dump',
            'Removing the container and keeping the image',
          ], 2, 'Database dump tools produce consistent backups, unlike copying live data files.'),
        ]
      ),
      lesson('Docker Networks and Container DNS', 13, `
Real applications consist of several containers that must talk to each other: an API to a database, a worker to a queue, a web server to an API. Docker networks connect them securely and give each container a name other containers can use, much like a phone book.

### Network drivers

| Driver | Behaviour | Typical use |
|---|---|---|
| bridge (default) | Private network on the host; containers reach each other through it | Most single-host setups |
| user-defined bridge | Like bridge, plus automatic DNS by container name | Recommended for multi-container apps |
| host | Container shares the host's network directly (Linux) | Special performance cases |
| none | No networking | Isolated batch jobs |

### Why user-defined networks

On the default bridge network, containers cannot find each other by name. On a user-defined network, Docker provides built-in DNS:

\`\`\`bash
docker network create bazaar-net

docker run -d --name db --network bazaar-net \\
  -e POSTGRES_PASSWORD=devpass postgres:16

docker run -d --name api --network bazaar-net \\
  -e DATABASE_URL=postgres://postgres:devpass@db:5432/postgres \\
  -p 3000:3000 bazaar-api:1.1
\`\`\`

The API connects to host name \`db\`, and Docker resolves it to the database container's current IP address. If the database container is recreated with a new IP, the name still works.

### The localhost trap, again

Chapter 2 warned that \`localhost\` inside a container means the container itself. A very common mistake is configuring an API container with \`DATABASE_URL=postgres://...@localhost:5432/...\`. The API looks for a database inside its own container and fails with "connection refused". Use the other container's name, \`db\`, on a shared network.

### Publishing ports only where needed

Containers on the same network can reach each other on any port without \`-p\`. Publish ports only for services that must be reachable from outside, such as the API or a web front end. The database above has no \`-p\`, so it is reachable by the API but not from the host network or the internet.

\`\`\`text
Internet / host  -> port 3000 -> api container
api container    -> db:5432   -> db container   (internal only)
\`\`\`

This is a simple, effective security practice.

### Inspecting networks

\`\`\`bash
docker network ls
docker network inspect bazaar-net
docker exec -it api sh -c "getent hosts db"
\`\`\`

\`network inspect\` lists connected containers and their IP addresses. Testing name resolution from inside a container quickly confirms whether two containers share a network.

### Isolating groups of containers

You can create several networks to separate concerns. For example, a front-end network with the web server and API, and a back-end network with the API and database. The API joins both; the web server cannot reach the database directly. Kubernetes achieves similar isolation with network policies, covered in chapter 7.

### Reaching services on the host

Occasionally a container needs a service running directly on your laptop, such as a database you installed natively. Docker Desktop provides the special name \`host.docker.internal\` for this. On Linux, you can add it with \`--add-host=host.docker.internal:host-gateway\`. It is handy in development but should not appear in production configuration.
      `,
        [
          q('What does a user-defined bridge network add compared with the default bridge?', [
            'Automatic DNS resolution by container name',
            'Internet access for containers',
            'Encrypted storage for volumes',
            'Automatic image updates',
          ], 0, 'On user-defined networks, containers can reach each other using their names.'),
          q('An API container uses localhost:5432 to reach a database container and fails. What should it use?', [
            'The host\'s public IP address',
            '127.0.0.1:5432',
            'The image name postgres:16',
            'The database container\'s name on a shared network',
          ], 3, 'Containers on a shared network reach each other by name, since localhost refers to the container itself.'),
          q('Why not publish the database port with -p?', [
            'Databases are unable to listen on ports',
            'It exposes the database for no benefit',
            'The -p flag only works for web servers',
            'Publishing ports deletes the database volume',
          ], 1, 'Internal services should stay reachable only within the network, reducing exposure.'),
        ]
      ),
      lesson('Docker Compose for Multi-Container Apps', 14, `
Starting an API, a database and a cache with long \`docker run\` commands is tedious and easy to get wrong. Docker Compose describes the whole application in one YAML file and starts it with a single command. It is the standard way to run multi-container applications on a single machine, especially for development.

### A compose.yaml file

\`\`\`yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://bazaar:devpass@db:5432/bazaar
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: bazaar
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: bazaar
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bazaar"]
      interval: 5s
      timeout: 3s
      retries: 10

  cache:
    image: redis:7

volumes:
  pgdata:
\`\`\`

Compose automatically creates a network for the project, so \`api\`, \`db\` and \`cache\` can reach each other by service name. The top-level \`version\` field seen in older tutorials is no longer needed.

### Everyday Compose commands

| Command | Purpose |
|---|---|
| \`docker compose up -d\` | Build if needed and start everything in the background |
| \`docker compose ps\` | Show service status |
| \`docker compose logs -f api\` | Follow logs for one service |
| \`docker compose exec db psql -U bazaar\` | Run a command in a service |
| \`docker compose build\` | Rebuild images |
| \`docker compose restart api\` | Restart one service |
| \`docker compose down\` | Stop and remove containers and networks |
| \`docker compose down -v\` | Also remove volumes, deleting data |

Be careful with \`down -v\`: it deletes the database volume.

### Startup order and health checks

\`depends_on\` alone only controls start order, not readiness. A database container can be "started" several seconds before it accepts connections. With \`condition: service_healthy\` and a \`healthcheck\`, Compose waits until the database is actually ready before starting the API. Applications should still retry connections, because dependencies can restart at any time.

### Environment variables and .env

Compose reads a \`.env\` file in the project folder for variable substitution:

\`\`\`yaml
environment:
  DATABASE_URL: postgres://bazaar:\${DB_PASSWORD}@db:5432/bazaar
\`\`\`

\`\`\`text
# .env (not committed)
DB_PASSWORD=devpass
\`\`\`

Services can also load variables from a file with \`env_file:\`. Keep real secrets out of version control; commit a \`.env.example\` with placeholder values instead.

### Scaling a service

\`\`\`bash
docker compose up -d --scale worker=3
\`\`\`

This runs three worker containers, useful for testing background job processing. Services with a fixed published host port cannot scale this way, since only one container can bind that port.

### Compose in production?

Compose runs on a single host. It works well for small production deployments on one server, such as an internal tool or a small business application, combined with restart policies, backups and monitoring. For high availability across several servers, automatic failover and rolling updates, Kubernetes is the next step, starting in chapter 5.
      `,
        [
          q('How do services in the same compose.yaml reach each other?', [
            'By service name on the project network Compose creates',
            'Only through published host ports',
            'Through localhost inside each container',
            'They cannot communicate',
          ], 0, 'Compose creates a shared network where service names resolve through Docker DNS.'),
          q('Why use condition: service_healthy with a health check?', [
            'It makes the database start faster',
            'It removes the need for volumes',
            'The API waits until the database actually accepts connections',
            'It restarts the database every five seconds',
          ], 2, 'Health-based dependencies wait for real readiness, not just container start.'),
          q('What does docker compose down -v do that down does not?', [
            'Stops only one service',
            'Rebuilds all images',
            'Scales services to zero',
            'Removes volumes, deleting their data',
          ], 3, 'The -v flag also removes named volumes, so persistent data is lost.'),
        ]
      ),
      lesson('Compose for Development Workflows', 12, `
Compose is not only for running applications; it can make daily development fast and consistent. A good Compose setup lets a new developer clone the repository and have the whole stack running in minutes, with code changes appearing instantly.

### Live code changes

For development, mount source code into the container or use Compose Watch, which syncs files automatically:

\`\`\`yaml
services:
  api:
    build: .
    command: npm run dev
    ports:
      - "3000:3000"
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
\`\`\`

\`\`\`bash
docker compose watch
\`\`\`

Editing files in \`./src\` syncs them into the container, where a development server such as nodemon reloads. Changing \`package.json\` triggers a full rebuild. This avoids rebuilding images for every small code change.

### Override files for different environments

Compose automatically merges \`compose.override.yaml\` on top of \`compose.yaml\`. A common pattern:

\`\`\`text
compose.yaml            shared definition: services, images, networks
compose.override.yaml   development extras: bind mounts, debug ports, dev commands
compose.prod.yaml       production settings: restart policies, resource limits
\`\`\`

\`\`\`bash
docker compose up -d                                         # base + override
docker compose -f compose.yaml -f compose.prod.yaml up -d   # base + prod
\`\`\`

Use \`docker compose config\` to see the fully merged configuration, which is invaluable when overrides do not behave as expected.

### Optional services with profiles

Some services are only needed sometimes, such as an admin tool or a mail catcher:

\`\`\`yaml
services:
  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025"
    profiles: ["tools"]
\`\`\`

\`\`\`bash
docker compose --profile tools up -d
\`\`\`

Without the profile flag, \`mailpit\` does not start, keeping the default stack light.

### Seeding and resetting data

Development databases need sample data. Common approaches:

- Mount SQL scripts into \`/docker-entrypoint-initdb.d/\` for the official PostgreSQL image; they run once when the volume is first created.
- Run migrations and seed commands from the application: \`docker compose exec api npm run seed\`.
- Reset quickly with \`docker compose down -v && docker compose up -d\` when you need a clean slate.

### Onboarding in one command

A good project README can reduce setup to:

\`\`\`text
git clone https://github.com/mehranmart/bazaar.git
cd bazaar
cp .env.example .env
docker compose up -d
open http://localhost:3000
\`\`\`

Every developer runs the same versions of PostgreSQL, Redis and other services, eliminating "it works on my machine" within the team as well as between environments.

### Keep dev and prod close

Development setups inevitably differ from production, but keep them as close as practical: the same database engine and major version, the same environment variable names and the same image base. The closer they are, the fewer surprises appear after deployment. A classic example is developing against SQLite or an older PostgreSQL version, then discovering in production that a query or migration behaves differently. Matching versions in Compose costs nothing and avoids that whole class of problems.
      `,
        [
          q('What does Compose Watch with action: sync do?', [
            'Rebuilds the image on every change',
            'Deletes files that changed',
            'Copies changed files into the running container automatically',
            'Syncs images to a registry',
          ], 2, 'Sync updates files inside the container so a dev server can reload without rebuilding.'),
          q('What command shows the fully merged Compose configuration?', [
            'docker compose ps',
            'docker compose logs',
            'docker compose watch',
            'docker compose config',
          ], 3, 'docker compose config prints the final configuration after merging files and variables.'),
          q('What do Compose profiles allow?', [
            'Optional services that start only when their profile is enabled',
            'Different passwords for each developer',
            'Running Compose on several servers',
            'Automatic production deployment',
          ], 0, 'Services with a profile are excluded unless that profile is requested.'),
        ]
      ),
      ],
      [
      q('What happens to a named volume when its container is removed?', [
        'It is deleted with the container',
        'It becomes read-only',
        'It remains, keeping its data',
        'It is uploaded to a registry',
      ], 2, 'Named volumes have their own lifecycle and persist until explicitly removed.'),
      q('Which setup lets an API reach a database while keeping the database off the host network?', [
        'Publishing the database port to 0.0.0.0',
        'Both on a user-defined network, with no published database port',
        'Running the database with --network none',
        'Using localhost in the API\'s connection string',
      ], 1, 'A shared network allows internal access, and not publishing the port keeps the database private.'),
      q('Why should applications still retry connections even with Compose health checks?', [
        'Health checks are ignored by Compose',
        'Retrying makes images smaller',
        'Compose cannot start databases',
        'Dependencies can restart at any time',
      ], 3, 'Services may become temporarily unavailable, so resilient apps retry rather than crash.'),
      q('When is it time to move beyond Compose to Kubernetes?', [
        'When the app has two containers',
        'When using a database',
        'When you need high availability and rolling updates across several servers',
        'When developers use Windows laptops',
      ], 2, 'Compose runs on one host, while Kubernetes manages multiple servers, failover and rollouts.'),
      ]
    ),
    chapter(
      'Kubernetes Architecture and kubectl',
      'Understand why container orchestration exists, learn the parts of a Kubernetes cluster and how they cooperate, create a local cluster with kind or minikube, and work confidently with kubectl and YAML manifests.',
      [
      lesson('Why Orchestration Is Needed', 13, `
Docker and Compose work well on one machine. But real services need more: they must survive machine failures, handle traffic spikes, update without downtime and run across many servers. Doing all this by hand, or with scripts, quickly becomes unmanageable. Container orchestrators automate it, and Kubernetes has become the industry standard.

### Problems at scale

Imagine Bazaar, the Karachi grocery delivery startup, growing fast. During Ramadan evenings, orders spike tenfold. Their API runs in containers on three servers:

| Problem | Without orchestration |
|---|---|
| A server fails at 2 a.m. | Containers on it are gone until someone wakes up |
| Traffic spikes | Someone manually starts more containers and updates the load balancer |
| A new version is released | Stop old containers, start new ones, hope nothing breaks |
| A container crashes | It stays down unless a restart policy catches it |
| Which server has spare capacity? | Someone checks each one |

### What an orchestrator does

| Capability | Meaning |
|---|---|
| Scheduling | Places containers on servers with enough resources |
| Self-healing | Restarts failed containers and replaces them if a server dies |
| Scaling | Runs more or fewer copies based on demand |
| Service discovery and load balancing | Gives groups of containers a stable address and spreads traffic |
| Rolling updates and rollbacks | Replaces versions gradually, and reverts if something goes wrong |
| Configuration and secrets | Supplies settings and credentials to containers |
| Storage orchestration | Attaches persistent storage where needed |

### The declarative model

The key idea in Kubernetes is declaring the desired state rather than issuing commands step by step:

\`\`\`text
Imperative: "Start 3 containers of bazaar-api version 1.4 on servers A, B and C."
Declarative: "There should always be 3 replicas of bazaar-api:1.4 running."
\`\`\`

You describe the desired state in YAML files. Kubernetes continuously compares the actual state with the desired state and acts to close any gap. If a container dies, the actual count drops to 2, and Kubernetes starts another. This constant reconciliation is what makes Kubernetes self-healing.

### Kubernetes in brief

Kubernetes, often shortened to K8s, was originally designed at Google, drawing on its experience running containers at huge scale, and was open-sourced in 2014. It is now maintained under the Cloud Native Computing Foundation (CNCF) and supported by every major cloud provider as a managed service.

### Is Kubernetes always the answer?

No. Kubernetes adds complexity: new concepts, YAML, networking and operations. For a single small application, a managed container platform, a Platform-as-a-Service or Docker Compose on one server may be simpler and cheaper. Kubernetes shines when you have several services, need high availability, scale up and down frequently, or want a consistent platform for many teams. A good engineer can explain both when to use it and when not to.

### What you will build

Over the next chapters you will deploy Bazaar's API and database to Kubernetes, expose it to users, configure it, make it resilient and scalable, package it with Helm, secure it and learn to troubleshoot it. The skills map directly to real jobs and to the CKAD certification discussed in chapter 12.
      `,
        [
          q('What does self-healing mean in Kubernetes?', [
            'Code bugs are fixed automatically',
            'Failed containers are restarted or replaced to match the desired state',
            'Servers repair their own hardware',
            'Images update themselves every day',
          ], 1, 'Kubernetes continuously reconciles actual state with desired state, replacing failed containers.'),
          q('What is the declarative model?', [
            'Typing every command by hand in order',
            'Writing shell scripts for each deployment',
            'Letting developers log into every server',
            'Describing the desired state and letting Kubernetes achieve it',
          ], 3, 'You declare what should exist, and controllers work continuously to make reality match.'),
          q('When might Kubernetes be unnecessary?', [
            'For systems with many services and teams',
            'When high availability is critical',
            'For a single small application that a simpler platform can run',
            'When traffic changes frequently',
          ], 2, 'Kubernetes adds complexity that small single applications may not need.'),
        ]
      ),
      lesson('The Control Plane and Worker Nodes', 13, `
A Kubernetes cluster has two kinds of machines: the control plane, which makes decisions, and worker nodes, which run your containers. Knowing what each component does explains how Kubernetes behaves and makes troubleshooting far easier.

### The big picture

\`\`\`text
                Control plane
  +------------------------------------------+
  | kube-apiserver  <->  etcd                |
  | kube-scheduler                           |
  | kube-controller-manager                  |
  | cloud-controller-manager (in clouds)     |
  +------------------------------------------+
            ^            ^            ^
   Worker node 1   Worker node 2   Worker node 3
   kubelet         kubelet         kubelet
   kube-proxy      kube-proxy      kube-proxy
   container       container       container
   runtime         runtime         runtime
   [pods]          [pods]          [pods]
\`\`\`

### Control plane components

| Component | Role |
|---|---|
| kube-apiserver | The front door. Every action, from kubectl and from other components, goes through its API |
| etcd | A distributed key-value store holding the cluster's entire state |
| kube-scheduler | Chooses which node each new pod should run on, based on resources and rules |
| kube-controller-manager | Runs controllers that reconcile desired and actual state, such as keeping the right number of replicas |
| cloud-controller-manager | Integrates with cloud providers, for example to create load balancers |

Everything goes through the API server. Components do not talk to etcd directly, except the API server itself. This design makes Kubernetes consistent and extensible.

### Worker node components

| Component | Role |
|---|---|
| kubelet | An agent on each node that ensures the containers described in pods are running and healthy |
| Container runtime | Actually runs containers, commonly containerd or CRI-O |
| kube-proxy | Maintains network rules so Services route traffic to the right pods; some clusters replace it with alternatives |

Kubernetes no longer uses Docker Engine as its runtime on nodes, but images built with Docker follow the OCI standard and run perfectly on containerd. Your Docker skills carry over completely.

### What happens when you create a deployment

\`\`\`text
1. kubectl sends the deployment YAML to the API server.
2. The API server validates it and stores it in etcd.
3. The deployment controller notices and creates a ReplicaSet,
   which creates pod objects.
4. The scheduler assigns each pending pod to a suitable node.
5. The kubelet on that node sees the assignment, asks the container
   runtime to pull the image and start the containers.
6. The kubelet reports status back through the API server.
\`\`\`

Each component watches the API server for changes and does its own part. No single component does everything.

### Managed control planes

On managed services such as Amazon EKS, Azure AKS and Google GKE, the cloud provider runs and maintains the control plane for you, including etcd backups and upgrades. You manage worker nodes, or even let the provider manage those too. Most companies use managed Kubernetes rather than running the control plane themselves.

### High availability

Production control planes run several replicas of the API server and etcd across failure zones, so the cluster keeps working if one machine fails. Worker nodes are spread across zones too. If a node fails, the controllers notice and recreate its pods elsewhere.

### Why this matters for troubleshooting

When something goes wrong, the architecture tells you where to look. A pod stuck in \`Pending\` is usually a scheduling problem; a pod in \`ImagePullBackOff\` is a node pulling an image; a pod that keeps restarting is a container problem the kubelet is reporting. Chapter 11 turns this into a systematic troubleshooting method.
      `,
        [
          q('Which component stores the cluster\'s entire state?', [
            'kubelet',
            'kube-proxy',
            'etcd',
            'The container runtime',
          ], 2, 'etcd is the key-value store holding all cluster data, accessed through the API server.'),
          q('What does the kube-scheduler do?', [
            'Runs containers on the node',
            'Stores configuration data',
            'Routes Service traffic',
            'Decides which node each new pod runs on',
          ], 3, 'The scheduler assigns pending pods to nodes based on resources and constraints.'),
          q('Do images built with Docker run on clusters using containerd?', [
            'Yes, because images follow the OCI standard',
            'No, they must be rebuilt with a special tool',
            'Only if the cluster has Docker Desktop installed',
            'Only on managed Kubernetes',
          ], 0, 'OCI-compliant images run on any compliant runtime, including containerd.'),
        ]
      ),
      lesson('A Local Cluster With kind or minikube', 12, `
You do not need a cloud account to learn Kubernetes. Tools such as kind and minikube run a real Kubernetes cluster on your laptop, free, in minutes. A local cluster is ideal for learning, testing manifests and practising for certification.

### Options for local clusters

| Tool | How it works | Notes |
|---|---|---|
| kind | Kubernetes nodes run as Docker containers | Fast, lightweight, popular in CI and learning |
| minikube | Runs a cluster in a VM or container | Many add-ons, such as ingress and metrics |
| k3d | Runs k3s, a lightweight Kubernetes, in Docker | Very fast startup |
| Docker Desktop | Built-in single-node Kubernetes | Convenient if you already use Docker Desktop |

All give you a real Kubernetes API, so manifests and kubectl commands work the same as on a production cluster.

### Installing kubectl

\`kubectl\` is the command-line tool for talking to any cluster. Install it from the official Kubernetes documentation or a package manager, then check:

\`\`\`bash
kubectl version --client
\`\`\`

### Creating a cluster with kind

\`\`\`bash
kind create cluster --name dev
kubectl cluster-info --context kind-dev
kubectl get nodes
\`\`\`

\`\`\`text
NAME                STATUS   ROLES           AGE   VERSION
dev-control-plane   Ready    control-plane   40s   v1.x.x
\`\`\`

A multi-node cluster needs a small config file:

\`\`\`yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
\`\`\`

\`\`\`bash
kind create cluster --name dev --config kind-3-nodes.yaml
\`\`\`

Delete it when finished: \`kind delete cluster --name dev\`.

### Creating a cluster with minikube

\`\`\`bash
minikube start
minikube addons enable ingress
minikube addons enable metrics-server
minikube dashboard
\`\`\`

minikube's add-ons make it easy to try features like ingress and autoscaling, which need extra components.

### Loading local images

A local cluster cannot automatically see images you built with Docker, because the cluster nodes have their own image stores. Load them explicitly:

\`\`\`bash
docker build -t bazaar-api:dev .
kind load docker-image bazaar-api:dev --name dev
# or with minikube:
minikube image load bazaar-api:dev
\`\`\`

Then reference \`bazaar-api:dev\` in your manifests with \`imagePullPolicy: IfNotPresent\`.

### Contexts: which cluster am I talking to?

kubectl can manage several clusters. Connection details are stored in a kubeconfig file, usually \`~/.kube/config\`, with named contexts:

\`\`\`bash
kubectl config get-contexts
kubectl config use-context kind-dev
kubectl config current-context
\`\`\`

Always check your current context before running commands that change things. Many serious incidents started with someone deleting resources in production while believing they were connected to a test cluster. Tools that show the current context in your shell prompt help prevent this.

### Resource use

A local cluster uses memory and CPU. With 8 GB of RAM, a single-node kind or minikube cluster is comfortable; with 16 GB, multi-node clusters and several applications run well. Stop or delete clusters you are not using.
      `,
        [
          q('How does kind run Kubernetes nodes?', [
            'As full virtual machines in the cloud',
            'Directly on bare-metal servers only',
            'As Docker containers on your machine',
            'Inside the web browser',
          ], 2, 'kind, short for Kubernetes in Docker, runs each node as a container.'),
          q('Why must you load locally built images into a kind cluster?', [
            'kind cannot run any images',
            'Images must be converted to a new format',
            'kind only runs images from Docker Hub',
            'The cluster nodes have their own image stores',
          ], 3, 'Node containers do not share your Docker image cache, so images must be loaded into them.'),
          q('Why check the current kubectl context before making changes?', [
            'To avoid accidentally changing the wrong cluster, such as production',
            'Contexts expire every hour',
            'kubectl refuses commands without checking',
            'It makes commands run faster',
          ], 0, 'Running commands against the wrong cluster is a common cause of serious incidents.'),
        ]
      ),
      lesson('kubectl Essentials and YAML Manifests', 14, `
Almost everything in Kubernetes is done through \`kubectl\` and YAML manifests. Learning the core commands and the structure of a manifest gives you a toolkit you will use every day, and speed with kubectl matters greatly in the CKAD exam.

### The structure of every manifest

Every Kubernetes object has four top-level fields:

\`\`\`yaml
apiVersion: apps/v1          # which API group and version
kind: Deployment             # what type of object
metadata:                    # name, namespace, labels
  name: bazaar-api
  labels:
    app: bazaar-api
spec:                        # the desired state
  replicas: 2
  selector:
    matchLabels:
      app: bazaar-api
  template:
    metadata:
      labels:
        app: bazaar-api
    spec:
      containers:
        - name: api
          image: bazaar-api:dev
          ports:
            - containerPort: 3000
\`\`\`

When you apply it, Kubernetes adds a \`status\` section describing the actual state.

### Core commands

| Task | Command |
|---|---|
| Create or update from files | \`kubectl apply -f deployment.yaml\` |
| List objects | \`kubectl get pods\`, \`kubectl get deploy,svc\` |
| More detail in lists | \`kubectl get pods -o wide\` |
| Full object as YAML | \`kubectl get deploy bazaar-api -o yaml\` |
| Detailed description and events | \`kubectl describe pod <name>\` |
| Container logs | \`kubectl logs <pod>\`, \`kubectl logs -f deploy/bazaar-api\` |
| Run a command in a container | \`kubectl exec -it <pod> -- sh\` |
| Delete | \`kubectl delete -f deployment.yaml\` |
| Documentation for fields | \`kubectl explain deployment.spec.template.spec.containers\` |
| List resource types | \`kubectl api-resources\` |

\`kubectl explain\` is especially useful: it documents any field without leaving the terminal, and it is allowed in the CKAD exam environment.

### Generating YAML quickly

Writing YAML from memory is slow and error-prone. Let kubectl generate a starting point:

\`\`\`bash
kubectl create deployment bazaar-api --image=bazaar-api:dev --replicas=2 \\
  --dry-run=client -o yaml > deployment.yaml
\`\`\`

\`--dry-run=client -o yaml\` prints the manifest without creating anything. Edit the file, then \`kubectl apply -f\`. This technique saves a great deal of time.

### Labels and selectors

Labels are key-value pairs attached to objects; selectors find objects by label. They connect everything in Kubernetes:

\`\`\`bash
kubectl get pods -l app=bazaar-api
kubectl get pods --show-labels
\`\`\`

A Deployment finds its pods by labels; a Service sends traffic to pods by labels. Consistent labelling, such as \`app\`, \`component\` and \`environment\`, keeps clusters understandable.

### apply versus create

\`kubectl create\` fails if the object already exists; \`kubectl apply\` creates or updates it to match the file. For declarative management with files stored in Git, use \`apply\`. Many teams go further with GitOps tools that apply changes from Git automatically.

### Productivity tips

\`\`\`bash
alias k=kubectl
source <(kubectl completion bash)     # or zsh
k get po -A                            # pods in all namespaces
k get events --sort-by=.lastTimestamp
\`\`\`

Short names such as \`po\` for pods, \`deploy\` for deployments and \`svc\` for services save keystrokes. Tab completion prevents typos in long pod names. These habits pay off daily and are essential under exam time pressure.

### Namespaces in brief

Namespaces divide a cluster into virtual sections, such as \`dev\`, \`staging\` or per team. Most commands accept \`-n <namespace>\`; without it, the \`default\` namespace is used. Chapter 9 covers namespaces with quotas and limits.
      `,
        [
          q('Which four top-level fields does every Kubernetes manifest have?', [
            'name, image, port and replicas',
            'apiVersion, kind, metadata and spec',
            'version, type, labels and status',
            'cluster, node, pod and container',
          ], 1, 'Every object declares its API version, kind, metadata and desired state in spec.'),
          q('What does --dry-run=client -o yaml do?', [
            'Deletes the object after printing it',
            'Applies the object to every namespace',
            'Runs the container once and exits',
            'Prints the generated manifest without creating anything',
          ], 3, 'It produces YAML you can save and edit, speeding up manifest writing.'),
          q('How does a Deployment find the pods it manages?', [
            'By their creation time',
            'By their IP addresses',
            'Through label selectors',
            'By the node they run on',
          ], 2, 'Selectors match pod labels, linking controllers and Services to the right pods.'),
        ]
      ),
      ],
      [
      q('What is the main job of the kube-apiserver?', [
        'Serving the API that every client and component uses',
        'Running containers on nodes',
        'Storing container images',
        'Building Docker images',
      ], 0, 'All reads and writes of cluster state pass through the API server.'),
      q('Which component on each node ensures pod containers are running?', [
        'etcd',
        'kube-scheduler',
        'cloud-controller-manager',
        'kubelet',
      ], 3, 'The kubelet works with the container runtime to run and monitor pod containers.'),
      q('Which command documents a resource\'s fields from the terminal?', [
        'kubectl describe',
        'kubectl logs',
        'kubectl explain',
        'kubectl get events',
      ], 2, 'kubectl explain shows field documentation, useful when writing manifests.'),
      q('What is the difference between kubectl create and kubectl apply?', [
        'They are identical',
        'apply only works on pods',
        'create updates existing objects; apply fails if they exist',
        'create fails if the object exists; apply creates or updates it',
      ], 3, 'apply supports declarative management by reconciling objects with files.'),
      ]
    ),
    chapter(
      'Running Workloads',
      'Understand pods and their lifecycle, run resilient applications with Deployments and ReplicaSets, ship new versions with rolling updates and roll back safely, and run batch and per-node work with Jobs, CronJobs and DaemonSets.',
      [
      lesson('Pods and Their Lifecycle', 13, `
The pod is the smallest unit Kubernetes runs. Every container in Kubernetes runs inside a pod, so understanding pods, how they start, run, fail and stop, is the foundation for everything else. In practice you rarely create pods directly, but you constantly read their status.

### What a pod is

A pod is a group of one or more containers that:

- Share a network namespace: the same IP address and ports, reaching each other on \`localhost\`.
- Can share storage volumes.
- Are scheduled together onto the same node.

Most pods run a single application container. Additional containers are used for closely coupled helpers.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: bazaar-api
  labels:
    app: bazaar-api
spec:
  containers:
    - name: api
      image: bazaar-api:dev
      ports:
        - containerPort: 3000
\`\`\`

\`\`\`bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod bazaar-api
\`\`\`

### Pods are ephemeral

Pods are not repaired; they are replaced. If a node fails, its pods are gone, and a controller such as a Deployment creates new pods, with new names and new IP addresses, elsewhere. That is why applications should never depend on a specific pod's IP, and why Services (chapter 7) provide stable addresses.

### Pod phases

| Phase | Meaning |
|---|---|
| Pending | Accepted, but not yet running: waiting for scheduling or image download |
| Running | Bound to a node, and at least one container is running |
| Succeeded | All containers finished successfully and will not restart |
| Failed | All containers terminated, at least one with failure |
| Unknown | The node cannot be contacted |

### Container states and common reasons

\`kubectl get pods\` often shows a reason instead of a phase:

| Status | Meaning |
|---|---|
| ContainerCreating | Pulling the image or setting up volumes |
| ImagePullBackOff / ErrImagePull | Cannot pull the image: wrong name, tag or missing credentials |
| CrashLoopBackOff | The container keeps crashing; Kubernetes waits longer between restarts |
| OOMKilled | The container exceeded its memory limit |
| Completed | The container finished, normal for jobs |

### Restart policies

\`restartPolicy\` controls what happens when containers exit: \`Always\` (the default, for long-running services), \`OnFailure\` and \`Never\` (common for jobs).

### Init containers and helpers

Init containers run to completion before the main containers start, useful for waiting on a dependency or preparing files:

\`\`\`yaml
spec:
  initContainers:
    - name: wait-for-db
      image: busybox:1.36
      command: ["sh", "-c", "until nc -z db 5432; do sleep 2; done"]
  containers:
    - name: api
      image: bazaar-api:dev
\`\`\`

Helper containers running alongside the main one, called sidecars, are used for tasks like log shipping or proxies. Recent Kubernetes versions support native sidecar containers that start before and stop after the main container.

### Graceful termination

When a pod is deleted, Kubernetes sends SIGTERM to its containers, waits for the grace period (30 seconds by default), then sends SIGKILL. Applications should handle SIGTERM by finishing in-flight requests and closing connections, the same principle as with \`docker stop\` in chapter 2.

### Why not create pods directly?

A standalone pod is not recreated if it is deleted or its node fails. In practice you create pods through controllers, Deployments, Jobs, StatefulSets and DaemonSets, which the rest of this chapter covers.
      `,
        [
          q('What do containers in the same pod share?', [
            'A network namespace and IP address',
            'The same container image',
            'Their host operating system files',
            'A separate node each',
          ], 0, 'Containers in a pod share networking, reaching each other on localhost, and can share volumes.'),
          q('What does CrashLoopBackOff mean?', [
            'The image cannot be pulled',
            'The pod is waiting for scheduling',
            'The job completed successfully',
            'The container keeps crashing and restarts are being delayed',
          ], 3, 'Kubernetes backs off between restarts of a container that repeatedly fails.'),
          q('Why should applications not depend on a pod\'s IP address?', [
            'Pods do not have IP addresses',
            'IP addresses are secret',
            'Pods are replaced with new names and IPs',
            'Only nodes can be addressed',
          ], 2, 'Pods are ephemeral, so stable access goes through Services rather than pod IPs.'),
        ]
      ),
      lesson('Deployments and ReplicaSets', 13, `
Deployments are the standard way to run stateless applications such as web APIs and front ends. You declare how many replicas you want and which image to run; Kubernetes keeps that many pods running and manages updates. Most workloads you deploy will be Deployments.

### The hierarchy

\`\`\`text
Deployment   (you manage this)
  ReplicaSet (created and managed by the Deployment)
    Pod
    Pod
    Pod
\`\`\`

A ReplicaSet ensures a set number of identical pods run. A Deployment manages ReplicaSets, creating a new one for each new version, which enables rolling updates and rollbacks. You work with Deployments and rarely touch ReplicaSets directly.

### A Deployment for Bazaar's API

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bazaar-api
  labels:
    app: bazaar-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bazaar-api
  template:
    metadata:
      labels:
        app: bazaar-api
    spec:
      containers:
        - name: api
          image: ghcr.io/mehranmart/bazaar-api:1.4.0
          ports:
            - containerPort: 3000
          env:
            - name: PORT
              value: "3000"
\`\`\`

The \`selector.matchLabels\` must match the labels in \`template.metadata.labels\`. The template is a pod template: every pod created from it gets these labels and this container specification.

\`\`\`bash
kubectl apply -f deployment.yaml
kubectl get deploy,rs,pods -l app=bazaar-api
\`\`\`

### Self-healing in action

\`\`\`bash
kubectl delete pod <one-of-the-pods>
kubectl get pods -l app=bazaar-api -w
\`\`\`

Within seconds, the ReplicaSet notices only two pods exist and creates a replacement. If a node fails, pods on it are recreated on other nodes. This is the reconciliation loop from chapter 5, working for you.

### Scaling

\`\`\`bash
kubectl scale deployment bazaar-api --replicas=6
\`\`\`

Or change \`replicas\` in the YAML and apply it again, which keeps Git as the source of truth. Chapter 9 shows how the Horizontal Pod Autoscaler changes replicas automatically based on load.

### Spreading replicas

Three replicas on the same node offer little protection if that node fails. Kubernetes' scheduler tries to spread pods, and you can require it with topology spread constraints or pod anti-affinity, placing replicas across nodes or availability zones. For important services, spreading across zones is standard practice in production.

### Deployments suit stateless apps

Deployments treat pods as interchangeable: any pod can be replaced at any time. That suits web APIs, front ends and workers that keep state in databases or caches. Databases and other stateful systems that need stable identities and storage use StatefulSets instead, covered in chapter 8.

### Useful commands

\`\`\`bash
kubectl get deploy bazaar-api -o wide
kubectl describe deploy bazaar-api
kubectl logs deploy/bazaar-api            # logs from one pod of the deployment
kubectl rollout restart deploy/bazaar-api  # restart all pods gradually
\`\`\`

\`rollout restart\` is handy when configuration has changed, such as an updated ConfigMap, and pods need to restart to pick it up. It replaces pods gradually using the same rolling update process as a new release, so the service stays available throughout.
      `,
        [
          q('What does a Deployment manage directly?', [
            'Nodes',
            'Services',
            'ReplicaSets, which manage pods',
            'etcd entries only',
          ], 2, 'Deployments create and manage ReplicaSets, one per version, which in turn keep pods running.'),
          q('What must a Deployment\'s selector match?', [
            'The labels in its pod template',
            'The node\'s hostname',
            'The container image name',
            'The namespace name',
          ], 0, 'The selector identifies the pods the Deployment owns through the template\'s labels.'),
          q('Why spread replicas across nodes or zones?', [
            'It makes images smaller',
            'Kubernetes requires it for every Deployment',
            'It removes the need for Services',
            'So one node or zone failure does not take down all replicas',
          ], 3, 'Spreading replicas protects availability when a node or zone fails.'),
        ]
      ),
      lesson('Rolling Updates and Rollbacks', 13, `
Releasing a new version should not mean downtime. Deployments replace old pods with new ones gradually, checking that new pods are ready before removing old ones. If the new version misbehaves, rolling back takes a single command.

### Updating the image

\`\`\`bash
kubectl set image deployment/bazaar-api api=ghcr.io/mehranmart/bazaar-api:1.5.0
kubectl rollout status deployment/bazaar-api
\`\`\`

Or, preferably, update the image tag in the YAML stored in Git and apply it. The Deployment creates a new ReplicaSet for version 1.5.0 and shifts pods over gradually.

### How a rolling update proceeds

\`\`\`text
Start:   v1.4 x3
Step 1:  v1.4 x3, v1.5 x1 (starting)
Step 2:  v1.5 x1 ready -> v1.4 x2
Step 3:  v1.4 x2, v1.5 x2 ...
End:     v1.5 x3, old ReplicaSet scaled to 0 (kept for rollback)
\`\`\`

### Controlling the pace

\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # at most 1 extra pod above the desired count
      maxUnavailable: 0    # never go below the desired count
\`\`\`

| Setting | Meaning |
|---|---|
| \`maxSurge\` | How many pods above \`replicas\` may exist during the update |
| \`maxUnavailable\` | How many pods below \`replicas\` may be unavailable |

\`maxUnavailable: 0\` with \`maxSurge: 1\` keeps full capacity throughout, at the cost of needing room for one extra pod. Both default to 25%.

The alternative strategy, \`Recreate\`, stops all old pods before starting new ones. It causes downtime, but is sometimes needed when two versions cannot run at the same time.

### Readiness decides the pace

Kubernetes only considers a new pod "ready" when its readiness probe passes (chapter 9). Without a readiness probe, a pod is ready as soon as its container starts, even if the application is still loading. That can send traffic to pods that cannot serve it yet. Readiness probes are what make rolling updates truly safe.

### Rolling back

\`\`\`bash
kubectl rollout history deployment/bazaar-api
kubectl rollout undo deployment/bazaar-api
kubectl rollout undo deployment/bazaar-api --to-revision=3
\`\`\`

Rollback scales the previous ReplicaSet back up, usually within seconds, since its configuration is still stored. Deployments keep ten old ReplicaSets by default (\`revisionHistoryLimit\`).

To make history readable, record why each change was made:

\`\`\`bash
kubectl annotate deployment/bazaar-api kubernetes.io/change-cause="Release 1.5.0: new checkout flow"
\`\`\`

### Pausing a rollout

If you notice problems mid-rollout, pause it to investigate without rolling everything forward or back:

\`\`\`bash
kubectl rollout pause deployment/bazaar-api
kubectl rollout resume deployment/bazaar-api
\`\`\`

### Safer release strategies

Rolling updates send traffic to new pods as soon as they are ready. For more caution, teams use canary releases, sending a small percentage of traffic to the new version first, or blue-green deployments, switching all traffic at once between two complete environments. These typically use additional tools such as service meshes or progressive delivery controllers built on Kubernetes.

### Rollback is not a database undo

Rolling back the application does not roll back database migrations. Design migrations to be backward compatible, so both the old and new application versions can run against the same schema during and after a rollout.
      `,
        [
          q('What does maxUnavailable: 0 with maxSurge: 1 achieve?', [
            'All pods stop before new ones start',
            'Full capacity is kept by adding one new pod before removing an old one',
            'Two versions never run at the same time',
            'The update happens instantly',
          ], 1, 'New pods are added first, so the desired count is never reduced during the update.'),
          q('Why are readiness probes important for rolling updates?', [
            'They make images download faster',
            'They delete old ReplicaSets',
            'They restart crashed containers',
            'Traffic and rollout progress wait until new pods can actually serve',
          ], 3, 'Without readiness checks, pods may receive traffic before the application has finished starting.'),
          q('What does kubectl rollout undo do?', [
            'Deletes the Deployment',
            'Reverts database migrations',
            'Scales the previous ReplicaSet back up',
            'Rebuilds the previous image',
          ], 2, 'Rollback reactivates the stored previous ReplicaSet, restoring the earlier version quickly.'),
        ]
      ),
      lesson('Jobs, CronJobs and DaemonSets', 12, `
Not every workload is a web server that runs forever. Some tasks run once and finish, some run on a schedule, and some must run on every node. Kubernetes provides Jobs, CronJobs and DaemonSets for these patterns.

### Jobs: run to completion

A Job runs pods until a task completes successfully:

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: import-products
spec:
  backoffLimit: 3
  activeDeadlineSeconds: 600
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      restartPolicy: OnFailure
      containers:
        - name: importer
          image: ghcr.io/mehranmart/bazaar-tools:1.2.0
          command: ["node", "scripts/import-products.js"]
\`\`\`

| Field | Meaning |
|---|---|
| \`backoffLimit\` | Retries before marking the Job failed |
| \`activeDeadlineSeconds\` | Maximum total run time |
| \`ttlSecondsAfterFinished\` | Clean up the finished Job automatically after this time |
| \`completions\` and \`parallelism\` | Run a task several times, several at once |

Jobs suit database migrations, data imports, report generation and one-off maintenance tasks.

### CronJobs: scheduled Jobs

A CronJob creates Jobs on a schedule, using cron syntax:

\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-report
spec:
  schedule: "0 2 * * *"          # 02:00 every day
  timeZone: "Asia/Karachi"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: report
              image: ghcr.io/mehranmart/bazaar-tools:1.2.0
              command: ["node", "scripts/daily-sales-report.js"]
\`\`\`

\`\`\`text
Cron fields: minute hour day-of-month month day-of-week
"0 2 * * *"     02:00 every day
"*/15 * * * *"  every 15 minutes
"0 9 * * 1"     09:00 every Monday
\`\`\`

\`concurrencyPolicy: Forbid\` skips a run if the previous one is still going, preventing overlapping reports. Without \`timeZone\`, schedules use the cluster's time zone, often UTC, a frequent source of reports running five hours off for Pakistani teams.

Trigger a CronJob manually for testing:

\`\`\`bash
kubectl create job --from=cronjob/nightly-report test-run
\`\`\`

### Making jobs safe to retry

Jobs may run more than once, after failures or retries. Design them to be idempotent: running twice should not create duplicate records or send duplicate emails. For example, check whether today's report already exists before generating it.

### DaemonSets: one pod per node

A DaemonSet ensures a pod runs on every node, or on selected nodes:

| Typical use | Example |
|---|---|
| Log collection | An agent that ships container logs from each node |
| Monitoring | A node metrics exporter |
| Networking and storage | Network plugins and storage drivers |

When a new node joins the cluster, the DaemonSet automatically starts a pod on it. Application developers rarely write DaemonSets, but platform engineers use them constantly, and they appear in exam questions.

### Choosing the right controller

| Workload | Controller |
|---|---|
| Stateless, long-running service | Deployment |
| Stateful service with stable identity | StatefulSet |
| One-off task to completion | Job |
| Scheduled task | CronJob |
| Agent on every node | DaemonSet |
      `,
        [
          q('Which controller suits a nightly sales report?', [
            'Deployment',
            'DaemonSet',
            'CronJob',
            'StatefulSet',
          ], 2, 'CronJobs create Jobs on a schedule, ideal for recurring tasks like nightly reports.'),
          q('Why set timeZone on a CronJob for a Pakistani team?', [
            'Kubernetes rejects schedules without it',
            'Otherwise schedules use the cluster\'s zone, often UTC',
            'It makes the job run faster',
            'It limits how many jobs can run',
          ], 1, 'Without an explicit time zone, a 02:00 schedule may run at 02:00 UTC, which is 07:00 in Pakistan.'),
          q('Why should jobs be idempotent?', [
            'Kubernetes never retries jobs',
            'Idempotent jobs use less memory',
            'It removes the need for images',
            'Jobs can run more than once, and repeats must not cause duplicates',
          ], 3, 'Retries and restarts can repeat work, so jobs must be safe to run again.'),
        ]
      ),
      ],
      [
      q('What happens when a pod managed by a Deployment is deleted?', [
        'The Deployment is deleted too',
        'Nothing, the pod stays deleted',
        'The ReplicaSet creates a replacement pod',
        'The node restarts',
      ], 2, 'Controllers reconcile to the desired replica count, recreating missing pods.'),
      q('A pod shows ImagePullBackOff. What is the likely cause?', [
        'The container exceeded its memory limit',
        'The job completed',
        'The image name, tag or registry credentials are wrong',
        'The readiness probe failed',
      ], 2, 'The node cannot pull the image, usually due to a typo, missing tag or missing pull secret.'),
      q('Which strategy causes downtime but ensures two versions never run together?', [
        'Recreate',
        'RollingUpdate with maxSurge 1',
        'Canary',
        'DaemonSet',
      ], 0, 'Recreate stops all old pods before starting new ones, avoiding overlap at the cost of downtime.'),
      q('Which controller runs a log collection agent on every node?', [
        'Job',
        'CronJob',
        'Deployment',
        'DaemonSet',
      ], 3, 'DaemonSets place one pod per node, ideal for node-level agents.'),
      ]
    ),
    chapter(
      'Networking in Kubernetes',
      'Give pods stable addresses with ClusterIP, NodePort and LoadBalancer Services, route HTTP traffic with Ingress and the Gateway API, find services through cluster DNS, and restrict traffic with network policies.',
      [
      lesson('Service Types: ClusterIP, NodePort and LoadBalancer', 14, `
Pods come and go with new IP addresses, so other applications cannot rely on them directly. A Service gives a group of pods a stable name and IP address, and load-balances traffic across whichever pods are currently healthy. Services are how everything in a cluster talks to everything else.

### A basic Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: bazaar-api
spec:
  selector:
    app: bazaar-api
  ports:
    - port: 80          # the Service's port
      targetPort: 3000  # the container's port
\`\`\`

The Service selects pods labelled \`app: bazaar-api\` and forwards traffic from port 80 to port 3000 on those pods. As pods are replaced or scaled, the Service's list of endpoints updates automatically.

\`\`\`bash
kubectl get svc bazaar-api
kubectl get endpointslices -l kubernetes.io/service-name=bazaar-api
\`\`\`

If the endpoint list is empty, the selector matches no ready pods, the most common Service problem.

### Service types

| Type | Reachable from | Typical use |
|---|---|---|
| ClusterIP (default) | Inside the cluster only | Internal APIs, databases, caches |
| NodePort | Each node's IP on a port in the 30000 to 32767 range | Simple testing, some on-premises setups |
| LoadBalancer | An external load balancer created by the cloud provider | Exposing a service directly to the internet in the cloud |
| ExternalName | Maps a name to an external DNS name | Pointing to services outside the cluster |

### ClusterIP for internal traffic

Most services should be ClusterIP. Bazaar's API talks to \`postgres\` and \`redis\` Services internally; none of them need to be reachable from outside. Only the entry point for users is exposed, usually through Ingress or Gateway rather than a LoadBalancer per service.

### NodePort

\`\`\`yaml
spec:
  type: NodePort
  selector:
    app: bazaar-api
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080
\`\`\`

The service becomes reachable at \`http://<any-node-ip>:30080\`. It is simple but awkward for real users: unusual ports and dependence on node IPs.

### LoadBalancer

\`\`\`yaml
spec:
  type: LoadBalancer
\`\`\`

On a cloud cluster, this provisions a cloud load balancer with a public IP address. It is straightforward, but each LoadBalancer Service usually creates a separate, billed load balancer, so exposing many services this way becomes expensive. Ingress or Gateway lets many services share one entry point.

### Headless Services

Setting \`clusterIP: None\` creates a headless Service: DNS returns the individual pod addresses instead of one virtual IP. StatefulSets use headless Services to give each pod a stable DNS name, as chapter 8 shows.

### Testing Services locally

\`\`\`bash
kubectl port-forward svc/bazaar-api 8080:80
curl http://localhost:8080/health
\`\`\`

Port forwarding tunnels a local port to the Service through the API server. It is ideal for development and debugging without exposing anything publicly.

### Generating a Service quickly

\`\`\`bash
kubectl expose deployment bazaar-api --port=80 --target-port=3000 \\
  --dry-run=client -o yaml > service.yaml
\`\`\`

This creates a Service whose selector matches the Deployment's pods, a fast approach under exam conditions.

### Traffic goes only to ready pods

Services send traffic only to pods whose readiness probes pass. During rolling updates and startup, unready pods are removed from the endpoint list, so users are not sent to pods that cannot serve them.
      `,
        [
          q('What does a Service provide for a group of pods?', [
            'Persistent storage that survives pod restarts',
            'A stable address that balances across pods',
            'Automatic image builds from the pod spec',
            'Node-level logging for every container',
          ], 1, 'Services abstract changing pod IPs behind a stable address and balance traffic across them.'),
          q('A Service has no endpoints. What is the most likely cause?', [
            'The Service type is ClusterIP',
            'The port number is above 1000',
            'The cluster has too many nodes',
            'The selector matches no ready pods',
          ], 3, 'Endpoints come from pods matching the selector and passing readiness, so a mismatch leaves none.'),
          q('Why avoid a LoadBalancer Service for every application?', [
            'LoadBalancers only work locally',
            'They cannot route HTTP traffic',
            'Each usually creates a separate billed cloud load balancer',
            'They expose only internal traffic',
          ], 2, 'Many LoadBalancer Services multiply cost, while Ingress or Gateway share one entry point.'),
        ]
      ),
      lesson('Ingress and the Gateway API', 13, `
Users reach web applications through domain names and HTTPS, often with several services behind one domain: \`bazaar.pk\` for the front end, \`bazaar.pk/api\` for the API. Kubernetes handles this HTTP routing with Ingress and, increasingly, the Gateway API.

### Ingress

An Ingress defines HTTP routing rules; an Ingress controller, a separate component running in the cluster, implements them:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bazaar
spec:
  ingressClassName: example-controller
  tls:
    - hosts: ["bazaar.pk"]
      secretName: bazaar-tls
  rules:
    - host: bazaar.pk
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: bazaar-api
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: bazaar-web
                port:
                  number: 80
\`\`\`

Requests to \`bazaar.pk/api/...\` go to the API Service; everything else goes to the web front end. The TLS section serves HTTPS using a certificate stored in a Secret.

### Controllers are required

An Ingress object does nothing on its own. The cluster needs an Ingress controller installed, and the \`ingressClassName\` selects which one. Several controllers exist from different projects and vendors, and cloud providers offer their own. The widely used community ingress-nginx project has been retired, so for new clusters check which controllers are actively maintained, or choose the Gateway API.

### The Gateway API

The Gateway API is the newer, more expressive successor to Ingress, developed by the Kubernetes networking community and supported by many implementations. It splits responsibilities across resources:

| Resource | Owned by | Purpose |
|---|---|---|
| GatewayClass | Platform or cloud provider | Which implementation to use |
| Gateway | Platform or cluster operators | Listeners: ports, protocols, TLS certificates |
| HTTPRoute | Application teams | Routing rules to their Services |

\`\`\`yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: bazaar-api
spec:
  parentRefs:
    - name: public-gateway
  hostnames: ["bazaar.pk"]
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: bazaar-api
          port: 80
\`\`\`

This separation lets platform teams manage shared gateways while application teams manage their own routes safely. The Gateway API also supports features that Ingress handled only through controller-specific annotations, such as traffic splitting for canary releases and header-based routing.

### Ingress or Gateway API?

| Situation | Suggestion |
|---|---|
| Existing cluster already using Ingress | Keep it working; plan migration if its controller is unmaintained |
| New cluster | Prefer a maintained Gateway API implementation |
| Learning for exams | Know both; Ingress remains common in existing clusters and exam tasks |

### TLS certificates

Manually renewing certificates is error-prone. cert-manager, a popular open-source tool, obtains and renews certificates automatically, for example from Let's Encrypt, and stores them as Secrets used by Ingress or Gateway resources.

### DNS for your domain

Finally, point your domain's DNS records to the external address of the Ingress controller or Gateway, typically a cloud load balancer. Tools like ExternalDNS can manage these records automatically from Kubernetes resources.
      `,
        [
          q('What is required for an Ingress resource to route traffic?', [
            'A NodePort Service for every path',
            'A StatefulSet',
            'An Ingress controller running in the cluster',
            'A CronJob',
          ], 2, 'Ingress objects are rules; a controller must be installed to implement them.'),
          q('In the Gateway API, which resource do application teams typically manage?', [
            'GatewayClass',
            'The cloud load balancer',
            'The node pool',
            'HTTPRoute',
          ], 3, 'Application teams define HTTPRoutes, while platform teams manage Gateways and classes.'),
          q('What does cert-manager do?', [
            'Obtains and renews TLS certificates automatically',
            'Scans images for vulnerabilities',
            'Manages database backups',
            'Creates Deployments from Git',
          ], 0, 'cert-manager automates certificate issuance and renewal, storing certificates as Secrets.'),
        ]
      ),
      lesson('DNS and Service Discovery', 12, `
Applications inside a cluster find each other by name, not by IP address. Kubernetes runs a DNS service, usually CoreDNS, that automatically creates DNS records for Services. Understanding the naming scheme removes a whole category of configuration mistakes.

### Service DNS names

Every Service gets a DNS name:

\`\`\`text
<service>.<namespace>.svc.cluster.local

bazaar-api.shop.svc.cluster.local
postgres.shop.svc.cluster.local
\`\`\`

Within the same namespace, the short name works:

\`\`\`text
postgres            (from a pod in the shop namespace)
postgres.shop       (from any namespace)
postgres.shop.svc.cluster.local   (fully qualified)
\`\`\`

So Bazaar's API connects to its database with a URL such as \`postgres://bazaar:***@postgres:5432/bazaar\`, and it keeps working however many times the database pod is replaced. The same configuration also works unchanged in development, staging and production clusters, as long as each environment uses the same Service names, which keeps manifests simple and portable.

### How pods resolve names

Each pod's \`/etc/resolv.conf\` points to the cluster DNS service and includes search domains for its namespace, which is why short names work. You rarely need to change this, but it explains behaviour when debugging.

### Cross-namespace access

A common mistake is using a short name for a Service in a different namespace. From the \`shop\` namespace, \`redis\` will not find a Service in the \`cache\` namespace; use \`redis.cache\` or the full name. Namespaces are covered further in chapter 9.

### Debugging DNS

A temporary debug pod with networking tools is invaluable:

\`\`\`bash
kubectl run dns-test --rm -it --image=busybox:1.36 --restart=Never -- sh
\`\`\`

Inside:

\`\`\`bash
nslookup postgres
nslookup postgres.shop.svc.cluster.local
wget -qO- http://bazaar-api/health
\`\`\`

| Result | Meaning |
|---|---|
| Name resolves, connection works | DNS and Service are fine; look at the application |
| Name resolves, connection refused or times out | Service has no ready endpoints, wrong port, or a network policy blocks it |
| Name does not resolve | Wrong name or namespace, or the Service does not exist |
| Nothing resolves at all | Cluster DNS problem; check CoreDNS pods in kube-system |

### Headless Services and pod DNS

For a headless Service, DNS returns the IPs of individual pods. Combined with StatefulSets, each pod gets its own stable name:

\`\`\`text
postgres-0.postgres.shop.svc.cluster.local
postgres-1.postgres.shop.svc.cluster.local
\`\`\`

Databases and clustered systems use these stable names to find specific members, such as the primary database node.

### Environment variables for Services

Kubernetes also injects environment variables for Services that existed when a pod started, such as \`BAZAAR_API_SERVICE_HOST\`. DNS is more flexible and does not depend on creation order, so prefer DNS names in configuration.

### External services

Applications often call services outside the cluster, such as a payment gateway or an SMS provider. These use normal public DNS. An \`ExternalName\` Service can give an external host an internal alias, making it easier to switch providers later without changing application configuration.
      `,
        [
          q('What is the fully qualified DNS name of the postgres Service in the shop namespace?', [
            'postgres.cluster.shop.local',
            'postgres.shop.svc.cluster.local',
            'shop.postgres.svc.local',
            'svc.postgres.shop.cluster',
          ], 1, 'Service names follow the pattern service.namespace.svc.cluster.local.'),
          q('A pod in shop cannot reach redis in the cache namespace using the name redis. Why?', [
            'Redis cannot run in Kubernetes',
            'DNS only works for databases',
            'Namespaces block all traffic by default',
            'Short names resolve within the pod\'s own namespace',
          ], 3, 'Cross-namespace access needs redis.cache or the full name.'),
          q('Why prefer DNS names over injected Service environment variables?', [
            'Environment variables are encrypted',
            'DNS names are shorter',
            'DNS does not depend on the order in which pods and Services were created',
            'Environment variables only work for StatefulSets',
          ], 2, 'Environment variables only exist for Services created before the pod, while DNS always resolves.'),
        ]
      ),
      lesson('Network Policies', 13, `
By default, every pod in a Kubernetes cluster can talk to every other pod. That is convenient, but if an attacker compromises one pod, they can reach the database, internal APIs and everything else. Network policies act like firewall rules between pods, limiting who can talk to whom.

### Network policies need a supporting network plugin

Network policies are enforced by the cluster's network plugin (CNI), such as Calico or Cilium. If the plugin does not support them, policies are accepted but have no effect. Check your cluster's documentation; most managed clusters offer a supporting option.

### Default deny

A common starting point is denying all incoming traffic to pods in a namespace:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: shop
spec:
  podSelector: {}        # all pods in the namespace
  policyTypes:
    - Ingress
\`\`\`

With no \`ingress\` rules listed, nothing is allowed in. Then add policies that allow only the traffic you need.

### Allowing specific traffic

Only the API should reach the database:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgres-allow-api
  namespace: shop
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: bazaar-api
      ports:
        - protocol: TCP
          port: 5432
\`\`\`

Now pods labelled \`app: bazaar-api\` can connect to the database on port 5432; every other pod is blocked.

### Selecting sources

| Selector | Allows traffic from |
|---|---|
| \`podSelector\` | Pods with matching labels in the same namespace |
| \`namespaceSelector\` | All pods in namespaces with matching labels |
| Both in one entry | Matching pods in matching namespaces |
| \`ipBlock\` | IP address ranges, often for external sources |

The difference between listing \`podSelector\` and \`namespaceSelector\` as separate items (either one) or within the same item (both must match) is subtle and a common source of mistakes. Read YAML indentation carefully.

### Egress rules and DNS

Policies can also restrict outgoing traffic with \`Egress\`. If you deny all egress, remember to allow DNS, typically UDP and TCP port 53 to the cluster DNS pods, or nothing can resolve names and every connection fails mysteriously.

### Allowing the ingress controller

With default deny in place, users cannot reach the API until you allow traffic from the Ingress controller or Gateway's namespace. A policy using \`namespaceSelector\` for that namespace fixes it.

### Testing policies

\`\`\`bash
kubectl run test --rm -it --image=busybox:1.36 --restart=Never \\
  -l app=random -n shop -- sh -c "nc -zv -w 3 postgres 5432"
\`\`\`

A pod without the \`app: bazaar-api\` label should fail to connect; one with the label should succeed. Always test both allowed and blocked paths.

### A practical approach

\`\`\`text
1. Label pods consistently (app, component, tier).
2. Apply default-deny ingress per namespace.
3. Allow ingress controller to front-end and API.
4. Allow API to database and cache.
5. Consider egress restrictions for sensitive workloads.
6. Test every path, allowed and denied.
\`\`\`

Network policies turn a flat, fully open network into one where a compromise in one place stays contained.
      `,
        [
          q('What is Kubernetes\' default network behaviour between pods?', [
            'All traffic is blocked',
            'Only pods in the same node can communicate',
            'Every pod can reach every other pod',
            'Pods can only reach Services, never pods',
          ], 2, 'Without policies, cluster networking is open between all pods.'),
          q('Why might a network policy have no effect at all?', [
            'Policies only apply on weekends',
            'The cluster\'s network plugin does not enforce policies',
            'Policies need a LoadBalancer Service',
            'Policies only apply to CronJobs',
          ], 1, 'Enforcement depends on the CNI plugin; unsupported plugins accept but ignore policies.'),
          q('After denying all egress, every connection fails. What was likely forgotten?', [
            'Allowing traffic from the internet',
            'Adding more replicas',
            'Creating a headless Service',
            'Allowing DNS traffic on port 53',
          ], 3, 'Without DNS, pods cannot resolve Service names, so all name-based connections fail.'),
        ]
      ),
      ],
      [
      q('Which Service type is the default and reachable only inside the cluster?', [
        'ClusterIP',
        'NodePort',
        'LoadBalancer',
        'ExternalName',
      ], 0, 'ClusterIP provides an internal virtual IP, ideal for service-to-service traffic.'),
      q('What does kubectl port-forward svc/bazaar-api 8080:80 do?', [
        'Publishes the Service to the internet',
        'Changes the Service\'s port permanently',
        'Creates a new Ingress rule',
        'Tunnels local port 8080 to the Service for testing',
      ], 3, 'Port forwarding creates a temporary tunnel through the API server for local access.'),
      q('What does the Gateway API improve over Ingress?', [
        'It removes the need for any controller',
        'Clearer role separation and built-in features like traffic splitting',
        'It only supports TCP traffic',
        'It replaces Services entirely',
      ], 1, 'Gateway API separates platform and app responsibilities and standardises advanced routing.'),
      q('Which policy lets only the API pods reach the database?', [
        'A default allow-all policy',
        'A LoadBalancer Service on the database',
        'An ingress policy on database pods allowing pods labelled as the API',
        'A CronJob that checks connections',
      ], 2, 'A policy selecting database pods with an ingress rule from API-labelled pods restricts access.'),
      ]
    ),
    chapter(
      'Configuration and Storage',
      'Supply application settings with ConfigMaps, handle credentials with Secrets while understanding their limits, give pods durable storage with persistent volumes and claims, and run stateful applications with StatefulSets.',
      [
      lesson('ConfigMaps for Application Settings', 13, `
The same container image should run in development, staging and production with different settings: log levels, feature flags, external URLs. ConfigMaps store non-sensitive configuration separately from images and inject it into pods, following the same principle as environment variables in Docker.

### Creating a ConfigMap

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: bazaar-config
data:
  LOG_LEVEL: "info"
  CITY_LIST: "Karachi,Lahore,Islamabad"
  FEATURE_EXPRESS_DELIVERY: "true"
  app.properties: |
    delivery.maxDistanceKm=15
    orders.maxItems=50
\`\`\`

Or from the command line:

\`\`\`bash
kubectl create configmap bazaar-config \\
  --from-literal=LOG_LEVEL=info \\
  --from-file=app.properties
\`\`\`

All values are strings, so quote numbers and booleans in YAML.

### Using it as environment variables

All keys at once:

\`\`\`yaml
containers:
  - name: api
    image: ghcr.io/mehranmart/bazaar-api:1.5.0
    envFrom:
      - configMapRef:
          name: bazaar-config
\`\`\`

Or individual keys:

\`\`\`yaml
    env:
      - name: LOG_LEVEL
        valueFrom:
          configMapKeyRef:
            name: bazaar-config
            key: LOG_LEVEL
\`\`\`

### Using it as files

Applications that read configuration files can mount a ConfigMap as a volume:

\`\`\`yaml
spec:
  containers:
    - name: api
      image: ghcr.io/mehranmart/bazaar-api:1.5.0
      volumeMounts:
        - name: config
          mountPath: /etc/bazaar
          readOnly: true
  volumes:
    - name: config
      configMap:
        name: bazaar-config
\`\`\`

Each key becomes a file, such as \`/etc/bazaar/app.properties\`.

### What happens when a ConfigMap changes

| How it is used | Behaviour after an update |
|---|---|
| Environment variables | Not updated; pods must restart |
| Mounted volume | Files update after a short delay, unless mounted with subPath |

Because environment variables do not update, a common practice is to restart the Deployment after changing configuration:

\`\`\`bash
kubectl rollout restart deployment/bazaar-api
\`\`\`

Tools like Helm and Kustomize can add a hash of the configuration to the pod template, so changes trigger rolling restarts automatically.

### Immutable ConfigMaps

Setting \`immutable: true\` prevents changes. To change configuration, create a new ConfigMap with a new name and point the Deployment to it. This makes rollouts and rollbacks predictable and reduces load on the API server in large clusters.

### One name, different values per environment

A common pattern is to give the ConfigMap the same name in every environment, such as \`bazaar-config\` in the \`dev\`, \`staging\` and \`prod\` namespaces, with different values in each. The Deployment manifest stays identical everywhere; only the ConfigMap differs. Kustomize overlays and Helm values files, covered in chapter 10, make managing these per-environment differences straightforward.

ConfigMaps are limited to about 1 MiB of data, so they suit settings and small files, not large data sets or binaries.

### What does not belong in a ConfigMap

Passwords, API keys, tokens and private keys do not belong in ConfigMaps, which are readable by anyone with basic access to the namespace. Those go in Secrets, the next lesson, with additional protections.

### Keep configuration in Git

Store ConfigMap manifests with the application's other manifests in version control. Configuration changes then go through the same review and history as code changes, and you can always see who changed a setting and when.
      `,
        [
          q('What kind of data belongs in a ConfigMap?', [
            'Non-sensitive settings like log levels',
            'Database passwords for production',
            'TLS private keys for the Ingress',
            'Container images for the Deployment',
          ], 0, 'ConfigMaps hold ordinary configuration; sensitive values belong in Secrets.'),
          q('A ConfigMap used through envFrom is updated. What happens to running pods?', [
            'They update their environment immediately',
            'They are deleted automatically',
            'Nothing until the pods restart',
            'The ConfigMap change is rejected',
          ], 2, 'Environment variables are read at container start, so pods must restart to see new values.'),
          q('What does immutable: true on a ConfigMap encourage?', [
            'Editing the ConfigMap more frequently',
            'Storing secrets in it',
            'Mounting it only as environment variables',
            'Creating a new ConfigMap for each change, making rollouts predictable',
          ], 3, 'Immutable ConfigMaps cannot change, so new versions are created and referenced explicitly.'),
        ]
      ),
      lesson('Secrets and Their Limits', 13, `
Applications need credentials: database passwords, API keys for payment gateways, signing keys for tokens. Kubernetes Secrets store these separately from ConfigMaps, with extra controls. But Secrets are often misunderstood, and knowing their limits is essential for real security.

### Creating a Secret

\`\`\`bash
kubectl create secret generic bazaar-db \\
  --from-literal=username=bazaar \\
  --from-literal=password='S3cure-Passw0rd'
\`\`\`

Using it in a pod:

\`\`\`yaml
env:
  - name: DB_USER
    valueFrom:
      secretKeyRef:
        name: bazaar-db
        key: username
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: bazaar-db
        key: password
\`\`\`

Secrets can also be mounted as files, which some applications and libraries prefer.

### Base64 is not encryption

In YAML, Secret values appear base64-encoded:

\`\`\`yaml
data:
  password: UzNjdXJlLVBhc3N3MHJk
\`\`\`

Anyone can decode this in a second:

\`\`\`bash
echo UzNjdXJlLVBhc3N3MHJk | base64 -d
\`\`\`

Base64 is only an encoding. Committing a Secret manifest to Git is the same as committing the password in plain text.

### Built-in Secret types

| Type | Used for |
|---|---|
| Opaque | General key-value secrets |
| kubernetes.io/tls | TLS certificates and keys for Ingress and Gateway |
| kubernetes.io/dockerconfigjson | Credentials for pulling images from private registries |
| kubernetes.io/service-account-token | Service account tokens (mostly managed automatically) |

### Protecting Secrets in the cluster

| Control | Purpose |
|---|---|
| Encryption at rest | Encrypts Secrets stored in etcd; managed clusters often enable or offer it |
| RBAC | Limits who can read Secrets; many users should be able to deploy but not read them |
| Namespaces | Secrets are only usable by pods in the same namespace |
| Audit logs | Record who accessed Secrets |

Note that anyone who can create pods in a namespace can usually mount its Secrets, so permission to deploy is effectively permission to read Secrets. Design RBAC with that in mind.

### Keeping Secrets out of Git

Teams use several approaches to manage Secrets safely with GitOps:

| Approach | How it works |
|---|---|
| External secret managers | Secrets live in a cloud secret manager or Vault; an operator syncs them into the cluster |
| Sealed Secrets | Secrets encrypted with the cluster's public key, safe to commit; only the cluster can decrypt |
| SOPS | Files encrypted with keys from a cloud KMS or other tools, decrypted during deployment |
| CSI secrets store driver | Mounts secrets directly from an external manager into pods as files |

For production, an external secret manager is a common, robust choice.

### Good practices

- Never log environment variables or configuration that may contain secrets.
- Rotate credentials regularly and immediately after anyone with access leaves.
- Give each application its own credentials, with the least privilege it needs.
- Prefer short-lived credentials, such as cloud workload identity, over long-lived static keys where available.

### Image pull secrets

For private registries:

\`\`\`bash
kubectl create secret docker-registry ghcr-creds \\
  --docker-server=ghcr.io \\
  --docker-username=mehranmart-bot \\
  --docker-password=<token>
\`\`\`

Reference it in the pod spec with \`imagePullSecrets\`, or attach it to the namespace's service account so all pods use it. Chapter 10 returns to registries and tags.
      `,
        [
          q('Why is committing a Secret manifest to Git dangerous?', [
            'Git cannot store YAML files',
            'Base64 values are easily decoded, exposing the secret',
            'Kubernetes rejects secrets from Git',
            'It makes the cluster slower',
          ], 1, 'Base64 is an encoding, not encryption, so committed Secrets reveal their values.'),
          q('Which Secret type stores credentials for pulling private images?', [
            'kubernetes.io/tls',
            'Opaque',
            'kubernetes.io/service-account-token',
            'kubernetes.io/dockerconfigjson',
          ], 3, 'dockerconfigjson Secrets hold registry credentials used through imagePullSecrets.'),
          q('Why does permission to create pods matter for Secret security?', [
            'Pods cannot read Secrets at all',
            'Creating pods deletes Secrets',
            'Anyone who can create pods can usually mount the namespace\'s Secrets',
            'Pods encrypt Secrets automatically',
          ], 2, 'Pod creation lets users mount Secrets, so deploy rights effectively include Secret access.'),
        ]
      ),
      lesson('Persistent Volumes and Claims', 13, `
Containers lose their files when replaced, which is fine for stateless APIs but not for databases, file uploads or message queues. Kubernetes provides persistent storage that outlives pods, through persistent volumes, claims and storage classes.

### The three objects

| Object | Who creates it | Meaning |
|---|---|---|
| StorageClass | Cluster administrators or the cloud provider | A type of storage, such as fast SSD or standard disk, and how to create it |
| PersistentVolumeClaim (PVC) | Application teams | A request: "I need 20 GiB of this storage class" |
| PersistentVolume (PV) | Usually created automatically from a claim | The actual piece of storage |

This separation lets developers request storage without knowing details of the underlying disks.

### Dynamic provisioning

On most clusters, creating a PVC automatically creates a matching volume:

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: uploads
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 20Gi
\`\`\`

\`\`\`bash
kubectl get pvc
kubectl get pv
kubectl get storageclass
\`\`\`

The PVC shows \`Bound\` once a volume is attached to it. If it stays \`Pending\`, check the storage class name and events with \`kubectl describe pvc uploads\`.

### Using a claim in a pod

\`\`\`yaml
spec:
  containers:
    - name: api
      image: ghcr.io/mehranmart/bazaar-api:1.5.0
      volumeMounts:
        - name: uploads
          mountPath: /app/uploads
  volumes:
    - name: uploads
      persistentVolumeClaim:
        claimName: uploads
\`\`\`

If the pod is replaced, the new pod mounts the same volume, and the files are still there.

### Access modes

| Mode | Meaning |
|---|---|
| ReadWriteOnce (RWO) | Mounted read-write by a single node |
| ReadOnlyMany (ROX) | Mounted read-only by many nodes |
| ReadWriteMany (RWX) | Mounted read-write by many nodes; needs shared file storage |
| ReadWriteOncePod (RWOP) | Mounted read-write by a single pod |

Most cloud block storage supports only ReadWriteOnce. That means a Deployment with several replicas across nodes cannot all write to the same RWO volume. Shared file systems support ReadWriteMany but are usually slower and more expensive.

### Reclaim policy

When a PVC is deleted, the volume's reclaim policy decides what happens:

- **Delete**: the underlying disk is deleted, and the data is gone. Common default for dynamic provisioning.
- **Retain**: the disk remains and must be cleaned up or reused manually.

For important data, check the storage class's reclaim policy before relying on it, and take backups regardless.

### Stateless is still better

Persistent volumes solve real needs, but storing files like user uploads on volumes ties pods to storage and complicates scaling. For uploads, object storage such as Amazon S3 or compatible services is often a better choice: any replica can read and write, and storage scales independently. Keep application pods stateless where possible, and reserve volumes for systems that genuinely need local disks, such as databases.

### Volume expansion and snapshots

Many storage classes allow increasing a PVC's size by editing the request. Volume snapshots, where supported, capture point-in-time copies useful for backups and cloning. Neither replaces a tested backup and restore process.
      `,
        [
          q('What does a PersistentVolumeClaim represent?', [
            'A physical disk purchased by the team',
            'A container image layer',
            'A request for storage of a certain size and class',
            'A backup of a pod',
          ], 2, 'A PVC requests storage; the cluster binds it to a matching PersistentVolume.'),
          q('Why can several Deployment replicas on different nodes not all write to one RWO volume?', [
            'ReadWriteOnce allows read-write mounting by only a single node',
            'Deployments cannot use volumes',
            'RWO volumes are read-only',
            'Volumes can only be used by CronJobs',
          ], 0, 'RWO limits read-write access to one node, so shared writes need RWX storage or another design.'),
          q('What happens with a Delete reclaim policy when the PVC is deleted?', [
            'The data is moved to another cluster',
            'The volume becomes read-only',
            'Nothing happens to the disk',
            'The underlying disk and its data are deleted',
          ], 3, 'Delete removes the backing storage, so important data needs backups and careful policies.'),
        ]
      ),
      lesson('StatefulSets for Stateful Apps', 12, `
Deployments treat pods as interchangeable, which is perfect for stateless services. Databases, message brokers and clustered systems are different: each member has its own identity and its own data. StatefulSets give pods stable names, stable storage and ordered startup.

### What StatefulSets guarantee

| Guarantee | Meaning |
|---|---|
| Stable names | Pods are named \`postgres-0\`, \`postgres-1\` and keep those names when replaced |
| Stable network identity | Each pod has its own DNS name through a headless Service |
| Stable storage | Each pod gets its own PVC, reattached when the pod is recreated |
| Ordered operations | Pods start, update and stop in a defined order by default |

### A simple StatefulSet

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
    - port: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          envFrom:
            - secretRef:
                name: postgres-credentials
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
\`\`\`

\`volumeClaimTemplates\` creates a separate PVC for each pod, such as \`data-postgres-0\`. If \`postgres-0\` is deleted, the replacement is also called \`postgres-0\` and reattaches to \`data-postgres-0\`, so the data survives.

### Scaling is not automatic replication

Setting \`replicas: 3\` creates three PostgreSQL pods, but they are three independent databases, not a replicated cluster. Real replication, failover and backups require database-specific configuration. That is why running production databases on Kubernetes is a serious undertaking.

### Operators

Operators are controllers that encode operational knowledge for specific software. A PostgreSQL operator, for example, manages replication, failover, backups and upgrades through custom resources:

\`\`\`yaml
kind: Cluster          # a custom resource defined by the operator
spec:
  instances: 3
  storage:
    size: 20Gi
\`\`\`

Well-established operators exist for many databases and message brokers. If you run stateful systems on Kubernetes, an operator is usually far safer than hand-written StatefulSets.

### Managed databases are often wiser

For many teams, especially small ones, a managed database service from a cloud provider is simpler and safer: automated backups, patching, replication and failover without operating them yourself. Applications in Kubernetes connect to it like any external service. A common pattern is stateless apps on Kubernetes, with databases managed outside it.

### When StatefulSets fit

- Development and test environments, where simplicity matters more than high availability and data can be recreated easily.
- Systems designed for Kubernetes, managed by mature operators.
- Teams with the expertise to operate stateful systems and test recovery regularly.

Whichever approach you choose, test restoring from backups regularly. Stateful systems are where mistakes are most expensive.
      `,
        [
          q('What does volumeClaimTemplates provide in a StatefulSet?', [
            'One shared volume for all pods',
            'Temporary storage that is deleted on restart',
            'A separate persistent claim for each pod',
            'Automatic database replication',
          ], 2, 'Each StatefulSet pod gets its own PVC, reattached when that pod is recreated.'),
          q('Does setting replicas: 3 on a PostgreSQL StatefulSet create a replicated cluster?', [
            'Yes, Kubernetes configures replication automatically',
            'Yes, but only on managed Kubernetes',
            'No, StatefulSets cannot have more than one replica',
            'No, it creates independent databases without database-level replication',
          ], 3, 'Replication and failover need database-specific setup, often handled by an operator.'),
          q('Why do many teams use managed databases instead of running them in Kubernetes?', [
            'Backups, patching and failover are handled for them',
            'Kubernetes cannot run databases at all',
            'Managed databases are always free',
            'Applications in Kubernetes cannot reach external services',
          ], 0, 'Managed services reduce the operational burden and risk of running stateful systems.'),
        ]
      ),
      ],
      [
      q('How can a ConfigMap be consumed by a pod?', [
        'Only as command-line arguments',
        'Only through a Service',
        'As environment variables or as mounted files',
        'Only through an Ingress',
      ], 2, 'ConfigMaps can populate environment variables or appear as files in a mounted volume.'),
      q('Which approach keeps Secrets safe while using GitOps?', [
        'Committing base64-encoded Secret manifests',
        'Storing Secrets in ConfigMaps',
        'Using an external secret manager or encrypted Sealed Secrets',
        'Printing Secrets in application logs',
      ], 2, 'External managers or encryption keep secrets out of plain text in repositories.'),
      q('What should you check when a PVC stays Pending?', [
        'The container image tag',
        'The storage class and the PVC\'s events',
        'The Deployment\'s replica count',
        'The Ingress rules',
      ], 1, 'Pending claims usually indicate storage class or provisioning problems, visible in events.'),
      q('Which workload type gives pods stable names like postgres-0?', [
        'Deployment',
        'DaemonSet',
        'Job',
        'StatefulSet',
      ], 3, 'StatefulSets provide stable identities, storage and ordered operations for stateful systems.'),
      ]
    ),
    chapter(
      'Health, Resources and Scaling',
      'Tell Kubernetes when applications are alive and ready with probes, reserve and cap CPU and memory with requests and limits, scale automatically with the Horizontal Pod Autoscaler, and share clusters fairly with namespaces, quotas and limit ranges.',
      [
      lesson('Liveness, Readiness and Startup Probes', 14, `
A container can be running but useless: stuck in a deadlock, still loading data, or unable to reach its database. Kubernetes cannot know this unless you tell it how to check. Probes are those checks, and configuring them well is one of the most important steps in making applications reliable.

### Three kinds of probes

| Probe | Question | On failure |
|---|---|---|
| Liveness | Is the application alive, or stuck? | The container is restarted |
| Readiness | Can it serve traffic right now? | The pod is removed from Service endpoints until it recovers |
| Startup | Has it finished starting up? | Liveness and readiness checks wait until it succeeds |

### Configuring probes

\`\`\`yaml
containers:
  - name: api
    image: ghcr.io/mehranmart/bazaar-api:1.5.0
    ports:
      - containerPort: 3000
    startupProbe:
      httpGet:
        path: /health/live
        port: 3000
      periodSeconds: 5
      failureThreshold: 24        # up to 2 minutes to start
    livenessProbe:
      httpGet:
        path: /health/live
        port: 3000
      periodSeconds: 10
      timeoutSeconds: 2
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 3000
      periodSeconds: 5
      failureThreshold: 2
\`\`\`

Probes can use \`httpGet\`, \`tcpSocket\`, \`exec\` (run a command) or \`grpc\`. HTTP checks against dedicated health endpoints are most common for web services.

### What each endpoint should check

| Endpoint | Should check | Should not check |
|---|---|---|
| Liveness (\`/health/live\`) | The process can respond; no deadlock | Databases or external services |
| Readiness (\`/health/ready\`) | The app can serve requests: required connections ready, warm-up complete | Slow, expensive operations |

This distinction matters. If the liveness probe checks the database and the database has a brief outage, Kubernetes restarts every API pod, turning a small problem into a complete outage. Liveness should answer only "is this process healthy?". Readiness can include dependencies, because failing readiness just stops traffic temporarily.

### Why startup probes exist

Some applications take a long time to start, such as Java services loading large caches. Without a startup probe, a liveness probe might kill the container before it finishes starting, causing an endless restart loop. The startup probe gives slow starters time, then hands over to the liveness probe.

### Tuning parameters

| Field | Meaning |
|---|---|
| \`initialDelaySeconds\` | Wait before the first check (a startup probe is usually better) |
| \`periodSeconds\` | How often to check |
| \`timeoutSeconds\` | How long to wait for a response |
| \`failureThreshold\` | Consecutive failures before acting |
| \`successThreshold\` | Consecutive successes to be considered healthy again (readiness) |

Probes that are too aggressive cause unnecessary restarts during brief slowdowns; probes that are too relaxed leave broken pods receiving traffic for too long.

### Readiness and graceful shutdown

During shutdown, a pod should stop receiving new traffic before it stops working. Kubernetes removes terminating pods from endpoints, but that takes a moment to propagate. Many teams add a short \`preStop\` sleep and handle SIGTERM gracefully, so in-flight requests finish and no traffic hits a stopping pod.

### Probes make rollouts safe

As chapter 6 explained, rolling updates wait for new pods to become ready. Good readiness probes are what prevent a broken release from receiving traffic: if the new version never becomes ready, the rollout stalls instead of replacing healthy pods.
      `,
        [
          q('What happens when a readiness probe fails?', [
            'The container is restarted immediately',
            'The pod is deleted permanently',
            'The pod stops receiving Service traffic until it recovers',
            'The node is drained',
          ], 2, 'Readiness failures remove the pod from endpoints without restarting it.'),
          q('Why should a liveness probe not check the database?', [
            'Databases cannot be reached from pods',
            'Liveness probes cannot make network calls',
            'It makes the image larger',
            'A database outage would restart every pod and worsen the incident',
          ], 3, 'Liveness should only detect a stuck process, so dependency failures do not trigger mass restarts.'),
          q('What problem does a startup probe solve?', [
            'Liveness checks killing slow starters',
            'Images failing to download from the registry',
            'Services having no endpoints after deployment',
            'Pods being scheduled onto the wrong node',
          ], 0, 'Startup probes delay liveness and readiness checks until the app has fully started.'),
        ]
      ),
      lesson('Requests, Limits and Quality of Service', 13, `
Many applications share each node in a cluster. Without resource settings, one misbehaving pod can consume all the memory and CPU, starving its neighbours or crashing the node. Requests and limits reserve and cap resources, and they strongly affect scheduling, stability and cost.

### Requests and limits

\`\`\`yaml
containers:
  - name: api
    image: ghcr.io/mehranmart/bazaar-api:1.5.0
    resources:
      requests:
        cpu: 250m
        memory: 256Mi
      limits:
        memory: 512Mi
\`\`\`

| Setting | Meaning |
|---|---|
| CPU request | Guaranteed CPU share, used by the scheduler to place the pod |
| Memory request | Memory reserved for scheduling purposes |
| CPU limit | Maximum CPU; the container is throttled above it |
| Memory limit | Maximum memory; the container is killed (OOMKilled) if it exceeds it |

Units: \`250m\` means 250 millicores, a quarter of a CPU core; \`256Mi\` means 256 mebibytes.

### How the scheduler uses requests

The scheduler places pods only on nodes with enough unrequested capacity. If requests are too high, pods stay \`Pending\` even though nodes look idle. If requests are too low, too many pods are packed onto a node and compete for real resources.

\`\`\`text
Node: 4 CPU, 16Gi memory
Already requested: 3.5 CPU, 10Gi
New pod requests 1 CPU -> does not fit, even if actual usage is low
\`\`\`

### CPU versus memory behaviour

CPU is compressible: a container over its CPU limit is slowed down, not killed. Memory is not: a container exceeding its memory limit is killed and restarted. That is why memory limits are essential, and why many teams set memory requests close to limits for predictability. CPU limits are debated: some teams avoid them to prevent unnecessary throttling, relying on requests for fair sharing. Follow your platform team's guidance.

### Quality of Service classes

Kubernetes assigns each pod a QoS class based on its settings:

| QoS class | When | Eviction priority under node pressure |
|---|---|---|
| Guaranteed | Every container has CPU and memory requests equal to limits | Evicted last |
| Burstable | At least one request or limit set, not Guaranteed | Evicted after BestEffort |
| BestEffort | No requests or limits at all | Evicted first |

Important services should never be BestEffort. Setting at least requests makes them Burstable; matching requests and limits makes them Guaranteed.

### Choosing values

Guessing leads to waste or instability. A practical approach:

\`\`\`text
1. Start with reasonable estimates from local testing.
2. Observe real usage in staging and production with metrics.
3. Set requests near typical usage, limits with headroom for peaks.
4. Revisit after major releases or traffic changes.
\`\`\`

\`kubectl top pods\` shows current usage, using the metrics server. Monitoring dashboards show usage over time, which is better for decisions.

### Cost connection

In the cloud, you pay for nodes. Requests determine how many pods fit on each node, so inflated requests mean paying for idle capacity. Right-sizing requests is one of the most effective ways to reduce Kubernetes costs, often significantly.
      `,
        [
          q('What happens when a container exceeds its memory limit?', [
            'It is slowed down',
            'It is moved to another node automatically',
            'It is killed and restarted',
            'Its limit is raised automatically',
          ], 2, 'Memory is not compressible, so exceeding the limit triggers an OOM kill.'),
          q('What does the scheduler use to decide whether a pod fits on a node?', [
            'Resource requests',
            'Resource limits only',
            'The container image size',
            'The number of labels',
          ], 0, 'Scheduling is based on requested resources compared with the node\'s unrequested capacity.'),
          q('Which QoS class is evicted first under node pressure?', [
            'Guaranteed',
            'Burstable',
            'All classes equally',
            'BestEffort',
          ], 3, 'Pods without requests or limits are BestEffort and are evicted first.'),
        ]
      ),
      lesson('Horizontal Pod Autoscaling', 13, `
Traffic is rarely constant. Bazaar's orders spike before iftar during Ramadan, on weekend evenings and during sales, then drop at night. Running enough pods for the peak all day wastes money; running too few for the peak loses orders. The Horizontal Pod Autoscaler (HPA) adjusts the number of replicas automatically.

### How the HPA works

\`\`\`text
Every few seconds:
  1. Read metrics (for example average CPU utilisation) from the metrics API
  2. Compare with the target (for example 70% of requested CPU)
  3. Calculate the desired replicas
  4. Scale the Deployment up or down within min and max limits
\`\`\`

The HPA needs a metrics source, usually the metrics server, which many clusters and local tools install as an add-on.

### Creating an HPA

Quickly from the command line:

\`\`\`bash
kubectl autoscale deployment bazaar-api --cpu-percent=70 --min=3 --max=15
\`\`\`

Or declaratively:

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: bazaar-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bazaar-api
  minReplicas: 3
  maxReplicas: 15
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
\`\`\`

CPU utilisation is measured as a percentage of the CPU request. Without CPU requests, the HPA cannot calculate utilisation, one more reason requests matter.

### Watching it work

\`\`\`bash
kubectl get hpa bazaar-api -w
kubectl describe hpa bazaar-api
\`\`\`

\`describe\` shows current metrics, desired replicas and recent scaling events, useful when the HPA does not behave as expected.

### Scaling behaviour

By default, the HPA scales up quickly but scales down cautiously, using a stabilisation window so it does not remove pods during brief lulls and add them back moments later. You can tune this with the \`behavior\` section, for example allowing faster scale-up during flash sales.

### Scaling on other metrics

CPU is a convenient default but not always the best signal:

| Metric | Suits |
|---|---|
| CPU utilisation | CPU-bound APIs |
| Memory | Rarely ideal; memory often does not drop when load falls |
| Requests per second | Web services, through custom metrics adapters |
| Queue length | Background workers; tools such as KEDA scale on queue depth and events |

KEDA, an event-driven autoscaler, can even scale workers to zero when a queue is empty and back up when messages arrive.

### Other kinds of autoscaling

| Autoscaler | Adjusts |
|---|---|
| Horizontal Pod Autoscaler | Number of pods |
| Vertical Pod Autoscaler | Requests and limits of pods |
| Cluster Autoscaler or Karpenter | Number of nodes in the cluster |

They work together: the HPA adds pods, and if nodes lack capacity, pods stay \`Pending\` until the cluster autoscaler adds nodes. Scaling up therefore takes longer when new nodes are needed, so keep \`minReplicas\` high enough to absorb sudden spikes.

### Test before relying on it

Load test in staging to confirm scaling happens in time. Check that the database and other dependencies can handle the extra pods, because scaling the API from 3 to 15 pods multiplies database connections too.
      `,
        [
          q('What does the HPA need to calculate CPU utilisation?', [
            'Memory limits on every container',
            'A LoadBalancer Service',
            'CPU requests on the pods and a metrics source',
            'A StatefulSet',
          ], 2, 'Utilisation is a percentage of requested CPU, read from the metrics API.'),
          q('Why does the HPA scale down more cautiously than up?', [
            'Kubernetes cannot remove pods quickly',
            'To avoid removing pods during brief lulls and adding them back',
            'Scaling down costs more money',
            'It is required by the metrics server',
          ], 1, 'A stabilisation window prevents flapping between replica counts.'),
          q('What happens when the HPA adds pods but nodes are full?', [
            'The HPA deletes other applications',
            'The pods run without resources',
            'The HPA stops working permanently',
            'Pods stay Pending until a cluster autoscaler adds nodes',
          ], 3, 'Node capacity must grow for new pods to schedule, which is the cluster autoscaler\'s job.'),
        ]
      ),
      lesson('Namespaces, Quotas and Limit Ranges', 12, `
As more teams and applications share a cluster, organisation and fairness become essential. Namespaces divide a cluster into logical sections; resource quotas cap how much each section can use; limit ranges set sensible defaults for every container. Together they prevent one team's mistake from affecting everyone else.

### Namespaces

\`\`\`bash
kubectl create namespace shop
kubectl get pods -n shop
kubectl config set-context --current --namespace=shop
\`\`\`

Common ways to use namespaces:

| Pattern | Example |
|---|---|
| Per environment | \`dev\`, \`staging\` (production often in a separate cluster) |
| Per team | \`payments-team\`, \`delivery-team\` |
| Per application | \`shop\`, \`admin-portal\` |
| System components | \`kube-system\`, \`monitoring\`, \`ingress\` |

Names of objects must be unique within a namespace, not across the cluster. RBAC permissions, network policies, quotas and Secrets are commonly scoped per namespace. Some objects, such as nodes, persistent volumes and storage classes, are cluster-wide.

### Resource quotas

A ResourceQuota caps total resource use in a namespace:

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: shop-quota
  namespace: shop
spec:
  hard:
    requests.cpu: "8"
    requests.memory: 16Gi
    limits.memory: 32Gi
    pods: "50"
    persistentvolumeclaims: "10"
\`\`\`

When a namespace reaches its quota, new pods are rejected with a clear error. Once a quota covers CPU or memory, every new pod in that namespace must specify the corresponding requests or limits, or it will be rejected, which is where limit ranges help.

\`\`\`bash
kubectl describe resourcequota shop-quota -n shop
\`\`\`

### Limit ranges

A LimitRange sets defaults and bounds for containers in a namespace:

\`\`\`yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: shop-defaults
  namespace: shop
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: 100m
        memory: 128Mi
      default:
        memory: 256Mi
      max:
        memory: 2Gi
\`\`\`

Containers that omit resources receive the defaults, so they are never BestEffort by accident, and nobody can request more than the maximum for a single container.

### Check quota usage regularly

Quotas are only useful if they reflect reality. Review usage against quotas every few weeks: a team constantly hitting its limit may need more capacity or better right-sizing, while a quota far above actual use gives false comfort. Sharing these numbers with teams also makes cluster costs visible to the people who drive them.

### Deleting a namespace

\`kubectl delete namespace shop\` deletes everything inside it: deployments, services, secrets and claims. It is powerful for cleaning up test environments and dangerous anywhere else. Protect important namespaces with RBAC and be sure of your context before running it.

### Fair sharing in practice

For a cluster shared by several teams:

\`\`\`text
1. A namespace per team or application.
2. RBAC so each team manages only its namespaces (chapter 11).
3. ResourceQuotas sized to each team's needs.
4. LimitRanges providing default requests and limits.
5. Network policies isolating namespaces by default (chapter 7).
\`\`\`

This setup lets many teams work independently on one cluster without stepping on each other.
      `,
        [
          q('What does a ResourceQuota do?', [
            'Sets CPU for a single container',
            'Caps total resource use in a namespace',
            'Creates new nodes automatically',
            'Encrypts Secrets in a namespace',
          ], 1, 'Quotas limit aggregate usage, such as total CPU, memory and pod count, per namespace.'),
          q('Why add a LimitRange to a namespace with a CPU and memory quota?', [
            'It gives containers default requests and limits so they are not rejected',
            'It removes the quota',
            'It makes pods Guaranteed automatically',
            'It deletes pods that exceed limits',
          ], 0, 'With quotas, pods must declare resources; LimitRange defaults fill them in when omitted.'),
          q('What happens when you delete a namespace?', [
            'Only its Services are removed',
            'Nothing, namespaces cannot be deleted',
            'Its objects move to the default namespace',
            'Everything inside it is deleted',
          ], 3, 'Deleting a namespace removes all the objects it contains.'),
        ]
      ),
      ],
      [
      q('Which probe restarts a stuck container?', [
        'Readiness',
        'Liveness',
        'Startup',
        'Network policy',
      ], 1, 'Liveness failures cause the kubelet to restart the container.'),
      q('A pod stays Pending on a cluster with idle-looking nodes. What is a likely cause?', [
        'The image is too small',
        'The liveness probe is too strict',
        'Its resource requests exceed the nodes\' unrequested capacity',
        'The Service has no endpoints',
      ], 2, 'Scheduling uses requests, so high requests can block placement even when actual usage is low.'),
      q('Which tool can scale workers based on queue length, even to zero?', [
        'The metrics server alone',
        'A LimitRange',
        'A ResourceQuota',
        'KEDA',
      ], 3, 'KEDA provides event-driven autoscaling based on sources such as queues.'),
      q('What helps teams share one cluster fairly?', [
        'Namespaces with quotas, limit ranges and RBAC',
        'One namespace for everything',
        'BestEffort pods everywhere',
        'Disabling the scheduler',
      ], 0, 'Namespaces plus quotas, defaults and permissions isolate teams and cap their usage.'),
      ]
    ),
    chapter(
      'Packaging and Delivery',
      'Package applications as Helm charts, manage environment differences with Kustomize overlays, tag and pull images reliably from private registries, and build a CI/CD pipeline that delivers tested images to Kubernetes.',
      [
      lesson('Helm Charts', 14, `
A real application needs many manifests: Deployment, Service, Ingress or HTTPRoute, ConfigMap, HPA and more, each slightly different per environment. Copying and editing YAML files by hand for every environment quickly becomes error-prone. Helm, the package manager for Kubernetes, bundles manifests into reusable, configurable charts.

### What a chart looks like

\`\`\`text
bazaar-api/
  Chart.yaml          chart name, version and description
  values.yaml         default configuration values
  templates/
    deployment.yaml
    service.yaml
    ingress.yaml
    hpa.yaml
    _helpers.tpl      reusable template snippets
\`\`\`

Templates use Go templating to insert values:

\`\`\`yaml
# templates/deployment.yaml (excerpt)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "bazaar-api.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
\`\`\`

\`\`\`yaml
# values.yaml
replicaCount: 2
image:
  repository: ghcr.io/mehranmart/bazaar-api
  tag: "1.5.0"
resources:
  requests:
    cpu: 250m
    memory: 256Mi
\`\`\`

### Installing and upgrading

\`\`\`bash
helm install bazaar-api ./bazaar-api -n shop
helm upgrade --install bazaar-api ./bazaar-api -n shop -f values-prod.yaml
helm list -n shop
helm history bazaar-api -n shop
helm rollback bazaar-api 3 -n shop
helm uninstall bazaar-api -n shop
\`\`\`

Each install or upgrade creates a release revision. \`helm rollback\` returns to a previous revision, including all its manifests, not just the Deployment.

### Values per environment

\`\`\`text
values.yaml          defaults
values-staging.yaml  replicaCount: 2, staging hostnames
values-prod.yaml     replicaCount: 4, production hostnames, larger resources
\`\`\`

\`\`\`bash
helm upgrade --install bazaar-api ./bazaar-api -f values-prod.yaml --set image.tag=1.5.1
\`\`\`

Later files and \`--set\` flags override earlier values. Prefer files over long \`--set\` chains, so configuration stays reviewable in Git.

### Checking before applying

\`\`\`bash
helm lint ./bazaar-api
helm template bazaar-api ./bazaar-api -f values-prod.yaml > rendered.yaml
\`\`\`

\`helm template\` renders the final YAML without installing it, so you can review exactly what Kubernetes will receive. Many teams run this in CI and inspect differences in pull requests.

### Using community charts

Helm's biggest strength may be installing well-maintained software with one command:

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
\`\`\`

Charts are also distributed through OCI registries, the same registries that store images. Before installing a community chart, check who maintains it, read its values file and pin its version.

### Chart version and app version

\`Chart.yaml\` holds two different versions. \`version\` is the chart's own version, increased whenever templates or defaults change. \`appVersion\` records the version of the application the chart deploys by default. Keeping them distinct lets you fix a chart template without pretending the application itself changed.

Avoid putting passwords in values files committed to Git; reference Secrets managed as described in chapter 8 instead.

### Keep charts simple

Templates can become hard to read when every field is configurable. Expose only values that genuinely change between environments or installations. A chart that is easy to read is easy to trust and maintain.
      `,
        [
          q('What does values.yaml contain in a Helm chart?', [
            'Default configuration values used by the templates',
            'The rendered Kubernetes manifests',
            'The container image layers',
            'The cluster\'s kubeconfig',
          ], 0, 'values.yaml holds defaults that templates insert, overridable per environment.'),
          q('What does helm template do?', [
            'Installs the chart into the cluster',
            'Deletes a release',
            'Renders the final YAML without installing it',
            'Downloads a chart from a repository',
          ], 2, 'Rendering lets you review exactly what would be applied before changing the cluster.'),
          q('What does helm rollback restore?', [
            'Only the container image tag',
            'Only the database schema',
            'The previous kubectl context',
            'All manifests of a previous release revision',
          ], 3, 'Helm tracks releases as revisions, and rollback reapplies an entire earlier revision.'),
        ]
      ),
      lesson('Kustomize Overlays', 13, `
Kustomize takes a different approach from Helm: instead of templates, it starts from plain Kubernetes YAML and applies patches for each environment. It is built into kubectl, requires no templating language, and many teams find it simpler for their own applications.

### Base and overlays

\`\`\`text
k8s/
  base/
    deployment.yaml
    service.yaml
    kustomization.yaml
  overlays/
    staging/
      kustomization.yaml
      replicas-patch.yaml
    prod/
      kustomization.yaml
      replicas-patch.yaml
      resources-patch.yaml
\`\`\`

The base holds manifests common to all environments. Each overlay references the base and changes only what differs.

### The base kustomization

\`\`\`yaml
# k8s/base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
labels:
  - pairs:
      app: bazaar-api
\`\`\`

### A production overlay

\`\`\`yaml
# k8s/overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: shop-prod
resources:
  - ../../base
images:
  - name: ghcr.io/mehranmart/bazaar-api
    newTag: "1.5.1"
patches:
  - path: replicas-patch.yaml
configMapGenerator:
  - name: bazaar-config
    literals:
      - LOG_LEVEL=warn
      - FEATURE_EXPRESS_DELIVERY=true
\`\`\`

\`\`\`yaml
# k8s/overlays/prod/replicas-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bazaar-api
spec:
  replicas: 4
\`\`\`

### Applying

\`\`\`bash
kubectl kustomize k8s/overlays/prod       # render and review
kubectl apply -k k8s/overlays/prod        # apply
\`\`\`

### Useful Kustomize features

| Feature | Purpose |
|---|---|
| \`images\` | Change image names or tags without editing manifests |
| \`patches\` | Modify specific fields per environment |
| \`namespace\` | Set the namespace for all resources |
| \`configMapGenerator\` and \`secretGenerator\` | Create ConfigMaps with a hash suffix in the name |
| \`namePrefix\` / \`nameSuffix\` | Distinguish resources, for example per feature branch |

The generated hash suffix is especially useful: when configuration changes, the ConfigMap name changes, the Deployment references the new name, and Kubernetes performs a rolling restart automatically. This solves the "environment variables do not update" problem from chapter 8.

### Helm or Kustomize?

| Situation | Often preferred |
|---|---|
| Distributing software for others to install | Helm |
| Installing third-party software | Helm charts from the vendor |
| Your own application across a few environments | Kustomize, or a simple Helm chart |
| Teams wanting plain YAML with no templating | Kustomize |

They also combine: some teams render a Helm chart and then apply Kustomize patches on top. Both are well supported by GitOps tools.

### Preview changes before applying

\`\`\`bash
kubectl diff -k k8s/overlays/prod
\`\`\`

\`kubectl diff\` compares what the overlay would produce with what is currently running and prints only the differences. Running it before every production change, or in a pull request pipeline, shows reviewers exactly what will change in the cluster and catches surprises, such as an accidental replica change, before they happen.

### Keep overlays small

If an overlay changes most of the base, the base is not really shared. Keep differences focused on what genuinely varies, such as replicas, resources, hostnames and configuration, so reviewers can see at a glance how environments differ.
      `,
        [
          q('How does Kustomize differ from Helm?', [
            'Kustomize requires a templating language',
            'Kustomize patches plain YAML instead of using templates',
            'Kustomize only works on managed clusters',
            'Kustomize cannot change image tags',
          ], 1, 'Kustomize applies overlays and patches to plain manifests, without templating.'),
          q('What does configMapGenerator\'s hash suffix achieve?', [
            'Encrypts the ConfigMap',
            'Makes the ConfigMap immutable in etcd',
            'Shortens the ConfigMap name',
            'Configuration changes trigger rolling restarts automatically',
          ], 3, 'A changed hash gives a new ConfigMap name, updating the pod template and restarting pods.'),
          q('Which command applies a Kustomize overlay?', [
            'helm install -k',
            'kubectl create -f overlay',
            'kubectl apply -k k8s/overlays/prod',
            'kustomize deploy prod',
          ], 2, 'kubectl has Kustomize built in, applying a directory with -k.'),
        ]
      ),
      lesson('Image Tags, Registries and Pull Secrets', 12, `
Every deployment references a container image, and how you tag and store images decides whether deployments are predictable, traceable and secure. Mistakes here cause some of the most confusing production problems: pods running different versions, or updates that never seem to take effect.

### Tagging strategies

| Tag style | Example | Notes |
|---|---|---|
| latest | \`bazaar-api:latest\` | Avoid for deployments; unclear which version runs |
| Semantic version | \`bazaar-api:1.5.1\` | Clear for releases |
| Git commit SHA | \`bazaar-api:3f9c2ab\` | Precisely traceable to source code |
| Both | \`1.5.1\` and \`3f9c2ab\` on the same image | Human-friendly and traceable |

Treat tags as immutable: once \`1.5.1\` is pushed, never push different content with the same tag. Many registries can enforce tag immutability.

### The latest tag problem

With \`image: bazaar-api:latest\`, different nodes may cache different images, all called \`latest\`. Pods on one node run last week's code while pods on another run today's. Rollbacks become impossible because there is no earlier tag to return to. Use specific versions.

### imagePullPolicy

| Policy | Behaviour |
|---|---|
| IfNotPresent | Pull only if the node does not already have the image (default for specific tags) |
| Always | Check the registry every time a pod starts (default for \`latest\`) |
| Never | Only use images already on the node |

With immutable version tags, \`IfNotPresent\` is efficient and safe.

### Digests for strict environments

For maximum certainty, reference images by digest:

\`\`\`yaml
image: ghcr.io/mehranmart/bazaar-api@sha256:<digest>
\`\`\`

Some teams resolve tags to digests during deployment, so the exact tested image is guaranteed to run.

### Private registries and pull secrets

Production images usually live in private registries. Nodes need credentials to pull them:

\`\`\`bash
kubectl create secret docker-registry ghcr-creds -n shop \\
  --docker-server=ghcr.io \\
  --docker-username=mehranmart-bot \\
  --docker-password="$GHCR_TOKEN"
\`\`\`

\`\`\`yaml
spec:
  imagePullSecrets:
    - name: ghcr-creds
  containers:
    - name: api
      image: ghcr.io/mehranmart/bazaar-api:1.5.1
\`\`\`

Alternatively, attach the secret to the namespace's default service account, so every pod uses it automatically. On managed clusters, nodes can often pull from the same cloud's registry using cloud identity, without any pull secrets.

### Registry hygiene

- Use a dedicated robot account or token with read-only access for pulling.
- Enable vulnerability scanning in the registry or CI.
- Set retention rules to delete old untagged images and save storage.
- Mirror important public images to your own registry, avoiding rate limits and outages of public registries.

### Diagnosing pull problems

\`ImagePullBackOff\` usually means one of three common things: the name or tag is wrong, the image does not exist for the node's CPU architecture, or credentials are missing or wrong. \`kubectl describe pod\` shows the exact error message from the registry.
      `,
        [
          q('Why avoid deploying with the latest tag?', [
            'latest images cannot be pulled',
            'Kubernetes rejects the latest tag',
            'Nodes may run different versions, and rollbacks become unclear',
            'latest images are always larger',
          ], 2, 'A moving tag gives no clear version, causing inconsistent pods and impossible rollbacks.'),
          q('What does treating tags as immutable mean?', [
            'Never pushing different content under an existing tag',
            'Never deleting any images',
            'Only using the latest tag',
            'Encrypting every image',
          ], 0, 'Immutable tags ensure a version name always refers to the same image content.'),
          q('How do nodes pull images from a private registry?', [
            'They cannot; private images must be public',
            'By using the developer\'s personal password',
            'By building the image on each node',
            'With pull secrets or cloud identity for the node',
          ], 3, 'Pull secrets or workload and node identity provide registry credentials.'),
        ]
      ),
      lesson('A CI/CD Pipeline to Kubernetes', 13, `
Manual deployments are slow and risky: someone forgets a step, deploys from a local change or uses the wrong cluster. A CI/CD pipeline automates building, testing, scanning and deploying, so every release follows the same tested path.

### The pipeline stages

\`\`\`text
Push or pull request
  1. Test          unit and integration tests
  2. Build         container image, tagged with version and commit SHA
  3. Scan          vulnerabilities and misconfigurations
  4. Push          image to the registry
  5. Deploy        to staging automatically
  6. Verify        smoke tests against staging
  7. Promote       to production, often after approval
\`\`\`

### A GitHub Actions example

\`\`\`yaml
name: build-and-deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/mehranmart/bazaar-api:\${{ github.sha }}
\`\`\`

The image is tagged with the exact commit, so every deployment is traceable to its source.

### Two ways to deploy

| Approach | How it works | Trade-offs |
|---|---|---|
| Push-based | The pipeline runs \`kubectl apply\` or \`helm upgrade\` against the cluster | Simple; the pipeline needs cluster credentials |
| Pull-based (GitOps) | The pipeline updates manifests in Git; a tool in the cluster, such as Argo CD or Flux, applies them | Git is the source of truth; the cluster pulls changes; no cluster credentials in CI |

A GitOps flow for Bazaar:

\`\`\`text
1. CI builds and pushes bazaar-api:3f9c2ab.
2. CI opens a pull request updating the image tag in the manifests repository.
3. After review and merge, Argo CD detects the change and syncs the cluster.
4. Argo CD reports sync status and health; drift from Git is detected and corrected.
\`\`\`

### Credentials done safely

For push-based deploys, avoid long-lived cluster admin credentials stored as CI secrets. Prefer short-lived credentials, such as OpenID Connect federation between GitHub Actions and the cloud provider, and a deployer identity with only the permissions it needs in specific namespaces.

### Safety checks before production

- Validate manifests: \`kubectl apply --dry-run=server\`, \`helm lint\`, or policy checks.
- Run smoke tests after deploying to staging: the health endpoint and a few key API calls.
- Watch rollout status and fail the pipeline if it does not complete in time.
- Keep a manual approval step for production if your team needs one.

### Rolling back quickly

Because every image is tagged and every manifest change is in Git, rollback is simple: revert the Git commit (GitOps) or redeploy the previous tag or Helm revision (push-based). Practise rollbacks in staging, so the team knows the steps before an emergency.

### What good looks like

A developer merges a pull request, and within minutes the change is tested, scanned, deployed to staging and verified, with a clear record of what changed and how to undo it. That reliability, more than any individual tool, is the goal of CI/CD.
      `,
        [
          q('Why tag images with the Git commit SHA in CI?', [
            'SHAs make images smaller',
            'Registries require SHA tags',
            'Every deployment is traceable to exact source code',
            'It removes the need for tests',
          ], 2, 'Commit-based tags link each running image to the code that produced it.'),
          q('What is a key feature of pull-based GitOps?', [
            'A tool in the cluster applies changes from Git, so CI needs no cluster credentials',
            'Developers apply manifests from their laptops',
            'Images are built inside the cluster',
            'Git is not used',
          ], 0, 'GitOps controllers pull desired state from Git, keeping credentials out of CI pipelines.'),
          q('What is a safer alternative to storing long-lived cluster credentials in CI?', [
            'Sharing the admin kubeconfig in the repository',
            'Emailing credentials to the team',
            'Disabling authentication on the cluster',
            'Short-lived credentials through OIDC federation with limited permissions',
          ], 3, 'Federated, short-lived, least-privilege credentials reduce the impact of a leak.'),
        ]
      ),
      ],
      [
      q('Which tool is typically used to install third-party software like monitoring stacks?', [
        'Kustomize overlays only',
        'Helm charts',
        'kubectl exec',
        'Docker Compose',
      ], 1, 'Vendors and communities commonly publish Helm charts for installing their software.'),
      q('What should overlays in Kustomize mainly contain?', [
        'Complete copies of every base manifest',
        'Secrets in plain text',
        'Only the differences for that environment',
        'Container image layers',
      ], 2, 'Small overlays make environment differences clear and keep the base truly shared.'),
      q('A pod shows ImagePullBackOff for a private image. What should you check?', [
        'The autoscaler\'s minimum and maximum replicas',
        'The Service selector and its target port',
        'The liveness probe\'s timeout settings',
        'The image reference and pull credentials',
      ], 3, 'Pull failures come from wrong references, missing architectures or missing credentials.'),
      q('What makes rollback simple in a well-built pipeline?', [
        'Deleting the namespace',
        'Versioned images and manifest changes recorded in Git',
        'Rebuilding images from scratch',
        'Using the latest tag everywhere',
      ], 1, 'Traceable images and Git history let teams redeploy or revert to a known good state quickly.'),
      ]
    ),
    chapter(
      'Security and Troubleshooting',
      'Control who can do what with RBAC and service accounts, harden pods with security contexts and Pod Security Standards, troubleshoot failing pods, services and nodes systematically, and use events, logs and metrics to see inside the cluster.',
      [
      lesson('RBAC and Service Accounts', 13, `
A Kubernetes cluster is used by people, such as developers and operators, and by software, such as applications, CI pipelines and controllers. Role-based access control (RBAC) decides what each of them may do. Getting RBAC right is one of the most important security tasks in any cluster.

### The four RBAC objects

| Object | Scope | Purpose |
|---|---|---|
| Role | One namespace | A set of permissions within that namespace |
| ClusterRole | Whole cluster | Permissions cluster-wide, or reusable across namespaces |
| RoleBinding | One namespace | Grants a Role or ClusterRole to users, groups or service accounts in that namespace |
| ClusterRoleBinding | Whole cluster | Grants a ClusterRole everywhere |

Permissions are additive: there are no "deny" rules. A subject can do exactly what its bindings allow and nothing else.

### A Role for developers in one namespace

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: shop
rules:
  - apiGroups: ["", "apps"]
    resources: ["pods", "pods/log", "services", "deployments", "configmaps"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developers-shop
  namespace: shop
subjects:
  - kind: Group
    name: shop-developers
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
\`\`\`

Developers in the \`shop-developers\` group can manage workloads in \`shop\`, but cannot read Secrets, delete resources, or touch other namespaces. Quick imperative equivalents exist too:

\`\`\`bash
kubectl create role pod-reader --verb=get,list,watch --resource=pods -n shop
kubectl create rolebinding read-pods --role=pod-reader --user=ayesha -n shop
\`\`\`

### Checking permissions

\`\`\`bash
kubectl auth can-i delete deployments -n shop
kubectl auth can-i list secrets -n shop --as=ayesha
kubectl auth can-i get pods -n shop --as=system:serviceaccount:shop:bazaar-api
\`\`\`

\`auth can-i\` answers yes or no, and impersonation with \`--as\` lets administrators verify another identity's permissions. Use it to test RBAC changes before relying on them.

### Service accounts: identities for pods

Pods authenticate to the Kubernetes API using service accounts. Every namespace has a \`default\` service account, and pods use it unless told otherwise. Most applications never call the Kubernetes API and need no permissions at all:

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: bazaar-api
  namespace: shop
automountServiceAccountToken: false
\`\`\`

\`\`\`yaml
spec:
  serviceAccountName: bazaar-api
\`\`\`

Turning off the automatic token mount means that if the application is compromised, the attacker does not get a Kubernetes API token from inside the pod. Applications that do need API access, such as a controller, get a dedicated service account bound to a minimal Role.

### Cloud access without static keys

Pods often need cloud resources, such as object storage or a queue. Rather than storing cloud access keys in Secrets, managed clusters support workload identity: a service account is linked to a cloud identity, and pods receive short-lived cloud credentials automatically. This removes long-lived keys entirely.

### Principles

- Grant the least privilege needed, in the narrowest namespace.
- Bind permissions to groups rather than individual users where possible.
- Avoid \`cluster-admin\` for daily work, and never for applications.
- Review bindings regularly and remove access when people change roles.
      `,
        [
          q('What is the difference between a Role and a ClusterRole?', [
            'Roles are for users; ClusterRoles are for pods',
            'A Role applies within one namespace; a ClusterRole applies cluster-wide or is reusable',
            'ClusterRoles can deny permissions',
            'There is no difference',
          ], 1, 'Roles are namespaced, while ClusterRoles cover cluster-scoped resources or reusable permission sets.'),
          q('What does kubectl auth can-i do?', [
            'Creates a new Role',
            'Deletes a user\'s access',
            'Checks whether an identity may perform an action',
            'Rotates service account tokens',
          ], 2, 'auth can-i answers permission questions, including for other identities with --as.'),
          q('Why set automountServiceAccountToken: false for most applications?', [
            'It makes pods start faster',
            'It is required for Deployments',
            'It enables workload identity',
            'A compromised app then cannot use a Kubernetes API token',
          ], 3, 'Apps that do not need API access should not carry a token an attacker could steal.'),
        ]
      ),
      lesson('Pod Security and Security Contexts', 13, `
RBAC controls who can create pods; pod security controls what those pods are allowed to do. A pod running as root with extra privileges can do far more damage if compromised than a locked-down one. Kubernetes provides security contexts to harden pods and Pod Security Standards to enforce baselines across namespaces.

### Security contexts

Security settings can be applied at pod and container level:

\`\`\`yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: api
      image: ghcr.io/mehranmart/bazaar-api:1.5.1
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
      volumeMounts:
        - name: tmp
          mountPath: /tmp
  volumes:
    - name: tmp
      emptyDir: {}
\`\`\`

| Setting | Effect |
|---|---|
| \`runAsNonRoot: true\` | The pod is refused if the image would run as root |
| \`runAsUser\` | A specific non-root user ID |
| \`fsGroup\` | Group ownership for mounted volumes, so the user can write to them |
| \`allowPrivilegeEscalation: false\` | Processes cannot gain more privileges than their parent |
| \`readOnlyRootFilesystem: true\` | The container's filesystem cannot be modified |
| \`capabilities.drop: ALL\` | Removes Linux capabilities the app does not need |
| \`seccompProfile: RuntimeDefault\` | Restricts dangerous system calls |

These match the Docker hardening from chapter 3, now expressed in Kubernetes. The \`emptyDir\` volume gives the application a writable \`/tmp\` while the rest of the filesystem stays read-only.

### Pod Security Standards

Kubernetes defines three standard security profiles:

| Level | Meaning |
|---|---|
| Privileged | No restrictions; for trusted system components only |
| Baseline | Prevents known privilege escalations, such as privileged containers and host networking |
| Restricted | Strong hardening: non-root, no privilege escalation, dropped capabilities, seccomp |

### Enforcing standards with Pod Security Admission

The built-in Pod Security Admission controller enforces a level per namespace using labels:

\`\`\`bash
kubectl label namespace shop \\
  pod-security.kubernetes.io/enforce=restricted \\
  pod-security.kubernetes.io/warn=restricted
\`\`\`

Pods that violate the \`restricted\` standard are now rejected in \`shop\`, with a message explaining which fields are wrong. The \`warn\` and \`audit\` modes report violations without blocking, useful for introducing standards gradually:

\`\`\`text
1. Label namespaces with warn=restricted and audit=restricted.
2. Fix workloads that produce warnings.
3. Switch to enforce=restricted when they are clean.
\`\`\`

### Policy engines for more rules

Pod Security Standards cover common risks. For organisation-specific rules, such as "images must come from our registry", "every Deployment needs resource requests" or "no latest tags", teams use policy engines like Kyverno or OPA Gatekeeper, which validate or even modify resources as they are created.

### Other hardening layers

- Keep nodes and Kubernetes versions patched; managed services make this easier.
- Restrict access to the API server's network endpoint where possible.
- Enable audit logging to record who did what.
- Scan images in CI and the registry (chapter 3).
- Apply network policies (chapter 7).

Security in Kubernetes is layered: no single setting makes a cluster secure, but together these controls greatly reduce the damage any single failure can cause.
      `,
        [
          q('What does readOnlyRootFilesystem: true do?', [
            'Makes volumes read-only',
            'Prevents modifying the container\'s filesystem',
            'Stops the container from reading files',
            'Encrypts the container image',
          ], 1, 'The container\'s root filesystem becomes immutable, while mounted volumes like emptyDir remain writable.'),
          q('How is a Pod Security Standard enforced on a namespace?', [
            'By creating a NetworkPolicy',
            'By installing a Helm chart in every pod',
            'By setting CPU limits',
            'By labelling the namespace for Pod Security Admission',
          ], 3, 'Namespace labels such as enforce=restricted tell the admission controller which level to apply.'),
          q('Why start with warn and audit modes before enforce?', [
            'Enforce mode is not available in Kubernetes',
            'Warn mode blocks more pods',
            'Violations are reported without breaking workloads, allowing gradual fixes',
            'Audit mode deletes non-compliant pods',
          ], 2, 'Reporting first lets teams fix workloads before enforcement starts rejecting them.'),
        ]
      ),
      lesson('Troubleshooting Pods, Services and Nodes', 14, `
Things break in every cluster: a new release crashes, a service stops responding, a node runs out of disk. Engineers who troubleshoot calmly and systematically resolve incidents in minutes; those who guess can take hours. A consistent method, from pod to service to node, is the key skill.

### Start with the pod

\`\`\`bash
kubectl get pods -n shop
kubectl describe pod <pod> -n shop
kubectl logs <pod> -n shop
kubectl logs <pod> -n shop --previous
\`\`\`

\`describe\` shows the pod's events at the bottom, which usually explain the problem. \`logs --previous\` shows output from the last crashed container, essential for CrashLoopBackOff.

### Common pod problems

| Status | Usual causes | Where to look |
|---|---|---|
| Pending | Not enough resources, unsatisfiable node selectors, PVC not bound | \`describe pod\` events; node capacity; PVC status |
| ImagePullBackOff | Wrong image name or tag, missing pull secret, architecture mismatch | \`describe pod\` events |
| CrashLoopBackOff | Application error, missing configuration, failing liveness probe | \`logs --previous\`; environment and ConfigMaps |
| OOMKilled | Memory limit too low, or a leak | \`describe pod\` last state; memory metrics |
| Running but not Ready | Readiness probe failing | \`describe pod\`; probe endpoint; dependencies |
| CreateContainerConfigError | Referenced ConfigMap or Secret missing | \`describe pod\` events |

### Debugging inside a pod

\`\`\`bash
kubectl exec -it <pod> -n shop -- sh
\`\`\`

For minimal images without a shell, attach an ephemeral debug container:

\`\`\`bash
kubectl debug -it <pod> -n shop --image=busybox:1.36 --target=api
\`\`\`

The debug container shares the pod's network and can see the target container's processes, letting you test connectivity and inspect behaviour without rebuilding the image.

### When the Service does not work

\`\`\`text
1. kubectl get svc bazaar-api -n shop          does it exist, correct ports?
2. kubectl get endpointslices -n shop -l kubernetes.io/service-name=bazaar-api
                                               are there endpoints?
3. Compare the Service selector with pod labels   do they match exactly?
4. Check targetPort matches the containerPort     is traffic sent to the right port?
5. Check pods are Ready                           unready pods are excluded
6. Test from inside the cluster with a debug pod   DNS and connectivity
7. Check network policies                         is traffic blocked?
\`\`\`

Most Service problems are a selector mismatch or a wrong \`targetPort\`.

### When the node is the problem

\`\`\`bash
kubectl get nodes
kubectl describe node <node>
kubectl top nodes
\`\`\`

Look at node conditions, such as \`MemoryPressure\`, \`DiskPressure\` and \`Ready\`. Under pressure, the kubelet evicts pods, starting with BestEffort ones. A node that is \`NotReady\` may have lost network connectivity or have a failing kubelet. To perform maintenance, drain a node safely:

\`\`\`bash
kubectl cordon <node>          # no new pods scheduled here
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <node>        # after maintenance
\`\`\`

### A calm incident routine

\`\`\`text
1. What is the user impact? (status page, error rates)
2. What changed recently? (deployments, config, infrastructure)
3. Narrow it down: pod -> service -> ingress -> node -> dependency
4. Mitigate first (roll back, scale up), then find the root cause
5. Write down what happened and how to prevent it
\`\`\`

Rolling back a bad release often restores service faster than debugging it live. Find the root cause after users are no longer affected.
      `,
        [
          q('Which command shows logs from a container\'s previous crashed run?', [
            'kubectl logs <pod> --previous',
            'kubectl get pods --crashed',
            'kubectl describe logs',
            'kubectl top pod',
          ], 0, '--previous retrieves the logs of the last terminated container instance.'),
          q('A pod shows CreateContainerConfigError. What is a likely cause?', [
            'The node is out of disk',
            'The image is too large',
            'The HPA scaled it down',
            'A referenced ConfigMap or Secret is missing',
          ], 3, 'Missing configuration objects prevent the container from being created.'),
          q('What is the most common reason a Service sends traffic nowhere?', [
            'The cluster has too many nodes',
            'The selector does not match pod labels, or targetPort is wrong',
            'The Service type is ClusterIP',
            'The namespace is too long',
          ], 1, 'Selector mismatches and wrong ports are the usual causes of empty or failing Services.'),
        ]
      ),
      lesson('Events, Logs and Metrics in the Cluster', 12, `
Troubleshooting commands answer "what is wrong right now?". Observability answers broader questions: what happened overnight, which service is slowing down, is the cluster running out of capacity? Kubernetes produces events, logs and metrics, and production clusters collect them centrally.

### Events

Events record what Kubernetes components did: scheduling decisions, image pulls, probe failures, scaling and evictions.

\`\`\`bash
kubectl get events -n shop --sort-by=.lastTimestamp
kubectl get events -n shop --field-selector type=Warning
\`\`\`

Events are stored only for a limited time, often around an hour by default, so collect them into a central system if you need history.

### Logs

\`\`\`bash
kubectl logs -l app=bazaar-api -n shop --since=15m
kubectl logs deploy/bazaar-api -c api -n shop -f
\`\`\`

\`kubectl logs\` reads logs from nodes, but when a pod is deleted or a node is replaced, its logs are gone. Production clusters run a log collector, usually as a DaemonSet, that ships container logs to a central store:

| Option | Notes |
|---|---|
| Loki with Grafana | Label-based log storage, popular with Kubernetes |
| Elasticsearch or OpenSearch | Powerful full-text search |
| Cloud logging services | Built into managed Kubernetes offerings |

Structured JSON logs with request IDs, as recommended in chapter 2, make these systems far more useful.

### Metrics

| Source | Provides |
|---|---|
| metrics-server | Current CPU and memory for \`kubectl top\` and the HPA |
| Prometheus | Time-series metrics collected from applications, nodes and Kubernetes |
| kube-state-metrics | The state of Kubernetes objects: replicas available, pods restarting, jobs failing |
| Node exporter | Node-level CPU, memory, disk and network |

Grafana dashboards display these metrics, and alert rules notify the team when something goes wrong.

### What to alert on

Alerts should point to real problems that need action:

\`\`\`text
- Error rate or latency of user-facing services above target
- Pods restarting repeatedly (CrashLoopBackOff)
- Deployments with fewer available replicas than desired for several minutes
- Pods Pending for more than a few minutes
- Nodes NotReady or under disk or memory pressure
- Persistent volumes nearly full
- Certificates close to expiry
\`\`\`

Avoid alerting on every minor fluctuation; teams that receive too many alerts start ignoring them.

### Tracing

For requests passing through many services, distributed tracing shows where time is spent. OpenTelemetry is the common standard for instrumenting applications, with backends such as Jaeger, Tempo or cloud tracing services displaying the traces.

### Observability as a habit

Set up logging, metrics and alerts before launching, not after the first incident. Review dashboards after each release to confirm error rates and latency stayed healthy. Over time, these signals turn operating a cluster from anxious guesswork into informed, calm decisions.
      `,
        [
          q('Why collect events into a central system?', [
            'Events cannot be viewed with kubectl',
            'Central systems make events faster',
            'Events are kept only for a limited time in the cluster',
            'Events are only created in production',
          ], 2, 'Short retention means historical investigation needs events stored elsewhere.'),
          q('Why run a log collector as a DaemonSet?', [
            'It runs on every node to ship all container logs centrally',
            'DaemonSets make logs smaller',
            'Only DaemonSets can read logs',
            'It replaces the need for structured logs',
          ], 0, 'One collector per node captures logs from every container before pods or nodes disappear.'),
          q('Which is a good alert condition?', [
            'Any single CPU spike for one second',
            'Every new pod created',
            'Every log line containing the word info',
            'Pods restarting repeatedly or staying Pending for several minutes',
          ], 3, 'Alerts should signal real, actionable problems rather than normal fluctuations.'),
        ]
      ),
      ],
      [
      q('Which RBAC object grants a Role to a group in one namespace?', [
        'ClusterRole',
        'ServiceAccount',
        'RoleBinding',
        'NetworkPolicy',
      ], 2, 'RoleBindings connect subjects to Roles or ClusterRoles within a namespace.'),
      q('Which setting refuses to run a pod whose image would run as root?', [
        'runAsNonRoot: true',
        'fsGroup: 0',
        'privileged: true',
        'hostNetwork: true',
      ], 0, 'runAsNonRoot makes the kubelet reject containers that would start as root.'),
      q('How can you debug a distroless container without a shell?', [
        'Rebuild the image with a shell every time',
        'Use kubectl top',
        'Delete the pod and hope',
        'Attach an ephemeral debug container with kubectl debug',
      ], 3, 'Ephemeral debug containers bring tools into the pod without changing the image.'),
      q('During an incident, what should usually come first?', [
        'Writing the postmortem',
        'Refactoring the code',
        'Mitigating user impact, such as rolling back',
        'Upgrading Kubernetes',
      ], 2, 'Restoring service first limits harm; root cause analysis follows once users are unaffected.'),
      ]
    ),
    chapter(
      'Production and Certification',
      'Compare managed Kubernetes on EKS, AKS and GKE, deploy a complete application end to end, prepare effectively for the hands-on CKAD exam, and plan a career in DevOps and platform engineering.',
      [
      lesson('Managed Kubernetes: EKS, AKS and GKE', 13, `
Running a Kubernetes control plane yourself means managing etcd, upgrades, certificates and high availability. Most organisations avoid this by using a managed Kubernetes service, where the cloud provider runs the control plane and integrates the cluster with its networking, storage and identity services.

### The big three

| Service | Provider | Notable features |
|---|---|---|
| Amazon EKS | AWS | Deep AWS integration; managed node groups; Karpenter for fast node autoscaling |
| Azure AKS | Microsoft Azure | Integration with Microsoft Entra ID; strong fit for Microsoft-centric organisations |
| Google GKE | Google Cloud | Mature automation; Autopilot mode manages nodes for you |

Other providers, such as DigitalOcean, Linode (Akamai) and several regional clouds, offer simpler managed Kubernetes that suits smaller teams and budgets.

### What the provider manages and what you manage

| Provider typically manages | You typically manage |
|---|---|
| Control plane availability and upgrades | Your workloads, manifests and Helm charts |
| etcd backups | Node pool sizing and upgrade timing (unless fully managed modes) |
| Integration with cloud load balancers and disks | RBAC, network policies and security settings |
| Security patches for control plane components | Application observability and costs |

Modes such as GKE Autopilot and similar serverless node options on other clouds go further, managing nodes too, so you pay per pod resources rather than per node.

### Cloud integrations you will use

- **Load balancers**: Services of type LoadBalancer and Gateway or Ingress controllers create cloud load balancers.
- **Storage classes**: persistent volumes backed by cloud disks or file storage.
- **Identity**: workload identity links service accounts to cloud roles, as chapter 11 described.
- **Registries**: nodes pull from the provider's container registry using their identity.
- **Logging and monitoring**: built-in integration with the provider's observability tools.

### Choosing a provider

The best choice usually follows the organisation's existing cloud. If the company runs on AWS, EKS integrates most naturally; if it relies on Microsoft, AKS; if it uses Google Cloud, GKE. The Kubernetes skills you learned apply equally to all of them, since the API is the same.

### Region and latency

For users in Pakistan, choose a region close to your users to reduce latency. Providers operate regions in the Middle East and South Asia, among others; check which regions offer the services you need. Organisations in regulated sectors, such as banks, must also follow regulator guidance on cloud use and where data may be stored.

### Cost awareness

Managed Kubernetes costs include the control plane fee (varies by provider and tier), nodes, load balancers, storage, data transfer and logging. Common savings:

\`\`\`text
- Right-size requests so nodes are well utilised (chapter 9)
- Use cluster autoscaling to remove idle nodes at night
- Use spot or preemptible nodes for fault-tolerant workloads
- Share one load balancer through Ingress or Gateway
- Delete forgotten test clusters and unused volumes
\`\`\`

Check each provider's current pricing pages, since models and prices change.

### Upgrades are your responsibility too

Kubernetes releases new minor versions regularly, and each is supported for a limited period. Managed services help, but you must plan upgrades: check deprecated APIs in your manifests, test in staging, then upgrade production. Falling far behind makes upgrades harder and can leave clusters on unsupported versions.
      `,
        [
          q('What does a managed Kubernetes service typically take care of?', [
            'Writing your application manifests',
            'Running and upgrading the control plane, including etcd',
            'Designing your RBAC roles',
            'Choosing your application\'s resource requests',
          ], 1, 'Providers operate the control plane, while you manage workloads, security settings and costs.'),
          q('How should an organisation usually choose between EKS, AKS and GKE?', [
            'Always choose the cheapest regardless of existing systems',
            'Choose the one with the most letters',
            'Follow the organisation\'s existing cloud provider',
            'Use all three for every application',
          ], 2, 'Integration with existing identity, networking and tools usually makes the current cloud the best fit.'),
          q('Why must upgrades be planned even on managed Kubernetes?', [
            'Managed services never upgrade clusters',
            'Upgrades delete all workloads',
            'Kubernetes has only one version',
            'Deprecated APIs and limited support windows require testing and timely upgrades',
          ], 3, 'Each version has a support window, and manifests using removed APIs must be updated before upgrading.'),
        ]
      ),
      lesson('Deploying a Complete Application', 14, `
Bringing every chapter together, this lesson walks through deploying Bazaar's complete stack to a cluster: a React front end, the Node.js API, a background worker, PostgreSQL and Redis. Building this yourself is the best preparation for real work and a strong portfolio project.

### The architecture

\`\`\`text
Users -> HTTPS -> Gateway or Ingress
                   /            \\
          bazaar-web          bazaar-api  <-> Redis (cache, queue)
          (static React)          |
                                  v
                          PostgreSQL (managed service or operator)
                                  ^
                          bazaar-worker (processes the queue)
\`\`\`

### The manifests you need

| Component | Kubernetes objects |
|---|---|
| Front end | Deployment, Service, HTTPRoute or Ingress path \`/\` |
| API | Deployment, Service, HTTPRoute or Ingress path \`/api\`, HPA, PodDisruptionBudget |
| Worker | Deployment with KEDA or HPA scaling, no Service |
| Redis | Helm chart or managed service |
| PostgreSQL | Managed database, or operator-managed cluster |
| Configuration | ConfigMap per environment, Secrets from an external manager |
| Security | ServiceAccounts, RBAC, NetworkPolicies, restricted Pod Security |
| Delivery | Helm chart or Kustomize overlays, CI pipeline, GitOps |

### A production-ready API Deployment checklist

\`\`\`text
[ ] Image pinned to a version or commit tag, from a private registry
[ ] Resource requests and memory limit set
[ ] Startup, liveness and readiness probes configured
[ ] Runs as non-root with a restrictive security context
[ ] Dedicated ServiceAccount with no token mounted unless needed
[ ] Configuration from ConfigMaps; credentials from Secrets
[ ] At least 2 to 3 replicas, spread across nodes or zones
[ ] HPA with sensible minimum and maximum replicas
[ ] PodDisruptionBudget to keep replicas available during node maintenance
[ ] Graceful shutdown handled for SIGTERM
\`\`\`

### PodDisruptionBudgets

During planned maintenance, such as node upgrades, pods are evicted from nodes. A PodDisruptionBudget ensures enough replicas stay available:

\`\`\`yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: bazaar-api
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: bazaar-api
\`\`\`

Node drains wait rather than evict pods that would drop availability below two.

### Database migrations

Run schema migrations as a Kubernetes Job before rolling out a new API version, either from the CI pipeline or with a Helm hook. Keep migrations backward compatible, as chapters 6 and 10 discussed, so old and new pods can run together during the rollout.

### Verifying the deployment

\`\`\`bash
kubectl get pods,svc,hpa,pdb -n shop
kubectl rollout status deploy/bazaar-api -n shop
curl -s https://bazaar.pk/api/health
kubectl get events -n shop --field-selector type=Warning
\`\`\`

Then run a small load test, watch the HPA scale, kill a pod and watch it recover, and try a rollback. Seeing these behaviours with your own eyes builds real confidence.

### Document it

A clear README describing the architecture, how to deploy each environment, how to roll back and where dashboards live turns your project into something an employer can evaluate quickly, and it mirrors the documentation real teams maintain.
      `,
        [
          q('What does a PodDisruptionBudget protect against?', [
            'Application crashes caused by code bugs',
            'Image pull failures from a private registry',
            'Too many evictions during maintenance',
            'Unauthorised access to the Kubernetes API',
          ], 2, 'PDBs limit voluntary disruptions, such as node drains, so enough replicas stay available.'),
          q('When should database migrations run relative to a new API rollout?', [
            'Before rolling out, as a Job, with backward-compatible changes',
            'After deleting the old database',
            'Only manually from a developer\'s laptop',
            'Never, Kubernetes handles schema changes automatically',
          ], 0, 'Running compatible migrations first lets old and new pods work during the rollout.'),
          q('Why kill a pod and trigger a rollback while testing a deployment?', [
            'Kubernetes requires it before going live',
            'It makes the cluster faster',
            'It removes old images',
            'To confirm self-healing and rollback work as expected',
          ], 3, 'Practising failure and recovery builds confidence that the system behaves correctly under stress.'),
        ]
      ),
      lesson('Preparing for the CKAD Exam', 13, `
The Certified Kubernetes Application Developer (CKAD) certification, from the Linux Foundation and the Cloud Native Computing Foundation, demonstrates that you can design, build and run applications on Kubernetes. Unlike multiple-choice exams, it is performance-based: you solve real tasks in live clusters from the command line, under time pressure.

### What the exam covers

The curriculum is published by the Linux Foundation and updated periodically. It has been organised around domains such as:

| Domain | Topics from this course |
|---|---|
| Application design and build | Images, Dockerfiles, Jobs, CronJobs, multi-container pods, volumes |
| Application deployment | Deployments, rolling updates, rollbacks, Helm, Kustomize |
| Application observability and maintenance | Probes, logs, debugging, API deprecations |
| Application environment, configuration and security | ConfigMaps, Secrets, resources, quotas, service accounts, security contexts |
| Services and networking | Services, Ingress, network policies |

Download the current curriculum and candidate handbook before preparing, and check the exam length, passing score, retake policy and validity period, since these details can change.

### What the exam feels like

- You work in a terminal connected to several clusters, switching context between tasks.
- The official Kubernetes documentation is available during the exam; other websites are not.
- Tasks carry different weights; skipping a hard task and returning later is often wise.
- Speed matters as much as knowledge.

### Speed techniques

\`\`\`bash
alias k=kubectl
export do="--dry-run=client -o yaml"

k run nginx --image=nginx $do > pod.yaml
k create deploy web --image=nginx --replicas=3 $do > deploy.yaml
k expose deploy web --port=80 --target-port=8080 $do > svc.yaml
k create cm app-config --from-literal=MODE=prod $do > cm.yaml
k create secret generic db --from-literal=password=x $do > secret.yaml
k create job report --image=busybox $do -- echo done > job.yaml
k create cronjob nightly --image=busybox --schedule="0 2 * * *" $do -- date > cron.yaml
\`\`\`

Generating YAML imperatively and editing it is much faster than writing manifests from scratch. Also practise:

- \`kubectl explain <resource>.<field>\` to recall field names.
- Switching context and namespace at the start of every task: \`k config use-context <ctx>\`.
- Editing live objects with \`k edit\` and replacing with \`k replace --force -f\`.
- Using a terminal text editor, such as vim or nano, efficiently.

### A study plan

\`\`\`text
Weeks 1 to 2: Rework chapters 5 to 9 hands-on in a kind cluster
Week 3:       Practise tasks by domain, timing yourself
Week 4:       Full timed practice exams; review every mistake
Week 5:       Weak areas; speed drills; read the handbook rules
\`\`\`

Many candidates use the practice sessions included with exam registration, plus community practice question sets, to get used to the format.

### Common mistakes

- Working in the wrong context or namespace, the most expensive error.
- Not verifying: after creating something, check it with \`k get\` and \`k describe\`.
- Spending too long on one task.
- Forgetting the \`--\` before a command in \`k run\` or \`k create job\`.

### Related certifications

| Certification | Focus |
|---|---|
| KCNA | Entry-level cloud native concepts, multiple choice |
| CKAD | Application development on Kubernetes |
| CKA | Cluster administration: installation, upgrades, troubleshooting nodes |
| CKS | Kubernetes security; requires CKA |

CKAD is a natural first hands-on certification for developers; CKA suits those moving towards operations and platform roles.
      `,
        [
          q('What makes the CKAD exam different from multiple-choice exams?', [
            'It has no time limit',
            'It only tests Docker commands',
            'It is performance-based, solving real tasks in live clusters',
            'It is taken on paper',
          ], 2, 'Candidates complete hands-on tasks at the command line within a time limit.'),
          q('Why generate YAML with --dry-run=client -o yaml during the exam?', [
            'It is much faster than writing manifests from scratch',
            'The exam requires every object to be printed',
            'It applies objects to all clusters at once',
            'It makes YAML files smaller',
          ], 0, 'Imperative generation creates a correct starting manifest in seconds, saving precious time.'),
          q('What is the most expensive common mistake in the CKAD exam?', [
            'Using aliases',
            'Reading the documentation',
            'Skipping a hard task temporarily',
            'Working in the wrong context or namespace',
          ], 3, 'Tasks done in the wrong cluster or namespace score nothing, so context must be set every time.'),
        ]
      ),
      lesson('Careers in DevOps and Platform Engineering', 12, `
Container and Kubernetes skills open several career paths, from developers who deploy their own services to specialists who build platforms used by hundreds of engineers. Demand has grown steadily, both in Pakistan's software industry and in remote roles for international companies.

### Roles that use these skills

| Role | Focus |
|---|---|
| Back-end developer | Writes services, Dockerfiles and Kubernetes manifests for their own applications |
| DevOps engineer | Builds CI/CD pipelines, automates infrastructure, supports deployments |
| Site reliability engineer (SRE) | Reliability, monitoring, incident response and capacity |
| Platform engineer | Builds internal platforms and golden paths so teams can ship easily and safely |
| Cloud engineer | Designs and operates cloud infrastructure, often including managed Kubernetes |
| DevSecOps engineer | Security across pipelines, images and clusters |

### Skills that grow alongside Kubernetes

- **Linux and networking**: processes, file systems, DNS, TCP, TLS; the foundation beneath containers.
- **A cloud provider**: AWS, Azure or Google Cloud in depth.
- **Infrastructure as code**: Terraform or OpenTofu, and provider-native tools.
- **CI/CD and GitOps**: GitHub Actions, GitLab CI, Argo CD or Flux.
- **Observability**: Prometheus, Grafana, logging systems and OpenTelemetry.
- **Scripting and programming**: Bash plus Python or Go for automation.
- **Security**: RBAC, secrets management, supply chain security.

### Building a portfolio

Employers value proof. Strong portfolio pieces include:

\`\`\`text
- A GitHub repository deploying a multi-service app to Kubernetes,
  with Helm or Kustomize, a CI pipeline and a clear README
- Infrastructure as code that creates a managed cluster
- A write-up of a problem you debugged and how you fixed it
- Dashboards and alerts for your project, with screenshots
\`\`\`

A cost-conscious approach is to build on local clusters with kind or minikube, then briefly deploy to a cloud free tier or trial, deleting resources afterwards to avoid bills.

### Getting started in Pakistan

Many software houses, fintechs, telecoms and banks in Karachi, Lahore and Islamabad run containers and Kubernetes, and hire both junior DevOps engineers and developers comfortable with deployment. Practical routes:

- Start as a developer who owns the deployment of your team's services.
- Apply for junior DevOps or cloud support roles, then grow into platform work.
- Contribute to open source projects in the cloud native ecosystem; documentation fixes are a welcome first step.
- Join local and online cloud native communities and meetups to learn and network.

### Remote and international work

DevOps and platform roles are frequently remote. Clear written communication, reliable availability for on-call rotations when required, and documented, reproducible work build trust with international teams. Certifications such as CKAD or CKA can help your CV stand out when employers cannot meet you in person.

### Keep learning

The cloud native ecosystem changes quickly: new versions, new tools and new practices appear every year. Follow Kubernetes release notes, read engineering blogs from companies you admire, and rebuild your projects as tools evolve. Engineers who combine solid fundamentals with steady learning remain valuable as specific tools come and go.
      `,
        [
          q('What does a platform engineer mainly build?', [
            'Mobile app interfaces',
            'Marketing campaigns',
            'Internal platforms that let teams ship easily and safely',
            'Database schemas for every team',
          ], 2, 'Platform engineers create paved paths and self-service tools for other engineering teams.'),
          q('What is a cost-conscious way to build a Kubernetes portfolio?', [
            'Keep large cloud clusters running permanently',
            'Avoid using any clusters',
            'Only read documentation',
            'Build locally with kind or minikube, then briefly use a free tier and clean up',
          ], 3, 'Local clusters cost nothing, and short cloud experiments with cleanup avoid unexpected bills.'),
          q('Which foundation skill underpins containers and Kubernetes?', [
            'Linux and networking fundamentals',
            'Graphic design',
            'Video editing',
            'Spreadsheet formatting',
          ], 0, 'Containers are Linux processes with networking, so these fundamentals support everything else.'),
        ]
      ),
      ],
      [
      q('What does GKE Autopilot mode manage in addition to the control plane?', [
        'Your application code',
        'The nodes that run your pods',
        'Your Git repositories',
        'Your team\'s RBAC design',
      ], 1, 'Autopilot and similar modes manage nodes, charging per pod resources.'),
      q('Which item belongs on a production-ready Deployment checklist?', [
        'Using the latest image tag',
        'Running as root for simplicity',
        'A single replica on one node',
        'Probes, resource requests and a non-root security context',
      ], 3, 'Probes, resources and hardened security contexts are core production requirements.'),
      q('Which resource is available to you during the CKAD exam?', [
        'Any search engine',
        'Personal notes on paper',
        'The official Kubernetes documentation',
        'Community forums',
      ], 2, 'The exam allows the official Kubernetes documentation, so practise finding information there.'),
      q('Which certification focuses on cluster administration?', [
        'KCNA',
        'CKAD',
        'CKA',
        'KCSA',
      ], 2, 'The CKA covers installing, upgrading and troubleshooting clusters, while CKAD covers applications.'),
      ]
    ),
  ],
  final: [
    q('What do containers share that virtual machines do not?', [
      'Their container images',
      'The host operating system\'s kernel',
      'Their network cables',
      'Their application code',
    ], 1, 'Containers are isolated processes on a shared kernel, while VMs each run their own kernel.'),
    q('What does docker run -p 8080:80 nginx do with ports?', [
      'Limits the container to 80 MB',
      'Runs Nginx version 8080',
      'Blocks port 80 on the host',
      'Maps host port 8080 to container port 80',
    ], 3, 'Port mappings list the host port first and the container port second.'),
    q('Why copy dependency manifests before source code in a Dockerfile?', [
      'Dependency installs stay cached when only code changes',
      'Docker forbids copying code first',
      'It makes containers run as root',
      'It removes the need for .dockerignore',
    ], 0, 'Ordering layers from rarely to frequently changing keeps expensive steps cached.'),
    q('What is the main benefit of a multi-stage build?', [
      'Running two apps in one container',
      'Skipping the Dockerfile',
      'Small final images without build tools',
      'Faster internet downloads',
    ], 2, 'Only the built output and runtime reach the final image.'),
    q('Inside a container, what does localhost refer to?', [
      'The developer\'s laptop',
      'The database container',
      'The container itself',
      'The Docker registry',
    ], 2, 'Each container has its own network namespace, so localhost means the container.'),
    q('How do services in the same Compose project reach each other?', [
      'By service name on the network Compose creates',
      'Only through published host ports',
      'Through the host\'s public IP',
      'They cannot communicate',
    ], 0, 'Compose\'s project network provides DNS for service names.'),
    q('Which Kubernetes component stores the cluster\'s state?', [
      'kubelet',
      'etcd',
      'kube-proxy',
      'The container runtime',
    ], 1, 'etcd holds all cluster data, accessed through the API server.'),
    q('What does the declarative model in Kubernetes mean?', [
      'Running commands one by one on each server',
      'Writing shell scripts for every change',
      'Logging into nodes to start containers',
      'Declaring desired state and letting controllers reconcile it',
    ], 3, 'Controllers continuously work to make actual state match the declared state.'),
    q('What happens when a pod managed by a Deployment is deleted?', [
      'A replacement pod is created',
      'The Deployment is deleted',
      'The node restarts',
      'Nothing happens',
    ], 0, 'The ReplicaSet restores the desired replica count by creating a new pod.'),
    q('Why are readiness probes important for rolling updates?', [
      'They restart crashed containers',
      'New pods receive traffic only when able to serve',
      'They pull images faster',
      'They delete old ReplicaSets',
    ], 1, 'Readiness gates traffic and rollout progress on real application readiness.'),
    q('Which Service type is the internal-only default?', [
      'NodePort',
      'LoadBalancer',
      'ExternalName',
      'ClusterIP',
    ], 3, 'ClusterIP exposes a Service only inside the cluster.'),
    q('What is needed for an Ingress resource to route traffic?', [
      'A StatefulSet',
      'A CronJob',
      'An Ingress controller in the cluster',
      'A NodePort for every path',
    ], 2, 'Ingress rules only take effect when a controller implements them.'),
    q('Why is committing a Kubernetes Secret manifest to Git unsafe?', [
      'Git cannot store YAML',
      'Secrets are deleted after commit',
      'Kubernetes rejects Secrets from Git',
      'Base64 values are easily decoded',
    ], 3, 'Base64 is only encoding, so the secret value is effectively in plain text.'),
    q('What does a StatefulSet provide that a Deployment does not?', [
      'Stable pod names and per-pod persistent storage',
      'Automatic database replication',
      'Faster image pulls',
      'Built-in load balancers',
    ], 0, 'StatefulSets give each pod a stable identity and its own volume claim.'),
    q('What happens when a container exceeds its memory limit?', [
      'It is slowed down',
      'It moves to another node',
      'It is killed and restarted',
      'Its limit increases automatically',
    ], 2, 'Memory cannot be throttled, so exceeding the limit triggers an OOM kill.'),
    q('What does the Horizontal Pod Autoscaler change?', [
      'The CPU limit of each container',
      'The number of pod replicas',
      'The number of nodes directly',
      'The image tag of the Deployment',
    ], 1, 'The HPA adjusts replica counts based on metrics like CPU utilisation.'),
    q('Why avoid deploying images tagged latest?', [
      'Nodes may run different versions and rollbacks become unclear',
      'latest images cannot be pulled',
      'Kubernetes rejects the latest tag',
      'latest images are always larger',
    ], 0, 'A moving tag hides which version runs and breaks reliable rollback.'),
    q('What does kubectl auth can-i check?', [
      'Whether a pod is healthy',
      'Whether an image exists',
      'Whether a node has capacity',
      'Whether an identity may perform an action',
    ], 3, 'auth can-i tests RBAC permissions, including for other identities with --as.'),
    q('Which command shows logs from a previously crashed container?', [
      'kubectl describe logs',
      'kubectl logs <pod> --previous',
      'kubectl get events --logs',
      'kubectl top pod',
    ], 1, '--previous retrieves output from the last terminated container instance.'),
    q('What is the most expensive common mistake in the CKAD exam?', [
      'Using kubectl aliases',
      'Reading the documentation',
      'Working in the wrong context or namespace',
      'Skipping a task to return later',
    ], 2, 'Work done in the wrong cluster or namespace earns no marks.'),
    q('`docker run -d ubuntu:24.04` prints a container ID, yet `docker ps` shows nothing a moment later. What is the most likely reason?', [
      'The image failed to download, so the container never started',
      'Detached containers appear only in the output of docker ps -a',
      'Its main process, a shell with no input attached, exited at once',
      'Ubuntu images need --privileged before they can keep running',
    ], 2, 'A container lives only as long as its main process; the Ubuntu image\'s default command is a shell, which exits immediately when no interactive input is attached, so the container stops.'),
    q('A production manifest must always run exactly the image bytes that passed testing, even if someone later pushes a different image under the same tag. How should it reference the image?', [
      'By digest, such as ghcr.io/shop/api@sha256:<digest>',
      'By a version tag, such as ghcr.io/shop/api:1.4.0',
      'By the latest tag, with imagePullPolicy set to Always',
      'By repository name only, letting the registry choose',
    ], 0, 'Tags are movable pointers, while a digest identifies the exact image content, so a digest reference can never silently change to different bytes.'),
    q('A Dockerfile ends with `ENTRYPOINT ["node"]` and `CMD ["server.js"]`. What runs for `docker run shop-api worker.js`?', [
      'node server.js worker.js',
      'node worker.js',
      'worker.js on its own, without node',
      'node server.js, ignoring the argument',
    ], 1, 'Arguments after the image name replace CMD while ENTRYPOINT stays fixed, so the container runs node with worker.js as its argument.'),
    q('A Dockerfile declares `ARG APP_VERSION` and is built with `--build-arg APP_VERSION=1.4.0`, but the running app reads `process.env.APP_VERSION` as undefined. Why?', [
      'The --build-arg flag is ignored unless the ARG has a default value',
      'ARG values are visible only to CMD, not to the application process',
      'Node.js cannot read environment variables that were set in a build',
      'ARG values exist only while building unless copied into an ENV',
    ], 3, 'ARG is a build-time variable and is not stored in the image\'s runtime environment; adding `ENV APP_VERSION=$APP_VERSION` carries the value into containers.'),
    q('`docker run -d -p 5432:5432 postgres:16` fails with "port is already allocated". Which change keeps the database reachable from the host?', [
      'Map a free host port instead, such as -p 5433:5432',
      'Change the container side instead, such as -p 5432:5433',
      'Add --network host so that the ports can no longer clash',
      'Drop -p, since Docker then picks a free host port itself',
    ], 0, 'The host side of the mapping clashes with whatever already holds 5432; mapping host port 5433 to the container\'s 5432 avoids it while Postgres keeps listening on its usual port inside.'),
    q('A Dockerfile has `RUN apt-get update` and then, on its own line, `RUN apt-get install -y curl`. Months later someone adds git to the install line, and the build fails with 404 errors for package files. Why?', [
      'Changing the install line forces the base image to be pulled again',
      'apt-get can install only one package per RUN instruction in a build',
      'The cached update layer holds a stale index; run both in one RUN',
      'The base image has expired and must be pulled again by a new digest',
    ], 2, 'The unchanged `RUN apt-get update` line is served from the layer cache, so the new install runs against an old package index whose files have left the mirror; `apt-get update && apt-get install` in one RUN keeps them in step.'),
    q('A Dockerfile has stages named deps, test and runtime, where test builds on deps. What does `docker build --target test .` do?', [
      'Builds every stage, then runs the tests inside runtime',
      'Builds the stages that test needs and stops at test',
      'Builds runtime and copies the test results into it',
      'Builds the final runtime stage and tags it as test',
    ], 1, '--target stops the build at the named stage, so only that stage and the stages it depends on are built; CI uses this to run a test stage that production builds skip.'),
    q('An image copies the app with `COPY . .` and then switches to `USER node`. The app crashes with EACCES when writing to /app/uploads. Which fix keeps the container non-root?', [
      'Remove USER node so that the app runs as root again',
      'Run the container with --read-only so writes go to memory',
      'Add EXPOSE /app/uploads so the directory becomes writable',
      'Copy with --chown=node:node so the node user owns the files',
    ], 3, 'COPY creates files owned by root by default, so the node user cannot write to them; `COPY --chown=node:node` gives the runtime user ownership without giving the container root.'),
    q('A Compose file puts web on a frontend network and db on a backend network, so web can never reach db. How should api, which talks to both, be connected?', [
      'Attach api to both the frontend and backend networks',
      'Put api on the default network and publish db\'s port',
      'Attach api to frontend only and reach db by its IP address',
      'Give api network_mode: host so it can see every network',
    ], 0, 'A container can join several networks and resolve service names on each, so api reaches both while web and db still share no network.'),
    q('`docker compose up -d --scale worker=3` works, but `--scale api=3` fails. The api service publishes `8080:3000`. Why?', [
      'Compose can scale only services that are built from a Dockerfile',
      'A service with a health check can run as only one container',
      'Only one container can bind the fixed host port 8080',
      'Scaling needs Kubernetes, so Compose rejects the flag for api',
    ], 2, 'Every api replica would try to publish the same host port, and only one container can bind it; the worker publishes no port, so it scales freely.'),
    q('During a sale, a teammate runs `kubectl scale deployment api --replicas=6`. The manifest in Git still says `replicas: 3`, and CI later runs `kubectl apply -f` with it. What happens?', [
      'It stays at 6, since live changes take priority over files',
      'The Deployment goes back to 3 replicas, matching the file',
      'apply refuses to run until the difference is resolved',
      'It settles at 9, since apply adds the two values together',
    ], 1, 'apply makes the live object match the declared state, so the manual change is overwritten; lasting changes belong in the manifest in Git.'),
    q('`kubectl get pods` prints "No resources found in default namespace", yet the team\'s app is serving traffic. What is the likely explanation?', [
      'The pods run on worker nodes, which kubectl cannot list',
      'Pods are hidden unless kubectl runs on a control plane node',
      'The app runs from a Deployment, and kubectl lists only bare pods',
      'The pods live in another namespace; add -n <name> or use -A',
    ], 3, 'kubectl queries the current context\'s namespace, default here, so pods in another namespace appear only with -n or across all namespaces with -A.'),
    q('A Job\'s pod fails on every attempt because its input file is missing. What stops Kubernetes from retrying forever?', [
      'backoffLimit, which marks the Job failed after that many retries',
      'restartPolicy: Always, which caps container restarts at three',
      'ttlSecondsAfterFinished, which halts retries once it expires',
      'Nothing: a Job keeps retrying until someone deletes it by hand',
    ], 0, 'A Job retries failed pods with back-off until backoffLimit is reached (six by default) and then marks the Job as failed.'),
    q('A CronJob runs every 10 minutes with `concurrencyPolicy: Forbid`, and one run takes 25 minutes. What happens to the runs scheduled while it is still going?', [
      'They start alongside it as extra parallel Jobs',
      'The running Job is stopped and replaced by the new one',
      'No new Job starts while the current one is running',
      'They queue up and all run back to back once it ends',
    ], 2, 'Forbid skips a scheduled run while the previous Job is still active; Allow would run them in parallel, and Replace would cancel the running Job.'),
    q('A Deployment\'s image has been updated three times with `kubectl set image`. What does `kubectl get replicasets` show for it?', [
      'One ReplicaSet, edited in place to the newest image each time',
      'One ReplicaSet with the pods, plus older ones scaled to 0',
      'Four ReplicaSets, each still running a share of the replicas',
      'No ReplicaSets, since Deployments manage their pods directly',
    ], 1, 'Each rollout creates a new ReplicaSet and scales the previous one to zero, keeping it (up to revisionHistoryLimit) so kubectl rollout undo can scale it back up.'),
    q('A Service has `port: 80` and `targetPort: 8080`, and its endpoints list the right pods, but the containers listen on 3000. What happens to requests sent to the Service?', [
      'They succeed, because kube-proxy finds the container\'s real port',
      'They succeed, because port 80 maps straight into the container',
      'The API server rejects the Service as an invalid object',
      'They fail, because traffic goes to port 8080 where nothing listens',
    ], 3, 'A Service forwards to targetPort on each selected pod, so with nothing listening on 8080 the connections are refused even though the endpoints look healthy.'),
    q('An Ingress rule for path `/api` uses `pathType: Exact`. Requests to `/api/orders` get a 404 from the ingress controller. Why?', [
      'Exact matches only /api itself; Prefix is needed for sub-paths',
      'Exact rules apply only to hosts that have a TLS certificate',
      'The backend Service must also be named api for the path to match',
      'Paths must end with a slash, so the rule should say /api/',
    ], 0, 'With pathType Exact the URL path must equal /api exactly; pathType Prefix matches /api and every path beneath it, such as /api/orders.'),
    q('A client must connect to each database replica individually, by name, instead of through one load-balanced address. Which Service fits?', [
      'A NodePort Service, which gives each pod its own node port',
      'A LoadBalancer Service, which assigns one external IP per pod',
      'A headless Service, whose DNS returns each pod\'s own address',
      'A ClusterIP Service, whose virtual IP rotates between the pods',
    ], 2, 'Setting clusterIP: None makes DNS return the individual pod addresses, and with a StatefulSet each pod also gets a stable name such as postgres-0.postgres.'),
    q('A ConfigMap with the keys `app.properties` and `LOG_LEVEL` is mounted as a volume at /etc/config. What does the container see?', [
      'One file at /etc/config that holds both keys as YAML',
      'Two files, /etc/config/app.properties and /etc/config/LOG_LEVEL',
      'Environment variables named app.properties and LOG_LEVEL',
      'Nothing, until envFrom is also added to the container spec',
    ], 1, 'Mounting a ConfigMap as a volume creates one file per key, named after the key and containing its value.'),
    q('A StatefulSet named postgres, using volumeClaimTemplates, is scaled from 3 replicas to 2. What happens to the claim data-postgres-2?', [
      'It is deleted with the pod, and its data is lost',
      'It is reattached to postgres-0 to balance storage',
      'It is snapshotted and then removed automatically',
      'It is kept, and reattached if postgres-2 returns',
    ], 3, 'By default a StatefulSet does not delete the claims it created when it scales down, so the data survives and postgres-2 gets the same claim back when the set scales up again.'),
    q('During a traffic spike, a container reaches its CPU limit. What happens to it?', [
      'It is throttled and slows down, but keeps running',
      'It is OOMKilled and then restarted by the kubelet',
      'It is evicted and rescheduled onto another node',
      'Its limit is raised automatically to match demand',
    ], 0, 'CPU is compressible, so exceeding the CPU limit only throttles the container; it is exceeding the memory limit that gets a container killed.'),
    q('Which resources setting gives a single-container pod the Guaranteed QoS class?', [
      'CPU and memory requests set, with no limits at all',
      'A memory limit set, with CPU left completely unset',
      'CPU and memory limits set equal to their requests',
      'A memory request set higher than the memory limit',
    ], 2, 'Guaranteed requires every container to have CPU and memory requests equal to its limits; such pods are the last to be evicted under node pressure.'),
    q('`helm upgrade --install shop ./chart -f values-prod.yaml --set replicaCount=5` runs, where values.yaml sets replicaCount to 2 and values-prod.yaml sets it to 4. What value is rendered?', [
      '2, because the chart\'s own values.yaml always wins',
      '4, because a values file overrides any --set flag',
      'None, because Helm refuses conflicting value sources',
      '5, because --set overrides both values files',
    ], 3, 'Helm layers values: the chart\'s values.yaml first, then -f files, then --set flags, so the --set value of 5 wins.'),
    q('You fix a typo in a chart\'s Deployment template, and the application itself is unchanged. What should change in Chart.yaml?', [
      'Bump appVersion and leave version unchanged',
      'Bump version and leave appVersion unchanged',
      'Bump both, since the two must always match',
      'Nothing, since only values.yaml is versioned',
    ], 1, 'version is the chart\'s own version and changes whenever templates or defaults change; appVersion records the application\'s version, which has not changed.'),
    q('In a CI/CD pipeline that deploys to Kubernetes, where does the image vulnerability scan belong?', [
      'After the image is built and before it is pushed or deployed',
      'After deployment, by scanning pods already serving traffic',
      'Before the build, by scanning only the Dockerfile\'s text',
      'Once a month on the release branch, to save CI minutes',
    ], 0, 'Scanning the built image before it is pushed and deployed lets the pipeline stop a release with serious findings before it reaches any cluster.'),
    q('A RoleBinding in namespace shop grants the built-in ClusterRole view to user sana. What can sana do?', [
      'Read most resources in every namespace of the cluster',
      'Nothing, since a RoleBinding cannot use a ClusterRole',
      'Read most resources, but only in the shop namespace',
      'Edit resources in shop, as ClusterRoles grant full access',
    ], 2, 'A RoleBinding always grants within its own namespace, so a reusable ClusterRole bound this way gives view permissions in shop only.'),
    q('After adding `readOnlyRootFilesystem: true`, the app crashes because it writes temporary files to /tmp. Which fix keeps the root filesystem read-only?', [
      'Add privileged: true so the container may write anywhere',
      'Run the container as root so it is allowed to write to /tmp',
      'Set allowPrivilegeEscalation: true on the container',
      'Mount an emptyDir volume at /tmp for the scratch files',
    ], 3, 'An emptyDir mounted at /tmp gives the app a writable scratch directory while the rest of the filesystem stays read-only.'),
    q('`kubectl top pods` fails with "Metrics API not available". What is the most likely cause?', [
      'The pods have no CPU or memory limits set',
      'The metrics server is not installed in the cluster',
      'kubectl top works only when run on a control plane node',
      'The pods have been running for less than 24 hours',
    ], 1, 'kubectl top reads the Metrics API, which the metrics server provides; without it, as on a fresh local cluster, there is no usage data to show.'),
    q('When deploying a complete stack of front end, API, background worker, Redis and PostgreSQL, which component normally gets a Deployment but no Service?', [
      'The background worker that pulls jobs from the queue',
      'The Node.js API that the front end calls over HTTP',
      'The React front end that browsers load through Ingress',
      'The Redis instance the API uses as a cache and queue',
    ], 0, 'The worker only pulls jobs from the queue and receives no inbound traffic, so nothing needs a stable address for it; the front end and API both sit behind Services.'),
    q('During a rolling update, Kubernetes sends SIGTERM to an old API pod. What should the application do?', [
      'Exit at once, since SIGKILL follows immediately after',
      'Ignore it, since only SIGKILL actually stops a container',
      'Restart itself so the pod stays in the Service\'s endpoints',
      'Stop taking new requests, finish in-flight ones, then exit',
    ], 3, 'SIGTERM starts a grace period (30 seconds by default) before SIGKILL, so a well-behaved app drains in-flight work and closes connections instead of failing requests mid-rollout.'),
  ],
});
