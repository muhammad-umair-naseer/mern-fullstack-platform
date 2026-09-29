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
        `,
        [
          q('In the wide spreadsheet, Ayesha\'s city is repeated on every one of her order rows. She moves to Karachi and someone updates two of the three rows. What has the database now become?', [
            'Slower to query, because the city column is no longer sorted',
            'Unchanged, because the extra copies are ignored on read',
            'A store of two contradictory answers to the question of where Ayesha lives',
            'Invalid, because the primary key on order_id has been violated',
          ], 2, 'Repeating a fact across rows creates an update anomaly: miss one copy and the table holds two different answers to the same question, with nothing flagging which is current.'),
          q('Why is the primary key of order_items the pair (order_id, product_id) rather than order_id on its own?', [
            'One order can contain several products, so order_id alone repeats and is not unique',
            'Composite keys are required whenever a table has two foreign keys',
            'Because product_id is a foreign key it must be part of every key',
            'Integer keys must be combined to stay unique above a million rows',
          ], 0, 'Order 1001 has two line rows, so order_id repeats; only the combination of order and product identifies a single line.'),
          q('A finance team reports that the sum of a year of order totals is off by a few cents. The amounts are stored as FLOAT. What explains it?', [
            'FLOAT columns silently truncate anything past two decimal places',
            'Binary floating point cannot represent values like 0.10 exactly, so rounding error accumulates over many rows',
            'SUM switches to integer arithmetic once the running total passes a million',
            'The database rounds each FLOAT to the currency of the session locale',
          ], 1, 'Binary floating point stores decimal fractions approximately, so each row carries a tiny error and summing thousands of rows makes it visible in cents.'),
        ]
      ),
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
        `,
        [
          q('A saved nightly report runs SELECT * FROM orders. A colleague adds a wide internal_notes column to the table. What is the effect on that report?', [
            'Nothing, because SELECT * is resolved once when the query is saved',
            'The query errors until the report is rewritten to name its columns',
            'Only the primary key columns are returned from then on',
            'It starts pulling the new column across the network, and anything reading columns by position shifts',
          ], 3, 'SELECT * is expanded at run time, so a new column joins the result set and quietly changes both the payload size and the column positions downstream consumers rely on.'),
          q('Pages of orders are fetched with ORDER BY order_date DESC LIMIT 10 OFFSET 10, and some orders appear on two pages while others never appear. What is the cause?', [
            'OFFSET counts from the end of the result rather than the start',
            'Several orders share the same order_date, and ties have no defined order between one page request and the next',
            'LIMIT cannot be combined with DESC without a subquery',
            'The order_date column needs to be cast to text before sorting',
          ], 1, 'Rows that tie on the sort column may come back in any order each time, so a tiebreaker such as order_id is needed to make pagination stable.'),
          q('SELECT DISTINCT city, country FROM customers returns more rows than you expected. What does DISTINCT actually apply to here?', [
            'The whole selected row, so it returns unique city and country pairs rather than unique cities',
            'The first column only, with country carried along from an arbitrary row',
            'Every column of the customers table, not just the two selected',
            'Nothing, because DISTINCT is ignored when more than one column is listed',
          ], 0, 'DISTINCT deduplicates the entire output row, so Lahore paired with two different country values yields two rows.'),
        ]
      ),
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
        `,
        [
          q('order_date is a timestamp. A March report filters WHERE order_date BETWEEN \'2024-03-01\' AND \'2024-03-31\'. Which orders does it miss?', [
            'Orders placed on 1 March, because BETWEEN excludes its lower bound',
            'None, because BETWEEN is inclusive on both ends',
            'Every order placed on 31 March after midnight, since the upper bound is the start of that day',
            'Orders whose time component is exactly midnight on any day',
          ], 2, 'The literal \'2024-03-31\' becomes midnight at the start of 31 March, so almost a full day of timestamps falls above the upper bound and is dropped.'),
          q('Erik Sund has no city recorded. A count of customers written as WHERE city <> \'Lahore\' leaves him out. Why?', [
            'The <> operator only works on indexed columns',
            'An empty string and NULL are treated as the same value by <>',
            'Erik\'s row was already excluded by the FROM clause',
            'NULL <> \'Lahore\' evaluates to UNKNOWN, and WHERE keeps only rows that are TRUE',
          ], 3, 'Comparisons against NULL yield UNKNOWN rather than TRUE, so the row is discarded unless you add OR city IS NULL or use IS DISTINCT FROM.'),
          q('A monthly chart groups by a text label built as \'Mar-2024\' instead of DATE_TRUNC(\'month\', order_date). What goes wrong?', [
            'The months sort alphabetically, so April lands before March on the axis',
            'The label cannot be used in GROUP BY because it is computed',
            'Every order collapses into a single bucket because text is not comparable',
            'The count of orders per month is doubled by the string conversion',
          ], 0, 'A text label sorts as text, so Apr comes before Mar; truncating keeps the value a real date and preserves chronological order.'),
        ]
      ),
            lesson('Stacking Results with UNION, INTERSECT, and EXCEPT', 13, `
Two queries, both correct, stacked with \`UNION\`. The report dropped from 6 rows to 5 and the missing row was a real sale. Nobody noticed for a month.

\`UNION\` removes duplicates. That is not a footnote, it is the entire difference between the two operators people treat as interchangeable.

### Four operators, four behaviours

| Operator | Keeps |
|---|---|
| \`UNION ALL\` | Every row from both queries, duplicates included |
| \`UNION\` | Every row, then removes duplicate rows |
| \`INTERSECT\` | Rows that appear in both results |
| \`EXCEPT\` | Rows in the first result that are absent from the second |

They compare whole rows, not a key you nominate. Two rows are duplicates only when every selected column matches.

### Stacking live and archived orders

\`\`\`sql
SELECT order_id, order_date, customer_id, status FROM orders
UNION ALL
SELECT order_id, order_date, customer_id, status FROM orders_archive
ORDER BY order_date DESC;
\`\`\`

The engine enforces three rules. Each branch returns the same number of columns, in the same position, with compatible types. Column names come from the first branch, so aliasing the second one changes nothing in the output. Swap two columns in the second \`SELECT\` and you get a type error if you are lucky, or a silently scrambled result if both columns happen to be text.

\`ORDER BY\` belongs to the combined result and is written once, at the very end. A branch cannot carry its own sort unless you wrap it in brackets, and even then sorting a branch only means something alongside \`LIMIT\`.

### Why UNION ALL should be your default

\`UNION\` must compare every row against every other row, which means sorting or hashing the whole result before it can return the first row. On six rows that costs nothing. On forty million it spills to disk and turns a nine second query into a four minute one.

It is also often simply wrong. The 27-inch Monitor sold at 300.00 in order 1002 and again at 300.00 per unit in order 1005. Write a price analysis that selects \`(product_id, unit_price)\` from one date range, \`UNION\` with a second date range, and those two genuine sales collapse into a single row. The count of units sold at 300.00 is now understated, and the query looks perfectly reasonable.

Reach for \`UNION\` only when removing duplicates is the point, and leave a comment saying so.

### EXCEPT answers "who is missing?"

\`\`\`sql
-- Customers who ordered in March but placed nothing in June
SELECT customer_id FROM orders
WHERE order_date >= DATE '2024-03-01' AND order_date < DATE '2024-04-01'
EXCEPT
SELECT customer_id FROM orders
WHERE order_date >= DATE '2024-06-01' AND order_date < DATE '2024-07-01';
\`\`\`

March holds orders 1001 (customer 1) and 1003 (customer 2). June holds order 1005 (customer 2). The result is customer 1, Ayesha Khan. \`EXCEPT\` deduplicates as well, which here is exactly what you want: one row per customer however many March orders they placed. \`INTERSECT\` is the same shape for the opposite question and returns customer 2.

Reconciliation is where these operators earn their keep. Run the same \`SELECT\` against your warehouse and against the source system, \`EXCEPT\` in both directions, and every row that comes back is a difference somebody has to explain. Two empty results are a proof that the two systems agree, which comparing \`COUNT(*)\` can never give you.

### The NULL surprise

Everywhere else in SQL, \`NULL = NULL\` is UNKNOWN. Set operators are the exception: they treat two NULLs as the same value.

\`\`\`sql
SELECT city FROM customers
UNION
SELECT city FROM customers;
\`\`\`

That returns Lahore, Karachi, Singapore, Madrid and exactly one NULL, not two. \`INTERSECT\` and \`EXCEPT\` match NULL to NULL the same way. It is a relief during reconciliation, because a missing value present in both systems counts as agreement. It is a trap the moment you expect NULL rows to survive an \`EXCEPT\` the way they survive nothing in a \`WHERE\` clause.
      `,
        [
          q('A report built from two branches is changed from UNION ALL to UNION and the row count falls from 6 to 5. What most likely happened?', [
            'One branch returned a NULL row, which UNION rejects outright',
            'Two genuinely separate rows had identical values in every selected column, so UNION folded them into one',
            'UNION applies the LIMIT of the first branch to the combined result',
            'The second branch was ignored because its column names differed',
          ], 1, 'UNION deduplicates on the whole output row, so two real records that happen to match on every selected column are collapsed into a single row.'),
          q('SELECT city FROM customers UNION SELECT city FROM customers is run against a table where one customer has no city. How many NULL rows come back?', [
            'Two, because NULL never equals NULL',
            'Zero, because set operators discard NULL rows',
            'One, because set operators treat two NULLs as the same value',
            'It depends on whether the city column is indexed',
          ], 2, 'Set operators deliberately break the usual three-valued rule and match NULL to NULL, so duplicate NULLs collapse into a single row.'),
          q('Which change would make a UNION ALL between two SELECT statements fail or return scrambled data?', [
            'Aliasing a column differently in the second branch from the first',
            'Adding an ORDER BY at the end of the combined statement',
            'Filtering the two branches on different date ranges',
            'Listing the columns of the second branch in a different order from the first',
          ], 3, 'Branches are matched by column position, not by name, so reordering columns either raises a type error or silently pairs the wrong values together.'),
        ]
      ),
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
        `,
        [
          q('A dashboard tile computes SUM(quantity * unit_price) for a customer who has no order lines at all, then adds a 10.00 delivery fee. The tile shows a blank. What went wrong?', [
            'SUM refuses to run when the WHERE clause matches nothing',
            'SUM over zero rows returns NULL, and NULL plus 10.00 is still NULL',
            'The multiplication overflowed the NUMERIC precision',
            'The fee has to be added before the aggregate, never after',
          ], 1, 'An aggregate over an empty set returns NULL rather than 0, and NULL propagates through any arithmetic that follows, so wrap it in COALESCE.'),
          q('You want the number of paid orders. Which expression counts all six orders instead of just the paid ones?', [
            'COUNT(*) FILTER (WHERE status = \'paid\')',
            'SUM(CASE WHEN status = \'paid\' THEN 1 ELSE 0 END)',
            'COUNT(CASE WHEN status = \'paid\' THEN 1 END)',
            'COUNT(CASE WHEN status = \'paid\' THEN 1 ELSE 0 END)',
          ], 3, 'With ELSE 0 the non-matching rows produce 0 rather than NULL, and COUNT counts every value that is not NULL, so all six rows are counted.'),
          q('In PostgreSQL, COUNT(*) FILTER (WHERE status=\'paid\') / COUNT(*) returns 0 for four paid orders out of six. Why?', [
            'Both counts are integers, so integer division truncates 0.666 down to 0',
            'FILTER cannot be combined with division in the same expression',
            'COUNT(*) is evaluated after the division, so the divisor is still zero',
            'Percentages must be produced with ROUND before they can be divided',
          ], 0, 'Integer divided by integer yields an integer in PostgreSQL, so multiplying by 100.0 first forces numeric arithmetic and gives 66.67.'),
        ]
      ),
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
        `,
        [
          q('SELECT c.country, c.name, COUNT(*) ... GROUP BY c.country is rejected with a message about c.name. What is the real reason the database refuses?', [
            'COUNT(*) cannot be combined with two non-aggregated columns',
            'Text columns are never allowed outside the GROUP BY list',
            'A country group contains many customers, so there is no single name the row could show',
            'The GROUP BY list has to repeat the columns in SELECT order',
          ], 2, 'A group collapses many rows into one, so any column that is not grouped or aggregated has no defined value, which is why MySQL returning an arbitrary name is worse than an error.'),
          q('A monthly revenue query grouped on DATE_TRUNC(\'month\', order_date) returns March, April and June but no May. What does that mean for a chart built directly on it?', [
            'The chart is fine, since a missing bucket is drawn as zero automatically',
            'The chart joins April straight to June, so a month with no sales looks like part of the trend',
            'The chart shows May twice, once for each neighbouring month',
            'The query has to be rerun with a wider WHERE clause to reveal May',
          ], 1, 'Aggregation can only emit buckets that have rows, so an empty month simply vanishes and the line misleads unless you LEFT JOIN onto a generated date spine.'),
          q('You add p.category to a query already grouped by c.country, and every country\'s revenue figure comes back unchanged. What does that tell you?', [
            'The query is correct, since adding a grouping column never changes totals',
            'The category column must be indexed before it can affect grouping',
            'Revenue is being rounded, which hides the split',
            'Something is wrong, because a finer grouping should split each country into smaller numbers',
          ], 3, 'Extra grouping columns make the result finer and each figure smaller, so identical totals mean the new column is not actually varying or the join is not what you think.'),
        ]
      ),
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
        `,
        [
          q('WHERE SUM(quantity * unit_price) > 500 is rejected outright. Which step of the logical order explains it?', [
            'WHERE runs before GROUP BY, so no groups exist yet for SUM to work on',
            'SELECT computes aggregates, and WHERE cannot read the SELECT list',
            'ORDER BY has to establish the row sequence before any sum is possible',
            'LIMIT is applied first, so the total would be incomplete anyway',
          ], 0, 'WHERE is step 2 and GROUP BY is step 3, so at filtering time there is nothing grouped to aggregate, which is exactly the gap HAVING at step 4 fills.'),
          q('Query A filters WHERE o.status = \'paid\' then groups by customer. Query B groups by customer and keeps only groups with no refunded orders. Why are they different reports?', [
            'Query B cannot use aggregates because it has no WHERE clause',
            'Query A returns one row per order while query B returns one row per customer',
            'Query A totals only money actually paid; query B totals every order but drops any customer who ever refunded',
            'Query B is simply the faster way of writing query A',
          ], 2, 'WHERE decides which rows enter a group and HAVING decides which whole groups leave, so the two produce genuinely different numbers for a customer with one refund.'),
          q('An engine accepts HAVING o.status = \'paid\' on a grouped query and returns the right number today. Why is it still a bad idea?', [
            'Every group is built before most are discarded, no index can help, and adding COUNT(*) later silently includes refunded rows',
            'HAVING is not standard SQL and will be removed in future versions',
            'The status column would need to be cast to a boolean first',
            'Results from HAVING cannot be sorted with ORDER BY afterwards',
          ], 0, 'A row level condition placed in HAVING does more work and leaves a fragile query, because any aggregate added afterwards is computed over rows that should already have been filtered out.'),
        ]
      ),
            lesson('Median, Percentiles, and When the Average Lies', 13, `
The average paid order in our store is 318.75. Look at the four paid orders: 120.00, 210.00, 300.00 and 645.00. Three of the four sit below the average, and not one of them is close to it. Put 318.75 on a slide labelled "typical order" and you have said something false with a correct number.

### The mean is a balance point, not a typical value

\`AVG\` finds the point where the values balance. One heavy value on one end drags it. Order 1005 alone is worth more than half the store's revenue, so it pulls the mean up past most of the data.

The **median** is the middle value in sorted order. It does not care how extreme the largest value is: push order 1005 to 6,450.00 and the mean jumps to 1,770.00 while the median does not move at all. That stability is the whole reason analysts report it.

### Computing it: ordered-set aggregates

\`\`\`sql
WITH paid_order_totals AS (
  SELECT o.order_id, SUM(oi.quantity * oi.unit_price) AS order_value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'paid'
  GROUP BY o.order_id
)
SELECT
  COUNT(*)                                                          AS n,
  ROUND(AVG(order_value), 2)                                        AS mean_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value)          AS median_cont,
  PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY order_value)          AS median_disc,
  PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY order_value)          AS p90
FROM paid_order_totals;
\`\`\`

| n | mean_value | median_cont | median_disc | p90 |
|---|---|---|---|---|
| 4 | 318.75 | 255.00 | 210.00 | 541.50 |

\`WITHIN GROUP (ORDER BY ...)\` is not a window clause. It tells an **ordered-set aggregate** how to sort its input before picking a position out of it, and the whole thing is still an aggregate: it collapses rows and obeys \`GROUP BY\` exactly like \`SUM\` does.

### CONT and DISC are not the same answer

With values 120, 210, 300 and 645 there is no middle row, so the two functions disagree on purpose.

| Function | Result | How |
|---|---|---|
| \`PERCENTILE_CONT(0.5)\` | 255.00 | Interpolates halfway between 210 and 300 |
| \`PERCENTILE_DISC(0.5)\` | 210.00 | Returns an actual value from the data |

Use \`DISC\` whenever the answer has to be something that really happened: a price someone was charged, an order date, a customer id. Use \`CONT\` for continuous measures like response time or basket value, where a number between two observations is meaningful.

\`MODE() WITHIN GROUP (ORDER BY status)\` completes the set and returns the most common value, \`'paid'\` across our six orders.

### The mistake that survives code review

Medians do not add up, and they do not average.

Suppose Lahore has four orders of 10.00, giving a median of 10.00. Karachi has orders of 1.00, 2.00 and 900.00, giving a median of 2.00. A dashboard that averages the two city medians reports 6.00. Line up all seven orders and the real median is 10.00. There is no way to recover a global median from per-group medians, which is why a summary table of medians cannot be rolled up the way a table of sums can. Recompute from the raw rows at every level you need.

The same trap catches percentiles: a p95 of daily p95 values is not the p95 of the period.

### Practical notes

NULLs are skipped, exactly as in \`AVG\`. Sorting is the cost, so a percentile over tens of millions of rows is far more expensive than a \`SUM\` and belongs in a nightly rollup rather than a live tile. MySQL had no ordered-set aggregates before version 8.0, so older code fakes a median by numbering the sorted rows and picking the middle ones.

Report \`n\`, the mean and the median together. When they diverge, that gap is the finding.
      `,
        [
          q('Paid orders are 120, 210, 300 and 645, and the mean is 318.75. Why does the mean sit above three of the four values?', [
            'Because AVG rounds up whenever the count of rows is even',
            'Because one unusually large value pulls the balance point towards it, while the median ignores its size',
            'Because AVG excludes the smallest value in the set by definition',
            'Because the values were summed before being sorted, which shifts the result',
          ], 1, 'The mean weighs every value by its magnitude, so a single large order drags it upward, whereas the median depends only on position in the sorted list.'),
          q('You need the median unit_price, and the figure will be quoted to a customer as a price the store actually charged. Which function fits and why?', [
            'PERCENTILE_CONT, because it always lands on the more common price',
            'AVG, because it uses every recorded price rather than one row',
            'PERCENTILE_DISC, because it returns a value that genuinely appears in the data',
            'MODE, because it is the only function that returns a real observation',
          ], 2, 'PERCENTILE_DISC picks an actual row value, while PERCENTILE_CONT can interpolate a price halfway between two rows that nobody ever paid.'),
          q('A dashboard stores each city\'s median order value nightly, then averages those medians for a company figure. What is wrong with that?', [
            'The nightly job would need to sort the cities before averaging them',
            'Averaging medians double counts any city that had no orders that day',
            'Medians can only be averaged when every city has the same number of rows',
            'Medians cannot be combined at all, so the company figure has to be recomputed from the raw rows',
          ], 3, 'A median depends on the position of values in the full sorted set, so per-group medians carry no information about how the groups interleave and cannot be rolled up like sums.'),
        ]
      ),
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
        `,
        [
          q('A query joins order_items to products and selects unit_price without a table prefix. The database refuses to run it. What is it objecting to?', [
            'The join needs an INNER keyword before the column can be resolved',
            'Both tables have a unit_price column, so the reference is ambiguous',
            'unit_price is NUMERIC and must be cast before selection',
            'Columns used in ON cannot also appear in the SELECT list',
          ], 1, 'When two joined tables expose the same column name the server cannot decide which one you meant, which is why qualifying every column with its alias avoids the error entirely.'),
          q('Which request is an INNER JOIN from customers to orders the wrong tool for?', [
            'Total revenue for orders placed in March',
            'The city of the customer behind each paid order',
            'A list of orders with the product names on each line',
            'Every customer with their order count, including those who have never bought',
          ], 3, 'An inner join keeps only rows that matched on both sides, so customers such as Erik Sund with no orders disappear before the count is calculated.'),
          q('Someone writes ON c.customer_id = o.order_id by mistake and the query returns a handful of rows without any error. What habit catches this?', [
            'Comparing row counts before and after the join, since a lookup join should not change the count',
            'Wrapping both sides of the ON clause in an explicit CAST',
            'Adding DISTINCT to remove the rows that matched by coincidence',
            'Running the query twice and checking the results are identical',
          ], 0, 'Both columns are integers so the comparison is legal and some ids coincide, and only checking that joining 6 orders still yields 6 rows exposes the mistake.'),
        ]
      ),
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
        `,
        [
          q('You need to find records present in the warehouse but missing from the source system, and records present in the source but missing from the warehouse, in one pass. Which join fits?', [
            'CROSS JOIN, because it pairs every row with every other row',
            'INNER JOIN, then filtering the result on IS NULL',
            'FULL OUTER JOIN, because it keeps unmatched rows from both sides',
            'LEFT JOIN, because unmatched rows on the right become NULL',
          ], 2, 'Only a full outer join preserves rows that failed to match on either side, so both directions of the discrepancy show up in a single result.'),
          q('A monthly revenue chart must show May with 0.00 rather than skipping it. Why does generating the months first and LEFT JOINing orders onto them work?', [
            'Because generated months are ordered, which forces the aggregation to fill the gap',
            'Because the month rows exist before any order is matched, so a month with no sales still produces a row',
            'Because a LEFT JOIN converts NULL revenue to zero automatically',
            'Because CROSS JOIN guarantees every order lands in exactly one month',
          ], 1, 'Aggregation can only emit buckets that have rows, so the fix is to create the buckets independently and attach the data to them rather than the other way round.'),
          q('After customers LEFT JOIN orders, what does the result actually contain for Erik Sund, who has never ordered?', [
            'No row at all, since there is nothing on the right to match',
            'One row per order in the table, each with Erik\'s details repeated',
            'A row with Erik\'s columns and zeros in every order column',
            'A single row with Erik\'s columns filled in and every order column NULL',
          ], 3, 'An outer join manufactures one row for the unmatched left row and fills the right hand columns with NULL, which is why COUNT and SUM over those columns need care.'),
        ]
      ),
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
        `,
        [
          q('A per-order shipping fee is inflated by fan-out, so someone tries SUM(DISTINCT o.shipping_fee). Why does that not fix it?', [
            'Two different orders that both charged 10.00 would be collapsed into a single 10.00',
            'DISTINCT is not permitted inside an aggregate function',
            'It counts the fee once per line item instead of once per order',
            'The fee column would first have to be added to the GROUP BY list',
          ], 0, 'DISTINCT deduplicates values rather than orders, so genuinely repeated fee amounts vanish and the total is now too low instead of too high.'),
          q('A self-join pairing customers in the same country uses ON a.country = b.country AND a.customer_id <> b.customer_id. What is wrong with it?', [
            'It never returns anything, because a row cannot join to its own table',
            'Each pair comes back twice, once as (A, B) and once as (B, A)',
            'It matches customers across different countries as well',
            'The second alias is unnecessary, so the query will not parse',
          ], 1, 'Inequality excludes only the self pairing, so using a.customer_id < b.customer_id is what keeps one row per unordered pair instead of two mirrored rows.'),
          q('After collapsing order_items into one row per order in a CTE and joining that to orders, COUNT(*) per customer is trustworthy again. Why?', [
            'The CTE is materialised, so the optimiser cannot duplicate rows',
            'COUNT(*) ignores rows created by a join to a derived table',
            'The grain of the result is one row per order again, so counting rows counts orders',
            'Aggregating inside a CTE removes NULLs that were inflating the count',
          ], 2, 'Once the many side has been reduced to one row per order, a row and an order mean the same thing, so a plain row count answers the question that was asked.'),
        ]
      ),
            lesson('Non-equi Joins: Matching on Ranges, Not Equality', 13, `
The euro revenue report came out 3x too high for March. The join key was correct, the totals in the source were correct, and the query had been reviewed. The bug was that two rows in the exchange rate table both claimed 9 March, so every order that day matched twice.

### ON takes a condition, not a key

An \`ON\` clause accepts any boolean expression. Equality is the common case, not the rule. Once you stop reading \`ON\` as "the key" and start reading it as "the rule for pairing rows", a whole family of lookups opens up.

### Banding a value

\`\`\`sql
CREATE TABLE price_bands (
  band       TEXT NOT NULL,
  min_price  NUMERIC(10,2) NOT NULL,   -- inclusive
  max_price  NUMERIC(10,2) NOT NULL    -- exclusive
);
-- ('Budget', 0, 100), ('Mid', 100, 300), ('Premium', 300, 1000000)

SELECT p.name, p.unit_price, b.band
FROM products p
JOIN price_bands b
  ON p.unit_price >= b.min_price
 AND p.unit_price <  b.max_price;
\`\`\`

| name | unit_price | band |
|---|---|---|
| USB-C Hub | 45.00 | Budget |
| Mechanical Keyboard | 120.00 | Mid |
| Laptop Stand | 120.00 | Mid |
| 27-inch Monitor | 300.00 | Premium |

Inclusive lower bound, exclusive upper bound, the same half-open shape that keeps date filters honest. It is not a style preference here, it is the thing that makes the join safe.

### Overlap is a fan-out you did not ask for

Write the bands the natural way instead, \`BETWEEN min_price AND max_price\` with bands of 0 to 100, 100 to 300 and 300 to 1000000, and the 27-inch Monitor at exactly 300.00 matches both Mid and Premium. It appears twice. Every downstream sum that touches that product is now doubled, and the report still looks plausible because the shape of it did not change.

Gaps are the mirror image. Bands of 0 to 99.99 and 100 to 299.99 leave 99.995 unmatched, and an inner join deletes the row silently.

A range lookup should produce exactly one match per left row. Prove it rather than assume it:

\`\`\`sql
-- Any left row matching zero or two-plus bands is a definition bug
SELECT p.product_id, COUNT(b.band) AS bands_matched
FROM products p
LEFT JOIN price_bands b
  ON p.unit_price >= b.min_price AND p.unit_price < b.max_price
GROUP BY p.product_id
HAVING COUNT(b.band) <> 1;
\`\`\`

### Effective-dated lookups

The same shape solves rates, prices and org structures that change over time.

\`\`\`sql
SELECT o.order_id, t.order_value, ROUND(t.order_value * r.rate, 2) AS value_eur
FROM order_totals t
JOIN orders   o ON o.order_id = t.order_id
JOIN fx_rates r
  ON r.currency  = 'USD'          -- equality first
 AND o.order_date >= r.valid_from
 AND o.order_date <  r.valid_to;  -- first day the rate is NOT valid
\`\`\`

That comment is the whole March bug. Somebody read \`valid_to\` as "the last day this rate applies" and entered 2024-03-09 for one row and 2024-03-09 as the start of the next. Order 1003 matched both, its 120.00 was counted twice, and the March total moved. In PostgreSQL the durable fix is a \`daterange\` column with an \`EXCLUDE USING gist\` constraint, so the database refuses to store two overlapping periods for the same currency.

Put the equality condition first. An index on \`(currency, valid_from)\` can seek on the equality and then range scan, which a lone inequality cannot do.

### What it costs

A range join cannot be a hash join, because hashing needs equality. The planner falls back to a nested loop or a merge join. Four orders against three rate rows is free. Fifty million events against a rate table is where the plan stops being free, so keep the range side small, or bucket the values first and join on the bucket.

### LATERAL: the right side reading the left row

A subquery in \`FROM\` cannot see the row it sits beside. \`LATERAL\` lifts that restriction, which lets you name an expression once and reuse it in the same \`SELECT\` list:

\`\`\`sql
SELECT oi.order_id, oi.product_id, calc.line_total,
       ROUND(calc.line_total * 0.17, 2) AS tax
FROM order_items oi
CROSS JOIN LATERAL (SELECT oi.quantity * oi.unit_price AS line_total) calc;
\`\`\`

Without \`LATERAL\` that subquery raises an error on \`oi.quantity\`. Use \`LEFT JOIN LATERAL (...) ON true\` when the subquery may return no rows and you still need the left row.
      `,
        [
          q('Price bands run 0 to 100, 100 to 300 and 300 to 1000000, joined with BETWEEN min_price AND max_price. What happens to the 27-inch Monitor at 300.00?', [
            'It matches two bands, so the product row is duplicated and its revenue is counted twice',
            'It matches no band, because BETWEEN excludes both endpoints',
            'It matches only the first band whose range contains it, and the join stops there',
            'The join fails with an ambiguous match error before returning rows',
          ], 0, 'BETWEEN is inclusive at both ends, so a value sitting exactly on a shared boundary satisfies two band rows and the join fans out instead of acting as a lookup.'),
          q('A range join between a 50 million row events table and a rates table is far slower than an equivalent equality join. Why?', [
            'Inequality comparisons on dates are evaluated one row at a time by the client',
            'The planner disables parallel workers whenever a join has more than one condition',
            'A hash join needs equality to bucket rows, so the planner falls back to a nested loop or merge join',
            'Range conditions force every index on the table to be rebuilt during the query',
          ], 2, 'Hashing works only for equality, so a pure range condition removes the cheapest join strategy and leaves plans whose cost grows much faster with row count.'),
          q('A subquery in FROM references oi.quantity from the table listed before it and raises an error. Adding LATERAL fixes it. What does LATERAL change?', [
            'It materialises the subquery so its columns are computed first',
            'It converts the subquery into a correlated scalar expression in the SELECT list',
            'It rewrites the CROSS JOIN into an INNER JOIN with an implicit key',
            'It lets the subquery reference columns from tables listed earlier in the FROM clause',
          ], 3, 'A plain subquery in FROM is evaluated independently of its neighbours, while LATERAL evaluates it once per left row and so allows it to read that row\'s columns.'),
        ]
      ),
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
        `,
        [
          q('A scalar subquery used in a WHERE comparison fails at run time with "more than one row returned by a subquery used as an expression". What usually causes that?', [
            'The subquery selected two columns instead of one',
            'The outer query is missing an ORDER BY, so rows arrive unsorted',
            'A key assumed to be unique has duplicates, so the subquery returns several rows',
            'Scalar subqueries are not allowed to reference more than one table',
          ], 2, 'A scalar subquery must collapse to a single value, so the error is nearly always a duplicate key or a missing GROUP BY rather than a syntax problem.'),
          q('A report puts two correlated subqueries in its SELECT list. It is instant on 5 customers and unusable on 50,000. Why?', [
            'Each subquery is conceptually re-executed once for every outer row, so the work grows with the table',
            'Correlated subqueries lock the referenced table until the outer query finishes',
            'The planner refuses to use any index inside a correlated subquery',
            'Results from correlated subqueries are buffered in memory until the last row',
          ], 0, 'Correlation ties the inner query to the current outer row, so the plan becomes a nested loop whose cost scales with the number of outer rows unless the optimiser can rewrite it as a join.'),
          q('Paid, pending and refunded totals are each written as a separate scalar subquery over the same two tables. What is the cost of that shape?', [
            'The three totals can disagree, because each subquery sees a different snapshot',
            'Scalar subqueries cannot be aliased, so the columns come back unnamed',
            'Only the first subquery uses an index; the other two fall back to sequential scans',
            'The same rows are scanned three times, where conditional aggregation would do it in one pass',
          ], 3, 'Every branch repeats the same join and scan for a different filter, so a single grouped query using FILTER or CASE reads the data once and returns all three numbers.'),
        ]
      ),
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
        `,
        [
          q('Since PostgreSQL 12, what happens to a CTE that the outer query references exactly once?', [
            'It is always computed first and stored, acting as an optimisation fence',
            'It is inlined like a subquery, so it is no faster than writing it inline',
            'It is rejected unless marked MATERIALIZED',
            'It is recomputed once for every row of the outer query',
          ], 1, 'Single-reference CTEs are inlined so the planner can push filters into them, which means the old advice that a CTE is automatically faster no longer holds.'),
          q('A WITH RECURSIVE that generates months is written without the WHERE clause in its recursive branch. What happens?', [
            'The anchor row is returned on its own with no recursion',
            'The engine stops after 100 iterations by default',
            'The query never terminates, because nothing tells the recursion to stop',
            'The recursive branch is silently converted to a UNION ALL of two rows',
          ], 2, 'The condition in the recursive term is the termination rule, so leaving it out means each iteration produces another row until the server runs out of resources.'),
          q('In a WITH block defining paid_orders, then order_totals, then customer_summary, which reference is illegal?', [
            'paid_orders referencing customer_summary, which is defined after it',
            'order_totals referencing paid_orders, which is defined before it',
            'customer_summary referencing order_totals in its FROM clause',
            'The final SELECT referencing customer_summary and the customers table together',
          ], 0, 'A CTE may only use names defined earlier in the same WITH block, so referring forward to a later definition fails unless the block is declared RECURSIVE.'),
        ]
      ),
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
        `,
        [
          q('Four paid order rows are selected alongside SUM(value) OVER (). What does the result look like?', [
            'One row holding the total, with the individual orders collapsed away',
            'An error, because SUM requires a GROUP BY or a PARTITION BY',
            'Four rows where the total resets to the current value on each row',
            'Four rows, each showing its own value and the same store-wide total',
          ], 3, 'A window function computes over a set of rows but returns a value on every row, so the row count is untouched and each order sees the whole.'),
          q('A leaderboard uses ROW_NUMBER() OVER (ORDER BY revenue DESC) and two products both earned 120.00. What should worry you?', [
            'Both products receive the same number, so the leaderboard has a gap at the next place',
            'The two tied products can swap positions between runs, because the tie is broken arbitrarily',
            'ROW_NUMBER returns NULL for tied rows until a tiebreaker is added',
            'The numbering restarts at 1 whenever two adjacent rows are equal',
          ], 1, 'ROW_NUMBER always produces 1, 2, 3 with no duplicates, so tied rows are ordered by whatever the plan happened to do and need an explicit tiebreaker such as product_id.'),
          q('LAG(revenue) OVER (ORDER BY month) is used for month-on-month change, but the source query has no row for May. What does the June row compare against?', [
            'NULL, because LAG cannot cross a gap in the sequence',
            'Zero, since a month with no sales is treated as zero revenue',
            'May, which the window function generates automatically',
            'April, because LAG steps to the previous row rather than the previous month',
          ], 3, 'LAG works on row position, not on calendar meaning, so a missing bucket makes "previous month" quietly mean "previous month that had data" unless you run it over a gap-free date spine.'),
        ]
      ),
            lesson('Frames, Moving Averages, and the LAST_VALUE Trap', 14, `
You add \`LAST_VALUE(order_value) OVER (ORDER BY order_date)\` expecting the most recent order value on every row. Every row returns its own value instead. No error, no warning, and the column looks like a copy of the one beside it.

Nothing is broken. The frame is doing exactly what it was told.

### The frame is the part you forgot to write

A window function does not see the whole partition. It sees a **frame**: a slice of the partition defined relative to the current row. Add an \`ORDER BY\` inside \`OVER\` and the frame silently becomes \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. The half people notice is where it starts. The half that bites is where it ends.

Against our four paid orders:

| order_date | order_value | FIRST_VALUE (default) | LAST_VALUE (default) | LAST_VALUE (full frame) |
|---|---|---|---|---|
| 2024-03-02 | 210.00 | 210.00 | 210.00 | 645.00 |
| 2024-03-09 | 120.00 | 210.00 | 120.00 | 645.00 |
| 2024-04-18 | 300.00 | 210.00 | 300.00 | 645.00 |
| 2024-06-30 | 645.00 | 210.00 | 645.00 | 645.00 |

\`FIRST_VALUE\` is right by accident, because the default frame starts where you wanted anyway. \`LAST_VALUE\` is wrong every single time.

\`\`\`sql
LAST_VALUE(order_value) OVER (
  ORDER BY order_date
  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
) AS latest_value
\`\`\`

The rule: the moment you write \`LAST_VALUE\` or \`NTH_VALUE\`, write the frame on the next line. There is no case where the default is what you meant.

### Sliding frames give you moving averages

\`\`\`sql
SELECT order_date, order_value,
       ROUND(AVG(order_value) OVER (
         ORDER BY order_date
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ), 2) AS avg_3
FROM paid_order_totals
ORDER BY order_date;
\`\`\`

| order_date | order_value | avg_3 |
|---|---|---|
| 2024-03-02 | 210.00 | 210.00 |
| 2024-03-09 | 120.00 | 165.00 |
| 2024-04-18 | 300.00 | 210.00 |
| 2024-06-30 | 645.00 | 355.00 |

Look at the first two rows. They average one value and two values, not three, because the frame is clipped at the start of the data. On a chart that reads as a real movement in the metric when it is only the window filling up. Suppress the partial window rather than explaining it later:

\`\`\`sql
CASE WHEN COUNT(*) OVER (ORDER BY order_date
                         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) = 3
     THEN AVG(order_value) OVER (ORDER BY order_date
                         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
END AS avg_3
\`\`\`

### ROWS counts rows, RANGE counts values

This one costs people a day. \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` means the two rows above this one, whatever dates they carry. Our March, April and June rows are weeks apart, so the "3 order moving average" spans four months. A quiet day with no orders has no row at all, so it does not shorten the window, it shifts it.

For a genuine calendar window, put an interval in a \`RANGE\` frame:

\`\`\`sql
AVG(daily_revenue) OVER (
  ORDER BY day
  RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
) AS rolling_7d
\`\`\`

Supported from PostgreSQL 11. It compares the \`ORDER BY\` value rather than counting positions, so empty days are excluded correctly instead of being skipped over.

### Name the window once

Three frames written out three times will drift apart the first time someone edits one of them.

\`\`\`sql
SELECT order_date, order_value,
       AVG(order_value) OVER w AS avg_3,
       MIN(order_value) OVER w AS min_3,
       MAX(order_value) OVER w AS max_3
FROM paid_order_totals
WINDOW w AS (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
ORDER BY order_date;
\`\`\`

The \`WINDOW\` clause sits after \`HAVING\` and before \`ORDER BY\`. One definition, three uses, one place to change it.
      `,
        [
          q('LAST_VALUE(order_value) OVER (ORDER BY order_date) returns each row\'s own value rather than the newest one. What is happening?', [
            'LAST_VALUE ignores its ORDER BY and reads rows in physical order',
            'The default frame ends at the current row, so the last row of the frame is the current row',
            'LAST_VALUE requires a PARTITION BY before it can look ahead',
            'The order_date column contains ties, which reset the frame on every row',
          ], 1, 'Adding ORDER BY inside OVER sets a default frame running to the current row, so the fix is to spell out ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.'),
          q('A rolling 7 day average uses ROWS BETWEEN 6 PRECEDING AND CURRENT ROW over daily revenue. Some days had no sales at all. What does the query actually compute?', [
            'An average over the last 7 rows, which may span far more than 7 calendar days',
            'An average over exactly 7 calendar days, with missing days counted as zero',
            'NULL on any day whose window contains a gap',
            'An average that restarts from scratch after every missing day',
          ], 0, 'ROWS counts row positions rather than dates, so days without rows simply do not exist in the window and the frame stretches back over a longer period than intended.'),
          q('NTILE(4) OVER (ORDER BY revenue DESC) puts two customers with identical revenue in different quartiles. Why?', [
            'NTILE only accepts an integer column, so revenue is being truncated',
            'The window is missing a PARTITION BY, so buckets are assigned at random',
            'NTILE fills buckets of roughly equal row count by position, not by value thresholds',
            'Ties are always pushed into the final bucket regardless of their order',
          ], 2, 'NTILE divides the ordered rows into N groups of as near equal size as possible, so a boundary can fall between two rows that happen to share a value, and value based cutoffs need explicit thresholds instead.'),
        ]
      ),
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
        `,
        [
          q('The profiling query computes COUNT(*) - COUNT(city) AS missing_city. Why does that expression give you the number of customers with no city?', [
            'COUNT(city) ignores NULLs, so the gap between it and COUNT(*) is the rows with no city',
            'COUNT(city) returns distinct cities, so the difference is the number of repeated cities',
            'COUNT(*) skips any row that holds a NULL in any column, so the gap is exactly those rows',
            'COUNT(city) treats empty strings and NULL alike, so the difference counts the blank rows',
          ], 0, 'COUNT applied to a column counts only non-NULL values, while COUNT(*) counts every row, so subtracting one from the other leaves the rows where city is missing.'),
          q('staging_products.price_text holds values like \'45.00\', \'\' and \'N/A\'. What happens if you run CAST(TRIM(price_text) AS NUMERIC) across the column?', [
            'The blank rows are skipped quietly and only the \'N/A\' rows raise an error',
            'Every value casts, and the ones that are not numbers are stored as zero instead',
            'The cast raises an error on the empty string and the whole statement fails',
            'Both the blank and the \'N/A\' rows become NULL, and the rest cast normally',
          ], 2, 'An empty string is not a valid numeric literal, so the cast errors and takes the entire query with it, which is why NULLIF(TRIM(price_text), \'\') is applied first and why non-numeric text has to be found before casting.'),
          q('In the dedup CTE the window is PARTITION BY LOWER(TRIM(email)) ORDER BY signup_date ASC. You change the ORDER BY to signup_date DESC. What changes in the rows that WHERE rn = 1 returns?', [
            'Nothing changes, because rn = 1 always returns the earliest matching row',
            'The surviving copy becomes the newest signup for that email rather than the oldest',
            'Rows are now grouped by signup date instead of by the normalised email',
            'Emails that appear once are dropped and only the duplicated ones survive',
          ], 1, 'PARTITION BY defines what counts as the same person and ORDER BY decides which copy gets rn = 1, so reversing the order keeps the freshest contact details instead of the oldest account.'),
        ]
      ),
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
        `,
        [
          q('You have an index on orders (customer_id, order_date). A report filters only on WHERE order_date >= DATE \'2024-06-01\'. What should you expect?', [
            'It runs fast, since order_date is one of the indexed columns',
            'It errors, because the planner requires the leading column to be present',
            'The index is little help, because it is sorted by customer_id first',
            'It runs fast only if the query also adds ORDER BY customer_id',
          ], 2, 'A composite index is sorted by its first column and then the second, like a phone book ordered by surname, so a filter on the second column alone has no starting point to seek to.'),
          q('After creating an index, the plan line for the same query changes from Filter: to Index Cond:. Why does that distinction matter?', [
            'Index Cond guarantees the rows also come back in the index order',
            'Filter runs before the scan starts, while Index Cond runs after it',
            'Index Cond appears only once the table statistics have been refreshed',
            'The index is now picking the rows out, rather than the engine reading them and throwing most away',
          ], 3, 'Filter means the condition was applied to rows already read off the table, while Index Cond means the index itself located the rows, which is what removes the wasted work shown by Rows Removed by Filter.'),
          q('A query filters WHERE order_date + INTERVAL \'1 day\' > NOW() and the index on order_date goes unused. What is the correct fix?', [
            'Rewrite it as order_date > NOW() - INTERVAL \'1 day\' so the column stays bare',
            'Create a second index on the NOW() side so both sides of the comparison match',
            'Cast order_date to text so that the two sides share one common type',
            'Move the arithmetic into the ORDER BY, where the index can still be used',
          ], 0, 'An index stores the raw column values, so any arithmetic or function wrapped around the column has to be computed per row; moving the maths onto the constant side keeps the indexed column directly comparable.'),
        ]
      ),
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
        `,
        [
          q('The revenue by city query LEFT JOINs per_customer onto customers. Someone changes it to an inner join. What happens to the result?', [
            'Revenue totals rise, because every customer now contributes twice',
            'Madrid and Singapore disappear, since neither has a paid order behind it',
            'The repeat_buyers column becomes NULL for every city in the output',
            'Only the ordering changes, because the numbers were already correct',
          ], 1, 'An inner join keeps only customers that matched per_customer, so cities whose customers never placed a paid order drop out of a report that was explicitly asked to cover all cities.'),
          q('order_items.unit_price copies the price from products at the moment of sale. Why is that not a normalisation failure?', [
            'Numeric columns are exempt from the normal forms by convention',
            'order_items already uses a composite key, which satisfies the rule',
            'The two columns record different facts: price charged then, price listed now',
            'The copy is deleted automatically whenever the catalogue price changes',
          ], 2, 'Duplication only breaks normalisation when the two copies are meant to state the same fact, and here one is a historical record while the other is the current catalogue value.'),
          q('In the final query, COUNT(*) in the outer SELECT counts customers rather than order lines. What makes that true?', [
            'The per_customer CTE already collapsed each customer down to a single row',
            'COUNT(*) ignores any rows that a LEFT JOIN added to the result',
            'GROUP BY c.city strips duplicate rows out before the count runs',
            'COUNT(*) counts distinct values automatically when a CTE is involved',
          ], 0, 'Each one-to-many relationship was aggregated away in its own layer, so by the time customers is joined to per_customer the relationship is one to one and each customer contributes exactly one row.'),
        ]
      ),
            lesson('Constraints: Making Bad Rows Impossible', 13, `
A refund report shows an order line with \`quantity = -3\`, and store revenue for that quarter is 240.00 lower than the payment processor says it should be. Someone typed a negative quantity into an admin form eight months ago. Lesson 5.1 can clean that row today. A constraint would have refused it in December, and the report would never have been wrong at all.

### The database is the last place a bad row can be stopped

The web form validates. So does the API, the nightly import, and the mobile client written by a contractor who left in March. Every one of those is a place the rule can be forgotten or reimplemented slightly differently. A constraint lives with the data, so it applies to all of them, plus the person running a hand written \`UPDATE\` at 6pm on a Friday.

\`\`\`sql
ALTER TABLE order_items
  ADD CONSTRAINT order_items_qty_positive CHECK (quantity > 0);

ALTER TABLE products
  ADD CONSTRAINT products_price_nonneg CHECK (unit_price >= 0);

ALTER TABLE orders
  ADD CONSTRAINT orders_status_known
  CHECK (status IN ('pending', 'paid', 'refunded'));
\`\`\`

The bad insert now fails at the place it happens:

\`\`\`text
ERROR:  new row for relation "order_items" violates check constraint
        "order_items_qty_positive"
DETAIL:  Failing row contains (1006, 12, -3, 340.00).
\`\`\`

Name your constraints. PostgreSQL invents \`order_items_check1\` if you do not, and a support ticket quoting that name tells nobody anything.

### The NULL hole in every CHECK

This one catches experienced people. A \`CHECK\` rejects a row only when the condition evaluates to **false**. NULL is not false, it is unknown, so the row goes straight through:

\`\`\`sql
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1006, 12, NULL, 340.00);      -- accepted: NULL > 0 is unknown
\`\`\`

\`CHECK (quantity > 0)\` and \`quantity INTEGER NOT NULL\` are two different rules, and you almost always want both. The same trap sits in \`status IN ('pending', 'paid', 'refunded')\`: a NULL status sails past the list.

### UNIQUE does not mean "at most one of these"

\`\`\`sql
INSERT INTO customers (customer_id, name, email, signup_date)
VALUES (7, 'Sana Raza', NULL, DATE '2024-08-02');
INSERT INTO customers (customer_id, name, email, signup_date)
VALUES (8, 'Omar Vaz',  NULL, DATE '2024-08-03');
-- both succeed, even though customers has UNIQUE (email)
\`\`\`

Two NULLs are not equal to each other, so a unique index accepts as many of them as you care to insert. If an email is genuinely required, \`NOT NULL\` is the constraint doing that job, not \`UNIQUE\`.

There is a related problem once soft deletes exist (lesson 6.1). A plain \`UNIQUE (email)\` stops a deleted customer from ever signing up again with the same address, because the old row is still sitting there. A partial unique index scopes the rule to live rows only:

\`\`\`sql
CREATE UNIQUE INDEX customers_email_live
  ON customers (LOWER(TRIM(email)))
  WHERE deleted_at IS NULL;
\`\`\`

That index also normalises case and spacing, so \`' Ayesha@Shop.com'\` can no longer sneak in beside \`ayesha@shop.com\`.

### Defaults belong in the schema too

\`\`\`sql
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE customers
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
\`\`\`

A default plus \`NOT NULL\` means no caller can forget the column. Use \`TIMESTAMPTZ\` rather than \`TIMESTAMP\`, because a plain timestamp forgets which zone it was written in, and your Lahore application server and your Frankfurt replica will then disagree about which day an order landed on.

### What a CHECK cannot do

| Rule | Where it belongs |
|---|---|
| \`quantity > 0\` | CHECK, one row is enough |
| \`unit_price\` agrees with \`products\` | Not a CHECK, it reads another table |
| Order total equals the sum of its lines | Not a CHECK, it reads other rows |
| Every order line has a real order | FOREIGN KEY |

A \`CHECK\` sees one row and nothing else. Rules that span rows or tables become assertions you run on a schedule (lesson 7.2), not constraints.

Add a constraint to an existing table and the \`ALTER TABLE\` scans every row, so it fails loudly if the data already breaks the rule. That failure is the useful part: it tells you how long you have been shipping a wrong number.
      `,
        [
          q('customers has UNIQUE (email). Two rows are inserted with email set to NULL. What happens?', [
            'The second insert fails with a duplicate key violation on email',
            'The second insert succeeds but stores an empty string instead of NULL',
            'Both fail, because a unique column cannot accept NULL at all',
            'Both succeed, because two NULLs are not considered equal to each other',
          ], 3, 'A unique index compares values, and NULL compared to NULL is unknown rather than equal, so any number of NULL emails can coexist and only NOT NULL can make the column mandatory.'),
          q('order_items has CHECK (quantity > 0). An import inserts a row with quantity set to NULL. What does the database do?', [
            'It rejects the row, since NULL fails the greater than comparison',
            'It accepts the row, because NULL > 0 is unknown rather than false',
            'It accepts the row and rewrites the NULL quantity as zero',
            'It rejects the row and reports a not null violation on quantity',
          ], 1, 'A CHECK constraint only blocks a row when its condition evaluates to false, and a comparison against NULL evaluates to unknown, so NOT NULL has to be declared separately to close the gap.'),
          q('Which of these business rules can NOT be enforced with a CHECK constraint on order_items?', [
            'quantity must always be greater than zero for every line',
            'unit_price must never be stored as a negative amount',
            'quantity multiplied by unit_price must not exceed 100000',
            'unit_price must match the current price in the products table',
          ], 3, 'A CHECK constraint can only see the columns of the single row being written, so a rule that has to read another table belongs to a foreign key or to a scheduled assertion instead.'),
        ]
      ),
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
        `,
        [
          q('You run UPDATE order_items oi SET unit_price = (SELECT p.unit_price FROM products p WHERE p.product_id = oi.product_id) with no WHERE clause. What happens to lines whose product_id is not in products?', [
            'They are left untouched, because the subquery matched nothing for them',
            'The statement aborts with a subquery returned no rows error',
            'Their unit_price is set to NULL, because the subquery returns NULL',
            'They keep the old price until the transaction is committed',
          ], 2, 'A scalar subquery that finds no row evaluates to NULL, and setting a column to NULL is a perfectly legal update, so the prices are wiped unless the statement adds WHERE EXISTS to restrict it to rows that matched.'),
          q('Your SELECT with a given WHERE returned 2 rows. You copy that WHERE into an UPDATE and it reports UPDATE 47. What should you conclude?', [
            'Foreign keys cascaded the change into 45 additional related rows',
            'UPDATE counts each modified row once per index it has to maintain',
            '47 is the number of rows scanned, while 2 rows were actually changed',
            'The WHERE that ran is not the one you inspected, so stop and roll back',
          ], 3, 'The whole point of checking with a SELECT first is that the two row counts must agree, so a mismatch means the statement you executed differs from the one you verified and the change should be undone before anything else happens.'),
          q('Why is ON DELETE CASCADE reasonable on order_items.order_id but a bad idea on orders.customer_id?', [
            'Cascades are only permitted where the child table has a composite key',
            'Deleting a customer would take their orders and the revenue history with them',
            'customer_id is nullable while order_id is not, so the cascade cannot fire',
            'A cascade from orders would conflict with the unique index on email',
          ], 1, 'An order line has no meaning without its order, so cascading there is harmless, whereas an order remains a real historical fact after a customer record is removed and silently deleting it destroys reporting history.'),
        ]
      ),
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
        `,
        [
          q('A report is built from six separate queries run at READ COMMITTED. Under heavy write traffic its subtotals stop adding up to its total. What explains that?', [
            'The six queries were executed in the wrong order by the reporting tool',
            'Each statement takes a fresh snapshot, so the six queries saw six different states',
            'READ COMMITTED lets each query see the uncommitted writes of other sessions',
            'The subtotals were computed with COUNT where SUM was required',
          ], 1, 'READ COMMITTED gives every statement its own snapshot, so a multi query report can straddle several commits, which is why such a report should run inside one REPEATABLE READ transaction.'),
          q('Session A locks order 1001 then 1002 while session B locks 1002 then 1001, and PostgreSQL reports deadlock detected and kills one of them. What is the right response?', [
            'Rebuild the index on orders, because a deadlock indicates corruption',
            'Move both sessions to READ COMMITTED so that neither one has to wait',
            'Retry the killed transaction, and take row locks in a consistent order',
            'Raise the lock timeout so that both sessions eventually get through',
          ], 2, 'A deadlock is the database breaking a genuine cycle rather than a sign of damage, so the loser simply retries, and ordering the rows you touch, for example with ORDER BY order_id, stops the cycle forming again.'),
          q('You type BEGIN;, run one SELECT, then go to lunch without committing. What harm does that idle transaction do?', [
            'It pins a snapshot, so VACUUM cannot reclaim dead rows and tables bloat',
            'It commits itself after a timeout, applying whatever work it had done',
            'It escalates to a table level lock that blocks every other reader',
            'It resets the isolation level used by all other open sessions',
          ], 0, 'An open transaction holds a snapshot that might still need old row versions, so VACUUM cannot clean them up, and the resulting bloat plus the held locks is why idle in transaction sessions are worth hunting in pg_stat_activity.'),
        ]
      ),
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
        `,
        [
          q('Reprocessing yesterday\'s customer file stamps yesterday\'s city back over a correction made this morning. Which change to the upsert prevents that?', [
            'Switch DO UPDATE to DO NOTHING so existing rows are never modified',
            'Add WHERE EXCLUDED.updated_at > customers.updated_at to the DO UPDATE',
            'Run the whole load inside a REPEATABLE READ transaction',
            'Create a second unique index on the updated_at column',
          ], 1, 'The WHERE clause on DO UPDATE makes the write conditional on the incoming row genuinely being newer, so an out of order replay is ignored rather than silently reverting a correction.'),
          q('One batch contains the same email twice and the upsert fails with \'ON CONFLICT DO UPDATE command cannot affect row a second time\'. What is the fix?', [
            'Wrap the insert in its own transaction and retry it once',
            'Drop the unique index on email so that no conflict can be raised',
            'Replace ON CONFLICT with MERGE and leave the batch exactly as it is',
            'Deduplicate the batch first with DISTINCT ON or ROW_NUMBER on the key',
          ], 3, 'A single statement cannot update the same target row twice, so the duplicate has to be resolved in the source where you can still see which copy you kept and why.'),
          q('An incremental load tracks updated_at rather than created_at and re-reads a deliberate one hour overlap. What problem does that pairing solve?', [
            'created_at columns are rarely indexed, so the overlap makes the read faster',
            'It allows the load to run inside one transaction instead of several',
            'Edited rows keep their created_at, and the overlap re-reads what the boundary skipped',
            'It removes the need for the target table to have a unique constraint',
          ], 2, 'Filtering on created_at never sees a row that was edited after it was first written, and a strict watermark boundary drops rows sharing the exact timestamp, so an overlap plus an idempotent upsert catches both without creating duplicates.'),
        ]
      ),
            lesson('Schema Changes on a Live Table', 13, `
The migration was one line, and it took checkout down for forty seconds:

\`\`\`sql
ALTER TABLE orders ADD COLUMN currency TEXT NOT NULL DEFAULT 'PKR';
\`\`\`

On PostgreSQL 11 and later that statement is metadata only. It rewrites nothing and finishes in about two milliseconds, even on forty million rows. It still took the site down.

### The lock queue is what actually hurts

\`ALTER TABLE\` needs an \`ACCESS EXCLUSIVE\` lock. A nightly export was already holding a read lock on \`orders\`, so the migration joined the queue and waited. Here is the part nobody expects: **every query that arrives after it queues behind it too**, including ordinary SELECTs that would have run happily alongside the export. One patient statement stalls the entire table.

So refuse to wait:

\`\`\`sql
SET lock_timeout = '3s';
ALTER TABLE orders ADD COLUMN currency TEXT NOT NULL DEFAULT 'PKR';
-- ERROR: canceling statement due to lock timeout
\`\`\`

Failing after three seconds and retrying at 02:00 is a non event. Waiting sixty seconds with the whole application queued behind you is an incident. Set \`lock_timeout\` at the top of every migration.

### Cheap operations and expensive ones

| Operation | Cost on a large table |
|---|---|
| \`ADD COLUMN\` with a constant default | Metadata only, instant on PG 11+ |
| \`ADD COLUMN\` with a volatile default like \`NOW()\` | Full table rewrite |
| \`SET NOT NULL\` on an existing column | Full scan under the lock |
| \`varchar(50)\` widened to \`varchar(100)\` | Metadata only |
| \`integer\` changed to \`bigint\` | Full table rewrite |
| \`ADD CONSTRAINT ... CHECK\` | Full scan under the lock |
| \`ADD CONSTRAINT ... CHECK ... NOT VALID\` | Instant, validate separately |

That last pair is the pattern worth memorising:

\`\`\`sql
ALTER TABLE order_items
  ADD CONSTRAINT order_items_qty_positive CHECK (quantity > 0) NOT VALID;

ALTER TABLE order_items VALIDATE CONSTRAINT order_items_qty_positive;
\`\`\`

The first statement is instant and enforces the rule on every new and updated row from that moment. The second scans the existing rows, but under a weaker lock that lets writes carry on.

### CREATE INDEX CONCURRENTLY, and the invalid index

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_currency ON orders (currency);
\`\`\`

A plain \`CREATE INDEX\` blocks writes for its whole duration, which on a busy \`orders\` table means checkout stops for as long as the build takes. \`CONCURRENTLY\` builds in two passes without blocking writes. It costs more total time, and it cannot run inside a transaction block, so your migration tool has to be told to run that one statement outside its usual wrapper.

The trap comes when a concurrent build fails halfway. PostgreSQL leaves behind an **invalid** index: the planner will not use it, but every write still maintains it. You pay the whole cost and get nothing back.

\`\`\`sql
SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;
DROP INDEX CONCURRENTLY idx_orders_currency;   -- then build it again
\`\`\`

### Backfill in batches

\`\`\`sql
-- Blocks and bloats: five million rows in one lock, one huge transaction
UPDATE orders SET currency = 'PKR' WHERE currency IS NULL;

-- Run this until it reports 0 rows
UPDATE orders SET currency = 'PKR'
WHERE order_id IN (
  SELECT order_id FROM orders WHERE currency IS NULL
  ORDER BY order_id LIMIT 10000
);
\`\`\`

Each batch commits on its own, so locks are released between batches, \`VACUUM\` keeps up with the dead rows, and a failure at batch 300 costs you ten thousand rows of work rather than an hour of it.

### Renaming without breaking the running application

\`ALTER TABLE customers RENAME COLUMN city TO city_name;\` is instant, and it is still an outage, because the deployed code is still asking for \`city\`. Migrations and deploys are never simultaneous, so one of them always runs against the other's schema. Expand and contract instead:

1. Add \`city_name\`, nullable, in its own migration.
2. Deploy code that writes both columns and still reads \`city\`.
3. Backfill \`city_name\` in batches.
4. Deploy code that reads \`city_name\`.
5. Drop \`city\` weeks later, once nothing references it.

Five steps instead of one, no downtime, and every step is individually reversible. That last property is the thing you are actually buying.
      `,
        [
          q('A CREATE INDEX CONCURRENTLY run is interrupted halfway through. What state is the table left in?', [
            'An invalid index exists: unused by the planner, still maintained on every write',
            'The index is rolled back completely, leaving the table exactly as it was',
            'A partial index exists that covers only the rows scanned before the failure',
            'The table is left with a write lock that must be cleared manually',
          ], 0, 'A failed concurrent build leaves the index marked invalid, which is the worst of both outcomes because writes keep paying to maintain it while queries cannot use it, so it has to be found in pg_index and dropped before rebuilding.'),
          q('You need to rename customers.city to city_name. Why is a single RENAME COLUMN migration an outage even though the statement itself is instant?', [
            'RENAME COLUMN takes an exclusive lock for the length of a full table scan',
            'Renaming invalidates every index on the table until they are rebuilt',
            'The old column name is cached by the planner until the database restarts',
            'The application already deployed is still querying the old name and starts failing',
          ], 3, 'Schema changes and code deploys never land at the same instant, so between them one version of the application is talking to the other version of the schema, which is why expand and contract adds the new column first and drops the old one only after the code has moved.'),
          q('You want to add CHECK (quantity > 0) to a large order_items table without blocking writes for the duration of the scan. What do you do?', [
            'Add the constraint inside an explicit transaction with a long lock_timeout',
            'Add it NOT VALID first, then run VALIDATE CONSTRAINT as a separate statement',
            'Create an index on quantity first so that the constraint scan can use it',
            'Add the constraint on a replica and let it propagate back to the primary',
          ], 1, 'NOT VALID registers the rule instantly so new and updated rows are checked immediately, and the separate VALIDATE step scans the existing rows under a weaker lock that still allows writes.'),
        ]
      ),
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
        `,
        [
          q('A view groups orders per customer. Filtering it on customer_id is instant, but filtering on the aggregated order_value takes minutes. What explains the difference?', [
            'order_value is computed, so no index of any kind can ever serve it',
            'customer_id is a grouping column so that filter pushes down, while an aggregate result cannot',
            'Views push down a filter only when it names the first column of the definition',
            'The planner refuses to inline any view whose definition contains GROUP BY',
          ], 1, 'A filter on a grouping column can be applied to the base scan before aggregation, but a filter on an aggregate result cannot be evaluated until the whole aggregation has run, so the entire table is processed first.'),
          q('You want to drop a column from an existing view that three other views read. What does CREATE OR REPLACE VIEW do?', [
            'It succeeds, and the dependent views quietly lose the column too',
            'It succeeds, but the removed column returns NULL for every row',
            'It fails, because replace cannot drop, rename, or reorder existing columns',
            'It fails, because a view with any dependents can never be replaced',
          ], 2, 'CREATE OR REPLACE VIEW can only add new columns at the end while keeping grants and dependents intact, so removing one means dropping the dependent objects first and recreating them.'),
          q('Why should a BI tool be pointed at the mart layer only, rather than at the raw and clean tables?', [
            'Mart objects are always materialised, so they respond faster than views',
            'The raw and clean layers cannot carry indexes of their own',
            'Grants cannot be issued on anything other than the mart schema',
            'A renamed source column then breaks one owned view instead of eleven dashboards',
          ], 3, 'Layering puts a single owned boundary between the source system and everything people build on top, so upstream changes surface in one place you control rather than scattered across dashboards nobody remembers creating.'),
        ]
      ),
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
        `,
        [
          q('Why is SELECT COUNT(*) FROM products WHERE unit_price <= 0 a poor way to write a data quality check?', [
            'It always returns exactly one row, so nothing can tell a pass from a failure',
            'COUNT(*) is too slow to run on a schedule against a large products table',
            'The result is a number rather than an error, so the database will not log it',
            'It cannot be combined with the freshness and volume checks in the same run',
          ], 0, 'Under the zero rows convention the presence of output is the signal, so a query that always returns a row forces a human to read and interpret a number, which means in practice nobody does.'),
          q('Which failure does the daily volume check catch that the grain test and the orphan test both miss?', [
            'A duplicate (order_id, product_id) pair created by a double load',
            'A pipeline that loaded only half of yesterday, where every row present is valid',
            'An order_items row whose parent order was deleted from the source',
            'A price column that arrived as text and was never cast to numeric',
          ], 1, 'A partial load produces nothing structurally wrong: every row is well formed and every key resolves, so only comparing the day\'s row count against recent days reveals that rows are missing.'),
          q('The freshness check is written as SELECT MAX(order_date) FROM orders HAVING MAX(order_date) < CURRENT_DATE - 2, with no GROUP BY. Why does that work?', [
            'HAVING is the only clause in which MAX may legally be referenced',
            'Without GROUP BY the query returns all rows, which HAVING then filters',
            'The whole table is one group, so it returns a row when stale and none when fresh',
            'GROUP BY order_date would be far slower on a large orders table',
          ], 2, 'An aggregate with no GROUP BY treats the entire table as a single group, so HAVING either lets that one summary row through or suppresses it, which is exactly the zero rows means healthy convention.'),
        ]
      ),
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
        `,
        [
          q('You granted SELECT ON ALL TABLES IN SCHEMA mart to analytics_ro. Next month a newly created model is invisible to that role. Why?', [
            'GRANT ON ALL TABLES applies only to the tables that existed when it ran',
            'New tables inherit privileges only after the next ANALYZE on the schema',
            'The role needs its CONNECT privilege on the database granted again',
            'USAGE on a schema lapses whenever an object is added to that schema',
          ], 0, 'ON ALL TABLES is a one time expansion over the current contents of the schema, which is why ALTER DEFAULT PRIVILEGES is needed to cover objects created later.'),
          q('Why does passing an email as $1 defeat the input x\' OR 1=1 -- when carefully escaping the quotes yourself does not?', [
            'The driver strips SQL keywords out of every parameter before sending it',
            'Parameters are validated against the column type, which rejects quote characters',
            'The statement is parsed before the value is seen, so input can only ever be data',
            'The driver hashes the value and compares the hash against the index entries',
          ], 2, 'Parameterisation sends the statement and the values separately, so the parse tree is fixed before the input arrives and the text is looked up as an email address rather than becoming part of the query.'),
          q('An endpoint fetches 200 orders, then runs one query per order to fetch its lines, and the connection pool is exhausted under load. What is the underlying problem?', [
            'The pool is too small and should hold one connection for each request',
            'The individual queries need a longer statement_timeout to complete',
            'Connections should be opened per request instead of being pooled at all',
            'It is an N+1 pattern: a join that has not been written as a join',
          ], 3, 'Two hundred round trips do the work that one join over order_items would do in a single statement, so the fix is to write the join rather than to enlarge the pool or extend the timeouts.'),
        ]
      ),
            lesson('Finding the Query That Is Hurting You', 13, `
Every weekday at 09:40 the database sits at 90% CPU for six minutes. Nothing was deployed. The dashboards are slow, the checkout is slow, and three people are guessing in a chat thread about which report is to blame. Guessing costs you a morning. Ranking costs you one query.

### Rank by total time, not by slowest

Turn on \`pg_stat_statements\`, then ask the database which statements are actually consuming the server:

\`\`\`sql
SELECT calls,
       ROUND(mean_exec_time::numeric, 2)          AS mean_ms,
       ROUND(total_exec_time::numeric / 1000, 1)  AS total_s,
       LEFT(query, 60)                            AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
\`\`\`

\`\`\`text
 calls  | mean_ms | total_s | query
--------+---------+---------+------------------------------------------
 412039 |    0.84 |   346.1 | SELECT * FROM order_items WHERE order_id =
     12 | 4210.00 |    50.5 | SELECT c.city, SUM(oi.quantity * oi.unit_
   1804 |   19.60 |    35.4 | UPDATE products SET stock = stock - $1 WH
\`\`\`

The four second report everybody complains about is second. The real load is a query that takes under a millisecond and runs four hundred thousand times, which is the N+1 pattern from lesson 7.3 seen from the database side. Sort by \`mean_exec_time\` and you would have spent the day optimising the wrong statement.

Two details make this view trustworthy. Constants are normalised into \`$1\`, so a thousand variations of the same query collapse into one row you can reason about. And the counters are cumulative since the last restart, so take a baseline, wait, and diff, or call \`pg_stat_statements_reset()\` and watch a clean ten minutes.

### What is running right now

\`pg_stat_statements\` is history. \`pg_stat_activity\` is the present moment:

\`\`\`sql
SELECT pid, state, wait_event_type, wait_event,
       NOW() - query_start AS running_for,
       LEFT(query, 50) AS query
FROM pg_stat_activity
WHERE state <> 'idle' AND backend_type = 'client backend'
ORDER BY query_start;
\`\`\`

| state | wait_event_type | Reading |
|---|---|---|
| \`active\`, no wait | none | Genuinely computing, look at the plan |
| \`active\` | \`Lock\` | Blocked by another session, find the blocker |
| \`active\` | \`IO\` | Reading from disk, likely a scan that misses cache |
| \`idle in transaction\` | none | A session holding a snapshot open, see lesson 6.2 |

When the wait is \`Lock\`, stop reading the query and find who is holding it:

\`\`\`sql
SELECT pid, pg_blocking_pids(pid), LEFT(query, 60)
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
\`\`\`

That usually names one long transaction at the head of a queue of forty. Kill the head, not the queue.

\`\`\`sql
SELECT pg_cancel_backend(48211);      -- cancel the query, session survives
SELECT pg_terminate_backend(48211);   -- drop the whole connection
\`\`\`

Try \`pg_cancel_backend\` first. \`pg_terminate_backend\` rolls the transaction back and disconnects the client, which some connection pools handle badly.

### The tail that averages hide

A mean of 40ms can be nine hundred runs at 3ms and one run at 30 seconds, and it is the 30 second run that times out someone's checkout. Log the slow ones individually:

\`\`\`sql
ALTER DATABASE shop SET log_min_duration_statement = '2s';
\`\`\`

Every statement over two seconds now lands in the log with its parameters and its duration. Add the \`auto_explain\` module and the plan lands there as well, so you see the plan that ran in production at 09:40 rather than the plan you get when you retry the query at 3pm against a warm cache and different statistics.

### Then look at the tables

\`\`\`sql
SELECT relname, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables ORDER BY seq_tup_read DESC LIMIT 5;
\`\`\`

A table with a high \`seq_scan\` count and a near zero \`idx_scan\` is telling you an index is missing, or that nothing was ever written to use one. Pair that with the top statement from \`pg_stat_statements\` and you have a specific query, a specific table, and a defensible reason to add an index.

Rank, confirm on the live view, fix one thing, then reset the counters and measure again. That loop turns "the database is slow" into a number that moved.
      `,
        [
          q('pg_stat_statements shows a 0.84ms query with 412,039 calls above a 4.2 second report with 12 calls. Which should you work on, and why?', [
            'The 0.84ms query, because its total_exec_time on the server is roughly seven times larger',
            'The 4.2 second report, because per call latency is what users actually experience',
            'Neither, because a sub millisecond query cannot meaningfully load a server',
            'The 4.2 second report, because low call counts point to a missing index',
          ], 0, 'Server load is call count multiplied by cost per call, so the cheap statement running four hundred thousand times consumes far more of the database than the slow report that runs a dozen times.'),
          q('You read pg_stat_statements once, fix nothing, and read it again an hour later. The totals are larger. What do you need to do to measure the effect of a change?', [
            'Nothing, because the view already reports only the last hour of activity',
            'Take a baseline and diff it, or call pg_stat_statements_reset() to start clean',
            'Restart the database, since the counters cannot be cleared any other way',
            'Query the view inside a REPEATABLE READ transaction to freeze the counters',
          ], 1, 'The counters accumulate since the last reset or restart, so a single reading mixes yesterday\'s traffic with today\'s and only a difference between two points, or a deliberate reset, isolates the window you care about.'),
          q('pg_stat_activity shows a session with state \'active\' and wait_event_type \'Lock\' that has been running for four minutes. What is the right next step?', [
            'Run EXPLAIN ANALYZE on that query, since it is clearly the expensive one',
            'Terminate that session, because it is the one holding up all the others',
            'Add an index on the table it names, since Lock waits indicate a missing index',
            'Use pg_blocking_pids to find the session holding the lock, and deal with that one',
          ], 3, 'A Lock wait means the session is doing no work at all and is queued behind somebody else, so the query itself is innocent and the fix has to start with whichever transaction sits at the head of the queue.'),
        ]
      ),
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
      chapter(
      'Questions That Do Not Fit a GROUP BY',
      'The analysis people start asking once they trust your models, from subtotals in a single pass to retention curves built out of raw event logs.',
      [
      lesson('GROUPING SETS, ROLLUP, and Subtotals in One Pass', 13, `
The Friday board report needs revenue by country and category, then a subtotal per country, then one grand total. It was written as three queries stacked with \`UNION ALL\`, so \`order_items\` gets scanned three times and the whole thing takes 18 seconds. The database can produce all three levels from a single scan. You have to ask for them together.

### One query, three levels of grouping

\`\`\`sql
SELECT c.country,
       p.category,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders o
JOIN customers   c  ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
WHERE o.status = 'paid'
GROUP BY GROUPING SETS ((c.country, p.category), (c.country), ());
\`\`\`

Each element of that list is a complete \`GROUP BY\` clause of its own. \`(c.country, p.category)\` gives the detail rows, \`(c.country)\` gives the per country subtotals, and \`()\` is the empty grouping set: no columns, one row, the grand total.

\`\`\`text
 country  | category  | revenue
----------+-----------+-----------
 Pakistan | Keyboards |  48200.00
 Pakistan | Monitors  | 112750.00
 Pakistan | NULL      | 160950.00   <- country subtotal
 UAE      | Keyboards |  21400.00
 UAE      | NULL      |  21400.00   <- country subtotal
 NULL     | NULL      | 182350.00   <- grand total
\`\`\`

\`ROLLUP\` and \`CUBE\` are shorthand for common shapes. \`ROLLUP(country, category)\` expands to exactly the three sets above, a hierarchy peeled from the right. \`CUBE(country, category)\` adds \`(category)\` on its own, giving every combination. The shorthand hides a cost: \`CUBE\` over five columns is 32 grouping sets, and the server aggregates the same input 32 times.

### The NULL that lies to you

Read that output again. The Pakistan subtotal row carries \`NULL\` in \`category\`. So does a genuine detail row for a product whose category was never filled in. Downstream nothing can tell them apart, and a pivot table quietly counts one of them twice.

\`GROUPING()\` returns 1 when the column was rolled up in that row and 0 when the value is real:

\`\`\`sql
SELECT CASE WHEN GROUPING(c.country) = 1 THEN 'All countries'
            ELSE COALESCE(c.country, 'Unknown') END AS country,
       CASE WHEN GROUPING(p.category) = 1 THEN 'All categories'
            ELSE COALESCE(p.category, 'Uncategorised') END AS category,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders o
JOIN customers   c  ON c.customer_id = o.customer_id
JOIN order_items oi ON oi.order_id   = o.order_id
JOIN products    p  ON p.product_id  = oi.product_id
WHERE o.status = 'paid'
GROUP BY ROLLUP (c.country, p.category)
ORDER BY GROUPING(c.country), c.country,
         GROUPING(p.category), p.category;
\`\`\`

Two problems die there. Missing data reads \`'Unknown'\` while rolled up rows read \`'All countries'\`, so the two can never be confused again. And sorting by \`GROUPING()\` first puts each subtotal directly under its own detail rows, instead of letting \`NULL\` drift to whichever end your engine sorts nulls to.

### Filtering after the fact

\`HAVING\` runs after grouping, so it sees the subtotal and total rows too. \`HAVING SUM(oi.quantity * oi.unit_price) > 50000\` will cheerfully delete a country's detail rows while keeping that country's subtotal, and the report stops adding up. When you want the totals only, filter on the flag instead of the value:

\`\`\`sql
HAVING GROUPING(p.category) = 1
\`\`\`

### What you actually save

| Approach | Scans of order_items | Risk |
|---|---|---|
| Three queries with UNION ALL | 3 | branches drift apart when edited |
| ROLLUP in one statement | 1 | one WHERE clause, one truth |

The I/O saving is nice. The second column is the real prize. Stacked queries rot separately: somebody adds \`AND o.order_date >= DATE '2026-01-01'\` to two of the three branches, the totals stop matching the details, and nobody notices for a quarter.

Support is broad but uneven. PostgreSQL, SQL Server, Oracle and BigQuery accept all three constructs. MySQL 8 offers \`GROUP BY ... WITH ROLLUP\` only. SQLite has none of them, so there you are back to stacking queries and being careful.
      `,
        [
          q('A ROLLUP report shows a row with NULL in the category column and revenue of 160950. How do you tell whether that is a subtotal or a real row for products with no category?', [
            'Check whether its revenue exceeds every other row for that country',
            'Compare row counts, since subtotals are always emitted last',
            'Call GROUPING(p.category), which returns 1 only for rolled up rows',
            'Wrap the category column in COALESCE to replace NULL with a label',
          ], 2, 'GROUPING() reports whether the column was aggregated away in that particular row, returning 1 for a rolled up value and 0 for a genuine one, which is the only reliable way to separate a subtotal from missing data.'),
          q('Why does GROUP BY CUBE over five columns usually cost far more than GROUP BY ROLLUP over the same five columns?', [
            'CUBE builds 32 grouping sets while ROLLUP builds only 6',
            'CUBE must sort the input table once for each column named',
            'CUBE cannot use an index, whereas ROLLUP reads one directly',
            'CUBE re-reads the base tables once per column in its list',
          ], 0, 'CUBE asks for every combination of the listed columns, which is 2 to the power of 5 grouping sets, while ROLLUP only peels the hierarchy from the right and produces one set per level plus the total.'),
          q('A ROLLUP revenue query has HAVING SUM(oi.quantity * oi.unit_price) > 50000 added to it. What goes wrong?', [
            'Subtotal rows disappear because HAVING is applied before grouping',
            'The grand total is recomputed from the surviving rows and reads low',
            'GROUPING() stops returning 1 once rows have been filtered out',
            'Detail rows can be dropped while their subtotal survives, so the report stops adding up',
          ], 3, 'HAVING filters the grouped output row by row, so a small detail row can fail the test while the larger subtotal row that contains it passes, leaving a report whose parts no longer sum to its own totals.'),
        ]
      ),
      lesson('LATERAL Joins and Correlated Top-N Per Group', 13, `
You need the three most recent paid orders for each customer. There are 40,000 customers and 1.2 million orders. The obvious query ranks all 1.2 million rows and then throws 97% of them away:

\`\`\`sql
WITH ranked AS (
  SELECT o.order_id, o.customer_id, o.order_date,
         ROW_NUMBER() OVER (PARTITION BY o.customer_id
                            ORDER BY o.order_date DESC) AS rn
  FROM orders o
  WHERE o.status = 'paid'
)
SELECT * FROM ranked WHERE rn <= 3;
\`\`\`

Correct, and 4.1 seconds, because sorting 1.2 million rows to keep 120,000 is most of the cost.

### A subquery that can see the row beside it

A derived table in \`FROM\` is evaluated on its own, independently of the other tables in the clause, which is why \`WHERE o.customer_id = c.customer_id\` inside one is an error. \`LATERAL\` lifts that restriction: the subquery is re-evaluated for every row of the tables to its left.

\`\`\`sql
SELECT c.customer_id, c.name, r.order_id, r.order_date, r.total
FROM customers c
LEFT JOIN LATERAL (
  SELECT o.order_id, o.order_date,
         SUM(oi.quantity * oi.unit_price) AS total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.customer_id = c.customer_id
    AND o.status = 'paid'
  GROUP BY o.order_id, o.order_date
  ORDER BY o.order_date DESC
  LIMIT 3
) r ON true
ORDER BY c.customer_id, r.order_date DESC;
\`\`\`

On its own that is still slow. Give it the access path it is begging for:

\`\`\`sql
CREATE INDEX orders_recent_paid
  ON orders (customer_id, order_date DESC)
  WHERE status = 'paid';
\`\`\`

Now each of the 40,000 executions walks that index and stops after three rows. 0.3 seconds, and the plan reads \`Index Scan\` with \`rows=3\` under a \`Nested Loop\`.

### ON true is not decoration

\`CROSS JOIN LATERAL\` drops any customer whose subquery returned nothing, exactly like an inner join. Write it that way and your 40,000 customers come back as 38,912, because 1,088 of them have never placed a paid order. \`LEFT JOIN LATERAL ... ON true\` keeps them with nulls in the order columns. The join condition is \`true\` because the real correlation already happened inside, in the \`WHERE\` clause.

The other trap is ordering. \`LATERAL\` sees only tables listed before it. Put \`customers\` after the lateral block and the engine tells you \`column c.customer_id does not exist\`, which sounds like a typo and is actually a clause order problem.

### When the window function still wins

| Situation | Faster |
|---|---|
| Many groups, a few rows wanted per group, matching index | LATERAL |
| Almost every row survives the rank filter | Window function |
| No index on (group key, sort key) | Window function |
| Group keys arrive as a short list, say 20 categories | LATERAL |

The shape to watch is the ratio. 40,000 cheap index probes beat one giant sort. 40,000 sequential scans of a partitioned child table do not. Run \`EXPLAIN ANALYZE\` and read \`loops=\` on the inner node: that number times the per loop cost is your bill.

### The other job LATERAL does

It also lets you name a computed value once and reuse it in the same \`SELECT\`, which plain SQL will not let you do:

\`\`\`sql
SELECT o.order_id, t.total, ROUND(t.total * 0.17, 2) AS sales_tax
FROM orders o
CROSS JOIN LATERAL (
  SELECT SUM(oi.quantity * oi.unit_price) AS total
  FROM order_items oi
  WHERE oi.order_id = o.order_id
) t
WHERE o.status = 'paid';
\`\`\`

Without it you either repeat the \`SUM\` expression twice or wrap the whole query in another layer.

Spelling varies. SQL Server and Oracle call it \`CROSS APPLY\` and \`OUTER APPLY\` with identical semantics. MySQL added \`LATERAL\` in 8.0.14. SQLite has neither, so window functions are the only route there.
      `,
        [
          q('A top three per customer query written with CROSS JOIN LATERAL returns 38,912 customers instead of the expected 40,000. What happened?', [
            'The LIMIT 3 inside the subquery also capped how many customers were read',
            'Customers whose subquery returned no rows were dropped, as an inner join does',
            'CROSS JOIN LATERAL removed customers sharing an identical order date',
            'The correlation clause filtered customers out before the join could run',
          ], 1, 'CROSS JOIN LATERAL behaves like an inner join, so any outer row whose lateral subquery produced zero rows is eliminated, which is why LEFT JOIN LATERAL with ON true is needed to keep customers who have never ordered.'),
          q('Why can a plain derived table in FROM not reference c.customer_id from a table listed before it?', [
            'Derived tables are always materialised to disk before any join begins',
            'The optimiser evaluates entries in the FROM clause in an unspecified order',
            'Correlated references are only permitted inside a WHERE clause subquery',
            'A plain derived table is evaluated independently of the rows next to it',
          ], 3, 'A non lateral derived table is computed as a self contained result set with no knowledge of the other FROM entries, and LATERAL is precisely the keyword that asks for it to be re-evaluated once per row of the tables to its left.'),
          q('Which situation makes the ROW_NUMBER version faster than the LATERAL version of a top N per group query?', [
            'Nearly every row passes the rank filter, so one sorted pass does the work',
            'A partial index on (customer_id, order_date DESC) covers only paid rows',
            'The query needs only the single most recent order for each customer',
            'There are 40,000 customers and each has roughly 30 paid orders',
          ], 0, 'LATERAL wins by skipping rows it never needs, so when the rank filter keeps almost everything there is nothing to skip and the single sorted pass of the window function beats thousands of separate index probes.'),
        ]
      ),
      lesson('Recursive CTEs: Trees, Paths, and Generated Series', 13, `
Finance wants revenue rolled up to top level category. The catalogue tree has \`Peripherals\` above \`Keyboards\` above \`Mechanical\`, and nobody can tell you how deep it goes, so a fixed stack of self joins is a guess that breaks the day merchandising adds a level.

\`\`\`sql
CREATE TABLE product_categories (
  category_id INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  parent_id   INTEGER REFERENCES product_categories(category_id)
);
\`\`\`

### Anchor, then repeat until nothing comes back

\`\`\`sql
WITH RECURSIVE tree AS (
  SELECT category_id, name, parent_id,
         1 AS depth,
         ARRAY[category_id] AS path
  FROM product_categories
  WHERE parent_id IS NULL                    -- anchor: the roots

  UNION ALL

  SELECT c.category_id, c.name, c.parent_id,
         t.depth + 1,
         t.path || c.category_id
  FROM product_categories c
  JOIN tree t ON c.parent_id = t.category_id -- recursive term
)
SELECT path[1] AS root_id, category_id, name, depth
FROM tree
ORDER BY path;
\`\`\`

\`\`\`text
 root_id | category_id | name        | depth
---------+-------------+-------------+-------
      12 |          12 | Peripherals |     1
      12 |          41 | Keyboards   |     2
      12 |          57 | Mechanical  |     3
      12 |          44 | Mice        |     2
      19 |          19 | Displays    |     1
\`\`\`

The anchor runs once. The recursive term then runs against only the rows the previous iteration produced, not the whole accumulated set, and the loop ends when an iteration returns zero rows. \`path[1]\` gives you the root of every node in one column, so grouping revenue by top level category becomes an ordinary \`GROUP BY\`.

### The query that never stops

One bad row is enough. Category 41 lists 44 as its parent, and somebody sets 44's parent to 41. The recursion now generates rows until the temporary files fill the disk. Guard it with the path you are already carrying:

\`\`\`sql
  JOIN tree t ON c.parent_id = t.category_id
 WHERE NOT (c.category_id = ANY(t.path))
\`\`\`

A depth ceiling such as \`AND t.depth < 20\` works too, and PostgreSQL 14 added a \`CYCLE category_id SET is_cycle USING path\` clause that builds the same check for you.

What does not work is swapping \`UNION ALL\` for \`UNION\`, which is the first thing most people try. \`UNION\` removes duplicate rows, but \`depth\` increases on every pass, so no two rows are ever identical and the loop runs exactly as long. It just burns extra CPU sorting on the way.

The recursive term may also reference the CTE name once and only once. \`JOIN tree t1 ... JOIN tree t2\` is rejected. Recurse first, join the finished result in an outer query.

### Rows that do not exist yet

The other use has nothing to do with trees. A daily revenue chart draws a straight line across the quiet week in March because those days have no rows at all, so the chart connects the two days either side and the gap disappears. Generate the days, then join:

\`\`\`sql
SELECT d.day::date AS day,
       COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue
FROM generate_series(DATE '2026-03-01', DATE '2026-03-31',
                     INTERVAL '1 day') AS d(day)
LEFT JOIN orders o      ON o.order_date = d.day
                       AND o.status = 'paid'
LEFT JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY d.day
ORDER BY d.day;
\`\`\`

\`o.status = 'paid'\` has to sit in the \`ON\` clause. Move it into \`WHERE\` and every generated day with no order fails the test, the zero rows vanish, and you are back where you started.

On engines with no \`generate_series\`, build the spine recursively:

\`\`\`sql
WITH RECURSIVE days(day) AS (
  SELECT DATE '2026-03-01'
  UNION ALL
  SELECT day + 1 FROM days WHERE day < DATE '2026-03-31'
)
SELECT day FROM days;
\`\`\`

That pattern also fills a numbers table, expands a quantity of 3 into three rows, and walks any graph where the next step depends on the last: order to replacement order, employee to manager, page to referring page.
      `,
        [
          q('A recursive CTE over product_categories runs until the disk fills because two categories list each other as parent. Which change actually stops it?', [
            'Replace UNION ALL with UNION so repeated rows are discarded each pass',
            'Add ORDER BY depth so the deepest rows are produced last',
            'Carry a path array and reject any child already present in it',
            'Move the parent_id comparison out of the JOIN and into WHERE',
          ], 2, 'The path array records every ancestor already visited on that branch, so testing the candidate child against it refuses to re-enter a node and the recursion terminates at the cycle instead of looping through it forever.'),
          q('Why does swapping UNION ALL for UNION fail to break a cycle in a recursive CTE that also carries a depth column?', [
            'UNION compares only the first column of each row it produces',
            'The depth value changes on every pass, so no two rows are ever duplicates',
            'UNION is applied after the recursion finishes rather than on each pass',
            'Recursive CTEs silently treat UNION as UNION ALL in any case',
          ], 1, 'UNION removes rows that are identical across all columns, and since depth increments with each iteration the same category comes back as a different row every time, so nothing is ever deduplicated and the loop continues.'),
          q('A daily chart joins orders to a generate_series of dates so quiet days show zero revenue. Which edit would make the zero days vanish entirely?', [
            'Moving the status = \'paid\' test from the ON clause into WHERE',
            'Dropping COALESCE so quiet days report NULL rather than zero',
            'Widening the series to cover March and April instead of March',
            'Casting d.day to a date before grouping and ordering on it',
          ], 0, 'A LEFT JOIN supplies NULLs for generated days with no matching order, and a WHERE clause test on a column from the right side rejects those NULL rows, which turns the outer join back into an inner one and deletes the gap days.'),
        ]
      ),
      lesson('Sessions, Funnels, and Retention Cohorts', 13, `
Ask three teams for 30 day retention and you get 41%, 18% and 26%. Nobody is lying. Growth counts anyone who opened the app, finance counts anyone who paid, and the deck counts paid customers against a denominator that quietly excluded people who never activated. The SQL below is the easy part. Agreeing on the denominator is the job.

### Cutting raw events into sessions

\`\`\`sql
CREATE TABLE events (
  event_id    BIGINT PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
  event_name  TEXT NOT NULL,     -- 'view_product', 'add_to_cart', 'checkout'
  occurred_at TIMESTAMPTZ NOT NULL
);
\`\`\`

There is no session column, and there should not be: a session is a reporting decision, not a fact. The usual rule is a 30 minute gap of inactivity.

\`\`\`sql
WITH gaps AS (
  SELECT customer_id, occurred_at, event_name,
         CASE WHEN LAG(occurred_at) OVER w IS NULL
                OR occurred_at - LAG(occurred_at) OVER w > INTERVAL '30 minutes'
              THEN 1 ELSE 0 END AS starts_session
  FROM events
  WINDOW w AS (PARTITION BY customer_id ORDER BY occurred_at)
)
SELECT customer_id, occurred_at, event_name,
       SUM(starts_session) OVER (PARTITION BY customer_id
                                 ORDER BY occurred_at) AS session_no
FROM gaps;
\`\`\`

A running \`SUM\` over a 0 or 1 flag is the standard way to turn "a new group starts here" into a group number: the total only moves at each boundary, so every event in a session shares one value. Thirty minutes is a convention, not a truth. Plot your own gap distribution first, because a support tool and a news app do not have the same natural pause.

### Funnels have to respect order

The tempting version is wrong:

\`\`\`sql
SELECT COUNT(*) FILTER (WHERE event_name = 'view_product') AS viewed,
       COUNT(*) FILTER (WHERE event_name = 'checkout')     AS bought
FROM events;
\`\`\`

That counts somebody who checked out on Monday and browsed on Friday as a conversion, and it counts one restless browser 400 times. Collapse to one row per session, take the first timestamp of each step, and require the steps to be in order:

\`\`\`sql
SELECT COUNT(*)                                      AS sessions,
       COUNT(viewed_at)                              AS step_view,
       COUNT(*) FILTER (WHERE carted_at > viewed_at) AS step_cart,
       COUNT(*) FILTER (WHERE bought_at > carted_at) AS step_buy
FROM (
  SELECT customer_id, session_no,
         MIN(occurred_at) FILTER (WHERE event_name = 'view_product') AS viewed_at,
         MIN(occurred_at) FILTER (WHERE event_name = 'add_to_cart')  AS carted_at,
         MIN(occurred_at) FILTER (WHERE event_name = 'checkout')     AS bought_at
  FROM sessionised          -- the result of the query above
  GROUP BY customer_id, session_no
) s;
\`\`\`

A comparison against \`NULL\` is never true, so a session that never reached the cart drops out of \`step_cart\` by itself with no special case.

### The diagonal that is not a collapse

Cohort by signup month, activity by paid order month:

\`\`\`sql
WITH cohorts AS (
  SELECT customer_id, DATE_TRUNC('month', signup_date) AS cohort_month
  FROM customers
), sizes AS (
  SELECT cohort_month, COUNT(*) AS n FROM cohorts GROUP BY cohort_month
), active AS (
  SELECT DISTINCT customer_id, DATE_TRUNC('month', order_date) AS active_month
  FROM orders WHERE status = 'paid'
)
SELECT c.cohort_month, s.n,
       DATE_PART('month', AGE(a.active_month, c.cohort_month))
     + DATE_PART('year',  AGE(a.active_month, c.cohort_month)) * 12 AS month_no,
       ROUND(100.0 * COUNT(DISTINCT a.customer_id) / s.n, 1) AS pct
FROM cohorts c
JOIN sizes s ON s.cohort_month = c.cohort_month
JOIN active a ON a.customer_id = c.customer_id
GROUP BY c.cohort_month, s.n, month_no
ORDER BY c.cohort_month, month_no;
\`\`\`

| cohort | size | M0 | M1 | M2 | M3 |
|---|---|---|---|---|---|
| 2026-01 | 1204 | 100% | 38% | 29% | 26% |
| 2026-02 | 1588 | 100% | 35% | 28% | 9% |
| 2026-03 | 1431 | 100% | 41% | 11% | |
| 2026-04 | 1190 | 100% | 13% | | |

Someone will read that bottom left corner as retention falling off a cliff. It is not. Today is the 9th of the month, so every cohort's newest cell measures nine days against a full month, and the 9, 11, 13 diagonal is the calendar, not the product. Blank the incomplete diagonal before anyone screenshots it.

Then write the definition of active once, as a model everyone builds on, so the three numbers at the top of this topic become one.
      `,
        [
          q('Sessionising emits 1 when the gap since the previous event exceeds 30 minutes, then takes a running SUM of that flag per customer. What does the running SUM give you?', [
            'The number of minutes that customer has been idle so far',
            'A count of how many events the customer fired in this session',
            'A flag set to 1 on every event that belongs to a new session',
            'A session number that only increases at each session boundary',
          ], 3, 'The running total stays flat while the flag is zero and steps up by one at each boundary event, so every event inside the same burst of activity shares a single value that works as a session identifier.'),
          q('A funnel counts view_product and checkout with COUNT(*) FILTER across the whole events table. Why does it overstate conversion?', [
            'FILTER discards NULL timestamps, so the earliest sessions are excluded',
            'COUNT(*) counts rows rather than events, which inflates both numbers',
            'It credits checkouts that preceded the view, and counts repeats as new',
            'Events with no session number get counted against every funnel step',
          ], 2, 'Counting events over the whole table ignores both ordering and grouping, so a checkout from last week is paired with a view from today and a single browsing customer contributes hundreds of view events to the denominator.'),
          q('A retention matrix shows 9%, 11% and 13% along its newest diagonal while comparable older cells sit near 30%. What is the most likely explanation?', [
            'The newer cohorts were acquired through a lower quality channel',
            'Those cells cover a month still in progress rather than a full one',
            'The denominator used every signup instead of activated customers',
            'DISTINCT was omitted, so repeat buyers were counted several times',
          ], 1, 'The newest cell of every cohort measures activity in the current partial month against a denominator sized for a whole month, which drags each of those cells down in the same way and produces a false diagonal cliff.'),
        ]
      ),
      ],
      [
      q('A dashboard needs revenue by country and category, a subtotal per country, and a grand total, all from one statement. Which clause does that?', [
        'GROUP BY ROLLUP (c.country, p.category)',
        'GROUP BY CUBE (c.country) with a HAVING filter',
        'GROUP BY c.country, p.category WITH TIES',
        'GROUP BY GROUPING SETS ((p.category), ())',
      ], 0, 'ROLLUP over two columns expands to the detail set, the country only set and the empty set, which is exactly the detail rows, the country subtotals and the grand total in a single pass over the data.'),
      q('Twenty selected categories each need their five best selling products, and there is an index on (category, units_sold DESC). Which plan does the least work?', [
        'Rank every product with ROW_NUMBER, then keep rows where rn is 5 or less',
        'Self join products to itself and count the better selling rows per pair',
        'Group by category with array_agg, then slice the first five elements',
        'LEFT JOIN LATERAL a subquery with ORDER BY and LIMIT 5 to the 20 categories',
      ], 3, 'With only twenty groups and an index whose leading column is the group key and whose second column is already in the required order, twenty short index scans of five rows each read far less than sorting the entire products table.'),
      q('What makes a WITH RECURSIVE query stop running?', [
        'The recursive term has been reached for the tenth time by default',
        'An iteration of the recursive term produces no rows at all',
        'Every row in the result has already been seen at least once',
        'The anchor query has been fully consumed by the join',
      ], 1, 'Each iteration feeds only the rows produced by the previous one back into the recursive term, and the engine stops as soon as one of those iterations yields an empty result, which is why a cycle that keeps producing rows never ends.'),
      q('A cohort table, a funnel report and a subtotal dashboard each report a different count of active customers. Which fix removes the disagreement for good?', [
        'Add DISTINCT to all three queries so nobody can double count rows',
        'Run all three against one overnight snapshot of the same tables',
        'Define active once in a shared model that all three are built on',
        'Publish the three numbers together with a note on each method',
      ], 2, 'The numbers differ because each query encodes its own definition of active, so the only durable fix is a single shared model holding that definition, which every downstream report then inherits instead of reinventing.'),
      ]
    ),
    chapter(
      'Why the Planner Chose That Plan',
      'Reading the planner\'s reasoning instead of arguing with it, feeding it better statistics and access paths, and rewriting the queries it can never fix on its own.',
      [
      lesson('Statistics, Cardinality, and Why Estimates Go Wrong', 13, `
A dashboard query that ran in 180ms all year took 94 seconds one Tuesday morning. Nothing was deployed. One line of the plan explained all of it.

\`\`\`text
Nested Loop  (cost=0.86..812.44 rows=1 width=44)
             (actual time=0.043..93921.7 rows=238104 loops=1)
\`\`\`

The planner expected one row and got 238,104. Every choice made above that node was made for a query that did not exist.

### Estimates come from a sample, not the table

\`ANALYZE\` reads a random sample of roughly 300 times the statistics target, so 30,000 rows at the default target of 100, and stores a summary per column. You can read that summary directly:

\`\`\`sql
SELECT attname, null_frac, n_distinct,
       most_common_vals, most_common_freqs, correlation
FROM pg_stats
WHERE tablename = 'orders' AND attname IN ('status', 'customer_id');
\`\`\`

\`\`\`text
attname     | null_frac | n_distinct | most_common_vals        | most_common_freqs
------------+-----------+------------+-------------------------+--------------------
status      |         0 |          3 | {paid,pending,refunded} | {0.81,0.14,0.05}
customer_id |         0 |      41200 | {8812,1043,7765}        | {0.004,0.003,0.003}
\`\`\`

Five fields do almost all the work. \`null_frac\` answers \`IS NULL\`. \`n_distinct\` is the number of distinct values, stored as a negative ratio when it scales with the row count. \`most_common_vals\` and \`most_common_freqs\` are the MCV list, exact frequencies for the top values. Anything outside that list is estimated from a histogram of equal frequency buckets. \`correlation\` says how closely physical row order matches sorted order, and it is what makes an index scan look cheap or expensive.

Selectivity for \`WHERE status = 'paid'\` on 500,000 rows is a lookup, not a guess: 0.81 times 500,000 is 405,000. That estimate lands within a percent.

### The independence assumption is where it breaks

Two predicates on one table get multiplied together.

\`\`\`sql
SELECT * FROM customers
WHERE city = 'Lahore' AND country = 'Pakistan';
\`\`\`

\`city = 'Lahore'\` matches 4% of rows and \`country = 'Pakistan'\` matches 38%. The planner multiplies: 0.04 times 0.38 is 0.0152, so 1,520 rows out of 100,000. The real answer is 4,000, because every Lahore row is a Pakistan row. City functionally determines country and the planner has no way to know that.

Underestimates are the dangerous direction. A plan built for 1,520 rows picks a nested loop with an index probe per row, and at 4,000 rows it survives. At a 200x error it does not.

Record the dependency instead of hoping:

\`\`\`sql
CREATE STATISTICS customers_city_country (dependencies, ndistinct, mcv)
  ON city, country FROM customers;
ANALYZE customers;
\`\`\`

\`dependencies\` captures "city implies country". \`ndistinct\` fixes the count of distinct combinations, which is what \`GROUP BY city, country\` estimates from. \`mcv\` stores the frequent pairs themselves.

### Four other ways the number goes wrong

| Cause | What you see | Fix |
|---|---|---|
| Stale stats after a bulk load | Estimate matches yesterday's row count | Run \`ANALYZE\` at the end of the load |
| Expression in the predicate | Estimate is exactly 0.5% of the table | Index the expression, which creates stats for it |
| Skew, where 100 MCVs is not enough | Rare values estimated far too high | \`SET STATISTICS 1000\` on that column |
| Value past the histogram range | An estimate of 1 row for a future date | Analyze more often, or partition |

The expression case bites quietly. \`WHERE date_trunc('month', order_date) = DATE '2026-03-01'\` has no statistics behind it at all, so Postgres falls back to a hardcoded guess. Running \`CREATE INDEX ON orders (date_trunc('month', order_date))\` gives the planner a real distribution for that expression, whether or not the index itself is ever chosen.

### How to read a plan for estimate errors

Run \`EXPLAIN (ANALYZE, BUFFERS)\`, then work from the innermost node outward and compare \`rows=\` against \`actual rows\`. Find the deepest node where they diverge by 10x or more. That node is the bug. Everything above it inherited the error, so retuning a join method at the top is treating a symptom.

Divide by \`loops\` before you judge anything. A node reporting \`rows=1 loops=238104\` produced 238,104 rows in total, and its \`actual time\` is the cost of one loop, not of the node.
      `,
        [
          q('EXPLAIN ANALYZE shows a node with rows=1 and actual rows=238104. Why does that one mismatch matter so much?', [
            'It affects only that node, because the nodes above it were costed separately',
            'It means the query returned the wrong result set and has to be rewritten',
            'Every join method and join order above it was picked for a row count that never existed',
            'It shows the index feeding that node is corrupt and needs a REINDEX first',
          ], 2, 'The planner costs each node using the estimated row count coming from below it, so a node that under-reports by five orders of magnitude makes every decision above it correct only for a query that does not exist.'),
          q('In customers, city = \'Lahore\' matches 4% of rows and country = \'Pakistan\' matches 38%. Why does the planner estimate about 1.5% for both predicates together?', [
            'It multiplies the two selectivities, because it assumes the columns are independent',
            'It takes the smaller of the two selectivities and halves it as a safety margin',
            'It uses the MCV frequency of the rarer value and ignores the second predicate',
            'It re-samples the table at plan time and reports whatever that sample shows',
          ], 0, 'Without an extended statistics object the planner has no record that city determines country, so it multiplies the per-column selectivities and lands far below the true count of 4,000 rows.'),
          q('A filter reads WHERE lower(email) = \'ayesha@example.com\'. Which change gives the planner a real distribution to estimate from?', [
            'Raising default_statistics_target for the whole database and re-analysing',
            'Running ANALYZE on customers far more often than autovacuum does',
            'Creating an extended statistics object on the email and city columns',
            'Creating an index on the expression lower(email)',
          ], 3, 'Column statistics describe email, not lower(email), so the planner uses a fixed fallback guess until an expression index exists, at which point ANALYZE starts collecting statistics for that expression as well.'),
        ]
      ),
      lesson('Nested Loop, Hash, and Merge Joins', 13, `
Same query, same data, three plans, and a 40x spread in runtime. The join predicate never changed. What changed was how many rows the planner believed would arrive at the join.

### Three algorithms, one job

\`\`\`sql
SELECT c.name, o.order_id, o.order_date
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
WHERE c.city = 'Lahore';
\`\`\`

**Nested loop.** Take each row from the outer side, look up its matches on the inner side. Total cost is roughly \`outer_rows\` times the cost of one inner lookup. With an index on \`orders.customer_id\` a lookup is a handful of page reads, so 40 outer rows cost nothing at all. Four hundred thousand outer rows cost you a morning.

**Hash join.** Build a hash table in memory from the smaller side, then scan the other side once and probe it. Each input is read exactly once. No index needed, no ordering needed. What it needs is memory.

**Merge join.** Sort both sides on the join key, then walk them together like a zip. If both sides already arrive sorted, from an index scan or an earlier merge, this is close to free. If they do not, you pay for two sorts first.

| Join | Best when | Falls apart when |
|---|---|---|
| Nested loop | Outer side is tiny, inner is indexed | The outer estimate was wrong by 100x |
| Hash | No usable index, build side fits work_mem | The build side is far bigger than estimated |
| Merge | Inputs already sorted, or output must be | Neither side is sorted and both are large |

### Loops, which is where people misread the plan

\`\`\`text
->  Nested Loop  (actual time=0.031..8214.402 rows=238104 loops=1)
      ->  Seq Scan on customers c  (actual rows=41204 loops=1)
            Filter: (city = 'Lahore'::text)
      ->  Index Scan using orders_customer_id_idx on orders o
            (actual time=0.019..0.191 rows=6 loops=41204)
\`\`\`

That index scan reports \`actual time=0.019..0.191\`, which looks instant. It is per loop, and it ran 41,204 times, so its real contribution is about 7.9 seconds. \`rows=6\` is per loop too: six times 41,204 gives the 238,104 above it. Multiply before you call a node fast.

### Hash joins and work_mem

\`EXPLAIN ANALYZE\` prints the hash internals:

\`\`\`text
->  Hash  (actual rows=41204 loops=1)
      Buckets: 8192  Batches: 16  Memory Usage: 4193kB
\`\`\`

\`Batches: 16\` means the hash table did not fit in \`work_mem\`, so Postgres partitioned both inputs into 16 files on disk and joined them one batch at a time. Anything above \`Batches: 1\` is disk traffic you can often buy back:

\`\`\`sql
SET LOCAL work_mem = '256MB';
\`\`\`

Use \`SET LOCAL\` inside the transaction that runs the report. \`work_mem\` is allocated per sort or hash node, not per query, so a plan with four hash nodes across eight parallel workers can claim that figure many times over. Setting 256MB globally on a 200 connection server is how a database runs out of memory at 09:00.

### The failure a bad estimate causes

If the planner believes the filtered \`customers\` side yields one row, it picks a nested loop and plans for a single probe into \`orders\`. When 41,204 rows actually turn up it probes 41,204 times, and nothing rescues it: the plan is chosen before execution starts and never changes mid flight. A hash join over the same two inputs reads each once and finishes in under a second.

You can confirm the diagnosis without shipping anything:

\`\`\`sql
SET LOCAL enable_nestloop = off;
\`\`\`

If the query falls from 94 seconds to 900 milliseconds, the join method was the problem. Do not leave that line in the application. It is a probe, not a cure, and it will make some other query on the same table worse next month. The real fix sits upstream: better statistics, an extended statistics object, or a rewrite that hands the planner a countable input.

### Parallelism changes the arithmetic again

A parallel hash join splits the probe side across workers and shares one hash table. A nested loop parallelises the outer side only. When you see \`Workers Planned: 4\`, the times printed inside each node are per worker, and the \`Gather\` node at the top is where their output is combined. Read the row counts there, not below it, when you want the total the query actually returned.
      `,
        [
          q('A plan node reads: Index Scan ... (actual time=0.019..0.191 rows=6 loops=41204). How much time did that node contribute in total?', [
            'About 0.191 milliseconds, since that is the reported completion time',
            'About 7.9 seconds, because the reported time is the cost of one loop',
            'About 0.19 seconds, because loops scales the row count but not the time',
            'It cannot be worked out unless BUFFERS was requested as well',
          ], 1, 'Times and row counts inside a repeated node are reported per loop, so 0.191 milliseconds multiplied by 41,204 loops is roughly 7.9 seconds of real work.'),
          q('A hash join reports Buckets: 8192 Batches: 16. What is that telling you?', [
            'The join is being executed across sixteen parallel worker processes',
            'The planner divided the statement into sixteen independently costed plans',
            'Sixteen distinct join keys hashed into the same bucket and collided',
            'The hash table did not fit in work_mem and spilled into disk files',
          ], 3, 'Anything above Batches: 1 means Postgres partitioned both join inputs onto disk because the build side exceeded work_mem, so the join is now paying for extra reads and writes.'),
          q('Why is SET enable_nestloop = off a diagnostic rather than a real fix?', [
            'It confirms the join method hurt, but leaves the bad estimate that caused it',
            'It applies only to queries that already have a merge join available instead',
            'The planner resets it again as soon as the statement finishes parsing',
            'It makes nested loops run slower rather than stopping them being chosen',
          ], 0, 'Turning the join method off proves which choice was costing you the time, but the underlying cardinality error remains and will produce a bad plan somewhere else, so the fix belongs in the statistics or the query shape.'),
        ]
      ),
      lesson('Beyond the B-tree: Partial, Covering, and GIN Indexes', 13, `
An \`orders\` table carried a 4.1 GB B-tree on \`status\`. It was never used once. Three values, 81% of them \`paid\`, so a lookup for \`paid\` is cheaper as a sequential scan and the planner knew it. The index that replaced it was 3 MB and took the pending queue query from 2.4 seconds to 4 milliseconds.

### Partial indexes: index only the rows you query

\`\`\`sql
CREATE INDEX orders_pending_idx ON orders (order_date)
  WHERE status = 'pending';
\`\`\`

Pending is 0.4% of rows, so the index holds 0.4% of the entries. Small enough to stay resident in cache, and inserts of \`paid\` rows never touch it at all.

The catch is a proof obligation. Postgres uses a partial index only when it can prove the query predicate implies the index predicate. \`WHERE status = 'pending'\` proves. \`WHERE status = $1\` does not, even when that parameter holds \`'pending'\` at runtime, because the proof happens at plan time and the value is not there yet. That is the most common reason a partial index sits unused while everyone insists it should work.

### Covering indexes and the visibility map

An index scan finds the entries, then visits the heap for the remaining columns. \`INCLUDE\` carries extra columns in the leaf pages so that visit can be skipped:

\`\`\`sql
CREATE INDEX orders_cust_date_idx
  ON orders (customer_id, order_date) INCLUDE (status);
\`\`\`

\`\`\`text
Index Only Scan using orders_cust_date_idx on orders
  (actual time=0.021..1.884 rows=6210 loops=1)
  Heap Fetches: 0
\`\`\`

\`Heap Fetches: 0\` is the whole win. When that number is large the scan is visiting the heap anyway, because Postgres still has to check row visibility and can only skip the check for pages marked all visible in the visibility map. Pages earn that mark when \`VACUUM\` runs. On a heavily updated table where autovacuum has fallen behind, you get an index only scan with a million heap fetches and no speedup whatsoever.

Columns in \`INCLUDE\` cannot be searched or sorted on, only returned. Put a column in the key list if you filter or order by it, in \`INCLUDE\` if you merely select it.

### Column order in a multicolumn index

Equality columns first, the range or sort column last. \`(customer_id, order_date)\` serves \`customer_id = 8812 AND order_date >= DATE '2026-01-01'\` perfectly. Flip it to \`(order_date, customer_id)\` and the same query walks every entry in the date range checking customers as it goes. Postgres has no index skip scan, so a leading column you do not constrain is a leading column you wasted.

### When a B-tree is simply the wrong structure

| Need | Index type | What it serves |
|---|---|---|
| \`attrs @> '{"tier":"gold"}'\` on jsonb | GIN | containment |
| \`name ILIKE '%hub%'\` | GIN with \`pg_trgm\` | trigram matching |
| \`tags && ARRAY['sale']\` on an array | GIN | overlap |
| \`to_tsvector(name) @@ query\` | GIN | full text search |
| Huge table already stored in date order | BRIN | min and max per block range |

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX products_name_trgm ON products USING gin (name gin_trgm_ops);
\`\`\`

That is what makes \`WHERE name ILIKE '%hub%'\` fast. A B-tree cannot help with a leading wildcard, because a B-tree is sorted by prefix and you have not given it one.

GIN carries a cost you meet later rather than sooner: it buffers changes in a pending list, so writes feel fast until the list is flushed, and a GIN index over a write heavy jsonb column can end up several times the size of the column itself.

BRIN only works while physical row order tracks the indexed column, which is exactly the \`correlation\` figure from the statistics view. Load rows out of order and a BRIN index quietly degrades into a sequential scan with extra bookkeeping.

### Every index is a tax on writes

Each index is another structure to maintain on every insert, and on any update touching its columns. Worse, updating an indexed column blocks the HOT optimisation, which forces a fresh entry in every index on that table, not just the one you changed. Audit what is earning its keep:

\`\`\`sql
SELECT indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0 ORDER BY pg_relation_size(indexrelid) DESC;
\`\`\`
      `,
        [
          q('A partial index built WHERE status = \'pending\' is ignored by a prepared statement filtering WHERE status = $1. What explains that?', [
            'The planner must prove the predicates match at plan time, and $1 has no value yet',
            'Partial indexes support equality only on integer columns, never on text',
            'The index is too small for the planner to consider it worth opening',
            'Prepared statements always fall back to a sequential scan when filtered',
          ], 0, 'Postgres uses a partial index only when it can prove at plan time that the query predicate implies the index predicate, and a parameter placeholder carries no value during planning.'),
          q('An Index Only Scan reports Heap Fetches: 812004. What does that number point at?', [
            'The INCLUDE columns were placed in the key part of the index by mistake',
            'The index has bloated and needs rebuilding with REINDEX CONCURRENTLY',
            'The table pages are not marked all visible, so VACUUM has fallen behind',
            'The query selected columns that were never added to the index at all',
          ], 2, 'An index only scan can skip the heap just for pages the visibility map marks all visible, and those marks are set by VACUUM, so a large heap fetch count means vacuuming is not keeping pace with the writes.'),
          q('Which of these queries gets no help at all from a plain B-tree index on products(name)?', [
            'WHERE name = \'USB-C Hub\'',
            'WHERE name ILIKE \'%hub%\'',
            'WHERE name LIKE \'USB%\'',
            'ORDER BY name LIMIT 20',
          ], 1, 'A B-tree is ordered by prefix, so a pattern beginning with a wildcard gives it nothing to seek on, which is why that case needs a trigram GIN index instead.'),
        ]
      ),
      lesson('Rewriting a Query the Planner Cannot Fix', 13, `
Some queries have no fast plan. You can add every index you can think of and the planner will still pick the least bad option, because the shape of the query forces work that nobody needs done. Those are the ones worth rewriting.

### OR across two tables kills both indexes

\`\`\`sql
SELECT o.order_id
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE c.email = 'ayesha@example.com'
   OR o.order_id = 41207;
\`\`\`

An \`OR\` between two columns of one table becomes a \`BitmapOr\` over two index scans. An \`OR\` spanning two tables cannot, because no single scan satisfies it, so the planner joins everything and filters afterwards. That query takes 3.2 seconds against 500,000 orders.

\`\`\`sql
SELECT o.order_id FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE c.email = 'ayesha@example.com'
UNION
SELECT order_id FROM orders WHERE order_id = 41207;
\`\`\`

Two index scans and a dedupe. Six milliseconds. Use \`UNION ALL\` when the branches provably cannot overlap, since plain \`UNION\` pays to sort or hash the result to remove duplicates.

### DISTINCT that is hiding a fan-out

\`\`\`sql
SELECT DISTINCT c.customer_id, c.name
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
WHERE o.status = 'paid';
\`\`\`

The join produces one row per paid order, then \`DISTINCT\` throws nearly all of them away. You built 405,000 rows to return 22,000. \`EXISTS\` stops at the first match per customer:

\`\`\`sql
SELECT c.customer_id, c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.customer_id
                AND o.status = 'paid');
\`\`\`

The plan node you want to see is a semi join. Whenever a \`DISTINCT\` exists only to undo a join, the join was the wrong tool for the question.

### Aggregate before you join, not after

\`\`\`sql
SELECT c.city, SUM(oi.quantity * oi.unit_price) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
GROUP BY c.city;
\`\`\`

That drags 1.8 million order items through two joins before aggregating any of them. Collapse the wide table first:

\`\`\`sql
WITH order_revenue AS (
  SELECT order_id, SUM(quantity * unit_price) AS revenue
  FROM order_items
  GROUP BY order_id
)
SELECT c.city, SUM(r.revenue) AS revenue
FROM order_revenue r
JOIN orders o    ON o.order_id = r.order_id
JOIN customers c ON c.customer_id = o.customer_id
GROUP BY c.city;
\`\`\`

Identical answer, but the join now carries 500,000 narrow rows instead of 1.8 million wide ones.

### The CTE that stopped being a fence

Before PostgreSQL 12 a CTE was always materialised: the planner ran it separately and could not push a filter into it. From 12 onwards a CTE referenced once is inlined, so predicates flow through. Both behaviours are still reachable, and both are sometimes what you want:

\`\`\`sql
WITH recent AS MATERIALIZED (
  SELECT * FROM orders WHERE order_date >= DATE '2026-01-01'
)
SELECT * FROM recent WHERE status = 'paid';
\`\`\`

Ask for \`MATERIALIZED\` when the CTE is expensive and referenced several times, or when inlining produces a worse estimate than computing it once. Ask for \`NOT MATERIALIZED\` when you wrote a readable CTE on an old server and want the outer filter to reach the base table.

### Pagination that stops getting slower

\`OFFSET 200000 LIMIT 20\` reads 200,000 rows and throws them away. Page one is instant, page ten thousand times out, and the cost climbs linearly the whole way.

\`\`\`sql
SELECT order_id, order_date FROM orders
WHERE (order_date, order_id) < (DATE '2026-03-14', 41207)
ORDER BY order_date DESC, order_id DESC
LIMIT 20;
\`\`\`

Keyset pagination carries the last row of the previous page as the cursor, so the index seeks straight to it and page ten thousand costs what page one costs. The tradeoff is honest: you give up jumping to an arbitrary page number.

| Rewrite | What it looks like in the plan |
|---|---|
| OR to UNION | A join followed by Filter, no index scan anywhere |
| DISTINCT to EXISTS | HashAggregate sitting on millions of joined rows |
| Aggregate before join | A wide join feeding one GroupAggregate at the top |
| OFFSET to keyset | A Limit node discarding an enormous row count |

One pattern runs through all four: give the planner less to carry, and give it less earlier.
      `,
        [
          q('Why does an OR whose two sides sit on different tables usually defeat the indexes on both of them?', [
            'Indexes are consulted only for predicates written before the join clause',
            'The planner disables bitmap scans whenever more than one table is joined',
            'OR forces a merge join, and merge joins ignore index ordering entirely',
            'No single scan can satisfy it, so rows are joined first and filtered after',
          ], 3, 'A BitmapOr can combine index scans on one table, but a condition spanning two tables cannot be answered before the join happens, so the planner joins everything and applies the filter afterwards.'),
          q('A query runs SELECT DISTINCT c.customer_id FROM customers c JOIN orders o ON ... WHERE o.status = \'paid\'. What changes when it is rewritten with EXISTS?', [
            'It also returns customers with no paid orders, which DISTINCT had excluded',
            'It stops at the first matching order per customer instead of joining them all',
            'It moves the deduplication out of the database and into application code',
            'It lets the planner skip the index on orders.customer_id altogether',
          ], 1, 'EXISTS produces a semi join, which needs only one matching row per customer, so the query never materialises the hundreds of thousands of joined rows that DISTINCT would then have to discard.'),
          q('On PostgreSQL 14, what does adding MATERIALIZED to a CTE that is referenced exactly once do?', [
            'Nothing, because a CTE referenced once is always materialised anyway',
            'It caches the result across sessions until the base table is modified',
            'It stops the planner inlining it, so outer predicates cannot push in',
            'It writes the intermediate result into a temporary table you can query',
          ], 2, 'From version 12 a single-reference CTE is inlined by default, and the MATERIALIZED keyword restores the old optimisation fence so the CTE is computed on its own without outer filters reaching inside it.'),
        ]
      ),
      ],
      [
      q('A 40 second query shows a top level Hash Join with an accurate estimate, and eight nodes below it, one of which estimated 3 rows and returned 190,000. Where do you start?', [
        'At the deepest node whose estimate is wrong, since everything above inherited it',
        'At the top level join, because it accounts for the largest share of total time',
        'By raising work_mem, since a 40 second join is nearly always spilling to disk',
        'By indexing the column named in the Filter condition of the slowest node',
      ], 0, 'Estimates propagate upward, so the first node where estimate and reality diverge is the cause and every choice above it is a consequence of that one wrong number.'),
      q('A nightly load appends 4 million rows to orders, and the first report afterwards picks a nested loop and runs for an hour. What is the likeliest cause?', [
        'The new rows pushed the table past the size at which nested loops are allowed',
        'The load consumed work_mem, so the join had no room to build a hash table',
        'ANALYZE has not run yet, so the planner is costing against yesterday\'s statistics',
        'The B-tree indexes need a REINDEX before the planner will consider using them',
      ], 2, 'Statistics are refreshed by ANALYZE rather than by the write itself, so a plan chosen straight after a bulk load is sized for the table as it stood before the load and picks a nested loop for what it thinks is a tiny input.'),
      q('The planner underestimates WHERE city = \'Lahore\' AND country = \'Pakistan\' by 200x. Which change actually addresses that?', [
        'A separate B-tree index on city, and another separate one on country',
        'Raising default_statistics_target so both columns store 1000 MCV entries',
        'Rewriting the predicate as an IN list holding the matching city values',
        'An extended statistics object on the pair, which records the dependency',
      ], 3, 'The error comes from multiplying two selectivities as though the columns were independent, and only a CREATE STATISTICS object on the column pair tells the planner that city already implies country.'),
      q('You add a covering index, the plan switches to an Index Only Scan, and the query is no faster. What do you check first?', [
        'Whether the INCLUDE column names were spelled correctly in the definition',
        'The Heap Fetches count, which stays high when VACUUM is behind',
        'Whether the table now has more indexes than the planner will consider',
        'The correlation figure, since index only scans need sorted storage',
      ], 1, 'An index only scan still visits the heap for any page the visibility map does not mark all visible, so a high Heap Fetches count means the vacuum is lagging and the scan is doing the same work the old plan did.'),
      ]
    ),
    chapter(
      'Concurrency Under Real Traffic',
      'What the database actually does when hundreds of sessions touch the same rows at once, and the slow mornings that follow one transaction nobody closed.',
      [
      lesson('MVCC: How Readers and Writers Avoid Each Other', 13, `
A revenue report scans 4.2 million rows of \`orders\` and takes 38 seconds. While it runs, checkout commits 900 new orders and flips 300 more to paid. The report is never blocked, sees none of those 1,200 changes, and returns a total that was true at the instant it started. None of that is free. A database that overwrote rows in place could not do it.

### An UPDATE never overwrites anything

Postgres keeps multiple versions of the same logical row and hands each transaction the version it is entitled to see. Every row carries two hidden system columns: \`xmin\`, the transaction that created this version, and \`xmax\`, the transaction that deleted or superseded it.

\`\`\`sql
SELECT ctid, xmin, xmax, order_id, status FROM orders WHERE order_id = 1001;
\`\`\`

\`\`\`text
 ctid  | xmin  | xmax | order_id | status
-------+-------+------+----------+---------
 (0,3) | 88214 |    0 |     1001 | pending
\`\`\`

Now change the status and look again:

\`\`\`sql
UPDATE orders SET status = 'paid' WHERE order_id = 1001;
SELECT ctid, xmin, xmax, status FROM orders WHERE order_id = 1001;
\`\`\`

\`\`\`text
  ctid   | xmin  | xmax | status
---------+-------+------+--------
 (912,7) | 88377 |    0 | paid
\`\`\`

The \`ctid\` is the physical (page, slot) address, and it moved. This is a brand new row in page 912. The old version at \`(0,3)\` is still sitting on disk with its \`xmax\` set to 88377. It is dead, but only from the point of view of transactions that started after 88377 committed.

### Snapshots decide what you see

When a statement begins, the backend takes a snapshot: the highest transaction id handed out so far, plus the list of ids still in flight. A row version is visible if its \`xmin\` committed before that snapshot and is not in the in-flight list, and its \`xmax\` is either empty or belongs to a transaction that has not committed. That rule is applied per row, at read time. It is the whole reason the 38 second report neither waits for the checkout traffic nor sees it.

Readers do not block writers. Writers do not block readers. Two writers aiming at the same row still block each other, which is topic three.

### The cost nobody budgets for

Because an UPDATE writes a complete new tuple, the width of the row you touch decides the write volume, not the width of the column.

\`\`\`sql
UPDATE orders SET status = 'archived' WHERE order_date < '2024-01-01';
-- UPDATE 2100000
\`\`\`

Two million fresh row versions, two million dead ones left behind. The table goes from 640 MB to roughly 1.3 GB while the live row count does not change by one. Index entries point at physical tuples, so an ordinary update also inserts a new entry into every index on the table. Eight indexes, eight extra writes per row.

The escape hatch is the heap only tuple, or HOT update. If no indexed column changed and the page has free space, the new version stays in the same page, chained off the old one, and no index is touched at all.

| Situation | HOT update possible |
|---|---|
| Only \`status\` changed, nothing indexes it | Yes |
| \`order_date\` changed and an index covers it | No |
| Page already 100% full | No |
| New version must move to another page | No |

That is what \`fillfactor\` buys you on a heavily updated table:

\`\`\`sql
ALTER TABLE orders SET (fillfactor = 85);
\`\`\`

Fifteen percent of every page stays empty on purpose, so updates land in place instead of scattering across the heap and rewriting indexes.

### Why COUNT(*) has to scan

Visibility is per transaction, so no single stored counter could be correct for everybody at once. \`SELECT COUNT(*) FROM orders\` has to inspect rows. An index-only scan helps only for pages the visibility map marks as all visible, and that flag is set by vacuum. So "why is my count slow" and "why is my table 9 GB" turn out to be the same mechanism seen from two sides.
      `,
        [
          q('An UPDATE sets status = \'archived\' on 2.1 million rows of a 640 MB orders table. Afterwards the table is roughly 1.3 GB with an unchanged live row count. Why?', [
            'The archived status string is longer, so every stored row grew on disk',
            'Each updated row was written as a new version and the old versions remain',
            'The statement rebuilt every index and kept both copies of each one',
            'Postgres wrote an undo image of each row into the table\'s own data file',
          ], 1, 'Postgres never overwrites a row in place: an UPDATE writes a fresh tuple and marks the old one dead by setting its xmax, and those dead versions keep occupying pages until vacuum reclaims them.'),
          q('A 38 second report scans orders while checkout commits 900 new orders. The report neither blocks nor sees any of them. What makes that possible?', [
            'The report holds a table level SHARE lock that defers inserts until it ends',
            'New rows go to a separate undo area and are merged into the table at commit',
            'Postgres restarts the report from the beginning when a conflicting write lands',
            'Each row version carries xmin and xmax, and the report\'s snapshot excludes newer ones',
          ], 3, 'Visibility is computed per row from the creating and deleting transaction ids against the reader\'s snapshot, so rows committed after the snapshot was taken are simply invisible and nobody has to wait.'),
          q('Which of these prevents an UPDATE on orders from being a HOT update?', [
            'Changing order_date, which an index covers, instead of an unindexed column',
            'Running the update inside an explicit transaction rather than autocommit',
            'Updating two unindexed columns in one statement instead of a single column',
            'Setting the table\'s fillfactor to 85 so that pages keep some free space',
          ], 0, 'A HOT update requires that no indexed column changed and that the new version fits in the same page, so touching an indexed column forces new index entries and rules HOT out entirely.'),
        ]
      ),
      lesson('Isolation Levels and the Anomalies They Allow', 13, `
A support tool grants one refund credit per customer. It reads whether an active credit exists, and inserts one if not. It behaved for a year. Then a support agent double-clicked, and a customer received two credits worth 340 each. Both transactions were individually correct. Both committed. No error was logged anywhere.

### Read committed takes a new snapshot per statement

Postgres defaults to READ COMMITTED, where each *statement* gets a fresh snapshot, not each transaction. The same query, run twice inside one transaction, can disagree with itself:

\`\`\`sql
BEGIN;
SELECT SUM(quantity * unit_price) FROM order_items;   -- 1284300.00
-- another session commits an order here
SELECT SUM(quantity * unit_price) FROM order_items;   -- 1284720.00
COMMIT;
\`\`\`

A report built from five queries under this level can therefore produce a set of numbers that no single instant of the database ever held. That is where "the subtotals do not add up to the total" comes from.

There is a genuine surprise buried here. An UPDATE that collides with another transaction's uncommitted change does not use its snapshot. It blocks, waits for the other transaction to finish, then re-reads the newly committed version and re-evaluates its own WHERE clause against it. Which is why this is safe:

\`\`\`sql
UPDATE products SET stock = stock - 1
WHERE product_id = 41 AND stock > 0
RETURNING stock;
\`\`\`

Zero rows back means someone else took the last unit. Compare the version two sessions can both walk straight through:

\`\`\`sql
SELECT stock FROM products WHERE product_id = 41;      -- both see 1
UPDATE products SET stock = stock - 1 WHERE product_id = 41;
-- stock is now -1
\`\`\`

Check-then-act split across two statements is the bug. One statement that tests and writes together is the fix.

### Repeatable read freezes the snapshot

\`BEGIN ISOLATION LEVEL REPEATABLE READ\` takes one snapshot for the entire transaction, so that five query report finally agrees with itself. Postgres implements this as true snapshot isolation, so unlike the bare SQL standard it also blocks phantom rows.

The price: if your transaction tries to update a row that changed after your snapshot was taken, you get SQLSTATE 40001, \`could not serialize access due to concurrent update\`. That transaction is finished, and the retry has to replay it from the start.

### Write skew, the anomaly a snapshot cannot see

| Level | Dirty read | Non repeatable read | Phantom | Write skew |
|---|---|---|---|---|
| Read committed | No | Yes | Yes | Yes |
| Repeatable read | No | No | No | Yes |
| Serializable | No | No | No | No |

The double refund is write skew. Each transaction reads a set (credits for customer 88), each finds it empty, and each inserts a row into that set. Neither one modified a row the other actually read, so no snapshot rule can detect a conflict. Both commit happily.

SERIALIZABLE closes it. Postgres tracks which rows each transaction read, and aborts one when the read/write dependency graph forms a dangerous cycle:

\`\`\`sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
SELECT count(*) FROM orders WHERE customer_id = 88 AND status = 'pending';
INSERT INTO orders (order_id, customer_id, order_date, status)
VALUES (7741, 88, CURRENT_DATE, 'pending');
COMMIT;
-- ERROR:  could not serialize access due to read/write dependencies
\`\`\`

It takes no locks that block readers, but it is not free. False positives happen under load, and every code path must be prepared to run twice:

\`\`\`python
for attempt in range(3):
    try:
        with conn.transaction():
            grant_credit(customer_id=88, amount=340)
        break
    except psycopg.errors.SerializationFailure:
        continue
\`\`\`

Retry the whole transaction, never just the failed statement, and make sure nothing inside it sent an email before the retry.

### When a constraint beats an isolation level

If the rule can be written down as a constraint, write it down as a constraint:

\`\`\`sql
CREATE UNIQUE INDEX one_pending_per_customer
  ON orders (customer_id) WHERE status = 'pending';
\`\`\`

Now the second insert fails at any isolation level, on any connection, from any application. Isolation levels protect logic you cannot express declaratively. Everything else belongs in the schema.
      `,
        [
          q('Under REPEATABLE READ, two sessions each check that customer 88 has no pending order, each find none, and each insert one. What happens at COMMIT?', [
            'One session fails with a serialization error because the snapshots disagree',
            'The second session blocks until the first commits and then sees the new row',
            'Both commit successfully and customer 88 is left with two pending orders',
            'Both fail because a snapshot cannot be taken while an insert is in flight',
          ], 2, 'Neither transaction modified a row that the other actually read, so snapshot isolation finds no conflict to report; this is write skew, and only SERIALIZABLE or a unique partial index stops it.'),
          q('Why does an application running SERIALIZABLE transactions need a retry loop that replays the entire transaction?', [
            'Postgres can abort at COMMIT with 40001 once it detects a dependency cycle',
            'Serializable transactions expire after a fixed interval and must be restarted',
            'Every statement takes a new snapshot, so earlier reads have to be repeated',
            'The level takes table locks that time out, rejecting statements one at a time',
          ], 0, 'Serializable detects dangerous read/write dependency cycles and resolves them by aborting a transaction, often only at commit time, so the caller must be able to run the whole unit of work again.'),
          q('Which stock decrement is safe when two sessions run it concurrently under READ COMMITTED?', [
            'SELECT the stock, check it in application code, then UPDATE if it was positive',
            'SELECT the stock twice and only UPDATE when both reads return the same value',
            'UPDATE the stock first, then SELECT it and roll back if the result went negative',
            'UPDATE the row with AND stock > 0 in the WHERE clause and check rows affected',
          ], 3, 'A single statement that both tests and writes will wait for the competing transaction and then re-evaluate its WHERE clause against the newly committed version, so zero rows affected reliably means someone else took the last unit.'),
        ]
      ),
      lesson('Lock Modes, Blocked Queries, and Deadlocks', 13, `
At 09:12 a migration added a nullable column. The statement itself completed in 3 milliseconds. The site was unavailable for six minutes. Nothing was wrong with the migration, and rolling it back would not have helped.

### The lock queue is a queue

\`ALTER TABLE orders ADD COLUMN channel TEXT\` needs ACCESS EXCLUSIVE, which conflicts with every other lock mode including the one a plain SELECT takes. An analytics query that started at 09:08 held ACCESS SHARE on \`orders\` and was four minutes into a ten minute scan, so the ALTER waited.

Here is the part people miss. Lock requests are granted in order, so every SELECT arriving after the ALTER queued behind the ALTER, not behind the scan. One blocked DDL statement became four hundred blocked queries inside a minute. The fix is one line:

\`\`\`sql
SET lock_timeout = '2s';
ALTER TABLE orders ADD COLUMN channel TEXT;
\`\`\`

Now the migration gives up after two seconds instead of building a queue behind it. Wrap it in a retry loop and run it until it wins the lock cleanly. Failing fast is the feature.

### Table lock modes worth carrying in your head

| Statement | Lock taken | What it blocks |
|---|---|---|
| \`SELECT\` | ACCESS SHARE | only ACCESS EXCLUSIVE |
| \`INSERT\`, \`UPDATE\`, \`DELETE\` | ROW EXCLUSIVE | index builds and DDL |
| \`VACUUM\`, \`CREATE INDEX CONCURRENTLY\` | SHARE UPDATE EXCLUSIVE | itself and DDL |
| \`CREATE INDEX\` | SHARE | all writes |
| \`ALTER TABLE\`, \`DROP\`, \`TRUNCATE\`, \`VACUUM FULL\` | ACCESS EXCLUSIVE | everything |

A plain \`CREATE INDEX\` blocks writes for the entire build, which on \`order_items\` is a long time. \`CREATE INDEX CONCURRENTLY\` does not, paying for it with two passes over the table and an INVALID index left behind if it fails, which you drop and rebuild.

### Row locks, including the one that surprises people

Row level locks come in four strengths, and which one you take matters:

- \`FOR KEY SHARE\`, taken automatically by a foreign key check. Inserting into \`orders\` locks the parent \`customers\` row this way.
- \`FOR NO KEY UPDATE\`, taken by an UPDATE that leaves key columns alone.
- \`FOR SHARE\` and \`FOR UPDATE\`, taken explicitly, and by DELETE or an UPDATE that touches a key column.

FOR NO KEY UPDATE and FOR KEY SHARE do not conflict. That is why \`UPDATE customers SET city = 'Karachi' WHERE customer_id = 88\` does not stall a checkout inserting an order for customer 88. Change \`customer_id\` itself, and it does.

### Deadlocks are an ordering bug

Two reconciliation workers touch the same two items in opposite order:

\`\`\`sql
-- session A                                  -- session B
BEGIN;                                        BEGIN;
UPDATE order_items SET quantity = 2           UPDATE order_items SET quantity = 5
 WHERE order_id=1001 AND product_id=10;        WHERE order_id=1001 AND product_id=14;
UPDATE order_items SET quantity = 1           UPDATE order_items SET quantity = 3
 WHERE order_id=1001 AND product_id=14;        WHERE order_id=1001 AND product_id=10;
\`\`\`

Each holds exactly what the other is waiting for. After \`deadlock_timeout\` (one second by default) Postgres runs cycle detection, picks a victim and kills it:

\`\`\`text
ERROR:  deadlock detected
DETAIL:  Process 48211 waits for ShareLock on transaction 90412;
         blocked by process 48219.
\`\`\`

SQLSTATE 40P01, and the victim's whole transaction is rolled back. Retrying papers over it. The actual fix is to make both sessions acquire rows in the same order every time:

\`\`\`sql
SELECT product_id FROM order_items
WHERE order_id = 1001 ORDER BY product_id FOR UPDATE;
\`\`\`

Take locks in ascending key order everywhere and a cycle cannot form.

### Queue tables and SKIP LOCKED

Ten workers pulling the oldest pending order all target the same row, so nine of them wait and throughput collapses to one worker.

\`\`\`sql
SELECT order_id FROM orders
WHERE status = 'pending'
ORDER BY order_id
LIMIT 1
FOR UPDATE SKIP LOCKED;
\`\`\`

\`SKIP LOCKED\` steps over any row another session already holds. Ten workers get ten different orders, and the queue drains ten times faster.
      `,
        [
          q('ALTER TABLE orders ADD COLUMN channel TEXT executes in 3 ms once it starts, yet the site was unavailable for six minutes. What happened?', [
            'Adding the column rewrote all 4 million rows before the statement returned',
            'It waited for ACCESS EXCLUSIVE behind a long SELECT, and new queries queued behind it',
            'The new column had no index, so every query fell back to a sequential scan',
            'Postgres invalidated all cached plans and every session had to replan its queries',
          ], 1, 'Lock requests are granted in order, so a DDL statement waiting for ACCESS EXCLUSIVE parks every subsequent query behind itself, turning one slow reader into a queue of hundreds.'),
          q('Two workers deadlock while updating the same two rows of order_items. Which change actually prevents it from happening again?', [
            'Wrap each worker\'s statements in one transaction so they commit together',
            'Lower deadlock_timeout so the cycle is detected and broken much faster',
            'Make both workers lock the rows in ascending product_id order every time',
            'Give each worker its own connection pool so they never share a backend',
          ], 2, 'A deadlock needs a cycle in the wait graph, and a cycle cannot form if every session acquires the contended rows in the same deterministic order.'),
          q('Ten workers claim jobs with SELECT ... ORDER BY order_id LIMIT 1 FOR UPDATE SKIP LOCKED. What does SKIP LOCKED change?', [
            'Each worker passes over rows another session locked and claims a different one',
            'Each worker waits its turn on the top row but times out instead of blocking',
            'The rows are locked in shared mode so several workers can take the same job',
            'The row lock is released when the SELECT ends rather than held until COMMIT',
          ], 0, 'SKIP LOCKED tells the executor to ignore rows that another transaction already has locked, so concurrent workers each pick up a distinct row instead of serialising on the oldest one.'),
        ]
      ),
      lesson('Long Transactions, Bloat, and VACUUM', 13, `
\`order_items\` holds 40,000 live rows and occupies 9.1 GB on disk. Autovacuum has run against it fourteen times today. Every sequential scan reads all 9.1 GB to find those 40,000 rows, which is why the morning dashboards take 40 seconds. The cause is a BI tool that opened a transaction at 02:14 and never closed it.

### Vacuum can only remove what nobody could still see

A dead row version is only safe to reclaim once no existing snapshot could need it. The oldest transaction anywhere in the cluster sets that horizon, and vacuum refuses to clean past it, on every table, not just the one that session touched.

\`\`\`sql
SELECT pid, state, NOW() - xact_start AS open_for, LEFT(query, 40) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start
LIMIT 5;
\`\`\`

\`\`\`text
  pid  |        state        | open_for | query
-------+---------------------+----------+---------------------
 40118 | idle in transaction | 07:26:41 | SELECT 1
 51902 | active              | 00:00:03 | SELECT c.city, SUM(o
\`\`\`

A \`SELECT 1\` from seven and a half hours ago is holding the entire cluster's cleanup hostage. One setting prevents most instances of this:

\`\`\`sql
ALTER DATABASE shop SET idle_in_transaction_session_timeout = '60s';
\`\`\`

Replication slots and abandoned two phase transactions in \`pg_prepared_xacts\` pin the horizon the same way, so check those when no session looks guilty.

### Confirming that it really is bloat

\`\`\`sql
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum,
       pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 5;
\`\`\`

Dead tuples vastly outnumbering live ones **with a recent** \`last_autovacuum\` is the tell. Vacuum ran, and found nothing it was permitted to remove. That points at the horizon, not at your autovacuum settings.

### The default that scales badly

Autovacuum wakes for a table once its dead tuples exceed:

\`\`\`text
autovacuum_vacuum_threshold  +  autovacuum_vacuum_scale_factor * live_rows
            50               +               0.2               * live_rows
\`\`\`

| Table | Live rows | Dead rows tolerated first |
|---|---|---|
| products | 4,000 | 850 |
| orders | 5,000,000 | 1,000,050 |
| order_items | 50,000,000 | 10,000,050 |

Ten million dead rows on your hottest table before cleanup even begins, because the scale factor is a percentage and bigger tables therefore wait longer. Override it where it matters:

\`\`\`sql
ALTER TABLE order_items SET (autovacuum_vacuum_scale_factor = 0.02,
                             autovacuum_vacuum_cost_delay = 2);
\`\`\`

### VACUUM does not shrink the file

Plain \`VACUUM\` marks dead space reusable by future inserts into that same table. It takes SHARE UPDATE EXCLUSIVE, runs happily alongside live traffic, and hands almost nothing back to the operating system. Delete 80% of a table, vacuum it, and the file is still 9.1 GB. Every scan keeps paying for the empty space.

\`VACUUM FULL\` rewrites the table compactly and does return the disk, but it holds ACCESS EXCLUSIVE for the whole rewrite and needs room for a second complete copy. On a 9 GB table during business hours that is an outage with a nicer name. \`pg_repack\` performs the same rewrite while traffic continues, and is what you want on a live system.

### Two jobs vacuum does that nobody credits it for

It sets the visibility map bits that make index-only scans legal, so a bloated table quietly loses its best plans on top of reading more pages.

And it freezes old transaction ids. Let \`age(datfrozenxid)\` climb toward \`autovacuum_freeze_max_age\` and Postgres starts anti-wraparound vacuums that will not step aside for your workload. Ignore those long enough and the database stops accepting writes to protect itself from wrapping around.

\`\`\`sql
SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC LIMIT 3;
\`\`\`

Under 200 million is comfortable. Past a billion, somebody is about to have a very bad night.
      `,
        [
          q('order_items holds 40,000 live rows in 9.1 GB and autovacuum has already run fourteen times today. What is the likeliest cause?', [
            'Autovacuum keeps getting cancelled by DDL before it can finish a full pass',
            'The table\'s fillfactor is far too low, so most of every page is reserved space',
            'Index tuples are never removed by vacuum, and only a reindex can delete them',
            'A transaction open since 02:14 holds the horizon, so no dead tuple may be removed',
          ], 3, 'Vacuum may only reclaim versions that no live snapshot could still need, so the oldest open transaction in the cluster pins the horizon and every vacuum pass finds nothing it is allowed to free.'),
          q('Why does the default autovacuum_vacuum_scale_factor of 0.2 behave badly on a 50 million row table?', [
            'It vacuums after every 20 modified rows, so cleanup competes constantly with writes',
            'Cleanup waits for about 10 million dead rows, so bloat builds long before it runs',
            'It caps each vacuum pass at 20% of the table, leaving the rest permanently dirty',
            'It applies only to tables under a size limit, so large tables are skipped entirely',
          ], 1, 'The trigger is a percentage of live rows plus a small constant, so the larger the table the more dead tuples accumulate before autovacuum even considers starting.'),
          q('You deleted 80% of order_items and ran a plain VACUUM, but the data file is still 9.1 GB. Why?', [
            'Plain VACUUM only refreshes planner statistics and never touches dead versions',
            'The delete stays invisible to VACUUM until the next checkpoint flushes the pages',
            'Plain VACUUM marks the space reusable in place rather than returning it to the OS',
            'Space is released only once every index on the table has also been reindexed',
          ], 2, 'Plain VACUUM makes dead space available for future inserts into the same table without rewriting it, so reclaiming disk requires VACUUM FULL or an online rewrite such as pg_repack.'),
        ]
      ),
      ],
      [
      q('A nightly job updates 3 million rows of orders inside a transaction that then stays open until 09:00. What is the combined effect the next morning?', [
        'The table bloats and vacuum can reclaim nothing while that transaction is open',
        'Readers block on the archived rows until the transaction finally commits at 09:00',
        'The updates are buffered in memory and applied in one burst when the job commits',
        'Autovacuum raises its own threshold automatically so dead rows never accumulate',
      ], 0, 'Each updated row leaves a dead version behind, and the still open transaction holds the xmin horizon so vacuum is forbidden from removing any of them across the whole cluster.'),
      q('A dashboard made of five queries under READ COMMITTED reports subtotals that do not add up to its own total. What fixes it?', [
        'Add an index on every grouping column so all five queries read the same pages',
        'Rewrite the five queries as one statement using SELECT FOR UPDATE on the rows',
        'Raise deadlock_timeout so that no query is cancelled part way through the report',
        'Run all five inside one REPEATABLE READ transaction so they share a snapshot',
      ], 3, 'READ COMMITTED gives every statement its own snapshot, so concurrent commits land between the queries; a single REPEATABLE READ transaction pins one snapshot for all five.'),
      q('A migration has to add a constraint to orders during business hours. Which precaution most reduces the blast radius?', [
        'Run it under REPEATABLE READ so the statement works from a stable snapshot',
        'Set a short lock_timeout and retry, so a failed attempt never builds a queue',
        'Run VACUUM FULL first so the table is compact and the rewrite finishes faster',
        'Take an explicit SHARE lock first so that readers keep working during the change',
      ], 1, 'DDL needs ACCESS EXCLUSIVE, and a request that waits parks every later query behind it, so timing out quickly and retrying keeps a slow reader from cascading into an outage.'),
      q('Which statement is true of a deadlock (SQLSTATE 40P01) compared with a serialization failure (SQLSTATE 40001)?', [
        'A deadlock is detected only at COMMIT, while 40001 is raised at the first statement',
        'Both are prevented outright by running the transactions under SERIALIZABLE isolation',
        'Both abort one transaction, and both are safely handled by retrying the whole unit',
        'A deadlock rolls back only the blocked statement and leaves the transaction usable',
      ], 2, 'Both errors kill an entire transaction rather than a single statement, and both describe transient conflicts, so the correct response to either is to replay the whole unit of work from the beginning.'),
      ]
    ),
    chapter(
      'Big Tables, Warehouses, and the Bill',
      'Tables that outgrew a single index, engines that charge you by the byte scanned, and the answers that are worth approximating.',
      [
      lesson('Partitioning, Pruning, and Retiring Old Data', 13, `
The \`orders\` table crossed 480 million rows in March. The nightly job that removes anything older than three years now runs for six hours, blocks the archive load queued behind it, and leaves the table larger than it started. The rows are gone. The disk space is not. That job is a \`DELETE\`, and \`DELETE\` is the wrong tool for retiring data at this size.

### Cutting one table into many

\`\`\`sql
CREATE TABLE orders (
  order_id     BIGINT   NOT NULL,
  customer_id  INTEGER  NOT NULL,
  order_date   DATE     NOT NULL,
  status       TEXT     NOT NULL,
  PRIMARY KEY (order_id, order_date)
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2026_08 PARTITION OF orders
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
\`\`\`

The parent holds no rows of its own. It is a router: every insert lands in exactly one child based on \`order_date\`, and your application still writes to \`orders\` and reads from \`orders\`. Nothing above the database changes.

One thing does change, and it catches people mid migration. The primary key had to become \`(order_id, order_date)\`. A unique index in Postgres lives inside a single table, so uniqueness across partitions can only be enforced when the partition key is part of the key. The same rule means a partitioned \`customers\` table cannot keep \`email UNIQUE\` unless you partition by email, which nobody wants.

### Pruning is the whole payoff

\`\`\`sql
EXPLAIN SELECT COUNT(*) FROM orders
WHERE order_date >= DATE '2026-08-01' AND order_date < DATE '2026-09-01';
\`\`\`

\`\`\`text
Aggregate
  ->  Seq Scan on orders_2026_08 orders
        Filter: (order_date >= '2026-08-01'::date)
\`\`\`

One child scanned. The other thirty six were eliminated before execution began, so their pages were never read and their indexes were never opened. Now the version that quietly does not work:

\`\`\`sql
-- scans every partition
WHERE DATE_TRUNC('month', order_date) = DATE '2026-08-01'
\`\`\`

Wrapping the partition key in a function hides it from the pruning logic, exactly the way it hides a column from a B-tree index. The query still returns the right answer and takes forty times longer, which is why it survives code review for months. Run \`EXPLAIN\` and count the children named in the plan.

Partitioning is one axis, not a general index. A query filtered only on \`customer_id\` touches all thirty seven partitions and needs a local index on every one of them.

### Retiring data in twenty milliseconds

| Operation on 40 million old rows | Time | Leaves behind |
|---|---|---|
| \`DELETE FROM orders WHERE order_date < ...\` | hours | dead tuples, bloat, gigabytes of WAL |
| \`DROP TABLE orders_2023_01\` | about 20 ms | nothing |
| \`ALTER TABLE orders DETACH PARTITION orders_2023_01\` | about 20 ms | a standalone table you can archive |

Dropping a partition is a catalogue change plus a file unlink. No row by row work, no bloat, no \`VACUUM\` afterwards. Detach first when you want to copy the data to object storage before it disappears, and use \`DETACH PARTITION ... CONCURRENTLY\` so you do not hold an \`ACCESS EXCLUSIVE\` lock on the parent while traffic is running.

### Do not over partition

Every partition costs planning time, because the planner considers each one before it prunes. Four thousand daily partitions can turn a 3 ms query into a 30 ms query, almost all of it spent planning. Use monthly partitions for years of history, and daily only when a single day is genuinely large.

Create next month's partition before next month arrives. If a row shows up with no home, the insert fails with \`no partition of relation "orders" found for row\`, at one second past midnight on the first, in production. Keep a default partition as a safety net, or schedule creation with \`pg_partman\`.
      `,
        [
          q('A nightly job runs DELETE FROM orders WHERE order_date < \'2023-09-01\' on a range partitioned table and takes six hours. What replaces it, and why is the replacement fast?', [
            'DROP TABLE on the old monthly children, because removing a whole partition is a catalogue change and a file unlink',
            'TRUNCATE on the parent table, because truncation skips the per row delete work entirely',
            'The same DELETE in batches of 10,000 rows, because shorter transactions finish sooner',
            'VACUUM FULL right after the delete, because that reclaims the space the rows used',
          ], 0, 'Dropping a partition removes an entire child table as a metadata change plus a file unlink, so there is no row by row work, no dead tuples and no VACUUM afterwards, which is why it finishes in milliseconds rather than hours.'),
          q('A query filters WHERE DATE_TRUNC(\'month\', order_date) = DATE \'2026-08-01\' against a table partitioned by range on order_date. What does the planner actually do?', [
            'Prunes down to the single August child, since the expression resolves to one month',
            'Refuses the query, since a partition key may not appear inside a function call',
            'Scans every child, since the filter is on an expression rather than the raw column',
            'Prunes to two children, July and August, to cover the boundary between months',
          ], 2, 'Pruning matches filters against the raw partition key, so wrapping order_date in DATE_TRUNC hides it the same way a function call hides a column from a B-tree index, and every partition is scanned even though the result is still correct.'),
          q('Why does the primary key on orders have to become (order_id, order_date) once the table is partitioned by order_date?', [
            'Because rows are routed to a child using the full primary key value',
            'Because a BIGINT order_id can repeat once a table passes a billion rows',
            'Because the parent stores no data and needs a sortable key of its own',
            'Because a unique index cannot span children unless it includes the key',
          ], 3, 'A unique index in Postgres lives inside one table, so uniqueness can only be guaranteed across partitions when the partition key is part of the constraint, which forces order_date into the primary key.'),
        ]
      ),
      lesson('Row Stores, Column Stores, and Why Warehouses Are Different', 13, `
The same aggregate, \`SUM(quantity * unit_price)\` grouped by month over 900 million \`order_items\` rows: 41 seconds on the Postgres replica, 1.9 seconds on the warehouse. Same data, same month range, and the warehouse is not running faster disks. It reads far less of the table, because the bytes are arranged differently.

### A row store reads whole rows

Postgres packs rows into 8 KB pages, one row after another, all of a row's columns together:

\`\`\`text
page 1: [1001|55|2|120.00|paid|2026-08-02] [1001|61|1|45.00|paid|2026-08-02]
page 2: [1002|9|1|300.00|paid|2026-08-03] [1003|55|4|120.00|pending|...]
\`\`\`

That layout is perfect for "give me order 1002", which is one page read. It is terrible for "sum two columns over everything", because to reach \`quantity\` and \`unit_price\` the engine still pulls every page, and every page is mostly columns you did not ask for. Nine columns at roughly 120 bytes a row means about 108 GB moved off disk to answer a question that needs 12 bytes per row.

### A column store reads columns

\`\`\`text
quantity   : 2,1,1,3,1,1,2,4,1,...
unit_price : 120.00,45.00,300.00,120.00,...
status     : paid,paid,paid,pending,paid,...
\`\`\`

Each column is a contiguous run in its own blocks. Name three columns out of forty and you read three fortieths of the file. That alone is most of the gap.

Compression multiplies it. \`status\` holds three distinct values across 900 million rows, so a dictionary plus run length encoding turns a 9 GB column into a few megabytes. Sorted dates delta encode. Integers bit pack down to the width they actually use. Eight to twenty times smaller is ordinary, and it is only possible because neighbouring values within a column are similar, which is never true of neighbouring bytes within a row.

Then come zone maps: each block carries its own min and max, so a filter of \`order_date >= '2026-08-01'\` skips whole blocks without decompressing them. Execution then runs over batches of values in tight array loops rather than one row at a time through a tree of operators.

### What column stores are genuinely bad at

| Operation | Row store | Column store |
|---|---|---|
| Fetch one order by primary key | about 0.1 ms | slow, reassembled from many places |
| Update one row's status | in place, cheap | rewrite a file or write a delete marker |
| Insert a single row | cheap | a tiny file that needs compaction later |
| Sum two columns over a billion rows | reads everything | reads two columns |

Nothing here is free. Updating one order writes a tombstone plus a new version, and readers merge them on the fly. Do that a thousand times a minute and you get the small file problem: millions of tiny objects, a compaction job that never catches up, and queries that spend their time opening files. That is why checkout runs on Postgres and reporting runs somewhere else, and why serving both from one engine keeps failing.

### You already have one

Parquet is a column format sitting in a file, and DuckDB will query it on your laptop:

\`\`\`sql
SELECT strftime(order_date, '%Y-%m') AS month,
       SUM(quantity * unit_price)    AS revenue
FROM 'order_items_2026_*.parquet'
GROUP BY 1
ORDER BY 1;
\`\`\`

DuckDB reads the parquet footer, uses the per row group statistics to skip groups outside the date range, decompresses only the three columns named, and never touches the other thirty seven. That is the entire warehouse advantage, running against files in a folder.
      `,
        [
          q('An analyst runs SELECT AVG(unit_price) FROM order_items on a 900 million row Postgres table with nine columns. Why is it slow even though only one column is named?', [
            'Postgres has to build a hash table keyed by unit_price before it can average',
            'Rows are stored whole, so every page read drags all nine columns along',
            'NUMERIC arithmetic runs in software, and that dominates the total runtime',
            'The planner refuses an index here, so it falls back to a slower sort path',
          ], 1, 'A row store keeps every column of a row contiguous inside an 8 KB page, so reading one column means reading whole pages full of the other eight, and the bytes moved off disk are far larger than the data the query needs.'),
          q('Which workload is a column store worst at?', [
            'Summing one numeric column across four billion rows grouped by month',
            'Counting distinct values inside a low cardinality status column',
            'Scanning three columns out of forty for a yearly aggregate report',
            'Updating the status of a single order several times every minute',
          ], 3, 'Column stores have no cheap in place update, so changing one row writes a delete marker plus a new version that readers must merge, and doing that repeatedly produces the small file problem and compaction the engine cannot keep up with.'),
          q('Why does a status column holding three distinct values shrink far more in a column store than in a row store?', [
            'Its values sit in one contiguous run, so dictionary and run length coding apply',
            'Column stores drop low cardinality columns and rebuild them on each read',
            'Row stores must keep an uncompressed copy of every column for fast lookups',
            'The engine swaps the column for a foreign key pointing at a lookup table',
          ], 0, 'Compression works on similarity between neighbouring bytes, and in a column store the neighbours of a status value are other status values, so a dictionary plus run length encoding collapses billions of repeats that a row layout scatters between unrelated columns.'),
        ]
      ),
      lesson('Clustering, Scan Cost, and the Query That Costs Money', 13, `
A finance dashboard refreshed every five minutes against a 2.4 TB \`events\` table. Every panel started with \`SELECT * FROM events\` inside a CTE and filtered later. On demand BigQuery pricing is about $6.25 per TB scanned, so one refresh cost roughly $15, and 288 refreshes a day came to about $4,300. It ran for eleven days before anyone opened the billing page.

### You pay for bytes read, not rows returned

This is the rule that ambushes everyone who learned SQL on Postgres. The engine bills the bytes it had to read and decompress, and that number is fixed before a single row comes back.

| Query | Bytes scanned | Cost |
|---|---|---|
| \`SELECT * FROM events\` | 2.40 TB | $15.00 |
| \`SELECT * FROM events LIMIT 10\` | 2.40 TB | $15.00 |
| \`SELECT customer_id, event_ts FROM events\` | 180 GB | $1.13 |
| same, plus \`WHERE event_date = '2026-08-20'\` | 610 MB | $0.004 |

\`LIMIT\` saves nothing. Neither does \`ORDER BY\`, and neither does a filter on a column that is not the partition key or a cluster key. Only four things move the number: fewer columns, partition pruning, cluster pruning, and reading a smaller table.

Check before you run, every time, on any table you have not measured:

\`\`\`bash
bq query --dry_run --use_legacy_sql=false \\
  'SELECT customer_id, event_ts FROM shop.events WHERE event_date = "2026-08-20"'
# Query successfully validated.
# Assuming the tables are not modified, will process 639,631,360 bytes.
\`\`\`

### Clustering skips blocks inside a partition

Partitioning prunes at day granularity. Clustering sorts rows within each partition by the cluster keys and records a min and max per block, so a filter on a cluster key skips blocks the way a zone map does.

\`\`\`sql
CREATE TABLE shop.events
PARTITION BY event_date
CLUSTER BY customer_id, event_name
AS SELECT * FROM shop.events_raw;
\`\`\`

Order matters, and it is a prefix rule, exactly like the composite B-tree index from chapter 5. Filtering on \`customer_id\` prunes well. Filtering on \`customer_id\` and \`event_name\` prunes better. Filtering on \`event_name\` alone prunes almost nothing, because rows carrying one event name are scattered across every block. Teams discover this by putting their most selective column last and wondering why the bill never moved.

Clustering also decays. Streaming inserts arrive unsorted, and until the engine reclusters, pruning gets worse day by day.

### The four habits that move the bill

- Name your columns. \`SELECT *\` inside a CTE costs the same as \`SELECT *\` at the top.
- Compare the partition column to a literal or a constant expression. \`WHERE event_date = (SELECT MAX(day) FROM loads)\` cannot prune at plan time, so it reads everything.
- Materialise the rollup. A dashboard reading a 40 MB daily aggregate scans 40 MB. The pipeline pays the 2.4 TB scan once instead of 288 times.
- Cap the damage. A \`maximum_bytes_billed\` setting turns a runaway \`SELECT *\` into an error message instead of an invoice.

Snowflake bills warehouse seconds rather than bytes, which changes the arithmetic and not the lesson: pruning decides how long the warehouse stays awake. Compare \`partitions_scanned\` against \`partitions_total\` in \`QUERY_HISTORY\`, and set auto suspend to sixty seconds so an idle warehouse stops charging.

The dashboard above now costs about $9 a day. The fix was naming eleven columns and pointing it at a rollup table.
      `,
        [
          q('A warehouse query is SELECT * FROM events WHERE event_date = \'2026-08-20\' LIMIT 100, on a table partitioned by event_date. What decides the bytes billed?', [
            'The 100 rows returned, because billing follows the size of the result set',
            'The full table, because SELECT * defeats partition pruning altogether',
            'Every column of that one day\'s partition, because LIMIT reduces nothing',
            'One column of that day\'s partition, picked by the engine as the cheapest',
          ], 2, 'Partition pruning cuts the scan down to a single day, but LIMIT is applied after the read and so removes no bytes, which means SELECT * still bills every column of that partition.'),
          q('A table is clustered by (customer_id, event_name). Which filter prunes the fewest blocks?', [
            'WHERE customer_id = 88213',
            'WHERE event_name = \'checkout_complete\'',
            'WHERE customer_id = 88213 AND event_name = \'add_to_cart\'',
            'WHERE customer_id BETWEEN 88000 AND 88300',
          ], 1, 'Clustering sorts by the keys in order, so rows sharing an event name are scattered across every block unless customer_id is constrained first, and a filter that skips the leading key behaves like a query that ignores the first column of a composite index.'),
          q('A dashboard refreshes every five minutes and scans 2.4 TB each time. Which change removes the most cost while keeping the dashboard live?', [
            'Move the refresh schedule from every five minutes to every fifteen minutes',
            'Add a LIMIT so the engine can stop reading once enough rows are found',
            'Cluster the table on whichever column the dashboard groups its output by',
            'Point the dashboard at a daily rollup table the pipeline builds once a day',
          ], 3, 'A rollup table shrinks the object being scanned from terabytes to megabytes and shifts the one expensive scan to a single daily pipeline run, whereas a slower schedule only cuts the number of full price scans and LIMIT changes nothing at all.'),
        ]
      ),
      lesson('Approximate Answers: Sampling and HyperLogLog', 13, `
\`SELECT COUNT(DISTINCT customer_id) FROM orders JOIN order_items USING (order_id)\` over 900 million rows: 4 minutes 12 seconds, 30 GB spilled to disk, answer 8,412,663. The approximate version returned 8,398,105 in 3 seconds. The two differ by 0.17%. The dashboard that shows the number rounds to the nearest ten thousand.

### Why exact distinct is expensive

To count distinct values exactly you must remember every value you have seen, because the 900 millionth row might repeat the first. That means a hash set whose size grows with the number of distinct values, not with the size of your machine. Eight million integers fit in memory. Nine hundred million distinct session ids do not, so the engine spills, and the runtime stops being about the data and starts being about the disk.

### HyperLogLog remembers a shape

Hash each value to 64 bits. Take the first 14 bits as a bucket number, giving 16384 buckets. In the remaining bits, count the leading zeros and keep only the maximum ever seen for that bucket. A hash with 10 leading zeros turns up about once in 1024 values, so seeing one hints that roughly 1024 distinct values passed through. Average across the buckets, correct the bias, and the estimate lands within about 1.04 divided by the square root of 16384, which is 0.81%.

The sketch is 12 KB. It is 12 KB after a thousand values and 12 KB after a billion.

### The property that matters more than the speed

You cannot add distinct counts. You can union sketches. That one fact changes how you store daily metrics.

\`\`\`sql
-- WRONG: a customer who ordered on 12 days is counted 12 times
SELECT SUM(daily_uniques) AS august_uniques
FROM daily_customer_counts
WHERE day >= DATE '2026-08-01' AND day < DATE '2026-09-01';
\`\`\`

\`\`\`sql
-- once per day, over one day of rows
INSERT INTO daily_sketch (day, sketch)
SELECT order_date, hll_add_agg(hll_hash_integer(customer_id))
FROM orders
WHERE order_date = DATE '2026-08-24'
GROUP BY order_date;

-- any window at all, in milliseconds, without rescanning orders
SELECT hll_cardinality(hll_union_agg(sketch))::bigint AS august_uniques
FROM daily_sketch
WHERE day >= DATE '2026-08-01' AND day < DATE '2026-09-01';
\`\`\`

Thirty one rows of 12 KB answer a question that would otherwise scan a month of orders, and the same rows answer the weekly, quarterly and rolling 28 day versions for free. BigQuery spells it \`HLL_COUNT.INIT\` and \`HLL_COUNT.MERGE\`, and Redshift and Snowflake ship equivalents.

### Sampling, and where it lies

\`\`\`sql
SELECT COUNT(*) * 100 AS estimated_rows
FROM orders TABLESAMPLE SYSTEM (1);
\`\`\`

\`SYSTEM\` picks random pages, so it is fast, but every row on a chosen page rides along. If the table is physically ordered by date, a 1% page sample can miss entire weeks. \`BERNOULLI\` rolls the dice per row and is unbiased, yet it still reads the whole table, so it saves CPU and not IO.

| Question | Answered from a 1% sample |
|---|---|
| Median order value | fine |
| Share of orders that are refunded | fine, wider error bars |
| Orders shipped to Bhutan, twelve in total | breaks, often returns zero |
| \`MAX(order_total)\` | breaks, always underestimates |
| Revenue for the quarterly close | never |

Approximate for exploration, trends, dashboards and alert thresholds. Exact for invoices, regulatory filings, and anything a customer can count themselves. When you serve an estimate, label it: \`est. 8.40M unique customers\` costs one word and ends an argument before it starts.
      `,
        [
          q('You store one HLL sketch of customer_id per day. Marketing asks for unique customers across August. What is the correct move?', [
            'Union the 31 daily sketches, then read the cardinality of the result',
            'Sum the 31 daily cardinalities, then subtract an overlap correction',
            'Take the largest daily cardinality, since August cannot be smaller',
            'Average the 31 daily cardinalities and multiply the average by 31',
          ], 0, 'Distinct counts cannot be added because a customer active on several days would be counted once per day, but HLL sketches merge losslessly, so unioning the daily sketches and then taking cardinality gives the monthly figure without rescanning orders.'),
          q('Why is an HLL sketch roughly the same size for a thousand distinct values as for a billion?', [
            'It samples one row in a thousand, so its growth stays logarithmic in rows',
            'It keeps values until it hits a cap, then discards the least recent entries',
            'It holds a fixed number of buckets, each storing one leading zero count',
            'It compresses the list of stored values, and hash output compresses well',
          ], 2, 'The sketch allocates a fixed set of buckets, typically 16384, and each bucket only ever keeps the maximum leading zero count it has observed, so no value is retained and the memory footprint stays flat no matter how many distinct values arrive.'),
          q('Which question is TABLESAMPLE SYSTEM (1) least trustworthy for?', [
            'The median order value across the whole orders table',
            'The number of orders shipped to Bhutan, of which there are twelve',
            'The share of orders in the table whose status is refunded',
            'A rough row count for a table nobody has analysed recently',
          ], 1, 'A 1% page sample expects to see about one eighth of a row out of twelve, so a rare category usually comes back as zero, whereas medians and common proportions survive sampling because they depend on the bulk of the distribution.'),
        ]
      ),
      ],
      [
      q('A daily report filters WHERE DATE_TRUNC(\'month\', order_date) = DATE \'2026-08-01\' on a table partitioned by order_date, and it has been getting slower for a year. What is happening?', [
        'Autovacuum cannot keep up with a partitioned parent, so statistics are stale',
        'Each new monthly child adds planning time, which dominates the runtime',
        'The report keeps a snapshot open, so it reads older versions of every row',
        'The function hides the key from pruning, so every partition is scanned',
      ], 3, 'Pruning only matches filters written against the raw partition key, so DATE_TRUNC forces a scan of every child, and the query gets steadily slower as more months of history accumulate behind the parent.'),
      q('Why can a column store answer SUM(quantity * unit_price) grouped by month over 900 million rows while reading a small fraction of the bytes a row store must read?', [
        'Only the named columns are read, and each compresses hard because its values repeat',
        'It keeps a materialised total per month and refreshes that total after each write',
        'It samples a portion of the blocks and scales the result up to the full table',
        'It stores rows sorted by month, so the aggregate becomes an index only lookup',
      ], 0, 'Columnar layout puts each column in its own contiguous run, so a query naming three of forty columns touches three fortieths of the file, and neighbouring values within a column are similar enough that dictionary, run length and delta encoding shrink it further.'),
      q('A pipeline writes a daily table holding one row per day with a distinct customer count. Someone asks for unique customers in Q3. What should you have stored instead?', [
        'A daily count split by channel, so the quarterly figure can be recombined',
        'A daily HLL sketch, because sketches union while distinct counts cannot be added',
        'A daily sample of one percent of customer ids, scaled up at query time',
        'A daily maximum of the running distinct count taken across the quarter',
      ], 1, 'Summing daily distinct counts double counts every customer who returns, and no split or scaling fixes that, whereas HLL sketches can be unioned across any set of days to give a cardinality within roughly one percent.'),
      q('A BigQuery dashboard runs SELECT * FROM events WHERE event_date = CURRENT_DATE() LIMIT 50 every five minutes and the bill is enormous. Which change cuts the most cost?', [
        'Add ORDER BY event_ts so the engine can stop reading once it has enough',
        'Lower the LIMIT from 50 rows to 10 rows on every panel in the dashboard',
        'Name only the four columns the dashboard actually renders on the screen',
        'Add a second WHERE filter on a column that is neither partition nor cluster key',
      ], 2, 'The partition filter already cuts the scan to one day, so the remaining cost is width, and naming four columns instead of every column is the only listed change that reduces bytes scanned, since LIMIT, ORDER BY and non key filters are all applied after the read.'),
      ]
    ),
    chapter(
      'The Numbers the Company Runs On',
      'Modelling history so that last quarter still reports the same figure it did last quarter, and owning the definitions every dashboard in the company inherits.',
      [
      lesson('Star Schemas and Choosing the Grain', 13, `
Two dashboards, same database, same month. Finance reports March revenue of 461,204. The growth team reports 428,910. Nobody has a bug. Finance counts one row per order line and includes shipping; growth counts one row per paid order and drops refunds. The numbers differ because the two models were built at different **grains**, and nobody ever wrote the grain down.

### Declare the grain in one sentence

Grain is what exactly one row of a table means. You write it as a sentence before you choose a single column:

> One row per product line, per order.

If you cannot finish that sentence without the word "and" showing up twice, the table is trying to be two tables.

\`\`\`sql
CREATE TABLE fct_order_line (
  order_id        INTEGER NOT NULL,          -- degenerate dimension
  product_key     INTEGER NOT NULL REFERENCES dim_product(product_key),
  customer_key    INTEGER NOT NULL REFERENCES dim_customer(customer_key),
  date_key        INTEGER NOT NULL REFERENCES dim_date(date_key),
  quantity        INTEGER NOT NULL,
  gross_amount    NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, product_key)
);
\`\`\`

A fact table in the middle, dimensions around it: that shape is a **star schema**. The fact holds the numbers you add up plus the keys. The dimensions hold the words you slice by, such as \`dim_customer.city\`, \`dim_product.category\` and \`dim_date.fiscal_quarter\`.

\`order_id\` sits on the fact with no dimension table behind it. That is a **degenerate dimension** and it is entirely fine. You need it to count orders and to trace a row back to the source system.

### The mixed grain bug

An order costs 9.50 to ship. Somebody adds \`shipping_cost\` to the line grain fact and copies the same value onto every line:

\`\`\`sql
-- order 1001 has three lines
SELECT SUM(shipping_cost) FROM fct_order_line WHERE order_id = 1001;
-- 28.50, and the real figure is 9.50
\`\`\`

Shipping lives at order grain. Two honest fixes exist:

| Fix | Choose it when |
|---|---|
| Allocate the 9.50 across the three lines by value | You must report shipping per product category |
| Keep a separate \`fct_order\` table at order grain | You report shipping only per order |

What you never do is store an order level number on a line level row and trust every analyst to remember to divide.

### Additive, semi-additive, non-additive

\`gross_amount\` adds up correctly over every dimension, so it is **additive**. An inventory balance adds up across warehouses but not across days, so summing a month of daily stock levels produces nonsense: that is **semi-additive**, and you report a closing balance instead. A margin percentage is **non-additive**, because the average of ten order margins is not the margin of those ten orders.

Store the numerator and the denominator, then divide at the very end:

\`\`\`sql
SELECT p.category,
       SUM(f.gross_amount - f.discount_amount)
         / NULLIF(SUM(f.gross_amount), 0) AS net_rate
FROM fct_order_line f
JOIN dim_product p USING (product_key)
GROUP BY p.category;
\`\`\`

### Keys become surrogates

\`customer_key\` is an integer the warehouse generates, not \`customers.customer_id\` from the application. It costs one lookup at load time and buys two things: the fact keeps pointing at the right version of a customer even when the source reuses or renumbers an id, and history (the next topic) becomes possible at all.

Resist snowflaking, meaning splitting \`dim_product\` into product, subcategory and category tables to avoid repeated text. The saving is measured in megabytes. The cost is three extra joins in every query an analyst writes.

Finally, write the grain into the model's description and then test it:

\`\`\`sql
SELECT order_id, product_key, COUNT(*)
FROM fct_order_line
GROUP BY 1, 2
HAVING COUNT(*) > 1;
\`\`\`

Zero rows means the grain still holds. The day that query returns rows is the day your revenue quietly doubles.
      `,
        [
          q('fct_order_line holds one row per product line per order, and a teammate adds an order level shipping_cost copied onto every line. What breaks first?', [
            'The primary key on (order_id, product_key) starts rejecting valid rows',
            'Slicing shipping by product category returns NULL for every category',
            'SUM(shipping_cost) multiplies each order\'s shipping by its line count',
            'The dimension joins fan out and duplicate every customer attribute',
          ], 2, 'The column sits at order grain inside a line grain table, so a three line order stores 9.50 three times and any SUM across lines counts it three times over.'),
          q('Why should the fact table store gross_amount and discount_amount rather than a precomputed margin_pct on each row?', [
            'A percentage is non-additive, so summing or averaging it across rows gives a wrong number',
            'Percentages force floating point, which a fact table cannot store safely at any scale',
            'Storing it breaks the star schema rule that facts may hold only foreign keys',
            'The planner refuses to build an index over a stored computed numeric column',
          ], 0, 'Percentages cannot be added or averaged across rows, so you store the numerator and denominator and divide once at the end of the aggregation.'),
          q('A team proposes splitting dim_product into product, subcategory and category tables to remove repeated text. What is the main argument against it?', [
            'Foreign keys between two dimension tables are rejected by most warehouses',
            'It leaves the grain of the fact table ambiguous for every query written',
            'Category names would then change without the fact rows ever noticing it',
            'It saves very little storage and adds joins to every analyst query',
          ], 3, 'Snowflaking trades megabytes of saved storage for extra joins in every single query, which is a bad deal in a model built for people to query by hand.'),
        ]
      ),
      lesson('Slowly Changing Dimensions and As-Of Joins', 13, `
Ayesha Khan moved from Lahore to Karachi on 12 June. The next morning a load job ran \`UPDATE dim_customer SET city = 'Karachi' WHERE customer_id = 7\`. In July somebody reran last year's regional report and 41,300 of revenue jumped out of Lahore and into Karachi. Lahore earned that money. The report now lies about it, and it will keep lying every time it runs.

### Three ways to handle a changed attribute

| Type | What happens | Use it when |
|---|---|---|
| Type 1 | Overwrite the old value | Fixing a typo in a name |
| Type 2 | Close the old row, insert a new one | Anything you report by |
| Type 3 | Keep a \`previous_city\` column | You need exactly one step back |

Type 1 is not the simple option. It is a decision to have no history.

### Type 2 in practice

\`\`\`sql
CREATE TABLE dim_customer (
  customer_key BIGSERIAL PRIMARY KEY,   -- surrogate, warehouse generated
  customer_id  INTEGER NOT NULL,        -- natural key from the app
  name         TEXT NOT NULL,
  city         TEXT,
  valid_from   DATE NOT NULL,
  valid_to     DATE NOT NULL DEFAULT DATE '9999-12-31',
  is_current   BOOLEAN NOT NULL DEFAULT TRUE
);
\`\`\`

\`\`\`text
customer_key | customer_id | city    | valid_from | valid_to   | is_current
 4188        | 7           | Lahore  | 2023-02-01 | 2025-06-12 | false
 9052        | 7           | Karachi | 2025-06-12 | 9999-12-31 | true
\`\`\`

Two rules keep this honest. The closed row's \`valid_to\` equals the new row's \`valid_from\`, and every lookup uses a **half open** interval: \`valid_from <= d AND d < valid_to\`. Get that wrong in either direction and 12 June breaks. Close at \`2025-06-11\` and query with \`BETWEEN\` and the customer vanishes for a day. Close at \`2025-06-12\` and query with \`BETWEEN\` and both rows match, so that day's revenue is counted twice.

Second rule: never use \`NULL\` for the open ended row. \`d < NULL\` evaluates to unknown rather than true, so every current customer silently disappears from the join. Use \`9999-12-31\` or \`'infinity'::date\` and the comparison keeps working.

### The as-of join

The fact stores \`customer_key\`, resolved at load time to the version in force when the order happened, so a historical report is just a normal equi-join. Resolving it from a source that only carries \`customer_id\` looks like this:

\`\`\`sql
SELECT o.order_id, o.order_date, d.customer_key, d.city
FROM orders o
JOIN dim_customer d
  ON d.customer_id = o.customer_id
 AND o.order_date >= d.valid_from
 AND o.order_date <  d.valid_to;
\`\`\`

That is an as-of join. It is a non equi join, so the planner reaches for a nested loop or a range scan, never a plain hash join. On Postgres, give it a range index:

\`\`\`sql
ALTER TABLE dim_customer ADD COLUMN validity daterange
  GENERATED ALWAYS AS (daterange(valid_from, valid_to, '[)')) STORED;
CREATE INDEX ON dim_customer USING gist (customer_id, validity);
\`\`\`

Then join with \`o.order_date <@ d.validity\`.

### Test for overlaps every load

One overlapping pair of versions duplicates fact rows, and duplication inside a dimension stays invisible until somebody notices revenue is 3% high:

\`\`\`sql
SELECT a.customer_id, a.customer_key, b.customer_key
FROM dim_customer a
JOIN dim_customer b
  ON a.customer_id = b.customer_id
 AND a.customer_key < b.customer_key
 AND a.valid_from < b.valid_to
 AND b.valid_from < a.valid_to;
\`\`\`

Zero rows, or the load has failed. Postgres will enforce it outright with \`EXCLUDE USING gist (customer_id WITH =, validity WITH &&)\`.

### Do not Type 2 everything

A colleague adds \`lifetime_value\` to \`dim_customer\`. It moves with every order, so a Type 2 dimension over 200,000 customers becomes tens of millions of rows within a year, and every as-of join drags. Track history on the attributes you slice reports by: city, plan tier, sales region. Numbers that change continuously belong in a fact table or a periodic snapshot, not in a dimension.
      `,
        [
          q('A Type 2 dimension closes a row with valid_to set to the same date as the new row\'s valid_from, and reports join with BETWEEN valid_from AND valid_to. What happens on the changeover date?', [
            'The customer drops out of the report for exactly that single day',
            'Both versions match, so that day\'s revenue for them is counted twice',
            'The join quietly falls back to whichever row has is_current set',
            'The range index is bypassed and the join degrades to a scan',
          ], 1, 'BETWEEN is inclusive at both ends, so a date equal to the old row\'s valid_to and the new row\'s valid_from satisfies both rows and the fact joins to two dimension versions.'),
          q('Why is NULL a poor choice for valid_to on the current row of a Type 2 dimension?', [
            'Most engines refuse to build a range index over a nullable date column',
            'It makes the is_current flag impossible to derive from the row itself',
            'NULL sorts after every real date and reverses the version ordering',
            'Comparing a date against NULL yields unknown, so current rows match nothing',
          ], 3, 'The predicate order_date < NULL is unknown rather than true, so the as-of join silently drops every customer whose current version is still open.'),
          q('A colleague wants lifetime_value, which changes with every order, tracked as a Type 2 column on dim_customer. What is the concrete cost?', [
            'The dimension gains a row per customer per order and every join slows',
            'Lifetime value cannot legally be stored as NUMERIC inside a dimension',
            'Type 2 columns are overwritten on change, so the history is lost anyway',
            'The surrogate key stops being unique once versions share a natural key',
          ], 0, 'Type 2 creates a new version row on every change, so an attribute that moves with each order turns a 200,000 row dimension into tens of millions of rows.'),
        ]
      ),
      lesson('Late Arriving Data, Backfills, and Restatements', 13, `
On Tuesday the board deck says Monday's revenue was 84,120. On Thursday someone reruns the same query for the same Monday and gets 86,410. No code changed and no bug was fixed. A payment provider delivered 2,290 of orders two days late and the model absorbed them without a word.

### Two timestamps, never one

Every row landing in a warehouse needs both of these:

| Column | Means | Used for |
|---|---|---|
| \`occurred_at\` | when the thing actually happened | grouping, reporting, partitioning |
| \`loaded_at\` | when the row reached your system | incremental filters, replay, debugging |

Report on \`occurred_at\`. Load on \`loaded_at\`. Confusing the two produces both failures below.

### The incremental filter that loses rows forever

Here is the broken incremental model almost everybody writes first:

\`\`\`sql
-- broken
INSERT INTO fct_order_line
SELECT ... FROM raw_orders
WHERE occurred_at > (SELECT MAX(occurred_at) FROM fct_order_line);
\`\`\`

The 02:00 run sees data up to Monday 23:00 and sets the watermark there. A Monday 21:40 order arrives at 03:00 on Tuesday. Its event time sits below the watermark, so no future run ever picks it up. The row exists in the source, is missing from every report, and nothing errors.

The fix is to advance on arrival time and rewrite whole days of event time:

\`\`\`sql
BEGIN;
DELETE FROM fct_order_line
 WHERE order_date >= CURRENT_DATE - INTERVAL '3 days';

INSERT INTO fct_order_line
SELECT ... FROM raw_orders
 WHERE occurred_at >= CURRENT_DATE - INTERVAL '3 days';
COMMIT;
\`\`\`

Delete plus insert over the same window, inside one transaction, is idempotent. Run it five times and the day still holds exactly one copy. That window is a **lookback**, and you size it from evidence rather than taste:

\`\`\`sql
SELECT PERCENTILE_CONT(0.999) WITHIN GROUP (
         ORDER BY EXTRACT(EPOCH FROM loaded_at - occurred_at) / 3600
       ) AS p999_hours
FROM raw_orders
WHERE loaded_at > NOW() - INTERVAL '90 days';
\`\`\`

If that comes back as 26 hours, a three day lookback covers you comfortably. If it comes back as 9 days, either widen the window or schedule a monthly full refresh for the tail.

### Facts that arrive before their dimension

An order references \`customer_id\` 91004 and \`dim_customer\` has never seen it. Three responses are available and only one is right.

Dropping the fact loses revenue. Storing a \`NULL\` key loses the same revenue more quietly, because the inner join in every report throws the row away. Instead insert an **inferred member**: a \`dim_customer\` row carrying that natural key, \`name = 'Unknown'\`, flagged, and let the next dimension load fill in the real attributes. Revenue totals stay correct, the slice by city is briefly wrong, and one query tells you exactly how wrong:

\`\`\`sql
SELECT COUNT(*), SUM(f.gross_amount)
FROM fct_order_line f
JOIN dim_customer d USING (customer_key)
WHERE d.is_inferred;
\`\`\`

Keep one permanent row at \`customer_key = -1\` for keys that will never resolve, so joins never silently drop anything.

### Restating a number people already saw

Late data guarantees that yesterday's published figure will move. That is survivable if you can explain the move, which means keeping what you published:

\`\`\`sql
CREATE TABLE revenue_snapshot (
  as_of_date DATE NOT NULL,          -- the day the number was computed
  order_date DATE NOT NULL,          -- the day being reported on
  revenue    NUMERIC(14,2) NOT NULL,
  PRIMARY KEY (as_of_date, order_date)
);
\`\`\`

Now "what did we report on 1 April for March?" is a query rather than an argument, and the gap between two snapshots is the restatement itself.

Agree the policy before you need it. Periods older than a fixed close date, say the fifth working day of the following month, are frozen, and any correction after that is a visible restatement with a written reason. Everything newer moves freely and is labelled provisional on the dashboard, so nobody quotes a number in a board meeting that the pipeline still considers a draft.
      `,
        [
          q('An incremental model filters on occurred_at greater than MAX(occurred_at) in the target. An order made at 21:40 Monday is delivered by the provider at 03:00 Tuesday, after the 02:00 run. What happens to it?', [
            'It loads on the next run under Tuesday\'s date, shifting revenue a day',
            'The run fails its uniqueness check and the row is held for review',
            'It is never loaded, because its event time sits below the watermark',
            'It loads on every later run and inflates Monday\'s revenue each time',
          ], 2, 'The watermark already moved past 21:40 Monday, so the late row fails the filter on every future run and disappears from reporting without raising any error.'),
          q('Why is deleting the last three days and reinserting them inside one transaction safe to re-run repeatedly?', [
            'The DELETE holds a lock that stops any second run from ever starting',
            'Each run rebuilds those days from scratch, so the result is identical',
            'Rows already present get skipped by the primary key on the fact table',
            'The transaction rolls itself back when the two row counts disagree',
          ], 1, 'Rewriting a whole window rather than appending to it makes the operation idempotent, so running it once or five times leaves exactly one copy of each day.'),
          q('A fact row arrives for customer_id 91004, which dim_customer has never seen. Which handling keeps total revenue correct?', [
            'Hold the fact in a reject table until the dimension load catches up',
            'Store a NULL customer_key and let the reporting join resolve it later',
            'Drop the row and log it, since a fact without a dimension is invalid',
            'Insert an inferred dimension row now and enrich its attributes later',
          ], 3, 'An inferred member gives the fact a real key immediately, so the revenue total stays right and only the slice by customer attributes is temporarily unknown.'),
        ]
      ),
      lesson('Metric Contracts, Row-Level Security, and Audit Trails', 13, `
A board meeting stalls for eleven minutes because "active customers" reads 18,400 in the growth deck and 12,950 in the finance deck. Growth counts anyone with a session in the last 30 days. Finance counts anyone with a paid order in the last 90 days. Both are defensible. Neither was written down anywhere, so the meeting had to discover it live.

### A metric contract

A metric is a product with an owner, not a snippet somebody pasted into a dashboard. Write the contract next to the SQL:

\`\`\`yaml
metric: net_revenue
owner: finance-data@shop.example
grain: one row per order line
sql: SUM(gross_amount - discount_amount)
filters: status = 'paid'        # refunds live in refunded_revenue
dimensions: [order_date, city, category, channel]
excludes: [internal accounts where customers.is_internal]
frozen_after_close: true
tests: [not_null, non_negative, reconciles_to_ledger_within_0_5_pct]
\`\`\`

Two clauses do most of the work. \`dimensions\` is the allowed slice list: if the metric is not valid by \`city\` because billing city and shipping city disagree, say so here instead of letting a dashboard quietly offer the dropdown. And \`filters\` is why two teams stop arguing, because exactly one place decides that \`status = 'paid'\`.

Then serve it from one model. If \`net_revenue\` is spelled out inside nine dashboards, you do not have one metric, you have nine metrics that happen to share a name.

### Row level security

Regional managers should see their own region only. Enforcing that with a \`WHERE\` clause in the BI tool means one forgotten filter leaks the whole company.

\`\`\`sql
ALTER TABLE fct_order_line ENABLE ROW LEVEL SECURITY;
ALTER TABLE fct_order_line FORCE ROW LEVEL SECURITY;

CREATE POLICY region_read ON fct_order_line
  FOR SELECT TO analyst
  USING (region = current_setting('app.region', true));
\`\`\`

Three details catch people out:

- The table **owner** bypasses every policy unless you add \`FORCE ROW LEVEL SECURITY\`. Testing as the owner shows you all the rows and proves nothing at all.
- A superuser, and any role holding \`BYPASSRLS\`, ignores policies completely. Your nightly job connecting as \`postgres\` still reads everything, which is usually intended and occasionally a nasty surprise.
- Policies are per command. A \`SELECT\` policy on its own does nothing to stop an \`UPDATE\`.

Verify by becoming the real role:

\`\`\`sql
SET ROLE analyst;
SET app.region = 'North';
SELECT COUNT(*) FROM fct_order_line;   -- the North count, not the total
\`\`\`

Column exposure is a separate lever. \`GRANT SELECT (order_id, order_date, gross_amount) ON fct_order_line TO analyst;\` keeps an email or a salary column out of reach without maintaining a second table.

### Audit trails, both kinds

You need two histories and most teams build neither.

| History of | Answers the question |
|---|---|
| Data access | Who read the customer table, and when |
| Definition changes | Why the chart stepped up on 14 March |

The second one saves meetings. Version the definitions themselves:

\`\`\`sql
CREATE TABLE metric_definition (
  metric     TEXT NOT NULL,
  version    INTEGER NOT NULL,
  sql_body   TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  reason     TEXT NOT NULL,
  valid_from DATE NOT NULL,
  valid_to   DATE NOT NULL DEFAULT DATE '9999-12-31',
  PRIMARY KEY (metric, version)
);
\`\`\`

That is the Type 2 pattern from topic two turned on your own definitions. When net revenue jumps 6% on 14 March, an as-of join against this table shows that internal accounts started being excluded that morning, and the discussion ends in ten seconds rather than ten days.

For access logging, capture it at the database (\`pgaudit\`, or your warehouse's query history view) rather than inside the BI tool, because the BI tool only ever sees the queries that went through the BI tool. Write that log somewhere the audited accounts cannot rewrite it: append only, a separate account, retained for as long as your policy claims.
      `,
        [
          q('You enable row level security on fct_order_line, add a SELECT policy, then test as the table\'s owner and still see every row. What is the likeliest explanation?', [
            'The owner bypasses policies unless FORCE ROW LEVEL SECURITY is set',
            'A new policy applies only after the table statistics are refreshed',
            'A SELECT policy needs a matching INSERT policy before it takes effect',
            'current_setting returned NULL, so the policy matched every row instead',
          ], 0, 'Postgres exempts the table owner from its own policies by default, so a test run as the owner tells you nothing until FORCE ROW LEVEL SECURITY is enabled.'),
          q('What does the dimensions list inside a metric contract actually prevent?', [
            'Two teams computing the same metric with different date filters',
            'A dashboard aggregating a percentage across far too many rows',
            'A dashboard slicing the metric by a field it is not valid for',
            'Analysts querying the fact table without the required index',
          ], 2, 'Naming the valid slices stops a tool offering a breakdown the metric cannot support, such as splitting revenue by a city field that mixes billing and shipping.'),
          q('A revenue chart steps up 6% on 14 March with no change in order volume. Which stored artefact explains the step fastest?', [
            'The access log showing which accounts queried the fact that morning',
            'A versioned metric definition table with valid_from and a reason',
            'The snapshot of the number as it was published on each past date',
            'The BI tool\'s cache invalidation history for that dashboard tile',
          ], 1, 'Versioning the definition records that the SQL changed on 14 March and why, which is the only artefact that turns an unexplained step into a one line answer.'),
        ]
      ),
      ],
      [
      q('Which single sentence should be settled before any column of a fact table is chosen?', [
        'Which dimensions the business is permitted to slice this table by',
        'Which columns need an index to keep the nightly load inside its window',
        'Which source system wins when two of them disagree about a value',
        'What exactly one row of this table means, stated as one sentence',
      ], 3, 'The grain decides which measures may live on the table at all, and a column at the wrong grain silently multiplies its value across the rows below it.'),
      q('March closed at 461,204 and that figure was published. In April a batch of late orders dated 28 March arrives. Under a sane restatement policy, what happens?', [
        'The March figure is quietly recomputed so every report agrees again',
        'March stays frozen and the correction ships as a visible restatement',
        'The late rows are discarded, since their reporting period is closed',
        'The rows load under an April date so no published number changes',
      ], 1, 'Closed periods are frozen so a number quoted last month still holds, and the correction is published deliberately with a reason rather than moving history in silence.'),
      q('dim_customer is Type 2 and a customer moved from Lahore to Karachi in June. Last year\'s regional report is rerun and Lahore\'s revenue is unchanged. Why?', [
        'The fact rows point at the customer_key that was current back then',
        'Type 2 overwrites the old value but preserves it in a backup column',
        'The report joins on is_current, which pins it to the Lahore version',
        'Revenue is stored per city on the fact, so the dimension is unused',
      ], 0, 'Each fact row was loaded with the surrogate key of the dimension version in force at the time, so it keeps resolving to the Lahore row no matter what changes later.'),
      q('Regional analysts must see only their own region in the warehouse. Which approach actually enforces that?', [
        'A view per region plus a BI tool filter each analyst configures',
        'Column grants on the sensitive fields plus a shared read only login',
        'Row level security with FORCE enabled, tested as the analyst role',
        'A nightly export per region into separate schemas owned by an admin',
      ], 2, 'A policy enforced by the database applies to every connection regardless of the tool, and forcing it plus testing as the real role proves the owner exemption is closed.'),
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
      q('A report that returns the three most recent paid orders per customer ranks all 1.2 million orders with ROW_NUMBER() and takes 4.1 seconds. It is rewritten as LEFT JOIN LATERAL (SELECT ... ORDER BY order_date DESC LIMIT 3) ON true, and it is still slow. What else has to change before the rewrite pays off?', [
      'Replace LEFT JOIN LATERAL with CROSS JOIN LATERAL, so the planner may push the customer predicate into the subquery',
      'Move the ORDER BY and LIMIT out to the outer query, so each customer\'s orders are sorted only once at the end',
      'Add an index on orders (customer_id, order_date DESC) WHERE status = \'paid\', so each of the 40,000 loops stops after three entries',
      'Wrap the lateral subquery in a MATERIALIZED CTE, so its result is computed once instead of once per customer',
    ], 2, 'LATERAL only wins when each per customer execution is cheap, so without an index on (customer_id, order_date DESC) restricted to paid orders every one of the 40,000 loops still scans and sorts that customer\'s orders, and the rewrite has merely traded one large sort for 40,000 small ones. With the index in place each loop walks three entries and stops, which is why the plan then reads Index Scan with rows=3 under a Nested Loop.'),
    q('A query with WHERE c.email = \'ayesha@example.com\' OR o.order_id = 41207 across joined customers and orders runs in 3.2 seconds. Split into two branches combined with UNION it runs in 6 ms. A teammate then swaps UNION for UNION ALL to save the deduplication step. What does that risk?', [
      'An order satisfying both branches is now returned twice, because nothing removes the duplicate the two branches produce',
      'Nothing at all, because the two branches read different tables and therefore cannot return the same order_id twice',
      'The planner loses the index scan on the second branch, because UNION ALL rules out the sort based plan it relied on',
      'The rows arrive in branch order rather than sorted order, so a client paging through the result will skip rows',
    ], 0, 'The OR to UNION rewrite works because each branch gets its own index scan, but UNION removes duplicates while UNION ALL does not, so if order 41207 happens to belong to Ayesha it now appears once from each branch and the result counts it twice. UNION ALL is the right choice only when the branches provably cannot overlap.'),
    q('In customers, city = \'Lahore\' AND country = \'Pakistan\' matches 41,204 rows, but the planner multiplies the two selectivities, estimates 1,520 rows, and chooses a nested loop that probes orders once per outer row. Why does the query not recover once the real row count turns up during execution?', [
      'It does switch to a hash join, but only after the outer side has spilled to disk, which costs more than the switch saves',
      'It recovers once the first thousand probes are cached, but by then the sort feeding the join has already been written out',
      'It would recover if work_mem allowed a hash table, and an index probe never allocates enough memory to trigger the switch',
      'The plan is chosen before execution begins and never changes mid flight, so all 41,204 index probes are made one at a time',
    ], 3, 'The planner assumes the two predicates are independent and multiplies them, missing that city determines country, and Postgres then executes the plan it committed to rather than reconsidering the join method partway through, so a 27x underestimate becomes 41,204 separate probes. The fix has to arrive before planning, in the form of an extended statistics object on the correlated columns.'),
    q('order_items holds 40,000 live rows in 9.1 GB, pg_stat_user_tables shows a huge n_dead_tup alongside a last_autovacuum from ten minutes ago, and the morning dashboards take 40 seconds. A colleague proposes lowering autovacuum_vacuum_scale_factor on the table. Why will that not fix it?', [
      'Dead row versions can only be removed by VACUUM FULL, so autovacuum could never have reclaimed this space at any threshold',
      'Autovacuum is already running and is not permitted to remove those rows, because an old open transaction is pinning the horizon',
      'The scale factor governs ANALYZE rather than VACUUM, so the setting that needs lowering is autovacuum_analyze_scale_factor',
      'Per table storage parameters stop being honoured once a table passes a few gigabytes, so the override never takes effect',
    ], 1, 'A recent last_autovacuum together with millions of dead tuples is the tell that vacuum ran and found nothing it was allowed to reclaim, because the oldest transaction anywhere in the cluster sets the horizon and vacuum will not clean past it. Making autovacuum wake up more often changes nothing until that session is found and closed.'),
    q('A BigQuery events table is partitioned by event_date and clustered by (customer_id, event_name). A dashboard names its columns and filters one event_date and one event_name, yet it still scans nearly the whole day\'s partition. What explains the missing cluster pruning?', [
      'Cluster pruning applies only within the partition key\'s own blocks, so a day that was already pruned cannot be pruned further',
      'String columns carry no block level min and max in a clustered table, so a filter on event_name is unable to skip anything',
      'Cluster keys prune on a prefix, so filtering the second key without the first leaves matching rows spread across every block',
      'Clustering is applied at query time only for aggregates, so a query selecting raw columns never benefits from the stored sort',
    ], 2, 'Clustering sorts rows inside each partition by the key list in order and records a min and max per block, which makes it a prefix rule exactly like a composite B-tree index, so a filter that skips customer_id and constrains only event_name finds matching rows scattered through every block and eliminates none of them. Putting the column you actually filter on first is what moves the bytes billed.'),
    q('An incremental model loads with WHERE occurred_at > (SELECT MAX(occurred_at) FROM fct_order_line). The 02:00 run reads source data up to Monday 23:00. A payment provider then delivers an order that happened at 21:40 on Monday at 03:00 on Tuesday. What happens to that order?', [
      'It is never loaded, because its event time already sits below the watermark that the earlier run advanced past it',
      'It is loaded on Tuesday night, because the following run compares against the maximum loaded_at rather than occurred_at',
      'It is loaded twice, because both of Tuesday\'s runs see it as newer than the maximum event time recorded so far',
      'It fails the insert, because a fact row dated Monday violates the target partition that Tuesday\'s run is writing into',
    ], 0, 'A watermark advanced on event time permanently excludes anything that arrives late carrying an earlier occurred_at, and nothing errors, so the row sits in the source and is missing from every report. Filtering on arrival time and rewriting a few whole days of event time with a delete plus insert inside one transaction is what makes the load both complete and safe to re run.'),
    q('In PostgreSQL, which WHERE clause finds every product whose name starts with \'usb\', whatever the letter case?', [
      'WHERE name LIKE \'usb%\'',
      'WHERE name = \'usb%\'',
      'WHERE name ILIKE \'usb%\'',
      'WHERE UPPER(name) LIKE \'usb%\'',
    ], 2, 'ILIKE is PostgreSQL\'s case-insensitive LIKE and \'usb%\' anchors the match at the start; LIKE is case-sensitive, = treats % literally, and an upper-cased name can never start with lowercase usb.'),
    q('What does `SELECT customer_id FROM customers EXCEPT SELECT customer_id FROM orders` return?', [
      'Customers who have never placed an order, each listed once',
      'Customers who have placed at least one order',
      'Every customer, with one row per order they placed',
      'Orders whose customer no longer exists in customers',
    ], 0, 'EXCEPT returns the distinct rows of the first query that do not appear in the second, so it lists the customer ids with no matching order.'),
    q('The name column (TEXT) of one customers row holds \'Ayesha Khan \' with a trailing space. Which filter still finds that row?', [
      'WHERE name = \'Ayesha Khan\'',
      'WHERE name LIKE \'Ayesha Khan\'',
      'WHERE UPPER(name) = \'AYESHA KHAN\'',
      'WHERE TRIM(name) = \'Ayesha Khan\'',
    ], 3, 'TRIM removes the leading and trailing spaces before comparing; without it, the invisible space makes the equality, the wildcard-free LIKE and the UPPER comparison all fail.'),
    q('orders has six rows whose customer_id values are 1, 1, 2, 3, 3 and 3. What does `COUNT(DISTINCT customer_id)` return?', [
      '6',
      '3',
      '2',
      '4',
    ], 1, 'COUNT(DISTINCT ...) counts each different non-NULL value once, and the column holds three different customers.'),
    q('A query ends with `GROUP BY country, status`. How many rows does it return?', [
      'One row per country, with statuses summed inside',
      'One row per status, summed across every country',
      'One row per country and status pair found in the data',
      'Every country paired with every possible status',
    ], 2, 'GROUP BY produces exactly one row per distinct combination of the grouping columns that exists in the rows; combinations with no rows do not appear.'),
    q('The paid order values are 120, 210, 300 and 645. What does `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_value)` return?', [
      '255',
      '210',
      '300',
      '318.75',
    ], 0, 'With an even number of values, PERCENTILE_CONT interpolates halfway between the two middle values, 210 and 300, giving 255; 318.75 is the mean.'),
    q('A sizes table has 3 rows and a colours table has 4 rows. How many rows does `sizes CROSS JOIN colours` return?', [
      '7 rows',
      '4 rows',
      '3 rows',
      '12 rows',
    ], 3, 'A CROSS JOIN pairs every row on the left with every row on the right, so it returns 3 × 4 = 12 rows.'),
    q('In employees, manager_id points at another employee\'s employee_id, and the CEO\'s manager_id is NULL. Which FROM clause lists every employee, including the CEO, next to their manager?', [
      'employees e JOIN employees m ON e.manager_id = m.employee_id',
      'employees e LEFT JOIN employees m ON e.manager_id = m.employee_id',
      'employees e LEFT JOIN employees m ON e.employee_id = m.manager_id',
      'employees e CROSS JOIN employees m WHERE e.manager_id IS NULL',
    ], 1, 'The self-join matches each employee\'s manager_id to another row\'s employee_id, and LEFT JOIN keeps the CEO with a NULL manager instead of dropping them.'),
    q('For a single currency, rates has one row per period: valid_from is the first day a rate applies and valid_to is the first day it no longer applies. Which join condition matches every order to the rate in effect on its order date, and to no other?', [
      'o.order_date BETWEEN r.valid_from AND r.valid_to',
      'r.valid_from < o.order_date AND o.order_date <= r.valid_to',
      'o.order_date >= r.valid_from AND o.order_date < r.valid_to',
      'o.order_date = r.valid_from OR o.order_date = r.valid_to',
    ], 2, 'With valid_to as an exclusive end, the half-open range includes the start day and excludes the end day, so an order on a changeover date gets only the new rate; BETWEEN matches both rates, and the reversed bounds give the old one.'),
    q('Product revenues are 900, 135, 120, 120 and 100. With `DENSE_RANK() OVER (ORDER BY revenue DESC)`, what does the product with 100 receive?', [
      '5',
      '3',
      '6',
      '4',
    ], 3, 'DENSE_RANK gives both 120s rank 3 and does not skip a number, so 100 is ranked 4; RANK would give it 5.'),
    q('What does `SUM(order_value) OVER (PARTITION BY customer_id)` add to each order row?', [
      'That customer\'s total order value, with the row count unchanged',
      'The grand total of all orders, repeated on every row',
      'A running total that resets when the customer changes',
      'One row per customer, replacing the individual orders',
    ], 0, 'A window with PARTITION BY and no ORDER BY sums over the whole partition, so every row shows its customer\'s total and no rows are collapsed.'),
    q('What does `SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.status = \'paid\')` return?', [
      'Each customer once for every paid order they placed',
      'Customers with no paid orders at all',
      'Each customer with at least one paid order, listed once',
      'Only the single customer with the most paid orders',
    ], 2, 'EXISTS is true as soon as one matching paid order is found, so each qualifying customer appears once, with no join fan-out.'),
    q('staging.price_text holds values such as \'45.00\' and \'\'. Which expression converts it to a number, turning empty strings into NULL instead of raising an error?', [
      'CAST(TRIM(price_text) AS NUMERIC)',
      'CAST(NULLIF(TRIM(price_text), \'\') AS NUMERIC)',
      'COALESCE(CAST(price_text AS NUMERIC), 0)',
      'CAST(COALESCE(price_text, \'0\') AS NUMERIC)',
    ], 1, 'NULLIF turns the empty string into NULL before the cast, and casting NULL gives NULL; the other forms still try to cast \'\' and fail.'),
    q('order_items.order_id has a foreign key referencing orders(order_id). An import tries to insert a line with order_id 9999, which does not exist in orders. What happens?', [
      'The row is inserted and order 9999 is created automatically',
      'The row is inserted with order_id quietly set to NULL',
      'The row is inserted, and a warning is written to the log',
      'The insert is rejected with a foreign key violation',
    ], 3, 'A foreign key makes an orphan line impossible: the database refuses any order_id that has no matching row in orders.'),
    q('A products table stores category_name and category_manager on every product row, and the manager depends only on the category. What is the normalisation fix?', [
      'Add a CHECK constraint that compares the two columns',
      'Copy category_manager onto every order line as well',
      'Move them into a categories table that products reference',
      'Index category_manager so updates to it run faster',
    ], 2, 'The manager is a fact about the category, not the product, so storing it per product repeats it; a categories table stores it once and products reference it.'),
    q('You run BEGIN; and then an UPDATE that should touch 47 rows, but it reports UPDATE 4700. What should you do?', [
      'Run ROLLBACK, since nothing has been committed yet',
      'Run COMMIT and then write a second UPDATE to reverse it',
      'Close the console, which saves the change automatically',
      'Run VACUUM so the old row versions come back',
    ], 0, 'Inside an open transaction the change is not yet permanent, and ROLLBACK discards it, which is why wrapping risky writes in BEGIN is a safety net.'),
    q('customers has a unique constraint on email. What does `INSERT INTO customers (email, name) VALUES (\'a@shop.com\', \'Ali\') ON CONFLICT (email) DO NOTHING` do when that email already exists?', [
      'Overwrites the existing row\'s name with \'Ali\'',
      'Raises a unique violation and aborts the statement',
      'Inserts a second row with the same email address',
      'Skips the insert without an error, leaving the row as is',
    ], 3, 'DO NOTHING is the insert-if-absent form: a conflicting row is skipped silently and the existing row is left unchanged.'),
    q('New orders were inserted a minute ago. Which of these returns them immediately?', [
      'A materialised view that was last refreshed an hour ago',
      'A plain view defined over the orders table',
      'A CSV export of the orders table made this morning',
      'A summary table rebuilt by last night\'s scheduled job',
    ], 1, 'A plain view stores only its query and runs it against the current tables on every read, while a materialised view keeps its stored result until it is refreshed.'),
    q('Following the convention that a data test returns zero rows when all is well, which query checks for order lines whose order does not exist?', [
      'SELECT COUNT(*) FROM order_items oi JOIN orders o ON o.order_id = oi.order_id',
      'SELECT oi.* FROM order_items oi JOIN orders o ON o.order_id = oi.order_id',
      'SELECT oi.* FROM order_items oi LEFT JOIN orders o ON o.order_id = oi.order_id WHERE o.order_id IS NULL',
      'SELECT o.* FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.order_id WHERE oi.order_id IS NULL',
    ], 2, 'The anti-join returns only lines with no matching order, so it yields zero rows when every line has a parent; the reversed version finds orders without lines instead.'),
    q('Paid sales cover 2 countries, and each country has sales in the same 3 categories. How many rows does `GROUP BY ROLLUP (country, category)` return?', [
      '6',
      '8',
      '12',
      '9',
    ], 3, 'ROLLUP returns the 6 country and category rows, one subtotal per country (2 rows) and one grand total, for 9 rows.'),
    q('In a `WITH RECURSIVE` query that walks a category tree, what does the anchor member, the part before UNION ALL, do?', [
      'Produces the starting rows, such as the top-level categories',
      'Stops the recursion once the tree has no more levels',
      'Joins every category to every other category at once',
      'Sorts the final result by depth before it is returned',
    ], 0, 'The anchor runs once to seed the result; the recursive member then repeatedly joins to the rows produced by the previous step until it produces none.'),
    q('A retention matrix groups customers by signup month and measures their paid activity in later months. What does each row of the matrix represent?', [
      'One calendar month of revenue across all customers',
      'One cohort: the customers who signed up in the same month',
      'One customer and each month in which they placed an order',
      'One product and the customers who bought it each month',
    ], 1, 'Each row is a cohort defined by signup month, and its columns show what share of that cohort was active in month 0, month 1, month 2 and so on.'),
    q('Two large tables with no useful index are joined on an equality condition on customer_id. Which join algorithm is usually the planner\'s best choice?', [
      'A nested loop that scans the inner table for every outer row',
      'A merge join run on both inputs left unsorted',
      'A hash join that builds a hash table from the smaller side',
      'A cross join followed by a filter on customer_id',
    ], 2, 'A hash join builds a hash table on the smaller input and probes it once per row of the larger one, the usual choice for big unsorted equality joins; a nested loop would rescan the inner table repeatedly.'),
    q('An index is created as `CREATE INDEX ON orders (order_date) WHERE status = \'pending\'`. Which query can use it?', [
      'WHERE status = \'pending\' AND order_date >= DATE \'2026-09-01\'',
      'WHERE status = \'paid\' AND order_date >= DATE \'2026-09-01\'',
      'WHERE order_date >= DATE \'2026-09-01\' ORDER BY order_date',
      'WHERE status IN (\'pending\', \'paid\') AND order_date >= DATE \'2026-09-01\'',
    ], 0, 'A partial index covers only the rows matching its WHERE clause, so the planner can use it only when the query\'s own conditions guarantee status = \'pending\'.'),
    q('Inside a REPEATABLE READ transaction you run the same SELECT twice, and between the two runs another session commits new orders. What does the second SELECT return?', [
      'The new orders as well, since they are now committed',
      'An error, because the data changed under the transaction',
      'Nothing, because the rows are locked until you commit',
      'The same rows as the first run, from the same snapshot',
    ], 3, 'REPEATABLE READ gives the whole transaction one snapshot, taken at its first statement, so rows committed by others later stay invisible until it ends.'),
    q('Session A runs `SELECT stock FROM products WHERE product_id = 12 FOR UPDATE` inside an open transaction. Session B then tries to update the same row. What happens?', [
      'B\'s update succeeds and A\'s later write overwrites it',
      'B waits until A commits or rolls back',
      'B\'s update fails at once with a deadlock error',
      'B reads the row but its update is silently dropped',
    ], 1, 'FOR UPDATE locks the selected row, so any other transaction that tries to update or lock it waits until the first transaction ends.'),
    q('For which of these numbers is an approximate distinct count, accurate to about 1 percent, not acceptable?', [
      'Daily unique visitors on an internal traffic dashboard',
      'A rough estimate of monthly active users for planning',
      'The number of customers charged in this month\'s invoice run',
      'Spotting a sudden spike in distinct devices per hour',
    ], 2, 'Approximations suit trends, planning and monitoring, but billing needs an exact count because every customer charged must be correct.'),
    q('On-demand warehouse pricing is about USD 6.25 per TB scanned. A query scans 400 GB and runs 100 times a day. Roughly what does it cost per day?', [
      'About USD 250',
      'About USD 2.50',
      'About USD 25',
      'About USD 2,500',
    ], 0, '400 GB × 100 runs is about 40 TB a day, and 40 × USD 6.25 is USD 250, which is why bytes scanned matter more than speed on these engines.'),
    q('A customer\'s name was saved with a typo, and no report will ever need the misspelled version. Which slowly changing dimension type fits the correction?', [
      'Type 2, closing the old row and inserting a new one',
      'Type 3, keeping the typo in a previous_name column',
      'A new fact table that records every name change',
      'Type 1, overwriting the old value in place',
    ], 3, 'Type 1 overwrites the value and keeps no history, which suits fixing a typo that no report should ever reproduce.'),
    q('Why does a Type 2 dim_customer use a warehouse-generated customer_key as its primary key instead of customer_id?', [
      'customer_id is text, and primary keys must be integers',
      'customer_id repeats across versions of the same customer',
      'Surrogate keys let every query skip the fact table',
      'customer_id would expose customer names in reports',
    ], 1, 'Type 2 keeps one row per version, so the natural customer_id appears several times; a surrogate key identifies each version uniquely for fact rows to reference.'),
  ],
});
