# JavaScript Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Covers modern JavaScript (ES2015 → ES2024/2025). Newer features are marked, because some need a recent browser or Node version.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** In JavaScript interviews, *explaining what happens inside the engine* is what separates levels. For every answer, try to add: **what the engine does + a small code example + one pitfall.**

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks (Polyfills & Utilities)](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Classic + ES6+ + APIs + Mixed)](#-part-11-complete-coverage-classic--es6--apis--mixed)
- [Part 12: Engine Internals](#-part-12-engine-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output-Based Questions](#-part-14-output-based-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is JavaScript? What are its main features? *(Conceptual)*
**Answer:** JavaScript is a high-level, **dynamically typed**, **multi-paradigm** language (object-oriented, functional, event-driven). It runs in browsers and on servers (Node.js, Deno, Bun). Main features:
- **Single-threaded** with an **event loop** (one call stack, non-blocking I/O through callbacks, promises)
- **Prototype-based** inheritance (classes are syntax on top of prototypes)
- **First-class functions** (functions are values)
- **Just-in-time (JIT) compiled** by the engine (V8, SpiderMonkey, JavaScriptCore), not purely "interpreted"
- **Dynamic typing** and automatic type coercion

**JavaScript vs ECMAScript:** ECMAScript (ES) is the **specification**. JavaScript is the **implementation** of that spec plus host APIs (DOM, `fetch`, `window` in browsers; `fs`, `process` in Node).

### Q2. `var`, `let` and `const`: what is the difference? *(Must-know)*
| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Hoisted, initialized as `undefined` | Hoisted, **not initialized** (TDZ) | Hoisted, **not initialized** (TDZ) |
| Re-declare in same scope | ✅ Allowed | ❌ Error | ❌ Error |
| Re-assign | ✅ | ✅ | ❌ (the binding is fixed) |
| Creates `window` property (global) | ✅ | ❌ | ❌ |

```js
if (true) { var a = 1; let b = 2; const c = 3; }
console.log(a);          // 1
// console.log(b);       // ReferenceError: b is not defined
const user = { name: 'Ritesh' };
user.name = 'Kumar';     // OK: the object is mutable
// user = {};            // TypeError: Assignment to constant variable
```
**Best practice:** use `const` by default, `let` when you need to re-assign, avoid `var`.

### Q3. What are the data types in JavaScript?
**Primitives (7):** `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`. **Non-primitive:** `object` (arrays, functions, dates, maps, sets... are all objects).
- Primitives are **immutable** and compared **by value**.
- Objects are compared **by reference**.
```js
'a' === 'a';          // true
{} === {};            // false (two different references)
```

### Q4. What does `typeof` return? What are its quirks?
```js
typeof 'hi';          // 'string'
typeof 42;            // 'number'
typeof 10n;           // 'bigint'
typeof true;          // 'boolean'
typeof undefined;     // 'undefined'
typeof Symbol();      // 'symbol'
typeof null;          // 'object'   <-- historical bug
typeof [];            // 'object'   (use Array.isArray)
typeof function(){};  // 'function'
typeof NaN;           // 'number'
typeof notDeclared;   // 'undefined' (no error)
```
To check for `null`: `value === null`. To check an array: `Array.isArray(value)`.

### Q5. `==` vs `===` vs `Object.is`? *(Comparison)*
- `===` (strict): compares type and value, **no coercion**.
- `==` (loose): converts types first (complicated rules).
- `Object.is`: like `===` but treats `NaN` as equal to `NaN` and `+0` different from `-0`.
```js
1 == '1';            // true
1 === '1';           // false
null == undefined;   // true
null === undefined;  // false
NaN === NaN;         // false
Object.is(NaN, NaN); // true
Object.is(0, -0);    // false
```
**Rule:** always use `===`. The only common exception: `value == null` to check for both `null` and `undefined`.

### Q6. What are truthy and falsy values?
**Falsy (8 values):** `false`, `0`, `-0`, `0n`, `""` (empty string), `null`, `undefined`, `NaN`. **Everything else is truthy**, including `"0"`, `"false"`, `[]`, `{}`, and `function(){}`.
```js
if ([]) console.log('empty array is truthy');
if ('0') console.log('"0" is truthy');
```

### Q7. `null` vs `undefined` vs "not defined"?
- `undefined`: a variable is declared but has no value (or a missing property, or a function with no return).
- `null`: an intentional "no value" assigned by the programmer.
- **not defined:** the variable was never declared → `ReferenceError`.
```js
let a;               // undefined
let b = null;        // null
console.log(c);      // ReferenceError: c is not defined
```

### Q8. What is hoisting? What is the Temporal Dead Zone (TDZ)? *(Must-know)*
**Hoisting:** during the creation phase of an execution context, the engine registers declarations before running code.
- `var` → hoisted and set to `undefined`.
- Function declarations → hoisted **with their body**.
- `let` / `const` / `class` → hoisted but **uninitialized**: accessing them before the declaration throws a `ReferenceError`. The time between the start of the scope and the declaration is the **TDZ**.
```js
console.log(a);   // undefined
var a = 5;

console.log(sum(1, 2)); // 3 (function declaration is hoisted)
function sum(x, y) { return x + y; }

// console.log(b);      // ReferenceError: Cannot access 'b' before initialization
let b = 1;

// console.log(mul(2,3)); // TypeError: mul is not a function (var hoisted as undefined)
var mul = function (x, y) { return x * y; };
```

### Q9. What is scope? What is the scope chain?
**Scope** decides where a variable can be accessed. Types: **global**, **function**, **block** (`let`/`const`), and **module** scope. The **scope chain** means: if a variable is not found in the current scope, the engine looks in the parent (outer) scope, and so on up to global. This is **lexical scoping**: scope is decided by where the code is *written*, not where the function is *called*.
```js
const g = 'global';
function outer() {
  const o = 'outer';
  function inner() { console.log(g, o); }   // finds g and o via the scope chain
  inner();
}
outer();
```

### Q10. What are the different ways to write functions?
```js
function add(a, b) { return a + b; }                 // declaration (hoisted)
const sub = function (a, b) { return a - b; };       // expression (not hoisted usable)
const mul = (a, b) => a * b;                          // arrow function
(function () { console.log('IIFE'); })();            // IIFE (runs immediately)
function greet(name = 'Ritesh') { return `Hi ${name}`; }   // default parameter
function total(...nums) { return nums.reduce((s, n) => s + n, 0); } // rest parameter
```

### Q11. Arrow function vs regular function? *(Comparison)*
| | Regular function | Arrow function |
|---|---|---|
| `this` | Depends on **how it is called** | **Lexical**: taken from the surrounding scope |
| `arguments` object | ✅ | ❌ (use rest parameters) |
| Can be used with `new` (constructor) | ✅ | ❌ |
| Has `prototype` | ✅ | ❌ |
| Can be a method that needs its own `this` | ✅ | ❌ (not suitable) |
| Implicit return | ❌ | ✅ for single expression |
```js
const timer = {
  seconds: 0,
  start() { setInterval(() => { this.seconds++; }, 1000); }   // arrow keeps timer as this
};
```

### Q12. What are template literals?
Strings in backticks with `${}` interpolation, multi-line support and **tagged templates**.
```js
const name = 'Ritesh Kumar';
const msg = `Hello, ${name}!
Total: ${2 + 3}`;
```

### Q13. What is destructuring?
```js
const [a, , b = 10, ...rest] = [1, 2, undefined, 4, 5];   // a=1, b=10, rest=[4,5]
const { name, age: years = 30, address: { city } = {} } = { name: 'Ritesh', address: { city: 'Patna' } };
[x, y] = [y, x];                                           // swap variables
function show({ id, title = 'Untitled' }) { return `${id}: ${title}`; }
```

### Q14. Spread vs rest (`...`)?
- **Spread** expands an iterable/object into elements: `[...a, ...b]`, `{ ...obj, extra: 1 }`, `fn(...args)`.
- **Rest** collects the remaining items into an array/object: `function f(...args)`, `const [first, ...others] = arr`.
Same syntax, opposite directions. Spread makes a **shallow** copy.

### Q15. Important array methods?
| Method | Returns | Mutates original? |
|---|---|---|
| `map(fn)` | new array | No |
| `filter(fn)` | new array | No |
| `reduce(fn, init)` | single value | No |
| `forEach(fn)` | `undefined` | No |
| `find(fn)` / `findIndex(fn)` | element / index | No |
| `some(fn)` / `every(fn)` | boolean | No |
| `includes(x)` / `indexOf(x)` | boolean / index | No |
| `slice(s, e)` | new array | No |
| `splice(i, n, ...items)` | removed items | **Yes** |
| `push` / `pop` / `shift` / `unshift` | length / item | **Yes** |
| `sort(cmp)` / `reverse()` | same array | **Yes** |
| `concat`, `flat`, `flatMap` | new array | No |
| `toSorted`, `toReversed`, `toSpliced`, `with` (ES2023) | new array | No |
```js
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0);          // [2, 4]
const doubled = nums.map(n => n * 2);                 // [2, 4, 6, 8]
const sum = nums.reduce((acc, n) => acc + n, 0);      // 10
```

### Q16. How do you work with objects?
```js
const user = { name: 'Ritesh', 'home-city': 'Patna', [`id_${1}`]: 7 };   // computed key
user.name; user['home-city'];                // dot vs bracket
Object.keys(user); Object.values(user); Object.entries(user);
'name' in user;                              // true (includes inherited)
Object.hasOwn(user, 'name');                 // true (own property only, ES2022)
const { name, ...others } = user;            // rest in destructuring
Object.assign({}, user, { age: 30 });        // merge
```

### Q17. Loops: `for`, `for...of`, `for...in`, `forEach`?
- `for` / `while`: general loops, support `break` and `continue`.
- `for...of`: iterates **values** of an iterable (array, string, Map, Set).
- `for...in`: iterates **enumerable keys** (including inherited). Avoid for arrays.
- `forEach`: array only, **cannot break**, and does not wait for `await`.
```js
for (const v of ['a', 'b']) console.log(v);          // a b
for (const k in { x: 1, y: 2 }) console.log(k);      // x y
```

### Q18. What is type coercion?
Automatic conversion between types.
```js
'5' + 3;       // '53'   (+ with a string concatenates)
'5' - 3;       // 2      (- converts to number)
true + 1;      // 2
[] + {};       // '[object Object]'
Number('12px'); // NaN
Boolean('');   // false
String(123);   // '123' (explicit)
```
Prefer **explicit** conversion: `Number()`, `String()`, `Boolean()`.

### Q19. What is strict mode?
`'use strict'` (or ES modules and classes, which are strict by default) removes silent errors: assigning to undeclared variables throws, `this` in a plain function call is `undefined` (not the global object), duplicate parameter names are disallowed, and writing to read-only properties throws.

### Q20. Essential string methods
```js
const s = '  Hello World  ';
s.trim(); s.toUpperCase(); s.toLowerCase();
s.includes('World'); s.startsWith('He'); s.endsWith('d');
s.indexOf('o'); s.slice(2, 7); s.split(' '); s.replace('World', 'JS'); s.replaceAll('l', 'L');
s.padStart(20, '*'); s.repeat(2); s.at(-1); 'a,b,c'.split(',').join('-');
```
Strings are **immutable**: methods return new strings.

### Q21. Numbers and `Math`
```js
0.1 + 0.2;                       // 0.30000000000000004 (binary floating point)
(0.1 + 0.2).toFixed(2);          // '0.30' (string!)
Number.isInteger(5);             // true
Number.isNaN(NaN);               // true (isNaN('abc') also true: it coerces first)
parseInt('42px');                // 42
parseFloat('3.14abc');           // 3.14
Math.floor(4.7); Math.ceil(4.2); Math.round(4.5); Math.trunc(-4.7);
Math.max(...[1, 5, 3]); Math.random();
Number.MAX_SAFE_INTEGER;         // 9007199254740991
```
For money, store integers (paise/cents) or use a decimal library.

### Q22. Dates
```js
const now = new Date();
now.getFullYear(); now.getMonth();   // month is 0-11 (January = 0)
new Date('2026-01-15');              // parsed as UTC
new Date(2026, 0, 15);               // local time, month 0 = January
Date.now();                          // milliseconds since 1970 UTC
now.toISOString();                   // '2026-01-15T10:30:00.000Z'
new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(now);
```

### Q23. `JSON.stringify` and `JSON.parse`
```js
const data = { name: 'Ritesh', skills: ['js', 'react'], fn() {}, u: undefined };
const text = JSON.stringify(data);          // '{"name":"Ritesh","skills":["js","react"]}'
JSON.parse(text);                           // back to an object
JSON.stringify(data, null, 2);              // pretty print
```
`undefined`, functions and symbols are dropped; `Date` becomes a string; circular references throw a `TypeError`.

### Q24. DOM basics: select, change, listen
```js
const btn = document.querySelector('#save');
const items = document.querySelectorAll('.item');
btn.addEventListener('click', (event) => {
  event.preventDefault();
  btn.classList.toggle('active');
  btn.textContent = 'Saved';
});
const li = document.createElement('li');
li.textContent = 'New item';
document.querySelector('ul').append(li);
```

### Q25. What is a callback?
A function passed to another function to be called later (after an event, a timer or an operation finishes).
```js
function fetchUser(id, callback) {
  setTimeout(() => callback(null, { id, name: 'Ritesh' }), 500);
}
fetchUser(1, (err, user) => { if (err) return console.error(err); console.log(user); });
```
Deeply nested callbacks are called **callback hell**. Promises and `async/await` solve it.

### Q26. `try`, `catch`, `finally`, `throw`
```js
try {
  JSON.parse('{ bad json');
} catch (err) {
  console.error(err.name, err.message);       // SyntaxError ...
} finally {
  console.log('always runs');
}
throw new Error('Something failed');
```
Built-in errors: `Error`, `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError`, `URIError`, `EvalError`, `AggregateError`.

### Q27. Pass by value vs pass by reference?
Primitives are copied **by value**. Objects are passed as a **copy of the reference** ("pass by sharing"): the function can change the object's contents, but reassigning the parameter does not affect the caller.
```js
function change(obj, num) { obj.x = 99; obj = { x: 0 }; num = 100; }
const o = { x: 1 }; let n = 5;
change(o, n);
console.log(o.x, n);   // 99 5
```

### Q28. What is the global object?
`window` in browsers, `global` in older Node, **`globalThis`** everywhere (ES2020). `var` and function declarations at the top level of a classic script become properties on it. `let`/`const` do not.

### Q29. Short-circuiting, optional chaining and nullish coalescing
```js
const name = user && user.name;               // && returns the first falsy value or the last
const port = config.port || 3000;             // || returns the first truthy (0 would be replaced!)
const port2 = config.port ?? 3000;            // ?? only replaces null/undefined (0 stays)
const city = user?.address?.city;             // undefined instead of an error
user.greet?.();                               // call only if it exists
count ||= 10; count &&= 20; count ??= 30;     // logical assignment (ES2021)
```

### Q30. `switch` and the ternary operator
```js
const label = score >= 90 ? 'A' : score >= 75 ? 'B' : 'C';
switch (role) {
  case 'admin': console.log('all'); break;
  case 'user':
  case 'guest': console.log('limited'); break;
  default: console.log('none');
}
```
`switch` uses strict comparison (`===`). Forgetting `break` causes fall-through.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. What is a closure? *(Must-know)*
**Answer:** A closure is a function **together with its lexical environment**. An inner function keeps access to the variables of its outer function **even after the outer function has finished**.
```js
function makeCounter() {
  let count = 0;                    // private variable
  return {
    inc: () => ++count,
    dec: () => --count,
    value: () => count,
  };
}
const c = makeCounter();
c.inc(); c.inc();
console.log(c.value());             // 2
console.log(c.count);               // undefined (not accessible)
```
**Uses:** data privacy, function factories, memoization, partial application/currying, event handlers, module pattern.
**Pitfalls:** closures keep variables alive (memory), and a closure captures the **variable**, not its value at that time (the classic `var` loop problem).
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);   // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);   // 0 1 2 (new binding per iteration)
```

### Q32. How is `this` decided? *(Must-know)*
`this` is decided by **how a function is called** (not where it is written), except in arrow functions.
| Call style | `this` is |
|---|---|
| `obj.method()` | `obj` |
| `fn()` (plain call) | `undefined` in strict mode, global object otherwise |
| `new Fn()` | the new object |
| `fn.call(x)` / `apply(x)` / `bind(x)` | `x` |
| Event handler (regular function) | the element (`event.currentTarget`) |
| Arrow function | `this` of the enclosing scope |
```js
const user = {
  name: 'Ritesh',
  hello() { return this.name; },
  helloArrow: () => typeof this,        // outer this, not user
};
const fn = user.hello;
// fn();                                 // this is lost (undefined in strict mode -> TypeError)
fn.call({ name: 'Kumar' });              // 'Kumar'
```

### Q33. `call`, `apply` and `bind`?
```js
function intro(city, country) { return `${this.name} from ${city}, ${country}`; }
const p = { name: 'Ritesh' };
intro.call(p, 'Patna', 'India');         // arguments one by one
intro.apply(p, ['Patna', 'India']);      // arguments as an array
const bound = intro.bind(p, 'Patna');    // returns a NEW function (does not call it)
bound('India');
```
`call` and `apply` invoke immediately. `bind` returns a new function with `this` (and optionally some arguments) fixed. A bound function's `this` cannot be changed again by `call`.

### Q34. What is the prototype and the prototype chain? *(Must-know)*
Every object has an internal link `[[Prototype]]` to another object (accessible via `Object.getPrototypeOf(obj)` or `__proto__`). When you read a property, the engine looks at the object, then its prototype, then the prototype's prototype, until `null`. That path is the **prototype chain**.
```js
function Person(name) { this.name = name; }
Person.prototype.hello = function () { return `Hi ${this.name}`; };
const p = new Person('Ritesh');
p.hello();                                     // found on Person.prototype
p.__proto__ === Person.prototype;              // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__;                    // null (end of chain)
```
Methods are shared (one copy on the prototype) instead of copied per object.

### Q35. ES6 classes: how do they work?
Classes are **syntactic sugar over prototypes**.
```js
class Animal {
  #secret = 'hidden';                  // private field (ES2022)
  static count = 0;                    // static field
  constructor(name) { this.name = name; Animal.count++; }
  speak() { return `${this.name} makes a sound`; }
  get info() { return `${this.name} (${this.#secret})`; }
  static create(name) { return new this(name); }
}
class Dog extends Animal {
  constructor(name) { super(name); this.type = 'dog'; }   // super() must be called before using this
  speak() { return `${super.speak()} - Woof`; }
}
new Dog('Rex').speak();
typeof Animal;                          // 'function'
```
Classes are not hoisted usably (TDZ), run in strict mode, and calling a class without `new` throws.

### Q36. How does the event loop work (basic)? *(Must-know)*
JavaScript runs on **one thread** with one **call stack**. Asynchronous work (timers, network, DOM events) is handled by the **host environment** (browser/Node). When it finishes, a callback is queued. The **event loop** moves callbacks to the stack **only when the stack is empty**.
Two queues matter:
1. **Microtask queue:** promise callbacks (`.then/.catch/.finally`), `await` continuations, `queueMicrotask`, `MutationObserver`.
2. **Macrotask (task) queue:** `setTimeout`, `setInterval`, DOM events, I/O, `setImmediate` (Node).
**Order:** run the current script → run **all** microtasks → render if needed → run **one** macrotask → run all microtasks → repeat.
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1 4 3 2
```

### Q37. What is a Promise? What are its states?
An object representing the **eventual result** of an async operation. States: **pending** → **fulfilled** (resolved with a value) or **rejected** (with a reason). Once settled, it never changes.
```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
fetch('/api/user')
  .then((res) => { if (!res.ok) throw new Error(res.status); return res.json(); })
  .then((user) => console.log(user))
  .catch((err) => console.error(err))
  .finally(() => console.log('done'));
```
`.then()` always returns a **new promise**, which allows chaining. Returning a value from `.then` passes it on; throwing jumps to the next `.catch`.

### Q38. `async` / `await`: how do they work?
`async` makes a function return a **promise**. `await` pauses *that function* (not the thread) until the promise settles; the rest of the code keeps running. It is syntax over promises.
```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch does NOT reject on 404/500
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
    throw err;                                               // let the caller decide
  }
}
```
Run independent tasks **in parallel**: `const [a, b] = await Promise.all([getA(), getB()]);`.

### Q39. Shallow copy vs deep copy?
```js
const a = { n: 1, nested: { x: 1 }, list: [1, 2] };
const shallow1 = { ...a };                 // shallow
const shallow2 = Object.assign({}, a);     // shallow
shallow1.nested.x = 99;                    // also changes a.nested.x (shared reference)

const deep = structuredClone(a);           // deep (ES2022 runtime API)
const deepOld = JSON.parse(JSON.stringify(a)); // deep but loses Date, undefined, functions, Map, Set; fails on circular
```
`structuredClone` supports Date, Map, Set, RegExp, typed arrays, circular references. It **cannot** clone functions or DOM nodes.

### Q40. `Object.freeze`, `seal` and `preventExtensions`
| | Add | Delete | Change value |
|---|---|---|---|
| `Object.freeze(o)` | ❌ | ❌ | ❌ |
| `Object.seal(o)` | ❌ | ❌ | ✅ |
| `Object.preventExtensions(o)` | ❌ | ✅ | ✅ |
All are **shallow**. In strict mode, forbidden changes throw; otherwise they fail silently.

### Q41. `Map`, `Set`, `WeakMap`, `WeakSet`
- `Map`: key-value pairs where **keys can be any type**, keeps insertion order, has `.size`.
- `Set`: unique values.
- `WeakMap` / `WeakSet`: keys must be **objects** and are held **weakly** (can be garbage collected). Not iterable, no `.size`. Used for private data and caches without memory leaks.
```js
const map = new Map([['a', 1]]); map.set({ id: 1 }, 'obj'); map.get('a');
const unique = [...new Set([1, 2, 2, 3])];       // [1, 2, 3]
const cache = new WeakMap(); cache.set(domNode, { clicks: 0 });
```
Use `Map` instead of a plain object when keys are not strings, when you add/remove often, or when you need the size.

### Q42. What is a `Symbol`?
A unique, immutable primitive, often used for hidden or collision-free property keys and for well-known protocols (`Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toPrimitive`).
```js
const id = Symbol('id');
const user = { [id]: 1, name: 'Ritesh' };
Object.keys(user);               // ['name'] (symbols are skipped)
Symbol('a') === Symbol('a');     // false
```

### Q43. Iterators and generators
An **iterable** has a `[Symbol.iterator]()` method that returns an iterator with `next()`. **Generators** (`function*`) make iterators easy with `yield`.
```js
function* idGen() { let id = 1; while (true) yield id++; }
const g = idGen(); g.next().value; // 1
function* take(n, iter) { let i = 0; for (const v of iter) { if (i++ >= n) return; yield v; } }
[...take(3, idGen())];            // [1, 2, 3]
```

### Q44. ES Modules vs CommonJS?
| | ES Modules (ESM) | CommonJS (CJS) |
|---|---|---|
| Syntax | `import` / `export` | `require()` / `module.exports` |
| Loading | **Static**, analyzed before running (tree-shaking works) | **Dynamic**, at run time |
| Async | Top-level `await` allowed | Synchronous |
| Browsers | Native (`<script type="module">`) | No |
| `this` at top level | `undefined` | `module.exports` |
| Exports | **Live bindings** | Copies of values |
```js
// math.js
export const PI = 3.14; export default function add(a, b) { return a + b; }
// app.js
import add, { PI } from './math.js';
const mod = await import('./heavy.js');   // dynamic import
```

### Q45. Event bubbling, capturing and delegation
Phases: **capturing** (window → target) → **target** → **bubbling** (target → window). Listeners run in the bubbling phase by default; pass `{ capture: true }` for capturing. **Delegation** = one listener on a parent that handles events from many (also future) children.
```js
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li || !list.contains(li)) return;
  console.log('clicked', li.dataset.id);
});
```
`stopPropagation()` stops the event from moving on; `preventDefault()` cancels the browser's default action (they are different).

### Q46. Debounce vs throttle?
- **Debounce:** run the function only after the user has **stopped** triggering for N ms (search box, resize end).
- **Throttle:** run the function **at most once every N ms** (scroll, mouse move).
(Implementations are in Part 6.)

### Q47. How does `fetch` work? What are the pitfalls?
```js
const res = await fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Book' }),
  credentials: 'include',
  signal: controller.signal,
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```
Pitfalls: `fetch` **only rejects on network failure**, not on HTTP 404/500; the response body can be read only once; no built-in timeout (use `AbortSignal.timeout(5000)`); CORS rules apply.

### Q48. What is currying and partial application?
**Currying:** turn `f(a, b, c)` into `f(a)(b)(c)`. **Partial application:** fix some arguments now, pass the rest later.
```js
const curry = (fn) => function curried(...args) {
  return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
};
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); add(1, 2)(3);      // 6
const add5 = (b) => add(5, b);   // partial
```

### Q49. Higher-order functions, pure functions and immutability
- **Higher-order function:** takes a function as an argument or returns a function (`map`, `filter`, `debounce`).
- **Pure function:** same input → same output, **no side effects** (no mutation, no I/O). Easy to test and cache.
- **Immutability:** do not change existing data; create new copies (`[...arr, item]`, `{ ...obj, key: value }`).
```js
const addItem = (list, item) => [...list, item];      // pure
const bad = (list, item) => { list.push(item); return list; }; // impure (mutates)
```

### Q50. Recursion and tail calls
A function that calls itself with a base case. Deep recursion can cause `RangeError: Maximum call stack size exceeded`. JavaScript engines (except Safari) do not optimize tail calls, so use loops for very deep recursion.
```js
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const flatten = (arr) => arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v) : v), []);
```

### Q51. Getters, setters and `Object.defineProperty`
```js
const temp = {
  _c: 25,
  get f() { return this._c * 9 / 5 + 32; },
  set f(v) { this._c = (v - 32) * 5 / 9; },
};
Object.defineProperty(temp, 'id', { value: 1, writable: false, enumerable: false, configurable: false });
```

### Q52. `Array.prototype.sort`: what are the pitfalls?
Default sort converts items to **strings** and compares UTF-16 code units, so numbers sort wrongly. It **mutates** the array. It is **stable** (since ES2019).
```js
[10, 9, 1].sort();                       // [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b);        // [1, 9, 10]
users.sort((a, b) => a.name.localeCompare(b.name));
[3, 1, 2].toSorted();                    // new array (ES2023)
```

### Q53. Regular expressions basics
```js
const re = /(\d{4})-(\d{2})-(\d{2})/;
'2026-01-15'.match(re);                  // groups
re.test('2026-01-15');                   // true
'a1b2'.replace(/\d/g, '#');              // 'a#b#'
const { groups } = '2026-01-15'.match(/(?<y>\d{4})-(?<m>\d{2})/);  // named groups
[...'a1b22'.matchAll(/\d+/g)].map(m => m[0]);   // ['1', '22']
```
Flags: `g` global, `i` ignore case, `m` multiline, `s` dotAll, `u` unicode, `y` sticky, `d` indices. Beware of catastrophic backtracking (ReDoS).

### Q54. Web storage and cookies (quick comparison)
`localStorage` (persistent, ~5 MB, sync, strings only), `sessionStorage` (per tab), cookies (sent to server, small), IndexedDB (large, async, structured). Never store secrets or tokens that XSS can read.

### Q55. What is `new` and what does it do?
`new Fn(args)`: (1) creates an empty object, (2) links its prototype to `Fn.prototype`, (3) runs `Fn` with `this` = the new object, (4) returns the object (unless the function returns another object).

---

# 🟡 Part 3: Mid (3–5 years)

### Q56. Explain the event loop in depth (microtasks vs macrotasks). *(Must-know)*
Browser loop (simplified): 
1. Take one task from the macrotask queue and run it to completion.
2. Run **all microtasks** (including new ones added while draining).
3. If needed, update the rendering (`requestAnimationFrame` callbacks, style, layout, paint).
4. Repeat.
Therefore a long microtask chain can **starve rendering and timers**. Node.js has phases (timers → pending → poll → check (`setImmediate`) → close), and `process.nextTick` runs before promise microtasks.
```js
setTimeout(() => console.log('timeout'), 0);
setImmediate?.(() => console.log('immediate'));        // Node only
process.nextTick?.(() => console.log('nextTick'));     // Node only
Promise.resolve().then(() => console.log('promise'));
// Node: nextTick, promise, timeout, immediate (timeout/immediate order can vary at top level)
```

### Q57. Promise combinators: `all`, `allSettled`, `race`, `any`? *(Comparison)*
| Method | Resolves when | Rejects when |
|---|---|---|
| `Promise.all([...])` | **all** fulfil (array of values) | **any one** rejects (fail-fast) |
| `Promise.allSettled([...])` | all settle (array of `{status, value/reason}`) | never |
| `Promise.race([...])` | the **first settles** (fulfil) | the first settles (reject) |
| `Promise.any([...])` | the **first fulfils** | all reject (`AggregateError`) |
```js
const results = await Promise.allSettled([fetchA(), fetchB()]);
const ok = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
const fastest = await Promise.any([mirror1(), mirror2()]);
```

### Q58. Sequential vs parallel async code?
```js
// ❌ Sequential (slow): total = a + b
const a = await getA();
const b = await getB();
// ✅ Parallel: total = max(a, b)
const [a2, b2] = await Promise.all([getA(), getB()]);

// ❌ await inside forEach does not wait
items.forEach(async (i) => { await save(i); });
// ✅ Sequential loop
for (const i of items) await save(i);
// ✅ Parallel
await Promise.all(items.map(save));
```

### Q59. How do you cancel async work? (`AbortController`)
```js
const controller = new AbortController();
fetch('/api/search?q=js', { signal: controller.signal })
  .then((r) => r.json())
  .catch((e) => { if (e.name !== 'AbortError') throw e; });
controller.abort();                         // cancel the request
fetch(url, { signal: AbortSignal.timeout(5000) });  // timeout
```
It also solves the **race condition** in type-ahead search: abort the previous request when a new one starts.

### Q60. How does garbage collection work? What are common memory leaks?
Engines use **mark-and-sweep**: starting from roots (global, stack), they mark everything reachable and free the rest. V8 is **generational** (young generation collected often with a Scavenger; old generation less often with mark-sweep-compact).
**Common leaks:** (1) accidental globals, (2) forgotten timers/intervals, (3) event listeners never removed, (4) closures holding big objects, (5) detached DOM nodes still referenced, (6) unbounded caches/Maps (use `WeakMap`, LRU), (7) long-lived promises/subscriptions.
```js
const id = setInterval(tick, 1000);
window.addEventListener('resize', onResize);
// cleanup:
clearInterval(id); window.removeEventListener('resize', onResize);
```
**Debug:** Chrome DevTools → Memory → heap snapshots (compare), allocation timeline; Node: `--inspect`, `process.memoryUsage()`.

### Q61. What are `Proxy` and `Reflect`?
`Proxy` wraps an object and intercepts operations (get, set, has, deleteProperty, apply...). `Reflect` provides the default behavior as functions.
```js
const validator = new Proxy({}, {
  set(target, key, value) {
    if (key === 'age' && !Number.isInteger(value)) throw new TypeError('age must be an integer');
    return Reflect.set(target, key, value);
  },
  get: (t, k) => (k in t ? t[k] : `no ${String(k)}`),
});
```
Use cases: validation, logging, reactivity (Vue 3), default values, API wrappers. Cost: slower than plain access.

### Q62. Property descriptors
Each property has: `value`, `writable`, `enumerable`, `configurable` (or `get`/`set`).
```js
Object.getOwnPropertyDescriptor({ a: 1 }, 'a');   // { value: 1, writable: true, enumerable: true, configurable: true }
Object.defineProperties(obj, { x: { value: 1, enumerable: true } });
Object.getOwnPropertyDescriptors(obj);
```

### Q63. Prototypal inheritance without classes
```js
const animal = { speak() { return `${this.name} makes a sound`; } };
const dog = Object.create(animal, { name: { value: 'Rex' } });
dog.speak();                                  // 'Rex makes a sound'
Object.getPrototypeOf(dog) === animal;        // true

function Child(name) { Parent.call(this, name); }
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### Q64. `instanceof`, `typeof`, `Symbol.hasInstance`, duck typing
`a instanceof B` checks whether `B.prototype` is in `a`'s prototype chain. It can fail across iframes/realms. Prefer `Array.isArray`, and capability checks (duck typing: `typeof obj.then === 'function'`).

### Q65. Generators in async flow and async iterators
```js
async function* pages(url) {
  let next = url;
  while (next) {
    const res = await fetch(next); const json = await res.json();
    yield json.items; next = json.next;
  }
}
for await (const items of pages('/api/items?page=1')) console.log(items.length);
```
`for await...of` works with async iterables (streams, paginated APIs).

### Q66. Tagged templates
```js
function html(strings, ...values) {
  return strings.reduce((out, s, i) => out + s + (i < values.length ? escapeHtml(values[i]) : ''), '');
}
const name = '<script>';
html`<p>Hello ${name}</p>`;          // values are escaped
```
Used by styled-components, GraphQL `gql`, lit-html.

### Q67. Dynamic imports and code splitting
```js
button.addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');   // loaded only when needed
  openEditor();
});
```
Bundlers (Vite, webpack, Rollup) create a separate chunk. Combine with `<link rel="modulepreload">` or hover-prefetch.

### Q68. Tree shaking and side effects
Bundlers remove unused ESM exports (dead-code elimination). It needs **static** `import/export` and no side effects. Mark packages with `"sideEffects": false` in `package.json`. Avoid `import * as _ from 'lodash'` (use `lodash-es` or per-method imports).

### Q69. Common design patterns in JavaScript
```js
// Module / Singleton (ES modules are singletons by nature)
export const config = Object.freeze({ api: '/api' });

// Observer / Pub-Sub
class Emitter {
  #h = new Map();
  on(e, fn) { (this.#h.get(e) ?? this.#h.set(e, new Set()).get(e)).add(fn); return () => this.off(e, fn); }
  off(e, fn) { this.#h.get(e)?.delete(fn); }
  emit(e, ...args) { this.#h.get(e)?.forEach((fn) => fn(...args)); }
}
// Factory
const createUser = (type) => ({ admin: () => new Admin(), guest: () => new Guest() }[type]?.());
```
Also: Strategy (swap functions), Decorator (wrap functions), Mediator, Command, Iterator, Proxy.

### Q70. Functional composition: `compose` and `pipe`
```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const slugify = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replace(/\s+/g, '-'));
slugify('  Hello World ');          // 'hello-world'
```

### Q71. Performance techniques in JS
- Avoid layout thrashing (batch DOM reads then writes).
- `requestAnimationFrame` for visual updates; `requestIdleCallback` for low-priority work.
- Debounce/throttle events; passive listeners (`{ passive: true }`).
- Move heavy CPU work to **Web Workers**.
- Virtualize long lists; lazy-load code and data.
- Avoid unnecessary allocations in hot loops; use typed arrays for numeric data.
- Measure first: DevTools Performance, `performance.mark/measure`, Lighthouse.

### Q72. Web Workers and `SharedArrayBuffer`
```js
// main.js
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
worker.postMessage({ numbers: bigArray });
worker.onmessage = (e) => console.log('sum', e.data);
// worker.js
self.onmessage = (e) => self.postMessage(e.data.numbers.reduce((a, b) => a + b, 0));
```
Messages are **copied** (structured clone) unless you transfer ownership (`postMessage(buf, [buf])`) or use `SharedArrayBuffer` + `Atomics` (needs cross-origin isolation headers).

### Q73. Testing JavaScript (Jest/Vitest basics)
```js
import { describe, it, expect, vi } from 'vitest';
describe('debounce', () => {
  it('calls once after delay', () => {
    vi.useFakeTimers();
    const fn = vi.fn(); const d = debounce(fn, 100);
    d(); d(); d();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```
Test behavior, mock network and time, test async with `await expect(promise).resolves/rejects`, keep tests independent.

### Q74. Polyfills, transpilation and browser support
**Transpile** syntax with Babel/SWC/esbuild (arrow functions → ES5 if needed). **Polyfill** missing APIs with core-js. Decide support with `browserslist`. Today most apps target "last 2 versions" or baseline-widely-available and skip legacy code.

### Q75. `structuredClone`, `Intl`, `URL`, `URLSearchParams`, `crypto`
```js
const url = new URL('https://x.com/search?q=js&page=2');
url.searchParams.get('q'); url.searchParams.set('page', '3');
new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(125000.5);  // ₹1,25,000.50
crypto.randomUUID();
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }); rtf.format(-1, 'day');  // 'yesterday'
```

### Q76. Error handling strategy in large apps
Use custom error classes, centralized handlers (`window.onerror`, `unhandledrejection`), error boundaries (React), logging to Sentry with context, user-friendly messages, retries with backoff only for idempotent calls, and never swallow errors silently.
```js
class HttpError extends Error {
  constructor(status, message) { super(message); this.name = 'HttpError'; this.status = status; }
}
window.addEventListener('unhandledrejection', (e) => report(e.reason));
```

### Q77. Immutable update patterns (state management)
```js
const next = {
  ...state,
  user: { ...state.user, name: 'Kumar' },
  items: state.items.map((i) => (i.id === 2 ? { ...i, done: true } : i)),
  tags: state.tags.filter((t) => t !== 'old'),
};
```
Or use Immer (`produce`) for readability. Immutability makes change detection cheap (`===`) and debugging predictable.

### Q78. `WeakRef` and `FinalizationRegistry`
`WeakRef` holds a reference that does not prevent garbage collection (`ref.deref()` may return `undefined`). Use for caches. Do not depend on finalizers running; GC timing is not guaranteed.


---

# 🟠 Part 4: Senior (5–7 years)

### Q79. How does V8 run JavaScript? (parsing, JIT, hidden classes) *(Internals)*
Pipeline: **parse** source into an AST → **Ignition** (interpreter) generates bytecode and runs it, collecting type feedback → hot functions are compiled by **TurboFan** (optimizing JIT) into machine code based on the assumptions it saw → if an assumption breaks (a different type arrives), the code is **deoptimized** back to bytecode.
**Hidden classes (shapes):** objects with the same properties added in the same order share a shape, so property access can be a fast offset lookup (**inline caching**).
```js
// ✅ Same shape for all points
function Point(x, y) { this.x = x; this.y = y; }
// ❌ Different shapes (property order / adding later / delete)
const a = { x: 1 }; a.y = 2;
const b = { y: 2 }; b.x = 1;
delete a.x;                  // makes the object slower ("dictionary mode")
```
Practical tips: initialize all properties in the constructor, keep consistent property order, keep function argument types stable (monomorphic), avoid `delete` (set to `undefined`/use `Map`), avoid holes in arrays.

### Q80. How does the garbage collector affect performance, and how do you reduce GC pressure?
V8 uses generational GC: short-lived objects in the **young generation** (fast Scavenge), survivors move to the **old generation** (mark-sweep-compact, mostly concurrent/incremental). GC pauses show up as jank. Reduce pressure by reusing objects/buffers in hot paths, avoiding creating many short-lived closures or arrays inside loops/animations, using typed arrays/object pools for high-frequency data, and batching work. Measure with the DevTools Performance panel (GC events) and `--trace-gc` in Node.

### Q81. How do you find and fix a memory leak in production? *(Scenario)*
1. **Confirm:** memory grows over time in monitoring (RUM, `performance.memory`, Node `process.memoryUsage()`), and does not drop after GC.
2. **Reproduce:** repeat the suspected user flow (open/close a modal 50 times).
3. **Snapshot:** DevTools → Memory → take heap snapshots before/after, compare, look for growing "(closure)", "Detached HTMLDivElement", arrays, Maps.
4. **Trace retainers:** the "Retainers" panel shows what keeps the object alive (a listener, a timer, a global, a cache).
5. **Fix:** remove listeners (`AbortController` with `addEventListener(..., { signal })`), clear timers, use `WeakMap`, bound caches (LRU), clean up in framework lifecycle hooks.
6. **Verify and add a guard** (a test or a memory budget alert).
```js
const ac = new AbortController();
window.addEventListener('resize', onResize, { signal: ac.signal });
ac.abort();    // removes the listener
```

### Q82. Browser event loop vs Node.js event loop?
Browser: tasks + microtasks + rendering steps (`requestAnimationFrame` before paint). Node (libuv): phases **timers → pending callbacks → idle/prepare → poll (I/O) → check (`setImmediate`) → close**, and between each callback it drains `process.nextTick` first, then promise microtasks. Node's thread pool (default 4 threads) handles file system, DNS lookup, crypto, zlib. CPU-heavy JS still blocks the loop: use `worker_threads` or a separate service.

### Q83. How do you control concurrency, rate limits and backpressure?
Use a **promise pool** (limit N in-flight tasks), queue with priorities, **exponential backoff with jitter** for retries, respect `429/Retry-After`, use **idempotency keys** for retried writes, and apply backpressure in streams (pause the source when the consumer is slow). (Code in Part 6.)

### Q84. Promises vs Observables vs async iterators vs events?
| | Promise | Observable (RxJS) | Async iterator | Event |
|---|---|---|---|---|
| Values | One | Many over time | Many, pulled | Many, pushed |
| Lazy | No (eager) | Yes | Yes | n/a |
| Cancel | Not built in (AbortController) | `unsubscribe()` | `return()` | `removeEventListener` |
| Operators | `then` | Rich (map, debounce, switchMap) | Manual | Manual |
Use promises for single results, async iterators for streams/pagination, RxJS for complex event orchestration (typeahead with `switchMap`).

### Q85. What is prototype pollution and how do you prevent it? *(Security)*
An attacker sets properties on `Object.prototype` through unsafe merge/clone/set-by-path code, affecting every object.
```js
// ❌ vulnerable merge
function merge(t, s) { for (const k in s) { if (typeof s[k] === 'object') merge(t[k] ??= {}, s[k]); else t[k] = s[k]; } }
merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
({}).isAdmin;     // true  (polluted!)
```
Prevention: block `__proto__`, `constructor`, `prototype` keys; use `Object.create(null)` or `Map` for dictionaries; `Object.hasOwn` checks; freeze prototypes (`Object.freeze(Object.prototype)` in Node with `--frozen-intrinsics`/`--disable-proto=delete`); update vulnerable libraries; validate JSON with a schema.

### Q86. Common JavaScript security issues and defenses
- **XSS:** escape output, `textContent`, sanitize HTML (DOMPurify), CSP, Trusted Types, HttpOnly cookies.
- **CSRF:** SameSite cookies, CSRF tokens, check `Origin`.
- **ReDoS:** avoid nested quantifiers like `(a+)+`; use safe regex libraries or timeouts.
- **`eval` / `new Function` / `setTimeout('string')`:** avoid.
- **Supply chain:** lock files, `npm audit`, minimal dependencies, Subresource Integrity, `npm ci`, provenance, 2FA for publishers.
- **Secrets:** never in front-end code; use a backend.
- **Open redirects / `postMessage` origin checks / `target="_blank"` without `noopener`.**

### Q87. Modern JavaScript features (ES2020–ES2025) you should know
| Year | Features |
|---|---|
| ES2020 | `?.`, `??`, `BigInt`, `Promise.allSettled`, `globalThis`, dynamic `import()`, `String.matchAll` |
| ES2021 | `??=`, `||=`, `&&=`, `replaceAll`, `Promise.any`, numeric separators `1_000_000`, `WeakRef` |
| ES2022 | Class fields, `#private`, static blocks, top-level `await`, `Array.at()`, `Object.hasOwn`, `Error.cause`, regex `d` flag |
| ES2023 | `toSorted/toReversed/toSpliced/with`, `findLast/findLastIndex`, hashbang, symbols as WeakMap keys |
| ES2024 | `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers`, `Array.fromAsync`, `String.isWellFormed`, resizable ArrayBuffer |
| ES2025 | Set methods (`union`, `intersection`, `difference`...), iterator helpers (`.map/.filter/.take` on iterators), `RegExp.escape`, JSON modules, `Promise.try` (check runtime support) |
Also upcoming: **Temporal** API (modern date/time), decorators, records & tuples (proposal status changes). Always check support (MDN/Baseline) before using in production.
```js
const grouped = Object.groupBy(users, (u) => u.role);
const { promise, resolve, reject } = Promise.withResolvers();
const sorted = [3, 1, 2].toSorted();
```

### Q88. How do you design a robust API for a function or module?
- Use an **options object** instead of many positional parameters: `fn(input, { retries, signal })`.
- Validate inputs early; fail with clear errors (custom error classes with `cause`).
- Be **consistent**: return types, naming, async-ness (do not return sometimes sync, sometimes async).
- Accept `AbortSignal` for cancellable work.
- Do not mutate inputs; document side effects.
- Keep functions small and pure when possible; separate I/O from logic.
- Add types (TypeScript/JSDoc) and tests.

### Q89. Explain idempotency, retries and optimistic UI. *(Scenario)*
A request is **idempotent** if repeating it has the same effect (GET, PUT, DELETE; POST only with an idempotency key). Retry only idempotent calls, with backoff and jitter. **Optimistic UI** updates the interface immediately and rolls back if the server fails.
```js
async function toggleLike(post) {
  const prev = post.liked;
  render({ ...post, liked: !prev });                       // optimistic
  try { await api.like(post.id, { idempotencyKey: crypto.randomUUID() }); }
  catch { render({ ...post, liked: prev }); showToast('Could not update'); }   // rollback
}
```

### Q90. How do you use the Streams API?
```js
const res = await fetch('/big-file');
const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  process(value);                   // handle chunks without loading everything in memory
}
```
Use for large downloads, LLM token streaming, server-sent events, compression. `ReadableStream`, `WritableStream`, `TransformStream` support backpressure.

### Q91. Service Workers: what are they and what are the risks?
A script that runs separately from the page and can intercept network requests (offline cache, push, background sync). Lifecycle: install → waiting → activate. Strategies: cache-first, network-first, stale-while-revalidate. Risks: stale assets after deploy (version your caches, `skipWaiting` + a user prompt), bugs that cache errors, scope mistakes, and hard debugging.

### Q92. How do you profile and optimize a slow page or function?
1. Measure (Lighthouse, DevTools Performance, `performance.mark/measure`, `console.time`).
2. Find the long tasks (>50 ms) in the flame chart.
3. Fix the biggest: reduce work, split tasks (`scheduler.yield()` / `setTimeout` chunks), move to workers, memoize, virtualize, lazy-load.
4. Re-measure; add a performance budget in CI.
```js
async function processInChunks(items, handle, size = 200) {
  for (let i = 0; i < items.length; i += size) {
    items.slice(i, i + size).forEach(handle);
    await new Promise((r) => setTimeout(r));       // give the browser time to paint/respond
  }
}
```

### Q93. Module interoperability (ESM ↔ CJS) and common errors
`ERR_REQUIRE_ESM`, `Cannot use import statement outside a module`, `__dirname is not defined in ES module scope`. In Node: set `"type": "module"` or use `.mjs`; use `import.meta.url`; `createRequire(import.meta.url)` to use `require` in ESM; dual packages need an `exports` map with `import` and `require` conditions. Newer Node versions can `require()` ESM in many cases, but check your version.
```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### Q94. State machines and avoiding impossible states
Model UI/async state as explicit states instead of many booleans.
```js
// ❌ isLoading, isError, data  -> impossible combinations
// ✅ one status field
const state = { status: 'idle' };       // 'idle' | 'loading' | 'success' | 'error'
const reducer = (s, a) => {
  switch (a.type) {
    case 'FETCH': return { status: 'loading' };
    case 'OK': return { status: 'success', data: a.data };
    case 'FAIL': return { status: 'error', error: a.error };
    default: return s;
  }
};
```
Libraries: XState.

### Q95. Testing strategy for a large JavaScript codebase
Pyramid: many fast unit tests (pure functions), fewer integration tests (modules + mocked network with MSW), few E2E tests (Playwright). Use fake timers, test behavior not implementation, snapshot sparingly, run in CI with coverage on critical code, avoid flaky tests (no real timers/network), and keep test data factories.

### Q96. Handling dates and time zones correctly
Store and transmit **UTC ISO strings**; convert to local only for display (`Intl.DateTimeFormat` with `timeZone`). Avoid `new Date('2026-01-15')` assumptions (UTC) vs `new Date(2026, 0, 15)` (local). Do not do date math by adding milliseconds across DST changes; use a library (date-fns, Luxon) or the **Temporal** API when available.

### Q97. Floating-point and money
Use integers in the smallest unit (paise/cents), format with `Intl.NumberFormat`. For decimals use a library (decimal.js) or `BigInt` for exact large integers. Compare floats with a tolerance: `Math.abs(a - b) < Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b))`.

### Q98. WebAssembly and JavaScript
Wasm runs near-native code (Rust/C++) in the browser for CPU-heavy tasks (image/video, crypto, parsing). JS calls it through an instance; data crosses the boundary via memory buffers (copying cost). Use it only when profiling shows a CPU bottleneck JS cannot fix.

### Q99. Accessibility with JavaScript
Manage focus (move focus into dialogs, return it on close), keep ARIA states in sync (`aria-expanded`, `aria-live` for updates), support keyboard (Enter/Space/Esc/Arrows), never rely on mouse-only events, announce async results, respect `prefers-reduced-motion`. Prefer native elements first.

### Q100. Logging, monitoring and observability for front-end JS
Capture errors (`window.onerror`, `unhandledrejection`) with release/version and user/session context, source maps, breadcrumbs (Sentry), performance metrics (`web-vitals`, `PerformanceObserver`), feature-flag state, and sampled session replay. Respect privacy (scrub PII).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you decide between JavaScript and TypeScript for a team? *(Decision)*
TypeScript catches whole classes of bugs at build time, improves refactoring and documents contracts; costs are build setup, learning curve and type complexity. For a team larger than ~3 or a long-lived product, TypeScript almost always wins. Adopt gradually: `allowJs`, `checkJs`, JSDoc types, then convert module by module, start with `strict` on new code, and track `any` usage.

### Q102. How do you structure a large JavaScript codebase?
Feature-based folders (not type-based), clear module boundaries (public API via `index.js`), a layered design (UI → domain/services → data/API client), dependency direction rules enforced by lint (eslint-plugin-boundaries / Nx), shared packages in a monorepo, and a small, well-tested `core` library. Avoid circular dependencies (detect with madge).

### Q103. Migration strategies (CJS → ESM, JS → TS, callbacks → promises)
Use the **strangler** approach: introduce the new pattern at the edges, convert leaf modules first, keep adapters (`promisify`, dual exports), automate with codemods (jscodeshift, ts-migrate), protect with tests and CI, and track progress with a dashboard. Avoid freezing feature work for a rewrite.

### Q104. Managing dependencies and supply-chain risk
Pin versions with a lock file and `npm ci`; review new dependencies (size, maintenance, license, install scripts); use Renovate/Dependabot with grouped updates; run `npm audit`/SCA scanning; prefer fewer, well-known packages; vendor critical tiny utilities; set up provenance/SBOM; restrict install scripts in CI.

### Q105. Build tooling and performance budgets
Choose tools by need: Vite/esbuild/SWC for speed, Rollup for libraries, webpack for complex legacy setups, Turbopack/Rspack as alternatives. Set budgets (e.g., initial JS < 170 KB gzip, LCP < 2.5 s), enforce in CI (bundlesize/Lighthouse CI), analyze bundles regularly (source-map-explorer), use code splitting and modern output (no ES5 for modern browsers).

### Q106. Browser support policy
Define it from analytics + business needs (e.g., "last 2 versions, > 0.5% usage, no IE"). Use `browserslist` to drive Babel/PostCSS, feature-detect (`'IntersectionObserver' in window`), provide fallbacks only when needed, and test in a real matrix (BrowserStack/Playwright).

### Q107. Error-handling and reliability strategy
Define error categories (user, network, programmer, fatal), central handling, user-friendly messages, retries with backoff for idempotent calls, circuit breakers on the client for failing services, timeouts everywhere (`AbortSignal.timeout`), graceful degradation, feature flags/kill-switches, and SLO-based alerts.

### Q108. Code quality governance
ESLint (with recommended + project rules), Prettier, TypeScript strict, commit hooks (lint-staged), CI gates (tests, types, lint, bundle size), PR templates, ADRs for decisions, code owners, and a "definition of done" that includes accessibility and tests.

### Q109. Micro-frontends and shared runtime
Module Federation or import maps share dependencies at run time; risks are version drift, duplicate frameworks and CSS collisions. Define contracts (events, props, shared state), versioning rules, a shared design system, observability per micro-app, and a fallback if a remote fails.

### Q110. Hiring and mentoring (JavaScript depth)
Interview for fundamentals (closures, event loop, `this`, async), problem solving, debugging skill and communication. Mentor with code reviews that explain *why*, pairing, small guided tasks, a team reading list, and brown-bag sessions on internals.

### Q111. Technical debt management
Track debt (ADR/tech-debt log), classify by risk and cost, reserve capacity each sprint (e.g., 15–20%), fix debt near active work, use metrics (build time, flaky tests, bundle size, bug rate), and present business impact to stakeholders.

### Q112. Release engineering for front ends
Trunk-based development, feature flags, canary/gradual rollouts, source-map upload, immutable hashed assets, automatic rollback on error-rate spikes, version skew handling (old HTML with new assets), and post-release monitoring of Web Vitals and error rates.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> These are the most common coding-round questions in JavaScript interviews. Practice writing each from memory and explain the edge cases.

### C1. Debounce (with `cancel`)
```js
function debounce(fn, wait = 300, { leading = false } = {}) {
  let timer = null;
  let result;
  function debounced(...args) {
    const callNow = leading && timer === null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) result = fn.apply(this, args);
    }, wait);
    if (callNow) result = fn.apply(this, args);
    return result;
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  return debounced;
}
```
**Explain:** each call resets the timer, so `fn` runs only after `wait` ms of silence. Keep `this` and arguments. `cancel` clears a pending call.

### C2. Throttle (leading + trailing)
```js
function throttle(fn, limit = 300) {
  let last = 0;
  let timer = null;
  return function throttled(...args) {
    const now = Date.now();
    const remaining = limit - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer); timer = null;
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now(); timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

### C3. Deep clone (handles Date, RegExp, Map, Set, circular references)
```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);                 // circular reference
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const m = new Map(); seen.set(value, m);
    value.forEach((v, k) => m.set(deepClone(k, seen), deepClone(v, seen)));
    return m;
  }
  if (value instanceof Set) {
    const s = new Set(); seen.set(value, s);
    value.forEach((v) => s.add(deepClone(v, seen)));
    return s;
  }
  const out = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, out);
  for (const key of Reflect.ownKeys(value)) out[key] = deepClone(value[key], seen);
  return out;
}
```
In production prefer `structuredClone`. Functions are copied by reference in this version.

### C4. Deep equal
```js
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (a instanceof Date) return a.getTime() === b.getTime();
  const ka = Reflect.ownKeys(a);
  const kb = Reflect.ownKeys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}
```
(Does not handle `Map`/`Set` or circular references. Mention this.)

### C5. Curry (and infinite currying `sum(1)(2)(3)()`)
```js
const curry = (fn) => function curried(...args) {
  return args.length >= fn.length ? fn.apply(this, args) : (...more) => curried.apply(this, [...args, ...more]);
};
function sum(a) { return (b) => (b === undefined ? a : sum(a + b)); }
sum(1)(2)(3)();     // 6
```

### C6. `compose` / `pipe`, async pipe
```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const pipeAsync = (...fns) => (x) => fns.reduce((p, f) => p.then(f), Promise.resolve(x));
```

### C7. Memoize
```js
function memoize(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
```

### C8. `once`
```js
const once = (fn) => { let called = false, value; return (...a) => (called ? value : ((called = true), (value = fn(...a)))); };
```

### C9. `Function.prototype.bind` polyfill
```js
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  if (typeof fn !== 'function') throw new TypeError('myBind must be called on a function');
  function bound(...args) {
    const isNew = this instanceof bound;          // supports new bound()
    return fn.apply(isNew ? this : context, [...boundArgs, ...args]);
  }
  if (fn.prototype) bound.prototype = Object.create(fn.prototype);
  return bound;
};
```

### C10. `call` and `apply` polyfills
```js
Function.prototype.myCall = function (context, ...args) {
  context = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};
Function.prototype.myApply = function (context, args = []) { return this.myCall(context, ...args); };
```

### C11. `map`, `filter`, `reduce` polyfills
```js
Array.prototype.myMap = function (cb, thisArg) {
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++) if (i in this) out[i] = cb.call(thisArg, this[i], i, this);
  return out;
};
Array.prototype.myFilter = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  return out;
};
Array.prototype.myReduce = function (cb, init) {
  let i = 0, acc = init;
  if (arguments.length < 2) {
    while (i < this.length && !(i in this)) i++;
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++) if (i in this) acc = cb(acc, this[i], i, this);
  return acc;
};
```

### C12. `Promise.all`, `race`, `allSettled`, `any` polyfills
```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable];
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((p, i) => {
      Promise.resolve(p).then((v) => { results[i] = v; if (--remaining === 0) resolve(results); }, reject);
    });
  });
}
const promiseRace = (iterable) => new Promise((res, rej) => [...iterable].forEach((p) => Promise.resolve(p).then(res, rej)));
const promiseAllSettled = (iterable) => promiseAll([...iterable].map((p) =>
  Promise.resolve(p).then((value) => ({ status: 'fulfilled', value }), (reason) => ({ status: 'rejected', reason }))));
function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable]; const errors = new Array(items.length); let left = items.length;
    if (left === 0) return reject(new AggregateError([], 'All promises were rejected'));
    items.forEach((p, i) => Promise.resolve(p).then(resolve, (e) => {
      errors[i] = e; if (--left === 0) reject(new AggregateError(errors, 'All promises were rejected'));
    }));
  });
}
```
Key points: keep the **order** of results, handle non-promise values (`Promise.resolve`), handle the empty array.

### C13. A simple Promise implementation (A+-style, simplified)
```js
class MyPromise {
  #state = 'pending'; #value; #handlers = [];
  constructor(executor) {
    const resolve = (v) => this.#settle('fulfilled', v);
    const reject = (e) => this.#settle('rejected', e);
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }
  #settle(state, value) {
    if (this.#state !== 'pending') return;
    if (state === 'fulfilled' && value && typeof value.then === 'function') {   // adopt thenables
      value.then((v) => this.#settle('fulfilled', v), (e) => this.#settle('rejected', e));
      return;
    }
    this.#state = state; this.#value = value;
    this.#handlers.forEach((h) => this.#run(h)); this.#handlers = [];
  }
  #run({ onFulfilled, onRejected, resolve, reject }) {
    queueMicrotask(() => {                                                      // handlers run async
      const cb = this.#state === 'fulfilled' ? onFulfilled : onRejected;
      if (typeof cb !== 'function') return (this.#state === 'fulfilled' ? resolve : reject)(this.#value);
      try { resolve(cb(this.#value)); } catch (e) { reject(e); }
    });
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const h = { onFulfilled, onRejected, resolve, reject };
      this.#state === 'pending' ? this.#handlers.push(h) : this.#run(h);
    });
  }
  catch(fn) { return this.then(undefined, fn); }
  finally(fn) { return this.then((v) => (fn(), v), (e) => { fn(); throw e; }); }
  static resolve(v) { return new MyPromise((res) => res(v)); }
  static reject(e) { return new MyPromise((_, rej) => rej(e)); }
}
```
**Explain:** state is set once; `then` returns a new promise; callbacks always run asynchronously (microtask); a returned thenable is adopted; errors in callbacks reject the next promise.

### C14. EventEmitter (`on`, `off`, `once`, `emit`)
```js
class EventEmitter {
  #events = new Map();
  on(name, fn) { (this.#events.get(name) ?? this.#events.set(name, new Set()).get(name)).add(fn); return () => this.off(name, fn); }
  off(name, fn) { this.#events.get(name)?.delete(fn); }
  once(name, fn) { const w = (...a) => { this.off(name, w); fn(...a); }; return this.on(name, w); }
  emit(name, ...args) { [...(this.#events.get(name) ?? [])].forEach((fn) => fn(...args)); return this; }
}
```
(Copy the listeners before calling so `once` can remove itself during emit.)

### C15. LRU cache (O(1) get/put)
```js
class LRUCache {
  constructor(capacity) { this.capacity = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key); this.map.set(key, value);          // move to most-recent
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);  // evict oldest
    this.map.set(key, value);
  }
}
```
`Map` keeps insertion order, so the first key is the least recently used.

### C16. Retry with exponential backoff and jitter
```js
async function retry(fn, { retries = 3, delay = 300, factor = 2, jitter = true } = {}) {
  let attempt = 0, wait = delay;
  for (;;) {
    try { return await fn(attempt); }
    catch (err) {
      if (attempt++ >= retries) throw err;
      const ms = jitter ? wait * (0.5 + Math.random()) : wait;
      await new Promise((r) => setTimeout(r, ms));
      wait *= factor;
    }
  }
}
```

### C17. Promise pool (concurrency limit)
```js
async function pool(tasks, limit = 3) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}
// usage: pool(urls.map((u) => () => fetch(u).then((r) => r.json())), 5);
```

### C18. `sleep`, timeout wrapper, and promisify
```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms))]);
const promisify = (fn) => (...args) => new Promise((resolve, reject) => fn(...args, (err, data) => (err ? reject(err) : resolve(data))));
```
(The timeout in `withTimeout` should be cleared in production code to avoid a pending timer.)

### C19. Flatten an array (any depth / given depth)
```js
const flatten = (arr, depth = Infinity) =>
  depth > 0 ? arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v, depth - 1) : v), []) : arr.slice();
flatten([1, [2, [3, [4]]]]);       // [1, 2, 3, 4]
```
Built-in: `arr.flat(Infinity)`. Iterative version with a stack is safer for very deep arrays.

### C20. Flatten and unflatten an object
```js
function flattenObject(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flattenObject(v, key, out);
    else out[key] = v;
  }
  return out;
}
flattenObject({ a: { b: 1, c: { d: 2 } }, e: 3 });   // { 'a.b': 1, 'a.c.d': 2, e: 3 }
```

### C21. `get` and `set` by path (like lodash)
```js
const get = (obj, path, def) =>
  path.replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean).reduce((o, k) => o?.[k], obj) ?? def;
function set(obj, path, value) {
  const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean);
  keys.reduce((o, k, i) => (o[k] = i === keys.length - 1 ? value : (o[k] ?? (/^\d+$/.test(keys[i + 1]) ? [] : {}))), obj);
  return obj;
}
get({ a: [{ b: 5 }] }, 'a[0].b');    // 5
```
Guard against `__proto__`/`constructor` keys in real code (prototype pollution).

### C22. `groupBy`, `chunk`, `unique`, `zip`, `range`
```js
const groupBy = (arr, fn) => arr.reduce((acc, x) => { (acc[fn(x)] ??= []).push(x); return acc; }, {});
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const uniqueBy = (arr, fn) => [...new Map(arr.map((x) => [fn(x), x])).values()];
const zip = (...arrs) => Array.from({ length: Math.min(...arrs.map((a) => a.length)) }, (_, i) => arrs.map((a) => a[i]));
const range = (start, end, step = 1) => Array.from({ length: Math.max(0, Math.ceil((end - start) / step)) }, (_, i) => start + i * step);
```

### C23. Shuffle (Fisher–Yates) and random pick
```js
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```
`arr.sort(() => Math.random() - 0.5)` is **biased** and inconsistent. Do not use it.

### C24. Binary search
```js
function binarySearch(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (sorted[mid] === target) return mid;
    sorted[mid] < target ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}
```

### C25. Two Sum, palindrome, anagram, first unique character
```js
const twoSum = (nums, target) => { const seen = new Map(); for (let i = 0; i < nums.length; i++) { const need = target - nums[i]; if (seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i); } return []; };
const isPalindrome = (s) => { const t = s.toLowerCase().replace(/[^a-z0-9]/g, ''); return t === [...t].reverse().join(''); };
const isAnagram = (a, b) => { const f = (s) => [...s.replace(/\s/g, '').toLowerCase()].sort().join(''); return f(a) === f(b); };
const firstUnique = (s) => { const count = {}; for (const c of s) count[c] = (count[c] || 0) + 1; return [...s].find((c) => count[c] === 1) ?? null; };
```

### C26. Parse and build a query string
```js
const parseQuery = (qs) => Object.fromEntries(new URLSearchParams(qs));
const buildQuery = (obj) => new URLSearchParams(obj).toString();
parseQuery('?a=1&b=two');      // { a: '1', b: 'two' }
```

### C27. Implement `new` and `instanceof`
```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function') ? result : obj;
}
function myInstanceof(obj, Ctor) {
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) return false;
  for (let p = Object.getPrototypeOf(obj); p; p = Object.getPrototypeOf(p)) if (p === Ctor.prototype) return true;
  return false;
}
```

### C28. Type-ahead search without race conditions
```js
let controller;
input.addEventListener('input', debounce(async (e) => {
  controller?.abort();                              // cancel the previous request
  controller = new AbortController();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(e.target.value)}`, { signal: controller.signal });
    render(await res.json());
  } catch (err) {
    if (err.name !== 'AbortError') showError(err);
  }
}, 300));
```

### C29. Infinite scroll with `IntersectionObserver`
```js
let page = 1, loading = false;
const sentinel = document.querySelector('#sentinel');
new IntersectionObserver(async ([entry]) => {
  if (!entry.isIntersecting || loading) return;
  loading = true;
  try { const items = await (await fetch(`/api/items?page=${page++}`)).json(); append(items); }
  finally { loading = false; }
}, { rootMargin: '200px' }).observe(sentinel);
```

### C30. Tiny reactive store (observer pattern)
```js
function createStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      subs.forEach((fn) => fn(state));
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
  };
}
```

### C31. Counter with closure (data privacy) and a "once per N calls" limiter
```js
function createRateLimiter(max, windowMs) {
  const calls = [];
  return function allow() {
    const now = Date.now();
    while (calls.length && now - calls[0] > windowMs) calls.shift();
    if (calls.length >= max) return false;
    calls.push(now); return true;
  };
}
const allow = createRateLimiter(5, 1000);   // at most 5 calls per second
```

### C32. Implement `Array.prototype.flat` iteratively, `Object.fromEntries`, `Object.entries`
```js
Array.prototype.myFlat = function (depth = 1) {
  const stack = this.map((v) => [v, depth]).reverse(); const out = [];
  while (stack.length) {
    const [v, d] = stack.pop();
    if (Array.isArray(v) && d > 0) for (let i = v.length - 1; i >= 0; i--) stack.push([v[i], d - 1]);
    else out.push(v);
  }
  return out;
};
const fromEntries = (pairs) => pairs.reduce((o, [k, v]) => ((o[k] = v), o), {});
```

### C33. Event delegation helper
```js
function delegate(parent, selector, type, handler) {
  parent.addEventListener(type, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler.call(target, e);
  });
}
delegate(document.querySelector('#todo'), 'button.delete', 'click', function () { this.closest('li').remove(); });
```

### C34. Generator-based ID, range and `take`
```js
function* range(start = 0, end = Infinity, step = 1) { for (let i = start; i < end; i += step) yield i; }
function* take(n, it) { let i = 0; for (const v of it) { if (i++ >= n) return; yield v; } }
[...take(5, range(10))];        // [10, 11, 12, 13, 14]
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `TypeError: Cannot read properties of undefined (reading 'name')`
You access a property on `undefined`/`null`. Causes: API data not loaded yet, wrong path, array index out of range. Fix: optional chaining (`user?.profile?.name`), defaults, validate the response shape, handle loading states.

### D2. `TypeError: x is not a function`
You called something that is not a function: a typo, a variable shadowed by a non-function, a `var` function expression called before assignment, wrong import (default vs named), or `this` lost. Check `typeof x` and the import.

### D3. `this` is `undefined` inside a callback or method
The method was passed as a callback and lost its context.
```js
class Timer {
  seconds = 0;
  start() { setInterval(this.tick, 1000); }   // ❌ this lost
  tick() { this.seconds++; }
}
// ✅ fixes: setInterval(this.tick.bind(this), 1000);  or  tick = () => { this.seconds++; };  or  setInterval(() => this.tick(), 1000);
```

### D4. The loop prints `3 3 3` instead of `0 1 2`
`var` is function-scoped, so all callbacks share one `i`. Use `let`, or wrap in an IIFE/closure.

### D5. `await` inside `forEach` does not wait
`forEach` ignores the returned promises. Use `for...of` (sequential) or `await Promise.all(arr.map(...))` (parallel).

### D6. Stale closure: the value inside a handler or hook is old
The callback captured an old variable (common in `setInterval`, React effects). Fix: use a ref/latest value, functional state updates (`setCount(c => c + 1)`), or include dependencies correctly.

### D7. Race condition: old response overwrites new data
Multiple requests finish out of order. Fix: abort the previous request (`AbortController`), or compare a request id/token before applying the result.
```js
let latest = 0;
async function search(q) { const id = ++latest; const data = await api(q); if (id !== latest) return; render(data); }
```

### D8. Memory grows and the page gets slow
Likely leaks: listeners not removed, `setInterval` not cleared, detached DOM nodes referenced, growing arrays/Maps/caches. Use heap snapshots and cleanup code (see Q81).

### D9. `0.1 + 0.2 !== 0.3`
Floating-point precision. Use integers (paise), `toFixed` for display, or compare with a tolerance.

### D10. `[10, 9, 1].sort()` gives wrong order
The default sort compares strings. Provide `(a, b) => a - b`.

### D11. State/array changed unexpectedly
You mutated a shared object (`push`, `sort`, direct property change) or copied shallowly. Use immutable updates (`[...]`, `map`, `toSorted`) or `structuredClone`.

### D12. `JSON.stringify` throws "Converting circular structure to JSON"
An object references itself. Remove the cycle, use a replacer that tracks seen objects, or a library (`flatted`).

### D13. `Unhandled promise rejection` / `Uncaught (in promise)`
A promise rejected with no `.catch` / try-catch. Always `await` in `try/catch`, return promises, and add a global `unhandledrejection` handler for reporting.

### D14. CORS error in the browser console
The server did not send the right `Access-Control-Allow-*` headers (or the preflight failed). It is a **server** configuration problem; the browser only enforces it. Fix on the server, or use a same-origin proxy in development. Never "fix" with `mode: 'no-cors'` (the response becomes opaque).

### D15. `fetch` does not throw on 404/500
`fetch` rejects only on network errors. Check `res.ok` and throw yourself.

### D16. Event listener does not fire for dynamically added elements
The listener was attached before the elements existed. Use event delegation on a stable parent.

### D17. `ReferenceError: Cannot access 'x' before initialization`
TDZ: using a `let`/`const`/`class` before its declaration. Move the declaration up or fix the order (also check circular imports).

### D18. `SyntaxError: Cannot use import statement outside a module` / `require is not defined`
Module system mismatch. Set `"type": "module"` or use `.mjs`; in the browser use `<script type="module">`; do not mix `require` in ESM files.

### D19. Wrong date or off-by-one month/day
Months are 0-based; `new Date('2026-01-15')` is UTC and may show the previous day in negative-offset time zones. Use explicit UTC methods or `Intl` with a time zone.

### D20. `NaN` appears in the UI
A calculation used `undefined`/non-numeric text (`Number('12px')`, `undefined + 1`). Validate inputs, use `Number.isNaN`, and provide defaults.

### D21. Infinite loop or "Maximum call stack size exceeded"
Missing base case in recursion, or a state update that triggers itself. Add a base case/guard; convert deep recursion to a loop.

### D22. Script runs before the DOM is ready (`null` elements)
The script is in `<head>` without `defer`. Use `defer`, `type="module"`, or `DOMContentLoaded`.

### D23. Changes not visible after deploy (users see the old version)
Cached HTML or service worker serving old assets. Use hashed filenames, short HTML cache, a service-worker update flow, and version checks.

### D24. Debugging method (say this in interviews)
Reproduce → read the exact error and stack → form a hypothesis → isolate with `console.log`/breakpoints/`debugger` → inspect Network, Application and Performance tabs → fix the root cause → add a test or guard → document.


---

# 🎭 Part 8: Tricky / Gotcha Questions

### T1. Why is `typeof null` equal to `'object'`?
A historical bug from the first version of JavaScript (values were tagged by type bits and `null` was the null pointer with the object tag). It was never fixed to keep old code working. Check `null` with `=== null`.

### T2. Why is `NaN !== NaN`? How do you test for `NaN`?
By the IEEE-754 standard, `NaN` is never equal to anything, including itself. Use `Number.isNaN(x)` or `Object.is(x, NaN)`. The global `isNaN('abc')` is `true` because it **coerces first**; `Number.isNaN('abc')` is `false`.

### T3. What do `[] + []`, `[] + {}`, `{} + []` return?
`[] + []` → `''` (both become empty strings). `[] + {}` → `'[object Object]'`. `{} + []` at the **start of a statement** is parsed as an empty block followed by `+[]` → `0` (in a console it may show `0`), but as an expression `({}) + []` → `'[object Object]'`.

### T4. Why is `[] == ![]` true?
`![]` is `false`. So `[] == false`. The array becomes a primitive `''`, then `'' == false` → both become numbers `0 == 0` → `true`. (This is why we use `===`.)

### T5. Why is `0.1 + 0.2 !== 0.3`?
Numbers are IEEE-754 double-precision binary floats. 0.1 and 0.2 cannot be represented exactly, so the sum is `0.30000000000000004`.

### T6. What does `['1', '2', '3'].map(parseInt)` return?
`[1, NaN, NaN]`. `map` passes `(value, index, array)`, so `parseInt('2', 1)` (radix 1 is invalid → `NaN`) and `parseInt('3', 2)` (3 is not a binary digit → `NaN`). Use `.map(Number)` or `.map((s) => parseInt(s, 10))`.

### T7. Function declaration vs `var` with the same name?
```js
console.log(typeof foo);     // 'function'
var foo = 1;
function foo() {}
console.log(typeof foo);     // 'number'
```
Function declarations are hoisted above `var`, and the `var` declaration does not overwrite it until the assignment runs.

### T8. What happens with `delete arr[1]` and `arr.length = 0`?
`delete` removes the value and leaves an empty **hole** (length unchanged). Setting `length = 0` truncates the array and clears it. Use `splice` to remove an element.

### T9. Why does `new Array(3).fill([])` behave strangely?
All three slots share **the same array reference**. Pushing to one changes all. Use `Array.from({ length: 3 }, () => [])`.

### T10. What does `"b" + "a" + +"a" + "a"` print?
`'baNaNa'`. The unary `+"a"` converts `'a'` to `NaN`, which becomes the string `'NaN'` in the concatenation.

### T11. `null >= 0` and `null == 0`?
`null >= 0` → `true` (relational comparison converts `null` to `0`). `null > 0` → `false`. `null == 0` → `false` (`==` has a special rule: `null` only equals `undefined`). A famous inconsistency.

### T12. `Math.max()` and `Math.min()` with no arguments?
`Math.max()` → `-Infinity`, `Math.min()` → `Infinity` (the identity values).

### T13. `0 === -0`? And `Object.is(0, -0)`?
`0 === -0` is `true`; `Object.is(0, -0)` is `false`. `1 / -0` is `-Infinity`.

### T14. In what order does `Object.keys` return keys?
Integer-like keys in **ascending numeric order** first, then string keys in **creation order**. Symbols are not included.
```js
Object.keys({ b: 1, 2: 1, a: 1, 1: 1 });    // ['1', '2', 'b', 'a']
```

### T15. Why can `for...in` give unexpected keys?
It also iterates **inherited enumerable** properties. Use `Object.keys`, `Object.entries`, or check `Object.hasOwn(obj, key)`. Do not use `for...in` on arrays.

### T16. What does an `async` function return? What does `return await` do?
Always a **Promise**. `return await p` inside `try/catch` lets the `catch` handle the rejection of `p`; without `await`, a rejection escapes the `try` block.
```js
async function a() { try { return await fail(); } catch { return 'caught'; } }   // 'caught'
async function b() { try { return fail(); } catch { return 'caught'; } }         // rejects
```

### T17. What does `finally` do to a `return`?
`finally` always runs, and a `return` inside `finally` **overrides** the value returned from `try`.
```js
function f() { try { return 'try'; } finally { return 'finally'; } }   // 'finally'
```

### T18. Closures capture variables, not values. What does it mean?
The inner function sees the **current** value of the variable when it runs, not the value when it was created.
```js
let x = 1; const show = () => x; x = 2; show();   // 2
```

### T19. `this` inside an arrow function in an object literal?
Arrow functions do not have their own `this`. In an object literal method `{ f: () => this }`, `this` is the surrounding scope (module/global), not the object.

### T20. Does `'use strict'` change `this`?
Yes: in a plain function call `this` is `undefined` in strict mode (the global object in sloppy mode).

### T21. What is the result of `ASI` here?
```js
function f() {
  return
  { ok: true };
}
f();    // undefined
```
Automatic Semicolon Insertion adds `;` after `return`. Keep the value on the same line as `return`. Also beware of lines that start with `(` or `[` after a line without a semicolon.

### T22. Why does `let` inside `switch` cases cause an error?
All `case` clauses share one block scope. Redeclaring `let x` in two cases throws a `SyntaxError`. Wrap each case body in `{ }`.

### T23. `Number.MAX_SAFE_INTEGER + 2`?
`9007199254740993` cannot be represented; the result is `9007199254740992`. Use `BigInt` (`9007199254740993n`) for exact large integers. You cannot mix `BigInt` and `number` in arithmetic.

### T24. Length of an emoji string?
`'😀'.length` is `2` (two UTF-16 code units). `[...'😀'].length` is `1`. Use `Intl.Segmenter` for user-perceived characters (grapheme clusters).

### T25. What is wrong with `JSON.stringify` for some values?
`NaN`/`Infinity` → `null`; `undefined`, functions and symbols are skipped in objects (and become `null` in arrays); `Date` → ISO string; `Map`/`Set` → `{}`; `BigInt` throws; circular references throw.

### T26. What is the output order?
```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
(async () => { console.log('async start'); await null; console.log('after await'); })();
console.log('sync');
// async start, sync, promise, after await, timeout
```
Microtasks (promise, await continuation) run before the next macrotask (timeout).

### T27. Why does `"5" + 3` give `"53"` but `"5" - 3` give `2`?
`+` with a string operand concatenates. `-`, `*`, `/` always convert both sides to numbers.

### T28. Does `const` make an object immutable?
No. It prevents **re-assignment of the binding**. The object can still change. Use `Object.freeze` (shallow) or immutable patterns for immutability.

### T29. What is the difference between `Array.from({ length: 3 })` and `new Array(3)`?
`Array.from({ length: 3 })` creates `[undefined, undefined, undefined]` (real values you can map over). `new Array(3)` creates a **sparse** array with 3 empty slots; `map`/`forEach` skip the holes.

### T30. Accidental globals
In sloppy mode, `x = 5` (without `let/const/var`) creates a global variable. In strict mode/ES modules it throws a `ReferenceError`.

### T31. `typeof` of a class and a function
```js
class A {}
typeof A;                // 'function'
// A();                  // TypeError: Class constructor A cannot be invoked without 'new'
```

### T32. `[10, 1, 5].sort().reverse()` result and mutation
`sort()` and `reverse()` **mutate** the same array. The default `sort()` gives `[1, 10, 5]`, and `reverse()` makes it `[5, 10, 1]`.

### T33. `parseInt(0.0000005)`
`5`. The number is converted to the string `'5e-7'` first, and `parseInt` reads the leading `5`.

### T34. Are `==` rules for objects tricky?
`{} == '[object Object]'` is `true` (the object is converted to a string). Two objects are equal only if they are the **same reference**.

### T35. Does `Array.prototype.includes` find `NaN`?
Yes (`includes` uses SameValueZero). `indexOf(NaN)` returns `-1` (it uses `===`).

---

# ⚡ Part 9: Rapid Fire (one-liners)

| Q | A |
|---|---|
| JS is single-threaded or multi-threaded? | Single-threaded (one call stack); async via the event loop |
| Compiled or interpreted? | JIT compiled |
| Number of primitive types? | 7 |
| `typeof []`? | `'object'` |
| `null == undefined`? | `true` |
| `null === undefined`? | `false` |
| Falsy values count? | 8 |
| Which declarations are block scoped? | `let`, `const`, `class` |
| Which is hoisted with value? | Function declarations |
| `const` means? | Binding cannot be re-assigned |
| Arrow function has own `this`? | No |
| Can you `new` an arrow function? | No |
| `Array.isArray([])`? | `true` |
| How to remove duplicates? | `[...new Set(arr)]` |
| Copy an array? | `[...arr]`, `arr.slice()` |
| Deep copy? | `structuredClone(obj)` |
| Merge objects? | `{ ...a, ...b }` |
| Check own property? | `Object.hasOwn(obj, k)` |
| Join an array? | `arr.join(',')` |
| Last element? | `arr.at(-1)` |
| Is it a promise? | `typeof x?.then === 'function'` |
| Wait for all promises? | `Promise.all` |
| First settled promise? | `Promise.race` |
| First fulfilled promise? | `Promise.any` |
| Run after current stack but before render? | `queueMicrotask` / promise |
| Run before the next paint? | `requestAnimationFrame` |
| Stop event bubbling? | `event.stopPropagation()` |
| Stop default action? | `event.preventDefault()` |
| Which event delegates? | Any bubbling event (not `focus`, `blur`) |
| Storage size of localStorage? | About 5 MB |
| Sync or async: localStorage? | Synchronous |
| Cancel fetch? | `AbortController` |
| Check if online? | `navigator.onLine` |
| Get unique id? | `crypto.randomUUID()` |
| Current time (ms)? | `Date.now()` |
| High-resolution timer? | `performance.now()` |
| Convert string to number? | `Number(s)` or `+s` |
| Round to 2 decimals? | `Math.round(x * 100) / 100` or `toFixed(2)` |
| Sleep function? | `new Promise(r => setTimeout(r, ms))` |
| Run code once? | `{ once: true }` in `addEventListener` |

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. "Tell me about a hard bug you fixed in JavaScript."
**Sample answer (STAR):**
- **S:** Our search page sometimes showed results for the previous query.
- **T:** Find the cause and fix it without hurting speed.
- **A:** I reproduced it with network throttling and saw responses arriving out of order. I added `AbortController` to cancel the previous request and a debounce of 300 ms, plus a test with fake timers.
- **R:** Wrong results disappeared (0 reports in the next 3 months) and API calls fell by about 60%.
Tip: show your **method** (reproduce → hypothesis → isolate → fix → prevent).

### P2. "How did you improve performance in a JavaScript application?"
Example: profiled with DevTools, found a 400 ms long task from rendering 5,000 rows. Fixed with virtualization and memoization; moved JSON parsing to a Web Worker; INP improved from 480 ms to 140 ms. Always give numbers.

### P3. "How do you structure async code and handle errors?"
Use `async/await` with `try/catch` at boundaries, `Promise.all` for parallel work, `AbortController` for cancellation, custom error classes, central error reporting, retries with backoff for safe calls, and user-friendly fallbacks.

### P4. "Describe a time you reviewed someone's code and found a serious issue."
Example: a `forEach(async ...)` that did not wait, causing the page to show "Saved" before saving finished. Explain how you taught the fix and added an ESLint rule (`no-floating-promises` / `require-await`).

### P5. "How do you keep up with JavaScript changes?"
Follow the TC39 proposals and MDN/Baseline, read release notes, try features behind `@supports`/feature detection, learn through small experiments, and share through team sessions. Mention how you decide when a new feature is safe for production.

### P6. "Why did you choose (or not choose) TypeScript?"
Explain team size, product lifetime, refactoring cost, and a gradual adoption plan with measured results (bugs caught, onboarding time).

### P7. "How do you test your JavaScript code?"
Unit tests for pure logic, integration tests with mocked network (MSW), E2E for critical flows (Playwright), fake timers for debounce/retry, coverage on critical modules, and tests that run in CI on every PR.

### P8. "What would you do if a third-party script slows your site?"
Measure its cost (Performance panel, Lighthouse third-party summary), load it with `async/defer` or on interaction, use a facade, move it to a worker (Partytown), set a budget and talk to the owner; remove it if the value is lower than the cost.

---

# 📚 Part 11: Complete Coverage (Classic + ES6+ + APIs + Mixed)

## 11A. Classic JavaScript Questions

### K1. What is an IIFE and why use it?
An **Immediately Invoked Function Expression** runs right after it is defined. It creates a private scope (before `let/const` and modules) to avoid global variables.
```js
const counter = (function () { let c = 0; return { inc: () => ++c }; })();
(async () => { await main(); })();     // common today for top-level async in scripts
```

### K2. What is the `arguments` object?
An array-like object available in non-arrow functions that holds all passed arguments. It is not a real array (no `map`). Use rest parameters instead: `function f(...args) {}`. Convert: `Array.from(arguments)`.

### K3. Same-origin policy, CORS and `postMessage`
The browser blocks scripts from reading responses from a different **origin** (scheme + host + port). **CORS** is a server-controlled way to allow it with headers (`Access-Control-Allow-Origin`, etc.). **Preflight** (`OPTIONS`) is sent for non-simple requests. `window.postMessage` allows safe cross-window communication (always check `event.origin`).

### K4. `window.onload` vs `DOMContentLoaded` vs `defer`
`DOMContentLoaded`: HTML parsed (deferred scripts done). `load`: all resources loaded (images, styles). `defer` scripts run before `DOMContentLoaded`.

### K5. What is `eval` and why avoid it?
`eval(string)` runs a string as code. It is slow (blocks optimizations), unsafe (code injection), and hard to debug. Same for `new Function(string)` and `setTimeout('code')`. Use JSON.parse for data and proper functions for code.

### K6. What is `void 0`?
`void expr` evaluates the expression and returns `undefined`. `void 0` was used as a safe way to get `undefined` when it could be overwritten (old browsers).

### K7. What are array-like objects and iterables?
Array-like: has `length` and indexed items (`arguments`, `NodeList`, strings). Iterable: implements `Symbol.iterator` (arrays, strings, Map, Set, NodeList). Convert with `Array.from()` or spread (iterables only).

### K8. How do you check if an object is empty?
```js
Object.keys(obj).length === 0 && obj.constructor === Object;
```

### K9. How do you remove duplicates, find max, sum, count occurrences?
```js
[...new Set(arr)];
Math.max(...arr);
arr.reduce((a, b) => a + b, 0);
arr.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
```

### K10. Difference between `slice` and `splice`?
`slice(start, end)` returns a **copy** of part of the array (does not mutate). `splice(start, deleteCount, ...items)` **mutates** the array (removes/inserts) and returns the removed items.

### K11. Difference between `forEach`, `map`, `filter`, `reduce`
`forEach` → side effects, returns nothing. `map` → transform each item. `filter` → keep matching items. `reduce` → combine into one value. Chain them for readable pipelines.

### K12. What is the call stack? What is a stack overflow?
A stack of execution contexts for function calls. Too many nested calls (infinite recursion) exceed the limit → `RangeError: Maximum call stack size exceeded`.

### K13. What is `setTimeout(fn, 0)` really?
It schedules `fn` as a macrotask after the current code and all microtasks (minimum delay is clamped, usually ~1–4 ms in browsers; nested timers are clamped to 4 ms). It is **not** guaranteed to run exactly after 0 ms.

### K14. What is the difference between `Object.keys`, `Object.getOwnPropertyNames`, `Reflect.ownKeys`?
`Object.keys`: own **enumerable string** keys. `getOwnPropertyNames`: own string keys (including non-enumerable). `Reflect.ownKeys`: own string **and symbol** keys (including non-enumerable).

### K15. What is a pure function vs a side effect? Give examples of side effects.
Side effects: changing external variables, mutating arguments, DOM updates, network calls, logging, timers, reading the current time or random numbers.

### K16. What is "this" in event handlers, `setTimeout`, and classes?
Event handler (regular function) → the element. `setTimeout(function(){ this })` → global/`undefined` in strict. Class methods lose `this` when passed as callbacks unless bound or defined as arrow-function class fields.

### K17. What is `use strict` impact on `arguments`, `delete`, duplicates?
Disallows duplicate parameter names, deleting variables, octal literals (`010`), using `with`, and writing to read-only properties silently.

### K18. Debounce vs throttle vs `requestAnimationFrame`
Debounce waits for silence; throttle limits rate; `requestAnimationFrame` syncs with the browser's paint (≈60 times/second) and pauses in background tabs. For scroll animations prefer rAF.

### K19. What is a Web API (in the browser) vs the JS engine?
The engine (V8) implements ECMAScript (language). **Web APIs** (DOM, fetch, timers, storage, workers) are provided by the browser and run outside the engine, then send callbacks back through the event loop.

### K20. What is a JavaScript "polyfill" vs "shim" vs "transpiler"?
Polyfill: implements a missing API using older features. Shim: a general compatibility layer. Transpiler: converts new syntax to old (Babel).

## 11B. ES6+ Feature Checklist (quick revision)

| Feature | Example |
|---|---|
| `let` / `const` | `const x = 1;` |
| Arrow functions | `(a, b) => a + b` |
| Template literals | `` `Hi ${name}` `` |
| Destructuring | `const { a, b } = obj;` |
| Default params | `function f(a = 1) {}` |
| Rest / spread | `f(...args)`, `[...a, ...b]` |
| Classes | `class A extends B {}` |
| Modules | `import x from './x.js'` |
| Promises | `new Promise((res, rej) => {})` |
| `async` / `await` | `await fetch(url)` |
| Symbol | `Symbol('id')` |
| Iterators / generators | `function* g() { yield 1; }` |
| `Map` / `Set` / `WeakMap` | `new Map()` |
| Proxy / Reflect | `new Proxy(target, handler)` |
| `for...of` | `for (const x of list) {}` |
| Enhanced object literals | `{ a, b, [key]: 1, method() {} }` |
| `Array.from/of/find/findIndex/includes` | `Array.from('abc')` |
| `Object.assign/entries/values/fromEntries` | `Object.entries(o)` |
| String methods | `startsWith`, `endsWith`, `includes`, `repeat`, `padStart`, `replaceAll`, `at` |
| Optional chaining & nullish | `a?.b ?? c` |
| BigInt | `123n` |
| Logical assignment | `a ||= b` |
| Class fields / private | `#x = 1` |
| `structuredClone` | `structuredClone(obj)` |
| Array copy methods | `toSorted()`, `with()` |
| `Object.groupBy` | `Object.groupBy(arr, fn)` |

## 11C. Browser / Web APIs (what to know)

### A1. DOM APIs you should know
```js
el.closest('.card'); el.matches('.active'); el.classList.toggle('open');
el.dataset.userId; el.getAttribute('href'); el.setAttribute('aria-expanded', 'true');
parent.append(a, b); parent.prepend(c); el.remove(); el.replaceWith(newEl); el.cloneNode(true);
el.insertAdjacentHTML('beforeend', '<li>x</li>');          // sanitize untrusted input first
el.getBoundingClientRect(); el.scrollIntoView({ behavior: 'smooth' });
document.createDocumentFragment();                         // batch DOM inserts
```

### A2. Observers
`IntersectionObserver` (visibility: lazy load, infinite scroll), `MutationObserver` (DOM changes), `ResizeObserver` (element size), `PerformanceObserver` (metrics like LCP).

### A3. Networking
`fetch`, `Request/Response/Headers`, `FormData`, `URL/URLSearchParams`, `AbortController`, `WebSocket` (two-way), `EventSource` (server push), `navigator.sendBeacon`, `XMLHttpRequest` (legacy).

### A4. Storage and state
`localStorage`, `sessionStorage`, cookies, IndexedDB, Cache API, `history.pushState`, `location`, `URL` hash.

### A5. Device and platform
`navigator.clipboard`, `navigator.geolocation`, `navigator.onLine` + `online/offline` events, `Notification`, `Page Visibility` (`visibilitychange`), `BroadcastChannel`, `Web Share`, `Vibration`, `Screen Wake Lock`, `Web Crypto` (`crypto.subtle`).

### A6. Timing
`setTimeout`, `setInterval`, `requestAnimationFrame`, `requestIdleCallback`, `queueMicrotask`, `performance.now()`, `scheduler.postTask` (where available).

## 11D. HTML + CSS + JavaScript Mixed (practical)

### M1. Complete todo app (DOM + events + localStorage)
```html
<form id="form"><input id="text" required placeholder="New task"><button>Add</button></form>
<ul id="list"></ul>
<script type="module">
  const key = 'todos';
  let todos = JSON.parse(localStorage.getItem(key) ?? '[]');
  const save = () => localStorage.setItem(key, JSON.stringify(todos));

  function render() {
    list.replaceChildren(...todos.map((t) => {
      const li = document.createElement('li');
      li.dataset.id = t.id;
      li.innerHTML = `<label><input type="checkbox"> <span></span></label> <button type="button" class="del" aria-label="Delete">✕</button>`;
      li.querySelector('input').checked = t.done;
      li.querySelector('span').textContent = t.text;           // textContent: safe from XSS
      return li;
    }));
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    todos.push({ id: crypto.randomUUID(), text: text.value.trim(), done: false });
    text.value = ''; save(); render();
  });
  list.addEventListener('click', (e) => {                       // event delegation
    const li = e.target.closest('li'); if (!li) return;
    if (e.target.matches('.del')) todos = todos.filter((t) => t.id !== li.dataset.id);
    else if (e.target.matches('input[type=checkbox]')) todos = todos.map((t) => (t.id === li.dataset.id ? { ...t, done: e.target.checked } : t));
    save(); render();
  });
  render();
</script>
```

### M2. Fetch + loading + error + render pattern
```js
async function load() {
  status.textContent = 'Loading...';
  try {
    const res = await fetch('/api/users', { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();
    list.replaceChildren(...users.map((u) => Object.assign(document.createElement('li'), { textContent: u.name })));
    status.textContent = '';
  } catch (err) {
    status.textContent = err.name === 'TimeoutError' ? 'Request timed out' : 'Could not load users';
    console.error(err);
  }
}
```

### M3. Form handling with `FormData` and validation
```js
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) return form.reportValidity();
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) return showError(await res.text());
  form.reset();
});
```

### M4. Copy to clipboard and theme persistence
```js
copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(codeEl.textContent); copyBtn.textContent = 'Copied'; }
  catch { copyBtn.textContent = 'Press Ctrl+C'; }
});
document.documentElement.dataset.theme = localStorage.getItem('theme') ?? 'light';
```

### M5. Accessible modal with focus management
```js
let lastFocus;
function openModal(modal) {
  lastFocus = document.activeElement;
  modal.hidden = false;
  modal.querySelector('[autofocus], button, [href], input')?.focus();
  document.addEventListener('keydown', onKey);
}
function closeModal(modal) { modal.hidden = true; document.removeEventListener('keydown', onKey); lastFocus?.focus(); }
function onKey(e) { if (e.key === 'Escape') closeModal(document.querySelector('.modal:not([hidden])')); }
```
(Native `<dialog>` does the focus trap and ESC automatically.)

---

# 🧠 Part 12: Engine Internals

### B1. Execution context: creation and execution phases
When code runs, the engine creates an **execution context** with: a **Lexical Environment** (variables/functions and a reference to the outer environment), a **Variable Environment**, and the **`this` binding**. 
- **Creation phase:** scan declarations, set up variables (`var` = `undefined`, functions = defined, `let/const` = uninitialized), determine `this`.
- **Execution phase:** run line by line and assign values.
Contexts are pushed on the **call stack** (global first, then one per function call) and popped when finished.

### B2. How closures work internally
Every function keeps a hidden reference to the **environment** where it was created (`[[Environment]]`). The environment (with variables that inner functions use) stays alive as long as some function references it. That is why a closure can read outer variables after the outer function returned, and why large captured objects can cause memory retention. Engines optimize by only keeping variables that are actually captured.

### B3. How property lookup works
`obj.prop` → check own properties → if missing, follow `[[Prototype]]` → repeat until `null` (then `undefined`). Setting a property creates it on the **object itself** (unless a setter or non-writable property exists on the chain). Engines use hidden classes and inline caches to make repeated lookups very fast.

### B4. What happens when you call `new`?
`[[Construct]]`: create an object whose prototype is `F.prototype` → call `F` with `this` = that object → if `F` returns an object, use that; otherwise return the created object. For derived classes, `super()` must run before `this` is available because the base constructor creates the object.

### B5. How the event loop is specified (jobs and tasks)
HTML spec: the event loop has multiple **task queues** (timers, user interaction, networking) and one **microtask queue**. After each task and after each callback when the stack is empty, the engine performs a **microtask checkpoint** (drains all microtasks). Rendering opportunities happen between tasks (about every 16.7 ms on 60 Hz displays), and `requestAnimationFrame` callbacks run just before paint.

### B6. How `await` works under the hood
`await x` converts `x` to a promise (`Promise.resolve(x)`), **suspends** the async function, and schedules the rest of the function as a **microtask** that runs when the promise settles. The caller gets control back immediately. Async functions are compiled like generators plus a promise driver.
```js
async function f() { console.log(1); await null; console.log(2); }
f(); console.log(3);        // 1, 3, 2
```

### B7. Generators as state machines
A generator function compiles to an object that remembers its execution position and local variables. `next(value)` resumes it until the next `yield`. `async/await` and Redux-Saga-style flows use this idea.

### B8. JIT tiers in V8
Ignition (interpreter, bytecode) → Sparkplug (baseline, fast compile) → Maglev (mid-tier optimizing JIT in newer V8) → TurboFan (top-tier optimizing compiler). Code moves up as it gets hot, and falls back (**deopt**) if assumptions break (types change, shape changes).

### B9. Array "elements kinds" and holes
V8 stores arrays differently: `PACKED_SMI_ELEMENTS` (small integers) → `PACKED_DOUBLE_ELEMENTS` → `PACKED_ELEMENTS` (mixed). Holes (`HOLEY_*`) are slower. Once an array becomes more general it never goes back. Pre-size carefully and avoid holes in hot arrays.

### B10. Number representation
JavaScript numbers are 64-bit IEEE-754 doubles, but the engine uses small-integer (Smi) fast paths internally. Integers are exact only up to `2^53 − 1`. Bitwise operators convert to 32-bit signed integers (`1 << 31` is negative).

### B11. String internals
Strings are immutable. Engines use **ropes** (concatenation trees) to make repeated `+=` cheap, and flatten them when needed. Strings are UTF-16: characters outside the BMP take two code units.

### B12. Module loading phases (ESM)
**Construction** (find, fetch, parse all modules into a graph) → **Instantiation** (create live bindings, hoist exports) → **Evaluation** (run module code in dependency order, once). Cyclic imports work because bindings are live, but you may see `undefined` or TDZ errors if you use a value before its module has run. Top-level `await` pauses the module's evaluation (and its dependents).

### B13. Garbage collection and reachability
An object is alive if it is reachable from a root (global object, current stack, active closures, registered listeners/timers). Unreachable objects are collected, but **when** is not guaranteed. That is why finalizers/`WeakRef` should not be used for critical logic.

### B14. Where microtasks come from
Promise reactions, `await` continuations, `queueMicrotask`, `MutationObserver` callbacks. A never-ending microtask loop blocks timers and rendering (starvation).

---

# 📋 Part 13: Reference Tables

### R1. `typeof` results
| Value | `typeof` |
|---|---|
| `'a'` | `'string'` |
| `1`, `NaN`, `Infinity` | `'number'` |
| `1n` | `'bigint'` |
| `true` | `'boolean'` |
| `undefined` | `'undefined'` |
| `null` | `'object'` |
| `Symbol()` | `'symbol'` |
| `{}`, `[]`, `new Date()` | `'object'` |
| `function(){}`, `class {}` | `'function'` |

### R2. Type conversion table
| Value | `Number()` | `String()` | `Boolean()` |
|---|---|---|---|
| `""` | 0 | `""` | false |
| `" "` | 0 | `" "` | true |
| `"0"` | 0 | `"0"` | true |
| `"abc"` | NaN | `"abc"` | true |
| `0` | 0 | `"0"` | false |
| `-0` | -0 | `"0"` | false |
| `1` | 1 | `"1"` | true |
| `NaN` | NaN | `"NaN"` | false |
| `Infinity` | Infinity | `"Infinity"` | true |
| `null` | 0 | `"null"` | false |
| `undefined` | NaN | `"undefined"` | false |
| `[]` | 0 | `""` | true |
| `[5]` | 5 | `"5"` | true |
| `[1,2]` | NaN | `"1,2"` | true |
| `{}` | NaN | `"[object Object]"` | true |
| `function(){}` | NaN | source text | true |
| `true` / `false` | 1 / 0 | `"true"` / `"false"` | — |

### R3. Loose equality (`==`) quick results
| Expression | Result |
|---|---|
| `null == undefined` | true |
| `null == 0` | false |
| `'' == 0` | true |
| `'0' == false` | true |
| `[] == false` | true |
| `[] == ''` | true |
| `[1] == 1` | true |
| `NaN == NaN` | false |
| `{} == {}` | false |
| `'1' == 1` | true |

### R4. `var` / `let` / `const`
(See Q2 in Part 1.)

### R5. Promise combinators
(See Q57 in Part 3.)

### R6. `this` binding rules (priority order)
1. `new` binding → the new object
2. Explicit binding (`call/apply/bind`) → the given object
3. Implicit binding (`obj.method()`) → `obj`
4. Default binding → `undefined` (strict) or global (sloppy)
Arrow functions skip all of these and use the outer `this`.

### R7. Mutating vs non-mutating array methods
**Mutating:** `push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin`. **Non-mutating:** `map, filter, reduce, slice, concat, flat, flatMap, find, includes, indexOf, join, toSorted, toReversed, toSpliced, with`.

### R8. Useful `Object` static methods
`Object.keys/values/entries`, `Object.fromEntries`, `Object.assign`, `Object.create`, `Object.freeze/isFrozen`, `Object.seal`, `Object.defineProperty`, `Object.getPrototypeOf/setPrototypeOf`, `Object.hasOwn`, `Object.is`, `Object.getOwnPropertyNames`, `Object.getOwnPropertyDescriptors`, `Object.groupBy`.

### R9. `Map` vs plain object
| | `Map` | Object |
|---|---|---|
| Key types | Any | String / Symbol |
| Order | Insertion | Integer keys first, then insertion |
| Size | `map.size` | Manual |
| Iteration | Directly iterable | Needs `Object.keys/entries` |
| Prototype keys clash | No | Yes (`toString`, `__proto__`) |
| JSON | Not directly | Yes |

### R10. Event phases and common events
Phases: capture (1), target (2), bubble (3). Events that **do not bubble**: `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `scroll` (on elements). Use `focusin/focusout` as bubbling alternatives.

### R11. Error types
`Error`, `TypeError` (wrong type/undefined call), `ReferenceError` (undeclared variable), `SyntaxError`, `RangeError` (out of range, stack overflow), `URIError`, `EvalError`, `AggregateError` (Promise.any), `DOMException` (e.g., `AbortError`).

### R12. `console` methods
`log, info, warn, error, table, group/groupEnd, time/timeEnd, count, assert, dir, trace, clear`.

### R13. Common timing APIs
| API | Runs | Use |
|---|---|---|
| `setTimeout` | macrotask after delay | delay, debounce |
| `setInterval` | repeated macrotask | polling (prefer chained timeouts) |
| `requestAnimationFrame` | before next paint | animations |
| `requestIdleCallback` | when idle | low-priority work |
| `queueMicrotask` | after the current task | small deferred work |
| `setImmediate` / `process.nextTick` | Node only | check phase / before promises |

### R14. Regex quick cheat sheet
`\d` digit · `\w` word char · `\s` whitespace · `.` any (except newline) · `^ $` start/end · `* + ?` quantifiers · `{n,m}` range · `[abc]` set · `(a|b)` group/alternation · `(?<name>...)` named group · `(?=...)` lookahead · `(?<=...)` lookbehind · flags `g i m s u y d`.


---

# 🧩 Part 14: Output-Based Questions

> Output questions are the most common JavaScript screening round. For each one, say the answer **and the reason**.

### O1. What does this print?
```js
console.log(typeof null, typeof undefined, typeof NaN, typeof [], typeof function () {}, typeof 10n, typeof Symbol());
```
**Answer:** `object undefined number object function bigint symbol`.

### O2. What is the output?
```js
console.log(a);
var a = 5;
console.log(b);
let b = 1;
```
**Answer:** `undefined`, then `ReferenceError: Cannot access 'b' before initialization`. `var a` is hoisted and set to `undefined`; `let b` is in the Temporal Dead Zone. (Even `typeof b` throws inside the TDZ.)

### O3. What does the loop print?
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);
```
**Answer:** `3 3 3` then `0 1 2`. `var` shares one binding; `let` creates a new binding per iteration. Old fix: `((n) => setTimeout(() => console.log(n)))(i)`.

### O4. What is printed?
```js
var x = 1;
function f() { console.log(x); var x = 2; }
f();
```
**Answer:** `undefined`. Inside `f`, `var x` is hoisted to the top of the function and shadows the outer `x`, but its value is not assigned yet.

### O5. What is `foo` here?
```js
console.log(typeof foo);
var foo = 1;
function foo() {}
console.log(typeof foo);
```
**Answer:** `function`, then `number`. The function declaration is hoisted first; the assignment `foo = 1` runs later.

### O6. What do these print?
```js
const obj = {
  name: 'Ritesh',
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(obj.regular(), obj.arrow());
```
**Answer:** `Ritesh` and `undefined` in a Node module (`this` is `module.exports`, an empty object) or `''` (empty string) in a browser classic script (`this` is `window`, and `window.name` is an empty string). The arrow function uses the outer `this`, not `obj`.

### O7. What happens?
```js
const { regular } = obj;
console.log(regular());
```
**Answer:** The method lost its object. In **strict mode / ES modules**: `TypeError: Cannot read properties of undefined (reading 'name')`. In sloppy mode: `this` is the global object, so it prints `undefined` (Node) or `''` (browser).

### O8. What is the order?
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Answer:** `1 4 3 2`. Sync code first, then microtasks (promise), then macrotasks (timer).

### O9. Async/await ordering
```js
async function a() { console.log('a1'); await b(); console.log('a2'); }
async function b() { console.log('b'); }
console.log('s');
a();
Promise.resolve().then(() => console.log('p'));
console.log('e');
```
**Answer:** `s a1 b e a2 p`. `a()` runs synchronously until the first `await`; the continuation `a2` is queued as a microtask *before* the `p` callback.

### O10. Promise chain
```js
Promise.resolve(1)
  .then((x) => { console.log(x); return x + 1; })
  .then((x) => { console.log(x); throw new Error('boom'); })
  .catch((e) => { console.log(e.message); return 10; })
  .then((x) => console.log(x))
  .finally(() => console.log('done'));
```
**Answer:** `1 2 boom 10 done`. A `catch` that returns a value turns the chain back to fulfilled.

### O11. Executor runs synchronously
```js
console.log(1);
setTimeout(() => console.log(2), 0);
new Promise((res) => { console.log(3); res(); }).then(() => console.log(4));
console.log(5);
```
**Answer:** `1 3 5 4 2`. The Promise **executor** runs synchronously; only `.then` is async.

### O12. Microtasks inside timers
```js
setTimeout(() => { console.log('t1'); Promise.resolve().then(() => console.log('m1')); }, 0);
setTimeout(() => console.log('t2'), 0);
```
**Answer:** `t1 m1 t2`. Microtasks are drained after each macrotask.

### O13. Closure counters
```js
function counter() { let c = 0; return () => ++c; }
const a = counter(), b = counter();
console.log(a(), a(), b());
```
**Answer:** `1 2 1`. Each call creates a separate closure with its own `c`.

### O14. Type coercion
```js
console.log([] + [], [] + {}, true + 1, '5' - 2, '5' + 2, null + 1, undefined + 1, 'b' + 'a' + +'a' + 'a');
```
**Answer:** `''`, `'[object Object]'`, `2`, `3`, `'52'`, `1`, `NaN`, `'baNaNa'`.

### O15. `map(parseInt)`
```js
console.log(['1', '2', '3'].map(parseInt));
```
**Answer:** `[1, NaN, NaN]` (the index is used as the radix).

### O16. Default sort
```js
console.log([10, 9, 1].sort(), ['b', 'a', 'C'].sort());
```
**Answer:** `[1, 10, 9]` and `['C', 'a', 'b']`. Strings are compared by UTF-16 code units, so uppercase letters come first.

### O17. Chained comparison
```js
console.log(typeof typeof 1, 1 < 2 < 3, 3 > 2 > 1);
```
**Answer:** `string true false`. `3 > 2` is `true`, and `true > 1` is `1 > 1` → `false`.

### O18. Unary plus
```js
console.log(+true, +'', +'abc', +[], +{}, +null, +undefined);
```
**Answer:** `1 0 NaN 0 NaN 0 NaN`.

### O19. Object keys are strings
```js
const o = {};
const k1 = { a: 1 }, k2 = { b: 2 };
o[k1] = 'x'; o[k2] = 'y';
console.log(o);
```
**Answer:** `{ '[object Object]': 'y' }`. Both keys become the same string. Use a `Map` for object keys.

### O20. `finally` and `return`
```js
function f() { try { return 'try'; } finally { console.log('finally'); } }
function g() { try { return 'try'; } finally { return 'finally'; } }
console.log(f(), g());
```
**Answer:** prints `finally` first (while evaluating `f()`), then `try finally`.

### O21. Shallow `freeze`
```js
const o = Object.freeze({ a: 1, nested: { b: 2 } });
o.a = 9; o.nested.b = 9;
console.log(o);
```
**Answer:** `{ a: 1, nested: { b: 9 } }` (in strict mode `o.a = 9` throws a `TypeError`). `freeze` is shallow.

### O22. `includes` vs `indexOf` with NaN
```js
console.log([NaN].includes(NaN), [NaN].indexOf(NaN));
```
**Answer:** `true -1`.

### O23. Reference copy
```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length, a === b, [...a] === a);
```
**Answer:** `4 true false`.

### O24. Default parameters
```js
function f(a, b = a * 2) { return [a, b]; }
console.log(f(2), f(2, undefined), f(2, null));
```
**Answer:** `[2, 4] [2, 4] [2, null]`. Defaults apply only for `undefined`.

### O25. ASI with `return`
```js
function f() {
  return
  { ok: true };
}
console.log(f());
```
**Answer:** `undefined` (a semicolon is inserted after `return`).

### O26. `||` vs `??`
```js
console.log(0 || 'a', 0 ?? 'a', '' || 'x', null ?? 'd', undefined?.b);
```
**Answer:** `'a' 0 'x' 'd' undefined`.

### O27. Class method loses `this`
```js
class A { x = 1; getX() { return this.x; } }
const { getX } = new A();
console.log(getX());
```
**Answer:** `TypeError: Cannot read properties of undefined (reading 'x')`. Class bodies are always strict, so `this` is `undefined`. Fix: `getX = () => this.x;`.

### O28. Sparse arrays
```js
console.log(Array(3), Array(3).fill(0), [...Array(3).keys()], Array.from({ length: 3 }, (_, i) => i * 2));
const arr = [1, 2, 3]; delete arr[1];
console.log(arr, arr.length);
```
**Answer:** `[ <3 empty items> ]`, `[0, 0, 0]`, `[0, 1, 2]`, `[0, 2, 4]`; then `[1, <1 empty item>, 3] 3`.

### O29. Block scope
```js
var a = 1; { var a = 2; }
let b = 1; { let b = 2; }
console.log(a, b);
```
**Answer:** `2 1`.

### O30. `switch` fall-through
```js
switch (2) {
  case 1: console.log('one');
  case 2: console.log('two');
  case 3: console.log('three'); break;
  default: console.log('default');
}
```
**Answer:** `two three` (no `break` after `case 2`).

### O31. Dates
```js
console.log(new Date(2024, 0, 31).getMonth(), new Date(2024, 1, 31).toDateString());
```
**Answer:** `0` (January) and `Sat Mar 02 2024` (Feb 31 overflows into March; 2024 is a leap year).

### O32. `Promise.all` with a rejection
```js
Promise.all([Promise.resolve(1), Promise.reject('x'), new Promise((r) => setTimeout(r, 100))])
  .then(console.log)
  .catch((e) => console.log('caught', e));
```
**Answer:** `caught x` immediately (fail-fast).

### O33. What does an async function return?
```js
async function f() { return 1; }
console.log(f());
```
**Answer:** `Promise { 1 }` (a promise, already fulfilled).

### O34. `forEach` with async
```js
[1, 2, 3].forEach(async (n) => { await null; console.log(n); });
console.log('done');
```
**Answer:** `done 1 2 3`. `forEach` does not wait for the async callbacks.

### O35. Frozen array
```js
const arr = Object.freeze([1, 2]);
try { arr.push(3); } catch (e) { console.log(e.constructor.name); }
```
**Answer:** `TypeError` (push on a frozen array throws, even in sloppy mode).

### O36. Symbols
```js
console.log(Symbol('a') === Symbol('a'), Symbol.for('a') === Symbol.for('a'));
```
**Answer:** `false true`.

### O37. Number conversions
```js
console.log(Number(''), Number(' '), Number('12px'), parseInt('12px'), parseFloat('3.14abc'), Number(null), Number(undefined), Number([]), Number(true));
```
**Answer:** `0 0 NaN 12 3.14 0 NaN 0 1`.

### O38. String vs number comparison
```js
console.log('10' < '9', 10 < '9', 'a' < 'b', null >= 0, null == 0);
```
**Answer:** `true false true true false`.

### O39. Accidental global
```js
function f() { let a = b = 3; }
f();
console.log(typeof b);
```
**Answer:** `'number'` in sloppy mode (`b` becomes a global; only `a` is local). In strict mode/modules: `ReferenceError`.

### O40. `this` in `setTimeout`
```js
const o = { n: 1, f() { setTimeout(function () { console.log(this.n); }, 0); setTimeout(() => console.log(this.n), 0); } };
o.f();
```
**Answer:** `undefined` (or the global's `n`) for the regular function, then `1` for the arrow function.

### O41. Event-loop mix
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
(async () => { console.log('C'); await Promise.resolve(); console.log('D'); })();
Promise.resolve().then(() => console.log('E'));
queueMicrotask(() => console.log('F'));
console.log('G');
```
**Answer:** `A C G D E F B`. Sync: A, C, G. Microtasks in order of scheduling: D (await continuation), E, F. Then timer B.

### O42. `Object.keys` order
```js
console.log(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }));
```
**Answer:** `['1', '2', 'b', 'a']`.

### O43. Getter with spread
```js
const o = { get x() { return Math.random(); } };
const c = { ...o };
console.log(c.x === c.x, o.x === o.x);
```
**Answer:** `true false`. Spread **reads** the getter once and stores a plain value.

### O44. Closure in `setTimeout` with different delays
```js
for (let i = 1; i <= 3; i++) setTimeout(() => console.log(i), 1000 - i * 100);
```
**Answer:** `3 2 1` (delays 700, 800, 900 ms: the smaller delay fires first).

### O45. Hoisting of function expressions
```js
console.log(typeof hello, typeof world);
function hello() {}
var world = function () {};
```
**Answer:** `function undefined`.

---

# ✅ Part 15: MCQs

1. Which keyword is block scoped and can be re-assigned? → **`let`**
2. What does `typeof null` return? → **`'object'`**
3. Which is NOT a primitive? → **`object`** (arrays and functions are objects)
4. What does `[1,2,3].map(x => x * 2)` return? → **A new array `[2,4,6]`**
5. Which method mutates the array? → **`splice`**
6. `Array.isArray([])`? → **`true`**
7. Which value is truthy? → **`'0'`** (also `[]`, `{}`)
8. `null == undefined`? → **`true`**
9. `NaN === NaN`? → **`false`**
10. Which operator checks both type and value? → **`===`**
11. What does `Promise.all` do if one promise rejects? → **Rejects immediately**
12. Which returns the first fulfilled promise? → **`Promise.any`**
13. Which queue runs first after the stack is empty? → **Microtask queue**
14. `setTimeout(fn, 0)` runs... → **After the current stack and all microtasks**
15. Which function has no own `this`? → **Arrow function**
16. Which is hoisted with its value? → **Function declaration**
17. What is the TDZ? → **The time between scope start and a `let/const` declaration**
18. What does `bind` return? → **A new function**
19. `call` vs `apply`: apply takes... → **An array of arguments**
20. What is a closure? → **A function with access to its outer lexical scope**
21. What does `Object.freeze` do? → **Makes an object shallowly immutable**
22. Which creates a deep clone? → **`structuredClone`**
23. Which is NOT iterable by default? → **A plain object**
24. Which loop gives indexes of keys (including inherited)? → **`for...in`**
25. What does `[...new Set([1,1,2])]` give? → **`[1, 2]`**
26. Which data structure accepts any type as a key? → **`Map`**
27. What does `async` always return? → **A Promise**
28. Does `fetch` reject on HTTP 404? → **No**
29. What cancels a fetch? → **`AbortController`**
30. Which is the module syntax in the browser? → **`<script type="module">`**
31. Which does `Math.max()` return with no args? → **`-Infinity`**
32. Which converts a string to a number? → **`Number('5')`** (also `+'5'`)
33. What does `parseInt('08')` return? → **`8`**
34. Which array method sorts without mutating (ES2023)? → **`toSorted`**
35. What does `0.1 + 0.2` equal? → **`0.30000000000000004`**
36. What is `??` for? → **Defaults only for `null`/`undefined`**
37. What is `?.` for? → **Safe property access**
38. Which event phase happens first? → **Capturing**
39. Which method stops bubbling? → **`stopPropagation()`**
40. Which stops the default browser action? → **`preventDefault()`**
41. Which storage is cleared when the tab closes? → **`sessionStorage`**
42. Is `localStorage` synchronous? → **Yes**
43. What does `Object.hasOwn(o, 'x')` check? → **Own property `x`**
44. Which loop can use `await` correctly in order? → **`for...of`**
45. Which statement is true about `const arr = []; arr.push(1)`? → **Allowed (mutation, not re-assignment)**
46. Which is the global object everywhere? → **`globalThis`**
47. Which keyword makes a generator function? → **`function*`**
48. What does `yield` do? → **Pauses the generator and returns a value**
49. What is a Symbol used for? → **Unique property keys**
50. What is `WeakMap` key type? → **Objects (and non-registered symbols)**
51. Which handles errors in async/await? → **`try/catch`**
52. What is event delegation? → **One listener on a parent handling child events**
53. What is memoization? → **Caching function results**
54. What is currying? → **Turning `f(a,b)` into `f(a)(b)`**
55. Which is a pure function? → **Same input → same output, no side effects**
56. Which prevents prototype pollution? → **Blocking `__proto__`/`constructor` keys, using `Map`, `Object.create(null)`**
57. What is hoisting? → **Declarations registered before code runs**
58. What is `queueMicrotask`? → **Schedules a microtask**
59. What does `Array.prototype.at(-1)` return? → **The last element**
60. Which API renders before the next paint? → **`requestAnimationFrame`**

---

# 🧯 Part 16: Common Mistakes

> **What is this part?** These are mistakes developers make again and again in real JavaScript code. Interviewers ask: *"What is wrong with this code?"*
> **What should you do?** For each mistake, learn 4 things: **(1) the mistake, (2) why it is a problem, (3) the correct way, (4) one sentence to say in the interview.**

---

### Mistake 1: Using `var` (and global variables)
**❌ Wrong:**
```js
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i)); }   // 3 3 3
total = 10;                                                         // accidental global
```
**🤔 Why it is a problem:** `var` is function-scoped (leaks out of blocks and is shared by loop callbacks). Undeclared assignment creates a global that any code can overwrite.

**✅ Correct:**
```js
'use strict';
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));       // 0 1 2
const total = 10;
```
**💬 Say:** "I use `const` by default, `let` when needed, and strict mode or modules so accidental globals throw."

---

### Mistake 2: Using `==` and relying on coercion
**❌ Wrong:**
```js
if (value == 0) { }       // true for '', '0', [], false
if (list == false) { }
```
**🤔 Why it is a problem:** Loose equality has surprising rules, causing hidden bugs.

**✅ Correct:**
```js
if (value === 0) { }
if (list.length === 0) { }
if (value == null) { }    // the one accepted use: null OR undefined
```
**💬 Say:** "I use `===` everywhere. The only exception is `== null`."

---

### Mistake 3: Forgetting `await` or not returning the promise
**❌ Wrong:**
```js
async function save(user) {
  api.save(user);              // not awaited: errors are lost, order is wrong
  console.log('saved');        // prints before it is really saved
}
```
**🤔 Why it is a problem:** The promise runs in the background. Failures become unhandled rejections and the UI shows success too early.

**✅ Correct:**
```js
async function save(user) {
  await api.save(user);
  console.log('saved');
}
```
**💬 Say:** "I always await or return promises, and I enable `@typescript-eslint/no-floating-promises`."

---

### Mistake 4: `async` callbacks inside `forEach`
**❌ Wrong:**
```js
items.forEach(async (item) => { await send(item); });
console.log('all sent');     // runs immediately
```
**🤔 Why it is a problem:** `forEach` ignores returned promises, so nothing waits.

**✅ Correct:**
```js
await Promise.all(items.map((item) => send(item)));     // parallel
for (const item of items) await send(item);             // sequential
```
**💬 Say:** "`forEach` is not async-aware. I use `for...of` for order and `Promise.all` for parallel work."

---

### Mistake 5: Running independent awaits one after another
**❌ Wrong:**
```js
const user = await getUser();
const posts = await getPosts();     // waits for user first, though independent
```
**🤔 Why it is a problem:** Total time is the **sum** of both calls instead of the **max**.

**✅ Correct:**
```js
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```
**💬 Say:** "I start independent requests together."

---

### Mistake 6: Mutating state, arguments, and shared objects
**❌ Wrong:**
```js
function addItem(cart, item) { cart.items.push(item); return cart; }
const sorted = list.sort();           // also changes list
```
**🤔 Why it is a problem:** Hidden side effects make bugs hard to find, and frameworks (React/Redux) may not detect the change.

**✅ Correct:**
```js
const addItem = (cart, item) => ({ ...cart, items: [...cart.items, item] });
const sorted = list.toSorted((a, b) => a - b);        // or [...list].sort(...)
```
**💬 Say:** "I treat data as immutable and return new copies."

---

### Mistake 7: Sorting numbers with the default `sort()`
**❌ Wrong:**
```js
[10, 9, 1].sort();      // [1, 10, 9]
```
**🤔 Why it is a problem:** The default comparison converts items to strings.

**✅ Correct:**
```js
[10, 9, 1].sort((a, b) => a - b);        // [1, 9, 10]
```
**💬 Say:** "I always pass a comparator for non-string data."

---

### Mistake 8: Using floating-point numbers for money
**❌ Wrong:**
```js
0.1 + 0.2 === 0.3;                // false
const total = price * qty * 1.18; // rounding errors
```
**🤔 Why it is a problem:** Binary floating point cannot store most decimals exactly, so totals can be off by a paisa.

**✅ Correct:**
```js
const paise = 1999 * 3;                                  // integers in the smallest unit
new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
```
**💬 Say:** "I store money as integers and format only for display."

---

### Mistake 9: Using `||` for defaults when `0`, `''` or `false` are valid
**❌ Wrong:**
```js
const volume = settings.volume || 50;      // volume 0 becomes 50
```
**🤔 Why it is a problem:** `||` replaces every falsy value.

**✅ Correct:**
```js
const volume = settings.volume ?? 50;      // only null/undefined are replaced
```
**💬 Say:** "I use `??` for defaults."

---

### Mistake 10: Not checking `res.ok` with `fetch`
**❌ Wrong:**
```js
const data = await (await fetch('/api/user')).json();    // 500 error page -> JSON parse error
```
**🤔 Why it is a problem:** `fetch` only rejects on network failure. A 404/500 still resolves.

**✅ Correct:**
```js
const res = await fetch('/api/user');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```
**💬 Say:** "I wrap `fetch` in a helper that checks `ok`, applies a timeout and parses errors."

---

### Mistake 11: Swallowing errors (empty `catch`)
**❌ Wrong:**
```js
try { await save(); } catch (e) { }
```
**🤔 Why it is a problem:** Failures are hidden. The app continues in a broken state and nobody knows.

**✅ Correct:**
```js
try { await save(); }
catch (err) {
  report(err);                                   // log to monitoring
  throw new Error('Could not save', { cause: err });   // keep the original cause
}
```
**💬 Say:** "I handle errors at the right layer, log them with context, and never swallow them."

---

### Mistake 12: Unhandled promise rejections
**❌ Wrong:**
```js
fetchData().then(render);            // no .catch
```
**🤔 Why it is a problem:** A rejection becomes `Unhandled promise rejection` (and can crash a Node process).

**✅ Correct:**
```js
fetchData().then(render).catch(showError);
window.addEventListener('unhandledrejection', (e) => report(e.reason));
```
**💬 Say:** "Every promise chain ends with a `catch` or a `try/catch`."

---

### Mistake 13: Modifying an array while looping over it
**❌ Wrong:**
```js
for (let i = 0; i < arr.length; i++) { if (bad(arr[i])) arr.splice(i, 1); }   // skips items
```
**🤔 Why it is a problem:** Indexes shift after removal, so the next element is skipped.

**✅ Correct:**
```js
const kept = arr.filter((x) => !bad(x));
```
**💬 Say:** "I create a new array with `filter` instead of mutating while iterating."

---

### Mistake 14: Comparing objects or arrays with `===`
**❌ Wrong:**
```js
if (user === { id: 1 }) { }          // always false
if (tags === ['a']) { }              // always false
```
**🤔 Why it is a problem:** `===` compares references, not contents.

**✅ Correct:**
```js
if (user.id === 1) { }
if (tags.length === 1 && tags[0] === 'a') { }
// or a deepEqual / isEqual helper
```
**💬 Say:** "Objects are compared by reference, so I compare the fields I care about."

---

### Mistake 15: `for...in` on arrays
**❌ Wrong:**
```js
for (const i in arr) { }       // string keys, inherited props, unordered guarantee
```
**🤔 Why it is a problem:** It gives string indexes and may include inherited enumerable properties.

**✅ Correct:**
```js
for (const value of arr) { }
arr.forEach((value, i) => { });
```
**💬 Say:** "`for...of` for values, `for...in` only for plain object keys (and rarely)."

---

### Mistake 16: Leaking memory (listeners, timers, closures)
**❌ Wrong:**
```js
function mount() {
  window.addEventListener('resize', onResize);
  setInterval(poll, 1000);
}                                       // never cleaned up
```
**🤔 Why it is a problem:** Each mount adds another listener and timer. Memory and CPU grow, and old components keep running.

**✅ Correct:**
```js
function mount() {
  const ac = new AbortController();
  window.addEventListener('resize', onResize, { signal: ac.signal });
  const id = setInterval(poll, 1000);
  return () => { ac.abort(); clearInterval(id); };     // cleanup function
}
```
**💬 Say:** "Everything I start, I also stop in a cleanup function."

---

### Mistake 17: Losing `this`
**❌ Wrong:**
```js
button.addEventListener('click', obj.handle);      // this is the button, not obj
setTimeout(obj.handle, 100);                       // this is lost
```
**🤔 Why it is a problem:** `this` depends on how a function is called.

**✅ Correct:**
```js
button.addEventListener('click', () => obj.handle());
setTimeout(obj.handle.bind(obj), 100);
// or in a class: handle = () => { ... };
```
**💬 Say:** "I know the four `this` rules, and I use arrow functions or `bind` for callbacks."

---

### Mistake 18: Putting user input into `innerHTML`
**❌ Wrong:**
```js
comment.innerHTML = `<p>${userComment}</p>`;
```
**🤔 Why it is a problem:** XSS: the attacker's script runs on your page.

**✅ Correct:**
```js
const p = document.createElement('p');
p.textContent = userComment;
comment.append(p);
```
**💬 Say:** "I use `textContent` or sanitize with DOMPurify, plus a CSP."

---

### Mistake 19: Deep cloning with `JSON.parse(JSON.stringify(x))`
**❌ Wrong:**
```js
const copy = JSON.parse(JSON.stringify(state));      // loses Date, undefined, Map, Set; fails on circular
```
**🤔 Why it is a problem:** Dates become strings, `undefined` and functions disappear, `Map/Set` become `{}`.

**✅ Correct:**
```js
const copy = structuredClone(state);
```
**💬 Say:** "I use `structuredClone` (or an immutable update) instead of the JSON trick."

---

### Mistake 20: Blocking the main thread
**❌ Wrong:**
```js
const result = hugeArray.map(heavyCompute);          // 800 ms freeze
```
**🤔 Why it is a problem:** The UI freezes (bad INP), and clicks are ignored.

**✅ Correct:**
```js
const worker = new Worker('worker.js');              // move CPU work off-thread
worker.postMessage(hugeArray);
// or split into chunks and yield to the browser between them
```
**💬 Say:** "I find long tasks with the Performance panel and move or split them."

---

### Mistake 21: Race conditions in async UI
**❌ Wrong:**
```js
input.oninput = async () => { render(await search(input.value)); };   // old answers can arrive last
```
**🤔 Why it is a problem:** Slow responses to old queries overwrite the newest results.

**✅ Correct:** Debounce, abort the previous request with `AbortController`, or compare a request id before rendering (see Part 6, C28).
**💬 Say:** "I cancel or ignore stale async results."

---

### Mistake 22: Wrong date handling
**❌ Wrong:**
```js
new Date('2026-01-15').getDate();       // can show 14 in time zones behind UTC
const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);   // breaks on DST days
```
**🤔 Why it is a problem:** Date-only strings are parsed as UTC; local getters then shift. A day is not always 24 hours.

**✅ Correct:** Use UTC consistently (ISO strings), format with `Intl` and a time zone, and use a date library or Temporal for date math.
**💬 Say:** "I store UTC and convert only for display."

---

### Mistake 23: Unsafe object merge (prototype pollution)
**❌ Wrong:**
```js
function merge(a, b) { for (const k in b) a[k] = typeof b[k] === 'object' ? merge(a[k] || {}, b[k]) : b[k]; return a; }
```
**🤔 Why it is a problem:** Input like `{"__proto__": {"admin": true}}` modifies `Object.prototype`.

**✅ Correct:**
```js
const BAD = new Set(['__proto__', 'constructor', 'prototype']);
function safeMerge(a, b) {
  for (const k of Object.keys(b)) { if (BAD.has(k)) continue; /* merge ... */ }
  return a;
}
```
**💬 Say:** "I never merge untrusted objects without blocking dangerous keys."

---

### Mistake 24: Storing secrets in front-end code
**❌ Wrong:**
```js
const API_KEY = 'sk_live_123...';      // shipped to every browser
```
**🤔 Why it is a problem:** Everything in the browser is public.

**✅ Correct:** Keep secrets on the server and call your own backend; use short-lived tokens and scoped public keys.
**💬 Say:** "Front-end code is public, so secrets live on the server."

---

### Mistake 25: Mixing CommonJS and ES modules carelessly
**❌ Wrong:**
```js
// in an ESM file
const fs = require('fs');                // ReferenceError: require is not defined
// in a CJS file
import x from './x.js';                  // SyntaxError
```
**🤔 Why it is a problem:** The two systems have different loading rules.

**✅ Correct:** Choose one per package (`"type": "module"`), use `import` in ESM, `createRequire` for rare interop, and `exports` maps for dual packages.
**💬 Say:** "I standardize on ESM and handle interop explicitly."

---

### Mistake 26: `new Array(n).fill([])` and shared references
**❌ Wrong:**
```js
const grid = new Array(3).fill([]);
grid[0].push(1);        // all rows now contain 1
```
**🤔 Why it is a problem:** All slots share the same array.

**✅ Correct:**
```js
const grid = Array.from({ length: 3 }, () => []);
```
**💬 Say:** "Objects passed to `fill` are shared, so I create fresh ones with `Array.from`."

---

# 🎯 Part 17: Signals That Show You Are Really Experienced

> **What is this part?** Interviewers listen to **how** you answer. A junior gives definitions. A senior explains **how the engine behaves, trade-offs, real bugs and numbers**.
> **What should you do?** Practice the "Strong" style for every question.

### Signal 1: You explain the event loop precisely
| | Example answer |
|---|---|
| ❌ Weak | "JavaScript is single-threaded and uses callbacks." |
| ✅ Strong | "There is one call stack. Async work is handled by Web APIs, and callbacks return through queues. After each macrotask the engine drains all microtasks (promises, `await`), then may render. So a promise callback always runs before `setTimeout(..., 0)`. A long microtask chain can starve rendering, so I split heavy work or move it to a worker." |
**Prove it:** order output of a mixed timer/promise/await snippet without hesitation.

### Signal 2: You understand closures, `this` and prototypes as mechanisms
| | Example answer |
|---|---|
| ❌ Weak | "A closure is a function inside a function." |
| ✅ Strong | "A closure keeps a reference to its defining lexical environment, which is why a counter keeps private state and why large captured objects can leak memory. `this` is decided at call time by four rules plus arrow functions. Property lookup walks the prototype chain, and `class` is syntax over that." |
**Prove it:** mention `[[Environment]]`, call-site rules, `Object.create`.

### Signal 3: You write async code that is correct under failure
| | Example answer |
|---|---|
| ❌ Weak | "I use async/await." |
| ✅ Strong | "I run independent calls with `Promise.all`, use `allSettled` when partial success is fine, cancel stale requests with `AbortController`, add timeouts, retry only idempotent calls with backoff and jitter, and report unhandled rejections." |
**Prove it:** race condition in search, retry code, promise pool.

### Signal 4: You diagnose performance and memory with tools
| | Example answer |
|---|---|
| ❌ Weak | "I optimize code." |
| ✅ Strong | "I profile first. In the flame chart I found a 400 ms long task and fixed it with virtualization and a worker; INP went from 480 to 140 ms. For a leak I compare heap snapshots and check retainers for listeners, timers and detached DOM nodes." |
**Prove it:** DevTools Performance and Memory panels, numbers.

### Signal 5: You know the language details and gotchas
| | Example answer |
|---|---|
| ❌ Weak | "I avoid weird JS behavior." |
| ✅ Strong | "I know why `typeof null` is `'object'`, why `0.1 + 0.2 !== 0.3`, why default `sort` is lexical, why `map(parseInt)` fails, TDZ vs hoisting, and why `forEach` does not await. I prefer `===`, `??`, `Object.hasOwn` and `structuredClone`." |
**Prove it:** answer 5 gotchas fast with reasons.

### Signal 6: You think about security
| | Example answer |
|---|---|
| ❌ Weak | "I validate input." |
| ✅ Strong | "I use `textContent` or sanitize HTML, set CSP and Trusted Types, keep tokens in HttpOnly cookies, block `__proto__` keys in merges, avoid `eval`, review dependencies and pin lockfiles." |
**Prove it:** XSS, prototype pollution, ReDoS, supply chain.

### Signal 7: You design clean APIs and architecture
| | Example answer |
|---|---|
| ❌ Weak | "I put code in files." |
| ✅ Strong | "Feature-based folders with public module APIs, pure logic separated from I/O, options objects, consistent async contracts, typed (TypeScript/JSDoc) boundaries, dependency rules enforced by lint, and tests at the right level." |
**Prove it:** describe a module you designed and why.

### Signal 8: You lead migrations and quality
| | Example answer |
|---|---|
| ❌ Weak | "I write good code." |
| ✅ Strong | "I led a gradual JS-to-TypeScript migration with `allowJs`, codemods and a `strict` rule for new code, cut production errors by 30%, and added ESLint, CI gates and ADRs." |
**Prove it:** metrics, process, mentoring.

### 🔊 Phrases that sound senior
- "Microtasks run before the next macrotask, so..."
- "A closure keeps the environment alive, which is also the leak risk."
- "I measured first; the long task was..."
- "I cancel stale requests and ignore out-of-order responses."
- "Objects are compared by reference, so..."
- "I use `structuredClone` / immutable updates, not shared mutation."

### 🚩 Phrases that sound junior
- "JavaScript is interpreted and single-threaded, that's it." · "I use `var` because it works." · "I use `==`, it is shorter." · "`async` makes it run in another thread." · "I don't handle errors, the browser shows them." · "I copy code from the internet."

---

# ⚡ Part 18: Cheat Sheet & Last-Minute Revision

> **What is this part?** A quick page to read **1 hour before the interview**.

## 18.1 The 10 concepts you must explain without notes
1. **Execution context + hoisting + TDZ**
2. **Scope chain + closures**
3. **`this` rules** (new → explicit → implicit → default; arrow = lexical)
4. **Prototype chain + classes**
5. **Event loop** (stack → microtasks → macrotasks → render)
6. **Promises + async/await** (+ `all`, `allSettled`, `race`, `any`)
7. **Equality + coercion** (`===`, falsy list, `NaN`)
8. **Immutability + copying** (shallow vs deep, `structuredClone`)
9. **Modules** (ESM vs CJS, dynamic import, tree-shaking)
10. **Memory** (GC, leaks, cleanup)

## 18.2 Declarations at a glance
| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block | block |
| TDZ | no | yes | yes |
| Re-assign | yes | yes | no |
| Re-declare | yes | no | no |

## 18.3 Event loop order (memorize)
`sync code` → `process.nextTick` (Node) → `promise / await / queueMicrotask` → `rendering (rAF)` → `setTimeout / setInterval / events / I/O` → repeat.

## 18.4 Promise cheat
| Need | Use |
|---|---|
| All must succeed | `Promise.all` |
| Want every result, even failures | `Promise.allSettled` |
| First to finish (success or fail) | `Promise.race` |
| First success | `Promise.any` |
| Timeout | `Promise.race` + timer or `AbortSignal.timeout` |
| Cancel | `AbortController` |
| Limit concurrency | promise pool |

## 18.5 Array method chooser
| I want to... | Use |
|---|---|
| Transform each item | `map` |
| Keep some items | `filter` |
| Make one value | `reduce` |
| Find first match | `find` / `findIndex` / `findLast` |
| Check existence | `some` / `every` / `includes` |
| Sort without mutation | `toSorted` / `[...a].sort()` |
| Remove duplicates | `[...new Set(a)]` |
| Group | `Object.groupBy` / `reduce` |
| Flatten | `flat(Infinity)` / `flatMap` |
| Loop with async | `for...of` + `await`, or `Promise.all(map)` |

## 18.6 Copying and equality
- Shallow copy: `{ ...obj }`, `[...arr]`, `Object.assign`.
- Deep copy: `structuredClone(obj)`.
- Value equality for primitives: `===`. For objects: compare fields or `deepEqual`.
- `NaN` check: `Number.isNaN`. `-0` check: `Object.is`.

## 18.7 Common built-in helpers
`Object.entries/fromEntries`, `Object.hasOwn`, `Array.from`, `structuredClone`, `crypto.randomUUID`, `URL/URLSearchParams`, `Intl.NumberFormat/DateTimeFormat`, `AbortSignal.timeout`, `queueMicrotask`, `performance.now`.

## 18.8 Performance checklist
- [ ] Measure first (Performance panel, `performance.mark`)
- [ ] Avoid long tasks (>50 ms): split, worker, `scheduler.yield`
- [ ] Debounce/throttle events; passive listeners
- [ ] Virtualize long lists; lazy-load code (`import()`)
- [ ] Avoid layout thrashing; batch DOM updates
- [ ] Clean up listeners/timers; bound caches
- [ ] Keep object shapes stable; avoid `delete` and holes in hot paths

## 18.9 Security checklist
- [ ] No user input in `innerHTML`/`eval`/`new Function`
- [ ] CSP (and Trusted Types where possible)
- [ ] Tokens in HttpOnly cookies, not `localStorage`
- [ ] Block `__proto__`/`constructor` keys when merging
- [ ] Safe regex (avoid catastrophic backtracking)
- [ ] Pin dependencies (`npm ci`), audit, review new packages
- [ ] Check `event.origin` in `postMessage`

## 18.10 Debugging table (symptom → likely cause → fix)
| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot read properties of undefined` | Missing data / wrong path | `?.`, defaults, validate |
| `x is not a function` | Typo, wrong import, shadowing | Check `typeof`, import style |
| `this` is undefined | Method used as callback | Arrow function / `bind` |
| Loop prints same value | `var` closure | Use `let` |
| `await` does not wait in a loop | Used `forEach` | `for...of` / `Promise.all` |
| Old data shows up | Race condition | `AbortController` / request id |
| Memory keeps growing | Leaks | Cleanup, snapshots, WeakMap |
| `NaN` in UI | Invalid number conversion | Validate, `Number.isNaN` |
| CORS error | Server headers | Fix server / proxy |
| Works locally, not after deploy | Cache / env / build | Hashed assets, check network |

## 18.11 30-second answers
- **What is a closure?** A function plus its lexical environment; it can use outer variables after the outer function returned.
- **What is the event loop?** The mechanism that moves queued callbacks to the call stack when it is empty; microtasks run before macrotasks.
- **`var`/`let`/`const`?** Function vs block scope, TDZ, and re-assignment rules.
- **How does `this` work?** Decided by the call site: `new` > `call/apply/bind` > `obj.method()` > default; arrows use the outer `this`.
- **Prototype chain?** Objects link to a prototype; lookups walk the chain until `null`.
- **Promise vs callback?** Promises are composable, flatten nesting and have a built-in error path.
- **`==` vs `===`?** `===` has no coercion; use it by default.
- **Shallow vs deep copy?** Shallow copies top level only; deep copies everything (`structuredClone`).
- **Debounce vs throttle?** Wait for silence vs limit the rate.
- **How to prevent memory leaks?** Remove listeners, clear timers, avoid long-lived references, use WeakMap, verify with heap snapshots.

## 18.12 Last-minute checklist before the interview
- [ ] I can predict the output of event-loop snippets (timers + promises + async/await).
- [ ] I can write debounce, throttle, deepClone, curry, memoize, `bind`, and `Promise.all` from memory.
- [ ] I can explain hoisting/TDZ, closures, `this` and prototypes with small examples.
- [ ] I know 10 gotchas (`typeof null`, `NaN`, `0.1 + 0.2`, `map(parseInt)`, default `sort`, `forEach` + `await`, ...).
- [ ] I have 2 stories with numbers: a performance fix and a hard bug.
- [ ] I know the main security risks (XSS, prototype pollution, ReDoS, supply chain).
- [ ] I can explain TypeScript vs JavaScript trade-offs and how I would migrate.
