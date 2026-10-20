/*
  # `let` Keyword in JavaScript (Beginner se Expert Tak)

  `let` ES6 (ES2015) me aaya — `var` ki problems (re-declaration, leaking scope,
  silent hoisting bugs) fix karne ke liye.
  Aaj ke modern JS me default choice: `const`, aur jab value change karni ho tab
  `let`, aur `var` practically avoid kiya jaata hai.

  Note: Is file me jahan error aata hai wo line comment me rakhi hai (`// let x
  = 1; // SyntaxError`) taaki file bina crash ke run ho, test karna ho to
  comment hata ke run karo.
*/

/*
  ## 1. Basic Syntax
  `let variableName = value;`
*/
let city = "Patna";
console.log(city); // Patna

/*
  ## 2. Declare Karo, Value Baad Me Do
  Value na do to `undefined` milta hai (var jaisa).
*/
let age;
console.log(age); // undefined
age = 25;
console.log(age); // 25

/*
  ## 3. Reassign Kar Sakte Ho
  `let` ki value change ho sakti hai (const me nahi).
*/
let score = 10;
score = 20;
score = score + 5;
score += 5; // shorthand
score++;    // increment
console.log(score); // 31

/*
  Type bhi change ho sakta hai (JS dynamically typed hai) — par best practice:
  ek variable ek hi type ke liye use karo.
*/
let data = 100;
data = "ab string ban gaya";
console.log(typeof data); // string

// ## 4. Ek Line me Multiple Variables
let x = 1, y = 2, z; // z = undefined
console.log(x, y, z); // 1 2 undefined
// Best practice: ek line me ek hi variable, readability better rehti hai.

/*
  ## 5. Re-declaration Allowed Nahi (Same Scope)
  `var` me allowed tha, `let` me SyntaxError — ye feature accidental overwrite
  se bachata hai.
*/
let userName = "Ritesh";
// let userName = "Ritesh Kumar"; // SyntaxError: already declared
userName = "Ritesh Kumar";        // reassign allowed hai, re-declare nahi
console.log(userName); // Ritesh Kumar
/*

  Dhyaan: `var` aur `let` ko same naam se mix karna bhi error hai.
*/
// var userName = "x"; // SyntaxError (let se pehle declare ho chuka)

// ## 6. Block Scope
// Block = `{ }` ke andar ka code (if, for, while, ya sirf standalone block).
// `let` sirf us block ke andar access hota hai jisme declare hua.
{
  let blockVar = "main sirf block ke andar hoon";
  console.log(blockVar); // chalega
}
// console.log(blockVar); // ReferenceError: blockVar is not defined

if (true) {
  let insideIf = "if ke andar";
  var leaky = "var bahar leak hota hai";
}
console.log(leaky); // var -> bahar mil gaya
// console.log(insideIf); // let -> ReferenceError

/*
  ## 7. Function Scope Bhi Hota Hai
  Function ek block hai, to `let` function ke andar hi rehta hai.
*/
function greet() {
  let message = "Namaste";
  console.log(message);
}
greet(); // Namaste
// console.log(message); // ReferenceError

/*
  ## 8. Nested Scope aur Shadowing
  Inner block bahar ke variable ko dekh sakta hai (scope chain).
  Agar inner block me same naam ka `let` declare karo to wo bahar wale ko
  "shadow" kar deta hai — bahar wala variable untouched rehta hai.
*/
let level = "outer";
{
  console.log(level); // outer (scope chain se mila)
}
{
  let level = "inner"; // naya, alag variable
  console.log(level);  // inner
}
console.log(level); // outer (change nahi hua)
// Shadowing confusing ho sakti hai — practically avoid karo ya clear naam do.

// Illegal shadowing: `let` ke andar `var` se same naam ko shadow nahi kar sakte
// let p = 1;
// { var p = 2; } // SyntaxError (var hoist hoke bahar jaayega, conflict)

/*
  ## 9. Hoisting aur Temporal Dead Zone (TDZ)
  `let` bhi hoist hota hai, par initialize nahi hota. Block ki shuruaat se
  declaration line tak ka area **Temporal Dead Zone** kehlata hai — is zone me
  variable access karne par ReferenceError aata hai (var me silently `undefined`
  milta tha).
*/
// console.log(tdz); // ReferenceError: before initialization
let tdz = "ab theek hai";
console.log(tdz);

/*
  Proof ki `let` hoist hota hai: agar hoist na hota to inner log bahar wale
  `shadow` ko print kar deta, par TDZ error aata hai.
*/
let shadow = "outer";
{
  // console.log(shadow); // ReferenceError (inner shadow TDZ me)
  let shadow = "inner";
  console.log(shadow); // inner
}

// `typeof` bhi TDZ me safe nahi:
// typeof undeclaredLet;  // (let TDZ me) ReferenceError
// typeof neverDeclared;  // "undefined" (bilkul declare hi nahi to safe)
let afterTdz = 1;

/*
  ## 10. Global Scope me `let` — `window` Property Nahi Banta
  `var` global scope me `window`/`globalThis` ki property ban jaata hai.
  `let` nahi banta, isse global object pollute nahi hota.
*/
var globalVar = "var";
let globalLet = "let";
/*
  Browser me: window.globalVar -> "var", window.globalLet -> undefined
  Node me (module scope hone ki wajah se) dono top-level pe globalThis me nahi
  aate.
*/
console.log(typeof globalThis.globalLet); // undefined

/*
  ## 11. Loops me `let` — Sabse Famous Use Case
  `let` loop me **har iteration ke liye naya binding** banata hai.
  Isliye closures sahi value pakadte hain.
*/
const withLet = [];
for (let i = 0; i < 3; i++) {
  withLet.push(() => i);
}
console.log(withLet.map((fn) => fn())); // [0, 1, 2]

// Same code `var` ke saath — sab closures ek hi `j` share karte hain:
const withVar = [];
for (var j = 0; j < 3; j++) {
  withVar.push(() => j);
}
console.log(withVar.map((fn) => fn())); // [3, 3, 3]  <- classic bug

// Loop ke baad `let i` bahar available nahi:
// console.log(i); // ReferenceError
console.log(j); // 3 (var leak ho gaya)

// Purana tarika (var + IIFE) jo ab zaroorat nahi:
// for (var k = 0; k < 3; k++) { (function (k) { ... })(k); }

// setTimeout wala classic interview example:
for (let t = 1; t <= 3; t++) {
  setTimeout(() => console.log("let timeout:", t), 0); // 1, 2, 3
}
for (var u = 1; u <= 3; u++) {
  setTimeout(() => console.log("var timeout:", u), 0); // 4, 4, 4
}

/*
  ## 12. Closures me `let`
  `let` ka variable closure me live reference ki tarah capture hota hai.
*/
function makeCounter() {
  let count = 0; // private variable (bahar se direct access nahi)
  return function () {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter(), counter(), counter()); // 1 2 3

/*
  ## 13. `let` aur Objects/Arrays
  `let` variable ko reassign kar sakte ho, aur object ko mutate bhi.
*/
let user = { name: "Ritesh" };
user.name = "Ritesh Kumar";            // mutate
user = { name: "Naya Object" }; // reassign (const me ye error hota)
console.log(user); // { name: 'Naya Object' }

// ## 14. Destructuring ke Saath `let`
let [first, second] = [10, 20];
let { title, price } = { title: "Book", price: 299 };
console.log(first, second, title, price); // 10 20 Book 299

// Swap karna (temp variable ki zaroorat nahi):
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1

/*
  ## 15. `switch` aur `let`
  `case` ek alag block nahi hota; `case` me `let` declare karo to `{ }` lagao,
  warna same naam dusre case me re-declaration error dega.
*/
const choice = 1;
switch (choice) {
  case 1: {
    let result = "one";
    console.log(result);
    break;
  }
  case 2: {
    let result = "two"; // block ki wajah se conflict nahi
    console.log(result);
    break;
  }
}

// ## 16. `try...catch` me Block Scope
try {
  let temp = "try ke andar";
  throw new Error("boom");
} catch (err) {
  // `err` aur `let` catch block tak hi limited
  console.log(err.message); // boom
}
// console.log(temp); // ReferenceError

/*
  ## 17. Default Initialization aur Naming Best Practices
  - Declare karte hi initialize karo (`let total = 0;`).
  - Meaningful camelCase naam rakho.
  - Scope jitna chhota ho utna accha — variable use hone ki jagah ke paas
    declare karo.
  - Jo value kabhi change nahi hoti uske liye `const` use karo.
*/
let totalPrice = 0;
for (const item of [100, 200, 300]) {
  totalPrice += item;
}
console.log(totalPrice); // 600

/*
  ## 18. Common Mistakes
  1. TDZ me variable use karna (declaration se pehle).
  2. Same scope me re-declare karna.
  3. Loop ke bahar `i` use karne ki koshish.
  4. `let` ko har jagah use karna jab `const` kaafi ho.
  5. Global scope me bahut saare `let` rakhna.
  6. Ek variable ko alag-alag types ke liye reuse karna.
*/

/*
  ## 19. `var` vs `let` vs `const` — Comparison
  | Feature         | `var`             | `let`         | `const`       |
  |-----------------|-------------------|---------------|---------------|
  | Scope           | Function          | Block         | Block         |
  | Re-declare      | Allowed           | Error         | Error         |
  | Re-assign       | Allowed           | Allowed       | Error         |
  | Hoisting        | Haan, `undefined` | Haan, par TDZ | Haan, par TDZ |
  | Initialization  | Optional          | Optional      | Mandatory     |
  | Global obj prop | Haan              | Nahi          | Nahi          |
  | ES Version      | ES1               | ES6           | ES6           |
*/

/*
  ## 20. Engine ke Andar Kya Hota Hai (Advanced)
  - JS engine code run karne se pehle **creation phase** me scope scan karta
    hai: `var` ko `undefined` se initialize karta hai, `let`/`const` ko
    **uninitialized** rakhta hai (yahi TDZ hai).
  - Execution phase me jab `let x = ...;` line aati hai tab binding initialize
    hoti hai.
  - Loop me `for (let i...)` ke liye spec har iteration pe naya Lexical
    Environment banata hai (previous value copy karke), isi se per-iteration
    binding milti hai.
  - `let` ki binding Lexical Environment (Declarative Environment Record) me
    store hoti hai, `var` ki Variable Environment me.
  - Modern engines (V8) `let` ko optimize kar dete hain, performance me
    practically koi fark nahi — decision hamesha readability/safety ka hota hai.
*/

/*
  ## 21. Real-World Use Cases
  - Loop counters (`for (let i...)`).
  - Accumulators/running totals (`let sum = 0`).
  - Flags jo change hote hain (`let isLoading = true`).
  - Conditional assignment:
*/
let discountLabel;
const userAge = 70;
if (userAge >= 60) {
  discountLabel = "Senior";
} else {
  discountLabel = "Regular";
}
console.log(discountLabel); // Senior

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. `let` kya hai aur kab introduce hua?**
  A. `let` ES6 (2015) me aaya variable declare karne ka keyword hai jo
     block-scoped hota hai aur jiski value baad me change ho sakti hai.

  **Q2. `let` aur `var` me main difference kya hai?**
  A. `var` function-scoped hai, re-declare ho sakta hai, hoist hoke `undefined`
     milta hai. `let` block-scoped hai, same scope me re-declare nahi hota, aur
     TDZ ki wajah se declaration se pehle access karne par ReferenceError aata
     hai.

  **Q3. Kya `let` ki value change kar sakte hain?**
  A. Haan, reassign kar sakte hain (`score = 20`). Par same scope me dobara `let
     score` likhna SyntaxError hai.

  **Q4. `let` se declare kiya variable bina value ke kya hota hai?**
  A. `undefined`.

  **Q5. Block scope kya hota hai?**
  A. `{ }` ke andar ka area (if, for, while, standalone block). `let` us block
     ke bahar access nahi hota.

  **Q6. Is code ka output kya hoga?**
  `if (true) { let a = 5; } console.log(a);`
  A. `ReferenceError: a is not defined` — kyunki `a` sirf if block me tha.

  ### Junior Level (1–3 Years)
  **Q7. Temporal Dead Zone (TDZ) kya hai?**
  A. Block ki shuruaat se `let`/`const` declaration line tak ka zone, jisme
     variable exist karta hai par initialized nahi hota. Is zone me access karne
     par `ReferenceError: Cannot access 'x' before initialization` aata hai.

  **Q8. Kya `let` hoist hota hai?**
  A. Haan, hota hai — par `var` ki tarah `undefined` se initialize nahi hota.
     Binding block ke top par ban jaati hai lekin TDZ me rehti hai.
  Proof: inner block me `let x` ho to wo bahar ke `x` ko shadow karta hai, aur
  declaration se pehle access karne par error aata hai.

  **Q9. Output batao:**
  `for (var i=0;i<3;i++){setTimeout(()=>console.log(i),0)}` aur same code `let
  i` ke saath.
  A. `var` ke saath `3 3 3` (ek hi shared `i`, jab callbacks chalte hain tab
     loop khatam ho chuka hota hai). `let` ke saath `0 1 2` (har iteration ka
     alag `i`).

  **Q10. Kya global `let` variable `window` ki property banta hai?**
  A. Nahi. Global `var` aur function declarations banti hain, `let`/`const` nahi
     — wo global lexical environment me rehte hain. Isse global object pollution
     nahi hota.

  **Q11. Same naam ka `var` aur `let` ek scope me declare kar sakte hain?**
  A. Nahi, SyntaxError aata hai (`Identifier has already been declared`).

  **Q12. `let` aur `const` me kab kaunsa use karna chahiye?**
  A. Default `const`. Jab value reassign karni ho (counter, accumulator, flag)
     tab `let`. Isse code predictable rehta hai aur accidental reassignment se
     bachta hai.

  ### Mid Level (3–5 Years)
  **Q13. Shadowing kya hai? Legal aur illegal shadowing ka example do.**
  A. Inner scope me same naam ka variable declare karna jo outer ko chhupa deta
     hai. Legal: `let a=1; { let a=2; }`. Illegal:
  `let a=1; { var a=2; }` — kyunki `var` function scope tak hoist hoke `let a`
  se conflict karta hai (SyntaxError).

  **Q14. Loop me `let` har iteration ke liye naya binding kaise banata hai?**
  A. Spec ke mutable-copy semantic se: har iteration ke liye naya Lexical
     Environment banta hai, purani iteration ki value copy hoke naye binding me
     aati hai, phir increment expression naye binding par chalta hai. Isliye
     closures apni iteration ki value pakadte hain.

  **Q15. `typeof` TDZ me safe hai ya nahi?**
  A. Nahi. Kisi undeclared variable par `typeof` `"undefined"` deta hai, par
     `let` variable TDZ me ho to `ReferenceError` deta hai. Isliye `typeof` ko
     "always safe" bolna `let`/`const` ke saath galat hai.

  **Q16. `switch` ke `case` me `let` use karte waqt kya dhyaan rakhna chahiye?**
  A. Poora `switch` ek hi block hota hai, har `case` nahi. Do cases me same naam
     ka `let` hoga to re-declaration error. Solution: har `case` ko `{ }` me
     wrap karo.

  **Q17. Kya `let` closures ke saath private state bana sakta hai?**
  A. Haan: function ke andar `let count = 0;` aur inner function return karo —
     count bahar se directly accessible nahi hota, sirf closure se
     (module/counter pattern).

  **Q18. `let` performance ke liye `var` se slow hai kya?**
  A. Practically nahi. Modern engines dono ko optimize karte hain. TDZ check ka
     overhead negligible hai aur jahan engine prove kar sake wahan hata bhi deta
     hai. Decision readability/safety par lo.

  ### Senior Level (5–7 Years)
  **Q19. Engine level par `let` aur `var` kaise alag handle hote hain?**
  A. Creation phase me `var` Variable Environment me `undefined` se initialize
     hota hai; `let`/`const` Lexical Environment me uninitialized rehte hain
     (TDZ) aur declaration execute hone par initialize hote hain. Har block ka
     apna Lexical Environment hota hai jo outer environment se linked rehta hai
     (scope chain).

  **Q20. TDZ ka design kyun rakha gaya? Seedha `undefined` kyun nahi?**
  A. `var` ki silent `undefined` bugs chhupati thi (typo, galat order).
  TDZ use-before-define ko loud error banata hai, `const` ki semantics (kabhi do
  values nahi) consistent rakhta hai, aur future me optimizations/static
  analysis aasan hoti hai.

  **Q21. Legacy codebase me `var` ko `let`/`const` se replace karte waqt kya
  risks hain?**
  A. (1) Code agar `var` ke function-scope leak par depend kare to behavior
     badlega. (2) Hoisting par depend karne wala code TDZ error dega. (3)
     Re-declarations SyntaxError denge. (4) Loop closures ka behavior badal
     jaayega (aksar behtar). Approach: ESLint (`no-var`, `prefer-const`) +
     automated codemod (`eslint --fix`) module-by-module, tests ke saath.

  **Q22. ESLint rules jo `let` se related hain, aur team me kyun lagate hain?**
  A. `no-var` (var ban), `prefer-const` (jo kabhi reassign nahi hota use const
     banao), `no-shadow` (confusing shadowing roko), `no-use-before-define`,
     `no-loop-func` (loop me function banate waqt galti), `one-var` (style). Ye
     consistent aur bug-free codebase deta hai.

  **Q23. Loop me function banate waqt `let` vs `var` ka kaunsa bug aata hai, aur
  `let` ke bawajood kab dikkat ho sakti hai?**
  A. `var` me sab closures ek shared variable dekhte hain. `let` me
     per-iteration binding milti hai, par agar `let` variable loop ke *bahar*
     declare ho (`let n = 0; for (...) { fns.push(() => n); n++; }`) to sab
     closures wahi ek shared `n` dekhenge. Isliye jo variable closure me capture
     hona hai use loop body ke andar declare karo.

  **Q24. Module (ES modules) me top-level `let` ka scope kya hota hai?**
  A. Module scope — file ke bahar visible nahi hota jab tak `export` na karo.
     Classic script me wo global lexical environment me hota hai (sab scripts
     share karte hain, par `window` property nahi banta).
  Isliye do script tags me same naam ka top-level `let` SyntaxError dega.

  **Q25. `let` ke saath live-binding export ka behavior kya hai?**
  A. ES modules me `export let count = 0;` live binding hai — exporter `count++`
     kare to importer ko updated value dikhti hai (importer khud assign nahi kar
     sakta, read-only hota hai).

  **Q26. Production code me `let` kab avoid karna chahiye?**
  A. Jab value reassign nahi hoti (`const` use karo), jab functional style me
     `map/reduce/filter` se kaam ho sake (mutation avoid), aur jab variable ka
     scope bahut bada ho jaaye (function ko chhote functions me todo). Minimal
     mutable state = kam bugs.
*/
