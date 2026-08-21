import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: "software-testing-qa",
  title: "Software Testing & QA",
  category: "QA",
  level: "Beginner → Intermediate",
  duration: "6 weeks",
  accent: "rose",
  coverKey: "software-testing-qa",
  summary:
    "Learn to find bugs before users do, and to write automated tests that stay useful instead of becoming a maintenance burden.",
  description:
    "You write unit, integration, and end-to-end tests, and learn the judgement behind them — what deserves a test, what does not, and why a suite everyone ignores is worse than no suite at all.",
  chapters: [
    chapter(
      "What Testing Is Actually For",
      "The purpose of testing, how to think about coverage, and writing a bug report worth acting on.",
      [
        lesson("Why Tests Exist", 11, `
Testing is not about proving software works. You cannot prove that — the input space is effectively infinite. Testing is about **buying confidence to change things**.

That reframing matters. It explains why a test suite that never fails may be worthless, and why chasing 100% coverage is not the goal.

### What a good suite buys you

- **Freedom to refactor.** You can restructure code and know within seconds whether you broke behaviour.
- **Executable documentation.** A test named \`rejects a booking in the past\` states a rule no comment will keep current.
- **Regression protection.** A bug fixed with a test cannot silently return; a bug fixed without one usually does.
- **Faster debugging.** A failing test localises a problem to a few lines instead of a whole system.

### Verification and validation

Two different questions, often confused:

- **Verification** — did we build the thing right? (Does the code match the spec?)
- **Validation** — did we build the right thing? (Does the spec solve the user's problem?)

A feature can pass every test and still be useless. Automated tests handle verification well and validation not at all — which is why manual and exploratory testing never fully goes away.

### Cost rises the later you find it

A bug caught while writing the code costs minutes. In code review, an hour. In production, it costs an incident, a hotfix, a deploy, and possibly customer trust. The economics are the entire argument for testing early.

### What testing cannot do

Be honest about the limits:

- Tests only check what you thought to check. They cannot find a requirement nobody wrote down.
- Passing tests do not mean bug-free — only that known cases behave.
- Tests can be wrong. A test asserting incorrect behaviour locks the bug in place.
- A slow, flaky suite is a **net negative**: people stop running it, then start ignoring it, then start disabling it.

### The judgement

Test what would genuinely hurt if it broke: money, authentication, permissions, data loss, and any rule with real complexity. Do not test that a framework works, or that a getter returns a field.

The measure of a suite is not its size. It is whether the team trusts it enough to deploy on a Friday.
        `),
        lesson("The Testing Pyramid", 12, `
Tests come in layers, and the mix matters more than the total.

\`\`\`
        ╱╲          E2E — few, slow, high confidence
       ╱  ╲
      ╱────╲        Integration — some, moderate
     ╱      ╲
    ╱────────╲      Unit — many, fast, narrow
\`\`\`

### The three layers

**Unit** — one function or component in isolation. Milliseconds. Pinpoints failure exactly, but proves nothing about whether the pieces fit together.

**Integration** — several pieces together: a route with its validation and database. Hundreds of milliseconds. This layer catches the largest share of real bugs, because most bugs live at the boundaries between units rather than inside them.

**End-to-end** — a real browser driving the real app. Seconds to minutes. The only layer that proves the system genuinely works, and the most expensive and brittle.

### Why the shape matters

Invert it — mostly E2E, few unit tests — and you get the **ice-cream cone**: a suite taking 40 minutes, failing randomly, where a single broken selector fails thirty tests and nobody can tell what actually broke.

Go too far the other way — thousands of unit tests, no integration — and every unit passes while the app is broken, because the units were tested against mocks that do not match reality.

### A practical target

| Layer | Share | Rule of thumb |
|---|---|---|
| Unit | ~70% | Logic, edge cases, pure functions |
| Integration | ~20% | API routes, DB queries, module boundaries |
| E2E | ~10% | The handful of flows that must never break |

Treat these as direction, not doctrine. A data-processing library is nearly all unit tests; a thin CRUD app is mostly integration.

### Choose E2E flows deliberately

Ask: if this broke silently for a day, would it be a disaster? For most products that is sign-up, sign-in, checkout, and one core action. Five to ten flows, not fifty.

### The speed rule

Unit tests should run in **under 10 seconds** for the whole suite. Past that, people stop running them locally and only discover failures in CI — which defeats most of the point. Suite speed is a feature, and it is worth actively protecting.
        `),
        lesson("Test Cases and Bug Reports", 11, `
Before automating anything, learn to describe a test and a bug precisely. This skill transfers to every tool.

### Anatomy of a test case

- **Title** — the behaviour, not the mechanics. "Rejects sign-up with an already-registered email".
- **Preconditions** — what must be true first.
- **Steps** — numbered, unambiguous.
- **Expected result** — one specific outcome.

"Test the login page" is not a test case. It has no expected result, so it can never definitively pass or fail.

### Pick cases with technique, not intuition

**Equivalence partitioning.** Group inputs that should behave identically and test one from each group. For an age field accepting 18–65: one below, one inside, one above. Testing 19, 20, 21, 22 adds nothing.

**Boundary value analysis.** Bugs cluster at edges, because \`>\` and \`>=\` are easy to confuse. For 18–65, test **17, 18, 65, 66**. This one technique finds more defects per test than any other.

**Also always test:**

| Case | Why |
|---|---|
| Empty | Missing required-field handling |
| Zero and negative | Common \`if (value)\` bug |
| Very long input | Truncation, layout breakage |
| Special characters, emoji | Encoding failures |
| Duplicate submission | Double-charging |

### Writing a bug report that gets fixed

A good report contains:

1. **Title** — what happens and where. "Checkout: total ignores discount when a coupon is applied after quantity change"
2. **Environment** — browser, OS, device, build, account type
3. **Steps to reproduce** — numbered, from a known starting state
4. **Expected vs actual** — both stated explicitly
5. **Evidence** — screenshot, video, console errors, request/response
6. **Frequency** — always, or 1 in 10?

The one that gets skipped is **expected vs actual**. Without it the developer has to guess your intent, and often "fixes" something you did not report.

### Reproduce before you file

An unreproducible report costs more than it saves. Try three times. If it only happens sometimes, say so and describe what differed — intermittent bugs are often the most serious ones.

### Severity is not priority

- **Severity** — how bad the effect is.
- **Priority** — how soon it should be fixed.

A crash in a feature two people use is high severity, low priority. A typo on the pricing page is low severity, high priority. Conflating them causes the wrong work to happen first.
        `),
      ],
      [
        q("Why is chasing 100% code coverage a poor goal?", [
          "It is impossible",
          "Coverage measures lines executed, not whether behaviour is correctly asserted",
          "It slows the build",
          "Tools cannot measure it accurately",
        ], 1, "Code can be executed by a test that asserts nothing meaningful, so high coverage does not imply real verification."),
        q("For a field accepting ages 18-65, which set best applies boundary value analysis?", [
          "18, 30, 65",
          "1, 50, 100",
          "17, 18, 65, 66",
          "20, 21, 22, 23",
        ], 2, "Bugs cluster where comparisons flip, so testing just inside and just outside each edge is most productive."),
        q("What is an 'ice-cream cone' test suite?", [
          "Too many unit tests",
          "Mostly E2E with few unit tests — slow, flaky, and hard to diagnose",
          "No tests at all",
          "Tests written after release",
        ], 1, "Inverting the pyramid produces a suite that is expensive to run and where one broken selector fails many tests."),
        q("Which element of a bug report is most often missing and most damaging?", [
          "Browser version",
          "Expected vs actual result",
          "A screenshot",
          "Severity",
        ], 1, "Without both stated, the developer must infer intent and may fix something other than what was reported."),
      ]
    ),
    chapter(
      "Unit Testing with Jest",
      "Writing fast, focused tests — and the assertions and structure that make them readable.",
      [
        lesson("Arrange, Act, Assert", 12, `
Every good test has three parts. Keeping them visually separate makes tests readable at a glance.

\`\`\`bash
npm install --save-dev jest
\`\`\`

\`\`\`js
// cart.test.js
import { calculateTotal } from './cart';

describe('calculateTotal', () => {
  it('sums item prices', () => {
    // Arrange
    const items = [{ price: 100, qty: 2 }, { price: 50, qty: 1 }];

    // Act
    const total = calculateTotal(items);

    // Assert
    expect(total).toBe(250);
  });
});
\`\`\`

### Name the behaviour, not the function

\`\`\`js
it('returns 0 for an empty cart', ...)                    // good
it('applies the discount before tax', ...)                // good
it('test calculateTotal 2', ...)                          // useless
\`\`\`

When a test fails in CI, the name is often all you see. \`applies the discount before tax\` tells you what broke; \`test 2\` sends you reading code.

### The assertions worth knowing

\`\`\`js
expect(x).toBe(5);                    // Object.is — primitives
expect(obj).toEqual({ a: 1 });        // deep equality — objects/arrays
expect(x).toBeCloseTo(0.3);           // floats: 0.1 + 0.2 !== 0.3
expect(arr).toHaveLength(3);
expect(arr).toContain('a');
expect(fn).toThrow('Invalid email');
expect(value).toBeNull();
expect(value).toBeUndefined();
\`\`\`

\`toBe\` on objects compares **references** and fails even when contents match — use \`toEqual\`. And never use \`toBe\` on a computed float; \`0.1 + 0.2\` is \`0.30000000000000004\`.

### Testing errors

\`\`\`js
it('rejects a negative quantity', () => {
  // Must pass a FUNCTION — calling it directly throws before expect runs
  expect(() => calculateTotal([{ price: 10, qty: -1 }])).toThrow('Quantity must be positive');
});
\`\`\`

### Async

\`\`\`js
it('fetches the user', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('Ali');
});

it('rejects an unknown id', async () => {
  await expect(getUser(999)).rejects.toThrow('Not found');
});
\`\`\`

Forgetting \`await\` on \`expect(...).rejects\` makes the test **pass regardless** — the assertion is still pending when the test ends. This is the most common silently-broken async test.

### One behaviour per test

\`\`\`js
// Poor — which rule broke?
it('validates the form', () => {
  expect(validate({})).toBe(false);
  expect(validate({ email: 'x' })).toBe(false);
  expect(validate({ email: 'a@b.co' })).toBe(true);
});

// Better — the failure names itself
it('rejects an empty form', ...);
it('rejects a malformed email', ...);
it('accepts a valid email', ...);
\`\`\`
        `),
        lesson("Mocking, and When Not To", 12, `
A unit test should not hit the network, the filesystem, or a real database. Mocks replace those — but over-mocking produces tests that pass while the app is broken.

### Mock functions

\`\`\`js
it('calls the callback once per item', () => {
  const spy = jest.fn();
  forEachItem([1, 2, 3], spy);

  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenLastCalledWith(3);
});
\`\`\`

### Mocking a module

\`\`\`js
jest.mock('./api');
import { fetchUser } from './api';

it('shows the user name', async () => {
  fetchUser.mockResolvedValue({ name: 'Ayesha' });
  expect(await loadProfile(1)).toBe('Ayesha');
});
\`\`\`

### Control time

\`\`\`js
jest.useFakeTimers();
jest.setSystemTime(new Date('2026-01-15'));

it('marks a 2025 invoice overdue', () => {
  expect(isOverdue({ due: '2025-12-01' })).toBe(true);
});

afterEach(() => jest.useRealTimers());
\`\`\`

Tests that depend on the real clock fail at midnight, at year boundaries, or in another timezone. Freezing time eliminates a whole category of flakiness.

### Isolate between tests

\`\`\`js
afterEach(() => {
  jest.clearAllMocks();
});
\`\`\`

Without this, call counts leak between tests and you get failures that depend on execution order — a genuinely painful class of bug to diagnose.

### The over-mocking trap

\`\`\`js
// Mocks so much that it verifies nothing real
jest.mock('./validator');
jest.mock('./database');
jest.mock('./logger');
jest.mock('./formatter');

it('creates a user', async () => {
  await createUser({ email: 'a@b.co' });
  expect(database.insert).toHaveBeenCalled();
});
\`\`\`

This asserts only that your code calls the functions you told it to call. If \`validator\` actually rejects that email, or \`database.insert\` needs a field you never pass, the test still passes — and production breaks.

**Mock what is slow, external, or non-deterministic:** network, time, randomness, third-party services, payment gateways.

**Do not mock the thing you are testing, or your own pure logic.** If a test needs five mocks to run, that is usually telling you the function has too many responsibilities. Listen to it.

### Prefer real over mocked where cheap

An in-memory SQLite database is fast enough for most tests and exercises your **actual queries**. A mocked database tests only that you called a method — a mocked query cannot have a syntax error, but a real one can, and that is exactly the bug you want caught.
        `),
        lesson("Coverage and What It Really Tells You", 11, `
\`\`\`bash
npx jest --coverage
\`\`\`

\`\`\`
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered
------------|---------|----------|---------|---------|----------
cart.js     |   94.1  |   87.5   |  100    |  94.1   | 42,58
auth.js     |   38.2  |   20.0   |   45    |  38.2   | 12-40,55
\`\`\`

### The four numbers

- **Statements** — lines executed
- **Branches** — each side of every \`if\`, \`&&\`, ternary
- **Functions** — functions called
- **Lines** — nearly the same as statements

**Branch coverage is the one that matters.** Statement coverage counts a line as covered if it ran at all; branch coverage asks whether both outcomes were exercised.

\`\`\`js
function getDiscount(user) {
  return user.isPremium ? 0.2 : 0;
}

it('gives premium users 20%', () => {
  expect(getDiscount({ isPremium: true })).toBe(0.2);
});
\`\`\`

100% statement coverage. 50% branch coverage. The non-premium path — which every ordinary user takes — is untested.

### Coverage is a floor, not a target

The critical flaw:

\`\`\`js
it('does not crash', () => {
  calculateTotal([{ price: 100, qty: 2 }]);   // no assertion at all
});
\`\`\`

Full coverage of that function. Zero verification. **Coverage measures execution, not assertion.** Code can be 100% covered and completely unverified.

### How to use it properly

Read coverage **backwards** — do not ask "how do I raise this number?", ask "is anything important not covered?"

\`auth.js\` at 38% is worth investigating; a barrel file at 0% is not. Sort by risk, not by percentage.

### A sane policy

- Enforce a floor (say 70%) to stop coverage silently collapsing
- Require higher coverage on genuinely critical modules — payments, auth, permissions
- Never mandate 100%

Mandating 100% reliably produces assertion-free tests written purely to satisfy the gate, plus \`/* istanbul ignore next */\` scattered through the codebase. The number goes up and the software gets no safer.

### The better question

Instead of "what is our coverage?", ask **"if I deliberately broke this function, would a test fail?"** That is what you actually want to know, and mutation testing (Stryker) automates exactly that check — it changes your code and reports which mutations your tests failed to catch.
        `),
      ],
      [
        q("Why does expect(obj).toBe({a: 1}) fail even when contents match?", [
          "toBe only works on numbers",
          "toBe compares references; toEqual compares structure",
          "The object needs quoting",
          "toBe is deprecated",
        ], 1, "toBe uses Object.is, so two structurally identical objects are still different references."),
        q("What happens if you omit await on expect(promise).rejects.toThrow()?", [
          "The test errors",
          "The test passes regardless, because the assertion is still pending when it ends",
          "Jest retries it",
          "It times out",
        ], 1, "Without await the test finishes before the assertion resolves, so a genuine failure goes unnoticed."),
        q("A function has 100% statement coverage but 50% branch coverage. What does that mean?", [
          "Half the file is untested",
          "Every line ran, but at least one conditional was only exercised one way",
          "Coverage is misconfigured",
          "Half the functions are unused",
        ], 1, "A ternary or if can execute while only one of its two outcomes is ever taken."),
        q("When is mocking the WRONG choice?", [
          "For network calls",
          "For your own pure business logic — mocking it means the test verifies nothing real",
          "For the system clock",
          "For payment gateways",
        ], 1, "Mock what is slow, external, or non-deterministic; mocking your own logic leaves the test asserting only that you called your own functions."),
      ]
    ),
    chapter(
      "Testing the User Interface",
      "Testing React components the way a user experiences them, not the way they are implemented.",
      [
        lesson("Testing Library and the Behaviour Principle", 12, `
\`\`\`bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
\`\`\`

React Testing Library is built on one rule:

> The more your tests resemble the way your software is used, the more confidence they give you.

That means querying the DOM the way a user finds things — by visible text and role — not by internal implementation.

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

it('submits the entered email and password', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'ali@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'ali@example.com',
    password: 'secret123',
  });
});
\`\`\`

Nothing here mentions state, props, or component internals. Rewrite the component with different hooks and this test still passes — because the behaviour did not change. That is the whole point.

### Query priority

Prefer, in this order:

1. \`getByRole\` — how assistive technology sees it. \`getByRole('button', { name: /save/i })\`
2. \`getByLabelText\` — form fields
3. \`getByPlaceholderText\`, \`getByText\`
4. \`getByTestId\` — **last resort only**

Reaching for \`data-testid\` immediately is a missed signal: if you cannot find an element by role or label, screen-reader users cannot find it either. **Testing Library's query priority doubles as an accessibility check.**

### getBy, queryBy, findBy

| Prefix | Not found | Use for |
|---|---|---|
| \`getBy\` | Throws | Element should be there now |
| \`queryBy\` | Returns null | Asserting absence |
| \`findBy\` | Rejects (async) | Element appears later |

\`\`\`js
expect(screen.queryByText('Error')).not.toBeInTheDocument();   // absence
expect(await screen.findByText('Welcome')).toBeInTheDocument(); // after load
\`\`\`

Using \`getBy\` to assert absence throws instead of failing cleanly — a common early mistake.

### userEvent, not fireEvent

\`userEvent.type\` fires focus, keydown, keypress, input, and keyup, like a real keyboard. \`fireEvent.change\` sets the value in one shot. Components that respond to focus or individual keystrokes behave differently under the two, and \`fireEvent\` will let bugs through.
        `),
        lesson("Async UI, Forms, and What Not to Test", 12, `
Most real components load data, and that is where UI tests get fiddly.

\`\`\`jsx
it('shows courses once loaded', async () => {
  render(<CourseList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // findBy waits for the element to appear
  expect(await screen.findByText('Full-Stack Web Development')).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
\`\`\`

### Never assert on a fixed delay

\`\`\`js
await new Promise(r => setTimeout(r, 1000));   // flaky, and slow
await screen.findByText('Done');               // waits exactly as long as needed
\`\`\`

Arbitrary sleeps are the number one cause of flaky suites: too short and it fails on a slow CI machine, too long and the suite crawls. \`findBy\` and \`waitFor\` poll until the condition holds, then continue immediately.

### Mock the network at the boundary

\`\`\`jsx
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/learn/courses', () =>
    HttpResponse.json({ data: [{ id: 1, title: 'Full-Stack Web Development' }] })
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
\`\`\`

MSW intercepts at the network layer, so your component uses real \`fetch\` and real parsing. Mocking \`fetch\` itself skips the code that builds the request and reads the response — which is where a good share of bugs actually live.

### Test the error path

\`\`\`jsx
it('shows a message when loading fails', async () => {
  server.use(http.get('/api/learn/courses', () => new HttpResponse(null, { status: 500 })));
  render(<CourseList />);
  expect(await screen.findByText(/could not load/i)).toBeInTheDocument();
});
\`\`\`

Error states are shipped broken far more often than happy paths, precisely because nobody exercises them by hand.

### What not to test

Skip these:

- **That a library works.** React Router routes. Formik validates. Not your job.
- **Implementation details.** State variable names, whether a \`useMemo\` exists, how many times a function ran.
- **Exact styling.** \`toHaveStyle({ color: 'red' })\` breaks on every redesign while catching nothing. Assert the *meaning* — an error message is present — not the colour.
- **Static markup.** A component that renders a fixed heading with no logic needs no test.

### Snapshots, sparingly

\`\`\`js
expect(container).toMatchSnapshot();
\`\`\`

Snapshots fail on any change, including intended ones. The predictable outcome is people pressing \`u\` to update without reading the diff, at which point the snapshot verifies nothing. Reserve them for small, stable output — an error-formatting function, say — not whole pages.
        `),
        lesson("End-to-End Testing", 12, `
E2E tests drive a real browser against the real app. They are the only tests that prove the whole system works — and the most expensive to maintain, so choose them carefully.

\`\`\`bash
npm init playwright@latest
\`\`\`

\`\`\`js
import { test, expect } from '@playwright/test';

test('a learner can enrol and open the first lesson', async ({ page }) => {
  await page.goto('/signup');

  await page.getByLabel('Full name').fill('Ayesha Malik');
  await page.getByLabel('Email address').fill(\`test\${Date.now()}@example.com\`);
  await page.getByLabel('Password').fill('secret12345');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page).toHaveURL('/dashboard');

  await page.goto('/learn/full-stack-web');
  await page.getByRole('button', { name: /enrol free/i }).click();
  await page.getByRole('link', { name: /start learning/i }).click();

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
\`\`\`

### Select by role and label, not CSS

\`\`\`js
page.locator('.btn-primary-2xl')                    // breaks on any restyle
page.getByRole('button', { name: 'Sign in' })       // survives redesigns
\`\`\`

Class-based selectors are the main reason E2E suites become unmaintainable — a CSS refactor breaks thirty tests that had nothing to do with CSS.

### Auto-waiting

Playwright waits for an element to be visible, stable, and enabled before acting. You almost never need explicit waits:

\`\`\`js
await page.waitForTimeout(2000);                       // flaky and slow
await expect(page.getByText('Saved')).toBeVisible();   // waits only as long as needed
\`\`\`

### Keep tests independent

Each test must set up its own data and pass when run alone, in any order. Tests that depend on the previous one leaving state behind fail confusingly and cannot run in parallel. Note the \`Date.now()\` in the email above — unique data per run, so a second run does not collide with the first.

### Fight flakiness properly

A test that fails 1 in 20 runs destroys trust in the whole suite: people re-run until green, and then miss a real failure.

Common causes, in order:
1. Fixed timeouts instead of waiting for a condition
2. Shared state between tests
3. Racing an animation or a pending request
4. Depending on real time, timezone, or network

**Do not paper over it with automatic retries.** Retries hide a real race condition that will eventually bite a user. Fix the cause, and quarantine the test meanwhile.

### Keep the suite small

Five to ten flows, covering what must never break. Everything else belongs at a lower layer, where it runs in milliseconds instead of seconds and tells you precisely what broke.
        `),
      ],
      [
        q("Why does Testing Library discourage data-testid as a first choice?", [
          "It slows tests down",
          "If you cannot find an element by role or label, neither can assistive technology",
          "testids break on rerender",
          "It is deprecated",
        ], 1, "The query priority doubles as an accessibility check — reaching for testid signals a missing role or label."),
        q("Which query asserts an element is NOT present?", [
          "getBy",
          "queryBy",
          "findBy",
          "getAllBy",
        ], 1, "queryBy returns null when absent; getBy throws, so it cannot express a clean absence assertion."),
        q("What is the leading cause of flaky UI tests?", [
          "Too many assertions",
          "Fixed timeouts instead of waiting for a condition",
          "Using userEvent",
          "Testing error states",
        ], 1, "Arbitrary sleeps fail on slow machines and waste time on fast ones; findBy/waitFor poll for the actual condition."),
        q("Why mock at the network layer (MSW) rather than mocking fetch?", [
          "It is easier to write",
          "The component uses real fetch and real parsing, so request-building and response-handling bugs are still caught",
          "fetch cannot be mocked",
          "It is required by Playwright",
        ], 1, "Mocking fetch skips exactly the code where many real bugs live."),
      ]
    ),
    chapter(
      "Testing the Back End",
      "API routes, database interaction, and the security cases worth an automated test.",
      [
        lesson("Integration Testing an API", 12, `
Integration tests exercise a route through its real middleware, validation, and database. This layer catches the most real bugs per test written.

\`\`\`bash
npm install --save-dev supertest
\`\`\`

\`\`\`js
import request from 'supertest';
import app from '../src/app.js';

describe('POST /api/auth/register', () => {
  it('creates an account and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Ali Raza', email: 'ali@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('ali@example.com');
  });

  it('never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(valid);
    const res = await request(app).post('/api/auth/register').send(valid);
    expect(res.status).toBe(409);
  });
});
\`\`\`

Export the Express \`app\` separately from the file that calls \`listen()\`. Supertest binds its own ephemeral port, so tests never collide with a running dev server.

### Test the status code, not just the body

Status codes are part of your contract. A route returning \`200\` with \`{ error: ... }\` breaks every client that checks \`res.ok\`.

\`\`\`js
expect(res.status).toBe(400);   // validation
expect(res.status).toBe(401);   // not authenticated
expect(res.status).toBe(403);   // authenticated, not permitted
expect(res.status).toBe(404);   // no such resource
\`\`\`

### Isolate the database

\`\`\`js
beforeEach(async () => {
  await db.exec('DELETE FROM users; DELETE FROM enrollments;');
});
\`\`\`

Every test starts from a known state. Without this, tests pass alone and fail together — or worse, pass in one order and fail in another, which is miserable to debug.

An in-memory SQLite database (\`new Database(':memory:')\`) gives you a real database per test file, fast, with no cleanup.

### Cover validation properly

\`\`\`js
it.each([
  ['missing email',  { name: 'Ali', password: 'secret123' }],
  ['malformed email',{ name: 'Ali', email: 'bad', password: 'secret123' }],
  ['short password', { name: 'Ali', email: 'a@b.co', password: '123' }],
  ['missing name',   { email: 'a@b.co', password: 'secret123' }],
])('rejects %s with 400', async (_label, payload) => {
  const res = await request(app).post('/api/auth/register').send(payload);
  expect(res.status).toBe(400);
});
\`\`\`

\`it.each\` keeps table-driven cases readable, and the label appears in the failure output.
        `),
        lesson("Testing Authorisation and Security", 12, `
Authorisation bugs are among the most damaging defects a web app can ship, and they are unusually easy to test.

### Every protected route needs three tests

\`\`\`js
describe('GET /api/learn/my', () => {
  it('401s with no token', async () => {
    const res = await request(app).get('/api/learn/my');
    expect(res.status).toBe(401);
  });

  it('401s with a forged token', async () => {
    const res = await request(app)
      .get('/api/learn/my')
      .set('Authorization', 'Bearer not.a.real.token');
    expect(res.status).toBe(401);
  });

  it('returns only the caller\\'s own enrolments', async () => {
    const ali = await createUserWithEnrolment('ali@example.com');
    const sara = await createUserWithEnrolment('sara@example.com');

    const res = await request(app)
      .get('/api/learn/my')
      .set('Authorization', \`Bearer \${ali.token}\`);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].userId).not.toBe(sara.id);
  });
});
\`\`\`

That third test is the important one. **Authentication proves who you are; authorisation decides what you may touch.** The classic vulnerability — IDOR — is a route that checks the token is valid but never checks the resource belongs to the caller:

\`\`\`js
it('cannot read another learner\\'s certificate progress', async () => {
  const res = await request(app)
    .get(\`/api/learn/progress/\${sara.id}\`)
    .set('Authorization', \`Bearer \${ali.token}\`);

  expect(res.status).toBe(403);
});
\`\`\`

Write that test for every route taking an id. It takes two minutes and catches a class of bug that leaks user data.

### Gating logic deserves tests

\`\`\`js
it('locks the final exam until every lesson is complete', async () => {
  const learner = await enrol('full-stack-web');
  await completeLessons(learner, 14);   // one short of 15

  const res = await request(app)
    .get('/api/learn/final/full-stack-web')
    .set('Authorization', \`Bearer \${learner.token}\`);

  expect(res.status).toBe(403);
});
\`\`\`

### Never leak answers

\`\`\`js
it('does not send answerIndex to the client', async () => {
  const res = await request(app)
    .get(\`/api/learn/quiz/chapter/\${chapterId}\`)
    .set('Authorization', \`Bearer \${learner.token}\`);

  res.body.data.questions.forEach(q => {
    expect(q.answerIndex).toBeUndefined();
    expect(q.explanation).toBeUndefined();
  });
});
\`\`\`

Anything the server sends is visible in DevTools. A test asserting sensitive fields are stripped is cheap insurance against a careless \`SELECT *\`.

### Other cases worth automating

- **Rate limiting** — the 21st rapid request returns 429
- **Password never echoed** — search the response body for the plaintext
- **Identical message** for unknown email and wrong password, so the endpoint cannot enumerate accounts
- **Oversized payload** rejected rather than crashing the process
        `),
        lesson("Test Data and Fixtures", 11, `
Most unmaintainable suites got that way through test data, not test logic.

### Factories, not fixtures

\`\`\`js
// Rigid — every field must be spelled out, and adding a required
// field later means editing dozens of tests
const user = { name: 'Ali', email: 'ali@example.com', password: 'secret123', role: 'learner' };

// Flexible — defaults plus only what this test cares about
export const makeUser = (overrides = {}) => ({
  name: 'Ali Raza',
  email: \`user\${Date.now()}\${Math.random()}@example.com\`,
  password: 'secret123',
  role: 'learner',
  ...overrides,
});

const admin = makeUser({ role: 'admin' });
\`\`\`

Each test then states **only what matters to it**. A reader sees \`makeUser({ role: 'admin' })\` and knows the role is the point of that test — everything else is noise the factory absorbs.

### Unique data by default

Hardcoded emails collide the moment tests run in parallel or a database is not fully reset. Generating a unique value in the factory eliminates an entire family of order-dependent failures.

### Keep setup close to the test

\`\`\`js
it('shows a discount for premium members', async () => {
  const user = await createUser(makeUser({ isPremium: true }));   // right here
  const res = await request(app).get('/api/price').set(auth(user));
  expect(res.body.discount).toBe(0.2);
});
\`\`\`

A giant shared \`beforeAll\` that seeds twenty records forces the reader to scroll elsewhere to understand why a test passes, and creates hidden coupling between tests. Share only genuinely expensive, genuinely read-only setup.

### Make failures diagnosable

\`\`\`js
expect(res.body.total).toBe(250);
// expect(received).toBe(expected) // Object.is equality
//   Expected: 250
//   Received: 200

// Add a message where the framework supports it, or assert on a shaped object:
expect({ total: res.body.total, items: res.body.items.length })
  .toEqual({ total: 250, items: 2 });
\`\`\`

The time you spend making a failure self-explanatory is repaid every time it fails at 6pm in CI.

### Tests are code

They get read far more often than they get written. Apply the same standards:

- No copy-pasted blocks — extract a helper
- Descriptive names over comments
- Delete tests for deleted features rather than commenting them out
- If a test is hard to write, that is usually feedback about the design, not the test

### Never chase a passing suite

The temptation, under deadline, is to change the assertion until it goes green. If a test fails, exactly one of two things is true: the code is wrong, or the test encodes the wrong expectation. Decide which — deliberately — before touching either. Editing an assertion to match observed behaviour is how a bug becomes a documented feature.
        `),
      ],
      [
        q("Why export the Express app separately from the file that calls listen()?", [
          "It is faster",
          "Supertest can bind its own port, so tests do not collide with a running server",
          "listen() is deprecated",
          "It enables mocking",
        ], 1, "Importing an app that already listens causes port conflicts; exporting the app lets Supertest manage the server."),
        q("Which test catches an IDOR vulnerability?", [
          "401 with no token",
          "401 with a forged token",
          "One user requesting another user's resource by id gets 403",
          "Rate limit returns 429",
        ], 2, "A valid token proves identity but not entitlement; only the cross-user request tests the ownership check."),
        q("Why generate unique emails inside a test factory?", [
          "To test validation",
          "Hardcoded values collide when tests run in parallel or the DB is not fully reset",
          "It is faster",
          "Required by Jest",
        ], 1, "Unique data removes a whole family of order-dependent and parallelism failures."),
        q("A test fails. What is the correct first step?", [
          "Update the assertion to match the output",
          "Decide whether the code is wrong or the expectation is wrong",
          "Add a retry",
          "Skip it and move on",
        ], 1, "Editing the assertion to match observed behaviour turns a real bug into a documented feature."),
      ]
    ),
    chapter(
      "Testing in a Real Workflow",
      "Running tests automatically, keeping the suite trustworthy, and knowing when manual testing wins.",
      [
        lesson("Continuous Integration", 11, `
Tests only protect you if they run without anyone remembering to run them.

\`\`\`yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
\`\`\`

### npm ci, not npm install

\`npm ci\` installs exactly what \`package-lock.json\` specifies and fails if the lock file is out of sync. \`npm install\` may quietly resolve different versions, producing the classic "passes locally, fails in CI" that costs an afternoon.

### Order steps cheapest-first

Lint, then unit, then integration, then E2E. A lint error should fail in 20 seconds, not after a 12-minute browser run.

### Make the check meaningful

Require the workflow to pass before merge (branch protection). A failing suite that can still be merged trains everyone to ignore it, and within a month the suite is decorative.

### Keep it fast

Target under ten minutes end to end. Past that, people stop waiting and start merging on hope.

- Run test files in parallel (Jest does by default)
- Cache dependencies
- Run the full E2E suite on main and a smoke subset on pull requests
- Split slow suites across CI machines

### Publish the failure clearly

Upload Playwright's trace and screenshots on failure:

\`\`\`yaml
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
\`\`\`

A failure you cannot reproduce locally is nearly useless without the trace. Playwright's trace viewer shows the DOM, network, and console at each step — usually enough to diagnose without re-running anything.

### Pre-commit hooks

\`\`\`bash
npx husky init
echo "npm run lint && npm test -- --onlyChanged" > .husky/pre-commit
\`\`\`

Keep hooks **fast**. A pre-commit hook running the full suite gets bypassed with \`--no-verify\` within a week, and then it protects nothing.
        `),
        lesson("Keeping a Suite Trustworthy", 11, `
Suites do not usually die from having too few tests. They die from becoming untrustworthy.

### The failure spiral

1. One test fails intermittently
2. People re-run CI until it goes green
3. Re-running becomes routine
4. A **real** failure gets re-run and merged
5. Confidence is gone; the suite is now overhead

The dangerous step is 3, and it happens quietly.

### Deal with flakiness properly

When a test fails intermittently:

1. **Quarantine it** — mark it, exclude it from the required check. Do not leave it failing in the main run.
2. **Fix the cause within a set time** — days, not months.
3. **Delete it** if you will not fix it. An always-skipped test is dead code that misleads readers into thinking a case is covered.

Never add a blanket retry. Retries convert a visible race condition into an invisible one that a user will eventually hit.

### Prune regularly

Delete tests that:

- Test removed features
- Duplicate another test exactly
- Assert on implementation details that change every refactor
- Have been skipped for more than a month

A smaller suite people trust beats a larger one they route around.

### Watch the maintenance signal

If a small feature change breaks twenty tests, those tests are coupled to implementation rather than behaviour. That is a design problem in the tests. Rewrite them around observable behaviour instead of adding another twenty of the same kind.

### Write the test with the bug fix

Every bug fix gets a test reproducing the bug **first**:

\`\`\`js
// Regression: https://github.com/org/repo/issues/412
it('applies the discount when the coupon is added after a quantity change', () => {
  ...
});
\`\`\`

Write it, watch it fail, then fix the code and watch it pass. Otherwise you have no evidence the fix addresses the reported problem — and no protection against it returning.

Linking the issue matters: two years on, this is the only record of why the case is special. Without it, someone "simplifying" the test deletes the very scenario it exists to protect.

### Review tests in code review

Read tests as carefully as production code. Ask: does this fail if the feature breaks? Is it asserting behaviour or internals? Would the name tell me what broke? An unreviewed test is an unverified claim of safety.
        `),
        lesson("Manual and Exploratory Testing", 11, `
Automation checks what you already thought of. Finding what you did not think of is a different skill, and it is not going away.

### Exploratory testing

Structured investigation, not random clicking. Use a **charter** — a short mission with a time box:

> Explore the checkout flow with invalid payment data for 45 minutes, to discover error-handling problems.

Take notes as you go: what you tried, what you observed, what surprised you. Surprise is the signal worth chasing.

### Where automation is weak

| Automated tests are poor at | Because |
|---|---|
| Visual and layout problems | Assertions do not see overlap or ugliness |
| Usability | "Confusing" is not assertable |
| Content and tone | Wrong-but-valid text passes |
| Unexpected sequences | Only scripted paths are tried |
| Accessibility in practice | Automated checks catch perhaps 30% of real issues |

### High-value manual passes

**Keyboard only.** Unplug the mouse. Tab through the whole flow. Can you reach and operate everything? Is focus visible? Does a modal trap focus and return it on close? This takes ten minutes and finds problems no automated check reports.

**Screen reader.** VoiceOver on macOS, NVDA on Windows. Do buttons announce a purpose, or just "button"? Do errors get announced when they appear?

**Slow network.** DevTools → Network → Slow 3G. Loading states you never see locally become the whole experience. This is where missing spinners and layout shift show up.

**Real devices.** Small screens, older hardware, actual thumbs.

**Hostile input.** Emoji in a name field. 10,000 characters in a comment. A negative quantity. Two rapid submits of the same form — a genuinely common source of duplicate charges.

### Test the boring paths

Password reset, email change, account deletion, expired sessions. These are shipped broken constantly because nobody uses them during development — and they are exactly the flows a stuck user depends on.

### Where to go next

You now have the full range: unit, integration, UI, E2E, CI, and the manual work automation cannot replace. Natural next steps are **accessibility testing** in depth, **performance testing** (k6, Lighthouse CI), **contract testing** for services, and **mutation testing** to find out whether your tests would actually catch a bug.

The habit that matters most is simpler than any tool: when something breaks, write the test first, then fix it.
        `),
      ],
      [
        q("Why use npm ci rather than npm install in CI?", [
          "It is faster to type",
          "It installs exactly the lock file and fails if it is out of sync, avoiding 'works locally' drift",
          "It skips devDependencies",
          "It runs tests automatically",
        ], 1, "npm install can resolve different versions than the lock file, producing environment-specific failures."),
        q("What is the correct response to a test that fails 1 in 20 runs?", [
          "Add automatic retries",
          "Quarantine it, fix the root cause within days, or delete it",
          "Increase the timeout",
          "Run CI twice",
        ], 1, "Retries hide a real race condition that will eventually affect a user; the cause needs fixing."),
        q("Why write the regression test BEFORE fixing a bug?", [
          "It is required by CI",
          "Watching it fail proves it actually reproduces the reported problem",
          "It improves coverage",
          "It documents the API",
        ], 1, "A test that passes before the fix proves nothing about whether the fix addresses the real issue."),
        q("Which problem is automated testing weakest at catching?", [
          "Wrong calculations",
          "Incorrect status codes",
          "Usability and visual layout problems",
          "Validation gaps",
        ], 2, "Assertions cannot judge whether a layout is broken or a flow is confusing — that needs human judgement."),
      ]
    ),
    chapter(
      "Performance and Load Testing",
      "Measuring how the system behaves under real traffic, finding the bottleneck, and holding a front-end budget.",
      [
        lesson("Load Testing with k6", 12, `
A functional test asks whether the answer is right. A load test asks whether it is still right at 500 concurrent users, and how long the user waited for it.

\`\`\`bash
brew install k6                     # macOS
winget install k6 --source winget   # Windows
# k6 is a Go binary, not an npm package — there is no real k6 package on npm
\`\`\`

\`\`\`js
// load.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // ramp up to 50 virtual users
    { duration: '2m',  target: 50 },   // hold steady — the numbers come from here
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],  // under 1% of requests may fail
    http_req_duration: ['p(95)<400'],  // 95% must finish inside 400ms
  },
};

export default function () {
  const res = http.get('https://staging.example.com/api/learn/courses');

  check(res, {
    'status is 200':    (r) => r.status === 200,
    'body has courses': (r) => r.json('data').length > 0,
  });

  sleep(1);   // think time — real users pause between requests
}
\`\`\`

\`k6 run load.js\` exits non-zero when a threshold is breached. That single detail is what makes this a **test** rather than a report: it can gate a pipeline (chapter 5) instead of producing a graph somebody glances at once and forgets.

### Never report the average

Take 100 requests where 90 finish in 50ms and 10 take 3 seconds.

| Metric | Value | What it tells you |
|---|---|---|
| Average | 345 ms | "A bit slow" |
| p95 | 3000 ms | One request in twenty waits three seconds |
| p99 | 3000 ms | The tail is not a rounding error |

The mean is dragged around by a small slow minority and reported as if it were typical. **Always quote percentiles.** p95 is the honest headline; p99 is where the angry emails come from.

Tail latency also compounds. A page that makes ten sequential API calls hits your p99 on roughly one load in ten — \`0.99 ^ 10 ≈ 0.90\`. A tail you dismissed as "only 1%" is a tenth of your page loads.

### Tag what you measure

\`\`\`js
http.get(url, { tags: { endpoint: 'course_detail' } });
\`\`\`

Without tags every request lands in one bucket, and one slow endpoint is averaged away by a hundred fast ones — the same mistake as reporting the mean, one level up. Tags also let you set a threshold per endpoint, so the checkout budget can be stricter than the catalogue.

### The five shapes of load test

| Type | Setup | Question answered |
|---|---|---|
| Smoke | 1–2 VUs, 1 min | Does the script itself work? |
| Load | Expected peak | Are we fine on a normal busy day? |
| Stress | Ramp past the peak until it breaks | Where does it break, and how? |
| Soak | Moderate load for 2–8 hours | Do we leak memory or connections? |
| Spike | 0 → 500 VUs in 10s | Do we recover after a burst? |

Stress tests matter more than they look. The useful answer is not the number of users — it is the *manner* of failure. Graceful degradation with 503s is survivable; a database connection pool exhausting while every request hangs for 30 seconds is an outage.

### The mistakes that invalidate a run

**Testing against tiny data.** A query over 200 seeded rows uses a different plan than the same query over 2 million. Load test against a database with production-shaped volume, or you have measured nothing.

**Hitting one hot record.** Requesting the same course id 50,000 times measures your cache, not your app. Randomise over realistic data:

\`\`\`js
import { SharedArray } from 'k6/data';

const ids = new SharedArray('course ids', () => JSON.parse(open('./course-ids.json')));

export default function () {
  const id = ids[Math.floor(Math.random() * ids.length)];
  http.get(\`https://staging.example.com/api/learn/courses/\${id}\`);
}
\`\`\`

**Generating load from one laptop over home wifi.** Past a few hundred VUs you are measuring your own uplink. Run the generator near the target.

**Forgetting think time.** Removing \`sleep()\` makes 50 VUs behave like several thousand real users, and you end up tuning for traffic you will never see.

**Pointing it at production by accident.** Target staging, and make the URL an environment variable so nobody has to remember.
        `),
        lesson("Finding the Bottleneck", 12, `
Your p95 is 3 seconds. Guessing which line is responsible is how afternoons disappear. Measure the phases first.

\`\`\`js
// Time each phase of a slow route rather than the route as a whole
router.get('/api/learn/courses', async (req, res) => {
  const t0 = performance.now();
  const courses = await db.all('SELECT * FROM courses');
  const t1 = performance.now();
  const progress = await loadProgress(req.user.id);
  const t2 = performance.now();

  console.log(JSON.stringify({
    route: 'GET /courses',
    queryMs: Math.round(t1 - t0),
    progressMs: Math.round(t2 - t1),
  }));

  res.json({ data: merge(courses, progress) });
});
\`\`\`

Nine times in ten that log answers the question from a single request, and the answer is one of four suspects.

### 1. The N+1 query

The most common back-end performance bug there is:

\`\`\`js
// N+1 — one query for the list, then one per row: 51 round trips
const courses = await db.all('SELECT * FROM courses');
for (const c of courses) {
  c.lessons = await db.all('SELECT * FROM lessons WHERE course_id = ?', c.id);
}

// Two round trips, grouped in memory
const courses = await db.all('SELECT * FROM courses');
const lessons = await db.all(
  \`SELECT * FROM lessons WHERE course_id IN (\${courses.map(() => '?').join(',')})\`,
  courses.map(c => c.id)
);
const byCourse = Map.groupBy(lessons, l => l.course_id);
courses.forEach(c => { c.lessons = byCourse.get(c.id) ?? []; });
\`\`\`

It is invisible locally with 5 courses and fatal with 500. And you do not need a load test to catch it — an integration test (chapter 4) can assert the *mechanism*:

\`\`\`js
it('lists courses in a constant number of queries', async () => {
  const counter = countQueries(db);          // wrap db.all and increment
  await request(app).get('/api/learn/courses');
  expect(counter.count).toBeLessThanOrEqual(2);   // fails the day someone adds a loop
});
\`\`\`

That test runs in milliseconds and catches a regression that otherwise only surfaces in production.

### 2. The missing index

\`\`\`sql
EXPLAIN QUERY PLAN SELECT * FROM enrollments WHERE user_id = 42;

-- SCAN enrollments                                             <- full table scan, bad
-- SEARCH enrollments USING INDEX idx_enroll_user (user_id=?)   <- indexed, good
\`\`\`

\`SCAN\` on a large table in a hot path is your answer. Index every column you filter or join on; the write cost is real but almost always smaller than the read win.

### 3. A blocked event loop

Node runs your JavaScript on one thread. Anything synchronous stalls **every** concurrent request, so throughput collapses while one CPU core sits at 100%:

\`\`\`js
bcrypt.hashSync(password, 12);        // ~300ms of blocking, per request
JSON.parse(hugeString);               // blocks proportionally to size
fs.readFileSync('./big.json');        // blocks
\`\`\`

Use the async forms, and profile with \`node --cpu-prof\` when a route is CPU-bound rather than IO-bound.

### 4. Pool exhaustion

Symptom: latency is fine at 20 users, and at 60 every request suddenly takes exactly the pool timeout. The app is not slow — requests are queuing for a connection. Look for a connection acquired and never released on an error path, and release it in a \`finally\`.

### 5. The response nobody sized

\`\`\`js
// Ships every lesson body — 400 kB of Markdown — to render a list of titles
const rows = await db.all('SELECT * FROM lessons WHERE course_id = ?', id);

// 6 kB
const rows = await db.all('SELECT id, title, minutes FROM lessons WHERE course_id = ?', id);
\`\`\`

\`SELECT *\` in a list endpoint is the quiet version of this bug: the query itself is fast, but serialising and transferring the payload is not, and it gets worse every time somebody adds a column. Assert the shape in an integration test and a list endpoint that starts returning bodies fails on the spot.

### Fix in the order that pays

Profiling gives you proportions, so respect them. If the database is 90% of the response, making JSON serialisation twice as fast improves the endpoint by 0.5%. The classic mistake is optimising what is *easy* to optimise instead of what is *large*.

Reach for caching last. A cache in front of an N+1 query hides the bug, adds an invalidation problem, and makes the next person's debugging harder.

### Re-measure after every change

Keep the k6 script from the previous lesson and re-run it after each fix. Performance work without a before-and-after number is a guess with extra steps — and it is common to make something slower while convinced it is faster.
        `),
        lesson("Front-End Performance Budgets", 11, `
Playwright waits patiently for the DOM, so an E2E suite (chapter 3) passes happily on a page that takes eight seconds to become usable. Front-end performance needs its own measurements and its own gate.

### The three numbers that matter

| Metric | Good | What it measures |
|---|---|---|
| **LCP** — Largest Contentful Paint | < 2.5s | When the main content appears |
| **INP** — Interaction to Next Paint | < 200ms | How fast the UI answers a click |
| **CLS** — Cumulative Layout Shift | < 0.1 | How much the page jumps while loading |

CLS is the one developers rarely reproduce, because it mostly bites on a slow connection. The usual causes: an \`<img>\` with no \`width\`/\`height\` so nothing reserves space, a banner injected above existing content, and a web font swapping in at a different size.

\`\`\`html
<!-- Reserves the box before the bytes arrive: no shift -->
<img src="/cover.webp" width="640" height="360" alt="Course cover" />
\`\`\`

### Triage an LCP failure

Lighthouse names the LCP element, and the fix follows from what that element is.

| LCP element | Usual fix |
|---|---|
| Hero image | \`fetchpriority="high"\`, modern format, correctly sized |
| Text in a web font | \`font-display: swap\`, preload the font file |
| Client-rendered block | Server-render it, or ship less JavaScript ahead of it |

Then look at the number underneath: **TTFB**. An LCP of 4s built from 2.8s of time-to-first-byte is a back-end problem wearing a front-end costume, and no amount of image optimisation will move it — go back to the previous lesson and profile the route.

### Gate it in CI with Lighthouse CI

\`\`\`json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/", "http://localhost:3000/courses"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance":    ["error", { "minScore": 0.85 }],
        "largest-contentful-paint":  ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift":   ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
\`\`\`

\`\`\`yaml
      - run: npm run build
      - run: npx serve -s build -l 3000 &
      - run: npx @lhci/cli autorun
\`\`\`

\`numberOfRuns: 3\` is not optional. A single Lighthouse run on a shared CI machine varies by 10–15 points; asserting on one run produces a flaky gate, and a flaky gate gets disabled (chapter 5).

### Budget the bundle too

Most performance regressions arrive as an import, not as slow code:

\`\`\`json
// package.json
"size-limit": [
  { "path": "build/static/js/*.js", "limit": "180 kB" }
]
\`\`\`

\`\`\`bash
npx size-limit    # exits non-zero when the budget is exceeded
\`\`\`

Someone writes \`import _ from 'lodash'\` for one \`groupBy\`, the bundle grows 70 kB, and nobody notices for three months because every functional test still passes. A byte budget catches it in the pull request that caused it, which is the only cheap moment to fix it.

Set budgets per route, not per site. A marketing landing page and a lesson editor cannot share one JavaScript limit: a single global number is either too loose to catch anything or too tight to ship, and both outcomes end with the check being removed.

### Lab data is not field data

Lighthouse is a **lab** measurement: one synthetic run, your hardware, your network. Real User Monitoring reports what people actually experience:

\`\`\`js
import { onLCP, onINP, onCLS } from 'web-vitals';

const send = (metric) => {
  navigator.sendBeacon('/api/vitals', JSON.stringify({
    name: metric.name,
    value: Math.round(metric.value),
    path: location.pathname,
  }));
};

onLCP(send);
onINP(send);
onCLS(send);
\`\`\`

Then read the **p75** by device class, exactly as you read p95 in the load test. The classic mistake is celebrating a Lighthouse score of 96 on a developer laptop while field p75 LCP is 4.2 seconds on mid-range Android — the score was real, the sample was not.

### Test on the network your users have

DevTools → Network → Slow 4G, plus a 4× CPU throttle. Loading states you have never seen locally become the whole experience, and this is where missing spinners, unstyled font flashes, and layout shift finally show themselves. It costs ten minutes, and it is the highest-value manual performance pass — the same spirit as the keyboard pass in chapter 5.
        `),
      ],
      [
        q("Why is average response time the wrong headline metric for a load test?", [
          "It is expensive to compute",
          "It is always lower than the real value",
          "It blends a fast majority and a slow tail into one number no user actually experiences",
          "Percentiles are more precise at low request counts",
        ], 2, "In the worked example the slow 10% supplies 87% of the 345ms mean, yet 345ms still reads as 'a bit slow' while every tenth user waits three seconds."),
        q("A load test requests the same course id 50,000 times and reports a p95 of 18ms. Why is that number untrustworthy?", [
          "It measures the cache, not the application — real traffic spreads across many ids and larger data",
          "k6 cannot measure below 20ms",
          "p95 is undefined for repeated requests",
          "The ramp-up stage was too short",
        ], 0, "Repeating one hot record keeps everything warm, so the run never exercises the code paths real traffic takes."),
        q("Which check catches an N+1 query in milliseconds, long before a load test would?", [
          "An E2E test that opens the list page",
          "A snapshot test of the response body",
          "A k6 threshold on http_req_duration",
          "An integration test asserting the endpoint issues a constant number of queries",
        ], 3, "Counting queries tests the mechanism directly, so the failure appears with five seeded rows instead of five hundred thousand."),
        q("A page scores 96 in Lighthouse on CI but users report slow loads. The most likely explanation is:", [
          "Lighthouse scores are randomly generated",
          "Lab data from a fast CI machine does not reflect field data from mid-range phones on slow networks",
          "The performance category weights are misconfigured",
          "CLS is excluded from the score",
        ], 1, "A synthetic run on good hardware is one sample; field p75 across real devices is what users actually experience."),
      ]
    ),
    chapter(
      "Testing the Hard Parts",
      "Accessibility you can automate, contracts between services, and proving your tests would actually catch a bug.",
      [
        lesson("Automated Accessibility Testing", 12, `
Chapter 5 put automated accessibility coverage at roughly 30% of real issues. That 30% is nearly free, catches the regressions humans get bored of re-checking, and leaves you a much shorter manual pass.

### Per component, in the unit suite

\`\`\`bash
npm install --save-dev jest-axe @axe-core/playwright
\`\`\`

\`\`\`jsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no detectable accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();   // failure output names the rule and the element
});
\`\`\`

### Per page, in the E2E suite

\`\`\`js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the dashboard has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('heading', { name: /my courses/i }).waitFor();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
\`\`\`

Run it at both levels, because they find different things. \`jest-axe\` catches a component regression in the pull request that caused it. The Playwright pass catches everything that only exists once components compose: duplicate \`<main>\` landmarks, a heading order that jumps from \`h1\` to \`h4\`, and contrast measured against the **real** page background rather than the test harness's white.

### Fail on impact, not on count

\`\`\`js
const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
expect(serious).toEqual([]);
\`\`\`

Turning axe on an existing product surfaces hundreds of violations at once, and a check that is red from its first day gets ignored exactly as chapter 5 described. Gate on \`critical\` and \`serious\`, record the rest as a backlog, and tighten the filter as you clear them.

### Check both colour schemes

Contrast is computed from the pixels actually rendered, so a palette that passes in light mode can fail in dark:

\`\`\`js
for (const scheme of ['light', 'dark']) {
  test(\`dashboard contrast in \${scheme} mode\`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/dashboard');
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
\`\`\`

### What axe reliably finds

| Caught | Missed |
|---|---|
| Image with no \`alt\` | \`alt="image123"\` — present but useless |
| Input with no label | A label pointing at the wrong input |
| Contrast below 4.5:1 | Focus order that jumps around the page |
| Missing \`lang\` on \`<html>\` | A modal that does not trap or restore focus |
| Invalid ARIA role or attribute | A custom control nobody can operate by keyboard |
| A button or link with no accessible name | An error message announced to nobody |

The right-hand column is why the manual keyboard and screen-reader passes from chapter 5 stay on the checklist.

### The classic mistake: silencing axe instead of fixing the page

\`\`\`jsx
// axe reports zero violations. The control is still unusable.
<div role="button" aria-label="Save" onClick={save}>Save</div>
\`\`\`

It is not in the tab order, Enter and Space do nothing, and it does not respond to a screen reader's activation. A green axe run means "no *detectable* violations", never "accessible". The fix is not more ARIA:

\`\`\`jsx
<button type="button" onClick={save}>Save</button>
\`\`\`

**First rule of ARIA: do not use ARIA.** A native element brings focusability, keyboard activation, and the right role for free.

### Automate the behaviour axe cannot see

Focus management is scriptable, and it is where most keyboard bugs live:

\`\`\`js
test('the enrol modal traps focus and restores it on close', async ({ page }) => {
  await page.goto('/learn/software-testing-qa');
  const trigger = page.getByRole('button', { name: /enrol free/i });
  await trigger.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Focus moves into the dialog, not left behind on the page under it
  await expect(dialog.getByRole('button', { name: /confirm/i })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();      // and comes back where it started
});
\`\`\`

If you already query by role and label as chapter 3 taught, half this work is done: a test that can only find its button through \`data-testid\` is telling you the button has no accessible name.
        `),
        lesson("Contract Testing Between Services", 12, `
Here is a failure mode no layer you have built so far catches. The web client mocks the API with MSW (chapter 3) and its suite is green. The API team has full integration coverage (chapter 4) and their suite is green. They rename \`full_name\` to \`name\` and deploy. Production breaks, and **not one test failed** — because the client's mock still returns the old shape.

Mocks freeze an assumption at the moment you wrote them. A contract test keeps that assumption honest.

### Consumer-driven contracts with Pact

The consumer declares what it needs, using its **real client code** against a mock provider:

\`\`\`js
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { fetchMyCourses } from '../src/api/learn';

const { like, eachLike } = MatchersV3;
const provider = new PactV3({ consumer: 'web-client', provider: 'learn-api' });

it('gets the courses I am enrolled in', async () => {
  provider
    .given('ali has one enrolment')                 // provider state, by name
    .uponReceiving('a request for my courses')
    .withRequest({
      method: 'GET',
      path: '/api/learn/my',
      headers: { Authorization: like('Bearer token') },
    })
    .willRespondWith({
      status: 200,
      body: { data: eachLike({ id: like(1), title: like('Software Testing & QA'), progress: like(40) }) },
    });

  await provider.executeTest(async (mock) => {
    const courses = await fetchMyCourses(mock.url);   // the shipping client, not a stub
    expect(courses[0].progress).toBe(40);
  });
});
\`\`\`

That run writes a **pact file** — a JSON description of every request/response pair the consumer depends on. The provider then replays it against the real service:

\`\`\`js
import { Verifier } from '@pact-foundation/pact';

new Verifier({
  provider: 'learn-api',
  providerBaseUrl: 'http://localhost:4000',
  pactUrls: ['./pacts/web-client-learn-api.json'],
  stateHandlers: {
    'ali has one enrolment': async () => seedEnrolment('ali@example.com'),
  },
}).verifyProvider();
\`\`\`

Rename \`title\` now and the provider's own build fails, naming the consumer that depended on it. That is the entire value: breakage surfaces on the side making the change, before deploy.

### Match shapes, not values

\`like(40)\` asserts "a number lives here". Writing the literal \`40\` would make the contract fail every time seed data changes, and a contract that fails for boring reasons gets deleted. **A contract describes the interface, not the data.**

### The cheaper option: verify against your OpenAPI spec

For a single repository — one Express API and one client — Pact is often more machinery than the problem deserves. Schema assertions get most of the benefit:

\`\`\`js
import jestOpenAPI from 'jest-openapi';
jestOpenAPI('./openapi.yaml');

it('GET /api/learn/courses matches the documented schema', async () => {
  const res = await request(app).get('/api/learn/courses');
  expect(res.status).toBe(200);
  expect(res).toSatisfyApiSpec();     // shape, types, required fields, status code
});
\`\`\`

Add it to the route tests you already wrote in chapter 4 and every response is checked against the spec. It also keeps the documentation truthful, because a stale spec now fails the build instead of quietly misleading whoever reads it.

### Make it a deploy gate

A contract only protects you if the provider verifies the current consumer expectations *before* it ships:

\`\`\`yaml
      - run: npx pact-broker publish ./pacts --consumer-app-version=$GITHUB_SHA
      - run: npx pact-broker can-i-deploy --pacticipant learn-api
             --version $GITHUB_SHA --to-environment production
\`\`\`

\`can-i-deploy\` exits non-zero while any consumer's contract is unverified against this build, which turns the pact from a report into a gate.

### Add fields freely, never rename them

The rule that keeps all of this cheap: additive changes are safe, renames and removals are not. Ship \`name\` alongside \`full_name\`, let each consumer migrate on its own schedule, and delete the old field once no pact mentions it. That sequence turns one coordinated release into two independent ones.

Write contracts for the error responses too. A client depends on the shape of your 404 body as much as on your 200, and error paths are where undocumented drift usually hides.

### Two mistakes worth avoiding

**Writing the contract from the provider's documentation.** If the pact is not produced by executing the actual client, you have tested the docs. Docs are exactly the thing that drifts.

**Believing contracts replace E2E.** They prove the messages line up, not that the business flow works. Keep the handful of E2E journeys from chapter 3 — contract tests just mean you need far fewer of them.
        `),
        lesson("Proving Your Tests Would Catch a Bug", 12, `
Chapter 2 ended with the real question behind coverage: *if I deliberately broke this function, would a test fail?* Two tools answer it mechanically instead of by hope.

### Mutation testing

\`\`\`bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
\`\`\`

\`\`\`json
// stryker.config.json
{
  "testRunner": "jest",
  "mutate": ["src/lib/pricing.js", "src/lib/grading.js"],
  "coverageAnalysis": "perTest",
  "thresholds": { "high": 80, "low": 60, "break": 50 }
}
\`\`\`

Stryker edits your production code one small change at a time — \`>=\` becomes \`>\`, \`&&\` becomes \`||\`, a return value becomes \`null\`, a condition flips — and runs the suite against each **mutant**.

\`\`\`
File         | % score | killed | survived | timeout
-------------|---------|--------|----------|--------
pricing.js   |  92.86  |   26   |    2     |   0
grading.js   |  64.29  |   18   |   10     |   0
\`\`\`

A **killed** mutant means a test failed — good, the behaviour is genuinely verified. A **survived** mutant is a change to shipping code that your whole suite ignored:

\`\`\`js
// original
if (score >= 70) return 'pass';

// mutant that survived: >= became >
if (score > 70) return 'pass';
\`\`\`

Nothing failed, so nobody ever tested a score of exactly 70 — the same boundary the analysis in chapter 1 told you to write. Mutation testing finds those gaps without you having to notice them.

**Budget it honestly.** The suite runs once per mutant, so a module with 400 mutants takes 400 suite runs. Do not point it at the whole repository in pull-request CI. Run it nightly, or scope \`mutate\` to the few modules where correctness truly matters: pricing, grading, permissions, anything touching money.

**Do not chase 100%.** Some survivors are *equivalent mutants* — changes that cannot alter observable behaviour, like \`i++\` versus \`++i\` as a standalone statement, or a mutated log message. Mandating a perfect score produces the same theatre that mandating 100% coverage does.

### Read the report top-down

\`\`\`bash
npx stryker run     # writes reports/mutation/mutation.html
\`\`\`

The HTML report shows each surviving mutant inline in the source. Go file by file and ask, for every survivor, which assertion would have killed it — that question writes the missing test for you. Three survivors in a pricing function are worth an hour; forty in a string formatter are worth ignoring.

Watch the **timeout** column too. A mutant that turns a loop condition into \`true\` never terminates, and Stryker counts a timeout as killed. Timeouts appearing in a normally-fast suite are usually a sign that a test has no timeout guard of its own.

### Property-based testing

Example-based tests check the cases you thought of. Property-based tests generate hundreds you did not:

\`\`\`js
import fc from 'fast-check';
import { priceCart } from './pricing';

it('never returns a negative total or a discount larger than the total', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        price: fc.integer({ min: 0, max: 1_000_000 }),
        qty:   fc.integer({ min: 1, max: 99 }),
      })),
      (items) => {
        const { total, discount } = priceCart(items);
        return total >= 0 && discount <= total;
      }
    )
  );
});
\`\`\`

When fast-check finds a failure it **shrinks** the input to the smallest case that still fails — usually a one-element array with a zero or a single-item edge — and prints it with the seed so the run is reproducible. You get the minimal reproduction for free, which is the part of debugging that normally costs the most.

Properties worth reaching for:

| Property | Example |
|---|---|
| Round trip | \`parse(format(x))\` equals \`x\` |
| Invariant | Output length equals input length; a total is never negative |
| Idempotence | Applying twice equals applying once — sanitisers, normalisers |
| Oracle | Result matches a slow, obviously-correct implementation |

### Where this leaves you

Unit, integration, UI, E2E, CI, performance, accessibility, contracts, and now a way to audit the tests themselves. The tooling will keep changing; the judgement does not. Test what would genuinely hurt if it broke, assert behaviour rather than implementation, and when something breaks, write the failing test first and fix it second.
        `),
      ],
      [
        q("The consumer's mocked tests pass and the provider's own tests pass, yet integration breaks in production. Why?", [
          "The provider's tests run too slowly to be trusted",
          "The consumer's mock still returns the old response shape, so nothing notices when the provider renames a field",
          "The consumer forgot to await its assertions",
          "E2E tests were skipped in that pipeline",
        ], 1, "A mock freezes an assumption at the moment it was written, so it keeps agreeing with the consumer after the real provider has changed."),
        q("What does a surviving mutant in a Stryker report tell you?", [
          "A test is flaky and needs quarantining",
          "The mutated file contains a syntax error",
          "Branch coverage fell below the configured threshold",
          "Stryker changed your production code and no test failed, so that behaviour is unverified",
        ], 3, "Killing a mutant requires a test to actually assert on the changed behaviour, so a survivor marks a real gap in verification."),
        q("axe reports zero violations for a clickable div given role='button' and aria-label='Save'. What is still wrong?", [
          "It is not in the tab order and does not respond to Enter or Space, which axe cannot detect",
          "aria-label has been deprecated in favour of aria-labelledby",
          "role='button' requires a matching id attribute",
          "Nothing — zero violations means the control is accessible",
        ], 0, "Automated checks verify markup rules, not whether a control can actually be operated, so a native button is the fix rather than more ARIA."),
        q("Why should a Pact contract use matchers such as like() instead of exact values?", [
          "Exact values make verification measurably slower",
          "Pact cannot compare string literals",
          "The contract should assert the shape and types of the interface, not seed data that legitimately changes",
          "Matchers are mandatory for any JSON response body",
        ], 2, "Pinning literal values makes the contract fail for boring reasons, and a contract that cries wolf gets deleted."),
      ]
    ),
  ],
  final: [
    q("The main purpose of a test suite is to:", [
      "Prove the software has no bugs",
      "Buy the confidence to change code safely",
      "Satisfy a coverage target",
      "Document requirements for managers",
    ], 1, "Exhaustive proof is impossible; the practical value is being able to refactor and ship without fear."),
    q("For a field accepting 18-65, boundary value analysis suggests testing:", [
      "18, 30, 65",
      "17, 18, 65, 66",
      "0, 18, 65, 100",
      "Any three values",
    ], 1, "Defects cluster where comparison operators flip, so just-inside and just-outside each edge is most productive."),
    q("expect(obj).toBe({a: 1}) fails because:", [
      "toBe compares references, not structure",
      "Objects cannot be asserted",
      "The syntax is wrong",
      "toBe needs await",
    ], 0, "toBe uses Object.is; structural comparison requires toEqual."),
    q("100% statement coverage with 50% branch coverage means:", [
      "Half the code is dead",
      "Every line ran but a conditional was only exercised one way",
      "Coverage is misconfigured",
      "Half the tests fail",
    ], 1, "A ternary or if can execute while only one outcome is ever taken."),
    q("Which is the WRONG thing to mock?", [
      "A payment gateway",
      "The system clock",
      "Your own pure business logic",
      "A third-party HTTP API",
    ], 2, "Mocking the logic under test leaves the test asserting only that you called your own functions."),
    q("Testing Library discourages data-testid as a first choice because:", [
      "It is slow",
      "If an element cannot be found by role or label, assistive technology cannot find it either",
      "testids change often",
      "It breaks snapshots",
    ], 1, "The query priority doubles as an accessibility check."),
    q("The leading cause of flaky tests is:", [
      "Too many assertions",
      "Fixed timeouts instead of waiting for a condition",
      "Testing error paths",
      "Using factories",
    ], 1, "Arbitrary sleeps fail on slow machines and waste time on fast ones; wait for the actual condition."),
    q("Which test detects an IDOR vulnerability?", [
      "Request with no token returns 401",
      "Request with a forged token returns 401",
      "One user requesting another's resource by id returns 403",
      "Rate limiting returns 429",
    ], 2, "A valid token proves identity, not entitlement; only a cross-user request exercises the ownership check."),
    q("A test fails after a code change. The correct first step is:", [
      "Update the assertion to match the new output",
      "Determine whether the code or the expectation is wrong",
      "Skip the test",
      "Add a retry",
    ], 1, "Changing the assertion to match observed behaviour converts a real bug into a documented feature."),
    q("Automated tests are weakest at finding:", [
      "Incorrect calculations",
      "Wrong HTTP status codes",
      "Usability and visual layout problems",
      "Missing validation",
    ], 2, "Whether a layout is broken or a flow is confusing requires human judgement, which is why exploratory testing persists."),
    q("An endpoint reports an average of 300ms and a p95 of 3s. What does that tell you?", [
      "The measurement is broken, since p95 cannot exceed the average that far",
      "The service is healthy, because most users see 300ms",
      "A slow minority is hidden by the mean — roughly one request in twenty waits three seconds",
      "The database is definitely the bottleneck",
    ], 2, "A 300ms mean sits between a fast majority and a slow tail and describes neither; only percentiles reveal that one request in twenty waits three seconds."),
    q("A client mocks the API and the provider renames a JSON field. Which check catches it?", [
      "A contract test verified against the real provider",
      "More unit tests on the client",
      "A higher branch-coverage threshold",
      "A snapshot test of the mocked response",
    ], 0, "Only replaying the consumer's recorded expectations against the real service detects that the two sides have drifted apart."),
    q("Mutation testing answers which question?", [
      "How many lines did my tests execute?",
      "How long does my suite take to run?",
      "Which of my tests are flaky?",
      "If someone broke this code, would a test fail?",
    ], 3, "Stryker alters the production code and reports which changes the suite failed to notice, which is verification rather than execution."),
    q("Which problem can axe and other automated accessibility tools NOT detect?", [
      "An image with a missing alt attribute",
      "Alt text that is present but describes the wrong thing",
      "Text with contrast below 4.5:1",
      "A form input with no associated label",
    ], 1, "Automated rules check that markup exists and is valid; whether the wording is meaningful still needs a human."),
  ],
});
