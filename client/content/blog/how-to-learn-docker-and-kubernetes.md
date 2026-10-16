---
title: "How to learn Docker and Kubernetes, step by step"
description: How to learn Docker and Kubernetes in the right order, from your first container to a local cluster, with a 7 week plan and a free course to follow.
author: Umair
date: 2026-10-16
tags: [devops, docker, kubernetes]
targetQuery: how to learn docker and kubernetes
image: /blog/covers/how-to-learn-docker-and-kubernetes.webp
imageAlt: "Stacks of shipping containers from several lines on a quayside, with blue gantry cranes behind them under a clear sky"
course: docker-kubernetes
---

The way to learn Docker and Kubernetes is in that order, and with your hands on a terminal the whole time. Spend the first few weeks on Docker alone: run containers, write Dockerfiles for your own apps, and wire several services together with Docker Compose. Only once a container feels ordinary should you start Kubernetes, on a free local cluster on your own laptop, not a cloud account. Kubernetes runs containers. If you do not understand the container, every Kubernetes error will look like magic.

This page is the plan we would give a friend. Our free [Docker & Kubernetes](/learn/docker-kubernetes) course follows the same order across 12 chapters, so you can read this as the map and use the course as the road.

## What Docker and Kubernetes actually do

**Docker** packages an application with everything it needs to run: the runtime, libraries, system files and default configuration. That package is an image, and a running copy of it is a container. The image runs the same way on your laptop, a test server and production, which ends the old "works on my machine" argument.

**Kubernetes** decides where and how many containers run across a group of machines, restarts them when they crash, replaces them during an update without downtime, and gives them stable network addresses. One container on one server does not need it. Twenty services across five servers very much do.

| | Docker | Kubernetes |
| --- | --- | --- |
| Main job | Build and run containers | Run many containers across many machines |
| Unit you work with | Image, container | Pod, Deployment, Service |
| Where you start | Your laptop | A local cluster with kind or minikube |
| Config files | Dockerfile, compose.yaml | YAML manifests, Helm charts |
| Useful alone? | Yes, from day one | Only after you know containers |

## Should you learn Docker before Kubernetes?

Yes. You can type Kubernetes commands without Docker, but you will not be able to debug anything. When a pod shows `CrashLoopBackOff`, the cause is almost always inside the container: a wrong port, a missing environment variable, a process that exits immediately. Those are Docker skills.

The honest prerequisites are smaller than people fear:

- **Comfort with a terminal.** Changing directories, reading files, running commands, reading an error message instead of panicking at it.
- **One application you understand.** A small Node, Python or PHP API is perfect. Containerising your own code teaches far more than containerising a sample.
- **Basic Git.** You will keep Dockerfiles and manifests in a repository. If that is new, do the free [Git & GitHub](/learn/git-github) course first, it is a short detour.

You do not need a cloud account or a powerful machine. A laptop that runs Docker comfortably is enough for the whole plan.

## How to learn Docker and Kubernetes: a 7 week plan

The course is set at 7 weeks, from beginner to intermediate, and the plan below matches it. Roughly an hour a day, five days a week, is a realistic pace alongside a job or university.

| Week | Focus | You are done when |
| --- | --- | --- |
| 1 | Containers, images, everyday commands | You can run, stop, inspect and remove containers without looking things up |
| 2 | Dockerfiles, smaller and safer images | Your own app has a multi-stage Dockerfile that runs as a non-root user |
| 3 | Volumes, networks, Docker Compose | Your app, a database and a cache start together with one command |
| 4 | Kubernetes architecture, kubectl, a local cluster | You can create a cluster with kind or minikube and apply a manifest |
| 5 | Workloads and networking | Your app runs as a Deployment behind a Service and Ingress, and you can roll it back |
| 6 | Config, storage, health and scaling | Settings come from ConfigMaps and Secrets, probes work, and limits are set |
| 7 | Helm, CI/CD, security, troubleshooting | A pipeline builds your image and deploys it, and you can explain why a pod failed |

### Weeks 1 to 3: Docker until it is boring

Learn why containers exist, the commands you will use daily, and write a Dockerfile for your own project. The early mistakes are predictable:

- **Copying all your code before installing dependencies.** Docker caches layers, so copy the dependency manifest first, install, then copy the code. Rebuilds become much faster.
- **Shipping build tools to production.** Multi-stage builds compile in one stage and copy only the result into a small final image.
- **Running as root by default.** It works, which is exactly why people never fix it. Add a non-root user and scan your images.
- **Storing data inside the container.** A container is disposable. Database files belong in a volume.

Finish this stage with Docker Compose: one file that starts your API, a PostgreSQL database and Redis on a shared network where they find each other by name. It improves your daily development setup even if you never touch Kubernetes.

### Weeks 4 to 7: Kubernetes on your own laptop

Learn the parts of a cluster, the control plane and the worker nodes, then create a local cluster with kind or minikube. Both give you a real Kubernetes API, so the manifests you write locally work the same way on a production cluster.

Then build up one layer at a time with the same app you containerised: a Pod, then a Deployment with several replicas, then a rolling update and a rollback, then a Service and Ingress in front of it. Then add configuration, storage, probes, limits, Helm and a pipeline.

Two pieces of advice. First, read `kubectl describe` and `kubectl get events` before searching the internet; the answer is usually printed there. Second, learn what Secrets do not do. By default they are only base64 encoded, not encrypted, so anyone who can read them in the cluster can read your passwords.

## What the free course covers, chapter by chapter

The [Docker & Kubernetes course](/learn/docker-kubernetes) has 12 chapters and 48 lessons, about eight hours of reading in total, and every lesson ends with a short quiz.

1. **Containers From First Principles.** Why containers changed deployment, containers versus virtual machines, installing Docker, and how images, layers and registries fit together.
2. **Working With Docker Every Day.** Daily commands, your first Dockerfile, environment variables, ports and logs, and debugging with `exec` and `inspect`.
3. **Building Better Images.** Layer caching, multi-stage builds, choosing base images, scanning for vulnerabilities and running as non-root.
4. **Data, Networks and Docker Compose.** Volumes and bind mounts, container DNS, multi-container apps and Compose for development.
5. **Kubernetes Architecture and kubectl.** Why orchestration is needed, the control plane and worker nodes, a local cluster with kind or minikube, and YAML manifests.
6. **Running Workloads.** Pods, Deployments and ReplicaSets, rolling updates and rollbacks, Jobs, CronJobs and DaemonSets.
7. **Networking in Kubernetes.** ClusterIP, NodePort and LoadBalancer Services, Ingress and the Gateway API, DNS, and network policies.
8. **Configuration and Storage.** ConfigMaps, Secrets and their limits, persistent volumes and claims, and StatefulSets.
9. **Health, Resources and Scaling.** Liveness, readiness and startup probes, requests and limits, the Horizontal Pod Autoscaler, and namespaces with quotas.
10. **Packaging and Delivery.** Helm charts, Kustomize overlays, image tags and pull secrets, and a CI/CD pipeline to Kubernetes.
11. **Security and Troubleshooting.** RBAC and service accounts, security contexts, troubleshooting pods, services and nodes, and events, logs and metrics.
12. **Production and Certification.** Managed Kubernetes on EKS, AKS and GKE, deploying a complete application, preparing for the CKAD exam, and careers in DevOps and platform engineering.

The complete application in the last chapter is a realistic stack: a React front end, a Node.js API, a background worker, Redis and PostgreSQL. It is a good model for the portfolio project you should build yourself.

## Who this is for, and who should wait

This path suits backend and full stack developers who want to deploy their own work, students heading towards DevOps or cloud roles, and anyone preparing for the CKAD. If you are still learning to program, wait. Build and finish a couple of small apps first, perhaps with our [Node.js backend course](/learn/nodejs-backend), then come back. Containers make far more sense once you have felt the pain of deploying something by hand.

If you want the wider picture of where Docker and Kubernetes sit next to Linux, CI/CD, cloud and monitoring, read our [DevOps roadmap](/blog/devops-roadmap) and the [Cloud & DevOps Essentials](/learn/cloud-devops) course alongside this one.

## How the free certificate works

Each lesson unlocks its quiz after 90 seconds of reading, and you need 70 percent to pass it. The course ends with a final exam of 50 questions in 60 minutes, and you pass with 50 out of 100 marks. You get one timed attempt; if it goes badly, a single retake opens 30 days later. Pass, and you receive a certificate with a verification code anyone can check.

Be clear about what it is. It shows you passed our exam. It is not the CKAD, which is a hands-on exam run by the Linux Foundation and the CNCF, where you solve real tasks in live clusters. The course prepares you for that exam's topics, but only the official exam gives you that credential. For employers, a public repository with a clean Dockerfile, a Compose file and working manifests will say more than any certificate. Our post on [whether free online certificates are worth anything](/blog/are-free-online-certificates-worth-anything) goes into this honestly.

## Frequently Asked Questions (FAQ)

### How long does it take to learn Docker and Kubernetes?
At about an hour a day, plan on around seven weeks to reach a solid beginner to intermediate level: roughly three weeks for Docker and four for Kubernetes. Production confidence takes longer.

### Can I learn Kubernetes without learning Docker first?
You can follow Kubernetes tutorials, but you will struggle to fix anything. Most failing pods fail because of something inside the container image, so learn to build and debug containers first.

### Do I need a cloud account or a powerful computer?
No. Docker runs on an ordinary laptop, and kind or minikube give you a real Kubernetes cluster locally for free.

### Is Docker still used now that Kubernetes does not need it?
Yes. Kubernetes runs containers through a container runtime such as containerd, but images built with Docker follow the same open standard and run fine. Docker remains the everyday tool for building images and running local development setups.

### Is the Docker & Kubernetes course really free?
Yes. All 48 lessons, the quizzes, the final exam and the certificate are free, with no trial or payment step.

### Will this course prepare me for the CKAD exam?
It covers the topics the CKAD is built around and has a lesson on how the exam works. Practise the tasks in a terminal until they are fast, and check the official curriculum and handbook from the Linux Foundation before you book.

*Ready to start? The free [Docker & Kubernetes](/learn/docker-kubernetes) course begins with why containers changed deployment and takes you all the way to a complete application on Kubernetes.*
