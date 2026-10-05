import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'system-design',
  title: 'System Design',
  category: 'CS Core',
  level: 'Intermediate → Advanced',
  duration: '7 weeks',
  accent: 'cyan',
  coverKey: 'system-design',
  summary:
    'Design large-scale systems with confidence: estimation, APIs, databases and caching, load balancing, queues, replication and sharding, consistency, resilience and observability, plus worked designs and interview practice.',
  description:
    'You start with how to reason about scale, estimate capacity and read requirements, then design clean APIs and choose the right storage. You learn caching, load balancing and content delivery, asynchronous processing with queues, and how databases scale through replication, partitioning and sharding. You work through consistency and the trade-offs behind CAP and PACELC, then resilience patterns, rate limiting and idempotency, and observability. The course finishes with complete worked designs, such as a URL shortener, a news feed, a chat system and a ride-hailing backend, and a clear method for system design interviews.',
  chapters: [
    chapter(
      'Foundations of System Design',
      'Understand what system design questions really ask, identify the non-functional requirements that shape architecture, estimate capacity with quick arithmetic, and learn the latency and throughput numbers every engineer should know.',
      [
      lesson('What System Design Really Asks', 13, `
Writing code that works for one user is programming. Designing a system that works for millions of users, survives hardware failures, and can be changed by a team over years is system design. It is a distinct skill, and it is what senior engineering roles and interviews at larger companies test for.

### From a feature to a system

Imagine Hamza builds a food ordering app for a few restaurants in Karachi. One server, one database, a few hundred orders a day. Everything works. Then a delivery partnership brings 200,000 users, orders spike at iftar time, the database locks up, and the app is down at the worst possible moment.

Nothing about the code changed. The system around the code was never designed for that load. System design is about anticipating these pressures and making deliberate choices before they become outages.

### The questions system design answers

| Question | Design concern |
|---|---|
| How many users and requests must it handle? | Scale and capacity |
| How fast must responses be? | Latency |
| What happens when a server dies? | Availability and fault tolerance |
| Where does data live, and how is it kept correct? | Storage and consistency |
| How do parts of the system talk to each other? | Communication and integration |
| How will we know it is working? | Observability |
| How much will it cost? | Efficiency |

### There is no perfect design

Every choice trades one thing for another. A cache makes reads faster but risks stale data. Replicating a database improves availability but introduces replication lag. Microservices let teams work independently but add network failures and complexity. The skill is not finding the "right" answer; it is understanding the trade-offs and choosing the ones that suit the problem.

\`\`\`text
Weak reasoning:   "Use Redis, because it is fast."
Strong reasoning: "Read traffic is 50 times write traffic and the same
                   menus are requested repeatedly, so caching menus in
                   Redis cuts database load. Menus change rarely, so a
                   five-minute expiry is acceptable staleness."
\`\`\`

The second version names the requirement, the choice and the trade-off. This is the habit the whole course builds.

### Start simple, evolve deliberately

Good systems usually begin simple and grow in response to real needs:

\`\`\`text
Stage 1: one server, one database
Stage 2: separate application and database servers
Stage 3: add a cache and a load balancer with several app servers
Stage 4: read replicas for the database
Stage 5: queues for background work
Stage 6: partition the database, split services
\`\`\`

Jumping straight to stage 6 for a new product wastes effort and adds failure modes nobody needs yet. Knowing the path lets you take each step when the numbers justify it.

### How to use this course

Each chapter covers one building block with its trade-offs, then chapter 11 assembles them into complete designs, and chapter 12 turns them into an interview method. As you read, keep asking: what requirement drives this choice, and what does it cost?
      `,
        [
          q('What distinguishes system design from programming a feature?', [
            'System design does not involve code at all',
            'It addresses scale, failures and change across a whole system',
            'It only applies to mobile apps',
            'It replaces the need for testing',
          ], 1, 'System design anticipates load, failures and evolution beyond a single working feature.'),
          q('What makes a design decision well reasoned?', [
            'Choosing the newest technology available',
            'Copying what a large company does',
            'Naming the requirement, the choice and the trade-off',
            'Avoiding any trade-offs',
          ], 2, 'Strong design reasoning ties each choice to a requirement and acknowledges its cost.'),
          q('Why start simple rather than building a fully distributed system immediately?', [
            'Distributed systems are always wrong',
            'Simple systems never need to change',
            'Complexity adds failure modes and effort before they are justified by need',
            'Load balancers are not available to small teams',
          ], 2, 'Growing the design as numbers justify it avoids unnecessary complexity and risk.'),
        ]
      ),
      lesson('Non-Functional Requirements That Matter', 13, `
Functional requirements say what a system does: place an order, send a message, upload a photo. Non-functional requirements say how well it must do it: how fast, how reliably, at what scale. Two systems with identical features can need completely different architectures because their non-functional requirements differ.

### The main non-functional requirements

| Requirement | Question it answers | Example target |
|---|---|---|
| Scalability | Can it handle growth in users and data? | 10x users in two years |
| Availability | What share of time is it working? | 99.9% per month |
| Latency | How fast are responses? | p99 under 300 ms |
| Consistency | Do all users see the same data at once? | Strong for payments, eventual for feeds |
| Durability | Can data be lost? | No committed order ever lost |
| Security | Who can access what? | Encrypted in transit and at rest |
| Maintainability | Can the team change it safely? | Deploy several times a day |
| Cost | What can the business afford? | Under a set amount per month |

### Availability in numbers

Availability is usually expressed in "nines":

\`\`\`text
99%      about 3.65 days of downtime a year
99.9%    about 8.8 hours a year
99.99%   about 53 minutes a year
99.999%  about 5 minutes a year
\`\`\`

Each extra nine costs far more than the last: redundant servers, multiple regions, automated failover and on-call teams. A restaurant menu page may be fine at 99.9%; a payment system may need 99.99%. Ask what downtime actually costs before choosing a target.

### Latency percentiles

Average latency hides problems. If most requests take 50 ms but one in a hundred takes 5 seconds, the average looks fine while 1% of users suffer. Percentiles show the real picture:

- **p50** (median): half of requests are faster than this.
- **p95**: 95% of requests are faster; 5% are slower.
- **p99**: the slowest 1% of requests.

Targets are set on high percentiles because a user making many requests will hit the slow tail often. A page loading 20 resources at p99 of 1 second will frequently take a second.

### Read-heavy or write-heavy?

One of the most useful early questions: what is the ratio of reads to writes?

| System | Typical ratio | Design implication |
|---|---|---|
| Social feed, product catalogue | Reads far outnumber writes | Caching and read replicas pay off |
| Logging, metrics, IoT sensors | Writes dominate | Append-optimised storage and batching |
| Chat, collaborative editing | Balanced, latency-sensitive | Real-time channels, careful ordering |

### Requirements drive everything

Consider two messaging systems: an SMS gateway that must never lose a message, and a live-stream comment feed where dropping a comment during a spike is acceptable. The first needs durable queues and acknowledgements; the second can favour speed and simply shed load. Same feature, "send messages", opposite designs.

### Write them down

Before designing, list the non-functional requirements explicitly, with numbers where possible. In interviews, asking about them is the first thing strong candidates do; in real projects, it prevents building a system for the wrong goals.
      `,
        [
          q('What does 99.9% availability allow per year, roughly?', [
            'About 5 minutes of downtime',
            'About 8.8 hours of downtime',
            'About 3.65 days of downtime',
            'No downtime at all',
          ], 1, 'Three nines permit roughly 8.8 hours of downtime annually.'),
          q('Why set latency targets on p99 rather than the average?', [
            'The average hides a slow tail that many users will hit',
            'Averages cannot be measured',
            'p99 is always smaller than the average',
            'Percentiles only apply to databases',
          ], 0, 'High percentiles reveal the slow requests that averages conceal.'),
          q('A system receives far more reads than writes. Which choice is most likely to pay off?', [
            'Removing all indexes',
            'Making every write synchronous to three regions',
            'Caching and read replicas',
            'Storing data only in memory without persistence',
          ], 2, 'Read-heavy workloads benefit most from serving repeated reads from caches and replicas.'),
        ]
      ),
      lesson('Back-of-the-Envelope Estimation', 13, `
Before choosing an architecture, you need rough numbers: how many requests per second, how much storage, how much bandwidth. Exact figures are impossible, but estimates within a factor of a few are enough to tell whether one database is plenty or whether you need to partition data across many machines.

### The estimation method

\`\`\`text
1. Start from something known or assumed (users, actions per user).
2. Convert to per-second rates.
3. Multiply by sizes to get storage and bandwidth.
4. Round aggressively; keep the arithmetic simple.
5. Sanity-check the result against known numbers.
\`\`\`

### Useful conversions

| Quantity | Approximation |
|---|---|
| Seconds in a day | 86,400, round to 100,000 for quick maths |
| Seconds in a month | about 2.6 million |
| 1 million requests a day | about 12 per second on average |
| Peak traffic | often 2 to 5 times the average, higher for event-driven spikes |

### Powers of two and data sizes

\`\`\`text
1 KB  ~ 1,000 bytes       a short text record
1 MB  ~ 1,000 KB          a compressed photo
1 GB  ~ 1,000 MB          a short video
1 TB  ~ 1,000 GB          a large database
1 PB  ~ 1,000 TB          a large company's storage
\`\`\`

Common record sizes: a user profile row around 1 KB, a tweet-sized message around 300 bytes with metadata, a phone photo around 2 to 3 MB.

### A worked example: a food delivery app in Pakistan

Assumptions:

\`\`\`text
Registered users                 5 million
Daily active users               20% -> 1 million
Orders per active user per day   0.3 -> 300,000 orders/day
Menu views per active user       10 -> 10 million views/day
\`\`\`

Request rates:

\`\`\`text
Orders:      300,000 / 100,000 s  ~ 3 per second average, ~15 at peak
Menu views:  10,000,000 / 100,000 ~ 100 per second average, ~500 at peak
\`\`\`

Storage per year for orders:

\`\`\`text
Order record with items ~ 2 KB
300,000 orders/day x 2 KB = 600 MB/day
x 365 ~ 220 GB/year
\`\`\`

Conclusion: order writes are modest; a single well-indexed relational database handles this comfortably for years. Menu views at 500 per second are the main load, and menus rarely change, so caching menus is the obvious first optimisation. Estimation turned a vague worry about scale into two clear design decisions.

### Bandwidth

\`\`\`text
Menu response ~ 20 KB
500 requests/s x 20 KB = 10 MB/s outbound at peak
\`\`\`

Comfortably within a single server's capacity, but images served through a CDN would reduce this further.

### Sanity checks

Compare your result with reference points: a single modern PostgreSQL server can handle thousands of simple queries per second; a single web server can serve thousands of cached responses per second; a 1 Gbps link carries about 125 MB/s. If your estimate says one server needs a million queries per second, either the assumptions or the arithmetic are wrong.

### Estimation in interviews

Interviewers care more about your method than your exact numbers. State assumptions out loud, round freely, and explain what the results mean for the design. "About 500 reads per second at peak, so caching matters more than sharding" is exactly the kind of conclusion they want to hear.
      `,
        [
          q('About how many requests per second is 1 million requests per day?', [
            'About 1,000',
            'About 12',
            'About 100',
            'About 1',
          ], 1, 'Dividing by roughly 86,400 seconds gives about 12 requests per second on average.'),
          q('Orders total 300,000 a day at 2 KB each. Roughly how much storage per year?', [
            'About 2 GB',
            'About 20 GB',
            'About 220 GB',
            'About 22 TB',
          ], 2, '300,000 x 2 KB is 600 MB per day, and 365 days gives roughly 220 GB.'),
          q('What matters most to interviewers during estimation?', [
            'Exact figures to three decimal places',
            'Clear assumptions, simple arithmetic and design conclusions',
            'Memorising every company\'s traffic numbers',
            'Avoiding any rounding',
          ], 1, 'The method and its implications for the design are what estimation is for.'),
        ]
      ),
      lesson('Latency, Throughput and the Numbers to Know', 12, `
Every operation in a system takes time, and the differences between operations are enormous. Reading from memory is thousands of times faster than reading from disk across a network. Knowing rough latency numbers lets you predict where a design will be slow before building it.

### Latency versus throughput

| Term | Meaning | Example |
|---|---|---|
| Latency | Time for one operation to complete | A request takes 120 ms |
| Throughput | Operations completed per unit of time | 2,000 requests per second |

They are related but distinct. A system can have high throughput and high latency (a batch pipeline processing millions of records with each taking minutes) or low latency and low throughput (a single-threaded service that answers quickly but cannot handle many requests at once).

### Rough latency numbers

These are approximate, but the orders of magnitude are what matter:

\`\`\`text
CPU cache reference                        ~ 1 ns
Main memory reference                      ~ 100 ns
Compress 1 KB                              ~ 2 us
SSD random read                            ~ 100 us
Read 1 MB sequentially from memory         ~ 10 us
Read 1 MB sequentially from SSD            ~ 1 ms
Round trip within a data centre            ~ 0.5 ms
Read 1 MB sequentially from a spinning disk ~ 20 ms
Round trip Karachi to Singapore            ~ 60 to 80 ms
Round trip Karachi to the US west coast    ~ 200 to 250 ms
\`\`\`

Values vary with hardware and networks, but the relationships hold: memory is far faster than disk, and cross-continent networks are far slower than anything inside a data centre.

### What the numbers imply

- **Serve hot data from memory**: caches exist because memory is thousands of times faster than disk.
- **Keep data close to users**: a user in Lahore hitting a server in the US pays 200 ms before any work happens. CDNs and regional deployments cut this.
- **Avoid chatty communication**: ten sequential calls between services at 0.5 ms each add 5 ms; ten sequential cross-region calls add seconds.
- **Prefer sequential I/O**: databases and log systems are designed around sequential writes because random disk access is slow.

### Little's law

A simple relationship links concurrency, throughput and latency:

\`\`\`text
Average concurrent requests = throughput x average latency

Example: 2,000 requests/s x 0.05 s = 100 requests in flight on average
\`\`\`

If latency rises to 0.5 s during a slow database episode, the same throughput needs 1,000 concurrent requests, which can exhaust connection pools and threads. This is why slow dependencies cause cascading failures, a theme chapter 9 returns to.

### Tail latency and fan-out

When a request depends on many parallel calls, the slowest one decides the response time. If a page calls 10 services, each with a p99 of 100 ms, the chance that at least one hits its slow tail is high, so the page's p99 is much worse than any single service's. Reducing fan-out, adding timeouts and using hedged requests are common responses.

### Bandwidth and data transfer

Moving data has costs beyond latency: cloud providers charge for outbound traffic, and large payloads slow mobile users on 3G and 4G connections common across Pakistan. Compressing responses, paginating results and serving images at appropriate sizes matter as much as server speed.

### Build intuition

Keep these numbers in mind when reading later chapters. Each pattern, caching, replication, queues, CDNs, is a response to one of these physical limits.
      `,
        [
          q('Roughly how much faster is a memory reference than an SSD random read?', [
            'About twice as fast',
            'About 10 times faster',
            'About 1,000 times faster',
            'They take the same time',
          ], 2, 'Memory access is around 100 ns versus about 100 us for an SSD random read.'),
          q('Throughput is 2,000 requests per second and average latency is 50 ms. About how many requests are in flight?', [
            '10',
            '100',
            '1,000',
            '40,000',
          ], 1, 'Little\'s law gives 2,000 x 0.05 = 100 concurrent requests.'),
          q('Why does fan-out to many services worsen tail latency?', [
            'Services cannot run in parallel',
            'The slowest of many calls decides the response time',
            'Network calls are always faster than memory',
            'Parallel calls reduce throughput to zero',
          ], 1, 'With many parallel dependencies, the chance that one is slow is high, so the overall p99 degrades.'),
        ]
      ),
      ],
      [
      q('Which is a non-functional requirement?', [
        'Users can place an order',
        'Restaurants can update menus',
        'Responses complete within 300 ms at p99',
        'Riders can accept deliveries',
      ], 2, 'Non-functional requirements describe how well the system performs, such as latency targets.'),
      q('A team wants five nines of availability for a menu page. What should they consider first?', [
        'Buying more domain names for the menu page',
        'Whether downtime costs justify the expense',
        'Removing the database behind the page entirely',
        'Reducing the number of users who visit the page',
      ], 1, 'Each extra nine costs far more, so the target should match the real cost of downtime.'),
      q('What is the purpose of back-of-the-envelope estimation?', [
        'Producing exact figures for finance teams',
        'Replacing load testing',
        'Getting rough numbers that guide architectural decisions',
        'Choosing a programming language',
      ], 2, 'Rough estimates reveal whether scale problems exist and which parts of the design matter most.'),
      q('Why do caches exist, according to the latency numbers?', [
        'Memory is thousands of times faster than disk',
        'Disks are unreliable',
        'Databases cannot store data',
        'Networks are faster than memory',
      ], 0, 'Serving hot data from memory avoids far slower disk and network operations.'),
      ]
    ),
    chapter(
      'APIs and Communication',
      'Design clean APIs that clients enjoy using, choose between REST, GraphQL and gRPC for the job, decide when communication should be synchronous or asynchronous, and handle versioning, pagination and idempotency well.',
      [
      lesson('Designing Clean APIs', 13, `
An API is the contract between parts of a system: between a mobile app and a backend, or between two services. A well-designed API is predictable, so once developers learn one part they can guess the rest. A poor one causes bugs, support requests and painful migrations. API design is one of the highest-leverage decisions in a system, because the contract is hard to change once clients depend on it.

### Model resources, not actions

Well-designed APIs are organised around resources, named with nouns, with actions expressed by the protocol:

\`\`\`text
Good:   POST /orders          create an order
        GET  /orders/8821     read one order
        GET  /restaurants/42/menu   a restaurant's menu

Weak:   POST /createOrder
        GET  /getOrderById?id=8821
        POST /fetchMenuForRestaurant
\`\`\`

The resource-oriented style is consistent and predictable. Operations that do not map neatly to a resource, such as searching, are still expressed as resources where possible: \`GET /orders?status=pending\`.

### Design for the consumer

An API exists for the clients that call it. Design it around what they need, not around your database tables. If a mobile app needs an order with its items and the restaurant's name in one call, provide that, rather than forcing three round trips over a slow mobile connection. The internal schema and the API are separate concerns.

### Consistency is kindness

Small inconsistencies create constant friction:

| Decision | Pick one and keep it |
|---|---|
| Field naming | \`camelCase\` or \`snake_case\`, everywhere |
| Dates and times | ISO 8601 in UTC, such as \`2025-03-15T09:30:00Z\` |
| IDs | A consistent format and type |
| Money | Minor units plus a currency code, not floating point |
| Errors | One shape for every error response |
| Collections | The same pagination style everywhere |

### Clear, consistent errors

Clients need to react to errors programmatically. Return the right status code and a consistent body:

\`\`\`json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Only 2 units of this item remain.",
    "details": { "itemId": "SP-5PC", "available": 2 }
  }
}
\`\`\`

A machine-readable \`code\` lets clients handle each case; the \`message\` helps developers; \`details\` support good user interfaces. Returning 200 with an error inside the body forces every client to parse bodies to detect failure, which is error-prone.

### Design the contract first

Writing the API specification, for example in OpenAPI, before implementation has several benefits: front-end and mobile teams can start against a mock, the design gets reviewed before code is written, and documentation and client libraries can be generated. The contract, not the implementation, is what clients depend on.

### Think about evolution from the start

You will need to change the API later. Design so that adding fields does not break clients: clients should ignore unknown fields, and the API should not require fields that did not exist before. Removing or renaming fields is a breaking change, handled through versioning, covered in the final lesson of this chapter.

### Security is part of the contract

Every endpoint needs to answer: who can call this, and what can they access? Authentication and authorisation, input validation and rate limiting are part of API design, not additions afterwards. An endpoint that returns another user's order by changing an ID in the URL is a design failure, not just a bug.
      `,
        [
          q('Which endpoint follows resource-oriented design?', [
            'POST /createOrder',
            'GET /getOrderById?id=8821',
            'GET /orders/8821',
            'POST /fetchOrderData',
          ], 2, 'Resource-oriented APIs use nouns and let the HTTP method express the action.'),
          q('Why design an API around the consumer\'s needs rather than database tables?', [
            'Database tables cannot be exposed in APIs',
            'Clients need useful responses, sometimes combining data, over slow connections',
            'It makes the database faster',
            'Consumers always want raw table rows',
          ], 1, 'APIs serve clients, so shaping responses to their needs reduces round trips and complexity.'),
          q('Why return a machine-readable error code, not just a message?', [
            'Messages cannot be displayed to users',
            'Codes are shorter than messages',
            'Clients can handle each error case programmatically',
            'Status codes are optional with error codes',
          ], 2, 'A stable code lets client software react to specific errors reliably.'),
        ]
      ),
      lesson('REST, GraphQL and gRPC', 14, `
Three styles dominate modern APIs, and each suits different situations. Choosing well depends on who calls the API, over what network, and what kind of data they need. Many systems use more than one.

### REST

REST uses HTTP methods and resource URLs, usually with JSON. It is the default for public and web APIs.

\`\`\`text
GET    /restaurants/42
POST   /orders
PATCH  /orders/8821
DELETE /orders/8821
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Simple, universal, cacheable through HTTP | Over-fetching: endpoints return more than a client needs |
| Great tooling and familiarity | Under-fetching: several calls to assemble one screen |
| Works everywhere, easy to debug | Many endpoints for many views |

REST is an excellent default, especially for public APIs and straightforward resources.

### GraphQL

GraphQL exposes one endpoint and lets clients ask for exactly the fields they want in one request:

\`\`\`text
query {
  order(id: "8821") {
    total
    items { name quantity }
    restaurant { name city }
  }
}
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Clients fetch exactly what they need in one request | More complex server and caching |
| Great for varied clients (web, mobile) with different needs | Easy to write expensive queries |
| Strongly typed schema | HTTP caching does not apply directly |

GraphQL shines when many different clients need different shapes of data, such as a company with web, iOS and Android apps over one backend. It requires care to prevent clients requesting hugely expensive queries.

### gRPC

gRPC uses HTTP/2 and a binary format (Protocol Buffers) with a defined service contract. It is fast and efficient, favoured for communication between internal services.

\`\`\`text
service OrderService {
  rpc GetOrder (GetOrderRequest) returns (Order);
  rpc PlaceOrder (PlaceOrderRequest) returns (Order);
}
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Compact, fast, low latency | Not natively supported by browsers without a proxy |
| Strong contracts and code generation | Binary format is harder to inspect by hand |
| Streaming in both directions | Less familiar, more setup |

gRPC is common for service-to-service calls inside a system, where efficiency matters and both sides are controlled.

### Choosing

| Situation | Often best |
|---|---|
| Public API for third parties | REST |
| Web app with simple resource needs | REST |
| Many client types needing different data shapes | GraphQL |
| High-performance internal service calls | gRPC |
| Real-time streaming between services | gRPC |

### They coexist

A realistic system might expose REST to external partners, serve its own apps with GraphQL, and use gRPC between internal services. The styles are tools, not rival religions. What matters is matching the style to the caller, the network and the data needs, and being able to explain why.

### Real-time options

For live updates, such as order tracking or chat, plain request-response is not enough. WebSockets provide a persistent two-way connection; Server-Sent Events push updates one way from server to client; and long polling is a simpler fallback. Chapter 11's chat design uses these, and the choice again depends on requirements: direction of data, scale and client support.
      `,
        [
          q('What problem does GraphQL directly address?', [
            'Servers being unable to use HTTP for requests',
            'Over-fetching and under-fetching of data',
            'Databases being too slow to answer queries',
            'The need for authentication on every endpoint',
          ], 1, 'GraphQL lets clients specify exactly the fields they need in a single request.'),
          q('Where is gRPC most commonly used?', [
            'Public APIs for third-party developers',
            'Directly from web browsers without any proxy',
            'High-performance communication between internal services',
            'Serving static images',
          ], 2, 'gRPC\'s efficiency and strong contracts suit internal service-to-service calls.'),
          q('What is a strength of REST for public APIs?', [
            'Simplicity, universality and HTTP caching',
            'Binary payloads that are hard to inspect',
            'Requiring code generation for every client',
            'Preventing clients from over-fetching',
          ], 0, 'REST is simple, universally supported and benefits from HTTP caching, ideal for public use.'),
        ]
      ),
      lesson('Synchronous Versus Asynchronous Communication', 13, `
When one part of a system asks another to do something, it can wait for the result (synchronous) or hand off the work and continue (asynchronous). This choice shapes latency, reliability and complexity, and choosing wrongly is a common cause of slow or fragile systems.

### Synchronous communication

The caller sends a request and waits for the response before continuing:

\`\`\`text
App -> Order Service -> Payment Service
App waits for the whole chain to finish before showing a result
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Simple to reason about | The caller waits for the slowest step |
| Immediate result and errors | A failure in any step fails the whole request |
| Natural for reads | Chains couple services tightly |

Synchronous calls suit operations where the user needs an immediate answer, such as reading data or confirming a payment before showing success.

### Asynchronous communication

The caller hands off work, often through a queue, and does not wait:

\`\`\`text
App -> Order Service: order accepted (returns immediately)
Order Service -> queue -> Notification Service (sends confirmation later)
                       -> Analytics Service (records the order later)
\`\`\`

| Strengths | Weaknesses |
|---|---|
| The caller responds quickly | The result is not immediate |
| Failures in downstream work do not fail the request | More moving parts and eventual consistency |
| Absorbs spikes; work is processed at its own pace | Harder to trace and debug |

Asynchronous processing suits work that does not need to block the response: sending emails and notifications, updating analytics, generating reports, processing images. Chapter 6 covers queues in depth.

### A concrete decision

When a customer places an order:

\`\`\`text
Synchronous (must finish before responding):
  - Validate the cart and stock
  - Take payment authorisation
  - Create the order record

Asynchronous (can happen after responding):
  - Send the confirmation email and SMS
  - Notify the restaurant's tablet
  - Update analytics and recommendations
  - Warm caches
\`\`\`

Doing the asynchronous work synchronously would make the customer wait for emails to send and analytics to update, and a failing email service would break ordering entirely. Separating them makes the response fast and the system resilient.

### Coupling and failure

Synchronous chains couple services: if the notification service is down, and ordering calls it synchronously, ordering fails too. Making that call asynchronous decouples them: orders keep working, and notifications catch up when the service recovers. A guiding principle is to make only what must be immediate synchronous, and push everything else to asynchronous processing.

### The cost of asynchronous

Asynchronous systems are harder to understand. A user action no longer has one clear thread; work happens later, possibly out of order, possibly retried. You need queues, idempotent consumers (chapter 6), and good tracing (chapter 10) to follow a request across services. Do not make things asynchronous for their own sake; do it when the benefits, speed and resilience, are worth the added complexity.

### Hybrid reality

Most systems mix both. Reads are usually synchronous; user-facing writes often do the essential part synchronously and the rest asynchronously. Recognising which parts of an operation truly need an immediate answer is one of the most useful system design skills.
      `,
        [
          q('When is synchronous communication the right choice?', [
            'When the user needs an immediate result, such as a payment confirmation',
            'When sending marketing emails',
            'When updating analytics',
            'Whenever any service calls another',
          ], 0, 'Synchronous calls suit operations that must return a result before continuing.'),
          q('Why make sending a confirmation email asynchronous?', [
            'Emails cannot be sent synchronously',
            'The customer should not wait for it, and its failure should not break ordering',
            'Asynchronous emails are always delivered faster',
            'It removes the need for a queue',
          ], 1, 'Handing off non-essential work keeps the response fast and isolates failures.'),
          q('What is a drawback of asynchronous processing?', [
            'The caller always waits longer',
            'It couples services more tightly',
            'It adds complexity and eventual consistency, and is harder to trace',
            'Failures always break the original request',
          ], 2, 'Asynchronous systems have more moving parts and delayed, sometimes out-of-order, results.'),
        ]
      ),
      lesson('Versioning, Pagination and Idempotency', 12, `
Three practical concerns appear in almost every API: how to change it without breaking clients, how to return large collections safely, and how to make requests safe to retry. Handling them well prevents outages and data corruption.

### Versioning

APIs must evolve, but existing clients cannot break. Distinguish safe changes from breaking ones:

| Safe (no new version) | Breaking (needs a new version) |
|---|---|
| Adding a new optional field | Removing or renaming a field |
| Adding a new endpoint | Changing a field's type or meaning |
| Adding a new optional parameter | Making an optional field required |

Common versioning approaches:

\`\`\`text
URL path:    /v1/orders, /v2/orders     (simple, visible, widely used)
Header:      Accept: application/vnd.app.v2+json
\`\`\`

Support old versions for a stated period, communicate deprecation clearly, and give clients time to migrate. Breaking changes without a version, or without notice, are how APIs lose the trust of the developers who depend on them.

### Pagination

Never return an unbounded collection. A query that returns a million rows can exhaust memory and time out. Pagination returns results in pages.

**Offset pagination** uses a page number and size:

\`\`\`text
GET /orders?page=3&size=20
\`\`\`

Simple, allows jumping to any page, but slow on deep pages (the database must skip many rows) and can show duplicates or gaps if data changes between requests.

**Cursor (keyset) pagination** uses a pointer to the last item seen:

\`\`\`text
GET /orders?limit=20&after=eyJpZCI6ODgyMX0
\`\`\`

Efficient even deep into large datasets and stable as data changes, but cannot jump to an arbitrary page. It is the preferred choice for large, changing datasets and infinite-scroll feeds.

Always set a sensible default and maximum page size, so a client cannot request everything at once.

### Idempotency

An idempotent operation has the same effect whether performed once or many times. This matters because networks fail: a client sends a request, the response is lost, and the client retries. Without idempotency, the retry could create a second order or charge the customer twice.

| Method | Idempotent by convention? |
|---|---|
| GET | Yes (reads nothing changes) |
| PUT | Yes (replaces to a known state) |
| DELETE | Yes (deleting twice leaves it deleted) |
| POST | No (creates something each time) |

Because POST is not naturally idempotent, use an idempotency key for operations that must not be duplicated:

\`\`\`text
POST /payments
Idempotency-Key: 9f1c-4d2a-...

Server: if a request with this key was already processed,
        return the original result instead of charging again.
\`\`\`

The server stores the key with the result for a period. Retries with the same key return the first result, so a lost response never causes a double charge. Payment providers use exactly this mechanism.

### Why these matter together

A robust API lets clients retry safely (idempotency), fetch large data safely (pagination), and rely on the contract over time (versioning). These are not advanced extras; they are the difference between an API that works reliably in the real world of flaky mobile networks and one that corrupts data or falls over under load. Chapter 9 returns to idempotency as a core resilience pattern.
      `,
        [
          q('Which change requires a new API version?', [
            'Adding a new optional field',
            'Adding a new endpoint',
            'Renaming an existing field',
            'Adding an optional query parameter',
          ], 2, 'Renaming a field breaks clients that expect the old name, so it needs a new version.'),
          q('Why is cursor pagination preferred for large, changing datasets?', [
            'It lets clients jump to any page instantly',
            'It stays efficient deep into the data and is stable as data changes',
            'It returns the entire dataset at once',
            'It requires no parameters',
          ], 1, 'Cursor pagination avoids skipping many rows and handles inserts and deletes gracefully.'),
          q('How does an idempotency key prevent double charges?', [
            'It blocks all retries from the client',
            'It speeds up the network connection',
            'Repeated keys return the original result',
            'It encrypts the payment request body',
          ], 2, 'Storing the key with its result lets the server recognise retries and avoid duplicating the action.'),
        ]
      ),
      ],
      [
      q('What is the main reason to design the API contract before implementation?', [
        'It makes the database faster',
        'Teams can build against it in parallel and review the design early',
        'It removes the need for authentication',
        'Contracts cannot change once written',
      ], 1, 'A contract-first approach enables parallel work, early review and generated docs and clients.'),
      q('A backend serves web, iOS and Android apps that each need different data shapes. Which style fits well?', [
        'gRPC to the browsers directly',
        'GraphQL',
        'A separate REST endpoint for every screen',
        'Long polling',
      ], 1, 'GraphQL lets varied clients request exactly the fields they need from one endpoint.'),
      q('Which part of placing an order is best done synchronously?', [
        'Sending the confirmation email',
        'Updating analytics',
        'Taking payment authorisation before showing success',
        'Warming caches',
      ], 2, 'The customer needs the payment result immediately, so it must complete before responding.'),
      q('Why set a maximum page size on a collection endpoint?', [
        'Clients cannot read more than 20 items',
        'To stop a client requesting the entire dataset in one call',
        'Pagination is required by JSON',
        'It makes cursors unnecessary',
      ], 1, 'A maximum protects the server from expensive requests for enormous result sets.'),
      ]
    ),
    chapter(
      'Data Storage Choices',
      'Know when relational databases are the right default, understand the main NoSQL families and their trade-offs, make queries fast with the right indexes, and choose a data store based on access patterns rather than fashion.',
      [
      lesson('Relational Databases and When to Use Them', 13, `
Relational databases such as PostgreSQL and MySQL have powered business systems for decades, and they remain the right default for most applications. Understanding what they do well, and where they struggle, is the starting point for every storage decision.

### What relational databases offer

| Feature | Why it matters |
|---|---|
| Tables with a defined schema | Data is structured and validated; mistakes are caught early |
| SQL | A powerful, standard language for queries, joins and aggregations |
| ACID transactions | Groups of changes succeed or fail together, keeping data consistent |
| Constraints | Foreign keys, uniqueness and checks protect integrity in the database itself |
| Indexes | Fast lookups on chosen columns |
| Mature tooling | Backups, replication, monitoring and decades of expertise |

### ACID in plain terms

\`\`\`text
Atomicity     all steps of a transaction happen, or none do
Consistency   the database moves from one valid state to another
Isolation     concurrent transactions do not see each other's half-done work
Durability    once committed, data survives crashes
\`\`\`

For a food order, atomicity means the order, its items and the stock reduction are saved together. Without it, a crash mid-way could leave an order with no items or stock reduced with no order.

### Modelling with normalisation

Relational design avoids duplication by splitting data into related tables:

\`\`\`text
customers   (id, name, phone)
restaurants (id, name, city)
orders      (id, customer_id, restaurant_id, placed_at, total)
order_items (id, order_id, item_name, quantity, unit_price)
\`\`\`

A customer's phone number is stored once. Changing it updates every order's view of it automatically through the relationship. Joins assemble the pieces when needed.

### Where they shine

- Business data with relationships: customers, orders, payments, inventory.
- Anything needing transactions and strong consistency, such as money and stock.
- Complex queries and reporting with joins and aggregations.
- Systems whose data model evolves, thanks to migrations and constraints.

### Where they struggle

- **Very high write throughput** across a single table, such as millions of sensor readings per second.
- **Horizontal scaling of writes**: a single primary handles writes; spreading writes across machines (sharding) is possible but complex, as chapter 7 explains.
- **Highly variable or nested data**, where a rigid schema fights the data's shape.
- **Massive scale in a single table** where joins become slow without careful design.

### Scaling further than people expect

A single modern PostgreSQL server with fast SSDs and enough memory serves thousands of queries per second and stores terabytes. Combined with caching (chapter 4) and read replicas (chapter 7), a relational database supports most businesses for a very long time. Many teams reach for distributed NoSQL far earlier than their numbers justify, gaining complexity without benefit.

### Modern relational features

Today's relational databases also handle semi-structured data well. PostgreSQL's JSONB columns store and index JSON documents, full-text search covers many search needs, and extensions add geospatial queries and more. Often the right answer to "we need a document store" is "use a JSONB column in the database you already have".

### The practical rule

Start with a relational database unless a specific requirement, measured or clearly anticipated, rules it out. When it does, the next lesson covers the alternatives and what each gives up.
      `,
        [
          q('What does atomicity guarantee in a transaction?', [
            'The database is always fast',
            'All steps happen together, or none of them do',
            'Data is stored on two servers',
            'Queries use an index',
          ], 1, 'Atomicity prevents partial updates, keeping related changes consistent.'),
          q('Which workload is a poor fit for a single relational database?', [
            'Customer orders with payments',
            'Inventory with stock levels',
            'Millions of sensor readings written per second',
            'A reporting system with complex joins',
          ], 2, 'Extreme write rates on one table exceed what a single relational primary handles comfortably.'),
          q('What is the practical default for a new application\'s storage?', [
            'A relational database, unless a requirement rules it out',
            'A distributed NoSQL cluster from the first day',
            'An in-memory store only, with no persistence',
            'A separate database for every table',
          ], 0, 'Relational databases suit most applications and scale further than many expect.'),
        ]
      ),
      lesson('NoSQL Families and Their Trade-offs', 14, `
NoSQL is not one thing. It is a group of database families, each designed for a particular shape of data and access pattern, each giving up something relational databases provide. Choosing among them means knowing what you gain and what you lose.

### The four main families

| Family | Data model | Examples | Typical use |
|---|---|---|---|
| Key-value | Keys mapped to opaque values | Redis, DynamoDB (in its simplest use) | Caches, sessions, counters |
| Document | JSON-like documents, flexible schema | MongoDB, Couchbase, DynamoDB | Content, catalogues, user profiles |
| Wide-column | Rows with many columns, partitioned by key | Cassandra, HBase, ScyllaDB | Time series, high-volume writes, logs |
| Graph | Nodes and relationships | Neo4j, Amazon Neptune | Social graphs, recommendations, fraud rings |

### Key-value stores

The simplest model: get or set a value by key. Extremely fast and easy to scale horizontally, because each key lives on exactly one partition. No joins, no queries by value.

\`\`\`text
SET session:9f1c   {"userId": 42, "cart": [...]}
GET session:9f1c
\`\`\`

Redis adds data structures such as lists, sets and sorted sets, making it useful for leaderboards, rate limiters and queues as well as caching.

### Document stores

Documents hold nested data in one place, matching how applications use objects:

\`\`\`json
{
  "orderId": "8821",
  "customer": { "name": "Sana", "city": "Lahore" },
  "items": [ { "name": "Biryani", "qty": 2 }, { "name": "Raita", "qty": 1 } ],
  "status": "delivered"
}
\`\`\`

Reading a whole order is one operation, with no joins. Schemas are flexible, which speeds early development. The cost: duplicated data (the customer's name is copied into every order), and multi-document transactions are more limited than relational ones, although modern document databases support them to a degree.

### Wide-column stores

Designed for enormous write volumes and horizontal scale. Data is partitioned by a key and stored sorted within the partition, making writes and range scans by that key extremely efficient:

\`\`\`text
partition key: device_id
clustering key: timestamp
-> all readings for a device, in time order, on one node
\`\`\`

The trade-off is that queries must follow the partition design. Ad-hoc queries on other fields are inefficient or impossible; you design tables around the queries you will run.

### Graph databases

When the questions are about relationships, such as "friends of friends who liked this restaurant" or "accounts connected through shared devices", graph databases traverse connections efficiently, where relational joins would become very slow across many hops.

### What NoSQL typically gives up

| Relational strength | NoSQL trade-off |
|---|---|
| Joins | Denormalise and duplicate data instead |
| Strong transactions across records | Often limited or single-document |
| Flexible ad-hoc queries | Design around known access patterns |
| Schema enforcement | Application must handle validation and evolution |

### Choosing a family

\`\`\`text
Cache, session, counters, simple lookups by key       -> key-value
Nested content with varying structure                 -> document
Huge write volumes or time-ordered data at scale      -> wide-column
Relationship-heavy queries across many hops           -> graph
\`\`\`

Many real systems use a relational database as the core with a key-value cache beside it, adding other families only for specific needs. Polyglot persistence, using several stores, is powerful but each additional store is another system to operate, back up and understand.
      `,
        [
          q('Which NoSQL family suits high-volume, time-ordered writes such as sensor data?', [
            'Graph',
            'Key-value',
            'Document',
            'Wide-column',
          ], 3, 'Wide-column stores partition by key and sort within partitions, handling huge write volumes efficiently.'),
          q('What is a cost of storing a customer\'s name inside every order document?', [
            'Documents cannot contain string values at all',
            'The name is duplicated and hard to update',
            'Reads become slower for every order document',
            'The database refuses to store nested data',
          ], 1, 'Denormalisation speeds reads but duplicates data, making updates harder.'),
          q('When does a graph database clearly beat a relational one?', [
            'Queries across many relationship hops',
            'Storing simple lookups by a single key',
            'Caching session data for logged-in users',
            'Recording sensor readings from many devices',
          ], 0, 'Graph databases traverse connections efficiently where multi-hop joins become slow.'),
        ]
      ),
      lesson('Indexing and Query Performance', 13, `
A query that takes a millisecond on a small table can take minutes when the table grows to a hundred million rows, unless the database can find rows without scanning everything. Indexes make that possible, and they are the most common reason a system is fast or slow.

### What an index is

Without an index, finding orders for one customer means checking every row. An index is a separate structure, usually a B-tree, that maps column values to row locations, so the database jumps straight to the matching rows.

\`\`\`text
Without index: scan 100,000,000 rows -> seconds or minutes
With index:    a few tree lookups     -> milliseconds
\`\`\`

\`\`\`sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
\`\`\`

### What to index

| Index these | Because |
|---|---|
| Columns in WHERE clauses | Filters need fast lookup |
| Foreign keys | Joins and cascades use them |
| Columns used for sorting frequently | Avoids sorting large result sets |
| Columns with uniqueness rules | Unique indexes enforce and speed them |

### Composite indexes and column order

An index on several columns supports queries that filter on a prefix of those columns:

\`\`\`sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, placed_at);
\`\`\`

This helps \`WHERE customer_id = 42 AND placed_at > '2025-01-01'\` and \`WHERE customer_id = 42\`, but not \`WHERE placed_at > '2025-01-01'\` alone. Put the equality columns first, then range columns. Column order in composite indexes is one of the most common performance mistakes.

### Indexes are not free

Every index must be updated on every insert, update and delete of the indexed columns. A table with fifteen indexes writes much more slowly than one with three, and indexes take storage and memory. Index the queries you actually run, and remove indexes that are never used; databases can report index usage statistics.

### Reading the query plan

Databases explain how they will execute a query:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
\`\`\`

Look for sequential scans on large tables, which signal missing indexes, and compare estimated with actual row counts. Learning to read plans is the single most valuable database performance skill.

### Common performance problems

| Problem | Symptom | Fix |
|---|---|---|
| Missing index | Full scans on large tables | Add the right index |
| N+1 queries | One query per item in a loop | Fetch in one query or batch |
| SELECT * | Moving more data than needed | Select only needed columns |
| Functions on indexed columns | \`WHERE LOWER(email) = ...\` skips the index | Index the expression, or store normalised values |
| Deep OFFSET pagination | Slow later pages | Cursor pagination (chapter 2) |
| Lock contention | Slow writes under concurrency | Shorter transactions, fewer hot rows |

### Denormalisation for read speed

Sometimes joins across huge tables remain slow even with indexes. Storing a computed value, such as an order's total or a restaurant's average rating, avoids recomputing it on every read. The cost is keeping the copy correct on writes. Materialised views, precomputed query results refreshed periodically, are another tool for expensive reports.

### Measure before optimising

Slow query logs and monitoring show which queries consume the most time. Fix the top few; they usually account for most of the load. Optimising queries nobody runs wastes effort, and adding indexes without measurement can slow writes for no gain.
      `,
        [
          q('Why does an index make a lookup fast?', [
            'It stores the table in memory permanently',
            'It maps values to row locations so the database avoids scanning every row',
            'It compresses the table',
            'It removes duplicate rows',
          ], 1, 'A tree-structured index lets the database jump to matching rows directly.'),
          q('An index is on (customer_id, placed_at). Which query cannot use it efficiently?', [
            'WHERE customer_id = 42',
            'WHERE customer_id = 42 AND placed_at > \'2025-01-01\'',
            'WHERE placed_at > \'2025-01-01\'',
            'WHERE customer_id = 42 ORDER BY placed_at',
          ], 2, 'Composite indexes serve queries on a prefix of their columns, and placed_at is not the first column.'),
          q('What is the main cost of adding many indexes?', [
            'Reads become slower on every table',
            'Queries can no longer use joins',
            'The table schema can no longer change',
            'Every write must update each index',
          ], 3, 'Indexes speed reads but must be maintained on every write.'),
        ]
      ),
      lesson('Choosing a Data Store for the Job', 12, `
With relational databases, several NoSQL families, caches and search engines available, the question is never "which database is best?" but "which store fits this data and these access patterns?". A repeatable method keeps the decision grounded in requirements rather than trends.

### Start from access patterns

List how the data will be read and written before choosing anything:

\`\`\`text
Orders:
  - Create an order (write, transactional with stock)
  - Read an order by ID (frequent)
  - List a customer's recent orders (frequent, by customer + time)
  - Restaurant dashboard: today's orders by status (frequent)
  - Monthly revenue report (rare, heavy aggregation)
\`\`\`

Each pattern suggests indexes, and together they suggest a store. Here, transactional writes and varied queries point to a relational database with the right indexes, plus caching for hot reads.

### A decision checklist

| Question | Points towards |
|---|---|
| Do writes need multi-record transactions? | Relational |
| Are queries varied and ad hoc? | Relational |
| Is data nested with a flexible shape? | Document store, or JSONB in PostgreSQL |
| Is the workload extremely write-heavy or time-ordered at huge scale? | Wide-column |
| Are the questions about connections between entities? | Graph |
| Is it hot data needing sub-millisecond reads? | In-memory key-value cache |
| Is full-text search a core feature? | A search engine alongside the main store |
| Is it large binary content such as images? | Object storage, with metadata in a database |

### Special-purpose stores

| Need | Typical store |
|---|---|
| Full-text and faceted search | Elasticsearch, OpenSearch, Meilisearch |
| Time series and metrics | TimescaleDB, InfluxDB, Prometheus |
| Files, images, videos | Object storage such as S3-compatible services |
| Vector similarity for AI features | Vector databases or pgvector in PostgreSQL |

These usually sit beside a primary database rather than replacing it. The primary database remains the source of truth; the special-purpose store is fed from it and can be rebuilt.

### Operational realities

Every additional store is a system to run:

- Backups and restores, and someone who has tested them.
- Monitoring, upgrades and security patches.
- Expertise in the team to debug it at 3 a.m.
- Cost, including managed-service fees.

A team of four maintaining PostgreSQL, MongoDB, Cassandra, Elasticsearch and Redis will struggle. Choose the smallest set of stores that meets the requirements.

### A worked decision

A ride-hailing service needs to store driver locations updated every few seconds and answer "which drivers are near this rider?" constantly.

\`\`\`text
Access pattern:  extremely frequent writes, queries by geographic proximity,
                 only the latest location matters
Relational?      Millions of updates per minute strain a single primary,
                 and history is not needed
Choice:          An in-memory store with geospatial indexing (such as Redis)
                 for live locations; the relational database keeps
                 drivers, riders and completed trips
\`\`\`

The relational database remains the system of record; the fast store handles the one pattern it cannot serve well. Chapter 11 develops this design fully.

### Revisit as requirements change

The right choice at 10,000 users may not be right at 10 million. Design so that stores can be added or swapped behind clear interfaces, and let measured growth, not speculation, drive changes.
      `,
        [
          q('What should drive the choice of a data store?', [
            'The most popular database this year',
            'The data\'s shape and its read and write access patterns',
            'The database with the longest name',
            'Whatever a large tech company uses',
          ], 1, 'Access patterns and data shape determine which store fits the requirements.'),
          q('Where should large images and videos usually be stored?', [
            'Directly inside relational table rows',
            'In a graph database',
            'In object storage, with metadata in a database',
            'In a message queue',
          ], 2, 'Object storage handles large binary content efficiently while the database tracks metadata.'),
          q('Why limit the number of different data stores in a system?', [
            'Each store adds backups, monitoring and cost',
            'Databases cannot connect to each other directly',
            'Only one database is allowed per application',
            'Multiple stores always cause data loss',
          ], 0, 'Every additional store must be operated, secured and understood by the team.'),
        ]
      ),
      ],
      [
      q('Which property ensures committed data survives a crash?', [
        'Atomicity',
        'Isolation',
        'Consistency',
        'Durability',
      ], 3, 'Durability guarantees that once a transaction commits, its data persists through failures.'),
      q('A team needs to store nested product content with varying fields inside an existing PostgreSQL system. What is a reasonable first option?', [
        'Deploy a separate document database immediately',
        'Use a JSONB column in PostgreSQL',
        'Store the content as image files',
        'Split each field into its own table',
      ], 1, 'Modern relational databases handle semi-structured data through JSON columns, avoiding a new store.'),
      q('A query on a huge table shows a sequential scan in its plan. What is the likely fix?', [
        'Add more OFFSET to the query',
        'Remove all existing indexes',
        'Add an index on the filtered column',
        'Switch to a graph database',
      ], 2, 'Sequential scans on large tables usually mean the filter column lacks a suitable index.'),
      q('What role does the primary database keep when special-purpose stores are added?', [
        'It stays the source of truth that other stores are fed from',
        'It is deleted once the search engine exists',
        'It only stores backups',
        'It becomes a cache',
      ], 0, 'Special-purpose stores derive from the system of record and can be rebuilt from it.'),
      ]
    ),
    chapter(
      'Caching and Content Delivery',
      'Decide why and where to cache, apply cache-aside, write-through and other strategies with sound invalidation, deliver static content through CDNs, and avoid stampedes, stale data and other classic cache pitfalls.',
      [
      lesson('Why and Where to Cache', 13, `
A cache stores copies of data somewhere faster than its original home, so repeated requests avoid expensive work. Caching is often the single biggest performance win available, turning database-bound systems into ones that serve most traffic from memory. It is also a source of subtle bugs when data changes, so it must be applied deliberately.

### What caching buys

Recall the latency numbers: memory is thousands of times faster than disk, and a request that never reaches the database costs the database nothing. For a read-heavy system, a cache with a high hit rate does two things at once: responses get faster, and the database is protected from load.

\`\`\`text
Menu requests: 500 per second at peak
Cache hit rate: 95%
Database sees: 25 requests per second instead of 500
\`\`\`

### Layers where caching happens

| Layer | Example | Caches |
|---|---|---|
| Client | Browser cache, mobile app cache | Images, scripts, API responses with cache headers |
| CDN | Edge servers near users | Static files, sometimes API responses |
| Load balancer or gateway | Reverse proxy cache | Whole responses for public pages |
| Application | In-process memory | Small, hot reference data |
| Distributed cache | Redis, Memcached | Shared data across all app servers |
| Database | Buffer pool, query cache | Recently used pages and results |

Each layer is closer to the user than the next, and each has different sharing and consistency properties.

### In-process versus distributed caches

An in-process cache lives inside each application server's memory. It is the fastest possible, with no network hop, but every server has its own copy: a menu cached on server A is not known to server B, and invalidation must reach every server. It suits small, rarely changing data such as configuration and country lists.

A distributed cache such as Redis is a separate service shared by all servers. It adds a network round trip within the data centre, still far faster than a database query, and all servers see the same cached data. It is the workhorse for most application caching: sessions, rendered fragments, query results, rate limit counters.

### What is worth caching

| Good candidates | Poor candidates |
|---|---|
| Read far more often than written | Written as often as read |
| Expensive to compute or fetch | Cheap to fetch anyway |
| Tolerates brief staleness | Must always be exactly current |
| Requested repeatedly by many users | Unique per request |

A restaurant's menu, a product page, a user's profile and a leaderboard are ideal. A customer's live wallet balance during a payment is not.

### Cache hit rate

The share of requests served from the cache decides its value. A 50% hit rate halves database load; 99% removes it almost entirely. Measure hit rates per cache and per key type; a low hit rate often means keys are too specific, expiry is too short, or the data is not really repeated.

### Caching is a trade

Every cache trades freshness for speed. The question to answer for each cached item is: how stale can this be before it causes a problem? A menu five minutes old is fine; a stock count five minutes old may sell items that no longer exist. The next lesson covers how to keep caches acceptably fresh.
      `,
        [
          q('Why does a cache protect a database as well as speeding responses?', [
            'Requests served from the cache never reach the database',
            'Caches make the database\'s disks faster',
            'Caches rewrite slow queries automatically',
            'Databases refuse requests when a cache exists',
          ], 0, 'Cache hits avoid database queries entirely, reducing load as well as latency.'),
          q('What is a drawback of an in-process cache across many servers?', [
            'It is slower than a call over the network',
            'Each server holds its own separate copy',
            'It cannot store string values at all',
            'It uses no memory on the application server',
          ], 1, 'In-process caches are not shared, so servers can hold different versions of data.'),
          q('Which data is a poor caching candidate?', [
            'A restaurant\'s menu',
            'A public product page',
            'A live wallet balance during a payment',
            'A weekly leaderboard',
          ], 2, 'Data that must be exactly current cannot tolerate the staleness caching introduces.'),
        ]
      ),
      lesson('Cache Strategies and Invalidation', 14, `
How data gets into a cache, and how it gets out when it changes, determines whether the cache is a reliable accelerator or a source of wrong answers. A few well-known strategies cover most situations, and each handles freshness differently.

### Cache-aside (lazy loading)

The application checks the cache first and loads from the database on a miss:

\`\`\`text
read(key):
  value = cache.get(key)
  if value is missing:
      value = database.query(key)
      cache.set(key, value, ttl=300)
  return value
\`\`\`

Only requested data is cached, and the cache can be lost without breaking anything. This is the most common pattern. Its weaknesses: the first request after a miss is slow, and data can be stale until it expires or is invalidated.

### Read-through

Similar to cache-aside, but the cache itself loads missing data from the database, so the application only talks to the cache. Cleaner application code, at the cost of a cache layer that understands the data source.

### Write-through

Writes go to the cache and the database together, so the cache is always current for written keys:

\`\`\`text
write(key, value):
  database.save(key, value)
  cache.set(key, value)
\`\`\`

Reads after writes are consistent, but every write pays for updating the cache, including data nobody reads.

### Write-behind (write-back)

Writes go to the cache immediately and are flushed to the database later in batches. Very fast writes, but data in the cache and not yet in the database can be lost if the cache fails. Used for things like view counters where losing a few seconds of updates is acceptable.

### Comparing strategies

| Strategy | Reads | Writes | Freshness | Risk |
|---|---|---|---|---|
| Cache-aside | Fast after first miss | Unaffected | Stale until expiry or invalidation | Low |
| Write-through | Fast | Slower | Current for written keys | Low |
| Write-behind | Fast | Very fast | Current in cache | Data loss on cache failure |

### Expiry (TTL)

A time-to-live limits how stale data can get:

\`\`\`text
Menus:           5 minutes    change rarely, brief staleness fine
Product prices:  60 seconds   change occasionally, staleness costly
Session data:    30 minutes   expires with the session anyway
Static reference: 24 hours    almost never changes
\`\`\`

Short TTLs keep data fresh but reduce hit rates; long TTLs do the opposite. Choose per data type based on how quickly changes must be visible.

### Explicit invalidation

For data that must update promptly, delete or update the cache entry when the source changes:

\`\`\`text
update_menu(restaurant_id, changes):
  database.update(...)
  cache.delete("menu:" + restaurant_id)
\`\`\`

The next read repopulates the cache. Deleting is usually safer than updating in place, because it avoids races where an older value overwrites a newer one.

### Why invalidation is hard

The difficulty is knowing every cached key affected by a change. Updating a dish's price may affect the menu cache, a "popular dishes" cache, search results and a home page fragment. Strategies that help:

- Keep cache keys structured and documented, such as \`menu:{restaurant_id}\`.
- Cache at the level of stable entities rather than large composite pages.
- Use versioned keys: store a version number per restaurant, include it in keys, and bump it on change so old entries are simply never read again.
- Accept short TTLs as a safety net even when invalidating explicitly.

### Cache warming

After a deployment or cache restart, an empty cache sends all traffic to the database, which can overload it. Warming pre-loads the most important keys before taking traffic, or ramps traffic gradually.
      `,
        [
          q('In cache-aside, what happens on a cache miss?', [
            'The request fails',
            'The application loads from the database and stores the result in the cache',
            'The cache queries a different cache',
            'The database is bypassed permanently',
          ], 1, 'Cache-aside lazily populates the cache when data is first requested.'),
          q('What is the main risk of write-behind caching?', [
            'Reads are always slow',
            'Every write hits the database twice',
            'Data cannot be cached for more than a second',
            'Updates not yet flushed can be lost if the cache fails',
          ], 3, 'Write-behind delays database writes, so unflushed data is vulnerable to cache failure.'),
          q('Why delete a cache entry on change rather than update it in place?', [
            'It avoids races where an old value overwrites a newer one',
            'Deleting is faster than the database',
            'Caches cannot store updated values',
            'Deletion warms the cache',
          ], 0, 'Deleting forces a fresh load and sidesteps ordering problems between concurrent writes.'),
        ]
      ),
      lesson('Content Delivery Networks', 13, `
A user in Peshawar requesting an image from a server in Frankfurt waits for the round trip across continents before a single byte arrives. A content delivery network places copies of content on servers around the world, so users fetch from somewhere nearby. For anything with users in more than one region, a CDN is one of the cheapest, most effective improvements available.

### How a CDN works

\`\`\`text
User in Peshawar -> nearest CDN edge (for example in the region)
   cache hit:  served from the edge in tens of milliseconds
   cache miss: edge fetches from the origin server, caches it,
               serves it, and serves it to the next user from cache
\`\`\`

The origin is your server or storage. The edge servers, often hundreds worldwide, hold cached copies. DNS routes each user to a nearby edge.

### What to serve through a CDN

| Content | Why |
|---|---|
| Images, videos, fonts | Large, unchanging, requested repeatedly |
| JavaScript and CSS bundles | Identical for every user |
| Downloadable files | Big transfers benefit most from proximity |
| Public API responses | Cacheable responses such as a public menu, with short TTLs |
| Entire static sites | Pre-rendered pages served entirely from the edge |

Dynamic, personalised responses generally still come from the origin, though CDNs can cache them briefly or run logic at the edge for some cases.

### Cache control headers

The origin tells the CDN and browsers how long content may be cached:

\`\`\`text
Cache-Control: public, max-age=31536000, immutable   (versioned assets)
Cache-Control: public, max-age=300                    (a public menu)
Cache-Control: private, no-store                      (personal data)
\`\`\`

### Versioned file names

If \`app.js\` is cached for a year, how do users get the new version after a deployment? Include a version or hash in the file name:

\`\`\`text
/static/app.3f9c2ab.js
\`\`\`

A new build produces a new name, so old caches are never a problem, and the file can be cached for as long as you like. Build tools do this automatically.

### Benefits beyond speed

- **Origin offload**: the origin serves a fraction of the requests, so fewer or smaller servers are needed.
- **Bandwidth cost**: CDN egress is often cheaper than serving from cloud servers.
- **Resilience**: edges absorb traffic spikes and some kinds of attack traffic.
- **HTTPS and compression**: handled at the edge with minimal setup.

### Purging

When content must change before its TTL expires, such as a corrected image, purge it from the CDN. Purges are supported by all major CDNs but take time to propagate. Versioned names avoid most purging needs.

### Regional considerations

Coverage varies by provider and region. Check where a CDN's edges are relative to your users; for Pakistani audiences, edges in South Asia and the Middle East matter more than a large presence in North America. Also consider mobile networks: many users are on 3G and 4G with limited bandwidth, so serving appropriately sized, compressed images through a CDN improves experience more than almost any server optimisation.

### A CDN is a cache

Everything from the previous lesson applies: hit rates, TTLs and invalidation. Measure the edge hit rate; a low rate usually means missing cache headers or uncacheable URLs, such as query strings that vary per request.
      `,
        [
          q('What happens on a CDN cache miss?', [
            'The user receives an error page from the edge',
            'The request is dropped without any response',
            'The edge fetches from the origin and caches it',
            'The origin is bypassed and the request fails',
          ], 2, 'On a miss, the edge retrieves content from the origin and keeps a copy for later requests.'),
          q('Why include a hash in static file names?', [
            'New builds get new names, so long cache lifetimes never serve stale files',
            'Hashes make files smaller',
            'CDNs require hashed names',
            'Browsers cannot cache unhashed files',
          ], 0, 'Versioned names let assets be cached for a long time while updates take effect immediately.'),
          q('Which header marks personal data as uncacheable by shared caches?', [
            'Cache-Control: public, max-age=300',
            'Cache-Control: immutable',
            'Cache-Control: private, no-store',
            'Content-Type: application/json',
          ], 2, 'private and no-store prevent shared caches from storing personalised responses.'),
        ]
      ),
      lesson('Cache Pitfalls: Stampedes and Stale Data', 13, `
Caches fail in characteristic ways, and several of them turn a small hiccup into a full outage. Knowing the classic pitfalls, and their standard remedies, is what separates a cache that helps from one that hurts under pressure.

### Cache stampede (thundering herd)

A popular key expires. In the next instant, thousands of requests miss the cache at once and all query the database for the same data. The database, which was handling 5% of traffic, suddenly receives 100%, slows down, and requests pile up.

Remedies:

| Remedy | How it works |
|---|---|
| Request coalescing (single flight) | Only one request recomputes; others wait for its result |
| Locking | The first miss takes a short lock; others serve stale data or wait |
| Early refresh | Refresh popular keys shortly before expiry, in the background |
| Jittered TTLs | Add randomness to expiry so many keys do not expire together |
| Stale-while-revalidate | Serve the expired value while one request refreshes it |

### Cold cache after restart

A restarted cache is empty, so every request misses. If the database cannot handle full traffic, the system falls over just as it comes back up. Warm the cache before taking traffic, restart cache nodes one at a time, or use a cache with persistence that reloads its data.

### Stale data

Serving old data is the fundamental cache trade-off, but some staleness is unacceptable: a customer sees a price, then is charged a different one. Remedies include explicit invalidation on writes, short TTLs for sensitive data, and reading critical values from the source of truth at the moment they matter, such as re-checking the price when the order is placed.

### Cache penetration

Requests for keys that do not exist, such as a bot requesting random product IDs, always miss the cache and always hit the database. Remedies: cache the fact that a key is missing (a negative cache with a short TTL), validate IDs before querying, or use a Bloom filter to reject IDs that cannot exist.

### Hot keys

One extremely popular key, such as a viral post, can overwhelm a single cache node because all requests for that key go to the same place. Remedies include replicating the hot key across several nodes, adding a small in-process cache in front of the distributed cache for the hottest items, and monitoring key access patterns.

### Inconsistent keys

Two parts of the system cache the same data under different keys, or one updates the database without invalidating the other's cache. The result is contradictory data on different screens. A shared, documented key scheme and a single invalidation path fix this.

### Caching failures

If a database error is cached, every user sees the error until it expires. Only cache successful results, and treat cache failures themselves gracefully: when the cache is unavailable, fall back to the database with protective rate limits rather than failing every request.

### Memory and eviction

Caches have limited memory. When full, they evict entries using a policy such as least recently used (LRU). Watch eviction rates: constant eviction means the cache is too small for its working set, and hit rates suffer. Set a memory limit and an eviction policy explicitly rather than letting the cache grow until the server runs out of memory.

### Observe everything

Track hit rate, miss rate, eviction rate, latency and memory per cache. A change in these numbers is often the earliest warning of trouble, such as a deployment that changed key names and silently dropped the hit rate to zero.
      `,
        [
          q('What is a cache stampede?', [
            'Many simultaneous misses after a hot key expires',
            'A cache running out of disk space',
            'Two caches sharing the same key name',
            'A CDN purging all of its content at once',
          ], 0, 'When a hot key expires, simultaneous misses can flood the database with identical queries.'),
          q('How does jittering TTLs help?', [
            'It makes every key expire at the same moment',
            'It spreads expirations so many keys do not miss together',
            'It increases memory use',
            'It removes the need for invalidation',
          ], 1, 'Random variation in expiry times avoids synchronised misses across many keys.'),
          q('What does a negative cache address?', [
            'Hot keys on one node',
            'Cold caches after restart',
            'Stale prices',
            'Repeated requests for keys that do not exist',
          ], 3, 'Caching "not found" results stops non-existent keys from hitting the database every time.'),
        ]
      ),
      ],
      [
      q('Which layer holds cached data shared by all application servers?', [
        'The browser cache',
        'An in-process cache',
        'A distributed cache such as Redis',
        'The database buffer pool',
      ], 2, 'A distributed cache is a separate service that every server reads and writes.'),
      q('Which strategy keeps the cache current for every written key at the cost of slower writes?', [
        'Cache-aside',
        'Write-through',
        'Write-behind',
        'Negative caching',
      ], 1, 'Write-through updates cache and database together on each write.'),
      q('What is the main benefit of a CDN for users in Pakistan accessing a European origin?', [
        'Content served from a nearby edge avoids long round trips',
        'The origin server becomes faster',
        'Images are converted to text',
        'Mobile data becomes free',
      ], 0, 'Edges near users cut the latency of fetching content across continents.'),
      q('A cache restart causes an outage. What would have prevented it?', [
        'Longer TTLs on all keys',
        'Removing the database',
        'Caching error responses',
        'Warming the cache or restarting nodes gradually',
      ], 3, 'An empty cache sends full traffic to the database, so warming or gradual restarts protect it.'),
      ]
    ),
    chapter(
      'Load Balancing and Scaling',
      'Compare vertical and horizontal scaling, distribute traffic with load balancers and their algorithms, design stateless services that scale freely, and plan capacity with autoscaling and headroom.',
      [
      lesson('Vertical and Horizontal Scaling', 12, `
When a system runs out of capacity, there are two ways to get more: make the machine bigger, or add more machines. Each has limits and costs, and most large systems use both at different layers.

### Vertical scaling (scaling up)

Replace the server with a more powerful one: more CPU cores, more memory, faster disks.

| Strengths | Limits |
|---|---|
| Simple: no code or architecture changes | There is a biggest machine you can buy |
| No distributed complexity | Cost rises steeply at the top end |
| Great for databases, which are hard to distribute | Still a single point of failure |
| Immediate | Upgrades may need downtime |

Vertical scaling is underrated. A database server with hundreds of gigabytes of memory and fast NVMe storage handles workloads that would have needed a cluster a decade ago. For stateful systems, scaling up is often the right first move.

### Horizontal scaling (scaling out)

Add more servers and spread the work across them.

| Strengths | Requirements |
|---|---|
| Nearly unlimited capacity | Work must be divisible across machines |
| Redundancy: one server failing is survivable | Something must distribute requests (a load balancer) |
| Commodity hardware is cheaper per unit | Services must handle running as many copies |
| Scales down as well as up | Shared state must live somewhere shared |

Horizontal scaling is natural for stateless web and API servers: run ten identical copies behind a load balancer, and any of them can serve any request.

### Which layer scales which way

\`\`\`text
Web and API servers      horizontal: many stateless copies
Cache                    horizontal: partition keys across nodes
Database writes          vertical first, then sharding (chapter 7)
Database reads           horizontal: read replicas
Background workers       horizontal: many consumers on a queue
\`\`\`

### The stateless prerequisite

Horizontal scaling only works if any server can handle any request. If a user's session lives in one server's memory, their next request must reach the same server, which complicates balancing and breaks when that server dies. The third lesson of this chapter addresses this.

### Scaling and failure

Two servers do not just double capacity; they change the failure story. With one server, any failure is an outage. With three servers each running at 60% capacity, losing one leaves two at 90%: degraded but alive. Capacity planning must leave headroom for failures, not just for traffic.

### Diminishing returns

Adding servers does not scale forever. Shared resources, the database, the cache, the network, eventually become the bottleneck, and coordination overhead grows. The point of scaling a layer is to move the bottleneck somewhere that can be addressed next; system design is largely the practice of finding and relieving the current bottleneck.

### Cost thinking

Cloud pricing makes both approaches easy to try. A common pattern: scale stateless services horizontally with autoscaling, keep the database on a suitably large instance with replicas, and revisit when measurements show a new bottleneck. Spending on the largest database instance while API servers idle, or vice versa, wastes money; measure where the load actually is.
      `,
        [
          q('What is a fundamental limit of vertical scaling?', [
            'There is a largest machine available, at steeply rising cost',
            'It requires rewriting the application',
            'It only works for web servers',
            'It always needs a load balancer',
          ], 0, 'Scaling up eventually hits the ceiling of the biggest, most expensive hardware.'),
          q('What must be true for a service to scale horizontally?', [
            'It must run on one very large server',
            'It must store sessions in local memory',
            'Any copy must be able to handle any request, with shared state stored elsewhere',
            'It must avoid using a database',
          ], 2, 'Stateless copies behind a load balancer are the basis of horizontal scaling.'),
          q('Three servers run at 60% capacity and one fails. What happens?', [
            'The system fails completely',
            'The remaining two run near 90%, degraded but working',
            'Capacity is unaffected',
            'The load balancer stops',
          ], 1, 'Headroom lets the survivors absorb the failed server\'s share of traffic.'),
        ]
      ),
      lesson('Load Balancers and Algorithms', 14, `
A load balancer sits between clients and a group of servers, distributing requests among them. It is what makes horizontal scaling usable, and it also hides failures: when a server dies, the load balancer stops sending it traffic. Nearly every scalable system has one or more.

### What a load balancer does

\`\`\`text
Clients -> Load balancer -> Server A
                         -> Server B
                         -> Server C
\`\`\`

- Distributes requests across healthy servers.
- Checks server health and removes failing ones from rotation.
- Terminates TLS, so servers handle plain HTTP internally.
- Provides one stable address while servers come and go.

### Layer 4 versus layer 7

| Type | Works with | Can do | Typical use |
|---|---|---|---|
| Layer 4 (transport) | TCP/UDP connections | Route by IP and port, very fast | Databases, raw TCP services, extreme throughput |
| Layer 7 (application) | HTTP requests | Route by path, host, headers, cookies; retries; caching | Web and API traffic |

A layer 7 balancer can send \`/api/orders\` to the order service and \`/api/menus\` to the menu service, which layer 4 cannot see.

### Balancing algorithms

| Algorithm | How it works | Best when |
|---|---|---|
| Round robin | Each request goes to the next server in turn | Servers are equal and requests are similar |
| Weighted round robin | Bigger servers get proportionally more requests | Mixed server sizes |
| Least connections | Send to the server with the fewest active connections | Requests vary in duration |
| Least response time | Prefer the fastest-responding server | Latency-sensitive services |
| IP hash or consistent hashing | The same client or key always goes to the same server | Session affinity, cache locality |
| Random with two choices | Pick two at random, choose the less loaded | Large fleets, avoids herd effects |

Least connections is a strong default for APIs with varied request times; round robin is fine for uniform work.

### Health checks

The balancer regularly probes each server, for example \`GET /health\` every few seconds. Servers that fail several checks are removed; those that recover are added back. Health checks should reflect real readiness, the same principle as readiness probes in container platforms: a server that responds but cannot reach its database should fail the check.

### Where load balancers live

\`\`\`text
Internet -> Global DNS or anycast -> Regional load balancer -> API servers
                                                            -> Internal load balancer -> services
\`\`\`

Global load balancing routes users to the nearest healthy region. Regional balancers spread traffic across servers. Internal balancers, or service discovery in container platforms, spread service-to-service calls.

### Avoiding a single point of failure

A single load balancer is itself a risk. Managed cloud load balancers are internally redundant; self-hosted ones run in pairs with failover. The balancer is the front door; its availability must exceed that of anything behind it.

### Connection draining

When a server is removed for deployment, in-flight requests should finish. Draining stops new requests to the server while letting current ones complete, avoiding errors during routine operations. Combined with rolling deployments, users never notice a release.

### Load balancers versus reverse proxies and API gateways

Reverse proxies (Nginx, HAProxy, Envoy) balance load and also cache, compress and rewrite. API gateways add authentication, rate limiting, request transformation and API management. In practice, the roles overlap, and one component often does several jobs at the edge of a system.
      `,
        [
          q('What can a layer 7 load balancer do that a layer 4 one cannot?', [
            'Forward TCP connections',
            'Route requests based on paths, hosts and headers',
            'Check server health',
            'Use round robin',
          ], 1, 'Layer 7 understands HTTP, enabling content-based routing.'),
          q('Which algorithm suits requests that vary widely in duration?', [
            'Plain round robin',
            'Least connections',
            'IP hash',
            'Alphabetical order',
          ], 1, 'Least connections directs new work to the server with the least in-flight load.'),
          q('Why should a health check test more than "the process responds"?', [
            'Processes never crash once they start',
            'Health checks are optional on most balancers',
            'A server with broken dependencies should leave rotation',
            'It makes the checks themselves run faster',
          ], 2, 'Meaningful checks reflect the server\'s ability to actually serve requests.'),
        ]
      ),
      lesson('Stateless Services and Sessions', 13, `
The easiest services to scale are those that remember nothing between requests. Every request carries or references what it needs, and any server can handle it. Achieving this means moving state out of application servers and into places designed to hold it.

### What "state" means here

State is anything a server keeps in memory between requests that another request depends on:

- Logged-in user sessions.
- Shopping carts held in memory.
- Uploaded files stored on the local disk.
- In-progress multi-step workflows.
- Local caches that must be consistent.

If server A holds Sana's cart in memory and her next request lands on server B, the cart is gone. That is the problem stateless design solves.

### Where state should live

| State | Move it to |
|---|---|
| Sessions | A shared store such as Redis, or a signed token carried by the client |
| Carts and drafts | The database or a shared cache |
| Uploaded files | Object storage |
| Workflow progress | The database or a workflow engine |
| Shared caches | A distributed cache |

The application servers then hold nothing that cannot be recreated, so they can be added, removed and replaced freely.

### Session strategies

**Server-side sessions in a shared store**: the client holds a session ID in a cookie; any server looks the session up in Redis. Simple to revoke and inspect; requires the store to be fast and available.

**Stateless tokens (such as JWTs)**: the session data is signed and carried by the client. Servers verify the signature without any lookup, which scales beautifully. Revoking a token before expiry is hard, so tokens are kept short-lived, often with a refresh mechanism.

**Sticky sessions**: the load balancer sends a client to the same server every time. This keeps in-memory state working but breaks when that server dies, complicates deployments and unbalances load. It is a workaround for legacy applications, not a design goal.

### Idempotent and self-contained requests

Stateless design pairs with requests that include what they need: the user's identity via a token, the resource ID in the URL, the data in the body. Combined with idempotency keys (chapter 2), any server can safely process any request, including retries.

### Stateless does not mean no state

The system as a whole is full of state; it is simply concentrated in components built for it: databases, caches, queues and object storage. Those components are scaled with their own techniques, such as replication and partitioning. The application tier becomes a set of interchangeable workers in front of them.

### Twelve-factor guidance

The widely followed twelve-factor app principles say processes should be stateless and share nothing, with any persistent data in backing services. Following this makes services easy to run in containers, scale with autoscalers and deploy with zero downtime, because instances are disposable.

### Migrating a stateful application

Legacy applications often keep sessions and files locally. A practical migration path:

\`\`\`text
1. Move file uploads to object storage.
2. Move sessions to a shared store; keep sticky sessions temporarily.
3. Remove other in-memory state or move it to a cache.
4. Turn off sticky sessions and confirm any server can serve any user.
5. Scale horizontally and test failover by killing an instance.
\`\`\`

The final test, killing an instance and seeing no user impact, is the proof that the service is truly stateless.
      `,
        [
          q('Why do sticky sessions undermine horizontal scaling?', [
            'They make requests slower on every server',
            'They tie users to one server, breaking when it fails and unbalancing load',
            'They require object storage',
            'They prevent the use of cookies',
          ], 1, 'Sticky sessions keep state on individual servers, which defeats interchangeable instances.'),
          q('Where should uploaded files be stored in a stateless design?', [
            'On each application server\'s local disk',
            'In the load balancer',
            'In object storage accessible to every server',
            'In the user\'s browser only',
          ], 2, 'Object storage lets any server read and write files, keeping application servers disposable.'),
          q('What is a drawback of stateless JWT sessions?', [
            'Servers must look up every request in Redis',
            'They cannot be verified without the database',
            'Revoking a token before it expires is difficult',
            'They only work with sticky sessions',
          ], 2, 'Because servers do not check a store, an issued token remains valid until expiry unless extra measures exist.'),
        ]
      ),
      lesson('Autoscaling and Capacity Planning', 13, `
Traffic changes by hour, day and season. Running enough servers for the peak all the time wastes money; running too few loses users when the peak arrives. Autoscaling adjusts capacity to demand, and capacity planning ensures the limits and headroom are right before demand tests them.

### How autoscaling works

\`\`\`text
Every interval:
  measure a signal (CPU, requests per second, queue length, latency)
  compare with a target
  add or remove instances within a minimum and maximum
\`\`\`

| Signal | Suits |
|---|---|
| CPU utilisation | CPU-bound services; simple and common |
| Requests per second per instance | Web and API tiers with predictable per-request cost |
| Queue length | Background workers: more messages, more workers |
| Latency | Directly user-facing targets, but noisier |
| Schedule | Known patterns, such as evening peaks or Ramadan timings |

### Scaling is not instant

New instances take time: provisioning a virtual machine, starting the application, warming caches and connection pools, passing health checks. This can take a minute or several. A spike that arrives faster than instances can start is served by whatever capacity already exists. Therefore:

- Keep a minimum that handles normal traffic plus a buffer.
- Scale up aggressively and scale down slowly.
- Use scheduled scaling ahead of predictable peaks.
- Make instances start quickly: small images, fast startup, pre-warmed pools.

### Headroom

Capacity planning is about headroom: the margin between normal load and the point where the system degrades.

\`\`\`text
Normal peak:         600 requests/s
Instance capacity:   100 requests/s at healthy latency
Minimum instances:   9   (600/100 = 6, plus headroom for a failure and a spike)
Target utilisation:  around 60 to 70%, not 95%
\`\`\`

Running at 95% utilisation leaves nothing for a failed instance, a deployment or a sudden spike. Utilisation targets of 60 to 70% are common for latency-sensitive tiers.

### Load testing

Estimates are hypotheses; load tests are evidence. Test in a staging environment that resembles production:

- Ramp traffic gradually and find where latency rises sharply; that is the practical capacity.
- Hold at expected peak to check stability over time.
- Test failure: remove an instance under load and confirm the rest cope.
- Watch downstream systems; the database or a third-party API often breaks before the application tier.

### Scaling the whole chain

Autoscaling the API tier from 9 to 30 instances triples the load on the database, the cache and every dependency. Each must have capacity or protective limits, or scaling the front simply moves the outage backwards. Chapter 9 covers the protective patterns: connection limits, rate limiting and backpressure.

### Cost and efficiency

Autoscaling reduces cost by removing idle capacity at night and on quiet days. Track cost per request or per thousand users as a metric; improvements in efficiency, such as caching, often cut infrastructure cost more than any negotiation with the cloud provider.

### Planning for growth

Revisit capacity plans regularly and before known events: product launches, marketing campaigns, Eid sales. A simple spreadsheet projecting traffic growth against measured capacity, with dates when limits will be reached, turns capacity from a surprise into a scheduled project.
      `,
        [
          q('Why keep a minimum instance count above the bare requirement?', [
            'Autoscaling cannot add instances',
            'New instances take time to start, so existing capacity must absorb spikes and failures',
            'Cloud providers charge less for more instances',
            'Minimums are required by load balancers',
          ], 1, 'Headroom covers the delay before new capacity is ready and the loss of an instance.'),
          q('What signal best drives scaling of background workers?', [
            'CPU of the database',
            'Time of day only',
            'Queue length',
            'Number of users registered',
          ], 2, 'A growing backlog of messages directly indicates that more workers are needed.'),
          q('What often breaks first when the API tier scales up sharply?', [
            'The load balancer\'s DNS name',
            'The autoscaler itself',
            'The user\'s browser',
            'Downstream dependencies such as the database',
          ], 3, 'More instances multiply load on shared dependencies, which must have capacity or protection.'),
        ]
      ),
      ],
      [
      q('Which layer is usually scaled vertically first?', [
        'Stateless API servers',
        'Background workers',
        'The primary database',
        'CDN edges',
      ], 2, 'Databases are hard to distribute, so a bigger machine is often the right first step.'),
      q('What does a load balancer do when a server fails health checks?', [
        'Stops sending it traffic until it recovers',
        'Restarts the whole cluster',
        'Sends it more traffic to test it',
        'Deletes its data',
      ], 0, 'Failing servers are removed from rotation, hiding the failure from users.'),
      q('What proves a service is truly stateless?', [
        'It has no database behind it',
        'It uses sticky sessions on the balancer',
        'Killing an instance under load affects no user',
        'It runs on one very large server',
      ], 2, 'If any instance can vanish without affecting users, no request depends on server-local state.'),
      q('Why scale up aggressively but scale down slowly?', [
        'Removing instances costs more than adding them',
        'Spikes need capacity fast, and slow scale-down avoids flapping',
        'Cloud providers require this behaviour',
        'Scaling down is not supported by autoscalers',
      ], 1, 'Asymmetric scaling protects against sudden demand while avoiding flapping.'),
      ]
    ),
    chapter(
      'Asynchronous Processing',
      'Decouple systems with message queues and brokers, broadcast events with publish-subscribe and event streaming, understand delivery guarantees and build idempotent consumers, and run background jobs and schedules reliably.',
      [
      lesson('Message Queues and Brokers', 13, `
A message queue lets one part of a system hand work to another without waiting for it. The producer puts a message on the queue and moves on; a consumer picks it up when it is ready. This simple idea decouples services, absorbs traffic spikes and makes systems resilient to slow or failing components.

### The basic model

\`\`\`text
Producer -> [ message queue ] -> Consumer
Order service places "send confirmation for order 8821"
Notification worker picks it up seconds later and sends the SMS
\`\`\`

The producer needs only the queue to be available. The consumer can be slow, restarting or temporarily down; messages wait until it returns.

### What queues give you

| Benefit | Explanation |
|---|---|
| Decoupling | Producers and consumers do not know about each other's availability |
| Buffering | Spikes pile up in the queue and are processed at a steady rate |
| Resilience | A failed consumer does not lose work; messages stay queued |
| Scalability | Add consumers to process faster |
| Load levelling | Expensive work is smoothed rather than done in bursts |

### Point-to-point delivery

In a classic queue, each message is delivered to one consumer. Several consumers on the same queue share the work, which is how background processing scales:

\`\`\`text
Queue: image-processing
Consumers: 4 workers, each taking the next available message
\`\`\`

### Common brokers

| Broker | Character |
|---|---|
| RabbitMQ | Feature-rich traditional broker with flexible routing |
| Amazon SQS and similar cloud queues | Managed, simple, highly available |
| Redis lists and streams | Lightweight, fast, good when Redis already exists |
| Apache Kafka | A distributed log for streaming; covered in the next lesson |

For most applications, a managed queue or RabbitMQ is enough. Kafka suits high-volume event streams and replayable history.

### Acknowledgements

A consumer takes a message, processes it, then acknowledges it. If the consumer crashes before acknowledging, the broker redelivers the message to another consumer. This is what makes work survive failures, and it is also why a message can be delivered more than once, the subject of the third lesson.

### Dead-letter queues

Some messages fail repeatedly: malformed data, a bug for one edge case, a permanently missing record. Retrying forever blocks the queue. After a set number of attempts, the broker moves the message to a dead-letter queue, where it can be inspected, fixed and replayed without holding up everything else. Monitor the dead-letter queue; a growing one is an early warning of a bug.

### Queue depth as a signal

The number of waiting messages shows whether consumers keep up. A steady depth is healthy; a growing depth means consumers are too slow or too few, which is exactly the signal autoscalers use to add workers. A queue growing without bound will eventually exhaust broker storage, so set alerts.

### Ordering

Most queues do not guarantee strict ordering across many consumers. If order matters, such as "update address" followed by "confirm order", either process related messages on one consumer using a partition key, or design messages so that order does not matter. Assuming ordering that the broker does not guarantee is a classic bug.

### Message design

Keep messages small and self-describing: an event type, a version, the IDs needed and a timestamp. Sending large payloads through a queue slows it; store large data elsewhere and send a reference. Include enough information for the consumer to do its job without calling back to the producer, where practical.
      `,
        [
          q('What happens if a consumer crashes before acknowledging a message?', [
            'The message is lost permanently',
            'The broker redelivers it to a consumer',
            'The producer must resend it manually',
            'The queue is deleted',
          ], 1, 'Unacknowledged messages return to the queue so work survives consumer failures.'),
          q('What is a dead-letter queue for?', [
            'Holding messages that failed repeatedly so they do not block others',
            'Storing messages that were processed successfully',
            'Encrypting messages in transit',
            'Speeding up delivery of urgent messages',
          ], 0, 'Repeatedly failing messages are set aside for inspection instead of retrying forever.'),
          q('A queue\'s depth keeps growing. What does it indicate?', [
            'The broker is idle',
            'Producers have stopped sending',
            'Messages are being processed too quickly',
            'Consumers are too slow or too few to keep up',
          ], 3, 'Growing depth means arrivals outpace processing, a signal to add or speed up consumers.'),
        ]
      ),
      lesson('Publish-Subscribe and Event Streaming', 13, `
A queue delivers each message to one consumer. But often several parts of a system care about the same event: when an order is placed, notifications, analytics, inventory and fraud detection all want to know. Publish-subscribe delivers events to every interested consumer, and event streaming platforms extend this with durable, replayable history.

### Publish-subscribe

Producers publish events to a topic; every subscriber to that topic receives every event:

\`\`\`text
Order service -> topic "orders.placed"
                    |-> Notification service (send SMS)
                    |-> Analytics service (record the sale)
                    |-> Inventory service (reduce stock)
                    |-> Fraud service (check the pattern)
\`\`\`

The order service does not know how many subscribers exist. Adding fraud detection later means adding a subscriber, with no change to the order service. This is the loose coupling that lets systems grow.

### Events versus commands

| Type | Meaning | Example |
|---|---|---|
| Command | "Do this", sent to one handler | \`SendConfirmationEmail\` |
| Event | "This happened", published for anyone interested | \`OrderPlaced\` |

Events describe facts in the past tense. Publishers state what happened; subscribers decide what to do about it. Designing around events rather than commands keeps producers ignorant of consumers, which is the point.

### Event streaming with a log

Platforms such as Apache Kafka store events in an append-only log, partitioned for scale, and keep them for a configured time, from hours to forever:

\`\`\`text
Topic "orders.placed", partition 0:
  offset 0: order 8801
  offset 1: order 8805
  offset 2: order 8811
  ...
\`\`\`

Consumers read from the log at their own pace, tracking their offset. Properties that follow:

- **Replay**: a new analytics service can start from offset 0 and process all history.
- **Multiple independent consumers**: each consumer group keeps its own offset.
- **Ordering within a partition**: events with the same key (such as an order ID) go to the same partition and are read in order.
- **High throughput**: sequential disk writes handle millions of events per second across a cluster.

### Partitions and keys

Choosing the partition key decides ordering and parallelism. Keying by \`order_id\` keeps each order's events in order while spreading orders across partitions. Keying by something with few values, such as city, creates hot partitions where one city's traffic overwhelms a single partition, the same problem chapter 7 discusses for database sharding.

### Event-driven architecture

Systems built around events gain flexibility: new capabilities subscribe to existing events, services evolve independently, and the event log doubles as an audit trail. The costs are real: eventual consistency (the inventory count updates a moment after the order), harder debugging across many asynchronous hops, and the need for good tracing and schema management.

### Schema and versioning of events

Events are contracts between teams. Define schemas, version them, and evolve them compatibly: add optional fields, never remove or repurpose existing ones without a new version. A schema registry helps enforce this. A broken event schema can silently break every subscriber at once.

### Choosing between a queue and a stream

\`\`\`text
Work to be done once by one worker          -> queue
Facts many services react to                -> pub-sub topic
High volume, need replay or long retention  -> event streaming log
\`\`\`

Many systems use both: a streaming platform for domain events and simple queues for task processing. The right choice follows from who needs the message, how many times, and for how long.
      `,
        [
          q('How does publish-subscribe differ from a point-to-point queue?', [
            'Every subscriber receives each event, not just one consumer',
            'Messages are never stored',
            'Only one subscriber is allowed per topic',
            'Producers must know every subscriber',
          ], 0, 'Pub-sub broadcasts events to all subscribers of a topic.'),
          q('What does an event log\'s replay capability enable?', [
            'Faster deletion of old messages',
            'Sending messages to the producer',
            'New consumers can process the full history from the beginning',
            'Automatic schema changes',
          ], 2, 'Retained, offset-based logs let consumers start from any point, including the start.'),
          q('Why is keying a partitioned stream by city risky?', [
            'Cities cannot be used as strings',
            'It destroys ordering within a city',
            'A few values with heavy traffic create hot partitions',
            'Partitions require numeric keys',
          ], 2, 'Low-cardinality keys concentrate traffic on a few partitions, limiting parallelism.'),
        ]
      ),
      lesson('Delivery Guarantees and Idempotent Consumers', 14, `
Messaging systems make promises about delivery, and the promises have consequences. Understanding exactly what "at least once" means, and why "exactly once" is so hard, leads to the single most important consumer design rule: make processing idempotent.

### The three guarantees

| Guarantee | Meaning | Risk |
|---|---|---|
| At most once | A message is delivered zero or one times | Messages can be lost |
| At least once | A message is delivered one or more times | Duplicates are possible |
| Exactly once | Delivered and processed precisely once | Very hard to achieve end to end; expensive |

### Why duplicates happen

Consider the acknowledgement flow:

\`\`\`text
1. Broker delivers message M to consumer.
2. Consumer processes M (sends the SMS).
3. Consumer crashes before acknowledging.
4. Broker redelivers M to another consumer.
5. The SMS is sent again.
\`\`\`

The broker did the right thing: it could not know step 2 completed. At-least-once delivery, the default for most reliable systems, guarantees duplicates will occasionally occur. Networks, retries and crashes make this unavoidable.

### Why exactly-once is hard

For true exactly-once, the message consumption and its effect (sending an SMS, updating a row, calling an API) would have to be committed atomically. Within a single system, such as a database transaction that both records the offset and applies the change, this is achievable. Across systems, such as a queue and a third-party SMS provider, it generally is not. Frameworks that advertise exactly-once usually mean exactly-once processing within their own boundaries, plus idempotency on the outside.

### Idempotent consumers

The practical answer is to make processing safe to repeat:

\`\`\`text
process(message):
  if already_processed(message.id):
      acknowledge and return
  do the work
  record message.id as processed
  acknowledge
\`\`\`

The record of processed IDs is kept in a store such as the database or Redis, with a retention window. A duplicate delivery is recognised and skipped.

### Making effects idempotent

| Effect | Idempotent approach |
|---|---|
| Insert a row | Use the message or order ID as a unique key; a duplicate insert fails harmlessly |
| Update a balance | Store the last applied message ID with the balance; skip if already applied |
| Send an email or SMS | Check a "sent" record keyed by message ID before sending |
| Call an external API | Pass an idempotency key the provider honours (chapter 2) |
| Increment a counter | Prefer setting an absolute value or recording each event by ID |

A naive "add 100 to balance" repeated twice adds 200. Designing the effect around the message identity, not the operation, avoids this.

### Atomicity within the consumer

Where possible, apply the change and record the processed ID in the same database transaction. Then either both happen or neither, and a crash between them cannot produce a half-processed message.

### The outbox pattern

Producers face a mirror problem: saving an order to the database and publishing an event are two operations; a crash between them loses the event. The transactional outbox solves it:

\`\`\`text
1. In one transaction: save the order AND insert an "OrderPlaced" row
   into an outbox table.
2. A separate process reads the outbox and publishes each row to the broker,
   marking it as sent.
\`\`\`

Publishing becomes at-least-once, and downstream idempotent consumers handle the occasional duplicate. This pattern is how reliable event publishing is done in practice.

### Summary rule

Assume every message may arrive more than once, possibly out of order, and design consumers so that this is harmless. Systems built on this assumption are robust; systems that assume perfect delivery break in ways that are hard to reproduce.
      `,
        [
          q('Under at-least-once delivery, what must consumers expect?', [
            'Messages will sometimes be lost',
            'Some messages will arrive more than once',
            'Messages arrive in strict global order',
            'Each message is processed exactly once automatically',
          ], 1, 'At-least-once guarantees no loss at the cost of occasional duplicates.'),
          q('How does a consumer safely handle a duplicate "send SMS" message?', [
            'Sends the SMS again to be safe',
            'Deletes the queue',
            'Checks a record of sent message IDs and skips if already sent',
            'Waits an hour before processing',
          ], 2, 'Recording processed IDs lets duplicates be recognised and ignored.'),
          q('What problem does the transactional outbox pattern solve?', [
            'Consumers receiving messages out of order',
            'Queues running out of disk',
            'Losing an event when a crash occurs between saving data and publishing',
            'Messages being too large',
          ], 2, 'Writing the event in the same transaction as the data guarantees it will eventually be published.'),
        ]
      ),
      lesson('Background Jobs and Scheduling', 12, `
Not all work happens in response to a request. Reports run nightly, reminders go out at set times, stale data is cleaned up weekly, and long tasks such as video processing run in the background. Background jobs and schedulers handle this work, and running them reliably has its own set of concerns.

### Kinds of background work

| Kind | Example | Trigger |
|---|---|---|
| Deferred task | Resize an uploaded image | A request enqueues it |
| Scheduled job | Send daily sales summary at 8 a.m. | Time-based schedule |
| Recurring maintenance | Delete expired sessions every hour | Time-based schedule |
| Long-running process | Generate a large export | A request starts it; the user is notified when done |
| Retry of failed work | Re-attempt a failed payment webhook | Backoff timer |

### Workers

Background work runs in worker processes separate from the web servers, consuming from queues as chapter 6 described. Separation matters: heavy jobs on web servers steal CPU and memory from user requests. Workers scale independently, often on queue depth, and can use different instance types suited to their work.

### Scheduling

A scheduler triggers jobs at set times, using cron-style expressions:

\`\`\`text
0 8 * * *     every day at 08:00
*/15 * * * *  every 15 minutes
0 2 * * 1     Mondays at 02:00
\`\`\`

Two practical rules:

- **Time zones**: schedule in an explicit zone. A "8 a.m. report" configured on a UTC server arrives at 1 p.m. in Pakistan.
- **Single execution**: with several scheduler instances for availability, only one should fire each job. Use a distributed lock or a scheduler designed for clusters; otherwise every instance runs the job and customers receive three copies of the report.

### Long-running tasks and progress

For work that takes minutes, the user should not hold an open request. A common pattern:

\`\`\`text
1. POST /exports          -> returns 202 Accepted with a job ID
2. Worker processes the export, updating status in the database
3. GET /exports/{id}      -> status: running, 40% complete
4. On completion, notify the user (email, push, in-app) with a download link
\`\`\`

Status tracking, progress reporting and notifications turn a long task into a good experience rather than a frozen screen.

### Retries with backoff

Failed jobs should retry, but not immediately and not forever:

\`\`\`text
attempt 1: fail -> wait 10 s
attempt 2: fail -> wait 60 s
attempt 3: fail -> wait 5 min
attempt 4: fail -> dead-letter and alert
\`\`\`

Exponential backoff with jitter avoids hammering a struggling dependency and spreads retries so they do not all fire at once. After the final attempt, the job goes to a dead-letter queue and someone is alerted.

### Idempotent jobs

Jobs run more than once: retries, scheduler restarts, an operator re-running a batch. Every job should be safe to repeat, following the previous lesson. A nightly report that appends rows should check whether today's rows already exist; a cleanup job should be harmless if run twice.

### Observability for background work

Background failures are silent by nature; no user sees an error page. Track for each job type: run count, success and failure counts, duration, and time since the last successful run. Alert when a scheduled job has not succeeded within its expected window. A report that quietly stopped running three weeks ago is a common and embarrassing discovery.

### Priorities and isolation

Mixing urgent jobs (password reset emails) with heavy batch jobs (monthly statements) on one queue means urgent work waits behind the batch. Use separate queues, or priorities, and separate worker pools so heavy processing never delays what users are waiting for.
      `,
        [
          q('Why run background jobs in separate worker processes?', [
            'Heavy jobs would otherwise steal resources from user requests',
            'Web servers cannot run code',
            'Workers are free to operate',
            'Queues only connect to workers',
          ], 0, 'Separating workers keeps request handling responsive and lets each tier scale independently.'),
          q('What happens if several scheduler instances all fire the same job?', [
            'The job runs faster',
            'Only the first instance\'s run counts',
            'The job runs multiple times, such as sending duplicate reports',
            'The scheduler crashes',
          ], 2, 'Without a lock or cluster-aware scheduler, every instance executes the job.'),
          q('How should a long export be handled for the user?', [
            'Hold the HTTP request open until it finishes',
            'Return a job ID immediately and let the user check status or be notified',
            'Run it on the web server\'s main thread',
            'Refuse exports over one minute',
          ], 1, 'Accepting the job and reporting progress avoids frozen screens and timeouts.'),
        ]
      ),
      ],
      [
      q('What does a message queue provide when a consumer is temporarily down?', [
        'It rejects new messages',
        'Messages wait until the consumer returns',
        'Messages are sent to the producer',
        'Messages are deleted after one second',
      ], 1, 'Queues buffer work, so producers keep working and consumers catch up later.'),
      q('Which is an event rather than a command?', [
        'SendConfirmationEmail',
        'ResizeImage',
        'OrderPlaced',
        'ChargeCard',
      ], 2, 'Events state facts that happened; commands instruct a specific action.'),
      q('Why is exactly-once delivery across a queue and a third-party API impractical?', [
        'Third-party APIs never accept messages',
        'Queues cannot store acknowledgements',
        'Consuming and the external effect cannot be committed atomically together',
        'It requires more disk space',
      ], 2, 'Without a shared transaction across systems, duplicates or losses remain possible, so idempotency is used instead.'),
      q('A nightly job silently stopped running two weeks ago. Which practice would have caught it?', [
        'Longer retry delays between failed attempts',
        'Larger message payloads for each job',
        'Running the jobs on the web servers instead',
        'Alerting when a job misses its expected window',
      ], 3, 'Monitoring time since the last successful run reveals silent failures.'),
      ]
    ),
    chapter(
      'Scaling the Database',
      'Scale reads with replication and read replicas while handling lag, split data with partitioning and sharding when a single node is not enough, choose shard keys that spread load evenly, and deal with hot partitions and rebalancing.',
      [
      lesson('Replication and Read Replicas', 13, `
A single database server is a single point of failure and a ceiling on read capacity. Replication copies data to additional servers, which can serve reads and take over if the primary fails. It is usually the first database scaling step after vertical scaling and caching.

### Primary and replicas

\`\`\`text
Writes -> Primary -> replication stream -> Replica 1 (reads)
                                        -> Replica 2 (reads)
\`\`\`

All writes go to one primary. Replicas receive the primary's changes and apply them. Applications send read queries to replicas, spreading read load across several machines while the primary handles writes.

### Why it helps

| Benefit | Explanation |
|---|---|
| Read scaling | Many replicas serve many more reads than one server |
| Availability | A replica can be promoted if the primary fails |
| Isolation | Heavy reports run on a replica without slowing the primary |
| Geography | Replicas near users reduce read latency |

For read-heavy workloads, which most consumer applications are, replicas combined with caching remove the majority of load from the primary.

### Synchronous versus asynchronous replication

| Mode | Behaviour | Trade-off |
|---|---|---|
| Asynchronous | The primary commits and responds; replicas catch up shortly after | Fast writes; replicas lag; a failure can lose the last moments of writes |
| Synchronous | The primary waits for a replica to confirm before responding | No lost writes on failover; slower writes; a slow replica slows everything |
| Semi-synchronous | At least one replica confirms; others are asynchronous | A common middle ground |

### Replication lag

With asynchronous replication, a replica is always slightly behind, typically milliseconds, occasionally seconds under load. This creates a classic bug:

\`\`\`text
1. Sana updates her delivery address (write to primary).
2. The app immediately reads her profile from a replica.
3. The replica has not applied the change yet.
4. Sana sees her old address and thinks the update failed.
\`\`\`

Remedies:

- **Read your own writes**: after a write, read from the primary for that user for a short period, or route that session to the primary.
- **Monotonic reads**: keep a user on the same replica so they never see time go backwards.
- **Lag-aware routing**: monitor replica lag and stop sending reads to replicas that fall too far behind.
- **Accept it** where staleness is harmless, such as a public listing.

Which reads can tolerate lag is a design decision to make explicitly per query type.

### Failover

When the primary fails, a replica must be promoted. Managed databases and tools such as Patroni automate this: detect the failure, choose the most up-to-date replica, promote it, and redirect clients. Failover takes seconds to a minute, and with asynchronous replication, writes not yet replicated are lost. Applications should retry writes that fail during the switch.

### Multi-primary replication

Some systems accept writes on several primaries, for example one per region. This improves write latency for distributed users but introduces write conflicts: two regions update the same row differently at the same time. Conflict resolution rules or conflict-free data types are needed, and the complexity is significant. Most applications keep a single primary per dataset.

### Replicas are not backups

A replica faithfully copies everything, including a mistaken \`DELETE\` of the orders table. Backups, taken regularly and tested by restoring them, protect against human error and corruption; replicas protect against hardware failure and provide read capacity. Both are needed.

### When replication is not enough

Replication scales reads. Writes still all go to one primary, and when that primary's write capacity or storage is exhausted, the next step is partitioning, the subject of the following lessons.
      `,
        [
          q('What do read replicas scale?', [
            'Write throughput on the primary',
            'Disk space on the primary',
            'The number of tables allowed',
            'Read capacity across several servers',
          ], 3, 'Replicas serve read queries, spreading read load while writes stay on the primary.'),
          q('A user updates their address and immediately sees the old one. What is the likely cause?', [
            'The write failed silently',
            'The read came from a replica that had not applied the write yet',
            'The cache was warmed incorrectly',
            'The primary rejected the read',
          ], 1, 'Replication lag means replicas briefly hold older data than the primary.'),
          q('Why are replicas not a substitute for backups?', [
            'Replicas cannot store all tables',
            'Backups are faster to read from',
            'Replicas copy mistakes such as accidental deletes',
            'Replicas are always out of date',
          ], 2, 'Replication faithfully propagates errors, so restorable backups are still required.'),
        ]
      ),
      lesson('Partitioning and Sharding', 13, `
When a single primary can no longer handle the write load or hold all the data, the data itself must be split across multiple machines. This is sharding, the most powerful and most complex database scaling technique. Understanding when it is needed, and what it costs, prevents both premature sharding and painful late migrations.

### Partitioning versus sharding

| Term | Meaning |
|---|---|
| Partitioning | Splitting a table into pieces, possibly on the same server, for manageability and performance |
| Sharding | Splitting data across separate database servers, each holding a subset |

Partitioning within one server, for example splitting orders by month, keeps indexes small and makes dropping old data cheap. Sharding across servers is what adds write capacity and storage beyond one machine.

### How sharding works

\`\`\`text
Shard 0: customers with IDs hashing to 0   (server A)
Shard 1: customers with IDs hashing to 1   (server B)
Shard 2: customers with IDs hashing to 2   (server C)

Request for customer 42 -> hash(42) mod 3 = 0 -> server A
\`\`\`

Each shard is an independent database with its own primary and replicas. The application, or a routing layer, sends each query to the right shard based on the shard key.

### Sharding strategies

| Strategy | How | Strengths | Weaknesses |
|---|---|---|---|
| Hash-based | Hash the key, assign by result | Even distribution | Range queries across shards are hard |
| Range-based | Key ranges per shard (A to F, G to M) | Range queries efficient | Uneven load; hot ranges |
| Directory-based | A lookup table maps keys to shards | Flexible; easy to move data | The directory is a critical dependency |
| Geographic | Shard by region or country | Data locality and compliance | Uneven sizes; cross-region queries |

### What sharding breaks

Sharding is powerful because it removes the single-server limit, and painful because it removes things a single database provided for free:

- **Cross-shard joins**: joining customers on shard A with orders on shard B requires application-level assembly.
- **Cross-shard transactions**: updating rows on two shards atomically needs distributed transactions or sagas (chapter 8).
- **Global uniqueness**: auto-increment IDs are per shard; globally unique IDs need a different scheme, such as UUIDs or ID generators.
- **Global queries**: "the ten most recent orders across all customers" means querying every shard and merging.
- **Operations**: many databases to back up, monitor, upgrade and rebalance.

### When to shard

Shard when measurements show a single primary, after vertical scaling, caching and replication, will hit limits within the planning horizon. Signs include write throughput near the server's ceiling, data size approaching what one machine can hold or back up in reasonable time, and single-table growth making maintenance impractical.

Sharding too early adds all the complexity for none of the benefit. Sharding too late means migrating under pressure. The middle path is to design the data model with a likely shard key in mind, so that sharding later is possible without rewriting the application.

### Alternatives and helpers

- **Distributed SQL databases** (such as CockroachDB, YugabyteDB, TiDB, Spanner) shard automatically behind a SQL interface, trading some latency and cost for simplicity.
- **Managed NoSQL stores** (such as DynamoDB, Cassandra) are built around partitioning from the start.
- **Proxy layers** (such as Vitess for MySQL, Citus for PostgreSQL) add sharding to familiar databases.

These reduce, but do not remove, the need to think about shard keys and cross-shard operations.

### Splitting by service first

Before sharding one huge database, consider splitting it by domain: orders in one database, catalogue in another, users in a third. This functional split often buys years of headroom with far less complexity than sharding a single table, and it aligns with service boundaries.
      `,
        [
          q('What does sharding add that replication does not?', [
            'Faster reads of the same data',
            'Write capacity and storage beyond a single primary',
            'Automatic backups',
            'Stronger consistency',
          ], 1, 'Sharding splits writes and data across servers, while replication copies data for reads and failover.'),
          q('Which operation becomes hard after sharding?', [
            'Reading a customer by their ID',
            'Writing an order to its shard',
            'Joining data that lives on different shards',
            'Caching a menu',
          ], 2, 'Cross-shard joins and transactions lose the guarantees a single database provides.'),
          q('What is a lower-complexity step to try before sharding one large database?', [
            'Splitting the database by domain, such as orders and catalogue',
            'Removing all indexes from the largest tables',
            'Turning off replication to reduce load',
            'Storing everything in a cache instead of a database',
          ], 0, 'A functional split along service boundaries often provides years of headroom.'),
        ]
      ),
      lesson('Choosing a Shard Key', 13, `
The shard key decides which shard holds each row, and therefore how evenly data and load spread, which queries stay on one shard and which must touch many. It is the most consequential decision in a sharded design, and changing it later means moving all the data.

### Properties of a good shard key

| Property | Why it matters |
|---|---|
| High cardinality | Many distinct values, so data spreads across many shards |
| Even distribution | No value or small set of values dominates |
| Matches access patterns | The most common queries include the key, so they hit one shard |
| Stable | The value rarely changes, since changing it moves the row |

### Candidates for a food delivery system

\`\`\`text
Key option        Cardinality   Distribution     Query fit
customer_id       very high     even             customer's orders: one shard
restaurant_id     high          uneven (popular  restaurant dashboard: one shard
                                restaurants)
city              very low      very uneven      almost everything crosses shards
order_id          very high     even             single-order lookup only;
                                                 customer history crosses shards
\`\`\`

\`customer_id\` fits well: high cardinality, even spread, and a customer's history stays on one shard. \`restaurant_id\` risks hot shards for popular restaurants. \`city\` is the classic mistake: Karachi alone would overwhelm its shard.

### Query patterns decide

List the queries and check each against the candidate key:

| Query | Sharded by customer_id |
|---|---|
| Get order by ID | Needs customer_id too, or a lookup; include it in the order reference |
| Customer's order history | One shard |
| Restaurant's orders today | All shards, merged |
| Global daily revenue | All shards, aggregated |

The restaurant dashboard becomes a scatter-gather query across every shard. If it is frequent and latency-sensitive, options include a second copy of the data sharded by restaurant, or an analytics store fed by events. Designs often maintain more than one data layout to serve different patterns, accepting the cost of keeping them in sync.

### Compound and hashed keys

Hashing the key spreads sequential values evenly: customer IDs assigned in order would otherwise place all new customers on the last range shard. Compound keys, such as \`(tenant_id, customer_id)\`, keep a tenant's data together while spreading tenants, which suits multi-tenant software.

### Generating IDs across shards

With many shards, auto-increment columns produce duplicates. Common approaches:

- **UUIDs**: unique without coordination; larger and not sorted, which affects index performance. Time-ordered variants such as UUIDv7 help.
- **ID generation services**: a central or distributed service hands out unique, roughly time-ordered IDs (the Snowflake approach).
- **Embedding the shard**: IDs that include the shard number, so routing needs no lookup.

### Avoid mid-life key changes

Changing the shard key after launch means resharding every row, with dual writes and careful cutover. Choose carefully, test with realistic data distributions and think ahead about growth: a key that is even today may become skewed as the business changes, such as a few enterprise customers growing far larger than the rest.

### Directory-based flexibility

Where access patterns are uncertain, a directory that maps keys to shards allows moving specific keys later, such as relocating one enormous tenant to its own shard. The directory itself must be highly available and cached, since every request consults it.
      `,
        [
          q('Why is city a poor shard key for a Pakistan-wide delivery service?', [
            'City names cannot be hashed',
            'A few cities hold most traffic, creating badly uneven shards',
            'Cities change too often',
            'It has too many distinct values',
          ], 1, 'Low cardinality and skewed distribution concentrate load on a handful of shards.'),
          q('Data is sharded by customer_id. How does a restaurant\'s daily order list get served?', [
            'From a single shard chosen at random',
            'It cannot be served at all',
            'By querying all shards and merging, or from a separate layout keyed by restaurant',
            'From the customer with the most orders',
          ], 2, 'Queries not aligned with the shard key scatter across shards or need an alternative data layout.'),
          q('Why do auto-increment IDs fail across shards?', [
            'Each shard generates its own sequence, so IDs collide',
            'Shards cannot store integer columns',
            'IDs become too large to fit in a column',
            'Auto-increment columns require UUIDs',
          ], 0, 'Independent sequences on each shard produce duplicate values, so global ID schemes are needed.'),
        ]
      ),
      lesson('Handling Hot Partitions and Rebalancing', 13, `
Even a well-chosen shard key meets reality: a celebrity's account, a viral product, a single enterprise tenant that dwarfs the others. One partition receives far more traffic than the rest and becomes the bottleneck while other shards sit idle. Hot partitions, and the related need to rebalance as data grows, are ongoing concerns in any sharded system.

### Recognising a hot partition

| Symptom | Likely meaning |
|---|---|
| One shard's CPU or latency far above the others | Uneven load |
| Timeouts for specific keys while others are fine | A hot key |
| Throughput plateaus while most shards are idle | The hot shard limits the whole system |

Per-shard and per-key metrics are essential; averages across shards hide the problem entirely.

### Remedies for hot keys

- **Split the key**: append a random suffix so one logical key spreads across several partitions, and merge on read. Suits counters and append-heavy data such as a viral post's likes.
- **Cache in front**: a hot key that is read-heavy belongs in a cache, possibly replicated across several cache nodes, so the shard sees a fraction of the reads.
- **Dedicated shard**: move an oversized tenant or account to its own shard through a directory mapping.
- **Rate limit**: protect the shard from abusive or runaway traffic to one key.
- **Redesign the model**: if a "global" row is hot, such as a single settings record everyone updates, the model itself needs changing.

### Time-based hot spots

Keys that include time, such as sharding logs by hour, put all current writes on one shard: whichever holds "now". Hash the key or combine time with another dimension so current writes spread out.

### Rebalancing as data grows

Adding a shard means moving data. With naive \`hash mod N\`, changing N from 3 to 4 remaps almost every key, requiring a near-total data move. Better approaches:

| Approach | How it works |
|---|---|
| Consistent hashing | Keys and shards map onto a ring; adding a shard moves only the keys nearest it |
| Fixed virtual partitions | Create many small partitions (say 1,024) up front, assign several to each shard; adding a shard moves whole partitions, not individual keys |
| Directory | Move any partition to any shard by updating the mapping |

Virtual partitions are widely used: the number of partitions stays fixed for the system's life, and only their assignment to physical shards changes.

### Performing a live migration

Moving data while the system runs requires care:

\`\`\`text
1. Start dual-writing: writes go to both old and new locations.
2. Copy existing data from old to new in the background.
3. Verify counts and checksums match.
4. Switch reads to the new location.
5. Stop writing to the old location; clean up later.
\`\`\`

Each step is reversible until the last, so problems can be backed out. Automate and rehearse the process in staging before running it in production.

### Monitoring and headroom

Track data size and load per shard, project growth, and rebalance before any shard approaches its limits. Reactive rebalancing under load is stressful and risky; scheduled rebalancing during quiet hours is routine.

### Managed systems

Distributed databases and managed NoSQL services handle splitting and rebalancing automatically, and some detect hot partitions and split them adaptively. They still cannot fix a hot key that concentrates traffic on one item; that remains a modelling decision for the application.
      `,
        [
          q('Why do averages across shards hide hot partitions?', [
            'One overloaded shard is masked by many idle ones',
            'Averages cannot be calculated for databases',
            'Hot partitions have no metrics',
            'Shards do not report CPU',
          ], 0, 'Aggregate metrics smooth out the single shard that is struggling, so per-shard views are needed.'),
          q('What is the problem with hash mod N when adding a shard?', [
            'Hashing becomes impossible with four shards',
            'New shards cannot receive any writes',
            'Old shards are deleted during the change',
            'Almost every key remaps, forcing a huge data move',
          ], 3, 'Changing N remaps nearly all keys, unlike consistent hashing or virtual partitions.'),
          q('In a live migration, why start with dual writes?', [
            'To double the system\'s write throughput',
            'Because reads must be stopped first',
            'So the new location stays current during the copy',
            'To delete the old data more quickly',
          ], 2, 'Dual writes keep both locations consistent during the copy, allowing a safe, reversible cutover.'),
        ]
      ),
      ],
      [
      q('Which replication mode risks losing the latest writes on failover?', [
        'Synchronous',
        'Asynchronous',
        'Semi-synchronous with one confirmation',
        'All modes equally',
      ], 1, 'Asynchronous replication responds before replicas confirm, so unreplicated writes can be lost.'),
      q('What is "read your own writes"?', [
        'Reading from a random replica on every request',
        'Ensuring a user sees their own recent updates',
        'Caching every write before it reaches the primary',
        'Preventing users from reading their own data',
      ], 1, 'It avoids the confusion of a user not seeing a change they just made.'),
      q('What is a fixed virtual partition scheme?', [
        'One partition per physical server, resized on demand',
        'Partitions stored only in memory',
        'A scheme with no partitions at all',
        'Many small partitions assigned to shards, moved whole when rebalancing',
      ], 3, 'Fixing the partition count and moving assignments keeps rebalancing cheap and predictable.'),
      q('When should a team shard its database?', [
        'When measurements show a single primary will hit limits after other options',
        'On day one of every project, before any traffic arrives',
        'Never, because sharding is always too complex to justify',
        'Whenever the database grows to more than one table',
      ], 0, 'Sharding is justified by measured limits after vertical scaling, caching and replication.'),
      ]
    ),
    chapter(
      'Consistency and Coordination',
      'Understand what CAP and PACELC really say about distributed trade-offs, choose consistency models that match business needs, coordinate work across services with sagas instead of distributed transactions, and see how consensus and leader election keep systems coordinated.',
      [
      lesson('The CAP and PACELC Theorems', 13, `
Once data lives on more than one machine, a hard question appears: when machines cannot talk to each other, should the system keep answering with possibly stale data, or refuse to answer until it is sure? The CAP theorem states this trade-off precisely, and PACELC extends it to normal operation. Both are frequently misquoted, so it is worth understanding exactly what they claim.

### The three properties

| Property | Meaning |
|---|---|
| Consistency | Every read returns the most recent write, or an error |
| Availability | Every request receives a non-error response, even if not the latest data |
| Partition tolerance | The system keeps operating when network messages between nodes are lost or delayed |

### What CAP actually says

Network partitions happen: cables fail, switches misbehave, a data centre loses connectivity. A distributed system cannot opt out of partitions, so partition tolerance is not a choice. The theorem's real content is: **during a partition, you must choose between consistency and availability.**

\`\`\`text
Partition occurs: node A cannot reach node B.
A client writes to A. Another client reads from B.

Choose consistency (CP): B refuses the read, or A refuses the write,
                          until the partition heals. Correct, but unavailable.
Choose availability (AP): B answers with its last known value.
                          Available, but possibly stale.
\`\`\`

Systems are described as CP or AP based on this choice. "CA" is only meaningful for a single node, where partitions cannot occur between nodes.

### Examples

| Choice | Typical systems | Suits |
|---|---|---|
| CP | Coordination services (ZooKeeper, etcd), many relational setups with synchronous replication | Configuration, locks, money, inventory |
| AP | Many NoSQL stores with tunable consistency (Cassandra, DynamoDB in eventual mode), DNS | Feeds, caches, catalogues, analytics |

The same system can often be tuned: many databases let you choose per operation how many replicas must agree.

### PACELC: the rest of the time

Partitions are rare. Most of the time the network works, and CAP says nothing about that. PACELC adds the missing half:

\`\`\`text
If there is a Partition, choose Availability or Consistency;
Else, choose Latency or Consistency.
\`\`\`

Even with a healthy network, strong consistency costs latency: a write must reach several replicas before it is confirmed, and reads may need to check with a quorum. Systems that favour low latency return faster answers that might be slightly stale. This trade-off is present in every request, not only during outages, which makes PACELC the more practically useful framing.

### Reading a system's design through PACELC

| System style | Partition | Normal operation |
|---|---|---|
| PA/EL | Stay available | Favour low latency, accept staleness |
| PC/EC | Refuse rather than be wrong | Pay latency for consistency |
| PA/EC | Stay available in partitions | Consistent when healthy |

### Applying it

Ask, for each piece of data: if two users could briefly see different values, what is the worst outcome? A stale like count is harmless; a stale bank balance allows overdrafts; a stale seat count sells the same seat twice. The answer decides where each part of the system should sit on these trade-offs, and it is fine, indeed normal, for different parts of one system to choose differently.

### Common misreadings

- "Pick two of three" is misleading; partition tolerance is mandatory for distributed systems.
- "Consistency" in CAP is about reads seeing the latest write, not the C in ACID.
- Choosing AP does not mean data is wrong forever; it means it may be briefly stale and will converge.
      `,
        [
          q('What is the real choice the CAP theorem forces?', [
            'During a partition, consistency or availability',
            'Any two of the three properties at all times',
            'Whether to use a network at all',
            'Between SQL and NoSQL databases',
          ], 0, 'Partition tolerance is unavoidable, so the trade-off applies to behaviour during partitions.'),
          q('What does PACELC add to CAP?', [
            'A fourth property called durability',
            'A rule that partitions never happen',
            'The latency versus consistency trade-off during normal operation',
            'A requirement to use three replicas',
          ], 2, 'PACELC recognises that consistency costs latency even when the network is healthy.'),
          q('Which data most needs a CP approach?', [
            'A post\'s like count',
            'A cached restaurant menu',
            'A recommendation list',
            'Seat inventory for a booking system',
          ], 3, 'Selling the same seat twice is a serious error, so consistency outweighs availability there.'),
        ]
      ),
      lesson('Consistency Models in Practice', 13, `
"Consistent" is not one thing. Between strict correctness and anything-goes lies a spectrum of consistency models, each with a precise promise, a cost and a natural use. Choosing the weakest model that a use case can tolerate is how large systems stay fast and available without producing wrong results where it matters.

### The main models

| Model | Promise | Cost |
|---|---|---|
| Strong (linearizable) | Every read sees the latest completed write, as if there were one copy | Coordination on every operation; higher latency |
| Sequential | All nodes see operations in the same order, though not necessarily immediately | Less than strong, still coordinated |
| Causal | Operations that are causally related are seen in order by everyone | Tracks dependencies |
| Read-your-writes | A client always sees its own previous writes | Session routing or primary reads |
| Monotonic reads | A client never sees data go backwards in time | Sticky replica per session |
| Eventual | Replicas converge to the same value given no new writes | Cheapest; temporary staleness |

### Strong consistency

A user transfers money and immediately checks both balances; the totals must add up. Strong consistency makes the system behave like a single copy. It requires coordination, such as writing to a quorum of replicas and reading from a quorum, so operations take longer and cannot proceed during some failures. Use it where correctness at every instant matters: payments, inventory, unique usernames.

### Eventual consistency

Replicas accept updates and propagate them in the background; briefly, different replicas may return different values, but they converge. It is fast and highly available. Use it where brief staleness is harmless: social feeds, view counts, product recommendations, search indexes.

### Session guarantees

Between the extremes, session guarantees fix the most user-visible anomalies:

\`\`\`text
Sana edits her profile, then reloads the page.
Without read-your-writes: she may see the old profile from a lagging replica.
With read-your-writes:    her session reads from the primary or a caught-up replica.
\`\`\`

Causal consistency handles related actions: a reply must never appear before the comment it answers. These guarantees are often enough to make eventual consistency feel consistent to users, at far lower cost than strong consistency everywhere.

### Tunable consistency

Many distributed stores let each operation choose. With N replicas, a write confirmed by W replicas and a read consulting R replicas is strongly consistent when W + R > N:

\`\`\`text
N = 3 replicas
W = 2, R = 2  ->  2 + 2 > 3: reads always overlap the latest write
W = 1, R = 1  ->  fast, but a read may miss the latest write
\`\`\`

Applications can use strong settings for critical operations and relaxed ones for the rest, within the same database.

### Consistency in caches and search

Derived stores, caches, search indexes and analytics tables, are updated after the source of truth, so they are eventually consistent by nature. The gap is usually seconds. Design user flows around it: after creating a product, redirect the user to the product page served from the database, not to a search results page that may not index it yet.

### Choosing per operation

\`\`\`text
Operation                     Model
Place an order                Strong (stock and payment)
View order history            Read-your-writes
See restaurant ratings        Eventual
Post and view chat messages   Causal (replies after originals)
Update a public profile       Read-your-writes, eventual for others
\`\`\`

Writing this table for a system is a valuable exercise: it makes the trade-offs explicit and prevents both over-engineering (strong everywhere) and bugs (eventual where it is unacceptable).
      `,
        [
          q('What does eventual consistency guarantee?', [
            'Every read sees the latest write immediately',
            'Replicas converge to the same value once writes stop',
            'Reads never return stale data',
            'Writes are rejected during replication',
          ], 1, 'Eventual consistency promises convergence, not immediate agreement.'),
          q('With N = 3, which setting guarantees reads see the latest write?', [
            'W = 1, R = 1',
            'W = 1, R = 2',
            'W = 2, R = 2',
            'W = 0, R = 3',
          ], 2, 'W + R must exceed N so read and write sets always overlap; 2 + 2 is greater than 3.'),
          q('Which guarantee prevents a reply appearing before the comment it answers?', [
            'Eventual consistency',
            'Monotonic writes only',
            'Read-your-writes',
            'Causal consistency',
          ], 3, 'Causal consistency orders operations that depend on one another.'),
        ]
      ),
      lesson('Transactions Across Services and Sagas', 14, `
Within one database, a transaction makes several changes succeed or fail together. Once data is split across services, each with its own database, that guarantee disappears. Placing an order might touch the order service, the payment service and the inventory service. If payment succeeds and inventory fails, the customer is charged for nothing. Sagas are the standard way to coordinate such multi-step operations without a shared transaction.

### Why not distributed transactions?

Two-phase commit (2PC) makes several databases commit together: a coordinator asks each participant to prepare, then tells all to commit. It works, but:

- Participants hold locks while waiting for the coordinator, hurting throughput.
- If the coordinator fails mid-way, participants are stuck.
- Many databases, message brokers and third-party APIs do not support it.

Distributed transactions are used in some enterprise settings, but most modern service architectures avoid them.

### The saga pattern

A saga is a sequence of local transactions, each in one service, with a compensating action defined for each step. If a later step fails, earlier steps are undone by running their compensations:

\`\`\`text
Steps:                              Compensations:
1. Create order (pending)           Cancel order
2. Reserve inventory                Release reservation
3. Charge payment                   Refund payment
4. Confirm order                    (final step)

Failure at step 3 -> run compensation 2, then compensation 1.
Result: no reservation, order cancelled, customer not charged.
\`\`\`

Each step commits locally, so the system is briefly in an intermediate state, such as an order pending with inventory reserved. Sagas trade atomicity for availability and loose coupling, and they require designing for those intermediate states.

### Choreography versus orchestration

| Style | How it works | Strengths | Weaknesses |
|---|---|---|---|
| Choreography | Each service reacts to events and publishes its own; no central controller | Loose coupling, simple for short flows | The overall flow is invisible; hard to follow and change |
| Orchestration | A coordinator (the saga orchestrator) tells each service what to do and handles failures | Flow is explicit and testable; easier to add steps | The orchestrator is a central component to design and run |

For flows with more than a few steps, or that change often, orchestration is usually easier to maintain. Workflow engines such as Temporal and cloud step-function services implement durable orchestration with retries and state built in.

### Designing compensations

Compensation is not always a clean undo:

- An email cannot be unsent; send a correction instead.
- A refund is a new transaction, not an erasure of the charge.
- Some steps are pivot points: after them, the saga must complete forward rather than roll back.

Order steps so that the most likely failures happen before irreversible actions, and put the pivot as late as possible: reserve inventory before charging the card, and charge before shipping.

### Idempotency and retries

Saga steps and compensations run under at-least-once delivery, so each must be idempotent, following chapter 6. A "refund" that runs twice must not refund twice; keying every action by the saga and step ID prevents this.

### Handling intermediate states

Users and other services will observe orders in states like \`pending_payment\` or \`cancelling\`. Model these states explicitly, show them honestly in interfaces, and set timeouts: an order stuck pending for an hour should be resolved automatically, usually by compensation.

### When to avoid sagas

If a set of operations must truly be atomic and cannot tolerate intermediate states, the cleanest solution is often to keep that data in one service and one database, so a local transaction covers it. Service boundaries should be drawn to keep the most tightly coupled data together; sagas are for coordination across genuinely separate domains.
      `,
        [
          q('What is a compensating action in a saga?', [
            'A step that undoes the effect of an earlier completed step',
            'A retry of the failed step',
            'A database backup',
            'A lock held across all services',
          ], 0, 'Sagas cannot roll back like a transaction, so earlier steps are reversed by explicit compensations.'),
          q('Why should payment be charged after inventory is reserved rather than before?', [
            'Payment services are slower',
            'Inventory cannot be released',
            'Charging is harder to reverse, so it should happen after more likely failures',
            'Reservations require a charge first',
          ], 2, 'Ordering steps so reversible actions precede irreversible ones minimises painful compensations.'),
          q('What is a weakness of choreographed sagas?', [
            'They require a central coordinator',
            'They cannot publish events',
            'They only work with two services',
            'The overall flow is spread across services and hard to follow',
          ], 3, 'With no central view, understanding and changing a choreographed flow becomes difficult.'),
        ]
      ),
      lesson('Consensus and Leader Election', 12, `
Some decisions in a distributed system must be agreed by all nodes: which node is the primary database, who holds a lock, what the current configuration is. If two nodes both believe they are the leader, they both accept writes and the data diverges. Consensus algorithms let a group of nodes agree on a value despite failures, and they underpin the coordination services most systems rely on.

### The problem

\`\`\`text
Three nodes hold copies of a configuration.
Node A proposes a change; node B proposes a different one at the same time.
The network drops some messages.
Which change wins, and how do all nodes learn it?
\`\`\`

Consensus guarantees that all non-failed nodes agree on the same sequence of decisions, and that a decision, once made, is never reversed, as long as a majority of nodes are working and can communicate.

### Majorities and quorums

Consensus protocols work with a quorum, a majority of nodes:

\`\`\`text
3 nodes: quorum is 2, tolerates 1 failure
5 nodes: quorum is 3, tolerates 2 failures
7 nodes: quorum is 4, tolerates 3 failures
\`\`\`

Any two majorities overlap, so two conflicting decisions cannot both be accepted. This is why coordination clusters have odd sizes: four nodes tolerate only one failure, the same as three, at more cost.

### Raft and Paxos

Paxos was the original proven algorithm, famously hard to understand. Raft was designed to be understandable and is now widely implemented. Raft elects a leader; all changes go through the leader, which replicates them to followers and commits once a majority acknowledge. If the leader fails, followers time out and elect a new one. The mechanics are subtle, but the guarantees are what matter for design: a single agreed log of decisions and automatic leader failover.

### Where consensus lives

You rarely implement consensus yourself. You use systems that provide it:

| System | Used for |
|---|---|
| etcd | Kubernetes configuration and coordination |
| ZooKeeper | Coordination for Kafka (historically), HBase and others |
| Consul | Service discovery and configuration |
| Database replication managers | Choosing a new primary on failure |

These are CP systems: during a partition, the minority side stops accepting writes rather than risk disagreement.

### Leader election

Many components need exactly one active instance: a scheduler, a migration runner, a primary database. Leader election, built on a consensus store, grants leadership to one instance with a lease that must be renewed:

\`\`\`text
1. Instances try to create a lock key with a time-to-live.
2. The one that succeeds is leader and does the work.
3. It renews the lease periodically.
4. If it crashes, the lease expires and another instance takes over.
\`\`\`

### Fencing tokens

A subtle failure: the leader pauses (a long garbage collection, a network stall), its lease expires, a new leader is elected, and then the old leader resumes, believing it still leads. Both act at once. A fencing token, a number that increases with each new lease, solves this: every action carries the token, and the resource rejects actions with a token older than the latest it has seen.

### Distributed locks

Locks across services follow the same pattern, with the same caveats: leases with expiry, fencing tokens, and an understanding that a lock is a coordination aid, not an absolute guarantee. Where possible, design operations to be idempotent and safe under concurrency so that correctness does not depend on a lock alone.

### Design takeaways

- Use a proven coordination service rather than building consensus.
- Run coordination clusters with an odd number of nodes, usually three or five.
- Treat leadership and locks as leases that can expire, and protect critical actions with fencing tokens.
- Keep the amount of data in coordination systems small; they are for agreement, not bulk storage.
      `,
        [
          q('Why do coordination clusters use odd numbers of nodes?', [
            'Even numbers cannot run software',
            'A majority is required, and an even extra node adds cost without more fault tolerance',
            'Odd numbers are faster',
            'Consensus algorithms only count odd votes',
          ], 1, 'Four nodes tolerate one failure like three do, so the fourth adds nothing.'),
          q('What problem does a fencing token solve?', [
            'Lost network messages between nodes',
            'Choosing an odd cluster size',
            'A paused old leader resuming and acting alongside a new leader',
            'Encrypting lock keys',
          ], 2, 'Monotonic tokens let resources reject actions from a leader whose lease has expired.'),
          q('What happens to the minority side of a partition in a consensus system?', [
            'It stops accepting writes to avoid disagreement',
            'It elects its own independent leader and continues',
            'It deletes its data',
            'It merges conflicting writes later',
          ], 0, 'Without a majority, a CP coordination system refuses writes rather than risk divergence.'),
        ]
      ),
      ],
      [
      q('Which statement about CAP is correct?', [
        'Systems can avoid partitions by choosing CA',
        'Consistency in CAP means the same as ACID consistency',
        'During a partition, a system must choose between consistency and availability',
        'Availability means every read returns the latest write',
      ], 2, 'Partitions are unavoidable, so the theorem\'s choice applies during them.'),
      q('A user must always see their own recent edits. Which model addresses this at low cost?', [
        'Strong consistency for every read in the system',
        'Read-your-writes',
        'Eventual consistency without guarantees',
        'Monotonic writes',
      ], 1, 'Session-level read-your-writes fixes the most visible anomaly without global coordination.'),
      q('Why do many modern architectures avoid two-phase commit across services?', [
        'It is not available in any relational database',
        'It makes all data eventually consistent',
        'It holds locks and blocks when the coordinator fails',
        'It requires an odd number of participating services',
      ], 2, '2PC\'s blocking behaviour and limited support make sagas the usual alternative.'),
      q('What is a lease in leader election?', [
        'Time-limited leadership that must be renewed or it expires',
        'A permanent assignment of leadership',
        'A backup copy of the leader\'s data',
        'A network partition between leaders',
      ], 0, 'Leases allow automatic takeover when a leader fails or stalls.'),
      ]
    ),
    chapter(
      'Resilience and Reliability',
      'Design systems that expect failure, protect them with timeouts, retries and circuit breakers, control load with rate limiting and backpressure, and make operations safe to repeat with idempotency.',
      [
      lesson('Designing for Failure', 13, `
In a system with hundreds of servers, disks, network links and dependencies, something is always failing. A resilient system is not one where nothing fails; it is one where failures are expected, contained and recovered from without users noticing. Designing for failure means asking, for every component, "what happens when this breaks?" and having an answer.

### Failure is normal at scale

\`\`\`text
10,000 disks with a 2% annual failure rate -> about 200 failures a year,
                                               roughly one every two days
A dependency with 99.9% availability      -> down about 43 minutes a month
Ten such dependencies in one request path -> the combined availability
                                               is noticeably lower than any one
\`\`\`

Any design that assumes components are reliable will fail regularly. The question is how it fails.

### Kinds of failure

| Failure | Example |
|---|---|
| Crash | A server or process stops |
| Slow | A dependency responds, but after seconds instead of milliseconds |
| Partial | Some requests fail, others succeed |
| Network | Messages lost, delayed or duplicated |
| Overload | Too much traffic degrades everything |
| Bad deploy | A new version misbehaves |
| Human error | A wrong command deletes data |
| Regional | A whole data centre or region is unavailable |

Slow failures are often worse than crashes, because they consume resources while callers wait, and they spread. Chapter 9's second lesson deals with them directly.

### Redundancy

Remove single points of failure by having more than one of everything that matters:

- Multiple application instances behind a load balancer.
- Database replicas with automated failover.
- Multiple availability zones, so a data centre outage is survivable.
- Multiple regions for the most critical services, at significant cost.

Redundancy only helps if failover actually works. Test it: kill an instance, fail over the database, take a zone offline in staging. Untested failover is a hope, not a plan.

### Isolation and bulkheads

A ship's bulkheads stop one flooded compartment sinking the vessel. In software, isolation keeps one failure from spreading:

- Separate thread pools or connection pools per dependency, so a slow payment provider cannot exhaust the pool used for menus.
- Separate queues and worker pools for different job types.
- Separate services or clusters for critical and non-critical features.
- Per-tenant limits, so one customer's traffic cannot starve others.

### Graceful degradation

When a component fails, serve something rather than nothing:

\`\`\`text
Recommendations service down  -> show popular items instead
Search index unavailable      -> fall back to a simpler database query
Payment provider A failing    -> route to provider B
Image CDN slow                -> show placeholders, load later
\`\`\`

Decide in advance which features are essential and which can degrade. A food app that cannot take orders is down; one that cannot show personalised recommendations is fine.

### Fail fast and fail safe

A component that cannot do its job should say so quickly, so callers can fall back, rather than hanging. And safe defaults matter: if a feature-flag service is unreachable, features should default to a known safe state, not to random behaviour.

### Practising failure

Chaos engineering deliberately injects failures, killing instances, adding latency, cutting network links, in controlled experiments to confirm the system responds as designed. Start small in staging, then run carefully scoped experiments in production during business hours with the team watching. Discovering that failover does not work during a real outage at 3 a.m. is far more expensive.

### Blameless learning

Every failure is information. After incidents, write down what happened, why the safeguards did not catch it and what will change, without blaming individuals. Systems become resilient through this loop far more than through any single technique.
      `,
        [
          q('Why are slow failures often worse than crashes?', [
            'They hold resources while callers wait, and the slowness spreads',
            'They are easier to detect than crashes',
            'They never affect users',
            'Crashes cannot be retried',
          ], 0, 'A slow dependency ties up threads and connections, degrading everything that depends on it.'),
          q('What is a bulkhead in software design?', [
            'A backup of the database',
            'A larger server for critical services',
            'Isolation, such as separate pools, that stops one failure spreading',
            'A monitoring dashboard',
          ], 2, 'Bulkheads compartmentalise resources so a failing dependency cannot exhaust shared capacity.'),
          q('What does graceful degradation mean?', [
            'Shutting down the whole system when any part fails',
            'Ignoring all errors',
            'Reducing server counts at night',
            'Serving a reduced experience when a non-essential component fails',
          ], 3, 'Falling back to simpler behaviour keeps core functions working during partial failures.'),
        ]
      ),
      lesson('Timeouts, Retries and Circuit Breakers', 14, `
Every call to another service or database can fail or hang. Three simple mechanisms, applied consistently, prevent these failures from cascading through a system: timeouts bound how long you wait, retries recover from transient errors, and circuit breakers stop hammering a dependency that is down. Getting their details right matters as much as having them.

### Timeouts

A call without a timeout can wait forever, holding a thread and a connection. Under load, waiting calls pile up until the caller itself stops responding: one slow dependency has taken down its callers. Every outbound call needs a timeout.

\`\`\`text
Guidelines:
- Set timeouts based on the dependency's normal p99 latency plus margin,
  not on the maximum you can imagine.
- Separate connection timeouts (short) from read timeouts.
- Make the caller's timeout shorter than its own caller's, so the
  budget shrinks down the chain and nobody waits on a request that
  the user has already given up on.
\`\`\`

A 30-second default timeout is almost always wrong for a service call that normally takes 50 ms.

### Retries

Many failures are transient: a dropped packet, a brief overload, a node restarting. Retrying succeeds. But retries done carelessly cause harm:

- Retrying a non-idempotent operation may duplicate it (chapter 2 and the final lesson).
- Retrying immediately hammers a struggling dependency.
- Retries at every layer multiply: three layers each retrying three times means 27 attempts for one failure, a retry storm.

Safe retry rules:

| Rule | Reason |
|---|---|
| Retry only idempotent operations, or use idempotency keys | Avoid duplicates |
| Retry only on transient errors (timeouts, 503, connection reset) | A 400 will fail every time |
| Use exponential backoff with jitter | Spread retries and avoid synchronised waves |
| Limit the number of attempts | Bound total time and load |
| Retry at one layer, not every layer | Prevent multiplication |
| Set a retry budget | Cap retries as a share of requests, so a broken dependency does not double its load |

\`\`\`text
attempt 1: fail -> wait 100 ms + random jitter
attempt 2: fail -> wait 200 ms + jitter
attempt 3: fail -> wait 400 ms + jitter
attempt 4: give up, return an error or fallback
\`\`\`

### Circuit breakers

If a dependency is down, every call will fail after its timeout, wasting time and resources, and the flood of calls may prevent the dependency from recovering. A circuit breaker watches failures and, past a threshold, stops calls immediately:

\`\`\`text
CLOSED     calls pass through; failures are counted
OPEN       failure rate exceeded the threshold; calls fail fast without
           contacting the dependency, for a cooling period
HALF-OPEN  after the period, a few trial calls go through;
           success closes the circuit, failure reopens it
\`\`\`

Callers get an immediate error, or a fallback, instead of a slow timeout, and the dependency gets breathing room to recover. Breakers are configured per dependency, with thresholds based on failure rate over a window, not single failures.

### Combining them

\`\`\`text
call with timeout
  -> on transient failure, retry with backoff (limited)
     -> if the breaker is open, skip straight to the fallback
        -> fallback: cached value, default, or a clear error
\`\`\`

Libraries such as Resilience4j, Polly and service meshes provide these patterns with configuration rather than custom code.

### Fallbacks

What to return when all else fails depends on the operation: a cached or default value for reads, a queued retry for writes that can be delayed, or an honest error for actions that cannot be completed. A fallback that silently returns wrong data is worse than an error.

### Observe them

Track timeout rates, retry counts and breaker states per dependency. A breaker that opens frequently signals a dependency with problems; retry counts rising signal a storm in the making. These metrics often reveal trouble before users do.
      `,
        [
          q('Why should a caller\'s timeout be shorter than its own caller\'s?', [
            'Longer timeouts are not supported',
            'So nobody keeps working on a request the layer above has already abandoned',
            'Because inner services are always faster',
            'To increase the number of retries',
          ], 1, 'Shrinking budgets down the chain avoid wasted work on requests that have already timed out upstream.'),
          q('What is a retry storm?', [
            'Retries at multiple layers multiplying into many attempts per failure',
            'A dependency crashing during a storm',
            'Retrying successful requests',
            'Retries that use no backoff',
          ], 0, 'Layered retries compound, turning one failure into dozens of calls against a struggling dependency.'),
          q('What does an open circuit breaker do?', [
            'Sends every call to the dependency immediately',
            'Doubles the timeout',
            'Fails calls fast without contacting the dependency for a cooling period',
            'Restarts the dependency',
          ], 2, 'Open breakers protect callers and give the failing dependency time to recover.'),
        ]
      ),
      lesson('Rate Limiting and Backpressure', 13, `
A system has finite capacity. When demand exceeds it, the system must decide who gets served, rather than letting everyone suffer as queues grow and latency explodes. Rate limiting rejects excess requests at the edge; backpressure lets internal components signal that they cannot accept more. Both keep a system healthy under load instead of collapsing.

### Why limit at all?

Without limits, a traffic spike, a misbehaving client or an attack consumes all resources. Latency climbs for every user, timeouts fire, retries add more load, and the system enters a death spiral. Rejecting some requests quickly keeps the rest fast. It is better to serve 90% of users well than 100% of users badly.

### Rate limiting

Rate limits cap how many requests a client may make in a period:

\`\`\`text
Per API key:   1,000 requests per minute
Per user:      60 order attempts per hour
Per IP:        100 login attempts per 10 minutes
Global:        50,000 requests per second across the service
\`\`\`

Rejected requests receive HTTP 429 Too Many Requests, ideally with a header saying when to retry.

### Algorithms

| Algorithm | How it works | Character |
|---|---|---|
| Fixed window | Count requests per minute; reset at the boundary | Simple; allows bursts at window edges |
| Sliding window | Count over the last 60 seconds continuously | Smoother; slightly more state |
| Token bucket | Tokens refill at a steady rate; each request spends one; unused tokens accumulate to a cap | Allows short bursts, enforces an average |
| Leaky bucket | Requests drain at a fixed rate; excess overflows | Smooths output to a constant rate |

Token bucket is the most common choice for APIs: it tolerates natural burstiness while enforcing a long-term rate.

### Where limits live

Limits are typically enforced at the API gateway or load balancer, using a shared store such as Redis for counters so all instances see the same counts. Per-client limits protect against individual abuse; global limits protect the whole service from aggregate overload.

### Load shedding

When the system as a whole is near capacity, drop lower-priority work first:

\`\`\`text
Priority 1: place order, payment callbacks      always serve
Priority 2: browse menus, track order           serve if capacity allows
Priority 3: recommendations, analytics events   shed first
\`\`\`

Shedding must be fast and cheap; a rejected request should cost almost nothing. Health-aware shedding, based on queue length or latency rather than fixed request counts, adapts to actual conditions.

### Backpressure

Inside a system, a fast producer can overwhelm a slower consumer: a service writing to a queue faster than workers drain it, or a stream of events arriving faster than a database can absorb. Backpressure is the consumer's ability to say "slow down":

- Bounded queues: when full, producers block or receive an error instead of the queue growing without limit.
- Pull-based consumption: consumers request the next batch when ready, rather than being pushed.
- Flow control in protocols and reactive streams, where the receiver advertises how much it can accept.

Unbounded buffers hide overload until memory runs out; bounded buffers surface it early, where it can be handled.

### Protecting dependencies

Rate limits also protect the systems you call. A third-party payment API may allow 100 requests per second; exceeding it earns errors or a ban. Client-side limiting, queuing and smoothing keep you within their limits, and a concurrency limit per dependency stops a burst from opening thousands of connections.

### Communicate limits

Publish limits in API documentation, return clear 429 responses with retry-after information, and offer higher tiers where appropriate. Clients that understand the limits behave better, and honest errors are far easier to handle than mysterious slowness.
      `,
        [
          q('Why reject some requests under overload rather than serving everyone slowly?', [
            'Serving most users well beats serving all users badly and risking collapse',
            'Rejected requests are free to process',
            'Slow responses are illegal',
            'It reduces the number of servers needed',
          ], 0, 'Shedding excess load keeps latency healthy for the majority and prevents a death spiral.'),
          q('Which algorithm allows short bursts while enforcing an average rate?', [
            'Fixed window',
            'Leaky bucket',
            'Token bucket',
            'Round robin',
          ], 2, 'Accumulated tokens permit bursts, while the refill rate caps the long-term average.'),
          q('What is backpressure?', [
            'A load balancer sending traffic to the slowest server',
            'Retrying failed requests more aggressively',
            'Compressing responses',
            'A consumer signalling producers to slow down when it cannot keep up',
          ], 3, 'Bounded queues and pull-based flow let slow components control the rate of incoming work.'),
        ]
      ),
      lesson('Idempotency and Exactly-Once in Practice', 13, `
Retries are essential for resilience, and duplicates are the price. A network hiccup after a payment succeeds leads to a retry, and without protection, a second charge. Idempotency makes repeated operations harmless, and it is how real systems achieve the effect of exactly-once processing without the impossibility of exactly-once delivery.

### The core idea

An idempotent operation produces the same result whether performed once or many times. Reads are naturally idempotent. Writes must be designed to be:

| Operation | Naive (not idempotent) | Idempotent version |
|---|---|---|
| Add funds | balance += 100 | Apply transaction T-8821 if not already applied |
| Create order | Insert a new row | Insert with a client-supplied unique key; ignore if present |
| Send notification | Send | Send if no record of message ID M exists |
| Set status | Toggle status | Set status to "shipped" (already absolute) |

Operations expressed as "set to this value" or "apply this identified change" are idempotent; "increment" and "append" are not, unless tied to an identity.

### Idempotency keys for APIs

Clients generate a unique key per logical operation and send it with the request:

\`\`\`text
POST /orders
Idempotency-Key: 7c2f-...-91ab

Server:
  1. Look up the key.
  2. If found with a stored response, return that response.
  3. If found but still processing, return 409 or wait.
  4. Otherwise process, store the response under the key, return it.
\`\`\`

The client retries with the same key after a timeout, and receives the original result, never a second order. Keys are stored for a window, such as 24 hours, and scoped per client so different clients cannot collide.

### Storing the result atomically

The lookup, processing and storing must not race. Two concurrent requests with the same key must not both proceed. Solutions: insert the key into a table with a unique constraint before processing (the second insert fails and waits or returns), or use a store with atomic set-if-absent operations. Store the response in the same transaction as the business change where possible, so a crash cannot leave the change made but the key unrecorded.

### Exactly-once as an outcome

\`\`\`text
At-least-once delivery + idempotent processing = exactly-once effect
\`\`\`

This equation is how payment systems, order pipelines and messaging platforms work in practice. The transport may deliver twice; the effect happens once. Systems that claim exactly-once typically implement precisely this combination within their boundaries.

### Idempotency across services

In a saga (chapter 8) each step and compensation carries the saga ID and step number as its idempotency key. Downstream services store which keys they have processed. A retried step is recognised and skipped, and the saga completes correctly even after crashes and redeliveries.

### Deduplication windows

How long must keys be remembered? Long enough to cover the maximum retry period, including delayed redeliveries from queues, plus margin. Twenty-four hours is a common default for APIs; message consumers often keep a bounded set of recent IDs. Too short a window lets late duplicates through; too long wastes storage.

### Ordering and out-of-order duplicates

Idempotency handles repeats; it does not by itself handle reordering. If "cancel order" arrives before "create order", skipping the cancel because the order does not exist yet is wrong. Techniques include version numbers on records (apply an update only if its version is newer), and storing out-of-order events until their prerequisites arrive. Design messages with sequence numbers or versions when order matters.

### Testing for idempotency

Write tests that send every write twice and assert the state is unchanged after the second call. Include the crash-between-steps case: process, crash before acknowledging, redeliver. These tests are cheap and catch the class of bugs that otherwise appears only in production under load.
      `,
        [
          q('Which operation is naturally idempotent?', [
            'Add 100 to a balance',
            'Append a line to a log',
            'Set an order\'s status to "shipped"',
            'Increment a view counter',
          ], 2, 'Setting an absolute value produces the same state no matter how many times it runs.'),
          q('How do idempotency keys prevent duplicate orders?', [
            'Repeated keys return the stored result',
            'They block all retries sent by clients',
            'They make the network connection reliable',
            'They encrypt the order payload in transit',
          ], 0, 'Remembering results per key turns retries into safe replays of the original response.'),
          q('What produces an exactly-once effect in real systems?', [
            'Networks that never drop messages',
            'Disabling retries entirely',
            'At-most-once delivery',
            'At-least-once delivery combined with idempotent processing',
          ], 3, 'Duplicates from reliable delivery are neutralised by processing that is safe to repeat.'),
        ]
      ),
      ],
      [
      q('What is the purpose of chaos engineering?', [
        'Causing outages on purpose to reduce traffic',
        'Injecting failures to verify resilience works',
        'Replacing automated testing with monitoring',
        'Training on-call staff to panic less during incidents',
      ], 1, 'Controlled failure experiments reveal whether resilience mechanisms actually work.'),
      q('Why add jitter to retry backoff?', [
        'To make retries slower on average',
        'Because timers require randomness',
        'To avoid many clients retrying at exactly the same moment',
        'To bypass rate limits',
      ], 2, 'Random variation spreads retries out, preventing synchronised waves against a dependency.'),
      q('What HTTP status signals that a client has exceeded a rate limit?', [
        '404',
        '500',
        '401',
        '429',
      ], 3, '429 Too Many Requests tells the client to slow down, often with a retry-after header.'),
      q('A queue with no size limit hides overload until what happens?', [
        'Memory runs out and the process fails',
        'Producers automatically slow down',
        'The consumer speeds up',
        'Messages are rejected with 429',
      ], 0, 'Unbounded buffers absorb overload silently until resources are exhausted, unlike bounded ones that surface it early.'),
      ]
    ),
    chapter(
      'Observability and Operations',
      'See inside a running system with metrics, logs and traces, set service level objectives and use error budgets to balance speed and reliability, deploy changes safely with rollbacks ready, and weigh cost against performance deliberately.',
      [
      lesson('Metrics, Logs and Traces', 13, `
A distributed system cannot be understood by looking at one machine. Requests cross many services; failures show up far from their causes. Observability is the ability to ask questions about a system's behaviour from the outside, and it rests on three kinds of telemetry: metrics, logs and traces. Designing them in from the start is what makes a system operable.

### The three pillars

| Signal | What it is | Best for |
|---|---|---|
| Metrics | Numbers over time: request rate, error rate, latency, queue depth | Dashboards, alerts, trends |
| Logs | Timestamped records of discrete events | Investigating what happened in a specific case |
| Traces | The path of one request across services, with timing for each step | Finding where latency and errors originate |

### Metrics

Metrics are cheap to store and fast to query, which makes them the backbone of alerting. The most useful set for any service is often called the four golden signals:

\`\`\`text
Latency      how long requests take, as percentiles
Traffic      requests per second
Errors       the rate of failed requests
Saturation   how full the service is: CPU, memory, queue depth, connections
\`\`\`

For each service and each dependency, these four answer "is it healthy?" at a glance. Add business metrics too, such as orders placed per minute; a sudden drop in orders is often the earliest sign of a problem that technical metrics miss.

Label metrics with dimensions such as endpoint, status code and region, so you can break down a spike by cause. Avoid high-cardinality labels like user ID, which explode storage.

### Logs

Logs answer "what exactly happened for this order?". To make them useful across many services:

- Emit structured logs (JSON) with consistent field names.
- Include a request or trace ID in every line, so one request's logs can be pulled together from every service.
- Log at appropriate levels, and keep production at INFO or WARN; DEBUG everywhere floods storage.
- Never log secrets or sensitive personal data.
- Ship logs centrally; searching individual servers does not scale.

### Traces

A trace follows one request through the system as a tree of spans:

\`\`\`text
POST /orders                       320 ms
  auth service: verify token         8 ms
  order service: validate           12 ms
    database: insert order          15 ms
  payment service: authorise       240 ms   <- most of the time
    payment provider API           225 ms
  queue: publish OrderPlaced         3 ms
\`\`\`

Without a trace, "orders are slow" starts an investigation across six teams. With one, the payment provider is identified in seconds. OpenTelemetry has become the standard for instrumenting services, and it feeds tools such as Jaeger, Tempo and commercial platforms.

Tracing every request is expensive at high volume; sampling, keeping a percentage of traces plus all slow or failed ones, balances cost and insight.

### Correlation ties them together

A single ID generated at the edge and passed through every call, log line and span links the three signals: a metric alert shows errors rising, traces show which step fails, and logs with that trace ID show the exact error. Propagating this ID through HTTP headers and message metadata is a small discipline with a large payoff.

### Dashboards that answer questions

A good dashboard is built for a question: "Is the ordering flow healthy?" It shows the golden signals for that flow, the key dependency, and the business metric, in that order. Dozens of panels nobody understands are noise. One dashboard per service and one per critical user journey is a solid starting point.

### Design for observability

Instrumentation is not an afterthought. When designing a component, decide which metrics it will expose, what its logs will contain and how it will propagate trace context. Systems designed this way are diagnosable in minutes; systems without it are diagnosed by guesswork.
      `,
        [
          q('What are the four golden signals?', [
            'Latency, traffic, errors and saturation',
            'CPU, disk, memory and network only',
            'Users, revenue, cost and uptime',
            'Logs, traces, alerts and dashboards',
          ], 0, 'These four metrics describe the health of any service at a glance.'),
          q('What does a distributed trace show?', [
            'The total number of servers',
            'All log lines from one server',
            'The path and timing of one request across services',
            'The cost of each request',
          ], 2, 'Traces break a request into spans, revealing where time and errors occur.'),
          q('Why include a trace ID in every log line?', [
            'It makes logs shorter',
            'Log storage requires it',
            'It replaces the need for metrics',
            'Logs for one request can be gathered from every service',
          ], 3, 'A shared ID correlates logs, traces and metrics for a single request.'),
        ]
      ),
      lesson('Service Level Objectives and Error Budgets', 13, `
"The system must be reliable" is not a target anyone can act on. Service level objectives turn reliability into numbers agreed with the business, and error budgets turn those numbers into a practical tool for deciding when to move fast and when to slow down. Together they replace arguments with data.

### SLIs, SLOs and SLAs

| Term | Meaning | Example |
|---|---|---|
| SLI (indicator) | A measurement of some aspect of service | The share of requests that succeed within 300 ms |
| SLO (objective) | The target for an SLI over a period | 99.9% of requests succeed within 300 ms over 30 days |
| SLA (agreement) | A contract with consequences if an SLO is missed | Credits paid to customers if availability drops below 99.5% |

SLOs are internal targets; SLAs are external promises, usually looser than the SLOs behind them so that a small miss does not trigger penalties.

### Choosing good SLIs

Measure what users experience, as close to them as possible:

\`\`\`text
Good:  successful checkout requests / all checkout requests, measured at the edge
Weak:  server CPU utilisation (users do not experience CPU)
\`\`\`

Common SLIs: availability (successful requests), latency (requests under a threshold), freshness (data updated within a window) and correctness for pipelines. Two or three per critical user journey are enough.

### Setting the target

Set targets from user needs and past performance, not aspiration. If a service has run at 99.95% for a year and users are happy, 99.9% is a sensible SLO with margin. Aiming for 99.999% when 99.9% satisfies users wastes enormous effort. Different journeys deserve different targets: checkout higher than recommendations.

### Error budgets

An SLO of 99.9% means 0.1% of requests may fail. That allowance is the error budget:

\`\`\`text
10 million requests a month at 99.9%
-> 10,000 failed requests allowed per month
-> or about 43 minutes of full downtime
\`\`\`

The budget is spent by incidents, bad deploys and risky experiments. Tracking how much remains gives a shared, objective signal:

| Budget remaining | Policy |
|---|---|
| Plenty | Ship features, run experiments, take calculated risks |
| Running low | Slow down risky changes; prioritise reliability work |
| Exhausted | Freeze non-essential releases until the budget recovers |

This replaces the endless tension between "move fast" and "be careful" with a rule both sides agreed to in advance.

### Alerting on the budget

Alert on the rate at which the budget is being consumed, not on every blip. A burn-rate alert fires when errors are consuming budget fast enough to exhaust it well before the period ends:

\`\`\`text
Fast burn:  errors that would spend the monthly budget in a day -> page someone now
Slow burn:  errors that would spend it in a week -> ticket, fix in working hours
\`\`\`

This reduces noisy alerts and focuses attention on what threatens the objective.

### SLOs shape design decisions

An SLO is a design input. A 99.99% target implies multi-zone redundancy, automated failover and careful deployments; a 99% target may be met by a single instance with good monitoring. Dependencies matter too: a service cannot have a higher SLO than the dependencies it needs for every request, unless it can degrade gracefully without them.

### Review and adjust

Review SLOs quarterly. If the budget is never touched, the target may be too loose or the team too conservative. If it is exhausted every month, either invest in reliability or, honestly, lower the target if users do not need it. SLOs are tools for good decisions, not trophies.
      `,
        [
          q('What is an error budget?', [
            'The cost of fixing bugs each month',
            'The amount of failure an SLO permits over its period',
            'The number of servers allowed to fail',
            'A penalty paid to customers',
          ], 1, 'An SLO of 99.9% allows 0.1% failures, and that allowance is the budget teams can spend.'),
          q('What should a team do when the error budget is exhausted?', [
            'Raise the SLO to 100%',
            'Ship features faster to compensate',
            'Disable monitoring until next month',
            'Freeze non-essential releases and focus on reliability',
          ], 3, 'Exhausting the budget triggers the agreed policy of prioritising stability.'),
          q('Why alert on burn rate rather than every error?', [
            'It focuses attention on error rates that actually threaten the objective',
            'Individual errors cannot be counted',
            'Burn rate is required by SLAs',
            'It removes the need for on-call',
          ], 0, 'Burn-rate alerts distinguish budget-threatening trends from harmless blips.'),
        ]
      ),
      lesson('Deployment Strategies and Rollbacks', 13, `
Most outages are caused by change: a new release, a configuration edit, a migration. A system that deploys many times a day needs deployment methods that limit the damage of a bad change and undo it fast. The right strategy depends on how much risk each release carries and how quickly problems can be detected.

### Deployment strategies

| Strategy | How it works | Strengths | Weaknesses |
|---|---|---|---|
| Recreate | Stop old version, start new | Simple | Downtime |
| Rolling | Replace instances gradually | No downtime, no extra capacity | Two versions run together; slow to abort |
| Blue-green | Run new version alongside old, switch traffic at once | Instant rollback by switching back | Double capacity during the switch |
| Canary | Send a small share of traffic to the new version, then increase | Limits blast radius; real-user validation | Needs traffic splitting and good metrics |
| Feature flags | Deploy code dark, enable features per user or percentage | Decouples release from deploy; instant off switch | Flag debt if not cleaned up |

### Canary releases in practice

\`\`\`text
1. Deploy the new version to 1% of instances or traffic.
2. Compare error rate and latency with the old version for a set period.
3. If healthy, increase to 10%, 50%, 100%, checking at each step.
4. If metrics degrade, route traffic back to the old version automatically.
\`\`\`

Automated canary analysis compares the two versions statistically, removing human judgement from the decision at 2 a.m. Canaries catch problems that tests miss because they see real traffic and real data.

### Rollback readiness

A rollback should be a routine, fast, tested action:

- Keep the previous version's artifacts and configuration ready to redeploy.
- Practise rollbacks in staging as part of normal releases.
- Automate it: one command or one click, not a runbook of ten steps.
- Measure time to rollback; minutes, not hours.

Roll back first, investigate second. Restoring service is the priority; understanding the bug can wait until users are unaffected.

### Database changes complicate rollbacks

Code rolls back easily; data does not. A migration that drops a column breaks the old version if you roll back. Use expand-and-contract:

\`\`\`text
Release 1: add the new column; code writes both old and new
Release 2: code reads the new column; old column still present
Release 3: after confidence, remove the old column
\`\`\`

Every release is compatible with the previous one, so any release can be rolled back safely.

### Configuration is a deployment

Changing a feature flag, a rate limit or a timeout can cause an outage as surely as bad code. Treat configuration changes with the same discipline: version them, roll them out gradually, and be able to revert them instantly.

### Deployment safety checklist

\`\`\`text
[ ] Health checks and readiness gates on new instances
[ ] Gradual rollout with automatic halt on metric degradation
[ ] One-step rollback, practised recently
[ ] Backward-compatible database changes
[ ] Deploy during hours when people can respond
[ ] Announce and watch: dashboards open during and after
\`\`\`

### Continuous delivery culture

Small, frequent changes are safer than large, rare ones: each is easier to review, test, deploy and roll back, and if it fails, the cause is obvious. Teams that deploy daily typically have fewer and shorter incidents than teams that deploy monthly, precisely because each change is small and the deployment machinery is exercised constantly.
      `,
        [
          q('What is the main advantage of a canary release?', [
            'It requires no monitoring',
            'It deploys to every user at once',
            'Problems affect only a small share of traffic before wider rollout',
            'It removes the need for tests',
          ], 2, 'Limiting exposure lets real-traffic problems be caught with minimal impact.'),
          q('Why use expand-and-contract for database changes?', [
            'Each release stays compatible with the previous one',
            'It makes migrations run faster on large tables',
            'Databases cannot drop columns once created',
            'It avoids the need for database backups',
          ], 0, 'Compatible steps mean code can roll back without the schema breaking it.'),
          q('What should happen first when a release causes errors?', [
            'A full root cause investigation',
            'Waiting to see if it resolves itself',
            'Deploying a fix on top of the broken version',
            'Rolling back to restore service',
          ], 3, 'Restoring service comes first; understanding the cause follows.'),
        ]
      ),
      lesson('Cost and Performance Trade-offs', 13, `
Every design decision has a price, in money, in latency or in complexity. Engineers who understand costs make better trade-offs than those who optimise one dimension blindly. Cloud pricing makes many of these costs visible for the first time, and cost awareness has become part of system design rather than a finance afterthought.

### Where cloud money goes

| Category | Typical drivers |
|---|---|
| Compute | Instance count and size, running hours, idle capacity |
| Storage | Data volume, storage class, snapshots kept forever |
| Data transfer | Outbound traffic to the internet, cross-region and cross-zone traffic |
| Managed services | Databases, queues, caches, priced by capacity or usage |
| Observability | Log volume and retention are frequently a surprise |

Data transfer and logging are the two that most often surprise teams: a chatty architecture across zones or a DEBUG-level log flood can cost more than the servers.

### Performance costs money, and so does its absence

Faster systems often cost more: bigger instances, more replicas, premium storage, more caches. But slow systems cost too: users abandon slow pages, and overloaded systems need emergency capacity. The goal is not maximum performance; it is meeting the SLO at the lowest sustainable cost.

\`\`\`text
p99 target: 300 ms
Option A: 20 large instances, p99 120 ms, high cost
Option B: 8 medium instances plus a cache, p99 250 ms, much lower cost
Option B meets the objective; A pays for latency nobody needs.
\`\`\`

### Efficiency levers

| Lever | Effect |
|---|---|
| Caching | Fewer database and compute resources for the same traffic |
| Right-sizing | Instances matched to real usage rather than guesses |
| Autoscaling | No paying for peak capacity at 3 a.m. |
| Spot or preemptible instances | Large discounts for interruptible batch work |
| Storage tiers | Cold data in cheap storage, hot data on fast storage |
| Data lifecycle | Delete or archive old logs, snapshots and backups |
| Query optimisation | A fixed query can replace a database upgrade |
| Reducing cross-zone chatter | Keep related services and their data in the same zone where possible |

### Complexity is a cost too

A cheaper architecture that needs three more engineers to operate is not cheaper. Every extra system, whether a second database engine or a custom sharding layer, carries ongoing costs in operations, on-call burden and onboarding. Prefer the simplest design that meets the requirements, and count engineering time as part of the bill.

### Build versus buy

Managed services cost more per unit than running software yourself, and save the engineering time to run it. For a small team, a managed database at a premium is usually cheaper than an engineer spending a day a week on database operations. For very large scale, the calculation can flip. Make the comparison honestly, including reliability and the cost of expertise.

### Measuring cost

Track cost per unit of business value: cost per thousand orders, per active user, per gigabyte processed. This normalises for growth and highlights inefficiency. Tag resources by service and team so costs are attributable, and review them monthly. Engineers who see their service's bill make better decisions about it.

### Trade-offs are the job

System design is the practice of trading cost, performance, reliability and complexity against each other under real constraints. There is no design that maximises all four. The skill, in interviews and in production, is to name the constraint that matters most, choose deliberately, and explain what was given up and why.
      `,
        [
          q('Which two cloud costs most often surprise teams?', [
            'CPU and memory',
            'Data transfer and log volume',
            'Domain names and certificates',
            'Load balancers and DNS',
          ], 1, 'Cross-zone traffic and verbose logging can quietly exceed the cost of the servers themselves.'),
          q('Two designs both meet the p99 target; one costs twice as much. What should guide the choice?', [
            'Always pick the faster design',
            'Always pick the cheaper design regardless of risk',
            'Meet the objective at the lowest sustainable cost, considering complexity',
            'Pick the one with more servers',
          ], 2, 'Performance beyond the SLO has no value, but cost and operational simplicity do.'),
          q('Why count engineering time as part of infrastructure cost?', [
            'Engineers are paid by the cloud provider',
            'Infrastructure cannot be measured otherwise',
            'It makes the bill smaller',
            'Complex architectures consume ongoing operational effort that has real cost',
          ], 3, 'A design that saves cloud spend but demands more engineers may cost more overall.'),
        ]
      ),
      ],
      [
      q('Which signal is best for finding where latency originates in a multi-service request?', [
        'A CPU metric on one server',
        'A count of log lines',
        'A distributed trace',
        'A cost report',
      ], 2, 'Traces show timing for each step of a request across services.'),
      q('What is the relationship between an SLO and an SLA?', [
        'They are identical',
        'The SLO is an internal target, usually stricter than the external SLA',
        'The SLA is stricter than the SLO',
        'SLAs apply only to logging',
      ], 1, 'Internal objectives leave margin so that small misses do not breach contractual promises.'),
      q('Which deployment strategy allows the fastest rollback by switching traffic?', [
        'Recreate',
        'Rolling update',
        'Blue-green',
        'Manual file copy',
      ], 2, 'Blue-green keeps the old version running, so rollback is a traffic switch.'),
      q('What metric best tracks efficiency as a business grows?', [
        'Cost per unit of business value',
        'The total monthly bill on its own',
        'The number of servers running',
        'The number of engineers employed',
      ], 0, 'Normalising cost by business output separates growth from inefficiency.'),
      ]
    ),
    chapter(
      'Worked Designs',
      'Apply every building block to complete designs: a URL shortener, a social news feed, a real-time chat system and a ride-hailing backend, each worked from requirements through estimation to architecture and trade-offs.',
      [
      lesson('Designing a URL Shortener', 14, `
A URL shortener is the classic first design exercise because it is simple to describe yet touches estimation, ID generation, storage, caching and scaling. Working through it end to end establishes the method used for every later design.

### Requirements

\`\`\`text
Functional
- Given a long URL, return a short one (e.g. sho.rt/x7Kp2Q)
- Visiting the short URL redirects to the long one
- Optional: custom aliases, expiry, click counts

Non-functional
- Redirects must be fast (under 50 ms at p99 from the service)
- Highly available: a dead redirect service breaks links everywhere
- Read-heavy: far more redirects than creations
- Short codes must be unique and hard to guess
\`\`\`

### Estimation

\`\`\`text
Creations:   1 million a day  -> about 12 per second
Redirects:   100 million a day -> about 1,200 per second, peaks perhaps 5,000
Storage:     1 million a day x 500 bytes x 5 years -> roughly 900 GB
Read:write   about 100:1
\`\`\`

Conclusion: the write path is small; the read path needs caching and horizontal scaling; storage is large but not extreme.

### Short code generation

A 7-character code from 62 characters (a-z, A-Z, 0-9) gives 62^7, about 3.5 trillion combinations, plenty for years. Options:

| Approach | How | Trade-offs |
|---|---|---|
| Hash the URL and take a prefix | MD5 or SHA, first 7 chars | Collisions must be checked; same URL gives same code |
| Counter encoded in base 62 | Unique ID from a counter, converted | Predictable, sequential codes; needs a distributed ID generator |
| Random codes with a uniqueness check | Generate, check the store, retry on collision | Simple, unpredictable; rare retries |
| Pre-generated key pool | A service generates unused keys ahead of time | Fast creation; a small key service to run |

Random codes with a uniqueness check are simple and unguessable, which suits most cases.

### Data model

\`\`\`text
urls
  short_code   (primary key)   x7Kp2Q
  long_url                     https://...
  created_at
  expires_at   (nullable)
  owner_id     (nullable)
\`\`\`

Lookups are always by \`short_code\`, so a key-value store or a relational table with the code as primary key both work. At the estimated scale, a relational database with replicas is sufficient; a distributed key-value store suits far larger volumes.

### Architecture

\`\`\`text
Client -> CDN/edge (optional caching of redirects)
       -> Load balancer
       -> Redirect service instances (stateless)
            -> Cache (Redis): short_code -> long_url
            -> Database (primary + replicas)

Creation path: API -> generate code -> insert -> return
Redirect path: lookup cache -> on miss, read database, populate cache -> 301/302
\`\`\`

### Caching

Redirects are read-heavy and the same popular links dominate. A cache with cache-aside and a long TTL serves most redirects from memory. Because links rarely change, staleness is not a concern, except for deletions and expiry, which invalidate the cache entry explicitly.

### 301 versus 302

A 301 (permanent) redirect lets browsers cache the redirect, reducing load but preventing click tracking on repeat visits. A 302 (temporary) sends every visit through the service, enabling analytics. The choice follows from whether click counts are a requirement.

### Analytics

Click counting on the redirect path must not slow redirects. Publish a click event to a queue and count asynchronously, as chapter 6 described, rather than updating a counter row on every redirect.

### Scaling further

At much larger scale: shard the store by short code (it is random, so distribution is even), cache at the CDN edge, and run redirect services in several regions. Availability is protected by stateless services, replicated storage and a cache that keeps serving popular links even if the database is briefly down.

### Trade-offs to state

Random versus sequential codes (unpredictability versus simplicity), 301 versus 302 (load versus analytics), relational versus key-value storage (simplicity now versus scale later). Naming these is what distinguishes a design from a diagram.
      `,
        [
          q('Why is the read path the main scaling concern for a URL shortener?', [
            'Creations are very expensive',
            'Redirects vastly outnumber creations',
            'Short codes are large',
            'Databases cannot store URLs',
          ], 1, 'A 100:1 read-to-write ratio means redirects dominate the load.'),
          q('How should click counting be handled without slowing redirects?', [
            'Update a counter row synchronously on every redirect',
            'Skip counting entirely',
            'Count only cache misses',
            'Publish click events to a queue and count asynchronously',
          ], 3, 'Asynchronous counting keeps the redirect path fast while still recording every click.'),
          q('What is a consequence of using 301 redirects?', [
            'Browsers cache the redirect, reducing load but hiding repeat clicks',
            'Redirects become slower',
            'The short code changes on every visit',
            'Analytics become more accurate',
          ], 0, 'Permanent redirects are cached by browsers, so later visits bypass the service.'),
        ]
      ),
      lesson('Designing a News Feed', 14, `
A news feed shows each user posts from the people and pages they follow, newest or most relevant first. It looks simple but hides a classic design choice, push versus pull, and it stresses caching, fan-out and storage at scale. It is among the most common interview designs because the trade-offs are so clear.

### Requirements

\`\`\`text
Functional
- Users publish posts (text, images)
- Users follow others
- Each user sees a feed of posts from those they follow, recent first
- Likes and comments (secondary)

Non-functional
- Feed load must be fast (under 200 ms)
- Read-heavy: many feed views per post created
- Eventual consistency acceptable: a post may take seconds to appear
- High availability
\`\`\`

### Estimation

\`\`\`text
Users:               10 million daily active
Posts:               2 million a day -> about 25 per second
Feed views:          10 million users x 10 views -> 100 million a day, ~1,200/s average
Average followers:   200; a few accounts have millions
\`\`\`

### The core choice: push or pull

**Pull (fan-out on read)**: when a user opens the feed, fetch recent posts from everyone they follow, merge and sort.

\`\`\`text
open feed -> get follow list (200) -> fetch recent posts per followee
          -> merge, sort, return
\`\`\`

Simple and always fresh, but expensive at read time: 200 lookups per feed view, multiplied by 100 million views a day.

**Push (fan-out on write)**: when a user posts, write the post ID into a precomputed feed list for every follower.

\`\`\`text
publish post -> for each of 200 followers: append post ID to their feed cache
open feed    -> read the user's precomputed list (one lookup), hydrate posts
\`\`\`

Feed reads become cheap: one list read. Writes cost more, and a celebrity with 5 million followers causes 5 million writes per post.

### The hybrid

Most real systems combine them:

\`\`\`text
Normal accounts:   push, feeds precomputed for followers
Celebrity accounts (above a follower threshold): pull, merged at read time
Feed read:         precomputed list + recent posts from followed celebrities
\`\`\`

This caps write fan-out while keeping most reads cheap. The threshold is tuned by measurement.

### Storage

| Data | Store |
|---|---|
| Posts | Relational or document store, sharded by post ID or author |
| Follow graph | Relational, or a graph-friendly store; cached heavily |
| Precomputed feeds | Redis lists or sorted sets per user, capped at a few hundred IDs |
| Media | Object storage behind a CDN |

Feed lists hold post IDs only; the post content is fetched (hydrated) from a post cache or store, so an edited post shows correctly everywhere.

### Architecture

\`\`\`text
Post service  -> writes post -> publishes PostCreated event
Fan-out workers <- consume events -> append post ID to followers' feed lists
Feed service  -> read feed list -> hydrate from post cache -> return page
Media         -> object storage + CDN
\`\`\`

Fan-out runs asynchronously through a queue; the poster's request returns immediately, and followers see the post within seconds.

### Ranking

Chronological feeds are simplest. Ranked feeds score candidate posts by predicted interest, which adds a ranking service in the read path and usually a larger candidate set. Keep the retrieval architecture the same; ranking sits on top.

### Pagination and consistency

Cursor pagination (by post timestamp or ID) avoids duplicates as new posts arrive. Feeds are eventually consistent by design; a post appearing a few seconds late is acceptable, and the system is far simpler for accepting it.

### Failure and scale

Feed lists in a cache can be lost; rebuild them lazily with a pull for that user. Fan-out workers scale horizontally on queue depth. Popular posts and hot users are handled by the celebrity path and by replicating hot cache keys. Shard feed lists by user ID for even distribution.

### Trade-offs to state

Push versus pull versus hybrid (write cost versus read cost), precomputed lists in memory (speed versus memory and rebuild cost), eventual consistency (simplicity versus immediacy). Explaining the celebrity problem and its hybrid solution is usually the heart of a strong answer.
      `,
        [
          q('What is the main weakness of pure fan-out on write?', [
            'Feed reads become slow for every user',
            'Popular accounts cause millions of writes per post',
            'Posts can no longer be edited after publishing',
            'It requires a dedicated graph database',
          ], 1, 'Push fan-out multiplies writes by follower count, which explodes for celebrity accounts.'),
          q('Why store post IDs rather than full posts in precomputed feed lists?', [
            'Edits stay consistent and lists stay small',
            'Lists cannot hold text content at all',
            'IDs are more secure than post content',
            'It makes fan-out deliberately slower',
          ], 0, 'ID lists are small and a single source for post content keeps edits consistent.'),
          q('How does the hybrid approach handle celebrity accounts?', [
            'It blocks them from posting',
            'It pushes their posts to all followers immediately',
            'It stores their posts in a separate database',
            'Their posts are pulled and merged at read time instead of pushed',
          ], 3, 'Pulling for high-follower accounts caps write fan-out while keeping other reads cheap.'),
        ]
      ),
      lesson('Designing a Chat System', 14, `
Chat systems combine real-time delivery, message ordering, presence and durable history, at a scale of millions of concurrent connections. The design exercises persistent connections, message storage and the difference between online delivery and stored delivery.

### Requirements

\`\`\`text
Functional
- One-to-one and small group chats
- Messages delivered in real time when the recipient is online
- Messages stored and delivered later when they are offline
- Delivery and read receipts, online presence, message history

Non-functional
- Low latency delivery (well under a second)
- Messages must not be lost, and must appear in a consistent order per chat
- Millions of concurrent connections
- End-to-end encryption may be a requirement; it constrains server-side features
\`\`\`

### Estimation

\`\`\`text
Concurrent users:   5 million connected
Messages:           50 million a day -> about 600 per second, peaks several thousand
Message size:       ~ 200 bytes text + metadata
Storage:            50 million x 300 bytes x 365 -> about 5.5 TB per year
Connections:        each server holds tens of thousands of WebSocket connections
\`\`\`

### Real-time transport

HTTP request-response cannot push messages to clients. Options:

| Transport | Direction | Fit |
|---|---|---|
| WebSocket | Two-way, persistent | The standard for chat |
| Server-Sent Events | Server to client | Notifications, not two-way chat |
| Long polling | Simulated push | Fallback for restricted networks |

Clients hold a WebSocket to a chat server. A load balancer distributes connections; once established, a connection stays with its server.

### Routing messages between servers

Sana (on server A) sends to Ayesha (on server B). Server A must find where Ayesha is connected:

\`\`\`text
1. Sana's client -> server A: message
2. Server A stores the message durably (message store) and acknowledges
3. Server A looks up Ayesha's connection in a session store (Redis): server B
4. Server A forwards to server B (via a pub-sub channel or direct call)
5. Server B pushes to Ayesha's client
6. If Ayesha is offline, the message waits in storage; a push notification is sent
\`\`\`

A pub-sub layer (Redis pub-sub or a message broker) lets any server publish to a per-user channel, and the server holding that user's connection delivers it.

### Message storage and ordering

Each chat is a sequence of messages that must appear in the same order for all participants. Assign each message a sequence number per chat, generated by the server that accepts it or by the storage layer. Store messages keyed by chat ID and sequence:

\`\`\`text
messages
  chat_id       partition key
  sequence      clustering key (sorted)
  sender_id
  body
  sent_at
\`\`\`

A wide-column store or a partitioned relational table serves "fetch the last 50 messages of chat X" efficiently, and history grows without bound, so old messages can move to cheaper storage.

### Delivery guarantees

Store before acknowledging: the sender's client shows "sent" only after the server has persisted the message. Delivery to the recipient is at-least-once; clients deduplicate by message ID. Read receipts are small events flowing back the same way.

### Presence

Online status is updated by heartbeats over the connection and stored with a short expiry in the session store. Presence is inherently approximate; a user shown online for a few seconds after disconnecting is acceptable. Broadcasting presence to every contact is itself a fan-out problem; batch and throttle it.

### Group chats

Small groups fan out server-side: one message stored once per chat, delivered to each member's connection. Very large groups behave like feeds and use pull. Ordering per chat still relies on the sequence number.

### Scaling and failure

- Chat servers are stateful only for connections; if one dies, clients reconnect to another and resync from the sequence number they last received.
- The session store and pub-sub layer are replicated.
- Message storage is sharded by chat ID.
- Offline users get push notifications through platform services (APNs, FCM), which are best-effort; the message itself is safe in storage.

### End-to-end encryption

If required, servers see only ciphertext: search, moderation and server-side previews become impossible, and key management moves to the clients. It is a requirement that reshapes the design, so confirm it early.

### Trade-offs to state

WebSockets versus polling (real-time versus simplicity), store-then-deliver (durability versus a few milliseconds), per-chat sequence numbers (ordering versus a small coordination cost), encryption (privacy versus server-side features).
      `,
        [
          q('Why do chat systems use WebSockets rather than plain HTTP requests?', [
            'The server must push messages to clients in real time',
            'HTTP cannot carry text messages',
            'WebSockets are easier to cache at the edge',
            'WebSockets require no load balancer at all',
          ], 0, 'Request-response cannot deliver messages the moment they arrive; persistent two-way connections can.'),
          q('How does server A deliver a message to a user connected to server B?', [
            'It restarts server B',
            'It waits until the user connects to server A',
            'It looks up the user\'s server in a session store and forwards via pub-sub',
            'It emails the message',
          ], 2, 'A shared session store and pub-sub channel route messages to whichever server holds the connection.'),
          q('What ensures messages in a chat appear in the same order for everyone?', [
            'Client clocks',
            'Alphabetical sorting of content',
            'Random IDs',
            'A per-chat sequence number assigned when the message is stored',
          ], 3, 'Server-assigned sequence numbers give a single authoritative order per chat.'),
        ]
      ),
      lesson('Designing a Ride-Hailing Backend', 13, `
A ride-hailing service matches riders with nearby drivers in real time, tracks trips, handles payments and must remain reliable during evening peaks and rain. It combines high-frequency location updates, geospatial queries, matching logic and transactional trip records, making it a rich final design.

### Requirements

\`\`\`text
Functional
- Riders request a ride from a location to a destination
- Drivers share live location; nearby available drivers are found and offered the trip
- Trip lifecycle: requested, matched, en route, started, completed, paid
- Fare estimation, payments, ratings, trip history

Non-functional
- Matching in seconds; location updates every few seconds
- Highly available in the request and matching path
- Trip and payment records strongly consistent
- Regional operation with sharp daily peaks
\`\`\`

### Estimation (one large city)

\`\`\`text
Active drivers at peak:   50,000, each sending a location every 4 s
                          -> about 12,500 location updates per second
Ride requests at peak:    perhaps 500 per minute
Trip record:              ~ 2 KB; 500,000 trips a day -> ~1 GB a day
\`\`\`

Location updates dominate write volume; trips are modest and must be durable.

### Location service

Storing every update in a relational database would overwhelm it, and only the latest position matters for matching:

\`\`\`text
Driver app -> Location service -> in-memory geospatial index (Redis GEO or similar)
                                -> latest location per driver, with a short TTL
                                -> optionally, a stream of updates to storage
                                   for history and analytics
\`\`\`

Geospatial indexes answer "drivers within 3 km of this point" quickly. Partition by city or region, since matching never crosses cities. The short TTL removes drivers whose app stopped sending.

### Matching

\`\`\`text
1. Rider requests a ride (location, destination).
2. Matching service queries the location index for available drivers nearby.
3. Candidates are ranked: distance, estimated arrival, rating, acceptance history.
4. The best driver is offered the trip with a short timeout; on decline or timeout,
   the next candidate is offered.
5. On acceptance, the trip record is created and both parties are notified.
\`\`\`

Offers must be exclusive: a driver should not receive two offers at once. A short lock on the driver in the session store, with a lease, handles this. The matching service is stateless apart from these short-lived locks and scales horizontally per region.

### Trip lifecycle and consistency

Trips and payments are the system of record and belong in a relational database with strong consistency:

\`\`\`text
trips (id, rider_id, driver_id, status, pickup, dropoff, fare, ...)
status transitions: requested -> matched -> arriving -> in_progress
                    -> completed -> paid  (and cancelled from several states)
\`\`\`

Status changes are updates guarded by the current state (update only if status is the expected previous value), which prevents conflicting transitions from duplicate requests. Payment follows the saga approach: charge the rider, pay out the driver, with compensations on failure.

### Real-time updates

Riders watch their driver approach. The driver's location updates already flow to the location service; the rider's app subscribes to updates for their trip through a WebSocket or push channel, as in the chat design. Only the matched rider receives that driver's live position.

### Architecture summary

\`\`\`text
Apps -> API gateway (auth, rate limits)
     -> Location service  -> geospatial index (partitioned by region)
     -> Matching service  -> queries index, locks driver, creates trip
     -> Trip service      -> relational database (trips, strongly consistent)
     -> Payment service   -> payment provider, saga with trip service
     -> Notification service -> push and WebSocket updates
     -> Events (TripCompleted etc.) -> analytics, pricing, fraud
\`\`\`

### Peaks and surge

Demand spikes at evening rush hour and during rain. Autoscale matching and location services on load; pre-scale for known peaks; use dynamic pricing signals computed from events. Rate limit request spam, and degrade gracefully: if ranking is slow, match by distance alone rather than fail.

### Failure modes

- Location index loss: drivers repopulate it within one update cycle; matching pauses for seconds, not minutes.
- Matching service crash: offers with leases expire; the rider's request is retried.
- Database failover: trip writes retry; the app shows "confirming" briefly.
- Payment provider outage: trips complete; payment is retried asynchronously.

### Trade-offs to state

In-memory location store (speed versus durability of history), regional partitioning (locality versus cross-region trips at borders), strong consistency for trips only (correctness where it counts versus availability elsewhere), lease-based driver locks (exclusivity versus a little latency). This design uses nearly every chapter of the course, which is the point.
      `,
        [
          q('Why keep live driver locations in an in-memory geospatial store rather than the trips database?', [
            'Databases cannot store coordinates',
            'Update volume is huge and only the latest position matters for matching',
            'Drivers request it',
            'It makes payments faster',
          ], 1, 'Thousands of updates per second and proximity queries suit a fast geospatial index, not a transactional database.'),
          q('How is a driver prevented from receiving two ride offers at once?', [
            'By sending offers only every ten minutes',
            'By rotating drivers alphabetically',
            'With a short lease-based lock on the driver during an offer',
            'By storing offers in the trips table only',
          ], 2, 'A lease ensures exclusivity while expiring automatically if the matching service fails.'),
          q('Which data in the ride-hailing system needs strong consistency?', [
            'Driver presence heartbeats',
            'Trip status and payment records',
            'Surge pricing estimates',
            'Map tiles',
          ], 1, 'Trips and money are the system of record; a duplicated charge or lost trip is unacceptable.'),
        ]
      ),
      ],
      [
      q('What is the first step in every worked design?', [
        'Choosing the database',
        'Clarifying functional and non-functional requirements',
        'Drawing the load balancer',
        'Estimating cost',
      ], 1, 'Requirements determine every later choice, so they come before any architecture.'),
      q('Which design most directly faces the celebrity fan-out problem?', [
        'URL shortener',
        'News feed',
        'Ride-hailing',
        'Rate limiter',
      ], 1, 'Feeds must handle accounts whose posts reach millions of followers.'),
      q('Which pattern appears in both the chat and ride-hailing designs for live updates?', [
        '301 redirects cached by browsers',
        'Offset pagination of history',
        'Persistent connections pushing updates',
        'Two-phase commit across services',
      ], 2, 'Both systems push real-time changes to subscribed clients over persistent connections.'),
      q('Why state trade-offs explicitly at the end of a design?', [
        'Interviewers require a fixed number of trade-offs',
        'It makes the design longer',
        'It shows the choices were deliberate and what was given up',
        'Trade-offs replace requirements',
      ], 2, 'Naming what was traded demonstrates judgement rather than a memorised diagram.'),
      ]
    ),
    chapter(
      'Interviews and Practice',
      'Follow a repeatable framework for system design interviews, communicate trade-offs so interviewers see your judgement, avoid the mistakes that sink otherwise strong candidates, and build a study plan that turns knowledge into a career.',
      [
      lesson('A Framework for System Design Interviews', 13, `
A system design interview gives you a vague prompt, such as "design a food delivery platform", and 45 minutes. There is no single right answer; the interviewer wants to see how you think. A repeatable framework keeps you structured under pressure and makes sure you cover what matters.

### The five phases

\`\`\`text
1. Requirements        5 to 8 minutes
2. Estimation          3 to 5 minutes
3. High-level design   10 to 15 minutes
4. Deep dives          10 to 15 minutes
5. Wrap-up             3 to 5 minutes
\`\`\`

Timings are approximate; adjust to the interviewer's signals.

### Phase 1: requirements

Ask before you design. Interviewers deliberately leave prompts vague to see whether you clarify:

| Ask about | Example questions |
|---|---|
| Users and scale | How many users? Which regions? Growth expected? |
| Core features | What must work in version one? What is out of scope? |
| Read/write patterns | Is this read-heavy or write-heavy? |
| Consistency needs | Can data be briefly stale? Where must it be exact? |
| Latency and availability | Any specific targets? |
| Constraints | Existing systems, compliance, budget? |

Write the agreed requirements where both of you can see them. Choosing two or three core features and explicitly deferring the rest shows judgement, not laziness.

### Phase 2: estimation

Do the quick arithmetic from chapter 1: requests per second, storage, bandwidth. State assumptions and round freely. The purpose is to justify decisions: "about 5,000 reads per second at peak, so we need caching and several instances, but a single database primary with replicas handles the writes".

### Phase 3: high-level design

Draw the main components and the flow of a core request:

\`\`\`text
Clients -> Load balancer -> API services -> Database
                                        -> Cache
                                        -> Queue -> Workers
                        -> CDN for static assets
\`\`\`

Walk through the primary use case end to end: what happens when a user places an order. Name the data model at the level of main entities and keys. Keep it simple at this stage; complexity comes in deep dives where it is justified.

### Phase 4: deep dives

The interviewer will steer towards areas that matter for the problem, or ask which you would explore. Typical deep dives:

- The hardest scaling problem: the feed fan-out, the location index, the hot partition.
- Data storage: schema, sharding key, consistency model.
- Reliability: what fails, and what happens then.
- A specific mechanism: the matching algorithm, the rate limiter, the ID generator.

For each, present options, compare them and choose one with reasons. This is where chapters 3 to 9 pay off.

### Phase 5: wrap-up

Summarise the design, restate the key trade-offs, and mention what you would improve with more time: monitoring, security details, cost optimisation, an alternative you considered. End with the design's main risks and how you would validate them.

### Drive, but collaborate

Lead the conversation, but treat the interviewer as a colleague: check in, ask whether they want more depth here or breadth elsewhere, and adapt. Interviewers give hints; taking them well is a positive signal, not a failure.

### Practise out loud

Reading designs is not the same as producing them under time pressure. Practise with a timer and a whiteboard or drawing tool, speaking your reasoning aloud, ideally with a partner who asks questions. The framework becomes automatic after a dozen practice sessions, freeing your attention for the actual problem.
      `,
        [
          q('What should happen in the first minutes of a system design interview?', [
            'Drawing the full architecture immediately',
            'Clarifying requirements and scope with the interviewer',
            'Choosing a database',
            'Discussing salary',
          ], 1, 'Requirements drive every later decision, and asking shows judgement.'),
          q('What is the purpose of the estimation phase?', [
            'To impress with exact numbers',
            'To fill time',
            'To justify design decisions with rough capacity figures',
            'To decide the programming language',
          ], 2, 'Numbers turn vague concerns into concrete choices about caching, scaling and storage.'),
          q('How should you handle an interviewer\'s hint?', [
            'Ignore it to show independence',
            'Argue that your approach is better',
            'Take it as collaboration and adapt your design',
            'Stop and restart the design from scratch',
          ], 2, 'Responding well to hints demonstrates collaboration and flexibility, which interviewers value.'),
        ]
      ),
      lesson('Communicating Trade-offs Clearly', 13, `
Two candidates can propose the same architecture and receive very different evaluations. The difference is how they explain it. Interviewers assess judgement, and judgement is visible only when you compare options and explain why you chose one. Communicating trade-offs is a skill that can be practised like any other.

### The pattern: options, comparison, choice, cost

For every significant decision:

\`\`\`text
"There are two reasonable options here.
 Option A: push the post to every follower's feed at write time.
   Fast reads, but writes explode for accounts with millions of followers.
 Option B: pull posts from followed accounts at read time.
   Cheap writes, but every feed load does hundreds of lookups.
 Given that reads outnumber writes 50 to 1, I would push for normal
 accounts and pull for accounts above a follower threshold.
 The cost is a more complex read path that merges two sources."
\`\`\`

Four sentences show the options, the reasoning tied to a requirement, the decision and its cost. This is the shape of a strong answer to almost any design question.

### Tie every choice to a requirement

"I would use Redis" is an assertion. "Because menus are read 100 times more often than they change and can be a few minutes stale, I would cache them in Redis with a five-minute TTL" is reasoning. Interviewers listen for the "because". Practise never naming a technology without the requirement that justifies it.

### Name what you are giving up

Every choice loses something. Saying it aloud is a sign of maturity, not weakness:

| Choice | What it costs |
|---|---|
| Eventual consistency for the feed | Posts may appear seconds late |
| Sharding by customer | Restaurant-wide queries scatter across shards |
| A cache in front of the database | Stale data and invalidation complexity |
| Microservices | Network failures, distributed debugging |
| A managed database | Higher unit cost, less control |

Candidates who present designs with no downsides appear either inexperienced or unaware.

### Use numbers and specifics

"It scales well" means nothing. "At 5,000 requests per second with a 95% cache hit rate, the database sees 250 per second, well within a single primary's capacity" is checkable and convincing. Specific numbers, specific failure scenarios and specific mechanisms distinguish real understanding from vocabulary.

### Structure your speech

Speak in headlines, then detail:

\`\`\`text
"For storage I see three concerns: the write volume, the query patterns
 and consistency. Taking them in order..."
\`\`\`

Signposting lets the interviewer follow and lets you notice when you have drifted. When you finish a section, say so and check whether to continue or move on.

### Draw as you talk

A diagram that grows as you explain keeps both of you oriented. Label components, draw the direction of data flow, and mark where state lives. When you discuss a failure, point to the component that fails and trace the effect.

### Handle uncertainty honestly

You will be asked things you do not know. Say so, then reason: "I have not used that specific system, but based on the trade-offs I would expect it to..." Reasoning from principles about an unfamiliar tool is far better than bluffing, which experienced interviewers detect easily.

### Listen for what the interviewer values

Some interviewers care about data modelling; others about failure handling or scale. Their questions reveal it. Adjust your depth accordingly rather than delivering a fixed script. The best interviews feel like a design discussion between colleagues, and that is exactly what the interviewer is trying to simulate.
      `,
        [
          q('What four elements make a strong explanation of a design choice?', [
            'Options, comparison against requirements, the choice, and its cost',
            'The technology name, its version, its price and its logo',
            'A diagram, a joke, a summary and a question',
            'The fastest option, the cheapest option, and the average of both',
          ], 0, 'Showing alternatives, reasoning, a decision and what it gives up demonstrates judgement.'),
          q('Why should you name the downsides of your own design?', [
            'Interviewers deduct points for confidence',
            'It fills remaining time',
            'It shows awareness that every choice has a cost, a sign of experience',
            'Designs without downsides are not allowed',
          ], 2, 'Acknowledging costs signals maturity, while claiming none suggests inexperience.'),
          q('What is the best response when asked about a system you have not used?', [
            'Pretend familiarity and hope',
            'Refuse to answer',
            'Change the subject to a system you know',
            'Say so, then reason from principles about its likely trade-offs',
          ], 3, 'Honest reasoning from fundamentals is convincing; bluffing is easily caught.'),
        ]
      ),
      lesson('Common Mistakes and How to Avoid Them', 13, `
Most failed system design interviews fail for a handful of predictable reasons. Knowing them in advance lets you catch yourself in the moment. Each mistake below has a simple corrective habit.

### Skipping requirements

Jumping straight to architecture designs the wrong system. A candidate who builds a globally distributed feed for what was meant to be an internal tool has wasted the interview. Corrective habit: never draw a box before agreeing on scope, scale and non-functional requirements.

### Over-engineering

Adding Kafka, microservices, multi-region replication and sharding to a system with 100 requests per second signals that you cannot match solutions to problems. Corrective habit: start with the simplest design that meets the requirements, then say what you would add and at what scale, with numbers.

### Under-engineering

The opposite: a single server and database for a system with millions of users, with no discussion of failure or scale. Corrective habit: use the estimation to identify which components need scaling, and address the two or three biggest bottlenecks explicitly.

### Naming technologies without reasons

"We use Cassandra here" without saying why. Corrective habit: every technology mention is followed by "because" and a requirement, as the previous lesson practised.

### Ignoring failure

A design that works only when everything works. Corrective habit: for each major component, say what happens when it fails and how the system responds; mention redundancy, timeouts, retries and degradation.

### Hand-waving the hard part

Every problem has a crux: the fan-out, the matching, the hot partition, the ordering guarantee. Candidates who spend 30 minutes on load balancers and 2 minutes on the crux have avoided the actual question. Corrective habit: identify the hardest part early and budget the most time for it.

### Monologue without checking in

Talking for 15 minutes without pausing leaves the interviewer unable to steer. Corrective habit: after each phase, summarise briefly and ask whether to go deeper or move on.

### Poor time management

Running out of time before any deep dive, or spending the last ten minutes on a minor detail. Corrective habit: watch the clock, follow the phase timings from the framework, and be willing to say "I will leave that at a high level to cover the matching service".

### Silence while thinking

Long pauses make interviewers guess what is happening. Corrective habit: think out loud. "I am weighing whether to shard by user or by restaurant; let me think about which queries dominate" is fine and informative.

### Defending a bad choice

When an interviewer points out a flaw, arguing rather than adapting is a strong negative signal. Corrective habit: acknowledge, evaluate, and revise: "You are right, a hot restaurant would overload that shard; a directory-based approach or splitting hot keys would handle it."

### Forgetting the data model

Boxes and arrows with no idea what is stored where. Corrective habit: sketch the main entities, their keys and the most important access patterns; it grounds every later discussion.

### A pre-interview checklist

\`\`\`text
[ ] Requirements agreed and written down
[ ] Estimation done with stated assumptions
[ ] Simple high-level design first
[ ] The hard part identified and given the most time
[ ] Failure modes discussed for major components
[ ] Every technology justified by a requirement
[ ] Trade-offs stated explicitly
[ ] Checked in with the interviewer at each phase
\`\`\`

Review it after each practice session. Most candidates repeat the same one or two mistakes; finding yours and fixing it is the fastest improvement available.
      `,
        [
          q('What is the corrective habit for over-engineering?', [
            'Always add sharding before anything else',
            'Start simple, then add complexity as numbers justify',
            'Avoid mentioning scale at any point',
            'Use every technology you know to show range',
          ], 1, 'Matching complexity to the actual numbers shows judgement.'),
          q('What does "hand-waving the hard part" mean?', [
            'Drawing the diagram with hand gestures',
            'Avoiding the problem\'s crux',
            'Explaining too much detail on one part',
            'Asking the interviewer too many questions',
          ], 1, 'Interviewers want the difficult core of the problem addressed, not just familiar boxes.'),
          q('How should you respond when an interviewer identifies a flaw in your design?', [
            'Defend the original choice firmly',
            'Apologise and stop designing',
            'Ignore it and continue',
            'Acknowledge it, evaluate, and revise the design',
          ], 3, 'Adapting to valid feedback is a strong positive signal of collaboration and judgement.'),
        ]
      ),
      lesson('A Study Plan and Career Path', 12, `
System design skill grows through a cycle of learning concepts, studying real systems and practising designs. It is also the skill that most distinguishes senior engineers from mid-level ones, which makes it central to career growth. A deliberate plan turns scattered reading into real ability.

### A six-week plan

\`\`\`text
Week 1: Foundations and APIs        chapters 1 and 2; estimate three systems
Week 2: Storage and caching         chapters 3 and 4; model data for two apps
Week 3: Scaling and async           chapters 5 to 7; design a queue-based pipeline
Week 4: Consistency and resilience  chapters 8 to 10; add failure handling to earlier designs
Week 5: Worked designs              chapter 11; redo each design from memory
Week 6: Mock interviews             chapter 12; four timed sessions with feedback
\`\`\`

Adjust to your experience. Practising designs matters more than rereading; aim for at least one full timed design per week from week 3.

### Practice prompts

Beyond the worked designs, common prompts to practise:

| Prompt | Core challenge |
|---|---|
| Rate limiter | Algorithms, distributed counters |
| Notification system | Fan-out, delivery guarantees, priorities |
| E-commerce checkout | Inventory consistency, payments, sagas |
| Video streaming | Storage, CDN, transcoding pipeline |
| Search autocomplete | Latency, trie or index structures, caching |
| Distributed cache | Consistent hashing, eviction, replication |
| Payment system | Idempotency, ledgers, reconciliation |
| Booking system | Concurrency, double-booking prevention |

For each, apply the framework, then compare your design with published architectures.

### Learn from real systems

Engineering blogs from large companies describe real trade-offs at scale. Read them with a question in mind: what problem forced this design, and what did they give up? Postmortems, public incident reports, are even more valuable; they show how systems fail in practice. The books "Designing Data-Intensive Applications" and "Site Reliability Engineering" cover the underlying principles in depth.

### Apply it at work

The best practice is real. Look for opportunities in your current role:

- Write a short design document before building a feature, with requirements, options and trade-offs.
- Propose a caching or queueing improvement backed by measurements.
- Volunteer for on-call or incident reviews to see failures first-hand.
- Review others' designs and ask about their trade-offs.

Design documents and incident reviews are how senior engineers work, and doing them builds exactly the muscles interviews test.

### The career path

| Level | System design expectation |
|---|---|
| Junior | Understands components; implements designs made by others |
| Mid-level | Designs features within an existing architecture; explains trade-offs |
| Senior | Designs systems and services; owns reliability and scaling decisions |
| Staff and principal | Shapes architecture across teams; balances technical and business constraints |

Progression is driven by the scope of problems you can own and by how well you communicate designs to others, in writing and in discussion.

### Opportunities

Strong system design skills are in demand in Pakistan's fintechs, telecoms and software houses serving international clients, and in remote roles abroad, where design interviews are standard for senior positions. The ability to reason clearly about scale, reliability and cost is valued regardless of language or framework, which makes it durable as technologies change.

### Keep practising

System design is never finished. New tools appear, scales grow, and every real system teaches something. Keep a personal notebook of designs, decisions and lessons from incidents. Over a few years, that notebook becomes the judgement that defines a senior engineer.
      `,
        [
          q('What matters more than rereading when building system design skill?', [
            'Memorising technology names',
            'Practising full timed designs regularly',
            'Watching videos at double speed',
            'Collecting diagrams',
          ], 1, 'Producing designs under time pressure builds the skill interviews and real work require.'),
          q('Why are public postmortems valuable study material?', [
            'They list the best technologies to use',
            'They replace the need for practice',
            'They show how real systems fail in practice',
            'They contain interview questions',
          ], 2, 'Incident reports reveal failure modes and trade-offs that theory alone does not.'),
          q('Which habit at work most directly builds system design ability?', [
            'Avoiding on-call duty',
            'Implementing features without discussion',
            'Reading only framework documentation',
            'Writing design documents with options and trade-offs before building',
          ], 3, 'Design documents practise the exact reasoning and communication that define senior engineers.'),
        ]
      ),
      ],
      [
      q('Roughly how long should requirements gathering take in a 45-minute design interview?', [
        'Under one minute',
        'Around five to eight minutes',
        'Half the interview',
        'It should be skipped',
      ], 1, 'Enough time to agree scope and constraints, without consuming the design time.'),
      q('What distinguishes reasoning from assertion when naming a technology?', [
        'Mentioning the version number',
        'Naming an alternative technology too',
        'Stating the requirement that justifies the choice',
        'Drawing it in a different colour',
      ], 2, 'Interviewers listen for the "because" that ties a choice to a need.'),
      q('Which is a sign of under-engineering?', [
        'Adding Kafka to a 100 request-per-second system',
        'A single server with no discussion of failure for millions of users',
        'Discussing trade-offs at length',
        'Choosing a managed database',
      ], 1, 'Ignoring scale and failure for a large system shows the numbers were not applied.'),
      q('How does system design skill relate to career progression?', [
        'It matters only for passing interviews',
        'Owning larger design decisions defines senior roles',
        'It becomes irrelevant beyond the mid-level',
        'It is replaced by raw coding speed',
      ], 1, 'Scope of design ownership and clarity of communication drive advancement.'),
      ]
    ),
  ],
  final: [
    q('What is a non-functional requirement?', [
      'A feature users can see, like placing an order',
      'A quality target, like p99 latency under 300 ms',
      'A bug that must be fixed',
      'A database table',
    ], 1, 'Non-functional requirements describe how well the system must perform, not what it does.'),
    q('About how many requests per second is 10 million requests per day?', [
      'About 12',
      'About 115',
      'About 1,000',
      'About 10,000',
    ], 1, 'Dividing by roughly 86,400 seconds gives about 115 per second on average.'),
    q('Which change to an API requires a new version?', [
      'Adding an optional field',
      'Adding a new endpoint',
      'Removing an existing field',
      'Adding an optional query parameter',
    ], 2, 'Removing a field breaks clients that depend on it, so it is a breaking change.'),
    q('How does an idempotency key prevent duplicate orders on retry?', [
      'It blocks all retries from the client app, so duplicates cannot arrive',
      'It makes the network reliable enough that the client stops needing to retry',
      'It speeds up the database',
      'The server returns the original result for a repeated key',
    ], 3, 'Recognised keys replay the first response instead of creating another order.'),
    q('Which store best suits caches, sessions and counters?', [
      'Key-value store',
      'Graph database',
      'Wide-column store',
      'Data warehouse',
    ], 0, 'Simple lookups by key with very low latency are what key-value stores are built for.'),
    q('A large table query shows a sequential scan. What is the likely fix?', [
      'Add more OFFSET',
      'Remove all indexes',
      'Switch the table to a graph database so that scans are avoided',
      'Add an index on the filtered column',
    ], 3, 'Sequential scans on big tables usually mean the filter lacks a suitable index.'),
    q('What is a cache stampede?', [
      'Many simultaneous misses after a hot key expires',
      'A cache running out of disk space and evicting its newest entries',
      'Two caches sharing the same key',
      'A CDN purging all of its content',
    ], 0, 'Expiry of a popular key can flood the database with identical queries at once.'),
    q('Why include a content hash in static asset file names?', [
      'It makes the files smaller to download',
      'Long caching with immediate updates',
      'Browsers require hashed names',
      'It encrypts the files in transit',
    ], 1, 'A new build yields a new name, so old cached versions are never served.'),
    q('What must be true for a service to scale horizontally?', [
      'It runs on one very large server',
      'It keeps sessions in local memory so each instance can answer faster',
      'Any instance can serve any request, with state held elsewhere',
      'It avoids databases',
    ], 2, 'Stateless, interchangeable instances behind a load balancer are the basis of scaling out.'),
    q('What happens when a consumer crashes before acknowledging a message?', [
      'The message is lost forever',
      'The broker redelivers it',
      'The producer is notified to resend',
      'The queue is emptied',
    ], 1, 'Unacknowledged messages return to the queue so work survives failures.'),
    q('What does at-least-once delivery imply for consumers?', [
      'Messages may be lost',
      'Messages arrive in global order',
      'Each message is processed exactly once automatically',
      'Some messages will arrive more than once',
    ], 3, 'Reliable delivery avoids loss at the cost of occasional duplicates, so consumers must be idempotent.'),
    q('A user updates their profile and immediately sees old data. What is the likely cause?', [
      'The read came from a lagging replica',
      'The write was rejected, so the old profile stayed in the database',
      'The cache was too large',
      'The load balancer failed',
    ], 0, 'Asynchronous replication means replicas briefly hold older data than the primary.'),
    q('Why is city a poor shard key for a Pakistan-wide service?', [
      'Cities cannot be hashed, so rows could not be assigned to shards',
      'It has too many values',
      'A few cities carry most traffic, creating hot shards',
      'Cities change names often',
    ], 2, 'Low cardinality with skewed distribution concentrates load on a handful of shards.'),
    q('What does the CAP theorem force a choice between during a partition?', [
      'Speed and cost',
      'Consistency and availability',
      'SQL and NoSQL',
      'Reads and writes',
    ], 1, 'Partition tolerance is mandatory, so the trade-off is consistency versus availability when partitions occur.'),
    q('What is a compensating action in a saga?', [
      'A retry of the failed step, repeated until the service finally recovers',
      'A distributed lock',
      'A step that undoes an earlier completed step',
      'A database backup',
    ], 2, 'Sagas reverse completed steps through explicit compensations instead of rolling back a transaction.'),
    q('What does an open circuit breaker do?', [
      'Sends all calls to the dependency immediately, to find out whether it has recovered',
      'Doubles the timeout',
      'Restarts the dependency',
      'Fails calls fast without contacting the dependency for a cooling period',
    ], 3, 'Open breakers protect callers and give the failing dependency time to recover.'),
    q('Which rate limiting algorithm allows short bursts while enforcing an average?', [
      'Token bucket',
      'Fixed window',
      'Round robin',
      'Sequential scan',
    ], 0, 'Accumulated tokens permit bursts while the refill rate caps the long-term rate.'),
    q('What is an error budget?', [
      'The cost of bug fixes',
      'The amount of failure an SLO allows over its period',
      'The number of servers allowed to fail before an outage is declared',
      'A customer penalty',
    ], 1, 'A 99.9% SLO permits 0.1% failures, which teams can spend on risk and change.'),
    q('In a news feed, how is the celebrity fan-out problem handled?', [
      'Celebrities are blocked from posting',
      'Every follower\'s feed is written synchronously',
      'Their posts are pulled at read time instead of pushed to all followers',
      'Their posts are stored in a separate database and left out of follower feeds',
    ], 2, 'A hybrid pulls high-follower accounts\' posts while pushing for normal accounts.'),
    q('What should follow every technology mentioned in a design interview?', [
      'Its version number',
      'Its price',
      'The requirement that justifies choosing it',
      'A diagram of its internals, drawn on the whiteboard in full detail',
    ], 2, 'Tying choices to requirements is what turns assertions into reasoning.'),
    q('A photo app receives 5 million uploads a day, averaging 2 MB each. Roughly how much new storage does it need per year, before any replication?', [
      'About 3.6 PB',
      'About 365 TB',
      'About 36 PB',
      'About 10 TB',
    ], 0, '5 million × 2 MB is 10 TB a day, and 10 TB × 365 is about 3.65 PB a year.'),
    q('A request from Karachi makes four sequential calls to a service on the US west coast. Using the course\'s round-trip figures, roughly how long do those round trips alone take?', [
      'About 4 milliseconds',
      'About one second',
      'About 100 milliseconds',
      'About 10 seconds',
    ], 1, 'Each round trip is about 200 to 250 ms, so four in sequence cost roughly 0.8 to 1 second before any work is done.'),
    q('A service handles 1,000 requests per second at 50 ms average latency, and each request holds one of 100 pooled database connections. A slow database episode pushes latency to 400 ms at the same throughput. What happens?', [
      'In-flight requests stay at 50, since the throughput has not changed',
      'In-flight requests fall to about 12, since each one now takes longer',
      'It would need about 400 connections at once, four times the pool',
      'In-flight requests settle at exactly 100, which the pool absorbs',
    ], 2, 'Little\'s law gives concurrency as throughput × latency, so 1,000 × 0.4 s is 400 requests in flight, which exhausts a pool of 100 and starts a cascade.'),
    q('An order tracking page only needs the server to push status updates to the browser, and the browser never sends anything back on that channel. Which option fits most simply?', [
      'gRPC streaming straight from the browser',
      'WebSockets with a custom message protocol',
      'Polling the API every 100 milliseconds',
      'Server-Sent Events',
    ], 3, 'Server-Sent Events push updates one way from server to client over plain HTTP, whereas WebSockets are a two-way channel and browsers need a proxy for gRPC.'),
    q('A public GraphQL endpoint lets clients nest relations freely, and one deeply nested query brings the database down. What is missing?', [
      'An HTTP cache in front of the single GraphQL endpoint',
      'Limits on query depth or cost, checked before execution',
      'A switch from JSON to Protocol Buffers for responses',
      'A separate REST endpoint for every nested relation',
    ], 1, 'GraphQL makes it easy to write very expensive queries, so a public endpoint has to bound what a single query may cost before running it.'),
    q('A public, read-heavy product catalogue API wants browsers and CDNs to cache its responses. Which style fits most naturally?', [
      'GraphQL, sending every query as a POST to one endpoint',
      'gRPC, with binary Protocol Buffers over HTTP/2',
      'WebSockets, pushing the catalogue to every client',
      'REST, with GET requests on resource URLs',
    ], 3, 'REST resources map directly onto HTTP caching, while GraphQL\'s single endpoint means HTTP caching does not apply directly.'),
    q('Product search must tolerate typos, rank by relevance and offer facets across millions of products kept in PostgreSQL. What is the usual design?', [
      'A search engine fed from the database, which stays the source of truth',
      'LIKE \'%term%\' queries backed by a B-tree index on the product name',
      'Moving the whole product catalogue into a graph database',
      'Caching every possible search result in Redis ahead of time',
    ], 0, 'Full-text and faceted search is the job of a search engine such as OpenSearch, kept alongside the primary database rather than replacing it.'),
    q('A query filters on `WHERE LOWER(email) = $1` and scans the whole table, although the email column has an index. What fixes it?', [
      'Add more read replicas so that the full scan is shared out',
      'Rebuild the existing index on email every night',
      'Index the expression LOWER(email), or store emails already normalised',
      'Put email first in every composite index on the table, whatever the query',
    ], 2, 'A function applied to an indexed column means the plain index no longer matches, so index the expression itself or normalise the stored value.'),
    q('A wide-column table of sensor readings is partitioned by device_id and clustered by timestamp. Someone asks for every reading above 90°C across all devices last week. What is the problem?', [
      'The query ignores the partition key, so it must scan every partition',
      'Wide-column stores cannot hold numeric values such as temperatures',
      'Clustering by timestamp prevents range queries within one device',
      'Nothing, since all readings sit together on a single node',
    ], 0, 'Wide-column tables are designed around known queries, so a question that does not follow the partition design needs its own table or an analytics store.'),
    q('Product pages are cached under the key `product:{id}`, but prices are shown in each visitor\'s currency. What happens?', [
      'The cache converts each price for every visitor automatically',
      'Visitors may see prices in whichever currency was cached first',
      'Every request misses, since the currency changes the cache key',
      'Nothing goes wrong, because prices are never cached with pages',
    ], 1, 'A cache key must include every input that changes the response, so the currency belongs in the key alongside the product id.'),
    q('A cache\'s hit rate rises from 90% to 99%. What happens to the read load reaching the database?', [
      'It falls by about 9 percent',
      'It falls to about half of what it was',
      'It falls to about a tenth of what it was',
      'It stays the same, since misses still arrive',
    ], 2, 'Misses fall from 10% of requests to 1%, so the database sees one tenth of the reads it saw before.'),
    q('A Redis cache runs at its memory limit, evicts keys constantly, and has a low hit rate even though the same keys are requested again and again. What does that indicate?', [
      'Its keys are expiring too soon after they are written',
      'Its eviction policy should be switched off entirely',
      'Its database is too slow to refill the missed keys',
      'Its memory is too small for the working set of hot keys',
    ], 3, 'Constant eviction under memory pressure means the hot data does not fit, so keys are pushed out before they can be reused.'),
    q('Traffic doubles within a minute at 8 pm every evening, and new instances take about three minutes to become ready. What should the design add?', [
      'A shorter autoscaling interval so the spike is noticed sooner',
      'Scheduled scaling that adds capacity shortly before 8 pm',
      'Faster scale-down once each evening peak has passed',
      'Sticky sessions so that users stay on warm instances',
    ], 1, 'A spike that arrives faster than instances can start is served only by capacity that already exists, so predictable peaks are met with scheduled scaling.'),
    q('Peak traffic is 600 requests per second, and one instance serves 100 at healthy latency. Why run about nine instances instead of six?', [
      'Load balancers need an odd number of instances to work',
      'Each instance is designed to use only two-thirds of its CPU',
      'Nine is the smallest pool that any autoscaler will allow',
      'Six leaves no room for a failed instance, a deploy or a spike',
    ], 3, 'Six instances would run at 100% at peak, so capacity is planned with headroom, typically targeting around 60 to 70% utilisation.'),
    q('A system runs ten app servers behind one self-hosted load balancer. What removes the remaining single point of failure?', [
      'Running the load balancer as a pair with failover',
      'Adding ten more app servers behind the same balancer',
      'Switching the balancer to least-connections routing',
      'Enabling sticky sessions on the load balancer',
    ], 0, 'The balancer is the front door, so self-hosted ones run in pairs with failover, while managed cloud balancers are redundant internally.'),
    q('Events for each order must be processed in order, but different orders should be processed in parallel. How should the stream be keyed?', [
      'By city, so that nearby orders are grouped together',
      'By a random value, so partitions stay perfectly even',
      'By order ID, so each order\'s events share one partition',
      'By event type, so each consumer sees one kind of event',
    ], 2, 'Ordering is guaranteed only within a partition, so keying by order ID keeps each order in sequence while spreading orders across partitions.'),
    q('For which workload is at-most-once delivery a reasonable choice?', [
      'Live-stream comments, where dropping a few during a spike is fine',
      'Payment confirmations that must never be lost, even during a traffic spike',
      'One-time SMS passcodes that users need to log in',
      'Order records that finance reconciles each month',
    ], 0, 'At-most-once can lose messages, so it suits only data where occasional loss is acceptable and speed matters more.'),
    q('A viral post\'s like counter lives on one partition, which now takes most of the cluster\'s writes. What is the standard remedy?', [
      'Add read replicas to the partition that holds the counter',
      'Split the key with a random suffix across partitions and sum on read',
      'Raise the counter\'s TTL so that it is written less often',
      'Move the counter next to the post\'s comments on one partition, to keep them together',
    ], 1, 'Appending a random suffix spreads one logical key across several partitions, and reads merge the pieces, which suits counters and append-heavy data.'),
    q('Logs are sharded by the hour in which they were written. What goes wrong as traffic grows?', [
      'Old shards fill up faster than the newest one, which sits almost empty',
      'Queries for a single hour must visit every shard',
      'Every current write lands on the shard holding the current hour',
      'Hourly keys collide once the date rolls over',
    ], 2, 'A time-based key puts all of now\'s writes on one shard, so the key should be hashed or combined with another dimension.'),
    q('A user reloads a thread and sees a new comment, reloads again and it has vanished, then it reappears. Reads go to replicas with different lag. Which guarantee is being violated, and what fixes it?', [
      'Causal consistency; add a quorum of five replicas',
      'Read-your-writes; send every write to the replicas',
      'Durability; fsync every write before acknowledging',
      'Monotonic reads; keep the session on one replica',
    ], 3, 'Monotonic reads promise a client never sees data go backwards in time, which a sticky replica per session provides.'),
    q('An order flow spans seven services that react to each other\'s events, and nobody can tell where a stuck order is. Which saga style addresses that?', [
      'Choreography, with more event types for each of the steps',
      'Orchestration, with a coordinator that holds the flow\'s state',
      'Two-phase commit across all seven of the service databases',
      'Eventual consistency, with longer windows between retries',
    ], 1, 'In choreography the overall flow is invisible, while an orchestrator makes it explicit, testable and easy to inspect.'),
    q('Three layers of services each make up to 3 attempts on a failed call. The bottom dependency fails every request. How many calls reach it for one user request?', [
      '9 calls',
      '3 calls',
      '12 calls',
      '27 calls',
    ], 3, 'Attempts multiply across layers, 3 × 3 × 3 = 27, which is why retries should happen at one layer rather than at every layer.'),
    q('A request path depends on five services, each 99.9% available and failing independently. Roughly what is the availability of the whole path?', [
      'About 99.5%',
      'About 99.9%',
      'About 99.99%',
      'About 95%',
    ], 0, 'Availabilities in series multiply, and 0.999 to the fifth power is about 0.995, lower than any single service.'),
    q('A food delivery platform nears capacity during a flash promotion. Which traffic should be shed first?', [
      'Order placement and payment callbacks',
      'Order tracking for orders already placed',
      'Recommendations and analytics events',
      'Menu browsing by customers in the app',
    ], 2, 'Load shedding drops the lowest-priority work first, keeping orders and payments served while recommendations and analytics can wait.'),
    q('Which is the best SLI for a checkout journey?', [
      'Share of checkout requests succeeding within 300 ms, measured at the edge',
      'Average CPU utilisation across all of the checkout servers during the busiest hour',
      'Number of checkout deployments that completed each week',
      'Mean query time on the orders table in the database',
    ], 0, 'An SLI should measure what users experience, as close to them as possible, and users do not experience CPU or query times directly.'),
    q('A service handles 50 million requests a month against a 99.95% success SLO. How many failed requests does the monthly error budget allow?', [
      '50,000',
      '25,000',
      '2,500',
      '250,000',
    ], 1, 'The budget is the 0.05% that may fail, and 0.0005 × 50 million is 25,000 requests.'),
    q('A phone loses signal without ever closing its chat connection. How does the system eventually show that user as offline?', [
      'The server polls every client\'s phone directly once a minute',
      'The connection always sends a close frame when signal is lost, and the server sees it',
      'Heartbeats refresh a presence key with a short expiry, which lapses',
      'Other users\' clients report the user offline to the server',
    ], 2, 'Presence is kept alive by heartbeats and stored with a short expiry, so when heartbeats stop the key expires and the user shows as offline.'),
    q('Two duplicate "complete trip" requests arrive for the same trip at almost the same moment. What stops a conflicting double transition?', [
      'Handling the requests in the order the load balancer got them',
      'Caching the trip status and checking the cache before updating',
      'Retrying both requests until one of them finally times out',
      'Updating only WHERE status is the expected previous value',
    ], 3, 'A status change guarded by the current state succeeds once, and the duplicate finds the status already changed and updates nothing.'),
    q('In a ride-hailing design interview, which deep dive best shows judgement?', [
      'The login form and password reset emails',
      'The live location index and driver matching',
      'The CSS layout of the rider app\'s screens',
      'The choice of logging library for services',
    ], 1, 'Deep dives should go to the hardest problem specific to the system, and for ride-hailing that is locating nearby drivers and matching them.'),
    q('What belongs in the last few minutes of a system design interview?', [
      'A new component that was never discussed, to show extra breadth',
      'A switch to a different architecture that you now happen to prefer over the first',
      'Silence, so that the interviewer can decide on the next topic',
      'A summary, the key trade-offs, the main risks and next improvements',
    ], 3, 'The wrap-up summarises the design, restates its trade-offs and names its risks and what you would improve with more time.'),
  ],
});
