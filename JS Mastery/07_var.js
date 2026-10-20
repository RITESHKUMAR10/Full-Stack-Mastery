/*
  # `var` Keyword in JavaScript (Beginner se Expert Tak)

  `var` JavaScript ka sabse purana variable declaration keyword hai (ES1,
  1997 se). ES6 (2015) se pehle variable banane ka yehi ek tarika tha.

  Aaj modern code me `var` avoid kiya jaata hai (`let`/`const` use hote
  hain), par interview me aur purane codebases me `var` ko samajhna
  zaroori hai. Is file me `var` ke har behavior ko example ke saath
  samjhenge, taaki agle files (`let`, `const`) ka fark clear ho.

  Note: Jahan error aata hai wo line comment me rakhi hai taaki file bina
  crash ke run ho, test karna ho to comment hata ke run karo.
*/

/*
  ## 1. Basic Syntax
  `var variableName = value;`
*/
var language = "JavaScript";
console.log(language); // JavaScript

/*
  ## 2. Declare Karo, Value Baad Me Do
  Value na do to `undefined` milta hai.
*/
var year;
console.log(year); // undefined
year = 2026;
console.log(year); // 2026

/*
  ## 3. Reassign Kar Sakte Ho
  `var` ki value kabhi bhi change ho sakti hai, type bhi.
*/
var counter = 1;
counter = counter + 1;
counter++;
console.log(counter); // 3

counter = "ab string hai"; // type change (dynamic typing)
console.log(typeof counter); // string

/*
  ## 4. Multiple Variables Ek Line me
*/
var a = 1, b = 2, c; // c = undefined
console.log(a, b, c); // 1 2 undefined

/*
  ## 5. Re-declaration Allowed Hai (Risky)
  Same scope me same naam dobara `var` se declare karo to error nahi
  aata, value overwrite ho jaati hai. Bade code me accidental bug ban
  sakta hai.
*/
var userName = "Ritesh";
var userName = "Ritesh Kumar"; // koi error nahi
console.log(userName); // Ritesh Kumar

// Bina value ke re-declare karo to purani value udti nahi:
var userName;
console.log(userName); // Ritesh Kumar (value waisi hi rahi)

/*
  ## 6. Function Scope (Block Scope Nahi)
  `var` sirf function ke andar tak limited hota hai. `if`, `for`,
  `while` jaise `{ }` blocks `var` ko scope nahi dete, to wo bahar bhi
  access ho jaata hai.
*/
if (true) {
  var insideIf = "block ke andar";
}
console.log(insideIf); // block ke andar (bahar bhi mil gaya)

function showScope() {
  var local = "function ka local";
  console.log(local);
}
showScope();
// console.log(local); // ReferenceError: function ke bahar nahi milega

/*
  ## 7. Hoisting
  JS code chalane se pehle saare `var` declarations ko scope ke top par
  "hoist" kar leta hai. Sirf declaration upar jaata hai, value assignment
  apni jagah rehta hai. Isliye declaration se pehle use karne par error
  nahi aata, `undefined` milta hai.
*/
console.log(hoisted); // undefined
var hoisted = "ab value mili";
console.log(hoisted); // ab value mili

/*
  Engine isko aise dekhta hai:
    var hoisted;              // declaration upar chali gayi
    console.log(hoisted);     // undefined
    hoisted = "ab value mili";
*/

/*
  Function ke andar bhi hoisting usi function ke top tak hoti hai.
*/
function hoistInFunction() {
  console.log(inner); // undefined
  var inner = 10;
  console.log(inner); // 10
}
hoistInFunction();

/*
  Function declaration poora hoist hota hai (body ke saath), par function
  expression sirf `var` ki tarah hoist hota hai (value `undefined`).
*/
console.log(typeof declared); // function
function declared() {}

console.log(typeof expressed); // undefined
var expressed = function () {};
// expressed2(); // TypeError: expressed2 is not a function
var expressed2 = function () {};

/*
  ## 8. Loops me `var` ka Famous Bug
  `var` loop ke liye alag-alag binding nahi banata, poore loop me ek hi
  variable share hota hai. Isliye callbacks/closures sab same final
  value dekhte hain.
*/
var fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(function () { return i; });
}
console.log(fns.map(function (fn) { return fn(); })); // [ 3, 3, 3 ]
console.log(i); // 3 (loop ke baad bhi bahar mil gaya)

for (var t = 1; t <= 3; t++) {
  setTimeout(function () { console.log("var timeout:", t); }, 0);
} // 4, 4, 4

/*
  Purana fix: IIFE (Immediately Invoked Function Expression) se har
  iteration ko apna function scope dena.
*/
var fixed = [];
for (var k = 0; k < 3; k++) {
  (function (copy) {
    fixed.push(function () { return copy; });
  })(k);
}
console.log(fixed.map(function (fn) { return fn(); })); // [ 0, 1, 2 ]

/*
  ## 9. IIFE aur `var` (Purana Module Pattern)
  `let`/`const` aur ES modules aane se pehle global pollution rokne ke
  liye code ko IIFE me wrap karte the, taaki `var` function scope me rahe.
*/
(function () {
  var secret = "bahar se nahi dikhega";
  console.log(secret);
})();
// console.log(secret); // ReferenceError

/*
  ## 10. Global Scope me `var`
  Browser me top-level `var` global object (`window`) ki property ban
  jaata hai, jisse naam-clash aur pollution ka risk hota hai. `let` aur
  `const` aisa nahi karte.
  Browser: var x = 1; window.x -> 1
  Node.js (CommonJS file): har file apna module scope hota hai, isliye
  top-level `var` `globalThis` par nahi aata.
*/
var globalCheck = "global?";
console.log(typeof globalThis.globalCheck); // undefined (Node module scope)

/*
  ## 11. Bina Declare Kiye Assign (Implicit Global) — Galti
  `var` ke bina assign karoge to sloppy mode me automatic global ban
  jaata hai. Strict mode me ReferenceError aata hai. Hamesha declare karo.
*/
function leakGlobal() {
  leaked = "ye global ban gaya"; // var bhool gaye
}
leakGlobal();
console.log(leaked); // ye global ban gaya

/*
  ## 12. `"use strict"` aur `var`
  Strict mode me undeclared variable assign karna aur kuch `var`-related
  galtiyan error ban jaati hain. Modules aur classes me strict mode
  automatic hota hai.
*/
(function () {
  "use strict";
  // undeclared = 5; // ReferenceError in strict mode
  var fine = 5;
  console.log(fine); // 5
})();

/*
  ## 13. Shadowing
  Function ke andar same naam ka `var` bahar wale variable ko chhupa deta
  hai, bahar wala unchanged rehta hai.
*/
var level = "outer";
function shadowTest() {
  var level = "inner";
  console.log(level); // inner
}
shadowTest();
console.log(level); // outer

/*
  Block me `var` shadow nahi karta, wo bahar wale ko hi overwrite kar
  deta hai (kyunki block scope hai hi nahi).
*/
var mood = "happy";
if (true) {
  var mood = "sad"; // same variable
}
console.log(mood); // sad

/*
  ## 14. `var` aur `let` Ek Saath
  Same naam ka `var` aur `let` ek scope me nahi ho sakta.
*/
// var clash = 1;
// let clash = 2; // SyntaxError: already declared

/*
  ## 15. `var` aur `this`/Global Object Note
  Function declaration aur `var` Browser me `window` ki property ban
  jaate hain, `let`/`const` nahi. Isiliye purane scripts me ek script ka
  `var` dusre script ko overwrite kar deta tha.
*/

/*
  ## 16. Common Mistakes
  1. Block ke andar `var` rakh ke soch lena ki wo bahar nahi dikhega.
  2. Loop me `var` use karke closures/setTimeout me galat value pana.
  3. Hoisting bhool jaana: use pehle, declare baad me, `undefined` aana.
  4. Same naam ka `var` galti se dobara likh dena (silent overwrite).
  5. `var` bhool ke implicit global bana dena.
  6. Global scope me bahut saare `var` rakhna (naam-clash).
*/

/*
  ## 17. `var` ki Problems Aur ES6 ka Solution
  | Problem          | var             | Fix (ES6)          |
  |------------------|-----------------|--------------------|
  | Re-declaration   | Allowed         | let/const: error   |
  | Block scope      | No (leak)       | let/const: block   |
  | Hoisting         | undefined       | TDZ error          |
  | Loop closure     | Shared binding  | let: per-iteration |
  | Global pollution | window property | let/const: no      |
*/

/*
  ## 18. Kab `var` Use Karna Chahiye?
  Naye code me practically kabhi nahi. Sirf in cases me milega:
  - Purana (legacy) codebase maintain karna.
  - Bahut purane browsers (IE11) ke liye bina transpile kiye code.
  - Babel/TypeScript ka compiled output (ES5) — wahan `let`/`const`
    automatically `var` me convert hote hain.
  Naye code ke liye default `const`, zaroorat par `let`.
*/

/*
  ## 19. Engine ke Andar Kya Hota Hai (Advanced)
  - Har function call par ek Execution Context banta hai, jisme Variable
    Environment hoti hai. `var` yahin store hota hai.
  - Creation phase me engine saare `var` ko dhoondh ke `undefined` se
    initialize kar deta hai (yahi hoisting ka asli reason hai).
  - Execution phase me line-by-line chalte hue assignment hoti hai.
  - `var` function-level Variable Environment me jaata hai, `let`/`const`
    block-level Lexical Environment me.
  - Is wajah se `var` ko "function-scoped aur auto-initialized" kehte
    hain, jabki `let`/`const` "block-scoped aur TDZ" wale hote hain.
*/

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. `var` kya hai?**
  A. JS ka purana variable declaration keyword (ES1 se) jo function-scoped
     hota hai, re-declare aur reassign ho sakta hai.

  **Q2. `var` ko bina value ke declare karo to kya milega?**
  A. `undefined`.

  **Q3. Kya `var` se same naam dobara declare kar sakte hain?**
  A. Haan, same scope me bina error ke ho jaata hai aur value overwrite
     ho jaati hai.

  **Q4. `var` ka scope kya hota hai?**
  A. Function scope. Function ke andar declare kiya to function tak,
     function ke bahar declare kiya to global.

  **Q5. Output kya hoga?**
  `if (true) { var x = 5; } console.log(x);`
  A. `5`, kyunki `var` block-scoped nahi hota.

  **Q6. Output kya hoga?**
  `console.log(a); var a = 10;`
  A. `undefined` (hoisting), error nahi aata.

  ### Junior Level (1–3 Years)
  **Q7. Hoisting kya hai?**
  A. Code run hone se pehle JS engine `var` declarations (aur function
     declarations) ko apne scope ke top par le jaata hai. Var ki sirf
     declaration hoist hoti hai, value assignment nahi, isliye value
     `undefined` milti hai.

  **Q8. Function declaration aur function expression ki hoisting me
  kya difference hai?**
  A. Function declaration poora (body ke saath) hoist hota hai, declaration
     se pehle call kar sakte hain. `var f = function(){}` me sirf `f`
     hoist hota hai (`undefined`), pehle call karne par TypeError.

  **Q9. Output kya hoga?**
  `for (var i=0;i<3;i++){ setTimeout(()=>console.log(i),0); }`
  A. `3 3 3`, kyunki ek hi shared `i` hai aur callbacks loop khatam hone
     ke baad chalte hain.

  **Q10. Ye closure bug kaise fix karenge?**
  A. `var` ki jagah `let` (har iteration ka naya binding), ya purane
     tarike se IIFE se current value pass karke.

  **Q11. Implicit global kya hota hai?**
  A. `var`/`let`/`const` ke bina variable assign karna. Sloppy mode me wo
     global ban jaata hai, strict mode me ReferenceError aata hai.

  **Q12. `var` aur `let` me main differences?**
  A. `var`: function scope, redeclare allowed, hoist hoke `undefined`.
     `let`: block scope, redeclare error, hoist hota hai par TDZ me.

  ### Mid Level (3–5 Years)
  **Q13. Top-level `var` ka global object par kya effect hai?**
  A. Browser me `var` aur function declarations `window` ki properties
     ban jaate hain, jisse pollution aur naam-clash ka risk hota hai.
     `let`/`const` aisa nahi karte. Node module scope me ye nahi hota.

  **Q14. Shadowing `var` me kaise kaam karti hai?**
  A. Function ke andar same naam ka `var` bahar wale ko shadow karta
     hai. Par block ke andar `var` shadow nahi karta, wahi variable
     overwrite hota hai kyunki block scope hai hi nahi.

  **Q15. IIFE kya hai aur `var` ke saath kyun use hota tha?**
  A. Function bana ke turant call karna: `(function(){ ... })()`. `var`
     function-scoped hai, to IIFE private scope deta tha, global pollution
     aur closure/loop bugs rokne ke liye.

  **Q16. `var` redeclare karna kab problem banata hai?**
  A. Bade file/team code me same naam ka `var` galti se dobara likh diya
     to purani value silently overwrite ho jaati hai, koi warning nahi.

  **Q17. Strict mode `var` se related kya badalta hai?**
  A. Undeclared variable assign karna ReferenceError ban jaata hai, aur
     kai silent galtiyan error ban jaati hain. Modules me strict mode
     by default hota hai.

  **Q18. `typeof` ka hoisted `var` par result kya hoga?**
  A. Declaration se pehle `typeof v` `"undefined"` deta hai. Hoisted
     function declaration par `"function"` deta hai.

  ### Senior Level (5–7+ Years)
  **Q19. Engine level par `var` hoisting kaise hoti hai?**
  A. Creation phase me engine scope scan karke har `var` ko Variable
     Environment me `undefined` se initialize karta hai. Execution phase
     me line-by-line assignments hoti hain. Isliye assignment se pehle
     `undefined` milta hai.

  **Q20. `var` ko `let`/`const` se kab aur kaise migrate karenge?**
  A. ESLint `no-var` aur `prefer-const` ke saath automated fix, module
     by module, tests ke saath. Dhyaan rakhna: jo code `var` ki leaking
     scope ya hoisting par depend karta ho wahan behavior badal sakta
     hai, to pehle tests/refactor.

  **Q21. TDZ kya hai aur `var` me kyun nahi hota?**
  A. `var` creation phase me hi `undefined` se initialize ho jaata hai,
     isliye access safe (par confusing) hai. `let`/`const` uninitialized
     rehte hain declaration tak (TDZ), jisse use-before-define loud error
     banta hai.

  **Q22. Babel/TypeScript ES5 output me `let` kaise convert hota hai?**
  A. Transpiler `let`/`const` ko `var` me convert karta hai, aur loop
     closures ke liye extra helper function ya renamed variable banata
     hai taaki per-iteration binding ka behavior preserve ho.

  **Q23. `var` ki wajah se kaun si real-world bugs aati thi?**
  A. Loop closures (event handlers me galat index), naam-clash across
     scripts (global pollution), accidental overwrite via redeclaration,
     aur hoisting se undefined values ka silent propagation.

  **Q24. Kya `var` performance me `let` se alag hai?**
  A. Practically nahi. Modern engines dono optimize karte hain. Decision
     safety/readability par hota hai, performance par nahi.

  **Q25. Is code me bug aur fix batao:**
  `var btns = document.querySelectorAll("button");`
  `for (var i=0;i<btns.length;i++){ btns[i].onclick = () => alert(i); }`
  A. Har button `btns.length` wali final value dikhayega (shared `i`).
     Fix: `let i`, ya `forEach((btn, index) => ...)`.
*/
