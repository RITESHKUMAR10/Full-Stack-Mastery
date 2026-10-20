# VS Code Download aur Install Karna

## 1. VS Code Kya Hai?
- **VS Code (Visual Studio Code)** ek free, lightweight **code editor** hai jo Microsoft ne banaya hai.
- Ye JavaScript hi nahi, balki har language (Python, Java, C++, etc.) ke liye use hota hai.
- Khud VS Code bhi **Electron** (JavaScript-based framework) se bana hai.
- Features: syntax highlighting, extensions, built-in terminal, debugging, Git integration, IntelliSense (auto-complete).

## 2. VS Code Download Karna
1. Browser me jaake **https://code.visualstudio.com** open karo.
2. Apne operating system ke mutabik button dikhega — **Windows**, **Mac**, ya **Linux**.
3. Windows ke liye `.exe` file download hogi, Mac ke liye `.zip`/`.dmg`.
4. Download complete hone ka wait karo.

## 3. VS Code Install Karna (Windows)
1. Downloaded `.exe` file par double-click karo.
2. License agreement accept karo → **Next**.
3. Installation location choose karo (default rakhna best hai) → **Next**.
4. Important step: **"Add to PATH"** checkbox ko zaroor select karo — isse terminal se `code` command direct chal jaayega.
5. **Install** button dabao, installation complete hone do.
6. Installation ke baad VS Code launch ho jaayega.

## 4. Node.js Bhi Install Karna (JavaScript Run Karne Ke Liye)
- Browser ke bahar JavaScript run karne ke liye **Node.js** chahiye.
- **https://nodejs.org** se **LTS (Long Term Support)** version download karo.
- Installer chalao, sab default settings ke saath **Next → Next → Install**.
- Install hone ke baad terminal me check karo:
  ```
  node -v
  npm -v
  ```
  Agar version number dikhe, matlab installation successful hai.

## 5. Useful VS Code Extensions (JavaScript ke Liye)
- **Live Server** — HTML file ko browser me live reload ke saath open karta hai.
- **Code Runner** — ek click me JS file run karne deta hai.
- **Prettier** — code ko automatically format karta hai.
- **ESLint** — code me errors/bad practices pakadta hai.
- **JavaScript (ES6) code snippets** — common JS code quickly type karne me help karta hai.

## 6. Pehli JavaScript File Run Karna
1. VS Code me ek folder open karo (`File → Open Folder`).
2. Ek naya file banao: `app.js`.
3. Usme likho:
   ```javascript
   console.log("Hello, JavaScript!");
   ```
4. Terminal open karo (`Ctrl + ~` ya `Terminal → New Terminal`).
5. Command chalao:
   ```
   node app.js
   ```
6. Terminal me output dikhega: `Hello, JavaScript!`

## 7. Common Issues
- `node` ya `code` command terminal me "not recognized" bole → PATH me add nahi hua, installer dubara chalao aur "Add to PATH" select karo, ya system restart karo.
- Extensions kaam nahi kar rahe → VS Code restart karo ya extension ko reload karo.

## Interview Questions & Answers (Fresher se 7 Years Experience Tak)

### Fresher Level (0–1 Year)
**Q1. VS Code kya hai?**
A. VS Code ek free, lightweight code editor hai jo Microsoft ne banaya hai. Ye syntax highlighting, extensions, debugging aur built-in terminal jaise features deta hai.

**Q2. JavaScript file browser ke bahar run karne ke liye kya chahiye?**
A. **Node.js** chahiye — ye JavaScript ko browser ke bahar (terminal/server pe) run karne deta hai.

**Q3. `node app.js` command kya karti hai?**
A. Ye `app.js` file ke andar likha hua JavaScript code Node.js runtime ke through execute karti hai aur output terminal me print karti hai.

### Junior Level (1–3 Years)
**Q4. "Add to PATH" option VS Code/Node install ke time kyun important hai?**
A. PATH me add hone se operating system ko pata chalta hai ki `code` ya `node` command kahan se dhundhni hai. Agar ye select nahi kiya to terminal me ye commands "not recognized" error dengi.

**Q5. `node -v` aur `npm -v` commands kyun use karte hain?**
A. Ye check karne ke liye ki Node.js aur npm (Node Package Manager) successfully install hue hain ya nahi, aur kaunsa version install hai.

**Q6. Live Server extension ka use kya hai?**
A. Ye HTML file ko local server pe open karta hai aur jab bhi code save karte ho, browser automatically reload ho jaata hai — manual refresh ki zaroorat nahi padti.

### Mid Level (3–5 Years)
**Q7. npm kya hai aur VS Code/Node setup me iska role kya hai?**
A. npm (Node Package Manager) Node.js ke saath automatically install hota hai. Ye third-party packages/libraries install, manage aur share karne ke liye use hota hai — modern JS development isi par heavily depend karta hai.

**Q8. LTS version hi kyun recommend kiya jaata hai Node.js install karte waqt?**
A. **LTS (Long Term Support)** version stable hota hai aur long time tak maintenance/security updates milte hain — production projects me isi wajah se LTS preferred hota hai, latest "Current" version me breaking changes ka risk zyada hota hai.

**Q9. ESLint aur Prettier dono code quality tools hain — farak kya hai?**
A. **Prettier** code ko automatically **format** karta hai (indentation, quotes, spacing). **ESLint** code me **errors aur bad practices** (unused variables, logic issues) pakadta hai. Dono alag purpose solve karte hain aur saath me use hote hain.

### Senior Level (5–7 Years)
**Q10. Team environment me multiple developers ke VS Code setup consistent kaise rakhoge?**
A. `.vscode/extensions.json` me recommended extensions list karo, `.prettierrc`/`.eslintrc` jaise config files repo me commit karo, aur `.editorconfig` use karo — isse har developer ka editor same formatting/linting rules follow karega, chahe unka personal VS Code setup kuch bhi ho.

**Q11. Node.js installation ke multiple versions ek machine pe kaise manage karoge (jab different projects ko different Node version chahiye)?**
A. **nvm (Node Version Manager)** use karte hain — isse ek command se different Node versions install aur switch kiye ja sakte hain, bina baar-baar uninstall/reinstall kiye.
