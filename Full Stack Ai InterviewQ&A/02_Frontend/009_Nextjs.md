# Next.js Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This file focuses on the **App Router** (Next.js 13.4+ → 14 → 15) and also covers the **Pages Router**, because interviews still ask about both. Behavior changes in **Next.js 15** and **Next.js 16** are clearly marked. Next.js changes quickly, so always confirm details in the official docs and upgrade guide before quoting an exact default.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Prediction ("which rendering mode?") · MCQ
>
> **Golden rule:** For every Next.js question, answer four things: **(1) where does the code run (server/client/edge/build)? (2) what is cached and where? (3) what is sent to the browser? (4) what happens on navigation?**

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
- [Part 11: Complete Coverage (Pages Router + Ecosystem + Mixed)](#-part-11-complete-coverage-pages-router--ecosystem--mixed)
- [Part 12: Next.js Internals](#-part-12-nextjs-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Prediction Questions ("Which Mode? Where Does It Run?")](#-part-14-prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Next.js? Why use it instead of plain React? *(Conceptual)*
**Answer:** Next.js is a **React framework** by Vercel for building full-stack web applications. Plain React (with Vite) only gives you a UI library; Next.js adds the things a real app needs:
- **File-based routing** (folders = URLs)
- **Multiple rendering modes**: SSR, SSG, ISR, CSR, streaming
- **Server Components** and **Server Actions** (React 19 features, built in)
- **Backend in the same project**: route handlers (API endpoints)
- **Optimizations**: `next/image`, `next/font`, `next/script`, code splitting, prefetching
- **SEO** support: metadata API, sitemaps, Open Graph images
- **Tooling**: TypeScript, ESLint, Turbopack/webpack, easy deployment

**Trade-offs:** framework conventions to learn, caching complexity, and some coupling to the framework/hosting model.

### Q2. App Router vs Pages Router *(Must-know, Comparison)*
| | Pages Router (`pages/`) | App Router (`app/`) |
|---|---|---|
| Introduced | Original | Next.js 13 (stable in 13.4) |
| Components | Client Components (SSR + hydrate) | **Server Components by default** |
| Data fetching | `getStaticProps`, `getServerSideProps` | `async` components + `fetch`, Server Actions |
| Layouts | `_app.js` / per-page wrappers | Nested `layout.js` (state preserved) |
| Loading/error UI | Manual | `loading.js`, `error.js` conventions |
| API | `pages/api/*` | Route Handlers `route.js` |
| Streaming/Suspense | Limited | First-class |
| Status | Supported, maintenance mode | Recommended for new apps |
Both can **coexist** in one project, which allows gradual migration.

### Q3. How do you create a Next.js app? What is the project structure?
```bash
npx create-next-app@latest my-app
```
Typical App Router structure:
```
my-app/
  app/
    layout.tsx        # root layout (required: <html> and <body>)
    page.tsx          # route: /
    globals.css
    about/page.tsx    # route: /about
    blog/[slug]/page.tsx   # route: /blog/hello-world
    api/hello/route.ts     # endpoint: /api/hello
  public/             # static files served at /
  next.config.ts
  middleware.ts       # (or proxy.ts in Next.js 16)
```

### Q4. How does file-based routing work in the App Router? *(Must-know)*
A **folder** is a route segment; a **`page.tsx`** file inside it makes the route public.
| File | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/[slug]/page.tsx` | `/blog/anything` |
| `app/shop/[...slug]/page.tsx` | `/shop/a`, `/shop/a/b/c` (catch-all) |
| `app/shop/[[...slug]]/page.tsx` | `/shop` and everything below (optional catch-all) |
| `app/(marketing)/pricing/page.tsx` | `/pricing` (route group; the folder name is not in the URL) |
| `app/_components/Button.tsx` | not a route (private folder) |

### Q5. What are the special files in the App Router? *(Must-know)*
| File | Purpose |
|---|---|
| `layout.tsx` | Shared UI that wraps child routes; **preserved** (not re-mounted) on navigation |
| `page.tsx` | The unique UI of a route |
| `loading.tsx` | Instant loading UI (wraps the page in a `Suspense` boundary) |
| `error.tsx` | Error boundary for the segment (must be a Client Component) |
| `global-error.tsx` | Error boundary for the root layout |
| `not-found.tsx` | UI for `notFound()` / unmatched routes |
| `template.tsx` | Like layout, but **re-mounted** on every navigation |
| `route.ts` | API endpoint (Route Handler) |
| `default.tsx` | Fallback for parallel routes |
| `middleware.ts` | Runs before a request completes (project root) |

### Q6. What are Server Components and Client Components? *(Must-know)*
- **Server Components** (default in `app/`): render on the server (at build time or per request). They can read from databases, use secrets, and are **not included in the client JavaScript bundle**. They cannot use state, effects or browser APIs.
- **Client Components** (`'use client'` at the top of the file): render on the server for the first HTML (SSR) and then **hydrate** in the browser. Needed for `useState`, `useEffect`, event handlers, browser APIs, and client-only libraries.
```tsx
// app/page.tsx (Server Component)
import LikeButton from './LikeButton';
export default async function Page() {
  const post = await db.post.findFirst();          // direct data access
  return <article><h1>{post.title}</h1><LikeButton /></article>;
}
// app/LikeButton.tsx
'use client';
import { useState } from 'react';
export default function LikeButton() { const [n, setN] = useState(0); return <button onClick={() => setN(n + 1)}>♥ {n}</button>; }
```
Default to Server Components; add `'use client'` only at the **leaves** that need interactivity.

### Q7. How do you navigate between pages?
```tsx
import Link from 'next/link';
<Link href="/about">About</Link>
<Link href={`/blog/${post.slug}`} prefetch={false}>Read</Link>
```
```tsx
'use client';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';
const router = useRouter();
router.push('/dashboard'); router.replace('/login'); router.back(); router.refresh(); router.prefetch('/x');
```
Use `next/navigation` (App Router), **not** `next/router` (Pages Router). `<Link>` does client-side navigation and **prefetches** routes that enter the viewport (in production).

### Q8. How do you fetch data in the App Router?
Make the component `async` and `await` the data on the server.
```tsx
export default async function Posts() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return <ul>{posts.map((p: Post) => <li key={p.id}>{p.title}</li>)}</ul>;
}
```
You can also call your database/ORM directly. For client-side fetching (user-driven, polling) use TanStack Query/SWR in a Client Component.

### Q9. What are the rendering strategies in Next.js? *(Must-know)*
| Strategy | When HTML is generated | Use for |
|---|---|---|
| **SSG** (Static) | At build time | Marketing pages, docs, blogs |
| **ISR** (Incremental Static Regeneration) | At build, then regenerated in the background after `revalidate` seconds or on demand | Catalogs, news |
| **SSR** (Dynamic) | On every request | Personalized or real-time pages |
| **CSR** | In the browser | Dashboards behind login, after-load interactivity |
| **Streaming** | Progressively, as parts become ready | Slow data sources |
| **PPR / Cache Components** | Static shell + dynamic holes | Mixed pages (see Part 3) |
In the App Router, the mode is chosen **automatically** from what your code uses (e.g., `cookies()`, `no-store` fetches → dynamic).

### Q10. What is `next/image` and why use it?
An optimized `<Image>` component: automatic resizing, modern formats (WebP/AVIF), lazy loading, responsive `srcset`, and **prevents layout shift** by requiring dimensions.
```tsx
import Image from 'next/image';
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority sizes="100vw" />
<Image src={user.avatar} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
```
Use `priority` (or the newer preload option in recent versions) for the LCP image, `sizes` for responsive layouts, and configure external hosts with `images.remotePatterns` in `next.config`.

### Q11. What is `next/font`?
Loads fonts (Google or local) at build time, **self-hosts** them (no request to Google at runtime), and removes layout shift using fallback metrics.
```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={inter.className}><body>{children}</body></html>;
}
```

### Q12. How do you add metadata (SEO)?
```tsx
// static
export const metadata = { title: 'Ritesh Kumar | Portfolio', description: 'Full-stack developer' };
// dynamic
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post.title, openGraph: { images: [post.cover] } };
}
```
Metadata can only be exported from **Server Components**. Also available: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `manifest.ts`.

### Q13. What are Route Handlers?
Custom request handlers (API endpoints) in `app/**/route.ts` using the Web `Request`/`Response` APIs.
```ts
// app/api/users/route.ts
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json(await db.user.findMany()); }
export async function POST(req: Request) {
  const body = await req.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```
Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. A `route.ts` cannot live in the same segment as a `page.tsx`.

### Q14. What are environment variables in Next.js?
`.env.local` (not committed), `.env.development`, `.env.production`. Variables are **server-only** by default. Only those prefixed with `NEXT_PUBLIC_` are **inlined into the client bundle at build time**.
```
DATABASE_URL=postgres://...         # server only
NEXT_PUBLIC_API_URL=https://api.x   # available in the browser (public!)
```
Never put secrets in `NEXT_PUBLIC_` variables.

### Q15. How do you handle loading and error states?
```tsx
// app/dashboard/loading.tsx
export default function Loading() { return <p>Loading dashboard...</p>; }
// app/dashboard/error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (<div role="alert"><p>Something went wrong.</p><button onClick={reset}>Try again</button></div>);
}
// app/dashboard/not-found.tsx + notFound() in a page
import { notFound } from 'next/navigation';
const post = await getPost(slug); if (!post) notFound();
```

### Q16. `redirect` and `notFound`
```tsx
import { redirect, notFound } from 'next/navigation';
if (!user) redirect('/login');        // 307 (use permanentRedirect for 308)
if (!post) notFound();                // renders not-found.tsx with a 404 status
```
Both work by **throwing special errors**, so do not call them inside a `try/catch` that swallows errors.

### Q17. How do you style a Next.js app?
Global CSS (imported only in the root layout), **CSS Modules** (`Button.module.css`), **Tailwind CSS** (default option in `create-next-app`), Sass, and CSS-in-JS (limited with Server Components; runtime libraries need Client Components or special registries). Prefer CSS Modules or Tailwind for RSC compatibility.

### Q18. How do you deploy a Next.js app?
- **Vercel** (zero-config, best feature support).
- **Self-host** with Node: `next build` then `next start`, or Docker with `output: 'standalone'`.
- **Static export**: `output: 'export'` produces plain HTML/CSS/JS (no server features: no SSR, no route handlers, no middleware, no image optimizer by default).
- Other platforms through adapters (Netlify, Cloudflare, AWS, etc.).

### Q19. What is `next.config.js` used for?
Framework configuration: `images`, `redirects()`, `rewrites()`, `headers()`, `output`, `basePath`, `env`, `experimental` flags, `transpilePackages`, `serverExternalPackages`, webpack/Turbopack customization. Supports TypeScript (`next.config.ts`) from Next.js 15.

### Q20. What is a layout? Can layouts be nested?
A layout wraps child segments and **does not re-render or lose state** when navigating between its children. The **root layout** (`app/layout.tsx`) is required and must contain `<html>` and `<body>`. Layouts nest: `app/layout.tsx` → `app/dashboard/layout.tsx` → `page.tsx`.
```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <section><Sidebar />{children}</section>;
}
```
Layouts cannot access `searchParams` or the current pathname directly (use a Client Component with hooks for that).

### Q21. How do you read dynamic route parameters?
```tsx
// app/blog/[slug]/page.tsx  (Next.js 15+: params is a Promise)
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
// In a Client Component:
'use client'; import { useParams } from 'next/navigation'; const { slug } = useParams();
```
In Next.js 14 and earlier, `params` was a plain object (synchronous). In Next.js 15 it is async, and synchronous access is removed in Next.js 16.

### Q22. How do you read query strings (`searchParams`)?
```tsx
export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;           // makes the page dynamic
  const results = await search(q ?? '');
  return <Results items={results} />;
}
// Client side: useSearchParams() from 'next/navigation' (wrap in <Suspense> for static pages)
```

### Q23. What is the difference between `Link` and an `<a>` tag?
`Link` does client-side transitions (no full page reload), **prefetches** the target route, preserves layouts and scroll behavior. A plain `<a>` causes a full page load. Use `<a>` only for external links or downloads.

### Q24. What are Server Actions? (basic)
Async functions that run on the server, callable from forms or client code.
```tsx
// app/actions.ts
'use server';
export async function addTodo(formData: FormData) {
  const text = String(formData.get('text'));
  await db.todo.create({ data: { text } });
  revalidatePath('/todos');
}
// app/todos/page.tsx
<form action={addTodo}><input name="text" /><button>Add</button></form>
```
They work even without JavaScript (progressive enhancement) when used with forms. Under the hood they are **public HTTP POST endpoints**, so always authenticate and validate.

### Q25. What is the `public` folder?
Static assets served from the site root: `public/logo.png` → `/logo.png`. Not processed or hashed; use `import` for assets that should be optimized and fingerprinted.

### Q26. What is TypeScript support in Next.js?
Built in: `create-next-app` offers TS; `tsconfig.json` is generated; types for pages, layouts, route handlers (`NextRequest`, `NextResponse`), and the `Metadata` type. Next.js can generate typed routes (`typedRoutes`).

### Q27. What is dynamic import / lazy loading in Next.js?
```tsx
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('./Chart'), { loading: () => <p>Loading chart...</p>, ssr: false });
```
`ssr: false` is allowed only inside **Client Components**. You can also use `React.lazy` + `Suspense`.

### Q28. Link prefetching: how does it work?
In production, `<Link>` prefetches routes when they enter the viewport. For static routes the whole route payload can be prefetched; for dynamic routes only the shared layout down to the first `loading.tsx` is prefetched. Disable with `prefetch={false}` for rarely visited links.

### Q29. What is Turbopack?
A Rust-based bundler from Vercel, used for `next dev --turbopack` (stable for dev in Next.js 15) and the default bundler in Next.js 16 (verify in the release notes). It is much faster than webpack for large apps.

### Q30. How is a Next.js project different from a Vite React SPA in the browser?
Next.js sends **HTML for the first load** (good SEO and fast first paint), loads less client JS (Server Components), splits code per route, and can stream. A Vite SPA sends an empty HTML shell and renders everything after JS downloads.

### Q31. What does `'use client'` actually do?
It marks a **module boundary**: this file and everything it imports become part of the client bundle. It is not about "this component only". Children passed to it as props (`children`) can still be Server Components.

### Q32. Can Client Components import Server Components?
No (a client file cannot import a Server Component, it would become client code). But a Client Component can **receive** a Server Component as `children` or a prop from a parent Server Component.
```tsx
// Server Component
<ClientModal><ServerPostList /></ClientModal>     // ✅ composition
```

### Q33. What is `generateStaticParams`?
Tells Next.js which dynamic paths to pre-render at build time.
```tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}
```
Other paths are rendered on demand (and then cached) unless `dynamicParams = false` (then they return 404).

### Q34. What is ISR (Incremental Static Regeneration)?
Pages are static, but can be **regenerated in the background**. With `export const revalidate = 60` (or `fetch(..., { next: { revalidate: 60 } })`), the first request after 60 seconds still gets the cached page, and Next.js regenerates it behind the scenes (**stale-while-revalidate**). On-demand revalidation uses `revalidatePath`/`revalidateTag`.

### Q35. What is middleware (basic)?
Code that runs **before** a request is completed, matching selected paths. Used for redirects, rewrites, header changes, simple auth checks and A/B tests. In Next.js 16 the file convention is renamed to `proxy.ts` (verify in the upgrade guide).
```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
export function middleware(req: NextRequest) {
  if (!req.cookies.get('session') && req.nextUrl.pathname.startsWith('/dashboard'))
    return NextResponse.redirect(new URL('/login', req.url));
}
export const config = { matcher: ['/dashboard/:path*'] };
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Explain caching in the App Router. *(Must-know)*
Four caches (Next.js 13–14 model; defaults changed in 15, see Q37):
| Cache | Where | What | Duration |
|---|---|---|---|
| **Request Memoization** | Server, per request | Dedupes identical `fetch` GET calls (and `React.cache` functions) during one render pass | Single request |
| **Data Cache** | Server, persistent | Stores `fetch` results | Persists across requests and deployments until revalidated |
| **Full Route Cache** | Server | Stores rendered HTML + RSC payload of static routes | Until revalidated or **a new deployment** |
| **Router Cache** | Client, in memory | Stores visited/prefetched route segments for instant navigation | Session / a few seconds to minutes (staleTimes) |

### Q37. What changed about caching in Next.js 15 and 16? *(Frequently asked)*
**Next.js 15:**
- `fetch` requests are **no longer cached by default** (opt in with `cache: 'force-cache'` or `next: { revalidate }`).
- `GET` Route Handlers are **not cached by default** (opt in with `export const dynamic = 'force-static'`).
- The client **Router Cache** no longer reuses page segments by default (`staleTimes.dynamic` is 0); layouts and shared segments are still reused.
- `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` became **async**.
**Next.js 16 (verify in the official notes):** introduces **Cache Components** (`'use cache'` directive, with `cacheLife`/`cacheTag`) as the explicit, opt-in caching model, evolves Partial Prerendering, makes Turbopack the default bundler, renames `middleware` to `proxy`, and removes synchronous access to async request APIs.
The trend: **from implicit caching to explicit, opt-in caching.**

### Q38. How do you control `fetch` caching?
```ts
fetch(url);                                         // Next 15: uncached by default (Next 14: force-cache)
fetch(url, { cache: 'force-cache' });               // cache in the Data Cache
fetch(url, { cache: 'no-store' });                  // never cache → dynamic rendering
fetch(url, { next: { revalidate: 3600 } });         // ISR: stale after 1 hour
fetch(url, { next: { tags: ['products'] } });       // tag it for on-demand revalidation
```
Segment-level options:
```ts
export const revalidate = 60;              // ISR for the whole route
export const dynamic = 'force-dynamic';    // always dynamic ('auto' | 'force-static' | 'error')
export const fetchCache = 'default-cache';
```

### Q39. What makes a route dynamic?
A route becomes **dynamic** (rendered per request) when it uses a **Dynamic API**: `cookies()`, `headers()`, `searchParams`, `draftMode()`, `connection()`, `unstable_noStore()`, a `fetch` with `cache: 'no-store'`, or `export const dynamic = 'force-dynamic'`. Otherwise Next.js renders it **statically** at build time. Build output marks routes: `○` static, `●` SSG with `generateStaticParams`, `ƒ` dynamic.

### Q40. On-demand revalidation: `revalidatePath` vs `revalidateTag`
```ts
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/blog');                // purge the cache for a path
revalidatePath('/blog/[slug]', 'page'); // for a dynamic route pattern
revalidateTag('posts');                 // purge everything fetched with { next: { tags: ['posts'] } }
```
Call them from Server Actions or Route Handlers (e.g., a CMS webhook). Tags are more precise and scalable. In Next.js 16 `revalidateTag` takes a cache-life profile argument and there are new APIs such as `updateTag`/`refresh` for read-your-writes behavior (check the docs).

### Q41. Server Actions with forms, validation and pending state
```tsx
// app/actions.ts
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
const Schema = z.object({ title: z.string().min(3), body: z.string().min(10) });
export async function createPost(prev: { errors?: Record<string, string[]> } | undefined, formData: FormData) {
  const session = await verifySession();                              // authorize INSIDE the action
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  await db.post.create({ data: { ...parsed.data, authorId: session.userId } });
  revalidatePath('/posts');
  return { errors: undefined };
}
// app/new/page.tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
function Submit() { const { pending } = useFormStatus(); return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>; }
export default function NewPost() {
  const [state, action] = useActionState(createPost, undefined);
  return (<form action={action}><input name="title" />{state?.errors?.title && <p>{state.errors.title[0]}</p>}
    <textarea name="body" />{state?.errors?.body && <p>{state.errors.body[0]}</p>}<Submit /></form>);
}
```
`redirect()` inside an action ends it and navigates (do not wrap it in `try/catch`).

### Q42. Where can Server Actions be used and what do they return?
They can be defined in a file with `'use server'` at the top (importable by Client Components) or inline inside a Server Component function. They accept serializable arguments (`FormData`, strings, objects) and return serializable values. They run via a **POST** request, one at a time per client by default (queued).

### Q43. Route Handler details: request, params, cookies, caching
```ts
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get('session')?.value;
  const q = req.nextUrl.searchParams.get('expand');
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
```
In Next.js 14, `GET` handlers were cached by default if they used no dynamic APIs; in 15 they are not.

### Q44. Middleware: matching, rewriting and limits
```ts
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
// rewrite (URL stays), redirect (URL changes)
return NextResponse.rewrite(new URL('/en' + req.nextUrl.pathname, req.url));
```
Middleware historically ran on the **Edge runtime** (no Node APIs, small bundle). It runs for **every matched request**, including prefetches, so keep it fast. Do not do heavy database work or be the only place for authorization (see Part 4 security notes).

### Q45. Authentication approaches in the App Router
- **Auth.js (NextAuth v5)**, Clerk, Auth0, Supabase Auth, Lucia/custom sessions.
- Store sessions in **HttpOnly, Secure, SameSite cookies**.
- Do **layered checks**: middleware for optimistic redirects, plus authorization inside the **data access layer**, Server Components, route handlers and Server Actions.
```ts
import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export const verifySession = cache(async () => {
  const token = (await cookies()).get('session')?.value;
  const session = await decrypt(token);
  if (!session?.userId) redirect('/login');
  return { userId: session.userId };
});
```

### Q46. Streaming with `loading.tsx` and `Suspense`
`loading.tsx` automatically wraps the page in `<Suspense>`. For finer control, stream parts independently:
```tsx
export default function Page() {
  return (<>
    <Header />                                 {/* instantly visible */}
    <Suspense fallback={<StatsSkeleton />}><Stats /></Suspense>       {/* streams when ready */}
    <Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>
  </>);
}
```
This improves perceived performance because the shell is sent first. Keep fallbacks the same size as the final content to avoid layout shift.

### Q47. Parallel data fetching vs waterfalls
```tsx
// ❌ Waterfall
const user = await getUser(); const posts = await getPosts(user.id);
// ✅ Parallel when independent
const [user, stats] = await Promise.all([getUser(), getStats()]);
// ✅ Start early, await later
const userPromise = getUser(); const statsPromise = getStats();
const user = await userPromise;
```
Also use `Suspense` so slow parts do not block fast ones, and `React.cache`/`fetch` memoization to avoid duplicate calls across components.

### Q48. Using Context Providers and third-party libraries
Context needs a Client Component. Create a `Providers` client component and render it in the root layout, passing Server Components as `children`.
```tsx
// app/providers.tsx
'use client';
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}><ThemeProvider>{children}</ThemeProvider></QueryClientProvider>;
}
// app/layout.tsx (Server Component)
<body><Providers>{children}</Providers></body>
```
Third-party components that use hooks need `'use client'`. If a library lacks it, wrap it in your own client file.

### Q49. Image configuration for external images
```ts
// next.config.ts
const config: NextConfig = { images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com', pathname: '/images/**' }] } };
```
Without this you get "hostname is not configured under images". Restrict patterns to avoid abuse of the optimizer (SSRF/cost).

### Q50. `next/script` loading strategies
```tsx
import Script from 'next/script';
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" strategy="afterInteractive" />
<Script id="chat" src="https://chat.example.com/widget.js" strategy="lazyOnload" />
```
Strategies: `beforeInteractive` (critical, root layout only), `afterInteractive` (default), `lazyOnload` (idle), `worker` (experimental, off-main-thread). Prefer `lazyOnload` for non-critical widgets.

### Q51. Redirects, rewrites and headers in `next.config`
```ts
async redirects() { return [{ source: '/old', destination: '/new', permanent: true }]; },
async rewrites() { return [{ source: '/api/:path*', destination: 'https://backend.example.com/:path*' }]; },
async headers() { return [{ source: '/(.*)', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }] }]; },
```
Redirects change the URL (HTTP 307/308); rewrites keep the URL and proxy internally.

### Q52. Pages Router data fetching (still asked in interviews)
```tsx
export async function getStaticProps() { const posts = await getPosts(); return { props: { posts }, revalidate: 60 }; }      // SSG + ISR
export async function getServerSideProps(ctx) { return { props: { user: await getUser(ctx.req) } }; }                   // SSR per request
export async function getStaticPaths() { return { paths: [{ params: { id: '1' } }], fallback: 'blocking' }; }            // dynamic SSG
```
`fallback`: `false` (404 for unknown paths), `true` (serve a fallback shell, then data loads on the client), `'blocking'` (SSR on first request, then cache).

### Q53. `useRouter` methods and `router.refresh()`
`push`, `replace`, `back`, `forward`, `prefetch`, `refresh`. `router.refresh()` re-fetches the **server-rendered** parts of the current route (Server Components data) without losing client state (like input values) and updates the Router Cache.

### Q54. Static export (`output: 'export'`)
Generates a static site in `out/`. Not supported: dynamic rendering, route handlers using the request, middleware, ISR, default image optimization (use a custom loader or `unoptimized`), Server Actions. Good for static hosting (GitHub Pages, S3).

### Q55. Draft mode and preview
`draftMode().enable()` in a route handler (after validating a secret) sets a bypass cookie so pages render dynamically with draft CMS content for editors; public users still see the cached version.

### Q56. Handling forms with `next/form`
`<Form action="/search">` (from `next/form`) does a client-side navigation with the form values as search params and prefetches the target layout, falling back to normal GET form behavior without JS.

### Q57. Cookies and headers in Next.js
```ts
import { cookies, headers } from 'next/headers';
const store = await cookies();                 // Next 15+: async
store.get('theme')?.value;
store.set('theme', 'dark', { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });  // allowed only in Server Actions, Route Handlers, middleware
const ua = (await headers()).get('user-agent');
```
You cannot set cookies while rendering a Server Component (response headers are already streaming).

### Q58. Internationalization (i18n) in the App Router
The built-in `i18n` config is for the Pages Router only. In the App Router use a `[locale]` route segment with middleware locale detection, plus libraries such as `next-intl` or `react-i18next`. Generate static params per locale and set `<html lang>` and `hreflang` alternates in metadata.

### Q59. Absolute imports and aliases
`tsconfig.json` `paths` (`"@/*": ["./src/*"]`) are supported out of the box. `create-next-app` sets `@/*`.

### Q60. Linting, formatting and type checking
`next lint` (ESLint with `eslint-config-next`; in Next.js 16 the built-in command is removed, use ESLint directly), Prettier, and `tsc --noEmit` in CI. The Next.js TypeScript plugin and typed routes catch invalid links.

### Q61. What is `next start` vs `next dev` vs `next build`?
`next dev`: development server with HMR and on-demand compilation. `next build`: production build (compiles, prerenders static routes, prints the route table). `next start`: runs the production server (Node). Always test with build + start, because dev behaves differently (caching, errors, prefetch).

### Q62. How does Next.js handle CSS?
Global CSS only in the root layout (or any layout), CSS Modules anywhere, Tailwind via PostCSS, and CSS-in-JS needing a registry for SSR. Styles are code-split per route and deduplicated.

### Q63. What are route groups and when do you use them?
Folders in parentheses `(group)` organize routes without affecting URLs, and let you have **multiple root layouts** or different layouts per group (`(marketing)`, `(app)`).

### Q64. What is a parallel route?
Named slots (`@analytics`, `@team`) rendered side by side in a layout, each with independent loading/error states.
```tsx
export default function Layout({ children, analytics, team }: { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }) {
  return <>{children}{analytics}{team}</>;
}
```
Add `default.tsx` as a fallback when a slot has no match during full-page loads.

---

# 🟡 Part 3: Mid (3–5 years)

### Q65. Intercepting routes + parallel routes: the modal pattern
Show a photo in a modal when navigating from the gallery, but render a full page on direct load/refresh.
```
app/
  layout.tsx                 // renders {children} and {modal}
  @modal/
    default.tsx              // returns null
    (.)photo/[id]/page.tsx   // intercepts /photo/[id] → shows the modal
  photo/[id]/page.tsx        // full page (direct visit)
  gallery/page.tsx
```
Interception markers: `(.)` same level, `(..)` one level up, `(..)(..)` two levels up, `(...)` from the root. Close the modal with `router.back()`.

### Q66. Partial Prerendering (PPR) and Cache Components
**PPR** renders a **static shell** at build time (served instantly from the CDN) and streams **dynamic holes** (wrapped in `Suspense`) at request time, in one HTTP response. In Next.js 16 this evolves into **Cache Components**: you opt in to caching with the `'use cache'` directive; anything not cached is dynamic by default.
```tsx
// Next.js 16 / canary style (verify current docs)
async function Products() {
  'use cache';
  cacheLife('hours'); cacheTag('products');
  return <List items={await db.product.findMany()} />;
}
export default function Page() {
  return (<><Header /><Products /><Suspense fallback={<CartSkeleton />}><Cart /></Suspense></>);   // Cart reads cookies → dynamic hole
}
```
Benefit: static speed + personalized parts without choosing one mode per route.

### Q67. `unstable_cache`, `React.cache` and `use cache`
- `React.cache(fn)`: **per-request** memoization of any function (DB calls), not persisted.
- `unstable_cache(fn, keys, { tags, revalidate })`: persists results in the **Data Cache** for non-`fetch` data sources (older API).
- `'use cache'` (Next.js 15 canary → 16): the new directive-based caching with `cacheLife` and `cacheTag`.
```ts
const getUser = unstable_cache(async (id: string) => db.user.findUnique({ where: { id } }), ['user'], { tags: ['users'], revalidate: 3600 });
```

### Q68. Server/Client composition patterns
- Keep `'use client'` at **leaf components** (buttons, forms, widgets).
- Pass Server Components as `children`/props to Client Components (slot pattern).
- Fetch data in Server Components and pass **serializable props** down (no functions, class instances, Dates become strings).
- Use `server-only` and `client-only` packages to prevent accidental imports.
- Wrap libraries that need browser APIs in a small client wrapper.
```tsx
import 'server-only';           // build error if imported by a Client Component
```

### Q69. Server Actions security *(Must-know)*
Server Actions are **public POST endpoints**, even if only used by your forms.
- **Authenticate and authorize inside every action** (do not rely on the page being hidden).
- **Validate all input** (Zod); never trust `FormData`.
- Beware of **closure variables**: they are encrypted, but treat action arguments as untrusted.
- Next.js checks that the `Origin` matches `Host` (CSRF protection) and removes unused actions from the client bundle; configure `serverActions.allowedOrigins` behind proxies.
- Apply **rate limiting** to expensive actions.
- Limit body size (`serverActions.bodySizeLimit`, default 1 MB).
- Do not return secrets or whole DB rows (return only needed fields).

### Q70. Optimistic UI with Server Actions
```tsx
'use client';
import { useOptimistic } from 'react';
function Todos({ todos, addTodo }: { todos: Todo[]; addTodo: (fd: FormData) => Promise<void> }) {
  const [optimistic, addOptimistic] = useOptimistic(todos, (state, text: string) => [...state, { id: 'tmp', text, pending: true }]);
  return (<>
    <form action={async (fd) => { addOptimistic(String(fd.get('text'))); await addTodo(fd); }}><input name="text" /><button>Add</button></form>
    <ul>{optimistic.map((t) => <li key={t.id} style={{ opacity: t.pending ? 0.5 : 1 }}>{t.text}</li>)}</ul></>);
}
```

### Q71. Images: `sizes`, `fill`, `priority`, blur placeholders and formats
- `sizes` tells the browser how wide the image will be so it picks the right candidate from `srcset`. Omitting it with `fill` may download oversized images.
- Use `priority` (or the preload option in newer versions) only for the LCP image.
- `placeholder="blur"` with `blurDataURL` (automatic for static imports).
- Configure formats `['image/avif', 'image/webp']`, `minimumCacheTTL`, and `deviceSizes`/`imageSizes` if needed.
- Self-hosting needs `sharp` installed for the optimizer (installed automatically in recent versions) and enough CPU; alternatives: a custom `loader` for Cloudinary/imgix.

### Q72. Optimize third-party packages and bundle size
`@next/bundle-analyzer`, `experimental.optimizePackageImports` (for barrel-file packages like icon libraries), `next/dynamic` for heavy client widgets, `transpilePackages` for ESM/TS packages, and keep large libraries on the server (Server Components). Check the build output "First Load JS" per route.

### Q73. Edge runtime vs Node.js runtime
```ts
export const runtime = 'edge';        // or 'nodejs' (default)
```
| | Edge | Node.js |
|---|---|---|
| Start-up | Very fast, global | Slower cold start, regional |
| APIs | Web standard APIs only (no `fs`, limited packages) | Full Node APIs |
| Bundle size limit | Small | Large |
| Best for | Middleware, simple personalization, redirects | DB access, heavy libraries, most apps |
Database access from the edge is often **slower** if the database is in one region. Default to Node.js unless you have a reason.

### Q74. Metadata deep dive: OG images, sitemap, robots, JSON-LD
```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [{ url: 'https://example.com', lastModified: new Date() }, ...posts.map((p) => ({ url: `https://example.com/blog/${p.slug}`, lastModified: p.updatedAt }))];
}
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 }; export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = await getPost(slug);
  return new ImageResponse(<div style={{ fontSize: 64, display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>{post.title}</div>, size);
}
// JSON-LD
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
```
`generateMetadata` fetches are memoized, so calling the same `fetch` in the page and metadata costs one request.

### Q75. Testing Next.js apps
- **Unit/component:** Vitest/Jest + React Testing Library for Client Components and pure functions.
- **Async Server Components:** limited support in unit test runners; prefer **E2E** (Playwright/Cypress) or test the data functions separately.
- **Route handlers:** call the exported function with a `Request` and assert the `Response`.
- **E2E:** Playwright against `next build && next start`.
- **Mock network** with MSW.

### Q76. Error handling strategy
`error.tsx` per segment (Client Component, with `reset`), `global-error.tsx` for the root, `not-found.tsx`, expected errors from Server Actions returned as **state** (not thrown), unexpected errors thrown and caught by boundaries, and monitoring with Sentry via `instrumentation.ts` (`onRequestError`). In production, server error messages are hidden from the client and logged with a digest.

### Q77. Observability and `instrumentation.ts`
`instrumentation.ts` runs once on server start (stable in Next.js 15): register OpenTelemetry, Sentry, logging. Use `onRequestError` to capture server errors with route context. Report Web Vitals with `useReportWebVitals`.

### Q78. `after()`: do work after the response
```ts
import { after } from 'next/server';
export async function POST(req: Request) {
  const data = await save(await req.json());
  after(async () => { await logAnalytics(data.id); });        // runs after the response is sent
  return Response.json(data);
}
```
Good for logging and analytics without delaying the user (stable since Next.js 15.1).

### Q79. State management in a Next.js app
Server state: fetch in Server Components or use TanStack Query with hydration (`HydrationBoundary`) for client interactivity. URL state in `searchParams`. Client global state (Zustand/Redux): create the **store per request** inside a client provider to avoid sharing state between users on the server; never keep per-user data in module-level variables on the server.

### Q80. Server-only module-level state is dangerous
Module variables on the server are shared across requests (and users) within a process. Do not store request-specific data in them. Use `cookies()`/`headers()`, `React.cache`, or request-scoped context instead.

### Q81. File uploads
Use a Route Handler or Server Action reading `request.formData()`; for large files use **pre-signed URLs** (S3/GCS) from the client directly to storage. Respect body size limits; process large files in background jobs.

### Q82. WebSockets and real-time
Serverless/function-based deployments do not keep long-lived connections. Use SSE from a route handler (streaming `ReadableStream`), a managed service (Pusher, Ably, Supabase Realtime), or a separate WebSocket server. Polling/`revalidate` is often enough.

### Q83. Route handler streaming (SSE) example
```ts
export const dynamic = 'force-dynamic';
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder(); let i = 0;
      const id = setInterval(() => { controller.enqueue(enc.encode(`data: ${JSON.stringify({ tick: ++i })}\n\n`)); if (i === 10) { clearInterval(id); controller.close(); } }, 1000);
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } });
}
```

### Q84. Authentication with Auth.js (NextAuth v5) outline
```ts
// auth.ts
import NextAuth from 'next-auth'; import GitHub from 'next-auth/providers/github';
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [GitHub], callbacks: { session({ session, token }) { session.user.id = token.sub!; return session; } } });
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'; export const { GET, POST } = handlers;
// Server Component
import { auth } from '@/auth'; const session = await auth(); if (!session) redirect('/login');
```

### Q85. Database access patterns
Use an ORM (Prisma/Drizzle) in Server Components and actions, inside a **data access layer** (`import 'server-only'`) that returns DTOs (only the fields needed). In serverless, use connection pooling (PgBouncer, Prisma Accelerate, Neon/Supabase poolers) to avoid exhausting connections; reuse the client across hot reloads in dev with a global singleton.

### Q86. `generateStaticParams` + `dynamicParams` + ISR
```tsx
export const dynamicParams = true;              // unknown params rendered on demand (default); false → 404
export const revalidate = 3600;
export async function generateStaticParams() { return (await getTopPosts()).map((p) => ({ slug: p.slug })); }
```
Pre-render the most important pages at build time, generate the rest on first request, and keep them fresh with ISR. This keeps build times low for large sites.

### Q87. Middleware for A/B testing, geolocation and feature flags
```ts
export function middleware(req: NextRequest) {
  const bucket = req.cookies.get('bucket')?.value ?? (Math.random() < 0.5 ? 'a' : 'b');
  const url = req.nextUrl.clone(); url.pathname = `/variants/${bucket}${url.pathname}`;
  const res = NextResponse.rewrite(url);
  res.cookies.set('bucket', bucket);
  return res;
}
```
Rewriting to pre-rendered variants keeps pages static and fast. Avoid client-side flicker scripts.

### Q88. Security headers and CSP with nonces
Add static headers in `next.config` (`headers()`), and for CSP with nonces generate the nonce in middleware, set it in the `Content-Security-Policy` header and a request header, and read it in the layout for `<Script nonce>`. Using nonces forces **dynamic rendering** of pages (a nonce must be unique per request), so measure the trade-off or use hash-based CSP for static pages.

### Q89. Core Web Vitals in Next.js
LCP: `priority` on the hero image, static/ISR rendering, streaming, `next/font`. INP: fewer Client Components, lazy-load heavy widgets, avoid hydrating large trees. CLS: image dimensions, font fallback metrics, skeletons with fixed size. Measure with `useReportWebVitals` and field data (CrUX/RUM).

### Q90. Pages Router → App Router migration strategy
Both routers run side by side. Migrate route by route: move shared UI to layouts, convert `getServerSideProps`/`getStaticProps` to async Server Components with `fetch` caching options, `next/head` → Metadata API, `pages/api` → route handlers, `_app`/`_document` → root layout, `next/router` → `next/navigation`. Keep URLs identical. Use feature flags and measure.

### Q91. Handling `searchParams`-driven pages efficiently
Reading `searchParams` makes the route dynamic. For filters/pagination, keep the page dynamic but cache the data layer (`unstable_cache`/`use cache` by params) or use client-side navigation with prefetch. Debounce URL updates in the client and use `router.replace` with `{ scroll: false }`.

### Q92. Monitoring build and server performance
Analyze `next build` output, use the bundle analyzer, enable Turbopack, reduce shared client code, split large pages with Suspense, keep middleware small, and watch server logs (slow queries, cache misses). Use `NEXT_PRIVATE_DEBUG_CACHE` / verbose fetch logging in development to inspect caching (`logging.fetches`).


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. Design a caching strategy for a large content + commerce site *(Architecture)*
1. **Classify pages:** static marketing (SSG), catalog/product (ISR + tags), personalized (dynamic holes), account/checkout (dynamic, no cache).
2. **Use tags, not paths,** for invalidation: tag data by entity (`product:123`, `category:shoes`, `prices`), and revalidate tags from CMS/ERP webhooks.
3. **Layer caches:** CDN (`s-maxage` + `stale-while-revalidate`), Next.js Data/Route cache, application cache (Redis), database.
4. **Personalization at the edge of the page:** static shell + dynamic holes (PPR/Cache Components) or client-side fetch for user-specific parts.
5. **Plan invalidation first:** who triggers it (webhook), what it purges, what happens during stampedes (`stale-while-revalidate` absorbs them), and how you verify (cache headers, `x-nextjs-cache`).
6. **Multi-instance reality:** the default filesystem cache is per instance. For several servers use a shared **custom cache handler** (e.g., Redis) so ISR and tags stay consistent.
7. **Monitor:** cache hit ratio, origin load, regeneration time, stale-serve counts.

### Q94. Self-hosting Next.js in production: what must you handle? *(Scenario)*
- **Build output:** `output: 'standalone'` creates a minimal server; copy `public/` and `.next/static`. Run behind a reverse proxy/CDN.
- **Process management:** run multiple instances, health checks, graceful shutdown (handle SIGTERM), memory limits.
- **Shared cache:** ISR/Data Cache across instances (custom `cacheHandler` with Redis or a shared volume).
- **Image optimization:** CPU heavy; use `sharp`, set limits (`minimumCacheTTL`, allowed `remotePatterns`), or an external image CDN/loader.
- **Environment variables:** `NEXT_PUBLIC_*` are inlined at **build time**; server variables are read at runtime. Build once and promote the same image across environments only if client config does not differ.
- **Skew protection:** old clients hitting new servers (or the reverse) during deploys; keep old assets for a while and use deployment IDs where available.
- **Observability:** logs, OpenTelemetry, error tracking, request IDs.
- **Streaming:** make sure the proxy does not buffer responses (e.g., disable proxy buffering in Nginx, check compression settings), otherwise Suspense streaming looks like a single slow response.

### Q95. Vercel vs self-hosting: how do you decide?
| | Vercel | Self-host (Docker/Kubernetes/VM) |
|---|---|---|
| Setup | Minimal | You own infra |
| Feature support | Full, first-class (PPR, ISR, image optimization, edge) | Most features; some need setup (shared cache, image CPU) |
| Cost | Usage-based, can grow with traffic | Predictable infra cost, more ops work |
| Control/compliance | Limited regions/controls | Full control, data residency |
| Scaling | Automatic | You design autoscaling |
Decide on team size, traffic profile, compliance, budget and operational skill. Many teams start on Vercel and move high-traffic workloads later.

### Q96. Security model for Next.js apps *(Must-know)*
- **Authorization at every data boundary:** the **data access layer**, route handlers and Server Actions check the user; Server Components that render sensitive data check too. Middleware is only a first, optimistic filter.
- **Lesson from the 2025 middleware bypass (CVE-2025-29927):** a crafted `x-middleware-subrequest` header could skip middleware in affected versions, so apps that relied **only** on middleware for authorization were exposed. Keep Next.js patched and use defense in depth.
- **Server Actions** are public endpoints: validate inputs, check auth, rate limit.
- **Secrets:** server-only env vars, `import 'server-only'`, React `taint` APIs (experimental) to prevent leaking objects/values to clients; never use `NEXT_PUBLIC_` for secrets.
- **SSRF:** restrict `images.remotePatterns`, validate URLs in route handlers that fetch user-provided URLs.
- **XSS:** React escapes by default; sanitize HTML, escape JSON-LD, use CSP.
- **CSRF:** SameSite cookies; Server Actions have Origin checks; for route handlers using cookies add CSRF tokens or origin checks.
- **Headers:** CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protections.
- **Dependencies and supply chain:** lockfiles, audits, Renovate.

### Q97. Authorization architecture: the Data Access Layer (DAL) pattern
Centralize data access in `server-only` modules that (1) verify the session, (2) check permissions, (3) return **DTOs** with only allowed fields.
```ts
// data/posts.ts
import 'server-only';
export async function getPostForUser(id: string) {
  const { userId, role } = await verifySession();
  const post = await db.post.findUnique({ where: { id } });
  if (!post || (post.authorId !== userId && role !== 'admin')) return null;
  return { id: post.id, title: post.title, body: post.body };      // DTO: no internal fields
}
```
Components never call the database directly. This prevents forgetting a check in one place and makes audits easy.

### Q98. Handling RSC payload size and serialization costs
Everything passed from Server to Client Components is serialized into the RSC payload and also affects HTML size. Avoid passing large objects as props; pass IDs and fetch in the client component or server child; select only needed fields; avoid passing the same big list twice (once as HTML, once as props); stream large lists with Suspense. Monitor "page data" size in the Network tab (RSC responses, `_rsc` requests).

### Q99. Client-side navigation and the Router Cache (practical behavior)
After the first load, `<Link>` navigations fetch RSC payloads for new segments and **reuse layouts**. The Router Cache stores visited/prefetched segments in memory; `router.refresh()` and Server Actions that call `revalidatePath`/`revalidateTag` invalidate it. Next.js 15 sets the default `staleTimes` for page segments to 0 (always fresh) but keeps layouts/loading states reusable; you can configure `experimental.staleTimes`. Understand this when users report "I updated data but the page still shows old data".

### Q100. Version skew and deployments
During a deployment, a user with an old page may request chunks or server actions that no longer exist. Mitigate: keep old static assets for some time, use immutable hashed assets, enable platform skew protection (deployment IDs), handle chunk-load errors with a one-time reload, and make Server Action IDs stable across compatible deploys (or pin `serverActions.encryptionKey` across instances so encrypted closures work after redeploys and in multi-instance setups).

### Q101. Multi-tenant architecture
Resolve the tenant from the hostname (middleware) and **rewrite** to an internal path (`/_sites/[tenant]/...`), keeping pages cacheable per tenant. Use tenant-scoped cache tags, per-tenant theming via CSS variables, separate data access rules (row-level security), and wildcard domains. Be careful with global/module state and cache keys that ignore the tenant.

### Q102. Performance engineering: where to look *(Method)*
1. **Measure** (Lighthouse, field CWV, Next.js build output, bundle analyzer).
2. **Reduce client JS:** keep components on the server, lazy-load widgets, avoid large client-only libraries, optimize package imports.
3. **Network:** parallelize fetches, avoid waterfalls, stream with Suspense, cache aggressively, CDN.
4. **Rendering:** static or ISR where possible; PPR/Cache Components for mixed pages.
5. **Assets:** `next/image` with correct `sizes`, `next/font`, no render-blocking third parties.
6. **Server:** database indexes, connection pooling, avoid N+1 queries, cache expensive computations.
7. **Monitor** regressions in CI and RUM.

### Q103. Edge vs regional compute for data-heavy pages
The edge reduces network latency to the user but increases latency to a single-region database. For data-heavy pages, run compute **near the data** (regional Node.js functions) and use the edge for routing, auth gating, redirects and static delivery. With globally replicated databases or edge KV/caches, edge rendering becomes attractive.

### Q104. Handling long-running and background work
Request-time functions have time limits. Use `after()` for small post-response tasks, queues/workers (BullMQ, SQS, Inngest, Trigger.dev, QStash) for long jobs, cron endpoints triggered by schedulers, and webhooks for external completion. Return quickly with a job ID and poll or stream status.

### Q105. Real-time features
SSE via route handlers for server-to-client streams; managed pub/sub (Pusher/Ably/Supabase Realtime) or a dedicated WebSocket service; avoid holding connections in short-lived serverless functions; combine with `revalidateTag` to refresh server-rendered data.

### Q106. Feature flags and experimentation
Evaluate flags on the server (Server Components/middleware) to avoid flicker, use edge config/flag SDKs for low latency, and rewrite to static variants for A/B tests to keep caching. Include flag state in cache keys or use separate paths so users do not receive the wrong cached variant.

### Q107. Internationalization architecture at scale
`[locale]` segment, middleware detecting locale (Accept-Language, cookie), `generateStaticParams` per locale, message catalogs split per route/namespace, ICU formatting, `hreflang` in metadata, localized slugs via rewrites, RTL support, and translation workflow (TMS integration). Avoid shipping all locales to the client.

### Q108. Testing strategy for a large Next.js codebase
Pyramid: unit tests for pure logic and data layer, component tests for Client Components, integration tests for route handlers/actions with a test database, E2E (Playwright) for critical flows against a production build, visual regression for the design system, and contract tests for external APIs. Seed deterministic data, mock third parties, run in CI with caching of builds.

### Q109. Upgrading Next.js safely
Read the upgrade guide for each major, run `npx @next/codemod@latest` (or `next upgrade`) for automated changes (async request APIs, config renames), upgrade React/React DOM together, update libraries (auth, i18n, UI), run on a canary branch with E2E and performance comparisons, watch caching behavior changes (fetch defaults, Router Cache), and roll out gradually. Pin versions; avoid skipping majors.

### Q110. Monorepo setup with Next.js
Turborepo/Nx with `apps/web` and shared `packages/ui`, `packages/config`, `packages/db`. Use `transpilePackages` for internal TS packages, a single React version (peer dependencies), shared ESLint/TS configs, remote build caching, and per-app environment variables. Ensure shared packages mark client components with `'use client'` correctly.

### Q111. CSS-in-JS, UI kits and Server Components compatibility
Runtime CSS-in-JS (styled-components, emotion) needs registries and Client Components and does not fit Server Components well. Prefer CSS Modules, Tailwind, or zero-runtime solutions (vanilla-extract, Panda). For UI kits (MUI, Chakra, shadcn/ui built on Radix) check RSC support; wrap interactive parts in client files.

### Q112. Build performance and CI
Use Turbopack (where stable), cache `.next/cache` between CI runs, split lint/type-check/test jobs, avoid pre-rendering thousands of pages at build time (use `generateStaticParams` selectively + on-demand ISR), limit `staticPageGenerationTimeout` issues by speeding data sources, and watch memory use (large builds may need more RAM).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Next.js vs alternatives: how do you decide? *(Decision)*
| Option | Strengths | Trade-offs |
|---|---|---|
| **Next.js (App Router)** | Huge ecosystem, RSC, streaming, ISR, great DX, many hosting options | Complexity (caching, boundaries), coupling to Vercel conventions |
| **React Router v7 / Remix** | Web-standards, loaders/actions, simpler data model | Smaller ecosystem, fewer built-in optimizations |
| **Astro** | Content sites, minimal JS, multi-framework | Not for highly interactive apps |
| **Vite SPA + API** | Simple, full client control | SEO/first paint work needed, no SSR by default |
| **Nuxt/SvelteKit/Angular Universal** | Strong if the team uses Vue/Svelte/Angular | Different ecosystem |
Choose based on SEO needs, interactivity, team skills, hosting/compliance, performance targets and longevity. Record an ADR.

### Q114. Define rendering and caching policy per route type
Create a short policy: marketing → static; content → ISR with tags; app dashboards → dynamic/client-heavy with streaming; personalized pages → PPR/dynamic holes; APIs → explicit cache headers. Provide route templates, examples and lint rules so teams do not accidentally make pages dynamic or cache private data.

### Q115. Platform strategy: Vercel vs self-hosted vs hybrid
Evaluate cost at scale, compliance, team ops maturity and feature needs. Hybrid options: static assets and images on a CDN, dynamic rendering on your infrastructure, edge for routing. Plan portability early (avoid relying on proprietary features without an exit path) and document the operational runbook.

### Q116. Governance for a shared Next.js platform
A platform team provides: starter templates (auth, logging, metadata, CSP), shared packages (design system, data access, config), codemods for upgrades, ESLint rules (no direct DB access in components, correct `'use client'` use), performance budgets, and docs/ADRs. Product teams own features; the platform team owns paved roads.

### Q117. Migration plan: CRA/Vite/Pages → App Router at scale
Pilot a low-risk route, define client/server boundary guidelines, move data fetching to the server gradually, keep URLs stable, run both routers in parallel, measure (LCP, INP, bundle size, error rate, server cost), train developers, and set a deprecation timeline for the old patterns. Avoid a freeze-and-rewrite.

### Q118. Reliability and incident readiness
Define SLOs (availability, p95 latency, error rate, Core Web Vitals), alert on regressions per release, support instant rollback and feature-flag kill switches, handle version skew, load-test caching behavior (stampede protection), prepare runbooks for cache poisoning/purge, and run post-incident reviews.

### Q119. Cost management
Understand cost drivers: function invocations and duration, ISR writes/reads, image optimization, bandwidth, build minutes, and data transfer. Reduce with static rendering where possible, caching, optimized images, shorter functions, edge for light work, and tracking cost per route/feature.

### Q120. Security governance
Patch cadence for Next.js (subscribe to security advisories), mandatory authorization via DAL, dependency scanning, secret management, CSP standards, penetration tests focused on Server Actions/route handlers/middleware bypasses, and security reviews for new endpoints.

### Q121. Hiring and mentoring for Next.js depth
Assess: server/client boundary understanding, caching mental model, data fetching patterns, auth/security thinking, performance debugging, and trade-off reasoning. Mentor through code reviews with "where does this run / what is cached" questions, shared diagrams, and short internal workshops.

### Q122. Documentation and decision records
Write ADRs for rendering strategy, state/data patterns, auth, caching, hosting, and design system integration. Keep "how we use Next.js" guides with examples of good/bad code, and keep them updated when upgrading majors.

### Q123. Measuring success
Track Core Web Vitals (field), build and deploy times, error rates, cache hit ratios, bundle size per route, developer satisfaction, time to ship a feature, and cost per thousand requests. Review quarterly and adjust the platform.

### Q124. Vendor lock-in risk management
Prefer open standards (Web APIs, SQL, OpenTelemetry), abstract storage/queue/cache behind interfaces, avoid platform-specific APIs without wrappers, run a periodic "can we deploy elsewhere" drill (Docker standalone), and keep configuration in code.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice these App Router tasks. For each one, explain: **where it runs, what is cached, and what is sent to the browser.**

### C1. Root layout with font, metadata and providers
```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = {
  title: { default: 'Ritesh Kumar', template: '%s | Ritesh Kumar' },
  description: 'Full-stack developer portfolio',
  metadataBase: new URL('https://example.com'),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
```

### C2. Blog: static params, metadata, 404 and ISR
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
export const revalidate = 3600;                                  // ISR: regenerate at most hourly
export async function generateStaticParams() { return (await getPosts()).map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = await getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <article><h1>{post.title}</h1><div>{post.html}</div></article>;
}
```
`getPost` is called twice (metadata + page), so wrap it in `React.cache` or rely on `fetch` memoization.

### C3. Search page driven by the URL (debounced client input)
```tsx
// app/search/page.tsx (Server Component)
export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = '', page = '1' } = await searchParams;
  const results = await searchProducts(q, Number(page));
  return (<><SearchBox initial={q} /><ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul></>);
}
// app/search/SearchBox.tsx
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function SearchBox({ initial }: { initial: string }) {
  const [text, setText] = useState(initial);
  const router = useRouter(); const pathname = usePathname();
  useEffect(() => {
    if (text === initial) return;
    const id = setTimeout(() => router.replace(`${pathname}?q=${encodeURIComponent(text)}`, { scroll: false }), 300);
    return () => clearTimeout(id);
  }, [text, initial, pathname, router]);
  return <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search..." aria-label="Search" />;
}
```

### C4. Pagination with `searchParams`
```tsx
export default async function List({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page ?? 1));
  const { items, total } = await getItems({ page, pageSize: 10 });
  const pages = Math.ceil(total / 10);
  return (<>
    <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    <nav aria-label="Pagination">
      {page > 1 && <Link href={`?page=${page - 1}`}>Previous</Link>}
      <span> {page} / {pages} </span>
      {page < pages && <Link href={`?page=${page + 1}`}>Next</Link>}
    </nav></>);
}
```

### C5. Todo list: Server Action with `bind` for delete
```tsx
// app/todos/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
export async function deleteTodo(id: string) {
  const { userId } = await verifySession();
  await db.todo.deleteMany({ where: { id, userId } });          // scope by user: authorization
  revalidatePath('/todos');
}
// app/todos/page.tsx (Server Component)
{todos.map((t) => (
  <li key={t.id}>{t.text}
    <form action={deleteTodo.bind(null, t.id)}><button aria-label={`Delete ${t.text}`}>✕</button></form>
  </li>))}
```

### C6. REST route handlers with validation, auth and errors
```ts
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
const Body = z.object({ title: z.string().min(3), body: z.string().min(10) });
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  return NextResponse.json(await db.post.findMany({ skip: (page - 1) * 10, take: 10 }));
}
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const post = await db.post.create({ data: { ...parsed.data, authorId: session.userId } });
  return NextResponse.json(post, { status: 201 });
}
```

### C7. Webhook with signature verification and tag revalidation
```ts
// app/api/revalidate/route.ts
import crypto from 'node:crypto';
import { revalidateTag } from 'next/cache';
export async function POST(req: Request) {
  const raw = await req.text();                                        // use the RAW body for signatures
  const signature = req.headers.get('x-signature') ?? '';
  const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET!).update(raw).digest('hex');
  const valid = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return new Response('Invalid signature', { status: 401 });
  const { type } = JSON.parse(raw);
  if (type === 'post.updated') revalidateTag('posts');
  return Response.json({ ok: true });
}
```

### C8. Middleware: auth redirect + locale + security headers
```ts
// middleware.ts (proxy.ts in Next.js 16)
import { NextResponse, type NextRequest } from 'next/server';
const locales = ['en', 'hi'];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const pref = req.headers.get('accept-language')?.startsWith('hi') ? 'hi' : 'en';
    return NextResponse.redirect(new URL(`/${pref}${pathname}`, req.url));
  }
  if (pathname.includes('/dashboard') && !req.cookies.get('session')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  return res;
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
```

### C9. CSP with a per-request nonce
```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = [
    "default-src 'self'", `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`, `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data:", "font-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ].join('; ');
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
// app/layout.tsx
import { headers } from 'next/headers';
const nonce = (await headers()).get('x-nonce') ?? undefined;
<Script src="/analytics.js" nonce={nonce} strategy="afterInteractive" />
```
(Nonces make the page dynamic. Use hashes for static pages.)

### C10. Streaming dashboard with parallel Suspense boundaries
```tsx
export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton h={120} />}><Revenue /></Suspense>
      <Suspense fallback={<Skeleton h={300} />}><RecentOrders /></Suspense>
    </main>
  );
}
async function Revenue() { const data = await getRevenue(); return <RevenueChart data={data} />; }       // independent fetches stream independently
async function RecentOrders() { const orders = await getOrders(); return <OrdersTable orders={orders} />; }
```

### C11. Modal with parallel + intercepting routes
```
app/layout.tsx                  -> export default function Layout({ children, modal }) { return <>{children}{modal}</>; }
app/@modal/default.tsx          -> export default function Default() { return null; }
app/@modal/(.)photo/[id]/page.tsx   (intercepts)
app/photo/[id]/page.tsx             (full page on refresh/direct)
```
```tsx
// app/@modal/(.)photo/[id]/page.tsx
import Modal from '@/components/Modal';
export default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Modal><Photo id={id} /></Modal>;                     // Modal is a Client Component using router.back() to close
}
```

### C12. Login: session cookie with a signed JWT
```ts
// app/login/actions.ts
'use server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const key = new TextEncoder().encode(process.env.SESSION_SECRET);
export async function login(_prev: unknown, formData: FormData) {
  const user = await verifyCredentials(String(formData.get('email')), String(formData.get('password')));
  if (!user) return { error: 'Invalid email or password' };
  const token = await new SignJWT({ userId: user.id }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key);
  (await cookies()).set('session', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  redirect('/dashboard');                                       // outside any try/catch
}
```

### C13. SEO files: robots, sitemap, JSON-LD
```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard/', '/api/'] }], sitemap: 'https://example.com/sitemap.xml' };
}
```
```tsx
const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.date };
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
```

### C14. Responsive `next/image` gallery
```tsx
<ul className="grid">
  {photos.map((p, i) => (
    <li key={p.id} style={{ position: 'relative', aspectRatio: '4 / 3' }}>
      <Image src={p.url} alt={p.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
             style={{ objectFit: 'cover' }} priority={i < 2} placeholder="blur" blurDataURL={p.blur} />
    </li>))}
</ul>
```

### C15. Client-only heavy component with `dynamic`
```tsx
'use client';
import dynamic from 'next/dynamic';
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <p>Loading map...</p> });
export default function Location() { return <MapView />; }
```

### C16. Infinite scroll with a Server Action
```tsx
// actions.ts
'use server';
export async function loadMore(cursor: string | null) { return db.post.findMany({ take: 10, ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}), orderBy: { id: 'asc' } }); }
// Feed.tsx
'use client';
export default function Feed({ initial }: { initial: Post[] }) {
  const [items, setItems] = useState(initial);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (done || !ref.current) return;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      const next = await loadMore(items.at(-1)?.id ?? null);
      if (next.length === 0) setDone(true); else setItems((x) => [...x, ...next]);
    }, { rootMargin: '300px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [items, done]);
  return (<><ul>{items.map((p) => <li key={p.id}>{p.title}</li>)}</ul>{!done && <div ref={ref}>Loading...</div>}</>);
}
```

### C17. Simple rate limiting in a route handler (single instance)
```ts
const hits = new Map<string, { count: number; reset: number }>();
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now(); const entry = hits.get(ip);
  if (!entry || entry.reset < now) hits.set(ip, { count: 1, reset: now + 60_000 });
  else if (++entry.count > 10) return new Response('Too Many Requests', { status: 429, headers: { 'Retry-After': '60' } });
  return Response.json({ ok: true });
}
```
In production with several instances, use a shared store (Redis/Upstash) instead of an in-memory `Map`.

### C18. Pre-signed upload URL
```ts
// app/api/upload-url/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3 = new S3Client({ region: process.env.AWS_REGION });
export async function POST(req: Request) {
  const { userId } = await verifySession();
  const { filename, type } = await req.json();
  if (!/^image\/(png|jpeg|webp)$/.test(type)) return Response.json({ error: 'Invalid type' }, { status: 400 });
  const key = `uploads/${userId}/${crypto.randomUUID()}-${filename.replace(/[^\w.-]/g, '_')}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: process.env.BUCKET!, Key: key, ContentType: type }), { expiresIn: 60 });
  return Response.json({ url, key });
}
```

### C19. Dockerfile for `output: 'standalone'`
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### C20. `next.config.ts` with images, headers, redirects and rewrites
```ts
import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'standalone',
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com', pathname: '/images/**' }], formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ] }];
  },
  async redirects() { return [{ source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true }]; },
  async rewrites() { return [{ source: '/proxy/:path*', destination: 'https://api.example.com/:path*' }]; },
};
export default config;
```

### C21. TanStack Query with Server Component prefetch
```tsx
// app/posts/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
export default async function Page() {
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts });
  return <HydrationBoundary state={dehydrate(qc)}><PostsClient /></HydrationBoundary>;
}
// PostsClient.tsx
'use client';
export default function PostsClient() { const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts }); return <PostList posts={data!} />; }
```
Fast first paint from the server, and client-side cache/refetching afterwards.

### C22. Validate environment variables at startup
```ts
// env.ts
import { z } from 'zod';
const schema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url(),
});
export const env = schema.parse(process.env);          // fails fast with a clear message
```

### C23. `'use cache'` with `cacheTag` (Next.js 15 canary / 16 style)
```tsx
import { cacheLife, cacheTag } from 'next/cache';
export async function getProducts() {
  'use cache';
  cacheLife('hours'); cacheTag('products');
  return db.product.findMany();
}
// Invalidate from a Server Action: revalidateTag('products') (check the exact signature for your version)
```
Requires enabling the Cache Components / `dynamicIO` flag depending on the version.

### C24. Test a route handler
```ts
// app/api/health/route.test.ts
import { GET } from './route';
test('health check', async () => {
  const res = await GET();
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});
```

### C25. Playwright E2E for login
```ts
import { test, expect } from '@playwright/test';
test('user can log in and see the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('ritesh@example.com');
  await page.getByLabel('Password').fill('correct-horse');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### C26. Catch-all and optional catch-all docs route
```tsx
// app/docs/[[...slug]]/page.tsx
export default async function Docs({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;                       // [] at /docs, ['guide','intro'] at /docs/guide/intro
  const doc = await getDoc(slug.join('/') || 'index');
  if (!doc) notFound();
  return <Mdx source={doc.content} />;
}
```

### C27. Search form using `next/form`
```tsx
import Form from 'next/form';
export default function SearchForm() {
  return (<Form action="/search"><input name="q" aria-label="Search" /><button>Search</button></Form>);
}
```

### C28. Theme preference via cookie (server-rendered, no flash)
```tsx
// layout.tsx
const theme = (await cookies()).get('theme')?.value ?? 'light';
return <html lang="en" data-theme={theme}>...</html>;
// actions.ts
'use server';
export async function setTheme(theme: 'light' | 'dark') { (await cookies()).set('theme', theme, { path: '/', maxAge: 31536000, sameSite: 'lax' }); }
```
Reading `cookies()` in the root layout makes every page dynamic. For fully static pages use a small inline script and `localStorage` instead.

### C29. Draft mode routes
```ts
// app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('secret') !== process.env.DRAFT_SECRET) return new Response('Invalid token', { status: 401 });
  (await draftMode()).enable();
  redirect(searchParams.get('slug') ?? '/');
}
```

### C30. Open Graph image
```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, background: '#111', color: '#fff' }}>Ritesh Kumar</div>,
    size
  );
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. "Text content does not match server-rendered HTML" (hydration error)
The first client render differs from the server HTML: `Date.now()`, `Math.random()`, `window`/`localStorage` checks in render, locale/time zone differences, invalid HTML nesting (`<div>` in `<p>`), or browser extensions. Fix: render the same output first, then update in `useEffect`; use `suppressHydrationWarning` only for unavoidable text; move browser-only UI into a client component loaded with `dynamic(..., { ssr: false })`.

### D2. "window is not defined" / "document is not defined"
Server code touched a browser API. Move it into `useEffect`, a Client Component, or guard with `typeof window !== 'undefined'`. For libraries that need the browser, use `dynamic` with `ssr: false`.

### D3. "You're importing a component that needs useState. It only works in a Client Component"
Add `'use client'` to that file (or wrap the third-party component in a client file). Keep the boundary at the smallest leaf.

### D4. "Only plain objects can be passed to Client Components from Server Components"
You passed a function, class instance, `Date` handling issue, Map/Set or ORM model with methods. Pass serializable data (plain objects, strings, numbers), map ORM results to DTOs, or move the function into a Client Component or a Server Action.

### D5. "Dynamic server usage: Route couldn't be rendered statically because it used `cookies`/`headers`/`searchParams`"
A static route (or `generateStaticParams`) used a dynamic API. Either accept dynamic rendering (`export const dynamic = 'force-dynamic'`), move the dynamic part into a `Suspense` hole (PPR/Cache Components), or remove the dynamic API from the static path.

### D6. "Missing Suspense boundary with useSearchParams"
`useSearchParams` in a Client Component opts the whole route into client rendering during static prerender. Wrap that component in `<Suspense>` so only that part is client-rendered.

### D7. Data is stale after I updated it
Check the cache layer: Data Cache (`fetch` cache or `revalidate`), Full Route Cache (static page), or Router Cache (client). Fix: call `revalidatePath`/`revalidateTag` after mutations, use `router.refresh()` for client state, mark the route `dynamic`, and remember that in multi-instance setups each instance has its own cache unless you use a shared cache handler.

### D8. Data is not cached when I expected it to be (Next.js 15 change)
In Next.js 15, `fetch` and `GET` route handlers are uncached by default. Opt in with `cache: 'force-cache'`, `next: { revalidate }`, or `export const dynamic = 'force-static'` / `'use cache'` in newer versions.

### D9. Environment variable is `undefined` in the browser
Only `NEXT_PUBLIC_*` variables reach the client, and they are **inlined at build time**. Rebuild after changing them, and avoid dynamic access like `process.env[name]` in client code (it is not inlined).

### D10. Environment variable changes do not apply in production
`NEXT_PUBLIC_*` values were baked into the build. Server-only variables are read at runtime, but some are read at build time for static pages. Rebuild/redeploy, or fetch runtime config from the server.

### D11. Image error: "hostname is not configured under images in next.config"
Add `images.remotePatterns` for that host (and protocol/path). Restart the dev server after config changes.

### D12. Dynamic route returns 404 for new items
`dynamicParams = false` (or `output: 'export'`) restricts routes to those from `generateStaticParams`. Set `dynamicParams = true` (default) or rebuild/revalidate. Also check that the data function returns the item.

### D13. Middleware does not run (or runs too often)
Check `config.matcher` patterns, file location (project root or `src/`), and that the file name is correct (`middleware.ts`, or `proxy.ts` in Next.js 16). Exclude `_next/static`, images and API routes if unneeded. Remember it also runs on prefetch requests.

### D14. Redirect loop in middleware
The redirect target also matches the middleware condition (e.g., `/login` requires a session). Exclude the target path, or check `req.nextUrl.pathname` before redirecting.

### D15. Server Action fails with "unexpected response" or body size error
The action threw an unhandled error, returned non-serializable data, hit the body size limit (`serverActions.bodySizeLimit`), or the server was redeployed (action ID mismatch). Return errors as state, validate inputs, raise the limit if needed, and handle version skew.

### D16. Server Action works locally but fails behind a proxy
Origin/Host mismatch triggers CSRF protection. Configure `experimental.serverActions.allowedOrigins` (or the stable equivalent), and forward the correct `Host`/`X-Forwarded-Host` headers.

### D17. `redirect()` does nothing / error is swallowed
`redirect` throws a special error; a `try/catch` caught it. Call `redirect` outside `try/catch` (or rethrow). In Server Components during streaming, redirects after the response started become client-side navigations.

### D18. Cookie cannot be set in a Server Component
Cookies can be set only in Server Actions, Route Handlers and middleware (response headers are already sent while streaming components). Move the write to one of those.

### D19. Layout does not update on navigation
Layouts are preserved and do not re-render between child routes. Move data that must update into the page, use a `template.tsx`, or use a Client Component with `usePathname`. For fresh server data use `router.refresh()` or revalidation.

### D20. "createContext only works in Client Components"
A library (CSS-in-JS, context providers, UI kit) calls `createContext` in a Server Component. Wrap the usage in a client component (`providers.tsx` with `'use client'`) or choose an RSC-compatible library.

### D21. Build fails: "fetch failed" or API unreachable during `next build`
Static pages fetch data at build time; the API/DB is not available in CI. Provide a build-time data source, mark such routes dynamic, use `generateStaticParams` carefully, or add retries/fallbacks.

### D22. Docker image runs but CSS/images are missing
With `output: 'standalone'` you must copy `.next/static` and `public` into the final image. Also ensure `HOSTNAME=0.0.0.0` so the server listens on all interfaces.

### D23. Image optimization is slow or fails on the server
Missing `sharp`, low CPU/memory, or huge source images. Install `sharp`, limit sizes, set `minimumCacheTTL`, or use an external image CDN/custom loader.

### D24. ISR is not updating on one server but works on another
Each instance has its own filesystem cache. Use a shared cache handler or on-demand revalidation that reaches all instances, and make sure all instances share the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` and build ID.

### D25. CORS errors from a Route Handler
Route handlers do not add CORS headers by default. Handle `OPTIONS` and return `Access-Control-Allow-*` headers (or put an API gateway/rewrite in front). Do not use `*` with credentials.

### D26. Dev server is slow or uses too much memory
Large dependency graph, too many routes compiled, barrel-file imports, or webpack. Use Turbopack (`next dev --turbopack`), `optimizePackageImports`, avoid importing whole icon libraries, and close unused routes.

### D27. `params`/`cookies()` warning: "should be awaited"
Next.js 15 made these APIs async. Use `await params`, `await cookies()`, `await headers()`; run the codemod `npx @next/codemod@latest next-async-request-api .` (in Next.js 16 synchronous access is removed).

### D28. Large "First Load JS" on a page
Too many Client Components or big libraries. Use the bundle analyzer, move logic to Server Components, lazy-load heavy widgets with `dynamic`, and check for duplicated dependencies.

### D29. Vercel/serverless timeout (504)
The function exceeds the max duration: slow DB queries, external API waits, or heavy rendering. Add timeouts, caching, background jobs, increase `maxDuration` (plan limits), and use streaming to return early.

### D30. Debugging method (say this in interviews)
Ask: *Where does this code run (build/server/edge/client)? What is cached (Request Memoization, Data Cache, Full Route Cache, Router Cache, CDN)? What was sent to the browser?* Use `next build` output (`○ ● ƒ`), Network tab (`_rsc` requests, cache headers like `x-nextjs-cache`), verbose fetch logging, and React DevTools. Reproduce with `next build && next start` (not only `next dev`).


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. `layout.tsx` vs `template.tsx`
A **layout** persists across navigations: it is not re-mounted, its state and effects stay. A **template** creates a **new instance** on every navigation: state resets, effects re-run, and DOM is recreated. Use templates for enter/exit animations, per-page analytics, or resetting state.

### T2. Does `'use client'` make only that component a Client Component?
No. It marks a **module boundary**: that file and all modules it imports become client code. A Server Component passed to it as `children` stays a Server Component.

### T3. What does `loading.tsx` wrap?
It wraps the **page and its child segments** in a `Suspense` boundary, not the layout in the same folder. The layout renders immediately (and can stay interactive); the page shows the loading UI until it is ready.

### T4. Which caches survive a new deployment?
The **Data Cache** persists across deployments (until revalidated). The **Full Route Cache** (pre-rendered HTML/RSC payload) is **invalidated on a new deployment**. The **Router Cache** is in the browser and resets on refresh. Request Memoization lasts one request.

### T5. Where does Request Memoization apply?
Only during a single server render pass, for identical `GET` `fetch` calls (same URL and options) and for functions wrapped in `React.cache`. It does not apply across requests, to `POST` requests, or to ORM/database calls unless you wrap them in `React.cache`.

### T6. If a page has `revalidate = 3600` and a `fetch` has `revalidate: 60`, which wins?
The **lowest** revalidate value in the route sets the route's revalidation time (60 seconds here). Be careful with a stray `no-store` or `revalidate = 0`, which makes the whole route dynamic.

### T7. What makes a route dynamic automatically?
Using `cookies()`, `headers()`, `searchParams`, `draftMode()`, `connection()`, `unstable_noStore()`, a `fetch` with `cache: 'no-store'`, or `dynamic = 'force-dynamic'`. Reading `cookies()` in the **root layout** makes every page dynamic.

### T8. Default `fetch` caching: Next.js 14 vs 15
14: `fetch` was cached (`force-cache`) by default. 15: not cached by default. Many "why is my data stale?" and "why is it not cached?" bugs come from version differences. Always set caching explicitly.

### T9. Router Cache durations
Next.js 14: dynamic pages cached on the client for 30 seconds, static for 5 minutes. Next.js 15: page segments are not reused by default (`staleTimes.dynamic = 0`), while layouts and loading states are still reused. Configurable with `experimental.staleTimes`.

### T10. When does `<Link>` prefetch?
Only in **production** builds, when the link enters the viewport (or on hover for some cases). For dynamic routes only the shared layouts down to the first `loading.tsx` are prefetched. In development there is no prefetching, so navigation feels slower than production.

### T11. Are Server Actions GET or POST? Are they parallel?
Always **POST**. By default actions from a client are processed **one at a time (queued)**, so do not use them for parallel data fetching. Use Server Components or route handlers for reads.

### T12. Can you pass a function from a Server Component to a Client Component?
Not a normal function (not serializable). You can pass a **Server Action** (a function marked `'use server'`). Event handlers must be defined inside a Client Component.

### T13. Can `route.ts` and `page.tsx` be in the same folder?
No. They conflict because both handle the same URL. Put API handlers under an `api/` folder or a different segment.

### T14. Does middleware run before or after caching?
**Before.** It runs for every matched request before the cache, even for statically cached pages and even for prefetch requests. It cannot read the request body easily, and in the Edge runtime it cannot use most Node APIs.

### T15. When are `NEXT_PUBLIC_*` values read?
At **build time**: they are replaced by their literal values in the client bundle. Changing them requires a rebuild. Dynamic access (`process.env[name]`) is not inlined for the client.

### T16. Status code of `redirect()`
`redirect()` returns **307** by default (temporary) and **303** when used inside a Server Action (so the browser follows with GET). `permanentRedirect()` returns **308**. Both throw special errors.

### T17. `notFound()` and streaming status codes
Once a response starts streaming, the HTTP status can no longer change. If `notFound()` is thrown **after** streaming began (inside a `Suspense` boundary), the status may remain 200 and Next.js adds a `noindex` meta tag. Call `notFound()` before the first `Suspense` boundary (or in the layout/page top-level `await`) when you need a real 404 status.

### T18. Metadata limitations
`metadata` and `generateMetadata` work only in **Server Components**, and you cannot export both from the same segment. Metadata merges from parent layouts to pages (child values override). Fetch calls inside `generateMetadata` are memoized with the page's identical fetches.

### T19. `generateStaticParams` returns an empty array: is the route static?
The dynamic segment is still handled: with `dynamicParams = true` pages are generated **on demand** and cached (ISR-like). With `dynamicParams = false` all unknown paths return 404.

### T20. `export const dynamic = 'force-static'` with `cookies()`
It forces static rendering and makes `cookies()`, `headers()` and `searchParams` return empty values. Useful for GET route handlers you want cached; dangerous if you expected real request data.

### T21. Why does `useSearchParams` need `Suspense`?
For statically rendered routes, reading search params on the client causes the nearest `Suspense` boundary to be client-rendered at request time. Without a boundary, the whole page bails out to client rendering (and `next build` errors with a missing Suspense boundary).

### T22. `error.tsx` limitations
It must be a Client Component, catches errors in its segment's **children** (not in the `layout.tsx` of the same segment), and does not catch errors in the root layout (use `global-error.tsx`). It does not catch errors in event handlers or async code outside rendering.

### T23. `not-found.tsx` coverage
`app/not-found.tsx` handles unmatched URLs for the whole app. Nested `not-found.tsx` files are used only when `notFound()` is called inside that segment.

### T24. `default.tsx` in parallel routes
On a full page load or hard navigation, Next.js cannot recover the state of an unmatched slot, so it renders the slot's `default.tsx` (otherwise 404). Soft navigation keeps the previous slot content.

### T25. `next/router` vs `next/navigation`
`next/router` (Pages Router) exposes `query`, `pathname`, `asPath`, events. `next/navigation` (App Router) offers `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `redirect`, `notFound`. Importing the wrong one throws "NextRouter was not mounted" or behaves differently.

### T26. `server-only` and `client-only`
Importing `server-only` in a module makes the build fail if a Client Component imports it (even indirectly). It protects secrets and DB code from leaking into the client bundle.

### T27. `revalidatePath` vs `router.refresh()`
`revalidatePath` (server) invalidates server caches (Data Cache and Full Route Cache for that path) and the client Router Cache. `router.refresh()` (client) re-fetches the current route's RSC payload but does **not** purge the server's Data Cache.

### T28. Setting headers or status after streaming starts
Headers and status codes must be set before the first byte. Once Suspense content streams, you cannot change them. Do authentication redirects and header decisions in middleware, route handlers, or before the first `Suspense` boundary.

### T29. Server Component re-rendering
Server Components render on the server for each request (or are cached). On `router.refresh()` or a Server Action that revalidates, the server re-renders them and sends a new payload; React merges it into the client tree while preserving client state (inputs, scroll).

### T30. Layouts cannot access `searchParams`
Layouts are not re-rendered when only search params change, so they do not receive `searchParams`. Read them in `page.tsx` or with `useSearchParams` in a Client Component.

### T31. Environment files order
`.env.$(NODE_ENV).local` > `.env.local` (not loaded in `test`) > `.env.$(NODE_ENV)` > `.env`. Never commit `.env.local`.

### T32. What does `unstable_` mean?
The API may change or be removed (e.g., `unstable_cache`, `unstable_noStore`). Prefer stable replacements when available (`'use cache'`, `connection()`), and isolate usage behind your own helper.

### T33. Dev vs prod differences
In dev: no prefetching, on-demand compilation, extra checks (StrictMode double renders), verbose errors, different caching. Always test with `next build && next start`.

### T34. Can `fetch` in Client Components use `next: { revalidate }`?
No. `next` options apply only to the **server-side** extended `fetch`. In Client Components use TanStack Query/SWR or call a server endpoint.

### T35. Does a Server Component re-run every time I navigate?
Not always. With caching, the RSC payload may come from the Full Route Cache/Data Cache or Router Cache. Dynamic routes re-run per request; static routes do not.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Next.js is made by? | Vercel |
| App Router folder? | `app/` |
| Pages Router folder? | `pages/` |
| Default component type in `app/`? | Server Component |
| Directive for client code? | `'use client'` |
| Directive for server actions? | `'use server'` |
| Route file? | `page.tsx` |
| API endpoint file? | `route.ts` |
| Shared wrapper UI? | `layout.tsx` |
| Instant loading UI? | `loading.tsx` |
| Error boundary file? | `error.tsx` (Client Component) |
| 404 UI? | `not-found.tsx` |
| Dynamic segment? | `[slug]` |
| Catch-all? | `[...slug]` |
| Route group? | `(group)` |
| Private folder? | `_folder` |
| Parallel route? | `@slot` |
| Intercepting marker (same level)? | `(.)` |
| Client navigation component? | `next/link` `Link` |
| Optimized images? | `next/image` |
| Optimized fonts? | `next/font` |
| Third-party scripts? | `next/script` |
| Lazy component? | `next/dynamic` |
| Static params for build? | `generateStaticParams` |
| Dynamic SEO tags? | `generateMetadata` |
| Time-based regeneration? | `revalidate` |
| On-demand purge by path? | `revalidatePath` |
| On-demand purge by tag? | `revalidateTag` |
| Run code after response? | `after()` |
| Force dynamic rendering? | `export const dynamic = 'force-dynamic'` |
| Public env prefix? | `NEXT_PUBLIC_` |
| Static export setting? | `output: 'export'` |
| Docker-friendly output? | `output: 'standalone'` |
| Edge runtime setting? | `export const runtime = 'edge'` |
| Middleware config? | `export const config = { matcher: [...] }` |
| Dev bundler? | Turbopack (`--turbopack`; default in 16) |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a Next.js project you built or improved."
**Sample answer (STAR):**
- **S:** An e-commerce site on the Pages Router had LCP 4.2 s and slow product page updates (full rebuilds took 40 minutes).
- **T:** Improve LCP below 2.5 s and make content updates near-instant.
- **A:** Migrated product and category routes to the App Router, kept the shell static and used tag-based on-demand ISR from the CMS webhook, moved data fetching to Server Components (client JS down by 38%), streamed reviews and recommendations with Suspense, optimized images with `next/image` and correct `sizes`, and self-hosted fonts with `next/font`.
- **R:** LCP 4.2 → 2.1 s, content updates visible within seconds, build time 40 → 6 minutes (generated top pages at build, the rest on demand), conversion +5% (A/B test).
Tip: always mention the caching/rendering decisions and measured results.

### P2. "How did you handle authentication and authorization?"
Describe session cookies (HttpOnly/Secure/SameSite), optimistic redirects in middleware, and **authorization inside the data access layer** and Server Actions. Mention that you patched Next.js regularly because of middleware advisories, and that you tested unauthorized access paths.

### P3. "Tell me about a caching bug you debugged."
Example: product prices looked stale for some users only. Cause: ISR with a per-instance filesystem cache across 3 servers. Fix: shared cache handler (Redis), tag-based revalidation, and a monitoring dashboard for cache hit/stale rates.

### P4. "How did you decide between SSR, SSG and ISR?"
Use a table: content type, freshness requirement, personalization, traffic, cost. Mention PPR/dynamic holes for mixed pages, and ADRs.

### P5. "Describe a migration from Pages Router to App Router."
Incremental, route by route, both routers coexisting. Replaced `getServerSideProps` with async Server Components, `next/head` with metadata, API routes with route handlers, introduced layouts, defined `'use client'` guidelines, trained the team, and compared metrics before/after.

### P6. "How do you keep Server Actions secure?"
Authenticate/authorize inside each action, validate input with schemas, rate limit, return minimal data, avoid exposing internal errors, test with unauthorized users, and keep Next.js updated.

### P7. "What went wrong in a production deployment?"
Example: version skew after deploy (users on old pages calling removed server actions). Fix: skew protection/stable action encryption key, keep old assets for a while, show a "new version available" refresh prompt, and add a smoke test to the pipeline.

### P8. "Why Next.js instead of a Vite SPA for this project?"
Answer with requirements: SEO, first-load performance, server-side data access, streaming, team skills, hosting. Mention when a plain SPA is the better choice (internal tools behind login with no SEO).

---

# 📚 Part 11: Complete Coverage (Pages Router + Ecosystem + Mixed)

## 11A. Pages Router (classic questions)

### K1. `getStaticProps`, `getServerSideProps`, `getStaticPaths`, `getInitialProps`
- `getStaticProps`: runs at **build time** (and during ISR regeneration); returns `props` (+ `revalidate`). Only server-side; not bundled for the client.
- `getServerSideProps`: runs on **every request**; returns `props` (or `redirect`/`notFound`). Slower TTFB, always fresh.
- `getStaticPaths`: for dynamic SSG routes; returns `paths` and `fallback`.
- `getInitialProps`: legacy; runs on server and client; disables Automatic Static Optimization. Avoid.
```tsx
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 60 };
}
export async function getStaticPaths() { return { paths: (await getPosts()).map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' }; }
```

### K2. `fallback: false | true | 'blocking'`
- `false`: only listed paths exist; others → 404.
- `true`: unlisted paths return a **fallback page** immediately (check `router.isFallback`), data loads on the client, then the page is cached.
- `'blocking'`: unlisted paths are server-rendered on the first request (no fallback UI), then cached.

### K3. `_app.js` and `_document.js`
`_app.js` wraps all pages (global layout, providers, global CSS). `_document.js` customizes the HTML skeleton (`<Html>`, `<Head>`, `<Main>`, `<NextScript>`) and runs only on the server. `next/head` sets per-page head tags.

### K4. API routes (`pages/api/*`)
```js
export default function handler(req, res) {
  if (req.method === 'POST') return res.status(201).json({ ok: true });
  res.setHeader('Allow', ['POST']); res.status(405).end();
}
```
They run on the server as Node.js functions. In the App Router use Route Handlers.

### K5. Automatic Static Optimization
Pages without `getServerSideProps`/`getInitialProps` are pre-rendered to static HTML at build time automatically.

### K6. Built-in i18n routing (Pages Router only)
```js
module.exports = { i18n: { locales: ['en', 'hi'], defaultLocale: 'en' } };
```
Provides locale prefixes and detection. The App Router uses middleware + `[locale]` segments instead.

### K7. Preview mode (Pages) vs Draft mode (App)
Both let editors see unpublished content: they set bypass cookies so pages render dynamically for that browser only.

### K8. `next export` (old) vs `output: 'export'`
`next export` was replaced by `output: 'export'` in `next.config` (Next.js 13.3+/14).

## 11B. Next.js vs Others *(Comparison)*

| | Next.js | CRA / Vite SPA | Gatsby | Remix / React Router 7 | Astro | Nuxt (Vue) |
|---|---|---|---|---|---|---|
| Rendering | SSR/SSG/ISR/RSC | CSR | SSG (GraphQL data layer) | SSR with loaders | SSG/SSR with islands | SSR/SSG |
| Data model | Server Components, fetch, actions | Client fetching | Build-time GraphQL | Loaders/actions | Frontmatter/fetch | `useFetch` |
| Best for | Full-stack React apps and sites | Internal tools, dashboards | Content sites (declining) | Web-standard full-stack apps | Content-heavy sites | Vue teams |
| Notes | Most features and ecosystem | CRA is deprecated | Less active | Merged into React Router v7 | Minimal JS | Equivalent for Vue |

## 11C. Ecosystem Map

| Area | Common choices |
|---|---|
| Auth | Auth.js (NextAuth), Clerk, Auth0, Supabase Auth, Lucia/custom sessions |
| Database/ORM | Prisma, Drizzle, Kysely, Supabase, PlanetScale/Neon/Turso |
| API layer | Route handlers, Server Actions, tRPC, GraphQL |
| Client data | TanStack Query, SWR |
| State | Zustand, Jotai, Redux Toolkit |
| Forms/validation | React Hook Form, Zod, `useActionState` |
| UI | shadcn/ui, Radix, MUI, Chakra, Tailwind |
| CMS | Contentful, Sanity, Strapi, Payload, MDX |
| i18n | next-intl, react-i18next |
| Testing | Vitest/Jest, Testing Library, Playwright, Cypress, MSW |
| Monitoring | Sentry, Datadog, OpenTelemetry, Vercel Analytics |
| Email/queues/jobs | Resend, Inngest, Trigger.dev, QStash, BullMQ |
| Deployment | Vercel, Netlify, Cloudflare, AWS (Amplify/ECS/Lambda), Docker/Kubernetes |

## 11D. HTML + CSS + JavaScript Mixed Topics in Next.js

### M1. SEO checklist
Unique `title`/`description` per page, canonical URLs (`alternates.canonical`), Open Graph/Twitter cards, `sitemap.ts`, `robots.ts`, structured data (JSON-LD), semantic HTML with one `h1`, `hreflang` for i18n, correct status codes (404/410), fast Core Web Vitals, and server-rendered content for crawlers.

### M2. Analytics and third-party scripts
```tsx
import { GoogleAnalytics } from '@next/third-parties/google';
<GoogleAnalytics gaId="G-XXXX" />                              // optimized loading
<Script src="https://cdn.example.com/widget.js" strategy="lazyOnload" />
```
Measure their impact on INP/LCP; lazy-load anything non-essential.

### M3. Accessibility on route changes
Next.js announces route changes to screen readers (route announcer) and moves focus to the page; keep a single `h1` per route, manage focus in modals, and use semantic landmarks in layouts. Test with axe and keyboard navigation.

### M4. Reporting Web Vitals
```tsx
'use client';
import { useReportWebVitals } from 'next/web-vitals';
export function Vitals() {
  useReportWebVitals((metric) => { navigator.sendBeacon('/api/vitals', JSON.stringify(metric)); });
  return null;
}
```

### M5. Forms that work without JavaScript
`<form action={serverAction}>` submits via a normal POST when JS is not available (progressive enhancement); with JS, Next.js handles it without a full reload and keeps client state. Validate on the server regardless.

### M6. Third-party embed with a facade
Load heavy embeds (video, maps, chat) only on interaction using `dynamic` + a placeholder button, to protect LCP/INP.

---

# 🧠 Part 12: Next.js Internals

### B1. What does `next build` produce?
Compiled server code, client JS chunks (code-split per route and shared chunks), static HTML + RSC payload for static routes, route manifests (`.next/server/app-paths-manifest.json` etc.), the image/font assets, and a build summary table with route types (`○` static, `●` SSG, `ƒ` dynamic). The `.next/cache` stores build caches (and ISR data on a single server).

### B2. Request lifecycle (App Router, simplified)
1. Request hits the CDN/edge; static assets served from cache.
2. **Middleware/proxy** runs (rewrite, redirect, headers).
3. Router matches the URL to the **route segment tree** (layouts + page).
4. Caches are checked (Full Route Cache for static routes; ISR may serve stale and revalidate in the background).
5. If rendering is needed, **Server Components** execute on the server (data fetching with the Data Cache), producing an **RSC payload** and HTML.
6. HTML + RSC payload are **streamed** to the browser; Suspense boundaries flush as they resolve.
7. The browser loads the client JS, **hydrates** Client Components, and the **Router Cache** keeps visited segments for navigation.

### B3. The RSC payload (React Flight)
A compact serialized description of the Server Component tree: rendered elements, references to Client Components (module IDs and props), and Suspense boundaries. On the first load it is embedded in the HTML (for hydration); on client navigation the browser requests only the RSC payload (a `?_rsc=` request) and React updates the tree without a full reload.

### B4. How code splitting between server and client works
The bundler builds separate **server** and **client** graphs. A `'use client'` module is replaced in the server graph by a **client reference**; its code goes only into client chunks. The client reference manifest maps references to chunk files so the browser knows what to load.

### B5. Caching layers and invalidation (conceptual graph)
- `fetch` results → **Data Cache** (tags/paths for invalidation).
- Rendered routes → **Full Route Cache** (static routes only).
- Duplicate requests in one render → **Request Memoization**.
- Client segments → **Router Cache**.
`revalidateTag` purges Data Cache entries with the tag and marks dependent routes for regeneration; `revalidatePath` purges the route's cache; Server Actions that call them also invalidate the client Router Cache.

### B6. How Next.js decides static vs dynamic
During build, Next.js renders each route and tracks use of **Dynamic APIs** and uncached fetches. If none are used, the route is static and stored. If a dynamic API is detected, the route is marked dynamic and rendered per request. With PPR/Cache Components, only the parts that use dynamic APIs become dynamic holes.

### B7. Route segment tree and layouts
Each folder is a segment; `layout.tsx` files nest. On navigation, Next.js re-renders only the segments that changed; shared parent layouts are preserved (partial rendering). This is why layouts keep state and why data fetched in a layout does not refresh when navigating between its children.

### B8. Prefetching mechanics
`<Link>` in the viewport triggers `router.prefetch`: for static segments the full payload is prefetched; for dynamic ones only the part down to the nearest `loading` boundary. Prefetched data is stored in the Router Cache. Middleware runs for prefetch requests too.

### B9. Streaming and status codes
The server sends the initial shell with a status code and headers once rendering of the non-suspended part completes. Suspense boundaries stream later as `<script>` chunks that replace fallbacks. Because headers and status are already sent, later failures cannot change the status.

### B10. How Server Actions work
The compiler turns a `'use server'` function into an **endpoint with a unique ID**. The client calls it by POSTing to the current URL with a `Next-Action` header (and serialized arguments). Closed-over variables are **encrypted** and included in the action reference. After running, the server can return a new RSC payload for revalidated segments in the same response. For multi-instance deployments the encryption key must be shared (`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`).

### B11. ISR internals
On the first request after `revalidate` time passes, Next.js serves the **stale** cached page immediately and triggers a **background regeneration**; the next requests receive the new version. The `x-nextjs-cache` response header shows `HIT`, `MISS`, `STALE` or `REVALIDATED`. On-demand revalidation marks entries stale immediately.

### B12. Edge runtime vs Node.js runtime
Edge: V8 isolates with Web APIs only, fast cold starts, global distribution, smaller limits. Node.js: full Node APIs, larger packages, regional. Middleware historically used Edge (Next.js 16 `proxy` runs on Node.js); pages/route handlers can opt in with `runtime = 'edge'`.

### B13. Image optimization pipeline
The `/_next/image?url=...&w=...&q=...` endpoint fetches the source, resizes/encodes (WebP/AVIF based on the `Accept` header) with `sharp`, stores the result on disk (`.next/cache/images`) with a TTL based on `minimumCacheTTL`/source headers, and serves it with long cache headers. External sources must match `remotePatterns`.

### B14. Font optimization
`next/font` downloads Google font files at build time, self-hosts them under the same domain, generates CSS with `size-adjust` fallback metrics (to avoid layout shift), and preloads critical subsets.

### B15. Turbopack vs webpack
Turbopack is incremental, Rust-based, and optimizes for fast dev updates; in Next.js 16 it becomes the default (verify). Webpack remains supported (flag) for custom plugin ecosystems. Some webpack-only plugins/loaders need alternatives.

### B16. `output: 'standalone'`
Next.js traces file dependencies (using `@vercel/nft`) and copies only what is needed into `.next/standalone` with a minimal `server.js`. You must copy `public/` and `.next/static` yourself, resulting in small Docker images.

### B17. Middleware matching and bundling
Middleware is compiled into a separate bundle with a matcher manifest; the server runs it before routing for matching paths. It receives `NextRequest`, can return `NextResponse.next/redirect/rewrite`, and can modify request headers for downstream handlers.

### B18. Error handling internals
Errors in Server Components are caught by the nearest `error.tsx` boundary; in production the message sent to the client is a generic message with a **digest** that links to server logs. `onRequestError` in `instrumentation.ts` receives the real error and request context for reporting.

### B19. React integration
The App Router uses the React version bundled with Next.js (React 19 for Next.js 15; canary builds for some features). It relies on React's Server Components, Suspense, `use`, Actions and `useOptimistic`. Using a different React version can cause errors; keep `react`/`react-dom` in sync with Next.js's requirements.

### B20. Dev vs production behavior
Dev: on-demand compilation, no prefetching, React StrictMode double render, verbose errors, partial caching differences. Production: pre-rendered static routes, minified bundles, prefetching, optimized images, long-term cache headers for `/_next/static` (`public, max-age=31536000, immutable`).

---

# 📋 Part 13: Reference Tables

### R1. App Router file conventions
| File | Purpose |
|---|---|
| `layout` | Persistent shared UI |
| `template` | Re-mounting shared UI |
| `page` | Route UI |
| `loading` | Suspense fallback for the segment |
| `error` | Error boundary (client) |
| `global-error` | Root error boundary |
| `not-found` | 404 UI |
| `route` | HTTP endpoint |
| `default` | Parallel route fallback |
| `middleware` / `proxy` | Request interception (root) |
| `instrumentation` | Startup hooks (root) |
| `opengraph-image`, `twitter-image`, `icon`, `apple-icon` | Metadata images |
| `sitemap`, `robots`, `manifest` | SEO and PWA files |

### R2. Rendering mode vs triggers
| Mode | Triggered by |
|---|---|
| Static (SSG) | No dynamic APIs, cached or no fetch, or `force-static` |
| ISR | `revalidate` > 0 (segment config or fetch option) |
| Dynamic (SSR) | `cookies()`, `headers()`, `searchParams`, `no-store`, `force-dynamic`, `revalidate = 0` |
| Streaming | `loading.tsx` or `Suspense` boundaries |
| Client-side | Client Components after hydration, `useEffect` fetching |
| PPR / Cache Components | Static shell with `Suspense` dynamic holes / `'use cache'` |

### R3. Caching layers summary
| Layer | Location | Default (14 → 15) | Invalidate with |
|---|---|---|---|
| Request Memoization | Server, one request | Same | End of request |
| Data Cache | Server, persistent | `fetch` cached (14) → not cached (15) | `revalidate`, `revalidateTag`, `revalidatePath`, `no-store` |
| Full Route Cache | Server | Static routes cached | Redeploy, `revalidate*` |
| Router Cache | Client memory | Pages 30 s/5 min (14) → 0 (15) | `router.refresh()`, Server Actions with `revalidate*`, time |
| CDN | Edge | From `Cache-Control` | TTL, purge |

### R4. Route segment config
| Export | Values |
|---|---|
| `dynamic` | `'auto'`, `'force-dynamic'`, `'error'`, `'force-static'` |
| `dynamicParams` | `true` / `false` |
| `revalidate` | `false`, `0`, number (seconds) |
| `fetchCache` | `'auto'`, `'default-cache'`, `'only-cache'`, `'force-cache'`, `'force-no-store'`, `'default-no-store'`, `'only-no-store'` |
| `runtime` | `'nodejs'`, `'edge'` |
| `preferredRegion` | region ids |
| `maxDuration` | seconds |
(Some options change or are replaced by Cache Components in Next.js 16.)

### R5. `fetch` extensions (server)
| Option | Effect |
|---|---|
| `cache: 'force-cache'` | Store in Data Cache |
| `cache: 'no-store'` | Do not cache, makes route dynamic |
| `next: { revalidate: n }` | Time-based revalidation |
| `next: { tags: [...] }` | Tags for `revalidateTag` |

### R6. Frequently used `next.config` options
`output`, `images`, `redirects`, `rewrites`, `headers`, `basePath`, `assetPrefix`, `env`, `reactStrictMode`, `transpilePackages`, `serverExternalPackages`, `experimental` (`ppr`, `staleTimes`, `serverActions`, `optimizePackageImports`, `typedRoutes`), `poweredByHeader`, `compress`, `generateBuildId`, `logging`, `cacheHandler`.

### R7. Navigation APIs
| API | Use |
|---|---|
| `<Link href>` | Client navigation + prefetch |
| `useRouter()` | `push`, `replace`, `back`, `forward`, `refresh`, `prefetch` |
| `usePathname()` | Current path |
| `useSearchParams()` | Read query string (client) |
| `useParams()` | Dynamic params (client) |
| `redirect()` / `permanentRedirect()` | Server redirect (307/303, 308) |
| `notFound()` | Render 404 |
| `useSelectedLayoutSegment(s)` | Active child segment(s) |

### R8. Metadata fields
`title`, `description`, `keywords`, `alternates.canonical`, `robots`, `openGraph`, `twitter`, `icons`, `manifest`, `viewport` (separate export), `themeColor` (in viewport), `authors`, `metadataBase`, `verification`.

### R9. Version timeline (highlights; verify details in release notes)
| Version | Highlights |
|---|---|
| 13 | App Router (beta), Server Components, `next/image` v13, Turbopack alpha |
| 13.4 | App Router stable |
| 14 | Server Actions stable, PPR preview, Turbopack improvements |
| 15 | React 19, async request APIs, fetch/GET handlers uncached by default, `after`, `next/form`, `next.config.ts`, Turbopack dev stable |
| 15.x | `instrumentation` stable, Node middleware experiments, `'use cache'`/`dynamicIO` canary |
| 16 | Cache Components, Turbopack default, `proxy.ts`, React Compiler support, newer caching APIs, async-only request APIs |

### R10. Environment variable rules
| Rule | Detail |
|---|---|
| Server-only by default | Read in server code at runtime |
| `NEXT_PUBLIC_` prefix | Inlined into the client bundle at build time |
| Files | `.env`, `.env.local`, `.env.development`, `.env.production` |
| Never | Put secrets in `NEXT_PUBLIC_` variables or commit `.env.local` |

### R11. Server vs Client Component capabilities
| Capability | Server | Client |
|---|---|---|
| `async/await` in component | ✅ | ❌ (use hooks/libraries) |
| Direct DB/secret access | ✅ | ❌ |
| `useState`, `useEffect` | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Adds to client JS bundle | ❌ | ✅ |
| Can import the other | Server → Client ✅ | Client → Server ❌ (children/props only) |

### R12. Status and redirects
| Function | Status |
|---|---|
| `redirect()` | 307 (303 in Server Actions) |
| `permanentRedirect()` | 308 |
| `notFound()` | 404 |
| `NextResponse.redirect(url)` | 307 (default); pass status to change |
| `redirects()` in config with `permanent: true` | 308 |

### R13. `next/image` key props
`src`, `alt`, `width`/`height` (or `fill`), `sizes`, `priority` (preload), `quality`, `placeholder="blur"` + `blurDataURL`, `loading`, `unoptimized`, `loader`, `onLoad`. Config: `images.remotePatterns`, `formats`, `deviceSizes`, `imageSizes`, `minimumCacheTTL`.


---

# 🧩 Part 14: Prediction Questions

> Next.js interviews often show a snippet or a file path and ask: **"Which mode is this? Where does it run? What is sent to the browser? What does the URL map to?"** Answer and give the reason. (Answers assume **Next.js 15** defaults unless stated.)

### O1. Static or dynamic?
```tsx
// app/profile/page.tsx
import { cookies } from 'next/headers';
export default async function Profile() {
  const token = (await cookies()).get('token')?.value;
  return <p>{token ? 'Logged in' : 'Guest'}</p>;
}
```
**Answer:** **Dynamic** (`ƒ`). Reading `cookies()` is a Dynamic API, so the route is rendered on every request.

### O2. Static or dynamic? (an uncached fetch)
```tsx
export default async function Page() {
  const res = await fetch('https://api.example.com/time');
  const { now } = await res.json();
  return <p>{now}</p>;
}
```
**Answer (Next.js 15):** Because `fetch` is not cached by default **and** there is no Dynamic API, the route is still **prerendered statically at build time**. The `fetch` runs once during `next build`, so the time is frozen in the HTML until you revalidate or rebuild (in `next dev` it runs per request, which hides the problem). To make it per-request use `cache: 'no-store'` or `export const dynamic = 'force-dynamic'`.

### O3. Which mode?
```tsx
export const revalidate = 60;
export default async function Page() { const data = await getData(); return <View data={data} />; }
```
**Answer:** **ISR** (static with time-based regeneration every 60 seconds, stale-while-revalidate).

### O4. ISR timeline
`revalidate = 60`. The page was built at t = 0. What do requests at t = 30 s, t = 70 s and t = 75 s see?
**Answer:** t = 30 → cached page (`HIT`). t = 70 → cached (**stale**) page served immediately, and a background regeneration starts (`STALE`). t = 75 → the **new** page (`HIT`). Only the first request after expiry sees old content.

### O5. Unknown dynamic param
```tsx
export async function generateStaticParams() { return [{ slug: 'a' }, { slug: 'b' }]; }
// Visit /blog/c
```
**Answer:** With the default `dynamicParams = true`, `/blog/c` is rendered **on demand** on the first request and then cached. With `export const dynamicParams = false` it returns **404**.

### O6. Reading query strings
```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams; return <p>{q}</p>;
}
```
**Answer:** **Dynamic**. Using `searchParams` opts the route into per-request rendering.

### O7. `useSearchParams` without Suspense
```tsx
'use client';
export default function Filter() { const sp = useSearchParams(); return <p>{sp.get('q')}</p>; }
// used in a statically rendered page without <Suspense>
```
**Answer:** The build fails with *"useSearchParams() should be wrapped in a suspense boundary"* (or the entire page falls back to client-side rendering). Wrap `<Filter />` in `<Suspense fallback={...}>`.

### O8. Where does `console.log` appear?
```tsx
// Server Component
export default function A() { console.log('A'); return null; }
// Client Component
'use client';
export default function B() { console.log('B'); return null; }
```
**Answer:** `A` appears in the **server terminal** only. `B` appears in the **browser console**, and also in the server terminal during the initial SSR render (Client Components render once on the server for HTML, then hydrate in the browser).

### O9. What is in the client bundle?
```tsx
// Server Component: imports 'lodash' and 'marked'
// Client Component: imports 'chart.js'
```
**Answer:** `lodash` and `marked` (used only in the Server Component) are **not** in the client bundle. `chart.js` (and anything the Client Component imports) **is**.

### O10. URL mapping
Which URLs do these files serve?
- `app/(shop)/cart/page.tsx`
- `app/blog/[...slug]/page.tsx`
- `app/docs/[[...slug]]/page.tsx`
- `app/_utils/page.tsx`
- `app/api/users/route.ts`
**Answer:** `/cart` (route group not in URL); `/blog/a`, `/blog/a/b` but **not** `/blog` (catch-all needs at least one segment); `/docs`, `/docs/a`, `/docs/a/b` (optional catch-all includes `/docs`); `_utils` is a **private folder**, not routable; `/api/users` for the route handler.

### O11. Layout vs template state
```tsx
// app/dashboard/layout.tsx contains <Counter /> (client state)
// Navigate /dashboard/a → /dashboard/b
```
**Answer:** The counter **keeps its value** because layouts are preserved. In a `template.tsx` it would reset (new instance on each navigation).

### O12. Middleware matcher
```ts
export const config = { matcher: ['/dashboard/:path*'] };
```
Which paths run the middleware: `/dashboard`, `/dashboard/settings/profile`, `/dashboards`, `/api/dashboard`?
**Answer:** `/dashboard` ✅, `/dashboard/settings/profile` ✅, `/dashboards` ❌, `/api/dashboard` ❌.

### O13. `redirect` in `try/catch`
```tsx
try {
  const user = await getUser();
  if (!user) redirect('/login');
} catch (e) {
  console.error(e);
}
```
**Answer:** The redirect **does not happen**. `redirect()` throws a special error that the `catch` swallows. Call `redirect` outside `try/catch`, or rethrow it.

### O14. Passing props across the boundary
```tsx
// Server Component
<ClientButton onClick={() => console.log('hi')} />
```
**Answer:** Error: functions cannot be passed from Server to Client Components. Define the handler in the Client Component, or pass a **Server Action** (`'use server'`).

### O15. Importing server-only code in a client file
```tsx
'use client';
import { db } from '@/lib/db';          // module has: import 'server-only';
```
**Answer:** Build error: the `server-only` package makes the import fail when it ends up in the client graph. This is the intended protection.

### O16. Memoization of identical fetches
```tsx
// layout.tsx and page.tsx both call: fetch('https://api.example.com/me')   // GET
```
**Answer:** One network request per render pass (Request Memoization). With a `POST` request, or different options, there would be two. For database calls, wrap the function in `React.cache` to get the same effect.

### O17. `force-static` with `cookies()`
```ts
export const dynamic = 'force-static';
const c = await cookies();
```
**Answer:** The route is forced static, and `cookies()` returns an **empty** store (no real request data). The page will not personalize.

### O18. Streaming order
```tsx
<Suspense fallback={<A />}><Slow2s /></Suspense>
<Suspense fallback={<B />}><Slow500ms /></Suspense>
```
**Answer:** The shell and both fallbacks arrive first. `Slow500ms` replaces fallback `B` after ~0.5 s, and `Slow2s` replaces fallback `A` after ~2 s. Boundaries stream independently as they resolve.

### O19. Edge runtime limits
```ts
export const runtime = 'edge';
import fs from 'node:fs';
```
**Answer:** It fails: the Edge runtime does not support Node's `fs` and many Node APIs. Use the `nodejs` runtime or Web APIs.

### O20. Image without `sizes`
```tsx
<Image src={url} alt="" fill />
```
**Answer:** Works, but without `sizes` the browser assumes `100vw` and may download an image much larger than needed; the parent must be `position: relative` (or absolute/fixed) with a defined size, otherwise the image collapses. Add `sizes="(max-width: 768px) 100vw, 33vw"`.

### O21. Build output symbols
`○ /about`, `● /blog/[slug]`, `ƒ /dashboard`. What do they mean?
**Answer:** `○` static (prerendered), `●` SSG using `generateStaticParams`, `ƒ` dynamic (rendered on demand). (Newer versions may also show a symbol for partial prerendering.)

### O22. Server Action visibility
```tsx
'use server';
export async function deletePost(id: string) { await db.post.delete({ where: { id } }); }
```
Used only by an admin button. Is it protected?
**Answer:** **No.** It is a public POST endpoint. Anyone who obtains the action reference can call it. Check authentication and authorization **inside** the action (and validate `id`).

### O23. Module-level state on the server
```ts
let counter = 0;                       // module scope in a server file
export async function GET() { return Response.json({ n: ++counter }); }
```
**Answer:** `counter` is shared across **all requests and users** handled by the same server process, and resets on restart or differs per instance. Do not use module state for request- or user-specific data.

### O24. `revalidatePath` effect on the client
After a Server Action calls `revalidatePath('/posts')`, what happens in the browser?
**Answer:** The server cache for `/posts` is invalidated, and the action's response includes the updated RSC payload for the current page, so the UI updates **without a manual refresh**. The client Router Cache for affected routes is also cleared.

### O25. Dev vs prod prefetching
**Answer:** `<Link>` prefetching only happens in **production** builds. In development, navigation to dynamic routes appears slower because nothing is prefetched.

---

# ✅ Part 15: MCQs

1. Who maintains Next.js? → **Vercel**
2. What is the default component type in the `app` directory? → **Server Component**
3. Which directive marks a Client Component? → **`'use client'`**
4. Which file defines a route's UI? → **`page.tsx`**
5. Which file creates an API endpoint in the App Router? → **`route.ts`**
6. Which file wraps child routes and keeps state? → **`layout.tsx`**
7. Which file is re-mounted on every navigation? → **`template.tsx`**
8. Which file shows instant loading UI? → **`loading.tsx`**
9. `error.tsx` must be a... → **Client Component**
10. How do you mark a dynamic segment? → **`[slug]`**
11. How do you write an optional catch-all? → **`[[...slug]]`**
12. What does `(group)` in a folder name do? → **Organizes routes without changing the URL**
13. What does `_folder` do? → **Makes a private folder (not routable)**
14. What defines parallel routes? → **`@slot` folders**
15. Which component does client-side navigation? → **`Link` from `next/link`**
16. Which hook gives the current path (App Router)? → **`usePathname`**
17. Which package do App Router navigation hooks come from? → **`next/navigation`**
18. What does `generateStaticParams` do? → **Defines dynamic paths to prerender at build time**
19. What does `generateMetadata` do? → **Creates dynamic SEO metadata**
20. What does `revalidate = 60` mean? → **Regenerate (ISR) at most every 60 seconds**
21. What does `revalidatePath` do? → **Purges cached data/pages for a path**
22. What does `revalidateTag` do? → **Purges cached data tagged with a label**
23. In Next.js 15, are `fetch` requests cached by default? → **No**
24. In Next.js 15, are `params` and `searchParams` sync or async? → **Async (Promises)**
25. Which API makes a route dynamic? → **`cookies()` / `headers()` / `searchParams`**
26. Which exports force dynamic rendering? → **`export const dynamic = 'force-dynamic'`**
27. What is ISR? → **Static pages regenerated in the background**
28. What does PPR stand for? → **Partial Prerendering**
29. Which component optimizes images? → **`next/image`**
30. Which prop marks the LCP image for preloading (classic)? → **`priority`**
31. Which module optimizes fonts? → **`next/font`**
32. Which component loads third-party scripts? → **`next/script`**
33. Which function loads a component lazily? → **`next/dynamic`**
34. Which env prefix exposes variables to the browser? → **`NEXT_PUBLIC_`**
35. When are `NEXT_PUBLIC_` values set? → **At build time**
36. Which file runs before requests complete (project root)? → **`middleware.ts` (renamed `proxy.ts` in Next.js 16)**
37. What does `NextResponse.rewrite` do? → **Serves another URL's content while keeping the address bar**
38. Which status does `redirect()` use by default? → **307**
39. Which function renders the 404 UI? → **`notFound()`**
40. What are Server Actions? → **Server functions callable from forms/clients, exposed as POST endpoints**
41. Which hook shows form pending state? → **`useFormStatus`**
42. Which hook handles action state in forms (React 19)? → **`useActionState`**
43. Which hook gives optimistic updates? → **`useOptimistic`**
44. Which header/value indicates Server Action calls? → **`Next-Action`**
45. Which output setting creates a minimal Docker-friendly server? → **`output: 'standalone'`**
46. Which output setting creates a purely static site? → **`output: 'export'`**
47. Which runtime is default for route handlers? → **Node.js**
48. Which router has `getServerSideProps`? → **Pages Router**
49. What does `fallback: 'blocking'` do? → **SSR unknown paths on first request, then cache**
50. Which is the new directive for explicit caching (Next.js 15 canary / 16)? → **`'use cache'`**
51. Which package prevents server code from entering client bundles? → **`server-only`**
52. Which function runs code after the response is sent? → **`after()`**
53. Which file registers observability hooks at startup? → **`instrumentation.ts`**
54. Which bundler is Rust-based and used for dev (and default in 16)? → **Turbopack**
55. Why is relying only on middleware for authorization risky? → **It can be bypassed or misconfigured (e.g., the 2025 header bypass); check auth in data access, handlers and actions**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes teams make again and again with Next.js. Interviewers ask: *"What is wrong with this code or setup?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Adding `'use client'` to everything (even layouts and pages)
**❌ Wrong:**
```tsx
'use client';                      // at the top of app/page.tsx
export default function Page() { /* fetches data in useEffect */ }
```
**🤔 Why it is a problem:** The whole subtree becomes client JS: bigger bundles, slower hydration, no direct data access, worse SEO and INP.

**✅ Correct:** Keep pages and layouts as Server Components. Put `'use client'` only in small interactive leaves (buttons, forms, widgets) and pass server-rendered content as `children`.
**💬 Say:** "I default to Server Components and push the client boundary to the leaves."

---

### Mistake 2: Fetching on the client with `useEffect` when the server can do it
**❌ Wrong:**
```tsx
'use client';
useEffect(() => { fetch('/api/posts').then(r => r.json()).then(setPosts); }, []);
```
**🤔 Why it is a problem:** Extra round trip, loading flash, request waterfall, no SEO content in the first HTML, and an unnecessary API route.

**✅ Correct:**
```tsx
export default async function Page() {
  const posts = await getPosts();                // directly in a Server Component
  return <PostList posts={posts} />;
}
```
Use client fetching (TanStack Query) only for user-driven or real-time data.
**💬 Say:** "Data that is known at render time should be fetched on the server."

---

### Mistake 3: Not awaiting async request APIs (Next.js 15+)
**❌ Wrong:**
```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;                 // params is a Promise in Next.js 15
}
const token = cookies().get('token');            // cookies() is async in Next.js 15
```
**🤔 Why it is a problem:** Warnings in 15 and errors in 16 (synchronous access removed); undefined values.

**✅ Correct:**
```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = (await cookies()).get('token')?.value;
}
```
Run `npx @next/codemod@latest next-async-request-api .`.
**💬 Say:** "In Next.js 15+ `params`, `searchParams`, `cookies()` and `headers()` are async."

---

### Mistake 4: Assuming caching defaults without checking the version
**❌ Wrong:** Relying on `fetch` being cached (Next.js 14) after upgrading to 15, or expecting fresh data on a statically rendered page.
**🤔 Why it is a problem:** Unexpected stale pages (static prerender freezes data at build) or unexpected extra load.

**✅ Correct:** State caching explicitly: `fetch(url, { cache: 'force-cache' | 'no-store' })`, `next: { revalidate, tags }`, `export const revalidate`, `'use cache'` with `cacheLife`.
**💬 Say:** "I never rely on implicit caching; I declare it."

---

### Mistake 5: Using middleware as the only authorization layer
**❌ Wrong:**
```ts
// middleware.ts protects /admin, and the pages/actions do no checks
```
**🤔 Why it is a problem:** Middleware can be misconfigured (matcher gaps), skipped by framework vulnerabilities (the 2025 `x-middleware-subrequest` bypass), and does not protect Server Actions or route handlers called directly.

**✅ Correct:** Use middleware for optimistic redirects, and enforce authorization in the **data access layer**, Server Components, route handlers and Server Actions.
**💬 Say:** "Defense in depth: authorization at the point of data access."

---

### Mistake 6: Server Actions without authentication, authorization or validation
**❌ Wrong:**
```ts
'use server';
export async function updateUser(id: string, data: any) { await db.user.update({ where: { id }, data }); }
```
**🤔 Why it is a problem:** It is a public endpoint: any user can update any record with any fields (mass assignment).

**✅ Correct:**
```ts
'use server';
export async function updateProfile(_: unknown, fd: FormData) {
  const { userId } = await verifySession();
  const parsed = Schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  await db.user.update({ where: { id: userId }, data: parsed.data });      // only own record, only allowed fields
}
```
**💬 Say:** "Every Server Action is an API endpoint, so it gets auth, validation and rate limiting."

---

### Mistake 7: Leaking secrets or whole database rows to the client
**❌ Wrong:**
```tsx
<ClientProfile user={dbUserRow} />               // includes passwordHash, internal flags
NEXT_PUBLIC_STRIPE_SECRET=sk_live_...            // secret in a public variable
```
**🤔 Why it is a problem:** Props to Client Components and `NEXT_PUBLIC_` values are visible in the browser.

**✅ Correct:** Return **DTOs** with only needed fields from a `server-only` data layer, keep secrets in server env vars, and use `import 'server-only'`.
**💬 Say:** "Anything passed to a Client Component is public."

---

### Mistake 8: Sequential data fetching (waterfalls)
**❌ Wrong:**
```tsx
const user = await getUser();
const posts = await getPosts();
const stats = await getStats();           // independent calls, run one after another
```
**🤔 Why it is a problem:** Total time is the sum of all requests, which delays TTFB/LCP.

**✅ Correct:**
```tsx
const [user, posts, stats] = await Promise.all([getUser(), getPosts(), getStats()]);
```
Or stream slow parts with separate `Suspense` boundaries.
**💬 Say:** "I parallelize independent fetches and stream the slow ones."

---

### Mistake 9: `useSearchParams` without `Suspense`
**❌ Wrong:**
```tsx
export default function Page() { return <Filters />; }      // Filters uses useSearchParams
```
**🤔 Why it is a problem:** The build fails or the whole page falls back to client rendering.

**✅ Correct:**
```tsx
<Suspense fallback={<FiltersSkeleton />}><Filters /></Suspense>
```
**💬 Say:** "Client search-param hooks need a Suspense boundary on static routes."

---

### Mistake 10: Reading `cookies()` in the root layout (everything becomes dynamic)
**❌ Wrong:**
```tsx
// app/layout.tsx
const theme = (await cookies()).get('theme')?.value;
```
**🤔 Why it is a problem:** Every route under that layout becomes dynamic and loses static/CDN caching.

**✅ Correct:** Read cookies only in the components/routes that need them, inside `Suspense` holes (PPR), or handle theme with a small inline script and `localStorage`.
**💬 Say:** "A dynamic API in a layout makes the whole subtree dynamic."

---

### Mistake 11: `redirect()` inside `try/catch`
**❌ Wrong:**
```ts
try { await save(); redirect('/done'); } catch (e) { return { error: 'Failed' }; }
```
**🤔 Why it is a problem:** `redirect` throws a control-flow error, so the catch swallows it and reports a false failure.

**✅ Correct:**
```ts
try { await save(); } catch { return { error: 'Failed' }; }
redirect('/done');                                      // outside try/catch
```
**💬 Say:** "`redirect` and `notFound` work by throwing, so I call them outside try/catch."

---

### Mistake 12: Using `<img>` or `next/image` without `sizes`/`priority`
**❌ Wrong:**
```tsx
<img src="/hero.png" />
<Image src={url} alt="" fill />                         // no sizes, not priority for LCP
```
**🤔 Why it is a problem:** Unoptimized huge images, layout shift, slow LCP.

**✅ Correct:**
```tsx
<Image src="/hero.png" alt="Hero" width={1200} height={600} priority sizes="100vw" />
```
**💬 Say:** "Images get dimensions, correct `sizes`, and `priority` for the LCP image."

---

### Mistake 13: Wide-open `remotePatterns` or none at all
**❌ Wrong:** `images: { remotePatterns: [{ hostname: '**' }] }`, or forgetting to configure hosts.
**🤔 Why it is a problem:** Open patterns let attackers use your optimizer as a free proxy (cost, SSRF-ish abuse); missing patterns break images.

**✅ Correct:** Whitelist exact hosts and paths (`hostname: 'cdn.example.com', pathname: '/images/**'`).
**💬 Say:** "Allow only the image hosts I actually use."

---

### Mistake 14: Not revalidating after mutations
**❌ Wrong:**
```ts
'use server';
export async function addPost(fd: FormData) { await db.post.create({ data: ... }); }      // no revalidation
```
**🤔 Why it is a problem:** The list page keeps showing cached data.

**✅ Correct:**
```ts
await db.post.create({ data });
revalidatePath('/posts');                 // or revalidateTag('posts')
```
**💬 Say:** "Every mutation is followed by a precise revalidation."

---

### Mistake 15: Making everything `force-dynamic` / `no-store`
**❌ Wrong:** Adding `export const dynamic = 'force-dynamic'` to "fix" stale data on every page.
**🤔 Why it is a problem:** You lose static speed and CDN caching, and increase server cost and latency.

**✅ Correct:** Use tag-based revalidation or short `revalidate` for freshness, and keep only truly personalized parts dynamic (Suspense holes).
**💬 Say:** "I fix staleness with targeted revalidation, not by disabling caching."

---

### Mistake 16: Mutable module-level state on the server
**❌ Wrong:**
```ts
let currentUser: User | null = null;      // set per request
```
**🤔 Why it is a problem:** It is shared between requests, causing data leaks between users.

**✅ Correct:** Derive user data per request from cookies/session; use `React.cache` for per-request memoization.
**💬 Say:** "Server module scope is shared across users; request data must stay request-scoped."

---

### Mistake 17: Using `next/router` in the App Router
**❌ Wrong:** `import { useRouter } from 'next/router';` in `app/`.
**🤔 Why it is a problem:** It throws "NextRouter was not mounted" or behaves incorrectly.

**✅ Correct:** `import { useRouter, usePathname, useSearchParams } from 'next/navigation';`
**💬 Say:** "`next/navigation` for the App Router, `next/router` for Pages."

---

### Mistake 18: Importing server-only code from Client Components
**❌ Wrong:** A client file imports a module that uses `fs`, DB drivers or secrets.
**🤔 Why it is a problem:** Build errors, or worse, secrets/large code in the client bundle.

**✅ Correct:** Add `import 'server-only'` to server modules, call them from Server Components/actions, and pass only data to clients.
**💬 Say:** "I make the server/client boundary enforceable with `server-only`."

---

### Mistake 19: Testing only with `next dev`
**❌ Wrong:** "It works on my machine in dev."
**🤔 Why it is a problem:** Dev differs from production: no prefetching, different caching, no static optimization, StrictMode double renders. Bugs (static freezing, hydration errors, build failures) appear only in production.

**✅ Correct:** Run `next build && next start` locally and in CI, and run E2E tests against it.
**💬 Say:** "I verify behavior on a production build."

---

### Mistake 20: Incomplete Docker `standalone` image
**❌ Wrong:** Copying only `.next/standalone` and running `node server.js`.
**🤔 Why it is a problem:** CSS/JS and images return 404 because `.next/static` and `public/` are missing; the server may not be reachable if `HOSTNAME` is not `0.0.0.0`.

**✅ Correct:** Copy `public`, `.next/static` and use `HOSTNAME=0.0.0.0` (see Part 6, C19).
**💬 Say:** "Standalone output needs static assets copied manually."

---

### Mistake 21: In-memory caches or rate limits in a multi-instance deployment
**❌ Wrong:** A `Map` for rate limiting or caching, and the default filesystem ISR cache, on 3+ servers.
**🤔 Why it is a problem:** Each instance has different state: inconsistent limits, stale pages on some servers.

**✅ Correct:** Use a shared store (Redis/Upstash) and a shared Next.js `cacheHandler`.
**💬 Say:** "State shared across instances must live in a shared store."

---

### Mistake 22: Passing huge props to Client Components
**❌ Wrong:**
```tsx
<ClientTable rows={allTenThousandRows} />
```
**🤔 Why it is a problem:** The data is serialized into the HTML and RSC payload, which increases payload size, hydration time and memory.

**✅ Correct:** Paginate on the server, pass only needed fields, stream, or fetch more via Server Actions/route handlers on demand.
**💬 Say:** "Props crossing the boundary cost bytes twice."

---

### Mistake 23: Heavy work or database calls in middleware
**❌ Wrong:** Querying the database or verifying complex tokens with large libraries in middleware.
**🤔 Why it is a problem:** It runs on every matched request (including prefetches), adds latency globally, and Edge runtime limits many libraries.

**✅ Correct:** Keep middleware light (cookie presence, simple JWT checks, rewrites). Do real authorization in the data layer.
**💬 Say:** "Middleware is for fast routing decisions, not business logic."

---

### Mistake 24: Ignoring version skew during deployments
**❌ Wrong:** Deploying and deleting old assets immediately; each instance has a different Server Actions encryption key.
**🤔 Why it is a problem:** Users on old pages get chunk-load errors or "Failed to find Server Action" errors after a deploy.

**✅ Correct:** Keep old assets for a grace period, use the platform's skew protection or stable deployment IDs, share `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` across instances, and handle chunk errors with a one-time reload.
**💬 Say:** "I plan for old clients talking to new servers."

---

### Mistake 25: Unescaped JSON-LD or injected HTML
**❌ Wrong:**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
```
**🤔 Why it is a problem:** If `data` contains `</script>` or `<`, it can break out and cause XSS.

**✅ Correct:**
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
```
**💬 Say:** "I escape `<` in embedded JSON."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you explain Next.js. A junior lists features. A senior explains **where code runs, what is cached, what is sent to the browser, and the trade-offs**, with numbers.
> **What should you do?** Practice the "Strong" style for every answer.

### Signal 1: You always reason about where code runs
| | Example answer |
|---|---|
| ❌ Weak | "I use getServerSideProps for server code." |
| ✅ Strong | "Server Components run on the server (build or request) and add no client JS; Client Components render on the server for HTML and hydrate in the browser. I keep the client boundary at the leaves, pass server-rendered content as `children`, and use `server-only` to protect secrets." |
**Prove it:** boundary rules, serialization, `server-only`.

### Signal 2: You know the caching model and its version differences
| | Example answer |
|---|---|
| ❌ Weak | "Next.js caches automatically." |
| ✅ Strong | "There are four caches: Request Memoization, Data Cache, Full Route Cache and the client Router Cache. Next.js 15 made `fetch` and GET handlers uncached by default and set page-segment staleTimes to 0; Next.js 16 moves to explicit `'use cache'`. I use tags for on-demand revalidation, shared cache handlers for multi-instance, and I verify behavior on a production build." |
**Prove it:** list the layers, defaults and invalidation APIs.

### Signal 3: You choose rendering strategies per route with data
| | Example answer |
|---|---|
| ❌ Weak | "I use SSR everywhere for SEO." |
| ✅ Strong | "Marketing is static, catalog is ISR with tags from CMS webhooks, dashboards are dynamic with streaming, and mixed pages use a static shell with Suspense holes. We cut LCP from 4.2 to 2.1 s and build time from 40 to 6 minutes." |
**Prove it:** table of route types, numbers.

### Signal 4: You treat security as multi-layered
| | Example answer |
|---|---|
| ❌ Weak | "Middleware checks login." |
| ✅ Strong | "Middleware is only an optimistic filter. Authorization lives in a data access layer, route handlers and Server Actions, which I treat as public endpoints: validate with Zod, check the session, rate limit. I return DTOs, keep secrets server-only, restrict image hosts, use CSP and keep Next.js patched (e.g., the middleware bypass advisory)." |
**Prove it:** DAL pattern, Server Actions security.

### Signal 5: You understand data fetching patterns and performance
| | Example answer |
|---|---|
| ❌ Weak | "I fetch data in useEffect." |
| ✅ Strong | "I fetch in Server Components, parallelize with `Promise.all`, stream slow parts with Suspense, prefetch with `Link`, memoize with `React.cache`, and keep large data out of Client Component props. I watch First Load JS and RSC payload size." |
**Prove it:** waterfalls, streaming, bundle analysis.

### Signal 6: You can operate Next.js in production
| | Example answer |
|---|---|
| ❌ Weak | "I deploy to Vercel." |
| ✅ Strong | "I know both paths: Vercel for speed, and self-hosting with `standalone` Docker, shared cache handler, shared Server Actions encryption key, health checks, graceful shutdown, no proxy buffering for streaming, and skew protection. I monitor cache hit ratio, errors by release and Web Vitals." |
**Prove it:** Docker, caching in multi-instance, observability.

### Signal 7: You plan migrations and upgrades
| | Example answer |
|---|---|
| ❌ Weak | "We upgraded Next.js." |
| ✅ Strong | "We migrated Pages to App Router route by route (both routers coexist), used codemods for async request APIs, compared Web Vitals and bundle size at each step, trained the team on boundaries and caching, and set ADRs for rendering and caching policy." |
**Prove it:** strangler pattern, codemods, metrics.

### Signal 8: You know when not to use Next.js features
| | Example answer |
|---|---|
| ❌ Weak | "Next.js for everything." |
| ✅ Strong | "For an internal tool behind login with no SEO, a Vite SPA is simpler. For content sites, Astro may ship less JS. For highly dynamic apps, I limit Server Components to data loading and keep rich interactions on the client. I avoid edge runtimes when the database is regional." |
**Prove it:** compare alternatives, edge vs regional.

### 🔊 Phrases that sound senior
- "Where does this run, and what gets cached?"
- "That's a Dynamic API in the layout, so the whole subtree is dynamic."
- "Server Actions are public endpoints; I authorize inside them."
- "I verify on `next build && next start`, not just dev."
- "Revalidate by tag from the CMS webhook instead of disabling caching."
- "With multiple instances, the default cache isn't shared, so I use a cache handler."

### 🚩 Phrases that sound junior
- "I put `'use client'` at the top to fix errors." · "I use `force-dynamic` so data is always fresh." · "Middleware handles all security." · "I fetch in useEffect." · "It works in dev." · "I don't know what is cached."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Server vs Client Components** and the `'use client'` boundary
2. **Rendering modes:** static, ISR, dynamic, streaming, PPR/Cache Components
3. **The four caches** and how to invalidate them
4. **Next.js 15/16 changes:** async request APIs, uncached `fetch` default, `'use cache'`, `proxy.ts`
5. **File conventions:** layout/template/page/loading/error/not-found/route
6. **Data fetching patterns:** parallel, streaming, DAL, `React.cache`
7. **Server Actions:** forms, validation, revalidation, security
8. **Middleware/proxy:** matcher, rewrites, limits, not the only auth layer
9. **Optimizations:** `next/image`, `next/font`, `next/script`, dynamic imports, bundle size
10. **Deployment:** Vercel vs self-hosting (standalone, shared cache, skew)

## 18.2 Choose the rendering strategy
| Page type | Strategy |
|---|---|
| Marketing/docs | Static (SSG) |
| Blog/catalog with updates | ISR + tag revalidation |
| User-specific page | Dynamic (SSR) or static shell + dynamic hole |
| Dashboard behind login | Dynamic + streaming, rich client islands |
| Search/filter results | Dynamic by `searchParams` (cache the data layer) |
| Real-time | Client fetching/SSE/WebSocket service |

## 18.3 Cache cheat sheet
| Need | Use |
|---|---|
| Cache a `fetch` | `{ cache: 'force-cache' }` or `{ next: { revalidate: n } }` |
| Never cache a `fetch` | `{ cache: 'no-store' }` |
| Cache a DB call per request | `React.cache(fn)` |
| Cache a DB call across requests | `unstable_cache` or `'use cache'` + `cacheLife` |
| Purge after a mutation | `revalidatePath()` / `revalidateTag()` |
| Time-based regeneration | `export const revalidate = n` |
| Force per-request rendering | `export const dynamic = 'force-dynamic'` |

## 18.4 What makes a route dynamic?
`cookies()`, `headers()`, `searchParams`, `draftMode()`, `connection()`, `unstable_noStore()`, `fetch` with `no-store`, `dynamic = 'force-dynamic'`, `revalidate = 0`.

## 18.5 Security checklist
- [ ] Authorization in DAL, handlers and Server Actions (not only middleware)
- [ ] Validate all input with schemas
- [ ] DTOs: no full DB rows to the client
- [ ] Secrets only in server env vars; `import 'server-only'`
- [ ] Restrict `images.remotePatterns`; CSP and security headers
- [ ] Rate limit actions/handlers (shared store)
- [ ] Keep Next.js and dependencies patched

## 18.6 Performance checklist
- [ ] Server Components by default; small client leaves
- [ ] Parallel fetches; Suspense streaming
- [ ] `next/image` with `sizes` and `priority` for the LCP image
- [ ] `next/font`; `next/script` with `lazyOnload`
- [ ] `next/dynamic` for heavy client widgets
- [ ] Bundle analyzer; `optimizePackageImports`
- [ ] Static/ISR where possible; CDN caching headers
- [ ] Track Web Vitals (`useReportWebVitals`)

## 18.7 Deployment checklist
- [ ] `next build && next start` tested
- [ ] Env vars: build-time vs runtime understood
- [ ] Standalone Docker: copy `public` and `.next/static`, `HOSTNAME=0.0.0.0`
- [ ] Shared cache handler and shared Server Actions key for multiple instances
- [ ] Health checks, graceful shutdown, no proxy buffering for streaming
- [ ] Skew protection and rollback plan
- [ ] Error tracking and logs with release tags

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| Hydration error | Server/client first render differ | Same first render; effect for client-only values |
| `window is not defined` | Browser API in server code | `useEffect` / client component / `dynamic ssr:false` |
| Needs `useState` in Client Component | Missing `'use client'` | Add it at the leaf |
| Stale data | Data/Route/Router cache | `revalidatePath/Tag`, `router.refresh()`, dynamic |
| Data frozen from build | Static route with uncached fetch | `no-store`, `revalidate`, or dynamic API |
| `useSearchParams` build error | Missing Suspense | Wrap in `<Suspense>` |
| Image host error | `remotePatterns` missing | Configure the host |
| 404 for new dynamic page | `dynamicParams=false` | Enable or rebuild |
| Redirect not working | `redirect` in try/catch | Move outside |
| Env var undefined in browser | Missing `NEXT_PUBLIC_` / build-time | Prefix + rebuild |
| Docker app has no CSS | Missing static copy | Copy `.next/static` and `public` |
| ISR differs between servers | Per-instance cache | Shared cache handler |
| Server Action fails after deploy | Version skew / key mismatch | Skew protection, shared encryption key |
| Slow dev server | Large graph / webpack | Turbopack, `optimizePackageImports` |

## 18.9 30-second answers
- **What is Next.js?** A React framework with file-based routing, server rendering (SSR/SSG/ISR/streaming), Server Components, built-in backend endpoints and optimizations.
- **App Router vs Pages Router?** App Router uses Server Components, nested layouts, streaming and the `fetch`/actions model; Pages uses `getStaticProps/getServerSideProps` and client components by default.
- **SSR vs SSG vs ISR?** Per request vs at build time vs static with background regeneration.
- **Server vs Client Components?** Server: run on the server, no client JS, can access data. Client: interactive, hydrate in the browser, `'use client'`.
- **How does caching work?** Request memoization, Data Cache, Full Route Cache, Router Cache; invalidate with `revalidate`, tags, paths; defaults changed in Next.js 15.
- **What are Server Actions?** Server functions callable from forms/clients, exposed as POST endpoints; authenticate and validate inside them.
- **How do you optimize performance?** Server Components, parallel fetching and streaming, `next/image/font/script`, dynamic imports, static/ISR, CDN, bundle analysis.
- **How do you secure a Next.js app?** Layered authorization in the data layer, validation, DTOs, server-only secrets, CSP and headers, patched versions.
- **How do you deploy?** Vercel, or Docker with `standalone`, shared cache and skew handling.

## 18.10 Last-minute checklist before the interview
- [ ] I can explain Server vs Client Components, the boundary and serialization rules.
- [ ] I can draw the four caches and name the defaults before and after Next.js 15.
- [ ] I can say which rendering mode a snippet triggers (`cookies()`, `no-store`, `revalidate`, `searchParams`).
- [ ] I can write a Server Action with validation, auth and `revalidatePath`.
- [ ] I can build middleware with a matcher and explain why it is not enough for auth.
- [ ] I can explain Docker standalone deployment and multi-instance caching.
- [ ] I have two stories with numbers (LCP/build-time improvement, a caching or security bug).
- [ ] I know the main Next.js 15 and 16 changes and the file renames.
