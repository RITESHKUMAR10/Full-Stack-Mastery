# GraphQL & REST APIs Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **HTTP/1.1, HTTP/2 and HTTP/3 semantics (RFC 9110/9111)**, **REST** as practised with JSON over HTTP, **OpenAPI 3.1**, and **GraphQL** (June 2018 spec plus the GraphQL Foundation's newer drafts, with `@defer`/`@stream` and incremental delivery still evolving: verify) using **Node.js** (Express, Fastify, NestJS), **Apollo Server 4/Apollo Client 3**, **GraphQL Yoga**, **graphql-js 16**, **Apollo Federation 2**, and comparisons with **gRPC**, **tRPC** and **webhooks**. Anything marked "verify" should be checked in the official specs and docs (httpwg.org, spec.graphql.org, apollographql.com/docs). Examples use the sample name **Ritesh Kumar**.
> This file covers HTTP fundamentals, REST design (resources, verbs, status codes, idempotency, versioning, pagination, filtering, caching, HATEOAS, error formats, rate limiting), API security (authN/authZ, OAuth2, JWT, CORS, CSRF, OWASP API Top 10), documentation (OpenAPI), GraphQL (schema, types, queries, mutations, subscriptions, resolvers, DataLoader, errors, pagination, federation, caching, security, performance), GraphQL vs REST vs gRPC vs tRPC, API gateways/BFF, testing, observability and production practice. Database layers refer to `026_SQL.md`, `030_MongoDB.md` and `033_Prisma-and-ORMs.md`; caching refers to `031_Redis-and-Caching.md`.

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
- [Part 12: API Internals](#-part-12-api-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is an API?
An **Application Programming Interface** is a contract that lets one piece of software talk to another without knowing its internals. Web APIs expose operations over a network (usually HTTP) so clients (browsers, mobile apps, other services) can request data or trigger actions. Styles: REST, GraphQL, gRPC, SOAP, WebSocket, webhooks.

### Q2. What is REST? *(Must-know)*
**REpresentational State Transfer**, an architectural style defined by Roy Fielding (2000) for networked systems, usually implemented as resource-oriented HTTP APIs. Constraints: **client-server**, **stateless**, **cacheable**, **uniform interface**, **layered system**, and optional **code on demand**. A resource (`/users/42`) is identified by a URI and manipulated through representations (JSON) using standard HTTP methods.

### Q3. REST vs RESTful vs "HTTP API"
Many APIs called REST are really **HTTP JSON APIs** (resource URLs + verbs) that skip HATEOAS. Fielding's strict REST requires hypermedia-driven navigation (Richardson Maturity Model Level 3). In interviews, say "REST-style" and explain which constraints you follow.

### Q4. HTTP request and response structure
```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJ...
Accept: application/json

{"name":"Ritesh Kumar","email":"ritesh@example.com"}
```
```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/42
ETag: "a1b2"

{"id":42,"name":"Ritesh Kumar"}
```
Parts: method, path/query, headers, optional body; response status code, headers, optional body.

### Q5. HTTP methods and semantics *(Must-know)*
| Method | Purpose | Safe | Idempotent | Body |
|---|---|---|---|---|
| GET | Read | Yes | Yes | No |
| HEAD | Headers only | Yes | Yes | No |
| POST | Create / action | No | **No** | Yes |
| PUT | Replace whole resource | No | Yes | Yes |
| PATCH | Partial update | No | Not guaranteed | Yes |
| DELETE | Remove | No | Yes | Optional |
| OPTIONS | Capabilities / CORS preflight | Yes | Yes | No |
**Safe** = no server state change. **Idempotent** = repeating the request has the same effect as sending it once.

### Q6. PUT vs PATCH vs POST
- `POST /users`: server assigns the id (creates a new resource each call).
- `PUT /users/42`: replace the entire resource (missing fields are reset/removed); client supplies the id.
- `PATCH /users/42`: change only provided fields (JSON Merge Patch RFC 7396 or JSON Patch RFC 6902).

### Q7. Status code classes *(Must-know)*
| Class | Meaning | Examples |
|---|---|---|
| 1xx | Informational | 100 Continue, 101 Switching Protocols |
| 2xx | Success | 200 OK, 201 Created, 202 Accepted, 204 No Content |
| 3xx | Redirection | 301, 302, 304 Not Modified, 307, 308 |
| 4xx | Client error | 400, 401, 403, 404, 405, 409, 410, 415, 422, 429 |
| 5xx | Server error | 500, 502, 503, 504 |

### Q8. 401 vs 403 vs 404
- **401 Unauthorized**: not authenticated (missing/invalid credentials). Include `WWW-Authenticate`.
- **403 Forbidden**: authenticated but not allowed.
- **404 Not Found**: resource doesn't exist (also used to hide existence for security).
- **400** bad request syntax/validation; **422** semantically invalid; **409** conflict (duplicate, version mismatch).

### Q9. Resource naming conventions
Use **nouns, plural, lowercase, hyphenated** paths: `/users`, `/users/42/orders`, `/order-items`. Avoid verbs in paths (`/getUsers`), avoid deep nesting beyond ~2 levels (`/users/42/orders/7` is fine, further use query params), be consistent. Actions that don't fit CRUD: model as resources (`POST /orders/7/cancellation`) or sub-resources.

### Q10. Query parameters vs path parameters
Path params identify a specific resource (`/users/42`). Query params filter, sort, search or paginate collections (`/users?role=admin&sort=-createdAt&page=2`). Don't put sensitive data (tokens, passwords) in URLs: they end up in logs/history.

### Q11. JSON basics
JavaScript Object Notation: objects `{}`, arrays `[]`, strings, numbers, booleans, `null`. Not supported: comments, `undefined`, `Date`, `BigInt`. Dates should be ISO 8601 strings (`2025-10-24T10:00:00Z`); money as integer minor units or strings.

### Q12. Content negotiation and headers
`Accept` (what the client wants), `Content-Type` (what is being sent), `Accept-Language`, `Accept-Encoding` (gzip/br), `Authorization`, `User-Agent`, `Cache-Control`, `ETag`/`If-None-Match`, `Location`, `Retry-After`. Return `415 Unsupported Media Type` or `406 Not Acceptable` when negotiation fails.

### Q13. A basic Express REST API
```js
import express from "express";
const app = express();
app.use(express.json());

const users = new Map();
let nextId = 1;

app.get("/api/users", (req, res) => res.json([...users.values()]));
app.get("/api/users/:id", (req, res) => {
  const u = users.get(Number(req.params.id));
  return u ? res.json(u) : res.status(404).json({ error: "User not found" });
});
app.post("/api/users", (req, res) => {
  const { name, email } = req.body ?? {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });
  const user = { id: nextId++, name, email };
  users.set(user.id, user);
  res.status(201).location(`/api/users/${user.id}`).json(user);
});
app.delete("/api/users/:id", (req, res) => (users.delete(Number(req.params.id)) ? res.sendStatus(204) : res.sendStatus(404)));

app.listen(3000);
```

### Q14. Consuming an API with `fetch`
```js
const res = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ name: "Ritesh Kumar" }),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch doesn't reject on 4xx/5xx
const data = await res.json();
```
`fetch` only rejects on network failures; always check `res.ok`.

### Q15. What is statelessness?
Each request carries all information needed to process it; the server stores no client session between requests. Benefits: horizontal scalability, simpler failover, cache friendliness. Authentication state travels in tokens (JWT/opaque) or cookies validated on each call; server-side session stores (Redis) are still stateless at the app tier.

### Q16. What is CORS? *(Must-know)*
**Cross-Origin Resource Sharing** relaxes the browser's same-origin policy. For cross-origin requests the browser sends an `Origin` header (and a preflight `OPTIONS` for non-simple requests); the server responds with `Access-Control-Allow-Origin`, `-Methods`, `-Headers`, `-Credentials`, `-Max-Age`. It protects users' browsers; it does **not** secure your API from non-browser clients.
```js
import cors from "cors";
app.use(cors({ origin: ["https://app.example.com"], methods: ["GET","POST","PUT","DELETE"], credentials: true }));
```
`Access-Control-Allow-Origin: *` can't be combined with credentials.

### Q17. What is JWT?
A signed token `header.payload.signature` (Base64URL) carrying claims (`sub`, `exp`, `iat`, roles). The server verifies the signature (HS256 shared secret or RS256/ES256 public key) without a database lookup. JWTs are **encoded, not encrypted**: don't put secrets in them. Keep lifetimes short and use refresh tokens.

### Q18. Authentication vs authorization
**Authentication (AuthN)**: who are you? (password, OAuth, passkeys). **Authorization (AuthZ)**: what may you do? (roles, permissions, ownership checks). Check authorization on every request on the server, per resource (not just per route).

### Q19. API keys, Basic auth, Bearer tokens, OAuth2
| Scheme | Use |
|---|---|
| API key | Identify an application/project (not a user); send in header, not URL |
| Basic | Base64 `user:pass`; only over TLS; legacy/internal |
| Bearer token (JWT/opaque) | User/session access |
| OAuth 2.0 / OIDC | Delegated access; third-party login; scopes |
| mTLS | Service-to-service trust |

### Q20. HTTPS and TLS
Always use HTTPS: encrypts traffic, authenticates the server, prevents tampering. Enable HSTS, use modern TLS (1.2/1.3), and redirect HTTP to HTTPS.

### Q21. What is GraphQL? *(Must-know)*
A **query language and runtime for APIs** (open-sourced by Facebook in 2015) where clients ask for exactly the fields they need from a strongly typed **schema**, usually through a **single endpoint** (`POST /graphql`). Benefits: no over/under-fetching, one round trip for nested data, self-documenting typed schema, rapid frontend iteration.

### Q22. GraphQL vs REST: basics *(Must-know)*
| | REST | GraphQL |
|---|---|---|
| Endpoints | Many resource URLs | Usually one |
| Response shape | Fixed by server | Chosen by client |
| Over/under-fetching | Common | Avoided |
| Versioning | URL/header versions | Schema evolution (`@deprecated`) |
| Caching | HTTP caching natural | Harder (POST, dynamic) |
| Typing | Optional (OpenAPI) | Built-in schema |
| Errors | HTTP status codes | Usually 200 with `errors[]` |
| File upload | Native multipart | Needs extension (multipart spec) |
| Learning curve | Low | Medium |

### Q23. GraphQL schema and types
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int = 10, after: String): PostConnection!
}
type Post { id: ID! title: String! author: User! createdAt: DateTime! }
enum Role { USER ADMIN }
input CreateUserInput { name: String! email: String! role: Role = USER }

type Query {
  user(id: ID!): User
  users(role: Role): [User!]!
}
type Mutation { createUser(input: CreateUserInput!): User! }
type Subscription { postAdded: Post! }
```
Scalars: `Int`, `Float`, `String`, `Boolean`, `ID`; custom scalars (`DateTime`, `JSON`). `!` = non-null; `[User!]!` = non-null list of non-null users. Also `interface`, `union`, `input`, `enum`, directives.

### Q24. Queries, mutations, subscriptions
```graphql
query GetUser($id: ID!) {
  user(id: $id) { id name posts(first: 3) { edges { node { title } } } }
}
mutation { createUser(input: { name: "Ritesh Kumar", email: "ritesh@example.com" }) { id } }
subscription { postAdded { id title } }
```
Queries read (parallel fields), mutations write (top-level fields run **serially**), subscriptions stream events (WebSocket/SSE).

### Q25. Resolvers *(Must-know)*
Functions that produce the value of each field: `(parent, args, context, info) => value`.
```js
const resolvers = {
  Query: {
    user: (_, { id }, { db }) => db.user.findUnique({ where: { id } }),
    users: (_, { role }, { db }) => db.user.findMany({ where: { role } }),
  },
  User: { posts: (user, args, { db }) => db.post.findMany({ where: { authorId: user.id }, take: args.first }) },
  Mutation: { createUser: (_, { input }, { db }) => db.user.create({ data: input }) },
};
```
Default resolver returns `parent[fieldName]`. `context` holds per-request state (user, db, loaders).

### Q26. A minimal Apollo Server
```js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ user: await authenticate(req.headers.authorization), db }),
  listen: { port: 4000 },
});
console.log(`GraphQL ready at ${url}`);
```
Alternatives: GraphQL Yoga, Mercurius (Fastify), NestJS GraphQL, Pothos/Nexus (code-first), Hasura/PostGraphile (database-driven).

### Q27. Calling GraphQL from a client
```js
const res = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "query($id:ID!){ user(id:$id){ name } }", variables: { id: "42" } }),
});
const { data, errors } = await res.json();
```
Libraries: Apollo Client, urql, Relay, TanStack Query + graphql-request.

### Q28. Variables, aliases, fragments, directives
```graphql
query Compare($a: ID!, $b: ID!, $withPosts: Boolean!) {
  first: user(id: $a) { ...UserBits posts @include(if: $withPosts) { title } }
  second: user(id: $b) { ...UserBits }
}
fragment UserBits on User { id name email }
```
Aliases rename result keys; fragments reuse selections; `@include`/`@skip` are built-in directives; `@deprecated` marks fields.

### Q29. Introspection and GraphiQL / Playground
Clients can query the schema itself (`__schema`, `__type`), powering tooling, docs and codegen. Disable (or restrict) introspection in production for public APIs if schema secrecy matters; it is not a security control by itself.

### Q30. GraphQL errors
```json
{ "data": { "user": null },
  "errors": [ { "message": "Not authorized", "path": ["user"], "extensions": { "code": "FORBIDDEN" } } ] }
```
GraphQL often returns **HTTP 200** with partial `data` and an `errors` array. Use `extensions.code` for machine-readable errors. Non-null field errors propagate to the nearest nullable parent.

### Q31. Over-fetching and under-fetching
Over-fetching: endpoint returns more fields than needed (`/users/42` returns 30 fields). Under-fetching: multiple round trips needed (`/users/42`, then `/users/42/posts`, then `/posts/9/comments`). GraphQL solves both with client-chosen selection; REST mitigates with sparse fieldsets (`?fields=`), expansion (`?include=posts`) and BFFs.

### Q32. Idempotency in REST
GET/PUT/DELETE are idempotent by definition; POST isn't. For payments/orders use an **Idempotency-Key** header: the server stores the key and response so retries return the same result instead of duplicating.
```
POST /payments
Idempotency-Key: 3f9a1c0e-...
```

### Q33. Pagination basics *(Must-know)*
- **Offset/limit**: `?page=3&limit=20`; simple, slow for deep pages, unstable under inserts.
- **Cursor/keyset**: `?after=<cursor>&limit=20`; fast, stable.
- Return metadata: `nextCursor`, `hasMore`, optionally `total`. Always cap `limit` (for example 100).

### Q34. Filtering and sorting conventions
`GET /orders?status=paid&createdAfter=2025-01-01&sort=-createdAt,total`. Allow-list sortable/filterable fields (never pass raw column names), validate types, and document operators (`price[gte]=100` or `price_gte=100`).

### Q35. What are webhooks?
Server-to-server HTTP callbacks: instead of polling, a provider sends `POST` requests to your URL when events happen (payment succeeded). Verify signatures (HMAC), respond quickly with 2xx, process asynchronously, and handle retries idempotently.

### Q36. Tools for working with APIs
Postman / Insomnia / Bruno, `curl`, HTTPie, VS Code REST Client, Swagger UI / Redoc (OpenAPI docs), Apollo Studio / GraphiQL, browser DevTools Network tab, Mock servers (Prism, MSW), contract testing (Pact).

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. Richardson Maturity Model
Level 0: single endpoint tunnelling (RPC/SOAP style). Level 1: resources (many URIs). Level 2: HTTP verbs + status codes (most "REST" APIs). Level 3: **hypermedia controls** (HATEOAS: responses contain links for next actions). Most production APIs sit at Level 2.

### Q38. HATEOAS example
```json
{ "id": 42, "status": "pending",
  "_links": { "self": { "href": "/orders/42" }, "cancel": { "href": "/orders/42/cancellation", "method": "POST" },
              "payment": { "href": "/orders/42/payment" } } }
```
Clients follow links instead of hard-coding URLs; valid actions change with state. Formats: HAL, JSON:API, Siren. Benefits are loose coupling; costs are payload size and tooling adoption.

### Q39. Designing a good error response *(Must-know)*
Use a consistent structure, ideally **RFC 9457 Problem Details** (`application/problem+json`):
```json
{ "type": "https://api.example.com/errors/validation",
  "title": "Validation failed", "status": 422,
  "detail": "email must be a valid address",
  "instance": "/api/users",
  "errors": [ { "field": "email", "message": "Invalid email" } ],
  "traceId": "9f2c..." }
```
Include a stable machine-readable code, human message, field errors and a correlation id. Never leak stack traces or SQL.

### Q40. API versioning strategies *(Must-know)*
| Strategy | Example | Notes |
|---|---|---|
| URI | `/v1/users` | Simple, visible, cache-friendly; most common |
| Header | `Accept: application/vnd.example.v2+json` | Clean URLs, harder to test |
| Query | `/users?version=2` | Easy but messy |
| Date-based | `Stripe-Version: 2024-06-20` | Fine-grained, needs per-version transforms |
Prefer **additive, backward-compatible changes** (new optional fields/endpoints) and version only for breaking changes. Announce deprecation with `Deprecation` and `Sunset` headers.

### Q41. What is a breaking change?
Removing/renaming fields or endpoints, changing types or semantics, making optional params required, tightening validation, changing error formats or status codes, altering pagination defaults. Non-breaking: adding optional fields/params/endpoints, adding enum values (clients must tolerate unknown values).

### Q42. HTTP caching for REST *(Must-know)*
```
GET /products/42
Cache-Control: public, max-age=60, stale-while-revalidate=30
ETag: "v17"

GET /products/42
If-None-Match: "v17"   →  304 Not Modified
```
`Cache-Control` (freshness), `ETag`/`Last-Modified` (validation), `Vary` (cache key variation), `s-maxage` (CDN). Use `private`/`no-store` for personalized or sensitive responses. Optimistic concurrency with `If-Match` on `PUT/PATCH` prevents lost updates (412 Precondition Failed).

### Q43. Pagination formats: Link headers and envelopes
```
Link: <https://api.example.com/orders?cursor=abc>; rel="next"
```
or an envelope:
```json
{ "data": [ ... ], "pagination": { "nextCursor": "abc", "hasMore": true } }
```
Stripe/GitHub-style APIs use cursors or `Link` headers. Avoid returning huge `total` counts if expensive.

### Q44. Rate limiting and throttling *(Must-know)*
Protect against abuse and overload: fixed window, sliding window, token bucket, leaky bucket (implemented with Redis, see `031_Redis-and-Caching.md`). Respond with **429 Too Many Requests** and headers: `Retry-After`, `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (IETF draft). Limit per API key/user/IP/endpoint; apply stricter limits on auth endpoints and expensive operations.

### Q45. Input validation
Validate at the boundary with a schema (Zod, Joi, class-validator, JSON Schema/OpenAPI validators), enforce types, ranges, lengths, enums, and reject unknown fields. Sanitize output where needed. Validation errors → 400/422 with field details.
```ts
const CreateUser = z.object({ name: z.string().min(1).max(100), email: z.string().email() }).strict();
app.post("/users", (req, res) => {
  const parsed = CreateUser.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten().fieldErrors });
  ...
});
```

### Q46. OpenAPI / Swagger
A machine-readable description (YAML/JSON) of a REST API: paths, parameters, schemas, auth, responses. Enables docs (Swagger UI/Redoc), client/server code generation, validation, mocks and contract tests.
```yaml
openapi: 3.1.0
info: { title: Users API, version: 1.0.0 }
paths:
  /users/{id}:
    get:
      parameters: [ { name: id, in: path, required: true, schema: { type: integer } } ]
      responses:
        "200": { description: OK, content: { application/json: { schema: { $ref: "#/components/schemas/User" } } } }
        "404": { description: Not found }
components:
  schemas:
    User: { type: object, required: [id, name], properties: { id: { type: integer }, name: { type: string } } }
```
Approaches: **design-first** (write the spec, generate stubs) or **code-first** (generate the spec from code, e.g. NestJS Swagger, FastAPI).

### Q47. Layered architecture for an API
Routes/controllers (HTTP concerns) → services (business logic) → repositories/data access → database. Keep controllers thin, validation at the edge, authorization in services, and DTOs separate from DB models.

### Q48. Middleware pattern (Express)
Functions `(req, res, next)` executed in order: logging, security headers (`helmet`), CORS, body parsing, auth, rate limiting, validation, routes, then centralized error handler `(err, req, res, next)`. Async errors must reach `next(err)` (Express 5 forwards rejected promises automatically).

### Q49. Authentication flows: sessions vs JWT *(Must-know)*
| | Server sessions (cookie) | JWT bearer |
|---|---|---|
| State | Server stores session (Redis/DB) | Stateless token |
| Revocation | Easy (delete session) | Hard (blocklist/short expiry) |
| Scaling | Shared store needed | Easy |
| XSS/CSRF | Cookie + CSRF protection (`HttpOnly`, `SameSite`) | Header token; XSS can steal if in localStorage |
| Best for | Browser web apps | Mobile, APIs, service-to-service |
Use short-lived access tokens (5-15 min) plus rotating refresh tokens stored in `HttpOnly` cookies (for web).

### Q50. OAuth 2.0 and OpenID Connect in brief
OAuth 2.0 delegates **authorization** (access tokens with scopes); OIDC adds **authentication** (ID token with user identity). Flows: **Authorization Code + PKCE** (SPAs, mobile, web), **Client Credentials** (machine-to-machine), Device Code (TVs); avoid Implicit and Password flows. Validate `iss`, `aud`, `exp`, signature (JWKS), and scopes.

### Q51. CSRF and XSS
**CSRF**: a malicious site makes the browser send authenticated cookie requests; mitigate with `SameSite` cookies, CSRF tokens, checking `Origin`, and not using cookies for cross-site APIs. **XSS**: injected script steals tokens/acts as user; mitigate with output encoding, CSP, `HttpOnly` cookies, sanitizing HTML.

### Q52. Security headers and Helmet
`Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`, and remove `X-Powered-By`. `app.use(helmet())` sets sensible defaults.

### Q53. OWASP API Security Top 10 (2023) *(Must-know)*
1. Broken Object Level Authorization (BOLA/IDOR). 2. Broken Authentication. 3. Broken Object Property Level Authorization (mass assignment / excessive data exposure). 4. Unrestricted Resource Consumption. 5. Broken Function Level Authorization. 6. Unrestricted Access to Sensitive Business Flows. 7. SSRF. 8. Security Misconfiguration. 9. Improper Inventory Management. 10. Unsafe Consumption of APIs.
BOLA fix: always check the caller may access `/orders/{id}` (ownership/tenant), not just that they're logged in.

### Q54. Mass assignment and excessive data exposure
Never pass `req.body` directly to the ORM (`role: "admin"`); allow-list fields. Never return full DB rows: use response DTOs/serializers (omit `passwordHash`, internal flags). In GraphQL restrict fields with field-level authorization.

### Q55. SQL/NoSQL injection in APIs
Use parameterized queries/ORMs; validate types so `{"$ne": null}` can't slip into Mongo filters; avoid string-building SQL; escape dynamic identifiers via allow-lists.

### Q56. Logging, correlation IDs and request tracing
Assign a request id (`X-Request-Id` or W3C `traceparent`), propagate downstream, log structured JSON (method, path, status, latency, user id hash), and return the id in error responses. Never log secrets, tokens or full PII.

### Q57. Health checks and graceful shutdown
`/healthz` (liveness) and `/readyz` (readiness, checks DB/Redis). On `SIGTERM` stop accepting new connections, finish in-flight requests, close pools, then exit. Required for Kubernetes rolling deploys.

### Q58. Handling file uploads
REST: `multipart/form-data` (Multer, Busboy) with size/type limits, streaming to object storage, or pre-signed URLs (client uploads directly to S3/GCS; API stores metadata). GraphQL: use the multipart request spec (`graphql-upload`) or, better, pre-signed URLs returned by a mutation.

### Q59. Long-running operations
Return `202 Accepted` with a status resource: `Location: /jobs/123`; client polls `GET /jobs/123` (status, progress, result URL) or receives a webhook/SSE/WebSocket notification. Make creation idempotent.

### Q60. Bulk and batch operations
Options: `POST /users:batchCreate` or `/users/bulk` accepting arrays with per-item results (`207 Multi-Status`-style bodies), GraphQL batching/aliases, async jobs for large batches. Define atomicity (all-or-nothing vs partial) explicitly.

### Q61. GraphQL N+1 problem and DataLoader *(Must-know)*
Resolving `posts { author { name } }` for 50 posts runs 50 author queries.
```js
import DataLoader from "dataloader";
const makeLoaders = (db) => ({
  userById: new DataLoader(async (ids) => {
    const rows = await db.user.findMany({ where: { id: { in: [...ids] } } });
    const map = new Map(rows.map(u => [u.id, u]));
    return ids.map(id => map.get(id) ?? null);           // same order as ids
  }),
});
// context: { loaders: makeLoaders(db) }   // new instance PER REQUEST
const resolvers = { Post: { author: (post, _, { loaders }) => loaders.userById.load(post.authorId) } };
```
DataLoader **batches** loads in one tick and **caches** per request. Create loaders per request to avoid cross-user cache leaks.

### Q62. GraphQL pagination: Relay connections *(Must-know)*
```graphql
type PostConnection { edges: [PostEdge!]! pageInfo: PageInfo! totalCount: Int }
type PostEdge { cursor: String! node: Post! }
type PageInfo { hasNextPage: Boolean! hasPreviousPage: Boolean! startCursor: String endCursor: String }
type Query { posts(first: Int, after: String, last: Int, before: String): PostConnection! }
```
Cursor-based, opaque cursors (base64 of keyset values), stable under inserts, works with Relay and Apollo `relayStylePagination`.

### Q63. GraphQL mutations design
Single `input` argument, return a **payload type** with the changed object and user errors:
```graphql
type CreateUserPayload { user: User errors: [UserError!]! }
type UserError { field: String message: String! code: String! }
type Mutation { createUser(input: CreateUserInput!): CreateUserPayload! }
```
Name mutations as verbs (`createUser`, `publishPost`), keep them cohesive, return enough data to update client caches.

### Q64. Schema design principles
Design for **client needs**, not database tables; use domain language; make fields non-null only when guaranteed; prefer enums and custom scalars; use connections for lists; avoid exposing internal IDs unnecessarily (use global opaque IDs / Relay `Node` interface); evolve with `@deprecated(reason:)` instead of versions.

### Q65. Interfaces and unions
```graphql
interface Node { id: ID! }
union SearchResult = User | Post | Comment
type Query { search(q: String!): [SearchResult!]! }
```
Query with inline fragments: `... on User { name } ... on Post { title }`. Resolve the concrete type via `__resolveType` / `isTypeOf`.

### Q66. GraphQL subscriptions
Use WebSocket (`graphql-ws` protocol) or SSE (`graphql-sse`) with a pub/sub backend (Redis, Kafka) so events fan out across server instances.
```js
Subscription: { postAdded: { subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("POST_ADDED") } }
// Mutation: pubsub.publish("POST_ADDED", { postAdded: post })
```
Authenticate during connection init, filter per user, and consider polling for low-frequency updates.

### Q67. Client caching in Apollo Client
Normalized in-memory cache keyed by `__typename:id`; queries update the same entities; mutations update via returned fields or `update()`/`refetchQueries`; fetch policies (`cache-first`, `cache-and-network`, `network-only`, `no-cache`); type policies for pagination and key fields. Understanding normalization is crucial for UI consistency.

### Q68. Persisted queries and APQ
**Persisted queries** replace the query text with a hash/ID sent to the server (allow-list in production, smaller requests, GET-cacheable). **Automatic Persisted Queries (APQ)** register hashes on first use. Trusted-documents allow-lists also block arbitrary queries.

### Q69. GraphQL security: depth, complexity, rate limiting *(Must-know)*
Attackers can send expensive nested queries. Defenses: **query depth limiting** (`graphql-depth-limit`), **complexity/cost analysis** (`graphql-query-complexity`), pagination caps (`first <= 100`), timeouts, **persisted-query allow-lists**, disabling introspection/batching abuse in public APIs, rate limiting by cost, field-level authorization, input validation, and protection against alias/batch amplification.

### Q70. Authorization in GraphQL
Resolve identity once into `context.user`; enforce authorization in the **business layer** or per field (directives like `@auth(role: ADMIN)`, `graphql-shield`, Pothos auth plugin) — not only at the top-level resolvers. Ensure nested objects check access (BOLA) and don't leak via relationships.

### Q71. REST vs GraphQL: when to use which *(Must-know)*
Choose **REST** for simple resource APIs, public APIs needing HTTP caching/CDN, file-centric APIs, service-to-service CRUD, teams new to GraphQL. Choose **GraphQL** for complex, nested, client-driven data needs (mobile/web with many views), multiple clients with different shapes, aggregating several backends, rapid frontend iteration. Many orgs use both (GraphQL BFF over REST/gRPC services).

### Q72. gRPC and tRPC in brief
**gRPC**: HTTP/2, Protocol Buffers (binary, strongly typed contracts), streaming, code generation; excellent for internal microservice calls, weaker browser support (gRPC-Web). **tRPC**: end-to-end TypeScript type safety without schemas for TS monorepos (Next.js); not for public multi-language APIs.

### Q73. SOAP vs REST (legacy)
SOAP: XML, WSDL contracts, WS-* standards, heavy; still common in banking/enterprise. REST: lightweight, JSON, simpler. Know SOAP basics for integration interviews.

### Q74. WebSockets, SSE and long polling
| | Direction | Notes |
|---|---|---|
| Polling | Client pulls | Simple, wasteful |
| Long polling | Client pulls, server holds | Works everywhere |
| SSE | Server → client | Text events over HTTP, auto-reconnect, one-way |
| WebSocket | Bidirectional | Chat, games, collaboration; stateful scaling needs sticky sessions/pub-sub |
| HTTP/2 push | Deprecated | Avoid |

### Q75. Testing APIs
Unit tests (services), integration tests (Supertest against the app + test DB), contract tests (OpenAPI validators, Pact), end-to-end tests (Playwright/Newman), load tests (k6, Artillery), security tests (ZAP). For GraphQL test resolvers and use `executeOperation`/in-memory schema execution.
```js
import request from "supertest";
it("creates a user", async () => {
  const res = await request(app).post("/api/users").send({ name: "Ritesh Kumar", email: "r@x.com" });
  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ name: "Ritesh Kumar" });
});
```

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. Designing resource models and relationships
Model nouns users care about, not tables. Relationships: embed small child data (`items` inside an order), link large or independent resources (`/orders/7/items`, `customerId`), support expansion (`?expand=customer`) and sparse fields (`?fields=id,total`). Avoid chatty APIs by offering composite endpoints for common screens, or a BFF.

### Q77. Handling concurrency: ETags and optimistic locking
```
GET /docs/9        → ETag: "v5"
PUT /docs/9        If-Match: "v5"   → 200 OK (new ETag "v6")  |  412 Precondition Failed if changed
```
Prevents lost updates without locks. Require `If-Match` on mutable resources; return `428 Precondition Required` when missing.

### Q78. Idempotency implementation *(Must-know)*
```js
app.post("/payments", async (req, res) => {
  const key = req.get("Idempotency-Key");
  if (!key) return res.status(400).json({ error: "Idempotency-Key required" });
  const stored = await redis.get(`idem:${key}`);
  if (stored) return res.status(stored.status).json(JSON.parse(stored.body));       // replay
  const locked = await redis.set(`idem:lock:${key}`, "1", "NX", "EX", 30);
  if (!locked) return res.status(409).json({ error: "Request in progress" });
  const result = await chargeCard(req.body);
  await redis.set(`idem:${key}`, JSON.stringify({ status: 201, body: JSON.stringify(result) }), "EX", 86400);
  res.status(201).json(result);
});
```
Hash the request body with the key to reject key reuse with different payloads (422). Scope keys per client.

### Q79. Retries, timeouts and backoff (client side)
Retry only idempotent or idempotency-keyed requests on 429/502/503/504 and network errors, with **exponential backoff + jitter**, respecting `Retry-After`. Set timeouts (connect/read), circuit breakers (opossum), and hedging cautiously. Avoid retry storms with budgets.

### Q80. API gateway *(Must-know)*
A single entry point handling cross-cutting concerns: routing, authentication, rate limiting, TLS termination, request/response transformation, caching, API keys, analytics, canary releases. Examples: Kong, AWS API Gateway, Apigee, NGINX, Traefik, Envoy/Istio, Azure APIM. It is not a place for business logic.

### Q81. Backend for Frontend (BFF)
A dedicated backend per client type (web, mobile) that aggregates and shapes downstream services to fit UI needs; reduces chattiness and client logic. GraphQL is a popular BFF technology. Beware duplicated logic and ownership boundaries.

### Q82. Microservices communication
Synchronous: REST/gRPC with timeouts, retries, circuit breakers, service discovery. Asynchronous: message queues/event streams (Kafka, RabbitMQ, SQS) for decoupling and resilience. Use sagas/outbox for cross-service consistency. Avoid distributed monoliths (chains of synchronous calls).

### Q83. GraphQL federation *(Must-know)*
Compose multiple GraphQL subgraphs into one supergraph. **Apollo Federation 2**: each subgraph owns types and extends others via `@key`.
```graphql
# users subgraph
type User @key(fields: "id") { id: ID! name: String! }
# orders subgraph
type User @key(fields: "id") { id: ID! orders: [Order!]! }
type Order @key(fields: "id") { id: ID! total: Float! }
```
A **router** (Apollo Router, Cosmo, Mesh, Hive Gateway) plans queries across subgraphs, using entity resolvers (`__resolveReference`). Alternative: schema stitching. Benefits: team autonomy; costs: operational complexity, query planning latency, schema governance.

### Q84. GraphQL schema evolution and governance
Never remove fields abruptly: mark `@deprecated`, track field usage via operation metrics (Apollo Studio/Hive), remove after zero usage, run **schema checks/diffs** in CI (breaking-change detection), use a schema registry, and review naming. Non-null → nullable changes may be breaking for clients.

### Q85. Code-first vs schema-first
**Schema-first (SDL)**: write `.graphql` then resolvers; clear contract, tooling friendly. **Code-first** (Pothos, Nexus, TypeGraphQL, NestJS decorators): schema generated from TypeScript types; less duplication, strong typing. Use codegen (`graphql-codegen`) for typed resolvers/clients either way.

### Q86. Type safety with GraphQL Code Generator
Generates TypeScript types for schema, operations and resolvers; typed hooks (`useGetUserQuery`) for Apollo/urql/TanStack. Keeps client and server in sync and catches breaking changes at compile time.

### Q87. Query cost analysis in practice
Assign costs per field (complexity estimator, list multipliers using `first` argument), cap total cost per request/user/time window, and reject early. Combine with persisted-query allow-lists for public APIs; log expensive operations.

### Q88. Caching strategies for GraphQL
1. **Client normalized cache** (Apollo/urql/Relay).
2. **HTTP caching** via persisted queries over GET + CDN with `Cache-Control` hints (`@cacheControl`).
3. **Server response cache** (full query + variables + user scope) in Redis.
4. **Resolver/data caching** (DataLoader per request, Redis for expensive lookups).
5. **Database caching**.
Never cache user-specific data in shared caches without scoping by auth.

### Q89. Error handling patterns in GraphQL
Throw typed errors (`GraphQLError` with `extensions.code`) for exceptional cases; return **result unions** for expected domain errors:
```graphql
union CreateUserResult = User | EmailTaken | ValidationFailed
```
Mask internal errors in production (Apollo `formatError`), log with trace ids, and keep partial data semantics in mind (nullable fields).

### Q90. File upload and large payloads
Presigned URL flow: `mutation { createUpload(filename, contentType) { url fields id } }` → client uploads directly → `mutation { completeUpload(id) }`. Avoid streaming big files through the GraphQL layer.

### Q91. REST API pagination at scale
Use keyset pagination with composite sort keys and an index; encode cursor opaque (`base64url(JSON)`); handle ties with unique tie-breaker (`id`); expose `limit` caps; for exports use async jobs or streaming (NDJSON). Offer search via a dedicated engine for text queries (`032_Elasticsearch.md`).

### Q92. Search, filtering and sorting design
Query-string DSLs (`filter[status]=paid&filter[total][gte]=100&sort=-createdAt`), JSON:API conventions, OData (`$filter`, `$orderby`), or `POST /orders/search` with a JSON body for complex filters. Whitelist fields, enforce indexes, and bound page size.

### Q93. Long-term compatibility: tolerant reader and Postel's law
Clients ignore unknown fields and enum values; servers accept varied input but emit strict output. Use additive evolution, feature flags, default values, and `x-` extension fields cautiously.

### Q94. Multi-tenancy in APIs
Resolve the tenant from subdomain/header/token claim; enforce tenant scoping in the data layer (row-level security or scoped repositories), include `tenantId` in cache keys, rate limit per tenant, and test cross-tenant access. GraphQL: put tenant in context; never accept tenant ids as arbitrary arguments.

### Q95. API observability
Metrics (RED: Rate, Errors, Duration) per route/operation, distributed tracing (OpenTelemetry), structured logs, SLOs with alerts, synthetic checks. GraphQL: instrument per operation name and per resolver (slow resolver traces); name every operation so metrics are meaningful.

### Q96. Contract testing and consumer-driven contracts
Pact lets consumers publish expectations that providers verify in CI, preventing breaking changes across teams. OpenAPI-based tools (Dredd, Schemathesis) fuzz/validate implementations against the spec. GraphQL has schema checks + operation registries.

### Q97. Mocking and API-first development
Publish the OpenAPI/GraphQL schema first; frontend uses mocks (MSW, Prism, Apollo mocks) while backend builds; contract tests ensure parity. Reduces integration delays.

### Q98. Streaming responses
NDJSON, chunked transfer, SSE for progress, `@defer`/`@stream` in GraphQL (incremental delivery) for slow fields, HTTP/2 multiplexing, WebSocket for bidirectional streams. Handle backpressure and client disconnects.

### Q99. Webhooks: delivery design (provider side)
Sign payloads (HMAC + timestamp), retries with exponential backoff, DLQ, event IDs for dedupe, ordering caveats, secrets rotation, endpoint verification, replay UI, delivery logs. Consumer side: verify signature on the raw body, return 2xx fast, enqueue processing, idempotent handlers.

### Q100. Async APIs: AsyncAPI and events
Describe event-driven interfaces with **AsyncAPI** (like OpenAPI for message brokers). Use CloudEvents for event envelopes, schema registries (Avro/Protobuf/JSON Schema) and compatibility rules.

### Q101. API documentation best practices
Reference (OpenAPI/GraphQL schema), guides (auth, pagination, errors, rate limits), runnable examples (curl, SDK snippets), changelog, status page, sandbox environment, Postman collections, deprecation policy. Good docs cut support load more than any feature.

### Q102. SDK and client generation
Generate typed clients from OpenAPI (`openapi-typescript`, `orval`, `openapi-generator`) or GraphQL operations (codegen); handle auth, retries, pagination helpers; version SDKs semantically; test against a sandbox.

### Q103. Performance basics for APIs
Reduce payload size (compression gzip/br, sparse fields), database efficiency (indexes, avoid N+1), caching layers, connection pooling, HTTP keep-alive/HTTP/2, pagination, async processing for slow tasks, avoid synchronous fan-out chains, profile hot paths. Measure p50/p95/p99, not averages.

### Q104. Choosing between PUT and POST for create (idempotent create)
Use `PUT /resources/{client-generated-id}` for idempotent creation (UUIDs from the client), or `POST` + `Idempotency-Key`. Return 201 with `Location` the first time and 200/204 (or 201 replay) for repeats.

---

# 🟠 Part 4: Senior (5–7 years)

### Q105. Designing a public REST API (checklist) *(Must-know)*
1. Resource model and URLs; consistent naming.
2. AuthN/Z: OAuth2/API keys, scopes, per-tenant isolation.
3. Versioning and deprecation policy (`Sunset` headers).
4. Pagination, filtering, sorting, sparse fields, expansion.
5. Error format (RFC 9457), correlation ids, stable error codes.
6. Idempotency keys for unsafe operations; ETags for concurrency.
7. Rate limits with headers, quotas, abuse detection.
8. Observability: logs/metrics/traces; status page.
9. Docs, SDKs, sandbox, changelog.
10. Security review: OWASP API Top 10, secrets, input validation, SSRF protection.

### Q106. Designing a GraphQL API for production *(Must-know)*
Schema governance + registry, persisted queries, depth/cost limits, DataLoader everywhere, per-field authorization, Relay-style pagination, federation if multiple teams, tracing, error masking, subscription scaling with Redis/Kafka, graceful query timeouts, rate limiting by cost, rollout via schema checks and field-usage analytics.

### Q107. Choosing API styles per use case
| Use case | Preferred |
|---|---|
| Public developer platform | REST (+ webhooks), OpenAPI, SDKs |
| Complex client-driven UIs, many clients | GraphQL (BFF/supergraph) |
| Internal service-to-service, low latency | gRPC |
| TypeScript monorepo full-stack | tRPC or server actions |
| Event-driven integrations | Webhooks, Kafka/AsyncAPI |
| Real-time bidirectional | WebSocket/SSE |
| Bulk data export | Async jobs, signed URLs, NDJSON/Parquet |

### Q108. Rate limiting architecture
Gateway-level coarse limits + service-level fine limits; distributed counters in Redis (token bucket via Lua), per-key plans (free/pro), burst vs sustained, fairness for tenants, cost-based limiting for GraphQL, shadow mode before enforcing, observability of rejections, and graceful degradation. Return helpful headers.

### Q109. Security deep dive: authN/authZ architecture
Central identity provider (OIDC), short-lived access tokens, token audience/scopes, mTLS or workload identity between services, policy engines (OPA, Cedar, Oso) for ABAC/RBAC, row-level checks in the data layer, secrets in a vault, key rotation (JWKS), audit logs. Protect admin APIs separately and test BOLA/BFLA continuously.

### Q110. JWT pitfalls
`alg: none`/algorithm confusion, weak HS256 secrets, no `exp`, no `aud`/`iss` validation, storing in `localStorage` (XSS), putting PII in payload, long-lived tokens without revocation, not rotating signing keys. Use libraries correctly, validate all claims, keep tokens short-lived, use refresh rotation with reuse detection.

### Q111. SSRF and unsafe consumption of APIs
If your API fetches user-supplied URLs (webhooks, image import), block internal ranges (169.254.169.254 metadata, RFC1918), resolve DNS and re-check, allow-list schemes/ports, use egress proxies, timeouts and size limits. Treat third-party API responses as untrusted input (validate schemas).

### Q112. Resilience patterns
Timeouts everywhere, retries with backoff and budgets, circuit breakers, bulkheads (isolate pools), load shedding, fallbacks/caches, queue-based load leveling, graceful degradation, health checks, idempotency. Test with chaos experiments and load tests.

### Q113. Performance engineering for GraphQL
Avoid resolver waterfalls (batch with DataLoader, `Promise.all`), project only requested columns (use `info` / lookahead with Prisma `select`), cache entity lookups, defer slow fields, cap list sizes, monitor field-level resolver timings, use persisted queries to skip parsing/validation, and compile queries (graphql-jit) for hot paths.

### Q114. Query planning and the N+1 across services (federation)
Router batches entity fetches (`_entities`) per subgraph; implement batched `__resolveReference` with DataLoader. Watch for deep cross-subgraph chains that multiply latency; denormalize or co-locate data when plans get expensive.

### Q115. GraphQL over REST: migration approach
Start with a GraphQL gateway wrapping existing REST services (RESTDataSource/connectors), generate types, migrate clients screen by screen, replace REST calls behind resolvers gradually, add caching/DataLoader, keep REST for public/legacy consumers. Avoid duplicating business logic in resolvers.

### Q116. Evolving REST APIs without breaking clients
Additive changes, feature flags, `Deprecation`/`Sunset`/`Link: rel="successor-version"` headers, usage analytics per endpoint and client, migration guides, compatibility tests with old SDK versions, sunset windows (6-12 months for public APIs), and brownouts before removal.

### Q117. Consistency in distributed API workflows
Use sagas (orchestrated or choreographed), outbox pattern, idempotent consumers, compensation actions, correlation ids, and state machines exposed as resources (`status: pending|paid|shipped`). Avoid two-phase commit across services.

### Q118. API monetization and quotas
API keys tied to plans, metering (usage events to a billing pipeline), soft/hard quotas, overage policies, per-endpoint pricing, usage dashboards, abuse detection. Make metering idempotent and auditable.

### Q119. Compliance and privacy in APIs
Data minimization in responses, field-level encryption for sensitive data, audit logs, GDPR rights endpoints (export/delete), consent tracking, regional data residency routing, PII masking in logs, retention policies, DPA with third-party APIs.

### Q120. HTTP/2, HTTP/3 and connection management
HTTP/2: multiplexing, header compression (HPACK), single connection per origin (removes need for domain sharding/bundling). HTTP/3 (QUIC over UDP): no TCP head-of-line blocking, faster handshakes, connection migration. Tune keep-alive, TLS session resumption, and connection pools; ensure load balancers support them.

### Q121. Load balancing and API deployment
L4/L7 load balancers, health checks, sticky sessions only when needed (WebSockets), blue/green and canary releases, autoscaling on latency/queue depth, request draining, regional routing, API versions routed by gateway. Feature-flag risky behaviour changes.

### Q122. Testing strategy at scale
Pyramid + contract tests: fast unit tests for logic, integration tests with real DBs (containers), schema/contract checks in CI (OpenAPI diff, GraphQL inspector), load tests before major releases, security scans (SAST/DAST), canary + synthetic monitoring in prod, and replay of production traffic (shadowing) for risky migrations.

### Q123. Designing for observability: SLIs/SLOs
SLIs: availability (successful responses / total), latency (p95/p99), error budget per endpoint/operation; alert on burn rate; separate client errors (4xx) from server faults (5xx); for GraphQL, count operations by name and error codes even when HTTP is 200.

### Q124. OpenAPI governance
Linting (Spectral) for naming/consistency, breaking-change detection (oasdiff) in CI, shared components (errors, pagination), API style guide, design reviews, central catalog (Backstage), and generated docs/SDKs from a single source of truth.

### Q125. Event-carried state vs API calls
Reduce synchronous coupling by publishing domain events with enough data (event-carried state transfer) so consumers keep local read models; trade-off: eventual consistency and schema management. Use APIs for commands/queries needing immediacy.

### Q126. Handling partial failures in aggregated APIs
BFF/GraphQL calls multiple services: set per-call timeouts, return partial data with explicit errors, cache fallbacks, and mark degraded sections (`null` + `errors`). Don't fail the whole page for non-critical widgets.

### Q127. Technical debt in APIs
Inconsistent naming, unversioned breaking changes, god endpoints, leaky DB models, missing pagination, ad-hoc auth, undocumented behaviours. Mitigate with style guides, linters, API reviews, deprecation processes, and contract tests.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q128. API strategy for a platform organisation
Treat APIs as products: owners, roadmap, SLAs, versioning policy, developer portal, onboarding metrics (time-to-first-call), consistent standards (auth, errors, pagination), API catalog and discoverability, security baseline, and deprecation governance. Align API design with domain boundaries (DDD bounded contexts).

### Q129. Choosing a federation/gateway architecture
Options: single GraphQL server (simple), schema stitching, **federated supergraph** (many teams), REST gateway + BFFs, service mesh for east-west traffic. Decide on team topology, change velocity, latency budgets and tooling maturity. Start simple; federate when organizational scaling demands it.

### Q130. Cost and performance at scale
Optimize egress (compression, CDN caching, pagination), reduce chatty calls, right-size gateways, cache aggressively where safe, precompute expensive aggregates, use async processing, choose protocols per hop (gRPC internally, REST/GraphQL at the edge), and monitor cost per request/tenant.

### Q131. Zero-trust API security
Authenticate and authorize every call (user and service identity), mTLS between services, least-privilege scopes, short-lived credentials, policy as code, network segmentation, continuous verification, anomaly detection (bot/abuse), and comprehensive audit trails. Assume internal networks are hostile.

### Q132. Multi-region API design
Geo-routed edge (anycast/CDN), regional deployments with data residency, global vs regional identity, replicated read paths, write-routing strategy (home region), idempotency across regions, conflict handling, failover testing, and consistent rate limiting (regional approximations).

### Q133. Backward-compatible protocol evolution
Protobuf rules (never reuse field numbers), JSON additive changes, GraphQL deprecations, schema registries with compatibility modes (backward/forward/full), consumer-driven contract verification, and canary rollouts that compare old/new behaviour.

### Q134. Migration of a monolith API to services/GraphQL gateway
Strangler pattern: place a gateway/BFF in front, route endpoints gradually to new services, share auth, mirror traffic to compare, migrate data with CDC, keep contract tests, and decommission legacy endpoints with usage tracking. Avoid big-bang rewrites.

### Q135. Governance of GraphQL at enterprise scale
Schema ownership via subgraph teams, a central registry with checks, naming conventions, operation allow-lists, cost budgets, deprecation SLAs, docs generated from schema descriptions, security review for new entity keys, and platform-provided libraries (auth, pagination, error handling).

### Q136. AI/LLM interactions with APIs
Tool/function calling needs well-described OpenAPI/JSON Schema contracts, idempotent operations, least-privilege tokens, rate limits per agent, audit logging, input validation against prompt-injected parameters, human approval for destructive actions, and MCP-style standardized tool servers (verify details of current protocols).

### Q137. Resilience and disaster recovery for API platforms
Multi-AZ/region active-active where justified, tested failover, dependency isolation, graceful degradation modes (read-only), backups and replay for event streams, runbooks, error-budget policy, game days, and clear customer communication plans (status page, SLAs).

### Q138. Developer experience (DX) as a metric
Time to first successful call, docs satisfaction, SDK quality, error message clarity, sandbox availability, changelog cadence, support ticket themes. Instrument the developer funnel and fix top friction points; DX drives adoption more than raw features.

### Q139. Build vs buy for API infrastructure
Buy/managed gateways, identity, rate limiting, developer portals and observability for speed; build where differentiation or cost at scale demands. Consider lock-in (proprietary policies), portability (OpenAPI/OIDC standards), and operational capacity.

### Q140. Decision records and trade-off communication
Document decisions (ADRs) for REST vs GraphQL vs gRPC, versioning, auth, pagination, and error formats with context, options, consequences. Review periodically; leaders should explain *why* standards exist, not only enforce them.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Production-grade Express REST API skeleton
```js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") ?? false }));
app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => { req.id = req.get("x-request-id") ?? randomUUID(); res.set("x-request-id", req.id); next(); });
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));

const CreateTodo = z.object({ title: z.string().min(1).max(200) }).strict();

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.post("/api/todos", requireAuth, async (req, res, next) => {
  try {
    const parsed = CreateTodo.safeParse(req.body);
    if (!parsed.success) return res.status(422).type("application/problem+json")
      .json({ type: "about:blank", title: "Validation failed", status: 422, errors: parsed.error.flatten().fieldErrors, traceId: req.id });
    const todo = await db.todo.create({ data: { ...parsed.data, userId: req.user.id } });
    res.status(201).location(`/api/todos/${todo.id}`).json(todo);
  } catch (e) { next(e); }
});
app.get("/api/todos/:id", requireAuth, async (req, res, next) => {
  try {
    const todo = await db.todo.findFirst({ where: { id: req.params.id, userId: req.user.id } });   // ownership check (BOLA)
    return todo ? res.json(todo) : res.sendStatus(404);
  } catch (e) { next(e); }
});

app.use((err, req, res, _next) => {                                        // central error handler
  console.error({ traceId: req.id, err });
  res.status(500).type("application/problem+json").json({ title: "Internal Server Error", status: 500, traceId: req.id });
});
const server = app.listen(3000);
process.on("SIGTERM", () => server.close(() => process.exit(0)));
```

### H2. Cursor pagination endpoint (REST)
```js
app.get("/api/orders", requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const cursor = req.query.cursor ? JSON.parse(Buffer.from(req.query.cursor, "base64url").toString()) : null;
  const rows = await db.order.findMany({
    where: { userId: req.user.id, ...(cursor && { OR: [{ createdAt: { lt: cursor.createdAt } }, { createdAt: cursor.createdAt, id: { lt: cursor.id } }] }) },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });
  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  const last = data.at(-1);
  res.json({ data, pagination: { hasMore, nextCursor: hasMore ? Buffer.from(JSON.stringify({ createdAt: last.createdAt, id: last.id })).toString("base64url") : null } });
});
```

### H3. Apollo Server with auth context, DataLoader, errors and limits
```js
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLError } from "graphql";
import depthLimit from "graphql-depth-limit";
import DataLoader from "dataloader";

const server = new ApolloServer({
  typeDefs, resolvers,
  validationRules: [depthLimit(8)],
  introspection: process.env.NODE_ENV !== "production",
  formatError: (formatted, error) => formatted.extensions?.code === "INTERNAL_SERVER_ERROR"
    ? { message: "Internal error", extensions: { code: "INTERNAL_SERVER_ERROR" } } : formatted,
});
await server.start();
app.use("/graphql", express.json(), expressMiddleware(server, {
  context: async ({ req }) => {
    const user = await verifyToken(req.headers.authorization);
    return { user, db, loaders: { userById: new DataLoader(async (ids) => {
      const rows = await db.user.findMany({ where: { id: { in: [...ids] } } });
      const m = new Map(rows.map(u => [u.id, u])); return ids.map(id => m.get(id) ?? null);
    }) } };
  },
}));

// resolver with authorization
const requireUser = (ctx) => { if (!ctx.user) throw new GraphQLError("Unauthenticated", { extensions: { code: "UNAUTHENTICATED", http: { status: 401 } } }); };
Query: { me: (_, __, ctx) => { requireUser(ctx); return ctx.user; } }
```

### H4. Relay-style connection resolver
```js
const encode = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const decode = (c) => JSON.parse(Buffer.from(c, "base64url").toString());
Query: {
  posts: async (_, { first = 10, after }, { db }) => {
    const take = Math.min(first, 50);
    const cur = after ? decode(after) : null;
    const rows = await db.post.findMany({ where: cur ? { id: { lt: cur.id } } : {}, orderBy: { id: "desc" }, take: take + 1 });
    const hasNextPage = rows.length > take;
    const nodes = hasNextPage ? rows.slice(0, take) : rows;
    return {
      edges: nodes.map(n => ({ cursor: encode({ id: n.id }), node: n })),
      pageInfo: { hasNextPage, hasPreviousPage: !!after, endCursor: nodes.length ? encode({ id: nodes.at(-1).id }) : null },
    };
  },
}
```

### H5. Apollo Client: query, mutation with cache update
```tsx
const GET_TODOS = gql`query Todos { todos { id title done } }`;
const ADD_TODO = gql`mutation Add($title: String!) { addTodo(title: $title) { id title done } }`;

function Todos() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [add] = useMutation(ADD_TODO, {
    update(cache, { data: { addTodo } }) {
      cache.modify({ fields: { todos(existing = []) { return [...existing, cache.writeFragment({ data: addTodo, fragment: gql`fragment N on Todo { id title done }` })]; } } });
    },
    optimisticResponse: (vars) => ({ addTodo: { __typename: "Todo", id: "temp", title: vars.title, done: false } }),
  });
  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error.message}</p>;
  return <ul>{data.todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

### H6. Subscription with Redis pub/sub (multi-instance)
```js
import { RedisPubSub } from "graphql-redis-subscriptions";
const pubsub = new RedisPubSub({ connection: process.env.REDIS_URL });
const resolvers = {
  Mutation: { addMessage: async (_, { roomId, text }, ctx) => {
    const msg = await ctx.db.message.create({ data: { roomId, text, userId: ctx.user.id } });
    await pubsub.publish(`ROOM_${roomId}`, { messageAdded: msg });
    return msg; } },
  Subscription: { messageAdded: {
    subscribe: async (_, { roomId }, ctx) => { await assertCanJoin(ctx.user, roomId); return pubsub.asyncIterator(`ROOM_${roomId}`); } } },
};
```
Use `graphql-ws` on the transport and authenticate in `connectionParams`.

### H7. OpenAPI spec with validation middleware
```js
import OpenApiValidator from "express-openapi-validator";
app.use(OpenApiValidator.middleware({ apiSpec: "./openapi.yaml", validateRequests: true, validateResponses: process.env.NODE_ENV !== "production" }));
app.use((err, _req, res, _next) => res.status(err.status || 500).json({ message: err.message, errors: err.errors }));
```
Keeps the spec and implementation in sync (request validation in prod, response validation in tests/staging).

### H8. Webhook receiver with signature verification
```js
import crypto from "node:crypto";
app.post("/webhooks/payments", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.get("x-signature") ?? "";
  const expected = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(req.body).digest("hex");
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return res.sendStatus(401);
  const event = JSON.parse(req.body.toString());
  if (await alreadyProcessed(event.id)) return res.sendStatus(200);          // idempotency
  await queue.add("payment-event", event);                                    // process async
  res.sendStatus(200);
});
```
Use the **raw** body for the signature and compare with `timingSafeEqual`.

### H9. Token bucket rate limiter (Redis + Lua)
```js
const lua = `
local k=KEYS[1]; local cap=tonumber(ARGV[1]); local rate=tonumber(ARGV[2]); local now=tonumber(ARGV[3])
local d=redis.call("HMGET",k,"t","ts"); local t=tonumber(d[1]) or cap; local ts=tonumber(d[2]) or now
t=math.min(cap, t + (now-ts)/1000*rate); local ok=0
if t>=1 then t=t-1 ok=1 end
redis.call("HSET",k,"t",t,"ts",now); redis.call("EXPIRE",k,math.ceil(cap/rate)*2)
return {ok, math.floor(t)}`;
app.use(async (req, res, next) => {
  const [ok, remaining] = await redis.eval(lua, 1, `rl:${req.user?.id ?? req.ip}`, 100, 10, Date.now());
  res.set("RateLimit-Remaining", String(remaining));
  return ok ? next() : res.status(429).set("Retry-After", "1").json({ title: "Too Many Requests" });
});
```

### H10. Contract test with Supertest and OpenAPI matcher
```js
import request from "supertest";
import jestOpenAPI from "jest-openapi";
jestOpenAPI("./openapi.yaml");
it("GET /api/todos/1 matches the spec", async () => {
  const res = await request(app).get("/api/todos/1").set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res).toSatisfyApiSpec();
});
```

### H11. GraphQL test without HTTP
```js
const res = await server.executeOperation({ query: "query { me { id name } }" }, { contextValue: { user: { id: "1", name: "Ritesh Kumar" }, loaders, db } });
expect(res.body.kind).toBe("single");
expect(res.body.singleResult.errors).toBeUndefined();
expect(res.body.singleResult.data.me.name).toBe("Ritesh Kumar");
```

### H12. Federation subgraph snippet
```js
import { buildSubgraphSchema } from "@apollo/subgraph";
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.5", import: ["@key"])
  type Order @key(fields: "id") { id: ID! total: Float! userId: ID! }
  type Query { order(id: ID!): Order }`;
const resolvers = { Order: { __resolveReference: ({ id }, { loaders }) => loaders.orderById.load(id) }, Query: { order: (_, { id }, { db }) => db.order.findUnique({ where: { id } }) } };
const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. CORS error in the browser but the API works in Postman
CORS is enforced only by browsers. Check the `Origin`, missing `Access-Control-Allow-Origin`, preflight `OPTIONS` not handled (auth middleware blocking it), disallowed headers/methods, `credentials: true` with wildcard origin. Fix server CORS config; never "fix" by disabling browser security.

### D2. 401 even with a valid-looking token
Wrong header format (`Bearer` missing), token expired/clock skew, wrong audience/issuer, key rotation (JWKS cache stale), token stored for a different environment, trailing whitespace, proxy stripping `Authorization`. Log the validation failure reason (not the token).

### D3. 415 / 400 on POST with JSON
Missing `Content-Type: application/json`, body parser not registered, invalid JSON (trailing comma), payload too large (`413`), or sending form data. Inspect raw request and parser limits.

### D4. 502/504 from the gateway
Upstream crashed, timeouts shorter than the handler, health-check failing, keep-alive mismatch (upstream closes idle connections earlier than the proxy), overloaded pool. Align timeouts (client < gateway < server), enable keep-alive tuning, add readiness probes.

### D5. Duplicate orders after a timeout
Client retried a non-idempotent POST. Add idempotency keys, return stored results on retry, and make retry logic aware of safe methods.

### D6. GraphQL query is slow (N+1)
Resolver-level traces show repeated DB queries per item. Add DataLoader/batching, use lookahead to select columns/relations, add indexes, cap list sizes, cache hot entities.

### D7. GraphQL returns `null` for a field unexpectedly
A non-null field resolver threw so the null bubbled up to the nearest nullable parent; check `errors[]`. Make field nullability match reality or fix the resolver; add error logging by `path`.

### D8. `Cannot return null for non-nullable field`
Resolver returned null/undefined for `!` field (missing relation, soft-deleted row). Change nullability or ensure data integrity; return a typed error union for expected absence.

### D9. Subscriptions drop or miss events behind a load balancer
No sticky sessions/WebSocket upgrade not forwarded, idle timeouts closing sockets, missing pub/sub backend across instances, auth token expiry during connection. Configure LB for WebSockets, heartbeats/keep-alives, Redis/Kafka pub/sub, token refresh/reconnect logic.

### D10. Cache serving another user's data
Shared cache keyed only by URL/query without `Vary: Authorization` or user scope. Mark `private`/`no-store`, include identity in cache keys, never cache authenticated responses at CDN without explicit config.

### D11. Rate limiting blocks everyone behind a corporate NAT
Limiting by IP. Use API key/user ID where possible, `X-Forwarded-For` handling with trusted proxy settings (`app.set("trust proxy", n)`), and separate limits for anonymous traffic.

### D12. Pagination returns duplicates or skips items
Offset pagination with concurrent inserts/deletes, unstable sort (no unique tiebreaker). Switch to keyset pagination with `(createdAt, id)` ordering.

### D13. File upload fails (413 / timeouts)
Body size limits at gateway/proxy/Express, multipart parser limits, slow client uploads timing out. Use pre-signed direct uploads and raise limits only where needed.

### D14. OpenAPI client generation produces wrong types
Spec inaccuracies (nullable vs optional, missing `required`), `oneOf` ambiguities, inconsistent enums. Lint the spec (Spectral), fix schemas, validate responses against it in tests.

### D15. Webhook handler processes events twice
Provider retries after slow/failed 2xx or at-least-once delivery. Store event IDs (unique index), acknowledge fast, process in a queue, make handlers idempotent.

---

# 🧩 Part 8: Tricky Questions

### T1. Is `PUT` always idempotent? Is `POST` ever idempotent?
`PUT` is idempotent by definition (same body → same final state), though server side effects like `updatedAt` change; `POST` isn't by default but can be made idempotent via idempotency keys.

### T2. Does GraphQL always use POST?
No. Queries can use GET (with `query` and `variables` params, ideal for persisted queries and CDN caching); mutations must not use GET.

### T3. Does GraphQL return 4xx/5xx when a resolver fails?
Usually 200 with `errors[]` if the request was valid and executed; 400 for syntax/validation errors (per the GraphQL-over-HTTP spec), 401/403 for HTTP-level auth, 5xx for server failures. Monitoring must inspect `errors`, not only status codes.

### T4. Is GraphQL faster than REST?
Not inherently. It reduces round trips and payload for complex UIs, but resolvers can be slower (N+1, deep queries) and HTTP caching is harder. Measure.

### T5. Is introspection a security hole?
It exposes schema information, which attackers could use for reconnaissance; but hiding it is not authorization. Security must rely on authN/Z, cost limits and allow-lists. Many public APIs keep it on.

### T6. What's the difference between 401 and 403 when a user lacks permission?
Authenticated but unauthorized → 403 (or 404 to avoid revealing existence). 401 means unauthenticated.

### T7. Can DELETE have a body?
Allowed by HTTP semantics but unreliable across proxies/clients; prefer identifying resources in the URL or use a different pattern.

### T8. Should I return 200 with `{ "success": false }` for errors?
No. Use proper status codes so clients, caches, monitoring and retries behave correctly. GraphQL is the exception by design (errors array).

### T9. Why is PATCH not guaranteed idempotent?
Operations like "append item" or "increment" aren't idempotent; merge-patch with absolute values is.

### T10. Is a JWT secure to store in `localStorage`?
It's exposed to XSS. Prefer `HttpOnly`, `Secure`, `SameSite` cookies for browser sessions or keep access tokens in memory with refresh via cookie.

### T11. Is REST required to be JSON?
No. REST is representation-agnostic (JSON, XML, HTML, protobuf); JSON is just common.

### T12. Does GraphQL remove the need for API versioning?
It reduces it through additive evolution and deprecation, but breaking semantic changes and removals still need governance and sometimes new fields/types.

### T13. Are GraphQL mutations executed in parallel?
Top-level mutation fields execute serially (in order). Query fields may execute in parallel.

### T14. Is `OPTIONS` preflight cached?
Yes, per `Access-Control-Max-Age` (browser-capped). Without it, each non-simple request triggers a preflight.

### T15. What is the "BFF vs GraphQL gateway" difference?
A BFF is a backend tailored to a client; GraphQL is a technology that can implement a BFF or a shared gateway. They solve overlapping problems at different layers.

### T16. Why can DataLoader leak data between users?
If created once globally, its cache persists across requests/users. Create loaders per request.

### T17. Is HTTP/2 a reason to stop bundling API calls?
Multiplexing reduces connection overhead but not server work or latency of dependent calls; still design coarse-grained endpoints where it reduces round trips.

### T18. Does `Cache-Control: no-cache` disable caching?
No; it allows storing but requires revalidation. `no-store` forbids storing.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **REST stands for?** REpresentational State Transfer.
- **Idempotent methods?** GET, PUT, DELETE (plus HEAD/OPTIONS).
- **Create returns?** `201` + `Location`.
- **No content?** `204`.
- **Validation error?** `400`/`422`.
- **Conflict?** `409`.
- **Rate limited?** `429` + `Retry-After`.
- **Unauthenticated?** `401`.
- **Forbidden?** `403`.
- **GraphQL endpoint?** Usually `/graphql`.
- **GraphQL read/write/stream?** Query/Mutation/Subscription.
- **N+1 fix?** DataLoader.
- **Pagination standard in GraphQL?** Relay connections.
- **Schema evolution?** `@deprecated`.
- **Federation gateway?** Router (Apollo Router).
- **Public API docs format?** OpenAPI.
- **Error format standard?** RFC 9457 problem details.
- **Concurrency header?** `ETag` + `If-Match`.
- **Retry safe header?** `Idempotency-Key`.
- **CORS header?** `Access-Control-Allow-Origin`.
- **Auth for SPAs?** Authorization Code + PKCE.
- **Machine-to-machine auth?** Client Credentials.
- **Internal RPC?** gRPC.
- **TS monorepo RPC?** tRPC.
- **Server push over HTTP?** SSE.
- **Bidirectional?** WebSocket.
- **API threat list?** OWASP API Top 10.
- **Top API risk?** BOLA/IDOR.
- **GraphQL abuse defenses?** Depth/cost limits, persisted queries.
- **Webhook authenticity?** HMAC signature.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an API you designed.
STAR: "I designed the public REST API for a logistics SaaS: OpenAPI-first, OAuth2 client credentials for partners, cursor pagination, idempotency keys on shipment creation, RFC 9457 errors, signed webhooks, and per-plan rate limits. Time-to-first-call dropped from 2 days to 2 hours with generated SDKs and a sandbox, and duplicate shipments went to zero."

### P2. Describe a GraphQL performance problem you solved.
"A product page query triggered 400 DB calls. Traces showed N+1 on reviews and sellers. I added DataLoaders, Prisma lookahead `select`, indexes and a depth/cost limit. p95 fell from 2.8 s to 220 ms and DB load dropped 60%."

### P3. How did you handle a breaking change?
"We needed to change an order status model. I added the new fields, kept the old ones deprecated with `Deprecation`/`Sunset` headers, tracked per-client usage, contacted the top consumers, ran brownouts and removed the old version after 9 months with no incidents."

### P4. Tell me about a security issue in an API.
"A pen test found BOLA: `/invoices/{id}` returned any invoice. I added tenant-scoped queries, centralized authorization policies, tests for cross-tenant access in CI, and logging for denied attempts."

### P5. REST or GraphQL for this project, and why?
"For a mobile and web app with many aggregated screens and rapid iteration, GraphQL as a BFF over existing REST services. For partner integrations and webhooks, REST with OpenAPI. We used both and documented the boundary."

### P6. How do you ensure API quality?
"Spec linting, contract tests, integration tests with containers, load tests, SLO dashboards, schema checks in CI, and a design review for every new endpoint."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **HTTP fundamentals:** methods, status codes, headers, caching, content negotiation, TLS, HTTP/2/3, cookies, CORS.
- **REST design:** resources, URIs, idempotency, versioning, pagination, filtering, errors, HATEOAS, long-running operations, bulk operations.
- **Security:** authN/authZ, OAuth2/OIDC, JWT, sessions, CSRF/XSS, OWASP API Top 10, rate limiting, SSRF, mTLS.
- **Documentation and tooling:** OpenAPI, AsyncAPI, Postman, SDK generation, mocks, contract tests.
- **GraphQL:** SDL, types, resolvers, DataLoader, pagination, errors, subscriptions, federation, persisted queries, cost limits, caching.
- **Alternatives:** gRPC, tRPC, SOAP, WebSocket, SSE, webhooks, event-driven APIs.
- **Architecture:** gateway, BFF, microservices, resilience, observability, governance, multi-tenancy.
- **Operations:** testing, CI/CD, monitoring, SLOs, deprecation, incident handling.

## Mixed topics
- APIs + Databases: pagination, N+1, transactions, ORMs (`033_Prisma-and-ORMs.md`).
- APIs + Redis: caching, idempotency, rate limits (`031_Redis-and-Caching.md`).
- APIs + Elasticsearch: search endpoints (`032_Elasticsearch.md`).
- APIs + BaaS: Supabase/Firebase auto-generated APIs and RLS (`034_Firebase-and-Supabase.md`).
- APIs + Frontend: Apollo/TanStack Query, optimistic UI, error boundaries.
- APIs + Kubernetes/Cloud: ingress, gateways, autoscaling, canary releases.
- APIs + AI: tool calling, streaming responses (SSE), rate limiting, cost caps.

---

# 🔬 Part 12: API Internals

### I1. Life of an HTTP request
DNS → TCP/QUIC connect → TLS handshake → HTTP request → CDN/LB/gateway → application server → middleware → handler → database/services → response serialization → compression → client. Each hop adds latency and failure modes.

### I2. GraphQL execution
Parse → validate (against schema, rules like depth) → execute: resolve top-level fields (parallel for queries, serial for mutations), then recursively resolve child fields; results are coerced to the type system (non-null propagation) and assembled into `data` with collected `errors`.

### I3. DataLoader mechanics
Collects `.load(key)` calls during one tick of the event loop (via `process.nextTick`/microtask), calls the batch function with the unique keys, and resolves each promise from the returned array; caches per instance.

### I4. Apollo cache normalization
Objects are stored by `__typename:id` in a flat map; queries hold references; writes merge into entities so any query selecting that entity updates automatically; `typePolicies` define `keyFields` and merge functions for lists.

### I5. Federation query planning
The router builds a plan splitting the operation into fetches per subgraph, using `@key` entity representations (`_entities` queries) to join results, parallelizing where possible and sequencing dependent fetches.

### I6. HTTP caching mechanics
Caches store responses keyed by method+URL+`Vary` headers; freshness via `max-age`/`Expires`; validation with `ETag`/`Last-Modified`; shared caches obey `s-maxage` and `private`. Authorization-bearing requests aren't cached by shared caches unless explicitly allowed.

### I7. JWT verification
Split token, decode header to select key (`kid`), verify signature with the correct algorithm (pinned, not taken blindly from the header), then validate `exp`, `nbf`, `iss`, `aud`; keys fetched from JWKS and cached with rotation.

### I8. OAuth Authorization Code + PKCE
Client generates `code_verifier` and `code_challenge`; user authenticates at the IdP; the client receives an authorization `code` via redirect and exchanges it with the `code_verifier` for tokens, protecting against interception.

### I9. Rate limiter algorithms internally
Token bucket stores tokens + last refill timestamp (O(1) state); sliding window log stores timestamps (O(n)); sliding window counter blends two fixed windows; implemented atomically in Redis via Lua or `INCR` + `EXPIRE`.

---

# 📊 Part 13: Reference Tables

### Status codes cheat table
| Code | Meaning | Typical use |
|---|---|---|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | POST created resource (+ `Location`) |
| 202 | Accepted | Async processing started |
| 204 | No Content | Successful DELETE/PUT with no body |
| 301/308 | Permanent redirect | URL moved |
| 302/307 | Temporary redirect | Temporary move |
| 304 | Not Modified | Conditional GET cache hit |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | No permission |
| 404 | Not Found | Missing resource |
| 405 | Method Not Allowed | Wrong verb |
| 409 | Conflict | Duplicate / state conflict |
| 410 | Gone | Permanently removed |
| 412 | Precondition Failed | `If-Match` mismatch |
| 415 | Unsupported Media Type | Wrong `Content-Type` |
| 422 | Unprocessable Content | Semantic validation error |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Unhandled error |
| 502/503/504 | Bad gateway / Unavailable / Timeout | Upstream issues |

### REST vs GraphQL vs gRPC
| | REST | GraphQL | gRPC |
|---|---|---|---|
| Transport | HTTP/1.1-3 | HTTP (POST/GET), WS | HTTP/2 |
| Format | JSON (usually) | JSON | Protobuf (binary) |
| Contract | OpenAPI (optional) | Schema (required) | .proto (required) |
| Caching | Excellent | Hard | Hard |
| Streaming | SSE/WebSocket | Subscriptions | Native 4 modes |
| Best for | Public/CRUD APIs | Client-driven UIs | Internal services |
| Browser support | Native | Native | gRPC-Web |

### Authentication options
| Option | Best for | Caveat |
|---|---|---|
| Session cookie | Browser apps | CSRF protection needed |
| JWT access + refresh | SPAs/mobile | Revocation, storage |
| API key | Server integrations | Not user identity; rotate |
| OAuth2/OIDC | Third-party/SSO | Complexity |
| mTLS | Service-to-service | Cert management |

### Pagination comparison
| Type | Pros | Cons |
|---|---|---|
| Offset/limit | Simple, page jump | Slow, unstable |
| Cursor/keyset | Fast, stable | No random jump |
| Page token | Opaque, flexible | Needs server logic |
| Time-based | Good for feeds | Ties/ordering issues |

### Caching headers
| Header | Purpose |
|---|---|
| `Cache-Control` | Freshness and storage rules |
| `ETag` / `If-None-Match` | Validation |
| `Last-Modified` / `If-Modified-Since` | Validation by time |
| `Vary` | Cache key variation |
| `Age` | Time in cache |
| `Expires` | Legacy absolute expiry |

### Version/spec highlights (verify)
| Item | Notes |
|---|---|
| RFC 9110/9111/9112 | Consolidated HTTP semantics, caching, HTTP/1.1 |
| RFC 9457 | Problem Details (obsoletes 7807) |
| OpenAPI 3.1 | JSON Schema 2020-12 aligned |
| OAuth 2.1 (draft) | Consolidates best practices (PKCE mandatory) |
| GraphQL over HTTP | Standardizing status codes/transport |
| Apollo Federation 2 | Flexible composition, `@link` imports |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```http
POST /users   {"name":"A"}
POST /users   {"name":"A"}
```
**Result:** two users created (POST isn't idempotent) unless an idempotency key or unique constraint prevents duplicates (then `409`).

### O2.
```http
PUT /users/5   {"name":"Ritesh Kumar"}    # existing user had email and age
```
**Result:** resource replaced: `email` and `age` are removed/reset (PUT is full replacement). Use `PATCH` for partial updates.

### O3.
```js
const res = await fetch("/api/missing");
console.log(res.ok, res.status);
```
**Output:** `false 404` — `fetch` resolves normally for HTTP errors.

### O4.
```graphql
query { user(id: "999") { name } }
```
when `user` is nullable and not found.
**Output:** `{ "data": { "user": null } }` with HTTP 200 (no `errors` unless the resolver threw).

### O5.
```graphql
type Query { me: User! }
```
and the resolver throws.
**Output:** `{ "data": null, "errors": [...] }` — the null propagates to the root because `me` is non-null.

### O6.
```graphql
mutation { a: increment { n } b: increment { n } }
```
**Result:** executed serially: `a` then `b` (second sees the first's effect); if both were queries they could run in parallel.

### O7.
```graphql
query { posts { author { name } } }   # 20 posts, no DataLoader
```
**Queries executed:** 1 for posts + 20 for authors = 21 (N+1). With DataLoader: 2.

### O8.
```http
GET /items?limit=5   → ETag: "x1"
GET /items?limit=5   If-None-Match: "x1"
```
**Result:** `304 Not Modified` with no body if unchanged.

### O9.
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```
**Result:** browsers reject credentialed requests (wildcard origin can't be used with credentials); specify the exact origin.

### O10.
```js
jwt.verify(token, secret, { algorithms: ["HS256"] });   // token header says alg: none
```
**Result:** verification fails — pinned algorithms prevent `alg: none` attacks.

### O11.
```http
DELETE /orders/7   (twice)
```
**Result:** first `204`, second `404` (or `204` if implemented idempotently); the server state afterwards is the same (resource absent), so DELETE is idempotent.

### O12.
```graphql
query { users(first: 1000) { id } }   # server cap is 100
```
**Result:** either validation error ("first must be ≤ 100") or silently clamped to 100 depending on the implementation; document the behaviour.

---

# ✅ Part 15: MCQs

**1. Which HTTP method is idempotent and replaces a whole resource?**
A) POST  B) PUT  C) PATCH  D) CONNECT
**Answer: B**

**2. Which status code is right for a successful creation?**
A) 200  B) 201  C) 204  D) 302
**Answer: B**

**3. GraphQL's N+1 problem is typically solved with:**
A) Caching headers  B) DataLoader batching  C) HTTP/2  D) PATCH
**Answer: B**

**4. In GraphQL, top-level mutation fields execute:**
A) In parallel  B) Serially  C) Randomly  D) Only once per second
**Answer: B**

**5. Which header prevents lost updates in REST?**
A) `Accept`  B) `If-Match` with `ETag`  C) `Origin`  D) `Cookie`
**Answer: B**

**6. OWASP API #1 risk is:**
A) SSRF  B) Broken Object Level Authorization  C) Mass assignment  D) CORS
**Answer: B**

**7. Best OAuth2 flow for SPAs and mobile apps:**
A) Implicit  B) Password  C) Authorization Code with PKCE  D) Client Credentials
**Answer: C**

**8. What does a 429 response signal?**
A) Server crashed  B) Client is rate limited  C) Resource moved  D) Invalid JSON
**Answer: B**

**9. GraphQL introspection allows clients to:**
A) Modify the schema  B) Query the schema itself  C) Bypass auth  D) Disable validation
**Answer: B**

**10. Cursor pagination advantage over offset:**
A) Easier page jumps  B) Stable and fast at depth  C) Always returns totals  D) Needs no index
**Answer: B**

**11. Which is NOT a REST constraint?**
A) Statelessness  B) Cacheability  C) Single endpoint for all operations  D) Uniform interface
**Answer: C**

**12. `Cache-Control: no-store` means:**
A) Revalidate before use  B) Do not store the response  C) Cache for an hour  D) Cache only on the CDN
**Answer: B**

**13. Which standard describes REST APIs for docs and codegen?**
A) WSDL  B) OpenAPI  C) GraphQL SDL  D) Protobuf
**Answer: B**

**14. Apollo Federation `@key` is used to:**
A) Encrypt fields  B) Identify entities across subgraphs  C) Cache results  D) Define auth
**Answer: B**

**15. A good defense against expensive GraphQL queries:**
A) Disable HTTPS  B) Depth/cost limits and persisted queries  C) Larger servers only  D) Use GET for mutations
**Answer: B**

**16. Webhook authenticity is verified using:**
A) Cookies  B) HMAC signature over the raw body  C) CORS  D) Robots.txt
**Answer: B**

**17. Which protocol uses Protocol Buffers over HTTP/2?**
A) REST  B) GraphQL  C) gRPC  D) SOAP
**Answer: C**

**18. 202 Accepted indicates:**
A) Resource created  B) Request accepted for async processing  C) No content  D) Unauthorized
**Answer: B**

**19. Safe HTTP methods (no state change) include:**
A) GET, HEAD, OPTIONS  B) POST, PUT  C) DELETE, PATCH  D) All methods
**Answer: A**

**20. DataLoader instances should be created:**
A) Once globally  B) Per request  C) Per field  D) Per database
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Verbs in URLs and inconsistent naming** (`/getUser`, `/user_list`).
2. **Returning 200 for errors** (REST) with a `success: false` body.
3. **Missing authorization checks per object** (BOLA/IDOR).
4. **Mass assignment** of request bodies into DB models.
5. **Unbounded lists** without pagination or limit caps.
6. **Offset pagination at scale** and unstable sorting.
7. **No idempotency for payments/orders** under retries.
8. **Leaking stack traces, SQL or internal IDs** in errors.
9. **Wildcard CORS with credentials**, or treating CORS as security.
10. **Long-lived JWTs in `localStorage`** without rotation.
11. **Breaking changes without versioning/deprecation.**
12. **GraphQL N+1** from naive resolvers.
13. **No depth/cost limits** or allow-lists on public GraphQL.
14. **Global DataLoader / shared cache across users.**
15. **Treating introspection-off as a security control.**
16. **Business logic in resolvers/controllers** (fat controllers).
17. **Ignoring timeouts, retries and circuit breakers** for downstream calls.
18. **No rate limiting** on auth and expensive endpoints.
19. **Missing observability** (request ids, per-operation metrics).
20. **Undocumented behaviour** and no changelog.
21. **Using `GET` for state-changing actions.**
22. **Not verifying webhook signatures** or not handling duplicates.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You design APIs from **consumer needs and domain resources**, with consistent standards (errors, pagination, naming).
- You treat **idempotency, retries, timeouts and concurrency control** as first-class concerns.
- You think in **security layers**: OAuth2/OIDC, object-level authorization, validation, rate limits, SSRF defenses, OWASP API Top 10.
- You know the HTTP caching model and use it deliberately (ETag, `Cache-Control`, `Vary`).
- You can build and operate **GraphQL** safely: DataLoader, cost limits, persisted queries, schema governance, federation trade-offs.
- You choose **REST vs GraphQL vs gRPC vs events** per use case and justify it.
- You evolve APIs with **deprecation, schema checks and contract tests**, not big-bang breaks.
- You instrument everything (traces, RED metrics, SLOs) and debug with correlation IDs.
- You provide great **DX**: docs, SDKs, sandbox, changelog.
- You bring measured outcomes (latency, error rate, adoption) and incident learnings.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Quick HTTP/REST
```
GET read • POST create/action • PUT replace • PATCH partial • DELETE remove
201 + Location on create • 204 no body • 409 conflict • 422 validation • 429 + Retry-After
Idempotency-Key for POST • ETag + If-Match for updates • Cursor pagination • RFC 9457 errors
```

### Quick GraphQL
```graphql
type Query { user(id: ID!): User }  type Mutation { createUser(input: CreateUserInput!): CreateUserPayload! }
resolver: (parent, args, context, info) • DataLoader per request • Relay connections • @deprecated for evolution
limits: depth + cost + persisted queries • errors[] with extensions.code
```

### Security checklist
HTTPS/HSTS • OAuth2/OIDC (PKCE) • short-lived tokens • object-level authZ • allow-listed fields (no mass assignment) • input validation • rate limiting • CORS with exact origins • secrets in a vault • no sensitive data in URLs/logs • webhook signature verification • OWASP API Top 10 review.

### Performance checklist
Pagination caps • indexes • no N+1 • caching (HTTP/CDN/Redis/DataLoader) • compression • HTTP/2 keep-alive • async for slow work • timeouts/circuit breakers • measure p95/p99.

### Pattern quick picks
Retries safely → idempotency keys • Lost updates → ETag/If-Match • Long jobs → 202 + status resource/webhook • Many clients/screens → GraphQL BFF • Internal low-latency → gRPC • Real-time → WebSocket/SSE • Multi-team graph → federation • Partner integrations → REST + webhooks + OpenAPI.

### Interview strategy
1. Clarify consumers, scale, auth model, latency and evolution needs.
2. Propose the API style and resource/schema model.
3. Show key request/response examples (status codes, errors, pagination).
4. Cover security (authN/Z, BOLA, rate limits) and reliability (idempotency, retries).
5. Discuss performance (N+1, caching) and observability.
6. Explain versioning/deprecation and testing/documentation strategy.
7. Close with a measured outcome from a real project.

### Final checklist before the interview
- [ ] Explain REST constraints, HTTP methods, idempotency and status codes.
- [ ] Design endpoints with pagination, filtering, errors, versioning and idempotency keys.
- [ ] Explain authN vs authZ, JWT, OAuth2 + PKCE, CORS and CSRF.
- [ ] Explain GraphQL schema, resolvers, N+1/DataLoader, pagination, subscriptions, errors.
- [ ] Describe GraphQL security (depth/cost limits, persisted queries, field authZ) and federation.
- [ ] Compare REST, GraphQL, gRPC, tRPC and webhooks with trade-offs.
- [ ] Describe caching (HTTP, CDN, Redis, Apollo) and rate limiting.
- [ ] Explain API gateway/BFF, resilience patterns and observability.
- [ ] Describe testing (unit, integration, contract, load) and OpenAPI/docs workflow.
- [ ] Prepare a design story, a performance story and a security story with numbers.
