# Microservices Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide is technology-neutral architecture knowledge with examples in **Node.js (Express/NestJS/Fastify)**, **Docker/Kubernetes**, **Kafka/RabbitMQ**, **REST/gRPC**, **Istio/Linkerd**, **OpenTelemetry**, **Resilience4j / opossum**, **Temporal**, and cloud services (AWS/Azure/GCP). Tooling changes quickly (service meshes, ambient mode, Gateway API, Dapr, serverless containers): anything marked "verify" should be checked in the official docs for your version. The principles (bounded contexts, autonomy, resilience, observability, evolutionary design) are stable. Examples use the sample name **Ritesh Kumar**.
> This file covers monolith vs modular monolith vs microservices, when (not) to adopt microservices, domain-driven design and bounded contexts, service decomposition, communication (REST, gRPC, messaging), API gateway/BFF, service discovery and configuration, data management (database per service, sagas, outbox, CQRS, event sourcing), consistency, resilience patterns (timeouts, retries, circuit breakers, bulkheads), observability (logs, metrics, traces), deployment (containers, Kubernetes, service mesh, CI/CD, canary/blue-green, GitOps), security (zero trust, mTLS, token propagation), testing (contract, consumer-driven, end-to-end), versioning, organization (Conway's law, team topologies), migration (strangler fig) and common anti-patterns. Related topics: queues in `038_Message-Queues.md`, API styles in `035_GraphQL-and-REST-APIs.md`, security in `036_Authentication-and-Security.md`, realtime in `037_WebSockets-and-Realtime.md`, Docker/Kubernetes/observability in `../07_DevOps_and_Cloud/`, system design in `../09_System_Design/053_System-Design.md`, design patterns in `../08_CS_Fundamentals/023_OOP-and-Design-Patterns.md`.

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
- [Part 12: Architecture Internals](#-part-12-architecture-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is a microservices architecture? *(Must-know)*
An architectural style that structures an application as a **suite of small, independently deployable services**, each built around a business capability, owning its data, running in its own process and communicating over the network (HTTP/gRPC/messaging). Each service can be developed, deployed, scaled and versioned independently, often by a small autonomous team.

### Q2. What is a monolith?
A single deployable unit containing all functionality (UI, business logic, data access) usually backed by one database. Simple to develop, test, deploy and debug at small scale; becomes hard to scale teams, deploy frequently, and evolve technology as it grows. A monolith is not "bad": many successful systems start (and stay) as well-structured monoliths.

### Q3. Monolith vs modular monolith vs microservices *(Must-know)*
| | Monolith | Modular monolith | Microservices |
|---|---|---|---|
| Deployment | One unit | One unit, strict internal modules | Many independent units |
| Boundaries | Often blurred | Enforced in code (packages, APIs) | Enforced by network/process |
| Data | One shared DB | One DB, schema-per-module | Database per service |
| Complexity | Low | Low-medium | High (distributed systems) |
| Team scaling | Poor beyond ~10-20 devs | Good | Excellent |
| Best for | MVPs, small teams | Most growing products | Large orgs, independent scaling/deployment |
Many teams should start with a **modular monolith** and extract services when there's a clear need.

### Q4. Advantages of microservices
Independent deployment and scaling, team autonomy, technology flexibility (polyglot), fault isolation (a failing service needn't take down everything), smaller codebases, faster releases for each service, alignment with business domains.

### Q5. Disadvantages and costs *(Must-know)*
Distributed-system complexity (network failures, latency, partial failure), data consistency without ACID across services, operational overhead (CI/CD, monitoring, infrastructure), harder debugging/testing, versioning and contract management, duplicated effort, security surface area, higher infrastructure cost. Microservices trade code complexity for operational complexity.

### Q6. When should you use microservices? When not?
**Use when:** large teams needing independent delivery, clear domain boundaries, different scaling/availability needs per capability, mature DevOps (CI/CD, observability, automation), frequent deployments. **Avoid when:** small team/early product with unclear domain, low operational maturity, simple CRUD apps, strong cross-entity transactional needs. "Don't start with microservices" is common advice.

### Q7. What is a service? Characteristics of a good microservice
Small enough for a team to understand and own, **single responsibility** around a business capability, own data store, well-defined API contract, independently deployable, loosely coupled and highly cohesive, resilient, observable, automated build/test/deploy. Size is about **cognitive load and boundaries**, not lines of code.

### Q8. Bounded context (DDD) *(Must-know)*
A boundary within which a domain model and its language ("ubiquitous language") are consistent. The word "Customer" means different things in Sales, Billing and Support contexts, so each context has its own model. Microservices usually map to bounded contexts; contexts communicate via explicit contracts (APIs/events), not shared models.

### Q9. Domain-Driven Design vocabulary
**Domain**, **subdomain** (core, supporting, generic), **bounded context**, **aggregate** (consistency boundary with a root entity), **entity**, **value object**, **domain event**, **repository**, **anti-corruption layer (ACL)**, **context map**. Core subdomains deserve custom-built services; generic ones (auth, email) can be bought.

### Q10. Communication styles *(Must-know)*
| Style | Examples | Characteristics |
|---|---|---|
| Synchronous request/response | REST, gRPC, GraphQL | Simple, immediate, temporal coupling |
| Asynchronous messaging | Kafka, RabbitMQ, SQS | Decoupled, resilient, eventual consistency |
| Event-driven | Domain events on a bus | Loose coupling, extensibility |
Prefer asynchronous events for integration between bounded contexts; use sync calls for queries needing immediate answers. See `038_Message-Queues.md`.

### Q11. REST vs gRPC between services
REST/JSON: ubiquitous, human-friendly, cacheable, good for public/external APIs. gRPC (HTTP/2 + Protobuf): binary, fast, strongly typed contracts, streaming, code generation, great for internal low-latency calls; weaker browser support (gRPC-Web). Many systems use REST at the edge and gRPC/events internally. See `035_GraphQL-and-REST-APIs.md`.

### Q12. API gateway *(Must-know)*
A single entry point for clients that routes requests to services and handles cross-cutting concerns: authentication, rate limiting, TLS termination, request aggregation, caching, logging, protocol translation, versioning. Examples: Kong, NGINX, Envoy, AWS API Gateway, Azure APIM, Apigee, Spring Cloud Gateway, Traefik. Avoid putting business logic in it.

### Q13. Backend for Frontend (BFF)
A separate backend per client type (web, mobile, partner) that tailors APIs and aggregates downstream calls for that client's needs, reducing chattiness and client complexity. Owned by the frontend team.

### Q14. Service discovery
Services find each other dynamically as instances scale/move. **Client-side** (client queries registry such as Eureka/Consul, then load-balances) vs **server-side** (load balancer/router resolves, e.g. Kubernetes Service DNS, AWS ALB). In Kubernetes: `http://orders.default.svc.cluster.local`.

### Q15. Database per service *(Must-know)*
Each service owns its private data store; others access data only via its API/events. Enables independent evolution and technology choice (polyglot persistence) but removes cross-service joins and ACID transactions. Sharing one database between services couples them tightly (an anti-pattern).

### Q16. Why not share a database?
Schema changes ripple across services, hidden coupling through tables, uncontrolled access, contention and scaling limits, no clear ownership. If you share a DB you have a distributed monolith.

### Q17. Distributed transactions problem and eventual consistency
No single ACID transaction spans services. Instead, use **sagas** (sequence of local transactions with compensations) and accept **eventual consistency**. Two-phase commit (2PC) is generally avoided: it's blocking, couples availability and scales poorly.

### Q18. Saga pattern (intro) *(Must-know)*
A long-running business transaction made of local transactions across services. If one step fails, previously completed steps are undone by **compensating transactions**. Two styles: **choreography** (events trigger next steps) and **orchestration** (a coordinator directs steps). See `038_Message-Queues.md`.

### Q19. Containers and microservices
Containers (Docker) package each service with dependencies for consistent environments and fast startup; orchestrators (Kubernetes) schedule, scale, heal and network them. Microservices and containers are independent concepts but a natural pair. See `../07_DevOps_and_Cloud/045_Docker.md` and `../07_DevOps_and_Cloud/046_Kubernetes.md`.

### Q20. Twelve-Factor App (relevant rules)
Codebase in VCS, explicit dependencies, config in environment, backing services as attached resources, build/release/run separation, stateless processes, port binding, concurrency via process model, disposability (fast start/graceful shutdown), dev/prod parity, logs as event streams, admin processes as one-off tasks.

### Q21. Configuration management
Externalize config (env vars, ConfigMaps, Spring Cloud Config, Consul, AWS Parameter Store/AppConfig); keep secrets in a secret manager (Vault, Secrets Manager, Kubernetes Secrets + KMS); per-environment overrides; support dynamic reload only when safe; version and audit config changes.

### Q22. Health checks
Each service exposes **liveness** (should it be restarted?) and **readiness** (can it receive traffic? dependencies OK?) endpoints (`/healthz`, `/readyz`). Orchestrators use them for restarts and routing. Keep liveness cheap; readiness may check critical dependencies carefully (avoid cascading failures).

### Q23. Statelessness and scaling
Services should be stateless so any instance can handle any request; store state in databases, caches (Redis) or clients (tokens). Enables horizontal scaling and easy replacement. See `../04_Database/031_Redis-and-Caching.md`.

### Q24. Logging, monitoring and tracing: three pillars of observability *(Must-know)*
- **Logs**: discrete events (structured JSON with correlation IDs).
- **Metrics**: numeric time series (RED: Rate, Errors, Duration; USE for resources).
- **Traces**: end-to-end request flow across services (OpenTelemetry, Jaeger, Tempo).
Without observability, microservices are undebuggable. See `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`.

### Q25. Correlation ID / trace ID
A unique ID generated at the edge and propagated via headers (`traceparent`, `X-Request-Id`) through every call and message so logs and traces for one request can be stitched together.
```js
app.use((req, res, next) => { req.id = req.get("x-request-id") ?? crypto.randomUUID(); res.set("x-request-id", req.id); next(); });
await fetch(url, { headers: { "x-request-id": req.id } });
```

### Q26. Resilience basics: timeouts, retries, circuit breaker
Every network call needs a **timeout**; **retries** (with backoff + jitter, only for idempotent operations); a **circuit breaker** stops calling a failing dependency and fails fast, then probes (half-open) before recovering. Plus **bulkheads** (isolate resources) and **fallbacks**.

### Q27. Circuit breaker states
**Closed** (normal; count failures) → **Open** (fail fast for a cool-down period) → **Half-open** (allow trial requests; success closes, failure re-opens). Libraries: Resilience4j, Polly, opossum (Node), Istio outlier detection.
```js
import CircuitBreaker from "opossum";
const breaker = new CircuitBreaker(callPayments, { timeout: 2000, errorThresholdPercentage: 50, resetTimeout: 10_000 });
breaker.fallback(() => ({ status: "PENDING" }));
const result = await breaker.fire(order);
```

### Q28. Idempotency
Operations that can be repeated safely. Essential because retries and at-least-once messaging cause duplicates. Use idempotency keys, unique constraints and conditional updates.

### Q29. Service-to-service authentication basics
Internal traffic is not automatically trusted. Use mTLS and/or signed JWTs (client credentials / token exchange), short-lived credentials and least-privilege scopes. See `036_Authentication-and-Security.md`.

### Q30. Versioning APIs between services
Prefer backward-compatible, additive changes (new optional fields), tolerant readers, and explicit versions (`/v2`, new message types) only for breaking changes; run old and new versions in parallel until consumers migrate; deprecate with timelines.

### Q31. A tiny Node.js microservice
```js
import express from "express";
const app = express();
app.use(express.json());

const orders = new Map();
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.post("/orders", (req, res) => {
  const { userId, items } = req.body ?? {};
  if (!userId || !Array.isArray(items) || !items.length) return res.status(400).json({ error: "invalid order" });
  const order = { id: crypto.randomUUID(), userId, items, status: "PENDING" };
  orders.set(order.id, order);
  // publish OrderPlaced event here (outbox in a real service)
  res.status(201).location(`/orders/${order.id}`).json(order);
});
app.get("/orders/:id", (req, res) => orders.get(req.params.id) ? res.json(orders.get(req.params.id)) : res.sendStatus(404));

const server = app.listen(process.env.PORT ?? 3000);
process.on("SIGTERM", () => server.close(() => process.exit(0)));     // graceful shutdown
```

### Q32. Dockerfile for a service
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```
Multi-stage build, non-root user, production dependencies only.

### Q33. Docker Compose for local multi-service dev
```yaml
services:
  gateway: { build: ./gateway, ports: ["8080:8080"], depends_on: [orders, users] }
  orders:  { build: ./orders, environment: [DATABASE_URL=postgres://orders:pw@orders-db:5432/orders, BROKER_URL=amqp://rabbit], depends_on: [orders-db, rabbit] }
  users:   { build: ./users }
  orders-db: { image: postgres:16, environment: { POSTGRES_PASSWORD: pw, POSTGRES_USER: orders, POSTGRES_DB: orders } }
  rabbit:  { image: rabbitmq:3-management }
```

### Q34. Common microservice example: e-commerce services
Catalog, Cart, Order, Payment, Inventory, Shipping, User/Identity, Notification, Search, Recommendation. Orders publish `OrderPlaced`; Inventory reserves stock; Payment charges; Notification emails; Search indexes catalog changes. Each owns its data.

---

# 🔵 Part 2: Junior (1–3 years)

### Q35. How to decompose a monolith into services *(Must-know)*
Strategies: by **business capability** (Order, Billing), by **DDD subdomain/bounded context**, by **volatility** (frequently changing parts), by **scaling profile** (CPU-heavy image processing), by **team ownership**. Use event storming to find domain events and boundaries. Start with the seam that has the clearest boundary and least data entanglement.

### Q36. Event storming (workshop)
Collaborative modelling where domain experts and developers place sticky notes: domain events (orange), commands (blue), aggregates (yellow), policies, external systems, hotspots. Reveals bounded contexts, flows and ownership boundaries before writing code.

### Q37. Strangler Fig migration pattern *(Must-know)*
Gradually replace a legacy monolith: put a facade (gateway/proxy) in front, route specific routes/features to new services while the rest still hits the monolith, repeat until the monolith is empty. Add an **anti-corruption layer** to translate between old and new models. Benefits: incremental, reversible, low-risk.

### Q38. Anti-corruption layer (ACL)
A translation layer that prevents a legacy or external model from polluting a new service's domain model. Implemented as adapters/mappers/facades converting external DTOs into domain objects.

### Q39. Choreography vs orchestration *(Must-know)*
| | Choreography | Orchestration |
|---|---|---|
| Control | Decentralized via events | Central orchestrator/workflow engine |
| Coupling | Services know events, not each other | Orchestrator knows all participants |
| Visibility | Hard to see the full flow | Clear state machine |
| Failure handling | Distributed compensation | Centralized retry/compensation |
| Tools | Kafka/RabbitMQ events | Temporal, Step Functions, Camunda, Conductor |
Use choreography for simple flows; orchestration for complex, long-running, timed processes.

### Q40. Saga example: place order
1. Order service: create order (PENDING), emit `OrderCreated`.
2. Inventory: reserve stock → `StockReserved` (or `StockFailed`).
3. Payment: charge → `PaymentCaptured` (or `PaymentFailed`).
4. Order: mark CONFIRMED.
Compensations: `PaymentFailed` → Inventory releases stock → Order CANCELLED. Make every step idempotent and persist saga state with timeouts.

### Q41. Transactional outbox (recap)
Write the business change and the outgoing event in one local DB transaction; a relay publishes outbox rows to the broker (polling or CDC). Prevents "DB updated but event lost" (dual-write). Consumers are idempotent because delivery is at-least-once. See `038_Message-Queues.md`.

### Q42. CQRS (Command Query Responsibility Segregation)
Separate models for writes (commands) and reads (queries). Reads use denormalized views optimized for queries, updated asynchronously via events. Useful when read and write loads/shapes differ; costs: eventual consistency, extra moving parts. Don't apply by default.

### Q43. Event sourcing (intro)
Store state as an immutable sequence of events; current state is derived by replaying. Gives audit trail and temporal queries; requires snapshots, schema evolution (upcasting), projections and careful handling of GDPR deletion. Often paired with CQRS; adopt selectively.

### Q44. Data consistency approaches
Strong consistency within a service (ACID), eventual consistency across services (events), read-your-writes UX tricks (return the created entity, optimistic UI, polling status), reconciliation jobs, idempotent consumers, and business-level compensations rather than rollbacks.

### Q45. Querying data across services (no joins)
Options: **API composition** (gateway/BFF calls multiple services and merges), **CQRS read model** (materialized view built from events), **data replication** (local copy of reference data updated via events), **GraphQL federation** (see `035_GraphQL-and-REST-APIs.md`). Choose by latency, consistency and ownership.

### Q46. API composition pitfalls
Fan-out latency (slowest call dominates), partial failures, N+1 across services, tight coupling to many services. Mitigate: parallel calls, timeouts, caching, aggregated read models, fallbacks and partial responses.

### Q47. Shared libraries: dos and don'ts
Share cross-cutting utilities (logging, tracing, auth middleware) carefully; avoid sharing domain models or business logic (creates coupling and lockstep releases). Prefer contracts (OpenAPI/Protobuf/schema registry) and code generation over shared entity libraries.

### Q48. Monorepo vs polyrepo
Monorepo: atomic changes across services, shared tooling (Nx, Turborepo, Bazel), easier refactors, requires good CI (affected builds). Polyrepo: strong ownership boundaries, independent pipelines, harder cross-repo changes. Choose by team size and tooling maturity; independent deployability matters in both.

### Q49. Service templates / golden path
Provide a scaffold with logging, tracing, metrics, health endpoints, auth, config, Dockerfile, CI pipeline and docs so new services start production-ready and consistent (Backstage templates, cookiecutters).

### Q50. Load balancing
Client-side (gRPC, service mesh sidecars), server-side (NGINX/Envoy/cloud LB), DNS-based. Algorithms: round robin, least connections, consistent hashing, weighted. Health-check-aware routing and connection draining on shutdown are essential.

### Q51. Rate limiting and throttling
At the gateway (per client/API key) and per service (protect from internal storms), using token bucket or sliding window in Redis; return `429` with `Retry-After`. Also apply **load shedding** and **bulkheads** under overload. See `../04_Database/031_Redis-and-Caching.md`.

### Q52. Caching in microservices
Client-side cache, CDN, gateway cache, service-level Redis cache (cache-aside), local in-memory cache for reference data. Invalidate via events (`ProductUpdated`) or TTLs. Beware serving stale cross-service data for critical decisions (prices at checkout).

### Q53. Feature flags and configuration toggles
Decouple deploy from release: dark launches, gradual rollouts, kill switches. Use a flag service (LaunchDarkly, Unleash, Flagsmith, OpenFeature) with targeting rules; clean up stale flags.

### Q54. Deployment strategies
**Rolling** (replace gradually), **blue/green** (switch traffic between two environments), **canary** (small % first, automated analysis), **shadow/mirror** (copy traffic to new version), **feature-flagged** releases. Combine with automated rollback on SLO regression.

### Q55. CI/CD per service
Each service has its own pipeline: lint → unit tests → build image → contract tests → security scans (SCA/SAST/image) → push → deploy to staging → smoke/integration → progressive production rollout. Use path filters/affected builds in monorepos. Immutable versioned artifacts.

### Q56. GitOps
Desired state of the cluster/environments is stored in Git (Helm/Kustomize manifests); controllers (Argo CD, Flux) reconcile the cluster to match. Benefits: auditability, rollbacks via `git revert`, consistent environments.

### Q57. Kubernetes essentials for microservices
Deployments (replicas, rolling updates), Services (stable DNS/load balancing), Ingress/Gateway API, ConfigMaps/Secrets, HPA/KEDA autoscaling, resource requests/limits, liveness/readiness/startup probes, PodDisruptionBudgets, NetworkPolicies, namespaces. See `../07_DevOps_and_Cloud/046_Kubernetes.md`.

### Q58. Service mesh *(Must-know)*
An infrastructure layer (sidecar proxies or ambient/eBPF) providing service-to-service **mTLS, traffic management (retries, timeouts, canary splits), observability and policy** without app code changes. Examples: Istio, Linkerd, Consul Connect, Cilium Service Mesh. Costs: complexity, latency/resource overhead, learning curve. Use when you have many services and need uniform policies.

### Q59. Sidecar pattern
Run a helper container alongside the app container in the same pod to provide capabilities (proxy, logging agent, config reload, secrets injection). Related patterns: ambassador (outbound proxy), adapter (normalize output).

### Q60. Observability: structured logging example
```js
import pino from "pino";
const logger = pino({ level: "info", redact: ["req.headers.authorization", "*.password"] });
app.use((req, res, next) => { req.log = logger.child({ requestId: req.id, service: "orders" }); next(); });
req.log.info({ orderId, userId }, "order created");
```
Log JSON to stdout; collect with Fluent Bit/Vector/Promtail into Loki/ELK/Cloud Logging. See `../04_Database/032_Elasticsearch.md`.

### Q61. Distributed tracing with OpenTelemetry
Auto-instrument HTTP/DB/queue libraries, propagate W3C `traceparent`, export to a collector → Jaeger/Tempo/Datadog. Traces show latency per hop, failures and dependency graphs.
```js
// tracing.js (preload with --require)
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
new NodeSDK({ serviceName: "orders", instrumentations: [getNodeAutoInstrumentations()] }).start();
```

### Q62. Metrics: RED and golden signals
Per service/endpoint: **R**ate, **E**rrors, **D**uration (percentiles). Golden signals: latency, traffic, errors, saturation. Expose Prometheus metrics (`/metrics`), build Grafana dashboards, set SLO-based alerts (burn rates) rather than raw thresholds.

### Q63. SLI, SLO, SLA
SLI = measured indicator (success rate, p99 latency). SLO = target (99.9% success over 30 days). SLA = contractual commitment with penalties. Error budget = allowed unreliability that guides release velocity.

### Q64. Contract testing *(Must-know)*
Verifies that consumers and providers agree on API/message formats without full end-to-end environments. **Consumer-driven contracts** (Pact): consumers publish expectations; providers verify them in CI. For messaging, contract-test event schemas (Pact message pacts, schema registry compatibility). Prevents breaking changes between teams.

### Q65. Testing pyramid for microservices
Many unit tests; component tests (service with stubbed dependencies/Testcontainers); contract tests; few end-to-end tests on critical journeys; plus non-functional tests (load, chaos, security). Avoid reliance on slow, flaky full-environment E2E suites.

### Q66. Test doubles and local development
Run dependencies via Docker Compose/Testcontainers, use mocks (WireMock, MSW), or cloud dev environments (Telepresence, Tilt, Skaffold) that connect a local service to a cluster. Provide seed data and sandbox third-party integrations.

### Q67. API versioning and backward compatibility in practice
Expand/contract: add new fields/endpoints, migrate consumers, then remove old ones. For events, never remove or retype fields; use new event versions with dual publishing during migration. Maintain consumer lists (API catalog) and usage metrics before deprecation.

### Q68. Security basics for microservices
Authenticate at the edge (OAuth2/OIDC), authorize at each service (don't trust "internal" calls), propagate user identity safely (signed internal JWT / token exchange), mTLS between services, secrets in a vault, network policies, image scanning, least privilege, audit logs. See `036_Authentication-and-Security.md`.

### Q69. Authentication flow with an API gateway
Client → gateway (validates JWT or does OAuth with IdP) → forwards request with identity claims (verified internal token or headers set by the gateway only) → services enforce authorization using claims. Prevent clients from spoofing internal headers by stripping them at the edge.

### Q70. Idempotent consumers in practice
Dedupe using an inbox table keyed by message ID, conditional updates by version, or upserts. Test by delivering each message twice. See `038_Message-Queues.md`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. Aggregate design and service boundaries
An aggregate is a consistency boundary: transactions should not span aggregates; reference other aggregates by ID. Service boundaries usually contain one or more aggregates of the same bounded context. If two aggregates must be changed atomically, they likely belong in the same service.

### Q72. Identifying wrong boundaries (smells)
Chatty synchronous calls between two services, lockstep deployments, shared database tables, frequent cross-service changes for single features, circular dependencies, "God" services accumulating logic, teams blocked on each other. Fix by merging services, moving data/logic, or introducing events.

### Q73. Distributed monolith *(Must-know)*
Services that must be deployed together, share a database, or call each other synchronously in long chains; you get microservices' costs without benefits. Remedies: align boundaries with domains, own data per service, async events, contract versioning, independent pipelines.

### Q74. Temporal coupling and the fallacies of distributed computing
Assumptions to avoid: the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology doesn't change, there is one administrator, transport cost is zero, the network is homogeneous. Design for failure, latency and change.

### Q75. Resilience patterns in depth *(Must-know)*
| Pattern | Purpose |
|---|---|
| Timeout | Bound waiting time |
| Retry + backoff + jitter | Recover from transient errors (only idempotent ops) |
| Circuit breaker | Stop hammering failing dependency |
| Bulkhead | Isolate pools/threads/queues per dependency |
| Rate limiter / load shedding | Protect from overload |
| Fallback / graceful degradation | Return cached/default data |
| Hedged requests | Reduce tail latency (duplicate slow requests carefully) |
| Queue-based load leveling | Buffer spikes |
Budget retries (limit total retry amplification) to avoid retry storms across layers.

### Q76. Retry amplification
If A retries 3× calling B, which retries 3× calling C, C may see 9× load. Set retry budgets, retry only at one layer (often the edge/mesh), propagate deadlines, and use circuit breakers.

### Q77. Deadlines and timeout propagation
Pass the remaining time budget downstream (gRPC deadlines, `X-Request-Deadline`); downstream services stop work when the caller has given up. Prevent wasted work and thread exhaustion.

### Q78. Graceful degradation example
If the recommendation service is down, product pages show popular items from cache instead of failing; payments fail closed; search falls back to a simpler DB query. Decide per capability what "safe" degradation means.

### Q79. Service mesh features in detail
mTLS with automatic certificate rotation (SPIFFE IDs), traffic splitting (90/10 canary), retries/timeouts/circuit-breaking via config, fault injection, authorization policies (which service can call which), telemetry (golden signals, tracing) without code changes, ingress/egress control. Compare sidecar vs ambient/eBPF models for overhead (verify current maturity).

### Q80. API gateway vs service mesh vs ingress
| | Gateway/Ingress | Service mesh |
|---|---|---|
| Traffic | North-south (client → cluster) | East-west (service ↔ service) |
| Concerns | AuthN, rate limits, routing, TLS | mTLS, retries, traffic shifting, telemetry |
| Placement | Edge | Sidecars/node proxies |
They are complementary.

### Q81. Kubernetes Gateway API vs Ingress
Gateway API (GatewayClass, Gateway, HTTPRoute) is the more expressive, role-oriented successor to Ingress with standard support for header matching, traffic splitting and cross-namespace routing. Implementations: Envoy Gateway, Istio, NGINX Gateway Fabric, Cilium (verify versions).

### Q82. Zero-downtime deployments
Readiness probes gate traffic; rolling updates with `maxUnavailable: 0`, `maxSurge: 1`; `preStop` hooks + `terminationGracePeriodSeconds` for connection draining; graceful SIGTERM handling; backward-compatible DB migrations (expand/contract); canary with automated rollback; PodDisruptionBudgets.

### Q83. Database migrations in microservices
Each service migrates its own schema (Flyway/Liquibase/Prisma Migrate) as part of its pipeline. Use expand/contract: add column → deploy code writing both → backfill → switch reads → drop old. Never share migrations across services. See `../04_Database/033_Prisma-and-ORMs.md`.

### Q84. Handling reference data
Options: call the owner's API (coupling), replicate locally via events (fast, eventual), or cache with TTL. For slowly-changing data (countries, currencies) replicate; for critical authoritative data (balance), call the owner or use transactions within the owner.

### Q85. Orchestration engines (Temporal) *(Must-know)*
Durable execution: workflows are code that survives crashes; the engine persists history, retries activities, handles timers and signals. Great for sagas, long-running processes and human steps.
```ts
export async function orderWorkflow(order) {
  const compensations = [];
  try {
    await reserveStock(order); compensations.push(() => releaseStock(order));
    await chargePayment(order); compensations.push(() => refundPayment(order));
    await confirmOrder(order);
  } catch (e) { for (const c of compensations.reverse()) await c(); throw e; }
}
```
Alternatives: AWS Step Functions, Azure Durable Functions, Camunda/Zeebe, Netflix Conductor.

### Q86. Event design for microservices
Events are facts in the past tense (`OrderPlaced`); include IDs, timestamps, version, correlation/causation IDs; avoid leaking internal models; decide between thin (IDs only) and fat (state-carrying) events; document in an event catalog (AsyncAPI). See `038_Message-Queues.md`.

### Q87. Schema registry and compatibility
Central registry for Avro/Protobuf/JSON Schema; CI blocks incompatible changes (backward/forward/full). Consumers tolerate unknown fields. Prevents silent breakage across teams.

### Q88. gRPC details
Protobuf contracts (`.proto`), unary/server-stream/client-stream/bidi streaming, deadlines, metadata, interceptors, status codes, load balancing (client-side/xDS), reflection, gRPC-Web/Envoy for browsers, backward-compatible evolution (never reuse field numbers).
```proto
service Orders { rpc GetOrder (GetOrderRequest) returns (Order); }
message Order { string id = 1; string user_id = 2; repeated Item items = 3; }
```

### Q89. REST vs gRPC vs messaging decision guide
| Need | Choose |
|---|---|
| Public/third-party API | REST (+ OpenAPI) |
| Internal low-latency typed calls | gRPC |
| Decoupled workflows, events, fan-out | Messaging/events |
| Flexible client-driven aggregation | GraphQL/BFF |

### Q90. Inter-service authentication & authorization patterns
Token relay (pass user JWT, risk of over-broad tokens), **token exchange** (RFC 8693) to get audience-scoped tokens, **service tokens** for machine calls, mTLS identities for workload authentication, policy engines (OPA/Cedar) for centralized rules, and propagate only necessary claims.

### Q91. Multi-tenancy in microservices
Tenant ID in tokens and context; enforce tenant scoping in each service's data layer; per-tenant rate limits and quotas; isolation levels (shared DB with RLS, schema/db per tenant); noisy-neighbour protection; tenant-aware observability and billing.

### Q92. Data ownership & master data
Define system-of-record per entity (Customer owned by Identity service). Others store references and optionally read-only copies. Publish change events; resolve conflicts through the owner; avoid bidirectional sync.

### Q93. Handling large-scale reporting/analytics
Don't run analytics against service OLTP databases. Stream events/CDC to a data platform (Kafka → warehouse/lakehouse like BigQuery/Snowflake/Iceberg), build analytics models there, and expose data products. See `../10_AI_and_ML/075_Data-Engineering.md`.

### Q94. Performance considerations
Network hops add latency and failure; reduce chattiness (coarse-grained APIs, batching), cache, use async for non-critical paths, co-locate chatty services (same region/AZ), compress/serialize efficiently (Protobuf), connection reuse (HTTP keep-alive/HTTP2), and measure p95/p99 across the whole call graph.

### Q95. Capacity and autoscaling
HPA on CPU/memory/custom metrics (RPS, queue depth via KEDA); right-size requests/limits; scale-to-zero for sporadic workloads (Knative/KEDA); protect databases with connection pooling (PgBouncer) as replicas grow; load-test per service and end-to-end flows.

### Q96. Chaos engineering
Intentionally inject failures (kill pods, add latency, drop packets, fail dependencies) in controlled experiments (Chaos Mesh, Litmus, Gremlin, AWS FIS) to verify resilience patterns work and alerts/runbooks are effective. Start in staging, define steady-state hypotheses, limit blast radius.

### Q97. Incident management in microservices
Clear ownership/on-call per service, service catalog (Backstage), runbooks, dependency maps, severity levels, incident commander role, blameless postmortems with action tracking, SLO-based alerting to reduce noise.

### Q98. Documentation & discoverability
Service catalog entries (owner, tier, dependencies, SLOs, runbooks, dashboards), OpenAPI/AsyncAPI specs, architecture decision records (ADRs), C4 diagrams, onboarding guides. Without discoverability, teams duplicate services and misuse APIs.

### Q99. Technology choices: polyglot vs standardization
Allow different stacks when justified, but standardize on a small set of languages, frameworks, observability and deployment practices to reduce cognitive load and support burden. "You build it, you run it" requires supportable tech.

### Q100. Cost management
Many small services multiply base costs (idle pods, databases, observability ingestion). Use right-sizing, shared platforms, autoscaling, scale-to-zero, consolidated databases where isolation permits (separate schemas/instances), log/metric retention policies, and FinOps tagging per service/team.

---

# 🟠 Part 4: Senior (5–7 years)

### Q101. Designing a microservices architecture for an e-commerce platform *(Must-know)*
**Services (bounded contexts):** Identity, Catalog, Search, Cart, Pricing/Promotions, Order, Payment, Inventory, Shipping, Notification, Reviews, Recommendations.
**Edge:** CDN + API gateway (auth, rate limits) + BFFs for web/mobile.
**Sync paths:** catalog browsing (cached, read-optimized), cart/pricing calls.
**Async paths:** `OrderPlaced` → Inventory/Payment/Shipping/Notification via Kafka with outbox; saga orchestrator (Temporal) for checkout; CDC → search index; analytics stream to lakehouse.
**Data:** Postgres for transactional services, MongoDB/Elasticsearch for catalog/search, Redis for cart/sessions, object storage for media.
**Platform:** Kubernetes, service mesh (mTLS, canary), GitOps, OpenTelemetry, SLOs per tier-1 service, feature flags, multi-AZ.
**Trade-offs:** eventual consistency in order status, careful inventory reservation (TTL holds), idempotent payments, fallbacks for recommendations/reviews.

### Q102. Inventory reservation consistency
Use a reservation model: `reserve(sku, qty, orderId)` as an atomic conditional update (`UPDATE ... SET available = available - qty WHERE available >= qty`), with a TTL on holds; commit on payment success; release on failure/expiry. Avoid distributed locks; keep the invariant inside the Inventory service. Emit events for downstream views.

### Q103. Payment flow with idempotency and reconciliation
Idempotency key per payment attempt, state machine (`INITIATED → AUTHORIZED → CAPTURED/FAILED`), store provider references, handle webhooks (verify signatures, idempotent), timeouts query provider before retry, nightly reconciliation against provider reports, outbox for events, no card data stored (use provider tokens/PCI scope reduction).

### Q104. Handling "uncertain" outcomes
Timeouts don't mean failure. Treat as unknown: record `PENDING`, query the downstream for status later, or retry with the same idempotency key. Never assume failure and release resources prematurely.

### Q105. Read models and eventual consistency UX
After placing an order, the UI shows "Processing" using a status endpoint or SSE/WebSocket updates; the write returns the order ID immediately; the read model updates when events propagate. Use version/ETag to detect staleness; provide read-your-writes by reading from the owner service for the writer.

### Q106. Scaling data stores per service
Read replicas, caching, sharding by tenant/user, CQRS read stores, partitioning high-volume tables, archiving cold data, choosing the right datastore per access pattern (Redis, Elasticsearch, Cassandra). Avoid premature polyglot sprawl; each additional database technology is an operational cost.

### Q107. Cross-cutting concerns without a shared monolith
Platform capabilities (auth, rate limiting, observability, config) via gateway, mesh, sidecars, libraries/SDKs with strict versioning, and templates. Keep libraries thin and backward compatible; prefer infrastructure-level solutions to library coupling.

### Q108. Internal developer platform (IDP)
Self-service golden paths: service scaffolding, CI/CD, environments, secrets, observability dashboards, service catalog, cost visibility (Backstage + Crossplane/Terraform + Argo CD). Platform teams treat developers as customers and provide paved roads, not mandates.

### Q109. Team Topologies and Conway's law *(Must-know)*
Conway's law: system structure mirrors communication structure. Align services with **stream-aligned teams** (own a business flow end to end), supported by **platform**, **enabling** and **complicated-subsystem** teams. "Inverse Conway maneuver": design teams to produce the architecture you want. Limit team cognitive load: a team owns a few services, not dozens.

### Q110. Ownership and on-call
"You build it, you run it": each service has a clear owning team, on-call rotation, runbooks and dashboards. Shared/ownerless services decay. Track ownership in the service catalog and enforce it in CI (CODEOWNERS).

### Q111. Governance without bureaucracy
Lightweight standards (API guidelines, event naming, security baseline), ADRs for significant decisions, architecture review for cross-team impact, automated checks (linters, schema compatibility, policy-as-code). Autonomy within guardrails.

### Q112. Versioning and compatibility at scale
Consumer-driven contracts, schema registry checks, API catalogs showing consumers, deprecation policies with telemetry (who still calls v1?), sunset headers, parallel runs, automated compatibility tests in CI across repos.

### Q113. Handling partial failure in aggregated calls
Gateway/BFF calling 5 services: parallelize, set per-call timeouts and fallbacks, return partial responses with flags, cache stale data, circuit-break flaky dependencies, prioritize critical vs optional components, avoid failing the whole page for non-critical widgets.

### Q114. Backpressure and load shedding
Bound queues/thread pools; reject early with `429/503` + `Retry-After` when saturated; prioritize critical traffic; adaptive concurrency limits (Netflix concurrency-limits, Envoy adaptive concurrency); autoscale but protect shared databases; drop non-essential background work under stress.

### Q115. Zero Trust in microservices
Authenticate and authorize every call; mTLS everywhere; workload identity (SPIFFE/SPIRE, cloud IAM); least-privilege network policies (default deny); policy engine for fine-grained authorization; secrets short-lived; continuous verification and audit logging. See `036_Authentication-and-Security.md`.

### Q116. Supply chain & container security
Minimal base images, SBOMs, image signing and verification (cosign/Sigstore, admission controllers), vulnerability scanning in CI and registry, pinned dependencies, no root, read-only filesystems, runtime detection (Falco), least-privilege service accounts, regular patching.

### Q117. Observability at scale
Sampling strategies for traces (head vs tail-based sampling), cardinality control for metrics, structured log levels/retention tiers, exemplars linking metrics to traces, service maps, SLO dashboards, alert routing, cost control (drop noisy logs, aggregate at collectors). Use OpenTelemetry Collector pipelines.

### Q118. Multi-region architecture
Active-passive (DR) vs active-active; data replication strategy per service (single-writer + replicas, multi-leader/CRDT, global DBs like Spanner/CockroachDB/DynamoDB global tables); traffic routing (GeoDNS/Anycast/global LB); consistency and conflict handling; failover testing; cell-based architecture to limit blast radius.

### Q119. Cell-based architecture
Partition the system into isolated **cells** (each with full stack serving a subset of tenants/users). Failures and deployments are contained to a cell; routing layer maps tenants to cells. Improves blast-radius control and scaling predictability at the cost of routing complexity and tenant migration tooling.

### Q120. Evolutionary architecture & fitness functions
Define automated checks that guard architectural characteristics (latency budgets, dependency rules, test coverage thresholds, cyclic dependency checks, API compatibility). Evolve incrementally with feature flags, expand/contract, and continuous delivery rather than big rewrites.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q121. Deciding whether to adopt microservices (decision framework) *(Must-know)*
Ask: Are there multiple teams blocked by shared deploys? Are domain boundaries clear? Do components have different scaling/availability needs? Do we have CI/CD, observability, platform engineering and on-call maturity? Is the pain really architecture (vs process/test debt)? Try a **modular monolith** first; extract only high-value seams (independent scaling, different release cadence, regulatory isolation). Quantify expected benefits vs operational cost and revisit regularly.

### Q122. Migration roadmap from monolith
1. Stabilize: tests, CI/CD, observability, modularize inside the monolith.
2. Define target boundaries (DDD, event storming) and team ownership.
3. Introduce a gateway/facade and event backbone.
4. Strangle capability by capability (start with low-coupling, high-value ones).
5. Split data: dual-write/CDC, read-only replicas, then ownership transfer; remove cross-service joins.
6. Retire monolith modules; measure outcomes (lead time, change failure rate, MTTR, cost).
Plan for coexistence, rollback and shared-DB transition periods.

### Q123. Splitting a shared database safely
Steps: identify tables per bounded context; introduce service API in front of data; move writes behind the service; replicate reads via CDC to the new store; migrate consumers from table access to API/events; cut over ownership; drop foreign keys across contexts; verify with shadow reads and checksums. Expect temporary duplication.

### Q124. Measuring success: DORA and flow metrics
Deployment frequency, lead time for changes, change failure rate, time to restore service (MTTR) plus cycle time, WIP, SLO attainment, cost per transaction, developer satisfaction. If these don't improve, microservices aren't delivering value.

### Q125. Organizational change management
Microservices require product-aligned teams, DevOps culture, platform investment, training, clear ownership and decision rights. Start with pilot teams, share learnings, standardize via the platform, and avoid mandating splits without readiness.

### Q126. Enterprise integration: legacy and third parties
Use adapters/ACLs, API facades, event bridges, CDC from legacy databases, queue-based decoupling with retries and idempotency, circuit breakers for flaky partners, sandbox/contract tests, and monitoring of integration SLAs. Keep partner-specific logic isolated in dedicated integration services.

### Q127. Regulatory and data-residency design
Segregate data by region/jurisdiction using cell/region-scoped deployments, tokenization/pseudonymization, data minimization in events, per-region key management, audit trails, and deletion workflows that propagate across services (event-driven erasure, crypto-shredding).

### Q128. Reliability engineering program
SLOs and error budgets per service tier; tiered criticality (tier-0 auth/payments vs tier-3 reports); dependency mapping and failure-mode analysis; game days and chaos experiments; capacity planning; incident reviews; resilience patterns enforced via mesh/library defaults; disaster-recovery drills with RPO/RTO targets.

### Q129. Cost governance (FinOps)
Tag resources by service/team, show cost per request/tenant, set budgets/alerts, rightsizing, spot/preemptible for stateless workloads, autoscaling policies, retention policies for logs/metrics/traces, consolidate low-traffic services, evaluate serverless/scale-to-zero, review idle environments.

### Q130. Build vs buy within a microservices landscape
Buy/adopt for generic subdomains (identity, payments, email, search, observability); build for core differentiators. Consider lock-in, integration cost, data ownership, compliance, and exit strategies. Wrap vendors behind your own interfaces/adapters.

### Q131. When to go back (re-consolidate services)
If services are always changed/deployed together, have chatty coupling, or one team owns many tiny services with high overhead, merge them (e.g., "macroservices"). Amazon Prime Video's monitoring service move from distributed to monolith shows cost/complexity can drop; the lesson is context-specific design, not dogma.

### Q132. Communicating architecture decisions
Use ADRs, C4 diagrams, sequence diagrams for key flows, a living service catalog, principles ("strong ownership, async by default, consumers tolerate change"), and explain trade-offs and exit paths to stakeholders with data from pilots and incidents.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Two services with REST + events (Order → Notification) using RabbitMQ
```js
// orders/src/server.js
import express from "express";
import amqp from "amqplib";
import { Pool } from "pg";
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express(); app.use(express.json());

app.post("/orders", async (req, res) => {
  const id = crypto.randomUUID();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("INSERT INTO orders(id, user_id, total, status) VALUES ($1,$2,$3,'PENDING')", [id, req.body.userId, req.body.total]);
    await client.query("INSERT INTO outbox(id, type, payload) VALUES ($1,'OrderPlaced',$2)", [crypto.randomUUID(), JSON.stringify({ orderId: id, userId: req.body.userId, total: req.body.total })]);
    await client.query("COMMIT");
    res.status(201).json({ id, status: "PENDING" });
  } catch (e) { await client.query("ROLLBACK"); res.sendStatus(500); } finally { client.release(); }
});

// outbox relay
const conn = await amqp.connect(process.env.AMQP_URL); const ch = await conn.createConfirmChannel();
await ch.assertExchange("events", "topic", { durable: true });
setInterval(async () => {
  const { rows } = await db.query("SELECT * FROM outbox WHERE sent_at IS NULL ORDER BY created_at LIMIT 50");
  for (const r of rows) { ch.publish("events", `order.${r.type}`, Buffer.from(r.payload), { persistent: true, messageId: r.id }); await db.query("UPDATE outbox SET sent_at=now() WHERE id=$1", [r.id]); }
  await ch.waitForConfirms();
}, 500);
app.listen(3000);
```
```js
// notifications/src/consumer.js
const ch = await (await amqp.connect(process.env.AMQP_URL)).createChannel();
await ch.assertExchange("events", "topic", { durable: true });
await ch.assertQueue("notifications.orders", { durable: true });
await ch.bindQueue("notifications.orders", "events", "order.OrderPlaced");
ch.consume("notifications.orders", async (msg) => {
  const id = msg.properties.messageId;
  if (await alreadyProcessed(id)) return ch.ack(msg);                    // inbox dedupe
  await sendEmail(JSON.parse(msg.content.toString())); await markProcessed(id); ch.ack(msg);
});
```

### H2. API gateway with routing, auth and rate limit (Express + http-proxy-middleware)
```js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import { jwtVerify, createRemoteJWKSet } from "jose";
const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL));
const app = express();
app.use(rateLimit({ windowMs: 60_000, limit: 300 }));
app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { payload } = await jwtVerify(token, JWKS, { issuer: process.env.ISSUER, audience: "api" });
    delete req.headers["x-user-id"];                                   // strip spoofable headers
    req.headers["x-user-id"] = payload.sub; req.headers["x-user-roles"] = (payload.roles ?? []).join(",");
    next();
  } catch { res.sendStatus(401); }
});
app.use("/orders", createProxyMiddleware({ target: "http://orders:3000", changeOrigin: true, proxyTimeout: 5000 }));
app.use("/users", createProxyMiddleware({ target: "http://users:3000", changeOrigin: true, proxyTimeout: 5000 }));
app.listen(8080);
```
Internal services accept `x-user-id` only from the gateway (network policy/mTLS), never from the internet.

### H3. HTTP client with timeout, retry, circuit breaker and tracing headers
```js
import CircuitBreaker from "opossum";
import pRetry from "p-retry";

async function getInventory(sku, ctx) {
  return pRetry(async () => {
    const res = await fetch(`${process.env.INVENTORY_URL}/stock/${sku}`, {
      headers: { "x-request-id": ctx.requestId, traceparent: ctx.traceparent },
      signal: AbortSignal.timeout(800),
    });
    if (res.status >= 500) throw new Error(`upstream ${res.status}`);
    if (!res.ok) throw new pRetry.AbortError(`client error ${res.status}`);
    return res.json();
  }, { retries: 2, minTimeout: 100, factor: 2, randomize: true });
}
const breaker = new CircuitBreaker(getInventory, { timeout: 2500, errorThresholdPercentage: 50, resetTimeout: 10_000, volumeThreshold: 10 });
breaker.fallback(() => ({ available: null, degraded: true }));
export const inventoryClient = (sku, ctx) => breaker.fire(sku, ctx);
```

### H4. Kubernetes manifests (Deployment, Service, HPA, probes, PDB)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: orders }
spec:
  replicas: 3
  strategy: { rollingUpdate: { maxUnavailable: 0, maxSurge: 1 } }
  selector: { matchLabels: { app: orders } }
  template:
    metadata: { labels: { app: orders } }
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: orders
          image: registry.example.com/orders:1.4.2
          ports: [{ containerPort: 3000 }]
          envFrom: [{ secretRef: { name: orders-secrets } }, { configMapRef: { name: orders-config } }]
          resources: { requests: { cpu: 200m, memory: 256Mi }, limits: { memory: 512Mi } }
          readinessProbe: { httpGet: { path: /readyz, port: 3000 }, periodSeconds: 5 }
          livenessProbe:  { httpGet: { path: /healthz, port: 3000 }, periodSeconds: 10, failureThreshold: 3 }
          lifecycle: { preStop: { exec: { command: ["sleep", "10"] } } }
---
apiVersion: v1
kind: Service
metadata: { name: orders }
spec: { selector: { app: orders }, ports: [{ port: 80, targetPort: 3000 }] }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: orders }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: orders }
  minReplicas: 3
  maxReplicas: 20
  metrics: [{ type: Resource, resource: { name: cpu, target: { type: Utilization, averageUtilization: 65 } } }]
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: orders }
spec: { minAvailable: 2, selector: { matchLabels: { app: orders } } }
```

### H5. Istio traffic split (canary) and mTLS policy
```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata: { name: orders }
spec:
  hosts: [orders]
  http:
    - route:
        - destination: { host: orders, subset: v1 }
          weight: 90
        - destination: { host: orders, subset: v2 }
          weight: 10
      retries: { attempts: 2, perTryTimeout: 1s, retryOn: 5xx,connect-failure }
      timeout: 3s
---
apiVersion: security.istio.io/v1
kind: PeerAuthentication
metadata: { name: default, namespace: prod }
spec: { mtls: { mode: STRICT } }
```

### H6. Contract test with Pact (consumer side, Node)
```js
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
const provider = new PactV3({ consumer: "checkout-web", provider: "orders-service" });
it("gets an order", async () => {
  provider.given("order 42 exists").uponReceiving("a request for order 42")
    .withRequest({ method: "GET", path: "/orders/42" })
    .willRespondWith({ status: 200, body: { id: "42", status: MatchersV3.string("PENDING"), total: MatchersV3.decimal(99.5) } });
  await provider.executeTest(async (mock) => {
    const order = await new OrdersClient(mock.url).get("42");
    expect(order.id).toBe("42");
  });
});
```
Publish the pact to a broker; the provider's CI verifies it before deploying.

### H7. OpenTelemetry Collector pipeline (config)
```yaml
receivers: { otlp: { protocols: { grpc: {}, http: {} } } }
processors:
  batch: {}
  tail_sampling:
    policies: [ { name: errors, type: status_code, status_code: { status_codes: [ERROR] } }, { name: slow, type: latency, latency: { threshold_ms: 800 } }, { name: sample, type: probabilistic, probabilistic: { sampling_percentage: 5 } } ]
exporters: { otlp/tempo: { endpoint: tempo:4317, tls: { insecure: true } }, prometheus: { endpoint: 0.0.0.0:8889 } }
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [tail_sampling, batch], exporters: [otlp/tempo] }
    metrics: { receivers: [otlp], processors: [batch], exporters: [prometheus] }
```

### H8. Idempotent consumer with inbox table (Postgres)
```sql
CREATE TABLE inbox (message_id uuid PRIMARY KEY, consumer text NOT NULL, processed_at timestamptz DEFAULT now());
```
```js
await db.tx(async (tx) => {
  const r = await tx.query("INSERT INTO inbox(message_id, consumer) VALUES ($1,'billing') ON CONFLICT DO NOTHING", [msg.id]);
  if (r.rowCount === 0) return;                                  // duplicate delivery
  await tx.query("UPDATE invoices SET status='PAID' WHERE order_id=$1 AND status<>'PAID'", [msg.orderId]);
});
```

### H9. Health and graceful shutdown for Kubernetes
```js
let ready = false, shuttingDown = false;
app.get("/healthz", (_q, r) => r.sendStatus(200));
app.get("/readyz", async (_q, r) => (ready && !shuttingDown && (await db.query("SELECT 1").then(() => true).catch(() => false))) ? r.sendStatus(200) : r.sendStatus(503));
const server = app.listen(3000, () => { ready = true; });
process.on("SIGTERM", () => {
  shuttingDown = true;                                           // readiness fails → traffic drains
  setTimeout(() => server.close(async () => { await db.end(); process.exit(0); }), 10_000);
});
```

### H10. GitHub Actions pipeline for one service
```yaml
name: orders-ci
on: { push: { paths: ["services/orders/**"] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm, cache-dependency-path: services/orders/package-lock.json }
      - run: npm ci && npm test
        working-directory: services/orders
      - run: npx pact-broker can-i-deploy --pacticipant orders-service --version ${{ github.sha }} --to-environment prod
      - uses: docker/build-push-action@v6
        with: { context: services/orders, push: true, tags: "ghcr.io/acme/orders:${{ github.sha }}" }
      - run: trivy image --exit-code 1 --severity HIGH,CRITICAL ghcr.io/acme/orders:${{ github.sha }}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. A request is slow but no single service looks slow
Distributed latency adds up; use traces to see the critical path, look for sequential calls that could be parallel, retries/timeouts, N+1 across services, cold starts, DNS or TLS handshakes, queueing at gateways. Check p99 per hop and saturation (thread pools, DB pools).

### D2. Cascading failure after one service degrades
No timeouts/bulkheads, unbounded retries amplify load, thread pools exhausted waiting on the slow dependency. Add timeouts, circuit breakers, limit retries, shed load, and isolate pools per dependency.

### D3. Duplicate orders/payments
At-least-once messaging or client retries without idempotency. Add idempotency keys, inbox/dedupe, unique constraints, and provider idempotency headers.

### D4. Data inconsistent between services
Lost or out-of-order events, failed outbox relay, non-idempotent consumers, missing compensation, or dual writes. Audit event flows, add reconciliation jobs, ordering/version checks, DLQ monitoring.

### D5. Deploy of service A breaks service B
Breaking API/schema change without contract tests. Add consumer-driven contracts, backward-compatible expand/contract, schema registry checks, canaries with SLO guards.

### D6. Pods restart repeatedly (`CrashLoopBackOff`)
Startup errors (missing config/secrets), failing liveness probe (too aggressive or heavy), OOMKilled (memory limit), dependency unreachable at boot. Check `kubectl describe pod`, logs `--previous`, probe settings, resource limits; add startup probes.

### D7. `503`/`upstream connect error` during deployments
Traffic sent to pods not ready or terminating; missing readiness/preStop drain; connection reuse to dead pods. Use readiness probes, `preStop` sleep, `maxUnavailable: 0`, graceful shutdown and retries on idempotent requests.

### D8. DNS/service discovery failures
CoreDNS overload, `ndots` causing excessive lookups, stale caches, wrong namespace/FQDN, network policy blocking DNS. Use FQDNs, tune `ndots`/dnsConfig, scale CoreDNS, node-local DNS cache.

### D9. Gateway returns 401/403 for valid users
Clock skew, JWKS rotation/caching, audience/issuer mismatch, stripped Authorization header by a proxy, missing scopes. Compare token claims vs gateway config, check key rollover, logs with reason codes.

### D10. Message backlog grows
Consumers slow/down, poison message loops, downstream dependency throttling, insufficient partitions/consumers. Scale consumers, fix handler, pause and park poison messages, backpressure the producers. See `038_Message-Queues.md`.

### D11. Database connection exhaustion after scaling out
Each replica opens a full pool; replicas × pool size > DB `max_connections`. Reduce per-pod pool, add PgBouncer/proxy, cap HPA max, use async queues for bursts.

### D12. Trace gaps / orphan spans
Missing context propagation across async boundaries (queues), unsupported library instrumentation, sampling mismatch. Propagate `traceparent` in message headers, use OTel instrumentations, consistent sampling at the collector.

### D13. Config drift between environments
Manual changes in clusters, inconsistent Helm values, secrets edited out-of-band. Move to GitOps, enforce policies, run drift detection and promote the same artifact with environment-specific config.

### D14. "Works in staging, fails in prod"
Data volume, real traffic patterns, network policies, IAM permissions, quotas, feature flags, different dependency versions. Use production-like staging, shadow traffic, canaries and observability before full rollout.

### D15. Retry storm after outage recovery
All clients retry simultaneously, overloading the recovering service. Use exponential backoff + jitter, retry budgets, circuit breaker half-open limits, gradual ramp-up and rate limiting.

---

# 🧩 Part 8: Tricky Questions

### T1. Are microservices always better than monoliths?
No. They solve organizational and scaling problems at the cost of distributed-system complexity. Small teams often move faster with a modular monolith.

### T2. How small should a microservice be?
As small as a team can own and evolve independently around a cohesive business capability, not as small as possible. Too-fine services create "nanoservices" with high overhead.

### T3. Can services share a database if they use different tables?
Technically yes, but it couples them via schema and operations, and often leads to cross-service joins. It's a transitional state at best; prefer ownership by one service.

### T4. Do microservices require Kubernetes?
No. They can run on VMs, ECS, serverless containers, Nomad or PaaS. Kubernetes is popular for orchestration but adds its own complexity.

### T5. Is REST between services enough?
Often yes for simple systems, but synchronous chains reduce availability (availability multiplies). Use async messaging for decoupling and resilience where appropriate.

### T6. Does an API gateway make services secure?
It centralizes edge authentication but doesn't replace service-level authorization, mTLS and network policies. Internal "trust the gateway" designs are fragile.

### T7. Can I get ACID across services?
Not practically. Use sagas and idempotency; keep invariants within a single service where strong consistency is mandatory.

### T8. Is eventual consistency acceptable for payments?
The payment operation itself needs strong consistency inside the payment service (ledger), while downstream views can be eventually consistent. Design UX and reconciliation accordingly.

### T9. Why is "Retry everything" dangerous?
Retries of non-idempotent operations create duplicates, and retry layers multiply load (retry storms). Retry only safe operations with budgets and backoff.

### T10. Is a shared client library a good way to call another service?
It can help with auth/tracing, but forcing all consumers to upgrade in lockstep creates coupling. Keep SDKs thin, versioned and optional; prefer generated clients from contracts.

### T11. Does using Kafka make an architecture event-driven?
Not by itself. Using Kafka as a transport for synchronous-style commands, or as a shared integration database, isn't event-driven design.

### T12. Where do you put cross-service validation (e.g., unique username)?
In the owning service (Identity). Others call its API or maintain eventual copies; enforce uniqueness with DB constraints in the owner.

### T13. Is a distributed trace sampling at 1% enough?
For normal flows maybe; but you also want tail-based sampling to keep errors and slow requests. Choose based on traffic and debugging needs.

### T14. Can I deploy microservices without CI/CD?
Practically no: manual deployments don't scale across many services. Automation is a prerequisite.

### T15. How do you handle shared domain concepts (like "Customer")?
Each bounded context maintains its own representation, linked by a shared ID. Share through events/APIs, not a common entity class.

### T16. Is serverless the same as microservices?
No. Serverless (FaaS) is an execution model; microservices is an architectural style. They can combine, but functions-as-microservices may create excessive fragmentation.

### T17. What's the difference between orchestration in Kubernetes and saga orchestration?
Kubernetes orchestrates containers/infrastructure; saga orchestration coordinates business transactions across services.

### T18. Does adding more services improve resilience?
Not automatically. More network hops increase failure modes. Resilience comes from isolation, timeouts, redundancy and good failure handling.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Microservice definition?** Small, independently deployable service owning its data and a business capability.
- **Bounded context?** Explicit boundary of a domain model (DDD).
- **Database rule?** Database per service.
- **No distributed ACID?** Use sagas + idempotency.
- **Dual-write fix?** Transactional outbox / CDC.
- **Edge component?** API gateway.
- **Client-specific API layer?** BFF.
- **Service discovery in K8s?** Service DNS.
- **East-west security?** mTLS (service mesh).
- **Resilience set?** Timeout, retry (backoff+jitter), circuit breaker, bulkhead.
- **Three pillars?** Logs, metrics, traces.
- **Tracing standard?** OpenTelemetry / W3C traceparent.
- **Contract testing tool?** Pact.
- **Strangler pattern?** Gradually replace monolith behind a facade.
- **Anti-pattern?** Distributed monolith.
- **Deployment strategies?** Rolling, blue/green, canary.
- **GitOps tools?** Argo CD, Flux.
- **Sync protocols?** REST, gRPC.
- **Async tools?** Kafka, RabbitMQ, SQS.
- **Workflow engines?** Temporal, Step Functions, Camunda.
- **Conway's law?** Architecture mirrors team communication.
- **SLO vs SLA?** Target vs contract.
- **Sidecar?** Helper container beside the app.
- **Idempotency key?** Dedupes retried requests.
- **Health probes?** Liveness vs readiness.
- **Start with?** Modular monolith.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a microservices system you built or worked on.
STAR: "I worked on decomposing a monolithic e-commerce backend into 9 services (Catalog, Cart, Order, Payment, Inventory, Notification, Search, Identity, Gateway/BFF). We used the strangler pattern, Kafka with transactional outbox, Temporal for the checkout saga, and OpenTelemetry/Prometheus/Grafana for observability. Deployment frequency went from biweekly to ~30 deploys/day, p95 checkout latency dropped from 2.1 s to 600 ms, and incidents from a single failing module no longer took down the site."

### P2. Describe a time microservices caused problems and how you fixed them.
"Two services shared a database and were deployed in lockstep, causing outages. We introduced an API for the data owner, migrated consumers to it with CDC-fed read models, removed cross-service joins, and added contract tests. Release coordination dropped from days to independent deploys."

### P3. How did you handle a cascading failure?
"A slow recommendation service exhausted the gateway's thread pool. We added 300 ms timeouts, a circuit breaker with cached fallbacks, separate bulkhead pools, and load shedding. A subsequent chaos test showed pages degrading gracefully instead of failing."

### P4. How do you decide service boundaries?
"Event storming with domain experts, mapping capabilities to bounded contexts and team ownership, checking data coupling (what must change together), and validating with sequence diagrams. If two services always change together, I merge them."

### P5. How do you ensure data consistency?
"Single-service ACID for invariants, sagas for cross-service workflows, outbox + idempotent consumers for reliable events, reconciliation jobs, and clear UX for eventual consistency."

### P6. How do you roll out changes safely?
"Backward-compatible expand/contract, contract tests in CI, canary releases with automated SLO checks and rollback, feature flags, and dashboards plus runbooks for each service."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** monolith vs modular monolith vs microservices, benefits/costs, when to adopt, twelve-factor, fallacies of distributed computing.
- **Design:** DDD (bounded contexts, aggregates, context maps), decomposition strategies, event storming, anti-corruption layers, API-first design.
- **Communication:** REST, gRPC, GraphQL/BFF, messaging, events, API gateway, service discovery, load balancing.
- **Data:** database per service, saga, outbox/inbox, CQRS, event sourcing, CDC, reference data, reporting/analytics.
- **Resilience:** timeouts, retries, circuit breakers, bulkheads, rate limiting, load shedding, graceful degradation, chaos engineering.
- **Platform:** containers, Kubernetes, service mesh, GitOps, CI/CD, deployment strategies, feature flags, internal developer platforms.
- **Observability:** structured logs, metrics (RED/USE), distributed tracing (OpenTelemetry), SLOs, alerting, incident management.
- **Security:** zero trust, mTLS, token exchange, secrets, supply chain, network policies, multi-tenancy.
- **Testing:** unit, component, contract (Pact), integration, E2E, chaos, load.
- **Organization:** Conway's law, team topologies, ownership, governance, migration (strangler fig), FinOps, DORA metrics.

## Mixed topics
- Microservices + queues/streams (`038_Message-Queues.md`): events, sagas, outbox, DLQ.
- Microservices + APIs (`035_GraphQL-and-REST-APIs.md`): gateway, BFF, versioning, idempotency.
- Microservices + security (`036_Authentication-and-Security.md`): OAuth2/OIDC, mTLS, zero trust.
- Microservices + realtime (`037_WebSockets-and-Realtime.md`): gateways and fan-out.
- Microservices + databases (`../04_Database/`): polyglot persistence, ORMs, caching, search.
- Microservices + DevOps (`../07_DevOps_and_Cloud/`): Docker, Kubernetes, CI/CD, Terraform, monitoring.
- Microservices + system design (`../09_System_Design/053_System-Design.md`): scaling, availability, trade-offs.
- Microservices + AI: model-serving services, async inference queues, RAG services, tool APIs for agents.

---

# 🔬 Part 12: Architecture Internals

### I1. Kubernetes request path
Client → cloud LB → Ingress/Gateway controller (Envoy/NGINX) → Service (kube-proxy iptables/IPVS or eBPF) → Pod endpoints (EndpointSlices). DNS via CoreDNS resolves `svc.namespace.svc.cluster.local`. With a mesh, sidecar/ambient proxies intercept traffic for mTLS and policy.

### I2. Service mesh data plane vs control plane
Data plane: proxies (Envoy/linkerd2-proxy) handling traffic. Control plane (istiod/Linkerd control plane): distributes config via xDS APIs, issues certificates (SPIFFE), aggregates telemetry. Sidecar injection by mutating admission webhook; ambient mode uses per-node ztunnel and optional waypoint proxies (verify maturity).

### I3. Circuit breaker implementation idea
Sliding window of calls (count or time based) tracking failure/slow-call rate; state machine (closed/open/half-open); open state rejects immediately until a timer expires; half-open permits a limited number of probes. Metrics/events exported for alerting.

### I4. Distributed tracing internals
Each unit of work is a **span** with trace ID, span ID, parent ID, timestamps, attributes. Context propagates in headers (`traceparent: 00-<traceId>-<spanId>-01`) and message headers. Collectors batch/sample/export; backends index by trace ID and attributes.

### I5. Saga state machine persistence
Orchestrators store saga instance state, step results and deadlines in a durable store (DB or workflow history). On crash/restart they resume from the last persisted state; timers trigger compensations for stuck steps; events are deduplicated by message ID.

### I6. Outbox relay via CDC
Debezium reads the DB transaction log, emits row-change events for the `outbox` table (optionally using the outbox event router SMT) to Kafka topics partitioned by aggregate ID, preserving order per aggregate and avoiding polling load.

### I7. Consistency models in practice
Strong (single-node ACID, consensus-backed stores), causal (preserve cause-effect order), eventual (replicas converge), read-your-writes (session guarantees). Microservices mix these: strong within aggregates, eventual across services.

### I8. CAP and PACELC
Under network partition choose consistency or availability (CAP); otherwise trade latency vs consistency (PACELC). Per-service decisions: ledger services prefer consistency; catalog/search prefer availability and latency.

### I9. Cell-based routing
A router (edge or control plane) maps tenant/user IDs to cells via lookup tables or consistent hashing; each cell has independent compute/data; deployments roll cell by cell; failures isolate to one cell; cross-cell operations use asynchronous replication or global services.

---

# 📊 Part 13: Reference Tables

### Architecture styles compared
| | Monolith | Modular monolith | Microservices | Serverless functions |
|---|---|---|---|---|
| Deploy unit | Entire app | Entire app | Per service | Per function |
| Ops complexity | Low | Low | High | Medium (vendor-specific) |
| Team scalability | Low | Medium | High | Medium |
| Latency of calls | In-process | In-process | Network | Network |
| Data | Shared | Shared (separate schemas) | Per service | Per function/service |
| Best for | MVP | Growing products | Large orgs, scale variance | Spiky/event workloads |

### Communication patterns
| Pattern | Coupling | Failure behaviour | Typical use |
|---|---|---|---|
| Sync REST/gRPC | Temporal | Caller affected by callee | Queries, immediate needs |
| Async command (queue) | Low | Buffered | Work distribution |
| Domain event (pub/sub) | Very low | Independent consumers | Integration, projections |
| Request-reply over broker | Medium | Timeouts needed | Rare RPC-style |

### Resilience patterns
| Pattern | Protects against | Tools |
|---|---|---|
| Timeout | Hung calls | HTTP clients, gRPC deadlines |
| Retry + jitter | Transient errors | Polly, Resilience4j, p-retry |
| Circuit breaker | Failing dependencies | opossum, Resilience4j, Envoy |
| Bulkhead | Resource exhaustion | Separate pools/queues |
| Rate limit/shed | Overload | Gateway, mesh, adaptive limits |
| Fallback/cache | Dependency outage | Redis, static defaults |

### Data patterns
| Problem | Pattern |
|---|---|
| Cross-service transaction | Saga |
| Event publish consistency | Outbox / CDC |
| Duplicate handling | Inbox / idempotency keys |
| Cross-service reads | API composition, CQRS views, replication |
| Audit/replay | Event sourcing (selective) |
| Reporting | Stream to warehouse/lakehouse |

### Deployment strategies
| Strategy | Risk | Rollback | Cost |
|---|---|---|---|
| Rolling | Medium | Redeploy previous | Low |
| Blue/green | Low | Switch traffic | 2× capacity |
| Canary | Low | Stop rollout | Needs metrics/automation |
| Shadow | Very low (no user impact) | N/A | Extra traffic cost |

### Version highlights (verify)
| Item | Notes |
|---|---|
| Kubernetes Gateway API | GA core resources; successor to Ingress |
| Istio ambient mesh | Sidecar-less data plane evolving toward GA |
| OpenTelemetry | Traces/metrics stable; logs maturing |
| Dapr | Portable runtime building blocks (pub/sub, state, bindings) |
| Temporal | Durable execution for sagas/workflows |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Service A calls B (99.9% available) and C (99.9%) synchronously for every request.
**Result:** combined availability ≈ 0.999 × 0.999 × A's own ≈ 99.8% or lower; synchronous dependencies multiply failure probability.

### O2.
```js
const breaker = new CircuitBreaker(fn, { errorThresholdPercentage: 50, resetTimeout: 10000 });
// 60% of recent calls fail
```
**Result:** breaker opens; calls fail fast (or use fallback) for 10 s, then enters half-open to test.

### O3.
Order service writes to its DB then publishes an event; the process crashes in between.
**Result:** order exists but event never emitted (dual-write inconsistency). With outbox, the event is stored in the same transaction and published later.

### O4.
A consumer receives `OrderPlaced` twice (redelivery) and increments stock deduction twice.
**Result:** inventory is wrong; fix with idempotent processing (inbox table/unique constraint).

### O5.
Gateway timeout 5 s, service A timeout to B 10 s.
**Result:** client gives up at 5 s while A keeps waiting on B (wasted work). Timeouts must shrink downstream; propagate deadlines.

### O6.
Three retries at each of 3 layers when the last service is down.
**Result:** up to 3×3×3 = 27 calls to the failing service per request (retry amplification).

### O7.
Two services share a table and one adds a NOT NULL column.
**Result:** the other service's inserts fail at runtime; illustrates schema coupling.

### O8.
HPA scales Deployment from 3 to 20 pods; each pod has a pool of 20 DB connections; DB `max_connections=200`.
**Result:** 20×20 = 400 potential connections > 200 → connection errors; reduce pool size or add a pooler.

### O9.
Canary with 10% traffic shows error rate 4% vs baseline 0.5%.
**Result:** automated analysis should halt and roll back the canary before wider rollout.

### O10.
Kubernetes readiness probe fails on a pod.
**Result:** pod stays running but is removed from Service endpoints (no traffic); liveness failure restarts it.

### O11.
`traceparent` header isn't propagated through a message queue.
**Result:** traces split into disconnected pieces; the consumer's spans don't link to the producer's trace.

### O12.
Saga step 3 fails after steps 1-2 succeeded.
**Result:** compensations run in reverse for steps 2 and 1 (e.g., refund payment, release stock) and the saga ends in a failed/cancelled state.

---

# ✅ Part 15: MCQs

**1. A bounded context is:**
A) A database table  B) An explicit boundary within which a domain model is consistent  C) A Kubernetes namespace  D) A load balancer
**Answer: B**

**2. Which pattern avoids dual-write problems?**
A) Circuit breaker  B) Transactional outbox  C) Sidecar  D) BFF
**Answer: B**

**3. What is a "distributed monolith"?**
A) A monolith in the cloud  B) Services tightly coupled and deployed together  C) A large database  D) A serverless app
**Answer: B**

**4. Which is NOT a resilience pattern?**
A) Circuit breaker  B) Bulkhead  C) Shared database  D) Retry with backoff
**Answer: C**

**5. The Strangler Fig pattern is used to:**
A) Secure APIs  B) Incrementally migrate from a monolith  C) Cache data  D) Encrypt traffic
**Answer: B**

**6. Service mesh primarily handles:**
A) UI rendering  B) East-west traffic concerns like mTLS and retries  C) Database indexing  D) DNS registration only
**Answer: B**

**7. A saga is:**
A) A long transaction with distributed ACID  B) A sequence of local transactions with compensations  C) A cache strategy  D) A deployment tool
**Answer: B**

**8. Which testing approach prevents breaking changes between teams?**
A) Only E2E tests  B) Consumer-driven contract tests  C) Manual QA  D) Load tests
**Answer: B**

**9. Conway's law says:**
A) Code must be tested  B) System design mirrors an organization's communication structure  C) Services must be small  D) Databases should be shared
**Answer: B**

**10. Which probe controls whether a pod receives traffic?**
A) Liveness  B) Readiness  C) Startup only  D) Ping
**Answer: B**

**11. Which is the best default starting architecture for a new product with an unclear domain?**
A) 50 microservices  B) Modular monolith  C) Serverless-only  D) Multiple monoliths
**Answer: B**

**12. API gateway vs mesh: gateway mainly manages:**
A) North-south (client → system) traffic  B) Intra-service mTLS only  C) Database replication  D) Container builds
**Answer: A**

**13. Retries are safe when operations are:**
A) Non-idempotent  B) Idempotent  C) Slow  D) Encrypted
**Answer: B**

**14. Which pillar shows a request's path across services?**
A) Logs  B) Metrics  C) Traces  D) Alerts
**Answer: C**

**15. "Database per service" means:**
A) One physical server per service  B) Each service owns its data and exposes it via its API/events  C) Services share tables  D) No databases
**Answer: B**

**16. A canary release:**
A) Replaces all instances at once  B) Sends a small percentage of traffic to the new version first  C) Requires downtime  D) Is only for databases
**Answer: B**

**17. Which tool is typically used for durable workflow orchestration?**
A) Temporal  B) Prometheus  C) Redis  D) Terraform
**Answer: A**

**18. In CQRS, read models are usually updated:**
A) Synchronously in the write transaction always  B) Asynchronously via events  C) Never  D) By the client
**Answer: B**

**19. Which header standard propagates trace context?**
A) `Cache-Control`  B) W3C `traceparent`  C) `ETag`  D) `Origin`
**Answer: B**

**20. Too many tiny services with chatty calls is called:**
A) Modularization  B) Nanoservices anti-pattern  C) CQRS  D) Sharding
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Adopting microservices too early** without domain clarity or platform maturity.
2. **Sharing a database** between services.
3. **Synchronous call chains** (distributed monolith).
4. **No timeouts/circuit breakers/bulkheads**; unbounded retries.
5. **Ignoring idempotency** with at-least-once delivery and retries.
6. **Dual writes** instead of outbox/CDC.
7. **Splitting by technical layers** (UI service, DB service) instead of business capabilities.
8. **Nanoservices** with huge operational overhead.
9. **Shared domain libraries** causing lockstep releases.
10. **No contract testing**; reliance on slow E2E suites.
11. **Missing observability**: no correlation IDs, tracing or SLOs.
12. **Trusting internal traffic** (no mTLS/authz).
13. **Breaking changes without versioning/deprecation.**
14. **Manual deployments and config drift** (no CI/CD/GitOps).
15. **No ownership or on-call** for services.
16. **Underestimating data consistency** and reporting needs.
17. **Not planning migrations** (big-bang rewrites instead of strangler).
18. **Over-engineering with CQRS/event sourcing/service mesh** everywhere.
19. **Ignoring cost** of many small services and observability volume.
20. **Letting each team pick any technology** without platform support.
21. **Forgetting graceful shutdown/readiness**, causing deploy-time errors.
22. **Missing DLQs and reconciliation** for async flows.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You can argue **against** microservices when appropriate and advocate a modular monolith.
- You derive boundaries from **domains, data ownership and team structure**, not technology.
- You design for **failure**: timeouts, retries with budgets, breakers, bulkheads, degradation, chaos tests.
- You solve consistency with **sagas, outbox/inbox, idempotency and reconciliation**, and explain eventual-consistency UX.
- You run services with **observability and SLOs**, and use contract tests to enable independent releases.
- You understand **platform concerns**: Kubernetes, mesh, GitOps, progressive delivery, secrets, supply-chain security.
- You think about **people and process**: Conway's law, team topologies, ownership, cognitive load, governance.
- You plan **migrations incrementally** (strangler fig, ACLs, data splitting) and measure outcomes (DORA).
- You manage **cost and complexity** deliberately.
- You bring concrete numbers and incident learnings.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Principles
```
Start modular-monolith • boundaries = bounded contexts • service owns its data
Async by default across contexts • sync only for immediate queries
Assume failure: timeout + retry(backoff, jitter, budget) + circuit breaker + bulkhead
Idempotent everything • outbox + inbox • sagas for workflows
Observe everything: logs + metrics + traces + SLOs • automate CI/CD (GitOps)
Zero trust: mTLS + authZ in every service • contract tests • expand/contract migrations
```

### Pattern quick picks
Cross-service workflow → Saga (Temporal for complex) • Reliable events → Outbox + Kafka/RabbitMQ • Cross-service reads → CQRS views / API composition • Edge concerns → API Gateway + BFF • East-west concerns → Service mesh • Legacy migration → Strangler fig + ACL • Safe release → Canary + feature flags • Uniform start → Service template/golden path.

### Operations checklist
Health/readiness probes • graceful shutdown • HPA/KEDA • resource limits • PDBs • NetworkPolicies • secrets in vault • structured logs with request IDs • OpenTelemetry tracing • RED dashboards + SLO alerts • runbooks + on-call • DLQ monitoring • backups/DR tested.

### Interview strategy
1. Clarify business domain, team size, scale and maturity.
2. Propose boundaries (bounded contexts) and data ownership.
3. Describe communication (sync vs async) with a key flow (sequence diagram).
4. Address consistency (saga/outbox/idempotency) and failure handling.
5. Cover platform: deployment, observability, security.
6. Discuss trade-offs, migration path and when *not* to split.
7. Close with metrics (latency, availability, deploy frequency) from real experience.

### Final checklist before the interview
- [ ] Explain monolith vs modular monolith vs microservices and adoption criteria.
- [ ] Identify bounded contexts and design services with their own data.
- [ ] Choose REST/gRPC/events appropriately; explain gateway, BFF, discovery.
- [ ] Explain sagas, outbox/inbox, CQRS, event sourcing and eventual consistency.
- [ ] List and apply resilience patterns; explain retry amplification and deadlines.
- [ ] Describe observability (logs/metrics/traces), SLOs and incident handling.
- [ ] Explain Kubernetes, service mesh, CI/CD, GitOps and deployment strategies.
- [ ] Cover security: OAuth2/OIDC at edge, mTLS, authorization per service, zero trust.
- [ ] Explain contract testing, versioning and backward-compatible migrations.
- [ ] Prepare a migration story (strangler fig) and an incident story with metrics.
