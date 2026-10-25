# Bootstrap Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This file is based on **Bootstrap 5.3.x** (the current stable line). Where Bootstrap 4 is different, it is mentioned.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** Do not only name a class. Say: **what problem it solves + when you would not use it + how you customize it.**

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
- [Part 12: Internals & Architecture of Bootstrap](#-part-12-internals--architecture-of-bootstrap)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output-Based & Spot the Error](#-part-14-output-based--spot-the-error)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Bootstrap? Why do we use it? *(Conceptual)*
**Answer:** Bootstrap is a free, open-source **front-end framework** for building responsive, mobile-first websites. It gives you:
- A **12-column grid system**
- Ready-made **components** (navbar, card, modal, carousel, dropdown...)
- **Utility classes** (spacing, flex, text, colors...)
- Small **JavaScript plugins** (modal, collapse, tooltip...)
- Styles for forms, tables, buttons and typography that look the same on all browsers

**Why use it:** fast prototyping, consistent UI, good browser support, built-in accessibility basics, and a large community.
**Why not use it:** many sites look alike, extra CSS you may not use, and heavy customization can be harder than using a utility-first tool.

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
```

### Q2. How do you add Bootstrap to a project? *(Practical)*
| Way | How | Best for |
|---|---|---|
| CDN | `<link>` + `<script>` tags | Quick demos, small pages |
| npm | `npm i bootstrap` then import | Real projects with a bundler |
| Download | Copy `dist/` files | Offline use |
| Sass source | `@import "bootstrap/scss/bootstrap"` | Full customization |

```js
// with a bundler (Vite / Webpack)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';                       // all JS plugins
// or only what you need:
import { Modal, Tooltip } from 'bootstrap';
```
`bootstrap.bundle.min.js` **includes Popper** (needed for dropdowns, tooltips, popovers). `bootstrap.min.js` does not.

### Q3. How does the Bootstrap grid system work? *(Must-know)*
**Answer:** It is a **12-column**, flexbox-based, mobile-first grid. Structure: `container` → `row` → `col-*`.
```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Column A</div>
    <div class="col-12 col-md-6 col-lg-8">Column B</div>
  </div>
</div>
```
- `col-12` = full width on extra small screens
- `col-md-6` = half width from the **md** breakpoint and up
- `col-lg-4` = one-third width from **lg** and up
- If the total in a row goes above 12, the extra columns **wrap** to the next line.

### Q4. What are the breakpoints? *(Must-know)*
| Name | Class infix | Min width | Container max-width |
|---|---|---|---|
| Extra small | (none) | <576px | 100% |
| Small | `sm` | ≥576px | 540px |
| Medium | `md` | ≥768px | 720px |
| Large | `lg` | ≥992px | 960px |
| Extra large | `xl` | ≥1200px | 1140px |
| Extra extra large | `xxl` | ≥1400px | 1320px |

A class like `col-md-6` means "md **and up**" (mobile-first, `min-width` media queries).

### Q5. `container` vs `container-fluid` vs `container-{breakpoint}`
- `.container`: fixed max-width that changes at each breakpoint, centered.
- `.container-fluid`: always 100% width.
- `.container-md`: 100% width until the **md** breakpoint, then fixed like `.container`.

### Q6. What changed in Bootstrap 5 compared to Bootstrap 4? *(Asked very often)*
- **jQuery removed** (plain JavaScript now)
- **IE 10/11 support dropped**
- `data-*` attributes became **`data-bs-*`** (`data-bs-toggle`, `data-bs-target`)
- `ml-*` / `mr-*` → **`ms-*` / `me-*`** (start/end, for RTL support)
- `pl/pr` → `ps/pe`, `float-left/right` → `float-start/end`, `text-left/right` → `text-start/end`
- `.form-group`, `.form-row`, `.form-inline` removed (use the grid and utilities)
- `.jumbotron`, `.media`, `.card-deck` removed (use utilities/grid)
- `.badge-*` → `.bg-*`; `.sr-only` → `.visually-hidden`; `.close` → `.btn-close`
- `.no-gutters` → `.g-0`; `.btn-block` removed (use `.d-grid`)
- New: **Offcanvas**, RTL support, CSS variables, utility API, improved forms
- 5.3 added: **color modes (dark mode)** with `data-bs-theme`

### Q7. What are Bootstrap utility classes? Give examples.
Small single-purpose classes you add to HTML.
```html
<div class="d-flex justify-content-between align-items-center p-3 mb-4 bg-light border rounded shadow-sm">
  <span class="fw-bold text-primary">Ritesh Kumar</span>
  <button class="btn btn-primary">Save</button>
</div>
```
Common groups: spacing (`m-*`, `p-*`), display (`d-*`), flex, position, sizing (`w-100`), text (`text-center`, `fw-bold`), colors (`text-*`, `bg-*`), borders (`border`, `rounded`), shadows.

### Q8. Explain the spacing utilities.
Format: `{property}{sides}-{breakpoint}-{size}`
- Property: `m` (margin), `p` (padding)
- Sides: `t`, `b`, `s` (start/left), `e` (end/right), `x` (left+right), `y` (top+bottom), none (all sides)
- Size: `0`, `1` (.25rem), `2` (.5rem), `3` (1rem), `4` (1.5rem), `5` (3rem), `auto`
```html
<div class="mt-3 mb-md-5 px-4 mx-auto">...</div>
```

### Q9. What are the button classes?
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-secondary btn-lg">Large outline</button>
<button class="btn btn-danger btn-sm" disabled>Small disabled</button>
<a class="btn btn-link" href="#">Link style</a>
```
Theme colors: `primary, secondary, success, danger, warning, info, light, dark`. Sizes: `btn-sm`, `btn-lg`. For a full-width button use `d-grid` on the parent (the old `btn-block` is gone).

### Q10. How do you create a responsive navbar?
```html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="#">Ritesh</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Projects</a></li>
      </ul>
    </div>
  </div>
</nav>
```
`navbar-expand-lg` means: expanded from **lg** and up, collapsed (hamburger) below lg.

### Q11. What is the Bootstrap card component?
```html
<div class="card" style="width: 18rem;">
  <img src="photo.jpg" class="card-img-top" alt="Profile of Ritesh Kumar">
  <div class="card-body">
    <h5 class="card-title">Ritesh Kumar</h5>
    <p class="card-text">Full-stack developer.</p>
    <a href="#" class="btn btn-primary">View profile</a>
  </div>
</div>
```

### Q12. What is the difference between `.table` classes?
`.table` (base), `.table-striped`, `.table-hover`, `.table-bordered`, `.table-sm`, `.table-dark`, and `.table-responsive` (wrap it to get horizontal scroll on small screens).
```html
<div class="table-responsive">
  <table class="table table-striped table-hover">...</table>
</div>
```

### Q13. How do you make images responsive?
`class="img-fluid"` (sets `max-width: 100%; height: auto`). Also `.img-thumbnail`, `.rounded`, `.rounded-circle`. For a fixed ratio box use `.ratio ratio-16x9`.

### Q14. What are the Bootstrap form control classes?
```html
<div class="mb-3">
  <label for="email" class="form-label">Email</label>
  <input type="email" class="form-control" id="email" placeholder="you@example.com">
</div>
<select class="form-select"><option>One</option></select>
<div class="form-check"><input class="form-check-input" type="checkbox" id="c"><label class="form-check-label" for="c">Remember me</label></div>
<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="s"><label class="form-check-label" for="s">Dark mode</label></div>
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q15. How do gutters work in the grid? *(Comparison with v4)*
Gutters are the spacing between columns. In v5: `g-*` (both), `gx-*` (horizontal), `gy-*` (vertical), with values 0–5, and breakpoint versions like `g-md-4`.
```html
<div class="row g-3">          <!-- 1rem gap between columns and rows -->
  <div class="col-6">A</div>
  <div class="col-6">B</div>
</div>
<div class="row g-0">...</div> <!-- no gutters (replaces .no-gutters) -->
```

### Q16. How do you align and order columns?
```html
<div class="row justify-content-center align-items-center" style="min-height: 50vh">
  <div class="col-md-4 order-2 order-md-1">Second on mobile, first on md+</div>
  <div class="col-md-4 order-1 order-md-2 offset-md-1">Offset by 1 column</div>
</div>
```
`justify-content-*` (horizontal), `align-items-*` (vertical), `align-self-*` (one column), `order-*`, `offset-*`.

### Q17. What are `row-cols-*` and `col-auto`?
`row-cols-*` sets how many columns fit per row without writing a class on every column. `col-auto` sizes the column to its content. `col` (no number) shares the remaining space equally.
```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
  <div class="col"><div class="card">...</div></div>
  <div class="col"><div class="card">...</div></div>
  <div class="col"><div class="card">...</div></div>
  <div class="col"><div class="card">...</div></div>
</div>
```

### Q18. How do you show or hide elements by screen size?
```html
<div class="d-none d-md-block">Visible from md and up</div>
<div class="d-block d-md-none">Visible only below md</div>
<div class="d-none d-lg-flex">Flex from lg and up</div>
```
Rule: set `d-none` first, then show at the breakpoint with `d-{bp}-block/flex/inline`.

### Q19. How do Bootstrap modals work? How do you control them with JavaScript?
```html
<button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirm">Delete</button>

<div class="modal fade" id="confirm" tabindex="-1" aria-labelledby="confirmLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="confirmLabel">Delete item?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">This cannot be undone.</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-danger" id="yes">Delete</button>
      </div>
    </div>
  </div>
</div>
<script>
  const el = document.getElementById('confirm');
  const modal = bootstrap.Modal.getOrCreateInstance(el);
  modal.show();                                       // or modal.hide()
  el.addEventListener('hidden.bs.modal', () => console.log('closed'));
</script>
```
Options: `data-bs-backdrop="static"` (does not close on outside click), `data-bs-keyboard="false"`, sizes `modal-sm/lg/xl`, `modal-fullscreen`, `modal-dialog-scrollable`.

### Q20. How do forms get validated in Bootstrap?
```html
<form class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input id="name" class="form-control" required>
    <div class="invalid-feedback">Please enter your name.</div>
    <div class="valid-feedback">Looks good!</div>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
<script>
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
      form.classList.add('was-validated');
    });
  });
</script>
```
Bootstrap only provides the **styles** (`.is-valid`, `.is-invalid`, `.was-validated`, feedback text). The validation rules come from HTML attributes (`required`, `pattern`...) or your JS. Server-side validation is still required.

### Q21. How do you create tabs and an accordion?
```html
<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-selected="true">Home</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#skills" type="button" role="tab" aria-selected="false">Skills</button>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane fade show active" id="home" role="tabpanel">Home content</div>
  <div class="tab-pane fade" id="skills" role="tabpanel">Skills content</div>
</div>
```
```html
<div class="accordion" id="faq">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#a1">What is the refund policy?</button>
    </h2>
    <div id="a1" class="accordion-collapse collapse show" data-bs-parent="#faq">
      <div class="accordion-body">7 days.</div>
    </div>
  </div>
</div>
```
`data-bs-parent` makes sure only one panel is open at a time.

### Q22. How do tooltips and popovers work? Why do they not work by default?
They are **opt-in** because of performance. You must initialize them.
```html
<button class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-title="Save changes">Save</button>
<script>
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el));
</script>
```
They need **Popper** (included in `bootstrap.bundle`). A tooltip does not work on a `disabled` button; wrap the button in a `<span>` instead.

### Q23. What are the alert, badge, spinner, progress and toast components?
```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  Be careful! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
<span class="badge text-bg-primary">New</span>
<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
<div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 60%">60%</div>
</div>
```
Toasts must be shown with JS: `new bootstrap.Toast(el).show()`.

### Q24. What is Offcanvas?
A hidden side panel (new in v5) used for mobile menus, filters and carts.
```html
<button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#menu">Menu</button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="menu" aria-labelledby="menuLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="menuLabel">Menu</h5>
    <button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">...</div>
</div>
```
Use `offcanvas-end/top/bottom` for other sides, and `offcanvas-lg` to make it a normal element on large screens.

### Q25. What are the flex utilities?
```html
<div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
  <div class="flex-grow-1">Grows</div>
  <div class="flex-shrink-0">Does not shrink</div>
  <div class="ms-auto">Pushed to the end</div>
</div>
```
`d-flex`, `flex-row/column`, `flex-wrap`, `justify-content-*`, `align-items-*`, `flex-fill`, `flex-grow-*`, `flex-shrink-*`, `order-*`, `gap-*`.

### Q26. What are the position utilities?
`position-static/relative/absolute/fixed/sticky`, `fixed-top`, `fixed-bottom`, `sticky-top`, and helpers `top-0`, `bottom-0`, `start-0`, `end-0`, `translate-middle`.
```html
<div class="position-relative">
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">9+</span>
</div>
```

### Q27. What are the text and font utilities?
`text-start/center/end`, `text-uppercase`, `text-truncate`, `fw-bold`, `fst-italic`, `fs-1…6`, `lh-1/sm/base/lg`, `text-wrap`, `text-nowrap`, `text-decoration-none`, `text-break`. Headings: `h1…h6` classes and `display-1…6` for large headings.

### Q28. How do you apply theme colors?
`text-primary`, `bg-success`, `border-danger`, and the helpers `text-bg-primary` (sets matching background + text color together, new in 5.2), `text-body-secondary` (replaces the deprecated `text-muted`), `bg-body-tertiary`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q29. How do you customize Bootstrap with Sass? *(Must-know)*
Do not override the compiled CSS with hundreds of rules. Override the **Sass variables before** importing Bootstrap.
```scss
// custom.scss
$primary: #6c5ce7;
$border-radius: 0.75rem;
$font-family-sans-serif: "Inter", system-ui, sans-serif;
$enable-shadows: true;
$enable-negative-margins: true;

@import "bootstrap/scss/bootstrap";
```
For finer control, import in parts so you can modify maps in between:
```scss
@import "bootstrap/scss/functions";
$theme-colors: map-merge($theme-colors, ("brand": #6c5ce7));   // needs the functions first
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/buttons";   // only what you need
```
Bootstrap 5.3 still uses `@import`, so newer Sass versions show deprecation warnings (they are only warnings).

### Q30. What are Bootstrap CSS variables and how do you use them?
Since 5.x, Bootstrap exposes variables on `:root` (`--bs-primary`, `--bs-body-bg`, `--bs-body-color`, `--bs-border-radius`, `--bs-font-sans-serif`...) and many components have **local variables** (`--bs-btn-bg`, `--bs-card-bg`...). You can override at runtime without Sass.
```css
:root { --bs-primary: #6c5ce7; --bs-primary-rgb: 108, 92, 231; }
.btn-primary { --bs-btn-bg: #6c5ce7; --bs-btn-border-color: #6c5ce7; --bs-btn-hover-bg: #5b4bd6; }
```
Note: `--bs-primary-rgb` must be updated too, because utilities like `.text-primary` use the RGB value.

### Q31. How does dark mode work in Bootstrap 5.3?
```html
<html lang="en" data-bs-theme="dark">
```
`data-bs-theme="light|dark"` can be set on the whole page **or on any element** (for example one card). Components read CSS variables, so they switch automatically.
```js
const saved = localStorage.getItem('theme');
const sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-bs-theme', saved ?? sys);
```
Put this small script in `<head>` to avoid a flash of the wrong theme.

### Q32. What is the Utility API?
A Sass map (`$utilities`) used to **create, change or remove** utility classes.
```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";

$utilities: map-merge($utilities, (
  "cursor": (property: cursor, class: cursor, values: (pointer: pointer, grab: grab)),
  "opacity": (property: opacity, values: (0: 0, 50: .5, 100: 1))
));
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/utilities/api";
```
Result: `.cursor-pointer`, `.opacity-50`. Reduce size by removing utilities you never use.

### Q33. How do you use Bootstrap with React?
Use **react-bootstrap** (components are real React components, no manual DOM). Avoid mixing Bootstrap's own JS with React, because both try to control the DOM.
```jsx
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Demo() {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>Open</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Hello Ritesh</Modal.Title></Modal.Header>
        <Modal.Body>Content</Modal.Body>
      </Modal>
    </>
  );
}
```
Other wrappers: reactstrap (React), ng-bootstrap / ngx-bootstrap (Angular), bootstrap-vue-next (Vue). You can also use only Bootstrap's **CSS** and your own components.

### Q34. How do you import only the parts you need (reduce size)?
- **CSS:** import individual Sass partials (buttons, grid, utilities) instead of all of `bootstrap`.
- **JS:** `import { Modal } from 'bootstrap'` (tree-shaking), or `bootstrap/js/dist/modal`.
- Remove unused utilities with the Utility API.
- Optionally run PurgeCSS (be careful with classes added dynamically by JS).

### Q35. How do you override Bootstrap styles in your own CSS? What is the load order?
Load your CSS **after** Bootstrap, and use a selector with **equal or higher specificity** (usually just one class more). Avoid `!important`.
```html
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="custom.css">   <!-- after Bootstrap -->
```
```css
.btn.btn-brand { --bs-btn-bg: #6c5ce7; --bs-btn-hover-bg: #5b4bd6; --bs-btn-color: #fff; }
```
Better still: use Sass variables or the component CSS variables.

### Q36. How does the Bootstrap JavaScript data API work? What are the events?
`data-bs-toggle="modal|collapse|dropdown|tab|tooltip|offcanvas"`, `data-bs-target="#id"` (or `href`), `data-bs-dismiss`. Events follow the pattern `{action}.bs.{plugin}`.
| Plugin | Events |
|---|---|
| Modal | `show.bs.modal`, `shown.bs.modal`, `hide.bs.modal`, `hidden.bs.modal` |
| Collapse | `show/shown/hide/hidden.bs.collapse` |
| Dropdown | `show/shown/hide/hidden.bs.dropdown` |
| Tab | `show/shown/hide/hidden.bs.tab` |
| Toast | `show/shown/hide/hidden.bs.toast` |
Programmatic access: `bootstrap.Modal.getOrCreateInstance(el)`, `getInstance(el)`, `.dispose()`.

### Q37. What is the CSS Grid option in Bootstrap?
Optional, disabled by default. Enable it in Sass: `$enable-cssgrid: true; $enable-grid-classes: false;`. It adds `.grid`, `.g-col-*`, `.g-start-*`. It allows true two-dimensional layouts, which the flexbox grid cannot do.
```html
<div class="grid" style="--bs-columns: 12; --bs-gap: 1rem;">
  <div class="g-col-6 g-col-md-4">A</div>
  <div class="g-col-6 g-col-md-8">B</div>
</div>
```

### Q38. How do you build a sticky/fixed navbar without hiding the content?
`.fixed-top` removes the navbar from the flow, so the content goes under it. Add top padding to the body equal to the navbar height, or use `.sticky-top` (which stays in the flow).
```html
<nav class="navbar sticky-top bg-body">...</nav>
```
```css
body { padding-top: 72px; }   /* only needed for fixed-top */
html { scroll-padding-top: 72px; }   /* so anchor links are not hidden */
```

### Q39. How do you add icons?
Bootstrap does not include icons. Use **Bootstrap Icons** (SVG sprite, icon font, or individual SVG), Font Awesome, or your own SVG.
```html
<i class="bi bi-github" aria-hidden="true"></i>
<button class="btn btn-primary"><i class="bi bi-save me-1" aria-hidden="true"></i>Save</button>
```
Icon-only buttons need `aria-label`.

### Q40. Bootstrap and accessibility: what does it give you and what is your job?
Bootstrap provides: focus styles, `.visually-hidden`, ARIA patterns in docs, keyboard support in modal/dropdown/collapse, color contrast in the default theme. **Your job:** correct `aria-label`s and labels, alt text, heading order, contrast after customizing colors, keyboard testing of custom components, and screen reader testing.

---

# 🟠 Part 4: Senior (5–7 years)

### Q41. Bootstrap vs Tailwind vs Material UI vs custom CSS: when to use which? *(Decision)*
| | Bootstrap | Tailwind | Material UI / component libs | Custom CSS |
|---|---|---|---|---|
| Approach | Components + utilities | Utility-first | Full React components | Hand-written |
| Speed to first screen | Very fast | Fast after setup | Very fast | Slow |
| Unique brand design | Needs effort | Natural | Needs theme work | Full control |
| CSS size | Larger unless trimmed | Small (JIT) | JS-heavy | Smallest if careful |
| Best for | Admin panels, internal tools, MVPs, teams new to CSS | Custom design systems | React apps needing rich widgets | Design-heavy sites |
Choose by: design uniqueness, team skills, time, bundle size, and long-term maintenance.

### Q42. How do you keep Bootstrap performance good?
- Import only the needed Sass partials and JS plugins
- Use the CDN with long cache, or self-host with hashed names and Brotli
- Add **SRI** (`integrity`) to CDN links
- `defer` the JS bundle; do not block rendering
- Inline critical CSS for above-the-fold if needed
- Remove unused utilities; avoid loading Bootstrap Icons font fully (use SVG sprite for the icons you use)
- Measure with Lighthouse and the Coverage tab

### Q43. How do you theme Bootstrap for multiple brands?
Use CSS variables at runtime instead of one build per brand:
```css
[data-brand="acme"] { --bs-primary: #0d6efd; --bs-primary-rgb: 13,110,253; --bs-border-radius: .25rem; }
[data-brand="zen"]  { --bs-primary: #20c997; --bs-primary-rgb: 32,201,151; --bs-border-radius: 1rem; }
```
Set the attribute from the tenant. Also override component variables (`--bs-btn-*`). Combine with `data-bs-theme` for dark mode. Validate contrast for every brand.

### Q44. How do you handle Bootstrap JS in a SPA framework (Angular/Vue/React) safely?
Prefer framework-native wrappers (react-bootstrap, ng-bootstrap). If you must use Bootstrap JS directly: create instances in a lifecycle hook (`useEffect` / `ngAfterViewInit`), keep a ref, and **dispose** on unmount (`instance.dispose()`) to avoid memory leaks and duplicate listeners. Never let Bootstrap and the framework both mutate the same DOM nodes.
```jsx
useEffect(() => {
  const tip = new bootstrap.Tooltip(ref.current);
  return () => tip.dispose();
}, []);
```

### Q45. How do you migrate from Bootstrap 4 to 5 safely?
1. Read the official migration guide and list breaking changes.
2. Use a codemod/regex or script for class renames (`ml-` → `ms-`, `float-left` → `float-start`, `data-` → `data-bs-`).
3. Replace jQuery plugin calls (`$('#m').modal('show')`) with `bootstrap.Modal`.
4. Rebuild forms without `.form-group` / `.form-row` / `.form-inline`.
5. Replace removed components (jumbotron, media, card-deck).
6. Test with visual regression and manual passes; migrate page by page behind a feature flag.
7. Remove jQuery if nothing else needs it (saves ~30 KB gzip).

### Q46. How do you structure custom components on top of Bootstrap?
Create a thin layer: your own classes that compose Bootstrap's tokens, not copies of its CSS.
```scss
.btn-brand {
  @extend .btn;                // or use mixins
  @include button-variant($brand, $brand);
}
```
Or use component CSS variables. Keep project overrides in one `_custom.scss` partial, document them, and avoid editing `node_modules`.

### Q47. How do you test a Bootstrap-based UI?
Visual regression (Playwright/Chromatic) at each breakpoint (375, 768, 1024, 1440), axe-core for accessibility, keyboard-only tests for modal/dropdown/tabs, cross-browser checks (Safari, Firefox), and RTL checks if used.

### Q48. What are the common causes of layout bugs and how do you debug them?
Check in DevTools: missing `.row` or `.container`, columns not direct children of the row, total columns > 12, padding/margin utilities conflicting, `w-100` or `flex` conflicts, an element wider than the viewport, or an older Bootstrap version loaded as well. Use "toggle element state", Computed tab, and temporary borders.

### Q49. How do you handle RTL (Arabic/Hebrew) in Bootstrap?
Use the RTL build `bootstrap.rtl.min.css` and set `<html dir="rtl" lang="ar">`. Because v5 uses logical class names (`ms-*`, `me-*`, `text-start`), layouts mirror automatically. Test icons and carousels.

### Q50. How do you integrate Bootstrap with a design system / Figma?
Map Figma tokens to Bootstrap Sass variables or CSS variables (color, radius, spacing, typography), publish them as a package, and document which Bootstrap components are allowed. Use Style Dictionary to generate `_variables.scss` automatically.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q51. How would you decide whether to keep or replace Bootstrap in a large product? *(Architecture)*
Evaluate: (1) how much of the UI is custom vs default look, (2) CSS size and Core Web Vitals impact, (3) cost of overrides (how many `!important` / override rules), (4) team skills, (5) accessibility audit results, (6) roadmap (design refresh? React Server Components?), (7) migration cost and risk. Option: keep Bootstrap for the grid/utilities/reboot and build custom components over tokens, or move to a utility/design-system approach gradually.

### Q52. How do you build an internal design system on top of Bootstrap?
- A theme package (Sass variables + CSS variable overrides + utilities config)
- Wrapped components for your framework with accessibility baked in
- Storybook docs and visual tests
- A rule: apps import the package, never override Bootstrap in app code
- Semantic versioning, changelog, deprecation policy
- Governance: a small core team reviews new components

### Q53. How do you manage upgrades (5.2 → 5.3 → 6) across many apps?
Pin versions in a shared package; run upgrades in one place; read release notes; run visual regression across a sample of key pages; use feature flags; publish a migration guide with codemods; keep deprecated aliases for a transition period.

### Q54. How do you enforce quality and consistency in a team using Bootstrap?
Stylelint with rules (no `!important`, limited overrides), a list of approved components/utilities, PR checklist (responsive, a11y, states), Storybook, CI checks (Lighthouse, axe, bundle size), and documentation of "do/don't".

### Q55. How do you scale performance for 10M users with a Bootstrap front end?
Build a trimmed CSS/JS bundle, serve with Brotli over HTTP/2 or HTTP/3 through a CDN with immutable hashed assets, inline critical CSS, defer JS, lazy-load below-the-fold media, monitor Core Web Vitals with RUM, and set performance budgets in CI.

### Q56. How do you ensure accessibility compliance (WCAG 2.2 AA) on a Bootstrap product?
Audit default and customized colors for contrast; ensure each interactive component has an accessible name and keyboard path; run axe in CI; do manual screen reader and keyboard tests for key flows; train developers; track issues as a metric; include accessibility in the definition of done.

### Q57. How do you handle white-label/multi-tenant theming at scale?
Runtime CSS variables per tenant (server-injected `<style>`), tokens stored in a database, automatic contrast validation when a tenant sets colors, caching per tenant, no per-tenant builds, a default fallback theme, and brand fonts lazy-loaded.

### Q58. Explain a migration plan from a legacy Bootstrap 3/4 monolith.
Audit usage (components, plugins, jQuery dependencies) → freeze new features on the old version → introduce Bootstrap 5 in a namespaced or isolated way (for example, new pages only) → migrate shared layout first (navbar, grid) → migrate components in order of traffic → remove jQuery last → delete dead CSS. Use visual regression and metrics at each step. Avoid a big-bang rewrite.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. Responsive hero section with call-to-action
```html
<section class="bg-body-tertiary py-5">
  <div class="container">
    <div class="row align-items-center g-4">
      <div class="col-lg-6 text-center text-lg-start">
        <h1 class="display-5 fw-bold">Hi, I am Ritesh Kumar</h1>
        <p class="lead text-body-secondary">Full-stack developer with 7 years of experience.</p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center justify-content-lg-start">
          <a href="#projects" class="btn btn-primary btn-lg px-4">View projects</a>
          <a href="#contact" class="btn btn-outline-secondary btn-lg px-4">Contact</a>
        </div>
      </div>
      <div class="col-lg-6">
        <img src="hero.webp" class="img-fluid rounded shadow" alt="Workspace" width="640" height="420">
      </div>
    </div>
  </div>
</section>
```

### C2. Pricing table (3 cards)
```html
<div class="container py-5">
  <div class="row row-cols-1 row-cols-md-3 g-4 text-center">
    <div class="col"><div class="card h-100 shadow-sm">
      <div class="card-header fw-semibold">Free</div>
      <div class="card-body d-flex flex-column">
        <h2 class="card-title">$0<small class="text-body-secondary fw-light">/mo</small></h2>
        <ul class="list-unstyled mt-3 mb-4"><li>1 project</li><li>Email support</li></ul>
        <button class="btn btn-outline-primary mt-auto">Sign up</button>
      </div>
    </div></div>
    <div class="col"><div class="card h-100 border-primary shadow">
      <div class="card-header text-bg-primary fw-semibold">Pro</div>
      <div class="card-body d-flex flex-column">
        <h2 class="card-title">$15<small class="text-body-secondary fw-light">/mo</small></h2>
        <ul class="list-unstyled mt-3 mb-4"><li>20 projects</li><li>Priority support</li></ul>
        <button class="btn btn-primary mt-auto">Get started</button>
      </div>
    </div></div>
    <div class="col"><div class="card h-100 shadow-sm">
      <div class="card-header fw-semibold">Team</div>
      <div class="card-body d-flex flex-column">
        <h2 class="card-title">$29<small class="text-body-secondary fw-light">/mo</small></h2>
        <ul class="list-unstyled mt-3 mb-4"><li>Unlimited projects</li><li>Phone support</li></ul>
        <button class="btn btn-outline-primary mt-auto">Contact us</button>
      </div>
    </div></div>
  </div>
</div>
```
`h-100` + `mt-auto` keeps all cards the same height with buttons aligned at the bottom.

### C3. Login form with floating labels and validation
```html
<form class="needs-validation mx-auto" style="max-width: 400px" novalidate>
  <h1 class="h3 mb-3 fw-normal">Sign in</h1>
  <div class="form-floating mb-2">
    <input type="email" class="form-control" id="mail" placeholder="name@example.com" required>
    <label for="mail">Email address</label>
    <div class="invalid-feedback">Enter a valid email.</div>
  </div>
  <div class="form-floating mb-3">
    <input type="password" class="form-control" id="pw" placeholder="Password" minlength="8" required>
    <label for="pw">Password</label>
    <div class="invalid-feedback">At least 8 characters.</div>
  </div>
  <div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="rem"><label class="form-check-label" for="rem">Remember me</label></div>
  <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
</form>
```
Floating labels need the `placeholder` attribute (it can be any text).

### C4. Admin dashboard layout (sidebar + content, offcanvas on mobile)
```html
<div class="container-fluid">
  <div class="row flex-nowrap">
    <aside class="col-auto col-md-3 col-xl-2 px-0 bg-dark">
      <div class="offcanvas-md offcanvas-start bg-dark text-white" tabindex="-1" id="side" aria-labelledby="sideLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sideLabel">Menu</h5>
          <button class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#side" aria-label="Close"></button>
        </div>
        <nav class="offcanvas-body flex-column p-0">
          <ul class="nav nav-pills flex-column w-100">
            <li><a class="nav-link active" href="#">Dashboard</a></li>
            <li><a class="nav-link text-white" href="#">Orders</a></li>
          </ul>
        </nav>
      </div>
    </aside>
    <main class="col py-3">
      <button class="btn btn-outline-secondary d-md-none mb-3" data-bs-toggle="offcanvas" data-bs-target="#side">☰ Menu</button>
      <h1 class="h3">Dashboard</h1>
    </main>
  </div>
</div>
```

### C5. Responsive product card grid
```html
<div class="container py-4">
  <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
    <div class="col"><div class="card h-100">
      <img src="p1.webp" class="card-img-top" alt="Blue sneakers" loading="lazy" width="300" height="300">
      <div class="card-body d-flex flex-column">
        <h2 class="h6 card-title">Blue sneakers</h2>
        <p class="text-body-secondary mb-3">₹2,499</p>
        <a href="#" class="btn btn-sm btn-primary mt-auto stretched-link">View</a>
      </div>
    </div></div>
  </div>
</div>
```
`stretched-link` makes the whole card clickable (the parent needs `position-relative`; `.card` already has it).

### C6. Confirmation modal with JavaScript result
```html
<button class="btn btn-danger" id="del">Delete</button>
<script>
function confirmDelete() {
  return new Promise((resolve) => {
    const html = `
      <div class="modal fade" tabindex="-1" aria-labelledby="t" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered"><div class="modal-content">
          <div class="modal-body" id="t">Delete this item?</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-answer="no" data-bs-dismiss="modal">No</button>
            <button class="btn btn-danger" data-answer="yes" data-bs-dismiss="modal">Yes</button>
          </div></div></div></div>`;
    const wrap = document.createElement('div'); wrap.innerHTML = html;
    const el = wrap.firstElementChild; document.body.append(el);
    const modal = new bootstrap.Modal(el); let answer = false;
    el.addEventListener('click', (e) => { if (e.target.dataset.answer === 'yes') answer = true; });
    el.addEventListener('hidden.bs.modal', () => { modal.dispose(); el.remove(); resolve(answer); });
    modal.show();
  });
}
document.getElementById('del').addEventListener('click', async () => {
  if (await confirmDelete()) console.log('deleted');
});
</script>
```

### C7. Image carousel with controls and indicators
```html
<div id="hero" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#hero" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#hero" data-bs-slide-to="1" aria-label="Slide 2"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active"><img src="a.webp" class="d-block w-100" alt="Mountains"></div>
    <div class="carousel-item"><img src="b.webp" class="d-block w-100" alt="Sea"></div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#hero" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#hero" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
  </button>
</div>
```
Use images of equal height to avoid layout jumps. Auto-play is an accessibility concern; give users a pause control or avoid `ride`.

### C8. Toast notification from JS
```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="t" class="toast align-items-center text-bg-success border-0" role="status" aria-live="polite" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">Saved successfully.</div>
      <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
<script>bootstrap.Toast.getOrCreateInstance(document.getElementById('t'), { delay: 3000 }).show();</script>
```

### C9. Sticky top navbar with active link scrollspy
```html
<body data-bs-spy="scroll" data-bs-target="#nav" data-bs-offset="80" tabindex="0">
  <nav id="nav" class="navbar sticky-top bg-body">
    <ul class="nav nav-pills"><li><a class="nav-link" href="#about">About</a></li><li><a class="nav-link" href="#work">Work</a></li></ul>
  </nav>
  <section id="about" class="py-5">...</section>
  <section id="work" class="py-5">...</section>
</body>
```

### C10. Responsive data table with actions
```html
<div class="table-responsive">
  <table class="table table-hover align-middle">
    <thead class="table-light"><tr><th>#</th><th>Name</th><th class="d-none d-md-table-cell">Email</th><th class="text-end">Actions</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Ritesh Kumar</td><td class="d-none d-md-table-cell">ritesh@example.com</td>
          <td class="text-end"><button class="btn btn-sm btn-outline-primary">Edit</button></td></tr>
    </tbody>
  </table>
</div>
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. The navbar hamburger button does nothing.
Checks: Bootstrap **JS bundle** is not loaded (or loaded before the DOM without `defer`); `data-bs-target` id does not match the collapse `id`; you used Bootstrap 4 attributes (`data-toggle`) with Bootstrap 5; a JS error earlier on the page; the JS file loaded twice. Open the console and look for `bootstrap is not defined`.

### D2. The modal opens but the page behind still scrolls / there is a gray backdrop stuck.
The modal HTML is inside an element with `position: fixed/transform` or `z-index` problems, or the modal was removed from the DOM without `hide()`/`dispose()`. Fix: put the modal as a direct child of `<body>`, call `hide()` before removing it, and check no duplicate `.modal-backdrop` exists.

### D3. Tooltips and popovers do not appear.
They are opt-in. Initialize with `new bootstrap.Tooltip(el)`. Also check that Popper is included (`bootstrap.bundle`), the element is not `disabled`, and dynamically added elements are initialized after insertion.

### D4. Columns do not sit side by side.
Columns must be **direct children of `.row`**, and the `.row` must be inside a `.container`. Check the total (> 12 wraps), a missing breakpoint class (`col-md-6` is full width below md), or a stray `w-100` / `d-block`.

### D5. A horizontal scrollbar appears on mobile.
A `.row` used without `.container` (its negative margins stick out), an element with fixed width, `100vw`, a wide table/image/pre. Fix: wrap in `.container`, use `.table-responsive`, `.img-fluid`, `overflow-wrap`.

### D6. My custom CSS does not override Bootstrap.
Specificity or load order. Load custom CSS after Bootstrap; match the selector (`.btn.btn-brand`); or override the component variables (`--bs-btn-bg`). Check the strike-through in DevTools.

### D7. A dropdown is cut off inside a table or card.
The parent has `overflow: hidden/auto` (for example `.table-responsive`). Fix: use `data-bs-boundary="viewport"` / `data-bs-popper-config`, `.dropdown-menu` with `position: fixed` strategy, or move the dropdown out of the scroll container.

### D8. Fixed navbar covers the top of the page content.
`.fixed-top` removes it from the flow. Add `padding-top` to the body, or use `.sticky-top`. Also add `scroll-padding-top` so anchor links are not hidden.

### D9. Form validation styles never show.
Missing `.was-validated` on submit, missing `novalidate` (the browser tooltip appears instead), missing `.invalid-feedback` as a sibling after the input, or the input is inside a wrapper that breaks the sibling selector.

### D10. Carousel images jump or have different heights.
Use images with the same aspect ratio, or wrap them in `.ratio.ratio-16x9` and use `object-fit-cover`.

### D11. Bootstrap component stops working after I add HTML with JavaScript.
The JS plugin attached to old elements only. Data-API events (click on `data-bs-toggle`) work for new elements, but things like tooltips need to be initialized again on the new nodes.

### D12. Styles look different from the docs.
Two versions of Bootstrap loaded (CDN + npm), another CSS framework conflicts, a global `*` reset breaks Reboot, or `box-sizing` is overridden. Check the Network tab and the Computed tab.

### D13. `.text-muted`, `.bg-light` look wrong in dark mode.
These colors are fixed. In 5.3 use color-mode aware classes: `.text-body-secondary`, `.bg-body-tertiary`, `.bg-body`, `.border` (variable-based).

### D14. Sass build fails with "Undefined variable".
Order problem. Import `functions` first, then your overrides, then `variables`, `maps`, `mixins`, and so on. Variables must be defined **before** `variables` is imported, but map functions (`map-merge`) need `functions` imported first.

---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. What does `col-md-6` mean at 500px width?
Below md there is no column rule, so the column is `width: 100%` (stacked). The class applies only from 768px up.

### T2. Why are there negative margins on `.row`?
`.row` has negative horizontal margins to cancel the column padding (gutter) at the edges. So `.row` must live inside a container (which has matching padding). In v5, gutters use CSS variables (`--bs-gutter-x`) and `.g-0` removes them.

### T3. `d-none d-md-block` vs `d-md-none`: what is the difference?
`d-none d-md-block` → hidden below md, visible from md up. `d-md-none` → visible below md, hidden from md up. (Mobile-first: the prefix means "from this size up".)

### T4. Is `.container` inside `.container-fluid` valid? What happens?
It works (the inner container gets its own max-width), but nesting containers is usually unnecessary. A `.row` can be nested inside a column for sub-grids.

### T5. `.btn-block` disappeared. How do you make a full-width button?
`<div class="d-grid"><button class="btn btn-primary">Full width</button></div>` or just `w-100` on the button.

### T6. What does `stretched-link` need to work?
The nearest ancestor must be `position: relative` (cards already are). It makes a pseudo-element cover that ancestor, so the whole area is clickable. Do not put other interactive elements inside without raising their `z-index`.

### T7. Why does `text-muted` look deprecated?
Since 5.3, `.text-muted` is deprecated in favor of `.text-body-secondary`, which responds to color modes.

### T8. Can I use Bootstrap without JavaScript?
Yes, the CSS works alone (grid, utilities, forms, cards). Only interactive plugins (modal, dropdown, collapse, tooltip...) need JS. Some behavior can be built with `<details>` or the CSS-only checkbox approach.

### T9. Why do I need `tabindex="-1"` on a modal?
So the modal container can receive focus programmatically (not in the normal tab order), which helps keyboard and screen reader users when it opens.

### T10. What is the difference between `.collapse` and `.collapsing`?
`.collapse` (hidden) and `.collapse.show` (visible) are the two states. `.collapsing` is a temporary class during the height animation.

### T11. `form-control` on a `<select>`?
Use `.form-select` for select elements (it has the arrow icon). `.form-control` is for inputs and textareas.

### T12. Why does `input-group` break with `.form-floating`?
Wrap the floating input in a `.form-floating` **inside** the `.input-group`, and place addons next to it. Validation messages then need `has-validation` on the group.

### T13. Why do `ms-auto` and `me-auto` replace `ml-auto` and `mr-auto`?
For RTL support: `start` and `end` mean left/right in LTR and right/left in RTL.

### T14. Is Bootstrap mobile-first?
Yes. Base styles are for the smallest screen. Breakpoint classes apply with `min-width`, so styles are added as the screen grows.

### T15. `.offcanvas-lg` — what does it do?
Below lg it behaves like an offcanvas panel. From lg up it becomes a normal inline element. Great for sidebars that turn into a menu on mobile.

### T16. What is `visually-hidden-focusable`?
Visually hidden until it receives keyboard focus. Used for "Skip to content" links.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Bootstrap is made by? | Twitter engineers (now an open-source community) |
| Number of grid columns? | 12 |
| Default grid type in v5? | Flexbox (CSS Grid is optional) |
| jQuery needed in v5? | No |
| Class for full-width container? | `container-fluid` |
| Class for a centered text? | `text-center` |
| Class for rounded image? | `rounded` / `rounded-circle` |
| Responsive image class? | `img-fluid` |
| Hide on mobile, show on md+? | `d-none d-md-block` |
| Remove list bullets? | `list-unstyled` |
| Close button class? | `btn-close` |
| Screen-reader-only text? | `visually-hidden` |
| Margin top 3? | `mt-3` |
| Centered block? | `mx-auto` |
| Vertical center in flex? | `align-items-center` |
| Equal height cards in a row? | `h-100` on cards |
| Dark mode attribute? | `data-bs-theme="dark"` |
| JS bundle that includes Popper? | `bootstrap.bundle.js` |
| Tooltip init needed? | Yes |
| Modal open via attribute? | `data-bs-toggle="modal"` |
| Sass variable for primary color? | `$primary` |
| CSS variable for primary color? | `--bs-primary` |
| Aspect ratio helper? | `.ratio .ratio-16x9` |
| Sticky element? | `sticky-top` |
| Spinner class? | `spinner-border` |
| Full-height viewport? | `vh-100` |
| Text truncate? | `text-truncate` |
| Shadow classes? | `shadow-sm`, `shadow`, `shadow-lg` |
| Rounded sizes? | `rounded-0` … `rounded-5`, `rounded-pill` |
| Border color class? | `border-primary` |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a project where you used Bootstrap. What did you customize?"
**Sample answer (STAR):**
- **S:** We built an internal admin portal with a tight deadline of 3 weeks.
- **T:** Deliver a responsive, accessible UI that matched our brand.
- **A:** I used Bootstrap 5 with Sass, overrode `$primary`, `$border-radius` and the font stack, imported only the components we needed, and created a small set of custom components with the component CSS variables. I added axe checks in CI and a theme toggle with `data-bs-theme`.
- **R:** We shipped on time. The CSS was 38% smaller than the default full build, and accessibility audit issues dropped from 40 to 3.

### P2. "How did you handle design requests that Bootstrap does not support out of the box?"
Describe a decision: customize with variables first; add a small custom component using Bootstrap tokens; or use a different tool for that one piece. Explain trade-offs and how you kept the code consistent.

### P3. "Have you migrated a project between Bootstrap versions?"
Explain the audit, class-rename script, jQuery removal, visual regression, page-by-page rollout and rollback plan. Mention numbers: pages migrated, bug count, time taken, bundle-size change (for example removing jQuery).

### P4. "What do you do when the designer wants pixel-perfect and Bootstrap fights you?"
Align early: map design tokens to Bootstrap variables; accept small differences where the framework helps consistency; for unique areas build custom components. Do not fight the framework with `!important`.

### P5. "Why did you choose Bootstrap (or not) for your last project?"
Answer with criteria: time to market, team skills, design uniqueness, bundle size, long-term maintenance, and alternatives considered (Tailwind, MUI, custom).

### P6. "How do you review Bootstrap code in a pull request?"
Check: correct grid structure, mobile-first classes, no `!important`, accessibility (labels, aria, keyboard), reuse of components instead of copy-paste, no inline styles, correct JS initialization and cleanup.

### P7. "How do you teach Bootstrap to a new team member?"
Grid + breakpoints first, then utilities, then components, then Sass customization. Practice with small tasks (landing page, dashboard). Share a checklist and common mistakes.

---

# 📚 Part 11: Complete Coverage (Classic + Advanced + Mixed)

## 11A. Classic Bootstrap Questions

### K1. What are the advantages and disadvantages of Bootstrap?
**Advantages:** fast development, responsive by default, consistent look, cross-browser, large community, good docs, many themes (Bootswatch), accessible patterns.
**Disadvantages:** similar-looking sites, large CSS if not trimmed, overriding can be messy, learning the class names, some components are opinionated, JS plugins are less flexible than modern framework components.

### K2. What are the main files in Bootstrap's `dist` folder?
`css/bootstrap.css` (+ `.min.css`, `.rtl.css`, `-grid.css`, `-reboot.css`, `-utilities.css`) and `js/bootstrap.js`, `bootstrap.bundle.js` (with Popper), `bootstrap.esm.js` (ES modules). `bootstrap-grid.css` has only the grid + flex utilities. `bootstrap-reboot.css` has only the reset.

### K3. What is Reboot?
Bootstrap's CSS reset/normalize layer built on Normalize.css. It sets `box-sizing: border-box`, removes top margins on headings, sets a consistent base font, and styles native elements. It is included in the main CSS.

### K4. What are the Bootstrap typography classes?
Headings `h1–h6` (and `.h1–.h6`), `display-1…6`, `lead`, `small`, `mark`, `blockquote`, `list-inline`, `fw-*`, `fst-*`, `text-*`. Default font stack: system fonts (`system-ui, -apple-system, "Segoe UI", ...`).

### K5. What are Bootstrap contextual (theme) colors?
`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark` (plus `body`, `black`, `white`, `*-subtle` and `*-emphasis` variants in 5.3). They apply to buttons, alerts, badges, text, backgrounds and borders.

### K6. What is the difference between `.btn-outline-*` and `.btn-*`?
`.btn-*` is a filled button. `.btn-outline-*` has a transparent background and a colored border/text, which fills on hover. `.btn-link` looks like a link.

### K7. How do you create a dropdown?
```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Menu</button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Profile</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><button class="dropdown-item" type="button">Log out</button></li>
  </ul>
</div>
```
Directions: `dropup`, `dropend`, `dropstart`. Alignment: `dropdown-menu-end`, `dropdown-menu-lg-end`.

### K8. What is a list group / breadcrumb / pagination?
```html
<ul class="list-group"><li class="list-group-item active">One</li><li class="list-group-item">Two</li></ul>
<nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Home</a></li><li class="breadcrumb-item active" aria-current="page">Library</li></ol></nav>
<nav aria-label="Pages"><ul class="pagination"><li class="page-item"><a class="page-link" href="#">1</a></li></ul></nav>
```

### K9. What is a Jumbotron? What replaced it?
A big hero box in v3/v4. Removed in v5. Replace it with utilities: `p-5 mb-4 bg-body-tertiary rounded-3`.

### K10. What is Bootswatch?
A set of free ready-made Bootstrap themes (Sass-based) you can use quickly.

### K11. What are placeholders (skeleton loading)?
```html
<p class="card-text placeholder-glow"><span class="placeholder col-7"></span> <span class="placeholder col-4"></span></p>
```
`placeholder-glow` and `placeholder-wave` animate the skeleton.

### K12. How do you create equal-width columns?
Use `.col` without numbers: `<div class="row"><div class="col">1</div><div class="col">2</div></div>`.

## 11B. Advanced Bootstrap

### A1. How do the Sass maps (`$theme-colors`, `$grid-breakpoints`, `$spacers`) work?
They are Sass maps used to generate classes. Change a map to change many classes at once.
```scss
$grid-breakpoints: (xs: 0, sm: 576px, md: 768px, lg: 1024px, xl: 1280px, xxl: 1536px);
$container-max-widths: (sm: 540px, md: 720px, lg: 960px, xl: 1200px, xxl: 1400px);
$spacers: map-merge($spacers, (6: $spacer * 4));    // adds .mt-6, .p-6
```

### A2. Which Sass mixins are most useful?
`media-breakpoint-up(md) { ... }`, `media-breakpoint-down(md)`, `media-breakpoint-between(md, xl)`, `button-variant()`, `make-col()`, `make-row()`, `make-container()`, `border-radius()`.
```scss
.sidebar { display: none; @include media-breakpoint-up(lg) { display: block; } }
```

### A3. What is the `$enable-*` family of options?
Feature flags in Sass: `$enable-rounded`, `$enable-shadows`, `$enable-gradients`, `$enable-transitions`, `$enable-reduced-motion`, `$enable-grid-classes`, `$enable-cssgrid`, `$enable-negative-margins`, `$enable-dark-mode`, `$enable-important-utilities`. Turning off what you do not use reduces CSS size.

### A4. What is the Popper dependency?
A positioning library used for dropdowns, tooltips and popovers (keeps them within the viewport, flips them when there is no space). Use `bootstrap.bundle.js` or add Popper separately. You can pass options with `popperConfig`.

### A5. How does the focus management work in the modal and offcanvas?
When opened, focus moves into the dialog and Tab is trapped inside; ESC closes (unless disabled); when closed, focus returns to the trigger element. The background gets inert-like behavior through the backdrop.

### A6. How do you load Bootstrap with SRI (Subresource Integrity)?
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      integrity="sha384-..." crossorigin="anonymous">
```
Copy the hash from the official docs for the exact version. SRI protects against a tampered CDN.

### A7. How do you use `bootstrap-icons` as an SVG sprite?
```html
<svg class="bi" width="16" height="16" fill="currentColor" aria-hidden="true"><use href="bootstrap-icons.svg#github"/></svg>
```
This loads only the icons you reference (instead of a large icon font).

### A8. How do you handle focus ring and `:focus-visible` in Bootstrap?
Bootstrap shows a box-shadow focus ring for buttons and form controls. If you customize colors, check the focus ring still has enough contrast; in 5.3 you can adjust `--bs-focus-ring-*` variables and the `.focus-ring` helper.

## 11C. HTML + CSS + JS Mixed

### M1. How does Bootstrap's JS find and initialize components?
Via the **data API**: a delegated event listener on `document` watches clicks on `[data-bs-toggle]`. It reads `data-bs-target`, gets or creates the plugin instance (stored on the element), and calls the action. That is why new elements work without re-initialization (except opt-in plugins).

### M2. How do you toggle dark mode with a button (complete)?
```html
<button id="mode" class="btn btn-outline-secondary" aria-pressed="false">Dark</button>
<script>
  const root = document.documentElement;
  const set = (t) => { root.setAttribute('data-bs-theme', t); localStorage.setItem('theme', t); mode.setAttribute('aria-pressed', t === 'dark'); };
  set(localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  mode.addEventListener('click', () => set(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'));
</script>
```

### M3. How do you fetch data and render Bootstrap cards?
```js
const res = await fetch('/api/users');
const users = await res.json();
list.innerHTML = '';
for (const u of users) {
  const col = document.createElement('div'); col.className = 'col';
  col.innerHTML = `<div class="card h-100"><div class="card-body"><h5 class="card-title"></h5></div></div>`;
  col.querySelector('.card-title').textContent = u.name;      // textContent avoids XSS
  list.append(col);
}
```

### M4. How do you use Bootstrap and a custom `IntersectionObserver` together?
Use Bootstrap for layout and a custom observer to add a class such as `.show` or `.fade-in` when elements enter the viewport. Do not use a Bootstrap JS plugin for this.

### M5. How do you lazy-load images inside a Bootstrap grid without layout shift?
Wrap images in `.ratio.ratio-4x3` (or set width and height) and use `loading="lazy"`; the ratio box reserves space.
```html
<div class="ratio ratio-4x3"><img src="p.webp" class="object-fit-cover" alt="..." loading="lazy"></div>
```

---

# 🧠 Part 12: Internals & Architecture of Bootstrap

### B1. How is the Bootstrap source organized?
`scss/` (variables, maps, mixins, functions, utilities, components, forms, helpers) and `js/src/` (base-component, event-handler, data, manipulator, selector-engine, and plugins like modal, collapse...). All plugins extend a `BaseComponent` class that handles instance storage, `dispose`, and events.

### B2. How is the grid implemented?
`.row` is `display: flex; flex-wrap: wrap` with negative margins from CSS variables. `.col-*` sets `flex: 0 0 auto; width: X%`. Gutters are padding using `--bs-gutter-x`. Breakpoint classes are generated by Sass loops over `$grid-breakpoints` with `min-width` media queries.

### B3. How are utilities generated?
The `$utilities` map defines each utility (property, class prefix, values, responsive, state, rtl). A Sass loop in `utilities/api` generates all classes. That is why you can customize them with `map-merge`.

### B4. What does the CSS variable layer look like in 5.3?
Root variables (`--bs-body-bg`, `--bs-body-color`, `--bs-primary`, `--bs-border-color`, `--bs-emphasis-color` …) plus color-mode scoped overrides: `[data-bs-theme="dark"] { ... }`. Components reference these variables, so changing a variable updates everything that uses it.

### B5. How do transitions and reduced motion work?
Bootstrap uses CSS transitions for fade/collapse. With `$enable-reduced-motion: true` it includes `@media (prefers-reduced-motion: reduce)` rules that disable them.

### B6. How is Bootstrap JS written?
Plain ES modules compiled to UMD/ESM, no jQuery (jQuery is optionally supported if present). Events use a custom `EventHandler`, DOM helpers use `Manipulator`/`SelectorEngine`. Instances are stored in a `Data` map keyed by element.

---

# 📋 Part 13: Reference Tables

### R1. Grid classes quick table
| Class | Meaning |
|---|---|
| `.container`, `.container-fluid`, `.container-{bp}` | Wrapper |
| `.row` | Row (flex wrap) |
| `.col`, `.col-auto`, `.col-{n}` | Column widths |
| `.col-{bp}`, `.col-{bp}-{n}`, `.col-{bp}-auto` | Responsive widths |
| `.row-cols-{n}`, `.row-cols-{bp}-{n}` | Columns per row |
| `.g-{n}`, `.gx-{n}`, `.gy-{n}` | Gutters |
| `.offset-{n}`, `.offset-{bp}-{n}` | Left offset |
| `.order-{0-5}`, `.order-first`, `.order-last` | Order |
| `.justify-content-*`, `.align-items-*`, `.align-self-*` | Alignment |

### R2. Spacing scale (default `$spacer = 1rem`)
| Number | Value |
|---|---|
| 0 | 0 |
| 1 | 0.25rem |
| 2 | 0.5rem |
| 3 | 1rem |
| 4 | 1.5rem |
| 5 | 3rem |
| auto | auto |

### R3. Display and flex utilities
`d-none, d-inline, d-inline-block, d-block, d-grid, d-flex, d-inline-flex, d-table, d-table-cell` (+ breakpoints). Flex: `flex-row, flex-column, flex-row-reverse, flex-wrap, flex-nowrap, flex-fill, flex-grow-0/1, flex-shrink-0/1, justify-content-{start|end|center|between|around|evenly}, align-items-{start|end|center|baseline|stretch}, gap-{0-5}`.

### R4. Sizing and position
`w-25/50/75/100/auto`, `h-25/50/75/100/auto`, `mw-100`, `mh-100`, `vw-100`, `vh-100`, `min-vh-100`. Position: `position-{static|relative|absolute|fixed|sticky}`, `top-0/50/100`, `start-*`, `end-*`, `bottom-*`, `translate-middle(-x/-y)`, `fixed-top`, `fixed-bottom`, `sticky-top`.

### R5. Component list
Accordion, Alerts, Badge, Breadcrumb, Buttons, Button group, Card, Carousel, Close button, Collapse, Dropdowns, List group, Modal, Navbar, Navs & tabs, Offcanvas, Pagination, Placeholders, Popovers, Progress, Scrollspy, Spinners, Toasts, Tooltips.

### R6. Bootstrap 4 → 5 class rename map
| v4 | v5 |
|---|---|
| `ml-*`, `mr-*` | `ms-*`, `me-*` |
| `pl-*`, `pr-*` | `ps-*`, `pe-*` |
| `float-left/right` | `float-start/end` |
| `text-left/right` | `text-start/end` |
| `font-weight-bold` | `fw-bold` |
| `font-italic` | `fst-italic` |
| `badge-primary` | `bg-primary` / `text-bg-primary` |
| `sr-only` | `visually-hidden` |
| `close` | `btn-close` |
| `no-gutters` | `g-0` |
| `btn-block` | `d-grid` / `w-100` |
| `form-group` | `mb-3` |
| `custom-select` | `form-select` |
| `custom-control` | `form-check` |
| `dropdown-menu-right` | `dropdown-menu-end` |
| `rounded-sm/lg` | `rounded-1/3` |
| `data-toggle` | `data-bs-toggle` |
| `jumbotron` | utilities |

### R7. Important Sass variables
`$primary`, `$secondary`, `$success`, `$danger`, `$warning`, `$info`, `$light`, `$dark`, `$body-bg`, `$body-color`, `$font-family-sans-serif`, `$font-size-base`, `$line-height-base`, `$border-radius`, `$border-width`, `$spacer`, `$grid-gutter-width`, `$grid-breakpoints`, `$container-max-widths`, `$enable-*`, `$headings-font-weight`, `$btn-padding-y/x`, `$input-border-color`, `$link-color`.

### R8. JavaScript API quick table
| Plugin | Methods |
|---|---|
| Modal | `show, hide, toggle, handleUpdate, dispose, getInstance, getOrCreateInstance` |
| Collapse | `show, hide, toggle` |
| Dropdown | `show, hide, toggle, update` |
| Tooltip / Popover | `show, hide, toggle, enable, disable, update, setContent` |
| Offcanvas | `show, hide, toggle` |
| Toast | `show, hide, isShown` |
| Carousel | `next, prev, to, cycle, pause` |
| Tab | `show` |
| Scrollspy | `refresh` |

---

# 🧩 Part 14: Output-Based & Spot the Error

### O1. How wide is the column at 800px?
```html
<div class="col-12 col-md-6 col-lg-4">...</div>
```
800px is ≥768 (md) and <992 (lg), so `col-md-6` applies: **50% width**. At 1000px it is `col-lg-4`: **33.33%**.

### O2. How many columns per row?
```html
<div class="row">
  <div class="col-8">A</div><div class="col-6">B</div><div class="col-4">C</div>
</div>
```
A (8) fits alone with 4 left, but B (6) does not fit and wraps. Row 1: A. Row 2: B (6) + C (4). So **2 rows**.

### O3. What is wrong here?
```html
<div class="container">
  <div class="col-6">A</div><div class="col-6">B</div>
</div>
```
Columns are not inside a `.row`. They will not behave as a grid (no flex row, gutters mismatch). **Add `<div class="row">`.**

### O4. Is this button full width?
```html
<button class="btn btn-primary btn-block">Go</button>
```
**No** in Bootstrap 5. `.btn-block` was removed. Use `w-100` or `d-grid`.

### O5. When is this element visible?
```html
<div class="d-none d-md-block d-xl-none">...</div>
```
Hidden below md, shown from md to below xl (768px–1199px), hidden from xl up.

### O6. What does this render at 1000px?
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
  <div class="col">1</div><div class="col">2</div><div class="col">3</div><div class="col">4</div>
</div>
```
At lg: **3 columns per row** (so 3 in row one, 1 in row two).

### O7. Why does the tooltip not show?
```html
<button data-bs-toggle="tooltip" title="Save">Save</button>
```
Tooltips need JS initialization (`new bootstrap.Tooltip(el)`). Without it, only the browser's native `title` tooltip appears.

### O8. What spacing is applied?
```html
<div class="mt-2 mt-md-4 px-3">
```
Margin-top 0.5rem below md, 1.5rem from md up; horizontal padding 1rem always.

### O9. Which class is wrong in Bootstrap 5?
```html
<button type="button" class="close" data-dismiss="modal">×</button>
```
`.close` → `.btn-close`, `data-dismiss` → `data-bs-dismiss`. Correct: `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`.

### O10. What is the result?
```html
<div class="d-flex"><div class="ms-auto">Right</div><div>Left?</div></div>
```
`ms-auto` pushes the first item to the far right of the flex row; the second item follows it and remains at the right as well. Both end up on the right side (the free space is on the left).

### O11. Why does the form never show validation styles?
```html
<form class="needs-validation"><input class="form-control" required></form>
```
There is no JS adding `.was-validated`, and no `novalidate` (the browser shows its own message). Add `novalidate` and the submit handler.

### O12. What happens?
```html
<div class="row g-0"><div class="col-6">A</div><div class="col-6">B</div></div>
```
Two columns of 50% with **no gutters** (no padding between them).

---

# ✅ Part 15: MCQs

1. How many columns are in the Bootstrap grid? → **12**
2. Which class makes a full-width container? → **`container-fluid`**
3. Which breakpoint starts at 768px? → **md**
4. Which class hides an element on all screens? → **`d-none`**
5. Which replaced `ml-*` in v5? → **`ms-*`**
6. Which JS file includes Popper? → **`bootstrap.bundle.js`**
7. Does Bootstrap 5 need jQuery? → **No**
8. Which attribute opens a modal? → **`data-bs-toggle="modal"`**
9. Which class makes images responsive? → **`img-fluid`**
10. What does `col-md-6` do below 768px? → **Full width (stacked)**
11. Which class removes gutters? → **`g-0`**
12. Which class replaced `sr-only`? → **`visually-hidden`**
13. Which feature is new in 5.3? → **Color modes (`data-bs-theme`)**
14. Which component is new in v5? → **Offcanvas**
15. Which class centers text? → **`text-center`**
16. How do you center a column horizontally? → **`justify-content-center` on the row (or `mx-auto`)**
17. What replaced `.btn-block`? → **`d-grid` / `w-100`**
18. Which class gives equal-width columns? → **`.col`**
19. Which Sass file defines variables? → **`_variables.scss`**
20. Which tooltips need initialization? → **All tooltips and popovers**
21. Which class creates a rounded pill? → **`rounded-pill`**
22. Which class gives a sticky navbar? → **`sticky-top`**
23. Which is the correct form select class? → **`form-select`**
24. Which class makes a table scroll on small screens? → **Wrapper `.table-responsive`**
25. Which class gives a 16:9 box? → **`ratio ratio-16x9`**
26. Which data attribute links an accordion item to its group? → **`data-bs-parent`**
27. Which is the default container max-width at xl? → **1140px**
28. Which class replaced `.text-muted` in 5.3? → **`.text-body-secondary`**
29. Which class spaces flex items? → **`gap-*`**
30. Which event fires after a modal is fully hidden? → **`hidden.bs.modal`**
31. Which Sass flag enables CSS grid layout? → **`$enable-cssgrid`**
32. Which class puts a badge at a corner? → **`position-absolute top-0 start-100 translate-middle`**
33. Which attribute gives a dismissible alert its close behavior? → **`data-bs-dismiss="alert"`**
34. What does `navbar-expand-lg` do? → **Expands the navbar from lg up; collapses below**
35. Which class makes the whole card clickable via a link? → **`stretched-link`**
36. Which is the correct way to make a full-height section? → **`min-vh-100`**
37. Which wrapper do `.col` elements need? → **`.row`**
38. What are Bootswatch themes? → **Free ready-made Bootstrap themes**
39. Which class set gives equal height cards? → **`h-100` on cards inside columns**
40. Which class aligns the dropdown menu to the right edge? → **`dropdown-menu-end`**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are the mistakes that developers make again and again with Bootstrap. Interviewers often ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Columns without a `.row` (or a `.row` without a `.container`)
**❌ Wrong:**
```html
<div class="container">
  <div class="col-6">A</div>
  <div class="col-6">B</div>
</div>
```
**🤔 Why it is a problem:** `.col-*` needs a flex parent (`.row`). Without it, columns stack or misalign. A `.row` without a container has negative margins that stick out and cause a horizontal scrollbar.

**✅ Correct:**
```html
<div class="container">
  <div class="row">
    <div class="col-6">A</div>
    <div class="col-6">B</div>
  </div>
</div>
```
**💬 Say:** "The structure is always container → row → col."

---

### Mistake 2: Forgetting that breakpoint classes are mobile-first ("md and up")
**❌ Wrong:**
```html
<div class="col-md-6">Half width on phones too?</div>
```
**🤔 Why it is a problem:** `col-md-6` does nothing below 768px. The column is full width on phones. Many people expect it to be half width on small screens.

**✅ Correct:**
```html
<div class="col-6 col-md-4 col-lg-3">...</div>
```
Start with the smallest layout, then add larger breakpoints.
**💬 Say:** "Bootstrap is mobile-first: unprefixed classes apply to all sizes, prefixed ones apply from that breakpoint up."

---

### Mistake 3: Using Bootstrap 4 classes and attributes with Bootstrap 5
**❌ Wrong:**
```html
<button data-toggle="modal" data-target="#m" class="btn btn-primary btn-block ml-2">Open</button>
```
**🤔 Why it is a problem:** In v5 these no longer work: `data-toggle` → `data-bs-toggle`, `data-target` → `data-bs-target`, `btn-block` is removed, `ml-2` → `ms-2`. The modal will not open and the layout is off.

**✅ Correct:**
```html
<button data-bs-toggle="modal" data-bs-target="#m" class="btn btn-primary w-100 ms-2">Open</button>
```
**💬 Say:** "I always check the version in the docs, and I know the main v4 → v5 renames."

---

### Mistake 4: Loading the Bootstrap JS the wrong way (or twice)
**❌ Wrong:**
```html
<script src="bootstrap.min.js"></script>          <!-- no Popper -->
<script src="bootstrap.bundle.min.js"></script>   <!-- loaded twice -->
```
**🤔 Why it is a problem:** Dropdowns/tooltips fail without Popper. Loading the plugin twice attaches duplicate handlers (a dropdown that opens and closes immediately).

**✅ Correct:**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
```
**💬 Say:** "One `bootstrap.bundle` file, loaded once, with `defer`."

---

### Mistake 5: Forgetting to initialize tooltips and popovers
**❌ Wrong:**
```html
<button data-bs-toggle="tooltip" data-bs-title="Info">Hover</button>
```
**🤔 Why it is a problem:** These plugins are opt-in. Nothing happens until JS creates them.

**✅ Correct:**
```js
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
```
**💬 Say:** "Tooltips and popovers are opt-in for performance, so I initialize them in code."

---

### Mistake 6: Overriding Bootstrap with `!important` and deep selectors
**❌ Wrong:**
```css
body .container .row .col .btn.btn-primary { background: #6c5ce7 !important; }
```
**🤔 Why it is a problem:** It is hard to maintain, hard to override again, and you must repeat it for every state (hover, active, focus, disabled).

**✅ Correct (Sass):**
```scss
$primary: #6c5ce7;
@import "bootstrap/scss/bootstrap";
```
**✅ Correct (CSS variables, no build):**
```css
.btn-primary { --bs-btn-bg: #6c5ce7; --bs-btn-border-color: #6c5ce7; --bs-btn-hover-bg: #5b4bd6; }
```
**💬 Say:** "I customize through Sass variables or component CSS variables, not by fighting specificity."

---

### Mistake 7: Editing files in `node_modules` or the compiled Bootstrap CSS
**❌ Wrong:** Changing `bootstrap.css` directly.
**🤔 Why it is a problem:** Your changes disappear on the next `npm install`, and you cannot upgrade safely.

**✅ Correct:** Keep your changes in your own `_custom.scss` and import Bootstrap from the package.
**💬 Say:** "Never edit vendor code; extend it."

---

### Mistake 8: Importing the whole framework when you need a few parts
**❌ Wrong:**
```scss
@import "bootstrap/scss/bootstrap";   // everything, even unused components
```
**🤔 Why it is a problem:** Bigger CSS and JS, slower pages.

**✅ Correct:**
```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/utilities/api";
```
```js
import { Modal } from 'bootstrap';
```
**💬 Say:** "I import only the modules I use to keep the bundle small."

---

### Mistake 9: Mixing Bootstrap's JavaScript with React/Angular/Vue DOM control
**❌ Wrong:**
```jsx
useEffect(() => { new bootstrap.Modal('#myModal').show(); });  // never disposed
```
**🤔 Why it is a problem:** Both the framework and Bootstrap change the same DOM. This causes memory leaks, duplicate listeners and out-of-sync state.

**✅ Correct:** Use `react-bootstrap` / `ng-bootstrap`, or create the instance once and **dispose** it on unmount.
**💬 Say:** "In a SPA I use the framework wrappers, or I manage the plugin lifecycle carefully."

---

### Mistake 10: Using fixed navbar without space for it
**❌ Wrong:**
```html
<nav class="navbar fixed-top">...</nav>
<main>Content hidden under the navbar</main>
```
**🤔 Why it is a problem:** `fixed-top` removes the navbar from the page flow, so the first part of the content is hidden. Anchor links also land under it.

**✅ Correct:**
```css
body { padding-top: 4.5rem; }
html { scroll-padding-top: 4.5rem; }
```
Or use `.sticky-top`, which keeps the navbar in the flow.
**💬 Say:** "`sticky-top` avoids the spacing problem; for `fixed-top` I add padding and scroll-padding."

---

### Mistake 11: Not using `.table-responsive` or `.img-fluid`
**❌ Wrong:**
```html
<table class="table">...12 columns...</table>
<img src="big.jpg">
```
**🤔 Why it is a problem:** Wide tables and images push the page wider than the screen on mobile, causing sideways scrolling.

**✅ Correct:**
```html
<div class="table-responsive"><table class="table">...</table></div>
<img src="big.jpg" class="img-fluid" alt="..." width="1200" height="800">
```
**💬 Say:** "Any element that can be wider than the screen gets a responsive wrapper."

---

### Mistake 12: Skipping accessibility details
**❌ Wrong:**
```html
<button class="btn btn-light"><i class="bi bi-x"></i></button>
<img src="logo.png">
<div class="modal">...</div>
```
**🤔 Why it is a problem:** The icon button has no name for screen readers; the image has no `alt`; the modal has no label.

**✅ Correct:**
```html
<button class="btn btn-light" aria-label="Close"><i class="bi bi-x" aria-hidden="true"></i></button>
<img src="logo.png" alt="Company logo">
<div class="modal fade" tabindex="-1" aria-labelledby="mTitle" aria-hidden="true">...</div>
```
**💬 Say:** "Bootstrap gives the patterns, but labels, alt text and contrast are my responsibility."

---

### Mistake 13: Using fixed colors that break in dark mode
**❌ Wrong:**
```html
<div class="bg-light text-muted">...</div>
```
**🤔 Why it is a problem:** `bg-light` stays light in dark mode, so the text is unreadable. `text-muted` is deprecated in 5.3.

**✅ Correct:**
```html
<div class="bg-body-tertiary text-body-secondary">...</div>
```
**💬 Say:** "I use color-mode aware classes such as `bg-body-*` and `text-body-*`."

---

### Mistake 14: Putting `container` inside `container` and using too many nested rows
**❌ Wrong:**
```html
<div class="container"><div class="container"><div class="row"><div class="col"><div class="row"><div class="col">...
```
**🤔 Why it is a problem:** Double padding, narrow content, and extra DOM that is hard to read.

**✅ Correct:** One container per section. Nest a `.row` only inside a `.col` when you really need a sub-grid.
**💬 Say:** "Keep the markup as flat as possible."

---

### Mistake 15: Forgetting `novalidate` / `was-validated` in forms
**❌ Wrong:**
```html
<form class="needs-validation"><input class="form-control" required>...</form>
```
**🤔 Why it is a problem:** Without JS adding `.was-validated`, Bootstrap's validation styles never show. Without `novalidate`, the browser shows its own default bubble.

**✅ Correct:** Use `novalidate`, the submit handler that adds `was-validated`, and `.invalid-feedback` after each input. Still validate on the server.
**💬 Say:** "Bootstrap styles the validation state; the rules come from HTML attributes or my JS, and the server has the final say."

---

### Mistake 16: Putting layout styles in inline `style` instead of utilities
**❌ Wrong:**
```html
<div style="margin-top:16px; display:flex; justify-content:space-between">...</div>
```
**🤔 Why it is a problem:** Not responsive, not reusable, and hard to override (inline wins over classes).

**✅ Correct:**
```html
<div class="mt-3 d-flex justify-content-between">...</div>
```
**💬 Say:** "I prefer utilities and tokens to inline styles."

---

### Mistake 17: Using too many utility classes instead of creating a component
**❌ Wrong:** Repeating a 15-class string on 40 buttons.
**🤔 Why it is a problem:** Hard to update, inconsistent results when someone forgets a class.

**✅ Correct:** Create a small component class (Sass `@extend`/mixins, or a framework component) and reuse it.
**💬 Say:** "Utilities for one-off spacing, components for repeated patterns."

---

### Mistake 18: Loading two CSS frameworks or two versions of Bootstrap
**❌ Wrong:** CDN Bootstrap 4 in the layout and npm Bootstrap 5 in the app.
**🤔 Why it is a problem:** Conflicting styles, strange spacing, and JS errors.

**✅ Correct:** One version, one source. Check the Network tab.
**💬 Say:** "I verify there is a single Bootstrap version loaded."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you answer. A junior names classes. A senior explains **why, trade-offs, customization and numbers**.
> **What should you do?** Practice the "Strong" style for every question.

### Signal 1: You customize through the right layer
| | Example answer |
|---|---|
| ❌ Weak | "I write my own CSS to override Bootstrap." |
| ✅ Strong | "I never override compiled CSS. I change Sass variables before importing Bootstrap and the component CSS variables (`--bs-btn-bg`) at runtime. I import only the modules I use, which cut our CSS by about 40%." |
**Prove it:** mention Sass maps, `$enable-*`, the Utility API, CSS variables.

### Signal 2: You understand the grid deeply
| | Example answer |
|---|---|
| ❌ Weak | "It has 12 columns." |
| ✅ Strong | "It is a mobile-first flexbox grid. Classes apply from their breakpoint up, rows have negative margins that cancel the column padding, gutters use `--bs-gutter-x`, and I use `row-cols-*` and `g-*` to avoid repeating classes. When I need real 2-D layout I enable the optional CSS Grid." |
**Prove it:** mention `container → row → col`, breakpoints, gutters, `row-cols`.

### Signal 3: You manage JavaScript plugins correctly
| | Example answer |
|---|---|
| ❌ Weak | "I add the script and it works." |
| ✅ Strong | "Plugins use a data API with delegated events. Tooltips and popovers are opt-in, so I initialize them. In React I use react-bootstrap, or I dispose instances on unmount. I listen to events like `hidden.bs.modal` instead of using timeouts." |
**Prove it:** `getOrCreateInstance`, `dispose`, `shown.bs.*` events, Popper.

### Signal 4: You care about accessibility
| | Example answer |
|---|---|
| ❌ Weak | "Bootstrap is already accessible." |
| ✅ Strong | "Bootstrap gives focus styles, ARIA patterns and keyboard support, but I still add labels, alt text, `aria-label` on icon buttons, check contrast after changing the theme, and test with a keyboard and axe." |
**Prove it:** `.visually-hidden`, `aria-labelledby` on modals, contrast checks.

### Signal 5: You know the trade-offs against other tools
| | Example answer |
|---|---|
| ❌ Weak | "Bootstrap is old; Tailwind is better." |
| ✅ Strong | "Bootstrap is great for fast, consistent admin UIs and MVPs. For a highly custom brand I prefer utility-first or a custom design system. The decision depends on design uniqueness, team skill, bundle size and maintenance." |
**Prove it:** compare with Tailwind, MUI and custom CSS in a table.

### Signal 6: You have migration and scale experience
| | Example answer |
|---|---|
| ❌ Weak | "I used Bootstrap in a project." |
| ✅ Strong | "I migrated a Bootstrap 4 app to 5: scripted class renames, replaced jQuery plugins with `bootstrap.Modal`, removed jQuery (about 30 KB gzip), and rolled out page by page behind a flag with visual regression tests." |
**Prove it:** numbers, rollout plan, tooling.

### Signal 7: You theme at runtime
| | Example answer |
|---|---|
| ❌ Weak | "We have a different CSS file per theme." |
| ✅ Strong | "We use `data-bs-theme` for dark mode and CSS variables per tenant for brand colors, with automatic contrast validation. No per-tenant build is needed." |
**Prove it:** `data-bs-theme`, `--bs-primary-rgb`, color modes.

### 🔊 Phrases that sound senior
- "I customize at the variable level, not by overriding."
- "It is mobile-first, so I design the smallest layout first."
- "I import only the modules we use."
- "In a SPA I use the framework wrapper, or manage the plugin lifecycle."
- "I check contrast and keyboard behavior after theming."

### 🚩 Phrases that sound junior
- "I add `!important` to override." · "I copy markup from the docs without understanding it." · "I use `col-md-6` and expect it to work on phones." · "I edit the Bootstrap CSS file."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 Minimum Bootstrap 5.3 page
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ritesh Kumar</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <main class="container py-4">
    <div class="row g-3">
      <div class="col-12 col-md-6">...</div>
      <div class="col-12 col-md-6">...</div>
    </div>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
</body>
</html>
```
(In production add `integrity` and `crossorigin` from the official docs.)

## 18.2 Breakpoints
| xs | sm | md | lg | xl | xxl |
|---|---|---|---|---|---|
| <576 | ≥576 | ≥768 | ≥992 | ≥1200 | ≥1400 |
Container widths: 540 / 720 / 960 / 1140 / 1320.

## 18.3 The 12 classes you use every day
`container`, `row`, `col-*`, `g-*`, `d-flex`, `justify-content-*`, `align-items-*`, `gap-*`, `mt/mb/px/py-*`, `text-center`, `w-100`, `img-fluid`.

## 18.4 Which component for which job?
| Need | Use |
|---|---|
| Top menu | `navbar` + `collapse` |
| Mobile side menu / filters | `offcanvas` |
| Dialog | `modal` |
| Short message | `alert` / `toast` |
| Content blocks | `card` |
| FAQ | `accordion` |
| Tabs | `nav-tabs` + `tab-pane` |
| Image slider | `carousel` |
| Loading | `spinner-border` / `placeholder` |
| Hint on hover | `tooltip` (init needed) |
| Action menu | `dropdown` |

## 18.5 Customization order of preference
1. Sass variables / maps (`$primary`, `$border-radius`)
2. Component CSS variables (`--bs-btn-bg`)
3. Utility API (add or remove utilities)
4. Your own small component classes
5. Plain CSS override (equal specificity, loaded after Bootstrap)
6. `!important` → **last resort, avoid**

## 18.6 Accessibility checklist
- [ ] `lang` on `<html>`, viewport meta
- [ ] Labels on all inputs, `aria-label` on icon-only buttons
- [ ] Modals: `aria-labelledby`, `tabindex="-1"`
- [ ] Alt text on images; `.visually-hidden` helper text
- [ ] Contrast checked after theme changes
- [ ] Keyboard test: navbar, dropdown, modal, tabs
- [ ] Carousel: controls with labels, pause option

## 18.7 Performance checklist
- [ ] Import only needed Sass partials and JS plugins
- [ ] Remove unused utilities
- [ ] CDN with SRI, or self-host with hashed names + Brotli
- [ ] `defer` the bundle script
- [ ] SVG sprite for icons instead of the full icon font
- [ ] Images: `img-fluid`, width/height, `loading="lazy"`

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| Hamburger / modal does nothing | JS bundle missing, wrong `data-bs-*`, v4 attributes | Load bundle once; use `data-bs-*` |
| Tooltip not showing | Not initialized | `new bootstrap.Tooltip(el)` |
| Columns stacked | Not in `.row`, or breakpoint too large | Wrap in `.row`; add base `col-*` |
| Horizontal scroll on mobile | `.row` without container; wide table/image | Container, `.table-responsive`, `.img-fluid` |
| Custom CSS ignored | Load order / specificity | Load after Bootstrap; use variables |
| Dropdown clipped | Parent has `overflow` | Change boundary / move it out |
| Content under the navbar | `fixed-top` | Body padding or `sticky-top` |
| Validation styles missing | No `was-validated` / `novalidate` | Add submit handler and `novalidate` |
| Colors wrong in dark mode | Fixed colors (`bg-light`) | Use `bg-body-*` / `text-body-*` |
| Sass "undefined variable" | Wrong import order | functions → overrides → variables → maps → mixins |

## 18.9 30-second answers
- **What is Bootstrap?** A responsive, mobile-first front-end framework with a 12-column grid, components, utilities and JS plugins.
- **How does the grid work?** Container → row → columns; 12 columns; breakpoint classes apply from that size up; gutters with `g-*`.
- **What changed in v5?** No jQuery, `data-bs-*`, `ms/me` instead of `ml/mr`, offcanvas, RTL, CSS variables; 5.3 adds dark mode.
- **How do you customize?** Sass variables first, then CSS variables, then small overrides; never edit the source.
- **How do you reduce size?** Import only needed modules, remove unused utilities, tree-shake JS.
- **Bootstrap vs Tailwind?** Bootstrap = ready components, faster for standard UIs. Tailwind = utility-first, better for unique designs.
- **Why do tooltips need JS?** They are opt-in for performance and use Popper.
- **How to use with React?** `react-bootstrap`, not raw JS plugins.

## 18.10 Last-minute checklist before the interview
- [ ] I can explain the grid, breakpoints and gutters without notes.
- [ ] I know the main v4 → v5 changes.
- [ ] I can customize with Sass variables and CSS variables.
- [ ] I can build a navbar, card grid, modal and form from memory.
- [ ] I have one performance story and one accessibility story.
- [ ] I can compare Bootstrap with Tailwind and a custom design system.
