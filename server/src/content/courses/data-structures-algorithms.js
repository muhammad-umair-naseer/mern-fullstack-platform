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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
  final: [
    q('Which change turns const missing = a.filter(x => !b.includes(x)) from O(n·m) into O(n + m)?', [
      'Building a Set from b and calling has()',
      'Sorting b first',
      'Using forEach instead of filter',
      'Reversing a before filtering',
    ], 0, 'A Set gives O(1) average membership, replacing the linear scan hidden inside includes.'),
    q('Why is arr.shift() a poor choice for the dequeue step of BFS?', [
      'It returns elements in the wrong order',
      'It cannot be used on arrays of objects',
      'It is O(n), because every remaining element shifts left one slot',
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
      'Every node is greater than its left child and less than its right child',
      'Every node is checked against a min/max range narrowed by its ancestors',
      'The tree is balanced and every level is full',
      'Preorder traversal produces sorted output',
    ], 1, 'The invariant covers whole subtrees, so a node must satisfy every ancestor, not only its parent.'),
    q('Inserting 1, 2, 3, 4, 5 in order into a plain BST produces what?', [
      'A degenerate tree behaving like a linked list, with O(n) search',
      'A perfectly balanced tree',
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
      'The generated input, without which the failure cannot be reproduced or shrunk',
      'A larger value range for the random numbers',
    ], 2, 'Math.random regenerates different data on the next run, so a failure that does not print its input is a bug you have found and immediately lost.'),
    q('Why is a plain Map used as a cache in a long-running server a problem?', [
      'Map lookups degrade to O(n) as it grows',
      'Nothing evicts old keys, so it retains every entry it has ever seen',
      'Map cannot store object values',
      'Insertion order makes reads slower over time',
    ], 1, 'A cache needs a bound and an eviction rule; without them the structure only grows and the retained keys are a memory leak.'),
  ],
});
