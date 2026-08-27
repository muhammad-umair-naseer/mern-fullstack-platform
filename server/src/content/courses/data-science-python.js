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
        `,
        [
          q('Which of these returns a copy rather than a view of the original array?', [
            'sales[0:2]',
            'sales[:, 1]',
            'sales[[0, 1]]',
            'sales[0]',
          ], 2, 'Passing a list of positions is fancy indexing, which always allocates a new array; the other three are basic slices and share memory.'),
          q('arr.dtype prints object. What does that tell you?', [
            'The array holds pointers to boxed Python objects, so the speed and the vectorised operations are gone',
            'The array is empty and has not been given a type yet',
            'The values are strings, which is always correct for text',
            'NumPy will promote it to float64 on the next operation',
          ], 0, 'object dtype means NumPy is storing pointers again rather than one contiguous block of fixed-width values, so it behaves like a Python list with extra steps.'),
          q('You need exactly 11 evenly spaced points from 0 to 1 with both ends included. Which is correct?', [
            'np.arange(0, 1, 0.1)',
            'np.linspace(0, 1, 11)',
            'np.arange(0, 1.1, 0.1)',
            'np.zeros(11) + 0.1',
          ], 1, 'linspace takes a count and includes both endpoints; a float step in arange accumulates rounding error and can give you one element too many or too few.'),
        ]
      ),
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
        `,
        [
          q('Which pair of shapes broadcasts successfully?', [
            '(3, 4) and (3,)',
            '(3, 4) and (4,)',
            '(5, 2) and (2, 5)',
            '(3,) and (4,)',
          ], 1, 'Shapes line up from the right, so (4,) matches the trailing axis of (3, 4) and is repeated down the rows.'),
          q('Why is np.vectorize not a real optimisation?', [
            'It only accepts one-dimensional input',
            'It converts the array to object dtype first',
            'It is a convenience wrapper that still loops in Python, so it changes the syntax and not the speed',
            'It silently casts every result to float64',
          ], 2, 'The speed in NumPy comes from ufuncs running the loop in compiled code; np.vectorize keeps the Python-level loop and merely hides it.'),
          q('Why can np.where(mask, a / b, 0) still emit a divide-by-zero warning?', [
            'The mask is evaluated after the division result is cast',
            'np.where evaluates both branches over the whole array before selecting',
            'Zero is not a valid fill value for np.where',
            'The warning comes from the mask, not from the division',
          ], 1, 'np.where picks elementwise from two fully computed arrays, so the expensive or invalid branch runs everywhere regardless of the mask.'),
        ]
      ),
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
        `,
        [
          q('What is keepdims=True for in sales.sum(axis=1, keepdims=True)?', [
            'It keeps the original values alongside the totals',
            'It prevents NaN values from being dropped',
            'It returns a Python list instead of an array',
            'It leaves the collapsed axis at length 1 so the result broadcasts back against the original array',
          ], 3, 'Without it the reduction returns shape (2,), which will not line up for a row-wise division; keepdims gives (2, 1), which stretches correctly.'),
          q('big = sales > 75. What does big.mean() give you?', [
            'The mean of the values that are greater than 75',
            'The proportion of elements that are greater than 75',
            'The count of elements greater than 75',
            'NaN, because you cannot average booleans',
          ], 1, 'True counts as 1 and False as 0, so the mean of a boolean array is the fraction that are True — the shortest way to answer "what share of rows...".'),
          q('Why prefer rng = np.random.default_rng(42) to np.random.seed(42)?', [
            'default_rng draws faster from the normal distribution',
            'np.random.seed only accepts seeds under 2**32',
            'The legacy functions share one hidden global generator, so any library call or reordered cell changes your results',
            'default_rng is the only one that supports lognormal draws',
          ], 2, 'A generator you create and pass explicitly is reproducible by construction, whereas the global state can be advanced by code you did not write.'),
        ]
      ),
        lesson('Sorting, Searching, and Set Operations', 13, `
Sorting values is the easy half. Getting the *positions* is what makes sorting useful, because real data arrives as parallel arrays that have to move together.

### sort gives values, argsort gives the order

\`\`\`py
import numpy as np

revenue = np.array([120., 90., 300., 45.])
region  = np.array(['north', 'south', 'east', 'west'])

np.sort(revenue)              # [45, 90, 120, 300] — a sorted COPY; region is now useless
order = np.argsort(revenue)   # [3, 1, 0, 2] — the indices that WOULD sort it
revenue[order], region[order] # both reordered together, still aligned
revenue[order[::-1]]          # descending
\`\`\`

\`np.argsort\` is the one you reach for in analysis, because an index can be applied to every other array you hold. Two details bite: \`np.sort(a)\` returns a copy while \`a.sort()\` sorts in place and returns \`None\` — \`a = a.sort()\` destroys your data — and the default algorithm is not stable, so equal values can swap. Pass \`kind='stable'\` whenever ties must keep their original order.

For more than one key, \`lexsort\` takes a tuple and treats the **last** entry as the primary key:

\`\`\`py
order = np.lexsort((revenue, region))   # by region first, then revenue within region
\`\`\`

Reading that tuple left-to-right is the standard mistake; it is deliberately backwards.

### Top-k without sorting everything

\`\`\`py
idx = np.argpartition(revenue, -3)[-3:]        # the 3 largest, in no order — linear time
idx = idx[np.argsort(revenue[idx])[::-1]]      # now sort just those three
\`\`\`

A full sort is n log n. \`argpartition\` only guarantees that everything before position k is smaller than everything after it, which is exactly what "top 10 customers out of 20 million" needs and is measurably faster.

### argmax, argmin, and the NaN trap

\`\`\`py
revenue.argmax()        # 2 — the POSITION, not the value
revenue[revenue.argmax()]

x = np.array([1.0, np.nan, 3.0])
x.argmax()              # 1 — it returns the NaN
np.nanargmax(x)         # 2 — correct
\`\`\`

NaN propagates through comparisons, so \`argmax\` on a column with a single missing value confidently reports the missing row as your best month. Use the \`nan\`-aware forms on any real data.

### searchsorted: binary search and fast binning

\`\`\`py
edges = np.array([0, 10, 50, 100])
np.searchsorted(edges, [5, 50, 250])          # [1, 2, 4] — insertion positions
np.searchsorted(edges, 50, side='right')      # 3 — which side of an exact tie
\`\`\`

This is how you bucket a million values into price bands in one call, and how you attach the most recent rate to a timestamp — the same idea pandas uses for \`merge_asof\` in Chapter 2. The requirement is absolute: **the haystack must already be sorted**. On unsorted input \`searchsorted\` returns plausible nonsense and raises nothing. \`np.digitize\` wraps the same machinery with an explicit \`right=\` flag.

### unique, counts, and membership

\`\`\`py
vals, counts = np.unique(region, return_counts=True)   # value_counts, without pandas
codes = np.unique(region, return_inverse=True)[1]      # how a category dtype is built
np.isin(order_ids, banned_ids)                         # elementwise membership
np.intersect1d(a, b); np.setdiff1d(a, b); np.union1d(a, b)
\`\`\`

\`np.unique\` sorts as it goes, so the output is ordered rather than first-seen. \`np.isin\` is the vectorised replacement for a Python loop over \`if x in banned\`, which is quadratic — 100,000 ids checked against a 50,000-item list is five billion comparisons, and \`isin\` does it by sorting instead.

One caution on floats: \`np.unique\` compares exactly, so \`0.1 + 0.2\` and \`0.3\` are two different values. Round to a known precision before deduplicating floats, or work on integers where you can.
        `,
        [
          q('You sort revenue with np.sort() and then index region by the same positions. What is wrong?', [
            'np.sort mutates region as well',
            'np.sort returns sorted values only, so the original positions are lost and region no longer lines up',
            'np.sort cannot handle float arrays',
            'Nothing — np.sort keeps parallel arrays aligned',
          ], 1, 'Only argsort returns the index that can be applied to every parallel array; sorted values carry no record of where they came from.'),
          q('np.searchsorted(edges, values) returns positions that make no sense, but no error. Most likely cause?', [
            'values contains duplicates',
            'edges and values have different dtypes',
            'side was left at its default',
            'edges is not sorted, which searchsorted assumes without checking',
          ], 3, 'It is a binary search, so an unsorted haystack silently produces wrong answers rather than raising.'),
          q('You need the 10 largest of 20 million values. Which is the cheapest correct approach?', [
            'np.argpartition(x, -10)[-10:], then sort those ten',
            'np.sort(x)[-10:]',
            'np.unique(x)[-10:]',
            'A Python loop tracking the running maximum ten times',
          ], 0, 'argpartition is linear and only guarantees the split point, which is all a top-k needs; a full sort does n log n work you throw away.'),
        ]
      ),
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
        `,
        [
          q('You filter a frame, compute a Series from another frame, add the two, and get all NaN. What happened?', [
            'The dtypes were incompatible so pandas returned NaN',
            'Addition on Series is not defined without fillna',
            'pandas aligned on the index, and filtering left the two sides with different labels',
            'The filter removed the column name, so the result is unnamed',
          ], 2, 'Arithmetic between Series matches on index labels rather than position, so surviving labels that do not overlap produce NaN — reset_index(drop=True) on both sides fixes it.'),
          q('df[(df.price > 100) and (df.in_stock)] raises "truth value of a Series is ambiguous". Why?', [
            'and asks for a single True or False, but a Series has many; the elementwise operator is &',
            'The parentheses are in the wrong place',
            'in_stock must be cast to int before it can be combined',
            'pandas only supports one condition per filter',
          ], 0, 'Python and/or/not need a scalar truth value, so on Series you must use the elementwise &, |, ~ with each condition parenthesised.'),
          q('north = df[df.region == "North"] then north["bonus"] = 0 raises SettingWithCopyWarning. Which fix is correct?', [
            'Wrap the assignment in a try/except and ignore the warning',
            'Use north.loc[:, "bonus"] = 0 on the same object',
            'Suppress the warning with pd.options.mode.chained_assignment = None',
            'df.loc[df.region == "North", "bonus"] = 0, so there is a single indexing step',
          ], 3, 'The warning means pandas cannot tell whether you are writing to df or to a temporary; assigning through one .loc call, or taking an explicit .copy(), removes the ambiguity.'),
        ]
      ),
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
        `,
        [
          q('What is the difference between groupby("region").size() and groupby("region")["revenue"].count()?', [
            'size counts rows including missing values; count counts non-null values in that column',
            'They are identical aliases',
            'size ignores the grouping key; count does not',
            'size returns a DataFrame and count returns a Series',
          ], 0, 'count skips nulls, so using it where you meant size silently under-reports exactly the groups with missing data.'),
          q('Why prefer .agg(revenue=("revenue", "sum")) to .agg({"revenue": ["sum", "mean"]})?', [
            'The dict form does not support multiple functions',
            'Named aggregation returns flat, self-documenting column names instead of a MultiIndex you have to flatten',
            'Named aggregation is the only form that respects dropna',
            'The dict form always runs in Python rather than compiled code',
          ], 1, 'The dict form stacks function names into a second column level; named aggregation names each output column in one readable step.'),
          q('Why is .agg("sum") usually much faster than .apply(lambda g: g.sum())?', [
            'apply loads the whole frame into memory first',
            'agg caches its result between calls',
            'The string reducer dispatches to a compiled implementation, while the lambda runs Python once per group',
            'apply cannot use the group keys as an index',
          ], 2, 'String reducers such as sum, mean, and nunique are implemented in compiled code; a lambda pays Python call overhead for every group.'),
        ]
      ),
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
        `,
        [
          q('After a left merge with indicator=True, 18% of rows are "left_only". What does that mean?', [
            'Those rows were duplicated by the join',
            'Those rows matched more than one row on the right',
            'The join was performed in the wrong direction',
            'Those left rows found no match, so every column from the right is NaN for them',
          ], 3, 'left_only marks unmatched left rows, which is where quiet under-counting comes from when a key was formatted differently on the two sides.'),
          q('long.pivot(index="date", columns="product", values="units") raises "Index contains duplicate entries". What should you do first?', [
            'Investigate the duplicated (date, product) pairs, because the error is telling you the data has duplicates',
            'Switch to pivot_table so it runs',
            'Sort the frame by date before pivoting',
            'Reset the index and try again',
          ], 0, 'pivot needs one value per cell; pivot_table would aggregate the duplicates away and hide a data-quality problem you have not explained yet.'),
          q('You need to attach the most recent exchange rate at or before each trade timestamp. Which is correct?', [
            'merge on a timestamp rounded to the nearest minute',
            'merge_asof with direction="backward" and a tolerance, both frames sorted on the key',
            'An outer merge on the date part of the timestamp',
            'concat of the two frames followed by ffill',
          ], 1, 'merge_asof is built for as-of joins; rounding a timestamp drops every row whose nearest match falls on the other side of the boundary.'),
        ]
      ),
        lesson('Window Operations: shift, rolling, and Cumulative Work', 14, `
Aggregation answers "what is the total per group". Window operations answer "compared to what" — versus last month, versus the seven-day average, versus the running total. They are how a metric becomes a trend.

### shift is the primitive everything else builds on

\`\`\`py
m = monthly.sort_values('month')          # sorting first is not optional

m['prev'] = m.revenue.shift(1)            # previous row's value, NaN in row 0
m['mom'] = m.revenue.diff()               # revenue - prev
m['mom_pct'] = m.revenue.pct_change()     # (revenue - prev) / prev
m['yoy_pct'] = m.revenue.pct_change(12)   # same month last year
\`\`\`

\`shift\` moves values down the frame in its current order, so an unsorted frame produces a "previous month" that is whatever row happened to be above. Sort first, every time. \`shift(-1)\` looks forward, which is occasionally what you want and is also how people leak the future into a model.

### rolling: a trailing window

\`\`\`py
m['ma7'] = m.revenue.rolling(7).mean()                    # first 6 rows are NaN
m['ma7'] = m.revenue.rolling(7, min_periods=1).mean()     # partial windows instead
m['sd7'] = m.revenue.rolling(7).std()

daily = daily.set_index('day').sort_index()
daily['ma7'] = daily.revenue.rolling('7D').mean()         # 7 CALENDAR days
\`\`\`

The default window is trailing and closed on the right: the value at row *i* summarises rows *i-6* through *i* inclusive. That default is what you want for a report and is a trap for a model — a "7-day average" that includes today already knows today. Build features as \`revenue.shift(1).rolling(7).mean()\` so the window ends before the row it describes.

An integer window counts **rows**; an offset window like \`'7D'\` counts **time** and needs a sorted DatetimeIndex. With gaps in the data those two give different answers, and the offset version is almost always the honest one. \`min_periods\` is the other decision: leaving it at the default hides the ramp-up as NaN, while \`min_periods=1\` shows a first point averaged over one noisy observation. Say which you chose.

### expanding and ewm

\`\`\`py
m['cume'] = m.revenue.cumsum()                  # running total
m['best_so_far'] = m.revenue.cummax()
m['avg_to_date'] = m.revenue.expanding().mean() # window grows from the start
m['ewma'] = m.revenue.ewm(span=7).mean()        # recent points weighted more
\`\`\`

\`expanding\` is a rolling window with no upper bound. \`ewm\` never fully forgets an old point but weights it down smoothly, so it reacts faster than a boxcar average without the step you get when a large value falls out of a fixed window.

### Per group: sort, then group, then window

\`\`\`py
panel = panel.sort_values(['store', 'month'])

panel['prev'] = panel.groupby('store')['revenue'].shift(1)
panel['ma3'] = (panel.groupby('store')['revenue']
                     .transform(lambda s: s.rolling(3).mean()))
panel['cume'] = panel.groupby('store')['revenue'].cumsum()
\`\`\`

This is the bug that reaches production: calling \`panel.revenue.shift(1)\` on a stacked panel takes the previous **row**, which at every store boundary is the last month of the previous store. The numbers look reasonable and one row per store is silently wrong. Always window inside \`groupby\`.

Note the shape difference from Chapter 2's aggregation. \`groupby(...).rolling(...)\` returns a result with an extra index level that you must \`reset_index(level=0, drop=True)\` before assigning back; \`transform\` returns something already aligned to the original rows, so it drops straight into a column.

### Ranking and shares

\`\`\`py
panel['rank'] = panel.groupby('month')['revenue'].rank(method='dense', ascending=False)
panel['share'] = panel.revenue / panel.groupby('month')['revenue'].transform('sum')
\`\`\`

Finally, resist smoothing before you have seen the raw series. A 30-day rolling mean will make almost any noisy metric look like a clean trend, including one whose real shape is a step change on the day a tracking script broke.
        `,
        [
          q('You call df.revenue.shift(1) on a frame holding many stores stacked together. What goes wrong?', [
            'shift returns NaN for every row after the first store',
            'At each store boundary the "previous" value comes from a different store',
            'shift silently sorts the frame by the index first',
            'Nothing, as long as the frame is sorted by month',
          ], 1, 'shift moves values by row position with no notion of groups, so the first row of each store picks up the last row of the store above it.'),
          q('You are building a feature for a model and use revenue.rolling(7).mean(). What is the problem?', [
            'Seven is too short a window for weekly data',
            'rolling requires a DatetimeIndex',
            'The default window is closed on the right, so the average includes the row it is meant to predict',
            'rolling drops rows containing NaN',
          ], 2, 'A trailing window ending at the current row already contains today, so the feature leaks the target; shift(1) before rolling ends the window one row earlier.'),
          q('What does min_periods=1 change in revenue.rolling(7, min_periods=1).mean()?', [
            'It restricts the window to complete weeks only',
            'It forces the window to be measured in calendar days',
            'It drops NaN values from the underlying column first',
            'The first six rows return an average over however many rows exist instead of NaN',
          ], 3, 'min_periods sets how many observations a window needs before it produces a number, so 1 shows a ramp-up rather than leading NaN.'),
        ]
      ),
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
        `,
        [
          q('df.isna().sum() reports zero for age, but describe() shows a minimum age of -999. What is going on?', [
            'describe() ignores missing values, so the two disagree',
            'The column is stored as an object dtype',
            'A legacy sentinel encodes "unknown" as a real number, so isna cannot see it and every mean is poisoned',
            '-999 is how pandas represents a missing integer',
          ], 2, 'Sentinels such as -999, 0, or 1900-01-01 pass straight through isna(), which is why you scan describe() and value_counts() before trusting a missing-value count.'),
          q('user_id starts printing as 10432.0 after a merge. What fixed it and why?', [
            'astype("Int64"), because NaN is a float and the nullable integer type can hold missing values without promoting',
            'astype(int), because the column was never really missing',
            'round(0), because pandas displays a trailing decimal by default',
            'astype(str), because ids should always be text',
          ], 0, 'NaN is a float value that an ordinary int64 column cannot hold, so pandas promotes to float; the capital-I Int64 type is nullable and stays integer.'),
          q('You impute missing income with the median before splitting into train and test. Why is that wrong?', [
            'The median is not a valid imputation for skewed data',
            'The median must be computed per group to be meaningful',
            'Imputation should always happen after modelling',
            'The median was computed using test rows, so test information has leaked into training data',
          ], 3, 'Any statistic used to fill training data must be estimated on the training data alone, otherwise the evaluation is optimistic.'),
        ]
      ),
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
        `,
        [
          q('A postcode column read from CSV turned "02134" into 2134. What is the fix?', [
            'Reformat the values with zfill after loading',
            'Pass dtype={"zip": str} at read time, because the leading zero cannot be recovered afterwards',
            'Cast the column to category',
            'Read the file with na_values=["0"]',
          ], 1, 'Once the value is parsed as a number the zero is gone, and zfill only guesses the width; declaring identifiers as str at read time is the only reliable fix.'),
          q('Casting a column of the strings "Yes" and "No" with bool() makes every row True. Why?', [
            'bool() is not defined for pandas Series',
            'pandas caches the first value and applies it to the column',
            'Every non-empty Python string is truthy, so "No" and even "False" evaluate to True',
            'The column contained hidden whitespace',
          ], 2, 'Truthiness in Python is about emptiness, not meaning, so booleans must be mapped explicitly with a dictionary.'),
          q('Stripping every non-numeric character from a price column parsed all rows with no NaN. What can still be wrong?', [
            'Accounting negatives such as (450) lost the brackets, and a European "1,5" became 15',
            'Nothing — a zero NaN count proves the parse was clean',
            'The column will be int rather than float',
            'The original strings are unrecoverable, so the values must be right',
          ], 0, 'The NaN count only catches values that failed outright; rescuing a value into the wrong number never shows up there, which is why you diff before and after.'),
        ]
      ),
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
        `,
        [
          q('Why does the robust z-score use the median and the MAD instead of the mean and the standard deviation?', [
            'It is faster to compute on large arrays',
            'It works on categorical columns as well',
            'The mean and standard deviation are inflated by the very outliers you are trying to find',
            'The MAD is scaled so that thresholds are always exactly 3',
          ], 2, 'That inflation is masking: one extreme value widens the yardstick until nothing exceeds three sigma, while the median and MAD barely move.'),
          q('You exclude 40 extreme orders and the headline lift becomes significant. What must the report include?', [
            'A note that the excluded rows were errors',
            'A sensitivity check reporting the headline number with and without those rows',
            'The p-value of the excluded rows on their own',
            'A larger sample to compensate for the removed rows',
          ], 1, 'Showing both numbers is what distinguishes a defensible exclusion rule from choosing the rows that produce the answer you wanted.'),
          q('What does chaining cleaning steps with .pipe() buy you over the same code in notebook cells?', [
            'It runs the steps in parallel',
            'It avoids copying the frame between steps',
            'It converts every step into a compiled operation',
            'It runs in one fixed order every time, so a colleague re-running it cannot execute the cells out of sequence',
          ], 3, 'Out-of-order cell execution is the most common reason an analyst cannot reproduce their own number, and a pipe chain has exactly one order.'),
        ]
      ),
        lesson('Reading Files That Fight Back: Encodings, Delimiters, and Excel', 13, `
Cleaning starts before the first \`isna()\`. A file exported from a fifteen-year-old system arrives with the wrong encoding, a header three rows down, and a column of numbers that are text. Get the read wrong and every later step is cleaning damage you caused yourself.

### Encoding

\`\`\`py
pd.read_csv('sales.csv')
# UnicodeDecodeError: 'utf-8' codec can't decode byte 0xa3 in position 412
\`\`\`

That byte is a pound sign written by a Windows export. \`encoding='cp1252'\` (or \`'latin-1'\`, which never fails because every byte is valid) reads it. Check the result rather than trusting it: \`latin-1\` will happily turn a UTF-8 \`é\` into \`Ã©\`, and mojibake is much harder to spot than a crash.

\`\`\`py
df = pd.read_csv('sales.csv', encoding='cp1252')
df.city.str.contains(r'[ÃÂ]', regex=True).sum()    # 0 if the encoding was right
\`\`\`

The other encoding surprise is the byte-order mark. Excel writes UTF-8 with a BOM, so your first column is named \`'\\ufeffcustomer_id'\` and \`df.customer_id\` raises \`KeyError\` on a column you can plainly see in \`df.head()\`. \`encoding='utf-8-sig'\` strips it.

### Delimiters, quoting, and bad lines

\`\`\`py
pd.read_csv(path, sep=';')                       # European exports
pd.read_csv(path, sep=None, engine='python')     # sniff it, when you truly do not know
pd.read_csv(path, sep='\\t')                      # a .csv that is actually TSV
pd.read_csv(path, on_bad_lines='warn')           # keep going, but tell me
\`\`\`

A quoted field containing the delimiter or a newline is handled correctly by default — that is what the quotes are for — so resist the urge to split lines yourself. If a file genuinely has ragged rows, \`on_bad_lines='warn'\` reports them; count how many you skipped and look at one.

### Numbers that are text because of formatting

\`\`\`py
pd.read_csv(path, thousands=',', decimal='.')     # 1,234.56
pd.read_csv(path, thousands='.', decimal=',')     # 1.234,56 — German export
\`\`\`

Getting this wrong is worse than a parse failure: with the wrong \`decimal\`, \`1.234,56\` reads as text and later strips to \`123456\`. One column silently multiplied by a hundred is exactly the class of error nobody catches downstream.

### Headers that are not on row one

\`\`\`py
pd.read_csv(path, skiprows=3)                    # title block above the header
pd.read_csv(path, header=None, names=cols)       # no header at all
pd.read_csv(path, skipfooter=2, engine='python') # a totals row at the bottom

df = pd.read_excel(path, header=[0, 1])
df.columns = ['_'.join(str(p) for p in c if 'Unnamed' not in str(p))
              for c in df.columns]               # flatten a two-row header
\`\`\`

A trailing "Total" row is the nastiest of these, because it parses cleanly and then doubles your sum.

### Excel

\`\`\`py
sheets = pd.read_excel(path, sheet_name=None)    # dict of ALL sheets
df = pd.read_excel(path, sheet_name='Q3', dtype={'sku': str})
df['region'] = df.region.ffill()                 # merged cells fill only the first row
\`\`\`

\`sheet_name=None\` returns a dictionary, not a frame — reading one sheet by accident when there were twelve is a common quiet loss. Merged cells appear as a value followed by NaN, which \`ffill\` restores. And a date column where some cells were typed as text arrives as a mix of \`Timestamp\` and \`str\`; \`pd.to_datetime(col, errors='coerce')\` plus a count of what failed is the only safe follow-up.

### Verify the read before you clean

\`\`\`py
raw = pd.read_csv(path, dtype=str, keep_default_na=False)   # a look at the true text
print(len(raw), 'rows parsed')                              # compare with wc -l
df.dtypes
df.head(20)
\`\`\`

Reading everything as text once, before any coercion, shows you what is actually in the file. Then compare the parsed row count against the line count of the file. If they disagree by more than the header, the delimiter or the quoting is wrong, and no amount of downstream cleaning will put those rows back.
        `,
        [
          q('df.head() clearly shows a customer_id column, but df.customer_id raises KeyError. What is the likely cause?', [
            'The column is stored as an index level',
            'A UTF-8 byte-order mark is part of the first column name; read with encoding="utf-8-sig"',
            'The file has a trailing whitespace delimiter',
            'pandas lowercases column names on read',
          ], 1, 'Excel writes UTF-8 with a BOM, so the first header becomes "\\ufeffcustomer_id" — it prints identically but is a different string.'),
          q('A German export contains 1.234,56. Which read_csv arguments parse it correctly?', [
            'thousands=",", decimal="."',
            'decimal="." and converters on the column',
            'thousands=".", decimal=","',
            'No arguments — pandas detects the locale from the file',
          ], 2, 'In that format the dot groups thousands and the comma is the decimal separator; swapping them turns 1.234,56 into text that later strips to 123456.'),
          q('What does pd.read_excel(path, sheet_name=None) return?', [
            'A dictionary of every sheet in the workbook, keyed by sheet name',
            'The first sheet, which is the default',
            'An empty frame, since no sheet was named',
            'The active sheet as saved by the last user',
          ], 0, 'Passing None asks for all sheets, so the result is a dict of frames rather than a single frame.'),
        ]
      ),
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
        `,
        [
          q('Why does pd.crosstab(df.plan, df.churned, normalize="index") answer a different question from raw counts?', [
            'It removes rows with missing values first',
            'It gives the churn rate within each plan, so plans of very different sizes become comparable',
            'It sorts the plans by churn rate',
            'It converts counts to percentages of the whole table',
          ], 1, 'Raw counts mostly reflect how many users a plan has, so the largest plan can show the most churned users and the lowest churn rate at once.'),
          q('A column predicts your target with 99% accuracy. What is the first thing to check?', [
            'Whether the column is correlated with any other feature',
            'Whether the column has enough distinct values',
            'When the column is populated, since anything recorded after the outcome cannot be an input',
            'Whether the accuracy holds on a larger sample',
          ], 2, 'Fields such as cancellation_reason only exist once the outcome has happened, so they leak the answer rather than predicting it.'),
          q('Your weekly revenue plot shows a sharp step up on one specific week. What is the most likely explanation?', [
            'A tracking, schema, or backfill change rather than a change in user behaviour',
            'Seasonality in the underlying market',
            'A successful marketing campaign',
            'Random variation that will revert next week',
          ], 0, 'Real behaviour moves gradually; a clean discontinuity on one date almost always marks something changing in the pipeline that produced the data.'),
        ]
      ),
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
        `,
        [
          q('fig, axes = plt.subplots(2, 2). Why does iterating over axes directly fail to give you four axes?', [
            'subplots returns a list of figures, not axes',
            'The axes are only created when something is drawn on them',
            'You must call fig.add_subplot for each panel first',
            'It returns a 2-D array, so iterating yields rows of axes; use axes.flat',
          ], 3, 'A grid of subplots comes back with the grid shape, so a single loop needs axes.flat (or axes.ravel()) to walk the individual panels.'),
          q('How do you make a pandas .plot() call draw into a figure you already created?', [
            'Pass ax=ax to the plot call',
            'Call plt.gcf() immediately afterwards',
            'Set plt.rcParams["figure.current"] first',
            'Use df.plot() and then fig.add_axes(ax)',
          ], 0, 'The ax argument tells pandas to draw into your axes instead of creating a new figure of its own.'),
          q('A chart will be projected onto a large screen at a conference. Which export is right?', [
            'PNG at the default 72 dpi',
            'JPEG, which compresses better for photographs',
            'SVG or PDF, because vector output stays sharp at any size',
            'PNG at dpi=50 to keep the file small',
          ], 2, 'Vector formats redraw at the display resolution; a low-dpi raster stretched across a screen is what makes careful work look careless.'),
        ]
      ),
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
        `,
        [
          q('A histogram looks bimodal at 20 bins and unimodal at 5. What should you do?', [
            'Report the bimodal version, since more bins show more detail',
            'Render two or three bin counts before believing any shape, and prefer bins="auto"',
            'Use a pie chart instead, which has no bins',
            'Always use the matplotlib default of 10 bins',
          ], 1, 'Bin width is a choice you are making for the reader, so the shape has to survive more than one setting before you quote it.'),
          q('Which visual encoding do human eyes decode most accurately?', [
            'Colour intensity',
            'Area',
            'Angle',
            'Position along a common scale',
          ], 3, 'The accuracy ordering runs position, then length, then angle, then area, then colour intensity — which is why a sorted bar beats a pie every time.'),
          q('Why is a rainbow colour map a poor choice for a continuous quantity?', [
            'It is perceptually uneven, so it invents boundaries that do not exist in the data',
            'It cannot be rendered in vector formats',
            'It uses too many colours for matplotlib to interpolate',
            'It is only defined for values between 0 and 1',
          ], 0, 'Equal steps in the data map to unequal perceived steps, creating false edges; a sequential map for magnitude and a diverging map around a real midpoint are the correct tools.'),
        ]
      ),
        lesson('seaborn: Statistical Charts in One Line', 13, `
seaborn sits on matplotlib and does the two things that make exploratory charts slow to write by hand: it takes long-form data and splits it by a column, and it computes the statistic — a count, a mean with an interval, a density — for you. Everything from the previous lesson still applies underneath, because a seaborn chart is a matplotlib \`Axes\`.

\`\`\`py
import seaborn as sns, matplotlib.pyplot as plt
sns.set_theme(style='whitegrid', context='talk')

fig, ax = plt.subplots(figsize=(8, 4.5))
sns.barplot(data=sales, x='region', y='revenue', ax=ax, errorbar=('ci', 95))
ax.set_ylabel('Mean revenue per order (USD)')
\`\`\`

### Axes-level and figure-level: the distinction that confuses everyone

| Kind | Functions | Accepts \`ax=\` |
|---|---|---|
| axes-level | \`histplot\`, \`boxplot\`, \`scatterplot\`, \`lineplot\`, \`barplot\`, \`heatmap\` | yes |
| figure-level | \`displot\`, \`catplot\`, \`relplot\`, \`lmplot\`, \`pairplot\` | **no** |

A figure-level function creates and owns its own figure — a \`FacetGrid\` — so passing \`ax=\` raises, and your carefully built \`fig\` stays empty while a second figure appears. Use axes-level functions inside a layout you control; use figure-level functions when you want seaborn to build the grid:

\`\`\`py
g = sns.relplot(data=sales, x='ordered_at', y='revenue',
                hue='channel', col='region', col_wrap=3,
                kind='line', height=3, aspect=1.4)
g.set_axis_labels('Month', 'Revenue (USD)')
g.figure.savefig('by_region.png', dpi=200)
\`\`\`

\`hue\`, \`col\`, and \`row\` are the whole point: three arguments produce a small-multiples grid that would be twenty lines of matplotlib. They require **long form**, so if your frame has one column per month, melt it first (Chapter 2). Facets share axes by default, which is what makes panels comparable — override with \`facet_kws={'sharey': False}\` only when the scales genuinely differ, and say so in the caption.

### Know what the chart computed for you

\`\`\`py
sns.barplot(data=sales, x='region', y='revenue')        # MEAN per region + 95% CI
sns.barplot(data=sales, x='region', y='revenue', estimator='sum', errorbar=None)
sns.countplot(data=sales, x='region')                   # row counts
\`\`\`

\`barplot\` shows the **mean** with a bootstrapped confidence interval, not the total. Readers who assume a bar chart is a sum will misread it every time, so either label the axis "mean revenue per order" or pass \`estimator='sum'\`. That default is also a feature: it is the easiest way to put uncertainty on a comparison, which is the honest version of the two-bar chart from the previous lesson.

\`kdeplot\` smooths, and smoothing invents data. A density curve over session lengths will extend below zero and can smear a genuine spike at exactly 30 seconds into a gentle hill. Use \`bw_adjust\` to see how sensitive the shape is, add \`cut=0\` to stop the curve running past the observed range, and show the histogram alongside it.

### Two charts worth the keystrokes

\`\`\`py
corr = df.corr(numeric_only=True)
sns.heatmap(corr, cmap='vlag', center=0, vmin=-1, vmax=1,
            annot=True, fmt='.2f', square=True)
\`\`\`

A correlation heatmap needs a **diverging** map centred at zero, otherwise -0.9 and +0.1 get similar colours and the plot is decorative rather than informative.

\`\`\`py
sns.pairplot(df[['revenue', 'units', 'discount', 'tenure_days']].sample(2000),
             diag_kind='hist', plot_kws={'alpha': 0.2, 's': 8})
\`\`\`

\`pairplot\` draws k squared panels, so ten columns is a hundred scatter plots and a slow notebook; sample the rows and pick the columns deliberately.

Finally, \`regplot\` and \`lmplot\` fit and draw an OLS line whether or not a line describes the data. The band around it is a confidence interval for that fitted line under assumptions nobody checked. It is a fine exploratory hint and not a result — Chapter 5 is where that line gets a number, an interval, and a residual plot.
        `,
        [
          q('sns.relplot(..., ax=ax) raises an error. Why?', [
            'relplot only accepts wide-form data',
            'ax must be passed as the first positional argument',
            'relplot is figure-level: it creates and owns its own FacetGrid, so it cannot draw into your axes',
            'The figure must be created with sns.figure() rather than plt.subplots()',
          ], 2, 'Figure-level functions such as relplot, displot, catplot, and lmplot build their own figure; only axes-level functions such as scatterplot and histplot take ax=.'),
          q('sns.barplot(data=sales, x="region", y="revenue") — what do the bar heights show?', [
            'The mean revenue per row in each region, with a bootstrapped confidence interval',
            'The total revenue per region',
            'The median revenue per region',
            'The number of rows in each region',
          ], 0, 'barplot aggregates with the mean by default and draws an interval around it; pass estimator="sum" if a total is what you meant.'),
          q('Why should a correlation heatmap use a diverging colour map centred at zero?', [
            'Diverging maps use fewer distinct colours',
            'Because correlations range from -1 to 1 and zero is a real midpoint, so both direction and strength stay readable',
            'Sequential maps cannot show negative numbers',
            'It is required for the annot argument to work',
          ], 1, 'With a sequential map a strong negative and a weak positive can look alike; centring a diverging map at zero encodes sign as hue and strength as intensity.'),
        ]
      ),
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
        `,
        [
          q('df.x.std() and df.x.to_numpy().std() disagree on the same column. Why?', [
            'pandas skips missing values and numpy does not',
            'pandas defaults to ddof=1, the sample estimate, while numpy defaults to ddof=0',
            'numpy computes the standard deviation on ranks',
            'The conversion to numpy changes the dtype to float32',
          ], 1, 'The two libraries chose different defaults for the divisor, and the gap is largest at small n — pass ddof explicitly when it matters.'),
          q('With n = 100,000 a Shapiro-Wilk test rejects normality. What should you conclude?', [
            'The column is definitely not normal, so no parametric method applies',
            'The test is invalid above n = 5,000 and should be ignored',
            'The data must be transformed until the test passes',
            'Very little — at that size the test detects deviations far too small to matter, so look at a Q-Q plot instead',
          ], 3, 'Normality tests answer "is it exactly normal", which is never true; the useful question is whether it is close enough for what you are about to do, and the picture answers that.'),
          q('For a log-normal revenue column, why is "mean plus or minus two standard deviations" a bad summary?', [
            'The standard deviation is undefined for log-normal data',
            'It describes 95% of the data rather than 68%',
            'The interval extends into negative revenue, which cannot happen — use percentiles or work on a log scale',
            'The mean and the median are identical, so the interval is redundant',
          ], 2, 'That interval assumes symmetry; on a right-skewed column it produces impossible lower bounds and understates the upper tail.'),
        ]
      ),
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
        `,
        [
          q('Pearson r is 0.31 and Spearman is 0.79 on the same two columns. What does the gap suggest?', [
            'One of the two coefficients was computed on the wrong columns',
            'The relationship is strong but not linear, or a few extreme points are dragging Pearson down',
            'The sample is too small for either to be meaningful',
            'The two variables are independent',
          ], 1, 'Spearman correlates ranks, so it captures any monotonic shape and shrugs off outliers; a large gap is a signal to plot the data.'),
          q('Your standard error is 1.0 at n = 100. Roughly what n do you need to halve it?', [
            '200',
            '400',
            '1,000',
            '10,000',
          ], 1, 'The standard error falls with the square root of n, so halving it takes four times the data.'),
          q('What does a 95% confidence interval actually mean?', [
            '95% of the observations fall inside it',
            'There is a 95% chance the true value lies in this particular interval',
            'The procedure captures the true value in 95% of repeated samples',
            'It accounts for 95% of both random error and sampling bias',
          ], 2, 'The guarantee is about the long-run behaviour of the method, not about the data spread, and it says nothing about bias in how the sample was drawn.'),
        ]
      ),
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
        `,
        [
          q('Why is equal_var=False (the Welch test) the better default for comparing two means?', [
            'It is faster on large samples',
            'It does not require the groups to be independent',
            'It corrects automatically for multiple comparisons',
            'It does not assume the two groups share a variance, an assumption that is rarely true and rarely checked',
          ], 3, 'Welch costs almost nothing in power and stays correct when the group variances differ, which is the common case in real data.'),
          q('You check an A/B test every morning and stop as soon as p drops below 0.05. What is wrong?', [
            'Repeated peeking inflates the false-positive rate well above 5%, because the null will eventually cross the line by chance',
            'Nothing, provided the sample sizes are equal',
            'The p-value becomes invalid once the sample exceeds 10,000',
            'Daily data violates the independence assumption of the t-test',
          ], 0, 'Every extra look is another chance to cross the threshold, so the test must have a sample size and a stopping rule fixed in advance.'),
          q('You measured the same 200 users before and after a redesign. Which test fits?', [
            'A two-proportion z-test',
            'A paired t-test, or Wilcoxon signed-rank if the differences are skewed',
            'An independent-samples Welch t-test',
            'A chi-square test of independence',
          ], 1, 'The two measurements come from the same units, so the analysis works on the within-user differences rather than treating the groups as independent.'),
        ]
      ),
        lesson('Regression You Can Explain', 15, `
A regression is a description of how a metric moves with several things at once. Used carefully it is the most useful tool in this chapter; used as a machine that produces causal arrows it is the most dangerous.

\`\`\`py
import statsmodels.formula.api as smf

m = smf.ols('revenue ~ ad_spend + tenure_days + C(plan)', data=df).fit(cov_type='HC3')
print(m.summary())
\`\`\`

Use **statsmodels** when you want to explain, because it prints standard errors, intervals, and diagnostics. Use scikit-learn when you want to predict. Reaching for \`LinearRegression\` and reporting \`.coef_\` gives you a number with no uncertainty attached, which is how a rounding-error effect ends up in a slide.

### Reading a coefficient

Suppose \`ad_spend\` has coefficient **2.41** with a 95% interval of 1.10 to 3.72, and spend is in thousands of dollars while revenue is in dollars. The sentence is: *in this data, two accounts alike on tenure and plan but differing by one thousand dollars of ad spend differ by about $2,410 in revenue, and the data is consistent with anywhere from $1,100 to $3,720.*

Three things are doing work there. **Units** — a coefficient is meaningless until you say per what. **"Holding the others fixed"** — that is a comparison between rows in your sample, not a promise about what happens when you turn the spend up. And **the interval**, because a coefficient without one is an anecdote.

Categoricals need a reference level. \`C(plan)\` with plans Free, Pro, and Team drops Free and reports \`C(plan)[T.Pro] = 480\`, which means Pro sits 480 above **Free**, not above the average. Every dummy coefficient is a contrast against the level that was dropped, and misreading that is the single most common regression error in analyst reports.

### What R squared does and does not tell you

\`R\` squared is the share of variance the model accounts for. Adjusted R squared penalises extra predictors, because adding a random column always raises the raw figure. Neither says the model is correct: a model can explain 85% of the variance and still be built on a confounder, and a well-specified model of noisy human behaviour may only reach 0.15 and be perfectly useful.

### Look at the residuals

\`\`\`py
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.scatter(m.fittedvalues, m.resid, alpha=0.3)
ax.axhline(0, color='k', lw=1)
\`\`\`

You want a formless cloud. A **curve** means the relationship is not linear — add a term or transform. A **funnel** widening to the right means the errors grow with the fitted value, which leaves the coefficients roughly right and the standard errors wrong; \`cov_type='HC3'\` is the one-argument fix and is a sensible default. A few points far from the rest, especially at extreme x values, deserve a rerun without them and a note in the report.

### Two failure modes worth naming

**Multicollinearity.** Put \`ad_spend\`, \`impressions\`, and \`clicks\` in together and the model cannot tell them apart. The coefficients become huge, unstable, and sometimes sign-flipped, while the predictions stay fine. Check with a variance inflation factor, drop or combine the redundant columns, and never interpret a coefficient whose VIF is above about 10.

**Omitted variable bias.** Leave out something that drives both the predictor and the outcome and its influence is absorbed into the coefficient you did keep. This is Chapter 5's confounding, now with a number attached — which makes it look more authoritative and no more causal.

### Log form, and where extrapolation stops

\`\`\`py
smf.ols('np.log(revenue) ~ np.log(ad_spend) + C(plan)', data=df).fit()
\`\`\`

With both sides logged, the coefficient is an elasticity: 0.35 means a 10% rise in spend is associated with roughly a 3.5% rise in revenue. That form also tames the skew from the first lesson in this chapter.

Finally, a model knows nothing outside the range it saw. If spend ran from $0 to $40k, the fit says nothing about $400k. State the range you fitted on, next to the coefficient.
        `,
        [
          q('A model with C(plan) reports C(plan)[T.Pro] = 480, with Free as the omitted level. What does 480 mean?', [
            'Pro accounts average 480 more than the overall mean',
            'Pro accounts average 480 more than Free accounts, holding the other predictors fixed',
            'Pro accounts are 480% higher than Free accounts',
            'The plan column explains 480 units of variance',
          ], 1, 'Every dummy coefficient is a contrast against the dropped reference level, not against the average of all levels.'),
          q('The residuals versus fitted plot shows a funnel that widens to the right. What is the practical consequence?', [
            'The coefficients are meaningless and the model must be discarded',
            'R squared is overstated by the same factor',
            'The coefficients are roughly right but the standard errors are wrong, so use robust errors such as cov_type="HC3"',
            'The relationship is non-linear and needs a squared term',
          ], 2, 'Non-constant error variance mainly damages the uncertainty estimates, and a heteroskedasticity-robust covariance fixes those in one argument.'),
          q('You add impressions and clicks alongside ad_spend and the ad_spend coefficient flips sign with a huge standard error. What is happening?', [
            'The model has become non-linear',
            'The sample size is too small for three predictors',
            'The new columns are leaking the target',
            'The three predictors are highly collinear, so the model cannot separate their individual contributions',
          ], 3, 'When predictors move together the fit is still fine but individual coefficients become unstable, which is why a VIF check comes before interpreting any of them.'),
        ]
      ),
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
        `,
        [
          q('Beyond being slow, why is df.iterrows() quietly wrong on a mixed-dtype frame?', [
            'It skips the last row of the frame',
            'Each row comes back as a Series with a single dtype, so an int id next to a float column arrives as 10432.0',
            'It iterates in index order rather than row order',
            'It returns copies, so edits inside the loop are lost',
          ], 1, 'A Series holds one dtype, so a row containing both ints and floats is promoted to float — the same promotion bug from Chapter 3, once per row.'),
          q('In a cProfile report, what is the difference between cumtime and tottime?', [
            'cumtime is wall clock and tottime is CPU time',
            'cumtime counts only the first call; tottime counts every call',
            'cumtime includes time spent in functions it called; tottime is time spent in that function alone',
            'They are the same number unless threads are used',
          ], 2, 'You read cumtime to find which of your functions is expensive, then tottime to find where the time is actually burned rather than merely passed through.'),
          q('Ten times the rows makes your job take a hundred times as long. What does that tell you?', [
            'The machine ran out of RAM and started swapping',
            'The profiler overhead grows with input size',
            'This is normal for pandas, which is superlinear in row count',
            'Something inside is quadratic, such as a frame grown by concat in a loop or a per-id scan of the whole frame',
          ], 3, 'Micro-optimisation cannot rescue the wrong complexity; the fix is to restructure the work into a merge or a groupby.'),
        ]
      ),
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
        `,
        [
          q('When is astype("category") the wrong choice?', [
            'When the column is used as a groupby key',
            'When the column is nearly unique, such as 1.9 million distinct order ids, because you pay for the dictionary as well as the codes',
            'When the column contains missing values',
            'When the frame will be written to parquet',
          ], 1, 'Categories pay off through repetition; with almost no repeats the extra lookup table costs more memory than the strings did.'),
          q('Why should a money column not be stored as float32?', [
            'float32 cannot represent negative values',
            'pandas refuses to aggregate float32 columns',
            'float32 carries about 7 significant digits, so exact pennies are lost above roughly 131,000',
            'float32 is slower than float64 on modern CPUs',
          ], 2, 'Halving the width halves the precision, which is fine for a model feature and not fine for currency or identifiers.'),
          q('What is the honest case against inplace=True?', [
            'It rarely avoids a copy internally, it returns None so it breaks chaining, and pandas is deprecating it',
            'It mutates the frame while other views are reading it',
            'It only works on the object dtype',
            'It silently resets the index',
          ], 0, 'The memory saving people expect from it mostly does not exist, so the clearer df = df.drop(...) form costs nothing.'),
        ]
      ),
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
        `,
        [
          q('Why is reading three columns from a parquet file so much faster than from the equivalent CSV?', [
            'Parquet files are always smaller than CSV files',
            'Parquet is columnar, so only the requested columns are read, and row-group statistics let whole blocks be skipped',
            'Parquet keeps an index of every row',
            'CSV reads are single-threaded and parquet reads are not',
          ], 1, 'Column pruning and row-group skipping mean the bytes you do not ask for are never decompressed, and the stored dtypes remove all the parsing work.'),
          q('You are computing an average revenue per region over chunks of a huge CSV. What must you accumulate?', [
            'The mean of each chunk, then average those means',
            'Only the running sum, since count is recoverable from the row index',
            'The sum and the count per region, dividing once at the end',
            'The median per chunk, then take the middle one',
          ], 2, 'A mean is not decomposable, but sum and count are, so you combine those and divide after the last chunk.'),
          q('Why pass values through params in pd.read_sql rather than building the query with an f-string?', [
            'params results are cached by the database driver',
            'f-strings cannot contain SQL keywords',
            'read_sql ignores any query longer than 1024 characters',
            'Interpolating input into SQL is an injection hole, and it also mangles quotes and date formatting',
          ], 3, 'The driver quotes and types each parameter correctly, which is both the safe and the less error-prone path.'),
        ]
      ),
        lesson('Parallelism: When More Cores Actually Help', 14, `
"Use all eight cores" is the last optimisation to try, not the first. It multiplies memory use, complicates debugging, and often runs slower than the single-threaded version it replaced. Profile first, vectorise second, push work into DuckDB or Polars third — those two are already multithreaded — and only then reach for workers.

### The GIL decides which tool works

One Python process runs one line of Python bytecode at a time. That single fact explains the whole table:

| Work | Threads help? | Processes help? |
|---|---|---|
| Pure Python (\`apply\`, string munging) | no — the GIL serialises it | yes |
| NumPy and pandas kernels | yes — they release the GIL | yes, but you pay to copy the data |
| Reading files or HTTP requests | yes — waiting is not holding the GIL | yes, unnecessarily |

So a \`ThreadPoolExecutor\` around a \`df.apply\` gives you the same runtime plus overhead, while the same pool around 200 API calls or 200 parquet reads is a real win.

### Processes with joblib

\`\`\`py
from joblib import Parallel, delayed

def summarise(part):
    return part.groupby('sku', observed=True)['revenue'].sum()

parts = [g for _, g in df.groupby('region', observed=True)]
results = Parallel(n_jobs=4)(delayed(summarise)(p) for p in parts)
out = pd.concat(results).groupby(level=0).sum()
\`\`\`

Two rules make this pay. **Send small, return small**: every argument is pickled, shipped to the worker, and unpickled, so handing a 2 GB frame to eight workers costs 16 GB and several seconds before any work starts. Split the data into the pieces each worker needs and return an aggregate, never the rows. And **make each task big enough**: hundreds of millisecond-sized tasks spend all their time on dispatch.

If you write processes by hand, guard the entry point:

\`\`\`py
if __name__ == '__main__':
    with ProcessPoolExecutor(max_workers=4) as ex:
        results = list(ex.map(summarise, parts))
\`\`\`

macOS and Windows spawn a fresh interpreter that re-imports your module. Without the guard, that import starts the pool again, and again — a fork bomb from a missing two-line \`if\`.

### Oversubscription, the reason parallel code gets slower

NumPy's linear algebra already uses every core through its BLAS library. Start eight worker processes and each opens its own eight BLAS threads: 64 threads fighting over 8 cores, thrashing caches.

\`\`\`bash
export OMP_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1
\`\`\`

Pin the inner library to one thread and let your pool own the parallelism, or the other way round — never both.

### When the loop cannot be vectorised

Some algorithms are genuinely sequential per row: a running state machine, a bespoke recurrence, a simulation step. Numba compiles those.

\`\`\`py
from numba import njit

@njit(cache=True)
def drawdown(values):
    peak = values[0]
    worst = 0.0
    for i in range(values.size):
        if values[i] > peak:
            peak = values[i]
        d = (values[i] - peak) / peak
        if d < worst:
            worst = d
    return worst

drawdown(df.equity.to_numpy())      # pass arrays, not Series
\`\`\`

Numba compiles on the first call — that call is slow, later ones are not — and it only accelerates numeric code on NumPy arrays. Hand it an object column or a pandas Series and it falls back to something no faster than Python.

### Decide with a stopwatch, not a feeling

\`\`\`py
t = time.perf_counter(); single(df); t1 = time.perf_counter() - t
t = time.perf_counter(); parallel(df, n_jobs=4); t2 = time.perf_counter() - t
print(round(t1 / t2, 2), 'x speedup')
\`\`\`

Four cores never give four times the speed: startup, pickling, and the serial part of the job cap it. If a job takes 90 seconds and 60 of those are reading the file, the best possible parallel result is 60 plus a bit — and that is the moment to go back and fix the read instead.
        `,
        [
          q('You wrap a slow df.apply in a ThreadPoolExecutor and nothing gets faster. Why?', [
            'apply is not thread-safe, so the pool serialises it',
            'The GIL lets only one thread execute Python bytecode at a time, so pure-Python work does not overlap',
            'Threads cannot access a DataFrame defined outside them',
            'The pool needs a chunksize argument to split the frame',
          ], 1, 'Threads only pay off for work that waits (IO) or that releases the GIL (compiled NumPy kernels); pure Python is serialised.'),
          q('You pass a 2 GB DataFrame to each of eight joblib workers and the job gets slower and runs out of memory. What is the fix?', [
            'Raise n_jobs so each worker handles less data',
            'Switch the pool from processes to threads',
            'Send each worker only the partition it needs and return an aggregate rather than rows',
            'Convert the frame to a list of dicts before sending it',
          ], 2, 'Every argument is pickled and copied into the worker, so parallel code must minimise what crosses the process boundary.'),
          q('Eight worker processes each start eight BLAS threads on an 8-core machine. What is the effect and the fix?', [
            'The machine schedules them efficiently; no action needed',
            'Memory use grows but speed is unaffected',
            'The BLAS threads are ignored inside worker processes',
            'Sixty-four threads contend for eight cores and everything slows down; set OMP_NUM_THREADS=1 so only one layer parallelises',
          ], 3, 'Oversubscription is the usual reason a parallel version runs slower than the serial one, and pinning the inner library to a single thread resolves it.'),
        ]
      ),
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
        `,
        [
          q('Why anchor paths with ROOT = Path(__file__).resolve().parents[2] instead of writing "../data/sales.csv"?', [
            'Relative paths are slower to resolve on network drives',
            'A relative path is resolved against the working directory, which differs between a notebook, pytest, and cron',
            'pandas cannot read relative paths at all',
            'Path objects are required by read_csv',
          ], 1, 'Anchoring to the file makes the location independent of where the process was launched, which is the usual reason a job that worked all week fails on its first scheduled run.'),
          q('What is the rule for the data/raw directory?', [
            'It holds the largest files, which should be compressed',
            'It is regenerated at the start of every run',
            'It is immutable and never written by your code, so a failed run can be reproduced from the exact input bytes',
            'It is the only directory that should be committed to git',
          ], 2, 'Everything in data/processed can be deleted and rebuilt; raw cannot, which is what makes debugging a bad run possible at all.'),
          q('You committed a database password, then deleted it in the next commit. Is the problem solved?', [
            'Yes, once the branch is merged and the old commit is unreachable',
            'Yes, provided the repository is private',
            'Only if you also delete the file from the working tree',
            'No — the value is still in the git history, so the credential has to be rotated',
          ], 3, 'History keeps every version of every file, so the only real remediation is changing the secret and reading it from the environment instead.'),
        ]
      ),
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
        `,
        [
          q('Why split read_csv, the transformation, and to_csv into separate functions?', [
            'It reduces peak memory during the run',
            'The transformation becomes a pure frame-in, frame-out function you can test without touching the disk',
            'pytest cannot call functions that return None',
            'It lets pandas cache the intermediate result',
          ], 1, 'Tests need to call the logic with a hand-built frame; anything that reads or writes files inside itself has to be mocked or given real data.'),
          q('assert_frame_equal fails with "DataFrame.index are different" after a filtering step. What is the usual fix?', [
            'Pass check_index_type=False',
            'Sort both frames by their first column',
            'Call reset_index(drop=True) on the filtered result, since it kept the original labels',
            'Rebuild the expected frame from a dict',
          ], 2, 'Filtering preserves the original index, so the values match while the labels do not — unlike a dtype mismatch, this one really is test noise.'),
          q('What does test_clean_is_idempotent, asserting clean(clean(df)) equals clean(df), actually protect you against?', [
            'A cleaning step that keeps changing the data on every run, such as one that strips or renames repeatedly',
            'Missing values appearing in new input files',
            'A slow cleaning function',
            'Column ordering changing between pandas versions',
          ], 0, 'Idempotence means running the pipeline twice is safe, which is exactly the property a retry or a re-run of a notebook depends on.'),
        ]
      ),
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
        `,
        [
          q('Your input contract fails on missing columns but passes when an upstream team adds a new one. Why is that the right design?', [
            'Extra columns are always dropped by pandas anyway',
            'A stricter check would be too slow to run at the boundary',
            'Extra columns cannot change a dtype',
            'Your code only depends on the columns it names, so failing on additions would wake you at midnight for a harmless change',
          ], 3, 'A contract should fail on what actually breaks you, otherwise people start disabling it.'),
          q('What is the point of logging rows and columns after every .pipe step?', [
            'It forces pandas to materialise each intermediate frame',
            'When the output is wrong you can see which step lost or multiplied the rows, before opening any code',
            'It replaces the need for a validation contract',
            'It measures the runtime of each stage',
          ], 1, 'The staged counts turn "the number is wrong" into "dedupe dropped 40% of the rows", which is most of the diagnosis.'),
          q('Why write to a temporary file and then call tmp.replace(out)?', [
            'The rename is atomic, so a reader never sees a half-written file and a crash leaves the previous version intact',
            'It compresses the file during the move',
            'It is the only way to write parquet partitions',
            'It avoids holding the whole frame in memory',
          ], 0, 'An atomic rename makes the write either fully visible or not visible at all, which is what makes a retried job safe for downstream readers.'),
        ]
      ),
        lesson('Notebooks in Git, Linting, and CI', 13, `
The tests from the previous lesson only protect you if they run on every change, and the repository only helps if a diff is readable. Both of those are about plumbing rather than analysis, and both take an afternoon once.

### A notebook is a JSON file, and git hates it

Change one character in one cell and the diff shows a new \`execution_count\`, a re-serialised base64 PNG, and a scrambled cell id. Reviewers stop reading, and two people editing the same notebook get a merge conflict inside a base64 blob that cannot be resolved by hand.

\`\`\`bash
pip install nbstripout jupytext
nbstripout --install          # a git filter: outputs are stripped on commit
jupytext --set-formats ipynb,py:percent notebooks/explore.ipynb
\`\`\`

\`nbstripout\` removes outputs and execution counts as the file is staged, so the committed notebook is code plus markdown. \`jupytext\` goes further and pairs each notebook with a plain \`.py\` file that git can diff line by line and a reviewer can comment on. Whichever you pick, the rule from the layout lesson still governs: real logic lives in \`src/\`, and the notebook imports it.

Data does not belong in git either. A \`.gitignore\` with \`data/\`, \`.env\`, \`*.parquet\`, and \`.ipynb_checkpoints/\` prevents the accidental 400 MB commit that no one can remove without rewriting history. Large inputs belong in object storage or DVC, with a small pointer file and a checksum committed instead.

### Format and lint automatically

\`\`\`toml
# pyproject.toml
[tool.ruff]
line-length = 100
[tool.ruff.lint]
select = ['E', 'F', 'I', 'B']    # errors, pyflakes, import order, common bugs
\`\`\`

\`ruff\` formats and lints in one fast tool. On analysis code its highest-value rule is \`F401\`/\`F821\` — an unused import or, far more usefully, a name used before it was defined, which is the classic bug from a notebook whose cells only worked in the order you happened to run them.

\`\`\`yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.9
    hooks: [{id: ruff, args: [--fix]}, {id: ruff-format}]
  - repo: https://github.com/kynan/nbstripout
    rev: 0.7.1
    hooks: [{id: nbstripout}]
\`\`\`

\`pre-commit install\` wires those into the commit hook, so formatting arguments stop happening in review.

### CI runs the tests you would forget to run

\`\`\`yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.lock
      - run: pip install -e . --no-deps
      - run: ruff check .
      - run: pytest -q
      - run: python -m salesreport.report --month 2024-01 --input tests/sample
\`\`\`

Install from the **lockfile**, not from a loose \`pandas\` requirement — otherwise CI is testing a different environment from the one you pinned, which defeats the point. The last line is the one analysts skip and the one that catches the most: run the whole pipeline end to end on the committed sample. Together with the regression test that asserts the headline total, a pull request that quietly changes a number now fails, and someone has to explain the change in the description.

Two habits make that pleasant rather than annoying. Keep the sample tiny so the whole job finishes in under two minutes; a slow pipeline gets bypassed. And print the headline figures into the job log, so a reviewer can read what the code produced without checking anything out.

### Pin below Python too

\`\`\`dockerfile
FROM python:3.11-slim
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock
\`\`\`

The lockfile pins your packages; the image pins the interpreter and the system libraries underneath them. That is the difference between "it works on my machine" and "it works on the machine we agreed on", and it is what the scheduler will run at 3 a.m.
        `,
        [
          q('Why do committed .ipynb files produce diffs nobody can review?', [
            'Git treats them as binary files',
            'They are JSON containing outputs, execution counts, and embedded images, so a one-character edit rewrites large blocks',
            'Jupyter re-encrypts the file on each save',
            'They are always larger than git can diff efficiently',
          ], 1, 'Stripping outputs with nbstripout, or pairing the notebook to a .py file with jupytext, restores a diff a human can read.'),
          q('Your CI job installs with "pip install pandas numpy" while the project ships a requirements.lock. What is wrong?', [
            'The install will fail because the packages are already present',
            'CI cannot install packages that are not in pyproject.toml',
            'Nothing, as long as the tests pass',
            'CI is then testing a different set of versions from the one you pinned, so it cannot catch a version-related break',
          ], 3, 'The lockfile exists to make every environment identical; installing loosely in CI reintroduces exactly the drift you pinned away.'),
          q('Which CI step most reliably catches a change that silently alters the headline number?', [
            'ruff check on the changed files',
            'Running the full pipeline on the committed sample and asserting the known total',
            'A test that imports every module',
            'Verifying that the notebook outputs were stripped',
          ], 1, 'Linting finds style and undefined names; only running the pipeline end to end compares the number the code produces against the number you agreed on.'),
        ]
      ),
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
      chapter(
      'Time Series and Forecasts You Can Defend',
      'Time zone and calendar bugs, resampling onto a regular grid, seasonality and autocorrelation, and forecasts judged by rolling origin rather than one lucky split.',
      [
      lesson('Timestamps, Time Zones, and the Calendar Bugs Underneath', 13, `
A daily revenue report ran clean for eight months, then showed Sunday 2024-03-10 down 4.1% against every neighbouring Sunday. Nothing had happened to the business. That day had 23 hours in it, because clocks in New York jumped from 01:59 straight to 03:00, and the job bucketed orders by local calendar day.

A pandas \`Timestamp\` is an integer count of nanoseconds since 1970-01-01 UTC, plus an optional time zone. That optional part splits every datetime column into two species that refuse to mix.

### Naive and aware never meet

\`\`\`py
import pandas as pd

naive = pd.to_datetime('2024-03-10 01:30')             # a wall clock reading
aware = pd.to_datetime('2024-03-10 01:30', utc=True)   # an actual instant

naive < aware      # TypeError: cannot compare tz-naive and tz-aware timestamps
\`\`\`

Three operations move between the two, and they are not interchangeable.

| Call | Input | What it does |
| --- | --- | --- |
| \`tz_localize('America/New_York')\` | naive | Declares which zone the wall clock was read in |
| \`tz_convert('Europe/London')\` | aware | Re-expresses the same instant elsewhere |
| \`tz_localize(None)\` | aware | Throws the zone away and keeps the local reading |

Calling \`tz_convert\` on naive data raises, and \`tz_localize\` on aware data raises too. People react by sprinkling \`tz_localize(None)\` around until the errors stop, which reinterprets UTC stamps as local ones and shifts an entire column by five hours with no warning at all.

### Daylight saving is not a display detail

Localising a naive column across a DST boundary is where the exceptions arrive.

\`\`\`py
s = pd.Series(pd.to_datetime(['2024-03-10 02:30', '2024-11-03 01:30']))

s.dt.tz_localize('America/New_York')
# NonExistentTimeError: 2024-03-10 02:30:00
\`\`\`

02:30 on 10 March never existed in New York, and 01:30 on 3 November happened twice. Pandas refuses to guess.

\`\`\`py
s.dt.tz_localize('America/New_York',
                 nonexistent='shift_forward',   # or 'NaT'
                 ambiguous=False)               # False picks the second, standard-time pass
\`\`\`

Pick those arguments deliberately and leave a comment saying why. \`ambiguous='NaT'\` is the honest choice when you genuinely cannot tell which pass an event belongs to, because it makes the loss countable instead of invisible.

The working rule: store and join in UTC, convert to a local zone only at the last step, when a human needs a calendar day.

\`\`\`py
orders['ordered_at'] = pd.to_datetime(orders.ordered_at, utc=True)
local = orders.ordered_at.dt.tz_convert('America/New_York')
orders['sale_day'] = local.dt.date          # local calendar day, for the report only
\`\`\`

### Parsing traps

\`\`\`py
pd.to_datetime(1712345678, unit='s')    # 2024-04-05 18:14:38
pd.to_datetime(1712345678, unit='ms')   # 1970-01-20 ... a ms column read as seconds
\`\`\`

An epoch column parsed with the wrong unit does not error, it lands in January 1970. If every row in a date column sits near the epoch, check the unit before you go and interrogate the source system.

Two more that bite:

- \`pd.to_datetime('03/04/2024')\` is 4 March under a United States reading and 3 April under most European ones. Pass \`format='%d/%m/%Y'\` rather than trusting inference, and pair \`errors='coerce'\` with a count of the resulting NaT rows so a silent format change shows up as a number in the log.
- \`datetime64[ns]\` only spans roughly 1677 to 2262, so a nanosecond column cannot hold a bond maturing in 2300. Pandas 2 added second, millisecond and microsecond resolutions for exactly that, and \`series.dt.unit\` tells you which one you are actually holding.

Finally, \`.dt\` accessors read the local wall clock of an aware series, so \`dt.hour\` on a UTC column tells you nothing about when people in Chicago actually shopped. Convert first, extract second. A traffic peak at "14:00" that is really 09:00 local has misled more than one staffing decision.
      `,
        [
          q('A UTC timestamp column is passed through tz_localize(None) so a comparison stops raising. What has that done to the data?', [
            'Nothing at all, since the instants were already stored in UTC',
            'Each value is converted to the machine\'s local zone first',
            'The UTC wall clock is kept and later read as local time',
            'The column becomes object dtype holding Python datetimes',
          ], 2, 'tz_localize(None) discards the zone and keeps the UTC reading, so any code that then treats the column as local time is off by the whole offset.'),
          q('Localising a naive New York column raises AmbiguousTimeError on 2024-11-03 01:30. Why does that instant need a decision from you?', [
            'Clocks fell back, so 01:30 local happened twice and maps to two UTC instants',
            'Clocks sprang forward, so 01:30 local never happened on that date',
            'The value falls outside the range datetime64[ns] can represent',
            'New York changed its standard offset from UTC during that year',
          ], 0, 'At the autumn transition the local hour repeats, so a single wall clock reading corresponds to two different real instants and pandas will not pick one for you.'),
          q('An epoch column parses without any error, but every row lands in January 1970. What is the most likely cause?', [
            'The source system wrote the values as strings rather than integers',
            'The timestamps were tz-aware and pandas discarded the offset',
            'The column overflowed datetime64[ns] and wrapped back around',
            'Millisecond epochs were parsed with unit=\'s\', so each value is a thousand times too small',
          ], 3, 'Reading milliseconds as seconds divides every instant by a thousand, which puts 2024 stamps a few weeks after the epoch rather than raising an error.'),
        ]
      ),
      lesson('Resampling, Gaps, and Aligning Series That Do Not Line Up', 13, `
A demand model trained on daily order counts validated well and then under-ordered stock every Monday. The cause was four failed ingestion runs. \`resample('D').sum()\` turned each missing day into \`0.0\`, the model learned that some days are dead, and nothing in the pipeline had ever distinguished "no orders" from "no data".

\`resample\` is \`groupby\` on a time grid. Split-apply-combine carries over unchanged, with two extra decisions: where each bin starts, and what an empty bin means.

### Empty bins lie differently depending on the aggregate

\`\`\`py
daily = orders.set_index('ordered_at').resample('D')['revenue']

daily.sum()     # empty day -> 0.0
daily.mean()    # empty day -> NaN
daily.count()   # empty day -> 0
\`\`\`

Aggregate twice and let the count decide.

\`\`\`py
g = (orders.set_index('ordered_at')
           .resample('D')['revenue']
           .agg(['sum', 'count']))

g['revenue'] = g['sum'].where(g['count'] > 0)   # real zero stays 0, no data becomes NaN
\`\`\`

A true zero and a missing observation are different facts. Every imputation, every rolling mean and every model downstream needs to be told which one it is holding.

### Bin edges are a choice, not a default worth trusting

\`\`\`py
s.resample('W').sum()                       # weeks labelled by the Sunday at the RIGHT edge
s.resample('W-MON').sum()                   # weeks ending on Monday
s.resample('h', closed='left', label='left').sum()
\`\`\`

For most frequencies pandas closes each bin on the left and labels it with its left edge. The weekly, month-end and quarter-end aliases close and label on the right instead. That inconsistency is why your weekly chart can sit one bucket away from a colleague's chart of the same data. Put the convention in the axis label.

\`asfreq\` is the other half of the pair. It snaps an index onto a regular grid without aggregating, which is what you want when there is already at most one observation per period.

\`\`\`py
monthly.asfreq('MS')                 # missing months appear as NaN rows
monthly.asfreq('MS', method='ffill')
\`\`\`

### Expose the gaps before you fill them

\`\`\`py
full = pd.date_range(daily.index.min(), daily.index.max(), freq='D')
daily = daily.reindex(full)
daily.isna().sum()                   # 4 ... the gaps are now countable
\`\`\`

Then pick a fill you can defend. \`ffill()\` across a two week outage invents two weeks of flat data that a rolling mean will smooth into a convincing trend, so cap it: \`ffill(limit=2)\`. For a numeric series on an irregular index, \`interpolate(method='time')\` respects the actual spacing, while a plain \`interpolate()\` assumes rows are evenly spaced and quietly gets it wrong.

### Two series that do not share a clock

Arithmetic in pandas aligns on the index, so adding a 5 minute sessions series to a per-order revenue series yields the union of both indexes and NaN nearly everywhere. The fix is not \`reset_index\`. It is either resampling both onto one shared grid, or an as-of join when each event should be matched to the most recent prior reading.

\`\`\`py
trades = trades.sort_values('ts')
quotes = quotes.sort_values('ts')

matched = pd.merge_asof(trades, quotes,
                        on='ts',
                        by='symbol',             # match within a symbol only
                        direction='backward',    # last quote at or before the trade
                        tolerance=pd.Timedelta('2s'))
\`\`\`

\`merge_asof\` requires both frames sorted by the join key and raises if they are not, which is the one place pandas actively protects you. What it will not protect you from is \`direction='nearest'\`, which cheerfully attaches a quote from after the trade and leaks the future into a feature. Backward is the default for a reason.

\`tolerance\` is what stops a stale reading being treated as current. Without it, a sensor that dropped offline overnight matches every morning row to its last gasp at 23:04, and the resulting column looks perfectly populated.
      `,
        [
          q('An ingestion job missed three days. After resample(\'D\').sum(), how do those days appear and why is that dangerous?', [
            'As NaN, which most models drop, so the rows vanish from training',
            'As 0.0, which is indistinguishable from a genuine day of no orders',
            'As the previous day\'s value, because sum carries the last bin forward',
            'They are absent entirely, so the index simply skips those dates',
          ], 1, 'Summing an empty bin returns 0.0 rather than NaN, so a pipeline outage becomes a plausible looking business fact that models and charts both believe.'),
          q('Why aggregate with agg([\'sum\', \'count\']) on a daily resample instead of taking sum on its own?', [
            'The count is needed to compute a mean, which sum cannot provide',
            'Sum overflows on large revenue columns unless a count normalises it',
            'The count forces pandas to keep the DatetimeIndex properly sorted',
            'Count is zero only for empty bins, which separates a real zero from missing data',
          ], 3, 'The count is the only signal that tells you whether a bin held rows at all, so it lets you null out the days with no data while leaving genuine zeros intact.'),
          q('A sensor was offline for nine hours. merge_asof with direction=\'backward\' and no tolerance attaches readings to hourly rows. What happens?', [
            'Every hour of the outage is matched to the last reading before it died',
            'Rows falling inside the outage are dropped from the result entirely',
            'merge_asof raises, because the gap exceeds its default tolerance',
            'Each outage hour is matched to the first reading after recovery',
          ], 0, 'A backward as-of join always reaches for the most recent prior row, so without a tolerance one stale reading is repeated across the entire outage and looks like live data.'),
        ]
      ),
      lesson('Trend, Seasonality, and Autocorrelation', 13, `
A weekly dashboard showed orders down 11.6% and triggered a two day investigation. The week contained a public holiday. The year-earlier comparison week contained one too, a week later in the calendar, so that check was wrong as well. Nobody had decomposed the series, so nobody could say how much of the drop was calendar and how much was real.

Every business series is a sum of parts: a slow trend, a repeating seasonal shape, and whatever is left over. Separating them is what turns "is this lower" into "is this unusual".

### Decomposition, additive versus multiplicative

\`\`\`py
from statsmodels.tsa.seasonal import STL

daily = orders.set_index('day')['orders'].asfreq('D').interpolate(limit=2)

res = STL(daily, period=7, robust=True).fit()
res.trend, res.seasonal, res.resid
\`\`\`

\`period\` is the number of observations in one cycle: 7 for daily data with a weekly rhythm, 12 for monthly data, and both 24 and 168 for hourly data that has a daily shape and a weekend shape. Set it wrong and the seasonal component quietly absorbs part of the trend.

Additive assumes the seasonal swing is a fixed number of orders. Multiplicative assumes it is a fixed percentage. Plot the raw series: if the peaks fan out as the level rises, the swing is proportional, and the clean fix is to decompose \`np.log(y)\` additively and exponentiate at the end. \`robust=True\` stops one Black Friday spike from bending the seasonal shape for the entire year.

\`seasonal_decompose\` is the simpler alternative, but its trend is a centred moving average, so it goes NaN at both ends of the series and takes the most recent weeks with it. STL is the better default.

### Autocorrelation, and the trap inside it

Autocorrelation is the correlation of a series with itself shifted by \`k\` periods.

\`\`\`py
from statsmodels.tsa.stattools import acf

acf(daily, nlags=14).round(2)
# [1.00, 0.62, 0.41, 0.35, 0.38, 0.47, 0.83, 0.61, ...]
\`\`\`

| Lag | Value | Reading |
| --- | --- | --- |
| 1 | 0.62 | Yesterday carries into today |
| 6 | 0.47 | Nothing special here |
| 7 | 0.83 | A strong weekly cycle |
| 14 | 0.71 | The same cycle, one week further out |

Here is the counter-intuitive part. A series with any trend at all shows high autocorrelation at every single lag, because both points sit on the same slope. That tells you the series trends. It tells you nothing about structure. Difference first, then read the plot:

\`\`\`py
acf(daily.diff().dropna(), nlags=14)
\`\`\`

The same trap produces the classic spurious correlation. Two unrelated series that both grow through the year will correlate at 0.9 or better without sharing a single cause. Correlate the differences, or the residuals left after removing trend and seasonality, and the relationship usually evaporates. That is Chapter 5's confounding with a clock attached.

The partial autocorrelation, \`pacf\`, strips out the indirect path. Lag 2 looks large in the ACF largely because lag 1 is large and lag 1 feeds into lag 2. PACF at lag 2 asks what lag 2 adds once lag 1 has been accounted for, which is why it is the function you read when choosing how many lags a model needs.

### Calendar effects come before modelling

\`\`\`py
monthly['per_day'] = monthly.revenue / monthly.index.days_in_month
\`\`\`

February to March is a 10% jump in available days before anything happens in the market. Normalise by days in month, or by trading days, or count how many of each weekday fall in the period. Holidays need an explicit flag column, and moving ones such as Easter and Ramadan will never be captured by a fixed weekly or monthly period.

The order that works: plot the raw series, decompose it, then look at the residual. If the residual still has visible shape, your period is wrong or a calendar effect is missing.
      `,
        [
          q('The ACF of a strongly trending daily series sits above 0.9 at every lag out to 30. What should you conclude?', [
            'There is a 30 day seasonal cycle that is worth modelling',
            'The series is stationary and ready for a lag based model',
            'Measurements are being duplicated across consecutive days',
            'Mostly that it trends, so difference it before reading the ACF',
          ], 3, 'Two points on a common slope correlate regardless of any real structure, so a trend inflates every lag and the ACF only becomes informative after differencing.'),
          q('Hourly traffic has a daily shape and a separate weekend shape. What does that mean for STL\'s period argument?', [
            'period=24 alone captures both, since the weekly shape repeats daily',
            'There are two cycles, 24 and 168 hours, so one period cannot hold both',
            'period=7 is correct, because seasonality is always counted in days',
            'period=12 is the standard setting for any sub-daily series',
          ], 1, 'A single STL fit models one seasonal period, so data with both a daily and a weekly rhythm needs the second cycle handled separately or through a multi-seasonal method.'),
          q('March revenue comes in 9% above February. Before calling that growth, what should you check first?', [
            'Whether both months used the same currency conversion rate',
            'Whether the ACF at lag 1 sits above the confidence band',
            'Whether March simply contains three more days than February',
            'Whether the decomposition was additive rather than multiplicative',
          ], 2, 'February is 28 days and March is 31, so roughly a tenth of that jump is calendar length and comparisons should be made per day or per trading day.'),
        ]
      ),
      lesson('Baselines, Backtesting, and Forecasts That Do Not Cheat', 14, `
A team presented a gradient boosted forecaster with a MAPE of 4.2% and asked for headcount to maintain it. Someone else ran "the value from the same weekday last week" over the identical evaluation weeks. It scored 3.8%. The project was cancelled that afternoon, correctly.

A forecast number means nothing alone. It means something next to a baseline, measured over many origins, at the horizon you actually deploy.

### Baselines that are hard to beat

\`\`\`py
y = daily['orders']

naive          = y.shift(1)    # last value
seasonal_naive = y.shift(7)    # same weekday last week
drift          = y.shift(1) + (y.iloc[-1] - y.iloc[0]) / (len(y) - 1)
\`\`\`

Seasonal naive is brutal on retail, staffing and traffic data because it carries the weekly shape for free. Put its score in the same table as the model, every time. If the model wins by less than the spread across your backtest folds, it has not won.

### The split that invalidates everything

\`\`\`py
# broken
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)   # shuffle=True by default
\`\`\`

Random shuffling puts next Tuesday in training and last Tuesday in test. The scores come back implausibly good, because interpolating between two known neighbours is easy and forecasting is not. The correct shape is a rolling origin: fit on everything up to a cut-off, predict forward, move the cut-off, repeat.

\`\`\`py
from sklearn.model_selection import TimeSeriesSplit
import numpy as np

errs = []
for tr, te in TimeSeriesSplit(n_splits=8, test_size=14, gap=0).split(y):
    model.fit(X.iloc[tr], y.iloc[tr])
    pred = model.predict(X.iloc[te])
    errs.append(np.abs(y.iloc[te].values - pred).mean())

np.mean(errs), np.std(errs)     # the spread matters as much as the mean
\`\`\`

Eight folds give eight numbers. One number from one split is a coin toss dressed up as evidence.

Two details decide whether a backtest is honest. **Horizon**: scoring one step ahead while shipping a 14 day plan flatters the model enormously, because error compounds with distance, so evaluate at the horizon you will actually deploy. **Gap**: if a feature takes three days to land in the warehouse, set \`gap=3\` so a fold cannot use data the model will not have at prediction time.

Anything fitted before the split leaks. A scaler fitted on the whole series, a target encoding computed over all rows, a centred rolling mean: refit each of them inside every fold.

### Choose the metric on purpose

| Metric | Behaviour | Use when |
| --- | --- | --- |
| MAE | Tracks the median, robust to spikes | Errors cost the same either way |
| RMSE | Squares, so large misses dominate | One big miss beats several small ones in cost |
| MAPE | Blows up near zero, punishes over-forecasting harder | Rarely, and never on intermittent demand |
| MASE | MAE divided by the naive baseline's MAE | Comparing across series of different scales |

MAPE is the default in most decks and the worst choice on sparse data. A day with 2 actual orders and 4 predicted contributes 100%, while a day with 200 actual and 202 predicted contributes 1%. On intermittent demand the smallest days dominate the score. MASE below 1 says you beat the naive model, which is exactly the sentence a stakeholder needs.

### A point forecast is not a decision

Stock levels, staffing and cash all need a range. Produce one, then check it against the backtest instead of trusting it.

\`\`\`py
inside = ((y_true >= lower) & (y_true <= upper)).mean()
# 0.46 for an interval sold as 80%
\`\`\`

Coverage of 46% on an 80% interval means the model is confident and wrong, usually because the residuals are autocorrelated and the closed-form band assumed they were independent. Widen it empirically from backtest residuals. A defensible forecast is one where you can say: here is the number, here is the range it lands in nearly always, and here is what beating the baseline was worth across eight rolling origins.
      `,
        [
          q('A forecaster is validated with train_test_split at its default settings and reports R squared of 0.97. Why is that number meaningless?', [
            'Shuffling puts later dates in training, so the model interpolates between known neighbours',
            'R squared cannot be computed on time indexed data at all',
            'A default test size of 0.25 is far too small to estimate error',
            'train_test_split drops the DatetimeIndex, so predictions misalign',
          ], 0, 'The default shuffle scatters future rows into the training set, so the model fills gaps between points it has already seen instead of forecasting past the edge of the data.'),
          q('Your model scores MAPE 4.2% and seasonal naive scores 3.8% across the same folds. What follows?', [
            'The model is fine, since both scores sit under the 5% threshold',
            'MAPE is unsuitable here, so no comparison can be made at all',
            'The model adds nothing, since a one line rule forecasts better',
            'The model needs more folds before this comparison can be trusted',
          ], 2, 'A baseline that beats the model on the same evaluation windows means the extra complexity buys negative value, so shipping and maintaining it cannot be justified.'),
          q('An 80% prediction interval contains the actual value in only 46% of backtest points. What is the most likely cause?', [
            'The point forecasts are biased high, which narrows the interval',
            'Residuals are autocorrelated, so the interval was built too narrow',
            'The backtest used too few folds to estimate coverage reliably',
            'MASE was the metric, which is incompatible with interval estimates',
          ], 1, 'Closed-form intervals assume independent residuals, and time series errors cluster, so the effective sample size is smaller than assumed and the band comes out too tight.'),
        ]
      ),
      ],
      [
      q('Orders are stored with UTC timestamps and a report groups by dt.date without converting first. What is wrong?', [
        'dt.date fails on tz-aware series and returns NaT for every row',
        'The day boundary drifts by one nanosecond per row over time',
        'UTC has no daylight saving, so the totals cannot be compared',
        'Days are cut at UTC midnight, so evening sales land on the next day',
      ], 3, 'Grouping on UTC dates splits the local day in the wrong place, which moves late evening orders into tomorrow\'s total for any zone behind UTC.'),
      q('Which approach correctly turns an irregular event log into a defensible daily series?', [
        'resample(\'D\').sum(), then ffill any NaN values that remain',
        'resample(\'D\').agg([\'sum\', \'count\']), then null bins where count is zero',
        'groupby(dt.date).sum(), then sort the index before plotting it',
        'asfreq(\'D\'), then interpolate every gap with method=\'linear\'',
      ], 1, 'Only the count distinguishes a day with genuinely no activity from a day the pipeline never delivered, and that distinction has to survive into the modelling data.'),
      q('Two product lines both grew steadily all year and correlate at 0.94. What is the responsible next step?', [
        'Correlate the differenced series, since a shared trend inflates the raw figure',
        'Report the 0.94 alongside a confidence interval and the sample size',
        'Fit a regression of one on the other to confirm the direction',
        'Extend the window to two years so the estimate stabilises',
      ], 0, 'Any two rising series correlate highly whether or not they are related, so the trend has to be removed before the correlation carries information.'),
      q('A feature takes two days to arrive in the warehouse. How should a rolling origin backtest reflect that?', [
        'Drop the feature, since delayed data can never be used in a forecast',
        'Shift the target forward two days and keep the folds contiguous',
        'Set a gap of two days between each training fold and its test window',
        'Refit the model twice per fold, once with the feature and once without',
      ], 2, 'A gap keeps the fold from training on rows that would not yet exist at prediction time, so the backtest reproduces the information the model will really have.'),
      ]
    ),
    chapter(
      'Feature Engineering and the Leakage Trap',
      'Designing the holdout before you touch anything, encoding and scaling inside a pipeline that only ever fits on training rows, and the leakage that makes a mediocre model look brilliant.',
      [
      lesson('Holdout Design: Random, Grouped, and Time-Based Splits', 13, `
A fraud model scored 0.94 AUC in validation and 0.61 in its first live week. The model was fine. The split was wrong: every merchant contributed roughly 40 transactions, and \`train_test_split\` scattered those rows across both sides, so the model had already seen merchant 8812 when it was asked to score merchant 8812. Production only ever asks about merchants it has never met.

Before any encoder or any estimator, answer one question. At prediction time, what is new about the row?

### Three answers, three splitters

| What is new at prediction time | Split on | Tool |
| --- | --- | --- |
| Another row from an entity you know | Nothing, shuffle freely | \`train_test_split\`, \`KFold\` |
| An entity you have never scored | The entity id | \`GroupKFold\`, \`StratifiedGroupKFold\` |
| A period after everything you hold | The date | \`TimeSeriesSplit\`, a fixed cut off |

Most business problems land in row two or row three. Almost every tutorial demonstrates row one. That mismatch is where inflated scores come from.

### Grouped splits, and the assertion that proves it

\`\`\`py
from sklearn.model_selection import GroupShuffleSplit

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=0)
train_idx, test_idx = next(gss.split(X, y, groups=df['merchant_id']))

tr_m = set(df.iloc[train_idx]['merchant_id'])
te_m = set(df.iloc[test_idx]['merchant_id'])
assert not (tr_m & te_m), f'{len(tr_m & te_m)} merchants on both sides'
\`\`\`

Keep that assertion in the training script. It costs a millisecond and it is the only thing standing between you and a 0.94 that is not real. The group is whatever repeats: customer, patient, device, session, document, or three photographs of the same lesion.

Duplicates are the same bug wearing a different hat. If the extract contains exact duplicate rows, a shuffle puts one copy in train and the other in test, and the model is then graded on rows it memorised. Deduplicate before you split, not after.

### Stratify when the positives are scarce

\`\`\`py
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y)
\`\`\`

With 5,000 rows at a 1.8% positive rate, a 20% test set holds about 18 positives. Without \`stratify\` that count swings between roughly 9 and 30 on the seed alone, and the class rate stops matching reality. Stratify pins the rate. It does not create data: 18 positives still gives an AUC with a very wide interval, so a 0.01 gap between two models is noise you are reading as a result. If the comparison matters, you need a few hundred positives on the test side, or repeated cross validation instead of a single holdout.

### Three sets, and one of them is write once

Split into train, validation and test. Fit on train, choose on validation, touch test once at the end. Every extra look spends a little of its honesty: pick the best of 60 candidates by test score and that score is the maximum of 60 noisy numbers, which is optimistic by construction. Rename it in your head as the selection set the moment you use it twice.

For time based work, add an embargo. If a label takes 30 days to settle, the last 30 days before the cut off cannot be scored yet and belong on neither side. Chapter 8 covered the rolling origin machinery; the point here is that the cut off is a design decision made before a single feature exists, not a knob you turn when the score disappoints.

### Checklist before you fit anything

- Named the group column, or written down why there is none.
- Asserted that no group and no duplicate crosses the boundary.
- Checked the positive count on the test side, not just the percentage.
- Written the cut off date and the reason for it next to the code.
      `,
        [
          q('Every merchant contributes about 40 rows. A random split scores 0.94 AUC, but live scoring on merchants never seen before returns 0.61. What is the fix?', [
            'Raise the test size from 20% to 40% and measure again',
            'Stratify the split on the target so the class rates match',
            'Split on merchant id so no merchant lands on both sides',
            'Shuffle with several random_state values and average them',
          ], 2, 'Production only ever scores unseen merchants, so the holdout has to be grouped by merchant id to reproduce that situation, otherwise the model is graded on entities it already memorised.'),
          q('A 5,000 row dataset has a 1.8% positive rate and two models are compared on a 20% test set. Why is stratify=y still not enough here?', [
            'Stratify applies to regression targets and ignores class labels',
            'It holds the rate steady, but 18 positives make the metric noisy',
            'It alters the class balance of the training rows as a side effect',
            'It requires the two classes to be balanced before it can be used',
          ], 1, 'Stratification keeps the positive rate stable but cannot create positives, and roughly 18 of them leave an AUC with an interval far wider than the difference being measured.'),
          q('You tune 60 candidate models, choosing each time by the score on the same 1,000 row test set. What has happened to that score?', [
            'Nothing, because the test rows were never used to fit a model',
            'It is unbiased as long as each candidate was fitted separately',
            'It stays valid provided all 60 candidates share one feature set',
            'It has become a selection score, so the number is optimistic',
          ], 3, 'Repeatedly picking the winner on the same rows makes the reported figure the maximum of many noisy estimates, which is biased upward and no longer an honest estimate of live performance.'),
        ]
      ),
      lesson('Encoding Categories, Scaling Numbers, and Turning Dates Into Features', 13, `
\`postcode\` had 8,400 distinct values in a 300,000 row delivery table. One hot encoding produced 8,400 columns, ridge fitted happily, and validation improved by 0.02. Half those postcodes appeared fewer than four times, so half those coefficients were fitted to two or three rows of noise. On the next month of data the gain was gone.

Cardinality is the first thing to check on any categorical column, before you choose an encoding at all.

### Categories

| Column | Levels | Sensible encoding |
| --- | --- | --- |
| \`payment_method\` | 6 | One hot |
| \`device_type\` | 4 | One hot |
| \`city\` | 340 | One hot with \`min_frequency\`, or target encoding |
| \`postcode\` | 8,400 | Target encoding out of fold, or a coarser region column |
| \`size\` (S, M, L) | 3 | Ordinal, because the order is real |

\`\`\`py
from sklearn.preprocessing import OneHotEncoder

enc = OneHotEncoder(
    handle_unknown='infrequent_if_exist',
    min_frequency=30,
    sparse_output=True,
)
\`\`\`

\`min_frequency=30\` folds every level seen fewer than 30 times into a single \`infrequent\` column, which is a far better estimate than one coefficient per rare level.

Now the default that bites. \`handle_unknown\` is \`'error'\` unless you change it. The first time an unseen \`payment_method\` such as \`applepay\` reaches the scoring job, the transform raises and the batch dies at 3 a.m. Choose the behaviour deliberately, because it is a product decision: an unknown level either falls into the infrequent bucket or you want the job to stop loudly.

Ordinal encoding of a nominal column is the other classic. Mapping \`country\` to 0 through 190 tells a linear model that Brazil sits halfway between Belgium and Canada. Trees survive it, since they only ever split, but the splits get harder to find. Reach for ordinal only when a real order exists.

Target encoding replaces a level with the mean outcome for that level. It is compact, often strong, and it pipes the label straight into the feature unless the mean is computed out of fold. \`sklearn.preprocessing.TargetEncoder\` does that internal cross fitting for you.

### Numbers

Trees do not care about scale, because a split on \`income > 42000\` is unchanged by any monotone transform. Nearly everything else does care.

| Model | Needs scaling | Why |
| --- | --- | --- |
| Ridge, lasso, penalised logistic | Yes | The penalty is per coefficient, so column scale sets its strength |
| KNN, SVM, k-means | Yes | Distance is dominated by the widest column |
| Neural networks | Yes | Gradients behave badly across mixed magnitudes |
| Random forest, gradient boosting | No | Splits are order based |

\`StandardScaler\` subtracts the mean and divides by the standard deviation, and one extreme row wrecks both. Income with a median of 42,000 and a maximum of 2.4 million leaves 99% of rows squashed into a sliver. \`RobustScaler\` uses the median and the interquartile range instead, and \`np.log1p\` on a skewed positive column often helps more than either.

### Dates

A raw timestamp cast to an integer is the worst option on the table: the model learns that bigger means later, and every future row sits outside the range it was fitted on.

\`\`\`py
ts = df['ordered_at']
df['hour']       = ts.dt.hour
df['dow']        = ts.dt.dayofweek
df['is_weekend'] = ts.dt.dayofweek >= 5
df['days_since_signup'] = (ts - df['signed_up_at']).dt.days
df['hour_sin'] = np.sin(2 * np.pi * ts.dt.hour / 24)
df['hour_cos'] = np.cos(2 * np.pi * ts.dt.hour / 24)
\`\`\`

The sine and cosine pair matters for linear models. As plain integers, 23:00 and 00:00 are 23 apart when they are one hour apart, so the model builds a cliff at midnight that nothing in the world put there. Durations such as \`days_since_signup\` usually beat every calendar field, because they describe the row's own history rather than the position of the earth.
      `,
        [
          q('A new payment_method value appears in production and the nightly scoring job stops with \'Found unknown categories\'. What is the cause?', [
            'OneHotEncoder defaults to handle_unknown=\'error\' on unseen levels',
            'The scaler was fitted on training rows and rejects new values',
            'The pipeline was pickled by an older version of scikit-learn',
            'The column changed dtype from object to category between runs',
          ], 0, 'OneHotEncoder raises on categories it never saw during fit unless handle_unknown is set to something like \'infrequent_if_exist\', so a genuinely new level halts the batch.'),
          q('Hour of day is fed to a linear model as the integer 0 to 23. Why do orders at 23:30 get predictions unlike those at 00:30?', [
            'The column has to be centred and scaled before a linear fit',
            'As integers, hour 23 and hour 0 sit 23 apart, breaking the cycle',
            'Linear models cannot use an integer feature without one-hot',
            'The timestamps are stored in UTC while orders are recorded local',
          ], 1, 'An integer hour treats midnight as maximally distant from 23:00, so a sine and cosine pair is needed to encode that the clock wraps around.'),
          q('Income has a median of 42,000 and a maximum of 2.4 million, and StandardScaler squashes almost every row into a narrow band. Which fix addresses that?', [
            'Fit the scaler on the test rows too so the mean is more stable',
            'Delete every row above the 99th percentile before fitting it',
            'Use RobustScaler or log1p, since neither is dragged by the tail',
            'One-hot encode income into ten bands and drop the raw column',
          ], 2, 'The median and interquartile range used by RobustScaler, like a log transform, are barely moved by a handful of extreme values, unlike the mean and standard deviation.'),
        ]
      ),
      lesson('Pipelines and ColumnTransformer: Fit on Train Only', 14, `
Here is code that appears in thousands of notebooks and is wrong.

\`\`\`py
scaler = StandardScaler().fit(X)          # every row, train and test
X_all = scaler.transform(X)
X_tr, X_te, y_tr, y_te = train_test_split(X_all, y, test_size=0.2)
\`\`\`

The mean and the standard deviation now carry a trace of the test rows. For a scaler that is worth a fraction of a point, which is why people shrug at it. Swap \`StandardScaler\` for a median imputer, a target encoder or a feature selector and the identical mistake is worth ten points. There is also a second problem with no upside at all: nothing here can score one incoming row, because the transformation lives in a variable that existed once, in a notebook, on Tuesday.

### fit learns parameters, transform applies them

Every transformer is a small model.

| Transformer | What \`fit\` learns | Stored on |
| --- | --- | --- |
| \`StandardScaler\` | Column means and standard deviations | \`mean_\`, \`scale_\` |
| \`SimpleImputer\` | The median or the mode per column | \`statistics_\` |
| \`OneHotEncoder\` | The level list per column | \`categories_\` |
| \`TargetEncoder\` | A mean outcome per level | \`encodings_\` |

\`fit_transform\` on training rows, \`transform\` on everything else, forever. Type \`fit\` on data the model will not have at prediction time and you have made a decision about honesty, whether or not you noticed.

### One object that holds all of it

\`\`\`py
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

num = ['basket_value', 'items', 'days_since_signup']
cat = ['payment_method', 'device_type', 'country']

pre = ColumnTransformer([
    ('num', Pipeline([('impute', SimpleImputer(strategy='median')),
                      ('scale', StandardScaler())]), num),
    ('cat', Pipeline([('impute', SimpleImputer(strategy='most_frequent')),
                      ('onehot', OneHotEncoder(handle_unknown='infrequent_if_exist',
                                               min_frequency=25))]), cat),
])

model = Pipeline([('pre', pre), ('clf', LogisticRegression(max_iter=1000))])
model.fit(X_tr, y_tr)
\`\`\`

\`model\` is now a single estimator with a \`fit\`, a \`predict\` and a pickle. Hand it to \`cross_val_score\` and every step is refitted inside each fold, on that fold's training rows only, which is the entire reason the number it prints can be trusted.

\`\`\`py
from sklearn.model_selection import cross_val_score
cross_val_score(model, X_tr, y_tr, cv=5, scoring='roc_auc').mean()
\`\`\`

Tuning reaches into nested steps with double underscores, so one \`GridSearchCV\` can search \`clf__C\` and \`pre__cat__onehot__min_frequency\` in the same grid, each candidate refitted end to end.

### The defaults that catch people

**\`remainder='drop'\`.** List 9 columns out of 13 and the other 4 vanish without a word. Either pass \`remainder='passthrough'\` on purpose, or assert the count with \`assert len(num) + len(cat) == X.shape[1]\`.

**Column order.** Output columns follow the blocks as declared, not the frame as it arrived. Anything that indexes the result positionally reads the wrong column the day a colleague adds a feature. Use \`pre.get_feature_names_out()\`, or call \`model.set_output(transform='pandas')\` and keep real names all the way through.

**Selecting by dtype.** \`make_column_selector(dtype_include='number')\` is convenient and will cheerfully include \`customer_id\`, and the target too if it is still sitting in the frame.

### Ship the pipeline, not the model

\`\`\`py
import joblib
joblib.dump(model, 'models/checkout_risk_2026_03.joblib')
\`\`\`

One file, one version. The serving code calls \`model.predict_proba(row_df)\` with a frame carrying the same column names, and the scaler, the imputer medians and the category lists all travel with it. A bare estimator plus transforms rewritten by hand in the API is how training and serving drift apart, which is Chapter 11's problem and the most expensive kind to debug.
      `,
        [
          q('A StandardScaler is fitted on all rows and the data is split afterwards. Besides the inflated score, what practical problem remains?', [
            'No fitted artefact exists to apply to one row at serving time',
            'Training rows end up on a different scale from the test rows',
            'The scaler cannot be pickled once it has touched the test rows',
            'Cross validation refuses to run on an already transformed matrix',
          ], 0, 'The transformation lives in a throwaway notebook variable rather than in a shippable object, so the serving path has nothing to reproduce it with.'),
          q('Why does cross_val_score(pipeline, X, y, cv=5) give an honest number when the same steps run by hand often do not?', [
            'It uses stratified folds, which removes any preprocessing bias',
            'It refits every step inside each fold on that fold\'s training rows',
            'It scores the training rows and averages the difference away',
            'It caches the transformers so each fold sees identical statistics',
          ], 1, 'Wrapping preprocessing in the estimator means each fold refits scalers, imputers and encoders on training rows alone, so no fold\'s validation data influences its own transformation.'),
          q('A ColumnTransformer names 6 numeric and 4 categorical columns, but the frame has 13. What happens to the other 3 by default?', [
            'They are appended unchanged after the transformed blocks',
            'The fit raises an error naming the columns that were left out',
            'They are routed through whichever transformer is listed first',
            'They are dropped silently, since remainder defaults to \'drop\'',
          ], 3, 'The remainder parameter defaults to \'drop\', so any column not listed in a block disappears from the output with no warning at all.'),
        ]
      ),
      lesson('Hunting Leakage: Target, Temporal, and Group', 14, `
A churn model came back at 0.991 AUC. Its top feature by a distance was \`days_since_last_login\`, computed as of the export date. For an account that had already churned, that number is enormous by construction, because closed accounts do not log in. The model had learned that cancelled accounts cancel.

Leakage is any information in a feature that would not exist at the moment the model has to fire. It never raises an exception. It produces a beautiful score and a disappointing product.

### Three families

| Family | What happens | Tell |
| --- | --- | --- |
| Target | A feature is a consequence or a restatement of the label | \`refund_amount\` in a refund model |
| Temporal | A feature is computed from data recorded after the event | Values updated in place, no \`as_of\` column |
| Group | The same entity sits on both sides of the split | Score collapses on new customers only |

Target leakage is usually subtle rather than blatant. \`support_tickets_last_30d\` sounds innocent until you learn the pipeline counted the 30 days before the export rather than the 30 days before the prediction date, so it quietly includes the angry tickets a customer filed while cancelling.

### Find it before your users do

\`\`\`py
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

for col in X.columns:
    auc = cross_val_score(DecisionTreeClassifier(max_depth=3, random_state=0),
                          X[[col]].fillna(-1), y, cv=5, scoring='roc_auc').mean()
    if auc > 0.80:
        print(f'{col:35s} {auc:.3f}')
\`\`\`

Any single column that reaches 0.90 alone is a suspect until proven otherwise. Real signal is normally spread thin, twenty columns each worth a little. One column that already answers the question usually means somebody wrote the question into it.

The other checks are cheap. Sort permutation importance, read the top five names aloud, and ask when each value gets written. Then compare the offline score against the first week of live scoring: a gap of more than a couple of points is leakage or drift, and leakage is the better bet.

### Point in time correctness

For every feature, two questions. At the moment the model fires, was this value already written? And was it this value, rather than a later revision?

The second question kills more projects than the first, because warehouses overwrite. An \`account_status\` column that reads \`churned\` today read \`active\` on the day you are pretending to predict. If the table keeps no history, you cannot build a truthful feature from it, and the honest move is to say so rather than build it anyway.

Where you do have timestamps, \`merge_asof\` is the tool.

\`\`\`py
feat = pd.merge_asof(
    events.sort_values('event_at'),
    balances.sort_values('recorded_at'),
    left_on='event_at', right_on='recorded_at',
    by='account_id',
    direction='backward',
    tolerance=pd.Timedelta('7D'),
)
\`\`\`

\`direction='backward'\` attaches the most recent balance recorded at or before the event. Change it to \`'forward'\` and you have built a time machine that scores brilliantly and fails completely.

Reporting lag is the version people forget. A chargeback flag that lands 30 days after the transaction is not available when the model scores, even though the column is populated for every training row. Write the lag down next to the feature.

| Feature | Source table | Written when | Lag |
| --- | --- | --- | --- |
| \`basket_value\` | \`orders\` | At checkout | none |
| \`avg_spend_90d\` | \`orders\` rollup | Nightly batch | up to 24h |
| \`chargeback_flag\` | \`disputes\` | When the bank files | up to 30d |

### The slow leaks

Two more, both self inflicted. Feature selection run across the full dataset before splitting picks columns using labels the model was never supposed to see. And tuning against the test set for weeks bleeds it dry one decision at a time, until the final number is the maximum of many noisy draws rather than an estimate of anything.

One rule survives all of it: build every feature as if you were standing at the prediction timestamp with no knowledge of the future, then check that the score got worse. A drop after fixing leakage is the good outcome.
      `,
        [
          q('A churn model reaches 0.99 AUC and its strongest feature is days_since_last_login, measured on the export date. What is wrong?', [
            'The feature is collinear with tenure, so the coefficient is unstable',
            'For churned accounts the value is a consequence of the churn itself',
            'The feature has too many missing values among reactivated accounts',
            'AUC is the wrong metric once the churn rate falls below 5 percent',
          ], 1, 'A closed account cannot log in, so the feature is written after the outcome it is supposed to predict and would never look like that at prediction time.'),
          q('Features are built with pd.merge_asof(..., direction=\'forward\'). Why will the offline score not survive contact with production?', [
            'Forward matching attaches values recorded after the event happened',
            'Forward matching drops every event with no later matching record',
            'Forward matching ignores the by= key and mixes accounts together',
            'Forward matching needs both frames sorted on identical column names',
          ], 0, 'Matching forward pulls in the next record after the event, which is information the model cannot possibly have when it fires, so the offline score is built on the future.'),
          q('In a five fold check, one column alone scores 0.94 AUC while the complete model scores 0.95. What is the sensible reading?', [
            'The other columns are redundant and can be dropped from the table',
            'The model is underfitting and needs more depth or more estimators',
            'That column is a leakage suspect and needs a point in time check',
            'The folds are too small, so every estimate carries a wide interval',
          ], 2, 'Genuine signal is normally spread across many weak features, so a single column that nearly answers the question on its own usually encodes the label.'),
        ]
      ),
      ],
      [
      q('A hospital readmission model is validated with KFold over rows, and one patient can have several admissions. Which split matches the deployment question?', [
        'StratifiedKFold on the readmission label alone',
        'A random 80/20 split with a fixed random_state',
        'RepeatedKFold averaged over ten different seeds',
        'GroupKFold with the patient id used as the group',
      ], 3, 'The model will be applied to patients it has never seen, so every admission from one patient has to stay on a single side of the split.'),
      q('Mean target encoding for city is computed over the whole table, then the pipeline is cross validated. Why does the validation score rise?', [
        'Mean encoding always beats one-hot on high cardinality columns',
        'The encoding used a different imputation strategy from the rest',
        'Each row\'s encoded value already contains that row\'s own label',
        'Cross validation shuffles rows, which breaks the city grouping',
      ], 2, 'A mean computed over all rows includes the label of the row being encoded, so the feature smuggles the answer into every validation fold.'),
      q('Which artefact should be serialised so that a single incoming row is treated exactly as the training rows were?', [
        'The whole Pipeline, preprocessing steps and estimator together',
        'The fitted estimator, with transform code kept in the API layer',
        'The training frame, so the transforms can be recomputed live',
        'The estimator plus a JSON file of column means and categories',
      ], 0, 'Pickling the entire pipeline carries the fitted imputer statistics, scaler parameters and category lists alongside the model, so serving cannot drift from training.'),
      q('A feature only lands in the warehouse three days after the event it describes. What does a backtest need so the folds stay honest?', [
        'A larger test size, so the lag covers a smaller share of it',
        'Stratified folds, so every fold carries the same target rate',
        'The feature removed from training and added back at serving',
        'A gap between the end of training and the start of the fold',
      ], 3, 'A gap or embargo stops a fold using values that would not have arrived yet at the prediction timestamp, which is what the reporting lag guarantees.'),
      ]
    ),
    chapter(
      'Supervised Models and Validation That Holds Up',
      'An honest baseline first, metrics tied to the decision the model actually serves, tuning that does not quietly overfit the validation set, and explanations a stakeholder can act on.',
      [
      lesson('Baselines First, Then Linear Models and Gradient Boosting', 13, `
A churn model shipped last quarter scored 96.2% accuracy, and the number went into the monthly deck. Then someone fit a dummy classifier that always predicts "stays" on the same split. It scored 96.0%. Only 4% of accounts churn, so the model had learned to say no to everybody, very confidently.

\`\`\`py
from sklearn.dummy import DummyClassifier
from sklearn.metrics import roc_auc_score, average_precision_score

dummy = DummyClassifier(strategy='prior').fit(X_train, y_train)
p = dummy.predict_proba(X_val)[:, 1]
roc_auc_score(y_val, p)            # 0.500
average_precision_score(y_val, p)  # 0.041, exactly the base rate
\`\`\`

Fit that before anything else and write the number on the ticket. It is the floor.

### Two baselines, not one

The dummy is the statistical floor. The second baseline is the rule the business already runs: flag any account whose weekly logins halved, or whose last invoice bounced. Operations teams usually have one, it costs nothing to evaluate, and it is the real bar. A model that beats the dummy and loses to four lines of SQL is an expensive way to lose.

### Logistic regression, and why scaling is not optional

\`\`\`py
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

lin = make_pipeline(StandardScaler(), LogisticRegression(C=0.5, max_iter=2000))
lin.fit(X_train, y_train)
\`\`\`

Logistic regression gives you a signed coefficient per feature, trains in a second on a million rows, and extrapolates. The regularisation term penalises the size of the coefficients, and coefficient size depends on the units of the column. Leave \`monthly_spend\` in dollars next to \`sessions_per_week\` and the penalty falls almost entirely on the sessions column, because its coefficient has to be large to do anything at all. Scaling inside the pipeline is what makes \`C\` mean the same thing for every column.

### Gradient boosting is the tabular default

\`\`\`py
from sklearn.ensemble import HistGradientBoostingClassifier

gb = HistGradientBoostingClassifier(
    learning_rate=0.06, max_iter=800, max_leaf_nodes=31,
    early_stopping=True, validation_fraction=0.1,
    categorical_features='from_dtype', random_state=0)
\`\`\`

\`HistGradientBoostingClassifier\` bins every numeric column into 255 buckets before it grows a tree, which is why it trains on a million rows in seconds. Two properties remove work a pipeline would otherwise have to do: it accepts NaN directly, learning which side of each split the missing values belong on, and with \`categorical_features='from_dtype'\` it splits on pandas category columns without one hot encoding them at all. Early stopping picks the number of trees off an internal slice.

| Family | Wins when | Costs |
|---|---|---|
| Dummy and business rule | always, run it first | nothing, and it sets the bar |
| Logistic or linear regression | few features, smooth signal, the sign must be explainable | scaling, and explicit interaction terms |
| Random forest | you want a decent number with no tuning | big models, usually behind boosting |
| Gradient boosting | interactions and threshold effects in tabular data | tuning time, and no extrapolation |

### The failure nobody predicts: trees cannot extrapolate

A tree is a set of nested if statements over values it has already seen. If \`tenure_days\` ran from 0 to 900 in training, an account at 1,800 days falls into the same leaf as one at 900 and receives an identical prediction. A linear model keeps moving, sometimes to something absurd, but it moves. On any metric with a trend, that difference decides whether your model quietly flattens next year while the business keeps growing.

Run all three on the same split with the same metric, and put them in a table with training time next to the score. If boosting beats a scaled logistic regression by 0.004 AUC, take the logistic regression. You are going to be maintaining it for two years.
      `,
        [
          q('Your churn model scores 96.2% accuracy where 4% of accounts churn. What does that number tell you?', [
            'The model is strong, because 96% correct is a high bar',
            'The model has overfitted the training rows badly',
            'Almost nothing, since always predicting the majority class scores about 96%',
            'Accuracy is fine here because the two classes are balanced',
          ], 2, 'At a 4% base rate the majority class rule already reaches roughly 96%, so the headline has to be read against that floor before it carries any information.'),
          q('Why does an unscaled logistic regression misbehave when monthly_spend is in dollars and sessions_per_week is a small count?', [
            'The penalty acts on coefficient size, so the small valued column absorbs most of the regularisation',
            'Logistic regression cannot fit columns whose ranges differ by more than tenfold',
            'The solver ranks each column before fitting, which discards the spend values',
            'The intercept becomes unidentifiable once the column variances differ',
          ], 0, 'Regularisation penalises the magnitude of coefficients and magnitude depends on the units of the column, so scaling inside the pipeline is what makes C mean the same thing for every feature.'),
          q('A boosted model trained on tenure_days from 0 to 900 is asked to score an account at 1,800 days. What happens?', [
            'It raises an error because the value sits outside the training range',
            'It continues the trend it learned and returns a proportionally higher score',
            'It falls back to the average prediction over the training set',
            'It lands in the same leaf as the 900 day rows and predicts what it predicted for them',
          ], 3, 'Trees split on thresholds, so any value beyond the largest split falls into the same terminal leaf, which is why boosted models flatten rather than extend outside their training range.'),
        ]
      ),
      lesson('Metrics, Thresholds, and Calibrated Probabilities', 13, `
A card fraud model reached 0.94 ROC AUC, which the team read as nearly perfect. The review queue has two analysts who can work about 200 cases a day. At the default threshold of 0.5 the model raised 5,800 alerts on a normal Tuesday, of which 41 were fraud. AUC was not wrong. It was answering a question nobody had asked.

### Pick the metric from the decision

| The decision | The metric |
|---|---|
| Rank a fixed size review queue | precision at k, and recall at k |
| Rare positives where ranking matters | average precision |
| Compare rankers across different base rates | ROC AUC |
| Multiply a score by a dollar value | log loss, Brier score, calibration curve |
| A hard yes or no with known costs | expected cost at the chosen threshold |

Accuracy appears nowhere on that list. At a 1.2% base rate, predicting "not fraud" for everything scores 98.8%.

ROC AUC stays stubbornly optimistic when positives are rare, because the false positive rate has an enormous denominator: 5,800 alerts against 480,000 clean transactions barely moves it. Average precision uses precision, whose denominator is the alerts you actually raised, so it collapses the moment the queue fills with noise.

\`\`\`py
import numpy as np
from sklearn.metrics import average_precision_score

p = model.predict_proba(X_val)[:, 1]
average_precision_score(y_val, p)   # 0.38 against a base rate of 0.012
\`\`\`

### The threshold is a business decision, not 0.5

\`predict()\` hard codes 0.5. Nothing about your problem chose that number.

\`\`\`py
k = 200                                    # what the queue can actually review
thr_capacity = np.sort(p)[-k]              # 0.31

grid = np.linspace(0.01, 0.99, 99)         # missed fraud costs 220, a review costs 4
cost = [220 * ((p < t) & (y_val == 1)).sum() + 4 * (p >= t).sum() for t in grid]
thr_cost = grid[int(np.argmin(cost))]      # 0.17, nowhere near 0.5
\`\`\`

Choose the threshold on validation, then report performance at that threshold on the test set. Choosing it on the test set is the same sin as tuning on it, wearing different clothes.

### Calibration: does 0.30 mean 30%?

Rank order and probability are different products. If you only sort a queue, an uncalibrated score is fine. The moment somebody multiplies the score by an expected loss, or writes "high risk means above 0.7" into a policy document, calibration becomes the whole job.

\`\`\`py
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import brier_score_loss

frac_pos, mean_pred = calibration_curve(y_val, p, n_bins=10, strategy='quantile')
brier_score_loss(y_val, p)          # 0.0091
cal = CalibratedClassifierCV(model, method='isotonic', cv=5).fit(X_train, y_train)
\`\`\`

Plot \`mean_pred\` against \`frac_pos\`. An honest model sits on the diagonal. Random forests bunch their predictions toward the middle, because averaging hundreds of trees rarely produces a 0.02 or a 0.98, and support vector machines are worse still.

### The trap: rebalancing destroys calibration

Resampling to 50/50 with SMOTE, or setting \`class_weight='balanced'\`, changes the prior the model trains on. Your 1.2% event now looks like a 50% event, and the model dutifully outputs probabilities near 0.5 for cases whose true risk is 0.02. Ranking may improve slightly. Every probability is now inflated by more than an order of magnitude, and any expected value built on it is wrong by that factor. If you rebalance, recalibrate afterwards on unbalanced held out data, or leave the data alone and move the threshold instead.

Report three things: the metric that matches the decision, the threshold and the reason for it, and the confusion matrix in raw counts at that threshold. "Precision 0.31 across the top 200 alerts a day, catching 44% of fraud value" is a sentence an operations lead can staff against.
      `,
        [
          q('Fraud occurs in 1.2% of transactions. ROC AUC is 0.94 but the review queue is full of clean cases. Which metric shows that?', [
            'Accuracy measured at the default threshold of 0.5',
            'Average precision, since precision divides by the alerts you raised',
            'ROC AUC recomputed on the positive class only',
            'Recall at whichever threshold maximises accuracy',
          ], 1, 'The false positive rate has an enormous denominator when negatives dominate, so ROC AUC hardly moves, while precision divides by the alerts actually raised and collapses when the queue fills with noise.'),
          q('A missed fraud costs 220 and a review costs 4. Where should the decision threshold come from?', [
            '0.5, because that is where predict_proba separates the classes',
            'The point where the precision and recall curves cross',
            'Whatever value maximises accuracy on the test set',
            'A cost sweep on validation, then reported at that threshold on test',
          ], 3, 'The cost minimising threshold depends on the two costs and the base rate, so it is chosen by sweeping validation data and only afterwards evaluated on the untouched test set.'),
          q('You rebalanced the training rows to 50/50 with SMOTE. What happens to predict_proba?', [
            'Probabilities inflate well above true risk, so expected value work breaks',
            'Probabilities stay correct, because the ranking of cases is unchanged',
            'Probabilities spread out uniformly between 0 and 1',
            'Probabilities are unaffected but ROC AUC drops sharply',
          ], 0, 'Training against an artificial 50% prior teaches the model to emit mid range probabilities for rare events, so the scores no longer represent risk until they are recalibrated on unbalanced held out data.'),
        ]
      ),
      lesson('Cross-Validation and Tuning Without Fooling Yourself', 13, `
A team ran a 400 trial random search on a lead scoring model. The best cross validation score was 0.883 ROC AUC. On the untouched test set it scored 0.851. Nothing leaked, no bug was ever found, and the gap was entirely predictable: they had taken the maximum of 400 noisy estimates and reported it as though it were an estimate.

### Why the winner is always flattered

Every fold score carries sampling noise. On 12,000 validation rows the standard error of an AUC is around 0.008. Draw 400 samples from a distribution centred on the truth, keep the largest, and you land roughly two standard errors high by construction. That is the winner's curse, and it grows with the number of candidates you tried, not with the quality of your search.

The fix is structural: the number you report has to come from data that no search ever saw.

\`\`\`py
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold
from scipy.stats import loguniform, randint

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
space = {
    'model__learning_rate': loguniform(0.01, 0.3),
    'model__max_leaf_nodes': randint(15, 128),
    'model__min_samples_leaf': randint(10, 200),
    'model__l2_regularization': loguniform(1e-3, 10),
}
search = RandomizedSearchCV(pipe, space, n_iter=60, cv=cv,
                            scoring='average_precision', n_jobs=-1,
                            random_state=0).fit(X_train, y_train)
search.best_score_          # 0.412, for choosing a model, not for reporting one
\`\`\`

### Random beats grid, and it is not close

A grid over four hyperparameters with five values each is 625 fits, and it spends identical effort on the parameter that does nothing and the one that decides everything. Random search draws a fresh value of every parameter on every trial, so 60 trials explore 60 distinct learning rates rather than 5. When two of your four knobs are irrelevant, which is the usual case, random search reaches the good region in a fraction of the fits.

Sample on a log scale for anything multiplicative. \`loguniform(0.01, 0.3)\` puts half its draws below 0.055, while \`uniform(0.01, 0.3)\` puts about 80% of them above 0.07, where the interesting behaviour has already stopped.

### The estimator you search must be the whole pipeline

\`\`\`py
# broken: the scaler has seen every fold, including the one being scored
X_scaled = StandardScaler().fit_transform(X_train)
cross_val_score(model, X_scaled, y_train, cv=cv)      # 0.418, flattering

# correct: preprocessing refits inside every fold
cross_val_score(pipe, X_train, y_train, cv=cv)        # 0.404, honest
\`\`\`

The same applies to imputers, target encoders and feature selection. Picking the top 50 features on the full training set before cross validating typically buys a few points that evaporate in production. The splitter has to match the dependence in the data too: \`GroupKFold\` when rows share a customer, \`TimeSeriesSplit\` when today must never train on next week.

### Read the spread, not the point

\`\`\`py
import pandas as pd
cols = ['mean_test_score', 'std_test_score', 'param_model__max_leaf_nodes']
pd.DataFrame(search.cv_results_)[cols].nlargest(5, 'mean_test_score')
\`\`\`

| rank | mean | std | leaf nodes |
|---|---|---|---|
| 1 | 0.412 | 0.021 | 96 |
| 2 | 0.409 | 0.019 | 31 |
| 5 | 0.404 | 0.011 | 24 |

Ranks 1 and 2 differ by a fifth of one fold standard deviation, which is noise dressed as a decision. Take the simplest model within one standard error of the best: it trains faster, it moves less when the data shifts, and next quarter's rerun will not reshuffle your feature set. If you need an honest estimate of the whole procedure rather than of one fitted model, wrap the search inside an outer \`cross_val_score\`, which is nested cross validation and costs exactly what it sounds like.

One habit closes the loop. Touch the test set once, at the end, after the model is frozen. Look at it twice and it has become a validation set, and you now need a new one.
      `,
        [
          q('A 400 trial search reports best_score_ of 0.883 and the test set returns 0.851. What is the likeliest explanation?', [
            'The test set was drawn from a different population',
            'The pipeline leaked target information into the folds',
            'The maximum of 400 noisy fold estimates sits above the truth by construction',
            'Five folds are far too few to estimate any score reliably',
          ], 2, 'Selecting the best of many candidates picks up their noise along with their signal, so best_score_ is a selection criterion and an optimistic one, never a performance estimate.'),
          q('Why does random search usually beat a grid of the same size over four hyperparameters?', [
            'It always fits more candidate configurations in the same wall clock hour',
            'Every trial draws a new value of every parameter, so effort is not wasted on the ones that do not matter',
            'It avoids refitting the preprocessing steps once per fold',
            'It is guaranteed to find the global optimum given enough iterations',
          ], 1, 'A grid revisits the same handful of values on the important parameter while spending equal effort on irrelevant ones, whereas random sampling gives each trial a fresh value along every axis.'),
          q('You scale the whole training set once, then pass the scaled array into cross_val_score. What is wrong?', [
            'The scaler needs the test rows too, otherwise it is inconsistent',
            'cross_val_score cannot accept a plain NumPy array as input',
            'Scaling has no effect on tree models, so the whole run is wasted',
            'Each fold\'s held out rows shaped the scaler, so every fold score is optimistic',
          ], 3, 'Preprocessing fitted outside the loop has already seen the rows it is later scored on, so it belongs inside the pipeline that cross validation refits on every fold.'),
        ]
      ),
      lesson('Error Analysis and Explanations a Stakeholder Trusts', 13, `
The model reported 0.89 AUC and the retention team stopped trusting it within a month. The reason took nine lines of pandas to find: on accounts younger than 30 days, recall was 0.21 against 0.68 everywhere else. Those young accounts were precisely the ones the team could still save. An aggregate metric hides the slice you were hired for.

### Build the error frame first

\`\`\`py
err = X_val.copy()
err['y'] = y_val.to_numpy()
err['p'] = model.predict_proba(X_val)[:, 1]
err['pred'] = (err.p >= 0.17).astype(int)

buckets = pd.cut(err.tenure_days, [0, 30, 90, 365, 10_000])
err.groupby(buckets).apply(lambda g: pd.Series({
    'n': len(g),
    'base_rate': g.y.mean(),
    'recall': g.loc[g.y == 1, 'pred'].mean(),
    'precision': g.loc[g.pred == 1, 'y'].mean()}))
\`\`\`

Slice by tenure, plan, country, acquisition channel and month, and by anything an operator would name unprompted. Two patterns are worth acting on. A slice where the metric collapses usually means thin data or a feature that is null there. A slice whose base rate differs sharply from the rest usually means the model is mostly predicting group membership.

Then read rows. Sort the confident misses, where \`y == 1\` and \`p < 0.05\`, and open the worst twenty by hand. Half the time the answer is not modelling at all: a feature computed as null for trial accounts, a country code that was renamed upstream, a label recorded three days after the event.

### The default importance is misleading

\`\`\`py
from sklearn.inspection import permutation_importance

imp = permutation_importance(model, X_val, y_val, n_repeats=10,
                             scoring='average_precision', random_state=0)
\`\`\`

\`feature_importances_\` on a tree model counts how often a column was split on, weighted by impurity gain, measured on training data. It systematically favours high cardinality columns, because a column with 40,000 distinct values offers 40,000 places to split and plenty of room to memorise noise. A customer id hashed to a number will sit near the top of that chart while contributing nothing.

Permutation importance shuffles one column in the validation set and measures how far the score falls. It answers the question you care about: how much does this model depend on this feature to perform, on rows it did not train on.

One catch. Give it two correlated features and shuffling either leaves the other to carry the prediction, so both score near zero and both look disposable. Check the correlation before you delete anything.

### Shape, and the single case

\`\`\`py
from sklearn.inspection import PartialDependenceDisplay
PartialDependenceDisplay.from_estimator(model, X_val, ['logins_7d', 'tickets_30d'])
\`\`\`

Partial dependence shows the direction and shape of a relationship, which is usually what a stakeholder is actually asking for. It averages over the rest of the data, so with correlated features it evaluates combinations that never occur (a 3 day old account with 400 logins) and can invent a shape out of nothing. Show it with that caveat attached.

SHAP gives the per row version: which features pushed this one account's score up, by how much, summing to the prediction. That is what makes an alert actionable.

| Question | Tool |
|---|---|
| Where does the model fail | slice table over the error frame |
| What does the model lean on | permutation importance on validation |
| Which way does a feature push | partial dependence, with the correlation caveat |
| Why was this account flagged | SHAP values for that single row |

### Say it in the language of the decision

"Flagged because logins fell 62% in seven days and two payments failed, which together account for most of the score" is usable. "SHAP value 0.31 on feature f_18" is not.

One sentence belongs in every write up: these are the patterns the model uses to predict, not the levers that change the outcome. Driving support tickets to zero by hiding the contact form will not retain a single account. Separating the two is the job of the causal chapter ahead, and saying so early is what stops a model being quoted as a cause.
      `,
        [
          q('The model scores 0.89 AUC overall and 0.21 recall on accounts under 30 days old. Why does that matter more than the headline?', [
            'The aggregate averages over a slice where the model fails and where action is still possible',
            'AUC is invalid whenever a subgroup carries a different base rate',
            'Recall and AUC cannot be compared on the same fitted model',
            'Weak recall on any subgroup makes the overall AUC unreliable',
          ], 0, 'A single number pools every group together, so only a slice table reveals the segment where the model is useless, which is often the segment the team most wanted to serve.'),
          q('Why is feature_importances_ on a boosted tree a poor guide to what the model relies on?', [
            'It is computed from the first tree in the ensemble only',
            'It ignores any feature that appears in more than one split',
            'It is measured on training rows and favours high cardinality columns with many split points',
            'It reports correlation with the target rather than model behaviour',
          ], 2, 'Impurity based importance rewards columns with many distinct values because they offer many opportunities to split and memorise noise, and it is measured on the very rows the model fitted.'),
          q('Permutation importance ranks logins_7d and logins_14d near zero, yet dropping both hurts the score badly. Why?', [
            'Permutation importance is only valid for linear models',
            'The two are correlated, so shuffling one leaves the other carrying the prediction',
            'Ten repeats is far too few to detect a real effect here',
            'Validation data is the wrong place to measure any importance',
          ], 1, 'When two features carry the same information, permuting either one leaves the model able to recover the signal from its twin, so the credit splits and both appear disposable.'),
        ]
      ),
      ],
      [
      q('What is the first model you fit on a new supervised problem?', [
        'A tuned gradient boosting model, to find the ceiling early',
        'A logistic regression, so you can read the coefficient signs',
        'A random forest, because it works without any tuning',
        'A dummy predictor plus the rule the business already runs',
      ], 3, 'The dummy sets the statistical floor and the incumbent rule sets the commercial bar, and a model that clears neither is not worth deploying whatever its accuracy says.'),
      q('A stakeholder wants to multiply your model score by an expected loss in dollars. What must be true of the model?', [
        'It must rank cases well, which any model with high AUC already does',
        'Its probabilities must be calibrated, so 0.30 really means about 30%',
        'It must be linear, because tree ensembles do not output probabilities',
        'It must be trained on rebalanced classes to see enough positives',
      ], 1, 'Any monotone transformation of a score preserves ranking and AUC, so an expected value calculation needs probabilities that match observed frequencies, checked with a calibration curve and a Brier score.'),
      q('Which number belongs in the write up as the model\'s expected performance?', [
        'The score on a test set evaluated once, after the model was frozen',
        'The best cross validation score from the hyperparameter search',
        'The mean of the top ten configurations found by the search',
        'The training score of the refit model on all training rows',
      ], 0, 'Any number a search selected on is optimistic by however much noise it managed to exploit, so the reportable estimate comes from data that took no part in choosing the model.'),
      q('Permutation importance puts support_tickets_30d at the top. What can you tell the retention team?', [
        'Cutting tickets will reduce churn by a measurable amount',
        'Tickets are the strongest cause of churn in this population',
        'The model leans on tickets to predict, which is not tickets causing churn',
        'Tickets should be dropped, since one feature dominating is unsafe',
      ], 2, 'Importance describes how the model uses a feature to predict, and turning that into a lever requires an experiment or an identified design rather than a fitted model.'),
      ]
    ),
    chapter(
      'Models in Production: Scoring, Monitoring, and Drift',
      'Shipping a model with the features it expects, scoring in batch or behind an API without training and serving diverging, watching for drift when the labels arrive weeks late, and retraining without teaching the model its own output.',
      [
      lesson('Packaging the Model and the Features It Expects', 13, `
A churn model held 0.91 AUC on the holdout in January. In March the nightly batch started returning almost the same probability for everyone, around 0.043, and nobody noticed for eleven days. An upstream table had renamed \`plan_tier\` to \`tier\`, an ETL step "fixed" it by selecting columns positionally, and the model received tenure values in the slot where monthly spend belonged. It did not raise. Nothing raises, unless you arrange for it.

### Ship the pipeline, not the estimator

The artifact is everything that sat between the raw row and the score.

\`\`\`py
# Broken: the scaler and the encoder lived in notebook cells
joblib.dump(clf, 'model.joblib')

# Correct: the fitted ColumnTransformer travels with the estimator
joblib.dump(pipe, 'models/churn/2024-07-02/model.joblib')
\`\`\`

Those transformers hold fitted state: the training median used for imputation, the mean and variance for scaling, the exact category list the encoder learned. Rebuilding them at serving time from serving data is leakage in reverse, and it moves every score.

### Names are checked, arrays are not

\`\`\`py
pipe.feature_names_in_
# array(['tenure_months', 'monthly_spend', 'tier', 'n_tickets_90d'], ...)

X = customers[['monthly_spend', 'tenure_months', 'tier', 'n_tickets_90d']]
pipe.predict_proba(X)          # ValueError: feature names must be in the same order
pipe.predict_proba(X.values)   # no complaint, wrong columns, plausible numbers
\`\`\`

A DataFrame gets its column names checked against \`feature_names_in_\`. A NumPy array gets nothing, because there is nothing to check: width is the only contract. Calling \`.values\`, \`.to_numpy()\` or \`np.asarray()\` on the way into a fitted pipeline throws away the one guard rail sklearn gives you free.

### The artifact is a bundle, not a file

| File | Contents | Why it exists |
| --- | --- | --- |
| \`model.joblib\` | The fitted pipeline | The thing that scores |
| \`metadata.json\` | Version, git sha, train window, library versions, feature names and dtypes, decision threshold, holdout metrics | Answers "which model produced this row" |
| \`golden.parquet\` | 50 real input rows plus the scores they produced at training time | Proves the artifact still behaves |

\`\`\`py
meta = {
    'version': 'churn-2024-07-02',
    'git_sha': '4c1f9ab',
    'train_window': ['2023-01-01', '2024-06-30'],
    'sklearn': sklearn.__version__, 'numpy': np.__version__,
    'features': list(pipe.feature_names_in_),
    'dtypes': {c: str(t) for c, t in X_train.dtypes.items()},
    'threshold': 0.41,
    'holdout': {'auc': 0.912, 'precision_at_threshold': 0.38, 'rows': 41_207},
}
\`\`\`

The threshold belongs here rather than in the serving code, because the threshold is a property of this fitted model and changes with every retrain.

### Version lock, and a smoke test at startup

Pickle stores import paths, not code. Load an artifact under a different scikit-learn and you get either an \`InconsistentVersionWarning\` or, worse, an object whose internals moved and whose numbers quietly changed. Pin exact versions in the serving image, then verify at load.

\`\`\`py
def load_model(path):
    meta = json.loads((path / 'metadata.json').read_text())
    if sklearn.__version__ != meta['sklearn']:
        raise RuntimeError(f"trained on {meta['sklearn']}, running {sklearn.__version__}")
    pipe = joblib.load(path / 'model.joblib')
    g = pd.read_parquet(path / 'golden.parquet')
    got = pipe.predict_proba(g[meta['features']])[:, 1]
    assert np.abs(got - g.expected_score).max() < 1e-9, 'golden rows drifted'
    return pipe, meta
\`\`\`

A failed assertion at startup is a deploy that goes red in ninety seconds. The alternative is eleven days of 0.043.

Exporting to ONNX escapes the version lock, at a price: conversion computes in float32, so identical inputs land roughly 1e-6 away from the Python scores. Widen the golden tolerance deliberately and record the number you chose, rather than discovering it during an incident.
      `,
        [
          q('You fit a Pipeline on a DataFrame, then at serving time pass X.values with two columns in the wrong order. What happens?', [
            'scikit-learn raises a ValueError naming the mismatched columns',
            'The ColumnTransformer reorders the array using feature_names_in_',
            'Scoring proceeds on positionally wrong features and returns plausible numbers',
            'predict_proba returns NaN for every row in the scored batch',
          ], 2, 'A NumPy array carries no column names, so the only contract left is width, and the pipeline happily scores tenure values in the slot where spend belongs.'),
          q('Why does the serialised artifact have to contain the fitted transformers rather than the estimator alone?', [
            'The encoders and scalers hold values fitted on training rows, and serving must reuse exactly those',
            'A Pipeline object compresses better on disk than a bare estimator does',
            'Only Pipeline objects expose predict_proba for a classifier at serving time',
            'joblib cannot serialise a bare estimator unless its transformers travel too',
          ], 0, 'The imputation medians, scaling statistics and learned category lists are part of the model, so refitting them on serving data changes every score.'),
          q('The serving image is rebuilt and picks up a newer scikit-learn. Which check catches a changed prediction before traffic reaches it?', [
            'A unit test asserting the artifact file exists and is not empty',
            'A schema check that the request payload carries every required field',
            'An alert on the average score, reviewed at the end of the week',
            'Scoring the stored golden rows at startup and refusing to boot on drift',
          ], 3, 'Replaying inputs whose correct outputs were recorded at training time turns a silent numerical change into a deploy that fails in ninety seconds.'),
        ]
      ),
      lesson('Batch Scoring, an API, and Training-Serving Skew', 13, `
Same churn artifact, two consumers. A nightly job scores 2.4 million customers into \`analytics.churn_scores\`; a support tool calls an API for one customer on demand. One Tuesday afternoon customer 88214 had a score of 0.12 in the table and 0.38 from the API. Both ran the same pipeline. Training built \`days_since_last_order\` against the snapshot date, and the API built it against \`datetime.now()\`, so the API was feeding the model a feature that meant something training had never seen. That gap has a name, training-serving skew, and it is the most expensive bug on this page.

### Pick the serving shape from the decision

| | Batch | Online API |
| --- | --- | --- |
| When the decision is acted on | The next morning | Inside the request |
| Where features come from | A warehouse snapshot | Whatever the caller holds |
| Cost at 2.4M scores | A few cents of compute | Containers kept warm all day |
| Worst failure | A late job | A timeout in someone else's checkout |

If a human reads the answer tomorrow, batch it. Most "we need this in real time" requirements dissolve under that one question, and batch is the shape where reproducing training exactly is easy.

### Batch scoring that survives a retry

\`\`\`py
feats = build_features(run_date)                 # the function training used
p = pipe.predict_proba(feats[meta['features']])[:, 1]
out = feats[['customer_id']].assign(
    score=p,
    decision=p >= meta['threshold'],
    model_version=meta['version'],
    scored_at=pd.Timestamp.utcnow(),
    run_date=run_date,
)
replace_partition('analytics.churn_scores', run_date, out)   # not append
\`\`\`

Every job gets retried eventually. Appending is what turns one retried run into 4.8 million rows and a Monday spent explaining why churn doubled. Write a partition the run owns and replaces, and stamp \`model_version\` on every row so a shift in the numbers can be attributed later.

### One feature function, two callers

\`\`\`py
# training/features.py
df['days_since_last_order'] = (snapshot - df.last_order_at).dt.days

# api/app.py   <- a second implementation, which is the whole problem
days = (datetime.now() - last_order_at).days
\`\`\`

Two implementations of one definition drift apart the first time anyone edits either. Import \`build_features(rows, as_of)\` in both places, pass \`as_of\` explicitly, and log the value you passed. The API is not exempt from the definition just because it is written in a web framework.

### The API details that bite

Load the artifact once at process start, in module scope or a lifespan hook. Calling \`joblib.load\` inside the handler adds the full deserialisation cost to every request and holds a copy per in-flight call, which turns a 12 ms endpoint into a 400 ms one that runs out of memory under load.

Validate the payload with pydantic. A missing \`tier\` should be a 422, not a \`None\` that the imputer fills with the training median while returning a confident score. The same goes for a category the encoder never saw: \`handle_unknown='ignore'\` produces an all-zero block and a perfectly plausible number, so count those events and alert on the rate.

Then log, for every request, the exact feature row you scored, the score, and the model version. That log is the only way to prove skew exists. With it, comparing serving features against the training distribution is a weekly query. Without it, you are arguing from memory while the API and the batch job disagree about a customer.
      `,
        [
          q('Training computed days_since_last_order from the snapshot date, while the API computes it from datetime.now(). What does that produce?', [
            'Identical scores that simply arrive with slightly higher latency',
            'A feature whose meaning differs between training and serving, so scores skew',
            'A pydantic validation error on any request with a stale last order',
            'A dtype mismatch that raises inside the fitted ColumnTransformer',
          ], 1, 'The model was fitted on distances measured from a snapshot, so measuring from the current clock feeds it a variable it never saw and shifts the score.'),
          q('A FastAPI endpoint calls joblib.load inside the request handler. What is the effect under load?', [
            'Requests are served from a shared cache after the very first call',
            'Memory stays flat because each model is freed once the response is sent',
            'Predictions become inconsistent between concurrent worker processes',
            'Every request pays the deserialisation cost, so latency and memory climb',
          ], 3, 'Loading per request rebuilds the whole pipeline object each time and holds one copy per in-flight call, which is how a 12 ms endpoint becomes a 400 ms one.'),
          q('The nightly scoring job timed out and was retried. What keeps downstream counts correct?', [
            'Writing a run_date partition that the run replaces, with model_version on every row',
            'Appending the rows and de-duplicating later inside the reporting query',
            'Running the job twice deliberately and averaging the two sets of scores',
            'Sorting the output by customer_id before appending it to the table',
          ], 0, 'A partition the run owns and replaces makes the job idempotent, so a retry overwrites rather than doubling the scored population.'),
        ]
      ),
      lesson('Monitoring Drift When the Labels Arrive Late', 13, `
A lending model decides in July whether an application defaults. The label lands in October. If your only monitor is AUC, October is when you find out that August was broken, by which point the bad decisions are already on the balance sheet. Everything useful you can watch today is a proxy, and the proxies are cheap.

### Four layers, cheapest first

| Layer | Example signal | Lag |
| --- | --- | --- |
| Operational | Rows scored, null rate on \`monthly_spend\`, p99 latency, 5xx rate | Minutes |
| Input drift | PSI per feature against the training sample | A day |
| Output drift | Mean score, share above the threshold | A day |
| Performance | AUC, precision at the threshold | Weeks |

The top three catch most real incidents. An upstream schema change shows up as a null-rate spike hours before it moves any model metric, and a job that scored 190,000 rows instead of 2.4 million is visible immediately.

### PSI, with real bins

Population Stability Index compares a current distribution against the training one across fixed bins: \`PSI = sum((a - e) * ln(a / e))\`.

\`\`\`py
def psi(expected, actual, bins=10):
    edges = np.quantile(expected, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual,   edges)[0] / len(actual)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return float(((a - e) * np.log(a / e)).sum())
\`\`\`

That clip is not cosmetic. One empty bin gives \`log(0)\`, PSI becomes infinite, and the alert fires forever until somebody mutes the whole dashboard. Read the result against the conventional bands: below 0.1 is stable, 0.1 to 0.25 is worth watching, above 0.25 means act. On \`monthly_spend\` a value of 0.31 said a pricing change had shifted the input the model was most sensitive to.

### Significance is not the alarm you want

A two-sample KS test on 2.1 million scored rows returns p below 1e-12 for a shift of 0.3%, every single week. At that sample size a p-value measures how much data you have, not whether anything matters. Alert on effect size instead: PSI, the KS statistic D itself, or the change in mean score expressed in decisions per day.

### Key metrics by cohort, not by calendar

With a 90 day lag, "AUC of every labelled row available today" mixes fully matured old cohorts with partly matured recent ones, and the recent ones only contain early defaults. The number moves for reasons that have nothing to do with the model.

| Scored cohort | Rows | Matured | Reported AUC |
| --- | --- | --- | --- |
| 2024-04 | 38,410 | 100% | 0.786 |
| 2024-05 | 41,002 | 98% | 0.771 |
| 2024-06 | 39,884 | 61% | withheld |

Report a cohort only once it passes a maturity threshold, and hold the immature ones back rather than publishing a number that will move on its own.

### Segments, and what actually pages someone

Overall PSI of 0.04 hid a new mobile signup channel, 7% of volume, sitting at 0.41 with a null rate of 30% on tenure. Track the two or three segments the decision depends on separately. Then match the response to the cost: page on row counts and null rates, raise a ticket on PSI, review performance monthly when the labels mature.
      `,
        [
          q('A KS test on 2.1 million scored rows returns p below 1e-12 every week. Why is that a poor drift alarm?', [
            'KS tests apply only to raw features, never to model scores',
            'The test needs labels, which have not arrived for those rows yet',
            'At that sample size a trivial difference is significant, so use effect size',
            'p-values are valid only when the feature is normally distributed',
          ], 2, 'Significance scales with sample size, so a 0.3% shift clears any threshold on millions of rows and the alarm stops carrying information.'),
          q('PSI for monthly_spend comes back at 0.31 against the training sample. What does that indicate?', [
            'Stable behaviour, since anything under 0.5 is normal month to month',
            'A large shift that warrants investigation before the scores are trusted',
            'That the feature has become perfectly correlated with the target',
            'A calculation error, because PSI values cannot exceed 0.25',
          ], 1, 'The conventional bands put anything above 0.25 in the act now range, and a feature the model leans on moving that far changes the meaning of its scores.'),
          q('Labels arrive 90 days after scoring. What is wrong with computing AUC over every labelled row available today?', [
            'Recent cohorts are only part matured, so the mix is biased toward early events',
            'AUC is undefined whenever the rows in a dataset were scored on different days',
            'Scores older than 90 days have to be discarded before any metric is computed',
            'Nothing is wrong, though the number should be reported as precision instead',
          ], 0, 'Mixing fully matured cohorts with ones that have only had a few weeks to produce outcomes makes the metric move for reasons unrelated to the model.'),
        ]
      ),
      lesson('Retraining, Rollback, and Feedback Loops', 14, `
A fraud model retrained every Sunday on the outcomes of the previous week. Blocked transactions never produce a chargeback label, so week by week the training set filled with approved traffic only. Recall on the pattern it had been built to catch fell from 0.71 to 0.42 over six months, and every offline metric stayed healthy the whole time, because the holdout was drawn from the same censored pool. The model had been grading its own homework.

### Choose a trigger and defend it

| Trigger | Good for | Failure mode |
| --- | --- | --- |
| Fixed cadence | Most models, most of the time | Slow to react to a real break |
| Drift threshold | Genuinely non-stationary inputs | Chases noise, retrains on a holiday weekend |
| Performance drop | Fast label loops | Useless when labels lag by months |

Boring wins here. A monthly retrain on a fixed date, reviewed by a person, beats an automatic pipeline that fires whenever PSI crosses 0.25.

### The challenger is judged on the champion's terms

\`\`\`text
Broken:  challenger 0.88 AUC on a fresh split of the last 4 weeks
         champion   0.86 AUC on a split from 6 months ago      -> ship it
Correct: both scored on the same rolling-origin backtest
         champion 0.884, challenger 0.879                      -> do not ship
\`\`\`

Different periods have different difficulty, so a comparison across two holdouts measures the weather. Score both models on identical folds, and require a margin larger than the fold-to-fold spread you already measured, otherwise you are deploying noise and paying the migration cost for it.

### Shadow, canary, rollback

Shadow first: score both models on live traffic, serve the champion, log both. This catches serving errors and skew without risking a decision. Then canary the challenger on 5% of traffic for a week, watching decision rate and guardrail metrics rather than AUC.

\`\`\`yaml
model:
  version: churn-2024-07-02
  artifact: s3://models/churn/2024-07-02/
  threshold: 0.41
  previous: churn-2024-06-04
\`\`\`

Rollback is editing \`version\` back to \`previous\` and restarting, under ten minutes, because artifacts are immutable and the old one still exists. If reverting means retraining, you do not have rollback, you have a promise.

### Feedback loops, and the holdout that breaks them

Three shapes, all of them quiet:

- Censored labels. Fraud and credit models never learn what the rejects would have done. Route 1% of traffic around the model and accept those cases anyway, and you buy the only unbiased label sample that exists. Price it as a monitoring cost, because that is what it is.
- Self-fulfilling ranking. A recommender trains on clicks it generated, popular items get more exposure, the tail starves and then looks genuinely unpopular in the data. Log impressions as well as clicks, and reweight by exposure or hold back a fixed exploration slice.
- Human in the loop. Analysts only review high scores, so labels exist only where the model already said yes, and precision looks superb while recall is unmeasured.

| Symptom | First action |
| --- | --- |
| Score mean shifts, inputs stable | Check for a silent artifact or code change |
| One segment drifts hard | Segment the metric before touching the model |
| Metrics fine, business number falls | Look for a feedback loop, not a bug |
      `,
        [
          q('A fraud model retrains each week on outcomes for the transactions it approved. What degrades over time?', [
            'Latency, because the training set grows a little larger every week',
            'Calibration alone, while the ranking quality of the scores holds up',
            'Feature importance ordering, though recall on blocked patterns holds',
            'Coverage of the patterns it blocks, since those rows never get labels',
          ], 3, 'Blocked transactions produce no chargeback outcome, so the fraud the model already catches vanishes from the training data and it slowly forgets it.'),
          q('A challenger scores 0.88 AUC on a fresh split of the last four weeks, the champion scored 0.86 six months ago. Ship it?', [
            'Yes, the newer holdout is closer to current traffic so it is more relevant',
            'Yes, as long as the challenger uses the same algorithm family as before',
            'No, both models must be scored on the same folds before those numbers compare',
            'No, a challenger has to beat the champion by two full AUC points first',
          ], 2, 'Different periods have different difficulty, so a gap measured across two holdouts describes the data rather than the models.'),
          q('Why route a small random slice of traffic around the model\'s own decision?', [
            'It cuts serving cost, because those requests skip inference entirely',
            'It yields labels unaffected by the model, the only unbiased sample you get',
            'It satisfies the requirement that every deployed model run an A/B test',
            'It warms the cache so the scoring path stays fast during peak hours',
          ], 1, 'When the model\'s decision censors the outcome, the only rows that show what would have happened are the ones the model was not allowed to decide.'),
        ]
      ),
      ],
      [
      q('Overnight scores shifted and you need to know which model produced them. Which practice makes that answerable?', [
        'Writing model_version and scored_at onto every scored row',
        'Keeping the training notebook committed in the repository',
        'Storing the artifact under a mutable path named latest',
        'Recording the holdout AUC in the deployment ticket',
      ], 0, 'Stamping the version on the output rows is what lets you attribute a change in the numbers to a specific artifact instead of guessing.'),
      q('Input distributions look stable and the score distribution looks stable, yet the API\'s precision has fallen. What do you check first?', [
        'Whether the training set has grown large enough for the model family',
        'Whether the holdout used a random split rather than a grouped one',
        'Whether the artifact file was corrupted on the deployment host',
        'Whether serving builds each feature the same way training did',
      ], 3, 'Skew keeps the marginal distributions looking normal while the rows the model sees no longer mean what they meant during training.'),
      q('A canary at 5% of traffic shows a 12% drop in accepted applications. What is the right immediate move?', [
        'Raise the canary to 50% to gather a more decisive sample',
        'Pin serving back to the previous model version, then investigate',
        'Retrain the challenger using the week of canary data collected',
        'Lower the decision threshold until the acceptance rate recovers',
      ], 1, 'Reverting to the known artifact stops the damage in minutes and leaves the evidence intact for a diagnosis that does not run against live customers.'),
      q('Labels for a risk model take eight weeks to arrive. Which signal tells you something broke this morning?', [
        'Rolling AUC computed on the most recently labelled cohort',
        'The lift chart presented at the last quarterly model review',
        'Null rates and the score distribution compared with last week',
        'The champion versus challenger comparison recorded at launch',
      ], 2, 'Operational and output signals are available the same day, so they are the only layer that can catch a broken upstream table before the labels mature.'),
      ]
    ),
    chapter(
      'Causal Questions, Experiments, and Decisions',
      'Separating what predicts from what causes, designing an experiment with the power and guardrails to settle the question, estimating an effect when randomisation is impossible, and owning the recommendation that follows.',
      [
      lesson('Prediction or Intervention: Naming the Real Question', 13, `
A churn model hit 0.89 AUC. Retention took the top 5,000 scores and mailed a 20 percent win-back discount. Six weeks later, churn in that group was 1.4 points higher than in a matched holdout that got nothing. The model was fine. The team asked it a question it had never answered.

Prediction asks what is likely to happen given what you can see. Intervention asks what changes if you act. The strongest feature in that model was "visited the cancellation help page in the last seven days". As a predictor it is excellent. As a targeting rule it selects people who have already decided, and the discount email reminds them to finish.

### The number you never observe

Write Y(1) for the outcome if a customer gets the offer and Y(0) for the outcome if the same customer does not. The effect for that person is Y(1) minus Y(0), and exactly one of the two is ever recorded. Every causal method that follows is a way of borrowing the missing half from a comparable group, and every argument about a causal claim is really an argument about whether that group was comparable.

Name the average you want before you touch the data.

| Estimand | Question it answers | Where it is used |
| --- | --- | --- |
| ATE | Effect if everyone received it | Ship or do not ship |
| ATT | Effect on those who did receive it | Grading a rollout that already happened |
| CATE | Effect for this kind of customer | Deciding who to target |

The retention team needed CATE and used a risk score instead. Uplift thinking splits customers four ways: persuadables, who stay only if treated; sure things, who stay either way, so the discount is margin given away; lost causes, who leave either way; and sleeping dogs, who leave because you contacted them. Ranking by risk fills the list with the last three.

### Good controls and bad controls

Adding a variable because it improves fit is a prediction habit. In a causal model every variable has a job, and three roles behave completely differently. A confounder causes both the treatment and the outcome, so control for it. A mediator sits on the path from treatment to outcome, so controlling for it deletes the effect you are trying to measure. A collider is caused by both the treatment and something else that drives the outcome, and controlling for it manufactures a relationship that was never there.

\`\`\`py
import numpy as np, pandas as pd, statsmodels.formula.api as smf

rng = np.random.default_rng(7)
n = 20_000
call     = rng.binomial(1, 0.5, n)                 # randomised onboarding call
skill    = rng.normal(size=n)                      # real, never measured
retained = 0.30 + 0.08*call + 0.05*skill + rng.normal(0, 0.10, n)
tickets  = 2.00 - 1.20*call + 0.90*skill + rng.normal(0, 0.50, n)

df = pd.DataFrame(dict(call=call, retained=retained, tickets=tickets))
smf.ols('retained ~ call', df).fit().params['call']            # 0.080, the truth
smf.ols('retained ~ call + tickets', df).fit().params['call']  # about 0.05, wrong
\`\`\`

The call was randomised, so the plain difference is already unbiased. Adding \`tickets\` breaks it. Among customers who filed the same number of tickets, one who received the call must be less skilled, and skill drives retention, so the comparison is no longer like for like. R squared went up and the answer went wrong. That is the shape of the trap: the diagnostic you trust in a predictive workflow is silent here.

### The habit

Write the question as a sentence with a verb in it before you open the data. "If we send this offer to customers like this one, how much does their 90 day retention change?" That sentence names the treatment, the population, the outcome, and the horizon, and it rules out three quarters of the models you might have built. A 0.89 AUC with no such sentence behind it is a well tuned answer to nobody's question.
      `,
        [
          q('A churn model\'s strongest feature is \'visited the cancellation page this week\'. Why does that make it a poor targeting rule?', [
            'The feature is measured after the label, so it leaks the outcome',
            'Cancellation page visits are too rare to score most customers',
            'It selects people whose decision is largely made, not people an offer could move',
            'That event is not available at scoring time in production',
          ], 2, 'Targeting needs the effect of the offer on that person, and someone already on the cancellation page is far more likely to be a lost cause or a sleeping dog than a persuadable.'),
          q('An onboarding call is randomised, then you add \'support tickets filed in week one\' as a control because it improves fit. What happens to the estimated effect of the call?', [
            'It becomes biased, because tickets are caused by both the call and unmeasured skill',
            'It stays unbiased and gains precision, since the call was randomised',
            'It stays unbiased but the standard error grows by a large factor',
            'It falls to exactly zero, because tickets absorb all of the variation',
          ], 0, 'A variable caused by both the treatment and an unobserved driver of the outcome is a collider, and conditioning on it opens a path that did not exist in the randomised comparison.'),
          q('Which estimand do you need to decide who should receive a limited retention budget?', [
            'The ATE, because it averages the effect over everyone',
            'The ATT, because it covers the customers already treated',
            'The churn rate inside the highest risk decile',
            'The CATE, because the effect varies and you want the movable customers',
          ], 3, 'Targeting is a question about how the effect differs across people, so the conditional average effect is the target rather than a single population average or a risk ranking.'),
        ]
      ),
      lesson('Designing an Experiment: Power, Guardrails, and Not Peeking', 14, `
The test ran three weeks across 184,000 users and returned plus 0.4 percent on conversion, 95 percent CI minus 1.9 to plus 2.7. Someone asked what it told us. Nothing. The design could only ever have detected a lift of about 2.6 percent, and nobody in the room believed the change was worth more than 1 percent. Three weeks of traffic bought a shrug.

### Start from the minimum detectable effect

\`\`\`py
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

h = proportion_effectsize(0.0412, 0.0400)   # 3 percent relative lift on a 4 percent base
NormalIndPower().solve_power(h, power=0.8, alpha=0.05, ratio=1)
# about 170,000 per arm
\`\`\`

Run that before the test, not after it disappoints. If your traffic supports an MDE of 2.6 percent and the plausible effect is 1 percent, there are three honest moves: find more traffic, cut the variance, or do not run. The fourth move, running it anyway and reading the point estimate, is how teams ship on noise and then wonder why the annual numbers never move.

### The randomisation unit is a design decision

| Unit | Use when | Cost |
| --- | --- | --- |
| User | The change persists across sessions | Standard, best power per user |
| Session | Purely visual, nothing remembered | Contaminated if a user sees both |
| Account or team | Shared or collaborative surfaces | Far fewer units, much less power |
| Market or city | Marketplace, pricing, supply effects | Tiny n, needs its own analysis |

Randomise by session on a feature people remember and the same person lands in both arms, so the arms bleed together. Randomise by user on a two sided marketplace and you get the opposite problem: treated buyers consume the supply control buyers then cannot book, so control is harmed by the treatment and the measured lift is inflated.

### Check the split before you read the result

\`\`\`py
from scipy.stats import chisquare
chisquare([92_413, 91_004])      # p = 0.0009
\`\`\`

That is a sample ratio mismatch. A 50/50 assignment does not drift by 1,400 users at this scale. Something filtered one arm: a bot rule, a redirect that lost slow clients, an exposure event firing late. An SRM invalidates the comparison itself, so do not reweight and carry on. Find the bug, then rerun.

### One primary metric, and guardrails with numbers on them

| Role | Example | Rule |
| --- | --- | --- |
| Primary | Checkout conversion | Decides ship, fixed before launch |
| Secondary | Items per order | Reported, never used to rescue a loss |
| Guardrail | p95 latency, refunds, unsubscribes | Bound written in advance, breach blocks ship |

A guardrail is not a metric you hope stays flat. It is a threshold agreed beforehand: latency may not rise more than 5 percent, refund rate may not rise at all.

### Variance reduction beats waiting

\`\`\`py
theta = np.cov(y, y_pre)[0, 1] / np.var(y_pre)
y_adj = y - theta * (y_pre - y_pre.mean())
\`\`\`

CUPED subtracts the part of each user's outcome that their pre-period value already explains. On a metric with a strong pre-period correlation it removes 30 to 50 percent of the variance, which is a 30 to 50 percent traffic discount on data you already have.

### Peeking, and the honest way to watch

Checking daily and stopping at the first p under 0.05 drives the false positive rate towards 20 percent. If the business needs to watch live, buy that right with a group sequential design or always valid confidence sequences. Both make early looks deliberately expensive: the boundary on day two sits far out and tightens as evidence accumulates.

One last trap. If only 8 percent of users ever reach the changed screen, the intention to treat effect is diluted about twelvefold, and a working feature reads as flat. Log the trigger event and analyse the triggered population, decided in advance rather than after the readout lands.
      `,
        [
          q('A test with 60,000 users per arm has a minimum detectable effect of 2.6 percent, and the team expects at most 1 percent. What should happen before it launches?', [
            'Launch it and extend the run if the result comes back flat',
            'Find the traffic or the variance reduction to reach that effect, or do not run it',
            'Lower alpha to 0.01 so a smaller true effect can clear the bar',
            'Swap the primary metric for one that moves more, then report that',
          ], 1, 'A design that cannot detect the effect you expect returns an uninformative interval whichever way it lands, so the sample size or the variance has to change before any of it is worth running.'),
          q('A 50/50 assignment returns 92,413 users in one arm and 91,004 in the other. Why is that worth stopping for?', [
            'The imbalance costs a small amount of statistical power',
            'Uneven arms make the Welch t-test invalid on the outcome',
            'The difference is inside normal random variation at this scale',
            'A gap that size is not chance, so assignment is broken and both arms are suspect',
          ], 3, 'A sample ratio mismatch means users were filtered or lost differently by arm, which biases the comparison itself, so the fix is finding the bug rather than reweighting the result.'),
          q('What does CUPED buy an experiment, and what does it require?', [
            'Lower variance on the metric, given a pre-period measurement of that metric',
            'A valid p-value after daily peeking, given a fixed stopping rule',
            'Protection from sample ratio mismatch, given equally sized arms',
            'Correct inference under interference, given market level assignment',
          ], 0, 'CUPED subtracts the part of the outcome that each user\'s pre-experiment value already predicts, which cuts variance and therefore the traffic needed, but only where that pre-period data exists.'),
        ]
      ),
      lesson('When You Cannot Randomise: Matching, Difference-in-Differences, and Sensitivity', 14, `
The pricing change went live in six countries on 1 October. Revenue per user there rose 11 percent by December. Read alone, that is a promotion. The eighteen countries that did not get the change rose 8 percent over the same weeks, because December is December. The change was worth roughly 2 to 3 percent, and the gap between those two numbers is the whole job.

### Matching fixes only what you measured

Comparing users who adopted a feature against users who did not compares two different kinds of people. Propensity matching models the probability of being treated, then compares treated and untreated users who look equally likely to be treated.

\`\`\`py
from sklearn.linear_model import LogisticRegression

ps = LogisticRegression(max_iter=1000).fit(X, treated).predict_proba(X)[:, 1]
users['ps'] = ps
users = users[(ps > 0.05) & (ps < 0.95)]     # common support only
\`\`\`

Then prove the balance instead of assuming it: every covariate should show a standardised mean difference under 0.1 after matching. The trimming step is not cosmetic. A treated user with a propensity of 0.98 has no real control to compare against, and keeping them forces the model to extrapolate into a region with no data.

The limitation is blunt. Matching balances the columns in \`X\`. If the true reason people adopted was enthusiasm, and enthusiasm is not a column, the estimate stays biased while the balance table looks immaculate.

### Difference in differences

DiD compares the change in the treated group to the change in a control group over the same window, which cancels anything common to both.

\`\`\`py
m = (smf.ols('log_rev ~ treated*post + C(country) + C(month)', data=panel)
        .fit(cov_type='cluster', cov_kwds={'groups': panel['country']}))
m.params['treated:post']        # 0.023, about a 2.3 percent lift
\`\`\`

Cluster the standard errors on the unit that was treated. Six countries across 24 months is 144 rows but only six independent units. Treat the rows as independent and the standard error comes out roughly a third of the truth, which promotes noise to a confident finding.

### The assumption, and how to attack it

DiD assumes the groups would have moved in parallel without the treatment. That is untestable, but its shadow is not.

- Event study: estimate one coefficient per period relative to the change. Pre-period coefficients should sit flat near zero. A line already climbing in August means the countries were diverging anyway.
- Placebo date: refit on pre-treatment data only, pretending treatment began in July. An effect there means the design is producing the number, not the policy.
- Placebo outcome: run the same model on a metric the change cannot touch, such as support ticket volume. It should be flat.

Staggered rollouts add a trap. With different start dates, a two way fixed effects regression quietly uses already treated units as controls for later ones, and the coefficient can flip sign when effects grow over time. Use a staggered estimator built for it, or restrict the sample to one clean pre and post window.

### Say how wrong you could be

| Question | Tool |
| --- | --- |
| How strong would an unmeasured confounder need to be | E-value |
| Does the conclusion survive a plausible bias | Bounds, tipping point analysis |
| Would this method find an effect that is not there | Placebo outcome, negative control |

An observed risk ratio of 1.6 carries an E-value near 2.6: an unmeasured confounder would have to be associated with both the treatment and the outcome at a risk ratio of about 2.6 to explain the result away entirely. If tenure, the strongest confounder you did measure, only reaches 1.4, then 2.6 is a stretch and you can write that sentence in the memo. A defensible observational result is not certainty. It is an objection with a number attached to it.
      `,
        [
          q('Propensity matching returns a balance table with every standardised mean difference under 0.1. What has that established?', [
            'Balance on the variables you measured, and nothing about the ones you did not',
            'That treatment assignment was effectively random inside the matched sample',
            'That the parallel trends assumption now holds for a later analysis',
            'That any remaining difference in outcomes is the causal effect',
          ], 0, 'Matching can only equalise the covariates you fed into the model, so an unmeasured driver of both treatment and outcome survives the procedure completely untouched.'),
          q('Your difference-in-differences model treats 6 countries over 24 months as 144 independent observations. What breaks?', [
            'The interaction coefficient becomes uninterpretable',
            'The fixed effects absorb the treatment indicator entirely',
            'Standard errors come out far too small, because errors correlate within country',
            'The parallel trends assumption can no longer be tested',
          ], 2, 'Rows from the same country move together over time, so treating them as independent understates the real uncertainty and produces intervals that are much narrower than the evidence supports.'),
          q('A reviewer says an unmeasured confounder explains your observational result. How does a sensitivity analysis answer that?', [
            'It re-estimates the effect after dropping the weakest measured confounders',
            'It states how strong such a confounder would have to be to erase the effect',
            'It proves that no unmeasured confounder is present in the sample',
            'It replaces the estimate with a bound that is always conservative',
          ], 1, 'A sensitivity analysis such as the E-value turns the objection into a number, by reporting the association strength an unmeasured confounder would need on both the treatment and the outcome.'),
        ]
      ),
      lesson('Fairness, Privacy, and the Decision You Put Your Name On', 14, `
A CV screening model was audited after the gender field was pulled from its inputs. The selection rate gap barely moved: 2.1x before, 2.0x after. The information had not left the data. It was sitting in the school name, the postcode, a gap in employment dates, and one sport.

Dropping a protected attribute removes your ability to measure the disparity, not the disparity. Keep the attribute for evaluation even when it is banned from the features.

### The definitions disagree, and they have to

| Definition | Equalises | Fits |
| --- | --- | --- |
| Demographic parity | Selection rate | Outreach, allocating opportunity |
| Equalised odds | TPR and FPR | Screening where an error harms the person |
| Calibration | What a score means | Risk scores handed to a human decider |

When base rates genuinely differ between groups, no classifier short of a perfect one satisfies all three at once. That is a theorem, not a tooling gap, so the work is choosing which harm matters in this decision, stating it, and then measuring it.

\`\`\`py
def rates(g):
    return pd.Series({
        'n': len(g),
        'selected': g.pred.mean(),
        'tpr': g.loc[g.y == 1, 'pred'].mean(),
        'fpr': g.loc[g.y == 0, 'pred'].mean(),
    })

audit = scored.groupby('group').apply(rates)
\`\`\`

Read the \`n\` column first. A subgroup of 240 rows at a 6 percent positive rate estimates TPR from about 14 people, so the interval covers most of the unit line and last month's swing was noise. Bootstrap the intervals and print them beside the point estimates, or the audit becomes a monthly ritual of chasing randomness.

Watch for the loop. A collections model flags a postcode, more agents are sent there, more contact produces more recorded defaults, and the next training set confirms the model. Nothing in the offline metrics looks wrong, because the labels are generated by the previous decision.

### Pseudonymised is not anonymised

Swapping names and emails for random ids feels like anonymisation. It is not. Postcode, date of birth, and sex together pin down the large majority of a national population, and the well known re-identification results were built on exactly that combination. Rules that hold up in practice:

- Suppress any published cell with fewer than k units, k commonly 5 or 10, and suppress the complementary cells too, or the missing number is recoverable by subtraction.
- Coarsen before release: year of birth rather than date, region rather than postcode.
- Keep the linkage key out of the analysis extract entirely, so nobody can join back for convenience at 6pm on a Friday.
- Remember that a model trained on rare rows can memorise them and leak them through its outputs.

### The memo you sign

A causal recommendation is a claim about the future built on assumptions. Put them where a reader can attack them.

\`\`\`md
Decision: extend the free trial from 14 to 21 days for new SMB signups.
Estimand: ATT on 90 day paid conversion, SMB segment.
Evidence: DiD across 6 markets, +2.3pp (95% CI 0.6 to 4.0), clustered by market.
Weakest assumption: parallel trends. Event study flat for 5 pre-periods, placebo date null.
Would change this: a pre-trend above 1pp, or the Q3 fee test moving revenue per trial.
Reversal: single flag, one release, full rollback inside 24 hours.
\`\`\`

Six lines, and a reviewer can find the weak point in under a minute. That is the point. The alternative, a deck with a p-value and an arrow pointing up, hides the assumption inside the claim and still puts your name on the outcome.
      `,
        [
          q('You removed the gender field from a screening model and the selection rate gap barely moved. What is the most likely reason?', [
            'The model was already calibrated within each group',
            'The gap is now driven by random noise in a small subgroup',
            'Removing a feature always requires retraining from scratch',
            'Other features carry the same information, so the model rebuilds it',
          ], 3, 'Postcode, school, and activity features correlate with the attribute you removed, so dropping one column removes the label rather than the signal it carried.'),
          q('Why can a classifier not satisfy demographic parity, equalised odds, and calibration at the same time?', [
            'The three metrics are estimated on different denominators',
            'When base rates differ across groups, the definitions are mathematically incompatible',
            'Calibration is only defined for regression, never for classification',
            'Equalised odds needs the protected attribute available at scoring time',
          ], 1, 'Unless the groups share an identical base rate or the classifier is perfect, satisfying any two of those criteria forces the third to fail, so the choice between them is a judgement about harm.'),
          q('A released extract replaces names and emails with random ids but keeps postcode, date of birth, and sex. What is it?', [
            'Anonymised, since no direct identifier remains in the file',
            'Safe to publish once the random id column is dropped too',
            'Pseudonymised, and re-identifiable for most people in it',
            'Compliant with k-anonymity at k equal to the postcode count',
          ], 2, 'The combination of postcode, birth date, and sex is close to unique for most of a population, so swapping out direct identifiers hides the name but not the person behind the row.'),
        ]
      ),
      ],
      [
      q('A model predicts churn with high accuracy. Which claim does that accuracy NOT support?', [
        'That contacting the flagged customers will reduce their churn',
        'That the flagged customers carry elevated risk right now',
        'That churn is concentrated in a small share of the base',
        'That the flagged group is worth investigating further',
      ], 0, 'Accuracy describes what happens under current behaviour, whereas the effect of contacting someone needs a comparison between treated and untreated versions of the same customers.'),
      q('Which change most directly reduces the number of users an experiment needs?', [
        'Adding two more secondary metrics to the readout',
        'Running a sample ratio mismatch check on the split',
        'Extending the run from two weeks out to four weeks',
        'Adjusting the metric with each user\'s pre-period value',
      ], 3, 'Variance reduction with a pre-period covariate lowers the noise in the metric, so the same power arrives with fewer users, while the other options leave the variance exactly where it was.'),
      q('A difference-in-differences design fails a placebo test on a fake pre-treatment date. What does that tell you?', [
        'The true effect is smaller than reported but still positive',
        'The control group needs to be larger before you refit it',
        'The groups were already diverging, so the estimate is not credible',
        'The outcome should be logged before the model is refitted',
      ], 2, 'A placebo period should produce no effect, so an effect there means something other than the treatment separates the groups over time and the design cannot isolate the policy.'),
      q('What belongs in the memo you sign beside a causal recommendation?', [
        'The full model code and the hyperparameter grid used',
        'The weakest assumption and what evidence would change the call',
        'A ranked list of every metric that moved in the period',
        'The prediction accuracy of the model on the holdout',
      ], 1, 'A causal claim rests on assumptions rather than arithmetic, so naming the shakiest one and the finding that would reverse the decision is what makes the recommendation reviewable.'),
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
      q('Four ingestion runs failed, and the daily series was built with resample(\'D\').sum(), so those days read 0.0. A boosted forecaster then beats seasonal naive on MAE across eight rolling origins. Why is that still not evidence the model is better?', [
      'MAE is the wrong metric for daily demand, so the comparison has to be rerun using MAPE instead',
      'Eight rolling origins are far too few folds, so any gap between the two scores is inside the noise',
      'Some evaluation days hold a fabricated zero, so part of the score measures who predicts outages',
      'Seasonal naive cannot be scored on a resampled grid, because shift(7) needs the irregular index',
    ], 2, 'Empty bins were filled with 0.0 rather than NaN, so those days are not observed demand at all, and both the model and the baseline are being graded partly on whether they can guess when the pipeline broke.'),
    q('A model target encodes postcode and imputes medians, both fitted on the full table before splitting, and reports 0.93 AUC under KFold. Rebuilt as a Pipeline and scored with GroupKFold on customer_id it returns 0.86. What is the honest reading?', [
      '0.86 is the estimate, since the first run leaked label means and reused customers across the split',
      '0.93 is the estimate, since GroupKFold trains on fewer rows per fold and so understates the model',
      'Both numbers are wrong, because a target encoder has to be refitted on each test fold before scoring',
      'The gap comes from the median imputer alone, so refitting only that step recovers the higher score',
    ], 0, 'Fitting the encoder and the imputer on every row pipes label information and test-row statistics into training, and a plain KFold also puts the same customer on both sides of the split, so the grouped pipeline number is the one that reflects production.'),
    q('A 60 trial random search picks the pipeline with the best mean cross-validated average precision, and the cost-minimising threshold is then chosen on those same folds. On the untouched test set both the average precision and the expected cost come out worse. What happened?', [
      'Average precision is unstable by nature, so ROC AUC should have been the criterion in both steps',
      'The threshold moved because the test set carries a different positive base rate from the folds',
      'The pipeline overfitted the training rows, so widening the l2_regularization range would fix it',
      'The winner and its threshold were both selected on the same fold noise, so both are flattered',
    ], 3, 'Taking the maximum of 60 noisy fold estimates is optimistic by construction, and tuning the threshold on those same folds spends them a second time, so only data that no selection step ever saw gives an honest figure.'),
    q('An upstream job swaps two warehouse columns. The scoring code passes X.to_numpy() into the fitted pipeline, and drift monitoring computes PSI per feature from the warehouse table. Why does no alert fire?', [
      'PSI needs several weeks of scored rows before it can react to a change of this particular kind',
      'The array skips the feature name check, and PSI still sees each column\'s own distribution intact',
      'PSI compares output scores rather than inputs, so swapping two input columns cannot ever move it',
      'The fitted pipeline reorders incoming columns by name, so the scores it returned never changed',
    ], 1, 'A DataFrame is validated against feature_names_in_ while a NumPy array is only checked for width, and PSI is computed per column upstream of the swap, so every monitored distribution looks unchanged while the model reads tenure where spend belongs.'),
    q('Only 8 percent of users ever reach a redesigned screen. The test was sized for a 3 percent lift across all randomised users, ran three weeks, and returned plus 0.4 percent with a confidence interval of minus 1.9 to plus 2.7. What is the most useful change for the rerun?', [
      'Log the trigger event and power the analysis on the population that actually sees the screen',
      'Watch the result daily and stop the test as soon as the p-value first drops below 0.05',
      'Randomise by session rather than by user, which multiplies the number of available units',
      'Report the secondary metrics beside it so the direction of the effect is still usable',
    ], 0, 'Spreading a real effect across the 92 percent of users who never saw the change dilutes it about twelvefold, so defining and powering the analysis on the triggered population, decided before launch, is what makes the test capable of settling the question.'),
    q('Six countries received a pricing change on four different dates across five months. Each country\'s own before-and-after gap is positive, yet a two-way fixed effects regression of log revenue on treated times post, clustered by country, returns a negative coefficient. What is the likeliest cause?', [
      'Clustering on only six units widens the standard error so far that the sign of the estimate is arbitrary',
      'Parallel trends fails, because revenue in the treated countries was already falling before any change',
      'Countries treated early serve as controls for later ones, and a growing effect flips the comparison',
      'The month fixed effects absorb the treatment, since every country changed inside the same window',
    ], 2, 'With staggered start dates a two way fixed effects estimator makes some of its comparisons against units that are already treated, so an effect that grows over time gets subtracted as a rising treated trend and the coefficient can turn negative even though every country improved.'),
  ],
});
