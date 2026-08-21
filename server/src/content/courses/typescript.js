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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
});
