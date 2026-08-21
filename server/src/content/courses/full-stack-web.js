import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'full-stack-web',
  title: 'Full-Stack Web Development',
  category: 'Web',
  level: 'Beginner → Advanced',
  duration: '8 weeks',
  accent: 'violet',
  coverKey: 'full-stack-web',
  summary:
    'Go from raw HTML to a deployed application with a React front end, an Express API, and a real database behind it.',
  description:
    'The full path a request takes, built one layer at a time. You write the markup, the styles, the interactive UI, the API that serves it, and the data layer underneath — then ship the result.',
  chapters: [
    chapter(
      'How the Web Works',
      'The request/response cycle, and the markup and styling every page is built from.',
      [
        lesson('The Request/Response Cycle', 12, `
Every web page you have ever loaded is the result of the same short conversation. Your browser sends a **request**; a server sends back a **response**. Everything else in this course is detail layered on top of that exchange.

### What the browser sends

When you type an address and hit enter, the browser builds a request that looks roughly like this:

\`\`\`http
GET /courses HTTP/1.1
Host: example.com
Accept: text/html
\`\`\`

Three things matter here:

- **The method** — \`GET\` means "give me something". \`POST\` means "here is some data, do something with it". \`PUT\`/\`PATCH\` update, \`DELETE\` removes.
- **The path** — \`/courses\` identifies *which* resource you want.
- **The headers** — metadata about the request. \`Accept\` tells the server what format you can handle.

### What the server sends back

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html

<!doctype html><html>...
\`\`\`

The **status code** is the server's one-word summary of what happened:

| Range | Meaning | Common examples |
|---|---|---|
| 2xx | It worked | \`200 OK\`, \`201 Created\` |
| 3xx | Look elsewhere | \`301 Moved\`, \`304 Not Modified\` |
| 4xx | You made a mistake | \`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\` |
| 5xx | The server made a mistake | \`500 Internal Server Error\` |

That 4xx/5xx split matters more than it looks. A 4xx is the client's fault — bad input, missing credentials. A 5xx is *yours*. When you build an API later in this course, returning the right one is how callers know whether to fix their request or retry.

### Why "stateless" matters

HTTP has no memory. The server does not know that the request it just handled came from the same person as the previous one. Every request arrives as a blank slate.

This is why logins need **tokens or cookies** — a piece of identification the browser attaches to every single request. We build exactly that in Chapter 5.

### Try it yourself

Open your browser's DevTools, go to the Network tab, and reload any page. Every row is one request/response pair. Click one and you will see the method, path, status, and headers we just walked through — the same conversation, made visible.
        `),
        lesson('HTML That Means Something', 12, `
HTML describes **what content is**, not what it looks like. Getting that distinction right is the difference between a page that works for everyone and one that only works for people exactly like you.

### Structure over appearance

Compare these two:

\`\`\`html
<!-- Div soup: says nothing -->
<div class="top">
  <div class="big-text">Our Courses</div>
</div>

<!-- Semantic: says what it is -->
<header>
  <h1>Our Courses</h1>
</header>
\`\`\`

Both can be styled to look identical. Only the second tells a screen reader "this is the page heading", lets a search engine understand the page, and gives keyboard users something to navigate by.

### The elements worth knowing

- \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\` — page landmarks. Exactly one \`<main>\` per page.
- \`<article>\` — self-contained content that would make sense on its own (a course card, a blog post).
- \`<section>\` — a thematic grouping, almost always with a heading.
- \`<h1>\`–\`<h6>\` — an outline. Never skip levels to get a smaller font; that is what CSS is for.
- \`<button>\` vs \`<a>\` — a button *does* something, a link *goes* somewhere. This is the single most common mistake in real codebases.

### Forms are the workhorse

\`\`\`html
<form>
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" required />
  <button type="submit">Sign up</button>
</form>
\`\`\`

Every input needs a \`<label>\` connected by \`for\`/\`id\`. This is not optional politeness — without it, a screen reader announces an unlabelled box, and clicking the text will not focus the field.

The \`type\` attribute earns its keep: \`type="email"\` gives mobile users an @ key and free format validation, \`type="number"\` gives a numeric keypad, \`type="password"\` masks input.

### The accessibility test that takes 10 seconds

Put your mouse away and press Tab repeatedly. Can you reach every interactive element? Can you see where you are? If not, neither can a substantial number of your users — and in many jurisdictions, that is a legal problem as well as a design one.
        `),
        lesson('CSS Layout Without the Guesswork', 14, `
Most CSS frustration comes from fighting the layout system instead of using it. Modern CSS has two layout engines that handle almost everything: **Flexbox** for one dimension, **Grid** for two.

### The box model

Every element is a box: content, then \`padding\`, then \`border\`, then \`margin\`. By default, setting \`width: 300px\` sizes only the *content*, so padding and border make the visible box wider than you asked for.

Fix it once, globally:

\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
\`\`\`

Now \`width: 300px\` means the box is 300px, padding included. Put this in every project.

### Flexbox: one direction

\`\`\`css
.toolbar {
  display: flex;
  gap: 1rem;              /* space between children — never use margins for this */
  align-items: center;    /* cross axis */
  justify-content: space-between; /* main axis */
}
\`\`\`

Reach for Flexbox when items flow in a line: nav bars, button rows, a label beside a value.

### Grid: two directions

\`\`\`css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}
\`\`\`

That one rule is a fully responsive card grid with no media queries. It reads as: "as many columns as fit, each at least 260px, sharing leftover space equally". Cards reflow from three across to two to one as the screen narrows.

### Mobile first

Write the narrow layout as your base, then add complexity upward:

\`\`\`css
.layout { display: block; }

@media (min-width: 768px) {
  .layout { display: grid; grid-template-columns: 250px 1fr; }
}
\`\`\`

Starting narrow keeps the base case simple. Starting wide means every media query is an undo.

### Units that scale

Use \`rem\` for type and spacing so everything respects the user's browser font size. Use \`%\` and \`fr\` for widths. Reserve \`px\` for things that genuinely should not scale, like a 1px border.
        `),
      ],
      [
        q('Which status code range means the client sent something wrong?', ['2xx', '3xx', '4xx', '5xx'], 2,
          '4xx is a client error — bad input, missing auth. 5xx means the server failed.'),
        q('Why do logins need cookies or tokens?', [
          'Because HTTP is stateless and the server cannot remember previous requests',
          'Because passwords are too long for a URL',
          'Because browsers block repeat requests',
          'Because HTML forms cannot send data',
        ], 0, 'Each HTTP request arrives with no memory of the last, so identity must be re-sent every time.'),
        q('You need an element that navigates to another page. Which is correct?', [
          '<button>', '<a>', '<div onclick>', '<span role="link">',
        ], 1, 'Links navigate, buttons act. Using the right one gives you keyboard and screen-reader behaviour for free.'),
        q('What does grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) produce?', [
          'Exactly three equal columns',
          'A single scrolling row',
          'As many columns as fit, each at least 260px wide',
          'One column per child element',
        ], 2, 'auto-fill packs in as many tracks as fit; minmax sets the floor and lets them share the remainder.'),
      ]
    ),
    chapter(
      'JavaScript for Applications',
      'The language features you actually reach for when building real software.',
      [
        lesson('Values, Scope, and Functions', 13, `
JavaScript has a reputation for surprising people. Almost all of those surprises come from three areas: how values are copied, how scope works, and how \`this\` is bound.

### Primitives copy, objects share

\`\`\`js
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — numbers are copied

const x = { count: 5 };
const y = x;
y.count = 10;
console.log(x.count); // 10 — objects share a reference
\`\`\`

\`x\` and \`y\` are two names for **the same object**. This single fact explains most "why did my data change?" bugs, and it is why React insists you create new objects rather than mutating existing ones (Chapter 3).

### const, let — and never var

\`\`\`js
const total = 0;   // cannot be reassigned
let count = 0;     // can be reassigned
\`\`\`

Default to \`const\`. Reach for \`let\` only when you genuinely reassign. \`var\` leaks out of blocks and hoists confusingly — it exists only for backwards compatibility.

Note that \`const\` prevents *reassignment*, not *mutation*:

\`\`\`js
const list = [1, 2];
list.push(3);   // fine — the binding still points at the same array
list = [4];     // TypeError
\`\`\`

### Functions and arrow functions

\`\`\`js
function double(n) { return n * 2; }
const double = (n) => n * 2;   // implicit return
const greet = (name) => { return \`Hi \${name}\`; };
\`\`\`

The real difference is \`this\`. Arrow functions do not create their own \`this\` — they inherit it from where they were defined. That is why callbacks are almost always arrows:

\`\`\`js
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    setInterval(() => { this.seconds++; }, 1000); // arrow keeps \`this\`
  }
}
\`\`\`

With a regular \`function\` there, \`this\` would be undefined and the counter would throw.

### Truthiness

Falsy values, in full: \`false\`, \`0\`, \`-0\`, \`0n\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Everything else is truthy — including \`[]\` and \`{}\`.

This bites when checking for missing values:

\`\`\`js
if (count) { }          // skips when count is 0 — probably a bug
if (count != null) { }  // only skips null and undefined — usually what you meant
\`\`\`

Use \`??\` for defaults rather than \`||\` when zero and empty string are valid:

\`\`\`js
const perPage = input ?? 20;  // 0 stays 0
const perPage = input || 20;  // 0 becomes 20 — often wrong
\`\`\`
        `),
        lesson('Arrays, Objects, and Immutable Updates', 13, `
Most application code is transforming lists and records. Learning the handful of methods that do this without mutation will carry you through the rest of the course.

### The four you will use constantly

\`\`\`js
const courses = [
  { title: 'React', hours: 20, level: 'beginner' },
  { title: 'Node',  hours: 30, level: 'advanced' },
  { title: 'CSS',   hours: 10, level: 'beginner' },
];

// map — transform each item, same length out
courses.map(c => c.title);            // ['React', 'Node', 'CSS']

// filter — keep matching items
courses.filter(c => c.level === 'beginner');   // React and CSS

// find — first match, or undefined
courses.find(c => c.title === 'Node');

// reduce — collapse to a single value
courses.reduce((sum, c) => sum + c.hours, 0);  // 60
\`\`\`

All four return something new and leave the original array untouched. Chain them freely:

\`\`\`js
const beginnerHours = courses
  .filter(c => c.level === 'beginner')
  .reduce((sum, c) => sum + c.hours, 0);   // 30
\`\`\`

### Mutating vs non-mutating

This distinction matters enormously in React:

| Mutates (avoid in state) | Returns new (prefer) |
|---|---|
| \`push\`, \`pop\`, \`splice\` | \`[...arr, item]\`, \`slice\` |
| \`sort\`, \`reverse\` | \`[...arr].sort()\` |
| \`obj.key = value\` | \`{ ...obj, key: value }\` |

\`sort\` catches everyone out — it sorts **in place** and returns the same array. Copy first.

### Spreading and destructuring

\`\`\`js
// Copy an object with one field changed
const updated = { ...course, hours: 25 };

// Add to an array without mutating
const withNew = [...courses, { title: 'SQL', hours: 15 }];

// Pull fields out by name
const { title, hours } = course;
const { level = 'beginner' } = course;   // with a default

// Same for arrays, by position
const [first, second] = courses;
\`\`\`

### Optional chaining

When data might be missing — and data from an API always might be:

\`\`\`js
const city = user?.address?.city;        // undefined instead of a crash
const count = user?.courses?.length ?? 0;
\`\`\`

Without \`?.\`, a missing \`address\` throws \`Cannot read properties of undefined\`. This one operator eliminates a whole category of production errors.
        `),
        lesson('Async JavaScript: Promises and async/await', 15, `
JavaScript runs your code on a single thread. If it waited for a network request to finish, the entire page would freeze. Instead, slow work is handed off and your code carries on — which is why async code exists.

### A promise is a value that has not arrived yet

A promise is in one of three states: **pending**, **fulfilled** (it has a value), or **rejected** (it has an error).

\`\`\`js
fetch('/api/courses')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
\`\`\`

### async/await reads better

The same thing, written to look sequential:

\`\`\`js
async function loadCourses() {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Could not load courses', err);
    return [];
  }
}
\`\`\`

Two things to remember:

1. \`await\` only works inside an \`async\` function.
2. An \`async\` function **always** returns a promise, even when you return a plain value.

### fetch does not reject on 404

This surprises nearly everyone. \`fetch\` only rejects on *network* failure — a 404 or 500 is a perfectly successful round trip as far as it is concerned. You must check \`res.ok\` yourself, as above. Forgetting this means error pages get parsed as if they were data.

### Run independent work in parallel

\`\`\`js
// Sequential — 2 seconds total. Wasteful when they do not depend on each other.
const user = await fetchUser();
const courses = await fetchCourses();

// Parallel — 1 second total.
const [user, courses] = await Promise.all([fetchUser(), fetchCourses()]);
\`\`\`

Use \`Promise.all\` whenever requests do not depend on one another. Note it rejects as soon as *any* input rejects; \`Promise.allSettled\` waits for all and reports each outcome separately.

### Loops and await

\`\`\`js
// Sequential — each waits for the last
for (const id of ids) {
  await save(id);
}

// Parallel — all at once
await Promise.all(ids.map(id => save(id)));
\`\`\`

Both are correct; pick deliberately. Sequential when order matters or you are respecting a rate limit, parallel when you just want it done.
        `),
      ],
      [
        q('const list = [1,2]; list.push(3); — what happens?', [
          'TypeError, because list is const',
          'It works; const prevents reassignment, not mutation',
          'The array is silently copied',
          'It works but returns a new array',
        ], 1, 'const locks the binding, not the contents. list = [4] would throw; list.push(3) is fine.'),
        q('Which expression leaves 0 as 0 rather than replacing it with the default?', [
          'input || 20', 'input ?? 20', 'input && 20', 'Boolean(input) ? input : 20',
        ], 1, '?? only falls back on null/undefined. || falls back on every falsy value, including 0 and "".'),
        q('Why must you check res.ok after fetch?', [
          'Because fetch does not reject on 4xx/5xx responses',
          'Because res.json() is synchronous',
          'Because fetch always returns undefined on error',
          'Because .catch() cannot be used with fetch',
        ], 0, 'fetch rejects only on network failure. A 404 resolves normally, so an unchecked response gets parsed as data.'),
        q('Two independent API calls each take 1 second. Fastest correct approach?', [
          'await one, then await the other',
          'Promise.all([a(), b()])',
          'A for loop with await inside',
          'Call them without await',
        ], 1, 'Promise.all starts both immediately and waits for both — about 1 second instead of 2.'),
      ]
    ),
    chapter(
      'Building UIs with React',
      'Components, state, and effects — the mental model behind every React app.',
      [
        lesson('Components and Props', 12, `
A React component is a function that takes data and returns a description of UI. That is the whole idea; everything else is a refinement of it.

\`\`\`jsx
function CourseCard({ title, duration, level }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{duration} · {level}</p>
    </article>
  );
}
\`\`\`

Used like an HTML tag, with data passed as attributes:

\`\`\`jsx
<CourseCard title="React Basics" duration="4 weeks" level="Beginner" />
\`\`\`

### JSX is JavaScript

Curly braces drop you back into JavaScript. Anything that evaluates to a value works:

\`\`\`jsx
<p>{course.title.toUpperCase()}</p>
<p>{isFree ? 'Free' : \`$\${price}\`}</p>
{error && <p className="error">{error}</p>}
\`\`\`

Because JSX compiles to function calls, a few HTML attribute names change: \`class\` becomes \`className\`, \`for\` becomes \`htmlFor\`, and event handlers are camelCase (\`onClick\`, not \`onclick\`).

### Rendering lists

\`\`\`jsx
<div className="grid">
  {courses.map(course => (
    <CourseCard key={course.id} {...course} />
  ))}
</div>
\`\`\`

The \`key\` must be **stable and unique** — a database id, not the array index. With index keys, inserting an item at the front makes React think every item changed, which loses input state and scroll position. This is one of the most common real-world React bugs.

### Props are read-only

A component must never modify its own props. Data flows **down** from parent to child; to send information back up, the parent passes a function:

\`\`\`jsx
function CourseCard({ title, onEnroll }) {
  return <button onClick={() => onEnroll(title)}>Enrol</button>;
}

// Parent decides what enrolling means
<CourseCard title="React" onEnroll={handleEnroll} />
\`\`\`

This one-way flow is what makes React apps traceable: to find out why something on screen looks the way it does, you walk *up* the tree.

### Composition with children

\`\`\`jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Panel title="Outline"><LessonList /></Panel>
\`\`\`

\`children\` is whatever you nested inside the tag — the main tool for building reusable layout components.
        `),
        lesson('State and Events', 13, `
Props come from outside. **State** is data a component owns and changes over time.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count}</button>;
}
\`\`\`

\`useState\` returns the current value and a setter. Calling the setter tells React to re-run the component and paint the new result.

### Never mutate state

\`\`\`jsx
// Wrong — React sees the same array reference and skips re-rendering
items.push(newItem);
setItems(items);

// Right — a new array
setItems([...items, newItem]);

// Wrong
user.name = 'Ali';
setUser(user);

// Right
setUser({ ...user, name: 'Ali' });
\`\`\`

React compares by reference. Mutating in place leaves the reference identical, so React concludes nothing changed and your UI silently goes stale. This is the direct practical consequence of "objects share a reference" from Chapter 2.

### Updates are batched and asynchronous

\`\`\`jsx
setCount(count + 1);
setCount(count + 1);   // count was captured once; this adds 1, not 2

setCount(c => c + 1);
setCount(c => c + 1);  // functional form — correctly adds 2
\`\`\`

When the next value depends on the previous one, pass a function. React hands you the latest value rather than the one captured when the handler was created.

### Controlled inputs

\`\`\`jsx
function SignupForm({ onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();          // stop the browser reloading the page
    onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Sign up</button>
    </form>
  );
}
\`\`\`

The input's value comes *from* state and changes *through* state. React is now the single source of truth, so validating, resetting, or pre-filling the form is just a state update.

### Where should state live?

Put state in the **closest common ancestor** of every component that needs it. Too high and unrelated parts of the app re-render; too low and you cannot share it. When two siblings need the same data, lift it to their parent.
        `),
        lesson('Effects and Data Fetching', 14, `
Rendering should be pure: given the same props and state, a component returns the same UI and touches nothing else. Anything outside that — network requests, subscriptions, timers — is a **side effect**, and belongs in \`useEffect\`.

\`\`\`jsx
import { useState, useEffect } from 'react';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/learn/courses');
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        if (!cancelled) { setCourses(data.data); setStatus('ready'); }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };   // cleanup
  }, []);

  if (status === 'loading') return <p>Loading…</p>;
  if (status === 'error') return <p>Could not load courses.</p>;
  return <ul>{courses.map(c => <li key={c.id}>{c.title}</li>)}</ul>;
}
\`\`\`

### The dependency array decides when it runs

\`\`\`jsx
useEffect(() => { ... });            // after every render — rarely right
useEffect(() => { ... }, []);        // once, on mount
useEffect(() => { ... }, [courseId]);// on mount and whenever courseId changes
\`\`\`

Every value from component scope that the effect uses belongs in that array. Leaving one out means the effect runs with stale data. The \`react-hooks/exhaustive-deps\` lint rule catches this — listen to it.

### Cleanup prevents real bugs

The returned function runs before the next effect and on unmount. The \`cancelled\` flag above stops a slow response from calling \`setState\` on a component the user has already navigated away from — which otherwise leaks memory and can overwrite fresher data.

Timers and listeners need the same treatment:

\`\`\`jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

Without that \`clearInterval\`, every mount adds another timer that never stops.

### Three states, always

Real data has three outcomes: loading, error, and success. Handling only success produces the blank screen users report as "the site is broken". Model all three from the start — it is far harder to retrofit.
        `),
      ],
      [
        q('Why should a list key be a stable id rather than the array index?', [
          'Indexes are slower to compare',
          'Inserting at the front shifts every index, so React loses element state',
          'React forbids numeric keys',
          'Indexes break the map() return value',
        ], 1, 'With index keys, an insertion renumbers everything and React mismatches DOM nodes — losing input values and focus.'),
        q('setItems(items) after items.push(x) fails to re-render. Why?', [
          'push returns undefined',
          'The array reference is unchanged, so React sees no change',
          'State updates only accept objects',
          'push is asynchronous',
        ], 1, 'React compares by reference. Mutating in place keeps the same reference, so the update is skipped.'),
        q('Which correctly increments twice in one handler?', [
          'setCount(count+1); setCount(count+1);',
          'setCount(c => c+1); setCount(c => c+1);',
          'count = count + 2;',
          'setCount(count++); setCount(count++);',
        ], 1, 'The functional form receives the latest value; the plain form captures one stale value for both calls.'),
        q('What does returning a function from useEffect do?', [
          'Provides the value for the next render',
          'Registers cleanup that runs before the next effect and on unmount',
          'Makes the effect synchronous',
          'Cancels the component render',
        ], 1, 'It is the cleanup function — clear timers, unsubscribe, and cancel in-flight requests there.'),
      ]
    ),
    chapter(
      'Servers, APIs, and Node',
      'The back end: routing, REST design, validation, and honest error handling.',
      [
        lesson('Node and the Module System', 11, `
Node is JavaScript running outside the browser. There is no \`window\` and no DOM; instead you get the filesystem, network sockets, processes, and environment variables.

### Two module systems

\`\`\`js
// ES Modules — the modern default. Requires "type": "module" in package.json
import express from 'express';
export const helper = () => {};
export default router;

// CommonJS — the older style, still everywhere
const express = require('express');
module.exports = router;
\`\`\`

Pick one per project. Mixing them causes confusing failures. This course uses ES Modules, which is what \`"type": "module"\` in \`package.json\` switches on.

### package.json is the contract

\`\`\`json
{
  "name": "server",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": { "express": "^4.19.2" },
  "devDependencies": { "nodemon": "^3.1.0" }
}
\`\`\`

- \`dependencies\` — needed to *run* in production.
- \`devDependencies\` — needed only to develop and build.
- The \`^\` allows compatible updates; \`package-lock.json\` pins the exact tree so every machine installs the same thing.

### Configuration through the environment

Never hardcode secrets. Read them from the environment:

\`\`\`js
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;
\`\`\`

Keep real values in \`.env\`, add \`.env\` to \`.gitignore\`, and commit a \`.env.example\` listing the *names* with dummy values. A secret pushed to a repository must be treated as compromised and rotated — deleting the commit is not enough, because the history persists in clones.

### Everything is async

Node's whole design assumes you never block the single thread:

\`\`\`js
import { readFile } from 'fs/promises';
const text = await readFile('./notes.md', 'utf8');
\`\`\`

Synchronous variants (\`readFileSync\`) exist, but a blocked thread means *every* pending request stalls. Use them only at startup, never while serving traffic.
        `),
        lesson('REST APIs with Express', 14, `
Express turns the raw request/response cycle from Chapter 1 into something you can compose.

\`\`\`js
import express from 'express';

const app = express();
app.use(express.json());          // parse JSON request bodies

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(5000, () => console.log('listening on 5000'));
\`\`\`

### Middleware is a pipeline

Every request flows through your middleware in the order you registered it. Each one can inspect, modify, respond, or pass along with \`next()\`:

\`\`\`js
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();                          // forget this and the request hangs forever
});
\`\`\`

That ordering matters: \`express.json()\` must come *before* any route that reads \`req.body\`, or the body will be undefined.

### Designing routes around resources

REST means URLs name **things**, and the HTTP method says what you are doing to them:

| Method + path | Purpose |
|---|---|
| \`GET /api/courses\` | List courses |
| \`GET /api/courses/:slug\` | One course |
| \`POST /api/courses\` | Create |
| \`PATCH /api/courses/:id\` | Partially update |
| \`DELETE /api/courses/:id\` | Remove |

Avoid verbs in paths — \`POST /api/getCourses\` fights the whole convention. The method already carries the verb.

### Reading input

\`\`\`js
app.get('/api/courses/:slug', (req, res) => {
  const { slug } = req.params;            // path segment
  const { page = 1 } = req.query;         // ?page=2
  // req.body for POST/PATCH payloads
});
\`\`\`

### Routers keep files small

\`\`\`js
// routes/courses.routes.js
import { Router } from 'express';
const router = Router();
router.get('/', listCourses);
router.post('/:slug/enroll', enroll);
export default router;

// server.js
app.use('/api/courses', coursesRouter);
\`\`\`

Paths inside the router are relative to where it is mounted, so \`router.get('/')\` serves \`/api/courses\`.

### Security basics that cost one line each

\`\`\`js
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());                                  // sensible security headers
app.use(cors({ origin: 'https://yoursite.com' }));  // who may call you
app.use('/api/', rateLimit({ windowMs: 60_000, max: 60 }));
\`\`\`

Rate limiting matters most on anything that writes or authenticates — without it, a login endpoint is an open invitation to credential stuffing.
        `),
        lesson('Validation, Errors, and Status Codes', 13, `
**Never trust input.** Client-side validation is a convenience for honest users; anyone can bypass it with \`curl\`. The server is the only place validation actually counts.

### Validate at the edge

\`\`\`js
import Joi from 'joi';

const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
});

app.post('/api/register', (req, res) => {
  const { error, value } = registrationSchema.validate(req.body, {
    abortEarly: false,      // report every problem, not just the first
    stripUnknown: true,     // silently drop fields you did not ask for
  });

  if (error) {
    return res.status(400).json({ message: 'Validation failed', errors: error.details });
  }

  // \`value\` is now clean, typed, and safe to store
});
\`\`\`

\`stripUnknown\` is quietly important: it stops a caller sneaking \`{ role: "admin" }\` into a payload and having it written straight to your database.

### Return the status code that tells the truth

\`\`\`js
res.status(200).json(data);      // fetched
res.status(201).json(created);   // created — include the new resource
res.status(400)                  // malformed or invalid input
res.status(401)                  // not authenticated — who are you?
res.status(403)                  // authenticated but not allowed
res.status(404)                  // no such resource
res.status(409)                  // conflict, e.g. email already registered
res.status(500)                  // we broke
\`\`\`

The 401/403 distinction trips people up: 401 means "log in", 403 means "you are logged in and still may not do this".

### Centralise error handling

An error handler is the one middleware with four arguments:

\`\`\`js
app.use((err, req, res, next) => {
  console.error(err);                        // full detail in your logs
  res.status(err.status || 500).json({
    message: err.expose ? err.message : 'Internal server error',
  });
});
\`\`\`

Register it **last**, after all routes.

### Never leak internals

\`\`\`js
// Dangerous — exposes file paths, library versions, sometimes credentials
res.status(500).json({ error: err.stack });

// Safe — detail to the logs, a generic message to the caller
console.error(err);
res.status(500).json({ message: 'Internal server error' });
\`\`\`

Stack traces are a reconnaissance gift to an attacker. Log them where you can read them; send the user something useful and vague.

### Async route errors

In Express 4, a rejected promise inside an async handler is **not** caught automatically:

\`\`\`js
app.get('/api/thing', async (req, res, next) => {
  try {
    res.json(await loadThing());
  } catch (err) {
    next(err);        // hand it to the error handler
  }
});
\`\`\`

Forget the try/catch and the request hangs until it times out.
        `),
      ],
      [
        q('Why must express.json() be registered before routes that read req.body?', [
          'It sets the response content type',
          'Middleware runs in registration order, so the body is unparsed before it',
          'It creates the router',
          'It is required for GET requests',
        ], 1, 'Middleware is an ordered pipeline. Register the parser after the route and req.body is undefined.'),
        q('A logged-in user requests something they lack permission for. Correct status?', [
          '400', '401', '403', '404',
        ], 2, '401 means "authenticate". 403 means "authenticated, still not allowed".'),
        q('What does Joi stripUnknown: true protect against?', [
          'SQL injection in query strings',
          'Callers injecting extra fields such as role: "admin"',
          'Requests larger than 1MB',
          'Cross-origin requests',
        ], 1, 'It discards fields the schema does not declare, so unexpected keys never reach your database.'),
        q('Why not return err.stack to the client on a 500?', [
          'It is too large to send',
          'It leaks file paths and internals useful to an attacker',
          'Express forbids it',
          'It breaks JSON parsing',
        ], 1, 'Log the stack server-side; send a generic message. Traces are reconnaissance material.'),
      ]
    ),
    chapter(
      'Data, Auth, and Deployment',
      'Persisting data, authenticating users safely, and getting the whole thing online.',
      [
        lesson('Modelling and Storing Data', 13, `
Before choosing a database, decide what you are storing and how you will read it back.

### Relational vs document

**Relational** (PostgreSQL, MySQL, SQLite) stores rows in tables with a fixed schema and links them with foreign keys. Strong guarantees, excellent for data with real relationships — which is most business data.

**Document** (MongoDB) stores flexible JSON-like documents. Easy to start, good when the shape genuinely varies.

The honest default for an application like this one is relational. Courses have chapters, chapters have lessons, users have enrolments — that *is* a relational model, and pretending otherwise means reimplementing joins in application code.

### Model the relationships

\`\`\`sql
CREATE TABLE courses (
  id    INTEGER PRIMARY KEY,
  slug  TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL
);

CREATE TABLE chapters (
  id       INTEGER PRIMARY KEY,
  courseId INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title    TEXT NOT NULL
);
\`\`\`

\`REFERENCES\` makes it impossible to create a chapter pointing at a course that does not exist. \`ON DELETE CASCADE\` removes the chapters when the course goes. Let the database enforce what the database can enforce — application code forgets, constraints do not.

### Constraints are free correctness

\`\`\`sql
email TEXT NOT NULL UNIQUE          -- no duplicate accounts, ever
UNIQUE (userId, courseId)           -- cannot enrol twice
NOT NULL                            -- required means required
\`\`\`

A \`UNIQUE\` constraint holds even when two requests race each other. An application-level "check then insert" does not — between the check and the insert, another request slips in.

### Index what you filter on

\`\`\`sql
CREATE INDEX idx_progress_user ON lesson_progress (userId, lessonId);
\`\`\`

Without an index, finding a row means scanning every row. With one, it is a lookup. Index the columns in your \`WHERE\` and \`JOIN\` clauses — and no more, since each index costs write speed and disk.

### Always use parameters

\`\`\`js
// Catastrophic — string concatenation is SQL injection
db.prepare(\`SELECT * FROM users WHERE email = '\${email}'\`);

// Correct — the driver escapes it for you
db.prepare('SELECT * FROM users WHERE email = ?').get(email);
\`\`\`

An email of \`' OR '1'='1\` turns the first query into "return every user". Parameterised queries send the value separately from the statement, so it can never be read as SQL. There is no situation where concatenation is worth it.
        `),
        lesson('Authentication with Hashed Passwords and Tokens', 15, `
Authentication is the area where a mistake is most expensive, and the rules are refreshingly short.

### Never store a password

Store a **hash** — a one-way transformation that cannot be reversed.

\`\`\`js
import bcrypt from 'bcryptjs';

// On signup
const passwordHash = await bcrypt.hash(password, 10);

// On login
const ok = await bcrypt.compare(password, user.passwordHash);
\`\`\`

bcrypt is deliberately *slow* and salts every hash automatically. Slowness is the feature: it makes brute-forcing a stolen database impractical. Never use MD5 or SHA-1 for passwords — they are fast, which is exactly wrong here.

The \`10\` is the cost factor. Higher is slower and safer; 10–12 is the usual range.

### Tokens carry identity across requests

Because HTTP is stateless (Chapter 1), the client must prove who it is on every request. A JWT is a signed statement of identity:

\`\`\`js
import jwt from 'jsonwebtoken';

const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Verifying on later requests
const payload = jwt.verify(token, process.env.JWT_SECRET);   // throws if tampered
\`\`\`

A JWT is **signed, not encrypted**. Anyone can decode and read the payload — so never put anything secret in it. It carries an id, not a password.

### Guarding routes

\`\`\`js
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

app.get('/api/my-courses', requireAuth, listMyCourses);
\`\`\`

### The rules worth memorising

1. Hash with bcrypt or argon2. Never store, log, or email a plain password.
2. Keep \`JWT_SECRET\` in the environment, long and random. A leaked secret lets anyone mint valid tokens for any account.
3. Give tokens an expiry.
4. **Say the same thing for a wrong email and a wrong password** — "Invalid email or password". Distinguishing them tells an attacker which accounts exist.
5. Rate-limit login endpoints.
6. Enforce authorisation separately: a valid token proves *who*, not *what they may do*. Always confirm the resource belongs to \`req.user\`.
7. Serve everything over HTTPS. A token on an unencrypted connection is a password in transit.
        `),
        lesson('Shipping to Production', 12, `
Working locally and working in production differ in a handful of predictable ways. Handle them deliberately.

### Build the client, serve it from the API

In development you run two servers: React on 3000, the API on 5000. In production you build the React app to static files and let the API serve them, so everything is one origin:

\`\`\`js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  );
}
\`\`\`

That catch-all matters for client-side routing: a hard refresh on \`/courses\` must return \`index.html\` so React Router can handle the path. Register it **after** your API routes, or it will swallow them.

Same-origin serving also makes CORS mostly disappear, and lets the client use relative URLs like \`/api/courses\`.

### Configure by environment, not by edit

\`\`\`js
const API_BASE = process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
\`\`\`

The same build should run anywhere, driven by environment variables. Never ship a code change just to point at a different server.

### A pre-launch checklist

- Secrets in environment variables; \`.env\` git-ignored and never committed.
- \`NODE_ENV=production\` set.
- HTTPS everywhere.
- \`helmet()\`, CORS restricted to your real domain, rate limiting on writes and auth.
- Every input validated server-side.
- Generic error messages out, full detail in logs.
- Database backed up on a schedule — and a restore actually tested. An untested backup is a hope, not a backup.
- Health endpoint for your host to poll.

### Watch it after launch

Shipping is the start. Track error rates, response times, and failed logins. A quiet 500 that only fires for one signup path can run for weeks unnoticed — until you look at the logs and find it has been failing since launch.

### Where to go next

You now have the full stack: markup, styling, interactive UI, HTTP API, validation, persistence, auth, and deployment. The natural next steps are automated testing, TypeScript for type safety across the boundary, and CI/CD so deployments become routine rather than an event.
        `),
      ],
      [
        q('Why is bcrypt preferred over SHA-256 for passwords?', [
          'It produces shorter hashes',
          'It is deliberately slow and salts automatically, making brute force impractical',
          'It is reversible with the right key',
          'It is the only algorithm Node supports',
        ], 1, 'Password hashing should be slow. Fast general-purpose hashes let attackers test billions of guesses per second.'),
        q('What is unsafe to put in a JWT payload?', [
          'The user id',
          'An expiry timestamp',
          'Anything secret — the payload is signed but readable by anyone',
          'The issuer name',
        ], 2, 'JWTs are signed, not encrypted. Anyone holding the token can decode and read the payload.'),
        q('Why return "Invalid email or password" instead of naming which was wrong?', [
          'It is shorter to display',
          'Distinct messages reveal which accounts exist, enabling enumeration',
          'It avoids translation work',
          'The server cannot tell them apart',
        ], 1, '"No such user" confirms an email is unregistered — letting an attacker map your user base before attacking passwords.'),
        q('Why must the express.static catch-all be registered after API routes?', [
          'Static files load faster that way',
          'A catch-all matches everything, so registered first it would intercept API requests',
          'Express requires alphabetical registration',
          'It only works after app.listen',
        ], 1, 'app.get("*") matches every path. Placed before your API routes it returns index.html for /api/... too.'),
      ]
    ),
    chapter(
      'Debugging and Automated Testing',
      'Proving which layer a bug lives in, and the two kinds of test that stop it coming back.',
      [
        lesson('Finding the Layer a Bug Lives In', 13, `
Every full-stack bug lives in exactly one layer, and the fastest way to fix it is to prove which layer *before* changing a line of code. A request crosses the browser, the network, your middleware stack, a route handler, and the database. Guessing means editing five places; bisecting means editing one.

### Start at the boundary

Open DevTools, go to the Network tab, trigger the action, and read the row.

| What the Network tab shows | Where the bug is |
|---|---|
| No request at all | The client — the handler never fired, or the effect never ran |
| \`404\` | Wrong path, or a router mounted at a different prefix than you think |
| \`400\` with your own validation message | The client is sending the wrong shape — read the request payload |
| \`401\` | The token was never attached, or it has expired |
| \`500\` | The server. Stop reading the browser and go read the server log |
| \`200\` with correct JSON, empty screen | React — state, keys, or render logic |

That last row is the one worth internalising. Once the response is correct, no amount of staring at Express will help you.

### Take React out of the equation

\`curl\` talks to your API with nothing in between:

\`\`\`bash
curl -i -X POST http://localhost:5000/api/register -H 'Content-Type: application/json' -d '{"name":"Ali","email":"ali@example.com"}'
\`\`\`

\`-i\` prints the status line and headers. If curl gets a \`201\` and the browser gets a \`400\`, the bug is in what your client sends — the handler is fine. If curl fails too, you have just removed the entire front end from the search space and can work in one file.

### Four failures you will hit this month

- **\`req.body\` is empty or undefined.** Either \`express.json()\` is missing or registered after the route (Chapter 4) — then it is \`undefined\` — or the caller never sent \`Content-Type: application/json\`: \`curl -d\` defaults to \`application/x-www-form-urlencoded\`, which the JSON parser ignores, leaving \`req.body\` as \`{}\`.
- **A CORS error in the console.** The request *reached* your server and came back. CORS is the browser refusing to hand the response to your JavaScript because the server did not say your origin is allowed. It is always fixed on the server, never in the client.
- **A \`404\` on a hard refresh of \`/courses\` in production.** The catch-all from Chapter 5 is missing, or it is registered before the API routes and swallowing them.
- **A \`useEffect\` that never stops firing.** A dependency is an object or array rebuilt on every render, so it is never equal to the previous one and the effect re-runs forever.

### When the layer really is React

Once the response is correct, switch tools. The React DevTools **Components** tab shows the live props and state of any node in the tree — confirm that the data you just watched arrive in the Network tab actually reached the component, in the shape you assumed it had.

\`\`\`jsx
// Logs on every render — did the component re-run at all?
console.log('CourseList render', { status, count: courses.length });

// Logs only when the effect re-runs — did a dependency change?
useEffect(() => console.log('effect ran for', courseId), [courseId]);
\`\`\`

Those two lines separate the two questions people constantly conflate. A component that renders once with an empty array is a fetch that never made it into state. A component that renders forever is the dependency problem above. A component that never renders at all is usually a parent that threw during render — and without an error boundary, one thrown error takes the entire subtree down and leaves you a blank white page with nothing in the Network tab to explain it.

### Make production bugs traceable

Logging the word "error" tells you nothing at 2am. Log one structured line per request, carrying an id you also hand back to the caller:

\`\`\`js
import { randomUUID } from 'node:crypto';

app.use((req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);        // the user can quote this back to you
  console.log(JSON.stringify({ id: req.id, method: req.method, path: req.path }));
  next();
});
\`\`\`

Log the same \`req.id\` inside the error handler from Chapter 4, and one \`grep\` turns "it broke this morning" into the exact failing request, with its path, body size, and stack trace.

### Read the error before you theorise

The first line of a stack trace names the file and the line number. The classic mistake is skimming past it, deciding the framework must be broken, and rewriting a component that worked — when the message said \`Cannot read properties of undefined (reading 'title')\` and the real fix was a single \`?.\` from Chapter 2.
        `),
        lesson('Testing the API with Vitest and Supertest', 14, `
API tests buy more confidence per line than any other kind. One request exercises routing, middleware, validation, the handler, and the database together — and unlike a browser test, it finishes in milliseconds.

### Make the app importable

The one structural change tests need is an app built by a module that never listens:

\`\`\`js
// src/app.js — builds the app, opens nothing
export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);             // the routes from Chapters 4 and 5
  app.use(errorHandler);                  // last, as always (Chapter 4)
  return app;
}

// src/server.js — the only place a port is bound
import { createApp } from './app.js';
createApp().listen(process.env.PORT || 5000);
\`\`\`

Import a module that calls \`app.listen()\` and your test run binds a port and then hangs, because a listening server keeps the Node process alive. Supertest starts and stops its own ephemeral server for each request.

### A first test

\`\`\`js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetDatabase } from './helpers.js';

const app = createApp();
beforeEach(() => resetDatabase());        // drop and re-migrate, or truncate every table

describe('POST /api/register', () => {
  it('rejects a missing email with 400', async () => {
    const res = await request(app).post('/api/register').send({ name: 'Ali' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('creates the user and returns 201', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ name: 'Ali', email: 'ali@example.com', password: 'hunter2!' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('ali@example.com');
    expect(res.body.passwordHash).toBeUndefined();   // never serialise the hash
  });
});
\`\`\`

Each test **arranges** its own data, **acts** with one request, and **asserts** on the status and the body. Assert on the contract a caller can see, never on which internal function ran — then refactoring the handler does not break the suite.

### Isolate the data

Point tests at their own database: \`DATABASE_URL=:memory:\` for SQLite, or a dedicated test database you recreate on every run. Then reset between tests.

The classic mistake is a suite where every test passes alone and half of them fail together. That is almost always shared rows: one test registers \`ali@example.com\`, the next registers it again and gets a \`409\` from the \`UNIQUE\` constraint of Chapter 5. Assume tests run in any order, or in parallel, because eventually they will.

### Testing a guarded route

\`\`\`js
it('rejects an unauthenticated request', async () => {
  const res = await request(app).get('/api/my-courses');
  expect(res.status).toBe(401);
});

it("refuses another user's enrolment", async () => {
  const login = await request(app)
    .post('/api/login')
    .send({ email: 'ali@example.com', password: 'hunter2!' });

  const res = await request(app)
    .get('/api/enrolments/99')                       // belongs to someone else
    .set('Authorization', \`Bearer \${login.body.token}\`);

  expect(res.status).toBe(403);
});
\`\`\`

### Pin the security behaviour too

\`\`\`js
it('does not leak internals when the handler throws', async () => {
  vi.spyOn(repo, 'listCourses').mockRejectedValue(new Error('connection refused at 10.0.0.4'));

  const res = await request(app).get('/api/courses');

  expect(res.status).toBe(500);
  expect(res.body.message).toBe('Internal server error');        // generic, as Chapter 4 insisted
  expect(JSON.stringify(res.body)).not.toContain('10.0.0.4');    // no host, no stack, no paths
});
\`\`\`

Somebody will eventually "improve" that error handler by returning \`err.message\` to make debugging easier. This test is what stops the improvement reaching production.

### Wire it into npm scripts

\`\`\`json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
\`\`\`

\`vitest run\` executes once and exits, which is what CI needs; the bare \`vitest\` watches files and re-runs as you type, which is what you want while writing. Point the suite at throwaway configuration rather than your development environment:

\`\`\`js
// vitest.config.js
export default {
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],   // loads .env.test, then migrates a clean schema
  },
};
\`\`\`

Running the suite against your development database is a mistake you make exactly once. \`resetDatabase()\` truncates every table, so the first accidental run deletes the accounts and enrolments you have been clicking through all week.

### Test the unhappy paths first

Happy paths break loudly the first time anyone clicks through the app. The paths that break *silently* are the ones worth automating: \`400\` on invalid input, \`401\` with no token, \`409\` on a duplicate email, and above all \`403\` when the token is valid but the record belongs to somebody else. That authorisation test is the most valuable one in most codebases, precisely because normal use never exercises it — which is exactly why the bug ships.

Chase route coverage rather than line coverage: every endpoint deserves one happy case and its refusals.
        `),
        lesson('Testing React Components the Way Users Use Them', 13, `
The guiding rule of React Testing Library is that a test should drive a component the way a person does: find things by their visible text or accessible role, interact, and assert on what appears. Never on state variables, hook calls, or class names.

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SignupForm from './SignupForm';

test('submits the email that was typed', async () => {
  const onSubmit = vi.fn();
  render(<SignupForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'ali@example.com');
  await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'ali@example.com' });
});
\`\`\`

That test knows nothing about \`useState\`. Rewrite the controlled input from Chapter 3 as a reducer, swap in a form library, add three fields — it still passes. That is what a test is for.

### Query in priority order

\`getByRole\` first, \`getByLabelText\` for form fields, then \`getByText\`. \`getByTestId\` is the last resort.

There is a hidden benefit here. When \`getByRole('button')\` cannot find your button, it is usually because the button is a clickable \`<div>\` — the Chapter 1 mistake — and the failing test has just found you a real accessibility bug.

### get, query, find

| Query | If nothing matches | Use it for |
|---|---|---|
| \`getBy…\` | throws immediately | it must be on screen right now |
| \`queryBy…\` | returns \`null\` | asserting something is **not** there |
| \`findBy…\` | returns a promise, retries ~1s | it appears after async work |

The classic mistake:

\`\`\`jsx
expect(screen.getByText(/loading/i)).toBeNull();     // getBy throws first — the assertion never runs
expect(screen.queryByText(/loading/i)).toBeNull();   // correct way to assert absence
expect(await screen.findByText('React Basics')).toBeInTheDocument();  // waits for the fetch
\`\`\`

### Fake the network, not your component

\`CourseList\` from Chapter 3 fetches on mount. Do not hand-stub \`global.fetch\` in every test — intercept at the network layer with MSW so the component runs its real code path:

\`\`\`js
// setupTests.js
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('/api/learn/courses', () =>
    HttpResponse.json({ data: [{ id: 1, title: 'React Basics' }] })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());   // undo any per-test override
afterAll(() => server.close());
\`\`\`

Now you can test all three states from Chapter 3 — including the one nobody writes:

\`\`\`jsx
test('shows a message when the API fails', async () => {
  server.use(http.get('/api/learn/courses', () => new HttpResponse(null, { status: 500 })));

  render(<CourseList />);
  expect(await screen.findByText(/could not load/i)).toBeInTheDocument();
});
\`\`\`

### Render with the providers the component needs

A page that calls \`useNavigate\` or reads an auth context throws the instant you render it bare — *useNavigate() may be used only in the context of a Router*. Wrap it once in a helper instead of repeating the setup in every test:

\`\`\`jsx
function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

test('shows the outline for a course', async () => {
  renderWithProviders(<CourseOutline />, { route: '/courses/full-stack-web' });
  expect(await screen.findByRole('heading', { name: /full-stack/i })).toBeInTheDocument();
});
\`\`\`

The helper is also the right place to seed a logged-in user, so a test for a guarded page costs one line rather than five lines of scaffolding.

### About that act() warning

\`An update to CourseList was not wrapped in act(...)\` means state changed after the test had finished — usually an \`await\` you forgot on a \`userEvent\` call, or a fetch resolving into an unmounted component. The fix is almost never to reach for \`act()\`; it is to \`await\` a \`findBy…\` so the test waits for the update it triggered. It is the same class of problem the cleanup function in Chapter 3 solves in real code.

### When a query finds nothing

\`\`\`jsx
screen.debug();                          // prints the rendered DOM as it currently stands
screen.getByRole('nonexistent-role');    // the error lists every role actually on screen
\`\`\`

A failing \`getByRole\` prints the accessible tree with the roles and names it *did* find, which usually answers the question on the spot: the accessible name is split across two elements, the label is not wired to the input (Chapter 1), or the element is still behind a loading state you forgot to await.

### What not to test

Do not assert that a hook ran, that a spinner has a particular class, or that a child received a specific prop. Those tests fail on every harmless refactor and keep passing while the app is visibly broken.
        `),
      ],
      [
        q('The Network tab shows a 200 with exactly the JSON you expected, but the list renders empty. Where is the bug?', [
          'The Express route handler',
          'The database query',
          'The React state or render logic',
          'The CORS configuration',
        ], 2, 'A correct response means every server layer already did its job; what is left is how the component stores and renders it.'),
        q('Why should the module your tests import build the app without calling app.listen()?', [
          'Supertest can only test routers, not applications',
          'A listening server keeps an open handle, so the test process hangs instead of exiting',
          'Middleware is not registered until listen() runs',
          'Vitest cannot import modules that use Express',
        ], 1, 'Supertest binds its own ephemeral port; an app that listens on import leaves Node alive after the suite finishes.'),
        q('Which query correctly asserts that a loading message is no longer on screen?', [
          'getByText(/loading/i)',
          'findByText(/loading/i)',
          'getAllByText(/loading/i)',
          'queryByText(/loading/i)',
        ], 3, 'Only queryBy returns null when nothing matches — getBy throws before your assertion ever runs.'),
        q('Your API tests pass individually but several fail when the whole suite runs. Most likely cause?', [
          'They share database rows, so each one depends on what ran before it',
          'Supertest cannot open more than one connection',
          'Vitest caches HTTP responses between files',
          'The error handler is registered twice',
        ], 0, 'Unreset shared data makes tests order-dependent; each test must create the rows it needs against a clean database.'),
      ]
    ),
    chapter(
      'Performance, Scale, and Operations',
      'Making the stack fast once there is real data in it, and running it safely after launch.',
      [
        lesson('Making the Database Do Less Work', 14, `
An API that feels instant with 20 rows and takes four seconds with 20,000 is almost never slow in JavaScript. It is doing one of three things in the database: running a query per row, scanning a table with no usable index, or returning data nobody asked for.

### The N+1 query

\`\`\`js
// One query for the list…
const courses = await db.all('SELECT id, title FROM courses');

// …and one more for every single row. 50 courses = 51 round trips.
for (const c of courses) {
  c.chapters = await db.all('SELECT id, title FROM chapters WHERE courseId = ?', c.id);
}
\`\`\`

Locally each round trip costs a fraction of a millisecond, so this looks perfectly healthy. In production the database sits on another machine and each trip costs 5–20ms: 51 of them add up to between a quarter of a second and a full second of pure waiting. This is the most common performance bug in web applications, and ORMs with lazy relations produce it invisibly.

Fix it with one batched query instead of N:

\`\`\`js
const ids = courses.map(c => c.id);
const holes = ids.map(() => '?').join(',');       // still parameterised (Chapter 5)

const rows = await db.all(
  \`SELECT courseId, id, title FROM chapters WHERE courseId IN (\${holes}) ORDER BY position\`,
  ids
);

const byCourse = new Map(courses.map(c => [c.id, []]));
for (const row of rows) byCourse.get(row.courseId).push(row);
for (const c of courses) c.chapters = byCourse.get(c.id);
\`\`\`

Two queries whether the list holds 5 rows or 5,000. Turn query logging on in development and count the lines: if the number of queries grows with the size of the response, you have an N+1.

### Read the plan instead of guessing

\`\`\`sql
EXPLAIN QUERY PLAN SELECT * FROM lesson_progress WHERE userId = 7;
-- SCAN lesson_progress                                    <- reads every row
-- SEARCH lesson_progress USING INDEX idx_progress_user    <- what you want to see
\`\`\`

In PostgreSQL the command is \`EXPLAIN ANALYZE\` and you are looking for \`Index Scan\` rather than \`Seq Scan\`. Either way, measure the plan — do not reason about it from the outside.

### Composite indexes read left to right

The index from Chapter 5 covers \`(userId, lessonId)\`. It serves:

| Query | Uses the index? |
|---|---|
| \`WHERE userId = ?\` | Yes |
| \`WHERE userId = ? AND lessonId = ?\` | Yes |
| \`WHERE lessonId = ?\` | **No** |

Only a leftmost prefix counts. The classic mistake is adding an index, seeing no improvement at all, and concluding indexes do not help — when the query filters on the second column alone and needs its own index.

### Aggregate where the data already is

Pulling ten thousand rows into Node so JavaScript can count them wastes the network and the memory both:

\`\`\`js
// Slow: every row crosses the wire so that .filter() can discard most of them
const rows = await db.all('SELECT * FROM lesson_progress WHERE courseId = ?', id);
const done = rows.filter(r => r.completedAt).length;

// Fast: one number crosses the wire
const { done } = await db.get(
  'SELECT COUNT(*) AS done FROM lesson_progress WHERE courseId = ? AND completedAt IS NOT NULL',
  id
);
\`\`\`

The same applies to \`GROUP BY\`, \`SUM\`, and \`ORDER BY\`. The database has the indexes and decades of query optimisation behind it; your handler has one thread it must not block (Chapter 4). Do the reducing next to the data.

### Return less

\`\`\`js
const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);   // clamp at both ends
const rows = await db.all('SELECT id, title FROM courses ORDER BY id LIMIT ?', limit);
\`\`\`

Clamp the bottom as well as the top: a bare \`Math.min\` still lets \`?limit=-1\` through, and SQLite reads \`LIMIT -1\` as *no limit at all* — the caller gets the whole table, which is exactly what you were trying to prevent.

Select the columns the screen actually needs. A list view that drags a long \`body\` column along wastes bandwidth, memory, and serialisation time on every request.

Deep \`OFFSET\` degrades too, because the database still walks the rows it skips. For long lists, page by the last id you saw:

\`\`\`sql
SELECT id, title FROM courses WHERE id > ? ORDER BY id LIMIT 20;   -- constant cost at any depth
\`\`\`

### Let the client skip the request entirely

\`\`\`js
res.set('Cache-Control', 'public, max-age=300');   // a catalogue that changes hourly
\`\`\`

Express already sends an \`ETag\`, so a matching \`If-None-Match\` returns \`304 Not Modified\` with no body at all. The fastest query is the one you never run.
        `),
        lesson('Front-End Performance Users Can Feel', 14, `
Users do not experience your bundle size. They experience three things: **LCP** — when the main content appears, aim under 2.5s; **CLS** — how much the layout jumps around, under 0.1; and **INP** — how long a tap takes to show a result, under 200ms.

### Measure before you change anything

\`\`\`bash
npm run build
npx source-map-explorer 'build/static/js/*.js'   # what is actually in the bundle
\`\`\`

Run Lighthouse on a throttled profile too. The classic mistake is scattering \`useMemo\` through a codebase that is slow because it ships a 900KB date library and four unoptimised photographs. Profile first, then fix the tallest bar.

### Ship less JavaScript

Split at route boundaries before anything else:

\`\`\`jsx
import { lazy, Suspense } from 'react';

const CourseOutline = lazy(() => import('./pages/CourseOutline'));
const Certificate   = lazy(() => import('./pages/CertificateView'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/courses/:slug" element={<CourseOutline />} />
    <Route path="/certificate/:id" element={<Certificate />} />
  </Routes>
</Suspense>
\`\`\`

A PDF renderer used on one page should not sit in the file every visitor downloads before they see the home page.

### Kill the waterfall

\`\`\`jsx
// Sequential: the second request cannot start until the first resolves
const profile = await fetchProfile();
const catalogue = await fetchCatalogue();

// Independent work, started together (Chapter 2)
const [profile, catalogue] = await Promise.all([fetchProfile(), fetchCatalogue()]);
\`\`\`

A parent that fetches, renders a child, and lets the child fetch produces the same staircase in component form — each level waiting on the one above. Fetch at the top and pass the data down as props.

### Memoise deliberately

\`\`\`jsx
// memo() does nothing here — a new object and a new function on every render
<CourseList filters={{ level: 'beginner' }} onPick={(id) => open(id)} />

// Stable identities, so the comparison can actually succeed
const filters = useMemo(() => ({ level }), [level]);
const onPick  = useCallback((id) => open(id), [open]);
export default memo(CourseCard);
\`\`\`

\`memo\` compares props by reference — the same rule from Chapter 2 that governs React state. An inline object or arrow function defeats it completely, which is why "I wrapped it in memo and nothing changed" is such a common report. Memoise a component when it is genuinely expensive **and** its props are stable; otherwise you have added work rather than removed it.

### The cheap wins are not JavaScript

- Give every image explicit \`width\` and \`height\`. The browser reserves the space before the file arrives and your CLS drops to zero. Layout shift is nearly always an image, a banner, or a late-loading font.
- \`loading="lazy"\` on anything below the fold, and serve sensible dimensions. A 4000px hero scaled to 600px in CSS still downloads all four thousand pixels.
- \`font-display: swap\` so text is readable while the webfont loads.
- Never render 5,000 rows. Paginate against the API from the previous lesson, or virtualise so only the visible window exists in the DOM.

### Cache and de-duplicate requests

Two components that both need the course list will both fetch it — the effect from Chapter 3 has no memory of what another component already asked for. A data layer such as TanStack Query gives you one request, a shared cache, and background revalidation:

\`\`\`jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['courses'],
  queryFn: () => fetch('/api/learn/courses').then(r => r.json()),
  staleTime: 60_000,          // treat the cached copy as fresh for a minute
});
\`\`\`

Those are the same three states from Chapter 3 without the boilerplate, and returning to a page you have already visited paints instantly from cache while the refetch happens quietly behind it. If you would rather not add the dependency, the principle survives on its own: hoist the fetch to a shared parent or a context so each piece of data is requested once, not once per component that happens to display it.

### Close the loop

Change one thing, rebuild, measure again — with the Network panel throttled to Fast 3G and the CPU slowed 4×. Your laptop on office fibre is the least representative device your application will ever run on, and an optimisation that helps there can easily make a mid-range phone worse.
        `),
        lesson('Pipelines, Migrations, and Incidents', 13, `
After launch the question stops being "does it work?" and becomes "can I change it on a Friday afternoon and still sleep?" Three things buy that: a pipeline that refuses bad code, migrations that can be rolled back, and enough visibility to know something broke before a user tells you.

### Run the checks on every pull request

\`\`\`yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci           # installs the exact locked tree (Chapter 4)
      - run: npm run lint
      - run: npm test         # the Supertest and RTL suites from Chapter 6
      - run: npm run build    # a build that fails here must never reach production
\`\`\`

Use \`npm ci\`, not \`npm install\`. It installs exactly what \`package-lock.json\` pins and fails loudly when the lock file is stale, so CI can never pass against a different dependency tree than the one you tested.

### Migrations are committed code

Every schema change is a numbered file in the repository, applied in order, and never edited once it has run anywhere:

\`\`\`sql
-- migrations/007_add_last_seen.sql
ALTER TABLE users ADD COLUMN lastSeenAt TEXT;
\`\`\`

One rule makes a deploy reversible: **the previous version of your code must still work against the new schema.** During any rollout both versions are live for a while, and a rollback puts the old code back while the migration stays applied.

So renaming a column in a single step is the classic outage. The moment it runs, every instance still on the old release throws \`no such column\`, and rolling back does not save you — the column is already gone. Do it across three releases instead:

| Release | Change |
|---|---|
| 1 — expand | Add the new nullable column; write to both |
| 2 — migrate | Backfill old rows; switch reads to the new column |
| 3 — contract | Drop the old column once nothing reads it |

Additive changes are safe. Renames, drops, and adding \`NOT NULL\` to an existing column are not.

### See what is happening

Emit one structured log line per request carrying the id from Chapter 6, and track three numbers: error rate, p95 latency, and throughput. Alert on symptoms a user would notice — a rising 5xx rate, an endpoint crossing its latency budget — not on CPU. An alert that has never once led to an action only teaches the team to ignore alerts.

### Triaging an incident

1. **Stop the bleeding first.** Roll back, or switch the feature flag off. Diagnosis comes after the site is up.
2. **Ask what changed.** A deploy, a config edit, a traffic spike, a certificate that expired at midnight.
3. **Narrow by layer**, exactly as in Chapter 6: browser, API, database.
4. **Write the timeline down while it is happening.** You will not remember the order tomorrow.
5. **Write it up blamelessly afterwards** — what happened, why, and the one change that prevents a repeat. A postmortem ending in "be more careful" changes nothing; one ending in "add a \`UNIQUE\` constraint" changes everything.

### Feature flags separate deploying from releasing

A rollback takes minutes and reverts everything in the release. A flag takes seconds and reverts one thing:

\`\`\`js
// Ship the code dark, enable it for yourself, then for 1%, then for everyone
if (flags.newCertificateRenderer) {
  return renderWithNewPipeline(enrolment);
}
return renderLegacy(enrolment);
\`\`\`

Read flags from configuration, never from a constant that needs a redeploy to change — otherwise "turn the feature off" during an incident is just another deploy, at the worst possible moment. Flags also let a risky change reach 1% of traffic on a Tuesday morning rather than everyone at once on a Friday night.

Then delete the flag and the dead branch once the feature has settled. A codebase carrying twenty permanent flags is a codebase with a million untested combinations, and nobody can tell you which one a given user is running.

### Keep deploys small

Ten small releases are far easier to diagnose than one large one: when something breaks, the suspect list is a few lines rather than a month of work. Small and reversible beats big and careful.
        `),
      ],
      [
        q('A list endpoint runs one query for 50 courses, then one query per course for its chapters. Best fix?', [
          'Add an index on courses.id',
          'Fetch every chapter in one batched query and group the rows in memory',
          'Cache the whole response for five minutes',
          'Raise the database connection pool size',
        ], 1, 'N+1 is a round-trip problem, so collapsing it to two queries removes the per-row network latency that only appears in production.'),
        q('You have an index on (userId, lessonId). Which query cannot use it?', [
          'WHERE userId = ?',
          'WHERE userId = ? AND lessonId = ?',
          'WHERE userId = ? ORDER BY lessonId',
          'WHERE lessonId = ?',
        ], 3, 'A composite index is only usable from its leftmost column onward, so filtering on the second column alone still scans the table.'),
        q('You wrapped CourseCard in memo() and it still re-renders every time. Why?', [
          'The parent passes a new object or arrow function as a prop on every render',
          'memo only works on class components',
          'memo requires a key prop to compare against',
          'The component calls useState internally',
        ], 0, 'memo compares props by reference, and a freshly created object or function is never equal to the previous one.'),
        q('Why is renaming a database column in a single migration unsafe?', [
          'ALTER TABLE locks the table until the deploy finishes',
          'Column names are cached by the database driver',
          'The previous version of the code is still running during the rollout and after any rollback',
          'Migrations cannot be applied while the server is live',
        ], 2, 'Old code and new schema have to coexist, which is why a rename needs separate expand, migrate, and contract releases.'),
      ]
    ),
  ],
  final: [
    q('Which status code should a successful POST that creates a resource return?', ['200', '201', '204', '302'], 1,
      '201 Created signals a new resource exists, and the response should include it.'),
    q('const y = x assigns an object. Mutating y.count also changes x.count. Why?', [
      'Objects are copied by value',
      'Both names reference the same object',
      'const makes objects shared',
      'It is a JavaScript bug',
    ], 1, 'Objects are assigned by reference; both bindings point at one object in memory.'),
    q('Which array method returns a new array rather than mutating in place?', [
      'push', 'sort', 'map', 'splice',
    ], 2, 'map returns a new array. push, sort, and splice all mutate the original.'),
    q('A fetch call gets a 404. What does the promise do?', [
      'Rejects, triggering catch',
      'Resolves with res.ok === false',
      'Throws a TypeError',
      'Retries automatically',
    ], 1, 'fetch only rejects on network failure. Check res.ok for HTTP error statuses.'),
    q('Why does React require stable keys in lists?', [
      'To sort the list',
      'To match elements across renders and preserve their state',
      'To make map() faster',
      'To generate unique CSS classes',
    ], 1, 'Keys tell React which DOM node corresponds to which item; unstable keys lose input state and focus.'),
    q('Where does a network request belong in a React component?', [
      'Directly in the component body',
      'Inside useEffect',
      'In the return statement',
      'In useState initialiser',
    ], 1, 'Rendering must stay pure. Side effects such as fetching belong in useEffect.'),
    q('What does ON DELETE CASCADE do?', [
      'Prevents deleting the parent row',
      'Deletes child rows when the parent is deleted',
      'Copies rows to a backup table',
      'Marks rows as archived',
    ], 1, 'It removes dependent rows automatically, so no orphaned children remain.'),
    q('Why parameterise SQL queries instead of building strings?', [
      'Parameters are faster to parse',
      'Values are sent separately from the statement, so input cannot become SQL',
      'It keeps queries shorter',
      'It enables indexes',
    ], 1, 'Parameterisation is the defence against SQL injection — the value can never be interpreted as code.'),
    q('Which belongs in an environment variable rather than source code?', [
      'The port number for local development',
      'The JWT signing secret',
      'A CSS colour token',
      'The list of route paths',
    ], 1, 'Secrets must never be committed. A leaked JWT secret lets anyone forge tokens for any account.'),
    q('In production, why serve the React build from the Express server?', [
      'React cannot run without Node',
      'It gives one origin, avoiding CORS and allowing relative API URLs',
      'It disables client-side routing',
      'Static files require Express',
    ], 1, 'Single-origin serving removes cross-origin complexity and lets the client call /api/... relatively.'),
    q('A request returns 200 with exactly the JSON you expect, but the page stays empty. Where do you look first?', [
      'The database query plan',
      'The Express error handler',
      'The CORS configuration on the server',
      'The React state and rendering code',
    ], 3, 'A correct response proves every server layer succeeded, leaving only how the component stores and renders that data.'),
    q('Why do API tests import a createApp() factory instead of the module that calls app.listen()?', [
      'A listening server keeps an open handle, so the test run never exits',
      'Supertest requires the app to be running on port 3000',
      'app.listen() removes middleware from the stack',
      'Express applications cannot be exported from ES modules',
    ], 0, 'Supertest binds its own ephemeral port, so importing a module that listens leaves Node alive after the suite finishes.'),
    q('An endpoint issues one query for the list and one more per row. What is wrong, and why does it only hurt in production?', [
      'A deadlock — the per-row queries lock each other',
      'A connection leak — every query opens a new pool',
      'An N+1 query — round trips are near-free locally but cost milliseconds each over a network',
      'A cache miss — the rows were evicted between queries',
    ], 2, 'The cost is latency per round trip, invisible against a local database and worth seconds against a remote one.'),
    q('Which sequence lets you roll the application back safely after a schema change?', [
      'Rename the column and deploy the code using the new name in the same release',
      'Add the new column, deploy code that writes to both, backfill, then drop the old column in a later release',
      'Drop the old column first so nothing can read stale data',
      'Apply every migration only after the new code has finished rolling out',
    ], 1, 'Expand, migrate, contract keeps the previous version working against the new schema, which is exactly what a rollback needs.'),
  ],
});
