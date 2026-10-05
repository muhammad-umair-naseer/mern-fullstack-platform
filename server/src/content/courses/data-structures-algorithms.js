import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'data-structures-algorithms',
  title: 'Data Structures & Algorithms',
  category: 'CS Core',
  level: 'Beginner → Advanced',
  duration: '8 weeks',
  accent: 'amber',
  coverKey: 'data-structures-algorithms',
  summary:
    'Learn to pick the right data structure and prove your solution is fast, so hard problems become routine instead of intimidating.',
  description:
    'You implement every structure by hand in JavaScript — hash maps, linked lists, stacks, trees, graphs — and analyse the cost of each operation as you go. Then you apply the patterns that solve most interview and production problems: two pointers, sliding windows, traversal, recursion, and dynamic programming.',
  chapters: [
    chapter(
      'Complexity and Core Containers',
      'How to measure the cost of code, and the two structures you will reach for in almost every problem.',
      [
        lesson('Big-O: Counting the Work That Matters', 13, `
Every algorithm question eventually reduces to one number: how fast does the work grow as the input grows? **Big-O** is the notation for that answer, and it is deliberately crude — it discards everything that does not change the shape of the curve.

### Count operations, not milliseconds

\`\`\`js
function sum(nums) {
  let total = 0;            // 1 operation
  for (const n of nums) {   // runs n times
    total += n;             // 1 operation per iteration
  }
  return total;             // 1 operation
}
\`\`\`

The work is about \`n + 2\`. Big-O throws away the \`+ 2\` and calls this **O(n)** — linear. Two rules produce every answer you will ever write:

1. **Drop constants.** \`O(3n)\` is \`O(n)\`. A loop that does three things per item still scales linearly.
2. **Drop lower-order terms.** \`O(n² + n)\` is \`O(n²)\`. At n = 1,000,000 the quadratic term is a million times larger; the rest is noise.

### The classes worth memorising

| Big-O | Name | Steps at n = 1,000,000 |
|---|---|---|
| O(1) | constant | 1 |
| O(log n) | logarithmic | ~20 |
| O(n) | linear | 1,000,000 |
| O(n log n) | linearithmic | ~20,000,000 |
| O(n²) | quadratic | 1,000,000,000,000 |
| O(2ⁿ) | exponential | not finishing today |

The jump from O(n log n) to O(n²) is where code stops being usable. A quadratic algorithm on a million items is roughly 50,000 times slower than a linearithmic one — the difference between a page load and an outage.

### Reading complexity off the code

\`\`\`js
for (const a of arr) { }        // O(n)
for (const a of arr) { }
for (const b of other) { }      // O(n + m) — sequential loops add

for (const a of arr) {
  for (const b of arr) { }      // O(n²) — nested loops multiply
}

let i = n;
while (i > 1) { i = Math.floor(i / 2); }   // O(log n) — the input halves
\`\`\`

Halving is the signature of a logarithm. Binary search, balanced trees, and merge sort all get their \`log n\` from exactly this.

### The most common accidental quadratic

\`\`\`js
// Reads like one loop. Is actually O(n * m).
const missing = a.filter(x => !b.includes(x));
\`\`\`

\`includes\` scans \`b\` from the start every single time, so the inner scan is hidden inside a method call. Two 10,000-item arrays means 100 million comparisons. The fix costs one line:

\`\`\`js
const seen = new Set(b);                       // O(m) once
const missing = a.filter(x => !seen.has(x));   // O(n) total → O(n + m)
\`\`\`

This is the single most common performance bug in real codebases: a linear-time lookup hiding inside a loop. Whenever you see \`includes\`, \`indexOf\`, or \`find\` inside a loop, you are probably quadratic.

### Best, average, and worst case

Big-O usually means the **worst case**, because that is what breaks in production. Quicksort averages O(n log n) but degrades to O(n²) on already-sorted input with a naive pivot — and "already sorted" is not a rare input, it is the input you get after someone adds an \`ORDER BY\`.

### Amortised cost

\`arr.push(x)\` is O(1) *amortised*. Occasionally the array is full and the runtime allocates a bigger buffer and copies everything, which is O(n). But that doubling happens rarely enough that the average over many pushes is constant. Amortised means "cheap on average across a sequence", not "always cheap".

### Space counts too

\`\`\`js
const doubled = nums.map(n => n * 2);   // O(n) extra space
nums.forEach((n, i) => { nums[i] = n * 2; });  // O(1) extra space
\`\`\`

Recursion is the sneaky one: each pending call holds a stack frame, so a recursion \`n\` levels deep costs O(n) space even if the function itself allocates nothing.
        `,
        [
          q('A loop repeatedly does i = Math.floor(i / 2) until i reaches 1. What is its complexity?', [
            'O(1)',
            'O(log n)',
            'O(n)',
            'O(n log n)',
          ], 1, 'Halving the remaining work on every step is the signature of a logarithm — about 20 steps for a million.'),
          q('What does it mean that arr.push(x) is O(1) amortised?', [
            'Every push copies the array, but copying happens to be cheap',
            'Push is O(1) unless the array holds objects',
            'Occasional pushes reallocate and copy, but the cost averaged over a long run of pushes is constant',
            'Push is O(1) only while the array fits in the CPU cache',
          ], 2, 'Amortised means cheap on average across a sequence of operations, not cheap on every individual one.'),
          q('A recursive function that allocates nothing but recurses n levels deep uses how much extra space?', [
            'O(n), because every pending call holds a stack frame',
            'O(1), because nothing is allocated',
            'O(log n)',
            'O(n squared)',
          ], 0, 'Each unfinished call keeps its arguments and locals alive on the call stack until it returns.'),
        ]),
        lesson('Arrays and Strings in JavaScript', 12, `
A JavaScript array is a **dynamic array**: a contiguous block of memory with a length, which the engine grows by reallocating when it fills up. That single implementation detail explains every cost in the table below.

### What each operation actually costs

| Operation | Cost | Why |
|---|---|---|
| \`arr[i]\` | O(1) | Address arithmetic — position is computable |
| \`arr.push(x)\` | O(1) amortised | Write at the end; occasionally reallocate |
| \`arr.pop()\` | O(1) | Drop the last slot |
| \`arr.shift()\` | **O(n)** | Every remaining element shifts left one slot |
| \`arr.unshift(x)\` | **O(n)** | Every element shifts right one slot |
| \`arr.splice(i, …)\` | O(n) | Everything after \`i\` moves |
| \`arr.includes(x)\` | O(n) | Linear scan |
| \`arr.slice(a, b)\` | O(b − a) | Copies the range |

The two bolded rows cause more slow code than anything else in this chapter. This loop looks harmless and is quadratic:

\`\`\`js
// O(n²): every shift() moves the whole remaining array
while (queue.length) {
  const job = queue.shift();
  process(job);
}
\`\`\`

Use an index instead of mutating the front — we build a proper O(1) queue in Chapter 3:

\`\`\`js
let head = 0;
while (head < queue.length) {
  const job = queue[head++];   // O(1), nothing moves
  process(job);
}
\`\`\`

### Creating grids without sharing bugs

\`\`\`js
// BROKEN — all three rows are THE SAME array
const shared = new Array(3).fill([]);
shared[0].push('x');
console.log(shared[1]);   // ['x'] — surprise

// Correct — the factory runs once per row
const grid = Array.from({ length: 3 }, () => new Array(4).fill(0));
grid[0][0] = 'x';
console.log(grid[1][0]);  // 0 — the rows are independent
\`\`\`

\`fill\` copies a *reference*, not the object. This bites everyone exactly once, usually while building a DP table (Chapter 5), where it silently corrupts every row at the same time.

### Strings are immutable

You cannot change a character in place. \`s[0] = 'X'\` fails silently in non-strict mode and throws in strict mode. Every "modification" builds a new string.

\`\`\`js
// Conceptually O(n²): each += must copy the accumulated result
let out = '';
for (const ch of chars) out += ch;

// O(n): build an array, join once
const parts = [];
for (const ch of chars) parts.push(ch);
const joined = parts.join('');
\`\`\`

Modern engines optimise simple \`+=\` chains with an internal rope representation, so the naive version is often fine in practice — but \`join\` is predictable, and predictable beats "usually optimised" when the input might be a 10 MB file.

### The string toolkit

\`\`\`js
s.split('');         // → array of characters (use [...s] for emoji safety)
s.slice(2, 5);       // substring, negative indices allowed
s.charCodeAt(0);     // 'a' → 97, useful for O(1) alphabet indexing
s.repeat(3);
[...s].reverse().join('');   // reverse a string
\`\`\`

The semicolon after \`repeat(3)\` is load-bearing. A line beginning with \`[\` continues the previous expression, so without it the engine reads \`s.repeat(3)[...s]\` and refuses to parse the file at all. A leading \`(\` does the same thing.

For letter-frequency work, a 26-slot array beats a hash map:

\`\`\`js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Array(26).fill(0);
  const base = 'a'.charCodeAt(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - base]++;
    counts[b.charCodeAt(i) - base]--;   // one pass, both strings
  }
  return counts.every(c => c === 0);
}
\`\`\`

That is O(n) time and O(1) space — the array size never grows with the input, so 26 slots is a constant.

### In-place edits with a write pointer

When a problem says "modify the array in place", keep a slower **write** index behind the **read** index:

\`\`\`js
function removeValue(nums, target) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== target) nums[write++] = nums[read];
  }
  return write;   // first \`write\` items are the survivors
}
\`\`\`

O(n) time, O(1) space, no \`splice\` in sight. This is the first two-pointer pattern, and Chapter 2 generalises it.
        `,
        [
          q('Why is draining a work list with while (queue.length) { queue.shift(); } quadratic?', [
            'shift copies the whole array before removing anything',
            'Each shift moves every remaining element one slot to the left',
            'length is recomputed on every iteration',
            'shift is O(log n) and the loop runs n times',
          ], 1, 'Removing the front of a contiguous array forces every later element down one index, so n removals cost about n squared over two moves.'),
          q('const s = \'hello\'; s[0] = \'H\'; — what happens in strict mode?', [
            's becomes \'Hello\'',
            'A new string is returned and assigned',
            'It throws, because a string cannot be modified in place',
            'The assignment is ignored and s stays \'hello\'',
          ], 2, 'Strings are immutable, and strict mode turns the sloppy-mode silent no-op into a TypeError.'),
          q('Counting letters with new Array(26).fill(0) and charCodeAt is described as O(1) space. Why?', [
            'The array is allocated on the stack',
            'fill(0) does not allocate',
            'Because it is faster than a Map',
            'The 26 slots never grow with the input, so the extra space is constant',
          ], 3, 'Space complexity asks how memory grows with n, and a fixed 26 slots does not grow at all.'),
        ]),
        lesson('Hash Maps and Sets: Trading Space for Time', 14, `
A hash map turns "search for it" into "compute where it is". That trade — extra memory for constant-time lookup — resolves more algorithm problems than any other single idea.

### How the constant time happens

A hash function converts a key into an integer, which becomes an index into an internal bucket array:

\`\`\`
"email" → hash → 8347215 → % 16 → bucket 7
\`\`\`

Reading a key means hashing it and going straight to the bucket: no scan. Two keys can land in the same bucket — a **collision** — and the implementation stores a small list there. With a decent hash function collisions are rare, so lookups are **O(1) average, O(n) worst case**. In practice you assume O(1) and note the worst case when the keys are adversarial.

### Map, not object

\`\`\`js
const counts = new Map();
counts.set('react', 3);
counts.get('react');       // 3
counts.has('react');       // true
counts.delete('react');
counts.size;               // 0
\`\`\`

Prefer \`Map\` over a plain object for lookup tables:

| | \`Map\` | \`{}\` |
|---|---|---|
| Key types | anything, including objects | strings and symbols only |
| Size | \`.size\` in O(1) | \`Object.keys(o).length\` in O(n) |
| Iteration order | insertion order, always | integer-like keys jump to the front |
| Inherited keys | none | \`toString\`, \`constructor\`… are present |

That last row is a real bug source. \`if (obj[key])\` is truthy for \`key = 'constructor'\` on a plain object, so a word-frequency counter built on \`{}\` reports phantom entries. \`Map\` has no prototype keys.

Also note that object keys are coerced to strings, so \`o[1]\` and \`o['1']\` are the same slot — while \`map.get(1)\` and \`map.get('1')\` are not.

### Counting: the workhorse pattern

\`\`\`js
function frequency(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return counts;
}
\`\`\`

Use \`??\` and not \`||\` here. \`??\` falls back only on \`null\` and \`undefined\`; \`||\` also falls back on \`0\`, \`''\`, and \`false\`. A counter that only ever goes up survives either operator, but the moment you also *decrement* — as the sliding-window lesson in Chapter 2 does — a legitimately stored \`0\` gets silently replaced by the default and the tally drifts.

### Complements: turning O(n²) into O(n)

The brute force for "find two numbers that sum to target" is a double loop. The hash map version asks a different question — *have I already seen the number I need?*

\`\`\`js
function twoSum(nums, target) {
  const seen = new Map();               // value → index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);               // set AFTER checking
  }
  return null;
}
\`\`\`

Setting before checking is the classic bug: with \`target = 6\` and \`nums = [3, 5]\`, the element would match itself and return \`[0, 0]\`.

### Grouping by a derived key

\`\`\`js
function groupAnagrams(words) {
  const groups = new Map();
  for (const word of words) {
    const key = [...word].sort().join('');   // 'eat' and 'tea' → 'aet'
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}
\`\`\`

The trick is always the same: **invent a key that is identical for things that belong together.** Sorted letters for anagrams, \`row + ',' + col\` for grid cells, a normalised email for duplicate accounts.

Note that map keys compare by reference for objects, so \`map.set([1,2], 'a')\` can never be retrieved with a fresh \`[1,2]\`. Serialise composite keys to a string.

### Sets: membership without values

\`\`\`js
const seen = new Set(list);
seen.has(x);               // O(1) instead of list.includes(x)'s O(n)
const unique = [...new Set(list)];   // dedupe in one line
\`\`\`

### When a hash map is the wrong answer

It costs memory proportional to the number of keys, it gives you **no ordering**, and it cannot answer range queries ("all users aged 20–30"). For sorted access or range work you want a sorted array with binary search (Chapter 2) or a tree (Chapter 4).
        `,
        [
          q('In twoSum, why is seen.set(nums[i], i) placed after the seen.has(need) check?', [
            'To keep the map smaller',
            'Otherwise an element whose double equals the target matches itself and returns one index twice',
            'Because set invalidates a pending has',
            'To preserve insertion order',
          ], 1, 'Storing first lets nums[i] act as its own complement, so target 6 with a 3 at index 0 returns [0, 0].'),
          q('Why use (counts.get(item) ?? 0) rather than (counts.get(item) || 0) in a tally that can also decrement?', [
            '?? is faster than ||',
            '|| does not work on values read from a Map',
            '?? falls back only on null and undefined, so a legitimately stored 0 survives',
            'They behave identically here',
          ], 2, 'A stored 0 is falsy, so || replaces it with the default and the count silently drifts once values go down.'),
          q('map.set([1, 2], \'a\') then map.get([1, 2]) returns undefined. Why?', [
            'Object keys compare by reference, and the second array is a different object',
            'Arrays cannot be used as Map keys',
            'Map converts array keys to strings',
            'get requires the keys to be looked up in insertion order',
          ], 0, 'Two arrays with equal contents are still two distinct references, which is why composite keys must be serialised to a string.'),
        ]),
        lesson('References, Copies, and Aliasing', 13, `
Primitives are copied. Objects, arrays, Maps and Sets are shared. Every aliasing bug in this course starts at that one sentence, and every fix is a copy of the right depth at the right price.

### Two names, one object

\`\`\`js
let a = 5;
let b = a;
b++;                  // a is still 5 — the value was copied

const xs = [1, 2, 3];
const ys = xs;
ys.push(4);
console.log(xs);      // [1, 2, 3, 4] — one array, two names
\`\`\`

\`const\` does not help here. It freezes the *binding*, not the contents: you may not reassign \`xs\`, and you may mutate what it points at all day.

### The function-boundary bug

\`\`\`js
function median(nums) {
  nums.sort((a, b) => a - b);        // mutates the CALLER'S array
  return nums[nums.length >> 1];
}

const scores = [9, 1, 5];
median(scores);
console.log(scores);   // [1, 5, 9] — nobody asked for this
\`\`\`

\`sort\`, \`reverse\`, \`splice\`, \`push\` and \`fill\` all mutate in place. Either copy on the way in — \`const sorted = [...nums].sort(cmp)\` — or say loudly in the name that the function mutates. Silently reordering an argument produces a failure three files away from the cause.

### Shallow copies and what they miss

| Technique | Depth | Cost | Notes |
|---|---|---|---|
| \`[...arr]\`, \`arr.slice()\` | one level | O(n) | new array, same element references |
| \`{ ...obj }\`, \`Object.assign({}, obj)\` | one level | O(keys) | prototype and getters are not carried over |
| \`structuredClone(obj)\` | full | O(total nodes) | handles Map, Set, Date, and cycles |
| \`JSON.parse(JSON.stringify(obj))\` | full | O(total nodes) | lossy — see below |

A shallow copy is exactly one level deep, which is what catches people with nested data:

\`\`\`js
const grid = [[0, 0], [0, 0]];
const copy = [...grid];     // new outer array, the SAME two row arrays
copy[0][0] = 9;
console.log(grid[0][0]);    // 9 — the rows were never copied

const real = grid.map(row => [...row]);   // copy each row too
\`\`\`

### What JSON round-tripping throws away

\`\`\`js
const state = { when: new Date(), tags: new Set(['a']), note: undefined, id: 7 };

JSON.parse(JSON.stringify(state));
// { when: '2026-01-01T00:00:00.000Z', tags: {}, id: 7 }
//   Date became a string, Set became an empty object, the undefined key vanished

structuredClone(state);     // Date, Set and cycles all survive
\`\`\`

\`JSON.parse(JSON.stringify(x))\` also throws on a circular reference and drops functions without a word. \`structuredClone\` is the default deep copy in modern Node: it refuses functions loudly and class instances come back as plain objects, but nothing is silently corrupted.

### Copying is not free

\`\`\`js
// O(n²): every iteration copies the whole accumulated array
let items = [];
for (const row of rows) items = [...items, transform(row)];

// O(n): mutate the local array you own, copy once at the boundary
const out = [];
for (const row of rows) out.push(transform(row));
\`\`\`

This is the string-concatenation trap wearing an immutable-update costume. Spreading inside a loop over 10,000 rows performs about 50 million element copies. Immutability is a discipline for values that cross a boundary, not a reason to reallocate inside a loop you control.

### Equality follows the same rule

\`\`\`js
[1, 2] === [1, 2];           // false — two different objects
const key = [1, 2];
new Set([key, key]).size;    // 1 — same reference, so it dedupes
\`\`\`

Comparing structures therefore means comparing content: \`a.length === b.length && a.every((v, i) => v === b[i])\` for flat arrays, or a canonical string for small objects with a stable key order.

### Freeze is shallow too

\`Object.freeze(config)\` blocks writes to \`config.port\` and does nothing whatsoever about \`config.db.host\`. Freezing deeply means walking the object yourself. In practice: freeze the small config objects that must never change, and copy defensively at every boundary — handing a caller your internal array is the \`median\` bug again, aimed at your own state.
        `,
        [
          q('const copy = [...grid], where grid is an array of rows. What does copy[0][0] = 9 do?', [
            'Throws, because a shallow copy is read-only',
            'Changes only copy',
            'Changes grid[0][0] as well, because the row arrays themselves were never copied',
            'Creates a new row inside copy',
          ], 2, 'Spreading copies one level, so the outer array is new while every element is still the original reference.'),
          q('What does JSON.parse(JSON.stringify(x)) do to a Date and a Set inside x?', [
            'The Date becomes a string and the Set becomes an empty object',
            'Both survive unchanged',
            'It throws a TypeError',
            'The Date survives but the Set becomes an array',
          ], 0, 'JSON has no representation for either type, so one is serialised as text and the other loses all its contents.'),
          q('What does building a result with items = [...items, x] inside a loop over n rows cost?', [
            'O(n)',
            'O(n log n)',
            'O(1) amortised, like push',
            'O(n squared), because each iteration copies everything accumulated so far',
          ], 3, 'The spread rebuilds the entire array on every pass, so the total work is the sum 1 + 2 + ... + n.'),
        ]),
      ],
      [
        q('Why is O(n² + n) written as O(n²)?', [
          'The lower-order term becomes insignificant as n grows',
          'Addition is not allowed in Big-O notation',
          'The two terms cancel out',
          'n² and n grow at the same rate',
        ], 0, 'Big-O describes growth for large n, where the dominant term determines the curve and the rest is rounding error.'),
        q('Which loop is secretly O(n²)?', [
          'for (const x of a) total += x;',
          'const s = new Set(b); a.filter(x => !s.has(x));',
          'const missing = a.filter(x => !b.includes(x));',
          'a.forEach((x, i) => { a[i] = x * 2; });',
        ], 2, 'includes performs a full linear scan on every filter callback, so the linear-looking filter hides a nested loop.'),
        q('new Array(3).fill([]) then grid[0].push(1) — what does grid[1] contain?', [
          '[]',
          'undefined',
          'A TypeError is thrown',
          '[1]',
        ], 3, 'fill stores the same array reference in all three slots, so every row is literally the same object.'),
        q('Why prefer Map over a plain object for a word-frequency counter?', [
          'Map is always faster to read',
          'Map has no inherited keys and reports .size in O(1)',
          'Objects cannot store numbers',
          'Map keys are automatically sorted',
        ], 1, 'A plain object inherits keys such as constructor and toString, which produce phantom hits on has-style checks.'),
      ]
    ),
    chapter(
      'Pointer and Window Patterns',
      'Linear-time techniques for ordered data — and the two logarithmic algorithms everything else is built on.',
      [
        lesson('Two Pointers', 13, `
Two pointers replaces a nested loop with a single pass by exploiting structure — usually **sortedness**. Instead of trying every pair, you start from a position where you can reason about which direction to move.

### Opposite ends: converging pointers

Find a pair summing to a target in a **sorted** array:

\`\`\`js
function pairWithSum(sorted, target) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;    // need more: only the left can grow
    else hi--;                 // need less: only the right can shrink
  }
  return null;
}
\`\`\`

O(n) time and O(1) space, versus O(n²) for the double loop. The correctness argument is worth internalising: when \`sum < target\`, no pair using \`sorted[lo]\` can ever work, because \`sorted[hi]\` is already the largest remaining partner. Discarding \`lo\` throws away nothing that could have been an answer. Every two-pointer proof has that shape — *moving this pointer cannot skip a solution.*

Note the requirement: **sorted input**. On unsorted data this returns nonsense, and it is the most common misuse of the pattern. If the input is unsorted and you only need values (not original indices), sort first for O(n log n); if you need original indices, use the hash-map complement from Chapter 1 instead.

### Palindrome check

\`\`\`js
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let lo = 0, hi = clean.length - 1;
  while (lo < hi) {
    if (clean[lo] !== clean[hi]) return false;
    lo++; hi--;
  }
  return true;
}
\`\`\`

The loop is \`lo < hi\`, not \`lo <= hi\`. With \`<=\` an odd-length string compares its middle character to itself — harmless here, wasteful elsewhere, and wrong the moment the comparison is not symmetric.

### Same direction: read and write

The in-place filter from Chapter 1 generalises. Deduplicate a sorted array in place:

\`\`\`js
function dedupeSorted(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write++] = nums[read];
    }
  }
  return write;   // new logical length
}
\`\`\`

\`write\` marks the end of the cleaned region; \`read\` scans ahead. Because \`write <= read\` always, you never overwrite something you have not read yet — that invariant is what makes in-place safe.

### Merging two sorted arrays

\`\`\`js
function merge(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  while (i < a.length) out.push(a[i++]);   // drain the leftovers
  while (j < b.length) out.push(b[j++]);
  return out;
}
\`\`\`

Forgetting the two drain loops is the classic bug — the result is silently short, and only for inputs where one array runs out early. This exact function is the heart of merge sort, three lessons from now.

### Fast and slow pointers

Two pointers moving at different speeds detect cycles and find midpoints:

\`\`\`js
function middleIndex(arr) {
  let slow = 0, fast = 0;
  while (fast + 1 < arr.length) { slow += 1; fast += 2; }
  return slow;   // slow lands on the middle after one pass
}
\`\`\`

On an array this is pointless — you could divide the length. On a **linked list** (Chapter 3) there is no length, and this is the only way to find the middle in one pass.

### Choosing the pattern

| Signal in the problem | Reach for |
|---|---|
| Sorted array, find a pair/triple | Converging pointers |
| Remove/compact in place, O(1) space | Read + write pointers |
| Contiguous subarray or substring | Sliding window (next lesson) |
| Cycle, midpoint, no length available | Fast + slow |
| Unsorted, need original indices | Hash map |

The failure mode to watch for is an infinite loop: every path through the loop body must move at least one pointer. If a branch can leave both unchanged, the function hangs.
        `,
        [
          q('In the converging pair search, when sum < target you move lo. What justifies discarding sorted[lo] permanently?', [
            'It is the smallest value, so it cannot be part of any pair',
            'sorted[hi] is already its largest possible partner, so no pair using sorted[lo] can reach the target',
            'The array is scanned a second time later',
            'Moving hi instead would cause an infinite loop',
          ], 1, 'Pairing lo with the biggest remaining element already falls short, so every other partner is smaller and lo can be dropped for good.'),
          q('Why does dedupeSorted never overwrite an element it has not read yet?', [
            'It copies the array first',
            'Because the array is sorted',
            'Because it iterates backwards',
            'Because write always trails read, so the destination slot has already been consumed',
          ], 3, 'The invariant write <= read is exactly what makes the in-place compaction safe.'),
          q('merge(a, b) ends with two while loops that drain leftovers. What breaks if you delete them?', [
            'The output is sorted but too short whenever one array runs out first',
            'The function loops forever',
            'The output comes back reversed',
            'Nothing — the main loop already copies everything',
          ], 0, 'The main loop stops as soon as either array is exhausted, leaving the tail of the other one uncopied.'),
        ]),
        lesson('Sliding Window', 14, `
A sliding window answers questions about **contiguous** runs — subarrays and substrings — in one pass. The insight is that consecutive windows overlap almost entirely, so recomputing from scratch is wasted work.

### Fixed-size windows

Largest sum of any \`k\` consecutive numbers:

\`\`\`js
// Naive: O(n * k) — recomputes the whole window every step
function maxSumSlow(nums, k) {
  let best = -Infinity;
  for (let i = 0; i + k <= nums.length; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += nums[j];
    best = Math.max(best, sum);
  }
  return best;
}

// Sliding: O(n) — add the entrant, subtract the leaver
function maxSum(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];   // first window
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];               // slide by one
    best = Math.max(best, sum);
  }
  return best;
}
\`\`\`

Every window shares \`k − 1\` elements with the previous one. Two arithmetic operations replace \`k\` of them. That is the whole pattern.

### Variable-size windows: the template

Most real problems have a condition instead of a size. The shape is always identical:

\`\`\`js
let left = 0;
for (let right = 0; right < n; right++) {
  add(nums[right]);                    // grow the window
  while (windowIsInvalid()) {
    remove(nums[left]);                // shrink from the left
    left++;
  }
  best = Math.max(best, right - left + 1);   // window is valid here
}
\`\`\`

\`right\` only ever moves forward and \`left\` only ever moves forward, so despite the nested \`while\`, each index is added once and removed once: **O(n) total**, not O(n²). Being able to explain that is what separates knowing the pattern from reciting it.

### Longest substring without repeating characters

\`\`\`js
function longestUnique(s) {
  const lastSeen = new Map();   // char → most recent index
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;   // jump past the earlier copy
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
\`\`\`

The \`>= left\` guard is the bug everyone hits. Without it, a character last seen *before* the window starts drags \`left\` backwards, the window grows illegally, and the answer comes out too large — on some inputs only, which makes it miserable to debug.

### Counting windows with a character budget

\`\`\`js
function longestWithAtMostK(s, k) {
  const counts = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    counts.set(c, (counts.get(c) ?? 0) + 1);

    while (counts.size > k) {                   // too many distinct chars
      const l = s[left];
      counts.set(l, counts.get(l) - 1);
      if (counts.get(l) === 0) counts.delete(l); // MUST delete, not zero out
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
\`\`\`

That \`delete\` is load-bearing. Leaving a zero-count entry in the map keeps \`counts.size\` inflated, so the \`while\` never exits and the window never grows again. Whenever your validity check reads \`map.size\`, you must remove keys that hit zero.

### When a window does not apply

Sliding windows require that extending the window can only push it **further** from valid in one direction — monotonicity. "Longest subarray with sum ≤ target" works with non-negative numbers because adding an element only increases the sum. Introduce negative numbers and shrinking from the left might *not* help, so the pattern breaks and you need prefix sums with a hash map instead.

Also: a window is contiguous. If the problem says "subsequence" rather than "subarray" or "substring", items can be skipped and this is the wrong tool — that is dynamic programming territory (Chapter 5).
        `,
        [
          q('In a fixed-size window, what replaces recomputing the sum of all k elements?', [
            'Adding the entering element and subtracting the leaving one',
            'Sorting the window each step',
            'Caching every window sum in a Map',
            'Binary searching the array',
          ], 0, 'Consecutive windows share k − 1 elements, so two arithmetic operations describe the entire change.'),
          q('In longestUnique, why is the guard lastSeen.get(ch) >= left rather than just lastSeen.has(ch)?', [
            'To handle the empty string',
            'To keep the map small',
            'Because a repeat found before the window start would drag left backwards and inflate the answer',
            'Because Map.get can return undefined',
          ], 2, 'Only a duplicate inside the current window matters; an older occurrence must never move left in the wrong direction.'),
          q('Which of these is NOT a sliding-window problem?', [
            'Maximum sum of any 5 consecutive elements',
            'Longest substring with at most two distinct characters',
            'Smallest subarray of non-negative numbers with sum at least 100',
            'Longest increasing subsequence of an array',
          ], 3, 'A subsequence may skip elements while a window is always contiguous, so that one belongs to dynamic programming.'),
        ]),
        lesson('Sorting and Binary Search', 15, `
Sorting is rarely the answer by itself; it is the *setup* that makes the answer cheap. Once data is ordered you get binary search, converging pointers, duplicate detection, and grouping — all for one O(n log n) investment.

### The algorithms and what they cost

| Algorithm | Average | Worst | Space | Stable |
|---|---|---|---|---|
| Insertion sort | O(n²) | O(n²) | O(1) | yes |
| Merge sort | O(n log n) | O(n log n) | O(n) | yes |
| Quicksort | O(n log n) | O(n²) | O(log n) | no |
| Heapsort | O(n log n) | O(n log n) | O(1) | no |

**Stable** means equal elements keep their original relative order. It matters when you sort twice: sort by name, then stably by department, and within each department the names are still ordered. An unstable sort destroys the first pass.

Insertion sort's O(n²) is not always a loss — it is O(n) on nearly-sorted input and has tiny constants, which is why real engines switch to it for short subarrays.

### Merge sort, in full

\`\`\`js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;              // base case
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);                    // from the two-pointers lesson
}
\`\`\`

Why O(n log n): halving the array gives \`log n\` levels, and each level merges every element exactly once, which is O(n) per level. The cost is O(n) extra memory for the copies.

Quicksort partitions around a pivot instead of splitting down the middle. It is faster in practice (no allocation, cache-friendly) but a bad pivot on sorted input puts one element on one side and \`n − 1\` on the other — that is the O(n²) worst case. Randomising or median-of-three pivots makes it vanishingly unlikely.

### JavaScript's sort has a trap

\`\`\`js
[10, 9, 1].sort();                 // [1, 10, 9]  ← compared as STRINGS
[10, 9, 1].sort((a, b) => a - b);  // [1, 9, 10]
\`\`\`

With no comparator, \`sort\` converts everything to strings, and \`'10' < '9'\`. This is the most common sorting bug in JavaScript, and it hides well because it produces correct-looking output for single-digit data.

A comparator must return a **number**, and it must be consistent:

\`\`\`js
users.sort((a, b) => a.age - b.age);                       // ascending
users.sort((a, b) => b.age - a.age);                       // descending
users.sort((a, b) => a.name.localeCompare(b.name));        // text
users.sort((a, b) => a.dept.localeCompare(b.dept) || a.age - b.age);  // tie-break
\`\`\`

Returning \`true\`/\`false\` from a comparator is a bug: \`true\` coerces to 1 and \`false\` to 0, so "b comes first" is never expressed and the order is arbitrary.

One more: \`sort\` mutates and returns the same array. Copy first when the original matters — \`[...arr].sort(cmp)\`.

### Binary search

\`\`\`js
function binarySearch(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {                       // <= : lo === hi is a real candidate
    const mid = lo + ((hi - lo) >> 1);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;   // mid + 1, not mid
    else hi = mid - 1;                        // mid - 1, not mid
  }
  return -1;
}
\`\`\`

Two off-by-one traps live in those four lines. Using \`lo < hi\` misses a match when the range narrows to one element. Assigning \`lo = mid\` instead of \`mid + 1\` leaves the range unchanged when \`lo === mid\`, and the loop never terminates. Every binary search bug you will ever write is one of these two.

### The variant that solves more problems

Plain search is fine when the value exists. More often you want the **insertion point** — the first index whose value is at least the target:

\`\`\`js
function lowerBound(sorted, target) {
  let lo = 0, hi = sorted.length;    // hi is exclusive
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;   // 0..length; equals length when target exceeds everything
}
\`\`\`

This answers "how many items are below x", "where do I insert to stay sorted", and "does x exist" (\`sorted[lowerBound(a, x)] === x\`) with one function. Note the different loop condition and exclusive \`hi\` — mixing the two templates is how people end up with a search that works except at the boundaries.
        `,
        [
          q('What does a stable sort guarantee?', [
            'It never degrades to O(n squared)',
            'Equal elements keep their original relative order',
            'It uses O(1) extra space',
            'It works on strings as well as numbers',
          ], 1, 'Stability is what lets you sort by one key and then by another without destroying the first ordering.'),
          q('Why does binary search assign lo = mid + 1 rather than lo = mid?', [
            'To skip over duplicates',
            'To keep mid inside the array bounds',
            'Because when lo equals mid the range would never shrink and the loop would never end',
            'To make the search stable',
          ], 2, 'mid can equal lo, so reassigning lo to mid leaves the interval unchanged and the loop spins forever.'),
          q('lowerBound returns sorted.length. What does that tell you?', [
            'Every element is smaller than the target, so it belongs at the end',
            'The array is empty',
            'The target was found at the last index',
            'The array was not sorted',
          ], 0, 'lowerBound returns an insertion point in 0..length, and length means nothing in the array is greater than or equal to the target.'),
        ]),
        lesson('Prefix Sums and Range Queries', 13, `
A sliding window handles one range that moves. When the question is "what is the sum between i and j" for arbitrary i and j, asked thousands of times, you precompute once and answer each query with a single subtraction.

### Build once, query forever

\`\`\`js
function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);    // note the + 1
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;                    // prefix[k] = sum of the first k elements
}

const rangeSum = (prefix, i, j) => prefix[j + 1] - prefix[i];   // inclusive i..j
\`\`\`

With \`nums = [2, 4, 1, 3]\` the prefix array is \`[0, 2, 6, 7, 10]\`, and the sum of indices 1..2 is \`prefix[3] - prefix[1] = 7 - 2 = 5\`. O(n) to build, **O(1)** per query, O(n) extra space.

The leading zero is the entire reason this code has no special cases. Store the sums without it and \`rangeSum(0, j)\` needs its own branch — the off-by-one everybody writes exactly once.

Prefix sums are for **static** data. Change one element and the whole suffix of the table is wrong, so a workload that interleaves updates with range queries wants a Fenwick tree or a segment tree instead, both O(log n) for either operation.

### Subarray sums when the numbers can be negative

The sliding window stopped at non-negative numbers: with negatives, extending a window can lower the sum, so shrinking from the left proves nothing. Prefix sums plus a hash map take over. Every subarray sum is a difference of two prefixes, so "is there a subarray summing to k" becomes "have I already seen the prefix \`running - k\`" — the complement trick from the hash map topic.

\`\`\`js
function countSubarraysWithSum(nums, k) {
  const seen = new Map([[0, 1]]);      // one empty prefix, before anything
  let running = 0, count = 0;
  for (const n of nums) {
    running += n;
    count += seen.get(running - k) ?? 0;               // count BEFORE inserting
    seen.set(running, (seen.get(running) ?? 0) + 1);
  }
  return count;
}
\`\`\`

Two lines carry the bugs. \`new Map([[0, 1]])\` is the seeding people forget: without it a subarray that starts at index 0 has no earlier prefix to subtract from, so \`[3, 1]\` with \`k = 3\` reports 0 instead of 1. And counting before inserting matters when \`k\` is 0, where the current prefix would otherwise match itself and count an empty subarray.

O(n) time, O(n) space, negatives welcome — which no window can do.

### Range updates: the difference array

Now flip the idea. To add \`v\` to every element of \`l..r\`, thousands of times, and only read the array at the end:

\`\`\`js
function applyRanges(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;
    diff[r + 1] -= v;          // cancel the addition just past the range
  }
  const out = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) { running += diff[i]; out[i] = running; }
  return out;
}
\`\`\`

Each update is O(1) rather than O(r − l), and one prefix pass materialises the answer: **O(u + n)** for u updates instead of O(u·n). The \`n + 1\` length exists purely so an update ending at the last index can write \`diff[n]\` without a bounds check.

### Two dimensions

\`\`\`js
// pre[r+1][c+1] = sum of the rectangle from (0,0) to (r,c)
function build2D(grid) {
  const R = grid.length, C = grid[0].length;
  const pre = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      pre[r + 1][c + 1] = grid[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c];
    }
  }
  return pre;
}

const rect = (pre, r1, c1, r2, c2) =>
  pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];
\`\`\`

The overlap that was subtracted twice has to be added back — inclusion and exclusion. Any submatrix sum in O(1) after an O(R·C) build.

### Choosing

| Question | Tool |
|---|---|
| Sum of a fixed-size moving window | Sliding window |
| Arbitrary range sums, data never changes | Prefix sums |
| Count subarrays summing to k, negatives allowed | Prefix sums + hash map |
| Many range updates, one read at the end | Difference array |
| Updates and range queries interleaved | Fenwick or segment tree |
        `,
        [
          q('Why does the prefix array have length n + 1 with a leading zero?', [
            'To leave room for the grand total',
            'So that rangeSum(0, j) needs no special case and every query is one subtraction',
            'To make the length a power of two',
            'Because arrays are zero-indexed',
          ], 1, 'The extra slot represents the empty prefix, which is what a range starting at index 0 has to subtract.'),
          q('countSubarraysWithSum seeds its map with [[0, 1]]. What breaks without that seed?', [
            'Negative numbers are double counted',
            'The map grows without bound',
            'Subarrays that start at index 0 have no earlier prefix to match, so they are never counted',
            'The running sum overflows',
          ], 2, 'A subarray covering the first k elements needs the empty prefix 0 to be present as a match.'),
          q('Which workload does a plain prefix-sum array handle badly?', [
            'Range queries interleaved with element updates, because one write invalidates the whole suffix',
            'Thousands of range sums over fixed data',
            'A single range sum on a large array',
            'Rectangle sums over a static grid',
          ], 0, 'Prefix tables are built once; a mutable array with range queries is what Fenwick and segment trees exist for.'),
        ]),
      ],
      [
        q('Why does the converging two-pointer pair search require sorted input?', [
          'Because the sum comparison is what tells you which pointer to move',
          'Because unsorted arrays cannot be indexed',
          'Because sorting makes the array shorter',
          'Because Map lookups need sorted keys',
        ], 0, 'Sortedness is what guarantees that moving lo right can only increase the sum and moving hi left can only decrease it.'),
        q('The variable sliding-window template has a while loop inside a for loop. What is its total time?', [
          'O(n²), because of the nested loop',
          'O(n log n)',
          'O(n), because left and right each advance at most n times overall',
          'It depends on the alphabet size',
        ], 2, 'Each index is added once and removed once across the whole run, so the inner loop does at most n total work.'),
        q('In the "at most k distinct characters" window, why delete a key when its count hits zero?', [
          'To free memory',
          'Because Map cannot store zero',
          'To keep insertion order correct',
          'Because counts.size is the validity check, and a zero entry keeps it inflated',
        ], 3, 'A leftover zero-count key makes size report too many distinct characters, so the shrink loop can never exit.'),
        q('[10, 9, 1].sort() returns [1, 10, 9]. Why?', [
          'sort is unstable in JavaScript',
          'Without a comparator, elements are converted to strings and compared lexicographically',
          'sort only handles arrays of length 2',
          'The array was already partly sorted',
        ], 1, 'The default comparator does string comparison, where "10" sorts before "9".'),
      ]
    ),
    chapter(
      'Stacks, Queues, and Linked Lists',
      'Structures defined by where you are allowed to add and remove — and the pointer discipline they demand.',
      [
        lesson('Stacks: Last In, First Out', 12, `
A stack allows exactly two operations: **push** onto the top, and **pop** off the top. That restriction is the point — it makes the structure trivially fast and matches any problem with nesting.

### An array already is a stack

\`\`\`js
const stack = [];
stack.push(1);           // O(1)
stack.push(2);
stack[stack.length - 1]; // 2 — peek, without removing
stack.pop();             // 2, O(1)
stack.length === 0;      // empty check
\`\`\`

Both ends of an array are not equal: \`push\`/\`pop\` work at the end and are O(1), while \`shift\`/\`unshift\` work at the front and are O(n) (Chapter 1). Always build stacks on the **end** of the array.

Guard your peeks. \`stack[stack.length - 1]\` on an empty stack is \`undefined\`, and \`undefined.val\` throws three lines later where the real problem is invisible. Check \`stack.length\` first.

### Matching brackets

The canonical stack problem, because nesting is exactly what a stack models:

\`\`\`js
function isBalanced(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;   // wrong or missing opener
    }
  }
  return stack.length === 0;   // leftovers mean unclosed brackets
}
\`\`\`

That final \`stack.length === 0\` is the step people forget. Without it \`"((("\` returns \`true\`, because nothing ever mismatched — it just never closed.

### Undo, history, and the call stack

Every "back" button and every undo feature is a stack of previous states. So is the runtime's own **call stack**: each function call pushes a frame holding its arguments and local variables, and returning pops it. Recursion (Chapter 4) is stack usage you did not write yourself, and \`RangeError: Maximum call stack size exceeded\` is that stack overflowing.

Any recursive algorithm can be rewritten iteratively with an explicit stack, which is how you process a million-node tree without blowing the frame limit.

### The monotonic stack

This one turns a family of O(n²) problems into O(n). "For each element, find the next larger element to its right":

\`\`\`js
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];                      // holds INDICES, kept decreasing
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      result[stack.pop()] = nums[i];     // nums[i] is the answer for that index
    }
    stack.push(i);
  }
  return result;
}
\`\`\`

The stack holds indices whose answer is still unknown, and it stays in decreasing order of value. When a bigger number arrives, it resolves everything smaller beneath it at once. Each index is pushed once and popped once — **O(n)** despite the inner \`while\`, the same amortised argument as the sliding window.

Store **indices, not values**, when you need to write back into a result array or compute a distance. Storing values loses the position and you cannot recover it.

### Evaluating expressions

\`\`\`js
function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = stack.pop();      // second operand pops FIRST
      const a = stack.pop();
      stack.push(ops[t](a, b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack.pop();
}
\`\`\`

Popping in the wrong order works for \`+\` and \`*\` and quietly breaks \`-\` and \`/\` — a bug that survives half the test cases.

### When to reach for a stack

Nesting, matching, reversal, undo, backtracking, or "find the previous/next element that satisfies a comparison". If the most recent unresolved item is the one you need next, it is a stack.
        `,
        [
          q('Why must a stack be built on push/pop at the end of a JavaScript array rather than unshift/shift at the front?', [
            'The front methods return the wrong element',
            'push and pop are O(1), while unshift and shift are O(n) because every element moves',
            'Arrays cannot grow at the front',
            'shift throws on arrays of objects',
          ], 1, 'Both ends behave alike logically but not in cost — front operations reindex the entire array.'),
          q('In evalRPN, why is the first pop assigned to b and the second to a?', [
            'To avoid an off-by-one in the token index',
            'Because pop returns strings that must be converted in order',
            'It makes no difference for any operator',
            'The stack is last-in-first-out, so the right-hand operand comes off first',
          ], 3, 'Swapping them still works for + and *, which is why the bug survives half the test cases before − and / expose it.'),
          q('The monotonic stack in nextGreater stores indices rather than values. Why?', [
            'Indices compare faster than values',
            'Values could be duplicated',
            'The answer has to be written back into result at that element position, which a bare value cannot tell you',
            'The stack must stay sorted',
          ], 2, 'You pop an element in order to record its answer, and only its index says where that answer belongs.'),
        ]),
        lesson('Queues and Deques: First In, First Out', 12, `
A queue is a stack's mirror image: you add at the back and remove from the front. It models fairness and order — print jobs, request handling, and every breadth-first traversal in Chapter 5.

### The naive queue is quadratic

\`\`\`js
const queue = [];
queue.push(x);       // O(1) — fine
queue.shift();       // O(n) — every remaining element moves left one slot
\`\`\`

For 100,000 items that is 5 billion element moves. **This is the most common hidden performance bug in BFS code**, and it is invisible because the algorithm is correct — just unusably slow on large graphs, so it passes every small test.

### A real O(1) queue

Do not remove from the front; move a pointer past it.

\`\`\`js
class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(x) {
    this.items.push(x);              // O(1)
  }

  dequeue() {
    if (this.head >= this.items.length) return undefined;
    const x = this.items[this.head++];   // O(1) — nothing shifts

    // Occasionally reclaim the dead prefix so memory does not grow forever
    if (this.head > 32 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return x;
  }

  get size() {
    return this.items.length - this.head;
  }
}
\`\`\`

The compaction step is the part people leave out. Without it, a long-running queue keeps every item it ever held alive in memory — the array only ever grows. Compacting when half the buffer is dead costs O(n) rarely, which amortises to O(1) per operation.

For short-lived work inside one function, you often do not even need the class:

\`\`\`js
const queue = [start];
let head = 0;
while (head < queue.length) {
  const node = queue[head++];
  for (const next of neighbours(node)) queue.push(next);
}
\`\`\`

### Circular buffers

When the maximum size is known and fixed, a circular buffer gives O(1) operations in a fixed allocation:

\`\`\`js
class RingBuffer {
  constructor(capacity) {
    this.buf = new Array(capacity);
    this.head = 0;
    this.count = 0;
    this.capacity = capacity;
  }
  push(x) {
    const tail = (this.head + this.count) % this.capacity;
    this.buf[tail] = x;
    if (this.count === this.capacity) this.head = (this.head + 1) % this.capacity;  // overwrite oldest
    else this.count++;
  }
  toArray() {
    return Array.from({ length: this.count }, (_, i) => this.buf[(this.head + i) % this.capacity]);
  }
}
\`\`\`

That \`% capacity\` wraparound is the whole idea, and it is how "keep the last 100 log lines" is implemented without ever allocating again.

### Deques: both ends

A **deque** (double-ended queue) allows push and pop at both ends in O(1). Its killer application is the sliding-window maximum, which is O(n·k) with a naive rescan and O(n) with a monotonic deque:

\`\`\`js
function maxSlidingWindow(nums, k) {
  const dq = [];              // indices, values strictly decreasing
  const out = [];
  let head = 0;

  for (let i = 0; i < nums.length; i++) {
    while (dq.length > head && dq[head] <= i - k) head++;          // drop expired
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();  // drop smaller
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[head]]);   // front is the window max
  }
  return out;
}
\`\`\`

The front always holds the index of the current window's maximum: anything smaller that arrived earlier can never win again, so it is discarded permanently.

### Picking the structure

| You need | Use |
|---|---|
| Most recent item first | Stack |
| Oldest item first, fair order | Queue |
| Both ends, or window extremes | Deque |
| Highest priority first, any order in | Heap (priority queue) |
        `,
        [
          q('The index-based Queue occasionally rebuilds items with slice(head). What happens without that step?', [
            'dequeue starts returning the wrong element',
            'The dead prefix is never released, so a long-running queue grows in memory forever',
            'size reports a negative number',
            'dequeue becomes O(n)',
          ], 1, 'Skipping past consumed items leaves them referenced by the backing array, so compaction is what bounds the memory.'),
          q('What does the % capacity arithmetic accomplish in a ring buffer?', [
            'It keeps the values sorted',
            'It resizes the buffer when it fills up',
            'It wraps writes back to the start so one fixed allocation is reused forever',
            'It prevents duplicate entries',
          ], 2, 'Wrapping is what turns a fixed array into an endless stream of the most recent items with no further allocation.'),
          q('In maxSlidingWindow, why is an index dropped from the back of the deque when its value is at most nums[i]?', [
            'To keep the deque sorted ascending',
            'To keep the deque length equal to k',
            'Because expired indices must leave from the back',
            'Because a smaller element that arrived earlier can never be the maximum of any future window',
          ], 3, 'The newer element is at least as large and stays in the window longer, so the older smaller one is permanently useless.'),
        ]),
        lesson('Linked Lists and Pointer Discipline', 15, `
A linked list stores each value in its own node alongside a pointer to the next node. Nothing is contiguous, so there is no index arithmetic — you walk.

\`\`\`js
const node = (val, next = null) => ({ val, next });

const list = node(1, node(2, node(3)));   // 1 → 2 → 3 → null
\`\`\`

### The trade against arrays

| Operation | Array | Linked list |
|---|---|---|
| Access index i | O(1) | O(n) — walk from the head |
| Insert/delete at front | O(n) | **O(1)** |
| Insert/delete after a known node | O(n) | **O(1)** |
| Find a value | O(n) | O(n) |
| Memory per element | value only | value + pointer |
| Cache behaviour | excellent | poor — nodes scattered |

Linked lists win only when you already hold a reference to the position and you insert or delete often. That "already hold a reference" clause is why they are rarer in application code than textbooks imply — but they are the backbone of LRU caches, hash-map buckets, and undo chains.

### Walking a list

\`\`\`js
let curr = head;
while (curr) {
  console.log(curr.val);
  curr = curr.next;      // forget this line and you loop forever
}
\`\`\`

### Reversing: the three-pointer dance

\`\`\`js
function reverse(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;   // SAVE first — this line is the whole trick
    curr.next = prev;         // flip the arrow
    prev = curr;              // shuffle both pointers forward
    curr = next;
  }
  return prev;                // prev is the new head
}
\`\`\`

Set \`curr.next = prev\` before saving \`next\` and you have just severed the rest of the list — it is unreachable and gone. Every pointer manipulation follows the same rule: **save what you are about to overwrite.**

### The dummy head node

Deleting from a list has an annoying special case: removing the first node changes the head itself. A dummy node removes the special case entirely:

\`\`\`js
function removeAll(head, target) {
  const dummy = node(null, head);   // fake node in front of the real head
  let prev = dummy;
  while (prev.next) {
    if (prev.next.val === target) prev.next = prev.next.next;   // splice it out
    else prev = prev.next;                                       // only advance on keep
  }
  return dummy.next;                // the real head, possibly changed
}
\`\`\`

Two details: the head case now needs no branch, and \`prev\` advances **only when you keep a node**. Advancing unconditionally skips the node that just slid into place, so consecutive duplicates survive — a bug that passes any test without adjacent matches.

Use a dummy node whenever the head might change: deletion, merging two lists, partitioning.

### Fast and slow pointers

There is no \`.length\`, so finding the middle in one pass needs the two-speed trick from Chapter 2:

\`\`\`js
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;   // twice the speed → half the distance
  }
  return slow;
}
\`\`\`

The guard is \`fast && fast.next\`, in that order. Checking \`fast.next\` first throws when \`fast\` is null — JavaScript's \`&&\` short-circuits left to right, and that ordering is doing real work here.

### Detecting a cycle

A corrupted \`next\` pointer can make a list loop forever. Floyd's algorithm finds it in O(n) time and O(1) space:

\`\`\`js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;   // the fast runner lapped the slow one
  }
  return false;                       // fast reached the end: no cycle
}
\`\`\`

If a loop exists, the fast pointer enters it and closes the gap by one node per step, so a collision is guaranteed. A \`Set\` of visited nodes also works but costs O(n) memory; Floyd's costs two variables.

Compare by **reference** (\`slow === fast\`), never by \`slow.val === fast.val\` — duplicate values would report a cycle that is not there.
        `,
        [
          q('In removeAll, why does prev advance only when a node is kept?', [
            'To keep the loop O(n)',
            'Because splicing a node out pulls the next one into that position, and it still has to be examined',
            'Because prev.next is null right after a deletion',
            'To avoid mutating the dummy node',
          ], 1, 'Advancing unconditionally skips the node that just slid into place, so consecutive duplicates survive.'),
          q('Why is the guard written while (fast && fast.next) rather than while (fast.next && fast)?', [
            'The two are equivalent',
            'The second version skips the last node',
            'The first version is measurably faster',
            'Because && evaluates left to right, so fast.next would be read on a null fast and throw',
          ], 3, 'Short-circuit order is doing real work: the left operand must prove fast exists before the right one dereferences it.'),
          q('Floyd cycle detection compares slow === fast rather than slow.val === fast.val. Why?', [
            'Values may be objects',
            'Reference equality is faster',
            'Duplicate values would report a cycle that does not exist',
            'val may be undefined on the dummy node',
          ], 2, 'A cycle means the two pointers reached the same node, and equal payloads say nothing about identity.'),
        ]),
        lesson('Doubly Linked Lists and Sentinels', 13, `
A singly linked list can only look forward, which makes one operation awkward: to delete a node you must already hold the node *before* it. Store both directions and that constraint disappears.

\`\`\`js
const node = (val) => ({ val, prev: null, next: null });
\`\`\`

### O(1) removal given only the node

\`\`\`js
function unlink(n) {
  if (n.prev) n.prev.next = n.next;
  if (n.next) n.next.prev = n.prev;
  n.prev = n.next = null;      // release: the removed node must hold nothing
  return n;
}
\`\`\`

That is the capability a singly linked list cannot offer at any price — hand it a node and the node disappears in constant time, no traversal and no predecessor search. It is why an LRU cache classically pairs a hash map (find the node by key) with a doubly linked list (move that node to the front). Chapter 7 gets the same behaviour out of \`Map\` insertion order with far less code, but every language without ordered maps builds it exactly this way.

That last line matters more than it looks. Leave \`prev\` and \`next\` populated on a node you handed back and the whole neighbouring list stays reachable through it, so a cache that keeps evicted nodes retains everything it ever stored.

### Sentinels delete the null checks

Those two \`if\`s in \`unlink\` are the tip of an iceberg: every insertion and removal at a boundary is a special case. Two permanent dummy nodes — the trick from the singly linked lesson, applied at both ends — remove all of them:

\`\`\`js
class Deque {
  constructor() {
    this.head = node(null);            // sentinel, never holds data
    this.tail = node(null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.length = 0;
  }

  insertAfter(at, n) {                 // the only linking code in the class
    n.prev = at;
    n.next = at.next;
    at.next.prev = n;                  // safe: at.next always exists
    at.next = n;
    this.length++;
    return n;
  }

  pushFront(val) { return this.insertAfter(this.head, node(val)); }
  pushBack(val)  { return this.insertAfter(this.tail.prev, node(val)); }

  remove(n) {
    n.prev.next = n.next;              // no null checks needed at all
    n.next.prev = n.prev;
    n.prev = n.next = null;
    this.length--;
    return n.val;
  }

  popFront() { return this.length ? this.remove(this.head.next) : undefined; }
  popBack()  { return this.length ? this.remove(this.tail.prev) : undefined; }
}
\`\`\`

An empty list is still \`head ⇄ tail\`, so \`pushFront\` on an empty deque runs the identical four lines as \`pushFront\` on a thousand-element one. The \`length\` counter is not decoration either: without the guard, \`popFront\` on an empty list would remove a sentinel and destroy the structure permanently.

### The bug you will write

Update one direction and forget the other:

\`\`\`js
n.prev.next = n.next;      // the forward chain now skips n
// n.next.prev still points at n
\`\`\`

Walking forward gives the right answer, \`length\` is right, and nothing throws. Only a backwards traversal exposes it — which is exactly what \`popBack\` does, so the failure surfaces far from its cause. Pointer updates in a doubly linked list come in pairs: write the two lines adjacent, always, and walk both directions in your tests.

### Costs

| Operation | Array | Singly linked | Doubly linked |
|---|---|---|---|
| Read index i | O(1) | O(n) | O(n) |
| Insert/remove at the front | O(n) | O(1) | O(1) |
| Insert/remove at the back | O(1) | O(n) without a tail pointer | O(1) |
| Remove a node you already hold | O(n) | O(n) — needs the predecessor | **O(1)** |
| Memory per element | value | value + 1 pointer | value + 2 pointers |

Two pointers plus an object header is roughly forty bytes of overhead per element in V8, and the nodes are scattered across memory rather than contiguous. A deque of numbers is far better served by the ring buffer earlier in this chapter; the doubly linked list earns its keep only when you hold node references and splice them constantly.
        `,
        [
          q('What can a doubly linked list do that a singly linked list cannot?', [
            'Store more than one value per node',
            'Grow without ever reallocating',
            'Be traversed with a plain while loop',
            'Remove a node in O(1) when all you hold is that node',
          ], 3, 'Unlinking needs the predecessor, and only a prev pointer supplies it without walking the list.'),
          q('Why do sentinel head and tail nodes simplify remove()?', [
            'They store the length of the list',
            'A real node always has both neighbours, so no null checks are required',
            'They make the list circular',
            'They keep the values sorted',
          ], 1, 'Every boundary case disappears once the first and last real nodes still have something on either side of them.'),
          q('You update n.prev.next but forget n.next.prev. What is the symptom?', [
            'Forward traversal stays correct, and only a backwards walk such as popBack sees the removed node',
            'A TypeError on the next insertion',
            'length goes negative',
            'The list becomes circular',
          ], 0, 'Half-updated links leave one direction perfectly consistent, which is why the bug surfaces far from the code that caused it.'),
        ]),
      ],
      [
        q('Why does the bracket matcher end with stack.length === 0?', [
          'Because unclosed openers never trigger a mismatch and would otherwise pass',
          'To free memory before returning',
          'Because pop() returns undefined on an empty stack',
          'To reset the stack for the next call',
        ], 0, 'A string like "(((" never mismatches — the only evidence of the error is the leftover openers.'),
        q('Why is a monotonic stack O(n) even though it contains a while loop?', [
          'The while loop runs at most twice',
          'The stack never exceeds two elements',
          'Each index is pushed once and popped once across the entire run',
          'Because the array is sorted',
        ], 2, 'Total pops are bounded by total pushes, which is n, so the inner loop does O(n) work overall.'),
        q('Why is queue.shift() a problem in BFS on a large graph?', [
          'It returns the wrong element',
          'It throws on an empty array',
          'It breaks the visited set',
          'It is O(n), so draining the queue becomes O(n²)',
        ], 3, 'shift re-indexes every remaining element, turning an otherwise linear traversal into a quadratic one.'),
        q('In reverse(), why must you save curr.next before setting curr.next = prev?', [
          'To keep the list length correct',
          'Because overwriting next without saving it makes the rest of the list unreachable',
          'Because prev is null on the first iteration',
          'To avoid mutating the input',
        ], 1, 'The only reference to the remaining nodes is curr.next; overwrite it unsaved and the tail is lost.'),
      ]
    ),
    chapter(
      'Recursion and Trees',
      'Solving a problem by solving a smaller version of itself — and the branching structure that makes it natural.',
      [
        lesson('Recursion and the Call Stack', 13, `
Recursion is one idea in two parts: a **base case** that returns without recursing, and a **recursive case** that calls itself on strictly smaller input. Get both right and the middle takes care of itself.

\`\`\`js
function factorial(n) {
  if (n <= 1) return 1;            // base case — stops the descent
  return n * factorial(n - 1);     // recursive case — strictly smaller
}
\`\`\`

### Trust the recursion

The hardest habit to build is *not* tracing every call. When you write \`factorial(n - 1)\`, assume it already returns the right answer, and ask only: given that, is my line correct? This is why it feels like magic and why it works — you are proving one step, not simulating a hundred.

Every recursive function you write should pass three checks:

1. Is there a base case that returns without recursing?
2. Does every recursive call move **toward** it?
3. Given correct sub-answers, is the combining step correct?

Fail (1) or (2) and you get \`RangeError: Maximum call stack size exceeded\` — the runtime's way of saying it ran out of frames, typically around 10,000 deep in Node.

### The stack is real memory

Each pending call keeps a frame with its arguments and locals. \`factorial(10000)\` needs 10,000 simultaneous frames, so recursion depth is a **space** cost of O(depth), even when the function allocates nothing. JavaScript engines do not implement tail-call optimisation in practice, so a "tail recursive" rewrite does not save you. When depth scales with input size, convert to a loop or an explicit stack (Chapter 3).

### Naive recursion can be exponential

\`\`\`js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);   // O(2ⁿ) — recomputes the same values endlessly
}
\`\`\`

\`fib(40)\` makes over 330 million calls, and it is the *small* values that dominate: \`fib(2)\` is recomputed more than 60 million times, because every one of the exponentially many branches bottoms out down there. Cache the results and the same code becomes linear:

\`\`\`js
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}
\`\`\`

Each \`n\` is computed once: **O(n)**. That is memoisation, and Chapter 5 formalises it as dynamic programming.

Watch the default parameter: \`memo = new Map()\` is evaluated on each *external* call, but passing \`memo\` along explicitly keeps one shared cache for the whole descent. Forgetting to pass it makes every recursive call build a fresh empty map — the memo does nothing and you are back to exponential, with no error to tell you.

### Backtracking: recursion that undoes itself

Backtracking explores a decision tree: make a choice, recurse, then **undo the choice** before trying the next one.

\`\`\`js
function subsets(nums) {
  const out = [];
  const path = [];

  const walk = (i) => {
    if (i === nums.length) {
      out.push([...path]);   // COPY — path keeps mutating after this
      return;
    }
    walk(i + 1);             // choice A: skip nums[i]

    path.push(nums[i]);      // choice B: take it
    walk(i + 1);
    path.pop();              // undo, so the caller's state is untouched
  };

  walk(0);
  return out;
}
\`\`\`

Two lines carry all the risk. \`out.push(path)\` without the spread stores a reference to the one shared array, so after the walk finishes every entry in \`out\` is the same empty array — the classic backtracking bug, and it looks like the algorithm produced nothing. And omitting \`path.pop()\` leaks a choice into every sibling branch, producing results that grow monotonically longer.

The template generalises: for permutations, swap-recurse-swap-back; for N-Queens, place-recurse-remove. Always leave the shared state exactly as you found it.

### Recursion versus iteration

Use recursion when the data is **branching** (trees, graphs, nested JSON) or when the problem is naturally defined in terms of itself. Use iteration when the structure is linear and the depth could be large. A loop is never wrong, just occasionally unreadable — \`walk(node.left); walk(node.right)\` has no clean loop equivalent without building a stack by hand.
        `,
        [
          q('Which of these is NOT one of the three checks every recursive function must pass?', [
            'There is a base case that returns without recursing',
            'Every recursive call moves toward the base case',
            'The recursive call is in tail position so the engine can eliminate the frame',
            'Given correct sub-answers, the combining step is correct',
          ], 2, 'JavaScript engines do not implement tail-call optimisation in practice, so tail position buys you nothing.'),
          q('Naive fib(40) makes over 330 million calls. Where does most of that work happen?', [
            'At the small values, which every one of the exponentially many branches recomputes',
            'In the base case comparison',
            'At the largest values, near n = 40',
            'In the addition operator',
          ], 0, 'Every branch bottoms out at fib(1) and fib(2), so the cheapest subproblems are the ones computed tens of millions of times.'),
          q('Omitting path.pop() after the recursive call in subsets produces what?', [
            'A stack overflow',
            'Choices leak into sibling branches, so the results keep growing longer',
            'An empty output array',
            'Duplicate but otherwise correct subsets',
          ], 1, 'Backtracking requires restoring the shared state, otherwise the next branch starts from a path it never chose.'),
        ]),
        lesson('Binary Trees and Traversals', 14, `
A binary tree is nodes with up to two children. Trees in general are everywhere — the DOM, file systems, nested JSON — but those are *n*-ary, with any number of children per node. The binary case is the one to learn first: two children is exactly what you need to halve the search space at each step, turning "search n things" into "make log n decisions", provided the tree stays balanced. Expression parsers, search trees, and heaps are all binary.

\`\`\`js
const node = (val, left = null, right = null) => ({ val, left, right });

const tree =
  node(4,
    node(2, node(1), node(3)),
    node(6, node(5), node(7)));
\`\`\`

### Vocabulary that matters

- **Height** — longest path from a node down to a leaf. The height of the whole tree drives every cost.
- **Balanced** — no leaf is much deeper than another, so height is O(log n).
- **Degenerate** — every node has one child, so it is a linked list with extra steps and height O(n).

Almost every tree operation is O(height). Balanced means O(log n); degenerate means O(n). That single distinction is why balanced trees exist.

### The three-line recursion

Nearly every tree function has the same shape: handle the empty case, recurse on both sides, combine.

\`\`\`js
function maxDepth(root) {
  if (!root) return 0;                                    // base case
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}
\`\`\`

Use \`!root\` (null) as the base case, not "is a leaf". Checking for a leaf forces you to null-check both children before recursing, doubles the branches, and breaks on a one-child node — the most common way tree recursion goes wrong.

### Depth-first traversals

The only difference between the three is **when you visit the node** relative to its children:

\`\`\`js
function preorder(n, out = []) {            // node, left, right
  if (!n) return out;
  out.push(n.val);
  preorder(n.left, out);
  preorder(n.right, out);
  return out;
}

function inorder(n, out = []) {             // left, node, right
  if (!n) return out;
  inorder(n.left, out);
  out.push(n.val);
  inorder(n.right, out);
  return out;
}

function postorder(n, out = []) {           // left, right, node
  if (!n) return out;
  postorder(n.left, out);
  postorder(n.right, out);
  out.push(n.val);
  return out;
}
\`\`\`

On the tree above: preorder gives \`4 2 1 3 6 5 7\`, inorder gives \`1 2 3 4 5 6 7\`, postorder gives \`1 3 2 5 7 6 4\`.

| Order | Use it for |
|---|---|
| Preorder | Copying/serialising a tree — the root arrives first |
| Inorder | Reading a BST in sorted order (next lesson) |
| Postorder | Deleting or evaluating — children must finish first |

Postorder is the one for anything where a node's result depends on its children's results: computing sizes, freeing memory, evaluating an expression tree.

### Iterative traversal

Recursion overflows on a deep tree. An explicit stack does not:

\`\`\`js
function inorderIterative(root) {
  const out = [], stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }   // dive left
    curr = stack.pop();
    out.push(curr.val);                                     // visit
    curr = curr.right;                                      // then go right
  }
  return out;
}
\`\`\`

### Level-order needs a queue

Depth-first uses a stack; breadth-first uses a queue. Processing a whole level at a time takes one extra line:

\`\`\`js
function levelOrder(root) {
  if (!root) return [];
  const levels = [];
  let queue = [root];
  while (queue.length) {
    levels.push(queue.map(n => n.val));
    queue = queue.flatMap(n => [n.left, n.right].filter(Boolean));
  }
  return levels;
}
\`\`\`

Snapshotting the current level before building the next is what keeps the levels separate. Mixing them into one queue without recording the level size is why "print each level on its own line" so often prints everything on one line. Chapter 5 uses this same queue mechanic on graphs, where it also computes shortest paths.
        `,
        [
          q('Why use !root as the tree base case rather than checking whether a node is a leaf?', [
            'Leaf checks are slower',
            'A leaf check forces null checks on both children and gets a one-child node wrong',
            'Leaves do not have values',
            'It makes the traversal iterative',
          ], 1, 'Letting the null case handle itself removes every special case, including the node with exactly one child.'),
          q('Which traversal do you use when a node result is computed from its children results?', [
            'Preorder',
            'Level order',
            'Postorder',
            'Inorder',
          ], 2, 'Postorder finishes both subtrees before visiting the node, which is the dependency order for sizes, deletions, and expression evaluation.'),
          q('In levelOrder, what stops the levels being merged into one flat list?', [
            'The queue is used as a stack',
            'Nodes are pushed in reverse order',
            'flatMap sorts the nodes by depth',
            'The current level is snapshotted before the next one is built',
          ], 3, 'Recording the whole level as a unit before expanding it is what preserves the level boundaries.'),
        ]),
        lesson('Binary Search Trees', 14, `
A binary search tree adds one invariant to the binary tree: for every node, **everything in the left subtree is smaller and everything in the right subtree is larger**. That invariant is what lets you discard half the tree at every step.

### Search: one comparison, half the work

\`\`\`js
function search(root, target) {
  let curr = root;
  while (curr) {
    if (target === curr.val) return curr;
    curr = target < curr.val ? curr.left : curr.right;   // discard half
  }
  return null;
}
\`\`\`

O(height): O(log n) balanced, O(n) degenerate. Note this needs no recursion — the path never branches.

### Insert

\`\`\`js
function insert(root, val) {
  if (!root) return node(val);                      // found the empty slot
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;                                       // duplicates ignored
}
\`\`\`

The \`return root\` matters: this pattern rebuilds the links on the way back up, so the caller's assignment (\`root.left = …\`) always receives a valid subtree. Decide explicitly what duplicates mean — ignore them, keep a count on the node, or send them consistently right. "Sometimes left, sometimes right" makes deletion unpredictable.

### The invariant is about subtrees, not children

\`\`\`js
//        10
//       /  \\
//      5    15
//          /  \\
//         6    20      ← 6 < 10 but sits in the right subtree: NOT a BST
\`\`\`

Every local parent/child comparison here passes. The tree is still invalid, and an inorder traversal proves it: \`5 10 6 15 20\` is not sorted. This is the most common BST bug — validating with only local checks.

Validate by carrying the allowed range downward:

\`\`\`js
function isValidBST(n, min = -Infinity, max = Infinity) {
  if (!n) return true;
  if (n.val <= min || n.val >= max) return false;
  return isValidBST(n.left, min, n.val) &&     // left: ceiling becomes this node
         isValidBST(n.right, n.val, max);      // right: floor becomes this node
}
\`\`\`

Each recursive call narrows the window, so a node is checked against every ancestor, not just its parent.

### Inorder gives you sorted output

Because left < node < right, an inorder traversal (previous lesson) emits values in ascending order in O(n). That is the cheapest correctness test you have: build a tree, traverse it inorder, confirm the output is sorted.

### Deletion: three cases

\`\`\`js
function remove(root, val) {
  if (!root) return null;
  if (val < root.val) { root.left = remove(root.left, val); return root; }
  if (val > root.val) { root.right = remove(root.right, val); return root; }

  // found it
  if (!root.left) return root.right;    // 0 or 1 child: promote the other side
  if (!root.right) return root.left;

  // two children: replace with the inorder successor
  let succ = root.right;
  while (succ.left) succ = succ.left;   // smallest value in the right subtree
  root.val = succ.val;
  root.right = remove(root.right, succ.val);   // then delete the successor
  return root;
}
\`\`\`

The two-child case is the only interesting one. The **inorder successor** — the leftmost node of the right subtree — is the smallest value still larger than the one you are removing, so putting it in the vacated slot preserves the invariant exactly. The predecessor (rightmost of the left subtree) works equally well; pick one and be consistent.

### Why balance is not optional

\`\`\`js
let root = null;
for (const v of [1, 2, 3, 4, 5]) root = insert(root, v);
// 1 → 2 → 3 → 4 → 5, a straight line. Every search is O(n).
\`\`\`

Inserting sorted data into a plain BST produces a linked list — and sorted input is common, because it is what your database returned. Self-balancing variants (**AVL**, **red-black**) rotate nodes on insert to keep the height at O(log n); red-black trees are what C++'s \`std::map\` and Java's \`TreeMap\` use underneath. Database indexes attack the same height problem with a different shape — **B-trees**, which pack hundreds of keys into every node so one disk read covers a whole level — but the goal is identical: never let the height go linear.

### BST or hash map?

| | Hash map | Balanced BST |
|---|---|---|
| Lookup by exact key | O(1) average | O(log n) |
| Sorted iteration | not possible | O(n), free |
| Range query, min/max, nearest | no | O(log n) |

Use a hash map when you only ever ask "is it there". Use a tree when order, ranges, or "the next value after x" matter.
        `,
        [
          q('When deleting a node with two children, why is the inorder successor the right replacement?', [
            'It is always a leaf',
            'It is the smallest value greater than the removed one, so the ordering invariant still holds',
            'It keeps the tree balanced',
            'It is the deepest node in the tree',
          ], 1, 'Dropping the next value in sorted order into the vacated slot leaves everything left smaller and everything right larger.'),
          q('BST search() is written as a while loop with no recursion. Why is that enough?', [
            'Because the tree is balanced',
            'Because the values are unique',
            'Because the path never branches — each comparison picks exactly one child',
            'Because JavaScript optimises tail calls',
          ], 2, 'A search walks a single root-to-leaf path, so a loop expresses it exactly and costs no stack.'),
          q('You need the smallest key greater than x, over data that keeps changing. Which structure?', [
            'A balanced BST, which answers successor and range queries in O(log n)',
            'A hash map, because lookup is O(1)',
            'A stack',
            'An unsorted array with a linear scan',
          ], 0, 'Hash maps discard ordering entirely, so successor, range, and min/max questions need a tree.'),
        ]),
        lesson('Tries: Prefix Trees', 13, `
A hash set answers "is this exact word present". A trie answers "is any word here that starts with these letters", which is a different question — and the reason autocomplete, URL routers and spell checkers are built on trees of characters rather than tables of words.

### The structure

Each node owns one edge per following character, so the path from the root spells a prefix.

\`\`\`js
const trieNode = () => ({ children: new Map(), isWord: false });

class Trie {
  constructor() { this.root = trieNode(); }

  insert(word) {
    let n = this.root;
    for (const ch of word) {
      if (!n.children.has(ch)) n.children.set(ch, trieNode());
      n = n.children.get(ch);
    }
    n.isWord = true;                 // mark the END of a real word
  }

  walk(prefix) {                     // shared descent: node or null
    let n = this.root;
    for (const ch of prefix) {
      n = n.children.get(ch);
      if (!n) return null;
    }
    return n;
  }

  has(word)          { return this.walk(word)?.isWord === true; }
  startsWith(prefix) { return this.walk(prefix) !== null; }
}
\`\`\`

Insert \`'car'\` and \`'cart'\` and the nodes \`c → a → r → t\` exist once, with \`isWord\` true at \`r\` and again at \`t\`.

### The isWord flag is not optional

Delete it and \`has\` silently becomes \`startsWith\`. Insert only \`'cart'\`, then ask for \`'car'\`: the path exists, so the answer is a confident yes for a word nobody ever added. This is the single most common trie bug, and it is invisible in any test where no inserted word is a prefix of another.

### Costs, against the obvious alternative

| Operation | Trie | Set of strings |
|---|---|---|
| Insert or look up a word of length L | O(L) | O(L) to hash |
| Every word with prefix p | O(len(p) + matches) | O(n·L) — scan everything |
| Iterate in sorted order | walk children in key order | requires a separate sort |
| Memory | one node per character of each unique prefix | one entry per word |

Neither is faster for exact lookup — both are proportional to word length, because hashing has to read the whole string too. The trie wins on prefixes and loses on memory: 100,000 English words need roughly a quarter of a million nodes, and a \`Map\` per node is a real allocation. A 26-slot array indexed by \`charCodeAt\` is faster, but only when the alphabet is genuinely fixed and small; on sparse data it wastes 26 slots per node.

### Autocomplete is a descent plus a DFS

\`\`\`js
autocomplete(prefix, limit = 10) {
  const start = this.walk(prefix);
  const out = [];
  if (!start) return out;

  const collect = (n, acc) => {                     // the tree recursion again
    if (out.length === limit) return;
    if (n.isWord) out.push(prefix + acc);
    for (const [ch, child] of n.children) collect(child, acc + ch);
  };
  collect(start, '');
  return out;
}
\`\`\`

Recording the node's own word **before** descending makes results arrive shortest first, which is what a suggestion list wants. The \`limit\` check at the top of the recursion is what stops a one-letter prefix walking an entire dictionary.

### Deletion is where people go wrong

The naive delete clears \`isWord\` and leaves the nodes behind. That is correct but it leaks: a dictionary that churns keeps every path it ever held. Pruning has to happen on the way back up, and only while the node is childless and not itself the end of a word:

\`\`\`js
remove(word, n = this.root, i = 0) {
  if (i === word.length) { n.isWord = false; return n.children.size === 0; }
  const child = n.children.get(word[i]);
  if (!child) return false;
  if (this.remove(word, child, i + 1)) n.children.delete(word[i]);
  return n.children.size === 0 && !n.isWord;    // is it safe to prune ME?
}
\`\`\`

That returned boolean is a postorder result: a parent may only be removed once its children have reported that they are gone. Deleting \`'car'\` while \`'cart'\` is still stored must remove no nodes at all, and the \`!n.isWord\` guard is what protects the shared prefix.

### When not to reach for one

Exact membership with no prefix questions: use a \`Set\`. Long keys that share almost nothing — UUIDs, hashes, random tokens — give a trie one node per character and nothing to share, so it costs far more than the hash and buys nothing. Tries pay off precisely where prefixes repeat: words, route paths, IP prefixes, file paths.
        `,
        [
          q('A trie stores only the word cart. With no isWord flag, what does has(\'car\') return?', [
            'false, because no word ends at that node',
            'It throws, because the node has children',
            'true, because the path exists — has has degenerated into startsWith',
            'undefined',
          ], 2, 'Without an end-of-word marker there is nothing to distinguish a stored word from a shared prefix.'),
          q('Compared with a Set holding the same words, what does a trie actually buy you?', [
            'Prefix queries — every word starting with p in O(len(p) + matches) instead of a full scan',
            'Faster exact lookup, because no hashing is needed',
            'Less memory per stored word',
            'Constant-time deletion',
          ], 0, 'Exact lookup costs about the same in both; the tree structure is what makes prefixes cheap.'),
          q('Why does trie deletion prune nodes on the way back up rather than on the way down?', [
            'Because the recursion is preorder',
            'Because a node may only be removed once its children report they are gone and it is not itself a word end',
            'Because Map.delete invalidates an active iteration',
            'To keep the depth of the trie constant',
          ], 1, 'Deleting car while cart exists must remove nothing, which is only knowable after the deeper nodes have answered.'),
        ]),
      ],
      [
        q('fib(n, memo = new Map()) works, but a version that never forwards memo is exponential. Why?', [
          'Each recursive call builds its own empty cache, so nothing is ever reused',
          'Map lookups are slower than addition',
          'Default parameters are evaluated only once',
          'Maps cannot store numeric keys',
        ], 0, 'The cache must be shared across the whole descent; a fresh Map per call stores results nothing else can read.'),
        q('In backtracking, why push [...path] rather than path?', [
          'Spreading is faster than pushing',
          'Arrays cannot be nested',
          'path keeps mutating, so storing the reference leaves every result identical',
          'It avoids a stack overflow',
        ], 2, 'One shared array is mutated throughout the walk, so all stored references end up showing its final state.'),
        q('Which traversal reads a BST in ascending order?', [
          'Preorder',
          'Postorder',
          'Level order',
          'Inorder',
        ], 3, 'Inorder visits left subtree, node, then right subtree — exactly the BST ordering.'),
        q('A tree where every node is greater than its left child and less than its right child. Is it a valid BST?', [
          'Yes, that is the definition',
          'Not necessarily — the rule applies to entire subtrees, not just direct children',
          'Only if it is balanced',
          'Only if all values are unique',
        ], 1, 'A deep node can satisfy its parent yet violate an ancestor, which is why validation must carry min/max bounds down.'),
      ]
    ),
    chapter(
      'Graphs and Dynamic Programming',
      'Traversing arbitrary connections, and the technique that turns exponential recursion into linear loops.',
      [
        lesson('Graphs: Representation and Depth-First Search', 14, `
A graph is nodes plus connections, with no root and no rules about shape. Trees are the special case with no cycles; everything else — road networks, dependencies, social connections, state machines — is a general graph.

### Choose a representation

\`\`\`js
// Edge list: how data usually arrives
const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];

// Adjacency list: what you actually work with
function buildAdjacency(n, edges, directed = false) {
  const adj = Array.from({ length: n }, () => []);   // never new Array(n).fill([])
  for (const [u, v] of edges) {
    adj[u].push(v);
    if (!directed) adj[v].push(u);   // undirected edges go both ways
  }
  return adj;
}
\`\`\`

| | Adjacency list | Adjacency matrix |
|---|---|---|
| Space | O(V + E) | O(V²) |
| List a node's neighbours | O(degree) | O(V) |
| Test one specific edge | O(degree) | O(1) |
| Best for | sparse graphs (almost all) | dense graphs, edge lookups |

Default to the adjacency list. A social graph with a million users and fifty friends each is 50 million entries as a list, and a trillion cells as a matrix.

For non-numeric nodes, use a \`Map\` of arrays keyed by id — the algorithms are identical.

### Depth-first search

DFS follows one path as far as it goes, then backtracks:

\`\`\`js
function dfs(adj, start, visited = new Set()) {
  if (visited.has(start)) return;   // THE line that makes graphs different from trees
  visited.add(start);
  process(start);
  for (const next of adj[start]) dfs(adj, next, visited);
}
\`\`\`

Trees need no \`visited\` set because they have no cycles. Graphs do. Omit it and a single undirected edge \`a—b\` loops forever: \`a\` visits \`b\`, \`b\` visits \`a\`, until the call stack dies. **This is the first bug everyone writes when moving from trees to graphs.**

The iterative form avoids stack overflow on deep graphs:

\`\`\`js
function dfsIterative(adj, start) {
  const visited = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const u = stack.pop();
    process(u);
    for (const v of adj[u]) {
      if (!visited.has(v)) { visited.add(v); stack.push(v); }
    }
  }
  return visited;
}
\`\`\`

Both are **O(V + E)**: every node is processed once, every edge examined once (twice if undirected).

### Counting connected components

\`\`\`js
function countComponents(n, adj) {
  const visited = new Set();
  let components = 0;
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {          // an unvisited node starts a new island
      dfs(adj, i, visited);
      components++;
    }
  }
  return components;
}
\`\`\`

One DFS only reaches nodes connected to its start. The outer loop is what handles disconnected graphs — leaving it out silently reports 1 for any input, which is right often enough to look correct.

### Cycle detection in a directed graph

A revisited node is not enough evidence: a diamond \`A→B→D, A→C→D\` reaches \`D\` twice with no cycle. You need to know whether the node is on the **current path**:

\`\`\`js
function hasCycle(adj, n) {
  const visited = new Set();
  const onPath = new Set();          // nodes in the active recursion

  const walk = (u) => {
    visited.add(u);
    onPath.add(u);
    for (const v of adj[u]) {
      if (onPath.has(v)) return true;              // back edge → cycle
      if (!visited.has(v) && walk(v)) return true;
    }
    onPath.delete(u);                // leaving this node: remove from the path
    return false;
  };

  for (let i = 0; i < n; i++) if (!visited.has(i) && walk(i)) return true;
  return false;
}
\`\`\`

That \`onPath.delete(u)\` is the backtracking undo from Chapter 4. Forget it and \`onPath\` becomes a second \`visited\` set, reporting cycles in perfectly acyclic diamonds.

This is exactly how build tools detect circular imports and how task schedulers reject impossible dependency graphs.

### DFS or BFS?

DFS suits "does a path exist", cycle detection, topological ordering, and exploring every configuration. BFS — next lesson — is what you want when the *length* of the path matters.
        `,
        [
          q('A social graph has 1,000,000 users averaging 50 connections each. Why an adjacency list?', [
            'It stores O(V + E) entries — about 50 million — while a matrix needs a trillion cells',
            'It makes testing one specific edge O(1)',
            'It is the only representation DFS can traverse',
            'It keeps each neighbour list sorted',
          ], 0, 'Sparse graphs leave almost the entire matrix empty, and V squared grows far faster than the real edge count.'),
          q('countComponents wraps dfs in a loop over every node. What breaks without that outer loop?', [
            'Cycles are no longer detected',
            'The visited set grows unbounded',
            'Disconnected graphs report 1, because one DFS only reaches its own component',
            'The recursion overflows the stack',
          ], 2, 'A single traversal can only reach nodes connected to its start, so every unvisited island needs its own launch.'),
          q('In directed cycle detection, why is a separate onPath set needed alongside visited?', [
            'To make the search iterative',
            'To count how many cycles exist',
            'Because visited is cleared between components',
            'Because revisiting a node is a cycle only when that node is still on the current recursion path',
          ], 3, 'The diamond A to B to D and A to C to D reaches D twice with no cycle, so only membership of the active path proves a back edge.'),
        ]),
        lesson('Breadth-First Search and Shortest Paths', 13, `
BFS explores in rings: all nodes one step away, then all nodes two steps away, and so on. That expanding-ring order is what makes it the shortest-path algorithm for unweighted graphs — the first time you reach a node, you reached it by the fewest possible steps.

### The template

\`\`\`js
function shortestPath(adj, start, goal) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;                          // index-based queue, not shift() — Chapter 3

  while (head < queue.length) {
    const u = queue[head++];
    if (u === goal) return dist.get(u);

    for (const v of adj[u]) {
      if (dist.has(v)) continue;         // already discovered
      dist.set(v, dist.get(u) + 1);
      queue.push(v);                     // mark on ENQUEUE, not on dequeue
    }
  }
  return -1;                             // unreachable
}
\`\`\`

Two details do all the work.

**Mark visited when you enqueue, not when you dequeue.** If you only mark on dequeue, a node with five neighbours pointing at it gets pushed five times, and each copy expands its own neighbours. The result is still correct but the queue grows exponentially on dense graphs — the most common BFS performance bug, and it looks fine on a ten-node test.

**Use an index, not \`shift()\`.** The reason is Chapter 3: \`shift\` is O(n), which makes the traversal O(V²).

### Why the first arrival is optimal

BFS processes the queue in non-decreasing distance order. When node \`v\` is discovered from \`u\`, everything at distance \`dist(u)\` or less has already been enqueued, so no shorter route to \`v\` remains undiscovered. That guarantee holds only when every edge costs the same — with weights, a two-hop cheap path can beat a one-hop expensive one, and you need **Dijkstra's algorithm**, which is BFS with a priority queue instead of a plain queue.

### Reconstructing the actual path

Distances are often not enough. Record where each node came from:

\`\`\`js
function pathTo(adj, start, goal) {
  const parent = new Map([[start, null]]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const u = queue[head++];
    if (u === goal) break;
    for (const v of adj[u]) {
      if (parent.has(v)) continue;
      parent.set(v, u);
      queue.push(v);
    }
  }
  if (!parent.has(goal)) return null;

  const path = [];
  for (let at = goal; at !== null; at = parent.get(at)) path.push(at);
  return path.reverse();     // built backwards from the goal
}
\`\`\`

The \`parent\` map doubles as the visited set — one structure, two jobs.

### Grids are graphs

A grid needs no adjacency list at all; neighbours are computed:

\`\`\`js
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function minSteps(grid, start, goal) {
  const rows = grid.length, cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  dist[start[0]][start[1]] = 0;
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const [r, c] = queue[head++];
    if (r === goal[0] && c === goal[1]) return dist[r][c];

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;  // bounds FIRST
      if (grid[nr][nc] === '#' || dist[nr][nc] !== -1) continue;   // wall or seen
      dist[nr][nc] = dist[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
  return -1;
}
\`\`\`

Check bounds **before** indexing. \`grid[-1][0]\` throws \`Cannot read properties of undefined\`, and reordering those two \`if\`s is a genuine crash, not a style preference.

### Multi-source BFS

Seed the queue with every source at distance 0 and the rings expand from all of them at once — "how far is each cell from the nearest exit" becomes one traversal instead of one per exit:

\`\`\`js
const queue = [...allExits];
for (const [r, c] of allExits) dist[r][c] = 0;
// …identical loop from here
\`\`\`

That is a genuinely useful trick: it turns an O(sources × V) problem into O(V + E).
        `,
        [
          q('In pathTo, the parent map does two jobs at once. Which two?', [
            'It stores distances and holds the queue',
            'It records each predecessor and doubles as the visited set',
            'It caches neighbours and detects cycles',
            'It sorts the frontier and dedupes it',
          ], 1, 'A node has a parent entry exactly when it has been discovered, so one structure answers both questions.'),
          q('Why must the bounds check run before the grid[nr][nc] test?', [
            'Because walls are stored outside the grid',
            'To keep the traversal O(V + E)',
            'Because grid[-1] is undefined and indexing into it throws',
            'Because dist must be written before it is read',
          ], 2, 'Reading a column of an out-of-range row dereferences undefined, so reordering those two conditions is a genuine crash.'),
          q('You need each cell distance to the nearest of 40 exits. What is the efficient approach?', [
            'Run BFS from every exit and take the minimum per cell',
            'Run DFS from every cell',
            'Sort the exits and binary search each cell',
            'Seed a single BFS queue with all 40 exits at distance 0',
          ], 3, 'Multi-source BFS expands rings from every source at once, turning 40 traversals into one O(V + E) pass.'),
        ]),
        lesson('Dynamic Programming', 15, `
Dynamic programming is recursion that refuses to solve the same subproblem twice. If your recursive solution is correct but exponential, DP is almost always the fix.

### The two conditions

A problem is a DP problem when it has:

1. **Optimal substructure** — the best answer is built from best answers to smaller versions.
2. **Overlapping subproblems** — the same smaller versions recur many times.

Merge sort has (1) but not (2) — each half is unique — so it is divide and conquer, not DP. Fibonacci has both, which is why memoising it collapses O(2ⁿ) to O(n) (Chapter 4).

### Two directions, same answer

**Top-down** is your recursion plus a cache:

\`\`\`js
function climbStairs(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);
  const ways = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  memo.set(n, ways);
  return ways;
}
\`\`\`

**Bottom-up** fills a table in dependency order, with no recursion at all:

\`\`\`js
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
\`\`\`

Top-down is easier to derive and only computes states you actually need. Bottom-up avoids stack limits and is usually faster. Write top-down first, convert if it matters. Once the table exists, notice that each row only reads the previous one or two — keeping just those in variables drops the space to O(1).

### The recipe

1. **Define the state** in words: "\`dp[i]\` is the fewest coins making amount \`i\`." If you cannot say it in one sentence, the rest will not work.
2. **Write the recurrence** — how \`dp[i]\` follows from smaller states.
3. **Set base cases**, usually \`dp[0]\`, where the sign errors hide.
4. **Choose an order** so every dependency is filled before it is read.

### Coin change

\`\`\`js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                                    // zero coins make zero
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
\`\`\`

\`Infinity\` as "impossible" is deliberate: \`Infinity + 1\` stays \`Infinity\`, so unreachable states never masquerade as cheap ones — a \`-1\` sentinel would win every \`Math.min\`.

Greedy — take the largest coin that fits — is the tempting alternative and it is wrong. With coins \`[1, 3, 4]\` and amount \`6\`, greedy gives three coins; the answer is \`3 + 3\`.

### 0/1 knapsack and a loop-order bug

Each item may be used at most once:

\`\`\`js
function knapsack(items, capacity) {
  const dp = new Array(capacity + 1).fill(0);   // dp[c] = best value within c
  for (const { weight, value } of items) {
    for (let c = capacity; c >= weight; c--) {  // DESCENDING — this is not optional
      dp[c] = Math.max(dp[c], dp[c - weight] + value);
    }
  }
  return dp[capacity];
}
\`\`\`

Iterating capacity **ascending** lets \`dp[c - weight]\` already include the current item, so the item gets reused — that solves the *unbounded* knapsack instead and returns a plausible, larger, wrong number. One character of loop direction changes which problem you solved.

### Two-dimensional state

When the answer depends on positions in two sequences, the table is a grid:

\`\`\`js
function longestCommonSubsequence(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1                        // characters match: extend
        : Math.max(dp[i - 1][j], dp[i][j - 1]);       // skip one side
    }
  }
  return dp[a.length][b.length];
}
\`\`\`

O(n·m) instead of exponential. Row \`i\` means "the first \`i\` characters", so the character it refers to is \`a[i - 1]\` — that shifted indexing is the off-by-one that costs everyone an hour. And build the grid with \`Array.from\`, never \`new Array(n).fill(new Array(m))\`: every row would be the same array (Chapter 1).

### Where to go next

You now have the complete toolkit: complexity analysis, the scanning patterns, the core structures, traversal, and DP. Heaps and priority queues, union-find, Dijkstra, and topological sorting come next — each one a variation on something already in this course.
        `,
        [
          q('Why is the coinChange table filled with Infinity rather than -1 for unreachable amounts?', [
            'Infinity compares faster than a number',
            'Because Math.min would pick a -1 sentinel as the cheapest option, while Infinity + 1 stays Infinity',
            'Because dp[0] must be Infinity',
            'To avoid integer overflow on large amounts',
          ], 1, 'The sentinel has to lose every minimum comparison, and only an infinitely large value does that reliably.'),
          q('Which property does merge sort lack, keeping it out of the dynamic programming category?', [
            'Optimal substructure',
            'A base case',
            'A recurrence relation',
            'Overlapping subproblems — each half is solved exactly once',
          ], 3, 'Without repeated subproblems there is nothing for a cache to save, so it stays plain divide and conquer.'),
          q('In the LCS table, why does row i compare a[i - 1] rather than a[i]?', [
            'Because row i means the first i characters, and row 0 is the empty prefix',
            'Because the table is filled backwards',
            'To skip the empty string case',
            'Because dp[0][0] holds the final answer',
          ], 0, 'Row and column 0 stand for empty prefixes, so every table index sits one ahead of the string index.'),
        ]),
        lesson('Greedy Algorithms and When They Fail', 13, `
A greedy algorithm makes the locally best choice and never reconsiders it. When that is valid it is dramatically cheaper than dynamic programming — one sort and one pass instead of a table. When it is not, it returns a plausible answer that is quietly wrong, which is considerably worse than being slow.

### Interval scheduling: the canonical win

One room, a list of requested meetings, fit as many as possible:

\`\`\`js
function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);   // by END time
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }          // take it
  }
  return count;
}
\`\`\`

O(n log n), dominated by the sort, and the result is provably optimal. The proof is an **exchange argument**: take any optimal schedule and compare its first meeting with the earliest-finishing one. Swapping the earliest finisher in can never create a conflict, because it frees the room no later than the meeting it replaced. So some optimal solution starts with the greedy choice, and induction handles the rest.

### The sort key *is* the algorithm

Run the intuitive alternatives on \`[[0, 10], [1, 3], [4, 6]]\`:

| Sort by | Takes | Count |
|---|---|---|
| Earliest start | [0,10] | 1 |
| Shortest duration | [1,3], [4,6] | 2 |
| **Earliest end** | [1,3], [4,6] | **2** |

Shortest-duration looks fine. Now try \`[[0, 3], [2, 5], [4, 7]]\`: it takes the short middle meeting first and blocks both others, scoring 1 where earliest-end scores 2. Greedy failures nearly always look like this — a key that is right on every example you thought of and wrong on the one you did not. That is why the exchange argument matters more than the intuition.

### Where greedy is simply wrong

Coin change with \`[1, 3, 4]\` and amount 6: largest-coin-first gives \`4 + 1 + 1\`, three coins, while the optimum is \`3 + 3\`. Taking the 4 changes what the remaining subproblem *is*, and greedy has no way to unwind it — which is exactly why the dynamic programming topic in this chapter builds a table instead.

0/1 knapsack fails for the same reason. Capacity 10, items \`A(weight 6, value 70)\`, \`B(weight 5, value 50)\`, \`C(weight 5, value 50)\`. By value per weight, A leads at 11.7 against 10.0, so greedy takes A and then nothing else fits in the remaining 4 — total 70. Taking B and C fills the capacity exactly for 100.

The rule of thumb: greedy is safe when a choice never changes the structure of what remains, and unsafe when choices compete for a shared budget. Fractional knapsack, where you may take half an item, is greedy-solvable because the best-ratio item can always fill the capacity exactly; 0/1 is not, and that single word is the entire difference.

### Greedy inside algorithms you already know

| Algorithm | Greedy choice | Why it is safe |
|---|---|---|
| Kruskal | the cheapest edge joining two groups | the lightest edge crossing a cut is in some MST |
| Dijkstra | the closest unsettled node | with non-negative weights, nothing later can improve it |
| Huffman coding | merge the two rarest symbols | the rarest symbols must end up deepest in the tree |
| Interval scheduling | earliest finishing time | the exchange argument above |

Every row carries a *reason*. A greedy algorithm without one is a guess with good posture.

### How to actually decide

Do not settle this in your head. Write the brute force — for small n, try every subset or permutation — and fuzz the greedy against it:

\`\`\`js
for (let t = 0; t < 5000; t++) {
  const input = randomSmallInput();          // n <= 8, values 1..9
  if (greedy(input) !== bruteForce(input)) {
    console.log('counterexample', JSON.stringify(input));
    break;
  }
}
\`\`\`

Five thousand random eight-item inputs will surface a greedy counterexample within seconds if one exists. If nothing shows up you still owe yourself the exchange argument — but you are no longer one unlucky denomination away from shipping the coin-change bug.
        `,
        [
          q('Sorting meetings by shortest duration instead of earliest end time can be wrong. Which input shows it?', [
            '[[0,1],[1,2],[2,3]]',
            '[[0,10],[1,3],[4,6]]',
            '[[0,3],[2,5],[4,7]], where the short middle meeting blocks the two that could both fit',
            '[[0,2],[3,5]]',
          ], 2, 'The middle interval is the shortest but overlaps both others, so taking it first costs a meeting.'),
          q('What is an exchange argument used for?', [
            'Swapping two elements to sort them faster',
            'Showing that some optimal solution begins with the greedy choice, which is what makes the algorithm provably correct',
            'Trading memory for time',
            'Converting a greedy algorithm into a dynamic programming one',
          ], 1, 'It transforms an arbitrary optimal solution into one that agrees with the greedy pick, without making it worse.'),
          q('Why is fractional knapsack greedy-solvable while 0/1 knapsack is not?', [
            'Fractional inputs are smaller',
            'Fractions avoid floating point issues',
            'The 0/1 version has no optimal substructure',
            'A divisible item always fills the remaining capacity exactly, so no choice ever strands part of the shared budget',
          ], 3, 'Indivisible items can leave capacity unusable, which is how the best ratio locally becomes the wrong use of a fixed budget.'),
        ]),
      ],
      [
        q('Why does graph DFS need a visited set when tree DFS does not?', [
          'Graphs can contain cycles, so an unguarded traversal revisits nodes forever',
          'Graphs have more nodes',
          'Graph nodes have no children property',
          'Because graphs are always directed',
        ], 0, 'A single undirected edge is already a two-node cycle, so without visited the recursion never terminates.'),
        q('In BFS, why mark a node visited when enqueuing rather than when dequeuing?', [
          'It makes the distances smaller',
          'Dequeue does not have access to the node',
          'Otherwise a node can be enqueued many times, blowing up the queue',
          'It changes BFS into DFS',
        ], 2, 'Marking on dequeue lets several neighbours push the same node before it is ever processed.'),
        q('BFS finds shortest paths only when...', [
          'The graph is a tree',
          'The graph is undirected',
          'The graph is connected',
          'All edges have equal weight',
        ], 3, 'Equal edge costs are what make discovery order match distance order; weighted graphs need Dijkstra.'),
        q('In 0/1 knapsack with a 1-D table, why does the capacity loop count downward?', [
          'To finish faster',
          'Ascending would read a value already updated with the current item, allowing reuse',
          'Because dp[0] must be written last',
          'To avoid negative indices',
        ], 1, 'Descending guarantees dp[c - weight] still refers to the state before this item, enforcing at-most-once use.'),
      ]
    ),
    chapter(
      'Heaps, Priority Queues, and Union-Find',
      'The structures that answer "what is the smallest thing left?" and "are these two already connected?" — and the weighted-graph algorithms built on them.',
      [
        lesson('Heaps and the Priority Queue', 14, `
A heap answers exactly one question quickly: **what is the smallest item still in the collection?** It cannot look up by key, it cannot iterate in order, and that narrowness is what buys O(log n) insertion and removal with O(1) peek.

### A tree stored in a flat array

A binary heap is a **complete** binary tree — every level full except the last, which fills left to right. Because the shape is fixed, no node objects are needed (Chapter 4's tree without the pointers); position is arithmetic:

\`\`\`js
const parent = (i) => (i - 1) >> 1;
const left   = (i) => 2 * i + 1;
const right  = (i) => 2 * i + 2;
\`\`\`

The **heap property** is that every node is smaller than or equal to both of its children. Note what it does *not* say: siblings are unordered and the array is not sorted. \`heap[0]\` is the minimum, but the second smallest is \`heap[1]\` *or* \`heap[2]\` — treating the backing array as a sorted list is the classic misreading of this structure.

### The implementation

\`\`\`js
class MinHeap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }

  push(x) {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {                                   // sift up
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[i], this.a[p]) >= 0) break; // parent is smaller: done
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
      i = p;
    }
  }

  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;                               // last leaf becomes the root
      let i = 0;
      for (;;) {                                      // sift down
        const l = 2 * i + 1, r = 2 * i + 2;
        let small = i;
        if (l < this.a.length && this.cmp(this.a[l], this.a[small]) < 0) small = l;
        if (r < this.a.length && this.cmp(this.a[r], this.a[small]) < 0) small = r;
        if (small === i) break;
        [this.a[i], this.a[small]] = [this.a[small], this.a[i]];
        i = small;
      }
    }
    return top;
  }
}
\`\`\`

Both loops walk a single root-to-leaf path, and a complete tree of n nodes has height ⌊log₂ n⌋ — that is the whole O(log n) argument.

Sift down must compare against **both** children and descend into the smaller one. Comparing only the left child throws nothing and leaves an array of exactly the right length, so the bug looks like no bug at all — but the ordering is gone: on random input the pop sequence comes out wrong almost every time, and even \`peek\` is usually not the minimum.

The comparator obeys the \`sort\` rule from Chapter 2: return a **number**. Writing \`(a, b) => a < b\` yields \`true\`/\`false\`, which coerce to 1 and 0, so "a comes first" can never be expressed and the heap quietly stops being a heap. For a max-heap, flip the subtraction: \`(a, b) => b - a\`.

### Top-k without sorting

\`\`\`js
function topK(nums, k) {
  const heap = new MinHeap();          // holds the k largest values seen so far
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop();   // evict the smallest survivor
  }
  return heap.a;
}
\`\`\`

O(n log k) time and O(k) space, versus O(n log n) for sorting — and unlike sorting it never needs the whole input in memory, so it runs over a log file larger than RAM. To keep the k **largest** you use a **min**-heap, because the element you must be able to evict cheaply is the smallest of the ones you kept. That inversion trips up everyone the first time.

### Costs

| Operation | Cost |
|---|---|
| \`peek\` | O(1) |
| \`push\` | O(log n) |
| \`pop\` | O(log n) |
| build from an existing array | **O(n)** by sifting down from index \`(n>>1)-1\` to 0 |
| build by pushing one at a time | O(n log n) |
| find or delete an arbitrary value | O(n) — there is no index |

That last row is why a heap never replaces a Map or a balanced tree (Chapter 4). It is the right structure only when you always want the extreme element next: schedulers, event loops, merging k sorted streams, and Dijkstra's algorithm in the next lesson.
        `,
        [
          q('heap.a[0] is the minimum. Where is the second smallest element?', [
            'Always at a[1]',
            'At a[1] or a[2] — siblings are unordered and the array is not sorted',
            'At the end of the array',
            'Wherever the most recent push landed',
          ], 1, 'The heap property relates parents to children only, so the runner-up is one of the two root children.'),
          q('A sift-down that compares only the left child produces which symptom?', [
            'A crash when the last element is popped',
            'An array of the wrong length',
            'No error at all — the array looks fine but pop stops returning the minimum',
            'An infinite loop',
          ], 2, 'Nothing throws and the length stays correct, so the only evidence is wrong ordering, which casual testing misses.'),
          q('Building a heap from an existing array of n items costs what, and how?', [
            'O(n log n), by pushing each item in turn',
            'O(log n), because only the root has to move',
            'O(n squared), because each sift is linear',
            'O(n), by sifting down from index (n>>1)-1 back to 0',
          ], 3, 'Most nodes sit near the leaves and barely move, so the bottom-up build is linear while repeated pushes are not.'),
        ]),
        lesson('Dijkstra and Topological Sort', 15, `
BFS finds shortest paths only when every edge costs the same (Chapter 5). Put a number on each edge — kilometres, latency, price — and the cheapest route may take more hops than the direct one. **Dijkstra's algorithm** is BFS with the plain queue replaced by the heap you just built.

### Weighted adjacency

\`\`\`js
// adj[u] is a list of [neighbour, weight] pairs
function buildWeighted(n, edges) {
  const adj = Array.from({ length: n }, () => []);   // never new Array(n).fill([])
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);        // drop this line for a directed graph
  }
  return adj;
}
\`\`\`

### The algorithm

\`\`\`js
function dijkstra(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeap((a, b) => a[0] - b[0]);   // entries are [distance, node]
  pq.push([0, start]);

  while (pq.size()) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;        // stale entry: u was already settled cheaper
    for (const [v, w] of adj[u]) {
      const cand = d + w;
      if (cand < dist[v]) {           // relax the edge
        dist[v] = cand;
        pq.push([cand, v]);           // push a fresh entry; never edit one in place
      }
    }
  }
  return dist;
}
\`\`\`

A binary heap has no decrease-key operation, so improving a distance means pushing a second entry for the same node and ignoring the obsolete one when it surfaces. That single \`if (d > dist[u]) continue;\` is the lazy deletion, and without it every stale copy re-expands its neighbours — still correct, but the work multiplies. Total cost is **O((V + E) log V)**.

Do **not** carry over the BFS habit of marking a node visited when you enqueue it. In BFS the first arrival is optimal; in Dijkstra a node's distance is only a guess until it comes *off* the heap, because a longer path made of cheaper edges can still arrive later. Marking on enqueue produces answers that are correct on most graphs and silently too large on the ones that matter.

The non-negative-weight requirement follows from the same invariant: once popped, a distance is final, which assumes no future edge can lower it. A negative edge breaks that assumption — use **Bellman-Ford** (O(V·E)), which also reports negative cycles.

### Topological sort

A directed acyclic graph of prerequisites has at least one order in which everything can be done. Kahn's algorithm finds one by repeatedly taking whatever has nothing left waiting on it:

\`\`\`js
function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);
  for (const [u, v] of edges) {   // edge u → v means "u must come before v"
    adj[u].push(v);
    indegree[v]++;
  }

  const queue = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);

  const order = [];
  let head = 0;                                 // index-based queue, not shift()
  while (head < queue.length) {
    const u = queue[head++];
    order.push(u);
    for (const v of adj[u]) {
      if (--indegree[v] === 0) queue.push(v);   // last prerequisite just cleared
    }
  }
  return order.length === n ? order : null;     // short output means a cycle
}
\`\`\`

That final length comparison is the cycle detector, and it is the step people skip. Nodes inside a cycle never reach indegree 0, so they never enter the queue; returning \`order\` unchecked hands back a partial build plan that looks perfectly valid until something downstream is missing. This is how a package manager orders installs, how a build tool orders tasks, and how a spreadsheet decides what to recalculate.

One bonus: on a DAG processed in topological order you can relax edges directly, no heap required — O(V + E) shortest paths, and negative weights are fine, because the order already guarantees every predecessor is final.
        `,
        [
          q('Why is the BFS habit of marking a node visited on enqueue wrong in Dijkstra?', [
            'A distance is final only when the node is popped, because a longer path of cheaper edges can still arrive later',
            'Because the heap keeps no visited set',
            'Because Dijkstra visits every node twice by design',
            'Because the edges are undirected',
          ], 0, 'Discovery order follows hops in BFS but cost in Dijkstra, so only the pop order settles a distance.'),
          q('One edge in your weighted graph has weight -3. What should you run?', [
            'Dijkstra, with that edge removed',
            'Dijkstra, after adding 3 to every edge weight',
            'Bellman-Ford, which tolerates negative edges and reports negative cycles',
            'BFS, since weights no longer matter',
          ], 2, 'Dijkstra assumes a popped distance can never improve, and shifting every weight by a constant changes which path is cheapest.'),
          q('On a DAG processed in topological order, shortest paths cost O(V + E) with no heap. Why?', [
            'Because a DAG has no edges to relax twice',
            'Because every predecessor of a node is already final when the node is processed',
            'Because topological order is distance order',
            'Because indegree equals distance',
          ], 1, 'The ordering guarantees all incoming edges were relaxed first, which is exactly what the priority queue was buying.'),
        ]),
        lesson('Union-Find and Minimum Spanning Trees', 13, `
Union-find — a **disjoint set union**, or DSU — tracks a partition of items into groups and answers two questions in effectively constant time: which group does x belong to, and merge the groups containing x and y.

Chapter 5 counted connected components with DFS in O(V + E). That is fine once. When edges arrive one at a time — friendships, account merges, network links coming up — rerunning DFS after every edge is O(E·(V+E)). DSU absorbs each new edge in near-constant time.

### The implementation

\`\`\`js
class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);  // each item is its own root
    this.size = new Array(n).fill(1);
    this.count = n;                                        // number of groups
  }

  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];   // path halving: skip a level
      x = this.parent[x];
    }
    return x;                                        // the root identifies the group
  }

  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                     // already in the same group
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                            // small tree hangs off the large
    this.size[ra] += this.size[rb];
    this.count--;
    return true;
  }

  connected(a, b) { return this.find(a) === this.find(b); }
}
\`\`\`

Two optimisations are both doing work. **Path halving** flattens the tree as a side effect of every lookup, so repeated queries get cheaper. **Union by size** keeps the larger tree as the root so depth grows as slowly as possible. Together, m operations cost O(m·α(n)), where α is the inverse Ackermann function — under 5 for any n that fits in a computer, so treat it as constant. Drop union by size and a chain of unions can build a degenerate tree of depth n, exactly like the unbalanced BST in Chapter 4.

The classic bug is testing \`parent[a] === parent[b]\` instead of \`find(a) === find(b)\`. Two members of the same group routinely have different immediate parents; only the **root** identifies a group. The same mistake in \`union\` — writing \`parent[a] = b\` without finding roots first — silently detaches a whole subtree from its group.

### Cycle detection, one line

\`\`\`js
function hasCycleUndirected(n, edges) {
  const dsu = new DSU(n);
  for (const [u, v] of edges) {
    if (!dsu.union(u, v)) return true;   // endpoints were already connected
  }
  return false;
}
\`\`\`

Compare with Chapter 5's directed version, which needed a separate \`onPath\` set. Undirected connectivity is where DSU shines.

### Kruskal's minimum spanning tree

Connect every node for the least total edge weight: sort the edges cheapest first and take any that joins two groups.

\`\`\`js
function kruskal(n, edges) {
  const dsu = new DSU(n);
  const chosen = [];
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    if (dsu.union(u, v)) {                    // false means it would close a cycle
      chosen.push([u, v, w]);
      if (chosen.length === n - 1) break;     // a spanning tree has exactly n-1 edges
    }
  }
  return dsu.count === 1 ? chosen : null;     // still >1 group: graph is disconnected
}
\`\`\`

Sorting dominates, so this is O(E log E). Note \`[...edges]\` — \`sort\` mutates in place (Chapter 2), and reordering the caller's edge list as a side effect is a real bug in a shared codebase.

### What union-find cannot do

There is no un-union: it merges only. It cannot list a group's members without scanning all n items, and it knows *whether* two nodes are connected but not *how* — for the actual route you still need BFS or DFS.

| Question | Tool |
|---|---|
| Connected? edges arriving over time | Union-find |
| Fewest hops, all edges equal | BFS (Chapter 5) |
| Cheapest route, non-negative weights | Dijkstra |
| A valid order given prerequisites | Topological sort |
| Cheapest edge set connecting everything | Kruskal + union-find |
        `,
        [
          q('What goes wrong if you drop union by size and always attach the first root to the second?', [
            'Groups merge incorrectly',
            'count stops being accurate',
            'A chain of unions can build a tree of depth n, making find O(n)',
            'Path halving stops working',
          ], 2, 'Without keeping the larger tree as the root the structure degenerates exactly like an unbalanced BST.'),
          q('kruskal sorts [...edges] rather than edges. Why does the copy matter?', [
            'sort mutates in place, so sorting the argument reorders the caller list as a side effect',
            'Spreading makes the sort stable',
            'sort cannot read an array declared const',
            'To convert the tuples into real arrays',
          ], 0, 'Array#sort reorders the original array, and silently rearranging a shared input is a real bug.'),
          q('Which question can union-find NOT answer?', [
            'Are these two nodes in the same group?',
            'How many groups are there right now?',
            'Did this edge join two previously separate groups?',
            'What is the actual route between these two nodes?',
          ], 3, 'DSU records group membership through roots only, so producing a path still requires BFS or DFS.'),
        ]),
        lesson('Negative Weights: Bellman-Ford and Floyd-Warshall', 14, `
Dijkstra settles a node the moment it leaves the heap, and that is sound only while every edge adds cost. One negative edge and the guarantee is gone.

### The three-node counterexample

Edges: \`A → B\` costs 2, \`A → C\` costs 3, \`C → B\` costs −2.

Dijkstra pops B at distance 2 and marks it final. The true cheapest route is \`A → C → B\` at \`3 − 2 = 1\`, discovered afterwards and thrown away, because a settled node is never revisited. The output is not slightly off — it is wrong, silently, on a graph of three nodes.

And no, you cannot rescue it by adding 2 to every weight. That adds 2 *per hop*, which penalises longer routes and changes which path is cheapest.

### Bellman-Ford: relax everything, V − 1 times

\`\`\`js
function bellmanFord(n, edges, start) {     // edges: [u, v, w], directed
  const dist = new Array(n).fill(Infinity);
  dist[start] = 0;

  for (let round = 0; round < n - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;                    // settled early, no later round helps
  }

  for (const [u, v, w] of edges) {          // one extra round
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;   // negative cycle
  }
  return dist;
}
\`\`\`

Why \`n − 1\` rounds: a shortest path visits each node at most once, so it uses at most \`n − 1\` edges, and after round *k* every shortest path of *k* edges is correct. The cost is **O(V·E)** against Dijkstra's O((V + E) log V), which is why this is the fallback and not the default.

The \`dist[u] !== Infinity\` guard is not decoration. \`Infinity + (-3)\` is still \`Infinity\`, so it survives here — but the moment someone swaps in a sentinel like \`1e9\`, unreachable nodes start relaxing into plausible finite distances that no test catches.

The early \`break\` is worth keeping: on most real graphs distances stop changing long before round \`n − 1\`.

### Negative cycles are the feature

If any edge still improves after \`n − 1\` rounds, some cycle has negative total weight and "shortest path" has no answer at all — go around the loop again and the cost drops forever. Detecting that is often the actual goal. Model currency pairs as a graph with edge weight \`−log(rate)\` and a negative cycle is precisely an arbitrage: a sequence of trades that returns more than it consumed.

### Floyd-Warshall: every pair at once

When you want distances between all pairs on a small dense graph, three loops beat running a single-source algorithm V times:

\`\`\`js
function floydWarshall(dist) {        // dist[i][j] = weight, Infinity if no edge
  const n = dist.length;
  for (let k = 0; k < n; k++) {       // k OUTERMOST — the loops are not interchangeable
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return dist;
}
\`\`\`

\`k\` is not a loop counter, it is the DP state: after iteration \`k\`, \`dist[i][j]\` holds the best route using only nodes \`0..k\` as intermediates — dynamic programming in three lines. Move \`k\` inside and the recurrence reads states that have not been computed yet; the answers come out right on many graphs and wrong on any path whose intermediates need a later round, which is the worst possible failure mode. Afterwards, \`dist[i][i] < 0\` for any \`i\` means a negative cycle.

O(V³) time and O(V²) space: 500 nodes is 125 million operations and fine, 5,000 nodes is not.

### Picking one

| Situation | Algorithm | Cost |
|---|---|---|
| Unweighted, one source | BFS | O(V + E) |
| Non-negative weights, one source | Dijkstra | O((V + E) log V) |
| Negative edges, or you need cycle detection | Bellman-Ford | O(V·E) |
| All pairs, dense, small V | Floyd-Warshall | O(V³) |
| DAG, any weights | relax in topological order | O(V + E) |

Reach for the cheapest row your graph allows. Bellman-Ford is not a better Dijkstra; it is the price of admitting negative edges.
        `,
        [
          q('Edges A→B costs 2, A→C costs 3, C→B costs −2. What does Dijkstra report for B?', [
            '2 — it settles B on pop and never revisits it, missing the A→C→B route worth 1',
            '1, which is correct',
            'Infinity, because negative edges are skipped',
            'It throws on the negative weight',
          ], 0, 'A settled distance is treated as final, so a cheaper route discovered later is never applied.'),
          q('Why does Bellman-Ford run exactly V − 1 relaxation rounds?', [
            'Because a spanning tree has V − 1 edges',
            'To match the size of the priority queue',
            'Because a shortest path visits each node at most once, so it has at most V − 1 edges',
            'Because the graph is assumed acyclic',
          ], 2, 'Each round finalises paths one edge longer, and no shortest path can be longer than V − 1 edges.'),
          q('In Floyd-Warshall, what happens if the k loop is not the outermost one?', [
            'The result comes back transposed',
            'Some shortest paths are wrong, because k is the DP state — after round k only nodes 0..k may be intermediates',
            'It runs in O(V squared) instead',
            'Negative cycles stop being detectable',
          ], 1, 'Moving k inside makes the recurrence read table entries that have not been computed yet.'),
        ]),
      ],
      [
        q('Why does the top-k routine keep the k largest values in a min-heap rather than a max-heap?', [
          'A max-heap cannot store more than one value per key',
          'Min-heaps use less memory',
          'The item you must evict is the smallest of the ones kept, and that is the min-heap root',
          'Because sorting the array first is required either way',
        ], 2, 'Eviction always removes the weakest survivor, so the heap must make that element the cheapest one to reach.'),
        q('What does "if (d > dist[u]) continue;" accomplish in Dijkstra?', [
          'It skips stale heap entries left behind because a binary heap has no decrease-key',
          'It stops the algorithm once the goal is reached',
          'It rejects negative edge weights',
          'It prevents the distance array from overflowing',
        ], 0, 'Improved distances are pushed as new entries, so the obsolete copies must be recognised and ignored when they surface.'),
        q('Kahn\'s topological sort returns an order containing fewer than n nodes. What does that mean?', [
          'The graph is disconnected',
          'Some node has indegree greater than one',
          'The queue was drained too early',
          'The graph contains a cycle, so those nodes never reached indegree zero',
        ], 3, 'Every node in a cycle keeps at least one unsatisfied prerequisite forever, so it is never enqueued.'),
        q('Why is parent[a] === parent[b] the wrong connectivity test in union-find?', [
          'parent is a private field',
          'Members of one group can have different immediate parents; only the root identifies the group',
          'It ignores union by size',
          'It works only after path compression has run',
        ], 1, 'Group membership is defined by the root of the tree, which find() returns and a direct parent lookup does not.'),
      ]
    ),
    chapter(
      'Algorithms in Production',
      'Proving the fast version is correct, measuring whether it is actually faster, and choosing structures under real constraints.',
      [
        lesson('Testing Against a Brute-Force Oracle', 13, `
The optimised solution is the one you cannot trust. The obvious O(n²) version you wrote first is short enough to verify by reading — so do not delete it. Keep it as the **oracle** and make it judge the fast one.

### The pattern

\`\`\`js
// Obviously correct, hopelessly slow. This is the specification.
function maxSumSlow(nums, k) { /* the double loop from Chapter 2 */ }

// The sliding-window version you actually ship.
function maxSum(nums, k) { /* … */ }
\`\`\`

Now generate inputs and compare:

\`\`\`js
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

function fuzz(trials = 2000) {
  for (let t = 0; t < trials; t++) {
    const n = randInt(1, 12);                                   // SMALL on purpose
    const nums = Array.from({ length: n }, () => randInt(-5, 5));
    const k = randInt(1, n);

    const expected = maxSumSlow(nums, k);
    const actual = maxSum(nums, k);
    if (actual !== expected) {
      throw new Error('mismatch: ' + JSON.stringify({ nums, k, expected, actual }));
    }
  }
}
\`\`\`

Two decisions carry all the value here.

**Keep n small.** A bug that appears at n = 5,000 almost always appears at n = 12 too, and a twelve-element counterexample is one you can trace by hand in two minutes. A five-thousand-element one tells you only that something is wrong.

**Print the failing input.** A test that reports \`expected 7, got 6\` and nothing else has proved a bug exists and then thrown away the only copy of it — with \`Math.random\` driving the input, you cannot even reproduce it. That is the classic mistake with randomised testing, and it is why the \`JSON.stringify\` above is not decoration.

Narrow the value range too. Drawing from \`-5..5\` produces duplicates, ties, and zeros constantly, and that is where bugs live: the duplicate branch of a binary search (Chapter 2), a \`||\` that should have been \`??\` (Chapter 1), a window that assumed non-negative numbers. Values drawn from 0 to a billion never collide, so those branches are never exercised.

### Shrink the counterexample

\`\`\`js
// Repeatedly drop an element while the failure survives.
function shrink(nums, k, stillFails) {
  let best = nums;
  for (let i = 0; i < best.length; i++) {
    const smaller = [...best.slice(0, i), ...best.slice(i + 1)];
    if (smaller.length >= k && stillFails(smaller, k)) {
      best = smaller;
      i = -1;                     // restart the scan on the smaller input
    }
  }
  return best;
}
\`\`\`

A twelve-element failure often shrinks to three, and three elements usually make the bug self-evident.

### When there is no oracle, assert invariants

Some outputs have no slow reference implementation, but every structure in this course has properties that must always hold:

\`\`\`js
function assertHeap(a, cmp) {                        // Chapter 6
  for (let i = 1; i < a.length; i++) {
    if (cmp(a[(i - 1) >> 1], a[i]) > 0) throw new Error('heap property broken at ' + i);
  }
}
\`\`\`

A BST is valid if inorder traversal is sorted (Chapter 4). Dijkstra is correct only if \`dist[v] <= dist[u] + w\` for **every** edge. A sort is correct if the output is non-decreasing *and* a permutation of the input — checking only the ordering passes a function that returns an array of zeros.

### Edge cases that deserve permanent tests

| Input | What it breaks |
|---|---|
| Empty array | \`arr[0]\`, \`Math.max()\` returning \`-Infinity\`, division by length |
| One element | Two-pointer loops, \`k - 1\` window arithmetic |
| All values identical | Deduplication, comparators, binary-search boundaries |
| Already sorted, and reversed | Quicksort pivots, degenerate BST (Chapter 4) |
| Duplicates of the target | Plain binary search versus \`lowerBound\` (Chapter 2) |
| Negatives and zero | Sliding windows, and nullish-versus-falsy defaulting (Chapter 1) |
| n at the documented limit | Recursion depth, hidden O(n²) |

Every one of those is a bug someone shipped.
        `,
        [
          q('Why draw fuzz values from -5..5 rather than 0..1,000,000,000?', [
            'Small numbers avoid floating point error',
            'Large numbers make the oracle too slow',
            'Narrow ranges produce duplicates, ties, and zeros — the branches where bugs live',
            'Math.random is biased over large ranges',
          ], 2, 'Values drawn from a huge range almost never collide, so duplicate and boundary handling is never exercised.'),
          q('A sort is verified only by checking that the output is non-decreasing. What passes that check but is wrong?', [
            'A stable sort',
            'A function that returns an array of zeros',
            'A sort that reverses ties',
            'A sort that mutates its input',
          ], 1, 'The output must also be a permutation of the input, otherwise any ordered array satisfies the assertion.'),
          q('What does the shrink helper do with a failing input?', [
            'It removes elements while the failure still reproduces, until a tiny counterexample remains',
            'It reruns the test with a fixed random seed',
            'It sorts the input so the bug is easier to see',
            'It converts the input to JSON for logging',
          ], 0, 'Dropping everything not needed to trigger the bug usually turns twelve elements into three self-explanatory ones.'),
        ]),
        lesson('Measuring Instead of Guessing', 14, `
Big-O tells you how cost grows. It says nothing about whether this particular function is worth optimising today, and the answer to that is almost never where you guessed.

### Time the growth, not the milliseconds

\`\`\`js
import { performance } from 'node:perf_hooks';

function timeOnce(fn, input) {
  const t0 = performance.now();
  fn(input);
  return performance.now() - t0;
}

function growth(fn, make) {
  let prev = 0;
  for (const n of [1000, 2000, 4000, 8000, 16000]) {
    const input = make(n);
    fn(input);                                  // warm-up: let the JIT compile it
    const runs = [];
    for (let i = 0; i < 7; i++) runs.push(timeOnce(fn, input));
    runs.sort((a, b) => a - b);
    const ms = runs[3];                         // median of 7
    console.log(n, ms.toFixed(2) + 'ms', prev ? 'x' + (ms / prev).toFixed(1) : '');
    prev = ms;
  }
}
\`\`\`

Doubling n and reading the **ratio** identifies the complexity class directly: about 2× is linear, a little over 2× is n log n, about 4× is quadratic, about 8× is cubic, and a ratio that itself grows with every doubling is exponential. That ratio is far more trustworthy than reasoning about the source — an accidental \`includes\` inside a loop (Chapter 1) shows up as a clean 4× immediately.

The two lines people leave out are the warm-up and the median. V8 runs the first few calls in the interpreter before optimising, so an unwarmed first measurement can be twenty times slower than steady state and tells you nothing. And a single garbage-collection pause during one run destroys a mean; the median ignores it.

### Constants are real

For small n, the "worse" algorithm frequently wins. Insertion sort is O(n²) and still beats \`Array#sort\` on sixty-four elements or fewer — it touches contiguous memory and calls nothing — which is why real sort implementations switch to it for short runs. Construction cost decides the rest: building a twenty-entry \`Map\` costs about as much as fifty linear scans of the same array, so a lookup table you build, use a few times and throw away loses to the array outright, while one you build once and hit thousands of times wins easily. Asymptotics only take over once n is large enough to pay off the constant factor — measure before replacing a small array in a hot loop.

Allocation is the hidden constant. \`arr.slice()\` inside a loop, a spread per iteration, a fresh object per node: none of these change the Big-O, and all of them can double the wall-clock time. Merge sort's O(n) allocation per level (Chapter 2) is exactly why an in-place quicksort usually wins in practice despite the worse worst case.

### Profile before you optimise

\`\`\`bash
node --cpu-prof --cpu-prof-dir=./prof app.js   # writes a .cpuprofile file
\`\`\`

Open the profile in Chrome DevTools and sort by self time. Optimising a function responsible for 2% of the runtime caps your improvement at 2% — the most common way engineers spend a week and ship nothing measurable.

### Memory is measurable too

\`\`\`js
const before = process.memoryUsage().heapUsed;
const index = buildIndex(rows);
console.log(((process.memoryUsage().heapUsed - before) / 1e6).toFixed(1) + ' MB');
\`\`\`

Watch **retention**, not allocation. A \`Map\` used as a cache keeps every key it has ever seen alive; the array-backed queue in Chapter 3 keeps dequeued items alive until the dead prefix is compacted. Steady memory growth in a long-running server is nearly always a structure that only ever grows.

### Do the arithmetic before writing anything

A modern engine manages roughly 10⁸ simple JavaScript operations per second. That single number converts a complexity into an estimate:

| n | O(n log n) | O(n²) |
|---|---|---|
| 1,000 | instant | instant |
| 100,000 | ~0.02 s | ~100 s |
| 1,000,000 | ~0.2 s | not today |

Five seconds of that arithmetic tells you whether you need a better algorithm or merely a better constant — and which of the two your afternoon should go to.
        `,
        [
          q('Why does the timing harness call fn(input) once before recording anything?', [
            'To warm the CPU cache with the result',
            'To let V8 optimise the function, since an unwarmed first run can be twenty times slower than steady state',
            'To check that the function does not throw',
            'To force a garbage collection',
          ], 1, 'The first few calls run in the interpreter, so an unwarmed measurement describes the JIT rather than the algorithm.'),
          q('Why take the median of seven runs instead of the mean?', [
            'The median is cheaper to compute',
            'A mean is undefined for an odd number of samples',
            'One garbage-collection pause destroys a mean but barely moves a median',
            'Medians round to whole milliseconds',
          ], 2, 'Pauses from GC or scheduling have nothing to do with the code under test, and only the median ignores them.'),
          q('A profile shows a function at 2% self time. What is the ceiling on optimising it?', [
            'About 2% of total runtime, no matter how much faster you make that function',
            '50%, because self time excludes callees',
            'It depends on the complexity class',
            'There is no ceiling',
          ], 0, 'You cannot save more than the share of time actually spent inside the code you changed.'),
        ]),
        lesson('Choosing Structures Under Real Constraints', 15, `
Every structure in this course trades one thing for another. Production adds constraints the textbook version ignores: bounded memory, data that never stops arriving, and a latency budget per request.

### An LRU cache in twenty lines

A JavaScript \`Map\` iterates in insertion order (Chapter 1), and \`delete\` followed by \`set\` moves a key to the back. That gives a true O(1) least-recently-used cache without the doubly linked list textbooks use:

\`\`\`js
class LRU {
  constructor(limit) { this.limit = limit; this.map = new Map(); }

  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);          // reinsert at the back: most recently used
    return value;
  }

  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);   // refresh position, not just value
    this.map.set(key, value);
    if (this.map.size > this.limit) {
      const oldest = this.map.keys().next().value; // first key = least recently used
      this.map.delete(oldest);
    }
  }
}
\`\`\`

The \`delete\` inside \`set\` is the line people skip. Without it, updating an existing key changes the value but leaves the key in its original position, so an entry written constantly and never read is evicted as though it were cold.

And notice what makes this a cache rather than a leak: **the limit**. A plain \`Map\` used as a cache in a long-lived process is an unbounded memory leak with a friendly name.

### A rate limiter is a ring buffer

"100 requests per minute" needs only the last 100 timestamps, which is exactly the circular buffer from Chapter 3:

\`\`\`js
class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.times = new Array(limit).fill(-Infinity);
    this.i = 0;                          // slot holding the oldest of the last N
  }

  allow(now = Date.now()) {
    if (now - this.times[this.i] < this.windowMs) return false;  // N already in window
    this.times[this.i] = now;
    this.i = (this.i + 1) % this.limit;
    return true;
  }
}
\`\`\`

Fixed memory, O(1) per request, no timers, nothing to clean up. The naive version pushes every timestamp into an array and filters it on each call — O(n) per request and unbounded growth, which is precisely the wrong behaviour while you are being flooded.

### When approximate beats exact

| Need | Exact | Approximate |
|---|---|---|
| Seen this URL before? | \`Set\`, O(1) but ~50 bytes per item | **Bloom filter**, ~10 bits per item |
| Distinct visitor count | \`Set\` of ids | **HyperLogLog**, kilobytes for billions |
| Top 10 of a stream | sort everything | **min-heap of size 10** (Chapter 6) |

A Bloom filter is a bit array plus k hash functions: it can report a false positive but **never a false negative**, so "probably seen" costs one redundant lookup and "definitely not seen" is certain. A \`Set\` of a billion URLs does not fit in memory and a Bloom filter does — decide what error rate is acceptable up front, not after the box starts swapping.

### The decision table

| Requirement | Structure |
|---|---|
| Exact membership, fits in memory | \`Set\` / \`Map\` (Chapter 1) |
| Bounded cache, evict the coldest | \`Map\`-based LRU |
| Fixed-size recent history | Ring buffer (Chapter 3) |
| Always take the highest priority next | Heap (Chapter 6) |
| Range queries, sorted scans, "next after x" | Sorted array or balanced tree (Chapter 4) |
| Grouping as connections arrive | Union-find (Chapter 6) |
| Cheapest route on a weighted map | Dijkstra (Chapter 6) |

### Start with the boring one

Use a plain array until measurement says otherwise. Two hundred items scanned linearly costs well under a microsecond — fast enough, simpler, and far easier to debug than anything clever — and the clever version has a failure mode you will meet at 3 a.m. What this course has actually been building is not a reflex to reach for the exotic structure; it is knowing precisely what each one costs, so that when the boring option finally stops working, you already know which trade to make and what it will cost you.
        `,
        [
          q('The naive rate limiter pushes every timestamp into an array and filters it on each call. Why is that the wrong shape?', [
            'It needs a timer to clean up',
            'It becomes O(n) per request with unbounded growth exactly when traffic is highest',
            'It rejects valid requests near the window edge',
            'It cannot express a per-minute limit',
          ], 1, 'The structure grows with the flood it is supposed to absorb, while the ring buffer stays fixed at limit slots.'),
          q('A lookup table of 200 items is scanned linearly in a hot path. What does this topic recommend first?', [
            'Replace it with a Map immediately',
            'Sort it and binary search',
            'Measure — 200 comparisons cost well under a microsecond, and a Map has build and allocation costs of its own',
            'Move it into a database index',
          ], 2, 'Asymptotics only pay off past the crossover point, and for small collections the boring array frequently wins outright.'),
          q('Which requirement points at a ring buffer rather than a Map or a heap?', [
            'Evict the least recently used entry',
            'Always process the highest priority item next',
            'Answer whether a key is present in O(1)',
            'Keep exactly the last N events in fixed memory',
          ], 3, 'A ring buffer trades every other capability for a fixed allocation holding a recent window.'),
        ]),
        lesson('Complexity as an Attack Surface', 14, `
Average-case reasoning assumes the input was not chosen by someone who read your code. When it was, the gap between O(n log n) and O(n²) stops being a performance concern and becomes an availability one — and on a single-threaded Node process, one request that burns the CPU stalls every other connection on the box.

### Do the arithmetic first

At roughly 10⁸ simple operations per second, a request that triggers quadratic work over 100,000 user-supplied items costs 10¹⁰ operations: about 100 seconds of CPU, for one request. No botnet and no bandwidth required — a 2 MB JSON body is enough.

### Regular expressions backtrack

\`\`\`js
const re = /^(a+)+$/;
re.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!');   // does not return in any useful time
\`\`\`

The nested quantifier makes the engine try every way of splitting those \`a\`s between the inner and outer repetition before it can conclude that the trailing \`!\` cannot match — exponentially many splits. Twenty-five characters is already millions of paths; thirty-five is hours. This is **ReDoS**, and the dangerous shapes are recognisable:

| Shape | Example | Safe rewrite |
|---|---|---|
| Quantifier inside a quantifier | \`(a+)+$\` | \`a+$\` |
| Two quantifiers over the same characters | \`(x+x+)+y\` | \`x+y\` |
| Repeated optional group | \`(\\s*,)*\` | \`[\\s,]*\` |

Three mitigations, in order of value: cap the input length before the regex ever runs, keep nested quantifiers away from untrusted data entirely, and use \`split\` or \`indexOf\` for what is really a parsing job. Node has no regex timeout, so an unbounded user string reaching a backtracking pattern is an outage waiting for a scanner to find it.

### Hash flooding

A hash map is O(1) *average* and O(n) per operation when every key lands in the same bucket. Build a \`Map\` keyed by fields from a request body, and an attacker who can predict the hash sends 50,000 colliding keys, turning the insert loop into over a billion comparisons. V8 randomises its hash seed per process, which closes the classic form of this attack, but the general lesson survives untouched: **never let an untrusted request decide how many keys a structure holds.** Cap the count, reject early, and prefer a fixed schema over indexing whatever fields happened to arrive.

### Depth is an input too

\`\`\`js
JSON.parse('{"a":{"a":{"a": … 100000 levels … }}}');
\`\`\`

Recursive parsers, schema validators and your own tree walkers each consume a stack frame per level, so a deeply nested payload is a \`RangeError\` in the best case and a process crash in the worst. Bound the depth while parsing, or make the walk iterative with an explicit stack.

Size amplification is the same idea: a 1 MB compressed body that expands to 10 GB, a search query with 500 wildcards, \`limit=10000000\` on a pagination parameter. Each one is a legitimate-looking request whose cost nobody bounded.

### Choose the worst case, not the average

| Component | Average | Worst | Under adversarial input |
|---|---|---|---|
| Naive quicksort | O(n log n) | O(n²) | sorted or crafted input hits the worst case |
| Hash map | O(1) | O(n) | colliding keys |
| Backtracking regex | near linear | O(2ⁿ) | crafted string |
| Merge sort, heapsort, balanced tree | O(n log n) | O(n log n) | unchanged |

Once the input crosses a trust boundary, the worst-case column is the only one that matters. That is why production sort implementations fall back to heapsort when recursion runs deep, and why a balanced tree is occasionally the safer choice over a hash map despite being slower on paper.

### The checklist

1. **Bound every input** — length, item count, nesting depth, page size — at the edge, before parsing.
2. **Know the worst case** of every structure and algorithm that touches untrusted data.
3. **Test hostile inputs, not just random ones**: the longest allowed string, the deepest allowed object, all-identical values, an already-sorted array.
4. **Measure the worst case**, not the median, for anything reachable from a request handler.

Bounded input plus a worst-case guarantee is the entire defence. This whole course has been about knowing what an operation costs; this is the case where being wrong about it costs you the service rather than a few milliseconds.
        `,
        [
          q('Why can /^(a+)+$/ hang on a 30-character string?', [
            'The engine allocates one object per character',
            'Nested quantifiers make the engine try exponentially many ways to split the input before it can reject',
            'The anchors force a second full pass',
            'RegExp.test is O(n squared) in Node',
          ], 1, 'Catastrophic backtracking explores every partition of the repeated characters, and that count doubles with each one added.'),
          q('What is the first and cheapest ReDoS mitigation?', [
            'Compile the regex once outside the loop',
            'Run the regex on a worker thread',
            'Pass a timeout option to RegExp.test',
            'Cap the length of the untrusted string before the regex ever runs',
          ], 3, 'Exponential growth is only dangerous with room to grow, and Node offers no regex timeout to fall back on.'),
          q('Why does adversarial input argue for merge sort or heapsort over a naive quicksort?', [
            'They allocate less memory',
            'They are faster on average',
            'Their O(n log n) bound is a worst case, while quicksort degrades to O(n squared) on sorted or crafted input',
            'They are stable sorts',
          ], 2, 'An attacker picks the input, so only a guaranteed bound is worth anything.'),
        ]),
      ],
      [
        q('When fuzzing a fast implementation against a brute-force oracle, why generate very small inputs?', [
          'Large inputs make the oracle return different answers',
          'Bugs still surface at that size, and a tiny counterexample can be traced by hand',
          'Math.random is biased on large ranges',
          'Small inputs avoid stack overflows in the oracle',
        ], 1, 'Almost any bug that appears at n = 5000 also appears at n = 12, and only the small case is debuggable.'),
        q('You double n and the measured time goes up roughly 4x each step. What does that indicate?', [
          'Linear time with a large constant',
          'The JIT has not warmed up',
          'O(n log n)',
          'Quadratic behaviour, most likely a linear scan hidden inside a loop',
        ], 3, 'Doubling the input quadruples the work only when the cost grows with the square of n.'),
        q('In the Map-based LRU, why does set() delete an existing key before reinserting it?', [
          'Because Map preserves insertion order, so only reinsertion moves the key to the most-recent end',
          'Because Map.set throws on duplicate keys',
          'To keep the size counter accurate',
          'To trigger garbage collection of the old value',
        ], 0, 'Writing over a key in place leaves it at its old position, so a frequently updated entry would be evicted as if it were stale.'),
        q('What makes a Bloom filter usable as a "have I seen this?" check over billions of items?', [
          'It stores a compressed copy of every key',
          'It is faster than a Set for small inputs',
          'It uses a few bits per item and can return false positives but never false negatives',
          'It keeps the items in sorted order',
        ], 2, 'A "no" is definitive, so the only cost of the approximation is an occasional redundant lookup.'),
      ]
    ),
      chapter(
      'Balanced Trees and Indexed Structures',
      'The structures that keep their O(log n) promise while the data keeps changing, from rotations up to the wide, shallow trees a database stores on disk.',
      [
      lesson('Rotations: Keeping a Tree Short', 13, `
A logging service kept event ids in a hand written BST for months without trouble. Then someone changed the backfill job to read rows \`ORDER BY id\`. The tree turned into a 200,000 node straight line, a lookup went from roughly 18 comparisons to 200,000, and a hot endpoint moved from 4ms to nine seconds. No code changed. Only the arrival order did.

Search cost is height. A **rotation** is the only tool that lowers height without disturbing the ordering invariant, and it costs three pointer writes.

### One rotation, traced

\`\`\`js
function rotateRight(y) {
  const x = y.left;
  y.left = x.right;    // x.right sits between x and y, so y's left slot fits it
  x.right = y;
  updateHeight(y);     // y is now the lower node, so recompute it first
  updateHeight(x);
  return x;            // the caller must reattach this as the subtree root
}
\`\`\`

Take the subtree rooted at 30, whose left child 20 has children 10 and 25. Before the rotation the inorder walk is \`10 20 25 30\`. After \`rotateRight(30)\`, 20 is the root with left child 10 and right child 30, and 25 has moved to \`30.left\`. Inorder walk: \`10 20 25 30\`. Identical.

Only one subtree ever has to move, because 25 is the single value larger than 20 and smaller than 30, and there is exactly one slot with that property. \`rotateLeft\` is the same code with \`left\` and \`right\` swapped.

### AVL: measure, then correct

An AVL node stores its own height. The **balance factor** is \`height(left) - height(right)\`, and it must stay in the set {-1, 0, 1}.

\`\`\`js
function balance(n) {
  updateHeight(n);
  const bf = height(n.left) - height(n.right);
  if (bf > 1) {                                    // left heavy
    if (height(n.left.left) < height(n.left.right)) n.left = rotateLeft(n.left);
    return rotateRight(n);
  }
  if (bf < -1) {                                   // right heavy
    if (height(n.right.right) < height(n.right.left)) n.right = rotateRight(n.right);
    return rotateLeft(n);
  }
  return n;
}
\`\`\`

Call it on the way back up and reassign the result: \`root.left = insert(root.left, v)\`, then \`return balance(root)\`. Four shapes exist, and two of them need the inner rotation first.

| Shape | Where the new node landed | Fix |
|---|---|---|
| LL | left child's left | one right rotation |
| RR | right child's right | one left rotation |
| LR | left child's right | left on the child, then right |
| RL | right child's left | right on the child, then left |

### The bug that hides

Skip \`updateHeight\`, or run it parent before child, and every balance factor you read afterwards is stale. Nothing throws. The checks pass, no rotation fires, and the tree quietly grows a long limb that surfaces weeks later as a latency regression. Assert against it: walk the tree in a test, recompute every height from scratch, and confirm each stored height matches.

Second surprise: insert and delete are not symmetric. An insert needs at most one rotation, single or double, to restore the invariant. A delete shortens a subtree, which can unbalance its parent, which can unbalance its parent, so it may rotate at every level, O(log n) rotations.

### Red-black trees are looser on purpose

An AVL tree holds height under about \`1.44 log2 n\`. A red-black tree only promises \`2 log2(n + 1)\`, so it runs up to 40 percent taller and a lookup does a few more comparisons. In exchange it does far less work per write: at most two rotations on insert, three on delete, and the rest of the repair is recolouring, which is a field write rather than a pointer rewrite.

| | AVL | Red-black |
|---|---|---|
| Height bound | 1.44 log2 n | 2 log2(n + 1) |
| Rotations per insert | at most 1 | at most 2 |
| Rotations per delete | up to O(log n) | at most 3 |
| Best fit | lookup heavy | mixed or write heavy |

That trade picks the default. Read heavy and mostly static favours AVL. Write heavy favours red-black, which is why \`std::map\`, Java's \`TreeMap\` and the Linux kernel scheduler all use red-black trees. Both give the same guarantee, and it is the one that matters: no insertion order, sorted included, can push an operation past O(log n).
      `,
        [
          q('Why does a rotation leave the binary search tree invariant intact?', [
            'It runs only when the subtree it touches is already balanced',
            'It re-sorts the affected subtree once the pointers have moved',
            'The one subtree that moves is the only one that fits the slot it moves into',
            'It swaps the values held by the two nodes instead of their pointers',
          ], 2, 'In rotateRight, x.right holds exactly the values larger than x and smaller than y, which is precisely what y\'s vacated left slot accepts, so the inorder sequence is unchanged.'),
          q('You forget to call updateHeight after rotating an AVL subtree. What is the symptom?', [
            'Stale balance factors, so rebalancing stops firing and the height drifts up unnoticed',
            'An immediate exception on the very next insert into the tree',
            'The inorder traversal stops producing values in sorted order',
            'Every insert triggers a rotation, making writes several times slower',
          ], 0, 'Balance factors are computed from the stored heights, so once those are wrong the tree reports itself as balanced and never rotates again, degrading silently rather than failing loudly.'),
          q('Why do std::map and Java\'s TreeMap use red-black trees rather than AVL trees?', [
            'Red-black trees are shorter, so every lookup does fewer key comparisons',
            'AVL trees cannot hold duplicate keys without an extra count field',
            'Red-black trees require no rotations at all, only recolouring of nodes',
            'Red-black trees accept extra height in exchange for far fewer rotations per write',
          ], 3, 'A general purpose map sees a mix of reads and writes, so the cheaper write path of at most two or three rotations outweighs the few extra comparisons the looser height bound costs.'),
        ]
      ),
      lesson('Skip Lists: Balance Without Rotations', 13, `
Redis stores every sorted set in a skip list, not a balanced tree. The structure behind \`ZADD\` and \`ZRANGEBYSCORE\` across millions of leaderboards has no rotations, no balance factors and no rebalance step at all. It stays short because a coin flip decides how tall each node is.

### Express lanes over a sorted list

A sorted linked list inserts in O(1) once you are in position and takes O(n) to get there. Add a second list holding every other node, then a third holding every fourth, and a search can drop down through the lanes instead of walking every link. Skip lists build those lanes randomly:

\`\`\`js
const MAX_LEVEL = 32, P = 0.25;

function randomLevel() {
  let level = 1;
  while (Math.random() < P && level < MAX_LEVEL) level++;
  return level;              // 1 with p 0.75, 2 with p about 0.19, and so on
}
\`\`\`

With \`P = 0.25\`, three quarters of nodes exist only on level 1 and each lane above holds about a quarter of the one below. Expected height is log base 4 of n, which is 13 levels at ten million entries. Expected forward pointers per node is \`1 / (1 - P)\`, about 1.33, so the memory overhead undercuts a tree node carrying two child pointers plus a stored height.

### Search is one loop moving two ways

\`\`\`js
function find(list, score) {
  let node = list.head;
  for (let i = list.level - 1; i >= 0; i--) {
    while (node.next[i] && node.next[i].score < score) node = node.next[i];
  }                          // drop a level as soon as the next hop overshoots
  const hit = node.next[0];
  return hit && hit.score === score ? hit : null;
}
\`\`\`

Walk right while the next node is still too small, drop down when it is not. Insert reuses that walk, recording the last node visited on each level in an \`update\` array, then splicing the new node into levels 0 through \`randomLevel() - 1\`.

Landing at level 0 leaves you standing on a plain sorted linked list, so a range scan is a forward walk with no traversal state to maintain. That is why \`ZRANGEBYSCORE key 100 200\` costs one search plus one hop per result, while the same query on a tree needs an inorder continuation.

### The property nobody expects

A hash table can be attacked. Feed it keys that collide and every bucket becomes a list. A skip list cannot be attacked that way, because a node's height comes from the random number generator, not from the key it holds. No input sequence, sorted, reversed or adversarially chosen, degenerates a skip list. Only the RNG could, and the odds of a search costing more than \`3 log n\` hops are vanishingly small.

The honest cost: skip lists are **expected** O(log n), not worst case. A balanced tree guarantees it. When your latency budget is a hard contract that difference matters, and for most other work it does not.

### Why concurrent maps prefer it

Rebalancing a tree rewrites pointers near the root, so every writer contends on the same handful of nodes. A skip list insert touches only the nodes immediately before the insertion point on each level, and each splice is a single pointer write. That locality is why \`java.util.concurrent.ConcurrentSkipListMap\` exists and no ConcurrentRedBlackTreeMap sits beside it.

| | Balanced BST | Skip list |
|---|---|---|
| Search | O(log n) worst case | O(log n) expected |
| Rebalance | rotations on write | none |
| Range scan | inorder continuation | forward walk at level 0 |
| Concurrency | contention near the root | local splices |

One tuning trap. \`MAX_LEVEL\` is a cap, and if you set it too low the top lane saturates. At \`P = 0.25\` and \`MAX_LEVEL = 8\`, ten million entries leave about \`10,000,000 * 0.25 ** 7\`, roughly 610 nodes, sitting on the top lane. Every search now begins with a 610 step linear walk before it can drop. Size the cap for the largest n you expect, then forget it: Redis uses 32, which covers more entries than you will ever store.
      `,
        [
          q('A skip list with P = 0.25 and MAX_LEVEL = 8 is loaded with ten million entries. What goes wrong?', [
            'Inserts degrade to O(n) because the level array overflows its cap',
            'The top lane holds about 610 nodes, so each search opens with a long linear walk',
            'Memory doubles, because far more nodes are promoted to the capped height',
            'Range scans start returning their results out of key order',
          ], 1, 'The cap stops the lanes from thinning out any further, so the topmost lane keeps roughly a quarter to the seventh power of all nodes and a search must walk it linearly before dropping down.'),
          q('Why can an adversary not force a skip list into O(n) behaviour by choosing the keys they insert?', [
            'Because every key is hashed before the structure decides where to put it',
            'Because the list runs a rebalancing pass after each individual insert',
            'Because duplicate and near duplicate keys are rejected at insert time',
            'Because a node\'s height comes from the RNG, not from the key it holds',
          ], 3, 'The shape of a skip list is decided entirely by random level assignment, so no chosen sequence of keys can influence it the way chosen colliding keys can wreck a hash table.'),
          q('Why is a score range query such as ZRANGEBYSCORE cheap on a skip list?', [
            'Level 0 is a plain sorted list, so results are a forward walk from the landing node',
            'Scores are kept in a separate hash map that stores each range already computed',
            'The topmost lane already holds the results in sorted order, ready to return',
            'Redis caches the results of every range query it has previously answered',
          ], 0, 'The search drops to the bottom lane, which is an ordinary sorted linked list, so emitting the range costs one pointer hop per result with no stack or traversal state.'),
        ]
      ),
      lesson('Fenwick and Segment Trees: Updates and Range Queries Together', 14, `
A leaderboard for 500,000 players needs one answer constantly: how many players sit above this score? That is a prefix count, and the prefix sum array from chapter 2 answers it with a single subtraction. It also rewrites up to 500,000 cells every time one score changes, and scores change 2,000 times a second.

Both operations have to be cheap. A **Fenwick tree** makes each of them about 19 array touches.

### The Fenwick tree, and the one bit that runs it

\`\`\`js
class Fenwick {
  constructor(n) { this.n = n; this.t = new Int32Array(n + 1); }   // 1 indexed

  add(i, delta) {                     // i is 1 based
    for (; i <= this.n; i += i & -i) this.t[i] += delta;
  }

  prefix(i) {                         // total of buckets 1..i
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.t[i];
    return s;
  }

  range(l, r) { return this.prefix(r) - this.prefix(l - 1); }
}
\`\`\`

\`i & -i\` is the lowest set bit of \`i\`, and it is the entire data structure. Slot \`i\` stores the sum of the \`i & -i\` values ending at \`i\`. Slot 12 is binary 1100, lowest set bit 4, so \`t[12]\` covers positions 9 through 12. Slot 8 is 1000, lowest bit 8, so \`t[8]\` covers 1 through 8.

Trace \`add(5, 3)\` on a tree of size 8. 5 is 101, lowest bit 1, write \`t[5]\`, jump to 6. 6 is 110, lowest bit 2, write \`t[6]\`, jump to 8. Write \`t[8]\`, jump to 16, past \`n\`, stop. Three writes instead of 500,000.

Trace \`prefix(7)\`. 7 is 111, read \`t[7]\`, drop to 6, read \`t[6]\`, drop to 4, read \`t[4]\`, drop to 0, stop. Three reads, and the covered widths 1 + 2 + 4 tile positions 1 through 7 exactly once.

### One indexed, and not negotiable

\`0 & -0\` is 0. Feed a zero index into either loop and the index never advances, forever. An off by one here is not a wrong answer, it is a hung request thread. Keep the array \`n + 1\` long and translate at the boundary with \`tree.add(playerIndex + 1, delta)\` rather than trying to teach the loops about zero.

### Where Fenwick cannot follow

Fenwick answers a range as \`prefix(r) - prefix(l - 1)\`, which demands an operation with an inverse. Sum qualifies, and so does xor. Minimum does not: knowing the minimum of 1..7 and the minimum of 1..3 tells you nothing about the minimum of 4..7. For range minimum, maximum or gcd you need a **segment tree**, which stores each range explicitly.

\`\`\`js
class SegTree {
  constructor(a, merge, identity) {
    this.n = a.length; this.merge = merge; this.id = identity;
    this.t = new Array(2 * this.n).fill(identity);
    for (let i = 0; i < this.n; i++) this.t[this.n + i] = a[i];
    for (let i = this.n - 1; i > 0; i--) this.t[i] = merge(this.t[2 * i], this.t[2 * i + 1]);
  }

  query(l, r) {                        // half open [l, r)
    let left = this.id, right = this.id;
    for (l += this.n, r += this.n; l < r; l >>= 1, r >>= 1) {
      if (l & 1) left = this.merge(left, this.t[l++]);
      if (r & 1) right = this.merge(this.t[--r], right);
    }
    return this.merge(left, right);
  }
}
\`\`\`

Two accumulators, not one. Folding the right hand pieces into the same variable as the left hand pieces looks fine for sum and min, then silently returns garbage the day somebody passes string concatenation or matrix multiplication as \`merge\`. Keep the order honest from the first version.

### Choosing

| Workload | Structure | Update | Query |
|---|---|---|---|
| Static array, many range sums | prefix array | rebuild O(n) | O(1) |
| Point update, prefix or range sum | Fenwick | O(log n) | O(log n) |
| Point update, any associative merge | segment tree | O(log n) | O(log n) |
| Range update and range query | segment tree, lazy tags | O(log n) | O(log n) |

That last row is **lazy propagation**: a pending instruction such as add 5 to this whole range is parked on an internal node and pushed down only when a query walks through it, so a range update touches O(log n) nodes instead of every leaf beneath them.

Fenwick is roughly a quarter of the code and a fraction of the memory, and its constant factor is far lower because it is one flat typed array walked by bit tricks. Reach for it whenever the operation has an inverse, and step up to a segment tree only when it does not.
      `,
        [
          q('A Fenwick tree is wired to a 0 based index and add(0, 5) is called. What happens?', [
            'The delta lands in slot 1 instead, so every later query is off by one',
            'The write runs past the end of the array and corrupts a neighbouring slot',
            '0 & -0 is 0, so the loop index never advances and the call never returns',
            'The value is dropped silently and prefix queries return stale totals',
          ], 2, 'The update loop advances by adding the lowest set bit, and zero has no set bit, so i stays at 0 and the for loop spins forever instead of terminating.'),
          q('Why can a Fenwick tree not answer range minimum queries the way it answers range sums?', [
            'It is backed by a typed integer array, and minima require floating point',
            'Range answers are formed by subtraction, and minimum has no inverse',
            'Its slots cover overlapping spans, so minima would be counted twice',
            'Its update loop only moves forward, and minima need a backward walk',
          ], 1, 'range(l, r) is computed as prefix(r) minus prefix(l - 1), which only works for an operation you can undo, and knowing two prefix minima tells you nothing about the minimum between them.'),
          q('Your segment tree is built with string concatenation as its merge and returns scrambled text. Likely cause?', [
            'The identity value was left as an empty string instead of null',
            'The underlying array length is not rounded up to a power of two',
            'Updates were applied to internal nodes rather than to the leaves',
            'The query folds the left and right pieces into one accumulator, losing order',
          ], 3, 'The iterative query collects segments from both ends at once, so a single accumulator interleaves right hand pieces among left hand ones, which is invisible for commutative merges like sum and fatal for concatenation.'),
        ]
      ),
      lesson('B-Trees and the Cost of a Disk Read', 14, `
A random read from an NVMe SSD takes roughly 80 microseconds. A read from RAM takes roughly 80 nanoseconds. That factor of a thousand is the only fact you need to explain why database indexes look nothing like the trees built so far.

Put 100 million rows in a red-black tree on disk. Its height bound is about \`2 log2(100,000,000)\`, call it 53 levels, and each level is a pointer to somewhere else on the device. Fifty three random reads at 80 microseconds is over 4ms for one primary key lookup. Postgres does it in three reads, and usually fewer.

### The unit of work is a page, not a node

Storage does not hand you eight bytes. It hands you a block, and a database reads and writes in fixed pages: 8KB in Postgres, 16KB in InnoDB. Pulling one key out of a page costs the same as pulling four hundred. So a **B-tree** makes the node the size of a page and fills it with as many keys as fit.

\`\`\`text
8192 bytes per page
  minus about 24 bytes of page header and bookkeeping
  divided by about 20 bytes per (key, child pointer) entry for a bigint key
  = roughly 400 children per node
\`\`\`

Height becomes log base 400 of n:

| Rows | Red-black height bound | B-tree height, fanout 400 |
|---|---|---|
| 1,000 | 20 | 2 |
| 1,000,000 | 40 | 3 |
| 100,000,000 | 53 | 3 |
| 10,000,000,000 | 66 | 4 |

Four hundred cubed is 64 million, and four hundred to the fourth is 25 billion. Three levels cover almost any table you will run, and the root plus the second level stay permanently in the buffer cache because every query touches them. The effective cost of a point lookup is one physical read.

### B+ trees, and why range scans are nearly free

Real indexes are **B+ trees**: internal nodes hold only keys and child pointers, every row pointer lives in a leaf, and the leaves are chained left to right in key order.

Two consequences you feel daily. Internal nodes reach a higher fanout because they carry no payload, so the tree is shorter. And \`WHERE created_at BETWEEN '2026-01-01' AND '2026-02-01'\` descends once, then walks the leaf chain sequentially, which the device handles far better than scattered random reads.

### Splitting, and the UUID mistake

Insert into a full node and the node splits: the median key moves up into the parent, and the two halves become siblings. A full parent splits in turn. The tree gains height only when the root itself splits, which is how a B-tree stays perfectly balanced without ever rotating.

Now the part that bites in production. A monotonically increasing key, a bigint identity or a timestamp, always inserts into the rightmost leaf. That leaf is hot and cached, splits are rare, and pages end up nearly full.

A random UUID v4 primary key inserts into a uniformly random leaf instead. Every insert is a cache miss on a different page, splits happen all over the tree rather than at one edge, and pages settle near half full because each split leaves two half empty nodes behind. The index grows substantially larger, and insert throughput falls off a cliff once it no longer fits in memory. The fix is not to abandon UUIDs, it is to use a time ordered variant such as UUID v7 or ULID, which puts a timestamp in the high bits and restores the append pattern.

### What this changes about your defaults

| Question | Answer |
|---|---|
| Why is a B-tree node so large? | It is one page, and one page costs one read |
| Why is the tree only three levels? | Fanout of a few hundred, not two |
| Why are range scans fast? | Chained leaves, read sequentially |
| Why is a random UUID key expensive? | Random leaf per insert, splits everywhere |

The pattern generalises well past databases. Whenever a level of the storage hierarchy has a fixed transfer unit and a latency a thousand times the level above it, the structure that wins gets wide and shallow. The same reasoning turns up again in CPU cache lines, where the transfer unit is 64 bytes rather than 8KB, and the answer is once more to pack the useful data together.
      `,
        [
          q('Why does a B-tree node hold hundreds of keys rather than the one or two a BST node holds?', [
            'A page read costs the same whether you use one key from it or four hundred',
            'Larger nodes make the binary search inside a single node measurably faster',
            'It keeps the total node count under the file system inode limit',
            'Wide nodes remove the need to keep keys inside a node in sorted order',
          ], 0, 'The device transfers a whole page regardless, so packing the page with keys raises the fanout and cuts the number of separate random reads a lookup needs.'),
          q('Switching a primary key from a bigint identity to a random UUID v4 slows inserts badly. Why?', [
            'UUIDs are stored as text, so each comparison is slower than an integer compare',
            'The index must be rebuilt whenever one generated UUID collides with another',
            'Each insert lands on a random leaf, so cache misses and splits spread everywhere',
            'UUID keys cannot use a B+ tree, so the engine falls back to a hash index',
          ], 2, 'A monotonic key keeps appending to one hot rightmost leaf, while a random key scatters writes across the whole index, evicting cached pages and leaving split pages roughly half full.'),
          q('What actually makes a range scan over a B+ tree index cheap?', [
            'Internal nodes store the row values, so no leaf page is ever visited',
            'Leaves are chained in key order, so the scan descends once then reads forward',
            'The buffer cache keeps every leaf page resident after the first query runs',
            'Range predicates can be answered from the tree height without reading rows',
          ], 1, 'Because leaves sit in key order and link to their neighbours, the scan pays one descent and then follows sequential pages, which storage devices serve far faster than random reads.'),
        ]
      ),
      ],
      [
      q('Rotations, skip lists, Fenwick trees and B-trees all attack the same underlying problem. What is it?', [
        'Reducing the number of key comparisons performed inside a single node',
        'Removing the requirement that keys be stored in sorted order at all',
        'Keeping memory usage proportional to the size of the keys themselves',
        'Keeping the number of levels between the root and the data small',
      ], 3, 'Every operation in this family costs one step per level, so bounding the height is what converts a structure that degrades to O(n) into one that holds O(log n).'),
      q('A workload does point updates and range sums in roughly equal measure over a fixed size integer array. Which fits best?', [
        'A Fenwick tree, which is O(log n) for both and is a single flat array',
        'A prefix sum array that is rebuilt from scratch after each update',
        'A B+ tree keyed on the array index, with the values held in the leaves',
        'A skip list ordered by value, with each range answered by a forward walk',
      ], 0, 'Prefix arrays make updates O(n) and the disk oriented structures pay for indirection they do not need in memory, while a Fenwick tree gives logarithmic cost on both sides with minimal overhead.'),
      q('Which statement about rebalancing across these structures is correct?', [
        'A skip list rotates whenever one of its nodes exceeds the MAX_LEVEL cap',
        'A B-tree gains height only when the root splits, so it never needs rotations',
        'An AVL delete needs at most one rotation, exactly like an AVL insert does',
        'A red-black tree performs no rotations at all and repairs itself by recolouring',
      ], 1, 'Splits push a median key upward and only the root split adds a level, so every leaf stays at the same depth without any pointer rotation ever taking place.'),
      q('Why is a red-black tree a poor choice for indexing 100 million rows stored on disk?', [
        'It cannot hold duplicate keys without an additional structure beside it',
        'Its rotations rewrite whole pages, which is slower than splitting a node',
        'Its fanout of two makes the tree dozens of levels deep, one random read each',
        'It offers no way to walk the keys in sorted order for a range query',
      ], 2, 'With two children per node the height grows with log base 2 of n, and each of those levels is a separate random read costing about a thousand times a memory access.'),
      ]
    ),
    chapter(
      'String Algorithms and Search Indexes',
      'Finding one pattern, then thousands of patterns, then a phrase across an entire corpus, without ever handing untrusted input to a backtracking regex.',
      [
      lesson('Rolling Hashes and Rabin-Karp', 13, `
A backup service compares two 50 MB snapshots by finding every 64 byte window they share. Done naively that is 52 million windows times 64 byte comparisons, roughly 3.3 billion character checks for one pair of files. Done with a rolling hash it is 52 million additions and multiplications, and it finishes in about a second.

The whole idea is that the hash of a sliding window can be derived from the previous hash in constant time, instead of being recomputed from scratch.

### Treat the window as a number

Read the window as a base B number modulo a large prime. Sliding right by one character means subtracting the leading digit, shifting everything left one place, and adding the new trailing digit.

\`\`\`js
const MOD = 1_000_000_007;   // one multiply still fits under 2^53
const BASE = 257;

function rabinKarp(text, pat) {
  const m = pat.length, n = text.length;
  if (m === 0 || m > n) return -1;

  let high = 1;                                 // BASE^(m-1) % MOD
  for (let i = 1; i < m; i++) high = (high * BASE) % MOD;

  let hp = 0, ht = 0;
  for (let i = 0; i < m; i++) {
    hp = (hp * BASE + pat.charCodeAt(i)) % MOD;
    ht = (ht * BASE + text.charCodeAt(i)) % MOD;
  }

  for (let i = 0; ; i++) {
    if (hp === ht && text.startsWith(pat, i)) return i;   // verify, always
    if (i + m >= n) return -1;
    ht = (ht - (text.charCodeAt(i) * high) % MOD + MOD) % MOD;
    ht = (ht * BASE + text.charCodeAt(i + m)) % MOD;
  }
}
\`\`\`

Every intermediate stays inside the safe integer range: \`ht * BASE\` peaks near 2.6e11 and \`charCodeAt(i) * high\` near 6.6e13, both comfortably below 9e15.

### Verify, or ship a bug you cannot reproduce

Equal hashes do not mean equal strings. With MOD near 1e9 and 52 million windows you should expect a false positive every twenty scans or so, which means a version without the \`startsWith\` check is correct on almost every run and quietly wrong on the rest. No exception, no stack trace, and a different answer the next time you look.

The second classic is the sign of the remainder:

\`\`\`js
(-3) % 1_000_000_007;   // -3, not 1000000004
\`\`\`

JavaScript keeps the sign of the dividend, so the subtraction step needs that \`+ MOD\` before the final \`%\`. Drop it and the running hash goes negative once and never matches anything again, which on the surface looks identical to "the pattern is not in this file".

### Where it beats the alternatives

\`String.prototype.indexOf\` is native and heavily tuned, so for one pattern in one string it wins outright. Rolling hashes earn their keep when the same window hash gets reused many times.

| Problem | Naive cost | With a rolling hash |
|---|---|---|
| One pattern in one text | O(n) via indexOf | no gain, use indexOf |
| Shared 64 byte chunks across two files | O(n*m) | O(n + m) |
| Longest common substring, binary searching the length | O(n^2 log n) | O(n log n) |
| Duplicate paragraph detection over 200k documents | quadratic | linear per document |

That third row is worth pausing on. Binary search the answer length k, hash every window of length k in both inputs, and ask whether the two sets of hashes intersect. Each probe is linear, and about 20 probes cover any realistic length.

One last cost, visible only when someone is deliberately attacking you: a fixed BASE and MOD are public knowledge, so a determined caller can construct thousands of strings that collide and turn your hash bucket into a linear scan. Draw BASE randomly at process start, somewhere above the alphabet size and below MOD, and the collision set they precomputed is worthless against the next deploy.
      `,
        [
          q('Your Rabin-Karp scan drops the startsWith check once the hashes match. It passes every test and then returns one wrong index in production. Why?', [
            'The rolling update loses precision after a few thousand windows',
            'startsWith is what advances the window pointer on each step',
            'Two different windows can share a hash, and only a direct comparison rules that out',
            'charCodeAt returns surrogate halves once the text is not ASCII',
          ], 2, 'A hash maps many strings onto one number, so equal hashes are evidence of a match rather than proof, and the direct comparison is what turns one into the other.'),
          q('You remove the `+ MOD` from the subtraction step of the rolling update. What is the observable symptom?', [
            'Once a hash goes negative it never equals the pattern hash again, so matches stop',
            'Every window matches, because a negative value compares equal to zero',
            'The scan throws a RangeError as soon as the hash leaves the safe range',
            'Only the first window is ever checked, because the loop condition inverts',
          ], 0, 'JavaScript keeps the sign of the dividend, so a negative remainder can never equal a hash computed in the range 0 to MOD minus one, and the search reports nothing found.'),
          q('For which of these jobs does a rolling hash actually beat a call to indexOf?', [
            'Finding the first occurrence of a 12 character token in a log line',
            'Checking whether a request path starts with a known route prefix',
            'Counting how often one word appears in a single 4 KB document',
            'Finding every 64 byte block that two 50 MB snapshots have in common',
          ], 3, 'Rolling hashes pay off when one hash per window is reused across many comparisons, and the shared block problem compares tens of millions of windows on both sides rather than scanning for a single pattern.'),
        ]
      ),
      lesson('KMP: Never Re-reading a Character', 13, `
Search for \`aaaaaaaaab\` inside a megabyte of the letter \`a\`. A naive matcher compares nine characters, fails on the tenth, backs the text pointer up to position 1, and repeats: ten million comparisons to conclude the pattern is absent. Knuth, Morris and Pratt asked the obvious question. After matching \`aaaaaaaaa\` and failing, why re-read characters you have already seen?

You cannot, and KMP is the bookkeeping that proves it.

### The prefix function is the whole algorithm

For each position \`i\` in the pattern, store the length of the longest proper prefix of \`pat[0..i]\` that is also a suffix of it. Call it \`lps\`. For \`ababaca\`:

| i | pattern[0..i] | lps[i] | longest border |
|---|---|---|---|
| 0 | a | 0 | none |
| 1 | ab | 0 | none |
| 2 | aba | 1 | a |
| 3 | abab | 2 | ab |
| 4 | ababa | 3 | aba |
| 5 | ababac | 0 | none |
| 6 | ababaca | 1 | a |

Read that as a recovery table. If you have matched \`ababa\` and the next text character is not \`c\`, then the last three characters you consumed were \`aba\`, which is already a valid prefix of the pattern. So slide the pattern forward and resume at index 3. The text pointer does not move.

\`\`\`js
function buildLps(p) {
  const lps = new Array(p.length).fill(0);
  let len = 0;
  for (let i = 1; i < p.length; ) {
    if (p[i] === p[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];      // fall back, do not decrement
    else lps[i++] = 0;
  }
  return lps;
}

function kmpAll(text, pat) {
  const lps = buildLps(pat), hits = [];
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pat[j]) j = lps[j - 1];
    if (text[i] === pat[j]) j++;
    if (j === pat.length) { hits.push(i - j + 1); j = lps[j - 1]; }
  }
  return hits;
}
\`\`\`

\`i\` only ever increases. The inner \`while\` looks like it could be expensive, but \`j\` grows by at most one per character, so across the whole scan it cannot fall more than n times in total. That is the same amortised argument that bounds the sliding window: O(n + m), guaranteed, on every input including hostile ones.

### Two bugs that survive casual testing

Writing \`len--\` instead of \`len = lps[len - 1]\` is the most common. It builds a plausible looking table that is wrong on patterns with nested borders, and the searcher then misses real matches with no error anywhere.

The other is resetting \`j = 0\` after a hit instead of \`j = lps[j - 1]\`:

\`\`\`js
kmpAll('aaaa', 'aa');   // correct: [0, 1, 2]
                        // with j = 0 after a hit: [0, 2]
\`\`\`

Overlapping occurrences vanish. Half your test data has no overlaps, so this ships.

### Why bother when indexOf exists

V8 implements \`indexOf\` with a tuned two way algorithm that beats hand written KMP on ordinary text, so for a string already in memory, use it. KMP earns its place when the text will not sit still.

\`\`\`js
let j = 0;                                  // the entire matcher state
function feed(chunk) {                      // 64 KB at a time off a socket
  for (let i = 0; i < chunk.length; i++) {
    while (j > 0 && chunk[i] !== pat[j]) j = lps[j - 1];
    if (chunk[i] === pat[j]) j++;
    if (j === pat.length) { report(); j = lps[j - 1]; }
  }
}
\`\`\`

The matcher state is one integer. A pattern split across a chunk boundary is found with no buffering, no re-reading, and constant memory no matter how many gigabytes flow past. That is the property that makes KMP the right choice for log tailing, protocol framing, and any scanner that cannot rewind its input.
      `,
        [
          q('kmpAll nests a while loop inside its for loop. Why is the scan still O(n) on every input?', [
            'The while loop runs at most twice for each text character',
            'j rises by at most one per character, so it cannot fall more than n times overall',
            'lps guarantees the pattern is shorter than the square root of n',
            'The engine hoists the comparison out of the inner loop at runtime',
          ], 1, 'Each character can push j up by only one step, so the total number of fallbacks across the whole scan is bounded by the total number of increments, which is n.'),
          q('After a full match the code sets `j = 0` instead of `j = lps[j - 1]`. Which input exposes the bug?', [
            'Searching for `abc` in `xxabcxx`, which reports index 2 twice',
            'Searching for `abc` in a text where the pattern never occurs',
            'Searching for a pattern that is longer than the text being scanned',
            'Searching for `aa` in `aaaa`, which reports 0 and 2 but not 1',
          ], 3, 'Resetting to zero throws away the suffix that has already been matched, so any occurrence overlapping a previous hit is skipped and only the disjoint ones survive.'),
          q('Why choose hand written KMP over indexOf for a 40 GB log stream arriving in 64 KB chunks?', [
            'Its state is one integer, so a match spanning a chunk boundary needs no buffering',
            'indexOf allocates a fresh string for every chunk it is handed',
            'KMP compares raw bytes while indexOf compares UTF-16 code units',
            'indexOf degrades to quadratic time on input that repeats heavily',
          ], 0, 'Carrying j across chunks means the matcher never re-reads input and never holds more than one chunk in memory, which is what makes a pattern straddling a boundary detectable at all.'),
        ]
      ),
      lesson('Aho-Corasick: Thousands of Patterns in One Pass', 14, `
A moderation service holds 40,000 banned phrases and checks every comment against all of them. Written the obvious way, that is 40,000 calls to \`includes\` over a 4 KB comment: about 163 million character comparisons for one comment, and the queue backs up at roughly 30 comments per second. Aho-Corasick does the same job in 4,096 steps, because the number of patterns stops appearing in the cost at all.

### One automaton, built once

Put every pattern into a trie. Then give each node a failure link pointing at the deepest node whose string is a proper suffix of this node's string. That is the prefix function from KMP, generalised from one pattern to a set of them, and it is built with a breadth first pass because a node's failure link only depends on shallower nodes.

\`\`\`js
function build(patterns) {
  const root = { next: new Map(), fail: null, out: [] };
  for (const p of patterns) {
    let node = root;
    for (const ch of p) {
      if (!node.next.has(ch)) node.next.set(ch, { next: new Map(), fail: root, out: [] });
      node = node.next.get(ch);
    }
    node.out.push(p);
  }
  const queue = [...root.next.values()];
  for (const child of queue) child.fail = root;
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    for (const [ch, child] of node.next) {
      let f = node.fail;
      while (f && !f.next.has(ch)) f = f.fail;
      child.fail = (f && f.next.get(ch)) || root;
      child.out = child.out.concat(child.fail.out);   // inherit shorter hits
      queue.push(child);
    }
  }
  return root;
}

function scan(root, text) {
  let node = root; const hits = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    while (node !== root && !node.next.has(ch)) node = node.fail;
    node = node.next.get(ch) || root;
    for (const p of node.out) hits.push([i - p.length + 1, p]);
  }
  return hits;
}
\`\`\`

With patterns \`he\`, \`she\`, \`his\`, \`hers\` and the text \`ushers\`, this returns \`[[1,"she"],[2,"he"],[2,"hers"]]\`. Three overlapping matches, one pass, six character steps.

### The line everyone deletes

\`child.out = child.out.concat(child.fail.out)\` looks like an optimisation. Remove it and \`ushers\` reports \`she\` and \`hers\` but never \`he\`, because \`he\` ends at the same position as \`she\` and the scanner is sitting on the \`she\` node when that position goes by. A pattern that is a suffix of another pattern only surfaces through the failure chain. Either merge the outputs at build time, as above, or walk the failure links at every match, which costs more per character.

The inner \`while\` in \`scan\` has the same amortised bound as KMP: depth rises by at most one per character, so it cannot fall more than n times overall.

| Approach | Build | Scan of n characters | 40k patterns, 4 KB text |
|---|---|---|---|
| One \`includes\` per pattern | none | O(n * k * m) | ~163M comparisons |
| One regex alternation | O(total) | backtracking, unbounded | do not do this to untrusted input |
| Aho-Corasick | O(total pattern length) | O(n + matches) | 4,096 steps plus hits |

### Two costs that only appear at scale

Memory first. Those 40,000 phrases at an average of 12 characters give up to 480,000 trie nodes, and a dense 256 entry goto table per node in an \`Int32Array\` would be 491 MB. Sparse \`Map\` children cost more per lookup and a fraction of the space, which is why real implementations use a dense table for the root and a sparse one everywhere below it.

Then the output term. Patterns \`a\`, \`aa\`, ... up to a thousand \`a\` characters, scanned over a megabyte of \`a\`, produce about a billion matches. The automaton is genuinely linear; the reporting is not. If the caller only needs a yes or no, return on the first hit. If it needs counts, increment an integer per pattern rather than pushing a result object per occurrence.
      `,
        [
          q('You delete the line that concatenates `child.fail.out` into `child.out`. What breaks?', [
            'The build loop never terminates, because the failure links form a cycle',
            'Every match is reported twice, once for each link that was followed',
            'Patterns containing repeated characters are dropped at build time',
            'A pattern that is a suffix of another pattern stops being reported',
          ], 3, 'When two patterns end at the same position the scanner is parked on the node for the longer one, so the shorter suffix is only reachable through the failure chain that the merge collapsed into out.'),
          q('The scan is O(n + matches). When does that second term start to dominate?', [
            'When the patterns share no common prefix with each other at all',
            'When many patterns are suffixes of each other, as with a, aa, aaa',
            'When the alphabet is larger than the total number of patterns',
            'When the text is much shorter than the total pattern length',
          ], 1, 'Nested patterns all end at the same positions, so one input character can trigger hundreds of reported hits and the reporting work outgrows the scan itself.'),
          q('What does the automaton buy you over running one includes call per pattern?', [
            'It removes the need to lowercase the text before matching starts',
            'It reports the matches already sorted by descending pattern length',
            'The pattern count leaves the scan cost, which is one pass over the text',
            'It bounds memory to a constant no matter how many patterns exist',
          ], 2, 'All the patterns are folded into a single state machine at build time, so scanning costs one step per input character whether there are 40 patterns or 40,000.'),
        ]
      ),
      lesson('Inverted Indexes: Searching a Corpus, Not a String', 14, `
Every algorithm so far reads the text. With 900,000 support tickets averaging 4 KB, reading the text means touching 3.6 GB per query, and no matching algorithm makes that fast enough for a search box. A \`LIKE '%timeout%'\` query against that table takes about 11 seconds. The same question answered from an inverted index takes 3 milliseconds, because it never looks at a document that does not contain the word.

### Turn the corpus inside out

A forward index maps a document to its words. Invert it: map each word to the sorted list of documents that contain it, plus the positions inside each one.

\`\`\`js
const index = new Map();                 // term -> Map(docId -> positions[])

function add(docId, text) {
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  tokens.forEach((term, pos) => {
    let postings = index.get(term);
    if (!postings) index.set(term, (postings = new Map()));
    let list = postings.get(docId);
    if (!list) postings.set(docId, (list = []));
    list.push(pos);
  });
}
\`\`\`

That \`toLowerCase().match(...)\` is the analyzer, and it is the single most common source of "search returns nothing" bugs. Whatever transformation you apply while indexing must be applied identically to the query. Lowercase at index time only, and searching for \`Timeout\` returns zero rows while \`timeout\` returns 4,100. The fix is one shared function called from both paths, never two copies that drift.

### Intersection is where the speed lives

An AND query intersects posting lists, and because they are sorted you get the two pointer merge from earlier in the course:

\`\`\`js
function intersect(a, b) {               // both sorted arrays of doc ids
  const out = []; let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { out.push(a[i]); i++; j++; }
    else if (a[i] < b[j]) i++;
    else j++;
  }
  return out;
}
\`\`\`

Order matters enormously here. Searching for \`the monotonic\` where \`the\` has 890,000 postings and \`monotonic\` has 41, a linear merge walks 890,041 entries. Start from the shorter list and binary search each of its 41 ids inside the long one, and you are done in about 820 probes. Roughly a thousand times less work, from nothing but the order of the operands.

| Query | Structure needed | Cost |
|---|---|---|
| \`timeout\` | posting list | O(hits) |
| \`timeout AND redis\` | two sorted lists | O(shorter * log longer) |
| \`"connection timeout"\` | positions | O(hits in the rarer term) |
| \`timeout*\` | term dictionary as a trie | O(prefix + terms under it) |

Phrase search is why positions are stored. A document matches \`"connection timeout"\` when some position of \`timeout\` equals a position of \`connection\` plus one:

\`\`\`js
const set = new Set(positionsOf('timeout', doc));
const isPhrase = positionsOf('connection', doc).some(p => set.has(p + 1));
\`\`\`

Positions roughly triple the index size, so they are a deliberate trade, not a default.

### Deletion is the hard part

Posting lists are wonderful to append to and painful to edit. Removing document 40,127 means finding and splicing it out of every term it contained, which for a 4 KB ticket is several hundred lists. Production engines refuse to do this. Lucene, and therefore Elasticsearch, writes immutable segments plus a bitset of deleted document ids, filters those out at query time, and reclaims the space only when segments are merged in the background.

That design decision is visible from the outside: it is exactly why a document you deleted still appears in results for a few seconds, and why a search index is always described as eventually consistent. Ranking sits on the same structure. A term appearing in 41 documents is far more informative than one appearing in 890,000, which is the entire intuition behind inverse document frequency and the BM25 score built on top of it.
      `,
        [
          q('Searching for `Timeout` returns nothing while `timeout` returns 4,100 documents. What is wrong?', [
            'The query path skips the lowercasing that the indexing path applies',
            'The posting lists were built before those documents were added',
            'Uppercase terms are kept in a separate segment of the same index',
            'The intersection is walking the longer posting list first',
          ], 0, 'A term is only findable under the exact form it was stored in, so every transformation applied while indexing has to be applied to the query by the same shared function.'),
          q('`the` has 890,000 postings and `monotonic` has 41. Why start the intersection from `monotonic`?', [
            'Rare terms carry a higher BM25 weight in the final ranking',
            'The longer list may not be sorted by document id yet',
            '41 binary searches into the long list beat walking 890,041 entries',
            'It lets the query stop as soon as one document matches',
          ], 2, 'The result can never be larger than the shortest list, so probing the long list 41 times costs about 820 steps instead of the 890,041 a symmetric merge would take.'),
          q('Why do production search engines mark deleted documents in a bitset instead of editing posting lists?', [
            'Bitsets compress far better than the posting lists themselves do',
            'Removing one document means splicing it out of hundreds of lists',
            'Posting lists are stored sorted by score rather than by document id',
            'The document id must stay allocated for the phrase query code',
          ], 1, 'A single 4 KB document appears under every term it contains, so an immediate delete would rewrite hundreds of immutable lists, which is why the reclaim is deferred to a background merge.'),
        ]
      ),
      ],
      [
      q('A log shipper must flag any of 12,000 known error signatures in every incoming line. Which approach fits?', [
        'A rolling hash of each line compared against 12,000 stored hashes',
        'One KMP matcher per signature, run in sequence over each line',
        'A single regex alternation built from all 12,000 signatures',
        'One Aho-Corasick automaton built once from all 12,000 signatures',
      ], 3, 'Folding every signature into one automaton makes the scan cost depend on the line length alone, while the other options repeat work per pattern or hand a huge alternation to a backtracking engine.'),
      q('Which problem suits a rolling hash and does not suit KMP?', [
        'Deciding whether two 50 MB files share any 64 byte block at all',
        'Reporting every occurrence of one phrase inside a document',
        'Matching a fixed pattern across chunks of a network stream',
        'Finding the first position at which two strings start to differ',
      ], 0, 'KMP is built around a single pattern known in advance, whereas the shared block question needs a comparable fingerprint for tens of millions of windows on both sides, which is what a rolling hash gives you.'),
      q('Why does an inverted index beat running the best available matcher over every document?', [
        'It removes the need to store the original documents at all',
        'Even a linear matcher reads all 3.6 GB, while the index reads only the postings',
        'Matching algorithms cannot report positions inside a document',
        'Posting lists answer prefix queries that no matcher can express',
      ], 1, 'Optimal per document matching still costs a full pass over the corpus, so the only route to a millisecond answer is a structure that never opens a document which cannot contain the term.'),
      q('A handler runs a user supplied list of 300 keywords through one regex alternation. What is the safest replacement?', [
        'Escape each keyword and keep the alternation exactly as it is',
        'Cap the incoming text at 1 MB and keep the same regex',
        'Build one Aho-Corasick automaton over the 300 keywords',
        'Run the existing regex inside a worker thread with a timeout',
      ], 2, 'An automaton has a worst case linear in the text length with no backtracking at all, so neither hostile keywords nor hostile text can turn a single request into minutes of CPU.'),
      ]
    ),
    chapter(
      'Data Layout and the Machine',
      'Why two implementations with identical Big-O differ tenfold in wall clock time, and how bits, memory layout, allocation and the JIT decide which one wins.',
      [
      lesson('Bit Manipulation and Bitsets', 13, `
A \`Set\` holding 8,000,000 document ids costs roughly 400 MB of heap in Node. The same membership information in a bitset costs 1 MB. Both answer "is id 4,812,003 in here?" in constant time, but only one of them lets you intersect two sets by ANDing 250,000 machine words.

### Bitwise operators do not run on numbers

Every JavaScript bitwise operator converts its operands to a signed 32 bit integer, does the work, then converts the result back to a double. That one sentence explains almost every surprise in this area.

\`\`\`js
(2 ** 31) | 0      // -2147483648: bit 31 is the sign bit
(2 ** 33) | 0      // 0: the low 32 bits of 8589934592 are all zero
1 << 32            // 1: the shift count is taken modulo 32
-8 >> 1            // -4: arithmetic shift keeps the sign
-8 >>> 1           // 2147483644: logical shift does not
\`\`\`

\`1 << 32\` returning \`1\` is the one that bites. A flag scheme packed into a single number wraps at the 33rd flag and starts sharing storage with flag 0, silently, with no error and no failing test. More than 31 flags means an array of words, not a bigger number.

### Idioms worth knowing by sight

\`\`\`js
const isSet   = (x, k) => (x & (1 << k)) !== 0;
const set     = (x, k) => x | (1 << k);
const clear   = (x, k) => x & ~(1 << k);
const toggle  = (x, k) => x ^ (1 << k);
const lowest  = (x)    => x & -x;        // isolate the lowest set bit
const dropLow = (x)    => x & (x - 1);   // clear the lowest set bit
const isPow2  = (x)    => x > 0 && (x & (x - 1)) === 0;
\`\`\`

\`x & (x - 1)\` is the engine behind a fast popcount: loop while \`x\` is non zero, clear the lowest bit, count. That runs once per set bit instead of 32 times per word, which matters when most words are sparse. One trap: \`x & -x\` returns 0 when \`x\` is 0, so a loop that assumes it always makes progress hangs on an empty word.

Enumerating every subset of a mask is one line:

\`\`\`js
for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
  // every non empty subset of mask, each exactly once
}
\`\`\`

That is the inner loop of bitmask dynamic programming, where 2^n masks keeps n under about 22.

### A bitset over Uint32Array

\`\`\`js
class BitSet {
  constructor(size) { this.words = new Uint32Array((size + 31) >>> 5); }
  add(i) { this.words[i >>> 5] |= 1 << i; return this; }
  has(i) { return (this.words[i >>> 5] & (1 << i)) !== 0; }
  and(other) {
    const out = new Uint32Array(this.words.length);
    for (let w = 0; w < out.length; w++) out[w] = this.words[w] & other.words[w];
    return out;
  }
}
\`\`\`

\`1 << i\` needs no masking precisely because the shift count wraps modulo 32, and the low five bits of \`i\` are the bit position inside the word. The behaviour that broke the flag scheme is what makes this line work.

| 8M id space, 5% dense | Memory | Cost to intersect two |
|---|---|---|
| \`Set\` of numbers | ~400 MB | 400,000 hash probes |
| \`Uint8Array\` of 0 and 1 | 8 MB | 8,000,000 byte reads |
| \`BitSet\` | 1 MB | 250,000 word ANDs |

The catch is density. A bitset over ids 0 to 8,000,000 costs 1 MB whether it holds four ids or four million, so for sparse membership across a huge id space a \`Set\` wins outright. Bitsets pay off when the universe is bounded and you combine sets often, which is exactly the posting list intersection from Chapter 9. Real search engines store dense posting lists as bitsets and sparse ones as sorted id arrays, choosing per term.

One last trap: \`Uint32Array\` stores unsigned values while bitwise operators produce signed ones, so \`words[0] = 1 << 31\` holds 2147483648 correctly but \`words[0] | 0\` reads back negative. Apply \`>>> 0\` when you want the unsigned number.
      `,
        [
          q('A settings system packs 40 booleans into a single number using `1 << index`. What actually goes wrong?', [
            'A RangeError is thrown as soon as the index passes 31',
            'Flags above 31 are stored but always read back as undefined',
            'Index 32 wraps to bit 0, so flag 32 and flag 0 share one bit',
            'The value is promoted to BigInt and comparisons stop working',
          ], 2, 'Shift counts are taken modulo 32, so once the index reaches 32 the operation quietly addresses bit 0 again and two flags collide with no error.'),
          q('Why does `x & (x - 1)` make a popcount loop faster than testing all 32 bit positions?', [
            'It clears the lowest set bit, so the loop runs once per set bit rather than 32 times',
            'It isolates the highest set bit, letting the loop skip over the leading zeros',
            'It converts the value to unsigned, which the CPU can count in one instruction',
            'It halves the value on each pass, so the loop runs about log2(x) times',
          ], 0, 'Each iteration removes exactly one set bit, so a word with three bits set costs three iterations instead of a fixed 32.'),
          q('You need membership tests for about 40 user ids drawn from an id space of 8,000,000. Which choice is right?', [
            'A bitset, because AND and OR run as single machine instructions',
            'A bitset, because typed arrays avoid hash collisions entirely',
            'A Uint8Array of 8,000,000 flags, since byte reads beat bit shifting',
            'A Set, because a bitset costs 1 MB no matter how few ids it holds',
          ], 3, 'Bitset memory depends on the size of the id space rather than the number of members, so at 40 members out of 8,000,000 it wastes almost all of that megabyte.'),
        ]
      ),
      lesson('Typed Arrays, Cache Lines, and Contiguous Layout', 14, `
Two loops sum the x coordinate of 5,000,000 points. Identical O(n), identical answer. One runs in 38 ms and the other in 410 ms. The difference is not the loop, it is where the bytes are.

### The number that explains it

A CPU core never reads a byte from memory. It reads a **cache line**: 64 bytes, aligned, always the whole thing.

| Where the data is | Latency | Roughly equal to |
|---|---|---|
| L1 cache | ~1 ns | 4 cycles |
| L2 cache | ~4 ns | 14 cycles |
| L3 cache | ~15 ns | 50 cycles |
| Main memory | ~80 ns | 250 cycles |

A trip to DRAM costs about as much as 250 additions. That is the entire budget of a tight inner loop, spent waiting. Because a line is 64 bytes, a linear scan of a \`Float64Array\` gets 8 values per miss: one stall, then seven free reads. The hardware prefetcher spots the constant stride and fetches the next line early, so in practice even that stall mostly disappears.

### Array of structs versus struct of arrays

\`\`\`js
// AoS: the array holds 5,000,000 pointers to objects scattered across the heap.
const pts = Array.from({ length: 5e6 }, (_, i) => ({ x: i, y: i * 2, id: i }));
let sum = 0;
for (let i = 0; i < pts.length; i++) sum += pts[i].x;

// SoA: 40 MB of contiguous doubles and nothing in between them.
const xs = new Float64Array(5e6), ys = new Float64Array(5e6);
for (let i = 0; i < 5e6; i++) { xs[i] = i; ys[i] = i * 2; }
let total = 0;
for (let i = 0; i < xs.length; i++) total += xs[i];
\`\`\`

The AoS version pays twice. Each element is a pointer, so \`pts[i].x\` is a second, dependent load to an address the prefetcher cannot guess. And each object carries a header plus \`y\` and \`id\` that the loop never touches, so every 64 byte line you drag in delivers about one useful number instead of eight.

Split by field, not by record, whenever a loop reads one field of many records.

### The stride experiment that surprises everyone

\`\`\`js
// One sixteenth of the additions. Roughly the same wall clock time.
for (let i = 0; i < n; i += 16) sum += ints[i];
\`\`\`

An \`Int32Array\` packs 16 values into a cache line, so stepping by 16 still touches every line. You cut the arithmetic by 94% and the memory traffic by nothing, and memory was the bottleneck. Cutting work moves nothing. Cutting lines touched moves everything.

The same reasoning decides matrix traversal. On a 4096 by 4096 matrix flattened row major into a \`Float64Array\`, summing row by row touches 2,097,152 lines. Summing column by column touches a fresh line per element, 16,777,216 of them, and evicts each one long before you return to it. Same instruction count, eight times the misses.

### Element kinds, and the transition you cannot undo

V8 tracks what a plain array holds and picks a backing representation to match:

\`\`\`js
const a = [1, 2, 3];   // PACKED_SMI_ELEMENTS, small integers stored inline
a.push(1.5);           // PACKED_DOUBLE_ELEMENTS, still unboxed
a.push('x');           // PACKED_ELEMENTS, now an array of boxed pointers
delete a[0];           // HOLEY_ELEMENTS, every read needs a prototype check
\`\`\`

These transitions run one way only. Removing the string does not restore the double representation, and an array that has become holey stays holey for the rest of its life. \`new Array(1000)\` is born holey with a thousand holes, which is why \`new Array(n).fill(0)\` and \`new Float64Array(n)\` are the two safe ways to preallocate.

Typed arrays have no element kinds and no holes, and that predictability is most of their value. Two details to keep straight: \`subarray\` returns a view over the same \`ArrayBuffer\`, so writes through it are visible in the original, while \`slice\` copies. Handing a view to a function that mutates it is a routine way to corrupt data you believed you had duplicated.
      `,
        [
          q('Summing every 16th element of an `Int32Array` is barely faster than summing all of them. Why?', [
            'Loop counter arithmetic starts to dominate once the stride grows past 8',
            'An Int32Array packs 16 values per cache line, so the stride still touches every line',
            'V8 deoptimizes any loop whose stride is not 1 and falls back to the interpreter',
            'The prefetcher switches itself off on non unit strides, adding extra stalls',
          ], 1, 'Memory is the bottleneck and the number of cache lines fetched is unchanged, so cutting the arithmetic by 94% buys almost nothing.'),
          q('Which of these permanently changes how V8 stores a plain array, in a way later operations cannot reverse?', [
            'Reading past the end of the array with an out of range index',
            'Sorting it with a comparator that returns booleans instead of numbers',
            'Passing it to a function that only reads from it inside a loop',
            'Calling `delete` on one of its indexes, which makes it holey for good',
          ], 3, 'Element kind transitions run one way only, so once an array becomes holey every later read carries a prototype check for the rest of its life.'),
          q('A loop reads only the `price` field of 2,000,000 order objects. Why does moving prices into a `Float64Array` help so much?', [
            'The prices become contiguous, so one cache line delivers eight of them',
            'Typed array lookups are O(1) while object property lookups are O(log n)',
            'Typed arrays live outside the heap, so the loop avoids garbage collection',
            'The engine can inline a typed array read but never an object property read',
          ], 0, 'With objects the array holds pointers and each fetched line is mostly headers and unused fields, while a Float64Array packs eight useful values into every 64 byte line.'),
        ]
      ),
      lesson('Allocation, Garbage Collection, and Object Pools', 14, `
The render loop sits comfortably at 11 ms against a 16.6 ms budget, then roughly twice a second a frame takes 31 ms and the animation visibly hitches. Nothing in the profile is slow. \`node --trace-gc\` shows a scavenge landing on exactly those frames.

### Allocation is cheap, survival is not

V8 splits the heap in two. New objects land in **new space** by bumping a pointer, about three instructions. When new space fills, a **scavenge** copies the still reachable objects into the other half and declares the rest gone in a single move. The cost is proportional to the survivors, not to the garbage.

That inverts the intuition. Allocating 10,000,000 objects that die immediately can be cheaper than allocating 100,000 that stay reachable, because dead objects are never touched at all. Anything surviving two scavenges is **promoted** to old space, where collection is mark and compact: mostly concurrent, but far more expensive per byte.

| Generation | Collector | Cost driver | Typical pause |
|---|---|---|---|
| New space | Scavenge | bytes that survive | 0.5 to 3 ms |
| Old space | Mark and compact | total live heap | 50 to 400 ms |

### Where the frame spike comes from

\`\`\`js
// 5,000 particles at 60 fps: 600,000 throwaway objects per second.
function step(p, dt) {
  const vel = { x: p.vx * dt, y: p.vy * dt };
  return { x: p.x + vel.x, y: p.y + vel.y };
}
\`\`\`

Two allocations per particle per frame, all of them dead within a millisecond, all of them filling new space anyway. The fix removes the allocation rather than speeding it up:

\`\`\`js
const px = new Float64Array(5000), py = new Float64Array(5000);
const vx = new Float64Array(5000), vy = new Float64Array(5000);

function stepAll(dt) {
  for (let i = 0; i < 5000; i++) {
    px[i] += vx[i] * dt;
    py[i] += vy[i] * dt;
  }
}
\`\`\`

Zero allocation per frame, so scavenges stop firing and the hitch stops with them.

### Object pools, and when they backfire

Pooling looks like the obvious answer and frequently makes things worse. Pooled objects are long lived by construction, so they get promoted to old space. Every time you store a young object into an old object's field, V8's **write barrier** records that slot in a remembered set so the next scavenge knows to scan it. A pool of 10,000 nodes whose fields you rewrite every frame produces 10,000 remembered set entries per frame, and the scavenge you were avoiding now has real work to do.

Pools earn their keep for large uniform buffers: one 64 KB \`Uint8Array\` per request, checked out and returned. They lose for small short lived records, which the scavenger already collects for free.

### Retention, not allocation, is what leaks

\`\`\`js
function makeHandler(rows) {        // rows is a 200 MB array
  const count = rows.length;
  const report = () => count;       // captures count only
  const debug = () => rows[0];      // captures rows
  return report;                    // debug is dropped, rows is not
}
\`\`\`

V8 allocates one context object per scope, shared by every closure created there. Because \`debug\` captures \`rows\`, \`rows\` lives in that context, and the returned \`report\` keeps the whole context alive along with 200 MB you thought you had released. Build the closure you return inside a smaller function, or copy the values you need out first.

### Reading the trace

\`\`\`
2410 ms: Scavenge 63.2 (81.5) -> 8.1 (81.5) MB, 1.2 ms
19822 ms: Mark-Compact 512.7 (556.0) -> 498.3 (556.0) MB, 210.4 ms
\`\`\`

Read the pair of numbers around the arrow: heap before, heap after. Dropping 63 MB to 8 MB in 1.2 ms is healthy churn. Dropping 512 MB to 498 MB in 210 ms is the signature of a leak: you paid a long pause and freed almost nothing, and the next collection will cost more.
      `,
        [
          q('Why can allocating 10,000,000 short lived objects cost less than allocating 100,000 that stay reachable?', [
            'Small objects skip new space and are released by reference counting',
            'The engine batches short lived allocations into one pointer bump',
            'A scavenge copies only the survivors, so dead objects cost nothing',
            'Long lived objects are rescanned on every allocation by the barrier',
          ], 2, 'The scavenger moves live objects to the other semi space and abandons the rest wholesale, so collection time tracks survivors rather than garbage.'),
          q('An object pool of 10,000 reused nodes made frame times worse instead of better. What is the likely cause?', [
            'The pool\'s free list is a linked list, so acquiring a node costs O(n)',
            'Pooled objects sit in old space, so every young value written hits the write barrier',
            'Reused objects lose their hidden class and property access goes megamorphic',
            'The backing array stays holey, forcing a prototype lookup on each acquire',
          ], 1, 'Long lived pooled objects are promoted, and each write of a young value into them adds a remembered set entry that the next scavenge has to scan.'),
          q('`--trace-gc` prints `Mark-Compact 512.7 (556.0) -> 498.3 (556.0) MB, 210.4 ms`. What does that line tell you?', [
            'The heap limit is too low, so raising --max-old-space-size will fix it',
            'Young generation churn is high and the scavenger cannot keep pace',
            'That pause is normal for a heap of this size and needs no action',
            'A 210 ms pause freed only 14 MB, which is the signature of a leak',
          ], 3, 'A full collection that reclaims under 3% of the heap means almost everything is still reachable, so the live set is growing and the next pause will be longer.'),
        ]
      ),
      lesson('Writing Code the JIT Can Keep Optimising', 14, `
The pricing endpoint served 40,000 requests at 0.9 ms each. Then one order arrived with \`discount: null\`, and from that request onward the same endpoint answered in 3.4 ms. No error, no restart, no way back until the process was recycled.

### Four tiers and one feedback vector

V8 runs your function in Ignition, the bytecode interpreter, first. Hot functions move to Sparkplug, then Maglev, then TurboFan. Every property access records the object shapes it has actually seen into a **feedback vector**. TurboFan compiles machine code that assumes those shapes and inserts a guard before each assumption. When a guard fails, the function **deoptimizes**: execution drops back into the interpreter mid frame, the feedback widens, and it queues for recompilation.

### Hidden classes decide everything

Objects do not carry their own property table. They point at a shape, and the shape says which offset holds which key.

\`\`\`js
const a = { sku: 'K-9', qty: 2 };
const b = { qty: 1, sku: 'K-3' };   // same keys, different order, different shape

function Order(row) {
  this.sku = row.sku;
  this.qty = row.qty;
}
const o = new Order(row);
o.discount = 0.1;                   // forks the shape: two Order shapes now exist
\`\`\`

Assigning \`discount\` after construction creates a second \`Order\` shape, and every function that reads \`.qty\` from an order now sees two. Set every field in the constructor, including \`this.discount = null\`, in a fixed order.

### Monomorphic, polymorphic, megamorphic

| Shapes seen at one call site | State | Cost of a property read |
|---|---|---|
| 1 | monomorphic | a fixed offset, a couple of cycles |
| 2 to 4 | polymorphic | a short linear check of shapes |
| 5 or more | megamorphic | hash probe in a global cache, no inlining |

This is how the 0.9 ms endpoint died. A \`normalise(row)\` helper was called with rows from five different services, each built as an object literal with a slightly different key order. Every read inside it went megamorphic, and TurboFan stopped inlining \`normalise\` into its callers. Every result stayed correct.

### The cliff you cannot climb back up

\`\`\`js
function total(order) { return order.qty * order.price; }
\`\`\`

Feedback says both operands are small integers. Then \`price\` arrives as \`null\`. In JavaScript \`2 * null\` is \`0\`, so nothing throws and no test fails. The guard fails, the function deoptimizes, gets reoptimized with wider feedback, and deoptimizes again on the next null row. After a handful of round trips V8 marks the function as deoptimized too many times and stops optimizing it for the remaining life of the process.

\`\`\`bash
node --trace-deopt --trace-opt server.js 2>&1 | grep -i 'deopt'
\`\`\`

Each line names the function, the bailout reason (\`wrong map\`, \`not a Smi\`) and the bytecode offset, which is usually enough to find the field.

### What still matters, and what stopped

| Advice | Verdict on a modern V8 |
|---|---|
| Cache \`arr.length\` before the loop | noise, TurboFan hoists it |
| Keep \`try/catch\` out of hot functions | obsolete, optimized for years |
| Prefer \`var\` to \`let\` and \`const\` | noise |
| Set every field in the constructor | real, keeps shapes monomorphic |
| Keep array element kinds uniform | real, decides the backing store |
| Assign \`null\` instead of \`delete\` | real, \`delete\` forks to dictionary mode |

None of this is worth doing before a profile points at the function. The growth harness from Chapter 7 tells you whether the algorithm is wrong. Only when the ratio is already right and the constant is still wrong do these rules pay for the code they cost.
      `,
        [
          q('A `parse(row)` helper is called with five object literals whose keys appear in different orders. Every call returns the right answer, yet throughput drops. Why?', [
            'Its call sites see five shapes and go megamorphic, so reads become hash probes and inlining stops',
            'Each different key order forces a full copy of the object before any read',
            'V8 rebuilds the prototype chain every time a key order changes',
            'The function is reparsed from its source text on every shape change',
          ], 0, 'An inline cache holds up to four shapes; beyond that it falls back to a global hash lookup and the function stops being inlined into its callers.'),
          q('What does it mean when V8 reports that a function was deoptimized too many times?', [
            'The function still runs in TurboFan but without any inlining',
            'Its feedback vector is cleared and type collection restarts from scratch',
            'V8 gives up optimizing it for the rest of the process, so it stays slow',
            'The next call throws so the type instability surfaces during testing',
          ], 2, 'After repeated bailouts V8 blacklists the function from optimization, and only restarting the process gives it another chance.'),
          q('Which of these still measurably helps a hot function on a modern V8 engine?', [
            'Caching `arr.length` in a local before the loop header runs',
            'Setting every field, `null` included, in the constructor in a fixed order',
            'Replacing `let` with `var` inside the innermost loop body',
            'Moving the `try/catch` out of the function and into its caller',
          ], 1, 'Shape stability is what keeps inline caches monomorphic, while length hoisting, try/catch and declaration keywords are all handled by the optimizer now.'),
        ]
      ),
      ],
      [
      q('A loop over 5,000,000 records reads one numeric field per record and is memory bound. Which change gives the biggest win?', [
        'Move that field into its own Float64Array so each line carries eight values',
        'Replace the for loop with reduce so the engine can fuse the iteration',
        'Cache the array length and hoist the property lookup out of the loop',
        'Wrap the loop body in try/catch so a bad record cannot deoptimize it',
      ], 0, 'When the bottleneck is cache line traffic, only a change to the data layout reduces it, and contiguous doubles cut the lines fetched by roughly eight times.'),
      q('`--trace-gc` shows scavenges every 40 ms, no mark compacts, and the heap returning to 9 MB each time. What does that pattern mean?', [
        'A leak in old space that the frequent scavenges are masking',
        'The young generation is oversized and should be shrunk',
        'Heavy short lived allocation, cheap to collect but worth removing from the hot loop',
        'Promotion pressure, so an object pool would remove the pauses',
      ], 2, 'Everything allocated is dying young, which the scavenger handles at low cost, so the pauses are small but the churn still points at avoidable allocation.'),
      q('Two implementations share the same Big-O and produce identical output, yet one is nine times slower. Which explanation fits what you have just read?', [
        'One of them hides an asymptotic term that the Big-O analysis missed',
        'One scatters its data across the heap and goes megamorphic, so it stalls on memory and cannot inline',
        'The faster one runs on another thread, so its work overlaps the rest',
        'Big-O counts operations, so wall clock time is unrelated to the class',
      ], 1, 'Big-O fixes the shape of the curve but not its constant, and layout plus shape stability are what set that constant on real hardware.'),
      q('Why does `words[i >>> 5] |= 1 << i` set the right bit in a bitset without masking the shift count?', [
        'Typed array writes wrap the stored value to 32 bits automatically',
        'The `>>> 5` has already reduced `i` below 32 before the shift runs',
        'The `|=` operator clamps its result into the Uint32Array range',
        'Shift counts are taken modulo 32, so `1 << i` selects bit `i` within the word',
      ], 3, 'The low five bits of the index are exactly the bit position inside a 32 bit word, and the modulo 32 shift rule extracts them for free.'),
      ]
    ),
    chapter(
      'Streaming, Sketches, and Parallel Work',
      'Handling data that does not fit in memory and does not stop arriving, using a single pass, a bounded error budget, and more than one thread.',
      [
      lesson('One Pass Over Data That Never Ends', 13, `
A 14 GB \`access-2026-08.log\` and a one line script: \`readFileSync('access-2026-08.log', 'utf8').split('\\n')\`. Node does not run out of heap. It throws first: \`Cannot create a string longer than 0x1fffffe8 characters\`. V8 caps a single string at roughly 512 MB, so the file never even becomes a string you can split.

The cap is a gift: it forces the question every large data job asks. What do you actually need to keep?

### One pass, bounded state

Streaming replaces "load, then compute" with "compute as it arrives": each record is seen once, in order, with a fixed amount of state no matter how long the stream runs. That constraint alone decides what is answerable:

| Question | Answerable in one pass, bounded memory? |
|---|---|
| Total bytes served | Yes, one accumulator |
| Mean and variance of latency | Yes, three numbers |
| Exact median latency | No, needs every value or a second pass |
| Exact count of distinct IPs | No, memory grows with the answer |
| Top 20 URLs by hits | Approximately, see the next topic |

Anything that must compare a value against one that has not arrived yet is out. Everything else is a loop.

### Backpressure is the part people get wrong

\`\`\`js
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('access-2026-08.log'),
  crlfDelay: Infinity,
});

let bytes = 0, slowest = 0;
for await (const line of rl) {
  const m = line.match(/ (\\d+) (\\d+)ms$/);
  if (!m) continue;
  bytes += Number(m[1]);
  if (Number(m[2]) > slowest) slowest = Number(m[2]);
}
\`\`\`

Resident memory stays flat at a few megabytes whether the file is 14 GB or 14 TB. Now the version that ships and then falls over at 3 a.m.:

\`\`\`js
rl.on('line', async (line) => {
  await db.insert(parse(line));      // nothing waits for this
});
\`\`\`

The reader has no idea the handler is asynchronous. It keeps emitting lines at disk speed while every \`await\` parks another pending promise, and the process dies holding a few million half finished inserts. \`for await\` pauses the underlying stream while the loop body runs, and that is the entire difference. With raw events you must call \`rl.pause()\` and \`rl.resume()\` around the work yourself.

### Running statistics that survive real numbers

The textbook one pass variance keeps \`sum\` and \`sumOfSquares\`. On production latencies in microseconds it returns nonsense:

\`\`\`js
// 40 million values clustered near 1_000_000 microseconds
sumSq / n - (sum / n) ** 2;   // -0.0625, a negative variance
\`\`\`

Two quantities near 10^12 are subtracted and the true answer is near 0.06. A double carries about 15 significant digits, so almost all of that difference is rounding error, and the sign flips. Welford's algorithm never forms the difference:

\`\`\`js
let n = 0, mean = 0, m2 = 0;
for await (const x of latencies) {
  n += 1;
  const delta = x - mean;
  mean += delta / n;
  m2 += delta * (x - mean);      // the updated mean, not the old one
}
const variance = m2 / (n - 1);
\`\`\`

Same one pass, same three numbers of state, accurate at 10^9 magnitudes. The second \`mean\` on the \`m2\` line is not a typo: use the old mean there and you introduce a quiet bias nobody notices.

### A fair sample of a stream with no known length

You want 1,000 representative requests for a replay test from a stream whose length you learn only when it ends. Reservoir sampling gives every record seen so far equal probability of being in the sample:

\`\`\`js
const k = 1000, reservoir = [];
let seen = 0;
for await (const line of rl) {
  seen += 1;
  if (reservoir.length < k) reservoir.push(line);
  else {
    const j = Math.floor(Math.random() * seen);   // 0 .. seen-1
    if (j < k) reservoir[j] = line;
  }
}
\`\`\`

The load bearing detail is \`Math.random() * seen\`, not \`* k\`. Record number 5,000,000 takes a slot with probability 1000/5000000, exactly its fair share, and by induction every earlier record still holds its slot with that same probability. Use \`* k\` and every late record overwrites something, so the sample collapses onto the tail of the stream while still looking random, which is why the bug survives review.
      `,
        [
          q('Reading a 14 GB log with readFileSync(path, \'utf8\').split(\'\\n\') fails before the heap is anywhere near full. Why?', [
            'The file system caps a single read call at 2 GB',
            'split() cannot allocate an array with that many elements',
            'V8 refuses to build a single string longer than about 512 MB',
            'readFileSync returns a Buffer, which has no split method',
          ], 2, 'V8 enforces a maximum string length of roughly 512 MB, so the file contents never become a string you can call split on, and the error arrives long before memory is exhausted.'),
          q('A script uses rl.on(\'line\', async (line) => { await db.insert(parse(line)); }) over a 14 GB file. What actually goes wrong?', [
            'The reader keeps emitting at disk speed, so pending inserts pile up until memory runs out',
            'Lines arrive out of order because the handler is asynchronous',
            'The stream closes before the first insert resolves, losing every record',
            'Each await blocks the reader, so throughput falls to one line per round trip',
          ], 0, 'An event handler returning a promise gives the stream no signal to slow down, so lines keep arriving while millions of unresolved inserts accumulate on the heap.'),
          q('A reservoir sampler picks its replacement slot with Math.floor(Math.random() * k) instead of multiplying by the number of records seen. What is the effect?', [
            'The reservoir stays partly empty because indexes repeat',
            'Every record still gets probability 1/k, so it stays uniform',
            'It throws a range error once seen exceeds k',
            'Late records overwrite constantly, so the sample skews to the end of the stream',
          ], 3, 'Multiplying by k gives every arrival a certain replacement instead of a 1 in seen chance, so records near the end of the stream keep evicting earlier ones and the sample stops being uniform.'),
        ]
      ),
      lesson('Sketches: Bounded Memory, Bounded Error', 13, `
Counting distinct visitors for a month: 50 million user ids, each a 36 character UUID. A \`Set\` holding them costs roughly 6 GB in Node once you count string headers and hash table slots. HyperLogLog answers the same question in 16 KB, wrong by about 0.8%. Nobody has ever decided differently because a dashboard read 49.6 million instead of 50.0 million.

A sketch answers a question about an unbounded stream approximately, in fixed memory. It works because each one is wrong in a known direction by a bounded amount, so the failure is something you can reason about rather than hope about.

### Bloom filter: membership that never says no by mistake

A bit array of \`m\` bits and \`k\` hash functions. Insert sets \`k\` bits; a query checks those same bits. Any bit clear means definitely absent, all bits set means probably present. Bits are only ever turned on, which is why a false negative is impossible.

\`\`\`js
class BloomFilter {
  constructor(m, k) { this.bits = new Uint8Array(Math.ceil(m / 8)); this.m = m; this.k = k; }
  *slots(key) {
    const h1 = fnv1a(key), h2 = fnv1a(key + 'salt');
    for (let i = 0; i < this.k; i++) yield ((h1 + i * h2) >>> 0) % this.m;
  }
  add(key) { for (const s of this.slots(key)) this.bits[s >> 3] |= 1 << (s & 7); }
  has(key) {
    for (const s of this.slots(key)) if (!(this.bits[s >> 3] & (1 << (s & 7)))) return false;
    return true;
  }
}
\`\`\`

Two hashes generate all \`k\` slots, the Kirsch and Mitzenmacher trick, at no measurable cost in accuracy. Sizing is a formula: for \`n\` items at rate \`p\`, use \`m = -n * ln(p) / (ln 2)^2\` bits and \`k = (m / n) * ln 2\` hashes. Ten million URLs at 1% is 11.4 MB and 7 hashes, against roughly 1 GB for the equivalent \`Set\`.

Two things bite. Deletion is impossible, since clearing a key's bits also clears bits shared with other keys, which brings false negatives back. And the error rate belongs to how full the filter is: size for 10 million, insert 25 million, and false positives climb past 10%. A crawler in that state calls every fresh URL already seen and quietly stops crawling while its dashboards stay green.

### Count-Min Sketch: frequencies that only ever overestimate

\`d\` rows of \`w\` counters, one hash per row. Counting an item increments one counter per row, and a query returns the minimum of those counters. Collisions only ever add, so the estimate never falls below the truth, and the minimum picks the row where fewest strangers landed on you.

\`\`\`js
const w = 2718, d = 5;                 // ceil(e / 0.001) columns, ceil(ln(1 / 0.01)) rows
const table = new Int32Array(w * d);   // 13,590 counters, 54 KB
const bump = (key) => { for (let r = 0; r < d; r++) table[r * w + hash(key, r) % w] += 1; };
\`\`\`

Those 54 KB track the hit count of every URL in a billion event stream, overcounting by at most 0.1% of total traffic. Pair it with a min heap of size 20 (Chapter 6) and you have the top 20 in constant memory. The trap is trusting a large estimate for a small item: a URL hit 3 times can report 900,000, because the error scales with total traffic rather than with the item. Any estimate is a genuine upper bound, so "seen at most 40 times" is safe and "this key is popular" is what a collision can fake.

### HyperLogLog: distinct counts from leading zeros

Hash each id and count its leading zeros. A run of 10 zeros turns up about once per 1,024 distinct values, so the longest run seen is evidence about cardinality. One estimator is far too noisy, so the first 14 bits of each hash select one of 16,384 single byte registers, each holding its own maximum, and the answer is their harmonic mean. Standard error is \`1.04 / sqrt(16384)\`, or 0.81%.

Registers hold maxima, so two sketches merge by taking the element wise maximum. That is why analytics systems keep one sketch per hour per shard: any date range, any set of shards, is a merge rather than a rescan.

| Sketch | Question | Memory | Error direction |
|---|---|---|---|
| Bloom filter | Have I seen this? | 1.2 bytes per item at 1% | False positives only |
| Count-Min | How often is this? | fixed, 54 KB here | Overestimates only |
| HyperLogLog | How many distinct? | 16 KB | Plus or minus 0.81% |
| Reservoir sample | Give me k examples | k records | Unbiased |

Pick the error you can live with before you pick the structure. "Probably already fetched" costing one redundant request is fine. "Probably already charged" is not.
      `,
        [
          q('Why can a Bloom filter that has only ever had items added to it never return a false negative?', [
            'Each key gets its own dedicated bit, so no key can affect another',
            'Insertion only sets bits, so every bit an inserted key checks is still set',
            'The k hash functions are guaranteed to produce distinct slots',
            'The filter keeps a checksum of each key alongside the bit array',
          ], 1, 'Bits move from 0 to 1 and never back, so all k bits belonging to an inserted key remain set no matter what else is inserted afterwards.'),
          q('A crawler sized its Bloom filter for 10 million URLs at a 1% false positive rate and has since inserted 25 million. What is the visible symptom?', [
            'Lookups slow down noticeably as the bit array fills up',
            'The filter starts reporting URLs it has crawled as unseen',
            'Inserts begin failing once nearly every bit is set',
            'Fresh URLs are reported as already seen, so crawling quietly stalls',
          ], 3, 'An overfilled filter has most of its bits set, so unseen keys increasingly hit k bits that are already on, and the extra false positives make new work look finished.'),
          q('A Count-Min Sketch with an error bound of 0.1% of total volume runs over a billion event stream. Which conclusion is unsafe?', [
            'This key is popular, because its estimate came back as 800,000',
            'This key appeared at most 900,000 times, since estimates never undercount',
            'This key appeared at most 40 times, given an estimate of exactly 40',
            'These two shard sketches can be combined by summing their counters',
          ], 0, 'The error is one sided and scales with total volume, so a key with a true count of 3 can read 800,000 in a billion event stream, while any estimate is still a valid upper bound.'),
        ]
      ),
      lesson('External Sorting and k-Way Merge', 14, `
42 GB of event records to sort by timestamp, on a box with 8 GB of RAM. The Node script that read them into an array died in 90 seconds. \`sort -S 4G\` finished the same job in 20 minutes without complaint. What \`sort(1)\` does is an algorithm you can write in an afternoon, and it is what a database falls back to when an \`ORDER BY\` will not fit in \`work_mem\`.

### Phase one: turn one huge file into sorted runs

Read records until your chunk budget is full, sort that chunk in memory, write it to a temp file, repeat. With a 1 GB budget, 42 GB becomes 42 files, each internally sorted. Cost so far: read 42 GB, write 42 GB.

Budget the chunk in parsed size, not file size. A 240 byte JSON line becomes an object graph of 900 bytes or more in the heap, so a 1 GB slice of file is a 4 GB slice of memory and you are back where you started. Fixed width records packed into a typed array (Chapter 10) keep that ratio near one.

### Phase two: merge every run at once

The obvious merge pairs runs up and repeats, which needs \`log2(42)\`, about 6, passes over the whole dataset: 252 GB read and 252 GB written. A single 42 way merge reads 42 GB and writes 42 GB. The comparison count barely moves. The IO drops by a factor of six, and IO is the entire cost.

A min heap of size \`k\` (Chapter 6) is what makes one pass possible:

\`\`\`js
async function mergeRuns(runs, write) {          // runs: k async iterators of sorted records
  const its = runs.map((r) => r[Symbol.asyncIterator]());
  const heap = new MinHeap((a, b) => a.rec.ts - b.rec.ts || a.i - b.i);

  for (let i = 0; i < its.length; i++) {
    const { value, done } = await its[i].next();
    if (!done) heap.push({ rec: value, i });
  }
  while (heap.size > 0) {
    const { rec, i } = heap.pop();
    write(rec);
    const { value, done } = await its[i].next();  // refill only the run we just drained
    if (!done) heap.push({ rec: value, i });
  }
}
\`\`\`

Every record is pushed once and popped once, so the merge is O(n log k). At k = 42 that is under 6 comparisons per record.

The \`i\` travelling alongside each record is the field people delete as redundant. Advance any run other than the one you popped from, round robin for instance, and the heap stops holding the smallest unconsumed record of each run, which is the only invariant making the output sorted. On uniform test data it still looks sorted, so the tests pass and the corruption arrives with a real file whose runs drain at different rates.

The \`|| a.i - b.i\` tiebreak matters just as much. A heap is not stable, so equal timestamps pop in arbitrary order. Runs were written in input order, so comparing run index second restores the stable ordering that in memory merge sort (Chapter 2) gave you for free.

### Bigger fan in is not free

If one pass beats six, why not write 1,000 small runs and merge all of them at once?

| Limit | What actually happens |
|---|---|
| Open file descriptors | The macOS default \`ulimit -n\` is 256, so 1,000 open runs throws \`EMFILE\` partway through |
| Read buffer per run | Buffer memory splits \`k\` ways: 1 GB across 1,000 runs is 1 MB each, and the disk spends its time seeking rather than reading |

The practical shape is a two level merge: combine 42 runs in groups of 8 into 6 intermediate runs, then merge those 6. Two IO passes instead of one, but every read is large and sequential, which on real hardware beats one pass of scattered 1 MB reads. That is why \`sort_buffer_size\` and \`work_mem\` move big query times far more than a faster CPU does.

### Sorted input makes the next three problems disappear

Once records arrive in order, deduplication, group by, and joining two datasets on the same key all collapse into a single linear scan holding one key's worth of state, because every matching record is adjacent. That is precisely what a sort merge join is. Sorting data you cannot hold is rarely the goal by itself; it is the step that turns a problem needing random access into one needing only a cursor.
      `,
        [
          q('Why merge all 42 sorted runs in a single heap based pass instead of repeatedly merging them in pairs?', [
            'Pairwise merging requires all the runs to be the same size',
            'A heap performs far fewer comparisons per record than pairwise merging',
            'Pairwise merging rereads and rewrites the entire dataset about six times',
            'Only a single pass can keep the merge stable across equal keys',
          ], 2, 'Merging in pairs takes log2(42) rounds and each round touches every byte, so the job pays about six times the disk traffic while comparison counts stay in the same ballpark.'),
          q('In a k-way merge, after popping a record the code advances the next run in round robin order rather than the run it just drained. What breaks?', [
            'The merge throws as soon as any one run is exhausted',
            'The heap stops holding each run\'s smallest unconsumed record, so output order breaks',
            'Records are duplicated, because each run ends up read twice',
            'Memory grows steadily as runs are refilled unevenly',
          ], 1, 'The merge is only correct while the heap contains exactly one candidate from every run, namely its current smallest, and refilling the wrong run destroys that invariant.'),
          q('Someone raises the fan in to 1,000 runs merged in one pass on a box with 1 GB of merge buffer. What degrades?', [
            'Heap comparisons per record roughly double and dominate runtime',
            'The merge stops being stable once fan in passes a few hundred',
            'Total bytes read grows, because more runs are open at once',
            'Each run gets a 1 MB buffer so reads become seeks, and 1,000 descriptors can hit the open file limit',
          ], 3, 'Buffer memory is divided across the open runs, so a high fan in turns large sequential reads into small scattered ones, and the descriptor count can exceed the process limit as well.'),
        ]
      ),
      lesson('Parallel Divide and Conquer With Worker Threads', 14, `
Eight cores, 20 million integers to sort. Split the array into eight slices, hand one to each worker, merge the results. Expected speedup: close to 8x. Measured: 1.4x slower than sorting on one thread. The sort was never the problem. \`postMessage\` copied an 80 MB array into each worker and copied the sorted slice back out, so the process spent its afternoon in \`structuredClone\` while the cores idled.

### Move the pointer, not the data

A \`SharedArrayBuffer\` is passed by reference across threads. Nothing is copied, and every worker writes into the same bytes.

\`\`\`js
import { Worker } from 'node:worker_threads';
import os from 'node:os';

const n = 20_000_000;
const sab = new SharedArrayBuffer(n * 4);        // one allocation, shared by every thread
const data = new Int32Array(sab);
fillFromFile(data);

const cores = os.availableParallelism();          // 8 on this box
const chunk = Math.ceil(n / cores);
await Promise.all(
  Array.from({ length: cores }, (_, i) => {
    const w = new Worker('./sort-range.js', {
      workerData: { sab, from: i * chunk, to: Math.min(n, (i + 1) * chunk) },
    });
    return new Promise((resolve) => w.on('exit', resolve));
  })
);
// data now holds \`cores\` sorted ranges: finish with the k-way merge from the previous topic
\`\`\`

\`workerData\` structured clones whatever you put in it, with one exception: a \`SharedArrayBuffer\` is shared instead of copied, so this message carries about 40 bytes rather than 80 MB. A plain \`ArrayBuffer\` can go in the \`transferList\` instead, which moves ownership and detaches it on the sender, also without a copy.

### A sequential cutoff is not optional

Spawning a Node worker costs 15 to 40 ms, because it is a fresh V8 isolate with its own heap. Recursing until each task holds 2,000 elements means 10,000 workers and several minutes of pure startup.

\`\`\`js
function parallelSort(view, lo, hi, depth) {
  if (hi - lo < 100_000 || depth === 0) return view.subarray(lo, hi).sort();
  // otherwise split, dispatch both halves to the pool, merge on return
}
\`\`\`

Two rules cover it: a fixed size below which you go sequential, and a pool of \`availableParallelism()\` workers reused for every task, never a worker per task.

### Amdahl's law gives you the ceiling before you write anything

If a fraction \`s\` of the work is inherently serial, the best speedup on \`c\` cores is \`1 / (s + (1 - s) / c)\`, no matter how good your parallel code is.

| Serial fraction | 4 cores | 8 cores | 64 cores |
|---|---|---|---|
| 0% | 4.0x | 8.0x | 64x |
| 5% | 3.5x | 5.9x | 15.4x |
| 20% | 2.5x | 3.3x | 4.7x |
| 50% | 1.6x | 1.8x | 2.0x |

The final merge in a parallel sort is serial. So is reading the file in. Measure those two first: if they are 20% of the runtime, then 64 cores buys you 4.7x and every core past the eighth is nearly worthless.

### Shared memory means genuine data races

\`\`\`js
counts[bucket] += 1;      // two workers, one lost update
\`\`\`

That line is a read, an add and a write, and another thread can land between any two of them. Across 8 workers and 20 million items the histogram comes out a few thousand short, by a different amount every run, on data that is identical every time. The fix is one indivisible instruction:

\`\`\`js
Atomics.add(counts, bucket, 1);
\`\`\`

\`Atomics\` works only on integer typed arrays backed by a \`SharedArrayBuffer\`. Under contention it runs 5 to 20 times slower than a plain increment, so the shape that actually performs is a private per worker count array, then one \`Atomics.add\` per bucket at the end. Independent work first, combine once: the same shape as the sorted runs in the previous topic.

### What is worth parallelising

| Workload | Result |
|---|---|
| CPU bound, independent per item (hashing, resizing, parsing rows) | Near linear speedup |
| Shared counter or map updated per item | Contention eats the gain unless you shard per worker |
| IO bound (fetching 5,000 URLs) | No gain, the event loop already overlaps those |
| Under roughly 100,000 items | Startup and messaging cost more than the work |

Reach for threads when the profile (Chapter 7) shows one CPU pinned at 100% and the others asleep. If the profile shows the process waiting on a socket, more threads add scheduling overhead and nothing else.
      `,
        [
          q('Eight workers each sort a slice of a 20 million element array, and the whole job runs slower than sorting on one thread. What is the most likely cause?', [
            'postMessage structured cloned the array into and back out of every worker',
            'The workers contended on a shared lock while sorting their slices',
            'V8 deoptimised the sort because it ran inside eight separate isolates',
            'The final merge dominated, since merging costs O(n log k)',
          ], 0, 'Ordinary messages copy their payload, so an 80 MB array is serialised and rebuilt once per worker in each direction, and that copying costs more than the parallel sort saves.'),
          q('Twenty percent of a job is inherently serial. What is the most a 64 core machine can give you?', [
            'About 51x, since only the serial fifth of the work is lost',
            'About 12.8x, which is one fifth of the available core count',
            'About 4.7x, and every core beyond that buys almost nothing',
            'About 64x, because the serial portion also runs on faster cores',
          ], 2, 'Amdahl\'s law gives 1 / (0.2 + 0.8 / 64), which is roughly 4.7, so the serial fifth caps the whole job no matter how many cores you add.'),
          q('Eight workers histogram 20 million items into buckets in a shared Int32Array. Which approach is both correct and fast?', [
            'Plain counts[bucket]++, because writes to an Int32Array are atomic',
            'A private count array per worker, combined with Atomics.add at the end',
            'Atomics.add on the shared array for every single item processed',
            'A mutex held around the entire histogram loop inside each worker',
          ], 1, 'A plain increment is three separate operations and loses updates, while an atomic per item pays contention 20 million times, so private counts merged once at the end give correctness without the contention.'),
        ]
      ),
      ],
      [
      q('Which of these cannot be computed exactly in one pass over a stream with bounded memory?', [
        'The total number of bytes served across the whole stream',
        'The mean and variance of request latency',
        'The largest latency seen so far',
        'The exact median latency across every request',
      ], 3, 'A median depends on values that may still be arriving, so an exact answer needs the whole dataset retained or a second pass, unlike sums, extremes and Welford style moments.'),
      q('You need an exact count of distinct user ids across 50 million records, with no error tolerated. Which approach fits?', [
        'Sort the ids with an external sort, then count adjacent duplicates in one scan',
        'A HyperLogLog sized to 65,536 registers for a tighter bound',
        'A Bloom filter, since it never reports a false negative',
        'A Count-Min Sketch, since it never underestimates a count',
      ], 0, 'Every sketch trades exactness for memory, so when the answer must be exact you spill to disk instead, and sorting makes duplicates adjacent so a single linear scan counts them.'),
      q('Eight workers have sorted eight ranges of a shared Int32Array in place. What finishes the job, and what does it cost?', [
        'Another parallel pass, because merging parallelises perfectly across cores',
        'A k-way merge over the eight ranges, which is serial and caps the speedup',
        'A final Array#sort over the buffer, now that the data is nearly sorted',
        'Nothing further, since ranges sorted in place leave the array sorted',
      ], 1, 'Sorted ranges are not a sorted array, so a heap based merge has to combine them, and that merge is the serial fraction Amdahl\'s law charges you for.'),
      q('A single box with 2 GB of spare memory. Which pairing of problem and structure fits inside that budget?', [
        'Top 20 URLs in a billion event stream, using a Set holding every URL',
        'Distinct visitors per hour merged over any range, using reservoir samples',
        'Membership tests over 10 million URLs in about 12 MB, using a Bloom filter',
        'An exact median over 40 GB of latencies, using one streaming accumulator',
      ], 2, 'Bloom filter sizing puts 10 million keys at a 1% false positive rate in roughly 11.4 MB, whereas the other three either grow with the data or cannot answer the question at all.'),
      ]
    ),
    chapter(
      'Intractable Problems in Practice',
      'What to do when no efficient exact algorithm exists, from proving the problem is genuinely hard to shipping an answer with a quality bound attached to it.',
      [
      lesson('Recognising an NP-Hard Problem', 13, `
A scheduling ticket, sized at two days: assign 40 tutors to 40 slots so nobody is double booked and total preference score is as high as possible. Three weeks in, the engineer had a loop that ran overnight and finished nothing. The ticket was not written badly. It asked for an algorithm nobody on earth knows how to write.

Spotting that in the first hour is worth more than every constant factor in this course.

### Checking an answer is not the same as finding one

Hand me a filled in timetable and I can verify it in one pass over 40 rows. That is what **NP** means: a proposed answer, the certificate, can be checked in polynomial time. Nothing in that definition says the answer is easy to find, and for the problems below nobody ever has.

**NP-complete** means the problem is in NP and every other NP problem reduces to it, so a fast algorithm for one would be a fast algorithm for all of them. **NP-hard** drops the first half: at least as hard, but possibly not even a yes or no question. Optimisation versions ("cheapest route") are NP-hard rather than NP-complete, which is why NP-hard is the term you actually need at work.

### You will never write a reduction, you will recognise a name

The practical skill is matching your feature to a problem that already has one.

| Standard problem | What it looked like on the ticket |
|---|---|
| Set cover | Fewest lessons that cover every syllabus topic |
| Bin packing | Pack test suites onto the smallest number of CI machines |
| Graph colouring | Exam timetable where no student sits two at once |
| Independent set | Pick courses so no two share an instructor |
| Subset sum | Match a payout against a set of invoice lines |
| Travelling salesman | Order the stops on a delivery run |

The mapping is usually three lines of translation:

\`\`\`js
// "Choose the most courses such that no two share an instructor."
// Vertex = course.  Edge = these two courses share an instructor.
// The question is now: what is the maximum independent set of this graph?
const conflicts = buildConflictGraph(courses);   // 900 vertices, 41k edges
// Maximum independent set is NP-hard. Stop hunting for the clever loop.
\`\`\`

Once the name is on the board, the literature and the next three topics apply.

### The neighbouring problem that is easy

Hardness is not a property of how a problem feels. Small changes flip it completely.

| Solvable in polynomial time | NP-hard |
|---|---|
| Shortest simple path (Dijkstra, Chapter 6) | Longest simple path |
| Two colouring, a BFS bipartite check | Three colouring |
| 2-SAT, linear time | 3-SAT |
| Minimum spanning tree | Steiner tree |
| Euler circuit, every edge once | Hamiltonian circuit, every vertex once |
| Bipartite matching | Three dimensional matching |

Longest path and shortest path differ by one word and by a research career. "It is basically shortest path" is not an argument, it is the moment to check.

### Pseudo-polynomial is a trap

The knapsack table from Chapter 5 runs in O(nW), which looks polynomial. It is not polynomial in the *input size*: a capacity of 1,000,000,000 is ten characters of JSON, and it gives the table a billion columns.

\`\`\`text
n = 100 items, W = 1e9    ->  1e11 cells    ->  hundreds of gigabytes
n = 100 items, W = 5,000  ->  500,000 cells ->  instant
\`\`\`

Knapsack is *weakly* NP-hard: comfortable when the numbers are small, hopeless when they are large. Graph colouring is *strongly* NP-hard and offers no such escape hatch.

### What the diagnosis actually buys

Not despair. It buys permission to stop hunting for an exact polynomial algorithm and start choosing between exact search with pruning, an approximation with a proven ratio, and a solver. It also buys an honest sentence for the ticket: optimal is not reachable here, and this is what we can guarantee instead.

Keep it in proportion, though. NP-hard is a worst case claim about every conceivable instance, and industrial SAT solvers close real problems with a million variables every day, because production inputs carry structure the worst case does not.
      `,
        [
          q('Your feature needs the cheapest route that visits every warehouse once. Why is NP-hard the accurate label rather than NP-complete?', [
            'NP-complete is reserved for problems defined on graphs',
            'Routing problems are excluded from NP by definition',
            'It asks for a minimum cost, not a yes or no answer carrying a certificate',
            'NP-hard simply means slower in practice than NP-complete',
          ], 2, 'NP membership is defined for decision problems whose proposed answer can be checked in polynomial time, so optimisation versions that ask for a minimum are called NP-hard instead.'),
          q('A colleague argues the exam timetabling feature is basically a bipartite check, which runs in linear time. Where does that reasoning break?', [
            'Two colouring is linear, but three or more colours is NP-hard, and exams need many slots',
            'A bipartite check requires the graph to be weighted',
            'Breadth first search cannot detect odd length cycles',
            'Timetabling cannot be expressed as a graph at all',
          ], 0, 'Deciding whether two colours suffice is a linear BFS, but the moment a third colour is allowed the problem becomes NP-hard, and a timetable needs one colour per slot.'),
          q('The knapsack table runs in O(nW). Why does that not make knapsack a polynomial time problem?', [
            'The table gets filled in the wrong dependency order',
            'The recursion depth grows linearly with n',
            'Sorting the items first already costs O(n log n)',
            'W is written in about log W digits, so the table is exponential in the input length',
          ], 3, 'A capacity of one billion occupies ten characters of input yet gives the table a billion columns, so the cost is exponential in how long the input actually is.'),
        ]
      ),
      lesson('Exact Answers Anyway: Pruning and Branch and Bound', 14, `
Twenty five items in a knapsack is 33,554,432 subsets. An honest brute force enumerated all of them in 4.1 seconds. The same search with one bound function attached visited 3,900 nodes and finished in 11 milliseconds, and both returned the identical optimal value. Nothing was approximated. The exponential is still there, it simply never got explored.

That gap is what branch and bound buys, and it is available on almost every NP-hard problem you will meet.

### A search tree you refuse to walk

Backtracking is depth first search (Chapter 5) over partial solutions. At item \`i\` you branch two ways, take it or leave it, and the leaves are complete solutions. Branch and bound adds one question at every node: even in the best imaginable case, can this subtree beat the answer I already hold? If not, cut it.

The best imaginable case comes from a **relaxation**, an easier version of the problem whose answer is never below the truth. For 0/1 knapsack, allow fractional items. Fractional knapsack is greedy and provably optimal: sort by value per unit of weight and fill.

\`\`\`js
// items are sorted by value / weight, descending
function bound(i, weight, value, items, capacity) {
  let w = weight, best = value;
  for (let j = i; j < items.length; j++) {
    const it = items[j];
    if (w + it.weight <= capacity) { w += it.weight; best += it.value; }
    else { best += it.value * ((capacity - w) / it.weight); break; }   // fraction
  }
  return best;                          // never below the true optimum
}
\`\`\`

The search itself is short:

\`\`\`js
function solve(items, capacity) {
  items = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let best = 0;
  (function dfs(i, weight, value) {
    if (value > best) best = value;                                    // incumbent
    if (i === items.length) return;
    if (bound(i, weight, value, items, capacity) <= best) return;      // prune
    const it = items[i];
    if (weight + it.weight <= capacity) dfs(i + 1, weight + it.weight, value + it.value);
    dfs(i + 1, weight, value);                                         // leave it
  })(0, 0, 0);
  return best;
}
\`\`\`

Two lines carry the whole method, and both are easy to get wrong.

### The bound must never lie

An **admissible** bound for a maximisation problem never underestimates. Underestimate once and you prune the subtree containing the optimum, and the function returns a wrong number confidently, with no error and no crash. That is the real failure mode here: not slow, wrong.

\`\`\`js
// WRONG: guesses that half the remaining value is reachable. It can land below
// the true optimum, so the winning subtree gets cut and nobody notices.
const bad = value + remaining.reduce((s, it) => s + it.value, 0) * 0.5;

// Safe but useless: the sum of everything left overestimates so wildly
// that nothing is ever pruned, and you are back to 33 million nodes.
const weak = value + remaining.reduce((s, it) => s + it.value, 0);
\`\`\`

Test it the way Chapter 7 describes: fuzz instances with n at most 14, compare against brute force. A lying bound shows up inside the first hundred cases.

### Order decides everything

| Configuration | Nodes visited at n = 30 |
|---|---|
| No bound, plain enumeration | 1,073,741,824 |
| Weak bound, items unsorted | 41,200,000 |
| Fractional bound, items unsorted | 210,000 |
| Fractional bound, sorted by density | 5,600 |

Sorting is one line and a 37x cut, because a strong incumbent appears during the first descent and every later node then has something demanding to beat. The same principle drives constraint search generally: branch on the most constrained variable first, and break symmetry so two labellings of the same shape are never both explored. In N-Queens, pinning the first queen to the left half of row zero halves the tree for free.

### Anytime by construction

The incumbent is a valid answer from the first leaf onward, and \`bound\` at the root is a ceiling on the optimum. So the search can be stopped at any moment and still report something useful: at least 41,900, no more than 42,600, therefore within 1.7 percent. A twenty second budget with a printed gap beats an exact answer that never returns.
      `,
        [
          q('A branch and bound search returns 830 when the true optimum is 870, and nothing throws. What is the most likely cause?', [
            'The incumbent was initialised to zero instead of negative infinity',
            'The bound underestimates, so the subtree holding the optimum was pruned',
            'The depth first order visited the leaves in the wrong sequence',
            'The recursion silently exceeded the call stack limit',
          ], 1, 'A bound that can fall below the true value of a subtree lets the search cut away the winner, and because pruning is a normal control path there is no error to observe.'),
          q('Why does sorting knapsack items by value per unit of weight before the search cut node counts so sharply?', [
            'It lets the bound function run in constant time per node',
            'It removes the items that cannot fit inside the capacity',
            'It guarantees that the first leaf reached is already optimal',
            'The first descent lands a strong incumbent, so pruning has something to compare against',
          ], 3, 'Density order sends the search straight at a near optimal solution, and every node after that is measured against a demanding incumbent rather than against zero.'),
          q('Swapping the fractional bound for the plain sum of all remaining item values keeps the answer correct. What does it cost?', [
            'Almost nothing gets pruned, because the bound sits far above any reachable value',
            'The result degrades into an approximation with a factor of two',
            'The search can no longer report an incumbent while running',
            'The items have to be re-sorted at every node of the tree',
          ], 0, 'That bound is admissible and therefore safe, but it is so loose that it almost never falls below the incumbent, leaving the full exponential tree to explore.'),
        ]
      ),
      lesson('Approximation With a Guaranteed Ratio', 14, `
Two heuristics went into the same warehouse packing service. Both looked sensible. The one that shipped was picked because it was obviously smarter: always cover the item touching the most open orders. On a normal Tuesday it produced a plan using 11 percent more vans than necessary. On a Tuesday with a promotion running it used 3.7 times more, and nobody on call could tell, because a heuristic returns a number and never returns how far off that number is.

The dumber option had a proof attached. That is the entire difference.

### A ratio is a contract

An algorithm is a **ρ-approximation** if its answer is within a factor ρ of optimal on every input, not on average and not usually. For a minimisation problem, \`cost(ALG) <= ρ * OPT\`. You never compute OPT, which is exactly the point: the guarantee holds without knowing it.

Vertex cover is the cleanest example. Pick any uncovered edge, take **both** endpoints, repeat.

\`\`\`js
function vertexCover2(edges) {
  const cover = new Set();
  for (const [u, v] of edges) {
    if (cover.has(u) || cover.has(v)) continue;
    cover.add(u); cover.add(v);          // take both, deliberately
  }
  return cover;
}
\`\`\`

Taking both endpoints looks wasteful. It is what makes the proof work. The edges you actually picked share no vertices, so they form a matching, and any valid cover must contain at least one endpoint of each. Pick k edges and OPT is at least k, while your cover holds 2k vertices. Twice optimal, always, in O(E) time.

### The smarter heuristic is worse

Greedy by highest degree feels better, and on random graphs it usually wins. Its worst case ratio is Θ(log n) rather than 2. On a purpose built bipartite instance with 1,000 vertices it returns a cover roughly 7 times optimal. Intuition ranked the two algorithms in the wrong order and only the analysis noticed.

### What is known, and what is impossible

| Problem | Best practical guarantee |
|---|---|
| Vertex cover | 2, from the matching rule above |
| Metric TSP | 2 by doubling an MST (Chapter 6), 1.5 with Christofides |
| Set cover | ln n, and nothing better is possible unless P = NP |
| Bin packing | First Fit Decreasing uses at most (11/9)OPT + 6/9 bins |
| Knapsack | Any accuracy you name, through an FPTAS |
| General TSP, max clique | No constant factor at all unless P = NP |

Two rows surprise people. Set cover's ln n is not a gap waiting for a cleverer algorithm, it is a proven ceiling. And knapsack, NP-hard as it is, has a **fully polynomial time approximation scheme**: scale every value down, round, run the ordinary DP on the shrunken numbers, and land within a factor you choose.

\`\`\`js
const K = (eps * maxValue) / n;                       // scale factor
const scaled = items.map(it => ({ ...it, value: Math.floor(it.value / K) }));
// Exact DP on scaled values. Each item loses under K, so the total loss
// stays under eps * OPT, and runtime is polynomial in n and 1 / eps.
\`\`\`

Asking for 1 percent error costs about 100 times the runtime of asking for 100 percent. The accuracy knob is real, and it is not free.

### Use the bound, do not just quote it

A ratio is a worst case. On your data the true gap is usually much smaller, and it is measurable: run the approximation for the answer, and an LP relaxation or the \`bound\` function from the previous topic for a ceiling. Log both.

\`\`\`text
route-plan 2026-08-24  vans=118  lower_bound=112  gap=5.4%  ms=340
\`\`\`

That line turns an unfalsifiable heuristic into an operational metric. When the gap jumps to 40 percent the alert fires before the customer notices, which is precisely what the highest degree heuristic could never offer.
      `,
        [
          q('Why does taking both endpoints of an uncovered edge yield a proof, when taking only one looks cheaper?', [
            'Taking one endpoint would leave the graph disconnected',
            'Both endpoints are needed to keep the algorithm linear in E',
            'The picked edges form a matching, so optimal needs a vertex from each',
            'Taking one endpoint produces an upper bound rather than a cover',
          ], 2, 'Because the chosen edges share no vertices, any valid cover must contain at least one endpoint of each, which puts optimal at k while your answer is 2k.'),
          q('Greedy by highest degree beats the matching rule on most random graphs. Why is it still the worse choice for a service?', [
            'It degrades to quadratic time on sparse graphs',
            'Its worst case ratio is logarithmic, so a bad instance blows out with no warning',
            'It cannot handle graphs that contain isolated vertices',
            'It needs the entire graph resident in memory at once',
          ], 1, 'Average case behaviour says nothing about the day an adversarial or merely unusual instance arrives, and only the proven factor of two holds on every input.'),
          q('What does an FPTAS for knapsack give you that a fixed ratio approximation does not?', [
            'A guaranteed exact optimum whenever the inputs are integers',
            'Constant memory use regardless of the capacity value',
            'Freedom from having to sort items by value density',
            'You choose the accuracy, paying runtime as the error target shrinks',
          ], 3, 'The scheme takes the accuracy as a parameter, so you can trade compute for a tighter guarantee instead of accepting one fixed factor forever.'),
        ]
      ),
      lesson('Local Search, Solvers, and Knowing When to Stop', 15, `
A delivery planner had 800 stops and a 2am deadline. Version one built a tour with nearest neighbour, then improved it with 2-opt, recomputing the whole tour length for every candidate swap. One improvement pass took 38 seconds. Version two scored each swap from the four edges it changes instead, and the same pass took 40 milliseconds. Same algorithm, same output, 950 times faster.

Local search rarely dies in the search strategy. It dies in the evaluation.

### Solution, neighbourhood, move

Local search holds one complete solution and repeatedly replaces it with a neighbour that scores better. For a tour, the classic neighbourhood is 2-opt: reverse a segment, which trades two edges for two others.

\`\`\`js
// Broken: O(n) per candidate, and a pass considers O(n^2) candidates.
if (tourLength(applySwap(tour, i, j)) < tourLength(tour)) accept(i, j);

// Fixed: only four edges change, so the delta is O(1).
function delta(tour, d, i, j) {
  const a = tour[i - 1], b = tour[i], c = tour[j], e = tour[(j + 1) % tour.length];
  return d[a][c] + d[b][e] - d[a][b] - d[c][e];      // negative means improvement
}
\`\`\`

A neighbourhood is good when its moves can be scored incrementally. A move that forces a full rescore is a bad move no matter how clever it looks on paper.

### Hill climbing stops early, by design

Accept only improvements and you arrive at a local optimum: nothing nearby is better, and the answer can still be 20 percent off. Three standard escapes:

| Technique | Mechanism |
|---|---|
| Random restarts | Run from many starting solutions, keep the best seen |
| Simulated annealing | Accept a worse move with probability exp(-delta / T), cool T over time |
| Tabu search | Forbid undoing the last k moves, so the search cannot cycle |

For annealing the temperature schedule matters more than the acceptance rule. Start T where about half of worsening moves get through, end where essentially none do, and cool geometrically, \`T *= 0.9995\` per iteration.

### Before writing any of that, try a solver

Most scheduling, assignment and packing problems belong in a solver rather than in hand written search. A modern CDCL SAT solver routinely closes industrial instances with a million variables, carrying decades of clause learning and restart tuning that you will not reproduce on a Thursday afternoon.

Exam timetabling is graph colouring, and it encodes directly. Let \`x[c][s]\` mean course \`c\` sits in slot \`s\`:

\`\`\`text
at least one slot:  (x[c][1] OR x[c][2] OR ... OR x[c][S])   for every course c
at most one slot:   (NOT x[c][s] OR NOT x[c][t])             for every s < t
no clash:           (NOT x[c][s] OR NOT x[d][s])             for conflicting c, d
\`\`\`

That is the whole problem. Your effort goes into the encoding, not the search: the naive at-most-one above costs O(S^2) clauses per course, while a sequential or commander encoding brings it to O(S) and regularly turns a timeout into a two second answer.

### Knowing when to stop

Everything here is **anytime**. A valid answer exists throughout and only improves, so stopping is a product decision, driven by the gap between the incumbent and a lower bound:

\`\`\`js
const gap = (incumbent - lowerBound) / lowerBound;
if (gap < 0.02 || Date.now() - start > 30_000) return incumbent;   // whichever first
\`\`\`

Put the gap in the log line and in the response payload. "118 vans, at most 5.4 percent above optimal, computed in 340ms" is something a dispatcher can act on. "118 vans" is a number with no error bar.

### Make it reproducible

Search that calls \`Math.random()\` directly hands back a different plan for identical input, and the bug reports that follow cannot be answered. Seed a small PRNG, store the seed with the result, and pin solver thread counts, since parallel portfolios are non-deterministic by design. Then warm start: feed yesterday's plan in as the initial solution. It converges faster, and tomorrow's route sheet resembles today's instead of being reshuffled overnight to chase a 0.3 percent gain nobody asked for.
      `,
        [
          q('A 2-opt pass over 800 stops takes 38 seconds. Which change fixes it without altering the tour it produces?', [
            'Score each candidate swap from the four edges it changes, not the whole tour',
            'Restrict the neighbourhood to swaps of adjacent stops only',
            'Start from a random tour instead of nearest neighbour',
            'Cache the tour length in a variable between passes',
          ], 0, 'Only four edges differ after a 2-opt swap, so the score change is a constant time arithmetic expression rather than a full linear rescore of the tour.'),
          q('Why does plain hill climbing return a worse tour than simulated annealing over the same neighbourhood?', [
            'It evaluates each move in linear rather than constant time',
            'It cannot cope with an asymmetric distance matrix',
            'It rejects every worsening move, so it halts at the first local optimum',
            'It scans neighbours in a fixed order that biases the outcome',
          ], 2, 'Escaping a local optimum requires passing through solutions that score worse, and annealing accepts those with decreasing probability while hill climbing never does.'),
          q('The route planner returns a different plan every night for an unchanged set of stops. Which fix addresses that complaint?', [
            'Raise the time budget so the search has room to converge',
            'Seed the PRNG, store the seed, and pin the solver thread count',
            'Change the objective from distance travelled to travel time',
            'Report the optimality gap alongside the plan that was chosen',
          ], 1, 'The variation comes from unseeded randomness and non-deterministic parallel solving, so fixing both makes an identical input produce an identical, explainable plan.'),
        ]
      ),
      ],
      [
      q('A feature asks for the fewest lessons that between them cover every syllabus topic. What is the right first move?', [
        'Build a dynamic programming table indexed by topic',
        'Sort lessons by topic count and take a prefix of them',
        'Prove the problem lies in P before committing to it',
        'Name it as set cover, then take greedy with its ln n guarantee',
      ], 3, 'Recognising the standard problem tells you no exact polynomial algorithm is coming and points straight at the greedy algorithm whose ratio is provably the best available.'),
      q('Branch and bound and a ratio approximation promise different things. What does branch and bound offer that the approximation does not?', [
        'The exact optimum, provided it is allowed to run to completion',
        'A guaranteed factor holding on every possible input',
        'A running time that is polynomial in the size of the input',
        'An answer that does not depend on how items are ordered',
      ], 0, 'Pruning never discards the optimum when the bound is admissible, so a completed search is exact, whereas an approximation trades exactness for a fixed time budget.'),
      q('Which situation most clearly calls for a SAT or CP solver rather than hand written local search?', [
        'The objective is a smooth function of continuous positions',
        'Hard constraints dominate and any feasible assignment is the goal',
        'A good previous solution exists and needs only small repairs',
        'The instance is small enough to enumerate by brute force',
      ], 1, 'Clause learning is built for tightly constrained feasibility questions, and encoding the constraints is far more reliable than steering a local search through them.'),
      q('Why should an answer to an NP-hard problem ship with a gap rather than as a bare number?', [
        'A gap is required in order to prove a problem NP-hard',
        'The gap removes the need to test against a brute force oracle',
        'A bound turns an unverifiable number into a claim you can act on and alert on',
        'Without a gap the algorithm has no way to stop early',
      ], 2, 'Pairing the incumbent with a bound tells an operator how much quality is still on the table, so a bad day shows up as a widening gap instead of an invisible regression.'),
      ]
    ),
  ],
  final: [
    q('Which change turns const missing = a.filter(x => !b.includes(x)) from O(n·m) into O(n + m)?', [
      'Building a Set from b and calling has()',
      'Sorting b first',
      'Using forEach with a push instead of filter, so no result array is built up',
      'Reversing a before filtering',
    ], 0, 'A Set gives O(1) average membership, replacing the linear scan hidden inside includes.'),
    q('Why is arr.shift() a poor choice for the dequeue step of BFS?', [
      'It returns elements in the wrong order once the queue holds duplicate nodes',
      'It cannot be used on arrays of objects',
      'It is O(n), as every remaining element shifts left',
      'It mutates the visited set',
    ], 2, 'Shifting re-indexes the whole array, so draining an n-element queue costs O(n²) instead of O(n).'),
    q('The variable sliding-window template nests a while inside a for. Why is it still O(n)?', [
      'The while loop runs at most a constant number of times per iteration',
      'JavaScript optimises nested loops',
      'The window size never exceeds the square root of n',
      'left and right each move forward at most n times over the whole run',
    ], 3, 'Every element enters the window once and leaves once, bounding the inner loop by n total steps.'),
    q('[10, 9, 1].sort() produces [1, 10, 9]. What fixes it?', [
      'sort().reverse()',
      'sort((a, b) => a - b)',
      'sort((a, b) => a > b)',
      'sort(Number)',
    ], 1, 'A numeric comparator returning a - b replaces the default string comparison; returning a boolean coerces to 0/1 and is unreliable.'),
    q('A binary search that assigns lo = mid instead of lo = mid + 1 will...', [
      'Loop forever once lo and mid are equal',
      'Return the wrong index',
      'Throw a RangeError',
      'Work but run in O(n)',
    ], 0, 'When lo === mid the range never shrinks, so the loop condition stays true indefinitely.'),
    q('In reverse(head) for a linked list, what goes wrong if you set curr.next = prev before saving curr.next?', [
      'The head pointer is lost',
      'The list is reversed twice',
      'The remainder of the list becomes unreachable',
      'prev is left null',
    ], 2, 'curr.next is the only reference to the untouched tail; overwriting it unsaved discards everything after curr.'),
    q('Why is a dummy head node used when deleting from a linked list?', [
      'It makes the list circular',
      'It speeds up traversal',
      'It stores the list length',
      'It removes the special case where the node to delete is the head',
    ], 3, 'With a node in front of the real head, every deletion is a uniform prev.next = prev.next.next.'),
    q('Which check correctly validates a binary search tree?', [
      'Every node is greater than its left child and less than its right child, at each level',
      'Every node is checked against a min/max range narrowed by its ancestors',
      'The tree is balanced and every level is full',
      'Preorder traversal produces sorted output',
    ], 1, 'The invariant covers whole subtrees, so a node must satisfy every ancestor, not only its parent.'),
    q('Inserting 1, 2, 3, 4, 5 in order into a plain BST produces what?', [
      'A degenerate tree behaving like a linked list, with O(n) search',
      'A perfectly balanced tree, since inserting in order keeps both sides level',
      'An error, because duplicates are ignored',
      'A tree of height 2',
    ], 0, 'Each value is larger than the last, so every node gains only a right child — height n, no halving.'),
    q('Which pair of properties makes a problem a dynamic programming problem?', [
      'Sorted input and constant space',
      'Recursion and a base case',
      'Optimal substructure and overlapping subproblems',
      'A graph representation and a visited set',
    ], 2, 'Optimal substructure lets you build from smaller answers; overlap is what makes caching them pay off.'),
    q('You need the 10 largest values from a stream of ten million numbers that will not fit in memory. What do you use?', [
      'A max-heap containing every value',
      'Sort the stream and take the last ten',
      'A balanced BST of every value',
      'A min-heap capped at size 10, popping whenever it grows past 10',
    ], 3, 'A size-k min-heap keeps the k best in O(n log k) time and O(k) memory, and its root is exactly the element to evict.'),
    q('In Dijkstra with a binary heap, when is a node\'s distance final?', [
      'When it is popped from the priority queue',
      'When it is first discovered and pushed',
      'When all of its neighbours have been relaxed',
      'When the queue becomes empty',
    ], 0, 'A cheaper multi-hop route can still arrive after discovery, so only the pop order settles a distance — which is why the BFS habit of marking visited on enqueue is wrong here.'),
    q('A randomised test compares a fast function against a brute-force oracle and reports only "expected 7, got 6". What is missing?', [
      'The elapsed time of each run',
      'A fixed number of trials',
      'The generated input, without which the failure cannot be reproduced',
      'A larger value range for the random numbers, so the generator hits more edge cases',
    ], 2, 'Math.random regenerates different data on the next run, so a failure that does not print its input is a bug you have found and immediately lost.'),
    q('Why is a plain Map used as a cache in a long-running server a problem?', [
      'Map lookups degrade to O(n) as it grows',
      'Nothing evicts old keys, so it keeps every entry it has seen',
      'Map cannot store object values',
      'Insertion order makes reads slower over time as the key list grows longer',
    ], 1, 'A cache needs a bound and an eviction rule; without them the structure only grows and the retained keys are a memory leak.'),
    q('A leaderboard holds 500,000 players in memory. It must answer "how many players score above X" constantly, page results out in score order, and absorb 2,000 score changes a second. Which design fits?', [
      'A single Fenwick tree over score buckets, using prefix sums for the counts and walking the bucket array in order to page the results',
      'A red-black tree keyed by score, recomputing the rank of X by counting the nodes below it on every lookup, which stays O(log n)',
      'A skip list ordered by score for paged scans, plus a Fenwick tree over score buckets whose prefix sums answer the rank query',
      'A sorted array of scores with a prefix sum array beside it, rebuilding the prefix sums after each of the 2,000 changes a second',
    ], 2, 'The rank question is a prefix count, which a Fenwick tree both answers and updates in about 19 array touches, while paging by score needs ordered traversal of the members themselves, which a skip list gives as a plain forward walk at level 0; a Fenwick tree stores counts and not members, counting nodes in an unaugmented tree is O(n), and rebuilding a prefix sum array is O(n) per change, so only the pairing satisfies all three demands.'),
    q('Rabin-Karp compares window hashes and only then calls startsWith, and a Bloom filter answers either "probably present" or "definitely absent". What do the two share, and what does it force on the caller?', [
      'Both can claim a hit that is not real but never miss a real one, so every positive must be confirmed against the source data',
      'Both can miss a real hit but never claim one that is absent, so every negative has to be re-checked against the source data before it is trusted',
      'Both become exact once the modulus or bit array is sized correctly, so the confirming comparison exists only to hold the constant factor down',
      'Both grow more accurate as the input grows larger, so the confirming comparison can safely be dropped once the data set passes a few million items',
    ], 0, 'Two different windows can share a hash and a Bloom filter\'s bits can all have been set by other keys, so both structures produce false positives and neither can produce a false negative, which is exactly why Rabin-Karp verifies a hash match with startsWith and why a Bloom filter hit must be confirmed against the real store before you act on it.'),
    q('A search backend intersects two posting lists drawn from an 8,000,000 document id space: the term `error` matches about 4,000,000 documents and `mmap` matches 40. Which storage and intersection choice is right?', [
      'Store both lists as bitsets and AND all 250,000 machine words, since a word AND is the cheapest operation the CPU offers',
      'Hold the dense list as a bitset and the sparse one as sorted ids, then test the 40 rare ids against the bitset',
      'Store both lists as sorted id arrays and run a two pointer merge, which walks about 4,000,040 entries in a single pass',
      'Store the sparse list as a bitset and the dense one as sorted ids, then walk the 4,000,000 ids testing one bit for each',
    ], 1, 'A bitset over the whole 8,000,000 id space costs 1 MB regardless of density, which makes it the right home for the 4,000,000 hit term, while 40 ids sit happily in a sorted array; probing the dense bitset with those 40 ids is 40 constant time tests, whereas ANDing 250,000 words or merging 4,000,040 entries does thousands of times more work to reach the same answer, which is the same lesson as starting an intersection from the shorter posting list.'),
    q('A one pass variance over 40,000,000 latencies clustered near 1,000,000 microseconds computes `sumSq / n - (sum / n) ** 2` and returns -0.0625. What is happening, and what fixes it?', [
      'The accumulator overflowed the 32 bit integer range, so widening sum and sumSq to BigInt restores both the sign and the true value',
      'The records arrived out of order, so buffering and sorting the stream before accumulating restores a non negative result',
      'n is off by one against the sample convention, so dividing by n - 1 rather than n restores a non negative result',
      'Two quantities near 10^12 are subtracted for an answer near 0.06, so rounding swamps it; Welford\'s update avoids that difference',
    ], 3, 'A double carries only about 15 significant digits, so subtracting two values near 10^12 whose true difference is near 0.06 leaves almost nothing but rounding error and the sign can flip negative; Welford\'s algorithm updates the running mean and m2 incrementally, so that catastrophic subtraction is never formed, and it still costs one pass and three numbers of state.'),
    q('A routing service already uses Dijkstra for shortest paths. Product now asks for the longest simple route between two depots on the same weighted graph. What is the correct response?', [
      'Longest simple path is NP-hard, so no tweak of Dijkstra reaches it; use pruned search or an approximation with a stated bound',
      'Negate every edge weight and run the existing Dijkstra code unchanged, since a minimum over negated weights is a maximum over the original ones',
      'Swap the min heap for a max heap so the furthest node settles first, which keeps the O((V + E) log V) bound and the settle once invariant intact',
      'Run Bellman-Ford instead, which absorbs the negative weights that maximisation introduces and reports any negative cycle it happens to find',
    ], 0, 'Shortest simple path and longest simple path differ by one word and by a whole complexity class: Dijkstra is correct only because a settled distance can never be improved by a later path, an invariant maximisation destroys, and negating the weights merely converts the task into one Bellman-Ford cannot close either, so the honest move is to name the problem as NP-hard and choose branch and bound, an approximation, or a solver.'),
    q('A knapsack instance has 100 items and a capacity of 1,000,000,000, so the O(nW) table would need 10^11 cells. Which approach returns an answer whose error you pick in advance, in time polynomial in n and 1/eps?', [
      'Cap the table at one million columns and run the same DP, accepting whatever answer the truncated capacity happens to produce',
      'Round every item weight and the capacity down to the nearest thousand, then run the ordinary DP over the shrunken numbers',
      'Scale every item value down by K and floor it, then run the exact DP on the scaled values, which is what an FPTAS does',
      'Sort by value per unit of weight and fill greedily, which is the fractional relaxation and so never falls below the true optimum',
    ], 2, 'Knapsack is only weakly NP-hard, and the O(nW) table is pseudo-polynomial because a capacity of 1,000,000,000 is ten characters of input yet a billion columns of table; an FPTAS escapes that by scaling the values rather than the weights, so each item loses under K, total loss stays under eps times the optimum, and the runtime is polynomial in n and 1/eps, while the fractional greedy answer is only an upper bound and rounding weights breaks feasibility.'),
    q('What is the time complexity of `for (let i = 1; i < n; i *= 2) { for (let j = 0; j < n; j++) work(); }`, where work() is O(1)?', [
      'O(n^2), since the loops are nested',
      'O(log n), since i doubles each time',
      'O(n log n), log n passes of n steps',
      'O(n), since each loop is linear',
    ], 2, 'The outer loop doubles i, so it runs about log2 n times, and each pass runs the inner loop n times, giving n × log n.'),
    q('You must report whether an unsorted array of n numbers contains any duplicate. Which approach runs in O(n) expected time?', [
      'Add each value to a Set, stopping if it is already present',
      'Sort a copy of the array, then compare neighbouring values',
      'Call arr.indexOf(x) for each element and compare positions',
      'Compare every pair of elements with two nested loops',
    ], 0, 'Set has() and add() are O(1) on average, so one pass is O(n); sorting costs O(n log n), and indexOf per element or nested loops cost O(n²).'),
    q('Given `const state = { items: [{ id: 1 }] }`, which copy lets you change `copy.items[0].id` without changing `state`?', [
      'const copy = { ...state }',
      'const copy = Object.assign({}, state)',
      'const copy = { items: [...state.items] }',
      'const copy = structuredClone(state)',
    ], 3, 'Spread and Object.assign copy only the top level, and copying the array still shares the { id: 1 } object; structuredClone copies every level.'),
    q('A variable sliding window finds the longest subarray with sum at most K, shrinking from the left whenever the sum exceeds K. Why is this correct for positive numbers but not when negatives are allowed?', [
      'Negative values can push the running total past MAX_SAFE_INTEGER',
      'Extending may then lower the sum, so shrinking can discard valid windows',
      'Negative values mean the window must stay at a fixed size of K elements',
      'The left pointer would then need to move backwards, which breaks O(n)',
    ], 1, 'The window logic relies on the sum growing as the window grows; negative numbers break that, so a start dropped while shrinking might have led to a longer valid window.'),
    q('With `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + nums[i]`, which expression gives the sum of nums[i] through nums[j] inclusive?', [
      'prefix[j] - prefix[i]',
      'prefix[j] - prefix[i - 1]',
      'prefix[j + 1] - prefix[i]',
      'prefix[j + 1] - prefix[i + 1]',
    ], 2, 'prefix[k] holds the sum of the first k elements, so prefix[j + 1] covers nums[0..j] and subtracting prefix[i] removes nums[0..i - 1].'),
    q('You count pairs with a sum below a target in a sorted array using converging pointers lo and hi. When `sorted[lo] + sorted[hi] < target`, how many valid pairs does that single check establish?', [
      'hi - lo, pairing sorted[lo] with every index from lo + 1 to hi',
      'Exactly 1, the pair made of sorted[lo] and sorted[hi], with no further pairs counted',
      'hi - lo + 1, pairing sorted[lo] with every index from lo to hi',
      'lo + 1, pairing sorted[hi] with every index from 0 to lo',
    ], 0, 'Every element from lo + 1 to hi is at most sorted[hi], so each pairs with sorted[lo] below the target: hi - lo pairs, after which lo can advance.'),
    q('A stack-based bracket matcher processes the string `([)]`. What happens?', [
      'It reports balanced, since each bracket type appears twice',
      'It fails at `)`, because the top of the stack is `[`',
      'It fails at `]`, because the stack is empty by then',
      'It fails at the end, because `(` is still on the stack',
    ], 1, 'The matcher pushes ( and [, then sees ) while [ is on top; a closer must match the most recent unmatched opener, so it fails immediately.'),
    q('In a singly linked list of 5 nodes, slow moves one step and fast moves two steps, both starting at the head, while `fast && fast.next`. Where is slow when the loop stops?', [
      'On the 2nd node',
      'On the 4th node',
      'On the 5th node',
      'On the 3rd node',
    ], 3, 'After two iterations fast is on node 5, which has no next node, and slow has moved twice to node 3, the middle of the list.'),
    q('What happens when `function sum(arr, i) { return arr[i] + sum(arr, i + 1); }` is called as `sum([1, 2, 3], 0)`?', [
      'It recurses until the stack overflows with a RangeError',
      'It returns NaN once i passes the end of the array, because undefined plus a number is NaN',
      'It returns 6, because undefined values are treated as 0',
      'It returns undefined after reading the last element',
    ], 0, 'There is no base case, so every call makes another call and none ever returns to perform the addition; the engine throws RangeError: Maximum call stack size exceeded.'),
    q('A trie holds one million words. What does it cost to walk from the root to the node for the prefix `pre`, before listing any completions?', [
      'O(n), where n is the number of stored words',
      'O(p), where p is the length of the prefix',
      'O(log n), using binary search over the words',
      'O(n · p), comparing the prefix with every word',
    ], 1, 'Each character moves one level down the trie, so reaching the prefix node takes one step per prefix character, however many words are stored.'),
    q('To find the minimum depth of a binary tree, the distance from the root to the nearest leaf, which traversal can stop as soon as it reaches the first leaf?', [
      'Inorder depth-first traversal',
      'Preorder depth-first traversal',
      'Level-order (BFS) traversal',
      'Postorder depth-first traversal',
    ], 2, 'Level-order visits nodes in order of depth, so the first leaf it meets is the shallowest; a depth-first traversal may meet a deep leaf first and must keep searching.'),
    q('With coins [1, 3, 4] and amount 6, what do a largest-coin-first greedy and a dynamic programming solution return?', [
      'Greedy uses 3 coins (4+1+1); DP finds 2 coins (3+3)',
      'Both return 2 coins, since 4 is the largest coin',
      'Greedy uses 2 coins (3+3); DP finds 3 coins (4+1+1), since DP prefers larger coins',
      'Both return 3 coins, since 6 is not divisible by 4',
    ], 0, 'Greedy takes 4 and then needs 1 and 1, while DP considers every coin at every amount and finds 3 + 3; this coin set lacks the greedy-choice property.'),
    q('ways(n) = ways(n - 1) + ways(n - 2) counts the ways to climb n stairs taking 1 or 2 steps at a time. Computed bottom-up, what is the minimum extra space needed?', [
      'O(n), since the whole table must be kept',
      'O(n²), one row per stair and step size',
      'O(1), keeping only the last two values',
      'O(log n), using repeated halving',
    ], 2, 'Each value depends only on the previous two, so two rolling variables replace the full table.'),
    q('A binary min-heap is stored in an array starting at index 0. Where are the children of the node at index i?', [
      'At indices 2i and 2i + 1',
      'At indices i + 1 and i + 2',
      'At indices 2i + 1 and 2i + 2',
      'At indices (i - 1) / 2 and i / 2',
    ], 2, 'With 0-based storage, left(i) = 2i + 1 and right(i) = 2i + 2, and the parent is (i - 1) >> 1; 2i and 2i + 1 is the 1-based layout.'),
    q('Students must take courses in an order that respects prerequisites such as \'Algorithms requires Data Structures\'. Which algorithm produces a valid order, or reports that none exists?', [
      'Topological sort, such as Kahn\'s algorithm',
      'Dijkstra\'s shortest-path algorithm',
      'Kruskal\'s minimum spanning tree',
      'Binary search over the course list, comparing each course against its prerequisites',
    ], 0, 'Prerequisites form a directed graph, and a topological sort orders it so every course follows its prerequisites; if it cannot place every node, there is a cycle.'),
    q('What is the running time of Dijkstra\'s algorithm using a binary heap on a graph with V vertices and E edges?', [
      'O(V · E) in all cases',
      'O(V + E), like plain BFS',
      'O(V² · E) in the worst case',
      'O((V + E) log V)',
    ], 3, 'Each vertex is settled once and each edge can push one heap entry, and every heap operation costs O(log V), giving O((V + E) log V).'),
    q('A helper runs 10 times per request on arrays of about 5 items, and a teammate wants to replace its O(n²) loop with a complex O(n log n) version. What should decide it?', [
      'Big-O alone, since O(n log n) is faster at every input size',
      'Measure first; at n = 5 constant factors dominate, so it may not matter',
      'Always replace O(n²) code, whatever the input size turns out to be in production',
      'Rewrite it in a lower-level language before changing the algorithm',
    ], 1, 'Big-O describes growth, not speed at small n; with five items the simple loop may be as fast or faster, so profiling should show whether it matters at all.'),
    q('A server sorts user-submitted arrays with a quicksort that always picks the first element as its pivot. Which input lets an attacker force O(n²) time?', [
      'An array of random numbers',
      'An array with every element distinct',
      'An array that is already sorted',
      'An array of exactly 1,000 items',
    ], 2, 'With a first-element pivot, sorted input puts every remaining element on one side of each partition, so there are n levels of O(n) work.'),
    q('Keys 10, 20 and 30 are inserted in that order into an empty AVL tree. How does the tree rebalance?', [
      'A right rotation at 10 leaves 30 as the root',
      'A left rotation at 10 leaves 20 as the root',
      'A left-right double rotation leaves 30 as the root',
      'It needs no rotation, as the tree is still balanced',
    ], 1, 'After 30 is inserted, 10 is right-heavy with a right-heavy right child, the RR case, which a single left rotation fixes by lifting 20 to the root.'),
    q('A B-tree stores about 500 keys per node. Roughly how many levels does it need to index 100 million keys?', [
      'About 27 levels',
      'About 100 levels',
      'About 7 levels',
      'About 3 levels',
    ], 3, 'Each level multiplies capacity by about 500: 500² is 250,000 and 500³ is 125 million, so three levels suffice, where a binary tree would need about 27.'),
    q('A Fenwick tree over n values supports point updates and prefix-sum queries. What does each operation cost?', [
      'O(1) per query and O(n) per update',
      'O(n) per query and O(1) per update',
      'O(log n) per query and O(n) per update',
      'O(log n) per query and O(log n) per update',
    ], 3, 'Both operations move through the index by adding or removing its lowest set bit, touching O(log n) cells; a plain prefix-sum array gives O(1) queries but O(n) updates.'),
    q('What is the KMP lps array (longest proper prefix that is also a suffix) for the pattern `abab`?', [
      '[0, 0, 1, 2]',
      '[0, 1, 2, 3]',
      '[0, 0, 1, 1]',
      '[0, 0, 0, 2]',
    ], 0, '`a` and `ab` have no border, `aba` has the border `a` (length 1) and `abab` has the border `ab` (length 2).'),
    q('Rabin-Karp slides a window of length m across a text of length n. Why does it use a rolling hash instead of hashing each window from scratch?', [
      'A rolling hash never produces collisions, so no verification is needed',
      'Each shift updates the hash in O(1) instead of rehashing m characters',
      'Hashing from scratch cannot handle windows longer than 64 characters',
      'A rolling hash lets the window skip ahead several characters at a time',
    ], 1, 'Removing the outgoing character and adding the incoming one costs O(1), making the scan O(n + m) expected instead of O(n · m); matches still need a verification check.'),
    q('For a positive integer n, what does `(n & (n - 1)) === 0` test?', [
      'Whether n is even',
      'Whether n is a power of two',
      'Whether n is odd',
      'Whether n has more than one set bit',
    ], 1, 'n & (n - 1) clears the lowest set bit, so the result is 0 only when n had exactly one set bit, which is true exactly for powers of two.'),
    q('Roughly how much memory does a bitset need to record membership for every id from 0 to 8,000,000?', [
      'About 1 MB',
      'About 8 MB',
      'About 64 MB',
      'About 400 MB',
    ], 0, 'One bit per id is 8,000,000 bits, which is 1,000,000 bytes or about 1 MB; 8 MB would be a whole byte per id.'),
    q('A reservoir sampler keeps k items from a stream. With what probability should record number i (counting from 1, with i > k) enter the reservoir?', [
      '1 / k',
      'k / i',
      '1 / i',
      'i / k',
    ], 1, 'Admitting record i with probability k / i into a random slot keeps every record seen so far equally likely to be in the sample.'),
    q('You must sort 42 GB of records on a machine with 8 GB of RAM. What is the standard approach?', [
      'Sort memory-sized chunks into sorted runs on disk, then k-way merge the runs',
      'Read everything into one array and let the operating system swap pages to disk as needed',
      'Build a hash map of every record, then read its keys back out in order',
      'Sort the file in place with quicksort, reading one record at a time',
    ], 0, 'External sorting sorts chunks that fit in memory and writes them as runs, then merges the runs with a heap, reading each record a bounded number of times.'),
    q('Which of these problems is NP-hard, with no known polynomial-time exact algorithm?', [
      'Finding a minimum spanning tree of a weighted graph',
      'Finding the shortest path between two nodes with positive weights',
      'Finding the shortest tour that visits every city exactly once',
      'Sorting n numbers into ascending order',
    ], 2, 'The travelling salesman problem is NP-hard, while spanning trees, positive-weight shortest paths and sorting have polynomial algorithms such as Kruskal, Dijkstra and merge sort.'),
    q('A 2-approximation for minimum vertex cover returns a cover of 40 vertices. What does the ratio guarantee about the optimal cover?', [
      'It has exactly 20 vertices',
      'It has at most 20 vertices',
      'It has at least 40 vertices',
      'It has at least 20 vertices',
    ], 3, 'The returned cover is at most twice the optimum, so 40 ≤ 2 × OPT and the optimum needs at least 20 vertices; it may need more, up to 40.'),
    q('A 2-opt local search on a delivery tour stops when no single 2-opt swap shortens it. What does the final tour guarantee?', [
      'It is the shortest possible tour for these stops',
      'It is within a factor of 2 of the shortest tour',
      'It is 2-opt optimal, but not necessarily the best tour',
      'It beats every tour simulated annealing could find, since 2-opt checks every swap',
    ], 2, 'Local search stops at a local optimum: no neighbouring tour is shorter, but a better tour may still exist, and the stopping rule gives no ratio guarantee.'),
  ],
});
