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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
});
