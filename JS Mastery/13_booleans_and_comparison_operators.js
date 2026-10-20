/*
  # Booleans aur Comparison Operators (Beginner se Expert Tak)

  Boolean ki sirf 2 values hoti hain: `true` aur `false`. Ye decision
  lene (if/else, loops) ki buniyaad hai. Comparison operators do values
  ko compare karke hamesha ek boolean result dete hain.

  Note: Jahan error aata hai wo line comment me rakhi hai taaki file bina
  crash ke run ho, test karna ho to comment hata ke run karo.
*/

/*
  ## 1. Boolean Kya Hai
  Sirf `true` ya `false` (lowercase, quotes ke bina).
  `"true"` (quotes me) boolean nahi, string hai.
*/
const isStudent = true;
const hasLicense = false;
console.log(isStudent, hasLicense); // true false
console.log(typeof isStudent); // boolean
console.log(typeof "true"); // string (ye boolean nahi hai)

/*
  Naming tip: boolean variables ka naam `is`, `has`, `can`, `should` se
  start karo (`isLoggedIn`, `hasAccess`, `canEdit`).
*/

/*
  ## 2. Boolean Kahan Se Aata Hai
  1. Seedha `true`/`false` likhkar.
  2. Comparison operators ke result se.
  3. `Boolean(value)` function se conversion.
  4. Built-in methods se (`includes`, `startsWith`, `isNaN`, ...).
*/
const age = 20;
const isAdult = age >= 18; // comparison ka result boolean
console.log(isAdult); // true
console.log("Ritesh Kumar".includes("Kumar")); // true (method ka result)
console.log(Number.isNaN(NaN)); // true

/*
  ## 3. Comparison Operators — Ek Nazar Me
  | Operator | Naam                   | Example     | Result |
  |----------|------------------------|-------------|--------|
  | `==`     | Loose equal            | `5 == "5"`  | true   |
  | `===`    | Strict equal           | `5 === "5"` | false  |
  | `!=`     | Loose not equal        | `5 != "5"`  | false  |
  | `!==`    | Strict not equal       | `5 !== "5"` | true   |
  | `>`      | Greater than           | `7 > 5`     | true   |
  | `<`      | Less than              | `3 < 5`     | true   |
  | `>=`     | Greater than ya equal  | `5 >= 5`    | true   |
  | `<=`     | Less than ya equal     | `4 <= 3`    | false  |
*/

/*
  ## 4. Greater/Less Than (`>`, `<`, `>=`, `<=`)
*/
console.log(10 > 5); // true
console.log(10 < 5); // false
console.log(10 >= 10); // true
console.log(10 <= 9); // false

/*
  ## 5. Equality: `==` (Loose) vs `===` (Strict)
  `==` pehle dono ki type same karta hai (type coercion), phir compare.
  `===` type aur value dono compare karta hai, koi conversion nahi.
  **Hamesha `===` use karo.**
*/
console.log(5 == "5"); // true (string 5 ko number bana diya)
console.log(5 === "5"); // false (type alag: number vs string)
console.log(0 == false); // true (false -> 0)
console.log(0 === false); // false
console.log("" == 0); // true (confusing!)
console.log("" === 0); // false
console.log(1 == true); // true
console.log(2 == true); // false (true -> 1, 2 != 1)

/*
  ## 6. `!=` aur `!==`
  `!=` loose not-equal, `!==` strict not-equal (ye recommended hai).
*/
console.log(5 != "5"); // false (loose me equal maane gaye)
console.log(5 !== "5"); // true (type alag)
console.log("a" !== "b"); // true

/*
  ## 7. String Comparison
  Strings character-by-character, Unicode (dictionary jaisa) order se
  compare hoti hain. Capital letters small se pehle aate hain.
*/
console.log("apple" < "banana"); // true (a, b se pehle)
console.log("Z" < "a"); // true (Z ka code 90, a ka 97)
console.log("apple" === "Apple"); // false (case-sensitive)
console.log("apple" < "applesauce"); // true (chhota prefix pehle)

// Case ignore karke compare karna ho:
console.log("Ritesh".toLowerCase() === "ritesh"); // true

// Dhyaan: numbers string me ho to text order se compare hote hain.
console.log("10" < "9"); // true (text: "1" < "9")
console.log(10 < 9); // false (number comparison)
console.log("10" < 9); // false (string number me convert hoti hai)

/*
  ## 8. Type Coercion Comparison Me
  Jab dono taraf alag type ho to JS convert karta hai:
  - `>`/`<` me: dono number me (par dono string ho to text order).
  - `==` me: complex rules (neeche).
*/
console.log("5" > 3); // true ("5" -> 5)
console.log("abc" > 3); // false ("abc" -> NaN, NaN se sab false)
console.log(true > false); // true (1 > 0)
console.log(null >= 0); // true (null -> 0)
console.log(undefined >= 0); // false (undefined -> NaN)

/*
  ## 9. `null` aur `undefined` Ki Comparison (Famous Gotcha)
*/
console.log(null == undefined); // true (special rule)
console.log(null === undefined); // false
console.log(null == 0); // false (== me null sirf undefined ke barabar)
console.log(null >= 0); // true (>= me null number 0 ban jaata hai)
console.log(null > 0); // false
// Isliye null == 0 false par null >= 0 true — dono alag rules hain.

/*
  ## 10. `NaN` Ki Comparison
  `NaN` apne aap ke barabar bhi nahi hota. Check karne ke liye
  `Number.isNaN()` ya `Object.is()` use karo.
*/
console.log(NaN === NaN); // false
console.log(NaN == NaN); // false
console.log(NaN > 1, NaN < 1); // false false (NaN se sab false)
console.log(Number.isNaN(NaN)); // true
console.log(Object.is(NaN, NaN)); // true

/*
  ## 11. Objects/Arrays Ki Comparison (Reference Se)
  Objects value se nahi, **reference (memory address)** se compare hote
  hain. Same content ke do alag objects barabar nahi hote.
*/
const obj1 = { name: "Ritesh Kumar" };
const obj2 = { name: "Ritesh Kumar" };
const obj3 = obj1; // same reference
console.log(obj1 === obj2); // false (alag objects)
console.log(obj1 === obj3); // true (same reference)
const arr1 = [1, 2];
const arr2 = [1, 2];
console.log(arr1 === arr2); // false (alag arrays)
console.log(arr1 == arr2); // false (== me bhi reference check)

// Content compare karna ho to:
console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // true (simple)
// Bade/nested data ke liye lodash `isEqual` ya custom deep-equal.

/*
  ## 12. `Object.is()` — Sabse Strict Comparison
  `===` jaisa hai, bas 2 jagah alag: `NaN` aur `+0/-0`.
*/
console.log(Object.is(NaN, NaN)); // true (=== me false)
console.log(Object.is(0, -0)); // false (=== me true)
console.log(0 === -0); // true
console.log(Object.is("a", "a")); // true

/*
  ## 13. BigInt Aur Number Compare
  Alag type hone par bhi `<`, `>`, `==` kaam karte hain, `===` nahi.
*/
console.log(10n == 10); // true
console.log(10n === 10); // false
console.log(5n < 10); // true

/*
  ## 14. Boolean Conversion: `Boolean()` aur `!!`
  Kisi bhi value ko boolean me badalna. (Kaun si value true/false banti
  hai uski poori detail `14_truthy_and_falsy_values.js` me hai.)
*/
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean("hello")); // true
console.log(Boolean("")); // false
console.log(!!"Ritesh Kumar"); // true (double not, short tarika)
console.log(!!null); // false

/*
  ## 15. Boolean Methods Aur Properties
*/
const flag = true;
console.log(flag.toString()); // "true"
console.log(String(false)); // "false"
console.log(new Boolean(false) == false); // true
// Warning: `new Boolean(false)` object hai, aur object hamesha truthy!
console.log(typeof new Boolean(false)); // object
console.log(Boolean(new Boolean(false))); // true (gotcha, use mat karo)

/*
  ## 16. Comparison Chaining Ka Gotcha
  `1 < x < 10` JS me expected kaam nahi karta.
*/
const x = 15;
console.log(1 < x < 10); // true (galat!) (1 < 15) = true -> true < 10 = 1 < 10
console.log(x > 1 && x < 10); // false (sahi tarika, `&&` agli files me)

/*
  ## 17. Real-World Examples
*/
const userAge = 17;
const hasParentConsent = true;
console.log(userAge >= 18); // false
console.log(userAge >= 18 || hasParentConsent); // true (`||` aage aayega)

const password = "abc123";
console.log(password.length >= 8); // false (weak password)

const enteredName = "ritesh kumar";
console.log(enteredName === "Ritesh Kumar"); // false (case alag)
console.log(enteredName.toLowerCase() === "ritesh kumar"); // true

/*
  ## 18. Best Practices
  1. Hamesha `===` aur `!==` use karo (type safe, surprise nahi).
  2. `==` sirf tab jab jaan-boojh ke `x == null` (null + undefined dono
     pakadne ke liye) likhna ho.
  3. NaN ke liye `Number.isNaN()` use karo, `=== NaN` nahi.
  4. Object/array ko `===` se value compare mat karo.
  5. Alag types ko compare karne se pehle khud convert karo
     (`Number(str)`).
  6. Boolean variables ka naam `is/has/can` se rakho.
  7. `if (flag === true)` ki jagah seedha `if (flag)` likho.
*/

/*
  ## 19. Common Mistakes
  1. `=` (assignment) ko `==`/`===` (comparison) ki jagah likh dena.
  2. `5 == "5"` ke true hone par bharosa karna.
  3. `NaN === NaN` se NaN check karna.
  4. Do objects/arrays ko `===` se compare karna.
  5. `1 < x < 10` jaise chained comparison likhna.
  6. `"10" < "9"` jaisi string-number compare ko number compare samajhna.
  7. `null` aur `0` ke `==` aur `>=` ka result ek jaisa maan lena.
*/

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. Boolean kya hota hai?**
  A. Aisa data type jisme sirf do values hoti hain: `true` aur `false`.

  **Q2. `==` aur `===` me kya difference hai?**
  A. `==` loose equality hai (type coercion ke baad compare), `===`
     strict equality hai (type aur value dono same hone chahiye).

  **Q3. `5 == "5"` aur `5 === "5"` ka output?**
  A. `true` aur `false`.

  **Q4. `10 > 5`, `10 <= 9` ka output?**
  A. `true` aur `false`.

  **Q5. Comparison operators ka result kaunsa type hota hai?**
  A. Hamesha boolean (`true`/`false`).

  **Q6. `=` aur `==` me kya fark hai?**
  A. `=` assignment hai (value rakhta hai), `==`/`===` comparison hai
     (boolean result deta hai).

  ### Junior Level (1–3 Years)
  **Q7. `"apple" < "banana"` ka result aur kyun?**
  A. `true`. Strings Unicode order se character-by-character compare
     hoti hain, `a` (97) `b` (98) se chhota hai.

  **Q8. `"10" < "9"` true kyun aata hai?**
  A. Dono string hain, text order se compare hoti hain, `"1"` `"9"` se
     pehle aata hai. Number compare ke liye pehle `Number()` karo.

  **Q9. `NaN === NaN` ka result aur check kaise karein?**
  A. `false`. NaN apne aap ke barabar nahi hota. Check: `Number.isNaN(x)`
     ya `Object.is(x, NaN)`.

  **Q10. `null == undefined` aur `null === undefined`?**
  A. `true` (special rule) aur `false` (type alag).

  **Q11. `[] == []` kya deta hai?**
  A. `false`, kyunki objects reference se compare hote hain, do alag
     arrays alag memory address par hain.

  **Q12. `0 == false`, `"" == 0`, `"0" == false` ka output?**
  A. Teeno `true`, kyunki `==` type coercion karta hai (false -> 0,
     "" -> 0, "0" -> 0). Isi liye `===` recommended hai.

  ### Mid Level (3–5 Years)
  **Q13. `null >= 0` true par `null == 0` false kyun?**
  A. Relational operators (`>=`) `null` ko number 0 me convert karte
     hain (0 >= 0 true). `==` me spec ka special rule hai: `null` sirf
     `undefined` (aur `null`) ke barabar hota hai.

  **Q14. `1 < 5 < 3` ka result?**
  A. `true`. Left se right: `1 < 5` true, phir `true < 3` -> `1 < 3`
     true. Sahi tarika: `a < b && b < c`.

  **Q15. Do objects ko value se kaise compare karein?**
  A. `JSON.stringify` (simple, key order par depend), ya lodash
     `isEqual`, ya recursive deep-equal function. `===` sirf reference
     check karta hai.

  **Q16. `Object.is()` aur `===` me difference?**
  A. `Object.is(NaN, NaN)` true (=== false), aur `Object.is(0, -0)`
     false (=== true). Baaki sab same.

  **Q17. `x == null` kab useful hai?**
  A. Ek hi check me `null` aur `undefined` dono pakadta hai (aur kisi
     value ko nahi, `0`/`""` ko nahi). Linting rule `eqeqeq` me iska
     exception allow karte hain.

  **Q18. `new Boolean(false)` ka kya problem hai?**
  A. Wo object hai, aur har object truthy hota hai, to
     `if (new Boolean(false))` chal jaata hai. Primitive `false` ya
     `Boolean(x)` use karo.

  ### Senior Level (5–7+ Years)
  **Q19. `==` ka abstract equality algorithm short me batao.**
  A. Same type to `===` jaisa. `null`/`undefined` aapas me equal. Number
     aur string me string number ban jaati hai. Boolean pehle number
     ban jaata hai. Object ho aur primitive dusra ho to object
     `ToPrimitive` (`valueOf`/`toString`) se primitive banta hai.

  **Q20. `[] == ![]` true kyun aata hai?**
  A. `![]` = `false` (array truthy). Phir `[] == false`: boolean number
     ban gaya (0), `[]` ToPrimitive se `""`, `""` number me 0. Final
     `0 == 0` true.

  **Q21. Relational comparison (`<`) ka algorithm kya hai?**
  A. Dono ko ToPrimitive (hint number) se primitive banata hai. Agar
     dono string hain to lexicographic (UTF-16 code unit) compare, warna
     dono ko number me convert karke compare. `NaN` aaya to result false.

  **Q22. String comparison me locale/accents ka issue kaise handle
  karte hain?**
  A. `<`/`>` raw UTF-16 code units dekhte hain, isliye "é" > "z".
     Sahi dictionary order ke liye `a.localeCompare(b, locale)` ya
     `Intl.Collator` use karo (sorting me bhi).

  **Q23. Sorting me `arr.sort()` default comparison se numbers galat
  kyun sort hote hain?**
  A. Default sort elements ko string bana ke compare karta hai
     (`[10, 9, 1].sort()` -> `[1, 10, 9]`). Sahi: `sort((a, b) => a - b)`.

  **Q24. ESLint ke `eqeqeq` aur `no-compare-neg-zero` rules ka maksad?**
  A. `eqeqeq` coercion ke surprise rokta hai, `no-compare-neg-zero`
     `x === -0` jaise galat check rokta hai (ye `0` ke bhi true deta hai,
     `Object.is(x, -0)` use karo).

  **Q25. `Symbol`, `BigInt` ke saath comparison ke special cases?**
  A. `10n == 10` true par `10n === 10` false; `BigInt` aur `Number`
     ko `<`/`>` se mix compare kar sakte hain. Symbol ko number me
     convert nahi kar sakte, to `Symbol() < 1` TypeError deta hai.

  **Q26. Floating point comparison (`0.1 + 0.2 === 0.3`) kyun false hai
  aur kaise handle karein?**
  A. Binary floating point me 0.1/0.2 exact nahi hote, sum
     0.30000000000000004 aata hai. Fix: `Math.abs(a - b) < Number.EPSILON`
     ya integers (paise) me kaam karo ya `toFixed`/decimal library.
*/
