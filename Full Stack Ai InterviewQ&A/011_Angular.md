# Angular Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Covers **modern Angular (v17 → v21)**: standalone components, signals, the new control flow (`@if`, `@for`, `@defer`), functional guards/interceptors, and zoneless change detection. Because many companies still run **older NgModule-based apps**, those patterns are included and marked. Angular releases every six months, so confirm exact status (stable vs preview) of newer APIs in the official docs.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging (error codes) · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** Angular answers are strongest when you connect **dependency injection, change detection and RxJS/signals**. For each topic say: *how it is created (DI), when it updates (change detection), and how it is cleaned up (lifecycle/unsubscribe).*

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios (Error Codes)](#-part-7-debugging-scenarios-error-codes)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (NgModules + RxJS + Ecosystem + Mixed)](#-part-11-complete-coverage-ngmodules--rxjs--ecosystem--mixed)
- [Part 12: Angular Internals](#-part-12-angular-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Angular? How is it different from AngularJS? *(Conceptual)*
**Answer:** Angular is a **TypeScript-based, opinionated front-end framework** from Google for building single-page applications. It includes routing, forms, HTTP, dependency injection, testing tools and a CLI out of the box.
| | AngularJS (1.x) | Angular (2+) |
|---|---|---|
| Language | JavaScript | TypeScript |
| Architecture | MVC / scopes | Component-based |
| Data binding | Two-way (digest cycle) | One-way by default, two-way with `[( )]` |
| Mobile support | No | Yes |
| Performance | Slower | Much faster (AOT, Ivy, signals) |
| Status | End of life | Actively developed |

### Q2. What are the main building blocks of an Angular app?
**Components** (UI + logic), **templates** (HTML with Angular syntax), **directives**, **pipes**, **services** (shared logic injected by DI), **routing**, **forms**, and **modules** (optional now; **standalone components** are the default since Angular 19). The app is bootstrapped from `main.ts` with `bootstrapApplication(AppComponent, appConfig)`.

### Q3. What is a component? Show a minimal one. *(Must-know)*
```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],                         // standalone: import what the template uses
  template: `
    <h2>Count: {{ count() }}</h2>
    <button (click)="increment()">+</button>
  `,
  styles: [`h2 { color: teal; }`],
})
export class CounterComponent {
  count = signal(0);
  increment() { this.count.update((c) => c + 1); }
}
```
A component = class + `@Component` metadata (selector, template, styles, imports). Use it in HTML as `<app-counter />`.

### Q4. What is a standalone component? Why did Angular move away from NgModules?
A **standalone component** declares its own dependencies in `imports: []` and does not need an `NgModule`. Benefits: less boilerplate, easier lazy loading, better tree-shaking, simpler mental model. In Angular 19+ components are standalone **by default** (`standalone: true` is implicit). NgModules still work and are widely used in legacy apps.
```ts
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
});
```

### Q5. What are the types of data binding? *(Must-know)*
| Type | Syntax | Direction |
|---|---|---|
| Interpolation | `{{ title }}` | Component → view |
| Property binding | `[disabled]="isBusy"` | Component → view |
| Event binding | `(click)="save()"` | View → component |
| Two-way binding | `[(ngModel)]="name"` or `[(value)]="v"` | Both |
| Attribute binding | `[attr.aria-label]="label"` | Component → attribute |
| Class/style binding | `[class.active]="on"`, `[style.width.px]="w"` | Component → view |
`[(x)]` ("banana in a box") is shorthand for `[x]="v" (xChange)="v = $event"`.

### Q6. What are directives? Types?
Directives add behavior to DOM elements.
- **Components**: directives with a template.
- **Structural directives**: change the DOM structure (`*ngIf`, `*ngFor`, `*ngSwitch`). Since Angular 17 prefer the built-in **control flow**.
- **Attribute directives**: change appearance/behavior (`ngClass`, `ngStyle`, custom ones).

### Q7. What is the new control flow (`@if`, `@for`, `@switch`)? *(Must-know)*
Built-in template syntax (Angular 17+) that replaces `*ngIf`/`*ngFor`/`*ngSwitch`: faster, no imports needed, better type narrowing.
```html
@if (user(); as u) {
  <p>Hello {{ u.name }}</p>
} @else if (loading()) {
  <p>Loading...</p>
} @else {
  <p>Please log in</p>
}

@for (item of items(); track item.id; let i = $index) {
  <li>{{ i + 1 }}. {{ item.name }}</li>
} @empty {
  <li>No items</li>
}

@switch (status()) {
  @case ('ok') { <p>OK</p> }
  @case ('error') { <p>Error</p> }
  @default { <p>Unknown</p> }
}
```
`@for` **requires `track`** (like `trackBy`) for efficient DOM updates.

### Q8. What are pipes? Pure vs impure?
Pipes transform values in templates: `{{ price | currency:'INR' }}`, `{{ date | date:'dd/MM/yyyy' }}`, `{{ name | uppercase }}`, `{{ obs$ | async }}`.
- **Pure pipe** (default): runs only when its input reference changes. Fast.
- **Impure pipe** (`pure: false`): runs on every change detection cycle. Use rarely (the `async` pipe is impure by design).
```ts
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, max = 50): string { return value.length > max ? value.slice(0, max) + '…' : value; }
}
```

### Q9. What is a service and dependency injection (DI)? *(Must-know)*
A **service** is a class that holds shared logic or data (API calls, state). **DI** is Angular's mechanism for creating and providing instances to classes that need them, so classes do not create their dependencies themselves (loose coupling, easier testing).
```ts
@Injectable({ providedIn: 'root' })           // singleton for the whole app, tree-shakable
export class UserService {
  private http = inject(HttpClient);
  getUsers() { return this.http.get<User[]>('/api/users'); }
}

@Component({ /* ... */ })
export class UsersComponent {
  private users = inject(UserService);        // modern style
  // constructor(private users: UserService) {}   // classic style, still valid
}
```

### Q10. What are the component lifecycle hooks? *(Must-know)*
In order:
1. `constructor` (DI only; no template access)
2. `ngOnChanges` (when `@Input` references change; before `ngOnInit`)
3. `ngOnInit` (once; initialization after inputs are set)
4. `ngDoCheck` (every change detection run; custom checks)
5. `ngAfterContentInit` / `ngAfterContentChecked` (projected content)
6. `ngAfterViewInit` / `ngAfterViewChecked` (view and child views ready)
7. `ngOnDestroy` (cleanup: unsubscribe, timers, listeners)
Newer: `afterNextRender` / `afterRender` for DOM work after rendering (SSR-safe).

### Q11. `constructor` vs `ngOnInit`: what is the difference?
The constructor is a TypeScript feature used for **DI and simple field initialization**; inputs are not set yet. `ngOnInit` runs after the first `ngOnChanges`, when inputs and bindings are available: do initialization and data loading there.

### Q12. How do components communicate? *(Must-know)*
| Direction | Tool |
|---|---|
| Parent → child | `@Input()` or signal `input()` |
| Child → parent | `@Output()` + `EventEmitter` or signal `output()` |
| Two-way | `model()` or `[(x)]` |
| Parent reads child | `@ViewChild` / `viewChild()` |
| Unrelated components | A shared service (signals/RxJS) or a store (NgRx) |
| Router | Route params / query params / state |
```ts
// Modern (v17.1+ / stable in v19)
export class RatingComponent {
  value = input.required<number>();           // parent → child
  changed = output<number>();                 // child → parent
  // model: checked = model(false);           // two-way
}
```
```html
<app-rating [value]="3" (changed)="onRate($event)" />
```

### Q13. What is content projection (`ng-content`)?
Lets a parent pass HTML into a child's template (like slots).
```html
<!-- card.component.html -->
<div class="card">
  <header><ng-content select="[card-header]" /></header>
  <ng-content />
</div>
<!-- usage -->
<app-card><h2 card-header>Title</h2><p>Body</p></app-card>
```

### Q14. What is routing? Show a basic setup.
```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES), canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
// app.config.ts
provideRouter(routes, withComponentInputBinding())
```
```html
<nav><a routerLink="/" routerLinkActive="active">Home</a> <a [routerLink]="['/users', 5]">User 5</a></nav>
<router-outlet />
```
```ts
const id = inject(ActivatedRoute).snapshot.paramMap.get('id');
this.router.navigate(['/users', id], { queryParams: { tab: 'info' } });
```
With `withComponentInputBinding()`, route params can bind directly to inputs: `id = input<string>()`.

### Q15. What are Angular forms? Template-driven vs Reactive *(Comparison)*
| | Template-driven | Reactive |
|---|---|---|
| Defined in | Template (`ngModel`) | Component class (`FormGroup`, `FormControl`) |
| Module/import | `FormsModule` | `ReactiveFormsModule` |
| Validation | Directives (`required`) | Functions (`Validators`) |
| Testability | Harder | Easier |
| Scalability / dynamic forms | Limited | Better |
| Best for | Simple forms | Complex forms |
```ts
form = new FormGroup({
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
});
onSubmit() { if (this.form.valid) console.log(this.form.getRawValue()); }
```

### Q16. How does `HttpClient` work?
Provide it with `provideHttpClient()`, inject `HttpClient`, and call `get/post/put/delete`. Methods return **cold Observables**: the request is sent only when you subscribe (or use the `async` pipe).
```ts
getUsers() { return this.http.get<User[]>('/api/users'); }
createUser(u: NewUser) { return this.http.post<User>('/api/users', u); }
```

### Q17. What is an Observable? Observable vs Promise *(Must-know)*
| | Promise | Observable (RxJS) |
|---|---|---|
| Values | One | Zero, one or many over time |
| Eager/lazy | Eager (starts immediately) | Lazy (starts on subscribe) |
| Cancel | No | Yes (`unsubscribe`) |
| Operators | `then/catch` | Many (`map`, `switchMap`, `debounceTime`...) |
| Sync/async | Always async | Can be sync or async |

### Q18. What is the `async` pipe?
Subscribes to an Observable/Promise in the template, renders the latest value and **unsubscribes automatically** on destroy.
```html
@if (users$ | async; as users) { @for (u of users; track u.id) { <li>{{ u.name }}</li> } }
```
Use it once per stream (each use is a separate subscription → duplicate HTTP calls) or share the result with `as`/`shareReplay`.

### Q19. What are signals? *(Must-know, modern Angular)*
Signals are **reactive values** that notify Angular exactly where they are used, enabling fine-grained updates.
```ts
count = signal(0);                              // writable
double = computed(() => this.count() * 2);      // derived, lazy, memoized
constructor() { effect(() => console.log('count is', this.count())); }   // side effect
this.count.set(5); this.count.update((c) => c + 1);
```
Read a signal by **calling it** (`count()`). Signals work in templates, services, and with RxJS interop (`toSignal`, `toObservable`).

### Q20. What is change detection? Default vs OnPush
Change detection updates the view when data changes. **Default**: Angular checks every component on each cycle (triggered by zone.js after events, timers, HTTP). **OnPush** (`changeDetection: ChangeDetectionStrategy.OnPush`): the component is checked only when (1) an `@Input` reference changes, (2) an event occurs in the component or children, (3) an `async` pipe/signal read in the template emits, or (4) you call `markForCheck()`. OnPush + signals is the recommended modern approach.

### Q21. What is the Angular CLI? Common commands
```bash
npm i -g @angular/cli
ng new my-app            # create a project
ng serve                 # dev server (http://localhost:4200)
ng generate component users/user-list   # alias: ng g c
ng generate service core/auth
ng build --configuration production
ng test                  # unit tests
ng lint                  # linting (via ESLint setup)
ng update                # upgrade Angular & dependencies
ng add @angular/material # add libraries with schematics
```

### Q22. What are `ng-container`, `ng-template` and `ngTemplateOutlet`?
`<ng-container>` groups elements without adding a DOM node. `<ng-template>` defines a template that is **not rendered** until used. `ngTemplateOutlet` renders a template reference elsewhere.
```html
<ng-template #loading><p>Loading...</p></ng-template>
@if (data()) { <p>{{ data() }}</p> } @else { <ng-container *ngTemplateOutlet="loading" /> }
```

### Q23. What is `ViewChild` and when is it available?
Gets a reference to a child component, directive or element from the template. Available **after the view initializes** (`ngAfterViewInit`), unless `static: true` and the element is not inside a conditional block. Signal version: `input = viewChild<ElementRef>('myInput')`.
```ts
@ViewChild('myInput') inputRef!: ElementRef<HTMLInputElement>;
ngAfterViewInit() { this.inputRef.nativeElement.focus(); }
```

### Q24. How do you handle environments and configuration?
Older: `environment.ts` / `environment.prod.ts` with file replacements. Newer: generate environments with `ng generate environments`, or load runtime config via `fetch('/config.json')` + `provideAppInitializer`. Do not put secrets in the client bundle.

### Q25. What are the Angular project files?
`angular.json` (workspace/build config), `package.json`, `tsconfig.json` (strictness), `src/main.ts` (bootstrap), `src/app/app.config.ts` (providers), `src/app/app.routes.ts` (routes), `src/index.html`, `src/styles.css`, `public/` or `assets/` (static files).

### Q26. What is AOT vs JIT compilation?
**AOT (Ahead-of-Time)** compiles templates at build time: smaller bundles, faster startup, template errors found early (default today). **JIT** compiles in the browser at runtime (older/dev only).

### Q27. What are Angular decorators? Name common ones.
`@Component`, `@Directive`, `@Pipe`, `@Injectable`, `@NgModule`, `@Input`, `@Output`, `@ViewChild`, `@ContentChild`, `@HostListener`, `@HostBinding`, `@Inject`, `@Optional`. Modern signal-based alternatives exist for inputs/outputs/queries (`input()`, `output()`, `viewChild()`).

### Q28. What is the `*ngFor` `trackBy` / `@for` `track`?
It tells Angular how to identify items so it can reuse DOM nodes when the list changes instead of re-creating everything.
```html
@for (u of users(); track u.id) { <app-user [user]="u" /> }
<!-- old: <li *ngFor="let u of users; trackBy: trackById"> -->
```
Track by a stable ID (not by object identity of new objects or by index for changing lists).

### Q29. How do you style components? What is view encapsulation?
Styles in `styles`/`styleUrl` are **scoped** to the component by default (`ViewEncapsulation.Emulated`: Angular adds unique attributes like `_ngcontent-xyz`). Options: `None` (global), `ShadowDom` (native shadow DOM). Avoid `::ng-deep` (deprecated); prefer CSS variables and global styles for library overrides.

### Q30. What does `ng build` produce and how do you deploy?
A `dist/` folder with hashed JS/CSS bundles. For a SPA, serve static files from any web server (Nginx, S3 + CloudFront, Firebase Hosting) with a **fallback to `index.html`** for deep links. For SSR, deploy the Node server output.

### Q31. What are Angular Material and CDK?
**Angular Material** provides ready-made Material Design components (buttons, tables, dialogs). **CDK (Component Dev Kit)** provides behavior primitives without styles (overlay, a11y, drag-drop, virtual scroll, table) for building your own components.

### Q32. How do you handle errors in HTTP calls (basic)?
```ts
this.http.get<User[]>('/api/users').pipe(
  retry(2),
  catchError((err) => { console.error(err); return of([]); })
).subscribe((users) => (this.users = users));
```
Use interceptors for global handling and show user-friendly messages.

### Q33. What is two-way binding with `ngModel`?
`<input [(ngModel)]="name">` requires `FormsModule`. It sets the input's value from `name` and updates `name` on input events. In reactive forms use `formControlName`/`[formControl]` instead.

### Q34. What is `ngOnDestroy` used for?
Cleanup: unsubscribe from long-lived Observables, clear timers, remove event listeners, destroy third-party instances. Modern alternatives: `takeUntilDestroyed()`, `DestroyRef.onDestroy()`, and the `async` pipe.

### Q35. What is a module (`NgModule`)? (legacy)
A class decorated with `@NgModule({ declarations, imports, exports, providers, bootstrap })` that grouped components, directives, pipes and providers. Feature modules supported lazy loading. Today standalone components replace most NgModule usage, but you must still read/maintain NgModule code in older apps.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. How does Dependency Injection resolve a service? (hierarchical injectors) *(Must-know)*
Angular looks for a provider walking **up** the injector tree:
1. **Element injector** (component/directive `providers` / `viewProviders`),
2. parent element injectors up to the root component,
3. **Environment injector** (route-level `providers`, lazy-loaded route injectors),
4. **Root injector** (`providedIn: 'root'` or `bootstrapApplication` providers),
5. **Platform** injector.
If nothing is found → `NullInjectorError` (NG0201). Providing a service in a component's `providers` creates **one instance per component instance**.
```ts
@Component({ selector: 'app-form', providers: [FormStateService], template: '' })   // new instance per component
```

### Q37. Provider types: `useClass`, `useValue`, `useFactory`, `useExisting`
```ts
export const API_URL = new InjectionToken<string>('API_URL');
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: Logger, useClass: ConsoleLogger },
  { provide: Cache, useFactory: () => new Cache(inject(API_URL)) },
  { provide: OldLogger, useExisting: Logger },                    // alias
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },   // multi provider (legacy interceptors)
];
const url = inject(API_URL);
```

### Q38. `providedIn: 'root'` vs providing in a component vs a lazy route
`providedIn: 'root'`: one app-wide singleton, tree-shakable (removed if unused). Provided in a component: one instance per component (and its children). Provided in a lazy route's `providers`: a singleton scoped to that lazy-loaded feature.

### Q39. `inject()` vs constructor injection
`inject()` works in an **injection context** (constructor, field initializers, factory functions, functional guards/interceptors). Benefits: less boilerplate, works in functions (guards, interceptors), easier inheritance and composition. Calling it outside an injection context throws NG0203.

### Q40. Functional route guards *(Must-know)*
```ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
export const unsavedGuard: CanDeactivateFn<EditComponent> = (c) => !c.form.dirty || confirm('Discard changes?');
// routes: { path: 'profile', component: ProfileComponent, canActivate: [authGuard], canDeactivate: [unsavedGuard] }
```
Guard types: `CanActivate`, `CanActivateChild`, `CanDeactivate`, `CanMatch` (decides whether a route can even be matched/loaded), and resolvers (`ResolveFn`) to prefetch data. Guards control navigation UX; **they are not security**: the server must enforce authorization.

### Q41. Lazy loading
```ts
{ path: 'orders', loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent) },
{ path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) },
```
Creates separate chunks loaded on first navigation. Improve UX with preloading: `withPreloading(PreloadAllModules)` or a custom strategy (`QuicklinkStrategy`).

### Q42. Route resolvers
```ts
export const userResolver: ResolveFn<User> = (route) => inject(UserService).get(route.paramMap.get('id')!);
{ path: 'users/:id', component: UserComponent, resolve: { user: userResolver } }
// component: user = input.required<User>();   (with withComponentInputBinding)
```
Resolvers block navigation until data arrives; show a global loading indicator, or load data inside the component with skeletons for better perceived performance.

### Q43. Typed reactive forms and validators
```ts
export const passwordMatch: ValidatorFn = (group) => {
  const p = group.get('password')?.value, c = group.get('confirm')?.value;
  return p === c ? null : { mismatch: true };
};
form = inject(FormBuilder).nonNullable.group(
  { email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]], confirm: [''] },
  { validators: passwordMatch }
);
```
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" />
  @if (form.controls.email.touched && form.controls.email.errors?.['required']) { <small>Email is required</small> }
  <button [disabled]="form.invalid">Save</button>
</form>
```

### Q44. Async validators and `updateOn`
```ts
emailTaken(): AsyncValidatorFn {
  return (control) => timer(300).pipe(                       // debounce
    switchMap(() => this.api.emailExists(control.value)),
    map((exists) => (exists ? { taken: true } : null)),
    catchError(() => of(null))
  );
}
email = new FormControl('', { validators: [Validators.email], asyncValidators: [this.emailTaken()], updateOn: 'blur' });
```
`updateOn: 'blur' | 'submit'` reduces validation noise and API calls.

### Q45. `FormArray` and dynamic forms
```ts
form = this.fb.group({ items: this.fb.array([this.newItem()]) });
get items() { return this.form.controls.items; }
newItem() { return this.fb.group({ name: [''], qty: [1] }); }
add() { this.items.push(this.newItem()); }
remove(i: number) { this.items.removeAt(i); }
```
```html
<div formArrayName="items">
  @for (g of items.controls; track $index; let i = $index) { <div [formGroupName]="i"><input formControlName="name" /></div> }
</div>
```

### Q46. HTTP interceptors (functional)
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((err: HttpErrorResponse) => {
    if (err.status === 401) inject(Router).navigate(['/login']);
    return throwError(() => err);
  }));
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]));
```
Order matters: interceptors run in the order listed for requests and in reverse for responses. Prefer **HttpOnly cookies** over storing tokens in JS-readable storage.

### Q47. RxJS flattening operators: `switchMap`, `mergeMap`, `concatMap`, `exhaustMap` *(Must-know)*
| Operator | Behavior with new emissions | Use for |
|---|---|---|
| `switchMap` | Cancels the previous inner Observable | Search/typeahead, route-param loads |
| `mergeMap` | Runs all in parallel | Independent parallel requests |
| `concatMap` | Queues, one at a time in order | Ordered saves |
| `exhaustMap` | Ignores new while one is running | Login/submit buttons, preventing double clicks |

### Q48. Typeahead search with RxJS
```ts
search = new FormControl('', { nonNullable: true });
results$ = this.search.valueChanges.pipe(
  debounceTime(300),
  map((q) => q.trim()),
  distinctUntilChanged(),
  switchMap((q) => (q.length < 2 ? of([]) : this.api.search(q).pipe(catchError(() => of([]))))),
);
```
```html
@for (r of results$ | async; track r.id) { <li>{{ r.name }}</li> }
```

### Q49. Subjects: `Subject`, `BehaviorSubject`, `ReplaySubject`, `AsyncSubject`
| Type | Behavior |
|---|---|
| `Subject` | Multicast; subscribers get only future values |
| `BehaviorSubject(initial)` | Holds the **current value**; new subscribers get it immediately |
| `ReplaySubject(n)` | Replays the last `n` values to new subscribers |
| `AsyncSubject` | Emits only the **last value** when it completes |
```ts
private user = new BehaviorSubject<User | null>(null);
user$ = this.user.asObservable();          // expose read-only
setUser(u: User | null) { this.user.next(u); }
```
Modern alternative: a `signal` in a service with `asReadonly()`.

### Q50. Preventing memory leaks from subscriptions
```ts
// 1. async pipe (best for templates)
// 2. takeUntilDestroyed (Angular 16+)
private destroyRef = inject(DestroyRef);
ngOnInit() { this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(/* ... */); }
// 3. toSignal() for templates
users = toSignal(this.users$, { initialValue: [] });
// 4. manual unsubscribe in ngOnDestroy (Subscription) or takeUntil(this.destroy$)
```
HTTP calls complete themselves, but long-lived streams (`valueChanges`, `interval`, router events, subjects) must be cleaned up.

### Q51. `toSignal` and `toObservable` (RxJS interop)
```ts
users = toSignal(inject(UserService).getUsers(), { initialValue: [] });    // Observable → Signal (auto-unsubscribes)
query = signal('');
query$ = toObservable(this.query);                                          // Signal → Observable
results = toSignal(this.query$.pipe(debounceTime(300), switchMap((q) => this.api.search(q))), { initialValue: [] });
```
`toSignal` must run in an injection context (or pass `injector`).

### Q52. `computed`, `effect` and `linkedSignal` *(Signals in depth)*
- `computed`: derived, lazy, memoized, read-only; must be pure (no signal writes).
- `effect`: runs side effects when signals it reads change (logging, DOM APIs, localStorage). Avoid using effects to propagate state; prefer `computed`/`linkedSignal`.
- `linkedSignal`: a writable signal whose value **resets** when its source signal changes.
```ts
options = signal(['A', 'B', 'C']);
selected = linkedSignal(() => this.options()[0]);      // resets to first option when options change, but can be set manually
```

### Q53. Signal inputs, outputs and `model`
```ts
@Component({ selector: 'app-toggle', template: `<button (click)="checked.set(!checked())">{{ label() }}: {{ checked() }}</button>` })
export class ToggleComponent {
  label = input('Toggle');                 // optional with default
  id = input.required<string>();           // required
  checked = model(false);                  // two-way: parent uses [(checked)]
  changed = output<boolean>();             // event emitter replacement
  size = computed(() => (this.checked() ? 'on' : 'off'));
}
```
Signal inputs are read-only, work with `computed`/`effect`, and allow transform functions: `input(0, { transform: numberAttribute })`.

### Q54. Content queries and view queries
`@ViewChild`/`@ViewChildren` (view), `@ContentChild`/`@ContentChildren` (projected content). Signal versions: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`.

### Q55. Pure vs impure pipes in performance
Calling methods in templates (`{{ format(x) }}`) runs on every change detection. Use pure pipes, `computed` signals or precomputed fields instead. Impure pipes should be rare.

### Q56. `@defer` blocks (lazy-load parts of a template) *(Angular 17+)*
```html
@defer (on viewport) {
  <app-heavy-chart [data]="data()" />
} @placeholder (minimum 300ms) {
  <div class="skeleton"></div>
} @loading (after 100ms; minimum 500ms) {
  <app-spinner />
} @error {
  <p>Could not load the chart.</p>
}
```
Triggers: `on idle` (default), `on viewport`, `on interaction`, `on hover`, `on immediate`, `on timer(5s)`, `when condition`; `prefetch on ...`. Deferred dependencies are split into separate chunks automatically (standalone components only).

### Q57. Global error handling
```ts
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown) { logToService(error); }
}
providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```
Also handle HTTP errors in interceptors, route errors via `withNavigationErrorHandler`, and show user-friendly messages.

### Q58. Testing basics (component with TestBed)
```ts
describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CounterComponent] }).compileComponents();
    fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();
  });
  it('increments', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('1');
  });
});
```
Test services with `provideHttpClient()` + `provideHttpClientTesting()` and `HttpTestingController`. Karma/Jasmine was the default for years; newer versions move towards Vitest/Jest; use Playwright/Cypress for E2E.

### Q59. `ChangeDetectorRef`: `markForCheck`, `detectChanges`, `detach`
`markForCheck()` marks the component and ancestors for checking in the next cycle (use with OnPush after non-Angular updates). `detectChanges()` runs change detection **immediately** for this view. `detach()/reattach()` remove/add the view to the CD tree (rare, advanced).

### Q60. Router events and navigation state
```ts
this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed()).subscribe((e) => track(e.urlAfterRedirects));
```
Other events: `NavigationStart`, `NavigationCancel`, `NavigationError`, `RoutesRecognized`. Use them for loading bars and analytics.

### Q61. Angular Material basics
Install with `ng add @angular/material`, import component modules/standalone components (`MatButtonModule`, `MatTableModule`), theming with Sass/CSS variables (Material 3), `MatDialog`, `MatSnackBar`, `MatTable` + `MatSort` + `MatPaginator`, and CDK for custom UI.

### Q62. Internationalization (i18n) basics
Built-in: mark text with `i18n` attributes, extract with `ng extract-i18n`, build per-locale bundles (compile-time). Runtime alternatives: `@ngx-translate/core` or Transloco (switch language without rebuild). Use `DatePipe`, `CurrencyPipe`, `DecimalPipe` with locale data.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. How does change detection work internally? (zone.js) *(Must-know)*
**zone.js** patches async APIs (events, timers, promises, XHR). When an async task finishes inside Angular's zone (`NgZone`), Angular is notified (`onMicrotaskEmpty`) and runs `ApplicationRef.tick()`, which traverses the component tree from the root and **checks the bindings** of each view (dirty checking), comparing new and old values and updating the DOM when different. In dev mode a second pass verifies that values did not change during checking (throws NG0100 `ExpressionChangedAfterItHasBeenChecked`). OnPush views are skipped unless marked dirty.

### Q64. Zoneless Angular and signals-based change detection *(modern)*
Without zone.js, Angular schedules change detection when it is **notified**: signal changes read in templates, `markForCheck`, `async` pipe emissions, template event listeners, `ComponentRef.setInput`, and view attach/detach. Benefits: smaller bundles, better performance and debugging, no monkey-patching, simpler async stack traces. Requirements: components should use signals/OnPush-compatible patterns; third-party libraries relying on zone.js may need adjustments. Zoneless was experimental in v18, developer preview in v20 and the default for new apps in recent versions (check your version).
```ts
provideZonelessChangeDetection()       // instead of provideZoneChangeDetection()
```

### Q65. OnPush deep dive: what triggers a check? Common bugs
Triggers: input reference change, event from the component or its template, `async` pipe/signal emission, `markForCheck()`. **Bug:** mutating an object/array input (`this.items.push(x)`) does not change the reference, so the view does not update. Fix: immutable updates (`items = [...items, x]`) or signals.

### Q66. Performance optimization checklist for Angular *(Method)*
1. Measure: Angular DevTools profiler, Chrome Performance, Lighthouse, bundle analyzer (`source-map-explorer`, `esbuild-visualizer`).
2. Use OnPush + signals; avoid function calls in templates.
3. `track` in `@for`; virtual scrolling (`cdk-virtual-scroll-viewport`) for long lists.
4. Lazy load routes; `@defer` for heavy components; preloading strategies.
5. Reduce bundle: tree-shake, avoid large libraries (moment → date-fns), set budgets in `angular.json`.
6. SSR + hydration for faster first paint (and incremental hydration).
7. `NgOptimizedImage` for images (`ngSrc`, `priority`).
8. Run heavy non-UI code outside Angular: `ngZone.runOutsideAngular(...)` (zone apps) or Web Workers.
9. Debounce high-frequency events; use `shareReplay`.

### Q67. RxJS error handling and retry strategies
```ts
this.http.get<User[]>('/api').pipe(
  retry({ count: 3, delay: (err, attempt) => timer(2 ** attempt * 200) }),   // exponential backoff
  catchError((err) => { this.toast.error('Failed to load'); return of([]); })
);
```
`catchError` replaces the stream; place it **inside** `switchMap`/`mergeMap` so one failure does not kill an outer stream (like `valueChanges`). Retry only idempotent requests.

### Q68. Hot vs cold Observables and sharing
**Cold**: each subscriber triggers a new execution (HTTP, `of`). **Hot**: producers exist independently (DOM events, Subjects, WebSockets). Share a cold Observable with `shareReplay({ bufferSize: 1, refCount: true })` (or `share()`), so multiple subscribers reuse one request.

### Q69. `combineLatest`, `forkJoin`, `zip`, `withLatestFrom`, `merge`
| Operator | Emits when | Notes |
|---|---|---|
| `combineLatest` | Any source emits (after all emitted once) | Latest values array |
| `forkJoin` | All sources **complete** | Like `Promise.all`; completes after one value |
| `zip` | Pairs values by index | Waits for matching positions |
| `withLatestFrom` | The primary source emits | Uses the latest of others |
| `merge` | Any source emits | Interleaves values |

### Q70. State management options and when to use them *(Decision)*
| Need | Choice |
|---|---|
| Local/component state | `signal` / `computed` |
| Shared feature state | Service with signals (or `BehaviorSubject`) |
| Complex apps, many teams, devtools, time-travel | **NgRx Store** (+ Effects, Entity) |
| Lighter NgRx | **NgRx SignalStore** |
| Server state / caching | `resource`/`rxResource`, TanStack Query for Angular, or services with caching |
| Router state | URL/query params |
Do not add NgRx by default: it adds boilerplate. Start with signals and services; adopt NgRx when state complexity, debugging, or team size justify it.

### Q71. NgRx core concepts
Actions (events), Reducers (pure state transitions), Selectors (memoized queries), Effects (side effects, async), Store (single source of truth), Entity (collections), DevTools. Flow: component dispatches action → reducer updates state → selectors emit → component renders; effects listen to actions to call APIs and dispatch results.
```ts
export const loadUsers = createAction('[Users] Load');
export const loadUsersSuccess = createAction('[Users] Load Success', props<{ users: User[] }>());
export const usersReducer = createReducer(initial,
  on(loadUsers, (s) => ({ ...s, loading: true })),
  on(loadUsersSuccess, (s, { users }) => ({ ...s, users, loading: false })));
export const selectUsers = createSelector(createFeatureSelector<UsersState>('users'), (s) => s.users);
loadUsers$ = createEffect(() => this.actions$.pipe(ofType(loadUsers),
  exhaustMap(() => this.api.getUsers().pipe(map((users) => loadUsersSuccess({ users })), catchError(() => of(loadUsersFailure()))))));
```

### Q72. Server-Side Rendering (SSR) and hydration
`ng add @angular/ssr` adds a server (Express by default), `provideClientHydration()`, and prerendering. **Hydration** reuses server-rendered DOM instead of re-creating it. Benefits: faster first paint/LCP, SEO, social previews. Pitfalls: `window`/`document`/`localStorage` do not exist on the server (use `isPlatformBrowser`, `afterNextRender`, `DOCUMENT` injection), hydration mismatches (NG05xx), duplicate HTTP calls (use `TransferState`; the HTTP client caches server responses for hydration automatically with `withHttpTransferCacheOptions`). Newer features: **event replay** (`withEventReplay()`) and **incremental hydration** (`@defer (hydrate on viewport)`).

### Q73. Route-level rendering modes (SSR/SSG per route)
Newer Angular lets you choose `RenderMode.Server`, `Prerender` or `Client` per route in `app.routes.server.ts`, so marketing pages can be prerendered while dashboards run client-side.

### Q74. Custom structural/attribute directives and host directives
```ts
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  appClickOutside = output<void>();
  private el = inject(ElementRef<HTMLElement>);
  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) { if (!this.el.nativeElement.contains(target as Node)) this.appClickOutside.emit(); }
}
```
**Host directives** (`hostDirectives: [TooltipDirective]`) compose behavior into components without inheritance.

### Q75. `ControlValueAccessor` (custom form controls)
Makes a custom component work with `formControlName`/`ngModel`.
```ts
@Component({
  selector: 'app-rating', template: `...`,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RatingComponent), multi: true }],
})
export class RatingComponent implements ControlValueAccessor {
  value = signal(0); disabled = signal(false);
  private onChange: (v: number) => void = () => {}; private onTouched = () => {};
  writeValue(v: number) { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.disabled.set(d); }
  set(n: number) { if (this.disabled()) return; this.value.set(n); this.onChange(n); this.onTouched(); }
}
```

### Q76. Dynamic components
```ts
host = viewChild.required('host', { read: ViewContainerRef });
open() {
  const ref = this.host().createComponent(AlertComponent);
  ref.setInput('message', 'Saved!');
  ref.instance.closed.subscribe(() => ref.destroy());
}
```
Use `ngComponentOutlet` for simple dynamic rendering; use CDK Overlay/Dialog for modals.

### Q77. Router configuration advanced
`withComponentInputBinding`, `withRouterConfig({ onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'always' })`, `withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })`, `withViewTransitions()`, custom `RouteReuseStrategy`, `TitleStrategy` for page titles, and route `data` for breadcrumbs.

### Q78. Security in Angular *(Must-know)*
- Angular **sanitizes** template bindings by default (`innerHTML`, URLs, styles). Bypassing with `DomSanitizer.bypassSecurityTrustHtml` is dangerous: only for trusted content.
- Never build templates from user input; avoid `eval`/`new Function`.
- **XSRF/CSRF:** `HttpClient` supports XSRF token headers (`withXsrfConfiguration`) for cookie-based auth.
- Store tokens in **HttpOnly cookies**; avoid `localStorage` for tokens.
- Set a CSP; use `Trusted Types` where possible.
- Route guards are UX, not security: authorize on the server.
- Keep Angular and dependencies updated (`ng update`, `npm audit`).

### Q79. Testing strategy
Pyramid: unit tests for services/pipes/pure functions; component tests with `TestBed` and **component harnesses** (stable test APIs for Material/CDK); integration tests with `HttpTestingController` and router testing (`RouterTestingHarness`); E2E with Playwright/Cypress for critical flows. Use `fakeAsync`/`tick`/`flush` or real async with `await fixture.whenStable()`, marble tests for complex RxJS, and avoid testing implementation details.
```ts
TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
const http = TestBed.inject(HttpTestingController);
service.getUsers().subscribe((u) => expect(u.length).toBe(1));
http.expectOne('/api/users').flush([{ id: 1, name: 'Ritesh' }]);
http.verify();
```

### Q80. Accessibility (a11y) in Angular
Use semantic HTML and Angular CDK a11y utilities (`LiveAnnouncer`, `FocusTrap`, `cdkTrapFocus`, `FocusMonitor`), label inputs (`mat-label`, `aria-label`), manage focus after route changes (focus the main heading), keyboard support in custom components, `@angular-eslint/template` accessibility rules, and test with axe/Lighthouse.

### Q81. Build and bundling
The CLI uses the **esbuild-based application builder** (with Vite dev server) in modern versions, producing faster builds than the old webpack builder. Configure budgets in `angular.json`, analyze bundles, enable `optimization`, source maps for production error reporting only (upload privately), and cache dependencies in CI.

### Q82. Monorepos and Nx
Nx or Angular workspaces with multiple apps/libs: shared UI library, data-access libraries, feature libraries; enforce boundaries with tags and `@nx/enforce-module-boundaries`; use affected builds/tests and remote caching.

### Q83. Micro-frontends in Angular
Options: Native Federation / Module Federation (`@angular-architects/native-federation`), iframes, Web Components (`createCustomElement`), or route-level composition. Concerns: shared dependency versions (Angular singletons), routing ownership, shared state/events, styling collisions, deployment independence.

### Q84. Environment-aware initialization
```ts
provideAppInitializer(() => {
  const config = inject(ConfigService);
  return firstValueFrom(config.load());            // app waits for runtime config before starting
});
```
(`APP_INITIALIZER` is the older token; newer versions prefer `provideAppInitializer`.) Keep initializers fast, because they delay the first render.

### Q85. Upgrading Angular safely
Use `ng update @angular/core @angular/cli` one major version at a time; read the update guide (`update.angular.dev`); run migrations (standalone, control flow, inject, signal inputs: `ng generate @angular/core:standalone`, `:control-flow`, `:inject`, `:signal-input-migration`); upgrade third-party libs; run tests; compare bundle sizes and performance.

### Q86. NgModule → standalone migration
Run `ng generate @angular/core:standalone` in three steps (convert declarations to standalone, remove unnecessary NgModules, bootstrap with `bootstrapApplication`). Keep lazy routes with `loadComponent`/`loadChildren`. Do it feature by feature with tests.

### Q87. Using Web Workers and running code outside Angular
```ts
inject(NgZone).runOutsideAngular(() => { window.addEventListener('scroll', this.onScroll, { passive: true }); });   // avoids triggering CD (zone apps)
const worker = new Worker(new URL('./app.worker', import.meta.url));   // heavy computations
```
`ng generate web-worker` scaffolds it. For zoneless apps, avoid manual zone handling; updates happen only when signals/events notify.

### Q88. Handling large forms and performance
Use `updateOn: 'blur'`, avoid heavy validators on each keystroke, break forms into child components with `ControlContainer`, use OnPush, virtualize long lists of controls, and avoid recreating the whole `FormGroup` frequently. Consider schema-driven forms (Formly) for dynamic scenarios, and Signal Forms (new/experimental in recent versions; verify status).

### Q89. `resource()` / `httpResource()` (new reactive data loading; check status)
A signal-based API to load async data that reacts to signal inputs (similar to TanStack Query):
```ts
userId = input.required<string>();
user = httpResource<User>(() => `/api/users/${this.userId()}`);     // reloads when userId changes
// user.value(), user.isLoading(), user.error(), user.reload()
```
These APIs were experimental in v19/v20; confirm the stability level in your version before using them in production.

### Q90. Angular DevTools and debugging
The Angular DevTools extension shows the component tree, inputs, injector tree, and a profiler (change detection cycles). Use `ng.getComponent($0)` in the console (dev mode), source maps, and RxJS `tap` logging. For hydration issues, read NG05xx error messages.


---

# 🟠 Part 4: Senior (5–7 years)

### Q91. How do you structure a large Angular workspace? *(Architecture)*
Use a layered, domain-based structure (Nx-style):
```
apps/
  web/                    # shell app: routing, providers, app config
libs/
  orders/
    feature-orders/       # smart components, routes (page-level)
    ui-orders/            # presentational components (inputs/outputs only)
    data-access-orders/   # services, state (signals/NgRx), API clients
    util-orders/          # pure functions, validators, types
  shared/
    ui/                   # design system components
    util/
```
Rules: features depend on `ui`, `data-access`, `util`; `ui` depends only on `util`; no cycles; enforce with tags (`@nx/enforce-module-boundaries` or ESLint). **Smart/presentational split:** smart components fetch data and manage state; presentational components are `OnPush`, use signal inputs/outputs, and are easy to test.

### Q92. Advanced DI: resolution modifiers, tokens and injection contexts
```ts
const parent = inject(ParentService, { skipSelf: true, optional: true });   // @SkipSelf + @Optional
const self   = inject(Logger, { self: true });                             // look only at this node's injector
const host   = inject(FormService, { host: true });                        // stop at the host component
```
- `InjectionToken` with a `factory` for tree-shakable configuration.
- `runInInjectionContext(injector, () => inject(X))` to call `inject()` from non-DI code.
- `EnvironmentInjector` for route-level and lazy providers; `createEnvironmentInjector` for dynamic scenarios.
- `multi: true` providers collect several implementations (plugins, validators, interceptors).
- Prefer `providedIn: 'root'` services; use component-level `providers` for state that must be per component instance.

### Q93. Migrating a large app to zoneless *(Scenario)*
1. Move components to **OnPush** and make state changes visible to Angular: use **signals** (or `async` pipe, or `markForCheck`).
2. Remove reliance on zone-triggered checks after `setTimeout`/`Promise` callbacks that mutate plain fields.
3. Replace `NgZone.run`/`runOutsideAngular` usage, check third-party libraries for zone assumptions.
4. Enable `provideZonelessChangeDetection()` in a branch; fix views that no longer update.
5. Remove `zone.js` from polyfills and test setup after everything works; verify SSR/hydration and tests (`fixture.whenStable`, avoid relying on `fixture.autoDetectChanges` behaviors).
6. Measure bundle size and runtime (CD cycles) before/after.

### Q94. How do you design a signal-based store (service) and avoid anti-patterns? *(Architecture)*
A feature store is a service that owns **private writable signals**, exposes **read-only signals and computed values**, and changes state only through **named methods**.
```ts
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);
  private readonly _status = signal<'idle' | 'saving' | 'error'>('idle');

  readonly items = this._items.asReadonly();
  readonly status = this._status.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.price * i.qty, 0));

  add(item: CartItem) {
    this._items.update((list) => {
      const found = list.find((i) => i.id === item.id);
      return found ? list.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) : [...list, { ...item, qty: 1 }];
    });
  }
  remove(id: string) { this._items.update((list) => list.filter((i) => i.id !== id)); }
}
```
**Anti-patterns to avoid:** exposing writable signals publicly; deriving state with `effect` instead of `computed`; mutating arrays/objects in place; storing server data and UI flags in one big object that changes often; keeping per-user state in a root service during SSR without care (the application instance is per request, but module-level variables are shared); and starting subscriptions in the constructor without cleanup.

### Q95. SSR in production: pitfalls *(Must-know)*
- **Module-level mutable state is shared between requests** in the Node process; per-request state belongs in services provided at the application level (each request creates its own application instance) or in `REQUEST` context.
- Browser-only APIs: guard with `isPlatformBrowser`, use `afterNextRender`, or inject `DOCUMENT`.
- **TransferState / HTTP transfer cache** avoids duplicate API calls on hydration.
- Avoid timers/subscriptions that never complete on the server (the app would never become stable → slow responses). Use `ApplicationRef.isStable` awareness.
- Cache SSR output at the CDN where safe (public pages), and set correct cache headers; never cache personalized pages publicly.
- Observe memory growth, response time, error rates; add timeouts for upstream calls.

### Q96. Hydration and event replay
Hydration reuses server DOM using serialized annotations (`ngh`). Mismatches (NG0500 series) happen with manual DOM manipulation, invalid HTML nesting, or different server/client rendering. **Event replay** captures user events before hydration and replays them afterward. **Incremental hydration** (`@defer (hydrate on viewport | interaction | idle)`) delays hydrating parts of the page, reducing JS executed at startup.

### Q97. RxJS patterns for real apps (polling, reconnect, cancellation)
```ts
// Polling with backoff on errors; stops when component is destroyed
poll$ = timer(0, 5000).pipe(
  switchMap(() => this.api.status().pipe(retry({ count: 3, delay: (_, i) => timer(1000 * 2 ** i) }), catchError(() => EMPTY))),
  takeUntilDestroyed(this.destroyRef),
);
// WebSocket with auto-reconnect
const socket$ = webSocket<Message>('wss://example.com/ws');
messages$ = socket$.pipe(retry({ delay: 2000 }), share());
// Accumulate state
total$ = actions$.pipe(scan((sum, n) => sum + n, 0), startWith(0));
```
Know: `shareReplay` refCount behavior, `exhaustMap` for submits, `concatMap` for ordered saves, `expand` for pagination loops, `bufferTime`/`windowTime` for batching, custom operators, and schedulers.

### Q98. Signals vs RxJS: how to choose and combine *(Decision)*
| | Signals | RxJS |
|---|---|---|
| Model | Synchronous reactive **values** | Asynchronous **streams** over time |
| Best for | UI state, derived values, templates | Events, HTTP, WebSockets, debouncing, cancellation, complex async |
| Glitch-free derived state | ✅ | Needs care |
| Operators | Few | Rich |
| Interop | `toSignal`, `toObservable` | |
Guideline: keep **state in signals**, keep **async flows in RxJS** (HTTP/events/debounce), and convert at the boundary (`toSignal` for templates). Avoid mixing `BehaviorSubject` + manual subscriptions for new code.

### Q99. Authentication architecture with refresh tokens *(Scenario)*
Preferred: **BFF or HttpOnly, Secure, SameSite cookies** set by the server (no token in JS), CSRF protection, short-lived access tokens, rotating refresh tokens, and server-side authorization. If tokens must be in memory (SPA with an API), use an interceptor that refreshes **once** and queues concurrent requests:
```ts
let refreshing = false;
const refreshed$ = new BehaviorSubject<string | null>(null);
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const withToken = (r: HttpRequest<unknown>, t: string | null) => (t ? r.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : r);
  return next(withToken(req, auth.token())).pipe(catchError((err: HttpErrorResponse) => {
    if (err.status !== 401 || req.url.includes('/auth/refresh')) return throwError(() => err);
    if (!refreshing) {
      refreshing = true; refreshed$.next(null);
      return auth.refresh().pipe(
        switchMap(({ accessToken }) => { refreshing = false; refreshed$.next(accessToken); return next(withToken(req, accessToken)); }),
        catchError((e) => { refreshing = false; auth.logout(); return throwError(() => e); }));
    }
    return refreshed$.pipe(filter((t): t is string => t !== null), take(1), switchMap((t) => next(withToken(req, t))));
  }));
};
```
Note: module-level state in an interceptor is acceptable in the browser, but not in SSR (shared across requests); keep auth server-side for SSR.

### Q100. Authoring a component library
`ng generate library ui` (ng-packagr builds Angular Package Format). Use secondary entry points (`@org/ui/button`) for tree-shaking, expose a stable public API (`public-api.ts`), `peerDependencies` for `@angular/core`, avoid global styles (use CSS variables), document with Storybook, add harness classes for testing, version with semver, and test with a consumer app. Make components standalone, OnPush and signal-based.

### Q101. Design system architecture
Design tokens (CSS custom properties), headless behavior via CDK, themed components (Material 3 theming or custom), accessibility baked in, density/typography options, Storybook docs, visual regression tests (Chromatic/Playwright), and a release process with changelogs and migration schematics for breaking changes.

### Q102. Observability for Angular apps
Global `ErrorHandler` reporting to Sentry/Datadog with release and user context, HTTP interceptor logging (correlation IDs), performance marks/`PerformanceObserver` + Web Vitals, router event tracing, Angular DevTools in dev, and OpenTelemetry in SSR. Include source maps (private) for readable stack traces.

### Q103. Performance profiling workflow
1. Reproduce with production build.
2. Angular DevTools profiler: find components with many CD cycles or slow checks.
3. Chrome Performance: long tasks, scripting vs rendering time.
4. Fix: OnPush/signals, remove template function calls, `track`, `@defer`, virtual scroll, split bundles, debounce, move work to workers.
5. Add budgets and Lighthouse CI to prevent regressions.

### Q104. Real-time and offline
WebSockets via RxJS `webSocket`, SSE via `EventSource` wrapped in Observables, polling with backoff. Offline/PWA with `@angular/service-worker` (`ngsw-config.json`, `SwUpdate` for new version prompts), IndexedDB (via libraries) for offline queues, and conflict resolution strategies.

### Q105. Large-scale forms and dynamic schemas
Schema-driven rendering (Formly or custom renderer), reusable control components via `ControlValueAccessor`, validation rules shared with the backend (JSON Schema / Zod-like), form state in typed reactive forms, `FormArray` virtualization for huge lists, and accessibility (error summaries, `aria-describedby`).

### Q106. Migration from AngularJS (1.x) to Angular
Strangler pattern with `ngUpgrade` (hybrid app): bootstrap both frameworks, migrate leaf components/services first, downgrade/upgrade components and services across frameworks, move routing last, remove AngularJS when done. Alternatively rewrite per-route behind a reverse proxy.

### Q107. i18n at scale
Compile-time i18n for performance (separate bundles per locale) vs runtime i18n (Transloco/ngx-translate) for dynamic switching; extract messages in CI, use ICU plurals/selects, lazy-load translation files per feature, RTL support via CDK `Directionality`, and test long-string layouts.

### Q108. Handling environment/runtime configuration
Build once, deploy many: load `config.json` at startup (`provideAppInitializer`) or inject at server-render time; avoid `environment.ts` for values that differ per deployment; validate config on load; keep secrets on the server.

### Q109. Testing architecture at scale
Component harnesses for stable UI tests; `HttpTestingController` for API contracts; `provideRouter`-based router tests; Storybook interaction tests; Playwright for E2E; contract tests with the backend (OpenAPI/Pact); snapshot tests sparingly; run unit tests in parallel in CI with caching (Nx affected); track flakiness.

### Q110. Security hardening checklist
CSP + Trusted Types, avoid `bypassSecurityTrust*`, sanitize any HTML (DOMPurify when needed), HttpOnly cookies + XSRF protection, strict CORS on the API, dependency audits, no secrets in the bundle, enforce authorization server-side (guards are UX), rate limiting and validation on the API, secure headers on the host (HSTS, X-Content-Type-Options, frame-ancestors).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q111. Angular vs React vs Vue: how do you decide for an organization? *(Decision)*
| | Angular | React (Next.js) | Vue (Nuxt) |
|---|---|---|---|
| Nature | Full framework, opinionated | Library + ecosystem | Progressive framework |
| Consistency across teams | Very high (CLI, DI, conventions) | Depends on chosen stack | Medium |
| Learning curve | Steeper | Medium | Gentle |
| TypeScript | First-class (mandatory) | Optional but common | Good |
| Enterprise tooling | Built-in (forms, routing, DI, testing) | Choose libraries | Choose some |
| Hiring pool | Large in enterprise | Largest | Smaller |
| Long-term upgrade path | Scheduled releases + `ng update` migrations | Varies by library | Moderate |
Angular is strong for **large teams and long-lived enterprise apps** that value consistency. Decide using team skills, product type, hiring market, tooling needs and upgrade tolerance; run a spike for evidence.

### Q112. Governance and architectural standards
Define: workspace layering rules, naming conventions, state management guidelines (signals vs NgRx), HTTP and error-handling patterns, accessibility and i18n requirements, performance budgets, testing requirements, code review checklist, and ADRs. Enforce with Nx boundaries, ESLint (`@angular-eslint`), CI checks and templates/schematics.

### Q113. Upgrade policy
Angular ships a major release every ~6 months, with roughly 6 months of active support and 12 months of LTS. Plan to upgrade **at least once or twice a year**, one major at a time using `ng update`, with an owner, a calendar, canary builds in CI, and automated codemods. Falling behind multiplies cost. Budget time for third-party library upgrades (Material, NgRx, i18n, testing).

### Q114. Adoption roadmap for modern Angular
Phase 1: standalone + `inject()` + control flow (schematics). Phase 2: signal inputs/outputs/queries and OnPush everywhere. Phase 3: signals for state; decide NgRx scope. Phase 4: zoneless + SSR/hydration where it improves metrics. Measure each phase (bundle size, CD cost, Web Vitals, developer feedback) and keep old patterns supported during the transition.

### Q115. Platform team and shared libraries
A platform team owns the design system, shared data-access patterns, tooling, schematics and the upgrade process. Product teams own features. Provide golden-path templates (project generator with auth, logging, error handling, CI), documentation, and support channels. Measure adoption and developer satisfaction.

### Q116. Micro-frontends strategy
Use only when organizational scale demands independent deployment. Prefer **native federation/module federation** with shared Angular singletons and a strict version policy, shared design system, an event/contract layer, per-app routing ownership, and an observability story across apps. Otherwise a modular monolith in an Nx workspace is simpler and often better.

### Q117. Risk management
Risks: version drift, RxJS misuse leading to leaks, large bundles, slow CI, inconsistent patterns, dependency on a single library (Material/NgRx). Mitigations: automated upgrades, lint rules and review checklists, budgets, caching in CI, internal abstractions around critical third-party APIs, regular architecture reviews.

### Q118. Hiring and mentoring
Interview for: change detection mental model, DI, RxJS operators, signals vs RxJS, forms, routing guards, testing approach, performance debugging, and communication. Mentor with code reviews on subscriptions/state, pair programming on tricky RxJS, and internal workshops on signals/zoneless.

### Q119. Metrics and quality gates
Track Core Web Vitals (field), bundle size by route, build/test time, flaky test rate, accessibility violations, error rates by release, and developer productivity measures (lead time). Fail PRs on budget and lint violations.

### Q120. Cost of change and technical debt
Maintain a debt register (deprecated APIs, NgModule leftovers, `any` types, manual subscriptions), allocate regular capacity, prioritize by risk and effort, and use schematics/codemods to remove debt at scale.

### Q121. Documentation and ADRs
Record decisions: state management, rendering mode (CSR/SSR/prerender), auth approach, testing strategy, micro-frontend or monolith, library choices. Keep living docs with examples of idiomatic Angular for your team.

### Q122. Exit strategy and portability
Keep business logic in plain TypeScript libraries (framework-agnostic), isolate framework glue in thin layers, use standards (Web Components for shared widgets, OpenAPI contracts), and avoid deep coupling to proprietary services. This reduces migration risk.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice each task from memory. Mention change detection, cleanup (unsubscribe), and accessibility.

### C1. Counter with signals and OnPush
```ts
@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p aria-live="polite">Count: {{ count() }} (double: {{ double() }})</p>
    <button (click)="dec()">-</button> <button (click)="inc()">+</button> <button (click)="reset()">Reset</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);
  inc() { this.count.update((c) => c + 1); }
  dec() { this.count.update((c) => c - 1); }
  reset() { this.count.set(0); }
}
```

### C2. Todo app with signals (add, toggle, delete, filter)
```ts
type Filter = 'all' | 'active' | 'done';
interface Todo { id: string; text: string; done: boolean }

@Component({
  selector: 'app-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <form (submit)="add($event)"><input name="text" [(ngModel)]="text" placeholder="New task" /><button>Add</button></form>
    <select [ngModel]="filter()" (ngModelChange)="filter.set($event)">
      <option value="all">All</option><option value="active">Active</option><option value="done">Done</option>
    </select>
    <p>{{ remaining() }} remaining</p>
    <ul>
      @for (t of visible(); track t.id) {
        <li>
          <label><input type="checkbox" [checked]="t.done" (change)="toggle(t.id)" /> {{ t.text }}</label>
          <button (click)="remove(t.id)" [attr.aria-label]="'Delete ' + t.text">✕</button>
        </li>
      } @empty { <li>No tasks</li> }
    </ul>
  `,
})
export class TodosComponent {
  text = '';
  todos = signal<Todo[]>([]);
  filter = signal<Filter>('all');
  visible = computed(() => this.todos().filter((t) => this.filter() === 'all' || (this.filter() === 'done' ? t.done : !t.done)));
  remaining = computed(() => this.todos().filter((t) => !t.done).length);
  add(e: Event) {
    e.preventDefault();
    const text = this.text.trim(); if (!text) return;
    this.todos.update((l) => [...l, { id: crypto.randomUUID(), text, done: false }]);
    this.text = '';
  }
  toggle(id: string) { this.todos.update((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
  remove(id: string) { this.todos.update((l) => l.filter((t) => t.id !== id)); }
}
```

### C3. Registration form with validators (cross-field + async)
```ts
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <label>Email <input formControlName="email" type="email" /></label>
      @if (email.touched && email.errors; as e) {
        @if (e['required']) { <small>Email is required</small> }
        @if (e['email']) { <small>Enter a valid email</small> }
        @if (e['taken']) { <small>Email already registered</small> }
      }
      @if (email.pending) { <small>Checking...</small> }
      <label>Password <input formControlName="password" type="password" /></label>
      <label>Confirm <input formControlName="confirm" type="password" /></label>
      @if (form.errors?.['mismatch'] && form.controls.confirm.touched) { <small>Passwords do not match</small> }
      <button [disabled]="form.invalid || form.pending">Create account</button>
    </form>
  `,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private api = inject(UserApi);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email], [this.emailTaken()]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  }, { validators: [passwordMatch] });
  get email() { return this.form.controls.email; }
  emailTaken(): AsyncValidatorFn {
    return (c) => timer(300).pipe(switchMap(() => this.api.exists(c.value)), map((x) => (x ? { taken: true } : null)), catchError(() => of(null)));
  }
  submit() { if (this.form.valid) this.api.register(this.form.getRawValue()).subscribe(); }
}
export const passwordMatch: ValidatorFn = (g) => (g.get('password')?.value === g.get('confirm')?.value ? null : { mismatch: true });
```
(`emailTaken` is called in a field initializer after `api` exists; keep `inject` fields declared before `form`.)

### C4. Custom pipe and directive
```ts
@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const s = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
    return `${Math.floor(s / 86400)} d ago`;
  }
}
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
  @HostBinding('style.backgroundColor') bg = '';
  @HostListener('mouseenter') on() { this.bg = this.color(); }
  @HostListener('mouseleave') off() { this.bg = ''; }
}
// <p [appHighlight]="'lightblue'">{{ createdAt | timeAgo }}</p>
```

### C5. Click-outside directive with `output()`
```ts
@Directive({ selector: '[appClickOutside]' })
export class ClickOutsideDirective {
  appClickOutside = output<void>();
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) { if (!this.el.nativeElement.contains(target as Node)) this.appClickOutside.emit(); }
}
// <div (appClickOutside)="open.set(false)">...</div>
```

### C6. Data service with signals and HTTP
```ts
@Injectable({ providedIn: 'root' })
export class ProductStore {
  private http = inject(HttpClient);
  private _items = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly total = computed(() => this._items().reduce((s, p) => s + p.price, 0));

  load() {
    this._loading.set(true); this._error.set(null);
    this.http.get<Product[]>('/api/products').subscribe({
      next: (items) => { this._items.set(items); this._loading.set(false); },
      error: () => { this._error.set('Could not load products'); this._loading.set(false); },
    });
  }
}
```
Expose read-only signals; mutate state only through store methods.

### C7. Typeahead search with RxJS and `async` pipe
```ts
@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <input [formControl]="q" placeholder="Search users" aria-label="Search users" />
    <ul>@for (u of results$ | async; track u.id) { <li>{{ u.name }}</li> }</ul>
  `,
})
export class SearchComponent {
  private api = inject(UserApi);
  q = new FormControl('', { nonNullable: true });
  results$ = this.q.valueChanges.pipe(
    debounceTime(300), map((v) => v.trim()), distinctUntilChanged(),
    switchMap((v) => (v.length < 2 ? of([]) : this.api.search(v).pipe(catchError(() => of([]))))),
  );
}
```

### C8. Auth guard, role guard and resolver
```ts
export const authGuard: CanActivateFn = (_r, state) => {
  const auth = inject(AuthService), router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
export const roleGuard = (role: string): CanActivateFn => () => inject(AuthService).hasRole(role) || inject(Router).createUrlTree(['/forbidden']);
export const orderResolver: ResolveFn<Order> = (route) => inject(OrderApi).get(route.paramMap.get('id')!);
// { path: 'orders/:id', component: OrderComponent, canActivate: [authGuard, roleGuard('manager')], resolve: { order: orderResolver } }
```

### C9. HTTP interceptors: token, errors and loading
```ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((e: HttpErrorResponse) => {
    const toast = inject(ToastService);
    if (e.status === 0) toast.error('Network error');
    else if (e.status >= 500) toast.error('Server error, try again');
    return throwError(() => e);
  }));
// provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor]))
```

### C10. Lazy routes and `app.config.ts`
```ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, title: 'Home' },
  { path: 'dashboard', canActivate: [authGuard], loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },
  { path: '**', loadComponent: () => import('./not-found.component').then((m) => m.NotFoundComponent) },
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),   // or provideZonelessChangeDetection()
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideClientHydration(withEventReplay()),
  ],
};
```

### C11. Presentational card with content projection and OnPush
```ts
@Component({
  selector: 'app-user-card', changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <header><ng-content select="[card-title]" /></header>
      <p>{{ user().name }} · {{ user().email }}</p>
      <footer><ng-content /></footer>
      <button (click)="selected.emit(user())">Select</button>
    </article>
  `,
})
export class UserCardComponent {
  user = input.required<User>();
  selected = output<User>();
}
// <app-user-card [user]="u" (selected)="pick($event)"><h3 card-title>{{ u.name }}</h3><small>Joined 2024</small></app-user-card>
```

### C12. `ControlValueAccessor` rating control
Use the implementation in Part 3, Q75. Usage: `<app-rating formControlName="rating" />`. Make sure to handle `setDisabledState` and call `onTouched` on blur.

### C13. Dialog service with CDK Overlay (or Material Dialog)
```ts
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private dialog = inject(MatDialog);
  confirm(message: string) {
    return this.dialog.open(ConfirmDialogComponent, { data: { message }, ariaLabel: 'Confirmation' }).afterClosed().pipe(map(Boolean));
  }
}
// delete(id) { this.confirm('Delete this item?').pipe(filter(Boolean), switchMap(() => this.api.delete(id))).subscribe(); }
```

### C14. Infinite scroll with CDK virtual scroll
```ts
@Component({
  selector: 'app-list', imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="48" style="height: 400px" (scrolledIndexChange)="onScroll($event)">
      <div *cdkVirtualFor="let item of items(); trackBy: trackId" class="row">{{ item.name }}</div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class ListComponent {
  items = signal<Item[]>([]);
  trackId = (_: number, i: Item) => i.id;
  onScroll(index: number) { if (index > this.items().length - 20) this.loadMore(); }
  loadMore() { /* fetch next page and append immutably */ }
}
```

### C15. `@defer` with prefetch and skeletons
```html
@defer (on viewport; prefetch on idle) {
  <app-sales-chart [data]="data()" />
} @placeholder { <div class="skeleton" style="height: 240px"></div> }
  @loading (after 150ms; minimum 400ms) { <app-spinner /> }
  @error { <p role="alert">Chart failed to load.</p> }
```

### C16. NgRx feature (actions, reducer, selectors, effects)
Use the pieces from Q71 and register with `provideStore`, `provideState('users', usersReducer)` and `provideEffects(UsersEffects)` in route providers so they load lazily with the feature.
```ts
@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions); private api = inject(UserApi);
  load$ = createEffect(() => this.actions$.pipe(ofType(loadUsers),
    exhaustMap(() => this.api.getAll().pipe(map((users) => loadUsersSuccess({ users })), catchError((e) => of(loadUsersFailure({ error: e.message })))))));
}
```

### C17. NgRx SignalStore
```ts
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] as CartItem[] }),
  withComputed(({ items }) => ({ total: computed(() => items().reduce((s, i) => s + i.price * i.qty, 0)) })),
  withMethods((store) => ({
    add(item: CartItem) { patchState(store, (s) => ({ items: [...s.items, item] })); },
    clear() { patchState(store, { items: [] }); },
  })),
);
// const cart = inject(CartStore); cart.total(); cart.add(item);
```

### C18. Testing a component with a mocked service
```ts
describe('UsersComponent', () => {
  it('shows users', async () => {
    const api = { getAll: () => of([{ id: 1, name: 'Ritesh' }]) };
    await TestBed.configureTestingModule({ imports: [UsersComponent], providers: [{ provide: UserApi, useValue: api }] }).compileComponents();
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ritesh');
  });
});
```

### C19. Testing HTTP with `HttpTestingController`
Use the pattern from Q79: `provideHttpClient()`, `provideHttpClientTesting()`, `expectOne(url)`, `flush`, `verify()`; test error cases with `flush('x', { status: 500, statusText: 'Server Error' })`.

### C20. Testing async code with `fakeAsync`
```ts
it('debounces search', fakeAsync(() => {
  const fixture = TestBed.createComponent(SearchComponent);
  const spy = spyOn(TestBed.inject(UserApi), 'search').and.returnValue(of([]));
  fixture.componentInstance.q.setValue('ang');
  tick(299); expect(spy).not.toHaveBeenCalled();
  tick(1);   expect(spy).toHaveBeenCalledWith('ang');
}));
```

### C21. Component harness test (Material)
```ts
const loader = TestbedHarnessEnvironment.loader(fixture);
const button = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));
await button.click();
expect(await button.isDisabled()).toBeFalse();
```

### C22. Global error handler and logging service
```ts
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  handleError(error: unknown) { this.logger.error('Unhandled error', error); }
}
// providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }]
```

### C23. Runtime config with `provideAppInitializer`
```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      const config = inject(ConfigService);
      return firstValueFrom(config.load());           // fetches /config.json
    }),
  ],
};
```

### C24. Dynamic component loading
Use the pattern in Q76 with `createComponent`, `setInput` and `destroy`. For a registry of widgets: map `type → () => import('./widget')`, then `host.createComponent((await loader()).Widget)`.

### C25. SSR-safe browser access
```ts
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  constructor() {
    afterNextRender(() => {                                // runs only in the browser
      const saved = localStorage.getItem('theme');
      if (saved) this.doc.documentElement.dataset['theme'] = saved;
    });
  }
  isBrowser = isPlatformBrowser(this.platformId);
}
```

### C26. Reusable stateful pagination with signals
```ts
export function createPagination(total: () => number, pageSize = 10) {
  const page = signal(1);
  const pages = computed(() => Math.max(1, Math.ceil(total() / pageSize)));
  return { page, pages, next: () => page.update((p) => Math.min(p + 1, pages())), prev: () => page.update((p) => Math.max(p - 1, 1)) };
}
```

### C27. Dockerfile for a static SPA (Nginx)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production
FROM nginx:alpine
COPY --from=build /app/dist/my-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ /index.html; }            # SPA fallback for deep links
  location ~* \.(js|css|woff2|png|jpg|svg)$ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location = /index.html { add_header Cache-Control "no-cache"; }
}
```

### C28. Custom RxJS operator
```ts
export const retryWithBackoff = <T>(count = 3, base = 500): MonoTypeOperatorFunction<T> =>
  retry({ count, delay: (_err, attempt) => timer(base * 2 ** (attempt - 1)) });
// this.http.get('/api').pipe(retryWithBackoff(3, 300))
```

### C29. Signal-based debounce/derived search without RxJS
```ts
query = signal('');
debounced = toSignal(toObservable(this.query).pipe(debounceTime(300), distinctUntilChanged()), { initialValue: '' });
results = toSignal(toObservable(this.debounced).pipe(switchMap((q) => (q ? this.api.search(q) : of([])))), { initialValue: [] });
```

### C30. Router test with `RouterTestingHarness`
```ts
it('redirects to login when not authenticated', async () => {
  TestBed.configureTestingModule({ providers: [provideRouter(routes), { provide: AuthService, useValue: { isLoggedIn: () => false } }] });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl('/dashboard');
  expect(TestBed.inject(Router).url).toContain('/login');
});
```

---

# 🐞 Part 7: Debugging Scenarios (Error Codes)

### D1. NG0100: `ExpressionChangedAfterItHasBeenChecked`
A value used in the template changed during the same change detection pass (dev-mode second check detects it). Typical causes: updating parent state from a child lifecycle hook (`ngAfterViewInit`), getters returning new objects each time (`get items() { return [...] }`), `Math.random()`/`Date.now()` in bindings. Fix: update state in a microtask/`setTimeout`/signal, compute once, make getters stable, or use `ChangeDetectorRef.detectChanges()` carefully after the change.

### D2. NG0201: `No provider for X` (`NullInjectorError`)
The service is not provided in the injector chain. Fix: `@Injectable({ providedIn: 'root' })`, add to `providers`, import the module/provider function (e.g., `provideHttpClient()`), or check the route's lazy injector.

### D3. NG0203: `inject() must be called from an injection context`
You called `inject()` in a callback or after `await`. Call it in a constructor, field initializer, or `runInInjectionContext`. Capture the dependency into a field first.

### D4. NG0303/NG0304: unknown property or element
"Can't bind to 'x' since it isn't a known property of 'y'" or "'app-foo' is not a known element". In standalone components you forgot to add the component/directive/module to `imports: []` (or forgot `FormsModule`/`ReactiveFormsModule`/`CommonModule` pieces). In NgModule apps, add it to `declarations`/`imports`.

### D5. NG0200: circular dependency in DI
Service A injects B and B injects A. Break the cycle: extract shared logic into a third service, inject lazily with `Injector.get`, or use events.

### D6. NG0600: writing to signals is not allowed here
You called `set/update` on a signal inside a `computed` (or template pipe). `computed` must be pure. Move the write to an event handler or `effect`; use `linkedSignal` for resettable state.

### D7. OnPush component does not update
Common cause: mutating an input object or array. Fix: create a new reference (`list = [...list, x]`), use signals, call `markForCheck()` after non-Angular updates (e.g., third-party callback), or use `async` pipe.

### D8. List flickers or loses input focus on updates
`@for` without a stable `track` expression (tracking by object identity of newly created objects) re-creates DOM. Use `track item.id`.

### D9. HTTP request is sent multiple times
Multiple subscriptions to the same cold Observable (several `async` pipes, `subscribe` + `async`). Fix: assign to a signal via `toSignal`, use `shareReplay({ bufferSize: 1, refCount: true })`, or use `as` in the template: `@if (data$ | async; as data)`.

### D10. Request never fires
Cold Observable not subscribed (no `subscribe`, no `async` pipe). Or `provideHttpClient()` missing. Or the interceptor did not call `next(req)`.

### D11. Memory leak: handlers keep running after leaving the page
Long-lived Observables (`valueChanges`, `interval`, `router.events`, subjects) not unsubscribed. Use `takeUntilDestroyed`, `async` pipe, `toSignal`, or manual unsubscribe; remove event listeners and timers in `ngOnDestroy`.

### D12. `ViewChild` is undefined
Accessed before the view initialized (in `constructor`/`ngOnInit`) or the element is inside `@if`/`*ngIf` that is currently false. Use `ngAfterViewInit` (or the signal `viewChild()` read lazily), set `{ static: true }` only for elements that are always present.

### D13. `ngOnChanges` does not fire
Input object was mutated (same reference) or a primitive input did not change. Pass a new reference, or use signal inputs with `computed`/`effect`.

### D14. Deep link returns 404 in production
The web server does not fall back to `index.html` for client routes. Configure rewrites (`try_files`, S3/CloudFront error responses, Firebase `rewrites`).

### D15. Router guard blocks navigation forever
A guard Observable never completes or never emits. Use `take(1)`/`first()`; ensure async guards return a value; check redirects creating loops (`UrlTree` pointing back to a guarded route).

### D16. `Cannot read properties of undefined (reading 'x')` in the template
Data is not loaded yet. Use `@if (data(); as d)`, optional chaining (`user?.name`), or provide defaults (`initialValue: []`).

### D17. Form control not found: `formControlName` errors
`ReactiveFormsModule` not imported, wrong control name, or missing `[formGroup]` parent. For `ngModel` inside a form, add a `name` attribute.

### D18. Validator or error message does not show
Check `touched`/`dirty` conditions, `updateOn` setting, async validator `pending` state, and that cross-field errors are on the **group**, not the control.

### D19. Zone-related problems (third-party library)
Callbacks run outside Angular's zone, so the UI does not update. In zone apps wrap with `ngZone.run(() => ...)` or call `markForCheck()`; in zoneless apps update via signals. Also use `runOutsideAngular` for high-frequency events to avoid triggering CD.

### D20. SSR error: `window is not defined` / `document is not defined`
Browser APIs used on the server. Use `isPlatformBrowser`, `afterNextRender`, inject `DOCUMENT`, or lazy-load browser-only code. Avoid direct access in constructors/field initializers.

### D21. Hydration mismatch (NG0500 series)
Server and client DOM differ: manual DOM manipulation (`innerHTML`, jQuery), invalid HTML nesting, `Date.now()`/random values in templates, conditional rendering based on browser-only state. Fix by rendering deterministic content first and updating in `afterNextRender`; use `ngSkipHydration` only as a last resort for specific components.

### D22. Duplicate API calls on SSR + hydration
Enable HTTP transfer cache (`withHttpTransferCacheOptions`) or use `TransferState` so the client reuses server responses.

### D23. Build fails: budget exceeded
Initial bundle larger than `angular.json` budgets. Analyze the bundle, lazy-load routes, `@defer` heavy components, remove unused libraries, avoid importing entire libraries, and only then adjust budgets.

### D24. Strict template type errors after enabling `strictTemplates`
Fix types: `null` handling, `$event` types, input types; use non-null assertion only when proven; add type guards or `@if` narrowing.

### D25. `ng update` fails due to peer dependency conflicts
Update one major at a time, upgrade third-party libraries compatible with the target version, use `--force` only as a last resort, and run migrations (`ng update` prints them).

### D26. Slow dev server or build
Use the esbuild application builder, enable caching, exclude unnecessary files from `tsconfig`, avoid huge barrel files, and reduce style/Sass imports duplication. In CI cache `node_modules` and the Angular cache.

### D27. CORS errors when calling an API from the Angular dev server
CORS is a **server** setting. Use a dev proxy (`proxy.conf.json` with `ng serve --proxy-config`) for local development, and configure the API with correct headers for real environments.

### D28. Memory/CPU spike from `ngDoCheck` or template functions
Heavy logic in `ngDoCheck`, getters or functions called in templates runs every cycle. Move to `computed`, pure pipes, or precompute on change.

### D29. Animations do not run
`provideAnimations()`/`provideAnimationsAsync()` missing (for Angular animations), or state/trigger names mismatch; or use CSS transitions with `animate.enter/leave` (newer API) / classes. Check `prefers-reduced-motion`.

### D30. Debugging method (say this in interviews)
Read the **error code** (NG0xxx) and the message → check **where** it happens (template, DI, routing, SSR, build) → use Angular DevTools (component tree, injector, profiler) → reproduce with a production build for performance and hydration issues → fix the root cause and add a test or lint rule.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Why is `ngOnInit` preferred over the constructor for initialization?
Inputs are not set in the constructor yet. Angular calls `ngOnChanges` (if inputs exist) and then `ngOnInit` once inputs are available. Use the constructor only for DI and field initialization, and put data loading/initialization logic in `ngOnInit` (or react to signal inputs with `computed`/`effect`).

### T2. Does `ngOnChanges` run when an object input is mutated?
No. It runs only when the **reference** (or primitive value) changes. `this.user.name = 'x'` mutates the same object, so `ngOnChanges` does not fire and OnPush views are not updated. Use immutable updates or signals.

### T3. Why does the `async` pipe cause two HTTP calls?
Each `| async` creates a **separate subscription**. A cold HTTP Observable runs once per subscription. Use `@if (data$ | async; as data)`, `shareReplay`, or `toSignal`.

### T4. `HttpClient` observables are cold: what does that imply?
No request is sent until you subscribe. Subscribing twice sends two requests. Not subscribing sends none. HTTP Observables complete after one response, so manual unsubscribe is usually unnecessary (but cancelling on destroy aborts the request).

### T5. `Subject` vs `BehaviorSubject` for shared state
`Subject` does not replay the current value: late subscribers miss earlier emissions. `BehaviorSubject` requires an initial value and replays the latest to new subscribers, which fits "current state". `ReplaySubject(1)` replays the last emitted value without needing an initial one.

### T6. `forkJoin` hangs: why?
`forkJoin` emits only when **all sources complete**. A source that never completes (a `Subject`, `valueChanges`, `interval`) blocks it forever. Use `combineLatest` or add `take(1)`/`first()`.

### T7. `take(1)` vs `first()`
`first()` errors with `EmptyError` if the source completes without emitting; `take(1)` completes silently. `first(predicate)` also supports a condition.

### T8. `switchMap` vs `mergeMap` for saves
`switchMap` cancels the previous inner request, which is wrong for writes (a canceled save may already have been processed). Use `concatMap` (ordered) or `exhaustMap` (ignore while pending) for mutations, `switchMap` for reads like search.

### T9. Pure pipe with a mutated array
A pure pipe re-runs only when its input reference changes. `items.push(x)` does not trigger `| filter` pipes. Create a new array or use a `computed` signal.

### T10. Why is `*ngFor` with `trackBy` important?
Without `trackBy`/`track`, Angular tracks by object identity: if you replace the list with new objects (from an API refresh), it destroys and re-creates all DOM nodes (losing focus, animations and input state).

### T11. `providedIn: 'root'` in lazy-loaded NgModules
Services with `providedIn: 'root'` are app-wide singletons, even if first used in a lazy module. Services listed in a **lazy NgModule's `providers`** get their **own instance** in that module's injector (a classic source of "two instances" bugs).

### T12. `ExpressionChangedAfterItHasBeenChecked` appears only in development
In production mode there is no second verification pass, so the error disappears but the underlying inconsistency remains. Fix the cause; do not ignore it.

### T13. `markForCheck()` vs `detectChanges()`
`markForCheck()` schedules the component (and ancestors) for checking in the next cycle (OnPush marking). `detectChanges()` runs checking **now** for this view and its children. Overusing `detectChanges()` can cause performance and re-entrancy issues.

### T14. Signal equality
Signals use `Object.is` by default: `set` with the same primitive or the same object reference does not notify. For objects, create a new reference or provide a custom `equal` function.

### T15. `computed` is lazy and memoized
It recalculates only when read and only if a dependency changed. It must be pure; writing signals inside it throws (NG0600).

### T16. `effect` timing and misuse
Effects run during change detection (asynchronously relative to the write), not immediately. They are for side effects (DOM, logging, storage), not for deriving state: use `computed` or `linkedSignal` instead. Be careful with writes inside effects (they can cause loops).

### T17. `input()` signals are read-only
You cannot call `.set()` on an input signal. Use `model()` for two-way binding or a `linkedSignal` for local mutable state derived from an input.

### T18. `toSignal` and the injection context
`toSignal` must be called in an injection context (constructor/field initializer) or with `{ injector }`. It subscribes immediately and unsubscribes when the context is destroyed. Without `initialValue` the type includes `undefined`; with `requireSync: true` the source must emit synchronously.

### T19. `@for` requires `track`
Unlike `*ngFor`, `@for` makes tracking mandatory (compile error without `track`). `track $index` is acceptable only for lists that never reorder.

### T20. `@defer` and non-standalone components
Deferrable views only split dependencies that are **standalone** components/directives/pipes and are not referenced elsewhere eagerly (e.g., via `@ViewChild`). Eagerly imported usage prevents lazy-loading the chunk.

### T21. Route guards are not security
Client-side guards can be bypassed (the code is in the browser). They improve UX only. Every API must verify authentication and authorization on the server.

### T22. Resolvers block navigation
Navigation waits for resolvers; slow data means a frozen UI. Show a loading indicator (router events), or fetch inside the component with skeleton states for better perceived performance.

### T23. `ActivatedRoute.snapshot` vs observables
`snapshot.paramMap` is read once. If the component is **reused** for navigation between `/users/1` and `/users/2`, the snapshot is stale. Subscribe to `paramMap` (with `takeUntilDestroyed`), or use `withComponentInputBinding()` with an `input()`.

### T24. `[class]` and `[ngClass]` interplay
`[class.active]="x"` toggles one class; `[class]="'a b'"` replaces the class attribute binding but merges with static classes (Angular merges class bindings predictably). Avoid binding both in conflicting ways.

### T25. `ViewEncapsulation.Emulated` and global/child styles
Component styles do not affect child components' internals. `::ng-deep` leaks styles but is deprecated. Prefer CSS custom properties, `:host`, and exposing style inputs.

### T26. `ngDoCheck` and `ngAfterViewChecked` run constantly
They run on every change detection cycle for the component. Heavy logic there kills performance.

### T27. Template reference variables and scope
`#ref` is available within the same template (and nested templates), not across components. `@if` creates its own scope: variables declared inside are not visible outside. `@let name = expr;` (Angular 18.1+) declares a local template variable.

### T28. Subscribing in a service constructor
Services live for the app lifetime (root). Subscriptions created there never end unless you handle them (`takeUntilDestroyed(destroyRef)` also works in services). Avoid infinite subscriptions without cleanup.

### T29. `Router.navigate` is relative to what?
`navigate(['x'])` is relative to the **root** unless you pass `{ relativeTo: this.route }`. `routerLink="x"` in a template is relative to the current route.

### T30. HTTP interceptor order and `next.handle`
Interceptors run in the order provided on the way out (request) and reverse on the way back (response). Forgetting to call `next(req)` swallows the request. Cloning requests is required (`req.clone`) because requests are immutable.

### T31. `async` pipe with `null`/`undefined`
Returns `null` until the first emission, which can cause template errors (`undefined.x`). Use `@if (obs$ | async; as value)` or provide initial values.

### T32. Calling `ngOnDestroy` of a service
Services provided in `root` are destroyed when the application is destroyed; services provided in a component are destroyed with that component. `ngOnDestroy` on services is called in those cases.

### T33. Strict mode surprises
`strict: true` (TypeScript) plus `strictTemplates` forces null checks and typed forms. Code that compiled in loose mode may need `?`, `!`, or type narrowing.

### T34. The `AsyncPipe` and OnPush
The `async` pipe calls `markForCheck()` on emission, so OnPush components update automatically. Plain `subscribe` assignments do not mark the view, so you must call `markForCheck()` (or use signals).

### T35. Standalone `imports` is not transitive
Importing a component does not give your template access to what that component imports. Each standalone component must list the directives/pipes/components its own template uses.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| Angular language? | TypeScript |
| Created/maintained by? | Google |
| Default package for CLI? | `@angular/cli` |
| Start dev server? | `ng serve` |
| Generate component? | `ng g c name` |
| Root bootstrap function? | `bootstrapApplication` |
| Component decorator? | `@Component` |
| Service decorator? | `@Injectable` |
| Singleton service scope? | `providedIn: 'root'` |
| Interpolation syntax? | `{{ value }}` |
| Property binding? | `[prop]="x"` |
| Event binding? | `(event)="fn()"` |
| Two-way binding? | `[(ngModel)]` or `model()` |
| New conditional syntax? | `@if () {}` |
| New loop syntax? | `@for (x of xs; track x.id) {}` |
| Lazy-load template parts? | `@defer` |
| Reactive primitive? | `signal()` |
| Derived value? | `computed()` |
| Side effect? | `effect()` |
| Signal input? | `input()` / `input.required()` |
| Signal output? | `output()` |
| Two-way signal? | `model()` |
| Observable → signal? | `toSignal()` |
| Auto unsubscribe in template? | `async` pipe |
| Auto unsubscribe in class? | `takeUntilDestroyed()` |
| Route guard type (modern)? | Functional `CanActivateFn` |
| Lazy route? | `loadComponent` / `loadChildren` |
| HTTP setup? | `provideHttpClient()` |
| Interceptor type? | `HttpInterceptorFn` |
| Typed forms builder? | `FormBuilder.nonNullable` |
| Skip checks until input changes? | `ChangeDetectionStrategy.OnPush` |
| Remove zone.js? | `provideZonelessChangeDetection()` |
| SSR package? | `@angular/ssr` |
| Image directive? | `NgOptimizedImage` (`ngSrc`) |
| Testing utility? | `TestBed` |
| State library? | NgRx (Store / SignalStore) |
| UI library? | Angular Material + CDK |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a large Angular application you worked on."
**Sample answer (STAR):**
- **S:** A B2B admin portal (200+ screens) built with NgModules and Default change detection felt slow; initial bundle was 3.4 MB.
- **T:** Improve performance and maintainability without a rewrite.
- **A:** Introduced an Nx workspace with domain libraries, converted modules to standalone with schematics, lazy-loaded features, moved presentational components to OnPush with signal inputs, replaced `*ngFor` with `@for` + `track`, virtualized big tables with CDK, and added bundle budgets and Lighthouse CI.
- **R:** Initial JS dropped 3.4 MB → 1.1 MB, screen load time improved by ~45%, and developer build time dropped from 90 s to 25 s with the esbuild builder and Nx caching.
Tip: show the measurable impact and the order of steps.

### P2. "How did you handle state management?"
Explain the decision table: local signals, feature services with signals, NgRx only for the complex shared domain (orders, permissions), router state for filters. Mention what you removed (unnecessary global store) and the results (less boilerplate, fewer bugs).

### P3. "Describe an RxJS bug you fixed."
Example: a search box used `mergeMap`, causing out-of-order results. Switched to `switchMap` + `debounceTime` + `distinctUntilChanged` and added `catchError` inside the inner pipe so errors did not kill the stream. Added a marble test.

### P4. "How do you ensure code quality in Angular teams?"
ESLint with `@angular-eslint` rules, strict TypeScript and templates, Nx module boundaries, PR templates, unit/component/E2E tests in CI, accessibility checks, performance budgets, and code owners for shared libs.

### P5. "Tell me about a migration (AngularJS → Angular, NgModules → standalone, zone → zoneless)."
Describe incremental steps (strangler), automated schematics, regression tests, feature flags, metrics (bundle size, CD cycles, Web Vitals), rollback plan, and training.

### P6. "How do you handle authentication in an Angular app?"
Prefer HttpOnly cookie sessions via a BFF; otherwise short-lived access tokens with a refresh interceptor that queues requests during refresh. Guards for UX, server-side authorization, CSRF protection, secure logout, and token handling not in `localStorage`.

### P7. "How do you debug performance issues?"
Angular DevTools profiler to find components with excess change detection, Chrome Performance for long tasks, bundle analyzer, then apply OnPush/signals, `track`, `@defer`, virtual scroll, caching and SSR. Measure before/after with budgets.

### P8. "What do you do when a library you depend on lags behind Angular versions?"
Check issues/PRs, pin versions temporarily, use `--legacy-peer-deps` only as a short-term bridge, contribute a fix or find alternatives, wrap the library behind an adapter to ease replacement, and keep upgrading the rest.

---

# 📚 Part 11: Complete Coverage (NgModules + RxJS + Ecosystem + Mixed)

## 11A. NgModules (legacy but still asked)

### K1. `@NgModule` metadata
```ts
@NgModule({
  declarations: [UserListComponent, UserCardComponent, HighlightDirective, TruncatePipe],   // belong to this module
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],                       // other modules whose exports we need
  exports: [UserCardComponent],                                                             // what other modules may use
  providers: [UserService],                                                                 // DI providers
  bootstrap: [AppComponent],                                                                // root module only
})
export class UsersModule {}
```

### K2. Module types
- **Root module (`AppModule`)**: bootstraps the app.
- **Feature modules**: group a feature; can be lazy-loaded.
- **Shared module**: reusable components/pipes/directives (and re-exported common modules); no singleton services.
- **Core module**: singleton services and app-wide setup, imported once in `AppModule`.
- **Routing modules**: define routes with `RouterModule.forRoot/forChild`.

### K3. `forRoot()` vs `forChild()`
`forRoot(routes)` registers the router service and root routes **once**. `forChild(routes)` registers additional routes for feature modules without creating a second router service. A custom `forRoot()` pattern returns `ModuleWithProviders` so singleton services are provided only by the root import.

### K4. Lazy-loaded modules (legacy)
```ts
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule) }
```
Lazy modules get their own injector; services in their `providers` are separate instances.

### K5. Mapping NgModule → standalone
| NgModule | Standalone |
|---|---|
| `declarations: [X]` | `@Component({ standalone: true })` (default in v19+) |
| `imports: [Module]` in the module | `imports: [...]` on each component |
| `providers` in module | `providers` in `bootstrapApplication` / route config |
| `bootstrap: [AppComponent]` | `bootstrapApplication(AppComponent, config)` |
| `RouterModule.forRoot` | `provideRouter` |
| `HttpClientModule` | `provideHttpClient()` |
| `BrowserAnimationsModule` | `provideAnimations()` / `provideAnimationsAsync()` |

## 11B. RxJS Operator Catalog (what to know)

| Category | Operators |
|---|---|
| Creation | `of`, `from`, `interval`, `timer`, `fromEvent`, `defer`, `EMPTY`, `throwError`, `ajax`, `webSocket` |
| Transformation | `map`, `scan`, `pluck`(old), `switchMap`, `mergeMap`, `concatMap`, `exhaustMap`, `buffer`, `toArray`, `groupBy` |
| Filtering | `filter`, `take`, `takeUntil`, `takeWhile`, `skip`, `first`, `last`, `debounceTime`, `throttleTime`, `distinctUntilChanged`, `distinctUntilKeyChanged` |
| Combination | `combineLatest`, `forkJoin`, `zip`, `merge`, `concat`, `withLatestFrom`, `startWith`, `race` |
| Error handling | `catchError`, `retry`, `retryWhen`(old), `onErrorResumeNext` |
| Utility | `tap`, `delay`, `timeout`, `finalize`, `share`, `shareReplay` |
| Multicasting | `Subject`, `BehaviorSubject`, `ReplaySubject`, `AsyncSubject`, `share`, `shareReplay` |

### K6. Marble testing idea
```ts
testScheduler.run(({ cold, expectObservable }) => {
  const source = cold('a-b-c|', { a: 1, b: 2, c: 3 });
  expectObservable(source.pipe(map((x) => x * 2))).toBe('a-b-c|', { a: 2, b: 4, c: 6 });
});
```
Use `TestScheduler` for time-based operators (`debounceTime`) without real delays.

## 11C. Ecosystem Map

| Area | Common choices |
|---|---|
| UI | Angular Material / CDK, PrimeNG, Spartan UI, Taiga UI, NG-ZORRO |
| State | Signals + services, NgRx (Store, Effects, Entity, SignalStore), Akita, Elf |
| Forms | Reactive forms, Formly, Signal Forms (experimental) |
| HTTP/data | HttpClient, `resource`/`httpResource`, TanStack Query (Angular), Apollo Angular |
| i18n | `@angular/localize`, Transloco, ngx-translate |
| Testing | Jasmine/Karma (legacy), Jest, Vitest, Testing Library, Playwright, Cypress, Storybook |
| Build/monorepo | Angular CLI, Nx, esbuild/Vite builder |
| SSR | `@angular/ssr` (Express), Analog (meta-framework on Angular) |
| Mobile/desktop | Ionic/Capacitor, NativeScript, Electron |
| Docs/UI dev | Storybook, Compodoc |

## 11D. HTML + CSS + JavaScript Topics in Angular

### M1. Template syntax cheat
```html
<input #name (input)="onInput($event)" />                       <!-- template reference variable -->
<p>{{ user?.name ?? 'Guest' }}</p>                               <!-- safe navigation + nullish -->
@let total = price() * qty();                                    <!-- local template variable (18.1+) -->
<button [disabled]="!form.valid" [attr.aria-busy]="loading()">Save</button>
<div [class.active]="isActive()" [style.width.px]="w()"></div>
<img [ngSrc]="photo.url" width="400" height="300" priority />    <!-- NgOptimizedImage -->
```

### M2. Component styling
```css
:host { display: block; }                    /* style the component's host element */
:host(.active) { border-color: teal; }
:host-context(.dark) h2 { color: white; }    /* style based on an ancestor class */
```
Use CSS custom properties (`--card-bg`) for theming across encapsulation boundaries.

### M3. Working with the DOM safely
Prefer bindings and `Renderer2` over direct `nativeElement` manipulation (works with SSR and is safer). Use `ElementRef` only when needed (focus, measurements) and guard for browser-only access.
```ts
private renderer = inject(Renderer2);
this.renderer.addClass(this.el.nativeElement, 'highlight');
```

### M4. Directive that uses `IntersectionObserver` (lazy load / reveal)
```ts
@Directive({ selector: '[appInView]' })
export class InViewDirective {
  inView = output<boolean>();
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  constructor() {
    afterNextRender(() => {
      const io = new IntersectionObserver(([e]) => this.inView.emit(e.isIntersecting));
      io.observe(this.el.nativeElement);
      inject(DestroyRef).onDestroy(() => io.disconnect());
    });
  }
}
```

### M5. Animations
Use CSS transitions/animations for simple effects (and `prefers-reduced-motion`), and the Angular animations package (`trigger`, `state`, `transition`, `animate`) for complex sequences or route transitions. Newer versions add `animate.enter` / `animate.leave` bindings (check version support).

### M6. Accessibility in templates
Use semantic elements, `aria-live` for async messages (CDK `LiveAnnouncer`), `cdkTrapFocus` for dialogs, label associations, and keyboard handlers for custom controls. Lint templates with `@angular-eslint/template/accessibility-*` rules.

---

# 🧠 Part 12: Angular Internals

### B1. Ivy: how templates are compiled
The AOT compiler turns each template into a **template function** with two modes:
- **Creation mode** (run once): creates DOM nodes and directives (`ɵɵelementStart`, `ɵɵtext`, `ɵɵlistener`...).
- **Update mode** (run on each change detection): updates bindings (`ɵɵadvance`, `ɵɵproperty`, `ɵɵtextInterpolate`) only when values changed.
This is an **incremental DOM** approach: instructions mutate the real DOM directly; there is no virtual DOM. Locality (each component compiles independently) enables fast incremental builds and tree-shaking of unused features.

### B2. `TView` and `LView`
`TView` holds static, shared data for a component type (template info, directive defs). `LView` is the per-instance array holding runtime state (DOM nodes, binding values, directive instances, injector data). Change detection walks `LView`s and compares stored binding values with new ones.

### B3. Change detection traversal
`ApplicationRef.tick()` → refresh the root view → for each component view: run update-mode template function, call lifecycle hooks, then refresh child component views. OnPush views are skipped unless **dirty** (marked by input change, event, `markForCheck`, `async` pipe, or a signal their template reads). In dev mode a second pass checks for NG0100.

### B4. zone.js and `NgZone`
zone.js patches browser async APIs so Angular knows when async work finishes. `NgZone.onMicrotaskEmpty` triggers a tick. `runOutsideAngular` runs code without triggering ticks; `run` re-enters the zone. Zone adds bundle size and complicates stack traces, which is a reason for the zoneless direction.

### B5. Zoneless scheduling
A **change detection scheduler** listens for notifications: signal updates read by views, `markForCheck`, `async` pipe emissions, template/host listeners, `ComponentRef.setInput`, and view attach/remove. It batches and schedules a tick (using a race between `requestAnimationFrame` and `setTimeout`). No monkey-patching required.

### B6. The signals graph
A signal is a **producer** node with a version; `computed` and `effect` and template views are **consumers**. Reading a signal inside a reactive context records a dependency. Writing increments the version and marks dependents **dirty** (push), while `computed` re-evaluates lazily on read (pull) and uses version checks to skip unnecessary work: **glitch-free**. Views that read signals become reactive consumers that mark themselves for refresh.

### B7. Dependency Injection internals
Two injector trees: the **Node injector** tree (element-level: components/directives) and the **Environment injector** tree (root, lazy routes, platform). Resolution checks the node injector chain up the DOM-based tree, then the environment injectors. Node injectors use a bloom filter for fast negative lookups. Tokens resolve by class or `InjectionToken`; missing providers throw NG0201.

### B8. Router internals
Navigation phases: parse URL → **recognize** route tree → run **guards** (`canMatch`, `canActivate`, `canActivateChild`, `canDeactivate`) → run **resolvers** → **activate** routes (create components in outlets) → update URL and emit events. `RouteReuseStrategy` decides whether to reuse component instances. Lazy routes load code during recognition/matching.

### B9. HttpClient interceptor chain
`HttpClient` builds a chain of interceptors ending with the `HttpBackend` (XHR or `fetch`). Each interceptor receives `(req, next)` and returns an Observable of events; responses flow back in reverse. Requests are immutable (`clone`). The backend uses `XMLHttpRequest` by default or `fetch` when `withFetch()` is configured (better for SSR).

### B10. Hydration internals
During SSR, Angular serializes structure metadata into the HTML (`ngh` attributes). On the client, hydration **claims existing DOM nodes** and attaches listeners instead of re-creating them. If the DOM differs from the expected structure (manual DOM changes, invalid HTML), it throws NG05xx errors or falls back. **Event replay** uses a lightweight script to capture events before hydration. **Incremental hydration** defers hydration of `@defer` blocks until their trigger fires.

### B11. How `@defer` works
The compiler extracts dependencies of the deferred block into **lazy chunks**. At runtime a trigger (idle, viewport via `IntersectionObserver`, interaction/hover via events, timer, condition) starts loading; placeholder/loading/error states are managed by the runtime. `prefetch` triggers load the chunk earlier without rendering.

### B12. Build pipeline
The application builder uses **esbuild** for bundling and transpilation, with a **Vite** dev server for `ng serve`. Steps: compile (Angular compiler with TypeScript), bundle and tree-shake, minify, hash, produce `browser/` (and `server/` for SSR). Library builds use `ng-packagr` and partial compilation (Angular Package Format) so apps finish linking at build time.

### B13. Testing internals
`TestBed` creates a testing module/injector, compiles components, and `ComponentFixture` wraps the component with change detection control. Zone-based tests use `fakeAsync`/`tick`; zoneless tests rely on `await fixture.whenStable()` and signals-aware scheduling. Harnesses abstract DOM details.

### B14. Strictness flags
`strict`, `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers` make the compiler check template expressions, input types and DI parameters. Turning them on catches many bugs at build time.

---

# 📋 Part 13: Reference Tables

### R1. Lifecycle hooks (order)
| Order | Hook | Notes |
|---|---|---|
| 1 | `constructor` | DI, field init |
| 2 | `ngOnChanges` | Input changes (before init and on each change) |
| 3 | `ngOnInit` | Once, after first `ngOnChanges` |
| 4 | `ngDoCheck` | Every CD run |
| 5 | `ngAfterContentInit` | Projected content ready (once) |
| 6 | `ngAfterContentChecked` | After projected content checked |
| 7 | `ngAfterViewInit` | View and children ready (once) |
| 8 | `ngAfterViewChecked` | After view checked |
| 9 | `ngOnDestroy` | Cleanup |
Newer: `afterNextRender`, `afterEveryRender` (render hooks, browser only).

### R2. Decorators vs signal-based APIs
| Classic | Signal API |
|---|---|
| `@Input() x` | `x = input<T>()` / `input.required<T>()` |
| `@Output() y = new EventEmitter()` | `y = output<T>()` |
| `@Input()` + `@Output() xChange` | `x = model<T>()` |
| `@ViewChild` | `viewChild()` |
| `@ViewChildren` | `viewChildren()` |
| `@ContentChild(ren)` | `contentChild()` / `contentChildren()` |
| Constructor DI | `inject()` |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| `APP_INITIALIZER` | `provideAppInitializer` |

### R3. Provider recipes
| Recipe | Meaning |
|---|---|
| `{ provide: T, useClass: C }` | Instantiate `C` for token `T` |
| `{ provide: T, useValue: v }` | Provide a constant |
| `{ provide: T, useFactory: fn, deps: [...] }` | Build with a factory |
| `{ provide: T, useExisting: Other }` | Alias another token |
| `multi: true` | Collect multiple values for one token |

### R4. Route guards and resolvers
| Type | Purpose |
|---|---|
| `canMatch` | Decide if a route (and lazy bundle) can be matched |
| `canActivate` | Allow entering a route |
| `canActivateChild` | Allow entering child routes |
| `canDeactivate` | Allow leaving (unsaved changes) |
| `resolve` | Pre-fetch data before activation |

### R5. RxJS flattening operators
| Operator | Concurrency | Use |
|---|---|---|
| `switchMap` | Latest only (cancels previous) | Search, reads |
| `mergeMap` | Unlimited parallel | Independent tasks |
| `concatMap` | One at a time, ordered | Ordered writes |
| `exhaustMap` | Ignore while busy | Submit/login |

### R6. Change detection strategies
| | Default | OnPush |
|---|---|---|
| Checked | Every cycle | When input ref changes, event, signal/async emission, `markForCheck` |
| Performance | Lower | Higher |
| Mutation of inputs | Works | Doesn't update |
| Recommended | No | Yes (with signals) |

### R7. Forms comparison
| | Template-driven | Reactive | Signal Forms (experimental) |
|---|---|---|---|
| Source of truth | Template | Class | Signals |
| Validation | Directives | Functions | Schema/functions |
| Dynamic forms | Hard | Good | Evolving |
| Testing | Harder | Easier | Easier |

### R8. Control flow vs legacy directives
| New | Old |
|---|---|
| `@if (x) {} @else {}` | `*ngIf="x; else tpl"` |
| `@for (i of list; track i.id) {}` | `*ngFor="let i of list; trackBy: fn"` |
| `@switch (v) { @case (a) {} }` | `[ngSwitch]` / `*ngSwitchCase` |
| `@defer {}` | Manual lazy-loading with dynamic components |

### R9. Angular CLI cheat sheet
`ng new`, `ng serve --open`, `ng build`, `ng test`, `ng lint`, `ng generate component|service|directive|pipe|guard|interceptor|resolver|library|environments|web-worker`, `ng add`, `ng update`, `ng extract-i18n`, `ng deploy`, `ng analytics`.

### R10. Common error codes
| Code | Meaning |
|---|---|
| NG0100 | ExpressionChangedAfterItHasBeenChecked |
| NG0200 | Circular dependency in DI |
| NG0201 | No provider found (NullInjectorError) |
| NG0203 | `inject()` outside injection context |
| NG0303 | Can't bind to property (unknown property) |
| NG0304 | Unknown element/component |
| NG0500–NG0507 | Hydration mismatches |
| NG0600 | Writing to signals not allowed in this context |
| NG0912 | Component ID collision (rare) |

### R11. Version timeline (verify exact status in release notes)
| Version | Highlights |
|---|---|
| 14 | Standalone components (preview), typed forms, `inject()` |
| 15 | Standalone stable, functional guards/resolvers, directive composition API |
| 16 | Signals (preview), required inputs, `takeUntilDestroyed`, hydration preview |
| 17 | New control flow, `@defer`, esbuild/Vite builder default, SSR/hydration improvements |
| 17.x | Signal inputs, model inputs, signal queries |
| 18 | Zoneless (experimental), Material 3, `@let`, event replay preview |
| 19 | Standalone by default, `linkedSignal`/`resource` (experimental), incremental hydration (preview), route render modes, `provideAppInitializer` |
| 20 | Core signal APIs stable, zoneless developer preview, `httpResource` experimental, incremental hydration stable |
| 21 | Zoneless as default for new apps, Vitest as default test runner, Signal Forms (experimental) |

### R12. Testing tools
| Need | Tool |
|---|---|
| Unit/component | Jasmine+Karma (legacy), Jest, Vitest, `TestBed` |
| HTTP | `HttpTestingController` |
| Router | `RouterTestingHarness` |
| UI harnesses | Angular CDK/Material harnesses |
| Time | `fakeAsync`, `TestScheduler` (marbles) |
| E2E | Playwright, Cypress |
| Visual/docs | Storybook, Chromatic |


---

# 🧩 Part 14: Output & Prediction Questions

> Give the answer **and the reason**. Assume modern standalone Angular unless the question says otherwise.

### O1. Which hook runs first, parent or child?
For a parent component whose template contains a child component:
**Answer:** `ngOnInit`: **parent first, then child**. `ngAfterViewInit`: **child first, then parent** (the parent's view is complete only when its children are). The same applies to `ngAfterViewChecked`. `ngOnDestroy`: the parent is destroyed along with the child; do not depend on the order between them.

### O2. Does an OnPush component update?
```ts
@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: `{{ user.name }}` })
class Child { @Input() user!: User; }
// parent: this.user.name = 'New';   (mutation, same reference)
```
**Answer:** No. The input reference did not change, so the OnPush view is not marked dirty. Fix: `this.user = { ...this.user, name: 'New' }`, use signals, or call `markForCheck()`.

### O3. How often does this effect log?
```ts
count = signal(0);
constructor() { effect(() => console.log(this.count())); }
// later, in the same tick:
this.count.set(1); this.count.set(2);
```
**Answer:** First log `0` (when the effect first runs), then a single log `2`. Effects are scheduled and batched during change detection, so the intermediate `1` is skipped.

### O4. Is a `computed` evaluated each time you read it?
```ts
const a = signal(1);
const d = computed(() => { console.log('calc'); return a() * 2; });
d(); d(); a.set(2); d(); d();
```
**Answer:** `calc` is logged **twice**: on the first read and again on the first read after `a` changed. A `computed` is lazy and memoized.

### O5. Does setting the same value notify?
```ts
const s = signal(5);
effect(() => console.log(s()));
s.set(5);
```
**Answer:** No new log. Signals compare with `Object.is`; the same value (or same object reference) does not notify. For objects, create a new reference or pass a custom `equal`.

### O6. How many HTTP requests?
```html
<p>{{ (user$ | async)?.name }}</p>
<p>{{ (user$ | async)?.email }}</p>
```
where `user$ = this.http.get<User>('/api/me')`.
**Answer:** **Two** requests (two subscriptions to a cold Observable). Fix: `@if (user$ | async; as user) {...}` once, `shareReplay`, or `toSignal`.

### O7. Does the request run?
```ts
this.http.get('/api/users');          // nothing else
```
**Answer:** No. `HttpClient` returns a cold Observable; nothing is sent until you subscribe (or use `async`/`toSignal`).

### O8. Rapid clicks and flattening operators
A button emits three clicks quickly, each starting a 1-second request. What is processed?
**Answer:** `switchMap` → only the **last** result (earlier requests cancelled). `mergeMap` → **all three**, possibly out of order. `concatMap` → all three, **one after another** in order (3 seconds total). `exhaustMap` → only the **first** (the other clicks are ignored while it runs).

### O9. Late subscribers
```ts
const b = new BehaviorSubject(1); b.next(2); b.subscribe(console.log);
const s = new Subject<number>(); s.next(1); s.subscribe(console.log);
const r = new ReplaySubject<number>(2); r.next(1); r.next(2); r.next(3); r.subscribe(console.log);
```
**Answer:** `BehaviorSubject` logs `2`. `Subject` logs nothing (it does not replay). `ReplaySubject(2)` logs `2` then `3`.

### O10. `forkJoin` with a never-ending source
```ts
forkJoin([of(1), new Subject<number>()]).subscribe(console.log);
```
**Answer:** Never emits, because the `Subject` never completes. `forkJoin` waits for all sources to complete.

### O11. `combineLatest` emissions
```ts
a$ emits 1 then 2; b$ emits 'x' afterwards.
combineLatest([a$, b$]).subscribe(console.log);
```
**Answer:** One emission: `[2, 'x']`. `combineLatest` waits until every source has emitted at least once, then emits using the latest values.

### O12. Operator pipeline
```ts
of(1, 2, 3).pipe(map((x) => x * 2), filter((x) => x > 2)).subscribe(console.log);
```
**Answer:** `4` then `6`.

### O13. `debounceTime`
Source emits `v1` at 0 ms, `v2` at 100 ms, `v3` at 200 ms, `v4` at 600 ms and then completes. `debounceTime(300)`.
**Answer:** `v3` (at 500 ms, after 300 ms of silence) and `v4` (emitted when the source completes or after 300 ms). `v1` and `v2` are dropped.

### O14. Interceptor order
`withInterceptors([A, B])`, each logs "A req", "B req" before `next(req)` and "B res", "A res" in a `tap` on the way back.
**Answer:** Requests: `A req` → `B req`; responses: `B res` → `A res`. Interceptors form a chain: first in, last out for responses.

### O15. Route param reuse
Navigating from `/users/1` to `/users/2` uses the same component. The component reads `this.route.snapshot.paramMap.get('id')` in `ngOnInit`.
**Answer:** It still shows user 1. Angular reuses the component instance and does not call `ngOnInit` again. Subscribe to `paramMap` (with `takeUntilDestroyed`) or use `withComponentInputBinding()` with an `input()`.

### O16. Guard returning a `UrlTree`
```ts
canActivate: () => inject(Router).createUrlTree(['/login'])
```
**Answer:** Navigation is cancelled and redirected to `/login`. Returning `true` allows it; `false` cancels it with no redirect.

### O17. Missing import in a standalone component
```ts
@Component({ imports: [], template: `<app-button />` })
class Page {}
```
**Answer:** Error NG0304 (`'app-button' is not a known element`). In standalone components every component/directive/pipe used in the template must appear in `imports`. Imports are **not transitive**.

### O18. `ngModel` without `FormsModule`
**Answer:** Error NG0303: *Can't bind to 'ngModel' since it isn't a known property of 'input'*. Import `FormsModule` (standalone `imports` or the NgModule).

### O19. `ExpressionChanged...`
```ts
// Child
ngAfterViewInit() { this.parentService.title = 'Ready'; }
// Parent template: {{ parentService.title }}
```
**Answer:** NG0100 in development: the parent's binding was already checked, and the child changed the value afterwards. Defer the change (`Promise.resolve().then(...)`/signal update scheduled properly), or restructure so the data flows downward.

### O20. `@for` without `track`
```html
@for (u of users) { <li>{{ u.name }}</li> }
```
**Answer:** Compile error: `@for` requires a `track` expression (`track u.id`).

### O21. `trackBy` and DOM reuse
After refreshing a list from the API (new objects with the same ids), what happens with `track item.id` versus no stable tracking?
**Answer:** With `track item.id`, Angular **reuses** DOM nodes and updates bindings (focus, input state and animations are preserved). With tracking by object identity, it destroys and re-creates every row.

### O22. Zoneless and plain fields
```ts
// OnPush + zoneless
value = 0;
ngOnInit() { setTimeout(() => (this.value = 5), 1000); }   // template: {{ value }}
```
**Answer:** The view does **not** update (nothing notifies Angular). Use `signal` (`value = signal(0); this.value.set(5)`) or call `markForCheck()`.

### O23. `toSignal` types
```ts
const a = toSignal(obs$);                         // Signal<T | undefined>
const b = toSignal(obs$, { initialValue: [] });   // Signal<T>
```
**Answer:** Without `initialValue` the signal can be `undefined` before the first emission; with `initialValue` (or `requireSync` for sync sources) it is non-undefined.

### O24. Required input not provided
```ts
name = input.required<string>();
// parent: <app-card />
```
**Answer:** A compile-time template error (strict templates), and at runtime reading `name()` without a value throws NG0950. Always bind required inputs.

### O25. `shareReplay` leak
```ts
data$ = this.http.get('/api').pipe(shareReplay(1));        // no refCount
```
**Answer:** The source subscription stays alive after all subscribers leave (for long-lived sources this keeps the stream running). Use `shareReplay({ bufferSize: 1, refCount: true })` for streams that should stop when unused (HTTP is fine either way because it completes).

---

# ✅ Part 15: MCQs

1. Angular is written in... → **TypeScript**
2. What is the CLI command to create a project? → **`ng new`**
3. What is a component? → **A class with a template, styles and metadata (`@Component`)**
4. What does `standalone` mean? → **The component declares its own imports and needs no NgModule**
5. Interpolation syntax? → **`{{ expression }}`**
6. Property binding syntax? → **`[property]="value"`**
7. Event binding syntax? → **`(event)="handler()"`**
8. Two-way binding syntax? → **`[(ngModel)]`** (banana in a box)
9. What does `@for` require? → **A `track` expression**
10. Which block lazy-loads part of a template? → **`@defer`**
11. What replaced `*ngIf`? → **`@if` (control flow)**
12. What is a signal? → **A reactive value read by calling it (`count()`)**
13. Which function creates a derived signal? → **`computed()`**
14. Which function runs side effects when signals change? → **`effect()`**
15. Which API is a signal-based input? → **`input()`**
16. Which API is a signal-based two-way binding? → **`model()`**
17. Which API replaces `@Output()` emitters? → **`output()`**
18. What provides a singleton service app-wide? → **`@Injectable({ providedIn: 'root' })`**
19. What function injects dependencies without constructor parameters? → **`inject()`**
20. What does `NullInjectorError` mean? → **No provider found for the token**
21. Which hook runs once after the first input binding? → **`ngOnInit`**
22. Which hook is for cleanup? → **`ngOnDestroy`**
23. Which hook fires when an `@Input` reference changes? → **`ngOnChanges`**
24. Which hook runs after the view is initialized? → **`ngAfterViewInit`**
25. Which pipe unsubscribes automatically? → **`async`**
26. Is a pure pipe re-run when an array is mutated? → **No (only when the reference changes)**
27. Which change detection strategy checks only when inputs/events/signals change? → **OnPush**
28. What library provides Observables? → **RxJS**
29. Which operator cancels the previous inner Observable? → **`switchMap`**
30. Which operator ignores new values while one is running? → **`exhaustMap`**
31. Which operator keeps order and runs one at a time? → **`concatMap`**
32. Which Subject keeps the current value? → **`BehaviorSubject`**
33. Which operator waits for all sources to complete? → **`forkJoin`**
34. Which operator emits whenever any source emits after all have emitted once? → **`combineLatest`**
35. What does `catchError` do? → **Handles an error and returns a replacement Observable**
36. Which function unsubscribes automatically when a component is destroyed? → **`takeUntilDestroyed()`**
37. Which Angular feature protects against XSS by default? → **Template sanitization**
38. Which service performs HTTP calls? → **`HttpClient`**
39. How do you register interceptors (modern)? → **`provideHttpClient(withInterceptors([...]))`**
40. What type is a functional route guard? → **`CanActivateFn`**
41. How do you lazy-load a standalone component route? → **`loadComponent: () => import(...)`**
42. Which directive renders the routed component? → **`<router-outlet>`**
43. Which form approach defines the model in the class? → **Reactive forms**
44. Which class represents a single form field? → **`FormControl`**
45. Which interface makes a custom control work with forms? → **`ControlValueAccessor`**
46. Which tool tests components in isolation? → **`TestBed`**
47. Which testing class mocks HTTP calls? → **`HttpTestingController`**
48. Which package provides SSR? → **`@angular/ssr`**
49. What reuses server-rendered DOM in the browser? → **Hydration**
50. What removes zone.js dependence? → **`provideZonelessChangeDetection()`**
51. Which directive optimizes images? → **`NgOptimizedImage` (`ngSrc`)**
52. Which UI toolkit provides behavior primitives without styling? → **Angular CDK**
53. Which state library offers actions, reducers, selectors and effects? → **NgRx**
54. Which command upgrades Angular? → **`ng update`**
55. What does AOT compilation do? → **Compiles templates at build time**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes developers make again and again in Angular code. Interviewers ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Forgetting to unsubscribe from long-lived Observables
**❌ Wrong:**
```ts
ngOnInit() { this.form.valueChanges.subscribe((v) => this.save(v)); interval(1000).subscribe(tick); }
```
**🤔 Why it is a problem:** Subscriptions keep running after the component is destroyed (memory leaks, duplicate handlers, errors).

**✅ Correct:**
```ts
private destroyRef = inject(DestroyRef);
ngOnInit() { this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => this.save(v)); }
// or use the async pipe / toSignal in templates
```
**💬 Say:** "Long-lived streams need an explicit end: `async` pipe, `toSignal`, or `takeUntilDestroyed`."

---

### Mistake 2: Nested `subscribe` calls
**❌ Wrong:**
```ts
this.route.params.subscribe((p) => { this.api.getUser(p['id']).subscribe((u) => (this.user = u)); });
```
**🤔 Why it is a problem:** Callback hell, no cancellation, leaks, and race conditions.

**✅ Correct:**
```ts
user = toSignal(this.route.paramMap.pipe(map((p) => p.get('id')!), switchMap((id) => this.api.getUser(id))));
```
**💬 Say:** "I flatten streams with `switchMap`, not nested subscriptions."

---

### Mistake 3: Calling functions in templates
**❌ Wrong:**
```html
<li>{{ formatPrice(item) }}</li>
<div [class.hot]="isHot(item)"></div>
```
**🤔 Why it is a problem:** The functions run on every change detection cycle for every row, which is a major source of slowness.

**✅ Correct:** Use a pure pipe (`{{ item.price | currency }}`), a `computed` signal, or precompute values when data changes.
**💬 Say:** "Templates should bind to values, not run logic repeatedly."

---

### Mistake 4: Using Default change detection everywhere
**❌ Wrong:** Large apps with every component on `Default`, plain mutable fields, and zone-triggered checks for everything.
**🤔 Why it is a problem:** Every event checks the whole tree; performance degrades as the app grows.

**✅ Correct:** `ChangeDetectionStrategy.OnPush` + signals/`async` pipe + immutable data; consider zoneless.
**💬 Say:** "OnPush with signals is my default for new components."

---

### Mistake 5: Mutating inputs and state in OnPush components
**❌ Wrong:**
```ts
this.items.push(newItem);                // same array reference
```
**🤔 Why it is a problem:** OnPush does not detect the mutation; the view does not update.

**✅ Correct:**
```ts
this.items = [...this.items, newItem];       // or items.update((l) => [...l, newItem])
```
**💬 Say:** "I update state immutably so Angular can detect it."

---

### Mistake 6: `*ngFor` / `@for` without a stable `track`
**❌ Wrong:**
```html
@for (u of users; track $index) { <app-user [user]="u" /> }       // when the list reorders or refreshes
```
**🤔 Why it is a problem:** DOM and component state attach to positions instead of items.

**✅ Correct:** `@for (u of users; track u.id)`.
**💬 Say:** "I track by a stable id."

---

### Mistake 7: Using the `async` pipe multiple times on the same cold Observable
**❌ Wrong:**
```html
{{ (user$ | async)?.name }} {{ (user$ | async)?.email }}
```
**🤔 Why it is a problem:** Two subscriptions mean two HTTP requests.

**✅ Correct:**
```html
@if (user$ | async; as user) { {{ user.name }} {{ user.email }} }
```
**💬 Say:** "One subscription per stream."

---

### Mistake 8: Fat components with business logic and HTTP calls
**❌ Wrong:** A 600-line component that calls `HttpClient`, handles state, validation and formatting.
**🤔 Why it is a problem:** Hard to test and reuse; change detection and logic are mixed.

**✅ Correct:** Services/stores for data and logic; smart components orchestrate; presentational components render with inputs/outputs; pure functions in util libs.
**💬 Say:** "Components stay thin."

---

### Mistake 9: Relying on route guards for security
**❌ Wrong:** "Only admins can open `/admin` because of `canActivate`."
**🤔 Why it is a problem:** Client code can be bypassed; the API remains open.

**✅ Correct:** Enforce authentication and authorization on the server for every API; keep guards for UX.
**💬 Say:** "Guards improve UX; the backend enforces security."

---

### Mistake 10: Storing tokens in `localStorage`
**❌ Wrong:** `localStorage.setItem('token', jwt)`.
**🤔 Why it is a problem:** Any XSS (including a compromised dependency) can steal it.

**✅ Correct:** HttpOnly + Secure + SameSite cookies (via a BFF), XSRF protection, short-lived tokens.
**💬 Say:** "Tokens do not belong in JavaScript-readable storage."

---

### Mistake 11: Using `switchMap` for mutations
**❌ Wrong:**
```ts
save$ = this.clicks.pipe(switchMap(() => this.api.save(data)));
```
**🤔 Why it is a problem:** A rapid second click cancels the first request (which the server may still process), causing inconsistent state.

**✅ Correct:** `exhaustMap` (ignore while pending) or `concatMap` (queue) for writes; `switchMap` for reads.
**💬 Say:** "Reads cancel, writes queue or exhaust."

---

### Mistake 12: `catchError` on the outer stream (killing it)
**❌ Wrong:**
```ts
this.q.valueChanges.pipe(switchMap((v) => this.api.search(v)), catchError(() => of([])));   // stream ends after the first error
```
**🤔 Why it is a problem:** After an error the outer Observable completes; the search box stops working.

**✅ Correct:**
```ts
this.q.valueChanges.pipe(switchMap((v) => this.api.search(v).pipe(catchError(() => of([])))));
```
**💬 Say:** "I catch errors inside the inner Observable."

---

### Mistake 13: Exposing `BehaviorSubject.next` to the world
**❌ Wrong:** `public user$ = new BehaviorSubject<User | null>(null);`
**🤔 Why it is a problem:** Any component can push values, so state changes are untraceable.

**✅ Correct:**
```ts
private _user = new BehaviorSubject<User | null>(null);
readonly user$ = this._user.asObservable();
// or: private _user = signal<User | null>(null); readonly user = this._user.asReadonly();
```
**💬 Say:** "State is private; exposure is read-only; changes go through methods."

---

### Mistake 14: Untyped HTTP responses and `any`
**❌ Wrong:**
```ts
this.http.get('/api/users').subscribe((res: any) => (this.users = res.data));
```
**🤔 Why it is a problem:** The compiler cannot catch wrong property names or shape changes, so bugs appear at run time. Also, a type annotation does not validate data: the API response can still differ from the type.

**✅ Correct:**
```ts
interface ApiList<T> { data: T[] }
this.http.get<ApiList<User>>('/api/users').pipe(map((r) => r.data)).subscribe((users) => (this.users = users));
// for untrusted/changing APIs, validate the response (e.g., Zod) in the data-access layer
```
**💬 Say:** "I type HTTP responses, and for risky boundaries I validate at run time."

---

### Mistake 15: Using `effect` to derive state
**❌ Wrong:**
```ts
effect(() => { this.total.set(this.items().reduce((s, i) => s + i.price, 0)); });
```
**🤔 Why it is a problem:** Extra update cycle, harder reasoning, and possible loops.

**✅ Correct:** `total = computed(() => this.items().reduce((s, i) => s + i.price, 0));` Use `linkedSignal` for resettable local state.
**💬 Say:** "`computed` for derived values, `effect` for side effects."

---

### Mistake 16: Direct DOM access (`document.querySelector`) and browser APIs in SSR
**❌ Wrong:**
```ts
constructor() { const w = window.innerWidth; document.getElementById('x')!.focus(); }
```
**🤔 Why it is a problem:** Breaks SSR (`window is not defined`) and bypasses Angular's rendering and security.

**✅ Correct:** Use template refs (`viewChild`), `Renderer2`, injected `DOCUMENT`, `isPlatformBrowser`, and `afterNextRender`.
**💬 Say:** "I treat the DOM as an implementation detail and keep code SSR-safe."

---

### Mistake 17: Not lazy-loading routes and heavy components
**❌ Wrong:** Importing every feature in the root routes.
**🤔 Why it is a problem:** Large initial bundle and slow startup.

**✅ Correct:** `loadComponent`/`loadChildren`, `@defer` for heavy widgets, preloading strategies, bundle budgets.
**💬 Say:** "Initial load carries only what the first screen needs."

---

### Mistake 18: Leaving strict mode off
**❌ Wrong:** `strict: false`, `any` everywhere, untyped `HttpClient` calls.
**🤔 Why it is a problem:** Runtime errors that the compiler could have found; weak refactoring support.

**✅ Correct:** Enable `strict`, `strictTemplates`; type HTTP responses (`http.get<User[]>`), forms (`nonNullable` typed forms).
**💬 Say:** "I use strict TypeScript and strict templates."

---

### Mistake 19: Forgetting loading and error states
**❌ Wrong:** Template assumes data exists; no spinner, no error UI.
**🤔 Why it is a problem:** Blank pages, template errors and poor UX on slow or failed requests.

**✅ Correct:** Model state (`idle | loading | success | error`), show skeletons/errors, `@if (error())`, retry buttons, and a global error handler/toast.
**💬 Say:** "Every async view handles loading, empty and error states."

---

### Mistake 20: Putting services with state in a SharedModule (legacy)
**❌ Wrong:** Providing services in a `SharedModule` imported by lazy modules.
**🤔 Why it is a problem:** Each lazy module gets a separate instance (duplicate state).

**✅ Correct:** `providedIn: 'root'` for singletons; shared modules/standalone for declarables only.
**💬 Say:** "Singletons are root-provided; shared code contains only reusable declarations."

---

### Mistake 21: Overusing NgRx for simple state
**❌ Wrong:** Actions/reducers/effects for a toggle or a single list.
**🤔 Why it is a problem:** Boilerplate, slower delivery, and more places for bugs.

**✅ Correct:** Local signals and feature services first; adopt NgRx (or SignalStore) for complex shared state.
**💬 Say:** "I choose the lightest state tool that fits the problem."

---

### Mistake 22: Mixing template-driven and reactive forms, and untyped forms
**❌ Wrong:** `[(ngModel)]` inside a `[formGroup]` without `standalone`, or `new FormControl('')` read as `any`.
**🤔 Why it is a problem:** Confusing state, runtime errors (NG01xx forms errors), loss of type safety.

**✅ Correct:** Pick one approach per form; use typed reactive forms (`fb.nonNullable.group`), and validators as functions.
**💬 Say:** "Reactive typed forms for anything non-trivial."

---

### Mistake 23: Hard-coding environment values and secrets
**❌ Wrong:** API keys in `environment.ts` or components.
**🤔 Why it is a problem:** Everything in the bundle is public; rebuild needed per environment.

**✅ Correct:** Public config via runtime `config.json`/server injection; secrets only on the server; build once, deploy many.
**💬 Say:** "The frontend bundle is public by definition."

---

### Mistake 24: Testing implementation details
**❌ Wrong:** Asserting private methods, internal fields, or using brittle CSS selectors.
**🤔 Why it is a problem:** Tests break on refactors without behavior changes.

**✅ Correct:** Test behavior via the DOM/harnesses, mock services at boundaries, use `HttpTestingController`, and `fakeAsync` for time.
**💬 Say:** "Tests describe what users and consumers observe."

---

### Mistake 25: Ignoring `ng update` and letting versions drift
**❌ Wrong:** Staying several majors behind.
**🤔 Why it is a problem:** Security/performance fixes missed; upgrade cost multiplies; libraries stop supporting you.

**✅ Correct:** Upgrade regularly, one major at a time, with migrations and CI checks.
**💬 Say:** "Small frequent upgrades beat big-bang migrations."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you explain Angular. A junior lists features. A senior explains **change detection, DI, RxJS/signals, architecture, performance and upgrade strategy** with real examples.
> **What should you do?** Practice the "Strong" style for every answer.

### Signal 1: You explain change detection precisely
| | Example answer |
|---|---|
| ❌ Weak | "Angular checks for changes automatically." |
| ✅ Strong | "With zone.js, async tasks notify Angular, which runs `tick()` and dirty-checks bindings from the root. OnPush views are skipped unless an input reference changes, an event fires, an `async` pipe or signal read in the template updates, or `markForCheck` is called. In zoneless apps, signal updates and listeners notify a scheduler instead. I use OnPush with signals and immutable updates." |
**Prove it:** zone vs zoneless, OnPush triggers, NG0100.

### Signal 2: You choose between signals and RxJS deliberately
| | Example answer |
|---|---|
| ❌ Weak | "I use observables for everything." |
| ✅ Strong | "State and derived values live in signals; async flows (HTTP, events, debouncing, cancellation) live in RxJS. I convert with `toSignal`/`toObservable` at the boundary and use `switchMap` for reads, `exhaustMap`/`concatMap` for writes." |
**Prove it:** the operator table and a typeahead example.

### Signal 3: You understand DI deeply
| | Example answer |
|---|---|
| ❌ Weak | "Services are injected in constructors." |
| ✅ Strong | "Injectors form a hierarchy: element injectors, route/environment injectors, root. `providedIn: 'root'` gives a tree-shakable singleton; component `providers` give per-instance state; lazy routes get their own injector. I use `inject()` in functional guards and interceptors, `InjectionToken` for config, and `multi` providers for plugins." |
**Prove it:** resolution order, NG0201/NG0203.

### Signal 4: You design scalable architecture
| | Example answer |
|---|---|
| ❌ Weak | "We have modules for features." |
| ✅ Strong | "Nx workspace with domain libraries split into feature, ui, data-access and util; enforced boundaries; standalone and lazy routes; smart/presentational split; shared design system; ADRs for state and rendering decisions." |
**Prove it:** workspace layout and rules.

### Signal 5: You measure and fix performance systematically
| | Example answer |
|---|---|
| ❌ Weak | "I add OnPush." |
| ✅ Strong | "I profile with Angular DevTools and Chrome, remove template function calls, add `track`, virtualize long lists, lazy-load routes and `@defer` heavy widgets, use SSR + hydration for LCP, and enforce bundle budgets. Initial JS dropped from 3.4 MB to 1.1 MB." |
**Prove it:** numbers and tools.

### Signal 6: You treat security as a server concern with client best practices
| | Example answer |
|---|---|
| ❌ Weak | "Guards protect our routes." |
| ✅ Strong | "Guards are UX; the API enforces authorization. Tokens are in HttpOnly cookies behind a BFF, with XSRF protection and CSP. I avoid `bypassSecurityTrust*`, sanitize HTML, and keep dependencies patched." |
**Prove it:** XSS, CSRF, token storage.

### Signal 7: You test at the right levels
| | Example answer |
|---|---|
| ❌ Weak | "We have some unit tests." |
| ✅ Strong | "Pure logic and services with unit tests, components with `TestBed` and harnesses, HTTP with `HttpTestingController`, RxJS time with marbles/`fakeAsync`, router with `RouterTestingHarness`, and Playwright for critical journeys." |
**Prove it:** specific tools.

### Signal 8: You lead upgrades and migrations
| | Example answer |
|---|---|
| ❌ Weak | "We update Angular sometimes." |
| ✅ Strong | "We upgrade each major with `ng update`, run migrations (standalone, control flow, `inject`, signal inputs), update libraries first, measure bundle size and CD cost, and roll out with canaries. We moved to zoneless after converting components to OnPush/signals." |
**Prove it:** schematics, metrics, plan.

### 🔊 Phrases that sound senior
- "What triggers change detection here, and is this view OnPush?"
- "That's a derived value, so it should be a `computed`."
- "Reads use `switchMap`; writes use `exhaustMap` or `concatMap`."
- "Guards are UX, the API must enforce authorization."
- "I'd track by id and virtualize that list."
- "We upgrade one major at a time with the schematics."

### 🚩 Phrases that sound junior
- "I subscribe in the component and assign a field." · "I call a function in the template." · "I use `any` for the response." · "We never upgraded because it works." · "Guards secure the app." · "I put all logic in the component."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Components, standalone, templates, control flow (`@if/@for/@defer`)**
2. **Data binding and component communication** (`input/output/model`, services)
3. **Dependency injection:** hierarchy, providers, `inject()`
4. **Lifecycle hooks** and cleanup
5. **Change detection:** Default vs OnPush, zone.js, zoneless
6. **Signals:** `signal`, `computed`, `effect`, `linkedSignal`, `toSignal`
7. **RxJS essentials:** `switchMap`/`mergeMap`/`concatMap`/`exhaustMap`, subjects, hot/cold, error handling
8. **Routing:** lazy loading, functional guards, resolvers
9. **Forms and HTTP:** typed reactive forms, validators, interceptors
10. **Performance, SSR/hydration, testing, upgrades**

## 18.2 Choose the right tool
| Need | Use |
|---|---|
| Local UI state | `signal` |
| Derived value | `computed` |
| Side effect | `effect` (rarely) |
| Parent → child data | `input()` |
| Child → parent event | `output()` |
| Two-way | `model()` |
| Shared feature state | Service with signals |
| Complex global state | NgRx / SignalStore |
| Async reads (search) | RxJS `switchMap` |
| Writes / submit | `exhaustMap` / `concatMap` |
| Observable in template | `async` pipe or `toSignal` |
| Long-lived subscription | `takeUntilDestroyed` |
| Lazy route | `loadComponent` / `loadChildren` |
| Lazy template part | `@defer` |
| Pre-fetch route data | `ResolveFn` |

## 18.3 Performance checklist
- [ ] OnPush + signals; immutable updates
- [ ] No function calls or heavy getters in templates
- [ ] `@for` with `track id`; virtual scroll for long lists
- [ ] Lazy routes; `@defer` heavy components; preloading
- [ ] Bundle budgets; analyze bundle; avoid big libraries
- [ ] `NgOptimizedImage`; SSR + hydration for first paint
- [ ] Debounce events; `runOutsideAngular` in zone apps
- [ ] Measure with Angular DevTools, Chrome Performance, Lighthouse

## 18.4 Security checklist
- [ ] Rely on default sanitization; avoid `bypassSecurityTrust*`
- [ ] Tokens in HttpOnly cookies; XSRF protection; CSP
- [ ] Server enforces authorization (guards are UX)
- [ ] No secrets in the bundle or `environment.ts`
- [ ] Dependency audits and regular `ng update`

## 18.5 Testing checklist
- [ ] Unit tests for services/pipes/utils
- [ ] Component tests with `TestBed` and harnesses
- [ ] `HttpTestingController` for APIs; `fakeAsync` / marbles for time
- [ ] Router tests with `RouterTestingHarness`
- [ ] Playwright/Cypress for critical flows
- [ ] CI with caching and affected-only runs (Nx)

## 18.6 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| NG0100 | Value changed during CD | Move updates earlier/asynchronously; stable getters |
| NG0201 | Missing provider | `providedIn: 'root'` / add provider / `provideHttpClient()` |
| NG0203 | `inject()` outside context | Call in constructor/field init or `runInInjectionContext` |
| NG0303/0304 | Missing `imports` | Add component/module to `imports` |
| NG0600 | Writing signal in `computed` | Move to handler/effect; use `linkedSignal` |
| OnPush not updating | Mutation | Immutable update / signal / `markForCheck` |
| Duplicate HTTP calls | Multiple subscriptions | `as` alias, `shareReplay`, `toSignal` |
| Request not sent | Not subscribed | Subscribe or use `async`/`toSignal` |
| Memory leak | Active subscriptions | `takeUntilDestroyed`, `async` pipe |
| 404 on refresh | No SPA fallback | Server rewrite to `index.html` |
| `window is not defined` | SSR | `isPlatformBrowser`, `afterNextRender` |
| Hydration mismatch | DOM differs | Deterministic render; avoid manual DOM |
| Bundle too big | Eager imports | Lazy routes, `@defer`, remove libs |

## 18.7 30-second answers
- **What is Angular?** A TypeScript framework for SPAs with DI, routing, forms, HTTP and a CLI.
- **Standalone vs NgModule?** Standalone components import their own dependencies; NgModules grouped declarations. Standalone is the default now.
- **Signals vs RxJS?** Signals for synchronous state and derived values; RxJS for asynchronous streams and complex flows.
- **OnPush?** Only checks when inputs change, events fire, signals/async pipe emit, or `markForCheck` is called.
- **DI?** Angular supplies instances from a hierarchy of injectors; `providedIn: 'root'` makes singletons.
- **`switchMap` vs `mergeMap`?** `switchMap` cancels the previous inner stream; `mergeMap` runs all in parallel.
- **How to avoid leaks?** `async` pipe, `toSignal`, `takeUntilDestroyed`.
- **How do you lazy load?** `loadComponent`/`loadChildren`, `@defer`.
- **What is SSR hydration?** Server-rendered HTML is reused in the browser; event replay and incremental hydration reduce startup JS.
- **Guards security?** UX only; enforce authorization on the server.

## 18.8 Last-minute checklist before the interview
- [ ] I can explain change detection (zone.js, OnPush, signals, zoneless) clearly.
- [ ] I can write a standalone component with signal inputs/outputs, `@if/@for`, and OnPush.
- [ ] I can write a functional guard, an interceptor, and a typed reactive form with a custom validator.
- [ ] I can explain RxJS flattening operators and write a typeahead.
- [ ] I can explain DI resolution and provider types.
- [ ] I can compare state options (signals, services, NgRx) and justify a choice.
- [ ] I have two stories with numbers (performance improvement; migration or tricky bug).
- [ ] I know the key modern changes (standalone default, control flow, signals, zoneless, SSR/hydration, upgrade policy).
