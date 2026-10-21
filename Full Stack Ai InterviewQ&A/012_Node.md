# Node.js Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** Covers **modern Node.js (v20 / v22 / v24 LTS lines)**: ES modules, built-in `fetch`, the built-in test runner, `--env-file`, `--watch`, Web Streams, `AbortSignal` APIs, worker threads, and newer features such as `require(esm)` and type stripping. Features that are experimental or version-dependent are marked. Express/Fastify framework questions live in the next file (`013_Express`); this file focuses on **Node core and runtime**.
>
> **Levels:** 🟢 Fresher (0–1) · 🔵 Junior (1–3) · 🟡 Mid (3–5) · 🟠 Senior (5–7) · 🔴 Lead/Architect (7+)
>
> **Question types in this file:**
> Conceptual · Comparison · Tricky/gotcha · Coding/machine-coding · Debugging (errors/incidents) · Scenario · Architecture · Rapid-fire · Project/behavioral · Output-based · MCQ
>
> **Golden rule:** Node answers are strongest when you explain **who does the work**: the JavaScript thread (V8), the OS (async I/O through libuv), or the libuv thread pool. Always ask: *"Does this block the event loop?"*

## 📑 Index
- [Part 1: Fresher](#-part-1-fresher-01-year)
- [Part 2: Junior](#-part-2-junior-13-years)
- [Part 3: Mid](#-part-3-mid-35-years)
- [Part 4: Senior](#-part-4-senior-57-years)
- [Part 5: Lead / Architect](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky / Gotcha Questions](#-part-8-tricky--gotcha-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Core Modules + Tooling + Ecosystem + Mixed)](#-part-11-complete-coverage-core-modules--tooling--ecosystem--mixed)
- [Part 12: Node.js Internals](#-part-12-nodejs-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Node.js? *(Conceptual)*
**Answer:** Node.js is a **JavaScript runtime** built on Chrome's **V8 engine** that lets you run JavaScript outside the browser (servers, CLIs, tools). It is **event-driven** and uses **non-blocking I/O** (through the **libuv** library), which makes it efficient for I/O-heavy workloads such as APIs, proxies, real-time apps and streaming.

Node = **V8** (executes JS) + **libuv** (event loop, async I/O, thread pool) + **C++ bindings** + a **core library** (`fs`, `http`, `crypto`, `stream`...).

### Q2. Is Node.js single-threaded? *(Must-know)*
**Answer:** Your JavaScript runs on **one main thread** (one call stack). But Node is not "only one thread": libuv uses a **thread pool** (default 4 threads) for some tasks (file system, DNS lookup, crypto like `pbkdf2/scrypt`, `zlib`), the OS handles network I/O asynchronously, and you can use **worker threads**, **child processes** and **cluster** for more parallelism. So: *single-threaded JavaScript execution, multi-threaded runtime.*

### Q3. What is the event loop? *(Must-know)*
The event loop is the mechanism that lets Node handle many operations without blocking: when an async operation finishes, its callback is queued, and the loop runs it when the call stack is empty. Phases (each has a callback queue):
1. **timers** (`setTimeout`, `setInterval`)
2. **pending callbacks** (some system errors)
3. **idle, prepare** (internal)
4. **poll** (retrieve new I/O events, run I/O callbacks; may wait here)
5. **check** (`setImmediate`)
6. **close callbacks** (`socket.on('close')`)
Between each callback/phase Node drains **`process.nextTick`** first, then **promise microtasks**.

### Q4. Blocking vs non-blocking code
```js
import fs from 'node:fs';
const data = fs.readFileSync('big.txt');            // BLOCKING: nothing else runs until finished
fs.readFile('big.txt', (err, data) => { /*...*/ }); // NON-BLOCKING: the loop continues; callback runs later
const data2 = await fs.promises.readFile('big.txt');// non-blocking with promises
```
Blocking the event loop (sync I/O, huge loops, `JSON.parse` of huge strings, heavy regex) delays **every** request. Use sync APIs only at startup/CLI scripts.

### Q5. What is `process.nextTick` vs `setImmediate` vs `setTimeout(fn, 0)`?
| API | When it runs |
|---|---|
| `process.nextTick(fn)` | **Right after the current operation**, before the event loop continues (before promise microtasks) |
| `Promise.then` / `queueMicrotask` | Microtask queue, after nextTick, before the next macrotask |
| `setTimeout(fn, 0)` | **timers** phase of the next loop iteration (min ~1 ms) |
| `setImmediate(fn)` | **check** phase, right after the poll phase |
Overusing `nextTick` recursively can **starve** I/O.

### Q6. What are the module systems in Node? CommonJS vs ES Modules *(Must-know)*
| | CommonJS (CJS) | ES Modules (ESM) |
|---|---|---|
| Syntax | `require()`, `module.exports` | `import`, `export` |
| Loading | Synchronous | Asynchronous, static analysis |
| File extension / config | `.js` (default), `.cjs` | `.mjs`, or `.js` with `"type": "module"` |
| `__dirname`, `__filename` | ✅ | ❌ (use `import.meta.dirname` / `import.meta.filename` in Node 20.11+/21.2+, or `fileURLToPath(import.meta.url)`) |
| Top-level `await` | ❌ | ✅ |
| Exports | Value copies (mostly) | **Live bindings** |
| Interop | `import()` can load ESM; `require(esm)` supported in newer Node versions (22.12+ unflagged) | `import cjs from './x.cjs'` works (default export = `module.exports`) |
```js
// ESM
import fs from 'node:fs/promises';
export function read(p) { return fs.readFile(p, 'utf8'); }
// CJS
const fs = require('node:fs/promises');
module.exports = { read: (p) => fs.readFile(p, 'utf8') };
```
Use the `node:` prefix for built-in modules (`node:fs`), which makes them explicit.

### Q7. `module.exports` vs `exports`
`exports` is a **reference** to `module.exports` initially. Assigning properties (`exports.a = 1`) works; reassigning `exports = {...}` breaks the link, so nothing is exported. Always use `module.exports = ...` when replacing the whole export.

### Q8. What is `package.json`? Important fields
`name`, `version`, `type` (`module`/`commonjs`), `main`, `exports` (modern entry points, conditional exports), `imports` (private aliases `#utils`), `scripts`, `dependencies`, `devDependencies`, `peerDependencies`, `engines` (Node version), `bin` (CLI), `files` (published files), `private`.
```json
{
  "name": "my-api", "version": "1.0.0", "type": "module",
  "scripts": { "start": "node server.js", "dev": "node --watch server.js", "test": "node --test" },
  "engines": { "node": ">=20" }
}
```

### Q9. What is npm? npm vs npx vs pnpm vs yarn
`npm` is Node's package manager. `npx` runs a package binary without installing it globally. `pnpm` uses a content-addressable store and symlinks (fast, disk-efficient, strict dependency resolution). `yarn` is another manager (classic and Berry). `corepack` manages package-manager versions. Commit the **lockfile** (`package-lock.json`, `pnpm-lock.yaml`) and use `npm ci` in CI for reproducible installs.

### Q10. What are `dependencies`, `devDependencies` and `peerDependencies`?
`dependencies`: needed at runtime. `devDependencies`: build/test tools (not installed with `npm install --omit=dev` in production). `peerDependencies`: the **host** project must provide it (libraries/plugins). `optionalDependencies`: install failure is tolerated.

### Q11. What is semantic versioning (semver)? `^` vs `~`
`MAJOR.MINOR.PATCH`: major = breaking changes, minor = backward-compatible features, patch = fixes. `^1.2.3` allows `>=1.2.3 <2.0.0`. `~1.2.3` allows `>=1.2.3 <1.3.0`. Exact version `1.2.3` pins it.

### Q12. What is an error-first callback?
Node's classic convention: the first callback argument is an error (or `null`).
```js
fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```
Promises and `async/await` are preferred today (`fs/promises`, `util.promisify`).

### Q13. Promises and `async/await` in Node
```js
import { readFile } from 'node:fs/promises';
async function load() {
  try { return JSON.parse(await readFile('config.json', 'utf8')); }
  catch (err) { if (err.code === 'ENOENT') return {}; throw err; }
}
const [a, b] = await Promise.all([fetch(urlA), fetch(urlB)]);       // parallel
```
Unhandled promise rejections **crash the process** by default (since Node 15).

### Q14. What is `EventEmitter`?
The base class for event-driven code (streams, servers and sockets extend it).
```js
import { EventEmitter } from 'node:events';
class Orders extends EventEmitter {}
const orders = new Orders();
orders.on('created', (o) => console.log('created', o.id));
orders.once('first', () => console.log('only once'));
orders.emit('created', { id: 1 });
```
An `'error'` event with **no listener throws** and can crash the process. Listeners run **synchronously** in registration order.

### Q15. What are Buffers?
Fixed-size chunks of raw binary data (allocated outside the V8 heap), used for files, network, crypto.
```js
const b = Buffer.from('hello', 'utf8');       // <Buffer 68 65 6c 6c 6f>
b.toString('hex'); b.toString('base64'); Buffer.concat([b, b]);
Buffer.alloc(10);                              // zero-filled (safe)
Buffer.allocUnsafe(10);                        // uninitialized (fast; may contain old data!)
```

### Q16. What are streams? Types
Streams process data in **chunks** instead of loading everything in memory.
| Type | Example |
|---|---|
| Readable | `fs.createReadStream`, HTTP request (server side), `process.stdin` |
| Writable | `fs.createWriteStream`, HTTP response, `process.stdout` |
| Duplex | TCP socket |
| Transform | `zlib.createGzip()`, `crypto` ciphers |
```js
import { pipeline } from 'node:stream/promises';
await pipeline(fs.createReadStream('in.txt'), zlib.createGzip(), fs.createWriteStream('in.txt.gz'));
```
Use `pipeline` (handles errors and cleanup) instead of manual `.pipe()`.

### Q17. What is backpressure?
When a writable cannot consume data as fast as the readable produces it, its buffer fills. `writable.write()` returns `false` to signal "slow down"; the producer should wait for the `'drain'` event. `pipeline` and `.pipe()` handle this automatically. Ignoring it causes memory growth.

### Q18. How do you create a basic HTTP server?
```js
import http from 'node:http';
const server = http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true })); }
  res.writeHead(404).end('Not found');
});
server.listen(3000, () => console.log('http://localhost:3000'));
```
Frameworks (Express, Fastify, Koa, Hono) add routing, middleware and conveniences on top of this.

### Q19. What are global objects in Node?
`globalThis`, `process`, `Buffer`, `console`, timers (`setTimeout`...), `queueMicrotask`, `structuredClone`, `fetch`, `AbortController`, `URL`, `TextEncoder/Decoder`, `performance`, `crypto` (Web Crypto). In CJS also `require`, `module`, `exports`, `__dirname`, `__filename` (module-scoped, not truly global).

### Q20. How do you read environment variables?
```js
const port = Number(process.env.PORT ?? 3000);
```
All values are **strings**. Load a file with `node --env-file=.env server.js` (Node 20.6+) or `dotenv`. Never commit secrets; validate config at startup.

### Q21. What is the `path` module and why use it?
Builds OS-safe file paths.
```js
import path from 'node:path';
path.join('a', 'b', '../c');          // 'a/c'
path.resolve('src', 'index.js');      // absolute path
path.basename('/x/y.txt'); path.extname('y.txt'); path.dirname('/x/y.txt');
```

### Q22. `fs` module: sync, callback and promise APIs
```js
import fs from 'node:fs';
import { readFile, writeFile, mkdir, readdir, stat, rm } from 'node:fs/promises';
await mkdir('out', { recursive: true });
await writeFile('out/a.txt', 'hi');
const files = await readdir('out', { withFileTypes: true });
```
Prefer `fs/promises`. For large files use streams.

### Q23. How do you handle errors in Node?
- Synchronous: `try/catch`.
- Async/await: `try/catch` around `await`.
- Callbacks: check `err` first.
- Streams/emitters: listen to `'error'` events.
- Process level: `process.on('uncaughtException')` / `'unhandledRejection'` for **logging and graceful exit** (not for continuing).
Distinguish **operational errors** (network down, invalid input: handle) from **programmer errors** (bugs: crash and restart).

### Q24. What is REPL? What is the Node CLI?
`node` without a file starts the REPL (interactive shell). Useful flags: `node -e "console.log(1)"`, `node --watch app.js`, `node --test`, `node --env-file=.env app.js`, `node --inspect app.js`, `node --max-old-space-size=4096 app.js`.

### Q25. What is middleware? (concept)
A function in a request pipeline that receives the request/response (and often `next`) and can modify them, end the response, or pass control on. Frameworks like Express/Koa provide this pattern (see next file).

### Q26. What are the advantages and disadvantages of Node.js?
**Advantages:** one language across front and back end, huge npm ecosystem, great for I/O-heavy and real-time apps, fast development, small footprint, good tooling. **Disadvantages:** poor for CPU-bound work on the main thread (needs workers), callback/async complexity, dependency quality/security risk, weak typing unless TypeScript is used, and frequent ecosystem changes.

### Q27. When should you use (or avoid) Node.js?
Use: REST/GraphQL APIs, real-time chat, streaming, proxies, BFFs, microservices, tooling, serverless functions. Avoid (or offload): heavy CPU tasks (video encoding, ML training, large image processing) on the main thread; use worker threads, a separate service, or another language.

### Q28. What is a callback hell and how do you avoid it?
Deeply nested callbacks. Avoid with promises and `async/await`, named functions, `Promise.all`, and utilities like `util.promisify`.

### Q29. What are `process.argv`, `process.cwd()`, `process.exit()`?
`process.argv` = array of command-line args (`[node, script, ...args]`). `process.cwd()` = current working directory. `process.exit(code)` ends the process immediately (pending async work is dropped). Prefer setting `process.exitCode` and letting the loop drain when possible.

### Q30. How do you debug Node apps?
`console.log` (quick), `node --inspect` or `--inspect-brk` + Chrome DevTools or VS Code debugger, breakpoints, `debugger;` statement, `NODE_DEBUG=http,net` for core module logs, `--trace-warnings`, `--trace-uncaught`, and logging libraries (pino).

### Q31. What is the `os` module used for?
System info: `os.cpus()`, `os.availableParallelism()`, `os.totalmem()`, `os.freemem()`, `os.platform()`, `os.hostname()`, `os.tmpdir()`.

### Q32. How do you make an HTTP request from Node?
```js
const res = await fetch('https://api.example.com/users', { signal: AbortSignal.timeout(5000) });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const users = await res.json();
```
`fetch` is built in (powered by undici). Older code uses `axios`, `node-fetch`, `got`, or `http.request`.

### Q33. What are timers in Node?
`setTimeout`, `setInterval`, `setImmediate`, and promise versions in `node:timers/promises` (`await setTimeout(1000)`). Call `.unref()` on a timer so it doesn't keep the process alive; `clearTimeout`/`clearInterval` to cancel.

### Q34. What is the `crypto` module used for?
Hashing (`createHash('sha256')`), HMAC, random bytes/UUIDs (`randomBytes`, `randomUUID`), password hashing (`scrypt`, `pbkdf2`), encryption (AES-GCM), signing/verifying, `timingSafeEqual`. Never use `Math.random()` for secrets or tokens.

### Q35. What is a Node.js LTS release?
Even-numbered Node versions become **LTS (Long Term Support)** in October and get about 30 months of support (Active LTS then Maintenance). Odd-numbered versions are short-lived "Current" releases. Use **LTS in production** and keep `engines` and CI aligned. Check nodejs.org for the current schedule.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Event loop phases in detail, with the nextTick/microtask rule *(Must-know)*
Each loop iteration runs: **timers → pending callbacks → idle/prepare → poll → check → close callbacks**. After **every callback** (and between phases), Node processes the `process.nextTick` queue first, then the **promise microtask queue**, until both are empty.
```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync, nextTick, promise, timeout/immediate (order of these two at the top level is not guaranteed)
```
Inside an **I/O callback**, `setImmediate` always runs before `setTimeout(0)`.

### Q37. What does the poll phase do?
It waits for and processes I/O events. If there are timers due, it moves on; if `setImmediate` callbacks are scheduled, it goes to the check phase; otherwise it may **block waiting** for I/O (that is how an idle server uses almost no CPU).

### Q38. What runs on the libuv thread pool and how do you tune it?
Thread pool: `fs` (most operations), `dns.lookup`, `crypto` (pbkdf2, scrypt, randomBytes, randomFill), `zlib`, some user C++ addons. Network sockets use OS async mechanisms (epoll/kqueue/IOCP), not the pool. Default size is **4**; change with `UV_THREADPOOL_SIZE` (max 1024), set **before** the process starts. Too many simultaneous pool tasks cause queueing (starvation).

### Q39. CPU-bound work: options *(Comparison)*
| Option | Use for | Notes |
|---|---|---|
| `worker_threads` | CPU tasks inside one app (hashing, parsing, image processing) | Shared memory possible (`SharedArrayBuffer`), message passing, lighter than processes |
| `child_process` | Run other programs/scripts, isolation | Separate process, IPC via messages/pipes |
| `cluster` | Scale a server across CPU cores | Multiple processes sharing a port; each is a full Node process |
| Offload to a queue/service | Heavy/long jobs | BullMQ + workers, microservice in another language |
| Chunking with `setImmediate` | Moderate loops | Yields to the loop; still same thread |

### Q40. `cluster` module: how does it work?
The primary process forks workers (one per CPU). Workers share the server port; the primary distributes connections (round-robin on Linux/macOS). If a worker dies, the primary can fork a new one.
```js
import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';
if (cluster.isPrimary) {
  for (let i = 0; i < os.availableParallelism(); i++) cluster.fork();
  cluster.on('exit', (w) => { console.log(`worker ${w.process.pid} died, restarting`); cluster.fork(); });
} else {
  http.createServer((req, res) => res.end(`Handled by ${process.pid}`)).listen(3000);
}
```
Workers don't share memory: use Redis/DB for shared state and sticky sessions where needed. In containers, many teams prefer **one process per container** and scale with the orchestrator (Kubernetes) instead of `cluster`.

### Q41. `worker_threads` example
```js
// main.js
import { Worker } from 'node:worker_threads';
export function runFib(n) {
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL('./fib-worker.js', import.meta.url), { workerData: { n } });
    w.once('message', resolve);
    w.once('error', reject);
    w.once('exit', (code) => code !== 0 && reject(new Error(`Worker stopped with exit code ${code}`)));
  });
}
// fib-worker.js
import { parentPort, workerData } from 'node:worker_threads';
const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
parentPort.postMessage(fib(workerData.n));
```
For many tasks, use a **worker pool** (e.g., Piscina) rather than creating a worker per task.

### Q42. `child_process`: `spawn`, `exec`, `execFile`, `fork`
| Function | Use |
|---|---|
| `spawn(cmd, args)` | Streams stdout/stderr; large output; no shell by default |
| `exec(cmd)` | Runs in a **shell**, buffers output (`maxBuffer`); **injection risk** with user input |
| `execFile(file, args)` | No shell; safer; buffered output |
| `fork(module)` | Spawns a Node process with an IPC channel (`send`/`message`) |
```js
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const { stdout } = await promisify(execFile)('git', ['rev-parse', 'HEAD'], { timeout: 5000 });
```
Never pass untrusted input to `exec` (command injection).

### Q43. Streams in practice: transform and line-by-line reading
```js
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
const rl = readline.createInterface({ input: createReadStream('data.csv'), crlfDelay: Infinity });
let count = 0;
for await (const line of rl) { if (line.includes('ERROR')) count++; }   // constant memory
```
```js
import { Transform } from 'node:stream';
const upper = new Transform({ transform(chunk, _enc, cb) { cb(null, chunk.toString().toUpperCase()); } });
```

### Q44. `.pipe()` vs `pipeline()` *(Tricky)*
`.pipe()` does **not** forward errors or destroy streams on failure, which causes leaks. `pipeline()` (and `stream/promises`) propagates errors, cleans up all streams and supports async iterators/generators.
```js
import { pipeline } from 'node:stream/promises';
await pipeline(readable, transformA, transformB, writable);      // rejects on any error
```

### Q45. Streaming HTTP responses and large downloads
```js
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream';
http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'video/mp4' });
  pipeline(createReadStream('video.mp4'), res, (err) => { if (err) res.destroy(err); });
}).listen(3000);
```
Supports back-pressure automatically; for Range requests, handle the `Range` header and respond with `206`.

### Q46. How does Node resolve modules (`require` algorithm)?
1. Core module (`node:fs`).
2. Relative/absolute path → try file (`.js`, `.json`, `.node`), then directory (`package.json` `main`, `index.js`).
3. Bare specifier (`lodash`) → look in `./node_modules`, then each parent `node_modules` up to the root.
4. `exports` field in the package restricts what can be imported.
Modules are **cached** in `require.cache` after the first load (singletons per path). ESM resolution requires file extensions for relative imports and does not use `NODE_PATH`.

### Q47. Circular dependencies in CommonJS
If A requires B and B requires A, B receives A's **partially completed** `module.exports`. Fix by restructuring (extract shared code), lazy `require` inside functions, or using dependency injection. ESM handles cycles with live bindings but values may be in the TDZ.

### Q48. Environment configuration best practices
Use env variables for config (12-factor), validate at startup (Zod/envalid), different files for environments (`--env-file`), never commit secrets, use a secret manager in production, and keep defaults safe. Avoid depending on `NODE_ENV` for behavior other than production optimizations.

### Q49. Logging
Use structured logging (JSON) with a fast logger like **pino**, include request IDs, log levels, and send logs to stdout (let the platform collect). Avoid `console.log` in hot paths and never log secrets/PII.
```js
import pino from 'pino';
const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
logger.info({ userId: 1 }, 'user logged in');
```

### Q50. Authentication basics: sessions vs JWT
Sessions: server stores state (session ID cookie, HttpOnly) → easy revocation, needs shared store (Redis). JWT: signed token, stateless verification, harder to revoke; keep short-lived, use refresh rotation, store in HttpOnly cookies, validate `alg`, `exp`, `aud`, `iss`. Hash passwords with scrypt/argon2/bcrypt, never plain/fast hashes.

### Q51. Password hashing example
```js
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);
export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = await scryptAsync(pw, salt, 64);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}
export async function verifyPassword(pw, stored) {
  const [saltHex, keyHex] = stored.split(':');
  const key = await scryptAsync(pw, Buffer.from(saltHex, 'hex'), 64);
  return timingSafeEqual(key, Buffer.from(keyHex, 'hex'));
}
```
`scrypt` runs on the thread pool, so it doesn't block the loop (but too many concurrent hashes can saturate the pool).

### Q52. Testing with the built-in test runner
```js
// math.test.js
import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import { add } from './math.js';
describe('add', () => {
  test('adds numbers', () => assert.equal(add(1, 2), 3));
  test('async works', async () => { assert.deepEqual(await load(), { ok: true }); });
});
// run: node --test            (watch: node --test --watch; coverage: --experimental-test-coverage)
```
Other tools: Jest, Vitest, Mocha, `supertest` for HTTP, `nock`/`msw` for mocking, `testcontainers` for DB integration tests.

### Q53. `util.promisify` and `events.once`
```js
import { promisify } from 'node:util';
import { once } from 'node:events';
const sleep = promisify(setTimeout);
await sleep(500);
const [data] = await once(emitter, 'ready');           // wait for an event as a promise
```

### Q54. `AbortController` and cancellation
```js
const ctrl = new AbortController();
setTimeout(() => ctrl.abort(), 2000);
const res = await fetch(url, { signal: ctrl.signal });
await setTimeout(1000, null, { signal: ctrl.signal });     // timers/promises support signals
fetch(url, { signal: AbortSignal.timeout(5000) });          // built-in timeout
```
Many core APIs (`fs/promises`, `child_process`, `events.once`, `stream.pipeline`) accept `signal`.

### Q55. Handling uncaught errors and exit codes
```js
process.on('unhandledRejection', (reason) => { logger.error({ reason }, 'unhandledRejection'); process.exit(1); });
process.on('uncaughtException', (err) => { logger.fatal(err, 'uncaughtException'); process.exit(1); });
```
After an `uncaughtException` the process state is unsafe: log, close what you can, and **exit**; let the supervisor restart you.

### Q56. Graceful shutdown *(Must-know)*
```js
const server = http.createServer(handler).listen(3000);
let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return; shuttingDown = true;
  logger.info({ signal }, 'shutting down');
  server.close(async () => {                     // stop accepting new connections; wait for in-flight
    await db.end(); await queue.close();
    process.exit(0);
  });
  server.closeIdleConnections?.();               // Node 18.2+
  setTimeout(() => process.exit(1), 10_000).unref();   // force after timeout
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```
Also fail the readiness probe first so the load balancer stops sending traffic.

### Q57. What is `NODE_ENV`?
A convention (`development`, `production`, `test`) used by libraries (e.g., Express enables view caching and less verbose errors in production). It's not built into Node itself. Don't branch business logic on it; use explicit config flags.

### Q58. Reading and writing JSON safely
```js
const data = JSON.parse(await readFile('data.json', 'utf8'));   // throws SyntaxError on invalid JSON
await writeFile('data.json', JSON.stringify(data, null, 2));
```
For atomic writes, write to a temp file and `rename` it. For huge files, stream/parse incrementally.

### Q59. `URL` and `URLSearchParams`
```js
const url = new URL('/search?q=node&page=2', 'https://example.com');
url.searchParams.get('q'); url.searchParams.set('page', '3'); url.pathname; url.origin;
```
Prefer WHATWG `URL` over the legacy `url.parse`.

### Q60. HTTP keep-alive and agents
Reusing TCP connections reduces latency. In Node 19+ the global HTTP agent uses keep-alive by default; with older versions create an agent: `new http.Agent({ keepAlive: true, maxSockets: 50 })`. `fetch` (undici) pools connections automatically.

### Q61. Handling file uploads and large bodies
Stream them (multipart parsers like `busboy`/`multer`) instead of buffering; set size limits; validate type and content; store to disk/object storage via streams or pre-signed URLs; scan for malware if needed.

### Q62. Package publishing and `exports`
```json
{ "name": "my-lib", "type": "module",
  "exports": { ".": { "import": "./dist/index.js", "require": "./dist/index.cjs", "types": "./dist/index.d.ts" } },
  "files": ["dist"] }
```
`exports` hides internal files and enables dual (ESM + CJS) packages. Test with `npm pack` before publishing.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. Explain backpressure in depth and the stream states
A Readable has an internal buffer (default `highWaterMark` 16 KiB for streams, 64 KiB for `fs` read streams, 16 objects in object mode). Flowing mode pushes data via `'data'` events; paused mode pulls via `read()`. A Writable returns `false` from `write()` when its buffer exceeds `highWaterMark`; the producer should wait for `'drain'`.
```js
function writeMany(writable, items) {
  let i = 0;
  function write() {
    while (i < items.length) {
      const ok = writable.write(items[i++]);
      if (!ok) { writable.once('drain', write); return; }       // pause until the buffer empties
    }
    writable.end();
  }
  write();
}
```
`pipeline` and async iteration (`for await (const chunk of readable)`) handle this for you.

### Q64. Async iteration over streams and generators
```js
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
async function* toUpper(source) { for await (const chunk of source) yield chunk.toString().toUpperCase(); }
await pipeline(Readable.from(['a', 'b']), toUpper, process.stdout);
```
Async generators make custom transforms simple and backpressure-aware.

### Q65. Web Streams in Node
Node supports the WHATWG Streams API (`ReadableStream`, `WritableStream`, `TransformStream`), used by `fetch` bodies. Convert with `Readable.fromWeb(stream)` / `Readable.toWeb(readable)`. Use them for code shared with browsers/edge runtimes.

### Q66. Memory model: V8 heap vs external memory
V8 heap holds JS objects (young generation for short-lived, old generation for long-lived). **Buffers and some native allocations live outside the heap** ("external"/RSS). `--max-old-space-size=<MB>` sets the old-generation limit; defaults depend on system memory and Node version (and container limits). Watch `process.memoryUsage()` (`heapUsed`, `heapTotal`, `rss`, `external`, `arrayBuffers`).

### Q67. Finding and fixing memory leaks *(Scenario)*
Symptoms: RSS/heap grow without stabilizing, GC pauses increase, eventual `JavaScript heap out of memory`. Process:
1. Confirm with metrics (`process.memoryUsage()`, container memory graphs).
2. Reproduce under load, take **heap snapshots** (`node --inspect` → Chrome DevTools Memory, or `v8.writeHeapSnapshot()`), compare 2–3 snapshots, look at retained objects and "Retainers".
3. Typical causes: unbounded caches/Maps, event listeners not removed (`MaxListenersExceededWarning`), closures capturing large objects, global arrays, timers never cleared, request-scoped objects stored globally, unresolved promises piling up.
4. Fix with bounded caches (LRU/TTL), `WeakMap`/`WeakRef`, removing listeners, `AbortSignal`, streaming instead of buffering.
5. Verify with a soak test.
Tools: `clinic doctor/heapprofiler`, `0x`, `heapdump`, Node's `--heap-prof`.

### Q68. CPU profiling and event loop lag
Use `node --cpu-prof`, Chrome DevTools profiler, `clinic flame`, or `0x` for flame graphs. Measure loop delay with `perf_hooks.monitorEventLoopDelay()`:
```js
import { monitorEventLoopDelay } from 'node:perf_hooks';
const h = monitorEventLoopDelay({ resolution: 20 }); h.enable();
setInterval(() => { console.log('p99 loop delay (ms):', h.percentile(99) / 1e6); h.reset(); }, 5000).unref();
```
High p99 delay means something blocks the main thread (sync work, big JSON, regex, serialization).

### Q69. Common event-loop blockers and fixes
| Blocker | Fix |
|---|---|
| Sync `fs`/`crypto` in request path | Async versions |
| Large `JSON.parse/stringify` | Stream/limit payload, worker, pagination |
| Catastrophic regex (ReDoS) | Safer regex, input limits, `re2` |
| CPU loops | Worker threads / queue |
| Giant array sorting/map | Chunking, DB-side work |
| Template rendering of huge pages | Streaming, caching |

### Q70. Error handling architecture
Define an `AppError` class (status, code, `isOperational`), centralize handling (middleware/hook), map errors to responses, log with context, avoid leaking internals, and crash on programmer errors. Use `Error.cause`:
```js
class AppError extends Error {
  constructor(message, { status = 500, code = 'INTERNAL', cause, isOperational = true } = {}) {
    super(message, { cause }); this.name = 'AppError'; this.status = status; this.code = code; this.isOperational = isOperational;
  }
}
```

### Q71. `AsyncLocalStorage` (request context)
Carries context (request ID, user) through async calls without passing parameters.
```js
import { AsyncLocalStorage } from 'node:async_hooks';
export const als = new AsyncLocalStorage();
http.createServer((req, res) => als.run({ requestId: crypto.randomUUID() }, () => handle(req, res)));
export const log = (msg) => console.log(JSON.stringify({ requestId: als.getStore()?.requestId, msg }));
```
Used by loggers/tracing (OpenTelemetry). Small overhead; stable in current LTS versions.

### Q72. Database access patterns: pooling
Use **connection pools** (`pg.Pool`, `mysql2`, Prisma) with limits sized to the database; reuse connections; handle timeouts; close pools on shutdown; avoid creating a connection per request. In serverless use pooled/HTTP drivers or a proxy (PgBouncer, RDS Proxy).
```js
import pg from 'pg';
export const pool = new pg.Pool({ max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
```

### Q73. Queues and background jobs
Use a queue (BullMQ + Redis, SQS, RabbitMQ, Kafka) for slow or retryable work: emails, image processing, webhooks, reports. Workers pull jobs; use idempotency keys, retries with backoff, dead-letter queues, and separate worker processes from the API.

### Q74. WebSockets and real-time
`ws` (low level), Socket.IO (rooms, fallbacks, reconnection). Concerns: heartbeats (ping/pong), authentication on connect, horizontal scaling (Redis adapter / pub-sub), backpressure (`ws.bufferedAmount`), message size limits, and sticky sessions behind load balancers. SSE is simpler for server → client streams.
```js
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  ws.isAlive = true; ws.on('pong', () => (ws.isAlive = true));
  ws.on('message', (data) => { for (const c of wss.clients) if (c.readyState === 1) c.send(data.toString()); });
});
setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); } }, 30_000).unref();
```

### Q75. Security checklist for Node apps *(Must-know)*
- **Input validation** (Zod/Joi) at boundaries; never trust `req.body`.
- **Injection:** parameterized queries; avoid `exec` with user input; no `eval`/`new Function`.
- **Prototype pollution:** sanitize merges (`__proto__`, `constructor`), use `Object.create(null)` maps, patched libs.
- **Path traversal:** normalize and verify paths stay inside the root.
- **ReDoS:** avoid catastrophic regex; limit input length.
- **SSRF:** validate/allow-list URLs; block private IP ranges when fetching user URLs.
- **AuthN/Z:** secure session cookies (HttpOnly, Secure, SameSite), rotate secrets, short-lived JWTs, authorization checks per resource.
- **Rate limiting** and brute-force protection; request size limits; timeouts.
- **Headers:** Helmet; CORS configured strictly.
- **Dependencies:** `npm audit`, lockfiles, minimal deps, review install scripts (`--ignore-scripts` in CI where possible), Dependabot/Renovate.
- **Secrets:** env/secret manager; no secrets in logs or images.
- **Run as non-root** in containers; read-only filesystem where possible.
- Node's **permission model** (`--permission`, newer versions) can restrict fs/network/child process access.

### Q76. Path traversal protection
```js
import path from 'node:path';
const ROOT = path.resolve('public');
function safeJoin(userPath) {
  const full = path.resolve(ROOT, '.' + path.sep + decodeURIComponent(userPath));
  const rel = path.relative(ROOT, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw Object.assign(new Error('Forbidden'), { status: 403 });
  return full;
}
```

### Q77. Rate limiting algorithms
Fixed window, sliding window, **token bucket**, leaky bucket. In multi-instance apps use a shared store (Redis) with atomic operations (Lua/`INCR` + `EXPIRE`). Return `429` with `Retry-After`.
```js
class TokenBucket {
  constructor(capacity, perSecond) { Object.assign(this, { capacity, tokens: capacity, rate: perSecond, last: Date.now() }); }
  take() {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last) / 1000) * this.rate); this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }
}
```

### Q78. Caching strategies
In-process (LRU/TTL; fast, per instance), distributed (Redis/Memcached; shared), HTTP caching (`Cache-Control`, ETag), CDN, memoization of expensive pure functions. Watch invalidation, stampedes (use locks/stale-while-revalidate), serialization cost, and memory limits.

### Q79. Docker for Node *(Must-know)*
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```
Best practices: multi-stage builds, `npm ci`, non-root `USER node`, `.dockerignore`, pin base image versions, handle `SIGTERM` (Node as PID 1 doesn't forward signals well: use `docker run --init` or `tini`), health checks, set memory limits and `--max-old-space-size` below the container limit.

### Q80. Process managers and deployment
PM2 (cluster mode, restarts, logs), systemd, Docker/Kubernetes (preferred), serverless (Lambda/Cloud Functions). In Kubernetes: one process per container, readiness/liveness probes, graceful shutdown, resource limits, horizontal pod autoscaling, rolling updates.

### Q81. Observability: logs, metrics, traces
Structured logs (pino), metrics (Prometheus `prom-client`: request duration histograms, event loop lag, heap usage), distributed tracing (OpenTelemetry auto-instrumentation + `AsyncLocalStorage`), error tracking (Sentry), health endpoints (`/healthz` liveness, `/readyz` readiness).

### Q82. Testing strategy
Unit tests for pure logic, integration tests for HTTP + DB (testcontainers), contract tests for external APIs, E2E smoke tests, load tests (k6/autocannon). Use dependency injection or module mocking sparingly; isolate time/randomness; keep tests parallel-safe.

### Q83. TypeScript with Node
Compile with `tsc`/`tsx`/`esbuild`/`swc`; run TS directly with `tsx` (dev) or Node's **type stripping** (newer versions, erasable syntax only: no enums/namespaces/parameter properties). Use `@types/node`, `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, and `.js` extensions in relative imports for ESM output.

### Q84. ESM/CJS interop problems and solutions
`ERR_REQUIRE_ESM`, `Cannot use import statement outside a module`, `exports is not defined in ES module scope`, `__dirname is not defined`. Solutions: set `"type"` consistently, use `.mjs/.cjs`, use `import()` for ESM from CJS, use `createRequire(import.meta.url)` to `require` in ESM, `import.meta.dirname`, and the `exports` map for packages. Newer Node versions can `require()` ESM (without top-level await) — check your version.

### Q85. `child_process` vs `worker_threads` in practice
Use workers for CPU-bound JavaScript tasks with shared memory/lower overhead. Use child processes to run external binaries or isolate untrusted/crashy code (a crash does not take down the parent), or when you need different Node flags or memory limits.

### Q86. Reading large files and data pipelines
Stream → parse incrementally → transform → write/DB in batches with backpressure. For CSV: `csv-parse` stream; for NDJSON: split lines + `JSON.parse`; for huge JSON: streaming parsers (`stream-json`). Batch DB inserts and use transactions.

### Q87. Idempotency and retries
Retries must be safe: use idempotency keys for POST requests, unique constraints, and exactly-once semantics at the handler level (dedupe by message ID). Use exponential backoff with jitter and a retry budget; don't retry non-idempotent operations blindly.

### Q88. Configuration for different environments
Layer config: defaults → env file → env variables → secrets manager. Validate with a schema at startup (fail fast). Keep feature flags separate. Document all variables. Avoid reading `process.env` everywhere; centralize in a `config.js`.

### Q89. Native addons and `node-gyp` problems
Packages with native code (`bcrypt`, `sharp`, `sqlite3`) need prebuilt binaries or a build toolchain (Python, make, C++ compiler). In Docker use matching base images (Alpine/musl vs Debian/glibc), install build tools in a build stage, or choose pure-JS/WASM alternatives. Many packages ship prebuilds via `prebuildify`/N-API for stability across Node versions.

### Q90. Upgrading Node versions safely
Read the release notes, check `engines` and dependencies' support (especially native modules), run CI on both versions, watch deprecations (`node --trace-deprecation`), test performance, upgrade LTS to LTS, and roll out gradually. Use `.nvmrc`/`.node-version`/Volta to pin versions for developers and CI.

### Q91. Streams vs buffers: choosing
Use buffers for small data (JSON bodies < MBs). Use streams for large/unbounded data, proxying, file transforms, and when you want constant memory and lower latency to first byte.

### Q92. Measuring performance: benchmarking and load testing
Use `autocannon` or `k6` for HTTP load, measure p50/p95/p99 latency, throughput, error rate, CPU/memory, event loop lag. Use realistic payloads, warm up, test with production-like settings (`NODE_ENV=production`, same Node version), and profile when numbers are bad.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. How do you scale a Node.js service? *(Architecture)*
1. **Make it stateless:** no in-memory sessions or local files for shared data; use Redis/DB/object storage.
2. **Scale horizontally:** many instances behind a load balancer; in containers prefer one Node process per container and let the orchestrator scale; use `cluster`/PM2 only on plain VMs.
3. **Remove bottlenecks:** database (indexes, pooling, read replicas), cache hot data (Redis/CDN), offload slow work to queues and workers.
4. **Protect the service:** timeouts, rate limits, load shedding (reject early when event loop lag is high), circuit breakers for dependencies.
5. **Measure:** p95/p99 latency, throughput, error rate, CPU, memory, event loop lag, DB pool wait time.
6. **Plan capacity:** load test, set autoscaling on CPU/latency/queue depth.

### Q94. HTTP server timeouts behind a load balancer (the 502 gotcha) *(Must-know)*
Node's default `server.keepAliveTimeout` is **5 seconds**. AWS ALB/ELB, Nginx and others keep idle connections for ~60 s. If Node closes an idle connection just as the load balancer reuses it, requests fail intermittently with **502/ECONNRESET**.
```js
const server = http.createServer(app);
server.keepAliveTimeout = 65_000;      // must be LONGER than the load balancer idle timeout (e.g., ALB 60 s)
server.headersTimeout = 66_000;        // must be longer than keepAliveTimeout
server.requestTimeout = 30_000;        // max time to receive the whole request
```
Also set application-level timeouts for outbound calls and DB queries.

### Q95. Resilience patterns for dependencies
- **Timeouts** on every outbound call (`AbortSignal.timeout`).
- **Retries** only for idempotent operations, with exponential backoff and jitter and a retry budget.
- **Circuit breaker** (e.g., `opossum`): stop calling a failing dependency for a while; fail fast; half-open probes.
- **Bulkheads:** limit concurrency per dependency so one slow service doesn't exhaust all resources.
- **Fallbacks/graceful degradation:** cached or default data.
- **Load shedding:** reject non-critical work when overloaded (check event loop lag).
- **Idempotency keys** for safe retries of writes.

### Q96. Circuit breaker implementation (simplified)
```js
class CircuitBreaker {
  constructor(fn, { failureThreshold = 5, resetMs = 10_000 } = {}) {
    Object.assign(this, { fn, failureThreshold, resetMs, failures: 0, state: 'CLOSED', openedAt: 0 });
  }
  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt < this.resetMs) throw new Error('Circuit open');
      this.state = 'HALF_OPEN';
    }
    try {
      const result = await this.fn(...args);
      this.failures = 0; this.state = 'CLOSED';
      return result;
    } catch (err) {
      if (++this.failures >= this.failureThreshold || this.state === 'HALF_OPEN') { this.state = 'OPEN'; this.openedAt = Date.now(); }
      throw err;
    }
  }
}
```

### Q97. Microservice communication and data consistency
Sync: REST/gRPC with timeouts and retries. Async: message brokers (Kafka, RabbitMQ, SQS) with events. Patterns: **outbox** (write event and data in one DB transaction, then publish), **saga** (compensating actions across services), **idempotent consumers** (dedupe by message ID), **event versioning**, dead-letter queues. Avoid distributed transactions; accept eventual consistency and design for it.

### Q98. Node supply chain security *(Must-know)*
- Commit lockfiles and use `npm ci`; verify integrity.
- Audit (`npm audit`), automate updates (Renovate/Dependabot), review major bumps.
- Be wary of **typosquatting**, abandoned packages, and **install scripts** (`--ignore-scripts` in CI when possible).
- Use `npm publish --provenance`, 2FA for publishers, scoped private registries, and SBOM generation.
- Reduce dependencies (prefer built-ins: `fetch`, `node:test`, `crypto`, `util.parseArgs`).
- Pin Node/base images; scan images (Trivy, Snyk).
- Run containers as non-root; use the permission model where available.

### Q99. Event loop lag as a health and load-shedding signal
```js
import { monitorEventLoopDelay } from 'node:perf_hooks';
const h = monitorEventLoopDelay({ resolution: 10 }); h.enable();
export const overloaded = () => h.percentile(99) / 1e6 > 200;     // p99 lag > 200 ms
// in a request hook:
if (overloaded() && !isCritical(req)) { res.writeHead(503, { 'retry-after': '5' }).end(); return; }
```
Exposing loop lag as a metric helps autoscaling and alerting before users see timeouts.

### Q100. Memory tuning and container limits
Set `--max-old-space-size` to ~75% of the container memory limit (leave room for Buffers, native memory and stacks). Check heap limits with `v8.getHeapStatistics()`. Reduce allocations in hot paths, stream large payloads, avoid retaining request objects, and monitor RSS vs heap. Frequent full GCs mean a leak or an undersized heap.

### Q101. GC and performance
V8 uses generational GC (Scavenge for young objects, Mark-Sweep-Compact for old). Allocation-heavy code increases GC pressure. Use flame graphs and `--trace-gc` to see pauses. Optimize by reusing buffers, avoiding large temporary arrays/objects, and keeping stable object shapes.

### Q102. Data access: avoiding N+1 and managing transactions
Batch queries (`WHERE id = ANY($1)`), use DataLoader-style batching for GraphQL, join or prefetch relations, use transactions for multi-step writes, keep transactions short, and set statement timeouts. In pooled environments never hold a connection while doing slow external calls.

### Q103. API design for large systems
Consistent resource naming, pagination (cursor-based for large data), filtering/sorting, versioning strategy, standard error format (problem+json), idempotency keys, rate-limit headers, OpenAPI contracts, backwards-compatible changes, and deprecation policies. Validate input/output with schemas.

### Q104. Architecture layers (clean/hexagonal)
Separate **transport** (HTTP handlers), **application/services** (use cases), **domain** (entities, rules), and **infrastructure** (DB, queues, external APIs) with dependency inversion. Benefits: testability, framework independence, clearer boundaries. Avoid over-engineering for small services.

### Q105. Zero-downtime deployments
Rolling or blue/green deploys; readiness probes (only receive traffic when ready); graceful shutdown on `SIGTERM`; connection draining; database migrations that are backward compatible (expand → migrate → contract); feature flags; health checks that verify dependencies appropriately.

### Q106. Serverless Node considerations
Cold starts (bundle size, init work outside the handler), connection management (reuse clients across invocations, use pooling proxies), execution time/memory limits, statelessness, observability, and cost model. Bundle with esbuild, keep dependencies lean, and prefer ARM/Graviton where available.

### Q107. Multi-tenancy
Resolve tenant from host/token, scope every query by tenant, use row-level security or separate schemas/DBs for stronger isolation, per-tenant rate limits and quotas, tenant-aware caching keys, and avoid global state shared across tenants.

### Q108. Scheduling and distributed cron
Avoid running cron in every instance. Use a single scheduler (Kubernetes CronJob, cloud scheduler) or queue-based repeatable jobs with locks/leader election; make jobs idempotent; record job runs and failures.

### Q109. Using TLS/HTTP2 in Node
`https.createServer({ key, cert })` and `http2.createSecureServer`. In most production setups TLS terminates at a load balancer/ingress; Node uses plain HTTP internally. If Node terminates TLS, reload certs without restarts and use modern cipher settings.

### Q110. Handling large concurrency safely (limits)
Limit concurrent outbound requests and DB queries (`p-limit`, semaphores), use queues with concurrency settings, and apply backpressure at the edge. Unbounded `Promise.all` over thousands of items can overload dependencies and memory.
```js
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await fn(items[idx], idx); }
  }));
  return results;
}
```

### Q111. Native modules, WASM and addons
Use N-API addons for performance-critical native code, WebAssembly (WASI) for portable compute, and worker threads for JS parallelism. Prefer well-maintained packages with prebuilt binaries; watch ABI compatibility across Node versions and libc differences in containers.

### Q112. Debugging production incidents in Node
Triage with metrics (latency, errors, CPU, memory, loop lag), logs with correlation IDs, traces, and recent changes. Capture diagnostics: heap snapshot (`kill -USR2` with `--heapsnapshot-signal=SIGUSR2`), CPU profile (`--cpu-prof` or inspector via port-forward), diagnostic reports (`--report-on-signal`, `process.report.writeReport()`). Mitigate first (rollback, scale, feature flag), then root-cause and add tests/alerts.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Node.js vs Go vs Java vs Python for backend: how do you decide? *(Decision)*
| | Node.js | Go | Java/Kotlin (JVM) | Python |
|---|---|---|---|---|
| I/O-heavy APIs | Excellent | Excellent | Excellent | Good (async) |
| CPU-bound work | Weak on one thread (workers needed) | Strong | Strong | Weak (use native libs) |
| Dev speed / ecosystem | Very high, huge npm | High, smaller ecosystem | High, mature enterprise ecosystem | Very high (data/ML) |
| Memory/startup | Moderate/fast | Low/very fast | Higher/slower (improving) | Moderate |
| Typing | TypeScript recommended | Built-in | Built-in | Optional (type hints) |
| Hiring | Large (JS devs) | Growing | Large (enterprise) | Large |
| Best fit | BFFs, APIs, real-time, tooling, serverless | High-throughput services, infra | Large enterprise systems | Data/ML, scripting |
Decide on workload, team skills, ecosystem, latency/throughput needs, operational maturity. Run a spike with realistic load.

### Q114. Standards for a Node platform
Standard Node LTS version and Docker base images, TypeScript config, ESLint/Prettier, project template (logging, config, health checks, graceful shutdown, metrics), dependency policy, testing requirements, security scanning, API conventions, error format, and CI/CD pipeline. Provide a "golden path" template and shared libraries.

### Q115. Dependency governance
Allow-list or review process for new packages (maintenance, size, license, security history), automated updates with grouped PRs, vulnerability SLAs, limits on transitive dependency count, internal mirrors, license compliance, and a policy for abandoned packages.

### Q116. Migration strategies
CommonJS → ESM, JS → TypeScript, callbacks → async/await, Express 4 → 5, Node LTS upgrades, monolith → services. Use the strangler pattern, codemods, feature flags, dual-publishing for libraries, and tests as the safety net. Avoid freezing delivery; migrate in slices and measure.

### Q117. Reliability engineering (SLOs and incident management)
Define SLIs/SLOs (availability, latency percentiles, error rate), error budgets, alerting on symptoms (not causes), runbooks, on-call practices, blameless post-mortems, chaos/failure testing, and capacity planning from load tests and traffic forecasts.

### Q118. Monorepo and code sharing
pnpm workspaces + Turborepo/Nx; shared packages (types, validation schemas, SDK clients); versioning with changesets; build caching; consistent tooling; strict boundaries; avoid circular dependencies; publish internal packages to a private registry when needed.

### Q119. Security program for Node services
Threat modeling, secure SDLC (SAST/DAST/SCA in CI), secret scanning, dependency policies, penetration tests, WAF/rate limiting, least privilege (IAM, DB roles), audit logging, data protection (encryption in transit and at rest), compliance needs, and security training.

### Q120. Cost and performance management
Right-size instances, autoscale on meaningful metrics, optimize DB queries and caching before adding servers, use CDN for static content, compress responses, reduce log volume, measure cost per request/feature, and review regularly.

### Q121. Hiring and mentoring (Node depth)
Interview for: event loop and async mental model, streams and backpressure, error handling, security awareness, debugging (memory/CPU), system design (scaling, queues), testing, and code quality. Mentor via code reviews on async/error handling, pairing on profiling, and internal talks on internals.

### Q122. API governance
API guidelines, design reviews, linting OpenAPI specs (Spectral), contract tests, consumer-driven contracts, versioning and deprecation policy, sandbox environments, and developer portal docs.

### Q123. Observability strategy
Unified logging format, correlation IDs, RED metrics (rate, errors, duration) per route, USE metrics (utilization, saturation, errors) for resources, distributed tracing across services, dashboards and alerts per SLO, and cost control for telemetry.

### Q124. Technical debt and roadmap
Maintain a debt register (outdated Node versions, deprecated packages, missing tests, flaky jobs, tight coupling), allocate a fixed percentage of capacity, prioritize by risk/impact, and review the platform roadmap (Node LTS timeline, framework upgrades, security items) each quarter.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice each task from memory. Mention error handling, backpressure, timeouts, security, and cleanup.

### C1. HTTP server without a framework (routing, JSON body, errors)
```js
import http from 'node:http';

const json = (res, status, data) => {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) });
  res.end(body);
};
async function readJson(req, limit = 1_000_000) {
  let size = 0; const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('Payload too large'), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

const users = new Map();
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true });
    if (req.method === 'GET' && url.pathname === '/users') return json(res, 200, [...users.values()]);
    if (req.method === 'POST' && url.pathname === '/users') {
      const { name } = await readJson(req);
      if (typeof name !== 'string' || !name.trim()) return json(res, 400, { error: 'name is required' });
      const user = { id: crypto.randomUUID(), name: name.trim() };
      users.set(user.id, user);
      return json(res, 201, user);
    }
    json(res, 404, { error: 'Not found' });
  } catch (err) {
    const status = err.status ?? 500;
    if (status === 500) console.error(err);
    json(res, status, { error: status === 500 ? 'Internal server error' : err.message });
  }
});
server.requestTimeout = 30_000; server.headersTimeout = 10_000; server.keepAliveTimeout = 65_000;
server.listen(3000);
```

### C2. Graceful shutdown helper
```js
export function onShutdown(server, cleanup, { timeoutMs = 10_000 } = {}) {
  let closing = false;
  const handler = (signal) => {
    if (closing) return; closing = true;
    console.log(`${signal} received: closing server`);
    server.close(async (err) => {
      try { await cleanup(); } catch (e) { console.error(e); }
      process.exit(err ? 1 : 0);
    });
    server.closeIdleConnections?.();
    setTimeout(() => { console.error('Forced exit'); process.exit(1); }, timeoutMs).unref();
  };
  process.on('SIGTERM', handler); process.on('SIGINT', handler);
}
// onShutdown(server, async () => { await pool.end(); await redis.quit(); });
```

### C3. Copy and compress a big file with streams
```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
await pipeline(createReadStream('big.log'), createGzip(), createWriteStream('big.log.gz'));
```

### C4. Process a huge CSV line by line (constant memory)
```js
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
async function sumColumn(file, index) {
  const rl = readline.createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  let sum = 0, first = true;
  for await (const line of rl) {
    if (first) { first = false; continue; }                  // header
    sum += Number(line.split(',')[index]) || 0;
  }
  return sum;
}
```
(For quoted CSV fields use a real parser such as `csv-parse`.)

### C5. Custom Transform stream (NDJSON parser)
```js
import { Transform } from 'node:stream';
export const ndjson = () => {
  let buffer = '';
  return new Transform({
    readableObjectMode: true,
    transform(chunk, _enc, cb) {
      buffer += chunk.toString('utf8');
      const lines = buffer.split('\n'); buffer = lines.pop();
      try { for (const l of lines) if (l.trim()) this.push(JSON.parse(l)); cb(); } catch (e) { cb(e); }
    },
    flush(cb) { try { if (buffer.trim()) this.push(JSON.parse(buffer)); cb(); } catch (e) { cb(e); } },
  });
};
```

### C6. Backpressure-aware writer
```js
import { once } from 'node:events';
async function writeAll(writable, items) {
  for (const item of items) {
    if (!writable.write(item)) await once(writable, 'drain');      // wait when the buffer is full
  }
  writable.end();
  await once(writable, 'finish');
}
```

### C7. Typed-ish EventEmitter wrapper with safe error handling
```js
import { EventEmitter } from 'node:events';
export class Jobs extends EventEmitter {
  constructor() { super({ captureRejections: true }); this.on('error', (e) => console.error('job error', e)); }
  async run(job) {
    this.emit('start', job.id);
    try { const result = await job.fn(); this.emit('done', job.id, result); return result; }
    catch (err) { this.emit('failed', job.id, err); throw err; }
  }
}
```
Always add an `'error'` listener on emitters that can emit errors.

### C8. `promisify` implementation
```js
const promisify = (fn) => (...args) =>
  new Promise((resolve, reject) => fn(...args, (err, ...values) => (err ? reject(err) : resolve(values.length > 1 ? values : values[0]))));
```

### C9. Retry with exponential backoff and jitter
```js
import { setTimeout as sleep } from 'node:timers/promises';
export async function retry(fn, { retries = 3, baseMs = 200, factor = 2, signal } = {}) {
  let attempt = 0;
  for (;;) {
    try { return await fn(attempt); }
    catch (err) {
      if (attempt++ >= retries || err.retryable === false) throw err;
      const delay = baseMs * factor ** (attempt - 1) * (0.5 + Math.random());
      await sleep(delay, undefined, { signal });
    }
  }
}
```

### C10. Concurrency limiter (`p-limit` style)
```js
export function pLimit(concurrency) {
  const queue = []; let active = 0;
  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => { active--; next(); });
  };
  return (fn) => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); next(); });
}
const limit = pLimit(5);
const results = await Promise.all(urls.map((u) => limit(() => fetch(u).then((r) => r.json()))));
```

### C11. In-memory cache with TTL and size limit (LRU)
```js
export class TTLCache {
  constructor({ max = 1000, ttlMs = 60_000 } = {}) { this.max = max; this.ttlMs = ttlMs; this.map = new Map(); }
  get(key) {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (e.expires < Date.now()) { this.map.delete(key); return undefined; }
    this.map.delete(key); this.map.set(key, e);               // refresh recency
    return e.value;
  }
  set(key, value, ttlMs = this.ttlMs) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.max) this.map.delete(this.map.keys().next().value);   // evict least recently used
    this.map.set(key, { value, expires: Date.now() + ttlMs });
  }
}
```

### C12. Worker pool for CPU-bound tasks (simplified)
```js
import { Worker } from 'node:worker_threads';
export class WorkerPool {
  constructor(file, size = 4) {
    this.idle = Array.from({ length: size }, () => new Worker(file)); this.queue = [];
  }
  run(data) {
    return new Promise((resolve, reject) => { this.queue.push({ data, resolve, reject }); this.#drain(); });
  }
  #drain() {
    while (this.idle.length && this.queue.length) {
      const worker = this.idle.pop(); const { data, resolve, reject } = this.queue.shift();
      const done = (fn) => (v) => { worker.off('message', onMsg); worker.off('error', onErr); this.idle.push(worker); fn(v); this.#drain(); };
      const onMsg = done(resolve), onErr = done(reject);
      worker.once('message', onMsg); worker.once('error', onErr);
      worker.postMessage(data);
    }
  }
  async close() { await Promise.all([...this.idle].map((w) => w.terminate())); }
}
// worker file: parentPort.on('message', (d) => parentPort.postMessage(compute(d)));
```
In production use a battle-tested pool such as Piscina.

### C13. Cluster with automatic restart
Use the example in Part 2, Q40. Add `cluster.on('exit')` throttling to avoid restart loops, and graceful shutdown by sending `SIGTERM` to workers.

### C14. Safe `child_process` call with timeout
```js
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);
export async function gitSha() {
  const { stdout } = await run('git', ['rev-parse', 'HEAD'], { timeout: 5_000, maxBuffer: 1024 * 1024 });
  return stdout.trim();
}
```
No shell is involved, so arguments cannot inject commands.

### C15. Token-bucket rate limiter middleware (plain Node)
```js
const buckets = new Map();
export function rateLimit({ capacity = 20, perSecond = 5 } = {}) {
  return (req, res, next) => {
    const key = req.socket.remoteAddress;
    const b = buckets.get(key) ?? { tokens: capacity, last: Date.now() };
    const now = Date.now();
    b.tokens = Math.min(capacity, b.tokens + ((now - b.last) / 1000) * perSecond); b.last = now;
    if (b.tokens < 1) { res.writeHead(429, { 'retry-after': '1' }).end(); return; }
    b.tokens -= 1; buckets.set(key, b); next();
  };
}
```
(Single instance only; use Redis for multiple instances. Behind a proxy, read the client IP safely from trusted `X-Forwarded-For`.)

### C16. Middleware pipeline (`compose`)
```js
export const compose = (middlewares) => (ctx) => {
  let index = -1;
  const dispatch = (i) => {
    if (i <= index) return Promise.reject(new Error('next() called multiple times'));
    index = i;
    const fn = middlewares[i];
    if (!fn) return Promise.resolve();
    try { return Promise.resolve(fn(ctx, () => dispatch(i + 1))); } catch (err) { return Promise.reject(err); }
  };
  return dispatch(0);
};
```

### C17. Request context with `AsyncLocalStorage`
```js
import { AsyncLocalStorage } from 'node:async_hooks';
export const als = new AsyncLocalStorage();
export const withContext = (handler) => (req, res) => als.run({ requestId: req.headers['x-request-id'] ?? crypto.randomUUID() }, () => handler(req, res));
export const log = (msg, extra = {}) => console.log(JSON.stringify({ requestId: als.getStore()?.requestId, msg, ...extra }));
```

### C18. Serve static files safely
```js
import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream';
const ROOT = path.resolve('public');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
export async function serveStatic(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.resolve(ROOT, '.' + (pathname === '/' ? '/index.html' : pathname));
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return res.writeHead(403).end();
  try {
    const s = await stat(file);
    if (!s.isFile()) return res.writeHead(404).end();
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream', 'content-length': s.size });
    pipeline(createReadStream(file), res, () => {});
  } catch { res.writeHead(404).end(); }
}
```

### C19. Server-Sent Events endpoint
```js
function sse(req, res) {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
  let n = 0;
  const id = setInterval(() => res.write(`data: ${JSON.stringify({ tick: ++n })}\n\n`), 1000);
  req.on('close', () => clearInterval(id));            // clean up when the client disconnects
}
```

### C20. WebSocket chat with heartbeats (`ws`)
Use the example in Part 3, Q74. Add authentication in the `upgrade` handler, message size limits (`maxPayload`), and per-connection rate limiting.

### C21. JWT sign and verify
```js
import jwt from 'jsonwebtoken';
export const sign = (user) => jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '15m', issuer: 'my-api' });
export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'my-api' });
```
Always pass `algorithms` when verifying (prevents algorithm confusion), keep secrets in env/secret manager, and use short expirations plus refresh tokens.

### C22. Validate environment configuration at startup
```js
import { z } from 'zod';
const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
export const env = Env.parse(process.env);          // throws with a clear message if invalid
```

### C23. CLI tool with `util.parseArgs`
```js
#!/usr/bin/env node
import { parseArgs } from 'node:util';
const { values, positionals } = parseArgs({
  options: { port: { type: 'string', short: 'p', default: '3000' }, verbose: { type: 'boolean', short: 'v' } },
  allowPositionals: true,
});
console.log({ port: Number(values.port), verbose: !!values.verbose, files: positionals });
```
Add `"bin": { "mytool": "./cli.js" }` in `package.json` and a shebang line.

### C24. Fetch with timeout, retry and JSON validation
```js
export async function getJson(url, { timeoutMs = 5_000 } = {}) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: 'application/json' } });
  if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, retryable: res.status >= 500 });
  return res.json();
}
// const data = await retry(() => getJson('https://api.example.com/items'));
```

### C25. File watcher with debounce
```js
import { watch } from 'node:fs';
let timer;
watch('src', { recursive: true }, (event, filename) => {
  clearTimeout(timer);
  timer = setTimeout(() => console.log('changed:', filename), 100);        // debounce bursts of events
});
```
(For production tooling use `chokidar`, or `node --watch` for restarts.)

### C26. Health and readiness endpoints
```js
let ready = false;
export const setReady = (v) => (ready = v);
export function healthRoutes(req, res) {
  if (req.url === '/healthz') return res.writeHead(200).end('ok');                // liveness: process is alive
  if (req.url === '/readyz') return res.writeHead(ready ? 200 : 503).end(ready ? 'ready' : 'not ready');   // readiness: can serve traffic
}
```
Flip `ready` to false when shutting down so the load balancer drains traffic.

### C27. Unit tests with the built-in runner (mocks and timers)
```js
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
test('retries and succeeds', async () => {
  const fn = mock.fn(async (n) => { if (n < 2) throw new Error('fail'); return 'ok'; });
  assert.equal(await retry(fn, { retries: 3, baseMs: 1 }), 'ok');
  assert.equal(fn.mock.callCount(), 3);
});
test('timers', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const spy = mock.fn(); setTimeout(spy, 1000);
  t.mock.timers.tick(1000);
  assert.equal(spy.mock.callCount(), 1);
});
```

### C28. Integration test for an HTTP server
```js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
let server, base;
before(async () => { server = createApp().listen(0); await once(server, 'listening'); base = `http://127.0.0.1:${server.address().port}`; });
after(() => server.close());
test('GET /health', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});
```
Listening on port `0` gives a random free port (avoids conflicts in parallel tests).

### C29. Memory leak example and fix
```js
// ❌ leak: unbounded cache + listener per request
const cache = {};
app.get('/user/:id', async (req, res) => {
  cache[req.params.id] = await loadUser(req.params.id);       // grows forever
  process.on('SIGTERM', () => {});                           // adds a listener per request!
  res.json(cache[req.params.id]);
});
// ✅ fix: bounded TTL/LRU cache, register process handlers once
const cache2 = new TTLCache({ max: 5000, ttlMs: 60_000 });
```

### C30. Dockerfile and `.dockerignore`
Use the Dockerfile from Part 3, Q79. `.dockerignore`:
```
node_modules
npm-debug.log
.git
.env
coverage
Dockerfile*
```

### C31. Read a large JSON array in a streaming way (conceptual)
Use `stream-json` to parse incrementally: `pipeline(createReadStream('big.json'), parser(), streamArray(), async function* (src) { for await (const { value } of src) await handle(value); })`. This keeps memory constant instead of `JSON.parse` of the whole file.

### C32. Simple job queue with BullMQ
```js
import { Queue, Worker } from 'bullmq';
const connection = { host: 'localhost', port: 6379 };
export const emails = new Queue('emails', { connection });
await emails.add('welcome', { to: 'a@b.com' }, { attempts: 5, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: 1000 });
new Worker('emails', async (job) => sendEmail(job.data), { connection, concurrency: 10 });
```
Workers run in a separate process/container from the API; jobs are retried with backoff; make handlers idempotent.

---

# 🐞 Part 7: Debugging Scenarios

### D1. The API becomes slow under load but CPU is at 100% on one core
The event loop is blocked by CPU work (JSON, regex, crypto in JS, loops). Profile with `--cpu-prof` or Chrome DevTools, find the hot function, move it to a worker, optimize, or cache. Check `monitorEventLoopDelay`.

### D2. Memory keeps growing until the container is killed (OOMKilled)
Take heap snapshots over time and compare; look for unbounded Maps/arrays, listener leaks, large closures, buffering entire streams. Also check native/external memory (Buffers) via `process.memoryUsage().external`. Fix leaks and set `--max-old-space-size` below the container limit.

### D3. `Error: listen EADDRINUSE: address already in use :::3000`
Another process is using the port (or a previous instance did not exit). Find it (`lsof -i :3000` / `netstat`), kill it, change the port, ensure graceful shutdown, and avoid duplicate server starts in tests (use port `0`).

### D4. `Error: connect ECONNREFUSED 127.0.0.1:5432`
The target service is not running or not reachable (wrong host/port, container networking). Check the service, hostnames (`localhost` vs service name in Docker), firewall, and startup order (add retries/healthchecks).

### D5. `ECONNRESET` / `socket hang up` / intermittent 502
The peer closed the connection. Common cause: Node `keepAliveTimeout` (5 s) shorter than the load balancer idle timeout; set it higher (Q94). Also check server crashes/restarts, request timeouts, large payload limits, and client aborts.

### D6. `ETIMEDOUT` / slow external calls hang requests
No timeouts were set. Add `AbortSignal.timeout`, DB statement timeouts, connection timeouts, retries with backoff, and circuit breakers.

### D7. `EMFILE: too many open files`
File descriptors exhausted: streams not closed, too many concurrent file reads, leaked sockets. Limit concurrency, close streams (`pipeline`), use `graceful-fs`, and raise `ulimit -n` if appropriate.

### D8. `ENOENT: no such file or directory`
Wrong relative path (relative to `process.cwd()`, not the file). Use `path.resolve(import.meta.dirname, 'file')` or `new URL('./file', import.meta.url)`. Check Docker `WORKDIR` and copied files.

### D9. `Error [ERR_MODULE_NOT_FOUND]` / `Cannot find module`
ESM requires file extensions in relative imports (`./util.js`), `exports` map may block deep imports, missing dependency in `package.json` (works locally because of hoisting), or build output not copied. Verify `node_modules` and paths.

### D10. `ERR_REQUIRE_ESM` / `Cannot use import statement outside a module`
Module system mismatch. Set `"type": "module"` or use `.mjs`/`.cjs`; use dynamic `import()` from CJS; check package `exports`; upgrade to a Node version that supports `require(esm)` if applicable.

### D11. `ReferenceError: __dirname is not defined`
In ESM use `import.meta.dirname` / `import.meta.filename` (Node 20.11+/21.2+) or `fileURLToPath(import.meta.url)`.

### D12. Unhandled promise rejection crashes the process
A rejected promise had no handler (missing `await` in `try`, `async` callback in `forEach`, forgotten `.catch`). Fix the flow; add logging and a global handler that logs and exits; enable lint rules (`no-floating-promises`).

### D13. `MaxListenersExceededWarning`
Too many listeners on one emitter, usually a leak (registering inside a request handler). Register once, remove with `off`/`once`, or use `AbortSignal`; only raise `setMaxListeners` when justified.

### D14. Piping a stream grows memory
Backpressure ignored (manual `write` loops, `.on('data')` + async work). Use `pipeline`, respect `write()` return values, or async iteration.

### D15. `Error [ERR_STREAM_PREMATURE_CLOSE]` / `write after end`
A stream was destroyed or ended before finishing (client disconnected, double `end()`). Handle `'close'`/`'error'`, use `pipeline` callbacks, and don't write after `end`.

### D16. `Error: self signed certificate` / `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
The TLS chain is not trusted (corporate proxy, internal CA). Add the CA via `NODE_EXTRA_CA_CERTS=/path/ca.pem`. **Do not** set `NODE_TLS_REJECT_UNAUTHORIZED=0` in production.

### D17. DNS errors: `getaddrinfo ENOTFOUND` / `EAI_AGAIN`
DNS misconfiguration, container DNS, or rate-limited resolver. Check resolv.conf/CoreDNS, retry on `EAI_AGAIN`, cache DNS where appropriate, and remember `dns.lookup` uses the thread pool (it can be starved).

### D18. Thread pool starvation
Many concurrent `fs`/`crypto`/`dns.lookup` operations queue behind 4 threads, causing latency spikes while CPU looks low. Increase `UV_THREADPOOL_SIZE`, reduce concurrency, use `dns.resolve`, and offload heavy hashing.

### D19. Container does not stop quickly (`SIGTERM` ignored)
Node runs as PID 1 without signal handling or the process is started through a shell script/npm. Use `CMD ["node","server.js"]` (not `npm start`), handle `SIGTERM`, and use `--init`/`tini`.

### D20. Logs are lost when exiting
`process.exit()` called before async log transports flushed. Use `logger.flush()`/pino's destination `flushSync`, set `process.exitCode` and let the loop drain, or await shutdown steps.

### D21. Race conditions in file or DB operations (TOCTOU)
Checking existence then acting (`access` then `open`) allows changes in between. Use atomic operations (`fs.open` with flags `wx`, `rename`, DB unique constraints, transactions, `SELECT ... FOR UPDATE`).

### D22. Callback called twice / response sent twice
`Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent`. Missing `return` after `res.end()`, calling both `next()` and sending a response, or errors after sending. Structure code to return early and guard with `res.headersSent`.

### D23. `JSON.parse` crashes on bad input
Wrap in `try/catch`, validate with schemas, and limit body size. Never let parsing errors become unhandled.

### D24. Time zone and date bugs
Servers should use UTC; store ISO timestamps; avoid parsing ambiguous strings; set `TZ=UTC` in containers; use libraries for calendar logic.

### D25. `npm install` fails on native modules (`node-gyp`)
Missing build tools, Python, or incompatible Node/ABI; Alpine (musl) vs glibc binaries. Install build deps in the builder stage, use prebuilt binaries, switch base image, or choose a pure-JS alternative.

### D26. Different behavior between local and production
Different Node versions, `NODE_ENV`, env vars, file paths, case-sensitive filesystems (macOS vs Linux), time zone, or missing dev dependencies. Pin versions (`engines`, `.nvmrc`, Docker image), and test in a production-like container.

### D27. Intermittent crashes after weeks (leaks or rare errors)
Add metrics and alerts for heap/RSS and error rate, enable diagnostic reports (`--report-on-fatalerror`), keep heap snapshots on demand, and use gradual restarts as a stopgap while fixing the root cause.

### D28. Slow startup
Heavy synchronous work at import time, huge dependency trees, large JSON parsing, or DB migrations during startup. Lazy-load rarely used modules, bundle for serverless, use snapshots/`node:sea` where relevant, and move migrations out of the app start.

### D29. DB connection pool exhaustion (`timeout acquiring connection`)
Connections leaked (not released), long transactions, slow queries, or too many concurrent requests. Always release in `finally`, add timeouts, tune pool size to the DB capacity, and use a pool proxy.

### D30. CORS or preflight failures when calling the Node API from a browser
CORS is enforced by browsers; the API must send correct headers and handle `OPTIONS`. Configure allowed origins/methods/headers precisely; don't use `*` with credentials.

### D31. `Error: spawn ENOENT`
The executable is not found in `PATH` (or the cwd/file path is wrong). Use the full path, install the tool in the image, or check `shell: true` usage on Windows.

### D32. Debugging method (say this in interviews)
Reproduce → check metrics (latency, errors, CPU, memory, loop lag) → read logs with correlation IDs → form a hypothesis (blocking, leak, dependency, config) → capture evidence (profile, heap snapshot, diagnostic report) → mitigate → fix the root cause → add a test, alert and runbook note.


---

# 🧩 Part 8: Tricky Questions

### T1. Is Node.js single-threaded?
Your JavaScript runs on one main thread, but Node is not purely single-threaded. libuv has a thread pool (default 4) for `fs`, `crypto`, `zlib`, `dns.lookup`. V8 uses extra threads for GC and compilation. Networking uses OS async I/O. You can add threads with `worker_threads`.

### T2. Why can a `while(true)` loop freeze a whole server?
JavaScript callbacks run to completion on one thread. While the loop runs, the event loop cannot process any other request, timer or I/O.

### T3. Does `setTimeout(fn, 0)` run immediately?
No. It runs in the timers phase of a later loop iteration, after the current code and all microtasks. The minimum delay is about 1 ms.

### T4. `setTimeout(0)` vs `setImmediate` at the top level: which is first?
Not deterministic in the main module (depends on process performance). Inside an I/O callback, `setImmediate` always runs first.

### T5. Does `async` make code run in parallel?
No. `async` only wraps a function in a promise and allows `await`. Work is concurrent only if it is truly asynchronous I/O, and CPU work still blocks the thread.

### T6. Does `await` block the thread?
No. It pauses only that async function; the event loop continues. The rest of the function is scheduled as a microtask when the promise settles.

### T7. `await` inside `forEach`: what happens?
`forEach` ignores returned promises, so iterations start together and the outer code does not wait. Use `for...of` (sequential) or `Promise.all(items.map(...))` (parallel).

### T8. Can you catch an error thrown inside a callback with `try/catch` outside?
No. The callback runs later on a different stack. Handle errors inside the callback, use promises, or use `await` in `try/catch`.

### T9. `process.nextTick` vs `Promise.then`: which first?
`nextTick` queue runs first, then promise microtasks, within the same phase transition. In ESM top-level, promise jobs may run before `nextTick` because the module itself runs inside a promise job.

### T10. `module.exports` vs `exports`
`exports` is a reference to `module.exports`. Reassigning `exports = ...` breaks the link and exports nothing. Always assign to `module.exports` when replacing the whole export.

### T11. Does `require` cache modules?
Yes, by resolved filename in `require.cache`. The second `require` returns the same object, so module-level state is shared (singleton behavior).

### T12. Circular dependencies in CommonJS
A module gets the partially filled `exports` of the module still loading. This yields `undefined` values if used too early. Fix by restructuring or requiring lazily inside functions.

### T13. ESM vs CJS: top-level `this`, `__dirname`, `require`
In ESM, top-level `this` is `undefined`, there is no `require`, `__dirname`, `__filename`; use `import.meta`. ESM imports are static, live bindings, and asynchronous loading; CJS is synchronous with copied values.

### T14. `Buffer.from(string)` encoding gotcha
Default is UTF-8. A string's `.length` counts UTF-16 units, but `Buffer.byteLength(str)` counts bytes. Multi-byte characters make them differ (affects `Content-Length`).

### T15. Why shouldn't you use `fs.readFileSync` in a request handler?
It blocks the event loop for every user. Sync APIs are fine at startup or in scripts, not on hot paths.

### T16. `JSON.stringify` on big objects: is it a problem?
Yes. It is synchronous CPU work that blocks the loop. For very large payloads stream the output, paginate, or move work to a worker.

### T17. `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`
`all`: fails fast on first rejection. `allSettled`: waits for all, never rejects. `race`: first settled (value or error). `any`: first fulfilled (rejects with AggregateError if all fail). Note: remaining promises in `all` still continue to run.

### T18. Does `Promise.race` with a timeout cancel the slow work?
No. It only ignores its result. Real cancellation needs `AbortController`/`AbortSignal` support in the operation.

### T19. `uncaughtException` handler: can you keep running?
You can log, but the process state may be corrupt. Best practice: log, flush, exit, and let the supervisor restart.

### T20. Why does `process.exit()` lose data?
It terminates immediately; pending async work (stream writes, log flushes) may not finish. Prefer setting `process.exitCode` and letting the loop drain, or shut down gracefully.

### T21. `const` in Node and memory: does `require` inside a function leak?
No leak, but it adds lookup cost on each call (cached after the first). Prefer top-level imports.

### T22. Why does `Number` lose precision, and how to handle IDs?
JS numbers are 64-bit floats (safe up to 2^53−1). Big IDs (e.g., from databases) can be corrupted by `JSON.parse`. Send them as strings or use `BigInt`.

### T23. `Math.random()` for tokens: is it OK?
No. It is not cryptographically secure. Use `crypto.randomBytes`, `crypto.randomUUID()` or `crypto.randomInt`.

### T24. `==` vs `===` on IDs from `req.params`
Params are strings. `"5" == 5` is true, but strict comparison with numbers fails. Parse and validate input types explicitly.

### T25. Is `fs.exists` safe?
`fs.exists` is deprecated; checking then using causes race conditions. Try the operation and handle `ENOENT`.

### T26. Why does `console.log` sometimes slow down apps?
Console writes to stdout, which may be synchronous (TTY, files on POSIX; pipes are async on POSIX but sync on Windows in some cases). Heavy logging adds latency. Use an async structured logger (pino) and avoid logging in hot loops.

### T27. Can two requests share variables?
Yes, module-level variables are shared across all requests in a process. Don't store per-request state in globals; use function scope or `AsyncLocalStorage`.

### T28. Is Node good for CPU-heavy tasks?
Not on the main thread. Use `worker_threads`, child processes, native addons, or a different service. Node shines for I/O-bound workloads.

### T29. What is the difference between `spawn`, `exec`, `execFile`, `fork`?
`spawn`: streams, no shell by default, any size output. `exec`: shell, buffers output (size limit), risky with user input. `execFile`: runs a file without a shell, buffered. `fork`: spawns a Node process with an IPC channel.

### T30. Why are `async_hooks` and `AsyncLocalStorage` costly?
They track async resources and add overhead to every async operation. Modern Node optimized `AsyncLocalStorage`, but measure if latency is critical.

### T31. What is the `exports` field in `package.json` for?
It defines the public entry points of a package and blocks deep imports not listed. It also supports conditions (`import`, `require`, `types`, `default`).

### T32. Why do `devDependencies` sometimes break production?
Code imports a package that is only listed in `devDependencies`, and production installs with `--omit=dev`. List runtime packages under `dependencies`.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| What is Node.js? | A JavaScript runtime on V8 with libuv for async I/O |
| Engine used? | V8 |
| Event loop library? | libuv |
| Default thread pool size? | 4 (`UV_THREADPOOL_SIZE`) |
| Global object? | `globalThis` (`global`) |
| Package manager default? | npm |
| Lockfile name? | `package-lock.json` |
| Install exactly from lockfile? | `npm ci` |
| Run a script? | `npm run <name>` |
| Which file lists dependencies? | `package.json` |
| Enable ES modules? | `"type": "module"` or `.mjs` |
| Get env var? | `process.env.NAME` |
| Command line args? | `process.argv` / `util.parseArgs` |
| Current working dir? | `process.cwd()` |
| Directory of file (ESM)? | `import.meta.dirname` |
| Read file async (promises)? | `await fs.promises.readFile()` |
| Join paths safely? | `path.join` / `path.resolve` |
| Create HTTP server? | `http.createServer()` |
| Built-in test runner? | `node:test` |
| Built-in watch mode? | `node --watch` |
| Load `.env` natively? | `node --env-file=.env` |
| Built-in fetch? | Yes (global `fetch`, Node 18+) |
| Generate UUID? | `crypto.randomUUID()` |
| Hash password? | `crypto.scrypt` / argon2 / bcrypt |
| Run CPU work in parallel? | `worker_threads` |
| Scale across cores? | `cluster` / multiple processes |
| Communicate between processes? | IPC (`fork`), message queues, sockets |
| Stream types? | Readable, Writable, Duplex, Transform |
| Best way to connect streams? | `stream.pipeline` |
| What is backpressure? | Slowing a producer when the consumer is slow |
| Microtask queues? | `process.nextTick` queue, then promise queue |
| Event emitter class? | `events.EventEmitter` |
| Handle uncaught errors? | Log and exit; supervisor restarts |
| Graceful stop signal? | `SIGTERM` |
| Detect leaks? | Heap snapshots, `--inspect`, `--heap-prof` |
| Profile CPU? | `--cpu-prof`, `clinic`, `0x` |
| Debug with inspector? | `node --inspect` |
| Check Node version? | `node -v` / `process.version` |
| LTS versions are? | Even-numbered majors |
| Single executable apps? | `node:sea` |
| Permission model flag? | `--permission` (Node 20+, stable in newer versions: verify) |
| Report diagnostic info? | `process.report` |
| Time measurement? | `performance.now()` |
| Sleep promise? | `timers/promises` `setTimeout` |
| Abort an operation? | `AbortController` |
| Detect main module (ESM)? | `import.meta.main` (newer versions: verify) |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult. Prepare real numbers from your experience.

### B1. Tell me about a performance problem you solved in Node.
**Sample (Ritesh Kumar):** *Situation:* Our orders API had p95 latency of 2.8 s during sales. *Task:* Bring it under 500 ms without new hardware. *Action:* I profiled with `--cpu-prof`, found a synchronous JSON transform and an N+1 query. I moved the transform to a worker pool, batched queries, and added a Redis cache for hot items. *Result:* p95 dropped to 380 ms, CPU per instance fell by 45%, and we handled 3x traffic.

### B2. Describe a production incident (outage or memory leak) you handled.
Cover detection (alerts), mitigation (rollback/restart/scale), root cause (heap snapshot diff found a per-request listener leak), the fix, and prevention (tests, alerts, runbook, blameless post-mortem).

### B3. How did you improve code quality or reliability on a team?
Examples: introduced TypeScript and ESLint rules like `no-floating-promises`, added graceful shutdown template, request validation with zod, contract tests, and CI gates. Give measurable outcomes (fewer incidents, faster onboarding).

### B4. A time you disagreed with a technical decision.
Explain your data (benchmarks, risks), how you proposed a spike or experiment, how you listened, and how you committed to the outcome whichever way it went.

### B5. How do you mentor juniors on async code?
Pair on debugging event loop issues, review PRs for error handling and concurrency limits, share a short checklist (timeouts, retries, cleanup), and run internal sessions on streams and the event loop.

### B6. How do you handle tight deadlines vs quality?
Define the minimum safe scope (security, data integrity, observability), cut non-essential features, use feature flags, and record deliberate technical debt with a follow-up plan.

### B7. Migration experience (CJS to ESM, JS to TS, Node upgrade).
Describe slicing, codemods, dual builds, test safety net, communication, and metrics showing no regressions.

### B8. How do you stay updated?
Node release notes and the TSC/changelog, security advisories, conference talks, reading source of libraries, and small experiments. Mention a recent feature you adopted (e.g., built-in test runner or `--env-file`).

---

# 📚 Part 11: Complete Coverage (Core Modules + Tooling + Ecosystem + Mixed)

## Core modules
`fs`, `fs/promises`, `path`, `os`, `http`, `https`, `http2`, `net`, `dgram`, `dns`, `tls`, `events`, `stream`, `stream/promises`, `buffer`, `url`, `querystring`, `util`, `zlib`, `crypto`, `readline`, `child_process`, `cluster`, `worker_threads`, `async_hooks`, `perf_hooks`, `timers`, `timers/promises`, `process`, `v8`, `vm`, `assert`, `test`, `diagnostics_channel`, `module`, `string_decoder`, `inspector`, `repl`, `sqlite` (newer versions: verify).

## Runtime concepts
Event loop phases, libuv thread pool, microtasks vs macrotasks, `nextTick`, timers, `setImmediate`, streams and backpressure, Buffers and encodings, modules (CJS/ESM, resolution, `exports`), globals (`process`, `globalThis`, `structuredClone`, `fetch`, `AbortController`, `URL`, `TextEncoder`, `BroadcastChannel`, `queueMicrotask`).

## Tooling
npm/pnpm/yarn, `npx`, `nvm`/`fnm`/`volta`, `.nvmrc`, `engines`, ESLint, Prettier, TypeScript (`tsc`, `tsx`, `ts-node`, native type stripping: verify), build tools (esbuild, swc, tsup), test tools (`node:test`, Jest, Vitest), debuggers (inspector, VS Code), profilers (`clinic`, `0x`, `--prof`), process managers (PM2, systemd), containers.

## Ecosystem
Frameworks: Express, Fastify, Koa, NestJS, Hono. Validation: zod, joi, ajv. ORMs: Prisma, Drizzle, TypeORM, Sequelize, Mongoose. Logging: pino, winston. Queues: BullMQ, KafkaJS, amqplib. Realtime: ws, Socket.IO. HTTP clients: `fetch`, undici, axios, got. Auth: passport, jose, jsonwebtoken, argon2, bcrypt. Observability: OpenTelemetry, prom-client.

## Mixed topics
Security (OWASP, SSRF, injection, prototype pollution, ReDoS, path traversal), deployment (Docker, Kubernetes, serverless), scaling (stateless, caching, queues), testing (unit, integration, contract, load), performance (profiling, GC, loop lag), reliability (timeouts, retries, circuit breakers, graceful shutdown).

---

# 🔬 Part 12: Node.js Internals

### I1. V8 pipeline
Source → parser → AST → **Ignition** (bytecode interpreter) → hot code profiled → **TurboFan** (optimizing JIT; newer versions also use Sparkplug/Maglev tiers) → machine code. If assumptions (types, shapes) break, the code **deoptimizes** back. Stable object shapes ("hidden classes") and monomorphic call sites help performance.

### I2. libuv
A C library providing the event loop, async network I/O (epoll/kqueue/IOCP), a thread pool for blocking operations, timers, file system operations, child processes and signal handling.

### I3. Event loop phase order
```
   ┌───────────────────────────┐
┌─>│ timers                    │  setTimeout / setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │ pending callbacks         │  some system-level errors
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │ idle, prepare             │  internal
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │ poll                      │  new I/O events; may block waiting
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │ check                     │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤ close callbacks           │  socket.on('close')
   └───────────────────────────┘
```
Between each callback (and between phases), Node drains the `nextTick` queue, then the promise microtask queue.

### I4. What goes to the thread pool vs the OS?
Thread pool: most `fs` operations, `crypto.pbkdf2/scrypt/randomBytes`, `zlib`, `dns.lookup`. OS async: TCP/UDP sockets, pipes (non-blocking I/O with epoll/kqueue/IOCP).

### I5. Stream internals
Streams hold an internal buffer with a `highWaterMark` (default 16 KiB for byte streams, 16 objects for object mode). `write()` returns `false` when the buffer is above the mark; `'drain'` signals it's safe to continue. Readable streams have flowing and paused modes; `pipeline` wires error handling and cleanup.

### I6. Module loading
CJS: resolve path → load file → wrap in function `(exports, require, module, __filename, __dirname)` → execute → cache. ESM: parse imports → resolve and fetch graph → instantiate (link bindings) → evaluate (async-capable, top-level await). ESM bindings are live.

### I7. Memory areas
Heap (young generation: new space; old generation: old space, large object space, code space), stack, and external memory (Buffers, native). `process.memoryUsage()` reports `rss`, `heapTotal`, `heapUsed`, `external`, `arrayBuffers`.

### I8. Garbage collection
Scavenger (minor GC) copies live young objects (semi-space). Surviving objects are promoted to old space. Major GC uses mark-sweep-compact with incremental/concurrent/parallel techniques to reduce pauses.

### I9. Promise and microtask internals
`await` schedules continuation through the promise job queue. V8 runs microtasks after each macrotask callback returns to the embedder (Node drains `nextTick` first, then microtasks).

### I10. Worker threads vs processes
Workers share the process, have their own V8 isolate and event loop, and can share memory with `SharedArrayBuffer`. Processes are isolated, heavier, and communicate over IPC.

### I11. Buffers
`Buffer` is a subclass of `Uint8Array` backed by an `ArrayBuffer`. Small allocations may come from a shared pool (`Buffer.allocUnsafe` is faster but not zero-filled, so avoid exposing it). Buffer memory counts as external memory.

### I12. Async context
`AsyncLocalStorage` propagates a store through async continuations using async context frames (newer Node versions rely on V8 async context improvements). It follows promises, timers and callbacks created inside `run()`.

### I13. HTTP parsing
Node uses the `llhttp` parser. Requests are parsed into headers and a body stream. Keep-alive connections are reused; `headersTimeout`, `requestTimeout`, `keepAliveTimeout` control lifetimes. `undici` powers the global `fetch`.

### I14. Startup snapshots and SEA
Node can start from a V8 snapshot to speed up boot. Single Executable Applications (`node:sea`) bundle a script into a binary. Both are evolving: verify against current docs.

---

# 📊 Part 13: Reference Tables

### Event loop quick reference
| Mechanism | Runs when | Notes |
|---|---|---|
| `process.nextTick` | After the current operation, before promises | Can starve I/O if recursive |
| Promise `.then` / `await` | Microtask queue, after nextTick | Runs between callbacks |
| `setTimeout` / `setInterval` | Timers phase | Delay is a minimum, not exact |
| I/O callbacks | Poll phase | Network/fs completion |
| `setImmediate` | Check phase (after poll) | Good inside I/O callbacks |
| `'close'` events | Close callbacks phase | Cleanup notifications |

### Core module guide
| Need | Use |
|---|---|
| Files | `node:fs/promises` |
| Paths | `node:path` |
| HTTP server/client | `node:http`, `fetch` |
| Crypto | `node:crypto` |
| Streams | `node:stream/promises` |
| Parallel CPU work | `node:worker_threads` |
| Child programs | `node:child_process` |
| Tests | `node:test`, `node:assert/strict` |
| CLI args | `node:util` `parseArgs` |
| Timing | `node:perf_hooks` |
| Context | `node:async_hooks` |

### `fs` API styles
| Style | Example | When |
|---|---|---|
| Promises | `await fs.promises.readFile(f)` | Default choice |
| Callback | `fs.readFile(f, cb)` | Legacy code |
| Sync | `fs.readFileSync(f)` | Startup/scripts only |
| Streams | `fs.createReadStream(f)` | Large files |

### Common error codes
| Code | Meaning | Typical cause |
|---|---|---|
| `ENOENT` | No such file or directory | Wrong path |
| `EACCES` / `EPERM` | Permission denied | File/port permissions |
| `EADDRINUSE` | Port in use | Duplicate server |
| `ECONNREFUSED` | Nothing listening | Service down / wrong host |
| `ECONNRESET` | Connection reset by peer | Peer closed / keep-alive mismatch |
| `ETIMEDOUT` | Connection timed out | Network/firewall/no timeout set |
| `EMFILE` | Too many open files | FD leak / high concurrency |
| `EPIPE` | Write to closed pipe | Client disconnected |
| `ENOTFOUND` | DNS lookup failed | Bad hostname / DNS issue |
| `ERR_MODULE_NOT_FOUND` | ESM import not found | Missing extension/package |
| `ERR_REQUIRE_ESM` | Required an ES module | Module system mismatch |

### Useful CLI flags
| Flag | Purpose |
|---|---|
| `--watch` | Restart on file changes |
| `--env-file=.env` | Load env file |
| `--inspect` / `--inspect-brk` | Debugger |
| `--max-old-space-size=MB` | Heap limit |
| `--cpu-prof` / `--heap-prof` | Profiles |
| `--heapsnapshot-signal=SIGUSR2` | Heap snapshot on signal |
| `--report-on-fatalerror` | Diagnostic report on crash |
| `--trace-warnings` / `--trace-deprecation` | Find warning source |
| `--unhandled-rejections=mode` | Control rejection behavior |
| `--permission` | Permission model (verify availability) |
| `--test` | Run tests |

### Release schedule (verify on nodejs.org/en/about/previous-releases)
| Line | Meaning |
|---|---|
| Even majors (20, 22, 24) | Become LTS (~30 months total support) |
| Odd majors (21, 23, 25) | Short-lived "Current" releases |
| Production rule | Run an active or maintenance LTS only |

### Frameworks at a glance
| Framework | Style | Notes |
|---|---|---|
| Express | Minimal, middleware | Most popular (see file 013) |
| Fastify | Schema-driven, fast | Built-in validation/logging |
| Koa | Async middleware, small core | By Express authors |
| NestJS | Opinionated, DI, decorators | Angular-like structure |
| Hono | Tiny, web-standard APIs | Runs on many runtimes |


---

# 🔮 Part 14: Output & Prediction Questions

> Predict the output before reading the answer. Explain *why* using phases and queues.

### O1. Basic ordering
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
```
**Output:** `1, 5, 4, 3, 2`. Sync code first (1, 5), then `nextTick` (4), then promise microtask (3), then the timer (2).

### O2. `setImmediate` inside I/O
```js
import fs from 'node:fs';
fs.readFile(import.meta.filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
```
**Output:** `immediate, timeout`. After the poll phase comes the check phase (immediate) before timers run again.

### O3. Top-level order of timeout vs immediate
```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
```
**Output:** Either order is possible in the main module (depends on timing). Don't rely on it.

### O4. Async function ordering
```js
async function a() { console.log('a1'); await b(); console.log('a2'); }
async function b() { console.log('b'); }
console.log('start');
a();
console.log('end');
```
**Output:** `start, a1, b, end, a2`. `await` yields; `a2` runs as a microtask after sync code.

### O5. Microtasks inside microtasks
```js
Promise.resolve().then(() => {
  console.log('p1');
  Promise.resolve().then(() => console.log('p2'));
});
setTimeout(() => console.log('t'), 0);
```
**Output:** `p1, p2, t`. The microtask queue is fully drained (including new microtasks) before the next macrotask.

### O6. `nextTick` recursion starves I/O
```js
let i = 0;
function loop() { if (i++ < 3) process.nextTick(loop); console.log('tick', i); }
setTimeout(() => console.log('timer'), 0);
loop();
```
**Output:** `tick 1, tick 2, tick 3, tick 4, timer`. All ticks run before the timer. An endless version would block timers forever.

### O7. `forEach` with `await`
```js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
[1, 2, 3].forEach(async (n) => { await sleep(10); console.log(n); });
console.log('done');
```
**Output:** `done, 1, 2, 3`. `forEach` does not wait.

### O8. `exports` reassignment (CJS)
```js
// a.js
exports = { x: 1 };
// b.js
console.log(require('./a.js'));
```
**Output:** `{}`. Reassigning `exports` breaks its link to `module.exports`.

### O9. Promise error handling
```js
Promise.reject(new Error('x'))
  .catch(() => console.log('caught'))
  .then(() => console.log('then'))
  .finally(() => console.log('finally'));
```
**Output:** `caught, then, finally`. `catch` returns a resolved promise.

### O10. `Promise.all` fail-fast
```js
const a = new Promise((r) => setTimeout(() => r('A'), 50));
const b = Promise.reject(new Error('B'));
Promise.all([a, b]).then(console.log).catch((e) => console.log(e.message));
```
**Output:** `B`. Rejects immediately; `a` still runs but its result is ignored.

### O11. Event emitter order
```js
import { EventEmitter } from 'node:events';
const e = new EventEmitter();
e.on('x', () => console.log('first'));
e.on('x', () => console.log('second'));
e.prependListener('x', () => console.log('zero'));
e.emit('x');
```
**Output:** `zero, first, second`. Listeners run synchronously in order.

### O12. `emit` is synchronous
```js
e.on('hi', () => console.log('listener'));
console.log('before'); e.emit('hi'); console.log('after');
```
**Output:** `before, listener, after`.

### O13. Closure and `var` in timers
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);
```
**Output:** `3, 3, 3, 0, 1, 2`.

### O14. Buffer length
```js
console.log('héllo'.length, Buffer.byteLength('héllo'));
```
**Output:** `5 6`. The `é` takes 2 bytes in UTF-8.

### O15. `JSON.stringify` edge cases
```js
console.log(JSON.stringify({ a: undefined, b: () => {}, c: NaN, d: new Date(0), e: 10n === 10n }));
```
**Output:** `{"c":null,"d":"1970-01-01T00:00:00.000Z","e":true}`. `undefined` and functions are skipped; `NaN` becomes `null`. (A real `BigInt` value would throw.)

### O16. `process.nextTick` vs `queueMicrotask`
```js
queueMicrotask(() => console.log('micro'));
process.nextTick(() => console.log('tick'));
```
**Output (CommonJS):** `tick, micro`.

### O17. `await` of a non-promise
```js
(async () => { console.log(1); await 0; console.log(2); })();
console.log(3);
```
**Output:** `1, 3, 2`.

### O18. `finally` and return
```js
function f() { try { return 'try'; } finally { console.log('finally'); } }
console.log(f());
```
**Output:** `finally, try`.

### O19. Unhandled rejection
```js
Promise.reject(new Error('boom'));
setTimeout(() => console.log('still alive?'), 100);
```
**Output (Node 15+):** The process crashes with the error; the timer message is not printed (default `--unhandled-rejections=throw`).

### O20. Stream events order
```js
import { Readable } from 'node:stream';
Readable.from(['a', 'b'])
  .on('data', (c) => console.log('data', c))
  .on('end', () => console.log('end'));
console.log('sync');
```
**Output:** `sync, data a, data b, end`. Data flows asynchronously.

### O21. Timers order with the same delay
```js
setTimeout(() => console.log('A'), 10);
setTimeout(() => console.log('B'), 10);
setTimeout(() => console.log('C'), 5);
```
**Output:** `C, A, B`. Equal delays keep insertion order.

### O22. `this` in modules
```js
console.log(this === module.exports);   // CJS
```
**Output:** `true` in CommonJS. In ESM, top-level `this` is `undefined`.

---

# ✅ Part 15: MCQs

> Answer key is at the end of this part.

**1.** Which engine does Node.js use?
A) SpiderMonkey B) V8 C) Chakra D) JavaScriptCore

**2.** Which library implements the event loop?
A) libuv B) libc C) OpenSSL D) llhttp

**3.** Default libuv thread pool size?
A) 1 B) 2 C) 4 D) 8

**4.** Which runs first?
A) `setTimeout` B) `setImmediate` C) `process.nextTick` D) I/O callback

**5.** Best way to connect streams with error handling?
A) `a.pipe(b).pipe(c)` B) `stream.pipeline` C) Manual `on('data')` D) `fs.copyFile`

**6.** Which is NOT a stream type?
A) Readable B) Writable C) Transform D) Observable

**7.** What does `npm ci` do?
A) Updates all packages B) Clean install from the lockfile C) Cleans cache D) Creates a new project

**8.** Which flag loads a `.env` file natively?
A) `--dotenv` B) `--env-file` C) `--load-env` D) `--config`

**9.** How do you get the file's directory in ESM (Node 20.11+)?
A) `__dirname` B) `import.meta.dirname` C) `process.dir` D) `module.path`

**10.** What does `server.keepAliveTimeout` default to?
A) 1 s B) 5 s C) 30 s D) 120 s

**11.** Which API is best for CPU-heavy JavaScript work?
A) `setImmediate` B) `worker_threads` C) `Promise.all` D) `async/await`

**12.** `exec` vs `execFile`: which is safer with user input?
A) `exec` B) `execFile` C) Both equal D) Neither

**13.** Which password hashing is suitable?
A) MD5 B) SHA-256 alone C) scrypt/argon2/bcrypt D) Base64

**14.** What happens when `write()` returns `false`?
A) Data is lost B) Buffer is above the high-water mark; wait for `'drain'` C) Stream is closed D) Error is thrown

**15.** Which creates a cryptographically secure random UUID?
A) `Math.random()` B) `crypto.randomUUID()` C) `Date.now()` D) `uuid.fake()`

**16.** What is the correct signal for graceful container stop?
A) `SIGKILL` B) `SIGTERM` C) `SIGSTOP` D) `SIGHUP` only

**17.** Which module provides request-scoped context across async calls?
A) `vm` B) `AsyncLocalStorage` C) `cluster` D) `dns`

**18.** Which statement about `require` is true?
A) Async by default B) Cached after the first load C) Works only in ESM D) Returns a promise

**19.** Which is a cause of `ERR_REQUIRE_ESM`?
A) Missing file B) Requiring an ES module from CommonJS (older behavior) C) Port in use D) Low memory

**20.** What does `process.exit()` do?
A) Waits for pending work B) Terminates immediately C) Restarts the app D) Emits `SIGTERM`

**21.** Which is the production-ready Node release line?
A) Any odd major B) Even-numbered LTS C) Nightly D) Canary

**22.** `Promise.allSettled` returns:
A) First fulfilled B) Results for all, never rejects C) First rejection D) Race result

**23.** Which tool helps detect event loop delay?
A) `monitorEventLoopDelay` B) `fs.watch` C) `os.cpus` D) `url.parse`

**24.** What is a heap snapshot used for?
A) Measuring network B) Finding memory leaks C) Checking types D) Linting

**25.** Which approach avoids SQL injection?
A) String concatenation B) Parameterized queries C) Escaping manually only D) Base64 encoding

**26.** A `Buffer` is a subclass of:
A) `Array` B) `Uint8Array` C) `String` D) `Map`

**27.** What does `AbortSignal.timeout(3000)` do?
A) Delays 3 s B) Creates a signal that aborts after 3 s C) Kills the process D) Sets the heap size

**28.** In ESM, which is available?
A) `require` B) `__dirname` C) top-level `await` D) `module.exports`

**29.** Which is true about `cluster`?
A) Shares memory across workers B) Forks processes that can share a server port C) Runs threads D) Only works on Windows

**30.** Which command runs the built-in test runner?
A) `node --test` B) `node --jest` C) `npm run jest` D) `node test.exe`

**31.** Which HTTP status fits "payload too large"?
A) 400 B) 413 C) 429 D) 502

**32.** What is the main reason to avoid `fs.readFileSync` in request handlers?
A) It is deprecated B) It blocks the event loop C) It only reads text D) It is slower on SSD

**33.** `emitter.emit('error')` with no listener will:
A) Be ignored B) Throw and may crash the process C) Log a warning only D) Retry

**34.** Best practice for secrets:
A) Commit `.env` B) Use a secret manager / environment injection C) Hard-code in source D) Put in `package.json`

**35.** Which is the idempotent HTTP method?
A) POST B) PUT C) PATCH (always) D) CONNECT

**36.** What is `process.nextTick` queue priority?
A) After timers B) Before promise microtasks C) After `setImmediate` D) Same as I/O

**37.** Which header combination is a typical CORS preflight?
A) `GET` with no headers B) `OPTIONS` with `Access-Control-Request-Method` C) `HEAD` D) `TRACE`

**38.** Where should DB connections be released?
A) Never B) In a `finally` block C) Only on errors D) After process exit

**39.** Which is correct for reading a large file?
A) `readFileSync` B) `createReadStream` C) `JSON.parse` the whole file D) `Buffer.concat` everything

**40.** In Docker, how should the Node process start for proper signals?
A) `CMD npm start` B) `CMD ["node","server.js"]` C) `CMD sh -c "node server.js"` D) `ENTRYPOINT bash`

### Answer key
1-B, 2-A, 3-C, 4-C, 5-B, 6-D, 7-B, 8-B, 9-B, 10-B, 11-B, 12-B, 13-C, 14-B, 15-B, 16-B, 17-B, 18-B, 19-B, 20-B, 21-B, 22-B, 23-A, 24-B, 25-B, 26-B, 27-B, 28-C, 29-B, 30-A, 31-B, 32-B, 33-B, 34-B, 35-B, 36-B, 37-B, 38-B, 39-B, 40-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Blocking the event loop with sync APIs
❌
```js
app.get('/report', (req, res) => {
  const data = fs.readFileSync('big.csv', 'utf8');       // blocks everyone
  res.send(heavyParse(data));
});
```
🤔 Node runs your JavaScript on one thread. While this handler works, no other request is served, so latency spikes for all users.
✅
```js
app.get('/report', async (req, res, next) => {
  try { res.send(await heavyParseAsync(await fs.promises.readFile('big.csv', 'utf8'))); }
  catch (err) { next(err); }
});
// For CPU-heavy parsing: run it in a worker thread.
```
💬 "I never use sync I/O on hot paths and I move CPU-heavy work to workers, because one blocked event loop affects every connection."

### Mistake 2: Forgetting `await` or error handling in async code
❌
```js
app.post('/users', async (req, res) => {
  const user = await db.insert(req.body);        // if this throws, request hangs / unhandled rejection
  res.status(201).json(user);
});
```
🤔 A rejected promise inside an async handler is not caught by older Express and may crash the process or leave the request open.
✅
```js
app.post('/users', async (req, res, next) => {
  try { res.status(201).json(await db.insert(req.body)); }
  catch (err) { next(err); }
});
```
💬 "I always handle async errors, with a wrapper or try/catch, and I enable lint rules for floating promises."

### Mistake 3: `await` inside `forEach`
❌
```js
items.forEach(async (item) => { await save(item); });
console.log('all saved');      // prints before saving finishes
```
🤔 `forEach` ignores the promises it gets, so nothing waits for them.
✅
```js
for (const item of items) await save(item);                  // sequential
await Promise.all(items.map(save));                          // parallel (limit concurrency for large lists)
```
💬 "forEach doesn't await. I choose for...of for order or Promise.all with a limit for speed."

### Mistake 4: Unbounded `Promise.all`
❌
```js
await Promise.all(tenThousandIds.map((id) => fetchUser(id)));
```
🤔 This opens 10,000 requests at once, overloading the network, the DB and memory.
✅
```js
const users = await mapLimit(tenThousandIds, 10, fetchUser);   // see Q110
```
💬 "I limit concurrency so I don't overload dependencies."

### Mistake 5: No timeouts on outbound calls
❌
```js
const res = await fetch('https://slow.example.com/data');
```
🤔 A slow service can hang your requests forever; they pile up and exhaust resources.
✅
```js
const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
```
💬 "Every network call gets a timeout, and retries use backoff."

### Mistake 6: Ignoring backpressure
❌
```js
readable.on('data', (chunk) => writable.write(chunk));     // ignores write() result
```
🤔 If the writer is slower, data piles up in memory.
✅
```js
await pipeline(readable, writable);
```
💬 "I use pipeline so backpressure and cleanup are handled."

### Mistake 7: Using `Math.random()` for tokens or secrets
❌
```js
const token = Math.random().toString(36).slice(2);
```
🤔 It is predictable, so attackers can guess tokens.
✅
```js
import { randomBytes } from 'node:crypto';
const token = randomBytes(32).toString('base64url');
```
💬 "Security tokens must come from a cryptographically secure source."

### Mistake 8: Storing passwords with fast hashes
❌
```js
const hash = crypto.createHash('sha256').update(password).digest('hex');
```
🤔 Fast hashes are easy to brute-force.
✅
```js
import argon2 from 'argon2';
const hash = await argon2.hash(password);
const ok = await argon2.verify(hash, password);
```
💬 "I use slow, salted password hashes (argon2, bcrypt or scrypt)."

### Mistake 9: Building SQL with string concatenation
❌
```js
db.query(`SELECT * FROM users WHERE email = '${email}'`);
```
🤔 This allows SQL injection.
✅
```js
db.query('SELECT * FROM users WHERE email = $1', [email]);
```
💬 "I always use parameterized queries and validate input."

### Mistake 10: Using `exec` with user input
❌
```js
exec(`convert ${req.query.file} out.png`);
```
🤔 A shell runs the string, so `; rm -rf /` style input can run commands.
✅
```js
execFile('convert', [safeFileName, 'out.png']);
```
💬 "I avoid shells and pass arguments as an array, after validating input."

### Mistake 11: Memory leaks from global caches and listeners
❌
```js
const cache = {};
app.get('/x/:id', async (req, res) => { cache[req.params.id] = await load(req.params.id); res.json(cache[req.params.id]); });
```
🤔 The cache grows forever until the process runs out of memory.
✅
```js
const cache = new TTLCache({ max: 5000, ttlMs: 60_000 });      // bounded (see C11)
```
💬 "Every cache needs a size limit and expiry."

### Mistake 12: Crashing without graceful shutdown
❌
```js
process.on('SIGTERM', () => process.exit(0));
```
🤔 In-flight requests are dropped and connections are cut.
✅
```js
process.on('SIGTERM', () => server.close(async () => { await pool.end(); process.exit(0); }));
```
💬 "On SIGTERM I stop accepting traffic, finish in-flight requests, close resources, then exit."

### Mistake 13: Swallowing errors and continuing after `uncaughtException`
❌
```js
process.on('uncaughtException', () => {});   // ignore everything
```
🤔 The process may be in an unknown state; bugs are hidden.
✅
```js
process.on('uncaughtException', (err) => { logger.fatal(err); logger.flush(); process.exit(1); });
```
💬 "I log, exit and let the supervisor restart a clean process."

### Mistake 14: Hard-coding config and secrets
❌
```js
const DB_URL = 'postgres://admin:pass@prod-db/app';
```
🤔 Secrets leak into Git, and config cannot change per environment.
✅
```js
const env = Env.parse(process.env);          // validated at startup (see C22)
```
💬 "Config comes from the environment, validated at startup; secrets come from a secret manager."

### Mistake 15: Wrong `keepAliveTimeout` behind a load balancer
❌
```js
http.createServer(app).listen(3000);      // default keepAliveTimeout is 5 seconds
```
🤔 The load balancer reuses an idle connection that Node already closed, giving random 502 errors.
✅
```js
server.keepAliveTimeout = 65_000; server.headersTimeout = 66_000;
```
💬 "Node's keep-alive timeout must be longer than the load balancer idle timeout."

### Mistake 16: Running as root and shipping dev dependencies in Docker
❌
```dockerfile
FROM node:22
COPY . .
RUN npm install
CMD npm start
```
🤔 Large image, root user, slow signal handling, dev packages in production.
✅
```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "server.js"]
```
💬 "Small image, non-root user, production dependencies only, and `node` as PID 1 for proper signals."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

> Interviewers listen for *how* you answer. Use the strong pattern.

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "Is Node single-threaded?" | "Yes." | "JavaScript runs on one thread, but libuv has a thread pool, V8 has helper threads, and I can add worker threads." |
| "How does async work?" | "With callbacks and promises." | "The event loop moves between phases; completed I/O queues callbacks; microtasks (`nextTick`, promises) run between callbacks." |
| "How do you scale Node?" | "Add more servers." | "Keep it stateless, scale horizontally, cache, queue slow work, and measure p95/p99 and event loop lag." |
| "How do you handle errors?" | "try/catch." | "Operational vs programmer errors; centralized error handling; log with correlation IDs; exit on uncaught exceptions; supervisor restarts." |
| "How do you secure an API?" | "Use JWT." | "Validate input, parameterize queries, rate limit, hash passwords with argon2, set secure headers, manage secrets, audit dependencies, least privilege." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Names tools only | Explains trade-offs and when *not* to use a tool |
| Says "it depends" and stops | Says "it depends on X and Y; for this case I'd choose Z because..." |
| Fixes symptoms | Finds root cause with profiles, snapshots and metrics |
| Ignores production | Mentions timeouts, graceful shutdown, observability, rollbacks |
| Talks about code only | Mentions tests, CI, deploy strategy and monitoring |
| Memorized definitions | Gives real incidents with numbers (latency, memory, cost) |

### Signal table 3: Phrases that show depth
- "I check event loop lag, not only CPU."
- "I'd reproduce it with a load test and compare heap snapshots."
- "Timeouts, retries with jitter, and circuit breakers protect dependencies."
- "I make handlers idempotent so retries are safe."
- "I keep Node on an active LTS and automate dependency updates."
- "Graceful shutdown: stop accepting, drain, close pools, then exit."

### Signal table 4: Questions you should ask the interviewer
- What are your SLOs, and how do you monitor event loop health?
- How do you deploy (rolling, blue/green) and handle migrations?
- What is the Node LTS and dependency update policy?
- How do you handle on-call and post-mortems?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The mental model (say it in 30 seconds)
Node = V8 (runs JS) + libuv (event loop, async I/O, thread pool) + core modules. One thread runs your JS; I/O is delegated to the OS or the thread pool; when it finishes, its callback is queued and the loop runs it. Never block the loop.

### 2. Execution order
```
sync code
 → process.nextTick queue
 → promise microtasks
 → timers (setTimeout/setInterval)
 → poll (I/O)
 → check (setImmediate)
 → close callbacks
 (nextTick + microtasks drain between every callback)
```

### 3. Async patterns
| Pattern | Use | Watch out |
|---|---|---|
| Callback | Legacy APIs | Callback hell, error-first |
| Promise / async-await | Default | Always handle rejections |
| `Promise.all` | Parallel, all must pass | Limit concurrency |
| `Promise.allSettled` | Parallel, collect all results | Check statuses |
| Streams + `pipeline` | Large/continuous data | Backpressure, errors |
| Events | Notifications | Add `'error'` listener, avoid leaks |
| Worker threads | CPU work | Message copying cost |

### 4. Production checklist
- [ ] Active LTS Node, pinned in `.nvmrc` / Docker image
- [ ] Config validated at startup, secrets from a manager
- [ ] Structured logs with correlation IDs (pino)
- [ ] Timeouts on every outbound call and DB query
- [ ] Graceful shutdown on `SIGTERM`
- [ ] Health (`/healthz`) and readiness (`/readyz`) endpoints
- [ ] `keepAliveTimeout` > load balancer idle timeout
- [ ] Input validation (zod/ajv), parameterized queries, rate limits
- [ ] Security headers, CORS configured precisely, dependency audit in CI
- [ ] Metrics: RED metrics, event loop lag, heap/RSS, DB pool usage
- [ ] Non-root container, `npm ci --omit=dev`, `CMD ["node", ...]`
- [ ] Tests: unit, integration, load; CI gate

### 5. Security checklist
Validate input · Parameterize queries · Hash with argon2/bcrypt/scrypt · Use `crypto.randomBytes` · Avoid `eval` and shell strings · Prevent path traversal · Guard against prototype pollution and ReDoS · Limit body size · Rate limit · Use HTTPS/HSTS · Verify JWT algorithms · Keep dependencies updated.

### 6. Performance checklist
Profile before optimizing · Avoid sync I/O · Offload CPU work · Stream large data · Cache hot reads · Batch DB queries · Reuse connections (keep-alive agents/pools) · Compress responses · Keep object shapes stable · Watch GC and heap.

### 7. Debug toolbox
| Symptom | Tool / action |
|---|---|
| High CPU | `--cpu-prof`, flame graph, `clinic flame` |
| Memory growth | Heap snapshots (compare), `--heap-prof`, `process.memoryUsage()` |
| Slow requests | Tracing, `monitorEventLoopDelay`, DB slow query log |
| Crashes | Diagnostic report, core logs, `--trace-warnings` |
| Hanging process | `why-is-node-running`, `process.getActiveResourcesInfo()` |

### 8. Top 20 one-liners to memorize
1. Node is single-threaded for JS, multi-threaded under the hood.
2. `nextTick` > promises > timers > I/O > `setImmediate` (roughly, per phase rules).
3. Never block the event loop.
4. Use `pipeline` for streams.
5. Handle backpressure.
6. `exports` is a reference to `module.exports`.
7. ESM has no `__dirname`; use `import.meta.dirname`.
8. Timeouts on everything external.
9. Retry only idempotent calls, with backoff and jitter.
10. `uncaughtException`: log and exit.
11. `SIGTERM`: drain and close.
12. `execFile` over `exec`.
13. Parameterized queries always.
14. `crypto.randomBytes`, never `Math.random()` for secrets.
15. Bound every cache.
16. One Node process per container; scale horizontally.
17. `keepAliveTimeout` above the load balancer timeout.
18. Run an even-numbered LTS in production.
19. Measure p95/p99, not just averages.
20. Profile before you optimize.

### 9. The 60-second answer: "Why Node.js?"
"Node is great for I/O-bound, high-concurrency services because its event loop handles many connections with low memory. It lets teams share JavaScript/TypeScript across frontend and backend and has a huge ecosystem. For CPU-heavy work I use worker threads or a different service. In production I focus on timeouts, graceful shutdown, observability and security."

### 10. Final revision order
Event loop and async order → streams and backpressure → error handling → modules → security → performance and profiling → scaling and deployment → debugging stories (prepare two real ones).

