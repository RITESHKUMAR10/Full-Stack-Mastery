# HTML Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** After the definition, always add: **why it matters + where you used it in a real project + the trade-off.** This is what shows experience.

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
- [Part 11: Complete Coverage (Classic + HTML5 + Advanced + Mixed + MCQ)](#-part-11-complete-coverage-interviewbit-style-classic--html5--advanced--mixed--mcq)
- [Part 12: Browser Internals & DOM](#-part-12-browser-internals--dom)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output-Based & Spot the Error](#-part-14-output-based--spot-the-error-questions)
- [Part 15: MCQ Set 2](#-part-15-mcq-set-2-advanced--scenario)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is HTML? What is new in HTML5? *(Conceptual)*
**Answer:** HTML (HyperText Markup Language) defines the **structure** of a web page. It is a **markup language**, not a programming language (no logic, loops or conditions). HTML5 added:
- Semantic tags: `header, nav, main, section, article, aside, footer`
- Media: `<audio>`, `<video>` (no Flash needed), `<canvas>`, inline `<svg>`
- Storage: `localStorage`, `sessionStorage`, IndexedDB
- Forms: new input types (`email, date, range, color, number`), `required`, `pattern`, `placeholder`, `datalist`
- APIs: Geolocation, Drag & Drop, Web Workers, WebSocket, History API
- A simple `<!DOCTYPE html>` and `<meta charset>`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ritesh Kumar | Portfolio</title>
  </head>
  <body>
    <header><nav>...</nav></header>
    <main><article>...</article></main>
    <footer>© 2026 Ritesh Kumar</footer>
  </body>
</html>
```
**Follow-up:** "How did video play before HTML5?" → With Flash or plugins (security and mobile support problems).

### Q2. Why do we write `<!DOCTYPE html>`? *(Conceptual)*
**Answer:** It tells the browser to render the page in **standards mode**. If it is missing, the browser switches to **quirks mode**, where the box model, line-height and table fonts behave like very old Internet Explorer. It is an instruction, not an HTML tag, and it is not case-sensitive.

### Q3. What is the basic structure of an HTML document? What goes in `<head>`?
**Answer:** `<head>` holds metadata that is not shown on the page: `<title>`, `<meta charset>`, `<meta viewport>`, `<meta description>`, `<link rel="stylesheet">`, `<link rel="icon">`, `<script>` (with `defer`), Open Graph tags, and the canonical link. `<body>` holds the visible content.

### Q4. What is the difference between block, inline and inline-block elements? *(Comparison)*
| Type | Behavior | Width/Height | Example |
|---|---|---|---|
| Block | Starts on a new line, takes full width | ✅ works | `div, p, h1-h6, section, ul, form` |
| Inline | Stays in the same line, only as wide as its content | ❌ ignored | `span, a, strong, em, label` |
| Inline-block | Stays in the same line, but box properties work | ✅ works | `img, button, input` |

**Tricky follow-up:** Why is `<img>` inline but accepts width and height? → It is a **replaced element** (its content comes from outside CSS), so it behaves like inline-block.

### Q5. `id` vs `class` vs `name`? *(Comparison)*
- `id`: must be **unique** on the page. Used for JS, anchor links, label binding. High CSS specificity.
- `class`: reusable, can be on many elements, and one element can have many classes.
- `name`: used on form controls. It becomes the key when the form is submitted (`name=value`). It also groups radio buttons.

```html
<input type="radio" name="gender" value="male" />
<input type="radio" name="gender" value="female" />  <!-- same name = only one can be selected -->
```

### Q6. What is semantic HTML and why does it matter? *(Conceptual)*
**Answer:** Tags that have a **meaning**. Benefits: **SEO** (crawlers understand the structure), **accessibility** (screen readers jump between landmarks like `nav` and `main`), **maintainability**, and readability.
```html
<!-- ❌ Div soup -->
<div class="header"><div class="nav">...</div></div>
<!-- ✅ Semantic -->
<header><nav>...</nav></header>
```
**section vs article vs div:** `article` = self-contained content (blog post, news card, comment). `section` = a themed group with a heading. `div` = no meaning, only a styling hook.

### Q7. `<script>`, `async` and `defer`: what is the difference? *(Comparison, asked very often)*
| Attribute | Download | Execution | Order | Use for |
|---|---|---|---|---|
| none | Blocks HTML parsing | Immediately | Kept | Avoid |
| `async` | Parallel | As soon as downloaded (pauses parsing) | ❌ Not guaranteed | Analytics, ads |
| `defer` | Parallel | After HTML is parsed, before `DOMContentLoaded` | ✅ Kept | App scripts |
| `type="module"` | Parallel | Deferred by default | ✅ | ES modules |

```html
<script src="analytics.js" async></script>
<script src="app.js" defer></script>
<script type="module" src="main.js"></script>
```

### Q8. Absolute, relative and root-relative paths?
- Absolute: `https://site.com/img/a.png`
- Relative: `./img/a.png`, `../img/a.png`
- Root-relative: `/img/a.png` (starts from the domain root)

`<base href>` changes the base for all relative links. It can break SPA routing.

### Q9. What are HTML entities? Why are they needed?
They let you show reserved characters. Without them, the browser treats `<`, `>` and `&` as markup.
```html
&lt;div&gt;  &amp;  &copy;  &nbsp;  &quot;
```
Do not use `&nbsp;` for layout spacing. Use CSS margin or padding. It is a non-breaking space.

### Q10. `<br>` vs `<p>`; `<b>` vs `<strong>`; `<i>` vs `<em>`?
- `<strong>` / `<em>`: **semantic** importance or emphasis (a screen reader changes its tone).
- `<b>` / `<i>`: visual style only (still valid in HTML5, but no extra meaning).
- `<br>` is only a line break (poems, addresses). For paragraph spacing, use `<p>` with CSS margin.

### Q11. What are the list types?
`<ul>` unordered, `<ol>` ordered (`type`, `start`, `reversed`), `<dl>` description list (`dt` = term, `dd` = description).

### Q12. How do you build a table? How do you make it accessible?
```html
<table>
  <caption>Marks of Ritesh Kumar</caption>
  <thead><tr><th scope="col">Subject</th><th scope="col">Score</th></tr></thead>
  <tbody>
    <tr><th scope="row">Math</th><td>92</td></tr>
  </tbody>
  <tfoot><tr><td>Total</td><td>92</td></tr></tfoot>
</table>
```
`colspan` and `rowspan` merge cells. **Do not use tables for page layout**, only for tabular data.

### Q13. What are the important attributes of the `<a>` tag?
`href`, `target="_blank"` (new tab; always add `rel="noopener noreferrer"`), `download`, `rel`, `hreflang`, `mailto:`, `tel:`, and fragment links `#id`.
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit</a>
<a href="mailto:ritesh@example.com">Mail</a>
<a href="tel:+911234567890">Call</a>
<a href="/cv.pdf" download="Ritesh-Kumar-CV.pdf">Download CV</a>
```

### Q14. What are the common form elements and input types?
`input` (text, email, password, number, date, file, checkbox, radio, range, color, hidden, search, tel, url), `textarea`, `select/option/optgroup`, `button`, `fieldset/legend`, `datalist`, `output`, `progress`, `meter`.
```html
<form action="/signup" method="post">
  <fieldset>
    <legend>Signup</legend>
    <label for="n">Name</label>
    <input id="n" name="name" required />
    <label for="c">City</label>
    <input id="c" list="cities" /><datalist id="cities">
      <option value="Patna"><option value="Delhi">
    </datalist>
    <button type="submit">Join</button>
  </fieldset>
</form>
```
**Gotcha:** A `<button>` inside a form is `type="submit"` by default. For a normal button, write `type="button"`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q15. `localStorage`, `sessionStorage`, cookies and IndexedDB: what is the difference? *(Comparison)*
| | localStorage | sessionStorage | Cookie | IndexedDB |
|---|---|---|---|---|
| Size | ~5–10 MB | ~5 MB | ~4 KB | Very large (100s of MB) |
| Lifetime | Until deleted | Until the tab closes | `Expires` / `Max-Age` | Until deleted |
| Sent to server | ❌ | ❌ | ✅ on every request | ❌ |
| API | Sync | Sync | String | Async, structured |
| JS access | ✅ | ✅ | ❌ if `HttpOnly` | ✅ |

**Senior insight:** An auth token in `localStorage` can be stolen by XSS. An **HttpOnly + Secure + SameSite** cookie is safer (but you still need SameSite or a CSRF token against CSRF). `localStorage` is **synchronous** and blocks the main thread, so use IndexedDB for heavy data.
```js
localStorage.setItem('user', JSON.stringify({ name: 'Ritesh Kumar' }));
const user = JSON.parse(localStorage.getItem('user') ?? 'null');
```

### Q16. What do you do for accessibility (a11y)? *(Conceptual + practical)*
- Semantic tags and `alt` text on images (use `alt=""` for decorative images)
- Connect `label` to `input` with `for` / `id`
- Keyboard navigation: `tabindex="0"` or `-1`; **never a positive tabindex**
- Visible focus, skip link
- Use ARIA only when native HTML cannot do the job (**"First rule of ARIA: don't use ARIA"**)
- Color contrast 4.5:1 for text, 3:1 for large text
- `lang` attribute and a logical heading order

```html
<a href="#main" class="skip">Skip to content</a>
<label for="email">Email</label>
<input id="email" type="email" required aria-describedby="email-help" />
<small id="email-help">We never send spam</small>
<button aria-label="Close dialog">✕</button>
<img src="chart.png" alt="Sales up 20% in Q3" />
```

### Q17. How do you make images responsive and fast? *(Practical)*
Use `srcset` + `sizes` + `loading="lazy"` + AVIF/WebP + `width`/`height` (to avoid layout shift) + `decoding="async"`. Do **not** lazy-load the hero image (the LCP image). Give it `fetchpriority="high"`.
```html
<picture>
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="Hero banner" width="800" height="400"
       fetchpriority="high" decoding="async"
       srcset="hero-400.jpg 400w, hero-800.jpg 800w"
       sizes="(max-width: 600px) 100vw, 800px" />
</picture>
```
The `w` descriptor in `srcset` tells the browser each file's real width. `sizes` tells it how wide the image slot will be. The browser then picks the best file for the screen and pixel density.

### Q18. What does `<meta viewport>` do?
It tells the mobile browser to set the layout width equal to the device width. Without it, mobile uses a **980px virtual viewport**, the page looks zoomed out, and media queries fire wrongly. Do not add `user-scalable=no` (it breaks accessibility).

### Q19. How do you do native form validation? How do you set a custom message?
```html
<form id="f" novalidate>
  <input type="email" name="email" required />
  <input type="password" minlength="8" required
         pattern="(?=.*\d)(?=.*[A-Z]).{8,}"
         title="8+ characters, one number and one capital letter" />
  <input type="number" min="18" max="60" />
  <button>Submit</button>
</form>
<script>
  f.addEventListener('submit', (e) => {
    if (!f.checkValidity()) { e.preventDefault(); f.reportValidity(); }
  });
  email.setCustomValidity('');   // custom message API
</script>
```
CSS: `input:invalid:not(:placeholder-shown)`. **Client-side validation is only for user experience. For security, server-side validation is mandatory.**

### Q20. What are `data-*` attributes?
They store custom data on an element. In JS, read them with `dataset` (camelCase).
```html
<button data-user-id="42" data-role="admin">Edit</button>
<script>btn.dataset.userId; // "42"</script>
```
You can use them in CSS too: `[data-role="admin"] { ... }`. Never put sensitive data here (it is public).

### Q21. GET vs POST in forms?
`GET`: data goes in the URL, can be cached and bookmarked, has a length limit, wrong for sensitive data. `POST`: data goes in the body, used to change state. For file upload use `enctype="multipart/form-data"`. GET should be idempotent.

### Q22. `<button>` vs `<a>`: when to use which?
`<a>` is for navigation (go to a URL). `<button>` is for an action (submit, toggle, open a modal). Making a button from `<div onclick>` or `<a href="#">` is bad for accessibility (no keyboard support, no role, no focus).

### Q23. When do you use `<iframe>` and what are the risks?
For third-party embeds (maps, video, payments). Risks: clickjacking, performance cost, security. Mitigation: `sandbox`, `loading="lazy"`, `referrerpolicy`, and CSP `frame-ancestors`.

### Q24. How do you embed `<video>` and `<audio>`?
```html
<video controls width="640" poster="thumb.jpg" preload="metadata" muted playsinline>
  <source src="clip.webm" type="video/webm" />
  <source src="clip.mp4" type="video/mp4" />
  <track kind="captions" src="en.vtt" srclang="en" label="English" default />
  Your browser does not support video.
</video>
```
Autoplay needs `muted` (browser policy). Captions (`track`) are needed for accessibility.

### Q25. `<canvas>` vs `<svg>`?
| | Canvas | SVG |
|---|---|---|
| Type | Raster (pixels) | Vector (DOM elements) |
| Scaling | Can blur | Perfect |
| Events | Manual hit-testing | Directly on the element |
| Best for | Games, heavy animation, thousands of particles | Icons, charts, logos |

### Q26. Which elements are void (self-closing)?
`img, br, hr, input, meta, link, area, base, col, embed, source, track, wbr`. In HTML the `/` in `<br/>` is optional (in JSX it is required).

---

# 🟡 Part 3: Mid (3–5 years)

### Q27. Explain the Critical Rendering Path. *(Conceptual, must-know)*
1. HTML bytes → tokens → **DOM**
2. CSS → **CSSOM**
3. DOM + CSSOM → **Render tree** (`display:none` nodes are not included)
4. **Layout** (geometry)
5. **Paint** → **Composite** (layers drawn by the GPU)

CSS is **render-blocking** (no paint without the CSSOM). JS is **parser-blocking** (and it also waits for the CSSOM). So: inline critical CSS, load the rest asynchronously, use `defer` for scripts, `preload` fonts, and reduce unused CSS/JS.

### Q28. `preload`, `prefetch`, `preconnect`, `dns-prefetch`, `modulepreload`?
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />
<link rel="prefetch" href="/next-page.js" />
<link rel="dns-prefetch" href="//api.example.com" />
<link rel="modulepreload" href="/app.js" />
```
- **preload**: needed on the current page *now* (high priority)
- **prefetch**: maybe needed on the *next* navigation (idle time)
- **preconnect**: do DNS + TCP + TLS early (use for only 2–3 origins)
- A wrong `as` or a missing `crossorigin` (needed for fonts) makes the file **download twice**.

### Q29. How do you improve Core Web Vitals? *(Scenario)*
- **LCP** (<2.5s): preload the hero image with `fetchpriority`, use a CDN, lower TTFB, reduce render-blocking CSS
- **INP** (<200ms): break long tasks, defer heavy JS or move it to a worker, keep event handlers light
- **CLS** (<0.1): give dimensions to images/ads/embeds, use `font-display: swap` with `size-adjust`, reserve space for dynamic content (skeletons), animate with `transform`

Tools: Lighthouse, WebPageTest, CrUX (real-user data), and the `web-vitals` library.
```js
import { onLCP, onINP, onCLS } from 'web-vitals';
[onLCP, onINP, onCLS].forEach((fn) => fn(console.log));
```

### Q30. What are Web Components, Shadow DOM and Custom Elements?
```html
<user-card name="Ritesh Kumar"></user-card>
<script>
class UserCard extends HTMLElement {
  static observedAttributes = ['name'];
  connectedCallback() { this.attachShadow({ mode: 'open' }); this.render(); }
  attributeChangedCallback() { if (this.shadowRoot) this.render(); }
  render() {
    this.shadowRoot.innerHTML =
      `<style>p{color:teal}</style><p>${this.getAttribute('name')}</p>`;
  }
}
customElements.define('user-card', UserCard);
</script>
```
Shadow DOM gives CSS **encapsulation** (outside styles do not enter, inside styles do not leak). Components work in any framework. Downsides: SSR, form integration and theming are harder (solve with CSS variables and `::part()`).

### Q31. What do you do for SEO at the HTML level?
- One `h1` and a logical heading order
- `title` (under 60 chars), `meta description` (under 160)
- `link rel="canonical"`, `robots` meta, sitemap, hreflang
- Open Graph / Twitter cards
- JSON-LD structured data
- **SSR/SSG** (pure CSR is slow or risky for crawlers)
- Meaningful link text (not "click here")
```html
<link rel="canonical" href="https://site.com/post" />
<meta name="description" content="Full-stack portfolio of Ritesh Kumar" />
<meta property="og:title" content="Ritesh Kumar" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Ritesh Kumar"}
</script>
```

### Q32. What is XSS and how do you prevent it in HTML? *(Security)*
An attacker's JS runs on your page through user-controlled input. Types: **Stored, Reflected, DOM-based**.
Prevention: **escape** output, use `textContent`, avoid `innerHTML` (or use DOMPurify), add a **CSP** header, use HttpOnly cookies, and add `rel="noopener noreferrer"`.
```js
el.textContent = userInput;                       // ✅
el.innerHTML = DOMPurify.sanitize(userInput);     // ✅ when you need HTML
el.innerHTML = userInput;                         // ❌ <img src=x onerror=alert(1)>
```
Frameworks like React escape by default, but `dangerouslySetInnerHTML` and `href="javascript:..."` are still risky.

### Q33. What are `<template>` and `<slot>`?
`<template>` content is not rendered or executed until JS clones it. `<slot>` is the place in a Web Component where the parent's content is injected.
```html
<template id="row"><li class="item"></li></template>
<ul id="list"></ul>
<script>
  const li = row.content.cloneNode(true);
  li.querySelector('.item').textContent = 'Ritesh';
  list.append(li);
</script>
```

### Q34. How do you lazy-load with `IntersectionObserver`?
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '200px' });
document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));
```
Try native `loading="lazy"` first. This is better than a `scroll` event listener because it does not block the main thread.

### Q35. Reflow vs repaint? How do you optimize DOM operations?
A change in layout (size, position) causes a **reflow** (expensive). A change only in color causes a **repaint**. To optimize: batch DOM reads and writes (avoid layout thrashing), use `DocumentFragment`, `requestAnimationFrame`, and animate `transform` / `opacity`.
```js
// ❌ layout thrashing
items.forEach((el) => { el.style.width = el.offsetWidth + 10 + 'px'; });
// ✅ read first, then write
const widths = items.map((el) => el.offsetWidth);
items.forEach((el, i) => { el.style.width = widths[i] + 10 + 'px'; });
```

### Q36. `DOMContentLoaded` vs `load` event?
`DOMContentLoaded`: HTML is parsed and deferred scripts have run (it does not wait for images or styles). `load`: all resources (images, iframes) are loaded. A `defer` script runs before `DOMContentLoaded`.

### Q37. What is event delegation and why is it useful?
Add one listener on the parent and use bubbling to handle the children. It works for dynamically added elements and uses less memory.
```js
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (li) console.log(li.dataset.id);
});
```

### Q38. Which `rel` values are useful?
`noopener`, `noreferrer`, `nofollow`, `sponsored`, `ugc`, `stylesheet`, `icon`, `canonical`, `alternate`, `manifest`. Without `noopener`, a `target="_blank"` page can use `window.opener` for tabnabbing. Modern browsers apply `noopener` by default, but write it explicitly.

---

# 🟠 Part 4: Senior (5–7 years)

### Q39. Why use native `<dialog>`, `popover` and `<details>`? *(Decision)*
Native elements give you **focus trap, ESC to close, backdrop, accessibility roles and the top layer** (no z-index wars) for free. A custom modal needs all of this to be built by hand, and it usually has bugs.
```html
<dialog id="dlg">
  <form method="dialog">
    <p>Confirm?</p>
    <button value="ok">OK</button>
    <button value="cancel">Cancel</button>
  </form>
</dialog>
<script>
  dlg.showModal();
  dlg.addEventListener('close', () => console.log(dlg.returnValue));
</script>
```
```html
<button popovertarget="tip">Info</button>
<div id="tip" popover>Popover content</div>
```

### Q40. How will you optimize large pages or long lists? *(Scenario)*
**Problem:** A table with 10,000 rows is slow.
- **Virtualization** (only visible rows are in the DOM)
- `content-visibility: auto` + `contain-intrinsic-size`
- Pagination or infinite scroll with IntersectionObserver
- Streaming SSR (send HTML chunks early)
- Keep the DOM small (Lighthouse: ideally under 1500 nodes)

### Q41. Why is HTML email different from web HTML?
Email clients (Outlook uses the Word engine) do not support modern CSS or JS. Use **table layout, inline CSS, no JS, 600px max width, absolute image URLs, and alt text** (images are often blocked). Tools like MJML help. Use the `color-scheme` meta for dark mode.

### Q42. How do you secure iframes and use postMessage correctly?
```html
<iframe src="https://third-party.com" sandbox="allow-scripts"
        loading="lazy" referrerpolicy="no-referrer"></iframe>
```
`sandbox` blocks everything by default, so grant only needed permissions. `X-Frame-Options` / `frame-ancestors` prevent clickjacking.
```js
// Parent
frame.contentWindow.postMessage({ type: 'init' }, 'https://trusted.com');
// Receiver: ALWAYS check the origin
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://trusted.com') return;
  handle(e.data);
});
```
Never use `postMessage(msg, '*')`.

### Q43. Progressive enhancement vs graceful degradation?
**Progressive enhancement:** start with basic HTML that works everywhere, then upgrade with CSS/JS. **Graceful degradation:** build the full-featured version first, then add fallbacks for when things fail. A form that submits without JS is progressive enhancement. It is more resilient, SEO-friendly and better for low-end devices.

### Q44. How do you apply CSP (Content Security Policy) in practice?
```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-r4nd0m';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  frame-ancestors 'none';
  report-to csp-endpoint
```
Steps: start with `Content-Security-Policy-Report-Only` → review violations → use a nonce or hash for inline scripts → remove `unsafe-inline` / `unsafe-eval` → enforce. `frame-ancestors` does not work in a `<meta>` CSP, so use a header.

### Q45. How do you control the performance impact of third-party scripts?
Use `async/defer`, move work to a web worker (Partytown), use the **facade pattern** (show a thumbnail instead of the YouTube iframe, load on click), audit the tag manager, `preconnect` only to needed origins, set a performance budget, and use `loading="lazy"` on iframes. Example: load a chat widget during idle time.

### Q46. How is resource loading priority controlled?
`fetchpriority="high|low"`, `loading=lazy`, `preload`, `defer`, `<link rel=preload as=font crossorigin>`. Browser defaults: CSS and fonts are high priority, async scripts are low, images inside the viewport are medium-high. Never mark the LCP image as lazy or low priority by mistake.

### Q47. How do you optimize fonts in HTML/CSS?
`preload` the critical font (woff2, with `crossorigin`), use `font-display: swap/optional`, subset the font, use variable fonts, self-host (avoid the Google Fonts connection), and use `size-adjust` on a fallback font so layout shift is zero.
```html
<link rel="preload" href="/fonts/inter.woff2" as="font"
      type="font/woff2" crossorigin />
```

### Q48. How are Service Workers, PWAs and the manifest connected to HTML?
```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#4f46e5" />
<script>
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
</script>
```
Benefits: offline cache, install prompt, push. Cache strategies: cache-first (static files), network-first (API), stale-while-revalidate. Risks: stale cache and the update flow (`skipWaiting`) must be handled carefully.

### Q49. Microdata, RDFa vs JSON-LD?
JSON-LD is Google's recommended format. It lives in a separate script block, so it is easier to maintain. Microdata is mixed into HTML attributes.

### Q50. What is your accessibility testing process?
Automated tools (axe-core, Lighthouse, eslint-plugin-jsx-a11y) catch only ~30–40% of issues. Add manual checks: keyboard-only navigation, a screen reader (NVDA, VoiceOver), 200% zoom, high contrast, reduced motion. In CI use axe plus the Storybook a11y addon. Target WCAG 2.2 AA.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q51. How are micro-frontends integrated at the HTML level? *(Architecture)*
Options: iframe (strong isolation, weak UX/SEO), Web Components (framework-agnostic), Module Federation (shared dependencies, runtime integration), server-side composition (SSI/ESI/edge). Trade-off: **isolation vs performance vs shared state vs team autonomy**. You need a design system, versioned contracts and a shared event bus. Common problems: duplicate React, CSS collisions, who owns routing.

### Q52. How do you enforce HTML quality in a team?
- Lint: ESLint `jsx-a11y`, `htmlhint`, stylelint
- CI: Lighthouse CI budgets, axe-core, bundle-size check
- Storybook + visual regression
- PR checklist (semantic tags, alt, labels, no inline handlers)
- Documentation and onboarding, plus a design system

### Q53. How do you set and enforce a performance budget?
Start from a business metric: "LCP < 2.5s on a mid-range Android phone on 4G". Then set technical limits: JS < 170 KB gzip, hero image < 100 KB, a maximum number of third-party scripts. In CI, fail the build on Lighthouse/WebPageTest regressions. Verify in production with RUM (real user monitoring), dashboards and alerts.

### Q54. SSR, SSG, ISR, CSR or streaming: which will you choose and why? *(Decision)*
| Strategy | When | Trade-off |
|---|---|---|
| SSG | Docs/marketing, rarely changes | Build time, stale content |
| ISR | Catalog/blog, periodic updates | Revalidation complexity |
| SSR | Personalized + SEO | Server cost, TTFB |
| CSR | Dashboard behind login | SEO and slow first paint |
| Streaming SSR | Slow data, fast first byte needed | Complexity, error boundaries |
| Islands / partial hydration | Mostly static with few interactive parts | Framework support |

Decision factors: SEO, freshness, personalization, infra cost, TTFB, team skill.

### Q55. What is hydration and what are its problems?
The server renders HTML, then client JS attaches event listeners to it. Problems: **hydration mismatch** (server and client HTML differ), double work (HTML + JS payload), delayed TTI. Solutions: partial/selective hydration, islands (Astro), resumability (Qwik), React Server Components.

### Q56. Internationalization (i18n) and RTL?
`lang`, `dir="rtl"`, logical CSS (`margin-inline-start`), `hreflang`, `<bdi>`, ICU MessageFormat plural rules, text expansion (German can be ~30% longer), `Intl.DateTimeFormat/NumberFormat`.
```html
<html lang="ar" dir="rtl">
<link rel="alternate" hreflang="en" href="https://site.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://site.com/" />
```

### Q57. How will you modernize a legacy codebase (table layout, inline handlers, jQuery)? *(Scenario)*
Go step by step (**strangler fig pattern**): audit (Lighthouse/axe) → highest-traffic pages first → one section at a time with a semantic wrapper + CSS grid → replace inline `onclick` with event delegation → add visual tests for regressions → roll out with a feature flag and compare metrics. Avoid a big-bang rewrite (high risk, business stops).

### Q58. What is the full set of security headers?
`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`, `X-Frame-Options` / `frame-ancestors`. Use Subresource Integrity (SRI) for CDN scripts:
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
```

### Q59. How do you design the API of HTML components in a design system?
Native semantics first, accessible by default (roles, keyboard, focus), headless + styled layers, theming through CSS variables / `::part`, documented states, SSR-safe, versioning and a deprecation policy, a11y tests in CI. Prefer slots/composition (`<Card.Header>`) over many props.

### Q60. Scalability: frontend delivery for 10M users?
CDN and edge caching, immutable hashed assets (`Cache-Control: max-age=31536000, immutable`), short TTL for HTML with stale-while-revalidate, HTTP/2/3, Brotli, an image CDN (on-the-fly resizing), RUM, feature flags, graceful degradation, multi-region.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. Accessible accordion (no JS)
```html
<details>
  <summary>What is the refund policy?</summary>
  <p>Full refund within 7 days.</p>
</details>
<details name="faq"> <!-- same name = only one open at a time -->
  <summary>Shipping time?</summary><p>3-5 days.</p>
</details>
```

### C2. Accessible tabs (ARIA + keyboard)
```html
<div class="tabs">
  <div role="tablist" aria-label="Profile sections">
    <button role="tab" id="t1" aria-selected="true"  aria-controls="p1">About</button>
    <button role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">Skills</button>
  </div>
  <div role="tabpanel" id="p1" aria-labelledby="t1">Ritesh Kumar, full-stack developer.</div>
  <div role="tabpanel" id="p2" aria-labelledby="t2" hidden>JS, React, Node.</div>
</div>
<script>
const tabs = [...document.querySelectorAll('[role=tab]')];
function select(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(t));
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});
</script>
```
Interview points: roving tabindex, arrow keys, `aria-selected`, `hidden` panels.

### C3. Signup form (validation + accessibility + no-JS fallback)
```html
<form action="/signup" method="post" novalidate>
  <div>
    <label for="name">Full name</label>
    <input id="name" name="name" autocomplete="name" required />
  </div>
  <div>
    <label for="mail">Email</label>
    <input id="mail" name="email" type="email" autocomplete="email" required
           aria-describedby="mail-err" />
    <p id="mail-err" role="alert" hidden>Enter a valid email</p>
  </div>
  <div>
    <input id="tnc" type="checkbox" name="tnc" required />
    <label for="tnc">I accept the terms</label>
  </div>
  <button type="submit">Create account</button>
</form>
```
Points: `autocomplete`, `role="alert"` (screen reader announces it), server-side validation as fallback.

### C4. Responsive navbar with hamburger (semantic)
```html
<header>
  <nav aria-label="Main">
    <button aria-expanded="false" aria-controls="menu" id="burger">☰ Menu</button>
    <ul id="menu" hidden>
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/projects">Projects</a></li>
    </ul>
  </nav>
</header>
<script>
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!open));
  menu.hidden = open;
});
</script>
```

### C5. Modal (native dialog) with focus return
```html
<button id="open">Delete account</button>
<dialog id="dlg" aria-labelledby="dt">
  <h2 id="dt">Delete for sure?</h2>
  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="ok">Delete</button>
  </form>
</dialog>
<script>
  open.onclick = () => dlg.showModal();
  dlg.onclose = () => { if (dlg.returnValue === 'ok') doDelete(); open.focus(); };
</script>
```

### C6. Image gallery with lazy-load and captions
```html
<figure>
  <img src="p1.jpg" alt="Ganga ghat in Patna at sunset" width="600" height="400"
       loading="lazy" />
  <figcaption>Patna, 2026</figcaption>
</figure>
```

### C7. Autocomplete (datalist) without a library
```html
<label for="lang">Language</label>
<input id="lang" list="langs" />
<datalist id="langs">
  <option value="JavaScript"><option value="Python"><option value="Java">
</datalist>
```

### C8. Markup for a print-friendly resume page
Semantic sections, `@media print`, `<address>`, `<time datetime>`.
```html
<article>
  <h1>Ritesh Kumar</h1>
  <address>ritesh@example.com · Patna</address>
  <section aria-labelledby="exp">
    <h2 id="exp">Experience</h2>
    <p><time datetime="2019-06">Jun 2019</time> – Present</p>
  </section>
</article>
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. The page reloads on form submit, but I wanted AJAX.
**Cause:** `<button>` is `type="submit"` by default. **Fix:** `e.preventDefault()` or `type="button"`.
```js
form.addEventListener('submit', (e) => { e.preventDefault(); sendAjax(); });
```

### D2. The image does not load (broken).
Checklist: path (relative vs root-relative), case sensitivity (on a Linux server `Logo.PNG` ≠ `logo.png`), network tab (404/403/CORS), `<base href>`, the build tool moved the asset, hotlink protection.

### D3. `getElementById` returns null.
The script is in `<head>` and the DOM is not parsed yet. **Fix:** `defer`, put the script at the end of body, or use `DOMContentLoaded`. Or the id is wrong or duplicated.

### D4. The page looks small / zoomed out on mobile.
`<meta name="viewport">` is missing.

### D5. Clicking the label does not toggle the checkbox.
`for` and `id` do not match, or the `id` is duplicated. Fix: `for="x"` ↔ `id="x"`, or wrap the input inside the label.

### D6. The page shifts (CLS) when an image loads.
The image has no `width`/`height`. Fix: add the attributes and CSS `aspect-ratio`.

### D7. Lighthouse warns about a `target="_blank"` link.
`rel="noopener noreferrer"` is missing (performance + security).

### D8. Special characters (é, ₹, हिंदी) look garbled (`â‚¹`).
`<meta charset="UTF-8">` is missing, or the file encoding and server header (`Content-Type: charset`) do not match. Keep the meta tag within the first 1024 bytes of `<head>`.

### D9. The hero image is slow and LCP is bad.
Check: is lazy-loading wrongly applied to the hero? Is there a preload/`fetchpriority`? Is the file too big? CDN/TTFB? Render-blocking CSS?

### D10. A screen reader says "button" but gives no name.
An icon-only button has no accessible name. Fix: `aria-label` or visually hidden text.
```html
<button aria-label="Search"><svg aria-hidden="true">...</svg></button>
```

### D11. A script inserted through dynamic HTML does not run.
`<script>` added through `innerHTML` does not execute (for security). Fix: create it with `createElement('script')`, or better, use a bundler/module.

### D12. Two elements have the same `id` and JS picks the wrong one.
`getElementById` returns the first match. Keep `id` unique, or use a class/data-attribute with `querySelectorAll`.

---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. What happens if you put a `<div>` inside a `<p>`?
It is invalid. The parser auto-closes the `<p>`, so the DOM differs from what you wrote. (In React you get a "validateDOMNesting" warning and hydration errors.)

### T2. Does a `<script>` tag in `<head>` make the page slow?
Yes, if it has no `defer/async` (it blocks the parser). With `defer`, keeping it in `<head>` is best practice because the download starts early.

### T3. Is using `<br>` for spacing instead of `<p>` fine?
No. It is not semantic and it hurts accessibility. Use CSS margin or padding.

### T4. Is HTML case-sensitive?
Tags and attributes are **not**. But `id` / `class` values and file paths (on Linux) **are**. XHTML/XML is case-sensitive.

### T5. Is an empty `<img alt>` fine?
Yes, `alt=""` is correct for decorative images (screen readers skip it). Leaving out `alt` completely is wrong (the reader may read the file name).

### T6. Are multiple `<h1>` allowed on a page?
The HTML spec allows it, but in practice use **one h1 per page** (SEO + a11y). Browsers never implemented the outline algorithm.

### T7. What is wrong with `<a href="#">` and `<a href="javascript:void(0)">`?
Both are anti-patterns: `#` scrolls to the top, `javascript:` is blocked by CSP and hurts accessibility. Use `<button>` for actions.

### T8. If JS removes the `required` attribute, is the form still secure?
No. Client validation can be bypassed (DevTools, curl). Server validation is a must.

### T9. What do `defer` and `type="module"` have in common?
Both execute deferred. A module also has strict mode, its own scope (no global leaks), `import/export`, and CORS-enabled fetch. A module is evaluated only once.

### T10. How is an object stored in `localStorage`?
Only as a string. You must use `JSON.stringify` / `parse`. `localStorage.setItem('a', {})` stores `"[object Object]"`.

### T11. `hidden` attribute vs `display:none` vs `aria-hidden`?
`hidden` applies `display:none` by default (CSS can override it). `aria-hidden="true"` only hides from the accessibility tree; the element stays visible, and putting it on a focusable element is a bug.

### T12. What is the output?
```html
<ul><li>One<li>Two</ul>
```
Valid HTML: `</li>` is optional, so two list items are created. (Close them anyway for readability.)

### T13. Why does `maxlength` not work on `<input type="number">`?
`maxlength` works only on text-type inputs. For number inputs use `min` / `max`.

### T14. Can a `<form>` be nested inside a `<form>`?
No, it is invalid. The browser ignores the inner form. Alternative: use the `form="formId"` attribute to attach an outside input to a form.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| HTML full form? | HyperText Markup Language |
| HTML5 doctype? | `<!DOCTYPE html>` |
| Biggest heading? | `<h1>` |
| Line break tag? | `<br>` |
| Link tag? | `<a href>` |
| Comment? | `<!-- comment -->` |
| Image tag? | `<img src alt>` |
| Dropdown? | `<select><option>` |
| Purpose of `meta charset`? | Character encoding (UTF-8) |
| Inline CSS attribute? | `style` |
| Where is the page title shown? | Browser tab, search results |
| Non-semantic tags? | `div`, `span` |
| Semantic tags? | `header, nav, main, article, section, aside, footer` |
| strong vs b? | strong = importance, b = visual only |
| `<hr>`? | Thematic break line |
| Placeholder vs label? | Placeholder is not a replacement for a label |
| `<noscript>`? | Content shown when JS is disabled |
| `<abbr title>`? | Abbreviation tooltip |
| `<mark>`? | Highlighted text |
| `<time datetime>`? | Machine-readable date |
| `<address>`? | Contact info |
| `<figure>/<figcaption>`? | Self-contained media + caption |
| How many visible `<main>`? | One per page |
| `tabindex="-1"`? | Focusable by script, not in tab order |
| `autofocus`? | Focuses on page load (use carefully for a11y) |
| `contenteditable`? | Makes the element editable |
| `draggable`? | Enables drag and drop |
| `spellcheck`? | Spell check on/off |
| `inert`? | Makes a subtree non-interactive |
| `loading="lazy"`? | Native lazy-load |
| `crossorigin`? | CORS mode for a resource |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a time you improved HTML/frontend performance."
**Sample answer (STAR):**
- **Situation:** The landing page of an e-commerce site had an LCP of 4.8s and a high bounce rate.
- **Task:** Bring LCP under 2.5s.
- **Action:** Served the hero image as AVIF with `fetchpriority="high"` and preload, inlined the critical CSS, loaded a third-party chat widget during idle time, added width/height to images, self-hosted fonts with `swap`.
- **Result:** LCP went from 4.8s to 2.1s, CLS from 0.25 to 0.03, and conversion improved by about 8%.
Tip: always say **numbers**.

### P2. "How do you handle accessibility in your team?"
Start at design (contrast, focus states), build a11y into the component library, run axe in CI, use a PR checklist, do a quarterly manual audit with a screen reader, and give developers a one-hour training.

### P3. "Did you ever cause a production bug in HTML/frontend?"
Honest example: a missing `type="button"` made the checkout form submit twice. Fix + postmortem + an ESLint rule + an e2e test that catches double-submit. **Talk about what you learned, not about blame.**

### P4. "What mistakes do new developers make in HTML most often?"
Div soup, missing alt/label, a div used as a button, inline styles/handlers, skipped heading levels, forgetting the viewport meta, no image dimensions, unsanitized data in `innerHTML`.

### P5. "What do you check in an HTML code review?"
Semantics, a11y (label/alt/keyboard), security (`innerHTML`, `rel`), performance (lazy/preload/dimensions), SEO basics, validity (W3C validator), consistent naming.

### P6. "What happens when you type a URL and the page appears?" *(Classic)*
DNS lookup → TCP handshake → TLS → HTTP request → server response (HTML) → HTML parse (DOM) + CSS (CSSOM) → JS runs → render tree → layout → paint → composite. The preload scanner finds resources in parallel. Caching (browser/CDN) skips many steps.

### P7. "What is the biggest change you saw in HTML/frontend in 5 years?"
jQuery and server-rendered pages → SPA → back to SSR/streaming/islands; native elements (`dialog`, `popover`, `:has()`); Core Web Vitals becoming an SEO factor; accessibility becoming a legal requirement.

---

# 📚 Part 11: Complete Coverage (InterviewBit-style: Classic + HTML5 + Advanced + Mixed + MCQ)

> Questions already covered above (async/defer, id vs class, semantic, void elements, entities, iframe, lazy, noopener, preload, canvas vs svg, storage, web components, template) are not repeated here. This part has **everything else**.

## 11A. Classic HTML Questions

### K1. How many doctype types are there?
**HTML 4.01** had 3: **Strict** (no deprecated tags), **Transitional** (deprecated tags allowed), **Frameset** (pages with frames). **HTML5 has only one**: `<!DOCTYPE html>`. Frameset and `<frame>` are obsolete.

### K2. What does the `target` attribute of `<a>` do?
| Value | Where it opens |
|---|---|
| `_self` (default) | Same tab/frame |
| `_blank` | New tab/window |
| `_parent` | Parent frame |
| `_top` | Full window (removes all frames) |
| `frameName` | Named iframe/window |

### K3. What are the values of the CSS `display` property?
`block, inline, inline-block, flex, inline-flex, grid, inline-grid, table, table-cell, list-item, contents, flow-root, none`. `contents` removes the element's own box but keeps its children. (`display:none` removes the space; `visibility:hidden` keeps the space.)

### K4. What are the values of CSS `position`?
`static` (default), `relative`, `absolute`, `fixed`, `sticky`; global keywords `initial`, `inherit`, `unset`, `revert`. An `absolute` element is placed relative to its nearest **positioned ancestor** (one whose position is not static).

### K5. Can an inline element be made a block element?
Yes: `display: block` (or `inline-block`).
```css
a.btn { display: block; }
```
The HTML content model is a separate matter: block content inside `<a>` is allowed in HTML5 (transparent content model), but a `<div>` inside `<p>` is not.

### K6. How do you merge table cells? `colspan` / `rowspan`
```html
<table border="1">
  <tr><th colspan="2">Ritesh Kumar</th></tr>
  <tr><td rowspan="2">Skills</td><td>JS</td></tr>
  <tr><td>React</td></tr>
</table>
```

### K7. `cellpadding` vs `cellspacing`?
`cellpadding` = space **inside** a cell between content and border. `cellspacing` = gap **between** two cells. Both are deprecated. In CSS use `td { padding }` and `table { border-spacing; border-collapse }`.

### K8. `<head>` vs `<body>`: how many times can each appear?
Each appears **only once**. `head` = metadata (title, meta, link, script, style). `body` = visible content.

### K9. How do you define the character set?
`<meta charset="UTF-8">` within the first 1024 bytes of `<head>`. UTF-8 supports Hindi, emoji, ₹ and everything else. The server header `Content-Type: text/html; charset=utf-8` should match.

### K10. How can CSS be added to HTML? What is the priority?
1. **Inline:** `<p style="color:red">`
2. **Internal:** `<style>` in the head
3. **External:** `<link rel="stylesheet" href="a.css">` (best: cacheable and reusable)
4. `@import` (slow, chained loading, avoid)

Priority is decided by specificity and order: inline > id > class > element (`!important` overrides all).

### K11. What are the text formatting tags?
`<b> <strong> <i> <em> <u> <small> <sub> <sup> <mark> <del> <ins> <code> <kbd> <samp> <var> <pre> <blockquote> <q> <cite> <abbr>`. `<big>`, `<font>` and `<center>` are obsolete.
```html
H<sub>2</sub>O · x<sup>2</sup> · <del>₹999</del> <ins>₹499</ins> · <mark>important</mark>
```

### K12. How do you optimize assets (images/CSS/JS)?
CDN, Gzip/**Brotli** compression, minification, bundling and code-splitting, HTTP/2 multiplexing, caching headers (hashed filenames + `immutable`), image formats (AVIF/WebP) with responsive sizes, lazy loading, tree-shaking, preload critical files, remove unused CSS/JS.

### K13. What is `enctype` in a form?
It sets how form data is encoded:
- `application/x-www-form-urlencoded` (default)
- `multipart/form-data` → for **file upload**
- `text/plain` (rare)
```html
<form method="post" enctype="multipart/form-data" action="/upload">
  <input type="file" name="resume" accept=".pdf" />
  <button>Upload</button>
</form>
```

### K14. What is whitespace collapsing?
In HTML, multiple spaces and newlines render as **one space**, so source indentation does not change the layout. To preserve it use `<pre>` or CSS `white-space: pre`. For extra gaps use CSS margin or padding, not `&nbsp;`.

### K15. Tag vs element vs attribute?
- **Tag:** `<p>` or `</p>` (markup)
- **Element:** start tag + content + end tag (`<p>Hello</p>`)
- **Attribute:** extra information on an element (`class`, `href`)

So "tag" and "element" are not the same thing.

### K16. How do you handle events in HTML?
```html
<!-- ❌ Inline handler (avoid: CSP, separation of concerns) -->
<button onclick="count++">+</button>

<!-- ✅ addEventListener -->
<button id="inc">+</button>
<script>
  let count = 0;
  inc.addEventListener('click', () => { count++; console.log(count); });
</script>
```
Benefits: multiple listeners, can be removed, CSP-friendly, control over capture/bubble.

### K17. Where should scripts go: head or end of body?
Modern answer: **in `<head>` with `defer`** (download starts early, runs after the DOM). The old way was the end of body. A legacy script that uses `document.write` must stay at its exact position. Analytics use `async`.

### K18. `<link>` vs `<a>`?
`<a>` is a visible clickable hyperlink. `<link>` sits in `<head>` and defines a relation to an external resource (CSS, icon, canonical, preload). It is not clickable.

### K19. What are the list types?
`<ul>` (bullets), `<ol>` (numbered; `type`, `start`, `reversed`), `<dl><dt><dd>` (term-description). Nested lists are allowed (`ul` inside `li`).

### K20. How do you create an HTML form?
See Q14 (Part 1). Key points: `action`, `method`, a `name` on every control, label binding, validation, and `button type`.

## 11B. HTML5 Questions

### H1. What is the relation between `<header>` and `<h1>`?
Each section/article can have its own `<header>` (heading + meta). Keep the heading hierarchy logical; in practice, one `h1` per page. A heading inside `<header>` is common but not required.

### H2. What are the new HTML5 input types?
`date, time, datetime-local, month, week, color, email, number, range, search, tel, url`. (`placeholder` is an **attribute**, not a type.)
```html
<input type="date" min="2026-01-01" />
<input type="range" min="0" max="100" step="10" />
<input type="color" value="#4f46e5" />
```

### H3. Media tags: audio, video, source, embed, track
`<source>` gives multiple formats, `<track>` gives captions/subtitles, `<embed>` embeds external content/plugin (legacy), `<object>` also embeds external content. (Syntax in Q24, Part 2.)

### H4. Which audio formats are supported?
MP3, WAV, Ogg (Vorbis/Opus), AAC. Safe choice: give both MP3 and Ogg through `<source>`. Video: MP4 (H.264), WebM (VP9/AV1), Ogg.

### H5. How does HTML5 Drag and Drop work?
```html
<div id="box" draggable="true">Drag me</div>
<div id="zone">Drop here</div>
<script>
  box.addEventListener('dragstart', (e) => e.dataTransfer.setData('text', box.id));
  zone.addEventListener('dragover', (e) => e.preventDefault());   // required
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.append(document.getElementById(e.dataTransfer.getData('text')));
  });
</script>
```
Gotcha: if `dragover` does not call `preventDefault()`, `drop` never fires. On touch devices a library (dnd-kit) works better. For file drop use `e.dataTransfer.files`.

### H6. What is MathML?
XML-based markup for math formulas using the `<math>` element. Browsers render it natively.
```html
<math><mfrac><mn>1</mn><mn>2</mn></mfrac></math>
```

### H7. What are Server-Sent Events (SSE)? How are they different from WebSocket?
The server **pushes data one way** to the client over one long-lived HTTP connection, with auto-reconnect built in. WebSocket is **two-way**.
```js
const es = new EventSource('/api/stream');
es.onmessage = (e) => console.log(JSON.parse(e.data));
es.onerror = () => console.log('reconnecting...');
```
Use for live notifications, logs, **LLM token streaming**. Limit: about 6 connections per domain on HTTP/1.1.

### H8. What are Web Workers? What are their types?
They run JS in a background thread, so the UI does not block. **Dedicated** (one script), **Shared** (multiple tabs), **Service Worker** (network proxy/offline). A worker has no DOM access and talks through `postMessage`.
```js
// main.js
const w = new Worker('worker.js');
w.postMessage({ n: 40 });
w.onmessage = (e) => console.log('fib =', e.data);
// worker.js
self.onmessage = (e) => self.postMessage(fib(e.data.n));
```

### H9. What is the `novalidate` attribute?
It skips the browser's native validation on form submit (used when you do custom JS validation).
```html
<form novalidate>...</form>
```

### H10. Raster vs vector images?
Raster = pixels (PNG, JPEG, WebP; blurs when zoomed). Vector = math paths (SVG; scales infinitely, small size for icons/logos).

### H11. How do you give an SVG fallback for old browsers?
```html
<img src="logo.svg" alt="Logo" onerror="this.src='logo.png'" />
<!-- or -->
<picture><source srcset="logo.svg" type="image/svg+xml"><img src="logo.png" alt="Logo"></picture>
```

### H12. What was the Application Cache (manifest)?
An old `cache.manifest` file (`<html manifest>`) for offline use. It is **deprecated and removed**. The replacement is **Service Worker + Cache API**.

### H13. Geolocation API (with code)
```js
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => console.log(pos.coords.latitude, pos.coords.longitude),
    (err) => console.warn(err.code, err.message),   // 1=denied 2=unavailable 3=timeout
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}
```
It needs user **permission** and works only on **HTTPS**. `watchPosition()` gives continuous tracking.

### H14. `<datalist>` vs `<select>`?
`datalist` gives suggestions, but the user can type **anything**. `select` allows only the listed options.

### H15. What is the `<output>` tag?
It shows the result of a calculation or action. Attributes: `for`, `form`, `name`.
```html
<form oninput="sum.value = Number(a.value) + Number(b.value)">
  <input id="a" type="number" value="2"> + <input id="b" type="number" value="3"> =
  <output name="sum" for="a b">5</output>
</form>
```

### H16. What is Microdata?
Marking up content with HTML attributes (`itemscope, itemtype, itemprop`) using the schema.org vocabulary, so search engines understand it.
```html
<div itemscope itemtype="https://schema.org/Person">
  <span itemprop="name">Ritesh Kumar</span>
</div>
```
Today **JSON-LD** is preferred.

### H17. `<meter>` vs `<progress>`?
`progress` = task completion (0 to max; can also be indeterminate). `meter` = a value inside a known range (disk usage, score).
```html
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1" low="0.3" high="0.8" optimum="0.9">60%</meter>
```

### H18. What are image maps?
Making different parts of one image clickable.
```html
<img src="india.png" usemap="#m" alt="Map" />
<map name="m">
  <area shape="rect" coords="0,0,100,100" href="/north" alt="North" />
  <area shape="circle" coords="150,150,40" href="/south" alt="South" />
</map>
```

### H19. `<figure>` vs `<img>`?
`<img>` only embeds a picture. `<figure>` groups self-contained content (image, code, chart) with a `<figcaption>` (semantic).

### H20. What are the goals / advantages of HTML5 over older HTML?
Plugin-free multimedia, semantic structure, better forms, offline and storage, background threads (Workers), graphics (Canvas/SVG), cross-browser consistency, backward compatibility, mobile-first APIs.

## 11C. Advanced HTML Questions

### A1. What is ARIA? When should you use it?
Accessible Rich Internet Applications: **role, state and property** attributes that give information to assistive technology (`role="tablist"`, `aria-expanded`, `aria-live`). **Use native HTML first** (`<button>` > `<div role="button">`). Wrong ARIA is worse than no ARIA. Rules: use native → if you add an ARIA role, add keyboard support → give it a visible name.
```html
<div aria-live="polite" id="status"></div>   <!-- dynamic updates are announced -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
```

### A2. Where does the accessible name come from?
Priority: `aria-labelledby` → `aria-label` → native (`<label>`, `alt`, `<caption>`, text content) → `title` (last).
```html
<button aria-label="Close"><svg aria-hidden="true">...</svg></button>
<h2 id="h">Profile</h2><section aria-labelledby="h">...</section>
```

### A3. Why use `<fieldset>` and `<legend>`?
They group related controls (radio groups, addresses). A screen reader reads the group name (legend) with each input. `<fieldset disabled>` disables the whole group.

### A4. `autocomplete`, `inputmode` and `pattern`?
- `autocomplete="email|name|one-time-code|new-password"`: browser autofill, faster forms, a11y.
- `inputmode="numeric|decimal|tel|email"`: mobile keyboard type (does not change validation).
- `pattern`: regex validation (on text-type inputs).
```html
<input name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="\d{6}" />
```
Avoid `type="number"` for OTP/phone (spinner, leading zeros are lost).

### A5. What does the `form` attribute do?
It connects an input or button to a form it is **not nested inside**, by matching the id.
```html
<form id="search" action="/s"></form>
<input name="q" form="search" />
<button form="search">Go</button>
```

### A6. `readonly` vs `disabled`?
| | readonly | disabled |
|---|---|---|
| Focusable | ✅ | ❌ |
| Value in form submit | ✅ | ❌ |
| Editable | ❌ | ❌ |
| Validation | skipped | skipped |
| Default style | normal | greyed out |

### A7. What is the risk of the `<base>` tag?
It sets the base for all relative URLs. In a SPA it can break anchor links (`#section`) and routing. Only one per document, in `<head>`. Use it rarely.

### A8. `srcdoc` vs `src` (iframe)?
`src` loads a URL. `srcdoc` embeds inline HTML (useful for previews/editors with sandbox). If `srcdoc` is present, `src` is ignored.
```html
<iframe sandbox srcdoc="<h1>Hello Ritesh</h1>"></iframe>
```

### A9. What is Subresource Integrity (SRI)?
It verifies a CDN file's hash so a tampered script does not run if the CDN is compromised. `crossorigin="anonymous"` is required.
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-BASE64HASH" crossorigin="anonymous"></script>
```

### A10. What is the impact of the `lang` attribute?
Screen reader **pronunciation**, browser translate prompt, hyphenation, spell-check, search engines, font selection (CJK), and CSS `:lang()`. For part of a page: `<span lang="hi">नमस्ते</span>`.

### A11. `preload` vs `prefetch` vs `preconnect`
Full details in Part 3, Q28. In one line: preload = needed now, prefetch = for the next page, preconnect = open the connection early.

## 11D. HTML + CSS + JavaScript (Mixed) Questions

### M1. How do HTML, CSS and JS work together in the browser pipeline?
HTML → DOM (structure). CSS → CSSOM (style). Both build the render tree → layout → paint → composite. JS can **change** the DOM and CSSOM (which causes reflow/repaint). Analogy: HTML = skeleton, CSS = skin and clothes, JS = muscles and behavior.

### M2. DOM vs CSSOM?
DOM = tree of the HTML (elements, text, attributes), accessed and changed with JS. CSSOM = tree of CSS rules (computed styles). The render tree merges both. `display:none` is not in the render tree but stays in the DOM.

### M3. Reflow vs repaint: how do you reduce them?
See Part 3, Q35. In short: size/position change = reflow (expensive), color change = repaint. Batch DOM changes, animate `transform/opacity`, use `DocumentFragment`, use `will-change` sparingly, and separate layout reads and writes.

### M4. `event.target` vs `event.currentTarget`?
`target` = the element where the event **actually happened** (the innermost one). `currentTarget` = the element the listener is **attached to**.
```html
<ul id="list"><li><b>Ritesh</b></li></ul>
<script>
  list.addEventListener('click', (e) => {
    console.log(e.target.tagName);        // B (or LI), whichever was clicked
    console.log(e.currentTarget.id);      // "list", the element with the listener
  });
</script>
```
In event delegation we use `target.closest('li')`.

### M5. Event bubbling, capturing and `stopPropagation`?
Event phases: **capture** (window → target) → **target** → **bubble** (target → window). Listeners run in the bubble phase by default. `stopPropagation()` stops it from spreading further. `preventDefault()` stops the browser's default action. They are different things.
```js
el.addEventListener('click', handler, { capture: true });
el.addEventListener('click', handler, { once: true, passive: true });
```

### M6. How do you avoid CSS specificity wars?
Keep specificity low (single class), use BEM / CSS Modules / `@layer`, do not style with `id` selectors, avoid `!important`, use `:where()` (0 specificity) for resets, and nest at most 2–3 levels.

### M7. Which relative unit to use when?
`rem` (fonts/spacing, scalable), `em` (component-relative, compounds), `%` (parent), `vw/vh/dvh` (viewport), `ch` (text width), `px` (borders, hairlines). Accessibility: do not fix font size in `px`; respect the user's browser zoom and settings.

### M8. How do you make a responsive layout with Flexbox/Grid and media queries?
```css
.grid { display: grid; gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
@media (min-width: 768px) { .sidebar { display: block; } }
```
Mobile-first, choose breakpoints from content, and use container queries for component-level changes.

### M9. When should you avoid `data-*`?
Sensitive data (it is public), large JSON (HTML bloat), and state that belongs in JS. Good uses: hooks for JS/test selectors (`data-testid`) and small config.

### M10. Form validation UX: HTML constraints + JS enhancement?
Start with HTML constraints (`required, pattern, min/max`). Then use JS to show errors **inline, per field, on blur/submit**, set `aria-invalid` + `aria-describedby`, move focus to an error summary, show a success state, and map server errors to fields.
```js
input.addEventListener('blur', () => {
  const bad = !input.checkValidity();
  input.setAttribute('aria-invalid', bad);
  err.textContent = bad ? input.validationMessage : '';
});
```

### M11. How do HTML/CSS choices reduce CLS?
See Part 3, Q29. Also: `aspect-ratio`, reserved slots for ads/embeds, `font-display` / `size-adjust`, do not inject banners above existing content late, animate with `transform`.

### M12. `textContent` vs `innerHTML` vs `innerText`?
`textContent`: raw text, safe, fast (includes hidden text). `innerText`: rendered/visible text (CSS-aware, triggers reflow). `innerHTML`: parses HTML (XSS risk).

## 11E. HTML MCQs (with answers)

1. Full form of HTML? → **HyperText Markup Language**
2. Largest heading tag? → **`<h1>`**
3. Which tag gives a line break? → **`<br>`**
4. Attribute used to make a link? → **`href`**
5. Which is not a semantic tag? → `div` ✔ (`header/nav/footer` are semantic)
6. Mandatory accessibility attribute of `<img>`? → **`alt`**
7. Dropdown list? → **`<select>`**
8. Open a link in a new tab? → **`target="_blank"`**
9. Input type for a checkbox? → **`checkbox`**
10. What does `<ol>` create? → **Ordered (numbered) list**
11. Form enctype for file upload? → **`multipart/form-data`**
12. HTML comment? → **`<!-- ... -->`**
13. Which tag is void? → **`<img>`** (not `<p>`)
14. What is `<td>`? → **Table data cell**
15. Table header cell? → **`<th>`**
16. Video tag in HTML5? → **`<video>`**
17. Data that stays after the browser closes? → **`localStorage`**
18. Attribute that makes a field mandatory? → **`required`**
19. Tag for page metadata? → **`<meta>`**
20. Attribute for responsive images? → **`srcset`**
21. A `<script>` that runs after HTML parsing, in order? → **`defer`**
22. Attribute to enable dragging? → **`draggable="true"`**
23. Purpose of `<abbr>`? → **Abbreviation / tooltip (`title`)**
24. Valid HTML5 DOCTYPE? → **`<!DOCTYPE html>`**
25. Does a `readonly` input send its value on submit? → **Yes**
26. Is a `disabled` input value submitted? → **No**
27. Default `button` type inside a form? → **`submit`**
28. `section` vs `article`: which is self-contained? → **`article`**
29. Which runs a background JS thread? → Not a tag, the **Web Worker API**
30. Which protocol does Geolocation need? → **HTTPS**

---

# 🧠 Part 12: Browser Internals & DOM

### B1. How does the browser parse HTML?
**Bytes → characters (encoding) → tokens (tokenizer) → nodes → DOM tree** (tree construction). The parser is **error-tolerant**: it does not crash on bad HTML and fixes it using spec rules (it implies missing `html/head/body`, auto-closes `<p>`, and moves wrong content out of `<table>` using "foster parenting").
- **Preload scanner:** even when the main parser is blocked by a script, it scans ahead and starts downloading images/CSS/JS early.
- When the parser meets a `<script>` (without defer/async), it **pauses**, downloads and runs the script, then continues.

### B2. Why does the browser add `<tbody>` by itself?
```html
<table><tr><td>Ritesh</td></tr></table>
```
The DOM becomes `table > tbody > tr` (a spec rule). That is why the CSS selector `table > tr` fails. Use `table > tbody > tr` or `table tr`.

### B3. Quirks mode, limited-quirks mode and standards mode?
Decided by the doctype. **Standards** (`<!DOCTYPE html>`), **Quirks** (missing/old doctype: old IE-like box model, table font inheritance, line-height), **Limited-quirks** (some XHTML/HTML4 transitional doctypes: only image-gap behavior is quirky). `document.compatMode` → `"CSS1Compat"` (standards) or `"BackCompat"` (quirks).

### B4. HTML vs XHTML?
| | HTML5 | XHTML |
|---|---|---|
| Syntax | Lenient | Strict XML (well-formed) |
| Case | Tags case-insensitive | Lowercase required |
| Closing tags | Void/optional tags allowed | Everything closed, `<br />` |
| Errors | Browser fixes them | **XML parse error**, page not shown |
| MIME | `text/html` | `application/xhtml+xml` |
| Attributes | boolean `disabled` allowed | `disabled="disabled"` |

### B5. What is the DOM? What are node types?
The DOM is the object tree of the document, which JS can read and change. Node types: `Element (1)`, `Text (3)`, `Comment (8)`, `Document (9)`, `DocumentFragment (11)`. Use `element.nodeType`. `childNodes` includes text nodes, while `children` has only elements.

### B6. `querySelectorAll` vs `getElementsByClassName` (live vs static)?
`getElementsBy*` → **live `HTMLCollection`** (updates automatically when the DOM changes). `querySelectorAll` → **static `NodeList`** (a snapshot). Looping over a live collection while changing the DOM causes skip or infinite-loop bugs.
```js
const live = document.getElementsByClassName('item');    // live
const snap = document.querySelectorAll('.item');          // static
document.body.append(Object.assign(document.createElement('li'), { className: 'item' }));
console.log(live.length, snap.length);   // live is +1, snap is the old count
```

### B7. Why avoid `document.write()`?
It blocks the parser. If called after page load it **overwrites the whole document**. It breaks in async-loaded scripts. Chrome blocks cross-origin `document.write` scripts on slow networks. Use `createElement` / `append`.

### B8. `innerHTML` vs `insertAdjacentHTML` vs `createElement`?
`innerHTML=` destroys and re-parses the whole subtree (listeners are lost, slow). `insertAdjacentHTML('beforeend', html)` does not touch existing nodes. `createElement` + `append` is the safest (no XSS) and type-safe.
```js
list.insertAdjacentHTML('beforeend', '<li>Ritesh</li>');
const li = document.createElement('li'); li.textContent = name; list.append(li);
```
Positions: `beforebegin | afterbegin | beforeend | afterend`.

### B9. What is `MutationObserver`?
It observes DOM changes (child added/removed, attribute, text) asynchronously. It replaced the old Mutation Events.
```js
const mo = new MutationObserver((records) => {
  records.forEach((r) => console.log(r.type, r.addedNodes));
});
mo.observe(document.body, { childList: true, subtree: true, attributes: true });
// mo.disconnect();
```
Related: `ResizeObserver` (element size), `IntersectionObserver` (visibility), `PerformanceObserver` (metrics).

### B10. What are the Custom Element lifecycle callbacks?
`constructor` → `connectedCallback` (added to the DOM) → `attributeChangedCallback(name, old, new)` (only for `observedAttributes`) → `disconnectedCallback` (removed) → `adoptedCallback` (moved to another document). Do not touch attributes or children in the constructor. The name must contain a hyphen (`my-card`).

### B11. Shadow DOM `open` vs `closed`, `::part`, `::slotted`?
`open`: `el.shadowRoot` is accessible. `closed`: it returns null (but this is not real security). Styling from outside: **CSS variables** (they inherit), `::part(name)` (exposed parts), and `::slotted(p)` from inside for slotted content.
```html
<style>my-btn::part(label) { color: tomato; }</style>
```

### B12. History API (the base of SPA routing)?
```js
history.pushState({ id: 1 }, '', '/profile/ritesh');   // no reload
window.addEventListener('popstate', (e) => render(location.pathname));
history.replaceState(null, '', '/home');
```
For a SPA, the server must fall back to `index.html` for all routes, otherwise a refresh gives a 404.

### B13. Clipboard, Fullscreen, Notifications and Page Visibility APIs?
```js
await navigator.clipboard.writeText('Ritesh Kumar');          // HTTPS + user gesture
el.requestFullscreen();                                        // user gesture
Notification.requestPermission().then(p => p === 'granted' && new Notification('Hi'));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') pauseVideo();     // tab in background
});
```

### B14. `navigator.sendBeacon` and `BroadcastChannel`?
`sendBeacon(url, data)` sends analytics reliably even during page unload (non-blocking). `BroadcastChannel` sends messages between same-origin tabs, iframes and workers (for example logout sync).
```js
addEventListener('pagehide', () => navigator.sendBeacon('/log', JSON.stringify({ t: Date.now() })));
const bc = new BroadcastChannel('auth'); bc.postMessage('logout'); bc.onmessage = (e) => e.data === 'logout' && signOut();
```

### B15. File API: select, preview and upload a file?
```html
<input id="f" type="file" accept="image/*" multiple />
<img id="p" alt="Preview" />
<script>
f.addEventListener('change', async () => {
  const file = f.files[0];
  p.src = URL.createObjectURL(file);                 // fast preview
  const fd = new FormData(); fd.append('avatar', file);
  await fetch('/upload', { method: 'POST', body: fd }); // Content-Type is set automatically
  URL.revokeObjectURL(p.src);
});
</script>
```
Validate `file.size` and `file.type` (type can be spoofed, so re-check on the server). For big files use chunked/resumable upload.

### B16. Constraint Validation API (complete)
```js
input.validity.valueMissing;     // required field is empty
input.validity.typeMismatch;     // wrong email/url
input.validity.patternMismatch;
input.validity.tooShort; input.validity.tooLong;
input.validity.rangeUnderflow; input.validity.rangeOverflow; input.validity.stepMismatch;
input.validity.badInput; input.validity.customError;
input.willValidate; input.validationMessage;
input.setCustomValidity('This email is already registered');  // '' clears it
form.checkValidity();   // boolean, fires the invalid event
form.reportValidity();  // boolean + shows the browser tooltip
```
CSS: `:valid :invalid :required :optional :in-range :out-of-range :user-invalid`.

### B17. `FormData`, `URLSearchParams` and submitting a form with fetch
```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = new FormData(form);                  // files too
  const res = await fetch(form.action, { method: form.method, body });
  if (!res.ok) throw new Error(res.status);
});
const q = new URLSearchParams({ q: 'html', page: 2 }).toString();   // q=html&page=2
```

### B18. `crossorigin`, `referrerpolicy`, `integrity`, `nonce`
- `crossorigin="anonymous|use-credentials"`: CORS request mode (needed for fonts, SRI and error details)
- `referrerpolicy="no-referrer|strict-origin-when-cross-origin"`: how much of the Referer header is sent
- `integrity`: SRI hash · `nonce`: allows an inline script under CSP

### B19. Why is HTML cached differently?
Give HTML **short or no cache** (`no-cache` + ETag, or `s-maxage` + stale-while-revalidate) so new deploys show up at once. Give hashed JS/CSS/images a **1-year `immutable`** cache. HTML then points to the new hashed assets (the cache-busting pattern).

### B20. Speculation Rules, View Transitions, `blocking="render"` (modern, Chromium)?
```html
<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/products/*" } }] }
</script>
<link rel="expect" href="#hero" blocking="render" />
```
Speculation Rules prerender the next page (instant navigation). The View Transitions API animates page or DOM changes. Check support and use them as progressive enhancement.

---

# 📋 Part 13: Reference Tables

### R1. Tags by category
| Category | Tags |
|---|---|
| Document | `html, head, body, title, meta, link, base, style, script, noscript` |
| Sectioning | `header, nav, main, section, article, aside, footer, address, search, h1–h6, hgroup` |
| Text | `p, div, span, br, hr, pre, blockquote, a, em, strong, small, mark, code, kbd, samp, var, abbr, dfn, time, q, cite, sub, sup, s, u, wbr, bdi, bdo, ruby/rt/rp, data` |
| List | `ul, ol, li, dl, dt, dd, menu` |
| Embedded | `img, picture, source, video, audio, track, canvas, svg, math, iframe, embed, object, map, area` |
| Table | `table, caption, colgroup, col, thead, tbody, tfoot, tr, th, td` |
| Form | `form, label, input, button, select, option, optgroup, datalist, textarea, fieldset, legend, output, progress, meter` |
| Interactive | `details, summary, dialog` |
| Scripting/Template | `script, noscript, template, slot, canvas` |
| Edits | `del, ins` |

### R2. Global attributes (on every element)
`accesskey, autocapitalize, autofocus, class, contenteditable, data-*, dir, draggable, enterkeyhint, hidden, id, inert, inputmode, is, itemid/itemprop/itemref/itemscope/itemtype, lang, nonce, part, popover, role, slot, spellcheck, style, tabindex, title, translate`

### R3. Important attributes of `<input>`
`type, name, value, placeholder, required, disabled, readonly, checked, min, max, step, minlength, maxlength, pattern, multiple, accept, autocomplete, autofocus, list, form, size, inputmode, formaction, formmethod, formenctype, formnovalidate, formtarget, capture`

### R4. Important `<meta>` tags
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="..." />
<meta name="robots" content="index, follow" />        <!-- noindex, nofollow -->
<meta name="theme-color" content="#4f46e5" />
<meta name="color-scheme" content="light dark" />
<meta http-equiv="refresh" content="5; url=/new" />   <!-- avoid, a11y issue -->
<meta property="og:title|og:image|og:url|og:type" />   <!-- Open Graph -->
<meta name="twitter:card" content="summary_large_image" />
```

### R5. `<link rel>` values
`stylesheet, icon, apple-touch-icon, manifest, canonical, alternate (hreflang/RSS), preload, prefetch, preconnect, dns-prefetch, modulepreload, prerender, next/prev, author, license`

### R6. Landmark elements and ARIA roles
| Element | Role |
|---|---|
| `<header>` (page-level) | `banner` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<aside>` | `complementary` |
| `<footer>` (page-level) | `contentinfo` |
| `<section>` with an accessible name | `region` |
| `<form>` with an accessible name | `form` |
| `<search>` | `search` |

### R7. Common ARIA attributes
States: `aria-expanded, aria-selected, aria-checked, aria-pressed, aria-hidden, aria-disabled, aria-invalid, aria-current, aria-busy`. Properties: `aria-label, aria-labelledby, aria-describedby, aria-controls, aria-live (off|polite|assertive), aria-atomic, aria-modal, aria-haspopup, aria-owns`. Roles: `button, link, dialog, alert, status, tablist/tab/tabpanel, menu/menuitem, listbox/option, combobox, progressbar, switch, tooltip`.

### R8. WCAG principles (POUR)
**P**erceivable (alt, captions, contrast) · **O**perable (keyboard, enough time, no seizures) · **U**nderstandable (readable, predictable, input help) · **R**obust (valid HTML, name/role/value for assistive tech). Levels A / AA / AAA. The industry target is **AA (WCAG 2.2)**.

### R9. HTTP status codes that affect HTML/frontend
`200 OK, 301 permanent redirect (SEO), 302/307 temporary, 304 not modified (cache), 400, 401 unauthenticated, 403 forbidden, 404, 410 gone, 429 rate limit, 500, 503 (temporarily down, fine for SEO)`. A soft-404 (a "not found" page with status 200) is bad for SEO.

### R10. Keyboard interaction cheat sheet (a11y)
`Tab/Shift+Tab` move focus · `Enter` link/button · `Space` button/checkbox · `Esc` close dialog/popup · `Arrow keys` tabs, radio, menu, listbox · `Home/End` first/last item. In a modal: trap focus, and return focus to the trigger on close.

---

# 🧩 Part 14: Output-Based & Spot the Error Questions

### O1. What is wrong here?
```html
<a href="/a"><a href="/b">Link</a></a>
```
**Answer:** An anchor inside an anchor is **invalid**. The parser closes the first `<a>` before starting the second, so the DOM is different from what you wrote.

### O2. What DOM is created?
```html
<p>Hello <div>World</div></p>
```
**Answer:** `<p>` is auto-closed before `<div>`, so you get: `<p>Hello </p><div>World</div><p></p>` (an extra empty `p`).

### O3. How many radio buttons are selected?
```html
<input type="radio" name="a" checked>
<input type="radio" name="a" checked>
<input type="radio" name="b" checked>
```
**Answer:** In group `a`, only the **last** one stays checked (the second). Group `b` has 1. Total 2 selected.

### O4. What does the console print?
```html
<div id="x"></div><div id="x"></div>
<script>console.log(document.querySelectorAll('#x').length, document.getElementById('x') === document.querySelector('#x'));</script>
```
**Answer:** `2 true`. Duplicate ids are invalid, but `querySelectorAll` returns both; `getElementById` returns the first.

### O5. What happens on submit?
```html
<form action="/save"><button onclick="save()">Save</button></form>
```
**Answer:** `save()` runs **and** the form submits (the button is submit by default), so the page reloads. Fix: `type="button"` or `preventDefault`.

### O6. Is `<li>` valid outside a list?
**Answer:** No. The parent of `<li>` must be `ul/ol/menu`. The browser still renders it, but it is invalid and the accessibility role is wrong.

### O7. What is shown here?
```html
<p>A    B
   C</p>
```
**Answer:** `A B C` (whitespace collapses). To preserve it use `<pre>` or `white-space: pre`.

### O8. When is the alt text of an image shown?
**Answer:** When the image fails to load, or for screen readers, text browsers, or when images are blocked. So `alt` should be meaningful (decorative = `alt=""`).

### O9. What is wrong with this form?
```html
<label>Name</label><input id="name" type="text">
```
**Answer:** The label is not bound to the input (`for` is missing). Clicking the label does not focus the input, and a screen reader gets no name. Fix: `<label for="name">` or wrap the input.

### O10. What is the result of this script?
```html
<script>document.getElementById('box').textContent = 'Hi';</script>
<div id="box"></div>
```
**Answer:** `TypeError: Cannot set properties of null`. The script ran **before** the element existed. Fix: `defer`, DOMContentLoaded, or move the script down.

### O11. Which option is selected?
```html
<select><option>A</option><option selected>B</option><option selected>C</option></select>
```
**Answer:** In a single select the **last** `selected` wins: `C`.

### O12. Why does `click` not fire on `<button disabled>`?
**Answer:** Disabled form controls do not fire events (not even click). If you need a tooltip, listen on a wrapper, or use `aria-disabled="true"` (it stays focusable).

### O13. `localStorage.setItem('n', 5); typeof localStorage.getItem('n')`?
**Answer:** `"string"`. Storage keeps only strings.

### O14. Nested form?
```html
<form id="a"><form id="b"></form></form>
```
**Answer:** The inner form is ignored (the parser drops its start tag). Only one form exists in the DOM.

### O15. What is the risk of `target="_blank"` without `rel`?
**Answer:** In older browsers, `window.opener` allows reverse tabnabbing. Modern browsers apply `noopener` by default, but write it explicitly, and add `noreferrer` to stop referrer leaks.

---

# ✅ Part 15: MCQ Set 2 (Advanced + Scenario)

1. Which attribute delays loading an image until it is near the viewport? → **`loading="lazy"`**
2. Best practice for the LCP image? → **`fetchpriority="high"` and eager, not lazy**
3. Which script is parser-blocking? → **A classic `<script>` without `defer/async`**
4. When does a `defer` script run? → **After HTML parsing, before `DOMContentLoaded`**
5. Which storage is sent to the server on every request? → **Cookies**
6. Most reliable layer against XSS? → **Output escaping + CSP**
7. Method to open `<dialog>` as a modal? → **`showModal()`** (`show()` is non-modal)
8. Which `popover` value gives light-dismiss? → **`auto`** (not `manual`)
9. What does an icon-only button need for screen readers? → **An accessible name (`aria-label`)**
10. Alt text of a decorative image? → **`alt=""`**
11. When to use `aria-live="assertive"`? → **For urgent errors that must be announced at once** (normal: `polite`)
12. Which HTML5 element shows progress with no known range? → **`<progress>`** (a range is `<meter>`)
13. What does `rel="noopener"` stop? → **The new tab's `window.opener` access**
14. When is `<picture>` used? → **Art direction / format switching**
15. What does the `w` descriptor in `srcset` mean? → **The image's intrinsic width in pixels**
16. Which meta tag is required for responsive design? → **viewport**
17. Order of `async` scripts? → **Not guaranteed**
18. When is `<template>` content rendered? → **When JS clones it into the DOM**
19. Main benefit of Shadow DOM? → **Style and DOM encapsulation**
20. Why does a SPA return 404 on refresh? → **The server does not fall back to `index.html` for all routes**
21. Use of `sendBeacon`? → **Non-blocking analytics during unload**
22. Which is a live collection? → **`getElementsByClassName` (HTMLCollection)**
23. What does `querySelectorAll` return? → **A static NodeList**
24. Biggest `postMessage` security mistake? → **Using `'*'` as the target / not checking `e.origin`**
25. Which header prevents clickjacking? → **`X-Frame-Options` / CSP `frame-ancestors`**
26. Why is `<input type="number">` wrong for OTP/phone? → **Leading zeros are lost, it has a spinner, bad a11y; use `inputmode="numeric"` with `type="text"`**
27. What does `form.reportValidity()` do? → **Checks validity and shows the browser error UI**
28. What is a soft-404? → **A "not found" page that returns status 200**
29. Purpose of `hreflang`? → **Tells search engines about language/region variants**
30. Direction of Server-Sent Events? → **Server → Client (one-way)**
31. What is `Cache-Control: immutable` for? → **Hashed static assets**
32. What happens on an HTML parse error (HTML5)? → **The browser recovers (in XHTML it is a fatal error)**
33. What causes reverse tabnabbing? → **`target="_blank"` without `noopener` (older browsers)**
34. What does the `inert` attribute do? → **Makes a subtree non-interactive and non-focusable**
35. Which Core Web Vital measures interaction responsiveness? → **INP** (replaced FID)

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are the mistakes that developers make again and again in real projects. Interviewers often ask: *"What is wrong with this code?"* or *"What would you change in this code review?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Building a button or link from `div` / `span`
**❌ Wrong:**
```html
<div class="btn" onclick="save()">Save</div>
```
**🤔 Why it is a problem:** A `div` cannot be focused with the Tab key, does not react to Enter/Space, and a screen reader does not know it is a button.

**✅ Correct:**
```html
<button type="button" class="btn" id="save">Save</button>
```
Use `<button>` for actions and `<a href>` for navigation.
**💬 Say:** "Native elements give keyboard support, focus and the right role for free."

---

### Mistake 2: Using a placeholder instead of a label
**❌ Wrong:**
```html
<input type="email" placeholder="Email" />
```
**🤔 Why it is a problem:** The placeholder disappears when the user types, it has low contrast, and many screen readers do not treat it as a proper name.

**✅ Correct:**
```html
<label for="email">Email</label>
<input id="email" type="email" placeholder="you@example.com" autocomplete="email" />
```
**💬 Say:** "A placeholder is a hint, not a label."

---

### Mistake 3: Skipping heading levels (h1 → h4) just for size
**❌ Wrong:**
```html
<h1>Portfolio</h1>
<h4>About me</h4>   <!-- chosen because it "looks smaller" -->
```
**🤔 Why it is a problem:** Screen reader users navigate by headings. A broken order confuses them, and it can hurt SEO.

**✅ Correct:**
```html
<h1>Portfolio</h1>
<h2 class="small-title">About me</h2>   <!-- use CSS for size -->
```
**💬 Say:** "Headings describe structure. Size is a CSS job."

---

### Mistake 4: Images without `width` and `height`
**❌ Wrong:**
```html
<img src="hero.jpg" alt="Hero" />
```
**🤔 Why it is a problem:** The browser does not know the image size before it loads, so the content below jumps. This is bad **CLS** (layout shift).

**✅ Correct:**
```html
<img src="hero.jpg" alt="Hero" width="800" height="450" />
```
**💬 Say:** "I always give media dimensions so the browser reserves the space."

---

### Mistake 5: Adding `loading="lazy"` to the LCP (hero) image
**❌ Wrong:**
```html
<img src="hero.jpg" alt="Hero" loading="lazy" />
```
**🤔 Why it is a problem:** The most important image is delayed. LCP (Largest Contentful Paint) gets worse.

**✅ Correct:**
```html
<img src="hero.jpg" alt="Hero" width="800" height="450" fetchpriority="high" />
<img src="below-the-fold.jpg" alt="..." width="400" height="300" loading="lazy" />
```
**💬 Say:** "Lazy-load only images below the fold. The hero gets high priority."

---

### Mistake 6: A `<button>` inside a form without `type="button"`
**❌ Wrong:**
```html
<form>
  <button onclick="openHelp()">Help</button>   <!-- also submits the form! -->
</form>
```
**🤔 Why it is a problem:** The default type is `submit`, so clicking Help also submits the form and reloads the page.

**✅ Correct:**
```html
<button type="button" onclick="openHelp()">Help</button>
```
**💬 Say:** "I always set the button type explicitly."

---

### Mistake 7: Putting user input into `innerHTML`
**❌ Wrong:**
```js
comment.innerHTML = userInput;   // <img src=x onerror=stealCookies()>
```
**🤔 Why it is a problem:** It is an **XSS** hole. An attacker's script can run on your page and steal data.

**✅ Correct:**
```js
comment.textContent = userInput;                         // plain text
comment.innerHTML = DOMPurify.sanitize(userInput);       // when HTML is really needed
```
**💬 Say:** "Never trust user input. I use `textContent`, or sanitize, and I add a CSP header."

---

### Mistake 8: `target="_blank"` without `rel`
**❌ Wrong:**
```html
<a href="https://example.com" target="_blank">Open</a>
```
**🤔 Why it is a problem:** In older browsers the new page can control your page through `window.opener` (tabnabbing). It can also leak the referrer.

**✅ Correct:**
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Open</a>
```
**💬 Say:** "I add `rel="noopener noreferrer"` to every external new-tab link."

---

### Mistake 9: Using `tabindex` greater than 0
**❌ Wrong:**
```html
<input tabindex="5" />
<input tabindex="1" />
```
**🤔 Why it is a problem:** It breaks the natural tab order, which becomes confusing and hard to maintain.

**✅ Correct:** Keep the DOM order logical and use only `tabindex="0"` (make focusable) or `tabindex="-1"` (focus by script).
**💬 Say:** "Positive tabindex is an anti-pattern. I fix the DOM order instead."

---

### Mistake 10: Treating client-side validation as security
**❌ Wrong:**
```html
<input name="age" type="number" min="18" required />
<!-- server trusts the value without checking -->
```
**🤔 Why it is a problem:** Anyone can remove the attribute in DevTools or send a request with `curl`.

**✅ Correct:** Keep HTML validation for good UX **and** validate again on the server.
**💬 Say:** "Client validation is for user experience. Server validation is for security."

---

### Mistake 11: Storing the auth token in `localStorage`
**❌ Wrong:**
```js
localStorage.setItem('token', jwt);
```
**🤔 Why it is a problem:** Any XSS bug lets a script read it and send it to an attacker.

**✅ Correct:** Send the token in an **HttpOnly + Secure + SameSite** cookie (JavaScript cannot read it).
**💬 Say:** "HttpOnly cookies protect tokens from XSS. I add SameSite or a CSRF token to protect against CSRF."

---

### Mistake 12: Inline event handlers (`onclick="..."`) with a weak CSP
**❌ Wrong:**
```html
<button onclick="doSomething()">Go</button>
<!-- CSP has 'unsafe-inline' just to make this work -->
```
**🤔 Why it is a problem:** To allow inline handlers you must weaken your CSP, which also helps attackers.

**✅ Correct:**
```html
<button id="go">Go</button>
<script src="app.js" defer></script>
```
```js
document.getElementById('go').addEventListener('click', doSomething);
```
**💬 Say:** "I keep JS out of HTML so I can use a strict CSP."

---

### Mistake 13: A modal without focus trap, ESC key or focus return
**❌ Wrong:**
```html
<div class="modal">...</div>   <!-- custom, no keyboard handling -->
```
**🤔 Why it is a problem:** Keyboard users tab out of the modal into the page behind it. They cannot close it with ESC, and focus is lost after closing.

**✅ Correct:**
```html
<dialog id="dlg"><form method="dialog"><button>Close</button></form></dialog>
<script>dlg.showModal();</script>
```
The native `<dialog>` handles focus trap, ESC and backdrop. After closing, move focus back to the button that opened it.
**💬 Say:** "I prefer native `dialog`, and I always return focus to the trigger."

---

### Mistake 14: Duplicate `id`, nested forms, and block elements inside `<p>`
**❌ Wrong:**
```html
<div id="box"></div><div id="box"></div>
<form><form></form></form>
<p>Hello <div>World</div></p>
```
**🤔 Why it is a problem:** Duplicate ids break JS and labels. The parser ignores a nested form. A `<div>` inside `<p>` auto-closes the paragraph and gives a different DOM than you expect.

**✅ Correct:** Unique ids, one form per form, and `<div>` / `<p>` as siblings. Validate with the W3C validator.
**💬 Say:** "I validate the HTML, because the parser silently 'fixes' invalid markup."

---

### Mistake 15: Blocking zoom with `user-scalable=no`
**❌ Wrong:**
```html
<meta name="viewport" content="width=device-width, user-scalable=no" />
```
**🤔 Why it is a problem:** People with weak eyesight cannot zoom. It is an accessibility failure.

**✅ Correct:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```
**💬 Say:** "Never block pinch-zoom."

---

### Mistake 16: Missing `lang`, `charset` or `title`
**❌ Wrong:**
```html
<html>
<head></head>
```
**🤔 Why it is a problem:** Without `lang`, screen readers may pronounce words wrongly. Without `charset`, special characters (₹, हिंदी) look broken. Without `title`, the tab and search results have no name.

**✅ Correct:**
```html
<html lang="en">
<head><meta charset="UTF-8" /><title>Ritesh Kumar | Portfolio</title></head>
```
**💬 Say:** "`lang`, `charset`, `viewport` and `title` are the minimum for every page."

---

### Mistake 17: Missing or useless `alt` text
**❌ Wrong:**
```html
<img src="chart.png" />                         <!-- no alt -->
<img src="chart.png" alt="image" />            <!-- useless -->
```
**🤔 Why it is a problem:** Without `alt`, the screen reader may read the file name. "image" gives no information.

**✅ Correct:**
```html
<img src="chart.png" alt="Sales grew 20% in Q3" />
<img src="divider.png" alt="" />               <!-- decorative: empty alt -->
```
**💬 Say:** "`alt` describes the purpose of the image. Decorative images get an empty `alt`."

---

### Mistake 18: Loading scripts in a way that blocks the page
**❌ Wrong:**
```html
<head><script src="big-library.js"></script></head>
```
**🤔 Why it is a problem:** The parser stops until the script is downloaded and executed, so the page appears late.

**✅ Correct:**
```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
```
**💬 Say:** "`defer` for app scripts, `async` for independent scripts like analytics."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers do not only check if your answer is correct. They listen to **how** you answer. A junior answers *what*. A senior answers *what + why + trade-off + number + experience*.
> **What should you do?** Practice answering in the "Strong" style below. Use the same style for every topic.

### Signal 1: You can explain the rendering pipeline and find the root cause
| | Example answer |
|---|---|
| ❌ Weak | "I make the page fast by compressing images." |
| ✅ Strong | "The browser builds the DOM from HTML and the CSSOM from CSS. CSS blocks rendering and sync JS blocks parsing. Our LCP was 4.8s because the hero image was lazy-loaded and the CSS was large. I preloaded the hero with `fetchpriority="high"`, inlined critical CSS and used `defer` for scripts. LCP became 2.1s." |
**Prove it:** mention DOM/CSSOM, render-blocking, LCP/CLS/INP with real numbers.

### Signal 2: You prefer semantic HTML and use ARIA with restraint
| | Example answer |
|---|---|
| ❌ Weak | "I use div for everything and add classes." |
| ✅ Strong | "I use native elements first (`button`, `nav`, `dialog`, `details`) because they give keyboard support and roles for free. I add ARIA only when native HTML cannot do the job, because wrong ARIA is worse than none." |
**Prove it:** mention landmarks, labels, `dialog`, the first rule of ARIA.

### Signal 3: You think about security by default
| | Example answer |
|---|---|
| ❌ Weak | "I validate the form in JavaScript." |
| ✅ Strong | "Client validation is only UX. I validate on the server, avoid `innerHTML` with user data, set a CSP, use HttpOnly SameSite cookies, add `rel=noopener`, use SRI for CDN scripts, and check `event.origin` in `postMessage`." |
**Prove it:** mention XSS, CSP, SRI, cookies, `postMessage`.

### Signal 4: You explain trade-offs
| | Example answer |
|---|---|
| ❌ Weak | "SSR is better than CSR." |
| ✅ Strong | "SSR gives better SEO and first paint but costs server time and TTFB. CSR is cheap to host and fine behind a login, but weak for SEO. For a marketing site I use SSG/ISR, for a dashboard CSR, and for a personalized, SEO-critical page SSR with streaming." |
**Prove it:** compare options in a table and give your default.

### Signal 5: You speak with numbers
| | Example answer |
|---|---|
| ❌ Weak | "I made it faster." |
| ✅ Strong | "LCP 4.8s → 2.1s, CLS 0.25 → 0.03, JS bundle 400 KB → 170 KB gzip, and conversion +8%." |
**Prove it:** always prepare 2–3 before/after numbers from real work.

### Signal 6: You show leadership and process
| | Example answer |
|---|---|
| ❌ Weak | "I write clean HTML." |
| ✅ Strong | "I added eslint-plugin-jsx-a11y, axe checks and Lighthouse budgets to CI, wrote a PR checklist, and migrated a legacy table-based site step by step (strangler pattern) with feature flags instead of a big rewrite." |
**Prove it:** CI checks, budgets, migrations, mentoring.

### Signal 7: You know browser behavior details
| | Example answer |
|---|---|
| ❌ Weak | "async and defer load scripts." |
| ✅ Strong | "Both download in parallel. `async` runs as soon as it arrives and may break order. `defer` runs after parsing in order, before `DOMContentLoaded`. Modules are deferred by default." |
**Prove it:** parser behavior, quirks mode, `tbody` insertion, live vs static collections.

### 🔊 Phrases that sound senior
- "It depends on... and the trade-off is..."
- "The root cause was..., so we fixed it by... and added a check so it does not happen again."
- "We measured before and after: ... to ..."
- "I use the native element first."
- "Client validation is for UX, server validation is for security."

### 🚩 Phrases that sound junior
- "I just use a div." · "It works in my browser." · "I do not know why, but it works." · "I put the token in localStorage." · "I never checked accessibility."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**. Everything here is explained in detail earlier in the file.

## 18.1 Minimum template for every page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page title</title>
  <meta name="description" content="Short summary" />
  <link rel="stylesheet" href="styles.css" />
  <script src="app.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header><nav aria-label="Main">...</nav></header>
  <main id="main"><h1>Title</h1>...</main>
  <footer>...</footer>
</body>
</html>
```

## 18.2 Which tag should I use?
| I want... | Use |
|---|---|
| Page navigation links | `<nav>` with `<a>` |
| Main content (once per page) | `<main>` |
| Self-contained item (post, card) | `<article>` |
| Themed group with a heading | `<section>` |
| Side content | `<aside>` |
| An action (submit, toggle) | `<button type="button">` |
| Go to another URL | `<a href>` |
| Image with caption | `<figure>` + `<figcaption>` |
| Modal | `<dialog>` |
| Show/hide details | `<details><summary>` |
| Progress of a task | `<progress>` |
| Value in a range (score, disk) | `<meter>` |
| Group form controls | `<fieldset><legend>` |

## 18.3 Scripts in 10 seconds
| Attribute | Runs | Order | Use |
|---|---|---|---|
| none | Immediately, blocks parsing | Kept | Avoid |
| `async` | When downloaded | Not kept | Analytics |
| `defer` | After parsing | Kept | App code |
| `type="module"` | After parsing | Kept | ES modules |

## 18.4 Storage in 10 seconds
| | Size | Lifetime | Sent to server |
|---|---|---|---|
| Cookie | 4 KB | Set by you | ✅ every request |
| localStorage | ~5–10 MB | Until deleted | ❌ |
| sessionStorage | ~5 MB | Until tab closes | ❌ |
| IndexedDB | Very large | Until deleted | ❌ |
Tokens → HttpOnly + Secure + SameSite cookie, not localStorage.

## 18.5 Performance checklist
- [ ] Images: `width`/`height`, AVIF/WebP, `srcset`, lazy-load below the fold only
- [ ] Hero image: `fetchpriority="high"`, preload
- [ ] CSS: critical inline, rest async
- [ ] JS: `defer`, split code, remove unused
- [ ] Fonts: preload woff2, `font-display: swap`
- [ ] `preconnect` to 2–3 important origins only
- [ ] Cache: HTML short, hashed assets `immutable` for 1 year

## 18.6 Accessibility checklist
- [ ] `lang` on `<html>`, one `<h1>`, logical headings
- [ ] Every input has a `<label>`
- [ ] Every image has meaningful `alt` (or `alt=""`)
- [ ] Everything works with keyboard only; focus is visible
- [ ] Icon-only buttons have `aria-label`
- [ ] Dialogs trap focus and return it on close
- [ ] Contrast ≥ 4.5:1; do not rely on color only

## 18.7 Security checklist
- [ ] No user input in `innerHTML` (use `textContent` or sanitize)
- [ ] CSP header (report-only first)
- [ ] `rel="noopener noreferrer"` on `target="_blank"`
- [ ] SRI on CDN scripts
- [ ] HttpOnly + Secure + SameSite cookies
- [ ] `postMessage`: check `event.origin`, never use `'*'`
- [ ] Always validate on the server

## 18.8 SEO checklist
- [ ] Unique `<title>` and meta description
- [ ] One `<h1>`
- [ ] Canonical link, sitemap, `robots`
- [ ] Open Graph tags
- [ ] JSON-LD structured data
- [ ] SSR / SSG for content pages
- [ ] Meaningful link text; correct status codes (301, 404; no soft-404)

## 18.9 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| Form reloads the page | Button is `submit` by default | `type="button"` or `preventDefault()` |
| `getElementById` is null | Script runs before the DOM is ready | `defer` / `DOMContentLoaded` |
| Mobile page looks zoomed out | Missing viewport meta | Add the viewport meta tag |
| Garbled characters (â‚¹) | Missing/wrong charset | `<meta charset="UTF-8">` |
| Layout jumps when images load | No width/height | Add width/height or `aspect-ratio` |
| Label click does nothing | `for` and `id` do not match | Fix `for`/`id` or wrap the input |
| Script added via `innerHTML` does not run | Browsers do not run it | `createElement('script')` or use modules |
| Icon button has no name for screen reader | No accessible name | `aria-label` |
| Wrong DOM from valid-looking HTML | Parser auto-fixed invalid nesting | Validate HTML |

## 18.10 30-second answers to the most common questions
- **What is semantic HTML?** Tags with meaning (`header`, `nav`, `article`). It helps SEO, accessibility and maintainability.
- **async vs defer?** Both download in parallel. `async` runs immediately and breaks order. `defer` runs after parsing, in order.
- **localStorage vs cookie?** localStorage is client-only and JS-readable. Cookies go to the server on every request and can be HttpOnly.
- **What is the critical rendering path?** HTML → DOM, CSS → CSSOM, both → render tree → layout → paint → composite.
- **How do you stop XSS?** Escape output, use `textContent`, sanitize, set CSP, use HttpOnly cookies.
- **Why use `alt`?** For screen readers, broken images and SEO. Decorative images use `alt=""`.
- **What is CLS and how do you fix it?** Unexpected layout movement. Give media dimensions, reserve space, and animate with `transform`.
- **block vs inline?** Block starts a new line and takes full width. Inline flows with text and ignores width/height.
- **What is `<!DOCTYPE html>`?** It enables standards mode and avoids quirks mode.
- **What happens when you type a URL?** DNS → TCP → TLS → HTTP request → HTML response → DOM/CSSOM → render tree → layout → paint → composite.

## 18.11 Last-minute checklist before the interview
- [ ] I can explain the critical rendering path and Core Web Vitals in my own words.
- [ ] I can write accessible tabs, a modal and a form from memory.
- [ ] I know async vs defer, storage types, and XSS prevention.
- [ ] I have 2 performance stories with numbers.
- [ ] I have 1 accessibility story and 1 security story.
- [ ] I can compare SSR / SSG / ISR / CSR and say when I would use each.
