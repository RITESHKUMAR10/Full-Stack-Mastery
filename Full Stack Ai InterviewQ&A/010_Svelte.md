# Svelte & SvelteKit Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This file uses **Svelte 5** (runes: `$state`, `$derived`, `$effect`, `$props`) and **SvelteKit 2**. Because many projects still run **Svelte 4**, the differences are marked clearly. Always check the official migration guide for exact details.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** Svelte is a **compiler**. Strong answers explain *what the compiler generates* (no virtual DOM, fine-grained updates), *how reactivity is tracked* (runes/signals), and *what runs on the server vs the browser* (SvelteKit).

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Svelte 4 Legacy + Ecosystem + Mixed)](#-part-11-complete-coverage-svelte-4-legacy--ecosystem--mixed)
- [Part 12: Internals](#-part-12-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Svelte? How is it different from React and Vue? *(Conceptual)*
**Answer:** Svelte is a **compiler-based UI framework**. You write components in `.svelte` files; at **build time** the compiler turns them into small, plain JavaScript that updates the DOM directly. There is **no virtual DOM** and no big runtime library doing diffing in the browser.

| | Svelte | React | Vue |
|---|---|---|---|
| Approach | Compiler (build-time) | Runtime library (virtual DOM) | Runtime framework (virtual DOM + reactivity) |
| Reactivity | Signals-style, compiler-driven (runes in v5) | Re-render components, diff the tree | Proxy-based reactivity |
| Boilerplate | Very low | Medium (hooks, memo) | Low |
| Bundle size | Usually smallest | Larger runtime | Medium |
| Styling | Scoped CSS built in | Choose a solution | Scoped CSS built in |
| Meta-framework | SvelteKit | Next.js/Remix | Nuxt |
**Trade-offs of Svelte:** smaller ecosystem and hiring pool; some tooling and libraries are less mature than React's.

### Q2. What does a Svelte component look like?
A `.svelte` file has up to three parts: script, markup, style.
```svelte
<script>
  let name = $state('Ritesh Kumar');
  let count = $state(0);
</script>

<h1>Hello {name}!</h1>
<input bind:value={name} />
<button onclick={() => count++}>Clicked {count} times</button>

<style>
  h1 { color: rebeccapurple; }   /* scoped to this component only */
  button { padding: 0.5rem 1rem; }
</style>
```
Styles are **scoped by default**: the compiler adds a unique class to selectors so they do not leak.

### Q3. What are runes in Svelte 5? *(Must-know)*
Runes are special **compiler symbols** (prefixed with `$`) that control reactivity in Svelte 5.
| Rune | Purpose |
|---|---|
| `$state(value)` | Reactive state |
| `$derived(expr)` | Computed value that updates when its dependencies change |
| `$derived.by(fn)` | Computed value with a function body |
| `$effect(fn)` | Side effects that re-run when the state they read changes |
| `$props()` | Receive component props |
| `$bindable()` | Mark a prop as two-way bindable |
| `$inspect(...)` | Dev-only logging when values change |
| `$state.raw`, `$state.snapshot` | Non-deep state / plain copy of state |
```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => { document.title = `Count: ${count}`; });
</script>
<button onclick={() => count++}>{count} → {doubled}</button>
```
Runes are not imports: they are part of the language when the file is compiled in "runes mode" (default in new Svelte 5 components).

### Q4. How did reactivity work in Svelte 4, and what changed in Svelte 5? *(Must-know)*
**Svelte 4:** any top-level `let` was reactive **by assignment**; `$:` created reactive statements; arrays/objects needed re-assignment to trigger updates.
```svelte
<script>
  let count = 0;              // reactive because of assignment
  $: doubled = count * 2;     // reactive declaration
  let todos = [];
  function add() { todos.push('x'); todos = todos; }   // needed the re-assignment!
</script>
```
**Svelte 5:** reactivity is **explicit** with runes, works inside functions and modules, and `$state` objects/arrays are **deep reactive proxies**, so `todos.push('x')` works.
```svelte
<script>
  let todos = $state([]);
  function add() { todos.push('x'); }   // reactive
</script>
```

### Q5. How do you pass props?
```svelte
<!-- Child.svelte (Svelte 5) -->
<script>
  let { name, age = 18, onsave, ...rest } = $props();
</script>
<p {...rest}>{name} ({age})</p>
<button onclick={() => onsave?.(name)}>Save</button>

<!-- Parent.svelte -->
<Child name="Ritesh" age={30} onsave={(n) => console.log('saved', n)} class="card" />
```
**Svelte 4:** `export let name; export let age = 18;`. Props are one-way (parent → child). Use callback props or `$bindable` for upward communication.

### Q6. How do you handle events?
**Svelte 5:** events are regular attributes (`onclick`, `oninput`, `onsubmit`).
```svelte
<button onclick={handleClick}>Save</button>
<form onsubmit={(e) => { e.preventDefault(); save(); }}>...</form>
```
Event **modifiers** like `on:click|preventDefault` do not exist for `onclick`; call `e.preventDefault()` yourself (or write small wrapper functions). **Svelte 4:** `on:click={handler}`, `on:click|preventDefault`, and `createEventDispatcher()` for custom events. In Svelte 5, use **callback props** instead of dispatchers.

### Q7. What are the template blocks?
```svelte
{#if user}
  <p>Hello {user.name}</p>
{:else if loading}
  <p>Loading...</p>
{:else}
  <p>Please log in</p>
{/if}

{#each todos as todo, i (todo.id)}      <!-- (todo.id) is the key -->
  <li>{i + 1}. {todo.text}</li>
{:else}
  <li>No todos</li>
{/each}

{#await promise}
  <p>Loading...</p>
{:then data}
  <p>{data.title}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}

{#key userId}<Profile {userId} />{/key}   <!-- re-creates the content when the key changes -->
```
Other tags: `{@html html}` (raw HTML; XSS risk), `{@const x = ...}`, `{@debug value}`, and Svelte 5's `{#snippet}` / `{@render}`.

### Q8. How does two-way binding work?
```svelte
<input bind:value={name} />
<input type="checkbox" bind:checked={done} />
<input type="radio" bind:group={choice} value="a" />
<select bind:value={color}>...</select>
<textarea bind:value={text}></textarea>
<div bind:this={el}></div>                 <!-- DOM reference -->
<video bind:currentTime bind:paused></video>
<div bind:clientWidth={w}></div>
```
Component bindings (`<Child bind:value />`) require the child to declare the prop with `$bindable()`.

### Q9. What are stores? Are they still needed in Svelte 5?
Stores are objects with a `subscribe` method (`writable`, `readable`, `derived` from `svelte/store`). In components, prefix with `$` to auto-subscribe.
```js
// stores.js
import { writable, derived } from 'svelte/store';
export const count = writable(0);
export const doubled = derived(count, ($c) => $c * 2);
```
```svelte
<script>
  import { count } from './stores.js';
</script>
<button onclick={() => $count++}>{$count}</button>
```
In Svelte 5, **runes in `.svelte.js` modules** can replace most stores (shared state), but stores still work and are useful for async/event-like streams and interop.

### Q10. Lifecycle: `onMount`, `onDestroy`, `tick`
```svelte
<script>
  import { onMount, onDestroy, tick } from 'svelte';
  onMount(() => {
    const id = setInterval(tick1, 1000);
    return () => clearInterval(id);        // cleanup on destroy
  });
  async function update() { value = 'new'; await tick(); /* DOM is updated now */ }
</script>
```
`onMount` runs only in the **browser** (not during SSR). In Svelte 5, `$effect` covers most lifecycle needs; `beforeUpdate`/`afterUpdate` are deprecated in favor of `$effect.pre`/`$effect`.

### Q11. How does styling work? What is `:global`?
Scoped by default. To style elements outside the component (e.g., from a CMS) use `:global()`.
```svelte
<style>
  p { color: teal; }                       /* only this component's <p> */
  :global(body) { margin: 0; }
  .wrapper :global(a) { text-decoration: none; }
</style>
```
Also: `class:active={isActive}` directive (conditional class), `style:color={c}` directive, and CSS custom properties passed to components: `<Button --bg="tomato" />`.

### Q12. What are transitions and animations?
```svelte
<script>
  import { fade, fly, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
</script>
{#if visible}
  <p transition:fade={{ duration: 200 }}>Hello</p>
  <p in:fly={{ y: 20 }} out:fade>Hi</p>
{/if}
{#each items as item (item.id)}
  <li animate:flip={{ duration: 300 }}>{item.name}</li>
{/each}
```
Transitions are **built in**, run on the compositor-friendly CSS where possible, and need elements inside `{#if}`/`{#each}` blocks that are created/destroyed.

### Q13. What is SvelteKit?
The official **application framework** for Svelte (like Next.js for React): file-based routing, server-side rendering, static generation, API endpoints, form actions, data loading, adapters for deployment, and Vite-powered tooling.
```bash
npx sv create my-app      # official scaffolding CLI
cd my-app && npm install && npm run dev
```

### Q14. How does routing work in SvelteKit?
Folders in `src/routes` are routes; special files with a `+` prefix define behavior:
| File | Purpose |
|---|---|
| `+page.svelte` | The page UI |
| `+page.js` / `+page.ts` | **Universal** `load` (runs on server during SSR and in the browser on navigation) |
| `+page.server.js` | **Server-only** `load` and form `actions` |
| `+layout.svelte` | Shared layout (renders `{@render children()}` in v5, `<slot />` in v4) |
| `+layout.js` / `+layout.server.js` | Layout data loading |
| `+server.js` | API endpoint (GET, POST...) |
| `+error.svelte` | Error page for the route |
| `hooks.server.js` | `handle`, `handleFetch`, `handleError` |
Dynamic routes: `[slug]`, rest `[...path]`, optional `[[lang]]`, groups `(app)`.

### Q15. How do you load data in SvelteKit?
```js
// src/routes/blog/[slug]/+page.server.js
import { error } from '@sveltejs/kit';
export async function load({ params, fetch }) {
  const res = await fetch(`/api/posts/${params.slug}`);      // use event.fetch (cookies, relative URLs, SSR-aware)
  if (!res.ok) error(404, 'Post not found');
  return { post: await res.json() };
}
```
```svelte
<!-- +page.svelte -->
<script>
  let { data } = $props();       // Svelte 4: export let data;
</script>
<h1>{data.post.title}</h1>
```
The returned data is available as the `data` prop, and layout data is merged with page data.

### Q16. What are form actions?
Server-side handlers for HTML forms with progressive enhancement.
```js
// +page.server.js
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    if (!email.includes('@')) return fail(400, { email, error: 'Invalid email' });
    await subscribe(email);
    redirect(303, '/thanks');
  },
};
```
```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();       // result of the action (e.g., validation errors)
</script>
<form method="POST" use:enhance>
  <input name="email" value={form?.email ?? ''} />
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Subscribe</button>
</form>
```
Without JavaScript the form works as a normal POST; with `use:enhance` it submits via `fetch` and updates the page without a full reload.

### Q17. What are rendering options in SvelteKit?
Set per page/layout: `export const prerender = true` (static at build), `export const ssr = false` (client-only SPA page), `export const csr = false` (no client JS), `export const trailingSlash = 'never'`. Default is **SSR + hydration**. Adapters choose where to deploy: `adapter-node`, `adapter-static`, `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`, `adapter-auto`.

### Q18. How do you write an API endpoint?
```js
// src/routes/api/posts/+server.js
import { json, error } from '@sveltejs/kit';
export async function GET({ url }) {
  const q = url.searchParams.get('q') ?? '';
  return json(await searchPosts(q));
}
export async function POST({ request, locals }) {
  if (!locals.user) error(401, 'Unauthorized');
  const body = await request.json();
  return json(await createPost(body), { status: 201 });
}
```

### Q19. What are environment variables in SvelteKit?
```js
import { DATABASE_URL } from '$env/static/private';        // build-time, server only
import { env } from '$env/dynamic/private';               // runtime, server only
import { PUBLIC_API_URL } from '$env/static/public';       // must start with PUBLIC_, safe for the browser
```
Private variables cannot be imported into client code (the build fails), which prevents leaks.

### Q20. What is `$lib`?
An alias for `src/lib`, used for shared components, utilities and server-only code (`$lib/server/*` can only be imported from server code).

### Q21. `{#each}` keys: why important?
Without a key, Svelte updates items by index, which can mix up state (inputs, animations) when the list changes. With a key `(item.id)` it moves DOM nodes correctly.

### Q22. How do you do conditional classes and styles?
```svelte
<button class:active={isActive} class="btn" style:opacity={disabled ? 0.5 : 1}>Save</button>
<!-- Svelte 5.16+: class={['btn', { active: isActive }]} -->
```

### Q23. What are slots and snippets?
**Slots (Svelte 4):** `<slot />`, `<slot name="header" />`, `let:` for slot props. **Snippets (Svelte 5):** reusable markup blocks passed as props.
```svelte
<!-- Card.svelte -->
<script>
  let { header, children } = $props();
</script>
<section>
  <header>{@render header?.()}</header>
  {@render children?.()}
</section>

<!-- usage -->
<Card>
  {#snippet header()}<h2>Title</h2>{/snippet}
  <p>Body content</p>         <!-- this becomes `children` -->
</Card>
```
Snippets can take parameters: `{#snippet row(item)}...{/snippet}` and `{@render row(item)}`. Slots still work but are deprecated.

### Q24. How do you access the DOM or use actions?
`bind:this` for a reference; **actions** (`use:action`) to attach behavior to an element.
```svelte
<script>
  function focusOnMount(node) { node.focus(); }
</script>
<input use:focusOnMount />
```
An action can return `{ update(param) {...}, destroy() {...} }`.

### Q25. How do you debug reactivity?
`$inspect(count)` logs when `count` changes (dev only), `{@debug count}` in markup, Svelte DevTools browser extension, and the compiler's warnings (accessibility, unused CSS).

### Q26. Does Svelte have built-in accessibility checks?
Yes. The compiler emits **a11y warnings** (e.g., `<img>` without `alt`, click handlers on non-interactive elements, missing labels). Fix the code instead of ignoring with `<!-- svelte-ignore -->`.

### Q27. How do you navigate programmatically?
```js
import { goto, invalidate, invalidateAll } from '$app/navigation';
await goto('/dashboard', { replaceState: true });
await invalidateAll();      // re-run all load functions
```
Links are normal `<a href>` elements; SvelteKit intercepts same-origin links for client-side navigation and preloads on hover (`data-sveltekit-preload-data`).

### Q28. How do you handle errors and 404s?
`error(404, 'Not found')` in `load`; a `+error.svelte` page renders the error with `page.error` (`$page.error` in older versions); unexpected errors go through `handleError` in `hooks.server.js`. Svelte 5 adds `<svelte:boundary>` for component-level error and pending UI.

### Q29. What is hydration?
SvelteKit renders HTML on the server, sends it with the client JS, and the browser **hydrates**: attaches event listeners and state to the existing DOM instead of re-creating it. Mismatches between server and client output cause warnings/bugs.

### Q30. What are the main benefits and drawbacks of Svelte for a company?
Benefits: small bundles, fast runtime, simple syntax, built-in transitions/stores/scoped CSS, great DX with SvelteKit. Drawbacks: smaller ecosystem and hiring pool, fewer enterprise-grade libraries than React/Angular, and the Svelte 4 → 5 migration for older codebases.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. `$derived` vs `$effect`: when to use which? *(Must-know)*
- **`$derived`**: compute a **value** from other state (pure, no side effects). It is lazy/memoized and recomputed only when dependencies change.
- **`$effect`**: perform a **side effect** (DOM APIs, subscriptions, logging, network) after the DOM updates.
```svelte
<script>
  let first = $state('Ritesh'), last = $state('Kumar');
  let full = $derived(`${first} ${last}`);               // ✅ derived value
  $effect(() => { localStorage.setItem('name', full); }); // ✅ side effect
  // ❌ Do NOT: $effect(() => { full = first + ' ' + last; })  -> use $derived
</script>
```
Rule: if you are assigning state inside an effect just to compute something, you probably want `$derived`.

### Q32. How does `$effect` track dependencies?
Automatically: every reactive value **read synchronously** inside the effect becomes a dependency. There is no dependency array. Values read after an `await` or inside a callback (like `setTimeout`) are **not** tracked. Effects run in the browser after the DOM updates, not during SSR. The returned function is a **cleanup** that runs before the next run and on destroy.
```svelte
$effect(() => {
  const id = setInterval(() => count++, 1000);   // `count++` reads+writes count; use untrack if needed
  return () => clearInterval(id);
});
```
Use `untrack(() => value)` to read a value without subscribing, and `$effect.pre` for work that must run before DOM updates.

### Q33. Deep reactivity: `$state` with objects and arrays
```svelte
<script>
  let user = $state({ name: 'Ritesh', tags: ['js'] });
  user.name = 'Kumar';            // reactive
  user.tags.push('svelte');       // reactive (deep proxy)
  let raw = $state.raw({ big: [] });   // NOT deep: only re-assignment triggers updates (good for large immutable data)
  console.log($state.snapshot(user));  // plain (non-proxy) copy, e.g., for structuredClone/JSON/logging
</script>
```
Only plain objects and arrays are proxied. Class instances are **not** proxied; use `$state` on class fields instead. Destructuring a proxy (`let { name } = user`) takes a **copy** of the value at that moment and loses reactivity.

### Q34. Reactive `Map`, `Set`, `Date`, `URL`
`Map`/`Set` inside `$state` are not deeply reactive. Use `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams` from `svelte/reactivity`.
```svelte
<script>
  import { SvelteSet } from 'svelte/reactivity';
  const selected = new SvelteSet();
  selected.add(1);                      // triggers updates
</script>
```

### Q35. Sharing state across components (Svelte 5)
Create a module with the `.svelte.js` (or `.svelte.ts`) extension so runes work outside components.
```js
// cart.svelte.js
export const cart = $state({ items: [] });
export const total = () => cart.items.reduce((s, i) => s + i.price * i.qty, 0);
export function add(item) { cart.items.push(item); }
```
or a class:
```js
export class Cart {
  items = $state([]);
  total = $derived(this.items.reduce((s, i) => s + i.price * i.qty, 0));
  add(item) { this.items.push(item); }
}
export const cart = new Cart();
```
**SSR warning:** module-level state is shared between all requests on the server. For per-user state use `context` or SvelteKit `locals` (see Q38).

### Q36. Stores vs runes: how do you choose?
| | Stores | Runes in `.svelte.js` |
|---|---|---|
| Works in Svelte 3/4/5 | ✅ | Svelte 5 only |
| Syntax | `$store` auto-subscribe, `.set/.update` | Plain property access |
| Derived | `derived()` | `$derived` |
| Async/stream-friendly | ✅ (`readable` with start/stop) | Use `$effect`/`fromStore` |
| Interop with libraries | ✅ (store contract) | Use `toStore`/`fromStore` adapters |
Use runes for new Svelte 5 code; keep stores where libraries or existing code need the store contract.

### Q37. Context API
```svelte
<!-- Parent -->
<script>
  import { setContext } from 'svelte';
  let theme = $state({ mode: 'dark' });
  setContext('theme', theme);
</script>
<!-- Child (any depth) -->
<script>
  import { getContext } from 'svelte';
  const theme = getContext('theme');
</script>
```
Context is set during component initialization and is scoped to the component subtree. This makes it **SSR-safe** (per-request) unlike module-level state.

### Q38. Handling user data safely on the server
In SvelteKit, populate `event.locals.user` in the `handle` hook from the session cookie, and read it in `load`, actions and endpoints. Never keep user-specific data in module-level variables (they are shared across requests).
```js
// hooks.server.js
export async function handle({ event, resolve }) {
  const token = event.cookies.get('session');
  event.locals.user = token ? await getUserFromSession(token) : null;
  return resolve(event);
}
```

### Q39. `load` functions: universal vs server
| | `+page.js` (universal) | `+page.server.js` (server) |
|---|---|---|
| Runs | Server (SSR) and browser (navigation) | Server only |
| Access to DB/secrets | ❌ | ✅ |
| Can return non-serializable data (components, functions) | ✅ | ❌ (must be serializable) |
| Use for | Public APIs, client-friendly data | DB, private APIs, cookies, auth |
Server `load` data is serialized (using `devalue`, which supports `Date`, `Map`, `Set`, `BigInt`, `undefined`).

### Q40. Parallel loading and waterfalls
`load` functions in layouts and pages run **in parallel** by default. `await parent()` creates a waterfall (waits for the parent data); avoid it when possible. Within one `load`, use `Promise.all` for independent requests. You can also **stream** slow data by returning promises (nested in an object) and rendering them with `{#await}`.
```js
export async function load({ fetch }) {
  const [user, stats] = await Promise.all([fetch('/api/user').then((r) => r.json()), fetch('/api/stats').then((r) => r.json())]);
  return { user, stats, comments: fetch('/api/comments').then((r) => r.json()) };   // streamed promise
}
```

### Q41. Invalidation: `invalidate`, `depends`, `invalidateAll`
`load` re-runs when its dependencies change (params, `url` properties it read, parent data it awaited, or `fetch` URLs and `depends('app:key')` tags).
```js
export async function load({ fetch, depends }) {
  depends('app:todos');
  return { todos: await (await fetch('/api/todos')).json() };
}
// anywhere on the client:
import { invalidate } from '$app/navigation';
await invalidate('app:todos');
```

### Q42. Form actions: validation and `use:enhance` customization
```svelte
<form method="POST" action="?/create" use:enhance={() => {
  loading = true;
  return async ({ result, update }) => {
    loading = false;
    if (result.type === 'success') toast('Saved');
    await update();                       // default behavior: reset form, update `form`, invalidate data
  };
}}>
```
Named actions use `?/name`; `fail()` returns validation errors with a status code; `redirect()` navigates; returned data appears in `form`. Validate with Zod/Valibot (or Superforms) on the **server**.

### Q43. Authentication in SvelteKit
Use cookies set by the server (`cookies.set('session', token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge })`), a `handle` hook to load the user into `locals`, guard routes in `+layout.server.js` or `handle`, and consider libraries (Lucia patterns, Auth.js `@auth/sveltekit`, Better Auth). Always check authorization in actions and endpoints too.
```js
// +layout.server.js
import { redirect } from '@sveltejs/kit';
export function load({ locals, url }) {
  if (!locals.user && url.pathname.startsWith('/app')) redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  return { user: locals.user };
}
```

### Q44. `handle`, `handleFetch`, `handleError`, `reroute`
- `handle`: runs for every request (add headers, auth, locale).
- `handleFetch`: modify `event.fetch` calls (e.g., rewrite API URLs, add credentials).
- `handleError`: log unexpected errors and return a safe message/ID.
- `reroute` (universal hook): change the route used for a URL (e.g., i18n path translation).
```js
export const handleError = ({ error, event }) => { const id = crypto.randomUUID(); console.error(id, error); return { message: 'Something went wrong', id }; };
```

### Q45. Preloading and navigation behavior
`data-sveltekit-preload-data="hover"` (default in the template) preloads page code and data on hover/touchstart; `"tap"` waits for the tap; `data-sveltekit-reload` forces a full page load; `data-sveltekit-noscroll` keeps scroll position. Programmatic: `preloadData('/path')`, `preloadCode('/path')`.

### Q46. Using transitions with keyed each and `animate:flip`
Use keys in `{#each}` so items move instead of being re-created; wrap with `transition:`/`in:`/`out:` for enter/leave and `animate:flip` for reordering. Respect `prefers-reduced-motion` by reducing durations.

### Q47. Actions (`use:`) for reusable DOM behavior
```js
// click-outside.js
export function clickOutside(node, handler) {
  const onPointer = (e) => { if (!node.contains(e.target)) handler(e); };
  document.addEventListener('pointerdown', onPointer, true);
  return { update(newHandler) { handler = newHandler; }, destroy() { document.removeEventListener('pointerdown', onPointer, true); } };
}
```
```svelte
<div use:clickOutside={() => (open = false)}>...</div>
```
Svelte 5.29+ adds **attachments** (`{@attach fn}`) as a more composable alternative that integrates with runes.

### Q48. Testing Svelte components
```js
// Counter.test.js (Vitest + @testing-library/svelte)
import { render, screen, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';
test('increments', async () => {
  render(Counter);
  await fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(/Clicked 1/)).toBeInTheDocument();
});
```
Use Playwright for end-to-end tests (SvelteKit scaffolding offers it). Test `.svelte.js` modules with Vitest; for effects use `flushSync()` or `$effect.root` in tests.

### Q49. Component libraries and UI
Popular: **shadcn-svelte**, **Skeleton**, **Flowbite-Svelte**, **Melt UI / Bits UI** (headless), **Carbon Components Svelte**, **Svelte Material UI**. Headless libraries pair well with Tailwind. Check Svelte 5 compatibility before adopting.

### Q50. Using TypeScript
```svelte
<script lang="ts">
  interface Props { name: string; age?: number; onsave?: (n: string) => void }
  let { name, age = 18, onsave }: Props = $props();
  let count = $state<number>(0);
</script>
```
SvelteKit generates types for `load`, `actions` and route params (`./$types`: `PageData`, `PageServerLoad`, `Actions`). Run `svelte-check` in CI.

### Q51. Internationalization (i18n)
Use Paraglide (inlang, tree-shakable messages), `svelte-i18n`, or `typesafe-i18n`. Typical setup: locale in the URL or cookie, `reroute`/`handle` hooks to detect locale, `<html lang>` set in `app.html` via `%lang%` or transformed in `handle` (`transformPageChunk`), and localized formatting with `Intl`.

### Q52. SEO and head management
```svelte
<svelte:head>
  <title>{data.post.title} | Ritesh Kumar</title>
  <meta name="description" content={data.post.excerpt} />
  <link rel="canonical" href={`https://example.com/blog/${data.post.slug}`} />
</svelte:head>
```
Server-render pages (default) or prerender; add sitemap/robots as endpoints (`+server.js`).

### Q53. Dynamic imports and code splitting
SvelteKit splits code per route automatically. For heavy components use dynamic import:
```svelte
{#await import('./Chart.svelte') then { default: Chart }}
  <Chart {data} />
{/await}
```
In Svelte 5, dynamic components can be used directly: `<Component />` where `Component` is a variable; `<svelte:component>` is no longer required.

### Q54. Svelte 5 migration basics
Run `npx sv migrate svelte-5`. Key changes: `let x` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`, `on:click` → `onclick`, slots → snippets, `createEventDispatcher` → callback props, `new Component()` → `mount()`. Legacy syntax still compiles in non-runes mode, so migration can be gradual per component (but you cannot mix legacy and runes syntax inside one component).

### Q55. Web Components
Svelte can compile components to custom elements: `<svelte:options customElement="my-card" />` plus the `customElement: true` compiler option. Useful for design systems shared across frameworks, with some limitations (SSR, styling via shadow DOM).

---

# 🟡 Part 3: Mid (3–5 years)

### Q56. How does Svelte 5 reactivity work internally? *(Must-know)*
Svelte 5 uses **signals**: `$state` creates a signal source; reading it inside a **derived** or **effect** (or a template expression) registers a dependency; writing it notifies dependents, which are scheduled to re-run (**fine-grained** updates). `$derived` is a computed signal (memoized, lazily validated, push-pull). Effects are batched and flushed in a microtask after the state changes. `$state` objects/arrays are wrapped in **proxies** that create signals per property on demand. The compiler transforms runes into calls to the internal signal runtime (`$.get`, `$.set`, `$.derived`, `$.template_effect`...).
**Why it matters:** updates touch only the DOM nodes depending on the changed value, without re-running the whole component or diffing a virtual DOM.

### Q57. Why is there no virtual DOM, and what does the compiler output look like?
The compiler analyzes the template and generates code that **creates DOM nodes once** and attaches **targeted update functions** (effects) for each dynamic expression.
```svelte
<p>Count: {count}</p>
```
compiles (conceptually) to: create `<p>`, create a text node, and an effect that sets `text.nodeValue = 'Count: ' + count` whenever `count` changes. No component re-render, no tree diff. Trade-off: the framework does heavy lifting at build time; very dynamic template structures still use block logic (`if`/`each` blocks).

### Q58. Effects: rules, pitfalls and `untrack`
- Do not update state that the same effect reads unless you intend a loop (Svelte throws `effect_update_depth_exceeded` on infinite loops).
- Do not use effects to synchronize state with other state; use `$derived`.
- Reads after `await` or in callbacks are not tracked: read what you need **before** the async boundary.
- `untrack` prevents dependency tracking for a read.
- `$effect.root` creates an effect scope not tied to a component (must be cleaned up manually).
- `$effect.tracking()` tells whether you are in a tracking context.
```svelte
$effect(() => {
  const q = query;                                  // tracked
  const controller = new AbortController();
  fetch(`/api?q=${q}`, { signal: controller.signal }).then((r) => r.json()).then((d) => (results = d));
  return () => controller.abort();                  // cleanup avoids race conditions
});
```
For data in SvelteKit, prefer `load` functions (SSR-friendly, cancelable, cached) over effect-based fetching.

### Q59. `$state` vs `$state.raw` and performance
Deep proxies cost memory and time for very large structures. Use `$state.raw` for large immutable data (reassign to update), or keep data outside state and expose a version counter. Prefer small, focused state; use `$derived` to compute views instead of copying data.

### Q60. `$bindable` and when to use two-way binding
```svelte
<!-- TextField.svelte -->
<script>
  let { value = $bindable(''), label } = $props();
</script>
<label>{label}<input bind:value /></label>
<!-- Parent -->
<TextField label="Email" bind:value={email} />
```
Two-way binding is convenient for form-like components, but prefer **callback props or controlled patterns** for complex data flows, because bindings hide where state changes come from.

### Q61. Snippets as a replacement for slots: advanced use
Snippets are values: you can pass them as props, store them, and render with arguments, which enables render-prop-like patterns with type safety.
```svelte
<!-- List.svelte -->
<script>
  let { items, row, empty } = $props();
</script>
{#each items as item (item.id)}{@render row(item)}{:else}{@render empty?.()}{/each}
<!-- usage -->
<List {items}>
  {#snippet row(item)}<li>{item.name}</li>{/snippet}
  {#snippet empty()}<p>No items</p>{/snippet}
</List>
```
Typed with `Snippet<[Item]>` from `svelte`.

### Q62. `<svelte:boundary>` for errors and pending state (Svelte 5.3+)
```svelte
<svelte:boundary onerror={(e, reset) => report(e)}>
  <Widget />
  {#snippet failed(error, reset)}
    <p>Something went wrong: {error.message}</p><button onclick={reset}>Retry</button>
  {/snippet}
</svelte:boundary>
```
Boundaries catch errors thrown while rendering/in effects in their subtree. Newer versions add `pending` snippets and async support (experimental `await` in components); check the docs for the current status.

### Q63. SvelteKit rendering modes per route
| Option | Effect |
|---|---|
| default | SSR on request + hydration |
| `prerender = true` | Static HTML at build time (needs data available at build; crawls links) |
| `prerender = 'auto'` | Prerender but still allow dynamic fallback |
| `ssr = false` | Client-only rendering for that route |
| `csr = false` | No client JavaScript (pure HTML, forms use native POST) |
You can mix modes in one app (static marketing pages, dynamic dashboard).

### Q64. Streaming with promises in `load`
Return unresolved promises (nested in the returned object) from server `load`; SvelteKit sends the page shell first and streams resolved values as they arrive; in the page, `{#await data.comments}` shows pending/resolved states. Awaiting such promises in the load function itself blocks the response.

### Q65. Caching and headers
`setHeaders({ 'cache-control': 'public, max-age=60, stale-while-revalidate=300' })` in `load`, or set headers in `+server.js` responses and in `handle`. Static assets from `build/_app/immutable/*` are hashed and cached for a year. For CDN caching of SSR pages, set `Cache-Control` carefully (only for public, non-personalized content) and vary on cookies if needed.

### Q66. Security in SvelteKit
- **CSRF:** form actions and endpoints check the `Origin` header for cross-site form POSTs (`csrf.checkOrigin`, default on in v1; check v2 docs for `trustedOrigins`).
- **XSS:** Svelte escapes expressions; `{@html}` is raw. Sanitize before using it.
- **Cookies:** `httpOnly`, `secure`, `sameSite`, and always set `path`.
- **CSP:** configure `kit.csp` (nonces/hashes handled for inline scripts SvelteKit adds).
- **Secrets:** `$env/static/private` and `$lib/server/*` cannot be imported by client code.
- **Auth checks** in each action/endpoint, not just in `+layout` loads.
- **Rate limiting** and validation on endpoints.

### Q67. Error handling strategy
Expected errors: `error(status, message)` (shown in `+error.svelte`). Unexpected errors: logged in `handleError` and replaced with a generic message. Form errors: `fail()` with data. Client navigation errors: `+error.svelte` per layout level; use `<svelte:boundary>` for component-level failures. Add monitoring (Sentry) in both server and client hooks.

### Q68. Optimizing performance in a Svelte app
- Prefer SSR/prerender for first paint; use code splitting (automatic) and lazy-load heavy widgets.
- Key `{#each}` blocks; avoid creating large `$state` proxies for read-only data (`$state.raw`).
- Use `$derived` instead of effects that set state.
- Avoid heavy work in templates (compute in `$derived`).
- Virtualize long lists (e.g., `svelte-virtual-list`, TanStack Virtual).
- Use `loading="lazy"` for images, `@sveltejs/enhanced-img` for optimized images.
- Preload on hover, cache API responses, compress (Brotli) at the CDN.
- Measure: Lighthouse, Web Vitals, Svelte DevTools, Vite bundle visualizer.

### Q69. Images and assets
`@sveltejs/enhanced-img` generates responsive `srcset`, modern formats and width/height at build time.
```svelte
<enhanced:img src="./hero.jpg" alt="Hero" sizes="(min-width: 768px) 50vw, 100vw" />
```
Put static files in `static/`; import assets from `src` to get hashed URLs.

### Q70. Environment-specific code: `browser`, `dev`, `building`
```js
import { browser, dev, building } from '$app/environment';
if (browser) { /* window APIs */ }
```
Use `onMount`/`$effect` for browser-only logic; guard `window`/`document` in shared code to avoid SSR crashes.

### Q71. Param matchers and advanced routing
```js
// src/params/integer.js
export const match = (param) => /^\d+$/.test(param);
// route: src/routes/items/[id=integer]/+page.svelte
```
Layout groups `(group)`, layout reset `+page@.svelte`/`+layout@(group).svelte`, rest params `[...path]`, optional params `[[lang]]`, and `reroute` for URL rewriting. Shallow routing (`pushState`, `replaceState` from `$app/navigation`) lets you create history entries and modals without navigating (`page.state`).

### Q72. Deployment: adapters in detail
`adapter-auto` detects the platform; `adapter-node` builds a Node server (`node build`); `adapter-static` outputs static files (needs `prerender` for all pages, SPA mode via `fallback`); `adapter-vercel`/`netlify`/`cloudflare` build for those platforms (edge or serverless options). Test the production build with `npm run build && npm run preview` (note: preview approximates but is not identical to the real adapter runtime).

### Q73. Docker deployment with `adapter-node`
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY package.json .
EXPOSE 3000
CMD ["node", "build"]
```
Configure `ORIGIN` (needed for correct CSRF/origin handling behind proxies), `PROTOCOL_HEADER`/`HOST_HEADER`, and body size limits via env variables.

### Q74. Using a database
Use an ORM (Drizzle or Prisma) inside `$lib/server/db.js` and call it from server `load`, actions and endpoints. Never import server modules into client code. Reuse connections (singleton, pooling); in serverless/edge use HTTP-based drivers or pooled connections.

### Q75. Working with third-party libraries that touch the DOM
Initialize them in `onMount` or `$effect` (browser only), attach via `bind:this`, destroy them in the cleanup function, and import them dynamically when they break SSR (`const lib = await import('lib')` inside `onMount`).

### Q76. Handling forms with Superforms and Zod (pattern)
Define a Zod schema shared by client and server; use Superforms (`superValidate`, `message`) in `+page.server.js` for validation, error mapping and progressive enhancement; client-side validation improves UX, server validation remains the source of truth.

### Q77. Svelte vs React: how to answer migration or choice questions *(Decision)*
| Consideration | Svelte/SvelteKit | React/Next.js |
|---|---|---|
| Learning curve | Low | Medium |
| Bundle size / runtime | Smaller | Larger |
| Ecosystem and hiring | Smaller | Largest |
| Meta-framework maturity | Good, simpler | Very rich, more complex |
| Server components model | Not applicable (load functions + SSR) | RSC |
| State model | Signals (runes) | Hooks + re-render |
Pick Svelte for small-to-medium teams, content/product sites, performance-sensitive UIs, or when DX matters most. Pick React when the ecosystem, hiring and existing investment dominate.

### Q78. Accessibility practice in Svelte
Use semantic HTML, fix compiler a11y warnings, manage focus on navigation/dialogs (SvelteKit moves focus to the body/`autofocus` after navigation; customize with `data-sveltekit-keepfocus`), label form controls, announce updates with `aria-live`, and test with axe/Playwright accessibility checks.


---

# 🟠 Part 4: Senior (5–7 years)

### Q79. How do you structure a large SvelteKit application? *(Architecture)*
```
src/
  lib/
    components/        # reusable UI (headless + styled)
    server/            # server-only: db, auth, email (cannot be imported by client code)
    features/
      orders/          # feature folder: components, state (.svelte.js), schemas, api
    utils/
  routes/
    (marketing)/       # static pages
    (app)/             # authenticated app (guarded layout)
    api/               # +server.js endpoints
  hooks.server.js
  hooks.client.js
  app.html
```
Rules: keep server code under `$lib/server`, share Zod schemas between client and server, group by feature, keep routes thin (compose lib code), and write a short ADR for state, data loading and auth patterns.

### Q80. State management architecture in Svelte 5 *(Decision)*
| State kind | Where |
|---|---|
| Server data for a page | `load` functions (+ `invalidate`) |
| URL state (filters, page, tab) | `url.searchParams` + `goto` / links |
| Form state | Form actions + `use:enhance` (+ Superforms) |
| Local UI state | `$state` in the component |
| Cross-component client state | `.svelte.js` modules/classes with `$state`, or context |
| Per-request/per-user server state | `event.locals`, context (never module scope on the server) |
| Async streams/events | Stores (`readable`) or `$effect` + cleanup |
Avoid duplicating server data in client state; derive with `$derived`; invalidate instead of syncing manually.

### Q81. SSR safety: module-level state leaks between users *(Must-know)*
Module code runs **once per server process**, so a `$state` created at module level is **shared by all requests**.
```js
// ❌ shared across users on the server
export const user = $state({ name: null });

// ✅ per-request via context (created in +layout.svelte, which runs per request)
// ✅ or per-request via event.locals / load data
```
Safe module-level state is state that is the same for everyone (feature flags, constants) or state only used in the browser. For per-user state use `setContext/getContext` (created inside a component, so SSR-safe) or pass data from `load`.

### Q82. SvelteKit data flow in depth
1. Request → `handle` hook (auth, locale, headers).
2. Router matches the route; **layout and page `load` functions** run **in parallel** (server `load` first for server-only data, then universal `load` with the server data available).
3. Data is serialized (devalue) into the HTML for hydration.
4. Components render on the server → HTML streamed.
5. The browser hydrates; later navigations call `load` again **only for functions whose dependencies changed**.
Dependency tracking: `params`, `url` properties accessed, `await parent()`, `fetch` URLs, and `depends()` keys. Use `invalidate(...)` for precision instead of `invalidateAll()`.

### Q83. Avoiding load waterfalls
`await parent()` serializes child loads after parent loads. Instead: fetch independent data in each `load` and use `Promise.all`; move shared data to the layout and **read it from `data` in the page component**, not by awaiting `parent()` in `load`; return promises to stream non-critical data; prefetch with `data-sveltekit-preload-data`.

### Q84. Migration from Svelte 4 to Svelte 5 *(Scenario)*
1. Upgrade dependencies (Svelte, SvelteKit, Vite plugin, preprocessors, testing libs); check that libraries support Svelte 5.
2. Run `npx sv migrate svelte-5`; it converts many patterns automatically.
3. Review manually: `$:` blocks (decide `$derived` vs `$effect`), `export let` → `$props()`, `createEventDispatcher` → callback props, slots → snippets, `on:` → `on*` attributes, `beforeUpdate/afterUpdate`, stores usage, class components (`new Component`) → `mount`.
4. Migrate **component by component** (legacy mode and runes mode can coexist in an app, but not inside one component).
5. Run tests and visual checks; compare bundle size and performance.
6. Remove deprecated patterns over time (lint rules, `svelte-check`).

### Q85. SvelteKit 1 → 2 changes (high level)
`redirect()` and `error()` no longer need `throw`; stricter `goto`/URL handling; `paths.relative` default changes; dotenv/Vite 5 updates; removed deprecated APIs and `preloadData` changes. Use `npx sv migrate sveltekit-2` and read the official migration guide.

### Q86. Authoring a component library
Use `@sveltejs/package` (`svelte-package`) to compile `src/lib` into `dist` with types. Export via `package.json` `exports` with the `svelte` condition, set `peerDependencies` for `svelte`, avoid importing SvelteKit-only modules (`$app/*`) in the library (or isolate them), document props with TypeScript, test with Vitest and Storybook/Histoire, and version with semver. Keep styles scoped or expose CSS custom properties for theming.

### Q87. Testing strategy
- **Unit:** pure functions and `.svelte.js` modules with Vitest.
- **Component:** `@testing-library/svelte` (or Vitest browser mode) for behavior.
- **Integration:** `load` functions, actions and endpoints called directly with mocked `event` objects.
- **E2E:** Playwright against the production build for critical journeys (login, checkout).
- **Static:** `svelte-check`, ESLint (`eslint-plugin-svelte`), Prettier (`prettier-plugin-svelte`).
Run all in CI; seed deterministic data for E2E.

### Q88. Realtime features
SvelteKit endpoints can stream **SSE** (`ReadableStream`). WebSockets need a custom server (with `adapter-node`) or a managed service (Pusher, Ably, Supabase Realtime); serverless/edge deployments cannot hold long-lived sockets. Combine events with `invalidate` to refresh `load` data, and clean up subscriptions in `$effect` cleanup.

### Q89. Edge and serverless considerations
Cloudflare Workers/edge runtimes lack Node APIs (`fs`, many npm packages) and use platform bindings (`event.platform.env`). Choose edge-compatible libraries (HTTP DB drivers), keep bundles small, watch cold starts and execution limits, and test with the real runtime (`wrangler dev`), because `vite preview` does not emulate it.

### Q90. Security hardening checklist *(Must-know)*
- CSP via `kit.csp`; security headers in `handle`.
- Validate **all** inputs on the server (Zod); never trust client validation.
- Check authentication and authorization in **every** action and endpoint.
- Cookies: `httpOnly`, `secure`, `sameSite`, explicit `path`; rotate sessions.
- CSRF: keep origin checking enabled; set `ORIGIN` correctly behind proxies.
- Avoid `{@html}` with untrusted content (sanitize with DOMPurify on the server or client).
- Rate limiting and brute-force protection on auth endpoints.
- Keep secrets in `$env/static/private`; never expose via `PUBLIC_`.
- Dependency audits and lockfiles; patch Svelte/SvelteKit/Vite regularly.

### Q91. Observability
Use `handleError` (server and client hooks) to send errors to Sentry/Datadog with request IDs; log in `handle` (method, path, status, duration); collect Web Vitals in the client hook; add OpenTelemetry in `adapter-node`; monitor cache hit ratios and slow `load` calls.

### Q92. File uploads
Parse `request.formData()` in an action/endpoint, validate type and size, and stream to storage. For large files use pre-signed URLs. Configure body size limits (`BODY_SIZE_LIMIT` in `adapter-node`, platform limits elsewhere).
```js
export const actions = { upload: async ({ request }) => {
  const data = await request.formData(); const file = data.get('file');
  if (!(file instanceof File) || file.size > 5_000_000 || !file.type.startsWith('image/')) return fail(400, { error: 'Invalid file' });
  await store(file); return { ok: true };
} };
```

### Q93. Design system in Svelte
Tokens as CSS custom properties; components accept `class`, `...rest` and snippets for composition; headless primitives (Bits UI/Melt UI) for accessibility; theming through `data-theme` and custom properties; Storybook or Histoire for docs; visual regression (Chromatic/Playwright); accessibility tests; semantic versioning.

### Q94. i18n architecture
Locale in the URL (`/en/...`) with a `reroute`/`handle` hook, message catalogs per route or namespace (Paraglide is tree-shakable), `<html lang>` set via `transformPageChunk`, `Intl` formatting, RTL support, and `hreflang` links in `<svelte:head>`. Avoid shipping all locales to the browser.

### Q95. Performance engineering workflow
Measure (Lighthouse, field Web Vitals) → find the bottleneck (TTFB: slow `load`/DB; LCP: image or render-blocking; INP: heavy effects/handlers; bundle size) → fix (parallel loads, caching, prerender, `@sveltejs/enhanced-img`, split heavy widgets, virtualize lists, `$state.raw` for big data, avoid effect chains) → verify with budgets in CI.

### Q96. Build tooling and DX
SvelteKit uses Vite: configure `vite.config.js` (aliases, plugins, `optimizeDeps`, `server.proxy`), use `vite-plugin-svelte` options (`compilerOptions`, `preprocess`), TypeScript with `svelte-preprocess`/built-in TS support, and monorepo workspaces (pnpm). Keep dev and production parity by testing the built app.

### Q97. Ecosystem risk management
The Svelte ecosystem is smaller than React's. Mitigate: prefer libraries with active maintenance and Svelte 5 support, favor headless/simple dependencies, wrap third-party libraries behind your own components, write small utilities in-house instead of adding packages, and plan for framework-agnostic business logic (keep domain code in plain TypeScript).

### Q98. Interop with other frameworks
Compile to **custom elements** for embedding in React/Angular/Vue apps, use iframes for isolated micro-frontends, share business logic as plain TS packages, and use module federation-like approaches with care. Mixed-framework pages increase bundle size and complexity, so keep boundaries clear.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q99. How do you decide between Svelte/SvelteKit and React/Next.js, Vue/Nuxt or Angular? *(Decision)*
Evaluate: team skills and hiring market, project type (content, product, internal tool), performance targets, ecosystem needs (UI kits, auth, CMS integrations), long-term maintenance, vendor/community health, and migration risk. Run a **time-boxed spike** building a real feature in each candidate, measure developer speed, bundle size, performance and test experience. Document the decision in an ADR with exit options.

### Q100. Adoption plan for Svelte in an organization
Start with a low-risk product area; create a starter template (SvelteKit + TypeScript + ESLint + Playwright + auth + logging); train developers (runes, load/actions, SSR pitfalls); define conventions (state placement, folder structure, testing); measure outcomes (delivery speed, defects, performance); expand gradually.

### Q101. Governance and standards
Coding standards (runes usage rules, no effects for derived state, no module-level state on the server), lint rules (`eslint-plugin-svelte`, `svelte-check`), PR checklist (accessibility, SSR safety, error states), dependency policy, component library ownership, security review for endpoints/actions, and a documentation site with examples.

### Q102. Migration from React/Vue/Angular to Svelte (or incremental coexistence)
Strangler pattern: new routes in SvelteKit behind a reverse proxy while the old app serves the rest, shared design tokens/CSS, shared API contracts, embedding via custom elements where needed, route-by-route replacement, feature flags, and metrics comparisons (Web Vitals, errors, delivery time). Avoid a big-bang rewrite.

### Q103. Long-term maintenance and upgrade policy
Track Svelte/SvelteKit/Vite releases, upgrade minor versions regularly, major versions with a migration branch and codemods, pin versions in lockfiles, run automated dependency updates (Renovate), keep a deprecation backlog, and test upgrades against E2E and visual tests.

### Q104. Risk management
Risks: small ecosystem, fewer senior hires, breaking changes between majors (4 → 5), library gaps. Mitigations: keep business logic framework-agnostic, wrap libraries, invest in internal training, maintain good documentation, contribute upstream when needed, and keep an escape plan (clean architecture boundaries).

### Q105. Hiring and training
Hire strong JavaScript/TypeScript and web fundamentals engineers (Svelte is learnable in days); interview on reactivity, SSR vs CSR, data loading, and web platform knowledge. Provide onboarding materials, pair on the first features, and code review with a runes/SSR checklist.

### Q106. Platform strategy and deployment
Choose adapters by needs: Node for control and WebSockets, serverless/edge for global latency, static for content sites. Standardize CI/CD, environment management, secrets, observability and rollback. Document the production runtime differences from `preview`.

### Q107. Metrics for success
Core Web Vitals (field), bundle size per route, build and deploy time, error rates by release, developer cycle time, test stability (flaky rate), accessibility defect count, and cost per request. Review quarterly.

### Q108. Documentation and knowledge sharing
ADRs for architecture choices, a "how we use SvelteKit" guide (data loading, auth, forms, error handling), examples of good and bad code (SSR state leaks, effects misuse), runbooks for incidents, and short internal talks on internals (signals, hydration).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice each task from memory. Mention SSR safety, accessibility, and cleanup.

### C1. Counter with step (runes)
```svelte
<script>
  let count = $state(0);
  let step = $state(1);
  let doubled = $derived(count * 2);
</script>
<p aria-live="polite">Count: {count} (double: {doubled})</p>
<label>Step <input type="number" bind:value={step} min="1" /></label>
<button onclick={() => (count -= step)}>-</button>
<button onclick={() => (count += step)}>+</button>
<button onclick={() => (count = 0)}>Reset</button>
```

### C2. Todo app (add, toggle, delete, filter)
```svelte
<script>
  let todos = $state([]);
  let text = $state('');
  let filter = $state('all');
  let visible = $derived(todos.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done)));
  let remaining = $derived(todos.filter((t) => !t.done).length);

  function add(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    todos.push({ id: crypto.randomUUID(), text: value, done: false });
    text = '';
  }
  const remove = (id) => (todos = todos.filter((t) => t.id !== id));
</script>

<form onsubmit={add}><input bind:value={text} placeholder="New task" /><button>Add</button></form>
<select bind:value={filter}><option value="all">All</option><option value="active">Active</option><option value="done">Done</option></select>
<p>{remaining} remaining</p>
<ul>
  {#each visible as todo (todo.id)}
    <li>
      <label><input type="checkbox" bind:checked={todo.done} /> <span class:done={todo.done}>{todo.text}</span></label>
      <button onclick={() => remove(todo.id)} aria-label={`Delete ${todo.text}`}>✕</button>
    </li>
  {/each}
</ul>
<style>.done { text-decoration: line-through; }</style>
```

### C3. Fetch with loading, error and abort (`$effect`)
```svelte
<script>
  let { userId } = $props();
  let user = $state(null), loading = $state(true), error = $state(null);

  $effect(() => {
    const controller = new AbortController();
    loading = true; error = null;
    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => (user = d))
      .catch((e) => { if (e.name !== 'AbortError') error = e; })
      .finally(() => { if (!controller.signal.aborted) loading = false; });
    return () => controller.abort();
  });
</script>
{#if loading}<p>Loading...</p>{:else if error}<p role="alert">{error.message}</p>{:else}<h2>{user.name}</h2>{/if}
```
(In SvelteKit prefer a `load` function: it is SSR-friendly, cancelable and cached.)

### C4. Debounced search
```svelte
<script>
  let query = $state('');
  let results = $state([]);
  $effect(() => {
    const q = query.trim();
    if (!q) { results = []; return; }
    const id = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      results = await res.json();
    }, 300);
    return () => clearTimeout(id);               // debounce: cancel the previous timer
  });
</script>
<input bind:value={query} placeholder="Search..." aria-label="Search" />
<ul>{#each results as r (r.id)}<li>{r.name}</li>{/each}</ul>
```

### C5. Reusable `TextField` with `$bindable` and rest props
```svelte
<!-- TextField.svelte -->
<script>
  let { value = $bindable(''), label, error, id = crypto.randomUUID(), ...rest } = $props();
</script>
<label for={id}>{label}</label>
<input {id} bind:value aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
{#if error}<p id="{id}-err" role="alert">{error}</p>{/if}
<!-- usage: <TextField label="Email" type="email" bind:value={email} error={errors.email} /> -->
```

### C6. Modal with `<dialog>` and snippets
```svelte
<!-- Modal.svelte -->
<script>
  let { open = $bindable(false), title, children, footer } = $props();
  let dialog;
  $effect(() => { if (open) dialog?.showModal(); else dialog?.close(); });
</script>
<dialog bind:this={dialog} onclose={() => (open = false)} aria-labelledby="modal-title">
  <h2 id="modal-title">{title}</h2>
  {@render children?.()}
  <div class="actions">{@render footer?.()}</div>
</dialog>
<!-- usage -->
<Modal bind:open title="Delete item?">
  <p>This cannot be undone.</p>
  {#snippet footer()}<button onclick={() => (open = false)}>Cancel</button><button onclick={confirm}>Delete</button>{/snippet}
</Modal>
```
The native dialog gives focus trap, ESC and backdrop for free.

### C7. Accordion (single open)
```svelte
<script>
  let { items } = $props();
  let openId = $state(null);
</script>
{#each items as item (item.id)}
  <h3><button aria-expanded={openId === item.id} aria-controls="p-{item.id}" onclick={() => (openId = openId === item.id ? null : item.id)}>{item.title}</button></h3>
  <div id="p-{item.id}" role="region" hidden={openId !== item.id}>{item.content}</div>
{/each}
```

### C8. `clickOutside` action and dropdown
```js
// click-outside.js
export function clickOutside(node, handler) {
  const onPointer = (e) => { if (!node.contains(e.target)) handler(e); };
  document.addEventListener('pointerdown', onPointer, true);
  return { update(next) { handler = next; }, destroy() { document.removeEventListener('pointerdown', onPointer, true); } };
}
```
```svelte
<script>
  import { clickOutside } from './click-outside.js';
  let open = $state(false);
</script>
<div use:clickOutside={() => (open = false)}>
  <button aria-expanded={open} onclick={() => (open = !open)}>Menu</button>
  {#if open}<ul role="menu"><li role="menuitem">Profile</li><li role="menuitem">Logout</li></ul>{/if}
</div>
```

### C9. Infinite scroll with an `IntersectionObserver` action
```js
export function inView(node, { onEnter, rootMargin = '300px' } = {}) {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) onEnter?.(); }, { rootMargin });
  io.observe(node);
  return { destroy: () => io.disconnect() };
}
```
```svelte
<script>
  import { inView } from './in-view.js';
  let items = $state([...initial]);
  let page = $state(1), done = $state(false), loading = false;
  async function more() {
    if (loading || done) return; loading = true;
    const next = await (await fetch(`/api/items?page=${++page}`)).json();
    if (next.length === 0) done = true; else items.push(...next);
    loading = false;
  }
</script>
<ul>{#each items as i (i.id)}<li>{i.name}</li>{/each}</ul>
{#if !done}<div use:inView={{ onEnter: more }}>Loading...</div>{/if}
```

### C10. Shared cart state (class with runes)
```js
// cart.svelte.js
export class Cart {
  items = $state([]);
  total = $derived(this.items.reduce((s, i) => s + i.price * i.qty, 0));
  count = $derived(this.items.reduce((s, i) => s + i.qty, 0));
  add(product) {
    const found = this.items.find((i) => i.id === product.id);
    if (found) found.qty += 1; else this.items.push({ ...product, qty: 1 });
  }
  remove(id) { this.items = this.items.filter((i) => i.id !== id); }
}
```
```svelte
<!-- +layout.svelte: SSR-safe, one cart per request/user -->
<script>
  import { setContext } from 'svelte';
  import { Cart } from '$lib/cart.svelte.js';
  setContext('cart', new Cart());
  let { children } = $props();
</script>
{@render children()}
<!-- any child: const cart = getContext('cart'); {cart.count} items -->
```

### C11. A persistent store (works in Svelte 4 and 5)
```js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export function persisted(key, initial) {
  const start = browser ? JSON.parse(localStorage.getItem(key) ?? 'null') ?? initial : initial;
  const store = writable(start);
  if (browser) store.subscribe((v) => localStorage.setItem(key, JSON.stringify(v)));
  return store;
}
export const theme = persisted('theme', 'light');
```

### C12. Theme context with system preference
```svelte
<!-- ThemeProvider.svelte -->
<script>
  import { setContext } from 'svelte';
  let { children } = $props();
  const theme = $state({ mode: 'light' });
  $effect(() => {
    theme.mode = localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  $effect(() => { document.documentElement.dataset.theme = theme.mode; localStorage.setItem('theme', theme.mode); });
  setContext('theme', theme);
</script>
{@render children()}
```
(To avoid a flash on first load, set the theme with a tiny inline script in `app.html`.)

### C13. Login: form action, cookie and redirect
```js
// src/routes/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const user = await verifyCredentials(email, password);
    if (!user) return fail(400, { email, error: 'Invalid email or password' });
    cookies.set('session', await createSession(user.id), { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
    redirect(303, '/dashboard');
  },
};
```
```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>
<form method="POST" use:enhance>
  <label>Email <input name="email" type="email" value={form?.email ?? ''} required /></label>
  <label>Password <input name="password" type="password" required /></label>
  {#if form?.error}<p role="alert">{form.error}</p>{/if}
  <button>Sign in</button>
</form>
```

### C14. CRUD page: load + create/delete actions
```js
// +page.server.js
import { fail } from '@sveltejs/kit';
export async function load({ locals }) { return { todos: await db.todo.findMany({ where: { userId: locals.user.id } }) }; }
export const actions = {
  create: async ({ request, locals }) => {
    const text = String((await request.formData()).get('text') ?? '').trim();
    if (text.length < 2) return fail(400, { error: 'Too short' });
    await db.todo.create({ data: { text, userId: locals.user.id } });
  },
  delete: async ({ request, locals }) => {
    const id = String((await request.formData()).get('id'));
    await db.todo.deleteMany({ where: { id, userId: locals.user.id } });     // scope by user
  },
};
```
```svelte
<form method="POST" action="?/create" use:enhance><input name="text" /><button>Add</button></form>
{#each data.todos as t (t.id)}
  <form method="POST" action="?/delete" use:enhance><input type="hidden" name="id" value={t.id} /><span>{t.text}</span><button>Delete</button></form>
{/each}
```
After a successful action, `use:enhance` re-runs `load` automatically.

### C15. REST endpoint with validation and auth
```js
// src/routes/api/posts/+server.js
import { json, error } from '@sveltejs/kit';
import { z } from 'zod';
const Body = z.object({ title: z.string().min(3), body: z.string().min(10) });
export async function GET({ url }) {
  const page = Number(url.searchParams.get('page') ?? 1);
  return json(await db.post.findMany({ skip: (page - 1) * 10, take: 10 }));
}
export async function POST({ request, locals }) {
  if (!locals.user) error(401, 'Unauthorized');
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ errors: parsed.error.flatten() }, { status: 400 });
  return json(await db.post.create({ data: { ...parsed.data, authorId: locals.user.id } }), { status: 201 });
}
```

### C16. `hooks.server.js`: auth, security headers and error handling
```js
import { redirect } from '@sveltejs/kit';
export async function handle({ event, resolve }) {
  const token = event.cookies.get('session');
  event.locals.user = token ? await getUserFromSession(token) : null;

  if (event.url.pathname.startsWith('/admin') && !event.locals.user?.isAdmin) redirect(303, '/login');

  const response = await resolve(event);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
export function handleError({ error, event }) {
  const id = crypto.randomUUID();
  console.error(id, event.url.pathname, error);
  return { message: 'Something went wrong', id };
}
```

### C17. Pagination driven by the URL
```js
// +page.server.js
export async function load({ url }) {
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const { items, total } = await getItems({ page, pageSize: 10 });
  return { items, page, pages: Math.ceil(total / 10) };
}
```
```svelte
<nav aria-label="Pagination">
  {#if data.page > 1}<a href="?page={data.page - 1}">Previous</a>{/if}
  <span>{data.page} / {data.pages}</span>
  {#if data.page < data.pages}<a href="?page={data.page + 1}">Next</a>{/if}
</nav>
```

### C18. Streaming slow data with `{#await}`
```js
export async function load({ fetch }) {
  return {
    post: await (await fetch('/api/post')).json(),         // awaited: blocks the response
    comments: fetch('/api/comments').then((r) => r.json()),  // not awaited: streamed
  };
}
```
```svelte
<h1>{data.post.title}</h1>
{#await data.comments}<p>Loading comments...</p>{:then comments}{#each comments as c (c.id)}<p>{c.text}</p>{/each}{:catch}<p>Could not load comments</p>{/await}
```

### C19. Animated list
```svelte
<script>
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  let items = $state([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
  const shuffle = () => (items = [...items].sort(() => Math.random() - 0.5));
</script>
<button onclick={shuffle}>Shuffle</button>
<ul>
  {#each items as item (item.id)}
    <li animate:flip={{ duration: 250 }} in:fly={{ y: 10 }} out:fly={{ y: -10 }}>{item.name}</li>
  {/each}
</ul>
```

### C20. Error boundary
```svelte
<svelte:boundary onerror={(e) => report(e)}>
  <RiskyWidget />
  {#snippet failed(error, reset)}
    <div role="alert"><p>Widget failed: {error.message}</p><button onclick={reset}>Retry</button></div>
  {/snippet}
</svelte:boundary>
```

### C21. Server-Sent Events endpoint and client
```js
// src/routes/events/+server.js
export function GET() {
  let timer;
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder(); let i = 0;
      timer = setInterval(() => controller.enqueue(enc.encode(`data: ${JSON.stringify({ tick: ++i })}\n\n`)), 1000);
    },
    cancel() { clearInterval(timer); },
  });
  return new Response(stream, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' } });
}
```
```svelte
<script>
  let tick = $state(0);
  $effect(() => {
    const es = new EventSource('/events');
    es.onmessage = (e) => (tick = JSON.parse(e.data).tick);
    return () => es.close();
  });
</script>
<p>Tick: {tick}</p>
```

### C22. Unit test a rune-based module
```js
// counter.svelte.js
export class Counter { count = $state(0); double = $derived(this.count * 2); inc() { this.count++; } }
// counter.svelte.test.js
import { flushSync } from 'svelte';
import { expect, test } from 'vitest';
import { Counter } from './counter.svelte.js';
test('derived updates', () => {
  const c = new Counter();
  c.inc(); c.inc();
  flushSync();
  expect(c.double).toBe(4);
});
```
(Test files for modules using runes must also use the `.svelte.test.js` naming so the compiler processes runes.)

### C23. Playwright E2E test
```js
import { test, expect } from '@playwright/test';
test('user can sign in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('ritesh@example.com');
  await page.getByLabel('Password').fill('correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
```

### C24. `svelte.config.js` with adapter-node, CSP and alias
```js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: { $components: 'src/lib/components' },
    csp: { mode: 'auto', directives: { 'default-src': ['self'], 'script-src': ['self'], 'img-src': ['self', 'data:'], 'frame-ancestors': ['none'] } },
  },
};
```

### C25. Param matcher and layout groups
```
src/params/integer.js          -> export const match = (p) => /^\d+$/.test(p);
src/routes/(app)/items/[id=integer]/+page.svelte
src/routes/(app)/+layout.server.js     -> guards auth for all (app) routes
src/routes/(marketing)/+layout.svelte  -> public layout
```

### C26. Sitemap endpoint
```js
// src/routes/sitemap.xml/+server.js
export const prerender = true;
export async function GET() {
  const posts = await getPosts();
  const urls = ['/', ...posts.map((p) => `/blog/${p.slug}`)].map((u) => `<url><loc>https://example.com${u}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'content-type': 'application/xml' } });
}
```

### C27. Shallow routing: modal that changes the URL
```svelte
<script>
  import { pushState, goto } from '$app/navigation';
  import { page } from '$app/state';
  function open(id) { pushState(`/photos/${id}`, { selected: id }); }
</script>
{#each photos as p}<a href="/photos/{p.id}" onclick={(e) => { e.preventDefault(); open(p.id); }}>{p.title}</a>{/each}
{#if page.state.selected}<PhotoModal id={page.state.selected} onclose={() => history.back()} />{/if}
```
(A real link opens the full page on refresh because `/photos/[id]` also exists as a route. `$app/state` is the Svelte 5-era replacement for `$app/stores`.)

### C28. Compile a component to a custom element
```svelte
<svelte:options customElement="user-card" />
<script>
  let { name = 'Ritesh Kumar' } = $props();
</script>
<div class="card"><strong>{name}</strong></div>
<style>.card { border: 1px solid #ddd; padding: 8px; }</style>
```
Enable `compilerOptions: { customElement: true }` for that build. Use `<user-card name="Ritesh"></user-card>` in any framework.

---

# 🐞 Part 7: Debugging Scenarios

### D1. The list does not update after `push` (Svelte 4)
In Svelte 4, only assignments trigger updates: `todos.push(x)` alone does nothing. Fix: `todos = [...todos, x]` or `todos.push(x); todos = todos;`. In Svelte 5, declare `let todos = $state([])` and `push` works.

### D2. Reactivity is lost after destructuring
```js
let { name } = $state({ name: 'a' });     // `name` is a plain copy
```
Keep the object (`user.name`) or use `$derived(user.name)`. The same applies to destructuring props: it's fine for reading, but if you need reactivity from derived values, use `$derived`.

### D3. `effect_update_depth_exceeded` (infinite loop)
An effect updates state that it also reads. Use `$derived` for computed values, `untrack` for reads that must not subscribe, or add a condition so the update stops.

### D4. `state_unsafe_mutation`
You changed state inside `$derived` or a template expression. Derived and templates must be pure. Move the mutation into an event handler or `$effect`.

### D5. `$derived` does not update
It only tracks reactive reads. Values from plain variables, non-reactive objects, or things read after an `await` are not tracked. Make the source `$state` (or use `SvelteMap`/`SvelteSet` for collections).

### D6. `window is not defined` / `document is not defined` on the server
SSR executed browser-only code at module/component top level. Move it into `onMount`/`$effect`, guard with `browser` from `$app/environment`, or import the library dynamically in `onMount`.

### D7. Hydration mismatch warnings
Server and client render different output (dates, random values, `window` checks). Make the first render deterministic, then update in `onMount`/`$effect`. Check invalid HTML nesting (`<div>` inside `<p>`) and browser extensions.

### D8. "`$:` is not allowed in runes mode" / "`export let` is not allowed in runes mode"
Runes mode and legacy mode cannot mix in one component. Convert the whole component to runes (`$derived`, `$props`) or opt out with `<svelte:options runes={false} />`.

### D9. Mixing `on:click` and `onclick`
You cannot use both event styles in one component in runes mode. Use `onclick={...}` everywhere (migrate `on:` with `sv migrate`).

### D10. Inputs or animations jump when the list changes
Missing key in `{#each}`. Use `{#each items as item (item.id)}`.

### D11. `bind:` does not work on a component prop
The child must declare the prop with `$bindable()` (runes mode). Also check that you pass a variable/property that can be assigned (not a constant).

### D12. Class instance fields are not reactive
Plain class instances are not proxied by `$state`. Declare fields with `$state` inside the class (`count = $state(0)`), not `$state(new Foo())` expecting deep reactivity.

### D13. `Map`/`Set` changes do not update the UI
Use `SvelteMap`/`SvelteSet` from `svelte/reactivity`, or replace the whole collection.

### D14. Form action does not run
Check `method="POST"`, the action name (`action="?/create"`), that `+page.server.js` exports `actions`, that the form has `name` attributes, and that returned data is serializable. With `use:enhance` customizations, remember to call `update()` if you replace the default callback.

### D15. `fetch` in `load` fails on the server or does not send cookies
Use the `fetch` provided in the `load` event, not the global one; it handles relative URLs on the server, forwards cookies for same-origin requests and inlines responses for hydration.

### D16. Environment variable is `undefined` in the browser
Only variables prefixed with `PUBLIC_` and imported from `$env/static/public` (or `$env/dynamic/public`) are available on the client. Private variables cannot be imported into client code (the build fails by design).

### D17. "Cannot import `$env/static/private` into client-side code"
A client-reachable module imports a server-only module. Move that logic to `$lib/server/*`, `+page.server.js`, or `+server.js`, and pass results through `load`.

### D18. Prerender error: "404 while crawling" or dynamic route not prerenderable
Prerendering follows links; a link to a non-prerendered page fails the build. Add `entries()` for dynamic routes, prerender the target, or set `prerender.handleHttpError`. Server-only features (cookies, `request`) are not available at prerender time.

### D19. CORS errors from endpoints
SvelteKit does not add CORS headers. Handle `OPTIONS` and set `Access-Control-Allow-*` headers in `handle` or the endpoint. Avoid `*` with credentials.

### D20. `redirect()` seems ignored inside `try/catch`
`redirect()` and `error()` use exceptions internally. A broad `catch` swallows them. Call them outside `try/catch`, or rethrow using `isRedirect(e)` / `isHttpError(e)` from `@sveltejs/kit`.

### D21. Cookie is not set or not sent
Set `path: '/'` explicitly (required), use `secure: false` only in local HTTP development, set `sameSite` appropriately, and confirm the cookie is set in an action/endpoint/hook (not in client code).

### D22. Scoped CSS does not apply
Styles are scoped to elements in the same component. Classes added to child component roots or by `{@html}` do not receive scoped styles. Use `:global()` for those cases, pass `class` as a prop, or use CSS custom properties.

### D23. A transition does not play
Transitions play when their own block is created/destroyed. In Svelte 5, transitions are **local** by default (they do not play when a parent block toggles); use `|global` if needed. Also confirm the element is inside `{#if}`/`{#each}`.

### D24. Data is stale after a mutation
Re-run `load`: `use:enhance` does this by default after a successful action; for client calls use `invalidate('app:key')` or `invalidateAll()`. Check `depends()` keys and caching headers.

### D25. Memory leak
Manual store subscriptions (`store.subscribe`) without unsubscribing, timers/listeners in effects without cleanup, or third-party instances not destroyed. Return cleanup functions from `$effect`/`onMount`; use the `$store` syntax in components for automatic unsubscription.

### D26. "Cross-site POST form submissions are forbidden" in production
Behind a reverse proxy the app sees a different origin. For `adapter-node` set the `ORIGIN` environment variable (or `PROTOCOL_HEADER`/`HOST_HEADER`), and make sure the proxy forwards the original headers.

### D27. Works with `npm run preview` but not on the platform
Preview is not the real adapter runtime. Test with the platform's emulator (`wrangler dev`, Vercel CLI) or the actual build output (`node build`), and check runtime limits (Node APIs on edge, body size, timeouts).

### D28. A library breaks after upgrading to Svelte 5
It may use removed APIs (class components, `$$props`, `createEventDispatcher` patterns). Upgrade to a Svelte 5-compatible version, replace it, or run it in legacy mode components if it only exports components compatible with that mode.

### D29. Debugging method (say this in interviews)
Check **where** it runs (server, client, build). Read the error code (runes errors have names like `effect_update_depth_exceeded`). Use `$inspect` and Svelte DevTools. Reproduce with `build && preview`. Reduce to a minimal component. Fix the cause, then add a test or lint rule.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Why does `array.push(x)` not update the UI in Svelte 4 but works in Svelte 5?
Svelte 4 tracked **assignments** (`todos = ...`), so mutating methods did nothing unless you re-assigned (`todos = todos`). Svelte 5 wraps `$state` objects and arrays in **proxies** that notice mutations, so `todos.push(x)` triggers updates.

### T2. Does `$:` run top to bottom in Svelte 4?
No. Reactive statements are **topologically sorted** by dependencies, not by source order. They run once initially (after the script body) and again when their dependencies change (batched before the DOM update).

### T3. Does `$effect` run during SSR?
No. Effects run only in the **browser**, after the DOM is created or updated. `$derived` and template expressions do run on the server. Use `$effect` for browser-only side effects.

### T4. What dependencies does `$effect` track?
Only reactive values read **synchronously** during the effect's run. Reads after an `await`, inside `setTimeout`, or inside event handlers are not tracked. Read the values you need at the top of the effect.

### T5. Why does destructuring `$state` break reactivity?
`let { name } = user` copies the value at that moment. It is no longer connected to `user.name`. Keep `user.name`, or use `let name = $derived(user.name)`.

### T6. Which values does `$state` make deeply reactive?
Plain objects and arrays (via proxies). Not class instances, not `Map`/`Set`/`Date` (use `SvelteMap`, `SvelteSet`, `SvelteDate`), not DOM nodes. For classes, put `$state` on the class fields.

### T7. What does `$state.raw` do?
Creates state that is **not deeply proxied**: only re-assignment triggers updates. It is cheaper for large immutable datasets and prevents proxies from wrapping objects that must keep identity.

### T8. Is `$derived` eager or lazy?
It is computed when read and memoized; it re-validates only when a dependency changed. If nothing reads it, it does no work. It must be **pure** (no state mutation).

### T9. Can you mutate props?
A prop is a one-way input. Reassigning a normal prop warns in runes mode. Mutating an object prop that came from the parent's `$state` works but triggers an `ownership` warning; use callback props or `$bindable` for intentional child → parent communication.

### T10. `onMount` with an async function and cleanup
```js
onMount(async () => { ...; return () => cleanup(); });   // ❌ returns a Promise, cleanup is ignored
onMount(() => { (async () => { ... })(); return () => cleanup(); });   // ✅
```
`onMount` only uses a returned **function** as cleanup. Also, `onMount` does not run on the server.

### T11. Are transitions global or local?
**Local by default** (since Svelte 4): they play only when the element's *own* block (`{#if}`/`{#each}`) is created or destroyed, not when a parent block toggles. Add `|global` to play on any ancestor change.

### T12. Events: which Svelte 4 features are gone?
In runes mode: event modifiers (`on:click|preventDefault`), `createEventDispatcher` (use callback props), event forwarding with bare `on:click`. Handlers are normal attributes (`onclick`). You can spread event attributes and pass handlers as props.

### T13. `<script context="module">` in Svelte 5
Renamed to `<script module>`. Code runs once when the module loads (not per component instance). In SvelteKit SSR it is shared by all requests, so avoid user-specific state there.

### T14. `$$props` and `$$restProps`
Legacy mode only. In runes mode use `$props()`: `let { a, ...rest } = $props();`.

### T15. `<svelte:component>` and `<svelte:self>`
In Svelte 5, dynamic components work directly (`<Component {...props} />` where `Component` is a variable), and a component can import itself for recursion; both special elements are deprecated.

### T16. `new App({ target })` in Svelte 5
Components are functions, not classes. Use `mount(App, { target, props })` (and `hydrate`, `unmount`) from `svelte`.

### T17. `+page.js` vs `+page.server.js`: where do they run?
`+page.js` is **universal**: server on first load, browser on client-side navigation. `+page.server.js` is **server only** (the browser calls it through a network request on navigation). Only server `load` can access databases and secrets.

### T18. What can `load` return?
Server `load` must return **serializable** data (SvelteKit uses `devalue`, which supports `Date`, `Map`, `Set`, `BigInt`, `undefined`, regexes, and cyclic references, but not functions or class instances). Universal `load` can return anything, including components or functions, because it runs in the browser too.

### T19. `$app/stores` vs `$app/state`
`$app/state` (SvelteKit 2.12+, Svelte 5) exposes reactive objects (`page`, `navigating`, `updated`) usable without the `$` prefix. `$app/stores` returns stores (`$page`) and is the older API, kept for compatibility.

### T20. Do form actions work on prerendered pages?
No. Actions need a server. Prerendered pages are static HTML; keep pages that submit forms dynamic (or post to an endpoint on another server).

### T21. Why must `cookies.set` include `path`?
There is no default path; omitting it is an error in SvelteKit 2, because the browser would otherwise scope the cookie to the current route's path. Use `path: '/'` for app-wide cookies.

### T22. Why might layout data be stale?
A layout `load` re-runs only when its dependencies change (params it uses, `url` parts it read, `depends` keys, `invalidate`). If user data changes after a mutation, call `invalidate('app:user')` or `invalidateAll()`.

### T23. What does `use:enhance` do by default?
Submits via `fetch`, then on success resets the form, updates the `form` prop, re-runs `load` functions, and handles redirects. Custom callbacks replace this unless you call `update()`.

### T24. `redirect()` and `error()` in SvelteKit 2
No `throw` is needed (they throw internally). Because they work by exceptions, do not place them inside a `try/catch` that swallows errors.

### T25. Keyed `{#each}` items and binding
Binding inside an unkeyed each (`bind:value={item.text}`) binds by index; reordering can bind inputs to the wrong items. Use keys.

### T26. `class:` directive vs `class` attribute
Both can be used together: `<div class="card" class:active>`. In Svelte 5.16+, `class` accepts arrays/objects (clsx-like), reducing the need for `class:`.

### T27. CSS scoping and `:global`
A selector like `.parent .child` only styles `.child` elements in the same component. Child component roots, `{@html}` content, and elements created by other libraries are not scoped; style them with `:global()` or pass CSS custom properties.

### T28. Slots are deprecated, but do they still work?
Yes, in legacy mode and for compatibility, but new code should use **snippets**. You cannot mix slot syntax and runes-only features in one component.

### T29. Is the Svelte runtime really "zero"?
Svelte has a small runtime (reactivity, DOM helpers, transitions) that is **tree-shaken**, so only what you use ships. Hello-world bundles are tiny, but large apps still have normal app code. "Zero-runtime" is marketing shorthand.

### T30. `$inspect` in production
`$inspect` is removed from production builds (dev only). Use it for debugging, not for logic.

### T31. `$state` outside components
`$state` works only in `.svelte`, `.svelte.js` and `.svelte.ts` files, because the compiler must transform the runes. A normal `.js` file cannot use runes.

### T32. Hydration and `{@html}`
`{@html}` content is not diffed during hydration the same way; mismatched HTML can cause issues. Keep it deterministic and sanitized.

### T33. `invalidateAll` vs `invalidate`
`invalidateAll` re-runs all `load` functions on the page (heavy). `invalidate('key-or-url')` re-runs only those that depend on it. Prefer targeted invalidation.

### T34. Prerender and `entries()`
For dynamic routes, SvelteKit needs `export function entries() { return [{ slug: 'a' }, ...]; }` (or links to crawl) to know which pages to prerender.

### T35. SvelteKit `fetch` and cookies
`event.fetch` forwards cookies and `Authorization` headers to same-origin/subdomain requests on the server. Calls to third-party APIs do not get cookies automatically; add them in `handleFetch` if needed.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Svelte is a... | Compiler-based UI framework |
| Virtual DOM? | None |
| Reactive state rune? | `$state` |
| Computed value rune? | `$derived` |
| Side-effect rune? | `$effect` |
| Props rune? | `$props()` |
| Two-way bindable prop? | `$bindable()` |
| Debug rune? | `$inspect` |
| Svelte 4 reactive statement? | `$:` |
| Svelte 4 prop? | `export let` |
| Click handler (v5)? | `onclick={...}` |
| Click handler (v4)? | `on:click={...}` |
| Conditional block? | `{#if}` |
| List block? | `{#each ... (key)}` |
| Promise block? | `{#await}` |
| Re-create block on change? | `{#key}` |
| Raw HTML? | `{@html}` (sanitize first) |
| Reusable markup (v5)? | `{#snippet}` + `{@render}` |
| Element action? | `use:action` |
| Bind input value? | `bind:value` |
| DOM reference? | `bind:this` |
| Runs only in browser after mount? | `onMount` / `$effect` |
| Store creator? | `writable`, `readable`, `derived` |
| Auto-subscribe a store? | `$store` |
| Transition directive? | `transition:`, `in:`, `out:` |
| Reorder animation? | `animate:flip` |
| Head tags? | `<svelte:head>` |
| Meta-framework? | SvelteKit |
| Scaffold command? | `npx sv create` |
| Page file? | `+page.svelte` |
| Server data file? | `+page.server.js` |
| API endpoint file? | `+server.js` |
| Form handler export? | `actions` |
| Progressive form enhancement? | `use:enhance` |
| Shared code alias? | `$lib` |
| Server-only folder? | `$lib/server` |
| Public env prefix? | `PUBLIC_` |
| Prerender setting? | `export const prerender = true` |
| Deployment targets? | Adapters |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a project you built with Svelte/SvelteKit."
**Sample answer (STAR):**
- **S:** Our customer portal (React SPA) had slow first load (LCP 4.1 s on mobile) and a 480 KB JS bundle.
- **T:** Rebuild the public and account pages with better performance and simpler code.
- **A:** I moved to SvelteKit with SSR and prerendering for public pages, used `load` functions for data, form actions with `use:enhance` for forms (they work without JavaScript), runes for state, and `@sveltejs/enhanced-img` for images. I added Playwright tests for login and checkout.
- **R:** JS shipped dropped to ~90 KB, LCP went from 4.1 s to 1.9 s, and new feature delivery was faster because there was less boilerplate (lines of code dropped about 35%).
Tip: tie the benefits to measured numbers.

### P2. "What challenges did you face with Svelte 5?"
Mention migration from `$:`/stores to runes, SSR state leaks from module-level state (fixed with context and `locals`), `$effect` misuse (replaced by `$derived`), and library compatibility. Explain how you migrated component by component and measured regressions.

### P3. "How do you convince a team that prefers React to try Svelte?"
Run a spike on a real feature, compare bundle size, code volume, developer feedback and performance, and be honest about trade-offs (ecosystem, hiring). Propose a low-risk pilot and a clear exit plan.

### P4. "Tell me about a SvelteKit security or SSR bug you fixed."
Example: a module-level `$state` held the current user and leaked it between requests in production. Fix: moved the user to `event.locals` and passed it via `load`; added a lint rule and a review checklist item about module-level state.

### P5. "How do you test a SvelteKit app?"
Vitest for utilities and rune modules, Testing Library for components, direct calls to `load`/actions/endpoints with mocked events, and Playwright E2E on the production build. Mention CI setup and data seeding.

### P6. "How did you handle authentication?"
Session cookie (HttpOnly, Secure, SameSite), `handle` hook to set `locals.user`, route guards in layouts, authorization checks in each action/endpoint, CSRF origin checks, rate limiting on login, and monitoring of failed logins.

### P7. "How do you optimize performance in SvelteKit?"
Prerender/SSR, streaming for slow data, parallel `load`, image optimization, code splitting, preloading on hover, caching headers, avoiding unnecessary effects, `$state.raw` for large data, and Web Vitals monitoring.

### P8. "Why would you not choose Svelte for a project?"
Very large enterprise teams needing a huge hiring pool and rich third-party ecosystem, existing deep investment in another framework, requirement for React Native-style mobile sharing, or specific libraries only available elsewhere.

---

# 📚 Part 11: Complete Coverage (Svelte 4 Legacy + Ecosystem + Mixed)

## 11A. Svelte 4 (legacy) quick reference

### K1. Reactivity in Svelte 4
```svelte
<script>
  export let name;                       // prop
  let count = 0;                         // reactive on assignment
  $: doubled = count * 2;                // reactive declaration
  $: if (count > 5) alert('big');        // reactive statement
  $: { console.log(count, name); }       // reactive block
</script>
<button on:click={() => count++}>{count}</button>
```

### K2. Events and dispatchers
```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('save', { id: 1 })}>Save</button>
<!-- parent: <Child on:save={(e) => console.log(e.detail)} /> -->
```
Modifiers: `on:click|preventDefault|stopPropagation|once|capture|self|trusted|passive`.

### K3. Slots
```svelte
<!-- Card.svelte -->
<header><slot name="header">Default header</slot></header>
<slot>Default content</slot>
<slot name="footer" {data} />               <!-- slot props -->
<!-- usage: <Card><h2 slot="header">Hi</h2><p>Body</p><span slot="footer" let:data>{data}</span></Card> -->
```

### K4. Module context and lifecycle
```svelte
<script context="module">
  let instances = 0;          // shared by all instances
</script>
<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte';
</script>
```

### K5. Migration mapping
| Svelte 4 | Svelte 5 |
|---|---|
| `let count = 0;` | `let count = $state(0);` |
| `$: doubled = count * 2;` | `let doubled = $derived(count * 2);` |
| `$: console.log(count);` | `$effect(() => { console.log(count); });` |
| `export let name;` | `let { name } = $props();` |
| `$$props`, `$$restProps` | `let { a, ...rest } = $props();` |
| `on:click={fn}` | `onclick={fn}` |
| `createEventDispatcher` | Callback props (`onsave`) |
| `<slot />` | `{@render children?.()}` |
| `<slot name="x" />` | A snippet prop `x` + `{@render x?.()}` |
| `<svelte:component this={C} />` | `<C />` |
| `<script context="module">` | `<script module>` |
| `new App({ target })` | `mount(App, { target })` |
| `beforeUpdate` / `afterUpdate` | `$effect.pre` / `$effect` |
| Stores for shared state | `$state` in `.svelte.js` modules (stores still OK) |

## 11B. Ecosystem Map

| Area | Common choices |
|---|---|
| Meta-framework | SvelteKit |
| Build | Vite |
| Auth | Auth.js (`@auth/sveltekit`), Lucia-style sessions, Better Auth, Clerk |
| Database/ORM | Drizzle, Prisma, Kysely, Supabase, Turso |
| Forms/validation | Superforms, Zod, Valibot, Formsnap |
| UI kits | shadcn-svelte, Skeleton, Flowbite-Svelte, Bits UI / Melt UI (headless), Carbon |
| Styling | Scoped CSS, Tailwind, UnoCSS |
| i18n | Paraglide (inlang), svelte-i18n, typesafe-i18n |
| Data/queries | TanStack Query (Svelte adapter), `load` functions, SvelteKit remote functions (experimental) |
| Animation | Built-in transitions/motion, Motion One, GSAP |
| Testing | Vitest, Testing Library, Playwright, Storybook/Histoire |
| Content | MDsveX (Markdown in Svelte), CMS SDKs |
| Tooling | `svelte-check`, ESLint (`eslint-plugin-svelte`), Prettier (`prettier-plugin-svelte`), `sv` CLI |
| Deploy | Vercel, Netlify, Cloudflare, Node/Docker, static hosting |

## 11C. Svelte vs Other Frameworks *(Comparison)*

| | Svelte 5 | React | Vue 3 | Solid | Angular |
|---|---|---|---|---|---|
| Rendering approach | Compiler + signals | VDOM | VDOM + proxies | Compiler + signals | Zone/signals + templates |
| Template syntax | HTML-like with blocks | JSX | HTML templates | JSX | HTML templates |
| State API | Runes | Hooks | Composition API / refs | Signals | Signals / RxJS |
| Bundle size (typical) | Small | Larger | Medium | Small | Larger |
| Meta-framework | SvelteKit | Next.js | Nuxt | SolidStart | Angular Universal/SSR |
| Ecosystem size | Smaller | Largest | Large | Small | Large |

## 11D. HTML + CSS + JavaScript Topics in Svelte

### M1. CSS custom properties as component styling API
```svelte
<!-- Button.svelte -->
<button><slot /></button>
<style>button { background: var(--bg, #4f46e5); color: var(--fg, white); border-radius: var(--radius, 6px); }</style>
<!-- usage: <Button --bg="tomato" --radius="999px">Save</Button> -->
```

### M2. Progressive enhancement
Forms use real `<form method="POST">` so they work without JS. `use:enhance` adds fetch-based submission, pending states and no full reload. Links are real `<a href>`. Server-rendered HTML works before hydration.

### M3. Accessibility patterns
Semantic elements, labels, `aria-live` regions for async updates, focus management after navigation (`data-sveltekit-keepfocus` for inputs that should keep focus), `prefers-reduced-motion` for transitions, and fixing compiler a11y warnings.

### M4. Using vanilla libraries (chart/map/editor)
```svelte
<script>
  import { onMount } from 'svelte';
  let el;
  onMount(async () => {
    const { Chart } = await import('chart.js/auto');
    const chart = new Chart(el, config);
    return () => chart.destroy();
  });
</script>
<canvas bind:this={el}></canvas>
```

### M5. Responsive images and fonts
`<enhanced:img>` for images; self-host fonts (Fontsource) with `font-display: swap` and preload critical files via `%sveltekit.head%` or `<svelte:head>`.

---

# 🧠 Part 12: Internals

### B1. The Svelte compiler pipeline
1. **Parse** the `.svelte` file into an AST (script, template, style).
2. **Analyze**: detect runes, scopes, which variables are reactive, which template parts depend on what, CSS selector usage (scoping and unused CSS warnings), accessibility checks.
3. **Transform**: rewrite runes (`$state` → signal creation and `get/set` calls), compile template nodes to DOM-creation code, and compile CSS with a hash class (e.g., `.svelte-1abc23`).
4. **Generate** JavaScript (client and server targets) and a CSS file/string. The server output generates HTML strings; the client output creates and updates DOM.

### B2. The signals runtime (Svelte 5)
Core entities: **sources** (`$state`), **deriveds** (`$derived`), **effects** (`$effect` and template effects), each with dependency lists and versions/flags (clean, maybe-dirty, dirty). Writing a source marks dependents dirty and schedules effects. Reading a derived re-validates it if its dependencies changed (**push-pull**). Effects run in a flush (microtask), batching many writes into one update. Effects form a tree (component → blocks → nested effects) so cleanup and ownership are automatic.

### B3. How `$state` proxies work
`$state(obj)` creates a proxy where each property read creates (lazily) a per-property source; writes update that source and notify only the effects that read that property. Arrays have a `length` source. Because proxies are created on demand, reading a deep property inside an effect subscribes only to that path.

### B4. Template compilation
Static HTML parts are compiled into a `<template>` element cloned once per instance (fast). Dynamic parts become small effects, e.g., updating a text node or an attribute when a dependency changes. Blocks (`{#if}`, `{#each}`, `{#await}`, `{#key}`, snippets) manage creation/destruction of child effects and DOM ranges.

### B5. Keyed `{#each}` reconciliation
For keyed lists, Svelte tracks items by key, reuses their DOM and effects, and moves nodes minimally (similar in spirit to keyed diff algorithms, but over compiled block items). Unkeyed lists update by index. Large lists benefit from keys and from avoiding heavy per-item effects.

### B6. Hydration
The server HTML contains marker comments for block boundaries. The client walks the DOM, **claims** existing nodes instead of creating new ones, and attaches effects and event listeners. If the DOM structure does not match, Svelte logs a hydration mismatch and repairs by re-creating the mismatched part.

### B7. SSR rendering
The server compile target produces functions that append strings to an output buffer (no DOM). Effects and `onMount` do not run. `{#await}` and other async constructs follow the SSR rules (pending state is rendered unless data is already available). SvelteKit streams HTML in chunks.

### B8. CSS scoping
The compiler adds a unique class to each element that a component's selectors might match and rewrites selectors to include that class (`p.svelte-xyz`). Unused selectors are removed with a warning. `:global()` leaves selectors untouched.

### B9. SvelteKit request lifecycle
1. Adapter entry receives the request.
2. `handle` hook pipeline (`sequence()` can compose several).
3. Route matching (including param matchers and `reroute`).
4. Run `load` functions: server `load` first; universal `load` receives server data; layouts and pages in parallel.
5. Render the page on the server (HTML + serialized data with `devalue`), stream if promises are pending.
6. Send the response with client entry scripts and preload hints.
7. Client hydrates; later navigations fetch code and **data** (server `load` data from `__data.json` endpoints) and update the page without full reloads.

### B10. Client-side router
Intercepts clicks on same-origin `<a>` tags, preloads code/data on hover, runs `load` functions for the new route (only those with changed dependencies), updates `page` state, manages scroll and focus, and handles history. `beforeNavigate`/`afterNavigate` hooks allow guards and analytics.

### B11. Form actions and `use:enhance`
Actions are POST endpoints on the page URL (`?/name` selects an action). Without JS the browser submits normally and the server re-renders the page with `form` data. With `use:enhance`, SvelteKit sends a `fetch` POST (with a special header), receives a serialized result (`success`, `failure`, `redirect`, `error`), then updates `form` and invalidates `load`.

### B12. Adapters
An adapter takes SvelteKit's build output (server handler, client assets, prerendered pages) and converts it to the target platform format (Node server, serverless functions, edge workers, static files). The adapter defines environment variable handling, platform objects (`event.platform`) and limits.

### B13. Dev vs production
Dev uses Vite's dev server with HMR, on-demand compilation, extra warnings and `$inspect`. Production uses hashed, split chunks, minification, and the adapter runtime. Always test `build` output; `preview` approximates but does not reproduce platform runtime constraints.

### B14. Legacy mode compatibility
Components without runes compile in legacy mode: top-level `let` is made reactive by wrapping with signals and compiling `$:` statements into effects ordered by dependencies. This keeps Svelte 4 code working, but with some runtime overhead compared to runes mode.

---

# 📋 Part 13: Reference Tables

### R1. Runes
| Rune | Use |
|---|---|
| `$state` | Reactive state (deep proxy for objects/arrays) |
| `$state.raw` | Shallow reactive state |
| `$state.snapshot` | Plain copy of state |
| `$derived` / `$derived.by` | Computed values |
| `$effect` / `$effect.pre` | Side effects after/before DOM update |
| `$effect.root` | Standalone effect scope |
| `$effect.tracking` | Are we in a tracking context? |
| `$props` | Component props |
| `$bindable` | Two-way bindable prop |
| `$inspect` | Dev logging |
| `$host` | Custom element host |

### R2. Template syntax
| Syntax | Meaning |
|---|---|
| `{expr}` | Expression |
| `{#if} {:else if} {:else} {/if}` | Conditionals |
| `{#each list as item, i (key)} {:else} {/each}` | Loops |
| `{#await p} {:then v} {:catch e} {/await}` | Promises |
| `{#key expr} {/key}` | Re-create on change |
| `{#snippet name(args)} {/snippet}` / `{@render name(args)}` | Reusable markup |
| `{@html}`, `{@const}`, `{@debug}` | Raw HTML, local constants, debugger |
| `bind:`, `use:`, `class:`, `style:` | Directives |
| `transition:`, `in:`, `out:`, `animate:` | Motion |
| `<svelte:head>`, `<svelte:window>`, `<svelte:body>`, `<svelte:document>`, `<svelte:element>`, `<svelte:boundary>`, `<svelte:options>` | Special elements |

### R3. SvelteKit file conventions
| File | Runs | Purpose |
|---|---|---|
| `+page.svelte` | Both | Page UI |
| `+page.js` | Both | Universal `load`, page options |
| `+page.server.js` | Server | Server `load`, `actions` |
| `+layout.svelte` | Both | Layout UI |
| `+layout.js` / `+layout.server.js` | Both / Server | Layout data |
| `+server.js` | Server | API endpoints |
| `+error.svelte` | Both | Error UI |
| `hooks.server.js` | Server | `handle`, `handleFetch`, `handleError` |
| `hooks.client.js` | Client | `handleError`, init |
| `hooks.js` | Both | `reroute`, `transport` |
| `app.html` | Server | HTML template |
| `service-worker.js` | Browser | Offline/caching |
| `params/*.js` | Both | Route param matchers |

### R4. Rendering options (page options)
| Option | Values | Effect |
|---|---|---|
| `prerender` | `true`, `false`, `'auto'` | Static generation at build |
| `ssr` | `true`, `false` | Server rendering on/off |
| `csr` | `true`, `false` | Client JS on/off |
| `trailingSlash` | `'never'`, `'always'`, `'ignore'` | URL style |
| `config` | adapter-specific | Runtime/regions/etc. |

### R5. `$app` and `$env` modules
| Module | Contents |
|---|---|
| `$app/navigation` | `goto`, `invalidate`, `invalidateAll`, `beforeNavigate`, `afterNavigate`, `preloadData`, `pushState`, `replaceState` |
| `$app/state` | `page`, `navigating`, `updated` (reactive objects) |
| `$app/stores` | `page`, `navigating`, `updated` (stores; older API) |
| `$app/forms` | `enhance`, `applyAction`, `deserialize` |
| `$app/environment` | `browser`, `dev`, `building`, `version` |
| `$app/paths` | `base`, `assets`, `resolveRoute` |
| `$env/static/private` / `public` | Build-time env |
| `$env/dynamic/private` / `public` | Runtime env |

### R6. Adapters
| Adapter | Output |
|---|---|
| `adapter-auto` | Picks one for the detected platform |
| `adapter-node` | Node server (`node build`) |
| `adapter-static` | Static files (SPA fallback optional) |
| `adapter-vercel` | Serverless/edge functions on Vercel |
| `adapter-netlify` | Netlify functions/edge |
| `adapter-cloudflare` | Workers/Pages |

### R7. Lifecycle (runes era)
| Need | Use |
|---|---|
| Run once on mount (browser) | `onMount` or `$effect` with no reactive reads |
| Cleanup | Return a function from `onMount` / `$effect` / `onDestroy` |
| React to state changes | `$effect` |
| Run before DOM updates | `$effect.pre` |
| Wait for DOM update | `await tick()` |
| Synchronously flush effects (tests) | `flushSync()` |

### R8. Motion and transitions
`svelte/transition`: `fade`, `fly`, `slide`, `scale`, `blur`, `draw`, `crossfade`. `svelte/animate`: `flip`. `svelte/motion`: `tweened`/`Tween`, `spring`/`Spring`. `svelte/easing`: many easing functions.

### R9. Testing tools
Vitest (unit and component), `@testing-library/svelte`, Playwright (E2E), Storybook or Histoire (component docs), `svelte-check` (types), ESLint plugin for Svelte.

### R10. Common error/warning names
`effect_update_depth_exceeded`, `state_unsafe_mutation`, `ownership_invalid_mutation`, `binding_property_non_reactive`, `hydration_mismatch`, `legacy_*` / `runes_mode_invalid_import`, a11y warnings (`a11y_missing_attribute`, `a11y_click_events_have_key_events`), `css_unused_selector`.


---

# 🧩 Part 14: Output & Prediction Questions

> Give the answer **and the reason**. Svelte 5 (runes mode) is assumed unless the question says Svelte 4.

### O1. Does the UI update? (Svelte 4)
```svelte
<script>
  let todos = [];
  function add() { todos.push('x'); }
</script>
<button on:click={add}>Add</button><p>{todos.length}</p>
```
**Answer:** No, it stays `0`. Svelte 4 reacts to **assignments**. Fix: `todos = [...todos, 'x']` (or `todos.push('x'); todos = todos;`). In Svelte 5 with `let todos = $state([])`, `push` works.

### O2. How many times does the effect log?
```svelte
<script>
  let count = $state(0);
  let double = $derived(count * 2);
  $effect(() => console.log('effect', count, double));
</script>
<button onclick={() => count++}>+</button>
```
**Answer:** On mount (in the browser): `effect 0 0`. After one click: `effect 1 2` (a single log). `$derived` updates first, and the effect runs once after the DOM update with consistent values.

### O3. Batching of updates
```svelte
<script>
  let a = $state(0), b = $state(0);
  $effect(() => console.log(a, b));
</script>
<button onclick={() => { a++; b++; }}>Go</button>
```
**Answer:** One log per click (`1 1`, not `1 0` then `1 1`). Effects are batched and run after all synchronous writes finish.

### O4. Untracked reads
```svelte
<script>
  let count = $state(0);
  $effect(() => { setTimeout(() => console.log(count), 0); });
</script>
<button onclick={() => count++}>+</button>
```
**Answer:** The effect runs **once** on mount and logs `0`. `count` is read inside the `setTimeout` callback (after the effect finished), so it is not a dependency. Clicking does not re-run the effect.

### O5. Does the text update?
```svelte
<script>
  let n = 0;                 // runes mode, plain let
</script>
<button onclick={() => n++}>{n}</button>
```
**Answer:** No. In runes mode, a plain `let` is **not reactive**. Use `let n = $state(0)`. (In Svelte 4 legacy mode this would update.)

### O6. Mutation inside `$derived`
```svelte
<script>
  let count = $state(0);
  let bad = $derived(count++);
</script>
```
**Answer:** Error `state_unsafe_mutation`: `$derived` expressions must be pure. Move the mutation into an event handler or `$effect`.

### O7. Destructuring state
```svelte
<script>
  let user = $state({ name: 'Ritesh' });
  let { name } = user;
</script>
<button onclick={() => (user.name = 'Kumar')}>{name}</button>
```
**Answer:** The text stays `Ritesh`. Destructuring copied the value. Use `user.name` in the template or `let name = $derived(user.name)`.

### O8. Unkeyed `{#each}` with inputs
```svelte
{#each items as item}<li><input value={item} /></li>{/each}
```
When the first item is removed, which input values remain?
**Answer:** Without a key, DOM nodes are reused by **index**, so typed values stay in the same positions and appear attached to the wrong items. Use `{#each items as item (item.id)}`.

### O9. `$state.raw`
```svelte
<script>
  let list = $state.raw([1, 2]);
</script>
<button onclick={() => list.push(3)}>{list.length}</button>
```
**Answer:** No update. `$state.raw` is not deeply reactive; mutation does not notify. Re-assign instead: `list = [...list, 3]`.

### O10. Reactive `Map`
```svelte
<script>
  let m = $state(new Map());
</script>
<button onclick={() => m.set('a', 1)}>{m.size}</button>
```
**Answer:** The text does not update; `Map` inside `$state` is not made reactive. Use `new SvelteMap()` from `svelte/reactivity`.

### O11. Reactive declaration order (Svelte 4)
```svelte
<script>
  let a = 1;
  $: c = b + 1;
  $: b = a * 2;
  a = 5;
</script>
{c}
```
**Answer:** `11`. Svelte sorts `$:` statements by dependency: `b` is computed first (10), then `c` (11), regardless of the source order.

### O12. `onMount` order
```svelte
<!-- Parent.svelte: onMount(() => console.log('parent')); contains <Child /> -->
<!-- Child.svelte:  onMount(() => console.log('child')); -->
```
**Answer:** `child` then `parent`. Children mount before their parent, so the child's `onMount` runs first.

### O13. Where does `console.log` appear?
```svelte
<script>
  console.log('top level');
  import { onMount } from 'svelte';
  onMount(() => console.log('mounted'));
</script>
```
**Answer:** `top level` logs on the **server** during SSR and again in the **browser** during hydration. `mounted` logs only in the browser.

### O14. `{#key}` effect on state
```svelte
{#key userId}<Profile {userId} />{/key}
```
**Answer:** When `userId` changes, the whole `Profile` is destroyed and re-created, so its internal state resets and its transitions/effects restart.

### O15. Parallel `load`
`+layout.server.js` load takes 300 ms, `+page.server.js` load takes 500 ms. How long until the data is ready?
**Answer:** About **500 ms** (they run in parallel). If the page `load` calls `await parent()`, it becomes about **800 ms** (waterfall).

### O16. Route matching
Which URLs match: `routes/blog/[slug]`, `routes/files/[...path]`, `routes/[[lang]]/about`, `routes/items/[id=integer]`?
**Answer:** `/blog/hello` (one segment); `/files/a/b/c` (and `/files/a`, but not `/files` alone); `/about` and `/en/about`; `/items/42` (only numeric ids if the matcher is `/^\d+$/`).

### O17. Form action results
```js
export const actions = { default: async () => fail(400, { error: 'Bad input' }) };
```
**Answer:** The response status is 400, the page stays, and `form` equals `{ error: 'Bad input' }` (available through the `form` prop). A `redirect(303, '/ok')` would navigate instead.

### O18. Form without JavaScript
A form uses `method="POST"` and `use:enhance`. JS is disabled. What happens?
**Answer:** It still works as a normal browser POST: the server runs the action, and the page is rendered again (or redirected), with the `form` data available. This is **progressive enhancement**.

### O19. Prerendering with an action
```js
export const prerender = true;
export const actions = { default: async () => {} };
```
**Answer:** The page is built as static HTML, and the action is not available (no server to receive POST). Actions require a dynamic (server-rendered) page.

### O20. Cookie without a path
```js
cookies.set('session', token, { httpOnly: true });
```
**Answer:** SvelteKit throws an error: a `path` is required. Use `path: '/'` for app-wide cookies.

### O21. Transition inside nested blocks
```svelte
{#if outer}
  {#if inner}<p transition:fade>Hi</p>{/if}
{/if}
```
Toggle `outer` from true to false. Does the fade play?
**Answer:** No, not by default. Transitions are **local**: they play when their own block (`inner`) changes. Use `transition:fade|global` to play when ancestors change.

### O22. Module state in SSR
```js
// state.svelte.js
export const current = $state({ user: null });
```
Two users request pages at the same time on one server process. What can happen?
**Answer:** They share the same `current` object. User A's data can leak into User B's rendered HTML. Use `event.locals`, `load` data or context for per-request data.

### O23. Server `load` returns a function
```js
// +page.server.js
export const load = () => ({ fn: () => 1 });
```
**Answer:** Error: server data must be serializable (functions are not). A universal `+page.js` can return functions because it runs in the browser too.

### O24. Event handlers with modifiers
```svelte
<button onclick|preventDefault={save}>Save</button>
```
**Answer:** Invalid in Svelte 5 for `onclick`. Write `onclick={(e) => { e.preventDefault(); save(); }}` (the `on:click|preventDefault` form belongs to the legacy syntax).

### O25. `$bindable` missing
```svelte
<!-- Child: let { value } = $props(); -->
<Child bind:value={name} />
```
**Answer:** A warning/error that `value` is not bindable. The child must declare `let { value = $bindable() } = $props();`.

### O26. Which environment variables reach the browser?
```
DATABASE_URL=...
PUBLIC_API_URL=...
```
**Answer:** Only `PUBLIC_API_URL` via `$env/static/public`. `DATABASE_URL` is private and importing it in client code fails the build.

### O27. Stale layout data
A layout `load` fetches the current user. After the user updates their name via a form action, the header still shows the old name. Why?
**Answer:** The layout `load` did not re-run because its dependencies did not change. `use:enhance` calls `invalidateAll` after successful actions by default (so it may update), but if you call the action with a plain `fetch`, you must call `invalidate('app:user')` / `invalidateAll()`; also check `depends()` keys.

### O28. `redirect` in `try/catch`
```js
try { await save(); redirect(303, '/done'); } catch (e) { return fail(500); }
```
**Answer:** The redirect does not happen: the `catch` swallows the control-flow exception. Call `redirect` outside `try/catch` or rethrow if `isRedirect(e)`.

---

# ✅ Part 15: MCQs

1. Svelte is primarily a... → **Compiler**
2. Does Svelte use a virtual DOM? → **No**
3. Which rune creates reactive state? → **`$state`**
4. Which rune creates a computed value? → **`$derived`**
5. Which rune runs side effects? → **`$effect`**
6. Which rune receives props? → **`$props`**
7. Which rune allows two-way binding of a prop? → **`$bindable`**
8. Which Svelte 4 syntax created reactive statements? → **`$:`**
9. Which Svelte 4 syntax declared a prop? → **`export let`**
10. How do you attach a click handler in Svelte 5? → **`onclick={handler}`**
11. How do you attach a click handler in Svelte 4? → **`on:click={handler}`**
12. How do you loop in a template? → **`{#each list as item (key)}`**
13. What is the key in `{#each}` for? → **Stable identity so DOM/state moves with items**
14. Which block waits for a promise? → **`{#await}`**
15. Which block re-creates its content when a value changes? → **`{#key}`**
16. Which tag outputs raw HTML (dangerous)? → **`{@html}`**
17. What replaced slots in Svelte 5? → **Snippets (`{#snippet}` / `{@render}`)**
18. What replaced `createEventDispatcher` in Svelte 5? → **Callback props**
19. Where are Svelte styles scoped to by default? → **The component**
20. How do you style outside the component scope? → **`:global()`**
21. Which directive adds a conditional class? → **`class:name={cond}`**
22. Which directive attaches behavior to an element? → **`use:action`**
23. Which module provides `fade`, `fly`, `slide`? → **`svelte/transition`**
24. Which module provides `flip`? → **`svelte/animate`**
25. Which module provides `writable`/`derived` stores? → **`svelte/store`**
26. How do you read a store value in a component? → **`$storeName`**
27. Which lifecycle function runs only in the browser after mount? → **`onMount`**
28. What does `tick()` return? → **A promise that resolves after pending DOM updates**
29. What is SvelteKit? → **The official application framework for Svelte**
30. What is the SvelteKit scaffolding CLI? → **`npx sv create`**
31. Which file defines a page? → **`+page.svelte`**
32. Which file contains server-only data loading? → **`+page.server.js`**
33. Which file defines an API endpoint? → **`+server.js`**
34. Which export defines form handlers? → **`actions`**
35. Which action function returns validation errors with a status? → **`fail()`**
36. Which attribute/action enhances forms progressively? → **`use:enhance`**
37. Which alias points to `src/lib`? → **`$lib`**
38. Which folder is server-only inside `$lib`? → **`$lib/server`**
39. Which prefix exposes env variables to the browser? → **`PUBLIC_`**
40. Which option prerenders a page? → **`export const prerender = true`**
41. Which option disables SSR for a page? → **`export const ssr = false`**
42. Which hook runs for every request? → **`handle`**
43. Where do you keep per-request data like the current user? → **`event.locals`**
44. Which function re-runs `load` for a dependency key? → **`invalidate('key')`**
45. Which function re-runs all `load` functions? → **`invalidateAll()`**
46. Which API do you use inside `load` to call your own endpoints? → **The provided `fetch`**
47. What does an adapter do? → **Converts the build for a deployment target**
48. Which adapter builds a Node server? → **`adapter-node`**
49. What is hydration? → **Attaching client behavior to server-rendered HTML**
50. Which environment variable fixes CSRF/origin issues behind a proxy for adapter-node? → **`ORIGIN`**
51. Which tag manages `<head>` content? → **`<svelte:head>`**
52. Which element catches rendering errors in a subtree (Svelte 5)? → **`<svelte:boundary>`**
53. Which classes make `Map`/`Set` reactive? → **`SvelteMap` / `SvelteSet`**
54. Which file extension allows runes outside components? → **`.svelte.js` / `.svelte.ts`**
55. Which command migrates a project to Svelte 5? → **`npx sv migrate svelte-5`**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes developers make again and again with Svelte and SvelteKit. Interviewers ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Using `$effect` to compute values
**❌ Wrong:**
```svelte
let full = $state('');
$effect(() => { full = `${first} ${last}`; });
```
**🤔 Why it is a problem:** It adds an extra update cycle, can flash old values, can cause loops, and runs only in the browser (SSR renders an empty value).

**✅ Correct:**
```svelte
let full = $derived(`${first} ${last}`);
```
**💬 Say:** "Derived values use `$derived`; effects are for side effects."

---

### Mistake 2: Module-level state on the server
**❌ Wrong:**
```js
// user.svelte.js
export const session = $state({ user: null });      // shared by all requests on the server
```
**🤔 Why it is a problem:** Module code runs once per server process, so data can leak between users.

**✅ Correct:** Put per-user data in `event.locals` (set in `handle`), pass it through `load`, or use context created inside a component.
**💬 Say:** "On the server, module scope is shared across users."

---

### Mistake 3: Destructuring state or props and expecting reactivity
**❌ Wrong:**
```svelte
let { count } = counter;           // counter is $state
let { name } = $props();           // fine to read, but derived values from it need $derived
const upper = name.toUpperCase();  // computed once!
```
**🤔 Why it is a problem:** A copied value does not update when the source changes.

**✅ Correct:**
```svelte
let upper = $derived(name.toUpperCase());
// use counter.count directly
```
**💬 Say:** "Anything computed from reactive values must be `$derived`."

---

### Mistake 4: Fetching data in `onMount`/`$effect` instead of `load`
**❌ Wrong:**
```svelte
onMount(async () => { posts = await (await fetch('/api/posts')).json(); });
```
**🤔 Why it is a problem:** No SSR content for SEO, a loading flash, request waterfalls, and manual race condition handling.

**✅ Correct:**
```js
// +page.server.js
export async function load({ fetch }) { return { posts: await (await fetch('/api/posts')).json() }; }
```
**💬 Say:** "Page data belongs in `load`; client effects are for browser-only needs."

---

### Mistake 5: Missing keys in `{#each}`
**❌ Wrong:** `{#each items as item}` for a list that reorders, filters, or has inputs/animations.
**🤔 Why it is a problem:** DOM is reused by index, so input values and animations attach to the wrong item.
**✅ Correct:** `{#each items as item (item.id)}`.
**💬 Say:** "Dynamic lists always get keys."

---

### Mistake 6: Using `{@html}` with untrusted content
**❌ Wrong:** `{@html comment.body}`.
**🤔 Why it is a problem:** XSS: scripts or malicious attributes can run.
**✅ Correct:** Render text normally (`{comment.body}`), or sanitize with DOMPurify before using `{@html}`.
**💬 Say:** "Svelte escapes by default; `{@html}` opts out of that protection."

---

### Mistake 7: Using browser APIs at the top level of a component
**❌ Wrong:**
```svelte
<script>
  const width = window.innerWidth;       // crashes during SSR
  const saved = localStorage.getItem('x');
</script>
```
**🤔 Why it is a problem:** `window` and `localStorage` do not exist on the server.
**✅ Correct:** Read them in `onMount`/`$effect`, or guard with `browser` from `$app/environment`.
**💬 Say:** "Component top-level code runs on the server too."

---

### Mistake 8: Using the global `fetch` in `load`
**❌ Wrong:** `const res = await window.fetch(...)` or an imported fetch in `load`.
**🤔 Why it is a problem:** No cookie forwarding, relative URLs fail on the server, and responses are not inlined for hydration (duplicate requests).
**✅ Correct:** Use the `fetch` passed in the `load` event.
**💬 Say:** "`event.fetch` is SSR-aware."

---

### Mistake 9: Trusting client-side validation only
**❌ Wrong:** Validating in the component and posting straight to the database.
**🤔 Why it is a problem:** Anyone can call the action/endpoint directly.
**✅ Correct:** Validate with Zod (or Valibot) in the action/endpoint, return `fail()` with messages, and show them in the form.
**💬 Say:** "Server validation is the source of truth."

---

### Mistake 10: Protecting only the layout, not actions and endpoints
**❌ Wrong:** A guard in `+layout.server.js`, but actions and `+server.js` do no checks.
**🤔 Why it is a problem:** Actions and endpoints can be called directly, bypassing page navigation.
**✅ Correct:** Check `locals.user` (and permissions) inside every action and endpoint, and scope database queries by user.
**💬 Say:** "Authorization lives at the point of data access."

---

### Mistake 11: `redirect()` or `error()` inside `try/catch`
**❌ Wrong:**
```js
try { await save(); redirect(303, '/done'); } catch (e) { return fail(500); }
```
**🤔 Why it is a problem:** Both work via exceptions, so the catch swallows them.
**✅ Correct:** Call `redirect` outside the `try/catch`, or rethrow with `isRedirect(e)`/`isHttpError(e)`.
**💬 Say:** "Control-flow helpers throw; I keep them out of broad catches."

---

### Mistake 12: Insecure or incomplete cookies
**❌ Wrong:** `cookies.set('session', token)` (no path, no flags).
**🤔 Why it is a problem:** SvelteKit requires a path; missing `httpOnly`/`secure`/`sameSite` exposes sessions to XSS and CSRF.
**✅ Correct:** `cookies.set('session', token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 })`.
**💬 Say:** "Session cookies are HttpOnly, Secure and SameSite."

---

### Mistake 13: Leaking secrets or server code to the client
**❌ Wrong:** Putting secrets in `PUBLIC_` variables, or importing database code from a component.
**🤔 Why it is a problem:** Anything reachable by client code is public.
**✅ Correct:** Keep secrets in `$env/static/private`, put server code in `$lib/server` and use it from `+page.server.js`/`+server.js`.
**💬 Say:** "SvelteKit fails the build when private code reaches the client; I rely on that."

---

### Mistake 14: Mixing legacy and runes syntax in one component
**❌ Wrong:** `export let name;` together with `$state`, or `$:` with `$derived`, or `on:click` with `onclick`.
**🤔 Why it is a problem:** Compile errors; confusing semantics.
**✅ Correct:** Convert a whole component to runes (use `sv migrate`), or keep it entirely in legacy mode.
**💬 Say:** "Migrate component by component, never half and half."

---

### Mistake 15: Waterfalls with `await parent()`
**❌ Wrong:** Every child `load` starts with `const parentData = await parent();`.
**🤔 Why it is a problem:** Child loads wait for parent loads, so the total time adds up.
**✅ Correct:** Fetch independent data in each `load` with `Promise.all`; read layout data from `data` in the component; stream non-critical data.
**💬 Say:** "I keep loads parallel."

---

### Mistake 16: Deep proxies for huge data
**❌ Wrong:** `let rows = $state(hugeArrayOfObjects)` when the data is read-only.
**🤔 Why it is a problem:** Deep proxies add memory and CPU overhead.
**✅ Correct:** `let rows = $state.raw(hugeArray)` and replace the whole array when it changes; use `$derived` for filtered views.
**💬 Say:** "I use `$state.raw` for large immutable data."

---

### Mistake 17: Not cleaning up effects, subscriptions and listeners
**❌ Wrong:**
```svelte
$effect(() => { window.addEventListener('resize', onResize); setInterval(poll, 1000); });
const unsub = store.subscribe(fn);       // never unsubscribed
```
**🤔 Why it is a problem:** Memory leaks and duplicate handlers.
**✅ Correct:** Return a cleanup function from `$effect`/`onMount`, and use `$store` syntax in components (it unsubscribes automatically).
**💬 Say:** "Whatever I start, I stop in cleanup."

---

### Mistake 18: Silencing accessibility warnings
**❌ Wrong:** `<!-- svelte-ignore a11y_click_events_have_key_events -->` on a clickable `div`.
**🤔 Why it is a problem:** The element is unusable with a keyboard or screen reader.
**✅ Correct:** Use `<button>` or `<a>`; add labels and keyboard handlers when truly custom.
**💬 Say:** "I fix a11y warnings, I don't ignore them."

---

### Mistake 19: Mutating props
**❌ Wrong:** Changing an object prop directly inside the child to communicate with the parent.
**🤔 Why it is a problem:** Hidden data flow, ownership warnings, and bugs when the parent re-renders.
**✅ Correct:** Call a callback prop (`onchange`), or use `$bindable` deliberately.
**💬 Say:** "Data flows down, events flow up."

---

### Mistake 20: Testing only with `dev` or `preview`
**❌ Wrong:** "It works with `npm run dev`."
**🤔 Why it is a problem:** Production builds differ: adapter runtime, prerendering, env handling, edge limits, CSP, and caching.
**✅ Correct:** Test the real build (`build` + the adapter's runtime or emulator) and run E2E tests against it in CI.
**💬 Say:** "I verify against the production build and target runtime."

---

### Mistake 21: Forgetting `ORIGIN` (or proxy headers) in production
**❌ Wrong:** Deploying `adapter-node` behind Nginx/ALB without configuration.
**🤔 Why it is a problem:** Form posts fail with "Cross-site POST form submissions are forbidden", and generated URLs are wrong.
**✅ Correct:** Set `ORIGIN=https://example.com` (or `PROTOCOL_HEADER`/`HOST_HEADER`), forward proper headers, and configure body size limits.
**💬 Say:** "CSRF protection depends on the app knowing its public origin."

---

### Mistake 22: Overusing `:global` and fighting scoped CSS
**❌ Wrong:** Wrapping most selectors in `:global()` to "make styles work".
**🤔 Why it is a problem:** You lose isolation and create style conflicts.
**✅ Correct:** Use component props (`class`), CSS custom properties for theming, and `:global()` only for third-party or `{@html}` content.
**💬 Say:** "I style through props and custom properties."

---

### Mistake 23: Using `$effect` for event handling
**❌ Wrong:**
```svelte
let clicked = $state(false);
$effect(() => { if (clicked) save(); });
```
**🤔 Why it is a problem:** Indirect and fragile (it may run more than once or on initial state).
**✅ Correct:** Call `save()` directly in the event handler.
**💬 Say:** "User actions are handled in handlers, not effects."

---

### Mistake 24: No error handling strategy
**❌ Wrong:** No `+error.svelte`, no `handleError`, errors only in the console.
**🤔 Why it is a problem:** Users see blank pages or raw errors; failures go unnoticed.
**✅ Correct:** Use `error()` for expected errors, `+error.svelte` per layout, `handleError` hooks reporting to monitoring, `fail()` for form errors, and `<svelte:boundary>` for component failures.
**💬 Say:** "Expected errors are explicit, unexpected errors are logged with an ID."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you explain Svelte. A junior lists syntax. A senior explains **the compiler, reactivity, SSR safety, data flow and trade-offs**.
> **What should you do?** Practice the "Strong" style for every answer.

### Signal 1: You explain Svelte as a compiler with fine-grained reactivity
| | Example answer |
|---|---|
| ❌ Weak | "Svelte is faster than React because it has no virtual DOM." |
| ✅ Strong | "Svelte compiles templates into direct DOM operations and wires them to signals. `$state` creates sources, `$derived` is a memoized computed value, `$effect` re-runs when the reactive values it read change. Updates touch only the DOM nodes that depend on a value, with no component re-render or tree diff. The trade-off is a smaller ecosystem and compile-time magic that you need to understand when debugging." |
**Prove it:** mention signals, proxies, batching, compiled output.

### Signal 2: You choose the right primitive
| | Example answer |
|---|---|
| ❌ Weak | "I use $effect for everything." |
| ✅ Strong | "`$derived` for computed values, `$effect` only for side effects with cleanup, event handlers for user actions, `load` for page data, form actions for mutations, and stores or `.svelte.js` modules for shared state." |
**Prove it:** the derived/effect/handler/load decision table.

### Signal 3: You know SSR pitfalls and SvelteKit data flow
| | Example answer |
|---|---|
| ❌ Weak | "I fetch in onMount." |
| ✅ Strong | "Server `load` for private data, universal `load` for public data, parallel loads without `await parent()`, streamed promises for slow data, `invalidate` with `depends` for precise refresh, `event.fetch` for SSR-safe requests, and no module-level user state because the server process is shared." |
**Prove it:** SSR safety, invalidation, streaming.

### Signal 4: You treat forms and mutations the SvelteKit way
| | Example answer |
|---|---|
| ❌ Weak | "I call fetch from a click handler." |
| ✅ Strong | "Form actions with Zod validation, `fail()` for errors, `redirect()` after success, and `use:enhance` for progressive enhancement. The same form works without JavaScript. Each action authorizes the user and scopes queries." |
**Prove it:** action code, progressive enhancement.

### Signal 5: You think about security
| | Example answer |
|---|---|
| ❌ Weak | "SvelteKit is secure by default." |
| ✅ Strong | "Origin checks for form POSTs (with correct `ORIGIN` behind proxies), HttpOnly/Secure/SameSite cookies with explicit paths, authorization in each action/endpoint, `$env` private/public separation, `$lib/server` boundaries, sanitized `{@html}`, CSP via `kit.csp`, and rate limiting on auth routes." |
**Prove it:** list concrete controls.

### Signal 6: You can migrate and operate
| | Example answer |
|---|---|
| ❌ Weak | "We upgraded to Svelte 5." |
| ✅ Strong | "We ran `sv migrate`, converted components one by one, replaced `$:` with `$derived` or `$effect` case by case, switched slots to snippets and dispatchers to callback props, kept stores where libraries needed them, and verified with unit, component and Playwright tests. Bundle size dropped and render performance improved." |
**Prove it:** migration steps and checks.

### Signal 7: You manage ecosystem and team risk
| | Example answer |
|---|---|
| ❌ Weak | "Svelte is the best framework." |
| ✅ Strong | "Svelte gives great DX and performance, but the ecosystem and hiring pool are smaller. We keep business logic in plain TypeScript, wrap third-party libraries, prefer headless UI libraries, and train new hires, so we're not locked into one framework." |
**Prove it:** architecture boundaries, risk mitigation.

### Signal 8: You compare frameworks honestly
| | Example answer |
|---|---|
| ❌ Weak | "React is bad." |
| ✅ Strong | "Choose by constraints: React/Next for the largest ecosystem and hiring, Angular for large structured enterprise teams, Vue/Nuxt for approachable full-featured apps, Svelte/SvelteKit for small bundles, simple code and performance-sensitive products. I'd run a spike and measure." |
**Prove it:** a decision table and a spike plan.

### 🔊 Phrases that sound senior
- "That's a derived value, not an effect."
- "Module state is shared across requests on the server."
- "Use the `load` function's `fetch` so SSR can inline and forward cookies."
- "The form works without JS; `use:enhance` is progressive enhancement."
- "Authorize inside the action, not only in the layout."
- "I test against the production build and the real adapter runtime."

### 🚩 Phrases that sound junior
- "I use $effect to update variables." · "I fetch everything in onMount." · "I keep the user in a global store on the server." · "I ignore the a11y warnings." · "I use {@html} for formatted text." · "It works on `npm run dev`."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Compiler model:** no virtual DOM, fine-grained updates
2. **Runes:** `$state`, `$derived`, `$effect`, `$props`, `$bindable`
3. **Svelte 4 vs 5:** assignments/`$:`/`export let` vs runes/snippets/callback props
4. **Deep reactivity:** proxies, `$state.raw`, snapshots, `SvelteMap`
5. **Template blocks, bindings, actions, transitions**
6. **SvelteKit routing and special files**
7. **`load` functions:** universal vs server, parallel, streaming, invalidation
8. **Form actions + `use:enhance`** and progressive enhancement
9. **SSR/hydration and server-state safety**
10. **Deployment:** adapters, env variables, `ORIGIN`, testing the production build

## 18.2 Pick the right tool
| Need | Use |
|---|---|
| Local state | `$state` |
| Computed value | `$derived` / `$derived.by` |
| Side effect (DOM API, subscription) | `$effect` with cleanup |
| Props / two-way prop | `$props` / `$bindable` |
| Shared client state | `.svelte.js` class or module (not on the server globally) |
| Per-request/user state | `event.locals`, `load` data, context |
| Page data | `load` function |
| Mutations | Form actions (+ `use:enhance`) |
| API for other clients | `+server.js` |
| Reusable DOM behavior | `use:action` (or attachments) |
| Reusable markup | Snippets |
| Errors | `error()`, `+error.svelte`, `handleError`, `<svelte:boundary>` |

## 18.3 SvelteKit files at a glance
`+page.svelte` (UI), `+page.js` (universal load), `+page.server.js` (server load + actions), `+layout.*` (shared), `+server.js` (endpoints), `+error.svelte`, `hooks.server.js` (`handle`, `handleFetch`, `handleError`), `$lib`, `$lib/server`, `params/` matchers, `static/`, `svelte.config.js`.

## 18.4 Performance checklist
- [ ] SSR or prerender public pages
- [ ] Parallel `load`; stream slow data
- [ ] Keys in `{#each}`; virtualize long lists
- [ ] `$state.raw` for large immutable data; `$derived` instead of effect chains
- [ ] `@sveltejs/enhanced-img`; lazy-load images; code-split heavy widgets
- [ ] Preload on hover; cache headers via `setHeaders`
- [ ] Track Web Vitals; check bundle with a Vite visualizer

## 18.5 Security checklist
- [ ] Validate on the server (Zod); `fail()` for errors
- [ ] Authorize in every action and endpoint
- [ ] Cookies: `path`, `httpOnly`, `secure`, `sameSite`
- [ ] Private env only via `$env/*/private`; server code in `$lib/server`
- [ ] No untrusted `{@html}`; CSP configured
- [ ] `ORIGIN` set behind proxies; rate limit auth endpoints
- [ ] Keep Svelte, SvelteKit, Vite and adapters updated

## 18.6 Deployment checklist
- [ ] Choose the adapter (node/static/vercel/netlify/cloudflare)
- [ ] Build and test the real output, not only `dev`/`preview`
- [ ] Env variables: public vs private, build-time vs runtime
- [ ] Docker for `adapter-node`: copy `build`, `node_modules`, set `PORT`, `HOST`, `ORIGIN`
- [ ] Body size limits, health checks, logging, error monitoring
- [ ] Cache headers and CDN configuration

## 18.7 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| UI not updating (v4) | Mutation without assignment | Re-assign or use `$state` (v5) |
| UI not updating (v5) | Plain `let`, destructured copy, class instance, `Map`/`Set` | `$state`, `$derived`, `$state` class fields, `SvelteMap` |
| Infinite effect loop | Effect writes what it reads | `$derived`, `untrack`, conditions |
| `window is not defined` | Browser API during SSR | `onMount`/`$effect`/`browser` |
| Hydration warning | Server/client markup differ | Deterministic first render |
| Form action not running | Missing `method="POST"` or wrong action name | Fix form attributes |
| Data not fresh | `load` not invalidated | `invalidate`/`depends`, `use:enhance` |
| Env var undefined in browser | Not `PUBLIC_` | Use `PUBLIC_` and `$env/*/public` |
| Cookie not set | Missing `path` / wrong flags | `path: '/'`, correct flags |
| CSRF error in production | Wrong origin behind proxy | Set `ORIGIN` / proxy headers |
| Transition not playing | Local transition / not a block change | Use `\|global` or toggle its own block |
| Prerender fails | Dynamic route/link not prerenderable | `entries()`, fix links |

## 18.8 30-second answers
- **What is Svelte?** A compiler-based UI framework: it turns components into small JS that updates the DOM directly, with no virtual DOM.
- **What are runes?** Compiler symbols (`$state`, `$derived`, `$effect`, `$props`) that make reactivity explicit in Svelte 5.
- **`$derived` vs `$effect`?** Derived = computed value (pure). Effect = side effect after DOM updates (browser only, with cleanup).
- **What is SvelteKit?** The official full-stack framework: routing, SSR/SSG, `load`, form actions, endpoints, adapters.
- **Server vs universal `load`?** Server: private, serializable data. Universal: runs on server and browser, can return anything.
- **How do forms work?** Actions on the server with `fail`/`redirect`, enhanced by `use:enhance`; they work without JS.
- **How to avoid SSR state leaks?** No per-user data at module scope; use `locals`, `load` and context.
- **Svelte vs React?** Svelte: less code, smaller bundles, signals. React: bigger ecosystem and hiring pool.
- **How do you deploy?** Pick an adapter, test the production build, set env variables and `ORIGIN`.

## 18.9 Last-minute checklist before the interview
- [ ] I can explain the compiler model and fine-grained reactivity.
- [ ] I can write a component with `$state`, `$derived`, `$effect`, `$props`, `$bindable` and snippets.
- [ ] I can convert Svelte 4 code to Svelte 5 and name the main syntax changes.
- [ ] I can write a `load` function, a form action with validation and `use:enhance`, and a `+server.js` endpoint.
- [ ] I can explain SSR/hydration and the module-state leak problem.
- [ ] I can list security controls for SvelteKit (cookies, origin checks, authorization, env separation).
- [ ] I have two stories with numbers (bundle size/LCP improvement; a hard bug or migration).
- [ ] I can compare Svelte with React/Vue/Angular and describe risks and mitigations.
