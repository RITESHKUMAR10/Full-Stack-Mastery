# TypeScript Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Covers **TypeScript 5.x**. Features from newer versions are marked with the version number, because interviewers like to ask "when was this added?" and because some need a recent compiler.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/type challenges · Debugging (compiler errors) · Scenario · Architecture · Rapid-fire · Project/behavioral · "What is the type?" · MCQ
>
> **Golden rule:** TypeScript exists **only at compile time**. Types are erased before the code runs. Every strong TypeScript answer separates **"what the compiler knows"** from **"what really happens at runtime"**.

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Type Challenges](#-part-6-coding--type-challenges)
- [Part 7: Debugging Scenarios (Compiler Errors)](#-part-7-debugging-scenarios-compiler-errors)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Classic + Config + Framework Typing + Interop)](#-part-11-complete-coverage-classic--config--framework-typing--interop)
- [Part 12: Compiler Internals](#-part-12-compiler-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: "What Is the Type?" and Output Questions](#-part-14-what-is-the-type-and-output-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is TypeScript? Why do we use it? *(Conceptual)*
**Answer:** TypeScript is a **typed superset of JavaScript** made by Microsoft. Every valid JavaScript program is valid TypeScript. TypeScript adds a **static type system**. The compiler (`tsc`) checks types and then **removes** them, producing plain JavaScript.

**Benefits:**
- Finds bugs at **compile time** (typos, wrong arguments, `undefined` access)
- Better **editor support** (autocomplete, rename, go-to-definition, refactoring)
- Types work as **documentation** for functions and APIs
- Safer refactoring in big codebases and teams

**Costs:** build step, learning curve, extra code, and types can be wrong or complex.
```ts
function add(a: number, b: number): number { return a + b; }
add(1, '2');   // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

### Q2. TypeScript vs JavaScript: what is the difference? *(Comparison)*
| | JavaScript | TypeScript |
|---|---|---|
| Typing | Dynamic | Static (checked at compile time) |
| Errors found | At run time | Mostly at compile time |
| Runs in browser/Node directly | ✅ | ❌ (compile first, or strip types in new runtimes) |
| Extra features | — | Types, interfaces, enums, generics, decorators |
| Tooling | Good | Excellent (IDE intelligence) |
**Important:** TypeScript does **not** change how JavaScript behaves at run time and does **not** add runtime type checks.

### Q3. What are the basic types?
```ts
let name: string = 'Ritesh';
let age: number = 30;               // integers and floats share one type
let active: boolean = true;
let big: bigint = 100n;
let id: symbol = Symbol('id');
let nothing: null = null;
let notSet: undefined = undefined;
let list: number[] = [1, 2, 3];     // or Array<number>
let pair: [string, number] = ['a', 1];   // tuple
let anything: any = 'could be anything';
let safe: unknown = JSON.parse('1');
function log(msg: string): void { console.log(msg); }      // returns nothing
function fail(msg: string): never { throw new Error(msg); } // never returns
```

### Q4. What is type inference? When should you write types yourself?
TypeScript can **infer** types from values.
```ts
let n = 10;                  // inferred: number
const s = 'hello';           // inferred: 'hello' (literal type, because const)
const nums = [1, 2, 3];      // number[]
function double(x: number) { return x * 2; }   // return type inferred: number
```
**Guideline:** let inference work for local variables. **Write types** for function parameters, exported function return types, public APIs, and when the inferred type is too wide or wrong.

### Q5. `any` vs `unknown` vs `never`: what is the difference? *(Must-know)*
| | `any` | `unknown` | `never` |
|---|---|---|---|
| Meaning | Turn off type checking | A value of unknown type | A value that can never exist |
| Assign anything to it | ✅ | ✅ | ❌ |
| Use it without checks | ✅ (unsafe) | ❌ must narrow first | — |
| Assign it to other types | ✅ | ❌ (only to `unknown`/`any`) | ✅ (to everything) |
```ts
let a: any = 'x';  a.foo.bar();              // no error (crashes at runtime)
let u: unknown = 'x';
// u.toUpperCase();                           // ❌ Error: 'u' is of type 'unknown'
if (typeof u === 'string') u.toUpperCase();   // ✅ after narrowing
function fail(): never { throw new Error('x'); }
```
**Rule:** prefer `unknown` over `any` for values you do not control (API data, `catch` variables).

### Q6. `interface` vs `type`: what is the difference? *(Must-know, Comparison)*
```ts
interface User { id: number; name: string; }
type UserT = { id: number; name: string };
```
| | `interface` | `type` alias |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions, tuples, primitives, mapped/conditional types | ❌ | ✅ |
| Extend | `extends` | `&` (intersection) |
| **Declaration merging** (same name declared twice) | ✅ | ❌ (error) |
| `implements` in classes | ✅ | ✅ (object types) |
| Error messages / performance with big hierarchies | Often better | Fine |
**Common rule:** use `interface` for object shapes that may be extended (public APIs, classes); use `type` for unions, tuples, utility/mapped/conditional types. Be consistent in the team.

### Q7. Union and intersection types
```ts
type Id = string | number;                 // union: one OR the other
function show(id: Id) { /* id is string | number */ }
type Admin = User & { role: 'admin' };     // intersection: BOTH shapes combined
type Status = 'idle' | 'loading' | 'error'; // literal union (like an enum)
```

### Q8. Optional, readonly and index signatures
```ts
interface Config {
  readonly apiUrl: string;       // cannot be re-assigned (compile-time only)
  timeout?: number;              // optional: number | undefined
  [key: string]: unknown;        // index signature: any extra string keys
}
const c: Config = { apiUrl: '/api' };
// c.apiUrl = '/x';              // ❌ Cannot assign to 'apiUrl' because it is a read-only property
```
`readonly` does **not** exist at run time. It is only a compile-time check.

### Q9. Typing functions
```ts
function greet(name: string, greeting = 'Hello', ...tags: string[]): string {
  return `${greeting}, ${name}`;
}
const add = (a: number, b: number): number => a + b;
type Handler = (event: string, payload?: unknown) => void;     // function type
function parse(input: string): number;                          // overload signature
function parse(input: number): string;
function parse(input: string | number) { return typeof input === 'string' ? Number(input) : String(input); }
```

### Q10. Enums: what are they? Are they a good idea?
```ts
enum Direction { Up, Down, Left, Right }          // numeric: 0, 1, 2, 3
enum Role { Admin = 'ADMIN', User = 'USER' }      // string enum
Direction.Up;       // 0
Direction[0];       // 'Up' (reverse mapping, numeric enums only)
```
Enums create **real JavaScript objects** (runtime code). Many teams prefer a **const object + union type** because it is plain JavaScript and works with type-stripping tools:
```ts
const Role = { Admin: 'ADMIN', User: 'USER' } as const;
type Role = (typeof Role)[keyof typeof Role];    // 'ADMIN' | 'USER'
```
`const enum` is inlined at compile time but causes problems with `isolatedModules` and some build tools.

### Q11. What is a type assertion (`as`)? How is it different from a cast?
```ts
const el = document.getElementById('app') as HTMLDivElement;
const n = (value as unknown) as number;      // double assertion (dangerous)
```
An assertion **tells the compiler** "trust me". It does **not** convert the value or check it at run time (unlike a cast in Java/C#). If you are wrong, you get a runtime error. Prefer narrowing or a runtime check (type guard, schema validation).

### Q12. The non-null assertion operator `!`
```ts
const input = document.querySelector('#name')!;   // tells TS it is not null
input.value;                                       // may still crash at run time if it is null
```
`!` removes `null | undefined` from the type but adds no runtime check. Use sparingly. Prefer `if (!input) throw ...` or optional chaining.

### Q13. What is type narrowing? Name the ways.
The compiler narrows a wide type to a narrower one using control flow.
```ts
function format(v: string | number | Date | null) {
  if (v === null) return 'none';                   // equality
  if (typeof v === 'string') return v.trim();       // typeof
  if (typeof v === 'number') return v.toFixed(2);
  return v.toISOString();                           // v is Date here
}
// instanceof:   if (err instanceof Error) err.message
// in operator:  if ('swim' in animal) animal.swim()
// truthiness:   if (value) { ... }
// Array.isArray(x)
// discriminated union: switch (shape.kind) { ... }
// user-defined guard: function isFish(a: Animal): a is Fish { ... }
```

### Q14. Literal types and `as const`
```ts
let a = 'hi';                       // string
const b = 'hi';                     // 'hi'
const cfg = { mode: 'dark', sizes: [1, 2] } as const;
// type: { readonly mode: 'dark'; readonly sizes: readonly [1, 2] }
type Mode = typeof cfg.mode;        // 'dark'
```
`as const` makes everything `readonly` and keeps literal types. Great for config objects and enum-like values.

### Q15. Classes in TypeScript
```ts
abstract class Shape {
  constructor(public readonly name: string) {}         // parameter property
  abstract area(): number;
  describe() { return `${this.name}: ${this.area()}`; }
}
class Circle extends Shape {
  #secret = 1;                                         // real JS private field
  private cache?: number;                              // compile-time private
  constructor(private radius: number) { super('circle'); }
  override area() { return Math.PI * this.radius ** 2; }
}
```
Modifiers: `public` (default), `private`, `protected`, `readonly`, `static`, `abstract`, `override`. TypeScript's `private` is **compile-time only**; `#private` is truly private at run time.

### Q16. Generics: what are they?
Generics let you write reusable code that works with many types while keeping type safety.
```ts
function identity<T>(value: T): T { return value; }
identity<string>('a');      // explicit
identity(42);               // T inferred as number

interface Box<T> { value: T; }
const b: Box<string[]> = { value: ['a'] };

function first<T>(arr: T[]): T | undefined { return arr[0]; }
```

### Q17. What are utility types? Name common ones.
```ts
type User = { id: number; name: string; email?: string };
Partial<User>;               // all optional
Required<User>;              // all required
Readonly<User>;              // all readonly
Pick<User, 'id' | 'name'>;   // only those keys
Omit<User, 'email'>;         // everything except
Record<string, number>;      // object with string keys and number values
Exclude<'a' | 'b', 'a'>;     // 'b'
Extract<'a' | 'b', 'a'>;     // 'a'
NonNullable<string | null>;  // string
ReturnType<typeof fn>;       // function return type
Parameters<typeof fn>;       // tuple of parameter types
Awaited<Promise<number>>;    // number
```

### Q18. What is `tsconfig.json`? Which options matter most?
It configures the compiler and marks the project root.
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "outDir": "dist",
    "sourceMap": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```
**Most important:** `strict` (turn it on!), `target`, `module`/`moduleResolution`, `lib`, `jsx`, `outDir`, `paths`, `skipLibCheck`, `isolatedModules`.

### Q19. What does `strict: true` enable?
A group of flags: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `useUnknownInCatchVariables` (and newer strict flags added over time). The two most impactful: **`noImplicitAny`** (no silent `any`) and **`strictNullChecks`** (`null`/`undefined` are separate types, so you must handle them).

### Q20. What are `strictNullChecks`?
Without it, `null` and `undefined` can be assigned to any type. With it, they are only allowed where you declare them.
```ts
let s: string = null;              // ❌ with strictNullChecks
let t: string | null = null;       // ✅
function len(x: string | undefined) { return x.length; }   // ❌ 'x' is possibly 'undefined'
```

### Q21. How do you compile and run TypeScript?
```bash
npm i -D typescript
npx tsc --init          # create tsconfig.json
npx tsc                 # compile the project
npx tsc --noEmit        # type-check only (common in CI)
npx tsc --watch
```
Common ways to run: compile with `tsc` then run with Node; use `tsx` or `ts-node` for development; bundlers (Vite, esbuild, SWC) strip types and **do not type-check** (so run `tsc --noEmit` separately). Recent Node versions can run `.ts` files by stripping types (only "erasable" syntax: no enums, namespaces, or parameter properties). Check your Node version.

### Q22. What is a `.d.ts` file? What is `@types`?
A **declaration file** contains only types (no code). It describes the shape of JavaScript code so TypeScript can check usage. `@types/xyz` packages (from DefinitelyTyped) provide types for libraries that do not ship their own.
```bash
npm i -D @types/node @types/react
```
Modern libraries include their own types (`"types"` field in `package.json`).

### Q23. Optional chaining, nullish coalescing and narrowing with them
```ts
const city = user?.address?.city ?? 'Unknown';
user.onUpdate?.(data);
```
TypeScript understands these operators and narrows types. `??` only replaces `null`/`undefined`.

### Q24. How do you type objects, arrays and tuples?
```ts
const user: { id: number; name: string; tags?: string[] } = { id: 1, name: 'Ritesh' };
const matrix: number[][] = [[1, 2], [3, 4]];
const roUsers: readonly User[] = [];                  // cannot push
const point: [x: number, y: number] = [10, 20];       // labeled tuple
const rest: [string, ...number[]] = ['a', 1, 2, 3];   // variadic tuple
```

### Q25. How do you import and export types?
```ts
// types.ts
export interface User { id: number }
export type Id = string | number;
// app.ts
import type { User, Id } from './types';    // erased completely at compile time
import { type Config, loadConfig } from './config';
```
Use `import type` to make clear it is type-only and to avoid accidental runtime imports (required with `verbatimModuleSyntax`).

### Q26. Does TypeScript check types at run time?
**No.** Types are erased. Data from outside (API responses, `JSON.parse`, forms, `localStorage`) must be validated at run time with a schema library (Zod, Valibot) or custom guards.
```ts
const data = (await res.json()) as User;     // ❌ compile-time lie, no validation
```

### Q27. `void` vs `undefined` vs `never` for functions
`void` = the function does not return a useful value. `undefined` = returns the value `undefined`. `never` = never returns (throws or loops forever).

### Q28. What is the difference between `object`, `Object` and `{}`?
- `object`: any **non-primitive** (no strings, numbers).
- `Object`: anything that has `Object.prototype` members (includes primitives!). Avoid.
- `{}`: any value except `null` and `undefined` (includes primitives). Avoid for "object".
Prefer `Record<string, unknown>` or a specific interface.

### Q29. Type vs value namespaces
In TypeScript, names live in two worlds: **types** (erased) and **values** (kept). A `class` is both a type and a value. An `interface` is only a type. An `enum` is both. A `const` is a value.
```ts
const User = { make: () => ({ id: 1 }) };
type User = { id: number };            // same name, allowed: different worlds
```

### Q30. What are the common compiler errors beginners see?
- `TS2322` Type 'X' is not assignable to type 'Y'
- `TS2339` Property 'x' does not exist on type 'Y'
- `TS7006` Parameter implicitly has an 'any' type
- `TS2532 / TS18048` Object is possibly 'undefined'
- `TS2307` Cannot find module
(More in Part 7.)

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Generic constraints and `keyof`
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }
const user = { id: 1, name: 'Ritesh' };
getProp(user, 'name');       // string
// getProp(user, 'age');     // ❌ '"age"' is not assignable to '"id" | "name"'

function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }
```
`T extends X` limits what types are allowed. `keyof T` gives the union of keys.

### Q32. Discriminated unions *(Very important)*
A union where each member has a **common literal property** (the discriminant), so the compiler can narrow.
```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rect'; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.size ** 2;
    case 'rect': return s.w * s.h;
    default: { const _exhaustive: never = s; return _exhaustive; }   // compile error if a case is missing
  }
}
```
Great for state (`loading | success | error`), Redux actions, API results.

### Q33. User-defined type guards and assertion functions
```ts
function isString(x: unknown): x is string { return typeof x === 'string'; }
function assertIsDefined<T>(x: T | undefined | null, msg = 'Missing'): asserts x is T {
  if (x == null) throw new Error(msg);
}
const raw: unknown = getInput();
if (isString(raw)) raw.toUpperCase();
```
`x is T` tells the compiler how to narrow when the function returns `true`. `asserts x is T` narrows after the call if it does not throw. Since TS 5.5 many simple guards are **inferred** automatically (e.g., `arr.filter(x => x !== undefined)` narrows).

### Q34. `satisfies` operator (TS 4.9)
Checks that a value matches a type **without widening** the value's inferred type.
```ts
type Palette = Record<string, [number, number, number] | string>;
const colors = { red: [255, 0, 0], green: '#00ff00' } satisfies Palette;
colors.red.map((n) => n);        // ✅ still known as a tuple, not string | tuple
colors.green.toUpperCase();      // ✅ known as string
```
With `: Palette` the property types would be widened to the union and you would lose precision.

### Q35. Function overloads vs union types vs generics
Use **overloads** when different argument types give different return types and the relation is not expressible otherwise. Use **unions** for simple cases. Use **generics** when the output type is a function of the input type.
```ts
function pad(v: string): string;
function pad(v: number): number;
function pad(v: string | number) { return v; }
// often better:
function identity<T extends string | number>(v: T): T { return v; }
```

### Q36. Structural typing (duck typing) and excess property checks
TypeScript compares **shape**, not names.
```ts
interface Point { x: number; y: number }
const p3 = { x: 1, y: 2, z: 3 };
const p: Point = p3;                       // ✅ extra property is fine (not a fresh literal)
const q: Point = { x: 1, y: 2, z: 3 };     // ❌ excess property check applies to fresh object literals
```
Two types with the same shape are compatible even if they have different names.

### Q37. Type compatibility and function parameter rules
A function with **fewer parameters** is assignable to one with more. Return types are **covariant**; parameter types are **contravariant** (with `strictFunctionTypes`).
```ts
type Cb = (a: string, b: number) => void;
const f1: Cb = (a) => {};                // ✅ fewer params
// const f2: Cb = (a, b, c) => {};       // ❌ more params
type Handler = (e: MouseEvent) => void;
// const h: Handler = (e: Event) => {};  // ✅ OK: Event is wider (contravariance)
```

### Q38. Mapped types
```ts
type Optional<T> = { [K in keyof T]?: T[K] };           // like Partial
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // remove readonly
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
type G = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
```
Modifiers: `+/-readonly`, `+/-?`. Key remapping with `as`.

### Q39. Conditional types and `infer`
```ts
type IsString<T> = T extends string ? true : false;
type ElementType<T> = T extends (infer U)[] ? U : T;
type Ret<F> = F extends (...args: any[]) => infer R ? R : never;
type A = ElementType<number[]>;      // number
```
Conditional types **distribute** over unions: `IsString<string | number>` is `boolean` (`true | false`).

### Q40. Template literal types
```ts
type Lang = 'en' | 'hi';
type Key = `title_${Lang}`;            // 'title_en' | 'title_hi'
type Event = `on${Capitalize<'click' | 'hover'>}`;    // 'onClick' | 'onHover'
type Path = `/api/${string}`;
```
Built-in helpers: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

### Q41. Indexed access types and `typeof`/`keyof typeof`
```ts
type User = { id: number; name: string; tags: string[] };
type Name = User['name'];                // string
type Tag = User['tags'][number];         // string
const routes = { home: '/', about: '/about' } as const;
type RouteName = keyof typeof routes;    // 'home' | 'about'
type RoutePath = (typeof routes)[RouteName];   // '/' | '/about'
```

### Q42. Declaration merging and module augmentation
Interfaces with the same name **merge**.
```ts
interface Window { appVersion: string }       // adds to the global Window
// Extend a library's types:
declare module 'express-serve-static-core' {
  interface Request { user?: { id: string } }
}
export {};     // makes the file a module
```
Use `declare global { ... }` inside a module file for global additions.

### Q43. `readonly` arrays and immutability helpers
```ts
function sum(nums: readonly number[]) { return nums.reduce((a, b) => a + b, 0); }
const arr = [1, 2] as const;             // readonly [1, 2]
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };
```
Accepting `readonly T[]` in function parameters is a good habit: callers can pass both mutable and readonly arrays.

### Q44. Typing async code and Promises
```ts
async function getUser(id: number): Promise<User> { /* ... */ }
const results: User[] = await Promise.all(ids.map(getUser));
type Resolved = Awaited<ReturnType<typeof getUser>>;     // User
```
Use `Promise<void>` for async functions without a value. `async` functions always return a `Promise`.

### Q45. Typing `catch` variables and errors
With `useUnknownInCatchVariables` (part of `strict`), `catch (e)` is `unknown`.
```ts
try { risky(); }
catch (e) {
  if (e instanceof Error) console.error(e.message);
  else console.error('Unknown error', e);
}
```
Custom error classes: `class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }`.

### Q46. Typing DOM and events
```ts
const input = document.querySelector<HTMLInputElement>('#email');
input?.addEventListener('input', (e) => {
  const value = (e.target as HTMLInputElement).value;
});
function onClick(e: MouseEvent) { /* ... */ }
```
`querySelector<T>` and `getElementById` return `T | null`, so handle `null`.

### Q47. `Object.keys`, `Object.entries` and typing
`Object.keys(obj)` returns `string[]`, **not** `(keyof T)[]`, because objects can have extra properties at run time. If you are sure:
```ts
const keys = Object.keys(user) as Array<keyof typeof user>;
```
Or write a helper `function keys<T extends object>(o: T) { return Object.keys(o) as Array<keyof T>; }`.

### Q48. Abstract classes vs interfaces
An **interface** is a pure type (erased). An **abstract class** can contain implemented methods and state and exists at run time (usable with `instanceof`). Use interfaces for contracts, abstract classes for shared base behavior.

### Q49. `enum` vs union of literals vs `const` object
| | Runtime code | Reverse mapping | Works with type-stripping | Tree-shaking |
|---|---|---|---|---|
| `enum` | Yes | Numeric only | ❌ (not erasable) | Weak |
| `const enum` | Inlined | — | ❌ with isolatedModules | — |
| Union of literals | No | — | ✅ | ✅ |
| `as const` object + union | Yes (plain object) | — | ✅ | ✅ |

### Q50. Index signatures vs `Record` vs mapped types
```ts
type A = { [key: string]: number };
type B = Record<string, number>;                 // same thing
type C = Record<'a' | 'b', number>;              // { a: number; b: number }
```
`Record<'a' | 'b', T>` forces all keys; an index signature allows any keys. With `noUncheckedIndexedAccess`, index access returns `T | undefined`.

### Q51. Typing React components (quick)
```tsx
type ButtonProps = { label: string; onClick?: () => void; variant?: 'primary' | 'ghost' } & React.ComponentProps<'button'>;
function Button({ label, variant = 'primary', ...rest }: ButtonProps) { return <button {...rest}>{label}</button>; }
const [user, setUser] = useState<User | null>(null);
```
Prefer typing props with a `type`/`interface`, and use `React.ComponentProps<'button'>` to extend native element props.

### Q52. How do you type `this`?
```ts
function click(this: HTMLButtonElement, e: MouseEvent) { this.disabled = true; }
class Counter { count = 0; inc = () => { this.count++; }; }     // arrow keeps this
```
Enable `noImplicitThis` (in `strict`).

### Q53. Type-only vs value imports and `isolatedModules`
With `isolatedModules` each file is transpiled alone, so the compiler cannot know if `import { Foo } from './x'` is a type or value. Use `import type` / `export type` for types. `verbatimModuleSyntax` enforces this: imports without the `type` modifier are kept as-is.

### Q54. Triple-slash directives and ambient declarations
```ts
/// <reference types="node" />
declare const __APP_VERSION__: string;      // injected by a bundler
declare function gtag(...args: unknown[]): void;
declare module '*.svg' { const src: string; export default src; }
```
`declare` says "this exists at run time; I only describe its type".

### Q55. Namespaces vs modules
Namespaces (`namespace Foo {}`) are an old TypeScript feature. Use **ES modules** (`import/export`) instead. Namespaces still appear in `.d.ts` files and merging patterns. They are not "erasable" syntax.

---

# 🟡 Part 3: Mid (3–5 years)

### Q56. Advanced generics: defaults, constraints, inference
```ts
interface ApiResponse<T = unknown, E = Error> { data?: T; error?: E }
function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] { return items.map((i) => i[key]); }
const names = pluck([{ id: 1, name: 'a' }], 'name');     // string[]
function createStore<S, A extends { type: string }>(reducer: (s: S, a: A) => S, init: S) { /* ... */ }
```
TypeScript infers generics from arguments. Provide explicit type arguments only when inference fails or is too wide. `const` type parameters (TS 5.0) keep literal types:
```ts
function tuple<const T extends readonly unknown[]>(x: T) { return x; }
tuple(['a', 1]);       // readonly ['a', 1]
```

### Q57. `infer` in depth
```ts
type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer R ? R :
  T extends Promise<infer P> ? P : T;
type FirstArg<F> = F extends (first: infer A, ...rest: any[]) => any ? A : never;
type LastOf<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;
type Params<T extends string> = T extends `${string}:${infer P}/${infer Rest}` ? P | Params<`/${Rest}`> : T extends `${string}:${infer P}` ? P : never;
type X = Params<'/users/:id/posts/:postId'>;     // 'id' | 'postId'
```

### Q58. Distributive vs non-distributive conditional types
A conditional type over a **naked type parameter** distributes over a union.
```ts
type ToArray<T> = T extends any ? T[] : never;
type A = ToArray<string | number>;       // string[] | number[]
type ToArray2<T> = [T] extends [any] ? T[] : never;
type B = ToArray2<string | number>;      // (string | number)[]
```
Wrapping in a tuple `[T]` stops distribution. `never` is the empty union, so `ToArray<never>` is `never`.

### Q59. Key remapping and filtering keys
```ts
type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };
type RemoveId<T> = { [K in keyof T as Exclude<K, 'id'>]: T[K] };
type Setters<T> = { [K in keyof T as `set${Capitalize<string & K>}`]: (v: T[K]) => void };
```

### Q60. Recursive and helper types
```ts
type DeepPartial<T> = T extends (...a: any[]) => any ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
type Prettify<T> = { [K in keyof T]: T[K] } & {};            // flatten intersections in tooltips
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };
```

### Q61. Variance: covariance, contravariance, bivariance
- **Covariant** (output positions): `Dog[]` is assignable to `Animal[]`.
- **Contravariant** (input positions, with `strictFunctionTypes`): `(a: Animal) => void` is assignable to `(a: Dog) => void`, not the reverse.
- **Method shorthand** parameters are **bivariant** (looser) for historical reasons.
- Explicit variance annotations (TS 4.7): `interface Producer<out T> {}`, `interface Consumer<in T> {}`.
```ts
interface Animal { name: string } interface Dog extends Animal { bark(): void }
let animals: Animal[] = [];
let dogs: Dog[] = [];
animals = dogs;      // ✅ allowed (arrays are covariant, unsound for writes)
```

### Q62. Branded (opaque) types
Make structurally identical types incompatible.
```ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
const toUserId = (s: string) => s as UserId;
function getUser(id: UserId) {}
// getUser('abc');                      // ❌ string is not UserId
// getUser(orderId);                    // ❌ OrderId is not UserId
getUser(toUserId('abc'));               // ✅
```
Use validation functions to create branded values safely.

### Q63. Exhaustiveness checking with `never`
```ts
function assertNever(x: never): never { throw new Error(`Unexpected value: ${JSON.stringify(x)}`); }
// Adding a new union member makes the compile fail until every switch handles it.
```

### Q64. Runtime validation vs static types (Zod, Valibot)
Types vanish at run time, so external data must be validated.
```ts
import { z } from 'zod';
const UserSchema = z.object({ id: z.number(), name: z.string().min(1), email: z.string().email().optional() });
type User = z.infer<typeof UserSchema>;       // static type derived from the schema
const user = UserSchema.parse(await res.json());          // throws if invalid
const safe = UserSchema.safeParse(data);                   // { success, data | error }
```
One schema = one source of truth for both validation and the type.

### Q65. Module resolution and `moduleResolution` modes
- `node10` (old "node"): CommonJS style, no `exports` map.
- `node16` / `nodenext`: follows Node's ESM rules (file extensions required in relative imports, `exports` maps respected, `"type": "module"`).
- `bundler` (TS 5.0): for Vite/webpack/esbuild: supports `exports` maps without requiring extensions.
Match `module` and `moduleResolution` to how your code really runs.

### Q66. `esModuleInterop` and `allowSyntheticDefaultImports`
They make `import fs from 'fs'` and `import React from 'react'` work with CommonJS modules that use `module.exports =`. Without `esModuleInterop` you would write `import * as fs from 'fs'`. Keep it on.

### Q67. Writing declaration files for a JS library
```ts
// my-lib.d.ts
declare module 'my-lib' {
  export interface Options { retries?: number }
  export function connect(url: string, options?: Options): Promise<Connection>;
  export default class Client { constructor(url: string); close(): void }
}
```
For your own package set `"types": "dist/index.d.ts"` and `"declaration": true`.

### Q68. `@ts-ignore` vs `@ts-expect-error` vs `@ts-nocheck`
- `// @ts-ignore`: suppress the next line's error (silently stays even after the error is fixed).
- `// @ts-expect-error`: suppress and **fail the build if there is no error** (preferred, for known issues and tests of types).
- `// @ts-nocheck`: disable checking for the whole file (use only in migrations).
Always add a comment explaining why.

### Q69. Decorators (TS 5.0 standard vs legacy)
TS 5.0 supports the **standard (TC39) decorators** without a flag. The older `experimentalDecorators` behavior is still used by Angular and NestJS. They are different, so check which one your framework needs.
```ts
function log<This, Args extends unknown[], R>(target: (this: This, ...args: Args) => R, ctx: ClassMethodDecoratorContext) {
  return function (this: This, ...args: Args): R { console.log(`call ${String(ctx.name)}`); return target.call(this, ...args); };
}
class Svc { @log run() { return 1; } }
```

### Q70. Mixins and composition patterns
```ts
type Constructor<T = {}> = new (...args: any[]) => T;
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base { createdAt = new Date(); };
}
class User { constructor(public name: string) {} }
const TimestampedUser = Timestamped(User);
```
Prefer composition (functions/objects) over deep class inheritance.

### Q71. A type-safe event emitter
```ts
type EventMap = { login: { userId: string }; logout: undefined };
class Emitter<E extends Record<string, unknown>> {
  private handlers = new Map<keyof E, Set<(payload: any) => void>>();
  on<K extends keyof E>(event: K, fn: (payload: E[K]) => void) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn);
    return () => this.handlers.get(event)?.delete(fn);
  }
  emit<K extends keyof E>(event: K, payload: E[K]) { this.handlers.get(event)?.forEach((fn) => fn(payload)); }
}
const bus = new Emitter<EventMap>();
bus.on('login', ({ userId }) => console.log(userId));
bus.emit('login', { userId: '1' });
// bus.emit('login', 5);      // ❌ compile error
```

### Q72. Type-safe API client patterns
```ts
type Endpoints = {
  'GET /users': { response: User[] };
  'POST /users': { body: NewUser; response: User };
};
async function request<K extends keyof Endpoints>(
  route: K,
  ...args: Endpoints[K] extends { body: infer B } ? [body: B] : []
): Promise<Endpoints[K]['response']> { /* fetch ... */ return undefined as never; }
```
Alternatives: generate types from OpenAPI/GraphQL (openapi-typescript, GraphQL Code Generator), or tRPC for end-to-end types.

### Q73. `unique symbol`, `keyof` with symbols, and `PropertyKey`
`PropertyKey` is `string | number | symbol`. Use `K extends PropertyKey` for generic keys. `unique symbol` types create opaque keys and branded values.

### Q74. Strict flags beyond `strict`
- `noUncheckedIndexedAccess`: `arr[i]` is `T | undefined`.
- `exactOptionalPropertyTypes`: `a?: number` does not allow `undefined` explicitly.
- `noImplicitOverride`: must write `override`.
- `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `noUnusedLocals/Parameters`.
- `verbatimModuleSyntax`, `erasableSyntaxOnly` (TS 5.8: disallow non-erasable syntax like enums and namespaces).

### Q75. ESLint with TypeScript
Use `typescript-eslint` with type-aware rules: `no-floating-promises`, `no-misused-promises`, `no-unsafe-assignment`, `no-explicit-any`, `consistent-type-imports`, `switch-exhaustiveness-check`, `prefer-nullish-coalescing`. They catch many runtime bugs the compiler allows.

### Q76. Project references and incremental builds
```json
{ "compilerOptions": { "composite": true, "incremental": true }, "references": [{ "path": "../shared" }] }
```
`tsc -b` builds projects in order and only rebuilds what changed. Useful for monorepos.

### Q77. `isolatedModules`, transpile-only tools and type checking
Vite, esbuild and SWC remove types per file without type information, so **they do not report type errors**. Run `tsc --noEmit` in CI and in a separate watch process. `isolatedModules` makes the compiler warn about code that cannot be transpiled safely per file.

### Q78. TypeScript with Node.js and Express
```ts
import express, { Request, Response, NextFunction } from 'express';
const app = express();
app.get('/users/:id', (req: Request<{ id: string }>, res: Response<User | { error: string }>) => {
  res.json({ id: Number(req.params.id), name: 'Ritesh' });
});
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => { res.status(500).json({ error: err.message }); });
```
Install `@types/node` and `@types/express`. Type `process.env` safely by validating it with a schema at startup.


---

# 🟠 Part 4: Senior (5–7 years)

### Q79. How do you keep type-checking fast in a big codebase? *(Performance)*
Symptoms: slow editor, `tsc` takes minutes. Diagnose with `tsc --extendedDiagnostics` and `tsc --generateTrace trace/` (open in `chrome://tracing` or Perfetto). Fixes:
- `skipLibCheck: true` (skip checking `.d.ts` in `node_modules`).
- **Project references** + `tsc -b` + `incremental` so only changed projects rebuild.
- **Annotate return types** of exported functions (the compiler does not need to infer large types again).
- Prefer `interface extends` over big intersections (`&`), which are re-computed.
- Avoid giant unions (thousands of members) and very deep recursive or conditional types.
- Keep `include` tight; exclude build output and `node_modules`.
- Split huge files and avoid barrel-file cycles (`index.ts` re-exporting everything).
- Use `isolatedDeclarations` (TS 5.5) so declaration files can be produced without a full type check.
Mention the **native compiler port** (the TypeScript team announced a rewrite in Go, "TypeScript 7") promising roughly 10x faster builds; check its current status.

### Q80. How do you author and publish a TypeScript library? *(Architecture)*
- Compile to JS + generate `.d.ts` (`declaration: true`, `declarationMap: true`).
- Use `package.json` `exports` with a **`types` condition first** and separate ESM/CJS entries.
```json
{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  },
  "files": ["dist"]
}
```
- Export only public types; avoid leaking internal types in signatures.
- Treat **type changes as API changes** (semver): making a return type narrower or a parameter stricter can break users.
- Test the published package: `@arethetypeswrong/cli`, `publint`, `api-extractor`, and a consumer test project with several `moduleResolution` settings.
- Do not depend on `@types/*` at runtime unless users need those types (then list them in `dependencies`).

### Q81. Generics vs overloads vs union types: how do you choose? *(Decision)*
| Use | When |
|---|---|
| **Union** (`A \| B`) | The function accepts several types and returns the same type or a union. |
| **Generic** (`<T>`) | Output type depends on input type in a uniform way (`identity`, `pluck`, `map`). |
| **Overloads** | Different input shapes map to clearly different return types and generics cannot express it, or you need good call-site documentation. |
Overload tips: put the most specific signatures first, and keep the implementation signature compatible (it is not visible to callers). Too many overloads are a smell; consider an options object or discriminated union.

### Q82. How do you manage `any` in a codebase? *(Strategy)*
- Turn on `noImplicitAny` and the ESLint rules `no-explicit-any`, `no-unsafe-*`.
- Use **`unknown` at boundaries** (network, storage, `catch`), then narrow or validate.
- Track `any` count as a metric; do not allow it to grow (type-coverage tool).
- For unavoidable cases, use a narrow escape hatch with a comment: `// eslint-disable-next-line ... -- reason`.
- Use `@ts-expect-error` (not `ts-ignore`) so stale suppressions get reported.
- `any` is contagious: one `any` can silently make a whole chain `any`.

### Q83. "Parse, don't validate": runtime and compile-time boundaries
Convert untrusted data **once, at the boundary**, into a trusted type, and then pass only trusted types inward.
```ts
const Env = z.object({ PORT: z.coerce.number().default(3000), DATABASE_URL: z.string().url() });
export const env = Env.parse(process.env);         // fails fast at startup, typed afterwards
```
Inside the app you can trust `env.PORT` is a number. Do the same for API responses, form data and `localStorage`.

### Q84. Error handling and types: exceptions vs `Result`
TypeScript does not track thrown errors (no checked exceptions). Options:
```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
function parseJson(s: string): Result<unknown, SyntaxError> {
  try { return { ok: true, value: JSON.parse(s) }; }
  catch (e) { return { ok: false, error: e as SyntaxError }; }
}
const r = parseJson(input);
if (!r.ok) return handle(r.error);       // narrowing forces you to handle errors
use(r.value);
```
Use exceptions for unexpected failures; use `Result` for expected, recoverable failures. Libraries: `neverthrow`, `effect`. Use `Error` with `cause` (`new Error('msg', { cause: err })`).

### Q85. Type-safe routes, URLs and i18n keys
```ts
type Params<P extends string> = P extends `${string}:${infer Name}/${infer Rest}` ? Name | Params<`/${Rest}`> : P extends `${string}:${infer Name}` ? Name : never;
function buildPath<P extends string>(path: P, params: Record<Params<P>, string | number>): string {
  return path.replace(/:(\w+)/g, (_, k: string) => String((params as Record<string, string | number>)[k]));
}
buildPath('/users/:id/posts/:postId', { id: 1, postId: 2 });
// buildPath('/users/:id', {});            // ❌ missing id
```
The same idea gives typed i18n keys (`Paths<typeof messages>`), typed query keys and typed CSS variable names.

### Q86. How do you test types?
Types need tests, especially in libraries and utility types.
```ts
import { expectTypeOf } from 'vitest';
expectTypeOf<ReturnType<typeof getUser>>().toEqualTypeOf<Promise<User>>();
// Pure compiler approach:
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type _t1 = Expect<Equal<Pick<{ a: 1; b: 2 }, 'a'>, { a: 1 }>>;
// @ts-expect-error  -> proves that wrong usage is rejected
takesNumber('x');
```
Tools: `vitest typecheck`, `tsd`, `dtslint`, `tsc --noEmit` on a "type tests" file.

### Q87. Advanced React + TypeScript patterns
```tsx
// Generic component
type ListProps<T> = { items: readonly T[]; keyOf: (item: T) => React.Key; render: (item: T) => React.ReactNode };
export function List<T>({ items, keyOf, render }: ListProps<T>) {
  return <ul>{items.map((i) => <li key={keyOf(i)}>{render(i)}</li>)}</ul>;
}

// Polymorphic "as" prop
type AsProp<E extends React.ElementType> = { as?: E };
type BoxProps<E extends React.ElementType> = AsProp<E> & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;
export function Box<E extends React.ElementType = 'div'>({ as, ...rest }: BoxProps<E>) {
  const Tag = (as ?? 'div') as React.ElementType;
  return <Tag {...rest} />;
}

// Discriminated union props
type ButtonProps = { variant: 'link'; href: string } | { variant: 'action'; onClick: () => void };

// Context without undefined
const Ctx = React.createContext<Theme | null>(null);
export function useTheme() { const v = React.useContext(Ctx); if (!v) throw new Error('Missing ThemeProvider'); return v; }

// Reducer with exhaustive actions
type Action = { type: 'inc' } | { type: 'set'; value: number };
function reducer(s: number, a: Action): number { switch (a.type) { case 'inc': return s + 1; case 'set': return a.value; } }
```
Also: `React.ComponentProps<typeof Component>`, `React.forwardRef<HTMLInputElement, Props>`, `useRef<HTMLDivElement>(null)`, `React.FC` is optional (many teams avoid it).

### Q88. Database and ORM typing
Schema-first (Prisma: generate types from `schema.prisma`) vs code-first (Drizzle, Kysely: infer types from TypeScript table definitions). Benefits: queries are type-checked and results are typed. Pitfalls: types describe your **model**, not what a partial `select` returns (use the generated payload types), and migrations must stay in sync. Use `Prisma.UserGetPayload<...>` or `Awaited<ReturnType<...>>` for return types.

### Q89. Monorepo setup for TypeScript
- A shared `tsconfig.base.json`; each package extends it.
- Packages export types via `exports` and `types`; apps import by package name (not by relative paths).
- Use **project references** or a task runner (Turborepo, Nx) for ordering and caching.
- `paths` in `tsconfig` only helps the **type checker**; the bundler/runtime needs the same alias config.
- Keep one TypeScript version (via the root) to avoid type mismatches.

### Q90. How do you migrate a JavaScript codebase to TypeScript? *(Scenario)*
1. Add `tsconfig.json` with `allowJs: true`, `checkJs: false`, `noEmit: true`.
2. Run the compiler in CI; do not block yet.
3. Rename files `.js → .ts` module by module, starting with **leaf modules** (utilities) and shared types.
4. Type the boundaries first (API clients, models); use `unknown` and schemas.
5. Turn on strictness flag by flag (`noImplicitAny`, then `strictNullChecks`...), or enable `strict` for new folders only.
6. Use JSDoc types + `checkJs` in files you cannot convert yet.
7. Automate with codemods (`ts-migrate`), track progress (percentage typed, `any` count).
8. Add lint rules and a "new code must be TS" policy.

### Q91. `isolatedDeclarations` and explicit types (TS 5.5)
It requires exported APIs to have **explicit type annotations** so that `.d.ts` can be generated by tools that do not run the full type checker (SWC, esbuild, Oxc), which speeds up builds in large monorepos. Rule of thumb: always annotate the return type of exported functions and the type of exported constants.

### Q92. Soundness: where is TypeScript unsound on purpose?
TypeScript is **not fully sound**; it balances safety and convenience. Known holes:
- Array covariance (`Dog[]` → `Animal[]`, then pushing a `Cat`).
- Method parameter **bivariance**.
- `any`, type assertions (`as`), and `!`.
- `JSON.parse` and `Response.json()` return `any`.
- Index signatures and `arr[i]` assume the element exists (unless `noUncheckedIndexedAccess`).
- `Object.keys` returns `string[]`.
- Optional properties and `undefined` (unless `exactOptionalPropertyTypes`).
- Mutating through a `readonly` alias (readonly is shallow and not enforced at run time).
Say this in interviews: "types are a tool for most bugs, not a guarantee, so I validate at boundaries".

### Q93. Explicit Resource Management: `using` (TS 5.2)
```ts
class Connection implements Disposable {
  [Symbol.dispose]() { this.close(); }
  close() { /* ... */ }
}
function run() {
  using conn = new Connection();         // disposed automatically at the end of the block
  // ... use conn
}
// async version: await using x = ...; with Symbol.asyncDispose
```
Requires the right `lib` (e.g., `esnext.disposable`) and runtime support or a polyfill.

### Q94. Control-flow analysis details
Narrowing follows assignments, early returns, `never`-returning calls, aliased conditions (TS 4.4), and narrowing is preserved in closures **after the last assignment** (TS 5.4). It is reset by function boundaries for mutable variables and by calls that could change values.
```ts
function f(x: string | number) {
  const isStr = typeof x === 'string';
  if (isStr) x.toUpperCase();            // ✅ aliased condition (TS 4.4+)
}
```

### Q95. Variance annotations and invariance
`in` / `out` modifiers (TS 4.7) document and speed up variance checking.
```ts
interface Getter<out T> { get(): T }            // covariant
interface Setter<in T> { set(v: T): void }      // contravariant
interface Box<in out T> { get(): T; set(v: T): void }   // invariant
```
Mutable containers are invariant in theory; TypeScript allows array covariance anyway.

### Q96. Limits of type-level programming
Conditional and recursive types have a **depth limit** (instantiation depth, around 50 normally; tail-recursive conditional types can go deeper, up to about 1000). You may see `TS2589: Type instantiation is excessively deep`. Use tail recursion with an accumulator, split types, or move logic to runtime. Remember: type-level code is hard to read, slows the compiler, and gives confusing errors. Use it for public API ergonomics, not for clever puzzles in app code.

### Q97. How do you run TypeScript in production? *(Tooling)*
| Option | Notes |
|---|---|
| `tsc` → JS, run with Node | Simplest, full type check at build time |
| Bundler (Vite, esbuild, tsup, Rollup) | Fast; strips types; run `tsc --noEmit` separately |
| SWC / Babel | Fast transpile; no type check |
| `tsx` / `ts-node` | Dev convenience; avoid in production for startup cost |
| Node native type stripping | Runs `.ts` with erasable syntax only (no enums, namespaces, parameter properties); check Node version |
| Bun / Deno | Run TypeScript natively |
Always ship JavaScript (or run natively with stripping), keep source maps, and gate deployments on `tsc --noEmit`.

### Q98. Security and TypeScript
Types do **not** protect against untrusted input. Validate with schemas, avoid `as` on external data, ban `any` in input handling, keep dependencies (and `@types/*`) audited, and enforce lint rules (`no-unsafe-*`). A typed `User` that came from `JSON.parse` could still be anything.

### Q99. TypeScript upgrade strategy
Pin the version, read release notes (breaking type-check changes appear in minor versions), upgrade in a branch, fix new errors (often real bugs), run the test suite and type tests, update `typescript-eslint` and framework type packages together, and test the next version in CI (`typescript@next`) for early warning.

### Q100. How do you type a configuration-driven system (plugins, registries)?
```ts
interface Plugin<Name extends string = string, Opts = unknown> { name: Name; init(opts: Opts): void }
function definePlugin<const P extends Plugin>(p: P): P { return p; }
type PluginMap<P extends readonly Plugin[]> = { [K in P[number] as K['name']]: K };
```
Use `const` type parameters and `satisfies` to keep literal keys so consumers get autocomplete.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you roll out TypeScript across a large organization? *(Strategy)*
Start with a pilot team and measure (bugs, onboarding, PR review time). Provide a shared `tsconfig` preset, ESLint config, and a starter template. Define strictness levels (new code `strict`, legacy with exceptions). Train through workshops and pair reviews. Track metrics (percent TS, `any` count, type errors in CI). Make the compiler a CI gate and fix flaky builds first.

### Q102. What is your strictness policy?
`strict: true` for all new code, no exceptions without a documented reason. Add `noUncheckedIndexedAccess` and `noImplicitOverride` for libraries and core code. For legacy code, use per-folder tsconfigs and reduce exceptions over time. Block `@ts-ignore` (use `@ts-expect-error` with a reason) and `any` in core packages.

### Q103. How do you share types between frontend and backend?
Options: (1) a **shared package** of types/schemas (Zod schemas as the source of truth), (2) **OpenAPI** → generated types/clients, (3) **GraphQL codegen**, (4) **tRPC** (end-to-end inference in a TS monorepo), (5) Protobuf/gRPC codegen. Choose based on language mix, team boundaries and versioning needs. Always keep **runtime validation** at the boundary.

### Q104. Who owns types? (governance)
Domain types live with the domain package; shared "contract" types live in a versioned package with a code owner. Review type changes like API changes. Avoid a dumping-ground `types.ts`. Document public types and deprecate with `@deprecated` JSDoc.

### Q105. Complexity budget for the type system
Set rules: prefer simple types (interfaces, unions, generics), restrict heavy conditional/recursive types to library/internal-platform code with tests, require comments and type tests for clever types, and measure compile time. Readability for the average developer matters more than cleverness.

### Q106. How do you keep build and CI times low?
Incremental builds and project references, caching (Turborepo/Nx remote cache), type-check only affected projects, run `tsc --noEmit` and lint in parallel, split packages by stability, use fast transpilers for bundling, and track compile time as a metric.

### Q107. Typing strategy for micro-frontends and plugin systems
Define a stable, versioned **contract package** (types for events, props, shared state). Version it with semver and test compatibility. Use runtime validation at the module boundary because remote modules can be deployed independently of the host's compile-time view.

### Q108. Managing breaking changes in public types
Treat them like API breaks: deprecate first (`@deprecated`), offer migration codemods, keep overloads for one major version, run type tests against old and new usage, publish a changelog that lists type-level changes, and bump the major version when consumers' code could stop compiling.

### Q109. Hiring and mentoring for TypeScript depth
Interview for: generics and constraints, narrowing, `unknown` vs `any`, utility/mapped/conditional types, reading compiler errors, structural typing, and judgement (when not to use fancy types). Mentor by reviewing types in PRs, explaining *why* errors happen, and pairing on tricky generics.

### Q110. Decision: TypeScript vs JSDoc-typed JavaScript vs Flow
TypeScript has by far the best ecosystem. **JSDoc + `checkJs`** gives type checking without a build step (some teams use it for libraries). Flow has a small ecosystem now. Pick TypeScript unless you have a strong reason (no build step allowed, legacy constraints).

### Q111. How do you evaluate an AI/codegen-heavy workflow with TypeScript?
Types act as guardrails for generated code: strict mode, schema-first APIs, and type tests catch bad generations. Keep generated code in separate folders, regenerate in CI, and require human review for public types. Use the compiler and lint as automatic feedback loops.

### Q112. What risks does TypeScript bring and how do you mitigate them?
Risks: false confidence (types lie at boundaries), over-engineered types, slow builds, version/type mismatches across packages, `any` creep. Mitigation: runtime validation, complexity budget, performance monitoring, a single TypeScript version in the monorepo, lint rules and type coverage metrics.

---

# 💻 Part 6: Coding / Type Challenges

> Type-level questions are common in senior interviews. Practice writing each one from memory and explain *why* it works.

### C1. Re-implement the built-in utility types
```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;
type MyRecord<K extends keyof any, V> = { [P in K]: V };
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T & {};
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;
```

### C2. `DeepPartial` and `DeepReadonly`
```ts
type DeepPartial<T> = T extends (...a: any[]) => any ? T
  : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
type DeepReadonly<T> = T extends (...a: any[]) => any ? T
  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
```
Functions are returned as-is so they are not mapped into object types.

### C3. `UnionToIntersection`, `Prettify`, `TupleToUnion`, `Length`
```ts
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type Prettify<T> = { [K in keyof T]: T[K] } & {};
type TupleToUnion<T extends readonly unknown[]> = T[number];
type Length<T extends readonly unknown[]> = T['length'];
type A = UnionToIntersection<{ a: 1 } | { b: 2 }>;     // { a: 1 } & { b: 2 }
```
(`UnionToIntersection` works because function parameters are contravariant, so inferring from a union of functions gives an intersection.)

### C4. `First`, `Last`, `Push`, `Concat`, `Reverse` for tuples
```ts
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never;
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;
type Push<T extends unknown[], V> = [...T, V];
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];
type Reverse<T extends unknown[]> = T extends [infer H, ...infer R] ? [...Reverse<R>, H] : [];
type R = Reverse<[1, 2, 3]>;          // [3, 2, 1]
```

### C5. `Trim`, `Capitalize`-like and `CamelCase` (string types)
```ts
type Whitespace = ' ' | '\n' | '\t';
type TrimLeft<S extends string> = S extends `${Whitespace}${infer R}` ? TrimLeft<R> : S;
type TrimRight<S extends string> = S extends `${infer R}${Whitespace}` ? TrimRight<R> : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type CamelCase<S extends string> = S extends `${infer H}_${infer T}`
  ? `${Lowercase<H>}${Capitalize<CamelCase<Lowercase<T>>>}` : Lowercase<S>;
type C = CamelCase<'user_first_name'>;       // 'userFirstName'

type SnakeToCamelKeys<T> = { [K in keyof T as K extends string ? CamelCase<K> : K]: T[K] };
```

### C6. `Get<T, 'a.b.c'>` and `Paths<T>`
```ts
type Get<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T ? Get<T[K], R> : never
  : P extends keyof T ? T[P] : never;

type Paths<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? K | `${K}.${Paths<T[K]>}` : K }[keyof T & string]
  : never;

type Cfg = { db: { host: string; port: number }; name: string };
type P = Paths<Cfg>;                  // 'db' | 'db.host' | 'db.port' | 'name'
type H = Get<Cfg, 'db.host'>;         // string
```

### C7. Make some properties optional or required
```ts
type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;
type RequiredBy<T, K extends keyof T> = Prettify<Omit<T, K> & Required<Pick<T, K>>>;
type User = { id: number; name: string; email: string };
type NewUser = PartialBy<User, 'id'>;      // { name: string; email: string; id?: number }
```

### C8. Key helper types
```ts
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
type FunctionKeys<T> = { [K in keyof T]: T[K] extends (...a: any[]) => any ? K : never }[keyof T];
type ValueOf<T> = T[keyof T];
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];
```

### C9. Typed `pick`, `omit`, `keys`, `entries`, `groupBy`
```ts
function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}
const keys = <T extends object>(o: T) => Object.keys(o) as Array<keyof T>;
const entries = <T extends object>(o: T) => Object.entries(o) as Array<[keyof T, T[keyof T]]>;
function groupBy<T, K extends PropertyKey>(arr: readonly T[], fn: (x: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const x of arr) (out[fn(x)] ??= []).push(x);
  return out;
}
```

### C10. Typed `debounce`, `once`, `memoize`, `pipe`
```ts
function debounce<A extends unknown[]>(fn: (...args: A) => void, wait = 300) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function memoize<A extends unknown[], R>(fn: (...args: A) => R) {
  const cache = new Map<string, R>();
  return (...args: A): R => {
    const k = JSON.stringify(args);
    if (!cache.has(k)) cache.set(k, fn(...args));
    return cache.get(k)!;
  };
}
function pipe<A, B>(a: A, ab: (a: A) => B): B;
function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
function pipe<A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
function pipe(a: unknown, ...fns: Array<(x: any) => any>) { return fns.reduce((v, f) => f(v), a); }
```
(`ReturnType<typeof setTimeout>` works in both browser and Node typings.)

### C11. Discriminated-union reducer with an exhaustive check
```ts
type Action = { type: 'add'; item: string } | { type: 'remove'; index: number } | { type: 'clear' };
function assertNever(x: never): never { throw new Error(`Unexpected: ${JSON.stringify(x)}`); }
function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case 'add': return [...state, action.item];
    case 'remove': return state.filter((_, i) => i !== action.index);
    case 'clear': return [];
    default: return assertNever(action);
  }
}
```

### C12. `Result` type with helpers
```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
function map<T, U, E>(r: Result<T, E>, fn: (v: T) => U): Result<U, E> { return r.ok ? ok(fn(r.value)) : r; }
```

### C13. Branded IDs with safe constructors
```ts
type Brand<T, B extends string> = T & { readonly __brand: B };
type Email = Brand<string, 'Email'>;
function parseEmail(s: string): Email {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)) throw new Error('Invalid email');
  return s as Email;
}
function send(to: Email) {}
// send('a@b.com');             // ❌ plain string is rejected
send(parseEmail('a@b.com'));    // ✅
```

### C14. Typed builder (fluent API that accumulates types)
```ts
class QueryBuilder<T extends object = {}> {
  private parts: Record<string, unknown> = {};
  set<K extends string, V>(key: K, value: V): QueryBuilder<T & Record<K, V>> {
    this.parts[key] = value;
    return this as unknown as QueryBuilder<T & Record<K, V>>;
  }
  build(): T { return this.parts as T; }
}
const q = new QueryBuilder().set('limit', 10).set('sort', 'name').build();
// q: {} & Record<'limit', number> & Record<'sort', string>
q.limit.toFixed();
```

### C15. Typed state machine
```ts
type State =
  | { status: 'idle' }
  | { status: 'loading'; startedAt: number }
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };
type Event = { type: 'FETCH' } | { type: 'OK'; data: string[] } | { type: 'FAIL'; message: string };
function next(s: State, e: Event): State {
  switch (s.status) {
    case 'idle': return e.type === 'FETCH' ? { status: 'loading', startedAt: Date.now() } : s;
    case 'loading':
      if (e.type === 'OK') return { status: 'success', data: e.data };
      if (e.type === 'FAIL') return { status: 'error', message: e.message };
      return s;
    default: return s;
  }
}
```

### C16. Typed `fetch` wrapper with a schema
```ts
import { z, ZodTypeAny } from 'zod';
async function http<S extends ZodTypeAny>(url: string, schema: S, init?: RequestInit): Promise<z.infer<S>> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return schema.parse(await res.json());
}
const User = z.object({ id: z.number(), name: z.string() });
const user = await http('/api/user', User);       // typed AND validated
```

### C17. Typed `useLocalStorage` hook
```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; }
    catch { return initial; }
  });
  React.useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```
(For real data validate with a schema instead of `as T`.)

### C18. Extract the props of a component and event handler types
```tsx
type ButtonProps = React.ComponentProps<typeof Button>;
type InputChange = React.ChangeEvent<HTMLInputElement>;
const onChange = (e: InputChange) => setValue(e.target.value);
```

### C19. Overloaded function with implementation
```ts
function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number): (string | number)[] { return [x]; }
const a = toArray('a');       // string[]
```

### C20. Type guard for object shapes (no library)
```ts
function isRecord(x: unknown): x is Record<string, unknown> { return typeof x === 'object' && x !== null && !Array.isArray(x); }
function isUser(x: unknown): x is { id: number; name: string } {
  return isRecord(x) && typeof x.id === 'number' && typeof x.name === 'string';
}
```

### C21. `ReadonlyArray` and tuple helpers
```ts
const roles = ['admin', 'user', 'guest'] as const;
type Role = (typeof roles)[number];             // 'admin' | 'user' | 'guest'
const isRole = (x: string): x is Role => (roles as readonly string[]).includes(x);
```

### C22. `Exclude` a key from a discriminated union
```ts
type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number };
type Circle = Extract<Shape, { kind: 'circle' }>;
type NonCircle = Exclude<Shape, { kind: 'circle' }>;
type Kinds = Shape['kind'];
```

### C23. Typed `Object.fromEntries` and `Record` from a union
```ts
type Status = 'idle' | 'loading' | 'error';
const labels: Record<Status, string> = { idle: 'Idle', loading: 'Loading', error: 'Error' };   // all keys required
const lookup = Object.fromEntries([['a', 1], ['b', 2]] as const);    // { [k: string]: 1 | 2 }
```

### C24. Make an interface from a function's parameter and return types
```ts
async function createUser(input: { name: string; age: number }) { return { id: 1, ...input }; }
type CreateInput = Parameters<typeof createUser>[0];
type CreatedUser = Awaited<ReturnType<typeof createUser>>;
```

### C25. Extend a global or third-party type
```ts
declare global {
  interface Window { dataLayer: unknown[] }
  namespace NodeJS { interface ProcessEnv { DATABASE_URL: string } }
}
export {};
```

---

# 🐞 Part 7: Debugging Scenarios (Compiler Errors)

> Learn to **read the error code and the last line of the message** (the real reason is usually at the bottom).

### D1. `TS2322: Type 'string' is not assignable to type 'number'`
You assigned a value of the wrong type. Fix the value, widen the declared type, or convert (`Number(x)`). For unions of literals: `Type 'string' is not assignable to type '"a" | "b"'` happens when a variable was widened to `string`; use `as const` or declare the literal type.

### D2. `TS2339: Property 'x' does not exist on type 'Y'`
The property is not in the type: a typo, a union that needs narrowing, or a missing type declaration. Narrow first (`'x' in obj`), extend the interface, or use the right type. For DOM: `querySelector<HTMLInputElement>(...)`.

### D3. `TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'`
Same as above but for a call. Look at the **last line** of the error to see which property mismatches. Common: `string | undefined` passed where `string` is required.

### D4. `TS7006: Parameter 'x' implicitly has an 'any' type`
`noImplicitAny` is on and the compiler cannot infer the parameter. Add a type, or give the callback a contextual type (`items.map((i: Item) => ...)` or type the array).

### D5. `TS2532 / TS18048: Object is possibly 'undefined'` (and `TS2531 / TS18047` for `null`)
Narrow before use: `if (x) ...`, `x?.y`, `x ?? default`, or throw early. Avoid `!` unless you can prove it.

### D6. `TS2307: Cannot find module './x' or its corresponding type declarations`
Wrong path/extension, missing `@types/...`, `paths` not configured, or a non-code import (`.css`, `.svg`). Add a `declare module '*.svg'` file, install types, or fix `moduleResolution`. With `node16/nodenext`, relative imports need **file extensions** (`./x.js`).

### D7. `TS2304: Cannot find name 'process'` / `'require'` / `'describe'`
Missing global types. Install `@types/node` / `@types/jest` / `vitest/globals` and include them in `"types"` or `"typeRoots"` in `tsconfig`.

### D8. `TS2554: Expected 2 arguments, but got 1`
Wrong number of arguments. Check the signature, optional parameters (`?`) and default values.

### D9. `TS2769: No overload matches this call`
None of the overloads accepts your arguments. The error lists each overload; read the **last** one, or check which argument fails. Often a union that should be split, or a missing property in an options object.

### D10. `TS2564: Property 'x' has no initializer and is not definitely assigned in the constructor`
`strictPropertyInitialization`. Initialize the field, make it optional, or use the definite assignment assertion `x!: string` when something else (a framework, DI) assigns it.

### D11. `TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type`
You are indexing an object with a plain `string`. Use `keyof typeof obj`, a `Record<string, T>`, a type guard (`k in obj`), or `Object.entries`.
```ts
const colors = { red: 1, blue: 2 };
function get(k: string) { return colors[k as keyof typeof colors]; }    // assertion; better: validate k
```

### D12. `TS2367: This comparison appears to be unintentional because the types have no overlap`
You compare incompatible types (`'a' === 'b'` literals or `number === string`). Often a bug or an outdated union.

### D13. `TS2741 / TS2739 / TS2740: Property is missing in type`
A required property is missing from an object. Add it, make it optional, or use `Partial`. In classes: `implements` demands all members.

### D14. `TS2353: Object literal may only specify known properties`
Excess property check on a fresh literal. Fix the typo, add the property to the type, or assign through a variable (not recommended).

### D15. `TS2344: Type 'X' does not satisfy the constraint 'Y'`
The generic argument is not allowed by `extends`. Adjust the constraint or the argument.

### D16. `TS2589: Type instantiation is excessively deep and possibly infinite`
Too deep or recursive conditional type. Simplify, use tail recursion, annotate return types, or split types.

### D17. `TS2590: Expression produces a union type that is too complex to represent`
Huge cross-product unions (e.g., template literal types with many unions). Reduce the size or split the type.

### D18. `TS1192: Module has no default export` / `TS1259 ... can only be default-imported using the 'esModuleInterop' flag`
Use a named import or enable `esModuleInterop`/`allowSyntheticDefaultImports`.

### D19. `TS1484: 'X' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled` / `TS1205 ... isolatedModules`
Use `import type { X }` / `export type { X }`.

### D20. `TS2693: 'X' only refers to a type, but is being used as a value here`
You used an interface/type where a value is expected (e.g., `new MyInterface()` or `instanceof MyInterface`). Use a class, or a type guard.

### D21. `TS18046: 'x' is of type 'unknown'`
Narrow `unknown` before use (`typeof`, `instanceof`, schema validation). In `catch (e)`, check `e instanceof Error`.

### D22. `TS2835: Relative import paths need explicit file extensions` (`nodenext`)
Write `import './util.js'` (the **output** extension) in TypeScript files when using Node's ESM resolution.

### D23. "Works in the editor but fails in CI" (or the opposite)
Different TypeScript versions or `tsconfig` (editor uses workspace version?), missing `include`, stale build info (`tsconfig.tsbuildinfo`), or generated files not built yet. Pin the version and run the same `tsc` command in both.

### D24. Types are correct but the app crashes at runtime
Types lie at the boundary: `as` assertions, `JSON.parse`, API changes, `any`. Add runtime validation and log the real data. (Say it in interviews: "compile-time safety is not runtime safety".)

### D25. `setTimeout` returns `number` vs `NodeJS.Timeout` conflict
Both DOM and Node typings are loaded. Use `ReturnType<typeof setTimeout>` for the variable type, or restrict `lib`/`types` per project (`"types": []` for browser code).

### D26. Path alias works in `tsc` but not at runtime
`paths` only informs the type checker. Configure the same alias in the bundler (Vite `resolve.alias`, webpack, `tsconfig-paths`, Node `imports`) or avoid aliases.

### D27. A `.d.ts` file is ignored
It must be included by `include`/`files`, be a **global script** (no top-level `import`/`export`) to declare globals, or a module that uses `declare global`. Restart the TS server after changes.

### D28. Debugging method (say it in interviews)
Read the **code and last line** of the message → hover to see inferred types → simplify the failing expression (extract to a variable, assign explicit types) → use `// @ts-expect-error` in a scratch test to prove the shape → check `tsconfig`/versions → fix the root cause and add a type test if it is a utility type.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Does `readonly` protect the value at run time?
No. `readonly` is erased. It is a compile-time check, and it is **shallow**.
```ts
const user: Readonly<{ name: string; tags: string[] }> = { name: 'a', tags: [] };
// user.name = 'b';        // ❌ compile error
user.tags.push('x');       // ✅ allowed: tags itself is not readonly
(user as any).name = 'b';  // works at run time
```

### T2. When does the excess property check apply?
Only to **fresh object literals** assigned directly to a typed target.
```ts
type P = { x: number };
const a: P = { x: 1, y: 2 };       // ❌ excess property 'y'
const tmp = { x: 1, y: 2 };
const b: P = tmp;                   // ✅ no error (not a fresh literal)
```

### T3. Does `as` convert a value?
No. `as` only changes what the compiler believes. `'5' as unknown as number` is still the string `'5'` at run time.

### T4. Optional property vs `| undefined`
```ts
type A = { a?: number };        // key may be missing; value number | undefined
type B = { a: number | undefined }; // key must exist (may hold undefined)
const x: A = {}; // ✅      const y: B = {}; // ❌ Property 'a' is missing
```
With `exactOptionalPropertyTypes`, `a?: number` forbids explicitly writing `a: undefined`.

### T5. `string[] | number[]` vs `(string | number)[]`
A union of arrays is **either** all strings **or** all numbers. An array of unions can mix them. Some array methods on a union of arrays had awkward typing in older versions (fixed in recent releases such as `filter`/`find` in TS 5.2). When in doubt, use `(string | number)[]`.

### T6. `keyof` with an index signature
```ts
type Dict = { [k: string]: number };
type K = keyof Dict;        // string | number (numeric keys are converted to strings at run time)
```

### T7. Unions with `never`, `unknown` and `any`
```ts
type A = string | never;        // string  (never disappears)
type B = string | unknown;      // unknown (absorbs everything)
type C = string | any;          // any
type D = string & unknown;      // string
type E = string & never;        // never
type F = string & any;          // any
type G = string & number;       // never
```

### T8. Why can a callback returning a value be passed where `void` is expected?
```ts
[1, 2, 3].forEach((n) => n * 2);          // ✅ the return value is ignored
type Fn = () => void;
const f: Fn = () => 123;                   // ✅ assignable
function g(): void { /* return 123 */ }    // ❌ a function *declared* void cannot return a value
```
A function **type** with `void` return means "I ignore the return value".

### T9. A tuple can still be mutated
```ts
const t: [string, number] = ['a', 1];
t.push(2);        // ✅ compiles (a known unsoundness); the type still says length 2
const r: readonly [string, number] = ['a', 1];
// r.push(2);     // ❌
```

### T10. `private` (TypeScript) vs `#private` (JavaScript)
`private` is compile-time only (still readable via `obj['x']` or `as any`). `#x` is a real JavaScript private field, enforced at run time. TypeScript `private` members still affect **structural compatibility**: two classes with the same private member name from different declarations are not assignable to each other.

### T11. Why is `Object.keys(obj)` typed as `string[]`?
An object value can have **more properties** at run time than its type says (structural typing), so `keyof T` could be wrong. Use a typed helper when you know the object is exact.

### T12. Is a numeric enum safe?
Before TS 5.0, any number could be assigned to a numeric enum. Since TS 5.0, enums are union enums and out-of-range **literal** assignments are errors, but a `number` variable can still be assigned. Reverse mapping makes the compiled object contain both directions.
```ts
enum E { A, B }
const e: E = 5 as number;     // compiles (number is assignable)
```

### T13. Type predicates can lie
```ts
function isString(x: unknown): x is string { return true; }     // compiles! the compiler trusts you
```
The compiler **does not verify** the body of a type guard. Test them.

### T14. Distributive conditional types and `never`
```ts
type ToArray<T> = T extends any ? T[] : never;
type X = ToArray<never>;        // never (an empty union distributes to an empty union)
type Y = [never] extends [never] ? true : false;   // true (wrapping avoids distribution)
```

### T15. `interface` extends vs `&` intersection with conflicting properties
`interface B extends A { x: string }` where `A.x` is `number` → **error**. `A & { x: string }` where `A.x` is `number` → no error, but `x` becomes `never` (you can never create a value).

### T16. `Partial<T>` and `undefined`
`Partial<{ a: number }>` makes `a?: number`, which allows `undefined`. If you need "present or absent but never undefined", enable `exactOptionalPropertyTypes`.

### T17. Why does `typeof x` mean two different things?
In **value** position it is the JavaScript operator (`typeof x === 'string'`). In **type** position it is a type query (`type T = typeof x`) that gets the compile-time type of the variable.

### T18. `target` vs `lib`
`target` decides which **syntax** is emitted (e.g., down-levels `?.` for old targets). `lib` decides which **built-in types** exist (`Promise.allSettled`, `Array.prototype.at`, DOM). Using `target: ES5` with `lib` missing `ES2015.promise` gives "Cannot find name 'Promise'". TypeScript does **not** polyfill APIs.

### T19. `@types` packages leak globals
By default **all** `@types/*` packages in `node_modules` are included. `@types/jest` and `@types/mocha` both declare `describe`/`it` and conflict. Restrict with `"types": ["node"]`.

### T20. `import x = require('x')` and `export =`
Old CommonJS-compatible syntax. `export = Foo` models `module.exports = Foo`. With `esModuleInterop` you can use `import Foo from 'foo'`. These are not "erasable" syntax.

### T21. Does `abstract class` work as a constructor type?
`typeof Abstract` is not assignable to `new () => T` because abstract classes cannot be instantiated. Use `abstract new () => T` as the type.

### T22. `Object.assign` and spread return types
`Object.assign(a, b)` returns `typeof a & typeof b`. Spread `{ ...a, ...b }` returns a merged object type where later spreads override earlier properties.

### T23. `Array.prototype.includes` with `as const` arrays
```ts
const roles = ['admin', 'user'] as const;
function isRole(x: string) { return roles.includes(x); }     // ❌ 'string' is not assignable to 'admin' | 'user'
const isRole2 = (x: string): x is (typeof roles)[number] => (roles as readonly string[]).includes(x);
```

### T24. Does TypeScript catch all `null` problems?
Only with `strictNullChecks`. Even then, `arr[0]` is typed `T` (not `T | undefined`) unless `noUncheckedIndexedAccess` is on, and `!` or `as` can bypass it.

### T25. Type narrowing is lost inside callbacks (sometimes)
```ts
let value: string | undefined = getValue();
if (value) { items.forEach(() => value.length); }   // older: ❌ value may be undefined (it is `let`)
const v = value; if (v) items.forEach(() => v.length);   // ✅ copy to const
```
Since TS 5.4, narrowing is kept in closures after the **last assignment**.

### T26. Template literal types and `string`
```ts
type A = `id_${string}`;
const ok: A = 'id_123';    // ✅
const bad: A = 'x_1';      // ❌
```
`${string}` is a wildcard for any string.

### T27. Enum vs object: type of `keyof typeof`
```ts
enum Color { Red, Green }
type K = keyof typeof Color;      // 'Red' | 'Green'  (keys of the runtime object)
type V = Color;                   // Color.Red | Color.Green (values)
```

### T28. `unknown` cannot be used with most operators
`unknown` blocks property access, calls, and arithmetic until narrowed. But `===`, `typeof`, `instanceof` and `in` work on it.

### T29. Generic defaults and inference
```ts
function f<T = string>(x?: T): T { return x as T; }
f();        // T = string (default)
f(1);       // T = number (inferred, default not used)
```

### T30. Class + interface declaration merging
```ts
class Foo { a = 1 }
interface Foo { b: number }        // merges: Foo instances are typed with both a and b
```
Useful for mixins, but the compiler does not check that `b` is actually assigned.

### T31. `this` types in classes
```ts
class Builder { set(k: string): this { return this; } }
class Sub extends Builder { extra() {} }
new Sub().set('a').extra();      // ✅ `this` type keeps the subclass in chains
```

### T32. `declare` vs actual code
`declare const x: number;` emits nothing; you promise that `x` exists at run time. If it does not, you get a `ReferenceError`.

### T33. `const` assertion on arrays vs objects
`as const` makes arrays **readonly tuples** and objects **readonly with literal values**, so passing them to functions that expect mutable arrays fails (`readonly string[]` is not assignable to `string[]`). Accept `readonly string[]` in function parameters.

### T34. Why `{}` accepts almost everything
`{}` means "any non-nullish value". `const x: {} = 5` compiles. Use `object` or `Record<string, unknown>` for objects, and `unknown` for "anything".

### T35. `any` is infectious
`const x = JSON.parse(s);` → `any`; `x.foo.bar` → `any`; passing `x` into typed code silently disables checks. Annotate at the first step: `const x: unknown = JSON.parse(s)`.

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| TypeScript is a... | Typed superset of JavaScript |
| Who created TypeScript? | Microsoft |
| File extensions? | `.ts`, `.tsx`, `.d.ts`, `.mts`, `.cts` |
| Does TS run in the browser directly? | No (compile to JS first) |
| Are types available at run time? | No (erased) |
| Compiler command? | `tsc` |
| Type-check only? | `tsc --noEmit` |
| Config file? | `tsconfig.json` |
| Turn on all strict checks? | `"strict": true` |
| Best type for unknown data? | `unknown` |
| Type that disables checks? | `any` |
| Type of a function that never returns? | `never` |
| Make all props optional? | `Partial<T>` |
| Pick some props? | `Pick<T, K>` |
| Remove some props? | `Omit<T, K>` |
| Object with string keys? | `Record<string, T>` |
| Get function return type? | `ReturnType<typeof fn>` |
| Unwrap a Promise type? | `Awaited<T>` |
| Keys of a type? | `keyof T` |
| Type of a variable? | `typeof x` (type position) |
| Property type by key? | `T[K]` |
| Narrow with a custom check? | `x is T` |
| Assert type without check? | `as T` |
| Non-null assertion? | `x!` |
| Check shape without widening? | `satisfies` |
| Keep literal types? | `as const` |
| Type-only import? | `import type { T } from '...'` |
| Add types for a JS library? | `@types/xyz` or a `.d.ts` file |
| Extend global types? | `declare global { ... }` |
| Interface merging? | Yes (same name merges) |
| Type alias merging? | No |
| Enum alternative? | `as const` object + union |
| Run `.ts` in dev quickly? | `tsx` / `ts-node` / Node type stripping |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a time TypeScript caught or prevented a serious bug."
**Sample answer (STAR):**
- **S:** An API changed a field from `price: number` to `price: { amount: number; currency: string }`.
- **T:** Update all clients safely.
- **A:** We updated the shared Zod schema and generated types. `tsc` showed 23 errors across 9 files immediately, which pointed to every place using `price`. We fixed them and added a type test.
- **R:** Zero production incidents for that change, and migration time dropped from days to hours.
Tip: give the type-level reason (a changed type led to compile errors).

### P2. "How did you migrate a JavaScript project to TypeScript?"
Explain the incremental plan from Q90: `allowJs`, boundaries first, flags one by one, codemods, CI gate, metrics (percentage typed, `any` count). Mention the result (fewer runtime errors, faster onboarding) with numbers.

### P3. "When do you avoid complex types?"
When the type is harder to read than the code it protects, when it slows the compiler, when error messages become unreadable for teammates. Prefer simple types plus runtime validation. Keep advanced types in a small, well-tested internal library.

### P4. "How do you handle third-party libraries without types?"
Check `@types/*` first; then write a minimal `declare module 'lib'` with only the functions you use; contribute types upstream if valuable; wrap the library behind your own typed adapter so the rest of the code stays clean.

### P5. "How do you review TypeScript code?"
Look for: `any`/`as`/`!` without justification, missing narrowing, unvalidated external data, public APIs with unclear types, overly clever generics, mutable shared state, and tests/type tests for utility types.

### P6. "Have you debugged a very slow type-check?"
Example: `tsc --generateTrace` showed one deeply recursive conditional type taking 40% of check time. We simplified it, added explicit return annotations, and enabled project references. Check time dropped from 3 min to 55 s.

### P7. "How do you teach TypeScript to a team new to it?"
Start with basic types, inference, unions/narrowing, interfaces; then generics and utility types; read real compiler errors together; ban `any` early; use exercises (Type Challenges, Total TypeScript); document the team's conventions.

### P8. "Why TypeScript and not just JavaScript with tests?"
Types and tests are complementary: types check every call site statically, give editor intelligence and documentation; tests check behavior. Together they catch more bugs and make refactoring safer. Be honest about the cost (build step, learning curve).

---

# 📚 Part 11: Complete Coverage (Classic + Config + Framework Typing + Interop)

## 11A. Classic TypeScript Questions

### K1. What are the advantages and disadvantages of TypeScript?
**Advantages:** compile-time error detection, better IDE support, safer refactoring, self-documenting code, scales to large teams, modern JS features compiled down. **Disadvantages:** build step, learning curve, extra verbosity, types can be wrong or complex, third-party types may be missing or outdated, and no runtime checks.

### K2. What are the components of TypeScript?
The **language** (syntax and type system), the **compiler** (`tsc`), and the **language service** (powers editor features such as autocomplete and quick fixes).

### K3. What is the `lib` option and `target`?
`target` = output JS version (syntax down-leveling). `lib` = which built-in type declarations to include (ES versions, DOM, WebWorker). Example: `"target": "ES2022", "lib": ["ES2023", "DOM", "DOM.Iterable"]`.

### K4. What are source maps?
Files (`.js.map`) that map compiled JavaScript back to the original TypeScript, so debuggers and error reports show TS lines. Enable with `"sourceMap": true` (and upload them to your error tracker, not to public CDNs if you want to hide source).

### K5. What are triple-slash directives?
Special comments used for declaring dependencies in older code: `/// <reference types="node" />`, `/// <reference path="./types.d.ts" />`, `/// <reference lib="dom" />`. In modern code prefer imports and `tsconfig` settings.

### K6. What are ambient declarations?
Declarations (`declare ...`) that describe code that exists elsewhere (global scripts, bundler-injected variables, non-code files). They produce no JavaScript output.

### K7. Interfaces vs abstract classes vs type aliases for contracts
Interface: pure contract, erased. Abstract class: contract + shared implementation, exists at run time. Type alias: names any type (unions, tuples). See Q6, Q48.

### K8. What are `namespace` and `module` keywords?
`namespace X {}` groups code (old "internal modules"). `module X {}` is the old spelling of namespace. `declare module 'x' {}` declares types for an external module. Today: use **ES modules** for code; use `declare module` only for typing.

### K9. What is the `unknown` vs `any` guideline for libraries?
Public APIs that accept arbitrary input should use `unknown`. Returning `any` forces `any` on every caller, so prefer generics (`<T = unknown>`).

### K10. What is the difference between `Array<T>` and `T[]`? And `ReadonlyArray<T>`?
Identical. `readonly T[]` and `ReadonlyArray<T>` forbid mutating methods (`push`, `sort`...). ESLint can enforce one style.

### K11. What are optional parameters vs default parameters vs rest parameters?
```ts
function f(a: number, b?: number, c = 10, ...rest: string[]) {}
```
Optional (`b?`) is `number | undefined`. Default (`c = 10`) is optional for callers and typed from the default. Rest collects remaining arguments in a typed array/tuple.

### K12. Explain the `never` type uses.
(1) Functions that never return, (2) exhaustive checks in `switch`, (3) removing members from unions in conditional types, (4) impossible intersections.

### K13. What is a type alias with generics and recursion?
```ts
type Tree<T> = { value: T; children: Tree<T>[] };
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
```

### K14. How do you declare a function type that is also an object with properties?
```ts
type Counter = { (): number; reset(): void; count: number };
```
A **callable interface** with a call signature plus properties.

### K15. Constructor types and `InstanceType`
```ts
type Ctor<T> = new (...args: any[]) => T;
function create<T>(C: Ctor<T>, ...args: any[]): T { return new C(...args); }
type U = InstanceType<typeof Date>;       // Date
```

### K16. What is the `this` parameter in functions?
A fake first parameter that declares the type of `this`. It is erased at compile time (`function f(this: Window) {}`).

### K17. Explain `declare global` and `export {}`.
In a **module** file (has `import`/`export`), `declare global { ... }` adds to the global scope. `export {}` makes a file a module so that top-level declarations stay local and `declare global` is allowed.

### K18. What is a definite assignment assertion?
`name!: string;` tells the compiler a property will be assigned before use even if the constructor does not assign it (dependency injection, decorators). It disables the check for that field.

### K19. What are accessors and `readonly` properties in classes?
```ts
class T { private _c = 0; get c() { return this._c; } set c(v: number) { this._c = Math.max(0, v); } readonly id = crypto.randomUUID(); }
```
Since TS 5.1, getters and setters can have unrelated types.

### K20. How do you create a type-safe `Object.entries` loop?
```ts
for (const [key, value] of Object.entries(config)) { /* key: string, value: typeof config[keyof typeof config] */ }
```
`Object.entries` returns `[string, T[keyof T]][]` for known object types, but the key is `string`.

## 11B. TypeScript Version Timeline (what came when)

| Version | Notable features |
|---|---|
| 4.1 | Template literal types, key remapping in mapped types |
| 4.4 | Aliased conditions in control-flow analysis, `useUnknownInCatchVariables` |
| 4.5 | `Awaited`, tail-recursion elimination for conditional types |
| 4.7 | `in`/`out` variance annotations, `moduleResolution: node16/nodenext` |
| 4.9 | `satisfies`, `accessor` keyword |
| 5.0 | Standard decorators, `const` type parameters, enums as unions, `moduleResolution: bundler`, `verbatimModuleSyntax` |
| 5.1 | Easier `undefined`-returning functions, unrelated getter/setter types |
| 5.2 | `using` declarations (explicit resource management) |
| 5.3 | Import attributes, narrowing improvements |
| 5.4 | `NoInfer`, preserved narrowing in closures after last assignment |
| 5.5 | **Inferred type predicates**, `isolatedDeclarations`, regex syntax checks |
| 5.6 | Stricter checks for always-truthy/nullish conditions, iterator helper types |
| 5.7 | `--target es2024`, rewriting relative import extensions |
| 5.8 | `--erasableSyntaxOnly`, better `require()`/ESM interop under `nodenext` |
| Next | Native compiler port (TypeScript 7) announced; check release notes for status |
(Versions and details evolve; always confirm in the official release notes before quoting a version number.)

## 11C. Framework and Library Typing

### F1. Redux Toolkit (typed store and hooks)
```ts
export const store = configureStore({ reducer: { todos: todosReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```
(Older versions use `TypedUseSelectorHook<RootState>`.)

### F2. React Query / TanStack Query
```ts
const { data, error } = useQuery<User[], Error>({ queryKey: ['users'], queryFn: () => http('/api/users', z.array(User)) });
// data: User[] | undefined
```
Let the type be inferred from `queryFn`; keep a typed `queryKey` factory.

### F3. Vue 3 with `<script setup lang="ts">`
```vue
<script setup lang="ts">
const props = defineProps<{ title: string; count?: number }>();
const emit = defineEmits<{ (e: 'update', value: number): void }>();
const n = ref<number>(0);
</script>
```

### F4. Angular
`strict: true` plus `strictTemplates`; typed reactive forms (`FormControl<string>`); typed DI tokens (`InjectionToken<Config>`); signals are typed (`signal<number>(0)`). Angular uses the **legacy-style decorators**, so keep the matching compiler options.

### F5. Next.js
Use `next/types` helpers and typed route params. In newer versions, `params` and `searchParams` for pages may be **Promises**; check your version's docs. Server Actions and route handlers should validate input with schemas.

### F6. Node.js / Express / NestJS
Install `@types/node`; validate `process.env` once; use DTO classes with decorators (`class-validator`) or Zod in NestJS; type `Request`/`Response` generics for params/body.

### F7. Testing (Jest/Vitest)
Use `ts-jest`, `@swc/jest` or Vitest. Type mocks with `vi.mocked(fn)` / `jest.Mocked<typeof mod>`. Include `vitest/globals` or `@types/jest` in `types`.

### F8. Styling and assets
`declare module '*.module.css' { const classes: Record<string, string>; export default classes; }`, `*.svg`, `*.png`. For Vite: `/// <reference types="vite/client" />` gives `import.meta.env` typing; augment `ImportMetaEnv` for your variables.

## 11D. JavaScript Interop and Mixed

### I1. JSDoc types in plain JavaScript
```js
// @ts-check
/** @param {number} a @param {number} b @returns {number} */
export function add(a, b) { return a + b; }
/** @typedef {{ id: number, name: string }} User */
```
Enable `checkJs: true` to type-check JS files. Good for gradual migration and for libraries that want no build step.

### I2. Importing JSON and CommonJS
`resolveJsonModule: true` types `import data from './data.json'`. For CommonJS interop use `esModuleInterop`. Under `nodenext`, JSON imports need import attributes: `import data from './data.json' with { type: 'json' }`.

### I3. Typing `window`, `document` and custom elements
```ts
declare global { interface HTMLElementTagNameMap { 'my-card': MyCardElement } }
const el = document.createElement('my-card');   // typed as MyCardElement
```

### I4. Typing environment variables
```ts
// vite-env.d.ts
interface ImportMetaEnv { readonly VITE_API_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
```
Variables are still strings at run time. Validate them.

### I5. Working with `fetch` and `JSON` safely
```ts
const res = await fetch('/api/user');
const raw: unknown = await res.json();
const user = UserSchema.parse(raw);        // validated and typed
```

---

# 🧠 Part 12: Compiler Internals

### B1. How does the TypeScript compiler work? (pipeline)
1. **Scanner/Lexer** turns source text into tokens.
2. **Parser** builds an **AST** (syntax tree).
3. **Binder** creates **symbols** and scopes, and sets up control-flow nodes.
4. **Checker** (the big one) resolves types, checks assignability, performs inference and narrowing.
5. **Emitter** transforms the AST (remove types, down-level syntax) and writes `.js`, `.d.ts`, and source maps.
The **language service** (`tsserver`) reuses these parts for editor features and keeps an incremental program in memory.

### B2. Structural typing and how assignability is decided
`S` is assignable to `T` if `S` has all required members of `T` with compatible types (recursively). The checker caches results for pairs of types. There are different relations: identity, subtype, assignable and comparable (used by `===` checks and assertions). `any` and `never` are special cases.

### B3. How inference works
For a call `f(args)`, the checker collects **candidates** for each type parameter from arguments (covariant and contravariant positions), picks the best candidate (union, common supertype, or first), uses **contextual typing** to type callbacks, and falls back to the constraint or `unknown`. `NoInfer<T>` (5.4) blocks inference from a position.

### B4. Type widening and narrowing
Mutable locations widen literals (`let x = 'a'` → `string`); `const` keeps the literal. Narrowing uses **control-flow analysis**: the binder builds a flow graph, and the checker computes the narrowed type at each reference.

### B5. What does TypeScript emit?
- Types, interfaces, type aliases: **removed**.
- `enum`: an object (IIFE), `const enum`: inlined.
- `namespace`: an IIFE/object.
- Parameter properties (`constructor(private x: number)`): assignments in the constructor.
- Decorators: helper calls (legacy) or standard decorator code.
- Class fields: depends on `target` and `useDefineForClassFields` (define semantics vs assignment semantics can differ).
- `import type`: removed. Imports used only as types are removed (unless `verbatimModuleSyntax`).

### B6. `isolatedModules` and why tools do not type-check
Tools like esbuild/SWC/Babel process **one file at a time** with no cross-file type information. They can strip types but cannot know whether an import is a type or a value, or check types. `isolatedModules` forbids constructs that need cross-file knowledge (re-exporting types without `export type`, ambient `const enum`). That is why a separate `tsc --noEmit` step is needed.

### B7. Module resolution algorithms
`node10` (CommonJS-style lookup in `node_modules`, `index.js`), `node16/nodenext` (follows Node's real ESM/CJS rules, `exports` maps, extension requirements), `bundler` (like Node resolution with `exports` support but without extension rules), and `classic` (legacy). `paths` and `baseUrl` remap import names for the type checker only.

### B8. Declaration emit and `.tsbuildinfo`
`declaration: true` produces `.d.ts` files that describe the public API. For this, the compiler may need to **print inferred types** into declarations, which can be large or fail (hence "annotate exported types"). `incremental`/`composite` store `.tsbuildinfo` with file hashes and dependency info to skip unchanged work.

### B9. Type instantiation and complexity limits
Generic types are **instantiated** lazily with type arguments and cached. Limits (instantiation depth, union size around 100,000 members) protect the compiler; exceeding them causes `TS2589` / `TS2590`. Conditional types are evaluated eagerly when their check type is concrete, and deferred when generic.

### B10. TypeScript vs Babel vs SWC vs esbuild
| | tsc | Babel (`preset-typescript`) | SWC / esbuild |
|---|---|---|---|
| Type checking | ✅ | ❌ | ❌ |
| Emit speed | Slower | Medium | Very fast |
| `.d.ts` generation | ✅ | ❌ | Limited (with `isolatedDeclarations`) |
| Decorators / enums | Full | Partial/plugins | Mostly supported |
Common setup: bundler for fast builds + `tsc --noEmit` for checking + `tsc --emitDeclarationOnly` for library types.

### B11. Variance computation
The checker infers whether a type parameter is covariant, contravariant, invariant or bivariant by marker-type probing, and caches the result. `in`/`out` annotations (4.7) tell it directly, which can speed up checking.

### B12. The native port (project Corsa)
The TypeScript team announced a port of the compiler and language service to Go (to be released as TypeScript 7) for much faster builds and editor responsiveness, with the same type-system behavior. The JavaScript-based compiler continues to receive updates during the transition. Check the official blog for the current status.

---

# 📋 Part 13: Reference Tables

### R1. Built-in types
| Type | Meaning |
|---|---|
| `string`, `number`, `boolean`, `bigint`, `symbol` | Primitives |
| `null`, `undefined` | Absent values (separate types with `strictNullChecks`) |
| `object` | Any non-primitive |
| `unknown` | Safe top type |
| `any` | Unsafe escape hatch (top + bottom behavior) |
| `never` | Bottom type (no values) |
| `void` | "No useful return value" |
| `T[]`, `Array<T>`, `readonly T[]` | Arrays |
| `[A, B]` | Tuple |
| `Record<K, V>` | Object with known key type |

### R2. Utility types
| Type | What it does |
|---|---|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties readonly |
| `Pick<T, K>` | Keep only keys `K` |
| `Omit<T, K>` | Remove keys `K` |
| `Record<K, V>` | Object type with keys `K` and values `V` |
| `Exclude<U, E>` | Remove members of a union |
| `Extract<U, E>` | Keep members of a union |
| `NonNullable<T>` | Remove `null` and `undefined` |
| `ReturnType<F>` | Function return type |
| `Parameters<F>` | Function parameter tuple |
| `ConstructorParameters<C>` | Constructor parameter tuple |
| `InstanceType<C>` | Instance type of a class |
| `ThisParameterType<F>` / `OmitThisParameter<F>` | Work with the `this` parameter |
| `Awaited<T>` | Unwrap Promise types |
| `NoInfer<T>` | Block inference from a position (5.4) |
| `Uppercase/Lowercase/Capitalize/Uncapitalize<S>` | String manipulation types |

### R3. Type operators
`keyof T`, `typeof x` (type query), `T[K]` (indexed access), `T extends U ? X : Y` (conditional), `{ [K in keyof T]: ... }` (mapped), `` `${A}-${B}` `` (template literal), `infer U`, `x is T` / `asserts x is T`, `unique symbol`, `satisfies`, `as const`, `readonly`, `-?` / `+?`.

### R4. Most useful `tsconfig` options
| Option | Purpose |
|---|---|
| `target` | Output JavaScript version |
| `module` | Module system of the output |
| `moduleResolution` | How imports are resolved (`bundler`, `nodenext`) |
| `lib` | Built-in type libraries |
| `strict` | Enable the strict family |
| `noUncheckedIndexedAccess` | Index access returns `T \| undefined` |
| `exactOptionalPropertyTypes` | Stricter optional properties |
| `noImplicitOverride` | Require `override` |
| `esModuleInterop` | CommonJS default-import interop |
| `skipLibCheck` | Skip checking `.d.ts` files |
| `isolatedModules` | Per-file transpile safety |
| `verbatimModuleSyntax` | Keep imports/exports as written; require `type` |
| `resolveJsonModule` | Import `.json` |
| `jsx` | JSX mode (`react-jsx`, `preserve`) |
| `paths` / `baseUrl` | Import aliases (type checker only) |
| `declaration` / `declarationMap` | Emit `.d.ts` files |
| `sourceMap` | Emit source maps |
| `outDir` / `rootDir` | Output / source layout |
| `noEmit` | Type check only |
| `incremental` / `composite` | Faster rebuilds / project references |
| `allowJs` / `checkJs` | Include / check JavaScript |
| `erasableSyntaxOnly` | Forbid non-erasable syntax (5.8) |

### R5. What `strict` includes
`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict` (and newer strictness flags added in later versions).

### R6. `any` vs `unknown` vs `never` (summary)
`any` = no checks. `unknown` = checks required before use. `never` = no possible value. Rule: prefer `unknown`; use `never` for exhaustiveness.

### R7. `type` vs `interface` (summary)
Use `interface` for extendable object contracts and class `implements`. Use `type` for unions, tuples, mapped and conditional types, and function types.

### R8. Common compiler error codes
`TS2322` (not assignable), `TS2339` (property missing), `TS2345` (bad argument), `TS7006` (implicit any), `TS18048/TS2532` (possibly undefined), `TS2307` (module not found), `TS2304` (cannot find name), `TS2554` (wrong argument count), `TS2769` (no overload matches), `TS2564` (not initialized), `TS7053` (cannot index), `TS2589` (too deep), `TS1484` (type-only import required), `TS18046` (unknown value).

### R9. Narrowing methods
`typeof`, `instanceof`, `in`, equality (`===`), truthiness, `Array.isArray`, discriminant property (`kind`), user-defined guards (`x is T`), assertion functions (`asserts`), `switch` with `never` exhaustiveness.

### R10. Safe handling of external data
| Source | Risky default | Safe approach |
|---|---|---|
| `fetch(...).json()` | `any` | `unknown` + schema parse |
| `JSON.parse` | `any` | `unknown` + schema parse |
| `process.env` | `string \| undefined` | Parse once with a schema |
| `localStorage` | `string \| null` | Parse + validate |
| `catch (e)` | `unknown` (strict) | `instanceof Error` check |
| Form data | `FormDataEntryValue` | Schema parse |


---

# 🧩 Part 14: "What Is the Type?" and Output Questions

> In TypeScript interviews you are often shown code and asked: **"What is the type of X?"** or **"Does this compile?"** Answer and give the reason.

### O1. Literal types: `let` vs `const`
```ts
let a = 'hi';
const b = 'hi';
```
**Answer:** `a` is `string`; `b` is `'hi'`. A mutable `let` widens literals; `const` keeps the literal type.

### O2. Array inference
```ts
const arr = [1, 'a'];
const t = [1, 'a'] as const;
```
**Answer:** `arr` is `(string | number)[]`; `t` is `readonly [1, 'a']`.

### O3. `keyof`
```ts
type K = keyof { a: 1; b: 2 };
```
**Answer:** `'a' | 'b'`.

### O4. `ReturnType` and `Awaited`
```ts
type R = ReturnType<() => Promise<string>>;
type A = Awaited<R>;
```
**Answer:** `R` is `Promise<string>`; `A` is `string`.

### O5. `Exclude`, `Extract`, `NonNullable`
```ts
type X1 = Exclude<'a' | 'b' | 'c', 'a'>;
type X2 = Extract<string | number | boolean, number | boolean>;
type X3 = NonNullable<string | null | undefined>;
```
**Answer:** `'b' | 'c'`, `number | boolean`, `string`.

### O6. Unions and intersections with special types
```ts
type A = string | never;
type B = string & number;
type C = unknown | string;
type D = any | string;
type E = unknown & string;
```
**Answer:** `string`, `never`, `unknown`, `any`, `string`.

### O7. Does this compile?
```ts
const x: string = null;      // with "strict": true
```
**Answer:** No. `TS2322: Type 'null' is not assignable to type 'string'` (because of `strictNullChecks`).

### O8. Excess property check
```ts
type P = { a: number };
const p1: P = { a: 1, b: 2 };
const tmp = { a: 1, b: 2 };
const p2: P = tmp;
```
**Answer:** `p1` is an **error** (fresh literal has an excess property `b`). `p2` is **fine** (not a fresh literal).

### O9. Narrowing by truthiness
```ts
function f(x: string | number | null) {
  if (x) { x; } else { x; }
}
```
**Answer:** in the `if` branch `x` is `string | number`. In the `else` branch it is still `string | number | null` (an empty string or `0` are falsy, and `null`).

### O10. `Object.keys`
```ts
const o = { a: 1, b: 2 };
const keys = Object.keys(o);
```
**Answer:** `string[]`, not `('a' | 'b')[]`.

### O11. Tuple types
```ts
type T = [string, number];
type A = T[0];
type L = T['length'];
type U = T[number];
```
**Answer:** `string`, `2`, `string | number`.

### O12. Enum types
```ts
enum E { A, B }
type K = keyof typeof E;
const x = E.A;
const name = E[0];
```
**Answer:** `K` is `'A' | 'B'`; `x` is `E.A` (value `0`); `name` is `string` (reverse mapping).

### O13. Distributive vs non-distributive conditional types
```ts
type ToArray<T> = T extends any ? T[] : never;
type NonDist<T> = [T] extends [any] ? T[] : never;
type A = ToArray<string | number>;
type B = NonDist<string | number>;
```
**Answer:** `A` is `string[] | number[]`; `B` is `(string | number)[]`.

### O14. `Parameters`
```ts
declare function fn(a: string, b?: number): void;
type P = Parameters<typeof fn>;
```
**Answer:** `[a: string, b?: number | undefined]`.

### O15. Template literal types
```ts
type G = `${'a' | 'b'}-${1 | 2}`;
```
**Answer:** `'a-1' | 'a-2' | 'b-1' | 'b-2'`.

### O16. `Record`
```ts
type R = Record<'a' | 'b', number>;
```
**Answer:** `{ a: number; b: number }`.

### O17. Readonly array
```ts
const nums: readonly number[] = [1, 2];
nums.push(3);
```
**Answer:** Error: `Property 'push' does not exist on type 'readonly number[]'`.

### O18. `as const` object
```ts
const o = { a: 1, b: 'x' } as const;
type A = typeof o.a;
type B = typeof o;
```
**Answer:** `A` is `1`; `B` is `{ readonly a: 1; readonly b: 'x' }`.

### O19. `satisfies`
```ts
const c = { a: 1, b: 'x' } satisfies Record<string, string | number>;
const d: Record<string, string | number> = { a: 1, b: 'x' };
```
**Answer:** `c.a` is `number` and `c.b` is `string` (precise). For `d`, both `d.a` and `d.b` are `string | number` (widened to the annotation).

### O20. Function assignability
```ts
type F2 = (a: string, b: number) => void;
type F1 = (a: string) => void;
let f2: F2 = (a: string) => {};      // ?
let f1: F1 = (a: string, b: number) => {};   // ?
```
**Answer:** The first compiles (fewer parameters are fine). The second is an error (it requires more parameters than the caller will provide).

### O21. `void` callbacks
```ts
type Cb = () => void;
const cb: Cb = () => 42;
```
**Answer:** Compiles. A function type returning `void` accepts functions that return something; the result is ignored.

### O22. `in` narrowing
```ts
type A = { a: number }; type B = { b: string };
function f(x: A | B) { if ('a' in x) { x; } else { x; } }
```
**Answer:** In the `if` branch `x` is `A`; in the `else` branch `x` is `B`.

### O23. Optional parameter type
```ts
function f(a?: string) { a; }
```
**Answer:** `string | undefined`.

### O24. Nested promises
```ts
type T = Awaited<Promise<Promise<number>>>;
```
**Answer:** `number`.

### O25. Index signatures
```ts
declare const dict: { [k: string]: number };
const v = dict.x;
```
**Answer:** `number` normally; `number | undefined` with `noUncheckedIndexedAccess`.

### O26. Generic inference with literals
```ts
function id<T>(x: T): T { return x; }
const r = id('a');
let s = id('a');
```
**Answer:** `r` is `'a'`; `s` is `string` (widened because `let` is mutable).

### O27. `Pick` and `Partial`
```ts
type A = Pick<{ a: 1; b: 2 }, 'a'>;
type B = Partial<{ a: number }>['a'];
```
**Answer:** `A` is `{ a: 1 }`; `B` is `number | undefined`.

### O28. `keyof any`
```ts
type K = keyof any;
```
**Answer:** `string | number | symbol` (same as `PropertyKey`).

### O29. Does this compile?
```ts
const arr: number[] = [1, 2, 3];
const first: number = arr[0];
```
**Answer:** Yes, normally (even if the array is empty at run time). With `noUncheckedIndexedAccess` it errors because `arr[0]` is `number | undefined`.

### O30. Overload resolution
```ts
declare function f(x: string): 1;
declare function f(x: number): 2;
declare function f(x: string | number): 3;
const r = f(Math.random() > 0.5 ? 'a' : 1);
```
**Answer:** `3`. The argument is `string | number`, so only the third overload matches.

### O31. Tuple with rest
```ts
type A = [number, ...string[]];
type B = A[1];
```
**Answer:** `string`.

### O32. `unknown` arithmetic
```ts
const x: unknown = 5;
const y = x + 1;
```
**Answer:** Error `TS18046: 'x' is of type 'unknown'`. Narrow first: `typeof x === 'number'`.

### O33. Union property access
```ts
type A = { id: number; name: string } | { id: number; age: number };
declare const v: A;
v.id; v.name;
```
**Answer:** `v.id` is fine (common to all members). `v.name` is an error until you narrow (`'name' in v`).

### O34. Class `private` and assignability
```ts
class A { private x = 1; }
class B { private x = 1; }
const a: A = new B();
```
**Answer:** Error. Classes with `private` members are only compatible if the private member comes from the **same declaration**.

### O35. Intersection with conflicting properties
```ts
type X = { a: string } & { a: number };
declare const x: X;
```
**Answer:** `x.a` is `never` (`string & number`). The type is not an error itself, but you can never create a value of it.

---

# ✅ Part 15: MCQs

1. TypeScript is a... → **Typed superset of JavaScript**
2. Who maintains TypeScript? → **Microsoft**
3. Are TypeScript types present at run time? → **No (erased)**
4. Which command only type-checks? → **`tsc --noEmit`**
5. Which type should you prefer for unknown data? → **`unknown`**
6. Which type has no values? → **`never`**
7. `interface` can be merged. True or false? → **True (declaration merging)**
8. Which can describe a union? → **`type`**
9. What does `Partial<T>` do? → **Makes all properties optional**
10. What does `Readonly<T>` do? → **Makes all properties readonly (shallow)**
11. What does `keyof T` return? → **Union of key names**
12. What does `typeof x` do in a type position? → **Gets the type of the variable**
13. What does `as const` do? → **Makes literals and readonly structures**
14. Which operator asserts a value is non-null? → **`!`**
15. Does `as` convert values at run time? → **No**
16. Which narrows a `string | number`? → **`typeof x === 'string'`**
17. What is a discriminated union? → **A union with a common literal property used to narrow**
18. Which keyword defines a type guard return? → **`x is T`**
19. What does `satisfies` do? → **Checks a type without widening the value**
20. Which makes a property optional? → **`?`**
21. What does `strictNullChecks` change? → **`null` and `undefined` are not assignable to other types**
22. Which flag disallows implicit `any`? → **`noImplicitAny`**
23. What does `skipLibCheck` skip? → **Type checking of `.d.ts` files**
24. What is `@types/node`? → **Type declarations for Node.js APIs**
25. What is a `.d.ts` file? → **A declaration file with types only**
26. Which import is erased at compile time? → **`import type`**
27. What is `Awaited<Promise<string>>`? → **`string`**
28. Which type extracts a function's return type? → **`ReturnType<F>`**
29. Which type removes keys? → **`Omit<T, K>`**
30. Which type builds an object from keys and values types? → **`Record<K, V>`**
31. What is the type of `[]` assigned to `const x = []` in strict mode? → **`any[]` that evolves (implicit any evolving array); annotate it**
32. Which is safer: `any` or `unknown`? → **`unknown`**
33. What does `noUncheckedIndexedAccess` do? → **Index access may be `undefined`**
34. What does `esModuleInterop` help with? → **Default imports of CommonJS modules**
35. What does `isolatedModules` ensure? → **Each file can be transpiled alone**
36. Which keyword makes a class method override explicit? → **`override`**
37. Which class modifier is enforced at run time? → **`#private`**
38. What is the difference between `private` and `#private`? → **TS-only vs real JS private**
39. What does `declare` do? → **Describes something that exists at run time; emits nothing**
40. Which tool validates data at run time and gives types? → **Zod (or similar schema libraries)**
41. What does `Exclude<'a' | 'b', 'a'>` give? → **`'b'`**
42. Which is a mapped type? → **`{ [K in keyof T]: T[K] }`**
43. Which is a conditional type? → **`T extends U ? X : Y`**
44. What does `infer` do? → **Captures a type inside a conditional type**
45. What is a branded type used for? → **Making structurally equal types incompatible**
46. Which flag turns on the strict family? → **`strict`**
47. Which is correct for suppressing an error that must be reported when fixed? → **`@ts-expect-error`**
48. What does `exactOptionalPropertyTypes` do? → **Disallows explicitly assigning `undefined` to optional properties**
49. How can esbuild/Vite users get type errors? → **Run `tsc --noEmit` separately**
50. What does the `NoInfer` utility (TS 5.4) do? → **Blocks inference from a position**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes developers make again and again in TypeScript projects. Interviewers ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Using `any` to make errors go away
**❌ Wrong:**
```ts
function process(data: any) { return data.items.map((i: any) => i.price * 2); }
```
**🤔 Why it is a problem:** `any` turns off type checking for everything it touches. Typos and wrong shapes appear only at run time, and `any` spreads to other code.

**✅ Correct:**
```ts
interface Item { price: number }
function process(data: { items: Item[] }) { return data.items.map((i) => i.price * 2); }
// for truly unknown input:
function parse(data: unknown) { /* validate, then use */ }
```
**💬 Say:** "I use `unknown` at boundaries and real types inside, and I track `any` as a metric."

---

### Mistake 2: Trusting `as` on external data
**❌ Wrong:**
```ts
const user = (await res.json()) as User;
```
**🤔 Why it is a problem:** `as` is a promise to the compiler, not a check. If the API changes, the app crashes later with confusing errors.

**✅ Correct:**
```ts
const user = UserSchema.parse(await res.json());     // validated at run time and typed
```
**💬 Say:** "Types vanish at run time, so I validate data at the boundary and derive the type from the schema."

---

### Mistake 3: Not enabling `strict`
**❌ Wrong:** a `tsconfig.json` without `"strict": true`.
**🤔 Why it is a problem:** `null`/`undefined` and implicit `any` slip through, which removes most of the value of TypeScript.

**✅ Correct:**
```json
{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }
```
For a legacy project, enable flags one at a time or by folder.
**💬 Say:** "`strict` is the baseline. Without it you only have half of TypeScript."

---

### Mistake 4: Overusing the non-null assertion `!`
**❌ Wrong:**
```ts
const el = document.getElementById('app')!;
el.textContent = user!.name!;
```
**🤔 Why it is a problem:** `!` silences the compiler and adds no run-time check. A `null` still crashes.

**✅ Correct:**
```ts
const el = document.getElementById('app');
if (!el) throw new Error('#app not found');
el.textContent = user?.name ?? 'Guest';
```
**💬 Say:** "I narrow with a real check instead of asserting."

---

### Mistake 5: `@ts-ignore` everywhere
**❌ Wrong:**
```ts
// @ts-ignore
doSomething(wrongArg);
```
**🤔 Why it is a problem:** It hides the error forever, even after the code changes and the error becomes real.

**✅ Correct:**
```ts
// @ts-expect-error -- library types are wrong for v2.1, see issue #123
doSomething(wrongArg);
```
**💬 Say:** "`@ts-expect-error` with a reason: it fails the build when it is no longer needed."

---

### Mistake 6: Using `Function`, `Object`, `{}`, `String`, `Number`
**❌ Wrong:**
```ts
function run(cb: Function, data: Object, flag: Boolean) {}
```
**🤔 Why it is a problem:** `Function` accepts any callable with no signature, `Object`/`{}` accept almost everything including primitives, and wrapper types (`String`, `Number`, `Boolean`) are not the primitives you mean.

**✅ Correct:**
```ts
function run(cb: (n: number) => void, data: Record<string, unknown>, flag: boolean) {}
```
**💬 Say:** "I write real signatures and use lowercase primitive types."

---

### Mistake 7: Writing types by hand that duplicate a schema
**❌ Wrong:**
```ts
interface User { id: number; name: string }
const UserSchema = z.object({ id: z.number(), name: z.string() });     // can drift apart
```
**🤔 Why it is a problem:** The interface and the validator can become out of sync, and the compiler cannot tell.

**✅ Correct:**
```ts
const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;
```
**💬 Say:** "One source of truth: the schema produces the type."

---

### Mistake 8: Numeric `enum`s and `const enum` problems
**❌ Wrong:**
```ts
enum Status { Active, Inactive }          // numbers in the database; reorder = data corruption
const enum Dir { Up, Down }                // breaks with isolatedModules / some build tools
```
**🤔 Why it is a problem:** Reordering changes values; enums emit runtime code and are not "erasable" syntax; `const enum` is unsafe across package boundaries.

**✅ Correct:**
```ts
const Status = { Active: 'active', Inactive: 'inactive' } as const;
type Status = (typeof Status)[keyof typeof Status];
```
**💬 Say:** "I prefer string unions or `as const` objects: simple, tree-shakable, no surprises."

---

### Mistake 9: Boolean flags instead of a discriminated union
**❌ Wrong:**
```ts
type State = { loading: boolean; error?: string; data?: User[] };
```
**🤔 Why it is a problem:** Impossible states are allowed (`loading: true` with `data` and `error`). You must check many combinations.

**✅ Correct:**
```ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: User[] };
```
**💬 Say:** "Make impossible states unrepresentable."

---

### Mistake 10: Forgetting `import type` / type-only exports
**❌ Wrong:**
```ts
import { User } from './types';      // User is only a type
export { User } from './types';      // may fail with isolatedModules
```
**🤔 Why it is a problem:** Transpilers that work per file cannot know it is a type; this can leave a runtime import or fail the build (`TS1205`, `TS1484`).

**✅ Correct:**
```ts
import type { User } from './types';
export type { User } from './types';
```
**💬 Say:** "I use `import type` and enable `verbatimModuleSyntax`."

---

### Mistake 11: Not annotating exported function return types
**❌ Wrong:**
```ts
export function load(id: string) { return db.query(/* huge inferred type */); }
```
**🤔 Why it is a problem:** The return type is whatever the body happens to return, so it can change silently and leak internal types. It also slows declaration emit.

**✅ Correct:**
```ts
export function load(id: string): Promise<User | null> { return db.query(/* ... */); }
```
**💬 Say:** "Exported functions get explicit return types: that is the contract."

---

### Mistake 12: Assuming `Object.keys` returns the keys type
**❌ Wrong:**
```ts
for (const k of Object.keys(user)) { console.log(user[k]); }     // TS7053
```
**🤔 Why it is a problem:** `Object.keys` returns `string[]`. Indexing with a plain `string` is not allowed.

**✅ Correct:**
```ts
for (const [k, v] of Object.entries(user)) console.log(k, v);
const keys = Object.keys(user) as Array<keyof typeof user>;      // only when the object is exact
```
**💬 Say:** "An object can have extra keys at run time, so `keyof T` would not be safe."

---

### Mistake 13: Casting instead of narrowing
**❌ Wrong:**
```ts
function size(x: string | string[]) { return (x as string[]).length; }
```
**🤔 Why it is a problem:** For a string it returns the string length, which only works by accident. Logic bugs hide behind the cast.

**✅ Correct:**
```ts
function size(x: string | string[]) { return Array.isArray(x) ? x.length : x.trim().length; }
```
**💬 Say:** "Narrowing proves the type; casting only claims it."

---

### Mistake 14: Overusing `Partial<T>`
**❌ Wrong:**
```ts
function createUser(data: Partial<User>) { /* all optional: required fields can be missing */ }
```
**🤔 Why it is a problem:** Required data can be missing, and `Partial` allows `undefined` values.

**✅ Correct:**
```ts
type CreateUser = Omit<User, 'id' | 'createdAt'>;
type UpdateUser = Partial<Omit<User, 'id'>>;
```
**💬 Say:** "I model Create and Update shapes explicitly."

---

### Mistake 15: Over-engineered generics and type puzzles
**❌ Wrong:** A 40-line recursive conditional type for a function used twice.
**🤔 Why it is a problem:** Hard to read, slow to compile, and the error messages are unreadable for teammates.

**✅ Correct:** Use simple unions, interfaces and a few generics. Keep advanced types in a small, tested library with type tests.
**💬 Say:** "I keep a complexity budget: the type must be easier to understand than the bug it prevents."

---

### Mistake 16: Relying on a bundler for type safety
**❌ Wrong:** Vite/esbuild/SWC builds succeed, and nobody runs `tsc`.
**🤔 Why it is a problem:** These tools strip types and do **not** type-check, so type errors reach production.

**✅ Correct:**
```json
{ "scripts": { "typecheck": "tsc --noEmit", "build": "vite build" } }
```
Run `typecheck` in CI (and in the editor).
**💬 Say:** "Build speed and type safety are separate steps."

---

### Mistake 17: Path aliases that work only in the type checker
**❌ Wrong:**
```json
{ "compilerOptions": { "paths": { "@/*": ["src/*"] } } }
```
and nothing else.
**🤔 Why it is a problem:** `tsc` is happy, but at run time `@/utils` cannot be resolved.

**✅ Correct:** Configure the same alias in the bundler (Vite `resolve.alias`, webpack `resolve.alias`) or use Node `imports` / `tsconfig-paths`.
**💬 Say:** "`paths` is for the type checker only."

---

### Mistake 18: Ignoring array-index and `undefined` safety
**❌ Wrong:**
```ts
const first = users[0];
console.log(first.name);       // crashes on an empty array
```
**🤔 Why it is a problem:** `users[0]` is typed `User` even if the array is empty.

**✅ Correct:**
```ts
// tsconfig: "noUncheckedIndexedAccess": true
const first = users[0];
if (first) console.log(first.name);
```
**💬 Say:** "I enable `noUncheckedIndexedAccess` for safer index access."

---

### Mistake 19: Unsafe type guards
**❌ Wrong:**
```ts
function isUser(x: any): x is User { return true; }
```
**🤔 Why it is a problem:** The compiler trusts your return type predicate. A wrong guard gives false safety.

**✅ Correct:**
```ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && typeof (x as User).id === 'number' && typeof (x as User).name === 'string';
}
// or use a schema: UserSchema.safeParse(x).success
```
**💬 Say:** "A type guard is code; I test it."

---

### Mistake 20: Typing `catch (e: any)`
**❌ Wrong:**
```ts
try { run(); } catch (e: any) { console.log(e.message); }
```
**🤔 Why it is a problem:** Anything can be thrown (strings, objects), so `e.message` can crash inside the handler.

**✅ Correct:**
```ts
try { run(); } catch (e) { console.log(e instanceof Error ? e.message : String(e)); }
```
**💬 Say:** "`catch` variables are `unknown`; I narrow them."

---

### Mistake 21: Duplicated or mismatched `@types` and TypeScript versions
**❌ Wrong:** two versions of `@types/react` in the tree, or old `@types/node` with a new Node.
**🤔 Why it is a problem:** Strange errors such as "Type X is not assignable to type X" (two copies of the same type).

**✅ Correct:** Dedupe with the package manager (`npm dedupe`, `overrides`/`resolutions`), keep one TypeScript version in a monorepo, and align `@types/*` with runtime versions.
**💬 Say:** "When a type is 'not assignable to itself', I look for duplicate packages."

---

### Mistake 22: Global type pollution
**❌ Wrong:**
```ts
// types.d.ts (a script file with no imports)
interface User { id: number }      // becomes a global type everywhere
```
**🤔 Why it is a problem:** Names can clash across the project and libraries, and the origin is unclear.

**✅ Correct:** Put types in modules (`export interface User {}`) and use `declare global` only for real globals.
**💬 Say:** "I keep types module-scoped and import them."

---

### Mistake 23: Floating promises and async handlers
**❌ Wrong:**
```ts
button.addEventListener('click', async () => { await save(); });      // errors are unhandled
save();                                                               // not awaited
```
**🤔 Why it is a problem:** TypeScript does not warn about ignored promises. Rejections become unhandled.

**✅ Correct:** Enable `@typescript-eslint/no-floating-promises` and `no-misused-promises`; always `await` or `.catch`.
**💬 Say:** "The compiler allows it; the linter must catch it."

---

### Mistake 24: Mutating "readonly" data through an alias
**❌ Wrong:**
```ts
const original: readonly number[] = [3, 1, 2];
const arr = original as number[];        // assertion removes readonly
arr.sort();                              // mutates the original array
```
**🤔 Why it is a problem:** `readonly` is only a compile-time promise and is shallow.

**✅ Correct:**
```ts
const sorted = original.toSorted();         // or [...original].sort()
```
**💬 Say:** "I copy instead of casting away `readonly`."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you answer. A junior lists type syntax. A senior explains **compile-time vs run-time, trade-offs, boundaries and cost**.
> **What should you do?** Practice the "Strong" style for every question.

### Signal 1: You separate compile time from run time
| | Example answer |
|---|---|
| ❌ Weak | "TypeScript makes JavaScript safe." |
| ✅ Strong | "TypeScript checks types at compile time and erases them. It cannot protect against bad runtime data, so I validate at the boundaries with a schema (Zod) and derive the static type from it with `z.infer`. Inside the app I trust the validated types." |
**Prove it:** mention erasure, `unknown`, schema validation, `as` risks.

### Signal 2: You use the type system to make illegal states impossible
| | Example answer |
|---|---|
| ❌ Weak | "I add `?` to properties and booleans for loading state." |
| ✅ Strong | "I model state as a discriminated union (`idle | loading | success | error`) and use an `assertNever` check so that adding a new state fails the build until every `switch` handles it. I use branded types for IDs." |
**Prove it:** discriminated unions, exhaustiveness, branded types.

### Signal 3: You know the generic and conditional type toolbox
| | Example answer |
|---|---|
| ❌ Weak | "I use generics sometimes." |
| ✅ Strong | "I use constrained generics with `keyof`, mapped types with key remapping, conditional types with `infer`, and template literal types for typed routes. I can re-implement `Pick`, `Omit`, `ReturnType` and `DeepPartial` and explain distribution." |
**Prove it:** write 3 utility types from memory.

### Signal 4: You know TypeScript's limits and unsoundness
| | Example answer |
|---|---|
| ❌ Weak | "If it compiles, it works." |
| ✅ Strong | "TypeScript is intentionally unsound: array covariance, method bivariance, `any`, `as`, `!`, `JSON.parse` returning `any`, and unchecked index access. I turn on `noUncheckedIndexedAccess`, ban `any` in core code and use `unknown` and schemas." |
**Prove it:** list 4 unsoundness cases.

### Signal 5: You care about tooling, config and performance
| | Example answer |
|---|---|
| ❌ Weak | "I use the default tsconfig." |
| ✅ Strong | "`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: bundler` or `nodenext` matching the runtime, `isolatedModules` for transpilers, and a separate `tsc --noEmit` in CI. For slow checks I use `--generateTrace`, project references and explicit return types." |
**Prove it:** explain `target` vs `lib`, `paths`, why Vite does not type-check.

### Signal 6: You design public types as an API
| | Example answer |
|---|---|
| ❌ Weak | "I export everything." |
| ✅ Strong | "Exported functions have explicit return types, I limit leaking internal types, use `exports` with a `types` condition, treat type changes as semver changes, and test types with `expectTypeOf`/`tsd` and a consumer project." |
**Prove it:** library authoring story.

### Signal 7: You lead adoption and migration
| | Example answer |
|---|---|
| ❌ Weak | "We converted files to .ts." |
| ✅ Strong | "We started with `allowJs`, typed the boundaries first, enabled strict flags gradually, added codemods and CI gates, and tracked the `any` count and percent typed. Production type-related errors dropped by 35%." |
**Prove it:** metrics and process.

### Signal 8: You keep types simple and readable
| | Example answer |
|---|---|
| ❌ Weak | "I wrote a clever type that nobody understands." |
| ✅ Strong | "I keep a complexity budget. Advanced types live in a small, tested internal library with comments. App code uses simple unions and interfaces, because readable errors matter more than cleverness." |
**Prove it:** give a time you simplified a type.

### 🔊 Phrases that sound senior
- "Types are erased, so I validate at the boundary."
- "I make illegal states unrepresentable."
- "`unknown` at the edges, real types inside."
- "That is a type-level change, so it is a breaking change for consumers."
- "The bundler doesn't type-check, so CI runs `tsc --noEmit`."
- "I'd rather have a simpler type and a runtime check than a clever type."

### 🚩 Phrases that sound junior
- "I just use `any` when it errors." · "I cast it with `as`." · "TypeScript guarantees no runtime errors." · "I use `@ts-ignore`." · "I don't know why the type is `never`." · "Interfaces and types are the same, I pick randomly."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Types are erased** (compile time vs run time)
2. **Inference, widening and narrowing**
3. **`any` vs `unknown` vs `never`**
4. **`interface` vs `type`**
5. **Unions, intersections, discriminated unions**
6. **Generics + constraints + `keyof`**
7. **Utility types and how they are built** (mapped + conditional + `infer`)
8. **`strict` and key tsconfig options**
9. **Structural typing and excess property checks**
10. **Runtime validation at boundaries** (schemas, `unknown`, type guards)

## 18.2 Recommended `tsconfig` (modern app)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["src"]
}
```
(For Node libraries use `module`/`moduleResolution: nodenext` and emit to `dist`.)

## 18.3 Pick the right tool
| Need | Use |
|---|---|
| Unknown external data | `unknown` + schema (`z.parse`) |
| Object contract that can be extended | `interface` |
| Union / tuple / mapped / conditional | `type` |
| State with variants | Discriminated union + `assertNever` |
| Enum-like values | `as const` object + union type |
| Keep literal types in config | `as const` or `satisfies` |
| Type from a value | `typeof value` |
| Type from a function | `ReturnType` / `Parameters` / `Awaited` |
| Make IDs not interchangeable | Branded types |
| Narrow custom shapes | `x is T` guards |
| Reuse logic across types | Generics with constraints |
| Suppress a known error | `@ts-expect-error` + reason |

## 18.4 Narrowing cheat
`typeof`, `instanceof`, `in`, `===`, truthiness, `Array.isArray`, `switch (x.kind)`, `x is T`, `asserts x is T`, optional chaining, early `throw`/`return`.

## 18.5 Utility types in one line each
`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `InstanceType`, `Awaited`, `NoInfer`.

## 18.6 Build and tooling checklist
- [ ] `tsc --noEmit` in CI (bundlers do not type-check)
- [ ] `strict` + `noUncheckedIndexedAccess`
- [ ] `typescript-eslint` with `no-floating-promises`, `no-explicit-any`, `consistent-type-imports`
- [ ] `import type` and `verbatimModuleSyntax`
- [ ] `skipLibCheck`, project references for monorepos
- [ ] Source maps uploaded to error tracking
- [ ] Single TypeScript version across the repo
- [ ] Explicit return types on exports; type tests for utility types

## 18.7 Safety checklist for runtime boundaries
- [ ] API responses: `unknown` → schema parse
- [ ] `process.env`: parse once at startup
- [ ] `localStorage`/cookies/query params: validate
- [ ] No `as` on untrusted data
- [ ] `catch (e)`: narrow `unknown`
- [ ] Don't trust type guards you did not test

## 18.8 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| `TS2322` not assignable | Wrong value or too narrow type | Fix value / widen type / convert |
| `TS2339` property missing | Union not narrowed or typo | Narrow / fix type |
| `TS7006` implicit any | Missing parameter type | Add type or contextual type |
| `TS18048` possibly undefined | Missing null check | `?.`, `??`, guard |
| `TS2307` cannot find module | Path / types / extension | Fix path, install `@types`, `.js` ext in nodenext |
| `TS7053` cannot index | Index with `string` | `keyof typeof`, `Record`, guard |
| `TS2589` too deep | Recursive type | Simplify / tail recursion |
| `TS1484` type-only import | `verbatimModuleSyntax` | `import type` |
| Compiles but crashes | Types lied at the boundary | Validate with a schema |
| Passes in Vite, fails in CI | Vite does not type-check | Run `tsc --noEmit` |
| Alias works in tsc, fails at run time | `paths` is type-only | Configure the bundler alias |
| "X is not assignable to X" | Duplicate type packages | Dedupe versions |

## 18.9 30-second answers
- **What is TypeScript?** A typed superset of JavaScript that checks types at compile time and compiles to plain JavaScript.
- **`any` vs `unknown`?** `any` disables checks; `unknown` forces you to narrow before use.
- **`interface` vs `type`?** Interfaces merge and extend; types can name unions, tuples, mapped and conditional types. Be consistent.
- **What are generics?** Type parameters that keep reusable code type-safe; constrain with `extends`.
- **What is a discriminated union?** A union with a common literal field that lets the compiler narrow each case.
- **Do types exist at run time?** No. Validate external data with schemas.
- **What does `strict` do?** Turns on `noImplicitAny`, `strictNullChecks` and other safety flags.
- **How do you migrate JS to TS?** `allowJs`, boundary types first, strict flags gradually, codemods, CI gate, metrics.
- **What is `satisfies`?** Checks a value against a type without widening its inferred type.
- **Why do we need `tsc --noEmit` with Vite?** Vite strips types without checking them.

## 18.10 Last-minute checklist before the interview
- [ ] I can write `Pick`, `Omit`, `ReturnType`, `DeepPartial` and `UnionToIntersection` from memory.
- [ ] I can explain narrowing, discriminated unions and `never` exhaustiveness with code.
- [ ] I can explain why types are erased and how I validate runtime data.
- [ ] I know the main `tsconfig` flags and what `strict` includes.
- [ ] I can read a compiler error from the last line and name the likely fix.
- [ ] I have one story about a bug prevented by types and one about a migration or performance fix, with numbers.
- [ ] I can compare `enum`, union and `as const` objects, and `interface` vs `type`.
