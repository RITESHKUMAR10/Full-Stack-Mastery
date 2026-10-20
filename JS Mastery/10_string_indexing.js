/*
  # String Indexing in JavaScript (Beginner se Expert Tak)

  String characters ka ordered sequence hai. Har character ki ek position
  hoti hai jise **index** kehte hain, aur indexing se hum string ke kisi
  bhi character ko position se access karte hain.

  JS me index **0 se start** hota hai (zero-based), 1 se nahi.

  Note: Jahan error aata hai ya kuch silently fail hota hai, wo comment me
  samjhaya hai. Test karna ho to comment hata ke run karo.
*/

/*
  ## 1. Index Kya Hota Hai
  String: "HELLO"
  Index :  0  1  2  3  4
  Char  :  H  E  L  L  O
  Last index hamesha `length - 1` hota hai (yaha 4).
*/
const word = "HELLO";

/*
  ## 2. Bracket Notation `str[index]`
  Sabse common aur recommended tarika.
*/
console.log(word[0]); // H (pehla character)
console.log(word[1]); // E
console.log(word[4]); // O (last character)

/*
  ## 3. `length` Property
  Total characters ki ginti (spaces bhi count hote hain). `length` ek
  property hai, method nahi, isliye `()` nahi lagta.
*/
console.log(word.length); // 5
console.log("Hi there".length); // 8 (space bhi gina gaya)
console.log("".length); // 0 (empty string)

/*
  ## 4. Last Character Nikalna
  Formula: `str[str.length - 1]`
*/
console.log(word[word.length - 1]); // O
console.log(word[word.length - 2]); // L (second last)

/*
  ## 5. Out of Range Index
  Jo index exist nahi karta uspar error nahi aata, `undefined` milta hai.
*/
console.log(word[10]); // undefined
console.log(word[-1]); // undefined (negative index [] me kaam nahi karta)
console.log(word[1.5]); // undefined (decimal index valid nahi)

/*
  ## 6. `charAt(index)` Method
  `[]` jaisa hi hai, par out of range par `undefined` ki jagah **empty
  string** `""` deta hai.
*/
console.log(word.charAt(1)); // E
console.log(word.charAt(10)); // "" (empty string)
console.log(word.charAt()); // H (index na do to default 0)

/*
  ## 7. `at(index)` Method (ES2022) — Negative Index Support
  `at()` negative index leta hai: -1 last character, -2 second last,
  yani end se gino.
*/
console.log(word.at(0)); // H
console.log(word.at(-1)); // O
console.log(word.at(-2)); // L
console.log(word.at(10)); // undefined

/*
  ## 8. `[]` vs `charAt()` vs `at()`
  | Feature            | `str[i]`   | `charAt(i)` | `at(i)`    |
  |--------------------|------------|-------------|------------|
  | Out of range       | undefined  | ""          | undefined  |
  | Negative index     | undefined  | ""          | End se     |
  | Version            | ES5        | ES1         | ES2022     |
  | Recommended        | Haan       | Kam         | Haan (-ve) |
*/

/*
  ## 9. String Immutable Hoti Hai
  Index se character **padh** sakte ho, **badal nahi** sakte. Assign
  karoge to silently ignore hota hai (strict mode me TypeError).
*/
let fruit = "mango";
fruit[0] = "M"; // koi asar nahi
console.log(fruit); // mango (change nahi hua)

/*
  Change karna ho to naya string banao aur variable me reassign karo.
*/
fruit = "M" + fruit.slice(1);
console.log(fruit); // Mango

/*
  ## 10. String ke Characters par Loop
  Indexing ka sabse bada use: har character ko ek-ek karke process
  karna.
*/
const text = "JS";
for (let i = 0; i < text.length; i++) {
  console.log(i, text[i]); // 0 J, 1 S
}

// for...of directly characters deta hai (index nahi):
for (const ch of "Hey") {
  console.log(ch); // H, e, y
}

// Index aur character dono chahiye to:
[..."Hey"].forEach((ch, i) => console.log(i, ch));

/*
  ## 11. Index Dhoondhna: `indexOf` aur `lastIndexOf`
  Ulta kaam: character/substring ka index pata karna. Na mile to `-1`.
*/
const sentence = "banana";
console.log(sentence.indexOf("a")); // 1 (pehla match)
console.log(sentence.lastIndexOf("a")); // 5 (aakhri match)
console.log(sentence.indexOf("a", 2)); // 3 (index 2 se search shuru)
console.log(sentence.indexOf("na")); // 2 (substring ka start index)
console.log(sentence.indexOf("z")); // -1 (nahi mila)

// Exist karta hai ya nahi check karna:
console.log(sentence.indexOf("z") !== -1); // false
console.log(sentence.includes("nan")); // true (modern aur clean)

/*
  ## 12. Character Code: `charCodeAt` aur `codePointAt`
  Index par character ka numeric (Unicode) code milta hai.
*/
console.log("A".charCodeAt(0)); // 65
console.log("a".charCodeAt(0)); // 97
console.log(String.fromCharCode(72, 105)); // Hi (code se wapas string)

/*
  ## 13. Practical Examples
*/
// 13.1 Pehla letter capital karna
const name = "ritesh kumar";
console.log(name[0].toUpperCase() + name.slice(1)); // Ritesh kumar

// 13.2 String reverse karna (index loop se)
let reversed = "";
for (let i = "abc".length - 1; i >= 0; i--) {
  reversed += "abc"[i];
}
console.log(reversed); // cba

// 13.3 Palindrome check (do index, start aur end)
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}
console.log(isPalindrome("madam"), isPalindrome("hello")); // true false

// 13.4 Vowels count karna
let vowels = 0;
for (const ch of "education") {
  if ("aeiou".includes(ch)) vowels++;
}
console.log(vowels); // 5

/*
  ## 14. Unicode aur Emoji Ka Gotcha
  JS strings UTF-16 me store hoti hain. Emoji jaise characters 2 code
  units lete hain (surrogate pair), isliye `length` aur index gadbad
  dete hain.
*/
const smile = "😀";
console.log(smile.length); // 2 (1 nahi!) 
console.log(smile[0] === smile); // false (aadha character mila)
console.log([...smile].length); // 1 (spread/for...of code points padhta hai)
console.log(smile.codePointAt(0)); // 128512

/*
  ## 15. Common Mistakes
  1. Index 1 se start samajhna (hota 0 se hai).
  2. Last index `length` samajhna (hota `length - 1` hai).
  3. `length()` likhna (method nahi, property hai).
  4. `str[-1]` se last character ki ummeed (`at(-1)` use karo).
  5. `str[0] = "x"` se string badalne ki koshish.
  6. Emoji/unicode me `length` ko character count maan lena.
*/ 

/*
  ## Interview Questions & Answers (Fresher se 7+ Years Experience Tak)

  ### Fresher Level (0–1 Year)
  **Q1. String indexing kya hai?**
  A. String ke characters ko unki position (index) se access karna.
     Index 0 se start hota hai.

  **Q2. `"HELLO"[1]` ka output kya hoga?**
  A. `"E"`, kyunki index 0 par H, index 1 par E hai.

  **Q3. Last character kaise nikalte hain?**
  A. `str[str.length - 1]` ya `str.at(-1)`.

  **Q4. Out of range index par kya milta hai?**
  A. `[]` me `undefined`, `charAt()` me empty string `""`.

  **Q5. `length` method hai ya property?**
  A. Property, isliye `str.length` likhte hain, `str.length()` nahi.

  **Q6. Kya `str[0] = "X"` se string change hoti hai?**
  A. Nahi. String immutable hai, assignment silently ignore hoti hai
     (strict mode me TypeError).

  ### Junior Level (1–3 Years)
  **Q7. `[]` aur `charAt()` me kya difference hai?**
  A. Out of range par `[]` `undefined` deta hai, `charAt()` `""`.
     `[]` modern aur short hai, `charAt()` purana hai.

  **Q8. `at()` method kya hai aur kya fayda hai?**
  A. ES2022 method jo negative index support karta hai. `str.at(-1)`
     last character deta hai, `str[str.length - 1]` se chhota aur
     readable.

  **Q9. `str[-1]` kya deta hai?**
  A. `undefined`, kyunki `[]` me `-1` ek property naam ki tarah dekha
     jaata hai, end se count nahi hota.

  **Q10. `indexOf` aur `lastIndexOf` kya karte hain?**
  A. `indexOf` pehla match ka index, `lastIndexOf` aakhri match ka
     index deta hai. Na mile to `-1`.

  **Q11. Character exist karta hai ya nahi, kaise check karein?**
  A. `str.includes("a")` (clean). Purana: `str.indexOf("a") !== -1`.

  **Q12. String me har character par loop kaise chalate hain?**
  A. `for` loop with index (`str[i]`), `for...of` (direct characters),
     ya `[...str].forEach((ch, i) => ...)`.

  ### Mid Level (3–5 Years)
  **Q13. String immutable hone ka kya matlab hai? Kaise "change" karte
  hain?**
  A. Ek baar bani string ke characters badal nahi sakte. Operations
     (replace, slice, concat) hamesha naya string return karte hain,
     jise variable me reassign karna padta hai.

  **Q14. `charCodeAt()` kya deta hai?**
  A. Index par character ka UTF-16 code unit (number), jaise
     `"A".charCodeAt(0)` = 65. Wapas `String.fromCharCode(65)` se.

  **Q15. `charCodeAt` aur `codePointAt` me difference?**
  A. `charCodeAt` sirf 16-bit code unit deta hai, emoji ke liye aadha
     (surrogate). `codePointAt` pura Unicode code point deta hai.

  **Q16. Do pointers se palindrome check kaise karte hain?**
  A. `left = 0`, `right = length - 1`, dono ko compare karte hue andar
     ki taraf badho. Mismatch par `false`. Time O(n), space O(1).

  **Q17. String reverse karne ke tarike?**
  A. Index loop (peeche se), `[...str].reverse().join("")`, ya
     `str.split("").reverse().join("")`. Emoji ke liye spread safer.

  **Q18. `str[1.5]` ya `str["1"]` ka kya hota hai?**
  A. `str["1"]` valid hai (string "1" index me convert hoti hai).
     `str[1.5]` `undefined` deta hai kyunki wo valid integer index nahi.

  ### Senior Level (5–7+ Years)
  **Q19. Emoji ke saath `length` aur indexing me kya problem aati hai?**
  A. JS strings UTF-16 hain, emoji (jaise 😀) 2 code units lete hain,
     `"😀".length` 2 hota hai aur `"😀"[0]` aadha surrogate deta hai.
     Sahi count ke liye `[...str]`, `for...of`, ya `Intl.Segmenter`.

  **Q20. Grapheme cluster kya hota hai aur spread bhi kab fail hota hai?**
  A. User ko jo ek character dikhta hai (jaise 👨‍👩‍👧 ya "é" combining
     marks ke saath) wo kai code points ka ho sakta hai. Spread code
     points tak sahi hai, par grapheme ke liye `Intl.Segmenter` chahiye.

  **Q21. Time complexity: `str[i]` aur `indexOf` ki kya hai?**
  A. `str[i]` O(1) (engines me direct access). `indexOf` O(n·m)
     worst case, practically optimized (Boyer-Moore jaisi techniques).

  **Q22. Loop me `str += ch` se string build karna performance ke liye
  kaisa hai?**
  A. Modern engines ropes/string builders se optimize karte hain, par
     bahut bade data me array me push karke `join("")` zyada safe aur
     predictable hai.

  **Q23. Unicode normalization ka indexing/comparison par effect?**
  A. "é" ek code point (U+00E9) ya "e" + combining accent (do code
     points) ho sakta hai. Dono dikhne me same, par `length` aur `===`
     alag. `str.normalize("NFC")` se compare/index karne se pehle
     normalize karo.

  **Q24. `str.at(-1)` ya `str[str.length - 1]` me kaunsa aur kyun?**
  A. `at(-1)` readable aur bug-resistant hai (empty string par bhi
     `undefined`). Purane browsers support ya transpile ho to bracket
     formula. Behavior same hai.

  **Q25. String index par negative/out-of-range ko safely kaise handle
  karte hain production code me?**
  A. Bounds check (`i >= 0 && i < str.length`), `at()` ke saath
     optional chaining/default (`str.at(i) ?? ""`), aur user input par
     validation. Silent `undefined` ko downstream bug banne se rokte hain.
*/
