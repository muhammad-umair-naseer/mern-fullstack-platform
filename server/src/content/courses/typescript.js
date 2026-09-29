import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'typescript',
  title: 'TypeScript for JavaScript Developers',
  category: 'Web',
  level: 'Intermediate',
  duration: '6 weeks',
  accent: 'sky',
  coverKey: 'typescript',
  summary:
    'Turn the bugs you currently find in production into red squiggles you find while typing — inference, unions, generics, and the patterns that make a large codebase safe to change.',
  description:
    'You take working JavaScript knowledge and learn to model data precisely enough that whole classes of bug become unrepresentable: discriminated unions for state, generics for reusable code, type guards for untrusted input, and validated types at the API boundary. Each chapter leaves you able to fix a specific real failure — the any that leaked through res.json(), the switch that silently forgot a case, the useRef that will not compile, and the .d.ts file nobody on the team knows how to write.',
  chapters: [
    chapter(
      'Why Types, and Getting Them Running',
      'What a type checker actually buys you, how to configure tsc properly, and where annotations belong.',
      [
        lesson('What Types Actually Catch', 12, `
A type system is a machine-checked proof that certain bugs cannot happen. It is not documentation and it is not a linter — it is a check that reads every line you write and refuses to build the program when the shapes do not line up.

### The bug that ships every week

\`\`\`js
// JavaScript. Runs fine, right up until it does not.
function totalPrice(order) {
  return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

totalPrice({ items: [{ price: '', qty: 2 }] });      // 0 — a blank price field is silently free
totalPrice({ lineItems: [] });                       // TypeError at runtime
\`\`\`

The second failure is loud, and you will fix it today. The first is the dangerous one: no crash, no stack trace, just a wrong number written to your database and discovered by an accountant three months later.

\`\`\`ts
type Item  = { price: number; qty: number };
type Order = { items: Item[] };

function totalPrice(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

totalPrice({ items: [{ price: '', qty: 2 }] });
// Type 'string' is not assignable to type 'number'.

totalPrice({ lineItems: [] });
// Object literal may only specify known properties, and 'lineItems' does not exist in type 'Order'.
\`\`\`

Both errors now appear in your editor before you save the file.

### The four categories worth the price of admission

**Property typos and renames.** Rename \`items\` to \`lines\` in the type and every read of \`order.items\` in the codebase lights up. In JavaScript you grep, hope, and find the last one in production.

**Missing values.** With \`strictNullChecks\` on, \`user.address.city\` is an error until you prove \`address\` exists. "Cannot read properties of undefined" is the most common JavaScript runtime error, and this one flag deletes most of it.

**Wrong shapes across a boundary.** A function expecting \`{ id: number }\` that receives \`{ id: string }\` fails at the call site instead of nine frames deep in unrelated code.

**Missed cases after a change.** Add a fifth payment method to a union and every \`switch\` that handled four stops compiling. Chapter 2 shows exactly how to set that up.

### Types are erased

This is the fact that surprises everyone. \`tsc\` deletes the types and emits plain JavaScript:

\`\`\`ts
const user: User = getUser();   // TypeScript in
const user = getUser();         // JavaScript out
\`\`\`

There is **no runtime type checking**. Nothing inspects the JSON your API sends back. Which leads straight to the most common mistake in real TypeScript codebases:

\`\`\`ts
const user: User = await res.json();   // a wish, not a check
\`\`\`

\`res.json()\` is typed \`Promise<any>\`, and \`any\` is assignable to everything, so TypeScript accepts this without a murmur. If the server returns \`{ userId: 7 }\` instead of \`{ id: 7 }\` you get \`undefined\` at runtime and a green build. Chapter 5 fixes this properly with runtime validation.

### What types do not catch

Types check shape, not meaning. \`function daysBetween(a: Date, b: Date): number\` compiles perfectly whether it subtracts in the right order or not. Off-by-one errors, wrong business rules, and swapped arguments of the same type all sail through. Types remove a category of noise so your tests and reviews can spend their attention on logic.

### The real payoff arrives later

The first week of TypeScript feels like paperwork. The value shows up the day you rename a field on a model used across forty files, hit build, and receive a complete list of everything you must touch — then ship the refactor with a confidence you have never had in a JavaScript codebase of that size.
        `,
        [
          q('In the JavaScript totalPrice example, passing { items: [{ price: \'\', qty: 2 }] } returns 0 and throws nothing. Why is that worse than the TypeError from { lineItems: [] }?', [
            'It runs slower, because reduce coerces the string on every pass',
            'It fails silently, so a wrong total is stored and found months later',
            'It throws in production but not in development, so tests never see it',
            'It corrupts the items array in place, so a retry fails the same way',
          ], 1, 'A crash announces itself and gets fixed the same day, whereas a silently wrong number is written to the database and discovered by an accountant long afterwards.'),
          q('Which of these bugs still survives a completely green TypeScript build?', [
            'A function that subtracts two Dates in the wrong order',
            'A read of order.items after the field was renamed to lines',
            'Passing { id: string } where a { id: number } is expected',
            'Reading user.address.city when address may be undefined',
          ], 0, 'Types check shape rather than meaning, so a function with the right signature and the wrong arithmetic compiles perfectly.'),
          q('You rename items to lines on the Order type. What does the checker give you that grepping for the old name does not?', [
            'A guarantee that no JSON payload still carries the old field name',
            'An automatic rewrite of every call site performed during the build',
            'A complete list of every read of the old field, before you run anything',
            'A warning only in the files your current test suite happens to execute',
          ], 2, 'The checker reads every line of the project, so it reports all affected reads up front rather than leaving you to hope your search pattern found them.'),
        ]
      ),
        lesson('tsc, tsconfig, and Strict Mode', 13, `
TypeScript is a compiler you install **per project**. A global install guarantees version drift between your editor, your teammate, and your build server.

\`\`\`bash
npm install --save-dev typescript
npx tsc --init          # writes a commented tsconfig.json
npx tsc --noEmit        # type-check only, emit nothing
npx tsc --watch --noEmit
\`\`\`

### A tsconfig that is actually correct

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

| Option | Why it is there |
|---|---|
| \`target\` | JavaScript version to emit. Match what your runtime supports. |
| \`lib\` | Which globals exist. Drop \`"DOM"\` in a Node project so \`document\` becomes an error. |
| \`strict\` | Turns on nine separate flags. Treat it as non-negotiable. |
| \`skipLibCheck\` | Skips checking \`.d.ts\` files in \`node_modules\`. Large speed win, negligible risk. |
| \`isolatedModules\` | Guarantees each file can be transpiled alone — required by esbuild, swc, and Babel. |
| \`noEmit\` | Set it when a bundler does the emitting and \`tsc\` only checks. |

### What strict actually turns on

Two of the nine change your daily life.

**\`strictNullChecks\`** removes \`null\` and \`undefined\` from every type unless you put them back:

\`\`\`ts
function greet(name: string) { return name.toUpperCase(); }
greet(null);      // Error. Without the flag this compiles and crashes.

function greet(name: string | null) {
  return name?.toUpperCase() ?? 'stranger';   // now you must handle it
}
\`\`\`

**\`noImplicitAny\`** rejects parameters whose type it cannot infer:

\`\`\`ts
function parse(input) { }          // Error: 'input' implicitly has an 'any' type
function parse(input: string) { }  // fine
\`\`\`

The rest: \`strictFunctionTypes\`, \`strictBindCallApply\`, \`strictPropertyInitialization\`, \`strictBuiltinIteratorReturn\` (added to the family in TypeScript 5.6), \`noImplicitThis\`, \`alwaysStrict\`, and \`useUnknownInCatchVariables\` — which makes \`catch (e)\` hand you \`unknown\` instead of \`any\` (Chapter 3).

### The flag nobody enables and everybody needs

\`\`\`ts
// noUncheckedIndexedAccess: false (the default)
const first = users[0];      // typed User — a lie
first.name;                  // compiles, crashes on an empty array

// noUncheckedIndexedAccess: true
const first = users[0];      // typed User | undefined — the truth
first?.name;
\`\`\`

Array indexing and \`Record\` lookups can always miss; the default pretends they cannot. Enable it on day one of a new project. Retrofitting it into an existing one is a long afternoon.

### The classic mistake: switching strict off to get a green build

A migration hits 900 errors, someone sets \`"strict": false\`, and everything passes. You now have a codebase where \`any\` flows freely and the checker has almost nothing left to check — all of the ceremony, none of the safety.

The honest migration keeps strict on and shrinks the blast radius instead:

\`\`\`json
{ "compilerOptions": { "strict": true, "allowJs": true, "checkJs": false } }
\`\`\`

Rename \`.js\` to \`.ts\` one folder at a time. On the genuinely hard lines, leave \`// @ts-expect-error\` rather than \`// @ts-ignore\` — \`@ts-expect-error\` **fails the build once the error underneath it is gone**, so your suppressions clean themselves up instead of rotting for years.

### Checking is not building

For applications, let Vite, esbuild, or swc strip the types (fast, and they do no type-checking at all) while \`tsc --noEmit\` runs in your editor and in CI. For a published library, run \`tsc\` itself with \`"declaration": true\` so consumers receive \`.d.ts\` files — covered in Chapter 5.
        `,
        [
          q('Why is // @ts-expect-error preferred over // @ts-ignore when suppressing an error during a migration?', [
            'It fails the build once the error beneath it is gone, so suppressions cannot rot',
            'It suppresses only the first error on the line, whereas @ts-ignore hides them all',
            'It is enforced by ESLint rather than by tsc, so continuous integration sees it',
            'It downgrades the error to a warning instead of hiding the problem entirely',
          ], 0, 'An unused @ts-expect-error is itself an error, so the comment deletes itself from your backlog as soon as the underlying problem is fixed.'),
          q('Your app builds with esbuild, the deploy is green, and a type error still reaches production. What explains it?', [
            'esbuild reads tsconfig but ignores the strict flag unless you repeat it',
            'Type errors are reported only when declaration output has been enabled',
            'esbuild strips types without checking them, so only tsc --noEmit catches errors',
            'skipLibCheck switched off checking for your own source files as well',
          ], 2, 'Bundlers that transpile TypeScript delete the annotations without verifying them, so a separate tsc --noEmit run is what actually checks your code.'),
          q('You are building a Node service and a teammate writes document.querySelector. Which tsconfig change turns that into a compile error?', [
            'Setting target to ES2022 so that browser APIs are not emitted',
            'Removing "DOM" from lib so that browser globals do not exist',
            'Setting moduleResolution to Bundler so DOM types are not resolved',
            'Turning on skipLibCheck so node_modules types are never loaded',
          ], 1, 'lib decides which global declarations exist, so dropping DOM from a server project makes document an unknown name rather than a valid API.'),
        ]
      ),
        lesson('Primitives, Inference, and When to Annotate', 12, `
TypeScript already knows more than you think. Fighting its inference with redundant annotations is the most common beginner habit and it makes code worse, not safer.

### The primitives

\`\`\`ts
let title: string = 'TypeScript';
let count: number = 42;          // no separate int/float — all numbers
let big: bigint = 9007199254740993n;
let ready: boolean = true;
let nothing: null = null;
let missing: undefined = undefined;
let key: symbol = Symbol('id');
\`\`\`

Mind the capitalisation: use \`string\`, not \`String\`. The capitalised names are the wrapper *objects* and are almost never what you meant.

### Arrays, tuples, and inline object types

\`\`\`ts
const tags: string[] = ['ts', 'js'];
const grid: number[][] = [[1, 2], [3, 4]];

// Tuple: fixed length, position-specific types
const point: [number, number] = [12, 40];
const entry: [string, number] = ['age', 30];

function move(delta: { x: number; y: number }) {}
\`\`\`

### Inference does most of the work

\`\`\`ts
let   a = 'TypeScript';   // string
const b = 'TypeScript';   // 'TypeScript' — a literal type
const nums  = [1, 2, 3];  // number[]
const mixed = [1, 'a'];   // (string | number)[]

function double(n: number) {
  return n * 2;           // return type inferred as number
}
\`\`\`

That \`let\` versus \`const\` difference is **literal widening**, and it bites:

\`\`\`ts
type Method = 'GET' | 'POST';

const m1 = 'POST';              // type 'POST'
let   m2 = 'POST';              // type string — it could be reassigned to anything

const ok: Method  = m1;         // fine
const bad: Method = m2;         // Error: 'string' is not assignable to 'GET' | 'POST'
\`\`\`

The fix is \`as const\`, which freezes literals all the way down:

\`\`\`ts
const config = { method: 'POST', retries: 3 } as const;
// { readonly method: 'POST'; readonly retries: 3 }

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
// readonly ['beginner', 'intermediate', 'advanced'] — a tuple of literals
\`\`\`

Chapter 4 turns that last line into a union type without you repeating the strings.

### Where annotations belong

| Position | Annotate? |
|---|---|
| Function parameters | **Always** — nothing can infer them |
| Exported function return types | Usually — it pins your public contract |
| Internal function return types | No — inference is accurate and stays current |
| \`const x = 5\` | No |
| Empty containers | Yes — \`const ids: string[] = []\` |
| A variable initialised to null | Yes — annotate the eventual union |

\`\`\`ts
const name: string = 'Sara';   // noise — inference already said string
const ids = [];                // any[] — infects everything downstream
const ids: string[] = [];      // correct
\`\`\`

### The classic mistake: annotating a return type to make an error move

\`\`\`ts
function getUser(id: string): User {
  return cache.get(id);        // actually User | undefined
}
\`\`\`

The annotation does not fix the bug, it **relocates** it. \`tsc\` reports the problem inside the function while every caller confidently treats the result as a \`User\`. The reflex to reach for \`as User\` at this point is exactly the wrong one: it deletes the last remaining evidence that a value can be missing. Change the signature to \`User | undefined\` and let the callers deal with reality.

### Two special forms you meet immediately

\`void\` means "returns nothing useful" — the inferred type of a function with no \`return\`. \`any\` means "stop checking this value entirely", and it is contagious: every property read, call result, and return value derived from an \`any\` is also \`any\`. One \`any\` at an API boundary can silently disable checking across a whole feature. Chapter 3 covers what to use instead.
        `,
        [
          q('const m1 = \'POST\' is assignable to type Method, but let m2 = \'POST\' is not. What is the difference?', [
            'let declarations skip inference entirely and fall back to any',
            'A string literal keeps its literal type only inside a union',
            'A let can be reassigned, so its inferred type widens to string',
            'Method has to list POST first for the assignment to succeed',
          ], 2, 'Because a let may later hold any string, TypeScript widens its inferred type to string, which is not assignable to a narrow union of literals.'),
          q('function getUser(id: string): User { return cache.get(id); } where cache.get returns User | undefined. What does the annotation achieve?', [
            'It converts a missing value into a runtime error inside the function',
            'It keeps the error inside the function while callers still trust User',
            'It makes cache.get infer a return type that excludes undefined',
            'It has no effect at all, since return types are always inferred',
          ], 1, 'The annotation relocates the complaint to the return statement instead of removing the possibility of undefined, so every caller is left believing a lie.'),
          q('const ids = []; with nothing else on the line. What is inferred and why does it matter?', [
            'never[], so every push into it is rejected until you annotate',
            'unknown[], so each read out of it has to be narrowed first',
            'string[], filled in later from whatever the first push passes',
            'any[], so everything read back out of it stops being checked',
          ], 3, 'An empty array literal with no annotation infers any[], and the any spreads to every value read from it, which switches off checking downstream.'),
        ]
      ),
            lesson('Type Checking JavaScript with JSDoc', 13, `
Your \`eslint.config.js\` is 180 lines and Node loads it directly. Renaming it to \`.ts\` means adding a build step to the one file whose entire job is to have no build step. Add a single comment to the top instead and the checker starts working anyway.

### Turning it on

\`\`\`js
// @ts-check
/** @param {string} slug */
export function coursePath(slug) {
  return \`/courses/\${slug.toLowerCase()}\`;
}

coursePath(42);
// Argument of type 'number' is not assignable to parameter of type 'string'.
\`\`\`

\`// @ts-check\` opts one file in. For a whole project set \`"allowJs": true\` and \`"checkJs": true\` in tsconfig, then put \`// @ts-nocheck\` on the files you are not ready for. Everything from the earlier lessons still applies: inference, strict mode, unions, narrowing. Only the place you write annotations moves, from the code into comments.

### The syntax, side by side

| TypeScript | The same thing in a .js file |
|---|---|
| \`const n: number = 0\` | \`/** @type {number} */ const n = 0\` |
| \`function f(a: string, b?: number)\` | \`@param {string} a\`, then \`@param {number} [b]\` |
| \`(): Promise<User>\` | \`@returns {Promise<User>}\` |
| \`type Point = { x: number }\` | \`@typedef {{ x: number }} Point\` |
| \`import type { User } from './db.js'\` | \`@import { User } from './db.js'\` |
| \`function id<T>(v: T): T\` | \`@template T\`, then \`@param {T} v\` |

\`@import\` arrived in TypeScript 5.5. Older code uses \`/** @type {import('./db.js').User} */\` inline, which still works and is worth recognising when you meet it.

### The cast that catches everyone

\`\`\`js
/** @type {HTMLInputElement} */
const el = document.getElementById('email');
// Type 'HTMLElement | null' is not assignable to type 'HTMLInputElement'.

const el = /** @type {HTMLInputElement} */ (document.getElementById('email'));
\`\`\`

A \`@type\` comment binds to the parenthesised expression that follows it. Without the parentheses you are annotating the declaration, which reports the very error you were trying to assert away, or you are annotating nothing at all and the cast quietly does not happen. Every JSDoc codebase has this bug in it somewhere.

### What you give up

Anything that emits runtime code has no comment form, so classes with constructor parameter shorthand are out. Generic constraints get wordy: \`@template {{ length: number }} T\` reads far worse than \`<T extends { length: number }>\`. Hover tooltips show your comment rather than a clean signature. Past roughly three type parameters, people stop reading.

### What you get back

The file runs exactly as written. No transform, no source maps, no dist folder, no "why does my config load stale code" afternoon. And you can still publish types from it:

\`\`\`bash
npx tsc --allowJs --declaration --emitDeclarationOnly --outDir types src/index.js
\`\`\`

That emits real \`.d.ts\` files (Chapter 5) from comments, which is how several widely used packages ship without a build.

### The gotcha that gives false confidence

A \`// @ts-check\` file that no tsconfig \`include\` covers is checked with **default** compiler options, and the defaults are not strict. \`strictNullChecks\` is off, so \`user.address.city\` passes with no complaint and crashes the moment \`address\` is missing. Your editor looks green and CI never ran the check at all.

Put the file inside \`include\`, and run the check for real:

\`\`\`bash
npx tsc --noEmit          # respects your tsconfig, fails the build on error
\`\`\`

### Where this is the right call

Build tooling that a runtime loads directly (\`vite.config.js\`, \`eslint.config.js\`, \`playwright.config.js\`), small Node scripts, and the first pass of a migration where a team is not ready to argue about bundlers yet. For application source that already goes through a build, plain \`.ts\` is shorter and easier to read. The useful thing to know is that this is a switch you can throw today, on one file, without touching anyone else's workflow.
      `,
        [
          q('In a checked .js file, why must a @type cast wrap its expression in parentheses?', [
            'Parentheses tell the parser that the comment applies to the whole file',
            'Without them Node strips the comment before the checker ever reads it',
            'Parentheses force the value to be evaluated before the cast is applied',
            'The comment binds to the parenthesised expression, so without it no cast happens',
          ], 3, 'A @type comment applies to the parenthesised expression that follows it, so dropping the parentheses either annotates the declaration or nothing at all.'),
          q('When is JSDoc checking a better choice than renaming the file to .ts?', [
            'When the file must run as written, such as a config a tool loads directly',
            'When the code needs generics, because JSDoc type parameters are stricter',
            'When you want the emitted output to include runtime checks on arguments',
            'When the rest of the codebase already compiles with strict mode enabled',
          ], 0, 'JSDoc keeps the file as valid JavaScript, so a runtime that loads it directly needs no build step while you still get checking.'),
          q('A file carries // @ts-check but sits outside every tsconfig include path. What is the risk?', [
            'It is checked twice, so the same errors are reported in duplicate',
            'It is skipped completely and reports no errors under any circumstances',
            'It inherits its settings from the nearest package.json instead of tsconfig',
            'It is checked with default options, so strict null checking is switched off',
          ], 3, 'Outside a project the editor falls back to default compiler options, which are not strict, so the file looks clean while null errors go unreported.'),
        ]
      ),
      ],
      [
        q('What does TypeScript emit for the line const user: User = getUser();', [
          'A runtime check that the value matches User',
          'A call to a generated validator function',
          'const user = getUser(); — types are erased at build time',
          'Nothing; the whole line is removed',
        ], 2, 'Types exist only at compile time, so the emitted JavaScript keeps the code and drops every annotation.'),
        q('Why does const data: User = await res.json() fail to protect you?', [
          'res.json() is typed Promise<any>, and any is assignable to every type',
          'await strips type information from its operand',
          'Interfaces cannot be used with await',
          'The annotation is on the wrong side of the assignment',
        ], 0, 'An any value satisfies any annotation, so the checker approves a shape it never actually verified.'),
        q('With noUncheckedIndexedAccess enabled, what is the type of users[0] where users is User[]?', [
          'User',
          'never',
          'any',
          'User | undefined',
        ], 3, 'Indexing can always miss, so the flag adds undefined to the result and forces you to handle the empty case.'),
        q('A migration produces 900 errors and a teammate sets "strict": false. What is the main cost?', [
          'Compilation becomes noticeably slower',
          'Values quietly fall back to any, so the checker verifies almost nothing while you still pay the syntax cost',
          'Declaration files stop being generated',
          'Only the DOM library types are affected',
        ], 1, 'Without strictNullChecks and noImplicitAny the checker loses its two highest-value rules and stops reporting real errors.'),
      ]
    ),
    chapter(
      'Describing Shapes',
      'Interfaces, type aliases, unions, intersections, and the discriminated-union pattern that makes bad states impossible.',
      [
        lesson('Interfaces vs Type Aliases', 12, `
Both describe object shapes, both compose into bigger ones, and 95% of the time they are interchangeable. The differences that remain are worth ten minutes because teams argue about this in every code review.

### The same thing, twice

\`\`\`ts
interface User {
  id: string;
  name: string;
  email?: string;          // optional — the property may be absent
  readonly createdAt: Date;// assignable at creation, not afterwards
}

type User = {
  id: string;
  name: string;
  email?: string;
  readonly createdAt: Date;
};
\`\`\`

### What only a type alias can do

An alias names **any** type, not just object shapes:

\`\`\`ts
type Status   = 'idle' | 'loading' | 'ready';   // a union
type Id       = string | number;                // a primitive union
type Point    = [number, number];               // a tuple
type Handler  = (e: Event) => void;             // a function type
type Nullable<T> = T | null;                    // a generic alias
\`\`\`

Of those, an \`interface\` can only manage the function type, and then only in call-signature syntax (\`interface Handler { (e: Event): void }\`) — unions, tuples, and primitive aliases are out of reach entirely. This alone means every real codebase uses both.

### What only an interface can do

Interfaces **merge**. Two declarations with the same name combine:

\`\`\`ts
interface Window { myAnalytics: Analytics; }
// merges with the built-in Window instead of clashing with it

type Window = { myAnalytics: Analytics };
// Error: Duplicate identifier 'Window'.
\`\`\`

That is exactly how you extend third-party types — adding \`req.user\` to Express, or a global to \`window\`. Chapter 5 uses it. Merging is also a hazard inside your own code: two files can silently contribute properties to the same interface and nobody notices.

### Extending vs intersecting

\`\`\`ts
interface Admin extends User { permissions: string[]; }

type Admin = User & { permissions: string[] };
\`\`\`

\`extends\` **checks** compatibility and errors immediately when you redeclare a property with an incompatible type. \`&\` just combines, and a conflict silently produces \`never\` for that property:

\`\`\`ts
type A = { id: string };
type B = { id: number };
type C = A & B;
const c: C = { id: 'x' };   // Error: 'string' is not assignable to 'never'
\`\`\`

The error message points at the *use*, not the definition, which is why the bug is annoying to find.

### The practical rule

Use \`type\` by default. Reach for \`interface\` when you need declaration merging, or when you are publishing a library whose consumers should be able to augment your types. Pick one convention and let the linter enforce it — the consistency is worth more than the choice.

### The surprise everybody hits: excess property checking

\`\`\`ts
type Config = { url: string; retries?: number };

const c: Config = { url: '/api', retires: 3 };
// Error: 'retires' does not exist in type 'Config'. Did you mean 'retries'?

const raw = { url: '/api', retires: 3 };
const c2: Config = raw;    // NO error
\`\`\`

TypeScript applies **excess property checking only to object literals assigned directly**. Go through a variable and the check disappears, because structural typing says "has everything \`Config\` needs, extra properties are fine". This is not a bug — it is what lets you pass a \`User\` where \`{ id: string }\` is expected — but it means a typo survives the moment you refactor the literal into a variable. When it matters, annotate the variable at its declaration instead.

### Methods, properties, and one safety footgun

\`\`\`ts
interface Store {
  save(item: Item): void;        // method syntax
  save: (item: Item) => void;    // property syntax
}
\`\`\`

They look identical and are not. Method syntax parameters are checked **bivariantly** even under \`strictFunctionTypes\`, for historical compatibility with the DOM. Property syntax gets the strict contravariant check. Prefer property syntax for callbacks you actually want checked.

### Index signatures

\`\`\`ts
type Headers = { [key: string]: string };
const h: Headers = { 'content-type': 'application/json' };
h.anything;   // string — even though it is not there
\`\`\`

An index signature says "any string key works". With \`noUncheckedIndexedAccess\` you get \`string | undefined\` instead, which is the truth. For a known set of keys, \`Record<Status, string>\` from Chapter 4 is far better: it forces you to supply every key.
        `,
        [
          q('type A = { id: string }; type B = { id: number }; type C = A & B; const c: C = { id: \'x\' }; What does TypeScript report?', [
            'C itself is never, so the type alias declaration is the line that fails',
            'id resolves to never, so the error lands on the assignment, not the type',
            'id widens to string | number, so the assignment is accepted without error',
            'The later declaration wins, so id is number and the string is rejected',
          ], 1, 'Intersecting two incompatible property types produces never for that property, and since no value has type never the complaint appears wherever you try to supply one.'),
          q('You need to add a myAnalytics property to the built-in Window type. Which approach works, and why?', [
            'type Window = { myAnalytics: Analytics }, because an alias overrides a built-in',
            'An index signature on Window, because it makes every unknown key allowed',
            'interface Window { myAnalytics: Analytics }, because interfaces merge by name',
            'Neither of them, because the built-in library types are sealed to user code',
          ], 2, 'Two interface declarations with the same name combine their members, which is exactly what augmenting a third-party or built-in type requires.'),
          q('For a callback field on an object type, why prefer save: (item: Item) => void over save(item: Item): void?', [
            'Method syntax cannot appear inside a type alias, only inside an interface',
            'Property syntax lets the field be marked optional, which method syntax forbids',
            'Method syntax stops the object from being spread into a new object literal',
            'Property syntax gets the strict parameter check, method syntax stays bivariant',
          ], 3, 'Method syntax keeps bivariant parameter checking for DOM compatibility even under strictFunctionTypes, so property syntax is the one that actually catches mismatched callbacks.'),
        ]
      ),
        lesson('Unions, Intersections, and Optional Properties', 13, `
A **union** (\`A | B\`) means the value is one of these. An **intersection** (\`A & B\`) means the value is all of these at once. The symbols look like boolean operators and behave in the opposite direction from what most people first assume.

### A union restricts what you can do

\`\`\`ts
function format(id: string | number) {
  id.toUpperCase();     // Error: 'toUpperCase' does not exist on type 'string | number'
  return id.toString(); // fine — toString exists on both
}
\`\`\`

Because the value could be either, you may only touch the members **both** sides have. Widening a type therefore narrows your options. To use \`toUpperCase\` you must first prove which one you have — that is narrowing, and it is all of Chapter 3.

### An intersection expands what you have

\`\`\`ts
type Timestamps = { createdAt: Date; updatedAt: Date };
type Entity     = { id: string };

type Course = Entity & Timestamps & { title: string };

const c: Course = {
  id: 'ts-101',
  title: 'TypeScript',
  createdAt: new Date(),
  updatedAt: new Date(),
};   // all three sets of properties are required
\`\`\`

This is the workhorse for composing shared fields across models rather than copy-pasting them.

### The mental flip that trips everyone

For **sets of values**, \`|\` is a union and \`&\` is an intersection — the ordinary meaning. For **object properties** the effect inverts: a union of object types gives you fewer usable properties, an intersection gives you more. Both facts follow from the same rule (a union value must be safe under every branch), but the first time you write \`type Both = Cat | Dog\` and cannot read \`name\` off it, it feels backwards.

\`\`\`ts
type Cat = { kind: 'cat'; meow(): void };
type Dog = { kind: 'dog'; bark(): void };

function speak(pet: Cat | Dog) {
  pet.kind;    // fine — present on both
  pet.bark();  // Error: not on Cat
}
\`\`\`

### Optional properties are not quite the same as undefined

\`\`\`ts
type A = { name?: string };           // may be absent, or present as undefined
type B = { name: string | undefined };// must be present, may hold undefined

const a: A = {};                      // fine
const b: B = {};                      // Error: 'name' is missing
\`\`\`

Use \`?\` when the key may legitimately be absent — a partial update payload. Use \`| undefined\` when the key is part of the contract and its value may be empty. Under the \`exactOptionalPropertyTypes\` flag, \`{ name: undefined }\` is no longer assignable to \`A\`, which stops "I explicitly set it to undefined" from being confused with "I never sent it" — a real distinction when you are building a PATCH body.

### The classic mistake: an optional-property soup

\`\`\`ts
type Response = {
  data?: User[];
  error?: string;
  loading?: boolean;
};
\`\`\`

Three optional booleans and objects give you **eight** combinations, of which perhaps three are real. Nothing stops \`{ loading: true, error: 'boom', data: [...] }\`, and every consumer must defensively check all three fields in the right order. Reviewers approve this type constantly because each field looks reasonable on its own.

The next lesson replaces it with a shape where the impossible combinations cannot be written down.

### Unions inside arrays

\`\`\`ts
type A = (string | number)[];   // one array, items may be either
type B = string[] | number[];   // either an all-string or an all-number array

const a: A = ['x', 1];          // fine
const b: B = ['x', 1];          // Error
\`\`\`

Parentheses change the meaning completely. \`B\` is usually what an API means when it says "a list of ids or a list of names", and \`A\` is what people write by accident.

### Never as the empty union

\`\`\`ts
type Impossible = string & number;   // never — no value is both
\`\`\`

\`never\` is the type with no values. It looks academic here and turns into your best tool for exhaustiveness in the next lesson.
        `,
        [
          q('type A = { name?: string } and type B = { name: string | undefined }. Which statement is correct?', [
            '{} satisfies A but not B, because B requires the key to be present',
            'Both accept {}, because undefined is the default value of any property',
            '{} satisfies B but not A, because ? forbids leaving the object empty',
            'Neither accepts {} once strictNullChecks has been switched on',
          ], 0, 'The question mark makes the key itself optional, while a union with undefined only widens the value, so B still demands that the property be written out.'),
          q('const b: string[] | number[] = [\'x\', 1] fails to compile. What is going on?', [
            'The value must be all strings or all numbers, so (string | number)[] is the fix',
            'Unions are not permitted in array element positions while strict mode is on',
            'An array literal needs an as const assertion before a union annotation applies',
            'Order matters here, so writing number[] | string[] would accept the same value',
          ], 0, 'The union sits outside the brackets, so the value has to be one homogeneous array or the other, whereas moving the union inside allows mixed elements.'),
          q('Why does widening a parameter from Cat to Cat | Dog reduce what the function body may do?', [
            'Because a union erases methods and keeps only the data properties',
            'Because the compiler picks the first member and ignores the rest',
            'Because only operations that are safe on every member are allowed',
            'Because Cat and Dog do not share a discriminant property yet',
          ], 2, 'A union value could be any one of its members at runtime, so the checker permits only the members present on all of them until you narrow.'),
        ]
      ),
        lesson('Literal Types and Discriminated Unions', 14, `
This is the single most useful pattern in TypeScript. If you take one thing from this course, take this lesson.

### Literal types

A literal type is a type with exactly one value:

\`\`\`ts
type Yes = 'yes';
let y: Yes = 'yes';
y = 'no';           // Error

type Status = 'idle' | 'loading' | 'ready' | 'error';
type Dice   = 1 | 2 | 3 | 4 | 5 | 6;
\`\`\`

A union of literals replaces string constants, enums, and most of the defensive checks you write today. Autocomplete lists the valid values, and a typo is a compile error rather than a branch that silently never runs.

### The problem: booleans multiply

\`\`\`ts
type State = {
  loading: boolean;
  data: User[] | null;
  error: string | null;
};
\`\`\`

That is 2 × 2 × 2 = **eight** states, of which three are meaningful. Nothing prevents \`{ loading: true, data: null, error: 'Network error' }\`, and every component reading it needs a defensive ladder to guess what is going on.

### The fix: tag each variant

\`\`\`ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: User[] }
  | { status: 'error'; message: string };
\`\`\`

Four states. Exactly four. The shared \`status\` field is the **discriminant**: a literal-typed property present on every member with a different value in each. TypeScript uses it to narrow automatically.

\`\`\`ts
function render(state: State) {
  if (state.status === 'ready') {
    return state.data.length;      // data exists here — no null check needed
  }
  if (state.status === 'error') {
    return state.message;          // message exists here
  }
  state.data;   // Error: 'data' does not exist on 'idle' | 'loading'
}
\`\`\`

The impossible combinations are now unwriteable, and the checks you used to write by hand are performed for you.

### Exhaustiveness: the part that pays for itself

\`\`\`ts
function label(state: State): string {
  switch (state.status) {
    case 'idle':    return 'Ready when you are';
    case 'loading': return 'Loading…';
    case 'ready':   return \`\${state.data.length} users\`;
    case 'error':   return state.message;
    default: {
      const _exhaustive: never = state;   // every case handled, so state is never
      throw new Error(\`Unhandled state: \${JSON.stringify(_exhaustive)}\`);
    }
  }
}
\`\`\`

Add a fifth variant — \`{ status: 'refreshing'; data: User[] }\` — and that \`never\` assignment fails to compile with "Type '{ status: "refreshing"; ... }' is not assignable to type 'never'". **Every switch in the codebase that forgot the new case becomes a build error**, immediately, with the file and line. That is the whole reason to prefer this over a bag of booleans: adding a state can no longer quietly skip a branch.

Note the annotated return type on \`label\`. Without it, a missed \`return\` widens the inferred type to include \`undefined\` instead of erroring — the annotation is what turns the mistake into a message.

### It works for anything with variants

\`\`\`ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

async function loadUser(id: string): Promise<Result<User>> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) return { ok: false, error: \`HTTP \${res.status}\` };
  return { ok: true, value: await res.json() };
}

const r = await loadUser('7');
if (r.ok) console.log(r.value);   // value only exists on the success branch
else      console.error(r.error); // error only exists on the failure branch
\`\`\`

Reducer actions are the other canonical use:

\`\`\`ts
type Action =
  | { type: 'add'; item: Item }
  | { type: 'remove'; id: string }
  | { type: 'clear' };
\`\`\`

Now \`action.id\` is only reachable inside the \`'remove'\` branch, and dispatching \`{ type: 'remove' }\` without an id will not compile.

### Rules for a good discriminant

Use a **literal type**, not \`string\`. Use the **same property name** on every member. Prefer a descriptive name (\`type\`, \`status\`, \`kind\`) over a boolean — \`{ isError: true }\` narrows too, but stops scaling at two variants. And keep the payload *inside* the variant that owns it, never hoisted to the top level, or you are back to eight states.
        `,
        [
          q('type State = { loading: boolean; data: User[] | null; error: string | null }. How many combinations does it allow, and why does that matter?', [
            'Three, because the three fields are mutually exclusive by convention',
            'Four, matching the four states a fetch request can actually be in',
            'Two, because the boolean field dominates the other two fields',
            'Eight, and most of them are nonsense the checker still accepts',
          ], 3, 'Two by two by two gives eight combinations, so states such as loading and error together are representable and every consumer has to guess which field to trust.'),
          q('Why must the discriminant of a tagged union be a literal type rather than plain string?', [
            'Because string values cannot be compared with === inside a switch',
            'Because narrowing needs distinct literal values to tell members apart',
            'Because a string field forces the union to be flattened into one shape',
            'Because literal types are erased and therefore cost nothing at runtime',
          ], 1, 'The checker matches your comparison against each member\'s literal value, and if every member declares plain string then no comparison can rule any of them out.'),
          q('What goes wrong if you hoist data: User[] | null to the top level of a tagged union instead of keeping it inside the ready variant?', [
            'The switch statement no longer compiles without a default branch',
            'TypeScript merges the separate variants back into one object type',
            'Every branch has to null-check it again, so impossible states return',
            'The discriminant must be renamed to type before narrowing will work',
          ], 2, 'A field shared by all variants is never narrowed by the tag, so you are back to defensive null checks and to states such as idle carrying data.'),
        ]
      ),
            lesson('Enums, and When to Avoid Them', 13, `
\`enum Status { Idle, Loading }\` looks like a type. It is also a value, it is an object that exists at runtime, and \`Status[0]\` returns the string \`'Idle'\`. That reverse lookup is the first clue that enums are not the lightweight thing they appear to be.

### What the compiler actually emits

\`\`\`ts
enum Status { Idle, Loading, Ready }
\`\`\`

becomes, near enough:

\`\`\`js
var Status;
(function (Status) {
  Status[Status["Idle"] = 0] = "Idle";
  Status[Status["Loading"] = 1] = "Loading";
  Status[Status["Ready"] = 2] = "Ready";
})(Status || (Status = {}));
\`\`\`

Every other type you have written so far disappears at build time. This one ships, in both directions, and the object is mutable at runtime. Numeric enums therefore cost bytes and buy you \`Status[1] === 'Loading'\`, which is occasionally handy for logging.

### String enums are nominal, and that is where it bites

\`\`\`ts
enum Color { Red = 'red', Blue = 'blue' }

const fromApi: string = 'red';
const c: Color = fromApi;      // Type 'string' is not assignable to type 'Color'.
const ok: Color = Color.Red;   // the only way in
\`\`\`

Membership comes from the declaration, not from the value. This breaks the moment data crosses a boundary, because JSON gives you the plain string \`'red'\`. A codebase that types its database columns with string enums fills up with \`as Color\` at every parse site, and each one of those deletes the checking you were paying for.

A union of string literals accepts a validated string directly, which is why the previous lesson never reached for an enum.

| | Numeric enum | String enum | Literal union |
|---|---|---|---|
| Emits runtime code | yes | yes | no |
| Reverse lookup | yes | no | no |
| Accepts a validated raw value | yes | no | yes |
| Autocompletes the members | yes | yes | yes |

Numeric enums lean too far the other way. Before TypeScript 5.0, \`const s: Status = 42\` compiled without complaint.

### const enum: skip it

\`\`\`ts
const enum Level { Low, High }
const l = Level.High;   // emitted as: const l = 1;
\`\`\`

Inlining sounds free, and inside one file it is. Single file transpilers are the problem: esbuild, swc, and Babel compile each module alone and cannot see the declaration in another file, so cross module inlining is impossible for them. Under \`isolatedModules\`, TypeScript 5.0 and later quietly degrades \`const enum\` to an ordinary enum so the output still works, which means you get none of the benefit and all of the runtime object. Ambient const enums from a \`.d.ts\` are worse: the values get baked into your build, and a patch release of that package can change what your compiled code says.

### Enums block type stripping

Node 22.6 and later can run \`.ts\` files by deleting the type syntax, no compiler involved. Deletion only works when nothing in the file has runtime meaning, so enums, namespaces with bodies, and constructor parameter properties are rejected. TypeScript 5.8 added a flag that catches this at build time rather than at 3am:

\`\`\`json
{ "compilerOptions": { "erasableSyntaxOnly": true } }
\`\`\`

\`\`\`text
error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
\`\`\`

If running source directly is anywhere on your roadmap, every enum is a future migration.

### When an enum is still right

Bit flags, where the numbers are the point:

\`\`\`ts
enum Perm { Read = 1, Write = 2, Admin = 4 }
const p = Perm.Read | Perm.Write;   // 3
if (p & Perm.Write) save();
\`\`\`

Also: an existing codebase where consistency beats purity, and describing a library that already exports one. Everywhere else, reach for the literal union, and put a plain object beside it when you need labels or numeric ranks. Chapter 4 shows how to derive the union from that object so the list of values exists in exactly one place.
      `,
        [
          q('Your API returns { color: \'red\' } and you have enum Color { Red = \'red\' }. Why does const c: Color = payload.color fail?', [
            'String enums are nominal, so a plain string is not assignable to them',
            'The payload stays unknown until it has been validated at the boundary',
            'Enum members are readonly, so nothing can be assigned to them later',
            'The enum needs a const assertion before its members become usable',
          ], 0, 'Membership of a string enum comes from the declaration rather than from the value, so an identical string coming from JSON is rejected until you cast it.'),
          q('What does a numeric enum leave in the emitted JavaScript that a union of string literals does not?', [
            'A type guard function generated for each member of the enum',
            'A frozen array of the member names that you can iterate at runtime',
            'Nothing at all, because both forms are erased when types are stripped',
            'An object holding both directions, so Status[1] gives back the name',
          ], 3, 'Numeric enums compile to a real runtime object with name to value and value to name entries, whereas a literal union disappears entirely.'),
          q('Your team runs .ts files directly using Node\'s type stripping. Which declaration stops the program from starting?', [
            'type Status = \'idle\' | \'ready\'',
            'interface User { id: string }',
            'enum Status { Idle, Ready }',
            'const LEVELS = [\'a\'] as const',
          ], 2, 'Type stripping only deletes syntax, and an enum has to emit a runtime object, so it is rejected rather than erased.'),
        ]
      ),
      ],
      [
        q('Which of these can a type alias express that an interface cannot?', [
          'An optional property',
          'type Status = "idle" | "ready" — a union of literals',
          'A readonly property',
          'Extending another object type',
        ], 1, 'Interfaces only describe object shapes; naming a union, tuple, or primitive requires a type alias.'),
        q('const c: Config = { url: "/api", retires: 3 } errors, but assigning the same object through a variable does not. Why?', [
          'Variables are checked lazily',
          'The variable widens to any',
          'Config has an index signature',
          'Excess property checking applies only to object literals assigned directly',
        ], 3, 'Structural typing permits extra properties; the literal-only freshness check is the one thing that catches the typo.'),
        q('Given pet: Cat | Dog, why is pet.bark() an error?', [
          'A union value only exposes members that exist on every member of the union',
          'Unions cannot contain methods',
          'Dog must come first in the union',
          'bark needs an explicit return type',
        ], 0, 'Any operation must be safe for every branch, so you must narrow to Dog before calling a Dog-only method.'),
        q('You add a fifth variant to a discriminated union. What makes every unhandled switch fail to compile?', [
          'The union type itself becomes invalid',
          'TypeScript checks switch statements for completeness automatically',
          'The default branch assigning the value to a never-typed variable',
          'Marking the discriminant readonly',
        ], 2, 'Once all known cases are handled the value narrows to never, so an unhandled variant no longer fits that assignment.'),
      ]
    ),
    chapter(
      'Narrowing, Guards, and the Edges of the Type System',
      'How TypeScript follows your control flow, how to teach it about runtime checks, and what unknown, any, and never are for.',
      [
        lesson('Narrowing and Control Flow Analysis', 13, `
Chapter 2 left you with unions you cannot use until you prove which branch you are on. **Narrowing** is that proof, and TypeScript performs it by reading your ordinary JavaScript checks.

### The built-in narrowings

\`\`\`ts
function show(value: string | number | Date | null) {
  if (value === null) return '—';                 // equality narrowing
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toFixed(2);
  return value.toISOString();                     // must be Date
}
\`\`\`

The full toolbox:

| Check | Narrows |
|---|---|
| \`typeof x === 'string'\` | primitives |
| \`x instanceof Error\` | class instances |
| \`'email' in user\` | object types by property |
| \`Array.isArray(x)\` | arrays |
| \`x === null\`, \`x !== undefined\` | nullability |
| \`x.kind === 'cat'\` | discriminated unions (Chapter 2) |
| \`if (x)\` | removes all falsy values |

### Truthiness narrowing has a sharp edge

\`\`\`ts
function greet(name: string | null) {
  if (!name) return 'stranger';   // also catches the empty string
  return name;
}

function paginate(page: number | undefined) {
  if (!page) page = 1;            // BUG: page 0 becomes page 1
  if (page === undefined) page = 1;  // says what you meant
}
\`\`\`

Truthiness narrowing is the convenient one and the one that quietly eats \`0\` and \`''\`. When the type includes a number or a string, compare explicitly or use \`??\`.

### typeof null is "object"

\`\`\`ts
function inspect(x: object | null) {
  if (typeof x === 'object') {
    x.toString();   // Error: 'x' is possibly 'null'
  }
}
\`\`\`

TypeScript knows this JavaScript wart and refuses to narrow away \`null\` here. Check \`x !== null\` first. This is one of the few places the checker is stricter than your instinct, and it is right.

### Narrowing dies at a function boundary

\`\`\`ts
let value: string | null = getValue();
if (value !== null) {
  setTimeout(() => value.toUpperCase(), 0);
  // Error: 'value' is possibly 'null' — a later assignment could change it
}
\`\`\`

For a \`let\` captured in a callback, TypeScript cannot prove the narrowing still holds when the callback eventually runs, because anything could reassign it in between. Copy to a \`const\`:

\`\`\`ts
const v = value;
if (v !== null) setTimeout(() => v.toUpperCase(), 0);   // fine
\`\`\`

### The classic mistake: trusting a narrowed property across a call

\`\`\`ts
type Session = { user: User | null };

function render(session: Session) {
  if (session.user !== null) {
    logVisit();                // suppose this sets session.user = null
    session.user.name;         // no error at all — and a crash at runtime
  }
}
\`\`\`

This one runs the opposite way from what people expect. TypeScript **keeps** the narrowing on \`session.user\` across the call: tracking what an arbitrary callee might mutate is not something it attempts, so it assumes nothing changed. That is a deliberate unsoundness, and one of the few places the checker waves a genuine \`null\` through. Destructure into a local so the narrowing describes something nothing else can touch:

\`\`\`ts
const { user } = session;
if (user !== null) {
  logVisit();
  user.name;      // now the guarantee is real — nothing can reassign a const local
}
\`\`\`

The narrowing genuinely *is* discarded in one case, the deferred one:

\`\`\`ts
if (session.user !== null) {
  setTimeout(() => session.user.name, 0);
  // Error: 'session.user' is possibly 'null' — the callback runs later
}
\`\`\`

Pulling values into locals at the top of a function fixes both problems, and produces better code anyway.

### in works, and it discriminates

\`\`\`ts
type Guest = { visits: number };
type Member = { id: string; tier: 'gold' | 'silver' };

function label(p: Guest | Member) {
  if ('id' in p) return p.tier;    // Member
  return \`guest (\${p.visits})\`;    // Guest
}
\`\`\`

Useful when you cannot add a discriminant field — for example on types you do not own. A literal \`kind\` field is still clearer when you control the shapes.

### Narrowing is why you should not reach for as

\`\`\`ts
const el = document.getElementById('email') as HTMLInputElement;
el.value;   // compiles; throws at runtime if the element is missing or a div
\`\`\`

\`as\` tells the compiler to stop asking questions. Every \`as\` in a codebase is a place where the type system is no longer checking anything, and it is the first place to look when a "impossible" runtime error appears. Narrow with a real check instead — the next lesson shows how to package one up.
        `,
        [
          q('Given page: number | undefined, what is wrong with if (!page) page = 1;?', [
            '0 is falsy as well, so a request for page 0 silently becomes page 1',
            'undefined is not falsy here, so the default value is never applied',
            'Assigning inside the branch discards the narrowing for the rest of it',
            'page becomes readonly once narrowed, so the write is quietly dropped',
          ], 0, 'Truthiness narrowing removes every falsy value, so a legitimate 0 is swallowed along with undefined and the caller gets the wrong page.'),
          q('function inspect(x: object | null) { if (typeof x === \'object\') { x.toString(); } } still errors. Why?', [
            'TypeScript rejects any typeof comparison made against the string \'object\'',
            'It narrows correctly, but only once strictNullChecks has been switched off',
            'typeof null is \'object\' in JavaScript, so null survives the check intact',
            'The object type already excludes null, so the check is simply redundant',
          ], 2, 'The checker models the JavaScript quirk faithfully, so a typeof test against \'object\' cannot rule out null and you have to compare against null yourself.'),
          q('let value: string | null is checked for null, then used inside a setTimeout callback and the callback line errors. What fixes it?', [
            'Adding a non-null assertion on the use inside the callback body',
            'Copying the value into a const before the callback captures it',
            'Annotating the callback parameter list with the narrowed type',
            'Declaring value with var so that the narrowing survives longer',
          ], 1, 'A let could be reassigned between the check and the deferred call, so the narrowing cannot be trusted, whereas a const local can never change after the check.'),
        ]
      ),
        lesson('Type Guards, Predicates, and Assertion Functions', 14, `
Built-in narrowing runs out the moment your check lives in another function. TypeScript gives you two ways to say "trust this function's answer".

### The problem

\`\`\`ts
function isUser(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'id' in value;
}

function handle(data: unknown) {
  if (isUser(data)) {
    data.id;   // Error: 'data' is of type 'unknown'
  }
}
\`\`\`

\`isUser\` returns \`boolean\`, and a boolean carries no information about \`data\`. The call site learns nothing. Drop that \`: boolean\` and TypeScript 5.5 and later will infer a predicate from the one-expression body — but only \`value is object & Record<"id", unknown>\`, which is still not a \`User\`. Anything longer than a single expression gets you the plain \`boolean\` above.

### Type predicates

Change the return type to \`value is User\` and the checker propagates the result:

\`\`\`ts
type User = { id: string; email: string };

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).email === 'string'
  );
}

function handle(data: unknown) {
  if (isUser(data)) {
    data.email.toLowerCase();   // User
  }
}
\`\`\`

**A predicate is a promise, not a proof.** TypeScript checks that \`User\` is a plausible narrowing of the parameter type and then believes you completely. This compiles:

\`\`\`ts
function isUser(value: unknown): value is User {
  return true;    // lies, and the compiler accepts it
}
\`\`\`

So a predicate must actually test every field it claims. A predicate that checks \`'id' in value\` and declares \`value is User\` is a runtime crash waiting for the first payload missing \`email\`. This is the most common way \`any\`-grade unsafety re-enters a strict codebase.

### Filtering nulls out of an array

\`\`\`ts
const raw: (string | null)[] = ['a', null, 'b'];

const bad = raw.filter(Boolean);                 // still (string | null)[]
const good = raw.filter((s): s is string => s !== null);  // string[]
\`\`\`

\`filter(Boolean)\` is the classic that does not work: \`Boolean\` is typed as returning \`boolean\`, so the element type never changes and you get \`null\` errors two lines later. Since TypeScript 5.5 a simple inline arrow like \`s => s !== null\` has its predicate **inferred**, so the explicit annotation is often unnecessary now — but only for short, obviously-narrowing function bodies. Write the predicate explicitly whenever the check is more than one expression.

### Assertion functions

Sometimes you want to stop rather than branch:

\`\`\`ts
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new Error('Expected a User');
}

function handle(data: unknown) {
  assertIsUser(data);
  data.email;      // User, for the rest of the function
}
\`\`\`

One rule the compiler enforces awkwardly: **every name in the call target must have an explicit type annotation**. A \`function\` declaration satisfies it for free; an arrow function assigned to a bare \`const\` does not, and the call fails with "Assertions require every name in the call target to be declared with an explicit type annotation." Declare them with \`function\`, or annotate the const with the whole \`(v: unknown) => asserts v is User\` type.

### A reusable non-null assertion

\`\`\`ts
function assertDefined<T>(value: T | null | undefined, label: string): asserts value is T {
  if (value == null) throw new Error(\`Missing \${label}\`);
}

const el = document.getElementById('email');
assertDefined(el, 'email input');
el.focus();   // HTMLElement
\`\`\`

This is what you should reach for instead of the non-null operator \`el!.focus()\`. Both silence the compiler; only one produces a readable error when the assumption breaks.

### Where guards belong

Hand-written guards are correct for a handful of shapes. For anything that arrives from a network, use a schema validator so the type and the check can never drift apart:

\`\`\`ts
import { z } from 'zod';

const UserSchema = z.object({ id: z.string(), email: z.string().email() });
type User = z.infer<typeof UserSchema>;   // the type IS the schema

const user = UserSchema.parse(await res.json());   // throws on bad data
\`\`\`

One declaration produces both the runtime check and the static type. A hand-written \`isUser\` beside a hand-written \`User\` is two things to keep in sync, and they will drift on the first field you add. Chapter 5 builds this into a full API layer.
        `,
        [
          q('const raw: (string | null)[] = [\'a\', null, \'b\']; const out = raw.filter(Boolean); What is the type of out?', [
            'string[], because Boolean removes every null from the array',
            '(string | null)[], because Boolean is typed as returning boolean',
            'unknown[], because passing Boolean erases the element type',
            'boolean[], because filter maps each element through the callback',
          ], 1, 'Boolean\'s declared return type is plain boolean rather than a predicate, so filter has no basis to narrow the element type and the nulls stay in the type.'),
          q('const assertIsUser = (v: unknown): asserts v is User => { ... }; then assertIsUser(data); fails to narrow data. Why?', [
            'Assertion signatures are only valid on parameters that are typed unknown',
            'The assertion needs an explicit return statement before it takes effect',
            'Arrow functions cannot declare an assertion signature under any conditions',
            'The name being called must carry an explicit type annotation of its own',
          ], 3, 'TypeScript requires every name in the call target to be explicitly annotated, which a function declaration satisfies for free but a bare const does not.'),
          q('Why does a hand-written isUser guard beside a hand-written User type drift apart over time?', [
            'Predicates are erased at build time while the type declaration is not',
            'TypeScript checks that a predicate really tests every declared field',
            'They are two declarations, so adding a field updates only one of them',
            'Guards run before types are loaded, so they see an older module shape',
          ], 2, 'Nothing ties the runtime check to the static type, so the first field somebody adds to one of them leaves the other silently incomplete.'),
        ]
      ),
        lesson('unknown, any, and never', 13, `
Three types sit at the edges of the system. Knowing which to reach for is most of the difference between a codebase that stays safe and one that quietly stops being checked.

| Type | Meaning | You may |
|---|---|---|
| \`any\` | Checking disabled | do anything, assign anywhere |
| \`unknown\` | Could be anything | do nothing until you narrow |
| \`never\` | Cannot happen | nothing — no value has this type |

### any is contagious

\`\`\`ts
const config: any = JSON.parse(raw);
const port = config.server.port;   // any
const url = buildUrl(port);        // any, whatever buildUrl says
url.toUpperCase();                 // no error, even if url is a number
\`\`\`

Every value derived from an \`any\` is also \`any\`. A single \`any\` at an entry point can disable checking across an entire feature without a single warning. \`any\` is not "I do not know the type" — it is "do not check anything that touches this".

Run \`tsc\` with \`--noImplicitAny\` (part of \`strict\`) so they cannot appear by accident, and treat every explicit \`any\` in review as a question to answer.

### unknown is the safe version

\`\`\`ts
function handle(input: unknown) {
  input.toUpperCase();          // Error: 'input' is of type 'unknown'
  if (typeof input === 'string') {
    input.toUpperCase();        // fine
  }
}
\`\`\`

\`unknown\` accepts any value going in and permits nothing coming out until you narrow it. That is exactly the contract you want at every boundary: JSON parsing, \`localStorage\`, message events, third-party callbacks, and caught errors.

\`\`\`ts
function parseJson(text: string): unknown {   // not any
  return JSON.parse(text);
}
\`\`\`

The standard library types \`JSON.parse\` as returning \`any\`, which is the single largest hole in a typical strict codebase. Wrapping it to return \`unknown\` forces every caller to validate — the guards and schemas from the previous lesson.

### Catch clauses are unknown

\`\`\`ts
try {
  await save();
} catch (err) {
  err.message;                       // Error under useUnknownInCatchVariables
  if (err instanceof Error) console.error(err.message);
  else console.error('Unknown failure', err);
}
\`\`\`

JavaScript lets you \`throw 42\` or \`throw { code: 'x' }\`, and libraries do. The \`err.message\` reflex produces "Cannot read properties of undefined" **inside your error handler**, which is the worst possible place for a crash. Narrow with \`instanceof Error\` and keep a fallback branch.

### never is the empty type

\`never\` is the type with no possible values. You meet it in four places.

**Exhaustiveness checks**, as in Chapter 2 — the reason it matters most:

\`\`\`ts
default: {
  const _never: never = state;   // fails to compile if a variant is unhandled
  throw new Error('Unhandled');
}
\`\`\`

**Functions that never return normally:**

\`\`\`ts
function fail(message: string): never {
  throw new Error(message);
}

const value = maybe ?? fail('missing value');   // narrows correctly after this
\`\`\`

**Impossible intersections:** \`string & number\` is \`never\`.

**Filtered-out union members:** \`Exclude<'a' | 'b', 'a'>\` is \`'b'\`; exclude everything and you get \`never\`.

### The error that confuses everyone

\`\`\`ts
const items = [];          // implicitly any[]
items.push('a');           // ok in a .js-ish way

const items: string[] = [];
items.push(1);             // Error, as intended

function f(x: never) {}
f('a');   // Argument of type 'string' is not assignable to parameter of type 'never'
\`\`\`

"Not assignable to type 'never'" almost always means one of two things: you have an unhandled variant in an exhaustiveness check, or you have an intersection that can never be satisfied. Read it as **"this code is unreachable, but you wrote something here"** and go looking for the case you forgot.

### The rule

Use \`unknown\` at every boundary you do not control, narrow it deliberately, and reserve \`any\` for the rare interop escape hatch — with a comment explaining why. \`never\` you rarely write on purpose; you use it to make the compiler prove things for you.
        `,
        [
          q('const config: any = JSON.parse(raw); Why is reading config.server.port dangerous even though it compiles?', [
            'Every property read off an any is any too, so nothing downstream is checked',
            'JSON.parse throws on nested objects unless a reviver function is supplied',
            'Values typed any are frozen, so the read hands back a stale cached copy',
            'Dotted access on an any value is a syntax error whenever strict mode is on',
          ], 0, 'any spreads through every access derived from it, so one annotation at the entry point can switch off checking across a whole feature.'),
          q('You change a parseJson helper from returning any to returning unknown. What changes at the call sites?', [
            'Nothing, because unknown and any are structurally identical to callers',
            'Calls now fail unless the result is narrowed or validated before use',
            'The helper has to become async before it is allowed to return unknown',
            'Results become readonly, so they can no longer be destructured at all',
          ], 1, 'unknown accepts any incoming value but permits no operations on the way out, which forces each caller to prove the shape before touching it.'),
          q('tsc reports "Argument of type \'string\' is not assignable to parameter of type \'never\'". What does that usually mean?', [
            'The parameter was declared with a modifier the compiler cannot support',
            'A generic type argument failed to infer and fell back to a default',
            'The array you are indexing into was declared without any type at all',
            'The code is treated as unreachable, so a case is unhandled somewhere',
          ], 3, 'A value only reaches type never when the checker has ruled out every possibility, so the message points at a missing union case or an impossible intersection.'),
        ]
      ),
            lesson('Assertions and the Escape Hatches', 13, `
The line that caused the outage passed review without a comment:

\`\`\`ts
const el = document.getElementById('email') as HTMLInputElement;
el.value = draft.email;
\`\`\`

Six months later somebody renamed the field to \`email-address\` in the template. The build stayed green, because nothing about \`as\` runs, checks, or converts. Production threw "Cannot set properties of null" on first paint.

### What an assertion is allowed to claim

\`\`\`ts
const n = 'seven' as number;
// Conversion of type 'string' to type 'number' may be a mistake because
// neither type sufficiently overlaps with the other.
\`\`\`

TypeScript permits \`x as T\` only when one of the two types is assignable to the other. That is a guard rail, not a check, and it is aimed at the wrong target: narrowing \`HTMLElement\` to \`HTMLInputElement\` overlaps perfectly, so the assertions most likely to hurt you are exactly the ones allowed without a murmur.

When even the guard rail refuses, people route around it:

\`\`\`ts
const n = 'seven' as unknown as number;
\`\`\`

\`unknown\` overlaps with everything, so a double assertion always compiles. Read \`as unknown as\` as a written statement that the type system is off for this expression, and treat one without a comment beside it as a review blocker.

\`as const\` only shares a keyword with this. It changes how a literal is inferred (Chapter 1); it asserts nothing.

### The non-null operator is the same deal, shorter

\`el!.focus()\` removes \`null\` and \`undefined\` from the type and emits nothing at all. When the assumption fails you get "Cannot read properties of null" pointing at a line that says nothing about what was missing. The assertion helper from the previous lesson costs one extra line and gives you \`Missing email input\` instead. Class fields have their own version, \`private db!: Database\`, which switches off \`strictPropertyInitialization\` for that field and hands you the same silence when initialisation order changes.

### Object.keys, the assertion everyone writes

\`\`\`ts
type User = { id: string; name: string };
const admin = { id: '7', name: 'Sara', passwordHash: 'a94f...' };

function publicFields(u: User) {
  return (Object.keys(u) as (keyof User)[]).map((k) => [k, u[k]]);
}

publicFields(admin);
// runtime keys: ['id', 'name', 'passwordHash'], typed as ('id' | 'name')[]
\`\`\`

\`Object.keys\` returns \`string[]\` and people assume the standard library is being lazy. It is being correct. Structural typing lets any object with the required fields be passed, so a \`User\` parameter routinely holds extra keys at runtime, and the narrow type is simply false. Serialise that loop into a response and you have leaked \`passwordHash\` with a green build and full test coverage.

Iterate the keys you meant instead:

\`\`\`ts
const FIELDS = ['id', 'name'] as const;
FIELDS.map((k) => [k, admin[k]]);   // no assertion, no leak
\`\`\`

### Why assertions rot

A guard is re-checked on every build. An assertion was never a check, so there is nothing left to fail:

\`\`\`ts
type Invoice = { total: number; issuedAt: Date };
const raw = JSON.parse(body) as Invoice;
raw.issuedAt.getFullYear();     // a string at runtime, and always was
\`\`\`

Rename \`total\` to \`amount\` and the guarded version lights up every call site. This version keeps compiling, silently, forever.

### Using one honestly

Keep it to the smallest expression, not the whole variable. Put it next to the runtime check that makes it true, or write the guard instead. Add a comment giving the reason, because "the DOM node exists, this component only renders inside the form" is information no future reader can recover. And take a measurement occasionally:

\`\`\`bash
grep -rn " as [A-Z]" src --include=*.ts | wc -l
\`\`\`

That number is roughly how many places your type checker has been asked to stop looking. It should be small, and it should not be growing.
      `,
        [
          q('const n = \'seven\' as number is rejected. What does the message mean, and how do people get around it?', [
            'Neither type overlaps the other, and as unknown as number silences it',
            'Assertions need a matching runtime cast, so Number(\'seven\') is required',
            'String literals must first be widened with as string before any cast',
            'Assertions are only legal between object types, never between primitives',
          ], 0, 'TypeScript only allows an assertion when one type is assignable to the other, and routing through unknown defeats that rule because unknown overlaps with everything.'),
          q('Object.keys(user) returns string[] rather than (keyof User)[]. Why is the wider type the correct one?', [
            'keyof User is computed lazily and is unavailable while the file compiles',
            'Object.keys skips inherited properties, so the union would be incomplete',
            'A value typed User may carry extra keys at runtime, so the union is a lie',
            'The DOM library overrides Object with a deliberately looser signature',
          ], 2, 'Structural typing lets any object with the required fields be passed, so the parameter routinely holds additional keys that the narrow union would not include.'),
          q('Why does an assertion become more dangerous the longer it stays in a codebase?', [
            'It pins the type to whichever version of the interface existed that day',
            'Assertions are erased, so emitted code differs from what you type-checked',
            'It suppresses the very check that would have flagged the renamed field',
            'Assertion sites are left out of incremental builds unless you disable them',
          ], 2, 'An assertion tells the checker to stop comparing the value with the type, so a later rename that would break a guarded call site leaves the asserted one compiling.'),
        ]
      ),
      ],
      [
        q('Inside if (session.user !== null) you call logVisit(), which sets session.user = null, then read session.user.name. What does TypeScript report?', [
          'An error, because any function call discards a property narrowing',
          'An error, because session.user is not declared const',
          'Nothing — it keeps the narrowing across calls, a deliberate unsoundness that lets a real null through',
          'Nothing, because optional chaining is implied on narrowed properties',
        ], 2, 'TypeScript does not track what a callee mutates, so a narrowed obj.prop stays narrowed after a call; copying into a const local is what makes the guarantee real.'),
        q('function isUser(v: unknown): v is User { return true; } — what does TypeScript do?', [
          'Rejects it because the body performs no checks',
          'Accepts it; a type predicate is a promise the compiler trusts without verifying',
          'Narrows only when the argument is already typed as User',
          'Warns that the return type must be boolean',
        ], 1, 'Predicates transfer trust, not proof, so a guard that does not really check its fields reintroduces runtime crashes.'),
        q('Which type should a JSON.parse wrapper return in a strict codebase?', [
          'any, so callers can use the result immediately',
          'object, since JSON always produces objects',
          'unknown, forcing every caller to validate before use',
          'never, because the result is not yet known',
        ], 2, 'unknown accepts any value but permits no operations until narrowed, which is exactly the contract for untrusted input.'),
        q('Under strict mode, what is the type of err in catch (err) and why does it matter?', [
          'unknown — JavaScript can throw non-Error values, so err.message may crash your error handler',
          'Error — TypeScript guarantees only Errors are thrown',
          'any — catch clauses are never checked',
          'never — the block is unreachable if nothing throws',
        ], 0, 'useUnknownInCatchVariables makes err unknown because any value can be thrown, so you must narrow with instanceof Error.'),
      ]
    ),
    chapter(
      'Generics and Type Transformations',
      'Writing code that works over many types without losing type information, and deriving types instead of duplicating them.',
      [
        lesson('Generics from First Principles', 14, `
A generic is a **parameter for types**. You already accept values you do not know in advance; a type parameter lets you accept types you do not know in advance, and still keep track of them.

### The problem generics solve

\`\`\`ts
function first(arr: any[]): any {
  return arr[0];
}

const name = first(['Sara', 'Ali']);   // any — the string-ness is gone
name.toUpperCase();                    // no check
name.toFixed(2);                       // also no check, and it will crash
\`\`\`

\`any\` in, \`any\` out. The function threw away everything the caller knew.

\`\`\`ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const name = first(['Sara', 'Ali']);   // string | undefined — inferred, no annotation
const n = first([1, 2, 3]);            // number | undefined
\`\`\`

\`T\` is a placeholder bound at the call site. TypeScript infers it from the argument, so callers write no extra syntax and keep full type information on the result.

### Inference, and overriding it

\`\`\`ts
const ids = first<string>(['a', 'b']);   // explicit, occasionally needed
const empty = first([]);                 // T infers as never — annotate: first<string>([])
\`\`\`

Let inference do the work. Reach for explicit type arguments only when the input carries no information, such as an empty array or a \`null\` initial value.

### Constraints: T with requirements

An unconstrained \`T\` can be anything, so you can do almost nothing with it:

\`\`\`ts
function longest<T>(a: T, b: T) {
  return a.length > b.length ? a : b;   // Error: 'length' does not exist on 'T'
}

function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length > b.length ? a : b;
}

longest('hello', 'hi');        // 'hello' | 'hi'
longest([1, 2], [3]);          // number[]
longest(10, 20);               // Error: number has no length
\`\`\`

\`extends\` here means "at minimum", not inheritance. Notice the return type is \`T\`, not \`{ length: number }\` — the caller gets a \`string\` back, not a shapeless object. Preserving that is the entire point.

### The pattern you will write most often

\`\`\`ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '7', name: 'Sara', admin: false };

getProp(user, 'name');    // string
getProp(user, 'admin');   // boolean
getProp(user, 'email');   // Error: '"email"' is not assignable to '"id" | "name" | "admin"'
\`\`\`

Three moving parts: \`keyof T\` is the union of \`T\`'s keys, \`K extends keyof T\` pins the key to one of them, and \`T[K]\` is the type stored at that key. The next lesson takes those apart properly.

### Defaults

\`\`\`ts
type ApiResponse<T = unknown> = { data: T; status: number };

const a: ApiResponse = { data: {}, status: 200 };            // T is unknown
const b: ApiResponse<User[]> = { data: [], status: 200 };    // T is User[]
\`\`\`

### Generic types, not just functions

\`\`\`ts
type Paginated<T> = {
  items: T[];
  page: number;
  total: number;
};

class Cache<T> {
  private store = new Map<string, T>();
  get(key: string): T | undefined { return this.store.get(key); }
  set(key: string, value: T): void { this.store.set(key, value); }
}

const users = new Cache<User>();
users.set('7', { id: '7', name: 'Sara' });
users.get('7');    // User | undefined
\`\`\`

### The classic mistake: a type parameter used once

\`\`\`ts
function log<T>(value: T): void {          // pointless
  console.log(value);
}

function log(value: unknown): void {}      // says the same thing, honestly
\`\`\`

**The golden rule: a type parameter must appear at least twice**, otherwise it relates nothing to anything and is just \`any\` wearing a hat. Twice means once as an input and once in the output (\`(arr: T[]) => T\`), or across two parameters (\`(a: T, b: T) => T\`). If \`T\` appears in exactly one position, delete it and use \`unknown\`.

### Reading the errors

Generic error messages are the ugliest in the language. When you get a wall of text, look for two things: the phrase **"is not assignable to"** and the **innermost** pair of types it names. Everything above it is context. Nine times out of ten the real problem is a missing constraint, and the fix is one \`extends\` clause.
        `,
        [
          q('Why does longest<T extends { length: number }>(a: T, b: T) return T rather than { length: number }?', [
            'T is what makes the two parameters get checked against each other',
            'Returning the constraint would throw away the caller\'s concrete type',
            'A constraint type is not permitted to appear in a return position',
            'T allows the two arguments to be of two different types entirely',
          ], 1, 'Returning the constraint would hand back a shapeless object with only length, whereas returning T means a caller passing strings gets a string back.'),
          q('Given function first<T>(arr: T[]): T | undefined, what does const empty = first([]) produce?', [
            'unknown | undefined, because an empty array defaults to unknown',
            'any | undefined, because an empty array literal carries no type',
            'never | undefined, because nothing constrains T so it infers never',
            'T | undefined, left unresolved until the value is finally used',
          ], 2, 'With no elements to infer from, T has no candidates and collapses to never, which is why an empty argument is the case that needs an explicit type argument.'),
          q('In getProp<T, K extends keyof T>(obj: T, key: K): T[K], which part rejects getProp(user, \'email\')?', [
            'K extends keyof T, which pins the key argument to a real key of T',
            'The T[K] return type, which rejects keys that are not present',
            'The object parameter, which is checked before the key parameter',
            'user being declared const, which turned its keys into literals',
          ], 0, 'The constraint on K restricts the second argument to the union of T\'s own keys, so an unknown key fails at the call site rather than inside the body.'),
        ]
      ),
        lesson('keyof, typeof, and Indexed Access', 12, `
Duplication between your runtime values and your types is where drift begins. These three operators let you derive one from the other so there is only ever a single source of truth.

### keyof: the union of an object type's keys

\`\`\`ts
type User = { id: string; name: string; age: number };

type UserKey = keyof User;      // 'id' | 'name' | 'age'

const key: UserKey = 'name';    // ok
const bad: UserKey = 'email';   // Error
\`\`\`

Add a field to \`User\` and \`UserKey\` grows automatically. That is the property you are buying.

### typeof: from a value to its type

\`\`\`ts
const defaultSettings = {
  theme: 'dark',
  fontSize: 14,
  autosave: true,
};

type Settings = typeof defaultSettings;
// { theme: string; fontSize: number; autosave: boolean }

function applySettings(s: Settings) {}
\`\`\`

This is the **type-level** \`typeof\`, not the runtime one, and it only appears in type positions. Use it whenever a config object already exists — writing the interface by hand means maintaining the same list twice.

\`\`\`ts
const useStore = createStore({ count: 0, user: null as User | null });
type Store = ReturnType<typeof useStore>;   // combine with ReturnType, next lesson
\`\`\`

### Indexed access: the type at a key

\`\`\`ts
type Name = User['name'];              // string
type IdOrAge = User['id' | 'age'];     // string | number
type AnyValue = User[keyof User];      // string | number

type Item = Course['lessons'][number];  // element type of the lessons array
\`\`\`

\`[number]\` is the trick worth memorising: it means "index this array type with a number", which gives you the element type. It saves defining a separate \`Lesson\` type just so you can refer to one entry.

### The combination that removes real duplication

\`\`\`ts
// Runtime value AND type from one declaration
export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export type Level = (typeof LEVELS)[number];
// 'beginner' | 'intermediate' | 'advanced'

// The array drives the UI…
LEVELS.map((l) => renderOption(l));

// …and the type drives the checker
function setLevel(level: Level) {}
setLevel('expert');   // Error
\`\`\`

Without \`as const\` the array is \`string[]\` and \`(typeof LEVELS)[number]\` collapses to \`string\`, which silently checks nothing. **This is the most common mistake with this pattern** — the code compiles, the union is useless, and nobody notices until an invalid value reaches production. If your derived union shows as \`string\` in the editor tooltip, you forgot \`as const\`.

The same idea works for object maps:

\`\`\`ts
const ROLES = { admin: 3, editor: 2, viewer: 1 } as const;
type Role = keyof typeof ROLES;          // 'admin' | 'editor' | 'viewer'
type Rank = (typeof ROLES)[Role];        // 3 | 2 | 1
\`\`\`

Note the order: \`typeof ROLES\` turns the value into a type, then \`keyof\` reads its keys. \`keyof ROLES\` alone is an error, because \`ROLES\` is a value.

### Mapped types: transform every key

\`\`\`ts
type Optional<T> = { [K in keyof T]?: T[K] };
type Stringify<T> = { [K in keyof T]: string };

type UserForm = Stringify<User>;
// { id: string; name: string; age: string } — every field as form input text
\`\`\`

\`[K in keyof T]\` iterates the keys; \`T[K]\` reads the original type at each one. Modifiers can be added (\`?\`, \`readonly\`) or removed (\`-?\`, \`-readonly\`):

\`\`\`ts
type Concrete<T> = { [K in keyof T]-?: T[K] };   // strips optionality
\`\`\`

You will write mapped types rarely. You will use the ones the standard library already ships constantly — which is the next lesson.
        `,
        [
          q('In type Item = Course[\'lessons\'][number], what is the [number] part doing?', [
            'Restricting the allowed index values to numeric keys only',
            'Converting the array type into a tuple of a fixed length',
            'Producing the element type stored inside the lessons array',
            'Counting the array members and returning that as a literal',
          ], 2, 'Indexing an array type with number yields the type of whatever sits at a numeric position, which is the element type.'),
          q('const ROLES = { admin: 3 } as const; type R = keyof ROLES; fails. What is wrong?', [
            'ROLES is a value, so it needs typeof before keyof can read its keys',
            'keyof works on interfaces only, never on an inline object literal',
            'as const makes the keys readonly, which keyof is unable to see',
            'The numeric values have to be widened before keyof will apply',
          ], 0, 'keyof operates on types while ROLES is a runtime value, so you write keyof typeof ROLES to turn the value into a type first.'),
          q('What does the mapped type { [K in keyof T]-?: T[K] } do to T?', [
            'Removes any property whose declared type includes undefined',
            'Marks every property both optional and readonly in one pass',
            'Deletes the keys that are missing from the source object type',
            'Strips the optional marker so every property becomes required',
          ], 3, 'The minus before the question mark removes the optional modifier from each key as the type is rebuilt, which is how Required is implemented.'),
        ]
      ),
        lesson('The Utility Types You Will Use Weekly', 13, `
TypeScript ships a set of built-in generic types that transform other types. Five of them cover most real work.

| Utility | Produces |
|---|---|
| \`Partial<T>\` | every property optional |
| \`Required<T>\` | every property required |
| \`Readonly<T>\` | every property readonly |
| \`Pick<T, K>\` | only the named keys |
| \`Omit<T, K>\` | everything except the named keys |
| \`Record<K, V>\` | an object with keys K and values V |
| \`ReturnType<F>\` | what a function returns |
| \`Parameters<F>\` | a function's parameters, as a tuple |
| \`Awaited<P>\` | the resolved value of a Promise |
| \`NonNullable<T>\` | T without null or undefined |
| \`Exclude<U, M>\` / \`Extract<U, M>\` | filter a union |

### Partial: patches and drafts

\`\`\`ts
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  passwordHash: string;
  createdAt: Date;
};

function updateUser(id: string, patch: Partial<User>) { }

updateUser('7', { name: 'Sara' });        // ok — the rest are optional
updateUser('7', { nam: 'Sara' });         // Error: unknown property
\`\`\`

Do not use \`Partial\` on a shape you then treat as complete. \`Partial<User>\` means every field can be missing, so \`patch.email.toLowerCase()\` is an error — correctly.

### Pick and Omit: derive, do not duplicate

\`\`\`ts
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string }

type NewUser = Omit<User, 'id'>;
// everything except id — exactly the shape a create endpoint accepts

type PublicUser = Omit<User, 'passwordHash' | 'email'>;
\`\`\`

When \`User\` gains a field, every derived type updates. Hand-written parallel interfaces drift within a sprint.

**The trap:** \`Omit\` does not check that the key exists.

\`\`\`ts
type Broken = Omit<User, 'passwordhash'>;   // no error, omits nothing
\`\`\`

The key parameter is \`keyof any\`, so a typo or a renamed field silently omits nothing and you leak the property you meant to strip. \`Pick\` **does** constrain its keys, so it errors on a typo. When you are removing something sensitive, prefer \`Pick\` of the fields you want, or define a constrained wrapper once and use it everywhere:

\`\`\`ts
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

type Safe = StrictOmit<User, 'passwordhash'>;
// Error: Type '"passwordhash"' does not satisfy the constraint 'keyof User'.
\`\`\`

### Record: a complete lookup table

\`\`\`ts
type Status = 'idle' | 'loading' | 'ready' | 'error';

const LABELS: Record<Status, string> = {
  idle: 'Ready when you are',
  loading: 'Loading…',
  ready: 'Done',
  error: 'Something went wrong',
};
\`\`\`

Add a fifth status and this object fails to compile until you add its label. That exhaustiveness is why \`Record<Status, string>\` beats \`{ [key: string]: string }\`, which accepts anything and guarantees nothing.

\`\`\`ts
type Grouped = Record<string, User[]>;   // still useful for genuinely open keys
\`\`\`

### ReturnType and Parameters: types that follow the code

\`\`\`ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, createdAt: new Date() };
}

type CreatedUser = ReturnType<typeof createUser>;
type CreateArgs = Parameters<typeof createUser>;   // [string, string]

const args: CreateArgs = ['Sara', 'sara@example.com'];
createUser(...args);
\`\`\`

Note \`typeof createUser\` — these utilities take a function **type**, and \`typeof\` is how you get one from a function value (Chapter 4, previous lesson). \`ReturnType<createUser>\` is an error people hit every single time.

For async functions, unwrap the promise:

\`\`\`ts
async function loadUser(id: string) { return fetchUser(id); }

type Loaded = Awaited<ReturnType<typeof loadUser>>;   // User, not Promise<User>
\`\`\`

### Combining them

\`\`\`ts
// A form that edits everything except the server-managed fields,
// where all values start empty.
type EditableUser = Partial<Omit<User, 'id' | 'createdAt'>>;

// A map from every level to the courses at that level.
type Catalogue = Record<Level, Pick<Course, 'slug' | 'title'>[]>;
\`\`\`

Read them inside out, like function calls — because that is what they are. The habit to build is simple: **before you write a new interface, ask whether it is a transformation of one you already have.** Most of them are.
        `,
        [
          q('type CreatedUser = ReturnType<createUser> is an error while ReturnType<typeof createUser> works. Why?', [
            'ReturnType needs a function type, and typeof turns the value into one',
            'createUser must be declared above the type alias that refers to it',
            'ReturnType accepts async functions only when wrapped with Awaited',
            'Arrow functions are the only form ReturnType is able to resolve',
          ], 0, 'createUser is a value rather than a type, and the type-level typeof operator is what produces the function type these utilities expect.'),
          q('With patch: Partial<User>, the line patch.email.toLowerCase() is rejected. Is the checker right?', [
            'No, the error is spurious because a patch always carries every field',
            'Yes, Partial makes email possibly undefined, which a patch really is',
            'No, Partial removes the property rather than making it optional',
            'Yes, but only because User declares the email field as readonly',
          ], 1, 'Partial marks every key optional, so email may genuinely be absent on a patch object and calling a method on it without checking would crash.'),
          q('In type Loaded = Awaited<ReturnType<typeof loadUser>>, what is Awaited contributing?', [
            'It marks the type as safe to use inside an async function body',
            'It converts the promise into an equivalent callback signature',
            'It unwraps Promise<User> down to the resolved value, User',
            'It strips null and undefined from the resolved value type',
          ], 2, 'An async function\'s return type is a promise, and Awaited peels it away so the alias names the value you receive after awaiting.'),
        ]
      ),
            lesson('Function Overloads and Their Alternatives', 13, `
\`document.createElement('input')\` gives you an \`HTMLInputElement\`. \`document.createElement('div')\` gives you an \`HTMLDivElement\`. Same function, same arity, and the return type is decided by the *value* of a string argument. No single signature expresses that, and returning a union would force every caller to narrow something they already knew.

### The shape of it

\`\`\`ts
type Row = { id: string; email: string };

function query(sql: string, opts: { one: true }): Promise<Row>;
function query(sql: string, opts?: { one?: false }): Promise<Row[]>;
async function query(sql: string, opts: { one?: boolean } = {}) {
  const rows: Row[] = await driver.execute(sql);
  return opts.one ? rows[0] : rows;
}

const me  = await query('select * from users where id = $1', { one: true });
const all = await query('select * from users');
\`\`\`

\`me\` is a \`Row\`. \`all\` is a \`Row[]\`. Two declarations with no body, then one implementation that has a body and is **not callable**. Callers see the first two signatures only, which is the detail everything else follows from.

### The union argument that will not resolve

\`\`\`ts
function fmt(x: string): string;
function fmt(x: number): string;
function fmt(x: string | number): string { return String(x); }

const raw: string | number = readInput();
fmt(raw);   // No overload matches this call.
\`\`\`

The implementation signature accepts the union, and it is invisible. Resolution picks exactly one declared signature, and neither of the two accepts \`string | number\`. The fix is a third declared signature covering the union, which is a good moment to notice that one plain \`fmt(x: string | number): string\` would have done the whole job.

### Order decides which one wins

Overloads are tried top to bottom and the first match is taken.

\`\`\`ts
function route(path: string): Handler;
function route(path: '/health'): HealthHandler;   // unreachable
\`\`\`

Every string matches the first signature, so the specific one never fires and nothing warns you. Specific signatures go first, always.

### The part that is not checked

The implementation body is checked against the implementation signature, not against each overload individually. So this compiles:

\`\`\`ts
function pick(n: number): number;
function pick(s: string): string;
function pick(v: number | string): number | string {
  return 0;
}

const s = pick('a');    // typed string. It is 0 at runtime.
s.toUpperCase();        // TypeError: s.toUpperCase is not a function
\`\`\`

Nothing is wrong with the types as far as \`tsc\` is concerned: \`number\` is part of the implementation return type, so \`return 0\` is fine. Overloads are the least verified construct in the language, and each extra signature is another way for the body to drift out of line with what callers were promised.

### Pick the weakest tool that works

| Situation | Reach for |
|---|---|
| Return shape is the same for every input | one union parameter |
| Return type mirrors the argument type | a generic |
| Only the argument count changes | optional or rest parameters |
| Return type depends on a literal argument value | overloads |

A generic wins whenever the relationship is mechanical. \`function first<T>(arr: T[]): T | undefined\` covers every element type in one line the compiler genuinely checks, whereas the overloaded version would need a signature per type and would never end.

Overloads earn their place when the mapping is a short lookup table with no rule behind it, \`createElement\` being the canonical example. When that table gets long, Chapter 6 shows conditional types, which express the same mapping in a single signature that the compiler checks properly.

One last practical note: methods use the same rules inside a class or an interface, and in a \`.d.ts\` file you write the declared signatures with no implementation at all. That is how \`createElement\` is typed in the DOM library, with roughly 180 signatures generated from the HTML spec.
      `,
        [
          q('fmt is declared with overloads for string and for number, plus an implementation taking string | number. What happens at fmt(raw) where raw is string | number?', [
            'It resolves against the implementation signature, which accepts the union',
            'It resolves to the first overload and coerces the argument to a string',
            'It compiles, but the result is typed string | undefined for that call',
            'It fails, because the implementation signature is not callable at all',
          ], 3, 'Callers only see the declared overloads and resolution must pick exactly one of them, so a union argument matching neither is reported as no overload matching.'),
          q('You declare an overload taking path: string above one taking path: \'/health\'. What goes wrong?', [
            'The compiler reports a duplicate implementation error for the pair',
            'The literal overload is unreachable, because the first match wins',
            'Both overloads apply and their return types end up intersected',
            'The literal argument widens to string before resolution even starts',
          ], 1, 'Overloads are tried from top to bottom and every string matches the broader signature first, so the specific one never gets a chance to apply.'),
          q('Which of these is the strongest reason to prefer a generic over a set of overloads?', [
            'Generics are erased while overload signatures are emitted at runtime',
            'Overloads cannot be used on methods, only on standalone functions',
            'The body is checked loosely, so a wrong return per signature compiles',
            'Generic parameters are inferred whereas an overload is chosen by hand',
          ], 2, 'TypeScript checks the implementation against its own signature rather than against each overload, so a body can return the wrong type for one signature and still build.'),
        ]
      ),
      ],
      [
        q('function log<T>(value: T): void {} — what is wrong with this generic?', [
          'T appears in only one position, so it relates nothing and should just be unknown',
          'Generic functions cannot return void',
          'T must be constrained with extends',
          'The type parameter needs a default',
        ], 0, 'A type parameter earns its place only by connecting two positions; used once it carries no information.'),
        q('const LEVELS = ["a", "b"]; type Level = (typeof LEVELS)[number]; — what is Level?', [
          '"a" | "b"',
          'never',
          'string, because without as const the array widens to string[]',
          'readonly ["a", "b"]',
        ], 2, 'Literal widening turns the array into string[], so the derived union collapses to string and checks nothing.'),
        q('Why is Record<Status, string> better than { [key: string]: string } for status labels?', [
          'It is faster at runtime',
          'It requires an entry for every member of Status, so adding a status breaks the build until you handle it',
          'It prevents the object from being mutated',
          'It allows numeric keys',
        ], 1, 'A Record over a literal union is exhaustive, whereas an index signature accepts any key and guarantees nothing.'),
        q('type Safe = Omit<User, "passwordhash"> compiles but still exposes passwordHash. Why?', [
          'Omit only works on interfaces',
          'The property is readonly',
          'Omit needs to be wrapped in Partial',
          'Omit accepts any key, so a typo silently removes nothing',
        ], 3, 'Omit is typed with keyof any rather than keyof T, so misspelled keys are accepted and have no effect.'),
      ]
    ),
    chapter(
      'TypeScript in a Real Codebase',
      'Async code, untrusted API data, declaration files, and typing React components and hooks.',
      [
        lesson('Typing Async Code and API Responses', 14, `
Async types are simple. The hard part is the boundary where data you did not create enters a program that believes its own annotations.

### Promises carry their value

\`\`\`ts
async function getUser(id: string): Promise<User> {
  const user = await db.users.findById(id);
  return user;
}

const u = await getUser('7');   // User — await unwraps the Promise
\`\`\`

An \`async\` function always returns a promise, so its annotation must be \`Promise<T>\`, never \`T\`. Let inference handle internal functions and annotate exported ones. To go the other way, use \`Awaited<T>\` from Chapter 4.

\`Promise.all\` preserves each position:

\`\`\`ts
const [user, courses] = await Promise.all([
  getUser('7'),        // Promise<User>
  getCourses(),        // Promise<Course[]>
]);
// user: User, courses: Course[] — a tuple, not an array of unions
\`\`\`

\`Promise.allSettled\` returns a discriminated union per entry, so you narrow with \`result.status === 'fulfilled'\` before reading \`result.value\`. That is Chapter 2's pattern, in the standard library.

### The lie at the boundary

\`\`\`ts
const res = await fetch('/api/users/7');
const user: User = await res.json();     // res.json() is Promise<any>
\`\`\`

Nothing here was checked. \`any\` satisfies \`User\`, so this compiles whether the server returns a user, an error envelope, an HTML error page, or \`null\`. Every downstream type in your application is now derived from an assumption. **This is the most common way a strict TypeScript codebase produces a runtime crash**, and it looks completely reasonable in review.

Worse, \`fetch\` does not reject on a 404 or a 500 — those are successful round trips — so an error body gets parsed and assigned to \`user\` without complaint.

### Validate once, at the edge

\`\`\`ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.coerce.date(),      // JSON gives a string; produce a real Date
});

export type User = z.infer<typeof UserSchema>;   // the type IS the schema
\`\`\`

One declaration produces the runtime check and the static type, so they cannot drift. Compare that with a hand-written \`interface User\` beside a hand-written \`isUser\` guard — two lists to keep in sync, and they diverge on the first field anyone adds.

### A typed fetch helper worth copying

\`\`\`ts
import { z, type ZodType } from 'zod';

type Result<T> =
  | { ok: true;  data: T }
  | { ok: false; error: string };

export async function apiGet<T>(
  path: string,
  schema: ZodType<T>,
): Promise<Result<T>> {
  let res: Response;
  try {
    res = await fetch(path, { headers: { Accept: 'application/json' } });
  } catch {
    return { ok: false, error: 'Network error' };
  }

  if (!res.ok) return { ok: false, error: \`HTTP \${res.status}\` };

  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) {
    console.error(parsed.error.issues);          // log the shape mismatch
    return { ok: false, error: 'Unexpected response shape' };
  }

  return { ok: true, data: parsed.data };        // T, genuinely
}

const result = await apiGet('/api/users/7', UserSchema);
if (result.ok) console.log(result.data.email);   // narrowed by the discriminant
else           console.error(result.error);
\`\`\`

Four things are now true that were not before: network failure, HTTP failure, and shape mismatch are separate handled cases; \`unknown\` never escapes; the caller is *forced* to check \`result.ok\` before touching \`data\`; and a backend change that renames a field fails loudly at the boundary with a readable message instead of producing \`undefined\` three screens away.

### Arrays and envelopes

\`\`\`ts
const ListSchema = z.object({
  data: z.array(UserSchema),
  total: z.number(),
});
const list = await apiGet('/api/users', ListSchema);
\`\`\`

Model the envelope your API actually sends, not the payload you wish it sent.

### Errors are values

\`\`\`ts
type ApiError =
  | { kind: 'network' }
  | { kind: 'http'; status: number }
  | { kind: 'shape'; issues: string[] };
\`\`\`

Once failures are a discriminated union rather than a thrown \`unknown\`, retry logic, error messages, and logging all become exhaustive switches the compiler can check. That is Chapter 2 and Chapter 3 doing real work together.
        `,
        [
          q('const [user, courses] = await Promise.all([getUser(\'7\'), getCourses()]) gives user the type User rather than User | Course[]. Why?', [
            'Promise.all preserves each position, so it resolves to a tuple typed per entry',
            'await collapses a mixed array down to its first element type',
            'Destructuring assigns types in declaration order from the annotation',
            'getUser settles first, so its resolved type wins the inference',
          ], 0, 'Promise.all is typed over a tuple of promises, so each slot keeps the type of the promise sitting in that position instead of widening to a union of all of them.'),
          q('Your API answers with HTTP 500 and a JSON error envelope. What does the apiGet helper do that a bare fetch plus res.json() does not?', [
            'It retries the request until the server answers with a 2xx status',
            'It rejects the promise, because fetch throws on any 5xx response',
            'It checks res.ok first, since fetch resolves normally on 4xx and 5xx',
            'It turns the error body into an exception for the caller to catch',
          ], 2, 'fetch only rejects on network failure, so an error response is a successful round trip whose body would otherwise be parsed and handed back as a User.'),
          q('An async function that returns a User is annotated as async function load(): User. What happens?', [
            'The promise is unwrapped automatically at every call site',
            'It fails to compile, because an async function must be annotated with Promise',
            'It compiles, and callers receive a User without needing await',
            'It compiles, and the returned value is wrapped in a promise on the way out',
          ], 1, 'An async function always produces a promise, so the annotation has to be Promise<User> and the checker rejects the bare element type outright.'),
        ]
      ),
        lesson('Declaration Files and Third-Party Types', 12, `
A \`.d.ts\` file contains **types only** — no implementation, nothing emitted. It is how TypeScript learns about code it cannot see: compiled JavaScript libraries, globals injected by a bundler, and shapes you attach to other people's objects.

### Where types come from

1. **Bundled.** Most modern packages ship their own \`.d.ts\` and a \`"types"\` field in \`package.json\`. Nothing to do.
2. **DefinitelyTyped.** Older packages have community types: \`npm i -D @types/express @types/node\`. If the import errors with "Could not find a declaration file", try \`@types/\` plus the package name first.
3. **Yours.** Neither exists, so you write one.

### Writing a minimal declaration

\`\`\`ts
// src/types/legacy-slug.d.ts
declare module 'legacy-slug' {
  export interface SlugOptions {
    lower?: boolean;
    separator?: string;
  }
  export function slugify(input: string, options?: SlugOptions): string;
  const _default: { slugify: typeof slugify };
  export default _default;
}
\`\`\`

Type only what you use. A partial declaration is honest and useful; waiting until you can model the whole library means you never write one.

### The classic mistake: the shorthand declaration

\`\`\`ts
declare module 'legacy-slug';   // everything from this module is any
\`\`\`

This makes the error disappear, which is why people paste it. It also types every export as \`any\`, so \`slugify(42, 'nonsense', true)\` compiles and every value derived from the module is unchecked. It is \`any\` with extra steps — use it only as a deliberate, commented, temporary measure.

### Module augmentation: adding to someone else's types

This is where interface declaration merging from Chapter 2 pays off. The canonical example is attaching an authenticated user to Express:

\`\`\`ts
// src/types/express.d.ts
import 'express';                 // ensure this file is a module

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: 'admin' | 'user' };
  }
}
\`\`\`

Now \`req.user\` is typed everywhere, and your auth middleware and your route handlers agree. Without the \`import\`, the file is treated as a global script and the \`declare module\` becomes an *ambient module declaration* instead of an augmentation — the difference between adding a property and replacing the whole module. That single missing line is the reason most augmentation attempts fail.

### Globals

\`\`\`ts
// src/types/global.d.ts
export {};   // makes this a module so 'declare global' is allowed

declare global {
  interface Window {
    analytics?: { track(event: string, props?: Record<string, unknown>): void };
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}
\`\`\`

That \`ProcessEnv\` augmentation is worth the five minutes on any Node project: \`process.env.DATABASE_URL\` becomes \`string\` instead of \`string | undefined\`, so it stops demanding a null check at every use, and \`NODE_ENV\` autocompletes to its three real values. Be clear about what it does *not* buy you. \`@types/node\` declares \`interface ProcessEnv extends Dict<string>\`, so an index signature is always in play and a typo like \`process.env.DATBASE_URL\` still type-checks — as \`string | undefined\`. And it validates nothing at runtime; the values are whatever the environment holds. Pair it with a startup check.

### Non-code imports

\`\`\`ts
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.css';
\`\`\`

Bundlers let you import assets; TypeScript needs telling. Most frameworks ship these already (\`vite/client\`, \`next-env.d.ts\`) — check before writing your own.

### Making sure they are picked up

Declaration files must be inside your \`include\` paths. Put them in \`src/types/\` and confirm \`tsconfig.json\` has \`"include": ["src"]\`. A \`.d.ts\` outside the project is silently ignored, which produces the maddening symptom of a file that looks correct and changes nothing.

### Publishing your own types

\`\`\`json
// package.json
{ "types": "dist/index.d.ts" }

// tsconfig.json
{ "compilerOptions": { "declaration": true, "declarationMap": true } }
\`\`\`

\`declarationMap\` lets consumers "go to definition" into your source rather than the generated \`.d.ts\` — a small kindness that costs one line.
        `,
        [
          q('You add declare module \'legacy-slug\'; to make a missing declaration error go away. What does that cost you?', [
            'The module can then only be imported through a default import',
            'Its types resolve lazily, which slows every incremental build down',
            'The package is dropped from the emitted bundle at build time',
            'Every export becomes any, so calls with wrong arguments still compile',
          ], 3, 'The shorthand form declares the module with no shape at all, so it silences the error while leaving every value derived from that package unchecked.'),
          q('After augmenting NodeJS.ProcessEnv with DATABASE_URL as a string, what still slips through unnoticed?', [
            'A typo like process.env.DATBASE_URL, because ProcessEnv keeps an index signature',
            'Reading process.env from a module that has no imports or exports of its own',
            'Any access to process.env from a file that was compiled with allowJs on',
            'Assigning to process.env.NODE_ENV, which the augmentation turns readonly',
          ], 0, 'The Node types declare ProcessEnv with a string index signature, so an unknown key still type-checks as string or undefined, and the augmentation validates nothing at runtime.'),
          q('You keep your declaration files in a types/ folder beside src/, and tsconfig has include set to src. What happens?', [
            'They load anyway, because a .d.ts file is always treated as global',
            'They load only when a file imports them with an import type statement',
            'They apply to the build output but not to the editor language service',
            'They are ignored, since a declaration file outside include never joins the program',
          ], 3, 'A declaration file only takes effect once it is part of the program, so one sitting outside the include globs is silently skipped and appears to do nothing at all.'),
        ]
      ),
        lesson('Typing React Components and Hooks', 15, `
React with TypeScript is mostly ordinary typing plus a handful of specific shapes worth memorising.

### Props are just an object type

\`\`\`tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';     // a literal union, not string
  children?: React.ReactNode;
};

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{label}</button>;
}
\`\`\`

Two habits pay off immediately. Type unions like \`variant\` as literals so invalid values are a build error and autocomplete lists the options. And type children as \`React.ReactNode\` — that covers elements, strings, numbers, arrays, \`null\`, and \`false\`, which is what JSX can actually contain. \`JSX.Element\` is too narrow and rejects a plain string child.

Skip \`React.FC\`. It adds nothing you want since React 18 removed its implicit \`children\`, and it makes generic components awkward.

### Extending native element props

\`\`\`tsx
type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
};

function Field({ label, error, id, ...rest }: InputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} {...rest} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
\`\`\`

Now every real input attribute — \`placeholder\`, \`maxLength\`, \`autoComplete\`, every \`aria-*\` — is accepted and checked, without you listing any of them. Use \`ComponentPropsWithRef<'input'>\` when you forward a ref.

### Events

\`\`\`tsx
function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);          // string, because the element is known
}
function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}
\`\`\`

Inline handlers infer their event type from the JSX attribute, so annotate only when you extract the handler to a named function.

### useState: trust inference, except when you cannot

\`\`\`tsx
const [count, setCount] = useState(0);            // number
const [name, setName] = useState('');             // string

const [user, setUser] = useState(null);           // null — setUser(u) will error
const [user, setUser] = useState<User | null>(null);   // correct

const [items, setItems] = useState<Course[]>([]);      // otherwise never[]
\`\`\`

**Two initial values need an explicit type argument: \`null\` and \`[]\`.** Both infer to something useless, and the error appears later, at the setter, where the cause is not obvious. This is the most common React TypeScript friction, and it is entirely mechanical to fix.

### useRef has two different modes

\`\`\`tsx
const inputRef = useRef<HTMLInputElement>(null);   // a DOM node you only read
useEffect(() => { inputRef.current?.focus(); }, []);
return <input ref={inputRef} />;

const timerRef = useRef<number | null>(null);      // a box you assign to yourself
timerRef.current = window.setInterval(tick, 1000);
\`\`\`

Which one you get is decided by the **type argument**, not the initial value. Under \`@types/react\` 18 a type argument with no \`null\` in it — \`useRef<HTMLInputElement>(null)\` — selects the read-only \`RefObject\` overload React wants for DOM refs, so assigning \`.current\` yourself fails with "Cannot assign to 'current' because it is a read-only property"; putting \`| null\` in the type argument, as \`timerRef\` does, gives you the mutable box instead. \`@types/react\` 19 made \`current\` writable in both cases but now **requires** an argument, so the bare \`useRef<HTMLInputElement>()\` people reach for is a compile error there. Always pass an initial value, and include \`| null\` whenever you intend to write to \`.current\` yourself.

### useReducer with a discriminated action union

\`\`\`tsx
type Action =
  | { type: 'add'; course: Course }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

function reducer(state: Course[], action: Action): Course[] {
  switch (action.type) {
    case 'add':    return [...state, action.course];
    case 'remove': return state.filter(c => c.id !== action.id);
    case 'clear':  return [];
    default: {
      const _never: never = action;
      throw new Error('Unhandled action');
    }
  }
}
\`\`\`

\`dispatch({ type: 'remove' })\` will not compile, and adding a fourth action breaks the reducer until you handle it. This is the payoff from Chapter 2 in the place you will feel it most.

### Custom hooks

\`\`\`tsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  return [on, toggle] as const;      // readonly [boolean, () => void]
}

const [isOpen, toggleOpen] = useToggle();
\`\`\`

Without \`as const\`, the return infers as \`(boolean | (() => void))[]\` and destructuring gives both variables that useless union. Return an object when there are more than two values — names beat positions.

### Generic components

\`\`\`tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyOf: (item: T) => string;
};

function List<T>({ items, renderItem, keyOf }: ListProps<T>) {
  return <ul>{items.map(i => <li key={keyOf(i)}>{renderItem(i)}</li>)}</ul>;
}

<List items={courses} keyOf={c => c.id} renderItem={c => c.title} />
// T infers as Course, so c is fully typed inside both callbacks
\`\`\`

In a \`.tsx\` file, \`<T>\` alone can be parsed as JSX; write \`<T,>\` or \`<T extends unknown>\` if the compiler complains.
        `,
        [
          q('A component declares children as JSX.Element instead of React.ReactNode. What breaks?', [
            'Passing a component that returns a fragment, since fragments are not elements',
            'Passing a plain string child, because ReactNode covers strings and JSX.Element does not',
            'Passing several children at once, which needs ComponentPropsWithRef instead',
            'Passing a memoised component, because memo returns an exotic component type',
          ], 1, 'JSX can contain strings, numbers, arrays, null and false, and ReactNode is the type that covers all of them, so the narrower JSX.Element rejects valid children.'),
          q('Why type props as React.ComponentPropsWithoutRef<\'input\'> and an extra label field, rather than listing the attributes you need?', [
            'It renders the underlying input for you without writing any JSX',
            'It forwards a ref to the underlying element without extra wiring',
            'It accepts and checks every real input attribute, aria attributes included',
            'It stops callers passing extra props that the input would ignore',
          ], 2, 'The helper pulls in the full prop type of the native element, so placeholder, maxLength, autoComplete and every aria attribute are typed without you listing one of them.'),
          q('const timerRef = useRef<number>(null) followed by timerRef.current = window.setInterval(tick, 1000) fails under @types/react 18. Why?', [
            'setInterval returns a Timeout object in the Node type definitions',
            'A ref may only be assigned inside an effect, never during render',
            'useRef needs an initial value of undefined when the value can be null',
            'A type argument without null picks the read only overload, so current cannot be assigned',
          ], 3, 'The overload is chosen by the type argument rather than the initial value, so leaving null out gives the DOM ref form whose current is read only; useRef<number | null>(null) gives the mutable box.'),
        ]
      ),
            lesson('Migrating a JavaScript Project to TypeScript', 13, `
A 40,000 line Express app does not become a TypeScript app on a Friday. It becomes one over six weeks, one file at a time, with every commit shippable. The teams that give up are the ones who rename all 312 files at once, watch 4,100 errors scroll past, and revert before lunch.

### Let tsc read your JavaScript before you rename anything

\`\`\`json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "noEmit": true
  },
  "include": ["src"]
}
\`\`\`

\`allowJs\` pulls every \`.js\` file into the program so imports resolve and the editor can navigate. \`checkJs: false\` means those files are read but not judged. Run \`npx tsc --noEmit\` and you should see zero errors on day one. That green baseline is the thing you defend for the rest of the migration: it goes into CI immediately, and it never goes red.

Then opt in one file at a time with a comment:

\`\`\`js
// @ts-check
\`\`\`

No rename, no build change, no risk to the bundle. Put it at the top of \`src/lib/money.js\` and read what falls out. Most teams find two or three genuine bugs in the first hour, usually a function called with the wrong argument count or a helper that returns \`undefined\` on a path nobody tested.

### JSDoc is real typing, not a placeholder

A checked \`.js\` file carries types in comments, and the checker treats them exactly as it treats annotations.

\`\`\`js
/**
 * @param {number} cents
 * @param {'USD' | 'EUR'} currency
 * @returns {string}
 */
function format(cents, currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency })
    .format(cents / 100);
}

format(1999, 'GBP');   // Error: Argument of type '"GBP"' is not assignable
\`\`\`

You can reach across the boundary too. \`/** @type {import('./models').User} */\` pulls a type out of a \`.ts\` file into a \`.js\` one, which means you can define your shared models properly first and let the untouched JavaScript benefit immediately.

### Rename the leaves first

Order the work by dependency direction: pure utilities, then models, then services, then routes and components. A file whose imports are already typed converts with a handful of annotations. A route handler converted first inherits \`any\` from every helper below it, compiles clean, and gives you the feeling of progress without any of the safety.

| Stage | Scope | What it buys |
|---|---|---|
| \`allowJs\`, no checking | everything | resolution, navigation, a green baseline |
| \`// @ts-check\` and JSDoc | leaf modules | real errors with zero rename risk |
| \`.js\` to \`.ts\` | leaves upward | full inference, no comment syntax |
| \`strict: true\` | whole project | the null checks you started this for |

### Turn strict on last, one flag at a time

Flipping \`strict: true\` halfway through produces a number nobody wants to look at. Enable the members individually and measure first:

\`\`\`bash
npx tsc --noEmit --noImplicitAny    2>&1 | grep -c 'error TS'
npx tsc --noEmit --strictNullChecks 2>&1 | grep -c 'error TS'
\`\`\`

Now you have two numbers instead of a mood. \`noImplicitAny\` is usually a few hundred and almost all of it is unannotated parameters. \`strictNullChecks\` is the expensive one, and it is also the one that pays for the entire migration.

### The trap: any as a migration tool

Renaming a file and silencing whatever surfaces is not migration.

\`\`\`ts
const order = JSON.parse(body) as any;   // every value derived from this is now unchecked
\`\`\`

One cast disables checking across a whole feature, and the file looks migrated in the diff. Use \`unknown\` and narrow it, or leave the module as checked JavaScript for another week. A file that is honestly untyped beats a file that lies about being typed.

Track the debt where everyone can see it and let the ratchet do the work:

\`\`\`bash
grep -rE ': any\\b|@ts-(ignore|expect-error)' src --include='*.ts' | wc -l
\`\`\`

Store that count, fail CI when it rises, and drop it whenever someone touches a file. A number that only goes down finishes. A one week code freeze to convert everything does not.
      `,
        [
          q('You set allowJs to true and checkJs to false on an existing JavaScript project. What should the first tsc --noEmit run report?', [
            'Every .js file checked with strict off, so a short list of real errors',
            'Zero errors, with the .js files in the program for resolution but not judged',
            'One error per file that does not yet carry any type annotations',
            'Nothing at all, because tsc skips a project that contains no .ts files',
          ], 1, 'allowJs pulls the JavaScript into the program so imports resolve, and with checkJs off nothing in those files is reported, which gives you the green baseline the migration then protects.'),
          q('Why convert pure utilities and models before converting route handlers and components?', [
            'The compiler refuses to check a file whose imports are still plain JavaScript',
            'Handlers cannot be converted until the framework ships its own declaration files',
            'A handler converted on top of untyped imports inherits any and only looks finished',
            'Renaming in the other order invalidates the whole .tsbuildinfo cache each time',
          ], 2, 'Types flow upward from the leaves, so a handler converted first is annotated against values that are still any, which hides the mismatches the migration exists to surface.'),
          q('What does adding // @ts-check to the top of a .js file actually do?', [
            'It turns checking on for that one file and reads its JSDoc as annotations',
            'It marks the file as migrated so later tsc runs skip it entirely',
            'It compiles that single file to a .ts file inside the output directory',
            'It switches strict mode on for the whole project from that entry point',
          ], 0, 'The comment opts one JavaScript file into type checking without any rename, and the checker treats the JSDoc types in it exactly as it treats annotations in a .ts file.'),
        ]
      ),
      ],
      [
        q('Why is const user: User = await res.json() unsafe even in strict mode?', [
          'await loses type information',
          'Response bodies are always strings',
          'res.json() is typed Promise<any>, so nothing verifies the shape and fetch does not reject on 4xx or 5xx',
          'User must be an interface rather than a type alias',
        ], 2, 'The annotation is accepted because any is assignable to anything, so an error body parses into a User-shaped variable unchecked.'),
        q('What does z.infer<typeof UserSchema> give you?', [
          'A static type derived from the runtime schema, so the validator and the type cannot drift apart',
          'A runtime validator generated from an interface',
          'A JSON Schema document',
          'A deep clone of the parsed value',
        ], 0, 'Deriving the type from the schema means one declaration produces both the runtime check and the compile-time shape.'),
        q('An express.d.ts augmentation adding req.user has no effect. What is the most likely cause?', [
          'Request is a type alias and cannot be merged',
          'The augmentation must be written in JavaScript',
          'declare global is required for module augmentation',
          'The file has no import or export, so it is a global script and declares a new ambient module instead of augmenting',
        ], 3, 'Module augmentation only works inside a module; without an import or export the declaration replaces rather than extends.'),
        q('const [user, setUser] = useState(null) later rejects setUser(fetchedUser). Why?', [
          'The setter must be wrapped in useCallback',
          'The state type was inferred as null from the initial value; write useState<User | null>(null)',
          'useState cannot hold objects',
          'React requires an initial value of undefined for nullable state',
        ], 1, 'Inference uses the initial value, so null and [] need an explicit type argument or the setter rejects everything else.'),
      ]
    ),
    chapter(
      'Types That Compute',
      'Conditional types, infer, template literals, key remapping, branded types, and satisfies — the tools for the last mile of precision.',
      [
        lesson('Conditional Types and infer', 14, `
A conditional type is an \`if\` statement that runs inside the type checker: \`T extends U ? X : Y\`. Every utility from Chapter 4 that filters or unwraps something — \`Exclude\`, \`NonNullable\`, \`ReturnType\`, \`Awaited\` — is a few lines of this.

### The shape

\`\`\`ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hi'>;    // true
type B = IsString<42>;      // false
\`\`\`

\`extends\` here asks "is assignable to" — the same question the checker asks at every call site. It is not class inheritance, and it means exactly what it meant in the constraint \`<T extends { length: number }>\` from Chapter 4.

### Distribution: the behaviour that surprises everyone

When the checked type is a **naked type parameter** and you hand it a union, the conditional runs once per member and the results are unioned back together.

\`\`\`ts
type ToArray<T> = T extends unknown ? T[] : never;

type R = ToArray<string | number>;
// string[] | number[]  — NOT (string | number)[]
\`\`\`

That is usually what you want. It is exactly how \`Exclude\` works:

\`\`\`ts
type MyExclude<T, U> = T extends U ? never : T;

type Keys = MyExclude<'id' | 'name' | 'secret', 'secret'>;   // 'id' | 'name'
\`\`\`

Each member is tested alone, the matches become \`never\`, and \`never\` vanishes from a union. Chapter 3's empty type earns its keep here.

To **stop** distribution, wrap both sides in a tuple so the parameter is no longer naked:

\`\`\`ts
type ToArrayWhole<T> = [T] extends [unknown] ? T[] : never;

type R2 = ToArrayWhole<string | number>;   // (string | number)[]
\`\`\`

### The classic mistake: never distributes to nothing

\`\`\`ts
type IsNever<T> = T extends never ? true : false;

type Q = IsNever<never>;    // never — not true
\`\`\`

\`never\` is the union with zero members, so a distributive conditional runs zero times and produces zero results. This costs people an afternoon roughly once per career. The tuple trick fixes it:

\`\`\`ts
type IsNever<T> = [T] extends [never] ? true : false;

type Q = IsNever<never>;    // true
\`\`\`

### infer: pattern matching for types

\`infer\` declares a type variable inside the \`extends\` clause and binds whatever matched that position.

\`\`\`ts
type ElementOf<T> = T extends readonly (infer E)[] ? E : never;

type X = ElementOf<Course[]>;          // Course
type Y = ElementOf<readonly string[]>; // string
\`\`\`

That is \`T[number]\` from Chapter 4 written the long way — but \`infer\` reaches places indexed access cannot:

\`\`\`ts
type MyReturn<F> = F extends (...args: any[]) => infer R ? R : never;
type MyParams<F> = F extends (...args: infer P) => unknown ? P : never;

type R = MyReturn<typeof createUser>;   // the object literal it returns
type P = MyParams<typeof createUser>;   // [string, string]
\`\`\`

Those two are \`ReturnType\` and \`Parameters\`, near enough verbatim from the standard library.

Recursion unwraps nested wrappers:

\`\`\`ts
type Unwrap<T> = T extends Promise<infer V> ? Unwrap<V> : T;

type U = Unwrap<Promise<Promise<User>>>;   // User
\`\`\`

Since TypeScript 4.7 an \`infer\` can carry its own constraint, which saves a second conditional:

\`\`\`ts
type FirstString<T> = T extends [infer H extends string, ...unknown[]] ? H : never;
\`\`\`

### Where this is worth it, and where it is not

Conditional types belong in **library-shaped code**: a helper called from fifty places, a wrapper that must preserve whatever it was handed, a derived type that would otherwise be maintained by hand. They are the wrong tool for describing a user record.

Two costs are real. Nested conditionals produce error messages that name the whole expression instead of the failing branch, and deep recursion is slow — pass roughly fifty levels and you get "Type instantiation is excessively deep and possibly infinite", which almost always means a recursive type with no base case. Keep them shallow, name the intermediate steps, and put a worked example in a comment above anything longer than three lines. Chapter 7 covers how to debug them when they do go wrong.
        `,
        [
          q('type MyExclude<T, U> = T extends U ? never : T. Why does MyExclude<\'id\' | \'name\' | \'secret\', \'secret\'> come out as \'id\' | \'name\'?', [
            'The conditional compares the whole union at once and subtracts the match',
            'Each member is tested alone, and the matches become never, which drops out',
            'extends removes any member that is also a key of the second argument',
            'never is assignable to string, so it collapses into the nearest member',
          ], 1, 'The conditional distributes, running once per union member, and the branch that matches yields never, which contributes nothing when the results are unioned back together.'),
          q('Given declare function createUser(name: string, email: string): User, what does F extends (...args: infer P) => unknown ? P : never produce for typeof createUser?', [
            'The tuple [string, string], because infer in the rest slot binds the parameter list',
            'The union string | User, collected from every position in the signature',
            'The type User, since infer always binds whatever the function returns',
            'The type unknown, because the return position is matched first',
          ], 0, 'Placing infer in the rest parameter position captures the entire parameter list as a tuple, which is exactly how the standard Parameters utility is written.'),
          q('A recursive conditional type fails with \'Type instantiation is excessively deep and possibly infinite\'. What is the usual cause?', [
            'The type alias is referenced before it is declared in the file',
            'A union in the input has gone past the 100,000 member ceiling',
            'The recursion has no base case, so no branch ever terminates it',
            'The project needs the incremental flag to cache deep instantiations',
          ], 2, 'The checker abandons the work after roughly fifty levels of instantiation, and a recursive type that never reaches a terminating branch is what drives it that deep.'),
        ]
      ),
        lesson('Template Literal Types and Key Remapping', 13, `
String literal unions from Chapter 2 can be built out of other string literal unions, and the mapped types from Chapter 4 can rename keys as they go. Together they let a type follow a naming convention instead of restating it by hand.

### Template literal types

\`\`\`ts
type Size = 'sm' | 'md' | 'lg';
type Variant = 'primary' | 'ghost';

type ClassName = \`btn-\${Variant}-\${Size}\`;
// 'btn-primary-sm' | 'btn-primary-md' | … six members, generated
\`\`\`

Substituting a union multiplies out every combination. Four intrinsic helpers transform the pieces:

\`\`\`ts
type A = Uppercase<'get'>;        // 'GET'
type B = Lowercase<'GET'>;        // 'get'
type C = Capitalize<'name'>;      // 'Name'
type D = Uncapitalize<'Name'>;    // 'name'
\`\`\`

### Parsing a string at the type level

\`infer\` from the previous lesson works inside a template pattern, which is how typed routers know what \`params\` contains:

\`\`\`ts
type PathParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | PathParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer Param}\`
      ? Param
      : never;

type P = PathParams<'/courses/:slug/lessons/:lessonId'>;
// 'slug' | 'lessonId'

function url(path: '/courses/:slug/lessons/:lessonId', params: Record<P, string>) {}
\`\`\`

Rename a segment in the route string and the required params change with it. There is no second list to keep in sync.

### Key remapping with as

A mapped type may rewrite each key through \`as\`:

\`\`\`ts
type Getters<T> = {
  [K in keyof T & string as \`get\${Capitalize<K>}\`]: () => T[K];
};

type UserGetters = Getters<{ id: string; age: number }>;
// { getId: () => string; getAge: () => number }
\`\`\`

The \`& string\` is not decoration. \`keyof T\` can include \`number\` and \`symbol\` keys, and neither belongs in a template literal. Omit it here and \`Capitalize<K>\` rejects it first — "Type 'K' does not satisfy the constraint 'string'" — because \`Capitalize\` only accepts strings. Drop the \`Capitalize\` as well, so the key goes straight into the template, and you get the underlying complaint: "Type 'symbol' is not assignable to type 'string | number | bigint | boolean | null | undefined'".

### Filtering keys by remapping to never

A key mapped to \`never\` is dropped from the result, which turns \`as\` into a filter:

\`\`\`ts
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type Searchable = StringKeys<{ id: string; title: string; views: number }>;
// { id: string; title: string }
\`\`\`

The same move builds "only the methods", "everything except the internal fields", or a safer \`Omit\` than the one Chapter 4 warned about — this one matches real keys instead of accepting any string.

### A typed event emitter

\`\`\`ts
type Events = {
  'course:started': { slug: string };
  'lesson:done': { slug: string; lessonId: number };
};

type Handlers = {
  [K in keyof Events as \`on\${Capitalize<K & string>}\`]?: (p: Events[K]) => void;
};

function emit<K extends keyof Events>(name: K, payload: Events[K]) {}

emit('lesson:done', { slug: 'ts', lessonId: 3 });   // payload checked per event
emit('lesson:done', { slug: 'ts' });                // Error: lessonId is missing
\`\`\`

One map declares the events; the emitter, the handler bag, and every payload follow from it.

### The classic mistake: combinatorial explosion

\`\`\`ts
type Long = \`\${Letter}\${Letter}\${Letter}\${Letter}\`;
// 26^4 = 456,976 members
\`\`\`

A union has a hard ceiling of 100,000 members, and editor responsiveness dies long before you reach it. Every cross-product of template literals multiplies, so two ten-member unions are fine at 100 members and four are still fine at 10,000 — but five cross to exactly 100,000 and the build stops with "Expression produces a union type that is too complex to represent". When you need to constrain a large string space, validate it at runtime with a regex and brand the result — the next lesson — rather than enumerating it in the type system.
        `,
        [
          q('In { [K in keyof T & string as `get${Capitalize<K>}`]: () => T[K] }, why is the & string needed?', [
            'It stops optional keys from widening to string during the mapping',
            'It keeps the mapped type homomorphic, so modifiers are preserved',
            'keyof T may include number and symbol keys, which a template literal rejects',
            'Capitalize only accepts keys that were declared as readonly',
          ], 2, 'A template literal slot only accepts string-like types, so a symbol key fails the constraint and the intersection filters it out before the template ever sees it.'),
          q('PathParams<\'/courses/:slug/lessons/:lessonId\'> evaluates to \'slug\' | \'lessonId\'. What happens when someone renames the segment to :courseSlug?', [
            'The type stays as it was until the project is rebuilt with tsc --build',
            'Both spellings are accepted, since the pattern matches either segment',
            'The type falls back to string, because the pattern no longer matches',
            'The params type follows the route string, so the old key stops compiling',
          ], 3, 'The parameter names are parsed out of the literal route string, so editing the route changes the required keys and every call site still passing the old name fails to build.'),
          q('Why does crossing five ten member unions inside one template literal type stop the build?', [
            'A template literal type may not hold more than four substitution slots',
            'The result has 100,000 members, which hits the ceiling on union size',
            'Each slot forces a fresh instantiation past the recursion depth limit',
            'Uppercase and Capitalize cannot be applied to a generated union',
          ], 1, 'Substituting a union multiplies out every combination, and TypeScript refuses to represent a union larger than 100,000 members, so the cross product is rejected outright.'),
        ]
      ),
        lesson('Branded Types and satisfies', 13, `
Chapter 1 said types check shape, not meaning: \`daysBetween(a, b)\` compiles with its arguments swapped. Structural typing is why. Two aliases of \`string\` are the *same type*, so nothing stops a user id going where an order id belongs.

\`\`\`ts
type UserId = string;
type OrderId = string;

function cancelOrder(id: OrderId) {}
declare const userId: UserId;

cancelOrder(userId);   // compiles, ships, and cancels the wrong thing or nothing
\`\`\`

### Branding restores nominal typing

Intersect the primitive with a property nobody can produce by accident:

\`\`\`ts
declare const brand: unique symbol;

type Brand<T, B extends string> = T & { readonly [brand]: B };

type UserId  = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

cancelOrder(userId);   // Error: Type 'UserId' is not assignable to type 'OrderId'.
\`\`\`

A \`UserId\` is still a plain string at runtime — the brand is a phantom property no value ever has, and Chapter 1's erasure rule means it costs nothing. You also cannot conjure one by writing a string literal, which is the point: there must be exactly one door in.

\`\`\`ts
export function toUserId(raw: string): UserId {
  if (!/^u_[a-z0-9]{12}$/.test(raw)) throw new Error(\`Malformed user id: \${raw}\`);
  return raw as UserId;   // the single sanctioned cast, beside the check that earns it
}
\`\`\`

Every \`as\` outside that function is now a review question, and the validation cannot be skipped at a call site because there is no other way to obtain the type.

### The high-value brands

\`\`\`ts
type Email    = Brand<string, 'Email'>;
type SafeHtml = Brand<string, 'SafeHtml'>;
type Cents    = Brand<number, 'Cents'>;
type Dollars  = Brand<number, 'Dollars'>;

function render(html: SafeHtml) {}

render(userComment);            // Error — raw input cannot reach the sink
render(sanitize(userComment));  // sanitize is the only producer of SafeHtml
\`\`\`

The \`SafeHtml\` pattern is worth adopting on its own: XSS becomes a compile error instead of a code-review habit. \`Cents\` versus \`Dollars\` kills the other classic — a hundredfold pricing bug that no amount of \`number\` would ever have caught.

Zod (Chapter 5) can brand its output directly, so validation and brand stay in one declaration:

\`\`\`ts
const EmailSchema = z.string().email().brand<'Email'>();
type Email = z.infer<typeof EmailSchema>;
\`\`\`

### satisfies: check without widening

An annotation checks a value and then **replaces** everything inference knew about it:

\`\`\`ts
const routes: Record<string, string> = {
  home: '/',
  course: '/courses/:slug',
};

routes.hoem;                        // no error — the index signature accepts any key
type Route = keyof typeof routes;   // string, and useless
\`\`\`

\`as\` is worse, because it checks nothing at all. \`satisfies\` does both jobs:

\`\`\`ts
const routes = {
  home: '/',
  course: '/courses/:slug',
} satisfies Record<string, \`/\${string}\`>;

routes.hoem;                        // Error: Property 'hoem' does not exist
type Route = keyof typeof routes;   // 'home' | 'course'
routes.home;                        // '/' — the literal type survives
\`\`\`

| Form | Checks the value | Keeps inference |
|---|---|---|
| \`const x: T = …\` | yes | no |
| \`const x = … as T\` | no | no |
| \`const x = … satisfies T\` | yes | yes |

The exhaustive-\`Record\` trick from Chapter 4 gets strictly better with it:

\`\`\`ts
const LABELS = {
  idle: 'Ready when you are',
  loading: 'Loading…',
  ready: 'Done',
  error: 'Something went wrong',
} as const satisfies Record<Status, string>;
\`\`\`

Adding a fifth \`Status\` still breaks the build until you add its label, but \`LABELS.ready\` is now the literal \`'Done'\` rather than a generic \`string\`. The \`as const\` is doing that second job: \`satisfies\` preserves whatever was inferred, and against a plain \`string\` target the values would otherwise widen to \`string\` on their own. The \`routes\` example above kept its literals without \`as const\` only because its target was a template literal type, which counts as literal-like and so suppresses widening.

### The rule

Reach for \`satisfies\` on every configuration object, lookup table, and test fixture. Reach for a brand whenever two values share a primitive type, mean different things, and swapping them would be silent.
        `,
        [
          q('With type UserId = Brand<string, \'UserId\'>, what happens on const id: UserId = \'u_abc123def456\'?', [
            'It compiles, since the brand is erased before assignability is checked',
            'It compiles only when the string matches the pattern in the regex',
            'It fails, because a plain string does not carry the phantom brand property',
            'It fails, because a branded type has to be declared as an interface',
          ], 2, 'The brand is an intersected property that no literal can have, so the only way to obtain a UserId is the constructor function that validates the string and casts it.'),
          q('Why write as const satisfies Record<Status, string> on a label table rather than satisfies Record<Status, string> alone?', [
            'Without as const the values widen to string, so LABELS.ready is not the literal',
            'Without as const a missing Status key is no longer reported by the checker',
            'as const is what makes the object exhaustive over the Status union',
            'satisfies on its own marks the properties readonly but not their values',
          ], 0, 'satisfies keeps whatever was inferred, and against a plain string target each value infers as string, so the as const is what pins every label to its own literal type.'),
          q('render takes a SafeHtml, and sanitize is the only function that returns one. What does that arrangement buy you?', [
            'It escapes the string at runtime every time render is called',
            'It lets the bundler drop the sanitiser from the production build',
            'It makes SafeHtml assignable from string, though not the other way',
            'Passing unsanitised input to render becomes a build error, not a review catch',
          ], 3, 'Because no other code can produce the brand, the sink becomes a type-level gate and raw user input cannot reach render without going through the sanitiser first.'),
        ]
      ),
            lesson('Variadic Tuples and Recursive Types', 14, `
\`Promise.all\` hands back a tuple where every position keeps its own type. Writing a helper of your own that behaves that way needs one piece of syntax you have not met yet: a spread inside a tuple type.

### A tuple type can have a rest element anywhere

\`\`\`ts
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : [];

type A = Head<[string, number, boolean]>;   // string
type B = Tail<[string, number, boolean]>;   // [number, boolean]
\`\`\`

The \`...\` in a tuple type is not the rest parameter you know from function signatures. It can sit at the front, in the middle, or at the end, so \`[boolean, ...T, string]\` is a perfectly legal type.

### Wrapping a function without losing its signature

Everybody writes the broken version first:

\`\`\`ts
function withTiming(fn: (...args: any[]) => any) {
  return (...args: any[]) => fn(...args);
}

const timedCharge = withTiming(charge);
timedCharge('u_7');            // compiles, then throws at runtime: amount is undefined
timedCharge(1, 2, 3, 4, 5);    // also compiles
\`\`\`

The wrapper accepted anything and returned \`any\`, so the whole call site lost its checking. Capture the parameter list as a tuple instead:

\`\`\`ts
function withTiming<A extends unknown[], R>(fn: (...args: A) => R) {
  return (...args: A): R => {
    const started = performance.now();
    const out = fn(...args);
    console.log(\`\${fn.name} took \${(performance.now() - started).toFixed(1)}ms\`);
    return out;
  };
}

const timedCharge = withTiming(charge);
timedCharge('u_7');   // Error: Expected 2 arguments, but got 1
\`\`\`

\`A\` infers as \`[userId: string, cents: number]\`, parameter names and all, so the wrapper is indistinguishable from the function it wraps. Adding an argument in front is a type-level operation:

\`\`\`ts
type WithLogger<F> = F extends (...args: infer A) => infer R
  ? (logger: Logger, ...args: A) => R
  : never;
\`\`\`

### Recursion over object types

A mapped type may call itself, which is how a genuinely deep transform is written:

\`\`\`ts
type DeepReadonly<T> = T extends (infer E)[]
  ? readonly DeepReadonly<E>[]
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type Config = DeepReadonly<{ db: { host: string; pools: number[] } }>;
// config.db.pools[0] = 5  fails: index signature only permits reading
\`\`\`

Branch order is load bearing. An array satisfies \`T extends object\`, so putting the object branch first turns \`number[]\` into a record of \`0\`, \`1\`, \`length\`, \`map\` and the rest. The same trap catches \`Date\`, \`Map\` and functions: they are all objects, and a naive \`DeepPartial\` maps over their methods and produces a type no real \`Date\` satisfies. List the classes you care about before the object branch.

### Recursion has a budget, and a way around it

\`\`\`ts
type Repeat<T, N extends number, Acc extends T[] = []> =
  Acc['length'] extends N ? Acc : Repeat<T, N, [...Acc, T]>;

type Slots = Repeat<'empty', 5>;
// ['empty', 'empty', 'empty', 'empty', 'empty']
\`\`\`

The recursive call is the entire body of the false branch, which makes it a tail call, and since 4.5 the checker unrolls those iteratively rather than nesting instantiations. That buys roughly 1,000 levels. Wrap the same call in anything, even a one member union or a tuple, and it stops being a tail call and you drop back to a limit near 50.

| Form | Practical depth |
|---|---|
| \`Recurse<Rest>\` alone in a branch | about 1,000 |
| \`[Recurse<Rest>]\` or \`A \\| Recurse<Rest>\` | about 50 |
| Recursion inside a mapped type | bounded by object nesting, not the counter |

### Keeping literals through a call

\`\`\`ts
function route<const T extends readonly string[]>(segments: T): T {
  return segments;
}

const r = route(['courses', 'typescript']);   // readonly ['courses', 'typescript']
\`\`\`

A \`const\` type parameter tells the checker to infer the argument as if the caller had written \`as const\`, so the literals survive without every call site remembering to add it. Before 5.0 the only options were an \`as const\` at each call or a widened \`string[]\`.

Reach for all of this when you are writing the helper, not the feature. A wrapper used in fifty places earns the tuple gymnastics. A single service function does not.
      `,
        [
          q('In function withTiming<A extends unknown[], R>(fn: (...args: A) => R), what does the type parameter A capture?', [
            'The whole parameter list as a tuple, so the wrapper takes the same arguments',
            'A union of the parameter types, checked one argument at a time',
            'An array of the argument values passed at the first call site',
            'Only the required parameters, with the optional ones widened to unknown',
          ], 0, 'A rest parameter constrained to unknown[] infers as a tuple, so the arity, order, names and optionality of the wrapped function all survive into the returned wrapper.'),
          q('In DeepReadonly, why must the array branch be checked before the T extends object branch?', [
            'An array is not assignable to object, so that branch would never be reached',
            'An array is an object, so the object branch would map over length and indices',
            'The object branch cannot be applied to a type that has a numeric index',
            'Otherwise readonly is applied twice and the two applications cancel out',
          ], 1, 'Arrays satisfy the object constraint, so putting that branch first rewrites number[] as a mapped record of its numeric keys, length and methods instead of a readonly array.'),
          q('type Repeat<T, N, Acc extends T[] = []> = Acc[\'length\'] extends N ? Acc : Repeat<T, N, [...Acc, T]> survives depths a nested version cannot. Why?', [
            'The accumulator is cached between runs in the .tsbuildinfo file',
            'Tuple spreads evaluate eagerly, so no new instantiation is created',
            'Acc[\'length\'] is a literal number, which the checker memoises',
            'The recursive call is in tail position, so the checker unrolls it iteratively',
          ], 3, 'TypeScript eliminates tail recursion in conditional types, giving roughly 1,000 levels, while wrapping the same call in a tuple or union drops it back to a limit near fifty.'),
        ]
      ),
      ],
      [
        q('type ToArray<T> = T extends unknown ? T[] : never. What is ToArray<string | number>?', [
          '(string | number)[]',
          'unknown[]',
          'never',
          'string[] | number[], because a naked type parameter distributes over the union',
        ], 3, 'A conditional type with a bare type parameter runs once per union member and unions the results back together.'),
        q('type IsNever<T> = T extends never ? true : false evaluates IsNever<never> to never rather than true. Why?', [
          'never is the union with no members, so the distributive conditional runs zero times and produces nothing',
          'never is not assignable to itself',
          'Conditional types cannot produce boolean literal types',
          'The type parameter is missing a constraint',
        ], 0, 'Distribution iterates the members of a union and never has none, so wrapping both sides in a tuple is what makes the check actually fire.'),
        q('What does { [K in keyof T as T[K] extends string ? K : never]: T[K] } produce?', [
          'Every property, with each value type replaced by string',
          'A union of the keys whose values are strings',
          'Only the properties whose value type is string, because keys mapped to never are dropped',
          'The original type, with its string properties made optional',
        ], 2, 'Key remapping to never removes that key from the mapped type, which turns as into a filter.'),
        q('What does satisfies Record<string, string> give you that the annotation : Record<string, string> does not?', [
          'It validates the object at runtime',
          'It checks the value against the type while leaving the inferred literal keys in place',
          'It makes every property readonly',
          'It permits extra properties that the annotation would reject',
        ], 1, 'An annotation replaces the inferred type with the declared one, whereas satisfies checks against it and keeps the narrower inference.'),
      ]
    ),
    chapter(
      'Keeping a Large Codebase Fast and Green',
      'Reading the errors tsc actually gives you, keeping check times survivable as a project grows, and testing types so a regression fails the build.',
      [
        lesson('Reading and Debugging Type Errors', 14, `
Chapter 4 gave you the first rule for a wall of red text: find "is not assignable to" and read the **innermost** pair of types it names. Everything above that line is context. Here is the rest of the toolkit, in the order you should reach for it.

### Make the type readable before you argue with it

Hovering a derived type usually shows the recipe rather than the result — \`Partial<Omit<User, 'id'>> & Timestamps\` — which tells you nothing about which property is wrong. This one-liner forces expansion:

\`\`\`ts
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type Debug = Prettify<Partial<Omit<User, 'id'>> & Timestamps>;
// hover now shows: { name?: string; email?: string; createdAt: Date; updatedAt: Date }
\`\`\`

The mapped type walks every key and the \`& {}\` stops TypeScript from collapsing the result back to an alias name. Keep it in a \`types/debug.ts\` and delete the usages when you are done.

When the tooltip ends in \`...\`, run \`npx tsc --noEmit --noErrorTruncation\` and read the full text in the terminal.

### Bisect the mismatch

A long error on a call with four arguments does not tell you which one is wrong. Split the expression and let the checker point at a smaller thing:

\`\`\`ts
// Instead of arguing with this:
save(buildPayload(form, user, options));

// Ask one question at a time:
const payload = buildPayload(form, user, options);
const _check: SavePayload = payload;   // the error now names one property
\`\`\`

That temporary annotated \`const\` is the single most useful debugging move in TypeScript. \`satisfies\` from Chapter 6 does the same job without changing the variable's type.

### What the common messages actually mean

| Message | Usually means |
|---|---|
| Type 'X' is not assignable to type 'never' | An unhandled variant in a Chapter 2 exhaustiveness check, or an intersection no value satisfies |
| Property 'x' does not exist on type 'A' | You are on a union and have not narrowed yet (Chapter 3) |
| Object literal may only specify known properties | Excess property check on a fresh literal — almost always a typo |
| Type instantiation is excessively deep and possibly infinite | A recursive conditional or mapped type with no base case |
| Argument of type 'X' is not assignable to parameter of type 'never' | An empty array inferred as \`never[]\`, or a generic that failed to infer |
| Two different types with this name exist | Duplicate copies of a \`@types\` package in \`node_modules\` |

That last one is worth its own paragraph, because it looks impossible: \`Element\` is not assignable to \`Element\`. Two versions of \`@types/react\` are installed and each declares its own. Diagnose with \`npm ls @types/react\`, then pin one copy with an \`overrides\` block in \`package.json\`.

### Finding out why a file is even in the program

\`\`\`bash
npx tsc --noEmit --explainFiles | grep -A2 'suspicious-file'
npx tsc --noEmit --listFilesOnly | wc -l
\`\`\`

Type-checking a file you thought you excluded is a common cause of both mystery errors and slow builds. \`--explainFiles\` prints the chain that pulled each file in — an \`include\` glob, a \`types\` entry, or an import you forgot about.

### The classic mistake: silencing the messenger

\`\`\`ts
const user = res.data as any;    // error gone, bug intact
\`\`\`

Reaching for \`as any\` at the first ugly message deletes the evidence and leaves the defect. When you genuinely must move on, use \`// @ts-expect-error\` with a reason instead:

\`\`\`ts
// @ts-expect-error upstream types are wrong; see acme/sdk#412
sdk.configure({ retries: 3 });
\`\`\`

Unlike \`@ts-ignore\`, this **fails the build the day the underlying error disappears**, so the suppression removes itself when the dependency is fixed. Grep for it in review; a codebase's \`@ts-expect-error\` count is a debt ledger you can actually read.
        `,
        [
          q('tsc reports that a value of type \'Element\' is not assignable to type \'Element\'. What is going on?', [
            'The two files disagree about the jsx setting in their tsconfig',
            'One Element comes from a namespace and the other from a module',
            'The type is compared before its declaration merging has finished',
            'Two copies of the same @types package are installed, each declaring its own',
          ], 3, 'Identical names coming from two different copies of a package are two distinct types, so npm ls finds the duplicate and an overrides entry pins the project to one copy.'),
          q('type Prettify<T> = { [K in keyof T]: T[K] } & {}. What is the empty intersection there for?', [
            'It stops the checker collapsing the result back to the alias name on hover',
            'It adds an empty index signature so unknown keys stop reporting errors',
            'It makes the mapped type homomorphic, which preserves optional modifiers',
            'It strips the readonly modifiers that the mapped type would otherwise copy',
          ], 0, 'The mapped type walks every key and the empty intersection stops TypeScript displaying the original alias recipe, which is what turns an unreadable derived type into a plain property list.'),
          q('A call with four arguments produces a wall of red text. Which move narrows it down fastest?', [
            'Cast the argument you suspect with as any and see whether the error moves',
            'Rerun the build with skipLibCheck disabled so the search covers more files',
            'Assign each subexpression to a temporary annotated const and read them one at a time',
            'Add an explicit return type annotation to the function that contains the call',
          ], 2, 'Splitting the expression makes the checker compare one small pair of types at a time, so the message names a single failing property instead of the whole call signature.'),
        ]
      ),
        lesson('Build Speed, Project References, and Monorepos', 14, `
Type checking gets slower superlinearly as a codebase grows, and the symptom people report is never "the build is slow" — it is "autocomplete takes four seconds". Measure before you optimise.

### Find out where the time goes

\`\`\`bash
npx tsc --noEmit --extendedDiagnostics
# Files:            2,431
# Check time:       18.4s
# Total time:       26.1s

npx tsc --noEmit --generateTrace ./trace
npx @typescript/analyze-trace ./trace     # ranks the slowest types and files
\`\`\`

\`analyze-trace\` names the exact type alias that costs six seconds. In practice the answer is nearly always one of three things: a template literal cross-product (Chapter 6), a deeply recursive conditional type, or a single enormous inferred object literal such as a route table or a theme.

### The cheap wins

\`\`\`json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo",
    "skipLibCheck": true
  }
}
\`\`\`

\`incremental\` caches what it checked; the second run only revisits what changed. \`skipLibCheck\` from Chapter 1 skips \`.d.ts\` files in \`node_modules\`, which on a React project is more source than your own. Both are close to free.

### Type-only imports

\`\`\`ts
import type { User } from './models';     // erased entirely
import { saveUser } from './models';      // kept
\`\`\`

With \`verbatimModuleSyntax\` (in the Chapter 1 tsconfig) TypeScript emits exactly what you wrote, so a plain \`import\` of something used only as a type stays in the output. That is how a types-only file ends up in a bundle and how import cycles appear at runtime that do not exist in the source. Turn on the \`consistent-type-imports\` lint rule and let it fix the whole codebase once.

### Project references

In a monorepo, one \`tsc\` over everything rechecks everything. References split it into projects that build independently and cache separately.

\`\`\`json
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,        // required: emits .d.ts and .tsbuildinfo
    "declaration": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}

// packages/api/tsconfig.json
{
  "compilerOptions": { "outDir": "dist" },
  "references": [{ "path": "../shared" }],
  "include": ["src"]
}
\`\`\`

\`\`\`bash
npx tsc --build            # dependency order, skips unchanged projects
npx tsc --build --watch
npx tsc --build --clean
\`\`\`

The trade is real: \`api\` now consumes \`shared\`'s **generated \`.d.ts\`**, not its source, so \`shared\` must be built before \`api\` can be checked. In exchange, touching a file in \`api\` never rechecks \`shared\`, and CI can cache each project's \`.tsbuildinfo\`.

### The classic mistake: paths that only the checker believes

\`\`\`json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
\`\`\`

\`tsc\` now resolves \`import { db } from '@/lib/db'\` happily. Node does not, and neither does a bundler that has not been told. The result is a green type check and \`Cannot find module '@/lib/db'\` at runtime — because \`paths\` **only informs type resolution and never rewrites the emitted import**. Whatever runs your code needs the same mapping: \`resolve.alias\` in Vite, \`moduleNameMapper\` in Jest, \`imports\` in \`package.json\` for Node. Configure both or use relative paths.

### CI shape

Run \`tsc --noEmit\` as its own job, in parallel with tests and lint, on the full project — not just changed files, since a type error usually surfaces somewhere you did not touch. Cache \`node_modules/.cache\` between runs. If checking a monorepo exceeds a few minutes, that is the signal to introduce references rather than to raise the timeout.
        `,
        [
          q('packages/api lists packages/shared in its references array. What has to be true before api can be type-checked?', [
            'shared must be built, because api consumes its emitted .d.ts and not its source',
            'shared must list api in its own references array so the link resolves both ways',
            'Both packages must share a single tsconfig with one common rootDir',
            'shared must be published to a registry so that its types can be installed',
          ], 0, 'A referenced project is consumed through its generated declarations, which is why composite is required and why tsc --build orders the projects by dependency before checking.'),
          q('With verbatimModuleSyntax on, what happens to import { User } from \'./models\' when User is only ever used as a type?', [
            'It is dropped, because the checker sees the binding is unused at runtime',
            'It survives into the output, so a types-only module ends up in the bundle',
            'It fails to compile until the module is changed to use a default export',
            'It is rewritten into a require call in the emitted CommonJS output',
          ], 1, 'verbatimModuleSyntax emits exactly what you wrote, so only an import type statement is erased and a plain import keeps the module alive at runtime, import cycles included.'),
          q('tsc --generateTrace followed by analyze-trace reports a single type alias costing six seconds. What is it usually?', [
            'A barrel file that re-exports several hundred modules at once',
            'A circular import between two files inside the same package',
            'An interface that declares more than a thousand properties',
            'A template literal cross product or a deeply recursive conditional type',
          ], 3, 'Check time concentrates in types that instantiate many times over, so the expensive alias is nearly always a cross product, a deep recursion, or one enormous inferred literal.'),
        ]
      ),
        lesson('Testing Types and Locking Them Down', 13, `
Runtime tests cannot see types. A refactor that loosens a generic helper's return type to \`any\` breaks nothing, passes everything, and quietly disables checking for every caller — exactly the contagion from Chapter 3. Types need their own assertions.

### Type-level assertions

\`\`\`ts
import { expectTypeOf } from 'vitest';

expectTypeOf(first(['a', 'b'])).toEqualTypeOf<string | undefined>();
expectTypeOf(first([1, 2])).toEqualTypeOf<number | undefined>();

expectTypeOf(parseJson('{}')).not.toBeAny();      // the regression guard
expectTypeOf<UserId>().not.toEqualTypeOf<string>(); // the brand still holds
\`\`\`

These compile to nothing and run instantly — the assertion happens when \`tsc\` checks the file, so they only count if type checking is part of CI. \`tsd\` does the same job for published packages, checking the shipped \`.d.ts\` rather than your source.

Two habits matter. Prefer \`toEqualTypeOf\` over \`toMatchTypeOf\`: the second passes when the actual type is merely *assignable*, and \`any\` is assignable to everything, so it waves through the exact regression you are guarding against. And assert \`not.toBeAny()\` explicitly on anything that crosses a boundary.

### Negative tests with ts-expect-error

The strongest guarantee is that some code **must not** compile:

\`\`\`ts
// @ts-expect-error a raw string is not a UserId — the brand must keep holding
loadUser('u_abc123def456');

// @ts-expect-error lessonId is required on this event
emit('lesson:done', { slug: 'ts' });
\`\`\`

If a future change makes either line legal, \`@ts-expect-error\` reports "Unused '@ts-expect-error' directive" and the build fails. That is a real assertion, written in one line, with no test runner involved. Keep these in a \`*.test-d.ts\` file so nobody mistakes them for suppressions.

### Fixtures that break when the model does

\`\`\`ts
export const userFixture = {
  id: 'u_abc123def456',
  name: 'Sara',
  email: 'sara@example.com',
  createdAt: new Date('2024-01-01'),
} as const satisfies User;
\`\`\`

\`as const satisfies\` from Chapter 6 rather than a \`User\` annotation: add a required field to \`User\` and every fixture fails to compile, while \`userFixture.name\` stays the literal \`'Sara'\` so tests can assert against it precisely. Plain \`satisfies\` would still catch the missing field, but \`User['name']\` is \`string\`, so the fixture's values would widen and the literal would be gone. A fixture cast with \`as User\` does the opposite — it goes stale silently and your tests keep passing against a shape production no longer sends.

### Catching the any that tsc allows

\`tsc\` does not complain when an \`any\` flows through your code; it only refuses to invent one. Type-aware linting does:

\`\`\`json
// eslint.config.js rules
{
  "@typescript-eslint/no-unsafe-assignment": "error",
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/no-unsafe-argument": "error",
  "@typescript-eslint/no-explicit-any": "warn"
}
\`\`\`

These need \`projectService: true\` in the parser options because they read real type information, which makes lint slower — worth it for the one rule class that finds the \`JSON.parse\` result spreading through a feature.

### The classic mistake: testing a type with a runtime check

\`\`\`ts
expect(typeof result.id).toBe('string');   // tests the value, not the type
\`\`\`

That assertion passes whether \`result\` is typed \`User\`, \`any\`, or \`unknown\`, so it proves nothing about the contract. The genuine end-to-end guarantee is the one Chapter 5 built: a schema shared between server and client, its type derived with \`z.infer\`, and \`tsc --noEmit\` running on both sides. Rename a field on the server and the client fails to build — a failing pipeline instead of an \`undefined\` in production.
        `,
        [
          q('Why prefer toEqualTypeOf over toMatchTypeOf when the assertion exists to catch a regression to any?', [
            'toMatchTypeOf only passes when the two types are structurally identical',
            'toMatchTypeOf accepts any assignable type, and any is assignable to everything',
            'toEqualTypeOf also runs at runtime, so it can inspect the value itself',
            'toEqualTypeOf reports its failure with a shorter and clearer message',
          ], 1, 'A match assertion succeeds whenever the actual type is merely assignable to the expected one, so a signature that decayed to any sails through the very check meant to catch it.'),
          q('A test fixture is written as const userFixture = { ... } as User. What goes wrong months later?', [
            'The literal values are preserved, so assertions compare against the wrong type',
            'The fixture cannot be exported, because a cast produces a file-local type',
            'Every property becomes optional, so the tests stop checking required fields',
            'The cast hides a field added to User, so the fixture drifts from the model',
          ], 3, 'An assertion tells the checker what to believe rather than verifying it, so a new required field on User leaves the fixture compiling against a shape production no longer sends.'),
          q('A test asserts expect(typeof result.id).toBe(\'string\'). What does that prove about the type of result?', [
            'That result was validated against its schema before the assertion ran',
            'That result.id is declared as string rather than as string | undefined',
            'Nothing, since it passes whether result is typed User, any or unknown',
            'That the compiler kept the narrowing produced by the typeof check',
          ], 2, 'The assertion only observes the runtime value, so a helper whose return type decayed to any still satisfies it and the static contract goes completely untested.'),
        ]
      ),
            lesson('Upgrading TypeScript Without Breaking the Build', 13, `
TypeScript ships a minor release roughly every three months, and most of them add errors to code that compiled last week. That is the deal: better inference finds bugs the old checker missed. Treat a compiler bump like a dependency upgrade with a migration, not like a patch.

### First, make everyone see the same errors

Two engineers stare at the same file. One sees a red squiggle, the other sees nothing, and the lockfile is identical. The editor is checking with its own bundled compiler.

\`\`\`json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
\`\`\`

Commit that file. Until the editor, the terminal and CI all run one copy of \`tsc\`, every argument about whether something is an error is unresolvable. Confirm with \`npx tsc --version\` and \`npm ls typescript\`, which also catches the second copy a stray dependency dragged in.

### Bump on a branch and count before you fix

\`\`\`bash
npm i -D typescript@5.6
npx tsc --noEmit --pretty false 2>&1 | grep -c 'error TS'
# 183

npx tsc --noEmit --pretty false 2>&1 \\
  | grep -oE 'error TS[0-9]+' | sort | uniq -c | sort -rn | head
#  141 error TS2345
#   28 error TS2322
#    9 error TS18048
\`\`\`

One hundred and eighty three errors sounds like a week. Two codes cover 169 of them, and each code is usually one mechanical fix repeated. Look up the codes in the release notes before touching anything: the entry that explains the change often names the exact pattern and the exact replacement.

### Where new errors actually come from

| Source | Symptom | What to do |
|---|---|---|
| Checker improvements | your own source now errors | fix them, they are real |
| \`lib\` files changed | errors in code using DOM or built ins | check the release notes for the lib update |
| A \`@types\` package moved | errors inside \`node_modules\` | pin it, or turn \`skipLibCheck\` back on |
| Two copies of a \`@types\` | one type not assignable to itself | \`npm ls\`, then an \`overrides\` entry |

If \`skipLibCheck\` is on, as it should be, errors from a dependency's declarations are already invisible, so anything you see is either yours or a change in \`lib\`. Turning it off deliberately for one run is a fast way to tell which.

### The upgrade that compiles and still breaks

\`\`\`ts
const grouped = Object.groupBy(orders, o => o.status);
\`\`\`

You raised \`target\` and \`lib\` to \`ES2023\`, the build went green, and production runs Node 18 where \`Object.groupBy\` does not exist. \`lib\` is a promise you make to the checker about the runtime, and nothing verifies it. Set \`lib\` to what your oldest deployment target actually supports, then let the type error tell you the API is off limits. The same applies to \`@types/node\`: install the major that matches the Node you deploy, or the checker will happily offer you APIs that are not there.

### Pin the compiler exactly

\`\`\`json
{ "devDependencies": { "typescript": "5.6.3" } }
\`\`\`

A caret range means a fresh \`npm install\` on a machine without your lockfile can pull 5.7 and produce errors nobody else has. TypeScript does not follow semver in the way a range implies, since a minor release is allowed to reject code that used to compile. Pin it, upgrade it in a pull request with the error count in the description, and let CI prove the diff.

For a published library, go further. Test the shipped declarations against every compiler version you claim to support, because a \`.d.ts\` that uses \`const\` type parameters silently breaks consumers on 4.9. Run your type tests with a matrix:

\`\`\`bash
for v in 4.9 5.0 5.4 5.6; do
  npx -y typescript@$v tsc --noEmit -p tsconfig.types.json || echo "broken on $v"
done
\`\`\`

Ten minutes in CI beats an issue titled "does not compile on our version" and a patch release the same afternoon.
      `,
        [
          q('Two developers see different errors in the same file with an identical lockfile. What is the first thing to check?', [
            'Whether one editor checks with its bundled compiler instead of the workspace copy',
            'Whether one machine has a stale .tsbuildinfo that needs to be cleared',
            'Whether the two are running different Node major versions at runtime',
            'Whether one of them has skipLibCheck disabled in a local tsconfig file',
          ], 0, 'An editor ships its own compiler, so pointing typescript.tsdk at node_modules/typescript/lib is what makes the editor, the terminal and CI agree on which version is reporting.'),
          q('You raise target and lib to ES2023, the build turns green, and the code calls Object.groupBy. What is the risk?', [
            'The emitted output keeps the call but adds a runtime polyfill import for it',
            'lib describes what the checker believes exists, not what your runtime ships',
            'target only controls downlevelling, so the call is compiled away entirely',
            'Object.groupBy is a type-only declaration and never emits a real call',
          ], 1, 'The lib setting is a promise you make to the checker about the environment, so deploying on an older runtime throws at the call site even though nothing failed to compile.'),
          q('After bumping typescript by one minor version, CI reports 183 new errors. What is the useful first move?', [
            'Switch skipLibCheck off so the origin of each new error becomes visible',
            'Revert the bump and wait for the next patch release to fix it upstream',
            'Group the errors by their TS code, since a couple of codes usually dominate',
            'Add @ts-expect-error above each failing line and work through them later',
          ], 2, 'Counting errors by code turns an unreadable list into two or three patterns, and each pattern normally has one mechanical fix that clears the large majority of them.'),
        ]
      ),
      ],
      [
        q('tsc reports that a value of type { status: "refreshing" } is not assignable to type never. Where should you look first?', [
          'At a missing return type annotation on the enclosing function',
          'At an exhaustiveness check whose union gained a variant no branch handles',
          'At a circular import between two modules',
          'At a duplicate copy of a @types package',
        ], 1, 'A value only narrows to never once every known case is handled, so the message means a new union member reached the default branch.'),
        q('What does running tsc --build with project references give a monorepo?', [
          'It type-checks every package in a single pass for consistency',
          'It removes the need for declaration files between packages',
          'It runs the checker in parallel worker threads',
          'It builds projects in dependency order and skips those whose inputs have not changed',
        ], 3, 'Each composite project caches its own .tsbuildinfo and emits .d.ts, so unchanged dependencies are reused instead of rechecked.'),
        q('You put // @ts-expect-error above a call that is supposed to be illegal. What does that assert?', [
          'That the build fails if the line ever starts compiling, so it is a test that the call stays an error',
          'That the error is logged but ignored at runtime',
          'That the line is excluded from the emitted JavaScript',
          'That the compiler retries the line with any as the argument type',
        ], 0, 'An unused @ts-expect-error is itself an error, which turns the directive into an assertion that the code must not type-check.'),
        q('Imports through the @/ alias type-check but fail at runtime with "Cannot find module". Why?', [
          'The alias must be declared in a .d.ts file as well',
          'Path aliases require composite: true on the project',
          'tsconfig paths only inform type resolution and never rewrite the emitted import, so the runtime or bundler needs the same mapping',
          'tsc only applies paths when running in watch mode',
        ], 2, 'TypeScript resolves the alias for checking and emits the specifier unchanged, so Vite, Jest, or Node must be configured with a matching alias.'),
      ]
    ),
      chapter(
      'Where Types Meet Real Data',
      'Making the schema at each boundary the single source of truth, so what the checker believes about incoming data matches what actually arrives.',
      [
      lesson('Parse, Don\'t Validate', 13, `
Two functions with the same job, and only one of them can be wrong.

\`\`\`ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}

function parseUser(x: unknown): User {
  // returns a User, or throws
}
\`\`\`

\`isUser\` compiles even though it never checks \`email\`, never checks that \`id\` is a number, and never looks at anything you add to \`User\` next month. The \`x is User\` clause is a claim you make by hand and the checker accepts it without argument. Chapter 3 showed how predicates narrow. Here is the part that bites: a predicate is the one place where lying to the compiler costs nothing, and the lie outlives every refactor. Add \`stripeCustomerId: string\` to \`User\` and \`isUser\` still returns \`true\` for objects that do not have it. Zero errors, anywhere.

### Validation throws information away

A validator answers yes or no. Everything it learned while answering, that \`id\` was a number, that \`roles\` was a non empty array, that \`createdAt\` parsed as a date, is discarded the moment it returns a boolean. So the caller checks, and the code downstream of the caller either checks again or trusts.

\`\`\`ts
if (isUser(payload)) {
  await sendReceipt(payload.email.toLowerCase());  // undefined.toLowerCase()
}
\`\`\`

A parser returns what it learned:

\`\`\`ts
function parseUser(x: unknown): User {
  if (typeof x !== 'object' || x === null) throw new Error('not an object');
  const o = x as Record<string, unknown>;
  if (typeof o.id !== 'number') throw new Error('id must be a number');
  if (typeof o.email !== 'string') throw new Error('email must be a string');
  return { id: o.id, email: o.email };
}
\`\`\`

The \`User\` that comes out is the only \`User\` in the program, and it was built field by field from checked values. There is no path where a caller holds a \`User\` that nothing ever inspected.

### Push the parse to the edge

Parse once, at the boundary, as early as data enters the process. Inside that boundary nothing takes \`unknown\`.

Broken:

\`\`\`ts
async function getOrder(id: string): Promise<Order> {
  const res = await fetch(\`/api/orders/\${id}\`);
  return res.json();          // Promise<any>, so this compiles
}
\`\`\`

\`res.json()\` is \`any\`, \`any\` is assignable to \`Order\`, and the build stays green while the server sends \`{ order_id: 'A-1' }\`. Fixed:

\`\`\`ts
async function getOrder(id: string): Promise<Order> {
  const res = await fetch(\`/api/orders/\${id}\`);
  return parseOrder(await res.json());
}
\`\`\`

One line, and every \`Order\` in the application becomes a fact instead of a wish.

### Parse into a narrower type than you were given

The real payoff is that a parser can return something its input could not. Feed it a \`string\` and get back a type only a successful parse can produce.

| Input | Parser returns | What it removes |
|---|---|---|
| \`string\` | \`Email\` (branded) | "has this been validated yet" |
| \`unknown[]\` | \`[Item, ...Item[]]\` | the empty array case |
| \`string\` | \`Date\` | reparsing and format guessing |
| \`Record<string, unknown>\` | \`Order\` | field by field defensiveness |

The non empty tuple is the clearest example. Under \`noUncheckedIndexedAccess\`, \`orders[0]\` on \`Order[]\` is \`Order | undefined\`, so every caller writes a guard. Parse into \`[Order, ...Order[]]\` and \`orders[0]\` is \`Order\`, with the check done once where the data arrived.

### Throwing is fine at the edge

\`parseUser\` throws, which is acceptable in a request handler that already has an error boundary around it. Schema libraries also offer a non throwing form returning a success flag next to the value, and that is the shape you want when the caller has to react to bad input rather than give up. Chapter 10 goes into modelling failure as data properly. The point that survives either choice is the same: return a value that carries proof, not a boolean that carries none.
      `,
        [
          q('You add a required `stripeCustomerId` field to `User`. The hand written predicate `isUser(x): x is User` still only checks that `x` is an object with an `id`. What does the compiler report?', [
            'An error in the predicate, since its checks no longer cover the type',
            'An error at each call site that reads the newly added property',
            'Nothing, because the predicate\'s claim is trusted rather than verified',
            'A strict mode warning that the narrowing is now incomplete',
          ], 2, 'A type predicate\'s `x is User` clause is an assertion the author makes, and TypeScript accepts it without checking that the function body justifies it, so widening the type leaves the predicate silently wrong.'),
          q('Why does `return res.json()` compile inside a function declared as `Promise<Order>`?', [
            '`res.json()` resolves to `any`, and `any` is assignable to every type',
            '`res.json()` resolves to `unknown`, which the return type then narrows',
            'The compiler checks the response body against `Order` during the build',
            'Fetch responses are structurally compatible with any object type',
          ], 0, '`Response.json()` is typed as `Promise<any>`, and because `any` is assignable to every type the checker raises nothing even when the server sends a completely different shape.'),
          q('A parser returns `[Order, ...Order[]]` rather than `Order[]`. What does that buy every caller downstream?', [
            'Faster indexing, because a tuple is laid out differently in memory',
            'Automatic ordering of the orders by their position in the tuple',
            'A runtime exception whenever the array turns out to be empty',
            '`orders[0]` is an `Order`, so the empty case is settled once at the edge',
          ], 3, 'A non empty tuple type encodes the guarantee that the first element exists, so `orders[0]` is no longer `Order | undefined` and callers stop repeating a check the parser already did.'),
        ]
      ),
      lesson('Schemas as the Single Source of Truth', 13, `
The bug is not in either definition. It is in the gap between them.

\`\`\`ts
// src/types/user.ts
export interface User { id: number; email: string; plan: 'free' | 'pro' }

// src/validation/user.ts
export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  plan: z.enum(['free', 'pro', 'team']),   // shipped last Tuesday
});
\`\`\`

Someone added the \`team\` plan to the schema so the API would stop rejecting signups. Nobody touched the interface. The parser now happily produces \`{ plan: 'team' }\` and hands it to code the compiler believes can only ever see \`free\` or \`pro\`, so the \`switch\` that was exhaustive yesterday falls through and returns \`undefined\`. Two sources of truth is one too many.

### Let the schema be the type

\`\`\`ts
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  plan: z.enum(['free', 'pro', 'team']),
});

export type User = z.infer<typeof userSchema>;
// { id: number; email: string; plan: 'free' | 'pro' | 'team' }
\`\`\`

One definition, read two ways. The runtime check and the static type cannot disagree, because a change to one is a change to both by construction. Adding \`team\` to the enum immediately breaks the non exhaustive switch, which is exactly the report you wanted.

### The gotcha: input and output are different types

Defaults and transforms make a schema a function rather than a shape, and a function has two ends.

\`\`\`ts
const settings = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  retries: z.string().transform(Number),
});

type In  = z.input<typeof settings>;   // { theme?: 'light'|'dark'; retries: string }
type Out = z.output<typeof settings>;  // { theme: 'light'|'dark'; retries: number }
\`\`\`

\`z.infer\` is \`z.output\`. Use it for what your application handles after parsing. Use \`z.input\` for what a caller is allowed to send, which is what belongs in a form component's props or a client SDK signature. Wire the wrong one into an SDK and callers are told they must supply \`theme\`, which is the exact thing the default existed to avoid.

### When the type has to lead

Sometimes the type is not yours: generated from OpenAPI, or owned by a library. Invert the check so the schema is proven to cover it.

\`\`\`ts
import type { components } from './api-types';
type Invoice = components['schemas']['Invoice'];

const invoiceSchema = z.object({
  id: z.string(),
  amountCents: z.number(),
  status: z.enum(['draft', 'open', 'paid']),
}) satisfies z.ZodType<Invoice>;
\`\`\`

Regenerate the API types after someone upstream adds a \`status\` value, and this line fails to compile. Chapter 6 introduced \`satisfies\`; this is where it earns its keep in a real build.

### Compose schemas the way you compose types

| Type operation | Schema operation |
|---|---|
| \`Omit<User, 'id'>\` | \`userSchema.omit({ id: true })\` |
| \`Pick<User, 'email'>\` | \`userSchema.pick({ email: true })\` |
| \`Partial<User>\` | \`userSchema.partial()\` |
| \`A & B\` | \`a.merge(b)\` |
| \`A \\| B\` | \`z.union([a, b])\` |

Derive the create payload from the read model rather than hand writing a second schema that will drift for exactly the reason the interface did.

### What it costs

Schemas are runtime values, so they ship. A large tree of them adds tens of kilobytes to a browser bundle and none of it tree shakes away, because you genuinely use it. Validation is real work too: walking a 5000 row response field by field is measurable, and doing it inside a render is how a list gets slow. Two mitigations that actually help. Keep schema modules out of files the client imports for types only, using \`import type\` so the value side never gets pulled in. And for a huge payload from a service you own, validate the envelope and a sample rather than every row. Lighter libraries exist, and the choice between them comes down to bundle size against how much you value a familiar API.
      `,
        [
          q('A settings schema declares `theme` with `.default(\'light\')`. Which type belongs in the signature a client SDK exposes to callers?', [
            '`z.output`, since that is the shape the application handles later',
            '`z.input`, since a caller is allowed to omit a field that has a default',
            '`z.infer`, which resolves to the same thing as `z.input` in this case',
            'Either of them, because a default does not change the inferred property',
          ], 1, 'Defaults and transforms give a schema a different input type from its output type, and `z.input` is the one that marks defaulted fields optional, which is what a caller sending data needs.'),
          q('The `Invoice` type is generated from an OpenAPI document and must not be edited. How do you keep a hand written zod schema honest about it?', [
            'Cast the parsed value with `as Invoice` wherever the schema is used',
            'Derive the type with `z.infer` so it shadows the generated version',
            'Compare both shapes in a unit test that runs ahead of the build',
            'Declare the schema with `satisfies z.ZodType<Invoice>`',
          ], 3, '`satisfies` checks the schema against the generated type without replacing the schema\'s own inference, so a regenerated `Invoice` that no longer matches turns into a compile error on that line.'),
          q('Your create endpoint accepts a user without the server generated `id`. What stops that payload schema drifting from the read schema?', [
            'Derive it with `userSchema.omit({ id: true })` from the read schema',
            'Write a second schema and add a comment pointing at the first one',
            'Type it as `Omit<User, \'id\'>` and validate with the read schema',
            'Mark `id` optional on the read schema so one schema serves both',
          ], 0, 'Deriving the payload schema with `omit` means there is still only one definition of the fields, so any change to the read schema propagates to the create schema automatically.'),
        ]
      ),
      lesson('Typed Configuration, Environment, and Feature Flags', 13, `
The outage started with a config change that did exactly what it said.

\`\`\`bash
MAINTENANCE_MODE=false
\`\`\`

\`\`\`ts
if (process.env.MAINTENANCE_MODE) {
  return res.status(503).send('Back soon');
}
\`\`\`

Every request got a 503 for nineteen minutes. \`process.env.MAINTENANCE_MODE\` is the string \`"false"\`, and every non empty string is truthy. The type of that expression is \`string | undefined\`, which is entirely correct, and the code compiles, which is the problem. The type system told the truth and the code ignored it.

### The declaration that is a lie

The popular fix makes things worse:

\`\`\`ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      MAINTENANCE_MODE: string;
    }
  }
}
\`\`\`

Now \`process.env.DATABASE_URL\` is \`string\`, \`undefined\` has vanished from the type, and nothing verifies it. Deploy without that variable set and \`undefined\` flows into a connection string typed \`string\`, producing a driver error five layers down that mentions neither the variable nor the deploy. Ambient declarations are assertions. This one is \`as string\` applied across your entire codebase.

### Parse the environment once, at boot

\`\`\`ts
// src/config.ts
const boolish = z.enum(['true', 'false']).transform(v => v === 'true');

const schema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MAINTENANCE_MODE: boolish.default('false'),
  STRIPE_KEY: z.string().startsWith('sk_'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = Object.freeze(parsed.data);
\`\`\`

\`config.MAINTENANCE_MODE\` is a real \`boolean\` and \`config.PORT\` is a real \`number\`. Import \`config\`, never \`process.env\`, and add a lint rule banning \`process.env\` outside this one file so the convention survives the next ten hires.

Two details matter more than they look. Exit on failure rather than falling back to a default, because a service running against the wrong database is worse than a service that refuses to start. And report every bad variable at once: \`flatten()\` gives you the full list, so a broken deploy takes one round trip to fix instead of five.

### Empty string is not missing

\`\`\`bash
STRIPE_KEY=
\`\`\`

That sets the variable to \`""\`. \`z.string()\` accepts it, \`??\` will not replace it, and only \`||\` catches it. If a blank value in a \`.env\` file should mean absent, say so:

\`\`\`ts
const required = z.string().min(1);
\`\`\`

### Client bundles are a different problem

Bundlers do a textual replacement of \`process.env.NODE_ENV\` before your code ever runs. Destructure it and the replacement has nothing to match:

\`\`\`ts
const { NODE_ENV } = process.env;   // no replacement, undefined in the browser
\`\`\`

Frameworks expose only prefixed variables to client code, \`NEXT_PUBLIC_\` or \`VITE_\`, precisely so a secret cannot leak into a bundle by accident. Keep two schemas, one for the server and one for the client, and never let a client reachable file import the server schema.

### Flags the compiler tracks

\`\`\`ts
const FLAGS = {
  newCheckout: false,
  bulkExport: true,
} as const;

export type FlagName = keyof typeof FLAGS;

export function flag(name: FlagName): boolean {
  return remote[name] ?? FLAGS[name];
}
\`\`\`

\`flag('newCheckut')\` is now a compile error rather than a silent \`false\`, which is the typo that costs an afternoon of debugging a feature that was on the whole time. Delete \`bulkExport\` from the object and every call site lights up, so flag cleanup becomes mechanical instead of archaeological. Remote flag payloads arrive as JSON, so parse them at that boundary too. A flag service returning \`"true"\` for a boolean flag is the outage you opened with, wearing a different hat.
      `,
        [
          q('`MAINTENANCE_MODE=false` is set, yet `if (process.env.MAINTENANCE_MODE)` takes the maintenance branch. Why did the type checker not catch it?', [
            'The property is typed `boolean`, so the checker sees a valid test',
            'Strict mode skips truthiness checks on values read from the environment',
            'The type is `string | undefined`, and the string `"false"` is truthy',
            'The env object is typed `any`, so nothing is checked on that line',
          ], 2, 'Environment variables are always strings, so the type is accurate at `string | undefined` and the truthiness test is legal TypeScript even though every non empty string, including `"false"`, is truthy.'),
          q('What is genuinely wrong with declaring `DATABASE_URL: string` on the `NodeJS.ProcessEnv` interface?', [
            'It applies only in files that import the declaration file directly',
            'It asserts the variable exists while nothing at all verifies that',
            'It clashes with the built in index signature and fails to compile',
            'It forces every other variable on that object to become required',
          ], 1, 'An ambient declaration is an assertion rather than a check, so removing `undefined` from the type just hides a missing variable until it surfaces deep inside a driver or a query.'),
          q('Why does `const { NODE_ENV } = process.env` behave differently from `process.env.NODE_ENV` in a browser bundle?', [
            'Destructuring copies the value before the environment has been loaded',
            'Bundlers remove the entire `process` object from client side code',
            'Only variables carrying a framework prefix survive being destructured',
            'Bundlers substitute the literal text `process.env.NODE_ENV`, which is now absent',
          ], 3, 'The replacement is a textual substitution performed on the exact member expression, so destructuring produces code the bundler never rewrites and the value is undefined at runtime.'),
        ]
      ),
      lesson('Generated Types from OpenAPI, GraphQL, and SQL', 13, `
A pull request touching one generated file, 400 lines changed, and exactly one of them mattered:

\`\`\`diff
-  status: 'pending' | 'shipped'
+  status: 'pending' | 'shipped' | 'returned'
\`\`\`

Nobody wrote that by hand. The backend team added a status, CI regenerated the types from the OpenAPI document, and eleven \`switch\` statements went red in the same commit. That is codegen doing its job: turning a change in someone else's service into a compile error in yours, at the moment it happens instead of the moment a customer returns a parcel.

### What each generator gives you

| Source | Tool | Produces |
|---|---|---|
| OpenAPI document | \`openapi-typescript\` | \`paths\` and \`components['schemas']\` |
| GraphQL schema plus your documents | \`graphql-codegen\` | a type per operation and its variables |
| Database schema | \`kysely-codegen\`, \`prisma\` | a row type per table |

\`\`\`ts
import type { paths } from './api.gen';

type ListOrders = paths['/orders']['get'];
type Query = ListOrders['parameters']['query'];
type Body  = ListOrders['responses']['200']['content']['application/json'];
\`\`\`

Indexing into a generated tree looks ugly for about a day. Then you write four aliases in one file and never touch the raw shape again.

### Generated types are a claim, not a check

Keep this in your head. \`api.gen.ts\` says the server returns \`{ id: string }\`. It contains no code. Nothing inspects the response. If the deployed service is two versions behind the document, or a proxy hands back an HTML error page with a 200 status, your typed value is wrong by the exact mechanism from the start of this chapter.

Generation and parsing are not alternatives, they compose. Generate the type from the contract, build the schema against it, and let \`satisfies\` prove they agree. For an internal service you own on a network you control, deliberately trusting the generated type is a defensible call. Make it a call, not an accident.

### Make drift fail the build

\`\`\`yaml
- run: npm run codegen
- run: git diff --exit-code -- src/api.gen.ts src/db.gen.ts
\`\`\`

Check generated files into the repository. Reviewers see the diff, \`git blame\` keeps working, and a fresh clone builds without a database or a running API. The CI step above is the other half. It fails when someone hand edits a generated file, and it fails when the upstream schema moved and nobody regenerated.

### Where each one surprises you

**GraphQL nullability.** A GraphQL field is nullable unless the schema marks it with \`!\`, so schema derived types come out as \`Maybe<T>\` everywhere and your code fills with \`?.\`. Generate types for your operations rather than the schema: an operation type describes the fields you actually selected, and a fragment type travels with the component that uses it.

**SQL joins.** Most database generators type a column from the table definition, so \`users.email\` is \`string\`. Write a left join and the row can have no user at all:

\`\`\`sql
SELECT o.id, u.email FROM orders o LEFT JOIN users u ON u.id = o.user_id;
\`\`\`

\`email\` is typed \`string\` and arrives as \`null\`. Builders that type the query rather than the table, Kysely among them, get this right. Generators that hand you table rows cannot. Watch \`count(*)\` too, which many drivers deliver as a string because a bigint does not fit safely in a JavaScript number.

**Enums that are not.** A Postgres \`text\` column with a check constraint generates as plain \`string\`, losing the four values you actually allow. Narrow it in a wrapper module, never by editing the generated file, which the next run silently overwrites.
      `,
        [
          q('A left join returns rows where `users.email` is null, but the generated row type says `string`. What produces that mismatch?', [
            'The generator types the column from the table, not from the query',
            'The join discards the nullability marker declared on that column',
            'Generated types always widen nullable columns to their base type',
            'The driver converts nulls into empty strings before the row is typed',
          ], 0, 'Table based generators describe each column as the schema declares it, and a left join can produce a row with no matching record, so the column arrives null despite a non nullable type.'),
          q('Why pair `npm run codegen` with `git diff --exit-code` as two CI steps?', [
            'It regenerates the types so the build no longer needs a live API',
            'It proves the generated output still compiles under the current tsconfig',
            'It fails when someone hand edits generated files or skips regenerating',
            'It keeps the generated file out of the diff reviewers have to read',
          ], 2, 'Regenerating and then requiring an empty diff makes CI fail whenever the committed output disagrees with the current upstream schema or with a manual edit someone made.'),
          q('Your generated OpenAPI types promise the endpoint returns `{ id: string }`. What still has to happen when the response arrives?', [
            'Nothing, because the generator emits a runtime check beside the type',
            'A parse, because the generated type is a claim with no code behind it',
            'A cast, so the response value lines up with the generated declaration',
            'A retry, in case the deployed service lags behind the document',
          ], 1, 'Generated types are erased like any other type and never inspect a payload, so a stale deployment or an error page returned with a 200 status still needs a runtime parse to be caught.'),
        ]
      ),
      ],
      [
      q('Two boundary helpers: one returns `true` for valid input, the other returns the value it constructed. Why does only the second keep its guarantee?', [
        'It runs earlier, so fewer callers ever see the untrusted input',
        'It throws, and an exception is harder for a caller to ignore',
        'It is generated, so it stays aligned with the upstream contract',
        'Its return type can only be produced by a successful check',
      ], 3, 'A parser hands back a value whose type is evidence that the check ran, while a boolean discards everything the check learned and leaves the caller relying on a claim.'),
      q('A team maintains `interface User` and `userSchema` as two separate definitions of the same data. What is the predictable failure?', [
        'The schema slows down because it duplicates the interface checks',
        'One gets edited, the other does not, and the checker trusts the stale one',
        'The interface stops narrowing once the schema starts applying defaults',
        'The compiler reports a conflict the moment the two shapes disagree',
      ], 1, 'Nothing links the two definitions, so a change to one leaves the other stale, and the compiler keeps enforcing the outdated shape while the parser produces the new one.'),
      q('Your service starts up and `DATABASE_URL` is missing from the environment. What should the config module do?', [
        'Report every invalid variable and exit before the server starts listening',
        'Fall back to a local default so the deployment can still come up',
        'Log a warning and let the first query surface the real problem',
        'Retry reading the environment a few times before giving up',
      ], 0, 'Failing fast at boot with the complete list of problems prevents a service from running against the wrong backend and turns a broken deploy into one fix rather than several.'),
      q('Which combination makes an upstream schema change break your build and a bad response fail loudly at runtime?', [
        'Hand written types plus a runtime schema derived from those types',
        'Generated types plus an ambient declaration describing the response',
        'Generated types plus a schema checked against them with `satisfies`',
        'A schema on its own, with `z.infer` deriving every type in the app',
      ], 2, 'Codegen turns a contract change into a compile error while the schema does the runtime parsing, and `satisfies` is what keeps the two from drifting apart.'),
      ]
    ),
    chapter(
      'Why the Checker Says Yes',
      'The assignability rules behind every error you get, every error you do not get, and the handful of places TypeScript is unsound on purpose.',
      [
      lesson('How Assignability Actually Works', 13, `
Every type error you have ever seen is one question answered no: is this source type assignable to that target type? There is a single relation underneath the entire checker, and once you can evaluate it in your head, errors stop being mysterious and start being predictable.

Start with a result that startles anyone arriving from Java or C#.

\`\`\`ts
class Meters  { constructor(public value: number) {} }
class Seconds { constructor(public value: number) {} }

function wait(t: Seconds) { /* ... */ }

wait(new Meters(30));   // compiles happily
\`\`\`

No \`implements\`, no shared base class, no relationship declared anywhere. The checker walked the members of \`Seconds\`, found \`value: number\`, found the same on \`Meters\`, and said yes.

### The rule in one sentence

Source \`S\` is assignable to target \`T\` when, for every member \`T\` requires, \`S\` has a member assignable to it. Names of the types are never consulted. Declaration order is never consulted. Extra members on \`S\` are ignored, with one exception covered in the next topic.

\`\`\`ts
type Shipment = { id: string; weightKg: number };

const row = {
  id: "SHP-4192",
  weightKg: 12.4,
  warehouse: "LHR-3",
  scannedAt: new Date("2026-03-11"),
};

function label(s: Shipment) { return \`\${s.id} (\${s.weightKg}kg)\`; }

label(row);   // "SHP-4192 (12.4kg)"
\`\`\`

\`row\` carries four properties, \`Shipment\` asks for two. Assignable. The extras are simply invisible inside \`label\`, which is exactly the behaviour you want when a database row flows into a function that only cares about part of it.

### Unions and intersections run in opposite directions

This is where people guess wrong, so learn the four cases as a block.

| Where the compound type sits | What has to be true |
| --- | --- |
| Source is a union | every member is assignable to the target |
| Target is a union | the source is assignable to at least one member |
| Source is an intersection | at least one member satisfies the target |
| Target is an intersection | the source satisfies every member |

The first row is the one that produces real errors:

\`\`\`ts
type Status = "queued" | "sent" | "failed";
declare function retry(s: "queued" | "failed"): void;

let current: Status = loadStatus();
retry(current);
// Argument of type 'Status' is not assignable to parameter of
// type '"queued" | "failed"'.
//   Type '"sent"' is not assignable to type '"queued" | "failed"'.
\`\`\`

Read the indented second line. The checker is telling you precisely which member of the source union broke the relation, which turns a vague complaint into a one line fix.

### The top, the bottom, and the escape hatch

\`unknown\` is the top type: everything is assignable to it, and it is assignable to nothing until you narrow. \`never\` is the bottom: it is assignable to every type, and nothing except \`never\` is assignable to it. Those two behave like a proper lattice.

\`any\` does not. It is assignable to everything and everything is assignable to it, in both directions at once, which is why a single untyped value at a boundary quietly switches checking off for everything downstream of it.

\`\`\`ts
const total: number = JSON.parse(body);   // no error, JSON.parse returns any
total.toFixed(2);                          // TypeError if body was "[]"
\`\`\`

### Making the checker nominal on purpose

Because only shape matters, \`Meters\` and \`Seconds\` stay interchangeable no matter how carefully you name them. A private field fixes it, and it has to sit on the target:

\`\`\`ts
class Seconds {
  #unit!: void;
  constructor(public value: number) {}
}

wait(new Meters(30));
// Property '#unit' is missing in type 'Meters' but required in type 'Seconds'.
\`\`\`

A private or \`#\`-prefixed member is tied to the declaration that introduced it, so only instances of that exact class satisfy it. Two classes with identical private field names are still incompatible. That is the one corner of the language where TypeScript is genuinely nominal rather than structural.

So when an error surprises you, walk the members from the target side and find the one that fails. When a missing error surprises you, ask which extra member you assumed the checker was policing, and whether an \`any\` upstream already ended the conversation.
      `,
        [
          q('class Meters and class Seconds each declare a single public value of type number. Passing a Meters where a Seconds is expected compiles. Why?', [
            'Both classes extend Object, so they share a common base type',
            'TypeScript compares class types by structure, and the members match',
            'Class types are erased before checking, so no comparison happens',
            'The checker compares class names only when strict mode is enabled',
          ], 1, 'Assignability in TypeScript is structural, so a class type is nothing more than the shape of its members; adding a private or hash prefixed field to Seconds would make the two genuinely distinct.'),
          q('A value typed "queued" | "sent" | "failed" is passed to a parameter typed "queued" | "failed", and the checker rejects it. Which rule is being applied?', [
            'A source union is assignable only if every member is assignable to the target',
            'A source union is assignable as soon as one member matches the target type',
            'Unions are compared in declaration order, and the extra member comes last',
            'Union types are nominal, so only an identical union is ever accepted here',
          ], 0, 'When the source is a union, every one of its members has to be assignable to the target, and the error text names the member that failed, in this case the literal type sent.'),
          q('Why does const total: number = JSON.parse(body) compile even when body holds the text "[]"?', [
            'JSON.parse returns unknown, which the checker widens to number here',
            'The checker evaluates the call and finds a numeric result at compile time',
            'Assignments whose right side is a function call skip the assignability check',
            'JSON.parse returns any, and any is assignable to every type in both directions',
          ], 3, 'any sits outside the normal assignability lattice and relates to every type in both directions, so one untyped value at a boundary silently switches checking off for everything downstream.'),
        ]
      ),
      lesson('Freshness, Widening, and Excess Property Checks', 13, `
Here is a bug report that wastes an afternoon roughly once a quarter. Same typo, same target type, one of them errors:

\`\`\`ts
type RetryOptions = { retries?: number; timeoutMs?: number };
declare function send(url: string, opts: RetryOptions): Promise<void>;

send("/v1/orders", { retires: 3 });
// Object literal may only specify known properties, and 'retires' does not
// exist in type 'RetryOptions'. Did you mean to write 'retries'?

const opts = { retires: 3 };
send("/v1/orders", opts);          // silence
\`\`\`

Neither call retries anything. Only one of them tells you.

### Freshness is what makes the check run

An object literal is *fresh* from the moment you write it until it lands somewhere with a declared type. Only fresh literals get excess property checking. Bind that literal to \`const opts\` with no annotation and its type becomes the ordinary type \`{ retires: number }\`, which has lost its freshness forever.

And \`{ retires: number }\` genuinely is assignable to \`RetryOptions\`. Both target properties are optional, so nothing is required, and extra members are ignored by the normal rule. The literal was always legal. Excess property checking is not a soundness rule at all, it is a typo detector bolted on top, and it fires only where a typo is likely.

Three ways the check behaves:

| What you write | Checked for excess keys |
| --- | --- |
| \`send(url, { retires: 3 })\` | yes, the literal is fresh |
| \`const o = { retires: 3 }; send(url, o)\` | no |
| \`const o: RetryOptions = { retires: 3 }\` | yes, the annotation restores it |

That third row is the habit worth building. Annotate the variable and you get the check back at the place you declared the value, which is also where the fix belongs.

### Widening loses information in the other direction

\`\`\`ts
const method = "POST";   // type is "POST"
let   verb   = "POST";   // type is string
\`\`\`

A \`const\` binding to a string, number or boolean literal keeps the literal type, because the value can never change. A \`let\` binding widens, because it can. Properties inside an object literal are mutable, so they widen too:

\`\`\`ts
const req = { method: "POST", retries: 3 };
// inferred: { method: string; retries: number }

declare function request(r: { method: "GET" | "POST"; retries: number }): void;

request(req);
// Type 'string' is not assignable to type '"GET" | "POST"'.

request({ method: "POST", retries: 3 });   // compiles
\`\`\`

The inline version works because the parameter supplies a contextual type that keeps \`"POST"\` narrow. Extract the object to a variable and that context is gone before the checker ever reaches the call. Add \`as const\`, annotate the variable, or reach for \`satisfies\` from chapter 6, and the literal survives.

The array version of this catches people constantly:

\`\`\`ts
const routes = [
  { path: "/orders", method: "GET" },
  { path: "/orders", method: "POST" },
];
// { path: string; method: string }[]

registerRoutes(routes);   // method: string is not assignable to HttpMethod
\`\`\`

### The widening rule nobody expects

\`\`\`ts
let cursor = null;
cursor = 42;
cursor = { anything: true };   // all fine, forever
\`\`\`

Under \`strict\`, \`const cursor = null\` has type \`null\`. A \`let\` initialised to \`null\` or \`undefined\` widens all the way to \`any\`, so every later assignment passes and every later read is unchecked. Write \`let cursor: string | null = null\` instead. It is two words and it closes a hole that produces no squiggle at all.

### Reading the symptom

Both behaviours are about literals, and they present as mirror images.

The error appears only when you inline the value: that is freshness, and the extra key is real. Go fix the typo.

The error appears only when you extract the value into a variable: that is widening, and the literal type was thrown away. Annotate the variable or freeze it with \`as const\`.

One habit handles both. Give the variable the type you mean, at the point you declare it, rather than hoping the call site downstream still remembers what you meant.
      `,
        [
          q('send(url, { retires: 3 }) reports the misspelled key, but binding the same literal to const opts first and calling send(url, opts) reports nothing. What explains the difference?', [
            'The const declaration gives opts a widened type that drops the unknown key',
            'Excess property checks run on function arguments and never on declarations',
            'Excess property checks apply only to fresh object literals, and opts is not fresh',
            'The checker treats an unannotated const binding as an assertion onto the parameter',
          ], 2, 'A literal is fresh only until it lands somewhere with a declared type, and excess property checking runs on fresh literals alone, which is why binding it to a variable first hides the typo.'),
          q('const method = "POST" passed to a parameter typed { method: "GET" | "POST" } compiles, but changing const to let makes the same code fail. Why?', [
            'let widens the literal type to string, which is not assignable to the union',
            'let bindings are deliberately excluded from excess property checking',
            'const bindings are compared nominally, so the literal type survives the call',
            'let makes the property optional, and the union does not accept undefined',
          ], 0, 'A const binding to a string literal keeps the literal type because the value can never change, while a let binding widens to string, and string is not assignable to a union of two specific literals.'),
          q('Which change stops TypeScript reporting an excess property on an inline object literal, without removing the extra key from the literal?', [
            'Marking every property on the target type as readonly',
            'Adding a compatible index signature to the target type',
            'Enabling exactOptionalPropertyTypes in the tsconfig file',
            'Declaring the target with interface rather than a type alias',
          ], 1, 'An index signature on the target says extra keys are expected, so the checker stops treating an unrecognised property as a likely typo and the literal is accepted as written.'),
        ]
      ),
      lesson('Variance and Function Parameter Bivariance', 13, `
Strict mode on, no \`any\`, no assertions, no non null operators. This program type checks and throws:

\`\`\`ts
class Animal { constructor(public name: string) {} }
class Dog extends Animal { fetchBall() {} }
class Cat extends Animal { meow() {} }

const dogs: Dog[] = [new Dog("Rex")];
const animals: Animal[] = dogs;   // allowed
animals.push(new Cat("Mia"));     // allowed

dogs[1].fetchBall();              // TypeError: dogs[1].fetchBall is not a function
\`\`\`

\`dogs\` and \`animals\` are the same array object. TypeScript allowed the widening assignment on purpose, and everything after it followed the rules.

### Three directions a type constructor can go

Variance describes what happens to assignability when you wrap a type. If \`Dog\` is assignable to \`Animal\`, then:

| Position | Variance | What it means |
| --- | --- | --- |
| Return type | covariant | a function returning \`Dog\` fits where one returning \`Animal\` is wanted |
| Function type parameter | contravariant | a handler taking \`Animal\` fits where one taking \`Dog\` is wanted |
| Method parameter | bivariant | both directions are accepted |
| \`readonly\` property | covariant, and sound | nothing can write, so nothing can break |
| Mutable property | covariant, and unsound | the array above |

Contravariance is the one that reads backwards the first few times. A handler that accepts any \`Event\` can stand in for one that accepts a \`MouseEvent\`, because it will only ever be handed mouse events and it already copes with less specific input.

\`\`\`ts
type Handler<E> = (event: E) => void;

const logAny:   Handler<Event>      = e => console.log(e.type);
const logClick: Handler<MouseEvent> = e => console.log(e.clientX);

declare function onClick(h: Handler<MouseEvent>): void;
declare function onAny(h: Handler<Event>): void;

onClick(logAny);    // fine, it receives MouseEvents and only reads .type
onAny(logClick);    // Types of parameters 'event' and 'event' are incompatible.
                    //   Type 'Event' is not assignable to type 'MouseEvent'.
\`\`\`

The second call is not pedantry. \`onAny\` may hand the handler a \`KeyboardEvent\`, and \`logClick\` reads \`.clientX\`, which is \`undefined\`. The contravariance check exists to stop exactly that call, and it only runs because \`strictFunctionTypes\` is on.

### The loophole is one keystroke wide

\`\`\`ts
declare let a: { handle(e: Event): void };        // method syntax
declare let b: { handle(e: MouseEvent): void };
a = b;   // compiles

declare let c: { handle: (e: Event) => void };    // property syntax
declare let d: { handle: (e: MouseEvent) => void };
c = d;   // Type '(e: MouseEvent) => void' is not assignable ...
\`\`\`

Identical shapes, identical risk, different verdicts. \`strictFunctionTypes\` deliberately exempts members written with method syntax, because \`Array<T>.push\`, \`Promise.then\` and most of \`lib.dom.d.ts\` are declared that way and would stop working overnight if methods were checked strictly.

Practical rule for code you own: declare callbacks and handler slots with property syntax, \`onDone: (r: Result) => void\`, and you get the strict check. Keep method syntax for members that really are methods, or where you are modelling an existing JavaScript API whose looseness you have to reproduce.

### Say what you mean with in and out

Since TypeScript 4.7 you can annotate variance yourself:

\`\`\`ts
interface Producer<out T> { get(): T }
interface Consumer<in T>  { accept: (value: T) => void }
\`\`\`

Two things happen. The checker verifies the annotation is actually true, so a \`Producer\` that quietly takes a \`T\` parameter fails at its own declaration instead of at some confusing call site three packages away. And the checker can then compare \`Producer<Order>\` against \`Producer<Line>\` by comparing \`Order\` to \`Line\` alone, skipping the full structural walk. On deep generic hierarchies that is a measurable cut in check time.

### The fix you will actually use

Most array covariance bugs come from functions that never intended to mutate:

\`\`\`ts
function totalWeight(items: readonly Shipment[]): number {
  return items.reduce((sum, i) => sum + i.weightKg, 0);
}
\`\`\`

\`readonly Shipment[]\` has no \`push\`, no \`splice\`, no index assignment. Covariance on a read only container is sound, so passing a narrower array is safe and the compiler can prove it. Take \`readonly T[]\` in every parameter that only reads, and a whole category of aliasing bug stops being possible.
      `,
        [
          q('Under strictFunctionTypes, passing a handler typed (e: MouseEvent) => void to a parameter typed (e: Event) => void is rejected. What is the real risk being prevented?', [
            'Function types are compared by parameter name as well as parameter type',
            'MouseEvent declares more properties, so it cannot be assignable to Event',
            'strictFunctionTypes makes every parameter position invariant by default',
            'The caller could invoke the handler with an Event that is not a MouseEvent',
          ], 3, 'A function taking Event may be called with a KeyboardEvent, and the handler reading clientX would find undefined, so contravariance on parameters is the check that stops the call.'),
          q('You rewrite an interface member from handle(e: MouseEvent): void to handle: (e: MouseEvent) => void, and assignments that used to compile now fail. What changed?', [
            'Property syntax makes the member readonly, so overriding it is rejected',
            'Property syntax drops the implicit this parameter from the signature',
            'Method syntax is checked bivariantly, property syntax contravariantly',
            'Method syntax opts the member out of strict mode checking entirely',
          ], 2, 'strictFunctionTypes exempts members written with method syntax so the built in library declarations keep working, so switching to property syntax turns on the stricter contravariant parameter check.'),
          q('const animals: Animal[] = dogs compiles, and animals.push(new Cat()) compiles too. What is the consequence at runtime?', [
            'The array behind dogs now holds a Cat while its type still says Dog[]',
            'The push is ignored because the array element type is fixed at creation',
            'dogs is narrowed to Animal[] from the point of the assignment onward',
            'The Cat instance is structurally converted into a Dog as it is pushed',
          ], 0, 'Both variables reference the same array object, so the Cat really is in it, and any later read through dogs is typed Dog while the value is not one.'),
        ]
      ),
      lesson('The Unsound Corners You Have to Know About', 13, `
The TypeScript design goals document has a section titled Non-Goals. Item three reads: apply a sound or provably correct type system. That is not an apology, it is a decision. A sound checker would reject a large amount of JavaScript that works perfectly well, so the team traded a handful of holes for a language people would actually adopt.

There are about six holes. Knowing them by name is the difference between trusting a green build and being ambushed by one.

\`\`\`ts
const users: User[] = await loadUsers();
console.log(users[0].email.toLowerCase());
// TypeError: Cannot read properties of undefined (reading 'email')
\`\`\`

Strict mode, no \`any\`, no \`as\`, no \`!\`. The filter simply matched nothing.

### The list

| Hole | What the checker believes | How you close it |
| --- | --- | --- |
| Index access | \`users[0]\` is a \`User\` | \`noUncheckedIndexedAccess\` |
| Optional properties | \`{ createdAt: undefined }\` fits \`{ createdAt?: Date }\` | \`exactOptionalPropertyTypes\` |
| Array covariance | \`Animal[] = dogs\` is a safe widening | \`readonly T[]\` parameters |
| Method bivariance | a narrower parameter is close enough | property syntax for callbacks |
| \`any\` from untyped code | the value has whatever type you claimed | parse at the boundary |
| Assertions and \`!\` | you have checked, so it must be true | a lint rule and code review |

Two of them deserve a closer look, because neither involves a flag you can flip.

### Mutable properties alias

\`\`\`ts
type Draft     = { title: string | null };
type Published = { title: string };

const post: Published = { title: "Shipping on Friday" };
const draft: Draft = post;      // allowed
draft.title = null;             // allowed

post.title.length;              // TypeError: Cannot read properties of null
\`\`\`

Every individual statement passes. Assignability was checked once, at the second line, and nothing afterwards tracks the fact that \`draft\` and \`post\` are the same object. This is the array bug wearing different clothes: a mutable position compared covariantly. Mark the property \`readonly\` and the second assignment is rejected instead.

### Class fields do not exist yet when the base constructor runs

\`\`\`ts
class Base {
  constructor() { this.describe(); }
  describe(): void {}
}

class Order extends Base {
  private lines: string[] = [];
  describe(): void { console.log(this.lines.length); }
}

new Order();   // TypeError: Cannot read properties of undefined (reading 'length')
\`\`\`

\`lines\` is typed \`string[]\`. Not optional, not nullable. It is \`undefined\` at the moment \`describe\` runs, because field initialisers execute after \`super()\` returns. The type is a statement about the finished object, and the base constructor sees an unfinished one. No flag fixes this. Keep work out of constructors, or make the field optional and admit the truth.

### Turning the flags on without stopping the world

\`\`\`bash
npx tsc --noEmit --noUncheckedIndexedAccess 2>&1 | grep -c 'error TS'
# 412
\`\`\`

Four hundred errors on a mature codebase, and most are genuine. Do not fix them in one branch. Add a second config that only checks the code you trust most, then widen \`include\` as you clean up:

\`\`\`json
// tsconfig.strictest.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/domain", "src/billing"]
}
\`\`\`

Run both in CI. New code lands under the strict config, old code keeps building, and the boundary moves one directory at a time.

\`exactOptionalPropertyTypes\` usually produces fewer errors than people fear, and they cluster in one place: object spreads that hand \`undefined\` to a field that is supposed to be absent. \`{ ...patch, updatedAt: patch.updatedAt }\` writes the key with an \`undefined\` value, which is a different thing from omitting it, and a \`PATCH\` request that clears a column instead of leaving it alone is exactly the bug that flag catches.

The checker is an excellent colleague who takes you at your word about six specific things. Decide which of those six your project can afford to close, close them deliberately, and stop reading a green build as proof that the shapes match reality.
      `,
        [
          q('A strict build with no any, no assertions and no non null operators still throws on users[0].email. Which compiler default is responsible?', [
            'strictNullChecks does not apply to the element types of arrays',
            'noUncheckedIndexedAccess is off, so users[0] is typed User, not User | undefined',
            'Index access on an array is implicitly treated as a non null assertion',
            'The Array interface declares its elements with definite assignment',
          ], 1, 'By default TypeScript assumes any index you read is in range, so users[0] is typed User even for an empty array, and noUncheckedIndexedAccess is the flag that adds undefined to the result.'),
          q('const draft: Draft = post assigns a { title: string } to a { title: string | null }, then draft.title = null runs. What breaks?', [
            'Nothing, because draft and post are independent copies of the object',
            'The assignment throws because title is readonly at runtime after aliasing',
            'post is widened to { title: string | null } at its own declaration site',
            'post.title now holds null while its declared type still says string',
          ], 3, 'Assignability is checked once at the aliasing assignment and nothing tracks the two references afterwards, so writing through the wider view breaks the guarantee the narrower type still advertises.'),
          q('Which compiler flag makes { createdAt: undefined } an error for a type declared { createdAt?: Date }?', [
            'strictPropertyInitialization, checking declared fields',
            'noUncheckedIndexedAccess, checking element reads',
            'exactOptionalPropertyTypes, separating absent from undefined',
            'useUnknownInCatchVariables, checking caught values',
          ], 2, 'exactOptionalPropertyTypes stops treating an explicit undefined value as equivalent to an omitted key, which is what catches a patch object that clears a field instead of leaving it alone.'),
        ]
      ),
      ],
      [
      q('Two interfaces describe unrelated domain concepts but happen to declare exactly the same members. What actually makes the checker treat them as different types?', [
        'Giving one of them a member the other lacks, such as a literal tag field',
        'Declaring them in separate modules and exporting neither of the two',
        'Using an interface for one of them and a type alias for the other one',
        'Marking every property on one of the two interfaces as readonly instead',
      ], 0, 'Structural typing compares members and nothing else, so the only way to separate two identical shapes is to make the shapes genuinely differ, which is what a tag field or a private class member does.'),
      q('Excess property checking vanishes the moment an object literal passes through an unannotated variable. What does that behaviour tell you about the rule?', [
        'It is a soundness rule that variable declarations are exempt from for speed',
        'It only ever runs when the target type declares at least one optional property',
        'It is a typo heuristic, because the value was assignable the whole time anyway',
        'It is enforced during emit rather than by the type checker during compilation',
      ], 2, 'The literal with the extra key was always assignable under the normal structural rule, so the check is an extra warning aimed at likely mistakes rather than a rule that keeps the type system honest.'),
      q('You want a parameter that the callee cannot mutate and that safely accepts a narrower array such as Dog[] where Animal is expected. What do you declare?', [
        'Animal[], and document in a comment that it must not be mutated',
        'Array<Animal>, which is the same type spelled out differently',
        'Animal[], with the caller freezing the array before every call',
        'readonly Animal[], which exposes no push, splice or index write',
      ], 3, 'Covariance on a read only container is sound, so a readonly array parameter accepts a narrower array while removing every method that could put the wrong element into it.'),
      q('Why does TypeScript keep array covariance and method parameter bivariance instead of replacing them with sound rules?', [
        'Both behaviours are already scheduled for removal in the next major version',
        'Sound rules would reject a large amount of correct, widely used JavaScript',
        'The checker has no way to compute variance for generic type parameters',
        'Sound checking would require type information to survive into the runtime',
      ], 1, 'Soundness is an explicit non goal of the language design, because rules strict enough to be provably correct would reject common patterns in the DOM library and in ordinary array code.'),
      ]
    ),
    chapter(
      'Modelling a Domain in Types',
      'Designing state, failure, and invariants so the compiler enforces the rules of the business instead of leaving them to convention and code review.',
      [
      lesson('Modelling Failure as Data, Not Exceptions', 13, `
\`charge()\` returns \`Promise<Receipt>\`. That signature is a lie. There are four distinct ways the call fails and the type mentions none of them.

\`\`\`ts
async function charge(orderId: string, cents: number): Promise<Receipt> {
  const card = await cards.forOrder(orderId);        // throws NotFoundError
  const auth = await gateway.authorise(card, cents); // throws Declined, GatewayTimeout
  return receipts.create(auth);                      // throws UniqueViolation
}
\`\`\`

The caller wraps it in \`try\`, catches a variable typed \`unknown\` (strict mode turns on \`useUnknownInCatchVariables\`), and logs "payment failed". A declined card and a gateway timeout are now the same line in your dashboard. One needs a new card from the customer. The other needs a retry in ninety seconds.

### Failures the caller must handle belong in the return type

\`\`\`ts
type Ok<T>  = { ok: true;  value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;
\`\`\`

That is the whole abstraction. The interesting part is \`E\`, which should be a union of the failures a caller can act on, not \`Error\`:

\`\`\`ts
type ChargeError =
  | { kind: 'no_card_on_file' }
  | { kind: 'declined'; code: 'insufficient_funds' | 'expired_card' | 'fraud_hold' }
  | { kind: 'gateway_unavailable'; retryAfterMs: number };

declare function charge(
  orderId: string, cents: number
): Promise<Result<Receipt, ChargeError>>;
\`\`\`

The receipt is now unreachable without dealing with the failure first:

\`\`\`ts
const r = await charge('ord_7712', 4999);
if (!r.ok) {
  switch (r.error.kind) {
    case 'no_card_on_file':     return redirect('/billing/add-card');
    case 'declined':            return showDecline(r.error.code);
    case 'gateway_unavailable': return retryIn(r.error.retryAfterMs);
  }
}
await email.receipt(r.value);   // r.value only exists past this point
\`\`\`

Add a fourth variant to \`ChargeError\` and this stops compiling. Not because of a clever helper: the unhandled case falls out of the \`if\` block, \`r\` is no longer narrowed to the ok branch, and \`r.value\` errors. The error list is now versioned, reviewed in a pull request, and mechanically fanned out to every place that cares.

### Not everything should be a Result

Here is where teams overcorrect. They convert every throw, end up with \`Result<T, Error>\` threaded through forty functions, and have gained nothing except an unwrap at each hop.

| Kind of failure | Example | Model it as |
|---|---|---|
| Expected, caller can act | card declined, slug taken | \`Result\` |
| Expected, caller can degrade | gateway down after 3 retries | \`Result\` |
| Programmer error | invariant broken, bad index | throw |
| Missing config at boot | no \`DATABASE_URL\` | throw and crash |

The rule that survives contact with a real codebase: if a competent caller would write different code for this failure than for that one, it is data. If the only sane response is to page someone, let it throw.

### The two costs nobody mentions

The first is ergonomics. \`Result\` does not compose with \`await\` the way exceptions do, so a function calling three fallible things grows three \`if (!r.ok) return r;\` lines. Two constructors take most of the sting out:

\`\`\`ts
const ok  = <T>(value: T): Ok<T>  => ({ ok: true, value });
const err = <E>(error: E): Err<E> => ({ ok: false, error });
\`\`\`

The second cost is the escape hatch. Somebody adds \`unwrap\`, which throws when the result is an error, and within a month a third of the call sites use it. You now have exceptions again, with an extra allocation per call. If you want that behaviour, make it loud: name it \`unwrapOrThrow\`, and lint against it outside test files.

### Where the boundary sits

A \`Result\` is for your own code talking to your own code. At the HTTP edge you still convert, because clients speak status codes:

\`\`\`ts
const STATUS: Record<ChargeError['kind'], number> = {
  no_card_on_file: 402,
  declined: 402,
  gateway_unavailable: 503,
};
\`\`\`

Keep that translation in one table per boundary. It is the map from "what went wrong" to "what the client sees", and it should be readable in one screen rather than reconstructed from twelve route handlers.
      `,
        [
          q('A team converts every throwing function in their codebase to return Result<T, Error>. Why is this usually worse than what they started with?', [
            'Result values allocate an object per call, which dominates request latency',
            'TypeScript cannot narrow a union whose error branch is typed as Error',
            'The caller learns nothing new, but now must unwrap at every call site',
            'Exceptions already carry a stack trace, and Result types discard it',
          ], 2, 'Typing the error channel as Error tells the caller no more than a throw did, so there is nothing to switch on and all the change bought was an unwrap at every hop.'),
          q('charge returns Promise<Result<Receipt, ChargeError>> and a fourth variant is added to ChargeError. What happens at a call site that switched over the three old kinds and then read r.value?', [
            'The read of r.value stops compiling, because r is no longer narrowed',
            'Nothing changes, since the wider union is still assignable everywhere',
            'Every call site errors, as the Result generic argument no longer matches',
            'Only the switch errors, and the compiler suggests adding a default clause',
          ], 0, 'Each handled case returns, so an unhandled kind lets control fall out of the if block, leaving r as the full union and making the later access to r.value a compile error.'),
          q('Which of these failures is the poorest fit for a Result return type?', [
            'A payment gateway returning a decline code the customer could act on',
            'A signup rejected because the chosen username is already taken here',
            'An upload rejected because the file exceeds the twenty megabyte cap',
            'A missing DATABASE_URL discovered while the process is still booting',
          ], 3, 'No caller can respond usefully to missing boot configuration, so crashing loudly is correct, while the other three are expected outcomes that callers write genuinely different code for.'),
        ]
      ),
      lesson('State Machines the Compiler Enforces', 13, `
A checkout emailed 1,400 receipts for orders nobody had paid for. The cause fits on one line: a webhook set \`order.paidAt\`, \`order.status\` was still \`'cart'\`, and the nightly job read \`paidAt\`.

\`\`\`ts
// The shape that allowed it
type Order = {
  status: 'cart' | 'placed' | 'paid' | 'refunded';
  items: Item[];
  placedAt?: Date;
  paidAt?: Date;
  paymentId?: string;
  refundId?: string;
};
\`\`\`

Four states and four optional fields describe sixty four combinations. Four of them are real. The type does not know which four, so every read becomes \`order.paymentId!\` and every \`!\` is a bet nobody is tracking.

### Give each state exactly the data it has

\`\`\`ts
type Order =
  | { status: 'cart';     items: Item[] }
  | { status: 'placed';   items: Item[]; placedAt: Date }
  | { status: 'paid';     items: Item[]; placedAt: Date; paymentId: string }
  | { status: 'refunded'; items: Item[]; placedAt: Date; paymentId: string; refundId: string };
\`\`\`

\`order.paymentId\` is a compile error until you narrow, and once you narrow it is a \`string\`, never \`string | undefined\`. The nightly job cannot read a payment id off a cart, because carts do not have one.

### States stop illegal reads, transitions stop illegal writes

This is the half that gets missed. The union above still lets anyone write \`{ status: 'paid', ... }\` out of thin air. Make each transition a function whose parameter type is the source state:

\`\`\`ts
type OrderIn<S extends Order['status']> = Extract<Order, { status: S }>;

function place(order: OrderIn<'cart'>): OrderIn<'placed'> {
  return { ...order, status: 'placed', placedAt: new Date() };
}

function pay(order: OrderIn<'placed'>, paymentId: string): OrderIn<'paid'> {
  return { ...order, status: 'paid', paymentId };
}
\`\`\`

\`\`\`ts
const cart = await loadCart('ord_7712');
pay(cart, 'pi_3Q1');          // Type '"cart"' is not assignable to type '"placed"'.
pay(place(cart), 'pi_3Q1');   // fine
\`\`\`

Refunding an order that was never paid, paying the same order twice, cancelling a refund: all compile errors now, instead of support tickets.

### Naming the legal edges

Past five or six states, write the edges down so nobody has to reconstruct the machine from function signatures:

\`\`\`ts
type Next = {
  cart:      'placed';
  placed:    'paid' | 'cancelled';
  paid:      'refunded';
  refunded:  never;
  cancelled: never;
};

type Go<F extends keyof Next, T extends Order['status']> = T extends Next[F] ? T : never;
\`\`\`

The \`never\` on a terminal state does real work. \`Next['refunded']\` is \`never\`, so any target checked against it resolves to \`never\`, and the transition call fails to typecheck. Illegal edges are not merely discouraged, they are unnameable.

### Where it breaks: the database row

Your table is flat and nullable, because that is what tables are: \`paid_at timestamptz null\`, \`payment_id text null\`. The union lives in your code, not in Postgres. So exactly one function turns a row into an \`Order\`, and it is allowed to fail:

\`\`\`ts
function rowToOrder(r: OrderRow): Result<Order, 'inconsistent_row'> {
  switch (r.status) {
    case 'paid':
      return r.placed_at && r.payment_id
        ? ok({ status: 'paid', items: r.items,
               placedAt: r.placed_at, paymentId: r.payment_id })
        : err('inconsistent_row');
    // one case per state
  }
}
\`\`\`

The shortcut is \`row as Order\`. It compiles, it checks nothing at runtime, and the impossible state you spent an afternoon designing out walks back in through the ORM. Worse, it walks in silently: every later read trusts the narrowing, so \`paymentId\` is a \`string\` that is actually \`null\`. One mapper, one alarm on inconsistent rows, and the rest of the codebase gets to believe the union.

### Two different guarantees

A \`switch\` on \`status\` with a \`never\` fallthrough catches states you forgot to handle. It says nothing about transitions you forgot to forbid. Exhaustiveness covers reads. Typed transitions cover writes. A machine the compiler actually enforces needs both.
      `,
        [
          q('Order is a union of four states, each variant carrying only the fields that state actually has. What does this shape NOT prevent on its own?', [
            'Reading paymentId from an order that is still sitting in the cart state',
            'Constructing a paid order directly, skipping the placed state entirely',
            'Forgetting a state in a switch that has a never based exhaustiveness check',
            'Treating placedAt as possibly undefined after the status has been narrowed',
          ], 1, 'The union governs what data each state carries, but any code can still write an object literal for a later state, so transitions must be functions whose parameter type is the source state.'),
          q('In the transition table type, why is refunded given the type never rather than being left out of the table?', [
            'It marks the state unreachable, so no code path can ever construct it',
            'It tells the checker to skip exhaustiveness checking for that one state',
            'It makes the refunded branch of the order union optional to implement',
            'Any target checked against it resolves to never, so the call is rejected',
          ], 3, 'A conditional that tests a target against never can never match, so every attempted move out of the refunded state resolves to never and the transition call fails to typecheck.'),
          q('A database row has status \'paid\' but payment_id is null, and the loader writes row as Order instead of mapping it. What is the consequence?', [
            'An impossible state enters the union and later reads trust a null value',
            'The cast is rejected, because the row type is not assignable to Order',
            'TypeScript inserts a runtime check on the discriminant before each read',
            'The union collapses to its widest member, so every field becomes optional',
          ], 0, 'A cast is erased at compile time and checks nothing, so the inconsistent row becomes an Order the rest of the code believes, and paymentId is read as a string when it is really null.'),
        ]
      ),
      lesson('readonly, Immutability, and Defensive Shapes', 13, `
Every request after 14:02 on a Tuesday carried the previous user's bearer token. The code responsible was three lines long and had no type error in it.

\`\`\`ts
const DEFAULTS = { retries: 3, timeoutMs: 5000, headers: { 'x-app': 'billing' } };

function withAuth(cfg: typeof DEFAULTS, token: string) {
  cfg.headers.Authorization = \`Bearer \${token}\`;
  return cfg;
}

const client = createClient(withAuth(DEFAULTS, session.token));
\`\`\`

\`DEFAULTS\` is \`const\`, which the author read as "this cannot change". \`const\` freezes the binding, not the object. Every handler wrote into the same \`headers\` object, and the last writer won for everybody.

### Four tools, four different promises

| Tool | Stops | Does not stop |
|---|---|---|
| \`const x = { ... }\` | reassigning \`x\` | \`x.headers.a = 1\` |
| \`readonly a: T\` | \`x.a = 1\`, at compile time | writes through an alias typed without it |
| \`as const\` | every property write, plus widening | anything at runtime |
| \`Object.freeze(x)\` | shallow writes at runtime | \`x.headers.a = 1\` |

The fix above is \`as const\` on the literal and \`Readonly\` on the parameter, which turns the mutation into an error on the line that causes it rather than a mystery three services away.

### readonly is shallow, and so is Readonly<T>

\`\`\`ts
type Config = Readonly<{ retries: number; headers: Record<string, string> }>;
declare const c: Config;
c.retries = 5;                  // error, good
c.headers.Authorization = 'x';  // no error at all
\`\`\`

\`Readonly<T>\` maps one level. Nested objects stay wide open. Either spell out the nested \`readonly\` yourself or use \`as const\` on the literal, which does go deep. There is no built in \`DeepReadonly\`, and the recursive version you will find online is fine right up until it meets a \`Map\`, a \`Date\`, or a class instance and mangles the methods.

### The asymmetry that catches everyone

Object \`readonly\` is ignored during assignability. Array \`readonly\` is not.

\`\`\`ts
type Frozen = { readonly name: string };
type Thawed = { name: string };

declare const f: Frozen;
const t: Thawed = f;     // no error
t.name = 'oops';         // and f.name is now 'oops'

declare const ra: readonly number[];
const a: number[] = ra;  // error: 'readonly number[]' is not assignable to 'number[]'
\`\`\`

The object case is a deliberate compatibility compromise. The array case is not. So \`readonly\` on a property is a local check plus a note to the reader, while \`readonly\` on an array is a real barrier that survives being passed around.

### Defensive parameters cost nothing

\`\`\`ts
function topThree(scores: number[]) {
  return scores.sort((a, b) => b - a).slice(0, 3);
}

const results = [12, 40, 7, 33];
topThree(results);
console.log(results);   // [40, 33, 12, 7], the caller's array was reordered
\`\`\`

\`Array.prototype.sort\` sorts in place and hands back the same array. Change the parameter to \`readonly number[]\` and the body stops compiling, because \`sort\` does not exist on \`ReadonlyArray\`. The fix writes itself:

\`\`\`ts
function topThree(scores: readonly number[]) {
  return [...scores].sort((a, b) => b - a).slice(0, 3);
}
\`\`\`

You also widened what callers may pass. A \`readonly\` tuple produced by \`as const\` now fits, where before it was rejected.

Make \`readonly T[]\` the default for any parameter you do not intend to mutate. It is one word, it converts a whole class of aliasing bug into a compile error, and it tells the next reader something no function name ever could: this code looks, it does not touch.

### Where to stop

Do not deep freeze the world. Mutating a local array you built two lines ago is fine, faster, and clearer than three chained spreads. The rule that pays: immutable at the boundaries (parameters, module level constants, anything cached or shared across requests), mutable in the small.
      `,
        [
          q('A module level const object is mutated inside a request handler and every later request sees the change. Why did const not prevent it?', [
            'const applies only at module scope, never inside a function body',
            'const is erased by tsc, so it has no effect on the emitted output',
            'const prevents rebinding the name, not writes into the object itself',
            'const infers a widened type, which drops the readonly modifiers on it',
          ], 2, 'const is a guarantee about the binding: the identifier cannot be pointed at a different value, while the object it points at stays fully mutable unless the type or Object.freeze says otherwise.'),
          q('Which one of these assignments does TypeScript actually reject?', [
            'const t: { name: string } = f, where f is typed { readonly name: string }',
            'const a: number[] = ra, where ra is typed readonly number[]',
            'const r: { readonly id: string } = m, where m is typed { id: string }',
            'const s: readonly string[] = tags, where tags is typed string[]',
          ], 1, 'Readonly arrays are a genuine barrier in assignability, so a readonly number array cannot be assigned to a mutable one, whereas readonly on object properties is ignored in both directions.'),
          q('Changing a parameter from number[] to readonly number[] makes an existing function body stop compiling. The most likely cause is that the body', [
            'reads an element with an index expression the checker cannot verify',
            'passes the array to a helper returning a new array of the same type',
            'spreads the array into a new one before doing any further work on it',
            'calls sort, reverse, or push, none of which exist on ReadonlyArray',
          ], 3, 'ReadonlyArray omits the mutating methods, so any in place call such as sort, reverse or push stops compiling and forces a copy, which is exactly the aliasing bug the annotation exists to catch.'),
        ]
      ),
      lesson('Domain Types, Wire Types, and the Mapping Between Them', 13, `
\`TypeError: order.createdAt.getTime is not a function\`. The type said \`Date\`. The value was the string \`"2026-03-04T09:12:00Z"\`, because it came out of \`JSON.parse\` and somebody wrote \`as Order\` on the way in.

One type cannot honestly describe both the JSON on the wire and the object your business logic wants. Reuse it and it is wrong at one of the two ends, every time.

### The two shapes differ in ways that matter

| Concern | Wire type | Domain type |
|---|---|---|
| Timestamps | \`string\`, ISO 8601 | \`Date\` |
| Absent value | \`null\`, since JSON has no undefined | property simply missing |
| Status | \`string\`, whatever the vendor sends | \`'cart' \\| 'placed' \\| 'paid'\` |
| Money | \`total_cents: number\` | branded \`Money\` |
| Naming | \`created_at\` | \`createdAt\` |

\`\`\`ts
type OrderWire = {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  coupon_code: string | null;
};

type Order = {
  id: OrderId;
  createdAt: Date;
  status: OrderStatus;
  total: Money;
  coupon?: CouponCode;
};
\`\`\`

### One module names both types, everything else names one

\`\`\`ts
// src/orders/wire.ts is the only file allowed to import OrderWire
export function toOrder(w: OrderWire): Result<Order, 'bad_status' | 'bad_date'> {
  const createdAt = new Date(w.created_at);
  if (Number.isNaN(createdAt.getTime())) return err('bad_date');
  if (!isOrderStatus(w.status)) return err('bad_status');

  return ok({
    id: w.id as OrderId,
    createdAt,
    status: w.status,
    total: cents(w.total_cents),
    ...(w.coupon_code !== null ? { coupon: w.coupon_code as CouponCode } : {}),
  });
}
\`\`\`

When the vendor renames \`total_cents\` to \`amount_minor\`, the diff is four lines in one file. Teams who skipped the mapper because "it is the same shape anyway" find that the rename touches a hundred and forty files, and that half of them are tests asserting on a name that was never theirs.

### Outbound, make the compiler keep the map total

\`\`\`ts
const TO_WIRE: Record<OrderStatus, string> = {
  cart: 'CART',
  placed: 'PLACED',
  paid: 'PAID',
};
\`\`\`

Add \`'refunded'\` to \`OrderStatus\` and this object fails to compile: "Property 'refunded' is missing". A \`switch\` with a \`default\` would have quietly shipped the fallback instead. \`Record<Union, X>\` is the cheapest exhaustiveness check in the language, it needs no helper, and it works on plain data you can also read at runtime.

### The undefined that vanishes

\`\`\`ts
JSON.stringify({ coupon: undefined });   // '{}'
JSON.stringify({ coupon: null });        // '{"coupon":null}'
\`\`\`

Your domain type says \`coupon?: CouponCode\`, so clearing a coupon sets it to \`undefined\`, and \`JSON.stringify\` drops the key. A PATCH endpoint reads an absent key as "leave this alone". The coupon is never removed, nothing throws, and the customer keeps their discount forever. Outbound mapping is where \`undefined\` becomes an explicit \`null\`, decided once per boundary rather than argued about once per bug.

Turn on \`exactOptionalPropertyTypes\` while you are in there. Without it, \`coupon?: CouponCode\` also accepts an explicit \`undefined\`, so "absent" and "present but undefined" collapse into one type and the distinction the mapper depends on stops existing.

### Catching drift before your users do

The mapper protects you from a rename you know about. Nothing protects you from a field that quietly changed type in a vendor deploy, unless you check. Keep the wire type generated from the vendor's schema, and pin the assumptions the mapper relies on so a change fails the build instead of a request:

\`\`\`ts
type Expect<T extends true> = T;
type _Coupon = Expect<null extends OrderWire['coupon_code'] ? true : false>;
\`\`\`

If \`coupon_code\` stops being nullable, \`_Coupon\` errors in CI. Small, boring, and it fails on a Tuesday afternoon rather than at two in the morning.
      `,
        [
          q('Clearing a coupon sets the optional coupon property to undefined and PATCHes the object, but the coupon is never actually removed. What happened?', [
            'JSON.stringify drops undefined keys, so the server saw no coupon field',
            'The server rejected undefined and fell back to the stored coupon value',
            'TypeScript erased the optional marker, so the key was never serialised',
            'The branded CouponCode type serialises to an empty object, not to null',
          ], 0, 'JSON has no undefined, so JSON.stringify omits the key entirely, and a PATCH endpoint reads an absent key as leave this field alone rather than as clear this field.'),
          q('Why prefer const TO_WIRE: Record<OrderStatus, string> over a switch statement with a default clause for outbound mapping?', [
            'Record lookups are faster than a switch once the union grows large',
            'A switch cannot be narrowed by the compiler when its input is a union',
            'Adding a status breaks the object, while a default silently sends a fallback',
            'Record preserves the literal types of the values, and a switch widens them',
          ], 2, 'A Record keyed by the union must have an entry for every member, so a new status is an immediate compile error, whereas a default clause keeps shipping whatever fallback it holds.'),
          q('A team merges their wire type and their domain type into one shared interface. What is the first thing that goes wrong?', [
            'Generated declaration files grow, because both shapes must be emitted',
            'One of the two ends is wrong: dates are strings on the wire, Dates in code',
            'Assignability fails, since branded ids are not assignable to plain strings',
            'The compiler cannot narrow the status field, because it is typed as string',
          ], 1, 'A single type has to commit to one representation, so a timestamp is either the ISO string that really arrives or the Date the business logic wants, and either choice makes the type a lie at the other end.'),
        ]
      ),
      ],
      [
      q('Result unions, state unions, and separate wire types are three different techniques. What is the single idea underneath all three?', [
        'Push every runtime check out to the outermost boundary of the system',
        'Prefer classes over plain objects so invariants live beside their methods',
        'Replace runtime tests with type level tests wherever that is possible',
        'Make the shape carry the rule, so illegal cases cannot be written down',
      ], 3, 'Each pattern removes a class of bug by making the invalid combination unrepresentable in the type, which shifts enforcement from convention and code review onto the compiler.'),
      q('Which change makes the compiler flag a forgotten union member without any exhaustiveness helper or never check involved?', [
        'Adding an optional field to the object that all of the state variants share',
        'Keying a mapping object by the union, as in Record<OrderStatus, WireStatus>',
        'Casting the incoming database row to the domain union at the ORM boundary',
        'Marking every property of the domain type readonly at its declaration site',
      ], 1, 'A Record keyed by a union requires one entry per member, so adding a member turns the mapping object into a compile error on its own, with no helper function or never assignment needed.'),
      q('An order union models its states carefully, but rows are loaded into it with row as Order. Which guarantee does that cast destroy?', [
        'That a narrowed variant really carries the fields its type promises',
        'That a switch over the status field is checked for exhaustiveness',
        'That transition functions reject an order in the wrong source state',
        'That readonly fields on the order cannot be written after loading',
      ], 0, 'A cast performs no runtime check, so an inconsistent row becomes a union member whose required fields may be null, and every later read that trusts the narrowing is now unsound.'),
      q('A function takes orders: Order[], sorts it, and returns the top three. A caller complains their own array came back reordered. The smallest fix is to', [
        'clone the array in every caller before it is passed to the function',
        'mark the Order type\'s properties readonly so the elements are frozen',
        'type the parameter readonly Order[], which forces a copy before sort',
        'call Object.freeze on the array at the very top of the function body',
      ], 2, 'Typing the parameter as a readonly array removes sort from the available methods, so the body must spread into a new array, and the fix is enforced once at the function instead of at every call site.'),
      ]
    ),
    chapter(
      'Shipping Types Other People Depend On',
      'What changes when your types become a public artefact, from inference and error messages to declaration emit, module resolution, and versioning.',
      [
      lesson('Designing APIs That Infer for the Caller', 13, `
Your users should never have to type an angle bracket. Every type argument they write by hand is a place they can be wrong, and a place your library gets blamed for it.

### The signature that makes callers do your job

\`\`\`ts
// billing-sdk v0.1
export function on(event: string, handler: (payload: unknown) => void): void {}

on('order.created', p => {
  console.log(p.total);
  // 'p' is of type 'unknown'.
});
\`\`\`

Every consumer now writes a cast, and half of them cast to the wrong shape. Move the knowledge into the signature instead:

\`\`\`ts
type Events = {
  'order.created': { orderId: string; total: number };
  'order.refunded': { orderId: string; reason: string };
};

export function on<K extends keyof Events>(
  event: K,
  handler: (payload: Events[K]) => void,
): void {}

on('order.created', p => p.total);  // p: { orderId: string; total: number }
on('order.refnded', p => p.total);
// Argument of type '"order.refnded"' is not assignable to parameter of
// type '"order.created" | "order.refunded"'.
\`\`\`

Two things changed. The event name became a checked set, and the payload followed from it. The caller still wrote no type arguments.

### Inference is positional, and every position votes

TypeScript infers a type parameter from every argument it appears in, and treats each appearance as equal evidence.

\`\`\`ts
export function withFallback<T>(values: T[], fallback: T): T[] {}

withFallback(['gbp', 'usd'], 'euro');  // compiles, T is string
\`\`\`

You wanted the fallback checked against the list. Instead the fallback voted, \`T\` widened to \`string\` to cover both arguments, and the typo shipped. \`NoInfer\`, added in 5.4, removes a position from the ballot:

\`\`\`ts
export function withFallback<T>(values: T[], fallback: NoInfer<T>): T[] {}

withFallback(['gbp', 'usd'], 'euro');
// Argument of type '"euro"' is not assignable to parameter of type '"gbp" | "usd"'.
\`\`\`

### Literals collapse unless you ask them not to

\`\`\`ts
export function defineColumns<T extends readonly string[]>(cols: T): T {}

const cols = defineColumns(['id', 'email']);  // string[]
\`\`\`

The array literal widens on its way into the call, so the column names are gone and anything downstream that indexes by name is back to plain \`string\`. One keyword fixes it:

\`\`\`ts
export function defineColumns<const T extends readonly string[]>(cols: T): T {}

const cols = defineColumns(['id', 'email']);  // readonly ["id", "email"]
\`\`\`

A \`const\` type parameter, added in 5.0, tells the checker to infer as though the caller had written \`as const\`, without making them write it.

### Smells, and what each one means

| What the caller writes | What it tells you |
|---|---|
| \`parse<Invoice>(json)\` | your type parameter has no inference site, so it is an assertion wearing a disguise |
| \`map(rows, (r: Row) => r.id)\` | information is flowing the wrong way, put the source argument first |
| \`as const\` on every call | you need a \`const\` type parameter |
| a squiggle under the whole object | your constraint is a conditional type, so the checker stopped at the top level |

Two more habits. Give type parameters defaults, so \`Client\` works as well as \`Client<InvoiceSchema>\`. And put the argument carrying the information first, because inference runs left to right: a callback in position two is typed from what position one already settled.

### Assert on the inference, not just the build

\`\`\`ts
import { expectTypeOf } from 'expect-type';

expectTypeOf(defineColumns(['id', 'email']))
  .toEqualTypeOf<readonly ['id', 'email']>();
\`\`\`

A signature change that still compiles can quietly downgrade every caller to \`any\`, and nothing in a normal test suite notices. An assertion on the inferred type does, and it runs in CI beside your unit tests for free.
      `,
        [
          q('withFallback<T>(values: T[], fallback: T) is called as withFallback([\'gbp\', \'usd\'], \'euro\') and it compiles clean. Why?', [
            'Array literals lose their literal types, so T is fixed to string before the fallback is looked at',
            'String literal types stay assignable to one another unless the alias has been branded',
            'The fallback is also an inference site, so T widens to string to cover both arguments',
            'A type parameter with no extends clause is treated as any inside the function body',
          ], 2, 'T appears in both parameters, so both contribute candidates and the checker picks a type that fits them all, which is string. Wrapping the second parameter in NoInfer<T> removes it from inference and forces it to be checked against the array instead.'),
          q('defineColumns([\'id\', \'email\']) returns string[] instead of the literal names. What does writing <const T extends readonly string[]> change?', [
            'It infers the argument as though the caller had written as const, keeping the literal elements',
            'It freezes the array at runtime so later mutation of the column list throws an error',
            'It requires the caller to declare the argument with const rather than let or var',
            'It marks only the returned array readonly and leaves the element types widened',
          ], 0, 'A const type parameter changes inference at the call site so literal expressions keep their literal types, which is what as const would have done manually, and it has no runtime effect at all.'),
          q('You want the second argument checked against the first rather than voting on what T becomes. Which change does that?', [
            'Add an extends string constraint to the type parameter',
            'Give the type parameter a default type of string',
            'Move the second argument out into a separate overload',
            'Wrap the second parameter\'s type in NoInfer<T> so it stops inferring',
          ], 3, 'NoInfer<T> marks a position as a checking site rather than an inference site, so T is decided by the remaining arguments and the wrapped argument must then be assignable to that result.'),
        ]
      ),
      lesson('Error Messages Your Users Can Actually Read', 13, `
An issue arrives titled "impossible error". Pasted into it are sixty lines starting with \`Type 'CreateOrderInput' is not assignable to type 'DeepPartial<Omit<Order, "id" | "createdAt">>'\` and ending with \`... 24 more\`. Nobody debugs that at 6pm on a Friday. They pin the previous version and move on.

### The checker prints the type the way you declared it

A named \`interface\` prints as its name. An intersection prints as every half. A conditional type that cannot be resolved prints unevaluated, constraint and all.

\`\`\`ts
// prints as: OrderDraft
export interface OrderDraft { customerId: string; lines: Line[] }

// prints as: Omit<Order, "id"> & { lines: Partial<Line>[] } & { meta?: Meta }
export type OrderDraft = Omit<Order, 'id'> & { lines: Partial<Line>[] } & { meta?: Meta };
\`\`\`

Identical shape, very different failure. The second also loses property level detail: the checker cannot say which member of the intersection you missed, so it hands back the whole expression and lets you find it. If a type appears in a public signature, give it a name, and prefer \`interface\` for object shapes.

When the type has to be computed, flatten it before it escapes:

\`\`\`ts
type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type OrderDraft = Prettify<Omit<Order, 'id' | 'createdAt'>>;
// hovers and errors now read { customerId: string; lines: Line[]; total: number }
\`\`\`

\`Prettify\` does nothing at runtime and nothing to assignability. It forces the checker to evaluate the mapped type eagerly, so your users read fields instead of algebra.

### Put the error where the mistake is

A constraint reports better than a conditional return type, because the checker can blame one argument instead of the whole call.

\`\`\`ts
// weak: the entire call goes red and the message is about a conditional type
export function column<T, K>(t: T, k: K): K extends keyof T ? T[K] : never;

// strong: the error lands on the second argument and lists the valid keys
export function column<T, K extends keyof T>(t: T, k: K): T[K];

column(invoices, 'emial');
// Argument of type '"emial"' is not assignable to parameter of
// type '"id" | "email" | "total"'.
\`\`\`

### Smuggle a sentence into the type

When no constraint can express the rule, make the expected type carry the message:

\`\`\`ts
type Err<M extends string> = { __error: M };

export function connect<T>(
  opts: T extends { url: string } ? T : Err<'connect() requires a url'>,
): Client;

connect({ host: 'db.internal' });
// Argument of type '{ host: string; }' is not assignable to parameter of
// type 'Err<"connect() requires a url">'.
\`\`\`

Ugly, and worth it. The reader gets an instruction rather than a puzzle.

### Overloads print every candidate

\`No overload matches this call\` is followed by one block per signature, so nine overloads produce a wall of text and the reader gives up before block three. Keep the count low, order them narrowest first, and reach for a single signature with a union parameter where you can.

### Pin the messages, because they are public

\`\`\`ts
// test/errors.test-d.ts
// @ts-expect-error connect requires a url
connect({ host: 'db.internal' });
\`\`\`

\`@ts-expect-error\` fails the build the day that line stops erroring, which catches a refactor quietly making a bad call legal. For the text itself, run \`tsc --noEmit --pretty false\` over a fixture directory and diff the output against a committed file. The next time a clever \`infer\` chain turns a two line message into forty, the diff tells you before your users do.
      `,
        [
          q('Why does a named interface produce a better failure than an intersection of Omit and two object literals with the same shape?', [
            'Interfaces are compared structurally while intersections are compared by name',
            'The checker prints the interface by name and can blame the one property that mismatched',
            'Intersections are resolved at runtime, so their errors surface later in the build',
            'Interfaces skip the excess property check, which removes most of the message',
          ], 1, 'A declared interface has a name the checker can print and a flat property list it can compare member by member, whereas an intersection is printed in full and reported as one unassignable expression.'),
          q('What does type Prettify<T> = { [K in keyof T]: T[K] } & {} accomplish in a public signature?', [
            'It strips optional modifiers so every property shows up as required in the hover',
            'It deep clones nested object types so an error can report the failing leaf',
            'It removes index signatures that would otherwise absorb the mismatch',
            'It forces the shape to be evaluated, so hovers list fields instead of operators',
          ], 3, 'Mapping over keyof T and intersecting with an empty object makes the checker resolve the mapped type eagerly, so the displayed type is a plain list of properties rather than the unevaluated expression.'),
          q('Which signature gives the clearest error when a caller misspells a key as \'emial\'?', [
            'column<T, K extends keyof T>(t: T, k: K): T[K], since the error lands on the key',
            'column<T, K>(t: T, k: K): K extends keyof T ? T[K] : never, since it names it',
            'column(t: object, k: string): unknown, since a simpler type prints a shorter note',
            'column<T>(t: T, k: keyof any): T[keyof T], since it defers checking to the caller',
          ], 0, 'A constraint is checked when the argument is matched, so the diagnostic points at that argument and lists the acceptable keys, while a conditional return type only resolves to never and reports the whole call.'),
        ]
      ),
      lesson('Declaration Emit, ESM, CJS, and Module Resolution', 13, `
Green CI, passing tests, and the first issue on the new release reads \`Could not find a declaration file for module 'billing-sdk'\`. Nothing inside your repository is broken. What broke is the contract between your \`package.json\` and the resolver your user happens to run.

### Emit the declarations, and make them navigable

\`\`\`json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
\`\`\`

\`declarationMap\` is the one people skip. With it, a consumer who presses go to definition on your exported \`createClient\` lands in your \`src/client.ts\` with real code and comments, instead of a stub in \`dist\`. Ship \`src\` in the package \`files\` array too, or the map points at nothing.

Then this shows up:

\`\`\`
TS2742: The inferred type of 'createClient' cannot be named without a
reference to '../node_modules/@billing/core/dist/types'.
\`\`\`

The emitter tried to write a declaration for a return type it can only describe by reaching into a package that is not a direct dependency of the file. Two fixes: annotate the return type explicitly, or re-export that type so it has a name in your own module. Annotating your public surface is the better habit regardless, and \`"isolatedDeclarations": true\`, added in 5.5, enforces it everywhere, which also lets a bundler emit declarations file by file instead of type checking the world.

### One package, two module systems

A dual published package needs a declaration file per format, with the extension the resolver expects:

\`\`\`json
{
  "name": "billing-sdk",
  "type": "module",
  "exports": {
    ".": {
      "import":  { "types": "./dist/index.d.ts",  "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  }
}
\`\`\`

Two rules do most of the work here. \`types\` must come first inside each block, because conditions are matched top down and the first match wins, so a \`default\` above it swallows the request. And a \`.d.ts\` sitting beside a \`.cjs\` file is a lie: under \`node16\` resolution the extension decides whether a file is read as ESM or CommonJS, so the CJS build needs \`.d.cts\`. Get it wrong and consumers report that your default export is not callable, which sounds like a bug in your code and is not.

### Your resolution setting is not your users'

| \`moduleResolution\` | Who runs it | What it forgives |
|---|---|---|
| \`bundler\` | apps built with Vite, webpack, esbuild | extensionless relative imports |
| \`node16\` or \`nodenext\` | Node, and most library consumers | nothing |
| \`node10\` | older projects, still common | it ignores \`exports\` maps entirely |

Building a library with \`bundler\` is comfortable and dangerous. It lets you write \`import { retry } from './retry'\`, that exact line survives into the emitted \`.d.ts\`, and a consumer on \`nodenext\` gets a resolution failure inside your types with no idea why. Compile the package itself with \`nodenext\` and write \`./retry.js\` in source. App authors can keep \`bundler\`.

### Check the package, not the build

\`\`\`bash
npm pack
npx @arethetypeswrong/cli billing-sdk-2.0.0.tgz
npx publint
\`\`\`

\`attw\` resolves your actual tarball the way each consumer configuration would and names the failure mode in plain words: masquerading as CJS, missing types for the require condition, unresolvable under \`node10\`. Both commands run in about four seconds. Put them in the release job and the entire class of bug that only reproduces in someone else's repository stops reaching your users.
      `,
        [
          q('In an exports map, the import block lists default before types. What happens for a consumer?', [
            'Conditions match in order, so default wins and the consumer resolves no types',
            'Both entries are merged, so types are found but the runtime file is skipped',
            'npm rejects the package at publish time because condition order is validated',
            'Nothing changes, because TypeScript reads the types key wherever it appears',
          ], 0, 'Export conditions are evaluated top to bottom and the first one that matches wins, and default matches everything, so any condition listed after it is unreachable and the types are never found.'),
          q('You compile your published library with moduleResolution set to bundler. What tends to break for consumers?', [
            'The emitted JavaScript keeps import statements that Node refuses to parse',
            'Declaration maps stop resolving, so go to definition lands in a dist stub',
            'Extensionless relative imports survive into the .d.ts and fail under nodenext',
            'The exports map is ignored, so every deep import resolves to the package root',
          ], 2, 'Bundler resolution allows relative imports without a file extension, those specifiers are copied verbatim into the emitted declarations, and a consumer on nodenext requires the extension, so resolution fails inside your types.'),
          q('Declaration emit fails with TS2742, saying an inferred type cannot be named without a reference into node_modules. What fixes it?', [
            'Turn on skipLibCheck so declaration emit stops resolving that dependency',
            'Annotate the export\'s return type, or re-export the type so it has a local name',
            'Move the dependency from dependencies into peerDependencies and reinstall',
            'Disable declarationMap so the emitter stops writing paths into node_modules',
          ], 1, 'The emitter cannot write a name it has no import for, so giving the export an explicit annotation or re-exporting the type from your own module supplies a nameable reference and the declaration can be written.'),
        ]
      ),
      lesson('Versioning Types and Deprecating Without Breakage', 13, `
You added \`'disputed'\` to \`PaymentStatus\`. No runtime behaviour changed, no signature moved, the patch is one line. The next morning four hundred consumer builds are red, every one of them on the same \`assertNever(status)\` at the bottom of a switch.

Publishing types means your semver obligations run in two directions at once, and the directions are opposites.

### Inputs and outputs break in mirror image

A type in a parameter position is something you accept. A type in a return position is something you promise. The identical edit is safe in one and breaking in the other.

| Change | In a parameter | In a return type |
|---|---|---|
| add an optional property | safe | safe |
| add a required property | breaking | safe |
| add a member to a union | safe | breaking |
| remove a member from a union | breaking | safe |
| mark a property \`readonly\` | breaking | safe |

Read the \`PaymentStatus\` incident against that table. The union sits in a return type, you widened it, and every exhaustive switch downstream lost its exhaustiveness at once. Ship that in a major, or design the union open from the first release:

\`\`\`ts
export type PaymentStatus =
  | 'pending' | 'settled' | 'refunded'
  | (string & {});
\`\`\`

That keeps autocomplete on the known members while telling every consumer the set is not closed, so nobody writes a switch that assumes it is. Use it when you genuinely expect growth, not as a way to dodge a major bump.

### Deprecate in three steps, never in one

\`\`\`ts
/** @deprecated Use \`retry\` instead. \`retries\` is removed in v4. */
export interface ClientOptions {
  retries?: number;
  retry?: { attempts: number; backoffMs: number };
}
\`\`\`

Mark, alias, remove. The \`@deprecated\` tag renders as a strikethrough in every editor that speaks TypeScript, which reaches people who will never open your changelog. Keep the old name exported as an alias of the new one for a full major cycle. Deleting an export is the loudest break available and the cheapest one to avoid.

### The changes nobody labels breaking

- Switching a public \`interface\` to a \`type\` alias. Consumers who wrote \`declare module 'billing-sdk' { interface ClientOptions { tenantId: string } }\` lose declaration merging, and their build fails with a message that reads nothing like your release note.
- Tightening a constraint from \`<T>\` to \`<T extends object>\`. Every call site that passed a primitive now errors.
- Adding an overload. It changes which signature wins for calls that already compiled, sometimes silently changing an inferred return type.
- Anything that only errors under \`strict\`. A large share of your consumers run with \`strictNullChecks\` off and are compiling a different program than you are.

### Diff the declarations in review

Type changes are invisible in a source diff, so make them visible:

\`\`\`bash
npx tsc -p tsconfig.build.json --emitDeclarationOnly --outDir .types-next
diff -ru types/ .types-next/ || echo 'public types changed: label the release'
\`\`\`

Commit the emitted \`.d.ts\` tree, or an API report from a tool such as api-extractor, and a reviewer sees exactly what the outside world will see, line by line, before anyone tags a version. Pair that with a job that compiles the published declarations against every compiler version your README claims to support. Twelve minutes of CI is cheaper than a patch release written in a hurry because a stranger found it first.
      `,
        [
          q('You add one member to a union that only ever appears in return types. How should that be released?', [
            'As a patch, since consumers can read the value but never construct it',
            'As a patch, since the runtime behaviour of the existing members is unchanged',
            'As a minor, since only consumers who annotate variables with it are affected',
            'As a major, since exhaustive switches over the old members stop compiling',
          ], 3, 'Widening a union you return breaks every consumer who wrote an exhaustive switch or a never check over the previous members, because the new member has no branch and no longer narrows to never.'),
          q('Why would you add | (string & {}) to a status union you expect to grow?', [
            'It collapses the union to string, so editors stop suggesting the known members',
            'It keeps autocomplete on the known members while signalling the set is open',
            'It brands the union so an ordinary string can no longer be assigned into it',
            'It makes the union exhaustively checkable without needing an assertNever call',
          ], 1, 'The intersection with an empty object keeps the literal members visible to autocomplete while accepting any string, which tells consumers the set will grow so they never write a switch that assumes it is closed.'),
          q('Which of these looks additive in the diff but is a breaking change for consumers?', [
            'Adding an optional property to an options object your function accepts',
            'Adding a new named export alongside the ones you already publish',
            'Changing a public interface into a type alias, which blocks module augmentation',
            'Adding a default type argument to a generic type you already export',
          ], 2, 'Only interfaces participate in declaration merging, so consumers who augmented your interface through declare module lose that ability the moment it becomes a type alias, and their build fails on a line they never touched.'),
        ]
      ),
      ],
      [
      q('Callers of your parse helper must write parse<Invoice>(json) or the result is wrong. What does that requirement signal?', [
        'The type parameter has no inference site, so it behaves as an assertion',
        'The argument type is too wide, so the checker falls back to the constraint',
        'The helper needs a const type parameter to preserve the literal keys',
        'The return type should be conditional on the argument type instead',
      ], 0, 'A type parameter that appears only in the return type cannot be inferred from any argument, so whatever the caller supplies is accepted without checking, which is an unchecked assertion dressed up as a generic.'),
      q('Your package publishes both an ESM and a CommonJS build. What does the require condition need beside its .cjs output?', [
        'A single .d.ts file referenced from the top level types field',
        'A default export in both builds so the two shapes stay identical',
        'The bundler resolution mode recorded in the published tsconfig',
        'A .d.cts declaration file sitting next to the .cjs build output',
      ], 3, 'Under node16 resolution the file extension decides whether a declaration is read as ESM or CommonJS, so the CommonJS build needs its own .d.cts rather than sharing the .d.ts written for the ESM entry point.'),
      q('A refactor keeps the build green but quietly degrades an exported helper so callers now infer any. What catches it?', [
        'Running tsc with noEmit over the library source on every pull request',
        'Turning on isolatedDeclarations for the published build output',
        'Type level assertions on the inferred type, executed as part of CI',
        'Snapshotting the compiled JavaScript output on every tagged release',
      ], 2, 'any is assignable to everything, so the compiler reports nothing and runtime tests still pass, and only an explicit assertion comparing the inferred type against the expected one fails the build.'),
      q('A user reports a sixty line error naming DeepPartial and Omit before it truncates. What is the most direct authoring fix?', [
        'Split the function into overloads so the checker prints fewer candidates',
        'Give the shape a named interface and flatten it before it reaches the signature',
        'Raise the compiler\'s truncation limit so the full type is printed for them',
        'Replace the parameter type with unknown and validate the value at runtime',
      ], 1, 'The checker prints types as declared, so replacing a chain of type operators in the public signature with an evaluated, named shape turns the message into a readable property list and lets the error blame a single member.'),
      ]
    ),
    chapter(
      'Programming the Compiler Itself',
      'Driving TypeScript\'s own API to refactor, enforce, and extend types across a codebase far too large to change by hand.',
      [
      lesson('Reading Code with the Compiler API', 13, `
A product manager asks which pages still call \`trackEvent\` with the old three argument signature. You grep, get 612 hits, and most of them are comments, re-exports, or an unrelated helper someone named \`track\` in a test fixture. Grep reads characters. The compiler reads meaning, and it has already parsed every one of those files in order to type check them.

### A program, not a file

The unit of work is a \`Program\`: the whole file graph, plus the checker that understands it.

\`\`\`ts
import ts from 'typescript';

const parsed = ts.getParsedCommandLineOfConfigFile(
  '/repo/tsconfig.json', {}, ts.sys as any
)!;

const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();

parsed.fileNames.length;            // 1133, your source
program.getSourceFiles().length;    // 4812, plus lib and node_modules
\`\`\`

Those two numbers explain most of the cost. Building that program takes roughly 14 seconds and 1.4 GB on a repo that size, because it does the same work \`tsc\` does. If your question is purely syntactic, skip it entirely:

\`\`\`ts
const sf = ts.createSourceFile('order.ts', text, ts.ScriptTarget.Latest, true);
\`\`\`

That parses one file in single digit milliseconds and gives you a full tree with no checker at all. Choose deliberately.

### Walking the tree

\`\`\`ts
function walk(node: ts.Node, fn: (n: ts.Node) => void) {
  fn(node);
  ts.forEachChild(node, c => walk(c, fn));
}

for (const file of program.getSourceFiles()) {
  if (file.isDeclarationFile || file.fileName.includes('node_modules')) continue;

  walk(file, node => {
    if (!ts.isCallExpression(node) || node.arguments.length !== 3) return;

    const sym = checker.getSymbolAtLocation(node.expression);
    const target = sym && sym.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(sym)
      : sym;

    const decl = target?.declarations?.[0];
    if (!decl?.getSourceFile().fileName.endsWith('src/analytics/track.ts')) return;

    const { line } = file.getLineAndCharacterOfPosition(node.getStart());
    console.log(\`\${file.fileName}:\${line + 1}\`);
  });
}
\`\`\`

47 real call sites out of 612 grep hits. \`import { trackEvent as track }\` resolves back to the same declaration and is found. A local \`function trackEvent()\` in \`src/test/fixtures.ts\` is not.

### The alias trap

Delete the \`SymbolFlags.Alias\` branch and the script reports zero results. \`getSymbolAtLocation\` on an imported identifier returns the alias symbol, whose only declaration is the import statement in the importing file, so every call looks like it is declared exactly where it is used. This is the single most common reason a compiler API script quietly finds nothing and you assume the codebase is clean.

| You have | You want | Call |
|---|---|---|
| an identifier | what it refers to | \`checker.getSymbolAtLocation(node)\` |
| an import symbol | the real declaration | \`checker.getAliasedSymbol(sym)\` |
| any expression | its type | \`checker.getTypeAtLocation(node)\` |
| a type | something printable | \`checker.typeToString(type)\` |

### Positions include the whitespace

\`node.pos\` is where the node's leading trivia starts, so it swallows the blank line and the JSDoc block above a function. \`node.getStart()\` skips trivia. Print a range using \`pos\` and your tool reports the wrong line number and highlights an empty line above the code it meant to point at. Use \`getStart()\` for anything a human reads, and \`pos\` only when you deliberately want the comments too.

### What you get that grep never will

Ask whether an identifier is the same \`Order\` type as the one declared in \`src/domain\`, and the checker answers by identity: \`checker.getTypeAtLocation(node) === orderType\`. Ask whether a call really resolves to \`Promise<void>\` through three layers of generics, and \`checker.typeToString\` prints it. The API is verbose, thinly documented in places, and free to change shape between minor releases. It is also the only thing in your toolchain that agrees with \`tsc\` about what your code means, which is exactly what you need before you touch 1,133 files.
      `,
        [
          q('You need a list of every file in a 1,100 file repository that has a default export, and nothing more. Why is ts.createProgram a poor choice?', [
            'The question is syntactic, so a program pays a full type check cost you never use',
            'A program cannot see export statements until the checker has been asked for them',
            'createProgram only loads declaration files, so your own source is never parsed',
            'Default exports are erased while parsing, so a program reports them as anonymous',
          ], 0, 'Building a program parses and type checks the entire file graph, roughly 14 seconds and over a gigabyte on a repo that size, while ts.createSourceFile answers a purely syntactic question per file in milliseconds.'),
          q('Your script walks every call expression, resolves the callee with checker.getSymbolAtLocation, and compares the declaration file. It reports zero matches even though the calls exist. What is the likely cause?', [
            'createProgram skipped those files because tsconfig lists them under exclude',
            'getSymbolAtLocation returns undefined for any node inside a function body',
            'Imported names resolve to an alias symbol declared by the import statement',
            'The checker needs getTypeAtLocation first, or symbol lookups return stale data',
          ], 2, 'An identifier that came from an import resolves to an alias symbol whose only declaration is the import statement in the importing file, so you must follow it with getAliasedSymbol before comparing declaration files.'),
          q('A tool prints the source range of each matching function using node.pos and node.end. Every printed range keeps including a blank line and the JSDoc block above the function. Why?', [
            'end points at the token after the node, so one extra line is always captured',
            'getLineAndCharacterOfPosition counts from one, which shifts every range upward',
            'JSDoc is attached as a child, so forEachChild visits it before the function body',
            'pos starts at the leading trivia of the node, which covers comments and blanks',
          ], 3, 'node.pos marks the beginning of leading trivia, so comments and blank lines fall inside the range, while node.getStart() skips trivia and is what you want for output a human reads.'),
        ]
      ),
      lesson('Codemods at Scale with ts-morph', 13, `
\`Order.customerId\` should have been \`accountId\` since the day it was written, and it appears in 340 files. \`sed -i 's/customerId/accountId/g' -- src/**\` makes 1,912 replacements, including a \`customerId\` on the unrelated \`SupportTicket\` type, three log message strings, and a column name inside a SQL template. The build stays green, because both fields are \`string\`. You find out a fortnight later.

### Rename that follows references

\`\`\`ts
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

project.getSourceFileOrThrow('src/domain/order.ts')
  .getInterfaceOrThrow('Order')
  .getPropertyOrThrow('customerId')
  .rename('accountId');

await project.save();
\`\`\`

\`rename\` drives the language service's find all references, so it updates reads, writes, shorthand properties, destructuring patterns and JSDoc links, and touches nothing that merely shares the name. 214 edits across 137 files. \`SupportTicket.customerId\` is untouched, and so are the strings and comments, because \`renameInStrings\` and \`renameInComments\` both default to false.

### When there is no rename for it

A signature change needs a real transform. Moving \`logger.info(message, meta)\` to a single object argument:

\`\`\`ts
for (const file of project.getSourceFiles('src/**/*.ts')) {
  const calls = file.getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter(c => c.getExpression().getText() === 'logger.info')
    .filter(c => c.getArguments().length === 2);

  for (const call of calls.reverse()) {
    const [msg, meta] = call.getArguments().map(a => a.getText());
    call.replaceWithText(\`logger.info({ message: \${msg}, ...\${meta} })\`);
  }
}
\`\`\`

Two details in there are the whole lesson. The \`filter\` calls collect every target before anything mutates, and \`reverse()\` applies edits from the bottom of the file upward.

### The error everyone hits first

\`\`\`text
Error: Attempted to get information from a node that was removed or forgotten.
\`\`\`

\`replaceWithText\` reprints the file and reparses it. Every node object you were holding from before that edit now points into a tree that no longer exists, including the ones still queued in your loop. Collect the work first, apply it in reverse document order, and re-query the file if you need a second pass. Editing forward without re-querying gives you either that error or, worse, edits that land at stale offsets and silently corrupt the file.

### The cost nobody budgets for

Reparsing per edit is why a naive codemod over 28,000 call sites runs for 40 minutes. The work scales with edits, not with files. Batch every edit for a file into one pass, then move on, and let \`project.save()\` write only the files that actually changed. The same job finishes in under three minutes.

### Landing it

| Stage | What it proves |
|---|---|
| \`git diff --stat\` | the blast radius matches what you predicted |
| \`npx tsc --noEmit\` | no shape broke anywhere in the graph |
| \`npx prettier --write $(git diff --name-only)\` | the review is not 90 percent reflow noise |
| \`npm test\` | behaviour survived, which types cannot tell you |

Commit the codemod itself to \`scripts/codemods/rename-customer-id.ts\`. Someone will merge \`main\` into your branch, hit 60 conflicts across generated churn, and the only sane resolution is to take theirs and run your script again.

Split the pull request in two commits: one that is purely mechanical script output, one with the handful of sites you fixed by hand. A reviewer skims 137 mechanical files in a minute once they trust the script, then reads the ten interesting lines properly. A single mixed commit gets a rubber stamp, and the ten interesting lines go unread.

### Know when to stop

If a transform needs to understand intent, ts-morph will happily let you write something 80 percent right and silently wrong on the rest. Transform the part you can prove, and have the script insert \`// TODO(codemod): verify\` above every case it declined. A hundred honest markers beat a green build and four wrong rewrites you never find.
      `,
        [
          q('A codemod loops over an array of CallExpression nodes calling replaceWithText on each. The first edit works, the second throws: Attempted to get information from a node that was removed or forgotten. Why?', [
            'ts-morph allows only one edit per source file between calls to project.save',
            'replaceWithText reprints and reparses the file, invalidating the queued nodes',
            'The array was built from a different Project instance than the one being saved',
            'Call expressions cannot be replaced in place, only their arguments can change',
          ], 1, 'A structural edit reprints the file and rebuilds its tree, so every node captured before that edit refers to a tree that no longer exists, which is why you collect the targets first and apply them in reverse document order.'),
          q('Why does renaming Order.customerId through ts-morph rename beat a project wide sed of the same string?', [
            'sed cannot edit more than one file per invocation without a shell loop',
            'rename rewrites the emitted JavaScript too, so runtime keys stay aligned',
            'sed leaves the tsconfig include list stale, so the new name is not compiled',
            'rename resolves references, so an unrelated SupportTicket.customerId is left alone',
          ], 3, 'rename drives find all references through the language service, so it changes only the bindings that genuinely point at that property and leaves same named properties on other types, plus strings and comments, untouched.'),
          q('Your codemod is correct but takes 40 minutes across 28,000 call sites. Which change keeps it correct and makes it fast?', [
            'Group every edit for a file, apply them in one pass, then move to the next file',
            'Call project.save() after each individual edit so memory does not accumulate',
            'Load each file with createSourceFile instead, since ts-morph cannot edit at scale',
            'Raise the Node heap limit, because reparsing here is bound by garbage collection',
          ], 0, 'Each structural edit reprints and reparses the containing file, so the cost scales with the number of edits rather than the number of files, and batching per file collapses thousands of reparses into one.'),
        ]
      ),
      lesson('Lint Rules That Use the Type Checker', 13, `
One line in the checkout handler reads \`sendReceipt(order);\` with no \`await\`. It compiles, it passes review, and in production the Lambda freezes the event loop on return, so roughly one receipt in forty never sends. ESLint cannot see this from the syntax tree: \`sendReceipt(order)\` and \`formatTotal(order)\` are the same shape. The difference is the return type, and only the checker knows it.

### How typed linting works

\`@typescript-eslint/parser\` produces an ESTree tree for ESLint and keeps a map back to the real TypeScript nodes. From inside a rule you ask for the parser services and go straight to the checker.

\`\`\`ts
import { ESLintUtils } from '@typescript-eslint/utils';

const services = ESLintUtils.getParserServices(context);
const checker = services.program.getTypeChecker();
const tsNode = services.esTreeNodeToTSNodeMap.get(esNode);
const type = checker.getTypeAtLocation(tsNode);
\`\`\`

Everything else is ordinary ESLint.

### A rule worth writing

Your codebase returns \`Result<T, E>\` instead of throwing. A discarded \`Result\` is a swallowed failure, so make it an error.

\`\`\`ts
const createRule = ESLintUtils.RuleCreator(
  name => \`https://handbook.acme.dev/lint/\${name}\`
);

export default createRule({
  name: 'no-discarded-result',
  meta: {
    type: 'problem',
    docs: { description: 'A Result must be inspected, never dropped.' },
    messages: { discarded: 'This call returns Result and the value is thrown away.' },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      ExpressionStatement(node) {
        if (node.expression.type !== 'CallExpression') return;
        const tsNode = services.esTreeNodeToTSNodeMap.get(node.expression);
        const props = checker.getTypeAtLocation(tsNode).getProperties();
        if (!props.some(p => p.getName() === 'ok')) return;
        context.report({ node, messageId: 'discarded' });
      },
    };
  },
});
\`\`\`

\`ExpressionStatement\` is the entire trick. It is the node that means "this value went nowhere". Listen on \`CallExpression\` instead and you flag every correct call as well, because assignment and return look identical from there.

### The check that looks right and is not

The obvious first version tests \`type.aliasSymbol?.getName() === 'Result'\`. It passes its fixtures and then misses most real call sites, because \`aliasSymbol\` survives only while the alias itself does. Once a union has been narrowed, mapped, or returned through a generic, the checker hands you the bare \`{ ok: true, value: T } | { ok: false, error: E }\` with no alias attached. Testing structurally for the \`ok\` discriminant survives all of that.

### What it costs

| Question | Needs types |
|---|---|
| is this variable unused | no |
| are these imports sorted | no |
| does this call return a Promise | yes |
| is this value implicitly \`any\` | yes |

Enabling typed rules means ESLint builds a program. On a 1,100 file repo \`eslint .\` goes from 9 seconds to about 3 minutes, and the default Node heap can fall over halfway. \`projectService: true\` reuses a single language service instead of constructing a fresh program per tsconfig, and it is worth the upgrade on its own.

\`\`\`js
// eslint.config.js
languageOptions: {
  parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
}
\`\`\`

Scope typed rules to \`src/**\`. Point them at a config file that no tsconfig includes and ESLint stops with "file was not found by the project service", which is a poor first impression for a rule nobody asked for.

### Autofix or suggestion

If exactly one rewrite is correct, ship \`fix\`. If the right answer is a judgement call, and for a discarded \`Result\` it always is, ship a \`suggestion\` instead. An autofix that guesses eventually gets run with \`--fix\` across the whole repo at 2am by someone who then has to review 400 files they did not write. A rule that fires on real bugs and proposes nothing is far more welcome than one that rewrites your error handling for you.
      `,
        [
          q('Your rule must flag calls whose Result value is discarded. Which AST node should the rule listen for, and why?', [
            'CallExpression, because that is where the return type is finally known',
            'ReturnStatement, because a dropped Result always escapes through a return',
            'VariableDeclaration, because an unread binding is what discarding looks like',
            'ExpressionStatement, because that is the node meaning the value went nowhere',
          ], 3, 'An ExpressionStatement is a call evaluated purely for its effect with the resulting value thrown away, so listening there flags exactly the dropped results while assigned and returned ones pass.'),
          q('A typed rule identifies Result values with type.aliasSymbol?.getName() matching the string Result. It passes its fixtures and misses most real call sites. What went wrong?', [
            'getName returns the fully qualified name, so the comparison never matches',
            'aliasSymbol is often absent once a union has passed through inference',
            'aliasSymbol is populated only for interfaces, never for a type alias union',
            'The rule needed getContextualType, since getTypeAtLocation ignores aliases',
          ], 1, 'Type aliases are not preserved reliably, so once a union is narrowed, mapped or returned through a generic the checker hands back the bare union with no aliasSymbol, which is why a structural check for the ok discriminant is more robust.'),
          q('Turning on typed lint rules took eslint . from 9 seconds to about 3 minutes on a 1,100 file repo. Which change addresses the actual cause?', [
            'Add --cache, since typed rules are pure functions of each file contents',
            'Move the typed rules into a pre-commit hook and drop them from CI entirely',
            'Use projectService so one language service is reused instead of new programs',
            'Set skipLibCheck, which stops the parser from checking node_modules code',
          ], 2, 'The cost comes from building a TypeScript program for the lint run, and projectService reuses a single language service across files and runs instead of constructing a program per tsconfig.'),
        ]
      ),
      lesson('Language Service Plugins and Bespoke Editor Tooling', 13, `
\`t('checkout.button.pay')\` is just a string. Your editor offers no completion, go to definition does nothing, and \`t('checkout.button.py')\` renders the raw key to a paying customer. You could generate a union of all 4,100 keys, and it is worth considering, but a 4,100 member string union makes every completion popup in files that import \`t\` visibly slow. A language service plugin gives you the completions without the union.

### What a plugin actually is

\`tsserver\` is the process your editor talks to. A plugin is a node module named in tsconfig that receives the running \`LanguageService\` and returns a replacement, normally a proxy that forwards everything and overrides two or three methods.

\`\`\`json
{
  "compilerOptions": {
    "plugins": [
      { "name": "@acme/ts-plugin-i18n", "locales": "locales/en.json" }
    ]
  }
}
\`\`\`

\`\`\`ts
import type tsModule from 'typescript/lib/tsserverlibrary';

function init({ typescript: ts }: { typescript: typeof tsModule }) {
  function create(info: tsModule.server.PluginCreateInfo) {
    const proxy = Object.create(null) as tsModule.LanguageService;
    for (const k of Object.keys(info.languageService) as Array<keyof tsModule.LanguageService>) {
      const original = info.languageService[k] as any;
      proxy[k] = (...args: any[]) => original.apply(info.languageService, args);
    }

    const keys = Object.keys(loadLocales(info.config.locales)); // once, not per keystroke

    proxy.getCompletionsAtPosition = (fileName, position, options) => {
      if (!insideTranslateCall(info, fileName, position)) {
        return info.languageService.getCompletionsAtPosition(fileName, position, options);
      }
      return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: keys.map(name => ({
          name,
          kind: ts.ScriptElementKind.string,
          sortText: '0',
        })),
      };
    };

    return proxy;
  }
  return { create };
}

export = init;
\`\`\`

### The fact that catches everyone

A plugin changes the editor. It does not change \`tsc\`. Diagnostics you add through \`getSemanticDiagnostics\` appear as red squiggles and never fail CI, so a teammate can commit the exact line your plugin flagged and watch the build go green. If a rule must hold, it belongs in a type, a lint rule, or a build step. A plugin is for ergonomics, not for enforcement.

| Symptom | Cause |
|---|---|
| the plugin never loads | the editor is on its bundled TypeScript, set \`typescript.tsdk\` |
| nothing changed after you edited it | the server loaded it once, restart the TS server |
| green CI on code the editor flags | plugins are editor only, by design |
| the whole editor feels sluggish | you are doing file IO inside a per keystroke method |

### Debugging something with no console

A plugin that throws is swallowed. You get default behaviour back and no message anywhere, which is a miserable way to spend an afternoon. Turn the log on before you write a line of it.

\`\`\`bash
export TSS_LOG="-level verbose -file /tmp/tsserver.log"
\`\`\`

In VS Code the command palette has \`TypeScript: Open TS Server Log\` and \`TypeScript: Restart TS Server\`. You will run the restart after every single change, because there is no hot reload for plugins.

### Speed is the design constraint

\`getCompletionsAtPosition\` runs while the user is typing. Reading and parsing a 380 KB locales file inside it costs around 30 ms per character, which is exactly the lag people describe as "TypeScript is slow today" and never trace back to your plugin. Load once inside \`create\`, hold it in a closure, and refresh only when a file watcher fires.

### Ship both

Generate the key union into a \`.d.ts\` so a typo fails the build, and run the plugin for the completion list and go to definition into the JSON file. Correctness enforced by the compiler, ergonomics supplied by the editor, and neither one pretending to be the other.
      `,
        [
          q('Your language service plugin reports a bad translation key as a red squiggle. A teammate commits that exact line and CI passes. Why?', [
            'Plugins are loaded by tsserver for the editor, and tsc never loads them at all',
            'Plugin diagnostics are only warnings, and CI runs tsc without the strict flag',
            'The plugin ran before the commit, so its cached diagnostics were already stale',
            'CI checks out a tsconfig where the plugins array is stripped during install',
          ], 0, 'A plugin proxies the language service that powers the editor, so its diagnostics never reach a tsc build, and anything that must fail CI belongs in a type, a lint rule, or a build step instead.'),
          q('You edit your plugin completion logic, save the file, and the editor behaves exactly as before. What is the first thing to try?', [
            'Delete the tsbuildinfo file, which caches completion entries for the project',
            'Rebuild the project, since plugins read their completions from emitted output',
            'Restart the TS server, because it loaded the plugin once when it started up',
            'Clear the workspace cache, which pins the plugin config read from tsconfig',
          ], 2, 'tsserver loads plugin modules when it starts a project and offers no hot reload, so an edited plugin takes effect only after the TypeScript server is restarted.'),
          q('People report the editor feels sluggish after your plugin ships. Your getCompletionsAtPosition parses a 380 KB JSON file on every call. Why is that so costly?', [
            'Completions are recomputed for every open file whenever any file changes',
            'That method runs on keystrokes, so the parse cost lands on every character',
            'JSON parsing blocks the checker, forcing a full program rebuild each time',
            'The proxy forwards each call twice, once to the service and once to your code',
          ], 1, 'getCompletionsAtPosition is invoked as the user types, so any per call file IO multiplies by every keystroke, which is why the data should be loaded once in create and refreshed only when a watcher fires.'),
        ]
      ),
      ],
      [
      q('You must change 300 call sites mechanically and want real confidence before merging. Which sequence gives the most signal?', [
        'Run the codemod, format everything, then merge because tsc is already green',
        'Run the codemod, check git diff --stat, run tsc --noEmit, format, run tests',
        'Hand edit ten files, confirm they compile, then sed the remaining call sites',
        'Run the codemod, run the tests, and skip tsc since the tests exercise the code',
      ], 1, 'The diff stat proves the blast radius matched your prediction, tsc proves no shape broke across the graph, formatting keeps the review readable, and the tests cover the behaviour that types cannot see.'),
      q('A rule must never be violated on the main branch. Which mechanism is the wrong one to rely on for that?', [
        'A lint rule that reads the type checker and runs in the CI pipeline',
        'A branded type that makes the invalid call fail to compile under tsc',
        'A build step script that walks the program and exits non zero on a hit',
        'A language service plugin that reports the violation as a diagnostic',
      ], 3, 'Plugins run only inside the editor through tsserver, so their diagnostics never reach a tsc or CI run and cannot block a merge, which makes them an ergonomics tool rather than an enforcement one.'),
      q('Which of these tasks genuinely requires the type checker rather than a syntax only tool?', [
        'Deciding whether an unawaited call returns a Promise through a generic wrapper',
        'Listing every file in the repository that contains a default export statement',
        'Finding all template literals longer than 200 characters across the source tree',
        'Reporting import statements that are not sorted alphabetically by module path',
      ], 0, 'Whether an expression is thenable depends on its resolved type, which only the checker can compute, while the other three are answerable from the syntax tree of a single file.'),
      q('A compiler API script and a ts-morph codemod both need to know that two identifiers refer to the same declaration. What do both rely on?', [
        'Text matching of the identifier plus the module specifier it was imported from',
        'The emitted JavaScript, where bundlers have already collapsed the aliases away',
        'Symbol resolution through the checker, which follows imports and re-exports',
        'The tsconfig paths mapping, which records where each exported name originates',
      ], 2, 'Both tools sit on the same TypeScript checker, and symbol resolution is what turns an identifier into the declaration it actually binds to, following aliases and re-exports rather than matching text.'),
      ]
    ),
  ],
  final: [
    q('TypeScript catches a bug that JavaScript would only surface at runtime. When does the check happen?', [
      'At runtime, via generated assertions',
      'At compile time only — types are erased and nothing is checked while the program runs',
      'On the first call to the function',
      'Whenever a value crosses a module boundary',
    ], 1, 'tsc checks and then deletes the types, so all safety is static and untrusted input still needs runtime validation.'),
    q('Which tsconfig option makes users[0] evaluate to User | undefined?', [
      'strictNullChecks',
      'noImplicitAny',
      'exactOptionalPropertyTypes',
      'noUncheckedIndexedAccess',
    ], 3, 'strictNullChecks handles declared nullability; only noUncheckedIndexedAccess adds undefined to index and Record lookups.'),
    q('You need to name the type "idle" | "loading" | "ready". Which tool do you use?', [
      'A type alias — interfaces can only describe object shapes',
      'An interface with optional properties',
      'A Record with boolean values',
      'An enum, since unions cannot hold strings',
    ], 0, 'Only a type alias can name a union; interfaces are limited to object shapes and merging.'),
    q('A state type uses loading, data, and error as independent optional fields. What is the core problem?', [
      'Optional fields are slower to check',
      'The fields cannot be narrowed with typeof',
      'It permits impossible combinations, so every consumer must defensively guess the real state',
      'TypeScript cannot infer optional properties',
    ], 2, 'Three independent flags encode eight states when only a few are real; a discriminated union makes the rest unrepresentable.'),
    q('What makes a switch over a discriminated union fail to compile when a new variant is added?', [
      'A default branch that throws',
      'Assigning the value to a never-typed variable in the default branch',
      'Marking the discriminant as readonly',
      'Annotating each case with its variant type',
    ], 1, 'Once every known case is handled the value narrows to never, so an unhandled variant no longer fits that assignment.'),
    q('A narrowed session.user is read after a call that may have set it to null, and TypeScript reports nothing. The cleanest fix is to', [
      'destructure user into a const local before the check',
      'add a non-null assertion with session.user!.name',
      'cast with as User',
      'wrap logVisit in a try/catch',
    ], 0, 'TypeScript keeps property narrowings across calls, so the guarantee only becomes real once the value lives in a const local nothing else can reassign.'),
    q('Which type should you use for a value from an untrusted source before validating it?', [
      'any, so you can inspect it freely',
      'object, to guarantee it is not a primitive',
      'never, since its type is not yet established',
      'unknown, which accepts any value but permits no operations until narrowed',
    ], 3, 'unknown forces a narrowing step, whereas any silently disables checking for everything derived from the value.'),
    q('function first<T>(arr: T[]): T | undefined — what does the type parameter accomplish?', [
      'It makes the function faster for large arrays',
      'It constrains arr to arrays of objects',
      'It links the input element type to the return type, so the caller keeps full type information',
      'It allows the function to be called without arguments',
    ], 2, 'A type parameter earns its place by appearing in at least two positions and relating them.'),
    q('You need the shape a create endpoint accepts: User without its server-generated id. Which is best?', [
      'Omit<User, "id">',
      'Partial<User>',
      'Record<keyof User, unknown>',
      'A hand-written CreateUser interface',
    ], 0, 'Deriving from User keeps the two in step, whereas a parallel interface drifts the first time a field is added.'),
    q('const [user, setUser] = useState(null) rejects every later setUser call. The fix is', [
      'wrapping setUser in useCallback',
      'useState<User | null>(null), because inference takes the state type from the initial value',
      'moving the state into useReducer',
      'initialising with undefined instead of null',
    ], 1, 'null and [] infer to useless types, so those two initial values need an explicit type argument.'),
    q('type ToArray<T> = T extends unknown ? T[] : never. What does ToArray<string | number> evaluate to?', [
      '(string | number)[]',
      'never[]',
      'string[] | number[]',
      'unknown[]',
    ], 2, 'A naked type parameter makes the conditional distribute, so it runs once per union member and the results are unioned back together.'),
    q('You want a config object checked against Record<string, string> without losing its literal keys and values. Which do you use?', [
      'satisfies Record<string, string>',
      'as const on its own',
      'a : Record<string, string> annotation',
      'as Record<string, string>',
    ], 0, 'satisfies verifies the value against the type but leaves inference intact, whereas an annotation replaces it and a cast checks nothing.'),
    q('UserId and OrderId are both aliases of string, so passing one where the other is expected compiles. What fixes it?', [
      'Marking both aliases readonly',
      'Declaring them as interfaces instead of type aliases',
      'Enabling strictNullChecks',
      'Branding each with a unique phantom property so structural typing stops treating them as the same type',
    ], 3, 'Structural typing compares shape, so two aliases of string are identical until an intersected brand makes them distinct.'),
    q('A refactor silently changes a helper\'s return type to any and every runtime test still passes. What catches it?', [
      'Adding more assertions about the returned value',
      'A type-level assertion such as expectTypeOf(...).not.toBeAny() checked by tsc in CI',
      'Enabling sourceMap so stack traces point at the source',
      'Running tsc in watch mode during development',
    ], 1, 'Runtime tests cannot observe types, so only an assertion evaluated by the type checker can fail when a signature degrades to any.'),
      q('A schema gives `theme` a `.default(\'light\')` and reads `retries` with `.transform(Number)`. You type your SDK\'s options parameter as `z.infer<typeof schema>`, and callers now report that they are forced to pass `theme` and that their `retries` string is rejected. What went wrong?', [
      '`.default()` and `.transform()` only take effect under `safeParse`, so the SDK has to parse before the two ends agree.',
      'The schema needs `as const` before inference runs, otherwise keys with defaults are emitted as required properties.',
      '`z.infer` is the output type, which describes data after parsing, so the callable surface should use `z.input` instead.',
      '`z.infer` widens literal unions to `string`, which is why the enum member and the numeric field both stop matching.',
    ], 2, 'A schema with defaults and transforms is a function rather than a shape, so it has two types: `z.input` is what a caller may send, and `z.infer` (which equals `z.output`) is what your code holds after parsing, with defaults filled in and transforms already applied.'),
    q('With `strictFunctionTypes` on, a value whose `handle` takes `MouseEvent` is assignable to `{ handle(e: Event): void }` but not to `{ handle: (e: Event) => void }`. The shapes and the runtime risk are identical, so what explains the different verdicts?', [
      'Members written with method syntax stay bivariant, an exemption kept so declarations like `Array.push` and `Promise.then` keep working.',
      'Property syntax holds an arrow function, and arrow functions are compared by their `this` type rather than by their parameters.',
      '`strictFunctionTypes` applies only to standalone function declarations, so a parameter check inside an object type is skipped.',
      'Method parameters are compared covariantly, so narrowing a parameter is the one direction that assignability always permits.',
    ], 0, '`strictFunctionTypes` enforces contravariant parameter checking only for members declared with property syntax, deliberately exempting method syntax because the built in libraries declare mutating methods that way, which is why declaring callbacks as properties is the rule that buys you the strict check.'),
    q('Your Order union gives each status its own variant, and every `switch` ends in an `assertNever` so no state can be forgotten. A report still shows an order that went from `cart` straight to `paid` without ever being placed. Why did the union not prevent that?', [
      '`assertNever` only throws at runtime, so the compiler was never checking those switches for missing cases to begin with.',
      'Exhaustiveness constrains reads only; nothing stops code building a `paid` object, so writes need transitions typed on the source state.',
      'The discriminant has to sit on a `readonly` property before the checker will track which variant a given value came from.',
      '`Extract<Order, { status: \'paid\' }>` drops the discriminant, so every other variant of the union becomes assignable to it.',
    ], 1, 'A discriminated union plus an exhaustive switch stops you reading a field a state does not have, but it says nothing about which state may follow which, so illegal writes are only ruled out when each transition is a function whose parameter type is the source state.'),
    q('Clearing a coupon sets `coupon` to `undefined` on a domain object that is then sent straight to a PATCH endpoint, and the customer keeps the discount forever with nothing throwing anywhere. Which change actually fixes it?', [
      'Pass a replacer to `JSON.stringify` that preserves keys holding undefined, so the endpoint receives the cleared field.',
      'Mark `coupon` as `readonly` so the clearing path has to build a fresh object instead of mutating the one it was handed.',
      'Widen the field to `coupon: CouponCode | undefined` so the property is always present in the type and in the payload.',
      'Have the outbound mapper emit an explicit `null` for a cleared coupon, because `JSON.stringify` drops keys whose value is undefined.',
    ], 3, '`JSON.stringify({ coupon: undefined })` produces `{}`, and an absent key means "leave this alone" to a PATCH endpoint, so the wire type has to say `null` where the domain type says absent, which is exactly the translation the outbound mapper exists to make.'),
    q('A status union appears in a parameter of `configure()` and in the return type of `getStatus()` in your published package. You ship a patch that adds one new member to that union. What happens to consumers?', [
      'The parameter side stays safe, the return side breaks: exhaustive switches over the returned value stop covering every case.',
      'Both sides break, because widening a union changes assignability in each direction and no existing call site keeps compiling.',
      'Both sides stay safe, because adding a member takes nothing away from what consumers were already allowed to write or read.',
      'The parameter side breaks, the return side stays safe: callers are now obliged to handle the new member when they call in.',
    ], 0, 'A type in a parameter position is something you accept and a type in a return position is something you promise, so widening a union is harmless for input but breaking for output, where every consumer\'s exhaustive switch suddenly has an unhandled member.'),
    q('A ts-morph codemod collects every matching call in a file, then rewrites them from the top down with `replaceWithText`. The second rewrite throws "Attempted to get information from a node that was removed or forgotten". What is going on?', [
      'The nodes belong to a `Project` that has already been saved, so each one must be refetched with `getSourceFileOrThrow` first.',
      'Descendant queries are lazy, so the matches have to be materialised into an array before any edit is applied to the file.',
      'Each `replaceWithText` reprints and reparses the file, so the queued nodes point into a discarded tree; apply edits bottom up.',
      'Two rewrites covered overlapping ranges, so ts-morph discarded the later node rather than writing text at a stale offset.',
    ], 2, '`replaceWithText` reprints the source file and reparses it, which invalidates every node object captured before that edit, so a codemod collects all its targets first and then applies them in reverse document order to keep the remaining positions valid.'),
    q('Why annotate the return type of an exported function even though TypeScript could infer it?', [
      'It pins the public contract, so a changed return is caught at the function',
      'Inferred return types are left out of the emitted .d.ts files',
      'The compiler cannot infer return types across module boundaries',
      'Annotated functions run faster because the engine skips checks',
    ], 0, 'Writing the return type fixes the contract callers rely on, so an edit that changes what the body returns is reported at the function instead of silently changing every caller\'s type.'),
    q('Under `strict`, what does TypeScript report for `function parse(input) { return input.trim(); }`?', [
      'Nothing: input is inferred as string from the .trim() call',
      'Nothing: input is quietly typed as unknown instead',
      'An error: \'input\' implicitly has an \'any\' type',
      'An error at each call site that passes a non-string',
    ], 2, 'noImplicitAny, part of strict, rejects a parameter whose type cannot be inferred; TypeScript never infers a parameter\'s type from how the body uses it.'),
    q('`const opts = { align: \'left\' }; setAlign(opts.align);` fails, where setAlign takes `\'left\' | \'right\'`. Why?', [
      'const objects are frozen, so their properties cannot be passed on',
      'Object properties stay mutable, so align is widened to string',
      'Object literals infer every property as unknown by default',
      'setAlign needs a variable, not a property access, as its argument',
    ], 1, 'const fixes only the binding; opts.align could still be reassigned, so it is inferred as string. `as const` or an annotation on opts keeps the literal type.'),
    q('`interface A { id: string }` is followed by `interface B extends A { id: number }`. What happens?', [
      'B\'s id becomes string | number, merging both declarations',
      'B\'s id silently becomes never, as with an intersection',
      'B\'s id is number, overriding the string from A',
      'B\'s declaration is an error: it incorrectly extends A',
    ], 3, 'extends requires each redeclared member to be assignable to the inherited one, so the conflict is reported on B itself; an intersection of the same two types would instead quietly produce id: never.'),
    q('You replace an enum with `const Role = { Admin: \'admin\', User: \'user\' } as const`. Which declaration gives the union `\'admin\' | \'user\'`?', [
      'type Role = (typeof Role)[keyof typeof Role]',
      'type Role = Extract<keyof typeof Role, string>',
      'type Role = ReturnType<typeof Role>',
      'type Role = Role[keyof typeof Role]',
    ], 0, 'keyof typeof Role gives the keys \'Admin\' | \'User\', and indexing the object\'s type with them yields the values; the other forms produce the keys, a non-function error, or a circular reference.'),
    q('Given `type Fish = { swim(): void }` and `type Bird = { fly(): void }`, what is the type of `pet` inside `if (\'swim\' in pet)` when pet is `Fish | Bird`?', [
      'Bird',
      'Fish | Bird',
      'Fish',
      'never',
    ], 2, 'The in operator narrows a union to the members that declare that property, so only Fish remains in the true branch and Bird in the else branch.'),
    q('`document.getElementById(\'app\')!.append(el)` compiles. What does the `!` do if the element is missing at runtime?', [
      'It creates an empty element so that append still succeeds',
      'Nothing: it is erased, so append throws a TypeError on null',
      'It skips the append call, as optional chaining would',
      'It throws a descriptive assertion error before append runs',
    ], 1, 'The non-null assertion only tells the checker to drop null from the type and emits no code, so a missing element still crashes at the call.'),
    q('`value` is `unknown`. Inside `if (typeof value === \'object\' && value !== null && \'id\' in value)`, what is the type of `value.id`?', [
      'string',
      'any',
      'string | number',
      'unknown',
    ], 3, 'The checks prove value is an object with an id property but say nothing about what id holds, so it stays unknown until you narrow it further.'),
    q('User is `{ name: string; address: { city: string } }` and `u` is typed `Readonly<User>`. Which line compiles?', [
      'u.name = \'Ali\';',
      'u.address = { city: \'Lahore\' };',
      'u.address.city = \'Karachi\';',
      'delete u.address;',
    ], 2, 'Readonly<T> marks only the top-level properties readonly, so the nested address object can still be changed; locking every level needs a recursive DeepReadonly.'),
    q('`type K = keyof ({ a: string; b: number } | { b: boolean; c: string })`. What is K?', [
      '\'b\'',
      '\'a\' | \'b\' | \'c\'',
      '\'a\' | \'c\'',
      'never',
    ], 0, 'A value of a union type is only guaranteed to have the keys that every member shares, so keyof a union gives just the common keys.'),
    q('`function len<T>(x: T) { return x.length; }` is rejected. Which change fixes it while keeping the function generic and type-safe?', [
      'Annotate the return type of len as number',
      'Constrain the parameter: <T extends { length: number }>',
      'Call it as len<string>(...) at every call site',
      'Give the parameter a default: <T = string>',
    ], 1, 'Without a constraint T could be any type, so .length is not known to exist; the constraint admits only types with a numeric length while still preserving the caller\'s own type.'),
    q('`const users = ids.map(async (id) => getUser(id));` where getUser returns `Promise<User>`. What is the type of users?', [
      'User[], because map awaits each callback',
      'Promise<User[]>, one promise for the whole list',
      'Promise<Promise<User>>[], nested promises',
      'Promise<User>[], an array of promises',
    ], 3, 'Every async callback returns a promise, so map produces an array of promises; `await Promise.all(users)` turns it into User[].'),
    q('You move an inline `onChange` handler for an `<input>` into a named function. How should its parameter be typed?', [
      'e: React.ChangeEvent<HTMLInputElement>',
      'e: React.FormEvent<HTMLFormElement>',
      'e: React.MouseEvent<HTMLInputElement>',
      'e: Event & { target: HTMLInputElement }',
    ], 0, 'Inline handlers get their event type from context; once extracted, the handler must declare a ChangeEvent for an input element, which also types e.target.value as a string.'),
    q('A reducer\'s actions are typed `{ type: \'add\'; item: Item } | { type: \'remove\'; id: string } | { type: \'clear\' }`. What does that buy inside `switch (action.type)`?', [
      'The reducer no longer needs any case for \'clear\'',
      'React validates each action\'s shape again at runtime',
      'Each case can reach only its own action\'s fields',
      'Dispatch calls become synchronous instead of batched',
    ], 2, 'Switching on the type discriminant narrows action, so action.id exists only in the \'remove\' case, and a misspelled type or missing field is a compile error.'),
    q('What does type Handler = `on${Capitalize<\'click\' | \'focus\'>}` evaluate to?', [
      '\'onclick\' | \'onfocus\', all in lower case',
      '\'onClick\' | \'onFocus\', one literal per member',
      '\'onClick\' & \'onFocus\', an intersection of both',
      'string, since unions cannot appear in templates',
    ], 1, 'Substituting a union into a template literal type produces one string literal per member, and Capitalize upper-cases the first letter of each.'),
    q('Given `type Shape = { kind: \'circle\'; r: number } | { kind: \'square\'; side: number }`, what does `Extract<Shape, { kind: \'circle\' }>` produce?', [
      '{ kind: \'circle\' | \'square\' }',
      '{ kind: \'circle\' } & { radius?: number }',
      '{ kind: \'square\'; side: number }',
      '{ kind: \'circle\'; r: number }',
    ], 3, 'Extract keeps the members of Shape that are assignable to { kind: \'circle\' }, so it returns the whole circle variant, including r.'),
    q('Given type After<T> = T extends `user_${infer Rest}` ? Rest : never, what is After<\'user_42\' | \'order_7\'>?', [
      '\'42\'',
      '\'42\' | \'7\'',
      '\'user_42\'',
      'never',
    ], 0, 'The conditional type distributes over the union: \'user_42\' matches the pattern and yields \'42\', while \'order_7\' does not and yields never, which drops out of the result.'),
    q('What does `skipLibCheck: true` give up in exchange for faster type-checking?', [
      'Types from node_modules are ignored, so imports become any',
      'Your own .ts source files are no longer type-checked',
      'Errors inside .d.ts files, including your own, go unreported',
      'Declaration files are no longer emitted for your package',
    ], 2, 'skipLibCheck skips checking the contents of declaration files while still using their types, so a mistake inside any .d.ts, yours included, is no longer reported.'),
    q('Why pin `typescript` to an exact version such as 5.6.3 in devDependencies rather than a caret range?', [
      'npm ignores caret ranges for anything in devDependencies',
      'Exact versions make tsc check the project noticeably faster',
      'Editors refuse to load a TypeScript installed from a range',
      'A minor release can add errors, so a fresh install may break',
    ], 3, 'Minor TypeScript releases routinely tighten inference, so a caret range lets a machine without the lockfile pull a newer compiler and see errors nobody else has.'),
    q('A handler validates `req.body` with a zod schema and must answer 400 on bad input without a try/catch. Which call fits?', [
      'schema.parse(req.body), which returns null on failure',
      'schema.safeParse(req.body), then check result.success',
      'req.body as z.infer<typeof schema>, then use it directly',
      'schema.shape(req.body), which narrows req.body in place',
    ], 1, 'safeParse never throws; it returns { success: true, data } or { success: false, error }, so the handler can branch to a 400 with the issues.'),
    q('Where in an application should incoming JSON be parsed with a schema?', [
      'Once, at the boundary where it enters, so inner code gets typed values',
      'Inside every function that reads it, just before each use',
      'Only in tests, since types already cover production code',
      'In the database layer, after the data has been stored',
    ], 0, 'Parsing at the edge turns untrusted input into a checked value once, so everything inside can rely on its type; scattered checks let one path skip them.'),
    q('`[1, 2, 3].forEach((n) => console.log(n))` passes a one-parameter callback where forEach supplies three arguments. Why does it compile?', [
      'forEach is declared with any, so its callback is never checked',
      'Extra arguments are only an error when strict mode is off',
      'TypeScript rewrites the callback to accept all three arguments',
      'Callbacks may declare fewer parameters than are passed to them',
    ], 3, 'Ignoring extra arguments is always safe in JavaScript, so a function with fewer parameters is assignable to a function type that supplies more.'),
    q('`const handlers: Array<() => void> = [() => 42];` compiles. Why?', [
      '42 is converted to undefined when the array is created',
      'Arrays of functions are never checked for their return types',
      'A void return in a function type means the result is ignored',
      'void is treated as an alias of any in return positions',
    ], 2, 'A function type returning void promises only that callers will not use the result, so a function that returns something is still assignable and its value is simply ignored.'),
    q('`const DEFAULTS = Object.freeze({ headers: { auth: \'\' } });` Later, a handler runs `DEFAULTS.headers.auth = token;`. What happens?', [
      'TypeScript rejects it, since freeze makes every level readonly',
      'It compiles and runs; freeze is shallow, so headers still changes',
      'It compiles, then throws at runtime because headers is frozen',
      'It compiles, but the write is silently dropped at runtime',
    ], 1, 'Object.freeze locks only the top-level properties, both at runtime and in its Readonly<T> return type, so the nested headers object stays shared and mutable.'),
    q('Which order type makes it impossible to create a shipped order without a tracking number?', [
      '{ status: \'placed\' | \'shipped\'; trackingNumber?: string }',
      '{ status: \'placed\' | \'shipped\'; trackingNumber: string | undefined }',
      '{ status: \'placed\' | \'shipped\'; trackingNumber: string | null }',
      '{ status: \'placed\' } | { status: \'shipped\'; trackingNumber: string }',
    ], 3, 'Giving each status its own variant ties trackingNumber to the shipped state, so a shipped order without one cannot be written; the single-shape versions allow every combination.'),
    q('You want to retire an exported `retries` option in favour of `retry` without breaking anyone\'s build. What is the right first step?', [
      'Mark it /** @deprecated */ and keep it working for now',
      'Delete it in a patch release and note it in the changelog',
      'Change its type to never so every caller gets an error',
      'Rename it and publish the change as a minor version',
    ], 0, 'A @deprecated tag makes editors strike the option through and point to its replacement while builds stay green; removal waits for the next major version.'),
    q('A library is published with `declaration: false`, so its package ships only .js files. What do TypeScript consumers get when they import it?', [
      'Full types, read from the package\'s source maps',
      'Types inferred automatically from the published JavaScript',
      'A missing declaration file error, or imports typed as any',
      'A runtime error the first time the package is imported',
    ], 2, 'Without .d.ts files the compiler has no types for the package, so strict projects report that no declaration file was found and looser ones fall back to any.'),
    q('A public function takes an `options` parameter whose type the package does not export. What problem does that cause consumers?', [
      'The function cannot be called from outside the package',
      'They cannot name the type to annotate their own variables',
      'TypeScript treats the options parameter as any for them',
      'Their builds fail until they install the package\'s source',
    ], 1, 'Callers can still pass an object literal, but to store options in a variable or wrap the function they must resort to Parameters<typeof fn>[0]; exporting the type fixes that.'),
    q('A ts-morph codemod runs without errors and logs every rename, but no file on disk has changed. What was most likely left out?', [
      'Running tsc --noEmit before the codemod started',
      'Passing skipLibCheck: true when creating the Project',
      'Wrapping all of the edits in a single transaction',
      'Calling await project.save() after making the edits',
    ], 3, 'ts-morph applies edits to its in-memory project, and nothing is written to disk until project.save() (or a source file\'s save) is called.'),
    q('A codemod selects calls with `call.getExpression().getText() === \'track\'`. What does that get wrong?', [
      'Calls inside template literals, which the AST does not contain',
      'Nothing, since getText resolves the symbol behind the name',
      'It misses aliased imports and matches unrelated functions named track',
      'It only fails for .tsx files, which ts-morph cannot parse',
    ], 2, 'getText compares characters, not declarations, so `import { track as t }` is missed and any other function named track matches; resolving the symbol to its declaration fixes both.'),
  ],
});
