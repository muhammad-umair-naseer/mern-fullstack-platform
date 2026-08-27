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
        `,
        [
          q('A team\'s suite has passed every run for 18 months. Why might it still be close to worthless?', [
            'Tests decay and need rewriting roughly once a year',
            'It may exercise nothing that changes, so it buys no confidence',
            'Coverage tooling stops reporting after long green streaks',
            'A long green streak means the assertions were removed',
          ], 1, 'A suite exists to buy you confidence to change things, so one that never touches the code people actually modify is not paying for its upkeep.'),
          q('A checkout flow matches its written spec exactly and passes every test, yet customers cannot work out how to use it. Which check failed?', [
            'Validation, because the spec itself solved the wrong problem',
            'Verification, because the code drifted away from the spec',
            'Regression, because an old defect came back into the flow',
            'Coverage, because the flow was never executed by any test',
          ], 0, 'Verification asks whether the code matches the spec and validation asks whether the spec solves the user\'s problem, so a correct build of the wrong design is a validation failure.'),
          q('Why is a slow, flaky suite described as a net negative rather than merely imperfect?', [
            'It burns CI minutes that the team has to pay for',
            'Flaky runs quietly inflate the reported coverage number',
            'People stop running it, then ignore it, then disable it',
            'Slow tests time out and report failures that are not real',
          ], 2, 'The damage is behavioural: once nobody trusts or runs the suite it stops protecting anything while still costing time to maintain.'),
        ]
      ),
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
        `,
        [
          q('A project has 3,000 green unit tests, no integration tests, and a deployed app that is broken. What does the lesson blame?', [
            'The unit tests run too fast to assert anything useful',
            'Too few end-to-end tests sitting at the top of the pyramid',
            'Unit tests are unable to detect a broken pure function',
            'The units were verified against mocks that do not match reality',
          ], 3, 'Skipping the integration layer means every unit is checked against a stand-in, so nothing ever proves the real pieces fit together.'),
          q('Why does the lesson put a ceiling of about 10 seconds on the whole unit suite?', [
            'Jest aborts any suite that runs for longer than that',
            'Longer runs make the coverage report unreliable',
            'Past that people run them only in CI, losing fast feedback',
            'CI providers bill per second of runner time used',
          ], 2, 'The value of unit tests comes from running them constantly while you work, and a suite slow enough to interrupt that stops being run locally at all.'),
          q('Which selection of end-to-end flows matches the lesson\'s advice for a typical product?', [
            'One test for every route the application exposes',
            'Sign-up, sign-in, checkout, and one core action',
            'Whatever screens changed in the most recent sprint',
            'The pages with the most complicated visual layout',
          ], 1, 'E2E tests are expensive and brittle, so you spend them on the handful of flows whose silent failure would be a disaster.'),
        ]
      ),
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
        `,
        [
          q('A crash affects a report screen that two internal staff open once a quarter. How should it be classified?', [
            'High severity, low priority',
            'Low severity, high priority',
            'High severity, high priority',
            'Low severity, low priority',
          ], 0, 'Severity describes how bad the effect is and priority describes how soon it must be fixed, so a crash reaching almost nobody is severe without being urgent.'),
          q('Why does testing 19, 20, 21 and 22 on a field that accepts ages 18 to 65 add almost nothing?', [
            'Those values are outside the accepted range anyway',
            'Any numeric field needs only one valid example',
            'Each of those values exercises a different rounding path',
            'They sit in one equivalence partition and take the same path',
          ], 3, 'Inputs that the code treats identically belong to one partition, so extra members of that partition repeat a test you already ran.'),
          q('Why is "Test the login page" rejected as a test case?', [
            'It does not say which browser or device to use',
            'It has no numbered preconditions written above it',
            'It states no expected result, so it can never pass or fail',
            'It names the behaviour rather than the mechanics',
          ], 2, 'Without one specific expected outcome there is nothing to compare the actual behaviour against, so the case has no verdict.'),
        ]
      ),
            lesson('Turning Requirements into Testable Criteria', 13, `
A ticket said "search should be fast and handle errors gracefully". It shipped. Three weeks later a customer complained that search took four seconds, and the argument started: the developer said four seconds is fine for a query over 90,000 rows, the tester said users abandon at two, and the product manager had meant one second all along. Nobody was lying. The requirement was never testable, so it could never fail, so nobody noticed it was broken.

### The question that separates a requirement from a wish

Can you write down an input and a result that would prove this wrong?

If you cannot, you do not have a requirement, you have a feeling. "Handle errors gracefully" fails that question, because no input produces an outcome you can point at and call wrong. "When the search API returns a 500, the page keeps the previous results visible and shows a Retry button" passes it, because you can force that state and look.

### Pin the vague words down before code exists

| What the ticket says | What to ask |
|---|---|
| "fast" | How many milliseconds, at which percentile, over how many rows? |
| "gracefully" | What does the user see, and what status code comes back? |
| "should validate" | Which fields, which rule, which message, in whose words? |
| "user friendly" | Which user, doing what, and how would we know it worked? |
| "handles large files" | How large, and what happens at one byte over? |

Ten minutes of this in refinement is cheaper than a rejected pull request, and much cheaper than the four second argument.

### Given, When, Then

The format forces a starting state, one action, and one observable outcome:

\`\`\`gherkin
Scenario: enrolling in a cohort that is already full
  Given a cohort "Backend Bootcamp" with capacity 30 and 30 enrolments
  And I am signed in as a learner who is not enrolled
  When I submit the enrolment form
  Then I see "This cohort is full"
  And my dashboard still shows 0 enrolments
\`\`\`

Every line is checkable. A tester can run it by hand, and an automated test can be written from it without anyone asking a follow up question.

### One criterion, one outcome

Broken, because it can be half true:

\`\`\`text
The form validates the email, sends a welcome message, and redirects to the dashboard.
\`\`\`

Which part failed? Split it:

\`\`\`text
1. Submitting an address with no @ shows "Enter a valid email" under the field.
2. A successful sign-up sends one welcome email to the address given.
3. A successful sign-up lands on /dashboard with the learner name in the header.
\`\`\`

Three criteria, three verdicts, three tests.

### Ask the three questions that get skipped

Most tickets describe the happy path and stop. Before you accept one, ask:

- **What happens at the boundary?** Capacity 30 and the 30th learner. A file of exactly 5 MB. A coupon that expires today at 23:59.
- **What happens when it fails?** The card declines, the upload drops at 80 percent, the payment provider times out.
- **Who is allowed to do this?** A signed out visitor, another learner, an admin, the owner of the record.

Those three questions produce most of your test cases, and they regularly surface a decision nobody had made yet. Finding that in refinement costs a conversation. Finding it in production costs an incident.

### Put the negative cases in the definition of done

A definition of done that says only "feature works" gets you a feature that works exactly once, on a fast network, with valid input. Write the empty state, the error state and the permission case into the acceptance criteria and they get built. Leave them out and a user finds them for you.
      `,
        [
          q('Which acceptance criterion could actually fail a test?', [
            'The upload should handle large files gracefully',
            'A 6 MB upload is rejected with "Max size is 5 MB"',
            'Uploading must feel responsive on a normal connection',
            'The upload flow should be friendly to new learners',
          ], 1, 'It names an input and a single observable outcome, so you can drive it and get a clear pass or fail verdict.'),
          q('Refinement describes a new search feature as "fast". Which reply pins that down?', [
            'Under 300 ms at the 95th percentile over 90,000 rows',
            'Quicker than the version we shipped last quarter',
            'Fast enough that testers do not complain about it',
            'As fast as the database can reasonably return it',
          ], 0, 'A number, a percentile and a data volume give you something measurable that can be shown to be met or missed.'),
          q('Why split "validates the email, sends a welcome message, and redirects" into three criteria?', [
            'Three criteria are easier to estimate in story points',
            'A Gherkin scenario is limited to a single Then line',
            'It lets three developers work on the ticket at once',
            'A single criterion can be half true, hiding which part broke',
          ], 3, 'Chained outcomes give one verdict for several behaviours, so a failure does not tell you which of them is wrong.'),
        ]
      ),
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
        `,
        [
          q('Why must the call be wrapped, as in expect(() => calculateTotal(items)).toThrow()?', [
            'Jest only accepts arrow functions inside expect()',
            'Called directly, it throws before expect can run',
            'The wrapper is what makes the assertion asynchronous',
            'toThrow compares references to the error class',
          ], 1, 'Jest needs to invoke the code itself in order to catch the error, so passing an already thrown expression aborts the test instead.'),
          q('A test asserts expect(0.1 + 0.2).toBe(0.3) and fails. What is the right fix?', [
            'Switch to toEqual, which compares numbers loosely',
            'Round the expected value to two decimal places',
            'Wrap the sum in Number() before comparing it',
            'Use toBeCloseTo, since the sum is 0.30000000000000004',
          ], 3, 'Binary floating point cannot represent that sum exactly, so a comparison with tolerance is the only reliable assertion.'),
          q('CI reports that a test named \'validates the form\' failed. Why is that test poorly built?', [
            'Three separate rules share one test, so the name cannot say which broke',
            'Form validation belongs in an end-to-end test instead',
            'The name is longer than the assertions it contains',
            'A describe block should never repeat the word validate',
          ], 0, 'The test name is often all you see in CI, so bundling several behaviours into one test throws away the information you most need.'),
        ]
      ),
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
        `,
        [
          q('Why does the overdue invoice test freeze the clock with jest.setSystemTime?', [
            'Fake timers make the assertions execute faster',
            'Jest cannot parse date strings without them',
            'A real clock makes it fail at year boundaries or in another timezone',
            'The invoice service caches its own timestamp',
          ], 2, 'Anything derived from the real current date changes meaning as time passes, so pinning the clock removes a whole family of intermittent failures.'),
          q('You delete jest.clearAllMocks() from afterEach. What symptom should you expect?', [
            'Every mock returns undefined from the second test onwards',
            'Jest refuses to run the file while in watch mode',
            'Module mocks are silently replaced by the real modules',
            'Call counts leak, so failures depend on the order tests ran',
          ], 3, 'Mock state persists across tests unless it is reset, which produces failures that appear or vanish depending on execution order.'),
          q('Why does an in-memory SQLite database catch bugs that a mocked database cannot?', [
            'It runs your actual queries, so a broken query fails',
            'It holds far more rows than a mock object can',
            'It resets itself automatically between test files',
            'It applies the same timeouts as the production database',
          ], 0, 'A mocked query cannot have a syntax error or a missing column, which is precisely the kind of defect you want the test to expose.'),
        ]
      ),
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
        `,
        [
          q('What is the predictable result of mandating 100% coverage across a codebase?', [
            'Faster suites and noticeably fewer flaky tests',
            'Assertion-free tests and ignore comments to satisfy the gate',
            'Branch coverage rises while statement coverage falls',
            'Critical modules start getting reviewed more carefully',
          ], 1, 'When the number is the target people find the cheapest way to move it, which is executing code without verifying anything.'),
          q('auth.js sits at 38% and a barrel file of re-exports sits at 0%. Which do you act on?', [
            'The barrel file, because 0% is always the worst score',
            'Both equally, since the policy applies to every file',
            'auth.js, because coverage is read by risk and not by rank',
            'Neither, until the project clears the 70% floor overall',
          ], 2, 'The useful question is whether anything important is uncovered, and a file of re-exports carries no behaviour worth verifying.'),
          q('What does a mutation testing tool such as Stryker answer that a coverage report cannot?', [
            'Which lines never execute during the whole suite',
            'How long each individual test file takes to run',
            'Which modules have changed since the last release',
            'Whether deliberately breaking the code makes a test fail',
          ], 3, 'Coverage records execution while mutation testing alters the code and checks that your assertions actually notice the change.'),
        ]
      ),
            lesson('Test-Driven Development in Practice', 13, `
Type this before \`shippingFee\` exists anywhere in the codebase:

\`\`\`js
// shipping.test.js
import { shippingFee } from './shipping';

it('ships free over 5000 rupees', () => {
  expect(shippingFee(5200)).toBe(0);
});
\`\`\`

Run it. \`Cannot find module './shipping'\`. That failure is not a mistake, it is step one, and the discipline around it is worth more than the tests it produces.

### Red, green, refactor

**Red.** Write the smallest test for behaviour that does not exist yet, then watch it fail.

**Green.** Write the least code that makes it pass. Least means least:

\`\`\`js
export const shippingFee = () => 0;
\`\`\`

That feels like cheating. It is not. The test you wrote is genuinely satisfied by it, which tells you the test is not yet strong enough, and the next red step will say so.

**Refactor.** With a green bar, tidy up. Rename, extract, remove duplication. You have a safety net during exactly the operation most likely to break something.

Then loop. Add the case the hardcoded version cannot satisfy:

\`\`\`js
it('charges 250 rupees below the free threshold', () => {
  expect(shippingFee(4999)).toBe(250);
});
\`\`\`

Red again, and now the implementation has to be real:

\`\`\`js
export const shippingFee = (subtotal) => (subtotal >= 5000 ? 0 : 250);
\`\`\`

Adding a second example to force a general implementation has a name: triangulation. It is how you stop yourself shipping a function that satisfies exactly one number.

### Watch it fail for the right reason

This is the step people skip, and skipping it quietly destroys the value of everything else.

\`\`\`js
it.skip('charges 250 below the threshold', () => { /* left skipped by accident */ });

it('rejects a negative subtotal', () => {
  expect(shippingFee(-1)).toThrow();   // wrong: toThrow needs a function, so this never fires
});
\`\`\`

Both of those stay green forever. A test written after the code, which has never once been red, might be asserting nothing at all, and you find out during an incident. Seeing red first proves the test is wired to the thing it claims to check.

Once in a while, change an expected value on purpose and read the failure message. If it does not tell you what broke, the assertion needs work.

### What the loop feels like

| Step | What you are checking | Typical time |
|---|---|---|
| Red | The test can fail, and says why clearly | 60 seconds |
| Green | The behaviour exists, and nothing more | 60 seconds |
| Refactor | The design, with a net underneath you | 0 to 5 minutes |

Run \`npx jest --watch\`, which reruns only the files affected by your last save, so a cycle stays inside a few seconds. If a cycle is taking twenty minutes, the step was too big. Cut it in half.

### The design pressure is the real payoff

Writing the test first makes you the first caller of your own function, and awkward code is obvious from the caller's seat. A function that needs a database handle, a logger and the current time before it can be called at all is telling you those belong in its arguments. Teams that work this way tend to end up with smaller units and fewer mocks, not by aiming at it, but because painful setup gets fixed while fixing it is still cheap.

### When to skip it

This loop suits code where you know the rule and the rule matters: pricing, permissions, parsers, state machines, anything that decides. It fits badly when you are exploring. If you are wiring up an unfamiliar payment API and cannot yet predict the response shape, spike it, throw the spike away, then rebuild it test first. Writing tests against a design you are still guessing at just means rewriting both of them.
      `,
        [
          q('Why does this loop insist you watch the test fail before writing any implementation?', [
            'A test that has never been red might assert nothing at all',
            'Jest caches a result until the test has failed once',
            'Coverage tools ignore tests that pass on the first run',
            'The failing run is what registers the file with the watcher',
          ], 0, 'A skipped test or a broken assertion stays green permanently, so the red step is the only proof that the test is wired to the behaviour.'),
          q('shippingFee is implemented as () => 0 and your first test passes. What does that tell you?', [
            'The implementation is wrong and needs rewriting now',
            'The test is too weak, so write the next red test',
            'The refactor step should be skipped for this function',
            'The assertion used toBe where toEqual was needed',
          ], 1, 'A hardcoded return satisfying the whole suite is a signal about the suite, and the next example forces a general implementation.'),
          q('Where does this approach fit badly?', [
            'Pricing rules with several tiers and rounding',
            'Permission checks deciding who may see what',
            'Exploring an API whose response shape you cannot predict',
            'Parsers where the input format is already written down',
          ], 2, 'You cannot write a meaningful expectation about behaviour you have not discovered yet, so a throwaway spike comes first.'),
        ]
      ),
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
        `,
        [
          q('A submit button enables only after a keyup on the password field. Using fireEvent.change, the test fails. Why?', [
            'fireEvent must be awaited before any assertion runs',
            'fireEvent sets the value in one shot and fires no keyup',
            'fireEvent cannot target inputs located by their label',
            'fireEvent runs outside React\'s rendering lifecycle',
          ], 1, 'userEvent reproduces the full sequence a real keyboard produces, so components reacting to individual key events behave correctly only under it.'),
          q('You swap a component\'s useState for useReducer without changing anything visible. What happens to a well written Testing Library test?', [
            'It fails until the queries are rewritten for the new state',
            'It fails only when the component renders asynchronously',
            'It keeps passing, because it asserts on what the user sees',
            'It passes but logs a false positive warning to the console',
          ], 2, 'Queries by role, label and text describe user visible behaviour, so an internal rewrite that preserves behaviour cannot break them.'),
          q('A list renders after a fetch resolves, and screen.getByText(\'Full-Stack Web Development\') throws. What is the correct fix?', [
            'Await findByText, which polls until the element appears',
            'Wrap the assertion in a try/catch block and retry it',
            'Switch to queryByText, which returns null when missing',
            'Insert a one second sleep ahead of the assertion',
          ], 0, 'getBy checks the DOM once and throws immediately, while findBy waits for the element and resolves as soon as it exists.'),
        ]
      ),
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
        `,
        [
          q('Why do snapshot tests so often end up verifying nothing at all?', [
            'Jest keeps them outside version control by default',
            'They compare only text nodes and never attributes',
            'People press u to update them without reading the diff',
            'Snapshots expire after a set number of test runs',
          ], 2, 'A snapshot fails on every change including intended ones, so the routine response becomes blind acceptance and the check stops meaning anything.'),
          q('Which assertion is called out as breaking on every redesign while catching nothing?', [
            'expect(onSubmit).toHaveBeenCalledWith(formValues)',
            'expect(await screen.findByText(/saved/i)).toBeInTheDocument()',
            'expect(screen.queryByRole(\'alert\')).not.toBeInTheDocument()',
            'expect(button).toHaveStyle({ color: \'red\' })',
          ], 3, 'Asserting an exact colour ties the test to styling rather than meaning, so it fails on cosmetic changes and passes when the message itself is missing.'),
          q('Why does the lesson insist on a test for the failed load state?', [
            'Error states ship broken because nobody exercises them by hand',
            'MSW cannot return a 200 response unless one exists',
            'Coverage tools report untested catch blocks as errors',
            'React unmounts a component that throws while fetching',
          ], 0, 'Manual testing naturally follows the happy path, which leaves the error branch as the code most likely to be wrong when a user finally reaches it.'),
        ]
      ),
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
        `,
        [
          q('Why does the sign-up test build its email address using Date.now()?', [
            'Playwright rejects a literal string inside a fill() call',
            'Timestamps make the recorded trace easier to read later',
            'The address has to sort after the existing records',
            'A fixed address collides on the second run of the test',
          ], 3, 'Each run must set up its own data and pass in isolation, and a hardcoded email hits the duplicate check the moment the test runs twice.'),
          q('A designer renames .btn-primary-2xl during a restyle and thirty E2E tests go red. What does that reveal?', [
            'The suite needs to run after every CSS build step',
            'The tests were coupled to styling rather than behaviour',
            'Playwright\'s auto-waiting was disabled in those tests',
            'The class needed a data-testid attribute beside it',
          ], 1, 'Selecting by role and accessible name describes what the user does, so a purely visual change cannot break tests written that way.'),
          q('CI adds retries: 2, and the suite goes green. What has that actually achieved?', [
            'It turned a visible race condition into a hidden one',
            'It fixed the race by giving the app more time to settle',
            'It doubled the confidence that each passing run provides',
            'It replaced Playwright\'s auto-waiting with manual polling',
          ], 0, 'The underlying timing defect is still there and still reachable by users, but the suite no longer reports it.'),
        ]
      ),
            lesson('Visual Regression Testing', 13, `
One line of CSS changed the shared badge component to \`color: var(--surface)\`. Every unit test passed. Every Playwright test passed too, because \`getByText('Enrolled')\` still found the text in the DOM. The badge rendered white on white for two days, and a support ticket found it before the suite did.

Functional tests prove something is present. They say nothing about whether a human can see it.

### Take a picture and diff it

\`\`\`js
import { test, expect } from '@playwright/test';

test('course hero renders correctly', async ({ page }) => {
  await page.goto('/learn/full-stack-web');
  await expect(page.getByTestId('course-hero')).toHaveScreenshot('course-hero.png', {
    maxDiffPixelRatio: 0.01,
    animations: 'disabled',
  });
});
\`\`\`

The first run writes \`course-hero.png\` beside the test and passes. Every later run renders again and compares pixel by pixel, and on a difference it writes three files: expected, actual, and a diff with the changed pixels painted red. Commit the baseline to git, the same way you commit the code that produces it.

### The failure that catches everyone

You generate baselines on your MacBook. CI runs Ubuntu. Every screenshot fails, forever, and the diff shows faint fuzz around every letter.

Font hinting and anti-aliasing differ between operating systems, and a 0.4 percent pixel difference is still a difference. Baselines are platform specific artefacts. Generate them where they will be compared:

\`\`\`bash
docker run --rm -v "$PWD:/work" -w /work \\
  mcr.microsoft.com/playwright:v1.49.0-noble \\
  npx playwright test --update-snapshots
\`\`\`

Same image locally and in CI, or the technique collapses into noise on day one.

### Remove everything that moves

A screenshot compares the whole region, including the parts that legitimately change on every run.

| Noise source | Fix |
|---|---|
| Timestamps, "2 minutes ago" | Freeze the clock, or mask the element |
| Avatars fetched from a live API | Serve fixture images from a route handler |
| Carousels, spinners, transitions | \`animations: 'disabled'\` plus a stable start state |
| Rows arriving in database order | Seed deterministic data and sort explicitly |
| Scrollbars appearing at some widths | Pin \`viewport\` in the Playwright config |

Masking works per element, and is the right answer when the value genuinely cannot be pinned:

\`\`\`js
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.getByTestId('last-active-at')],
});
\`\`\`

### Component shots beat page shots

A full page screenshot fails on any change anywhere inside it, so one header tweak turns twenty pages red and teaches you nothing you did not already know. Shoot components instead: the badge, the course card, the empty state, the error banner, the nav in both themes. One change fails one image, and the diff points straight at the cause.

Twenty to forty component shots will serve you better than five full page shots, and they run faster.

### A diff is a question, not a verdict

Here is where teams throw the value away. A red visual test means the page changed. It does not mean the page is wrong. Somebody has to open the diff and decide, then either fix the code or accept the new baseline with \`--update-snapshots\`.

If the team habit becomes red, update, push, you have rebuilt the useless snapshot test: a check nobody reads that passes by construction. Upload the diff images as CI artefacts so looking is easy, and treat an updated baseline as a reviewable change in the pull request, because that is exactly what it is.

### Spend them where the eye is the only judge

Screenshots are slower and heavier than DOM assertions, and they need a human in the loop. Reserve them for what text assertions cannot reach: layout, spacing, overflow, contrast, dark mode, and the shared components that appear on every page. Everything else stays cheaper to assert as text.
      `,
        [
          q('Baselines were generated on macOS and CI runs Ubuntu. What should you expect?', [
            'The first CI run rewrites every baseline automatically',
            'Widespread failures caused by anti-aliasing around text',
            'Only screenshots containing photographs are affected',
            'Playwright falls back to comparing the DOM structure',
          ], 1, 'Font rendering differs between operating systems, so pixels shift everywhere text appears unless baselines are produced on the same platform that compares them.'),
          q('Why prefer twenty component screenshots over five full page ones?', [
            'Component images take up far less disk space',
            'Full page shots cannot be masked or given a threshold',
            'A header change fails one image instead of every page',
            'Playwright cannot capture a page taller than the viewport',
          ], 2, 'Narrow shots localise the change, so a red result points at the component that moved rather than at every page containing it.'),
          q('A visual test goes red, the team runs --update-snapshots and pushes. What has the suite become?', [
            'A faster suite holding fewer baseline images',
            'A check that now covers the newly changed component',
            'A stricter gate that fails on the next unrelated change',
            'A check nobody reads, which passes by construction',
          ], 3, 'Accepting every diff without inspecting it removes the human judgement the technique depends on, leaving a test that can no longer fail meaningfully.'),
        ]
      ),
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
        `,
        [
          q('A route responds with status 200 and a body of { error: \'Not allowed\' }. What breaks?', [
            'Supertest cannot read a body from a 200 response',
            'Every client checking res.ok treats the failure as success',
            'Express strips an error key out of a 200 payload',
            'The response gets cached by the browser for an hour',
          ], 1, 'The status code is part of the contract, so signalling failure only in the body means callers that branch on the status handle it as a success.'),
          q('Your API tests pass individually but fail when the whole file runs. What is the likely cause?', [
            'Supertest reuses one port across the entire file',
            'Jest executes each test inside a separate process',
            'State left in the database by earlier tests',
            'The app was imported before the database connected',
          ], 2, 'Without resetting tables between tests, rows created earlier change what later tests see, which makes results depend on execution order.'),
          q('What does it.each give you that one test containing four expect calls does not?', [
            'It runs the cases in parallel worker threads',
            'It stops after the first row that fails',
            'It generates the request payloads for you',
            'The failing row\'s label shows up in the output',
          ], 3, 'Each row becomes its own named test, so the report names the specific case that failed instead of one line number inside a bundle.'),
        ]
      ),
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
        `,
        [
          q('Why must an unknown email and a wrong password produce the same response?', [
            'Differing messages let an attacker enumerate registered accounts',
            'Express cannot send two distinct 401 bodies from one handler',
            'A specific message would leak the password hashing algorithm',
            'Rate limiters key on the body of a failed login attempt',
          ], 0, 'Any difference between the two responses turns the login form into a tool for discovering which addresses have accounts.'),
          q('The quiz endpoint sends answerIndex and the front end simply hides it. Why is that still a defect?', [
            'The client bundle cannot parse the extra JSON field',
            'Anything the server sends is visible in DevTools',
            'The extra field breaks the progress calculation',
            'React state cannot hold the answer without rerendering',
          ], 1, 'Hiding a value in the interface does not remove it from the response, so anyone opening the network tab reads the answers.'),
          q('The final exam should unlock only once all 15 lessons are done. Which single test proves the lock actually holds?', [
            'Complete all 15 lessons and expect a 200 from the exam route',
            'Complete no lessons and expect a redirect to lesson one',
            'Complete 14 lessons and expect a 403 from the exam route',
            'Complete all 15 and expect the answers to be stripped out',
          ], 2, 'Only the near miss exercises the gate, since a request that satisfies the condition proves the unlock rather than the lock.'),
        ]
      ),
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
        `,
        [
          q('A required country field is added to users. Which approach costs one edit instead of forty?', [
            'A shared fixture object imported by every test file',
            'A beforeAll block that seeds twenty user records',
            'A JSON file of users loaded when the suite starts',
            'A makeUser factory holding defaults plus overrides',
          ], 3, 'A factory owns the default shape in one place, so a new required field is added once rather than in every literal that builds a user.'),
          q('What is wrong with a large beforeAll that seeds twenty records for the file?', [
            'Readers must scroll elsewhere, and the tests become coupled',
            'Jest cannot run beforeAll ahead of an async import',
            'Seeded records get rolled back before the first test runs',
            'It forces every test in that file to run one at a time',
          ], 0, 'Setup far from the test hides why it passes and creates shared state that quietly links tests to one another.'),
          q('Why does makeUser({ role: \'admin\' }) read better than writing the whole user literal?', [
            'It states only what this particular test cares about',
            'It avoids importing the user model into the test file',
            'It guarantees the record is written to the database',
            'It shortens the assertion messages in the output',
          ], 0, 'The override is the point of the test and the factory absorbs the rest, so a reader sees the significant detail immediately.'),
        ]
      ),
            lesson('Testing for Race Conditions', 13, `
Cohort capacity was 30. The register showed 31 enrolments, one refund request, and a very confused instructor. The handler looked obviously correct:

\`\`\`js
// enrolments.controller.js
export async function enrol(req, res) {
  const cohort = await db.get('SELECT capacity, seats_taken FROM cohorts WHERE id = ?', [req.params.id]);
  if (cohort.seats_taken >= cohort.capacity) return res.status(409).json({ error: 'Cohort is full' });

  await db.run('INSERT INTO enrolments (user_id, cohort_id) VALUES (?, ?)', [req.user.id, req.params.id]);
  await db.run('UPDATE cohorts SET seats_taken = seats_taken + 1 WHERE id = ?', [req.params.id]);
  res.status(201).json({ ok: true });
}
\`\`\`

Read, decide, write. Three steps, and nothing stops a second request slipping in between step one and step three. Two learners clicked inside the same 40 milliseconds, both read \`seats_taken = 29\`, both passed the check, both inserted.

### A serial test can never see this

Every test written so far awaits one request before sending the next, so the first write always lands before the second read. The bug is invisible to the suite meant to catch it. Fire the requests together instead:

\`\`\`js
it('lets exactly one learner take the final seat', async () => {
  const cohort = await createCohort({ capacity: 30, seatsTaken: 29 });
  const learners = await Promise.all([1, 2, 3, 4, 5].map(() => createLearner()));

  const results = await Promise.all(
    learners.map(l => request(app).post(\`/api/cohorts/\${cohort.id}/enrol\`).set(auth(l)))
  );

  expect(results.filter(r => r.status === 201)).toHaveLength(1);
  expect(results.filter(r => r.status === 409)).toHaveLength(4);

  const row = await db.get('SELECT COUNT(*) AS n FROM enrolments WHERE cohort_id = ?', [cohort.id]);
  expect(row.n).toBe(30);
});
\`\`\`

That final count assertion earns its place. A handler can return one 201 and four 409s and still write five rows, if it inserts before it decides.

### Fix it where the truth lives

Retrying, sleeping, or re-reading the seat count just before the insert all shrink the window without closing it. The window is the bug. Close it in the database.

**A constraint the second writer cannot get past.**

\`\`\`sql
CREATE UNIQUE INDEX one_enrolment_per_learner ON enrolments (user_id, cohort_id);
\`\`\`

The duplicate insert now throws, and you translate that error into a 409. The database arbitrates, because it is the only component that sees every request.

**One atomic statement instead of read then write.**

\`\`\`sql
UPDATE cohorts SET seats_taken = seats_taken + 1
WHERE id = ? AND seats_taken < capacity;
\`\`\`

Check the affected row count. Zero rows means the cohort filled while you were deciding, so return 409 and skip the insert. The check and the write happen in a single operation the database serialises for you.

### The test that fails once in fifty runs is telling the truth

Concurrency tests pass by luck sometimes, so raise the pressure until the result means something:

\`\`\`bash
for i in $(seq 1 20); do npx jest enrolments --runInBand || break; done
\`\`\`

Everywhere else in testing, a run that fails 1 time in 20 means fix the test. Here it means the opposite. The interleaving is rare inside a test harness and routine at 9am on enrolment day, when 400 learners hit the same endpoint. Never quarantine this one.

### The same shape, everywhere else

| Symptom | Where the window opens |
|---|---|
| Two charges for one order | Double click submits before the button disables |
| Duplicate accounts, one email | Existence check without a unique index behind it |
| A balance goes negative | Read balance, subtract in JavaScript, write it back |
| A webhook applied twice | Provider retry with no idempotency key stored |

Every row is read, decide, write. Once you recognise that shape in a handler you can write the failing test in five minutes, and the fix is usually one constraint that should have been there from the beginning.
      `,
        [
          q('Why does sending the two enrolment requests one after another never reproduce the bug?', [
            'Jest clears the enrolments table between individual assertions',
            'Awaiting each request lets the first write land before the second read',
            'The database refuses a second request on the same connection',
            'Express queues requests from one client onto a single worker',
          ], 1, 'The defect lives in the gap between reading the seat count and writing the row, and a serial test never leaves that gap open.'),
          q('Which change prevents the over-enrolment rather than merely making it rarer?', [
            'Re-reading the seat count immediately before the insert',
            'Retrying the handler once when the count looks stale',
            'An UPDATE whose WHERE clause includes seats_taken < capacity',
            'Sorting the queued requests by the time they arrived',
          ], 2, 'Combining the check and the write into one statement removes the window entirely, since the database applies it atomically.'),
          q('Your concurrency test fails on the 50th run and passes the other 49. What should you do?', [
            'Quarantine it, because a 1 in 50 failure is flakiness',
            'Add a retry so the suite stays green in pull requests',
            'Widen the connection pool, since it ran out under load',
            'Fix the code, because the race is real and users will hit it',
          ], 3, 'A rare interleaving in a test harness is a common one in production traffic, so that single red run is an accurate report of a genuine defect.'),
        ]
      ),
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
        `,
        [
          q('Why does the workflow run lint before the unit tests and the browser suite last?', [
            'So the cheapest check fails in about 20 seconds instead of after a 12 minute browser run',
            'Because Playwright cannot start until Jest has released its worker processes',
            'Because branch protection only inspects the result of the final step in the job',
            'Because linting produces the coverage data that the later test steps consume',
          ], 0, 'Ordering steps cheapest first means an obvious mistake is reported almost immediately rather than after the slowest stage has finished running.'),
          q('A team adds a pre-commit hook that runs the entire test suite. What usually happens within a week?', [
            'Commits become atomic because the hook rejects unrelated changes',
            'CI stops finding failures because everything is caught before the push',
            'People start committing with --no-verify, so the hook protects nothing at all',
            'Husky disables the hook automatically once it exceeds the default time limit',
          ], 2, 'A slow hook gets bypassed, so a pre-commit step must stay fast, for example lint plus the tests for changed files only.'),
          q('Why upload the Playwright report as an artifact with if: failure() rather than always?', [
            'Playwright refuses to write a trace when the run has already succeeded',
            'A CI-only failure is hard to diagnose without the trace, and green runs produce nothing worth storing',
            'The upload action rewrites the exit code, which would mask a genuine failure',
            'Traces recorded on passing runs overwrite the baseline used by the next comparison',
          ], 1, 'The trace viewer shows the DOM, network and console at each step, which is what you need for a failure you cannot reproduce locally, and storing that for every green run just wastes space.'),
        ]
      ),
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
        `,
        [
          q('Renaming one CSS class breaks twenty tests. What is the right conclusion?', [
            'The suite is thorough, since a small change was caught in twenty places',
            'The tests need a shared setup helper so the rename happens in one file',
            'Test isolation has failed and the files are leaking state between runs',
            'Those tests assert implementation rather than behaviour, which is a design problem in the tests',
          ], 3, 'Twenty failures from one cosmetic change means the tests are coupled to internals, so they should be rewritten around observable behaviour instead of multiplied.'),
          q('A test has been skipped for four months. Why delete it rather than leave it skipped?', [
            'It reads as coverage of a case that nothing actually verifies, which misleads the next reader',
            'Skipped tests still execute their setup, which slows the whole suite down',
            'Coverage tools count skipped tests as failures once they pass a set age',
            'A skipped test blocks the file it lives in from running in parallel',
          ], 0, 'A permanently skipped test is dead code that quietly claims a scenario is protected when nobody is checking it, so removing it makes the real state of the suite honest.'),
          q('Why put the issue URL in a comment above a regression test?', [
            'The runner uses it to group related failures in the report',
            'It is required before a test can be marked as a regression in CI',
            'Two years later it is the only record of why that odd scenario is special',
            'It lets coverage tooling attribute the lines back to the original bug',
          ], 2, 'Without the link, someone tidying the suite deletes the strange looking case that the test exists to protect, because nothing explains why it matters.'),
        ]
      ),
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
        `,
        [
          q('What separates exploratory testing from clicking around the app at random?', [
            'It is performed only by someone who did not write the feature',
            'A charter: a stated mission with a time box, plus notes on what surprised you',
            'It follows a written script of steps with expected results for each one',
            'It runs after the automated suite has already been executed on the same build',
          ], 1, 'The charter turns the session into a focused investigation with a record, and the surprises in those notes are the leads worth chasing.'),
          q('Password reset and account deletion ship broken unusually often. Why?', [
            'They are difficult to write automated assertions for',
            'They usually live in third party code that nobody on the team owns',
            'They change more frequently than any other part of a product',
            'Nobody exercises them while building features, so nothing reveals the breakage',
          ], 3, 'Developers live on the happy path all day, so these flows are never touched by accident, yet they are exactly what a stuck user depends on.'),
          q('Which manual check most directly exposes duplicate charges on a checkout form?', [
            'Pressing submit twice in quick succession before the first response returns',
            'Pasting 10,000 characters into the delivery notes field',
            'Entering an emoji in the cardholder name field',
            'Reloading the confirmation page after the payment succeeds',
          ], 0, 'A double submit sends two requests before the button can disable itself, which is the common route to charging a customer twice.'),
        ]
      ),
            lesson('Testing After the Deploy', 13, `
A deploy goes green at 14:02. At 14:19 the first ticket lands: checkout returns 500 for every customer paying in euros. CI passed, the integration suite passed, twelve Playwright journeys passed. Staging simply had no euro price rows in it.

Production is the only place with your real data, your real traffic and your real payment provider. Some verification has to happen there, on purpose, with a plan.

### Separate deploying from releasing

A feature flag turns "ship the code" and "expose the feature" into two independent decisions.

\`\`\`js
// server/src/lib/flags.js
const FLAGS = { newCheckout: { percent: 0, allow: ['qa@cortexis.app'] } };

export function isEnabled(flag, user) {
  const rule = FLAGS[flag];
  if (!rule) return false;
  if (rule.allow.includes(user.email)) return true;
  return bucketOf(user.id, flag) < rule.percent;  // 0 percent means off for everyone
}
\`\`\`

Ship dark at 0 percent, enable it for your own account, then 5 percent, then 50. When something is wrong the fix is a flag flip that takes two seconds, instead of a revert, a rebuild and a redeploy that takes fifteen minutes on a good day.

The cost shows up later. Flags accumulate, and every live flag doubles the number of configurations your suite does not cover. Ten flags is 1,024 combinations. Give each flag an owner and a deletion date, and remove it the week after it reaches 100 percent.

### The smoke test that runs after the deploy

Tag a handful of journeys and point them at the deployed URL rather than localhost.

\`\`\`js
test('@smoke a signed-in learner can open a lesson', async ({ page }) => {
  await page.goto(process.env.SMOKE_URL + '/learn/software-testing-qa');
  await expect(page.getByRole('heading', { name: /why tests exist/i })).toBeVisible();
});
\`\`\`

\`\`\`yaml
      - run: npx playwright test --grep @smoke
        env:
          SMOKE_URL: https://app.cortexis.dev
\`\`\`

Four rules keep this safe: use a dedicated account such as qa-smoke@cortexis.dev, prefer read-only paths, tag anything you create so cleanup can find it, and never touch a flow that charges a card or emails a real customer.

Keep it under about 90 seconds. A smoke suite slower than your rollback window reports an outage that has already ended.

### A health check that can actually fail

\`\`\`js
// Returns 200 happily while the database is unreachable
app.get('/health', (req, res) => res.json({ ok: true }));

// Fails when the dependency the app cannot work without fails
app.get('/health', async (req, res) => {
  try {
    await db.get('SELECT 1');
    res.json({ ok: true, version: process.env.GIT_SHA });
  } catch {
    res.status(503).json({ ok: false, dependency: 'database' });
  }
});
\`\`\`

The first version is worse than no health check. Your load balancer reads 200, keeps every instance in rotation, and serves errors confidently for as long as the incident lasts.

### Watch symptoms, not causes

| Signal | Normal | Roll back at |
|---|---|---|
| 5xx rate | under 0.1% | 1% sustained for 2 minutes |
| p95 latency | 180 ms | 2x the pre-deploy figure |
| Checkout completion | 62% | 55% |

CPU and memory tell you the machine is busy. Only the last row tells you the release is losing money, and business metrics are the ones that catch a deploy that is technically fine and commercially broken.

### Rehearse the rollback

The rollback path is code, and untested code does not work. Roll back a real deploy on a quiet Tuesday and time it. Teams routinely discover then that the previous image was pruned, or that the migration dropped a column the old build still selects. Finding that during an incident costs an hour you do not have.
      `,
        [
          q('What does putting a new checkout behind a feature flag at 0 percent buy you?', [
            'It removes the need for a smoke run, since nobody can reach the code',
            'It guarantees the new path cannot contain a bug that affects the old one',
            'Exposure becomes a config change, so backing out is a flip rather than a redeploy',
            'It lets the deploy skip the slower integration stage of the pipeline',
          ], 2, 'Deploying and releasing become separate decisions, so a bad feature is switched off in seconds instead of waiting on a revert, a rebuild and another deploy.'),
          q('Your post-deploy smoke suite takes 12 minutes while a rollback takes 90 seconds. Why is that a problem?', [
            'Playwright times out on any suite that runs longer than ten minutes',
            'It reports the breakage long after the window in which you could have prevented it',
            'Long suites cannot be tagged, so the grep filter stops matching',
            'The deployed build is replaced before the assertions finish evaluating',
          ], 1, 'A smoke run only helps if it finishes inside the rollback window, otherwise customers have already met the failure by the time it speaks up.'),
          q('A /health route returns { ok: true } without touching anything. What goes wrong when the database dies?', [
            'The load balancer restarts every instance at once, causing a cold start storm',
            'Requests queue at the health endpoint until the connection pool times out',
            'Deploys are blocked because the readiness gate never reports a green state',
            'Every instance stays in rotation and keeps serving errors, because the check reports 200',
          ], 3, 'A health check that does not exercise the dependencies the app needs reports healthy during an outage, which is worse than having no check at all.'),
        ]
      ),
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
        `,
        [
          q('A page makes ten sequential API calls and the team dismisses the p99 as \'only 1 percent\'. What is the real effect?', [
            'Nothing changes, because each call independently stays inside p95',
            'About one page load in ten hits that slow tail, since the odds compound across the calls',
            'The tail disappears, because the browser reuses one connection for all ten',
            'Only the first call is affected, as later calls are served from the HTTP cache',
          ], 1, 'Each call has a 99 percent chance of avoiding the tail, and 0.99 to the tenth power is about 0.90, so roughly a tenth of page loads meet it.'),
          q('Someone removes sleep() from the k6 script to \'make the test harder\'. What has actually changed?', [
            'Nothing measurable, because k6 paces virtual users by its own scheduler anyway',
            'Only the ramp-up stage shortens, so the steady state figures stay comparable',
            'The failure rate threshold stops applying, since requests no longer complete in order',
            '50 virtual users now generate the traffic of thousands, so you tune for load you will never receive',
          ], 3, 'Think time is what makes a virtual user resemble a person, and without it a small VU count hammers the service continuously and distorts every number in the run.'),
          q('Why does it matter that k6 exits non-zero when a threshold is breached?', [
            'It lets the pipeline fail the build, which turns the run into a gate rather than a report',
            'It is the only way k6 will write the summary file to disk',
            'It forces k6 to discard results from the ramp-up stage automatically',
            'It signals the load generator to retry the failed requests before finishing',
          ], 0, 'A non-zero exit code is what CI reads, so a breached p95 blocks a merge instead of producing a graph that somebody glances at once.'),
        ]
      ),
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
        `,
        [
          q('Latency is fine at 20 users, and at 60 users nearly every request takes almost exactly 30 seconds. What does that pattern point to?', [
            'A missing index that only matters once the working set exceeds cache',
            'Requests queuing for a database connection, with one never released on an error path',
            'The event loop blocked by a synchronous hash on each request',
            'A response payload large enough that serialisation dominates the request',
          ], 1, 'An identical figure across requests is a timeout rather than work, and waiting the full pool timeout for a connection is the classic cause.'),
          q('EXPLAIN QUERY PLAN prints SCAN enrollments for a query in a hot path. What does that tell you?', [
            'The query returns more rows than the client will actually use',
            'The planner cached a stale plan and needs the statistics refreshed',
            'The database is reading every row because no index covers the filtered column',
            'The query is running inside a transaction that blocks concurrent writes',
          ], 2, 'SCAN means a full table scan, which is cheap on a seeded test table and ruinous on a production sized one, whereas SEARCH USING INDEX means the planner found an index.'),
          q('Profiling shows the database is 90 percent of a route\'s time. You make JSON serialisation twice as fast. What do you gain?', [
            'Roughly half the response time, since serialisation happens on every request',
            'Nothing at all, because serialisation is never on the critical path',
            'Around a quarter, because the two costs overlap in the event loop',
            'About half a percent, because you optimised the small share rather than the large one',
          ], 3, 'Serialisation is 10 percent of the time, so halving it removes 5 percent of that 10, and profiling proportions exist precisely to stop you optimising what is easy instead of what is large.'),
        ]
      ),
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
        `,
        [
          q('LCP measures 4.0 seconds and TTFB within it is 2.8 seconds. What should you work on?', [
            'Convert the hero image to WebP and add fetchpriority high',
            'The server response time, since image work cannot recover time already spent waiting',
            'Cumulative layout shift, which is inflating the LCP measurement',
            'Font loading, by preloading the file and setting font-display swap',
          ], 1, 'Nothing on the page can start rendering before the first byte arrives, so a slow route profile is the real problem wearing a front end costume.'),
          q('Why does the Lighthouse CI config set numberOfRuns to 3?', [
            'Three runs are needed before Lighthouse will emit a CLS value',
            'The assertion syntax requires a minimum sample for numeric thresholds',
            'A single run on a shared CI machine varies enough to make the gate flaky',
            'It warms the HTTP cache so the third run reflects a returning visitor',
          ], 2, 'Scores swing by 10 to 15 points on shared hardware, and a gate that fails at random gets switched off, so the median of several runs is what you assert on.'),
          q('Which change is most likely to remove a layout shift that only appears on a slow connection?', [
            'Setting width and height on the image so the browser reserves its box',
            'Lazy loading images that sit below the fold',
            'Moving the stylesheet link to the end of the document body',
            'Deferring the analytics script until after the load event',
          ], 0, 'Without intrinsic dimensions nothing holds space for the image, so the content below jumps the moment the bytes arrive, which is only visible when arrival is slow.'),
        ]
      ),
            lesson('Soak Tests and Memory Leaks', 13, `
The service is healthy in every load test you run, and it falls over at roughly 04:00 every second night. Restarting fixes it until the next time. That shape is a leak, and a two minute run can never see it, because the evidence only appears on a graph six hours wide.

### Modest load, long duration

A soak test is not a stress test with a bigger number. Hold ordinary traffic for a long time and watch memory rather than latency.

\`\`\`js
export const options = {
  stages: [
    { duration: '10m', target: 40 },
    { duration: '6h',  target: 40 },   // the whole point is the six hours
  ],
  thresholds: { http_req_duration: ['p(95)<400'] },
};
\`\`\`

Then have the process report on itself once a minute:

\`\`\`js
setInterval(() => {
  const m = process.memoryUsage();
  console.log(JSON.stringify({
    rssMb: Math.round(m.rss / 1e6),
    heapMb: Math.round(m.heapUsed / 1e6),
    handles: process.getActiveResourcesInfo().length,
  }));
}, 60_000);
\`\`\`

### Read the troughs, not the peaks

Heap usage always looks like a sawtooth, because garbage collection runs and drops it again. The question is where each trough sits.

| Hour | heapUsed after GC | Verdict |
|---|---|---|
| 0 | 78 MB | baseline |
| 2 | 241 MB | rising |
| 4 | 419 MB | rising, linear |
| 6 | 598 MB | leak, about 87 MB per hour |

A healthy process returns to roughly the same floor after every collection. A leaking one climbs like a staircase. At 87 MB an hour, a container capped at 2 GB dies in about 22 hours, which is exactly the "every second night" pattern you started with.

### The three you will actually find

**A cache with no eviction.** The most common one by far:

\`\`\`js
const rendered = new Map();                       // grows forever
rendered.set(lessonId, markdownToHtml(body));

import { LRUCache } from 'lru-cache';
const rendered = new LRUCache({ max: 5000 });     // bounded, so it cannot be the leak
\`\`\`

**A listener added per request.** \`emitter.on('done', handler)\` inside a route handler adds a subscriber on every call and never removes it. The tell is a MaxListenersExceededWarning at exactly 11 listeners, which is a warning most teams have learned to scroll past.

**A closure holding something large.** A \`setTimeout\` or an unsettled promise that captures \`req\` keeps the entire request, its body and its socket alive for as long as it lives.

### Two snapshots find it in twenty minutes

Guessing is slow. Diffing is fast.

\`\`\`js
const v8 = require('v8');
process.on('SIGUSR2', () => v8.writeHeapSnapshot(\`/tmp/\${Date.now()}.heapsnapshot\`));
\`\`\`

Send \`kill -SIGUSR2 <pid>\`, drive load for twenty minutes, send it again, then load both files into the Chrome DevTools Memory panel and switch to Comparison view sorted by size delta. The constructor that gained the most objects names your leak, and its retainer path names the line holding the reference.

### Memory is not the only thing that leaks

Sockets, file descriptors and timers leak the same way and show the same slow climb. \`lsof -p <pid> | wc -l\` rising steadily across the soak is the same story told in a different unit, and it usually ends with EMFILE rather than an out of memory kill.

### The fix that is not a fix

Raising \`--max-old-space-size\` or scheduling a nightly restart makes the alert stop. Neither touches the bug. Both fail the day traffic doubles and the leak reaches the ceiling before the restart does, and the incident then arrives during business hours with a stale explanation attached to it.
      `,
        [
          q('Why can a two minute load test at 500 virtual users miss a leak that a six hour run at 40 users finds?', [
            'High concurrency triggers garbage collection more aggressively, which hides the growth',
            'k6 only records memory metrics on runs longer than one hour',
            'Leaks are usually caused by concurrency limits rather than by allocation',
            'A leak shows up as growth over time, and a short window has no trend to read',
          ], 3, 'Leaked memory accumulates per request over hours, so the evidence is the slope of the line, which a two minute window is far too narrow to reveal.'),
          q('Heap usage sawtooths up and down throughout the soak. How do you tell a leak from healthy behaviour?', [
            'Compare the troughs after each collection: a healthy process returns to the same floor',
            'Compare the peaks, since a leaking process reaches a higher maximum each cycle',
            'Count the collections, because a leaking process runs GC less and less often',
            'Check whether rss stays below heapUsed, which only happens while memory leaks',
          ], 0, 'Every process sawtooths as garbage collection reclaims memory, so the signal is whether the post-collection baseline stays flat or climbs steadily.'),
          q('A team fixes nightly out-of-memory restarts by raising --max-old-space-size. What have they done?', [
            'Removed the leak, since the extra headroom lets GC reclaim the objects',
            'Traded memory for latency, because a larger heap makes each collection slower',
            'Delayed the same crash, which will return sooner as soon as traffic grows',
            'Converted the crash into a file descriptor exhaustion failure instead',
          ], 2, 'The allocation rate is unchanged, so a bigger ceiling only buys hours, and heavier traffic reaches the new limit faster than the old one.'),
        ]
      ),
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
        `,
        [
          q('Every component passes jest-axe. Why still run axe against the whole rendered page?', [
            'Some violations only exist once components compose, such as duplicate landmarks or a heading jump',
            'jest-axe checks a smaller rule set that omits colour contrast entirely',
            'Component tests cannot report which element caused a violation',
            'Page level runs are the only place WCAG tags can be selected',
          ], 0, 'A component is clean in isolation yet the assembled page can carry two main landmarks, an h1 followed by an h4, or text measured against a background the component never knew about.'),
          q('You enable axe on an existing product and get 300 violations. What is the sensible gate on day one?', [
            'Assert zero violations and stop merging until the backlog is cleared',
            'Skip the gate and run axe manually before each release instead',
            'Fail only on critical and serious impact, and record the rest as a backlog',
            'Raise the threshold to 300 violations and lower it by ten each sprint',
          ], 2, 'A check that is red from its first day gets ignored like any permanently failing test, so gating on the highest impact rules keeps the signal real while the backlog shrinks.'),
          q('Why run the axe page scan again with the colour scheme emulated as dark?', [
            'Dark mode uses a different set of ARIA roles for interactive elements',
            'Contrast is computed from rendered pixels, so a palette can pass in light and fail in dark',
            'axe skips contrast rules entirely unless a colour scheme is set explicitly',
            'Emulating a scheme is the only way to make axe evaluate CSS custom properties',
          ], 1, 'The contrast rule measures the actual foreground and background that were painted, so each theme is a separate set of colour pairs that has to be checked on its own.'),
        ]
      ),
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
        `,
        [
          q('Why must a pact be generated by running the real client code rather than written from the provider\'s API docs?', [
            'The Pact file format cannot be produced by hand or by a generator',
            'Documentation omits the authorisation headers a contract needs to include',
            'Provider verification rejects any pact whose requests were not signed',
            'Documentation is exactly the artefact that drifts, so a pact copied from it tests the docs',
          ], 3, 'The point of a contract is to capture what the shipping client genuinely sends and depends on, and a hand written pact only records what somebody believed was true.'),
          q('What does adding pact-broker can-i-deploy to the provider\'s pipeline change?', [
            'The provider cannot ship while a consumer\'s expectations are unverified against that build',
            'Consumers are automatically upgraded to the newest published contract',
            'The broker regenerates each consumer\'s pact from the provider\'s current responses',
            'Verification runs move from the provider\'s pipeline into the consumer\'s',
          ], 0, 'Exiting non-zero on an unverified expectation turns the pact from a report somebody may read into a gate that blocks the deploy that would break a consumer.'),
          q('The API must rename full_name to name. Which sequence keeps every consumer working?', [
            'Rename it and ask each consumer team to patch and deploy the same afternoon',
            'Rename it behind a version prefix and leave the old route frozen forever',
            'Return both fields, let consumers migrate, then drop full_name once no pact mentions it',
            'Rename it and add a broker override so the old contracts still verify',
          ], 2, 'Additive changes are safe while renames are not, so shipping both fields turns one coordinated release into two independent ones each side can time itself.'),
        ]
      ),
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
        `,
        [
          q('Stryker changes if (score >= 70) to if (score > 70) and no test fails. Which test is missing?', [
            'One asserting that a score of 71 is graded as a pass',
            'One asserting that a score of exactly 70 is graded as a pass',
            'One asserting that a negative score is rejected as invalid',
            'One asserting that a score of 69 is graded as a fail',
          ], 1, 'Only the value sitting exactly on the boundary behaves differently under the two operators, so nothing else in the suite can distinguish the mutant from the original.'),
          q('Why is running Stryker across the whole repository on every pull request a bad idea?', [
            'Mutation scores are meaningless unless measured against the main branch',
            'Stryker rewrites files on disk, so concurrent runs corrupt the working tree',
            'Equivalent mutants make the score fluctuate randomly between runs',
            'The suite runs once per mutant, so a few hundred mutants means a few hundred suite runs',
          ], 3, 'The cost multiplies by the number of mutants, which is why you scope it to modules where correctness really matters and run it nightly rather than per commit.'),
          q('fast-check finds a failure and reports a one element array with a zero in it. What did shrinking do?', [
            'Reduced the failing input to the smallest case that still fails, handing you the reproduction',
            'Discarded generated inputs that violated the declared preconditions',
            'Narrowed the value ranges so later runs generate smaller inputs by default',
            'Replayed the property with a fixed seed until the failure stopped occurring',
          ], 0, 'The original counterexample is usually a large random array, and shrinking strips it back to the minimal failing case so the debugging starts where it normally ends.'),
        ]
      ),
            lesson('Catching Visual Breakage in Shared Components', 13, `
Someone changes the padding on a shared Button component. Two days later a customer emails a screenshot: on checkout the "Pay now" button sits underneath the cookie banner, unreachable. Four hundred unit tests passed. Thirty Playwright journeys passed. The axe pass was clean. Every one of those tests found the button by its accessible role and clicked it directly, and not one of them could see.

Pixels are the one thing your suite has no opinion about. Screenshot diffing gives it one.

### The assertion

\`\`\`js
test('the course card renders as designed', async ({ page }) => {
  await page.goto('/courses');
  await expect(page.getByTestId('course-card').first())
    .toHaveScreenshot('course-card.png', { maxDiffPixelRatio: 0.01 });
});
\`\`\`

The first run writes the baseline PNG and fails on purpose, because nothing has been reviewed yet. Commit that file. Every run afterwards compares against it and, on a mismatch, writes \`course-card-actual.png\` and \`course-card-diff.png\` next to it so you can see exactly which pixels moved.

### Remove the noise before you write the assertion

A full page shot of a dashboard containing a relative timestamp, a spinner mid-animation and a text caret fails on every single run. That is the fastest way to get visual testing deleted.

\`\`\`js
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.getByTestId('last-active'), page.locator('.avatar')],
  animations: 'disabled',
  caret: 'hide',
});
\`\`\`

Masked regions are painted over in both images, so the content underneath stops mattering. Freeze the clock and use fixed seed data for the rest.

### The trap that catches everyone once

You record baselines on a MacBook. CI runs Ubuntu. Every snapshot fails, and the diff images look identical to the human eye, because font antialiasing and emoji glyphs differ between operating systems. The fix is to generate baselines in the same image CI uses:

\`\`\`bash
docker run --rm -v $(pwd):/work -w /work \\
  mcr.microsoft.com/playwright:v1.50.0-noble \\
  npx playwright test --update-snapshots
\`\`\`

Playwright already hints at this by naming files \`course-card-chromium-linux.png\`. A baseline is only valid on the platform that produced it.

### Prefer components over pages

| Approach | One header padding change | Reviewer behaviour |
|---|---|---|
| 40 full page shots | 40 red diffs | Approves all without reading |
| Component shots plus 4 page shots | 1 red diff | Reads the one that matters |

That second column is the entire argument. A visual suite that fails in bulk gets rubber stamped, and a rubber stamped baseline verifies nothing, which is the same rot that kills a flaky unit suite. Screenshot components in isolation, and keep a small number of page level shots for the things only composition can break: overlap, stacking order, and responsive breakpoints.

### Tolerances hide the bug you are looking for

\`maxDiffPixelRatio: 0.05\` on a 1280x720 shot tolerates about 46,000 changed pixels, which is a comfortably sized button drifting out of place. Start strict, and when something legitimately varies, mask that region rather than loosening the threshold for the whole image. Local relaxation, never global.

### What a diff cannot tell you

A red diff says "different". It never says "wrong". Updating a baseline is a human decision, and \`--update-snapshots\` run without opening the images is the visual equivalent of pressing \`u\` on a failing snapshot test. Review the diff, then accept it, and put the new PNG in the pull request so a second person sees the change too.
      `,
        [
          q('Thirty Playwright journeys pass while a button sits hidden behind a cookie banner. Why did none of them fail?', [
            'The banner is rendered in a portal that Playwright excludes from the page',
            'Overlapping elements only break clicks on touch devices, which the suite does not emulate',
            'They locate the button by role and click it directly, so overlap never affects them',
            'The suite retries obscured clicks until the banner is dismissed automatically',
          ], 2, 'Role based queries operate on the accessibility tree rather than on painted pixels, so an element that is present and clickable in code passes even when a human cannot reach it.'),
          q('Baselines recorded on macOS all fail on an Ubuntu CI runner, yet the diffs look identical. Why?', [
            'Playwright compresses PNGs differently depending on the host filesystem',
            'Font antialiasing and glyph rendering differ per platform, so pixels differ invisibly',
            'The Linux runner defaults to a different device pixel ratio for every viewport',
            'Screenshots taken on macOS include the window shadow in the captured region',
          ], 1, 'Text is rasterised by the operating system, so the same page produces slightly different pixels, which is why baselines are generated in the same container CI uses.'),
          q('A relative timestamp makes one page snapshot fail every run. What is the better fix?', [
            'Raise maxDiffPixelRatio until the changing text falls inside the tolerance',
            'Delete the snapshot and rely on the E2E journey covering that page',
            'Re-record the baseline as part of every CI run before the comparison',
            'Mask that element so both images paint over it and the rest stays strict',
          ], 3, 'Masking removes exactly the unstable region while every other pixel stays under a tight tolerance, whereas a looser global threshold would also hide a genuinely misplaced element.'),
        ]
      ),
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
      chapter(
      'Testing Work That Happens Later',
      'Asserting on behaviour that finishes long after the response returns: queued jobs, inbound webhooks, and work scheduled for next Tuesday.',
      [
      lesson('Testing Background Jobs and Queues', 13, `
A learner finishes the last lesson of Software Testing & QA, the route returns 200, and your test asserts a row in \`certificates\`. Green on your laptop. Red in CI, every single run.

Nothing is broken. The certificate is written by a worker process, and CI never started one. The route only put a message on a queue.

That is the model to hold onto: **enqueue and execute are two events in two processes**, and a test that pretends otherwise is testing a coincidence. Split the seam and cover both halves.

### Half one: did the producer enqueue the right thing

\`\`\`js
import request from 'supertest';
import app from '../src/app.js';
import { certificateQueue } from '../src/queues/certificate.queue.js';

beforeEach(async () => { await certificateQueue.obliterate({ force: true }); });

it('queues a certificate when the final lesson is completed', async () => {
  const res = await request(app)
    .post('/api/learn/software-testing-qa/lessons/48/complete')
    .set('Authorization', \`Bearer \${aliToken}\`);

  expect(res.status).toBe(200);

  const [job, ...rest] = await certificateQueue.getJobs(['waiting', 'delayed']);
  expect(rest).toHaveLength(0);
  expect(job.name).toBe('issue-certificate');
  expect(job.data).toEqual({ userId: 7, courseSlug: 'software-testing-qa' });
});
\`\`\`

No worker runs here, and none should. This test owns one question: did the route react correctly. Assert that \`rest\` is empty too, because "enqueued twice" is a real bug that costs a duplicate email.

### Half two: does the handler do the work

Export the handler as an ordinary function and call it directly. No Redis, no worker, no waiting.

\`\`\`js
import { issueCertificate } from '../src/jobs/issue-certificate.js';

it('stores one certificate and emails it', async () => {
  await issueCertificate({ data: { userId: 7, courseSlug: 'software-testing-qa' } });

  expect(await db.all('SELECT * FROM certificates WHERE user_id = 7')).toHaveLength(1);
  expect(mailer.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'ali@example.com' }),
  );
});
\`\`\`

Two fast, boring tests now cover what one flaky test covered badly.

### Retries are guaranteed, so idempotency is not optional

Any queue worth running retries. With \`attempts: 5\` and exponential backoff, BullMQ cannot tell a handler that failed from one that succeeded and then lost its Redis connection while acknowledging, so it runs the handler again. Delivery is at least once, never exactly once.

\`\`\`js
it('issues one certificate even when the job is retried', async () => {
  const job = { data: { userId: 7, courseSlug: 'software-testing-qa' } };
  await issueCertificate(job);
  await issueCertificate(job);

  expect(await db.all('SELECT * FROM certificates WHERE user_id = 7')).toHaveLength(1);
  expect(mailer.send).toHaveBeenCalledTimes(1);
});
\`\`\`

Calling the handler twice is close to free, and it catches the bug users actually notice: three identical emails at 2am.

### Pass identifiers, never objects

\`\`\`js
// broken: a snapshot of the learner, frozen at enqueue time
await certificateQueue.add('issue-certificate', { user, course });
\`\`\`

The payload goes through \`JSON.stringify\` on its way into Redis. Dates come back as strings, \`undefined\` keys disappear, and a class instance arrives as a plain object with none of its methods. Worse, the copy is stale: if the learner corrects their email in the twenty minutes before the worker picks the job up, the certificate goes to the old address.

\`\`\`js
await certificateQueue.add('issue-certificate', { userId: user.id, courseSlug: course.slug });
\`\`\`

An in-process test never catches this, because nothing serialised anything. Force the round trip:

\`\`\`js
expect(JSON.parse(JSON.stringify(job.data))).toEqual(job.data);
\`\`\`

### The poison job

| Case | What the test asserts |
|---|---|
| Handler throws once | The job returns to the queue and succeeds on attempt two |
| Handler throws every time | The job lands in the failed set carrying its error message |
| Malformed payload | The job fails immediately instead of burning five attempts |
| One job keeps failing | Other jobs in the queue still drain |

That last row is the one people forget. A handler that crashes the worker process, rather than throwing inside it, takes every other queued job down with it. Assert that an unparseable payload produces a failed job and a living worker.
      `,
        [
          q('Your test completes the final lesson and asserts a certificates row. It is green locally and red in CI. What is the most likely cause?', [
            'The CI Redis instance evicts queued jobs before the assertion runs',
            'No worker process is running in CI, so nothing executed the handler',
            'Supertest closes the connection before the queue finishes writing',
            'Jest fake timers hold back the queue\'s exponential backoff delay',
          ], 1, 'Enqueueing and executing happen in different processes, so a route test only proves a message was queued, and the row appears only where a worker is actually consuming that queue.'),
          q('Why enqueue { userId: 7 } rather than the whole loaded user record?', [
            'Redis refuses any job payload larger than a few hundred bytes',
            'BullMQ compares payloads by reference when it deduplicates jobs',
            'Nested objects cannot be asserted with toEqual in a producer test',
            'The payload is serialised now and read later, so it is stale and loses its types',
          ], 3, 'A queued payload goes through JSON.stringify, which strips class instances and turns dates into strings, and the copy also reflects the learner as they were at enqueue time rather than when the worker finally runs.'),
          q('A test calls issueCertificate twice with the same job data. Which defect is it hunting?', [
            'A handler that repeats its work when the queue retries the job',
            'A handler that leaks a database connection on every call',
            'A producer that adds the same job to the queue twice over',
            'A worker that consumes jobs faster than the producer supplies them',
          ], 0, 'Queues deliver at least once, so the handler genuinely runs again after a retry, and calling it twice is the cheapest way to prove the second run does not issue a second certificate.'),
        ]
      ),
      lesson('Asserting on Eventual Consistency', 13, `
A test that fails one run in twenty is worse than one that fails every run. Both are untrusted; only one gets fixed.

Here is the shape it almost always takes:

\`\`\`js
await request(app).post('/api/admin/courses').send(newCourse);
await new Promise(r => setTimeout(r, 500));

const hits = await search.query('software testing');
expect(hits).toHaveLength(1);
\`\`\`

The search index is filled by a listener that runs after the write commits. On your laptop it takes 40ms. On a CI box running six shards at once it occasionally takes 900ms. That sleep is a bet on hardware, and the hardware changes.

### Poll the assertion, not the clock

\`\`\`js
export async function eventually(assertion, { timeout = 5000, interval = 50 } = {}) {
  const deadline = Date.now() + timeout;
  let lastError;
  for (;;) {
    try {
      return await assertion();
    } catch (err) {
      lastError = err;
      if (Date.now() >= deadline) throw lastError;
      await new Promise(r => setTimeout(r, interval));
    }
  }
}
\`\`\`

\`\`\`js
await eventually(async () => {
  const hits = await search.query('software testing');
  expect(hits.map(h => h.slug)).toContain('software-testing-qa');
});
\`\`\`

Fast machine: passes in 40ms. Loaded machine: passes in 900ms. Genuinely broken code: fails in five seconds.

The line that earns its keep is \`throw lastError\`. A helper that throws \`new Error('timed out after 5000ms')\` tells you the clock ran out and nothing else. Rethrowing the last assertion hands you Jest's diff instead, so the failure names the value that was wrong and you debug the feature rather than the helper.

### Polling cannot prove a negative

\`\`\`js
// This passes every time. It has never once run the code it claims to check.
await eventually(async () => {
  expect(await outbox.all()).toHaveLength(0);
});
\`\`\`

The first poll fires microseconds after the request returns, before the worker has even picked up the job. The assertion holds, \`eventually\` returns, green. It would still pass if you deleted the entire feature.

| Assertion | Safe under polling |
|---|---|
| the certificate row eventually appears | Yes, the condition can only become true |
| the suspended learner is never emailed | No, it is true before any work starts |

A negative assertion needs a **completion signal**, not a deadline:

\`\`\`js
await worker.drained();                       // every queued job has now run
expect(await outbox.all()).toHaveLength(0);
\`\`\`

If the system offers no such signal, build one for tests: a counter of processed messages, or a sentinel job you enqueue last and wait on.

### Better than waiting well is not waiting

Most eventual consistency inside a suite is accidental. A queue that can run inline, an index you can flush on demand, an event bus with a \`flush()\` for tests. Take the determinism when it is on offer:

\`\`\`js
projector.mode = 'inline';                    // apply events synchronously
await request(app).post('/api/admin/courses').send(newCourse);
expect(await search.query('software testing')).toHaveLength(1);
\`\`\`

That test cannot flake and it runs in 3ms. Keep polling for the few tests that genuinely cross a process boundary, because crossing that boundary is the thing they exist to prove.

### Budget the timeout

Generous timeouts cost nothing while tests pass and everything the moment they stop. Sixty polling tests with a 30 second ceiling turn one broken worker into a thirty minute red build that nobody waits for. Five seconds with a 50ms interval is a sane default: twenty attempts a second, and a failing suite that still finishes before the coffee does.

### Never put the action inside the poll

\`\`\`js
// broken: twenty POSTs, twenty enrolments, one baffled reviewer
await eventually(async () => {
  await request(app).post('/api/enrol').send({ slug: 'software-testing-qa' });
  expect(await enrolments(7)).toHaveLength(1);
});
\`\`\`

Every retry repeats the side effect, and the assertion then fails for a reason the test itself created. Do the action once, outside the helper. Poll only the read.
      `,
        [
          q('Why should a polling helper rethrow the last assertion error instead of throwing its own timeout error?', [
            'A custom error would reset Jest\'s per test timeout budget',
            'Jest ignores any error not created inside an expect call',
            'The failure then shows the real diff instead of only saying the clock ran out',
            'Rethrowing lets the helper attempt one more poll past the deadline',
          ], 2, 'Rethrowing the last assertion means the failure output names the value that was actually wrong, so you spend the debugging time on the feature rather than on the waiting helper.'),
          q('Which assertion becomes meaningless the moment you wrap it in a polling helper?', [
            'That a suspended learner never receives a welcome email',
            'That the certificate row eventually appears in the database',
            'That the search index eventually contains the new course',
            'That the enrolment count for the learner eventually reaches three',
          ], 0, 'A negative condition is already true before any work starts, so the first poll succeeds immediately and the helper returns green even if the feature had been deleted entirely.'),
          q('Which change removes the race from the search index test instead of waiting on it more carefully?', [
            'Raise the sleep from 500ms to three seconds on CI only',
            'Run the indexing projector inline in the test environment',
            'Retry the whole test file up to three times before failing',
            'Replace the search client with a stub that returns the course',
          ], 1, 'Applying the index update synchronously makes the condition true by the time the request returns, so the test cannot flake and still exercises the real indexing code.'),
        ]
      ),
      lesson('Webhooks, Callbacks, and Third-Party Sandboxes', 13, `
A student pays. Stripe sends \`checkout.session.completed\`. Nothing happens. The provider dashboard shows eleven delivery attempts, every one answered with a 400, and the log line reads \`signature verification failed\`.

Your tests passed because they sent a JavaScript object and let Supertest serialise it. Stripe signs the exact bytes it sent. \`express.json()\` parsed those bytes, threw them away, and the handler re-serialised \`req.body\` into a string with different key order and no whitespace. Different bytes, different HMAC, rejected.

\`\`\`js
// the raw body must survive, and only on this route
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());                       // everything else, mounted after
\`\`\`

### An inbound webhook is an unauthenticated request from a stranger

Three properties, each worth its own test.

**It can be forged.** Anyone who learns the URL can POST to it.

\`\`\`js
import crypto from 'node:crypto';

const sign = (raw, secret, ts = Math.floor(Date.now() / 1000)) =>
  \`t=\${ts},v1=\${crypto.createHmac('sha256', secret).update(\`\${ts}.\${raw}\`).digest('hex')}\`;

const deliver = (raw, sig) => request(app)
  .post('/api/webhooks/stripe')
  .set('Stripe-Signature', sig)
  .set('Content-Type', 'application/json')
  .send(raw);                                  // a string, so the bytes are preserved

it('rejects a payload signed with the wrong secret', async () => {
  const raw = JSON.stringify(paidEvent);
  const res = await deliver(raw, sign(raw, 'whsec_attacker'));

  expect(res.status).toBe(400);
  expect(await enrolments(7)).toHaveLength(0);
});

it('rejects a correctly signed payload that is two hours old', async () => {
  const raw = JSON.stringify(paidEvent);
  const stale = Math.floor(Date.now() / 1000) - 7200;
  const res = await deliver(raw, sign(raw, process.env.STRIPE_WEBHOOK_SECRET, stale));

  expect(res.status).toBe(400);
});
\`\`\`

Skip the timestamp tolerance and a captured request stays valid forever, which is a free replay attack against anyone who ever saw one delivery.

**It arrives more than once.** At least once delivery is the norm, so the same event id will land twice.

\`\`\`js
it('handles a repeated delivery exactly once', async () => {
  const raw = JSON.stringify(paidEvent);
  const sig = sign(raw, process.env.STRIPE_WEBHOOK_SECRET);

  expect((await deliver(raw, sig)).status).toBe(200);
  expect((await deliver(raw, sig)).status).toBe(200);   // not 409

  expect(await enrolments(7)).toHaveLength(1);
});
\`\`\`

Answering 409 on the duplicate looks tidy and is a trap. The provider reads any non 2xx as failure and keeps retrying with backoff for days. Record the \`event.id\`, ignore what you have already seen, answer 200.

**It arrives out of order.** \`invoice.paid\` before \`customer.subscription.created\` is ordinary, because deliveries are independent HTTP requests over independent connections. Branch on state you can read from your own database, never on the sequence you assume.

### Answer fast, work later

\`\`\`js
export async function stripeWebhook(req, res) {
  const event = verify(req.body, req.header('Stripe-Signature'));
  await events.record(event.id, event.type, req.body);    // durable and cheap
  res.status(200).end();                                  // acknowledge first
  await enrolmentQueue.add('grant-access', { eventId: event.id });
}
\`\`\`

Providers allow the endpoint a short window, often around ten seconds. Render the certificate PDF inline and a slow render becomes a timeout, the timeout becomes a retry, and one payment becomes six enrolment attempts. Persist, acknowledge, hand it to the queue.

### Sandboxes on a schedule, fixtures in the pull request

| Where | What runs | Why |
|---|---|---|
| Every pull request | Recorded fixtures replayed at your handler | Fast, offline, deterministic |
| Nightly | The provider's real sandbox | Catches fixture drift |
| Local exploration | \`stripe listen --forward-to localhost:4000/api/webhooks/stripe\` | Real payloads worth recording |

Sandboxes are shared, rate limited, and sometimes simply down. Point every pull request at one and the build goes red for reasons unrelated to the change, which is exactly how a suite loses its audience.

Capture fixtures from genuine deliveries with \`stripe trigger checkout.session.completed\`, save the raw body byte for byte, and pin the API version in your client config. Providers add fields and widen enums, and the nightly run is what tells you on a Tuesday morning instead of during a launch.
      `,
        [
          q('Signature verification passes in your test and fails on every real delivery. What is wrong?', [
            'The webhook secret differs between sandbox mode and live mode',
            'The provider signs its own response rather than the request body',
            'Supertest strips the signature header from an outgoing POST',
            'express.json parsed the bytes away, so the handler hashes a rebuilt body',
          ], 3, 'An HMAC is computed over the exact bytes the provider sent, so a route that verifies a signature has to read the raw body before any JSON parser discards it.'),
          q('Your endpoint answers 409 when it recognises an event id it already processed. What happens next?', [
            'The provider marks the endpoint unhealthy and disables it at once',
            'The provider reads it as a failure and retries that event for days',
            'The duplicate is dropped cleanly, which is the intended behaviour',
            'The provider resends the event with a fresh id and a new signature',
          ], 1, 'Providers treat any non 2xx status as a failed delivery, so signalling a duplicate with an error code starts a backoff retry loop that never resolves on its own.'),
          q('Why replay recorded fixtures on pull requests and leave the provider sandbox to a nightly run?', [
            'Sandbox deliveries omit the signature header that fixtures carry',
            'Fixtures exercise the retry behaviour a sandbox cannot trigger',
            'Sandboxes are shared and rate limited, so builds go red for unrelated reasons',
            'A nightly job is the only place the raw request body stays available',
          ], 2, 'A dependency you do not control will sometimes be slow or down, and a build that fails for reasons unconnected to the change loses the team\'s trust, while the nightly run still catches fixture drift.'),
        ]
      ),
      lesson('Cron Schedules, Time Zones, and Date Boundaries', 13, `
Two bugs, one feature. On 29 March a learner in London got the daily streak reminder twice. On 25 October nobody got it at all. Both are British daylight saving transitions, and the job was scheduled for 01:30.

Scheduling looks like arithmetic and behaves like geography.

### Test the expression, not the scheduler

Booting a scheduler and waiting is not a test. Ask the parser what the expression actually means:

\`\`\`js
import { CronExpressionParser } from 'cron-parser';

const nextRun = (expr, from, tz) =>
  CronExpressionParser.parse(expr, { currentDate: new Date(from), tz }).next().toISOString();

it('fires at 09:00 Karachi whatever zone the server runs in', () => {
  expect(nextRun('0 9 * * *', '2026-06-01T00:00:00Z', 'Asia/Karachi'))
    .toBe('2026-06-01T04:00:00.000Z');
});

it('holds 09:00 local across the London spring transition', () => {
  expect(nextRun('0 9 * * *', '2026-03-29T00:00:00Z', 'Europe/London'))
    .toBe('2026-03-29T08:00:00.000Z');         // 09:00 BST, not 09:00 UTC
});
\`\`\`

Karachi has no daylight saving, so 09:00 there is 04:00 UTC all year. London moves. A schedule pinned to UTC silently drifts by an hour twice a year, and the complaint arrives as "the reminder comes at the wrong time now", which nobody connects to a deploy from six weeks ago.

Then avoid 01:00 to 03:00 altogether for anything that must run once a day. On 29 March 2026, 01:30 in London does not exist. On 25 October it happens twice.

| Boundary | Instant to freeze | What breaks |
|---|---|---|
| Spring forward | 2026-03-29, Europe/London | 01:30 never occurs, the run is skipped |
| Fall back | 2026-10-25, Europe/London | 01:30 occurs twice, the job runs twice |
| Short month | 2026-01-31 plus one month | Billing anchored to the 31st |
| Leap day | 2028-02-29 | Anniversary logic and 365 day arithmetic |
| Year end abroad | 2026-12-31T20:00 in New York | Already 2027 in UTC |

### "Today" belongs to the learner, not to the database

Streaks are where this bites hardest.

\`\`\`sql
-- broken: date('now') is the server's day, and the server runs in UTC
SELECT count(*) FROM lesson_completions
WHERE user_id = ? AND date(completed_at) = date('now');
\`\`\`

A learner in Karachi studying at 02:00 on Tuesday did it at 21:00 Monday UTC. Their streak breaks while they are staring at it.

\`\`\`js
const { start, end } = dayRangeIn(user.timezone, clock.now());   // returns UTC instants
const rows = await db.all(
  \`SELECT * FROM lesson_completions
    WHERE user_id = ? AND completed_at >= ? AND completed_at < ?\`,
  [userId, start.toISOString(), end.toISOString()],
);
\`\`\`

Store instants in UTC, always. Compute the boundaries in the learner's zone, at read time.

\`\`\`js
it.each([
  ['Asia/Karachi',     '2026-06-02T02:00:00Z', '2026-06-02'],
  ['America/Denver',   '2026-06-02T02:00:00Z', '2026-06-01'],
  ['Pacific/Auckland', '2026-06-02T02:00:00Z', '2026-06-02'],
])('%s reads %s as %s', (tz, instant, expected) => {
  expect(localDay(instant, tz)).toBe(expected);
});
\`\`\`

One instant, three different calendar days. Any function answering "which day is it" without a zone argument is guessing.

### Stop the machine's zone from hiding bugs

Run CI somewhere that is neither UTC nor your own city:

\`\`\`yaml
    env:
      TZ: Pacific/Auckland
\`\`\`

Half the date bugs in a codebase surface on the first run, this one included:

\`\`\`js
new Date('2026-03-29')                 // midnight UTC
new Date('2026-03-29T00:00:00')        // midnight local, a different instant
\`\`\`

They look like the same date. In Auckland they are thirteen hours apart, so a test asserting the first while the code builds the second passes in UTC and fails everywhere on earth that matters.

### Two copies of the same run

When a job takes longer than its interval, the scheduler starts a second copy on top of the first, and your idempotency work from earlier in the chapter is what stops the damage. Assert the lock, not only the output:

\`\`\`js
it('skips a run while a previous one still holds the lock', async () => {
  const slow = sendStreakReminders();          // deliberately left unresolved
  await expect(sendStreakReminders()).resolves.toEqual({ skipped: true });
  await slow;
});
\`\`\`
      `,
        [
          q('A daily reminder is pinned to 09:00 UTC and its users are in London. What do they experience?', [
            'The reminder arrives an hour late for the months that London is on BST',
            'The reminder is skipped entirely on both daylight saving transition days',
            'The reminder arrives twice on the day the clocks go forward in March',
            'The reminder drifts by a minute each day until the scheduler restarts',
          ], 0, 'London sits an hour ahead of UTC for roughly seven months of the year, so a schedule expressed in UTC lands at 10:00 local across that entire period instead of the promised time.'),
          q('Why is a streak query that compares date(completed_at) with date(\'now\') wrong?', [
            'The comparison stops the planner using an index on completed_at',
            'date(\'now\') is evaluated per row, so a long query straddles midnight',
            'It measures the day in the server\'s zone, not the day the learner is in',
            'Storing completions as UTC makes the date function return yesterday',
          ], 2, 'One instant lands on different calendar days depending on the zone you read it in, so a boundary computed on the server breaks the streak of every learner whose local day differs from UTC.'),
          q('What does setting TZ to Pacific/Auckland in the CI job actually buy you?', [
            'Cron expressions start parsing in the learner\'s zone by default',
            'Date sensitive tests no longer need the clock frozen explicitly',
            'Stored UTC timestamps get converted on the way out of the database',
            'Code that quietly assumes the machine\'s zone fails instead of passing',
          ], 3, 'Running CI in UTC hides every place a date is built from the machine\'s local zone, and a deliberately awkward zone turns those silent assumptions into failures you can actually fix.'),
        ]
      ),
      ],
      [
      q('A payment webhook is retried by the provider, and the queue it feeds retries its job. How many times can the certificate handler run for one payment?', [
        'Once, because the queue drops a job as soon as the producer adds it',
        'Twice at most, one retry from each of the two layers involved',
        'Any number of times, so the handler itself has to be idempotent',
        'Once per event id, since Redis rejects a payload it already holds',
      ], 2, 'Retries compound across every at least once layer in the path, so the only reliable defence is a handler that produces the same result however often it runs.'),
      q('A nightly job resets streaks at 00:00 UTC and learners in Karachi lose their streak at 5am local. What is the defect?', [
        'Completions are stored in local time rather than as UTC instants',
        'The day boundary is computed in the server\'s zone, not the learner\'s',
        'The cron expression omits the seconds field the scheduler requires',
        'The scheduler skips a run whenever a daylight saving change occurs',
      ], 1, 'Midnight UTC is 05:00 in Karachi, so the reset lands in the middle of a learner\'s day, and the fix is to derive each learner\'s day range in their own zone.'),
      q('Your job tests call the handler directly and never touch Redis. Which class of bug does that miss?', [
        'A payload that does not survive the serialisation the queue performs',
        'A handler that writes the wrong row into the certificates table',
        'A missing await on the mailer call inside the handler body',
        'A validation rule the producing route forgot to apply first',
      ], 0, 'Calling a handler in process passes live objects straight through, while a real queue stringifies them, so dates, undefined keys and class methods only break once the message crosses that boundary.'),
      q('Which test genuinely proves that a suspended learner is never emailed by the enrolment worker?', [
        'Poll the outbox for five seconds and assert it stayed empty throughout',
        'Wait for the worker to drain, then assert the outbox holds no message',
        'Assert the outbox is empty immediately after the route returns 200',
        'Mock the mailer and assert it was constructed with no recipient list',
      ], 1, 'A negative condition is true before any work begins, so it only means something once you have a signal that every queued job has finished running.'),
      ]
    ),
    chapter(
      'The Suite at Scale',
      'Keeping a large suite fast, hermetic, and pleasant to work in once dozens of engineers depend on it every single day.',
      [
      lesson('Real Dependencies in Disposable Containers', 13, `
Two pull requests opened a minute apart, and both CI jobs died with \`relation "enrollments" does not exist\`. Neither change touched the schema. Both jobs pointed at the same shared test database, and one of them truncated tables while the other was halfway through a run.

A shared database is the cheapest way to make a large suite untrustworthy. Every job can see every other job's rows, so a real failure and someone else's cleanup look identical, and the habit everyone learns is to press retry.

### One container per run

Testcontainers starts a real Postgres or Mongo for the run and throws it away afterwards. Not a mock, not a stub, the actual engine your production code talks to.

\`\`\`js
// test/globalSetup.js
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function () {
  const pg = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('cortexis_base')
    .start();
  process.env.DATABASE_URL = pg.getConnectionUri();
  globalThis.__PG = pg;
}
\`\`\`

Pin the tag. \`postgres:16-alpine\` and \`postgres:latest\` are the same image today and a different major version in March, and the day they diverge you get a failure nobody can reproduce locally.

### The port you must never hardcode

Docker publishes 5432 on a random host port, often something like 49173. \`getConnectionUri()\` already carries it, and \`pg.getMappedPort(5432)\` hands it to you directly. Write \`5432\` into a test config and you have rebuilt the shared instance bug: two runs on the same agent fighting over one port.

### An open port is not a ready database

The official Postgres image starts the server, runs its init scripts, then restarts it. Wait for the socket alone and you connect during that first boot, then get a connection reset when it cycles. That is why the readiness line is matched twice:

\`\`\`js
.withWaitStrategy(Wait.forLogMessage(/ready to accept connections/, 2))
\`\`\`

Mongo has its own version of this. A bare \`mongo\` image is a standalone node, and standalone nodes refuse sessions, so every test using a transaction fails with \`Transaction numbers are only allowed on a replica set member\`. \`MongoDBContainer\` starts a single node replica set and initiates it for you.

### The cost that appears at eight workers

| Startup step | Once | Times 8 workers |
|---|---|---|
| Pull cached image | 0.0s | 0.0s |
| Start container | 1.4s | 11.2s |
| Run 41 migrations | 9.2s | 73.6s |

Eighty five seconds of setup in front of forty seconds of tests. The fix is to migrate once and copy:

\`\`\`sql
CREATE DATABASE cortexis_w3 TEMPLATE cortexis_base;
\`\`\`

That copy takes about 180ms. Each Jest worker reads \`process.env.JEST_WORKER_ID\`, creates its own database from the template, and gets a private, schema identical instance. One container, N databases, and no truncation between files.

### Reuse locally, never in CI

\`\`\`js
const container = new PostgreSqlContainer('postgres:16-alpine');
if (!process.env.CI) container.withReuse();
\`\`\`

Reuse keeps the container alive between local runs, so your inner loop drops from eleven seconds to under one. In CI it is poison: a reused container carries whatever the previous run left behind, which is exactly the shared database you just escaped.

### What this buys that a fake cannot

An in-memory stub happily accepts an insert that your real unique index rejects, and returns \`created_at\` as a string where the driver returns a Date. Those two bugs ship together, because the formatting code only runs after the insert succeeds. Run against the real engine and both fail at test time, on your machine, with a stack trace.
      `,
        [
          q('A team keeps one shared Postgres for every CI job and truncates all tables at the start of each run. Why does that make failures worse rather than better?', [
            'Concurrent jobs now wipe each other\'s rows, so a real failure looks like someone else\'s run',
            'Truncating resets sequences, so generated primary keys start colliding across runs',
            'Postgres refuses TRUNCATE while another session holds an open transaction on the table',
            'The truncate runs ahead of migrations, so the schema drifts from what tests expect',
          ], 0, 'Truncating a shared instance destroys data belonging to whatever else is running at that moment, so the resulting failure has nothing to do with the change under test and trains everyone to press retry.'),
          q('Eight Jest workers each start a container and run 41 migrations, adding 85 seconds of setup to a 40 second suite. What removes most of that cost?', [
            'Drop to two workers so that fewer containers have to be started at all',
            'Swap the container for an in-memory database that needs no migration step',
            'Migrate once into a base database, then give each worker a TEMPLATE copy',
            'Run the migrations lazily, on the first query each worker actually issues',
          ], 2, 'Creating a database from a template copies an already migrated schema in roughly 180ms, so the 9.2 second migration run happens once rather than once per worker while every worker still gets a private database.'),
          q('Your Postgres container waits only for the port to open, and tests intermittently fail with a connection reset. What is going on?', [
            'The mapped host port changes between the wait check and the first connection',
            'The connection pool opens more sessions than the container permits by default',
            'Alpine images close idle sockets sooner than the pool\'s keepalive interval',
            'The image boots the server, runs init scripts, then restarts it, so the first open port is temporary',
          ], 3, 'The official image starts Postgres once for initialisation and again for real, which is why the readiness log line has to be matched twice before the database is safe to connect to.'),
        ]
      ),
      lesson('Sharding, Parallelism, and the Runtime Budget', 13, `
The suite took 34 minutes. Someone added four CI machines, split the run across them, and it took 31 minutes. Three minutes of benefit for four times the compute.

The reason was one file. \`checkout.spec.ts\` ran for 29 minutes on its own, and no number of extra machines makes a single file finish sooner. Your suite's floor is its longest indivisible unit, and until you break that up, every shard past the first is money you are setting on fire.

### Two different knobs

**Parallelism** happens inside one machine: several worker processes on the cores you have. **Sharding** happens across machines: each one runs a disjoint slice and something merges the results afterwards.

\`\`\`bash
# machine 3 of 6, four workers on that machine
npx jest --shard=3/6 --maxWorkers=4
npx playwright test --shard=3/6 --reporter=blob
\`\`\`

### The default worker count is wrong inside a container

Jest defaults to \`os.cpus().length - 1\`. Node reads that from the host, not from your cgroup. On a Kubernetes runner with a 2 CPU limit sitting on a 64 core node, \`os.cpus()\` returns 64 and Jest starts 63 workers on two cores. The symptom is not a crash. It is a suite that got slower right after you gave it more machines, plus timeouts that only ever happen in CI.

Set it explicitly, with \`--maxWorkers=2\` or \`--maxWorkers=50%\`, and never leave it to a default that is measuring the wrong thing.

### Workers cost more than CPU

Four workers, each holding a connection pool of ten, is forty sessions. Postgres ships with \`max_connections=100\`, so eight workers is fine and eleven gives you \`FATAL: sorry, too many clients already\` on whichever file happens to start last. Every worker also gets its own module registry, so four workers means four copies of your app resident in memory.

### Sharding is only as good as your file sizes

Playwright keeps a spec file whole unless \`fullyParallel\` is on, and Jest shards at file granularity too.

| Shards | Sum of test time | Longest file | Wall clock |
|---|---|---|---|
| 1 | 34m | 29m | 34m |
| 4 | 34m | 29m | 29m |
| 4 | 34m | 6m | 9m |

The third row is the same suite after \`checkout.spec.ts\` was split into five files by flow. Splitting the file bought twenty minutes. The machines bought three.

### Merge the reports, or you get six of them

\`\`\`bash
npx playwright test --shard=$SHARD/6 --reporter=blob
# in a job that runs after all six have finished
npx playwright merge-reports --reporter=html ./all-blob-reports
\`\`\`

Without the merge step, a failure lands in shard four's artifact and nobody thinks to look there.

### When another shard stops paying

Each shard repeats the same fixed setup: checkout, \`npm ci\`, browser download. Call that 110 seconds.

| Shards | Test time each | Wall clock | Billed minutes |
|---|---|---|---|
| 1 | 34m | 35.8m | 35.8 |
| 4 | 8.5m | 10.3m | 41.2 |
| 8 | 4.3m | 6.1m | 48.8 |
| 16 | 2.1m | 3.9m | 62.4 |

Going from eight shards to sixteen saves 2.2 minutes of waiting and costs 13.6 minutes of compute. On a repo merging six pull requests a day that trade is fine. On one merging three hundred a week it is not, and the honest fix is to attack the fixed cost first: cache \`node_modules\`, bake the browsers into the runner image, and stop paying 110 seconds sixteen times over.
      `,
        [
          q('A 34 minute suite is split across four machines and now finishes in 29 minutes. What is the most likely cause?', [
            'The four shards each repeat npm ci, which cancels out most of the saving',
            'One spec file runs for 29 minutes and a shard cannot split a single file',
            'Jest assigns shards by hashing paths, so three of them received no files',
            'The blob reports are merged serially once every shard has finished',
          ], 1, 'Sharding distributes whole files, so the longest single file sets a floor on wall clock time no matter how many machines you add to the job.'),
          q('Jest runs on a Kubernetes runner limited to 2 CPUs on a 64 core node, with no maxWorkers set. What happens?', [
            'Jest reads the cgroup quota and settles on one worker per available CPU',
            'The runner throttles the process, so the suite runs at about two workers of speed',
            'Jest falls back to running in band because it cannot detect a core count',
            'os.cpus() reports 64, so Jest starts 63 workers and they thrash on two cores',
          ], 3, 'Node reports the host\'s CPU count rather than the container limit, so the default of cores minus one spawns far more workers than there are cores, which slows the run and produces timeouts that only appear in CI.'),
          q('Eleven Jest workers, each holding a connection pool of ten, run against a Postgres left on its defaults. What failure should you expect?', [
            'FATAL: sorry, too many clients already, on whichever file starts last',
            'Deadlocks between workers writing the same rows inside a shared schema',
            'Slower queries, because the planner reuses cached plans across processes',
            'Connection resets once the pool outgrows the container\'s mapped port range',
          ], 0, 'Eleven pools of ten want 110 sessions against a default max_connections of 100, so the run dies as soon as enough workers are busy at the same time.'),
        ]
      ),
      lesson('Running Only the Tests a Change Can Break', 13, `
A pull request changed one line of marketing copy in \`client/src/pages/Courses.js\`. CI ran 4,100 tests for 34 minutes and all of them passed, which everyone already knew they would.

Selection is the tool for that. Work out which tests a change could possibly break, run those, skip the rest.

### How the graph is built

\`\`\`bash
npx jest --changedSince=$(git merge-base origin/main HEAD)
\`\`\`

Jest asks git which files changed, then walks the import graph backwards: any test file that transitively imports a changed module is in scope. Change \`server/src/services/pricing.js\` and you get the fourteen test files that reach it, not the other 386.

Use the merge base, not \`origin/main\` itself. On a branch that is three days stale, diffing against a moving tip pulls in everyone else's commits and you are back to running everything.

### The edges the graph cannot see

Static analysis sees \`import\`. It sees nothing else.

| You changed | Import graph sees | What can actually break |
|---|---|---|
| \`db/migrations/0042_enrollments_idx.sql\` | nothing | every integration test |
| \`test/fixtures/courses.json\`, read via readFileSync | nothing | every test using that seed |
| \`docker-compose.test.yml\` | nothing | the entire run |
| \`.env.test\` | nothing | anything reading config |
| \`package-lock.json\` | nothing | anything at all |

The failure mode is specific and nasty. Selection reports zero tests to run, the required check goes green in nine seconds, the branch merges, and main is red for a change that never had a single test executed against it.

### Force a full run on the paths that lie

\`\`\`bash
BASE=$(git merge-base origin/main HEAD)
if git diff --name-only "$BASE" | grep -qE '^(package-lock\\.json|jest\\.config\\.js|docker-compose|\\.github/|server/src/db/migrations/|test/fixtures/)'; then
  npx jest --ci
else
  npx jest --ci --changedSince="$BASE"
fi
\`\`\`

That list is not clever and does not need to be. Every path on it costs one full run whenever it changes, which is rare, and buys you an outage you did not have.

### Selection is for pull requests only

Main runs the whole suite. Nightly runs the whole suite plus the slow end to end specs. Selection is an optimisation on the feedback loop, never the last gate before code ships. A team that lets a filtered run be the only thing that ever executed finds the gap during an incident, usually while reading a green check that proved nothing.

### Coverage based selection

Static graphs miss runtime edges. Coverage does not. Run the full suite once with per test coverage and store the inverse map, from file to the tests that executed a line in it:

\`\`\`json
{
  "server/src/services/pricing.js": ["services/pricing.test.js", "api/checkout.test.js"],
  "test/fixtures/courses.json": ["api/catalogue.test.js"]
}
\`\`\`

Now the JSON fixture appears, because the run genuinely read it. The catch is staleness: the map is only true for the commit that produced it, so rebuild it on every main build and treat any file missing from the map as "run everything".

### Monorepos select one level up

\`\`\`bash
npx turbo run test --filter='...[origin/main]'
\`\`\`

Turborepo and Nx pick whole packages rather than files. Touch one function in \`packages/shared-utils\` and every dependent package runs its entire suite, which is coarser than Jest's file level answer. The trade is that their graph includes edges you declare by hand, so a migrations folder or a shared \`.env\` can be wired to the packages it affects instead of being invisible.
      `,
        [
          q('A pull request only edits server/src/db/migrations/0042_enrollments_idx.sql. Selection reports zero tests and the check goes green. What went wrong?', [
            'Migrations run in globalSetup, which selection deliberately leaves out of scope',
            'The merge base was stale, so git reported no changed files on the branch',
            'Nothing imports a SQL file, so it has no edge in the graph selection walks',
            'Jest ignores files outside its roots, and the migrations folder sits outside them',
          ], 2, 'Selection follows import statements, and a migration is loaded by a runner at execution time rather than imported by any test, so a change that can break every integration test looks like a change that touches nothing.'),
          q('Why diff against git merge-base origin/main HEAD instead of against origin/main directly?', [
            'On a stale branch the tip carries other people\'s commits, so everything is selected',
            'origin/main is a remote ref and git diff cannot resolve it without a fresh fetch',
            'Only the merge base includes uncommitted changes sitting in the working tree',
            'Diffing the tip drops files that were renamed after the branch was created',
          ], 0, 'The merge base is where your branch actually diverged, so the diff holds only your changes, while a moving tip drags in unrelated commits and defeats the point of selecting at all.'),
          q('What does coverage based selection catch that a static import graph misses?', [
            'New test files added in the same commit, which a static graph cannot resolve',
            'A JSON fixture read with readFileSync, since the run genuinely touched it',
            'Tests that fail intermittently, because their coverage varies between runs',
            'Transitive imports sitting more than three levels from the changed module',
          ], 1, 'Coverage records the files a test actually read while running, so a runtime dependency such as a fixture loaded from disk appears in the map even though no import statement points at it.'),
        ]
      ),
      lesson('A Test Harness Other People Can Use', 13, `
\`grep -rl "jwt.sign" server/test\` returned 84 files. Every one of them had pasted the same twenty two lines: create a user, mint a token, remember which secret, set the header. Then the token gained a \`tenantId\` claim, and one engineer spent two days editing 84 files that all did the same thing slightly differently.

A test harness is a product and your teammates are its users. The measure is not how clever it is. It is what a new test costs to write.

### Judge it by the diff

Before:

\`\`\`js
const user = await User.create({ email: 'a@example.test', role: 'instructor' });
const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
const res = await request(app)
  .get('/api/courses/42/roster')
  .set('Authorization', \`Bearer \${token}\`);
\`\`\`

After:

\`\`\`js
const api = await authedClient({ role: 'instructor' });
const res = await api.get('/api/courses/42/roster');
\`\`\`

Four lines of ceremony became zero, and the \`tenantId\` change becomes a one file diff instead of a two day one.

### Factories state only what the test is about

\`\`\`js
const enrollment = await makeEnrollment({ status: 'refunded' });
\`\`\`

Course, student, price and dates are defaults the reader can ignore. One rule keeps that honest: if an assertion depends on a value, the test must set that value. A test asserting \`expect(res.body.price).toBe(4900)\` while the factory quietly chose 4900 is a test of the factory, and it breaks the morning somebody edits a default for an unrelated reason.

### Every helper needs an escape hatch

\`\`\`js
export const authedClient = async (opts = {}) => {
  const user = await makeUser(opts);
  const agent = request(app).set('Authorization', \`Bearer \${sign(user)}\`);
  return Object.assign(agent, { raw: request(app), user });
};
\`\`\`

The first test that needs a malformed \`Authorization\` header will otherwise copy the helper and edit it. Now there are two harnesses, and only one of them gets maintained.

### Do not hide the assertion

Helpers belong in arrange. They rarely belong in assert.

\`\`\`js
expectEnrollmentToBeValid(res); // fails with: expected true, received false
\`\`\`

That tells a reader nothing at 2am. When an assertion really is shared, make it a matcher that prints the actual values:

\`\`\`js
expect.extend({
  toBeEnrolledIn(res, courseId) {
    const ids = (res.body.courses ?? []).map((c) => c.id);
    return {
      pass: ids.includes(courseId),
      message: () => \`expected enrolments \${JSON.stringify(ids)} to include \${courseId}\`,
    };
  },
});
\`\`\`

### Harness bugs arrive disguised as flakes

\`\`\`js
let n = 0;
export const email = () => \`student\${++n}@cortexis.test\`;
\`\`\`

Passes for months, then throws duplicate key errors the week someone sets \`--maxWorkers=4\`. Each worker is a separate Node process with its own copy of the module, so worker 1 and worker 3 both hand out \`student1@cortexis.test\`. Any global state in a harness has this shape, and it always presents as flakiness rather than as a bug in the helper:

\`\`\`js
import { randomUUID } from 'node:crypto';
export const email = () => \`student-\${randomUUID()}@cortexis.test\`;
\`\`\`

### Write down three recipes

A \`test/README.md\` holding exactly three worked examples (an API test, a seeded course, running one file against a real database) beats a wiki page nobody edits. Put \`test/support/\` in CODEOWNERS so harness changes get read by someone who knows what depends on them. That is the difference between one harness and eighty four.
      `,
        [
          q('makeEnrollment() defaults price to 4900, and a test asserts that the response price is 4900. Why is that a problem?', [
            'The test depends on a default it never states, so an unrelated edit breaks it',
            'Hard coded currency amounts break as soon as the suite runs in another locale',
            'Two tests taking the default create duplicate rows under a unique index',
            'The factory writes to the database, so the assertion races the pending insert',
          ], 0, 'If an assertion depends on a value then the test should set that value, otherwise it is really checking the factory and it fails the day somebody edits a default for an unrelated reason.'),
          q('A helper increments a module level counter to build unique emails. It passes for months, then fails with duplicate key errors under maxWorkers=4. Why?', [
            'Jest resets module state between test files, which restarts the sequence',
            'Each worker is its own process with its own counter, so they emit the same values',
            'Parallel inserts arrive out of order, so the unique index treats them as a batch',
            'Module level state is shared across workers, so some increments are lost to a race',
          ], 1, 'Workers are separate Node processes rather than threads, so each one loads its own copy of the module, starts the counter at zero, and several of them produce student1@cortexis.test at once.'),
          q('Why prefer a custom matcher over a shared expectEnrollmentToBeValid(res) helper?', [
            'Matchers run faster, because Jest compiles each one once per test file',
            'A helper cannot be called inside waitFor, so async assertions must be inlined',
            'The matcher prints the real values, while the helper fails with expected true',
            'Matchers are typed, so a wrong argument is caught before the suite even runs',
          ], 2, 'A boolean helper collapses every possible failure into the same unhelpful message, whereas a matcher supplies text containing the actual response, which is what somebody debugging at 2am needs to see.'),
        ]
      ),
      ],
      [
      q('Which change most reduces wall clock time for a 34 minute suite whose longest spec file runs for 29 minutes?', [
        'Raise maxWorkers on every shard from four up to eight',
        'Split the long spec into five files, then shard across four machines',
        'Move from four shards to sixteen and merge the blob reports',
        'Cache node_modules so that each shard can skip the npm ci step',
      ], 1, 'The longest indivisible file sets the floor, so breaking it up is what unlocks any benefit from sharding, while more machines and faster setup cannot get the run below 29 minutes.'),
      q('A pull request touches only docker-compose.test.yml. What should the CI selection logic do with it?', [
        'Select the tests that read the compose file at runtime, using coverage data',
        'Skip the run, since an infrastructure file carries no application behaviour',
        'Run the integration suite alone, as the only tier that uses containers',
        'Force a full run, because the file sits on the always-run path list',
      ], 3, 'Nothing imports a compose file so the graph selects nothing, and a path list that forces a full run costs one slow build on a rare change while preventing a green check that tested nothing at all.'),
      q('Eight workers share one Postgres container. What gives each worker isolation without paying for eight containers?', [
        'One database per worker, created by worker id from a migrated template',
        'A truncate of every table in beforeEach inside each worker process',
        'A transaction opened per worker and rolled back when the process exits',
        'A separate connection pool per worker pointed at the same database',
      ], 0, 'Creating a database from an already migrated template takes about 180ms and gives each worker a private, schema identical instance, so no worker can read or destroy another worker\'s rows.'),
      q('A harness wraps supertest and exposes no way to reach the underlying agent. What is the predictable outcome?', [
        'Tests slow down, because every call rebuilds the application under test',
        'Coverage drops, since the wrapper hides those lines from the instrumenter',
        'The first unusual test copies the helper, and the copy stops being maintained',
        'Parallel workers collide, because the wrapper holds shared module state',
      ], 2, 'Without an escape hatch, the first test needing something the helper does not support duplicates it, and that duplicate then drifts away from the original as only the real one keeps getting updates.'),
      ]
    ),
    chapter(
      'Testing Like an Attacker',
      'Probing a system the way someone hostile would, and turning every finding into a check that runs forever.',
      [
      lesson('Turning a Threat Model into Test Cases', 13, `
A two hour whiteboard session on the learn API produced a wiki page with twenty threats on it. Six months later nobody had opened it, and one line on that page, "a learner reads another learner's certificate", had already shipped as a real bug twice.

A threat model that ends in a document decays. A threat model that ends in test cases runs on every commit.

### Model one data flow, not the whole product

Trying to model everything at once is what kills the exercise. Pick a single flow and draw the points where data crosses a trust boundary.

Certificate issue on this platform: the browser calls \`POST /api/learn/certificate/:courseId\`, \`certificate.controller.js\` reads progress from Mongo, then nodemailer sends a PDF link to the learner's inbox. Four boundaries: the network edge, the JWT check, the database query, and the mail relay. Every interesting threat sits on one of those four lines.

### STRIDE supplies the prompts

STRIDE is six questions to ask at each boundary. The value is not the taxonomy, it is that each answer has an obvious test.

| Category | The question about this flow | The test it becomes |
|---|---|---|
| Spoofing | Can Ali request Sara's certificate? | 403 when the enrolment belongs to another user |
| Tampering | Can the client send \`completedLessons\` itself? | fields outside the Joi schema are stripped |
| Repudiation | Can a certificate issue leave no trace? | every issue writes an audit row with actor id |
| Information disclosure | Is the PDF link guessable? | the id is a random token, not the Mongo \`_id\` |
| Denial of service | Can one learner request 500 PDFs? | the 21st request in a minute returns 429 |
| Elevation of privilege | Does \`role\` come from the token or the body? | a body claiming admin does not grant admin |

### Abuse cases live next to user stories

For every story, write the misuse story. It takes one line and it is the thing your backlog never contains.

\`\`\`text
Story:  As a learner, I download my certificate once the course is complete.
Abuse:  As anyone holding a valid token, I download a certificate for a
        course I never enrolled in, by changing the id in the URL.
\`\`\`

The abuse case is already a test name. Write it.

### Turn the boring threat into a sweep

The threat that actually bites is never the exotic one. It is an object id in a URL with no ownership check, repeated across six routes because nobody swept.

\`\`\`js
const owned = listRoutes(app).filter(r => r.path.includes(':id'));

describe.each(owned)('$method $path refuses a resource owned by someone else', (route) => {
  it('answers 403 or 404, never 200', async () => {
    const sara = await seedLearnerWithProgress('data-science-python');
    const ali = await seedLearner();
    const path = route.path.replace(':id', sara.enrolmentId);

    const res = await request(app)[route.method.toLowerCase()](path)
      .set('Authorization', \`Bearer \${ali.token}\`);

    expect([403, 404]).toContain(res.status);
  });
});
\`\`\`

Notice \`listRoutes(app)\` rather than a hand kept array. A hand kept array is missing the route somebody added last Thursday, which is exactly the route with no ownership check.

### Keep the model honest

Give each threat an id and put that id in the test name.

\`\`\`js
it('T-CERT-04 issues no certificate for an enrolment owned by another learner', ...)
\`\`\`

Now \`grep -r "T-CERT-" tests/\` answers the only question that matters at review time: which threats have a check behind them and which are still just a sentence. A threat with no test is an open risk item, not a paragraph on a page nobody opens.

Rank the list by how many rows leak if the mitigation is wrong, not by how clever the attack is. The clever attack needs a researcher. The missing ownership check needs a curious learner with the developer tools open.
      `,
        [
          q('A team keeps its threat model as a wiki page of twenty risks. What goes wrong within a few months?', [
            'The page cannot record a severity or a likelihood per risk',
            'Nothing verifies the mitigations still exist, so a refactor removes one silently',
            'Wiki pages cannot be reviewed in a pull request beside the code',
            'STRIDE categories expire and have to be renumbered every quarter',
          ], 1, 'A written risk has no way to notice when the code that mitigated it changes, whereas a named test fails the moment the mitigation disappears.'),
          q('Why start a threat model on one data flow such as certificate issue rather than the whole platform?', [
            'STRIDE only applies to flows that read from a database',
            'A single flow is the largest scope a Joi schema can describe',
            'Threats sit on trust boundaries, and one flow makes those boundaries concrete',
            'A whole system diagram cannot be drawn until the code is finished',
          ], 2, 'Boundaries are where data changes hands, and following one request end to end shows exactly where those crossings are instead of producing a vague product wide list.'),
          q('The ownership sweep iterates an array of routes that a developer maintains by hand. What is the failure mode?', [
            'A route added later ships with no ownership test and nobody notices',
            'describe.each cannot iterate an array longer than ten entries',
            'A hand written array makes the suite slower than one combined test',
            'Route templates containing parameters cannot be passed to supertest',
          ], 0, 'The route most likely to be missing its ownership check is the newest one, and that is precisely the route a manually maintained list will not contain.'),
        ]
      ),
      lesson('Fuzzing and Malformed Input', 13, `
\`POST /api/learn/quiz/chapter/6/submit\` with a body of \`{"answers": "3"}\` returned a 500, and the response carried a stack trace naming the file path, the Mongo driver version, and the exact line where \`answers.map\` was called on a string. No test covered it, because no developer thinks to send a string where an array belongs.

A fuzzer thinks of nothing else.

### Fuzzing needs an oracle, and the oracle is an invariant

You cannot assert the correct output for random input, because you do not know it. So you assert the properties that must hold for every input, valid or not.

| Invariant | Why it holds | A violation means |
|---|---|---|
| Status is never 5xx | Bad input is the caller's fault | an unhandled exception path |
| The body never contains \`/server/src/\` | Paths are internal | the error handler leaks internals |
| The process is still alive afterwards | Nothing should kill it | a crash or an out of memory bug |
| p99 stays under 200ms | Work is bounded by input size | catastrophic backtracking or an unbounded loop |

### A property, a seed, and a shrunk counterexample

\`\`\`js
import fc from 'fast-check';
import request from 'supertest';

it('never returns 5xx for a malformed submission', async () => {
  await fc.assert(
    fc.asyncProperty(fc.anything(), async (answers) => {
      const res = await request(app)
        .post('/api/learn/quiz/chapter/6/submit')
        .set('Authorization', \`Bearer \${learner.token}\`)
        .send({ answers });

      expect(res.status).toBeLessThan(500);
      expect(res.text).not.toMatch(/\\/server\\/src\\//);
    }),
    { numRuns: 300, seed: 42 }
  );
});
\`\`\`

The \`seed: 42\` is not decoration. A fuzz job with a random seed that fails on Tuesday and passes on Wednesday teaches nobody anything, and gets deleted within a month. Pin the seed in CI, run the wide random search nightly, and record the seed on failure:

\`\`\`text
Property failed after 87 tests
{ seed: -1029384756, path: "12:3:1", endOnFailure: true }
Counterexample: { answers: [null] }
\`\`\`

Shrinking is what makes this usable. The input that broke it was a 40 element array of mixed garbage; fast-check reduced it to the smallest input that still fails, and \`[null]\` points straight at the line to fix.

### Nearly valid beats totally random

\`fc.anything()\` is mostly rejected by the Joi schema at the door, so a long green run may mean your validator works and the handler was barely reached. Generate values that are almost right:

\`\`\`js
const nearlyValid = fc.record({
  answers: fc.array(fc.oneof(fc.nat(), fc.constant(null), fc.integer({ min: -5 })), { maxLength: 60 }),
  timeSpentMs: fc.oneof(fc.nat(), fc.constant(-1), fc.constant(2 ** 53)),
});
\`\`\`

That is where the defects sit: a negative duration, an answers array longer than the question list, an index of 1e9 used to read past the end.

### Fuzz below HTTP, where it is a thousand times cheaper

An HTTP round trip costs milliseconds. A pure function costs microseconds. The markdown renderer, the slug parser, and the certificate token decoder can take a hundred thousand cases in the time the route takes three hundred.

\`\`\`js
fc.assert(fc.property(fc.string(), (raw) => {
  expect(renderMarkdown(raw)).not.toMatch(/<script/i);
}));
\`\`\`

### Every counterexample becomes a fixture

Fuzzing finds a bug once. A named regression test keeps it found.

\`\`\`js
// found by the nightly fuzz run on 2026-03-11, seed -1029384756
it('rejects an answers array longer than the question list', async () => {
  const res = await submit({ answers: new Array(400).fill(0) });
  expect(res.status).toBe(400);
});
\`\`\`

The common mistake is running the fuzzer, fixing the crash, and keeping nothing. Six weeks later a refactor reintroduces it, and the fuzzer is not scheduled that day.
      `,
        [
          q('Random input has no known correct output, so what does a fuzz property assert instead?', [
            'That the response matches a snapshot recorded on the first run',
            'That every generated body produces a 400 with an identical message',
            'That the generated inputs reach each branch of the handler once',
            'Invariants that hold for all input, such as never returning a 5xx',
          ], 3, 'The oracle problem is solved by asserting properties true of every input, so a 5xx, a leaked path, or a dead process is a failure regardless of what was sent.'),
          q('Fuzzing the submit route with fc.anything() runs green for an hour. Why is that weak evidence?', [
            'Almost every value is rejected by the schema, so the handler is barely reached',
            'fc.anything() produces only primitives, never arrays or nested objects',
            'supertest serialises anything() values into an empty request body',
            'An hour is well below the run count fast-check needs to shrink',
          ], 0, 'Totally random values fail validation at the door, so the run mostly exercises Joi and says very little about the code behind it, which is why nearly valid generators find more.'),
          q('Why pin the seed for the fuzz property that runs on every pull request?', [
            'A pinned seed lets fast-check skip inputs it has already tried',
            'Without it a failure may not reproduce next run, so nobody can fix it',
            'A random seed makes the shrinking step run in quadratic time',
            'Jest refuses to report a test that generated different input twice',
          ], 1, 'A check that goes red once and green on the retry gets treated as flaky and disabled, so determinism in CI is what keeps the fuzz job credible.'),
        ]
      ),
      lesson('Dependency, Secret, and Supply Chain Scanning', 13, `
\`npm audit\` on the server prints 47 vulnerabilities, 12 high and 2 critical. Two hours later you have upgraded nothing, because 41 of them live under a build tool that never runs in production, and one critical is a prototype pollution bug in a package no code path reaches. That ratio is why most teams run the scanner and read none of it.

Presence is not reachability, and the gate has to reflect that or it gets bypassed.

### Scan the lockfile, because the lockfile is the real dependency list

\`package.json\` lists what you asked for. \`package-lock.json\` lists what you got, including the 340 packages you never chose.

\`\`\`bash
npm ls minimist                          # who actually pulls it in
npm audit --omit=dev --audit-level=high  # runtime only, real severities
npm ci                                   # install exactly the lockfile, never resolve fresh
\`\`\`

| Tool | Catches | Where it runs |
|---|---|---|
| \`npm audit --omit=dev\` | Known advisories in runtime packages | every pull request |
| gitleaks | Keys and tokens in the diff and in history | pre-commit and CI |
| \`npm ci\` | Drift between lockfile and installed tree | every CI job |
| CycloneDX SBOM | The exact tree that shipped, per release | the release job |
| Provenance checks | New install scripts, new network use | pull request |

### The dangerous moment is install, not run

A hostile package does not need you to import it. A \`postinstall\` script runs the moment \`npm install\` does, on your laptop and on the CI runner that holds the deploy credentials.

\`\`\`bash
npm ci --ignore-scripts
\`\`\`

Then make new install scripts visible as a test failure, where the team already looks:

\`\`\`js
import lock from '../package-lock.json' with { type: 'json' };

const allowed = new Set(['bcryptjs']);   // legitimate native build

it('no dependency gains an install script without review', () => {
  const offenders = Object.entries(lock.packages)
    .filter(([name, meta]) => meta.hasInstallScript)
    .map(([name]) => name.replace('node_modules/', ''))
    .filter(name => !allowed.has(name));

  expect(offenders).toEqual([]);
});
\`\`\`

### Rotate first, scrub second

A \`SENDGRID_API_KEY\` committed on Tuesday and removed on Wednesday is still in the reflog, in every clone, in every fork, and in the platform's public events feed. Amending the commit does not un-leak it.

Teams reliably do this backwards: a day spent on \`git filter-repo\` while the live key keeps working. Rotate the credential first. History cleanup is tidying, not remediation.

\`\`\`bash
gitleaks detect --source . --log-opts="--all"   # the whole history, not just HEAD
gitleaks protect --staged                       # pre-commit, blocks the paste
\`\`\`

Entropy based scanners miss low entropy secrets, and a signing key of \`secret\` has no entropy at all. Cover that with an assertion instead:

\`\`\`js
it('refuses to boot with a default JWT secret', () => {
  process.env.JWT_SECRET = 'secret';
  expect(() => loadConfig()).toThrow(/JWT_SECRET/);
});
\`\`\`

### A gate people can live with

A check that fails on all 47 findings gets \` || true\` appended within a week, and then the two criticals are ignored along with everything else. Gate on high and critical in runtime dependencies. Allow suppressions, but require an expiry:

\`\`\`json
{
  "GHSA-9c47-m6qq-7p4h": { "until": "2026-10-01", "why": "dev only, tracked in QA-812" }
}
\`\`\`

When the date passes, the build fails again and somebody looks. An accepted risk with no expiry is a permanent one.

### The attack that needs no vulnerability

If the private scope \`@cortexis/ui\` is not reserved on the public registry, anyone can publish \`@cortexis/ui@99.0.0\` there, and a resolver configured to fall back to the public registry will happily prefer the higher version. Pin the scope in \`.npmrc\`:

\`\`\`ini
@cortexis:registry=https://npm.internal.cortexis.dev/
//npm.internal.cortexis.dev/:_authToken=\${NPM_TOKEN}
\`\`\`

No code of yours was flawed. The install still shipped someone else's.
      `,
        [
          q('Why does auditing only the packages your own code imports miss real risk?', [
            'npm audit cannot read a lockfile that contains transitive entries',
            'A postinstall script runs at install time whether the package is imported or not',
            'Only imported packages are ever recorded inside package-lock.json',
            'Advisories are published per direct dependency and never per transitive one',
          ], 1, 'Install lifecycle scripts execute on any machine that runs the install, including the CI runner holding deploy credentials, so a package nothing imports can still run code.'),
          q('You find a live Sendgrid key in a commit pushed three weeks ago. What comes first?', [
            'Rewrite the history with git filter-repo and force push the branch',
            'Amend the commit so the key no longer appears in the diff',
            'Add the file to .gitignore and delete it from the working tree',
            'Rotate the key, since the old value is already public',
          ], 3, 'The value has been in clones, forks and the platform event feed for three weeks, so history rewriting changes nothing until the credential itself is dead.'),
          q('Why should an accepted audit suppression carry an expiry date?', [
            'npm audit refuses to parse a suppression entry without a date field',
            'Advisory severity scores are recalculated on a fixed quarterly cycle',
            'Without one the accepted risk becomes permanent and is never revisited',
            'The expiry is what tells npm ci to reinstall the dependency tree',
          ], 2, 'A suppression with a date fails the build again once it lapses, forcing a fresh decision instead of leaving a temporary exception in place for years.'),
        ]
      ),
      lesson('Turning a Pen Test Finding into a Regression Test', 13, `
The pen test report landed with nine findings. The team fixed all nine inside a week, the retest came back clean, everyone moved on. Fourteen months later the same consultancy reported finding 4 again: \`GET /api/learn/progress/:id\` returns another learner's progress. A refactor had moved the ownership check into a middleware that nobody mounted on that router, and no test noticed, because the fix had been a code change and nothing else.

A finding is not closed until a test fails without the fix in place.

### Reproduce at the cheapest layer that still proves it

An E2E reproduction of every finding is slow and flaky. Pick the lowest layer that would genuinely have caught it.

| Finding | Layer that proves it | Assertion |
|---|---|---|
| IDOR on the progress route | supertest against the app | 403 for a foreign enrolment id |
| Stored XSS in a review body | unit test on the renderer, plus one E2E | no executable markup, no dialog |
| Login has no rate limit | supertest loop | the 21st attempt returns 429 |
| JWT accepted with \`alg: none\` | unit test on the verify helper | it throws |

### Write the failing test first, and name it after the finding

\`\`\`js
// PEN-2026-04  Insecure direct object reference, severity high
it('PEN-2026-04 refuses a progress record owned by another learner', async () => {
  const sara = await seedLearnerWithProgress('data-science-python');
  const ali = await seedLearner();

  const res = await request(app)
    .get(\`/api/learn/progress/\${sara.enrolmentId}\`)
    .set('Authorization', \`Bearer \${ali.token}\`);

  expect(res.status).toBe(403);
  expect(res.text).not.toContain('data-science-python');
});
\`\`\`

Run it before the fix and watch it fail. A security test that has never been red is a test you have no reason to believe. The finding id in the name also makes the retest a single command: \`npx jest -t PEN-2026\` runs the entire report.

### Assert the invariant, not the exploit string

Here is the version most teams write for a stored XSS finding:

\`\`\`js
it('escapes script tags in a review', () => {
  expect(renderReview('<script>alert(1)</script>')).not.toContain('<script>');
});
\`\`\`

Green, and the product is still vulnerable. The consultant sent one payload from a class of thousands, and \`<img src=x onerror=alert(1)>\` sails past that assertion. Test the property the sanitiser is supposed to guarantee, and keep the report's payload as one case among many:

\`\`\`js
const payloads = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<a href="javascript:alert(1)">click</a>',
  '<svg/onload=alert(1)>',
];

it.each(payloads)('renders %s with no executable markup', (raw) => {
  expect(renderReview(raw)).not.toMatch(/on\\w+\\s*=|javascript:|<script/i);
});
\`\`\`

Then one end to end test, because the browser is the only authority on what executes:

\`\`\`js
test('a hostile review never runs script in the page', async ({ page }) => {
  let fired = false;
  page.on('dialog', () => { fired = true; });
  await page.goto('/learn/data-science-python/reviews');
  await page.getByRole('heading', { name: /learner reviews/i }).waitFor();
  expect(fired).toBe(false);
});
\`\`\`

### Fix the class, not the instance

One IDOR means the ownership pattern is missing, not that one route is. Feed the route back into the sweep that iterates every route with an id parameter, so the next handler someone writes is covered before it exists.

### Handle the report itself carefully

Reports contain working exploits, and often a captured session token and a real learner's email. Do not paste them into a public issue and do not commit a captured response as a fixture. Rebuild the request with synthetic data that keeps the shape: a seeded learner, a freshly signed token, the same path and body.

Log the date each check entered CI. When the next report arrives, the diff between the two is the honest measure of whether the last one changed anything.
      `,
        [
          q('Finding 4 was fixed, retested clean, then reappeared fourteen months later. What would have prevented that?', [
            'A test that fails without the ownership check, kept in the suite',
            'A second pen test booked for six months after the first one',
            'A code comment above the handler naming the original finding id',
            'Moving the ownership check into shared middleware for all routers',
          ], 0, 'Only an executable check notices when a later refactor removes the mitigation, which is exactly what happened when the middleware stopped being mounted.'),
          q('A test asserts the rendered review html contains no script tag. Why is that not enough?', [
            'The assertion runs before the sanitiser has finished writing output',
            'Other vectors such as an onerror attribute execute and still pass it',
            'Escaped angle brackets are stored in a different form inside Mongo',
            'Playwright cannot observe a dialog raised from an inline script',
          ], 1, 'The consultant sent one payload from a large class, so asserting on that one string leaves every other injection vector green and unprotected.'),
          q('The report includes a captured response holding a live session token and a real learner email. How should it enter the suite?', [
            'Commit it as a fixture so the reproduction stays byte exact',
            'Store it in CI secrets and load the capture during the run',
            'Rebuild the request with synthetic data that keeps the same shape',
            'Cite the report id and skip writing a test for that finding',
          ], 2, 'The behaviour under test is the missing check, not the specific token or address, so a seeded learner and a freshly signed token reproduce it without committing real credentials.'),
        ]
      ),
      ],
      [
      q('Which finding should trigger a sweep across many tests rather than a single targeted fix?', [
        'An advisory affecting a build tool that only runs in development',
        'A fuzz counterexample returning 400 where 422 was expected',
        'A missing rate limit on the public contact form endpoint',
        'An insecure direct object reference on one route taking an id',
      ], 3, 'One missing ownership check means the pattern is absent rather than one route being wrong, so every route accepting a resource id needs the same assertion.'),
      q('A nightly fuzz property finds a 500 and shrinks the input to an answers array of one null. What is the durable outcome?', [
        'Raise numRuns so the property rediscovers it faster next time',
        'Mark the property skipped until the handler has been rewritten',
        'Add a named regression test for that input, then fix the handler',
        'Record the seed in the CI log and rerun the job to confirm',
      ], 2, 'Random search may not produce that input again for weeks, so the counterexample has to become a deterministic test before the fix is worth anything.'),
      q('Why does a security gate that fails on every single advisory end up making the product less safe?', [
        'It gets bypassed, so genuinely high severity findings are ignored too',
        'Scanners throttle projects whose pipelines fail repeatedly over time',
        'Advisory databases drop entries that get suppressed too frequently',
        'npm audit lowers a severity score after repeated failing runs',
      ], 0, 'A permanently red check trains the team to skip it, and once the gate is routinely bypassed the two findings that mattered travel through with the forty that did not.'),
      q('What distinguishes attacker minded testing from the functional suite built in earlier chapters?', [
        'It runs against production instead of a disposable environment',
        'It replaces unit and integration tests with scanners and fuzzers',
        'It asserts only on status codes and never on response bodies',
        'It asserts what must never happen, not what should happen',
      ], 3, 'Functional tests confirm the happy path and the known rules, whereas security tests pin down negative invariants such as no cross tenant read, no 5xx, and no executable markup.'),
      ]
    ),
    chapter(
      'Verifying a Live System',
      'Proving a release is safe using real traffic, gradual exposure, and failures you cause on purpose.',
      [
      lesson('Testing Both Sides of Every Flag', 13, `
Your suite is green. Now ask which side of the flag it ran on. It ran on whatever \`FLAGS.newPricing.percent\` happens to be in the test environment, which is almost always \`0\`. The branch currently serving 40 percent of paying customers has never been executed by a single assertion.

Chapter 5 used flags to split deploying from releasing. That split only pays off if both paths are actually verified, and a flag doubles the code under test rather than replacing it.

### Make the flag an input, not a global

Broken, because the test silently reads whatever the module ships with:

\`\`\`js
// checkout.test.js
import { createOrder } from '../src/checkout';

it('applies the discount', async () => {
  const order = await createOrder(cart, user);   // which pricing engine ran? nobody knows
  expect(order.total).toBe(4200);
});
\`\`\`

Inject the flag state and run the invariant expectations against both sides:

\`\`\`js
import { describe, it, expect } from 'vitest';
import { createOrder } from '../src/checkout';

describe.each([
  ['legacy pricing', { newPricing: false }],
  ['new pricing', { newPricing: true }],
])('%s', (_label, flags) => {
  it('charges 42.00 for a two item cart with AUTUMN10 applied', async () => {
    const order = await createOrder(cart, user, { flags });
    expect(order.total).toBe(4200);
  });

  it('rejects an expired promotion code', async () => {
    await expect(createOrder(expiredCart, user, { flags })).rejects.toThrow('code_expired');
  });
});
\`\`\`

Two engines now have to agree on everything that is not supposed to change. Where behaviour is deliberately different, write one test per side and put the difference in the test name, so a reviewer can see which rules the rollout is allowed to move.

The browser suite needs the same control, per test rather than per environment:

\`\`\`js
test('the new checkout shows VAT before the pay button', async ({ page, context }) => {
  await context.addCookies([
    { name: 'ff_override', value: 'newPricing=on', domain: 'app.cortexis.dev', path: '/' },
  ]);
  await page.goto('/checkout');
  await expect(page.getByText('Includes VAT')).toBeVisible();
});
\`\`\`

### You cannot test every combination, so pick

| Live flags | Configurations | What the suite covers |
|---|---|---|
| 4 | 16 | Both sides of each flag, 8 runs |
| 8 | 256 | Both sides each, plus pairs that touch the same data |
| 12 | 4,096 | Both sides each, plus a nightly job on the production config |

Full coverage stops being possible around four flags. Cover each flag on its own, then add explicit tests only for pairs that touch the same state: \`newPricing\` with \`bundleDiscounts\` genuinely interact, \`newPricing\` with \`darkModeNav\` do not.

### The flag client is a dependency, and it fails

\`\`\`js
// One slow call to the flag service and checkout returns 500
const on = await flagClient.get('newPricing', user);

// Bounded, with a defined answer when the service is unreachable
const on = await withTimeout(flagClient.get('newPricing', user), 50).catch(() => false);
\`\`\`

Write the test that kills the flag service and asserts the page still renders on the default path. Teams discover this during an incident far more often than during a rollout.

Bucketing needs a test too. \`bucketOf(user.id, flag)\` must return the same number every call, or a customer flips between the old and new checkout on page reload and loses their cart:

\`\`\`js
it('keeps a user in the same bucket across calls', () => {
  const first = bucketOf('user_8842', 'newPricing');
  expect(bucketOf('user_8842', 'newPricing')).toBe(first);
  expect(bucketOf('user_8842', 'bundleDiscounts')).not.toBe(first);  // per flag, not per user
});
\`\`\`

### Deleting the flag is a change, so test it like one

At 100 percent, removal is the last step of the rollout, not paperwork. Delete the flag, delete the dead branch, delete the \`describe.each\` entry that pinned it, and let the remaining tests prove nothing moved. A CI job that fails any flag older than 60 days keeps that from slipping, because the real cost of a stale flag is a code path nobody has run in months and nobody dares delete.
      `,
        [
          q('A checkout suite passes on every run, but the pricing flag sits at 0 percent in the test environment and 40 percent in production. What has the suite actually verified?', [
            'Both branches, since the flag only changes which module gets imported',
            'Only the legacy branch, leaving the code serving 40 percent of users untested',
            'Only the new branch, because test builds always resolve flags to their newest value',
            'Neither branch, as a flag at 0 percent short circuits before either path runs',
          ], 1, 'Tests read whatever default the flag module ships with, so the branch that real customers are on has never had a single assertion run against it.'),
          q('Twelve flags are live. Why is testing both sides of each flag separately, plus a few chosen pairs, the right call?', [
            'Pairs are cheaper to run than single flag tests, so they replace them entirely',
            'Flag frameworks evaluate combinations internally, so single sided tests cover pairs',
            'Twelve flags produce 24 configurations, which a nightly run can cover completely',
            'Twelve flags give 4,096 configurations, so cover each alone and only pairs that share state',
          ], 3, 'Full combinatorial coverage becomes impossible almost immediately, so you cover every flag on its own and add pair tests only where two flags touch the same state.'),
          q('The flag service becomes unreachable during a deploy. Which behaviour should a test already have pinned down?', [
            'The lookup times out quickly and falls back to a defined default, so the page renders',
            'The request blocks until the flag service returns, keeping every user on one path',
            'The app refuses new requests until flag state can be read, avoiding mixed behaviour',
            'Each user is randomly assigned a branch so traffic stays split as configured',
          ], 0, 'An unbounded flag lookup turns a slow flag service into a 500 on every page, so the timeout and the default answer both need a test that kills the service.'),
        ]
      ),
      lesson('Shadow Traffic and Response Diffing', 13, `
The pricing rewrite had 4,000 unit tests and a full contract suite. It went to 5 percent of traffic and was wrong for roughly three carts in a thousand: gift cards combined with a partial refund, a shape nobody on the team had imagined and no fixture contained. Real traffic contains inputs your test data never will.

Shadow traffic gets you those inputs without risking a customer. Every real request runs through both implementations, the old answer is what ships, and the two results are compared offline.

### The experiment, in process

\`\`\`js
// server/src/lib/experiment.js
export async function experiment(name, { control, candidate, sample = 0.05 }) {
  const result = await control();                 // the customer only ever sees this
  if (Math.random() < sample) {
    setImmediate(async () => {                    // after the response is sent
      try {
        const trial = await withTimeout(candidate(), 200);
        record(name, diff(normalise(result), normalise(trial)));
      } catch (err) {
        record(name, { error: err.message });      // a candidate crash is data, not an outage
      }
    });
  }
  return result;
}
\`\`\`

Three rules are load bearing. The control result returns before the candidate runs, so shadowing never lands in your p95. The candidate is wrapped in a timeout, because the new code is the one likely to hang. Every candidate error is swallowed and counted, because the entire point is that the candidate is not trusted yet.

### Side effects will bite you

The candidate must not do anything the control already did:

\`\`\`js
// This sends two confirmation emails and creates two Stripe charges
experiment('pricing-v2', {
  control: () => chargeAndEmail(cart, legacyTotal(cart)),
  candidate: () => chargeAndEmail(cart, newTotal(cart)),
});

// Compare the calculation, not the transaction
experiment('pricing-v2', {
  control: () => legacyTotal(cart),
  candidate: () => newTotal(cart),
});
\`\`\`

Shadow the pure part. When the candidate genuinely needs to write, point it at a shadow database and a fake payment client, and make that wiring impossible to get wrong: a candidate that can reach the live Stripe key is a bug waiting for a busy Friday.

### Normalise or drown in noise

The first diff report is always 100 percent different, and the cause is never the logic:

\`\`\`js
const normalise = (r) => ({
  ...r,
  requestId: undefined,
  generatedAt: undefined,
  lines: [...r.lines].sort((a, b) => a.sku.localeCompare(b.sku)),
  total: Math.round(r.total * 100) / 100,        // 41.999999999999996 is not a defect
});
\`\`\`

Timestamps, request ids, map iteration order and float representation account for most raw diffs. Strip them deliberately, one field at a time, and write down why each one is safe to ignore.

### Reading the report

At 1.2 million requests a day, a 5 percent sample gives 60,000 comparisons. A useful week looks like this:

| Diff | Count | Cause |
|---|---|---|
| \`total\` off by 1 cent | 3,214 | rounding applied per line rather than per order |
| \`discount\` null vs 0 | 902 | new engine omits the key when no code applies |
| candidate threw | 41 | gift card plus partial refund, unhandled |
| \`tax\` differs by 20 percent | 6 | customer in a region added last month |

The last row is the one worth the whole exercise: six requests, a genuine bug, and nothing in staging would ever have produced them. The 902 null diffs are a schema decision, not a defect, which is why a diff report needs a person reading it rather than a pass or fail gate.

### Where to mirror

In process, as above, is the cheapest way to start and the only option when the two implementations share a database session. At the edge, a proxy can mirror requests to a second deployment without touching application code:

\`\`\`yaml
route:
  cluster: pricing-v1
  request_mirror_policies:
    - cluster: pricing-v2
      runtime_fraction: { default_value: { numerator: 5, denominator: HUNDRED } }
\`\`\`

Envoy discards the mirrored response entirely, so the candidate can be slow or return garbage without affecting the customer. Budget for the load: mirroring doubles read pressure on every downstream dependency the candidate touches, and a shadow that takes the database down is a self inflicted outage.
      `,
        [
          q('Why does the shadow experiment call the candidate only after the control response has been sent?', [
            'Because the candidate needs the control result as an input to its own calculation',
            'Because a proxy cannot mirror a request until the original response has completed',
            'So a slow or hanging candidate cannot add latency to what the customer waits for',
            'So the sampling decision can be made using the status code the control returned',
          ], 2, 'The untrusted new code is the one most likely to hang, and running it off the response path keeps shadowing out of your latency numbers entirely.'),
          q('Your first diff report says 100 percent of shadowed responses differ. What is the most likely cause?', [
            'Fields like request ids and timestamps differ every call and were never stripped',
            'The candidate is deployed from a stale build that predates the pricing change',
            'The sample rate is too low for the comparison to reach statistical significance',
            'The proxy is mirroring requests to the control cluster rather than the candidate',
          ], 0, 'Raw responses carry per request noise such as ids, timestamps, map ordering and float representation, so every comparison differs until you normalise those fields away.'),
          q('A shadow experiment wraps chargeAndEmail on both the control and the candidate side. What happens in production?', [
            'The candidate result is discarded, so only the control charge reaches the customer',
            'Both calls hit the same idempotency key, so the second is silently deduplicated',
            'The mirrored call runs against a shadow database and cannot reach the payment API',
            'Every sampled customer is charged twice and receives two confirmation emails',
          ], 3, 'Shadowing runs the candidate for real, so any side effect it performs happens for real too, which is why you shadow the calculation rather than the transaction.'),
        ]
      ),
      lesson('Automated Canary Analysis', 13, `
"The canary looked fine" is not a measurement. It usually means someone watched a dashboard for four minutes and saw nothing red. Chapter 5 gave you fixed rollback thresholds, which are the right blunt instrument for an obvious failure. They miss the quiet ones: a release where the error rate goes from 0.08 percent to 0.31 percent, four times worse and still far under any threshold a human would set.

Automated canary analysis replaces the eyeball with a comparison, and the comparison is the whole trick.

### Compare against a baseline you deploy at the same time

Most teams compare the canary to the existing production fleet. That comparison is contaminated. Production instances have warm JIT, warm caches and open connection pools; your canary started 90 seconds ago. Yesterday at the same hour had a different traffic mix.

Deploy three groups at once:

| Group | Build | Instances | Purpose |
|---|---|---|---|
| baseline | current release | 2 | fresh instances, known good code |
| canary | new release | 2 | fresh instances, new code |
| production | current release | 40 | serves everyone else |

Baseline and canary are born together and take equal traffic, so cold start, cache state and time of day cancel out. Any remaining difference is the code. Comparing canary against the 40 warm instances instead makes every release look like a latency regression.

### Score the metrics, do not eyeball them

\`\`\`js
// canary/score.js
import { mannWhitneyU } from './stats.js';

const METRICS = [
  { name: 'http_5xx_ratio', weight: 40, direction: 'lower' },
  { name: 'latency_p95_ms', weight: 30, direction: 'lower' },
  { name: 'checkout_success_ratio', weight: 30, direction: 'higher' },
];

export function score(baseline, canary) {
  let earned = 0;
  for (const m of METRICS) {
    const p = mannWhitneyU(baseline[m.name], canary[m.name], m.direction);
    if (p > 0.05) earned += m.weight;              // no significant regression
    else console.log(\`\${m.name} regressed, p=\${p.toFixed(4)}\`);
  }
  return earned;                                   // promote at 100, roll back under 75
}
\`\`\`

Two details matter more than the statistics. Compare distributions rather than averages, because a mean hides the 1 percent of requests that now take nine seconds. And weight business metrics as heavily as technical ones: a release with perfect latency and a checkout success rate down four points is a bad release.

### The sample size trap

This is where most canaries lie to you. A 1 percent canary on 1,200 requests per minute sees 12 requests a minute. Ten minutes gives 120 requests.

| Canary traffic | Requests in 10 min | Smallest error rate change it can detect |
|---|---|---|
| 1 percent | 120 | about 5 percent, so anything smaller is invisible |
| 10 percent | 1,200 | about 1.5 percent |
| 25 percent | 3,000 | about 0.9 percent |

A green score from 120 requests means "we did not look hard enough", not "it is safe". Either raise the canary share, or run it longer, and never let the report print a verdict without the sample count next to it.

The same arithmetic kills coverage of rare paths. A 1 percent canary sees roughly none of the flow used by 0.5 percent of customers. Route by cohort when that flow matters: send every internal account and every user in one region to the canary, so the endpoints you are worried about get real hits.

### Failure modes worth knowing

Instance level noise fools naive comparisons. One canary pod scheduled onto a busy node shifts p95 for the whole group, so compare per instance and require a majority to agree before calling a regression.

Unequal traffic breaks any raw counter. Ninety errors on the canary and 100 on baseline sounds better until you notice the canary took a tenth of the requests. Normalise everything per request, never per group.

And the canary can pass on metrics that were already broken. If \`checkout_success_ratio\` reads zero on both sides because the exporter has been dead for a week, the comparison finds no difference and promotes happily. Assert that each metric has data and sits in a sane range before you compare it, or the analysis quietly becomes a rubber stamp.
      `,
        [
          q('Why deploy a fresh baseline group instead of comparing the canary to the existing production fleet?', [
            'The production fleet runs an older build, so the comparison is not code to code',
            'A baseline group takes traffic the canary cannot, which widens metric coverage',
            'Production instances are monitored less often, so their metric samples are sparser',
            'Warm caches and warm JIT on old instances make new code look slower than it is',
          ], 3, 'A baseline born at the same moment as the canary cancels out cold start, cache state and time of day, leaving the code as the only remaining difference.'),
          q('A 1 percent canary on 1,200 requests per minute scores 100 after ten minutes. Why is that weak evidence?', [
            'Ten minutes is shorter than the time a rollback needs, so the score arrives late',
            'About 120 requests cannot detect an error rate change smaller than a few percent',
            'Scores computed on small samples always round upward to the nearest weight total',
            'One percent of traffic never includes signed in users, so business metrics are blank',
          ], 1, 'With so few samples the comparison has almost no power, so a passing score means you did not look hard enough rather than that the release is safe.'),
          q('The checkout metric exporter has been dead for a week, so both groups report zero. What does the analysis do?', [
            'It fails the metric outright, since a zero value cannot beat the baseline value',
            'It flags the missing series and holds the rollout until a human confirms the data',
            'It finds no difference between the groups and promotes the release happily',
            'It reweights the remaining metrics so the missing one stops affecting the score',
          ], 2, 'A comparison of two identical dead signals shows no regression, which is why each metric needs a presence and sanity check before it is allowed to score.'),
        ]
      ),
      lesson('Fault Injection and Chaos Experiments', 13, `
The recommendations service got slow, not broken: 40 ms to 900 ms. Every caller had a retry policy of three attempts. Traffic to that service tripled at exactly the moment it could least afford it, the pool filled, the homepage started timing out, and a partial degradation became a full outage in about four minutes. The retries did that. Not one test caught it, because every test in the suite ran against a dependency that was fast and healthy.

Fault injection is how you meet that failure on a Tuesday morning instead of at 2am.

### An experiment, not a prank

Randomly killing servers is theatre. A real experiment has four parts written down before anything is broken:

| Part | Recommendations outage example |
|---|---|
| Steady state | homepage p95 under 400 ms, 5xx under 0.1 percent |
| Hypothesis | if recommendations adds 2 s of latency, the homepage still renders without them |
| Variable | 2,000 ms latency on the recommendations client, one instance |
| Abort | homepage 5xx above 1 percent, or any manual call to stop |

If you cannot state the steady state as a number you already measure, you are not ready to inject anything, because you will have no way to tell whether the result was bad.

### Inject the fault in an integration test

Toxiproxy sits between your app and a real dependency and degrades the connection on command, which makes this a test you can run in CI rather than a ceremony:

\`\`\`js
import { Toxiproxy } from 'toxiproxy-node-client';

const proxy = await new Toxiproxy('http://localhost:8474')
  .createProxy({ name: 'recs', listen: '0.0.0.0:26379', upstream: 'recs:6379' });

it('renders the homepage without recommendations when recs is slow', async () => {
  await proxy.addToxic({ type: 'latency', attributes: { latency: 2000 } });

  const start = Date.now();
  const res = await request(app).get('/');

  expect(res.status).toBe(200);
  expect(res.text).toContain('Continue learning');       // the page still works
  expect(res.text).not.toContain('Recommended for you'); // the section degraded away
  expect(Date.now() - start).toBeLessThan(600);          // and it did not wait 2 seconds
});
\`\`\`

That last assertion is the one that fails first on most codebases.

### The defaults that cause the outage

\`\`\`js
// axios: timeout defaults to 0, which means wait forever
const recs = await axios.get('http://recs/for/' + userId);

// bounded, with a budget and jitter so retries cannot pile up
const recs = await axios.get('http://recs/for/' + userId, {
  timeout: 250,
  'axios-retry': { retries: 1, retryDelay: (n) => 100 * 2 ** n + Math.random() * 100 },
}).catch(() => null);                                    // null renders the page without the panel
\`\`\`

Three attempts with no jitter is not resilience, it is a synchronised load multiplier aimed at something already struggling. One retry, exponential backoff with full jitter, and a circuit breaker that stops calling after a run of failures. A retry budget capped at 10 percent of requests is the version that survives contact with a real incident.

### What each fault should reveal

| Injected | Should reveal |
|---|---|
| Latency on a dependency | missing timeout, or a timeout longer than the caller's |
| 100 percent errors | no fallback, no circuit breaker, a 500 shown to the user |
| Kill one instance | in flight requests dropped, sticky session data lost |
| Fill the disk | logging that crashes the process when it cannot write |
| Clock skew of 5 minutes | token validation and idempotency windows that reject valid work |

### Blast radius, then production

Start in staging with synthetic load, then one production instance during business hours with the whole team watching and an abort switch someone has actually pressed before. Announce it. A chaos experiment that surprises the on call engineer produces a real incident response, wasted hours and a team that will never let you run another one.

The output of every experiment is a test. Recommendations timeout missing becomes a permanent integration test with the latency toxic in it, so the fix cannot quietly regress next quarter.
      `,
        [
          q('Recommendations slows from 40 ms to 900 ms and the whole homepage goes down. What turned slowness into an outage?', [
            'Three retries per caller tripled load on a dependency already struggling to keep up',
            'The slow responses filled the log volume, which crashed each process in turn',
            'The circuit breaker opened too early and cut off traffic the service could still serve',
            'Clock skew between instances invalidated the cached recommendations for every user',
          ], 0, 'Unjittered retries fire hardest exactly when a dependency is weakest, multiplying load on it and converting a partial degradation into a full failure.'),
          q('Which part of a chaos experiment tells you whether the run succeeded or failed?', [
            'The variable, because it defines exactly which fault is injected and where',
            'The blast radius, because it bounds how many customers the run can affect',
            'The steady state, because it is a measured number the hypothesis is checked against',
            'The abort condition, because it names the point at which the run must be stopped',
          ], 2, 'The steady state is the numeric definition of healthy, so without it you have no way to judge whether the injected fault changed anything that matters.'),
          q('An axios call to a slow dependency has no timeout option set. What is the default behaviour?', [
            'It aborts after 30 seconds, the Node default socket timeout for outbound requests',
            'It waits indefinitely, so requests pile up until the connection pool is exhausted',
            'It retries once immediately, then throws a network error back to the caller',
            'It fails fast with ECONNABORTED as soon as the response exceeds one second',
          ], 1, 'A timeout of 0 means no timeout at all, so one hung dependency holds every caller open and starves the pool that healthy requests need.'),
        ]
      ),
      ],
      [
      q('Which technique gives you real production inputs with no chance of a customer seeing the new code\'s answer?', [
        'A canary group taking 1 percent of live traffic on the new build',
        'A feature flag enabled for internal accounts on the production deploy',
        'A chaos experiment run against one instance during business hours',
        'Shadow traffic where the candidate runs but the control response is returned',
      ], 3, 'Shadowing feeds real requests through the new implementation while the customer always receives the trusted control result, so the candidate cannot affect anyone.'),
      q('Why does a fixed rollback threshold of 1 percent errors miss a release that quadruples the error rate?', [
        'Going from 0.08 to 0.31 percent is four times worse and still far under the limit',
        'Fixed thresholds are evaluated only after the rollout reaches full traffic',
        'Error rates are sampled per instance, so a fleet wide threshold never triggers',
        'Thresholds ignore latency, which is where a quadrupled error rate first appears',
      ], 0, 'Absolute thresholds only catch obvious failures, whereas a comparison against a matched baseline notices a large relative regression that stays below the line.'),
      q('Which finding from a live verification technique belongs in the automated suite afterwards?', [
        'The exact percentage at which the canary was promoted to full traffic',
        'The list of request ids that were normalised out of the diff report',
        'The missing timeout that a latency injection exposed on the recs client',
        'The score the canary analysis produced on the day of the release',
      ], 2, 'A defect found by injecting a fault becomes a permanent integration test with that fault in it, so the fix cannot quietly regress in a later release.'),
      q('Both a flag rollout and a canary expose a percentage of traffic. What is the key difference in what they give you?', [
        'A flag compares two builds, a canary compares two configurations of one build',
        'A flag exposes a code path, a canary compares metrics between two deployed builds',
        'A flag measures latency distributions, a canary measures only error counts',
        'A flag applies to internal users, a canary applies only to anonymous traffic',
      ], 1, 'A flag controls which branch of one deployed build a user reaches, while a canary is a deployment comparison that scores one build against a matched baseline.'),
      ]
    ),
    chapter(
      'Owning Quality',
      'Deciding what deserves testing at all, bringing an inherited system under cover, moving a suite without losing it, and owning the call on whether a release ships.',
      [
      lesson('Risk-Based Strategy When You Cannot Test Everything', 13, `
Six days of test time before the release. Forty one merged pull requests. A test plan spreadsheet with 1,900 rows in it. That is a real position to be in, and the worst possible response is to start at row one and work down until the clock runs out, because everything you fail to reach was then chosen for you by alphabetical order rather than by consequence.

Rank first. Spend second.

### Risk is probability times cost, and cost has three parts

Probability of failure you can estimate from evidence you already hold: how much the code changed, how many people touched it, how many defects it has produced before. Cost is where teams get lazy, because it is really three separate questions.

- **Blast radius.** How many users pass through this path in a day?
- **Severity.** Money, data loss, credentials, or a misaligned icon?
- **Reversibility.** Can you fix forward in ten minutes, or has it already written wrong rows into a ledger?

Reversibility is the one that gets left out, and it reorders a plan more than anything else. A checkout page that renders badly for an hour is embarrassing. A settlement job that writes 40,000 incorrect payout rows is a week of manual repair plus a regulator asking questions. Both get labelled high severity. Their true costs differ by two orders of magnitude.

### Pull the numbers instead of guessing

Git already stores the change history, so the probability half of the equation is a one liner:

\`\`\`bash
git log --since="90 days ago" --numstat --format="" -- src \\
  | awk 'NF==3 { churn[$3] += $1 + $2 } END { for (f in churn) print churn[f], f }' \\
  | sort -rn | head -8
\`\`\`

\`\`\`
2841 src/billing/settlement.js
1902 src/checkout/tax.js
 883 src/auth/session.js
 219 src/admin/exportCsv.js
\`\`\`

Churn is not risk on its own. It is a proxy for how many chances the team has had recently to get something wrong. Cross it with blast radius and reversibility and the ranking almost writes itself.

### Score it, publish it, and name what you are skipping

| Area | Churn | Users/day | Reversible | Depth this release |
|---|---|---|---|---|
| Settlement payouts | High | 400 | No | Full regression plus property tests |
| Tax calculation | High | 90,000 | Yes | Full regression |
| Session and auth | Medium | 120,000 | Yes | Smoke plus the authorisation matrix |
| Admin CSV export | Low | 6 | Yes | Not tested, accepted |

The last row is the one that matters. Every plan silently skips things; a plan that says so out loud converts an oversight into a decision with a name on it. When the CSV export breaks in production, the conversation is "we accepted that risk for six users" rather than "how did QA miss this", and the accepted risk list is reviewed next release with real evidence behind it.

Notice that tax calculation serves 90,000 users a day but sits below settlement, which serves 400. Reversibility did that. A wrong tax line is caught, refunded, and recalculated. A wrong payout has already left the building.

### The trap: nobody found bugs there because nobody looked

Defect history is a useful input and a treacherous one. An area with zero recorded defects reads as stable, and often it is simply unexamined. Legacy modules that no automated test touches and no manual tester enjoys score beautifully on defect density right up to the incident.

Correct for it deliberately. Any area with meaningful churn and near zero recorded defects goes on the list for an exploratory session, not because you expect a specific bug, but because your evidence about it is missing rather than good.

### Re-rank every release

A risk ranking is not a document, it is a decision that expires. The feature that dominated last month is now stable and covered; the thing three engineers rewrote last week is not. Spend twenty minutes on the ranking at the start of each cycle and it stays honest. Skip that and within two releases you are testing last quarter's fears with this quarter's budget.
      `,
        [
          q('Your risk table ranks settlement payouts, used by 400 people a day, above tax calculation, used by 90,000. Which factor justifies that order?', [
            'Settlement has more defects logged against it already',
            'Tax errors are cheap because refunds run automatically',
            'A wrong payout has left the building and cannot be undone',
            'Settlement changed more than tax in the last ninety days',
          ], 2, 'Reversibility separates them: a mistaken tax line gets recalculated and refunded, while money that has already been sent has to be chased and recovered by hand, so the same severity label hides a far larger cost.'),
          q('A module has high churn and almost no recorded defects. Why does a risk based plan treat that as a reason to look harder rather than to relax?', [
            'Zero recorded defects can mean nobody has examined it yet',
            'High churn always predicts defects within the next release',
            'Defect density is only valid for modules under full cover',
            'Recent commits reset the defect history the tracker holds',
          ], 0, 'Defect history measures where people have looked as much as where bugs are, so an area no automated test touches and no tester enjoys can score perfectly on defect density right up until the incident.'),
          q('What does writing the line \'admin CSV export: not tested, accepted\' into the test plan actually buy you?', [
            'It excludes that area from the coverage report thresholds',
            'It moves the export into the next release\'s regression set',
            'It marks the export as low churn for future risk rankings',
            'It turns a silent gap into a decision somebody signed off',
          ], 3, 'Every plan skips something, and naming the skip converts an oversight into an accepted risk with an owner, which can be reviewed next release instead of surfacing as a surprise during an incident.'),
        ]
      ),
      lesson('Characterization Tests for Code Nobody Understands', 13, `
\`settlement.js\` is 1,430 lines long, has no tests, and was last understood by an engineer who left in 2021. Finance runs payouts through it every Tuesday at 06:00. Your ticket asks you to change one line: rounding should be half up instead of half even.

You cannot write a test for what the code *should* do, because nobody alive knows the full spec. You can write a test for what it *does* do right now, and that is enough to change it safely.

### Pin the behaviour before you touch it

A characterization test asserts current behaviour, correct or not. The fastest way to write one is to assert something deliberately wrong and let the failure tell you the truth.

\`\`\`js
// settlement.characterization.test.js
it('characterizes a partial payment against a 4,200 invoice', () => {
  const invoice = { id: 'INV-9081', total: 420000, paid: 250000, currency: 'GBP' };
  expect(settleInvoice(invoice, 170000)).toEqual('UNKNOWN');
});
\`\`\`

Run it. Jest prints the real return value, you paste that in, and the test goes green:

\`\`\`js
  expect(settleInvoice(invoice, 170000)).toEqual({
    status: 'settled',
    applied: 170000,
    residual: 0,
    feeMinor: 246,          // 0.145% rounded half even
  });
\`\`\`

That fee of 246 may well be a bug. Pin it anyway. The job today is to detect any change you did not intend, and a test that encodes a bug does that perfectly. When you fix the rounding, this test fails, and you update the expectation on purpose with the diff visible in review. A characterization test that fails is a report, not an alarm.

Name the file so nobody mistakes it for a specification. \`settlement.characterization.test.js\` tells the next reader that these numbers describe history rather than intent.

### Golden masters for outputs too big to eyeball

When the output is a 300 line invoice PDF payload or a CSV bank file, stop writing assertions by hand and diff whole artefacts.

\`\`\`js
const cases = readdirSync('fixtures/settlement');   // 60 real anonymised runs

test.each(cases)('golden master: %s', (name) => {
  const input = JSON.parse(readFileSync(\`fixtures/settlement/\${name}\`, 'utf8'));
  expect(buildPayoutFile(input)).toMatchSnapshot();
});
\`\`\`

Sixty real inputs pinned in one afternoon covers far more branches than sixty invented ones, because production data contains the combinations you would never think to construct.

Two conditions make this work. Freeze anything non deterministic, or every run diffs against itself:

\`\`\`js
jest.useFakeTimers().setSystemTime(new Date('2026-03-03T06:00:00Z'));
jest.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-2222-3333-4444-555555555555');
\`\`\`

And scrub the fixtures. Real payout data carries account numbers and names, and a snapshot file is committed to the repository forever.

### Find the branches you missed

Coverage is a poor quality target and an excellent input hunting tool here. Run the characterization suite with coverage, open the report, and look for red lines inside \`settlement.js\`. Each uncovered branch is a question: what input reaches this? Usually the answer is a currency you have not exercised, a zero amount, or a refund. Add that fixture, watch the branch turn green, repeat until the remaining red is genuinely dead code.

### Getting a seam into code that fights you

Legacy code often cannot be called at all without a database, a clock, or an SMTP server. You need a seam: a place to change behaviour without editing the logic.

| What blocks you | Cheapest seam |
|---|---|
| \`new Date()\` inside the function | Fake timers, or an optional \`now\` parameter defaulted to \`Date.now()\` |
| A module level DB client | Inject the client as an argument, defaulting to the existing singleton |
| An email send buried mid function | Extract those four lines into a method you can stub |
| A giant function with one new rule | Sprout a new tested function and call it from the old one |

Each of these is a refactor performed before any test exists, which sounds backwards and is unavoidable. Keep them mechanical and tiny: parameter defaults and extracted functions only, no logic rewritten, no conditions reordered. Then pin the behaviour, and only then change what the ticket actually asked for.
      `,
        [
          q('You pin settleInvoice and the fee it returns, 246, comes from a rounding rule you are fairly sure is wrong. What should the characterization test assert?', [
            'The corrected fee, so the test documents intended behaviour',
            'The 246 it returns today, with the suspected bug pinned',
            'Nothing about the fee, only the settled status and residual',
            'A range around 246 so small rounding drift stays green',
          ], 1, 'A characterization test records history rather than intent, so pinning today\'s value means the later rounding fix shows up as a deliberate, reviewable change to the expectation instead of slipping through unnoticed.'),
          q('A golden master suite over 60 production shaped fixtures passes locally and fails every morning in CI. What is the most likely cause?', [
            'The fixtures were anonymised after the snapshots were taken',
            'CI runs the cases in parallel so snapshots interleave badly',
            'Coverage instrumentation changes the output of the builder',
            'Something non deterministic, such as the clock, is unfrozen',
          ], 3, 'A snapshot that embeds a timestamp or a generated identifier diffs against itself on the next run, which is why fake timers and stubbed identifier generation are a precondition for golden master testing.'),
          q('Why is running the characterization suite with coverage useful, even though coverage makes a poor quality target?', [
            'Red branches point at inputs your fixture set never reaches',
            'The percentage proves the legacy module is safe to change',
            'It ranks which legacy functions to rewrite first by size',
            'Uncovered lines are dead code you can delete immediately',
          ], 0, 'Here coverage is a hunting tool rather than a score: each uncovered branch is a question about which input would reach it, and answering that question is how you find the currency, refund, or zero case your fixtures missed.'),
        ]
      ),
      lesson('Migrating a Suite Without Losing Cover', 13, `
A team decided to move 3,800 Enzyme tests to Testing Library. They froze feature work for six weeks, converted 2,300 files, ran out of patience, and shipped a repository with two test runners, two sets of helpers, and a rule that existed only in one person's head about which one to use for new code. Eighteen months later both were still there.

The failure was not the tooling. It was treating a suite migration as a project with an end date instead of a background process with a ratchet.

### Run both, and make the boundary mechanical

Keep the old runner alive and green while the new one grows underneath it. The rule about which files belong to which runner has to live in a file, not in a convention.

\`\`\`json
// package.json
{
  "scripts": {
    "test:legacy": "jest --config jest.enzyme.config.js",
    "test:new": "vitest run",
    "test": "npm run test:legacy && npm run test:new"
  }
}
\`\`\`

Then stop the legacy set from growing:

\`\`\`bash
# scripts/ratchet.sh
COUNT=$(find src -name '*.test.js' -exec grep -l "from 'enzyme'" {} + | wc -l | tr -d ' ')
BUDGET=$(cat .migration-budget)
if [ "$COUNT" -gt "$BUDGET" ]; then
  echo "FAIL: $COUNT legacy tests, budget is $BUDGET. New tests use Testing Library."
  exit 1
fi
[ "$COUNT" -lt "$BUDGET" ] && echo "$COUNT" > .migration-budget && echo "ratchet: $BUDGET -> $COUNT"
\`\`\`

\`.migration-budget\` is committed, starts at 3,800, and only ever goes down. Nobody has to police anything in review. The number falls whenever someone converts a file and can never climb back.

### Migrate in risk order, not alphabetical order

Take the churn ranking from the risk plan and convert the top of it first. Files nobody has edited in two years can stay on the old runner indefinitely, because a test that never fails and never gets read costs almost nothing. The files being changed weekly are where a confusing legacy test actively slows people down.

Codemods handle the mechanical half. \`jscodeshift\` can rewrite imports, \`shallow(<Cart />)\` into \`render(<Cart />)\`, and simple \`wrapper.find('.total').text()\` lookups. It cannot rewrite an assertion about component state, and pretending otherwise produces tests that compile and check nothing.

### The failure mode: cover disappears silently

Here is a converted test that passes forever, including when the feature is entirely broken:

\`\`\`js
it('shows an error when the card is declined', async () => {
  render(<Checkout />);
  await userEvent.click(screen.getByRole('button', { name: /pay/i }));
  waitFor(() => screen.getByText('Card declined'));
});
\`\`\`

The \`waitFor\` is never awaited. It returns a promise, the test function returns, and the assertion resolves or rejects into nothing. Green. Always green.

\`\`\`js
  await screen.findByText('Card declined');
\`\`\`

Coverage will not catch this, because coverage measures which lines executed, not whether anything was asserted about them. The line ran. The percentage looks identical before and after a migration that quietly deleted half your assertions.

Two defences. Turn on the lint rules that catch it, \`testing-library/await-async-utils\` and \`no-floating-promises\`, so the broken shape cannot be committed. And verify a sample the way chapter 7 verified coverage: break the source on purpose and confirm the converted test goes red.

### Do not delete the old test until the new one has earned it

The rule that keeps cover intact through a migration:

| Step | Check |
|---|---|
| 1. Write the replacement | New test passes against unmodified source |
| 2. Sabotage the source | Invert a condition or return a constant |
| 3. Observe | Old test fails, new test fails, same behaviour named |
| 4. Restore, then delete the old test | Ratchet drops by one |

Step 3 is the whole point. If the old test fails and the new one does not, the replacement is weaker and you have found that out before losing the original rather than six months later during an incident.

Merge coverage from both runners into one report while the migration runs, otherwise each report shows an alarming drop and people start making decisions from a number that describes half the suite.
      `,
        [
          q('A converted test calls waitFor(() => screen.getByText(\'Card declined\')) without awaiting it. What happens when that message never renders?', [
            'The test passes, because the assertion settles after it ends',
            'The test fails with a timeout after the default five seconds',
            'Jest reports an unhandled rejection and marks the file red',
            'The runner retries the test and reports it as flaky instead',
          ], 0, 'An unawaited waitFor returns a floating promise, so the test function returns before the assertion settles and the eventual failure lands nowhere the runner is watching, leaving the test green forever.'),
          q('Why does line coverage stay flat across a migration that silently destroyed half the assertions in the suite?', [
            'Both runners report into the same merged coverage summary',
            'Codemods preserve the original line numbers of each file',
            'Coverage records which lines ran, not what was asserted',
            'Snapshot files keep counting toward the covered line total',
          ], 2, 'Instrumentation only knows that a line executed, so a converted test that renders the component and then asserts nothing produces exactly the same percentage as the thorough test it replaced.'),
          q('Before deleting an Enzyme test you sabotage the source. The old test fails and the replacement stays green. What have you learned?', [
            'The sabotage hit a line neither test was ever exercising',
            'The replacement is weaker, so deleting now loses real cover',
            'The old test asserted implementation detail, not behaviour',
            'The replacement needs an await added before it can fail',
          ], 1, 'The sabotage changes real behaviour, so a replacement that stays green does not detect what the original detected, and finding that out while the original still exists is the entire point of the step.'),
        ]
      ),
      lesson('Quality Metrics and the Release Decision', 13, `
It is 15:40, the release goes at 16:00, and the dashboard says 96.2% pass rate, 81% line coverage, 3 open bugs. Someone asks whether it is safe to ship. Nobody in the room can explain what any of those three numbers implies about tomorrow morning.

They cannot, because none of them is about production. A pass rate describes the suite. Coverage describes execution. Open bug count describes a spreadsheet. The question worth answering is how often the things you shipped hurt somebody, and that is measured after the deploy.

### Metrics that get gamed, and what to use instead

| Vanity metric | How it is gamed | Use instead |
|---|---|---|
| Total tests written | Copy paste a file, change one value | Escaped defect rate |
| Line coverage percent | Execute code, assert nothing | Mutation score on critical modules |
| Bugs found by QA | Log cosmetic trivia to raise the count | Defect detection percentage |
| Zero known defects | Reclassify bugs as improvements | Severity ladder with counts per level |

The last row quietly rots a team. Announce that a release requires zero known defects and within two cycles the tracker fills with tickets labelled "enhancement" that are plainly broken behaviour. The metric was met. The software got worse.

### Defect detection percentage, with real numbers

Count what the process caught before release versus what reached users:

\`\`\`text
Release 24.4
  defects found before release ...... 61
  defects found in production
    within 30 days .................. 7

  DDP = 61 / (61 + 7) = 89.7%
\`\`\`

Track DDP over six releases and it tells you whether your testing is improving, which no coverage number does. Alongside it, three figures the deploy pipeline already gives you:

- **Change failure rate.** Deploys needing a rollback or hotfix, over total deploys. 4 of 92 is 4.3%.
- **Time to restore.** Median minutes from alert to recovery. This is why reversibility ranked so high on the risk plan.
- **Flake rate.** Reruns that flip red to green, over total runs. Above 1% and people stop reading failures.

### Turn every escape into a test at the layer that should have caught it

Those seven production defects are the most valuable QA input of the quarter, because each is a proven hole. For each, ask which layer should have caught it, and put the regression test exactly there.

| Escaped defect | Should have been caught by | Action |
|---|---|---|
| VAT wrong for Irish addresses | Unit test on the tax table | Add the country case, plus 3 neighbours |
| Refund allowed twice on retry | Integration test on the route | Idempotency key test in the API suite |
| Pay button under the cookie banner | Visual snapshot on checkout | Add checkout to the screenshot set |
| Payout job silent when queue full | Alert, not a test | Add saturation alert, no test |

The fourth row matters as much as the rest. Some escapes are not economically testable, and the honest answer is monitoring rather than a test nobody maintains.

### Write the exit criteria before the release, not during it

An argument at 15:40 is an argument about criteria nobody agreed. Write them down per release, with a named owner:

| Criterion | Threshold | Owner |
|---|---|---|
| Severity 1 and 2 defects open | 0 | Eng lead |
| Severity 3 defects open | 5 or fewer, each with a ticket | Product |
| Risk plan high areas executed | 100% | QA lead |
| Canary error rate versus baseline | Within 1.2x for 30 minutes | On call |
| Rollback rehearsed on this build | Yes | Release manager |

Thresholds written on Monday are judgement. Thresholds written at 15:40 are whatever gets the release out.

### Who actually owns the decision

Quality is not a gate one person guards. The team that wrote the code owns whether it ships, and the business owns the consequences. What QA owns is the accuracy of the information the decision rests on: which risks were tested and to what depth, which were accepted and by whom, what the canary shows, how long a rollback takes.

Say "the payout path has full regression cover, the CSV export was deliberately untested, and rollback takes four minutes" and you have given the room something it can decide with. Say "we are 81% covered" and you have given it nothing at all.
      `,
        [
          q('A team adopts \'zero known defects\' as its release criterion. What predictably happens by the second release?', [
            'Testing effort shifts toward the highest churn modules first',
            'The suite grows faster than the team can keep it green',
            'Severity 3 defects get fixed before severity 1 defects do',
            'Real defects get relabelled as enhancements to clear the gate',
          ], 3, 'A threshold that cannot be met honestly gets met dishonestly, so the tracker fills with tickets renamed as improvements while the shipped software is exactly as broken as before.'),
          q('Release 24.4 found 61 defects before release and 7 in production within thirty days, giving 89.7%. What does that figure describe?', [
            'The share of the suite that passed on the release candidate',
            'The share of all known defects the process caught pre release',
            'The share of production incidents traced back to test gaps',
            'The share of critical paths executed by the regression plan',
          ], 1, 'Defect detection percentage compares what the process caught before shipping against everything eventually known about that release, which is why it needs a settled window after the deploy before it can be calculated.'),
          q('An escaped defect reads \'payout job goes silent when the queue is full\'. The team records the action as an alert rather than a regression test. Why is that defensible?', [
            'Queue behaviour belongs to infrastructure, not to the QA team',
            'Saturation bugs are always caught by the canary analysis step',
            'Some escapes cost more to test reliably than to monitor for',
            'Escapes without a reproduction cannot be regression tested',
          ], 2, 'Reproducing a saturated queue in a suite is expensive and fragile, so monitoring buys the same protection more cheaply, and pretending otherwise adds a test that will be skipped within a month.'),
        ]
      ),
      ],
      [
      q('A release ships with the admin CSV export untested by agreement, and it breaks for six internal users. What went wrong?', [
        'Nothing failed; an accepted risk behaved as it was accepted',
        'The risk plan under weighted blast radius for internal users',
        'QA owned the ship decision and should have blocked release',
        'The exit criteria needed a zero known defects threshold',
      ], 0, 'Naming the export as deliberately untested made it a risk somebody signed off, so the outcome is the known cost of an open decision rather than a miss by the testing process.'),
      q('You have to change a rounding rule inside an untested 1,400 line module. Which order of work protects you?', [
        'Refactor the module, then pin behaviour, then change rounding',
        'Change rounding, pin the new behaviour, then add fixtures',
        'Add a seam, pin current behaviour, then change the rounding',
        'Pin behaviour, delete dead branches, then change rounding',
      ], 2, 'You often cannot call legacy code at all without a tiny mechanical seam, and once behaviour is pinned every later edit shows up as a diff you chose rather than a change nobody noticed.'),
      q('Halfway through a runner migration, one report shows coverage dropping from 78% to 41%. What is the most likely explanation?', [
        'Codemods stripped assertions out of the converted test files',
        'The ratchet budget was lowered faster than tests were written',
        'Snapshot based tests stopped counting toward covered lines',
        'Each runner reports on its own half of a suite that is split',
      ], 3, 'While both runners are live, each report describes only the files it executed, so the two have to be merged before anyone reads the number as a statement about the codebase.'),
      q('Which practice most directly improves the risk ranking you use for the next release?', [
        'Raising the mutation score threshold on the billing modules',
        'Asking of each escaped defect which layer should have caught it',
        'Adding a screenshot test for every page the release touched',
        'Recording the suite runtime and flake rate for every branch',
      ], 1, 'Every production escape is a proven hole in the current plan, so classifying each one by the layer that should have caught it feeds real evidence back into where the next release spends its testing time.'),
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
      q('A streak job is scheduled hourly, occasionally runs for ninety minutes, and the scheduler starts a second copy on top of the first. Which pair of tests covers the damage that overlap can do?', [
      'Freeze the clock at each daylight saving transition and assert the schedule still fires once per day',
      'Assert the job finishes inside its interval, and alert whenever a run exceeds that budget in production',
      'Assert a second call returns skipped while the lock is held, and that the handler repeats no work if it runs',
      'Assert the cron expression resolves in the learner\'s zone rather than in whatever zone the server runs in',
    ], 2, 'Overlapping runs need two separate proofs: the lock test shows the scheduler\'s second copy declines to start, and the idempotency test shows that a run which slips past the lock still writes the work only once.'),
    q('Moving from eight shards to sixteen cuts wall clock by 2.2 minutes and adds 13.6 billed minutes, because every shard repeats a 110 second checkout, npm ci and browser download. On a repo merging three hundred pull requests a week, what should you attack first?', [
      'The fixed per shard setup, by caching node_modules and baking the browsers into the runner image',
      'The worker count per shard, by raising maxWorkers so that each machine saturates all of its cores',
      'The shard count again, by going to thirty two so each machine is handed far less test time to run',
      'The reporting step, by merging the blob reports inside each job instead of in a follow up job',
    ], 0, 'Each extra shard divides the test time but pays the 110 second setup again, so once the marginal saving is smaller than the fixed cost the only change that makes more shards worthwhile is removing that setup.'),
    q('A dependency\'s postinstall script runs on the CI runner that holds your deploy credentials, before any of your code imports that package. Which pair of measures actually reduces the exposure?', [
      'Run npm audit with --omit=dev on every pull request and gate the build on high and critical findings',
      'Pin exact versions in package.json and regenerate the lockfile whenever a dependency is bumped',
      'Scan the whole repository history with gitleaks and rotate the credentials the runner uses weekly',
      'Install with --ignore-scripts, and fail a test when any package in the lockfile gains an install script',
    ], 3, 'The dangerous moment is install rather than run, so an advisory scan or a version pin does nothing about code that executes during npm install; disabling scripts removes the execution and a lockfile assertion turns any newly added install script into a failure somebody has to review.'),
    q('A team wants to shadow a rewritten checkout against real traffic, but the new code persists a quote row and calls Stripe. Which arrangement keeps the experiment honest without risking a customer?', [
      'Run the candidate first, keep whatever row it writes, and still return the control\'s answer to the caller',
      'Shadow only the calculation, and where the candidate must write, give it a shadow database and a fake payment client',
      'Let both sides run in full and reconcile the duplicate charges and emails in a nightly cleanup job',
      'Sample at one hundred percent so no difference is missed, and refund anything the candidate happens to charge',
    ], 1, 'Shadowing compares answers, not transactions, so the candidate must never repeat a side effect the control already performed; keeping it on the pure calculation, or on isolated write targets it cannot confuse with production, is what makes the diff safe to run on live traffic.'),
    q('Two areas are labelled high severity: a checkout page that renders badly for an hour, and a settlement job that writes 40,000 wrong payout rows. Why does the risk plan rank settlement higher, and which production metric backs that reasoning?', [
      'Reversibility, and median time to restore, because a wrong payout has already left the building',
      'Blast radius, and change failure rate, because the payout path serves far more users each day',
      'Churn, and defect detection percentage, because settlement is the code the team edits most often',
      'Severity, and the flake rate, because the release gate already counts severity one defects first',
    ], 0, 'Blast radius actually favours checkout, which serves 90,000 people a day against settlement\'s 400, so the factor that reorders them is whether the damage can be undone, and time to restore is the deploy metric that measures exactly that.'),
    q('A team migrating 3,800 Enzyme tests commits a .migration-budget file, and CI fails whenever the count of files still importing enzyme exceeds it. What does that mechanism buy that a review convention does not?', [
      'It merges coverage from both runners so the reported percentage describes the entire suite again',
      'It proves each replacement test fails on the same sabotage that the original test used to catch',
      'It converts the highest churn files first, so the migration order follows the risk ranking',
      'It makes the legacy count a number that can only fall, so a new legacy test cannot survive CI',
    ], 3, 'A rule about which runner new tests use lives in somebody\'s head and gets forgotten, whereas the committed budget makes the build fail the moment the legacy count rises and lowers itself each time a file is converted.'),
  ],
});
