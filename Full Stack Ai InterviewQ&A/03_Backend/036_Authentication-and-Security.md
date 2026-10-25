# Authentication & Security Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **OWASP Top 10 (2021)** and **OWASP API Security Top 10 (2023)**, **OAuth 2.0 / OAuth 2.1 (draft) / OpenID Connect 1.0**, **JWT (RFC 7519) and JOSE**, **WebAuthn Level 2 / passkeys (FIDO2)**, **TLS 1.2/1.3**, **NIST SP 800-63B (2024 revision)** password guidance, and web security headers as implemented in current browsers. Examples use **Node.js (Express, Passport, `jose`, `argon2`)**, with notes for Next.js and frameworks. Standards and library APIs change: anything marked "verify" should be checked in the official specs/docs (owasp.org, datatracker.ietf.org, w3.org/TR/webauthn, nodejs.org). Examples use the sample name **Ritesh Kumar**. Security advice here is defensive; never test systems you do not own or have written permission to test.
> This file covers authentication (passwords, hashing, sessions, cookies, JWT, OAuth2/OIDC, SSO/SAML, MFA/TOTP, passkeys), authorization (RBAC, ABAC, ReBAC, policy engines), web vulnerabilities (XSS, CSRF, SQL injection, SSRF, clickjacking, XXE, deserialization, path traversal), browser defences (CSP, CORS, SameSite, security headers), cryptography basics (hashing, HMAC, symmetric/asymmetric, TLS, key management), secrets management, API security, supply-chain security, DevSecOps, threat modelling, logging/incident response and compliance. API design refers to `035_GraphQL-and-REST-APIs.md`; BaaS auth refers to `034_Firebase-and-Supabase.md`; caching/rate limits refer to `031_Redis-and-Caching.md`; Linux/network basics refer to `024_Linux-and-Networking.md`.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Code](#-part-6-hands-on-tasks--code)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Topics + Mixed)](#-part-11-complete-coverage-topics--mixed)
- [Part 12: Security Internals](#-part-12-security-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is information security? The CIA triad *(Must-know)*
Protecting systems and data via three goals: **Confidentiality** (only authorized parties can read), **Integrity** (data isn't altered undetected), **Availability** (systems are usable when needed). Related: **Authenticity**, **Non-repudiation**, **Accountability**. Every control maps to one or more of these.

### Q2. Authentication vs authorization vs accounting *(Must-know)*
- **Authentication (AuthN):** proving who you are (password, OTP, passkey).
- **Authorization (AuthZ):** deciding what you may do (roles, permissions, ownership).
- **Accounting/Auditing:** recording what happened (logs).
Never confuse "logged in" with "allowed". Authorize on every request, on the server.

### Q3. Authentication factors
Something you **know** (password, PIN), **have** (phone, hardware key, TOTP app), **are** (fingerprint, face). **MFA** combines two or more different categories (password + TOTP). Two passwords are not MFA.

### Q4. Why you must never store plain-text passwords
A database leak would expose every user's password (and reuse across sites amplifies harm). Store only a **slow, salted, one-way hash** produced by a password hashing function; verify by hashing the attempt and comparing.

### Q5. Hashing vs encryption vs encoding *(Must-know)*
| | Hashing | Encryption | Encoding |
|---|---|---|---|
| Reversible | No | Yes (with key) | Yes (no key) |
| Purpose | Integrity, password storage, fingerprints | Confidentiality | Data representation (Base64, URL, hex) |
| Key needed | No (HMAC uses one) | Yes | No |
| Examples | SHA-256, Argon2, bcrypt | AES-GCM, RSA, ChaCha20 | Base64, UTF-8 |
Base64 is **not** security.

### Q6. Password hashing: bcrypt, scrypt, Argon2 *(Must-know)*
General-purpose hashes (MD5, SHA-1, SHA-256) are too fast for passwords. Use an adaptive, memory-hard algorithm: **Argon2id** (recommended), **scrypt**, or **bcrypt** (still acceptable; 72-byte input limit), or PBKDF2 (where FIPS requires it). Each includes a per-password **salt** and tunable cost.
```js
import argon2 from "argon2";
const hash = await argon2.hash("S3cure#Pass", { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
const ok = await argon2.verify(hash, "S3cure#Pass");
```
```js
import bcrypt from "bcrypt";
const h = await bcrypt.hash(pw, 12);          // cost factor 12
const ok2 = await bcrypt.compare(pw, h);
```

### Q7. Salt and pepper
A **salt** is a unique random value per password, stored with the hash, defeating rainbow tables and making identical passwords hash differently. A **pepper** is a secret value kept outside the database (HSM/secret manager) mixed into hashing (HMAC) so a DB-only leak isn't enough to crack hashes. Salts are mandatory; peppers are optional hardening.

### Q8. Password policy guidance (NIST 800-63B)
Prefer **length** (min 8, allow 64+), allow all printable characters and spaces, check against breached-password lists (Have I Been Pwned k-anonymity), no forced periodic rotation without evidence of compromise, no composition rules ("one symbol"), allow password managers/paste, rate limit attempts, and offer MFA.

### Q9. Sessions and cookies *(Must-know)*
After login the server creates a **session** (random, unguessable ID) stored server-side (memory, Redis, DB) and sends it in a cookie. Each request carries the cookie; the server looks up the session. Secure cookie flags:
```
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```
`HttpOnly` blocks JS access (XSS theft), `Secure` forces HTTPS, `SameSite` limits cross-site sending (CSRF defence). Use `__Host-` prefix for stricter binding.

### Q10. Express session example
```js
import session from "express-session";
import { RedisStore } from "connect-redis";
app.use(session({
  store: new RedisStore({ client: redis }),
  name: "__Host-sid",
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 1000, path: "/" },
}));
app.post("/login", async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  req.session.regenerate(() => { req.session.userId = user.id; res.json({ ok: true }); });   // prevent fixation
});
```

### Q11. Session fixation and hijacking
**Fixation:** attacker sets a known session ID before login; fix by regenerating the session ID after authentication. **Hijacking:** attacker steals the ID (XSS, network sniffing, malware); mitigate with HTTPS, HttpOnly, short lifetimes, binding/anomaly detection, and logout/revocation.

### Q12. What is a JWT? *(Must-know)*
A **JSON Web Token**: `base64url(header).base64url(payload).signature`. Payload holds claims: `iss`, `sub`, `aud`, `exp`, `iat`, `nbf`, `jti`, custom roles. Signed (JWS) with HS256 (shared secret) or RS256/ES256/EdDSA (private key). **Signed ≠ encrypted**: anyone can read the payload; don't store secrets.
```js
import { SignJWT, jwtVerify } from "jose";
const key = new TextEncoder().encode(process.env.JWT_SECRET);
const token = await new SignJWT({ role: "user" }).setProtectedHeader({ alg: "HS256" })
  .setSubject("42").setIssuer("api.example.com").setAudience("web").setIssuedAt().setExpirationTime("15m").sign(key);
const { payload } = await jwtVerify(token, key, { issuer: "api.example.com", audience: "web", algorithms: ["HS256"] });
```

### Q13. Access tokens vs refresh tokens
Access token: short-lived (5-15 min), sent with each API call. Refresh token: long-lived, used only against the auth server to obtain new access tokens; store securely (HttpOnly cookie or secure storage), **rotate on use** and detect reuse (revoke the family on replay).

### Q14. Where to store tokens in the browser
`HttpOnly; Secure; SameSite` cookies are best for web apps (not readable by XSS). `localStorage`/`sessionStorage` are readable by any injected script. Memory-only access tokens with refresh via cookie is a common compromise for SPAs. Mobile: Keychain/Keystore.

### Q15. HTTPS/TLS basics *(Must-know)*
TLS provides **encryption**, **integrity** and **server authentication** (certificates signed by a CA). Handshake: negotiate version/cipher, server cert verified, key exchange (ECDHE) yields session keys, then symmetric encryption (AES-GCM/ChaCha20). Enforce HTTPS, HSTS, TLS 1.2+ (prefer 1.3), disable old ciphers.

### Q16. OWASP Top 10 (2021) overview *(Must-know)*
A01 Broken Access Control • A02 Cryptographic Failures • A03 Injection • A04 Insecure Design • A05 Security Misconfiguration • A06 Vulnerable and Outdated Components • A07 Identification and Authentication Failures • A08 Software and Data Integrity Failures • A09 Security Logging and Monitoring Failures • A10 Server-Side Request Forgery (SSRF).

### Q17. SQL injection *(Must-know)*
Untrusted input changes the meaning of a SQL query.
```js
// VULNERABLE
db.query(`SELECT * FROM users WHERE email = '${email}'`);      // email = ' OR '1'='1
// SAFE: parameterized
db.query("SELECT * FROM users WHERE email = $1", [email]);
```
Defences: parameterized queries/ORMs, least-privilege DB accounts, input validation, allow-listing dynamic identifiers, WAF as a backstop (not a fix). See `026_SQL.md`.

### Q18. XSS (Cross-Site Scripting) *(Must-know)*
Attacker-controlled script runs in the victim's browser in your origin. Types: **stored**, **reflected**, **DOM-based**. Impact: steal sessions/tokens, act as the user, deface. Defences: contextual **output encoding**, avoid `innerHTML`/`dangerouslySetInnerHTML` with untrusted data, sanitize HTML (DOMPurify), **CSP**, `HttpOnly` cookies, framework auto-escaping (React escapes by default).
```js
element.textContent = userInput;          // safe
element.innerHTML = userInput;            // dangerous
```

### Q19. CSRF (Cross-Site Request Forgery) *(Must-know)*
A malicious site makes the victim's browser send an authenticated request (cookies attach automatically) to your site: `<form action="https://bank.com/transfer" method="POST">`. Defences: `SameSite=Lax/Strict` cookies, anti-CSRF tokens (synchronizer/double-submit), verify `Origin`/`Referer`, require custom headers for APIs, don't use GET for state changes. Token-in-header APIs (no cookies) aren't CSRF-prone.

### Q20. CORS is not security for your server
CORS controls which origins' JS can **read** responses in browsers. It doesn't stop `curl`, servers or CSRF-style simple requests from being sent. Don't use `*` with credentials; allow-list origins.

### Q21. Same-Origin Policy
Browsers isolate documents by **origin** (scheme + host + port); scripts from one origin can't read responses from another unless CORS permits. SOP underpins web security; many attacks (CSRF, XSS) work around its edges.

### Q22. Clickjacking
Attacker frames your site in an invisible iframe to trick clicks. Defend with `Content-Security-Policy: frame-ancestors 'none'` (or `'self'`) and legacy `X-Frame-Options: DENY`.

### Q23. Security headers checklist
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, cookie flags. In Express: `app.use(helmet())` (then tune CSP).

### Q24. Input validation vs output encoding
Validate input for **correctness** (type, length, format, allow-list); encode output for the **context** (HTML, attribute, JS, URL, SQL parameter). Validation alone doesn't prevent injection; encoding/parameterization does.

### Q25. Least privilege and defense in depth
Give users, services and processes only the access they need; layer controls (network, app, data, monitoring) so one failure isn't catastrophic. Applies to DB users, IAM roles, API scopes, container capabilities, file permissions.

### Q26. Broken Access Control / IDOR *(Must-know)*
Changing `/invoices/101` to `/invoices/102` shows another user's data. Fix: check ownership/tenant on every object access server-side, use indirect references where useful, deny by default, centralize authorization, test with two users.
```js
const invoice = await db.invoice.findFirst({ where: { id, userId: req.user.id } });   // scoped query
if (!invoice) return res.sendStatus(404);
```

### Q27. Rate limiting and brute-force protection
Throttle login attempts per account and IP (token bucket in Redis), progressive delays, CAPTCHA after failures, temporary lockouts (careful about DoS on accounts), alerts on credential stuffing patterns, MFA. Return generic errors ("Invalid credentials") to avoid user enumeration.

### Q28. Credential stuffing and password spraying
Attackers replay leaked username/password pairs (stuffing) or try a few common passwords across many accounts (spraying). Defences: MFA/passkeys, breached-password checks, rate limits, device/IP reputation, bot detection, anomaly alerts.

### Q29. Social login (OAuth/OIDC) in brief
"Sign in with Google/GitHub" delegates authentication to an identity provider. Benefits: no password storage, fewer breaches, faster signup. Risks: account-linking mistakes, trusting unverified emails, misconfigured redirect URIs. Details in Part 2.

### Q30. Secrets management basics
Never commit secrets to git; use environment variables or a secret manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler), rotate regularly, scope them narrowly, scan repos (gitleaks, trufflehog), and use different secrets per environment. If a secret leaks, **rotate it immediately** (deleting the commit isn't enough).

### Q31. Dependency vulnerabilities
Third-party packages are a major attack surface. Use `npm audit`, Dependabot/Renovate, lockfiles, pinned versions, SCA tools (Snyk, OSV-Scanner), review new dependencies, and remove unused ones. Know supply-chain attacks (typosquatting, malicious updates).

### Q32. Error handling and information leakage
Return generic messages to users; log details server-side with correlation IDs. Don't expose stack traces, SQL errors, internal paths, versions (`X-Powered-By`) or user existence ("email not found").

### Q33. Logging and monitoring basics
Log authentication events (success/failure), authorization failures, admin actions, input validation failures, rate-limit hits; never log passwords, tokens, full card numbers. Centralize logs, alert on anomalies, protect log integrity.

### Q34. Common attacker goals and basic threat actors
Steal data, take over accounts, gain persistence, disrupt services (DoS/ransomware), commit fraud. Actors: opportunistic bots, criminals, insiders, competitors, nation-states. Threat model against realistic actors.

### Q35. What is a firewall / WAF?
Network firewalls filter by IP/port/protocol; a **Web Application Firewall** inspects HTTP for attack patterns (SQLi, XSS) using rules (OWASP CRS). WAFs reduce noise and buy time but don't fix vulnerable code.

### Q36. Public key cryptography basics
Key pair: public key (shareable) and private key (secret). Uses: encryption (encrypt with public, decrypt with private), digital signatures (sign with private, verify with public), key exchange. Algorithms: RSA, ECDSA/ECDH (P-256, X25519), Ed25519.

### Q37. Symmetric encryption basics
One shared key encrypts and decrypts; fast. Use authenticated modes: **AES-256-GCM** or **ChaCha20-Poly1305** (provide confidentiality + integrity). Never use ECB; never reuse a (key, nonce) pair in GCM.
```js
import crypto from "node:crypto";
const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
const c = crypto.createCipheriv("aes-256-gcm", key, iv);
const enc = Buffer.concat([c.update("secret", "utf8"), c.final()]); const tag = c.getAuthTag();
```

### Q38. Random numbers for security
Use cryptographically secure generators (`crypto.randomBytes`, `crypto.randomUUID`, `crypto.getRandomValues`), never `Math.random()` for tokens, IDs, passwords or OTPs.

---

# 🔵 Part 2: Junior (1–3 years)

### Q39. OAuth 2.0 roles and flows *(Must-know)*
Roles: **Resource Owner** (user), **Client** (app), **Authorization Server** (issues tokens), **Resource Server** (API). Flows: **Authorization Code + PKCE** (web, SPA, mobile), **Client Credentials** (machine-to-machine), **Device Code** (TVs/CLIs), Refresh Token. **Implicit** and **Resource Owner Password** flows are discouraged/removed in OAuth 2.1.

### Q40. Authorization Code + PKCE step by step *(Must-know)*
1. Client creates random `code_verifier`, derives `code_challenge = BASE64URL(SHA256(verifier))`.
2. Redirect user to `/authorize?response_type=code&client_id=...&redirect_uri=...&scope=openid profile&state=...&code_challenge=...&code_challenge_method=S256`.
3. User authenticates and consents; IdP redirects back with `code` and `state`.
4. Client verifies `state`, then POSTs `code` + `code_verifier` to `/token`.
5. Receives access token (and ID token/refresh token).
PKCE prevents an intercepted code from being redeemed by an attacker; `state` prevents CSRF on the callback.

### Q41. OAuth 2.0 vs OpenID Connect *(Must-know)*
OAuth 2.0 = **authorization** (delegated access to APIs, access tokens). OIDC = identity layer on top: adds the **ID token** (JWT with `sub`, `email`, `nonce`), `UserInfo` endpoint, standard scopes (`openid`, `profile`, `email`), discovery (`/.well-known/openid-configuration`) and JWKS. "Login with Google" uses OIDC.

### Q42. Validating an ID token / access token
Verify signature using the IdP's JWKS (match `kid`, pin algorithm), then `iss` equals expected issuer, `aud` contains your client/API, `exp`/`nbf` valid with small clock skew, `nonce` matches (ID token), and scopes/permissions suffice. Cache JWKS but handle rotation.
```js
import { createRemoteJWKSet, jwtVerify } from "jose";
const JWKS = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"));
const { payload } = await jwtVerify(token, JWKS, { issuer: "https://idp.example.com/", audience: "my-api" });
```

### Q43. Redirect URI and `state` security
Register exact redirect URIs (no wildcards), enforce exact string matching, use `state` (and `nonce` for OIDC), and PKCE even for confidential clients. Open redirects and loose matching lead to token theft.

### Q44. Scopes, claims and permissions
**Scopes** describe what access a client requests (`read:orders`). **Claims** are attributes in tokens (`email`, `roles`). Permissions are what the API enforces. Don't treat scopes as user permissions: a token with `orders:write` doesn't mean the user may modify every order.

### Q45. JWT pitfalls *(Must-know)*
- `alg: none` or algorithm confusion (RS256 key used as HS256 secret): **pin allowed algorithms**.
- Weak HS256 secrets: use ≥ 256-bit random keys.
- Missing `exp`, `aud`, `iss` validation.
- Sensitive data in payload.
- No revocation story: short TTL + refresh rotation + deny-lists for critical events.
- Using JWT for sessions when server sessions would be simpler.
- Key rotation without `kid`.

### Q46. Sessions vs JWT: decision guide
Browser web apps with one backend: server sessions in cookies (simple revocation). Multiple services/mobile/third-party APIs: JWT access tokens from an IdP. Often hybrid: backend-for-frontend holds tokens server-side and gives the browser a session cookie. "JWTs for sessions" is not automatically better.

### Q47. MFA methods and strength
SMS OTP (weak: SIM swap, phishing), email OTP (weak-ish), **TOTP** (RFC 6238; authenticator apps), push approvals (beware MFA fatigue; use number matching), **FIDO2/WebAuthn security keys and passkeys** (phishing-resistant, strongest). Provide recovery codes and secure recovery flows.

### Q48. TOTP implementation
Shared secret (base32) + time step (30 s) → HMAC-SHA1 → 6-digit code. Store the secret encrypted, allow ±1 step drift, rate limit attempts, prevent code reuse within the window.
```js
import { authenticator } from "otplib";
const secret = authenticator.generateSecret();
const uri = authenticator.keyuri("ritesh@example.com", "MyApp", secret);   // QR code
const valid = authenticator.verify({ token: "123456", secret });
```

### Q49. Passkeys and WebAuthn *(Must-know)*
Public-key credentials bound to an origin: the device generates a key pair per site; the server stores the public key. Login = signing a server challenge, unlocked by biometrics/PIN. Benefits: **phishing-resistant**, no shared secrets, no password reuse. Registration: `navigator.credentials.create()`; authentication: `navigator.credentials.get()`; verify on the server (SimpleWebAuthn). Synced passkeys (iCloud, Google) improve usability; support fallbacks and recovery.

### Q50. SSO and SAML vs OIDC
**SSO** lets users authenticate once for multiple apps. **SAML 2.0**: XML-based, enterprise IdPs (Okta, Azure AD, ADFS), browser POST bindings, signed assertions. **OIDC**: JSON/JWT, modern, mobile friendly. Pitfalls in SAML: XML signature wrapping, unvalidated assertions; use maintained libraries.

### Q51. Identity providers and build vs buy
Managed (Auth0, Okta, Clerk, Firebase Auth, Supabase Auth, AWS Cognito, Keycloak self-hosted, Ory, WorkOS) reduce risk and time; building auth yourself needs deep expertise (password reset, MFA, rate limits, breach monitoring). Choose by compliance, cost at scale, customization and lock-in. See `034_Firebase-and-Supabase.md`.

### Q52. Password reset flow (secure)
1. User submits email; always respond "If the account exists, we've sent a link" (no enumeration).
2. Generate a random single-use token (≥ 128 bits), store only its **hash** with short expiry (15-60 min).
3. Email link with token; on submit verify hash, expiry, single use.
4. Enforce password rules, invalidate other sessions, notify the user, require MFA if enabled.
Never email passwords; don't use predictable tokens.

### Q53. Email verification and account takeover via unverified email
Don't auto-link social accounts to existing accounts by email unless the provider guarantees `email_verified` and you also verify ownership. Pre-account-takeover attacks exploit unverified emails and account linking.

### Q54. User enumeration
Differences in messages, status codes or timing reveal whether an account exists (login, signup, reset). Return uniform responses and make timing similar (hash a dummy password when the user isn't found).

### Q55. Timing attacks and constant-time comparison
Comparing secrets with `===` leaks timing. Use `crypto.timingSafeEqual` for HMACs, tokens, API keys.
```js
const a = Buffer.from(sigA), b = Buffer.from(sigB);
const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
```

### Q56. HMAC and message authentication
`HMAC(key, message)` provides integrity + authenticity with a shared secret; used for webhook signatures, signed cookies, API request signing. Use SHA-256 or stronger and compare in constant time; include timestamps/nonces to block replay.

### Q57. Digital signatures and certificates
Signatures (RSA-PSS, ECDSA, Ed25519) prove origin and integrity. **X.509 certificates** bind a public key to an identity, signed by a CA; chain of trust to root CAs; check hostname, expiry, revocation (OCSP/CRL), and use Certificate Transparency. Automate renewals (Let's Encrypt/ACME).

### Q58. Secure cookie attributes in depth
`Secure` (HTTPS only), `HttpOnly`, `SameSite=Strict|Lax|None` (`None` requires `Secure`), `Domain` (omit for host-only), `Path`, `Max-Age/Expires`, `__Host-` prefix (requires Secure, Path=/, no Domain), `Partitioned` (CHIPS) for third-party contexts. Choose `Lax` for general apps, `Strict` for sensitive actions.

### Q59. Content Security Policy (CSP) *(Must-know)*
A response header controlling which sources the browser may load/execute from.
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:; connect-src 'self' https://api.example.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
```
Prefer **nonces/hashes** over `unsafe-inline`; use `strict-dynamic`; start with `Content-Security-Policy-Report-Only` and a reporting endpoint. CSP is defense in depth against XSS, not a replacement for encoding.

### Q60. SSRF *(Must-know)*
The server fetches an attacker-chosen URL (webhook/image import), reaching internal services or cloud metadata (`http://169.254.169.254/`). Defences: allow-list domains, resolve DNS and block private/link-local/loopback ranges (re-check after redirects), disable redirects or revalidate, use IMDSv2/hop-limit 1 on AWS, egress proxy, network segmentation, short timeouts/size limits.

### Q61. Path traversal and file upload risks
`../../etc/passwd` via filenames. Normalize and resolve paths, confine to a base directory, never use user input in file paths directly, generate server-side filenames. Uploads: validate type by content (magic bytes), size limits, store outside web root/in object storage, serve with `Content-Disposition` and correct `Content-Type`, scan malware, never execute uploads.

### Q62. Command injection
Passing user input to shells (`exec("convert " + file)`) allows `; rm -rf`. Use `execFile`/`spawn` with argument arrays, avoid shells, validate allow-lists, prefer libraries over shelling out.

### Q63. NoSQL injection
JSON operators in query objects: `{ "email": { "$ne": null }, "password": { "$ne": null } }` bypasses login. Validate types (strings only), use schema validation (Zod/Mongoose strict), sanitize `$`-prefixed keys. See `030_MongoDB.md`.

### Q64. XXE and insecure deserialization
**XXE:** XML parsers resolving external entities read files/SSRF; disable DTDs/external entities. **Insecure deserialization:** untrusted serialized objects (Java, PHP, Python pickle, `node-serialize`) can execute code; use data-only formats (JSON) with schema validation and avoid deserializing untrusted native objects.

### Q65. Prototype pollution (JavaScript)
Merging untrusted objects can set `__proto__`/`constructor.prototype` properties affecting all objects, leading to auth bypass or RCE gadgets. Use `Object.create(null)`, schema validation, safe merge libraries, `--disable-proto=delete`, freeze prototypes, and update vulnerable packages (lodash older versions).

### Q66. ReDoS and resource exhaustion
Catastrophic regex backtracking blocks the event loop. Avoid nested quantifiers on untrusted input, use linear-time engines (RE2), input length limits, timeouts. Also limit body sizes, JSON depth, upload size, query complexity, and concurrency.

### Q67. Open redirects
`/login?next=https://evil.com` after login redirects users to attackers. Allow only relative paths or an allow-list of hosts; validate parsed URLs, not substrings.

### Q68. Mass assignment
Binding request bodies directly to models lets attackers set `isAdmin`. Use DTOs/allow-lists (Zod `.strict()`, class-transformer `excludeExtraneousValues`).

### Q69. Subresource Integrity (SRI) and third-party scripts
`<script src="https://cdn.example/lib.js" integrity="sha384-..." crossorigin="anonymous">` ensures the CDN file matches the expected hash. Minimize third-party scripts (Magecart-style skimming), use CSP and iframes with `sandbox`.

### Q70. API keys: design and storage
Generate with a CSPRNG, show once, store only a **hash** (plus a prefix/ID for lookup), scope permissions, support rotation and revocation, send via header (not URL), monitor usage. Don't embed secret keys in mobile/browser apps.

### Q71. Basic container and server hardening
Run as non-root, minimal base images, read-only filesystem, drop capabilities, patch regularly, disable unused services, SSH keys only (no passwords), firewall default-deny, separate secrets from images, scan images (Trivy, Grype). See `024_Linux-and-Networking.md`.

### Q72. HTTPS everywhere: practical setup
Terminate TLS at a load balancer or reverse proxy (Nginx, Caddy, cloud LB), automate certificates, redirect 80→443, HSTS with preload when ready, secure cookies, modern ciphers (Mozilla SSL config generator), test with SSL Labs/`testssl.sh`.

### Q73. Audit logging for security events
Record who/what/when/where for logins, MFA changes, password resets, role changes, data exports, admin actions, token creation/revocation, failed authorizations. Use append-only/immutable storage, time sync, and alerts for suspicious patterns.

### Q74. Basic secure SDLC
Threat model early, secure coding standards, code review with security checklist, SAST/DAST/SCA in CI, secrets scanning, dependency updates, pen tests, bug bounty/VDP, incident response plan, security training.

### Q75. Responsible disclosure and CVEs
Report vulnerabilities privately to maintainers (security.txt, SECURITY.md); CVE identifies public vulnerabilities, CVSS scores severity (not exploitability in your context). Triage by exposure, exploitability and asset value.

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. Authorization models: RBAC, ABAC, ReBAC *(Must-know)*
| Model | Idea | Pros | Cons |
|---|---|---|---|
| **RBAC** | Users → roles → permissions | Simple, auditable | Role explosion, coarse |
| **ABAC** | Policy over attributes of subject/resource/environment | Flexible, contextual | Complex to reason about |
| **ReBAC** | Access via relationships (owner, member of team, folder parent) | Natural for sharing (Google Drive) | Needs graph engine (Zanzibar, OpenFGA, SpiceDB) |
| **ACL** | Per-resource lists | Fine-grained | Hard to manage at scale |
Combine: RBAC for coarse capabilities + ownership/tenant checks + ABAC for conditions.

### Q77. Where to enforce authorization
Enforce on the server in a **central policy layer** (middleware + service-level checks + data-layer scoping/RLS), not in UI alone. Deny by default. Check at the object level (BOLA), property level (which fields), and function level (admin endpoints).
```js
const can = (user, action, resource) => policy.evaluate({ user, action, resource });
app.put("/projects/:id", async (req, res) => {
  const project = await db.project.findUnique({ where: { id: req.params.id } });
  if (!project || !can(req.user, "project:update", project)) return res.sendStatus(404);
  ...
});
```

### Q78. Policy engines: OPA, Cedar, Casbin, OpenFGA
Externalize authorization as code: **OPA/Rego**, **AWS Cedar**, **Casbin**, **Oso**, **OpenFGA/SpiceDB** (Zanzibar-style relationship checks). Benefits: consistent, testable, auditable policies; cost: latency/ops and policy-governance overhead.

### Q79. Multi-tenancy security
Tenant isolation must hold in data, cache keys, queues, files, logs and background jobs: row-level security or per-tenant schemas/DBs, tenant id derived from authenticated context (never trusted from request), composite uniques with tenant id, per-tenant encryption keys for high-sensitivity data, tests for cross-tenant access.

### Q80. Token revocation and logout
JWTs can't be revoked individually without state. Strategies: short TTL + refresh rotation, server-side deny-list for `jti` (Redis with TTL), session versioning (`tokenVersion` in user row checked on refresh or sensitive actions), OAuth token introspection/revocation endpoints (RFC 7662/7009), back-channel logout for SSO.

### Q81. Refresh token rotation with reuse detection
Each refresh issues a new refresh token and invalidates the old; if an old token is presented again (theft indicator) revoke the entire token family and force re-login. Store hashed refresh tokens with device metadata.

### Q82. Securing SPAs and BFF pattern
SPAs can't keep client secrets. Preferred: **Backend-for-Frontend** performs the OAuth flow, stores tokens server-side, and gives the browser an HttpOnly session cookie; API calls go through the BFF. Alternatives: Authorization Code + PKCE with in-memory tokens and silent refresh via cookie.

### Q83. Service-to-service authentication
mTLS (SPIFFE/SPIRE, service mesh), OAuth2 Client Credentials with short-lived JWTs, cloud workload identity (IAM roles, IRSA, GCP Workload Identity), signed requests (AWS SigV4). Avoid long-lived shared API keys; scope tokens to audience and least privilege.

### Q84. Encryption at rest and in transit
In transit: TLS everywhere (including internal traffic). At rest: disk/volume encryption (LUKS, EBS/KMS), database TDE, object storage SSE, application-level/field encryption for sensitive fields (PII, secrets) with envelope encryption. Key management is the hard part.

### Q85. Envelope encryption and KMS
Encrypt data with a random **data key (DEK)**; encrypt the DEK with a **key-encryption key (KEK)** held in KMS/HSM (AWS KMS, GCP KMS, Azure Key Vault). Store the encrypted DEK next to data; rotating the KEK re-wraps DEKs only. Provides auditing, access control and rotation.

### Q86. Key management lifecycle
Generate with a CSPRNG, store in HSM/KMS, restrict access (IAM), rotate periodically and on compromise, version keys (`kid`), separate duties, back up securely, destroy when retired, and monitor usage. Never hard-code keys.

### Q87. Hashing in other contexts
Integrity checks: SHA-256/SHA-3/BLAKE3. Deduplication/fingerprints: SHA-256. Password storage: Argon2id/bcrypt. API key storage: SHA-256 (high-entropy secrets don't need slow hashes). Avoid MD5/SHA-1 for security (collisions).

### Q88. Cryptography mistakes to avoid
Rolling your own crypto, ECB mode, reusing nonces, unauthenticated encryption (CBC without MAC), static IVs, weak RNG, hard-coded keys, RSA PKCS#1 v1.5 encryption, comparing MACs with `==`, small RSA keys (< 2048), disabled certificate validation (`rejectUnauthorized: false`).

### Q89. CSRF defences in depth
`SameSite=Lax` default, anti-CSRF tokens per session, verify `Origin`/`Sec-Fetch-Site`, custom headers for XHR, double-submit cookie (signed), re-auth for sensitive actions, don't allow state-changing GET. Framework middleware (`csrf-csrf`, Next.js server actions with origin checks).

### Q90. XSS defences in React/Next.js
React escapes interpolated values; risks: `dangerouslySetInnerHTML`, `href="javascript:..."`, unsanitized markdown/HTML, third-party scripts, SSR template injection, `eval`/`new Function`. Use DOMPurify, validate URLs (`http/https` only), CSP with nonces, `trusted-types`, and avoid storing tokens in localStorage.

### Q91. CSP deployment strategy
Start in report-only, inventory sources, eliminate inline scripts, use nonces via middleware, add `strict-dynamic`, `base-uri 'self'`, `object-src 'none'`, `frame-ancestors`, set up reporting (`report-to`) and monitor violations before enforcing.

### Q92. Rate limiting and bot defence architecture
Edge (CDN/WAF) rules, per-IP and per-account limits, Redis token buckets, device fingerprint/risk scoring, CAPTCHA/Turnstile on risky flows, honeypots, proof-of-work, anomaly detection, IP reputation. Protect login, signup, password reset, OTP, search and checkout.

### Q93. Account recovery and takeover prevention
Recovery is the weakest link: verify via multiple signals, notify old email/phone, add delays for high-risk changes, require re-auth for email/phone/password changes, invalidate sessions, monitor impossible travel, support recovery codes and passkeys. Avoid security questions.

### Q94. OAuth misconfiguration vulnerabilities
Open redirect URIs, missing `state`/PKCE, implicit flow leakage, token leakage in URLs/Referer, accepting tokens for wrong audience, confused deputy, insecure "login CSRF", over-broad scopes, leaked client secrets in SPAs/mobile. Use security BCP (RFC 9700) guidance.

### Q95. API security specifics: BOLA, BFLA, excessive data exposure
Use per-object checks, function-level role checks, response DTOs/field-level authorization, avoid sequential IDs where enumeration matters (use UUIDs and authorization), limit resource consumption, inventory APIs (shadow/zombie endpoints), validate third-party API responses.

### Q96. GraphQL-specific security
Disable introspection/field suggestions in public production if appropriate, depth/cost limits, persisted queries, per-field authz, batching/alias abuse limits, error masking, CSRF on GET/multipart, subscription auth on connection init. See `035_GraphQL-and-REST-APIs.md`.

### Q97. Secure file handling in cloud
Pre-signed URLs with short expiry and constrained content-type/size, private buckets by default, block public ACLs, object ownership controls, virus scanning, separate domains for user-uploaded content (avoid same-origin XSS), CORS locked down.

### Q98. Security testing types
**SAST** (static code analysis: Semgrep, CodeQL), **DAST** (running app scanning: ZAP, Burp), **IAST**, **SCA** (dependencies), secrets scanning, IaC scanning (Checkov, tfsec), container scanning, fuzzing, penetration testing, red teaming. Integrate early in CI; triage findings by risk to avoid alert fatigue.

### Q99. Threat modelling with STRIDE
Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Process: diagram the system (data flow diagram) → identify trust boundaries → enumerate threats per element → rate risk (DREAD/CVSS/likelihood×impact) → choose mitigations → track as work items. Do it per feature, not once.

### Q100. Common web attack chain example
Reflected XSS → steal non-HttpOnly cookie → session hijack → access admin endpoint with missing function-level check → export data via IDOR. Illustrates why layered defences matter.

### Q101. Cookies vs headers for auth, and CORS credentials
Cookie-based auth needs `credentials: "include"`, CORS with a specific origin and `Access-Control-Allow-Credentials: true`, and CSRF protection. Header-based bearer tokens avoid CSRF but need XSS-safe storage.

### Q102. Dependency and supply-chain controls
Lockfiles, `npm ci`, integrity hashes, provenance (npm provenance, SLSA), SBOMs (CycloneDX/SPDX), private registries/allow-lists, `ignore-scripts` for untrusted installs, review install scripts, 2FA on registry accounts, pin GitHub Actions by commit SHA, least-privilege CI tokens.

### Q103. CI/CD security
Protect main with reviews, signed commits/tags, ephemeral runners, OIDC federation to cloud (no long-lived cloud keys), secret masking, separate build/deploy permissions, artifact signing (cosign), policy gates (OPA/Kyverno), and audit pipelines. Pipelines are high-value targets.

### Q104. Logging security events with SIEM
Ship auth, access, WAF, cloud audit (CloudTrail), and app logs into a SIEM (Splunk, Elastic Security, Sentinel). Create detections (impossible travel, brute force, privilege escalation, mass downloads), runbooks, and alert routing. Tune to reduce false positives.

### Q105. Data protection and privacy basics (GDPR/DPDP)
Collect minimum data, state purposes, obtain consent where required, enable access/erasure/export, encrypt, set retention, DPIAs for risky processing, breach notification timelines (GDPR 72 hours), vendor DPAs, and India's DPDP Act obligations (verify current rules).

### Q106. PCI DSS, SOC 2, ISO 27001, HIPAA (awareness)
PCI DSS: cardholder data; use hosted fields/tokenization (Stripe) to reduce scope. SOC 2: trust-service criteria audit (security, availability, confidentiality...). ISO 27001: ISMS certification. HIPAA: US health data safeguards. Know when each applies and avoid storing sensitive data you don't need.

---

# 🟠 Part 4: Senior (5–7 years)

### Q107. Designing an authentication system from scratch *(Must-know)*
1. **Decide build vs buy** (default: buy/managed or Keycloak/Ory for core IdP).
2. **Identifiers & credentials:** email/phone + passkeys first, passwords (Argon2id) as fallback, TOTP/WebAuthn MFA.
3. **Sessions:** server-side session cookies (BFF) or short-lived JWT + rotating refresh tokens.
4. **Flows:** signup, verify email, login, MFA, reset, recovery, device management, logout-all.
5. **Abuse controls:** rate limits, CAPTCHA, breach checks, risk-based step-up.
6. **Observability:** audit logs, alerts, dashboards.
7. **Compliance:** data retention, deletion, consent.
8. **Testing:** threat model, security tests, pen test.

### Q108. Token architecture for microservices
Edge/gateway authenticates the user and mints an **internal short-lived JWT** (or uses token exchange, RFC 8693) with audience per service; services verify locally via JWKS; propagate user context and a correlation id; service identity separate from user identity (mTLS/workload identity). Avoid passing the original external token deep into the mesh without audience restrictions.

### Q109. Zero Trust architecture
"Never trust, always verify": authenticate and authorize every request regardless of network location; strong identity for users/devices/workloads; least privilege with just-in-time access; micro-segmentation; continuous evaluation (posture, risk); encrypt all traffic; log everything. Implementation: identity-aware proxies (BeyondCorp), mTLS service mesh, device attestation.

### Q110. mTLS and service mesh
Mutual TLS authenticates both client and server with certificates. In Kubernetes, meshes (Istio, Linkerd) issue workload certificates (SPIFFE IDs), rotate them automatically, and enforce authorization policies (which service may call which). Operational costs: certificate lifecycle, debugging, sidecar overhead.

### Q111. Secrets management at scale
Central vault (HashiCorp Vault, cloud secret managers) with dynamic secrets (short-lived DB credentials), per-service identities, access policies, audit logs, automatic rotation, envelope encryption, no secrets in images/env dumps/logs, CSI drivers/sidecars injecting at runtime, break-glass procedures, leak response playbook.

### Q112. Handling a leaked secret (incident steps)
1. Revoke/rotate immediately. 2. Identify exposure window and usage (cloud logs). 3. Search for lateral misuse. 4. Remove from code/history (secondary to rotation). 5. Add secret scanning/pre-commit hooks. 6. Post-incident review and fix root cause (why was it in code?).

### Q113. Advanced OAuth/OIDC topics
Token exchange, DPoP (sender-constrained tokens, RFC 9449), mTLS-bound tokens, PAR (Pushed Authorization Requests), JAR/JARM, rich authorization requests (RAR), back-channel and front-channel logout, session management, refresh token binding. Used in financial-grade APIs (FAPI).

### Q114. Securing mobile apps
Use Authorization Code + PKCE with system browser (ASWebAuthenticationSession / Custom Tabs), store tokens in Keychain/Keystore, certificate pinning (carefully), jailbreak/root detection (limited), no secrets in the binary, App Attest/Play Integrity, obfuscation as deterrent only, secure deep links (verified App Links/Universal Links).

### Q115. Browser security features: COOP/COEP/CORP, Fetch Metadata, Trusted Types
`Sec-Fetch-Site/Mode/Dest` headers let servers reject cross-site requests (resource isolation policy). COOP/COEP enable cross-origin isolation (needed for SharedArrayBuffer) and mitigate Spectre-class leaks. Trusted Types block DOM XSS sinks. `Clear-Site-Data` on logout, `Permissions-Policy` to disable powerful features.

### Q116. Defending against account takeover at scale
Risk-based authentication (new device/location/velocity), device binding, passkeys, credential stuffing detection (shared breach intel), step-up for sensitive actions, session anomaly detection, user notifications, rapid revoke tooling, support-process hardening (social engineering).

### Q117. Application-level encryption and tokenization
Encrypt sensitive fields before storing (PII, health, secrets) with per-tenant/field keys; use deterministic encryption or blind indexes for equality search (trade-off: pattern leakage); tokenization replaces card numbers with vault tokens. Plan key rotation and re-encryption jobs; search/index implications.

### Q118. Database security
Least-privilege roles (separate migration/app/read-only), network isolation, TLS, row-level security, parameterized queries, audit logs, encrypted backups, restricted superuser, secret rotation, data masking in non-prod, avoid prod data in dev. See `028_PostgreSQL.md`.

### Q119. Cloud security fundamentals (IAM)
Least-privilege IAM, no long-lived keys (use roles/OIDC), MFA on root/admins, separate accounts/projects per environment, deny-by-default security groups, private subnets, KMS-encrypted storage, CloudTrail/Audit Logs, block public S3, IMDSv2, guardrails (SCPs/org policies), CSPM scanning. Misconfiguration is the top cloud risk.

### Q120. Kubernetes security
RBAC least privilege, Pod Security Standards (restricted), network policies, secrets encryption at rest (KMS) and external secret stores, image signing/admission control (Kyverno/OPA), non-root read-only containers, resource limits, runtime detection (Falco), API server protection, regular patching.

### Q121. Security of event-driven systems
Authenticate producers/consumers, authorize topics, validate message schemas, sign events if integrity matters, protect against replay (nonce/timestamp/idempotency), encrypt sensitive payloads, secure DLQs (they hold sensitive data), monitor consumer lag for anomalies.

### Q122. Vulnerability management program
Asset inventory → scanning (SCA, container, infra, DAST) → triage using CVSS + exploitability (EPSS, KEV catalog) + exposure → SLAs by severity → patching/mitigations → verification → metrics (MTTR, backlog age). Avoid "scan and forget".

### Q123. Secure code review checklist
Authn/authz on every endpoint, object-level checks, input validation, output encoding, parameterized queries, secrets handling, error leakage, logging of sensitive data, crypto usage, dependency changes, CSRF/CORS config, file handling, SSRF risks, race conditions (TOCTOU), rate limiting, tests for negative cases.

### Q124. Race conditions and business-logic flaws
Double-spend on coupons/credits, parallel requests bypassing limits, TOCTOU in checks. Use atomic DB operations (`UPDATE ... WHERE balance >= x`), unique constraints, transactions with proper isolation, idempotency keys, locks. Test with concurrent requests.

### Q125. Denial of service resilience
Layered: CDN/WAF/DDoS protection (Cloudflare, Shield), rate limits, connection/body/time limits, autoscaling with caps, circuit breakers, queue buffering, caching, graceful degradation, expensive-operation quotas, and runbooks. Application-layer DoS (regex, GraphQL depth, ZIP bombs) is as relevant as volumetric.

### Q126. Incident response lifecycle *(Must-know)*
**Prepare → Detect/Analyze → Contain → Eradicate → Recover → Post-incident review** (NIST SP 800-61). Define roles (incident commander, comms, forensics), runbooks, evidence preservation, legal/regulatory notification, customer communication, and blameless retrospectives with tracked actions.

### Q127. Security metrics that matter
MFA/passkey adoption, MTTR for critical vulns, % services with SAST/SCA, secret-scan findings time-to-rotate, phishing-report rate, auth failure/anomaly rates, patch latency, coverage of threat models, incident frequency/impact. Use metrics to drive investment, not vanity.

### Q128. Security trade-offs with usability
Excessive friction drives workarounds (password reuse, shadow IT). Use risk-based prompts, passkeys, SSO, good recovery paths, clear errors (without leaking), and measure drop-off. Security must be the easy path.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q129. Building a security program for an engineering org
Set a risk-based strategy: asset inventory, threat modelling, secure-by-default platform (paved roads: auth libraries, secret management, hardened base images), guardrails in CI/CD, security champions, training, incident readiness, vendor risk, compliance mapping, metrics and executive reporting. Prioritize by business risk, not fear.

### Q130. Platform-level identity strategy
Single enterprise IdP (OIDC/SAML) for workforce SSO + MFA/passkeys; CIAM platform for customers; workload identity for services; unified authorization strategy (central policy language or standard libraries); lifecycle automation (SCIM provisioning/deprovisioning); audit; break-glass accounts; periodic access reviews.

### Q131. Designing authorization for a large SaaS
Model resources and relationships; choose ReBAC (OpenFGA/SpiceDB) or policy engine for fine-grained sharing; keep a stable permission vocabulary; cache decisions safely with invalidation; propagate tenant context; provide admin/audit tools ("who can access X?"); test with property-based/policy simulations; consider latency budgets (<10 ms).

### Q132. Data classification and protection strategy
Classify (public, internal, confidential, restricted), map data flows, apply controls per class (encryption, access, retention, masking, DLP), minimize collection, segregate environments, govern analytics/AI use of data, and automate discovery (data catalogs).

### Q133. Secure-by-design architecture principles
Least privilege, defense in depth, fail securely, secure defaults, minimize attack surface, separation of duties, complete mediation, economy of mechanism, open design, psychological acceptability (Saltzer & Schroeder), plus threat modelling and abuse-case thinking in design reviews.

### Q134. Compliance as code
Translate controls (SOC 2/ISO/PCI) into automated checks: IaC policies (OPA/Checkov), CSPM, config baselines, evidence collection (audit logs, tickets), continuous controls monitoring. Reduces audit toil and drift.

### Q135. Vendor and third-party risk
Security questionnaires, SOC 2 reports, pen-test summaries, data-processing agreements, least-privilege integrations (scoped OAuth), isolation (separate accounts/tenants), monitoring of vendor access, exit plans, concentration risk. Treat SaaS integrations and plugins as part of your attack surface.

### Q136. Resilience: ransomware and backup strategy
Immutable/offline backups (3-2-1-1-0), tested restores, segmentation to limit blast radius, EDR, least privilege and MFA on backup systems, patching, email security, recovery runbooks, tabletop exercises. Backups on the same credentials as production are not protection.

### Q137. Securing AI/LLM applications
Prompt injection (direct/indirect), data leakage via context, insecure tool/function execution, over-privileged agents, training-data poisoning, model abuse, cost DoS. Controls: treat model output as untrusted, least-privilege tool tokens, human approval for destructive actions, output validation, content filters, rate/budget limits, tenant isolation in retrieval (RLS), logging, red-team evals (OWASP Top 10 for LLM Apps).

### Q138. Post-quantum readiness
Harvest-now-decrypt-later threatens long-lived confidentiality. Inventory cryptography, adopt crypto-agility, follow NIST PQC standards (ML-KEM/Kyber, ML-DSA/Dilithium, SLH-DSA), hybrid key exchange in TLS (X25519+ML-KEM) is rolling out (verify support), plan migration for long-lived secrets and signatures.

### Q139. Balancing security, speed and cost
Use risk quantification (likelihood × impact), invest in automation and paved roads that make secure choices cheap, accept residual risk explicitly with owners, tier controls by asset criticality, and avoid heavyweight processes for low-risk changes.

### Q140. Communicating security to executives and teams
Translate to business impact (revenue, trust, regulatory), show trends and benchmarks, propose options with costs, celebrate fixes, keep post-incident reviews blameless, and make security a shared responsibility with clear ownership.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Secure registration and login (Express + Argon2 + sessions)
```js
import express from "express";
import argon2 from "argon2";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const Creds = z.object({ email: z.string().email().max(254), password: z.string().min(10).max(128) }).strict();
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: "draft-7", keyGenerator: (req) => `${req.ip}:${req.body?.email ?? ""}` });
const DUMMY_HASH = await argon2.hash("dummy-password-for-timing");

app.post("/register", async (req, res) => {
  const p = Creds.safeParse(req.body);
  if (!p.success) return res.status(422).json({ error: "Invalid input" });
  if (await isBreachedPassword(p.data.password)) return res.status(422).json({ error: "Password found in a data breach" });
  try {
    const hash = await argon2.hash(p.data.password, { type: argon2.argon2id });
    await db.user.create({ data: { email: p.data.email.toLowerCase(), passwordHash: hash } });
  } catch (e) { /* ignore duplicate email: respond the same */ }
  res.status(202).json({ message: "If this email can be registered, you will receive a verification link." });
});

app.post("/login", loginLimiter, async (req, res) => {
  const p = Creds.safeParse(req.body);
  if (!p.success) return res.status(401).json({ error: "Invalid credentials" });
  const user = await db.user.findUnique({ where: { email: p.data.email.toLowerCase() } });
  const ok = await argon2.verify(user?.passwordHash ?? DUMMY_HASH, p.data.password);   // equalize timing
  if (!user || !ok || !user.emailVerified) return res.status(401).json({ error: "Invalid credentials" });
  req.session.regenerate(() => { req.session.userId = user.id; res.json({ ok: true }); });
});
```

### H2. JWT access + rotating refresh token (with reuse detection)
```js
import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const key = new TextEncoder().encode(process.env.JWT_SECRET);

async function issueTokens(user, familyId = crypto.randomUUID()) {
  const access = await new SignJWT({ role: user.role }).setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id)).setIssuer("api").setAudience("web").setExpirationTime("10m").sign(key);
  const refresh = crypto.randomBytes(48).toString("base64url");
  await db.refreshToken.create({ data: { userId: user.id, familyId, tokenHash: sha256(refresh), expiresAt: new Date(Date.now() + 30 * 864e5) } });
  return { access, refresh };
}
app.post("/auth/refresh", async (req, res) => {
  const token = req.cookies["__Host-rt"];
  const rec = token && await db.refreshToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!rec || rec.expiresAt < new Date()) return res.sendStatus(401);
  if (rec.usedAt) { await db.refreshToken.updateMany({ where: { familyId: rec.familyId }, data: { revokedAt: new Date() } }); return res.sendStatus(401); }   // reuse → revoke family
  await db.refreshToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
  const user = await db.user.findUnique({ where: { id: rec.userId } });
  const { access, refresh } = await issueTokens(user, rec.familyId);
  res.cookie("__Host-rt", refresh, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 30 * 864e5 }).json({ access });
});
```

### H3. Helmet + CSP with nonce + CSRF protection
```js
import helmet from "helmet";
import crypto from "node:crypto";
app.use((req, res, next) => { res.locals.nonce = crypto.randomBytes(16).toString("base64"); next(); });
app.use(helmet({
  contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, "'strict-dynamic'"],
    objectSrc: ["'none'"], baseUri: ["'self'"], frameAncestors: ["'none'"], formAction: ["'self'"],
  } },
  strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
// CSRF for cookie sessions: SameSite=Lax cookies + token check
import { doubleCsrf } from "csrf-csrf";
const { doubleCsrfProtection, generateToken } = doubleCsrf({ getSecret: () => process.env.CSRF_SECRET, cookieName: "__Host-csrf", cookieOptions: { sameSite: "lax", secure: true } });
app.use(doubleCsrfProtection);
```

### H4. TOTP MFA enrollment and verification
```js
import { authenticator } from "otplib";
import QRCode from "qrcode";
app.post("/mfa/setup", requireAuth, async (req, res) => {
  const secret = authenticator.generateSecret();
  await db.mfa.upsert({ where: { userId: req.user.id }, update: { pendingSecret: encrypt(secret) }, create: { userId: req.user.id, pendingSecret: encrypt(secret) } });
  res.json({ qr: await QRCode.toDataURL(authenticator.keyuri(req.user.email, "MyApp", secret)) });
});
app.post("/mfa/verify", requireAuth, mfaLimiter, async (req, res) => {
  const rec = await db.mfa.findUnique({ where: { userId: req.user.id } });
  const secret = decrypt(rec.pendingSecret ?? rec.secret);
  authenticator.options = { window: 1 };
  if (!authenticator.verify({ token: String(req.body.code), secret })) return res.status(401).json({ error: "Invalid code" });
  if (rec.lastUsedStep === currentStep()) return res.status(401).json({ error: "Code already used" });   // replay protection
  await db.mfa.update({ where: { userId: req.user.id }, data: { secret: encrypt(secret), pendingSecret: null, lastUsedStep: currentStep() } });
  res.json({ ok: true, recoveryCodes: await generateRecoveryCodes(req.user.id) });
});
```

### H5. WebAuthn (passkeys) with SimpleWebAuthn (outline)
```js
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
const rp = { name: "MyApp", id: "example.com", origin: "https://example.com" };

app.post("/webauthn/register/options", requireAuth, async (req, res) => {
  const options = await generateRegistrationOptions({ rpName: rp.name, rpID: rp.id, userName: req.user.email, attestationType: "none",
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" } });
  req.session.challenge = options.challenge;
  res.json(options);
});
app.post("/webauthn/register/verify", requireAuth, async (req, res) => {
  const v = await verifyRegistrationResponse({ response: req.body, expectedChallenge: req.session.challenge, expectedOrigin: rp.origin, expectedRPID: rp.id });
  if (!v.verified) return res.sendStatus(400);
  await db.passkey.create({ data: { userId: req.user.id, credentialId: v.registrationInfo.credential.id, publicKey: Buffer.from(v.registrationInfo.credential.publicKey), counter: v.registrationInfo.credential.counter } });
  res.json({ ok: true });
});
```
(Option shapes vary between library versions; verify against the current SimpleWebAuthn docs.)

### H6. OAuth2 Authorization Code + PKCE in a BFF (Express)
```js
app.get("/auth/login", (req, res) => {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("base64url");
  req.session.oauth = { verifier, state };
  res.redirect(`${ISSUER}/authorize?` + new URLSearchParams({ response_type: "code", client_id: CLIENT_ID, redirect_uri: REDIRECT,
    scope: "openid profile email", state, code_challenge: challenge, code_challenge_method: "S256" }));
});
app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauth?.state) return res.sendStatus(400);
  const r = await fetch(`${ISSUER}/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code_verifier: req.session.oauth.verifier }) });
  const tokens = await r.json();
  const { payload } = await jwtVerify(tokens.id_token, JWKS, { issuer: ISSUER, audience: CLIENT_ID });
  req.session.regenerate(() => { req.session.user = { sub: payload.sub, email: payload.email }; req.session.tokens = tokens; res.redirect("/"); });
});
```
Tokens stay server-side; the browser gets only the session cookie.

### H7. SSRF-safe URL fetcher
```js
import dns from "node:dns/promises";
import net from "node:net";
import ipaddr from "ipaddr.js";
const BLOCKED = ["private", "loopback", "linkLocal", "uniqueLocal", "carrierGradeNat", "reserved", "unspecified"];

export async function safeFetch(url) {
  const u = new URL(url);
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("scheme not allowed");
  const addrs = await dns.lookup(u.hostname, { all: true });
  for (const { address } of addrs) if (BLOCKED.includes(ipaddr.parse(address).range())) throw new Error("blocked address");
  const r = await fetch(u, { redirect: "manual", signal: AbortSignal.timeout(5000) });   // revalidate any redirect target
  return r;
}
```
Also pin the resolved IP for the connection (to prevent DNS rebinding) and cap response size.

### H8. Webhook HMAC verification with replay protection
```js
app.post("/webhooks", express.raw({ type: "*/*" }), (req, res) => {
  const ts = Number(req.get("x-timestamp")), sig = req.get("x-signature") ?? "";
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) return res.sendStatus(400);                    // 5 min window
  const expected = crypto.createHmac("sha256", SECRET).update(`${ts}.${req.body}`).digest("hex");
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  return ok ? res.sendStatus(200) : res.sendStatus(401);
});
```

### H9. Envelope encryption helper (AES-256-GCM + KMS-wrapped key)
```js
async function encryptField(plaintext) {
  const dek = crypto.randomBytes(32), iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", dek, iv);
  const ct = Buffer.concat([c.update(plaintext, "utf8"), c.final()]), tag = c.getAuthTag();
  const wrapped = await kms.encrypt({ KeyId: KMS_KEY, Plaintext: dek });     // wrap DEK with KEK
  return JSON.stringify({ v: 1, kid: KMS_KEY, dek: wrapped.CiphertextBlob.toString("base64"), iv: iv.toString("base64"), tag: tag.toString("base64"), ct: ct.toString("base64") });
}
```
Include a version and key id for rotation; decrypt by unwrapping the DEK via KMS.

### H10. Authorization middleware with ownership checks
```js
const requireRole = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.sendStatus(403);
const loadOwned = (model) => async (req, res, next) => {
  const row = await db[model].findFirst({ where: { id: req.params.id, tenantId: req.user.tenantId, ownerId: req.user.id } });
  if (!row) return res.sendStatus(404);          // don't reveal existence
  req.resource = row; next();
};
app.delete("/documents/:id", requireAuth, loadOwned("document"), async (req, res) => { await db.document.delete({ where: { id: req.resource.id } }); res.sendStatus(204); });
```

### H11. Security test cases (Supertest)
```js
it("blocks IDOR", async () => {
  const aliceDoc = await createDoc(alice);
  await request(app).get(`/documents/${aliceDoc.id}`).set(authFor(bob)).expect(404);
});
it("rejects JWT with alg none", async () => {
  const forged = [b64({ alg: "none", typ: "JWT" }), b64({ sub: "1", role: "admin" }), ""].join(".");
  await request(app).get("/admin").set("Authorization", `Bearer ${forged}`).expect(401);
});
it("rate limits login", async () => {
  for (let i = 0; i < 10; i++) await request(app).post("/login").send(bad);
  await request(app).post("/login").send(bad).expect(429);
});
```

### H12. Dependency and secret scanning in CI (GitHub Actions)
```yaml
name: security
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    permissions: { contents: read, security-events: write }
    steps:
      - uses: actions/checkout@v4
      - run: npm ci --ignore-scripts
      - run: npm audit --audit-level=high
      - uses: gitleaks/gitleaks-action@v2
      - uses: github/codeql-action/init@v3
        with: { languages: javascript-typescript }
      - uses: github/codeql-action/analyze@v3
      - uses: aquasecurity/trivy-action@master     # pin to a commit SHA in real pipelines
        with: { scan-type: fs, severity: HIGH,CRITICAL, exit-code: "1" }
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Users randomly logged out
Session store eviction or restart (in-memory store), multiple instances without shared store, cookie `Secure` on HTTP, `SameSite` blocking cross-site flows, clock skew expiring JWTs, proxy not setting `trust proxy` so `secure` cookies aren't set. Check cookie in DevTools, store TTLs, and load-balancer stickiness.

### D2. `jwt malformed` / `invalid signature` / `jwt expired`
Wrong secret/key between services, token truncated (header size/URL encoding), `Bearer` prefix missing, key rotation without `kid`/JWKS refresh, expiry vs clock skew (allow ~30-60 s). Log reason codes, not tokens.

### D3. CORS preflight fails only on authenticated endpoints
Auth middleware runs before CORS and rejects `OPTIONS` with 401. Register CORS first and answer preflights without auth; ensure `Access-Control-Allow-Headers` includes `Authorization`.

### D4. Cookies not sent in cross-site requests
`SameSite=Lax/Strict`, missing `Secure` with `SameSite=None`, third-party cookie blocking, `credentials: "include"` missing, CORS wildcard with credentials. Prefer same-site architecture (API under the same registrable domain) or BFF.

### D5. OAuth callback `redirect_uri_mismatch`
Registered URI differs by scheme/port/trailing slash/subdomain; localhost vs 127.0.0.1; environment differences. Register exact URIs per environment.

### D6. OIDC login loop
Session cookie not persisted after callback (domain/secure/samesite), `state` stored in a cookie that is blocked, load balancer round-robin without shared session, or token validation failing then redirecting again. Inspect network tab and server logs for the callback.

### D7. 2FA codes always invalid
Server/phone clock drift, wrong time step/digits/algorithm, base32 secret mishandled, window too small, secret re-generated each request. Use NTP, ±1 window, store pending secret until verified.

### D8. Password reset links fail
Token expired, hashed token mismatch (encoding), email link scanners consuming single-use links (use confirmation page requiring POST), URL-encoding issues, multiple reset requests invalidating earlier ones.

### D9. XSS despite React
`dangerouslySetInnerHTML`, unsanitized markdown, `href` with `javascript:`, injected via third-party widgets, DOM sinks (`innerHTML` in legacy code), SSR hydration of unsafe JSON in `<script>` (escape `<`). Add DOMPurify, CSP, URL validation.

### D10. CSP breaks the site after enabling
Inline scripts/styles, third-party tags, eval-based libraries. Use report-only to discover, add nonces/hashes, replace inline handlers, allow necessary hosts, avoid `unsafe-eval`.

### D11. Suspicious spike in login failures
Credential stuffing. Enable rate limits/CAPTCHA, block abusive ASNs/IPs, force MFA for affected accounts, check logs for success after failures, notify users, check for password reuse, review WAF rules.

### D12. S3 bucket / storage publicly readable
Public ACLs/policies. Block Public Access, audit with CSPM, rotate any exposed credentials, use pre-signed URLs, enable access logs, assess exposure window and notify as required.

### D13. Dependency alert for a critical CVE
Check reachability (is the vulnerable function used?), exposure (internet-facing?), exploit status (KEV/EPSS), patch or mitigate (upgrade, config, WAF), test, deploy, and document. Use `npm ls`/`npm explain` for transitive paths and overrides.

### D14. "Works locally, 401 in prod behind proxy"
`X-Forwarded-*` headers not trusted (`trust proxy`), `Authorization` header stripped by proxy, HTTPS-only cookies set on HTTP internal hop, host header mismatch with cookie domain, different secrets/env between environments.

### D15. Logs contain sensitive data
Request/response body logging, error serializers dumping config, URL query tokens. Redact (pino `redact`), avoid tokens in URLs, rotate exposed credentials, purge logs where possible and note retention implications.

---

# 🧩 Part 8: Tricky Questions

### T1. Is hashing with SHA-256 plus salt good enough for passwords?
No. It's too fast for brute force on GPUs. Use Argon2id/bcrypt/scrypt with tuned cost.

### T2. Is JWT more secure than sessions?
No. It's just a token format. Sessions offer easy revocation; JWTs offer stateless verification. Security depends on implementation (storage, validation, expiry).

### T3. Does HTTPS prevent XSS or SQL injection?
No. HTTPS protects transport confidentiality/integrity, not application vulnerabilities.

### T4. If CORS blocks a request, did the server reject it?
Not necessarily. The server often processed it; the browser just blocked reading the response. That's why CORS is not an authorization mechanism.

### T5. Is `localStorage` or cookie safer for tokens?
HttpOnly cookies protect from JS theft but need CSRF defences; `localStorage` is vulnerable to XSS token theft but not to CSRF. With strong CSP/XSS hygiene and short-lived tokens either can be acceptable; cookies are generally preferred for browsers.

### T6. Why shouldn't you return "user not found" on login?
It enables user enumeration and targeted attacks. Return a uniform error and keep timing similar.

### T7. Can the client enforce authorization?
No. Client checks are UX only; attackers call APIs directly. Enforce server-side.

### T8. Is an encrypted JWT (JWE) always better than signed (JWS)?
Only if the payload must be confidential from the bearer/intermediaries; it adds complexity. Usually keep payloads minimal and signed.

### T9. Is Base64 encoding of passwords in config "obfuscation" acceptable?
No. It is reversible by anyone; use a secret manager.

### T10. Does salting prevent brute-force attacks?
No. It prevents precomputed table reuse and cross-user cracking efficiency; brute force per hash remains possible—hence slow hashes and strong passwords.

### T11. Why is MFA via SMS discouraged for high-risk accounts?
SIM swapping, SS7 interception and phishing; prefer authenticator apps, push with number matching or WebAuthn.

### T12. Is OAuth an authentication protocol?
Not by itself. It is authorization delegation; OIDC adds authentication.

### T13. Are UUIDs a substitute for authorization?
No. Unguessable IDs are not access control; always check permissions (security through obscurity fails with leaks).

### T14. Does SameSite=Lax fully stop CSRF?
It blocks most cross-site POSTs but allows top-level GET navigation, and has edge cases (e.g., Lax+POST 2-minute exception in Chrome for new cookies). Combine with tokens for sensitive actions.

### T15. Is rotating passwords every 90 days recommended?
NIST advises against forced periodic rotation; change on evidence of compromise. Frequent rotation leads to weak, predictable passwords.

### T16. Is a WAF enough to be secure?
No. It reduces common attack traffic but can be bypassed and doesn't fix logic flaws or broken access control.

### T17. What's the difference between encoding, escaping and sanitizing?
Encoding transforms data representation; escaping neutralizes special characters for a context; sanitizing removes/alters dangerous content (e.g., stripping scripts from HTML). Choose by context.

### T18. Why do bearer tokens in URLs get leaked?
They appear in browser history, server/proxy logs, `Referer` headers and analytics. Use headers or POST bodies.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **CIA?** Confidentiality, Integrity, Availability.
- **Password storage?** Argon2id / bcrypt with salt.
- **Token format?** JWT = header.payload.signature.
- **Browser XSS defence?** Output encoding + CSP.
- **CSRF defence?** SameSite + tokens + Origin checks.
- **Top OWASP risk?** Broken Access Control.
- **IDOR fix?** Server-side object authorization.
- **SQLi fix?** Parameterized queries.
- **SSRF fix?** Allow-list + block internal ranges.
- **Best MFA?** WebAuthn/passkeys.
- **TOTP standard?** RFC 6238.
- **OAuth for SPAs?** Auth Code + PKCE (or BFF).
- **M2M OAuth?** Client Credentials.
- **ID token is for?** Authentication (OIDC).
- **Access token is for?** Calling APIs.
- **HSTS?** Force HTTPS in browsers.
- **Cookie flags?** HttpOnly, Secure, SameSite.
- **Secrets storage?** Vault / cloud secret manager.
- **Encryption mode?** AES-GCM / ChaCha20-Poly1305.
- **MAC?** HMAC-SHA256.
- **Random?** `crypto.randomBytes`.
- **Cert automation?** ACME/Let's Encrypt.
- **Threat modelling?** STRIDE.
- **Vuln scoring?** CVSS (+ EPSS/KEV).
- **Supply chain?** Lockfiles, SCA, SBOM, provenance.
- **Zero trust?** Verify every request.
- **IR phases?** Prepare, detect, contain, eradicate, recover, review.
- **Authorization models?** RBAC, ABAC, ReBAC.
- **Clickjacking defence?** `frame-ancestors`.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about securing an application you built.
STAR: "I led security hardening for a multi-tenant SaaS: moved to Argon2id, added TOTP and passkeys, switched to BFF with HttpOnly session cookies, enforced tenant scoping in the data layer with RLS, added CSP with nonces, Dependabot/CodeQL/gitleaks in CI, and rate limits on auth. A pen test dropped from 14 findings (3 high) to 2 low and account-takeover support tickets fell 70%."

### P2. Describe a vulnerability you found and how you fixed it.
"I found an IDOR: `/exports/{id}` returned any tenant's export. I added tenant/ownership checks in a shared policy layer, wrote cross-tenant tests, scanned other endpoints with a script, rotated pre-signed URLs, and reviewed logs for exploitation. No evidence of abuse; we added authorization tests to every new endpoint template."

### P3. How do you handle a security incident?
"Declare severity, assign an incident commander, contain (revoke keys, isolate hosts), preserve evidence, analyze scope with logs, eradicate and recover, notify stakeholders/regulators per policy, run a blameless review and track action items to completion."

### P4. How do you balance security with delivery speed?
"Paved-road defaults (auth library, secrets, CI scanning) make secure the fast path; threat model only high-risk features in depth; automate checks; agree on risk acceptance with owners and deadlines."

### P5. Tell me about migrating authentication.
"Migrated from home-grown sessions to OIDC with a managed IdP: dual-running login, migrating password hashes with rehash-on-login, mapping user IDs, adding MFA, and phasing out legacy endpoints behind feature flags. Zero downtime and fewer lockout tickets."

### P6. How do you keep up with security?
"OWASP, vendor advisories, CVE feeds (KEV), conference talks, hands-on labs (PortSwigger Web Security Academy), internal brown-bags, and reviewing post-mortems."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** CIA triad, threat models, least privilege, defense in depth, secure-by-design principles.
- **Authentication:** passwords and hashing, sessions/cookies, JWT, OAuth2/OIDC, SAML/SSO, MFA/TOTP, passkeys/WebAuthn, account recovery, bot/credential-stuffing defence.
- **Authorization:** RBAC, ABAC, ReBAC, policy engines, multi-tenancy, object/function/property-level checks.
- **Web vulnerabilities:** XSS, CSRF, SQL/NoSQL/command injection, SSRF, XXE, deserialization, path traversal, open redirect, clickjacking, prototype pollution, ReDoS, race conditions.
- **Browser security:** SOP, CORS, CSP, SameSite, security headers, Trusted Types, Fetch Metadata, SRI.
- **Cryptography:** hashing, HMAC, symmetric/asymmetric, signatures, TLS, certificates, key management, envelope encryption, KMS, PQC.
- **Secrets and supply chain:** vaults, rotation, scanning, SCA, SBOM, provenance, CI/CD hardening.
- **Infrastructure:** cloud IAM, Kubernetes, containers, networks, zero trust, mTLS.
- **Operations:** logging, SIEM, incident response, vulnerability management, compliance, privacy.
- **Emerging:** LLM/AI security, post-quantum cryptography, passkeys at scale.

## Mixed topics
- Auth + REST/GraphQL APIs (`035_GraphQL-and-REST-APIs.md`): OAuth2 scopes, BOLA, rate limiting, CORS.
- Auth + BaaS (`034_Firebase-and-Supabase.md`): Rules/RLS, custom claims, service keys.
- Security + databases (`026_SQL.md`, `030_MongoDB.md`, `033_Prisma-and-ORMs.md`): injection, least privilege, encryption, RLS.
- Security + Redis (`031_Redis-and-Caching.md`): session stores, rate limiting, exposure risks.
- Security + search (`032_Elasticsearch.md`): document-level security, TLS, API keys.
- Security + Linux/networking (`024_Linux-and-Networking.md`): hardening, firewalls, TLS, SSH.
- Security + Git/CI (`025_Git-and-GitHub.md`): secrets in history, branch protection, signed commits.
- Security + frontend: XSS, CSP, token storage, dependency risks.

---

# 🔬 Part 12: Security Internals

### I1. TLS 1.3 handshake
ClientHello (supported groups, key shares, ALPN, SNI) → ServerHello (chosen cipher + key share) → both derive handshake keys via ECDHE → server sends encrypted Certificate + CertificateVerify + Finished → client verifies cert chain/hostname and sends Finished → application keys derived (HKDF). 1-RTT; 0-RTT resumption possible (replay risk). Forward secrecy comes from ephemeral keys.

### I2. How Argon2 resists attacks
Memory-hard: requires large RAM per hash (parameters `m`, `t`, `p`), making GPU/ASIC parallel cracking expensive. `Argon2id` mixes data-dependent and independent passes to resist both side-channels and tradeoff attacks.

### I3. JWT signature verification internals
Compute `signing_input = base64url(header) + "." + base64url(payload)`; verify `signature` with the algorithm: HMAC over the shared key (HS256) or public-key verify (RS256: RSASSA-PKCS1-v1_5 with SHA-256; ES256: ECDSA P-256; EdDSA). The library must not choose the algorithm from the untrusted header without an allow-list.

### I4. Session ID entropy and storage
Session IDs need ≥ 128 bits of entropy from a CSPRNG; stored server-side hashed or opaque; mapped to user and metadata (IP, UA, created, last seen). Idle and absolute timeouts; rotated at privilege changes.

### I5. CSRF token mechanics
Synchronizer token: per-session secret embedded in forms/headers; server compares. Double-submit cookie: token in cookie and header/body must match, ideally HMAC-signed and bound to the session so attackers can't set it via subdomain cookie injection.

### I6. Browser same-origin enforcement
Origin = (scheme, host, port). DOM access, XHR/fetch reads and storage are partitioned by origin; cross-origin embeds (images, scripts) are allowed but responses opaque; CORS opts into read access; `postMessage` requires origin checks. Cookies follow site/domain scoping (a different model) which causes CSRF.

### I7. Certificate validation
Chain building to a trusted root, signature checks, validity dates, name constraints, hostname match against SAN, key usage/EKU, revocation (OCSP stapling/CRL), CT SCT validation. Disabling validation (`NODE_TLS_REJECT_UNAUTHORIZED=0`) removes authentication of the server.

### I8. Password cracking economics
Hash speed on GPUs (billions/s for MD5/SHA-1/SHA-256; thousands/s for tuned Argon2/bcrypt). Wordlists + rules crack common passwords quickly regardless of algorithm; length and uniqueness matter most; breach checks and MFA reduce impact.

### I9. Kernel/container isolation boundaries
Namespaces + cgroups + seccomp + capabilities + LSMs (AppArmor/SELinux) isolate containers on a shared kernel; weaker than VMs. High-risk multi-tenant code needs gVisor/Kata/Firecracker or separate VMs.

### I10. Memory-safety and why it matters
Buffer overflows, use-after-free and similar bugs cause a large share of critical CVEs in C/C++. Memory-safe languages (Rust, Go, Java, JS) reduce this class; Node apps still face logic bugs, injection, and native-addon risks.

---

# 📊 Part 13: Reference Tables

### OWASP Top 10 (2021) with prevention
| # | Risk | Key prevention |
|---|---|---|
| A01 | Broken Access Control | Deny by default, server-side checks, ownership/tenant scoping |
| A02 | Cryptographic Failures | TLS, strong algorithms, key management, no sensitive data exposure |
| A03 | Injection | Parameterization, validation, safe APIs, encoding |
| A04 | Insecure Design | Threat modelling, secure patterns, abuse cases |
| A05 | Security Misconfiguration | Hardening, minimal features, IaC scanning, headers |
| A06 | Vulnerable Components | SCA, patching, SBOM, remove unused |
| A07 | Identification & Auth Failures | MFA, rate limits, strong session mgmt, breach checks |
| A08 | Software & Data Integrity Failures | Signed artifacts, CI/CD hardening, safe deserialization |
| A09 | Logging & Monitoring Failures | Centralized logs, alerts, tested IR |
| A10 | SSRF | Allow-lists, network egress controls, metadata protection |

### Authentication method comparison
| Method | Phishing resistant | UX | Notes |
|---|---|---|---|
| Password only | No | Good | Weakest |
| SMS OTP | No | OK | SIM swap |
| TOTP | No | OK | Real-time phishing possible |
| Push (number matching) | Partial | Good | Fatigue attacks |
| WebAuthn / passkeys | **Yes** | Excellent | Needs recovery plan |

### Token storage options
| Storage | XSS-readable | CSRF risk | Recommendation |
|---|---|---|---|
| `localStorage` | Yes | No | Avoid for long-lived tokens |
| In-memory | Only in-page XSS | No | Short-lived access tokens |
| HttpOnly cookie | No | Yes (mitigate) | Best for browser sessions/refresh |
| Mobile secure storage | N/A | N/A | Keychain/Keystore |

### Crypto primitives guide
| Need | Use | Avoid |
|---|---|---|
| Password storage | Argon2id, bcrypt, scrypt | MD5, SHA-*, plain |
| Hash/integrity | SHA-256/512, SHA-3, BLAKE3 | MD5, SHA-1 |
| MAC | HMAC-SHA256, Poly1305 | Custom MACs |
| Symmetric encryption | AES-256-GCM, ChaCha20-Poly1305 | ECB, unauthenticated CBC |
| Asymmetric encryption/KEX | X25519/ECDH, RSA-OAEP ≥ 2048 | RSA PKCS#1 v1.5 enc |
| Signatures | Ed25519, ECDSA P-256, RSA-PSS | SHA-1 signatures |
| Randomness | CSPRNG (`crypto.randomBytes`) | `Math.random()` |

### Security headers
| Header | Example | Purpose |
|---|---|---|
| HSTS | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| CSP | `default-src 'self'; ...` | Restrict resource loading |
| XCTO | `nosniff` | Stop MIME sniffing |
| Referrer-Policy | `strict-origin-when-cross-origin` | Limit referrer leakage |
| Permissions-Policy | `camera=(), geolocation=()` | Disable features |
| COOP/CORP | `same-origin` | Isolation |
| Frame control | `frame-ancestors 'none'` | Clickjacking |

### Authorization model quick compare
| Need | Model |
|---|---|
| Few fixed job functions | RBAC |
| Context rules (time, location, attributes) | ABAC |
| Sharing and hierarchies | ReBAC |
| Per-object exceptions | ACLs layered on above |

### Standards and versions (verify)
| Item | Notes |
|---|---|
| OAuth 2.1 | Draft consolidating PKCE, no implicit/password flows |
| RFC 9700 | OAuth 2.0 Security Best Current Practice |
| RFC 9449 | DPoP |
| NIST SP 800-63B-4 | Updated digital identity guidelines |
| TLS 1.3 | RFC 8446 |
| WebAuthn L2/L3 | Passkeys, FIDO2 |
| NIST PQC | ML-KEM, ML-DSA, SLH-DSA (FIPS 203/204/205) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```js
console.log(Buffer.from("password123").toString("base64"));
```
**Output:** `cGFzc3dvcmQxMjM=`. This is encoding, not protection; anyone can decode it.

### O2.
```js
const a = await argon2.hash("pw"), b = await argon2.hash("pw");
console.log(a === b, await argon2.verify(a, "pw"), await argon2.verify(b, "pw"));
```
**Output:** `false true true`. Different salts yield different hashes; both verify.

### O3.
```js
jwt.verify(token, secret);   // token alg: none, payload {"role":"admin"}
```
**Result:** throws (`jwt signature is required` / invalid algorithm) when algorithms are pinned/`none` disallowed; vulnerable libraries historically accepted it.

### O4.
```sql
SELECT * FROM users WHERE name = '' OR '1'='1'
```
**Result:** returns **all users** — the injected tautology makes the WHERE clause always true.

### O5.
```html
<img src=x onerror=alert(1)>   <!-- inserted via element.innerHTML = userInput -->
```
**Result:** the `onerror` handler executes (DOM XSS). With `textContent` it's rendered as text.

### O6.
```
Set-Cookie: sid=abc; Secure; HttpOnly; SameSite=Strict
```
From `http://localhost` development.
**Result:** browsers treat `localhost` as secure context for `Secure` cookies in modern Chrome/Firefox, but over plain HTTP on other hosts the cookie is rejected.

### O7.
```js
Math.random().toString(36).slice(2)
```
used for a password-reset token.
**Result:** insecure — predictable PRNG; use `crypto.randomBytes(32).toString("base64url")`.

### O8.
```js
crypto.timingSafeEqual(Buffer.from("abc"), Buffer.from("abcd"));
```
**Output:** throws `RangeError` — buffers must be equal length; check lengths first.

### O9.
```
GET /api/orders/1002   (as user who owns order 1001)
```
**Result (secure):** `404`/`403`. **Result (IDOR vulnerable):** returns order 1002's data.

### O10.
```js
const url = new URL("https://good.com@evil.com/path");
console.log(url.hostname);
```
**Output:** `evil.com`. A naive `startsWith("https://good.com")` check would be bypassed; validate the parsed hostname.

### O11.
```
Content-Security-Policy: default-src 'self'
<script>alert(1)</script> inline
```
**Result:** inline script blocked (no `'unsafe-inline'` or nonce); console shows a CSP violation.

### O12.
```js
app.use(cors({ origin: "*", credentials: true }));
```
**Result:** the browser rejects credentialed cross-origin responses (wildcard not allowed with credentials); some libraries reflect the Origin instead, which is dangerous.

---

# ✅ Part 15: MCQs

**1. Which is the best algorithm for password storage?**
A) SHA-256  B) MD5  C) Argon2id  D) Base64
**Answer: C**

**2. HttpOnly cookies protect against:**
A) CSRF  B) Reading cookies via JavaScript (XSS theft)  C) SQL injection  D) Clickjacking
**Answer: B**

**3. What does PKCE protect?**
A) Passwords  B) Authorization code interception  C) SQL queries  D) Cookies
**Answer: B**

**4. IDOR is a form of:**
A) Injection  B) Broken access control  C) Cryptographic failure  D) Misconfiguration only
**Answer: B**

**5. Which flow is for machine-to-machine?**
A) Authorization Code  B) Client Credentials  C) Implicit  D) Device Code
**Answer: B**

**6. Which header mitigates clickjacking (modern)?**
A) `Content-Security-Policy: frame-ancestors`  B) `Access-Control-Allow-Origin`  C) `ETag`  D) `Accept`
**Answer: A**

**7. The ID token in OIDC is:**
A) Used to call APIs  B) A JWT asserting user identity to the client  C) A refresh token  D) A cookie
**Answer: B**

**8. Which is phishing-resistant MFA?**
A) SMS  B) Email OTP  C) WebAuthn / passkeys  D) Security questions
**Answer: C**

**9. SSRF is best mitigated by:**
A) Longer passwords  B) Allow-lists and blocking internal address ranges  C) CORS  D) CSRF tokens
**Answer: B**

**10. Salting a password hash mainly defeats:**
A) Brute force on a single hash  B) Rainbow tables / precomputation  C) Phishing  D) Replay
**Answer: B**

**11. AES-GCM provides:**
A) Confidentiality only  B) Confidentiality and integrity (AEAD)  C) Hashing  D) Signatures
**Answer: B**

**12. Parameterized queries prevent:**
A) XSS  B) SQL injection  C) CSRF  D) SSRF
**Answer: B**

**13. Which cookie attribute helps defend against CSRF?**
A) HttpOnly  B) SameSite  C) Path  D) Max-Age
**Answer: B**

**14. Refresh token reuse detection means:**
A) Allow unlimited reuse  B) Revoke the token family if an old token is replayed  C) Store tokens in localStorage  D) Disable rotation
**Answer: B**

**15. NIST currently recommends against:**
A) Long passphrases  B) Mandatory periodic password changes without compromise evidence  C) Breached password checks  D) MFA
**Answer: B**

**16. STRIDE is used for:**
A) Load testing  B) Threat modelling  C) Hashing  D) Logging
**Answer: B**

**17. Which should never be done with secrets?**
A) Use a vault  B) Commit them to git  C) Rotate them  D) Scope them narrowly
**Answer: B**

**18. A WAF primarily:**
A) Fixes vulnerable code  B) Filters malicious HTTP traffic as a compensating control  C) Encrypts databases  D) Replaces authentication
**Answer: B**

**19. For comparing HMAC signatures use:**
A) `===`  B) `crypto.timingSafeEqual`  C) `==`  D) `indexOf`
**Answer: B**

**20. Zero Trust means:**
A) Trust the internal network  B) Verify every request regardless of location  C) No authentication needed  D) Only firewalls matter
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Storing passwords with fast hashes or in plain text.**
2. **Checking authorization only in the UI** or only on routes, not objects (IDOR/BOLA).
3. **Using `Math.random()` for tokens/OTPs.**
4. **JWT misuse**: unpinned algorithms, no `aud`/`iss` checks, long lifetimes, secrets in payload.
5. **Tokens in `localStorage`** with weak XSS defences.
6. **Trusting `X-Forwarded-*`/client-supplied tenant or role fields.**
7. **Concatenating SQL/NoSQL queries** with user input.
8. **`CORS: *` with credentials** or reflecting any origin.
9. **No rate limiting/lockout strategy** on login, OTP and reset.
10. **User enumeration** through messages or timing.
11. **Open redirects and loose OAuth redirect URI matching.**
12. **Skipping `state`/`nonce`/PKCE** in OAuth/OIDC.
13. **Secrets in git, images, logs or client bundles.**
14. **Disabling TLS verification** to "fix" certificate errors.
15. **Rolling your own crypto or using ECB/static IVs.**
16. **Exposing stack traces and verbose errors.**
17. **Ignoring dependency updates and transitive CVEs.**
18. **Over-privileged IAM, DB users and CI tokens.**
19. **Public cloud storage and unauthenticated admin panels.**
20. **No logging/alerting for security events; no tested incident plan.**
21. **Treating WAF/CSP/obfuscation as the only defence.**
22. **Weak account recovery** (security questions, SMS only).

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You reason from **threat models and trust boundaries**, not checklists alone.
- You get **authN/Z right**: object-level checks, tenant isolation, central policy, deny-by-default.
- You choose **sessions vs JWT vs BFF** deliberately and explain revocation, rotation and storage trade-offs.
- You know **OAuth2/OIDC** deeply (PKCE, state/nonce, token validation, redirect pitfalls) and modern auth (passkeys, DPoP).
- You prevent **injection, XSS, CSRF, SSRF** with the right layered controls and can show code for each.
- You manage **secrets, keys and supply chain** (vaults, KMS, rotation, SBOM, provenance, CI hardening).
- You build **detection and response** capabilities: logging, alerting, runbooks, blameless reviews.
- You make **risk-based trade-offs** between security and usability and communicate them clearly.
- You test security continuously (SAST/DAST/SCA, abuse-case tests, pen tests) and track metrics.
- You stay current on standards and incidents and can say what you do not know.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Authentication quick facts
```
Passwords: Argon2id/bcrypt + salt; breach check; rate limit; uniform errors
Sessions: random ID, HttpOnly+Secure+SameSite, regenerate on login, idle+absolute timeouts
JWT: pin alg, validate iss/aud/exp, short TTL, rotate refresh tokens, JWKS + kid
OAuth2: Auth Code + PKCE (+state, nonce); Client Credentials for M2M; exact redirect URIs
MFA: passkeys/WebAuthn > TOTP > push (number matching) > SMS
```

### Web security quick facts
```
XSS: encode output, avoid innerHTML, DOMPurify, CSP nonces, HttpOnly
CSRF: SameSite + token + Origin check; no state change on GET
SQLi: parameterized queries; least-privilege DB user
SSRF: allow-list, block private IPs, re-check redirects, IMDSv2
IDOR/BOLA: scope every query to user/tenant; 404 on foreign objects
Headers: HSTS, CSP, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors
```

### Crypto and secrets
AES-256-GCM / ChaCha20-Poly1305 • HMAC-SHA256 + `timingSafeEqual` • Ed25519/ECDSA/RSA-PSS • CSPRNG only • envelope encryption with KMS • rotate keys (`kid`) • secrets in vaults, never in git • scan repos.

### Operations checklist
Patch cadence • SCA/SAST/DAST in CI • least-privilege IAM • network segmentation • centralized logs + alerts • backups tested (immutable) • incident runbooks • threat models for new features • pen tests/bug bounty • security training.

### Pattern quick picks
Browser app → BFF + session cookie • Mobile → Code+PKCE + secure storage • Microservices → mTLS/workload identity + short-lived JWT • Webhooks → HMAC + timestamp • Sharing/permissions at scale → ReBAC/policy engine • Sensitive fields → app-level encryption + KMS • Public uploads → pre-signed URLs + scan.

### Interview strategy
1. Clarify assets, actors, trust boundaries and compliance needs.
2. Describe the threat model (STRIDE) briefly for the feature.
3. Present layered controls: authN, authZ, validation, crypto, monitoring.
4. Show a concrete code/config snippet for the key control.
5. Discuss failure modes: revocation, abuse, incident response.
6. Mention testing (SAST/DAST/abuse cases) and metrics.
7. Close with a real example and measured improvement.

### Final checklist before the interview
- [ ] Explain CIA, AuthN vs AuthZ, hashing vs encryption vs encoding.
- [ ] Implement secure password storage and login (Argon2id, rate limits, uniform errors).
- [ ] Compare sessions vs JWT; explain refresh rotation and token storage.
- [ ] Explain OAuth2 Auth Code + PKCE, OIDC ID tokens and validation steps.
- [ ] Prevent XSS, CSRF, SQLi, SSRF, IDOR with concrete controls.
- [ ] Explain CORS, SameSite, CSP and security headers correctly.
- [ ] Describe RBAC/ABAC/ReBAC and where to enforce authorization.
- [ ] Explain TLS, certificates, envelope encryption, key management and secrets handling.
- [ ] Describe CI/CD and supply-chain security, vulnerability management and incident response.
- [ ] Prepare a hardening story, a vulnerability story and an incident story with outcomes.
