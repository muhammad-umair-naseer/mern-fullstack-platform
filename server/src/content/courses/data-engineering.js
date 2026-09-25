import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'data-engineering',
  title: 'Data Engineering',
  category: 'Data',
  level: 'Intermediate',
  duration: '7 weeks',
  accent: 'violet',
  coverKey: 'data-engineering',
  summary:
    'Build reliable data pipelines from source to dashboard: SQL and Python for data work, batch and streaming ingestion, warehouses and lakehouses, dbt transformations, Airflow orchestration, data quality, and the practices that keep pipelines trustworthy in production.',
  description:
    'You start with what data engineers do and how modern data platforms are shaped, then sharpen the SQL and Python skills pipelines depend on. You learn to model data for analytics with star schemas and slowly changing dimensions, ingest data in batches and streams from databases, APIs and event sources, and store it in warehouses and lakehouses using columnar formats. You transform data with dbt, orchestrate pipelines with Airflow, and make them trustworthy with testing, data quality checks and observability. The course finishes with performance and cost tuning, governance and security, a complete end-to-end project, and guidance on data engineering careers.',
  chapters: [
    chapter(
      'The Data Engineering Landscape',
      'Understand what data engineers actually build, how the pieces of a modern data platform fit together, when batch and streaming each make sense, and how to choose tools based on needs rather than fashion.',
      [
      lesson('What Data Engineers Do', 13, `
Every dashboard, report, machine learning model and "data-driven decision" depends on data that has been collected, cleaned, combined and delivered reliably. Data engineers build and run the systems that do this. It is one of the fastest-growing technical roles, and one of the least visible when it works well.

### A day at a Pakistani fintech

Consider a digital wallet company in Karachi. Transactions land in a production database; app events stream from millions of phones; customer support uses a SaaS tool; marketing runs campaigns through another. The analytics team needs one place to answer questions like "how many new users transacted within a week of signing up, by city?" Nobody can answer it by looking at any one system.

The data engineer's job is to make that question answerable:

\`\`\`text
1. Extract transactions, events, support tickets and campaign data
2. Land them in a central store
3. Clean, standardise and combine them into well-modelled tables
4. Schedule this to run reliably every hour or every day
5. Monitor it so broken data is caught before the CFO sees it
6. Serve it to dashboards, analysts and models
\`\`\`

### The responsibilities

| Responsibility | What it involves |
|---|---|
| Ingestion | Moving data from sources into the platform, in batches or streams |
| Storage | Choosing and managing warehouses, lakes and formats |
| Transformation | Turning raw data into clean, modelled, trustworthy tables |
| Orchestration | Scheduling and coordinating pipelines with dependencies |
| Quality | Testing data, detecting anomalies, handling failures |
| Performance and cost | Making pipelines fast and affordable |
| Governance | Access control, privacy, lineage, documentation |
| Serving | Delivering data to BI tools, applications and ML |

### How it differs from neighbouring roles

| Role | Focus |
|---|---|
| Data analyst | Answers business questions using the data; SQL and BI tools |
| Data scientist | Builds models and statistical analyses on the data |
| Analytics engineer | Transforms and models data for analysts, usually with dbt |
| Data engineer | Builds the pipelines and platform everyone else relies on |
| ML engineer | Puts models into production, often on data engineers' pipelines |
| Platform or DevOps engineer | Runs the infrastructure beneath all of it |

Boundaries blur in small teams; a data engineer at a startup may do all of these. In large organisations they specialise.

### The skills that matter

- **SQL**, deeply: window functions, joins at scale, query plans.
- **Python**, for pipelines, APIs and glue code.
- **Data modelling**, so tables make sense to the people who use them.
- **Distributed systems basics**, because data outgrows one machine.
- **Cloud platforms**, where most modern data platforms live.
- **Software engineering discipline**: version control, testing, CI/CD, code review.
- **Communication**, since data engineers sit between source system owners and data consumers.

### Why the role has grown

Companies collect far more data than a decade ago, cloud warehouses made storing and querying it affordable, and decisions increasingly depend on it. Every one of those trends needs reliable pipelines. In Pakistan, banks, telecoms, e-commerce companies, fintechs and software houses serving foreign clients all hire data engineers, and remote roles abroad are common for those with solid skills.

### What good looks like

A good data platform is boring in the best way: data arrives on time, numbers match across reports, failures are caught automatically, and adding a new source takes days rather than months. Everything in this course serves that goal.
      `,
        [
          q('What is the core job of a data engineer?', [
            'Building dashboards for executives to read',
            'Building systems that deliver data reliably',
            'Training machine learning models on data',
            'Managing the company\'s public website',
          ], 1, 'Data engineers build the pipelines and platform that analysts, scientists and applications depend on.'),
          q('Which role typically focuses on transforming and modelling data for analysts using dbt?', [
            'Data scientist',
            'ML engineer',
            'Analytics engineer',
            'DevOps engineer',
          ], 2, 'Analytics engineers sit between raw pipelines and analysts, modelling data for use.'),
          q('What does a good data platform look like in practice?', [
            'Constant urgent fixes that show the team\'s importance',
            'Every report showing slightly different numbers',
            'New sources taking months to add',
            'Data arriving on time with failures caught automatically',
          ], 3, 'Reliability and consistency, not heroics, are the marks of a well-built platform.'),
        ]
      ),
      lesson('The Modern Data Platform', 13, `
Data platforms used to be a single expensive warehouse fed by a single ETL tool. Today they are assembled from specialised, mostly cloud-based components. Understanding the standard shape, and the role of each layer, makes every later chapter fit into a picture.

### The layers

\`\`\`text
Sources        production databases, app events, SaaS tools, files, APIs
     |
Ingestion      connectors and pipelines that extract and land raw data
     |
Storage        cloud warehouse and/or data lake (lakehouse)
     |
Transformation cleaning and modelling, usually SQL with dbt
     |
Orchestration  scheduling and dependencies, such as Airflow
     |
Serving        BI dashboards, notebooks, reverse ETL, ML features, APIs
     |
Across all:    quality checks, observability, catalogue, access control
\`\`\`

### Each layer in brief

| Layer | Typical tools | Purpose |
|---|---|---|
| Ingestion | Fivetran, Airbyte, custom Python, Kafka Connect, Debezium | Get data in, reliably and repeatedly |
| Storage | Snowflake, BigQuery, Redshift, Databricks; S3 or GCS with Parquet and Iceberg | Hold raw and modelled data at scale |
| Transformation | dbt, SQL, Spark | Produce clean, documented tables |
| Orchestration | Airflow, Dagster, Prefect | Run pipelines in order, on schedule, with retries |
| Serving | Power BI, Looker, Tableau, Metabase; feature stores; APIs | Make data usable |
| Quality and observability | dbt tests, Great Expectations, Monte Carlo, custom checks | Catch bad data early |
| Catalogue and governance | DataHub, OpenMetadata, warehouse-native features | Find, understand and control data |

Tool names change every few years; the layers do not.

### ETL versus ELT

Traditional ETL transformed data before loading it into the warehouse, because warehouses were expensive and slow. Cloud warehouses changed the economics: it is now cheaper and simpler to load raw data first and transform it inside the warehouse with SQL. This ELT pattern is the default for modern platforms and is why dbt became central. Chapter 6 develops it fully.

### Raw, staged, modelled

Most platforms organise data in layers of increasing refinement:

\`\`\`text
raw       exact copies of source data, never edited, kept for reprocessing
staging   light cleaning: types, names, deduplication, one model per source table
marts     business-ready tables: facts and dimensions, metrics, wide tables
\`\`\`

Keeping raw data untouched means any transformation mistake can be fixed and re-run from the original. This is one of the most important habits in the field.

### A small platform versus a large one

A startup's platform might be Airbyte loading into BigQuery, dbt transforming, dbt Cloud or a simple scheduler running it, and Metabase on top. A bank's platform adds streaming, a lakehouse for petabytes of history, strict access controls, a catalogue and dedicated teams per layer. The architecture is the same shape; the scale and rigour differ.

### Where the work concentrates

Beginners expect the hard part to be the tools. In practice, most effort goes into understanding messy source data, agreeing definitions with the business ("what counts as an active user?"), handling changes in sources, and keeping everything running. Tools help; judgement and communication decide.

### Build for change

Sources add columns, SaaS tools change their APIs, business definitions evolve, volumes grow. A platform designed as loosely coupled layers, with raw data preserved and transformations in version-controlled code, absorbs change. One built as a tangle of one-off scripts does not. The rest of this course teaches the first kind.
      `,
        [
          q('What is the key difference between ETL and ELT?', [
            'ELT loads raw data first and transforms inside the warehouse',
            'ELT does not transform data at all',
            'ETL only works with streaming data',
            'ELT requires no SQL',
          ], 0, 'Cheap, powerful cloud warehouses made transforming after loading the simpler, dominant pattern.'),
          q('Why keep raw source data untouched?', [
            'Raw data is faster to query',
            'Warehouses cannot modify raw tables',
            'Any transformation mistake can be fixed and re-run from the original',
            'Analysts prefer raw data',
          ], 2, 'Preserving raw copies makes every downstream layer reproducible and recoverable.'),
          q('Where does most data engineering effort typically go?', [
            'Choosing the newest tools on the market',
            'Writing the ingestion connectors from scratch',
            'Understanding sources and keeping pipelines running',
            'Designing dashboards for business teams',
          ], 2, 'Judgement about data and communication with stakeholders dominate the real work.'),
        ]
      ),
      lesson('Batch, Streaming and the Lambda Question', 13, `
Data can be processed in scheduled batches or continuously as it arrives. Each approach suits different needs and costs different amounts. Most platforms are mostly batch with streaming where it earns its place, and knowing the trade-offs prevents both over-building and under-delivering.

### Batch processing

Data is collected over a period and processed together, on a schedule:

\`\`\`text
Every hour:  extract new orders since the last run -> load -> transform
Every night: rebuild the customer dimension, compute daily metrics
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Simple to build, test and reason about | Data is as old as the batch interval |
| Efficient: large chunks processed together | Late-arriving data needs reprocessing |
| Easy to re-run and backfill | Not suitable for real-time needs |
| Mature tooling | Peaks of load at batch time |

For daily reporting, finance, most dashboards and model training, batch is entirely sufficient and far cheaper to operate.

### Stream processing

Events are processed one at a time or in tiny windows, seconds after they occur:

\`\`\`text
Transaction event -> stream processor -> fraud score within 200 ms
App click events  -> aggregated per minute -> live operations dashboard
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Low latency: seconds, not hours | More complex: ordering, late events, state, exactly-once |
| Continuous, no batch peaks | Harder to test and debug |
| Enables real-time actions | Always-on infrastructure to run |

Streaming is justified when a decision must happen within seconds: fraud detection, live inventory, alerting, personalisation in the moment.

### Micro-batching

A middle path runs small batches frequently, every minute or every few minutes. Many "real-time" dashboards are fed this way. It keeps batch simplicity with near-real-time freshness, and it is often the right compromise.

### The latency question

The first question to ask a stakeholder who wants "real-time" data: what decision would you make differently with data that is one minute old versus one hour old? Often the honest answer is none, and an hourly batch meets the need at a fraction of the cost. Occasionally the answer is "block the fraudulent transaction", and streaming is essential.

| Need | Freshness | Approach |
|---|---|---|
| Monthly finance close | Daily | Batch |
| Executive dashboard | Hourly | Batch |
| Operations monitoring | Minutes | Micro-batch |
| Fraud blocking | Sub-second | Streaming |
| Live delivery tracking | Seconds | Streaming |

### The Lambda and Kappa architectures

The Lambda architecture ran a batch layer for accurate historical results and a streaming layer for fast approximate results, merging both at query time. It worked but meant maintaining two implementations of every transformation. The Kappa architecture proposed doing everything as streams, replaying the stream to recompute history. Modern platforms often land somewhere pragmatic: streaming ingestion into a lakehouse, batch transformations in SQL on top, and true stream processing only for the few use cases that need it.

### Cost of streaming

Streaming systems run all the time, need careful handling of state and failures, and require skills fewer engineers have. A team should have a clear, valuable use case before building one. Chapter 8 covers streaming in depth for when that case exists.

### Design for both

Ingesting events through a stream, even when downstream processing is batch, keeps options open: the same events can feed a real-time consumer later without changing sources. Event streams as the ingestion backbone, with batch and streaming consumers as needed, is a common and flexible shape.
      `,
        [
          q('Which need genuinely requires stream processing?', [
            'A monthly finance report',
            'A daily executive dashboard',
            'Blocking a fraudulent transaction as it happens',
            'Training a model each week',
          ], 2, 'Decisions that must occur within seconds cannot wait for a batch.'),
          q('What is micro-batching?', [
            'Processing one event at a time',
            'Running small batches every minute or few minutes',
            'Batching once per month',
            'Deleting small files',
          ], 1, 'Frequent small batches keep batch simplicity with near-real-time freshness.'),
          q('What was the main drawback of the Lambda architecture?', [
            'It could not handle historical data',
            'It required no streaming',
            'It was too cheap to justify',
            'Every transformation had to be maintained twice, for batch and stream',
          ], 3, 'Duplicate logic in two layers doubled maintenance and drift risk.'),
        ]
      ),
      lesson('Choosing Tools Without Chasing Trends', 12, `
The data tooling market produces new products constantly, each promising to solve everything. Teams that chase every trend end up with fragmented, half-adopted platforms. Teams that never change fall behind. A method for evaluating tools against real needs keeps a platform coherent and current.

### Start from requirements, not tools

Before evaluating anything, write down:

\`\`\`text
- Sources: how many, what kinds, how they change
- Volumes: rows per day, growth expected
- Freshness: hourly, daily, real-time, per use case
- Consumers: analysts, dashboards, ML, applications
- Team: size, skills, time available to operate tools
- Constraints: budget, compliance, existing cloud
\`\`\`

A tool that is perfect for a 50-person data team is often wrong for a team of two.

### Managed versus self-hosted

| Managed (SaaS or cloud service) | Self-hosted (open source) |
|---|---|
| Fast to start; vendor operates it | Full control; no per-seat or usage fees |
| Predictable operations; less expertise needed | Requires people to run, upgrade and secure it |
| Costs scale with usage, sometimes steeply | Costs are engineering time and infrastructure |
| Vendor lock-in and pricing changes are risks | Open formats and code reduce lock-in |

Small teams usually benefit from managed services for the core: warehouse, ingestion and orchestration. Larger teams with platform engineers may self-host to control cost and customise.

### Evaluation criteria

| Criterion | Questions |
|---|---|
| Fit | Does it solve our actual problem well, not just impressively? |
| Maturity | Is it stable, widely used, actively maintained? |
| Ecosystem | Does it integrate with our warehouse, orchestrator and catalogue? |
| Operability | Can our team run it? What breaks, and how is it fixed? |
| Cost | Total cost at our scale in two years, including people |
| Exit | Can we leave? Are formats and code portable? |
| Community | Documentation, answers to questions, hiring pool |

### Prefer boring, proven cores

The warehouse, orchestrator and transformation tool are the platform's foundation and should be stable, widely adopted choices. Experiment at the edges: a new quality tool, a new connector, a new BI layer. Replacing a core component is a multi-month migration; replacing an edge tool is a week.

### Open formats reduce lock-in

Storing data in open columnar formats (Parquet) and open table formats (Iceberg, Delta Lake, Hudi) on object storage means several engines can read the same data, and switching vendors does not require moving petabytes. Chapter 5 covers these. Keeping transformations in SQL and version-controlled code has the same benefit.

### Run a small pilot

Before committing, run a two-week pilot on a real slice of work: one source, one set of models, one dashboard. Measure setup time, how often it broke, what the team thought, and projected cost. Pilots reveal operational reality that demos and vendor benchmarks hide.

### Consolidate periodically

Every year or two, review the tool inventory. Retire tools with overlapping purposes, unused features and low adoption. A platform with six tools well understood beats one with fifteen partly understood.

### Local relevance

For teams in Pakistan, consider data residency requirements for regulated sectors, currency and payment practicalities for SaaS subscriptions, and the availability of local expertise for hiring. Open-source cores with cloud storage are popular partly because they balance capability with cost and control.
      `,
        [
          q('What should come before evaluating any data tool?', [
            'Reading the vendor\'s published benchmarks',
            'Writing down requirements and constraints',
            'Choosing the most popular tool available',
            'Attending a data engineering conference',
          ], 1, 'Requirements define fit; without them, evaluation becomes a popularity contest.'),
          q('Why prefer stable, proven tools for the platform\'s core?', [
            'New tools are always worse',
            'Core tools never need updating',
            'Replacing a core component is a long, costly migration',
            'Vendors require it',
          ], 2, 'Foundations are expensive to change, so experimentation belongs at the edges.'),
          q('How do open formats reduce vendor lock-in?', [
            'They make the stored data much smaller',
            'They are always free of charge to use',
            'They prevent vendors from reading the data',
            'Several engines can read the same files',
          ], 3, 'Open columnar and table formats on object storage keep data portable across tools.'),
        ]
      ),
      ],
      [
      q('Which layer of a data platform schedules pipelines and manages dependencies?', [
        'Storage',
        'Serving',
        'Orchestration',
        'Ingestion',
      ], 2, 'Orchestrators such as Airflow run pipelines in order, on schedule, with retries.'),
      q('In the raw, staging, marts structure, where do business-ready fact and dimension tables live?', [
        'Raw',
        'Staging',
        'Marts',
        'Sources',
      ], 2, 'Marts hold modelled, business-facing tables built from cleaned staging data.'),
      q('A stakeholder asks for real-time data. What is the best first question?', [
        'What decision would change with data one minute old versus one hour old?',
        'Which streaming tool do you prefer?',
        'How much budget do you have?',
        'Can you wait until next quarter?',
      ], 0, 'Clarifying the decision reveals the true freshness need and often avoids costly streaming.'),
      q('Why run a pilot before adopting a tool?', [
        'Vendors require a pilot before purchase',
        'Pilots cost nothing to run',
        'To delay the decision by a few weeks',
        'To see operational reality that demos hide',
      ], 3, 'A short real trial reveals setup effort, failures and cost at your scale.'),
      ]
    ),
    chapter(
      'SQL and Python for Data Work',
      'Write analytical SQL with joins, window functions and CTEs, use Python and dataframe libraries for pipeline work, read from files, APIs and databases reliably, and structure data code so it can be tested.',
      [
      lesson('Analytical SQL: Joins, Windows and CTEs', 14, `
SQL is the language of data engineering. Transformations, quality checks, ad-hoc investigation and most dbt models are SQL. Beyond basic SELECT statements, analytical work depends on joins across large tables, window functions and readable query structure. These are the constructs you will write every day.

### Joins with intent

| Join | Returns | Typical use |
|---|---|---|
| INNER | Rows matching in both tables | Orders with their customers |
| LEFT | All left rows, matched right rows or NULL | All customers, with orders if any |
| FULL OUTER | All rows from both | Reconciling two sources |
| CROSS | Every combination | Generating date-by-product grids |
| ANTI (via LEFT and IS NULL, or NOT EXISTS) | Left rows with no match | Customers who never ordered |

Joins on large tables are where queries slow down. Join on keys that are indexed or clustered, filter before joining where possible, and be alert to fan-out: joining orders to order items multiplies order rows, so summing order totals afterwards double-counts.

\`\`\`sql
-- Wrong: total is repeated per item and summed several times
SELECT o.id, SUM(o.total)
FROM orders o JOIN order_items i ON i.order_id = o.id
GROUP BY o.id;
\`\`\`

Aggregate the many side first, then join.

### Common table expressions

CTEs name intermediate results and make queries readable top to bottom:

\`\`\`sql
WITH daily_orders AS (
    SELECT customer_id, DATE(placed_at) AS day, SUM(total) AS spend
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_id, DATE(placed_at)
),
customer_days AS (
    SELECT customer_id, COUNT(*) AS active_days, SUM(spend) AS total_spend
    FROM daily_orders
    GROUP BY customer_id
)
SELECT c.city, AVG(cd.active_days) AS avg_active_days
FROM customer_days cd
JOIN customers c ON c.id = cd.customer_id
GROUP BY c.city;
\`\`\`

Each CTE does one thing. This is the style dbt models use, and it makes reviewing and debugging far easier than nested subqueries.

### Window functions

Window functions compute values across related rows without collapsing them:

\`\`\`sql
SELECT
    customer_id,
    placed_at,
    total,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY placed_at) AS order_seq,
    SUM(total)    OVER (PARTITION BY customer_id ORDER BY placed_at) AS running_spend,
    LAG(placed_at) OVER (PARTITION BY customer_id ORDER BY placed_at) AS previous_order_at
FROM orders;
\`\`\`

| Function | Use |
|---|---|
| ROW_NUMBER, RANK, DENSE_RANK | Ordering within groups; deduplication |
| LAG, LEAD | Comparing with previous or next rows |
| SUM, AVG, COUNT OVER | Running and moving aggregates |
| FIRST_VALUE, LAST_VALUE | Latest value per group |

Deduplicating the latest record per key is a daily task:

\`\`\`sql
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) AS rn
    FROM customer_updates
)
SELECT * FROM ranked WHERE rn = 1;
\`\`\`

### Aggregation pitfalls

- \`COUNT(*)\` counts rows; \`COUNT(column)\` ignores NULLs; \`COUNT(DISTINCT column)\` counts unique values.
- NULLs are excluded from \`AVG\` and \`SUM\`, which can silently skew results.
- \`GROUP BY\` with mixed granularity, such as daily rows joined to monthly targets, needs care to avoid multiplying values.

### Dates and time zones

Store timestamps in UTC and convert for display. A "daily" aggregate for Pakistani users should group by the date in Asia/Karachi, not UTC, or evening orders land on the wrong day. Most warehouses provide conversion functions; apply them explicitly and consistently.

### Reading query plans

\`EXPLAIN\` shows how the engine will execute a query: scans, joins, shuffles. In warehouses, watch for full scans of huge tables where a partition filter would help, and for joins that shuffle enormous amounts of data. Chapter 10 returns to performance in depth; the habit of checking plans starts now.
      `,
        [
          q('Joining orders to order items and then summing order totals produces inflated results. Why?', [
            'Each order\'s total is repeated once per item and summed multiple times',
            'Order totals are stored as text',
            'LEFT joins always duplicate rows',
            'SUM ignores joined tables',
          ], 0, 'Fan-out from a one-to-many join multiplies the one side\'s values; aggregate the many side first.'),
          q('Which window function returns the previous row\'s value within a partition?', [
            'ROW_NUMBER',
            'FIRST_VALUE',
            'LAG',
            'RANK',
          ], 2, 'LAG looks back to an earlier row in the ordered partition.'),
          q('Why group daily metrics for Pakistani users by the local date rather than UTC?', [
            'UTC dates cannot be stored',
            'Warehouses require local time',
            'Evening orders would otherwise be counted on the wrong day',
            'Local dates use less storage',
          ], 2, 'Pakistan is five hours ahead of UTC, so late-evening activity crosses the UTC date boundary.'),
        ]
      ),
      lesson('Python for Pipelines: pandas, Polars and Beyond', 13, `
SQL handles transformation inside the warehouse, but pipelines also need code to call APIs, parse files, orchestrate steps and handle logic SQL expresses poorly. Python is the standard choice, with dataframe libraries for tabular work. Knowing what each tool is good for, and its limits, keeps pipelines fast and maintainable.

### Where Python fits

\`\`\`text
Extraction:      calling APIs, reading files, connecting to databases
Light transform: parsing, validation, reshaping before loading
Orchestration:   Airflow DAGs are Python
Glue:            moving data between systems, retries, logging
Not usually:     heavy joins and aggregations over large tables (use the warehouse)
\`\`\`

A common mistake is pulling millions of rows into Python to aggregate them when the warehouse would do it in seconds. Push heavy computation to where the data lives.

### pandas

pandas is the most widely known dataframe library:

\`\`\`python
import pandas as pd

orders = pd.read_csv("orders.csv", parse_dates=["placed_at"])
orders["day"] = orders["placed_at"].dt.date
daily = (
    orders[orders["status"] == "completed"]
    .groupby(["customer_id", "day"], as_index=False)["total"]
    .sum()
)
\`\`\`

It is convenient and has a huge ecosystem, but it is single-threaded, holds everything in memory, and its type handling (such as integers becoming floats when NULLs appear) causes subtle bugs.

### Polars

Polars is a newer library designed for speed and correctness: multi-threaded, strict types, and a lazy mode that optimises a whole query before running it:

\`\`\`python
import polars as pl

daily = (
    pl.scan_csv("orders.csv")
    .filter(pl.col("status") == "completed")
    .with_columns(pl.col("placed_at").str.to_datetime().dt.date().alias("day"))
    .group_by(["customer_id", "day"])
    .agg(pl.col("total").sum())
    .collect()
)
\`\`\`

For pipeline code processing files of hundreds of megabytes to tens of gigabytes on one machine, Polars is often several times faster than pandas and uses less memory. Its expression style resembles SQL, which suits data engineers.

### DuckDB: SQL on files

DuckDB runs SQL directly on local files and dataframes, in-process, with no server:

\`\`\`python
import duckdb
result = duckdb.sql("""
    SELECT customer_id, DATE(placed_at) AS day, SUM(total)
    FROM 'orders.parquet'
    WHERE status = 'completed'
    GROUP BY 1, 2
""").pl()
\`\`\`

It is excellent for local transformation, testing SQL logic on samples and processing Parquet files without a warehouse.

### Beyond one machine

When data exceeds one machine's memory, distributed engines take over: Spark for large-scale processing (chapter 10), or simply the cloud warehouse. Many pipelines never need this; a single machine with Polars or DuckDB handles surprisingly large workloads.

### Writing robust pipeline Python

| Practice | Why |
|---|---|
| Explicit schemas and types | Prevent silent type drift |
| Structured logging with context | Debug failures in scheduled runs |
| Retries with backoff for network calls | Transient failures are normal |
| Idempotent writes | Re-runs must not duplicate data |
| Configuration from environment, not code | Same code across environments |
| Virtual environments and pinned dependencies | Reproducible runs |

### Type hints and dataclasses

Type hints and small typed structures make pipeline code self-documenting and catch errors early with tools like mypy:

\`\`\`python
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True)
class Order:
    id: str
    customer_id: str
    total_paisa: int
    placed_at: datetime
\`\`\`

Representing money as integer minor units (paisa) avoids floating-point errors, a habit shared with application engineering.
      `,
        [
          q('When should heavy aggregation be done in the warehouse rather than in Python?', [
            'Never, because Python is always faster',
            'When the data is large',
            'Only when the source is CSV files',
            'Only when pandas is not installed',
          ], 1, 'Pulling large data into Python is slow and memory-bound; warehouses aggregate at scale efficiently.'),
          q('What is a known weakness of pandas for pipeline code?', [
            'Single-threaded processing with loose types',
            'It cannot read CSV files at all',
            'It requires a cluster to run',
            'It has almost no ecosystem',
          ], 0, 'pandas is convenient but struggles with large data and can silently change types.'),
          q('What does DuckDB let you do?', [
            'Replace Airflow as the orchestrator',
            'Run a distributed cluster of workers',
            'Send emails from inside pipelines',
            'Run SQL on local files without a server',
          ], 3, 'DuckDB is an in-process analytical engine, ideal for local transformation and testing.'),
        ]
      ),
      lesson('Working With Files, APIs and Databases', 13, `
Every pipeline begins by reading data from somewhere: files dropped in storage, APIs of SaaS tools, or production databases. Each source has its own failure modes. Handling them carefully at the edge keeps everything downstream clean.

### Files

Files arrive as CSV, JSON, Excel exports, logs and increasingly Parquet:

| Format | Notes |
|---|---|
| CSV | Universal but fragile: encodings, delimiters, quoted commas, no types |
| JSON and JSON Lines | Nested data; JSON Lines (one object per line) streams well |
| Excel | Common in business; merged cells and multiple sheets need care |
| Parquet | Columnar, typed, compressed; the standard for analytical files |

Read CSVs with explicit encoding (UTF-8, or the source's actual encoding), explicit column types and a strict mode that fails on malformed rows rather than silently skipping them. Convert to Parquet early; downstream steps become faster and typed.

Landing files in cloud object storage with a consistent path scheme is standard:

\`\`\`text
s3://company-data/raw/sales_system/orders/dt=2025-03-15/part-0001.parquet
\`\`\`

The \`dt=\` partition folder lets engines read only the days they need.

### APIs

SaaS tools expose data through REST APIs, which bring their own concerns:

\`\`\`python
import time, requests

def fetch_page(url, params, token):
    for attempt in range(5):
        r = requests.get(url, params=params,
                         headers={"Authorization": f"Bearer {token}"}, timeout=30)
        if r.status_code == 429:
            time.sleep(int(r.headers.get("Retry-After", 2 ** attempt)))
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("gave up after retries")
\`\`\`

| Concern | Handling |
|---|---|
| Pagination | Follow cursors or page numbers until exhausted |
| Rate limits | Respect 429 responses and Retry-After headers |
| Authentication | Tokens from a secret store, refreshed when they expire |
| Timeouts and retries | Always set timeouts; retry transient failures with backoff |
| Schema changes | Store raw responses; parse defensively |
| Incremental pulls | Use "updated since" parameters where available |

Save raw API responses as they arrive before parsing. When the API changes shape, the raw data is still there to reprocess.

### Databases

Reading from production databases needs care, because a heavy query can slow the application customers use:

- Read from a replica, never the primary, where one exists.
- Pull incrementally using an \`updated_at\` column or a change log, rather than full table scans.
- Run during quiet hours for large extracts.
- Use server-side cursors or chunked reads for large results rather than loading everything into memory.
- Agree with the application team on what you read and when.

Chapter 4 covers change data capture, which reads the database's change log instead of querying tables, avoiding load entirely.

### Connections and secrets

Database passwords and API keys come from a secret manager or environment variables, never from code or repositories. Connection pooling and explicit closing prevent leaked connections. Use read-only credentials for extraction.

### Handling bad records

Decide per source what happens to rows that fail parsing: reject the whole batch (safest for financial data), quarantine bad rows to a separate location with the error, or skip with a logged count. Never silently drop; a pipeline that quietly loses 2% of orders is worse than one that fails loudly.

### Schema evolution

Sources add and rename columns without warning. Compare incoming schemas with expected ones on each run, allow safe additions, and alert on removals or type changes. Chapter 9 formalises this into data contracts.
      `,
        [
          q('Why convert CSV files to Parquet early in a pipeline?', [
            'Parquet is human-readable',
            'Parquet is typed, compressed and columnar, making later steps faster and safer',
            'CSV cannot be stored in the cloud',
            'Parquet files are always smaller than one kilobyte',
          ], 1, 'Columnar, typed storage removes CSV fragility and speeds analytical reads.'),
          q('How should an API\'s 429 response be handled?', [
            'Retry immediately in a tight loop',
            'Treat it as success',
            'Wait as indicated by Retry-After or backoff, then retry',
            'Abort the pipeline permanently',
          ], 2, '429 means rate limited; respecting the wait keeps the integration healthy.'),
          q('Why read from a database replica rather than the primary?', [
            'Replicas have more data',
            'Primaries cannot be queried',
            'Heavy extraction queries would slow the production application',
            'Replicas are always up to date',
          ], 2, 'Extraction load on the primary competes with real users; replicas isolate it.'),
        ]
      ),
      lesson('Writing Testable Data Code', 12, `
Pipeline code that only works when run end to end against production is impossible to change safely. Structuring code so that transformations can be tested in isolation, with small known inputs, turns pipeline changes from risky to routine. The techniques are ordinary software engineering, applied to data.

### Separate extraction, transformation and loading

\`\`\`python
# Hard to test: everything in one function that hits the API and the warehouse
def sync_orders():
    data = requests.get(API).json()
    df = ...transform...
    warehouse.write(df)

# Testable: pure transformation in the middle
def extract_orders(client) -> list[dict]: ...
def transform_orders(raw: list[dict]) -> pl.DataFrame: ...
def load_orders(df: pl.DataFrame, warehouse) -> None: ...
\`\`\`

\`transform_orders\` takes data in and returns data out, with no network or database access. It can be tested with a handful of hand-written records.

### Unit tests for transformations

\`\`\`python
def test_transform_filters_cancelled_and_converts_paisa():
    raw = [
        {"id": "1", "status": "completed", "total": "1250.50", "placed_at": "2025-03-15T18:30:00Z"},
        {"id": "2", "status": "cancelled", "total": "300.00",  "placed_at": "2025-03-15T19:00:00Z"},
    ]
    df = transform_orders(raw)
    assert df.height == 1
    assert df["total_paisa"][0] == 125050
\`\`\`

Tests like this run in milliseconds, need no credentials, and document the transformation's rules. Test edge cases deliberately: nulls, empty input, duplicates, timezone boundaries, malformed values.

### Fixtures and sample data

Keep small, realistic sample files in the repository: a few rows per source, including known tricky cases. They serve tests, local development and onboarding. Never use real customer data in fixtures; generate or anonymise it.

### Testing SQL

SQL transformations are testable too:

- **dbt tests** (chapter 6) assert properties of results: uniqueness, non-null, accepted values, relationships.
- **Unit-style SQL tests** run a model against tiny input tables and compare with expected output; dbt supports this directly in recent versions.
- **DuckDB** runs warehouse-like SQL locally on sample files, making tests fast and independent of cloud access.

### Integration tests

Some behaviour only appears against real systems: a warehouse's type coercion, an API's pagination quirks. Keep a small number of integration tests that run against a test environment, separate from fast unit tests, and run them in CI on a schedule or before releases.

### Idempotency tests

Because pipelines re-run, test that running a load twice produces the same result as once. This catches duplicate inserts and missing merge keys, which are among the most common data bugs.

### Code structure

\`\`\`text
pipelines/
  orders/
    extract.py
    transform.py
    load.py
    schema.py         expected columns and types
  common/
    http.py           retry-capable client
    warehouse.py      connection and write helpers
tests/
  orders/
    test_transform.py
    fixtures/orders_sample.jsonl
\`\`\`

Shared helpers avoid every pipeline reimplementing retries and logging differently.

### Version control and review

All pipeline code, SQL models and configuration live in Git. Changes go through pull requests with tests running in CI. This gives history ("why did this metric change in March?"), review and a safe path to roll back. Treating data code as software is the single practice that most separates reliable data teams from firefighting ones.

### Linting and formatting

Tools such as ruff for Python and sqlfluff for SQL enforce consistent style automatically, so reviews focus on logic. Consistent formatting matters more in data code than most, because SQL models are read by many people who did not write them.
      `,
        [
          q('Why separate transformation from extraction and loading?', [
            'Pure transformations can be tested with small inputs',
            'It makes the whole pipeline run slower',
            'Extraction cannot be written in Python',
            'Loading must always happen before transformation',
          ], 0, 'Isolating logic from I/O makes fast, reliable unit tests possible.'),
          q('What should an idempotency test verify?', [
            'That the pipeline runs faster the second time',
            'That the API is available',
            'That running a load twice gives the same result as running it once',
            'That the warehouse has enough storage',
          ], 2, 'Re-runs are normal, so loads must not duplicate or corrupt data when repeated.'),
          q('Why keep sample fixture data free of real customer records?', [
            'Real data is too large for a repository',
            'Tests cannot read real data files',
            'Fixtures are required to be empty',
            'Repositories are widely accessible, so personal data would leak',
          ], 3, 'Fixtures live in code repositories, so they must contain synthetic or anonymised data.'),
        ]
      ),
      ],
      [
      q('Which pattern deduplicates to the latest record per key in SQL?', [
        'GROUP BY with SUM',
        'ROW_NUMBER over a partition ordered by the update time, keeping row 1',
        'CROSS JOIN with the original table',
        'COUNT DISTINCT on the key',
      ], 1, 'Ranking rows within each key by recency and filtering to the first selects the latest version.'),
      q('Which library is designed for fast, multi-threaded dataframe processing on one machine?', [
        'pandas',
        'Polars',
        'requests',
        'Airflow',
      ], 1, 'Polars uses multiple threads, strict types and lazy optimisation for speed.'),
      q('What should a pipeline do with rows that fail parsing in financial data?', [
        'Silently skip them and continue',
        'Replace the bad values with zero',
        'Reject the batch or quarantine the rows',
        'Convert every value to text',
      ], 2, 'Silent loss of records is worse than a loud failure; bad rows must be surfaced.'),
      q('Why store all pipeline code and SQL in version control with CI?', [
        'It is required by warehouses',
        'It makes queries faster',
        'It provides history, review, tests and safe rollback',
        'It replaces documentation',
      ], 2, 'Treating data code as software gives the safety and traceability reliable teams depend on.'),
      ]
    ),
    chapter(
      'Data Modelling for Analytics',
      'Distinguish transactional from analytical modelling, design star schemas with facts and dimensions, track history with slowly changing dimensions, and choose between star schemas, wide tables and Data Vault for a given platform.',
      [
      lesson('OLTP Versus OLAP', 13, `
The tables that run an application are shaped for fast, small transactions. The tables that answer business questions are shaped for scanning and aggregating millions of rows. Data modelling for analytics starts with understanding why these shapes differ and why copying an application's schema into the warehouse produces slow, confusing reports.

### Two workloads

| | OLTP (transactional) | OLAP (analytical) |
|---|---|---|
| Typical operation | Insert one order; update one balance | Sum revenue by city and month for two years |
| Rows touched | A few | Millions |
| Access pattern | Read and write individual records by key | Scan and aggregate many rows, few columns |
| Users | Applications, thousands of concurrent | Analysts and dashboards, dozens |
| Priority | Correctness and low latency per transaction | Throughput of large scans, query simplicity |
| Storage | Row-oriented | Column-oriented |

### Why normalised schemas hurt analytics

An application schema is normalised: customers, addresses, orders, order items, products, categories, each in its own table with foreign keys. This avoids duplication and keeps writes consistent. For an analyst, a simple question becomes a seven-table join:

\`\`\`sql
SELECT c.city, cat.name, SUM(oi.quantity * oi.unit_price)
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN categories cat ON cat.id = p.category_id
JOIN customers c ON c.id = o.customer_id
JOIN addresses a ON a.id = c.address_id
JOIN cities ci ON ci.id = a.city_id
GROUP BY c.city, cat.name;
\`\`\`

Analysts write it wrong, dashboards run slowly, and every team defines "revenue" slightly differently.

### Column-oriented storage

Analytical databases store each column together rather than each row. Summing one column over a billion rows reads only that column, compressed, instead of every byte of every row. This is why warehouses handle scans that would take hours in a transactional database. It also means analytical models can be wider and flatter without the penalty a row store would pay.

### Modelling goals for analytics

| Goal | Meaning |
|---|---|
| Understandable | An analyst can find "revenue by city" without a map of foreign keys |
| Consistent | One definition of each metric, used everywhere |
| Performant | Common questions run fast without heroic tuning |
| Historically accurate | Reports about last year show last year's truth, not today's |
| Maintainable | New sources and questions fit the existing structure |

### Dimensional modelling

The dominant approach for analytics is dimensional modelling: organise data into facts (measurable events) and dimensions (the context to slice them by). The next lesson builds this in detail. Its strength is that business users think this way naturally: "sales (fact) by region, product and month (dimensions)".

### The warehouse is not a copy of production

A common anti-pattern is loading production tables as-is and letting analysts query them. It seems quick, but it exports every application quirk, status code and join into every report. Raw copies belong in the raw layer; what analysts see should be deliberately modelled. The effort of modelling pays back many times over in correct, fast, consistent answers.

### When to model

Model early for the core: customers, orders, revenue. Model incrementally for the rest, as questions arrive. A perfect model of everything before anyone uses it is a project that never ships; a core model that grows with real needs is how successful platforms are built.
      `,
        [
          q('Why do normalised application schemas make analytics difficult?', [
            'They cannot be loaded into a warehouse',
            'Simple questions require many joins and inconsistent definitions',
            'They store data as columns',
            'They have too few tables',
          ], 1, 'Analysts face complex joins and repeated logic, leading to slow and inconsistent reports.'),
          q('Why are analytical databases column-oriented?', [
            'Rows cannot be stored in the cloud',
            'Columns compress worse than rows',
            'Aggregating a few columns over many rows reads only those columns',
            'Applications write columns one at a time',
          ], 2, 'Columnar storage makes large scans over a few columns dramatically cheaper.'),
          q('What is the anti-pattern of exposing raw production copies directly to analysts?', [
            'It exports application quirks and joins into every report',
            'It makes the warehouse too small',
            'It requires streaming',
            'It prevents any queries',
          ], 0, 'Deliberate modelling gives consistent, understandable tables instead of raw complexity.'),
        ]
      ),
      lesson('Star Schemas: Facts and Dimensions', 14, `
The star schema is the workhorse of analytical modelling. A central fact table records events with measures; surrounding dimension tables describe the who, what, where and when. It is simple to explain, fast to query and matches how business people think, which is why it has endured for decades and why BI tools are built around it.

### Facts

A fact table holds one row per event at a defined grain, with numeric measures and keys to dimensions:

\`\`\`text
fact_orders
  order_key        (surrogate key)
  order_id         (natural key from the source)
  customer_key     -> dim_customer
  restaurant_key   -> dim_restaurant
  date_key         -> dim_date
  order_total_paisa
  delivery_fee_paisa
  item_count
  minutes_to_deliver
\`\`\`

The grain, what one row represents, must be stated and consistent: "one row per completed order". Mixing grains, such as orders and order items in one table, causes double counting.

### Dimensions

Dimension tables hold descriptive attributes, usually text, used to filter and group:

\`\`\`text
dim_customer                  dim_restaurant           dim_date
  customer_key                  restaurant_key           date_key
  customer_id                   restaurant_id            date
  name                          name                     day_of_week
  city                          city                     month
  signup_date                   cuisine                  quarter
  segment                       is_partner               year
                                                         is_ramadan
\`\`\`

Dimensions are wide and relatively small; facts are narrow and large. Queries filter dimensions and aggregate facts.

### The shape

\`\`\`text
            dim_date
                |
dim_customer - fact_orders - dim_restaurant
                |
            dim_product (via fact_order_items)
\`\`\`

### Surrogate keys

Dimensions use surrogate keys, integers or hashes generated by the warehouse, rather than source IDs. Reasons:

- Source IDs can change, collide across systems or be reused.
- Historical versions of a dimension row need distinct keys (next lesson).
- Integer joins are fast and compact.

The natural key is kept as an attribute for traceability.

### Conformed dimensions

When \`dim_customer\` is shared by \`fact_orders\`, \`fact_support_tickets\` and \`fact_app_sessions\`, the dimension is conformed: the same customer attributes and keys everywhere. Conformed dimensions let questions span facts ("do customers with support tickets order less?") and are the backbone of a coherent warehouse.

### The date dimension

Almost every star includes a date dimension with one row per day and attributes such as fiscal periods, holidays and, for Pakistani businesses, Ramadan and Eid flags. It replaces date arithmetic in every query and makes "compare Ramadan weeks year on year" a simple filter.

### Measures: additive or not

| Type | Example | Behaviour |
|---|---|---|
| Additive | Order total | Sums correctly across all dimensions |
| Semi-additive | Account balance | Sums across accounts, not across time |
| Non-additive | Ratio, percentage | Must be computed from sums, not summed |

Store the components (numerator, denominator) in the fact and compute ratios at query time.

### Fact table types

| Type | Grain | Example |
|---|---|---|
| Transaction | One row per event | Each order |
| Periodic snapshot | One row per entity per period | Daily wallet balance per customer |
| Accumulating snapshot | One row per process, updated as it progresses | An order's placed, dispatched, delivered timestamps |

### Building a star from sources

\`\`\`text
1. Choose the business process (orders).
2. Declare the grain (one row per order).
3. Identify dimensions (customer, restaurant, date, promotion).
4. Identify measures (total, fee, item count, delivery time).
5. Build dimensions first, then the fact, looking up surrogate keys.
\`\`\`

This sequence, from the Kimball approach, is the standard design method and is worth internalising.
      `,
        [
          q('What must be declared and kept consistent for a fact table?', [
            'Its colour in the diagram',
            'Its grain, meaning what one row represents',
            'The number of dimensions',
            'The order of columns',
          ], 1, 'Mixing grains in one fact table leads to double counting and confusion.'),
          q('Why use surrogate keys in dimensions?', [
            'Source IDs can change or collide, and history needs distinct keys',
            'Surrogate keys are required by SQL',
            'Natural keys cannot be stored',
            'They make dimensions wider',
          ], 0, 'Warehouse-generated keys stay stable, unique and support historical versions.'),
          q('Which measure type must not be summed across time?', [
            'Additive',
            'Semi-additive',
            'Non-additive',
            'Textual',
          ], 1, 'Balances sum across accounts but not across days; summing daily balances is meaningless.'),
        ]
      ),
      lesson('Slowly Changing Dimensions', 13, `
Dimensions change. A customer moves from Lahore to Islamabad; a restaurant changes its cuisine category; a product's price band shifts. How the warehouse records these changes decides whether reports about the past remain true. Slowly changing dimension (SCD) types are the standard techniques, and choosing the right one per attribute is a core modelling decision.

### The problem

Sana lived in Lahore when she placed 40 orders, then moved to Islamabad and placed 10 more. If \`dim_customer\` simply holds her current city, a report of "orders by city" now attributes all 50 orders to Islamabad. Last year's Lahore revenue has silently changed.

### Type 1: overwrite

The attribute is updated in place; history is lost.

\`\`\`text
customer_key  customer_id  name   city
101           C-42         Sana   Islamabad     (was Lahore)
\`\`\`

Use when history does not matter or the change corrects an error, such as fixing a misspelt name.

### Type 2: add a new row

Each change creates a new row with validity dates; the old row is closed:

\`\`\`text
customer_key  customer_id  name   city       valid_from   valid_to     is_current
101           C-42         Sana   Lahore     2023-01-10   2024-08-31   false
287           C-42         Sana   Islamabad  2024-09-01   9999-12-31   true
\`\`\`

Facts reference the surrogate key that was current when the event happened: the 40 Lahore orders point to key 101, the 10 Islamabad orders to key 287. Historical reports stay correct, and the current view is \`WHERE is_current\`. Type 2 is the most common choice for attributes that matter historically.

### Type 3: add a column

Keep the previous value alongside the current one:

\`\`\`text
customer_key  city       previous_city
101           Islamabad  Lahore
\`\`\`

Only one level of history, useful for specific "before and after" comparisons, such as a territory realignment.

### Other types

Type 0 never changes (a birth date). Types 4 and 6 combine the above for special cases. Types 1, 2 and 3 cover most needs.

### Choosing per attribute

| Attribute | Type | Reason |
|---|---|---|
| Customer name spelling | 1 | A correction, no analytical value in history |
| Customer city | 2 | Regional reporting must be historically accurate |
| Customer segment | 2 | Segment at the time of purchase matters |
| Restaurant phone number | 1 | Operational, not analytical |
| Product category | 2 | Category revenue over time |

A single dimension can mix types: Type 2 for city and segment, Type 1 for phone number.

### Implementing Type 2

Each load compares incoming records with current rows:

\`\`\`text
For each incoming customer:
  if no current row exists         -> insert as new current
  if tracked attributes unchanged  -> nothing (or Type 1 update of untracked ones)
  if tracked attributes changed    -> close current row (valid_to = today - 1,
                                      is_current = false), insert new current row
\`\`\`

dbt provides snapshots that implement this pattern with a few lines of configuration (chapter 6). Change data capture (chapter 4) supplies the change events that drive it.

### Late-arriving and early-arriving data

A fact may arrive before its dimension row (a new customer's first order lands before the customer record). Insert a placeholder dimension row and update it when the details arrive. A dimension change may arrive late, requiring past facts to be re-keyed. Both cases need explicit handling rather than hope.

### Snapshot facts as an alternative

For some questions, a daily snapshot of the entity (chapter 3's periodic snapshot fact) answers history more simply than Type 2 dimensions: "what did every customer's segment look like each day?" Choose based on the questions asked and the volume of change.

### Document the choice

Record for each dimension attribute which SCD type applies and why. Analysts joining facts to dimensions need to know whether they are seeing history or the current state, and a table that silently mixes the two is a source of endless confusion.
      `,
        [
          q('What goes wrong when a customer\'s city is simply overwritten?', [
            'Past orders are attributed to the new city, changing historical reports',
            'The customer cannot place new orders',
            'The dimension table becomes too large',
            'Surrogate keys stop working',
          ], 0, 'Overwriting rewrites history, so last year\'s regional revenue silently changes.'),
          q('How does Type 2 preserve history?', [
            'By deleting old facts',
            'By storing the previous value in an extra column',
            'By adding a new row with validity dates and keeping the old one',
            'By never allowing changes',
          ], 2, 'Each version gets its own row and surrogate key, so facts point to the version current at the time.'),
          q('A fact arrives before its customer\'s dimension row exists. What is the standard handling?', [
            'Discard the fact row entirely',
            'Wait indefinitely for the dimension',
            'Attach it to a random existing customer',
            'Insert a placeholder dimension row for now',
          ], 3, 'Placeholders keep facts loadable while preserving referential integrity until the dimension catches up.'),
        ]
      ),
      lesson('Wide Tables, Data Vault and Choosing a Model', 13, `
Star schemas are the default, but not the only option. Cheap columnar storage has made wide, denormalised tables practical, and large regulated organisations use Data Vault for its auditability and flexibility. Knowing the alternatives, and where each fits, lets you choose deliberately rather than by habit.

### One big table

A wide table joins facts and dimensions in advance: one row per order with customer city, restaurant cuisine, date attributes and measures all present.

\`\`\`text
orders_wide
  order_id, placed_at, customer_id, customer_city, customer_segment,
  restaurant_name, cuisine, order_total_paisa, item_count, ...
\`\`\`

| Strengths | Weaknesses |
|---|---|
| No joins; simplest possible queries | Dimension changes require rebuilding or updating many rows |
| Very fast in columnar warehouses | Duplication of attributes across millions of rows |
| Ideal for BI tools and self-service | History handling is harder |
| Great as a serving layer | Multiple wide tables can drift in definitions |

Modern practice often keeps a star schema as the modelled core and generates wide tables from it as the last step for specific dashboards. The star provides consistency; the wide table provides convenience.

### Data Vault

Data Vault models data as hubs (business keys), links (relationships between keys) and satellites (descriptive attributes with history):

\`\`\`text
hub_customer      customer_id, load_date, source
hub_restaurant    restaurant_id, ...
link_order        customer_id + restaurant_id + order_id, load_date, source
sat_customer      customer_id, load_date, name, city, segment, ...   (full history)
\`\`\`

Every row records when it was loaded and from where, and nothing is ever updated, only added.

| Strengths | Weaknesses |
|---|---|
| Full auditability: every value from every source, forever | Many tables; complex to query directly |
| Absorbs new sources and changes without redesign | Requires a star or wide layer on top for analysts |
| Parallel, insert-only loading | Higher modelling effort and learning curve |

Data Vault suits large organisations integrating many sources under regulatory scrutiny, such as banks. It is rarely the right first choice for a small team.

### Activity schema and event-based models

Some teams model everything as a single stream of activities (customer did X at time T with these attributes), which suits product analytics and behavioural questions. It pairs naturally with event streaming and is worth knowing for those domains.

### Choosing

| Situation | Suggested approach |
|---|---|
| Small team, BI reporting, a few sources | Star schema, plus wide tables for dashboards |
| Self-service analytics with many casual users | Wide tables served from a star core |
| Many sources, strict audit, frequent source changes | Data Vault core with star marts on top |
| Product analytics on event streams | Activity or event models feeding star marts |

Layers can combine: raw, then vault or staging, then star, then wide. Each layer serves a purpose; not every platform needs every layer.

### Metrics layers

Whatever the model, metric definitions ("active customer", "net revenue") should live in one place and be reused, rather than recomputed differently in each dashboard. Semantic layers in dbt and BI tools hold these definitions so that every consumer gets the same number. Consistency of definitions is worth more than any modelling style.

### Model for the questions

The best model is the one that makes the organisation's real questions easy, correct and fast. Start with those questions, choose the simplest structure that serves them, and evolve as questions change. Modelling is never finished, and a platform that can evolve its model safely, thanks to version control and tests, is more valuable than one that got the first model perfect.
      `,
        [
          q('What is the main trade-off of one big wide table?', [
            'Queries need many joins to run',
            'It cannot be stored in a cloud warehouse',
            'Simple queries in exchange for duplication',
            'It only works for very small data',
          ], 2, 'Wide tables remove joins but duplicate attributes and complicate updates.'),
          q('What does Data Vault prioritise?', [
            'Simplicity for analysts writing queries',
            'Auditability and integrating many sources',
            'Keeping the number of tables minimal',
            'Real-time dashboards for operations',
          ], 1, 'Hubs, links and insert-only satellites keep every value from every source with full history.'),
          q('Where should metric definitions like "active customer" live?', [
            'In each dashboard, defined separately',
            'In email threads between analysts',
            'In the raw layer next to source data',
            'In one shared place, reused everywhere',
          ], 3, 'A single definition prevents different reports showing different numbers for the same metric.'),
        ]
      ),
      ],
      [
      q('Which workload does a column-oriented warehouse serve best?', [
        'Inserting one order at a time',
        'Aggregating a few columns across millions of rows',
        'Updating a single customer\'s phone number',
        'Serving a web page',
      ], 1, 'Columnar storage excels at large scans over few columns, the OLAP pattern.'),
      q('In a star schema, which table holds one row per business event with measures?', [
        'Dimension table',
        'Date table',
        'Fact table',
        'Bridge table',
      ], 2, 'Facts record events at a defined grain with numeric measures and dimension keys.'),
      q('Which SCD type creates a new row when a tracked attribute changes?', [
        'Type 1',
        'Type 2',
        'Type 3',
        'Type 0',
      ], 1, 'Type 2 preserves history by versioning dimension rows with validity dates.'),
      q('What is a common modern pattern combining star schemas and wide tables?', [
        'A star schema core with wide tables generated for specific dashboards',
        'Wide tables only, with no shared definitions',
        'A star schema for each dashboard',
        'Raw tables served directly to BI tools',
      ], 0, 'The star ensures consistency while wide tables give dashboards simple, fast access.'),
      ]
    ),
    chapter(
      'Ingestion and Extraction',
      'Extract data from databases with full loads and change data capture, pull from APIs and SaaS sources reliably, decide between managed connectors and custom code, and load incrementally with watermarks while keeping backfills safe.',
      [
      lesson('Extracting From Databases: Full Loads and Change Data Capture', 13, `
Production databases hold the most valuable data in most companies: customers, orders, payments. Getting that data into the platform without harming the application, and without missing changes, is the first ingestion problem every data engineer solves. There are three main approaches, each with a different balance of simplicity, freshness and load on the source.

### Full loads

Copy every row of a table on each run:

\`\`\`sql
SELECT * FROM orders;
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Simplest possible; always consistent with the source at load time | Cost grows with table size; a 500 million row table cannot be copied hourly |
| Captures deletes automatically | Heavy read load on the source |
| No dependence on timestamps or logs | Freshness limited by how often a full copy is affordable |

Full loads suit small tables, dimension-like reference data and initial snapshots. Many platforms full-load tables under a few million rows daily and use other methods for the rest.

### Incremental loads by timestamp

Copy only rows changed since the last run, using an \`updated_at\` column:

\`\`\`sql
SELECT * FROM orders WHERE updated_at > :last_watermark;
\`\`\`

Much cheaper, but it depends on the source maintaining \`updated_at\` reliably, and it cannot see hard deletes: a deleted row never appears in the query. Soft deletes (a \`deleted_at\` column) solve this if the application uses them. The final lesson of this chapter covers watermarks in detail.

### Change data capture

Change data capture (CDC) reads the database's own transaction log, the record every database keeps of inserts, updates and deletes for replication and recovery:

\`\`\`text
Database write-ahead log -> CDC tool (Debezium, cloud CDC services)
    -> stream of change events: {op: "u", before: {...}, after: {...}, ts: ...}
    -> Kafka or directly to the warehouse
\`\`\`

| Strengths | Weaknesses |
|---|---|
| Captures every insert, update and delete | Requires log access and database configuration |
| Near real-time | More infrastructure: connectors, a stream, schema handling |
| Almost no load on the source | Initial snapshot still needed for existing data |
| Does not rely on \`updated_at\` columns | Schema changes in the source must be handled |

CDC is the standard for large, frequently changing tables and for anything needing freshness in minutes. PostgreSQL exposes its log through logical replication; MySQL through the binlog; managed cloud databases offer CDC features of their own.

### From change events to tables

CDC produces a stream of changes, not a table. To rebuild the current state, apply events in order per primary key: an update replaces the row, a delete removes it. Most warehouses do this with a merge statement, and tools handle it automatically. Keeping the raw change stream also enables full history and Type 2 dimensions without extra work.

### Choosing per table

| Table | Rows | Change rate | Approach |
|---|---|---|---|
| Cities, categories | Hundreds | Rare | Full load daily |
| Customers | Millions | Moderate | Incremental by timestamp or CDC |
| Orders | Hundreds of millions | High | CDC |
| Audit logs | Append-only, huge | Continuous | Incremental by ID or CDC |

### Respect the source

Whatever the method, coordinate with the application team: which replica to read, what hours are safe for heavy extracts, and how schema changes will be communicated. A data pipeline that slows the app on a busy evening loses the trust that ingestion depends on.
      `,
        [
          q('Which extraction method captures hard deletes without extra columns?', [
            'Full loads only, never anything else',
            'Change data capture from the transaction log',
            'Incremental loads by updated_at',
            'Reading from the application\'s cache',
          ], 1, 'The transaction log records deletes, unlike timestamp queries that never see removed rows.'),
          q('What is a limitation of incremental loads by timestamp?', [
            'Hard deletes are invisible to the query',
            'They copy every row on each run',
            'They require Kafka to work',
            'They only work on small tables',
          ], 0, 'A deleted row no longer exists to match the filter, so timestamp-based loads miss it.'),
          q('Which approach suits a small reference table that rarely changes?', [
            'Change data capture with a streaming platform',
            'Hourly incremental loads with a watermark',
            'A dedicated replica for the table',
            'A daily full load',
          ], 3, 'Small, stable tables are cheapest and simplest to copy in full.'),
        ]
      ),
      lesson('Pulling From APIs and SaaS Sources', 13, `
Much business data lives outside the company's own databases: payments in a gateway, support tickets in a helpdesk, campaigns in an ad platform, leads in a CRM. These systems expose data through APIs, each with its own rules. Ingesting from them reliably is routine work that rewards a disciplined approach.

### How SaaS APIs deliver data

| Pattern | Description | Example |
|---|---|---|
| REST endpoints with pagination | Request pages of records, follow a cursor or page number | Most CRMs and helpdesks |
| Incremental endpoints | Filter by "updated since" | Well-designed APIs |
| Bulk export jobs | Request an export, poll until ready, download a file | Ad platforms, large datasets |
| Webhooks | The source pushes events to your endpoint as they happen | Payment gateways |
| Reports API | Pre-aggregated metrics by date and dimension | Analytics and advertising tools |

Prefer incremental endpoints and bulk exports for volume; use webhooks for freshness, with a periodic reconciliation pull because webhooks can be missed.

### A robust extraction loop

\`\`\`text
1. Load the last successful watermark (timestamp or cursor) from state storage.
2. Request records updated since the watermark, page by page.
3. Write each page to raw storage exactly as received, with a fetch timestamp.
4. On completion, advance the watermark to the latest updated time seen,
   minus a small overlap for late updates.
5. On failure, do not advance the watermark; the next run retries the same window.
\`\`\`

Saving raw responses before any parsing means schema changes never lose data.

### Handling rate limits and quotas

APIs limit requests per second and often per day. Design for it:

- Read the limit headers and slow down before hitting them.
- Back off exponentially on 429 responses.
- Spread large extracts over time rather than bursting.
- For daily quotas, prioritise the most important data first.

A pipeline that exhausts a daily quota at 2 a.m. leaves the rest of the day's syncs failing.

### Authentication

| Method | Handling |
|---|---|
| API keys | Store in a secret manager; rotate periodically |
| OAuth 2 | Store refresh tokens securely; refresh access tokens before expiry |
| Service accounts | Least-privilege scopes; separate credentials per pipeline |

Credentials never live in code or logs. A leaked ad platform token can spend real money.

### Late-arriving and revised data

Advertising and analytics APIs revise past days as attribution settles: yesterday's spend figure may change for a week. Re-pull a trailing window (for example, the last 7 to 30 days) on each run and overwrite, rather than trusting a single pull. Financial reconciliation depends on this.

### Schema drift

SaaS vendors add fields, rename them and deprecate endpoints. Keep raw JSON, parse into typed columns in a separate step, and alert on unexpected changes. Version your parsing code so old raw data can be reprocessed with newer logic.

### Testing against sandboxes

Most serious APIs offer sandbox environments. Develop and test extraction there, then switch credentials for production. Record sample responses as fixtures for unit tests, so parsing logic is tested without network access.

### Documenting each source

For every API source, record: endpoints used, authentication method, rate limits, incremental strategy, known revisions window, contact person at the vendor or internal owner, and the date the integration was last verified. When the sync breaks at a bad moment, this document is what lets someone else fix it.
      `,
        [
          q('Why save raw API responses before parsing them?', [
            'Parsing is not allowed on the first run',
            'Schema changes never lose data, since the raw copy can be reprocessed',
            'Raw responses are smaller than parsed tables',
            'APIs require clients to store responses',
          ], 1, 'Keeping the original payload makes every parsing decision reversible.'),
          q('Why re-pull a trailing window from advertising APIs each run?', [
            'Ad platforms delete old data daily',
            'Watermarks do not work with advertising',
            'Past days are revised as attribution settles',
            'To use up the daily quota',
          ], 2, 'Revisions to recent days mean a single pull would leave stale figures.'),
          q('Why should webhook ingestion be paired with periodic pulls?', [
            'Webhooks can be missed, so pulls reconcile gaps',
            'Webhooks are slower than pulls',
            'Webhooks cannot carry JSON',
            'Pulls are required for authentication',
          ], 0, 'Push delivery is not guaranteed; a reconciliation pull catches anything dropped.'),
        ]
      ),
      lesson('Managed Connectors Versus Custom Code', 12, `
For each source, a team can use a managed connector from a tool such as Fivetran, Airbyte or a cloud provider's service, or write its own extraction code. Both are legitimate. The wrong choice wastes engineering time or money, so it helps to have a clear way to decide.

### What managed connectors offer

A connector tool provides pre-built integrations for hundreds of sources: databases, SaaS APIs, files. You supply credentials and a destination; it handles pagination, rate limits, incremental sync, schema changes and loading, with monitoring built in.

| Strengths | Weaknesses |
|---|---|
| A new source in hours, not weeks | Cost, often by rows synced, can grow sharply with volume |
| Vendors maintain connectors as APIs change | Limited control over exactly what and how data is pulled |
| Monitoring, retries and alerting included | Gaps: unusual sources or custom endpoints may be unsupported |
| Frees engineers for modelling and quality | Vendor dependency; pricing and features change |

Open-source options such as Airbyte can be self-hosted, trading subscription cost for operational effort.

### What custom code offers

Writing extraction yourself, in Python with a framework such as dlt or plain scripts:

| Strengths | Weaknesses |
|---|---|
| Full control over logic, filtering and cost | Engineering time to build and, more importantly, maintain |
| No per-row fees | Every API change is your problem |
| Handles internal and unusual sources | Monitoring and retries must be built |
| Fits exactly into your orchestration | Knowledge concentrates in whoever wrote it |

### A decision guide

\`\`\`text
Standard SaaS source, connector exists, volume moderate  -> managed connector
Internal system or unusual API                           -> custom code
Very high volume where per-row pricing explodes          -> custom or self-hosted
Small team with little engineering capacity              -> managed
Strict control or compliance requirements on extraction  -> custom, or self-hosted open source
\`\`\`

Most teams end up with a mix: managed connectors for the long tail of SaaS tools, custom code for the core internal systems and any source where volume or control matters.

### Total cost, honestly

Compare the connector's subscription against the engineering cost of building and maintaining the same integration: initial build, plus a realistic allowance for API changes, outages and monitoring, plus the opportunity cost of what those engineers would otherwise build. A connector that costs a few hundred dollars a month is often cheaper than a day of engineering time each month. At millions of rows an hour, the calculation can reverse.

### Frameworks in the middle

Libraries such as dlt (data load tool) give custom pipelines connector-like features: incremental state, schema inference and evolution, retries and loading to many destinations, while remaining plain Python you control. They are a strong middle path for teams that want ownership without reinventing the basics.

### Whatever you choose, own the contract

Even with managed connectors, the team owns the outcome: which tables are synced, how often, what the raw layer looks like and how failures are surfaced. Treat connector configuration as code where the tool allows, keep it in version control, and monitor sync freshness independently of the vendor's dashboard.

### Avoid lock-in where cheap

Land data in your own storage in open formats, so a change of connector tool means re-pointing a source, not rebuilding downstream models. The raw layer's structure, not the tool, is what the rest of the platform depends on.
      `,
        [
          q('When is a managed connector usually the better choice?', [
            'A standard SaaS source at moderate volume',
            'An internal system with a custom protocol',
            'A source with billions of rows per day',
            'A source that requires no credentials',
          ], 0, 'Pre-built connectors excel at common sources where volume keeps costs reasonable.'),
          q('What is the main risk of managed connectors at very high volume?', [
            'They stop syncing after a limit',
            'Per-row pricing can grow sharply',
            'They cannot handle databases',
            'They require custom code anyway',
          ], 1, 'Usage-based pricing that is cheap at small scale can become expensive at large scale.'),
          q('What does a framework like dlt provide for custom pipelines?', [
            'A replacement for the warehouse',
            'A managed subscription service',
            'Automatic dashboard creation',
            'Incremental state, schema handling and retries in plain Python',
          ], 3, 'Such libraries add connector-like reliability features while keeping code under the team\'s control.'),
        ]
      ),
      lesson('Incremental Loads, Watermarks and Backfills', 14, `
Loading only what changed is what makes pipelines affordable at scale, but incremental logic is also where subtle data loss hides. Watermarks, overlap windows, merge logic and the ability to backfill turn incremental loading from a source of bugs into a reliable routine.

### The watermark

A watermark records how far a pipeline has successfully loaded, typically the maximum \`updated_at\` value or the last cursor seen:

\`\`\`text
Run 1: load rows with updated_at > 2025-03-14 06:00, see max 2025-03-15 06:00
       -> save watermark 2025-03-15 06:00
Run 2: load rows with updated_at > 2025-03-15 06:00 ...
\`\`\`

Store the watermark durably, per source table, and update it only after the load has fully succeeded. If a run fails halfway, the next run starts from the old watermark and repeats the window, which is safe only if loads are idempotent.

### The late-update problem

Transactions commit out of order. A row with \`updated_at\` 05:59 may commit after a row stamped 06:01, so a watermark of 06:00 taken at that moment misses it. Two defences:

- **Overlap**: query from the watermark minus a margin (a few minutes to an hour), and rely on merge logic to handle repeats.
- **Use the source's own ordering** where available, such as a database log position or an API cursor, which is strictly ordered.

Overlap plus idempotent merge is the everyday solution.

### Idempotent merge into the target

Incremental loads write with a merge keyed on the primary key:

\`\`\`sql
MERGE INTO analytics.orders AS t
USING staging.orders_batch AS s
ON t.order_id = s.order_id
WHEN MATCHED AND s.updated_at > t.updated_at THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...;
\`\`\`

Repeated rows from overlap windows or retried runs update in place rather than duplicating. The \`updated_at\` guard prevents an older batch overwriting newer data if runs arrive out of order.

### Append-only sources

For immutable events (clicks, log lines), inserts with a unique event ID and deduplication are enough: \`INSERT ... WHERE NOT EXISTS\`, or load then \`SELECT DISTINCT\` by ID into the final table.

### Partitioned loads

For time-partitioned data, load whole partitions atomically: compute the day's rows into a staging location, then replace the target's partition in one operation. A failure leaves the old partition intact; a retry replaces it cleanly. This "insert overwrite partition" pattern is idempotent by construction and is common in lakehouse and warehouse loads.

### Backfills

A backfill re-loads historical data: after a bug fix, a new column, a source change or a lost period. Design for it from the start:

\`\`\`text
- Parameterise every load by a time window (start, end), not "since last run".
- Make a normal run simply "window = last watermark to now".
- A backfill is then the same code with an older window.
- Process backfills in chunks (per day) so failures are small and resumable.
- Throttle backfills so they do not starve regular runs or overload the source.
\`\`\`

Orchestrators such as Airflow support backfilling by date range natively when tasks are written this way (chapter 7).

### Initial loads

The first load of a large table is a special backfill: a full snapshot, often taken from a replica or a database export rather than the live primary, followed by incremental loads from the snapshot's point in time. Record that point precisely; a gap between snapshot and first increment is a classic source of missing rows.

### Monitoring incremental loads

Track per run: rows extracted, rows merged, watermark advanced, duration. A watermark that stops advancing or a row count that drops to zero on a busy day signals a silent failure even when the job reports success. Chapter 9 turns these into alerts.

### The rule

Every load must be safe to run twice and possible to run for any past window. Pipelines built on that rule recover from almost any failure by simply running again.
      `,
        [
          q('Why query from the watermark minus an overlap margin?', [
            'To make the query run faster',
            'Rows can commit out of order and would otherwise be missed',
            'Watermarks are always inaccurate by an hour',
            'Overlap reduces the number of rows loaded',
          ], 1, 'Late-committing rows with earlier timestamps are caught by re-reading a small window.'),
          q('What makes a merge safe when the same row arrives twice?', [
            'Deleting the target table first',
            'Loading into a new table each time',
            'Matching on the primary key and updating instead of inserting again',
            'Skipping rows with timestamps',
          ], 2, 'Keyed merges update existing rows, so repeated arrivals never create duplicates.'),
          q('How should loads be written so backfills are easy?', [
            'With a hard-coded "since yesterday" filter',
            'By deleting all data before each run',
            'Only as full loads',
            'Parameterised by a time window, with normal runs as one case of it',
          ], 3, 'Window-based loads let the same code reload any historical period in chunks.'),
        ]
      ),
      ],
      [
      q('Which method reads a database\'s transaction log to capture changes?', [
        'Full load',
        'Timestamp-based incremental load',
        'Change data capture',
        'Webhook ingestion',
      ], 2, 'CDC tools such as Debezium stream inserts, updates and deletes from the log.'),
      q('An API pipeline exhausts its daily quota at 2 a.m. What design mistake does this suggest?', [
        'Bursting requests instead of spreading them',
        'Using OAuth tokens instead of API keys',
        'Storing the raw responses before parsing',
        'Running the pipeline during the night',
      ], 0, 'Quotas must be budgeted across the day so later syncs are not starved.'),
      q('What should be kept in version control even when using managed connectors?', [
        'The vendor\'s source code',
        'Customer records synced by the connector',
        'Connector configuration and the raw layer\'s structure',
        'The vendor\'s pricing page',
      ], 2, 'Owning the configuration and raw layout keeps the platform independent of the tool.'),
      q('What is the golden rule for incremental loads?', [
        'Never run a load more than once a day',
        'Every load must be safe to run twice and possible for any past window',
        'Always load the full table to be safe',
        'Advance the watermark before loading',
      ], 1, 'Idempotent, window-parameterised loads recover from failures by simply re-running.'),
      ]
    ),
    chapter(
      'Storage: Warehouses and Lakehouses',
      'Understand how cloud data warehouses work and what they cost, store data in lakes using columnar formats, use open table formats to bring warehouse features to the lake, and lay out data with partitioning and clustering for fast, cheap queries.',
      [
      lesson('Cloud Data Warehouses', 13, `
The cloud data warehouse is the centre of most modern data platforms. It stores modelled data, runs the SQL transformations and answers the queries behind dashboards. Understanding how these systems are built explains their strengths, their pricing and the habits that keep them fast and affordable.

### What makes them different

Traditional warehouses were single large machines. Cloud warehouses separate storage from compute:

\`\`\`text
Storage:  data in object storage (durable, cheap, effectively unlimited)
Compute:  clusters or slots that run queries, scaled up and down independently
Metadata: a service tracking tables, partitions and statistics
\`\`\`

Because compute is separate, several teams can query the same data with their own compute, a nightly transformation can use a large cluster for an hour, and idle time costs little or nothing.

### The main products

| Warehouse | Character |
|---|---|
| Snowflake | Virtual warehouses of fixed sizes, billed per second while running; multi-cloud |
| Google BigQuery | Serverless; on-demand pricing per data scanned, or reserved capacity |
| Amazon Redshift | Clusters or serverless, integrated with AWS |
| Databricks SQL | Warehouse endpoints over lakehouse tables; strong for Spark-heavy teams |
| Others | Azure Synapse and Fabric, ClickHouse, Firebolt, and more |

Features and pricing change often; the shared model, columnar storage plus elastic compute, is what matters.

### Columnar execution

Warehouses store columns separately and compress them heavily. A query touching three columns of a hundred reads only those three. Combined with statistics that let the engine skip whole blocks of files that cannot match a filter, this is why a billion-row aggregation returns in seconds. It also means \`SELECT *\` is expensive in a way it never was in row stores: every column must be read.

### Pricing models

| Model | How it charges | Watch out for |
|---|---|---|
| Per data scanned | Each query is billed by bytes read | \`SELECT *\` on huge tables; missing partition filters |
| Per compute time | Clusters billed while running | Clusters left running idle; oversized clusters |
| Reserved capacity | A fixed amount of compute per month | Under- or over-provisioning |

Storage is typically cheap per terabyte; compute and scanning are where bills grow. Chapter 10 covers cost control in depth.

### Loading data

Warehouses load efficiently from files in object storage, in bulk. Loading row by row through inserts is slow and expensive. Standard pattern: write Parquet or compressed CSV files to a bucket, then issue a bulk load or define an external table over them. Connector tools and streaming ingestion services do this internally.

### Semi-structured data

Modern warehouses store JSON natively in a variant or JSON column and let SQL query nested fields. Landing raw API payloads this way, then flattening them into typed columns in staging models, keeps the raw layer faithful and the modelled layer clean.

### Concurrency and workload isolation

Give different workloads their own compute: transformations, BI dashboards, ad-hoc analysis and data science. Then a heavy backfill cannot slow the executive dashboard, and each workload's cost is visible separately.

### Time travel and cloning

Most cloud warehouses keep table history for a period, allowing queries "as of" an earlier time and recovery from accidental deletes. Zero-copy cloning creates instant copies of tables or whole schemas for testing without duplicating storage. Both are valuable for safe development and incident recovery.

### Warehouse or lakehouse?

Warehouses offer simplicity and strong SQL performance; lakehouses (the following lessons) offer open formats and cheaper storage for very large or diverse data. Many organisations use a warehouse as the modelled serving layer and a lake for raw and large-scale data, and the two are converging as warehouses read open table formats directly.
      `,
        [
          q('What architectural change defines cloud data warehouses?', [
            'Storing data as rows on a single server',
            'Separating storage from compute so each scales independently',
            'Removing SQL in favour of Python',
            'Running only on premises',
          ], 1, 'Independent storage and compute enable elastic scaling and isolated workloads.'),
          q('Why is SELECT * costly in a columnar warehouse?', [
            'It locks the table for other users',
            'Columnar stores cannot return all columns',
            'Every column must be read, defeating column pruning',
            'It bypasses the metadata service',
          ], 2, 'Reading only needed columns is the main efficiency of columnar storage; SELECT * discards it.'),
          q('What is the efficient way to load large volumes into a warehouse?', [
            'Row-by-row inserts from Python',
            'Bulk loading files from object storage',
            'Copying data through a spreadsheet',
            'Streaming single rows over HTTP',
          ], 1, 'Bulk loads from files use the warehouse\'s parallel loading path and cost far less than inserts.'),
        ]
      ),
      lesson('Data Lakes and Columnar Formats', 13, `
A data lake stores data as files in cloud object storage: raw, cheap, in any format, at any scale. It complements or underpins the warehouse, holding raw landing data, large event histories and data for machine learning. Its value depends almost entirely on the file formats and layout chosen.

### Object storage as the foundation

Services such as Amazon S3, Google Cloud Storage and Azure Blob Storage offer:

- Durability measured in many nines, with data replicated automatically.
- Very low cost per terabyte compared with warehouse or database storage.
- Effectively unlimited capacity.
- Access from any engine: warehouses, Spark, DuckDB, Python, ML frameworks.

The trade-off is that object storage is just files: no transactions, no indexes, no schema enforcement, unless something adds them (the next lesson's table formats).

### Why file format matters

| Format | Type | Analytical suitability |
|---|---|---|
| CSV | Text, row-oriented | Poor: no types, no compression, full scans |
| JSON | Text, nested | Poor for analytics; fine for raw landing |
| Avro | Binary, row-oriented, with schema | Good for streaming and record exchange |
| Parquet | Binary, columnar, with schema | The standard for analytical storage |
| ORC | Binary, columnar | Similar to Parquet, common in Hadoop and Hive ecosystems |

### Parquet

Parquet stores data by column within row groups, with a schema, compression and statistics (min, max, null counts) per column chunk:

\`\`\`text
Parquet file
  row group 1
    column chunk: order_id     (compressed, min/max stats)
    column chunk: customer_id  (...)
    column chunk: total_paisa  (...)
  row group 2
    ...
  footer: schema, row group locations, statistics
\`\`\`

Engines read only the columns a query needs and skip row groups whose statistics rule them out. Compression on similar values within a column is excellent: Parquet files are often five to ten times smaller than the equivalent CSV, and queries over them are dramatically faster.

### Converting at the boundary

Land raw files in whatever format the source provides, then convert to Parquet as the first processing step. Everything downstream benefits: smaller storage, faster reads, enforced types.

### File sizes

Many tiny files are slow: each file has overhead to open and list. A few enormous files limit parallelism. A common target is files in the range of roughly 128 MB to 1 GB. Streaming ingestion produces small files continuously, so compaction jobs periodically merge them, a task table formats automate.

### Lake layout

\`\`\`text
s3://company-lake/
  raw/        source-shaped data, immutable, partitioned by ingestion date
  staging/    cleaned, typed Parquet, one dataset per source table
  curated/    modelled tables (facts, dimensions), the analytical layer
  sandbox/    analysts' and scientists' experiments, with retention limits
\`\`\`

Consistent naming and partition paths (\`dt=2025-03-15/\`) let engines discover and prune data. Lifecycle rules move old raw data to cheaper storage tiers or delete it after a retention period.

### Lakes and warehouses together

Warehouses can read Parquet in the lake as external tables, and can export to it. A common shape: everything lands in the lake; the warehouse holds the modelled, frequently queried layer; large histories and ML datasets stay in the lake. Open table formats, next, blur this line further by giving lake tables warehouse-like behaviour.

### Avoiding the data swamp

A lake without structure, ownership and metadata becomes a swamp: files nobody understands or trusts. Prevent it with the layout above, a catalogue (chapter 11), documented ownership per dataset, and the discipline of never writing ad-hoc files into curated areas.
      `,
        [
          q('Why is Parquet the standard for analytical files?', [
            'Columnar layout, compression, schema and statistics make reads fast and small',
            'It is human-readable in any text editor',
            'It stores each row on its own line',
            'It is the only format object storage accepts',
          ], 0, 'Column chunks with statistics let engines read less data and skip irrelevant blocks.'),
          q('Why are many tiny files a problem in a lake?', [
            'Object storage rejects small files',
            'Per-file overhead makes listing and reading slow',
            'Small files cannot be compressed',
            'They use more storage per row than large files',
          ], 1, 'Each file costs time to open; compaction merges them into efficient sizes.'),
          q('What turns a data lake into a swamp?', [
            'Using Parquet instead of CSV',
            'Partitioning by date',
            'Missing structure, ownership and metadata',
            'Storing raw data separately from curated data',
          ], 2, 'Without layout, owners and a catalogue, files become untrusted and unusable.'),
        ]
      ),
      lesson('Open Table Formats and the Lakehouse', 14, `
Files in a lake lack what databases take for granted: atomic writes, schema enforcement, updates and deletes, and time travel. Open table formats add these on top of Parquet files, turning a folder of files into a table. The result is the lakehouse: warehouse capabilities on cheap, open storage that many engines can share.

### The problems table formats solve

| Problem with plain files | Table format solution |
|---|---|
| A failed write leaves partial files that readers see | Atomic commits: a write is visible entirely or not at all |
| No way to update or delete rows without rewriting everything | Row-level updates and deletes, with efficient file rewriting |
| Schema is whatever each file happens to contain | Enforced schema, with safe evolution (add, rename, widen) |
| Concurrent writers corrupt each other | Optimistic concurrency with conflict detection |
| Listing thousands of files is slow | Metadata tracks files and statistics directly |
| No history | Snapshots enable time travel and rollback |

### The three formats

| Format | Origin | Notes |
|---|---|---|
| Apache Iceberg | Netflix, now Apache | Broad engine support; strong metadata design; widely adopted by warehouses and cloud services |
| Delta Lake | Databricks, open source | Deep Spark and Databricks integration; widely used |
| Apache Hudi | Uber, now Apache | Strong upsert and streaming ingestion features |

All three store data as Parquet plus a metadata layer describing snapshots. Iceberg has become a common choice for interoperability across many engines; Delta Lake dominates in Databricks environments. Check current support for your engines before choosing.

### How a table format works

\`\`\`text
table/
  data/
    dt=2025-03-15/part-0001.parquet
    dt=2025-03-15/part-0002.parquet
  metadata/
    snapshot-001.json   -> list of data files, schema, partition spec, stats
    snapshot-002.json   -> after an append: the new file list
    ...
\`\`\`

Readers consult the latest snapshot to know exactly which files form the table. A writer creates new files and a new snapshot, then atomically points the table at it. Old snapshots remain until expired, providing time travel:

\`\`\`sql
SELECT * FROM orders VERSION AS OF 41;
SELECT * FROM orders TIMESTAMP AS OF '2025-03-14 00:00:00';
\`\`\`

### Updates, deletes and merges

\`MERGE INTO\`, \`UPDATE\` and \`DELETE\` work on lakehouse tables, which makes CDC replication into the lake practical and enables regulatory deletions of individual customers' data. Formats use copy-on-write (rewrite affected files) or merge-on-read (write deletion markers, apply at read time) with different trade-offs for write versus read performance.

### Maintenance

Lakehouse tables need housekeeping:

- **Compaction**: merge small files into larger ones.
- **Snapshot expiry**: remove old snapshots and their unreferenced files to control storage.
- **Manifest and metadata cleanup**: keep metadata lean for fast planning.

Managed platforms and catalogues run these automatically; self-managed lakes schedule them as jobs.

### Catalogues

Engines find tables through a catalogue that maps names to metadata locations: Hive Metastore, AWS Glue, Unity Catalog, Iceberg REST catalogues, and others. The catalogue is what lets Spark, a warehouse, DuckDB and a Python job all see the same \`curated.orders\` table. Choosing a catalogue that your engines share is a key interoperability decision.

### When the lakehouse is the right choice

- Very large data where warehouse storage pricing would be prohibitive.
- Many engines needing the same data: SQL, Spark, ML frameworks.
- A desire to avoid lock-in through open formats.
- Streaming and CDC ingestion into a queryable store.

Smaller teams with modest data often find a plain warehouse simpler. The two are converging: major warehouses now read and write Iceberg tables, so the choice is less either-or than it was.
      `,
        [
          q('What do open table formats add to Parquet files in a lake?', [
            'Row-oriented storage for faster inserts',
            'Atomic commits, updates and time travel',
            'Automatic dashboards for every table',
            'Encryption of every file name',
          ], 1, 'A metadata layer over Parquet gives database-like guarantees on open storage.'),
          q('How does time travel work in a lakehouse table?', [
            'By keeping a full copy of the table for every day',
            'By re-running all pipelines from the start',
            'By reading an earlier snapshot\'s list of data files',
            'By storing timestamps in every column',
          ], 2, 'Snapshots record which files formed the table at each commit, so past versions can be read.'),
          q('Why do lakehouse tables need compaction?', [
            'Frequent writes create many small files that slow reads',
            'Parquet files expand over time',
            'Snapshots delete data unless compacted',
            'Catalogues require a fixed file count',
          ], 0, 'Merging small files restores efficient file sizes for readers.'),
        ]
      ),
      lesson('Partitioning, Clustering and File Layout', 13, `
How data is physically arranged decides how much of it a query must read. Good layout lets engines skip almost everything irrelevant; poor layout forces full scans of huge tables. Partitioning, clustering and sorting are the tools, and they apply in warehouses and lakes alike.

### Partitioning

Partitioning splits a table into segments by a column's value, typically a date:

\`\`\`text
orders/
  dt=2025-03-13/
  dt=2025-03-14/
  dt=2025-03-15/
\`\`\`

A query filtered on \`dt = '2025-03-15'\` reads one segment instead of the whole table. This is partition pruning, and it is the single most effective optimisation for large time-series tables.

Rules of thumb:

| Guideline | Reason |
|---|---|
| Partition by the column most queries filter on, usually a date | Maximises pruning |
| Keep partitions reasonably large (hundreds of MB to GB) | Too many tiny partitions slow planning and reading |
| Avoid high-cardinality partition columns (user ID) | Millions of partitions with tiny files |
| Partition by day, not hour, unless volume is very high | Balance between granularity and file count |

Table formats such as Iceberg support hidden partitioning, deriving partitions from a timestamp column automatically, so queries prune without users writing partition-specific filters.

### Clustering and sorting

Within partitions, ordering data by frequently filtered columns lets engines skip file blocks using min and max statistics:

\`\`\`text
Partition dt=2025-03-15, sorted by city:
  file 1: city from "Faisalabad" to "Islamabad"
  file 2: city from "Karachi" to "Lahore"
  file 3: city from "Multan" to "Sialkot"
Query WHERE city = 'Lahore' reads only file 2.
\`\`\`

Warehouses offer this as clustering keys (Snowflake), clustering columns (BigQuery) or sort keys (Redshift). Lakehouses use sorted writes and Z-ordering, which interleaves several columns so filters on any of them benefit.

Cluster on columns used in filters and joins with moderate cardinality: city, product category, customer segment. Clustering costs write time and periodic re-clustering, so apply it to large tables where the query benefit is measured.

### Choosing partition and cluster columns

\`\`\`text
Example: fact_orders, 2 billion rows
Common filters: order date (always), city (often), restaurant (sometimes)
Partition: order date (daily)
Cluster:   city, then restaurant_id
\`\`\`

Write down the top queries before deciding; layout optimised for queries nobody runs is wasted.

### Statistics and pruning in warehouses

Even without explicit clustering, warehouses collect min and max per block and prune automatically. Natural ordering helps: data loaded in date order is already roughly sorted by date. Periodically loaded batches keep this property; random updates degrade it, which is why re-clustering exists.

### Anti-patterns

| Anti-pattern | Consequence |
|---|---|
| Partitioning by a column no query filters on | No pruning, extra overhead |
| Over-partitioning (hour x region x type) | Thousands of tiny files, slow metadata |
| Filtering on a function of the partition column (\`YEAR(dt) = 2025\`) | Engines may not prune; filter on the column directly |
| Never compacting streaming output | Small-file explosion |

### Measuring

Warehouses report bytes scanned or partitions pruned per query; lakehouse engines report files read. Compare a query's scanned bytes with the table's size: a query on one day of a year-partitioned table should read roughly one-365th. When it reads far more, the layout or the filter is wrong. This check, done routinely, is how teams keep both latency and cost under control.
      `,
        [
          q('What does partition pruning achieve?', [
            'It compresses each partition further',
            'Queries filtered on the partition column read only the matching segments',
            'It deletes old partitions automatically',
            'It sorts data within files',
          ], 1, 'Skipping irrelevant partitions is the biggest saving for large time-series tables.'),
          q('Why avoid partitioning by user ID?', [
            'User IDs cannot be used in file paths',
            'Queries never filter by user',
            'It creates millions of tiny partitions and files',
            'Partitions must be dates',
          ], 2, 'High-cardinality partition keys explode the file count and slow every query.'),
          q('Why might WHERE YEAR(dt) = 2025 fail to prune partitions?', [
            'Applying a function to the column can prevent the engine from matching partitions',
            'Years are not valid filter values',
            'Functions are not allowed in WHERE clauses',
            'Partition columns cannot be dates',
          ], 0, 'Filtering directly on the partition column lets the engine map the filter to partitions.'),
        ]
      ),
      ],
      [
      q('Which pricing model bills by bytes read per query?', [
        'Reserved capacity',
        'Per data scanned',
        'Per compute time',
        'Per user seat',
      ], 1, 'Scan-based pricing makes column and partition pruning directly affect cost.'),
      q('Which format is best for raw landing of nested API payloads?', [
        'CSV with a comma delimiter',
        'JSON, converted to Parquet in the next step',
        'Excel workbooks with one sheet per day',
        'Plain text log lines',
      ], 1, 'JSON preserves the nested payload faithfully; Parquet then serves analytical reads.'),
      q('Which is a key benefit of open table formats for organisations?', [
        'They remove the need for a catalogue',
        'They only work with one vendor\'s engine',
        'Many engines can share the same tables on open storage',
        'They store data as rows for faster inserts',
      ], 2, 'Iceberg and similar formats let warehouses, Spark and other tools read and write shared tables.'),
      q('A query on one day of a daily-partitioned yearly table scans half the table. What is likely wrong?', [
        'The table is too small',
        'The warehouse is out of memory',
        'The filter or layout prevents pruning',
        'Parquet compression is disabled',
      ], 2, 'Pruning should read about one day\'s share; reading far more signals a layout or filter problem.'),
      ]
    ),
    chapter(
      'Transformation With dbt',
      'Understand why ELT with dbt became the standard for transformation, build models with sources and refs, add tests, documentation and lineage, and structure projects with incremental models for scale.',
      [
      lesson('The ELT Approach and Why dbt Won', 13, `
Transformation is where raw data becomes trustworthy tables. For years it lived in proprietary ETL tools or tangled SQL scripts run by cron. dbt (data build tool) changed the practice by applying software engineering to SQL transformations, and it has become the standard tool for the transformation layer in modern platforms.

### ELT in the warehouse

Chapter 1 introduced ELT: load raw data first, then transform inside the warehouse using SQL. The warehouse's own compute does the heavy work, and transformations are just SQL queries that create tables and views. dbt is the tool that organises those queries.

### What dbt does

dbt does not move data. It:

\`\`\`text
1. Takes SQL SELECT statements you write (models)
2. Resolves dependencies between them
3. Runs them in the warehouse in the right order, creating tables or views
4. Runs tests against the results
5. Generates documentation and a lineage graph
\`\`\`

A model is a file containing a SELECT; dbt wraps it in CREATE TABLE or CREATE VIEW and handles everything around it.

### Why it became the standard

| Problem before | dbt's answer |
|---|---|
| SQL scripts with no version control | Models live in Git with pull requests |
| Unknown dependencies; wrong run order | Dependencies declared with \`ref()\`; dbt builds the graph |
| No tests; broken data discovered by users | Tests declared in YAML, run on every build |
| No documentation | Descriptions in YAML, generated docs site with lineage |
| Copy-paste SQL | Macros and packages for reuse |
| One environment | Dev, CI and production targets with separate schemas |

It brought software practices, testing, review, modularity and documentation, to a discipline that lacked them, and it did so in plain SQL that analysts already knew. That combination is why adoption spread so fast.

### The analytics engineering role

dbt made a new role practical: the analytics engineer, who models data in SQL with engineering discipline, sitting between data engineers (who ingest) and analysts (who consume). Many data engineers also write dbt; the tool is shared ground.

### dbt Core and dbt Cloud

dbt Core is the open-source command-line tool. dbt Cloud is the vendor's hosted service adding a web IDE, scheduling, CI integration and a semantic layer. Core is run through orchestrators such as Airflow (chapter 7) in many teams; Cloud suits teams wanting a managed experience. The models are the same in both.

### Supported warehouses

dbt works with the major warehouses and lakehouse engines through adapters: Snowflake, BigQuery, Redshift, Databricks, PostgreSQL, DuckDB and many more. The same project can, with care, target different warehouses, which also makes local development on DuckDB against production on a cloud warehouse possible.

### What dbt is not

dbt is not for ingestion, orchestration of non-SQL tasks or streaming. It transforms data already in the warehouse, in batch. Pairing it with an ingestion tool and an orchestrator completes the picture, and knowing its boundary avoids forcing it into jobs it does not fit.

### A first taste

\`\`\`sql
-- models/staging/stg_orders.sql
SELECT
    id            AS order_id,
    customer_id,
    restaurant_id,
    status,
    total * 100   AS total_paisa,
    placed_at
FROM {{ source('sales_system', 'orders') }}
WHERE status IS NOT NULL
\`\`\`

Running \`dbt run\` creates \`stg_orders\` in the warehouse. The next lesson explains sources, refs and how models chain together.
      `,
        [
          q('What does dbt actually do with a model?', [
            'Moves data from a source system into the warehouse',
            'Wraps a SELECT in CREATE TABLE or VIEW and runs it in the warehouse in dependency order',
            'Streams events in real time',
            'Draws dashboards from the results',
          ], 1, 'dbt organises and executes SQL transformations inside the warehouse; it does not ingest data.'),
          q('Which practice did dbt bring to SQL transformation?', [
            'Version control, testing and documentation',
            'Real-time stream processing',
            'Automatic data extraction from APIs',
            'Replacement of SQL with Python',
          ], 0, 'Software engineering discipline applied to SQL is dbt\'s core contribution.'),
          q('What is dbt not designed for?', [
            'Creating tables in a warehouse',
            'Testing data',
            'Ingesting data from source systems',
            'Documenting models',
          ], 2, 'dbt transforms data already loaded; ingestion and orchestration are separate tools.'),
        ]
      ),
      lesson('Models, Sources and Refs', 14, `
A dbt project is a directory of models connected by references. Understanding how models refer to raw sources and to each other, and how dbt turns those references into a build graph, is the foundation for everything else in the tool.

### Project layout

\`\`\`text
bazaar_analytics/
  dbt_project.yml
  models/
    staging/
      sales_system/
        _sales_system__sources.yml
        _sales_system__models.yml
        stg_sales_system__orders.sql
        stg_sales_system__customers.sql
    intermediate/
      int_orders_with_customers.sql
    marts/
      core/
        fct_orders.sql
        dim_customers.sql
  tests/
  macros/
  seeds/
\`\`\`

### Sources

Sources declare the raw tables loaded by ingestion, so models never hard-code schema names:

\`\`\`yaml
# models/staging/sales_system/_sales_system__sources.yml
version: 2
sources:
  - name: sales_system
    schema: raw_sales
    tables:
      - name: orders
        loaded_at_field: _loaded_at
        freshness:
          warn_after: {count: 2, period: hour}
          error_after: {count: 6, period: hour}
      - name: customers
\`\`\`

\`{{ source('sales_system', 'orders') }}\` resolves to \`raw_sales.orders\`. Declaring freshness lets \`dbt source freshness\` detect stale ingestion.

### Refs

Models reference other models with \`ref()\`:

\`\`\`sql
-- models/marts/core/fct_orders.sql
SELECT
    o.order_id,
    o.customer_id,
    c.city AS customer_city,
    o.total_paisa,
    o.placed_at
FROM {{ ref('stg_sales_system__orders') }} o
LEFT JOIN {{ ref('stg_sales_system__customers') }} c
    ON c.customer_id = o.customer_id
\`\`\`

\`ref()\` does two things: it resolves to the correct schema and table for the current environment, and it records a dependency. dbt builds the directed acyclic graph (DAG) of all refs and runs models in order, in parallel where possible. Never reference a model by its raw table name; that breaks both environment handling and the graph.

### Materialisations

Each model is built as one of:

| Materialisation | Result | Use |
|---|---|---|
| view | A view; query runs at read time | Light staging models |
| table | A table rebuilt fully each run | Marts of manageable size |
| incremental | A table updated with new rows each run | Large facts (final lesson) |
| ephemeral | Inlined as a CTE into downstream models | Small reusable logic |

Set defaults per folder in \`dbt_project.yml\` and override per model in a config block.

### Environments and targets

\`profiles.yml\` defines targets: a \`dev\` target building into a personal schema, \`ci\` for pull requests, \`prod\` for production. The same models build into different schemas, so developers work safely on real data structures without touching production tables.

### Running

\`\`\`bash
dbt run                                  # build all models
dbt run --select stg_sales_system__orders+   # a model and everything downstream
dbt run --select +fct_orders             # everything upstream, then the model
dbt build                                # run, test, snapshot and seed in graph order
\`\`\`

Selection syntax lets you rebuild exactly what changed.

### Staging conventions

Staging models have one job per source table: rename columns to consistent names, cast types, convert units, light filtering. No joins, no business logic. This makes every source look consistent before modelling starts, and it is the layer most teams standardise most strictly.

### Seeds and macros

Seeds are small CSV files (country codes, mapping tables) loaded as tables. Macros are reusable SQL snippets written in Jinja, such as a function to convert currency units or generate a surrogate key, used across models. Packages, such as dbt_utils, provide well-tested macros and tests so teams do not reinvent them.
      `,
        [
          q('What does ref() do besides resolving a table name?', [
            'It runs the referenced model immediately',
            'It caches the referenced data in memory',
            'It records a dependency so dbt builds models in the right order',
            'It copies the referenced model\'s SQL into the current file',
          ], 2, 'References form the DAG that determines build order and parallelism.'),
          q('What is the job of a staging model?', [
            'Renaming, casting and lightly cleaning one source table',
            'Joining many sources into business metrics',
            'Ingesting data from an API',
            'Serving dashboards directly',
          ], 0, 'Staging standardises each source before any business logic is applied.'),
          q('What does declaring source freshness enable?', [
            'Faster query execution',
            'Automatic schema migration',
            'Row-level security',
            'Detecting stale ingestion before building on old data',
          ], 3, 'dbt source freshness checks how recently raw tables were loaded and warns or errors.'),
        ]
      ),
      lesson('Tests, Documentation and Lineage', 13, `
The reason dbt transformed data teams was less the SQL and more what surrounds it: tests that catch bad data before users see it, documentation generated from the code, and a lineage graph showing how every table is built. These features turn a pile of queries into a maintainable, trustworthy system.

### Declaring tests

Tests are declared in YAML alongside models:

\`\`\`yaml
# models/marts/core/_core__models.yml
version: 2
models:
  - name: fct_orders
    description: One row per completed order.
    columns:
      - name: order_id
        description: Primary key from the sales system.
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_id
      - name: status
        tests:
          - accepted_values:
              values: ['completed', 'cancelled', 'refunded']
\`\`\`

The four built-in tests, \`unique\`, \`not_null\`, \`accepted_values\` and \`relationships\`, cover the most common problems: duplicate keys, missing values, unexpected categories and broken joins.

### Custom and package tests

Business rules become singular tests, SQL files that return failing rows:

\`\`\`sql
-- tests/assert_order_total_positive.sql
SELECT order_id, total_paisa
FROM {{ ref('fct_orders') }}
WHERE total_paisa <= 0
\`\`\`

A test passes when the query returns no rows. Packages such as dbt_utils and dbt_expectations add generic tests for ranges, row counts, recency, expressions and more. Unit tests, supported in recent versions, run a model against fixed inputs and compare with expected output, ideal for complex logic.

### Running tests and acting on failures

\`\`\`bash
dbt test
dbt build     # tests run after each model; downstream models are skipped if a test fails
\`\`\`

With \`dbt build\`, a failing test on \`stg_orders\` stops \`fct_orders\` from being built on bad data. Tests can be configured as warnings for advisory checks and errors for critical ones. Store failures to a table for investigation with \`--store-failures\`.

### What to test, and where

| Layer | Tests |
|---|---|
| Sources | Freshness; not_null and unique on primary keys |
| Staging | Primary key unique and not_null; accepted values for statuses |
| Marts | Keys, relationships to dimensions, business rule assertions, row count sanity |

Test the properties the business depends on: every order has a customer, totals are positive, revenue by day is within a plausible range of yesterday's.

### Documentation

Descriptions written in the same YAML become a browsable docs site:

\`\`\`bash
dbt docs generate
dbt docs serve
\`\`\`

The site shows every model, its columns and descriptions, the SQL, and the lineage graph. Because documentation lives next to the code and is reviewed in the same pull request, it stays current far better than a separate wiki. Descriptions can be shared with \`doc()\` blocks for terms used in many places.

### Lineage

The lineage graph answers questions that used to take hours: what breaks if this source changes? Where does this dashboard's number come from? Which models must be rebuilt after a fix? Integrations push dbt lineage into catalogues (chapter 11), extending it from sources to dashboards.

### Tests in CI

A pull request pipeline builds the changed models and their dependents into a temporary schema and runs their tests, so broken logic never reaches production. "Slim CI" builds only what changed by comparing with the production manifest. This practice alone prevents most data incidents caused by transformation changes.

### Tests as a contract with consumers

Tests document what consumers can rely on. A dashboard team that knows \`fct_orders.order_id\` is tested unique can join to it confidently. Publishing test coverage alongside documentation turns the data platform from something used with caution into something used with trust.
      `,
        [
          q('How does a singular dbt test indicate failure?', [
            'By returning true',
            'By returning rows; a passing test returns none',
            'By raising a Python exception',
            'By writing to the log only',
          ], 1, 'Singular tests select violating rows, so any returned row is a failure.'),
          q('What happens in dbt build when a test on an upstream model fails?', [
            'The failing model is deleted',
            'All models are rebuilt from scratch',
            'Downstream models are skipped so they are not built on bad data',
            'Nothing; tests never affect builds',
          ], 2, 'Build stops propagation of bad data by skipping dependents of a failed test.'),
          q('Why does dbt documentation stay more current than a separate wiki?', [
            'dbt rewrites descriptions automatically',
            'Wikis cannot store SQL',
            'Descriptions live beside the code and are reviewed in the same pull requests',
            'The docs site refuses undocumented models',
          ], 2, 'Documentation changes travel with code changes, so they are reviewed and updated together.'),
        ]
      ),
      lesson('Incremental Models and Project Structure', 13, `
Rebuilding a two-billion-row fact table from scratch every hour is impossible; incremental models process only new or changed data. Combined with a clear project structure and snapshots for history, they let dbt projects scale from a handful of models to thousands without collapsing under their own weight.

### Incremental models

\`\`\`sql
{{ config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge'
) }}

SELECT
    order_id,
    customer_id,
    total_paisa,
    status,
    updated_at
FROM {{ ref('stg_sales_system__orders') }}
{% if is_incremental() %}
WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
\`\`\`

On the first run, the model builds the full table. On later runs, \`is_incremental()\` is true, and only rows newer than the table's current maximum are selected and merged by \`order_id\`. The \`{{ this }}\` reference points to the model's own existing table.

### Strategies

| Strategy | Behaviour | Use |
|---|---|---|
| append | Insert new rows only | Immutable events |
| merge | Update matching keys, insert new | Mutable records with a key |
| delete+insert | Delete matching partitions or keys, insert fresh | Partition-level reloads |
| insert_overwrite | Replace whole partitions | Lakehouse and BigQuery partitioned tables |

Apply the overlap lesson from chapter 4: subtract a margin from the watermark filter to catch late-arriving rows, and rely on the merge to handle repeats.

### Full refresh

\`\`\`bash
dbt run --select fct_orders --full-refresh
\`\`\`

Rebuilds the table from scratch. Needed after logic changes, schema changes or suspected corruption. Schedule occasional full refreshes for critical tables to correct any drift, when compute allows.

### Snapshots for history

Snapshots implement Type 2 slowly changing dimensions (chapter 3) declaratively:

\`\`\`sql
{% snapshot customers_snapshot %}
{{ config(
    target_schema='snapshots',
    unique_key='customer_id',
    strategy='timestamp',
    updated_at='updated_at'
) }}
SELECT * FROM {{ source('sales_system', 'customers') }}
{% endsnapshot %}
\`\`\`

Each \`dbt snapshot\` run compares the source with the snapshot table and adds new versioned rows with \`dbt_valid_from\` and \`dbt_valid_to\`. Dimensions built from snapshots carry full history with no custom code.

### Project structure that scales

\`\`\`text
models/
  staging/      one folder per source; stg_<source>__<table>
  intermediate/ int_<purpose>; reusable joins and calculations, not exposed
  marts/        fct_ and dim_ tables by business area; the public interface
\`\`\`

Conventions to hold:

- Staging: one model per source table, no joins.
- Intermediate: complex logic broken into readable steps.
- Marts: what consumers query; documented and tested thoroughly.
- Naming prefixes make a model's role obvious from its name.
- Group YAML files with their models; keep one source file per system.

### Performance habits

- Prefer incremental for large facts; keep dimensions as tables rebuilt daily.
- Use views for light staging to avoid storing duplicates, or tables where staging is queried heavily.
- Limit ephemeral models; they can make downstream SQL huge.
- Run with sensible thread counts to parallelise the graph.
- Tag models (\`hourly\`, \`daily\`) and schedule selections by tag.

### Governance inside the project

Larger projects use model contracts (enforced column types), model versions (evolving a public model without breaking consumers), groups with access levels, and exposures that declare which dashboards depend on which models. These features let many teams share one project, or several projects, with clear interfaces, the same idea as service contracts in software.

### Deploying

Production runs happen on a schedule through an orchestrator or dbt Cloud, usually: \`dbt source freshness\`, then \`dbt build\` for the selected models, with alerts on failures. Chapter 7 shows the Airflow version of this.
      `,
        [
          q('What does is_incremental() control in a model?', [
            'Whether the model is documented',
            'Whether the filter for new rows is applied, after the first full build',
            'The number of threads used',
            'Which warehouse the model targets',
          ], 1, 'The macro is true on later runs, enabling the incremental filter while the first run builds everything.'),
          q('Which dbt feature implements Type 2 slowly changing dimensions?', [
            'Seeds',
            'Exposures',
            'Snapshots',
            'Macros',
          ], 2, 'Snapshots version source rows over time with validity dates.'),
          q('What is the role of the intermediate layer?', [
            'Storing raw copies of every source table',
            'Reusable steps of complex logic, kept internal',
            'Serving dashboards directly to business users',
            'Ingesting data from external APIs',
          ], 1, 'Intermediate models keep marts readable by isolating complex joins and calculations.'),
        ]
      ),
      ],
      [
      q('Where does dbt run its transformations?', [
        'On the developer\'s laptop in memory',
        'Inside the warehouse, using its compute',
        'In a separate Spark cluster always',
        'In the source database',
      ], 1, 'dbt sends SQL to the warehouse, which does the work; this is the ELT pattern.'),
      q('Which built-in test checks that every customer_id in orders exists in the customer dimension?', [
        'unique',
        'not_null',
        'accepted_values',
        'relationships',
      ], 3, 'The relationships test verifies referential integrity between models.'),
      q('What is the purpose of "slim CI" in a dbt project?', [
        'Reducing the number of models permanently',
        'Building and testing only changed models and their dependents in pull requests',
        'Deleting old tables from production',
        'Skipping all tests to save time',
      ], 1, 'Comparing with the production manifest limits CI to what changed, keeping checks fast.'),
      q('Why subtract a margin from the watermark in an incremental model?', [
        'To make the model run faster',
        'Because dbt requires it on every model',
        'To catch rows that arrive late',
        'To reduce the table\'s size on disk',
      ], 2, 'Out-of-order commits can have earlier timestamps; an overlap window with merge keeps data complete.'),
      ]
    ),
    chapter(
      'Orchestration With Airflow',
      'Model pipelines as DAGs of tasks with schedules and data intervals, write production-ready Airflow DAGs, use sensors and backfills with idempotent tasks, and run Airflow reliably while knowing when an alternative orchestrator fits better.',
      [
      lesson('DAGs, Tasks and Scheduling', 13, `
A data platform runs dozens or hundreds of steps: extract from each source, load, run dbt, refresh extracts, send reports. They must run in the right order, on schedule, with retries when something fails and alerts when retries are not enough. An orchestrator does this, and Apache Airflow is the most widely used one.

### What an orchestrator does

| Responsibility | Example |
|---|---|
| Ordering | Run dbt only after all sources have loaded |
| Scheduling | Every hour, or daily at 02:00 Pakistan time |
| Retries | Retry an API extract three times with a delay |
| Parallelism | Load ten sources at once, within limits |
| Visibility | See which runs succeeded, failed or are late |
| Alerting | Notify the team when a pipeline fails |
| Backfills | Re-run a pipeline for past dates |

Cron can start scripts on a schedule, but it knows nothing about dependencies, retries or history. Orchestrators add all of these.

### DAGs

Airflow represents a pipeline as a DAG, a directed acyclic graph of tasks. Directed means dependencies have a direction; acyclic means no loops:

\`\`\`text
extract_orders ----\\
extract_customers --+--> run_dbt_staging --> run_dbt_marts --> refresh_dashboard
extract_payments --/
\`\`\`

DAGs are defined in Python files placed in Airflow's DAG folder. The scheduler reads them, creates runs according to their schedules, and sends tasks to workers.

### A minimal DAG

\`\`\`python
from datetime import datetime
from airflow.decorators import dag, task

@dag(
    schedule="0 2 * * *",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["sales"],
)
def daily_sales():

    @task
    def extract_orders():
        ...

    @task
    def extract_customers():
        ...

    @task
    def run_transformations():
        ...

    [extract_orders(), extract_customers()] >> run_transformations()

daily_sales()
\`\`\`

The decorator-based TaskFlow style is the modern way to write Python tasks; classic operators remain common for running SQL, shell commands and provider integrations.

### Operators and providers

Operators are task templates. Providers package operators for specific systems: warehouses, cloud storage, Kubernetes, Slack and many more. Using a provider operator, such as one that runs a SQL statement in the warehouse, avoids writing connection code yourself. Connections and credentials are stored in Airflow's connection store or a secrets backend, never in DAG code.

### Schedules and data intervals

A schedule can be a cron expression, a preset such as \`@daily\`, or a time interval. Each run covers a data interval: a daily run scheduled for 2 a.m. on 15 March processes the interval from 14 March to 15 March. Airflow passes the interval's start and end to tasks, and well-written tasks use those values rather than the current time, so re-running a past interval processes exactly that period. This is the key to backfills, covered in the third lesson.

Time zones matter: set the DAG's schedule in an explicit zone, such as Asia/Karachi, so "2 a.m." means what the business expects.

### Event-based scheduling

Besides time, DAGs can be triggered when data they depend on is updated. Airflow tracks these dependencies as assets (called datasets in older versions): when an upstream DAG updates the \`raw.orders\` asset, a downstream DAG that consumes it starts automatically. This links pipelines by data rather than by guessed timings.

### The UI

Airflow's web interface shows DAGs, run history, task logs, durations and dependencies. It is where on-call engineers look first when something is late. Good task names and tags make it usable; a DAG with tasks named \`task_1\` to \`task_40\` is not.
      `,
        [
          q('What does an orchestrator add that cron does not?', [
            'The ability to start a script at a fixed time',
            'Dependencies, retries, history and alerting',
            'A faster way to run Python code',
            'Storage for the warehouse tables',
          ], 1, 'Cron only triggers commands; orchestrators manage order, failures and visibility.'),
          q('Why should tasks use the data interval rather than the current time?', [
            'Re-running a past interval then processes exactly that period',
            'The current time is not available in Python',
            'Airflow forbids reading the system clock',
            'Intervals make tasks run faster',
          ], 0, 'Interval-based logic makes runs reproducible and backfills correct.'),
          q('What does it mean that a DAG is acyclic?', [
            'Tasks cannot have any dependencies',
            'The DAG runs only once in its lifetime',
            'Dependencies never loop back to an earlier task',
            'Every task runs in parallel',
          ], 2, 'A directed acyclic graph allows ordering without cycles that would never finish.'),
        ]
      ),
      lesson('Writing Production DAGs', 14, `
A DAG that works on a laptop is not the same as one that runs reliably every night for years. Production DAGs share a set of habits: light files that parse quickly, idempotent tasks, sensible retries, clear alerting and configuration kept outside the code. These habits prevent most orchestration incidents.

### Keep DAG files light

The scheduler parses every DAG file frequently, not only when it runs. Code at the top level of the file executes on every parse:

\`\`\`python
# Bad: runs a database query every time the file is parsed
tables = get_tables_from_database()

# Good: fetch inside a task, at run time
@task
def list_tables():
    return get_tables_from_database()
\`\`\`

Heavy top-level code slows the scheduler for every DAG in the installation. Keep imports lean and move work into tasks.

### Airflow orchestrates; it should not compute

Tasks should trigger work in systems built for it: run SQL in the warehouse, submit a Spark job, start a container, call dbt. Loading gigabytes into an Airflow worker's memory to transform them turns the orchestrator into a fragile compute cluster. When Python processing is needed, run it in an isolated container, for example with a Kubernetes pod operator, so dependencies and resources are controlled.

### Retries and timeouts

\`\`\`python
default_args = {
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "execution_timeout": timedelta(hours=1),
}
\`\`\`

Retries recover from transient failures such as network blips and rate limits. Timeouts stop a hung task from blocking the pipeline forever. Tune both per task: an API extract may need generous retries, while a failed data quality check should not be retried at all, since retrying will not change the data.

### Alerting

Failures must reach someone:

- Failure callbacks send messages to Slack, Microsoft Teams or email with the DAG, task, run date and a link to logs.
- Critical pipelines page an on-call engineer; non-critical ones create a ticket.
- Alert on lateness too: a pipeline that has not finished by its expected time is a problem even if nothing has failed yet.

A useful alert says what failed, for which date, and where to look. A useless one says "Task failed".

### Configuration and secrets

| Put here | Examples |
|---|---|
| Connections or a secrets backend | Database passwords, API tokens |
| Airflow variables or environment config | Bucket names, environment flags |
| Code | Logic, structure, defaults |

Never hard-code credentials in DAG files; they end up in version control and logs. Secrets backends integrate Airflow with cloud secret managers.

### Passing data between tasks

XComs pass small values between tasks, such as a file path, a row count or a list of partition names. They are stored in Airflow's metadata database, so passing large datasets through them overloads it. Pass references (paths in object storage, table names) rather than the data itself.

### Resource control

Pools limit how many tasks use a shared resource at once, for example allowing only three concurrent queries against a fragile source database. Concurrency settings per DAG prevent one large pipeline from starving others. Priority weights ensure critical DAGs run first when workers are busy.

### Testing DAGs

- A test that imports every DAG file catches syntax errors and missing imports before deployment.
- Unit tests cover task logic, which lives in ordinary functions.
- A staging Airflow environment runs DAGs against test data before production.
- CI validates DAGs on every pull request.

### Structure and ownership

Group DAGs by domain, tag them with the owning team, and document each DAG's purpose in its description. When a pipeline breaks, the first question is "who owns this?", and the answer should be visible in the UI.
      `,
        [
          q('Why should heavy work never run at the top level of a DAG file?', [
            'Airflow deletes files with top-level code',
            'Top-level code cannot import libraries',
            'The file is parsed often, so that work slows the scheduler',
            'Tasks cannot read top-level variables',
          ], 2, 'The scheduler re-parses DAG files frequently, executing any top-level code each time.'),
          q('What should an Airflow task do with gigabytes of data?', [
            'Load it into the worker\'s memory and transform it',
            'Pass it to the next task through XCom',
            'Trigger processing in a system built for it',
            'Split it across several DAG files',
          ], 2, 'Airflow orchestrates; warehouses, Spark or containers should do the heavy computation.'),
          q('Why should XComs carry references rather than datasets?', [
            'They live in the metadata database, which large data would overload',
            'XComs cannot store strings',
            'References are encrypted automatically',
            'Tasks cannot read XComs larger than one row',
          ], 0, 'Passing paths or table names keeps the metadata database small and healthy.'),
        ]
      ),
      lesson('Sensors, Backfills and Idempotent Tasks', 13, `
Real pipelines wait for things: a file from a partner, an upstream system's nightly export, another team's table. They also need to re-run history when bugs are fixed or new columns are added. Sensors, backfills and idempotent task design handle both, and getting them right is what makes a pipeline recoverable.

### Sensors

A sensor is a task that waits until a condition is true:

\`\`\`python
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor

wait_for_file = S3KeySensor(
    task_id="wait_for_partner_file",
    bucket_key="s3://partner-drop/sales/{{ ds }}/sales.csv",
    mode="reschedule",
    poke_interval=300,
    timeout=6 * 60 * 60,
)
\`\`\`

| Setting | Meaning |
|---|---|
| \`mode="poke"\` | The sensor holds a worker slot while waiting |
| \`mode="reschedule"\` | The sensor releases its slot between checks |
| Deferrable operators | Waiting is handed to a lightweight trigger process |
| \`timeout\` | Give up after this long and fail visibly |

Long waits in poke mode can fill every worker slot with idle sensors, blocking real work. Use reschedule mode or deferrable operators for anything that may wait more than a few minutes, and always set a timeout so a missing file raises an alert instead of waiting forever.

### Prefer data-aware triggers

Where the upstream is another Airflow DAG, asset-based scheduling (the first lesson) is cleaner than sensors polling for tables: the downstream starts when the upstream reports its output updated.

### Idempotent tasks

Every task may run more than once: retries, manual re-runs, backfills. An idempotent task produces the same result however many times it runs for the same interval:

\`\`\`text
Not idempotent: INSERT INTO daily_sales SELECT ... WHERE date = today
                (a retry inserts the day twice)
Idempotent:     DELETE the interval's rows, then INSERT, in one transaction
                or MERGE on a key
                or overwrite the interval's partition
\`\`\`

Combine this with using the data interval instead of \`now()\`:

\`\`\`python
@task
def load_orders(data_interval_start=None, data_interval_end=None):
    run_sql(
        "DELETE FROM staging.orders WHERE placed_at >= %s AND placed_at < %s",
        (data_interval_start, data_interval_end),
    )
    run_sql(
        "INSERT INTO staging.orders SELECT ... WHERE placed_at >= %s AND placed_at < %s",
        (data_interval_start, data_interval_end),
    )
\`\`\`

Run it once or five times for 14 March: the result is 14 March's orders, exactly once.

### Backfills

A backfill runs a DAG for a range of past intervals, for example after fixing a transformation bug discovered today that affected the last three months:

\`\`\`text
1. Fix the code and deploy.
2. Backfill the affected date range.
3. Airflow creates one run per interval, each processing its own period.
4. Limit concurrency so the backfill does not overload sources or the warehouse.
\`\`\`

Airflow supports backfills from the command line and, in recent versions, from the UI and API. Backfills only work if tasks are interval-based and idempotent; a task that uses the current date processes today's data ninety times.

### Catchup

When a DAG is deployed with a \`start_date\` in the past, \`catchup\` decides whether Airflow automatically creates runs for every missed interval. Set it explicitly: \`catchup=False\` for most pipelines, so deployment does not trigger hundreds of runs; use explicit backfills when history is needed.

### Late and missing data

When upstream data arrives late, a pipeline that ran on schedule has processed an incomplete interval. Options include sensors that wait for completeness markers, re-processing a trailing window each run, or clearing and re-running the affected interval when late data lands. Choose deliberately per pipeline.
      `,
        [
          q('Why use reschedule mode for a sensor that may wait hours?', [
            'Poke mode cannot check cloud storage',
            'Reschedule mode frees the worker slot between checks',
            'Reschedule mode makes the file arrive sooner',
            'Poke mode has no timeout setting',
          ], 1, 'Poking holds a slot the whole time; long waits in that mode starve other tasks.'),
          q('Which load is idempotent?', [
            'Inserting today\'s rows without checks',
            'Appending all rows found since the last run',
            'Inserting rows selected with now()',
            'Replacing the interval\'s rows in one transaction',
          ], 3, 'Deleting then inserting the interval, or merging on a key, gives the same result on every re-run.'),
          q('Why set catchup explicitly when deploying a DAG with a past start date?', [
            'To avoid triggering a run for every missed interval unintentionally',
            'Airflow refuses DAGs without catchup',
            'Catchup controls the retry count',
            'It changes the DAG\'s time zone',
          ], 0, 'Without care, deployment can create hundreds of historical runs at once.'),
        ]
      ),
      lesson('Airflow Operations and Alternatives', 13, `
Running Airflow well is its own job: the scheduler, workers, metadata database and web server all need care as the number of DAGs grows. At the same time, Airflow is not the only orchestrator, and newer tools make different design choices. Knowing both the operational picture and the alternatives helps a team choose and run its orchestration sensibly.

### Airflow's components

| Component | Role |
|---|---|
| Scheduler | Parses DAGs, creates runs, queues tasks when dependencies are met |
| Executor and workers | Run the tasks |
| Metadata database | Stores DAG runs, task states, connections and history |
| Web server or API server | UI and API for monitoring and control |
| Triggerer | Runs deferrable tasks' waiting logic efficiently |

### Executors

| Executor | How tasks run | Fits |
|---|---|---|
| Local | Processes on the scheduler machine | Small installations |
| Celery | A pool of worker machines pulling from a queue | Medium to large, steady workloads |
| Kubernetes | Each task in its own pod | Isolation, varied resource needs, elastic scale |

The Kubernetes executor, or running heavy tasks in pods from any executor, gives each task its own dependencies and resources, avoiding the "one giant Python environment" problem.

### Managed Airflow

Running Airflow yourself means upgrades, scaling, backups of the metadata database and security patches. Managed services, such as Amazon MWAA, Google Cloud Composer and Astronomer, handle much of this. For small teams, managed Airflow usually costs less than the engineering time to operate it.

### Operational habits

- Keep the metadata database healthy: regular backups, and periodic cleanup of old run history.
- Watch scheduler health: parse times, queue lengths and heartbeat.
- Upgrade regularly; major versions bring significant changes, so test DAGs in staging first.
- Deploy DAGs through CI/CD from Git, never by editing files on servers.
- Monitor task durations; a DAG that slowly takes longer each week is heading for a missed deadline.

### When Airflow struggles

Airflow was designed for scheduled batch workflows. It is less natural for:

- Very high-frequency or low-latency workloads, where streaming systems fit better.
- Pipelines that are best described as data assets and their dependencies rather than tasks.
- Local development and testing, which has historically been heavier than with newer tools.
- Large volumes of tiny, short tasks, where scheduling overhead dominates.

### Alternatives

| Tool | Character |
|---|---|
| Dagster | Asset-oriented: you define the tables and files to produce, and it derives the graph; strong typing, testing and lineage |
| Prefect | Pythonic flows with dynamic workflows and a lighter development experience |
| dbt Cloud scheduler | Enough for teams whose pipeline is mostly dbt plus a managed connector |
| Cloud-native workflows | AWS Step Functions, Google Workflows, Azure Data Factory for teams deep in one cloud |
| Kestra, Mage and others | Newer options with different trade-offs |

### Choosing

\`\`\`text
Many teams, many pipelines, large ecosystem needs     -> Airflow (often managed)
Asset-centric platform, strong lineage and testing    -> Dagster
Python-heavy, dynamic flows, lighter operations       -> Prefect
Small team, mostly ELT with dbt                       -> managed connector + dbt Cloud
Deeply invested in one cloud's services               -> that cloud's orchestrator
\`\`\`

Airflow's strength is its maturity, community and huge library of providers; its size is also its cost. Whatever the choice, the principles hold: interval-based idempotent tasks, clear dependencies, alerting and ownership.

### Orchestration is the control plane

The orchestrator is where a data platform's reliability is visible and managed. Treat it as critical infrastructure: monitored, backed up, deployed through CI and owned by someone. When it is down, every pipeline stops.
      `,
        [
          q('What does the Kubernetes executor provide?', [
            'A single shared Python environment for all tasks',
            'Faster parsing of DAG files',
            'Each task in its own pod with its own resources',
            'Automatic data quality checks',
          ], 2, 'Pod-per-task isolation lets tasks have different dependencies and resource needs.'),
          q('Why do small teams often choose managed Airflow?', [
            'Managed Airflow has no scheduler',
            'It costs less than the time to operate it themselves',
            'Self-hosted Airflow cannot run dbt',
            'Managed services do not require DAG files',
          ], 1, 'Upgrades, scaling and backups are handled by the provider, saving scarce engineering time.'),
          q('What is distinctive about Dagster\'s approach?', [
            'It only runs SQL',
            'It replaces the data warehouse',
            'It has no user interface',
            'It is asset-oriented, deriving the graph from data outputs',
          ], 3, 'Dagster models the tables and files to produce, with lineage and testing built around them.'),
        ]
      ),
      ],
      [
      q('How should a daily DAG\'s schedule be set for a Pakistani business?', [
        'In an explicit time zone such as Asia/Karachi',
        'In the server\'s default time zone',
        'Always in UTC without conversion',
        'Using the developer\'s laptop time',
      ], 0, 'An explicit zone ensures "2 a.m." matches the business\'s expectation.'),
      q('Where should an API token used by a DAG be stored?', [
        'In the DAG file as a constant',
        'In an XCom for other tasks to read',
        'In Airflow connections or a secrets backend',
        'In the task\'s log output',
      ], 2, 'Credentials in code leak into version control and logs; secrets stores keep them safe.'),
      q('A backfill of 90 days processes today\'s data 90 times. What is wrong?', [
        'The backfill concurrency is too high',
        'Catchup was set to true',
        'The sensor timeout is too short',
        'Tasks use the current date instead of the data interval',
      ], 3, 'Interval-based tasks are required for backfills to process each historical period.'),
      q('Which should not be retried automatically?', [
        'An API extract that hit a rate limit',
        'A failed data quality check',
        'A network timeout to the warehouse',
        'A transient connection reset',
      ], 1, 'Retrying a quality check will not change the data; it needs investigation, not repetition.'),
      ]
    ),
    chapter(
      'Streaming Data',
      'Use Kafka to move event streams reliably, understand event time, windows, watermarks and state in stream processing, build a streaming pipeline from change capture to real-time features, and land streams in the warehouse or lakehouse.',
      [
      lesson('Event Streaming With Kafka', 13, `
When data must move continuously, as events happen, the backbone of most platforms is Apache Kafka or a compatible system. Kafka stores streams of events durably and lets many systems read them independently. Understanding its core concepts is essential even for teams whose pipelines are mostly batch, because events increasingly arrive this way.

### The core concepts

| Concept | Meaning |
|---|---|
| Event | A record of something that happened: key, value, timestamp, headers |
| Topic | A named stream of events, such as \`payments.completed\` |
| Partition | A topic is split into ordered partitions for parallelism |
| Offset | An event's position within a partition |
| Producer | An application that writes events to topics |
| Consumer | An application that reads events |
| Consumer group | Consumers sharing the work of reading a topic |
| Broker | A Kafka server; a cluster has several |

### How it fits together

\`\`\`text
Wallet app -> producer -> topic payments.completed (6 partitions, replicated 3x)
                              |-> consumer group fraud-scoring   (reads in real time)
                              |-> consumer group warehouse-loader (writes to lakehouse)
                              |-> consumer group notifications    (sends receipts)
\`\`\`

Each consumer group tracks its own offsets, so the fraud system and the warehouse loader read the same events independently, at their own pace. Adding a new consumer never affects the others.

### Partitions, keys and ordering

Events with the same key always go to the same partition, and order is guaranteed only within a partition. Keying payments by \`wallet_id\` keeps each wallet's events in order while spreading wallets across partitions. The number of partitions caps a consumer group's parallelism: six partitions allow at most six active consumers in one group.

### Durability and retention

Events are written to disk and replicated across brokers, typically three copies, so a broker failure loses nothing. Unlike a traditional queue, Kafka keeps events after they are read, for a configured retention period (days, weeks or indefinitely). This allows replay: a new consumer can process history, and a buggy consumer can rewind its offsets and reprocess after a fix.

### Schemas

Events are contracts between producers and many consumers. A schema registry stores schemas (commonly Avro, Protobuf or JSON Schema) and enforces compatibility rules, so a producer cannot publish a change that breaks consumers. Without schemas, one team renaming a field can silently break every downstream pipeline.

### Kafka Connect

Kafka Connect runs connectors that move data between Kafka and other systems without custom code: source connectors (databases through CDC, message queues) and sink connectors (warehouses, object storage, search engines). Debezium, the widely used CDC tool from chapter 4, runs on Kafka Connect.

### Running Kafka

Kafka clusters need careful operation: capacity planning, partition balancing, upgrades and monitoring of consumer lag. Recent Kafka versions manage cluster metadata internally without a separate ZooKeeper ensemble, which simplifies operations. Managed services such as Confluent Cloud, Amazon MSK and Aiven, and Kafka-compatible systems such as Redpanda, take much of the burden away. Cloud-native alternatives include Amazon Kinesis and Google Pub/Sub.

### Consumer lag

Lag is how far a consumer group is behind the latest events. It is the key health metric: steady low lag means consumers keep up; growing lag means they are falling behind and data freshness is slipping. Alert on it.
      `,
        [
          q('Where does Kafka guarantee event ordering?', [
            'Across all partitions of a topic',
            'Across all topics in a cluster',
            'Within a single partition',
            'Only for events with no key',
          ], 2, 'Order holds within a partition, which is why related events share a key.'),
          q('How can two systems read the same topic independently?', [
            'By using different consumer groups with their own offsets',
            'By creating two copies of the topic',
            'By reading at different times of day',
            'By using different brokers',
          ], 0, 'Each consumer group tracks its own position, so readers never interfere with each other.'),
          q('What does a schema registry prevent?', [
            'Brokers from failing',
            'Consumers from reading old events',
            'Topics from having partitions',
            'Producers publishing changes that break consumers',
          ], 3, 'Compatibility rules block schema changes that downstream consumers cannot handle.'),
        ]
      ),
      lesson('Stream Processing Concepts: Time, Windows and State', 14, `
Processing a stream is harder than processing a batch because the data never ends and does not arrive in order. A batch job sees all of yesterday's data at once; a stream processor must decide, while events are still arriving, when a result is complete enough to emit. A small set of concepts, time, windows, watermarks and state, explains how stream processors handle this.

### Event time versus processing time

| Time | Meaning |
|---|---|
| Event time | When the event actually happened, recorded by the source |
| Processing time | When the stream processor sees it |

A payment made at 23:59 on a phone with weak signal may arrive at 00:03. By processing time it belongs to the next day; by event time, to the day it happened. Correct business results almost always need event time, which means the processor must handle events that arrive late and out of order.

### Windows

Aggregations over infinite streams are computed over windows:

| Window | Behaviour | Example |
|---|---|---|
| Tumbling | Fixed, non-overlapping intervals | Payments per minute |
| Hopping (sliding) | Fixed length, overlapping, advancing by a step | Payments in the last 10 minutes, updated every minute |
| Session | Grouped by activity with a gap timeout | A user's app session ending after 30 minutes idle |

\`\`\`text
Tumbling 1-minute windows:  [10:00-10:01) [10:01-10:02) [10:02-10:03)
Hopping 10 min every 1 min: [10:00-10:10) [10:01-10:11) [10:02-10:12) ...
\`\`\`

### Watermarks

If events can arrive late, when is the 10:00 to 10:01 window finished? A watermark is the processor's estimate that no more events older than a given time will arrive:

\`\`\`text
Watermark = latest event time seen - allowed lateness (for example 2 minutes)
When the watermark passes 10:01, the [10:00-10:01) window is emitted.
\`\`\`

A longer allowed lateness gives more complete results but delays them; a shorter one is faster but misses more late events. Events arriving after the watermark can be dropped, sent to a side output for correction, or used to update results that were already emitted, depending on the system and the use case.

### State

Many stream computations need memory of the past: counts per window, the last location of each driver, running totals per wallet. This is state. Stream processors keep state locally for speed and checkpoint it to durable storage, so that after a failure they restore state and resume from the matching offsets without losing or double-counting.

State grows with the number of keys and the window lengths. Expire state that is no longer needed, such as closed sessions, or it will grow without limit.

### Delivery guarantees

Stream processors offer at-least-once or exactly-once processing. Frameworks such as Apache Flink achieve exactly-once for their internal state through checkpoints aligned with source offsets; the guarantee extends to outputs only if the sink supports transactions or writes are idempotent. The chapter 6 rule from system design holds: assume duplicates at the edges and make sinks idempotent.

### The main frameworks

| Framework | Character |
|---|---|
| Apache Flink | Powerful, low latency, rich event-time and state support; widely used for serious streaming |
| Kafka Streams | A library inside Java applications, tightly integrated with Kafka |
| Spark Structured Streaming | Micro-batch streaming with the Spark API; natural for Spark-based teams |
| Streaming SQL engines | SQL over streams, lowering the skill barrier |

### Keep it simple where possible

Many "streaming" needs are simple: move events from Kafka into storage, or filter and enrich them. These need little state and no complex windows. Reserve full stream processing for genuine real-time computations, such as fraud features or live aggregates, where the concepts above are worth their complexity.
      `,
        [
          q('Why do correct business results usually need event time?', [
            'Events arrive late and out of order, so processing time misplaces them',
            'Processing time is not recorded by any system',
            'Event time uses less memory',
            'Watermarks only work with processing time',
          ], 0, 'Using when the event happened keeps late events in the right period.'),
          q('Which window type groups a user\'s activity until they are idle for 30 minutes?', [
            'Tumbling',
            'Hopping',
            'Fixed',
            'Session',
          ], 3, 'Session windows close after a gap of inactivity, matching user sessions.'),
          q('What is the trade-off in setting a longer allowed lateness?', [
            'Less state is kept in memory',
            'Results are more complete but emitted later',
            'Windows become shorter',
            'Events arrive in order automatically',
          ], 1, 'Waiting longer captures more late events at the cost of delayed output.'),
        ]
      ),
      lesson('Building a Streaming Pipeline', 13, `
Concepts become clearer in a concrete pipeline. This lesson walks through a realistic design for a Pakistani digital wallet: detecting suspicious payment patterns within seconds, while also feeding every payment into the analytics platform. It combines change data capture, Kafka, stream processing and idempotent sinks.

### The goal

\`\`\`text
Requirement 1: flag wallets that make more than 10 transfers to new recipients
               within 5 minutes, and alert the risk team within seconds
Requirement 2: every payment reaches the lakehouse within minutes for analytics
Requirement 3: no payment lost; duplicates tolerated only where sinks dedupe
\`\`\`

### The architecture

\`\`\`text
Payments database (PostgreSQL)
    -> Debezium CDC connector (Kafka Connect)
    -> topic payments.cdc (keyed by wallet_id)
         |-> Flink job: fraud features and rules
         |      -> topic risk.alerts -> alerting service -> risk team
         |      -> feature store (latest features per wallet)
         |-> sink connector -> lakehouse table raw.payments (Iceberg)
\`\`\`

### Step 1: capture changes

Debezium reads PostgreSQL's log and publishes each insert and update to \`payments.cdc\`, keyed by \`wallet_id\` so all of a wallet's payments are ordered in one partition. The application is untouched and the database sees almost no extra load.

### Step 2: compute features in the stream

The Flink job consumes payments and maintains state per wallet:

\`\`\`text
For each wallet (keyed state):
  - set of recipients seen in the last 30 days
  - count of transfers to new recipients in a 5-minute hopping window
On each payment:
  - update state
  - if count > 10 within the window: emit alert to risk.alerts
\`\`\`

Event time with a short allowed lateness keeps windows accurate while alerts stay fast. Checkpoints every few seconds let the job recover state after failures.

### Step 3: deliver alerts reliably

Alerts go to their own topic rather than directly to email or chat, so the alerting service can deduplicate by alert ID, retry deliveries and record acknowledgements. The stream job stays simple, and a slow notification provider cannot back up the fraud computation.

### Step 4: land everything for analytics

A sink connector writes \`payments.cdc\` into an Iceberg table, committing every few minutes. The warehouse and dbt then model it like any other source. The same events serve real-time and batch consumers: the streaming backbone pattern from chapter 1.

### Handling the hard parts

| Challenge | Handling |
|---|---|
| Duplicates from CDC or retries | Sinks merge on payment ID; alerts dedupe on alert ID |
| Late events | Allowed lateness in windows; late events logged to a side topic |
| Schema changes in the database | Schema registry with compatibility checks; Debezium handles evolution |
| Reprocessing after a logic bug | Reset the Flink job's offsets and replay from Kafka retention |
| Hot wallets | Monitor partition skew; very active merchant wallets may need special handling |
| Backpressure | Kafka buffers; monitor consumer lag and scale the job's parallelism |

### Testing streaming logic

- Unit test the rule logic with sequences of events, including out-of-order ones.
- Use the framework's test harness to simulate time and watermarks.
- Run an end-to-end test environment with a small Kafka cluster in CI or staging.
- Before launch, shadow the pipeline: run it on real traffic without acting on alerts, and compare with known fraud cases.

### Operating it

Monitor consumer lag per job, checkpoint durations and failures, alert volumes and end-to-end latency (event time to alert time). A fraud pipeline whose lag silently grows to an hour has stopped being real-time without anyone noticing unless these are watched.

### The cost reality

This pipeline runs every second of every day, needs streaming expertise and has several moving parts. It is justified because blocking fraud within seconds saves real money. The analytics requirement alone would be met far more cheaply by an hourly batch load, a reminder to apply streaming only where its value is clear.
      `,
        [
          q('Why key the payments topic by wallet_id?', [
            'Wallet IDs are shorter than payment IDs',
            'Kafka requires numeric keys',
            'It spreads a wallet\'s payments across all partitions',
            'Each wallet\'s payments stay ordered in one partition',
          ], 3, 'Keying by wallet keeps per-wallet ordering, which the stateful fraud logic depends on.'),
          q('Why send alerts to a Kafka topic instead of emailing directly from the stream job?', [
            'The alerting service can dedupe, retry and record acknowledgements separately',
            'Stream jobs cannot send emails',
            'Topics deliver alerts faster than email',
            'Email providers reject automated messages',
          ], 0, 'Decoupling alert delivery keeps the stream job simple and isolates slow notification providers.'),
          q('How is a fraud rule bug fixed and its results recomputed?', [
            'Delete the Kafka topic and start again',
            'Wait for the next day\'s batch',
            'Reset the job\'s offsets and replay from Kafka retention',
            'Edit the alerts manually',
          ], 2, 'Kafka\'s retention allows replaying events through corrected logic.'),
        ]
      ),
      lesson('Streaming Into the Warehouse', 12, `
Most streaming data eventually needs to be queried with SQL alongside everything else. Getting events from Kafka or another stream into a warehouse or lakehouse reliably, cheaply and without duplicates is a common task, and there are several patterns with different latency and cost profiles.

### The options

| Pattern | Latency | Notes |
|---|---|---|
| Micro-batch files | Minutes | A consumer writes Parquet files every few minutes; the warehouse loads or reads them |
| Sink connectors | Seconds to minutes | Kafka Connect sinks for warehouses and table formats |
| Native streaming ingestion | Seconds | Warehouse streaming APIs such as Snowpipe Streaming and BigQuery's Storage Write API |
| Stream processor sinks | Seconds | Flink or Spark jobs writing to Iceberg or Delta tables |

For most analytics, minutes of latency are fine and micro-batching is the simplest and cheapest. Native streaming ingestion suits operational dashboards needing seconds.

### Small files and commits

Streaming writes create data continuously. Committing every second produces thousands of tiny files and snapshots, which slows every query and bloats metadata. Balance latency against file health:

- Commit every one to five minutes for lakehouse tables unless lower latency is required.
- Run compaction regularly (chapter 5).
- Partition by event date so compaction and queries stay focused.

### Duplicates and ordering

Streams deliver at least once, so duplicates will appear in the landing table. Handle them in one of two places:

\`\`\`text
At write time:  sinks that merge on a unique event ID, such as a payment ID
At model time:  a dbt model that deduplicates by ID, keeping the latest version
\`\`\`

Deduplicating in the modelled layer is simple and robust: the raw landing table keeps everything, and the staging model applies \`ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ingested_at DESC) = 1\`.

### CDC streams into tables

A CDC stream contains inserts, updates and deletes. To produce a current-state table:

\`\`\`text
Raw landing: every change event, append-only, with operation type and log position
Current view: for each primary key, the latest event by log position;
              drop keys whose latest event is a delete
\`\`\`

This can run as a merge in the warehouse on a schedule, or continuously with table formats that support streaming merges. Keeping the append-only change history also gives full audit and Type 2 history for free.

### Schema evolution

Streams bring schema changes continuously. Sinks that map registry schemas to table schemas can add columns automatically; incompatible changes, such as type changes, should stop the sink and alert rather than write corrupt data. Pair automatic additions with a review step so new columns are documented and modelled.

### Late data in the warehouse

Late events land in partitions for days already processed. Downstream incremental models should re-process a trailing window (chapter 4's overlap) so late arrivals are included, and reports should mark the most recent periods as provisional where lateness is common.

### Monitoring the path

Track end-to-end freshness: the gap between an event's time and when it is queryable. Alert when it exceeds the target. Also compare counts between the stream and the table for sampled windows; a sink that silently drops messages during schema errors is a classic failure mode.

### Cost awareness

Streaming ingestion services often charge per volume or per connection hour, and continuously running clusters cost money even when traffic is light. Micro-batching to files and loading them in bulk is usually the cheapest path. Choose the lowest latency that meets real requirements, not the lowest latency available.
      `,
        [
          q('What is the simplest, cheapest way to land streams for minute-level analytics?', [
            'Committing each event individually',
            'Native streaming APIs for every table',
            'Emailing batches to analysts',
            'Micro-batching events into files every few minutes',
          ], 3, 'Periodic files loaded in bulk meet minute-level needs at low cost and complexity.'),
          q('How can duplicates from at-least-once delivery be removed reliably?', [
            'Disable retries in the producer',
            'Deduplicate by event ID in the staging model',
            'Commit to the table every second',
            'Use processing time instead of event time',
          ], 1, 'Keeping raw events and deduplicating by a unique ID in modelling is simple and robust.'),
          q('What should a sink do when an incompatible schema change arrives?', [
            'Silently drop the new events',
            'Rewrite the whole table with new types',
            'Stop and alert rather than write corrupt data',
            'Convert every column to text',
          ], 2, 'Halting on incompatible changes prevents corrupt data from spreading downstream.'),
        ]
      ),
      ],
      [
      q('What does consumer lag measure?', [
        'The time a producer takes to write',
        'How far a consumer group is behind the latest events',
        'The number of partitions in a topic',
        'The disk space used by a broker',
      ], 1, 'Growing lag means consumers are falling behind and freshness is slipping.'),
      q('What is a watermark in stream processing?', [
        'An estimate that no older events will arrive, used to close windows',
        'A logo added to exported dashboards',
        'The maximum size of a Kafka topic',
        'The time a batch job starts',
      ], 0, 'Watermarks trade completeness against latency when deciding a window is finished.'),
      q('Why should streaming state be expired when no longer needed?', [
        'Expired state speeds up producers',
        'Kafka requires state to be deleted daily',
        'State cannot be checkpointed otherwise',
        'State would otherwise grow without limit',
      ], 3, 'Closed sessions and old windows must be cleared to keep memory and checkpoints bounded.'),
      q('Why commit streaming writes to lakehouse tables every few minutes rather than every second?', [
        'Table formats forbid frequent commits',
        'Minutes are required for event time',
        'Very frequent commits create many tiny files and snapshots',
        'Consumers cannot read recent commits',
      ], 2, 'Balancing latency against file and metadata health keeps queries fast.'),
      ]
    ),
    chapter(
      'Data Quality and Observability',
      'Recognise how pipelines fail silently, test data for schema, freshness, volume and anomalies, agree data contracts and ownership with producers, and monitor, alert on and respond to data incidents like a production team.',
      [
      lesson('Why Pipelines Fail Silently', 13, `
Application failures are loud: errors, crashes, angry users. Data failures are often silent. A pipeline finishes successfully, every task shows green, and the dashboard shows a number that is wrong. Nobody notices until a manager makes a decision on it, or until finance cannot reconcile the month. Understanding the ways data goes wrong quietly is the first step to catching them.

### Common silent failures

| Failure | What happens |
|---|---|
| Schema drift | A source renames a column; the pipeline loads NULLs into the old one |
| Partial loads | An extract times out halfway; half a day's orders are loaded as if complete |
| Duplicates | A retry inserts rows twice; revenue doubles for one day |
| Late data | Yesterday's report runs before all of yesterday's data has arrived |
| Upstream logic change | The app starts recording refunds as negative orders; totals shift |
| Unit or currency change | A source switches from rupees to paisa; values jump by a factor of 100 |
| Time zone errors | Evening orders land on the wrong day |
| Broken joins | A dimension key changes format; facts no longer match and fall out of reports |
| Stale data | A connector stops syncing; dashboards keep showing last week's numbers |

In each case, nothing technically fails. The pipeline does exactly what it was told, with data that no longer matches its assumptions.

### The cost of bad data

- **Wrong decisions**: marketing budgets, stock orders and pricing based on incorrect numbers.
- **Lost trust**: after a few wrong numbers, users stop believing the dashboards and build their own spreadsheets, and the platform loses its purpose.
- **Wasted time**: analysts spend hours reconciling instead of analysing.
- **Compliance risk**: incorrect regulatory reports in banking and fintech carry real penalties.

Trust takes months to build and one bad board meeting to lose. Data quality is not a nice-to-have; it is the product.

### Data downtime

A useful way to think about this is data downtime: periods when data is missing, wrong or stale. Like application downtime, it can be measured, number of incidents, time to detect, time to resolve, and reduced. Teams that measure it improve it; teams that do not tend to discover problems from their users.

### Detect early, in the right place

The further bad data travels, the more expensive it is:

\`\`\`text
Caught at ingestion:     fix the extract, re-run one source
Caught in staging tests: fix a model, rebuild downstream
Caught on a dashboard:   explain to users, correct reports, rebuild trust
Caught in a board pack:  a serious incident
\`\`\`

The rest of this chapter builds layered defences: tests at each stage, contracts with producers, monitoring for what tests cannot anticipate, and a practised response when something slips through.

### Assumptions are the enemy

Most silent failures come from assumptions nobody wrote down: "order IDs are unique", "amounts are in rupees", "every order has a customer", "data arrives by 2 a.m.". Making assumptions explicit, as tests, contracts and monitors, turns silent failures into loud ones. A pipeline that fails loudly on bad data is far better than one that succeeds quietly with it.
      `,
        [
          q('Why are data failures often called silent?', [
            'Pipelines succeed while producing wrong data',
            'Data errors never affect dashboards',
            'Logs are not kept for pipelines',
            'Data tools cannot raise errors',
          ], 0, 'The pipeline runs as instructed on data that has broken its assumptions, so nothing flags it.'),
          q('A source switches from rupees to paisa without notice. What is the likely symptom?', [
            'The pipeline crashes immediately',
            'Values suddenly jump by a factor of 100',
            'All rows become duplicates',
            'The dashboard stops loading',
          ], 1, 'A unit change passes type checks but multiplies values, silently distorting reports.'),
          q('Why is catching bad data early so valuable?', [
            'Its cost grows the further it travels downstream',
            'Early data is always correct',
            'Dashboards cannot show errors',
            'Tests only run at ingestion',
          ], 0, 'Fixing at ingestion is cheap; fixing after decisions and reports is expensive.'),
        ]
      ),
      lesson('Testing Data: Schemas, Freshness and Anomalies', 14, `
Code tests check that logic is correct; data tests check that the data flowing through the logic still matches what the logic assumes. A layered set of data tests, from simple schema checks to statistical anomaly detection, catches most problems before anyone sees them.

### The test categories

| Category | Checks | Example |
|---|---|---|
| Schema | Columns exist with expected types | \`order_id\` is a string, \`total_paisa\` an integer |
| Validity | Values within allowed ranges and sets | Status in (completed, cancelled, refunded); total above zero |
| Uniqueness | Keys are unique | One row per \`order_id\` |
| Completeness | Required fields are present | \`customer_id\` never null |
| Referential integrity | Keys match their dimensions | Every order's customer exists |
| Freshness | Data is recent enough | Latest order under two hours old |
| Volume | Row counts are plausible | Today's orders within an expected range |
| Distribution | Values behave as usual | Average order value not suddenly doubled |
| Reconciliation | Totals match the source or another system | Warehouse revenue equals the payment system's settlement |

### Where the tests run

\`\`\`text
Ingestion:  schema checks, row counts compared with the source, freshness
Staging:    uniqueness, not null, accepted values, type checks
Marts:      referential integrity, business rules, reconciliation, volume
Serving:    freshness of dashboard extracts, metric sanity
\`\`\`

### Tools

- **dbt tests** cover schema, uniqueness, nulls, relationships and custom SQL rules, running as part of builds (chapter 6).
- **Great Expectations and Soda** define checks declaratively and run them in pipelines on any data, including files and dataframes before loading.
- **dbt packages** such as dbt-expectations add range, distribution and row-count tests.
- **Observability platforms** learn normal patterns and detect anomalies automatically.

### Freshness and volume

Two simple checks catch a surprising share of incidents:

\`\`\`sql
-- Freshness: fail if the newest order is older than 2 hours
SELECT MAX(placed_at) FROM fct_orders
HAVING MAX(placed_at) < CURRENT_TIMESTAMP - INTERVAL '2 hours';

-- Volume: fail if today's rows fall far below the recent average
WITH daily AS (
  SELECT DATE(placed_at) AS d, COUNT(*) AS n FROM fct_orders
  WHERE placed_at >= CURRENT_DATE - 28 GROUP BY 1
)
SELECT * FROM daily
WHERE d = CURRENT_DATE - 1
  AND n < 0.5 * (SELECT AVG(n) FROM daily WHERE d < CURRENT_DATE - 1);
\`\`\`

Stale connectors and partial loads show up immediately.

### Anomaly detection

Fixed thresholds break with seasonality: orders double during Ramadan evenings and drop during Eid holidays, and a fixed rule either fires constantly or misses real problems. Anomaly detection compares against expected values that account for trends and seasonality, for example the same weekday in recent weeks. Observability tools do this automatically; simple versions compare with a rolling baseline and a tolerance band.

### Blocking versus warning

| Severity | Behaviour |
|---|---|
| Blocking | Stop the pipeline; downstream models are not built on bad data |
| Warning | Continue, but alert the owner to investigate |

Duplicated primary keys and broken reconciliation should block. A slightly unusual volume on a public holiday should warn. Choosing severity per test prevents both bad data reaching users and alert fatigue from minor blips.

### Keep tests maintained

Tests that fail constantly and get ignored are worse than no tests, because they train people to ignore alerts. Review failing tests: fix the data, fix the test's assumptions, or remove it. A small set of trusted tests beats a large set nobody believes.
      `,
        [
          q('Which check detects a connector that stopped syncing?', [
            'Freshness on the latest record\'s timestamp',
            'Uniqueness on the primary key',
            'Accepted values on the status column',
            'Referential integrity to dimensions',
          ], 0, 'Stale data shows up as an old maximum timestamp, which freshness checks catch.'),
          q('Why do fixed thresholds work poorly for daily order volume?', [
            'Orders cannot be counted daily',
            'Thresholds are not supported in SQL',
            'Seasonal patterns like Ramadan and Eid shift normal levels',
            'Volume never changes',
          ], 2, 'Seasonality makes fixed limits either noisy or blind; baselines that adapt work better.'),
          q('Which test should block a pipeline rather than just warn?', [
            'A slightly unusual volume on a holiday',
            'A small change in average session length',
            'A new optional column appearing',
            'Duplicated primary keys in the orders fact',
          ], 3, 'Duplicate keys corrupt every downstream total, so building on them must stop.'),
        ]
      ),
      lesson('Data Contracts and Ownership', 13, `
Many data incidents start upstream: an application team changes a table or an event, unaware that dozens of pipelines depend on it. Tests catch the break after it happens. Data contracts aim to prevent it, by making the interface between data producers and consumers explicit, versioned and owned, in the same way APIs are.

### The problem contracts solve

\`\`\`text
App team:   renames users.phone to users.phone_number in a routine release
Pipelines:  staging model now selects a missing column -> NULLs or failure
Dashboards: SMS campaign targeting breaks for a week
Nobody:     was told, because nobody knew the column was used downstream
\`\`\`

Application teams are not careless; they simply have no visibility of downstream use and no agreement about what must not change.

### What a data contract contains

| Element | Example |
|---|---|
| Schema | Fields, types, nullability for the \`orders\` table or \`OrderPlaced\` event |
| Semantics | \`total\` is in paisa, includes delivery fee, excludes refunds |
| Quality expectations | \`order_id\` unique; \`customer_id\` never null |
| Freshness and delivery | Available within 15 minutes of creation |
| Ownership | Owning team and contact for questions and incidents |
| Change process | How breaking changes are announced, versioned and migrated |

A contract can be a YAML file in the producer's repository, enforced in their CI.

\`\`\`yaml
contract: orders
owner: team-checkout
version: 2
fields:
  - name: order_id
    type: string
    required: true
    unique: true
  - name: total_paisa
    type: integer
    required: true
    description: Order total in paisa, including delivery fee, excluding refunds.
  - name: status
    type: string
    allowed: [completed, cancelled, refunded]
freshness: 15m
\`\`\`

### Enforcing contracts

- **In the producer's CI**: a schema change that breaks the contract fails the build before release.
- **At ingestion**: incoming data is validated against the contract; violations are quarantined and alerted.
- **In the warehouse**: dbt model contracts enforce column names and types on published models.
- **In streams**: schema registry compatibility rules enforce event contracts (chapter 8).

### Versioning

Breaking changes are sometimes necessary. Contracts handle them like API versions: publish version 3 alongside version 2, give consumers time to migrate, then retire the old version on an announced date. Non-breaking additions, such as new optional fields, need no new version.

### Ownership

Every dataset needs a named owner: the team responsible for its correctness and for responding when it breaks.

| Layer | Typical owner |
|---|---|
| Source tables and events | The application team producing them |
| Ingestion pipelines | Data engineering |
| Core marts | Data or analytics engineering |
| Domain marts and metrics | The analytics team closest to the business area |

Ownership is recorded in the catalogue and in code, and it decides who is alerted when a test fails. Datasets without owners decay.

### Making it work culturally

Contracts succeed when producers see value, not just extra rules. Show application teams which dashboards and decisions depend on their data, include them in incident reviews when their changes cause breakage, and make contract checks lightweight and automatic. Start with the few most critical datasets, such as orders and payments, rather than trying to contract everything at once.

### Contracts inside the data team

The same idea applies between data teams: a published mart is a contract with its consumers. Use model contracts, versions and deprecation periods for widely used models, so that improving the platform does not break the dashboards built on it.
      `,
        [
          q('What problem do data contracts mainly address?', [
            'Slow queries in the data warehouse',
            'Missing colours on shared dashboards',
            'Producers breaking data others depend on',
            'Expensive cloud storage for raw files',
          ], 2, 'Explicit, owned interfaces stop upstream changes from silently breaking downstream use.'),
          q('Where is a contract most effective at preventing breakage?', [
            'In the producer\'s CI, before the change is released',
            'In a monthly review meeting',
            'In the dashboard\'s description',
            'In the consumer\'s spreadsheets',
          ], 0, 'Failing the producer\'s build stops a breaking change before it reaches any pipeline.'),
          q('How should a necessary breaking change to a contracted dataset be handled?', [
            'Rename the columns in place immediately',
            'Publish a new version alongside the old and migrate consumers',
            'Delete the dataset and recreate it',
            'Avoid telling consumers to prevent panic',
          ], 1, 'Versioned coexistence with a deprecation period lets consumers migrate safely.'),
        ]
      ),
      lesson('Monitoring, Alerting and Incident Response for Data', 13, `
Tests catch the problems you anticipated. Monitoring catches the rest, and incident response decides how quickly and how well problems are resolved. Mature data teams run their platforms like production systems: with observability, on-call ownership, clear communication and learning from every incident.

### What to monitor

| Signal | Indicates |
|---|---|
| Pipeline success, duration and lateness | Orchestration health; creeping durations signal future misses |
| Data freshness per important table | Stale connectors or blocked pipelines |
| Row volumes per table and partition | Partial loads, duplicates, upstream changes |
| Test results over time | Recurring quality problems |
| Schema changes detected | Upstream drift |
| Consumer lag for streams | Real-time freshness |
| Warehouse cost and query load | Runaway queries and inefficiency |
| Dashboard usage | Which assets matter most, and whom to warn |

Observability platforms for data collect many of these automatically and add lineage, so an anomaly in a source shows every affected downstream table and dashboard.

### Alerting that people trust

\`\`\`text
Good alert:  "fct_orders freshness: latest order 5h old (expected <2h).
              Upstream sync 'sales_system' last succeeded 06:10.
              Affects: Executive Sales dashboard, Daily Revenue email.
              Owner: data-eng on-call. Runbook: link"

Bad alert:   "Check failed"
\`\`\`

Route alerts to the owner of the dataset, not to one shared channel everyone ignores. Tie severity to impact: a stale board-level dashboard pages someone; a stale experimental table creates a ticket.

### Incident response for data

When bad data is detected:

\`\`\`text
1. Acknowledge and assign an owner.
2. Assess impact: which tables, dashboards, reports and people are affected?
3. Communicate early to affected users: "Revenue for 14 March is under
   investigation; do not use it until further notice."
4. Contain: pause downstream pipelines or mark data as provisional so
   the problem does not spread.
5. Fix the root cause: source, extract or transformation.
6. Repair: backfill or rebuild affected periods (chapters 4 and 7).
7. Verify with tests and reconciliation, then tell users it is resolved.
8. Review: a blameless write-up of cause, detection and prevention.
\`\`\`

Early communication matters more in data incidents than in most: people may already be making decisions with the wrong numbers.

### Runbooks

For recurring failure types, such as a stale connector, a failed dbt model or a late partner file, write short runbooks: how to diagnose, how to fix, how to backfill, whom to inform. They make on-call manageable for everyone, not just the person who built the pipeline.

### Status and trust signals

Show data status where users look: a banner on dashboards when data is delayed, freshness timestamps on reports, and a simple status page for major datasets. Users forgive delays they are told about; they do not forgive silently wrong numbers.

### Measuring improvement

Track data incidents by count, severity, time to detect and time to resolve. Review them monthly. If most incidents are detected by users rather than monitors, invest in monitoring; if detection is fast but resolution slow, invest in runbooks, backfill tooling and ownership.

### Learning culture

Blameless reviews focus on the system: why the assumption was unwritten, why the test did not exist, why the alert went unseen. Each review should produce concrete changes, such as a new contract, test, monitor or runbook. Over months, this loop is what turns a fragile platform into a trusted one.
      `,
        [
          q('What makes a data alert useful?', [
            'A short message saying "Check failed"',
            'What failed, its impact, the owner and a runbook link',
            'Sending it to every channel at once',
            'Repeating it every minute until acknowledged',
          ], 1, 'Context about impact, ownership and next steps lets responders act quickly.'),
          q('Why communicate early during a data incident?', [
            'Users prefer long reports',
            'Fixes are impossible without users',
            'It delays the root cause analysis',
            'People may already be deciding with wrong numbers',
          ], 3, 'Warning users quickly limits harm from decisions based on bad data.'),
          q('If most incidents are found by users rather than monitors, what should the team invest in?', [
            'Faster dashboards for business users',
            'More data sources in the warehouse',
            'Better monitoring and tests',
            'Longer retention for raw data',
          ], 2, 'User-detected incidents show that detection, not resolution, is the weak point.'),
        ]
      ),
      ],
      [
      q('Which failure passes every pipeline task yet produces wrong numbers?', [
        'A crashed worker',
        'A syntax error in SQL',
        'A missing database password',
        'A retry that inserted a day\'s rows twice',
      ], 3, 'Duplicate loads succeed technically while doubling totals, a classic silent failure.'),
      q('Which test compares warehouse revenue with the payment system\'s settlement?', [
        'Uniqueness',
        'Reconciliation',
        'Freshness',
        'Accepted values',
      ], 1, 'Reconciliation checks totals against an independent source of truth.'),
      q('Who should be recorded as owning a source table\'s data contract?', [
        'The application team that produces it',
        'Whoever last queried it',
        'The dashboard\'s viewers',
        'The cloud provider',
      ], 0, 'Producers own the interface they publish, like an API.'),
      q('What is the first step when bad data is detected?', [
        'Rebuild every table in the warehouse',
        'Delete the affected dashboards',
        'Acknowledge the incident and assign an owner',
        'Wait to see if it resolves itself',
      ], 2, 'A clear owner drives assessment, communication and the fix.'),
      ]
    ),
    chapter(
      'Performance, Cost and Scale',
      'Make warehouse queries fast by reading less data and joining wisely, keep cloud data bills under control, understand when and how to use Spark for distributed processing, and scale pipelines without breaking sources or production tables.',
      [
      lesson('Query Performance in Warehouses', 13, `
Cloud warehouses are fast, but they are not magic. A badly written query can scan terabytes and run for minutes; the same question asked well returns in seconds. Almost all warehouse performance work comes down to two principles: read less data, and move less data between machines.

### Read less data

| Technique | Effect |
|---|---|
| Select only needed columns | Columnar storage reads only those columns |
| Filter on partition columns | Whole partitions are skipped (chapter 5) |
| Filter early, in the first CTE | Later steps process fewer rows |
| Use clustered columns in filters | Blocks outside the range are skipped |
| Pre-aggregate heavy logic into tables | Dashboards read small summaries, not raw facts |

A query that reads 50 GB instead of 5 TB is a hundred times cheaper and usually much faster.

### Move less data

Distributed warehouses split work across many nodes. Joins and aggregations may require shuffling rows between nodes so matching keys meet, and shuffles are the most expensive operation there is.

- **Join large to small**: when one side is small, such as a dimension, the engine can broadcast it to every node and avoid shuffling the large side. Filtering the dimension first keeps it small.
- **Aggregate before joining**: summarise millions of order items to one row per order before joining to orders.
- **Avoid accidental cross joins**: a missing join condition multiplies rows catastrophically.
- **Beware of skew**: if one key, such as a single enormous merchant, holds a large share of rows, one node does most of the work while others wait.

### Reading the query profile

Every warehouse offers a query profile or execution plan showing bytes scanned, rows produced at each step, time per operator and spilling to disk. The questions to ask:

\`\`\`text
- Which step takes most of the time?
- Did partition pruning happen, or was the whole table scanned?
- Does any join produce far more rows than its inputs? (fan-out or cross join)
- Is data spilling to disk because an operation exceeds memory?
- Is one worker much slower than the rest? (skew)
\`\`\`

### Common fixes

| Symptom | Fix |
|---|---|
| Full table scan | Add a partition filter; filter directly on the partition column |
| Huge intermediate row counts | Aggregate earlier; check join keys for duplicates |
| Spilling to disk | Reduce data earlier or use a larger compute size for that job |
| Slow distinct counts | Use approximate functions where exact counts are not required |
| Repeated heavy logic in dashboards | Materialise it as a table in dbt, refreshed on schedule |
| Slow dashboard tiles | Point them at small aggregate tables, not raw facts |

### Caching

Warehouses cache query results: an identical query on unchanged data returns instantly and often at no cost. Dashboards benefit automatically when their queries are consistent. Result caches are invalidated when underlying tables change, so frequent small updates to a table reduce cache effectiveness.

### Materialisation strategy

Views are recomputed on every query; tables are computed once per build. A view over a large join queried by fifty dashboard tiles runs that join fifty times. Materialise expensive, frequently read models as tables or incremental tables, and keep views for light transformations. This single decision often has more impact than any query tuning.

### Measure, then optimise

Most warehouses list the most expensive and slowest queries. Start with the top ten by total time or cost: fixing a query that runs every five minutes all day matters far more than one that runs monthly. Performance work guided by these lists pays back quickly; performance work guided by guesses rarely does.
      `,
        [
          q('What are the two core principles of warehouse performance?', [
            'Use more views and fewer tables',
            'Always use the largest compute size',
            'Read less data and move less data between nodes',
            'Avoid all joins and aggregations',
          ], 2, 'Scanning and shuffling are the main costs, so reducing both drives performance.'),
          q('Why aggregate order items before joining them to orders?', [
            'It reduces rows before the expensive join',
            'Joins are not allowed on raw items',
            'Aggregation enables partition pruning',
            'It changes the join into a view',
          ], 0, 'Summarising the many side first shrinks the data that must be joined and shuffled.'),
          q('A view over a large join feeds fifty dashboard tiles. What usually helps most?', [
            'Adding more columns to the view',
            'Converting the dashboards to exports',
            'Removing the partition filter',
            'Materialising the model as a table',
          ], 3, 'A table computes the join once per build instead of once per tile query.'),
        ]
      ),
      lesson('Controlling Cloud Data Costs', 13, `
Cloud data platforms make it easy to spend money: every query, every running cluster, every stored file and every sync has a price. Many teams discover the problem only when a monthly bill arrives several times larger than expected. Cost control is not about being stingy; it is about knowing where money goes and making sure it buys value.

### Where the money goes

| Area | Typical drivers |
|---|---|
| Warehouse compute | Query volume, compute size, time clusters stay running |
| Scanned data (scan-priced warehouses) | Large scans, SELECT *, missing partition filters |
| Ingestion tools | Rows synced by managed connectors |
| Storage | Raw copies, long history, unexpired snapshots and backups |
| Orchestration and streaming | Always-on clusters and brokers |
| BI tools | Dashboards refreshing far more often than anyone looks at them |

### Visibility first

You cannot control what you cannot see. Tag or label queries, jobs and compute by team and pipeline, and build a simple cost dashboard: spend per day, per team, per pipeline and per top query. Warehouses expose query history with bytes scanned or credits used, which is enough to find the biggest spenders within an hour.

### Common wins

- **Auto-suspend idle compute**: warehouses that bill while running should suspend after a minute or two of inactivity.
- **Right-size compute**: a larger size that finishes a job in a quarter of the time can cost the same as a small one running four times as long; measure both.
- **Separate workloads**: give transformations, BI and ad-hoc analysis separate compute, so costs are attributable and limits can differ.
- **Stop needless refreshes**: a dashboard refreshing every five minutes for a report read once a day wastes compute around the clock.
- **Incremental models**: rebuilding a billion-row table hourly when only new rows changed is the classic avoidable expense.
- **Partition and cluster large tables**: especially important where pricing is per byte scanned.
- **Clean up**: drop unused tables, expire old snapshots, move cold raw data to cheaper storage tiers.

### Guardrails

| Guardrail | Purpose |
|---|---|
| Budgets and alerts | Notify when daily or monthly spend passes thresholds |
| Resource monitors or quotas | Cap compute per warehouse, team or user |
| Maximum bytes billed per query | Stop runaway queries in scan-priced warehouses |
| Query timeouts | Prevent forgotten queries running for hours |
| Development limits | Smaller compute and sampled data for dev environments |

A single analyst's mistaken query scanning every table repeatedly can cost more than a month of normal usage; guardrails turn that from a surprise into a blocked query.

### Cost per unit

Track cost per useful output: per pipeline run, per thousand rows processed, per dashboard viewed, per active data consumer. As the business grows, total spend will rise; cost per unit should stay flat or fall. When it rises, something became less efficient.

### The human side

Share cost dashboards with the teams whose work drives the spend. Engineers who see that their pipeline costs a significant amount each month usually find a way to reduce it within a week. Make cost a normal part of code review for new pipelines: how often does it run, how much does it scan, could it be incremental?

### Balance

Do not optimise away value. A model that costs a few dollars a day and saves analysts hours is cheap. The goal is to eliminate waste, idle clusters, redundant refreshes and unnecessary scans, while spending freely on work that matters to the business.
      `,
        [
          q('What is the first step in controlling data platform costs?', [
            'Visibility: tagging spend by team, pipeline and query',
            'Cutting every dashboard in half',
            'Moving all data to spreadsheets',
            'Using the smallest compute for everything',
          ], 0, 'You cannot reduce what you cannot see, so attribution comes first.'),
          q('Why can a larger compute size cost no more than a smaller one?', [
            'Larger sizes are billed at a discount',
            'Small sizes charge extra for storage',
            'Larger sizes skip scanning',
            'It may finish proportionally faster, using the same total compute time',
          ], 3, 'Billing by size times time means a faster larger job can cost the same as a slower small one.'),
          q('What does a maximum-bytes-billed setting protect against?', [
            'Slow dashboard rendering',
            'Runaway queries scanning huge amounts of data',
            'Late-arriving data',
            'Duplicate rows in tables',
          ], 1, 'Capping bytes per query blocks accidental expensive scans before they run.'),
        ]
      ),
      lesson('Spark and Distributed Processing', 14, `
When data is too large, or processing too complex, for SQL in a warehouse or for a single machine, Apache Spark is the most widely used distributed engine. It spreads work across a cluster and runs in Databricks, Amazon EMR, Google Dataproc and many other platforms. Knowing how it works, and when it is unnecessary, saves both time and money.

### The architecture

\`\`\`text
Driver      plans the job and coordinates
Executors   worker processes on cluster nodes that run tasks in parallel
Partitions  chunks of data; one task processes one partition
\`\`\`

A job reading 500 GB of Parquet might split it into thousands of partitions, processed by dozens of executors in parallel.

### DataFrames and lazy evaluation

Spark's DataFrame API resembles pandas and SQL:

\`\`\`python
from pyspark.sql import functions as F

orders = spark.read.parquet("s3://lake/staging/orders/")
daily = (
    orders
    .filter(F.col("status") == "completed")
    .groupBy("customer_id", F.to_date("placed_at").alias("day"))
    .agg(F.sum("total_paisa").alias("spend_paisa"))
)
daily.write.mode("overwrite").partitionBy("day").parquet("s3://lake/curated/daily_spend/")
\`\`\`

Transformations such as \`filter\` and \`groupBy\` are lazy: they build a plan. Actions such as \`write\` or \`count\` execute it. Spark's optimiser rewrites the whole plan first, pushing filters down to the file reads and pruning columns, which is why writing the plan clearly matters more than ordering steps by hand. The same logic can be written in Spark SQL.

### Narrow and wide transformations

| Type | Examples | Cost |
|---|---|---|
| Narrow | filter, select, withColumn | Each partition processed independently; cheap |
| Wide | groupBy, join, distinct, orderBy | Data shuffled across the network by key; expensive |

As in warehouses, shuffles dominate cost. Techniques:

- **Broadcast joins**: send a small table to every executor to avoid shuffling the large one.
- **Filter and project early**: less data to shuffle.
- **Handle skew**: salting hot keys, or relying on adaptive query execution, which modern Spark uses to split skewed partitions and adjust joins at run time.
- **Right number of partitions**: too few underuse the cluster; too many create overhead and tiny output files.

### Memory and failures

Executors that run out of memory fail tasks, which Spark retries. Persistent failures usually mean skew, too-large partitions or collecting large results to the driver. Never call \`collect()\` on large data: it pulls everything into the driver's memory. Write results to storage instead.

### Caching

\`cache()\` keeps a DataFrame in memory for reuse across several actions. It helps when the same expensive intermediate result is used repeatedly, and wastes memory otherwise. Unpersist when finished.

### When not to use Spark

Spark has overhead: cluster startup, scheduling, shuffles over the network. For data that fits on one machine, up to tens or even hundreds of gigabytes, DuckDB or Polars (chapter 2) are often faster, cheaper and simpler. For SQL transformations on warehouse data, dbt in the warehouse is usually the better choice. Spark shines for very large datasets, complex non-SQL processing, machine learning pipelines on big data, and lakehouse workloads.

### Structured Streaming

The same DataFrame API processes streams through Structured Streaming, using micro-batches with checkpoints (chapter 8). Teams already on Spark can use one engine for batch and streaming.

### Running Spark well

Use managed platforms rather than self-managed clusters unless there is a strong reason; autoscaling and ephemeral job clusters that shut down after each job keep costs in line. Monitor the Spark UI for long stages, skewed tasks and spills, the Spark equivalent of a warehouse query profile.
      `,
        [
          q('What does lazy evaluation in Spark mean?', [
            'Transformations build a plan that runs only when an action is called',
            'Spark waits for users to approve each step',
            'Data is read only once per day',
            'Executors start only after an error',
          ], 0, 'Lazy plans let Spark\'s optimiser rewrite the whole job before execution.'),
          q('Which operation triggers an expensive shuffle?', [
            'filter',
            'select',
            'groupBy',
            'withColumn',
          ], 2, 'Wide transformations such as groupBy redistribute data by key across the network.'),
          q('When is DuckDB or Polars often a better choice than Spark?', [
            'For petabyte-scale lakehouse processing',
            'When the data fits on one machine',
            'For distributed machine learning on huge datasets',
            'When a cluster is already running',
          ], 1, 'Single-machine engines avoid cluster overhead and are often faster for moderate data.'),
        ]
      ),
      lesson('Scaling Pipelines Safely', 13, `
Growth changes pipelines. Ten sources become a hundred, a daily load becomes hourly, a table grows from millions to billions of rows. Scaling well means handling more without breaking sources, overloading the warehouse or exposing half-built tables to users. A handful of patterns make growth safe.

### Protect sources

More parallelism is tempting, but sources have limits. Extracting fifty tables at once from a production database replica can make it lag behind the primary; hammering an API breaks its rate limits. Use orchestrator pools to cap concurrency per source (chapter 7), schedule heavy extracts in quiet hours, and prefer change data capture for large, busy tables (chapter 4).

### Chunk large work

Process large loads and backfills in bounded chunks, such as one day or one partition at a time:

\`\`\`text
Backfill 2 years:   730 daily chunks, 5 running at a time
Benefit:            failures affect one day, not two years;
                    progress is visible; retries are cheap
\`\`\`

Chunked, idempotent work can be paused, resumed and parallelised safely.

### Write, audit, publish

Consumers should never see a table half-rebuilt or loaded with unchecked data. The write-audit-publish pattern:

\`\`\`text
1. Write:   build the new version in a staging location or branch
2. Audit:   run data tests and reconciliations against it
3. Publish: atomically swap it into place, or merge it into production
\`\`\`

Warehouses support this with table swaps, schema swaps or zero-copy clones; lakehouse table formats support it with branches or staged snapshots. If the audit fails, production is untouched.

### Blue-green for tables

For large model changes, build the new version alongside the old (\`fct_orders_v2\`), compare them, point consumers to the new one, then retire the old. The same idea as blue-green deployments in software, applied to data.

### Isolate environments

Development and CI should not run against production tables or production compute:

| Environment | Data | Compute |
|---|---|---|
| Development | Samples or zero-copy clones | Small, auto-suspending |
| CI | Changed models built in temporary schemas | Limited, time-boxed |
| Production | Real data | Sized for schedules, monitored |

Zero-copy clones give developers realistic data without duplicating storage or risking production.

### Handle fan-in and fan-out

As the DAG grows, one late source can delay dozens of downstream models. Design for partial progress: build independent areas separately, so a late payments source does not block marketing models that do not use it. Asset-based scheduling and dbt selectors by domain help.

### Capacity planning

Track growth in data volume, pipeline durations and warehouse usage monthly. Project when durations will breach their windows: a nightly pipeline growing 5% a month that now takes five hours will exceed an eight-hour window within a year. Plan the fix, incremental models, better partitioning or more compute, before the deadline is missed.

### Change management

Changes to shared pipelines and models go through review, CI tests and staged rollout, with rollback plans. For breaking changes to widely used tables, follow the contract and versioning practices of chapter 9. Scaling is as much about safe change as about raw capacity.
      `,
        [
          q('Why cap concurrent extracts per source with orchestrator pools?', [
            'Pools make queries run faster',
            'Airflow requires one pool per DAG',
            'Sources cannot be queried in parallel',
            'Too much parallelism can overload sources and replicas',
          ], 3, 'Pools protect databases and APIs from being overwhelmed by concurrent pipeline tasks.'),
          q('What does the write-audit-publish pattern prevent?', [
            'Late-arriving source data',
            'Consumers seeing half-built or unchecked tables',
            'Duplicate API calls',
            'High storage costs',
          ], 1, 'Data is validated in staging and swapped in atomically only after passing checks.'),
          q('Why process a two-year backfill in daily chunks?', [
            'Warehouses reject large queries',
            'Daily chunks need no testing',
            'Failures stay small, progress is visible and retries are cheap',
            'It avoids using the orchestrator',
          ], 2, 'Bounded, idempotent chunks make large jobs resumable and safe.'),
        ]
      ),
      ],
      [
      q('A query scans a whole year when filtering one day. What is the likely fix?', [
        'Use a larger warehouse',
        'Filter directly on the partition column',
        'Convert the table to a view',
        'Add SELECT * to the query',
      ], 1, 'Pruning requires a filter the engine can map to partitions.'),
      q('Which change removes compute cost from idle warehouses?', [
        'Auto-suspend after short inactivity',
        'Larger compute sizes',
        'More frequent dashboard refreshes',
        'Longer query timeouts',
      ], 0, 'Suspending idle compute stops billing when no work is running.'),
      q('Why should you avoid collect() on a large Spark DataFrame?', [
        'It deletes the DataFrame',
        'It triggers a shuffle on every executor',
        'It writes duplicate files',
        'It pulls all data into the driver\'s memory',
      ], 3, 'Collecting large results overwhelms the single driver process.'),
      q('What do zero-copy clones provide for development?', [
        'Faster production queries',
        'Automatic data quality tests',
        'Realistic data without duplicating storage',
        'Encryption of production tables',
      ], 2, 'Clones give developers production-like data safely and cheaply.'),
      ]
    ),
    chapter(
      'Governance, Security and Serving',
      'Control access and protect sensitive data, make data discoverable with catalogues and lineage, serve data to BI tools, operational systems and applications, and prepare data correctly for machine learning and AI use cases.',
      [
      lesson('Access Control and Sensitive Data', 14, `
A data platform concentrates the organisation's most valuable and most sensitive information: customer identities, phone numbers, CNIC numbers, balances, transactions. Centralising it creates enormous value and enormous risk. Access control and careful handling of sensitive data are responsibilities data engineers cannot delegate.

### Least privilege

Every person and system gets only the access they need:

| Role | Typical access |
|---|---|
| Ingestion service account | Write to raw schemas only |
| Transformation service account | Read raw and staging; write staging and marts |
| Analysts | Read marts; no raw access to sensitive sources |
| Data scientists | Read marts and approved feature tables |
| BI tool service account | Read the specific marts behind dashboards |
| Administrators | Few people, with audited access |

Grant permissions to roles, and roles to groups from the company's identity provider, never directly to individuals. When someone changes team or leaves, access follows automatically.

### Classify sensitive data

Know where sensitive data lives:

| Class | Examples | Handling |
|---|---|---|
| Public | Product catalogue | Open within the company |
| Internal | Aggregated sales | Standard access |
| Confidential | Individual transactions, customer contact details | Restricted roles |
| Highly restricted | CNIC numbers, full card data, health data, credentials | Minimised, masked, tightly audited, or excluded |

Tag columns with their classification in the catalogue; many warehouses can then apply policies automatically.

### Masking and row-level security

Column masking shows sensitive values only to authorised roles:

\`\`\`sql
CREATE MASKING POLICY mask_phone AS (val STRING) RETURNS STRING ->
  CASE WHEN CURRENT_ROLE() IN ('SUPPORT_LEAD') THEN val
       ELSE CONCAT('03**-***', RIGHT(val, 4))
  END;
\`\`\`

Row-level security limits which rows a role sees, for example regional managers seeing only their region's customers. Both are enforced by the warehouse, so they apply in every tool that queries it.

### Minimise and pseudonymise

The safest sensitive data is data you do not copy. Ingest only the columns analysis needs; a CNIC number is rarely needed for analytics. When linking records is required, replace identifiers with keyed hashes or tokens, so analysts can count and join customers without seeing who they are. Keep the mapping, if one is needed at all, in a separate, tightly controlled system.

### Encryption and secrets

Cloud warehouses and object storage encrypt data at rest and in transit by default; verify settings, and use customer-managed keys where policy requires. Credentials for pipelines live in secret managers, rotate regularly, and are never shared between environments.

### Audit and retention

Enable access logging: who queried which sensitive tables and when. Review it for unusual patterns. Define retention periods, delete raw data that is no longer needed, and support deletion requests for individuals where law or policy requires it; table formats with row-level deletes make this practical in lakes (chapter 5).

### Legal and regulatory context

Obligations depend on sector and jurisdiction. Financial institutions in Pakistan follow State Bank of Pakistan requirements on data security and outsourcing to the cloud; Pakistan's personal data protection legislation has been under development, so check its current status; companies serving customers in Europe fall under GDPR. Work with legal and compliance teams to translate these into concrete rules for the platform, and document how the platform meets them.

### Make the secure path easy

People bypass controls that block their work, often by exporting data to spreadsheets. Provide safe, masked, well-documented datasets for common needs, fast access-request processes and clear guidance. Good governance enables use rather than preventing it.
      `,
        [
          q('Why grant permissions to roles and groups rather than individuals?', [
            'Access follows people automatically when they change team or leave',
            'Warehouses cannot store user names',
            'Individual grants are faster to query',
            'Roles remove the need for auditing',
          ], 0, 'Managing access through groups keeps it accurate as people move.'),
          q('How can analysts join customer records without seeing identities?', [
            'By exporting data to spreadsheets',
            'By removing the customer key entirely',
            'By sharing an administrator account',
            'By using keyed hashes or tokens instead of identifiers',
          ], 3, 'Pseudonymised keys allow counting and joining without exposing personal details.'),
          q('Where are masking and row-level security enforced?', [
            'In each dashboard separately',
            'In the warehouse, so every tool is covered',
            'In the analyst\'s spreadsheet',
            'In the ingestion connector only',
          ], 1, 'Warehouse-level policies apply consistently to every query from every tool.'),
        ]
      ),
      lesson('Cataloguing, Lineage and Metadata', 13, `
As a platform grows to hundreds of tables, finding the right data becomes a problem in itself. Analysts ask the same questions repeatedly: which table has revenue, is it trustworthy, who owns it, what feeds it? A data catalogue with lineage and good metadata answers these questions and turns the platform from a maze into a library.

### What a catalogue provides

| Feature | Answers |
|---|---|
| Search | Where is the data about orders? |
| Descriptions and glossary | What does "active customer" mean? |
| Ownership | Whom do I ask about this table? |
| Lineage | Where does this data come from, and what depends on it? |
| Quality and freshness | Can I trust this table today? |
| Usage | Which tables are popular, and which are unused? |
| Classification | Is this table sensitive? |

### Tools

Open-source catalogues include DataHub, OpenMetadata and Amundsen; warehouse and lakehouse platforms provide their own, such as Unity Catalog; commercial options include Alation, Atlan and Collibra. Most integrate with dbt, orchestrators, warehouses and BI tools to collect metadata automatically.

### Lineage

Lineage traces data from sources through transformations to dashboards:

\`\`\`text
sales_system.orders (source)
  -> stg_sales_system__orders
    -> fct_orders
      -> agg_daily_revenue
        -> "Executive Sales" dashboard
        -> "Daily Revenue" email
\`\`\`

It answers critical questions quickly:

- **Impact analysis**: if the source's \`total\` column changes, which models and dashboards break?
- **Root cause**: this dashboard is wrong; which upstream table introduced the error?
- **Compliance**: where does this sensitive column flow?

Column-level lineage goes further, tracing individual columns, which is especially valuable for sensitive data. OpenLineage is an open standard that lets orchestrators and engines emit lineage events that catalogues collect.

### The business glossary

A glossary defines business terms once and links them to the tables and metrics that implement them. When "net revenue" has one definition, one owner and one table, meetings stop being arguments about whose number is right.

### Metadata as code

Descriptions, owners, tags and classifications written in dbt YAML (chapter 6) and source configurations are versioned, reviewed and pushed to the catalogue automatically. This keeps metadata current in a way that manual catalogue editing rarely does.

### Certification

Mark trusted, tested, owned datasets as certified; mark experimental or deprecated ones clearly. Analysts then choose certified tables by default, and the long tail of personal and one-off tables stops competing for attention.

### Adoption

A catalogue nobody opens adds nothing. Increase adoption by integrating it where people work: links from dashboards to table descriptions, catalogue search in the SQL editor, lineage shown during code review. Start with the most-used tables, make their documentation excellent, and expand from there.

### Metadata drives automation

Beyond discovery, metadata enables automation: masking policies applied by classification tags, alerts routed by owner, deprecation warnings when consumers query retired tables, and cost reports by domain. The richer and more accurate the metadata, the more of the platform runs itself.
      `,
        [
          q('What question does lineage answer during impact analysis?', [
            'How much the table costs to store',
            'Which models and dashboards break if a source changes',
            'Who last viewed the dashboard',
            'How many rows the table has',
          ], 1, 'Lineage maps dependencies so the effect of a change can be seen before it happens.'),
          q('Why keep descriptions and owners in dbt YAML rather than editing the catalogue by hand?', [
            'Catalogues cannot store descriptions',
            'YAML is faster to search',
            'Manual edits are not allowed',
            'Metadata as code is versioned, reviewed and kept current',
          ], 3, 'Metadata that travels with code changes stays accurate far longer than manual entries.'),
          q('What is the purpose of certifying datasets?', [
            'To make them load faster',
            'To hide them from analysts',
            'To steer users to trusted, tested, owned tables',
            'To encrypt them automatically',
          ], 2, 'Certification highlights reliable datasets among many experimental ones.'),
        ]
      ),
      lesson('Serving Data: BI, Reverse ETL and APIs', 13, `
Data creates value only when people and systems use it. Serving is the last step of the platform: delivering modelled data to dashboards, to operational tools such as CRMs and ad platforms, and to applications through APIs. Each path has its own design concerns.

### Business intelligence

BI tools such as Power BI, Looker, Tableau, Metabase and Apache Superset are the most common consumers. Design for them:

| Practice | Why |
|---|---|
| Point dashboards at marts or aggregate tables, not raw data | Fast, consistent, cheap queries |
| Define metrics in a semantic layer | One definition of revenue across all dashboards |
| Choose live queries or extracts deliberately | Live is fresh but hits the warehouse; extracts are fast but scheduled |
| Use a dedicated BI compute and service account | Cost attribution and controlled access |
| Show freshness on dashboards | Users know how current the data is |

Semantic layers, in dbt, Looker's modelling layer or BI tools' own models, hold metric definitions, joins and permissions centrally, so self-service users cannot accidentally define "active users" five different ways.

### Reverse ETL

The warehouse often holds the best view of each customer: lifetime value, churn risk, segment. Business teams want that information inside the tools they use every day. Reverse ETL syncs modelled data from the warehouse back into operational systems:

\`\`\`text
warehouse: dim_customers (segment, lifetime value, churn score)
   -> reverse ETL -> CRM (sales sees segment on each account)
                  -> ad platform (audiences built from high-value segments)
                  -> support tool (priority for valuable customers)
\`\`\`

Tools such as Hightouch and Census provide this, or custom pipelines can. Treat syncs like any production pipeline: tests, monitoring, idempotent updates keyed on the destination's IDs, and awareness of destination rate limits. Be careful with personal data sent to third-party tools; consent and privacy rules apply.

### Data APIs

Applications sometimes need warehouse-derived data: showing a customer their monthly spending summary, or powering a partner portal. Warehouses are built for analytical queries, not thousands of low-latency lookups per second, so a direct connection from an app to the warehouse is usually a mistake. Instead:

\`\`\`text
warehouse model -> scheduled export -> fast serving store (PostgreSQL, Redis,
                                       a key-value store)
                                    -> API service with caching -> application
\`\`\`

The warehouse computes; a store designed for fast lookups serves.

### Data products

Many organisations treat important datasets as data products: owned, documented, versioned and supported, with clear consumers and service levels, much like software products. A "customer 360" table with an owner, a contract, quality tests and a published freshness target is a data product. The framing encourages the reliability and communication consumers need.

### Embedded and exported data

Partners and customers sometimes receive data as scheduled file exports or through shared warehouse access. Secure sharing features in cloud warehouses allow read-only access to specific tables without copying data, which is more controlled and current than emailed files.

### Measure usage

Track who uses which dashboards, syncs and APIs. Retire unused assets; invest in the heavily used ones. Serving is where the platform's value is visible, and usage data shows where that value actually is.
      `,
        [
          q('What does reverse ETL do?', [
            'Loads raw data into the warehouse',
            'Deletes old tables automatically',
            'Converts SQL into Python',
            'Syncs modelled warehouse data into operational tools',
          ], 3, 'Reverse ETL delivers warehouse insights into CRMs, ad platforms and support tools.'),
          q('Why not connect an application directly to the warehouse for per-request lookups?', [
            'Warehouses are built for analytical scans, not many fast lookups',
            'Applications cannot use SQL',
            'Warehouses have no network access',
            'It would break the semantic layer',
          ], 0, 'A serving store designed for low-latency lookups should sit between the warehouse and the app.'),
          q('What does a semantic layer prevent?', [
            'Dashboards from loading',
            'Users from querying data',
            'Different dashboards defining the same metric differently',
            'The warehouse from caching results',
          ], 2, 'Central metric definitions keep numbers consistent across all consumers.'),
        ]
      ),
      lesson('Data for Machine Learning and AI', 13, `
Machine learning models and AI features are only as good as the data that feeds them. Much of the work in successful ML projects is data engineering: building reliable training datasets, serving features consistently, and, increasingly, preparing documents and embeddings for AI assistants. Data engineers who understand these needs are in high demand.

### Training datasets and point-in-time correctness

A model predicting whether an order will be cancelled must be trained only on information available at the moment of prediction. Using data from after that moment, such as the final delivery time, leaks the answer into training. The model looks brilliant in testing and fails in production.

\`\`\`text
Wrong:  join orders to customers' current attributes (today's segment,
        today's lifetime value)
Right:  join each order to customer attributes as they were at order time
        (Type 2 dimensions or snapshot tables, chapter 3)
\`\`\`

Point-in-time joins are one of the most important and most often mishandled tasks in ML data preparation.

### Feature stores

A feature store manages features, input values for models, such as "orders in the last 7 days" or "average basket size":

| Function | Purpose |
|---|---|
| Offline store | Historical feature values for building training sets, with point-in-time joins |
| Online store | Latest values with low-latency lookup for real-time predictions |
| Shared definitions | One implementation used for training and serving |
| Discovery | Teams reuse existing features instead of rebuilding them |

Open-source Feast and platform features in Databricks and cloud ML services are common options. Smaller teams often manage with well-modelled tables plus a simple serving store.

### Training-serving skew

If a feature is computed one way in the batch training pipeline and another way in the live application, predictions degrade in ways that are hard to diagnose. Computing features once, in shared code or a feature store, and serving the same values to both paths prevents this.

### Data for AI assistants and retrieval

AI features built on large language models often use retrieval-augmented generation: the system searches the organisation's documents for relevant passages and gives them to the model as context. The data engineering work includes:

\`\`\`text
1. Ingest documents: policies, product manuals, support articles, tickets
2. Clean and split them into chunks of suitable size, keeping titles and sources
3. Create embeddings (numerical representations of meaning) for each chunk
4. Store them in a vector index: a vector database or a vector extension
   such as pgvector
5. Keep the index updated as documents change, and remove deleted content
6. Carry access permissions through, so users only retrieve what they may see
\`\`\`

The last point is critical: an assistant that retrieves confidential HR documents for any employee is a data governance failure, not an AI failure.

### Quality and monitoring for ML data

Models are sensitive to shifts in their input data. Monitor feature distributions over time; when the data drifts, for example after a pricing change or a new city launch, model performance may drop. The data quality practices of chapter 9 apply directly, with the addition of distribution and drift checks on features.

### Governance for ML and AI

Training data and embeddings inherit the sensitivity of their sources. Apply the same classification, minimisation and access control, record which data trained which model, and respect consent and retention rules. Being able to explain what data a model learned from is increasingly expected by regulators and customers alike.
      `,
        [
          q('What is data leakage in a training dataset?', [
            'Data stored without encryption',
            'Using information from after the prediction moment',
            'Losing rows during ingestion',
            'Sharing data with another team',
          ], 1, 'Future information in training makes models look accurate but fail in production.'),
          q('What problem does sharing feature code between training and serving solve?', [
            'Slow model training',
            'High storage costs',
            'Training-serving skew from inconsistent calculations',
            'Missing dashboard metrics',
          ], 2, 'Identical feature logic in both paths keeps live predictions consistent with training.'),
          q('Why must document permissions carry into a retrieval index?', [
            'So users only retrieve content they are allowed to see',
            'Vector databases require permissions to start',
            'Permissions make embeddings smaller',
            'Models cannot read documents without them',
          ], 0, 'Without permission-aware retrieval, an assistant can expose confidential documents to anyone.'),
        ]
      ),
      ],
      [
      q('Which data should rarely, if ever, be copied into an analytics warehouse?', [
        'Product catalogue names',
        'Aggregated daily sales',
        'CNIC numbers not needed for analysis',
        'Order status values',
      ], 2, 'Minimising highly sensitive fields is the safest protection; unneeded identifiers should stay out.'),
      q('What open standard lets tools emit lineage events to catalogues?', [
        'Parquet',
        'Iceberg',
        'Avro',
        'OpenLineage',
      ], 3, 'OpenLineage defines lineage events that orchestrators and engines can send to catalogues.'),
      q('How should warehouse-derived data be served to a customer-facing app?', [
        'Exported to a fast serving store behind an API with caching',
        'Queried directly from the warehouse on every request',
        'Emailed to customers as spreadsheets',
        'Copied into the application\'s source code',
      ], 0, 'A lookup-optimised store and API protect the warehouse and give low latency.'),
      q('Which technique gives correct historical attributes for training data?', [
        'Joining to current customer attributes',
        'Point-in-time joins using snapshots or Type 2 dimensions',
        'Random sampling of dimension rows',
        'Removing all dimension attributes',
      ], 1, 'Attributes as they were at event time prevent leakage of later information.'),
      ]
    ),
    chapter(
      'Projects and Careers',
      'Build an end-to-end pipeline project that demonstrates the full skill set, manage data infrastructure with code and CI/CD, prepare for data engineering interviews, and plan a career path in the field.',
      [
      lesson('An End-to-End Pipeline Project', 14, `
Employers hiring data engineers want evidence that you can build a working pipeline from source to insight, not only that you know the vocabulary. A single well-built, well-documented project that uses real data and follows the practices in this course demonstrates more than any list of tools on a CV.

### Choose a real, interesting source

Pick data that is public, refreshes regularly and supports genuine questions:

| Idea | Source | Questions |
|---|---|---|
| Weather and air quality in Pakistani cities | Free weather and air quality APIs | How does air quality in Lahore vary by season and time of day? |
| Fuel and commodity prices | Published government or market price data | How have prices changed, and how do cities compare? |
| E-commerce simulation | A synthetic order generator you write | Revenue by city, repeat customers, basket size |
| Open transport or public service data | Government open data portals | Usage patterns over time |
| Cricket statistics | Public match datasets | Player form, venue effects |

Data that refreshes daily lets you show incremental loading and scheduling working over time.

### A reference architecture

\`\`\`text
Source API or files
  -> Python extraction (dlt or custom), raw JSON to object storage or a raw schema
  -> Warehouse: DuckDB or PostgreSQL locally, or a cloud warehouse's free tier
  -> dbt: staging, intermediate and marts, with tests and docs
  -> Orchestrator: Airflow or Dagster, daily schedule, retries, alerts
  -> Dashboard: Metabase, Superset or Evidence
  -> Everything in Docker Compose, with GitHub Actions CI
\`\`\`

Keep costs at zero or near it: local engines and free tiers are enough to demonstrate every skill.

### What the project should demonstrate

| Skill | Evidence in the project |
|---|---|
| Ingestion | Incremental loads with a watermark and raw data preserved |
| Modelling | A star schema with at least one fact and conformed dimensions |
| Transformation | dbt models in layers, with incremental logic for the fact |
| Quality | dbt tests plus freshness and volume checks |
| Orchestration | A scheduled DAG with retries and a failure alert |
| Idempotency | A backfill command that re-runs any date range safely |
| Documentation | A README, dbt docs and an architecture diagram |
| Engineering | Tests, linting and CI on every pull request |

### The README matters most

Recruiters and interviewers often read only the README. Include:

- The question the project answers and a screenshot of the dashboard.
- An architecture diagram with each layer labelled.
- How to run it in one or two commands.
- Design decisions and trade-offs: why incremental, why this model, why these tests.
- What you would do differently at larger scale.

### Show that it runs over time

A pipeline that ran daily for a month, with its run history and a note about an incident you fixed ("the API changed a field name on 12 March; the schema test caught it"), is far more convincing than one that ran once. It proves the operational side of the job.

### Go one step further

Add one advanced element that interests you: a streaming ingestion path, a lakehouse table format, a data contract enforced in CI, or a cost dashboard. One deep feature shows curiosity and initiative better than a dozen shallow ones.

### Common mistakes

- Using a static CSV that never changes, so incremental logic is never exercised.
- No tests, so quality is only claimed.
- A notebook instead of a pipeline, with manual steps.
- Hard-coded credentials committed to the repository, an instant red flag.
- A dashboard with no stated question or insight.

### Share it

Publish the repository, write a short article about what you built and learned, and post it on LinkedIn. Many data engineers in Pakistan have found their first international remote role through a well-presented project and write-up.
      `,
        [
          q('Why choose a source that refreshes regularly for a portfolio project?', [
            'Static data cannot be stored in a warehouse',
            'It exercises incremental loads and scheduling over time',
            'Recruiters only accept live data',
            'Refreshing data is always free',
          ], 1, 'Changing data proves the pipeline handles increments, schedules and real operations.'),
          q('Which is an instant red flag in a data engineering portfolio repository?', [
            'An architecture diagram in the README',
            'dbt tests on key models',
            'A CI workflow that runs on pull requests',
            'Hard-coded credentials committed to the code',
          ], 3, 'Committed secrets signal poor security practice to any reviewer.'),
          q('What most convincingly shows operational skill in a project?', [
            'A long list of tools used',
            'A single successful run',
            'Run history over time and a documented incident you fixed',
            'A larger dataset than other candidates',
          ], 2, 'Evidence of the pipeline running, breaking and being fixed demonstrates real-world ability.'),
        ]
      ),
      lesson('Infrastructure as Code and CI/CD for Data', 13, `
Data platforms consist of infrastructure: buckets, warehouses, roles, service accounts, orchestrator deployments. Created by hand through web consoles, they drift, become impossible to reproduce and hide security gaps. Managing them as code, and deploying pipelines through CI/CD, brings the same reliability to data infrastructure that software teams expect.

### Infrastructure as code

Tools such as Terraform and OpenTofu describe infrastructure in declarative files:

\`\`\`hcl
resource "aws_s3_bucket" "raw" {
  bucket = "bazaar-data-raw"
}

resource "aws_s3_bucket_lifecycle_configuration" "raw" {
  bucket = aws_s3_bucket.raw.id
  rule {
    id     = "archive-old-raw"
    status = "Enabled"
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}
\`\`\`

Warehouses have providers too: databases, schemas, compute clusters, roles and grants can all be defined in code.

| Benefit | Explanation |
|---|---|
| Reproducibility | Staging and production are built from the same definitions |
| Review | Access changes go through pull requests, visible to reviewers |
| History | Every change to permissions and infrastructure is recorded |
| Recovery | A lost environment can be recreated |
| Consistency | No hidden hand-made settings |

Access control in particular benefits: a pull request granting a role access to a sensitive schema is reviewed and recorded, rather than clicked in a console and forgotten.

### Environments

A typical setup has development, staging and production environments, each with its own schemas or projects, compute and service accounts. Infrastructure code is parameterised by environment, so the same definitions build all three. Production credentials never appear in development.

### CI for data code

Every pull request to the data repository should run:

\`\`\`text
1. Linting: Python (ruff) and SQL (sqlfluff)
2. Unit tests for Python pipeline code
3. DAG import checks for the orchestrator
4. dbt: build changed models and their dependents in a temporary schema
5. dbt tests on those models
6. Optional: compare key metrics between the branch and production
\`\`\`

Step 6, sometimes called data diffing, shows reviewers how a change alters actual numbers, such as "revenue for March changes by 0.2%", which is often more informative than the SQL diff itself.

### CD: deploying changes

\`\`\`text
Merge to main
  -> deploy updated DAGs to the orchestrator
  -> deploy dbt project version to production
  -> infrastructure changes applied through a reviewed Terraform plan
  -> post-deploy checks: key models built, tests passing, freshness normal
\`\`\`

Deploy small changes frequently rather than large batches. Keep the ability to roll back: previous dbt and DAG versions redeployable, and table changes reversible through write-audit-publish or versioned models (chapter 10).

### Secrets in pipelines

CI/CD systems need credentials to deploy and test. Use short-lived credentials through federation between the CI provider and the cloud where possible, scoped to what each job needs. Never print secrets in logs, and never give CI jobs production write access unless that job deploys to production.

### Start small

A team without any of this can start with three steps: put all SQL and pipeline code in Git, add a CI check that builds and tests changed dbt models, and define warehouse roles and grants in code. Each step reduces incidents, and together they change how confidently the team can make changes.
      `,
        [
          q('What is a key benefit of defining warehouse grants in code?', [
            'Access changes are reviewed and recorded in pull requests',
            'Grants execute faster than console changes',
            'Code removes the need for roles',
            'Warehouses reject console changes',
          ], 0, 'Reviewed, versioned permissions prevent hidden and forgotten access grants.'),
          q('What does data diffing in CI show reviewers?', [
            'The Python code style',
            'How a change alters actual output numbers',
            'The cost of the CI run',
            'Which users viewed the dashboard',
          ], 1, 'Comparing branch and production results reveals the real effect of a change on data.'),
          q('Which is a sensible first step for a team with no data CI/CD?', [
            'Build a custom deployment platform first',
            'Buy every observability tool available',
            'Wait until the platform is complete',
            'Put all SQL in Git and test changed dbt models in CI',
          ], 3, 'Small, high-value steps reduce incidents immediately and build momentum.'),
        ]
      ),
      lesson('Preparing for Data Engineering Interviews', 13, `
Data engineering interviews test a mix of skills: SQL fluency, programming, data modelling, pipeline design and how you handle real operational problems. Preparing for each area deliberately, and practising out loud, makes a large difference to outcomes.

### Typical interview stages

| Stage | Focus |
|---|---|
| Screening | Background, motivation, core concepts |
| SQL assessment | Live or take-home queries: joins, aggregations, windows |
| Coding | Python data manipulation, sometimes algorithms |
| Data modelling | Design a schema for a business scenario |
| Pipeline or system design | Design ingestion, storage, transformation and serving for a use case |
| Behavioural | Past projects, incidents, collaboration |

### SQL: the most tested skill

Expect questions such as:

\`\`\`text
- Second highest salary per department
- Running total of revenue by day
- Users who ordered in three consecutive months
- Deduplicate to the latest record per key
- Month-over-month growth by city
- Sessions from event logs with a 30-minute gap
\`\`\`

Most are solved with window functions, CTEs and careful joins (chapter 2). Practise writing them without an IDE, explaining your approach, and checking edge cases: NULLs, ties, empty groups and time zones.

### Data modelling questions

"Design the data model for a food delivery platform's analytics." A strong answer:

\`\`\`text
1. Ask which questions the business needs answered
2. Identify business processes: orders, deliveries, payments, ratings
3. Declare the grain of each fact table
4. Define conformed dimensions: customer, restaurant, rider, date, location
5. Handle history: which attributes need Type 2
6. Mention metrics and how they are defined consistently
\`\`\`

### Pipeline design questions

"Design a pipeline that makes app events available for analytics within an hour and for fraud detection within seconds." Walk through requirements, volumes, batch versus streaming for each need, storage choices, idempotency, quality checks, monitoring and cost. Use the trade-off language from chapter 1: what you chose, why, and what it costs.

### Operational scenarios

Interviewers often ask: "A dashboard shows revenue doubled overnight. What do you do?" Show a calm method:

\`\`\`text
1. Check whether it is real: compare with the source system
2. Check pipeline runs: retries, backfills, duplicate loads
3. Check tests and row counts for the affected tables
4. Use lineage to find where the change entered
5. Communicate with stakeholders, fix, backfill, and prevent recurrence
\`\`\`

This kind of answer shows production experience more than any tool knowledge.

### Behavioural preparation

Prepare three or four stories using a structure such as situation, task, action, result: a pipeline you built, an incident you resolved, a disagreement about a metric definition you helped settle, and a time you improved cost or performance. Quantify results where possible.

### Certifications

Certifications can help, especially for candidates without direct experience. Major cloud providers and platforms offer data engineering certifications, and dbt and warehouse vendors offer their own. Check the current names and syllabi on each provider's site. Treat them as structured learning plus a CV signal, not as a substitute for projects.

### Practise realistically

Solve SQL problems daily for a few weeks, do mock design interviews with a friend, and rehearse explaining your portfolio project in five minutes. Explaining clearly under mild pressure is itself a skill, and it improves quickly with practice.
      `,
        [
          q('Which SQL feature solves most interview questions like running totals and deduplication?', [
            'Window functions',
            'Stored procedures',
            'Triggers',
            'Cursors',
          ], 0, 'ROW_NUMBER, LAG, SUM OVER and similar functions handle ranking, running totals and deduplication.'),
          q('What should come first in a data modelling interview answer?', [
            'Choosing the warehouse vendor',
            'Asking which questions the business needs answered',
            'Listing every possible column',
            'Writing the SQL for all tables',
          ], 1, 'Business questions determine processes, grain and dimensions.'),
          q('Revenue doubled overnight on a dashboard. What is a good first step?', [
            'Announce record growth to management',
            'Rebuild the whole warehouse',
            'Delete the dashboard',
            'Compare with the source system to check it is real',
          ], 3, 'Verifying against the source separates real change from pipeline errors such as duplicate loads.'),
        ]
      ),
      lesson('Careers in Data Engineering', 12, `
Data engineering has become one of the most in-demand technical careers, because every organisation that wants to use its data needs reliable pipelines first. The path offers strong growth, varied specialisations and good remote opportunities for engineers in Pakistan.

### Where data engineers work

| Sector | Typical work |
|---|---|
| Banks and fintechs | Transaction data, regulatory reporting, fraud features |
| Telecom operators | Very large usage data, customer analytics, network data |
| E-commerce and delivery | Orders, logistics, marketing attribution |
| Software houses and consultancies | Building platforms for local and foreign clients |
| Product companies and startups | Product analytics and ML data |
| Government and development sector | Statistics, public service data |

### Entry points

- **From software engineering**: strong coding and systems skills; learn SQL depth, modelling and data tools.
- **From data analysis**: strong SQL and business sense; learn Python, orchestration and engineering practices.
- **From database administration**: deep database knowledge; learn cloud, pipelines and modern tooling.
- **As a graduate**: a solid project, SQL fluency and fundamentals of Python and cloud open junior roles and internships.

### Progression

\`\`\`text
Junior data engineer   builds and maintains pipelines with guidance
Data engineer          owns pipelines and models end to end
Senior data engineer   designs platforms, sets standards, mentors
Staff or lead          shapes data architecture across teams and domains
\`\`\`

Parallel paths include analytics engineering, data platform engineering, ML engineering and data architecture. Many engineers move between them as interests develop.

### Skills that grow a career

| Area | Why it matters |
|---|---|
| Deep SQL and modelling | The core of the job at every level |
| Software engineering practice | Testing, CI/CD and code quality distinguish senior engineers |
| Cloud and distributed systems | Platforms run on them |
| Data quality and reliability | Trust is the product |
| Cost awareness | Increasingly valued as cloud bills grow |
| Communication | Translating between business needs and technical design |
| Domain knowledge | Finance, telecom or e-commerce expertise multiplies impact |

### Remote and international work

Data engineering suits remote work well, and many companies abroad hire engineers in Pakistan for full-time remote roles and contracts. What helps: strong written English, a public portfolio, experience with widely used tools (a major cloud, dbt, Airflow or Dagster, a leading warehouse), reliable availability across time zones, and clear communication about incidents and progress.

### Staying current

Tools change quickly, but fundamentals persist: modelling, SQL, distributed systems, reliability and communication. Follow a few trusted sources, experiment with new tools in side projects, and keep your portfolio project alive by upgrading it as you learn. Contributing to open-source data tools, even documentation fixes, builds skills and visibility.

### A long-term view

The most valuable data engineers are not those who know the most tools, but those whose platforms people trust: data arrives on time, numbers match, problems are caught and communicated early, and the business can answer new questions quickly. Building that trust, one reliable pipeline at a time, is what this course has prepared you to do.
      `,
        [
          q('What distinguishes the most valuable data engineers?', [
            'Knowing the largest number of tools',
            'Writing the longest SQL queries',
            'Building platforms that people trust',
            'Avoiding contact with business users',
          ], 2, 'Reliable, trusted data is the real product of data engineering.'),
          q('What helps most when applying for remote roles abroad?', [
            'Only listing certifications',
            'A public portfolio and clear written communication',
            'Avoiding widely used tools',
            'Working only in local time zones',
          ], 1, 'Visible work and strong communication build trust with remote employers.'),
          q('Which background transition typically needs extra focus on Python and engineering practice?', [
            'Moving from data analysis into data engineering',
            'Moving from software engineering into data engineering',
            'Moving from platform engineering into infrastructure',
            'Moving from backend development into APIs',
          ], 0, 'Analysts bring strong SQL and business sense, and usually need to add coding and engineering discipline.'),
        ]
      ),
      ],
      [
      q('What should a portfolio pipeline\'s README include?', [
        'The question answered, architecture, run steps and design trade-offs',
        'Only the list of tools used',
        'Production credentials for testing',
        'A copy of every SQL file',
      ], 0, 'A clear README lets reviewers understand the project\'s purpose, design and quality quickly.'),
      q('Which tool family manages data infrastructure as declarative code?', [
        'dbt and its packages',
        'Airflow and its providers',
        'Kafka and Kafka Connect',
        'Terraform and OpenTofu',
      ], 3, 'Infrastructure-as-code tools define buckets, warehouses, roles and grants in reviewable files.'),
      q('In a pipeline design interview, what should you explain for each choice?', [
        'The tool\'s release date',
        'What you chose, why, and what it costs',
        'The vendor\'s market share',
        'Only the fastest option',
      ], 1, 'Trade-off reasoning shows judgement, which interviewers value most.'),
      q('How should certifications be treated in a data engineering career?', [
        'As a full replacement for projects',
        'As unnecessary in every case',
        'As structured learning and a CV signal alongside projects',
        'As a requirement for every role',
      ], 2, 'Certifications help but work best combined with demonstrable projects.'),
      ]
    ),
  ],
  final: [
    q('What is the main job of a data engineer?', [
      'Designing company logos',
      'Building systems that deliver trustworthy data',
      'Training every machine learning model',
      'Managing office networks',
    ], 1, 'Data engineers build and run the pipelines and platform others rely on.'),
    q('Why keep raw source data unchanged in the platform?', [
      'Raw data is faster to query',
      'Warehouses cannot edit tables',
      'Analysts prefer raw tables',
      'Transformations can be fixed and re-run from the original',
    ], 3, 'Preserving raw copies makes every later layer reproducible.'),
    q('Joining orders to order items before summing order totals causes what problem?', [
      'Totals are inflated by fan-out',
      'The query fails to run',
      'NULLs replace every total',
      'Rows are dropped silently',
    ], 0, 'One-to-many joins repeat order values per item; aggregate the many side first.'),
    q('In a star schema, what must be declared for every fact table?', [
      'Its colour',
      'Its storage vendor',
      'Its grain',
      'Its dashboard owner',
    ], 2, 'The grain states what one row represents and prevents double counting.'),
    q('Which slowly changing dimension type preserves history by adding rows?', [
      'Type 1',
      'Type 3',
      'Type 2',
      'Type 0',
    ], 2, 'Type 2 versions dimension rows with validity dates.'),
    q('Which extraction method captures deletes from a database\'s log?', [
      'Change data capture',
      'Timestamp-based incremental loads',
      'Emailed CSV exports',
      'Reverse ETL',
    ], 0, 'CDC reads the transaction log, which records inserts, updates and deletes.'),
    q('What is the rule every load should follow?', [
      'Run only once per day',
      'Always reload the full table',
      'Advance the watermark before loading',
      'Safe to run twice and possible for any past window',
    ], 3, 'Idempotent, window-based loads recover from failures by re-running.'),
    q('Why is Parquet the standard format for analytical files?', [
      'It is human-readable in text editors',
      'It is columnar, compressed and typed',
      'It stores one row per line',
      'It is required by all APIs',
    ], 1, 'Columnar layout with statistics makes analytical reads small and fast.'),
    q('What do open table formats such as Iceberg add to lake files?', [
      'Atomic commits, updates and time travel',
      'Row-oriented storage',
      'Automatic dashboards',
      'Faster internet connections',
    ], 0, 'A metadata layer gives database-like guarantees on open storage.'),
    q('What does partition pruning achieve?', [
      'Deleting old partitions',
      'Compressing each partition',
      'Reading only partitions that match the filter',
      'Sorting rows within files',
    ], 2, 'Skipping irrelevant partitions is the biggest saving for large tables.'),
    q('What does dbt\'s ref() function record?', [
      'The model\'s run time',
      'A dependency that orders the build',
      'The number of rows produced',
      'The warehouse\'s cost',
    ], 1, 'References form the DAG that dbt uses to build models in order.'),
    q('Which dbt test checks that every order\'s customer exists?', [
      'unique',
      'not_null',
      'accepted_values',
      'relationships',
    ], 3, 'The relationships test enforces referential integrity between models.'),
    q('Why should Airflow tasks use the data interval instead of the current time?', [
      'The current time is unavailable',
      'Intervals make tasks faster',
      'Airflow blocks the system clock',
      'Backfills then process exactly the right period',
    ], 3, 'Interval-based tasks make re-runs and backfills correct.'),
    q('Where does Kafka guarantee ordering?', [
      'Within a single partition',
      'Across all topics',
      'Across all partitions of a topic',
      'Only for unkeyed events',
    ], 0, 'Order holds within a partition, so related events share a key.'),
    q('Why do stream processors need watermarks?', [
      'To encrypt events',
      'To compress state',
      'To decide when a window is complete despite late events',
      'To choose the partition count',
    ], 2, 'Watermarks balance completeness against latency for event-time windows.'),
    q('Which failure succeeds technically but produces wrong numbers?', [
      'A missing password',
      'A retry that loaded a day twice',
      'A syntax error',
      'A crashed worker',
    ], 1, 'Duplicate loads pass every task while doubling totals.'),
    q('What do data contracts mainly prevent?', [
      'Producers breaking data that others depend on',
      'Slow dashboards',
      'High storage costs',
      'Missing documentation colours',
    ], 0, 'Explicit, owned interfaces stop upstream changes from silently breaking consumers.'),
    q('What is the first step in controlling cloud data costs?', [
      'Shrinking every compute size',
      'Deleting all dashboards',
      'Moving data to spreadsheets',
      'Making spend visible by team and pipeline',
    ], 3, 'Attribution shows where money goes before anything can be reduced.'),
    q('How should warehouse data be served to a customer-facing app?', [
      'Direct warehouse queries on every request',
      'Through a fast serving store behind an API',
      'Emailed spreadsheets',
      'Copied into source code',
    ], 1, 'Lookup-optimised stores give low latency and protect the warehouse.'),
    q('What causes data leakage in a training dataset?', [
      'Encrypting training data',
      'Using Type 2 dimensions',
      'Using information from after the prediction moment',
      'Sampling rows randomly',
    ], 2, 'Future information makes models look accurate in testing but fail in production.'),
  ],
});
