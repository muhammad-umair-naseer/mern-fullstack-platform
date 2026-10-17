---
title: "Python output questions: 10 tricky snippets, answered"
description: 10 tricky Python output questions on mutable defaults, closures, rounding, finally and dict keys. Every answer was checked by running it on CPython 3.12.
author: Abdullah
date: 2026-10-03
tags: [games, python, interviews]
targetQuery: python output questions
image: /blog/covers/python-output-questions.webp
imageAlt: "A laptop on a wooden desk showing Python code beside a row of potted plants"
---

Python output questions give you a short program and ask you to **guess the output**. They look easy because Python reads almost like English, and that is exactly why they catch people out. A few of the language's rules surprise even experienced developers.

Here are 10 tricky Python output questions with answers and clear explanations. A lot of the "guess the output" sheets passed around online contain mistakes. Every output below was produced by running the snippet on CPython 3.12, as part of the puzzle bank for our multiplayer game [Gotcha Rush](/games/gotcha-rush).

## How to use these questions

Cover the output, read the code, and write down exactly what you think Python prints, including brackets, quotes and spacing. Then check. Half right is still wrong: `[1, 2]` and `[1]` are different answers. Keep a count and read the explanation for every miss.

| Concept | Code Pattern | Expected Output | Python Under-the-Hood Behavior |
| --- | --- | --- | --- |
| **Mutable Default** | `def f(x, acc=[]):` | Accumulates across calls | Default argument evaluated once at function definition time |
| **Finally Override** | `try: return 1 finally: return 2` | `2` | `finally` block always executes before function returns |
| **Late Binding** | `[lambda: i for i in range(3)]` | `[2, 2, 2]` | Closures look up variables at call time, not definition |
| **Identity vs Value** | `256 is 256` vs `[1] is [1]` | `True` vs `False` | Small integer caching vs distinct mutable object allocations |
| **Dict Key Deduplication** | `{1: 'a', 1.0: 'b', True: 'c'}` | `{1: 'c'}` | `1 == 1.0 == True` and equal hashes share dictionary bucket |
| **In-place List Extension** | `a += [2]` vs `a = a + [2]` | Mutates `a` and aliases | `+=` calls `__iadd__` in-place; `+` creates fresh list object |
| **Banker's Rounding** | `round(2.5)` vs `round(3.5)` | `2` and `4` | Rounds to nearest even number to prevent statistical drift |



![Architectural Blueprint and Learning Stages for Python output questions: 10 tricky snippets, answered — Cortexis Roadmap Diagram](/blog/diagrams/python-output-questions-architecture.webp)
*Figure 1: Complete step-by-step architectural workflow and technical execution stages for Python output questions: 10 tricky snippets, answered.*

## Functions and default arguments

### 1. The mutable default

```python
def f(x, acc=[]):
    acc.append(x)
    return acc

print(f(1))
print(f(2))
print(f(3, []))
```

**Output:**

```
[1]
[1, 2]
[3]
```

**Why:** default values are created once, when the function is defined, not each time it is called. Every call that leaves out `acc` shares the same list, so it keeps growing. The third call passes a fresh list and is not affected. The fix is `acc=None` and then `acc = [] if acc is None else acc`. The [official Python FAQ](https://docs.python.org/3/faq/programming.html#why-are-default-values-shared-between-objects) explains this one in detail.

### 2. finally always runs

```python
def f():
    try:
        return 1
    finally:
        return 2

def g():
    try:
        raise ValueError
    except ValueError:
        return "e"
    finally:
        print("f")

print(f())
print(g())
```

**Output:**

```
2
f
e
```

**Why:** a `return` inside `finally` replaces the `return` from `try`, so `f()` gives 2. In `g()` the `except` block's return value is kept, but `finally` still runs before the function actually returns, so `f` prints before `e`.

## Closures and scope

### 3. Late binding

```python
fs = [lambda: i for i in range(3)]
print([f() for f in fs])
gs = [lambda i=i: i for i in range(3)]
print([g() for g in gs])
```

**Output:**

```
[2, 2, 2]
[0, 1, 2]
```

**Why:** a closure looks up `i` when it is called, not when it is created, in accordance with the [Python Execution Model for scopes and binding](https://docs.python.org/3/reference/executionmodel.html#binding-of-names). By the time the lambdas run, the loop has finished and `i` is 2. Writing `i=i` as a default argument captures the value at the moment each lambda is defined.

## Identity and equality

### 4. is versus ==

```python
a = 256
b = 256
print(a is b)
c = [1]
d = [1]
print(c == d, c is d)
```

**Output:**

```
True
True False
```

**Why:** `==` compares values and `is` compares identity, meaning whether two names point at the very same object. CPython keeps small integers cached, so both names refer to one `256` object. The two lists have equal values but are two separate objects. Use `is` only for `None`, `True` and `False`.

### 5. Three keys, one slot

```python
print(1 == 1.0, hash(1) == hash(1.0), {1: "a", 1.0: "b", True: "c"})
```

**Output:**

```
True True {1: 'c'}
```

**Why:** `1`, `1.0` and `True` are all equal and have the same hash, so a dictionary treats them as one key. The first key written, `1`, keeps its spelling. Each later write only replaces the value, which ends up as `'c'`.

## Lists and tuples

### 6. += on a list

```python
a = [1]
b = a
a += [2]
print(a is b)
a = a + [3]
print(a is b, b)
```

**Output:**

```
True
False [1, 2]
```

**Why:** `a += [2]` changes the existing list in place, so `b`, which is the same object, sees the change. `a = a + [3]` builds a brand new list and points `a` at it, leaving `b` behind at `[1, 2]`.

### 7. The tuple that changed anyway

```python
t = (1, [2])
try:
    t[1] += [3]
except TypeError:
    print("error")
print(t)
```

**Output:**

```
error
(1, [2, 3])
```

**Why:** `t[1] += [3]` does two things. First it extends the list inside the tuple, which works. Then it tries to store the result back into the tuple, which raises `TypeError` because tuples cannot be assigned to. So the error prints, and the list has still grown. This is one of the hardest questions in our bank.

## Numbers

### 8. Banker's rounding

```python
print(round(0.5), round(1.5), round(2.5), round(2.675, 2))
```

**Output:**

```
0 2 2 2.67
```

**Why:** Python's `round()` sends exact halves to the nearest even number, so 0.5 becomes 0, 1.5 becomes 2 and 2.5 also becomes 2. `round(2.675, 2)` gives 2.67 because 2.675 is stored in binary as a number very slightly below it. See [round()](https://docs.python.org/3/library/functions.html#round) in the Python docs.

## Loops and generators

### 9. for ... else

```python
for i in range(3):
    if i == 5:
        break
else:
    print("no break")

for i in range(3):
    if i == 1:
        break
else:
    print("broke")
```

**Output:**

```
no break
```

**Why:** the `else` on a loop runs only when the loop finishes without hitting `break`. The first loop never breaks, so `no break` prints. The second breaks at `i == 1`, so its `else` is skipped and nothing else prints. Many people expect `broke` here because of the name.

### 10. Used up

```python
g = (x * x for x in range(3))
print(sum(g), sum(g), list(g))
```

**Output:**

```
5 0 []
```

**Why:** a generator can only be consumed once. The first `sum` drains it (0 + 1 + 4 = 5), so the second `sum` sees nothing and gives 0, and `list` gets an empty result. If you need the values twice, store them in a list first.

## How did you score?

- **9 or 10:** excellent. You know Python's object model and scoping rules well.
- **6 to 8:** good. Go back over mutability (questions 1, 6 and 7), which is where most real bugs come from.
- **5 or fewer:** normal for questions this tricky. Working through our free [Python development course](/learn/python-development) will fill in the gaps, and the [data science with Python course](/learn/data-science-python) puts the same rules to work on real data.

## Practise them against other people

These 10 come from a bank of 42 verified Python puzzles in [Gotcha Rush](/games/gotcha-rush). In the game you type the exact output against a clock while up to four other players do the same, then the real output prints line by line against yours, with the explanation underneath. Solo Rush mode gives you three lives and a timer that keeps shrinking.

Prefer JavaScript? Try our [10 tricky JavaScript output questions](/blog/javascript-output-questions). For more ways to practise, see our [free coding games](/games).

## Frequently Asked Questions (FAQ)

### What are Python output questions?
They are short Python programs where you must predict exactly what `print` shows. They test whether you understand how Python really works: mutability, scope, closures, exceptions, rounding and iteration.

### Are guess the output questions asked in Python interviews?
Yes. They are common in written tests, campus placement rounds and technical interviews, often around mutable default arguments, `is` versus `==`, list copying and generators. Explaining the reason clearly counts as much as the answer.

### Why does round(2.5) give 2 in Python?
Python 3 rounds exact halves to the nearest even number, a method often called banker's rounding. It avoids pushing totals upward when many values are rounded, so `round(2.5)` is 2 and `round(3.5)` is 4.

### Why are mutable default arguments dangerous in Python?
The default object is created once when the function is defined and then shared between calls. If the function changes it, the change carries into the next call. Use `None` as the default and create a new object inside the function.
