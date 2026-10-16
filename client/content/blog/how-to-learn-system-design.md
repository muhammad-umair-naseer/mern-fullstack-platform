---
title: "How to learn system design: a roadmap from scratch"
description: How to learn system design step by step, from estimation and caching to sharding and interviews, with a study plan, worked designs and a free course.
author: Umair
date: 2026-10-16
tags: [programming, system-design, interviews]
targetQuery: how to learn system design
course: system-design
home: /learn/system-design
image: /blog/covers/how-to-learn-system-design.webp
imageAlt: "Aerial view of a large highway interchange with curving overpasses and landscaped gardens between the roads"
---

The way to learn system design is to learn a small set of building blocks in order, then practise putting them together under time pressure. Start with requirements and rough capacity estimates, then APIs and data storage, then caching, load balancing and queues, then how databases scale, then consistency and failure handling. After that, work through full designs such as a URL shortener or a chat system, and redo each one from memory. Reading alone does not build the skill; explaining designs out loud and defending them does.

This guide lays out that order as a roadmap, explains what "ready to move on" looks like at each stage, lists the mistakes that waste the most time, and walks through our free [System Design course](/learn/system-design) chapter by chapter so you can judge whether it fits you before you start.

## What system design actually is

Writing code that works for one user is programming. Designing something that keeps working for a very large number of users, survives a server dying in the middle of the night, and can still be changed by a team two years later is system design.

The course opens with an example that anyone who has ordered food in Pakistan will recognise. A developer builds an ordering app for a few restaurants in Karachi on one server and one database. It works. Then a delivery partnership brings in a flood of new users, orders spike at iftar time, the database locks up, and the app goes down at the worst possible moment. The code was fine. The system around it was never designed for that load.

System design is the habit of asking, before you build, how many users, what happens when this part fails, and what you will give up to keep the important things fast and reliable.

## How to learn system design: the roadmap

| Stage | What you learn | You are ready to move on when |
| --- | --- | --- |
| 1. Reasoning about scale | Functional and non-functional requirements, back of the envelope estimation, latency numbers | You can turn "a food app for a city" into rough requests per second and storage per year |
| 2. Interfaces and storage | API design, REST, GraphQL and gRPC, relational versus NoSQL, indexes | You can justify a data store from access patterns, not habit |
| 3. Speed and capacity | Caching, CDNs, load balancers, stateless services, autoscaling | You can explain what happens to a request at each layer and where it gets cached |
| 4. Decoupling | Message queues, pub/sub, delivery guarantees, background jobs | You know why "at least once" delivery means your consumers must be idempotent |
| 5. Scaling data | Replication, partitioning, shard keys, hot partitions | You can pick a shard key and name the query it makes expensive |
| 6. Correctness under failure | CAP and PACELC, consistency models, sagas, timeouts, retries, circuit breakers, rate limiting | You can say where your design accepts stale data and where it must not |
| 7. Running it | Metrics, logs and traces, SLOs and error budgets, deployments, cost | You can say how you would know your system is unhealthy before users tell you |
| 8. Putting it together | Full designs and a repeatable interview method | You can design a familiar system end to end in 45 minutes without notes |

Stages 1 to 4 are the foundation. Stages 5 and 6 are where senior interviews separate people, and stage 7 is what makes you useful at work.

### Step 1: get comfortable with rough numbers

Before any architecture, learn to estimate. How many requests per second at peak? How much storage does a year of orders need? The answers only have to be right within a factor of a few, and they decide whether you need one database or twenty.

### Step 2: learn each building block by the problem it solves

Do not memorise "Redis, Kafka, Cassandra" as a list of names. Learn that a cache exists because the database is slow for repeated reads, that a queue exists because the user should not wait for an email to send, and that sharding exists because one machine can no longer hold the writes. Then name what each one costs: a cache brings stale data, replicas bring replication lag, sharding makes cross-shard queries painful.

### Step 3: practise full designs, then redo them from memory

Work through a complete design, close your notes, and draw it again the next day. Then change one requirement, such as "it must work across two regions", and see what breaks.

## Common mistakes that slow people down

- **Jumping to the diagram.** The most common failure is drawing boxes before agreeing what the system must do and at what scale. Requirements first, always.
- **Collecting technology names.** Saying "I would use Kafka" without stating the requirement that needs it is assertion, not design.
- **Designing for a scale nobody asked for.** Sharding the database of an internal tool is a cost with no benefit. A single well indexed relational database is the right answer more often than people admit.
- **Ignoring failure.** Every network call can hang. A design without timeouts, retries with backoff and some idea of what happens when a dependency is down is incomplete.
- **Only reading.** You can read every chapter twice and still freeze on "design a ride-hailing backend". Timed practice cannot be skipped.

## What the free System Design course covers

The [System Design course](/learn/system-design) is written, not video, and is labelled intermediate to advanced. It has 12 chapters with 4 topics each, 48 topics in total, adding up to roughly 10 and a half hours of reading. The course page suggests 7 weeks.

| Chapter | What it covers |
| --- | --- |
| 1. Foundations of System Design | What design questions really ask, non-functional requirements, back of the envelope estimation, latency and throughput numbers |
| 2. APIs and Communication | Designing clean APIs, REST, GraphQL and gRPC, synchronous versus asynchronous calls, versioning, pagination and idempotency |
| 3. Data Storage Choices | Relational databases, NoSQL families and their trade-offs, indexing and query performance, choosing a store for the job |
| 4. Caching and Content Delivery | Why and where to cache, cache strategies and invalidation, CDNs, stampedes and stale data |
| 5. Load Balancing and Scaling | Vertical and horizontal scaling, load balancer algorithms, stateless services and sessions, autoscaling and capacity planning |
| 6. Asynchronous Processing | Message queues, publish-subscribe and event streaming, delivery guarantees and idempotent consumers, background jobs and scheduling |
| 7. Scaling the Database | Replication and read replicas, partitioning and sharding, choosing a shard key, hot partitions and rebalancing |
| 8. Consistency and Coordination | CAP and PACELC, consistency models in practice, transactions across services and sagas, consensus and leader election |
| 9. Resilience and Reliability | Designing for failure, timeouts, retries and circuit breakers, rate limiting and backpressure, idempotency and exactly once in practice |
| 10. Observability and Operations | Metrics, logs and traces, SLOs and error budgets, deployment strategies and rollbacks, cost and performance trade-offs |
| 11. Worked Designs | A URL shortener, a news feed, a chat system and a ride-hailing backend, each end to end |
| 12. Interviews and Practice | A framework for design interviews, communicating trade-offs, common mistakes, a study plan and career path |

The examples are local where it helps, such as a user in Peshawar waiting on an image served from Frankfurt. The interview chapter gives you a five phase framework (requirements, estimation, high level design, deep dives, wrap-up) with rough timings for a 45 minute session, and a list of practice prompts such as a rate limiter, a payment system and a booking system that has to prevent double bookings.

The last topic also points you to two books worth reading alongside it, "Designing Data-Intensive Applications" and "Site Reliability Engineering", and to public postmortems, which show how real systems fail better than any theory chapter can.

## Who this course is for, and how long it takes

It suits you if you already build backends and want to understand why your senior colleagues make the choices they do, if you are preparing for interviews at larger companies or remote roles where design rounds are standard, or if you are a final year CS student who wants to go past CRUD apps.

It is not a first course. You should be comfortable building a simple web backend with a database. If you are not there yet, start with [Node.js Backend](/learn/nodejs-backend), and read our guide on [how to learn data structures and algorithms](/blog/how-to-learn-data-structures-and-algorithms), because design interviews often sit next to coding rounds. If you want to see how these systems get deployed and run, [Cloud & DevOps](/learn/cloud-devops) and our [DevOps roadmap](/blog/devops-roadmap) are the natural companions.

On time: 10 and a half hours of reading is not the learning. The final chapter's study plan asks for at least one full timed design per week from the third week on. With an hour a day of real practice, 7 weeks is realistic.

## How the quizzes and free certificate work

Each topic has a minimum reading time of 90 seconds before its quiz opens, and you need 70 percent on that quiz to unlock the next topic. Each chapter ends with a chapter quiz, and you need to pass it to open the next chapter.

The certificate comes from the final exam, which opens once every topic is complete and every chapter quiz is passed: 50 questions, 60 minutes, one timed attempt, and you pass with 50 out of 100 marks. If you do not pass, a retake opens 30 days later with the same questions in a new order and their options reshuffled. Pass, and you get a free certificate with a verification code and a QR code anyone can check. It will not replace a strong design interview, but it is honest proof that you did the work.

## Frequently Asked Questions (FAQ)

### Can I learn system design without work experience?
Yes, up to a point. You can learn every building block and practise full designs on your own. What experience adds is the instinct for what actually breaks, so read public postmortems, write short design documents for your own projects, and ask experienced engineers to review them.

### Should I learn DSA or system design first?
DSA first if you are early in your career, because junior interviews lean on coding problems and design builds on solid programming. Once you can build and deploy a backend, start system design alongside it.

### How long does it take to learn system design?
The core concepts take a few focused weeks. Being able to design a familiar system confidently in 45 minutes usually takes a couple of months of regular timed practice.

### Is the System Design course really free?
Yes. The lessons, quizzes, final exam and certificate are all free. You need an account to track your progress and sit the exam.

---

*Ready to start? Open the free [System Design course](/learn/system-design), read the first topic today, and estimate the peak requests per second of an app you use every day.*
