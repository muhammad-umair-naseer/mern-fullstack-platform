import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'sql-data-analysis',
  title: 'SQL & Data Analysis',
  category: 'Data',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'amber',
  coverKey: 'sql-data-analysis',
  summary:
    'Learn to ask a database anything — from your first SELECT to window functions, query plans, and turning a vague business question into a number you can defend.',
  description:
    'You work one small store schema — customers, orders, products, order items — from the first SELECT all the way to running totals, deduplication, and index tuning, so every example builds on the last. Each chapter ends with you able to spot a specific class of wrong answer: the NULL that swallows your filter, the join that silently doubles revenue, the HAVING that should have been a WHERE, and the query plan that explains why your report takes four minutes.',
  chapters: [
    chapter(
      'Thinking in Tables',
      'The relational model, the schema this whole course uses, and your first real queries.',
      [
        lesson('Rows, Keys, and the Shape of a Database', 12, `
A **table** is a set of rows, and each row states one fact about one thing. That sentence carries more weight than it looks like it does: almost every badly designed database is bad because a single row tries to state two facts at once.

### The spreadsheet habit that breaks

Data usually arrives as one wide sheet:

| order_id | customer_name | customer_city | product | qty | price |
|---|---|---|---|---|---|
| 1001 | Ayesha Khan | Lahore | Mechanical Keyboard | 1 | 120.00 |
| 1001 | Ayesha Khan | Lahore | USB-C Hub | 2 | 45.00 |
| 1002 | Ayesha Khan | Lahore | 27-inch Monitor | 1 | 300.00 |

Ayesha's city appears three times. When she moves to Karachi you have to find and change every copy, and if you miss one, the database now holds two contradictory answers to "where does Ayesha live?" That is an **update anomaly**. The fix is to give every *kind of thing* its own table and connect them.

### Four tables, four kinds of thing

\`\`\`sql
CREATE TABLE customers (
  customer_id  INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  city         TEXT,
  country      TEXT,
  signup_date  DATE NOT NULL
);

CREATE TABLE products (
  product_id  INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  unit_price  NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders (
  order_id     INTEGER PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(customer_id),
  order_date   DATE NOT NULL,
  status       TEXT NOT NULL          -- 'paid', 'pending', 'refunded'
);

CREATE TABLE order_items (
  order_id    INTEGER NOT NULL REFERENCES orders(order_id),
  product_id  INTEGER NOT NULL REFERENCES products(product_id),
  quantity    INTEGER NOT NULL,
  unit_price  NUMERIC(10,2) NOT NULL, -- price charged at the time of sale
  PRIMARY KEY (order_id, product_id)
);
\`\`\`

Every example in this course uses exactly these four tables, so the queries compound.

### Keys are the wiring

A **primary key** uniquely identifies a row — \`customer_id\` for a customer. A **foreign key** is a column that points at some other table's primary key: \`orders.customer_id\` points at \`customers.customer_id\`. Declaring it with \`REFERENCES\` means the database physically refuses to store an order for a customer who does not exist. Application code forgets that check; a constraint never does.

\`order_items\` has a **composite primary key** — the pair \`(order_id, product_id)\` — because neither column alone is unique, but the combination is.

### One-to-many and many-to-many

One customer has many orders: the "many" side carries the foreign key. That is a **one-to-many** relationship, and it is most of what you will meet.

An order contains many products, and a product appears in many orders. Neither side can hold a single foreign key, so a **junction table** sits between them — that is what \`order_items\` is. Any time you catch yourself wanting a column called \`product_ids\` holding \`"10,11,14"\`, you need a junction table instead.

### Types are not decoration

Store money as \`NUMERIC\`/\`DECIMAL\`, never \`FLOAT\`. Binary floating point cannot represent 0.1 exactly, so a thousand float order totals summed together drift by cents — and a finance team will find every one of them. Store dates as \`DATE\`/\`TIMESTAMP\`, not text, or \`'9 March'\` sorts before \`'10 March'\`.

### NULL means "unknown"

\`NULL\` is not zero and not an empty string. \`city = NULL\` means we do not know the city; \`city = ''\` means someone typed nothing. Mixing them is the source of the filtering bugs in lesson three of this chapter.

### The deliberate duplicate

\`order_items.unit_price\` looks redundant — \`products\` already has a price. It is there on purpose. When you raise the monitor's price to 340, last year's invoices must still say 300. A price in \`products\` is *today's catalogue price*; a price in \`order_items\` is *what this customer actually paid*. Copying it is not sloppiness, it is history.
        `),
        lesson('SELECT, WHERE, and ORDER BY', 13, `
A query answers three questions: which columns, which rows, in what order.

\`\`\`sql
SELECT name, city, signup_date
FROM customers
WHERE country = 'PK'
ORDER BY signup_date DESC;
\`\`\`

Against our data that returns Bilal Ahmed (2024-02-03) then Ayesha Khan (2024-01-14) — newest first.

### Choose columns deliberately

\`SELECT *\` is perfect while exploring and a liability in anything you save. It breaks the moment somebody adds a column, drags unused megabytes across the network, and hides which fields your report actually depends on. Name your columns in anything that runs twice.

Columns can be computed, and **aliases** name the result:

\`\`\`sql
SELECT
  order_id,
  quantity,
  unit_price,
  quantity * unit_price AS line_total   -- AS is optional but always write it
FROM order_items
WHERE order_id = 1001;
\`\`\`

| order_id | quantity | unit_price | line_total |
|---|---|---|---|
| 1001 | 1 | 120.00 | 120.00 |
| 1001 | 2 | 45.00 | 90.00 |

Order 1001 is worth 210.00.

### Filtering with WHERE

\`\`\`sql
WHERE unit_price > 100                        -- comparison
WHERE status <> 'refunded'                    -- not equal; != also works
WHERE category IN ('Peripherals', 'Displays') -- one of a list
WHERE unit_price BETWEEN 50 AND 120           -- inclusive on both ends
WHERE name LIKE 'USB%'                        -- % = any characters, _ = one
WHERE city IS NULL                            -- never use = NULL
\`\`\`

### The precedence bug everyone writes once

\`AND\` binds more tightly than \`OR\`, exactly like multiplication binds more tightly than addition:

\`\`\`sql
-- WRONG: reads as country='PK' OR (country='SG' AND status='paid')
SELECT * FROM orders o JOIN customers c USING (customer_id)
WHERE c.country = 'PK' OR c.country = 'SG' AND o.status = 'paid';

-- RIGHT: parenthesise the OR
WHERE (c.country = 'PK' OR c.country = 'SG') AND o.status = 'paid';
\`\`\`

The wrong version silently returns unpaid Pakistan orders too. It does not error, it just answers a different question — which is the worst kind of SQL bug, because the output still looks reasonable. When you mix \`AND\` and \`OR\`, put brackets around the \`OR\`. Always.

### Sorting

\`\`\`sql
SELECT product_id, name, unit_price
FROM products
ORDER BY category ASC, unit_price DESC;   -- category, then price within it
\`\`\`

\`ASC\` is the default. You can sort by an alias (\`ORDER BY line_total DESC\`) because sorting happens after the \`SELECT\` list is computed — a rule we will make precise in Chapter 2. You can also sort by position (\`ORDER BY 3\`), which quietly breaks the day someone inserts a column, so do not.

NULLs sort together at one end, and *which* end differs by database. Say what you mean with \`ORDER BY city NULLS LAST\` where your engine supports it.

### LIMIT, and the mistake it hides

\`\`\`sql
SELECT * FROM orders ORDER BY order_date DESC LIMIT 5;
\`\`\`

\`LIMIT\` without \`ORDER BY\` is not "the first five rows" — it is *any* five rows. Tables have no inherent order, so the same query can return different rows after an update, a vacuum, or a parallel plan. If you take a limit, you owe it a deterministic sort, and if the sort column has ties, add a tiebreaker like \`ORDER BY order_date DESC, order_id DESC\` so pagination does not skip or repeat rows.

### DISTINCT

\`\`\`sql
SELECT DISTINCT country FROM customers;   -- PK, SG, ES, NO
\`\`\`

\`DISTINCT\` applies to the whole row you selected, not to one column. \`SELECT DISTINCT city, country\` gives unique *pairs*. If you find yourself sprinkling \`DISTINCT\` to make duplicates go away, stop — duplicates almost always mean a join is fanning out, which Chapter 3 covers properly.
        `),
        lesson('NULLs, Text, and Dates Without Lying', 13, `
Most wrong-but-plausible query results come from three places: a NULL that swallowed a filter, a string that did not match because of invisible characters, and a date range that quietly dropped a day.

### SQL logic has three values

Comparisons return TRUE, FALSE, or **UNKNOWN**. Any comparison involving NULL returns UNKNOWN, and \`WHERE\` keeps only rows that are TRUE.

\`\`\`sql
WHERE city = NULL      -- UNKNOWN for every row: returns nothing, ever
WHERE city <> 'Lahore' -- drops rows where city IS NULL, silently
WHERE city IS NULL     -- the only correct test
\`\`\`

That middle line is the one that costs money. Ask for "customers not in Lahore" and Erik Sund, whose city was never recorded, is missing from your count — not because of a bug you can see, but because UNKNOWN is not TRUE. Write it explicitly:

\`\`\`sql
WHERE city IS DISTINCT FROM 'Lahore'          -- treats NULL as a real difference
WHERE city <> 'Lahore' OR city IS NULL        -- portable equivalent
\`\`\`

### NOT IN and NULL: the silent killer

\`\`\`sql
-- If ANY value returned by the subquery is NULL, this returns ZERO rows
SELECT * FROM customers
WHERE customer_id NOT IN (SELECT customer_id FROM orders);
\`\`\`

\`x NOT IN (1, 2, NULL)\` expands to \`x <> 1 AND x <> 2 AND x <> NULL\`, and that last term is UNKNOWN, so the whole expression can never be TRUE. An empty result set looks like "no such customers" rather than "your query is broken". Use \`NOT EXISTS\` instead, which is NULL-safe and usually faster:

\`\`\`sql
SELECT * FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
\`\`\`

That returns Erik Sund, our customer who has never ordered.

### Replacing NULLs on the way out

\`\`\`sql
SELECT
  name,
  COALESCE(city, 'Unknown')        AS city,     -- first non-NULL argument
  NULLIF(country, '')              AS country   -- '' becomes NULL
FROM customers;
\`\`\`

\`COALESCE\` is for display and for arithmetic — \`price * quantity\` is NULL if either side is NULL, so \`COALESCE(discount, 0)\` before subtracting it. \`NULLIF\` is the inverse and is how you clean an "empty string means missing" column before casting it.

### Text that looks equal but is not

\`\`\`sql
WHERE email = 'Ayesha@Shop.com '   -- trailing space, mixed case: no match
WHERE LOWER(TRIM(email)) = 'ayesha@shop.com'
\`\`\`

Comparison is case-sensitive in PostgreSQL and case-insensitive by default in MySQL, so a query that works on your laptop can behave differently in production. Normalise both sides rather than trusting the engine. Be aware, though, that wrapping a column in \`LOWER()\` stops an ordinary index from being used — Chapter 5 shows the expression index that fixes it.

\`LIKE 'usb%'\` anchors at the start; \`ILIKE\` is Postgres's case-insensitive version; \`'%hub%'\` matches anywhere but cannot use a normal index at all.

### Dates: use half-open ranges

\`\`\`sql
-- WRONG when order_date is a timestamp: misses 2024-03-31 09:15
WHERE order_date BETWEEN '2024-03-01' AND '2024-03-31'

-- RIGHT: >= start, < the day after the end
WHERE order_date >= DATE '2024-03-01'
  AND order_date <  DATE '2024-04-01'
\`\`\`

\`'2024-03-31'\` as a timestamp means midnight at the start of that day, so \`BETWEEN\` silently discards almost 24 hours of data. The half-open pattern (\`>= start, < next start\`) never has this problem, works identically for dates and timestamps, handles month lengths and leap years for free, and lets an index on \`order_date\` do the work.

To group by month, truncate rather than build strings:

\`\`\`sql
SELECT DATE_TRUNC('month', order_date) AS month, COUNT(*) AS orders
FROM orders GROUP BY 1 ORDER BY 1;
\`\`\`

March 2024 has two orders (1001, 1003). Truncating keeps the value a real date, so it sorts correctly; a text label like \`'Mar-2024'\` sorts alphabetically and puts April before March.
        `),
      ],
      [
        q('Why does order_items store its own unit_price when products already has one?', [
          'To make joins faster',
          'Because NUMERIC columns cannot be shared between tables',
          'So an invoice keeps the price actually charged, even after the catalogue price changes',
          'Because products.unit_price is allowed to be NULL',
        ], 2, 'products.unit_price is today\'s price; order_items.unit_price is history, and history must not change when the catalogue does.'),
        q('WHERE city = NULL returns no rows. Why?', [
          'NULL is only valid in the SELECT list',
          'Any comparison with NULL evaluates to UNKNOWN, and WHERE keeps only TRUE',
          'The column must be indexed first',
          'NULL is stored as the text "NULL", so quotes are needed',
        ], 1, 'SQL is three-valued: NULL comparisons yield UNKNOWN, which WHERE discards, so IS NULL is the only working test.'),
        q("WHERE country = 'PK' OR country = 'SG' AND status = 'paid' returns unpaid Pakistan orders. Why?", [
          'IN would have been required for two countries',
          'status is a text column so it is ignored',
          'The two country tests cancel each other out',
          'AND binds tighter than OR, so it groups as PK OR (SG AND paid)',
        ], 3, 'AND has higher precedence than OR, so the paid condition attaches only to the SG branch; parenthesise the OR.'),
        q('You run SELECT * FROM orders LIMIT 5 twice and get different rows. What is wrong?', [
          'Without ORDER BY there is no defined row order, so LIMIT picks arbitrary rows',
          'LIMIT is not supported without OFFSET',
          'The table needs a primary key',
          'Another session must be inserting rows',
        ], 0, 'Tables are unordered sets; a limit is only meaningful once a deterministic ORDER BY defines what "first" means.'),
      ]
    ),
    chapter(
      'Aggregation: Rows Into Answers',
      'Collapsing thousands of rows into the handful of numbers someone actually asked for.',
      [
        lesson('COUNT, SUM, AVG and the Rules They Follow', 13, `
An **aggregate function** takes many rows and returns one value. That is the whole idea; the difficulty is knowing exactly which rows it counted.

\`\`\`sql
SELECT
  COUNT(*)                 AS order_count,   -- 6
  MIN(order_date)          AS first_order,   -- 2024-03-02
  MAX(order_date)          AS last_order     -- 2024-07-15
FROM orders;
\`\`\`

### COUNT has three different meanings

| Expression | Counts |
|---|---|
| \`COUNT(*)\` | Every row, NULLs included |
| \`COUNT(city)\` | Rows where \`city\` is **not** NULL |
| \`COUNT(DISTINCT city)\` | Distinct non-NULL values |

Our five customers all have a city except Erik, so \`COUNT(*)\` is 5 and \`COUNT(city)\` is 4. This is not a trivia point — \`COUNT(some_column)\` is how a "total customers" figure quietly becomes "customers whose profile is complete", and nobody notices because both numbers look reasonable.

Get into the habit of writing \`COUNT(*)\` when you mean rows, and naming the column only when you deliberately want to skip missing values.

### SUM and AVG ignore NULLs too

\`\`\`sql
-- Suppose 4 orders have a delivery_rating: 5, 4, NULL, 3
SELECT AVG(delivery_rating) FROM orders;   -- 4.0, not 3.0
\`\`\`

\`AVG\` divides by the count of **non-NULL** values, so the sum 12 is divided by 3, not 4. If a missing rating should count as zero, say so: \`AVG(COALESCE(delivery_rating, 0))\`. Neither answer is wrong in general — but only one matches what the person asking meant, and you have to decide which.

### SUM over zero rows returns NULL, not 0

\`\`\`sql
SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = 9999;
-- NULL — and NULL + 100 is NULL, which then poisons everything downstream
\`\`\`

Wrap totals that feed further arithmetic or a dashboard tile:

\`\`\`sql
SELECT COALESCE(SUM(quantity * unit_price), 0) AS revenue FROM order_items ...;
\`\`\`

### Conditional aggregation is the real workhorse

You rarely want a total over everything; you want several totals side by side, split by a condition. Put the condition *inside* the aggregate:

\`\`\`sql
SELECT
  COUNT(*)                                              AS all_orders,      -- 6
  COUNT(*) FILTER (WHERE status = 'paid')               AS paid_orders,     -- 4
  COUNT(*) FILTER (WHERE status = 'refunded')           AS refunded_orders, -- 1
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'paid') / COUNT(*), 1
  )                                                     AS paid_pct         -- 66.7
FROM orders;
\`\`\`

\`FILTER\` is standard SQL and supported by PostgreSQL and SQLite. Everywhere else, \`CASE\` does the same job:

\`\`\`sql
SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)   AS paid_orders,
SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) AS paid_revenue
\`\`\`

Note \`COUNT(CASE WHEN status = 'paid' THEN 1 END)\` also works — with no \`ELSE\`, non-matching rows become NULL and \`COUNT\` skips them. But \`COUNT(CASE ... ELSE 0 END)\` counts *everything*, because 0 is not NULL. That one-character difference between \`SUM\` and \`COUNT\` semantics catches experienced people.

### Integer division, the silent rounder

\`\`\`sql
SELECT COUNT(*) FILTER (WHERE status='paid') / COUNT(*) FROM orders;  -- 0
SELECT 100.0 * COUNT(*) FILTER (WHERE status='paid') / COUNT(*) FROM orders; -- 66.6666666666666667
\`\`\`

In PostgreSQL, integer divided by integer is an integer: 4/6 truncates to 0. Multiplying by \`100.0\` first forces numeric arithmetic. Any time a percentage comes back as 0 or 100, this is why.

### Revenue for our store

\`\`\`sql
SELECT COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS paid_revenue
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
WHERE o.status = 'paid';
\`\`\`

Orders 1001 (210), 1002 (300), 1003 (120) and 1005 (645) total **1275.00**. Order 1004 was refunded and 1006 is still pending, so both are excluded — and stating that exclusion out loud is half of what makes a number trustworthy.
        `),
        lesson('GROUP BY: One Row Per Group', 14, `
\`GROUP BY\` splits rows into buckets and runs your aggregates once per bucket. The output has exactly one row per distinct combination of the grouping columns.

\`\`\`sql
SELECT
  o.customer_id,
  COUNT(*)                                  AS orders,
  SUM(oi.quantity * oi.unit_price)          AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'
GROUP BY o.customer_id
ORDER BY revenue DESC;
\`\`\`

| customer_id | orders | revenue |
|---|---|---|
| 2 | 3 | 765.00 |
| 1 | 3 | 510.00 |

Two things to notice immediately. Customers 3, 4 and 5 are absent — they have no paid order lines, and **a group only exists if at least one row survived the WHERE**. Chapter 3 shows how a LEFT JOIN puts them back with a zero.

Second, \`orders\` says 3 for customer 1 even though she placed 2 orders. We joined to \`order_items\`, so one row per *line item*, not per order. \`COUNT(*)\` faithfully counted rows — it just was not counting the thing we named it. The fix is \`COUNT(DISTINCT o.order_id)\`, and the deeper fix is understanding **grain**, which lesson 3.3 is entirely about.

### The rule that produces SQL's most common error

Every column in the \`SELECT\` list must either appear in \`GROUP BY\` or be wrapped in an aggregate.

\`\`\`sql
-- ERROR: column "c.name" must appear in the GROUP BY clause
SELECT c.country, c.name, COUNT(*)
FROM customers c JOIN orders o USING (customer_id)
GROUP BY c.country;
\`\`\`

The reason is honest: a group is many rows, so which \`name\` should the database pick? Two valid answers:

\`\`\`sql
GROUP BY c.country, c.name           -- name is part of the bucket identity
SELECT MAX(c.name) ...               -- or pick one explicitly
\`\`\`

Grouping by the primary key plus its dependent columns is normal and costs nothing, because \`customer_id\` already determines \`name\`. (PostgreSQL is clever enough to accept \`GROUP BY c.customer_id\` alone when it is the primary key. MySQL historically accepted the query and returned an arbitrary name — which is worse than an error, because it looks like it worked.)

### Group by an expression, not just a column

\`\`\`sql
SELECT
  DATE_TRUNC('month', o.order_date)  AS month,
  COUNT(DISTINCT o.order_id)         AS orders,
  SUM(oi.quantity * oi.unit_price)   AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'
GROUP BY 1
ORDER BY 1;
\`\`\`

| month | orders | revenue |
|---|---|---|
| 2024-03-01 | 2 | 330.00 |
| 2024-04-01 | 1 | 300.00 |
| 2024-06-01 | 1 | 645.00 |

\`GROUP BY 1\` refers to the first \`SELECT\` item; it is common shorthand for grouping by a long expression and avoids repeating it.

Notice May is missing entirely. Aggregation can only report months that have rows, so a chart built straight from this query draws a line from April to June as if May were part of the trend. Reporting on periods with no data needs a **date spine** — a generated list of months LEFT JOINed to the results, which we build in Chapter 3.

### Grouping by more than one column

\`\`\`sql
SELECT c.country, p.category, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN orders    o ON o.order_id    = oi.order_id
JOIN customers c ON c.customer_id = o.customer_id
JOIN products  p ON p.product_id  = oi.product_id
WHERE o.status = 'paid'
GROUP BY c.country, p.category
ORDER BY c.country, revenue DESC;
\`\`\`

You get one row per country-and-category pair that actually occurred. Adding a grouping column always makes the result *finer* and each number *smaller* — if a stakeholder says "just break it down by region as well" and the totals stay the same, something is wrong.

### Sanity-check every grouped query

Run the ungrouped total and confirm the grouped rows add up to it. Here, 330 + 300 + 645 = 1275, which matches the store-wide paid revenue from the previous lesson. That thirty-second check catches fan-out, an accidental filter, and a mistyped join key — the three ways grouped reports go wrong.
        `),
        lesson('HAVING vs WHERE, and the Order SQL Really Runs In', 13, `
SQL is not executed in the order you write it. Learning the real order explains three otherwise arbitrary rules at once.

### The logical order of operations

| # | Clause | What it does |
|---|---|---|
| 1 | \`FROM\` / \`JOIN\` | Assemble the rows |
| 2 | \`WHERE\` | Discard rows |
| 3 | \`GROUP BY\` | Collapse rows into groups |
| 4 | \`HAVING\` | Discard groups |
| 5 | \`SELECT\` | Compute the output columns and aliases |
| 6 | \`DISTINCT\` | Remove duplicate output rows |
| 7 | \`ORDER BY\` | Sort |
| 8 | \`LIMIT\` | Cut |

Everything below follows from that table.

### Why you cannot use an alias in WHERE

\`\`\`sql
-- ERROR: column "line_total" does not exist
SELECT quantity * unit_price AS line_total
FROM order_items
WHERE line_total > 100;

-- Repeat the expression, or wrap the query
WHERE quantity * unit_price > 100;
\`\`\`

\`WHERE\` runs at step 2, and \`line_total\` is not created until step 5. \`ORDER BY line_total\` *does* work, because sorting happens at step 7, after the alias exists. That is the entire explanation for a rule that otherwise feels like a database quirk.

### Why an aggregate cannot go in WHERE

\`\`\`sql
-- ERROR: aggregate functions are not allowed in WHERE
WHERE SUM(quantity * unit_price) > 500
\`\`\`

At step 2 the groups do not exist yet, so there is nothing to sum. Aggregate conditions belong in \`HAVING\`, which runs at step 4:

\`\`\`sql
SELECT
  o.customer_id,
  COUNT(DISTINCT o.order_id)        AS paid_orders,
  SUM(oi.quantity * oi.unit_price)  AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'                       -- row filter, before grouping
GROUP BY o.customer_id
HAVING SUM(oi.quantity * oi.unit_price) > 600 -- group filter, after grouping
ORDER BY revenue DESC;
\`\`\`

Only customer 2 (765.00) survives; customer 1's 510.00 group is formed and then thrown away.

### The distinction in one sentence

**WHERE decides which rows enter a group. HAVING decides which groups leave.**

They are not interchangeable even when both "work":

\`\`\`sql
-- A: excludes refunded lines from the totals
WHERE o.status = 'paid' GROUP BY o.customer_id

-- B: totals include refunded money, then drops customers who ever refunded
GROUP BY o.customer_id HAVING COUNT(*) FILTER (WHERE o.status='refunded') = 0
\`\`\`

Query A answers "how much did each customer actually pay us?" Query B answers "among customers who never asked for a refund, how much did they order?" Customer 3's refunded order 1004 makes those genuinely different reports. Neither is wrong; picking the wrong one is.

### A row filter written as HAVING is a bug waiting to happen

Most engines will accept \`HAVING o.status = 'paid'\` when \`status\` is grouped, and it can give the right answer. It is still worse: the database has to build every group before throwing most away, so it does more work, and no index can help. Worse, it is fragile — the moment someone adds \`COUNT(*)\` to that query, the count now includes refunded rows and the report is silently wrong. **Filter rows as early as possible.**

### Where ORDER BY fits

Because sorting is step 7, you may sort by an alias, by an aggregate, or by a column that is not even in the \`SELECT\` list (as long as it is grouped). What you cannot do is sort a result you have already cut with \`LIMIT\` — step 8 is last, which is exactly why \`LIMIT\` without \`ORDER BY\` is meaningless.

### Checking your instinct

If a condition mentions a single row's values (\`status\`, \`order_date\`, \`country\`), it belongs in \`WHERE\`. If it mentions \`SUM\`, \`COUNT\`, \`AVG\`, \`MIN\` or \`MAX\`, it belongs in \`HAVING\`. There is no third case.
        `),
      ],
      [
        q('customers has 5 rows; one has a NULL city. What does COUNT(city) return?', [
          '5, because COUNT always counts rows',
          '4, because COUNT(column) skips NULLs',
          'NULL, because one value is NULL',
          'An error — COUNT requires *',
        ], 1, 'COUNT(column) counts non-NULL values only, so a "total customers" figure written that way silently becomes "customers with a city".'),
        q('Ratings are 5, 4, NULL and 3. What does AVG(rating) return?', [
          '3.0, because NULL counts as zero',
          'NULL, because one input is NULL',
          '4.0, because AVG divides 12 by the 3 non-NULL values',
          '4.5, because NULL is ignored and the lowest value is dropped',
        ], 2, 'AVG sums non-NULL values and divides by their count, so missing ratings are excluded rather than treated as zero.'),
        q('Which clause correctly keeps only customers whose total paid revenue exceeds 600?', [
          "WHERE SUM(quantity * unit_price) > 600",
          "WHERE revenue > 600, using the SELECT alias",
          "ORDER BY revenue DESC LIMIT 1",
          "HAVING SUM(quantity * unit_price) > 600",
        ], 3, 'Aggregate conditions can only be evaluated after GROUP BY, which is what HAVING is for; WHERE runs before groups exist.'),
        q('Why does WHERE line_total > 100 fail when line_total is a SELECT alias?', [
          'Aliases must be double-quoted in WHERE',
          'WHERE is evaluated before the SELECT list, so the alias does not exist yet',
          'Computed columns cannot be filtered at all',
          'The alias needs to be listed in GROUP BY',
        ], 1, 'WHERE runs at step 2 and the SELECT list at step 5, which is also why ORDER BY can use the alias but WHERE cannot.'),
      ]
    ),
    chapter(
      'Joining Tables',
      'Every join type with worked results, and the three ways joins produce confidently wrong numbers.',
      [
        lesson('INNER JOIN: Matching Rows Across Tables', 13, `
Chapter 1 split our data into four tables so that no fact is stored twice. A **join** puts the pieces back together for one query.

\`\`\`sql
SELECT o.order_id, o.order_date, c.name, c.city
FROM orders o
INNER JOIN customers c ON c.customer_id = o.customer_id
ORDER BY o.order_id;
\`\`\`

| order_id | order_date | name | city |
|---|---|---|---|
| 1001 | 2024-03-02 | Ayesha Khan | Lahore |
| 1002 | 2024-04-18 | Ayesha Khan | Lahore |
| 1003 | 2024-03-09 | Bilal Ahmed | Karachi |
| 1004 | 2024-05-21 | Chen Wei | Singapore |
| 1005 | 2024-06-30 | Bilal Ahmed | Karachi |
| 1006 | 2024-07-15 | Dana Ortiz | Madrid |

Read the \`ON\` clause as the rule for pairing: *for each order, find the customer whose \`customer_id\` matches*. \`INNER\` is the default and is usually omitted — plain \`JOIN\` means inner join.

### Aliases, and why you should qualify everything

\`o\` and \`c\` are **table aliases**. They are not decoration once three tables are involved: \`unit_price\` exists in both \`products\` and \`order_items\`, and referring to it unqualified gives \`ERROR: column reference "unit_price" is ambiguous\`. Qualify every column with its table alias from the start and that error never appears.

### Joining three tables

Joins chain. Each new \`JOIN\` attaches to the result so far:

\`\`\`sql
SELECT
  c.name,
  p.name                            AS product,
  oi.quantity,
  oi.quantity * oi.unit_price       AS line_total
FROM orders o
JOIN customers   c  ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
WHERE o.order_id = 1005;
\`\`\`

| name | product | quantity | line_total |
|---|---|---|---|
| Bilal Ahmed | 27-inch Monitor | 2 | 600.00 |
| Bilal Ahmed | USB-C Hub | 1 | 45.00 |

Order 1005 is worth 645.00. That path — orders to items to products, with customers hanging off the side — is the shape of most analytical queries you will write.

### ON versus WHERE (for inner joins)

For an inner join these two are equivalent, and the optimiser treats them identically:

\`\`\`sql
JOIN customers c ON c.customer_id = o.customer_id WHERE c.country = 'PK'
JOIN customers c ON c.customer_id = o.customer_id AND c.country = 'PK'
\`\`\`

Keep the *relationship* in \`ON\` and the *filter* in \`WHERE\` anyway — it reads better, and for outer joins the distinction stops being cosmetic and starts changing the answer, as the next lesson shows.

### USING, when the column names match

\`\`\`sql
FROM orders o JOIN customers c USING (customer_id)
\`\`\`

\`USING\` requires identical column names on both sides and collapses them into one output column, so \`SELECT *\` shows \`customer_id\` once instead of twice. It is concise and safe when your schema names keys consistently.

### The silent row loss

An inner join keeps only rows that matched on **both** sides. Run the first query above and there are six rows — but our store has five customers, and Erik Sund has never ordered. He is simply gone from the result.

That is correct behaviour and a trap. "Revenue per customer" built on an inner join reports on customers who bought something; "customers with zero revenue" is exactly the group a retention analysis is about, and they have been filtered out before you started. Whenever a question contains the words *all*, *every*, *including*, or *zero*, an inner join is the wrong tool.

### Joining on the wrong thing

\`\`\`sql
-- Silently returns nothing, or nonsense, if the ids are different types
JOIN customers c ON c.customer_id = o.order_id
\`\`\`

Nothing warns you: the query runs and returns zero rows, or worse, a plausible number of coincidentally matching rows. Two habits prevent it. First, join on declared foreign keys — the \`REFERENCES\` clauses from Chapter 1 tell you which columns are meant to meet. Second, whenever a join result surprises you, compare row counts before and after. If joining \`orders\` (6 rows) to \`customers\` gives you anything other than 6, the join is not the one-to-one lookup you assumed.
        `),
        lesson('LEFT, RIGHT, FULL, and CROSS JOIN', 14, `
An inner join answers "which rows match?" An **outer join** answers "which rows match, and what is missing?"

### LEFT JOIN keeps everything on the left

\`\`\`sql
SELECT c.name, COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.name
ORDER BY orders DESC;
\`\`\`

| name | orders |
|---|---|
| Ayesha Khan | 2 |
| Bilal Ahmed | 2 |
| Chen Wei | 1 |
| Dana Ortiz | 1 |
| Erik Sund | 0 |

Erik is back. Every customer row is kept; where no order matched, all the \`orders\` columns come back NULL.

### COUNT(*) versus COUNT(o.order_id) — the classic outer-join bug

Swap \`COUNT(o.order_id)\` for \`COUNT(*)\` in that query and Erik reports **1 order**. He has none. The LEFT JOIN produced one row for him — a real row, with NULLs in the order columns — and \`COUNT(*)\` counts rows. \`COUNT(o.order_id)\` counts non-NULL order ids, which is zero.

This is the single most common mistake in outer-join reporting, and it is dangerous precisely because 1 is a believable number. **After a LEFT JOIN, always count a column from the right-hand table, never \`*\`.** The same applies to sums: use \`COALESCE(SUM(...), 0)\` so a customer with no orders shows 0.00 rather than a blank cell.

### The WHERE clause that secretly undoes your LEFT JOIN

\`\`\`sql
-- BROKEN: this is now an inner join
SELECT c.name, COUNT(o.order_id) AS paid_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.status = 'paid'
GROUP BY c.name;
\`\`\`

Erik's row has \`o.status = NULL\`, \`NULL = 'paid'\` is UNKNOWN, and \`WHERE\` discards it — along with Chen and Dana. The outer join did its job and then \`WHERE\` threw the results away.

The filter has to move into the \`ON\` clause, where it restricts *which rows are eligible to match* rather than which survive:

\`\`\`sql
SELECT c.name, COUNT(o.order_id) AS paid_orders
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.status = 'paid'          -- part of the match rule
GROUP BY c.name;
\`\`\`

Now Ayesha 2, Bilal 2, Chen 0, Dana 0, Erik 0 — which is the report someone actually wanted. **In an outer join, a condition on the outer table belongs in ON, not WHERE.** The one legitimate exception is the anti-join pattern below, where \`IS NULL\` in \`WHERE\` is the whole point.

### RIGHT and FULL

\`RIGHT JOIN\` is \`LEFT JOIN\` with the tables swapped. It is legal and rare — most people find \`A LEFT JOIN B\` easier to reason about than \`B RIGHT JOIN A\`, and mixing directions in a four-table query is how you lose an afternoon. \`FULL OUTER JOIN\` keeps unmatched rows from both sides, filling the other side with NULLs; it is the right tool for reconciliation — finding records present in one system and absent from the other.

| Join | Keeps |
|---|---|
| \`INNER\` | Only matched pairs |
| \`LEFT\` | All left rows + matches |
| \`RIGHT\` | All right rows + matches |
| \`FULL OUTER\` | Everything from both sides |
| \`CROSS\` | Every left row paired with every right row |

### CROSS JOIN on purpose

A cross join has no \`ON\` clause and multiplies row counts: 5 customers cross 5 products is 25 rows. Accidentally, that is a runaway query. Deliberately, it is how you build the scaffold that fixes the missing-May problem from lesson 2.2:

\`\`\`sql
WITH months AS (
  SELECT generate_series(DATE '2024-03-01', DATE '2024-07-01', INTERVAL '1 month') AS month
)
SELECT
  m.month,
  COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
FROM months m
LEFT JOIN orders o
       ON DATE_TRUNC('month', o.order_date) = m.month
      AND o.status = 'paid'
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY m.month
ORDER BY m.month;
\`\`\`

May now appears with 0.00 instead of vanishing. Generate the periods first, then LEFT JOIN the data onto them — that is the general recipe for any time series that must not skip empty buckets.
        `),
        lesson('Fan-out, Anti-joins, and Self-joins', 14, `
Joins do not just add columns; they can add **rows**. Understanding when and why is the difference between a report you can defend and one that overstates revenue by 40%.

### Grain: the question every join must answer

The **grain** of a result is what one row represents. \`orders\` has one row per order. \`order_items\` has one row per order line. Join them and the grain becomes *order line* — the order columns are now repeated once per line.

\`\`\`sql
SELECT c.name,
       COUNT(*)                          AS rows_returned,
       COUNT(DISTINCT o.order_id)        AS real_orders,
       SUM(oi.quantity * oi.unit_price)  AS revenue
FROM customers c
JOIN orders      o  ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
WHERE o.status = 'paid'
GROUP BY c.name;
\`\`\`

| name | rows_returned | real_orders | revenue |
|---|---|---|---|
| Ayesha Khan | 3 | 2 | 510.00 |
| Bilal Ahmed | 3 | 2 | 765.00 |

Ayesha placed 2 paid orders, but order 1001 has two lines, so the join produced 3 rows. \`COUNT(*)\` reports 3 and is not lying — it counts rows, and the grain changed under it. Revenue is fine here because \`quantity * unit_price\` is measured *at line grain*, so summing lines is correct.

### When DISTINCT stops being enough

\`COUNT(DISTINCT o.order_id)\` patches the count. It cannot patch a sum. Imagine \`orders\` also carried a \`shipping_fee\` of 10.00 per order:

\`\`\`sql
SUM(o.shipping_fee)   -- 30.00 for Ayesha across 3 joined rows, not 20.00
\`\`\`

The fee is repeated once per line, so the total inflates by the number of lines. \`SUM(DISTINCT o.shipping_fee)\` is not a fix either — two different orders with the same 10.00 fee would collapse into one. There is no aggregate trick that recovers the truth; you have to stop mixing grains.

### The fix: aggregate first, then join

\`\`\`sql
WITH order_totals AS (      -- one row per order: back to order grain
  SELECT order_id, SUM(quantity * unit_price) AS order_value
  FROM order_items
  GROUP BY order_id
)
SELECT
  c.name,
  COUNT(*)              AS paid_orders,     -- safe: one row per order again
  SUM(t.order_value)    AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_totals t ON t.order_id    = o.order_id
WHERE o.status = 'paid'
GROUP BY c.name;
\`\`\`

Collapse the many-side to the grain you need *before* joining it. This pattern — a CTE per one-to-many relationship, all joined at a common grain — is how serious reporting queries are built, and Chapter 4 gives it a proper name.

### Anti-joins: finding what is missing

Which products have never been ordered?

\`\`\`sql
SELECT p.product_id, p.name
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.product_id
WHERE oi.product_id IS NULL;      -- kept only the rows that failed to match
\`\`\`

Returns the Webcam 4K (product 14). The LEFT JOIN gives every product a row; \`IS NULL\` on a right-hand column keeps exactly the unmatched ones. This is the **anti-join**, and it is the one time a \`WHERE\` condition on the outer table is correct rather than a bug — because you are testing for the absence the join created.

\`NOT EXISTS\` expresses the same thing more directly and is immune to the \`NOT IN\` / NULL trap from lesson 1.3:

\`\`\`sql
SELECT p.product_id, p.name
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id
);
\`\`\`

Both plan almost identically in PostgreSQL. Prefer \`NOT EXISTS\` for intent; use the LEFT JOIN form when you also need columns from the right-hand table.

### Self-joins: one table, two roles

A table can join to itself as long as each copy gets its own alias.

\`\`\`sql
SELECT a.name AS customer_a, b.name AS customer_b, a.country
FROM customers a
JOIN customers b
  ON a.country = b.country
 AND a.customer_id < b.customer_id;   -- < not <>, or you get each pair twice
\`\`\`

Returns one row: Ayesha Khan and Bilal Ahmed, both in PK. The \`<\` comparison does two jobs — it stops a customer pairing with herself, and it keeps only one of each mirrored pair. Using \`<>\` returns both (A,B) and (B,A), which double-counts every pair. Self-joins are also how you model hierarchies: an \`employees\` table with a \`manager_id\` pointing at its own \`employee_id\`.
        `),
      ],
      [
        q('A LEFT JOIN from customers to orders is grouped with COUNT(*). A customer with no orders shows 1. Why?', [
          'COUNT(*) counts the row the outer join created, NULLs and all',
          'The GROUP BY needs the customer id as well as the name',
          'LEFT JOIN always adds a placeholder order',
          'COUNT(*) rounds zero up to one',
        ], 0, 'The outer join emits a real row with NULL order columns, so COUNT(*) counts it; COUNT(o.order_id) returns 0 instead.'),
        q("Adding WHERE o.status = 'paid' to a LEFT JOIN drops customers with no orders. The fix is to", [
          'replace LEFT JOIN with FULL OUTER JOIN',
          'add OR o.status IS NULL to the GROUP BY',
          "move the condition into the ON clause alongside the join key",
          'wrap status in COALESCE inside the SELECT list',
        ], 2, 'A WHERE test on the outer table discards the NULL-filled rows, turning the outer join back into an inner join; in ON it only limits which rows may match.'),
        q('Joining orders to order_items makes a per-order shipping fee sum too high. What happened?', [
          'The shipping fee column allows NULLs',
          'Fan-out: the order row repeats once per line item, so its fee is added multiple times',
          'SUM cannot be used with a JOIN',
          'The join key has the wrong data type',
        ], 1, 'The join changed the grain from one row per order to one row per line, so any order-level amount is duplicated and must be aggregated before joining.'),
        q('Which reliably lists products that have never been ordered?', [
          'INNER JOIN order_items and check quantity = 0',
          'SELECT ... WHERE product_id NOT IN (SELECT product_id FROM order_items)',
          'RIGHT JOIN order_items ON matching ids',
          'LEFT JOIN order_items and keep rows where oi.product_id IS NULL',
        ], 3, 'The anti-join keeps exactly the unmatched rows; the NOT IN version silently returns nothing if any subquery value is NULL.'),
      ]
    ),
    chapter(
      'Subqueries, CTEs, and Window Functions',
      'Composing queries out of named steps, and computing across rows without collapsing them.',
      [
        lesson('Subqueries: Scalar, IN, and EXISTS', 13, `
A **subquery** is a query used as a value, a list, or a table inside another query. Which of those three it is determines where it can go and what it must return.

### Scalar subquery: one row, one column

\`\`\`sql
SELECT order_id, order_value
FROM (
  SELECT o.order_id, SUM(oi.quantity * oi.unit_price) AS order_value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
  GROUP BY o.order_id
) t
WHERE order_value > (
  SELECT SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id)
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
);
\`\`\`

The average paid order is 1275 / 4 = **318.75**, so only order 1005 (645.00) comes back. A scalar subquery is evaluated once and behaves like a literal — which is precisely why you cannot write \`WHERE order_value > AVG(order_value)\`: an aggregate in \`WHERE\` is illegal (lesson 2.3), but a *subquery* that computes the average is fine.

If a scalar subquery ever returns two rows, the query fails at runtime with \`more than one row returned by a subquery used as an expression\`. That usually means a missing \`GROUP BY\` match or a join key you assumed was unique and is not.

### Derived table: a subquery in FROM

The inner query above sits in the \`FROM\` clause, which makes it a **derived table**. Give it an alias — \`t\` here: PostgreSQL 15 and earlier reject an unaliased subquery in \`FROM\` with \`subquery in FROM must have an alias\`, and although PostgreSQL 16 dropped that requirement, you still want the alias to qualify its columns. Derived tables are how you fix the grain problem from lesson 3.3: aggregate to one row per order, then treat that as a table.

### IN and EXISTS

\`\`\`sql
-- IN: does this value appear in a list the subquery produced?
SELECT name FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'paid');
\`\`\`

Returns Ayesha and Bilal. \`EXISTS\` asks a yes/no question instead and can reference the outer row — that makes it **correlated**:

\`\`\`sql
SELECT c.name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o                    -- SELECT 1: the columns are ignored
  WHERE o.customer_id = c.customer_id       -- the correlation
    AND o.order_date >= DATE '2024-06-01'
);
\`\`\`

Returns Bilal (order 1005) and Dana (order 1006). \`EXISTS\` stops at the first match, so it never builds the full list.

Three practical rules:

- \`EXISTS\` and \`IN\` perform about the same in modern PostgreSQL — both become semi-joins. Pick by readability.
- **\`NOT IN\` is not safe.** If the subquery yields even one NULL, the result is empty (lesson 1.3). Use \`NOT EXISTS\`.
- Neither duplicates rows. A join to the same subquery *can*, if the subquery has duplicate keys — which is a common cause of a report growing from 6 rows to 9.

### Correlated subqueries in the SELECT list

\`\`\`sql
SELECT
  c.name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS orders,
  (SELECT MAX(o.order_date) FROM orders o WHERE o.customer_id = c.customer_id) AS last_order
FROM customers c;
\`\`\`

This is readable and gives Erik a clean \`0\` and \`NULL\` without any outer-join reasoning. The cost is that each subquery conceptually runs once per outer row — five customers means ten small queries here, and fifty thousand customers means a hundred thousand. Modern optimisers often rewrite these into joins, but not always, and not when the subquery is complicated.

The rule of thumb: **one or two correlated subqueries on a small result set are fine and clear; more than that, or on a large table, means you should be aggregating once and joining.** When a dashboard query is slow and the plan shows a nested loop running millions of times, this is nearly always the cause.

### Where subqueries stop scaling

\`\`\`sql
-- Three near-identical scans of the same tables
SELECT
  (SELECT SUM(...) FROM order_items ... WHERE status='paid') AS paid,
  (SELECT SUM(...) FROM order_items ... WHERE status='pending') AS pending,
  (SELECT SUM(...) FROM order_items ... WHERE status='refunded') AS refunded;
\`\`\`

Every branch re-reads the same rows. Conditional aggregation (lesson 2.1) gets all three in one pass, and a CTE — the next lesson — lets you scan once and name the result.
        `),
        lesson('CTEs: Naming the Steps of a Query', 13, `
A **common table expression** is a subquery you give a name to, defined before the query that uses it. It changes nothing about what SQL can express and everything about whether a human can follow it.

\`\`\`sql
WITH paid_order_totals AS (
  SELECT o.order_id, o.customer_id, o.order_date,
         SUM(oi.quantity * oi.unit_price) AS order_value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
  GROUP BY o.order_id, o.customer_id, o.order_date
)
SELECT c.name, COUNT(*) AS orders, SUM(t.order_value) AS revenue
FROM paid_order_totals t
JOIN customers c ON c.customer_id = t.customer_id
GROUP BY c.name
ORDER BY revenue DESC;
\`\`\`

| name | orders | revenue |
|---|---|---|
| Bilal Ahmed | 2 | 765.00 |
| Ayesha Khan | 2 | 510.00 |

That is the grain fix from lesson 3.3, now readable: *first collapse to one row per paid order, then summarise by customer.* Compare it with the same logic as a nested subquery in \`FROM\` — identical plan, and you read it inside-out instead of top-down.

### CTEs chain

Each CTE can reference the ones defined before it, so a query becomes a short pipeline of named steps:

\`\`\`sql
WITH paid_orders AS (
  SELECT order_id, customer_id, order_date
  FROM orders WHERE status = 'paid'
),
order_totals AS (
  SELECT po.order_id, po.customer_id, po.order_date,
         SUM(oi.quantity * oi.unit_price) AS order_value
  FROM paid_orders po
  JOIN order_items oi ON oi.order_id = po.order_id
  GROUP BY po.order_id, po.customer_id, po.order_date
),
customer_summary AS (
  SELECT customer_id,
         COUNT(*)             AS orders,
         SUM(order_value)     AS revenue,
         MAX(order_date)      AS last_order
  FROM order_totals
  GROUP BY customer_id
)
SELECT c.name, c.country, s.orders, s.revenue, s.last_order
FROM customers c
LEFT JOIN customer_summary s ON s.customer_id = c.customer_id
ORDER BY s.revenue DESC NULLS LAST;
\`\`\`

Every step has a name that says what it holds, and each is independently testable: comment out the final \`SELECT\`, replace it with \`SELECT * FROM order_totals\`, and you can inspect the middle of your own pipeline. That debugging move alone justifies the syntax.

Note the \`LEFT JOIN\` at the end — Erik, Chen and Dana have no rows in \`customer_summary\`, and this keeps them in the report with NULLs. Wrap with \`COALESCE(s.revenue, 0)\` if the output feeds a chart.

### A CTE referenced twice

\`\`\`sql
WITH monthly AS ( ... expensive aggregation ... )
SELECT a.month, a.revenue, b.revenue AS prev_revenue
FROM monthly a
LEFT JOIN monthly b ON b.month = a.month - INTERVAL '1 month';
\`\`\`

Since version 12, PostgreSQL inlines a CTE like a subquery when the outer query references it **exactly once**. Referenced twice, as \`monthly\` is here, it is still materialised — computed once and scanned twice, which \`EXPLAIN\` shows as a single \`CTE\` node feeding two \`CTE Scan\`s. Override either decision explicitly:

\`\`\`sql
WITH monthly AS MATERIALIZED     ( ... )   -- compute once, even when used once
WITH monthly AS NOT MATERIALIZED ( ... )   -- inline, even when used twice
\`\`\`

The other side of the same coin: a CTE used once is *not* a performance improvement over a subquery, and older advice that "CTEs are an optimisation fence" no longer holds. Write CTEs for clarity, and reach for either hint only after \`EXPLAIN\` shows a plan you did not want.

### Recursive CTEs

\`WITH RECURSIVE\` walks a structure of unknown depth — a category tree, an org chart, or simply a generated series:

\`\`\`sql
WITH RECURSIVE months(month) AS (
  SELECT DATE '2024-03-01'                        -- anchor: where to start
  UNION ALL
  SELECT (month + INTERVAL '1 month')::date       -- step, cast back to DATE
  FROM months
  WHERE month < DATE '2024-07-01'                 -- stop condition: never omit
)
SELECT * FROM months;
\`\`\`

Five rows, March to July — the date spine from lesson 3.2, portable to engines without \`generate_series\`. The cast is not optional: \`date + interval\` yields a \`timestamp\`, and PostgreSQL rejects a recursive CTE whose recursive term has a different type from its anchor. The \`WHERE\` in the recursive branch is the termination condition; leave it out and the query runs until the server gives up.
        `),
        lesson('Window Functions: Ranking and Running Totals', 15, `
An aggregate collapses rows. A **window function** computes across a set of rows and returns the answer on *every* row, leaving the row count untouched. That one difference solves a class of problems GROUP BY handles badly.

\`\`\`sql
WITH order_totals AS (              -- one row per paid order; reused below
  SELECT o.order_id, o.order_date, SUM(oi.quantity * oi.unit_price) AS value
  FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
  GROUP BY o.order_id, o.order_date
)
SELECT order_id, value,
       SUM(value) OVER () AS total_revenue    -- no GROUP BY, no rows lost
FROM order_totals;
\`\`\`

| order_id | value | total_revenue |
|---|---|---|
| 1001 | 210.00 | 1275.00 |
| 1002 | 300.00 | 1275.00 |
| 1003 | 120.00 | 1275.00 |
| 1005 | 645.00 | 1275.00 |

\`OVER ()\` means "the window is every row of the result", so each row keeps its own value *and* sees the whole. GROUP BY alone needs a second query and a join to do this.

### PARTITION BY splits the window

\`\`\`sql
ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS nth_order
\`\`\`

\`PARTITION BY\` restarts the calculation per group; \`ORDER BY\` inside \`OVER\` sets the sequence. Ayesha's orders get 1 and 2, Bilal's get 1 and 2 — a per-customer sequence number in one line.

### Three ranking functions that differ only on ties

Ranking our products by paid revenue, where two of them tie:

| product | revenue | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|---|
| 27-inch Monitor | 900 | 1 | 1 | 1 |
| USB-C Hub | 135 | 2 | 2 | 2 |
| Mechanical Keyboard | 120 | 3 | 3 | 3 |
| Laptop Stand | 120 | 4 | 3 | 3 |

\`ROW_NUMBER\` is always 1,2,3,4 and **breaks ties arbitrarily** — run it twice and the Keyboard and the Stand may swap, so any leaderboard needs a deterministic tiebreaker: \`ORDER BY revenue DESC, product_id\`. \`RANK\` gives ties the same number then skips (1,2,3,3, next is 5); \`DENSE_RANK\` does not skip. "Top 3" means \`RANK <= 3\` if ties should all qualify, \`ROW_NUMBER <= 3\` if you need exactly three rows.

### You cannot filter a window function in WHERE

\`\`\`sql
-- ERROR: column "rn" does not exist   (and inlining the ROW_NUMBER() call
-- into WHERE instead gives: window functions are not allowed in WHERE)
SELECT ... ROW_NUMBER() OVER (...) AS rn FROM ... WHERE rn = 1;
\`\`\`

Windows are computed at the \`SELECT\` step, after \`WHERE\` and \`HAVING\` (lesson 2.3), so wrap the query and filter outside — the **top-N-per-group** pattern:

\`\`\`sql
WITH ranked AS (
  SELECT o.customer_id, o.order_id, o.order_date,
         ROW_NUMBER() OVER (PARTITION BY o.customer_id
                            ORDER BY o.order_date DESC, o.order_id DESC) AS rn
  FROM orders o
  WHERE o.status = 'paid'
)
SELECT customer_id, order_id, order_date FROM ranked WHERE rn = 1;
\`\`\`

Each customer's most recent paid order: Ayesha 1002, Bilal 1005. Memorise this shape; "latest row per group" is a constant request in analytics.

### Running totals and the frame that catches people out

\`\`\`sql
SELECT order_date, value,                      -- order_totals as defined above
       SUM(value) OVER (ORDER BY order_date
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM order_totals ORDER BY order_date;
\`\`\`

| order_date | value | running_total |
|---|---|---|
| 2024-03-02 | 210.00 | 210.00 |
| 2024-03-09 | 120.00 | 330.00 |
| 2024-04-18 | 300.00 | 630.00 |
| 2024-06-30 | 645.00 | 1275.00 |

The \`ROWS\` clause matters. Omit it and the default frame is \`RANGE UNBOUNDED PRECEDING\`, which includes **every row sharing the current row's ORDER BY value**. Two orders on the same date would both show the same combined total instead of stepping up one at a time — a wrongness that only appears once the data has duplicates, which is to say in production. Write \`ROWS\` whenever you mean "up to and including this row".

### LAG and LEAD for period-over-period

\`\`\`sql
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_revenue ORDER BY month;
\`\`\`

March 330 to April 300 gives -30. \`LAG\` returns NULL on the first row — correct, not missing data. Always run it over a gap-free date spine (lesson 3.2), or "previous month" silently means "previous month that had sales".
        `),
      ],
      [
        q('Why is NOT EXISTS preferred over NOT IN for an anti-join?', [
          'NOT IN cannot be used with a subquery',
          'NOT EXISTS is the only form that supports correlation',
          'A single NULL in the NOT IN list makes the whole condition never true, returning zero rows',
          'NOT IN requires the subquery to be sorted',
        ], 2, 'x NOT IN (..., NULL) evaluates to UNKNOWN, so the query silently returns nothing instead of the missing rows.'),
        q('Four products have revenues 900, 135, 120, 120. What does RANK() assign to the last product?', [
          '3, tied with the other 120, and the next rank would be 5',
          '4, because RANK always numbers rows consecutively',
          '3, and the next rank would be 4',
          'NULL, because RANK cannot resolve ties',
        ], 0, 'RANK gives tied rows the same number then skips ahead by the number of ties; DENSE_RANK is the version that does not skip.'),
        q('WHERE rn = 1 fails after computing rn with ROW_NUMBER(). Why?', [
          'ROW_NUMBER needs a PARTITION BY clause to be filterable',
          'Window functions are evaluated at the SELECT step, after WHERE has already run',
          'rn is an integer and must be cast',
          'Window functions can only appear in ORDER BY',
        ], 1, 'The window is computed after WHERE, so you must wrap the query in a CTE or subquery and filter the outer level.'),
        q('A running total is written as SUM(value) OVER (ORDER BY order_date) with no frame clause. What is the risk?', [
          'It sums the whole table regardless of order',
          'It resets at every new date',
          'It returns NULL for the first row',
          'The default RANGE frame lumps together all rows sharing a date, so same-day rows show one combined total',
        ], 3, 'The default frame is RANGE UNBOUNDED PRECEDING, which includes peer rows; ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW steps one row at a time.'),
      ]
    ),
    chapter(
      'Clean Data, Fast Queries, Good Schemas',
      'Fixing messy data in SQL, making queries fast on purpose, and designing tables that stay correct.',
      [
        lesson('Cleaning Messy Data in SQL', 14, `
Real data arrives with trailing spaces, four spellings of the same city, prices stored as text, and duplicate customers. Clean it in SQL and the cleaning is reproducible, reviewable, and re-runnable — three things a manual pass over a spreadsheet never is.

### Profile before you touch anything

\`\`\`sql
SELECT
  COUNT(*)                                        AS rows,
  COUNT(DISTINCT email)                           AS distinct_emails,
  COUNT(*) - COUNT(city)                          AS missing_city,
  MIN(signup_date)                                AS earliest,
  MAX(signup_date)                                AS latest
FROM customers;
\`\`\`

If \`rows\` is 5 and \`distinct_emails\` is 4, you have a duplicate. If \`latest\` is in 2087, you have a data-entry bug. Two minutes of profiling saves you from building a report on top of a problem.

For text columns, let the data tell you its own vocabulary:

\`\`\`sql
SELECT city, COUNT(*) FROM customers GROUP BY city ORDER BY COUNT(*) DESC;
-- 'Lahore' 12, 'lahore' 3, ' Lahore' 1, 'LHR' 2, NULL 1
\`\`\`

Four spellings of one city means every "revenue by city" report has been quietly wrong.

### Standardise text

\`\`\`sql
SELECT
  TRIM(LOWER(email))                        AS email_clean,   -- spaces + case
  INITCAP(TRIM(city))                       AS city_clean,
  REGEXP_REPLACE(phone, '[^0-9]', '', 'g')  AS phone_digits   -- strip formatting
FROM customers;
\`\`\`

\`TRIM\` removes leading and trailing whitespace — the invisible cause of "but I typed it exactly right". Do the normalising once, in a defined layer, not ad hoc in every query.

### Map categories deliberately

\`\`\`sql
SELECT
  CASE
    WHEN LOWER(TRIM(city)) IN ('lahore', 'lhr') THEN 'Lahore'
    WHEN LOWER(TRIM(city)) IN ('karachi', 'khi') THEN 'Karachi'
    WHEN city IS NULL OR TRIM(city) = ''         THEN 'Unknown'
    ELSE INITCAP(TRIM(city))
  END AS city_clean
FROM customers;
\`\`\`

A \`CASE\` ladder is fine for five values. For fifty, put the mapping in a real table and join to it — then updating it does not mean editing a query, and the mapping itself becomes reviewable data. Always include an explicit bucket for missing values; \`'Unknown'\` in a report is honest, a silently dropped row is not.

### Fix types safely

\`\`\`sql
-- price_text holds values like '45.00', '', 'N/A'
SELECT CAST(NULLIF(TRIM(price_text), '') AS NUMERIC)   -- '' becomes NULL, not an error
FROM staging_products;
\`\`\`

An empty string cast to numeric throws and kills the whole query. \`NULLIF\` converts it to NULL first. Values like \`'N/A'\` still fail, so find them before you cast:

\`\`\`sql
SELECT DISTINCT price_text FROM staging_products
WHERE price_text !~ '^[0-9]+(\\.[0-9]+)?$';   -- anything that is not a plain number
\`\`\`

### Deduplicate with ROW_NUMBER

Exact duplicates go away with \`SELECT DISTINCT\`. Logical duplicates — the same person entered twice with different ids and slightly different names — need a rule about which copy wins:

\`\`\`sql
WITH ranked AS (
  SELECT
    c.*,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(c.email))          -- what "the same" means
      ORDER BY c.signup_date ASC, c.customer_id  -- which copy to keep
    ) AS rn
  FROM customers c
)
SELECT * FROM ranked WHERE rn = 1;
\`\`\`

The \`PARTITION BY\` is your definition of identity and the \`ORDER BY\` is your tie-break policy. Both are business decisions — keeping the *earliest* signup preserves account age, keeping the *latest* preserves the freshest contact details. Write down which you chose and why, because someone will ask.

Before deleting anything, look at what you are about to lose: change \`WHERE rn = 1\` to \`WHERE rn > 1\` and read the rows.

### Never clean in place

\`\`\`sql
-- Destructive, unreviewable, and unrepeatable
UPDATE customers SET city = 'Lahore' WHERE city ILIKE '%lhr%';

-- Reproducible: the raw table stays untouched
CREATE VIEW customers_clean AS SELECT ... FROM customers;
\`\`\`

An \`UPDATE\` erases the original value. If the rule turns out to be wrong — and the first version of a cleaning rule usually is — there is nothing to go back to. Keep raw data raw, express cleaning as a **view** or a CTE layer, and let the report read the clean layer.

### Verify afterwards

Compare \`COUNT(*)\` before and after. A dedup step that removes 3 rows from 5,000 is plausible; one that removes 2,000 means your identity rule is too loose. Then spot-check three rows by hand. Cleaning that nobody checked is just a different kind of wrong data.
        `),
        lesson('Indexes and Reading a Query Plan', 14, `
Without an index, finding \`WHERE email = 'x'\` means reading every row in the table — a **sequential scan**. An index is a sorted structure the database can search instead, turning a million-row scan into a handful of page reads.

\`\`\`sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_date     ON orders (order_date);
\`\`\`

### What to index

Index the columns you **filter on**, **join on**, and **sort by** — that is, the columns in \`WHERE\`, \`ON\`, and \`ORDER BY\`. Primary keys are indexed automatically; foreign keys usually are **not**, which is why an unindexed \`orders.customer_id\` is one of the most common causes of a slow join.

Do not index everything. Every index must be updated on every \`INSERT\`, \`UPDATE\` and \`DELETE\`, and it consumes disk and cache. A write-heavy table with eleven indexes is slow for a reason.

### Composite indexes read left to right

\`\`\`sql
CREATE INDEX idx_orders_cust_date ON orders (customer_id, order_date);
\`\`\`

This index serves:

- \`WHERE customer_id = 2\`
- \`WHERE customer_id = 2 AND order_date >= '2024-06-01'\`
- \`WHERE customer_id = 2 ORDER BY order_date\`

It does **not** efficiently serve \`WHERE order_date >= '2024-06-01'\` alone. A composite index is sorted by the first column, then the second — like a phone book sorted by surname then first name, which is useless for finding everyone called "Ayesha". Put the equality column first and the range column second.

### Four ways to make an index unusable

\`\`\`sql
WHERE LOWER(email) = 'a@shop.com'      -- function on the column: index skipped
WHERE name LIKE '%hub%'                -- leading wildcard: nothing to seek to
WHERE customer_id::text = '2'          -- type mismatch forces a cast per row
WHERE order_date + INTERVAL '1 day' > NOW()   -- arithmetic on the column
\`\`\`

The rule behind all four: **keep the indexed column bare on one side of the comparison.** Rewrite the last one as \`order_date > NOW() - INTERVAL '1 day'\`. For the first, either store emails already lowercased, or build an expression index that matches the query exactly:

\`\`\`sql
CREATE INDEX idx_customers_email_lower ON customers (LOWER(email));
\`\`\`

### Reading a plan

\`EXPLAIN\` shows the plan the optimiser chose. \`EXPLAIN ANALYZE\` actually runs the query and reports what happened:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 2 AND order_date >= DATE '2024-06-01';
\`\`\`

\`\`\`text
Seq Scan on orders  (cost=0.00..4521.00 rows=1 width=32)
                    (actual time=0.31..48.7 rows=1 loops=1)
  Filter: ((customer_id = 2) AND (order_date >= '2024-06-01'))
  Rows Removed by Filter: 249999
Planning Time: 0.12 ms
Execution Time: 48.8 ms
\`\`\`

Read plans **inside-out**: the most indented node runs first and feeds its parent. Four numbers matter.

| Field | What it tells you |
|---|---|
| \`Seq Scan\` vs \`Index Scan\` | Whether an index was used at all |
| \`Rows Removed by Filter\` | Work thrown away — 249,999 here is the smoking gun |
| \`rows=\` estimated vs \`actual rows=\` | Whether the optimiser understands your data |
| \`loops=\` | How many times this node ran; a big number means a nested loop |

After \`CREATE INDEX idx_orders_cust_date ON orders (customer_id, order_date);\`:

\`\`\`text
Index Scan using idx_orders_cust_date on orders
  (cost=0.29..8.31 rows=1 width=32) (actual time=0.02..0.03 rows=1 loops=1)
  Index Cond: ((customer_id = 2) AND (order_date >= '2024-06-01'))
Execution Time: 0.06 ms
\`\`\`

48.8 ms to 0.06 ms, and \`Rows Removed by Filter\` has gone. Note the condition moved from \`Filter\` to \`Index Cond\` — that is the line that tells you the index is doing the selecting rather than the database reading everything and discarding it afterwards.

### When estimates are badly wrong

If the plan says \`rows=12\` and actual is \`rows=480000\`, the optimiser is choosing strategies based on a fantasy — typically a nested loop that should have been a hash join. Run \`ANALYZE orders;\` to refresh the statistics. Stale statistics after a big data load are a standard cause of a query that was fast yesterday and is slow today.

### A sequential scan is not always bad

Reading 80% of a small table sequentially is *faster* than bouncing through an index, and the optimiser knows it. Chase a \`Seq Scan\` only when the table is large, the filter is selective, and \`Rows Removed by Filter\` is huge.
        `),
        lesson('Normalisation, Denormalisation, and the Analyst\'s Workflow', 15, `
Chapter 1 asserted that each row should state one fact. **Normalisation** is the formal version of that rule, and it prevents one disease: the same fact stored twice, where the copies can disagree.

### The disease

| order_id | customer_name | customer_city | products |
|---|---|---|---|
| 1001 | Ayesha Khan | Lahore | Keyboard, USB-C Hub |
| 1002 | Ayesha Khan | Lahore | 27-inch Monitor |

Three anomalies live there. **Update:** Ayesha moves and you must edit every row or the database contradicts itself. **Insert:** you cannot record a customer until she orders. **Delete:** cancel her last order and you erase the only record she exists.

### Three normal forms, in plain terms

**1NF — one value per cell.** \`products\` holding \`'Keyboard, USB-C Hub'\` breaks it: you cannot filter, join, or count it without string surgery. The fix is the \`order_items\` junction table.

**2NF — no column depends on only part of a composite key.** In \`order_items\`, the key is \`(order_id, product_id)\`. Storing \`product_category\` there would break 2NF: category depends on \`product_id\` alone, so it belongs in \`products\`.

**3NF — no column depends on another non-key column.** Storing \`customer_city\` in \`orders\` breaks it: city depends on \`customer_id\`, which is not the key of \`orders\`. It belongs in \`customers\`.

The classic summary: **every non-key column depends on the key, the whole key, and nothing but the key.** Our four-table schema satisfies all three, so no fact in it is written twice.

### When to denormalise — deliberately

Normalisation optimises for correctness on write; reporting optimises for speed on read. Sometimes they conflict.

- **Point-in-time values are not duplication.** \`order_items.unit_price\` copies the catalogue price on purpose (Chapter 1): the two mean different things, so keeping both is *more* correct.
- **Pre-aggregated tables and materialised views.** A nightly \`daily_revenue\` table turns a four-minute dashboard query into a millisecond lookup. The cost is staleness and a refresh job that can fail silently, so carry a \`refreshed_at\` column and show it on the dashboard.

Denormalise only after measuring a real read problem, and write down how the copy stays in sync. Copying a column because a join felt like effort is how databases start disagreeing with themselves.

### From business question to query

Someone asks: *"Which cities are our best customers in, and how many of them buy more than once?"* That sentence is not yet a query. Five steps make it one.

**1. Pin down the metric.** "Best" means paid revenue, excluding refunded and pending orders. "More than once" means two or more *paid* orders. "Cities" includes cities with zero revenue.

**2. Decide the grain.** One row per city; everything else aggregates up to that.

**3. List the path.** \`customers\` to \`orders\` to \`order_items\`, on the foreign keys from Chapter 1.

**4. Build it in layers** (Chapter 4), collapsing each one-to-many relationship before joining, so nothing fans out (lesson 3.3):

\`\`\`sql
WITH paid_orders AS (
  SELECT o.order_id, o.customer_id,
         SUM(oi.quantity * oi.unit_price) AS order_value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
  GROUP BY o.order_id, o.customer_id
),
per_customer AS (
  SELECT customer_id, COUNT(*) AS paid_orders, SUM(order_value) AS revenue
  FROM paid_orders
  GROUP BY customer_id
)
SELECT
  c.city,
  COUNT(*)                                              AS customers,
  COUNT(*) FILTER (WHERE pc.paid_orders >= 2)           AS repeat_buyers,
  COALESCE(SUM(pc.revenue), 0)                          AS revenue
FROM customers c
LEFT JOIN per_customer pc ON pc.customer_id = c.customer_id
GROUP BY c.city
ORDER BY revenue DESC;
\`\`\`

| city | customers | repeat_buyers | revenue |
|---|---|---|---|
| Karachi | 1 | 1 | 765.00 |
| Lahore | 1 | 1 | 510.00 |
| Madrid | 1 | 0 | 0.00 |
| Singapore | 1 | 0 | 0.00 |
| _(NULL)_ | 1 | 0 | 0.00 |

The \`LEFT JOIN\` keeps Madrid and Singapore: "which cities" included the ones earning nothing — often the report's most interesting rows. Erik has no city on record, so he groups under NULL; wrap the key in \`COALESCE(c.city, 'Unknown')\` when that bucket needs a label (lesson 5.1).

**5. Sanity-check.** Do the city revenues add to the store total of 1275? Yes. Does \`COUNT(*)\` count customers rather than orders? Yes — \`per_customer\` already collapsed the join to one row each. Then verify one customer's total by hand.

That step separates an analyst from someone who runs queries: a number nobody reconciled is a guess with a decimal point.
        `),
      ],
      [
        q('Why does WHERE LOWER(email) = \'a@shop.com\' ignore an ordinary index on email?', [
          'The index stores the original values, so a function applied to the column cannot be matched against it',
          'LOWER always forces a sequential scan by design',
          'Text columns cannot be indexed without a length limit',
          'The comparison value must be lowercased instead',
        ], 0, 'A B-tree index is sorted on the stored values; wrapping the column in a function means the engine must compute it per row unless you build a matching expression index.'),
        q('Which pattern keeps exactly one row per email, choosing the earliest signup?', [
          'SELECT DISTINCT email FROM customers',
          'GROUP BY email with MIN(signup_date)',
          'DELETE FROM customers WHERE signup_date > MIN(signup_date)',
          'ROW_NUMBER() OVER (PARTITION BY email ORDER BY signup_date) in a CTE, then WHERE rn = 1',
        ], 3, 'ROW_NUMBER keeps whole rows and lets PARTITION BY define identity and ORDER BY define which copy survives; DISTINCT and GROUP BY return columns, not rows.'),
        q('Which design violates first normal form?', [
          'Storing customer_city in the customers table',
          'Storing unit_price in both products and order_items',
          "Storing product_ids as the text '10,11,14' in orders",
          'Using a composite primary key on order_items',
        ], 2, '1NF requires one value per cell; a comma-separated list cannot be joined, filtered, or counted without string parsing.'),
        q('EXPLAIN ANALYZE shows rows=12 estimated but actual rows=480000. What does that indicate?', [
          'The planner is working from stale statistics and may have chosen the wrong join strategy',
          'The query returned the wrong results',
          'An index is corrupted and must be rebuilt',
          'The table needs a composite primary key',
        ], 0, 'A large estimate-versus-actual gap means the optimiser mispriced the plan; running ANALYZE refreshes the statistics it depends on.'),
      ]
    ),
    chapter(
      'Changing Data Safely',
      'Inserts, updates and deletes you can run against a live table, and loads that survive being run twice.',
      [
        lesson('INSERT, UPDATE, DELETE Without Regret', 14, `
Every write is a \`SELECT\` you have already checked, with the first word swapped. Build that habit and the catastrophic version of this lesson never happens to you.

### INSERT: always name the columns

\`\`\`sql
INSERT INTO products (product_id, name, category, unit_price)
VALUES
  (15, 'Desk Mat',     'Accessories', 25.00),
  (16, 'Cable Sleeve', 'Accessories',  8.00);   -- one statement, two rows
\`\`\`

Positional \`INSERT INTO products VALUES (15, 'Desk Mat', ...)\` works right up until somebody adds a column, at which point every insert in the codebase shifts one field sideways — sometimes into a type error, sometimes into a category column quietly full of prices. Name the columns.

\`INSERT ... SELECT\` promotes a staging table into real data, which is where lesson 5.1's cleaning layer finally lands:

\`\`\`sql
INSERT INTO products (product_id, name, category, unit_price)
SELECT s.product_id, INITCAP(TRIM(s.name)), s.category,
       CAST(NULLIF(TRIM(s.price_text), '') AS NUMERIC)
FROM staging_products s
WHERE NOT EXISTS (                            -- NOT IN would insert nothing
  SELECT 1 FROM products p WHERE p.product_id = s.product_id
);
\`\`\`

\`NOT EXISTS\` rather than \`NOT IN\`, for the reason in lesson 1.3: one NULL \`product_id\` anywhere in \`products\` and the \`NOT IN\` version loads zero rows and reports success.

### RETURNING shows you what you did

\`\`\`sql
INSERT INTO customers (customer_id, name, email, city, country, signup_date)
VALUES (6, 'Farah Iqbal', 'farah@shop.com', 'Lahore', 'PK', DATE '2024-08-01')
RETURNING customer_id, signup_date;
\`\`\`

\`RETURNING\` works on \`UPDATE\` and \`DELETE\` too, and it is the cheapest audit trail there is — you see the rows you touched, not just a count of them.

### The SELECT-first rule

\`\`\`sql
-- 1. Look at exactly the rows you intend to change
SELECT order_id, status FROM orders WHERE order_date < DATE '2024-04-01';
-- 2 rows: 1001, 1003

-- 2. Same WHERE, now written as the update
UPDATE orders SET status = 'archived' WHERE order_date < DATE '2024-04-01';
-- UPDATE 2
\`\`\`

The two counts must match. If the \`SELECT\` showed 2 and the \`UPDATE\` reports 47, the \`WHERE\` that ran is not the one you inspected — stop and roll back before doing anything else.

### UPDATE using another table

\`\`\`sql
UPDATE order_items oi
SET unit_price = p.unit_price
FROM products p
WHERE p.product_id = oi.product_id
  AND oi.order_id = 1006;         -- only the order that is still pending
\`\`\`

Two warnings. PostgreSQL's \`UPDATE ... FROM\` picks an **arbitrary** matching row when the \`FROM\` side matches more than once per target row, and it does not warn you — confirm the join key is unique first. And this statement rewrites the historical price Chapter 1 told you to protect; it is defensible only because order 1006 has not been paid yet.

The portable form uses a correlated subquery and carries its own classic bug:

\`\`\`sql
-- WRONG: rows with no matching product get unit_price = NULL
UPDATE order_items oi SET unit_price =
  (SELECT p.unit_price FROM products p WHERE p.product_id = oi.product_id);

-- RIGHT: restrict the update to rows that actually matched
... WHERE EXISTS (SELECT 1 FROM products p WHERE p.product_id = oi.product_id);
\`\`\`

A subquery that finds nothing returns NULL, and \`SET column = NULL\` is a perfectly legal update. That is how a column gets wiped by a statement that looked like a lookup.

### DELETE, and the WHERE that went missing

\`\`\`sql
DELETE FROM order_items;                        -- every row, no confirmation
DELETE FROM order_items WHERE order_id = 1006;  -- what you meant
\`\`\`

Foreign keys are the guard rail. \`order_items.order_id REFERENCES orders\` means deleting an order that still has lines raises \`violates foreign key constraint\` — the constraint is doing its job. \`ON DELETE CASCADE\` is right on \`order_items\` (a line has no meaning without its order) and almost always wrong on \`orders.customer_id\`, where it erases revenue history along with the customer.

### Soft delete keeps the analyst in business

\`\`\`sql
ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP;
UPDATE customers SET deleted_at = NOW() WHERE customer_id = 5;
\`\`\`

The row survives, so last quarter's report still reconciles. The cost is that every query now owes you a \`WHERE deleted_at IS NULL\`, and the one report that forgets it is the one that goes to a client. Put the filter in a view and read the view — which is where Chapter 7 begins.
        `),
        lesson('Transactions and the Lost Update', 14, `
A **transaction** is a group of statements that either all take effect or none of them do.

\`\`\`sql
BEGIN;
  UPDATE orders SET status = 'refunded' WHERE order_id = 1002;
  INSERT INTO refunds (order_id, amount, refunded_at) VALUES (1002, 300.00, NOW());
COMMIT;
\`\`\`

If the insert fails, \`ROLLBACK\` puts the order back to \`paid\` and no half-refund exists anywhere. That all-or-nothing property is **atomicity**, and it is the whole reason transactions are worth typing.

### The dry run that costs nothing

\`\`\`sql
BEGIN;
UPDATE customers SET city = 'Lahore' WHERE city ILIKE '%lhr%';
-- UPDATE 3
SELECT customer_id, city FROM customers WHERE city = 'Lahore';   -- inspect
ROLLBACK;                                                        -- undo it all
\`\`\`

Most clients run in **autocommit**: each statement commits the instant it lands, so by the time you notice the mistake there is nothing left to undo. Typing \`BEGIN;\` first is the cheapest insurance in this course. PostgreSQL adds a bonus — once any statement errors inside a transaction, every later statement is refused until you roll back, so a broken multi-step migration cannot half-apply.

### Isolation: what other sessions can do to you mid-transaction

| Level | What it still allows |
|---|---|
| \`READ COMMITTED\` (Postgres default) | The same query, run twice, returns different rows |
| \`REPEATABLE READ\` | A stable snapshot; conflicting writes may be rejected |
| \`SERIALIZABLE\` | Nothing anomalous; may abort with \`serialization_failure\` |

Under \`READ COMMITTED\` every **statement** takes a fresh snapshot. A report made of six queries can therefore see six different versions of the database, and its subtotals stop adding up to its total — a bug that only appears under load and never reproduces on your laptop. Pin the snapshot instead:

\`\`\`sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
  SELECT ... ;   -- every query in here sees one consistent moment
  SELECT ... ;
COMMIT;
\`\`\`

That is the correct tool for a multi-query report or an export. It is read-only, so it costs nothing but the time it stays open.

### The lost update

Two sessions sell the last monitor:

\`\`\`sql
-- session A                          -- session B
SELECT stock FROM products            SELECT stock FROM products
 WHERE product_id = 12;   -- 10        WHERE product_id = 12;   -- 10
UPDATE products SET stock = 9         UPDATE products SET stock = 9
 WHERE product_id = 12;                WHERE product_id = 12;
\`\`\`

Two units sold, one unit deducted. No isolation level below \`SERIALIZABLE\` prevents this, because neither statement is wrong on its own — the application did the arithmetic in between them. Three fixes, best first:

\`\`\`sql
-- 1. Let the database read and write in a single statement
UPDATE products SET stock = stock - 1
WHERE product_id = 12 AND stock >= 1;   -- 0 rows affected means "sold out"
\`\`\`

The row is locked for the duration of that one statement, so B waits, re-reads 9, and writes 8. The \`stock >= 1\` guard turns overselling into a zero-row result you can test for, rather than negative stock nobody notices. **Always read the affected-row count of a conditional update; it is the return value.**

\`\`\`sql
-- 2. Pessimistic: reserve the row, then decide
BEGIN;
SELECT stock FROM products WHERE product_id = 12 FOR UPDATE;  -- others wait
UPDATE products SET stock = 9 WHERE product_id = 12;
COMMIT;

-- 3. Optimistic: a version column, retry when 0 rows change
UPDATE products SET stock = 9, version = version + 1
WHERE product_id = 12 AND version = 7;
\`\`\`

### Deadlocks and long transactions

Session A locks order 1001 then 1002 while B locks 1002 then 1001, and neither can move. PostgreSQL detects the cycle and kills one with \`deadlock detected\`. That is not corruption, it is an instruction to retry. Prevent it by touching rows in a consistent order — \`ORDER BY order_id\` in bulk updates — and by keeping transactions short.

Short matters for analysts too. An open transaction pins a snapshot, and \`VACUUM\` cannot reclaim any row that snapshot might still need, so a \`BEGIN;\` left open over lunch bloats tables and blocks migrations behind it. Look for \`idle in transaction\` in \`pg_stat_activity\`, and set \`idle_in_transaction_session_timeout\` so the database tidies up after you.

Transactions wrap writes that must agree with each other, and reads that must agree with each other. Nothing else.
        `),
        lesson('Idempotent Loads: UPSERT, MERGE, and Re-runnable Pipelines', 15, `
A load is **idempotent** when running it twice leaves the database in exactly the state running it once did. Pipelines fail halfway, schedulers retry them, and humans re-run them because they are not sure the first attempt worked. If the load is not idempotent, every one of those events invents revenue.

### UPSERT: insert, or update what is already there

\`\`\`sql
INSERT INTO products (product_id, name, category, unit_price)
VALUES (12, '27-inch Monitor', 'Displays', 340.00)
ON CONFLICT (product_id) DO UPDATE
SET name       = EXCLUDED.name,
    category   = EXCLUDED.category,
    unit_price = EXCLUDED.unit_price;
\`\`\`

\`EXCLUDED\` is the row you tried to insert. Run that statement a hundred times and you still have one row at 340.00 — the definition of idempotent.

The requirement people trip over: **the conflict target must be backed by a unique index or constraint.** \`ON CONFLICT (email)\` fails with \`there is no unique or exclusion constraint matching the ON CONFLICT specification\` unless \`customers.email\` is \`UNIQUE\` — which Chapter 1 declared it to be, precisely so loads like this one work.

\`DO NOTHING\` is the insert-if-absent variant:

\`\`\`sql
INSERT INTO customers (customer_id, name, email, city, country, signup_date)
VALUES (6, 'Farah Iqbal', 'farah@shop.com', 'Lahore', 'PK', DATE '2024-08-01')
ON CONFLICT (email) DO NOTHING;
\`\`\`

### Do not let a replay overwrite good data with old data

\`\`\`sql
ON CONFLICT (customer_id) DO UPDATE
SET city = EXCLUDED.city, updated_at = EXCLUDED.updated_at
WHERE EXCLUDED.updated_at > customers.updated_at;   -- only if genuinely newer
\`\`\`

Without that \`WHERE\`, re-processing yesterday's file stamps yesterday's city back over today's correction. Out-of-order replays are nearly impossible to spot afterwards, because nothing about the data looks broken — it is simply wrong.

### Deduplicate the batch before it reaches the insert

\`\`\`sql
INSERT INTO customers (customer_id, name, email, city, country, signup_date)
SELECT DISTINCT ON (LOWER(TRIM(email)))
       customer_id, name, LOWER(TRIM(email)), city, country, signup_date
FROM staging_customers
ORDER BY LOWER(TRIM(email)), signup_date      -- which duplicate wins
ON CONFLICT (email) DO UPDATE SET city = EXCLUDED.city;
\`\`\`

If one batch contains the same key twice, PostgreSQL raises \`ON CONFLICT DO UPDATE command cannot affect row a second time\`. \`DISTINCT ON\` — or lesson 5.1's \`ROW_NUMBER\` filter — settles it in the source, where you can still see which copy you kept and why.

### MERGE

\`\`\`sql
MERGE INTO products p
USING staging_products s ON p.product_id = s.product_id
WHEN MATCHED     THEN UPDATE SET unit_price = s.unit_price
WHEN NOT MATCHED THEN INSERT (product_id, name, category, unit_price)
                      VALUES (s.product_id, s.name, s.category, s.unit_price);
\`\`\`

\`MERGE\` is standard SQL (PostgreSQL 15+, long-standing in Oracle and SQL Server), it can delete as well as update, and it needs no unique index. Its trade-off is concurrency: \`ON CONFLICT\` is atomic against other writers, while \`MERGE\` can still raise a unique violation when another session inserts the same key mid-statement. In PostgreSQL, prefer \`ON CONFLICT\` for anything that runs while the application is live.

### Reloading a window atomically

Aggregate tables often have no convenient key. Replace whole periods instead:

\`\`\`sql
BEGIN;
DELETE FROM daily_revenue
 WHERE day >= DATE '2024-06-01' AND day < DATE '2024-07-01';   -- half-open
INSERT INTO daily_revenue (day, revenue)
SELECT o.order_date::date, SUM(oi.quantity * oi.unit_price)
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'
  AND o.order_date >= DATE '2024-06-01' AND o.order_date < DATE '2024-07-01'
GROUP BY 1;
COMMIT;
\`\`\`

The half-open range is lesson 1.3 again. The transaction is not optional: without it, any reader arriving between the delete and the insert sees a month with zero revenue, and dashboards cache exactly that.

### Watermarks and the late row

\`\`\`sql
WHERE o.updated_at >= (SELECT last_loaded_at FROM load_state WHERE name = 'orders')
                       - INTERVAL '1 hour'           -- deliberate overlap
\`\`\`

Two things go wrong here. A strict \`>\` skips every row sharing the exact watermark timestamp. And rows that arrive late — inserted today, timestamped yesterday — sit forever behind a watermark that has already moved past them. Track \`updated_at\` rather than \`created_at\`, re-read a deliberate overlap, and let the upsert absorb the repeats. That is what idempotence buys you.

Design the load so re-running it is boring. Then a pipeline failure at 3 a.m. is a retry, not an incident.
        `),
      ],
      [
        q('You run an UPDATE with the wrong WHERE and immediately want the old values back. Why is that normally impossible?', [
          'UPDATE statements cannot be rolled back by design',
          'ROLLBACK applies only to INSERT and DELETE',
          'Clients default to autocommit, so the statement committed the moment it ran',
          'The undo information is discarded once the row count is returned',
        ], 2, 'Autocommit commits each statement as it lands, so the protection has to come first: BEGIN, the statement, an inspection, then COMMIT or ROLLBACK.'),
        q('Two sessions read stock = 10, each subtracts one in application code, and both write 9. What actually prevents the lost unit?', [
          'Doing the arithmetic in one statement: SET stock = stock - 1 WHERE stock >= 1',
          'Running both sessions at READ COMMITTED',
          'Adding an index on the stock column',
          'Wrapping each SELECT in its own transaction',
        ], 0, 'A single UPDATE reads and writes under the row lock, so the second session sees 9, and the guard clause turns overselling into zero rows affected instead of negative stock.'),
        q('INSERT ... ON CONFLICT (email) DO UPDATE fails with "there is no unique or exclusion constraint matching". Why?', [
          'ON CONFLICT accepts only the primary key of the table',
          'EXCLUDED must be declared before it can be referenced',
          'DO UPDATE requires an accompanying WHERE clause',
          'The conflict target needs a unique index or constraint on email',
        ], 3, 'PostgreSQL detects the conflict through a unique index, so the column named as the conflict target must have one.'),
        q('A monthly reload deletes the month and then re-inserts it. Why must both statements sit inside one transaction?', [
          'DELETE cannot be run twice against the same range',
          'Otherwise a reader arriving between the two statements sees the month with zero revenue',
          'INSERT ... SELECT is not permitted outside a transaction',
          'The DELETE would otherwise cascade into order_items',
        ], 1, 'Atomicity is what hides the intermediate state; without it the table is briefly, visibly, and cacheably wrong.'),
      ]
    ),
    chapter(
      'Putting a Query Into Production',
      'Models other people depend on, tests that fail loudly when the data goes wrong, and the rules for running SQL inside an application.',
      [
        lesson('Views, Materialised Views, and Layered Models', 14, `
A **view** is a stored query with a name. It holds no data of its own; selecting from it runs the underlying SQL against the current tables.

\`\`\`sql
CREATE VIEW paid_order_totals AS
SELECT o.order_id, o.customer_id, o.order_date,
       SUM(oi.quantity * oi.unit_price) AS order_value
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'
GROUP BY o.order_id, o.customer_id, o.order_date;
\`\`\`

The grain fix from lesson 3.3 now has a name, and every report can start from it:

\`\`\`sql
SELECT customer_id, SUM(order_value) AS revenue
FROM paid_order_totals GROUP BY customer_id;
\`\`\`

The value is not the saved typing. It is that "paid revenue" now has **one definition**. When finance decides a refunded-then-reordered sale counts after all, you edit one object instead of hunting nine dashboards that each re-derived it slightly differently and disagree by 3%.

\`CREATE OR REPLACE VIEW\` keeps existing grants and dependent views, but it cannot drop, rename, or reorder existing columns — add new ones at the end. Anything else means dropping the dependents first, which is the moment you discover who was using it.

### Views compose, and then they get slow

Stacking views is normal and usually fine: the planner inlines them, so a \`WHERE customer_id = 2\` on the outer query is pushed down into the base tables and an index can serve it. That still holds when the view aggregates — \`customer_id\` is a \`GROUP BY\` column, so the filter lands on the scan and \`EXPLAIN\` shows an index scan under the aggregate, even through two aggregating views stacked on each other. Grouping on its own does not block a filter, and the common belief that it does sends people denormalising things that were already fast.

What actually blocks the pushdown is narrower, and worth knowing precisely:

| Inside the view | An outer filter on |
|---|---|
| \`GROUP BY\` | a grouping column pushes down; an **aggregate result** cannot, so it waits for the whole aggregation |
| a window function | a \`PARTITION BY\` column pushes down; any other column waits |
| \`LIMIT\` / \`OFFSET\` | nothing pushes down — the limit has to be applied first or the answer changes |
| \`DISTINCT ON\` | the distinct key pushes down; the other columns wait |

So the view that felt instant and became a four-minute report is the one being filtered on \`order_value\` rather than \`customer_id\`, or read through a layer someone capped with \`LIMIT\`. Run \`EXPLAIN\` (lesson 5.2) on the query you actually ship, never on the view definition in isolation — the plan tells you which row of that table you landed on.

### Materialised views store the answer

\`\`\`sql
CREATE MATERIALIZED VIEW daily_revenue_mv AS
SELECT o.order_date::date                AS day,
       SUM(oi.quantity * oi.unit_price)  AS revenue,
       NOW()                             AS refreshed_at
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'paid'
GROUP BY 1;

CREATE UNIQUE INDEX daily_revenue_mv_day ON daily_revenue_mv (day);  -- required below
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue_mv;
\`\`\`

The name is deliberately not \`daily_revenue\` — that is the plain nightly table from lesson 5.3, and the two cannot share a name. It is also the same trade-off from a different angle: lesson 6.3 kept a table current by replacing whole periods inside a transaction, and a matview hands that scheduling job to the database instead.

A materialised view is a table that remembers how to rebuild itself. The four-minute dashboard becomes a millisecond lookup and you pay for it in staleness.

Two operational facts decide whether it survives production. Plain \`REFRESH MATERIALIZED VIEW\` takes an **exclusive lock** for its entire duration, so every dashboard query blocks until it finishes — which is why the dashboard freezes for forty seconds every hour on the hour. \`CONCURRENTLY\` does not block readers, but it **requires a unique index** on the matview. Create that index the day you create the matview, not the day the dashboard times out.

Carry \`refreshed_at\` in the data itself, and display it. A number that admits it is six hours old is useful; the same number pretending to be live is a trap. And a refresh job that fails silently is worse than a slow query, which is what the next lesson is for.

### Layer the models

| Layer | Contains | Rule |
|---|---|---|
| \`raw\` | Byte-for-byte copy of the source | Never edited, never deleted |
| \`clean\` | Typed, trimmed, deduplicated | One row per real thing |
| \`mart\` | Joined, aggregated, business names | The only layer anyone else reads |

Cleaning lives between raw and clean (lesson 5.1); grain decisions live between clean and mart (lesson 3.3). Name objects after their grain — \`orders_clean\`, \`customer_monthly_revenue\` — so a reader knows what one row represents before opening the definition.

Point the BI tool at \`mart\` and nothing else. Then a column rename in the source breaks one clearly-owned view instead of eleven dashboards nobody remembers building.
        `),
        lesson('Testing Data: Assertions That Fail Loudly', 14, `
A data test is a query that **returns zero rows when everything is fine**. Adopt that one convention and every check becomes runnable by the same scheduler, and every failure arrives with its own worked example attached.

### The grain test

\`\`\`sql
-- Must return zero rows: order_items is one row per (order_id, product_id)
SELECT order_id, product_id, COUNT(*)
FROM order_items
GROUP BY order_id, product_id
HAVING COUNT(*) > 1;
\`\`\`

Run this against every table and every model you build, especially the ones you join at a common grain. The day it returns a row is the day a report started double-counting (lesson 3.3); without the test you hear about it from a stakeholder a fortnight later, with the wrong number already in a board pack.

### The orphan test

\`\`\`sql
SELECT oi.order_id
FROM order_items oi
LEFT JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_id IS NULL;
\`\`\`

That is the anti-join from lesson 3.3 repurposed as an assertion. Declared foreign keys make orphans impossible inside the source database — but staging tables, CSV loads, and anything arriving from another system carry no constraints at all, so you check them yourself.

### Range and NULL tests

\`\`\`sql
SELECT product_id, unit_price FROM products
WHERE unit_price IS NULL OR unit_price <= 0;

SELECT order_id, order_date FROM orders
WHERE order_date > CURRENT_DATE;           -- an order from the future
\`\`\`

Phrase every check so the *offending rows* are the output. \`SELECT COUNT(*) FROM products WHERE unit_price <= 0\` always returns exactly one row, so a runner cannot tell pass from fail without a human reading the number — which means nobody reads it.

### Freshness and volume

\`\`\`sql
-- Fires only when the newest order is more than two days old
SELECT MAX(order_date) AS latest
FROM orders
HAVING MAX(order_date) < CURRENT_DATE - 2;
\`\`\`

\`HAVING\` with no \`GROUP BY\` treats the whole table as a single group (Chapter 2), so this returns one row when the data is stale and nothing when it is fresh — exactly the convention.

Volume checks catch the failure mode that produces no error at all: a pipeline that loaded half a day.

\`\`\`sql
WITH daily AS (
  SELECT order_date::date AS d, COUNT(*) AS n FROM orders GROUP BY 1
)
SELECT d, n FROM daily
WHERE d = CURRENT_DATE - 1
  AND n < 0.5 * (SELECT AVG(n) FROM daily
                 WHERE d BETWEEN CURRENT_DATE - 8 AND CURRENT_DATE - 2);
\`\`\`

Nothing about a half-loaded day looks broken. Every query still runs, every join still matches, and the revenue chart simply dips. Volume is the only check that catches it before someone explains the dip in a meeting.

### Reconciliation against the system of record

\`\`\`sql
SELECT w.total AS warehouse, p.total AS payments, w.total - p.total AS diff
FROM (SELECT COALESCE(SUM(order_value), 0) AS total FROM paid_order_totals) w,
     (SELECT COALESCE(SUM(amount), 0) AS total FROM payments
       WHERE status = 'captured') p
WHERE ABS(w.total - p.total) > 1.00;       -- tolerance, in currency units
\`\`\`

This is lesson 5.3's manual sanity check, automated and given a threshold. Warehouse revenue must agree with what the payment processor says it captured, and a growing \`diff\` is the earliest warning that a load has started dropping rows.

### Make failure impossible to ignore

\`\`\`sql
DO $$
DECLARE bad INT;
BEGIN
  SELECT COUNT(*) INTO bad
  FROM (SELECT order_id, product_id FROM order_items
        GROUP BY 1, 2 HAVING COUNT(*) > 1) t;
  IF bad > 0 THEN
    RAISE EXCEPTION 'grain check failed: % duplicate keys in order_items', bad;
  END IF;
END $$;
\`\`\`

An exception gives the scheduler a non-zero exit code, and that is what turns a check into an alert. Write each run into a \`data_check_results\` table as well, so you can answer "when did this start failing?" instead of guessing.

A check nobody is notified about is a comment. Decide who finds out, and how, before you write the query.
        `),
        lesson('Running SQL Inside an Application', 15, `
The query you tried once in a console and the query running ten thousand times an hour behind an API are the same text and a completely different set of risks.

### Never build SQL by concatenation

\`\`\`js
// BROKEN: the input becomes part of the statement
const sql = \`SELECT * FROM customers WHERE email = '\${email}'\`;
// email = "x' OR 1=1 --"  ->  returns every customer row, PII included
\`\`\`

\`\`\`js
// CORRECT: the value never becomes SQL
const { rows } = await pool.query(
  'SELECT customer_id, name, city FROM customers WHERE email = $1',
  [email.trim().toLowerCase()]
);
\`\`\`

The driver sends the statement and the values as separate things. The database parses \`WHERE email = $1\` before it has ever seen the input, so \`x' OR 1=1 --\` is looked up as an email address and matches nothing. Hand-escaping quotes is not an equivalent defence — you will miss a case, and the parameterised version is less typing anyway.

The same rule covers \`LIKE\`: pass \`$1\` and build the wildcards in the value (\`'%' + term + '%'\`), not in the SQL string.

### What a placeholder cannot do

Placeholders stand for **values**, never identifiers or keywords:

\`\`\`js
// No error — which is the trap. $1 binds as the text value 'order_date',
// so the sort key is a constant, every row compares equal, and PostgreSQL
// drops the Sort node entirely: EXPLAIN shows a bare Seq Scan.
pool.query('SELECT * FROM orders ORDER BY $1', ['order_date']);
\`\`\`

The rows come back unsorted and nobody gets an error to investigate. A user-selectable sort column has to come from a server-side allow-list:

\`\`\`js
const SORTABLE = { date: 'o.order_date', value: 't.order_value' };
const col = SORTABLE[req.query.sort] ?? 'o.order_date';       // map, never interpolate
const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';         // two literal choices
const sql = \`SELECT ... ORDER BY \${col} \${dir} LIMIT $1\`;
\`\`\`

Both values now originate in your code, not the request. "It is only a column name" is how injection gets in through the one endpoint nobody reviewed.

### Least privilege

\`\`\`sql
CREATE ROLE analytics_ro LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE shop TO analytics_ro;
GRANT USAGE  ON SCHEMA mart TO analytics_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA mart TO analytics_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA mart
  GRANT SELECT ON TABLES TO analytics_ro;      -- covers tables created later
\`\`\`

The service that writes orders and the dashboard that reads them should not share credentials. A read-only role turns a catastrophic mistake into an error message. The \`ALTER DEFAULT PRIVILEGES\` line is the one everybody forgets — without it, next month's new model is invisible to the role and someone "fixes" it by granting superuser.

Grant on the \`mart\` layer only (lesson 7.1) and the base tables holding email addresses need never be reachable at all.

### Timeouts and connections

\`\`\`sql
ALTER ROLE analytics_ro SET statement_timeout = '30s';
\`\`\`

One unbounded analytical query on the production database holds a connection, holds a snapshot, and starves the app. Set the timeout on the role rather than trusting every caller, run heavy reporting against a replica, and treat a timeout as a signal to add the index from lesson 5.2 — not as a number to raise.

Connections are finite. A pool of 10 shared by the whole process is normal; opening a client per request is how you exhaust \`max_connections\` under a traffic spike. And never issue one query per row of a previous result — the N+1 pattern is a join you have not written yet.

### Pagination that survives page 400

\`\`\`sql
-- OFFSET: the engine still reads and discards 8,000 rows to return 20
SELECT ... ORDER BY order_date DESC, order_id DESC OFFSET 8000 LIMIT 20;

-- Keyset: remember where the last page ended
SELECT ... WHERE (order_date, order_id) < ($1, $2)
ORDER BY order_date DESC, order_id DESC LIMIT 20;
\`\`\`

\`OFFSET n\` gets linearly slower as \`n\` grows, and because each request is evaluated fresh, a row inserted between page 3 and page 4 shifts the window and makes a row repeat or vanish — lesson 1.2's tiebreaker problem, at scale. Keyset paging is an index seek regardless of depth, and the row-value comparison \`(a, b) < ($1, $2)\` handles the tiebreaker in one expression. The trade-off is that you cannot jump straight to page 40, which almost nobody actually does.
        `),
      ],
      [
        q('A dashboard freezes for forty seconds every time the materialised view refreshes. What fixes it?', [
          'Running the REFRESH inside an explicit transaction',
          'Adding a unique index to the matview and refreshing it CONCURRENTLY',
          'Converting the materialised view back into a plain view',
          'Raising statement_timeout for the dashboard role',
        ], 1, 'A plain REFRESH holds an exclusive lock for its whole duration; CONCURRENTLY avoids the lock but only works when the matview has a unique index.'),
        q('Why are data quality checks written so that a passing check returns zero rows?', [
          'Zero-row results are cheaper for the planner to compute',
          'Because HAVING cannot return rows without a GROUP BY',
          'It is the only form a scheduler is able to execute',
          'Any returned row is a concrete failing example, so one convention covers every check and the output is the evidence',
        ], 3, 'The rows a failing check returns are exactly the offending keys, so a single runner can execute every assertion and each failure arrives with its own worked example.'),
        q('A report lets the user choose the sort column. Why can that column not be passed as a query parameter?', [
          'Placeholders substitute values, not identifiers, so the column must come from a server-side allow-list',
          'Parameters are restricted to numeric and date types',
          'ORDER BY is evaluated before parameters are bound',
          'It can, as long as the value is wrapped in quotes first',
        ], 0, 'The database parses the statement before binding any values, so an identifier has to be part of the SQL text, which makes an allow-list map the only safe way to build it.'),
        q('Page 400 of an OFFSET-paginated report is slow and occasionally repeats a row. Why?', [
          'The LIMIT is too small for the index to be used',
          'OFFSET requires a materialised view to behave correctly',
          'The engine reads and discards every skipped row, and rows inserted between requests shift the window',
          'ORDER BY is ignored once OFFSET exceeds 1000',
        ], 2, 'OFFSET does linear work and is recomputed on every request, so keyset paging that filters on the last row seen is both faster and stable.'),
      ]
    ),
  ],
  final: [
    q('Why should a date filter be written as >= start AND < next_start rather than BETWEEN two dates?', [
      'BETWEEN is not supported for date columns',
      'BETWEEN excludes almost the whole final day when the column is a timestamp',
      'The half-open form is the only one that can use an index',
      'BETWEEN reverses the sort order of the result',
    ], 1, "'2024-03-31' as a timestamp means midnight at the start of that day, so BETWEEN silently discards the rest of it."),
    q('Joining orders to order_items inflates an order-level total. The correct fix is to', [
      'add DISTINCT to the SELECT list',
      'replace SUM with SUM(DISTINCT ...)',
      'switch the inner join to a LEFT JOIN',
      'aggregate order_items to one row per order in a CTE, then join that',
    ], 3, 'The grain changed to one row per line, so the order-level value must be collapsed back to order grain before it is joined and summed.'),
    q('After a LEFT JOIN from customers to orders, which expression correctly reports zero for a customer with no orders?', [
      'COUNT(o.order_id)',
      'COUNT(*)',
      'COUNT(1)',
      'COUNT(c.customer_id)',
    ], 0, 'The outer join emits one row with NULL order columns, so only counting a right-hand column gives 0; the others count the placeholder row.'),
    q('Why must ROW_NUMBER() be filtered in an outer query rather than in WHERE?', [
      'Window functions return text and need casting',
      'WHERE cannot reference any alias at all',
      'Window functions are computed at the SELECT step, after WHERE has run',
      'ROW_NUMBER is only valid inside a GROUP BY',
    ], 2, 'The logical order of operations puts WHERE before SELECT, so the window value does not exist yet; a CTE or subquery makes it filterable.'),
    q('Which query can still use a plain B-tree index on orders.order_date?', [
      "WHERE order_date::text LIKE '2024-06%'",
      "WHERE DATE_TRUNC('month', order_date) = DATE '2024-06-01'",
      "WHERE order_date + INTERVAL '1 day' > NOW()",
      "WHERE order_date >= DATE '2024-06-01' AND order_date < DATE '2024-07-01'",
    ], 3, 'The indexed column stays bare on one side of the comparison, so the engine can seek directly into the sorted index.'),
    q('A report needs customers whose total paid revenue exceeds 500, from paid orders only. Where do the two conditions go?', [
      'Both in HAVING',
      "status = 'paid' in WHERE, SUM(...) > 500 in HAVING",
      'Both in WHERE',
      "SUM(...) > 500 in WHERE, status = 'paid' in HAVING",
    ], 1, 'WHERE decides which rows enter each group and HAVING decides which groups survive; an aggregate cannot be evaluated before the groups exist.'),
    q('An order contains many products and a product appears in many orders. How is that modelled?', [
      'A comma-separated product_ids column on orders',
      'A foreign key on products pointing at orders',
      'A junction table with a composite key of (order_id, product_id)',
      'One row per product added to the orders table',
    ], 2, 'A many-to-many relationship needs a table between the two, which is exactly what order_items is.'),
    q('Storing customer_city on the orders table breaks which rule?', [
      '3NF — city depends on customer_id, which is not the key of orders',
      '1NF — the cell would hold more than one value',
      '2NF — city depends on part of a composite key',
      'No rule; it is a valid denormalisation for reporting',
    ], 0, 'Third normal form forbids a non-key column depending on another non-key column, which is what creates update anomalies.'),
    q('You need each row to show both its own value and the running total to date. What do you use?', [
      'GROUP BY with SUM and a self-join',
      'A correlated subquery per row',
      'HAVING with a cumulative condition',
      'SUM(value) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    ], 3, 'A window function computes across rows without collapsing them, and the explicit ROWS frame steps one row at a time instead of lumping same-date peers together.'),
    q('EXPLAIN ANALYZE reports a Seq Scan with "Rows Removed by Filter: 249999" on a large table. What does that suggest?', [
      'The table has too many indexes',
      'The filter is selective but no usable index exists, so the engine read everything and discarded most of it',
      'The query returned duplicate rows',
      'Statistics are accurate and the plan is optimal',
    ], 1, 'Reading a quarter of a million rows to keep one is the signature of a missing index on the filtered column.'),
    q('A nightly load is retried after a failure and the monthly revenue doubles. What property was missing?', [
      'The load was not wrapped in a transaction',
      'The source table lacked an index on its key',
      'Idempotence: an insert-only load creates a second copy, where an upsert on a unique key would not',
      'The watermark column allowed NULLs',
    ], 2, 'Re-running an idempotent load leaves the same end state, which is exactly what ON CONFLICT DO UPDATE against a unique key guarantees.'),
    q('A report made of six queries returns subtotals that do not add up to its own total. What is the likeliest cause and fix?', [
      'Each query saw a different snapshot under READ COMMITTED; run them inside one REPEATABLE READ transaction',
      'The queries should be combined with UNION ALL',
      'The underlying tables are missing indexes',
      'HAVING was used where WHERE was needed',
    ], 0, 'READ COMMITTED takes a fresh snapshot per statement, so commits landing between the queries make them disagree; one repeatable-read transaction pins a single moment.'),
    q('Which actually protects a lookup by a user-supplied email address?', [
      'Escaping single quotes in the value before concatenating it into the SQL',
      'Wrapping the query in a transaction',
      'Granting the application a read-only role',
      'Passing the value as a bound parameter: WHERE email = $1',
    ], 3, 'A bound parameter travels separately from the statement, so the database has already parsed the query and can only treat the input as a value.'),
    q('Which query works as an unattended data quality check?', [
      'SELECT COUNT(*) FROM order_items',
      'SELECT order_id, product_id FROM order_items GROUP BY 1, 2 HAVING COUNT(*) > 1',
      'SELECT * FROM order_items LIMIT 10',
      'EXPLAIN ANALYZE SELECT * FROM order_items',
    ], 1, 'A check has to be phrased so that success is zero rows and any row returned names the offending key; a bare count or a sample tells the runner nothing about pass or fail.'),
  ],
});
