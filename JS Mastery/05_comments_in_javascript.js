// # Comments in JavaScript
//
// Comment wo text hai jo JS engine **execute nahi karta** — sirf
// developers ke padhne ke liye hota hai. Use: code explain karna, line
// temporarily disable karna, ya TODO/reminder likhna.

// ## 1. Single-Line Comment
// `//` ke baad jo bhi likha ho, wahi line ke end tak ignore ho jaata hai.
console.log("Hello"); // isi line ke end me bhi comment likh sakte ho

// ## 2. Multi-Line Comment
// `/*` se shuru, `*/` se khatam. Lambi explanation ya multiple lines
// disable karne ke liye use hota hai.
/*
  Yeh multi-line comment hai.
  Ye kai lines tak phail sakta hai.
  JS engine isko bilkul ignore karega.
*/
console.log("Hello again");

// ## 3. Code ko Temporarily Disable Karna (Commenting Out)
// console.log("Ye line nahi chalegi");
console.log("Ye line chalegi");

/*
console.log("Pehli line disabled");
console.log("Dusri line bhi disabled");
*/
console.log("Ye bhi chalegi");

// ## 4. VS Code Shortcut Se Comment Karna
// - `Ctrl + /` — current line/selection ko single-line comment kar deta hai
// - `Shift + Alt + A` — selected code ko block comment (`/* */`) kar deta hai
// - (Shortcuts `00_some_shortcuts.md` me bhi cover hain)

// ## 5. JSDoc Style Comment (Documentation Ke Liye)
// `/**` (double star) se start hota hai, normal `/*` se alag.
// VS Code isko padh ke function call karte waqt tooltip me param info dikhata hai.
/**
 * Yeh function do numbers ko add karta hai.
 * @param {number} a - Pehla number
 * @param {number} b - Dusra number
 * @returns {number} Dono ka sum
 */
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5

// ## 6. Nested Comments ka Issue
// Multi-line comments **nest nahi ho sakte** — pehla `*/` jahan milega,
// comment wahi khatam ho jaayega aur baaki code error de sakta hai.

// ## 7. Best Practices
// - Comment **"WHY"** batana chahiye, na ki **"WHAT"** (code khud what bata deta hai).
// - Purane/dead code ko comment karke chhodna avoid karo — zaroorat nahi
//   to delete kar do, Git history me already safe rehta hai.
// - `// TODO:` aur `// FIXME:` jaise comments pending kaam/known bug mark karne ke liye.

// Bad comment (obvious baat bata raha hai)
let age = 25; // age ko 25 set kiya

// Good comment (reason bata raha hai)
let defaultAge = 25; // default age jab tak user apna data fill na kare

// TODO: input validation add karna hai
// FIXME: ye function negative numbers ke saath crash karta hai

// ## Quick Reference
// | Type          | Syntax          | Use Case                         |
// |---------------|-----------------|-----------------------------------|
// | Single-line   | `// comment`    | Chhoti note                      |
// | Multi-line    | `/* comment */` | Lambi explanation                |
// | JSDoc         | `/** ... */`    | Function/class documentation     |
// | TODO comment  | `// TODO: ...`  | Pending kaam yaad rakhna          |
// | FIXME comment | `// FIXME: ...` | Known bug mark karna             |

// ## Interview Questions & Answers (Fresher se 7 Years Experience Tak)
//
// ### Fresher Level (0–1 Year)
// **Q1. JavaScript me comment likhne ke kitne tarike hain?**
// A. Mukhya do tarike — single-line (`// comment`) aur multi-line
// (`/* comment */`). JSDoc style (`/** ... */`) documentation ke liye.
//
// **Q2. Single-line aur multi-line comment ka syntax kya hai?**
// A. Single-line: `// text`. Multi-line: `/* text */` jo kai lines tak phail sakta hai.
//
// **Q3. Comments JS engine kyun ignore kar deta hai?**
// A. Kyunki comments sirf developers ke padhne ke liye hote hain, code
// ka logical part nahi hote — engine inhe parse hi nahi karta.
//
// ### Junior Level (1–3 Years)
// **Q4. VS Code me comment karne ka shortcut kya hai?**
// A. `Ctrl + /` se single-line comment, `Shift + Alt + A` se block comment.
//
// **Q5. Multi-line comments nest kyun nahi kar sakte?**
// A. JS parser jaise hi pehla `*/` dekhta hai, comment wahin khatam
// maan leta hai — baaki text normal code ki tarah parse hone ki
// koshish hota hai aur syntax error aata hai.
//
// **Q6. `// TODO` aur `// FIXME` comments kyun use karte hain?**
// A. TODO pending kaam yaad rakhne ke liye, FIXME known bug mark karne ke liye.
//
// ### Mid Level (3–5 Years)
// **Q7. JSDoc comment normal multi-line comment se kaise alag hai?**
// A. JSDoc `/**` (double star) se start hota hai. Isme `@param`,
// `@returns` tags hote hain jisse editor tooltip me info dikhata hai.
//
// **Q8. Comments me "what" vs "why" explain karna — better practice kya hai?**
// A. "What" redundant hota hai (code khud bata deta hai). "Why" useful
// hota hai — reasoning/context dena, obvious cheez repeat na karna.
//
// **Q9. Dead/commented-out code chhodna kyun bad practice hai?**
// A. File clutter hoti hai, readability kam hoti hai. Git history
// already safe rakhta hai, isliye delete karna better hai.
//
// ### Senior Level (5–7 Years)
// **Q10. Large codebase me JSDoc ko outdated hone se kaise bachaoge?**
// A. TypeScript (jo JSDoc ko type-check kar sakta hai) ya ESLint
// plugins use karte hain jo documented params aur signature match karein.
//
// **Q11. Code review me comments ko lekar kya red flags dekhte ho?**
// A. Outdated/contradicting comments, obvious code repeat karne wale
// comments, excessive commenting jo refactoring ki jagah le raha ho,
// aur cleanup na hua dead commented-out code.
//
// **Q12. Kya comments production performance ko affect karte hain?**
// A. Runtime par nahi — parse time par discard ho jaate hain.
// Minifiers (Terser) build me strip kar dete hain file size ke liye.
