import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'data-science-python',
  title: 'Data Science with Python',
  category: 'Data',
  level: 'Intermediate',
  duration: '8 weeks',
  accent: 'violet',
  coverKey: 'data-science-python',
  summary:
    'Turn messy real-world data into a defensible answer — NumPy, pandas, cleaning, EDA, charts that do not lie, and statistics you can actually explain.',
  description:
    'You work the whole pipeline on realistic data: vectorise with NumPy, reshape and join with pandas, clean the missing values and duplicates that break every analysis, then explore, visualise, and test. Each chapter ends with you able to catch a specific class of silent error — a join that quietly triples revenue, a groupby that drops rows, a chart with a truncated axis, and a p-value that means nothing.',
  chapters: [
    chapter(
      'NumPy and the Vectorised Mindset',
      'Arrays, dtypes, broadcasting, and the aggregation habits every pandas operation is built on.',
      [
        lesson('The ndarray: dtype, Shape, and Views', 12, `
A Python list of numbers is a list of *pointers* to boxed objects scattered across the heap. A NumPy array is one contiguous block of fixed-width values that all share a single type. Every speed advantage and every surprising bug in NumPy follows from that one difference.

\`\`\`py
import numpy as np

prices = np.array([19.99, 4.50, 120.0, 8.25])
prices.dtype    # dtype('float64')
prices.shape    # (4,)
prices.nbytes   # 32 — four 8-byte floats, zero per-element overhead
\`\`\`

### dtype is fixed, and it will not warn you

\`\`\`py
counts = np.array([1, 2, 3])   # inferred as int64
counts[0] = 2.7                # stored as 2 — truncated, silently
counts.mean()                  # 2.333... , computed on the wrong data
\`\`\`

An array's dtype is decided at creation and never changes underneath you. Writing a float into an int array truncates without a warning, and an int64 overflow wraps around rather than promoting to a bigger type. This is the most common silent data-corruption bug in NumPy code. Cast on purpose instead: \`counts.astype('float64')\`.

Watch for **object dtype**, which appears whenever a column will not fit one type. It stores pointers again, so you lose every performance benefit and most vectorised operations. If \`arr.dtype\` prints \`object\`, something upstream is wrong.

### Shape and axes

\`\`\`py
sales = np.array([[120, 90, 70],
                  [ 80, 60, 40]])   # 2 stores x 3 months
sales.shape     # (2, 3)
sales.ndim      # 2
sales.reshape(3, 2)   # same values, new shape — usually no copy
sales.reshape(-1)     # flatten; -1 means "work this axis out for me"
\`\`\`

Read \`(2, 3)\` as "2 along axis 0, 3 along axis 1". Axis 0 runs down the rows, axis 1 runs across the columns, and that ordering carries into pandas unchanged.

### Views share memory; copies do not

\`\`\`py
row = sales[0]        # a VIEW — no data was copied
row[0] = 0
sales[0, 0]           # 0 — you just edited the original

row = sales[0].copy() # independent block of memory
\`\`\`

Basic slicing returns a **view**. Fancy indexing — passing a list of positions or a boolean mask — returns a **copy**. So \`sales[0:1]\` and \`sales[[0]]\` look equivalent and behave completely differently the moment you assign into them. The classic bug is slicing out a subset "to work on safely", modifying it, and mutating the source array two hundred lines away. When you want independence, write \`.copy()\` so the intent is visible in the code.

### Creating arrays

\`\`\`py
np.zeros(5); np.ones((2, 3)); np.full(4, np.nan)
np.arange(0, 10, 2)        # 0 2 4 6 8 — end is exclusive
np.linspace(0, 1, 11)      # exactly 11 points, both ends included
\`\`\`

Use \`arange\` for integer steps and \`linspace\` for float ranges. With a float step, \`arange\` accumulates rounding error and can hand you one element more or fewer than you expected.

### Indexing

\`\`\`py
prices[-1]           # 8.25
prices[1:3]          # elements 1 and 2
sales[:, 1]          # every row, column 1 -> [90, 60]
sales[sales > 75]    # boolean mask -> [120, 90, 80] , 1-D
\`\`\`

Note that masking always flattens: you get the matching *values*, not a rectangle. To keep the shape, use \`np.where(sales > 75, sales, 0)\` instead. Every pandas DataFrame is arrays underneath, so time spent on dtype, shape, and views here saves hours in Chapter 2.
        `),
        lesson('Vectorisation and Broadcasting', 14, `
Vectorisation means expressing an operation over a whole array at once and letting compiled code run the loop. It is not a style preference — it is usually a 30x to 100x difference.

\`\`\`py
import numpy as np, time

x = np.random.default_rng(0).random(1_000_000)

t = time.perf_counter()
out = [v * 1.08 for v in x]        # ~90 ms on a laptop
print(time.perf_counter() - t)

t = time.perf_counter()
out = x * 1.08                     # ~2 ms
print(time.perf_counter() - t)
\`\`\`

The list comprehension pays Python interpreter overhead a million times: unbox a float, multiply, allocate a new object, append. The array version makes **one** call into C that walks contiguous memory. Anything shaped like \`for i in range(len(arr))\` is a signal that a vectorised form exists.

### Broadcasting: how arrays of different shapes combine

NumPy lines shapes up from the **right** and, at each position, requires the lengths to be equal or one of them to be 1. A length-1 axis is stretched (virtually — nothing is copied).

| Left shape | Right shape | Result | Why |
|---|---|---|---|
| (3, 4) | (4,) | (3, 4) | (4,) is treated as (1, 4) and repeated down |
| (3, 4) | (3, 1) | (3, 4) | the 1 stretches across columns |
| (3, 4) | (3,) | error | 4 and 3 do not match |
| (2, 1, 3) | (4, 3) | (2, 4, 3) | both stretch |

### The centering bug that catches everyone

\`\`\`py
rng = np.random.default_rng(1)
data = rng.normal(size=(5, 3))

col_means = data.mean(axis=0)    # shape (3,) — one per column
centred = data - col_means       # correct, broadcasts down the rows

row_means = data.mean(axis=1)    # shape (5,) — one per row
data - row_means                 # ValueError: shapes (5,3) and (5,)
data - row_means[:, None]        # correct: (5,1) stretches across columns
\`\`\`

\`[:, None]\` (or \`.reshape(-1, 1)\`) adds the length-1 axis that makes the intent explicit. Here is the dangerous part: if \`data\` were square — \`(5, 5)\` — then \`data - row_means\` would **not** raise. It would subtract column-wise, produce a plausible-looking array, and be completely wrong. Always add the axis deliberately rather than relying on an error to catch you.

### Conditional logic without loops

\`\`\`py
prices = np.array([19.99, 4.50, 120.0, 8.25])

tax = np.where(prices > 100, prices * 0.20, prices * 0.10)   # if/else, elementwise
np.clip(prices, 5, 100)                                      # floor and ceiling
np.select([prices > 100, prices > 10],
          ['premium', 'standard'], default='budget')         # multi-branch
\`\`\`

\`np.where\` evaluates *both* branches for the whole array, so avoid it when one branch is expensive or invalid (dividing by an array containing zeros will still emit a warning even where the mask excludes it).

### Two things that look like vectorisation but are not

\`np.vectorize\` is a convenience wrapper that loops in Python — it makes the syntax nicer and the code no faster. Applying a plain Python function with \`map\` is the same story. Real speed comes from ufuncs (\`np.exp\`, \`np.sqrt\`, arithmetic operators) and from composing them.

### Watch temporaries

\`(a + b) * c\` allocates two full arrays. On a 100-million element array that matters, and the in-place forms avoid it:

\`\`\`py
a += b            # no new allocation
np.multiply(a, c, out=a)
\`\`\`

Use in-place operators only when nothing else holds a view on \`a\` — remember from the previous lesson that a slice might.
        `),
        lesson('Aggregation, Axes, NaN, and Random Sampling', 13, `
Aggregation collapses an axis. Getting the axis argument right is worth more than any other NumPy detail, because \`axis\` means exactly the same thing in pandas.

\`\`\`py
sales = np.array([[120, 90, 70],
                  [ 80, 60, 40]])   # 2 stores x 3 months

sales.sum()                  # 460 — everything
sales.sum(axis=0)            # [200, 150, 110] — one total per month
sales.sum(axis=1)            # [280, 180]      — one total per store
sales.sum(axis=0, keepdims=True)   # shape (1, 3), ready to broadcast back
\`\`\`

Read it as **"the axis that disappears"**. Shape \`(2, 3)\` with \`axis=0\` gives shape \`(3,)\`: axis 0 was consumed. People who memorise "axis=0 means rows" get it backwards half the time; people who count shapes never do. \`keepdims=True\` keeps the collapsed axis at length 1, which is exactly what broadcasting wants when you normalise:

\`\`\`py
share = sales / sales.sum(axis=1, keepdims=True)   # each row sums to 1
\`\`\`

### NaN poisons every reduction

\`\`\`py
x = np.array([1.0, 2.0, np.nan])
x.mean()          # nan — one missing value destroys the whole answer
np.nanmean(x)     # 1.5
np.nan == np.nan  # False! never compare with ==
np.isnan(x)       # [False, False, True] — the only correct test
\`\`\`

There is a \`nan\`-aware version of nearly every reduction: \`nansum\`, \`nanmedian\`, \`nanstd\`, \`nanmax\`. Reach for them consciously, because \`nanmean\` quietly changes the denominator — a column that is 40% missing gives you the mean of the 60% that remains, which is a different quantity from the mean you asked for.

Also note that \`nan\` is a **float** value. An integer array cannot hold it. That is precisely why pandas converts an int column to float the moment a value goes missing, a behaviour that confuses people in Chapter 3.

### Boolean arrays are the workhorse

\`\`\`py
big = sales > 75
big.sum()            # 3 — True counts as 1
big.mean()           # 0.5 — the PROPORTION that are big
big.any(), big.all()
np.count_nonzero(big, axis=1)
\`\`\`

\`mask.mean()\` giving a proportion is used constantly: conversion rate, missing rate, error rate. It is the shortest correct way to answer "what fraction of rows...".

### Random numbers, the modern way

\`\`\`py
rng = np.random.default_rng(42)     # one generator object, explicitly seeded

rng.normal(loc=100, scale=15, size=1000)
rng.integers(1, 7, size=10)                    # dice, high is exclusive
rng.choice(customer_ids, size=200, replace=False)   # a sample without replacement
rng.permutation(len(df))                       # shuffle for a train/test split
\`\`\`

Use \`default_rng\` rather than the legacy \`np.random.seed\` / \`np.random.rand\`. The legacy functions share one hidden global generator, so any library that draws a number changes your results, and reordering two cells in a notebook changes them too. A generator you create and pass around is reproducible by construction. Record the seed in your report.

### A simulation you can run right now

\`\`\`py
rng = np.random.default_rng(7)
# 10,000 experiments, each averaging 30 draws from a skewed distribution
sims = rng.lognormal(mean=0, sigma=1, size=(10_000, 30))
means = sims.mean(axis=1)

means.mean(), means.std()
(means > 2.0).mean()      # empirical probability the sample mean exceeds 2
\`\`\`

That is a full Monte Carlo estimate in four lines, and it previews Chapter 5: individual draws are heavily skewed, but the distribution of their *means* is close to symmetric. Simulation lets you answer probability questions without deriving a formula — when you cannot remember the right test, you can often just simulate the null.
        `),
      ],
      [
        q('sales has shape (2, 3). What does sales.sum(axis=0) return?', [
          'A single scalar total',
          'Two values, one per row',
          'Three values, one per column',
          'A (2, 3) array of running totals',
        ], 2, 'axis=0 is the axis that gets collapsed, so shape (2,3) becomes shape (3,) — one total per column.'),
        q('row = arr[0]; row[0] = 99 also changed arr. Why?', [
          'Basic slicing returns a view that shares memory with the original',
          'NumPy arrays are always passed by reference as whole objects',
          'Assignment into an array is always global',
          'row and arr have the same dtype',
        ], 0, 'Basic slices are views over the same buffer; only fancy indexing or an explicit .copy() gives you separate memory.'),
        q('data is (5, 3). row_means = data.mean(axis=1). Which centres each row correctly?', [
          'data - row_means',
          'data - row_means.T',
          'data - row_means.mean()',
          'data - row_means[:, None]',
        ], 3, 'Broadcasting aligns from the right, so the (5,) means must become (5,1) before they can stretch across the three columns.'),
        q('counts = np.array([1, 2, 3]); counts[0] = 2.7. What is stored?', [
          'The array is promoted to float64 and stores 2.7',
          '2, because the int64 dtype truncates the value with no warning',
          'A TypeError is raised',
          'np.nan, because 2.7 does not fit',
        ], 1, 'dtype is fixed at creation — a float written into an int array is truncated silently, which is why explicit .astype() matters.'),
      ]
    ),
    chapter(
      'pandas: Series, DataFrames, and Reshaping',
      'Precise indexing, split-apply-combine, joins that do not silently duplicate rows, and tidy data.',
      [
        lesson('Series, DataFrames, and Precise Indexing', 13, `
A **Series** is a NumPy array plus a labelled index. A **DataFrame** is a dict of Series sharing one index. Almost every pandas surprise comes from forgetting that the index is real and that pandas aligns on it.

\`\`\`py
import pandas as pd

s = pd.Series([10, 20, 30], index=['a', 'b', 'c'], name='revenue')
s['b']      # 20 — by label
s.iloc[1]   # 20 — by position
\`\`\`

### Alignment happens whether you asked for it or not

\`\`\`py
a = pd.Series([1, 2, 3], index=[0, 1, 2])
b = pd.Series([1, 2, 3], index=[1, 2, 3])
a + b       # 0:NaN  1:3.0  2:5.0  3:NaN
\`\`\`

pandas matched on the index, not on position. This bites hardest after filtering: you take \`df[df.active]\`, compute something from another frame, add the two, and get a column full of NaN because the surviving indexes no longer line up. The fixes are \`reset_index(drop=True)\` on both sides, or dropping to \`.to_numpy()\` when you genuinely want positional arithmetic.

### loc and iloc are not interchangeable

| | \`.loc\` | \`.iloc\` |
|---|---|---|
| Selects by | label | integer position |
| Slice endpoint | **included** | excluded |
| Accepts boolean mask | yes | only as a plain array |
| Safe for assignment | yes | yes |

\`\`\`py
df.loc[0:2]     # THREE rows — label slices include the end
df.iloc[0:2]    # two rows — positional slices behave like Python
\`\`\`

That asymmetry is deliberate (a label slice has no "one past the end") and it is a frequent off-by-one in real code.

### Selecting and filtering

\`\`\`py
df['price']            # Series
df[['price', 'city']]  # DataFrame — note the double brackets
df.loc[df.price > 100, ['price', 'city']]    # rows and columns in one step

df[(df.price > 100) & (df.in_stock)]         # correct
df[df.price > 100 & df.in_stock]             # WRONG — & binds tighter than >
df[(df.price > 100) and (df.in_stock)]       # ValueError: truth value ambiguous
\`\`\`

Two rules that eliminate most filtering bugs: always parenthesise each condition, and never use \`and\`/\`or\`/\`not\` on Series — use \`&\`, \`|\`, \`~\`, which are elementwise. Useful predicates: \`.isin([...])\`, \`.between(lo, hi)\`, \`.str.contains('ltd', case=False, na=False)\` (without \`na=False\` a missing value raises), and \`.query('price > 100 and city == "Lahore"')\` when a chain gets unreadable.

### Chained assignment: the warning you must not ignore

\`\`\`py
north = df[df.region == 'North']
north['bonus'] = 0          # SettingWithCopyWarning — may update nothing

df.loc[df.region == 'North', 'bonus'] = 0    # correct: one indexing step
north = df[df.region == 'North'].copy()      # correct: an explicit new frame
\`\`\`

\`df[mask]\` may return a view or a copy depending on the internal block layout, so \`df[mask]['col'] = x\` is genuinely undefined behaviour — sometimes it edits \`df\`, sometimes it edits a temporary that is discarded on the next line. Under pandas' copy-on-write behaviour it never edits \`df\`, which turns an intermittent bug into a silent no-op. Assign through a single \`.loc\` call, or take an explicit \`.copy()\` and say which frame you meant.

### The index earns its keep

\`\`\`py
lookup = products.set_index('sku')
lookup.loc['A-119', 'price']       # hash lookup, not a scan
lookup.sort_index()                # required for fast label slicing
df.reset_index(drop=True)          # throw the old index away deliberately
\`\`\`

Set an index when you will repeatedly look rows up by key, or when you need time-based slicing on a DatetimeIndex. Reset it before writing to CSV or merging, so a stale index does not reappear as a mystery column called \`Unnamed: 0\`.
        `),
        lesson('groupby: Split, Apply, Combine', 14, `
\`groupby\` splits rows into buckets by key, applies a reduction to each bucket, and combines the results into a frame indexed by the key. Everything else — pivot tables, per-group ranks, running shares — is a variation on that.

\`\`\`py
sales.groupby('region')['revenue'].sum()
\`\`\`

### Named aggregation is the readable form

\`\`\`py
summary = (sales
    .groupby('region', dropna=False)
    .agg(revenue=('revenue', 'sum'),
         orders=('order_id', 'nunique'),
         avg_basket=('revenue', 'mean'),
         first_sale=('ordered_at', 'min'))
    .reset_index())
\`\`\`

The old \`.agg({'revenue': ['sum', 'mean']})\` form returns a MultiIndex on the columns that you then have to flatten by hand. Named aggregation gives flat, self-documenting column names in one step. Use it by default.

### groupby drops NaN keys — this is the classic bug

By default, any row whose grouping key is missing **disappears from the result**. Your revenue-by-region table then adds up to less than total revenue, and nobody notices until a director does.

\`\`\`py
sales.revenue.sum()                                  # 812,400
sales.groupby('region')['revenue'].sum().sum()       # 796,150  — where did it go?
sales.groupby('region', dropna=False)['revenue'].sum().sum()   # 812,400
\`\`\`

Make \`dropna=False\` your habit and let the NaN group be visible. Then decide what to do about it, in writing. The same applies to categorical keys: pass \`observed=True\` or you get a row for every unused category, and with two categorical keys you get their full cartesian product.

### transform returns something the same shape as the input

\`\`\`py
# agg: one row per group
sales.groupby('region')['revenue'].sum()

# transform: one row per ORIGINAL row, group value broadcast back
sales['region_total'] = sales.groupby('region')['revenue'].transform('sum')
sales['share_of_region'] = sales.revenue / sales.region_total

# a group-relative z-score, no merge required
sales['z'] = sales.groupby('region')['revenue'].transform(
    lambda s: (s - s.mean()) / s.std())
\`\`\`

Whenever you find yourself aggregating and then merging the aggregate back onto the original rows, \`transform\` does it in one line with no join and no risk of duplicating rows.

### size versus count

\`\`\`py
sales.groupby('region').size()               # rows per group, NaN included
sales.groupby('region')['revenue'].count()   # NON-NULL values per group
\`\`\`

Using \`count\` where you meant \`size\` silently under-reports groups with missing data, which is exactly the situation you were probably investigating.

### filter, and top-n per group

\`\`\`py
big = sales.groupby('region').filter(lambda g: g.revenue.sum() > 100_000)

top3 = (sales.sort_values('revenue', ascending=False)
             .groupby('region')
             .head(3))

sales['rank'] = sales.groupby('region')['revenue'].rank(method='dense', ascending=False)
\`\`\`

### Prefer string reducers to apply

\`'sum'\`, \`'mean'\`, \`'median'\`, \`'std'\`, \`'min'\`, \`'max'\`, \`'nunique'\`, \`'first'\` all dispatch to compiled implementations. A \`lambda\` inside \`.apply()\` runs Python once per group and is often 10-50x slower; on a group-per-row worst case it is slower than the loop you were avoiding. Use \`apply\` only when the operation genuinely needs the whole sub-frame.

### Grouping by more than one thing

\`\`\`py
(sales.groupby(['region', 'channel'], as_index=False)
      .agg(revenue=('revenue', 'sum'), orders=('order_id', 'size')))

# time buckets: resample on a DatetimeIndex, or Grouper inside a groupby
sales.set_index('ordered_at').resample('ME')['revenue'].sum()
sales.groupby([pd.Grouper(key='ordered_at', freq='ME'), 'region'])['revenue'].sum()
\`\`\`

\`as_index=False\` returns the keys as ordinary columns instead of an index, which is what you want before merging or plotting. Two keys produce a MultiIndex; \`.unstack('channel')\` promotes the second level to columns when a matrix reads better than a long list.

Finally, \`value_counts(normalize=True, dropna=False)\` is a groupby shortcut you will use every day — it is how you check the shape of any categorical column in one line.
        `),
        lesson('Merging, Concatenating, and Reshaping', 14, `
Joins are where analyses silently break, because a wrong join produces *more* data rather than an error.

\`\`\`py
merged = orders.merge(
    customers,
    on='customer_id',
    how='left',
    validate='many_to_one',   # raises if customer_id is not unique on the right
    indicator=True,           # adds a _merge column
)
\`\`\`

| how | Keeps |
|---|---|
| \`inner\` | only keys present in both |
| \`left\` | every left row, NaN where the right has no match |
| \`right\` | mirror of left |
| \`outer\` | everything from both sides |

### Row explosion is the most expensive silent bug in analytics

If the right-hand key is not unique, a left join returns one row per match. Two rows in \`customers\` for the same \`customer_id\` and every order duplicates — then \`merged.revenue.sum()\` reports double the real number, and the chart looks entirely reasonable.

\`\`\`py
before = len(orders)
merged = orders.merge(customers, on='customer_id', how='left')
assert len(merged) == before, f'join changed row count: {before} -> {len(merged)}'

customers.customer_id.duplicated().sum()      # check the right side first
merged['_merge'].value_counts()               # how many rows found no match?
\`\`\`

Three habits make joins safe: pass \`validate=\` so pandas raises instead of duplicating, assert on the row count, and read the \`_merge\` counts. \`left_only\` rows are the ones you are about to under-count.

### Keys must match on dtype and formatting

A key of \`'00123'\` never matches \`123\`, and \`'Acme Ltd '\` never matches \`'Acme Ltd'\`. A join that returns zero matches is easy to spot; one that matches 60% of rows looks like normal data loss. Normalise keys — strip, casefold, cast — before merging, and check \`merged._merge.eq('left_only').mean()\` afterwards.

\`\`\`py
for f in (orders, customers):
    f['customer_id'] = f.customer_id.astype(str).str.strip()
\`\`\`

Use \`left_on\`/\`right_on\` when names differ, \`suffixes=('_ord', '_cust')\` to control collisions, and \`pd.concat([a, b], ignore_index=True)\` to stack frames with the same columns rather than merge them.

### Joining on time

\`\`\`py
pd.merge_asof(trades.sort_values('ts'), rates.sort_values('ts'),
              on='ts', direction='backward',
              tolerance=pd.Timedelta('5min'))
\`\`\`

\`merge_asof\` matches each left row to the **most recent** right row at or before its timestamp — the correct join for attaching a price, an exchange rate, or a config value that changes over time. Both frames must be sorted on the key, and \`tolerance\` stops a stale value being carried forward for a week. Doing the same thing with a regular merge on a rounded timestamp quietly drops every row whose nearest match falls the other side of the rounding boundary.

### Long versus wide

**Tidy data** means one row per observation and one column per variable. groupby, plotting, and modelling all want long form; humans reading a table want wide.

\`\`\`py
# long -> wide
wide = long.pivot(index='date', columns='product', values='units')

# wide -> long
tidy = wide.reset_index().melt(id_vars='date',
                               var_name='product',
                               value_name='units')
\`\`\`

\`pivot\` raises \`ValueError: Index contains duplicate entries\` when a (date, product) pair appears twice. That error is information: your data has duplicates you did not know about. Investigate them before reaching for \`pivot_table\`, which aggregates them away and hides the problem.

\`\`\`py
pd.pivot_table(sales, index='region', columns='quarter',
               values='revenue', aggfunc='sum',
               fill_value=0, margins=True)     # margins adds row/column totals
\`\`\`

\`stack()\` and \`unstack()\` do the same movement between index levels and columns, and are the natural way to flatten a grouped result:

\`\`\`py
sales.groupby(['region', 'quarter'])['revenue'].sum().unstack('quarter')
\`\`\`

If an analysis feels like it needs three nested loops, the data is almost always in the wrong shape. Melt it to long form first and the groupby writes itself.
        `),
      ],
      [
        q('df.loc[0:2] returns three rows but df.iloc[0:2] returns two. Why?', [
          'loc always adds the header row',
          'Label-based slices include the endpoint; positional slices exclude it',
          'iloc silently drops rows containing NaN',
          'loc sorts the index before slicing',
        ], 1, 'A label slice has no "one past the end", so pandas includes the closing label; iloc follows normal Python slicing.'),
        q('Revenue grouped by region sums to less than total revenue. Most likely cause?', [
          'transform was used instead of agg',
          'The revenue column is stored as an object dtype',
          'reset_index() dropped rows',
          'groupby dropped rows whose region key was NaN',
        ], 3, 'groupby excludes missing keys by default, so those rows vanish from the result — dropna=False makes them visible.'),
        q('A left join on customer_id increased the row count from 40,000 to 46,300. What happened?', [
          'customer_id is duplicated on the right side, so matching rows multiplied',
          'The join was actually an outer join',
          'NaN keys were expanded into their own rows',
          'The indicator column added extra rows',
        ], 0, 'A left join emits one row per match, so a non-unique right-hand key duplicates left rows and inflates every downstream sum.'),
        q('You want each row to carry its region total alongside its own revenue. Which is right?', [
          'groupby("region")["revenue"].sum()',
          'groupby("region")["revenue"].agg("sum")',
          'groupby("region")["revenue"].transform("sum")',
          'groupby("region").size()',
        ], 2, 'transform returns a result aligned to the original rows, so no merge back is needed.'),
      ]
    ),
    chapter(
      'Cleaning Real Data',
      'Missing values, broken types, duplicate entities, outliers, and a pipeline that fails loudly.',
      [
        lesson('Missing Values and Why They Are Missing', 13, `
Before you fill a single gap, ask *why* the value is absent. The mechanism decides which fix is honest.

- **MCAR** (missing completely at random) — a sensor dropped packets. Dropping those rows loses precision but not accuracy.
- **MAR** (missing at random, given what you observe) — income is missing more often for younger users, and you have age. Imputing within age groups recovers most of the truth.
- **MNAR** (missing not at random) — income is missing more often *because* it is high. Dropping or mean-filling biases your answer downwards, and no amount of cleverness fixes it from the data alone. You must say so in the report.

### Measure it first

\`\`\`py
df.isna().mean().mul(100).round(1).sort_values(ascending=False)   # % per column
df.isna().sum(axis=1).value_counts()      # how many rows miss 1, 2, 3+ fields
\`\`\`

Then test whether missingness is related to something you can see — one line that distinguishes MAR from MCAR:

\`\`\`py
df.groupby(df.income.isna())[['age', 'tenure_days', 'churned']].mean()
\`\`\`

If the two rows of that table look different, the missing values are not random and dropping them will skew your result.

### Missing values disguised as data

\`\`\`py
df = pd.read_csv('sales.csv',
                 na_values=['N/A', 'NA', '-', 'unknown', 'null', '', -999])
df.describe()      # a minimum age of -999 or a max date of 9999-12-31 is a sentinel
\`\`\`

Legacy systems encode "unknown" as \`-1\`, \`0\`, \`999\`, or \`1900-01-01\`. Those pass straight through \`isna()\` and poison every mean you compute. Scan \`describe()\` and \`value_counts()\` for impossible values before trusting the missing-value count.

### The dtype consequence

\`NaN\` is a float, so an integer column becomes float the moment a value goes missing and \`user_id\` starts printing as \`10432.0\`. Use pandas' nullable types when that matters:

\`\`\`py
df['user_id'] = df.user_id.astype('Int64')     # capital I — nullable integer
df['is_active'] = df.is_active.astype('boolean')
\`\`\`

### Choosing a treatment

\`\`\`py
df = df.dropna(subset=['revenue'])                   # the target must exist
df = df.drop(columns=df.columns[df.isna().mean() > 0.6])   # mostly empty columns

df['rating'] = df.rating.fillna(df.rating.median())  # median: robust to skew
df['income'] = df.income.fillna(
    df.groupby('city')['income'].transform('median'))   # group-wise, much better
df['meter'] = df.meter.ffill()                       # ONLY for true time series
\`\`\`

Record the flag before you fill it:

\`\`\`py
df['income_missing'] = df.income.isna()
\`\`\`

The *fact* that a value was missing is often more predictive than the value would have been — customers who skip the income field behave differently. Overwrite it and that signal is gone forever.

### Three mistakes to name out loud

1. **Mean imputation shrinks variance.** Every filled row sits exactly at the centre, so the standard deviation falls, correlations move toward zero, and the confidence intervals in Chapter 5 come out too narrow. You look more certain than you are.
2. **Imputing before splitting leaks.** Computing the median over the whole dataset and then splitting into train and test means test information reached the training data. Fit the imputation on train, apply it to test.
3. **Filling silently.** \`df.fillna(0)\` across a whole frame turns missing revenue into a real zero, missing ratings into the worst rating, and missing counts into a valid observation. Fill column by column, deliberately, and log the counts:

\`\`\`py
filled = df.income.isna().sum()
print(f'imputed {filled} of {len(df)} income values with city median')
\`\`\`

Whatever you choose, one line in the report — "8.3% of income values were missing, imputed with the city median; results are unchanged when those rows are excluded" — is what makes the analysis defensible.
        `),
        lesson('Types, Duplicates, and Messy Text', 13, `
Type problems masquerade as analysis problems. A revenue column stored as text sorts \`'9'\` above \`'10000'\`, sums by concatenation, and silently produces a chart nobody questions.

\`\`\`py
df.dtypes
df.info(memory_usage='deep')
df.select_dtypes('object').columns    # candidates that should not be text
\`\`\`

### Coercing numbers, and checking what failed

\`\`\`py
raw = df.price.copy()
df['price'] = (df.price.astype(str)
                       .str.replace(r'[^0-9.-]', '', regex=True)   # strip currency, commas
                       .pipe(pd.to_numeric, errors='coerce'))

lost = df.price.isna() & raw.notna()
print(lost.sum(), 'values failed to parse')
raw[lost].value_counts().head(10)      # look at them before moving on
\`\`\`

\`errors='coerce'\` is the right default because it keeps the pipeline running, but it is also how you lose 3% of a revenue column without noticing. Always diff before and after, and read both sides. The NaN column is only half the story: stripping every non-numeric character also rescues values into the *wrong* number, so \`'1.2k'\` becomes \`1.2\`, \`'(450)'\` loses the brackets that made it negative, and a European \`'1,5'\` becomes \`15\`. Those never show up in the NaN count.

### Not everything numeric should be a number

\`\`\`py
df = pd.read_csv('orders.csv', dtype={'zip': str, 'sku': str, 'phone': str})
\`\`\`

Postcodes, SKUs, phone numbers, and account ids look numeric and are not. Read as an integer, \`'02134'\` becomes \`2134\` and never matches a lookup table again, and an id longer than 15 digits loses precision the moment it exceeds the range float64 can represent exactly. Declare \`dtype=str\` for every identifier at read time — the leading zeros cannot be recovered afterwards.

### Dates

\`\`\`py
df['ordered_at'] = pd.to_datetime(df.ordered_at, format='%Y-%m-%d', errors='coerce')
df['ordered_at'] = pd.to_datetime(df.ordered_at, dayfirst=True)   # for 03/04/2024
df['month'] = df.ordered_at.dt.to_period('M')
df['dow'] = df.ordered_at.dt.dayofweek
\`\`\`

Pass an explicit \`format\` whenever you know it. Left to infer, pandas can read \`03/04/2024\` as 3 April in one file and 4 March in another, and mixed-format inference is both slow and unrepeatable. A date column that parses fine but produces a suspicious spike on the 1st of every month is usually a failed parse defaulting to the month start.

### Categories and booleans

\`\`\`py
df['region'] = df.region.astype('category')          # far less memory, faster groupby
df['size'] = pd.Categorical(df['size'], categories=['S', 'M', 'L'], ordered=True)

df['subscribed'] = df.subscribed.map(
    {'Yes': True, 'Y': True, 'true': True, '1': True,
     'No': False, 'N': False, 'false': False, '0': False})
\`\`\`

Map booleans explicitly. Do not cast with \`bool()\` — in Python every non-empty string is truthy, so \`bool('False')\` is \`True\`, and an entire column of "No" becomes \`True\`.

### Normalise text before you do anything else

\`\`\`py
df['city'] = (df.city.str.strip()
                     .str.replace(r'\\s+', ' ', regex=True)   # collapse double spaces
                     .str.title())
df.city.value_counts().head(30)     # read this — near-duplicates are visible here
\`\`\`

\`value_counts()\` is the cheapest data-quality tool in pandas. \`'Lahore'\`, \`'lahore '\`, and \`'LHR'\` sitting in the same list is the whole diagnosis.

### Duplicates: the subset argument is the point

\`\`\`py
df.duplicated().sum()                        # fully identical rows — usually 0
df.duplicated(subset=['order_id']).sum()     # duplicate ENTITIES — the real question

dupes = df[df.duplicated('order_id', keep=False)].sort_values('order_id')
df = df.sort_values('updated_at').drop_duplicates(subset=['order_id'], keep='last')
\`\`\`

Running \`drop_duplicates()\` with no subset, seeing zero, and declaring the data clean is one of the most common mistakes in real analysis. Byte-identical rows are rare; the same order exported twice with a different \`updated_at\` is routine, and it double-counts revenue.

Two ordering rules: deduplicate **after** normalising text, or \`'ACME'\` and \`'Acme '\` both survive; and sort before \`keep='last'\` so "last" means the newest record rather than whatever order the file happened to arrive in. Always inspect \`dupes\` before dropping — sometimes the duplicate is a genuine second purchase and the key is wrong, not the data.
        `),
        lesson('Outliers and a Pipeline That Fails Loudly', 14, `
An outlier is not automatically an error. Before deciding what to do, work out which of three things you are looking at:

1. **A data error** — an age of 300, a negative quantity, a timestamp in 1970.
2. **Rare but real** — one enterprise order 400x the median. Deleting it deletes your most valuable customer.
3. **A different population** — bot traffic, internal test accounts, a wholesale channel mixed into retail. The fix is a filter with a stated rule, not an outlier rule.

### Two detectors, and why one of them lies

\`\`\`py
q1, q3 = df.revenue.quantile([0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
flagged = df[(df.revenue < lo) | (df.revenue > hi)]
\`\`\`

\`\`\`py
z = (df.revenue - df.revenue.mean()) / df.revenue.std()
flagged = df[z.abs() > 3]
\`\`\`

The z-score is computed against a mean and standard deviation that the outlier itself inflated — a phenomenon called **masking**, where one extreme value hides the others by widening the yardstick. With a single huge value, nothing exceeds 3 sigma and the detector reports a clean dataset. The robust version uses the median absolute deviation:

\`\`\`py
med = df.revenue.median()
mad = (df.revenue - med).abs().median()
robust_z = 0.6745 * (df.revenue - med) / mad     # 0.6745 rescales MAD to sigma
\`\`\`

Also remember that "3 sigma" assumes a roughly normal distribution. Revenue, session length, and file sizes are heavy-tailed, so a 3-sigma rule flags hundreds of perfectly legitimate rows. On skewed data, work on \`np.log1p(revenue)\` or use quantile-based rules.

### What to do, in order of preference

1. **Investigate.** Pull the actual rows and read them. Ten minutes here beats any statistical rule.
2. **Fix** if it is a recording error you can verify.
3. **Keep and use robust statistics** — median and IQR instead of mean and standard deviation.
4. **Transform** — a log scale often turns "outliers" into an ordinary right tail.
5. **Cap** at the 1st and 99th percentile (winsorise), stating that you did.
6. **Exclude**, with a written rule that would have been decided in advance, plus a **sensitivity check**: report the headline number with and without the excluded rows.

Removing points because they weaken your correlation is not cleaning. It is fabrication, and a sensitivity check is what proves you did not do it.

### Domain rules beat statistics

\`\`\`py
def validate(df):
    assert df.order_id.is_unique, 'duplicate order ids'
    assert df.revenue.ge(0).all(), 'negative revenue'
    assert df.age.between(0, 120).all(), 'impossible age'
    assert (df.shipped_at >= df.ordered_at).all(), 'shipped before ordered'
    assert df.isna().mean().max() < 0.4, 'a column is more than 40% empty'
    return df
\`\`\`

Each assertion encodes something you know about the business that no statistic can infer. They cost nothing to run and they turn a wrong number into a crash, which is the trade you want.

### Make it a pipeline, not a notebook

\`\`\`py
raw = pd.read_csv('raw.csv', na_values=['N/A', '-', -999])

clean = (raw
           .pipe(normalise_text)
           .pipe(coerce_types)
           .pipe(handle_missing)
           .pipe(drop_duplicate_orders)
           .pipe(validate))

print(f'{len(raw)} rows in, {len(clean)} rows out, {len(raw) - len(clean)} dropped')
\`\`\`

Cells executed out of order are the single most common reason an analyst cannot reproduce their own number a week later. A \`.pipe\` chain runs top to bottom in one order, every time, and \`validate\` at the end means the pipeline refuses to hand you data it knows is broken. Keep a short cleaning log — rows in, rows dropped and why, values imputed and how — and put it in the appendix of the report. That log is what a reviewer asks for first.
        `),
      ],
      [
        q('Income is missing more often for high earners. What happens if you drop those rows?', [
          'Nothing — the sample size just falls',
          'The variance rises but the mean stays correct',
          'Only the confidence interval widens',
          'The estimated average income is biased downwards',
        ], 3, 'That is MNAR: the missingness depends on the hidden value itself, so removing those rows systematically removes the high end.'),
        q('pd.to_numeric(col, errors="coerce") ran without error. What must you still check?', [
          'That the column was sorted first',
          'That the dtype is int rather than float',
          'Which values became NaN, since unparseable entries are dropped silently',
          'That the original column was not categorical',
        ], 2, 'coerce converts failures to NaN without complaint, so a diff of before and after is the only way to see what you lost.'),
        q('df.duplicated().sum() returns 0. What can you conclude?', [
          'Every entity appears exactly once',
          'Only that no two rows are identical across every column',
          'The primary key is unique',
          'Any duplicates were already removed by pandas',
        ], 1, 'Duplicate entities usually differ in a timestamp or free-text field, so you must check duplicated(subset=[key]).'),
        q('Why can a z-score filter miss an extreme value entirely?', [
          'The outlier inflates the mean and standard deviation it is being compared against',
          'z-scores are undefined for skewed data',
          'The threshold of 3 is too low for large samples',
          'pandas computes z-scores on ranks, not values',
        ], 0, 'This is masking: one extreme value widens the yardstick enough that it no longer exceeds three of its own standard deviations.'),
      ]
    ),
    chapter(
      'Exploratory Analysis and Visualisation',
      'A repeatable EDA routine, matplotlib you control, and choosing a chart that tells the truth.',
      [
        lesson('An EDA Routine That Finds Things', 13, `
Exploratory analysis is not "look at the data and see what jumps out". It is a fixed sequence of questions that reliably surfaces problems before they become conclusions.

### 1. Shape, types, and completeness

\`\`\`py
df.shape
df.info(memory_usage='deep')
df.describe(include='all').T          # transposed: one row per column, readable
df.isna().mean().mul(100).round(1).sort_values(ascending=False).head(10)
\`\`\`

In \`describe()\`, read the \`min\` and \`max\` of every numeric column first. A minimum revenue of \`-4200\`, a maximum age of \`999\`, or a maximum date in 2099 is a data problem you want to find now rather than in the conclusion. Compare \`mean\` with the \`50%\` row: a mean far above the median means a right-skewed column where the average is a poor summary.

### 2. One column at a time

\`\`\`py
for col in df.select_dtypes('object'):
    print(df[col].value_counts(dropna=False).head(8), '\\n')

df.select_dtypes('object').nunique().sort_values(ascending=False)
\`\`\`

High cardinality in a column you expected to be categorical means unnormalised text (Chapter 3). Cardinality of 1 means a useless column. Cardinality equal to the row count means an id.

### 3. Two columns at a time

\`\`\`py
df.groupby('plan')['revenue'].describe()
pd.crosstab(df.plan, df.churned, normalize='index').round(3)
df.corr(numeric_only=True).round(2)
\`\`\`

\`normalize='index'\` converts counts into a **rate per row group**, which is almost always the question. Raw counts mislead whenever segments differ in size: the Free plan can have the most churned users and the lowest churn rate at the same time.

Remember that \`corr()\` gives Pearson, which only detects *linear* association. A perfect U-shaped relationship has a correlation near zero.

### 4. Segment before you believe any aggregate

Charig's kidney-stone study is the cleanest example there is:

| | Treatment A | Treatment B |
|---|---|---|
| Small stones | 81/87 = **93%** | 234/270 = 87% |
| Large stones | 192/263 = **73%** | 55/80 = 69% |
| **Overall** | 273/350 = 78% | 289/350 = **83%** |

Treatment A wins in both groups and loses overall. There is no arithmetic error: doctors gave A to the harder large-stone cases, so A's overall rate is dragged down by the mix, not by the treatment. This is **Simpson's paradox**, and it is not an exotic curiosity — it appears whenever group sizes differ and assignment is not random.

The practical rule: before reporting that A beats B, split by the variables that plausibly drove which rows landed in which group. If the direction flips, the aggregate is the wrong number.

### 5. Look at time, always

\`\`\`py
df.set_index('ordered_at').resample('W')['revenue'].sum().plot()
\`\`\`

Plot your key metric by week before anything else. A sharp step change is almost never user behaviour; it is a tracking change, a schema migration, or a backfill. Discovering that on day one saves you from explaining a pipeline bug as a marketing insight.

### 6. Suspiciously good predictors are leakage

If one column predicts the target almost perfectly, ask when it is recorded. \`cancellation_reason\` predicts churn at 99% because it only exists after churn. Anything populated after the outcome cannot be an input.

### Keep a running log

Write your questions and answers as you go: "Why do 4% of orders have no city? — They come from the mobile app before v2.3, which did not send it." An EDA that leaves no written trail has to be redone by the next person, including you in three weeks.
        `),
        lesson('matplotlib You Actually Control', 13, `
matplotlib has two interfaces. The \`plt.*\` state machine implicitly targets "the current figure", which breaks the moment you build more than one chart or return a figure from a function. Use the object-oriented interface for everything.

\`\`\`py
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4.5), dpi=120)
ax.plot(monthly.index, monthly.revenue, marker='o', linewidth=2, color='#6d28d9')
ax.set_title('Revenue grew 34% after the March pricing change')
ax.set_xlabel('Month')
ax.set_ylabel('Revenue (USD, thousands)')
ax.grid(axis='y', alpha=0.3)
ax.spines[['top', 'right']].set_visible(False)
fig.tight_layout()
fig.savefig('revenue.png', dpi=200, bbox_inches='tight')
\`\`\`

A **Figure** is the canvas; an **Axes** is one plot area inside it with its own x and y axis. Every drawing method you need is a method on \`ax\`, and every method returns the artist it created so you can restyle it later.

### Small multiples

\`\`\`py
cols = ['revenue', 'units', 'discount', 'tenure_days']
fig, axes = plt.subplots(2, 2, figsize=(10, 7))

for ax, col in zip(axes.flat, cols):
    ax.hist(df[col].dropna(), bins=30, color='#94a3b8')
    ax.set_title(col)
    ax.set_ylabel('rows')

fig.tight_layout()
\`\`\`

\`plt.subplots(2, 2)\` returns a **2-D array** of axes, so iterating it directly gives you rows of axes rather than axes. \`axes.flat\` is the fix. \`hist\` itself tolerates NaN — matplotlib works the bin range out with \`nanmin\`/\`nanmax\` — but call \`dropna()\` anyway so the bar counts are explicitly over the rows you have; a column that is *entirely* missing does raise \`ValueError: autodetected range of [nan, nan] is not finite\`.

### The blank-image bug

\`\`\`py
plt.show()
plt.savefig('chart.png')     # writes a blank file
\`\`\`

\`plt.show()\` flushes and clears the current figure, so any \`plt.savefig\` after it saves nothing. Save before showing, or sidestep the issue entirely by calling \`fig.savefig(...)\`, which is bound to a specific figure and cannot be confused about which one you meant. This is the most common matplotlib support question in existence.

### Working with pandas

\`\`\`py
fig, ax = plt.subplots()
df.groupby('region')['revenue'].sum().sort_values().plot.barh(ax=ax)
ax.set_xlabel('Revenue (USD)')
\`\`\`

Pass \`ax=\` and pandas draws into your axes instead of creating its own figure. That single argument lets you combine pandas' convenience with full manual control.

### Readable numbers and useful annotation

\`\`\`py
from matplotlib.ticker import FuncFormatter

ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f'{v/1000:,.0f}k'))
ax.annotate('Pricing change',
            xy=(pd.Timestamp('2024-03-01'), 412_000),
            xytext=(pd.Timestamp('2024-01-10'), 520_000),
            arrowprops=dict(arrowstyle='->', color='#475569'))
\`\`\`

An axis reading \`412000.0\` is unreadable; \`412k\` is not. An unlabelled axis with no units is the single most common failure in real analytical reports — more common than any statistical error.

### Legends, colour, and file formats

\`\`\`py
for region, g in monthly.groupby('region'):
    focus = region == 'North'
    ax.plot(g.month, g.revenue, label=region,
            color='#6d28d9' if focus else '#cbd5e1',
            linewidth=2.5 if focus else 1.5,
            zorder=3 if focus else 2)
ax.legend(frameon=False, loc='upper left')
\`\`\`

Grey out every series except the one your sentence is about, and raise its \`zorder\` so it draws on top. Eight equally bright lines make the reader do the work of finding the point. When there are only a few lines, labelling each at its right-hand end with \`ax.annotate\` beats a legend outright, because the eye never has to travel between a key and a line.

\`\`\`py
fig.savefig('revenue.svg')            # or .pdf — vector, stays sharp at any zoom
fig.savefig('revenue.png', dpi=200)   # raster, for slides and email
\`\`\`

Export vector formats for anything that will be printed or projected; a 72-dpi PNG stretched across a screen is the fastest way to make careful work look careless.

### Set the defaults once

\`\`\`py
plt.rcParams.update({
    'figure.dpi': 120,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'font.size': 11,
})
\`\`\`

Put that at the top of the notebook and every chart afterwards is consistent without repeating yourself. Consistency across a report is what makes a set of charts read as one analysis rather than fifteen separate ones.
        `),
        lesson('Choosing a Chart — and Not Lying With It', 14, `
The chart type is not a style choice. It is determined by the question and by what human eyes decode accurately: position along a common scale beats length, which beats angle, which beats area, which beats colour intensity.

| Question | Chart | Watch out for |
|---|---|---|
| How is one numeric variable distributed? | histogram, or box for comparisons | bin width changes the story |
| How do a few categories compare? | horizontal bar, sorted by value | must start at zero |
| How does a metric change over time? | line, time on x | do not connect irregular gaps |
| How do two numerics relate? | scatter | overplotting when n is large |
| How does a distribution differ by group? | box or violin, or strip plot when n is small | box hides bimodality |
| What is the composition of a whole? | sorted bar, or stacked bar for 2-3 parts | pie beyond three slices |

### Bin width is a choice you are making about the reader

\`\`\`py
fig, axes = plt.subplots(1, 3, figsize=(12, 3.5), sharey=False)
for ax, b in zip(axes, [5, 20, 80]):
    ax.hist(df.session_minutes.dropna(), bins=b)
    ax.set_title(f'bins={b}')
\`\`\`

The same column looks unimodal at 5 bins, cleanly bimodal at 20, and like noise at 80. Always render two or three bin counts before you believe a shape, and prefer \`bins='auto'\` over an arbitrary default.

### Where charts start lying

- **Truncated bar axes.** Bars encode value by *length*, so the baseline must be zero. A bar chart of 96.1% versus 98.3% with the y-axis starting at 95 makes a 2.2-point difference look like a threefold gap. Line charts may be truncated because they encode change, but say so on the axis.
- **Dual y-axes.** Two independent scales can be slid until any two series appear to move together. There is no honest choice of the two ranges. Use two stacked panels sharing the x-axis instead.
- **Pie charts.** Angles are decoded badly, and 3-D or exploded pies add distortion on purpose. Three slices is the maximum; a sorted bar is better every time.
- **Overplotting.** Fifty thousand scatter points render as a solid blob that hides the density. Use \`alpha=0.05\`, \`ax.hexbin(x, y, gridsize=40)\`, or plot a random sample of 5,000.
- **Rainbow colour for quantities.** Perceptually uneven, so it invents boundaries that are not in the data. Use a sequential map for magnitude and a diverging map only when there is a real midpoint such as zero. Never encode meaning in colour alone; roughly 1 in 12 men cannot separate red from green.

### A before and after

**Before.** A 3-D exploded pie of seven marketing channels, rainbow legend on the right, percentages to two decimal places, titled "Channels". A reader must move their eyes between legend and wedges seven times and still cannot tell the third slice from the fourth.

**After.** A horizontal bar chart, channels sorted descending, values labelled at the end of each bar, one violet bar for Email and grey for the rest, and the title reading: **"Email drives 41% of signups — more than the next three channels combined (n = 12,480 signups, Jan-Jun 2024)."**

Three changes did the work: bars instead of angles, sorting so rank is readable without labels, and a title that states the finding instead of naming the axes. The chart is now the sentence, and the caption is the evidence.

### Show uncertainty

\`\`\`py
ax.errorbar(x, means, yerr=1.96 * ses, fmt='o', capsize=4)
\`\`\`

If the number is an estimate from a sample, the chart should show that. A bare bar chart of two group means implies a certainty the data does not support — which is exactly what Chapter 5 is about.
        `),
      ],
      [
        q('Treatment A has a higher success rate in both severity groups but a lower overall rate. What is happening?', [
          "Simpson's paradox — the groups differ in size and in how patients were assigned",
          'The percentages were rounded inconsistently',
          'The overall rate was computed with a weighted mean by mistake',
          'One of the subgroup results must be an arithmetic error',
        ], 0, 'When assignment is not random, the group mix drives the aggregate and can reverse the direction seen within every subgroup.'),
        q('plt.show() then plt.savefig("chart.png") produces a blank file. Why?', [
          'savefig only works with the object-oriented API',
          'show() flushes and clears the current figure, so savefig has nothing to write',
          'The file needs an explicit dpi argument',
          'The figure was never assigned to a variable',
        ], 1, 'show() releases the current figure; call fig.savefig() or save before showing.'),
        q('Why must a bar chart start its value axis at zero?', [
          'Because matplotlib cannot render negative baselines',
          'To keep the gridlines evenly spaced',
          'Bars encode value by length, so a truncated baseline exaggerates differences',
          'Because percentages always start at zero',
        ], 2, 'Length is the visual encoding; cutting the baseline changes the ratio between bars and misrepresents the data.'),
        q('You are comparing churn across plans with very different user counts. Which is most informative?', [
          'A stacked bar of raw churned counts',
          'A pie chart of churned users by plan',
          'A dual-axis chart of counts and rates',
          'pd.crosstab(plan, churned, normalize="index") — the rate within each plan',
        ], 3, 'Normalising within each plan gives a comparable rate; raw counts mostly reflect how many users each plan has.'),
      ]
    ),
    chapter(
      'Statistics and Honest Communication',
      'Distributions, correlation and confounding, confidence intervals, p-values, and reporting a result you can defend.',
      [
        lesson('Descriptive Statistics and Distributions', 13, `
Summary statistics compress a column into a few numbers. Choosing the wrong ones is how an analysis goes wrong before any test is run.

### Mean or median

Eight salaries, in thousands: \`30, 32, 35, 38, 40, 42, 45, 900\`.

- Mean = **145.3**
- Median = **39.0**

The mean is not wrong — it is the correct average of a set that includes a founder. It is simply not a useful description of "what people here earn". Money, session length, page views, and time-to-resolution are all right-skewed, so report the **median** plus a few percentiles.

\`\`\`py
df.revenue.agg(['count', 'mean', 'median', 'std', 'skew'])
df.revenue.quantile([0.01, 0.25, 0.5, 0.75, 0.95, 0.99])
\`\`\`

Positive skew means the mean sits above the median. When the two disagree by more than a few per cent, say which one you are quoting and why.

Spread follows the same logic: **standard deviation** pairs with the mean and is dragged around by extremes; the **IQR** (the 25th to 75th percentile range) pairs with the median and is not.

One trap worth memorising: \`df.x.std()\` uses \`ddof=1\` (the sample estimate) while \`df.x.to_numpy().std()\` uses \`ddof=0\`. The two disagree, especially at small n, and people lose hours to it.

### Distributions and what generates them

| Distribution | Arises when | Typical example |
|---|---|---|
| Normal | many small effects **add** | measurement error, heights |
| Log-normal | many small effects **multiply** | income, revenue, session length |
| Binomial | n independent yes/no trials | conversions out of visitors |
| Poisson | rare events per fixed interval | support tickets per hour |
| Power law | rich-get-richer processes | city sizes, file sizes, follower counts |

The practical consequence is immediate. For a log-normal column, "mean plus or minus two standard deviations" includes negative revenue, which is nonsense. Work with \`np.log1p(x)\`, or describe the distribution with percentiles instead.

### Check the shape rather than testing it

\`\`\`py
import scipy.stats as st

fig, ax = plt.subplots()
st.probplot(np.log(df.revenue.dropna()), dist='norm', plot=ax)
\`\`\`

A **Q-Q plot** puts your sorted data against the quantiles a normal distribution would produce. Points on the line mean "consistent with normal"; an upward bend at the right end means a heavy right tail. Prefer this to a normality test: with n = 100,000 a Shapiro-Wilk test rejects normality for deviations far too small to affect anything, and with n = 12 it fails to reject almost anything. The picture answers the question you actually have, which is "is it close enough for what I am about to do".

### The Central Limit Theorem, correctly stated

\`\`\`py
rng = np.random.default_rng(0)
pop = rng.lognormal(0, 1, 1_000_000)         # violently skewed
means = rng.choice(pop, size=(5000, 50)).mean(axis=1)

pop.mean(), np.median(pop)                   # far apart
means.std(), pop.std() / np.sqrt(50)         # close — this is the standard error
\`\`\`

Plot the two histograms side by side and the point is obvious: the raw population stays skewed, but the distribution of **sample means** is nearly symmetric and much narrower. That is what licenses the confidence intervals and t-tests in the next two lessons, even for skewed data.

What the CLT does **not** say — and this is the most common misreading — is that your data becomes normal as n grows. Your data keeps whatever shape it has forever. Only the sampling distribution of the statistic converges, and how fast it converges depends on how skewed the data is: n = 30 is a rule of thumb, not a law, and heavy-tailed data can need thousands.
        `),
        lesson('Correlation, Sampling, and Confidence Intervals', 14, `
### Two correlations, and why you still have to plot

\`\`\`py
df[['ad_spend', 'revenue']].corr()                    # Pearson: linear strength
df[['ad_spend', 'revenue']].corr(method='spearman')   # Spearman: rank-based, monotonic
\`\`\`

Pearson's r measures **linear** association and is easily moved by a single extreme point. Spearman correlates the ranks instead, so it is robust to outliers and catches any monotonic relationship, curved or not. A large gap between the two is a signal: either outliers or a non-linear shape.

Anscombe's quartet is the standard demonstration — four datasets with identical means, identical variances, and r = 0.816 in all four, one of which is a clean line, one a perfect parabola, and one a vertical stack plus a single point that manufactures the whole correlation. Plot before you quote a number.

Interpret magnitude through \`r ** 2\`: r = 0.5 accounts for 25% of the variance, which is far less impressive than "0.5" sounds.

### Correlation is not causation, and here is the checklist

For any correlation between X and Y, four explanations compete with "X causes Y":

1. **Reverse causation.** Support tickets correlate with churn — but people about to churn file tickets.
2. **Confounding.** Ad spend and revenue both rise with company size and with December. The confounder drives both.
3. **Selection or collider bias.** Analysing only customers who converted can create a correlation between two independent traits that does not exist in the population.
4. **Coincidence under multiple testing.** Run 100 tests and roughly 5 clear p < 0.05 by chance alone — and correlating 100 columns pairwise is 4,950 tests, not 100, so expect about 250 spurious pairs.

What licenses a causal claim is a **design**, not a bigger dataset: randomised assignment (an A/B test), or a quasi-experiment — difference-in-differences, instrumental variables, regression discontinuity — plus the assumptions written down where a reader can attack them.

### Sampling: the error no statistic can see

Your **population** is who you want to describe. Your **sampling frame** is who could possibly be selected. Your **sample** is who actually appeared. Every gap between those is bias.

- A satisfaction survey answered by 4% of users measures those 4%, who are disproportionately delighted or furious.
- Survivorship: analysing only accounts still active today removes exactly the accounts that explain churn.
- Convenience samples — whoever was easy to reach — are the default failure mode of internal analysis.

The uncomfortable part: **bias is invisible to the arithmetic**. A biased sample of 10 million gives a very tight interval around the wrong number.

### Standard error and confidence intervals

The standard error of a mean is \`s / sqrt(n)\`. Precision improves with the *square root* of sample size, so quadrupling the data halves the interval — going from n = 100 to n = 400 takes an SE of 1.0 to 0.5, and no further.

\`\`\`py
import numpy as np, scipy.stats as st

x = df.revenue.dropna().to_numpy()
n = x.size
mean = x.mean()
se = x.std(ddof=1) / np.sqrt(n)
lo, hi = st.t.interval(0.95, df=n - 1, loc=mean, scale=se)
\`\`\`

For a median, a ratio, or anything without a neat formula, bootstrap it:

\`\`\`py
rng = np.random.default_rng(0)
boot = rng.choice(x, size=(10_000, n), replace=True)     # resample WITH replacement
np.percentile(np.median(boot, axis=1), [2.5, 97.5])
\`\`\`

### What a 95% interval means

It means the *procedure* captures the true value in 95% of repeated samples. It does **not** mean 95% of your data lies inside it — that is a prediction interval, and confusing the two is routine. It also says nothing about sampling bias; it quantifies random error only.

Most importantly, read the width. An interval of "-5% to +8%" is a finding, and the honest summary is "we cannot tell from this data", not "no effect".
        `),
        lesson('Hypothesis Testing and Reporting Honestly', 15, `
A hypothesis test asks one narrow question: **if there were no real difference, how surprising would this data be?**

\`\`\`py
import scipy.stats as st

a = df.loc[df.variant == 'A', 'value'].to_numpy()
b = df.loc[df.variant == 'B', 'value'].to_numpy()

t, p = st.ttest_ind(a, b, equal_var=False)    # Welch's t-test
\`\`\`

Use \`equal_var=False\` — **Welch's** test — as the default. Student's t-test assumes both groups share a variance, which is rarely true and rarely checked; Welch costs almost nothing in power and is correct far more often.

| Question | Test |
|---|---|
| Two independent means | Welch's t-test |
| Before and after on the same units | paired t-test, or Wilcoxon signed-rank |
| Two conversion rates | two-proportion z-test, or Fisher's exact when counts are small |
| Association between two categoricals | chi-square on a contingency table |
| Small samples, non-normal, ordinal | Mann-Whitney U |

### What a p-value is not

A p-value is \`P(data at least this extreme | H0 true)\`. Every one of the following is false, and all of them appear in real reports:

- **"p = 0.03 means there is a 3% chance the null is true."** That is \`P(H0 | data)\`, the conditional the other way round. The p-value cannot give it to you.
- **"p = 0.03 means a 97% chance the effect is real."** Same error, wearing a hat.
- **"p = 0.06 means no effect."** It means this data did not clear an arbitrary line. With n = 40 you could miss a large effect entirely — absence of evidence is not evidence of absence.
- **"p = 0.049 is a result and p = 0.051 is not."** There is no discontinuity in nature at 0.05.
- **"p < 0.001, so the effect is big."** With n = 2,000,000, a 0.02% lift is highly significant and commercially worthless. p measures evidence against the null, never size.

### Report effect size with an interval

\`\`\`py
diff = b.mean() - a.mean()
pooled = np.sqrt((a.var(ddof=1) + b.var(ddof=1)) / 2)
cohens_d = diff / pooled              # ~0.2 small, 0.5 medium, 0.8 large

se = np.sqrt(a.var(ddof=1)/a.size + b.var(ddof=1)/b.size)
ci = (diff - 1.96 * se, diff + 1.96 * se)
\`\`\`

The deliverable is one sentence: **"Variant B converted 4.1 percentage points higher (95% CI 0.8 to 7.5, Welch t-test p = 0.02, n = 1,200 per arm)."** Everything a reader needs to judge the claim is in it.

### Multiple comparisons and the garden of forking paths

Test twenty metrics at alpha = 0.05 and you expect one false positive by construction. Slice by device, country, and plan, and you are running dozens of tests while telling yourself you ran one.

\`\`\`py
from statsmodels.stats.multitest import multipletests
reject, p_adj, _, _ = multipletests(pvals, alpha=0.05, method='fdr_bh')
\`\`\`

Peeking daily and stopping the moment a test turns significant inflates the false-positive rate well above 5% — the null hypothesis will eventually cross the line by chance if you keep looking. The antidote is deciding in advance: one primary metric, a sample size from a power calculation, and a fixed stopping rule.

\`\`\`py
from statsmodels.stats.power import TTestIndPower
TTestIndPower().solve_power(effect_size=0.2, alpha=0.05, power=0.8)   # ~394 per group
\`\`\`

### Communicating honestly

- Lead with the decision-relevant number **and its uncertainty**.
- Write "associated with", not "caused by", unless assignment was randomised.
- Put n and the denominator next to every percentage.
- State what you excluded and why, including the analyses that did not work.
- Show the chart that could contradict you.
- Separate the finding from the recommendation.

**Before:** "Users who use feature X churn 60% less. We should push everyone onto X."

**After:** "Adopters of X churned 6.1 percentage points less (95% CI 3.2 to 9.0, n = 8,400). Adoption is self-selected — engaged users adopt more — so an unknown share of that gap is who they are rather than what X does. A two-week randomised rollout to 10% of new signups would separate the two, and that is what I recommend before we invest in promotion."

The second version is shorter on certainty and much harder to argue with. That is the job.
        `),
      ],
      [
        q('Revenue per customer has mean 145 and median 39. What should the headline report?', [
          'The mean, because it uses every observation',
          'Both, without comment, and let the reader choose',
          'The median plus a few percentiles, noting the distribution is right-skewed',
          'The mean after deleting the top 1% of customers',
        ], 2, 'A mean far above the median signals heavy right skew, where the median describes a typical customer and the mean describes the total divided by n.'),
        q('Ad spend and revenue correlate at r = 0.78. Which conclusion is supported?', [
          'They move together; causation needs a design, since seasonality or company size could drive both',
          'Ad spend causes about 78% of revenue',
          'Increasing ad spend by 1% will increase revenue by 0.78%',
          'The relationship is linear and free of outliers',
        ], 0, 'Correlation is consistent with reverse causation, confounding, selection effects, or chance — only randomisation or an identified design licenses a causal claim.'),
        q('A test returns p = 0.06 on 40 users per arm. What is the correct reading?', [
          'There is a 6% chance the effect is real',
          'The null hypothesis is 94% likely to be true',
          'The two groups are equivalent',
          'This data did not provide strong evidence against the null; the study may simply be underpowered',
        ], 3, '"Not significant" means the evidence was insufficient, which at small n is often a power problem rather than an absent effect.'),
        q('You compare 20 metrics between two variants at alpha = 0.05 and one is significant. What should you do?', [
          'Report it as a confirmed win',
          'Correct for multiple comparisons, since one false positive in 20 is the expected result',
          'Rerun the test with a larger alpha',
          'Drop the other 19 metrics from the report',
        ], 1, 'At alpha = 0.05, twenty independent tests produce about one false positive by construction, so an uncorrected p-value means little.'),
      ]
    ),
    chapter(
      'Performance, Memory, and Data That Does Not Fit',
      'Profiling before you optimise, dtype-driven memory cuts, chunked and columnar IO, and pushing work down into SQL.',
      [
        lesson('Profile First: Finding the Line That Costs You', 13, `
Optimising code you have not measured is how an afternoon disappears with nothing to show. In pandas the slow line is almost never where people guess — it is usually one \`apply\` buried in a helper, or a read that parses columns nobody uses.

### Measure at three zoom levels

\`\`\`py
%timeit df.groupby('region', observed=True)['revenue'].sum()   # one expression, repeated

import time
t = time.perf_counter()
report = build_report(df)
print(f'build_report: {time.perf_counter() - t:.2f}s')          # one call, once
\`\`\`

\`\`\`py
import cProfile, pstats
cProfile.run('build_report(df)', 'prof.out')
pstats.Stats('prof.out').sort_stats('cumulative').print_stats(15)
\`\`\`

Read \`cumtime\` to find *which* of your functions is expensive, then \`tottime\` to find where the time is actually burned rather than merely passed through. \`%lprun -f clean_prices clean_prices(df)\` from \`line_profiler\` narrows it to a single line, which is normally where the investigation ends.

### The three costs, in order of size

| Approach on 1M rows | Time | Why |
|---|---|---|
| \`for i in range(len(df))\` with \`.iloc\` | ~210 s | a Series is rebuilt per row |
| \`df.iterrows()\` | ~55 s | boxes every row as a Series |
| \`df.apply(f, axis=1)\` | ~22 s | one Python call per row |
| \`np.where(...)\` / column arithmetic | ~0.01 s | one compiled pass |

\`iterrows\` carries a second, worse cost: each row comes back as a Series with a **single dtype**, so an int column sitting next to a float column arrives as \`float64\` and \`row.order_id\` reaches your code as \`10432.0\` rather than \`10432\` — Chapter 3's promotion bug, now happening once per row. Column dtypes are preserved across a DataFrame; row dtypes are not. That is the classic trap — the loop is not just slow, it is quietly wrong.

Object dtype is the other tax. \`df.city.str.upper()\` loops in Python whatever you do; the fix is \`category\` or an Arrow-backed string column, not a cleverer expression.

### Check how the cost scales, not just what it is

\`\`\`py
for n in (10_000, 100_000, 1_000_000):
    sub = df.head(n)
    t = time.perf_counter(); job(sub)
    print(n, round(time.perf_counter() - t, 3))
\`\`\`

Ten times the rows should take about ten times as long. If it takes a hundred times as long, something inside is quadratic — a frame grown by \`concat\` in a loop, or a \`df[df.id == i]\` scan performed once per id. No amount of micro-tuning rescues the wrong complexity; you have to change the shape of the algorithm, usually into a \`merge\` or a \`groupby\` (Chapter 2).

### Two ways timings lie

The first read of a file measures disk; the second measures the OS page cache, and can be 20x faster for reasons that have nothing to do with your code. Warm up, or time the pipeline end to end on a cold file. And \`%timeit\` runs the statement many times, so timing something that mutates \`df\` in place gives you one real run followed by six runs on already-modified data.

### The loop that closes

Profile, fix only the top line, re-measure, repeat. Stop when the number is good enough for how often the job runs — a nightly batch that takes four minutes does not need your afternoon, and code you rewrote for speed is code you must now re-test against the numbers it produced before.
        `),
        lesson('Memory: dtypes, Categories, and Accidental Copies', 14, `
A \`MemoryError\` is the polite version of this problem. The common version is a machine that swaps for twenty minutes while a notebook holds nine copies of the same frame.

### Measure with deep=True or do not measure at all

\`\`\`py
df.info(memory_usage='deep')
(df.memory_usage(deep=True) / 1e6).sort_values(ascending=False).head(10)   # MB per column
\`\`\`

Without \`deep=True\` an object column reports 8 bytes per row — the size of the *pointer*, exactly as in Chapter 1 — while the strings it points at sit elsewhere. A frame that claims 40 MB shallow can be 600 MB deep, and text columns are almost always the whole story.

### Three cuts, largest first

\`\`\`py
df['region'] = df.region.astype('category')                # 6 distinct values in 2M rows
df['qty'] = pd.to_numeric(df.qty, downcast='integer')      # int64 -> int8/int16
df['score'] = df.score.astype('float32')                   # halves a float column
\`\`\`

**Categorical** stores each distinct value once and gives every row a small integer code, so a 2-million-row region column drops from roughly 130 MB to under 3 MB, and \`groupby\` on it gets faster too. It is the wrong choice when the column is nearly unique — a category of 1.9 million distinct order ids costs *more* than the strings, because you pay for the dictionary as well.

Two category footguns worth knowing: concatenating two frames whose categories differ produces \`object\` dtype again, and \`groupby\` on a categorical emits every unused category unless you pass \`observed=True\` (Chapter 2).

**float32** carries about 7 significant digits. That is fine for a model feature and not fine for money or for identifiers — float32 cannot represent an exact penny above about 131,000, and by ten million the gap between neighbouring values is a whole unit.

### Read less in the first place

\`\`\`py
df = pd.read_csv('sales.csv',
                 usecols=['ordered_at', 'region', 'revenue', 'order_id'],
                 dtype={'order_id': str, 'region': 'category'},
                 parse_dates=['ordered_at'],
                 nrows=50_000)      # drop nrows once the code works
\`\`\`

The cheapest optimisation in pandas is not reading the columns you were going to drop on the next line.

### The classic bug: growing a frame in a loop

\`\`\`py
# WRONG — every iteration allocates a new frame and copies everything so far
out = pd.DataFrame()
for chunk in chunks:
    out = pd.concat([out, transform(chunk)])

# RIGHT — one allocation at the end
parts = [transform(chunk) for chunk in chunks]
out = pd.concat(parts, ignore_index=True)
\`\`\`

The first form copies roughly n squared over 2 rows in total. At 200 chunks it is not "a bit slower", it is minutes instead of a second, and it is the single most common quadratic in analytics code. The same applies to \`df.loc[len(df)] = row\` inside a loop: build a list of dicts and construct the frame once.

### Copies you did not ask for

\`merge\`, \`sort_values\`, \`reset_index\`, and most assignments allocate a new frame, so peak memory is two to three times the size of the data being handled. In a notebook the peak is made worse by history: \`raw\`, \`typed\`, \`deduped\`, and \`final\` all stay alive because a variable still names them. Reassign the same name, or \`del\` the intermediates you no longer need.

And drop the \`inplace=True\` habit. It rarely avoids a copy internally, it returns \`None\` so it breaks method chaining, and pandas is steadily deprecating it. \`df = df.drop(columns=...)\` is clearer and no more expensive.
        `),
        lesson('Bigger Than RAM: Chunks, Parquet, and Pushing Work into SQL', 14, `
CSV is a text format with no types, no column boundaries you can skip to, and no compression. Every read reparses every byte, and Chapter 3's \`dtype=str\` dance exists entirely because the file forgot what its columns were.

\`\`\`py
df.to_parquet('sales.parquet', engine='pyarrow', compression='zstd', index=False)

pd.read_parquet('sales.parquet',
                columns=['ordered_at', 'region', 'revenue'],   # column pruning
                filters=[('region', '==', 'North')])           # row-group skipping
\`\`\`

**Parquet** is columnar, typed, and compressed, and it stores min/max statistics per row group. Asking for three columns reads only those three; a filter lets whole row groups be skipped without decompressing them. A 1.2 GB CSV typically becomes about 180 MB of parquet and a 40-second read becomes under two seconds. Dtypes survive the round trip, so categories stay categories and timestamps stay timestamps.

### Chunking: streaming a file you cannot hold

\`\`\`py
partials = []
for chunk in pd.read_csv('big.csv', chunksize=500_000,
                         usecols=['region', 'revenue']):
    partials.append(chunk.groupby('region')['revenue'].agg(['sum', 'count']))

result = pd.concat(partials).groupby(level=0).sum()
result['mean'] = result['sum'] / result['count']
\`\`\`

This works because \`sum\`, \`count\`, \`min\`, and \`max\` are **decomposable**: a total of totals is the total. A mean is not, so you carry sum and count and divide once at the end. \`median\`, \`quantile\`, and \`nunique\` cannot be chunked at all — they need every value at once — so for those, use a tool that can spill to disk or accept an approximation. Averaging per-chunk medians is not the median, and it is a mistake that survives review because the number looks reasonable.

Note also that \`dtype={'region': 'category'}\` inside a chunked read builds a *different* category set per chunk, and concatenating them falls back to \`object\`. Cast after the concat.

### Push the work to where the data lives

\`\`\`py
import duckdb

monthly = duckdb.sql("""
    SELECT region,
           date_trunc('month', ordered_at) AS month,
           sum(revenue) AS revenue
    FROM 'data/sales/*.parquet'
    WHERE ordered_at >= DATE '2024-01-01'
    GROUP BY 1, 2
""").df()
\`\`\`

DuckDB reads the parquet files directly, runs multithreaded and out of core, and hands back a DataFrame you continue with in pandas. It will also query a frame already in memory — \`duckdb.sql('SELECT * FROM df WHERE revenue > 100')\` — so adopting it costs nothing. Polars offers the same idea with a lazy plan:

\`\`\`py
import polars as pl
(pl.scan_parquet('data/sales/*.parquet')     # scan_, not read_ — nothing loads yet
   .filter(pl.col('revenue') > 0)
   .group_by('region').agg(pl.col('revenue').sum())
   .collect())                               # now the plan runs, streaming
\`\`\`

When the source is a real database, the same rule applies with more force:

\`\`\`py
q = 'SELECT region, sum(revenue) AS revenue FROM orders WHERE region = %(region)s GROUP BY region'
pd.read_sql(q, conn, params={'region': region})     # parameterised, not an f-string
\`\`\`

Aggregate in the database and move the result, not the table. And always pass values through \`params\` — an f-string interpolating input into SQL is an injection hole, and it mangles dates and quotes on the way.

### A rough decision rule

| Data size | Tool |
|---|---|
| under ~1 GB | pandas, as is |
| 1-50 GB | parquet plus DuckDB or Polars on one machine |
| over 50 GB, or run daily | a warehouse, Spark, or Dask |

Most "we need a cluster" problems are a CSV that should have been parquet and a \`SELECT *\` that should have been a \`GROUP BY\`. The fastest code is the code that never loads the rows.
        `),
      ],
      [
        q('cProfile shows 78% of the runtime inside one line calling df.apply(f, axis=1). What is the highest-value fix?', [
          'Rewrite the body of f more efficiently and keep apply',
          'Increase the chunksize used when reading the CSV',
          'Replace it with a vectorised expression such as np.where, a mask, or a groupby transform',
          'Wrap f in np.vectorize so it runs at C speed',
        ], 2, 'apply pays Python call overhead once per row, so only a genuinely vectorised path removes it — np.vectorize still loops in Python.'),
        q('Casting a 2-million-row region column with 6 distinct values to category saves memory because:', [
          'Each distinct value is stored once and every row keeps a small integer code',
          'Categorical columns are compressed on disk',
          'pandas drops the index for categorical columns',
          'The strings are converted to float32',
        ], 0, 'A category is a dictionary of values plus narrow integer codes, so repeated text is stored once rather than once per row.'),
        q('Why is out = pd.concat([out, chunk]) inside a loop so slow?', [
          'concat cannot use multiple cores',
          'Each chunk is validated against the previous schema',
          'The intermediate frames are never garbage collected',
          'Every iteration allocates a new frame and re-copies everything accumulated so far, so cost grows quadratically',
        ], 3, 'Growing a frame by concatenation copies the whole accumulated result each time; collect the parts in a list and concatenate once.'),
        q('You need the exact median order value from a 40 GB CSV read in chunks. Which is true?', [
          'Averaging the per-chunk medians gives the correct answer',
          'The median is not decomposable across chunks, so you need a tool that sees all the values or an accepted approximation',
          'read_csv(chunksize=...) computes it correctly by default',
          'It is exact provided every chunk has the same number of rows',
        ], 1, 'Sums and counts combine across chunks; order statistics such as the median need the whole distribution at once.'),
      ]
    ),
    chapter(
      'From Notebook to Reproducible Pipeline',
      'Project layout, pinned environments, tests for data code, contracts that catch drift, and debugging the run that failed overnight.',
      [
        lesson('A Project Someone Else Can Run', 13, `
A notebook is a lab bench, not a deliverable. The moment a number from it reaches a slide, someone will ask you to reproduce it three months later, on a different laptop, for a different month of data.

### Layout

\`\`\`text
project/
  data/
    raw/            # immutable, never written by your code
    processed/      # every file here is reproducible by deleting it and re-running
  src/salesreport/
    __init__.py
    config.py       # every parameter, in one place
    io.py           # read and write only
    clean.py        # Chapter 3's pipeline, as functions
    report.py       # the entry point
  tests/
  notebooks/        # exploration, imports from src
  pyproject.toml
  requirements.lock
\`\`\`

Two rules carry most of the value. \`data/raw\` is read-only, because when a run goes wrong you need the exact bytes that went in. And notebooks import from \`src\`, never the reverse — logic that lives only in a cell cannot be tested, scheduled, or reviewed.

### Paths and configuration

\`\`\`py
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'data' / 'raw'
\`\`\`

Anchor paths to the file, not to the working directory. \`'../data/sales.csv'\` resolves differently in a notebook, under \`pytest\`, and under cron, and that is the most common reason a job which worked all week fails on its first scheduled run.

\`\`\`py
from dataclasses import dataclass

@dataclass(frozen=True)
class Config:
    month: str
    min_order_value: float = 0.0
    seed: int = 42
\`\`\`

Parameters that used to be scattered across cells become one object you can print into the log and attach to the output. Give the package a real entry point — \`python -m salesreport.report --month 2024-06\` with \`argparse\` — so running it does not require knowing which cells to skip.

### Secrets

Credentials never go in a notebook and never go in git. Read them from the environment, keep \`.env\` in \`.gitignore\`, and remember that deleting a committed key does not remove it from history — you have to rotate it.

\`\`\`py
import os
password = os.environ['DB_PASSWORD']     # a KeyError on day one beats a leak on day thirty
\`\`\`

### Pin the environment

\`\`\`bash
python -m venv .venv && source .venv/bin/activate
pip install -e .
pip freeze > requirements.lock          # or: uv pip compile pyproject.toml -o requirements.lock
\`\`\`

"It works on my machine" is nearly always an unpinned minor version. pandas changed copy-on-write behaviour between releases — the chained assignment from Chapter 2 warns on one version and silently no-ops on another — and matplotlib has changed default colours and date handling more than once. Pin what you install, and record the Python version next to it.

### Determinism

Anything random needs a seed you control: one \`np.random.default_rng(cfg.seed)\` passed in as an argument (Chapter 1), \`df.sample(random_state=cfg.seed)\`, \`train_test_split(random_state=cfg.seed)\`. Sort before any output whose order matters, because "the order pandas happened to return" is not a specification.

The test of all this is blunt and worth actually performing: clone the repository into a fresh directory on a clean machine, run one command, and compare the headline number against the one in your report. Everything you had to fix to make that work was a reproducibility bug you were carrying without knowing it.
        `),
        lesson('Testing Data Code', 14, `
Analysts skip tests because "the data is always different". That is exactly backwards: the data changes, so the only thing you can pin down is the behaviour of your transformations.

### Separate IO from logic

\`\`\`py
# Hard to test: does three things and touches the disk
def report():
    df = pd.read_csv('data/raw/sales.csv')
    df = df[df.revenue > 0].groupby('region', as_index=False).revenue.sum()
    df.to_csv('out.csv', index=False)

# Testable: a pure function, frame in, frame out
def revenue_by_region(df: pd.DataFrame) -> pd.DataFrame:
    return df[df.revenue > 0].groupby('region', as_index=False).revenue.sum()
\`\`\`

Every cleaning step from Chapter 3 should have this shape, with the entry point a thin wrapper that reads, calls the functions, and writes.

### Fixtures are tiny and hand-written

\`\`\`py
import pandas as pd, pytest
from pandas.testing import assert_frame_equal
from salesreport.clean import dedupe_orders

@pytest.fixture
def orders():
    return pd.DataFrame({
        'order_id': ['A1', 'A1', 'A2'],
        'updated_at': pd.to_datetime(['2024-01-01', '2024-01-03', '2024-01-02']),
        'revenue': [10.0, 12.0, 5.0],
    })

def test_keeps_the_newest_row_per_order(orders):
    out = dedupe_orders(orders)
    assert out.order_id.is_unique
    assert out.loc[out.order_id == 'A1', 'revenue'].item() == 12.0
\`\`\`

Three rows containing the awkward case beat a 50,000-row sample of production data, which is unreadable in a diff, slow, and quite possibly full of personal data you have just committed to a repository.

### assert_frame_equal, and what its failures mean

\`\`\`py
assert_frame_equal(out, expected, check_like=True)      # ignore column and index ORDER
assert_frame_equal(out, expected, rtol=1e-6)            # floats are never exactly equal
\`\`\`

Two failures dominate. \`Attribute "dtype" are different: int64 vs float64\` almost always means a null appeared and promoted the column (Chapter 3) — a real finding, not test noise. \`DataFrame.index are different\` means one side kept the original index after a filter and wants \`reset_index(drop=True)\`. Reach for \`check_dtype=False\` only once you have decided the dtype genuinely does not matter, because it silences precisely the bug the test just caught.

### Test invariants, not just values

\`\`\`py
def test_join_does_not_duplicate_rows(orders, customers):
    out = attach_customer(orders, customers)
    assert len(out) == len(orders)                       # Chapter 2's row explosion

def test_reshape_conserves_revenue(orders):
    assert to_long(orders).revenue.sum() == pytest.approx(orders.revenue.sum())

def test_clean_is_idempotent(orders):
    once = clean(orders)
    assert_frame_equal(clean(once), once)

def test_empty_input_returns_empty_frame_with_same_columns():
    empty = pd.DataFrame(columns=['order_id', 'revenue'])
    assert list(clean(empty).columns) == ['order_id', 'revenue']
\`\`\`

Row count preserved, totals conserved, running twice changes nothing, empty input does not crash: those four catch more real breakage than any assertion about a specific number.

### Parametrise the messy parser

\`\`\`py
@pytest.mark.parametrize('raw,expected', [
    ('1,200', 1200.0),
    ('$1,200.50', 1200.50),
    ('(450)', -450.0),        # accounting negatives — the case everyone forgets
    ('1.2k', None),           # decide and encode what SHOULD happen
])
def test_parse_price(raw, expected):
    assert parse_price(raw) == expected
\`\`\`

Each odd value you found in Chapter 3 becomes one line here, permanently.

Finally, add one regression test that runs the whole pipeline over a small committed sample and asserts the headline total to the penny. When that number moves you have to justify it, which is the entire point of putting tests around an analysis.
        `),
        lesson('Contracts, Logging, and Debugging the 3 a.m. Failure', 15, `
A pipeline that crashes wakes someone up. A pipeline that succeeds on wrong data goes straight into a board deck. The second is the failure mode to design against.

### Validate the shape of the input at the boundary

\`\`\`py
EXPECTED = {'order_id': 'object', 'revenue': 'float64', 'ordered_at': 'datetime64[ns]'}

def check_contract(df):
    missing = set(EXPECTED) - set(df.columns)
    assert not missing, f'missing columns: {sorted(missing)}'
    wrong = {c: str(df[c].dtype) for c, t in EXPECTED.items() if str(df[c].dtype) != t}
    assert not wrong, f'dtype drift: {wrong}'
    return df
\`\`\`

Missing columns fail; extra columns pass, so an upstream team adding a field does not break you at midnight. This is Chapter 3's \`validate\` moved to the front door, where it costs one second and saves a day.

### Watch for drift, not only for breakage

| Signal | Alarm when |
|---|---|
| row count | outside 50-150% of the trailing median |
| null rate per column | up by more than 5 percentage points |
| distinct values of a key category | a value appears that was never seen before |
| median of the main metric | moves more than 20% overnight |
| max timestamp | older than yesterday — the feed is stale |

Each of these catches a class of silent corruption a dtype check cannot see. A feed that starts sending \`'north'\` instead of \`'North'\` passes every type assertion and quietly empties one bar of your chart.

### Log counts at every stage

\`\`\`py
import logging
log = logging.getLogger(__name__)

def log_shape(df, step):
    log.info('%-10s rows=%-8d cols=%-3d null_revenue=%d',
             step, len(df), df.shape[1], df.revenue.isna().sum())
    return df

clean = (raw.pipe(log_shape, 'raw')
            .pipe(coerce_types).pipe(log_shape, 'typed')
            .pipe(dedupe_orders).pipe(log_shape, 'deduped')
            .pipe(check_contract))
\`\`\`

At 3 a.m. the log tells you which step lost the rows, and that is 80% of the diagnosis before you have opened anything.

### Make every step idempotent

\`\`\`py
out = PROCESSED / f'month={cfg.month}' / 'part.parquet'
out.parent.mkdir(parents=True, exist_ok=True)
tmp = out.with_suffix('.tmp')
df.to_parquet(tmp, index=False)
tmp.replace(out)          # atomic rename — a reader never sees a half-written file
\`\`\`

Write one partition per run and **overwrite** it; never append to a shared file. A job that appends and is then retried after a partial failure duplicates the whole day, and Chapter 2 already showed what a duplicated key does to every downstream join and sum. Idempotence is what makes a retry safe, and retries are the only realistic recovery for a scheduled job.

### The debugging routine, in order

1. Read the log and find the last stage with a sane row count.
2. Re-run on the exact input partition from \`data/raw\` — this is why raw is immutable.
3. Run the \`.pipe\` steps one at a time, checking \`shape\` and \`dtypes\` between each.
4. Bisect the data: does \`df.head(1000)\` fail? Then narrow with \`df[df.revenue.isna()]\` or \`df[df.duplicated('order_id', keep=False)]\` until you are holding the offending rows.
5. Shrink those rows into a three-row fixture and add the test from the previous lesson. A bug you cannot reproduce in a three-row DataFrame is not understood yet.

### Failure modes you will meet

| Symptom | Usual cause |
|---|---|
| ids print as \`10432.0\` | a null appeared and promoted an int column to float (Chapter 3) |
| revenue doubled overnight | a partition was appended twice, or a join key stopped being unique (Chapter 2) |
| yesterday is missing | timezone — the source stamps UTC, the filter is local |
| a category vanished from the chart | upstream renamed it; normalise text before grouping (Chapter 3) |
| MemoryError only in production | a full month rather than your sample — chunk it (Chapter 6) |
| the numbers changed, the code did not | an unpinned dependency, or an unseeded sample |

Write the run's own summary into the log every time — rows in, rows out, rows dropped, headline total. A pipeline that reports on itself is the one you can put a decision on.
        `),
      ],
      [
        q('A teammate runs your committed code on the same input file and gets a slightly different figure. Most likely cause?', [
          'Their operating system uses different line endings',
          'An unpinned dependency version, or a random draw with no fixed seed',
          'The notebook was saved without its output cells',
          'pandas rounds differently on different processors',
        ], 1, 'Reproducibility fails at the two places you did not pin: library versions and randomness, which is why the lockfile and the seed live in config.'),
        q('assert_frame_equal fails with "Attribute dtype are different: int64 vs float64" on a column you just filtered. Best first move?', [
          'Pass check_dtype=False so the suite goes green',
          'Cast the expected frame to float64',
          'Call reset_index(drop=True) on both frames',
          'Find out what introduced the null that promoted the column, because that is the real change',
        ], 3, 'An int column turns float only when a missing value appears, so the dtype mismatch is the finding rather than the noise.'),
        q('A nightly job failed halfway and you re-ran it; that day now shows double the revenue. Which design prevents this?', [
          'Writing each run to its own dated partition and overwriting it, instead of appending to a shared file',
          'Wrapping the job in try/except so it logs and continues',
          'Running the job twice deliberately and averaging the results',
          'Adding a uniqueness constraint to the output CSV',
        ], 0, 'Overwriting a partition makes the step idempotent, so a retry reproduces the day rather than adding to it.'),
        q('An upstream feed silently starts sending region as "north" instead of "North". Which check catches it?', [
          'Asserting that the row count is stable',
          'A dtype contract on the region column',
          'Comparing the set of distinct values against the trailing baseline',
          'A null-rate threshold on the column',
        ], 2, 'The column is still a non-null string of the same shape, so only a value-level drift check notices the new category.'),
      ]
    ),
  ],
  final: [
    q('arr has shape (4, 6). What shape does arr.mean(axis=1) return?', [
      '(4,)', '(6,)', '(4, 1)', '(1, 6)',
    ], 0, 'axis=1 is the axis consumed by the reduction, leaving one mean per row.'),
    q('Why does np.nan == np.nan return False?', [
      'It is a bug retained for backwards compatibility',
      'NaN equals only itself inside arrays, not as a scalar',
      'Comparison requires the same dtype on both sides',
      'NaN is defined as unequal to everything, so np.isnan is the only correct test',
    ], 3, 'IEEE-754 defines NaN as not equal to any value including itself, which is why isna/isnan exist.'),
    q('Why must each condition be parenthesised in df[(df.a > 1) & (df.b < 5)]?', [
      'pandas requires parentheses in all boolean indexing',
      'The & operator binds more tightly than the comparisons, so it would be evaluated first',
      'Without them pandas falls back to label-based indexing',
      'Parentheses force a copy rather than a view',
    ], 1, 'Python gives & higher precedence than > and <, so the unparenthesised form tries to AND a number with a Series.'),
    q('Your frame has one column per month and you need it long for groupby and plotting. Which reshapes it?', [
      'df.pivot(index="month", columns="value")',
      'df.stack().reset_index()  only after a MultiIndex is set',
      'df.melt(id_vars="region", var_name="month", value_name="revenue")',
      'df.transpose()',
    ], 2, 'melt collapses many value columns into one variable column and one value column — wide to long.'),
    q('You impute a 20%-missing column with its overall mean. What happens to your confidence intervals?', [
      'They become too narrow, because imputation at the centre shrinks the variance',
      'They widen to reflect the added uncertainty',
      'They are unaffected, since the mean is unchanged',
      'They become invalid only if the data is skewed',
    ], 0, 'Every imputed row sits exactly at the mean, so the observed spread falls and the analysis looks more precise than the data allows.'),
    q('In what order should text normalisation and drop_duplicates run?', [
      'Deduplicate first, so there is less text to clean',
      'Order does not matter for string columns',
      'Deduplicate first, then normalise the survivors',
      'Normalise first, or "Acme " and "Acme" both survive as distinct rows',
    ], 3, 'Deduplication compares exact values, so trailing spaces and case differences defeat it unless the text is cleaned first.'),
    q('You need to show the relationship between two numeric columns across 60,000 rows. Best approach?', [
      'A line chart sorted by x',
      'A scatter plot at full opacity',
      'A hexbin, or a scatter with low alpha or a random subsample',
      'A stacked bar chart of binned values',
    ], 2, 'At that density a plain scatter renders as a solid blob; hexbin or transparency restores the density information.'),
    q('A colleague plots revenue and churn rate on a dual y-axis to argue they move together. The problem is:', [
      'Dual axes are unsupported in matplotlib',
      'The two scales are arbitrary, so any apparent alignment can be manufactured',
      'Churn rate must be plotted as bars, not a line',
      'Revenue should always be shown on a log scale',
    ], 1, 'With two independently chosen ranges you can slide either series until they overlap; two stacked panels sharing the x-axis is honest.'),
    q('Which statement correctly defines a p-value?', [
      'The probability of data at least this extreme, assuming the null hypothesis is true',
      'The probability that the null hypothesis is true',
      'The probability that the observed effect is real',
      'The proportion of the effect explained by chance',
    ], 0, 'It is a conditional probability of the data given the null — never a probability about the hypothesis itself.'),
    q('An A/B test gives a 95% CI for the lift of -2% to +9%. The honest summary is:', [
      'B is better, since most of the interval is positive',
      'There is no effect, since the interval contains zero',
      'The data is consistent with anything from a small loss to a sizeable gain, so it cannot decide the question',
      'The test is invalid and should be discarded',
    ], 2, 'A wide interval spanning zero means the study was inconclusive, which is different from having demonstrated no effect.'),
    q('df.info() reports 40 MB but df.info(memory_usage="deep") reports 610 MB. Why?', [
      'The deep figure counts the index twice',
      'The shallow figure excludes rows containing NaN',
      'Deep measurement includes compression overhead',
      'Object columns store pointers, so only the deep count follows them to the actual strings',
    ], 3, 'A shallow count sees 8 bytes per pointer; the text those pointers reference is only measured with deep=True.'),
    q('You must aggregate monthly revenue from a 30 GB folder of parquet files on a laptop. Best approach?', [
      'Query the files with DuckDB or a lazy Polars scan and bring back only the aggregate',
      'pd.read_parquet the whole folder, then groupby',
      'Convert everything to CSV first so it can be read line by line',
      'Sample 1% of the files and multiply the result by 100',
    ], 0, 'Both engines read parquet out of core with column pruning, so only the small grouped result ever enters pandas memory.'),
    q('What makes a pipeline step idempotent, and why does it matter?', [
      'It never writes to disk, so retries cost nothing',
      'It runs in constant memory regardless of input size',
      'Re-running it on the same input reproduces the same output instead of adding to it, so a failed run can safely be retried',
      'It validates its own inputs before running',
    ], 2, 'Without idempotence a retry after a partial failure duplicates data, which inflates every downstream sum and join.'),
    q('Why should test fixtures be tiny hand-written DataFrames rather than a sample of production data?', [
      'pytest cannot read parquet or CSV files',
      'You can encode the exact edge case, the diff stays readable, and no personal data is committed',
      'Production samples are always too large for git',
      'Hand-written frames avoid dtype inference entirely',
    ], 1, 'A fixture exists to pin one behaviour, so it should contain the awkward case deliberately rather than whatever a random export happened to include.'),
  ],
});
