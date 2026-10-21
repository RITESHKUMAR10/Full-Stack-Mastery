# React Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Covers **React 18 and React 19** (hooks, concurrent rendering, Server Components, Actions). Class components are included because interviews still ask about them. Features that depend on a framework (Server Components, Server Actions) are marked.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** React interviews are about **how rendering works**: *what triggers a render, what React compares, what runs after render, and what is preserved between renders.* Explain with that mental model.

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks (Hooks & Components)](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Classic + Ecosystem + Patterns)](#-part-11-complete-coverage-classic--ecosystem--patterns)
- [Part 12: React Internals](#-part-12-react-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output-Based Questions](#-part-14-output-based-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is React? Why do we use it? *(Conceptual)*
**Answer:** React is a **JavaScript library for building user interfaces**, created at Meta. You describe the UI as a function of state (**declarative**), and React updates the DOM efficiently when the state changes. Key ideas:
- **Components:** small, reusable UI pieces.
- **Declarative:** you say *what* the UI should look like, not *how* to update the DOM step by step.
- **Unidirectional data flow:** data goes from parent to child through props.
- **Learn once, write anywhere:** web (React DOM), mobile (React Native), server rendering.

React is a **library**, not a full framework: routing, data fetching and builds come from other tools. For new apps the React team recommends a framework (Next.js, React Router framework mode, Expo for mobile) or a build tool like Vite.

### Q2. What is the Virtual DOM? Is it faster than the real DOM? *(Must-know)*
**Answer:** The Virtual DOM is a lightweight JavaScript object tree that describes the UI. When state changes, React renders a **new tree**, **compares (diffs)** it with the previous one, and applies only the **minimal changes** to the real DOM (this is **reconciliation**).
It is **not always faster** than hand-written DOM updates. Its value is a simple programming model (declarative UI), batching of updates, and predictable results. Performance still depends on how much you re-render.

### Q3. What is JSX? How does it work?
**Answer:** JSX is a syntax extension that looks like HTML inside JavaScript. It is compiled (Babel, SWC, esbuild) into function calls (`jsx()` or `React.createElement`). It is **not** HTML.
```jsx
const name = 'Ritesh Kumar';
const el = <h1 className="title">Hello, {name}!</h1>;
// compiles to roughly: jsx('h1', { className: 'title', children: ['Hello, ', name, '!'] })
```
Rules: one root element (or a fragment `<>...</>`), close all tags (`<img />`), `className` instead of `class`, `htmlFor` instead of `for`, camelCase attributes (`onClick`, `tabIndex`), `style={{ color: 'red' }}` takes an object, JavaScript expressions go in `{}` (not statements).

### Q4. What is a component? Function vs class components
A component is a function (or class) that returns UI. **Function components** with hooks are the standard. Class components still work but are legacy.
```jsx
function Greeting({ name }) { return <p>Hello, {name}</p>; }          // function component (name starts with a capital letter)

class GreetingClass extends React.Component {                       // class component
  render() { return <p>Hello, {this.props.name}</p>; }
}
```
Component names must start with a **capital letter**, otherwise JSX treats them as HTML tags.

### Q5. Props vs state *(Must-know, Comparison)*
| | Props | State |
|---|---|---|
| Owned by | Parent | The component itself |
| Can the component change it? | No (read-only) | Yes (through the setter) |
| Purpose | Configuration passed down | Data that changes over time |
| Change triggers re-render? | Yes (when parent passes new values) | Yes |
```jsx
function Counter({ step = 1 }) {              // props
  const [count, setCount] = useState(0);      // state
  return <button onClick={() => setCount(count + step)}>{count}</button>;
}
```

### Q6. How does `useState` work? What are the important rules?
```jsx
const [count, setCount] = useState(0);              // initial value is used only on the first render
setCount(5);                                         // replace
setCount((prev) => prev + 1);                        // functional update (use when new state depends on old)
const [data, setData] = useState(() => expensiveInit());   // lazy initializer: runs once
```
Rules: state updates are **asynchronous/batched**; never mutate state directly (create new objects/arrays); the new value shows up on the **next render**.
```jsx
setUser({ ...user, name: 'Kumar' });                 // ✅ new object
user.name = 'Kumar'; setUser(user);                  // ❌ same reference, no re-render
```

### Q7. How do you handle events?
React uses **synthetic events** (a cross-browser wrapper around native events). Pass a **function**, do not call it.
```jsx
<button onClick={handleClick}>Save</button>             // ✅ pass the function
<button onClick={handleClick()}>Save</button>           // ❌ calls it during render
<button onClick={() => remove(item.id)}>Delete</button> // ✅ with arguments
<form onSubmit={(e) => { e.preventDefault(); save(); }}>...</form>
```
React attaches listeners at the root container and delegates events.

### Q8. Conditional rendering patterns
```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{items.length > 0 && <List items={items} />}      // ✅ boolean condition
{count && <Badge />}                               // ❌ renders "0" when count is 0
if (loading) return <Spinner />;                   // early return
```
Values `false`, `null`, `undefined` and `true` render nothing. Numbers (including `0`) and strings do render.

### Q9. Lists and keys *(Must-know)*
```jsx
<ul>{todos.map((t) => <li key={t.id}>{t.text}</li>)}</ul>
```
A **key** is a stable, unique identity for each item among its siblings. React uses it to match items between renders (to preserve state and DOM, and to reorder instead of re-creating). Use a real ID (not the array index if the list can change order, be filtered, or have items inserted/removed, and never `Math.random()`).

### Q10. Controlled vs uncontrolled components *(Comparison)*
```jsx
// Controlled: React state is the source of truth
const [name, setName] = useState('');
<input value={name} onChange={(e) => setName(e.target.value)} />

// Uncontrolled: the DOM keeps the value; read it with a ref or FormData
const ref = useRef();
<input defaultValue="Ritesh" ref={ref} />
const value = ref.current.value;
```
Controlled gives instant validation and control but more re-renders; uncontrolled is simpler for basic forms. Libraries like React Hook Form use uncontrolled inputs for performance.

### Q11. How do you handle forms?
```jsx
function SignUp() {
  const [form, setForm] = useState({ email: '', password: '' });
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); api.signUp(form); };
  return (
    <form onSubmit={onSubmit}>
      <input name="email" type="email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" value={form.password} onChange={onChange} required minLength={8} />
      <button>Sign up</button>
    </form>
  );
}
```

### Q12. What is `useEffect` (basic)?
`useEffect` runs code **after render** to synchronize your component with something outside React (network, timers, subscriptions, DOM APIs).
```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);                           // runs after the first render and whenever count changes

useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);       // cleanup runs before the next effect and on unmount
}, []);                                 // [] = only on mount (and cleanup on unmount)
```
Three forms: no array (runs after every render), `[]` (once), `[a, b]` (when a or b change).

### Q13. What are the Rules of Hooks?
1. Call hooks **only at the top level** of a component or custom hook (not inside loops, conditions or nested functions).
2. Call hooks **only from React function components or custom hooks** (names start with `use`).
React identifies hooks by **call order**, so the order must be the same on every render. The ESLint plugin `eslint-plugin-react-hooks` enforces this.

### Q14. What is "lifting state up"?
When two components need the same data, move the state to their **closest common parent** and pass it down through props (plus callbacks to update).
```jsx
function Parent() {
  const [celsius, setCelsius] = useState(0);
  return <><Input value={celsius} onChange={setCelsius} /><Display value={celsius} /></>;
}
```

### Q15. Composition and the `children` prop
Build UI by combining components, not by inheritance.
```jsx
function Card({ title, children }) { return <section><h2>{title}</h2>{children}</section>; }
<Card title="Profile"><Avatar /><Bio /></Card>
```
Prefer composition (slots via props like `header`, `footer`) over deep inheritance.

### Q16. What are Fragments?
Group multiple elements without adding an extra DOM node: `<>...</>` or `<React.Fragment key={id}>...</React.Fragment>` (use the long form when you need a `key`).

### Q17. What is one-way data flow?
Data flows **down** (props) and events flow **up** (callbacks). A child never changes a parent's data directly; it calls a function that the parent passed. This makes data changes easy to trace.

### Q18. What is the component lifecycle?
Three phases: **mount** (created and added to the DOM), **update** (re-rendered due to state/props/context changes), **unmount** (removed). In function components use `useEffect` (and cleanup) for lifecycle behavior; in class components use `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`.

### Q19. React vs Angular vs Vue *(Comparison)*
| | React | Angular | Vue |
|---|---|---|---|
| Type | Library (UI) | Full framework | Progressive framework |
| Language | JS/JSX (+TS) | TypeScript | JS/TS + templates |
| Data binding | One-way | Two-way (and signals) | One-way + `v-model` |
| Learning curve | Medium | Steeper | Gentle |
| Ecosystem | Huge, you choose | Opinionated, built in | Balanced |

### Q20. What is a SPA and how does routing work in React?
A Single Page Application loads one HTML page and updates the UI with JavaScript without full reloads. **React Router** uses the History API to change the URL and render components for each route.
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<User />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```
The server must return `index.html` for all routes (fallback), otherwise refreshing a deep link gives a 404.

### Q21. How do you create a React project today?
**Create React App is deprecated** (the React team sunset it in 2025). Use **Vite** for client apps (`npm create vite@latest my-app -- --template react`), or a framework like **Next.js**, **React Router (framework mode)** or **Remix**.

### Q22. What is `StrictMode`?
A development-only wrapper that helps find bugs: it **renders components twice** and **runs effects an extra time** (mount → unmount → mount) to reveal impure rendering and missing cleanup. It does nothing in production.

### Q23. What is prop drilling?
Passing props through many intermediate components that do not use them. Solutions: Context, composition (pass components as `children`), state management libraries, or colocating state closer to where it is used.

### Q24. Default props and prop validation
Use default parameter values: `function Button({ size = 'md' }) {}`. `PropTypes` were removed in React 19; use **TypeScript** (or JSDoc) for prop types.

### Q25. What are refs? Basic `useRef`
A ref holds a mutable value that **persists across renders without causing re-render**. Common use: access a DOM element.
```jsx
function Focus() {
  const inputRef = useRef(null);
  return <><input ref={inputRef} /><button onClick={() => inputRef.current.focus()}>Focus</button></>;
}
```

### Q26. How do you style React components?
Plain CSS files, **CSS Modules** (scoped class names), inline `style` objects, **Tailwind**, CSS-in-JS (styled-components, emotion; runtime cost, limited with Server Components), zero-runtime options (vanilla-extract, Panda). Pick based on SSR/RSC support, team skills and performance.

### Q27. What are React DevTools?
A browser extension with **Components** (inspect props/state/hooks) and **Profiler** (record renders, see why a component rendered and how long it took).

### Q28. When does a component re-render? *(Must-know)*
A component re-renders when: (1) its **state** changes (new value), (2) its **parent re-renders** (children re-render by default, even if props are the same), (3) a **context** it uses changes. Props changing does not by itself cause a render; the parent rendering does. `React.memo` can skip re-rendering when props are shallow-equal.

### Q29. What does "components must be pure" mean?
Rendering should only calculate JSX from props and state, with **no side effects** (no mutating outside variables, no network calls, no random values or `Date.now()` that change the output unexpectedly). Side effects belong in event handlers or `useEffect`. Purity allows React to re-run, pause and discard renders safely.

### Q30. What is the `children` prop and `React.Children`?
`children` is whatever you put between the opening and closing tags. `React.Children` has helpers (`map`, `count`, `toArray`) but they are fragile; prefer explicit props or composition.

### Q31. How do you fetch data in a simple component?
```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/users', { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(setUsers)
      .catch((e) => { if (e.name !== 'AbortError') setError(e); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```
In real apps prefer a data library (TanStack Query, SWR) or framework loaders.

### Q32. Conditional class names and styles
```jsx
<button className={`btn ${active ? 'btn-active' : ''}`}>Go</button>
// with clsx: className={clsx('btn', { 'btn-active': active })}
<div style={{ backgroundColor: color, padding: 8 }} />
```

### Q33. What does JSX compile to? (`createElement`)
```jsx
<div className="a">Hi</div>
// old:  React.createElement('div', { className: 'a' }, 'Hi')
// new:  jsx('div', { className: 'a', children: 'Hi' })   // automatic runtime: no need to import React
```
The result is a plain object (a **React element**) describing what to render.

### Q34. Class components: the basics (legacy)
```jsx
class Counter extends React.Component {
  state = { count: 0 };
  inc = () => this.setState((s) => ({ count: s.count + 1 }));      // arrow keeps `this`
  componentDidMount() { /* start timers, fetch */ }
  componentWillUnmount() { /* cleanup */ }
  render() { return <button onClick={this.inc}>{this.state.count}</button>; }
}
```
`this.setState` merges state; hooks replace it entirely.

### Q35. Common beginner warnings and errors
- *"Each child in a list should have a unique key"* → add stable keys.
- *"Cannot read properties of undefined"* → data not loaded yet; guard or use optional chaining.
- *"Objects are not valid as a React child"* → you rendered an object; render its fields.
- *"Too many re-renders"* → you set state during render (`onClick={setX(1)}` instead of `onClick={() => setX(1)}`).
- *"A component is changing an uncontrolled input to be controlled"* → initial `value` was `undefined`; use `''`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. `useEffect` in depth *(Must-know)*
- Runs **after the browser paints** (passive effect), so it does not block rendering.
- The dependency array lists reactive values (props, state, variables from the component) that the effect reads. React compares them with `Object.is`.
- **Cleanup** runs before the effect re-runs and when the component unmounts.
- In development `StrictMode` runs mount → cleanup → mount to make bugs visible.
- Effects are for **synchronizing with external systems**, not for transforming data or responding to user events.
```jsx
useEffect(() => {
  const conn = createConnection(roomId);        // external system
  conn.connect();
  return () => conn.disconnect();               // cleanup
}, [roomId]);                                    // re-connect when roomId changes
```
**"You might not need an effect":** do not use effects for derived data (compute during render), for resetting state on prop change (use `key`), or for handling clicks (use handlers).

### Q37. Data fetching in effects: race conditions
If `id` changes quickly, older responses can arrive after newer ones and overwrite them.
```jsx
useEffect(() => {
  let ignore = false;
  fetchUser(id).then((u) => { if (!ignore) setUser(u); });
  return () => { ignore = true; };               // or use AbortController
}, [id]);
```
Better: TanStack Query / SWR (caching, deduping, retries), or framework data loaders, or React 19 `use` with Suspense.

### Q38. `useRef` use cases
(1) Access DOM nodes, (2) store mutable values that should not trigger renders (timer ids, previous values, "is mounted"), (3) keep the latest callback/value for async code.
```jsx
function usePrevious(value) { const ref = useRef(); useEffect(() => { ref.current = value; }); return ref.current; }
```
Do not read or write `ref.current` during render for values that affect output; use state for that.

### Q39. `useMemo`
Caches a computed value between renders until dependencies change.
```jsx
const sorted = useMemo(() => [...items].sort(compare), [items]);
```
Use it for **expensive** calculations or to keep referential equality for objects passed to memoized children. It is a performance hint, not a semantic guarantee (React may discard the cache). Do not use it everywhere; measure first.

### Q40. `useCallback`
Returns the same function instance until dependencies change. Useful when passing callbacks to `memo` children or as effect dependencies.
```jsx
const onSave = useCallback((data) => api.save(id, data), [id]);
```
`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.

### Q41. `React.memo`
Skips re-rendering a component if its props are **shallowly equal** to the previous props.
```jsx
const Row = React.memo(function Row({ item, onSelect }) { return <li onClick={() => onSelect(item.id)}>{item.name}</li>; });
```
It only helps if props are stable: pass memoized callbacks/objects (`useCallback`, `useMemo`) and avoid creating new objects inline. A custom comparison function is possible but rarely needed.

### Q42. Context API: how and when?
```jsx
const ThemeContext = createContext('light');
function App() { const [theme, setTheme] = useState('dark'); 
  return <ThemeContext.Provider value={{ theme, setTheme }}><Page /></ThemeContext.Provider>; }
function Button() { const { theme } = useContext(ThemeContext); return <button className={theme}>Click</button>; }
```
React 19: you can render `<ThemeContext value={...}>` directly (no `.Provider`). Context is for **low-frequency, app-wide data** (theme, locale, auth user). Every consumer re-renders when the value changes (see performance notes in Part 3).

### Q43. `useReducer`
Good for complex state logic with several sub-values or when the next state depends on actions.
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.item] };
    case 'remove': return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default: throw new Error('Unknown action');
  }
}
const [state, dispatch] = useReducer(reducer, { items: [] });
dispatch({ type: 'add', item });
```
`dispatch` is stable, so it is safe to pass down and in dependency arrays.

### Q44. Custom hooks
A function whose name starts with `use` that calls other hooks to **reuse stateful logic** (not state itself; each use gets its own state).
```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle];
}
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const h = () => setW(window.innerWidth); addEventListener('resize', h); return () => removeEventListener('resize', h); }, []);
  return w;
}
```

### Q45. How does reconciliation use keys and types?
React compares old and new trees with two heuristics: (1) elements of **different types** produce different trees (unmount old, mount new, state lost); (2) **keys** identify children in lists. Same type at the same position keeps its state. Changing a `key` forces a remount, which is a handy way to reset state.

### Q46. Code splitting with `React.lazy` and `Suspense`
```jsx
const Settings = React.lazy(() => import('./Settings'));
<Suspense fallback={<Spinner />}><Settings /></Suspense>
```
Route-based splitting is the best starting point. `lazy` works with default exports.

### Q47. Error boundaries
A component that catches errors in its **child tree during rendering** and shows a fallback. Must be a class component (or use `react-error-boundary`).
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logToService(error, info); }
  render() { return this.state.hasError ? <p>Something went wrong.</p> : this.props.children; }
}
```
They do **not** catch errors in event handlers, async code, SSR or the boundary itself. Handle those with try/catch.

### Q48. Portals
Render children into a different DOM node while keeping React tree behavior (events bubble through React).
```jsx
createPortal(<div className="modal">...</div>, document.body)
```
Used for modals, tooltips, dropdowns that must escape `overflow: hidden` or z-index issues.

### Q49. HOC vs render props vs hooks
- **HOC:** a function that takes a component and returns a new one (`withAuth(Page)`). Can cause wrapper hell and prop collisions.
- **Render props:** a prop that is a function returning JSX (`<Mouse render={(pos) => ...} />`).
- **Hooks:** reuse logic without extra wrapper components. Hooks are the modern default.

### Q50. Form libraries
**React Hook Form** (uncontrolled, fast) + **Zod** (schema validation) is a common pair. Formik is older. Benefits: less boilerplate, performance, built-in validation and error handling.
```jsx
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
<form onSubmit={handleSubmit(onSubmit)}><input {...register('email')} />{errors.email && <p>{errors.email.message}</p>}</form>
```

### Q51. React Router essentials
`<Link>`/`<NavLink>`, `useNavigate`, `useParams`, `useSearchParams`, nested routes with `<Outlet>`, loaders/actions (data router), protected routes via wrapper components, lazy routes. In React Router v7 the framework mode combines the former Remix features.

### Q52. State management: options and when to use them
| Need | Choice |
|---|---|
| Local UI state | `useState` / `useReducer` |
| Shared low-frequency data | Context |
| Complex client state, devtools | Redux Toolkit |
| Simple global state | Zustand / Jotai |
| Server state (fetching, cache) | TanStack Query / SWR |
| URL state | Router search params |
| Form state | React Hook Form |
Do not put server data in Redux by default; use a server-state library.

### Q53. TanStack Query basics
```jsx
const { data, isPending, error } = useQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) });
const mutation = useMutation({ mutationFn: updateUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', id] }) });
```
It gives caching, deduplication, background refetching, retries, pagination helpers and optimistic updates.

### Q54. `useEffect` vs `useLayoutEffect`
`useLayoutEffect` runs **synchronously after DOM updates but before the browser paints**; use it to measure layout and then update synchronously (avoiding flicker). It blocks painting, so use it sparingly. It warns on the server (SSR) because layout does not exist there.

### Q55. `forwardRef` and `useImperativeHandle`; refs as props in React 19
```jsx
// React 18
const Input = forwardRef(function Input(props, ref) { return <input ref={ref} {...props} />; });
// React 19: ref is just a prop for function components
function Input({ ref, ...props }) { return <input ref={ref} {...props} />; }
// Expose a limited API
useImperativeHandle(ref, () => ({ focus: () => inputRef.current.focus() }), []);
```

### Q56. Automatic batching (React 18)
React 18 batches multiple state updates into **one render**, even inside timeouts, promises and native event handlers (React 17 batched only in React event handlers). Use `flushSync` only when you must force a synchronous DOM update.

### Q57. Stale closures
A function captures the values from the render in which it was created. Async callbacks and intervals can see **old** state.
```jsx
useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id); }, []);   // ❌ count is always 0
useEffect(() => { const id = setInterval(() => setCount((c) => c + 1), 1000); return () => clearInterval(id); }, []); // ✅ functional update
```

### Q58. Immutable updates: arrays and nested objects
```jsx
setItems([...items, newItem]);
setItems(items.filter((i) => i.id !== id));
setItems(items.map((i) => (i.id === id ? { ...i, done: true } : i)));
setUser((u) => ({ ...u, address: { ...u.address, city: 'Patna' } }));
```
Use Immer (`useImmer`, Redux Toolkit) for deeply nested updates.

### Q59. Testing React components (React Testing Library)
Test what users see and do, not implementation details.
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
test('increments', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```
Query priority: `getByRole` → `getByLabelText` → `getByText` → `getByTestId` (last). Mock the network with MSW.

### Q60. Derived state: do not copy props into state
```jsx
function Bad({ user }) { const [name, setName] = useState(user.name); /* does not update when props change */ }
function Good({ user }) { const fullName = `${user.first} ${user.last}`; /* compute during render */ }
```
If you need to reset state when a prop changes, use `key`: `<Profile key={userId} />`.

### Q61. Class lifecycle → hooks mapping
| Class | Hooks |
|---|---|
| `constructor` / initial state | `useState(initial)` |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | cleanup returned from `useEffect` |
| `shouldComponentUpdate` / `PureComponent` | `React.memo` |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (approximate) |
| `componentDidCatch` | Error boundary (class still required) |

### Q62. Accessibility basics in React
Use semantic elements (`button`, `nav`, `label`), `htmlFor` with `id`, `aria-*` attributes only when needed, manage focus after route changes and modals, support keyboard, announce dynamic updates (`aria-live`), and test with `eslint-plugin-jsx-a11y` and axe.

### Q63. Environment variables and configuration
Vite exposes variables prefixed with `VITE_` through `import.meta.env`; Next.js uses `NEXT_PUBLIC_` for browser-exposed values. Anything in the client bundle is **public**. Never put secrets there.

### Q64. Controlled input patterns: debounce a search field
```jsx
function Search({ onSearch }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const id = setTimeout(() => onSearch(text), 300);
    return () => clearTimeout(id);
  }, [text, onSearch]);
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}
```

---

# 🟡 Part 3: Mid (3–5 years)

### Q65. How does React render? Render phase vs commit phase *(Must-know)*
1. **Trigger:** initial render (`createRoot().render`), or a state update.
2. **Render phase:** React calls your components to compute the new tree (pure; can be paused, restarted or discarded in concurrent rendering). It builds a work-in-progress **Fiber** tree and diffs it against the current one.
3. **Commit phase:** React applies DOM changes synchronously (mutations), then runs **layout effects** (`useLayoutEffect`, `componentDidMount/Update`), the browser paints, and then **passive effects** (`useEffect`) run.
This is why render must be pure: it may be called more than once without committing.

### Q66. Concurrent rendering and transitions
React 18 can **interrupt** low-priority renders to handle urgent updates (typing) first.
```jsx
const [isPending, startTransition] = useTransition();
function onChange(e) {
  setQuery(e.target.value);                          // urgent: keep typing responsive
  startTransition(() => setResults(search(e.target.value)));   // non-urgent: can be interrupted
}
```
`startTransition` marks updates as non-urgent. This improves INP for expensive renders. It does not make the work itself faster; it keeps the UI responsive.

### Q67. `useDeferredValue`
Gives a "lagging" copy of a value that updates after urgent work finishes.
```jsx
const deferred = useDeferredValue(query);
const results = useMemo(() => heavyFilter(items, deferred), [items, deferred]);
```
Use when you cannot wrap the state setter in `startTransition` (value comes from props). Pair with `memo` so the heavy child skips renders while the value is stale.

### Q68. Suspense for data and the `use` hook (React 19)
`Suspense` shows a fallback while children wait for something (lazy code, data via a Suspense-enabled library or framework). `use(promise)` reads a promise (or context) during render; it suspends until resolved.
```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);       // suspends here
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}
<Suspense fallback={<Skeleton />}><Comments commentsPromise={promiseFromParentOrServer} /></Suspense>
```
Create the promise **outside** the render (in a loader, server component or cache), or you will create a new promise every render and loop.

### Q69. React Server Components (RSC) *(framework feature, e.g., Next.js App Router)*
Server Components run **only on the server** (or at build time), can access databases and secrets directly, and send **no component JavaScript** to the browser. Client Components (`'use client'`) run in the browser and handle interactivity.
```jsx
// app/page.jsx (Server Component by default)
export default async function Page() {
  const posts = await db.post.findMany();            // direct data access
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}<LikeButton /></ul>;
}
// LikeButton.jsx
'use client';
export function LikeButton() { const [n, setN] = useState(0); return <button onClick={() => setN(n + 1)}>{n}</button>; }
```
Rules: Server Components cannot use state/effects/browser APIs; you can pass Server Components as `children` to Client Components; props crossing the boundary must be serializable. Benefits: smaller bundles, fewer waterfalls, better security.

### Q70. React 19 Actions: `useActionState`, `useFormStatus`, `useOptimistic`
```jsx
function Rename({ name }) {
  const [error, submit, isPending] = useActionState(async (prev, formData) => {
    const res = await updateName(formData.get('name'));
    return res.error ?? null;
  }, null);
  return <form action={submit}><input name="name" defaultValue={name} /><button disabled={isPending}>Save</button>{error && <p>{error}</p>}</form>;
}
function SubmitButton() { const { pending } = useFormStatus(); return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>; }
const [optimisticLikes, addOptimistic] = useOptimistic(likes, (state, delta) => state + delta);
```
`<form action={fn}>` accepts a function (Action). Pending state, errors and optimistic updates are handled by React; the form resets automatically after success. In frameworks, `'use server'` functions can be used as Server Actions.

### Q71. Hydration and mismatch errors
**Hydration** attaches event listeners and state to server-rendered HTML with `hydrateRoot`. The first client render must match the server HTML. Mismatches come from: `Date.now()`/`Math.random()` in render, `window`/`localStorage` checks (`typeof window`), different time zones/locales, invalid HTML nesting (`<div>` in `<p>`), and browser extensions. Fix: render the same output on first render, then update in `useEffect`; `suppressHydrationWarning` only for unavoidable text differences; `useSyncExternalStore` with `getServerSnapshot` for browser-only values.

### Q72. SSR, streaming and selective hydration
`renderToPipeableStream` / `renderToReadableStream` stream HTML as it becomes ready. `Suspense` boundaries let React send the shell first and fill slower parts later, and hydrate parts independently (selective hydration), prioritizing parts the user interacts with. This improves TTFB/FCP and INP.

### Q73. How do you find and fix performance problems in React? *(Method)*
1. Reproduce and **measure** with the React Profiler and browser Performance panel.
2. Find **what rendered and why** (Profiler "Why did this render?", `why-did-you-render`).
3. Fix in this order: (a) **reduce work** (virtualize lists, paginate, avoid expensive computations in render), (b) **move state down / colocate** so fewer components re-render, (c) **split context**, (d) **memoize** (`memo`, `useMemo`, `useCallback`) where profiling shows a benefit, (e) **defer** non-urgent work (`startTransition`, `useDeferredValue`), (f) **code split** and lazy-load.
4. Re-measure. Remember that most React apps are slow because of too much JavaScript or too many re-renders of large trees, not because of missing `useMemo`.

### Q74. Context performance problems and fixes
Every consumer re-renders when the context `value` changes (by `Object.is`). A new object each render (`value={{ a, b }}`) re-renders all consumers on each provider render.
```jsx
const value = useMemo(() => ({ user, logout }), [user, logout]);     // stable value
```
Better: **split contexts** (state vs dispatch; rarely-changing vs frequently-changing), keep context for low-frequency data, use selectors with libraries (Zustand, Redux, `use-context-selector`), or composition so that unchanged children are passed as `children` (their element identity stays the same, so they are skipped).

### Q75. Compound components pattern
Components that work together and share implicit state through context.
```jsx
const TabsCtx = createContext();
function Tabs({ children, defaultValue }) { const [value, setValue] = useState(defaultValue); return <TabsCtx.Provider value={{ value, setValue }}>{children}</TabsCtx.Provider>; }
Tabs.Tab = function Tab({ value, children }) { const c = useContext(TabsCtx); return <button aria-selected={c.value === value} onClick={() => c.setValue(value)}>{children}</button>; };
Tabs.Panel = function Panel({ value, children }) { return useContext(TabsCtx).value === value ? <div role="tabpanel">{children}</div> : null; };
// <Tabs defaultValue="a"><Tabs.Tab value="a">A</Tabs.Tab><Tabs.Panel value="a">Content</Tabs.Panel></Tabs>
```
Flexible API, used by Radix UI and Reach UI.

### Q76. Controlled + uncontrolled hybrid (state reducer / "controllable state")
Allow a component to work both ways: if `value` prop is provided, it is controlled; otherwise it manages its own state.
```jsx
function useControllable({ value, defaultValue, onChange }) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback((v) => { if (!controlled) setInner(v); onChange?.(v); }, [controlled, onChange]);
  return [current, set];
}
```

### Q77. `useSyncExternalStore`
The correct way to subscribe to external stores (Redux, Zustand, browser APIs) without tearing in concurrent rendering.
```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (cb) => { addEventListener('online', cb); addEventListener('offline', cb); return () => { removeEventListener('online', cb); removeEventListener('offline', cb); }; },
    () => navigator.onLine,
    () => true                                     // server snapshot for SSR
  );
}
```

### Q78. `useId`, `useInsertionEffect`, `useTransition`, `useDebugValue`
`useId` generates stable unique IDs for accessibility attributes (matches on server and client). `useInsertionEffect` is for CSS-in-JS libraries to inject styles before layout. `useDebugValue` labels custom hooks in DevTools.

### Q79. Pattern choices: render props, HOC, provider, state reducer, headless components
Prefer **custom hooks** and **headless components** (logic without styling, like Radix/Headless UI/React Aria). Use compound components for flexible APIs and context for shared state inside a component family.

### Q80. How do you design a good custom hook?
Single responsibility, clear name, stable return values (memoize functions/objects returned when consumers use them as dependencies), no hidden side effects, accept options with defaults, clean up effects, handle SSR (guard `window`), and be testable (`renderHook`).

### Q81. Effects best practices (summary)
Keep effects focused; add every reactive dependency (do not lie to the linter); put logic that responds to an event in the event handler; avoid effects that only update state from other state (compute it); use cleanup; avoid `async` effect callbacks (create an async function inside); in React 19.2+ `useEffectEvent` lets an effect read the latest props/state without re-running (check release notes).

### Q82. Colocating state and the `key` reset trick
Keep state as close as possible to where it is used (fewer re-renders, simpler code). To reset a subtree's state when an identity changes, give it a new `key`.
```jsx
<Editor key={documentId} document={doc} />      // new document → fresh Editor state
```

### Q83. Code splitting strategy
Split by **route**, then by heavy features (editors, charts, maps) with `lazy` + `Suspense`; prefetch likely next routes (on hover/idle); avoid too many tiny chunks; analyze with bundle visualizers; use framework features (Next `dynamic`, route-based splitting).

### Q84. TypeScript with React *(quick)*
```tsx
type Props = { label: string; onClick?: () => void } & React.ComponentProps<'button'>;
const [user, setUser] = useState<User | null>(null);
const ref = useRef<HTMLInputElement>(null);
function useFetch<T>(url: string) { const [data, setData] = useState<T | null>(null); /* ... */ return data; }
```
Prefer typed props over `React.FC`. Use discriminated unions for variant props.

### Q85. Testing strategy
Unit tests for pure logic and hooks (`renderHook`), component tests with React Testing Library (behavior, accessibility queries), integration tests with mocked network (MSW), end-to-end tests for critical flows (Playwright/Cypress), visual tests (Storybook + Chromatic), and a11y checks (axe). Avoid snapshot overuse and testing implementation details.

### Q86. React Compiler
A build-time compiler (Babel/SWC plugin) that **automatically memoizes** components and hooks by analyzing code that follows the Rules of React. It reduces the need for manual `useMemo`/`useCallback`/`memo`. Requires pure render logic and proper hook usage. Adopt incrementally and verify with the Profiler (check the current docs for the stable status and setup).

### Q87. What is new in React 19? (summary)
Actions and `useActionState`/`useFormStatus`/`useOptimistic`, the `use` API, `ref` as a prop (and ref cleanup functions), `<Context>` as a provider, document metadata tags (`<title>`, `<meta>`) hoisting in components, resource preloading APIs (`preload`, `preinit`), improved hydration error messages, stable Server Components, and removed legacy APIs (`propTypes`, `defaultProps` on functions, legacy context, string refs, `ReactDOM.render`). Minor releases add features such as `useEffectEvent` and `<Activity>` (verify in the release notes).

### Q88. State machines with `useReducer` (or XState)
Model UI flows (wizard, async request) with explicit states and transitions to avoid impossible combinations (`isLoading && isError`).
```jsx
const [state, send] = useReducer((s, e) => ({ idle: { FETCH: 'loading' }, loading: { OK: 'success', FAIL: 'error' }, success: {}, error: { RETRY: 'loading' } }[s]?.[e] ?? s), 'idle');
```

### Q89. React's event system
Events are attached to the root container and delegated. The `SyntheticEvent` wrapper (event pooling was removed in React 17) normalizes browsers. `e.nativeEvent` gives the real one. `stopPropagation()` stops the React tree propagation; call it before the native event reaches `document` listeners if you mix systems. Some events (`scroll`, `wheel`, `touchstart`) are passive by default.

### Q90. Optimistic updates (pattern)
Update the UI immediately, send the request, roll back on error. With TanStack Query: `onMutate` (snapshot + update cache), `onError` (rollback), `onSettled` (refetch). With React 19: `useOptimistic` inside an Action.


---

# 🟠 Part 4: Senior (5–7 years)

### Q91. How do you structure a large React application? *(Architecture)*
Use a **feature-based** structure (code that changes together lives together), not only by file type.
```
src/
  app/            # providers, routing, app shell
  features/
    orders/
      api/        # fetchers, query keys
      components/ # UI used only by this feature
      hooks/
      model/      # types, schemas, reducers
      index.ts    # public API of the feature
  shared/
    ui/           # design-system components
    lib/          # utilities
    hooks/
```
Rules: features import from `shared`, not from each other's internals; expose a small public API per feature; enforce boundaries with lint rules (eslint-plugin-boundaries / Nx module boundaries); keep server state in a data layer (TanStack Query / loaders) and UI state local.

### Q92. How do you diagnose and fix excessive re-renders? *(Performance)*
1. **Profile:** React DevTools Profiler → record → find components with long or frequent renders; enable "Record why each component rendered".
2. **Find the cause:** state too high in the tree, new object/array/function props every render, context value changes, parent re-render, unstable keys.
3. **Fix in order:** colocate state (move it down), split components so the changing part is small, pass `children` (element identity stays the same), split contexts, use selectors with an external store, then memoize (`memo` + stable props), virtualize big lists, defer non-urgent updates (`useTransition`/`useDeferredValue`).
4. Consider the **React Compiler** to automate memoization.
5. Re-measure; do not add memoization without evidence.

### Q93. Server Components architecture in depth *(RSC)*
- **Boundaries:** `'use client'` marks the boundary; everything imported from a client file becomes client code. Keep the boundary as low (as leaf-like) as possible.
- **Composition:** a Server Component can render a Client Component and pass props (serializable) or Server Components as `children`.
- **Data fetching:** `await` directly in Server Components; fetch in parallel (`Promise.all`) to avoid waterfalls; use caching primitives of the framework (request memoization, `cache`, revalidation).
- **Serialization:** no functions, class instances or symbols across the boundary (except Server Actions).
- **Security:** keep secrets and DB access in server-only modules (`import 'server-only'`); never pass sensitive data to Client Components; **Server Actions are public HTTP endpoints**: always authenticate and authorize inside them and validate inputs.
- **Mutations:** forms with Server Actions + `revalidatePath/Tag`; optimistic UI with `useOptimistic`.
- **Trade-offs:** powerful but adds mental overhead (two environments), framework coupling, and caching complexity.

### Q94. Data-fetching patterns and waterfalls
**Fetch-on-render** (component fetches in an effect after rendering) creates waterfalls: parent renders → fetches → child renders → fetches. Better:
- **Fetch-then-render / render-as-you-fetch:** start fetching before rendering (route loaders, server components, `prefetchQuery`).
- **Parallelize** independent requests; avoid sequential `await`s.
- **Place Suspense boundaries** so slow parts do not block the whole page.
- **Prefetch** on hover/viewport for likely next routes.
- Cache and dedupe requests (TanStack Query / framework cache).

### Q95. Concurrent rendering pitfalls: tearing and impure renders
In concurrent mode a render can be paused, restarted, or rendered twice. Problems appear when render reads **mutable external data** (global variables, stores) and the data changes mid-render (**tearing**: different parts of UI show different versions). Solutions: use `useSyncExternalStore` for external stores, keep render pure, avoid reading/writing refs during render, and make effects idempotent.

### Q96. Designing Suspense and error boundaries
Use boundaries at **meaningful UI regions** (page, widget, panel), not around every component. Nested Suspense gives progressive loading; layout-stable fallbacks (skeletons with fixed size) avoid layout shift. Wrap navigations in `startTransition` so existing UI stays visible instead of flashing a fallback. Use error boundaries per route and per independent widget so one failure does not blank the page, with retry (`resetKeys`).

### Q97. State architecture: what lives where? *(Decision)*
| State kind | Where |
|---|---|
| Server data (cached, shared) | TanStack Query / SWR / framework cache |
| URL state (filters, tabs, pagination) | Router search params |
| Form state | React Hook Form / Actions |
| Local UI state (open/closed) | `useState` in the component |
| Cross-cutting client state (cart, theme, auth user) | Context or Zustand/Redux |
| Derived values | Computed during render (`useMemo` only when needed) |
Avoid duplicating the same data in multiple stores. Prefer deriving over syncing.

### Q98. Building a design system in React
Tokens (CSS variables), **headless primitives** (Radix UI, React Aria) for accessibility and behavior, styled components on top (CVA + Tailwind or CSS Modules), polymorphic `as` prop sparingly, composition APIs (compound components, slots), docs in Storybook with accessibility checks, visual regression tests (Chromatic), semantic versioning, and clear deprecation policy. Make React a **peerDependency** of the package.

### Q99. Security in React applications
- **XSS:** React escapes values in JSX. Risks: `dangerouslySetInnerHTML` (sanitize with DOMPurify), `href`/`src` with `javascript:` URLs (validate protocols), injecting JSON into HTML in SSR (escape `<` characters), unsafe third-party scripts.
- **Auth tokens:** prefer HttpOnly + Secure + SameSite cookies over `localStorage`.
- **CSRF:** needed when using cookie auth (SameSite, CSRF tokens, check `Origin`).
- **Secrets:** nothing in the client bundle; use server code/BFF.
- **Dependencies:** lockfiles, audit, minimal packages, Subresource Integrity for CDN scripts.
- **CSP** with nonces for SSR apps.
- **Server Actions/API routes:** authentication, authorization and input validation on every endpoint.

### Q100. Accessibility at scale
Use semantic HTML, label every control, manage focus on route changes and dialogs (move focus to the page heading or dialog, return it on close), announce updates with `aria-live`, ensure keyboard support for custom widgets (or use headless libraries), maintain color contrast, support reduced motion, run `eslint-plugin-jsx-a11y` + axe in CI + manual screen-reader checks, and build accessibility into the design system.

### Q101. Internationalization (i18n)
Use `react-intl` (ICU messages) or `i18next`/`next-intl`. Externalize all strings, use ICU plurals/select, format dates/numbers/currency with `Intl`, support RTL (`dir`, logical CSS), load locale bundles lazily, avoid string concatenation, and test long translations (text expansion) and fallback locales.

### Q102. Testing architecture and flaky tests
Pyramid: many fast unit tests, focused component tests with RTL, integration tests with MSW, a few E2E flows with Playwright. Reduce flakiness: no real timers/network, wait for UI with `findBy*`/`waitFor`, isolate state between tests, deterministic data, avoid sleeping. Add contract tests with the backend (OpenAPI/Pact) and visual regression for the design system.

### Q103. Error handling and monitoring strategy
Layers: error boundaries (render errors), try/catch in event handlers and async code, query/mutation `onError` handlers, a global handler for unhandled rejections, and a reporting service (Sentry) with release, user and route context plus source maps. Show recoverable UI (retry buttons), log without personal data, and alert on error-rate regressions per release.

### Q104. Large lists and tables
Virtualize rows (TanStack Virtual, react-window), memoize row components with stable props, use server-side pagination/sorting/filtering for large datasets, keep column definitions stable, avoid per-row heavy components, support keyboard/ARIA grid patterns, and use TanStack Table for headless logic.

### Q105. Forms at scale
Schema-driven forms (Zod/Yup) shared with the backend, React Hook Form for performance, field arrays, async validation with debouncing, optimistic submit states via Actions, dirty/touched tracking, accessible error messages (`aria-describedby`, error summary focus), and server-side validation as the source of truth.

### Q106. Memory leaks in React apps
Typical sources: subscriptions/WebSockets not closed, timers/intervals, event listeners on `window`/`document`, refs holding DOM nodes, closures capturing large objects, unbounded caches, third-party widgets not destroyed. Prevention: cleanup in effects (and `AbortController` for listeners), `WeakMap`, bound caches, and unmount third-party instances. Detect with the Memory panel (heap snapshots, detached DOM nodes).

### Q107. Migration strategies *(Scenario)*
- **Class → hooks:** convert leaf components first; keep HOCs via adapters; use codemods and tests.
- **CRA → Vite (or a framework):** replace scripts, env prefixes (`VITE_`), jest → vitest, aliases; migrate route by route if moving to Next.
- **React 17 → 18 → 19:** `createRoot`, automatic batching changes, StrictMode double effects, removal of legacy APIs (codemods from the React team), upgrade libraries first.
- **JS → TS:** gradual `allowJs`.
- **Client rendering → RSC:** start with new routes, move data fetching to the server gradually, keep client islands.
Use the strangler pattern, feature flags, and metrics/visual tests at each step.

### Q108. Shared packages and the "Invalid hook call" problem in monorepos
Make `react` and `react-dom` **peerDependencies** of shared libraries and ensure only **one copy** is installed (pnpm/yarn resolutions, bundler `resolve.dedupe`/`alias`). Two copies of React cause *"Invalid hook call"* because hooks use module-level state from the copy that rendered. Use workspace tooling (Nx, Turborepo) for build caching and affected-only builds.

### Q109. Micro-frontends with React
Options: Module Federation (shared singletons for `react`), single-spa, iframes, web components, or server-side composition. Issues: duplicate React/versions, CSS collisions, routing ownership, shared state, performance (multiple bundles). Define contracts (events, props), a shared design system, and independent deployments with fallbacks for failed remotes.

### Q110. Build tooling choices
**Vite** (fast dev, Rollup-based builds) is the default for SPAs. **webpack** remains for complex legacy setups. **Turbopack** (Next.js) and **Rspack** are faster alternatives. SWC/esbuild for transforms. Analyze bundles (visualizer), split chunks, use modern output, and keep dev/prod parity.

### Q111. Sharing code between web and React Native
Share business logic, hooks, state and types (monorepo); keep UI platform-specific, or use `react-native-web`/Solito/Expo Router to share more. Avoid assuming the DOM in shared hooks (no `window`/`document` in shared code without guards).

### Q112. Observability for React apps
Collect Core Web Vitals (`web-vitals`) with attribution, error rates per release (Sentry), custom performance marks for key user flows, React `<Profiler>` callbacks in staging, and session replay for debugging (with privacy controls). Tie metrics to releases and feature flags.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. How do you choose a React framework/rendering model? *(Decision)*
| Option | Strengths | Trade-offs |
|---|---|---|
| **Vite SPA** | Simple, fast dev, full client control | SEO/first-load need extra work |
| **Next.js (App Router)** | RSC, streaming, caching, ecosystem, deployment options | Complexity, framework coupling, caching rules |
| **React Router v7 (framework mode)/Remix** | Web-standards, loaders/actions, progressive enhancement | Smaller ecosystem than Next |
| **TanStack Start** | Type-safe routing/data | Newer |
| **Astro (React islands)** | Content sites, minimal JS | Not for highly interactive apps |
Decide using SEO needs, interactivity, team skills, hosting, data patterns, performance targets and longevity. Record the decision as an ADR.

### Q114. Plan an adoption of Server Components in an existing app
Start with a pilot route (content-heavy, read-mostly); keep a clear client/server boundary guideline; move data fetching to the server gradually; measure bundle size, LCP, INP and server cost; train the team on caching and security (Server Actions); keep fallbacks and feature flags; define lint rules and examples; avoid migrating everything at once.

### Q115. Standardizing state management across teams
Provide guidelines (not one tool for everything): server state with TanStack Query/loaders, URL state in the router, local state with hooks, and one small global store (Zustand/Redux Toolkit) for true cross-cutting client state. Offer templates, examples and code reviews; document anti-patterns (copying server data into global stores).

### Q116. Governance of a design system
Core team with contribution model (RFCs), semantic versioning and changelogs, deprecation timelines, accessibility and visual regression gates, usage analytics (which components are used), a migration tooling story (codemods), and support channels. Measure adoption and consistency.

### Q117. Performance and quality budgets
Define budgets for bundle size per route, Web Vitals (LCP/INP/CLS), render counts on critical paths, accessibility violations, and test coverage on critical flows. Enforce in CI (Lighthouse CI, size-limit, axe, Playwright). Review regularly and assign owners.

### Q118. Upgrade policy for React and dependencies
Track React releases, upgrade one major at a time using official codemods, upgrade libraries (router, state, UI kits) first, run on a canary branch with automated tests and visual checks, use feature flags for risky changes, and keep a deprecation backlog. Pin versions via lockfiles and use Renovate/Dependabot with grouped updates.

### Q119. Hiring and interviewing for React depth
Assess: rendering model (state, effects, keys, memoization), async/data-fetching reasoning, component design and accessibility, performance debugging, testing mindset, and communication. Use a practical exercise (build a small feature, review a buggy component) and a design discussion (state placement, data flow).

### Q120. Code review standards for React
Check: state placement, effect usage (needed? dependencies?), keys, accessibility, error/loading/empty states, memoization justified, naming and component size, tests for behavior, no secrets/unsafe HTML, and consistency with the design system. Provide examples in a team guide ("good/bad" snippets).

### Q121. Managing technical debt in a React codebase
Track debt (ADRs, labels), prioritize by risk and cost, allocate capacity (e.g., 15–20%), refactor near active work (boy-scout rule), remove dead code/dependencies, and measure outcomes (build time, bundle size, flaky tests, bug rate).

### Q122. Team topology and ownership
Feature teams own vertical slices (UI + data + tests); a platform/design-system team owns shared components, tooling and standards. Define ownership via CODEOWNERS, clear APIs between slices, and an escalation path for cross-cutting changes.

### Q123. Reliability and incident readiness
Error budgets, canary releases, feature flags/kill switches, source maps and release tagging, alerting on error rate and vitals per release, rollback plans, runbooks, and post-incident reviews with prevention actions.

### Q124. Measuring developer productivity and UI quality
Track lead time, build/test duration, flaky test rate, bundle size, Web Vitals, accessibility issues, bug escape rate, and design consistency (component adoption). Use them to guide investment, not to rank people.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Common React coding-round tasks. Practice each from memory. Mention edge cases (cleanup, keys, accessibility, error states).

### C1. Counter with step and reset
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <input type="number" value={step} onChange={(e) => setStep(Number(e.target.value) || 1)} aria-label="Step" />
      <button onClick={() => setCount((c) => c - step)}>-</button>
      <button onClick={() => setCount((c) => c + step)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### C2. Todo app with `useReducer` (add, toggle, delete, filter)
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case 'toggle': return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'delete': return state.filter((t) => t.id !== action.id);
    default: return state;
  }
}
function Todos() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const visible = todos.filter((t) => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; dispatch({ type: 'add', text: text.trim() }); setText(''); };
  return (
    <>
      <form onSubmit={submit}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task" /><button>Add</button></form>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All</option><option value="active">Active</option><option value="done">Done</option></select>
      <ul>{visible.map((t) => (
        <li key={t.id}>
          <label><input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} /> <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span></label>
          <button onClick={() => dispatch({ type: 'delete', id: t.id })} aria-label={`Delete ${t.text}`}>✕</button>
        </li>))}
      </ul>
    </>
  );
}
```

### C3. `useFetch` with loading, error, abort and refetch
```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ data: null, error, loading: false }); });
    return () => ctrl.abort();
  }, [url, tick]);
  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}
```
(Keep `options` out of the dependency list, or memoize them, otherwise a new object each render refetches in a loop.)

### C4. `useDebounce` and a debounced search box
```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id); }, [value, delay]);
  return debounced;
}
function SearchUsers() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 400);
  const { data, loading } = useFetch(debounced ? `/api/users?q=${encodeURIComponent(debounced)}` : '/api/users');
  return (<><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />{loading ? <p>Loading...</p> : <ul>{data?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>}</>);
}
```

### C5. `useLocalStorage`
```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw !== null ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ } }, [key, value]);
  return [value, setValue];
}
```
(For SSR, read storage in an effect or guard `typeof window`.)

### C6. `useInterval`, `usePrevious`, `useToggle`
```jsx
function useInterval(callback, delay) {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; }, [callback]);           // always call the latest callback
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
function usePrevious(value) { const ref = useRef(); useEffect(() => { ref.current = value; }); return ref.current; }
function useToggle(initial = false) { const [on, setOn] = useState(initial); return [on, useCallback(() => setOn((v) => !v), [])]; }
```

### C7. `useOnClickOutside` and a dropdown
```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (!ref.current || ref.current.contains(e.target)) return; handler(e); };
    document.addEventListener('pointerdown', listener);
    return () => document.removeEventListener('pointerdown', listener);
  }, [ref, handler]);
}
function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useOnClickOutside(ref, close);
  return (
    <div ref={ref}>
      <button aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>{label}</button>
      {open && <ul role="menu">{children}</ul>}
    </div>
  );
}
```

### C8. `useMediaQuery` with `useSyncExternalStore`
```jsx
function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(query); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); },
    () => window.matchMedia(query).matches,
    () => false
  );
}
const isMobile = useMediaQuery('(max-width: 600px)');
```

### C9. Modal with a portal, ESC key and focus return
```jsx
import { createPortal } from 'react-dom';
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>{children}<button onClick={onClose}>Close</button>
      </div>
    </div>, document.body);
}
```
(A full focus trap is needed for production; consider the native `<dialog>` element or a library such as Radix.)

### C10. Accordion (only one panel open)
```jsx
function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return items.map((it) => (
    <div key={it.id}>
      <h3><button aria-expanded={openId === it.id} aria-controls={`p-${it.id}`} onClick={() => setOpenId(openId === it.id ? null : it.id)}>{it.title}</button></h3>
      <div id={`p-${it.id}`} role="region" hidden={openId !== it.id}>{it.content}</div>
    </div>));
}
```

### C11. Tabs (compound, accessible)
```jsx
const TabsCtx = createContext(null);
function Tabs({ defaultValue, children }) { const [value, setValue] = useState(defaultValue); return <TabsCtx.Provider value={{ value, setValue }}>{children}</TabsCtx.Provider>; }
const TabList = ({ children }) => <div role="tablist">{children}</div>;
function Tab({ value, children }) {
  const c = useContext(TabsCtx); const selected = c.value === value;
  return <button role="tab" id={`tab-${value}`} aria-selected={selected} aria-controls={`panel-${value}`} tabIndex={selected ? 0 : -1} onClick={() => c.setValue(value)}>{children}</button>;
}
function TabPanel({ value, children }) {
  const c = useContext(TabsCtx);
  return c.value === value ? <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}>{children}</div> : null;
}
```

### C12. Autocomplete with keyboard navigation
```jsx
function Autocomplete({ options, onSelect }) {
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => options.filter((o) => o.toLowerCase().includes(text.toLowerCase())).slice(0, 8), [options, text]);
  const choose = (v) => { setText(v); setOpen(false); onSelect?.(v); };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && open && matches[active]) { e.preventDefault(); choose(matches[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };
  return (
    <div>
      <input role="combobox" aria-expanded={open} aria-controls="ac-list" aria-activedescendant={open ? `ac-${active}` : undefined}
             value={text} onChange={(e) => { setText(e.target.value); setOpen(true); setActive(0); }} onKeyDown={onKeyDown} />
      {open && matches.length > 0 && (
        <ul id="ac-list" role="listbox">
          {matches.map((m, i) => <li key={m} id={`ac-${i}`} role="option" aria-selected={i === active} onMouseDown={() => choose(m)}>{m}</li>)}
        </ul>)}
    </div>
  );
}
```

### C13. Pagination hook and component
```jsx
function usePagination(total, pageSize = 10) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(page, pages);
  return { page: clamped, pages, next: () => setPage(Math.min(clamped + 1, pages)), prev: () => setPage(Math.max(clamped - 1, 1)),
           range: [(clamped - 1) * pageSize, clamped * pageSize] };
}
```

### C14. Star rating
```jsx
function Stars({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);
  return (
    <div role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange(n)}>
          {n <= (hover || value) ? '★' : '☆'}
        </button>))}
    </div>
  );
}
```

### C15. Stopwatch
```jsx
function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - ms;
    const id = setInterval(() => setMs(Date.now() - start), 50);
    return () => clearInterval(id);
  }, [running]);                                         // ms intentionally omitted: it is read once when starting
  return (<><p>{(ms / 1000).toFixed(2)}s</p>
    <button onClick={() => setRunning((r) => !r)}>{running ? 'Stop' : 'Start'}</button>
    <button onClick={() => { setRunning(false); setMs(0); }}>Reset</button></>);
}
```
(The linter will warn about `ms`; to satisfy it, store the start time in a ref.)

### C16. Multi-step form
```jsx
function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', email: '', plan: 'free' });
  const update = (patch) => setData((d) => ({ ...d, ...patch }));
  const steps = [
    <Step1 key="1" data={data} update={update} />,
    <Step2 key="2" data={data} update={update} />,
    <Review key="3" data={data} />,
  ];
  return (<form onSubmit={(e) => { e.preventDefault(); if (step === steps.length - 1) submit(data); else setStep((s) => s + 1); }}>
    {steps[step]}
    <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
    <button>{step === steps.length - 1 ? 'Submit' : 'Next'}</button>
  </form>);
}
```
Keep all data in the parent so going Back does not lose input.

### C17. Toast system (context + reducer + auto dismiss)
```jsx
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback((message, ms = 3000) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => remove(id), ms);
  }, [remove]);
  const value = useMemo(() => ({ push }), [push]);
  return (<ToastCtx.Provider value={value}>{children}
    <div aria-live="polite" className="toasts">{toasts.map((t) => <div key={t.id} role="status">{t.message}</div>)}</div>
  </ToastCtx.Provider>);
}
const useToast = () => useContext(ToastCtx);
```

### C18. Infinite scroll with `IntersectionObserver`
```jsx
function useInfiniteScroll(loadMore, hasMore) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || !hasMore) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadMore(); }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, hasMore]);
  return ref;
}
// <ul>{items.map(...)}</ul><div ref={sentinelRef} />
```

### C19. Virtualized list (fixed row height)
```jsx
function VirtualList({ items, rowHeight = 40, height = 400, overscan = 5 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(items.length, Math.ceil((scrollTop + height) / rowHeight) + overscan);
  return (
    <div style={{ height, overflow: 'auto' }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * rowHeight, position: 'relative' }}>
        {items.slice(start, end).map((item, i) => (
          <div key={item.id} style={{ position: 'absolute', top: (start + i) * rowHeight, height: rowHeight }}>{item.name}</div>))}
      </div>
    </div>
  );
}
```

### C20. Image carousel
```jsx
function Carousel({ images }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((x) => (x + d + images.length) % images.length);
  return (<div role="region" aria-roledescription="carousel" aria-label="Photos">
    <img src={images[i].src} alt={images[i].alt} width="600" height="400" />
    <button onClick={() => go(-1)} aria-label="Previous">‹</button>
    <button onClick={() => go(1)} aria-label="Next">›</button>
    <span aria-live="polite">{i + 1} / {images.length}</span></div>);
}
```

### C21. Drag-and-drop reordering (HTML5)
```jsx
function SortableList({ initial }) {
  const [items, setItems] = useState(initial);
  const dragIndex = useRef(null);
  const onDrop = (to) => {
    const from = dragIndex.current; if (from === null || from === to) return;
    setItems((list) => { const next = [...list]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; });
    dragIndex.current = null;
  };
  return (<ul>{items.map((it, i) => (
    <li key={it.id} draggable onDragStart={() => (dragIndex.current = i)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(i)}>{it.text}</li>))}</ul>);
}
```
(For accessibility and touch support use dnd-kit.)

### C22. Tic-tac-toe
```jsx
function winner(sq) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b, c] of lines) if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
  return null;
}
function Game() {
  const [sq, setSq] = useState(Array(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const w = winner(sq);
  const play = (i) => { if (sq[i] || w) return; setSq((s) => s.map((v, k) => (k === i ? (xNext ? 'X' : 'O') : v))); setXNext((x) => !x); };
  return (<>
    <p>{w ? `Winner: ${w}` : sq.every(Boolean) ? 'Draw' : `Next: ${xNext ? 'X' : 'O'}`}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)' }}>{sq.map((v, i) => <button key={i} style={{ height: 60 }} onClick={() => play(i)}>{v}</button>)}</div>
    <button onClick={() => { setSq(Array(9).fill(null)); setXNext(true); }}>Restart</button></>);
}
```

### C23. Nested comments (recursion)
```jsx
function Comment({ node }) {
  return (<li>
    <p><strong>{node.author}</strong>: {node.text}</p>
    {node.replies?.length > 0 && <ul>{node.replies.map((r) => <Comment key={r.id} node={r} />)}</ul>}
  </li>);
}
```

### C24. File upload with image preview (and cleanup)
```jsx
function Upload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return setUrl(null);
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);             // free memory
  }, [file]);
  return (<><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />{url && <img src={url} alt="Preview" width="200" />}</>);
}
```

### C25. Theme provider with persistence and system preference
```jsx
const ThemeCtx = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme]);
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
```

### C26. Error boundary with retry
```jsx
import { ErrorBoundary } from 'react-error-boundary';
<ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
  <div role="alert"><p>Something went wrong: {error.message}</p><button onClick={resetErrorBoundary}>Try again</button></div>
)} onReset={() => queryClient.clear()}>
  <Dashboard />
</ErrorBoundary>
```

### C27. Optimistic "like" button (React 19)
```jsx
function LikeButton({ post, likeAction }) {
  const [optimistic, addOptimistic] = useOptimistic({ count: post.likes, liked: post.liked },
    (state, liked) => ({ liked, count: state.count + (liked ? 1 : -1) }));
  async function action() {
    addOptimistic(!optimistic.liked);                  // update UI immediately
    await likeAction(post.id, !optimistic.liked);      // real request (UI reverts automatically if it throws)
  }
  return <form action={action}><button>{optimistic.liked ? '♥' : '♡'} {optimistic.count}</button></form>;
}
```

### C28. `React.memo` + `useCallback` demonstration
```jsx
const Child = React.memo(function Child({ onSave }) { console.log('Child render'); return <button onClick={onSave}>Save</button>; });
function Parent() {
  const [n, setN] = useState(0);
  const onSave = useCallback(() => console.log('saved'), []);       // stable reference
  return (<><button onClick={() => setN(n + 1)}>Count {n}</button><Child onSave={onSave} /></>);
}
// Child renders once; without useCallback it would render on every Parent render.
```

### C29. A tiny store with `useSyncExternalStore`
```jsx
function createStore(initial) {
  let state = initial; const listeners = new Set();
  return {
    getState: () => state,
    setState: (patch) => { state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }; listeners.forEach((l) => l()); },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  };
}
const store = createStore({ count: 0 });
function useStore(selector = (s) => s) {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));   // selector must return a stable value
}
const count = useStore((s) => s.count);
```

### C30. A mini `useState` (how hooks work, interview favorite)
```js
let hooks = [], index = 0;
function useState(initial) {
  const i = index;                                  // each call gets a slot by call ORDER
  if (!(i in hooks)) hooks[i] = initial;
  const setState = (v) => { hooks[i] = typeof v === 'function' ? v(hooks[i]) : v; rerender(); };
  index++;
  return [hooks[i], setState];
}
function rerender() { index = 0; render(); }       // reset the pointer before every render
```
This explains the Rules of Hooks: hooks live in an ordered list, so the order must not change.

### C31. Polling hook that pauses when the tab is hidden
```jsx
function usePolling(fn, ms) {
  const saved = useRef(fn);
  useEffect(() => { saved.current = fn; }, [fn]);
  useEffect(() => {
    let id;
    const start = () => { id = setInterval(() => saved.current(), ms); };
    const onVis = () => { clearInterval(id); if (!document.hidden) { saved.current(); start(); } };
    start(); document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [ms]);
}
```

### C32. Form with React Hook Form and Zod
```jsx
const schema = z.object({ email: z.string().email(), age: z.coerce.number().min(18) });
function SignUp() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={handleSubmit(async (values) => { await api.signUp(values); })}>
      <label>Email <input {...register('email')} aria-invalid={!!errors.email} /></label>{errors.email && <p role="alert">{errors.email.message}</p>}
      <label>Age <input type="number" {...register('age')} /></label>{errors.age && <p role="alert">{errors.age.message}</p>}
      <button disabled={isSubmitting}>Sign up</button>
    </form>
  );
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. "Too many re-renders. React limits the number of renders to prevent an infinite loop."
You set state during render, often by calling the setter immediately: `onClick={setOpen(true)}` or `setCount(c + 1)` in the component body. Fix: `onClick={() => setOpen(true)}`; move updates to handlers or effects with correct dependencies.

### D2. The effect runs in an infinite loop
The effect updates state that is also in its dependency list, or a dependency is a new object/array/function every render.
```jsx
useEffect(() => { setData(items.map(f)); }, [items]);            // items is a new array each render => loop
```
Fix: compute during render (`useMemo`), memoize the dependency in the parent, or depend on primitive values.

### D3. State is not updated right after `setState`
State updates are applied on the next render. `console.log(count)` right after `setCount(count + 1)` shows the old value. Use the next render, an effect, or compute the new value first (`const next = count + 1; setCount(next); use(next)`).

### D4. State shows an old value inside a timer or async callback (stale closure)
The callback captured an old render. Use functional updates (`setC((c) => c + 1)`), a ref to the latest value, or correct dependencies.

### D5. "Each child in a list should have a unique key"
Add a stable unique `key` to the top element returned inside `map`. A `key` on a nested element (not the outermost) does not fix it. Fragments in lists need `<Fragment key=...>`.

### D6. Input loses focus after every keystroke
The component is **defined inside another component** (new component type each render) or the `key` changes every render (`Math.random()`). Define components at module level and use stable keys.

### D7. List state gets mixed up after reordering or deleting
Using array **index as key**. State of inputs stays with the position, not the item. Use unique IDs.

### D8. Effect runs twice in development
`StrictMode` mounts, unmounts and mounts again to reveal missing cleanup. It does not happen in production. Fix the cleanup (abort fetches, remove listeners); do not remove StrictMode.

### D9. "Cannot update a component (`A`) while rendering a different component (`B`)"
`B` calls a setter of `A`'s state during render (often via a callback prop invoked in the body). Move the update to an event handler or an effect.

### D10. Hydration error: "Text content does not match server-rendered HTML"
The first client render differs from the server HTML (time, random values, `window`, locale, invalid HTML nesting). Render the same output on first render and update in an effect, or use `suppressHydrationWarning` for unavoidable text mismatch.

### D11. "Invalid hook call"
Causes: calling hooks inside conditions/loops/regular functions, class components, **two copies of React** (monorepo/linked packages), mismatched `react` and `react-dom` versions. Check with `npm ls react`, dedupe, and make React a peer dependency.

### D12. "Objects are not valid as a React child"
You rendered an object (or a Promise). Render a string/number/element: `{user.name}` not `{user}`. For dates use `date.toLocaleDateString()`.

### D13. `onClick` runs immediately on render
You wrote `onClick={handle()}`. Use `onClick={handle}` or `onClick={() => handle(id)}`.

### D14. A controlled input does not change
`value` is set but there is no `onChange`, or `onChange` does not update state. React shows a warning and makes the input read-only. Add `onChange` or use `defaultValue`.

### D15. Warning: "changing an uncontrolled input to be controlled"
The `value` started as `undefined` then became defined. Initialize state with `''` (or `0`).

### D16. `ref.current` is null
You read the ref before the element is mounted (during render), the element is conditionally rendered, or the ref is attached to a component that does not forward it. Read refs in effects/handlers; use `forwardRef` (React 18) or the `ref` prop (React 19).

### D17. A child does not update when props change (derived state)
The child copied props into state with `useState(props.value)`. Use the prop directly, or reset with `key`, or sync intentionally with a controlled pattern.

### D18. `React.memo` does not prevent re-renders
Props change every render: inline objects/arrays/functions, or children JSX. Memoize them (`useMemo`, `useCallback`) or restructure. Also check that context changes are not the cause.

### D19. Context consumers re-render too often
The provider's `value` is a new object each render, or the value changes frequently. Memoize the value, split contexts, or use a selector-based store.

### D20. Async function passed to `useEffect` shows a warning
`useEffect(async () => ...)` returns a promise, but effects must return a cleanup function or nothing. Define an inner async function and call it.

### D21. Race condition: old search results overwrite new ones
Add `AbortController`/an `ignore` flag in the effect cleanup, or use TanStack Query.

### D22. Suspense keeps showing the fallback forever
A new promise is created on every render (so it never resolves in the same render). Create the promise outside the render (cache, loader, server) and pass it down.

### D23. Page flickers on route change
Suspense fallback replaces the old UI. Wrap navigation in `startTransition` so the old UI stays until the new one is ready.

### D24. "Cannot read properties of undefined (reading 'map')"
Data is not loaded yet. Provide a default (`const { items = [] } = data ?? {}`), render a loading state, or guard with optional chaining.

### D25. Slow typing in an input with a big list
Every keystroke re-renders the heavy list. Move the input state into a small component, use `useDeferredValue`/`useTransition`, memoize the list, or virtualize it.

### D26. `process is not defined` / `import.meta.env` is undefined
Tooling difference: Vite uses `import.meta.env.VITE_*`; CRA/webpack used `process.env.REACT_APP_*`; Next uses `process.env.NEXT_PUBLIC_*`. Update the access pattern and restart the dev server after changing env files.

### D27. Refreshing a deep link gives 404 in production
The server does not return `index.html` for unknown routes. Configure a fallback rewrite (Nginx `try_files`, Netlify `_redirects`, Vercel rewrites).

### D28. Debugging method (say this in interviews)
Reproduce → read the exact warning/error and stack → use React DevTools (props, state, why it rendered) → add logging in render/effect carefully → check the rules (keys, hooks, purity, dependencies) → fix the root cause → add a test or lint rule to prevent it.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Why does calling `setCount(count + 1)` three times only add 1?
All three calls use the **same `count`** from the current render (a snapshot), so each sets the state to `count + 1`. React batches them and the result is +1. Use the functional form: `setCount((c) => c + 1)` three times adds 3.

### T2. Why does `console.log(count)` after `setCount` show the old value?
`setCount` does not change the variable `count` in the running function; it schedules a new render with a new value. The new value is visible in the next render.

### T3. Is the argument of `useState(initial)` used on every render?
No. It is used only on the first render; later renders ignore it. But the **expression is still evaluated** each render: `useState(expensive())` calls `expensive()` every time. Use `useState(() => expensive())` to run it once.

### T4. In what order do effects run for parent and child?
Render order: **parent render → child render**. Effects (and layout effects) run **child first, then parent** (children are committed before parents). On updates, all cleanups run before the new effects.
```jsx
// Mount logs: Parent render, Child render, Child effect, Parent effect
```

### T5. Does React preserve state when the same component type appears at the same position?
Yes, even if props differ.
```jsx
{isA ? <Counter name="A" /> : <Counter name="B" />}      // same type + same position → state is preserved when toggling
{isA ? <Counter key="A" /> : <Counter key="B" />}        // different keys → state resets
```
A different type or a different position (or key) destroys the old state.

### T6. Why does `{count && <Badge />}` show `0`?
`0 && x` evaluates to `0`, and React renders numbers. Use `{count > 0 && <Badge />}` or a ternary.

### T7. Why does `React.memo` not help when I pass an object or function prop?
`{}`, `[]` and `() => {}` created inline are **new references every render**, so the shallow comparison fails. Stabilize them with `useMemo`/`useCallback` or move them outside the component.

### T8. Is `useMemo` a guarantee that the value is cached?
No. It is a performance hint. React may discard cached values (for example, to free memory) and recompute. Do not rely on it for correctness (no side effects, no "run once" logic).

### T9. Why does changing `useRef().current` not update the UI?
Refs are mutable boxes outside the render cycle. Changing them does not trigger a render. Use state for values that affect the output.

### T10. What does StrictMode double-call in development?
Component bodies (render), state updater functions, reducers, `useState`/`useMemo`/`useReducer` initializer functions, and it also runs effects as mount → cleanup → mount. This is to expose impure code. Nothing extra happens in production.

### T11. Does `setState(sameValue)` skip rendering?
React bails out when the new value is `Object.is` equal to the current one, without rendering children or firing effects. It may still call the component function **once more** before bailing out.

### T12. Does the effect cleanup only run on unmount?
No. It runs **before every re-run** of the effect (when dependencies change) and on unmount.
```jsx
useEffect(() => { console.log('effect', n); return () => console.log('cleanup', n); }, [n]);
// n: 0 → 1 logs: cleanup 0, effect 1
```

### T13. What is the context default value for?
Only used when there is **no matching Provider above** the consumer. It is not the initial state of a provider.

### T14. What happens if an input's `value` is `undefined` and later defined?
React treats `undefined` as **uncontrolled**, then as controlled, and warns. Always initialize with `''`/`0`/`false`.

### T15. `onChange` in React vs the native `change` event
React's `onChange` for inputs fires on **every input** (like native `input`), not on blur. Native `change` fires on blur/commit.

### T16. `e.target` vs `e.currentTarget`
`target` is where the event originated (can be a child); `currentTarget` is the element the handler is attached to. Event pooling (older React) was removed, so reading `e` asynchronously works now.

### T17. Is the order of state updates and rendering synchronous after `await`?
In React 18 updates after `await` are still batched (automatic batching), and the render happens after the current JavaScript task finishes. Use `flushSync(() => setX(1))` only if you need the DOM updated immediately.

### T18. Why does a list need a key on a Fragment?
`<>...</>` cannot take a key. Use `<React.Fragment key={id}>...</React.Fragment>` inside `map`.

### T19. Why is `dangerouslySetInnerHTML` dangerous?
It inserts raw HTML, bypassing React's escaping. If the HTML contains user input, you get XSS. Sanitize (DOMPurify) or avoid it.

### T20. Attribute differences from HTML
`class` → `className`, `for` → `htmlFor`, `tabindex` → `tabIndex`, `onclick` → `onClick`, `style` is an object with camelCase keys, `readonly` → `readOnly`, `maxlength` → `maxLength`, `checked` → `defaultChecked` (uncontrolled). Boolean attributes: `disabled={false}` removes the attribute.

### T21. Why define components outside other components?
A component defined inside another is a **new function every render**, so React sees a new component type, unmounts the old subtree and mounts a new one (state and focus are lost, performance suffers).

### T22. Why can effects with no dependency array cause infinite loops?
`useEffect(() => { setX(x + 1); })` runs after every render, sets state, causes a render, runs again... Add a dependency array or condition.

### T23. Are props mutable?
Props are read-only. Mutating a prop object (e.g., `props.user.name = 'x'`) changes data owned by the parent, breaks purity and causes missed updates.

### T24. `React.lazy` requirements
It expects a module with a **default export** that is a component, and must be rendered inside a `<Suspense>` boundary. For named exports, re-export as default: `lazy(() => import('./X').then(m => ({ default: m.X })))`.

### T25. Updating a parent's state from a child during render
Calling a parent setter while rendering a child triggers: "Cannot update a component while rendering a different component". Do it in an event handler or effect.

### T26. Why does a `key` on a non-outer element not fix the list warning?
React reads the key on the **element returned directly by `map`** (the array item), not on its descendants.

### T27. HOC gotchas
HOCs do not forward refs automatically, do not hoist static properties unless you use `hoist-non-react-statics`, and wrap props (name collisions). Do not create HOCs inside render.

### T28. Is a Server Component the same as SSR?
No. SSR renders Client Components to HTML on the server and then **hydrates** them in the browser (their JS is sent). Server Components render on the server and send **no JS** for themselves (their output is a serialized payload). A Next.js page can use both.

### T29. Can a Client Component import a Server Component?
No. A client file cannot import a Server Component (it would become client code). But a Client Component can **receive** a Server Component as `children` or a prop from a parent Server Component.

### T30. `useEffect` vs `useLayoutEffect` timing
`useLayoutEffect` runs after DOM mutations but **before paint** (blocks painting); `useEffect` runs **after paint**. Use layout effects for measuring DOM and avoiding flicker.

### T31. Does React re-render all children when a parent re-renders?
Yes, by default, unless the child is wrapped in `memo` (and its props are stable) or is passed down as `children`/props from a component that did not re-render (the element object is identical, so React skips it).

### T32. Why can `key={Math.random()}` hurt?
A new key every render forces React to unmount and remount the element each time: state is lost, DOM is recreated, performance drops.

### T33. `state` that holds a function
`setFn(() => myFunction)` is required to store a function in state because `setFn(myFunction)` would call it as a functional updater.

### T34. Does `useCallback` prevent the function from being created?
No. The inline function is still created each render; `useCallback` returns the **previous** reference when dependencies are equal. The benefit is only stable identity.

### T35. Do state updates inside `useEffect` always cause an extra render?
Yes. Setting state in an effect after render leads to a second render. If the state can be derived during render, compute it there instead.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| React is a... | UI library |
| Created by? | Meta (Facebook) |
| JSX stands for? | JavaScript XML (syntax extension) |
| Component names start with? | Capital letter |
| Props are... | Read-only inputs |
| State is... | Component-owned data that triggers re-render |
| Hook to add state? | `useState` |
| Hook for side effects? | `useEffect` |
| Hook for DOM refs / mutable box? | `useRef` |
| Hook for global-ish values? | `useContext` |
| Hook for complex state? | `useReducer` |
| Hook for caching a value? | `useMemo` |
| Hook for caching a function? | `useCallback` |
| Skip re-render if props are equal? | `React.memo` |
| Lazy-load a component? | `React.lazy` + `Suspense` |
| Catch render errors? | Error boundary |
| Render outside parent DOM? | Portal (`createPortal`) |
| Unique id for accessibility? | `useId` |
| Non-urgent update? | `startTransition` / `useTransition` |
| Lagging value? | `useDeferredValue` |
| Subscribe to external store? | `useSyncExternalStore` |
| Read promise/context in render? | `use` (React 19) |
| Form action state (19)? | `useActionState` |
| Optimistic UI (19)? | `useOptimistic` |
| Form pending status (19)? | `useFormStatus` |
| Key purpose? | Identity of list items |
| Don't use as key? | Array index (for dynamic lists), random values |
| Create a project? | Vite or a framework (CRA is deprecated) |
| Server rendering framework? | Next.js, React Router framework mode |
| State library for server data? | TanStack Query / SWR |
| Testing library? | React Testing Library |
| Event system? | Synthetic events with delegation at the root |
| Data direction? | One-way (down via props) |
| Strict development checks? | `<StrictMode>` |
| Profiling tool? | React DevTools Profiler |
| Automatic memoization? | React Compiler |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a performance problem you fixed in a React app."
**Sample answer (STAR):**
- **S:** A dashboard table with 5,000 rows lagged on every keystroke in the filter box (INP ~600 ms).
- **T:** Make typing feel instant (< 200 ms).
- **A:** Profiled with the React Profiler and found the whole table re-rendering. I moved the input state into its own component, debounced the filter, virtualized the rows with TanStack Virtual, memoized the row component with stable props, and used `useDeferredValue` for the filtered list.
- **R:** INP went from ~600 ms to ~120 ms, render time per keystroke dropped from 450 ms to 20 ms, and the main bundle did not grow.
Tip: show the method: profile → find cause → fix → measure.

### P2. "Describe a complex state management decision you made."
Explain what lived where: server state in TanStack Query, URL state in search params, form state in React Hook Form, and a tiny global store for cart/auth. Mention what you removed (a huge Redux store that duplicated server data) and the result (less code, fewer bugs, faster).

### P3. "How did you handle a legacy class-component codebase?"
Strangler approach: new code in hooks, convert leaf components first, wrap shared logic into custom hooks, add tests before refactoring, use codemods for repetitive changes, and track progress. Mention how you handled lifecycle edge cases and error boundaries (which still need classes).

### P4. "Tell me about a bug caused by a stale closure or effect dependencies."
Example: an interval callback read an old `userId` and posted analytics for the wrong user. Fix: functional state updates or a ref to the latest value and correct dependencies; added the `exhaustive-deps` lint rule as an error and a unit test with fake timers.

### P5. "How do you review React pull requests?"
Check effects (are they needed? cleanup? deps?), state placement, key usage, accessibility, loading/error/empty states, memoization justified by profiling, naming and component size, tests for behavior, and security (HTML injection).

### P6. "How did you improve accessibility in a React app?"
Replaced clickable `div`s with `button`s, added labels and `aria-describedby` for errors, managed focus in modals and route changes, ran axe in CI and jsx-a11y lint, trained the team, and built accessible primitives (Radix) into the design system.

### P7. "Have you used Server Components / Next.js App Router in production?"
Prepare a real story: what moved to the server (data fetching, heavy libraries), measured bundle/LCP improvement, problems faced (caching confusion, client/server boundary mistakes, Server Action security), and your guidelines.

### P8. "How do you decide when to use `useMemo`/`useCallback`?"
Measure first. Use them for expensive calculations, stable props to memoized children, and stable effect dependencies. Otherwise avoid the noise. Mention the React Compiler as an automatic alternative.

---

# 📚 Part 11: Complete Coverage (Classic + Ecosystem + Patterns)

## 11A. Classic React Questions

### K1. Virtual DOM vs Real DOM vs Shadow DOM
- **Real DOM:** the browser's actual tree; changes are expensive.
- **Virtual DOM:** React's lightweight JS representation; diffed to minimize real DOM updates.
- **Shadow DOM:** a browser feature that encapsulates a component's DOM and styles (Web Components). Unrelated to React's virtual DOM.

### K2. React element vs component
An **element** is a plain object describing what to render (`{ type: 'div', props: {...} }`). A **component** is a function/class that returns elements. `<Button />` creates an element whose `type` is the `Button` function.

### K3. Pure components and `PureComponent`
A class `PureComponent` implements `shouldComponentUpdate` with a **shallow** comparison of props and state. `React.memo` is the function-component equivalent (for props only).

### K4. Class lifecycle methods in order *(frequently asked)*
- **Mounting:** `constructor` → `static getDerivedStateFromProps` → `render` → `componentDidMount`
- **Updating:** `getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` → `componentDidUpdate`
- **Unmounting:** `componentWillUnmount`
- **Errors:** `static getDerivedStateFromError`, `componentDidCatch`
- Legacy (`UNSAFE_`): `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`.

### K5. Refs: object refs, callback refs, forwarding
```jsx
const ref = useRef(null);                                  // object ref
<input ref={(node) => { /* node or null */ }} />            // callback ref (React 19 allows a cleanup function return)
const FancyInput = forwardRef((props, ref) => <input ref={ref} {...props} />);  // React 18
```

### K6. `React.cloneElement` and `React.Children`
`cloneElement(el, extraProps)` copies an element with new props (used by some older compound component patterns). It is fragile; prefer context or explicit props.

### K7. What is Redux and its principles?
A predictable state container: single store, state is read-only (change by dispatching **actions**), changes are made by pure **reducers**. Redux Toolkit is the modern way (slices, Immer, RTK Query).
```js
const counter = createSlice({ name: 'counter', initialState: { value: 0 },
  reducers: { inc: (s) => { s.value += 1; }, add: (s, a) => { s.value += a.payload; } } });
export const { inc, add } = counter.actions;
const store = configureStore({ reducer: { counter: counter.reducer } });
const value = useSelector((s) => s.counter.value); const dispatch = useDispatch();
```

### K8. Zustand (simple global state)
```js
const useCart = create((set) => ({ items: [], add: (i) => set((s) => ({ items: [...s.items, i] })), clear: () => set({ items: [] }) }));
const items = useCart((s) => s.items);                      // selector: only re-render when items change
```

### K9. Flux vs MVC
Flux enforces **unidirectional** data flow: Action → Dispatcher → Store → View. MVC often has bidirectional updates that become hard to trace.

### K10. What is `React.PureComponent` vs `shouldComponentUpdate`?
`PureComponent` automatically does the shallow comparison. Mutating props/state objects defeats it (the reference does not change), so always create new objects.

### K11. Difference between `createElement` and `cloneElement`
`createElement` makes a new element from a type; `cloneElement` copies an existing element and overrides props/key/ref.

### K12. Why can't browsers read JSX?
JSX is not valid JavaScript. A compiler (Babel/SWC/esbuild/TypeScript) transforms it into regular function calls before it runs in the browser.

### K13. What are keys vs refs vs props?
`key` and `ref` are special: they are **not** passed as regular props (in React 18). In React 19, `ref` is a normal prop for function components; `key` is still special.

### K14. Describe React's "unidirectional data flow" benefits
Predictable updates, easier debugging, simpler mental model, and safer state management.

### K15. Controlled components with select, checkbox, radio, textarea
```jsx
<select value={color} onChange={(e) => setColor(e.target.value)}>...</select>
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
<input type="radio" value="a" checked={choice === 'a'} onChange={(e) => setChoice(e.target.value)} />
<textarea value={text} onChange={(e) => setText(e.target.value)} />
```

## 11B. Ecosystem Map (what to know)

| Area | Common choices |
|---|---|
| Build / dev | Vite, Next.js, React Router, Turbopack, webpack |
| Routing | React Router, TanStack Router, Next routing |
| Server state | TanStack Query, SWR, RTK Query, framework loaders |
| Client state | Zustand, Redux Toolkit, Jotai, MobX, Context |
| Forms | React Hook Form, Formik, Actions (React 19) |
| Validation | Zod, Valibot, Yup |
| Styling | Tailwind, CSS Modules, styled-components, vanilla-extract |
| Components | shadcn/ui (Radix), MUI, Chakra, Ant Design, React Aria |
| Tables | TanStack Table |
| Virtualization | TanStack Virtual, react-window |
| Animation | Motion (Framer Motion), React Spring, CSS |
| Charts | Recharts, Visx, ECharts |
| Testing | Vitest/Jest, React Testing Library, Playwright, Cypress, MSW |
| Docs/UI dev | Storybook |
| Tooling | ESLint (react-hooks, jsx-a11y), Prettier, TypeScript, React Compiler |

## 11C. Patterns in Practice

### P-1. React Router with a loader (data router)
```jsx
const router = createBrowserRouter([
  { path: '/', element: <Layout />, errorElement: <ErrorPage />, children: [
    { index: true, element: <Home /> },
    { path: 'users/:id', loader: ({ params }) => fetchUser(params.id), element: <User /> },
  ] },
]);
function User() { const user = useLoaderData(); return <h1>{user.name}</h1>; }
<RouterProvider router={router} />
```

### P-2. Protected route
```jsx
function RequireAuth({ children }) {
  const { user } = useAuth(); const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
```

### P-3. Wrap a non-React library (chart/map) safely
```jsx
function Chart({ data }) {
  const el = useRef(null);
  useEffect(() => {
    const chart = new ThirdPartyChart(el.current, { data });      // create
    return () => chart.destroy();                                 // cleanup avoids leaks
  }, [data]);
  return <div ref={el} />;
}
```

### P-4. IntersectionObserver hook
```jsx
function useInView(options) {
  const ref = useRef(null); const [inView, setInView] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), options); ref.current && io.observe(ref.current); return () => io.disconnect(); }, []);
  return [ref, inView];
}
```

### P-5. Context + reducer for auth
```jsx
const AuthCtx = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = useCallback(async (creds) => setUser(await api.login(creds)), []);
  const logout = useCallback(() => { api.logout(); setUser(null); }, []);
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
```

### P-6. Web Components in React 19
React 19 supports custom elements: properties are set as properties when they exist on the element, and custom events can be handled with `onMyevent`-style props. Use refs for complex integrations in older versions.

### P-7. Animations
Use CSS transitions with state-driven class changes for simple cases; Motion (Framer Motion) for layout animations and gestures; animate `transform`/`opacity`; respect `prefers-reduced-motion`.

---

# 🧠 Part 12: React Internals

### B1. What is Fiber?
Fiber is React's reconciliation engine (since React 16). Each element in the tree has a **fiber node**: a JS object holding its type, props, state, links to parent/child/sibling (a linked list structure), effects, and priority information. The linked structure lets React **pause, resume and prioritize** work instead of recursing through the whole tree in one go.

### B2. Double buffering: `current` and `workInProgress` trees
React keeps the **current** tree (what is on screen) and builds a **work-in-progress** tree during render. When rendering finishes, React swaps the pointer so the work-in-progress becomes current (commit). If a render is interrupted or discarded, the current tree is untouched.

### B3. Lanes and priorities
Updates have priorities (lanes): discrete events (clicks, typing) are highest, transitions are lower, idle work is lowest. Urgent updates can **interrupt** transition renders. This is how `useTransition` keeps typing responsive.

### B4. The scheduler and time slicing
React uses a scheduler (based on `MessageChannel`) to run render work in small slices (about 5 ms) and yield to the browser for input and painting. Concurrent rendering makes this possible for transitions; synchronous (discrete) updates still run to completion.

### B5. How hooks are stored
Each fiber has a **linked list of hook objects** (in call order). `useState` reads the node at the current position in the list. That is why hooks cannot be called conditionally: the order must match between renders.

### B6. The reconciliation algorithm (diffing)
React compares trees with O(n) heuristics: (1) different types → replace the subtree; (2) same type → update props and recurse; (3) children lists are matched by **key** (then by index if no key). It does not try to detect moved subtrees across different parents.

### B7. Commit phase sub-steps
(1) **Before mutation** (e.g., `getSnapshotBeforeUpdate`), (2) **Mutation** (apply DOM changes; run layout effect cleanups), (3) **Layout** (run `useLayoutEffect`/`componentDidMount`; attach refs), then the browser paints, and (4) **Passive effects** (`useEffect`) run asynchronously after paint (or synchronously before the next render for discrete events).

### B8. Batching internals
Updates inside an event/task are queued on the fiber with a lane; React processes them together in one render. In React 18, `createRoot` enables automatic batching everywhere. `flushSync` forces an immediate flush.

### B9. How Suspense works
A component that is not ready **throws a promise** (libraries/framework do this; `use` formalizes it). React catches it at the nearest `Suspense`, shows the fallback, and re-renders when the promise resolves. For transitions, React keeps the old UI instead of showing the fallback.

### B10. Error boundaries mechanism
When a render throws, React unwinds to the nearest error boundary (class with `getDerivedStateFromError`/`componentDidCatch`), renders its fallback, and keeps the rest of the app alive.

### B11. Context propagation
When a Provider's value changes (by `Object.is`), React walks the subtree below it and marks consumers (components that called `useContext`) for re-render, even if intermediate components bailed out via `memo`.

### B12. Bailouts: when does React skip rendering a component?
A fiber bails out if: its props are identical (same element reference, e.g., from stable `children`), no pending state/context updates, and (for `memo`) props are shallow-equal. React also has an **eager state** check for `setState` with the same value.

### B13. Hydration internals
`hydrateRoot` walks the server DOM and the React tree together, attaching listeners and refs without recreating nodes. On mismatch it logs an error and may fall back to client rendering for that boundary. With Suspense boundaries, React can hydrate parts independently (selective hydration) and prioritize parts the user interacts with.

### B14. Server Components wire format
Server Components render to a serialized tree (the "RSC payload"/Flight format) describing elements, references to Client Components (module IDs + props), and Suspense boundaries. The client merges this payload into the React tree; client component code is loaded separately by the bundler.

### B15. Event system internals
React attaches one listener per event type on the root container and uses the event target's fiber to dispatch to the right component handlers (with capture and bubble phases simulated). `SyntheticEvent` wraps the native event.

### B16. StrictMode implementation
In development React deliberately calls render functions, initializers and reducers twice, and simulates unmount/remount of effects, to detect impurities. It also surfaces deprecated API usage.

### B17. React Compiler idea
It analyzes component code (data flow, mutations) at build time and inserts memoization automatically, so values and JSX are reused when inputs are unchanged. It relies on the Rules of React (purity, no mutation of props/state during render).

### B18. Why are keys not passed as props?
`key` is metadata for the reconciler (identity); the component should not depend on it. If you need the value, pass it as a separate prop (`id`).

### B19. Profiler data
The Profiler records each commit with component render durations (actual vs base duration) and "why did this render" reasons (props, state, hooks, parent). The `<Profiler onRender>` API gives the same data in code.

### B20. Rendering vs painting
"Render" in React means calling your components to produce elements. It does not mean painting pixels. A render does not necessarily change the DOM; React compares and commits only differences, and then the browser performs layout and paint.

---

# 📋 Part 13: Reference Tables

### R1. Hooks overview
| Hook | Purpose |
|---|---|
| `useState` | Local state |
| `useReducer` | State with reducer logic |
| `useEffect` | Side effects after render |
| `useLayoutEffect` | Sync effects before paint |
| `useInsertionEffect` | Inject styles (library use) |
| `useRef` | Mutable ref / DOM node |
| `useImperativeHandle` | Customize exposed ref |
| `useContext` | Read context |
| `useMemo` | Cache a value |
| `useCallback` | Cache a function |
| `useTransition` | Mark updates non-urgent |
| `useDeferredValue` | Defer a value |
| `useId` | Unique accessible ids |
| `useSyncExternalStore` | Subscribe to external store |
| `useDebugValue` | DevTools label |
| `use` (19) | Read promise/context in render |
| `useActionState` (19) | State for form actions |
| `useFormStatus` (19) | Pending state of parent form |
| `useOptimistic` (19) | Optimistic UI state |
| `useEffectEvent` (19.2+) | Effect callbacks that read latest values |

### R2. Class vs function components
| | Class | Function + hooks |
|---|---|---|
| State | `this.state`, `setState` | `useState` |
| Lifecycle | Methods | `useEffect` |
| Reuse logic | HOC / render props | Custom hooks |
| `this` binding issues | Yes | No |
| Error boundary | ✅ | ❌ (need class or library) |

### R3. JSX vs HTML attribute names
`class → className`, `for → htmlFor`, `tabindex → tabIndex`, `readonly → readOnly`, `maxlength → maxLength`, `colspan → colSpan`, `onclick → onClick`, `style="color:red" → style={{ color: 'red' }}`, `<input value> → defaultValue (uncontrolled)`, `autofocus → autoFocus`.

### R4. React 18 vs React 19 (highlights)
| React 18 | React 19 |
|---|---|
| `createRoot`, automatic batching, transitions, Suspense on server | Actions, `useActionState`, `useOptimistic`, `use` |
| `forwardRef` needed | `ref` is a prop |
| `<Ctx.Provider>` | `<Ctx>` directly |
| Metadata via libraries (Helmet) | `<title>`, `<meta>`, `<link>` hoisted from components |
| `propTypes`, `defaultProps` | Removed for function components |
| `ReactDOM.render` removed in 18 for new root API | Legacy APIs removed |

### R5. What triggers a re-render?
State setter with a new value · parent re-render · context value change · `useSyncExternalStore` store change · `forceUpdate`/`key` change (class `forceUpdate`). Props changing alone is a symptom of the parent re-rendering.

### R6. State placement decision
Local UI → `useState` · shared by siblings → lift up · many consumers, rarely changes → Context · complex client state → Zustand/Redux · server data → TanStack Query · URL-shareable → router params · form → React Hook Form.

### R7. React Testing Library query priority
`getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByDisplayValue` > `getByAltText` > `getByTitle` > `getByTestId`. Use `findBy*` for async, `queryBy*` to assert absence.

### R8. Rules of React (summary)
Components and hooks must be **pure**; props and state are **immutable**; call hooks at the top level; do not call component functions directly; side effects belong in handlers/effects; do not mutate values after passing them to JSX.

### R9. Common warnings and meanings
| Warning | Meaning |
|---|---|
| Unique "key" prop | Missing/unstable keys in a list |
| Cannot update a component while rendering a different component | Setter called during another component's render |
| Can't perform a state update on an unmounted component | Old warning (removed in 18): async update after unmount |
| Each hook call must be in the same order | Conditional hooks |
| Text content did not match | Hydration mismatch |
| Invalid hook call | Hook outside component or duplicate React |
| A component is changing an uncontrolled input to be controlled | `value` changed from `undefined` |

### R10. Performance tools
React DevTools Profiler · browser Performance panel · `why-did-you-render` · `<Profiler>` API · Lighthouse/Web Vitals · bundle analyzers · React Compiler playground/health checks.

### R11. Rendering strategies with React
| Strategy | Notes |
|---|---|
| CSR (Vite SPA) | Simple; slow first paint, SEO needs extra work |
| SSR | HTML on request; hydration cost |
| SSG / ISR | Pre-render at build / revalidate; fast via CDN |
| Streaming SSR + Suspense | Progressive HTML, selective hydration |
| RSC | Less client JS, server-side data access |

### R12. Data fetching options
`fetch` in effects (basic) · TanStack Query / SWR (cache, retries) · framework loaders (React Router, Remix, Next) · Server Components (`await` in components) · `use(promise)` with Suspense.


---

# 🧩 Part 14: Output-Based Questions

> React output questions test your understanding of **renders, snapshots, batching and effects**. Give the answer **and** the reason.

### O1. What does the button show after one click?
```jsx
function App() {
  const [count, setCount] = useState(0);
  const handle = () => { setCount(count + 1); setCount(count + 1); setCount(count + 1); };
  return <button onClick={handle}>{count}</button>;
}
```
**Answer:** `1`. All three calls use the same `count` (0) from this render. With `setCount((c) => c + 1)` three times, the result would be `3`.

### O2. What is the log order on first mount?
```jsx
function Parent() {
  console.log('Parent render');
  useEffect(() => { console.log('Parent effect'); }, []);
  return <Child />;
}
function Child() {
  console.log('Child render');
  useEffect(() => { console.log('Child effect'); }, []);
  return null;
}
```
**Answer (production):** `Parent render`, `Child render`, `Child effect`, `Parent effect`. Render goes top-down, effects run bottom-up (children first).
**In development with StrictMode:** each component function runs twice (Parent twice, then Child twice; the second logs may appear dimmed), and then effects run, are cleaned up, and run again: `Child effect`, `Parent effect`, `Child effect`, `Parent effect`.

### O3. Cleanup order when a dependency changes
```jsx
useEffect(() => {
  console.log('effect', n);
  return () => console.log('cleanup', n);
}, [n]);
```
**Answer:** When `n` changes from 0 to 1: first `cleanup 0`, then `effect 1`. (On mount, only `effect 0`.) The cleanup uses the **old** `n` (closure from the previous render).

### O4. What does the timeout log?
```jsx
const [c, setC] = useState(0);
const handle = () => { setC(c + 1); setTimeout(() => console.log(c), 1000); };
```
**Answer:** The old value (`0` on the first click). The timeout closure captured `c` from the render in which the handler was created. The UI will show `1`.

### O5. What does this render?
```jsx
const count = 0;
return <div>{count && <Badge />}</div>;
```
**Answer:** It renders the text `0`. `0 && x` returns `0`, and React renders numbers. Use `count > 0 && ...`.

### O6. Does the counter reset when toggling?
```jsx
{isA ? <Counter label="A" /> : <Counter label="B" />}
```
**Answer:** **No.** Same component type at the same position, so React reuses the instance and **keeps its state**; only the `label` prop changes. Add different keys (`key="A"`, `key="B"`) to reset.

### O7. Does this update the UI?
```jsx
const [user, setUser] = useState({ name: 'a' });
const rename = () => { user.name = 'b'; setUser(user); };
```
**Answer:** No re-render. The reference is the same, so React bails out. Also, mutating state is a bug. Use `setUser({ ...user, name: 'b' })`.

### O8. How often does `expensive()` run?
```jsx
const [v] = useState(expensive());
const [w] = useState(() => expensive());
```
**Answer:** The first line calls `expensive()` on **every render** (its result is ignored after the first). The second calls it **only once** (lazy initializer). (In StrictMode development, initializers are called twice on mount.)

### O9. Does the memoized child re-render?
```jsx
const Child = React.memo(function Child({ onSave }) { console.log('Child'); return <button onClick={onSave}>Save</button>; });
function Parent() {
  const [n, setN] = useState(0);
  return (<><button onClick={() => setN(n + 1)}>{n}</button><Child onSave={() => {}} /></>);
}
```
**Answer:** `Child` re-renders every time because `onSave={() => {}}` is a **new function** each render. With `const onSave = useCallback(() => {}, [])` it would not.

### O10. How many times does this effect run?
```jsx
const options = { page: 1 };                       // created in the component body
useEffect(() => { load(options); }, [options]);
```
**Answer:** After **every render**, because `options` is a new object each render. Fix: move it outside the component, `useMemo`, or depend on primitives (`page`).

### O11. Does changing a ref re-render?
```jsx
const clicks = useRef(0);
<button onClick={() => { clicks.current++; console.log(clicks.current); }}>{clicks.current}</button>
```
**Answer:** The log increases (1, 2, 3...), but the button text **does not update** (no re-render). Refs do not trigger rendering.

### O12. How many renders after one click (React 18)?
```jsx
const [a, setA] = useState(0);
const [b, setB] = useState(0);
console.log('render');
const click = () => setTimeout(() => { setA(1); setB(1); }, 0);
```
**Answer:** One additional `render` log. React 18 batches updates in timeouts too. (React 17 would render twice here.)

### O13. Does `setState` with the same value re-render?
```jsx
const [c, setC] = useState(0);
<button onClick={() => setC(0)}>Set 0</button>
```
**Answer:** React bails out: children do not render and effects do not fire. The component function may still be called once more before the bail-out, so a `console.log` in the body can appear once.

### O14. Storing a function in state
```jsx
const [fn, setFn] = useState(null);
setFn(() => console.log('hi'));      // ?
setFn(() => () => console.log('hi')); // ?
```
**Answer:** The first line is treated as a **functional updater**: React calls it and stores its return value (`undefined`). To store a function, return it from an updater: `setFn(() => myFunction)`.

### O15. What is rendered?
```jsx
<div>{[1, 2, 3]}{true}{null}{undefined}{false}{'a'}{0}</div>
```
**Answer:** `123a0`. Booleans, `null` and `undefined` render nothing; numbers and strings render. An object would throw "Objects are not valid as a React child".

### O16. What happens with this input?
```jsx
<input value="hello" />
```
**Answer:** The input is **read-only** and React warns: "You provided a `value` prop to a form field without an `onChange` handler". Use `defaultValue` or add `onChange`.

### O17. Does `key` change reset state?
```jsx
<Profile key={userId} userId={userId} />
```
**Answer:** Yes. When `userId` changes, the old `Profile` is unmounted and a new one is mounted with fresh state. This is the recommended way to "reset state on prop change".

### O18. Async effect
```jsx
useEffect(async () => { const d = await fetchData(); setData(d); }, []);
```
**Answer:** Warning: effect callbacks must return nothing or a cleanup function, but an `async` function returns a **Promise**. Define an inner async function and call it.

### O19. Context without a provider
```jsx
const Ctx = createContext('default');
function Child() { return <p>{useContext(Ctx)}</p>; }
<Child />      // no Provider above
```
**Answer:** `default`. The default value is used when no matching provider exists above.

### O20. Provider value creates a new object each render
```jsx
function App() {
  const [n, setN] = useState(0);
  return <Ctx.Provider value={{ user: 'a' }}><MemoChild />...</Ctx.Provider>;
}
```
**Answer:** Whenever `App` re-renders, `value` is a **new object**, so every context consumer re-renders (even if `MemoChild` itself is memoized, the consumers inside it are updated). Fix: `useMemo` the value or define it outside.

### O21. `children` identity and re-renders
```jsx
function Wrapper({ children }) {
  const [x, setX] = useState(0);
  return <div onMouseMove={(e) => setX(e.clientX)}>{x}{children}</div>;
}
<Wrapper><HeavyTree /></Wrapper>
```
**Answer:** `HeavyTree` does **not** re-render when `Wrapper` state changes. The `children` element was created by the parent of `Wrapper` and is the same object each time, so React skips it. This is the "composition instead of memo" trick.

### O22. Layout effect vs effect timing
```jsx
useEffect(() => console.log('effect'));
useLayoutEffect(() => console.log('layout'));
console.log('render');
```
**Answer:** `render`, `layout`, `effect`. Layout effects run synchronously after DOM mutation (before paint); passive effects run after paint.

### O23. Infinite loop
```jsx
useEffect(() => { setN(n + 1); });
```
**Answer:** An infinite render loop (no dependency array, state changes every time). React stops it with "Maximum update depth exceeded". Add a dependency array or a condition.

### O24. Derived state bug
```jsx
function Child({ value }) { const [v] = useState(value); return <p>{v}</p>; }
// Parent changes value from 1 to 2
```
**Answer:** `Child` still shows `1`. `useState` uses the initial value only on mount. Use the prop directly or reset with `key`.

### O25. Hooks state does not merge
```jsx
const [state, setState] = useState({ a: 1, b: 2 });
setState({ b: 3 });
```
**Answer:** `state` becomes `{ b: 3 }`, and `a` is lost. Hooks **replace** the state (class `setState` merged). Use `setState((s) => ({ ...s, b: 3 }))`.

### O26. `onClick` with a call
```jsx
<button onClick={handle(id)}>Go</button>
```
**Answer:** `handle(id)` runs **during render** and its return value becomes the handler. Use `onClick={() => handle(id)}`.

### O27. What does a batched async update do?
```jsx
const click = async () => { setLoading(true); await save(); setLoading(false); };
```
**Answer:** Two separate renders: first with `loading = true` (before the await), and one after the promise resolves with `loading = false`. (Updates are batched only within the same synchronous task.)

### O28. Lazy component output
```jsx
const Page = lazy(() => import('./Page'));
<Suspense fallback={<p>Loading...</p>}><Page /></Suspense>
```
**Answer:** First `Loading...`, then `Page` once the chunk is loaded. If the import fails, the nearest error boundary handles the error.

### O29. What logs in StrictMode?
```jsx
useEffect(() => { console.log('connect'); return () => console.log('disconnect'); }, []);
```
**Answer (development, StrictMode):** `connect`, `disconnect`, `connect`. In production: only `connect`.

### O30. Controlled input that ignores typing
```jsx
const [text, setText] = useState('');
<input value={text} onChange={() => {}} />
```
**Answer:** Typing appears to do nothing; React resets the input to `text` after each event since state never changes.

---

# ✅ Part 15: MCQs

1. React is a... → **JavaScript library for building UIs**
2. Who created React? → **Meta (Facebook)**
3. What does JSX compile to? → **Function calls (`jsx`/`createElement`)**
4. Component names must start with a... → **Capital letter**
5. Props are... → **Read-only inputs from the parent**
6. Which hook adds state? → **`useState`**
7. Which hook runs side effects? → **`useEffect`**
8. What does an empty dependency array do? → **Runs the effect on mount (and cleanup on unmount)**
9. Which hook holds a mutable value without re-rendering? → **`useRef`**
10. Which hook reads context? → **`useContext`**
11. When is the `useState` initial value used? → **Only on the first render**
12. What is the purpose of `key` in lists? → **Identify items between renders**
13. Which is a poor key choice for dynamic lists? → **Array index**
14. What does `React.memo` compare? → **Props (shallow)**
15. What does `useMemo` cache? → **A computed value**
16. What does `useCallback` cache? → **A function reference**
17. Which hook is best for complex state transitions? → **`useReducer`**
18. Which catches render errors in a subtree? → **Error boundary**
19. Which renders children outside the parent DOM node? → **Portal**
20. Which lazy-loads a component? → **`React.lazy` with `Suspense`**
21. Which marks a state update as non-urgent? → **`startTransition` / `useTransition`**
22. Which gives a delayed copy of a value? → **`useDeferredValue`**
23. Which hook subscribes to an external store safely? → **`useSyncExternalStore`**
24. What does `useId` provide? → **Stable unique IDs for accessibility**
25. What does StrictMode do in development? → **Double-invokes render/effects to find impurities**
26. What is lifting state up? → **Moving state to the closest common parent**
27. What is prop drilling? → **Passing props through many layers**
28. What is a controlled input? → **Value controlled by React state**
29. Which attribute replaces `class` in JSX? → **`className`**
30. Which replaces `for` in JSX? → **`htmlFor`**
31. What triggers a re-render? → **State change, parent re-render, or context change**
32. Is Virtual DOM always faster than direct DOM updates? → **No**
33. Where must hooks be called? → **At the top level of components/custom hooks**
34. Which phase must be pure? → **Render**
35. When do passive effects (`useEffect`) run? → **After the browser paints**
36. Which runs before paint? → **`useLayoutEffect`**
37. What is a custom hook? → **A function starting with `use` that uses other hooks**
38. What is hydration? → **Attaching React to server-rendered HTML**
39. Which runs only on the server and sends no component JS? → **Server Component**
40. Which marks a Client Component boundary? → **`'use client'`**
41. What is `useActionState` for? → **State of a form action (React 19)**
42. What is `useOptimistic` for? → **Optimistic UI updates (React 19)**
43. What does the `use` API do? → **Reads a promise or context during render (React 19)**
44. In React 19 how do function components receive refs? → **As a `ref` prop**
45. What replaced Create React App for new projects? → **Vite or a framework (CRA is deprecated)**
46. Which library is common for server state? → **TanStack Query**
47. Which library is common for form handling? → **React Hook Form**
48. Which testing library focuses on user behavior? → **React Testing Library**
49. Which lets you avoid manual memoization automatically? → **React Compiler**
50. What does `Fiber` enable? → **Interruptible, prioritized rendering**
51. How does React identify hooks? → **By call order**
52. What causes "Invalid hook call"? → **Hooks used incorrectly or duplicate React copies**
53. What causes "Too many re-renders"? → **Setting state during render**
54. Why does `{0 && <X />}` show 0? → **`0` is a renderable value**
55. How to reset a component's state when an ID changes? → **Give it a new `key`**
56. Which pattern shares implicit state among related components? → **Compound components**
57. What is a HOC? → **A function that takes a component and returns a new component**
58. What is an effect cleanup used for? → **Undoing subscriptions/timers before re-running or unmounting**
59. What is automatic batching (React 18)? → **Multiple updates grouped into one render everywhere**
60. Are Server Actions public endpoints? → **Yes: authenticate, authorize and validate inside them**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes developers make again and again in React code. Interviewers ask: *"What is wrong with this component?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Mutating state directly
**❌ Wrong:**
```jsx
todos.push(newTodo); setTodos(todos);
user.name = 'Kumar'; setUser(user);
```
**🤔 Why it is a problem:** The reference does not change, so React may skip the render. Mutation also breaks memoization and time-travel debugging.

**✅ Correct:**
```jsx
setTodos([...todos, newTodo]);
setUser({ ...user, name: 'Kumar' });
```
**💬 Say:** "State is immutable: I always create new arrays and objects."

---

### Mistake 2: Using state when a value can be derived
**❌ Wrong:**
```jsx
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);
useEffect(() => setCount(items.length), [items]);
```
**🤔 Why it is a problem:** Two sources of truth, an extra render, and bugs when they go out of sync.

**✅ Correct:**
```jsx
const count = items.length;                 // derive during render
const sorted = useMemo(() => [...items].sort(cmp), [items]);   // only if expensive
```
**💬 Say:** "If I can compute it from state or props, I don't store it."

---

### Mistake 3: Using `useEffect` for things that belong in event handlers
**❌ Wrong:**
```jsx
const [submitted, setSubmitted] = useState(false);
useEffect(() => { if (submitted) { api.save(form); } }, [submitted]);
```
**🤔 Why it is a problem:** Indirect, hard to follow, and can run more often than intended (StrictMode, dependency changes).

**✅ Correct:**
```jsx
function onSubmit(e) { e.preventDefault(); api.save(form); }
```
**💬 Say:** "Effects are for synchronizing with external systems, not for responding to user actions."

---

### Mistake 4: Missing or lying dependencies in `useEffect`
**❌ Wrong:**
```jsx
useEffect(() => { fetchUser(id).then(setUser); }, []);       // id is missing
// eslint-disable-next-line react-hooks/exhaustive-deps
```
**🤔 Why it is a problem:** The effect uses a stale `id`. The user data does not update when `id` changes.

**✅ Correct:**
```jsx
useEffect(() => {
  let ignore = false;
  fetchUser(id).then((u) => { if (!ignore) setUser(u); });
  return () => { ignore = true; };
}, [id]);
```
**💬 Say:** "I never silence the exhaustive-deps rule; I restructure the code."

---

### Mistake 5: Race conditions and no cleanup in data fetching
**❌ Wrong:**
```jsx
useEffect(() => { fetch(`/api?q=${q}`).then((r) => r.json()).then(setResults); }, [q]);
```
**🤔 Why it is a problem:** A slow old response can arrive after a newer one and overwrite the correct results.

**✅ Correct:** Use `AbortController`/`ignore` flag in cleanup, or TanStack Query/SWR/framework loaders.
**💬 Say:** "Every async effect needs cancellation or an ignore flag."

---

### Mistake 6: Using array index as key (for dynamic lists)
**❌ Wrong:**
```jsx
items.map((item, index) => <Row key={index} item={item} />)
```
**🤔 Why it is a problem:** When items are inserted, removed or reordered, state (input values, focus, animations) sticks to the position, not to the item.

**✅ Correct:**
```jsx
items.map((item) => <Row key={item.id} item={item} />)
```
**💬 Say:** "Keys must be stable and unique identities, not positions."

---

### Mistake 7: Defining components inside components
**❌ Wrong:**
```jsx
function Page() {
  function Header() { return <h1>Title</h1>; }       // new component type every render
  return <Header />;
}
```
**🤔 Why it is a problem:** React treats it as a new component each render and remounts it. State and focus are lost, and it is slow.

**✅ Correct:** Define `Header` at module level (or in its own file) and pass props.
**💬 Say:** "Components are declared at the top level."

---

### Mistake 8: Passing new objects/functions to memoized children
**❌ Wrong:**
```jsx
<MemoChild style={{ color: 'red' }} onClick={() => save(id)} items={data.filter(Boolean)} />
```
**🤔 Why it is a problem:** New references each render defeat `React.memo`, so the child re-renders anyway.

**✅ Correct:**
```jsx
const style = useMemo(() => ({ color: 'red' }), []);
const onClick = useCallback(() => save(id), [id]);
const items = useMemo(() => data.filter(Boolean), [data]);
```
Or hoist constants out of the component.
**💬 Say:** "Memoization works only when props are referentially stable."

---

### Mistake 9: Memoizing everything
**❌ Wrong:** Wrapping every component in `memo` and every function in `useCallback` "just in case".
**🤔 Why it is a problem:** More code, more bugs from wrong dependencies, and often no measurable gain (comparison has a cost too).

**✅ Correct:** Profile first. Use memoization for proven hotspots, stabilize props for memoized children, or let the **React Compiler** handle it.
**💬 Say:** "I memoize with evidence, not by habit."

---

### Mistake 10: Putting everything in global state or Context
**❌ Wrong:** A single global store (or one huge Context) holding form fields, UI toggles and server data.
**🤔 Why it is a problem:** Frequent changes re-render many components; code is harder to reason about; server data gets duplicated and stale.

**✅ Correct:** Keep state local when possible, use a server-state library for server data, URL for shareable state, and a small global store only for truly global client state. Split contexts by update frequency.
**💬 Say:** "State lives as close as possible to where it is used."

---

### Mistake 11: Context value created on every render
**❌ Wrong:**
```jsx
<AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
```
**🤔 Why it is a problem:** A new object each render causes every consumer to re-render whenever the provider re-renders.

**✅ Correct:**
```jsx
const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
```
**💬 Say:** "I memoize the context value and split rarely-changing and frequently-changing data."

---

### Mistake 12: Calling hooks conditionally or in loops
**❌ Wrong:**
```jsx
if (isOpen) { const [x, setX] = useState(0); }
for (const id of ids) { useEffect(() => {}, [id]); }
```
**🤔 Why it is a problem:** React tracks hooks by call order. A changing order corrupts state.

**✅ Correct:** Call hooks at the top level; put the condition **inside** the hook or create a child component per item.
**💬 Say:** "Hooks run in the same order on every render."

---

### Mistake 13: Setting state during render
**❌ Wrong:**
```jsx
function Comp({ value }) { const [v, setV] = useState(0); if (value > 5) setV(value); return <p>{v}</p>; }
<button onClick={setOpen(true)}>Open</button>
```
**🤔 Why it is a problem:** It causes extra renders, infinite loops ("Too many re-renders") or warnings.

**✅ Correct:** Derive the value during render, update in handlers/effects, and write `onClick={() => setOpen(true)}`.
**💬 Say:** "Render is pure; updates happen in events or effects."

---

### Mistake 14: Not handling loading, error and empty states
**❌ Wrong:**
```jsx
return <ul>{data.map((x) => <li key={x.id}>{x.name}</li>)}</ul>;     // data may be undefined
```
**🤔 Why it is a problem:** The app crashes or shows a blank screen when the request is slow, fails or returns no items.

**✅ Correct:**
```jsx
if (isPending) return <Skeleton />;
if (error) return <ErrorMessage error={error} retry={refetch} />;
if (!data.length) return <EmptyState />;
```
**💬 Say:** "Every async UI has loading, error, empty and success states."

---

### Mistake 15: Using `div` with `onClick` instead of `button`
**❌ Wrong:**
```jsx
<div onClick={save} className="btn">Save</div>
```
**🤔 Why it is a problem:** Not focusable, no keyboard support, no role for screen readers.

**✅ Correct:**
```jsx
<button type="button" onClick={save}>Save</button>
```
**💬 Say:** "Use semantic elements first."

---

### Mistake 16: Unsanitized `dangerouslySetInnerHTML`
**❌ Wrong:**
```jsx
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
```
**🤔 Why it is a problem:** XSS: an attacker's script runs in your page.

**✅ Correct:**
```jsx
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
// or render plain text: <p>{comment.body}</p>
```
**💬 Say:** "React escapes by default; I sanitize whenever I bypass it."

---

### Mistake 17: Storing auth tokens in `localStorage`
**❌ Wrong:** `localStorage.setItem('token', jwt)` and reading it in React.
**🤔 Why it is a problem:** Any XSS (including a compromised dependency) can read and steal it.

**✅ Correct:** Use HttpOnly + Secure + SameSite cookies set by the server, with CSRF protection where needed.
**💬 Say:** "Tokens belong in HttpOnly cookies, not in JavaScript-readable storage."

---

### Mistake 18: Forgetting cleanup (timers, listeners, subscriptions)
**❌ Wrong:**
```jsx
useEffect(() => { window.addEventListener('resize', onResize); setInterval(poll, 1000); }, []);
```
**🤔 Why it is a problem:** Memory leaks, duplicated listeners, updates after unmount.

**✅ Correct:**
```jsx
useEffect(() => {
  window.addEventListener('resize', onResize);
  const id = setInterval(poll, 1000);
  return () => { window.removeEventListener('resize', onResize); clearInterval(id); };
}, []);
```
**💬 Say:** "Whatever an effect starts, its cleanup stops."

---

### Mistake 19: Stale closures in intervals and callbacks
**❌ Wrong:**
```jsx
useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id); }, []);
```
**🤔 Why it is a problem:** `count` is always the first value, so the counter gets stuck.

**✅ Correct:**
```jsx
useEffect(() => { const id = setInterval(() => setCount((c) => c + 1), 1000); return () => clearInterval(id); }, []);
```
**💬 Say:** "I use functional updates or a ref for the latest value."

---

### Mistake 20: Copying props into state
**❌ Wrong:**
```jsx
function Profile({ user }) { const [name, setName] = useState(user.name); /* never updates when user changes */ }
```
**🤔 Why it is a problem:** The state is only initialized once, so it gets out of sync.

**✅ Correct:** Use the prop directly, or reset with `key={user.id}`, or make the component fully controlled.
**💬 Say:** "I don't mirror props in state without a clear reason."

---

### Mistake 21: Index-based or unstable keys and `key={Math.random()}`
**❌ Wrong:** `<Row key={Math.random()} />`
**🤔 Why it is a problem:** A new key each render remounts everything, destroying state and performance.
**✅ Correct:** A stable id from the data (or generate the id once when creating the item).
**💬 Say:** "Keys come from the data, not from render."

---

### Mistake 22: Async handlers without error handling
**❌ Wrong:**
```jsx
<button onClick={async () => { await api.delete(id); refresh(); }}>Delete</button>
```
**🤔 Why it is a problem:** A failed request becomes an unhandled promise rejection with no UI feedback.

**✅ Correct:**
```jsx
const onDelete = async () => {
  try { setPending(true); await api.delete(id); refresh(); }
  catch (e) { toast.error('Could not delete'); }
  finally { setPending(false); }
};
```
**💬 Say:** "Every async user action has pending and error handling."

---

### Mistake 23: Fetch waterfalls in components
**❌ Wrong:** Parent fetches in an effect, then child fetches in its own effect after the parent finishes.
**🤔 Why it is a problem:** Sequential requests add up and delay the UI.

**✅ Correct:** Fetch in parallel at route level (loaders, server components, `Promise.all`), prefetch likely data, and use Suspense boundaries.
**💬 Say:** "I look at the network waterfall, not just the component tree."

---

### Mistake 24: Testing implementation details
**❌ Wrong:** Asserting on state variables, internal method calls or class names.
**🤔 Why it is a problem:** Tests break on refactors without any user-visible change.

**✅ Correct:** Query by role/label/text with React Testing Library and assert what users see; mock the network with MSW.
**💬 Say:** "Tests should read like user behavior."

---

### Mistake 25: Large components that do everything
**❌ Wrong:** A 600-line component mixing data fetching, state, formatting and markup.
**🤔 Why it is a problem:** Hard to test, re-renders too much, difficult to review.

**✅ Correct:** Split into small components and custom hooks (data hook, UI components, formatting utilities).
**💬 Say:** "Small components, clear responsibilities, logic in hooks."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you explain React. A junior lists hooks. A senior explains **rendering, trade-offs, state placement, performance method and failure modes.**
> **What should you do?** Practice the "Strong" style for every answer.

### Signal 1: You explain rendering precisely
| | Example answer |
|---|---|
| ❌ Weak | "React updates the DOM when state changes." |
| ✅ Strong | "A state change schedules a render. React calls the component, builds the new tree, diffs it against the current one by type and key, and commits only the differences. Render must be pure because it can run multiple times. Layout effects run before paint and `useEffect` after. Children re-render with the parent unless memoized or passed as stable `children`." |
**Prove it:** render vs commit, reconciliation, effects timing.

### Signal 2: You treat effects as an escape hatch
| | Example answer |
|---|---|
| ❌ Weak | "I use useEffect to fetch data and update state." |
| ✅ Strong | "I use effects only to sync with external systems. Derived data is computed during render, user actions go in event handlers, resets use `key`, and data fetching uses TanStack Query or loaders. Every effect has complete dependencies and a cleanup." |
**Prove it:** "You might not need an effect", cleanup, StrictMode.

### Signal 3: You place state correctly
| | Example answer |
|---|---|
| ❌ Weak | "I put everything in Redux." |
| ✅ Strong | "Server state in a query cache, URL state in the router, form state in a form library, local UI state in components, and a small store for real cross-cutting client state. I colocate state and avoid duplicating it." |
**Prove it:** table of state kinds, trade-offs.

### Signal 4: You optimize with a method
| | Example answer |
|---|---|
| ❌ Weak | "I wrap components in memo and useCallback." |
| ✅ Strong | "I profile first, find why components render, then reduce work: colocate state, split components, stabilize props, split contexts, virtualize lists, use transitions for non-urgent updates, and only then memoize. INP dropped from 600 ms to 120 ms on our table." |
**Prove it:** Profiler, numbers, ordered strategy.

### Signal 5: You understand modern React (18/19, RSC)
| | Example answer |
|---|---|
| ❌ Weak | "Hooks replaced classes." |
| ✅ Strong | "Concurrent rendering with transitions and Suspense keeps the UI responsive. Server Components move data fetching and heavy libraries to the server and send no client JS for them; Client Components handle interactivity. React 19 adds Actions, `useOptimistic`, `use` and `ref` as a prop. Server Actions are public endpoints, so I authorize and validate in them." |
**Prove it:** RSC boundaries, Actions, security notes.

### Signal 6: You design components and APIs well
| | Example answer |
|---|---|
| ❌ Weak | "I make reusable components." |
| ✅ Strong | "I prefer composition over configuration: compound components and headless primitives, controlled/uncontrolled support, accessible by default, forwardable refs, and stable props. Custom hooks hold logic; components render." |
**Prove it:** compound components, headless UI, accessibility.

### Signal 7: You care about accessibility, security and testing
| | Example answer |
|---|---|
| ❌ Weak | "I test with snapshots." |
| ✅ Strong | "Semantic elements and focus management, axe and jsx-a11y in CI, sanitized HTML, HttpOnly cookies, RTL tests that query by role, MSW for network, and Playwright for key flows." |
**Prove it:** specific tools and rules.

### Signal 8: You lead decisions and migrations
| | Example answer |
|---|---|
| ❌ Weak | "We upgraded React." |
| ✅ Strong | "We moved from CRA to Vite and then introduced the App Router route by route behind flags, measured bundle size and LCP, trained the team on the client/server boundary and caching, and wrote ADRs. Bundle size fell 35% and LCP improved by 0.8 s." |
**Prove it:** strangler pattern, metrics, ADRs.

### 🔊 Phrases that sound senior
- "Render is pure; side effects go in handlers or effects."
- "I derive instead of syncing state."
- "Let me profile before memoizing."
- "State lives as close as possible to where it's used."
- "That would be a hydration mismatch because the first client render differs."
- "Server Actions are public endpoints; I validate and authorize there."

### 🚩 Phrases that sound junior
- "I put everything in useEffect." · "I add useMemo everywhere." · "I use index as key." · "I mutate the array and call setState." · "I disable the exhaustive-deps lint rule." · "Redux for all state."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Rendering model:** trigger → render (pure) → commit → effects
2. **State, snapshots and batching** (functional updates, stale closures)
3. **Props vs state**, one-way data flow, lifting state
4. **Keys and reconciliation** (type + key, state preservation, reset with `key`)
5. **`useEffect`:** dependencies, cleanup, StrictMode, "you might not need an effect"
6. **Memoization:** `memo`, `useMemo`, `useCallback` (referential stability)
7. **Context** and its performance behavior
8. **Concurrent features:** `useTransition`, `useDeferredValue`, Suspense
9. **Server Components and hydration** (client/server boundary, mismatches)
10. **Performance method:** profile → find why → reduce work → measure

## 18.2 Hook chooser
| Need | Hook |
|---|---|
| Local value that changes UI | `useState` |
| Complex transitions | `useReducer` |
| Sync with external system | `useEffect` |
| Measure DOM before paint | `useLayoutEffect` |
| DOM node / mutable box | `useRef` |
| Read shared value | `useContext` |
| Cache expensive value | `useMemo` |
| Stable function identity | `useCallback` |
| Non-urgent update | `useTransition` |
| Lagging input value | `useDeferredValue` |
| External store | `useSyncExternalStore` |
| Unique id | `useId` |
| Read promise (19) | `use` |
| Form action state (19) | `useActionState` |
| Optimistic UI (19) | `useOptimistic` |

## 18.3 When does a component render?
State/reducer change (new value) · parent renders (unless `memo` with stable props or same `children` element) · context value changes · external store changes (`useSyncExternalStore`).

## 18.4 `useEffect` quick rules
- `[]` runs on mount only; `[a, b]` runs when they change; no array runs every render.
- Cleanup runs before the next effect and on unmount.
- Include every reactive value you use.
- StrictMode (dev) mounts → unmounts → mounts: your cleanup must make that safe.
- Do not use effects to derive state or handle events.

## 18.5 Performance checklist
- [ ] Profile with React DevTools and the browser Performance panel
- [ ] Colocate state; split components; pass heavy trees as `children`
- [ ] Stable props for memoized children (`useMemo`/`useCallback`/hoisting)
- [ ] Split contexts or use selectors
- [ ] Virtualize long lists; paginate
- [ ] `startTransition`/`useDeferredValue` for expensive updates
- [ ] Code split routes/heavy components (`lazy`)
- [ ] Prefer Server Components / SSG where possible
- [ ] Consider the React Compiler

## 18.6 Accessibility checklist
- [ ] Semantic elements (`button`, `a`, `label`, `nav`)
- [ ] Labels and error messages linked with `aria-describedby`
- [ ] Focus management for modals and route changes
- [ ] Keyboard support for custom widgets
- [ ] `aria-live` for async updates
- [ ] jsx-a11y lint + axe tests

## 18.7 Security checklist
- [ ] No unsanitized `dangerouslySetInnerHTML`
- [ ] Validate URLs used in `href`/`src` (no `javascript:`)
- [ ] Tokens in HttpOnly cookies; CSRF protection where needed
- [ ] No secrets in the client bundle
- [ ] Authenticate, authorize and validate in Server Actions / API routes
- [ ] Keep dependencies audited

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| Too many re-renders | Setting state during render | Move to handler/effect |
| Effect loops forever | Changing dependency each render | Memoize/primitive deps/derive |
| Stale value in callback | Closure over old render | Functional update / ref / correct deps |
| Input loses focus | Component defined inside component / unstable key | Move component out; stable keys |
| State mixed up in list | Index keys | Stable ids |
| UI not updating | Mutated state / same reference | Create new objects |
| Child re-renders anyway | Unstable props / context value | `memo` + stable props / memoize value |
| Hydration mismatch | Different server/client first render | Same first render; effect for client-only values |
| Invalid hook call | Wrong place or duplicate React | Fix usage; dedupe React |
| Suspense loops | New promise each render | Create promise outside render |
| Slow typing with big list | Heavy re-render per key | Split state, defer, memo, virtualize |
| Works locally, 404 on refresh | No SPA fallback | Rewrite to `index.html` |

## 18.9 30-second answers
- **What is React?** A library for building UIs from components where the UI is a function of state; React updates the DOM efficiently.
- **State vs props?** Props are inputs from the parent (read-only); state is data owned by the component that triggers re-renders.
- **Why keys?** They identify list items so React can preserve state and reorder correctly.
- **useEffect vs useLayoutEffect?** Effect runs after paint; layout effect runs before paint, after DOM mutation.
- **memo vs useMemo vs useCallback?** `memo` skips re-rendering a component; `useMemo` caches a value; `useCallback` caches a function.
- **Context downsides?** All consumers re-render when the value changes; use for low-frequency data or split/select.
- **What is reconciliation?** Diffing the new element tree with the previous one by type and key to compute minimal DOM changes.
- **What are Server Components?** Components that render on the server, can access data directly and send no client JS for themselves.
- **How do you optimize a slow React app?** Profile, find why it renders, reduce work (state placement, virtualization), stabilize props, defer non-urgent updates, split code, and measure again.

## 18.10 Last-minute checklist before the interview
- [ ] I can explain render vs commit, batching, and why state updates are snapshots.
- [ ] I can write `useFetch`, `useDebounce`, a modal, tabs, and an autocomplete from memory.
- [ ] I can predict the log order of renders and effects (parent/child, StrictMode).
- [ ] I can explain keys, state preservation, and the `key` reset trick.
- [ ] I can explain when to use (and not use) `useEffect`, `useMemo` and `useCallback`.
- [ ] I can compare state management options and say where each kind of state lives.
- [ ] I know the main React 19 features and Server Components' boundaries and security notes.
- [ ] I have two stories with numbers: a performance fix and a tricky bug or migration.
