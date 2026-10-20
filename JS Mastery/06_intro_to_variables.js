/*
  # Intro to Variables (Declare, Naming Rules, Conventions)

  Variable ek **named container/box** hota hai jisme hum data (value)
  store karte hain, taaki use baad me use ya change kar sakein.

  Real-life analogy: ek box jispe label (naam) laga ho, aur usme koi
  cheez (value) rakhi ho. Label = variable ka naam, cheez = value.

  Is file me basics aur naming rules hain. `var`, `let`, `const` ki
  detail alag files me hai (`07_var.js`, `08_let.js`, `09_const.js`).
*/

/*
  ## 1. Variable Declare Karna (Intro `var` ke Saath)
  JS me variable 3 keywords se bante hain: `var`, `let`, `const`.
  `var` sabse purana (ES1, 1997) hai, `let`/`const` ES6 (2015) se aaye.
  Syntax: `var variableName = value;`
*/
var name = "Ritesh Kumar";
console.log(name); // Ritesh Kumar

/*
  ## 2. Declare vs Initialize vs Assign
  - Declare: variable banana (`var age;`)
  - Initialize: pehli baar value dena (`age = 25;`)
  - Reassign: baad me value badalna (`age = 26;`)
*/
var age;
console.log(age); // undefined (value nahi di to default `undefined`)
age = 25;         // initialize
age = 26;         // reassign
console.log(age); // 26

/*
  ## 3. Variable me Kya Store Ho Sakta Hai?
  Kisi bhi type ki value: string, number, boolean, null, undefined,
  object, array, function. JS dynamically typed hai, type value se
  decide hota hai, variable pe fix nahi hota.
*/
var text = "Hello";
var count = 10;
var isStudent = true;
var skills = ["HTML", "CSS", "JS"];
var person = { name: "Ritesh Kumar", city: "Patna" };
console.log(text, count, isStudent, skills, person);
console.log(typeof text, typeof count, typeof isStudent);
// string number boolean

/*
  ## 4. Value Change Karna (Reassign)
*/
var score = 10;
score = 20;
console.log(score); // 20

/*
  ## 5. Ek Line me Multiple Variables
  Comma se alag karke declare kar sakte ho. Readability ke liye ek line
  me ek hi variable rakhna better practice hai.
*/
var a = 1, b = 2, c = 3;
console.log(a, b, c); // 1 2 3

/*
  ## 6. Ek Variable se Dusre me Value Copy
  Primitive value ki copy banti hai, dono alag ho jaate hain.
*/
var original = 5;
var copy = original;
copy = 99;
console.log(original, copy); // 5 99

/*
  ## 7. Naming Rules (Zaroori, Warna Error)
  1. Letters (a-z, A-Z), digits (0-9), underscore `_` aur dollar `$` hi
     allowed hain.
  2. Digit se start nahi ho sakta.
  3. Space aur special characters (`-`, `@`, `#` etc.) allowed nahi.
  4. Case-sensitive hai (`age` aur `Age` alag hain).
  5. Reserved keywords (`var`, `let`, `if`, `class`, `return` ...) naam
     nahi ban sakte.
*/
var myName = "x";   // letters
var score2 = 90;    // letters + number
var _hidden = 1;    // underscore se start
var $price = 500;   // dollar se start
// var 1name = "x"; // SyntaxError: number se start
// var my name = 1; // SyntaxError: space
// var my-name = 1; // SyntaxError: hyphen allowed nahi
// var let = 5;     // SyntaxError: reserved keyword
var name1 = "x";    // number beech/end me chalta hai

var userAge = 25;
var UserAge = 30;
console.log(userAge, UserAge); // 25 30 (case-sensitive, alag variables)

/*
  ## 8. Naming Conventions (Rule Nahi, Industry Standard)
  | Convention       | Example       | Kahan Use Hota Hai         |
  |------------------|---------------|----------------------------|
  | camelCase        | `firstName`   | Variables/functions        |
  | PascalCase       | `UserAccount` | Classes/constructors       |
  | snake_case       | `first_name`  | JS me kam, Python me zyada |
  | UPPER_SNAKE_CASE | `MAX_LIMIT`   | Constants (kabhi na badle) |
*/
var firstName = "Ritesh Kumar";   // camelCase
class UserAccount {}        // PascalCase
const MAX_LIMIT = 100;      // UPPER_SNAKE_CASE
console.log(firstName, typeof UserAccount, MAX_LIMIT);

/*
  ## 9. Meaningful Naming — Best Practice
  Naam se hi pata chalna chahiye variable kya represent karta hai.
  Boolean variables ka naam `is`/`has`/`can` se start karo.
*/
var d = 10;                 // Bad: d kya hai?
var discountPercent = 10;   // Good
var isLoggedIn = true;      // Good (boolean)
var hasPermission = false;  // Good (boolean)
console.log(d, discountPercent, isLoggedIn, hasPermission);

/*
  ## 10. Quick Validity Checklist
  | Naam       | Valid? | Reason                   |
  |------------|--------|--------------------------|
  | `userName` | Yes    | Letters only, camelCase  |
  | `_id`      | Yes    | Underscore se start      |
  | `$total`   | Yes    | Dollar se start          |
  | `User_1`   | Yes    | Letters + _ + number     |
  | `2ndPlace` | No     | Number se start          |
  | `my name`  | No     | Space hai                |
  | `my-name`  | No     | Hyphen allowed nahi      |
  | `let`      | No     | Reserved keyword         |
*/

/*
  ## 11. Common Mistakes
  1. Number se naam start karna (`1name`).
  2. Case galat likhna (`Age` likha, `age` chahiye tha) -> ReferenceError.
  3. Reserved keyword naam banana.
  4. Meaningless naam (`x`, `temp1`, `data2`).
  5. Variable declare kiye bina use karna.
*/

/*
  ## 12. Aage Kya? (Roadmap)
  - `07_var.js`: `var` ki poori detail (scope, hoisting, redeclaration).
  - `08_let.js`: `let` (block scope, TDZ).
  - `09_const.js`: `const` (constant binding, object mutation).
*/

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. Variable kya hota hai?**
  A. Named container jisme data store hota hai taaki baad me use ya
     change kar sakein.

  **Q2. JS me variable declare karne ke kitne tarike hain?**
  A. Teen: `var` (purana), `let` aur `const` (ES6).

  **Q3. Declare, initialize aur assign me kya difference hai?**
  A. Declare: variable banana (`let a;`). Initialize: pehli value dena.
     Assign: baad me value badalna.

  **Q4. Bina value diye variable declare karo to kya milta hai?**
  A. `undefined`.

  **Q5. Variable naming ke rules kya hain?**
  A. Letters, digits, `_`, `$`; digit se start nahi; space/special
     character nahi; case-sensitive; reserved keywords nahi.

  **Q6. Kya `2ndPlace` valid variable naam hai?**
  A. Nahi, digit se start nahi ho sakta, SyntaxError aata hai.

  ### Junior Level (1–3 Years)
  **Q7. JS ko dynamically typed kyun kehte hain?**
  A. Variable ka type declare nahi karna padta, value ke hisaab se
     runtime par decide hota hai aur ek variable me alag-alag type ki
     value aa sakti hai.

  **Q8. Case-sensitivity ka kya matlab hai?**
  A. `age`, `Age`, `AGE` teeno alag variables hain. Spelling/case
     galat hone par ReferenceError aata hai.

  **Q9. Naming conventions kaunse hain aur kab use hote hain?**
  A. camelCase variables/functions ke liye, PascalCase classes ke liye,
     UPPER_SNAKE_CASE constants ke liye, snake_case JS me kam common.

  **Q10. `$` aur `_` ko variable name me kyun allow kiya gaya hai?**
  A. `$` libraries me convention hai (jQuery), `_` private/internal
     variable ka indication dene ke liye (sirf convention).

  **Q11. Primitive variable copy karne par kya hota hai?**
  A. Value ki independent copy banti hai. Ek badalne se dusra nahi
     badalta (objects me reference copy hota hai).

  ### Mid Level (3–5 Years)
  **Q12. Meaningful naming kyun zaroori hai?**
  A. Code self-explanatory banta hai, comments kam lagte hain, team ko
     samajhna aur maintain karna aasan hota hai, bugs kam hote hain.

  **Q13. Kya unicode/non-English letters variable naam me chalte hain?**
  A. Haan, valid identifier characters (jaise `const नाम = 1;`) chalte
     hain, par practice me English, ASCII naam use karte hain.

  **Q14. Reserved words variable naam kyun nahi ban sakte?**
  A. JS khud unhe syntax ke liye use karta hai (`let`, `class`,
     `return`), isliye naam banane par parser confuse hota hai aur
     SyntaxError aata hai.

  **Q15. `var`, `let`, `const` me high-level difference kya hai?**
  A. `var` function-scoped, redeclare/reassign allowed. `let`
     block-scoped, reassign allowed, redeclare nahi. `const` block-scoped,
     na reassign na redeclare. Detail `07`, `08`, `09` files me.

  ### Senior Level (5–7+ Years)
  **Q16. Team me naming convention inconsistency se kya problem aati hai?**
  A. Code review slow hota hai, cognitive load badhta hai, ESLint rules
     enforce karna mushkil hota hai. Isliye teams style guide (Airbnb,
     Google) aur lint rules lock karti hain.

  **Q17. Boolean variables ke liye naming pattern kya rakhte hain?**
  A. `is`/`has`/`can`/`should` prefix (`isLoggedIn`, `hasAccess`), taaki
     condition padhne me natural lage (`if (isLoggedIn)`).

  **Q18. Naam rakhne me scope aur length ka kya relation hai?**
  A. Chhote scope (loop counter) me chhota naam (`i`) theek hai. Bade
     scope/exported cheezon me descriptive naam rakho, kyunki wo door
     tak padhi jaati hain.

  **Q19. Minification ka variable names par kya effect hota hai?**
  A. Production build me tools (Terser) local variable names ko chhote
     (`a`, `b`) kar dete hain, to descriptive naam source code ki
     readability ke liye hain, bundle size ke liye nahi.

  **Q20. Legacy code me bad naming (`x`, `tmp`) mile to kya karoge?**
  A. Tests pehle likhoge, phir IDE ke rename-refactor (safe rename) se
     step-by-step meaningful naam doge, aur lint rule se naye code me
     convention enforce karoge.
*/




 