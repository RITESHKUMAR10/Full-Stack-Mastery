# JavaScript File ko HTML me Link Karna

## 1. Teen Tarike JavaScript Likhne Ke
1. **Inline JS** — HTML tag ke andar directly attribute me likhna.
2. **Internal JS** — HTML file ke andar `<script>` tag me likhna.
3. **External JS** — alag `.js` file bana ke HTML me link karna (sabse best practice).

## 2. Inline JavaScript
```html
<button onclick="alert('Hello!')">Click Me</button>
```
- Chhote, ek-off kaam ke liye use hota hai.
- Best practice nahi hai — HTML aur JS mix ho jaate hain, maintain karna mushkil hota hai.

## 3. Internal JavaScript (`<script>` Tag ke Andar)
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello</h1>

  <script>
    console.log("Internal JavaScript chal raha hai");
  </script>
</body>
</html>
```
- Chhote projects/testing ke liye theek hai, par bade project me code reusable nahi hota.

## 4. External JavaScript (Best Practice)
1. Ek naya file banao: `script.js`
2. Usme apna JS code likho:
   ```javascript
   console.log("External file se chal raha hai");
   ```
3. HTML file me `<script>` tag se link karo:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>My Page</title>
   </head>
   <body>
     <h1>Hello</h1>

     <script src="script.js"></script>
   </body>
   </html>
   ```
- `src` attribute me file ka path dena hota hai (relative ya absolute).
- Fayde: code reusable hota hai, HTML clean rehta hai, browser file ko **cache** kar leta hai (dobara load fast hoti hai).

## 5. `<script>` Tag Kahan Likhna Chahiye?
- **`<head>` me (bina kisi attribute ke)** — script HTML se pehle load/execute hoti hai, agar script DOM elements access kare to error aa sakta hai (kyunki wo abhi bane nahi hote).
- **`</body>` ke just pehle (sabse common tarika)** — pura HTML pehle load ho jaata hai, uske baad script chalti hai. Isse DOM elements already available hote hain.
- **`<head>` me `defer` attribute ke saath (modern best practice)**:
  ```html
  <script src="script.js" defer></script>
  ```
  - HTML parsing hoti rehti hai, script background me download hoti hai, aur **HTML fully parse hone ke baad** script execute hoti hai.

## 6. `defer` vs `async` Attribute
| Attribute | Kaam |
|-----------|------|
| (kuch nahi) | Script turant download aur execute hoti hai, HTML parsing ruk jaati hai |
| `defer` | Script background me download hoti hai, par execute HTML parse hone ke **baad** hoti hai (order maintain hota hai) |
| `async` | Script background me download hoti hai aur **jaise hi download complete** ho, turant execute ho jaati hai (HTML parsing ruk sakti hai; order guarantee nahi hota agar multiple scripts hon) |

```html
<script src="script.js" defer></script>
<script src="analytics.js" async></script>
```

## 7. ES Modules Link Karna (`type="module"`)
```html
<script type="module" src="app.js"></script>
```
- Ye modern `import`/`export` syntax use karne deta hai.
- `type="module"` wali scripts automatically `defer` jaisa behave karti hain.
- Example:
  ```javascript
  // utils.js
  export function greet() {
    console.log("Hello from module!");
  }

  // app.js
  import { greet } from './utils.js';
  greet();
  ```

## 8. Common Mistakes
- Script tag me `src` likhte waqt path galat dena (file not found error console me aata hai).
- Script ko `<head>` me bina `defer` ke daal dena aur uske andar DOM elements access karna — element `null` aata hai kyunki wo abhi render nahi hue hote.
- Local file system pe `type="module"` test karte waqt CORS error aana — isko fix karne ke liye Live Server extension ya local server use karo, direct file double-click se mat kholo.

## Interview Questions & Answers (Fresher se 7 Years Experience Tak)

### Fresher Level (0–1 Year)
**Q1. JavaScript ko HTML me kitne tarike se likh sakte hain?**
A. Teen tarike — **Inline** (tag ke andar attribute me, jaise `onclick`), **Internal** (`<script>` tag ke andar HTML file me), aur **External** (alag `.js` file bana ke `src` attribute se link karna).

**Q2. External JavaScript file ko link karne ka syntax kya hai?**
A. `<script src="script.js"></script>` — `src` attribute me JS file ka path dena hota hai.

**Q3. Inline JavaScript best practice kyun nahi hai?**
A. Kyunki HTML aur JS mix ho jaate hain, code reusable nahi hota aur bade project me maintain karna mushkil ho jaata hai.

### Junior Level (1–3 Years)
**Q4. `<script>` tag ko `</body>` ke just pehle kyun rakhte hain?**
A. Isse pura HTML pehle parse/load ho jaata hai, uske baad script chalti hai — isliye script me DOM elements access karte waqt error nahi aata (elements already ban chuke hote hain).

**Q5. Agar `<script>` tag `<head>` me (bina `defer` ke) rakha jaaye aur usme DOM element access kiya jaaye to kya hoga?**
A. Element `null` milega, kyunki script HTML parse hone se **pehle** hi execute ho jaati hai — tab tak wo element DOM me bana nahi hota.

**Q6. `defer` attribute kya karta hai?**
A. Script background me download hoti rehti hai, par **execute sirf HTML fully parse hone ke baad** hoti hai — isse HTML parsing block nahi hoti aur DOM bhi ready mil jaata hai.

### Mid Level (3–5 Years)
**Q7. `defer` aur `async` me kya farak hai, aur kab kaunsa use karoge?**
A. `defer` wali script HTML parse hone ke baad, **order maintain karte hue** chalti hai — jab script ka DOM par depend hona ya multiple scripts ka order important ho tab use karo. `async` script download hote hi turant chal jaati hai, order guarantee nahi hota — independent scripts (jaise analytics) ke liye best hai.

**Q8. `type="module"` use karne se script ka behavior kaise change hota hai?**
A. `type="module"` wali script automatically `defer` jaisa behave karti hai (HTML parse hone ke baad execute hoti hai), aur isme `import`/`export` syntax use kar sakte ho jo normal script me allowed nahi hai. Ye by default strict mode me bhi chalti hai.

**Q9. Browser external JS file ko cache kyun karta hai, aur isse kya fayda hota hai?**
A. Browser `src` se linked file ko ek baar download karke cache kar leta hai. Agar same file dusre page pe bhi use ho rahi ho, to dusri baar network request nahi lagti — page load fast ho jaata hai.

### Senior Level (5–7 Years)
**Q10. Multiple `<script>` tags ho to unka execution order kaise decide hota hai — normal, `defer`, aur `async` teeno cases me?**
A. **Normal** scripts jis order me likhi hain usi order me, synchronously (one by one, HTML parsing block karte hue) chalti hain. **`defer`** scripts bhi written order maintain karti hain, par sab HTML parse hone ke baad chalti hain. **`async`** scripts ka order guarantee nahi hota — jo pehle download complete ho jaaye wo pehle run hoti hai, isliye dependent scripts ke liye async risky hai.

**Q11. Local file (`file://`) se `type="module"` script chalane par CORS error kyun aata hai, aur production me ye issue kyun nahi hota?**
A. Browsers security reasons se `file://` protocol se module imports ko fetch request jaisa treat karte hain, jo CORS policy ke under block ho jaata hai. Production me files **http/https server** se serve hoti hain (same-origin), isliye ye restriction trigger nahi hoti. Local testing me isi wajah se Live Server/local server zaroori hota hai.

**Q12. Agar ek legacy project me purane `var`-based scripts aur naye ES module scripts dono chalane hain, to kaise handle karoge?**
A. Legacy scripts ko normal `<script src="legacy.js" defer></script>` ki tarah rakho, aur naye code ko `<script type="module" src="app.js"></script>` se separately link karo. Dono independent load hote hain; agar legacy code ko module se access karna ho to usse `window` object par expose karna padta hai, kyunki modules ka apna scope hota hai (global scope me automatically nahi jaata).
