/*
  # `null`, `undefined`, `BigInt` aur `typeof` (Beginner se Expert Tak)

  JS me 7 primitive types hain: string, number, bigint, boolean,
  undefined, null, symbol. Baaki sab (array, function, date ...) object
  hain. Is file me 4 cheezein hain:
  1. `undefined` (value abhi set nahi hui)
  2. `null` (jaan-boojh ke "khaali" value)
  3. `BigInt` (bade integers)
  4. `typeof` (type pata karne wala operator)

  Note: Jahan error aata hai wo line comment me rakhi hai taaki file bina
  crash ke run ho, test karna ho to comment hata ke run karo.
*/

/*
  ## 1. `undefined`
  Matlab: variable declare hua par value nahi mili. JS khud ye value
  deta hai (aap ko likhni nahi padti).
*/
let userName;
console.log(userName); // undefined
console.log(typeof userName); // undefined

/*
  `undefined` kab milta hai:
  1. Declare kiya par value nahi di.
  2. Object ki aisi property jo exist nahi karti.
  3. Array ka aisa index jo exist nahi karta.
  4. Function return nahi karta (ya `return;` bina value).
  5. Function ka parameter jo call me pass nahi hua.
*/
const person = { name: "Ritesh Kumar" };
console.log(person.age); // undefined (property nahi hai)

const list = [10, 20];
console.log(list[5]); // undefined (index nahi hai)

function noReturn() {}
console.log(noReturn()); // undefined

function greet(name) {
  return name;
}
console.log(greet()); // undefined (argument nahi diya)

/*
  Best practice: `undefined` ko khud kisi variable me assign mat karo.
  "Khaali" dikhana ho to `null` use karo.
*/

/*
  ## 2. `null`
  Matlab: jaan-boojh ke set ki hui "koi value nahi / khaali" value.
  Developer khud likhta hai.
*/
let selectedUser = null;
console.log(selectedUser); // null

// Baad me value aa gayi:
selectedUser = "Ritesh Kumar";
console.log(selectedUser); // Ritesh Kumar

// Value hatani ho to wapas null:
selectedUser = null;

/*
  `null` ke use cases:
  - "Abhi koi user selected nahi" jaisi state dikhana.
  - Object reference ko clear karna (memory free hone me madad).
  - API/database me "value nahi hai" batana (`middleName: null`).
*/

/*
  ## 3. `null` vs `undefined`
  | Point          | `undefined`           | `null`                 |
  |----------------|-----------------------|------------------------|
  | Kaun set karta | JS engine             | Developer              |
  | Matlab         | Value set nahi hui    | Jaan-boojh ke khaali   |
  | `typeof`       | "undefined"           | "object" (bug!)        |
  | Number me      | NaN                   | 0                      |
  | `==`           | `null == undefined`   | true                   |
  | `===`          | `null === undefined`  | false                  |
*/
console.log(null == undefined); // true (loose equality)
console.log(null === undefined); // false (strict, type alag)
console.log(Number(undefined)); // NaN
console.log(Number(null)); // 0
console.log(null + 5); // 5 (null -> 0)
console.log(undefined + 5); // NaN

/*
  ## 4. `typeof` Operator
  Value ka type string me batata hai. Syntax: `typeof value` ya
  `typeof(value)` (dono chalte hain, `typeof` function nahi operator hai).
*/
console.log(typeof "Ritesh Kumar"); // string
console.log(typeof 25); // number
console.log(typeof 3.14); // number (int aur float dono number hain)
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined
console.log(typeof Symbol("id")); // symbol
console.log(typeof 123n); // bigint
console.log(typeof function () {}); // function
console.log(typeof { a: 1 }); // object
console.log(typeof [1, 2]); // object (array bhi object hai!)
console.log(typeof null); // object (famous bug!)

/*
  ## 5. `typeof null === "object"` Bug Kyun?
  JS ke pehle version (1995) me values type tag ke saath store hoti
  thi, object ka tag 0 tha aur `null` ka pointer bhi 0 tha, isliye
  `null` ko object samjha gaya. Backward compatibility ki wajah se aaj
  tak fix nahi hua. `null` check karne ke liye `=== null` use karo.
*/
const value = null;
console.log(value === null); // true (sahi tarika)
console.log(typeof value === "object" && value !== null); // false

/*
  ## 6. `typeof` ki Limitations Aur Sahi Check
  `typeof` array, null, date, regex sab ko "object" bata deta hai.
*/
console.log(Array.isArray([1, 2])); // true (array check)
console.log(Array.isArray({ a: 1 })); // false
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call(null)); // [object Null]
console.log(Object.prototype.toString.call(new Date())); // [object Date]
console.log(Number.isNaN(NaN)); // true (NaN check)

/*
  `typeof` ki special baat: undeclared variable par error nahi deta.
*/
console.log(typeof notDeclaredAnywhere); // undefined (error nahi aaya)
// console.log(notDeclaredAnywhere); // ReferenceError

/*
  `typeof typeof 5` hamesha "string" hota hai, kyunki typeof string
  return karta hai.
*/
console.log(typeof typeof 5); // string

/*
  ## 7. `BigInt`
  JS ka normal `number` 64-bit float hai, isliye ek limit ke baad
  integers sahi nahi rehte. `BigInt` kitne bhi bade integer exactly
  store karta hai.
*/
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(9007199254740991 + 2); // 9007199254740992 (galat! 9007199254740993)

/*
  BigInt banane ke 2 tarike:
  1. Number ke aage `n` lagao: `123n`
  2. `BigInt(value)` function
*/
const big1 = 9007199254740993n;
const big2 = BigInt("9007199254740993");
const big3 = BigInt(100);
console.log(big1, big2, big3); // 9007199254740993n 9007199254740993n 100n
console.log(typeof big1); // bigint

/*
  BigInt me operations (sirf BigInt ke saath):
*/
console.log(10n + 5n); // 15n
console.log(10n * 3n); // 30n
console.log(2n ** 64n); // 18446744073709551616n
console.log(7n / 2n); // 3n (decimal nahi, sirf integer division)
console.log(7n % 2n); // 1n

// BigInt aur Number ko mix nahi kar sakte:
// console.log(10n + 5); // TypeError: Cannot mix BigInt and other types
console.log(10n + BigInt(5)); // 15n (convert karke)
console.log(Number(10n) + 5); // 15 (BigInt se Number)

/*
  Comparison me BigInt aur Number mix ho sakte hain:
*/
console.log(10n === 10); // false (type alag)
console.log(10n == 10); // true (loose equality)
console.log(5n < 10); // true
console.log(2n > 1); // true

/*
  BigInt ki limitations:
  1. Decimal nahi (`1.5n` SyntaxError, `BigInt(1.5)` RangeError).
  2. `Math` methods ke saath kaam nahi karta (`Math.sqrt(4n)` error).
  3. `JSON.stringify` BigInt par TypeError deta hai.
  4. Unary plus nahi chalta (`+1n` error).
  5. Number se thoda slow hota hai.
*/
// console.log(1.5n); // SyntaxError
// BigInt(1.5); // RangeError
// Math.sqrt(4n); // TypeError
// JSON.stringify({ id: 1n }); // TypeError: Do not know how to serialize

// JSON me bhejna ho to string bana lo:
console.log(JSON.stringify({ id: (1n).toString() })); // {"id":"1"}

/*
  BigInt kab use karein:
  - Bahut bade IDs (database/Twitter snowflake IDs).
  - Cryptography, bade factorial/fibonacci.
  - Precise money/integer calculation (paise me, 2^53 se bade).
*/

/*
  ## 8. Falsy Behavior (Short Note)
  `null`, `undefined` aur `0n` teeno falsy hain (detail
  `14_truthy_and_falsy_values.js` me aayegi).
*/
console.log(Boolean(null), Boolean(undefined), Boolean(0n));
// false false false
console.log(Boolean(1n)); // true

/*
  ## 9. `null`/`undefined` Safe Handling (Modern Operators)
  `??` (nullish coalescing) sirf `null`/`undefined` par default deta hai.
  `?.` (optional chaining) undefined/null par error ke bajaye `undefined`.
*/
const user = { name: "Ritesh Kumar", address: null };
console.log(user.address?.city); // undefined (error nahi aaya)
// console.log(user.address.city); // TypeError: Cannot read properties of null

console.log(user.nickname ?? "Guest"); // Guest
console.log(0 ?? 100); // 0 (0 null/undefined nahi, isliye 0 hi raha)
console.log(0 || 100); // 100 (|| falsy par default deta hai)

/*
  ## 10. Common Mistakes
  1. `typeof null` ko "null" samajhna (ye "object" deta hai).
  2. `typeof [] === "array"` likhna (array ke liye `Array.isArray`).
  3. `== null` aur `=== null` ka fark na jaanna (`== null` undefined ko
     bhi pakadta hai).
  4. BigInt aur Number ko seedha mix karna (TypeError).
  5. `1.5n` jaisa decimal BigInt banane ki koshish.
  6. `undefined` ko manually assign karna (null use karo).
  7. Bade integers (> 2^53) ko Number me rakhna.
*/

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. `undefined` kya hai?**
  A. Declare kiye hue variable ki default value jab usme value assign na
     hui ho. Ye JS engine deta hai.

  **Q2. `null` kya hai?**
  A. Developer ke dwara jaan-boojh ke set ki gayi "koi value nahi" value.

  **Q3. `typeof` ka output batao: `typeof 25`, `typeof "hi"`,
  `typeof true`.**
  A. `"number"`, `"string"`, `"boolean"`.

  **Q4. `typeof null` kya deta hai?**
  A. `"object"`. Ye JS ka purana bug hai jo backward compatibility ki
     wajah se fix nahi hua.

  **Q5. `typeof []` kya deta hai?**
  A. `"object"`. Array ko check karne ke liye `Array.isArray()` use karo.

  **Q6. `BigInt` kya hai?**
  A. Bade integers (2^53 se upar) exactly store karne ka type. Number ke
     aage `n` lagake ya `BigInt()` se banta hai, jaise `123n`.

  ### Junior Level (1–3 Years)
  **Q7. `null` aur `undefined` me difference?**
  A. `undefined` = value set nahi hui (engine), `null` = jaan-boojh ke
     khaali (developer). `typeof undefined` "undefined", `typeof null`
     "object". `null == undefined` true, `null === undefined` false.

  **Q8. `null + 5` aur `undefined + 5` ka output?**
  A. `5` aur `NaN`. `null` number me 0 ban jaata hai, `undefined` NaN.

  **Q9. `typeof` undeclared variable par error deta hai?**
  A. Nahi, `"undefined"` return karta hai. Direct access par
     ReferenceError aata hai.

  **Q10. `Number.MAX_SAFE_INTEGER` kya hai aur BigInt kyun chahiye?**
  A. 9007199254740991 (2^53 - 1), iske upar Number precision kho deta
     hai (`2^53 + 1` galat milta hai). BigInt arbitrary precision deta
     hai.

  **Q11. `10n + 5` ka output?**
  A. TypeError: Cannot mix BigInt and other types. Convert karna padega:
     `10n + BigInt(5)` ya `Number(10n) + 5`.

  **Q12. `10n == 10` aur `10n === 10`?**
  A. `true` aur `false`. Loose equality type convert karti hai, strict
     me type alag (bigint vs number) hai.

  ### Mid Level (3–5 Years)
  **Q13. Value sahi `null` hai ya nahi, kaise check karein?**
  A. `value === null`. `typeof value === "object"` bharosemand nahi hai
     kyunki array/object bhi "object" dete hain.

  **Q14. `== null` ka kya fayda hai?**
  A. `x == null` dono `null` aur `undefined` ko pakadta hai (aur kisi ko
     nahi). Ek hi check me "value missing hai" dekhne ka short tarika.

  **Q15. `??` aur `||` me difference?**
  A. `??` sirf `null`/`undefined` par default deta hai, `||` har falsy
     (`0`, `""`, `false`) par. `0 ?? 100` = 0, `0 || 100` = 100.

  **Q16. Optional chaining `?.` kya karta hai?**
  A. Agar left side `null`/`undefined` ho to error ki jagah `undefined`
     return karta hai: `user.address?.city`.

  **Q17. Sahi type check kaise karte hain jab `typeof` kam pad jaaye?**
  A. `Array.isArray()`, `Number.isNaN()`, `instanceof`, aur
     `Object.prototype.toString.call(x)` jo `[object Array]`,
     `[object Null]` jaisa exact tag deta hai.

  **Q18. BigInt ki limitations kya hain?**
  A. Decimal nahi, `Math.*` ke saath nahi, `JSON.stringify` TypeError
     deta hai (string me convert karke bhejo), Number ke saath mix nahi
     hota, aur thoda slow hai.

  ### Senior Level (5–7+ Years)
  **Q19. `typeof null === "object"` ka historical reason?**
  A. Pehle JS engine me value type-tag + data ke roop me thi, object ka
     tag 0 tha aur `null` NULL pointer (0x00) tha, to galti se object
     ban gaya. Fix karne se purani websites toot jaati, isliye same raha.

  **Q20. `typeof` function ke liye `"function"` kyun deta hai jabki
  function bhi object hai?**
  A. Spec me callable objects (jinme [[Call]] internal method ho) ke liye
     `"function"` special case hai. Function type nahi, ek object hai.

  **Q21. `typeof` TDZ variable par kya karta hai?**
  A. `let`/`const` TDZ me ho to `typeof` bhi ReferenceError deta hai.
     Sirf bilkul undeclared naam par safe hai.

  **Q22. BigInt JSON me kaise handle karte hain?**
  A. `JSON.stringify` unsupported hai. Custom replacer se string banao
     ya `BigInt.prototype.toJSON = function () { return this.toString(); }`.
     Receive karte waqt `BigInt(str)` se wapas convert karo.

  **Q23. Number aur BigInt me precision/performance ka trade-off?**
  A. Number hardware float hai (fast, 53-bit safe integers). BigInt
     arbitrary-length hai, memory aur CPU zyada leta hai. Jab tak 2^53 se
     upar exact integers na chahiye, Number hi use karo.

  **Q24. `BigInt.asIntN` aur `asUintN` kya karte hain?**
  A. BigInt ko fixed bit-width me wrap karte hain (signed/unsigned), jaise
     64-bit integer overflow ka behavior simulate karne ke liye
     (hashing, binary protocols).

  **Q25. API design me `null` vs `undefined` ka kya convention rakhte hain?**
  A. `undefined` = field bheja hi nahi / missing, `null` = field hai par
     value khaali (explicit). JSON me `undefined` drop ho jaata hai
     jabki `null` rehta hai, isliye contract me clearly define karo
     (aur TypeScript me `T | null` vs optional `?`).

  **Q26. `Symbol` bhi primitive hai, kaise alag hai?**
  A. Unique aur immutable identifier banata hai (`Symbol("id")` har baar
     alag), object keys ke liye use hota hai taaki naam-collision na ho.
     `typeof` `"symbol"` deta hai.
*/
