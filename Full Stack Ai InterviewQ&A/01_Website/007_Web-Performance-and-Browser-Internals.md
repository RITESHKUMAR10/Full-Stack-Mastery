# Web Performance & Browser Internals Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Uses current Core Web Vitals (**LCP, INP, CLS**; INP replaced FID in 2024). Thresholds are the commonly published ones, measured at the **75th percentile** of real users. Some APIs are Chromium-only; they are marked.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/measurement snippets · Debugging (slow-page investigations) · Scenario · Architecture · Rapid-fire · Project/behavioral · Calculations · MCQ
>
> **Golden rule:** Performance answers must follow this order: **Measure → Find the bottleneck → Fix → Measure again → Prevent regression.** Always name the metric, the tool and a number.

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Measurement & Optimization Tasks](#-part-6-coding--measurement--optimization-tasks)
- [Part 7: Debugging Scenarios (Slow-Page Investigations)](#-part-7-debugging-scenarios-slow-page-investigations)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Classic + Tools + Frameworks + APIs)](#-part-11-complete-coverage-classic--tools--frameworks--apis)
- [Part 12: Browser Internals](#-part-12-browser-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Calculations & Prediction Questions](#-part-14-calculations--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is web performance and why does it matter? *(Conceptual)*
**Answer:** Web performance is how **fast a page loads, responds and feels**. It matters because:
- **User experience:** slow pages feel broken; people leave.
- **Business:** faster pages usually improve conversion, engagement and retention (many companies publish case studies; always measure your own).
- **SEO:** Core Web Vitals are part of Google's page experience signals (a small ranking factor; relevance matters more).
- **Accessibility and reach:** users on slow networks and low-end phones depend on lightweight pages.
- **Cost:** fewer bytes and less CPU lower hosting and data costs.

### Q2. What are the Core Web Vitals? *(Must-know)*
| Metric | Measures | Good | Needs improvement | Poor |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Loading: when the main content is visible | ≤ 2.5 s | ≤ 4 s | > 4 s |
| **INP** (Interaction to Next Paint) | Responsiveness: delay after clicks, taps, key presses | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | Visual stability: unexpected movement | ≤ 0.1 | ≤ 0.25 | > 0.25 |
A page "passes" when the **75th percentile** of real-user page loads meets "good" for all three, measured separately for mobile and desktop. **FID** (First Input Delay) was replaced by **INP** in March 2024.

### Q3. Lab data vs field data? *(Comparison, very common)*
| | Lab (synthetic) data | Field (real-user) data |
|---|---|---|
| Source | Lighthouse, WebPageTest, DevTools | CrUX, RUM (web-vitals library) |
| Conditions | Controlled device + network | Real devices, networks, locations |
| Good for | Debugging, regression checks, CI | Knowing the real experience, ranking signals |
| Limits | May not match users; cannot measure INP fully | Hard to debug without attribution |
**Best practice:** use field data to decide *what* to fix, lab data to find out *why* and to prevent regressions.

### Q4. What happens when you type a URL and press Enter? *(Classic)*
1. Browser checks its caches and HSTS list; parses the URL.
2. **DNS lookup** (domain → IP).
3. **TCP connection** (3-way handshake) — or QUIC for HTTP/3.
4. **TLS handshake** (encryption).
5. **HTTP request** → server processing → **response** (HTML).
6. Browser **parses HTML**, builds the DOM, discovers CSS/JS/images (preload scanner).
7. CSS → CSSOM; DOM + CSSOM → render tree → **layout → paint → composite**.
8. JS runs; the page becomes interactive.
Every step can be optimized (CDN, keep-alive, HTTP/2/3, caching, compression, critical CSS...).

### Q5. What is the Critical Rendering Path? *(Must-know)*
The sequence the browser follows to turn HTML, CSS and JS into pixels: **DOM → CSSOM → Render tree → Layout → Paint → Composite**. CSS is **render-blocking** (no painting until CSSOM is ready). Synchronous JS is **parser-blocking** (it stops HTML parsing, and waits for pending CSS). Optimizing the path means: fewer and smaller critical resources, fewer round trips, and shorter critical-path length.

### Q6. What are render-blocking resources? How do you fix them?
Resources that must be downloaded and processed before the first paint: CSS in `<head>` and synchronous JS.
```html
<!-- Blocking -->
<link rel="stylesheet" href="app.css">
<script src="app.js"></script>

<!-- Better -->
<style>/* critical above-the-fold CSS inline */</style>
<link rel="preload" href="app.css" as="style" onload="this.rel='stylesheet'">
<script src="app.js" defer></script>
```
Fixes: inline critical CSS, split CSS by media/route (`media="print"` for print CSS), use `defer`/`async` for scripts, remove unused CSS/JS.

### Q7. `async` vs `defer`?
Both download in parallel. `async` runs **as soon as downloaded** (can interrupt parsing, order not guaranteed): good for analytics. `defer` runs **after HTML is parsed**, in order, before `DOMContentLoaded`: good for app code. `type="module"` is deferred by default.

### Q8. What are TTFB, FCP and LCP?
- **TTFB** (Time to First Byte): from navigation start to the first byte of the response (includes redirects, DNS, TCP, TLS, server time). Good ≤ 0.8 s.
- **FCP** (First Contentful Paint): first text or image painted. Good ≤ 1.8 s.
- **LCP**: when the **largest** image/text block in the viewport is painted. Good ≤ 2.5 s.
Order in time: TTFB → FCP → LCP.

### Q9. How does caching improve performance?
The best request is **no request**. Browser cache avoids the network for repeat visits; CDN cache avoids the origin server. Static assets with hashed filenames get long cache lifetimes; HTML gets short cache or revalidation.
```http
Cache-Control: public, max-age=31536000, immutable   # app.3f2a9c.js
Cache-Control: no-cache                              # index.html (revalidate every time)
```

### Q10. What is a CDN and how does it help?
A **Content Delivery Network** is a global network of edge servers that cache and serve content close to users. Benefits: lower latency, offloaded origin, better availability, built-in compression, HTTP/2/3 and TLS termination, image optimization, DDoS protection.

### Q11. What is lazy loading?
Loading resources only when needed (when near the viewport or on interaction).
```html
<img src="photo.jpg" alt="..." width="800" height="600" loading="lazy">
<iframe src="https://example.com/embed" loading="lazy"></iframe>
```
```js
const Chart = React.lazy(() => import('./Chart'));      // code lazy-loading
```
**Never lazy-load the LCP image** or other above-the-fold content.

### Q12. How do you optimize images? *(Practical)*
- Use modern formats: **WebP/AVIF** (JPEG/PNG as fallback), **SVG** for icons.
- Resize to the display size; use `srcset`/`sizes` for responsive images.
- Compress (quality ~75–85 for photos), strip metadata.
- Set `width` and `height` (prevents CLS).
- `loading="lazy"` below the fold; `fetchpriority="high"` for the LCP image.
- Serve through an image CDN that resizes and converts automatically.
```html
<img src="hero-800.webp" width="800" height="450" alt="Hero"
     srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1600.webp 1600w"
     sizes="(max-width: 600px) 100vw, 800px" fetchpriority="high">
```

### Q13. What are minification, compression and bundling?
- **Minification:** remove whitespace, comments, shorten names (Terser, esbuild, cssnano).
- **Compression:** gzip/**Brotli** on the server for text (HTML, CSS, JS, JSON, SVG). Brotli is usually smaller than gzip.
- **Bundling:** combine modules into fewer files (still useful with HTTP/2; code-splitting keeps bundles small).

### Q14. What is code splitting?
Splitting the JavaScript into smaller chunks loaded on demand (per route or per feature), so users download only what the current page needs.
```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});
```

### Q15. What is tree shaking?
Removing unused exports from the final bundle. It needs ES modules (static `import/export`) and side-effect-free code (`"sideEffects": false` in `package.json`).

### Q16. What is reflow (layout) and repaint? Why do they matter?
**Reflow** recalculates the position and size of elements (expensive and can affect many elements). **Repaint** redraws pixels (cheaper). Changing `width`, `height`, `top`, `font-size` triggers layout; changing `color`/`background` triggers paint only; changing `transform`/`opacity` can skip both and be handled by the compositor.

### Q17. What are the main Chrome DevTools panels for performance?
- **Network:** waterfall, request priority, sizes, throttling, cache status.
- **Performance:** flame chart, main-thread tasks, layout/paint, frames, Web Vitals markers.
- **Lighthouse:** audit and scores with suggestions.
- **Coverage:** unused CSS/JS bytes.
- **Memory:** heap snapshots, allocation profiling.
- **Rendering:** paint flashing, layout shift regions, FPS meter.
- **Application:** service workers, cache storage, bfcache test.

### Q18. What is Lighthouse? What do its scores mean?
Lighthouse is an automated audit tool (in DevTools, CLI, PageSpeed Insights, CI). The performance score (0–100) is a weighted mix of lab metrics: in recent versions roughly **TBT 30%, LCP 25%, CLS 25%, FCP 10%, Speed Index 10%**. It is a **lab** score on an emulated device; it is **not** what Google uses to rank pages (field Core Web Vitals are).

### Q19. What is the difference between `DOMContentLoaded` and `load`?
`DOMContentLoaded`: HTML parsed and deferred scripts executed (no wait for images, styles, subframes). `load`: the page and all its resources (images, iframes) finished loading. Neither is a user-centric metric; prefer LCP, INP and CLS.

### Q20. What are HTTP/1.1, HTTP/2 and HTTP/3 (basic)?
- **HTTP/1.1:** one request per connection at a time (browsers open ~6 connections per host); head-of-line blocking.
- **HTTP/2:** **multiplexing** many requests on one TCP connection, header compression (HPACK).
- **HTTP/3:** runs on **QUIC** (over UDP): faster connection setup, no TCP head-of-line blocking, better on lossy mobile networks.

### Q21. What are `preload`, `prefetch` and `preconnect`?
```html
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">  <!-- needed NOW on this page -->
<link rel="prefetch" href="/next.js">                                   <!-- maybe needed on the NEXT page -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>       <!-- open the connection early -->
<link rel="dns-prefetch" href="//analytics.example.com">                 <!-- resolve DNS only -->
```
Use sparingly: too many `preload` hints compete with each other.

### Q22. How do web fonts affect performance?
Fonts can delay text rendering (FOIT) or cause layout shift when swapped (FOUT). Fixes: `font-display: swap` (or `optional`), `preload` the key WOFF2 file, subset fonts, use variable fonts, self-host, and set fallback metrics (`size-adjust`) to avoid shift.
```css
@font-face { font-family: Inter; src: url(/inter.woff2) format('woff2'); font-display: swap; }
```

### Q23. Why are third-party scripts a problem?
Ads, analytics, chat widgets and tag managers add network requests, block the main thread, and cannot be controlled by you. Reduce them: load with `async`/`defer`, delay until interaction, use facades (static preview instead of an embedded player), audit regularly, and set a budget.

### Q24. What is debouncing and throttling for performance?
Debounce delays work until events stop (search input). Throttle limits work to once per interval (scroll, resize). Both reduce main-thread work and network calls.

### Q25. What is a performance budget?
A limit you agree on and enforce, e.g., "initial JS ≤ 170 KB gzip, LCP ≤ 2.5 s on mid-range Android 4G, total page ≤ 1.5 MB". Enforce in CI (Lighthouse CI, bundle-size checks) so regressions fail the build.

### Q26. What is the main thread and what are long tasks?
The main thread runs JavaScript, style calculation, layout and painting steps, and handles input. A **long task** is any task that runs for more than **50 ms**; during it the page cannot respond. Too many long tasks hurt INP and TBT.

### Q27. What is HTTP keep-alive / connection reuse?
Reusing a TCP/TLS connection for multiple requests instead of creating a new one each time. It removes repeated handshake cost. HTTP/2 and HTTP/3 reuse one connection per origin.

### Q28. Why do cookies affect performance?
Cookies are sent with **every request** to their domain, including images and CSS. Large or many cookies increase request size. Serve static assets from a cookieless domain or path, keep cookies small, and avoid unnecessary ones.

### Q29. What is the difference between speed and "perceived performance"?
Perceived performance is how fast the page *feels*. Techniques: skeleton screens, optimistic UI, showing content progressively (streaming), instant feedback on click, fast first paint, and avoiding layout jumps. A 2-second load with early visible content can feel faster than a 1.5-second blank screen.

### Q30. What are the basic steps to speed up a slow website?
1. Measure (Lighthouse, field data). 2. Reduce bytes (compress, minify, optimize images, remove unused code). 3. Reduce requests and round trips (cache, CDN, HTTP/2+, preconnect). 4. Unblock rendering (critical CSS, defer JS). 5. Reduce main-thread work (split code, avoid long tasks). 6. Prevent layout shifts (reserve space). 7. Monitor and set budgets.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. How do you improve LCP? Break it down into parts. *(Must-know)*
LCP time = **TTFB + resource load delay + resource load duration + element render delay**. Check each:
| Part | Problem | Fix |
|---|---|---|
| TTFB | Slow server, redirects, no CDN | Caching, CDN, faster backend, avoid redirect chains, HTTP/3 |
| Resource load delay | Browser discovers the LCP image late (CSS background, JS-inserted, lazy-loaded) | Put it in HTML (`<img>`), `preload`, `fetchpriority="high"`, never lazy-load it |
| Resource load duration | Heavy image/font | Compress, AVIF/WebP, correct size, CDN |
| Element render delay | Render-blocking CSS/JS, client-side rendering | Inline critical CSS, defer JS, SSR/SSG for the main content |
Find the **LCP element** first (DevTools Performance panel → LCP marker, or `PerformanceObserver`).

### Q32. How do you improve CLS? *(Must-know)*
Layout shifts happen when visible elements move. Common causes and fixes:
- Images/videos/iframes without dimensions → add `width`/`height` or `aspect-ratio`.
- Ads, embeds, banners injected late → reserve space with `min-height`.
- Web fonts swapping → `font-display`, preload, `size-adjust` fallback.
- Content inserted above existing content → insert below, or reserve space; animate with `transform`.
- Late-loaded CSS or JS that changes layout → inline critical CSS.
Shifts caused by user input (within 500 ms) are not counted.
```css
.ad-slot { min-height: 250px; }
img, video { aspect-ratio: attr(width) / attr(height); height: auto; }
```

### Q33. How do you improve INP? *(Must-know)*
INP = the time from an interaction to the next frame being painted. It has three parts: **input delay** (main thread busy), **processing time** (your event handlers), **presentation delay** (rendering after handlers). Fixes:
- Break up long tasks; **yield to the main thread** (`await scheduler.yield()` or `setTimeout`).
- Make event handlers light; move heavy work to a Web Worker or defer it.
- Avoid large DOM updates and forced layouts; keep the DOM small.
- Reduce third-party script cost; lazy-load non-critical JS.
- In frameworks: avoid unnecessary re-renders, use transitions (`startTransition`), virtualize lists.
Measure with the `web-vitals` library (attribution build) and the DevTools Performance panel.

### Q34. What are the HTTP caching headers? *(Must-know)*
| Header / directive | Meaning |
|---|---|
| `Cache-Control: max-age=N` | Fresh for N seconds; no request needed |
| `Cache-Control: no-cache` | May be stored, but **must revalidate** before use |
| `Cache-Control: no-store` | Never store (sensitive data) |
| `public` / `private` | Shared caches (CDN) allowed / browser only |
| `s-maxage=N` | Max age for shared caches (CDN) |
| `immutable` | Never changes during its lifetime; skip revalidation |
| `stale-while-revalidate=N` | Serve stale instantly, refresh in the background |
| `stale-if-error=N` | Serve stale if the origin fails |
| `ETag` / `If-None-Match` | Validate with a content hash; server answers `304 Not Modified` |
| `Last-Modified` / `If-Modified-Since` | Validate with a date |
| `Vary` | Which request headers change the response (affects cache key) |

### Q35. A caching strategy for a typical SPA/website
- Hashed static files (`app.3f2a.js`, images, fonts): `Cache-Control: public, max-age=31536000, immutable`.
- HTML: `Cache-Control: no-cache` (or short `max-age` + `stale-while-revalidate`), so new deploys are picked up.
- API responses: depends; `private, max-age=0, must-revalidate` or short TTL; use ETags.
- CDN: `s-maxage` + purge on deploy.
The pattern is **"immutable assets + revalidated HTML"**.

### Q36. Explain `ETag` and `304`.
The server sends `ETag: "abc123"`. Next time the browser sends `If-None-Match: "abc123"`. If the content is unchanged, the server replies `304 Not Modified` with no body, so only headers travel. It saves bandwidth but still costs a round trip, unlike a fresh `max-age` hit that costs none.

### Q37. Preload vs prefetch vs preconnect vs modulepreload: when to use?
- `preload`: resource needed soon on this page and discovered late (LCP image, key font, a script found only after CSS).
- `prefetch`: likely needed on the next navigation (low priority, idle time).
- `preconnect`: you will fetch from a cross-origin host soon (CDN, API, fonts) — limit to 2–3 origins.
- `modulepreload`: preload and parse an ES module and its dependencies.
Wrong `as`, missing `crossorigin` for fonts, or an unused preload causes a double download or a Chrome warning ("preloaded but not used").

### Q38. What is `fetchpriority`?
A hint to raise or lower the priority of a resource: `fetchpriority="high"` on the LCP image, `low` on offscreen images or non-critical scripts. Browsers have their own heuristics; the hint adjusts them.

### Q39. Critical CSS: what is it and how to do it?
The minimum CSS needed to render above-the-fold content, inlined in `<style>`; the rest is loaded asynchronously. Tools: critical, Penthouse, framework features (Next.js, Astro extraction). Keep inlined CSS small (the first TCP window carries about 14 KB).

### Q40. How do you analyze bundle size?
Use `webpack-bundle-analyzer`, `source-map-explorer`, `rollup-plugin-visualizer`, `vite-bundle-visualizer`, or `bundlephobia` for packages. Look for large dependencies (moment, lodash full, chart libraries), duplicate packages, and code that should be lazy-loaded. Replace heavy libraries with lighter ones (`date-fns`/`dayjs`, native `Intl`).

### Q41. What does the `Performance` panel show and how do you read it?
Record while reloading or interacting. Look at: the **Main** track (flame chart of tasks; red triangles mark long tasks), **Timings** (FCP, LCP markers), **Layout Shifts**, **Frames** (dropped frames), **Network** requests, and the **Bottom-Up/Call Tree** tabs to find which functions use the most time. Use CPU throttling (4x/6x) to simulate mobile.

### Q42. What are Navigation Timing, Resource Timing and the Performance Observer?
APIs to measure real performance in code.
```js
const nav = performance.getEntriesByType('navigation')[0];
console.log('TTFB', nav.responseStart - nav.startTime);

new PerformanceObserver((list) => {
  for (const e of list.getEntries()) console.log('LCP candidate', e.startTime, e.element);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```
`performance.mark()` and `performance.measure()` time your own code.

### Q43. RUM vs synthetic monitoring
**RUM** collects metrics from real users (web-vitals library + beacon to analytics). **Synthetic** runs scripted tests from fixed locations/devices on a schedule (WebPageTest, Lighthouse CI, Checkly). Use both: synthetic for stable trends and alerts, RUM for the truth.

### Q44. What is `Server-Timing`?
A response header that lets the server expose timings to the browser/DevTools and RUM: `Server-Timing: db;dur=53, cache;desc="hit", app;dur=47.2`. It helps connect front-end metrics (TTFB) to back-end causes.

### Q45. What are DNS, TCP and TLS costs? How do you reduce them?
A new HTTPS connection to a new origin costs about **DNS (1 RTT) + TCP (1 RTT) + TLS (1 RTT with TLS 1.3)**. Reduce with: fewer origins, `preconnect`, keep-alive, HTTP/2+ (one connection), HTTP/3 (combined transport + crypto handshake), TLS 1.3, CDN near users, and DNS caching/low-TTL balance.

### Q46. gzip vs Brotli
Both compress text. Brotli (`br`) usually produces smaller files than gzip (often by double-digit percentages for JS/CSS) but costs more CPU at high levels. Best practice: **pre-compress static files at a high Brotli level at build time**, use a medium level for dynamic responses, and fall back to gzip. Do not compress already-compressed formats (JPEG, PNG, WOFF2, MP4).

### Q47. What is a Service Worker and how can it speed up a site?
A background script that intercepts network requests. It can serve cached responses instantly (cache-first for static assets, stale-while-revalidate for data), enable offline use and precache important routes. Risks: stale content, tricky updates, and bugs that cache errors. Libraries: **Workbox**.

### Q48. What is virtualization (windowing)?
Rendering only the visible rows of a long list and recycling DOM nodes while scrolling (react-window, TanStack Virtual). It reduces DOM size, memory and layout cost for lists with thousands of items.

### Q49. What is Server-Side Rendering (SSR) and how does it affect performance?
SSR sends ready HTML, so FCP/LCP are earlier and SEO is better; but TTFB can be higher (server work), and the page needs **hydration** (extra JS work) before it becomes interactive. SSG pre-renders at build time (fastest TTFB with a CDN), ISR refreshes pages periodically, CSR renders in the browser (slow first paint, good for app-like dashboards).

### Q50. How do you reduce JavaScript cost?
JavaScript costs **download + parse/compile + execute**, and it is the most expensive byte on low-end phones. Reduce: ship less (remove dependencies, tree-shake), split by route, lazy-load, defer non-critical, use modern output (skip legacy polyfills), avoid heavy hydration, and compress.

### Q51. What are `will-change` and GPU layers (basic)?
`will-change: transform` tells the browser to prepare a separate compositing layer. It can make animations smooth but uses extra memory; do not apply it to many elements or leave it on permanently.

### Q52. How do you make animations smooth?
Animate only `transform` and `opacity` (compositor-only), avoid animating layout properties, use `requestAnimationFrame` for JS animations, keep each frame under ~16 ms (60 fps), and prefer CSS animations/Web Animations API over per-frame style changes in JS.

### Q53. What is a bad pattern called "layout thrashing"?
Alternating DOM reads (`offsetHeight`, `getBoundingClientRect`) and writes (`style.width`) in a loop, forcing the browser to recalculate layout again and again.
```js
// ❌ thrashing
items.forEach((el) => { el.style.width = el.parentNode.offsetWidth / 2 + 'px'; });
// ✅ read all, then write all
const w = items[0].parentNode.offsetWidth / 2;
items.forEach((el) => { el.style.width = w + 'px'; });
```

### Q54. How do you test performance on mobile?
Use CPU throttling (4x–6x) and network throttling (Fast 3G/Slow 4G) in DevTools, a real mid-range Android device with remote debugging, WebPageTest with real device profiles, and field data filtered by device type.

### Q55. What is the `Save-Data` header / adaptive loading?
Some users enable data saver; the browser sends `Save-Data: on`. You can serve lighter images, skip autoplay video and defer extras. Related hints: `navigator.connection.effectiveType`, `deviceMemory`, `hardwareConcurrency` (support varies; always degrade gracefully).

---

# 🟡 Part 3: Mid (3–5 years)

### Q56. Explain the browser rendering pipeline for one frame. *(Must-know)*
1. **Input events** are handled.
2. **`requestAnimationFrame`** callbacks run.
3. **Style calculation** (match CSS rules → computed styles).
4. **Layout** (calculate geometry).
5. **Pre-paint / paint** (create display lists, record draw commands).
6. **Layerize + commit** to the compositor.
7. **Raster** (turn layers into bitmaps/tiles, mostly on GPU/raster threads).
8. **Composite** (the compositor thread assembles layers and draws the frame).
A 60 Hz display needs a new frame every **16.7 ms**, and realistically you have ~10–12 ms for your JS + style + layout + paint work. Properties like `transform` and `opacity` can skip steps 3–5.

### Q57. Which CSS properties trigger layout, paint or only composite? *(Must-know)*
| Stage | Examples |
|---|---|
| **Layout** (most expensive) | `width`, `height`, `margin`, `padding`, `top/left`, `display`, `position`, `font-size`, `border` |
| **Paint** | `color`, `background`, `box-shadow`, `border-radius`, `outline`, `visibility` |
| **Composite only** | `transform`, `opacity` (and generally `filter` in many cases) |
Rule: animate composite-only properties (`transform`, `opacity`) for smooth results. The exact cost can differ between browsers, so verify in DevTools.

### Q58. How does the browser decide compositing layers and what are the risks?
Elements with `transform` animations, `will-change`, `position: fixed` (in some cases), video, canvas and some filters get their own layer. Benefits: moving or fading a layer doesn't re-layout or repaint. Risks: each layer uses GPU memory; too many layers (layer explosion) or very large layers hurt memory and performance on mobile. Check **DevTools → Layers**.

### Q59. How do you break up long tasks and yield to the main thread? *(Practical)*
```js
// Option 1: scheduler.yield() (newer Chromium) with a fallback
const yieldToMain = () => ('scheduler' in window && 'yield' in scheduler)
  ? scheduler.yield()
  : new Promise((r) => setTimeout(r, 0));

async function processAll(items) {
  let lastYield = performance.now();
  for (const item of items) {
    handle(item);
    if (performance.now() - lastYield > 40) { await yieldToMain(); lastYield = performance.now(); }
  }
}
```
Other tools: `requestIdleCallback` (low priority), `scheduler.postTask` (priorities), Web Workers (off the main thread), and chunking work.

### Q60. What is the Long Animation Frames (LoAF) API?
A Chromium API that reports animation frames that take longer than 50 ms, with script attribution (which script, which function, how long). It is more useful than Long Tasks for diagnosing poor INP.
```js
new PerformanceObserver((list) => {
  for (const f of list.getEntries()) console.log('LoAF', f.duration, f.scripts.map((s) => s.sourceURL));
}).observe({ type: 'long-animation-frame', buffered: true });
```

### Q61. INP in depth: phases and debugging
For each interaction: **input delay** (waiting for the main thread), **processing time** (event handlers), **presentation delay** (style/layout/paint until the next frame). INP reports roughly the worst interaction (for pages with many interactions, one outlier per 50 is ignored). Debug: record the interaction in the Performance panel (the **Interactions** track), check which phase dominates, and use `web-vitals/attribution` to find the slow element and script in the field. Common fixes: debounce, yield, `startTransition`, avoid layout thrashing, shrink the DOM, defer analytics callbacks.

### Q62. LCP element rules (what counts)
Candidates: `<img>`, `<image>` inside `<svg>`, `<video>` poster (or first frame), an element with a CSS `background-image` loaded via `url()`, and block-level elements containing text. The reported LCP is the largest candidate seen **before the first user interaction** (scrolling or tapping stops LCP reporting). Images with lazy loading, or inserted by JS, are discovered late.

### Q63. CLS in depth: calculation and windows
Each layout shift score = **impact fraction × distance fraction**. CLS uses **session windows**: shifts grouped with gaps of less than 1 s, a window up to 5 s long; the **largest window** is reported. Shifts within 500 ms after discrete user input are excluded.

### Q64. Hydration cost and how to reduce it
Hydration attaches event listeners and rebuilds component state on server-rendered HTML; it requires downloading and running the whole component JS. Costs: big bundles, long tasks, delayed interactivity. Mitigations: **partial/selective hydration**, **islands architecture** (Astro), **React Server Components** (no client JS for server components), lazy hydration on visibility/interaction, **streaming SSR** with Suspense, smaller component trees, and avoiding hydration of static parts.

### Q65. Streaming SSR and Suspense
The server flushes HTML in chunks as data resolves, so the shell and fast parts appear early (good TTFB/FCP), and slow parts fill in later. Example in React 18: `renderToPipeableStream` + `<Suspense fallback>`. Beware of layout shifts when late chunks arrive, and keep the fallback the same size as the final content.

### Q66. HTTP/2 vs HTTP/3 (QUIC) in more detail
HTTP/2: multiplexing over one TCP connection; one lost packet stalls **all** streams (TCP head-of-line blocking). HTTP/3: QUIC over UDP with independent streams (loss affects only one stream), faster connection setup (TLS built in), 0-RTT resumption, and connection migration (Wi-Fi ↔ cellular). Gains are biggest on lossy or high-latency mobile networks. HTTP/2 **server push** was largely removed from browsers; use `preload` and **103 Early Hints** instead.

### Q67. TCP slow start and the "14 KB rule"
A new TCP connection starts with a small congestion window (typically 10 segments, about 14 KB). The first round trip can carry roughly that much data. So the HTML plus inlined critical CSS that fits in the first ~14 KB (compressed) can paint after the first round trip; larger responses need more round trips as the window grows.

### Q68. 103 Early Hints
The server sends an early `103` response with `Link: </app.css>; rel=preload` while it is still generating the full HTML. The browser starts downloading critical assets during server think time, which can improve LCP when TTFB is high. Supported by modern CDNs and browsers.

### Q69. Speculation Rules (prefetch/prerender) — Chromium
```html
<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/products/*" }, "eagerness": "moderate" }] }
</script>
```
The browser can prefetch or fully prerender the next page, making navigation feel instant. Trade-offs: extra bandwidth and server load, analytics double-counting, side effects (do not prerender pages that mutate state), and Chromium-only support (use `<link rel="prefetch">` as a fallback).

### Q70. Back/forward cache (bfcache)
Browsers keep a frozen snapshot of the page in memory so that Back/Forward is **instant**. Things that block it include `unload` handlers (use `pagehide`/`visibilitychange` instead), open connections like WebSocket, some `Cache-Control: no-store` situations (policies are evolving), and ongoing in-flight requests. Test in **DevTools → Application → Back/forward cache**. Handle restored pages with `pageshow` (`event.persisted`).

### Q71. Caching strategies in a service worker
- **Cache-first:** static assets.
- **Network-first:** HTML or API where freshness matters, with cache fallback.
- **Stale-while-revalidate:** show cache immediately, update in the background.
- **Network-only / cache-only** for special cases.
```js
workbox.routing.registerRoute(({ request }) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({ cacheName: 'images' }));
```

### Q72. How do you configure CDN caching correctly?
Define the **cache key** (URL + needed headers only; avoid `Vary: Cookie`/`User-Agent` on static assets), set `s-maxage` and `stale-while-revalidate`, enable Brotli and HTTP/3, purge by tag/path on deploy, use an origin shield (tiered cache) to protect the origin, and normalize query strings. Monitor the **cache hit ratio**.

### Q73. How do you control third-party performance?
Inventory every third party and its owner/cost; load with `async`/`defer` or after interaction; use **facades** (YouTube lite embed); self-host critical ones; use `preconnect` only if needed; sandbox heavy ones in a worker (Partytown) or iframe; set a budget; use Resource Timing and the Lighthouse third-party summary to quantify; remove what does not earn its cost.

### Q74. Memory and garbage collection effects on performance
Large heaps and frequent allocations cause GC pauses (jank). Leaks (listeners, timers, detached DOM, caches) grow memory until the tab slows or crashes. Tools: DevTools Memory (heap snapshots, allocation timeline), Performance monitor, `performance.measureUserAgentSpecificMemory()`. Fixes: cleanup, `WeakMap`, bounded caches, object reuse in hot paths.

### Q75. React-specific performance basics
Avoid unnecessary re-renders (`React.memo`, stable props with `useMemo`/`useCallback` where measured), code-split with `React.lazy`, virtualize long lists, use `startTransition`/`useDeferredValue` for non-urgent updates, keep state local, use keys correctly, profile with React DevTools Profiler, and prefer Server Components where available. Measure before memoizing.

### Q76. Set up RUM with the `web-vitals` library
```js
import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals/attribution';
function send(metric) {
  const body = JSON.stringify({ name: metric.name, value: metric.value, id: metric.id, rating: metric.rating,
    page: location.pathname, nav: metric.navigationType, attribution: metric.attribution });
  (navigator.sendBeacon && navigator.sendBeacon('/vitals', body)) || fetch('/vitals', { method: 'POST', body, keepalive: true });
}
[onLCP, onINP, onCLS, onTTFB].forEach((fn) => fn(send));
```
Segment by device, connection, country, page template and release; look at the **p75**; alert on regressions.

### Q77. CrUX and PageSpeed Insights
The **Chrome UX Report (CrUX)** is public field data from opted-in Chrome users (28-day rolling window). PageSpeed Insights shows CrUX field data (when enough traffic) plus a Lighthouse lab run. Origin-level vs URL-level data differ. Low-traffic pages may have no CrUX data, so you need your own RUM.

### Q78. Performance budgets and CI enforcement
Set budgets for bundle size (`size-limit`, `bundlesize`), Lighthouse metrics (Lighthouse CI assertions) and request counts. Fail pull requests that exceed them, comment results on PRs, and track trends over time.
```json
{ "ci": { "assert": { "assertions": {
  "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
  "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
  "total-blocking-time": ["warn", { "maxNumericValue": 200 }] } } } }
```


---

# 🟠 Part 4: Senior (5–7 years)

### Q79. How do you investigate a slow page systematically? *(Scenario, very common)*
Follow a repeatable method:
1. **Define the problem with data:** which metric (LCP, INP, CLS, TTFB), which pages, which devices/countries, since when (CrUX/RUM, release dates).
2. **Reproduce in the lab:** same page, throttled CPU (4–6x) and network, cold cache, a clean profile.
3. **Locate the bottleneck by phase:**
   - TTFB high → server, redirects, CDN miss.
   - LCP high but TTFB fine → late discovery, heavy resource, render-blocking, or client rendering.
   - INP high → long tasks, heavy handlers, large DOM, third parties.
   - CLS high → missing dimensions, late content, fonts, ads.
4. **Form a hypothesis, change one thing, measure again** (median of several runs).
5. **Ship behind a flag or canary, compare field data.**
6. **Prevent regression:** budget, CI check, alert, owner.
Say this structure out loud in the interview.

### Q80. How do you reduce TTFB? *(Backend + network)*
- Remove redirects (HTTP→HTTPS, www, trailing slash chains).
- Cache at the edge (CDN full-page or fragment caching, `s-maxage`, `stale-while-revalidate`).
- Speed up the origin: query tuning and indexes, fixing N+1 queries, connection pooling, app-level caching (Redis), avoiding synchronous third-party calls, serverless cold-start mitigation.
- Put compute near users (edge functions, multi-region).
- Use HTTP/2/3, TLS 1.3, keep-alive, OCSP stapling, small certificate chains.
- **Stream** HTML so the first bytes are sent early.
- Expose `Server-Timing` to see where time goes.

### Q81. Design an end-to-end caching architecture. *(Architecture)*
Layers: **browser HTTP cache → service worker cache → CDN → application cache (Redis/memory) → database cache/read replicas.**
- Static, content-hashed assets: `immutable` + 1 year everywhere.
- HTML: short TTL or `no-cache` at the browser, but cacheable at the CDN with `s-maxage` + `stale-while-revalidate`, and **purge by tag** on content change.
- Personalized content: cache the shell, load personalized fragments separately (edge includes, client fetch) and avoid `Vary: Cookie` on the whole page.
- Define cache keys carefully (normalize query strings, only vary on needed headers).
- Plan **invalidation** first (versioned URLs, surrogate keys), because "there are only two hard things in computer science".
- Monitor hit ratio, origin load and stale-serve counts.

### Q82. Edge rendering and edge functions: trade-offs
Pros: low latency (compute near the user), personalization at the edge, lower origin load. Cons: limited runtime APIs (no Node APIs in some), cold starts, data locality (database still far away → slow queries), debugging/observability complexity, vendor lock-in, cost. Use the edge for routing, A/B tests, auth checks, header manipulation and caching logic; keep heavy data access near the database or use replicated data.

### Q83. Design an image delivery pipeline
- Store high-quality originals; generate variants on demand through an image CDN (width, quality, format by `Accept` header: AVIF → WebP → JPEG).
- Responsive markup (`srcset`, `sizes`, `<picture>` for art direction) and explicit dimensions to avoid CLS.
- Priority: LCP image `fetchpriority="high"` and preloaded; others lazy with `decoding="async"`.
- Placeholders (dominant color, blur-up/LQIP) for perceived speed.
- Cache variants for a year with versioned URLs; limit the number of allowed sizes to protect cache efficiency and cost.
- Monitor image bytes per page, formats served and CLS from images.

### Q84. JavaScript delivery architecture
- Differential/modern output (browserslist targeting evergreen browsers; skip legacy polyfills).
- Route-based splitting, vendor/shared chunks tuned for caching, avoid a single huge shared chunk and avoid hundreds of tiny chunks (waterfalls).
- Preload critical chunks (`modulepreload`), prefetch likely next routes (on hover/visibility), use import maps for dedupe in multi-app setups.
- Remove dead code (tree-shaking, `sideEffects`), replace heavy libs, avoid duplicate versions of the same package.
- Track bundle size per route in CI, and **parse/execute time** on a mid-range phone, not just KB.

### Q85. Core Web Vitals in Single-Page Apps (soft navigations)
Browsers measure vitals per **full page load**. In SPAs, route changes (soft navigations) are not reported as new page loads for LCP/FCP, and CLS/INP accumulate over the whole session. Approaches: measure route-change timing yourself (`performance.mark` at click → mark when content is rendered), use framework instrumentation, use the experimental **Soft Navigations** API where available, and consider SSR/MPA for content-heavy sites. In the field, reset or segment CLS/INP by route in your RUM.

### Q86. Strategy for low-end devices and poor networks
Set budgets for a mid-range Android on slow 4G (CPU is usually the bottleneck, not the network). Ship less JS, avoid heavy hydration, use SSR/SSG and server components, adapt loading (`Save-Data`, `effectiveType`, `deviceMemory`) with graceful defaults, avoid heavy animations/shadows, lazy-load below the fold, and test on **real devices** (WebPageTest, remote debugging). Provide a basic experience that works without JS for critical content.

### Q87. Rendering performance in large DOMs
Large DOMs slow style recalculation, layout and memory. Tools: **virtualization**, `content-visibility: auto` with `contain-intrinsic-size`, CSS containment (`contain: layout paint style`), pagination, avoiding deep nesting, and avoiding forced synchronous layouts. Check DevTools → Performance → "Recalculate Style" and "Layout" durations and the number of affected nodes.

### Q88. Scroll and input performance
- Mark touch/wheel/scroll listeners `{ passive: true }` so scrolling is not blocked.
- Use `IntersectionObserver` instead of scroll listeners for visibility; `position: sticky` instead of JS; CSS scroll-driven animations (Chromium) instead of JS scroll animations.
- Keep scroll handlers tiny and rAF-throttled; avoid layout reads in them.
- Use `overscroll-behavior`, `touch-action`, and avoid huge box shadows or filters on scrolling regions.

### Q89. Find and fix memory-related slowdowns
Symptoms: growing memory, increasing GC pauses, slower interactions over time. Use heap snapshots (compare 2–3), the allocation timeline, and "Detached DOM nodes". Typical causes: listeners and timers not removed, retained closures, caches without limits, SPA route components not cleaned up, big arrays kept after use. Verify by repeating an action 50 times and checking whether the heap returns to baseline.

### Q90. Web Workers, OffscreenCanvas, WebAssembly: when to use them
Use **Web Workers** for CPU-heavy, non-DOM work (parsing, search indexing, image processing, crypto). **OffscreenCanvas** lets rendering happen in a worker. **WebAssembly** helps compute-heavy code (codecs, physics, WASM libraries). Costs: message-passing overhead (structured clone; use transferables), worker startup time, extra complexity. **SharedArrayBuffer** requires cross-origin isolation (`COOP: same-origin` + `COEP: require-corp`), which can break third-party embeds.

### Q91. Network protocol details that matter for performance
- **TLS 1.3**: 1-RTT handshake (0-RTT resumption possible but replayable, only for safe requests).
- **OCSP stapling** and small certificate chains reduce handshake bytes.
- **HSTS** (and preload list) avoids the HTTP→HTTPS redirect round trip.
- **HTTP/3 discovery** through `Alt-Svc` or HTTPS DNS records.
- **Connection coalescing** in HTTP/2 (reuse a connection for several hostnames sharing a certificate and IP) — domain sharding is an **anti-pattern** on HTTP/2+.
- **Congestion control** (CUBIC/BBR) and initial window affect slow-start behavior on the server side.

### Q92. Compression and payload strategy beyond gzip
Brotli for text (static at a high level, dynamic at a moderate level), **zstd** content-encoding is supported by newer browsers (check support), compress JSON APIs, send only the fields needed (avoid over-fetching; GraphQL persisted queries or sparse fieldsets), use binary formats (Protobuf, MessagePack) where it pays off, paginate, and deduplicate. Compression dictionaries (shared dictionary compression) are an emerging option.

### Q93. How do you analyze field data correctly?
- Always use **percentiles** (p75 for CWV), never averages.
- Segment by device class, connection, geography, browser, page template, new vs returning, navigation type (`navigate`, `reload`, `back_forward`, `prerender`) and release.
- Beware of **bfcache restores** and **prerenders** that can show near-zero values.
- Understand sampling bias: users who abandon early may never report some metrics (survivorship bias); INP needs interactions.
- Compare against the same definition CrUX uses before comparing with your own RUM numbers.
- Correlate metrics with business outcomes (conversion, bounce, revenue per session).

### Q94. How do you catch and prevent performance regressions?
Layers of defense: (1) **budgets in CI** (bundle size, Lighthouse CI, request counts) with several runs and median values to reduce noise; (2) **synthetic monitoring** on key journeys; (3) **RUM alerts** on p75 changes by release; (4) **canary/gradual rollout** with metric comparison; (5) **ownership** (team per route/component) and a PR template/checklist; (6) fast **bisect** tooling to find the commit; (7) post-incident reviews with prevention actions.

### Q95. A/B testing, tag managers and performance
Client-side experiment scripts and "anti-flicker" snippets often **block rendering** and delay LCP. Prefer server-side or edge-side experimentation, load experiment code asynchronously and inline the minimal assignment logic, keep tag managers governed (review process, limits), and measure the performance impact of each experiment/tag.

### Q96. Tension between SEO, accessibility and performance
Lazy-loading can hide content from crawlers if implemented without proper markup (use native `loading="lazy"` and make links crawlable). CSR-only content may be indexed late; prefer SSR/SSG for content pages. Heavy animation hurts users with vestibular disorders (`prefers-reduced-motion`). Semantic HTML is both lighter and more accessible. Make decisions together, not in isolation.

### Q97. Privacy and security vs performance
`COOP/COEP` enable powerful features but can break embeds. A strict CSP with nonces can reduce cacheability of HTML (nonce per response) — use hashes for static pages. SRI adds integrity but prevents CDN-side changes. Consent banners can delay scripts (good for privacy) but must not cause layout shift or delay LCP. Third-party cookie changes affect tracking scripts and embeds.

### Q98. Video and media performance
Use adaptive streaming (HLS/DASH), choose codecs (H.264 for compatibility, AV1/VP9 for efficiency), set `preload="metadata"` and a `poster`, lazy-load below-the-fold video, replace GIFs with muted looping MP4/WebM, reserve space (aspect-ratio), and avoid autoplaying large video on mobile data. For the LCP element being a video poster, preload the poster.

### Q99. Ads, embeds and consent banners
Reserve fixed slots (`min-height`) to prevent CLS, lazy-load below-the-fold ads, load ad scripts after the main content, limit the number of ad providers, use `loading="lazy"` for iframes, and keep consent banners from shifting layout (overlay or reserved space).

### Q100. Cost and sustainability
Fewer bytes and less compute reduce bandwidth cost, CDN cost and energy use. Image optimization and compression are usually the highest-impact changes. Track bytes per page view and cache hit ratio as cost metrics; set targets with product and finance.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you build a performance culture in an organization? *(Strategy)*
Make performance a **shared, measurable goal**: define SLOs (e.g., "75% of mobile sessions have LCP ≤ 2.5 s and INP ≤ 200 ms"), put dashboards where teams see them, add budgets and checks to CI, make regressions visible and blameless, create a performance guild/champions, include performance in the definition of done, teach (workshops, docs), and celebrate wins with business numbers.

### Q102. How do you define SLIs/SLOs for web performance?
SLIs = the measurements (LCP, INP, CLS, TTFB, error-free page loads, API latency p95); SLOs = targets over a window (e.g., 28 days); error budget = how much badness is allowed before feature work pauses for performance work. Segment SLOs by key journeys (home, search, checkout) and device class, not only by site average.

### Q103. How do you make the business case for performance work?
Tie metrics to outcomes: run A/B tests or compare cohorts (conversion, bounce, session length, SEO traffic, support cost), use industry case studies as supporting evidence only, quantify cost savings (bandwidth, infra), estimate revenue impact conservatively, and present effort vs impact. Propose small, measurable experiments first.

### Q104. Build vs buy for RUM and performance tooling
Buy (SpeedCurve, Datadog RUM, New Relic, Sentry, Vercel/Cloudflare analytics, Akamai mPulse) for speed to value and ready dashboards; build (web-vitals + your own pipeline to a warehouse) for control, privacy and cost at scale. Consider data ownership, sampling, retention, attribution depth, integration with release tracking, and privacy rules (consent, IP handling).

### Q105. Governance for third-party scripts
Create an intake process (owner, purpose, cost estimate, privacy review, performance test), load rules (async/defer, after consent/idle), budgets per tag, quarterly audits, automatic alerts on new domains (CSP report-only / Resource Timing), and a kill switch. Marketing and product must see the performance cost of each tag.

### Q106. Choosing a rendering architecture (CSR/SSR/SSG/ISR/edge/RSC)
Decide per route using: SEO needs, personalization, freshness, interactivity, infra cost, team skills and performance targets. Common outcome: SSG/ISR for marketing and content, SSR/streaming for dynamic SEO pages, CSR for authenticated dashboards, Server Components to reduce client JS, edge for latency-sensitive personalization. Document the decision (ADR) with measured trade-offs.

### Q107. Plan a migration from CSR to SSR/RSC with minimal risk
Pick high-traffic, SEO-critical routes first; keep the old and new paths running behind feature flags; measure before and after (LCP, TTFB, INP, error rate, conversion); fix hydration mismatches; monitor server cost; roll out gradually; keep a rollback path; train the team on the new data-fetching and caching model.

### Q108. Incident response for a performance regression
Detect (alert on p75 change) → assess impact (affected routes/regions/devices) → mitigate quickly (rollback, feature flag off, disable a tag, purge/CDN rule) → find root cause (bisect, diff of release, waterfall comparison) → fix → add a regression test/budget → post-mortem with actions and owners.

### Q109. Balancing feature velocity and performance
Use budgets as guardrails (not as blockers by default), allocate a recurring percentage of capacity for performance work, make "cost of a feature" visible (KB, ms), prefer incremental delivery (lazy-load heavy features), and escalate trade-offs with data to product leadership.

### Q110. How do you decide what to optimize first? (prioritization)
Rank candidate fixes by **impact × reach ÷ effort**: size of the metric gain, share of users affected (traffic by route/device), and engineering cost/risk. Start with "cheap and big" wins: image formats/sizes, compression, caching headers, fixing LCP discovery, removing unused JS and third parties.

### Q111. Hiring and mentoring for performance skills
Interview for: browser rendering knowledge, ability to read a waterfall and a flame chart, caching/CDN understanding, metric definitions, and a clear investigative method. Mentor through pair-profiling sessions, "performance clinics", and examples of real before/after cases from your product.

### Q112. Long-term platform strategy
Invest in a **performance-by-default platform**: starter templates with good defaults (image component, font loading, script loading strategy), shared design-system components with performance budgets, build-time checks, standard RUM instrumentation, a managed CDN configuration, and documentation. Make the fast path the easy path.

---

# 💻 Part 6: Coding / Measurement & Optimization Tasks

### C1. Measure LCP, CLS, long tasks and slow interactions without a library
```js
// LCP
new PerformanceObserver((list) => {
  const e = list.getEntries().at(-1);
  console.log('LCP', Math.round(e.startTime), 'ms', e.element, e.url);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// CLS (session windows: gap < 1s, max 5s)
let cls = 0, windowValue = 0, windowEntries = [];
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.hadRecentInput) continue;
    const first = windowEntries[0], last = windowEntries.at(-1);
    if (windowEntries.length && entry.startTime - last.startTime < 1000 && entry.startTime - first.startTime < 5000) {
      windowValue += entry.value; windowEntries.push(entry);
    } else { windowValue = entry.value; windowEntries = [entry]; }
    cls = Math.max(cls, windowValue);
  }
}).observe({ type: 'layout-shift', buffered: true });

// Long tasks (> 50 ms)
new PerformanceObserver((list) => list.getEntries().forEach((t) => console.log('Long task', Math.round(t.duration), 'ms')))
  .observe({ type: 'longtask', buffered: true });

// Slow interactions (Event Timing)
new PerformanceObserver((list) => list.getEntries().forEach((e) => { if (e.interactionId) console.log(e.name, Math.round(e.duration), 'ms'); }))
  .observe({ type: 'event', durationThreshold: 40, buffered: true });
```
In production use the `web-vitals` library (it handles edge cases such as bfcache, prerender and visibility changes).

### C2. Send vitals reliably to your backend
```js
import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals/attribution';
const queue = new Set();
function add(metric) { queue.add(metric); }
function flush() {
  if (!queue.size) return;
  const body = JSON.stringify([...queue].map((m) => ({ name: m.name, value: m.value, rating: m.rating, id: m.id, nav: m.navigationType, page: location.pathname })));
  (navigator.sendBeacon && navigator.sendBeacon('/vitals', body)) || fetch('/vitals', { method: 'POST', body, keepalive: true });
  queue.clear();
}
[onLCP, onINP, onCLS, onTTFB].forEach((fn) => fn(add));
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
addEventListener('pagehide', flush);
```

### C3. Time your own code with the User Timing API
```js
performance.mark('search:start');
await runSearch();
performance.mark('search:end');
const m = performance.measure('search', 'search:start', 'search:end');
console.log(m.duration);
```
User Timing marks also appear in the DevTools Performance panel (Timings track).

### C4. Make the LCP image discoverable and high priority
```html
<head>
  <link rel="preload" as="image" href="/img/hero-1200.avif" imagesrcset="/img/hero-600.avif 600w, /img/hero-1200.avif 1200w" imagesizes="100vw" fetchpriority="high">
</head>
<body>
  <img src="/img/hero-1200.avif" srcset="/img/hero-600.avif 600w, /img/hero-1200.avif 1200w" sizes="100vw"
       width="1200" height="600" alt="Hero" fetchpriority="high" decoding="async">
</body>
```
No `loading="lazy"` on this image. Keep it as a real `<img>` in the HTML (not a CSS background or JS-inserted).

### C5. Native and custom lazy loading
```html
<img src="p.jpg" alt="..." width="400" height="300" loading="lazy" decoding="async">
```
```js
const io = new IntersectionObserver((entries, obs) => {
  for (const e of entries) if (e.isIntersecting) { e.target.src = e.target.dataset.src; obs.unobserve(e.target); }
}, { rootMargin: '300px' });
document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));
```

### C6. Load a third-party script on first interaction (or idle)
```js
function loadOnInteraction(src, timeout = 8000) {
  let done = false;
  const load = () => {
    if (done) return; done = true;
    const s = document.createElement('script'); s.src = src; s.async = true; document.head.append(s);
  };
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((e) => addEventListener(e, load, { once: true, passive: true }));
  setTimeout(load, timeout);                                    // fallback
}
loadOnInteraction('https://widget.example.com/chat.js');
```

### C7. YouTube facade (lite embed)
```html
<button class="yt" data-id="dQw4w9WgXcQ" aria-label="Play video" style="aspect-ratio:16/9;background:#000 url(/thumb.webp) center/cover"></button>
<script>
document.querySelectorAll('.yt').forEach((btn) => btn.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${btn.dataset.id}?autoplay=1`;
  iframe.allow = 'autoplay; encrypted-media'; iframe.allowFullscreen = true;
  iframe.style.cssText = 'width:100%;height:100%;border:0';
  btn.replaceWith(iframe);
}, { once: true }));
</script>
```
The heavy player loads only after the user clicks.

### C8. Chunk heavy work and yield to the main thread
```js
const yieldToMain = () => ('scheduler' in globalThis && scheduler.yield) ? scheduler.yield() : new Promise((r) => setTimeout(r));
async function processLarge(items, handle) {
  let last = performance.now();
  for (const item of items) {
    handle(item);
    if (performance.now() - last > 40) { await yieldToMain(); last = performance.now(); }
  }
}
```

### C9. Move heavy computation to a Web Worker
```js
// main.js
const worker = new Worker(new URL('./sort.worker.js', import.meta.url), { type: 'module' });
worker.postMessage(bigArray);                 // use transferables for ArrayBuffers: postMessage(buf, [buf])
worker.onmessage = (e) => render(e.data);
// sort.worker.js
self.onmessage = (e) => { const out = [...e.data].sort((a, b) => a - b); self.postMessage(out); };
```

### C10. A small virtualized list
```js
function virtualList(container, items, rowHeight = 40, overscan = 5) {
  const spacer = document.createElement('div');
  spacer.style.cssText = `height:${items.length * rowHeight}px;position:relative`;
  container.style.overflow = 'auto'; container.replaceChildren(spacer);
  let ticking = false;
  const render = () => {
    ticking = false;
    const start = Math.max(0, Math.floor(container.scrollTop / rowHeight) - overscan);
    const end = Math.min(items.length, Math.ceil((container.scrollTop + container.clientHeight) / rowHeight) + overscan);
    const frag = document.createDocumentFragment();
    for (let i = start; i < end; i++) {
      const row = document.createElement('div');
      row.textContent = items[i];
      row.style.cssText = `position:absolute;top:${i * rowHeight}px;height:${rowHeight}px;left:0;right:0`;
      frag.append(row);
    }
    spacer.replaceChildren(frag);
  };
  container.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } }, { passive: true });
  render();
}
```
Only about 20 DOM nodes exist at a time, even for 100,000 items.

### C11. Avoid layout thrashing by batching reads and writes
```js
const reads = [], writes = [];
const read = (fn) => { reads.push(fn); schedule(); };
const write = (fn) => { writes.push(fn); schedule(); };
let scheduled = false;
function schedule() { if (scheduled) return; scheduled = true; requestAnimationFrame(() => { reads.splice(0).forEach((f) => f()); writes.splice(0).forEach((f) => f()); scheduled = false; }); }
// usage
items.forEach((el) => read(() => { const w = el.offsetWidth; write(() => { el.style.width = w + 10 + 'px'; }); }));
```
(This is the idea of the `fastdom` library.)

### C12. Passive, rAF-throttled scroll handling
```js
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { header.classList.toggle('shadow', scrollY > 10); ticking = false; });
}, { passive: true });
```

### C13. Cache headers in Express
```js
import express from 'express';
const app = express();
app.use('/assets', express.static('dist/assets', { immutable: true, maxAge: '1y' }));   // hashed files
app.get('*', (req, res) => {
  res.set('Cache-Control', 'no-cache');                                               // always revalidate HTML
  res.sendFile('dist/index.html', { root: process.cwd() });
});
```

### C14. Nginx: compression, HTTP/2/3 and caching (sketch)
```nginx
server {
  listen 443 ssl; http2 on;
  listen 443 quic reuseport;                       # HTTP/3 (if built with QUIC support)
  add_header Alt-Svc 'h3=":443"; ma=86400';
  gzip on; gzip_types text/css application/javascript application/json image/svg+xml;
  brotli on; brotli_types text/css application/javascript application/json image/svg+xml;   # needs the brotli module
  location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location / { add_header Cache-Control "no-cache"; try_files $uri /index.html; }
}
```

### C15. Pre-compress assets at build time (Vite example)
```js
// vite.config.js
import viteCompression from 'vite-plugin-compression';
export default { plugins: [
  viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  viteCompression({ algorithm: 'gzip', ext: '.gz' }),
] };
```
The server or CDN serves `.br`/`.gz` files directly (no CPU cost per request).

### C16. Service worker: stale-while-revalidate for GET requests
```js
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open('runtime-v1');
    const cached = await cache.match(req);
    const fetching = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
    return cached || fetching;
  })());
});
```

### C17. Prefetch a link on hover or when visible
```js
const prefetched = new Set();
function prefetch(url) {
  if (prefetched.has(url)) return; prefetched.add(url);
  const l = document.createElement('link'); l.rel = 'prefetch'; l.href = url; document.head.append(l);
}
document.addEventListener('pointerenter', (e) => { const a = e.target.closest?.('a[href^="/"]'); if (a) prefetch(a.href); }, { capture: true, passive: true });
```

### C18. Font loading without layout shift
```css
@font-face {
  font-family: 'Inter'; src: url('/fonts/inter-var.woff2') format('woff2'); font-weight: 100 900; font-display: swap;
}
@font-face {                      /* fallback tuned to match Inter's metrics */
  font-family: 'Inter Fallback'; src: local('Arial'); size-adjust: 107%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%;
}
body { font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif; }
```
```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```

### C19. Skip offscreen rendering work
```css
.section { content-visibility: auto; contain-intrinsic-size: auto 800px; }
.card { contain: layout paint style; }
```
`content-visibility: auto` skips layout and paint for offscreen sections. The size hint avoids scrollbar jumps.

### C20. Reserve space to prevent CLS
```css
.hero-img { aspect-ratio: 16 / 9; width: 100%; height: auto; background: #eee; }
.ad-slot { min-height: 250px; }
.skeleton { height: 1.2em; background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%); background-size: 200% 100%; animation: sh 1.2s infinite; }
@keyframes sh { to { background-position: -200% 0; } }
```

### C21. Inline critical CSS and load the rest asynchronously
```html
<style>/* critical CSS: header, hero, fonts */</style>
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/main.css"></noscript>
```

### C22. Route-level code splitting with hover preload
```js
const routes = { '/settings': () => import('./pages/settings.js'), '/reports': () => import('./pages/reports.js') };
document.addEventListener('pointerenter', (e) => {
  const a = e.target.closest?.('a[data-route]'); if (a) routes[a.pathname]?.();   // warm the chunk (cached module)
}, { capture: true, passive: true });
async function navigate(path) { const page = await routes[path](); page.render(document.querySelector('#app')); }
```

### C23. Lighthouse CI in GitHub Actions
```yaml
name: perf
on: [pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
      - run: npx @lhci/cli@latest autorun --config=./lighthouserc.json
```
```json
{ "ci": { "collect": { "staticDistDir": "./dist", "numberOfRuns": 3 },
          "assert": { "assertions": { "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
                                      "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
                                      "resource-summary:script:size": ["error", { "maxNumericValue": 170000 }] } } } }
```

### C24. `Server-Timing` header in Express
```js
app.get('/api/products', async (req, res) => {
  const t0 = performance.now();
  const data = await db.query('SELECT ...');
  const t1 = performance.now();
  res.set('Server-Timing', `db;dur=${(t1 - t0).toFixed(1)}, total;dur=${(performance.now() - t0).toFixed(1)}`);
  res.json(data);
});
```

### C25. bfcache-friendly lifecycle
```js
// ❌ unload blocks bfcache
// window.addEventListener('unload', save);
// ✅
addEventListener('pagehide', (e) => { navigator.sendBeacon('/save', state); });
addEventListener('pageshow', (e) => { if (e.persisted) refreshStaleData(); });     // restored from bfcache
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseVideo(); });
```

### C26. Defer non-urgent work with `requestIdleCallback`
```js
const idle = window.requestIdleCallback ?? ((fn) => setTimeout(() => fn({ timeRemaining: () => 0, didTimeout: true }), 200));
idle(() => { warmCaches(); initAnalytics(); }, { timeout: 3000 });
```

### C27. Responsive, modern-format image markup
```html
<picture>
  <source type="image/avif" srcset="a-400.avif 400w, a-800.avif 800w, a-1600.avif 1600w" sizes="(max-width: 700px) 100vw, 50vw">
  <source type="image/webp" srcset="a-400.webp 400w, a-800.webp 800w, a-1600.webp 1600w" sizes="(max-width: 700px) 100vw, 50vw">
  <img src="a-800.jpg" width="800" height="600" alt="Product photo" loading="lazy" decoding="async">
</picture>
```

### C28. Measure click-to-next-paint manually
```js
button.addEventListener('click', (e) => {
  const start = e.timeStamp;
  requestAnimationFrame(() => setTimeout(() => console.log('click → next paint ≈', Math.round(performance.now() - start), 'ms'), 0));
  doWork();
});
```
This approximates what INP measures for one interaction.

---

# 🐞 Part 7: Debugging Scenarios (Slow-Page Investigations)

### D1. LCP is 5 s on mobile, but TTFB is fine.
Open the Performance panel and identify the LCP element. Likely causes: the LCP image is a CSS background or JS-inserted (discovered late), has `loading="lazy"`, is huge, or CSS/JS blocks rendering. Fixes: real `<img>` in HTML, `fetchpriority="high"` + preload, AVIF/WebP at the right size, inline critical CSS, defer JS, SSR.

### D2. High TTFB (> 1.5 s)
Check the Network panel timing (waiting for server response). Causes: redirects, no CDN or cache miss, slow queries, cold starts, server far from users. Fixes: CDN caching, remove redirects, optimize queries/caching, edge/multi-region, streaming HTML, check `Server-Timing`.

### D3. CLS is 0.3 on article pages.
Use DevTools → Rendering → Layout Shift Regions and the Performance panel "Layout Shifts" track. Causes: images without dimensions, ad/embed slots, late-loaded fonts, banners inserted above content. Fixes: width/height or `aspect-ratio`, reserved slots, font fallback metrics, insert banners as overlays or at reserved space.

### D4. INP is 600 ms on a product listing page.
Record clicking a filter. Look at input delay vs processing vs presentation delay. Causes: a long task from analytics/third party running at the same time, heavy re-render of a large list, layout thrashing, big DOM. Fixes: yield/chunk, virtualize, memoize, debounce filter, move computation to a worker, `startTransition`.

### D5. Lighthouse score is 95 in the lab, but CrUX says "poor".
Lab tests use a fast machine/network and a cold, simple scenario. Field users have slower devices, third-party scripts, logged-in states, long sessions (CLS/INP accumulate). Fix: use RUM to segment by device/country, test with real-device profiles, include logged-in flows, and fix the p75 worst cases.

### D6. Scores differ between runs (noisy results).
Lighthouse variance comes from CPU/network load. Run multiple times (median of 3–5), use CI with consistent hardware, disable extensions, use simulated throttling consistently, avoid running other jobs in parallel.

### D7. JavaScript bundle is 2 MB.
Run a bundle analyzer. Look for duplicates, large libraries, unused locale data, polyfills and moment/lodash full imports. Fixes: code-split routes, dynamic imports for heavy features, replace libraries, tree-shake, dedupe, target modern browsers, load charts/editors on demand.

### D8. Caching does not work (everything is re-downloaded).
Check response headers: missing `Cache-Control`/`ETag`, `no-store` on assets, `Vary: *` or `Vary: Cookie`, query strings that change on each deploy for unchanged files, or the "Disable cache" box checked in DevTools. Use content-hashed filenames and `immutable`.

### D9. After a deploy users see an old version or a broken page.
HTML cached for too long, or old HTML points to deleted hashed assets (404). Fixes: `Cache-Control: no-cache` for HTML, keep old assets for some time, service worker update flow (`skipWaiting` + prompt), version skew handling and chunk-load error recovery (reload once).

### D10. A font flash (FOIT/FOUT) and layout jump on every load.
Add `font-display: swap`, preload the WOFF2, self-host, subset, and use a metric-matched fallback (`size-adjust`). Check that the font request has `crossorigin`.

### D11. "Preload was not used within a few seconds" warning.
The preload URL or `as`/`crossorigin` does not match the actual request, or the resource is not needed on this page. Fix the attributes (fonts need `crossorigin`), or remove the preload.

### D12. Third-party scripts block the main thread (high TBT).
Use the Lighthouse "third-party summary" and the Bottom-Up view grouped by domain. Fixes: load after interaction/idle, use facades, `async/defer`, remove unneeded tags, move to a worker (Partytown), contact the vendor.

### D13. The page janks during scroll.
Check for non-passive scroll listeners, expensive scroll handlers, large box-shadows/filters, `position: fixed` elements that repaint, or layout in handlers. Use the Performance panel "Frames" and Rendering → Paint flashing. Fixes: passive listeners, rAF throttling, `will-change` sparingly, `content-visibility`, simplify effects.

### D14. SPA route changes feel slow.
Measure with `performance.mark` around navigation. Causes: big route chunk (code splitting too coarse), waterfall of API calls, heavy render, no prefetch. Fixes: prefetch routes/data on hover, parallelize requests, skeletons, `startTransition`, server components or loaders.

### D15. Memory keeps growing (tab slows over time).
Take heap snapshots after repeating an action. Look for detached DOM nodes and growing arrays/Maps. Remove listeners and timers on unmount, bound caches, use WeakMap.

### D16. The Back button reloads the page instead of restoring it instantly.
Page is not bfcache-eligible. Check DevTools → Application → Back/forward cache for the reason: `unload` handler, open connection, `Cache-Control: no-store` situation, in-flight fetch, etc. Replace `unload` with `pagehide`.

### D17. Images are huge on mobile.
Missing `srcset`/`sizes`, desktop images served to phones, unoptimized formats. Fix with responsive markup and an image CDN; check the Network panel image sizes vs displayed sizes.

### D18. Compression is missing.
Response lacks `Content-Encoding`. Enable Brotli/gzip on the server/CDN, check the `Accept-Encoding` negotiation, and avoid double compression. Compare transfer size vs resource size in the Network panel.

### D19. The site is fast in one region and slow in another.
No CDN presence or cache misses in that region, a far origin, DNS resolution, or ISP routing issues. Use RUM by country and synthetic tests from multiple locations; add edge caching or regional origin.

### D20. Hydration is slow and the page looks ready but ignores clicks.
Large JS and heavy hydration create long tasks after the HTML is visible (poor INP, "uncanny valley"). Fixes: split components, selective/lazy hydration, islands, server components, reduce client state.

### D21. Layout shift when the cookie banner appears.
The banner is injected into the flow after load. Use an overlay (`position: fixed`) or reserve space, and avoid moving content.

### D22. A/B testing tool delays rendering.
The anti-flicker snippet hides the page until the experiment loads. Move assignment to the server/edge, remove the hide-the-page snippet, or load asynchronously with minimal logic.

### D23. API-heavy page is slow because of waterfalls.
Requests run one after another (A then B then C). Fix: parallelize (`Promise.all`), batch requests, move to a BFF/GraphQL, cache on the server, preload data in the HTML (streaming), prefetch on hover.

### D24. Debug method (say this in interviews)
Measure → find the phase (network, server, render, JS, layout) → reproduce in lab with throttling → change one thing → re-measure (median) → ship behind a flag → compare field p75 → add budget/alert → document.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Is a high Lighthouse score the same as a good ranking signal?
No. Lighthouse is a **lab** test on an emulated device. Google's page experience signal uses **field** Core Web Vitals (CrUX, 75th percentile). A page can score 100 in Lighthouse and still fail in the field (slow real devices, third parties, logged-in states).

### T2. Does `Cache-Control: no-cache` mean "do not cache"?
No. `no-cache` means the response **can be stored**, but it must be **revalidated** (ETag/Last-Modified) before reuse. `no-store` means do not store at all. For HTML on a site with hashed assets, `no-cache` is a good choice.

### T3. Does `async` remove the blocking effect of a script?
Not fully. `async` downloads in parallel, but when it finishes it **executes immediately and pauses HTML parsing** while it runs. A heavy `async` script can still hurt FCP, LCP and INP. For app code use `defer`; for non-critical scripts delay until idle or interaction.

### T4. Is more `preload` always better?
No. Preloads compete for bandwidth and priority. Preloading too many resources can **delay** the important ones. Preload only things that are critical and discovered late (LCP image, key font), and verify they are used.

### T5. Can `loading="lazy"` hurt performance?
Yes, if used on the LCP image or on images in the first viewport: discovery and download are delayed, which worsens LCP. Lazy-load only below-the-fold content.

### T6. With HTTP/2, is bundling dead?
No. HTTP/2 makes many small files cheaper, but each file still has overhead, and **compression works better on larger files**; also module waterfalls (A imports B imports C) add round trips. The best approach is moderate chunking (route-level) with good caching, not thousands of tiny files and not one giant bundle.

### T7. Is domain sharding good?
On HTTP/1.1 it helped (more parallel connections). On HTTP/2/3 it is harmful: extra DNS/TCP/TLS setup and lost prioritization. Use one origin (or few) with multiplexing.

### T8. Why is `Vary: User-Agent` (or `Vary: Cookie`) dangerous for caching?
It creates a separate cached copy per distinct header value, so the CDN hit ratio collapses. Avoid on static assets and public pages; vary only on what really changes the response (`Accept-Encoding`, sometimes `Accept`).

### T9. When is INP measured and what exactly is reported?
INP considers **all** clicks, taps and key presses during the page's whole life. It reports roughly the worst interaction (for pages with many interactions, the highest is ignored once per 50 interactions, close to the 98th percentile). Hover and scroll are not part of INP.

### T10. Does every layout shift count towards CLS?
No. Shifts within **500 ms after a discrete user input** (click, tap, key press) are excluded (`hadRecentInput`). CLS also groups shifts into **session windows** (gap < 1 s, max 5 s) and reports the **worst window**, not the sum of the whole page life.

### T11. Does the LCP element stay the same?
No. LCP is updated as bigger elements appear (a heading first, then a hero image). The final value is the last candidate **before the user interacts** (scroll, click, key press) or the page is hidden. A splash screen or a large spinner could become the LCP element.

### T12. Is an image with `display: none` or `visibility: hidden` an LCP candidate?
No. Only visible elements in the viewport count. Images that are not yet fully loaded do not count until painted.

### T13. Why can a CDN make things slower?
Cache misses go through the edge to the origin (extra hop), poor cache keys (`Vary`, random query strings) reduce hits, a misconfigured TTL, or the CDN POP is far from some users. Check the hit ratio and the `x-cache`/`age` headers.

### T14. Cold cache vs warm cache testing
First visits (cold cache) matter for acquisition and SEO; repeat visits (warm cache) matter for loyalty. Test both. A fast repeat-visit experience may hide a heavy first load.

### T15. Does a service worker always speed things up?
No. It adds a startup cost on navigation (the worker may need to boot), and bad cache strategies can serve stale content or slow responses. Use **navigation preload** for network-first navigations, and measure.

### T16. Can `requestIdleCallback` fail to run?
Yes, on a busy main thread it may starve. Pass a `timeout` option, or use `scheduler.postTask` with a priority. Safari did not support `requestIdleCallback` for a long time; use a fallback.

### T17. `setTimeout(fn, 0)` is not 0 ms
Browsers clamp nested timers to at least 4 ms after several nested calls, and background tabs throttle timers (once per second, and more aggressively after a few minutes). Do not rely on exact timing.

### T18. Does minification replace compression?
No. Minification changes the source text (shorter names, no whitespace); compression (gzip/Brotli) encodes bytes for transfer. Use both.

### T19. Are base64-inlined images a good idea?
Only for tiny assets. Base64 adds ~33% size, bloats HTML/CSS (blocking), and cannot be cached separately. Prefer separate cacheable files or SVG sprites.

### T20. Is `font-display: swap` always the best?
`swap` shows text quickly but may cause a visible font swap and layout shift. `optional` gives the least CLS (the font may not be used on the first visit if slow). Choose based on whether branding or stability matters more, and use metric-matched fallbacks.

### T21. Why is `@import` in CSS slow?
`@import` creates a chain: the browser must download and parse the first stylesheet before discovering the next. Use `<link>` tags or a bundler to inline/concatenate.

### T22. Is TTI (Time to Interactive) still used?
No. Lighthouse removed TTI from scoring (it was unstable). Use TBT (lab) and INP (field). FID is also replaced by INP in Core Web Vitals.

### T23. HTTP/3 is not always faster
On fast, stable networks the difference may be small. HTTP/3 helps most with packet loss, high latency and mobile network changes. Some networks block UDP; browsers fall back to HTTP/2.

### T24. TBT and INP are different
TBT is a **lab** metric: the sum of blocking time (time beyond 50 ms) of long tasks between FCP and TTI-like end. INP is a **field** metric based on real interactions. TBT correlates with INP, but a good TBT does not guarantee a good INP.

### T25. Brotli level and TTFB
Compressing dynamic responses at Brotli level 11 can add hundreds of milliseconds of CPU time and hurt TTFB. Use level 4–5 for dynamic content and level 11 only for pre-compressed static assets.

### T26. Is the browser cache shared across websites?
Since about 2020 (Chrome 86), the HTTP cache is **partitioned** by top-level site. A library loaded from a public CDN (cdnjs, Google Fonts) is **not** shared between different websites anymore. The old "everyone already has jQuery from the CDN cached" advantage is gone; self-hosting is often as fast or faster.

### T27. Does `Cache-Control: no-store` block the back/forward cache?
It has historically made pages ineligible for bfcache in most cases, though browsers are changing the rules. Check your browser's current behavior in DevTools (Application → Back/forward cache) before designing around it.

### T28. Does `position: fixed` or `sticky` hurt scrolling performance?
Often they are composited and cheap, but large fixed elements with shadows/blur filters, or fixed elements that change often, can cause repaints. Test with Paint flashing and the Layers panel.

### T29. Is `will-change` free?
No. Each `will-change: transform` element may get its own GPU layer, using memory. Too many layers cause memory pressure and slowdowns, especially on mobile.

### T30. Can compressing images too much hurt?
Yes: visible artifacts hurt UX and conversions. Choose quality by content type (photos 70–85, UI graphics higher or lossless), and compare visually (SSIM/butteraugli tools or just A/B test).

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Core Web Vitals? | LCP, INP, CLS |
| Good LCP? | ≤ 2.5 s |
| Good INP? | ≤ 200 ms |
| Good CLS? | ≤ 0.1 |
| Good TTFB? | ≤ 0.8 s |
| Good FCP? | ≤ 1.8 s |
| Percentile used for CWV? | 75th |
| What replaced FID? | INP |
| Long task threshold? | > 50 ms |
| Frame time at 60 fps? | ~16.7 ms |
| Data source for field data? | CrUX / RUM |
| Tool for lab audits? | Lighthouse / WebPageTest |
| Best image formats? | AVIF / WebP (+ JPEG fallback), SVG for icons |
| Prevent CLS on images? | `width` + `height` or `aspect-ratio` |
| Boost LCP image priority? | `fetchpriority="high"` + preload |
| Hide offscreen images? | `loading="lazy"` (not for LCP) |
| Script that doesn't block parsing? | `defer` / `async` / `type="module"` |
| Inline small critical CSS? | Yes, aim for ≤ ~14 KB first response |
| Best cache for hashed files? | `max-age=31536000, immutable` |
| Best cache for HTML? | `no-cache` (or short TTL + SWR) |
| Revalidation header pair? | `ETag` / `If-None-Match` |
| Serve stale while updating? | `stale-while-revalidate` |
| Text compression? | Brotli (fallback gzip) |
| Don't compress? | JPEG, PNG, WOFF2, MP4 |
| Reduce DNS+TCP+TLS cost? | `preconnect`, HTTP/2/3, fewer origins |
| HTTP/3 runs on? | QUIC (UDP) |
| HTTP/2 key feature? | Multiplexing |
| Early server hints? | 103 Early Hints |
| Instant next page? | Speculation Rules / prefetch / prerender |
| Instant Back button? | bfcache (avoid `unload` handlers) |
| Avoid layout thrashing by? | Batch reads then writes |
| Animate with? | `transform` / `opacity` |
| Move heavy CPU work to? | Web Worker |
| Show only visible list rows? | Virtualization |
| Keep third parties cheap? | Facades, defer, budgets, audits |
| Make regressions fail builds? | Lighthouse CI + size budgets in CI |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a time you improved Core Web Vitals."
**Sample answer (STAR):**
- **S:** An e-commerce category page had mobile LCP 4.6 s, INP 420 ms, CLS 0.22 (field p75), and conversion was lagging.
- **T:** Reach "good" on all three without a redesign.
- **A:** LCP: converted the hero from a CSS background to an `<img>` with `fetchpriority="high"`, AVIF at the right size, removed lazy-loading on it, inlined critical CSS. INP: found a 300 ms handler from a filter component and a third-party chat script; virtualized the product grid, moved filtering to a worker, delayed chat until interaction. CLS: added aspect-ratio to images and reserved the banner slot.
- **R:** LCP 4.6 → 2.2 s, INP 420 → 160 ms, CLS 0.22 → 0.04; category conversion rose by about 6% in an A/B test.
Tip: say the numbers and the tool (Performance panel, CrUX, web-vitals attribution).

### P2. "How did you reduce JavaScript size?"
Describe the bundle analysis, the biggest offenders (moment locales, full lodash, duplicate React), route-level splitting, replacing libraries, removing polyfills with a modern browserslist, and CI size limits. Numbers: e.g., initial JS 1.2 MB → 310 KB (gzip 340 → 95 KB), TBT -60%.

### P3. "Tell me about a performance regression you caused or investigated."
Example: a marketing tag added an anti-flicker snippet that hid the page, delaying LCP by 1.2 s. You detected it via RUM alert by release, bisected with a synthetic test, removed the snippet, and added a tag-intake review process.

### P4. "How do you convince stakeholders to invest in performance?"
Use field data and business metrics: show bounce/conversion by LCP bucket, estimate impact conservatively, propose a time-boxed experiment, share before/after, and keep the language about customer experience and revenue, not only milliseconds.

### P5. "How do you balance performance with marketing and product requests?"
Budgets and intake: every new script or feature has a cost estimate, load rules and an owner. Offer faster alternatives (server-side tagging, lazy loading, facades). Escalate with data when the cost exceeds the value.

### P6. "How do you debug a performance problem you cannot reproduce locally?"
Use RUM segmentation (device, country, connection), session replay or traces, WebPageTest with matching conditions, throttling, remote device debugging, and server logs/`Server-Timing`. Ask: what differs between the failing and the healthy segment?

### P7. "What is your approach to mobile performance?"
Budgets for a mid-range Android on slow 4G, JS-first diet, SSR/SSG, adaptive loading, real-device testing, and watching CPU time (parse/execute) rather than just bytes.

### P8. "What's the most surprising performance finding you've had?"
Prepare one genuine story: for example "the biggest LCP win was not image compression but discovering the image late because of a client-side render"; or "a 40 KB analytics library cost more main-thread time than our whole app".

---

# 📚 Part 11: Complete Coverage (Classic + Tools + Frameworks + APIs)

## 11A. Classic Web Performance Questions

### K1. List 15 front-end optimization techniques.
Minify, compress (Brotli/gzip), cache (HTTP, CDN, service worker), optimize images (format, size, lazy), responsive images, code splitting, tree shaking, defer/async scripts, critical CSS, remove unused CSS/JS, preconnect/preload, font optimization, reduce third parties, avoid layout thrashing, use `transform`/`opacity` animations, virtualization, Web Workers, HTTP/2/3, SSR/SSG, prefetching, avoid redirects.

### K2. What is the difference between a "reflow" and a "repaint"? Which actions cause reflow?
Reflow = layout recalculation; repaint = redraw without layout. Reflow is triggered by changing geometry (size, position, font), adding/removing elements, window resize, and reading layout properties after a change (`offsetWidth`, `getBoundingClientRect`, `scrollTop`, `getComputedStyle`).

### K3. How do you reduce the number of HTTP requests?
Bundle/inline critical items, use HTTP/2 multiplexing wisely, sprite/inline SVG icons, combine fonts, lazy-load non-critical, cache aggressively, remove unused third parties, use `<picture>` instead of many separate requests.

### K4. What is the "waterfall" and how do you read it?
A timeline of requests in the Network panel. Each row shows queueing, DNS, connect, TLS, request sent, waiting (TTFB), and content download. Look for: long chains (A → B → C), render-blocking resources, large gaps, requests started late, queued requests (too many on the same origin in HTTP/1.1), and low-priority resources loaded too early.

### K5. How does the browser prioritize resources?
Heuristics: CSS in head and blocking scripts are **highest**; fonts and preloaded resources **high**; images in the viewport **high/medium**, offscreen images **low**; `async`/`defer` scripts **low/medium**. `fetchpriority`, `preload`, `loading="lazy"` change priorities. Check the **Priority** column in the Network panel.

### K6. What is the Page Visibility API and why use it?
It tells if the tab is visible (`document.visibilityState`, `visibilitychange`). Use it to pause video/animations/polling when hidden, saving CPU and battery, and to send analytics beacons reliably.

### K7. How do you optimize a long list or table?
Virtualization, pagination, `content-visibility`, avoid per-row heavy components, memoize rows, debounce filters, server-side filtering/sorting, and use stable keys.

### K8. What is perceived performance and how do you improve it?
Skeleton screens, immediate UI feedback, progressive/streamed content, optimistic updates, preloading the next step, animations that hide waits (carefully), and avoiding blank screens or layout jumps.

### K9. What are the typical bottlenecks by layer?
Network (latency, bandwidth, round trips), server (slow queries, no cache), payload (large JS/images), main thread (long tasks, hydration), rendering (layout, paint, large DOM), memory (leaks, GC), third parties (ads, tags), and devices (low CPU).

### K10. What is the difference between "load time" and "time to interactive"?
Load time is when the `load` event fires (all resources finished). Interactivity is when the page reliably responds to input. A page can be "loaded" yet unresponsive because JS is still executing. Modern metrics (INP, TBT) measure responsiveness directly.

## 11B. Tools and What They Are Good For

| Tool | Use |
|---|---|
| **Chrome DevTools** (Network, Performance, Lighthouse, Coverage, Memory, Layers, Rendering) | Debugging and profiling |
| **Lighthouse / Lighthouse CI** | Lab audits, scores, CI budgets |
| **PageSpeed Insights** | CrUX field data + Lighthouse lab |
| **WebPageTest** | Deep waterfalls, real devices/locations, filmstrips, repeat views |
| **CrUX / CrUX Dashboard / BigQuery** | Public field data |
| **web-vitals library** | Collect CWV from real users |
| **RUM vendors** (SpeedCurve, Datadog, New Relic, Sentry, Calibre) | Dashboards, alerts, segmentation |
| **Bundle analyzers** (webpack-bundle-analyzer, source-map-explorer, vite visualizer, size-limit) | JS size |
| **Chrome Tracing / Perfetto** | Browser-level traces |
| **React Profiler** | Component render cost |
| **Chrome UX / Search Console CWV report** | Site-wide groups of URLs failing CWV |

## 11C. Framework-Specific Performance Features

### F1. Next.js
`next/image` (resizing, formats, lazy, priority prop), `next/font` (self-hosted fonts, no layout shift), `next/script` (strategies: `beforeInteractive`, `afterInteractive`, `lazyOnload`, `worker`), App Router with **Server Components** (less client JS), streaming with Suspense, route-level code splitting, ISR/`revalidate`, `next/dynamic`, bundle analyzer, and caching/`fetch` options.

### F2. React
`React.lazy` + `Suspense`, `memo`/`useMemo`/`useCallback` where measured, `startTransition`/`useDeferredValue`, virtualization, avoiding derived state, stable keys, splitting context, React Compiler (automatic memoization, where adopted), Profiler.

### F3. Vue
Async components (`defineAsyncComponent`), `v-once`/`v-memo`, `shallowRef`/`markRaw` for big objects, `<KeepAlive>`, route lazy loading, Nuxt payload extraction and hybrid rendering.

### F4. Angular
`OnPush` change detection, signals, `@defer` blocks (lazy sections), lazy routes, SSR with hydration, `NgOptimizedImage`, trackBy/`track` in `@for`, bundle budgets in `angular.json`.

### F5. Astro / islands and others
Ship zero JS by default, hydrate only interactive islands (`client:visible`, `client:idle`), great for content sites. Similar ideas: Qwik (resumability), Remix/SvelteKit (loaders + progressive enhancement).

### F6. WordPress / CMS sites
Page caching, CDN, image optimization plugins, remove unused plugins, lighter themes, defer/delay scripts, database/object cache (Redis), limit page builders' DOM size.

## 11D. Performance APIs (what exists)

### A1. `PerformanceObserver` entry types
`navigation`, `resource`, `paint`, `largest-contentful-paint`, `layout-shift`, `longtask`, `long-animation-frame` (Chromium), `event`, `first-input`, `element`, `mark`, `measure`, `visibility-state`.

### A2. Navigation Timing: useful fields
```js
const n = performance.getEntriesByType('navigation')[0];
const dns = n.domainLookupEnd - n.domainLookupStart;
const tcp = n.connectEnd - n.connectStart;            // includes TLS if secureConnectionStart > 0
const ttfb = n.responseStart - n.startTime;
const download = n.responseEnd - n.responseStart;
const domReady = n.domContentLoadedEventEnd - n.startTime;
```

### A3. Resource Timing
```js
performance.getEntriesByType('resource')
  .filter((r) => r.transferSize > 100_000)
  .map((r) => ({ url: r.name, kb: Math.round(r.transferSize / 1024), type: r.initiatorType }));
```
`transferSize` is `0` for cross-origin resources unless the server sends `Timing-Allow-Origin`.

### A4. Network Information, Device Memory, Hardware Concurrency
```js
const c = navigator.connection;     // Chromium: effectiveType ('4g', '3g'), downlink, rtt, saveData
const mem = navigator.deviceMemory;       // approximate GB
const cores = navigator.hardwareConcurrency;
```
Use for adaptive loading, with graceful fallbacks (support varies).

### A5. Beacons and `keepalive`
`navigator.sendBeacon(url, data)` and `fetch(url, { keepalive: true })` send data reliably during page unload/hide without blocking navigation.

---

# 🧠 Part 12: Browser Internals

### B1. Multi-process architecture (Chromium)
Main processes: **Browser process** (UI, navigation, permissions), **Renderer processes** (one per site/tab group; runs Blink, V8, layout, paint), **GPU process** (compositing and raster on the GPU), **Network service** (networking stack), and utility processes (audio, storage, etc.). **Site Isolation** puts different sites in different renderer processes (security vs memory trade-off), including out-of-process iframes. A crash in one renderer does not kill the browser.

### B2. Navigation lifecycle
`beforeunload` → browser process starts the request (checks HSTS, cache, service worker) → network service does DNS/connect/TLS/request → response headers arrive → browser process picks (or creates) a renderer and **commits** the navigation → renderer parses HTML, builds the DOM, fetches subresources → first paint → load events. Redirects, service workers and `Cache-Control` all influence this timeline.

### B3. Networking stack and cache lookup order
For a subresource: **memory cache** (per page, very fast) → **service worker** (if any) → **HTTP disk cache** → **network**. The HTTP cache decides freshness from `Cache-Control`/`Expires` (or a heuristic of about 10% of the time since `Last-Modified`), and revalidates stale entries. Since cache partitioning, entries are keyed by **top-level site + resource URL**.

### B4. Sockets and connection management
DNS cache (browser + OS + resolver), socket pools per origin, HTTP/1.1: up to ~6 connections per host; HTTP/2/3: one multiplexed connection per origin (connection coalescing possible). Idle connections are reused (keep-alive). `preconnect` opens sockets early.

### B5. Resource scheduling and priorities
Blink assigns priorities per resource type and position (CSS and sync scripts highest; fonts high; images by visibility; async low). The network layer enforces priority on HTTP/2/3 streams (priority signals). `fetchpriority` and `preload` modify these.

### B6. The preload scanner and HTML parser
The main parser builds the DOM and may block on scripts. A separate **preload scanner** tokenizes the raw HTML ahead and starts fetching `<img>`, `<link>`, `<script>` it finds, so downloads start even while the parser is blocked. Resources discovered only through CSS (`background-image`, `@font-face`, `@import`) or JavaScript are found **later**, which is why they delay LCP.

### B7. Style calculation
The style engine matches selectors (right to left) and computes styles for each element, with invalidation sets to limit recalculation when the DOM or classes change. Cost grows with DOM size and selector complexity; most sites are fine unless they have huge DOMs or heavy `:has()`/descendant patterns.

### B8. Layout (LayoutNG)
Computes sizes and positions for block, inline, flex, grid and table layouts using constraint spaces. Layout is typically **single-threaded on the main thread**. Changes can invalidate a subtree or the whole document (e.g., changing `font-size` on `html`). CSS **containment** (`contain`, `content-visibility`) limits the scope.

### B9. Paint and display lists
Paint turns the layout tree into **paint chunks / display lists** (draw commands such as rect, text, image). It does not draw pixels yet. Paint invalidation is limited to the changed region where possible.

### B10. Compositing and raster
The compositor thread (`cc`) manages layers described by **property trees** (transform, clip, effect, scroll). Layers are split into **tiles**, rasterized (often on the GPU by raster threads), and then composited by the GPU process. Because transform/opacity/scroll are handled on the compositor, they can stay smooth even when the main thread is busy (for scroll only if the scroll handler is passive and not blocked).

### B11. Frame scheduling
The browser aligns work with the display's refresh (VSync). Each frame the scheduler runs: input → `requestAnimationFrame` → style/layout/paint → commit to compositor → draw. If the main thread misses the deadline, frames are dropped (jank). Input events have high priority in the scheduler; long tasks delay them (input delay in INP).

### B12. How V8 and Blink share the main thread
JavaScript runs on the same main thread as style, layout and event dispatch. V8 costs: **parse** (lazy parsing of functions), **compile** (Ignition bytecode, optimizing JIT for hot code), **execute**, and GC. Streaming compilation and code caching reduce repeat costs. For large bundles, parse/compile is a big part of the cost on slow phones.

### B13. Image decoding, font shaping and video
Image decode happens off the main thread (but large images use memory and time). Text shaping needs fonts to be available; missing fonts cause fallback and swap. Video decode uses hardware where available; autoplay policies restrict audio.

### B14. Garbage collection (V8 "Orinoco")
Young generation: fast scavenging (parallel). Old generation: concurrent and incremental marking, parallel sweeping and compaction. Most work happens off the main thread, but pauses still occur; allocation-heavy code increases GC activity.

### B15. Background tabs and the Page Lifecycle
Hidden tabs have throttled timers (about once per second; stronger throttling after several minutes), paused `requestAnimationFrame`, and may be **frozen** or **discarded** to save memory. Use `visibilitychange`, `pagehide`/`pageshow`, and handle restoration (bfcache).

### B16. Service worker internals
A service worker runs in its own thread/process context with a lifecycle: install → waiting → activate; it can be terminated when idle and restarted on events (cold start cost on navigation). **Navigation preload** starts the network request in parallel with SW startup.

### B17. Back/forward cache internals
The browser freezes the entire page (JS heap + DOM) in memory and restores it instantly. It requires the page to be "frozen safely": no `unload` handlers (in most browsers), no pending critical resources, no open connections that cannot be paused, etc. Chrome shows the blocking reasons in DevTools.

### B18. Cache partitioning and its effect
Caches (HTTP, DNS in some cases, sockets, service workers, storage) are keyed by top-level site to reduce cross-site tracking. Consequence: shared CDN libraries are re-downloaded per site; you cannot rely on a cross-site cache hit.

### B19. Security boundaries that influence performance
Site Isolation (more processes, more memory), COOP/COEP for cross-origin isolation (enables `SharedArrayBuffer`, high-resolution timers), Spectre mitigations (timer precision limits), CSP and SRI (extra checks, but small cost), CORS preflights (`OPTIONS` requests add a round trip unless cached with `Access-Control-Max-Age`).

### B20. CORS preflight performance
Non-simple cross-origin requests (custom headers, `PUT`, JSON content type) trigger a preflight `OPTIONS` request before the real request. Reduce impact by serving APIs from the same origin, using simple requests where possible, and setting `Access-Control-Max-Age` (browser caps apply) to cache preflights.

---

# 📋 Part 13: Reference Tables

### R1. Core Web Vitals thresholds (75th percentile)
| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP | ≤ 2.5 s | 2.5–4 s | > 4 s |
| INP | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS | ≤ 0.1 | 0.1–0.25 | > 0.25 |

### R2. Other common metrics
| Metric | Type | Meaning | Good (typical) |
|---|---|---|---|
| TTFB | Field/lab | Time to first byte | ≤ 0.8 s |
| FCP | Field/lab | First text/image painted | ≤ 1.8 s |
| TBT | Lab | Total blocking time (long tasks) | ≤ 200 ms |
| Speed Index | Lab | How quickly content is visually populated | ≤ 3.4 s |
| TTI | Lab (deprecated) | Time to interactive | — |
| FID | Field (replaced by INP) | First input delay | — |
| LoAF | Field/lab (Chromium) | Long animation frames with script attribution | frame < 50 ms |

### R3. Lighthouse performance score weights (recent versions)
FCP 10% · Speed Index 10% · LCP 25% · TBT 30% · CLS 25% (weights can change between Lighthouse versions).

### R4. Resource hints
| Hint | Purpose | Priority |
|---|---|---|
| `dns-prefetch` | Resolve DNS early | Low |
| `preconnect` | DNS + TCP + TLS early | Medium |
| `preload` | Fetch a needed resource now | High |
| `modulepreload` | Fetch and parse an ES module | High |
| `prefetch` | Fetch for the next navigation | Lowest (idle) |
| `prerender` / Speculation Rules | Render the next page | Optional / eager levels |
| `fetchpriority` | Adjust priority of a request | Hint |

### R5. `Cache-Control` directives
| Directive | Effect |
|---|---|
| `max-age=N` | Fresh for N seconds (browser and shared) |
| `s-maxage=N` | Fresh for shared caches (CDN) |
| `no-cache` | Store, but always revalidate |
| `no-store` | Do not store |
| `private` | Browser only |
| `public` | Any cache may store |
| `immutable` | Will not change; skip revalidation |
| `must-revalidate` | Do not serve stale after expiry |
| `stale-while-revalidate=N` | Serve stale and refresh in the background |
| `stale-if-error=N` | Serve stale if origin errors |

### R6. HTTP versions
| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC (UDP) |
| Multiplexing | No (multiple connections) | Yes | Yes |
| Head-of-line blocking | At HTTP level | At TCP level | Per stream only |
| Header compression | No | HPACK | QPACK |
| Handshake | TCP + TLS | TCP + TLS | Combined QUIC + TLS 1.3 |

### R7. Compression options
| Method | Notes |
|---|---|
| gzip | Universal, fast |
| Brotli (`br`) | Smaller than gzip for text; best for static pre-compression |
| zstd | Newer, good speed/ratio; check browser support |
| None for | JPEG, PNG, WOFF2, MP4, ZIP |

### R8. Image formats
| Format | Best for | Notes |
|---|---|---|
| JPEG | Photos (universal) | Lossy |
| PNG | Lossless graphics, transparency | Large for photos |
| WebP | Photos and graphics, alpha, animation | Widely supported |
| AVIF | Best compression for photos | Slower encode, wide support |
| JPEG XL | High quality | Browser support limited/changing |
| SVG | Icons, logos, illustrations | Vector; sanitize if user-provided |
| GIF | Avoid | Use MP4/WebM or animated WebP/AVIF |

### R9. What each CSS change triggers
| Triggers | Examples |
|---|---|
| Layout + paint + composite | `width`, `height`, `margin`, `padding`, `top`, `left`, `display`, `font-size` |
| Paint + composite | `color`, `background`, `box-shadow`, `border-radius`, `visibility` |
| Composite only | `transform`, `opacity` (usually) |

### R10. Script loading attributes
| | Download | Execute | Order |
|---|---|---|---|
| none | Blocks parsing | Immediately | In order |
| `async` | Parallel | When ready (pauses parser) | Not guaranteed |
| `defer` | Parallel | After parse, before `DOMContentLoaded` | In order |
| `type="module"` | Parallel | Deferred by default | In order of dependency graph |

### R11. DevTools panels at a glance
| Panel | Question it answers |
|---|---|
| Network | What loads, when, how big, with what priority and cache status? |
| Performance | What runs on the main thread and when? Which tasks are long? |
| Lighthouse | What does an automated audit recommend? |
| Coverage | How much CSS/JS is unused? |
| Memory | What retains memory? Is there a leak? |
| Layers | How many compositing layers and why? |
| Rendering | Where are paints, layout shifts, FPS? |
| Application | Service worker, cache storage, bfcache status |

### R12. Typical performance budgets (starting points)
| Item | Budget |
|---|---|
| Initial JS (gzip) | ≤ 150–200 KB |
| Initial CSS (gzip) | ≤ 50–70 KB |
| Hero image | ≤ 100–150 KB |
| Total page weight (mobile) | ≤ 1–1.5 MB |
| Requests above the fold | ≤ 30–50 |
| LCP / INP / CLS | ≤ 2.5 s / ≤ 200 ms / ≤ 0.1 |
(Budgets depend on audience and device mix; set them from your own field data.)

### R13. Rendering strategies
| Strategy | TTFB | FCP/LCP | Interactivity | Best for |
|---|---|---|---|---|
| CSR | Fast | Slow (needs JS) | After JS | Authenticated apps |
| SSR | Slower (server work) | Fast | After hydration | Dynamic + SEO |
| SSG | Fastest (CDN) | Fast | After hydration | Content sites |
| ISR | Fast (cached) | Fast | After hydration | Large content catalogs |
| Streaming SSR | Fast first byte | Progressive | Selective hydration | Slow data sources |
| Islands / RSC | Fast | Fast | Minimal JS | Mostly static + some interactivity |

### R14. Status codes that matter for performance
`200` OK · `204` No Content · `301/308` permanent redirect (cached; avoid chains) · `302/307` temporary redirect · `304` Not Modified (revalidation hit) · `404`/`410` · `429` rate limited · `503` unavailable (use `Retry-After`) · `103` Early Hints.


---

# 🧩 Part 14: Calculations & Prediction Questions

> Interviewers often ask you to **calculate or predict**: round trips, frame budgets, CLS, percentiles. Show the formula, then the number.

### O1. How many round trips before the first byte on a cold HTTPS connection (TLS 1.3, TCP)?
**Answer:** DNS (1 RTT) + TCP handshake (1 RTT) + TLS 1.3 handshake (1 RTT) + HTTP request/response (1 RTT) = **4 RTT** to receive the first byte. With a 100 ms RTT (simplified): about **400 ms**.

### O2. What if the server uses TLS 1.2?
TLS 1.2 needs 2 RTT for the handshake, so the total is DNS 1 + TCP 1 + TLS 2 + HTTP 1 = **5 RTT** ≈ **500 ms** at 100 ms RTT. That is why TLS 1.3 matters.

### O3. And with HTTP/3 (QUIC)?
DNS 1 + QUIC handshake (transport + TLS combined) 1 + HTTP 1 = **3 RTT** ≈ **300 ms**. With 0-RTT resumption to a known server the request can be sent with the first flight (saving another RTT, with replay-safety limits).

### O4. A page on a warm connection (HTTP/2, connection already open) needs how long for the first byte?
Just the request/response: **1 RTT** (+ server time) ≈ 100 ms. This is why connection reuse and `preconnect` help.

### O5. How many TCP round trips does a 60 KB (compressed) HTML response need on a new connection?
The initial congestion window is about 10 segments ≈ **14.6 KB**, and it roughly doubles each round trip in slow start.
- Flight 1: 14.6 KB (cumulative 14.6 KB)
- Flight 2: 29.2 KB (cumulative 43.8 KB)
- Flight 3: 58.4 KB (cumulative 102 KB, enough)
**3 flights**, so about 2 extra round trips after the first flight. A 14 KB response would fit in the first flight.

### O6. What is the frame budget at 60 Hz, 120 Hz and 144 Hz?
`1000 ms / refresh rate`: 60 Hz = **16.7 ms**, 120 Hz = **8.3 ms**, 144 Hz = **6.9 ms**. The browser needs part of that budget for its own work, so your JS + style + layout + paint must be well under the number.

### O7. Calculate a layout shift score.
An element takes up **50%** of the viewport height and moves down by **25%** of the viewport height.
- Impact fraction = area covered by the element **before and after** the move = 50% + 25% = **0.75**.
- Distance fraction = move distance ÷ largest viewport dimension = **0.25**.
- Score = 0.75 × 0.25 = **0.1875** (already "poor" if this is the page's worst window).

### O8. Calculate CLS from several shifts (session windows).
Shifts: t = 0.5 s → 0.05; t = 1.2 s → 0.04; t = 2.1 s → 0.03; t = 3.6 s → 0.10.
- Window 1: shifts at 0.5, 1.2, 2.1 (each gap < 1 s, total span < 5 s): 0.05 + 0.04 + 0.03 = **0.12**.
- Gap from 2.1 to 3.6 s is 1.5 s (> 1 s) → new window 2: **0.10**.
- CLS = the **largest window** = **0.12**.

### O9. Find INP from a list of interactions.
Interactions (ms): 100, 150, 120, 800, 90 (5 interactions).
**Answer:** With fewer than 50 interactions, INP is the **worst** one: **800 ms** (poor). With 100 interactions, one outlier per 50 is ignored, so INP would be the **3rd highest** value.

### O10. Calculate Total Blocking Time.
Main-thread tasks between FCP and the end of the measured window: 30 ms, 60 ms, 120 ms, 45 ms.
Long tasks are those over 50 ms: 60 and 120. Blocking time = (60 − 50) + (120 − 50) = 10 + 70 = **80 ms**.

### O11. Average vs p75
LCP samples (s): 1.2, 1.5, 1.8, 2.1, 2.3, 2.4, 2.6, 3.1, 3.9, 5.2.
- Average = 26.1 / 10 = **2.61 s** (looks "needs improvement" only barely).
- p75 (nearest-rank: rank = ceil(0.75 × 10) = 8) = the 8th value = **3.1 s** → **needs improvement**, and 25% of users wait at least 3.1 s.
**Lesson:** averages hide the slow tail; use percentiles.

### O12. Download time for a script bundle
A 2 MB JS file on a 1.6 Mbps connection (slow 4G-like): 2 MB × 8 = 16 Mb ÷ 1.6 Mbps = **10 s** (ignoring overhead). Compressed to 600 KB: 4.8 Mb ÷ 1.6 = **3 s**. On a 10 Mbps connection: 1.6 s and 0.48 s. Then add parse/compile/execute time, which depends on the CPU.

### O13. CDN hit ratio effect
1,000,000 requests/day. Hit ratio 95% → **50,000** reach the origin. Hit ratio 98% → **20,000** (a **60%** reduction in origin load).

### O14. Which of these triggers layout, paint-only, or composite-only?
`transform: translateX(10px)`, `background-color`, `width`, `opacity`, `box-shadow`, `margin-top`, `left` (on a positioned element).
**Answer:** `transform` → composite only; `opacity` → composite only; `background-color` → paint; `box-shadow` → paint; `width`, `margin-top`, `left` → **layout** (then paint and composite).

### O15. Script execution order
Scripts: A is `async` (downloads in 300 ms), B is `defer` (100 ms), C is `defer` (200 ms). HTML parsing finishes at 150 ms.
**Timeline:** B is ready at 100 ms but waits for parsing to finish: runs at **150 ms**. C is ready at 200 ms: runs at **200 ms**, right after B (deferred scripts run in order). `DOMContentLoaded` fires after C. A (async) arrives at 300 ms and runs then. Order: **B, C, A**.

### O16. What does the preload scanner find?
```html
<link rel="stylesheet" href="app.css">
<img src="a.jpg">
<script src="app.js"></script>
<script>document.body.append(Object.assign(new Image(), { src: 'b.jpg' }));</script>
```
(and `app.css` contains `.hero { background: url(c.jpg) }` and `@font-face { src: url(f.woff2) }`).
**Answer:** The scanner finds `app.css`, `a.jpg` and `app.js` immediately. `b.jpg` is found only after the inline script **runs**. `c.jpg` and `f.woff2` are found only after `app.css` is downloaded and the CSS is matched to the page (and the font only when text that uses it is laid out). That is why CSS/JS-discovered LCP images are slow.

### O17. Cache behavior prediction
Response: `Cache-Control: max-age=60` with an `ETag`. The user navigates to the page again 30 s later and then 90 s later.
**Answer:** After 30 s the entry is **fresh**, so no request is sent. After 90 s it is **stale**, so the browser sends `If-None-Match`. If unchanged the server returns **304** with no body, and the entry becomes fresh again.

### O18. Reload types
After a normal navigation, a regular reload (F5) and a hard reload (Ctrl+Shift+R), which use the cache?
**Answer:** Normal navigation uses fresh cache entries without a request. A regular reload revalidates the main document (and uses the cache rules for subresources as defined by the browser). A hard reload **bypasses** the cache for the page and its subresources.

### O19. Estimate the impact of removing a 120 KB (gzip) script
Rule of thumb on a mid-range phone: JS costs download + parse/compile + execute; 120 KB gzip is roughly 350–450 KB uncompressed JS, which can take **hundreds of milliseconds** of main-thread time on a low-end device. Measure with CPU throttling instead of guessing.

### O20. Predict the waterfall problem
A page loads `index.html` → `main.js` → (after execution) `fetch('/api/user')` → (after response) `fetch('/api/orders?user=1')` → renders.
**Answer:** A **request waterfall**: 4 sequential steps, so the total time is the sum. Improve by: server-render the data, preload `/api/user` data in the HTML, make `/api/orders` independent of the user id on the client (or fetch in parallel/from the server), and use HTTP caching.

---

# ✅ Part 15: MCQs

1. Which metric replaced FID in Core Web Vitals? → **INP**
2. Which percentile is used to assess CWV? → **75th**
3. What is a "good" LCP? → **≤ 2.5 s**
4. What is a "good" CLS? → **≤ 0.1**
5. What is a long task? → **A task longer than 50 ms**
6. What does TTFB measure? → **Time to the first byte of the response**
7. Which is a lab tool? → **Lighthouse**
8. Which is a field data source? → **CrUX**
9. What does `defer` do? → **Runs the script after HTML parsing, in order**
10. What does `async` do? → **Runs the script as soon as downloaded (order not guaranteed)**
11. Which attribute prioritizes an image fetch? → **`fetchpriority="high"`**
12. Which hint opens a connection early? → **`preconnect`**
13. Which hint fetches a resource for the next page? → **`prefetch`**
14. Which cache directive forces revalidation but allows storing? → **`no-cache`**
15. Which directive prevents storing at all? → **`no-store`**
16. Which header supports conditional requests with a hash? → **`ETag` / `If-None-Match`**
17. What status code means "Not Modified"? → **304**
18. What is the best cache setting for hashed static files? → **`public, max-age=31536000, immutable`**
19. What does `stale-while-revalidate` do? → **Serves stale content immediately and refreshes in the background**
20. Which protocol runs on QUIC? → **HTTP/3**
21. Which feature lets many requests share one TCP connection? → **HTTP/2 multiplexing**
22. What is the typical initial TCP congestion window? → **About 10 segments (~14 KB)**
23. What is the best way to prevent layout shift from images? → **Set width/height or `aspect-ratio`**
24. Which images should NOT be lazy-loaded? → **The LCP / above-the-fold image**
25. Which properties are composite-only? → **`transform` and `opacity`**
26. What is layout thrashing? → **Alternating DOM reads and writes causing repeated reflows**
27. What does `content-visibility: auto` do? → **Skips rendering work for offscreen content**
28. What is the purpose of a Web Worker? → **Run JS off the main thread**
29. What is virtualization? → **Rendering only visible list items**
30. Which API reports slow animation frames with script attribution? → **Long Animation Frames (LoAF)**
31. Which API collects LCP in code? → **`PerformanceObserver` with `largest-contentful-paint`**
32. Which library collects CWV in the field? → **`web-vitals`**
33. Which header lets the server show timings in DevTools/RUM? → **`Server-Timing`**
34. What blocks bfcache in many browsers? → **`unload` event handlers**
35. Which event tells you a page was restored from bfcache? → **`pageshow` with `persisted = true`**
36. What does Brotli generally do compared to gzip? → **Compresses text smaller (at higher CPU cost at high levels)**
37. Which files should not be compressed again? → **JPEG, PNG, WOFF2, MP4**
38. Which rendering strategy has the fastest TTFB with a CDN? → **SSG**
39. What is hydration? → **Attaching JS behavior to server-rendered HTML**
40. Which approach reduces client JS most? → **Server Components / islands**
41. What is the effect of cache partitioning? → **Shared CDN libraries are not shared across sites**
42. What is 103 Early Hints used for? → **Letting the browser preload resources while the server builds the response**
43. Which technique shows content before data arrives? → **Skeleton screens / streaming**
44. What is the main purpose of a performance budget? → **Prevent regressions by setting limits enforced in CI**
45. Which tool shows unused CSS/JS? → **DevTools Coverage**
46. Which DevTools panel finds memory leaks? → **Memory (heap snapshots)**
47. What is the frame time for 60 fps? → **~16.7 ms**
48. Which is the biggest cost on low-end phones, bytes of JS or images? → **JS (download + parse + execute)**
49. What usually delays an LCP image that is a CSS background? → **Late discovery (CSS must download and apply first)**
50. Which is better for repeat Back/Forward navigation? → **bfcache**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are the mistakes teams make again and again with web performance. Interviewers ask: *"What is wrong with this setup?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Optimizing without measuring
**❌ Wrong:** "Let's add memoization everywhere and compress images" before looking at any data.
**🤔 Why it is a problem:** You may spend weeks on things that do not affect the user, and you cannot prove improvement.
**✅ Correct:** Pick the failing metric from field data, reproduce in the lab, find the phase (network, server, render, JS), fix, and measure again.
**💬 Say:** "Measure first, change one thing, measure again."

---

### Mistake 2: Chasing the Lighthouse score instead of real users
**❌ Wrong:** Celebrating a 100 score while CrUX shows poor INP.
**🤔 Why it is a problem:** Lighthouse is a lab run on a simulated device. Real users have slower phones, third parties and long sessions.
**✅ Correct:** Use field data (CrUX/RUM, p75) for goals, and lab data for debugging.
**💬 Say:** "Lighthouse tells me why; field data tells me whether it matters."

---

### Mistake 3: Lazy-loading the hero (LCP) image
**❌ Wrong:**
```html
<img src="hero.jpg" loading="lazy" alt="Hero">
```
**🤔 Why it is a problem:** The browser delays the most important image, so LCP gets worse.
**✅ Correct:**
```html
<img src="hero.avif" width="1200" height="600" alt="Hero" fetchpriority="high" decoding="async">
```
**💬 Say:** "Lazy-load below the fold only; prioritize the LCP image."

---

### Mistake 4: Images without dimensions
**❌ Wrong:**
```html
<img src="product.jpg" alt="Product">
```
**🤔 Why it is a problem:** The browser does not know the size until the image loads, so content jumps (CLS).
**✅ Correct:**
```html
<img src="product.jpg" width="600" height="400" alt="Product">
```
```css
img { max-width: 100%; height: auto; }
```
**💬 Say:** "I always reserve space for media."

---

### Mistake 5: Serving huge, unoptimized images
**❌ Wrong:** A 4000×3000 JPEG (3 MB) shown in a 400×300 slot.
**🤔 Why it is a problem:** Wasted bandwidth and decode time; poor LCP, especially on mobile data.
**✅ Correct:** Resize to the displayed size (with `srcset`), use AVIF/WebP, compress, and serve through an image CDN.
**💬 Say:** "Images are usually the biggest bytes, so I fix them first."

---

### Mistake 6: Render-blocking CSS and synchronous scripts in `<head>`
**❌ Wrong:**
```html
<script src="analytics.js"></script>
<script src="big-bundle.js"></script>
<link rel="stylesheet" href="everything.css">
```
**🤔 Why it is a problem:** The browser cannot paint until CSS is ready, and synchronous scripts stop HTML parsing.
**✅ Correct:**
```html
<style>/* critical CSS */</style>
<link rel="stylesheet" href="main.css" media="print" onload="this.media='all'">
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
```
**💬 Say:** "Inline critical CSS, defer the rest."

---

### Mistake 7: Preloading everything
**❌ Wrong:** Ten `<link rel="preload">` tags for images, scripts and fonts "to be safe".
**🤔 Why it is a problem:** Preloads compete with each other and with really critical resources, and unused preloads waste bandwidth.
**✅ Correct:** Preload only the LCP image and 1–2 critical fonts/scripts that are discovered late, and verify they are used.
**💬 Say:** "Priority is relative: if everything is high, nothing is."

---

### Mistake 8: Wrong caching for HTML and assets
**❌ Wrong:**
```http
Cache-Control: max-age=31536000      # on index.html
Cache-Control: no-store              # on all JS and CSS
```
**🤔 Why it is a problem:** Long-cached HTML means users never see new deployments; `no-store` on assets forces re-downloads on every visit.
**✅ Correct:**
```http
# hashed assets (app.3f9a.js)
Cache-Control: public, max-age=31536000, immutable
# HTML
Cache-Control: no-cache
```
**💬 Say:** "Immutable assets, revalidated HTML."

---

### Mistake 9: No compression (or compressing the wrong things)
**❌ Wrong:** Sending uncompressed JS/CSS/JSON, or gzipping JPEGs.
**🤔 Why it is a problem:** 3–5x more bytes for text; wasted CPU for already-compressed files.
**✅ Correct:** Enable Brotli (and gzip fallback) for text types; pre-compress static files at a high level; skip images/fonts (WOFF2)/video.
**💬 Say:** "Compress text, not already-compressed binaries."

---

### Mistake 10: Letting third-party scripts pile up
**❌ Wrong:** Tag manager with 25 tags loaded synchronously by marketing.
**🤔 Why it is a problem:** Each tag adds requests and main-thread time. You do not control their performance.
**✅ Correct:** An intake process, `async`/`defer`, load after consent/idle/interaction, facades for embeds, a budget, and regular audits.
**💬 Say:** "Every third party must justify its cost."

---

### Mistake 11: Long tasks that block the main thread
**❌ Wrong:**
```js
button.onclick = () => { for (const row of hugeData) heavy(row); render(); };    // 600 ms freeze
```
**🤔 Why it is a problem:** The page cannot respond, so INP is bad.
**✅ Correct:**
```js
button.onclick = async () => { for (const chunk of chunks(hugeData, 200)) { chunk.forEach(heavy); await scheduler.yield?.() ?? await new Promise(r => setTimeout(r)); } render(); };
// or move heavy() to a Web Worker
```
**💬 Say:** "Keep tasks under 50 ms and yield between chunks."

---

### Mistake 12: Layout thrashing
**❌ Wrong:**
```js
items.forEach((el) => { el.style.height = el.offsetHeight + 10 + 'px'; });   // read, write, read, write...
```
**🤔 Why it is a problem:** Each read forces a synchronous layout after the previous write.
**✅ Correct:**
```js
const heights = items.map((el) => el.offsetHeight);       // all reads
items.forEach((el, i) => { el.style.height = heights[i] + 10 + 'px'; });   // all writes
```
**💬 Say:** "Batch reads, then writes."

---

### Mistake 13: Animating layout properties
**❌ Wrong:**
```css
.menu { transition: left .3s, width .3s; }
```
**🤔 Why it is a problem:** `left` and `width` trigger layout each frame, so animations stutter on low-end devices.
**✅ Correct:**
```css
.menu { transition: transform .3s, opacity .3s; }
.menu.open { transform: translateX(0); }
```
**💬 Say:** "I animate `transform` and `opacity`."

---

### Mistake 14: Shipping huge JavaScript bundles
**❌ Wrong:** `import _ from 'lodash'`, `import moment from 'moment'` with all locales, one 2 MB bundle for all routes.
**🤔 Why it is a problem:** Download, parse and execute cost grows; low-end phones suffer most.
**✅ Correct:** Route-level code splitting, `import debounce from 'lodash/debounce'` or native code, `date-fns`/`dayjs`/`Intl`, bundle analyzer, modern browserslist, remove unused code.
**💬 Say:** "I ship less JavaScript, and I measure parse/execute time, not only KB."

---

### Mistake 15: Ignoring mobile CPU and slow networks
**❌ Wrong:** Testing only on a developer laptop with fiber internet.
**🤔 Why it is a problem:** The median user may have a mid-range Android phone and a congested network.
**✅ Correct:** Use CPU 4–6x throttling, Slow 4G, a real device, and field data segmented by device.
**💬 Say:** "I design for the p75 device, not my own laptop."

---

### Mistake 16: Using `unload` handlers
**❌ Wrong:**
```js
window.addEventListener('unload', sendAnalytics);
```
**🤔 Why it is a problem:** It disables the back/forward cache in many browsers and is unreliable on mobile.
**✅ Correct:**
```js
addEventListener('pagehide', () => navigator.sendBeacon('/log', data));
document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
```
**💬 Say:** "I use `pagehide`/`visibilitychange` to keep bfcache working."

---

### Mistake 17: Cache-busting everything or breaking CDN cache keys
**❌ Wrong:** `app.js?v=${Date.now()}` on every request; `Vary: Cookie` on static files.
**🤔 Why it is a problem:** No cache hits; the CDN stores a copy per cookie or timestamp and the origin gets hammered.
**✅ Correct:** Content-hashed filenames, stable cache keys, no cookies on static assets, `Vary: Accept-Encoding` only.
**💬 Say:** "Cache key discipline decides the hit ratio."

---

### Mistake 18: CSS `@import` chains and unused CSS
**❌ Wrong:**
```css
@import url('base.css');
@import url('theme.css');
```
**🤔 Why it is a problem:** Each import is discovered only after the previous CSS arrives (a waterfall), and large unused CSS blocks rendering.
**✅ Correct:** Bundle CSS, use `<link>` tags, purge unused styles (Coverage tab, PurgeCSS/Tailwind JIT), split by route.
**💬 Say:** "No `@import` waterfalls, and no CSS that nobody uses."

---

### Mistake 19: Bad font loading
**❌ Wrong:** Loading 6 font files from a third-party CDN, no `font-display`, no preload.
**🤔 Why it is a problem:** Invisible text (FOIT), late swaps (CLS) and extra connections.
**✅ Correct:** Self-host WOFF2, subset, 1–2 weights or a variable font, `font-display: swap`/`optional`, preload the key font, fallback with `size-adjust`.
**💬 Say:** "Fonts are part of the critical path, so I treat them carefully."

---

### Mistake 20: Looking at averages instead of percentiles
**❌ Wrong:** "Our average LCP is 2.2 s, so we are fine."
**🤔 Why it is a problem:** Averages hide the slow tail. CWV uses p75; many users may be much slower.
**✅ Correct:** Report p75 (and p90/p95), segmented by device, country and page type.
**💬 Say:** "I report percentiles and segments."

---

### Mistake 21: Premature micro-optimizations
**❌ Wrong:** Wrapping every component in `React.memo`, converting loops to `for` for "speed", while the page ships a 3 MB hero image.
**🤔 Why it is a problem:** Adds complexity and bugs, while the real bottleneck remains.
**✅ Correct:** Profile, fix the biggest cost first (bytes, round trips, long tasks), and optimize code only when the profile points to it.
**💬 Say:** "Big wins first: bytes, requests, rendering path, then code details."

---

### Mistake 22: Request waterfalls in the data layer
**❌ Wrong:**
```js
const user = await getUser();
const orders = await getOrders(user.id);
const recs = await getRecs(user.id);      // sequential even though independent of orders
```
**🤔 Why it is a problem:** Total time is the sum of all requests.
**✅ Correct:**
```js
const user = await getUser();
const [orders, recs] = await Promise.all([getOrders(user.id), getRecs(user.id)]);
```
Better: fetch on the server (SSR/loaders), batch requests, and prefetch on hover.
**💬 Say:** "I look at the waterfall and parallelize independent work."

---

### Mistake 23: No performance budget or regression check
**❌ Wrong:** Fixing performance once, then letting it slowly degrade release after release.
**🤔 Why it is a problem:** Performance debt grows silently until the next crisis.
**✅ Correct:** Lighthouse CI/size-limit budgets in CI, RUM alerts by release, ownership, and a regression review process.
**💬 Say:** "Performance is a feature that needs guardrails."

---

### Mistake 24: Heavy hydration of mostly static pages
**❌ Wrong:** A content page shipped as a full client-side React app with hydration of every component.
**🤔 Why it is a problem:** Large JS and long tasks after the page looks ready cause poor INP and wasted battery.
**✅ Correct:** SSG/SSR with islands or Server Components, hydrate only interactive parts, lazy hydration on visibility.
**💬 Say:** "Don't hydrate what doesn't need to be interactive."

---

### Mistake 25: Not testing the cache and back/forward behavior
**❌ Wrong:** Only testing "first load with cache disabled".
**🤔 Why it is a problem:** Real users have repeat visits, Back button usage and cached assets; those paths have their own bugs and big wins.
**✅ Correct:** Test cold and warm cache, reload types, offline/slow modes, and bfcache (DevTools → Application).
**💬 Say:** "I test first-visit, repeat-visit and Back-button flows."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you answer. A junior lists tips ("compress images"). A senior shows a **method**, understands the **browser**, uses **numbers** and thinks about **prevention**.
> **What should you do?** Practice the "Strong" style for every question.

### Signal 1: You follow a measurement-driven method
| | Example answer |
|---|---|
| ❌ Weak | "I would compress images and minify files." |
| ✅ Strong | "First I identify the failing metric in field data, segmented by device and page. Then I reproduce with CPU and network throttling and decompose the metric: for LCP I check TTFB, resource load delay, load duration and render delay. I change one thing, re-measure the median, ship behind a flag, compare p75 in production and add a budget." |
**Prove it:** mention CrUX/RUM, the LCP breakdown, throttling, median of runs.

### Signal 2: You know how the browser really works
| | Example answer |
|---|---|
| ❌ Weak | "JS is slow, so we reduce it." |
| ✅ Strong | "The main thread runs JS, style, layout and paint, so a long task delays input (input delay in INP). The preload scanner finds `<img>` and `<script>` in HTML early but not background images or JS-inserted resources, so those hurt LCP. `transform` and `opacity` can be handled by the compositor, so they stay smooth when the main thread is busy." |
**Prove it:** pipeline stages, preload scanner, compositor, frame budget.

### Signal 3: You understand caching end to end
| | Example answer |
|---|---|
| ❌ Weak | "We use a CDN." |
| ✅ Strong | "Hashed assets are `immutable` for a year; HTML is `no-cache` with ETag, and cacheable at the CDN with `s-maxage` + `stale-while-revalidate` plus purge on deploy. I keep cache keys clean (no `Vary: Cookie`), watch the hit ratio, and remember the browser cache is partitioned by site." |
**Prove it:** `Cache-Control` directives, `304`, cache keys, partitioning.

### Signal 4: You talk about INP, not just load time
| | Example answer |
|---|---|
| ❌ Weak | "We made the page load faster." |
| ✅ Strong | "Our INP was 420 ms. The Performance panel showed input delay from a third-party chat script and a 300 ms render from a large list. We virtualized the list, moved filtering to a worker, delayed the chat widget, and used the LoAF API to catch regressions. INP went to 160 ms." |
**Prove it:** INP phases, long tasks, LoAF, yielding.

### Signal 5: You consider devices and networks, not only your laptop
| | Example answer |
|---|---|
| ❌ Weak | "It's fast on my machine." |
| ✅ Strong | "We budget for a mid-range Android on slow 4G, where CPU is the bottleneck: JS parse/execute time matters more than download time. We test with 4–6x CPU throttling and real devices, and use adaptive loading where it makes sense." |
**Prove it:** CPU throttling, real-device testing, JS cost.

### Signal 6: You prevent regressions with process and tooling
| | Example answer |
|---|---|
| ❌ Weak | "We fixed it once." |
| ✅ Strong | "Budgets in CI (Lighthouse CI, size-limit), RUM alerts by release, canary comparisons, ownership per route, a third-party intake process and post-incident reviews." |
**Prove it:** CI config, alerts, ownership.

### Signal 7: You link performance to business results
| | Example answer |
|---|---|
| ❌ Weak | "Milliseconds matter." |
| ✅ Strong | "We showed conversion by LCP bucket, ran an A/B test on the optimized page, and saw +6% conversion and -30% bounce on mobile, which funded the next phase." |
**Prove it:** experiments, cohorts, cost savings.

### Signal 8: You choose architecture based on trade-offs
| | Example answer |
|---|---|
| ❌ Weak | "SSR is better." |
| ✅ Strong | "SSG/ISR for content, SSR with streaming for dynamic SEO pages, CSR for authenticated dashboards, Server Components to cut client JS. Each choice has costs: SSR adds TTFB and hydration, edge has data-locality limits. I document the decision with measured results." |
**Prove it:** rendering strategies table, hydration cost, edge trade-offs.

### 🔊 Phrases that sound senior
- "Let's look at the field p75 first, then reproduce in the lab."
- "The LCP element is discovered late; let me check the request waterfall."
- "That interaction's input delay is long. Which task is blocking the main thread?"
- "We set an SLO and a budget, and CI fails when it is exceeded."
- "The cache key is the problem; the hit ratio dropped after we added `Vary`."

### 🚩 Phrases that sound junior
- "I'll just minify everything." · "Lighthouse says 98, so we're fine." · "Add more `preload` tags." · "Lazy-load all images." · "CDN will fix it." · "It's fast on my laptop."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Core Web Vitals** (LCP, INP, CLS), thresholds, p75
2. **Lab vs field** data and the tools for each
3. **Critical rendering path** and render-blocking resources
4. **Main thread, long tasks and frame budget (16.7 ms)**
5. **LCP breakdown:** TTFB → load delay → load duration → render delay
6. **INP phases:** input delay → processing → presentation delay
7. **CLS causes and fixes**, session windows
8. **HTTP caching:** `Cache-Control`, ETag/304, CDN, immutable assets
9. **Network:** DNS/TCP/TLS cost, HTTP/2 vs HTTP/3, compression
10. **Prevention:** budgets, CI, RUM alerts

## 18.2 Quick fixes by metric
| Metric | Top fixes |
|---|---|
| **LCP** | Real `<img>` in HTML, `fetchpriority="high"`, preload, AVIF/WebP at correct size, no lazy-load, inline critical CSS, defer JS, CDN + fast TTFB, SSR/SSG |
| **INP** | Break long tasks (yield), light handlers, Web Workers, smaller DOM/virtualize, fewer re-renders, delay third parties, `startTransition` |
| **CLS** | `width`/`height` or `aspect-ratio`, reserve ad/embed space, font `size-adjust`, no content inserted above, animate with `transform` |
| **TTFB** | CDN/edge cache, no redirects, faster queries, server caching, HTTP/3, streaming |

## 18.3 Loading rules of thumb
- Critical CSS inline; the rest async. Scripts: `defer` (app), `async` (independent), none in `<head>` blocking.
- Preload: LCP image, 1–2 key fonts. Preconnect: 2–3 critical origins. Prefetch: likely next pages.
- Lazy-load: below-the-fold images, iframes, heavy components, routes.
- Images: AVIF/WebP + `srcset`/`sizes` + dimensions + CDN.
- Fonts: self-host WOFF2, subset, `font-display`, fallback metrics.
- JS: split by route, tree-shake, modern output, remove heavy libs, audit third parties.

## 18.4 Caching cheat sheet
| Resource | `Cache-Control` |
|---|---|
| Hashed JS/CSS/images/fonts | `public, max-age=31536000, immutable` |
| HTML | `no-cache` (or short `max-age` + `stale-while-revalidate`) |
| API (public, cacheable) | `s-maxage` + `stale-while-revalidate` |
| API (private/user) | `private, no-cache` or `no-store` for sensitive data |
| Service worker file | `no-cache` |

## 18.5 Render pipeline cheat
`JS → Style → Layout → Paint → Composite`. Layout props (`width`, `top`, `margin`) hit all stages. Paint props (`color`, `box-shadow`) skip layout. `transform` and `opacity` mostly skip to composite.

## 18.6 Measurement toolbox
- **Field:** CrUX, `web-vitals` + beacon, RUM vendor, Search Console CWV report.
- **Lab:** Lighthouse, WebPageTest, DevTools Performance, Lighthouse CI.
- **Code:** `PerformanceObserver` (LCP, CLS, longtask, LoAF, event), `performance.mark/measure`, Navigation/Resource Timing, `Server-Timing`.
- **Memory:** heap snapshots, allocation timeline.

## 18.7 Performance checklist
- [ ] LCP element identified and discoverable in HTML
- [ ] No lazy-loading above the fold; images sized and in modern formats
- [ ] Critical CSS inline; JS deferred; third parties audited
- [ ] Brotli/gzip on text; HTTP/2 or HTTP/3; CDN
- [ ] Immutable hashed assets; HTML revalidated
- [ ] Fonts self-hosted with `font-display` and fallback metrics
- [ ] Long tasks < 50 ms; heavy work in workers or chunked
- [ ] Lists virtualized; animations on `transform`/`opacity`
- [ ] No `unload` handlers; bfcache works
- [ ] Budgets + Lighthouse CI + RUM alerts

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| Slow LCP, fast TTFB | LCP resource found late / render-blocking | Real `<img>`, preload, `fetchpriority`, inline critical CSS, defer JS |
| High TTFB | Redirects, cache miss, slow origin | CDN cache, fewer redirects, optimize backend |
| High CLS | Images without size, ads, fonts | Dimensions, reserved slots, fallback metrics |
| Poor INP | Long tasks, heavy render, third parties | Yield, virtualize, workers, delay scripts |
| High TBT | Large JS, hydration | Split code, defer, islands/RSC |
| Repeat visits slow | Bad cache headers | Immutable hashed assets, ETag |
| Old version after deploy | HTML cached too long / chunk 404 | `no-cache` HTML, keep old chunks, SW update flow |
| Back button reloads | bfcache blocked | Remove `unload`, check DevTools reasons |
| Lab good, field bad | Real devices, third parties, long sessions | Segment RUM, test real devices |
| Scroll jank | Heavy handlers, big shadows, non-passive listeners | Passive listeners, rAF, simplify effects |

## 18.9 30-second answers
- **What are Core Web Vitals?** LCP (loading, ≤ 2.5 s), INP (responsiveness, ≤ 200 ms), CLS (visual stability, ≤ 0.1), measured at p75 of real users.
- **How do you improve LCP?** Make the LCP resource discoverable early and high priority, optimize it, remove render-blocking work and speed up TTFB.
- **How do you improve INP?** Keep tasks under 50 ms, yield, move work off the main thread, reduce DOM and re-renders, delay third parties.
- **How do you improve CLS?** Reserve space for images, ads and fonts; do not insert content above existing content.
- **Lab vs field?** Lab explains and prevents; field decides and ranks.
- **How does caching work?** Immutable hashed assets for a year, HTML revalidated, CDN with stale-while-revalidate.
- **HTTP/2 vs HTTP/3?** Multiplexing on TCP vs QUIC over UDP with per-stream loss recovery and faster setup.
- **What happens when you type a URL?** DNS → TCP → TLS → HTTP → HTML parse → CSSOM/DOM → render tree → layout → paint → composite.
- **How do you stop regressions?** Budgets in CI, RUM alerts, ownership and reviews.

## 18.10 Last-minute checklist before the interview
- [ ] I can state the CWV thresholds and explain p75 and lab vs field.
- [ ] I can break LCP into four parts and give a fix for each.
- [ ] I can explain INP's three phases and how to find the blocking task.
- [ ] I can write the correct `Cache-Control` for hashed assets and HTML.
- [ ] I can explain the rendering pipeline and which CSS properties skip layout.
- [ ] I can do round-trip and frame-budget math (4 RTT cold connection, 16.7 ms).
- [ ] I have two real stories with before/after numbers and the tools I used.
- [ ] I can describe how I would prevent regressions (budgets, CI, RUM, ownership).
