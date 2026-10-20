/*
  # `const` Keyword in JavaScript (Beginner se Expert Tak)

  `const` bhi ES6 (ES2015) me aaya, `let` ke saath. Iska matlab hai
  "constant binding": ek baar value assign hone ke baad variable ko
  dobara assign nahi kar sakte.

  Modern JS me default choice `const` hai, aur sirf jab value reassign
  karni ho tab `let`.

  Note: Jahan error aata hai wo line comment me rakhi hai taaki file bina
  crash ke run ho, test karna ho to comment hata ke run karo.
*/

/*
  ## 1. Basic Syntax
  `const variableName = value;`
  Declare karte hi value dena **mandatory** hai.
*/
const country = "India";
console.log(country); // India

// const city; // SyntaxError: Missing initializer in const declaration

/*
  ## 2. Reassign Nahi Kar Sakte
  Dobara value assign karoge to runtime par TypeError aata hai.
*/
const pi = 3.14159;
// pi = 3.14; // TypeError: Assignment to constant variable.
// pi++;      // TypeError (ye bhi reassignment hai)
// pi += 1;   // TypeError
console.log(pi); // 3.14159

// Safe tarike se error check karna:
try {
  pi = 3;
} catch (err) {
  console.log(err.name + ": " + err.message);
}
/* Ye line `pi = 3;` strict/normal dono me TypeError deti hai. */

/*
  ## 3. Re-declaration Nahi Hota
  Same scope me same naam dobara declare karna SyntaxError hai.
*/
const appName = "Mastery";
// const appName = "Other"; // SyntaxError: already declared
// let appName = "x";       // SyntaxError (let/var se bhi nahi)
console.log(appName);

/*
  ## 4. Block Scope
  `let` ki tarah `const` bhi block-scoped hai: `{ }` ke andar declare
  hua to sirf wahin tak dikhega.
*/
{
  const insideBlock = "sirf block me";
  console.log(insideBlock);
}
// console.log(insideBlock); // ReferenceError

if (true) {
  const flag = true;
  console.log(flag); // true
}
// console.log(flag); // ReferenceError

/*
  ## 5. Hoisting aur Temporal Dead Zone (TDZ)
  `const` hoist hota hai par initialize nahi hota. Declaration se pehle
  access karne par ReferenceError aata hai (`let` jaisa).
*/
// console.log(early); // ReferenceError: Cannot access before initialization
const early = "ab theek hai";
console.log(early);

/*
  ## 6. Sabse Important Concept: Binding Constant Hai, Value Nahi
  `const` variable ko dobara assign hone se rokta hai. Par agar value
  object ya array hai to uske **andar ka data badal sakta hai** (mutation),
  kyunki variable sirf reference (address) rakhta hai.
*/
const user = { name: "Ritesh", age: 25 };
user.age = 26;          // allowed: property change
user.city = "Patna";    // allowed: nayi property add
delete user.name;       // allowed: property delete
console.log(user);      // { age: 26, city: 'Patna' }
// user = { name: "New" }; // TypeError: reference change nahi hota

const numbers = [1, 2, 3];
numbers.push(4);        // allowed
numbers[0] = 100;       // allowed
numbers.pop();          // allowed
console.log(numbers);   // [ 100, 2, 3 ]
// numbers = [9, 9];    // TypeError

/*
  Primitive values (number, string, boolean, null, undefined, bigint,
  symbol) immutable hoti hain, isliye unke saath const ka matlab sach me
  "value kabhi nahi badlegi" hota hai.
*/

/*
  ## 7. Object ko Truly Constant Banana: `Object.freeze()`
  `freeze` object ko shallow level par lock kar deta hai: add, delete,
  update sab band.
*/
const config = Object.freeze({ mode: "dark", version: 1 });
config.mode = "light"; // silently ignore (strict mode me TypeError)
config.extra = true;   // silently ignore
console.log(config);   // { mode: 'dark', version: 1 }
console.log(Object.isFrozen(config)); // true

/*
  Dhyaan: freeze **shallow** hai. Nested object abhi bhi badal sakta hai.
*/
const app = Object.freeze({ meta: { theme: "dark" } });
app.meta.theme = "light"; // nested object freeze nahi hua
console.log(app.meta.theme); // light

/* Deep freeze ke liye recursive function ya library use hoti hai. */
function deepFreeze(obj) {
  Object.values(obj).forEach((value) => {
    if (typeof value === "object" && value !== null) deepFreeze(value);
  });
  return Object.freeze(obj);
}
const settings = deepFreeze({ ui: { theme: "dark" } });
settings.ui.theme = "light"; // ignore hoga
console.log(settings.ui.theme); // dark

/*
  Aur options: `Object.seal()` (add/delete band, update allowed) aur
  `Object.preventExtensions()` (sirf nayi property add band).
*/

/*
  ## 8. Loops me `const`
  `for...of` aur `for...in` me har iteration me naya binding banta hai,
  isliye `const` safe aur recommended hai.
*/
for (const fruit of ["apple", "mango"]) {
  console.log(fruit); // apple, mango
}
for (const key in { a: 1, b: 2 }) {
  console.log(key); // a, b
}

/*
  Normal `for (const i = 0; i < 3; i++)` me `i++` reassignment hai, to
  TypeError aayega. Counter wale loop me `let` use karo.
*/
// for (const i = 0; i < 3; i++) {} // TypeError on first i++

/*
  ## 9. Destructuring ke Saath `const`
*/
const [first, second] = [10, 20];
const { title, price } = { title: "Book", price: 299 };
console.log(first, second, title, price); // 10 20 Book 299

/*
  ## 10. Functions aur `const`
  Function expression / arrow function ko `const` me store karna common
  hai, isse function ka naam accidentally overwrite nahi hota.
*/
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

/*
  Dhyaan: `function` declaration pura hoist hota hai (upar se call ho
  sakta hai), par `const` function expression TDZ me hota hai.
*/
// sayHi(); // ReferenceError (TDZ)
const sayHi = () => console.log("Hi");
sayHi();

/*
  ## 11. Naming Convention
  - Normal values: camelCase (`userName`, `totalPrice`).
  - True constants (hardcoded, kabhi nahi badalne wale): UPPER_SNAKE_CASE.
  - Objects/arrays/functions ke liye UPPER_CASE zaroori nahi, camelCase.
*/
const MAX_USERS = 100;
const API_URL = "https://example.com/api";
const TAX_RATE = 0.18;
console.log(MAX_USERS, API_URL, TAX_RATE);

/*
  ## 12. Real-World Use Cases
  - Configuration aur environment values.
  - Imports/requires (`const fs = require("fs")`).
  - Functions, classes, arrow functions.
  - DOM elements ke reference (`const btn = document.querySelector(...)`).
  - Koi bhi value jo reassign nahi hoti (zyadatar variables!).
*/

/*
  ## 13. Immutable Updates (Const ke Saath Best Practice)
  Original data ko mutate karne ki jagah naya copy banao (spread, map,
  filter). React/Redux me ye pattern zaroori hai.
*/
const original = { name: "Ritesh", skills: ["JS"] };
const updated = { ...original, name: "Ritesh Kumar" };        // naya object
const withSkill = { ...original, skills: [...original.skills, "Node"] };
console.log(original.name, updated.name); // Ritesh Ritesh Kumar
console.log(withSkill.skills);            // [ 'JS', 'Node' ]

const list = [1, 2, 3];
const doubled = list.map((n) => n * 2); // list untouched
const noTwo = list.filter((n) => n !== 2);
console.log(list, doubled, noTwo); // [1,2,3] [2,4,6] [1,3]

/*
  Dhyaan: spread **shallow copy** karta hai. Deep copy ke liye
  `structuredClone(obj)` use karo (modern JS).
*/
const deep = structuredClone({ a: { b: 1 } });
console.log(deep); // { a: { b: 1 } }

/*
  ## 14. Common Mistakes
  1. Soch lena ki const object/array ko immutable bana deta hai.
  2. Declare karte waqt value na dena (`const x;`).
  3. Counter loop me `const i` use karna.
  4. TDZ me use karna (declaration se pehle).
  5. Un-needed `let` use karna jahan `const` kaafi hai.
  6. Global scope me bahut saare const likhna.
*/

/*
  ## 15. `var` vs `let` vs `const` — Comparison
  | Feature        | `var`     | `let`     | `const`   |
  |----------------|-----------|-----------|-----------|
  | Scope          | Function  | Block     | Block     |
  | Re-declare     | Allowed   | Error     | Error     |
  | Re-assign      | Allowed   | Allowed   | Error     |
  | Initialization | Optional  | Optional  | Mandatory |
  | Hoisting       | undefined | TDZ       | TDZ       |
  | Use today      | Avoid     | If needed | Default   |
*/

/*
  ## 16. Engine / Advanced Notes
  - `const` ka binding Lexical Environment me immutable binding ke roop
    me store hota hai; assignment par engine TypeError throw karta hai.
  - Immutable binding hone se engines optimization hints le sakte hain,
    par performance difference practically negligible hai.
  - `const` compile-time par nahi, runtime par error deta hai (reassign
    wali line chalne par), par linters (ESLint `no-const-assign`) pehle
    hi pakad lete hain.
  - ES modules: `export const x = 1;` live binding hai, importer ise
    reassign nahi kar sakta (read-only).
  - `const` aur `Object.freeze` alag cheezein hain: const = binding lock,
    freeze = object ka data lock.
*/

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. `const` kya hai?**
  A. ES6 ka keyword jo block-scoped constant binding banata hai. Ek baar
     value assign hone ke baad variable ko reassign nahi kar sakte.

  **Q2. Kya `const` declare karte waqt value dena zaroori hai?**
  A. Haan. `const x;` SyntaxError deta hai (Missing initializer in const
     declaration).

  **Q3. `const` variable ko reassign karne par kya hota hai?**
  A. `TypeError: Assignment to constant variable.`

  **Q4. `let` aur `const` me kya difference hai?**
  A. Dono block-scoped hain aur TDZ me aate hain. `let` reassign hota hai
     aur bina value ke declare ho sakta hai, `const` reassign nahi hota
     aur initial value mandatory hai.

  **Q5. Kya `const` ko dobara declare kar sakte hain?**
  A. Nahi, same scope me SyntaxError aata hai.

  **Q6. Output kya hoga?**
  `const a = 10; a = 20; console.log(a);`
  A. `TypeError: Assignment to constant variable.`

  ### Junior Level (1–3 Years)
  **Q7. Kya `const` object ke andar ki value change kar sakte hain?**
  A. Haan. `const` sirf reference ko lock karta hai, object ka content
     mutable rehta hai: `const o = {a:1}; o.a = 2;` chalega, par
     `o = {}` TypeError dega.

  **Q8. `const` array me `push()` kyun chal jaata hai?**
  A. Kyunki `push` array ko mutate karta hai, variable ko reassign nahi
     karta. Variable ka reference wahi rehta hai.

  **Q9. Object ko truly immutable kaise banate hain?**
  A. `Object.freeze(obj)` se. Ye shallow hai, nested objects ke liye
     deep freeze (recursive) ya library chahiye.

  **Q10. `for (const i = 0; i < 3; i++)` kya karega?**
  A. Pehli `i++` par TypeError, kyunki `i++` reassignment hai. Counter
     loop me `let`, aur `for...of`/`for...in` me `const` use karo.

  **Q11. `for (const x of arr)` kaise kaam karta hai bina error ke?**
  A. Har iteration me naya block scope aur naya `const` binding banta hai,
     purana reassign nahi hota.

  **Q12. Kab `const` aur kab `let` use karna chahiye?**
  A. Default `const`. Jab value ko reassign karna ho (counter, running
     total, flag) tab `let`. `var` avoid karo.

  ### Mid Level (3–5 Years)
  **Q13. `const` TDZ me kaise behave karta hai?**
  A. Hoist hota hai par initialize nahi hota. Declaration se pehle access
     par `ReferenceError: Cannot access 'x' before initialization`.

  **Q14. `const` aur `Object.freeze` me kya fark hai?**
  A. `const` variable binding ko lock karta hai. `Object.freeze` object
     ke data ko lock karta hai (shallow). Dono ko saath use karne se
     reassign aur mutation dono band ho jaate hain.

  **Q15. `Object.freeze`, `seal` aur `preventExtensions` me difference?**
  A. `freeze`: add/delete/update teeno band. `seal`: add/delete band,
     existing property update allowed. `preventExtensions`: sirf nayi
     property add band.

  **Q16. Immutable update kaise karte hain const object par?**
  A. Spread/map/filter se naya copy banao: `const next = {...old, a: 2}`,
     `const arr2 = [...arr, 4]`. React state updates me yahi pattern hai.

  **Q17. Spread operator deep copy karta hai ya shallow?**
  A. Shallow. Nested objects ka reference share hota hai. Deep copy ke
     liye `structuredClone()` (ya JSON trick / lodash `cloneDeep`).

  **Q18. Function ko `const` se declare karne aur `function` declaration
  me kya difference hai?**
  A. `function` declaration pura hoist hota hai, declaration se pehle bhi
     call ho sakta hai. `const fn = () => {}` TDZ me hota hai, pehle call
     karne par ReferenceError. `const` me accidental reassignment bhi
     nahi hota.

  ### Senior Level (5–7+ Years)
  **Q19. `const` runtime error deta hai ya compile time?**
  A. Syntax errors (jaise missing initializer, re-declaration) parse time
     par aate hain. Reassignment ka TypeError runtime par us line ke
     chalne par aata hai. ESLint `no-const-assign` ise pehle pakad leta
     hai.

  **Q20. Engine level par `const` kaise implement hota hai?**
  A. Lexical Environment ke Declarative Environment Record me immutable
     binding (`CreateImmutableBinding`) banti hai. Initialization se
     pehle TDZ me rehti hai, uske baad `SetMutableBinding` par TypeError.

  **Q21. Kya `const` performance me `let`/`var` se tez hai?**
  A. Practically koi measurable fark nahi. Engines `const` ko optimization
     hint ki tarah use kar sakte hain, par decision readability aur
     safety par lo. Real fark code predictability me aata hai.

  **Q22. Large codebase me `const` ke liye ESLint rules?**
  A. `prefer-const` (jo reassign nahi hota use const banao), `no-var`,
     `no-const-assign` (reassign error pehle pakde), `no-shadow`,
     `no-param-reassign` (function params mutate/reassign na ho).

  **Q23. ES modules me `export const` ka behavior kya hai?**
  A. Live binding hai par importer ke liye read-only. Importer
     `import { x }; x = 5;` karega to TypeError aayega. Exporter agar
     `let` use kare aur update kare to importer ko updated value dikhti
     hai.

  **Q24. Deep immutability enterprise code me kaise enforce karte hain?**
  A. Options: `Object.freeze` recursive (dev mode me), Immer library
     (structural sharing ke saath immutable updates), Immutable.js,
     TypeScript `readonly` / `as const` / `Readonly<T>` (compile-time
     guarantee), aur code review/lint rules.

  **Q25. TypeScript ka `as const` kya karta hai?**
  A. Literal types ko narrow aur readonly banata hai:
     `const dirs = ["up","down"] as const;` type `readonly ["up","down"]`
     ban jaata hai. Ye compile-time check hai, runtime freeze nahi.

  **Q26. Closure me `const` capture hone ka kya fayda?**
  A. Captured `const` binding badal nahi sakti, isliye closure ke andar
     state ke unexpected change ka risk kam hota hai. Mutable state
     chahiye to `let` ya object use karo, par jaan-boojh ke.

  **Q27. Shared mutable state `const` object me kyun risky hai aur
  kaise bachein?**
  A. Reference share hone se ek jagah ka mutation sab jagah dikhta hai
     (side effects, hard-to-trace bugs). Bachne ke liye pure functions,
     copy-on-write (spread/structuredClone), freeze ya Immer use karo.
*/
