# Express.js Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Express 5** (the current `latest` on npm; async errors are handled natively) and calls out **Express 4** differences, because many production codebases still run v4. Always verify details in the official docs (expressjs.com). Examples use ES modules and Node 20/22+. Sample user name in examples: **Ritesh Kumar**.
> Node.js fundamentals (event loop, streams, clustering) are in file 012. This file focuses on Express itself: routing, middleware, errors, security, structure, testing, performance and alternatives.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Built-ins + Middleware + Ecosystem + Mixed)](#-part-11-complete-coverage-built-ins--middleware--ecosystem--mixed)
- [Part 12: Express Internals](#-part-12-express-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Express.js?
Express is a minimal, unopinionated web framework for Node.js. It sits on top of Node's `http` module and adds routing, middleware, request/response helpers and template/static file support. It does not force a project structure, ORM or validation library.
```js
import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Hello, Ritesh Kumar'));
app.listen(3000, () => console.log('Listening on 3000'));
```

### Q2. Why use Express instead of the plain `http` module?
With plain `http` you parse URLs, methods, bodies, headers and errors yourself. Express gives routing (`app.get('/users/:id')`), middleware chains, body parsing, static files, cookies/headers helpers and a huge ecosystem, with very little code and low overhead.

### Q3. How do you install and start an Express project?
```bash
mkdir api && cd api
npm init -y
npm install express
```
Add `"type": "module"` to `package.json` for ES modules, create `server.js`, and run `node server.js` (or `node --watch server.js` during development).

### Q4. What is a route?
A route maps an **HTTP method + path** to a handler function.
```js
app.get('/users', (req, res) => res.json([{ id: 1, name: 'Ritesh Kumar' }]));
app.post('/users', (req, res) => res.status(201).json(req.body));
```

### Q5. What are `req` and `res`?
`req` (request) holds data from the client: `req.method`, `req.url`, `req.params`, `req.query`, `req.body`, `req.headers`, `req.cookies` (with a parser). `res` (response) is used to reply: `res.send()`, `res.json()`, `res.status()`, `res.redirect()`, `res.set()`, `res.sendFile()`, `res.end()`.

### Q6. What is middleware?
A function with access to `req`, `res` and `next`. It can run code, change `req`/`res`, end the response, or call `next()` to pass control to the next function.
```js
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

### Q7. What does `next()` do?
It passes control to the next matching middleware or route handler. `next(err)` skips to error-handling middleware. In Express 5 `next('route')` skips remaining handlers of the current route, and `next('router')` exits the current router.

### Q8. What is the difference between `app.use()` and `app.get()`?
`app.use(path?, fn)` matches **any HTTP method** and any path that **starts with** the given prefix (default `/`). `app.get(path, fn)` matches only `GET` and the **exact** path (plus params). Use `use` for middleware, `get/post/...` for endpoints.

### Q9. How do you read route parameters, query strings and the body?
```js
// GET /users/42?active=true
app.get('/users/:id', (req, res) => {
  const { id } = req.params;          // "42" (string)
  const { active } = req.query;       // "true" (string)
  res.json({ id: Number(id), active: active === 'true' });
});
// POST with JSON body
app.use(express.json());
app.post('/users', (req, res) => res.json(req.body));
```
Params and query values are always strings (or arrays/objects for repeated or nested query keys). Convert and validate them.

### Q10. What is `express.json()` and `express.urlencoded()`?
Built-in body-parsing middleware (since 4.16). `express.json()` parses `application/json`. `express.urlencoded({ extended: true })` parses HTML form posts. Without them `req.body` is `undefined` (Express 5) and in v4 it was `{}` after the parser or `undefined` before.

### Q11. How do you send a response?
| Method | Use |
|---|---|
| `res.send(body)` | String, Buffer, object (JSON) or array |
| `res.json(obj)` | JSON with correct headers |
| `res.status(404).json({...})` | Set status first |
| `res.sendStatus(204)` | Status plus its text as the body |
| `res.redirect('/login')` | 302 by default |
| `res.sendFile(absPath)` | Send a file |
| `res.download(path)` | Force download |
| `res.end()` | End without a body |

Send only **one** response per request.

### Q12. What are HTTP status codes you should know?
200 OK, 201 Created, 204 No Content, 301/302 redirects, 304 Not Modified, 400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (not allowed), 404 Not Found, 409 Conflict, 413 Payload Too Large, 422 Unprocessable Entity, 429 Too Many Requests, 500 Internal Server Error, 502/503/504 gateway/service problems.

### Q13. How do you serve static files?
```js
app.use(express.static('public'));                    // public/logo.png -> /logo.png
app.use('/assets', express.static('public'));         // -> /assets/logo.png
```
Use an absolute path (`path.join(import.meta.dirname, 'public')`) so it works from any working directory.

### Q14. What is `app.listen()`?
It creates an HTTP server from the app and starts listening: `app.listen(port, cb)`. It returns the `http.Server`, which you need for graceful shutdown and WebSocket upgrades. In Express 5 the callback receives an error if listening fails.

### Q15. What is the order of middleware and why does it matter?
Middleware runs in the order it is registered. Parsers and security middleware must come before routes that need them; error handlers come last; a catch-all 404 handler comes after all routes.

### Q16. How do you handle a 404 (route not found)?
```js
app.use((req, res) => res.status(404).json({ error: 'Not found' }));   // after all routes
```

### Q17. How do you handle errors?
A middleware with **four arguments** `(err, req, res, next)` placed after the routes.
```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.expose ? err.message : 'Internal server error' });
});
```

### Q18. What is a REST API?
An API style where resources are identified by URLs and manipulated with HTTP methods: `GET /users` (list), `GET /users/1` (read), `POST /users` (create), `PUT/PATCH /users/1` (update), `DELETE /users/1` (remove). It is stateless: each request carries what the server needs.

### Q19. PUT vs PATCH?
`PUT` replaces the whole resource (idempotent). `PATCH` changes only the given fields. `POST` creates or triggers actions (not idempotent). `DELETE` removes (idempotent).

### Q20. What is CORS and how do you enable it?
Browsers block cross-origin requests unless the server allows them with headers. Use the `cors` package:
```js
import cors from 'cors';
app.use(cors({ origin: ['https://app.example.com'], credentials: true }));
```
Do not use `origin: '*'` together with credentials.

### Q21. What are environment variables and how do you use them?
Configuration outside code: `process.env.PORT`, `DATABASE_URL`, secrets. Use `node --env-file=.env server.js` (Node 20.6+) or `dotenv`. Never commit `.env` files.

### Q22. What is `nodemon` / `node --watch`?
Tools that restart the server on file changes during development. `node --watch server.js` is built in (Node 18.11+/20+).

### Q23. What is the difference between `req.params`, `req.query` and `req.body`?
`params`: parts of the path (`/users/:id`). `query`: after `?` (`?page=2`). `body`: data in the request payload (POST/PUT/PATCH). Headers are in `req.headers` / `req.get('name')`.

### Q24. How do you set and read headers and cookies?
```js
res.set('X-Request-Id', '123');                      // set header
const ua = req.get('user-agent');                    // read header
import cookieParser from 'cookie-parser';
app.use(cookieParser());
res.cookie('theme', 'dark', { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 86_400_000 });
console.log(req.cookies.theme);
```

### Q25. What is a template engine (view engine)?
It renders HTML on the server from templates (EJS, Pug, Handlebars). 
```js
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index', { name: 'Ritesh Kumar' }));
```
Modern apps often serve JSON APIs and a separate frontend instead.

### Q26. What is `res.json()` vs `res.send()` with an object?
Both send JSON for objects. `res.json()` also converts non-objects such as `null` and `undefined` to valid JSON and respects `app.set('json spaces')` / `json replacer`. Prefer `res.json()` for APIs because it is explicit.

### Q27. What is a Router?
A mini application that groups routes and middleware.
```js
// routes/users.js
import { Router } from 'express';
const router = Router();
router.get('/', listUsers);
router.get('/:id', getUser);
export default router;
// server.js
app.use('/api/users', router);
```

### Q28. What does `app.set` / `app.get` (settings) do?
`app.set('trust proxy', 1)` stores settings; `app.get('trust proxy')` reads them (one-argument `app.get` reads a setting, two-argument registers a route). Common settings: `trust proxy`, `view engine`, `etag`, `json spaces`, `query parser`.

### Q29. What is `process.env.NODE_ENV` and why does it matter?
Conventionally `development`, `test` or `production`. Express enables optimizations (view caching, less verbose errors) in production. Set `NODE_ENV=production` when deploying.

### Q30. What is `body-parser`? Do I still need it?
It was the original package. Since Express 4.16, `express.json()` and `express.urlencoded()` are built in, so you usually do not install it separately. For `multipart/form-data` (file uploads) you need `multer` or `busboy`.

### Q31. How do you upload a file?
```js
import multer from 'multer';
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/avatar', upload.single('file'), (req, res) => res.json({ name: req.file.originalname, size: req.file.size }));
```
Always limit size and validate type (check magic bytes, not only the extension).

### Q32. What is the difference between authentication and authorization?
Authentication: who are you (login, token). Authorization: what may you do (roles, permissions). In Express both are usually middleware.

### Q33. What is a simple example of a logging middleware?
Use `morgan`:
```js
import morgan from 'morgan';
app.use(morgan('combined'));
```
For production prefer structured JSON logs (pino-http).

### Q34. What is `app.all()`?
Matches all HTTP methods for a path: `app.all('/secret', requireAuth)`. Useful for method-independent checks.

### Q35. What are the common Express project folders?
`src/routes`, `src/controllers`, `src/services`, `src/middleware`, `src/models` (or repositories), `src/config`, `src/utils`, `tests`. The structure is your choice; keep it consistent (see Part 3).

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Types of middleware in Express *(Must-know)*
1. **Application-level:** `app.use(fn)`.
2. **Router-level:** `router.use(fn)`.
3. **Route-level:** `app.get('/x', mw1, mw2, handler)`.
4. **Error-handling:** `(err, req, res, next)`.
5. **Built-in:** `express.json`, `express.static`, `express.urlencoded`, `express.raw`, `express.text`.
6. **Third-party:** `cors`, `helmet`, `morgan`, `compression`, `cookie-parser`, `express-rate-limit`.

### Q37. How does the middleware chain work internally? *(Must-know)*
Express keeps an ordered stack of layers per router. For each request it walks the stack, matching method and path. Each matching layer's function runs; calling `next()` moves to the next layer. If a layer ends the response (`res.send`) and does not call `next`, the chain stops. If `next(err)` is called (or a handler throws/rejects in Express 5), Express skips to error layers (functions with 4 params).

### Q38. Express 4 vs Express 5: key differences *(Must-know)*
| Area | Express 4 | Express 5 |
|---|---|---|
| Async errors | Rejected promises are **not** caught; need wrapper or `next(err)` | Rejected promises/async throws are forwarded to the error handler automatically |
| Path syntax | `*`, `?`, regex-ish strings | Uses `path-to-regexp` v8: wildcards must be named (`/*splat`), `?` replaced by optional `{}` syntax |
| `req.body` default | `{}` after json parser | `undefined` if no body was parsed |
| Removed APIs | `app.del`, `res.json(status, obj)`, `res.send(status)` forms, `req.param()` | Removed |
| `req.query` | Parsed with `qs` ("extended") by default | Default query parser is "simple" (Node `querystring`); set `app.set('query parser', 'extended')` for old behavior |
| `res.redirect('back')` | Supported | Removed; use `req.get('Referrer') \|\| '/'` |
| Node support | Old Node versions | Node 18+ |

Verify the migration guide at expressjs.com before upgrading.

### Q39. Route path patterns
```js
app.get('/users/:id', h);             // param
app.get('/files/*splat', h);          // Express 5 named wildcard (v4: '/files/*')
app.get('/items{/:id}', h);           // Express 5 optional segment (v4: '/items/:id?')
app.get('/users/:id(\\d+)', h);       // v4 regex in params; v5 removed inline regex: validate in code or middleware
```
In Express 5 regex characters in path strings are no longer supported; use `app.get(/.*fly$/, h)` (a real RegExp) if you need patterns.

### Q40. `router.param()` and parameter validation
```js
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'id must be a number' });
  req.userId = Number(id);
  next();
});
```
It runs once per request for routes that contain the param.

### Q41. `app.route()` chaining
```js
app.route('/books')
  .get(listBooks)
  .post(createBook);
```
Avoids repeating the path.

### Q42. `Router` options: `mergeParams`, `strict`, `caseSensitive`
By default a child router does not see parent params. `Router({ mergeParams: true })` allows `/users/:userId/posts` mounted routers to read `req.params.userId`.
```js
const posts = Router({ mergeParams: true });
posts.get('/', (req, res) => res.json({ user: req.params.userId }));
app.use('/users/:userId/posts', posts);
```

### Q43. Handling async errors in Express 4 vs 5 *(Must-know)*
```js
// Express 4: wrapper needed
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.get('/users/:id', wrap(async (req, res) => res.json(await getUser(req.params.id))));
// Express 5: automatic
app.get('/users/:id', async (req, res) => res.json(await getUser(req.params.id)));
```
In v5 a thrown error or rejected promise reaches your error middleware without `try/catch`.

### Q44. Custom error classes and a central error handler
```js
export class HttpError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.expose = status < 500; this.details = details; }
}
// usage
if (!user) throw new HttpError(404, 'User not found');
// central handler (last)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);          // delegate to Express default handler
  const status = err.status ?? 500;
  if (status >= 500) req.log?.error(err);
  res.status(status).json({ error: { message: err.expose ? err.message : 'Internal server error', details: err.details } });
});
```
Always check `res.headersSent` first.

### Q45. Validating input with `zod`
```js
import { z } from 'zod';
const CreateUser = z.object({ name: z.string().min(2), email: z.string().email() });
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(422).json({ errors: result.error.flatten() });
  req.body = result.data; next();
};
app.post('/users', validate(CreateUser), createUser);
```
Never trust `req.body`, `req.query` or `req.params`.

### Q46. Environment-based configuration
Load and validate once at startup, export a typed `config` object, and avoid reading `process.env` all over the code. Fail fast if required variables are missing.

### Q47. Helmet and security headers
```js
import helmet from 'helmet';
app.use(helmet());
```
Sets headers like `Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`. Also call `app.disable('x-powered-by')` (Helmet does this) to hide the framework.

### Q48. Rate limiting
```js
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({ windowMs: 15 * 60_000, limit: 100, standardHeaders: true, legacyHeaders: false }));
```
The default store is in memory per process; use a shared store (Redis) for multiple instances.

### Q49. Compression
`app.use(compression())` gzips/deflates responses. Often better done at the reverse proxy/CDN. Do not compress already-compressed content.

### Q50. Sessions vs JWT
Sessions: server stores state (in Redis), client holds a session ID cookie; easy to revoke. JWT: signed token holding claims; stateless but harder to revoke. For browser apps, secure httpOnly cookies are often safest. Never store tokens in `localStorage` if XSS is a concern.

### Q51. Session setup with Redis (outline)
```js
import session from 'express-session';
import { RedisStore } from 'connect-redis';
app.set('trust proxy', 1);
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
}));
```
Never use the default memory store in production.

### Q52. JWT auth middleware
```js
import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }); next(); }
  catch { res.status(401).json({ error: 'Invalid or expired token' }); }
}
export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Forbidden' });
```

### Q53. Password hashing on signup/login
Use `argon2` or `bcrypt`. Never store plain or fast-hashed passwords. Return the same error message for "unknown user" and "wrong password" to avoid user enumeration, and rate limit login attempts.

### Q54. Connecting to a database
Create the connection or pool once at startup (not per request) and share it through modules or dependency injection. Use `pg` Pool, `mysql2`, `mongoose` or an ORM like Prisma/Drizzle. Handle connection errors and close the pool on shutdown.

### Q55. Pagination, filtering and sorting
```js
app.get('/posts', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const rows = await db.post.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } });
  res.json({ page, limit, data: rows });
});
```
Cap `limit`. For large datasets use cursor-based pagination.

### Q56. HTTP caching headers and ETags
Express sends weak ETags by default, so conditional `GET` requests can return `304`. Set `Cache-Control` explicitly for static assets (`express.static(dir, { maxAge: '1y', immutable: true })` for fingerprinted files).

### Q57. `res.locals` and `app.locals`
`res.locals`: per-request data available to views and later middleware. `app.locals`: application-wide values. Use `req` properties (or `res.locals`) to pass data between middleware, such as the authenticated user.

### Q58. Request IDs and correlation
```js
app.use((req, res, next) => {
  req.id = req.get('x-request-id') ?? crypto.randomUUID();
  res.set('x-request-id', req.id);
  next();
});
```
Include the ID in every log line and in downstream calls.

### Q59. Health check endpoints
`/healthz` (is the process alive) and `/readyz` (are dependencies ready). Keep them cheap and unauthenticated; readiness may check the DB.

### Q60. Graceful shutdown
```js
const server = app.listen(PORT);
process.on('SIGTERM', () => {
  server.close(async () => { await pool.end(); process.exit(0); });
  server.closeIdleConnections?.();
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

### Q61. `trust proxy`
Behind Nginx/ALB set `app.set('trust proxy', 1)` (number of proxy hops) so `req.ip`, `req.protocol` and `req.secure` use `X-Forwarded-*` headers. Without it, `req.ip` is the proxy IP, which breaks rate limiting and secure cookies. Never set `true` blindly if clients can send those headers directly.

### Q62. API versioning
`/api/v1/...` via mounted routers is simplest. Alternatives: header or media-type versioning. Keep old versions stable, document deprecations.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. How do you structure a larger Express app? *(Architecture)*
```
src/
  app.js            // builds and exports the app (no listen)
  server.js         // listen + graceful shutdown
  config/           // env validation
  routes/           // route definitions only
  controllers/      // HTTP layer: parse input, call service, send output
  services/         // business logic (no req/res)
  repositories/     // database access
  middleware/       // auth, validate, error, rate limit
  utils/
tests/
```
Splitting `app` from `server` lets tests import the app without opening a port.

### Q64. Controller–Service–Repository pattern
Controllers handle HTTP details, services hold business rules, repositories talk to the database. Benefits: unit-testable services, replaceable data layer. Avoid putting `req`/`res` into services.
```js
// controller
export const createUser = async (req, res) => res.status(201).json(await userService.create(req.body));
// service
export const create = async (data) => { if (await repo.findByEmail(data.email)) throw new HttpError(409, 'Email exists'); return repo.insert(data); };
```

### Q65. Dependency injection without a framework
Create factories that receive dependencies:
```js
export const createUserRouter = ({ userService, auth }) => {
  const r = Router();
  r.get('/:id', auth, async (req, res) => res.json(await userService.get(req.params.id)));
  return r;
};
```
Makes mocking simple in tests.

### Q66. Writing reusable middleware (factories)
```js
export const requireJson = () => (req, res, next) =>
  req.is('application/json') ? next() : res.status(415).json({ error: 'Content-Type must be application/json' });
```
Return a function from a configurable factory; keep middleware small and single-purpose.

### Q67. Middleware ordering recipe for production
1. `trust proxy`, disable `x-powered-by`
2. Request ID + logger
3. `helmet`
4. `cors`
5. Compression (or at proxy)
6. Rate limiter
7. Body parsers with limits
8. Cookie/session/auth
9. Routes
10. 404 handler
11. Error handler

### Q68. Body size limits and content types
```js
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
```
Use `express.raw({ type: 'application/json' })` for webhooks that need the raw body to verify signatures (mount that route **before** `express.json()` or scope the parser to other routes).

### Q69. Webhook signature verification
```js
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature'), process.env.WEBHOOK_SECRET);
  res.sendStatus(200);
});
```
Signatures are computed over the exact raw bytes; parsed JSON would break verification.

### Q70. Idempotency keys for POST
Clients send `Idempotency-Key`. Store the key with the response (Redis/DB); if the same key returns, send the stored response instead of repeating the action. Essential for payments and retries.

### Q71. File uploads at scale
Avoid buffering large files in memory. Stream to object storage (S3) using pre-signed URLs so clients upload directly; Express only issues the URL and records metadata. Scan files, limit size/type, randomize stored names.

### Q72. Server-Sent Events (SSE) in Express
```js
app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  const id = setInterval(() => res.write(`data: ${Date.now()}\n\n`), 1000);
  req.on('close', () => clearInterval(id));
});
```
Disable compression for the stream and make sure proxies do not buffer it.

### Q73. WebSockets with Express
Express does not handle WebSockets itself. Create the HTTP server from the app and attach `ws` or Socket.IO.
```js
import http from 'node:http';
import { WebSocketServer } from 'ws';
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
server.listen(3000);
```
Authenticate during the upgrade request.

### Q74. Streaming responses
`res` is a Writable stream: `pipeline(fs.createReadStream(file), res, cb)`. Set `Content-Type` and `Content-Length` when known. For `Range` requests prefer `res.sendFile`, which supports ranges and caching headers.

### Q75. Testing Express apps with Supertest *(Must-know)*
```js
import request from 'supertest';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { app } from '../src/app.js';

test('POST /users validates input', async () => {
  const res = await request(app).post('/users').send({ name: '' });
  assert.equal(res.status, 422);
});
```
Test pyramid: unit tests for services, integration tests with Supertest and a test DB (containers), a few end-to-end tests.

### Q76. Mocking dependencies in tests
Inject fakes through factories, or use `mock.method` / `jest.mock` / `vi.mock`. Prefer fakes for repositories and real DB containers (Testcontainers) for integration tests.

### Q77. Logging with pino
```js
import pino from 'pino';
import pinoHttp from 'pino-http';
const logger = pino({ level: process.env.LOG_LEVEL ?? 'info', redact: ['req.headers.authorization', 'req.headers.cookie'] });
app.use(pinoHttp({ logger, genReqId: (req) => req.id }));
```
Structured JSON logs, redaction of secrets, one log line per request with duration and status.

### Q78. Metrics and tracing
Expose Prometheus metrics (`prom-client`) with a request-duration histogram labeled by route (use the route pattern `req.route.path`, not the raw URL, to avoid label explosion). Add OpenTelemetry for traces across services.

### Q79. OpenAPI / Swagger documentation
Describe the API in OpenAPI 3; generate docs with `swagger-ui-express`, or generate the spec from zod schemas (`zod-to-openapi`). Contract tests keep docs and code in sync.

### Q80. Security checklist for Express *(Must-know)*
Helmet, strict CORS, rate limiting, body limits, input validation, parameterized queries, hashed passwords, secure cookies (`httpOnly`, `secure`, `sameSite`), CSRF protection for cookie-based auth, dependency audit, no stack traces in responses, `trust proxy` configured, HTTPS everywhere, secrets in a manager, least-privilege DB user.

### Q81. CSRF
Cross-Site Request Forgery tricks a logged-in browser into sending requests. Defend with `SameSite` cookies, CSRF tokens (double submit or synchronizer), and checking `Origin`/`Referer`. Pure bearer-token APIs (token in `Authorization` header) are not vulnerable to classic CSRF.

### Q82. XSS, injection and related attacks
Escape output in templates, set CSP, sanitize rich text (DOMPurify on the client or server-side sanitizers), use parameterized queries, validate input with schemas, and avoid `eval`. For NoSQL, reject objects in places expecting strings (`{ "$ne": null }` attacks); use `mongo-sanitize` or schema validation.

### Q83. Prototype pollution and `qs`
Query parsers can create nested objects (`?a[b]=1`). Keep the query parser simple unless you need nesting, validate query shapes with schemas, and limit depth/array size (`qs` options). Keep dependencies patched.

### Q84. Path traversal in `sendFile` / static
```js
const file = path.resolve(ROOT, '.' + req.path);
if (!file.startsWith(ROOT + path.sep)) return res.sendStatus(403);
```
`res.sendFile(rel, { root: ROOT })` also protects against `..` in the path. Never pass raw user input as an absolute path.

### Q85. Open redirect
`res.redirect(req.query.next)` can send users to malicious sites. Allow-list targets or only accept relative paths starting with a single `/`.

### Q86. Caching strategies for APIs
HTTP caching (`Cache-Control`, `ETag`), CDN for public GETs, Redis for computed results, cache invalidation by key/tag/TTL, stale-while-revalidate. Do not cache user-specific responses in shared caches (`Cache-Control: private`).

### Q87. Error response format (RFC 9457 problem details)
```json
{ "type": "https://example.com/errors/validation", "title": "Validation failed", "status": 422, "detail": "email is invalid", "instance": "/users" }
```
Use a consistent shape and machine-readable codes across the API.

### Q88. Express with TypeScript
```ts
import express, { Request, Response, NextFunction } from 'express';
interface Params { id: string }
app.get('/users/:id', async (req: Request<Params>, res: Response) => {
  res.json(await getUser(req.params.id));
});
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => { /* ... */ };
```
Install `@types/express` (v5 types match v5). Extend `req.user` through module augmentation (`declare global { namespace Express { interface Request { user?: User } } }`). Validate at runtime too, since types vanish after compilation.

### Q89. Async context per request
Use `AsyncLocalStorage` to hold request ID/user so loggers and repositories can read it without passing `req` everywhere.

### Q90. Connection pooling and per-request transactions
Acquire a connection only when needed, always release in `finally`, keep transactions short, and avoid doing HTTP calls while holding a transaction.

### Q91. Handling long-running work
Do not run long work in the request. Respond `202 Accepted` with a job ID, push the job to a queue (BullMQ/SQS), process it in a worker, and let the client poll or receive a webhook/SSE update.

### Q92. Pagination, filtering and API design details
Cursor pagination (`?after=<id>&limit=20`), consistent sorting, field selection, conditional requests, `Link` headers, rate limit headers (`RateLimit-*`), and stable error codes.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. How do you scale an Express API? *(Architecture)*
Keep handlers stateless (sessions in Redis, files in object storage), run many instances behind a load balancer, one process per container (or `cluster`/PM2 on VMs), cache hot reads, move slow work to queues, tune the DB (indexes, pooling, replicas), add timeouts and rate limits, and measure p95/p99 latency, error rate and event loop lag. Optimize the slowest dependency first, not Express itself: Express overhead is tiny compared to DB and network time.

### Q94. Server timeouts and the 502 problem
```js
const server = app.listen(PORT);
server.keepAliveTimeout = 65_000;   // longer than the load balancer idle timeout (ALB default 60 s)
server.headersTimeout = 66_000;
server.requestTimeout = 30_000;
```
Also add a per-route timeout middleware for slow handlers and abort downstream work with `AbortSignal`.

### Q95. Request timeout middleware that really cancels work
```js
export const timeout = (ms) => (req, res, next) => {
  const ac = new AbortController();
  req.signal = ac.signal;
  const t = setTimeout(() => { ac.abort(); if (!res.headersSent) res.status(503).json({ error: 'Request timed out' }); }, ms);
  res.on('close', () => { clearTimeout(t); ac.abort(); });      // also cancels when the client disconnects
  next();
};
// handler: await fetch(url, { signal: req.signal })
```
A timeout that only sends a response but does not stop the work still wastes resources.

### Q96. Resilience for downstream calls
Timeouts, retries with exponential backoff and jitter (idempotent calls only), circuit breakers (`opossum`), bulkheads (concurrency limits), fallbacks, and load shedding when the event loop lag is high. Propagate request IDs and deadlines.

### Q97. Rate limiting in depth
Algorithms: fixed window, sliding window, token bucket, leaky bucket. Use a shared store (Redis with Lua/atomic ops) for multi-instance, key by user ID/API key (not only IP), different limits per route (login stricter), return `429` with `Retry-After`. Fail open or closed deliberately if Redis is down.

### Q98. Authentication architecture
Access token (short, ~15 min) + refresh token (long, rotated, stored hashed server-side, httpOnly cookie). Support revocation (token version or deny-list), logout everywhere, device tracking, and MFA. For SSO use OIDC (Auth0, Keycloak, Cognito) with libraries like `openid-client` or `passport`. Prefer proven providers over custom crypto.

### Q99. Authorization models
RBAC (roles), ABAC (attributes/policies), ownership checks (`resource.ownerId === req.user.id`), and policy libraries (CASL, Casbin, OPA). Centralize checks in services/policies, not scattered `if` statements, and test authorization with negative cases (IDOR: accessing another user's resource by changing an ID).

### Q100. Multi-tenancy
Resolve the tenant (subdomain, header, token claim) in middleware, attach to `req`/`AsyncLocalStorage`, scope every query by tenant (or use Postgres row-level security), per-tenant rate limits and cache keys, and prevent cross-tenant leaks with tests.

### Q101. Database access patterns
Repository layer, parameterized queries, migrations, transactions around multi-step writes, N+1 avoidance (joins, `IN` batches, DataLoader), read replicas for read-heavy endpoints, optimistic locking (`version` column) for concurrent updates, and statement timeouts.

### Q102. Outbox pattern and reliable events
Write the business change and an "outbox" row in one transaction; a worker publishes outbox rows to the broker. This avoids "DB saved but event lost" dual-write problems. Consumers must be idempotent.

### Q103. Background jobs and scheduling
Use BullMQ (Redis), SQS, RabbitMQ or Kafka. API enqueues; workers run separately with retries, backoff, dead-letter queues and concurrency limits. Scheduled tasks via Kubernetes CronJobs or repeatable jobs with locks so they do not run once per instance.

### Q104. Observability design
Structured logs with request ID, metrics (RED: rate, errors, duration per route pattern), traces (OpenTelemetry auto-instrumentation for `express`, `http`, DB clients), error tracking (Sentry), dashboards, SLO-based alerts. Redact PII and secrets in logs.

### Q105. Zero-downtime deployments
Rolling or blue/green deploys, readiness probes, graceful shutdown, connection draining, backward-compatible DB migrations (expand → migrate → contract), feature flags, and versioned APIs. Set the `terminationGracePeriodSeconds` larger than your shutdown timeout.

### Q106. API gateway and BFF
A gateway handles auth, rate limits, routing, TLS and observability in front of services. A Backend-for-Frontend (Express/Fastify) aggregates calls for a specific client (web/mobile). Keep business logic in services, not in the gateway.

### Q107. Express in serverless
Wrap the app with an adapter (`@vendia/serverless-express`, `serverless-http`) for AWS Lambda. Concerns: cold starts (lazy init, small bundles), no long-lived connections (reuse clients across invocations, use a DB proxy), no in-memory state, and 15-minute limits. For high-throughput APIs, containers are usually simpler.

### Q108. Performance tuning checklist
Profile first. Avoid sync work in handlers, enable keep-alive for outbound HTTP agents (`undici` handles this), compress at the proxy, cache, reduce JSON size (select fields), paginate, use streaming for large payloads, minimize middleware on hot routes, and avoid heavy logging. Disable `etag` generation for huge dynamic responses if CPU shows up in profiles.

### Q109. Large codebase conventions
Strict linting (`no-floating-promises`), TypeScript, shared error classes, standard response envelope, route-level schema validation, consistent naming, API style guide, PR checklist (auth, validation, tests, logs), and architectural decision records.

### Q110. Handling file downloads and exports at scale
Stream from storage to the response, or redirect to a pre-signed URL. For big exports (CSV/PDF) create an async job, store the result in object storage, and notify the user. Never build huge strings in memory.

### Q111. Idempotency and exactly-once myths
HTTP retries mean "at least once" delivery. Design endpoints to be idempotent (idempotency keys, unique constraints, upserts) rather than chasing "exactly once". Return the same result for repeated requests.

### Q112. Debugging production incidents in Express
Check dashboards (latency, errors, saturation), recent deploys, logs by request ID, traces for slow spans, then capture a CPU profile or heap snapshot if needed. Typical culprits: slow DB queries, pool exhaustion, missing timeouts, blocked event loop, memory leaks (unbounded caches, listeners), and misconfigured proxy timeouts. Mitigate (rollback/scale/feature flag) before deep analysis.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Express vs Fastify vs Koa vs NestJS vs Hono: how do you decide? *(Decision)*
| | Express | Fastify | Koa | NestJS | Hono |
|---|---|---|---|---|---|
| Philosophy | Minimal, huge ecosystem | Fast, schema-first, plugins | Tiny core, async middleware | Opinionated, DI, modules (uses Express or Fastify underneath) | Tiny, web-standard APIs, multi-runtime |
| Validation | Add-on (zod, joi) | Built-in JSON Schema (ajv) | Add-on | Pipes (class-validator, zod) | Add-on (zod validators) |
| Performance | Good | Higher throughput | Good | Depends on adapter | Very good on edge runtimes |
| Learning curve | Lowest | Low-medium | Low | Higher | Low |
| Best for | Most teams, quick APIs, huge hiring pool | High-throughput JSON APIs | Custom stacks | Large teams needing structure | Edge/serverless, multi-runtime |
Decide on team skills, structure needs, performance targets, ecosystem and long-term maintenance. Framework choice rarely dominates performance; architecture, DB and caching do.

### Q114. Is Express still a good choice?
Yes for many APIs: stable, well understood, Express 5 fixes long-standing gaps (async errors), and the ecosystem is the largest. If you need strong built-in structure choose NestJS; for raw performance and schema validation consider Fastify. Mention that migrations between frameworks are costly, so choose deliberately.

### Q115. Designing a platform "golden path" for Express services
Project template with config validation, logging, health checks, graceful shutdown, metrics, error format, auth middleware, CI pipeline, Dockerfile, lint/test setup and security scans. Teams start from the template and share common libraries through a private registry.

### Q116. Modular monolith vs microservices
Start with a modular monolith (clear module boundaries, one deployable). Split into services when teams, scaling or release cadence demand it. Microservices add network failures, data consistency issues and operational cost. Enforce module boundaries with lint rules and public module APIs.

### Q117. API governance and contracts
OpenAPI as the contract, linting (Spectral), consumer-driven contract tests (Pact), versioning and deprecation policy, changelogs, backward-compatible changes (add fields; do not remove or change types), and a review process for breaking changes.

### Q118. Security program
Threat modeling, SAST/DAST/SCA in CI, secret scanning, dependency update automation, pen tests, WAF, least privilege, audit logging, key rotation, incident response plan, and compliance requirements (GDPR, SOC2, PCI as relevant).

### Q119. Migration: Express 4 → 5
Upgrade steps: read the official migration guide, fix removed APIs (`app.del`, `req.param`, `res.send(status)`), update route patterns (`*` → `/*splat`, optional params), review `req.body`/`req.query` assumptions, remove async wrappers (optional), update middleware to compatible versions, run the full test suite, and canary-deploy. Use codemods if available (`npx @expressjs/codemod` — verify availability).

### Q120. Migration: JavaScript → TypeScript, CommonJS → ESM
Incrementally: enable `allowJs`, convert module by module, start with shared types and utilities, add `strict` per folder, keep tests green. For ESM, switch `"type": "module"`, add file extensions to relative imports, replace `__dirname` usage.

### Q121. Reliability and SLOs
Define SLIs (availability, p95 latency, error rate) and SLOs with error budgets. Alert on symptoms, write runbooks, practice incident response, hold blameless post-mortems, and test failure modes (chaos, load tests).

### Q122. Cost and capacity
Right-size containers, autoscale on CPU/latency/queue depth, cache and CDN to reduce origin load, optimize heavy queries, reduce log volume, and track cost per request. Use load tests to know breaking points before launches.

### Q123. Interviewing and mentoring (Express depth)
Look for: middleware mental model, error handling, async correctness, validation/security instincts, testing habits, and the ability to debug with metrics. Mentor through PR reviews on error paths and security, and by sharing the template and checklists.

### Q124. Technical debt and roadmap
Keep a debt register (old Express/Node versions, unmaintained middleware, missing validation, inconsistent errors, flaky tests), reserve capacity each sprint, prioritize by risk, and review the platform roadmap quarterly (LTS, security advisories, framework releases).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. Mention validation, error handling, security and tests.

### C1. Minimal REST API (CRUD) with validation and errors
```js
import express from 'express';
import { z } from 'zod';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

const users = new Map();
const UserBody = z.object({ name: z.string().trim().min(2), email: z.string().email() });

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

app.get('/users', (req, res) => res.json([...users.values()]));
app.get('/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) throw new HttpError(404, 'User not found');
  res.json(user);
});
app.post('/users', (req, res) => {
  const body = UserBody.parse(req.body);
  const user = { id: crypto.randomUUID(), ...body };
  users.set(user.id, user);
  res.status(201).location(`/users/${user.id}`).json(user);
});
app.patch('/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) throw new HttpError(404, 'User not found');
  Object.assign(user, UserBody.partial().parse(req.body));
  res.json(user);
});
app.delete('/users/:id', (req, res) => {
  if (!users.delete(req.params.id)) throw new HttpError(404, 'User not found');
  res.sendStatus(204);
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof z.ZodError) return res.status(422).json({ error: 'Validation failed', details: err.flatten() });
  const status = err.status ?? 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});
export { app };
```
(Express 5 forwards thrown errors from sync and async handlers automatically.)

### C2. Async wrapper for Express 4
```js
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

### C3. JWT login, refresh and protected route
```js
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
const sign = (user) => jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m', algorithm: 'HS256' });

app.post('/auth/login', async (req, res) => {
  const { email, password } = LoginBody.parse(req.body);
  const user = await repo.findByEmail(email);
  const ok = user && await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });      // same message for both cases
  const refresh = crypto.randomBytes(32).toString('base64url');
  await repo.saveRefreshToken(user.id, await hash(refresh));
  res.cookie('refresh', refresh, { httpOnly: true, secure: true, sameSite: 'strict', path: '/auth/refresh', maxAge: 7 * 864e5 });
  res.json({ accessToken: sign(user) });
});
app.get('/me', requireAuth, (req, res) => res.json(req.user));
```
Rotate refresh tokens on use and detect reuse.

### C4. Validation middleware for body, query and params
```js
export const validate = ({ body, query, params }) => (req, res, next) => {
  try {
    if (body) req.body = body.parse(req.body);
    if (query) Object.defineProperty(req, 'query', { value: query.parse(req.query), writable: true, configurable: true });
    if (params) req.params = params.parse(req.params);
    next();
  } catch (err) { next(err); }
};
```
(In Express 5, `req.query` is a getter, so assign the parsed value to a different property like `req.validatedQuery`, or redefine it as shown.)

### C5. Central error handler with problem details
```js
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status ?? 500;
  res.status(status).type('application/problem+json').json({
    type: 'about:blank', title: status === 500 ? 'Internal Server Error' : err.message, status, instance: req.originalUrl, requestId: req.id,
  });
});
```

### C6. Request ID + pino logging
```js
import pino from 'pino'; import pinoHttp from 'pino-http';
const logger = pino({ redact: ['req.headers.authorization', 'req.headers.cookie'] });
app.use(pinoHttp({ logger, genReqId: (req, res) => { const id = req.get('x-request-id') ?? crypto.randomUUID(); res.setHeader('x-request-id', id); return id; } }));
```

### C7. Rate limiter middleware (sliding window with Redis)
```js
export const limiter = ({ limit = 100, windowSec = 60 } = {}) => async (req, res, next) => {
  const key = `rl:${req.user?.id ?? req.ip}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  res.set('RateLimit-Remaining', String(Math.max(0, limit - count)));
  if (count > limit) return res.set('Retry-After', String(windowSec)).status(429).json({ error: 'Too many requests' });
  next();
};
```
(This is a fixed window; a sliding window or token bucket is smoother. Use `express-rate-limit` with `rate-limit-redis` in production.)

### C8. Role-based access control middleware
Use `requireAuth` and `requireRole('admin')` from Part 2 (Q52): `router.delete('/:id', requireAuth, requireRole('admin'), removeUser)`.

### C9. Pagination helper
```js
export function paginate(req, { maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit, 10) || 20));
  return { page, limit, offset: (page - 1) * limit };
}
```

### C10. File upload with Multer (disk) and validation
```js
import multer from 'multer';
const upload = multer({
  storage: multer.diskStorage({ destination: 'uploads', filename: (req, f, cb) => cb(null, crypto.randomUUID() + path.extname(f.originalname)) }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, ['image/png', 'image/jpeg'].includes(file.mimetype)),
});
app.post('/avatar', requireAuth, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'A PNG or JPEG file is required' });
  res.status(201).json({ file: req.file.filename });
});
```
Also verify the real file type by magic bytes.

### C11. Pre-signed S3 upload URL endpoint
```js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
app.post('/uploads/sign', requireAuth, async (req, res) => {
  const key = `users/${req.user.sub}/${crypto.randomUUID()}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: process.env.BUCKET, Key: key, ContentType: 'image/png' }), { expiresIn: 60 });
  res.json({ url, key });
});
```

### C12. CORS configuration with an allow-list
```js
const allowed = new Set(['https://app.example.com', 'https://admin.example.com']);
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.has(origin)),
  credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], maxAge: 600,
}));
```

### C13. Graceful shutdown for Express
See Q60. Add readiness flip: set `ready = false` first, wait a few seconds for the load balancer to drain, then close the server and pools.

### C14. Health and readiness routes
```js
let ready = false;
app.get('/healthz', (req, res) => res.sendStatus(200));
app.get('/readyz', async (req, res) => {
  try { await db.query('SELECT 1'); res.sendStatus(ready ? 200 : 503); } catch { res.sendStatus(503); }
});
```

### C15. Per-route timeout and cancellation
See Q95.

### C16. SSE notifications endpoint
See Q72. Keep a `Map` of connected clients per user and clean up on `close`.

### C17. Webhook receiver with signature verification (HMAC)
```js
import { createHmac, timingSafeEqual } from 'node:crypto';
app.post('/webhooks/github', express.raw({ type: 'application/json' }), (req, res) => {
  const expected = 'sha256=' + createHmac('sha256', process.env.WEBHOOK_SECRET).update(req.body).digest('hex');
  const given = req.get('x-hub-signature-256') ?? '';
  const ok = given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return res.sendStatus(401);
  const event = JSON.parse(req.body.toString('utf8'));
  res.sendStatus(202);                                 // acknowledge fast, process in a queue
});
```

### C18. Idempotency-Key middleware
```js
export const idempotent = async (req, res, next) => {
  const key = req.get('idempotency-key');
  if (!key) return next();
  const cached = await redis.get(`idem:${req.user.sub}:${key}`);
  if (cached) { const { status, body } = JSON.parse(cached); return res.status(status).json(body); }
  const json = res.json.bind(res);
  res.json = (body) => { redis.set(`idem:${req.user.sub}:${key}`, JSON.stringify({ status: res.statusCode, body }), 'EX', 86_400); return json(body); };
  next();
};
```
(Production versions must also lock the key while the first request is in progress.)

### C19. Simple response cache middleware
```js
export const cacheGet = (ttlSec) => async (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = `cache:${req.originalUrl}`;
  const hit = await redis.get(key);
  if (hit) return res.set('X-Cache', 'HIT').type('json').send(hit);
  const send = res.json.bind(res);
  res.json = (body) => { redis.set(key, JSON.stringify(body), 'EX', ttlSec); return send(body); };
  next();
};
```
Never cache user-specific data under a shared key.

### C20. Supertest integration tests
See Q75. Add `beforeEach` DB reset and test auth, validation, 404 and error shapes.

### C21. Dockerfile for Express
```dockerfile
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
```

### C22. Router with versioning and mounting
```js
const v1 = Router();
v1.use('/users', usersRouter);
v1.use('/posts', postsRouter);
app.use('/api/v1', v1);
```

### C23. Compose security middleware in one function
```js
export const security = (app) => {
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(rateLimit({ windowMs: 60_000, limit: 300 }));
  app.use(express.json({ limit: '100kb' }));
};
```

### C24. Serve a React/Vite SPA with API fallback
```js
app.use('/api', apiRouter);
app.use(express.static(distDir, { maxAge: '1y', index: false }));
app.get('/{*splat}', (req, res) => res.sendFile(path.join(distDir, 'index.html')));     // Express 5 syntax (v4: app.get('*', ...))
```
Place the SPA fallback after API routes; do not cache `index.html` long-term.

---

# 🐞 Part 7: Debugging Scenarios

### D1. `Cannot GET /something`
No route matches. Check the HTTP method, the path (and prefix from `app.use('/api', router)`), trailing slash, the order of middleware, and that the router is mounted.

### D2. `req.body` is `undefined`
The JSON parser is missing, registered after the route, or the client sent the wrong `Content-Type` (needs `application/json`). In Express 5 `req.body` is `undefined` when no parser ran. Add `app.use(express.json())` before routes.

### D3. `Cannot set headers after they are sent to the client` (`ERR_HTTP_HEADERS_SENT`)
The response was sent twice, for example `res.send()` followed by `next()` or code after a missing `return`. Use `return res.json(...)`, and in error handlers check `res.headersSent`.

### D4. Request hangs forever
A handler never sends a response or calls `next()`, or an async error was lost (Express 4). Add `try/catch`/wrapper, ensure all branches respond, and add timeouts.

### D5. CORS error in the browser
The server must send `Access-Control-Allow-Origin` (and handle `OPTIONS` preflight) for the exact origin. Check that `cors()` is registered before routes, credentials settings match (`credentials: true` plus a specific origin), and that errors also include CORS headers (an error before the `cors` middleware skips it).

### D6. Cookies not being set or sent
Causes: `secure: true` over HTTP, `sameSite` mismatch for cross-site requests (`SameSite=None; Secure` needed), missing `credentials: 'include'` on the client, wrong domain/path, or `trust proxy` not set behind a proxy so `req.secure` is false (express-session then refuses to set secure cookies).

### D7. `req.ip` shows the proxy IP
Set `app.set('trust proxy', <hops>)`. Verify with `X-Forwarded-For`. This also fixes rate-limit keys and `req.protocol`.

### D8. Route order problem (specific route never reached)
`app.get('/users/:id')` registered before `app.get('/users/me')` captures `me` as an id. Register specific routes first or constrain the param.

### D9. Static files return 404
Wrong relative path (depends on `process.cwd()`), missing `path.join(import.meta.dirname, ...)`, mounted under a prefix, or files not copied into the Docker image.

### D10. Memory grows over time
Unbounded caches, per-request listeners added to `process`/shared emitters, storing `req`/`res` in globals, large session memory store, or logging huge objects. Use heap snapshots, bound caches, and Redis-based sessions.

### D11. Slow responses under load
Event loop blocked (sync work, big JSON, regex), DB pool exhausted, missing indexes, N+1 queries, or no timeouts. Check event loop lag, DB pool wait time, and traces.

### D12. `PayloadTooLargeError: request entity too large`
The body exceeded the parser limit. Increase the limit for specific routes only if necessary, or change the design (direct-to-storage uploads).

### D13. `SyntaxError: Unexpected token ... in JSON` (400)
The client sent invalid JSON. Handle it in the error middleware (`err.type === 'entity.parse.failed'`) and return a 400 with a clear message.

### D14. `TypeError: Cannot read properties of undefined (reading 'id')`
Usually `req.user` or `req.body` is missing because middleware ran in the wrong order or a param is optional. Validate and guard; make auth middleware run before handlers that need `req.user`.

### D15. 404 handler always runs / error handler never runs
Order issue: the 404 middleware was placed before routes, or the error handler was defined before routes (it must be last) or has fewer than 4 parameters (Express treats it as normal middleware).

### D16. Unhandled promise rejection kills the process (Express 4)
Async handlers need `.catch(next)` or a wrapper. Upgrade to Express 5, and keep a global `unhandledRejection` handler that logs and exits.

### D17. Session lost on every request or after deploy
Using the memory store with several instances or restarts. Use Redis, set `trust proxy`, and configure cookie flags correctly.

### D18. File upload fails with `Unexpected field`
The form field name does not match `upload.single('name')`. Check the client `FormData` key and `Content-Type: multipart/form-data` (let the browser set the boundary).

### D19. Webhook signature verification always fails
`express.json()` ran first and the raw bytes were lost. Use `express.raw()` for that route, mounted before the global JSON parser or scoped properly.

### D20. `502 Bad Gateway` from the load balancer randomly
Node keep-alive timeout is shorter than the balancer idle timeout (Q94), app crashes/restarts, or health checks fail. Check logs, timeouts and readiness probes.

### D21. High CPU in Express
Profile; typical causes are JSON serialization of huge objects, regex (ReDoS), sync crypto, template rendering without cache, or logging overhead. Offload to workers or cache.

### D22. `EADDRINUSE` when starting tests
Tests call `app.listen()` multiple times. Export `app` without listening and let Supertest manage ports, or listen on port `0`.

### D23. Query array/object surprises
`?id=1&id=2` becomes an array, `?a[b]=1` an object (depending on the query parser). Validate and normalize query values with a schema instead of assuming strings.

### D24. Debugging method (say this in interviews)
Reproduce → check metrics and logs by request ID → isolate the layer (proxy, middleware, handler, DB, downstream) → form a hypothesis → capture evidence (trace, profile, snapshot) → mitigate → fix root cause → add a test, alert and runbook note.


---

# 🧩 Part 8: Tricky Questions

### T1. Is Express a server?
Not by itself. `express()` returns a request-handler function `(req, res)`. `app.listen()` creates a Node `http.Server` with that function. You can pass `app` to `http.createServer(app)` or `https.createServer(opts, app)`.

### T2. Why does a middleware that never calls `next()` or responds hang the request?
Nothing continues the chain and nothing ends the response, so the client waits until a timeout. Every path must either respond or call `next()`.

### T3. `app.use('/api')` vs `app.get('/api')`
`use` matches `/api`, `/api/users`, `/api/anything` and any method, and strips the mount path from `req.url` inside it (`req.baseUrl` keeps it). `get('/api')` matches only `GET /api` exactly.

### T4. What is the difference between `req.url`, `req.originalUrl`, `req.baseUrl` and `req.path`?
For `app.use('/api', router)` and request `/api/users?x=1` inside the router: `req.originalUrl = '/api/users?x=1'`, `req.baseUrl = '/api'`, `req.url = '/users?x=1'`, `req.path = '/users'`. Use `originalUrl` for logs.

### T5. Does `res.send()` end the function?
No. Code after it still runs. Use `return res.send(...)` to stop and avoid "headers already sent".

### T6. `res.status(200)` alone: does it send?
No. It only sets the status code. You must call `send`, `json`, `end` or similar.

### T7. Why are `req.params.id` values strings?
URLs are text. Convert and validate (`Number(id)`, regex, schema). `"10" > "9"` is false for strings, a classic bug in comparisons.

### T8. Why is an error middleware ignored?
It needs exactly four parameters `(err, req, res, next)`, and must be registered after the routes. Arrow functions with three params are treated as normal middleware.

### T9. `throw` inside an async handler in Express 4?
It becomes an unhandled promise rejection (process may crash); the error middleware never runs. Express 5 catches it.

### T10. Can you call `next()` after sending a response?
You can, but the next layer may try to respond again, causing `ERR_HTTP_HEADERS_SENT`. Don't.

### T11. `next('route')` vs `next('router')`
`next('route')` skips remaining handlers of the current route and goes to the next matching route. `next('router')` leaves the current router and continues in the parent.

### T12. Why does `express.static` call `next()` for missing files?
So later routes can handle the request (or the 404 handler). Set `fallthrough: false` to return a 404 directly from the static middleware.

### T13. Is `app.use(express.json())` safe for every route?
It parses any JSON body up to the limit, even on routes that don't expect one. It's fine, but webhook routes needing raw bytes must use `express.raw()` and avoid prior JSON parsing.

### T14. Why can `express.json()` still pass `__proto__` keys?
`JSON.parse` creates own properties named `__proto__` safely, but merging parsed objects into other objects with naive deep-merge code can pollute prototypes. Validate shapes and avoid unsafe merges.

### T15. Does Express limit concurrency?
No. Node accepts connections until system limits. Add rate limiting, concurrency limits and timeouts yourself, and use `server.maxConnections` if needed.

### T16. Why do two instances behave differently with in-memory sessions or caches?
Each process has its own memory. Requests balanced across instances may land on a different one. Use shared stores (Redis) or sticky sessions (avoid when possible).

### T17. `res.redirect` default status?
302 (Found). Use 301/308 for permanent and 303/307 for method-specific behavior. Use 303 after a POST to redirect to a GET page.

### T18. `res.sendFile` requires what kind of path?
An absolute path, or a relative path with the `root` option. Otherwise it throws.

### T19. Why might `res.cookie` with `secure: true` not appear locally?
Browsers only store `Secure` cookies over HTTPS (localhost is an exception in some browsers). Behind a proxy you also need `trust proxy`.

### T20. Is `app.listen(3000)` a blocking call?
No. It starts listening asynchronously and returns the server immediately.

### T21. Are Express middleware functions called per request or once?
The function is created once; it is **called** for each matching request. Setup code outside the returned function runs once.

### T22. What does `app.disable('x-powered-by')` achieve?
It removes a header that reveals Express. It is minor security hygiene (Helmet does it too); it does not make an app secure.

### T23. `req.query` in Express 5 is a getter
You cannot assign `req.query = ...` directly; it is computed from the URL. Store validated values under a different property.

### T24. HEAD requests
Express automatically handles `HEAD` for routes defined with `GET` (runs the handler but sends no body), unless you define a `HEAD` route first.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| What is Express? | Minimal web framework for Node.js |
| Current major version? | 5 (v4 is still widespread) |
| Create app? | `const app = express()` |
| Start server? | `app.listen(port)` |
| Parse JSON body? | `express.json()` |
| Parse form body? | `express.urlencoded()` |
| Serve static files? | `express.static(dir)` |
| Group routes? | `express.Router()` |
| Middleware signature? | `(req, res, next)` |
| Error middleware signature? | `(err, req, res, next)` |
| Route param? | `req.params.id` |
| Query string? | `req.query.page` |
| Send JSON? | `res.json(obj)` |
| Set status? | `res.status(404)` |
| Redirect? | `res.redirect(url)` |
| Download a file? | `res.download(path)` |
| Read header? | `req.get('name')` |
| Set header? | `res.set('name', 'value')` |
| Set cookie? | `res.cookie(name, value, opts)` |
| Client IP? | `req.ip` (needs `trust proxy` behind proxies) |
| Match all methods? | `app.all()` |
| Mount at prefix? | `app.use('/api', router)` |
| Template rendering? | `res.render(view, data)` |
| Security headers? | `helmet()` |
| Cross-origin support? | `cors()` |
| Request logging? | `morgan` / `pino-http` |
| File upload? | `multer` |
| Rate limit? | `express-rate-limit` |
| Compression? | `compression()` |
| Test HTTP endpoints? | `supertest` |
| Validate input? | zod / joi / ajv |
| Session store in production? | Redis (`connect-redis`) |
| Hide framework header? | `app.disable('x-powered-by')` |
| Behind a proxy? | `app.set('trust proxy', n)` |
| Async errors in v4? | Wrapper / `.catch(next)` |
| Async errors in v5? | Automatic |
| Response sent twice error? | `ERR_HTTP_HEADERS_SENT` |
| Payload too large status? | 413 |
| Not authenticated status? | 401 |
| Not allowed status? | 403 |
| Validation failure status? | 400 or 422 |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult with real numbers.

### B1. Describe an API you designed or scaled.
**Sample (Ritesh Kumar):** *Situation:* Our order API handled 200 requests/s and slowed during sales. *Task:* Support 1,000 requests/s with p95 under 300 ms. *Action:* Added request tracing, found N+1 queries and a missing index, introduced Redis caching for catalog reads, moved email sending to a BullMQ worker, and tuned the DB pool. *Result:* p95 fell from 1.9 s to 240 ms; we handled 5x traffic with the same instance count.

### B2. A security issue you found or prevented.
Examples: IDOR on `/orders/:id` fixed by ownership checks and tests; rate limit added to login; secrets removed from logs; dependency vulnerability patched with automation. Show detection, fix, prevention.

### B3. A production incident you handled.
Cover detection, mitigation, root cause (e.g., missing timeout caused request pile-up), fix, prevention (alerts, runbooks, load test), and what changed in team practice.

### B4. How did you improve developer experience or consistency?
Created a service template with error handling, validation, logging, health checks, CI and Docker; documented conventions; added lint rules; reduced new service setup from days to hours.

### B5. How do you review Express pull requests?
Check auth and authorization, input validation, error paths, async correctness, SQL safety, logging of sensitive data, pagination limits, tests, and backward compatibility.

### B6. Migration experience (v4→v5, JS→TS, monolith split).
Slice the work, keep tests as a safety net, use feature flags and canary releases, and track metrics before/after.

### B7. Disagreement on framework or architecture.
Present data (benchmarks, risks, team skills), run a time-boxed spike, document the decision (ADR), and commit to the outcome.

### B8. How do you mentor juniors?
Pair on debugging with logs and traces, explain the middleware mental model, review error handling, and give a checklist for new endpoints (validation, auth, tests, docs, observability).

---

# 📚 Part 11: Complete Coverage (Built-ins + Middleware + Ecosystem + Mixed)

## Built-in API surface
- **Application:** `app.use`, `app.get/post/put/patch/delete/all`, `app.route`, `app.param`, `app.set/get`, `app.enable/disable`, `app.listen`, `app.engine`, `app.render`, `app.locals`, `app.mountpath`.
- **Request:** `req.params`, `req.query`, `req.body`, `req.headers`, `req.get()`, `req.is()`, `req.accepts()`, `req.ip`, `req.ips`, `req.protocol`, `req.secure`, `req.hostname`, `req.path`, `req.originalUrl`, `req.baseUrl`, `req.cookies`, `req.signedCookies`, `req.xhr`, `req.fresh`/`req.stale`.
- **Response:** `res.status`, `res.send`, `res.json`, `res.jsonp`, `res.sendStatus`, `res.sendFile`, `res.download`, `res.redirect`, `res.render`, `res.set/header`, `res.type`, `res.cookie/clearCookie`, `res.location`, `res.format`, `res.attachment`, `res.append`, `res.vary`, `res.locals`, `res.headersSent`.
- **Built-in middleware:** `express.json`, `express.urlencoded`, `express.raw`, `express.text`, `express.static`, `express.Router`.

## Common middleware and packages
`helmet`, `cors`, `morgan`, `pino-http`, `compression`, `cookie-parser`, `express-session`, `connect-redis`, `express-rate-limit`, `multer`, `csurf` (deprecated; use modern CSRF libraries like `csrf-csrf`), `passport`, `jsonwebtoken` / `jose`, `zod` / `joi` / `express-validator`, `http-errors`, `swagger-ui-express`, `method-override`, `express-async-errors` (v4 only).

## Ecosystem
Databases and ORMs: Prisma, Drizzle, TypeORM, Sequelize, Mongoose, Knex. Queues: BullMQ, KafkaJS, amqplib. Realtime: ws, Socket.IO. Observability: OpenTelemetry, prom-client, Sentry. Testing: Supertest, node:test, Jest, Vitest, Testcontainers. API docs: OpenAPI, Swagger UI. Alternatives: Fastify, Koa, NestJS, Hono.

## Mixed topics
REST design, authentication and authorization, security (OWASP Top 10), caching, pagination, file handling, background jobs, deployment (Docker, Kubernetes, serverless), scaling, observability, testing, and migration.

---

# 🔬 Part 12: Express Internals

### I1. What is `express()`?
A function `app(req, res, next)` with methods mixed in. Internally it has a lazy `Router` (`app.router` in v5). When called by Node's HTTP server, `app.handle(req, res)` starts the router.

### I2. Layers and the stack
Each `use`/route registration creates a **Layer** with a path matcher (via `path-to-regexp`) and a handle function. A Route has its own stack of layers per HTTP method. The router iterates `stack[idx++]`, matches the layer, and calls it with a `next` closure.

### I3. Request enhancement
Express sets the prototype of Node's `IncomingMessage` to its `request` prototype and `ServerResponse` to its `response` prototype, adding helpers like `req.get`, `res.json`, `res.status`. That is why `req` and `res` are still the native Node objects.

### I4. Error flow
`next(err)` sets an error state; the router then skips normal layers (arity < 4) and calls error layers (arity 4). If none handles it, Express's final handler (`finalhandler`) sends a 500 (or the `err.status`), including the stack only when `NODE_ENV !== 'production'`.

### I5. Async handling in v5
The router wraps handler calls: if the returned value is a promise, it attaches rejection handling that calls `next(err)`. This is why `async` handlers no longer need wrappers.

### I6. Path matching
Express 5 uses `path-to-regexp` v8. Params are named segments; wildcards must be named (`/*splat`); optional parts use braces `{ }`. Matching is case-insensitive and non-strict by default.

### I7. Body parsers
Built on `body-parser`: reads the request stream, checks `Content-Type`, enforces `limit`, decodes charset and inflates gzip/deflate, then sets `req.body`. Errors like `entity.too.large` carry `err.status` and `err.type`.

### I8. ETag and freshness
By default Express adds weak ETags to responses it sends via `res.send`. `req.fresh` compares `If-None-Match`/`If-Modified-Since` and returns `304` automatically, saving bandwidth but costing CPU for hashing.

### I9. Views
`res.render` looks up the template through the registered engine (`app.engine`), caches compiled templates when `view cache` is enabled (default in production), and calls `res.send` with the HTML.

### I10. The `http.Server` underneath
Timeouts (`keepAliveTimeout`, `headersTimeout`, `requestTimeout`), `maxHeadersCount`, and connection handling belong to Node's HTTP server, not Express. Configure them on the server object returned by `listen`.

---

# 📊 Part 13: Reference Tables

### Request/response quick map
| Need | Express API |
|---|---|
| Path params | `req.params` |
| Query | `req.query` |
| Body | `req.body` |
| Headers | `req.get('x')` |
| Cookies | `req.cookies` (cookie-parser) |
| Client IP | `req.ip` |
| JSON reply | `res.status(200).json(data)` |
| Created reply | `res.status(201).location(url).json(data)` |
| No content | `res.sendStatus(204)` |
| Redirect | `res.redirect(303, '/x')` |
| File | `res.sendFile(abs)` |
| Stream | `pipeline(stream, res)` |

### HTTP status guide
| Situation | Status |
|---|---|
| Success with data | 200 |
| Created | 201 |
| Accepted for async processing | 202 |
| Success, no body | 204 |
| Validation error | 400 / 422 |
| Not authenticated | 401 |
| Not authorized | 403 |
| Not found | 404 |
| Conflict (duplicate) | 409 |
| Unsupported media type | 415 |
| Too many requests | 429 |
| Server error | 500 |
| Bad gateway / unavailable / timeout | 502 / 503 / 504 |

### Express 4 → 5 cheat table
| v4 | v5 |
|---|---|
| `app.get('*', h)` | `app.get('/{*splat}', h)` |
| `/users/:id?` | `/users{/:id}` |
| `app.del()` | `app.delete()` |
| `res.send(404)` | `res.sendStatus(404)` |
| `res.json(obj, 201)` | `res.status(201).json(obj)` |
| `req.param('id')` | `req.params.id` / `req.query.id` / `req.body.id` |
| async wrapper required | automatic |
| `res.redirect('back')` | `res.redirect(req.get('Referrer') \|\| '/')` |

### Middleware order template
| Position | Middleware |
|---|---|
| 1 | trust proxy, request ID, logger |
| 2 | helmet, cors |
| 3 | rate limit |
| 4 | body parsers with limits |
| 5 | auth/session |
| 6 | routes (validate → authorize → handler) |
| 7 | 404 handler |
| 8 | error handler |

### Framework comparison (short)
| Framework | Strength |
|---|---|
| Express | Ecosystem and simplicity |
| Fastify | Speed and schemas |
| Koa | Minimal core |
| NestJS | Structure and DI |
| Hono | Portability across runtimes |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Middleware order
```js
app.use((req, res, next) => { console.log('A'); next(); });
app.get('/', (req, res, next) => { console.log('B'); next(); }, (req, res) => { console.log('C'); res.send('ok'); });
app.use((req, res) => console.log('D'));
```
**Output for `GET /`:** `A, B, C`. `D` never runs because `C` ended the response without calling `next`.

### O2. Forgotten `return`
```js
app.get('/', (req, res) => {
  if (!req.query.id) res.status(400).send('missing');
  res.send('ok');
});
```
**Result for `GET /`:** The first send works; the second throws `ERR_HTTP_HEADERS_SENT`. Fix: `return res.status(400).send(...)`.

### O3. Route order
```js
app.get('/users/:id', (req, res) => res.send('id'));
app.get('/users/me', (req, res) => res.send('me'));
```
**Result for `/users/me`:** `id`. The param route matches first.

### O4. Error handler arity
```js
app.get('/', () => { throw new Error('x'); });
app.use((err, req, res) => res.status(500).send('handled'));
```
**Result:** Not handled by this function (only 3 params), so Express's default handler responds with a 500 and a stack trace in development.

### O5. `app.use` strips the prefix
```js
app.use('/api', (req, res) => res.json({ url: req.url, base: req.baseUrl, original: req.originalUrl }));
// GET /api/users
```
**Output:** `{ "url": "/users", "base": "/api", "original": "/api/users" }`.

### O6. Async error in Express 4 vs 5
```js
app.get('/', async () => { throw new Error('boom'); });
app.use((err, req, res, next) => res.status(500).send('handled'));
```
**Express 5:** `handled`. **Express 4:** the request hangs and an unhandled rejection is raised.

### O7. Body without a parser
```js
app.post('/', (req, res) => res.json({ body: req.body ?? null }));
```
**Result (Express 5, no parser):** `{ "body": null }`. In Express 4 it was `undefined`, so `JSON.stringify` omitted the key and the response was `{}`.

### O8. Status without sending
```js
app.get('/', (req, res) => { res.status(201); });
```
**Result:** The request hangs; nothing is sent.

### O9. `next('route')`
```js
app.get('/', (req, res, next) => next('route'), (req, res) => res.send('skipped'));
app.get('/', (req, res) => res.send('second route'));
```
**Output:** `second route`.

### O10. Query array
```js
// GET /?tag=a&tag=b
app.get('/', (req, res) => res.json({ tag: req.query.tag }));
```
**Output:** `{ "tag": ["a", "b"] }`. Repeated keys become arrays; validate the type.

### O11. `res.send` object vs string
```js
res.send({ a: 1 });   // Content-Type: application/json
res.send('<b>x</b>'); // Content-Type: text/html
```

### O12. Static fallthrough
```js
app.use(express.static('public'));
app.get('/logo.png', (req, res) => res.send('route'));
```
**Result:** If `public/logo.png` exists, the file is served and the route is never reached (static comes first). Otherwise the route runs.

### O13. Cookie reading without parser
```js
app.get('/', (req, res) => res.send(String(req.cookies)));
```
**Output:** `undefined` unless `cookie-parser` is installed.

### O14. Mounted router and `req.params`
```js
const r = Router();
r.get('/', (req, res) => res.json(req.params));
app.use('/users/:userId', r);
// GET /users/5
```
**Output:** `{}` (without `mergeParams: true`). With `Router({ mergeParams: true })`: `{ "userId": "5" }`.

### O15. Headers case
```js
req.get('Content-Type') === req.get('content-type')
```
**Result:** `true`; header lookup is case-insensitive.

---

# ✅ Part 15: MCQs

**1.** Which Express method parses JSON bodies?
A) `express.body()` B) `express.json()` C) `express.parse()` D) `app.json()`

**2.** Error-handling middleware has how many parameters?
A) 2 B) 3 C) 4 D) 5

**3.** Which call passes control to the next middleware?
A) `res.next()` B) `next()` C) `app.next()` D) `continue()`

**4.** `app.use('/api', fn)` matches:
A) Only `/api` B) `/api` and paths under it, any method C) Only GET D) Only POST

**5.** Which makes `req.ip` correct behind a proxy?
A) `app.set('proxy', true)` B) `app.set('trust proxy', 1)` C) `app.enable('ip')` D) Nothing needed

**6.** Which status means "not authenticated"?
A) 400 B) 401 C) 403 D) 404

**7.** Which package adds security headers?
A) cors B) helmet C) morgan D) multer

**8.** Which handles `multipart/form-data` uploads?
A) `express.json` B) `multer` C) `cookie-parser` D) `compression`

**9.** In Express 5, rejected promises in async handlers are:
A) Ignored B) Forwarded to the error handler C) Logged only D) Retried

**10.** Which is the Express 5 equivalent of `app.get('*')`?
A) `app.get('/*')` B) `app.get('/{*splat}')` C) `app.get('.*')` D) `app.any()`

**11.** Which stores sessions suitably for production?
A) Memory store B) Redis store C) `localStorage` D) A global variable

**12.** `res.sendStatus(204)` does what?
A) Sends 204 with body "No Content" semantics B) Sets status only C) Redirects D) Throws

**13.** Which header must be longer than the load balancer idle timeout?
A) `Content-Length` B) `server.keepAliveTimeout` C) `Cache-Control` D) `ETag`

**14.** Where should the 404 handler go?
A) First B) After all routes C) Inside each route D) Anywhere

**15.** Which keeps raw bytes for signature verification?
A) `express.json()` B) `express.raw()` C) `express.static()` D) `express.urlencoded()`

**16.** Best way to avoid SQL injection?
A) String concatenation B) Parameterized queries C) Remove quotes D) Base64 input

**17.** `Router({ mergeParams: true })` allows:
A) Merging routers B) Child router to read parent params C) Merging query strings D) Combining bodies

**18.** Which is not a response method?
A) `res.json` B) `res.send` C) `res.redirect` D) `res.parse`

**19.** `req.params.id` is of type:
A) Number B) String C) Boolean D) Object always

**20.** Which tool tests Express endpoints without opening a port manually?
A) Supertest B) Nodemon C) Morgan D) Helmet

**21.** CORS is enforced by:
A) The server only B) The browser C) The database D) DNS

**22.** Which is true about `app.listen()`?
A) Returns `http.Server` B) Blocks forever C) Returns a promise always D) Returns nothing

**23.** Which prevents a response from being sent twice?
A) Calling `next()` after send B) `return res.send(...)` C) Using `res.end()` twice D) Removing middleware

**24.** The best location for config validation:
A) Inside each handler B) At application startup C) In the browser D) In tests only

**25.** A stateless API means:
A) No database B) Each request carries what the server needs; no per-client server memory C) No authentication D) No caching

**26.** `res.locals` is for:
A) Global settings B) Per-request data shared with views/middleware C) Cookies D) Database rows

**27.** Which mitigates CSRF for cookie auth?
A) `SameSite` cookies and CSRF tokens B) Longer passwords C) Gzip D) ETags

**28.** Which HTTP status for rate limiting?
A) 401 B) 408 C) 429 D) 503

**29.** `express.static` serves files from:
A) A database B) A directory on disk C) Memory only D) The browser

**30.** What does `compression()` do?
A) Minifies JS B) Compresses HTTP responses C) Zips uploads D) Encrypts data

### Answer key
1-B, 2-C, 3-B, 4-B, 5-B, 6-B, 7-B, 8-B, 9-B, 10-B, 11-B, 12-A, 13-B, 14-B, 15-B, 16-B, 17-B, 18-D, 19-B, 20-A, 21-B, 22-A, 23-B, 24-B, 25-B, 26-B, 27-A, 28-C, 29-B, 30-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Sending the response twice
❌
```js
app.get('/user', (req, res) => {
  if (!req.query.id) res.status(400).json({ error: 'id required' });
  res.json(getUser(req.query.id));
});
```
🤔 The first `res.json` does not stop the function, so the second one throws `ERR_HTTP_HEADERS_SENT`.
✅
```js
app.get('/user', (req, res) => {
  if (!req.query.id) return res.status(400).json({ error: 'id required' });
  res.json(getUser(req.query.id));
});
```
💬 "I always return when I send an early response."

### Mistake 2: Async errors not forwarded (Express 4)
❌
```js
app.get('/u/:id', async (req, res) => res.json(await db.user(req.params.id)));
```
🤔 If the DB call rejects, Express 4 never sees the error; the request hangs.
✅
```js
app.get('/u/:id', asyncHandler(async (req, res) => res.json(await db.user(req.params.id))));
// or upgrade to Express 5, which handles this natively
```
💬 "Express 4 needs a wrapper; Express 5 forwards rejected promises automatically."

### Mistake 3: Error handler in the wrong place or with wrong arity
❌
```js
app.use((err, req, res) => res.status(500).send('error'));   // 3 params
app.get('/', routeHandler);                                  // registered after
```
🤔 Express recognizes error handlers by exactly four parameters and runs them only for errors that occurred earlier in the chain.
✅
```js
app.get('/', routeHandler);
app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server error' }));
```
💬 "Four arguments, registered last."

### Mistake 4: Trusting input
❌
```js
app.post('/users', async (req, res) => res.json(await db.insert(req.body)));
```
🤔 Users can send extra fields (`role: 'admin'`), wrong types or huge values (mass assignment, injection).
✅
```js
app.post('/users', validate({ body: CreateUser }), async (req, res) => res.status(201).json(await userService.create(req.body)));
```
💬 "Every input is validated and whitelisted with a schema."

### Mistake 5: SQL built from strings
❌
```js
db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
```
🤔 Allows SQL injection.
✅
```js
db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
```
💬 "Parameterized queries only."

### Mistake 6: Leaking error details
❌
```js
app.use((err, req, res, next) => res.status(500).json({ message: err.message, stack: err.stack }));
```
🤔 Stack traces and internal messages help attackers.
✅
```js
app.use((err, req, res, next) => {
  req.log.error(err);
  res.status(err.status ?? 500).json({ error: err.expose ? err.message : 'Internal server error', requestId: req.id });
});
```
💬 "Log details internally, return a safe message with a request ID."

### Mistake 7: Using the memory session store in production
❌
```js
app.use(session({ secret: 'x' }));        // default MemoryStore
```
🤔 Leaks memory, loses sessions on restart, and breaks with multiple instances.
✅
```js
app.use(session({ store: new RedisStore({ client }), secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
```
💬 "Sessions live in Redis so any instance can serve any user."

### Mistake 8: Forgetting `trust proxy`
❌
```js
app.use(rateLimit({ limit: 100 }));   // behind Nginx, no trust proxy
```
🤔 `req.ip` is the proxy's address, so all users share one limit and secure cookies may not work.
✅
```js
app.set('trust proxy', 1);
app.use(rateLimit({ limit: 100 }));
```
💬 "I configure the exact number of trusted proxy hops."

### Mistake 9: Wrong middleware order
❌
```js
app.use('/api', routes);
app.use(express.json());
```
🤔 Routes run before the body is parsed, so `req.body` is empty.
✅
```js
app.use(express.json());
app.use('/api', routes);
```
💬 "Parsers and security first, routes next, error handling last."

### Mistake 10: CORS `*` with credentials
❌
```js
app.use(cors({ origin: '*', credentials: true }));
```
🤔 Browsers reject this combination; reflecting any origin is also unsafe.
✅
```js
app.use(cors({ origin: ['https://app.example.com'], credentials: true }));
```
💬 "I allow-list exact origins."

### Mistake 11: Business logic inside route handlers
❌
```js
app.post('/orders', async (req, res) => {
  // 150 lines of pricing, stock, email, DB logic
});
```
🤔 Hard to test, reuse and maintain.
✅
```js
app.post('/orders', validate(...), async (req, res) => res.status(201).json(await orderService.place(req.user, req.body)));
```
💬 "Controllers are thin; services hold the business logic."

### Mistake 12: Creating DB connections per request
❌
```js
app.get('/x', async (req, res) => { const client = new Client(url); await client.connect(); /* ... */ });
```
🤔 Slow, and exhausts database connections under load.
✅
```js
const pool = new Pool({ connectionString: url, max: 10 });      // once at startup
app.get('/x', async (req, res) => res.json((await pool.query('SELECT 1')).rows));
```
💬 "One pool for the process, sized to the database capacity."

### Mistake 13: No timeouts and no graceful shutdown
❌
```js
app.listen(3000);
```
🤔 Slow clients and dependencies hold resources; deployments cut requests.
✅
```js
const server = app.listen(3000);
server.requestTimeout = 30_000; server.keepAliveTimeout = 65_000;
process.on('SIGTERM', () => server.close(() => pool.end().then(() => process.exit(0))));
```
💬 "Timeouts everywhere and graceful shutdown on SIGTERM."

### Mistake 14: Blocking the event loop in a handler
❌
```js
app.get('/hash', (req, res) => res.send(crypto.pbkdf2Sync(pw, salt, 1e6, 64, 'sha512')));
```
🤔 Sync CPU work freezes all requests.
✅
```js
app.get('/hash', async (req, res) => res.send(await pbkdf2Async(pw, salt)));    // or a worker thread
```
💬 "Async or worker threads for heavy work."

### Mistake 15: Storing secrets in code or logs
❌
```js
const secret = 'my-secret'; console.log(req.headers);
```
🤔 Secrets leak through Git and logs.
✅
```js
const secret = process.env.JWT_SECRET;       // from a secret manager; logger redacts authorization/cookie headers
```
💬 "Secrets come from the environment and are redacted in logs."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "What is middleware?" | "A function between request and response." | "A function in an ordered stack; it can modify req/res, end the response, or call next; order matters; errors skip to 4-argument handlers." |
| "How do you handle errors?" | "try/catch in each route." | "Throw typed errors, forward to a central handler, safe responses, structured logs with request IDs; Express 5 handles async rejections natively." |
| "How do you secure Express?" | "Use JWT." | "Validation, parameterized queries, helmet, strict CORS, rate limits, hashed passwords, secure cookies, dependency audits, least privilege." |
| "How do you scale it?" | "More servers." | "Stateless services, Redis for shared state, queues for slow work, DB tuning, caching, timeouts, and metrics (p95, loop lag)." |
| "Express vs Fastify?" | "Fastify is faster." | "Compare ecosystem, validation, team skills, and performance needs; DB and architecture dominate latency." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Builds endpoints only | Thinks about validation, auth, errors, logs and tests for each |
| Puts everything in `server.js` | Separates app, server, routes, services, repositories |
| Debugs with `console.log` | Uses request IDs, traces, profiles |
| Ignores deployment | Knows proxies, timeouts, health checks, graceful shutdown |
| Copies middleware blindly | Knows what each does and its order |

### Signal table 3: Phrases that show depth
- "Express is a thin layer over Node's `http` module."
- "I split `app` from `server` so tests can use Supertest."
- "Webhook routes need the raw body, so I scope the parsers."
- "I set `trust proxy` to the exact number of hops."
- "Timeouts must also cancel downstream work."
- "I design endpoints to be idempotent because retries happen."

### Signal table 4: Questions to ask the interviewer
- How do you structure services and share code between them?
- What is your approach to API versioning and deprecation?
- Which observability stack do you use, and what are your SLOs?
- How do you handle auth (sessions vs tokens) and secrets?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
Express is a small layer on Node's HTTP server. A request flows through an ordered stack of middleware and routes. Each function can respond or call `next()`. Errors go to four-argument handlers. Everything else (validation, auth, logging, database) you add yourself.

### 2. Request lifecycle
```
Client → Load balancer/proxy → Node http.Server → Express app
 → request ID/logger → helmet/cors → rate limit → body parsers
 → auth → router → validate → authorize → controller → service → DB
 → response  (errors → 404 handler → error handler)
```

### 3. Skeleton to memorize
```js
const app = express();
app.disable('x-powered-by'); app.set('trust proxy', 1);
app.use(requestId, logger, helmet(), cors(opts), rateLimit(opts), express.json({ limit: '100kb' }));
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);
export { app };               // server.js: listen + graceful shutdown
```

### 4. Production checklist
- [ ] Express 5 (or v4 with async wrapper), active Node LTS
- [ ] Config validated at startup; secrets from a manager
- [ ] Structured logs, request IDs, redaction
- [ ] Validation on every input; parameterized queries
- [ ] Central error handler, safe messages
- [ ] Helmet, strict CORS, rate limits, body limits
- [ ] `trust proxy` set; secure cookies
- [ ] Timeouts (server, routes, outbound, DB)
- [ ] Health and readiness endpoints; graceful shutdown
- [ ] Redis for sessions/rate limits across instances
- [ ] Metrics, traces, alerts
- [ ] Tests (unit, Supertest, a few end-to-end)
- [ ] Non-root Docker image, `npm ci --omit=dev`

### 5. Status code cheat
200 OK · 201 Created · 202 Accepted · 204 No Content · 400/422 bad input · 401 unauthenticated · 403 forbidden · 404 not found · 409 conflict · 413 too large · 429 rate limited · 500 server error · 502/503/504 upstream problems.

### 6. Top 15 one-liners
1. Middleware order is behavior.
2. Error handlers have four parameters and come last.
3. Always `return` after sending early responses.
4. Express 5 handles async errors; Express 4 needs wrappers.
5. Validate everything with schemas.
6. Parameterized queries always.
7. Hash passwords with argon2 or bcrypt.
8. `helmet`, `cors` allow-list, rate limit.
9. Sessions in Redis, not memory.
10. `trust proxy` behind load balancers.
11. `keepAliveTimeout` above the load balancer timeout.
12. Split `app` and `server`.
13. Controllers thin, services thick.
14. Graceful shutdown on SIGTERM.
15. Measure before optimizing.

### 7. The 60-second answer: "Why Express?"
"Express is minimal and flexible, with the largest Node ecosystem and a very small learning curve. Express 5 fixed async error handling. I use it with a clear structure, schema validation, a central error handler, and production basics like timeouts, observability and graceful shutdown. If a team needs strict structure I'd consider NestJS, and for maximum throughput with schemas, Fastify."

### 8. Final revision order
Middleware and routing → error handling → validation and security → auth and sessions → structure and testing → performance and scaling → deployment and debugging stories.

