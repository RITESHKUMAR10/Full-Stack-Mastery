/*
  # Template Strings (Template Literals) in JavaScript

  Template string ES6 (2015) me aayi. Normal quotes (`"` ya `'`) ki
  jagah **backticks** (`` ` ``) se banti hai, aur isme variable/expression
  seedha string ke andar daal sakte hain.

  Backtick key keyboard me `1` ke bagal (Esc ke neeche) hoti hai.

  Note: Jahan error aata hai wo line comment me rakhi hai taaki file bina
  crash ke run ho, test karna ho to comment hata ke run karo.
*/

/*
  ## 1. Purana Tarika (Concatenation) Vs Naya Tarika
  Pehle `+` se strings jodte the, jo lambi string me messy ho jaata hai.
*/
const firstName = "Ritesh";
const lastName = "Kumar";
const age = 25;

// Purana: quotes aur + ka jhanjhat, space bhoolne ka darr
const oldWay = "Mera naam " + firstName + " " + lastName + " hai, umar " + age;
console.log(oldWay);

// Naya: template string, saaf aur readable
const newWay = `Mera naam ${firstName} ${lastName} hai, umar ${age}`;
console.log(newWay);

/*
  ## 2. Basic Syntax
  Backticks me likho, aur variable/expression `${ ... }` ke andar.
*/
const plain = `Ye ek template string hai`;
console.log(plain);
console.log(typeof plain); // string (result normal string hi hai)

/*
  ## 3. Interpolation `${expression}`
  `${}` ke andar **koi bhi valid JS expression** likh sakte ho, sirf
  variable nahi.
*/
const price = 500;
const qty = 3;

console.log(`Total: ${price * qty}`); // Total: 1500 (calculation)
console.log(`Discount: ${price > 400 ? "Haan" : "Nahi"}`); // ternary
console.log(`Naam capital: ${firstName.toUpperCase()}`); // method call
console.log(`Max: ${Math.max(10, 20, 30)}`); // function call
console.log(`2 + 2 = ${2 + 2}`); // expression

// Array/Object bhi, par string me convert ho jaate hain:
console.log(`Skills: ${["HTML", "CSS", "JS"]}`); // Skills: HTML,CSS,JS
console.log(`Obj: ${{ a: 1 }}`); // Obj: [object Object] (gotcha!)

// Object properly dikhana ho to JSON.stringify:
console.log(`Obj: ${JSON.stringify({ name: "Ritesh Kumar" })}`);

/*
  ## 4. Multi-line Strings
  Normal quotes me new line ke liye `\n` likhna padta hai. Template
  string me direct Enter dabao, line break jaisa ka waisa aata hai.
*/
const oldMulti = "Line 1\nLine 2\nLine 3";
const newMulti = `Line 1
Line 2
Line 3`;
console.log(oldMulti);
console.log(newMulti); // dono ka output same

// Dhyaan: indentation bhi string ka hissa ban jaata hai.
const indented = `
    Ye line 4 spaces ke saath hai
`;
console.log(indented.length); // spaces aur newlines bhi count hue

/*
  ## 5. Quotes ka Jhanjhat Khatam
  Template string ke andar `"` aur `'` bina escape ke likh sakte ho.
*/
console.log(`Usne kaha "Hello" aur main bola 'Hi'`);
// Normal string me escape karna padta:
console.log("Usne kaha \"Hello\" aur main bola 'Hi'");

// Backtick likhna ho to escape karo:
console.log(`Backtick ko \` aise likhte hain`);
// `${` literal likhna ho to:
console.log(`Dollar ke saath: \${notAVariable}`);

/*
  ## 6. Escape Sequences
  Template string me bhi `\n`, `\t`, `\\` kaam karte hain.
*/
console.log(`Tab:\tbaad`); // tab space
console.log(`New\nline`); // new line
console.log(`Backslash: \\`); // \

/*
  ## 7. Nested Template Strings
  `${}` ke andar dusri template string bhi likh sakte ho.
*/
const isMember = true;
const msg = `Hello ${firstName}, ${
  isMember ? `aap member hain` : `aap member nahi hain`
}`;
console.log(msg);

/*
  ## 8. Loops/Arrays se HTML Banana (Real Use)
  List ke items se HTML string banana template string ka sabse common
  use hai (DOM me `innerHTML` me daalne ke liye).
*/
const skills = ["HTML", "CSS", "JavaScript"];
const listHtml = `
<ul>
  ${skills.map((skill) => `<li>${skill}</li>`).join("\n  ")}
</ul>`;
console.log(listHtml);

const user = { name: "Ritesh Kumar", city: "Patna" };
const card = `<div class="card">
  <h2>${user.name}</h2>
  <p>${user.city}</p>
</div>`;
console.log(card);

/*
  ## 9. Tagged Templates (Advanced)
  Template string se pehle ek function ka naam likho, wo function string
  ke hisson (`strings`) aur values (`...values`) ko alag-alag receive
  karta hai. Isse custom processing (highlight, sanitize, translate)
  hoti hai.
*/
function highlight(strings, ...values) {
  // strings: text ke tukde, values: ${} wali cheezein
  return strings.reduce((result, str, i) => {
    const value = i < values.length ? `[${values[i]}]` : "";
    return result + str + value;
  }, "");
}
const course = "JavaScript";
const level = "Beginner";
console.log(highlight`Course ${course} ka level ${level} hai`);
// Course [JavaScript] ka level [Beginner] hai

/*
  Tagged template ka real use:
  - styled-components (`styled.div` ... `` ` ``).
  - SQL injection se bachne ke liye safe queries (sql`...`).
  - GraphQL queries (gql`...`).
  - i18n (translation) aur HTML sanitizing.
*/

/*
  ## 10. `String.raw` — Escape Ko Waisa Hi Rakhna
  Built-in tag jo `\n`, `\t` ko process nahi karta, text jaisa hai waisa
  deta hai (file paths aur regex me kaam aata hai).
*/
console.log(`C:\new\table`); // \n aur \t process ho jaate hain
console.log(String.raw`C:\new\table`); // C:\new\table

/*
  ## 11. Template String Vs Normal Strings
  | Feature            | `"..."` / `'...'` | `` `...` ``         |
  |--------------------|-------------------|---------------------|
  | Variable andar     | `+` se jodna      | `${}` se seedha     |
  | Multi-line         | `\n` zaroori      | Enter se hi         |
  | Expression         | Nahi              | Haan (`${a + b}`)   |
  | Tagged templates   | Nahi              | Haan                |
  | Version            | ES1               | ES6                 |
*/

/*
  ## 12. Best Practices
  1. Jahan variable/expression string me daalna ho wahan template string
     use karo, sirf plain text ho to normal quotes bhi theek hain.
  2. `${}` ke andar bahut lambi logic mat daalo, pehle variable me
     nikal lo (readability).
  3. User input se HTML banate waqt sanitize karo (XSS risk), kyunki
     `${userInput}` seedha `innerHTML` me dangerous hai.
  4. Object ko string me dikhana ho to `JSON.stringify` use karo.
  5. Indentation ka dhyaan rakho, wo string ka hissa ban jaati hai.
*/

/*
  ## 13. Common Mistakes
  1. Quotes (`"`) lagake `${}` likhna: `"Hi ${name}"` interpolate nahi
     hota, wo literal text hi rehta hai.
  2. Backtick ki jagah single quote (`'`) lagana.
  3. Object ko `${obj}` me daalna ([object Object] aata hai).
  4. Extra indentation/new line ka dhyaan na rakhna.
  5. Bina sanitize kiye user data ko HTML me daalna.
*/
console.log("Hi ${firstName}"); // Hi ${firstName} (interpolate nahi hua)

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. Template string kya hoti hai?**
  A. ES6 ki string jo backticks (`` ` ``) se banti hai aur jisme `${}` se
     variable/expression seedha string me daal sakte hain, aur multi-line
     bhi likh sakte hain.

  **Q2. String me variable daalne ka sabse aasan tarika kya hai?**
  A. Template string: `` `Hello ${name}` ``, `+` concatenation se
     zyada readable.

  **Q3. Kya `"Hello ${name}"` (double quotes me) kaam karega?**
  A. Nahi. Interpolation sirf backticks me hota hai, double quotes me
     `${name}` literal text rehta hai.

  **Q4. `${}` ke andar kya likh sakte hain?**
  A. Koi bhi valid JS expression: variable, calculation, ternary,
     function call, method call.

  **Q5. Multi-line string kaise banate hain?**
  A. Backticks me seedha Enter dabake. Normal quotes me `\n` lagana
     padta hai.

  **Q6. Output kya hoga?** `` `${2 + 3} apple` ``
  A. `"5 apple"`.

  ### Junior Level (1–3 Years)
  **Q7. Template string ka result kaunsa type hota hai?**
  A. Normal `string` (`typeof` = "string"), koi special type nahi.

  **Q8. Template string me `${obj}` kya dikhata hai?**
  A. `[object Object]`, kyunki object `toString()` se convert hota hai.
     Sahi: `JSON.stringify(obj)`.

  **Q9. Backtick ya `${` ko literal kaise likhte hain?**
  A. Backslash se escape karke: `` \` `` aur `\${`.

  **Q10. Array se HTML list kaise banate hain?**
  A. `` `<ul>${arr.map(i => `<li>${i}</li>`).join("")}</ul>` `` .
     `join` zaroori hai warna commas aa jaate hain.

  **Q11. Nested template string possible hai?**
  A. Haan, `${}` ke andar dusra template string likh sakte hain (jaise
     conditional text ke liye ternary ke saath).

  **Q12. Template string me indentation ka kya effect hai?**
  A. Spaces aur new lines string ka hissa ban jaate hain, to multi-line
     string me extra indent output me dikhega.

  ### Mid Level (3–5 Years)
  **Q13. Tagged template kya hai?**
  A. Template string se pehle function ka naam: `` tag`text ${v}` ``.
     Function ko text ke tukde (array) aur values alag milte hain, jisse
     custom processing (sanitize, translate, style) ho sakti hai.

  **Q14. Tagged template function ko kya arguments milte hain?**
  A. Pehla argument `strings` (array, extra `strings.raw`) aur uske baad
     har `${}` ki value alag argument me. `strings.length` hamesha
     `values.length + 1` hoti hai.

  **Q15. `String.raw` kya karta hai?**
  A. Built-in tag jo escape sequences (`\n`, `\t`) process nahi karta,
     text jaisa hai waisa deta hai. File path/regex me kaam aata hai.

  **Q16. `${}` me `undefined`/`null` aaye to kya hota hai?**
  A. String me "undefined" / "null" text ban ke aata hai. Default dena
     ho to `${value ?? "NA"}`.

  **Q17. Template string vs concatenation performance?**
  A. Practically koi measurable fark nahi, modern engines dono optimize
     karte hain. Choice readability par hoti hai.

  **Q18. Template string ko number/boolean ke saath use karne par?**
  A. Sab string me convert ho jaata hai: `` `${true}` `` = "true",
     `` `${10}` `` = "10". Conversion `String(value)` jaisi hoti hai
     (par Symbol par TypeError aata hai).

  ### Senior Level (5–7+ Years)
  **Q19. XSS ka template string se kya relation hai?**
  A. `` `<div>${userInput}</div>` `` ko `innerHTML` me daalna dangerous
     hai, kyunki user script inject kar sakta hai. Bachav: `textContent`,
     HTML escape/sanitize (DOMPurify), ya safe tagged template.

  **Q20. Tagged templates se SQL injection kaise roki jaati hai?**
  A. `` sql`SELECT * FROM users WHERE id = ${id}` `` me tag function
     values ko query string me jodne ke bajaye parameters (`$1`, `?`)
     bana deta hai, to value kabhi SQL text ka hissa nahi banti.

  **Q21. Tagged template ke `strings` array ki special property kya hai?**
  A. `strings.raw` (unprocessed text) hai, aur `strings` frozen aur
     same call-site par cached rehta hai (har baar same array object),
     jo memoization/caching me kaam aata hai.

  **Q22. Libraries tagged templates kyun use karti hain?**
  A. `styled-components` (CSS in JS), `lit-html` (HTML templating),
     `graphql-tag` (`gql`), sql libraries. Syntax natural lagta hai, aur
     library ko text aur dynamic values alag milte hain, to optimize/
     sanitize/cache kar sakti hai.

  **Q23. Invalid escape sequence tagged template me kaise handle hota
  hai?**
  A. ES2018 se tagged template me invalid escape (jaise `\u`) par
     `strings[i]` `undefined` ho jaata hai par `strings.raw[i]` text
     rehta hai, error nahi aata. Untagged template me SyntaxError aata hai.

  **Q24. i18n/localization me template string ki limitation?**
  A. Hard-coded template me word order language ke hisaab se badalta
     hai, isliye production me message-format libraries (ICU, i18next)
     use hoti hain jo placeholders ko translation file me rakhti hain.

  **Q25. Bade/loops wale strings me performance aur readability kaise
  rakhein?**
  A. Loop me `+=` ya nested templates ki jagah array me parts push karke
     `join("")`, ya small helper functions me tod do. Bahut lambi
     HTML strings ke liye proper templating/framework (JSX, lit) behtar.

  **Q26. Template string aur `String()`/`toString()` conversion me
  difference?**
  A. Template literal values ko ToString abstract operation se convert
     karta hai (Symbol par TypeError), jabki `String(sym)` Symbol ko
     "Symbol(desc)" me convert kar deta hai. `+ ""` valueOf pehle
     try karta hai, template `toString` pehle.
*/
