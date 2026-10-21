# Tailwind CSS Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This file covers **Tailwind CSS v4** (CSS-first configuration) and clearly marks where **v3** is different, because many companies still run v3 and interviewers ask about both.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** Do not only list classes. Explain: **why utility-first, how Tailwind generates CSS, how you keep it maintainable, and the trade-offs.**

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
- [Part 11: Complete Coverage (Classic + Advanced + Mixed)](#-part-11-complete-coverage-classic--advanced--mixed)
- [Part 12: Internals & How Tailwind Works](#-part-12-internals--how-tailwind-works)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output-Based & Spot the Error](#-part-14-output-based--spot-the-error)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Tailwind CSS? What does "utility-first" mean? *(Conceptual)*
**Answer:** Tailwind is a **utility-first CSS framework**. Instead of writing CSS rules in a separate file, you build the design by combining small, single-purpose classes directly in your HTML (`p-4`, `flex`, `text-red-500`, `rounded-lg`).

```html
<button class="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
  Save
</button>
```
**How it works:** Tailwind scans your source files for class names and generates **only the CSS you actually use**. So the final CSS is small (often 10 KB or less after compression).

**Why people like it:** fast to build, no naming (no `.card-title-wrapper`), styles live next to the markup, consistent design scale, small CSS, no dead CSS.
**Why people dislike it:** long class lists, learning the class names, repeated markup if you do not make components.

### Q2. Tailwind vs Bootstrap: what is the difference? *(Comparison)*
| | Tailwind | Bootstrap |
|---|---|---|
| Style | Utility classes, no ready components | Ready components + utilities |
| Look | Your own design | Recognizable "Bootstrap look" |
| Customization | Very easy (design tokens in theme) | Sass variables, overrides |
| CSS size | Small (only used classes) | Larger unless trimmed |
| JS | None | Plugins (modal, dropdown...) |
| Best for | Custom designs, design systems | Fast standard UIs, admin panels |

### Q3. How do you install and set up Tailwind v4? *(Practical)*
**With Vite (recommended):**
```bash
npm install tailwindcss @tailwindcss/vite
```
```js
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [tailwindcss()] });
```
```css
/* src/style.css */
@import "tailwindcss";
```
```html
<link href="/src/style.css" rel="stylesheet">
```
**Other ways:** `@tailwindcss/postcss` (PostCSS), `@tailwindcss/cli`, or the Play CDN for quick demos.

**v3 setup (for comparison):** `npm i -D tailwindcss postcss autoprefixer`, `npx tailwindcss init`, a `tailwind.config.js` with a `content` array, and three directives in CSS: `@tailwind base; @tailwind components; @tailwind utilities;`.

### Q4. How does responsive design work in Tailwind? *(Must-know)*
Tailwind is **mobile-first**. A class without a prefix applies to all sizes. A prefixed class (`md:`) applies **from that breakpoint and up** (`min-width`).

| Prefix | Min width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">...</div>
<p class="text-sm md:text-base lg:text-lg">Text grows with the screen</p>
```
To target only a small range, use `max-*` variants: `max-md:hidden` (below md), or combine: `md:max-lg:flex`.

### Q5. What are state variants (hover, focus, etc.)?
You add a prefix to apply a class only in a state.
```html
<a class="text-gray-600 hover:text-black focus-visible:outline-2 focus-visible:outline-indigo-600 active:scale-95 disabled:opacity-50">Link</a>
```
Common: `hover:`, `focus:`, `focus-visible:`, `active:`, `disabled:`, `checked:`, `first:`, `last:`, `odd:`, `even:`, `group-hover:`, `peer-checked:`, `dark:`, `placeholder:`, `before:`, `after:`. Variants can be **stacked**: `md:hover:bg-blue-600`.

### Q6. What is the spacing scale?
One unit = **0.25rem (4px)** by default. `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-8` = 32px. The same scale is used for padding, margin, gap, width, height, etc.
```html
<div class="mt-4 mb-8 px-6 py-3 gap-2 w-64 h-10">...</div>
```
In v4 the scale is dynamic: any number works (`mt-13`, `w-17`) because values are calculated from one `--spacing` variable.

### Q7. How do you set colors, fonts and sizes?
```html
<h1 class="text-3xl font-bold tracking-tight text-gray-900">Ritesh Kumar</h1>
<p class="text-base leading-7 text-gray-600">Full-stack developer</p>
<div class="bg-indigo-600/90 border border-indigo-700 rounded-xl shadow-md"></div>
```
- Colors: `{property}-{color}-{shade}` like `bg-blue-500`, shades `50…950`. Opacity: `bg-blue-500/50`.
- Font size: `text-xs … text-9xl` (also sets a default line-height).
- Weight: `font-light/normal/medium/semibold/bold`.
- Families: `font-sans`, `font-serif`, `font-mono`.

### Q8. How do you build layouts with Flexbox and Grid?
```html
<nav class="flex items-center justify-between gap-4">...</nav>
<div class="grid grid-cols-12 gap-4">
  <aside class="col-span-12 md:col-span-3">Sidebar</aside>
  <main class="col-span-12 md:col-span-9">Content</main>
</div>
<div class="grid min-h-screen place-items-center">Centered</div>
```
`flex`, `flex-col`, `flex-wrap`, `justify-*`, `items-*`, `gap-*`, `grow`, `shrink-0`, `basis-*`, `grid-cols-*`, `col-span-*`, `place-items-*`.

### Q9. How do you apply dark mode?
In Tailwind, add `dark:` before the class.
```html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">...</div>
```
By default `dark:` follows the OS setting (`prefers-color-scheme`). To control it with a class or attribute, configure it (see Q33).

### Q10. What is `@apply`? When should you use it?
`@apply` copies utilities into your own CSS class.
```css
.btn-primary { @apply rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700; }
```
Use it sparingly, for things you cannot wrap in a component (for example styling third-party HTML, or content from a CMS). In most cases it is better to **create a component** (React/Vue component) than to use `@apply`, because `@apply` brings back the naming and separate-file problems that utility-first was meant to remove.

### Q11. What are arbitrary values?
You can use any value in square brackets when the scale does not have it.
```html
<div class="w-[372px] bg-[#1da1f2] top-[calc(100%-2rem)] grid-cols-[1fr_2fr] text-[13px] bg-[url('/hero.webp')]">...</div>
```
Rules: spaces are written as **underscores** (`grid-cols-[1fr_2fr]`). In v4 you can reference a CSS variable with parentheses: `bg-(--brand)` (in v3: `bg-[var(--brand)]`). If you use the same arbitrary value many times, add it to the theme instead.

### Q12. What is Preflight?
Tailwind's base reset (built on modern-normalize). It removes default margins from headings and paragraphs, sets `box-sizing: border-box`, makes images `display: block; max-width: 100%`, removes list bullets, and resets buttons and borders. This is why `<h1>` looks plain until you add classes.

---

# 🔵 Part 2: Junior (1–3 years)

### Q13. How do you customize the theme in v4 vs v3? *(Must-know)*
**v4 (CSS-first):** use `@theme` in your CSS. Every variable becomes a utility.
```css
@import "tailwindcss";

@theme {
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --font-display: "Inter", sans-serif;
  --breakpoint-3xl: 120rem;
  --spacing: 0.25rem;
  --radius-card: 1rem;
}
```
Now `bg-brand-500`, `font-display`, `3xl:` and `rounded-card` all work.

**v3 (JavaScript config):**
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: { brand: { 500: '#6366f1', 600: '#4f46e5' } },
      fontFamily: { display: ['Inter', 'sans-serif'] },
    },
  },
};
```
In v3 use `extend` to **add** to the default theme. Writing the key directly in `theme` **replaces** the whole default (for example all default colors disappear).

### Q14. Why do dynamic class names fail? *(Very common)*
Tailwind finds classes by scanning your files as **plain text**. It does not run your code. So a class built from a string is never found.
```jsx
// ❌ Never generated
<div className={`bg-${color}-500`} />

// ✅ Write complete class names
const colors = { red: 'bg-red-500', blue: 'bg-blue-500' };
<div className={colors[color]} />
```
If the class really must come from a runtime value, use an inline style or a CSS variable:
```jsx
<div style={{ '--bg': color }} className="bg-(--bg)" />
```

### Q15. How do you combine classes conditionally? (`clsx` + `tailwind-merge`)
```js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs) => twMerge(clsx(inputs));
```
```jsx
function Button({ className, primary }) {
  return <button className={cn('rounded px-4 py-2', primary && 'bg-indigo-600 text-white', className)} />;
}
// <Button className="px-8" /> -> px-8 replaces px-4 (twMerge resolves the conflict)
```
Without `twMerge`, both `px-4` and `px-8` stay in the string. Which one wins depends on **the order in the generated CSS file, not on the order in your class attribute**.

### Q16. What are `group` and `peer`?
- `group`: style a child when the **parent** is hovered/focused.
- `peer`: style an element based on the state of a **previous sibling**.
```html
<div class="group rounded border p-4 hover:bg-gray-50">
  <h3 class="group-hover:text-indigo-600">Title</h3>
  <span class="opacity-0 group-hover:opacity-100">→</span>
</div>

<input type="checkbox" id="agree" class="peer sr-only">
<label for="agree" class="peer-checked:text-green-600 peer-focus-visible:ring-2">I agree</label>
```
Rule: the `peer` element must come **before** the element that reacts to it in the DOM. For several groups, name them: `group/card`, `group-hover/card:...`.

### Q17. What is the `container` class?
It sets `max-width` to the current breakpoint. It is **not centered and has no padding by default**. Center it yourself: `mx-auto px-4`.
```html
<div class="container mx-auto px-4">...</div>
```
In v4 you can configure it with `@utility container { margin-inline: auto; padding-inline: 1rem; }`. Many teams skip `container` and use `mx-auto max-w-6xl px-4` instead.

### Q18. `space-x-*` vs `gap-*`: what is the difference?
`gap` is a Flexbox/Grid property that creates space **between** items. `space-x` / `space-y` add margin to the siblings with a selector, which breaks when items wrap or when the order is reversed. Prefer `gap` for new code. Use `divide-y` for borders between items.

### Q19. How do you control text overflow?
```html
<p class="truncate">One line, ellipsis</p>
<p class="line-clamp-3">Three lines, then ellipsis</p>
<p class="break-words">Long words break</p>
<p class="text-balance">Balanced headings</p>
```
Inside a flex item, add `min-w-0` so `truncate` can work.

### Q20. How do you do transitions and animations?
```html
<button class="transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg">Hover</button>
<div class="animate-spin size-6 rounded-full border-2 border-t-transparent"></div>
<div class="animate-pulse h-4 w-1/2 rounded bg-gray-200"></div>
```
Built-in animations: `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce`. For custom keyframes in v4:
```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
}
```
Respect users who prefer less motion: `motion-safe:animate-spin`, `motion-reduce:transition-none`.

### Q21. Sizing utilities: `w-*`, `h-*`, `size-*`, `min-*`, `max-*`
```html
<div class="w-1/2 max-w-md min-h-screen">...</div>
<img class="size-12 rounded-full object-cover" alt="Avatar">  <!-- size = width + height -->
<div class="h-dvh">Full mobile height</div>
```
Fractions (`w-1/3`), `w-full`, `w-screen`, `w-fit`, `w-min`, `w-max`, `h-dvh/svh/lvh`, `aspect-video`, `aspect-square`.

### Q22. Positioning utilities
```html
<div class="relative">
  <span class="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 text-xs text-white">9</span>
</div>
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur">...</header>
<div class="absolute inset-0 grid place-items-center">...</div>
```
`static|relative|absolute|fixed|sticky`, `inset-*`, `top-*`, `z-10…50`, negative values with a leading dash (`-mt-4`).

### Q23. Forms with Tailwind
```html
<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
<input id="email" type="email" required
  class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm
         focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
         invalid:border-red-500 disabled:bg-gray-100">
```
Useful variants: `invalid:`, `required:`, `placeholder-shown:`, `user-invalid:`. The official `@tailwindcss/forms` plugin gives nicer default form styles.

---

# 🟡 Part 3: Mid (3–5 years)

### Q24. What are the big differences between Tailwind v3 and v4? *(Asked very often)*
- **Engine:** v4 has a new, much faster engine (Oxide, written in Rust) and uses Lightning CSS.
- **Config:** CSS-first (`@theme`, `@plugin`, `@source`, `@utility`, `@custom-variant`) instead of `tailwind.config.js` (you can still load one with `@config`).
- **Import:** `@import "tailwindcss";` replaces `@tailwind base/components/utilities`.
- **Content detection:** automatic (no `content` array; it ignores files in `.gitignore`). Add extra paths with `@source`.
- **No need** for `postcss-import` or `autoprefixer`.
- **Built-in container queries:** `@container`, `@md:`.
- **New utilities/variants:** `not-*`, `in-*`, `nth-*`, `inert`, `starting:`, 3D transforms, `field-sizing`, `inset-shadow-*`, `bg-linear-*`, `bg-radial`, `bg-conic`.
- **CSS variables everywhere:** theme values are exposed as `--color-*`, `--spacing`, etc.
- **Modern CSS:** uses cascade layers, `@property`, `color-mix()`. Needs modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+).
- **Hover:** `hover:` only applies on devices that really support hover.

### Q25. What are the main breaking renames when upgrading to v4?
| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` / `blur` | `blur-xs` / `blur-sm` |
| `outline-none` | `outline-hidden` |
| `ring` (3px) | `ring-3` (`ring` is now 1px) |
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-opacity-50` | `bg-black/50` (opacity modifier) |
| `flex-shrink-0` / `flex-grow` | `shrink-0` / `grow` |
| `overflow-ellipsis` | `text-ellipsis` |
| `bg-[--var]` | `bg-(--var)` |
| `@tailwind base;...` | `@import "tailwindcss";` |
Also: the default **border color** changed from `gray-200` to `currentColor`, and the default `ring` color changed to `currentColor`. Use the official upgrade tool: `npx @tailwindcss/upgrade`.

### Q26. How do you set up dark mode with a class or attribute in v4 and v3?
**v4:**
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
/* or with an attribute: */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```
**v3:**
```js
module.exports = { darkMode: 'class' }   // or ['selector', '[data-theme="dark"]']
```
Then toggle with JS:
```js
const root = document.documentElement;
const saved = localStorage.getItem('theme');
root.classList.toggle('dark', saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
```
Put this small script in `<head>` to avoid a flash of the wrong theme.

### Q27. What is `class-variance-authority` (CVA)? Why use it?
It defines **component variants** in a type-safe way instead of manual `if` statements. It is the pattern used by shadcn/ui.
```ts
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const button = cva('inline-flex items-center rounded-md font-medium transition focus-visible:outline-2', {
  variants: {
    intent: {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      ghost: 'bg-transparent hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;
export function Button({ intent, size, className, ...rest }: Props) {
  return <button className={cn(button({ intent, size }), className)} {...rest} />;
}
```

### Q28. How do you make reusable components with Tailwind? Do you use `@apply`?
Prefer **framework components** (React/Vue/Svelte/Angular) and keep the utilities inside them. Duplication of long class strings is fine when it lives in **one component**. Use `@apply` only for CMS/markdown content or third-party markup. For design tokens use `@theme`; for variants use CVA.

### Q29. How do container queries work in v4?
```html
<div class="@container">
  <div class="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">...</div>
</div>
```
`@container` marks a parent; `@md:`, `@lg:` respond to **that container's width** (not the viewport). Named containers: `@container/card` with `@md/card:`. In v3 this needed the `@tailwindcss/container-queries` plugin.

### Q30. What are arbitrary variants and `data-*` / `aria-*` variants?
```html
<li class="[&>p]:mt-2 [&:nth-child(3)]:font-bold">...</li>
<button data-[state=open]:bg-indigo-600 aria-expanded:rotate-180 aria-[sort=ascending]:underline>...</button>
<div class="has-[img]:p-0 supports-[backdrop-filter]:backdrop-blur">...</div>
```
`data-[state=open]:` pairs well with headless libraries (Radix, Headless UI) that set `data-state` attributes, so you do not need JS to toggle classes.

### Q31. How do you integrate Tailwind with Next.js / React / Vue / Angular?
- **Next.js:** `npm i tailwindcss @tailwindcss/postcss` with `postcss.config.mjs` plugin `@tailwindcss/postcss`, then `@import "tailwindcss";` in `globals.css`. Works with React Server Components (no runtime).
- **Vite (React/Vue/Svelte):** use `@tailwindcss/vite`.
- **Angular:** use `@tailwindcss/postcss` with the Angular CLI.
- **Vue/Svelte `<style>` blocks or CSS Modules** in v4: add `@reference "../app.css";` at the top to use theme variables and `@apply`.

### Q32. What is the Typography plugin (`prose`)?
`@tailwindcss/typography` styles raw HTML (markdown, CMS content) that you cannot add classes to.
```html
<article class="prose lg:prose-lg dark:prose-invert max-w-none">
  <h1>Title</h1><p>Body from markdown...</p>
</article>
```
In v4 enable it with `@plugin "@tailwindcss/typography";`.

### Q33. How do you add a plugin or a custom utility?
**v4:**
```css
@plugin "@tailwindcss/forms";
@utility scrollbar-hide {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
@custom-variant theme-midnight (&:where([data-theme=midnight] *));
```
**v3:**
```js
const plugin = require('tailwindcss/plugin');
module.exports = {
  plugins: [plugin(({ addUtilities }) => addUtilities({ '.scrollbar-hide': { 'scrollbar-width': 'none' } }))],
};
```

### Q34. What accessibility utilities does Tailwind give?
`sr-only` / `not-sr-only`, `focus-visible:`, `motion-reduce:` / `motion-safe:`, `forced-colors:`, `contrast-more:`, `aria-*:` variants, `outline-offset-*`, `ring-*`. Tailwind gives styling only; semantic HTML, labels and keyboard behavior are your job.

### Q35. How do you keep long class lists readable?
- Use `prettier-plugin-tailwindcss` to **sort classes automatically** in a consistent order.
- Break components into smaller components.
- Use CVA for variants.
- Group classes by purpose (layout → spacing → typography → color → state) and put each group on a new line in JSX if it helps.
- Use the Tailwind CSS IntelliSense extension (autocomplete, conflict warnings).

---

# 🟠 Part 4: Senior (5–7 years)

### Q36. How do you build a design system with Tailwind? *(Architecture)*
- **Tokens in `@theme`:** colors, spacing, radius, fonts, shadows, breakpoints. Use semantic names (`--color-surface`, `--color-primary`) instead of raw palette names in components.
- **Component library** (React/Vue) with CVA variants and `cn()`.
- **Headless primitives** (Radix UI, Headless UI, React Aria) for accessibility.
- **Shared package** that exports the theme CSS and components; apps import it.
- **Docs in Storybook** with accessibility checks and visual regression tests.
- **Governance:** lint rules, review checklist, semantic versioning, deprecation policy.

### Q37. How do you handle multi-brand or runtime theming?
Define semantic tokens as CSS variables and switch them by attribute at runtime. No per-brand build is needed.
```css
@theme inline {
  --color-primary: var(--brand-primary);
  --color-surface: var(--brand-surface);
}
:root { --brand-primary: oklch(0.55 0.2 275); --brand-surface: #fff; }
[data-brand="zen"] { --brand-primary: oklch(0.7 0.15 170); }
[data-theme="dark"] { --brand-surface: #0b0b0f; }
```
`@theme inline` makes the utility refer to the variable (`var(--brand-primary)`) so it updates at runtime. Components use `bg-primary`, `bg-surface`.

### Q38. How does Tailwind perform? What affects CSS size and build speed?
Output contains only used classes, so CSS stays small. v4 builds are several times faster (full builds very fast, incremental builds in microseconds). Keep size low by avoiding huge safelists, avoiding too many unique arbitrary values, and not generating unused custom utilities. Always serve with Brotli/gzip and a long cache with hashed filenames.

### Q39. How do you safelist classes that are only known at runtime?
**v4:** `@source inline("bg-red-500 bg-blue-500 {hover:,}text-{sm,lg}");` (brace expansion is supported).
**v3:** `safelist: ['bg-red-500', { pattern: /bg-(red|blue)-(100|500)/ }]` in the config.
Better: avoid safelists by mapping keys to full class names in code.

### Q40. How do you enforce consistency in a large team?
`prettier-plugin-tailwindcss`, ESLint (`eslint-plugin-tailwindcss` or equivalent, no contradicting classes), a rule against uncontrolled arbitrary values, tokens only for colors (no `text-[#123456]`), Storybook, PR templates, and a documented component API.

### Q41. Tailwind with React Server Components and SSR: any problems?
No. Tailwind generates static CSS at build time, so there is no runtime and no hydration issue. This is a key advantage over runtime CSS-in-JS (styled-components, emotion). Only the dark-mode flash needs care (inline script in `<head>`).

### Q42. Tailwind vs CSS Modules vs CSS-in-JS vs Bootstrap: how do you decide? *(Decision)*
| | Tailwind | CSS Modules | Runtime CSS-in-JS | Bootstrap |
|---|---|---|---|---|
| Runtime cost | None | None | Yes | None |
| Scoping | Utilities, no clash | Local by default | Local | Global |
| RSC/SSR friendly | ✅ | ✅ | ⚠️ | ✅ |
| Design flexibility | High | High | High | Medium |
| Speed to build | High | Medium | Medium | High |
| Learning curve | Class names | Low | Medium | Low |
Decide using team skills, design uniqueness, performance budget, SSR/RSC needs and long-term maintenance.

### Q43. How do you migrate an existing project (plain CSS or Bootstrap) to Tailwind?
Incremental: add Tailwind to the build next to existing CSS (use `prefix` in v3 / `@import "tailwindcss" prefix(tw)` in v4 to avoid clashes), build **new** components with Tailwind, migrate shared components page by page, remove old CSS once unused (Coverage tab), and keep visual regression tests. Disable Preflight conflicts by checking headings/links first.

### Q44. How do you upgrade a large app from v3 to v4?
Run `npx @tailwindcss/upgrade` in a branch, review the diff (renames, `@import`, config conversion), check browser support requirements, test shadows/rounded/ring/border-color visual differences, update plugins that are not v4-ready (use `@config` and `@plugin` for legacy), run visual regression, then roll out gradually.

### Q45. What about accessibility and Tailwind's focus styles?
Preflight does not remove focus rings from native elements. Always use `focus-visible:` styles for custom controls. If you use `outline-hidden` (v4) it keeps a transparent outline for forced-colors mode; do not use it without a replacement style.

### Q46. How do you test Tailwind UIs?
Visual regression (Playwright screenshots, Chromatic), component tests (Testing Library) that check behavior not class names, axe for accessibility, responsive checks at key widths. Avoid asserting exact class strings.

### Q47. How do you optimize images and layout shift with Tailwind?
Use `aspect-*`, `size-*` and explicit width/height attributes, `object-cover`, `loading="lazy"` below the fold, and skeletons (`animate-pulse`) with fixed dimensions.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q48. How would you decide to adopt Tailwind across 20 teams? *(Architecture)*
Evaluate: design uniqueness, existing stack, SSR/RSC plans, performance budget, training cost, hiring market, accessibility maturity. Run a pilot with one team and measure (CSS size, delivery speed, bug count, developer satisfaction). Provide a shared preset/theme package, lint rules, docs, workshops and a migration plan. Set success metrics before rollout.

### Q49. How do you structure Tailwind in a monorepo?
A shared `ui` package holds the theme CSS (`@theme`), base styles and components. Apps import `@org/ui/styles.css` and use `@source` to scan the `ui` package's files (so classes used there are generated). Version the package with changesets. Avoid duplicated tokens.

### Q50. How do you prevent "class soup" and inconsistent UI at scale?
Components first (not pages of raw utilities), tokens for all brand values, CVA for variants, Storybook as the single source of truth, lint + formatting, code review focus on reuse, and quarterly design/dev audits.

### Q51. How do you govern a design system built on Tailwind?
A core team owns tokens and primitives; other teams contribute through RFCs; changes follow semantic versioning; deprecations have a timeline; visual regression and accessibility tests gate every release; usage analytics show adoption.

### Q52. How do you support white-label SaaS with Tailwind?
Tenant tokens in a database, injected as CSS variables at request time (`<style>:root{...}</style>`), `@theme inline` mapping to those variables, automatic contrast validation, per-tenant caching, a fallback default theme, and no per-tenant builds.

### Q53. What are the risks of Tailwind and how do you reduce them?
Risks: inconsistent usage, giant class lists, breaking changes between major versions, browser support in v4, vendor lock-in to utility naming. Mitigation: component abstraction, lint/format tooling, pinned versions with a planned upgrade path, `@config` compatibility, and documented conventions.

### Q54. How do you measure the success of the CSS strategy?
CSS size per page, build time, Core Web Vitals (LCP/CLS/INP), number of design inconsistencies found in audits, time to build a new screen, accessibility issues per release, and developer survey results.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. Responsive navbar with a mobile menu
```html
<header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
    <a href="/" class="text-lg font-bold">Ritesh</a>
    <ul class="hidden gap-6 md:flex">
      <li><a class="text-gray-600 hover:text-black" href="#work">Work</a></li>
      <li><a class="text-gray-600 hover:text-black" href="#about">About</a></li>
    </ul>
    <button id="burger" class="md:hidden rounded p-2 hover:bg-gray-100" aria-expanded="false" aria-controls="menu" aria-label="Open menu">☰</button>
  </nav>
  <ul id="menu" class="hidden border-t px-4 py-2 md:hidden">
    <li><a class="block py-2" href="#work">Work</a></li>
    <li><a class="block py-2" href="#about">About</a></li>
  </ul>
</header>
<script>
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    burger.setAttribute('aria-expanded', String(open));
  });
</script>
```

### C2. Responsive card grid
```html
<section class="mx-auto max-w-6xl px-4 py-10">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <article class="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <img class="aspect-video w-full object-cover" src="a.webp" alt="Project screenshot" width="640" height="360" loading="lazy">
      <div class="p-4">
        <h3 class="font-semibold group-hover:text-indigo-600">Project name</h3>
        <p class="mt-1 line-clamp-2 text-sm text-gray-600">Short description that can be long and will be cut after two lines.</p>
      </div>
    </article>
  </div>
</section>
```

### C3. Button component with variants (React + CVA)
Use the `Button` from Q27. Usage:
```jsx
<Button intent="danger" size="lg" onClick={remove}>Delete</Button>
<Button intent="ghost" className="px-8">Cancel</Button>
```

### C4. Login form
```html
<form class="mx-auto w-full max-w-sm space-y-4 rounded-xl border bg-white p-6 shadow-sm">
  <h1 class="text-xl font-semibold">Sign in</h1>
  <div>
    <label for="mail" class="block text-sm font-medium">Email</label>
    <input id="mail" type="email" required autocomplete="email"
      class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 invalid:border-red-500">
  </div>
  <div>
    <label for="pw" class="block text-sm font-medium">Password</label>
    <input id="pw" type="password" required minlength="8" autocomplete="current-password"
      class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
  </div>
  <button class="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">Sign in</button>
</form>
```

### C5. Modal with the native `<dialog>`
```html
<button id="open" class="rounded bg-indigo-600 px-4 py-2 text-white">Open</button>
<dialog id="dlg" class="m-auto w-full max-w-md rounded-xl p-6 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm">
  <h2 class="text-lg font-semibold">Delete this item?</h2>
  <p class="mt-2 text-gray-600">This cannot be undone.</p>
  <form method="dialog" class="mt-6 flex justify-end gap-2">
    <button class="rounded border px-4 py-2">Cancel</button>
    <button value="ok" class="rounded bg-red-600 px-4 py-2 text-white">Delete</button>
  </form>
</dialog>
<script>open.onclick = () => dlg.showModal();</script>
```
`backdrop:` styles the `::backdrop`.

### C6. Skeleton loader
```html
<div class="flex animate-pulse gap-4 p-4" aria-busy="true" aria-label="Loading">
  <div class="size-12 rounded-full bg-gray-200"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="h-4 w-3/4 rounded bg-gray-200"></div>
    <div class="h-4 w-1/2 rounded bg-gray-200"></div>
  </div>
</div>
```

### C7. Pricing section
```html
<div class="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
  <div class="flex flex-col rounded-2xl border p-6">
    <h3 class="text-lg font-semibold">Free</h3>
    <p class="mt-2 text-4xl font-bold">$0<span class="text-base font-normal text-gray-500">/mo</span></p>
    <ul class="mt-6 space-y-2 text-sm text-gray-600"><li>1 project</li><li>Email support</li></ul>
    <a href="#" class="mt-auto rounded-lg border px-4 py-2 text-center hover:bg-gray-50">Start free</a>
  </div>
  <div class="flex flex-col rounded-2xl border-2 border-indigo-600 p-6 shadow-lg">
    <h3 class="text-lg font-semibold text-indigo-600">Pro</h3>
    <p class="mt-2 text-4xl font-bold">$15<span class="text-base font-normal text-gray-500">/mo</span></p>
    <ul class="mt-6 space-y-2 text-sm text-gray-600"><li>20 projects</li><li>Priority support</li></ul>
    <a href="#" class="mt-auto rounded-lg bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700">Get Pro</a>
  </div>
</div>
```

### C8. Dashboard layout (sidebar + content)
```html
<div class="grid min-h-dvh grid-cols-1 md:grid-cols-[16rem_1fr]">
  <aside class="hidden border-r bg-gray-50 p-4 md:block">
    <nav class="space-y-1">
      <a class="block rounded-md bg-indigo-600 px-3 py-2 text-white" href="#">Dashboard</a>
      <a class="block rounded-md px-3 py-2 hover:bg-gray-200" href="#">Orders</a>
    </nav>
  </aside>
  <main class="p-6"><h1 class="text-2xl font-bold">Dashboard</h1></main>
</div>
```

### C9. Dark mode toggle button
```html
<button id="theme" class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-pressed="false">🌓</button>
<script>
  theme.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    theme.setAttribute('aria-pressed', String(dark));
  });
</script>
```
(Needs the class-based dark variant from Q26.)

### C10. Accordion without JavaScript (`<details>`)
```html
<details class="group rounded-lg border p-4 open:bg-gray-50">
  <summary class="flex cursor-pointer list-none items-center justify-between font-medium">
    What is your refund policy?
    <span class="transition group-open:rotate-180">⌄</span>
  </summary>
  <p class="mt-2 text-gray-600">Full refund within 7 days.</p>
</details>
```

### C11. Hero with gradient text
```html
<section class="bg-gradient-to-b from-indigo-50 to-white py-20 text-center">   <!-- v4: bg-linear-to-b -->
  <h1 class="text-5xl font-extrabold tracking-tight">
    Hi, I am <span class="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Ritesh Kumar</span>
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-lg text-gray-600">Full-stack developer with 7 years of experience.</p>
</section>
```
(In v4 use `bg-linear-to-b` and `bg-linear-to-r`; the old `bg-gradient-to-*` names still work in many setups, but the new name is the standard.)

---

# 🐞 Part 7: Debugging Scenarios

### D1. My Tailwind classes do not apply at all.
Checklist: (v4) `@import "tailwindcss";` present and the CSS file imported in your entry; the Vite/PostCSS plugin installed; (v3) `content` paths wrong, so files are not scanned; the dev server not restarted after config changes; a typo in the class name; the file is outside the scanned paths (add `@source "../node_modules/my-ui"`); class names built dynamically.

### D2. Classes work in development but disappear in production.
The class only exists as a built string (`` `text-${size}` ``), or the file is not scanned in production, or the class is in a package inside `node_modules` (add `@source`). Fix by using full class names or `@source inline(...)` / `safelist`.

### D3. `px-4 px-8` — which one wins?
It does not depend on the order in `class`. It depends on the order in the generated CSS. Do not write conflicting classes. Use `twMerge` when merging classes from props.

### D4. Dark mode does not work when I add the `dark` class.
In v4 the default `dark:` variant uses `prefers-color-scheme`. You must add `@custom-variant dark (&:where(.dark, .dark *));`. In v3 set `darkMode: 'class'`. Also check that the class is on `<html>`.

### D5. Arbitrary value does not work: `grid-cols-[1fr 2fr]`.
Spaces must be underscores: `grid-cols-[1fr_2fr]`. For content with real underscores, escape with a backslash.

### D6. `peer-checked:` does nothing.
The `peer` element must come **before** the styled element in the DOM, and they must be siblings. Also check that the peer is the element that holds the state (the input).

### D7. `group-hover` does not work in a nested group.
Use named groups: `group/card` on the parent and `group-hover/card:` on the child to target the right ancestor.

### D8. Headings and lists look unstyled.
That is Preflight (reset). Add classes (`text-2xl font-bold`, `list-disc pl-5`), or wrap markdown in `prose`.

### D9. `container` is not centered.
Add `mx-auto` and padding (`px-4`) or configure with `@utility container`.

### D10. `truncate` does not work in a flex layout.
The flex item needs `min-w-0` (or `overflow-hidden`) so it can shrink below its content size.

### D11. Hover styles do not work on mobile after upgrading to v4.
In v4 `hover:` only applies on devices that support hover. This is intentional. Use `active:` or `focus-visible:` for touch feedback.

### D12. After upgrading to v4, borders and rings look different.
Default border color is now `currentColor` and `ring` is 1px. Add explicit `border-gray-200` and use `ring-3` to keep the old look.

### D13. Styles from my CSS file override Tailwind.
Tailwind v4 uses cascade layers. Unlayered CSS beats layered CSS. Put your CSS inside `@layer base/components/utilities` if you want Tailwind utilities to win, or load it appropriately.

### D14. `@apply` fails with "Cannot apply unknown utility class".
In v4, inside Vue/Svelte `<style>` blocks or CSS Modules you must add `@reference "../app.css";`. In v3, custom classes you apply must be defined in `@layer components`.

### D15. Build is slow or CSS is huge.
Check that you are not scanning `node_modules` or build output, remove giant safelists, and avoid generating huge numbers of arbitrary values. Use v4 for faster builds.

---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Does the order of classes in the `class` attribute matter?
No. The order of rules in the generated CSS decides, not the order in HTML.

### T2. Is `w-1/2` the same as `w-[50%]`?
Yes, both give `width: 50%`. The first is from the scale and preferred.

### T3. What does `text-lg` set besides font size?
It also sets a default `line-height` (1.75rem in v3 / from `--text-lg--line-height` in v4). Override with `leading-*` or `text-lg/6`.
```html
<p class="text-lg/6">font-size lg, line-height 1.5rem</p>
```

### T4. How do you write a negative value?
Put a dash before the utility: `-mt-4`, `-translate-x-1/2`, `-inset-2`. For arbitrary values: `-mt-[3px]` or `mt-[-3px]`.

### T5. `hidden` vs `invisible` vs `opacity-0`?
`hidden` = `display: none` (no space). `invisible` = `visibility: hidden` (keeps space). `opacity-0` = transparent but still takes space and still receives clicks.

### T6. What is the difference between `ring` and `outline` and `border`?
`border` takes space in layout. `ring` is a `box-shadow` (no layout space). `outline` is outside the border, does not affect layout, follows the border radius in modern browsers, and shows in forced-colors mode.

### T7. Does `dark:` need a config in v3? In v4?
v3: default is `media` (OS setting); `class` strategy needs `darkMode: 'class'`. v4: default is media; for class/attribute you define `@custom-variant dark`.

### T8. How do you apply `!important`?
v4: add `!` at the end: `bg-red-500!`. v3: add `!` at the start: `!bg-red-500`. v4 still accepts the old position for compatibility, but use the new one.

### T9. Why is `space-y-4` bad with `flex-wrap` or `hidden` children?
It uses a sibling selector with margin. Wrapped rows do not get correct spacing and hidden elements can leave strange gaps. Use `gap`.

### T10. `rounded-full` on a non-square element?
Gives a pill/oval shape. Use `size-*` for a circle.

### T11. What is `size-*`?
A shortcut for `width` and `height` together: `size-10` = `w-10 h-10`.

### T12. What does `/` do in `bg-black/50`?
It is the opacity modifier: 50% opacity (the old `bg-opacity-*` utilities are removed in v4). Works with arbitrary values: `bg-black/[0.35]`.

### T13. Can Tailwind work without Node?
Yes: the **standalone CLI** binary or the **Play CDN** (for prototypes only, not production).

### T14. Is the `prefix` option available in v4?
Yes, with a different syntax: `@import "tailwindcss" prefix(tw);` and you write `tw:flex tw:bg-red-500`.

### T15. Why can `@apply` hurt?
It recreates the problem of naming and separate CSS, hides which utilities a class contains, and can create larger CSS because the same declarations are duplicated in each class. Prefer components.

### T16. Are arbitrary values bad?
Occasional use is fine. If you repeat the same one more than 2–3 times, add it to `@theme` as a token. Frequent arbitrary values break design consistency.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Tailwind is...? | A utility-first CSS framework |
| Default spacing unit? | 0.25rem (4px) |
| Mobile-first prefix means? | "From this breakpoint up" |
| `md:` breakpoint? | 768px |
| Center a div? | `grid place-items-center` or `flex items-center justify-center` |
| Hide on mobile, show on md? | `hidden md:block` |
| Rounded circle? | `rounded-full` + equal width/height |
| Full-height screen? | `min-h-screen` / `min-h-dvh` |
| Dark mode prefix? | `dark:` |
| Group hover? | `group` + `group-hover:` |
| Opacity color? | `bg-black/50` |
| Arbitrary value? | `w-[372px]` |
| One-line ellipsis? | `truncate` |
| Multi-line ellipsis? | `line-clamp-3` |
| Screen-reader only? | `sr-only` |
| Aspect ratio 16:9? | `aspect-video` |
| Sticky header? | `sticky top-0` |
| Gap between flex items? | `gap-4` |
| Responsive grid columns? | `grid-cols-1 md:grid-cols-3` |
| Transition? | `transition duration-200` |
| Spin animation? | `animate-spin` |
| Remove list bullets? | Already removed by Preflight; add `list-disc` for bullets |
| Config file in v4? | CSS (`@theme`), JS config optional |
| Merge class conflicts? | `tailwind-merge` |
| Variants helper? | `class-variance-authority` |
| Sort classes automatically? | `prettier-plugin-tailwindcss` |
| Typography plugin class? | `prose` |
| Container query prefix? | `@md:` (needs `@container` parent) |
| Important modifier (v4)? | `bg-red-500!` |
| Upgrade tool? | `npx @tailwindcss/upgrade` |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a project where you used Tailwind. Why did you choose it?"
**Sample answer (STAR):**
- **S:** We were building a customer dashboard with a custom brand, and our old SCSS had grown to 600 KB with lots of dead code.
- **T:** Deliver a faster, more consistent UI and cut CSS size.
- **A:** I introduced Tailwind with tokens in the theme (colors, spacing, radius) and built a small component library with CVA and `cn()`. I added `prettier-plugin-tailwindcss`, ESLint rules and Storybook. We migrated page by page.
- **R:** CSS dropped from 600 KB to 28 KB (gzip), new screens were built about 30% faster, and visual inconsistencies found in audits fell from 35 to 4. (These are sample numbers. In the interview, use your own real numbers.)

### P2. "How did you avoid messy class lists?"
Component extraction, CVA for variants, token-only colors, formatting with the Prettier plugin, and review rules. Mention that long class strings in one component are acceptable.

### P3. "Tell me about an issue with Tailwind in production."
Example: dynamic classes (`bg-${color}-500`) vanished in production. Root cause: Tailwind scans text. Fix: full class map. Prevention: ESLint rule + code review note + documentation.

### P4. "How did you handle dark mode and theming?"
Semantic tokens via CSS variables, `@custom-variant dark`, inline script to avoid flash, contrast checks, and tests for both themes.

### P5. "What would you tell a team that wants to move from Bootstrap to Tailwind?"
Explain pros/cons, run a pilot, build a shared theme and component library, migrate gradually, keep old and new CSS isolated with a prefix, measure results, and plan training.

### P6. "How do you review Tailwind code?"
Check for reuse (components), tokens instead of arbitrary values, no conflicting classes, responsive and state coverage, accessibility (focus-visible, labels, contrast), and no dynamic class strings.

### P7. "What is your opinion of the criticism that Tailwind is ugly or like inline styles?"
Respond with facts: utilities are constrained by a design scale, support responsive/state variants (inline styles do not), are generated into one small shared stylesheet, and live next to the markup, which removes naming and dead-CSS problems. The trade-off is long class strings, handled with components.

---

# 📚 Part 11: Complete Coverage (Classic + Advanced + Mixed)

## 11A. Classic Tailwind Questions

### K1. What are the pros and cons of Tailwind?
**Pros:** speed, consistency, small CSS, no naming, easy refactor (delete the element, delete its styles), responsive and state variants built in, great with component frameworks, strong tooling.
**Cons:** long class lists, learning curve, can be inconsistent without discipline, requires build step, major version changes (v3 → v4), HTML gets noisy.

### K2. How does Tailwind remove unused CSS?
It does not "remove" it. It scans your source for class names and **generates only those classes** (Just-in-Time). In v3 this is configured with `content`; in v4 it is automatic.

### K3. What are the layers in Tailwind? (`base`, `components`, `utilities`)
In v3: `@layer base { h1 { ... } }`, `@layer components { .btn { ... } }`, `@layer utilities { .tab-4 { tab-size: 4 } }`. Utilities come last so they override components. In v4 these are native CSS cascade layers (`@layer theme, base, components, utilities;`), and you create utilities with `@utility`.

### K4. How do you use custom fonts?
```css
@import "tailwindcss";
@theme { --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif; --font-display: "Playfair Display", serif; }
@font-face { font-family: "Inter"; src: url("/fonts/inter.woff2") format("woff2"); font-display: swap; }
```
Use `font-sans` (default), `font-display`.

### K5. How do you override or remove default colors?
v4: `--color-*: initial;` inside `@theme` removes all defaults, then add your own.
```css
@theme { --color-*: initial; --color-white: #fff; --color-brand: #6366f1; }
```
v3: put `colors` directly under `theme` (not under `extend`).

### K6. How do you use `@layer` to add base styles?
```css
@layer base {
  html { scroll-behavior: smooth; }
  a { @apply underline-offset-4; }
}
```

### K7. What are the default font sizes?
`text-xs` 12px, `sm` 14, `base` 16, `lg` 18, `xl` 20, `2xl` 24, `3xl` 30, `4xl` 36, `5xl` 48, `6xl` 60, `7xl` 72, `8xl` 96, `9xl` 128.

### K8. How do you add a custom breakpoint?
v4: `@theme { --breakpoint-3xl: 120rem; }` then `3xl:flex`. v3: `theme.extend.screens: { '3xl': '1920px' }`.

## 11B. Advanced Tailwind

### A1. How does `@theme inline` differ from `@theme`?
`@theme` creates CSS variables and utilities that use `var(--color-primary)`. With `inline`, the utility uses the **value** directly. Use `inline` when the value references another variable (like `var(--brand-primary)`) so the final utility resolves correctly.

### A2. How do you use `@source`?
Tell Tailwind to scan extra paths (for example a UI package in `node_modules` or a monorepo folder):
```css
@source "../../packages/ui/src";
@source not "../legacy";
```

### A3. What is `starting:` and `inert:` and `not-*`?
`starting:` styles an element's initial state for entry transitions (works with `@starting-style`). `inert:` targets elements with the `inert` attribute. `not-*` negates a variant: `not-hover:opacity-80`, `not-first:mt-4`.

### A4. How do you use 3D transforms and `perspective` in v4?
```html
<div class="perspective-distant"><div class="rotate-x-12 rotate-y-12 transform-3d">Card</div></div>
```

### A5. How does the opacity modifier work with theme colors?
Tailwind uses `color-mix()` under the hood in v4: `bg-primary/50` becomes a mix with transparent, which works even if the color is a CSS variable.

### A6. Can you animate with Tailwind and CSS variables?
Yes. Use `@property` for typed variables and utilities like `transition-[--angle]`, or use arbitrary properties: `[--angle:0deg] hover:[--angle:180deg]`.

### A7. What are arbitrary properties?
`[mask-type:luminance]`, `[--my-var:10px]` let you set any CSS property when there is no utility.

## 11C. HTML + CSS + JS Mixed

### M1. How do you toggle classes with JavaScript?
```js
el.classList.toggle('hidden');
el.classList.add('opacity-100', 'translate-y-0');
el.classList.remove('opacity-0', 'translate-y-2');
```
Make sure each full class name exists as a string in your source.

### M2. How do you animate an element in/out with Tailwind and JS?
```html
<div id="toast" class="pointer-events-none translate-y-2 opacity-0 transition duration-300">Saved</div>
<script>
  function show() {
    toast.classList.remove('translate-y-2', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-2', 'opacity-0'), 2500);
  }
</script>
```

### M3. How do you pass a runtime value to a Tailwind class?
Use a CSS variable.
```jsx
<div style={{ '--w': `${percent}%` }} className="h-2 w-(--w) rounded bg-indigo-600" />
```

### M4. How do you read the current breakpoint in JS?
Use `matchMedia('(min-width: 768px)')` with the same value as your breakpoint (`md` = 768px), or a library like `useMediaQuery`.

### M5. Tailwind with an accessible custom component (tabs)
```html
<button role="tab" aria-selected="true"
  class="border-b-2 border-transparent px-4 py-2 aria-selected:border-indigo-600 aria-selected:font-semibold">Home</button>
```
The `aria-selected:` variant avoids a separate "active" class.

---

# 🧠 Part 12: Internals & How Tailwind Works

### B1. How does Tailwind generate CSS?
1. It **scans** your source files for strings that look like class names.
2. It **parses** each candidate (variants, utility, value, modifier).
3. It **generates** the matching CSS rule from the theme/utility definitions.
4. It **sorts** rules into a stable order (variants after base utilities, responsive after others).
5. It **outputs** one CSS file with only the used rules.
v4's engine does this in Rust and is much faster.

### B2. How are variants ordered in the CSS?
Rules are ordered so that later variants override earlier ones: base utilities → `hover`/`focus` → responsive (`sm`, `md`, `lg`...) → `dark` → `print`. That is why `md:p-8` beats `p-4` at wide screens regardless of the order in HTML.

### B3. What is the v4 theme system?
Theme values are CSS variables in a `theme` layer (`--color-red-500`, `--spacing`, `--text-lg`). Utilities read them, such as `bg-red-500 { background-color: var(--color-red-500) }`. Only variables that are actually used are output (unless you use `@theme static`).

### B4. How does v4 handle `spacing`?
One variable: `--spacing: 0.25rem`. A class such as `p-4` becomes `padding: calc(var(--spacing) * 4)`. That is why any number works (`p-13`).

### B5. How do cascade layers help?
Tailwind v4 emits `@layer theme, base, components, utilities;`. Utilities always beat base and components regardless of specificity. Your unlayered CSS beats all layered CSS, which is why you should put custom CSS in a layer when you want utilities to win.

### B6. How does the standalone CLI differ from the PostCSS plugin?
The CLI is a single binary (no Node needed) to compile CSS. The PostCSS/Vite plugins integrate into your bundler pipeline and enable HMR. For apps, use the bundler plugin.

### B7. What happens in dev vs production builds?
Dev: incremental rebuilds, source maps. Production: minified by Lightning CSS, only used classes included. Cache and compress the file.

---

# 📋 Part 13: Reference Tables

### R1. Breakpoints
| Prefix | Min width | Media query |
|---|---|---|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

### R2. Spacing scale (v3 default; v4 is multiples of 0.25rem)
| Class suffix | rem | px |
|---|---|---|
| 0.5 | 0.125 | 2 |
| 1 | 0.25 | 4 |
| 2 | 0.5 | 8 |
| 3 | 0.75 | 12 |
| 4 | 1 | 16 |
| 6 | 1.5 | 24 |
| 8 | 2 | 32 |
| 12 | 3 | 48 |
| 16 | 4 | 64 |
| 24 | 6 | 96 |

### R3. Font weights
`font-thin` 100 · `extralight` 200 · `light` 300 · `normal` 400 · `medium` 500 · `semibold` 600 · `bold` 700 · `extrabold` 800 · `black` 900.

### R4. Color palette
slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose. Shades: 50, 100, 200 … 900, 950.

### R5. Layout utility cheat sheet
| Need | Classes |
|---|---|
| Flex row, centered | `flex items-center justify-center` |
| Flex column | `flex flex-col gap-4` |
| Space between | `flex justify-between` |
| Grid 3 columns | `grid grid-cols-3 gap-4` |
| Auto-fit grid | `grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4` |
| Center with grid | `grid place-items-center` |
| Full width, max width | `w-full max-w-md mx-auto` |
| Sticky header | `sticky top-0 z-50` |
| Overlay | `fixed inset-0 bg-black/50` |

### R6. Common variants
`hover, focus, focus-visible, focus-within, active, disabled, checked, required, invalid, first, last, odd, even, empty, group-*, peer-*, dark, sm…2xl, max-*, min-*, print, motion-safe, motion-reduce, portrait, landscape, rtl, ltr, before, after, placeholder, file, marker, selection, open, data-[...], aria-[...], has-[...], supports-[...], not-*, in-*, nth-*, starting, inert, @container (@sm…)`.

### R7. v3 → v4 rename table
(See Q25 in Part 3.)

### R8. Typical file structure for a v4 + React app
```
src/
  index.css        <- @import "tailwindcss"; @theme { ... }
  lib/utils.ts     <- cn()
  components/
    ui/button.tsx  <- CVA variants
vite.config.ts     <- @tailwindcss/vite
```

---

# 🧩 Part 14: Output-Based & Spot the Error

### O1. What padding at 800px width?
```html
<div class="p-4 md:p-8 lg:p-12">
```
800px is ≥768 (md) and <1024 (lg), so `md:p-8` applies: **2rem (32px)**. At 1100px: `p-12` = 3rem.

### O2. What width at 700px?
```html
<div class="w-1/2 md:w-1/3">
```
700px is below md, so **50%**. At 800px: 33.33%.

### O3. What is wrong here?
```jsx
<div className={`text-${size}`}>Hi</div>
```
Dynamic class: Tailwind cannot find `text-lg` in the source text, so no CSS is generated. Use a full-class map.

### O4. What does this produce?
```html
<div class="grid-cols-[1fr_2fr]">
```
`grid-template-columns: 1fr 2fr`. Underscores become spaces.

### O5. Which color wins?
```html
<p class="text-red-500 text-blue-500">Hello</p>
```
Not decided by HTML order. The one defined later in Tailwind's generated CSS wins (usually blue-500 here, but never rely on it). Remove the conflict.

### O6. Why does the checkbox label not change color?
```html
<label for="a" class="peer-checked:text-green-600">Agree</label>
<input id="a" type="checkbox" class="peer">
```
The `peer` input comes **after** the label. A peer must come **before** the element that reacts. Swap the order.

### O7. What does `-translate-x-1/2` do?
It moves the element left by 50% of its own width (`translateX(-50%)`). Used with `left-1/2` for centering.

### O8. What does `bg-black/50` give?
Black background at 50% opacity.

### O9. What is the result?
```html
<div class="hidden md:flex">
```
Hidden below 768px, `display: flex` from 768px up.

### O10. What does `max-md:hidden` do?
Hides the element **below** 768px (it applies only when the viewport is smaller than md).

### O11. Spot the problem:
```html
<div class="container">Content</div>
```
The container is not centered and has no padding. Add `mx-auto px-4`.

### O12. What happens?
```html
<button class="bg-blue-500 hover:bg-blue-700 disabled:opacity-50" disabled>Save</button>
```
The button has `opacity: 0.5`. The hover color still applies in some cases because `disabled:` does not remove `hover:`; add `disabled:hover:bg-blue-500` or `enabled:hover:bg-blue-700`.

### O13. What does `w-[calc(100%-2rem)]` do?
`width: calc(100% - 2rem)`. Tailwind adds spaces around the operators for you inside `calc` in arbitrary values.

### O14. Why does `truncate` fail?
```html
<div class="flex"><p class="truncate">Very long text ...</p></div>
```
The `p` is a flex item and cannot shrink below its content width. Add `min-w-0` to the `p`.

---

# ✅ Part 15: MCQs

1. Tailwind is a... → **utility-first CSS framework**
2. Default spacing unit? → **0.25rem (4px)**
3. `md:` means? → **min-width 768px (from md up)**
4. Which class hides an element on mobile and shows on md? → **`hidden md:block`**
5. Which package is the v4 Vite plugin? → **`@tailwindcss/vite`**
6. Which directive imports Tailwind in v4? → **`@import "tailwindcss";`**
7. Where do you define theme tokens in v4? → **`@theme` in CSS**
8. What replaced `bg-gradient-to-r` in v4? → **`bg-linear-to-r`**
9. What is the v4 `shadow-xs`? → **The old `shadow-sm`**
10. Which helper merges conflicting Tailwind classes? → **`tailwind-merge`**
11. Which library builds component variants? → **`class-variance-authority`**
12. `gap-4` equals? → **1rem**
13. What does `size-10` set? → **width and height 2.5rem**
14. Which class limits text to 3 lines? → **`line-clamp-3`**
15. How do you write opacity for a color? → **`bg-black/50`**
16. How do you write a space in an arbitrary value? → **Use an underscore**
17. Which element must come first for `peer`? → **The peer element (the one whose state changes)**
18. Which classes are safe for the scanner? → **Complete class names written in the source**
19. Does the order of classes in HTML decide the winner of conflicts? → **No**
20. Which prefix targets screens smaller than md? → **`max-md:`**
21. Which plugin styles raw markdown HTML? → **`@tailwindcss/typography` (`prose`)**
22. Which class makes screen-reader-only text? → **`sr-only`**
23. What does Preflight do? → **Resets browser default styles**
24. Which variant reacts to a parent's hover? → **`group-hover:`**
25. How do you enable class-based dark mode in v4? → **`@custom-variant dark (&:where(.dark, .dark *));`**
26. What does `@apply` do? → **Inlines utilities into a custom CSS rule**
27. What does `@source` do? → **Adds extra paths for class scanning**
28. Which upgrade command exists for v3 → v4? → **`npx @tailwindcss/upgrade`**
29. Which class makes the element a circle? → **`rounded-full` with equal width and height**
30. What is `@container` used for? → **Container queries**
31. Which class prevents flex item text from truncating when it should? → **Missing `min-w-0`**
32. Which unit is `h-dvh`? → **Dynamic viewport height**
33. Which class adds a focus ring only for keyboard users? → **`focus-visible:ring-*`**
34. What is `ring` default width in v4? → **1px (use `ring-3` for the old 3px)**
35. What is the default border color in v4? → **`currentColor`**
36. Which modifier makes a utility `!important` in v4? → **A trailing `!` (`bg-red-500!`)**
37. Which Tailwind class gives a 16:9 box? → **`aspect-video`**
38. How do you remove all default colors in v4? → **`--color-*: initial;` in `@theme`**
39. Which one needs JS in Tailwind? → **None; Tailwind has no JS**
40. Which tool sorts Tailwind classes automatically? → **`prettier-plugin-tailwindcss`**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are the mistakes that developers make again and again with Tailwind. Interviewers often ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Building class names dynamically
**❌ Wrong:**
```jsx
<div className={`bg-${color}-500 text-${size}`} />
```
**🤔 Why it is a problem:** Tailwind reads your files as plain text. It never sees `bg-red-500`, so no CSS is generated. It works only if the class happens to appear somewhere else.

**✅ Correct:**
```jsx
const COLORS = { red: 'bg-red-500', blue: 'bg-blue-500' };
const SIZES = { sm: 'text-sm', lg: 'text-lg' };
<div className={`${COLORS[color]} ${SIZES[size]}`} />
```
**💬 Say:** "Tailwind scans text, so I always write complete class names."

---

### Mistake 2: Writing conflicting classes and expecting the last one to win
**❌ Wrong:**
```jsx
<Button className="px-8" />   // inside Button: className={`px-4 ${className}`}
```
**🤔 Why it is a problem:** Both `px-4` and `px-8` are present. The winner depends on the order in the generated CSS, not on the HTML order.

**✅ Correct:**
```js
import { twMerge } from 'tailwind-merge';
className={twMerge('px-4', className)}   // px-8 replaces px-4
```
**💬 Say:** "I merge class names with `tailwind-merge` so overrides are predictable."

---

### Mistake 3: Overusing `@apply`
**❌ Wrong:**
```css
.card { @apply rounded-xl border bg-white p-4 shadow; }
.card-title { @apply text-lg font-semibold; }
.card-body { @apply mt-2 text-gray-600; }
```
**🤔 Why it is a problem:** It brings back naming, separate CSS files and hidden styles, which is what utility-first removes. It can also add duplicate CSS.

**✅ Correct:** Make a `Card` component and keep the utilities inside it.
```jsx
function Card({ title, children }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-gray-600">{children}</div>
    </div>
  );
}
```
**💬 Say:** "I extract components, not CSS classes. `@apply` is for content I do not control."

---

### Mistake 4: Using too many arbitrary values
**❌ Wrong:**
```html
<div class="mt-[13px] w-[317px] text-[#4f46e6] p-[7px] rounded-[9px]">
```
**🤔 Why it is a problem:** It ignores the design scale, so the UI becomes inconsistent. Colors like `#4f46e6` vs `#4f46e5` are almost the same by mistake.

**✅ Correct:** Use the scale and add tokens.
```css
@theme { --color-brand-600: #4f46e5; --radius-card: 0.75rem; }
```
```html
<div class="mt-3 w-80 text-brand-600 p-2 rounded-card">
```
**💬 Say:** "Arbitrary values are an exception. Repeated values become tokens."

---

### Mistake 5: Forgetting that breakpoints are mobile-first
**❌ Wrong:**
```html
<div class="md:hidden lg:block">   <!-- trying to show only on lg -->
<div class="sm:text-sm text-lg">   <!-- thinking sm is "small screens" -->
```
**🤔 Why it is a problem:** `sm:` means "640px and up", not "small screens". Developers often style the phone with `sm:`.

**✅ Correct:**
```html
<div class="text-sm md:text-lg">    <!-- base = mobile, md = from 768px -->
<div class="hidden lg:block">
```
**💬 Say:** "Unprefixed classes are for mobile. Prefixes add changes as the screen grows."

---

### Mistake 6: Putting everything in one giant component with hundreds of utilities
**❌ Wrong:** A 400-line JSX file with 25-class strings and copy-pasted blocks.
**🤔 Why it is a problem:** Hard to read, hard to change, easy to make small inconsistencies.

**✅ Correct:** Small components, CVA for variants, a `ui/` folder, and `prettier-plugin-tailwindcss` for stable order.
**💬 Say:** "Long class lists are fine inside a small component; they are not fine copied 30 times."

---

### Mistake 7: Using `space-x` / `space-y` with wrapping or hidden items
**❌ Wrong:**
```html
<div class="flex flex-wrap space-x-4">...</div>
```
**🤔 Why it is a problem:** `space-x` uses margin on siblings. When items wrap, the left margin stays on the first item of the next line and spacing breaks.

**✅ Correct:**
```html
<div class="flex flex-wrap gap-4">...</div>
```
**💬 Say:** "I use `gap`; it is built for this."

---

### Mistake 8: Not including paths from packages in the scan
**❌ Wrong:** Using Tailwind classes inside a shared UI package, but Tailwind never scans it.
**🤔 Why it is a problem:** Classes in `node_modules` or other folders are not generated, so components look unstyled in production.

**✅ Correct (v4):**
```css
@source "../node_modules/@org/ui";
```
(v3: add the path to `content`.)
**💬 Say:** "I add every folder that contains class names to the scan paths."

---

### Mistake 9: Removing focus styles
**❌ Wrong:**
```html
<button class="outline-none focus:outline-none">Save</button>
```
**🤔 Why it is a problem:** Keyboard users cannot see where they are (accessibility failure). In v4, `outline-none` also fully removes the outline; use `outline-hidden` only with a replacement.

**✅ Correct:**
```html
<button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
```
**💬 Say:** "I never remove focus without a visible replacement."

---

### Mistake 10: Using `container` without centering and padding
**❌ Wrong:**
```html
<div class="container">...</div>
```
**🤔 Why it is a problem:** It is left-aligned with no padding, so content touches the screen edge on mobile.

**✅ Correct:**
```html
<div class="mx-auto w-full max-w-6xl px-4">...</div>
```
**💬 Say:** "I create my own page wrapper with `max-w`, `mx-auto` and padding."

---

### Mistake 11: Relying on `dark:` without configuring how dark mode is chosen
**❌ Wrong:** Adding a `dark` class to `<html>` and expecting `dark:` to work in v4 with no config.
**🤔 Why it is a problem:** Default `dark:` follows `prefers-color-scheme`, not your class.

**✅ Correct (v4):**
```css
@custom-variant dark (&:where(.dark, .dark *));
```
(v3: `darkMode: 'class'`.) Also add the inline script in `<head>` to prevent a flash.
**💬 Say:** "I decide the dark-mode strategy first and test both themes."

---

### Mistake 12: Using hard-coded palette colors instead of semantic tokens
**❌ Wrong:**
```html
<button class="bg-indigo-600 text-white hover:bg-indigo-700">
```
repeated in 200 places.
**🤔 Why it is a problem:** Rebranding or dark mode needs 200 edits.

**✅ Correct:**
```css
@theme { --color-primary: var(--brand-primary); --color-primary-hover: var(--brand-primary-hover); }
```
```html
<button class="bg-primary text-white hover:bg-primary-hover">
```
**💬 Say:** "Components use semantic tokens, so theming is a variable change."

---

### Mistake 13: Forgetting `min-w-0` in flex layouts when truncating
**❌ Wrong:**
```html
<div class="flex"><p class="truncate">Very long title...</p></div>
```
**🤔 Why it is a problem:** A flex item cannot shrink below its content width, so the text pushes the layout wider instead of truncating.

**✅ Correct:**
```html
<div class="flex"><p class="min-w-0 truncate">Very long title...</p></div>
```
**💬 Say:** "`truncate` in a flex item needs `min-w-0`."

---

### Mistake 14: Not handling v4 default changes after an upgrade
**❌ Wrong:** Upgrading to v4 and not checking borders, rings, shadows, rounded sizes.
**🤔 Why it is a problem:** Default border and ring colors are now `currentColor`, `ring` is 1px, and `shadow`/`rounded` scale names shifted. The UI changes silently.

**✅ Correct:** Run the upgrade tool, add explicit `border-gray-200` and `ring-3` where needed, review visual regression results.
**💬 Say:** "I treat a major version upgrade as a visual change and test it."

---

### Mistake 15: Mixing Tailwind with global CSS and fighting layers
**❌ Wrong:**
```css
button { background: red; }   /* unlayered, beats Tailwind utilities */
```
**🤔 Why it is a problem:** In v4, unlayered CSS has higher priority than layered utilities, so `bg-blue-500` on a button may stop working.

**✅ Correct:**
```css
@layer base { button { background: red; } }
```
**💬 Say:** "I put my custom CSS in the right cascade layer."

---

### Mistake 16: Using `@apply` or theme values inside Vue/Svelte/CSS-module styles without `@reference`
**❌ Wrong:** `<style> .btn { @apply bg-primary; } </style>` in v4 without importing the theme.
**🤔 Why it is a problem:** The isolated style block does not know the theme, so it errors or produces nothing.

**✅ Correct:**
```css
@reference "../../app.css";
.btn { @apply bg-primary; }
```
**💬 Say:** "In v4 isolated stylesheets need `@reference`."

---

### Mistake 17: Using the Play CDN in production
**❌ Wrong:** `<script src="https://cdn.tailwindcss.com">` on a live site.
**🤔 Why it is a problem:** It compiles in the browser at runtime: slow, flashes unstyled content, and is not meant for production.

**✅ Correct:** Use the build step (Vite plugin / PostCSS / CLI).
**💬 Say:** "The CDN is for demos only."

---

### Mistake 18: Ignoring accessibility because "Tailwind handles styling"
**❌ Wrong:**
```html
<div class="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-white" onclick="save()">Save</div>
```
**🤔 Why it is a problem:** A styled `div` is still not a button: no keyboard access, no role.

**✅ Correct:**
```html
<button type="button" class="rounded bg-indigo-600 px-4 py-2 text-white focus-visible:outline-2" onclick="save()">Save</button>
```
**💬 Say:** "Tailwind styles; semantic HTML and ARIA are still my job."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you answer. A junior lists classes. A senior explains **how it works, trade-offs, scale and numbers**.
> **What should you do?** Practice the "Strong" style for every question.

### Signal 1: You explain how Tailwind actually works
| | Example answer |
|---|---|
| ❌ Weak | "Tailwind has small classes for CSS." |
| ✅ Strong | "Tailwind scans source files as text, parses class candidates, and generates only the rules used into one stylesheet. That's why dynamic class names fail and why the output is small. In v4 the engine is written in Rust and the theme is exposed as CSS variables." |
**Prove it:** mention scanning, JIT, layers, `@theme`, dynamic-class gotcha.

### Signal 2: You know the difference between v3 and v4
| | Example answer |
|---|---|
| ❌ Weak | "v4 is faster." |
| ✅ Strong | "v4 moves configuration to CSS (`@theme`, `@source`, `@utility`, `@custom-variant`), auto-detects content, drops the need for PostCSS plugins like autoprefixer, adds container queries, and renames some utilities (shadow, rounded, ring, gradients). Border and ring defaults changed, and it needs modern browsers. I migrate with the upgrade tool and visual regression tests." |
**Prove it:** list 4–5 concrete changes.

### Signal 3: You keep UI consistent at scale
| | Example answer |
|---|---|
| ❌ Weak | "We use Tailwind everywhere." |
| ✅ Strong | "We use semantic tokens in `@theme`, CVA for component variants, `cn()` with tailwind-merge, the Prettier plugin for class order, ESLint rules against arbitrary colors, and Storybook as the source of truth." |
**Prove it:** tokens, CVA, lint, Storybook.

### Signal 4: You think about performance and SSR
| | Example answer |
|---|---|
| ❌ Weak | "Tailwind is fast." |
| ✅ Strong | "No runtime, so it works with RSC and has no hydration cost. Our CSS is about 20 KB gzip. I avoid giant safelists, serve with Brotli and a long cache, and keep CLS low with `aspect-*` and fixed sizes." |
**Prove it:** mention bundle size, no runtime, CWV.

### Signal 5: You understand trade-offs
| | Example answer |
|---|---|
| ❌ Weak | "Tailwind is better than Bootstrap." |
| ✅ Strong | "Tailwind is better for custom designs and design systems, and has no runtime. Bootstrap is faster for standard admin UIs with ready components and JS plugins. I'd choose by design uniqueness, team skills and maintenance cost." |
**Prove it:** compare 3+ tools in a table.

### Signal 6: You care about accessibility
| | Example answer |
|---|---|
| ❌ Weak | "I style buttons with Tailwind." |
| ✅ Strong | "I use semantic elements, `focus-visible`, `motion-reduce`, `sr-only`, `aria-*` variants, contrast checks and axe in CI. I never replace a `button` with a styled `div`." |
**Prove it:** variants for a11y, headless libraries.

### Signal 7: You handle theming at runtime
| | Example answer |
|---|---|
| ❌ Weak | "We have a dark class." |
| ✅ Strong | "Semantic tokens are CSS variables mapped with `@theme inline`. Dark mode and brands change variables by attribute. No per-tenant builds. Contrast is validated automatically." |
**Prove it:** `@theme inline`, `data-theme`, multi-brand.

### Signal 8: You show leadership and migration experience
| | Example answer |
|---|---|
| ❌ Weak | "I used Tailwind in a project." |
| ✅ Strong | "I ran a pilot, measured CSS size and delivery speed, built the shared preset and component library, wrote lint rules and docs, trained the team, and migrated page by page with a prefix to avoid clashes." |
**Prove it:** pilot, metrics, rollout plan.

### 🔊 Phrases that sound senior
- "Tailwind scans plain text, so I never build class names dynamically."
- "I extract components, not CSS classes."
- "Tokens first, arbitrary values only as an exception."
- "I merge classes with tailwind-merge so overrides are predictable."
- "I test both themes and run visual regression after an upgrade."

### 🚩 Phrases that sound junior
- "I use `@apply` for everything." · "I use `!important` to fix conflicts." · "I build class names with template strings." · "I don't know why it works in dev but not in prod." · "Tailwind is just inline styles."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 Minimum v4 setup (Vite + React)
```bash
npm i tailwindcss @tailwindcss/vite clsx tailwind-merge class-variance-authority
```
```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite';
export default { plugins: [react(), tailwindcss()] };
```
```css
/* index.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@theme {
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```
```js
// lib/utils.js
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
export const cn = (...i) => twMerge(clsx(i));
```

## 18.2 Mental model in 6 lines
1. Utilities are small classes; you combine them.
2. Mobile-first: no prefix = all sizes; `md:` = 768px and up.
3. Variants stack: `md:hover:bg-blue-600`.
4. Tailwind scans text, so write complete class names.
5. Tokens live in `@theme` (v4) or `theme.extend` (v3).
6. Extract components, not CSS classes.

## 18.3 Which tool for which problem?
| Problem | Tool |
|---|---|
| Conflicting classes from props | `tailwind-merge` + `clsx` (`cn()`) |
| Component variants | `class-variance-authority` |
| Styling markdown/CMS HTML | `@tailwindcss/typography` (`prose`) |
| Nicer form defaults | `@tailwindcss/forms` |
| Class order | `prettier-plugin-tailwindcss` |
| Autocomplete & conflict hints | Tailwind CSS IntelliSense |
| Accessible behavior | Radix UI / Headless UI / React Aria |
| Ready-made styled components | shadcn/ui (copy into your repo) |

## 18.4 Layout recipes
| Need | Classes |
|---|---|
| Center anything | `grid place-items-center` |
| Navbar | `flex items-center justify-between gap-4` |
| Responsive grid | `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` |
| Page wrapper | `mx-auto w-full max-w-6xl px-4` |
| Sticky header | `sticky top-0 z-50 bg-white/80 backdrop-blur` |
| Card | `rounded-xl border bg-white p-4 shadow-sm` |
| Full overlay | `fixed inset-0 bg-black/50` |
| Truncate in flex | `min-w-0 truncate` |
| Square image | `aspect-square object-cover` |

## 18.5 v3 → v4 quick list
- `@tailwind base/components/utilities` → `@import "tailwindcss"`
- `tailwind.config.js` → `@theme` / `@config`
- `shadow-sm→shadow-xs`, `shadow→shadow-sm`, `rounded-sm→rounded-xs`, `rounded→rounded-sm`
- `outline-none → outline-hidden`, `ring → ring-3`
- `bg-gradient-to-r → bg-linear-to-r`
- `bg-opacity-50 → bg-black/50`
- `flex-shrink-0 → shrink-0`
- `bg-[--x] → bg-(--x)`
- Default border/ring color = `currentColor`
- `hover:` only on hover-capable devices
- Run: `npx @tailwindcss/upgrade`

## 18.6 Accessibility checklist
- [ ] Semantic elements (`button`, `nav`, `label`) before any styling
- [ ] `focus-visible:` styles on all custom controls
- [ ] Contrast ≥ 4.5:1 in both light and dark mode
- [ ] `motion-reduce:` for animations
- [ ] `sr-only` text for icon-only controls
- [ ] `aria-*:` / `data-*:` variants for state styling

## 18.7 Performance checklist
- [ ] Build with the Vite/PostCSS plugin or CLI (not the Play CDN)
- [ ] No huge safelist; no dynamic class strings
- [ ] Brotli + hashed filename + long cache
- [ ] Images with `aspect-*`/size and `loading="lazy"`
- [ ] Few unique arbitrary values

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| No styles at all | Missing import/plugin; content paths (v3) | Check `@import "tailwindcss"`, plugin, `content` |
| Works in dev, not in prod | Dynamic class names; unscanned package | Full class names; `@source` |
| Wrong class wins | Conflict in same property | `twMerge`; remove conflict |
| Dark mode not working | Strategy not configured | `@custom-variant dark` / `darkMode: 'class'` |
| Arbitrary value ignored | Spaces in value | Use underscores |
| `peer-*` not working | Peer is after the element | Move peer before |
| `truncate` not working in flex | No `min-w-0` | Add `min-w-0` |
| Container not centered | Default behavior | `mx-auto px-4` |
| My CSS beats utilities | Unlayered CSS > layers (v4) | Put it in `@layer base` |
| `@apply` error in Vue/Svelte | Missing `@reference` | Add `@reference` |
| Hover not working on phone | v4 hover-only-on-hover devices | Use `active:`/`focus-visible:` |

## 18.9 30-second answers
- **What is Tailwind?** A utility-first CSS framework that generates only the CSS for the classes you use.
- **Why use it?** Speed, consistency, small CSS, no naming, no dead CSS.
- **Downsides?** Long class lists, learning curve, requires discipline. Fix with components and tooling.
- **How is it responsive?** Mobile-first prefixes (`md:` = 768px and up).
- **Dynamic classes?** Never build names with template strings; use a map of full class names.
- **`@apply`?** Rarely; prefer components.
- **v4 change?** CSS-first config (`@theme`), faster Rust engine, automatic content detection, container queries built in.
- **Dark mode?** `dark:` variant; class/attribute strategy via `@custom-variant` (v4) or `darkMode: 'class'` (v3).
- **Tailwind vs Bootstrap?** Tailwind = utilities for custom designs; Bootstrap = ready components for standard UIs.
- **Merge conflicts?** `tailwind-merge` with `clsx` (`cn()`).

## 18.10 Last-minute checklist before the interview
- [ ] I can explain how Tailwind generates CSS (scan → parse → generate).
- [ ] I know why dynamic class names break and how to fix it.
- [ ] I can list 6 changes between v3 and v4.
- [ ] I can build a navbar, card grid, modal and dark-mode toggle from memory.
- [ ] I can explain `cn()`, CVA, `group`/`peer` and container queries.
- [ ] I have one performance story and one design-system/migration story.
- [ ] I can compare Tailwind with Bootstrap, CSS Modules and runtime CSS-in-JS.
