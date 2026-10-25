# System Design Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide covers high-level design (HLD) and the building blocks behind it, as asked in interviews in 2025–2026: scalability, load balancing, caching, databases (SQL, NoSQL, sharding, replication), consistency (CAP, PACELC), messaging and streaming, API design, rate limiting, consistent hashing, storage and CDN, microservices, reliability, security, observability and cost. It includes about 20 classic case studies (URL shortener, chat, news feed, video streaming, payments, and more). Numbers (latency, throughput, storage) are rough interview estimates, not benchmarks: verify them for your hardware and cloud. Examples use the sample name **Ritesh Kumar** and TypeScript or SQL for small code samples.
> This file covers requirement gathering, back-of-envelope estimation, scaling patterns, data modelling, caching strategies, sharding and replication, consistency models, queues and event streaming, search, real-time systems, geo and media systems, distributed-systems theory (consensus, clocks, idempotency, sagas), reliability patterns, security, and a repeatable interview framework. Related topics: Databases in `../04_Database/`, Redis in `../04_Database/031_Redis-and-Caching.md`, Elasticsearch in `../04_Database/032_Elasticsearch.md`, REST/GraphQL in `../03_Backend/035_GraphQL-and-REST-APIs.md`, WebSockets in `../03_Backend/037_WebSockets-and-Realtime.md`, message queues in `../03_Backend/038_Message-Queues.md`, microservices in `../03_Backend/039_Microservices.md`, Kubernetes in `../07_DevOps_and_Cloud/046_Kubernetes.md`, cloud in `../07_DevOps_and_Cloud/048_AWS.md`, monitoring in `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`, OOP/design patterns (low-level design) in `../08_CS_Fundamentals/023_OOP-and-Design-Patterns.md`.

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
- [Part 12: Internals](#-part-12-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is system design? *(Must-know)*
Deciding how the parts of a software system (clients, servers, databases, caches, queues, networks) fit together so it meets its requirements: functional (what it does) and non-functional (speed, scale, availability, cost, security). HLD is the big picture; LLD (low-level design) is classes and code structure.

### Q2. Functional vs non-functional requirements *(Must-know)*
- **Functional:** "A user can post a photo and see a feed."
- **Non-functional:** latency (p99 < 300 ms), availability (99.95%), scale (10M daily users), durability (never lose a payment), consistency, security, cost.
Always ask for both at the start of an interview.

### Q3. Client-server model and the request path
Browser → DNS → CDN/edge → load balancer → web/app servers → cache → database. Each hop adds latency and a possible failure point. Knowing this path lets you explain where to add caching, retries and scaling.

### Q4. What is scalability? Vertical vs horizontal *(Must-know)*
- **Vertical (scale up):** bigger machine. Simple, but has a limit and is a single point of failure.
- **Horizontal (scale out):** more machines behind a load balancer. Needs **stateless** servers, but scales almost without limit.

### Q5. What is a load balancer?
Spreads requests over many servers, runs health checks, and removes bad servers. **L4** works on TCP/UDP (fast); **L7** works on HTTP (routing by path, header, cookie, TLS termination). Examples: NGINX, HAProxy, Envoy, AWS ALB/NLB.

### Q6. Load-balancing algorithms
Round robin, weighted round robin, least connections, least response time, IP hash / consistent hash (sticky), random with two choices ("power of two choices"). Pick least-connections for uneven request cost; hashing for cache affinity.

### Q7. Stateless vs stateful servers
Stateless servers keep no user data between requests (session lives in a shared store like Redis or in a signed token like JWT). Any server can handle any request, so scaling and failover are easy.

### Q8. What is latency, throughput and bandwidth?
Latency: time for one request. Throughput: requests (or bytes) per second. Bandwidth: maximum data rate of a link. A system can have high throughput and bad latency, and the reverse.

### Q9. What is availability? The nines *(Must-know)*
Share of time the system works. 99.9% ≈ 8.76 h downtime/year; 99.99% ≈ 52.6 min; 99.999% ≈ 5.26 min. Availability of serial components multiplies (0.999 × 0.999 ≈ 0.998); redundancy in parallel raises it.

### Q10. Reliability vs availability vs durability
Reliability: works correctly. Availability: is reachable. Durability: data is not lost once acknowledged (replication, backups, disk RAID, multi-AZ).

### Q11. What is caching and why use it? *(Must-know)*
Keeping copies of frequently read data in fast storage (memory) to cut latency and database load. Layers: browser, CDN, API gateway, application cache (Redis/Memcached), database buffer pool.

### Q12. Cache strategies
- **Cache-aside (lazy loading):** app checks cache; on miss reads DB and fills cache. Most common.
- **Read-through:** cache itself loads from DB.
- **Write-through:** write to cache and DB together; consistent but slower writes.
- **Write-back (write-behind):** write to cache, flush to DB later; fast but risk of data loss.
- **Write-around:** write to DB only; cache fills on read.

### Q13. Cache eviction policies
LRU (least recently used), LFU (least frequently used), FIFO, TTL expiry, random. LRU is the default choice for most workloads.

### Q14. What is a CDN?
A network of edge servers that cache static content (images, JS, video) near users. It cuts latency and origin load. Use `Cache-Control`, `ETag` and versioned file names for control. See `../01_Website/007_Web-Performance-and-Browser-Internals.md`.

### Q15. SQL vs NoSQL *(Must-know)*
| Aspect | SQL (relational) | NoSQL |
|---|---|---|
| Model | Tables, joins, schema | Key-value, document, column, graph |
| Transactions | Strong ACID | Varies; often limited |
| Scaling | Vertical + read replicas; sharding is harder | Built for horizontal scale |
| Use | Orders, payments, strongly related data | Huge scale, flexible schema, simple access patterns |
Choose by **access patterns and consistency needs**, not fashion.

### Q16. ACID vs BASE
ACID: Atomicity, Consistency, Isolation, Durability (classic databases). BASE: Basically Available, Soft state, Eventual consistency (many distributed NoSQL systems).

### Q17. What is database indexing?
A data structure (B-tree, hash, LSM) that speeds up lookups at the cost of write time and storage. Index columns used in `WHERE`, `JOIN`, `ORDER BY`. See `../04_Database/026_SQL.md`.

### Q18. What is replication?
Copying data to other nodes. **Leader-follower**: writes go to leader, reads can go to followers (scale reads, failover). **Multi-leader** and **leaderless** (Dynamo-style) allow writes in many places but need conflict handling.

### Q19. What is sharding (partitioning)? *(Must-know)*
Splitting data across machines so each holds a part. Strategies: **range** (by key range), **hash** (by hash of key), **directory/lookup**, **geo**. Brings scale but complicates joins, transactions and rebalancing.

### Q20. What is a message queue and why use one?
A buffer between producers and consumers (SQS, RabbitMQ, Kafka). It decouples services, smooths traffic spikes, allows retries and async work. See `../03_Backend/038_Message-Queues.md`.

### Q21. What is an API? REST basics
A contract for how clients talk to a service. REST uses HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and resources (`/users/42`). Use proper status codes, pagination, and versioning. See `../03_Backend/035_GraphQL-and-REST-APIs.md`.

### Q22. What is idempotency?
Doing an operation many times gives the same result as once. `GET`, `PUT`, `DELETE` are idempotent; `POST` is not by default. Use an **idempotency key** for payments and order creation so retries are safe.

### Q23. What is a single point of failure (SPOF)?
Any component whose failure stops the system (one DB, one load balancer). Remove SPOFs with redundancy across servers and availability zones.

### Q24. What is a microservice vs a monolith?
Monolith: one deployable unit; simpler to build and test. Microservices: many small services, independently deployed and scaled; more operational complexity. Start with a well-structured monolith unless you have a clear need. See `../03_Backend/039_Microservices.md`.

### Q25. What is DNS and how does it help scale?
Maps names to IPs. Use DNS for geo routing, failover and load distribution (weighted/latency-based records). Keep TTL sensible; DNS caching delays changes.

### Q26. Reverse proxy vs forward proxy
Reverse proxy sits in front of servers (TLS, caching, routing, load balancing). Forward proxy sits in front of clients (anonymity, filtering). NGINX is typically a reverse proxy.

### Q27. What is rate limiting?
Capping how many requests a client can make in a time window to protect services from abuse and overload. Return `429 Too Many Requests` with `Retry-After`. Algorithms in Q62.

### Q28. What is the CAP theorem? *(Must-know)*
In a distributed data store, during a **network partition** you must choose between **Consistency** (every read sees the latest write) and **Availability** (every request gets a response). Partitions happen, so the real choice is C or A *when partitioned*. CP: ZooKeeper, etcd, HBase. AP: Cassandra, DynamoDB (default), Riak.

### Q29. Eventual vs strong consistency
Strong: after a write, all readers see it. Eventual: replicas converge over time; readers may see stale data briefly. Use strong for money and inventory counts; eventual for feeds, likes, view counts.

### Q30. How do you start a system design interview? *(Must-know)*
1. Clarify requirements and scope (users, features, scale). 2. Estimate load and storage. 3. Define APIs and data model. 4. Draw high-level architecture. 5. Deep-dive on bottlenecks. 6. Discuss trade-offs, failure handling, monitoring and cost. Keep talking and ask for feedback.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Back-of-envelope estimation *(Must-know)*
Useful numbers: 1 day ≈ 86,400 s (~10^5); 1M requests/day ≈ 12 QPS; 1B/day ≈ 12k QPS; peak ≈ 2–5× average. Storage: 1 KB × 1M = 1 GB; 1 KB × 1B = 1 TB. Example: 100M DAU × 10 reads/day = 10^9 reads/day ≈ 12k QPS average, ~50k QPS peak.

### Q32. Latency numbers every engineer should know (approx.)
| Operation | Time |
|---|---|
| L1/L2 cache | 1–4 ns |
| Main memory read | ~100 ns |
| SSD random read | ~100 µs |
| Same data-centre round trip | ~0.5 ms |
| HDD seek | ~10 ms |
| Cross-continent round trip | ~100–150 ms |
Memory is ~1000× faster than SSD access and ~10^5× faster than a cross-continent call.

### Q33. Design a URL shortener *(Must-know)*
- **Requirements:** create short link, redirect, optional custom alias, expiry, analytics. 100M new URLs/month, 100:1 read:write.
- **Estimate:** 40 writes/s, ~4k reads/s; 5 years ≈ 6B URLs × 500 B ≈ 3 TB.
- **ID generation:** 7 chars base62 = 62^7 ≈ 3.5 trillion. Options: counter + base62 (needs distributed counter, e.g., ranges per server), hash + collision check, or Snowflake-like ID.
- **Storage:** key-value (DynamoDB/Cassandra) `short → long`; or SQL with unique index.
- **Read path:** CDN/cache (Redis) first, DB on miss; return `301` (cacheable) or `302` (if you need analytics per click).
- **Scale:** cache hot keys, shard by short key hash, async analytics via queue.
- **Pitfalls:** guessable IDs, abuse/malware links, expiry cleanup.

### Q34. Design a rate limiter *(Must-know)*
Where: API gateway or middleware. Store counters in Redis. Algorithms:
- **Token bucket:** tokens refill at rate r, bucket size b; allows bursts. Common.
- **Leaky bucket:** constant outflow; smooths traffic.
- **Fixed window counter:** simple, but allows 2× burst at window edges.
- **Sliding window log:** precise, high memory.
- **Sliding window counter:** weighted blend of two windows; good trade-off.
Use atomic Lua scripts in Redis, key by user/IP/API key, return headers `X-RateLimit-Remaining`, handle distributed sync and failure mode (fail-open vs fail-closed).

### Q35. Consistent hashing *(Must-know)*
Map servers and keys onto a ring using a hash; a key goes to the next server clockwise. Adding/removing a server moves only about `1/N` of the keys (versus nearly all with `hash % N`). **Virtual nodes** (many ring positions per server) balance load. Used by Dynamo, Cassandra, memcached clients, CDNs.

### Q36. Design a key-value store
Components: partitioning (consistent hashing), replication (N replicas, preference list), consistency tuning (quorum `W + R > N`), versioning (vector clocks or last-write-wins), failure handling (hinted handoff, anti-entropy using Merkle trees, gossip for membership), storage engine (LSM tree: memtable, WAL, SSTables, compaction, bloom filters).

### Q37. Design a unique ID generator
Options: UUID v4 (no coordination, 128-bit, poor index locality), UUID v7/ULID (time-ordered), DB auto-increment per shard (needs ranges), ticket servers, **Snowflake**: 41-bit timestamp + 10-bit machine id + 12-bit sequence → ~4096 IDs/ms/machine, roughly sortable. Watch clock skew and machine-id assignment.

### Q38. Design a pastebin / file text sharing
Similar to URL shortener: generate key, store content in object storage (S3) with metadata in DB, CDN for reads, expiry via TTL/lifecycle rules, size limits and abuse scanning.

### Q39. Pagination approaches
Offset (`LIMIT 20 OFFSET 1000`): simple, slow for big offsets and unstable when data changes. **Cursor/keyset** (`WHERE id < :last ORDER BY id DESC LIMIT 20`): fast and stable. Return `next_cursor` opaque tokens.

### Q40. Database indexing deep points
Composite index order matters (leftmost prefix); covering indexes avoid table lookups; indexes slow writes; low-cardinality columns benefit little; use `EXPLAIN` to verify. LSM trees favour writes; B-trees favour reads and range scans.

### Q41. Read replicas and replication lag
Reads from followers may be stale. Mitigate with **read-your-writes** (route a user's reads to leader for a short time after write), monotonic reads (stick to one replica), or version tokens. Never read-then-write using a stale replica.

### Q42. Caching problems: stampede, penetration, avalanche
- **Cache stampede (thundering herd):** many requests miss at once after expiry. Fix with request coalescing/locking, stale-while-revalidate, jittered TTL.
- **Cache penetration:** queries for non-existent keys hit DB each time. Fix with negative caching or a Bloom filter.
- **Cache avalanche:** many keys expire together. Fix with TTL jitter, multi-level caches, warmup.

### Q43. Cache invalidation
"There are only two hard things…" Options: TTL (simple, bounded staleness), explicit delete on write (cache-aside), event-driven invalidation (CDC/Kafka), versioned keys (`user:42:v7`). Prefer short TTL + delete-on-write.

### Q44. Hot key problem
One key gets huge traffic (celebrity profile). Fixes: local in-process cache, replicate hot key across several cache nodes (`key#1..#N`), request coalescing, CDN caching, or sharding the counter.

### Q45. Pub/Sub vs queue
Queue: each message processed by one consumer (work distribution). Pub/Sub: each subscriber group gets a copy (fan-out). Kafka does both with consumer groups.

### Q46. Delivery guarantees
At-most-once (may lose), at-least-once (may duplicate; most common), exactly-once (only within a system with transactions/idempotent producers; end-to-end needs idempotent consumers). Design consumers to be **idempotent**.

### Q47. Dead-letter queue (DLQ) and retries
After N failed attempts send the message to a DLQ for inspection. Use exponential backoff with jitter, a retry limit, and alerts on DLQ depth.

### Q48. Design a notification system
Channels: push, SMS, email, in-app. Flow: event → notification service → user preferences + templates → per-channel queues → workers → providers (FCM/APNs, Twilio, SES). Needs dedup, rate limiting per user, retries, priority queues, quiet hours, delivery tracking and unsubscribe.

### Q49. Design a web crawler
Seed URLs → frontier queue (priority, politeness per host) → fetchers → parser → dedup (URL normalization + Bloom filter, content hash) → storage → link extractor back to frontier. Respect `robots.txt`, rate limit per domain, handle traps and DNS caching, distribute by host hash.

### Q50. API gateway
Single entry point: auth, rate limiting, routing, TLS, request/response transformation, caching, metrics. Examples: Kong, AWS API Gateway, Envoy. Avoid putting business logic inside.

### Q51. Authentication vs authorization; sessions vs tokens
AuthN: who you are; AuthZ: what you can do. Sessions: server-side state (cookie id → Redis). Tokens (JWT): self-contained, stateless; hard to revoke (use short life + refresh tokens + denylist). See `../03_Backend/036_Authentication-and-Security.md`.

### Q52. Object storage vs block vs file storage
Object (S3): huge scale, cheap, HTTP API, immutable objects; for media, backups. Block (EBS): low-latency disks for databases. File (EFS/NFS): shared POSIX file system. Never store large blobs in your relational DB.

### Q53. Designing for failure basics
Timeouts everywhere, retries with backoff and jitter, circuit breakers, bulkheads, health checks, graceful degradation, multi-AZ deployment, backups and tested restores.

### Q54. Push vs pull; polling vs long polling vs WebSockets vs SSE
Polling: simple, wasteful. Long polling: server holds request until data. SSE: server-to-client stream over HTTP. WebSockets: full-duplex persistent connection (chat, games). See `../03_Backend/037_WebSockets-and-Realtime.md`.

### Q55. Design a simple chat application *(Must-know)*
Clients connect via WebSocket to gateway servers; a presence/session store (Redis) maps user → gateway; messages go through a message service that persists them (Cassandra/DynamoDB keyed by conversation + time) and routes to recipients' gateways via pub/sub; offline users receive push notifications and sync on reconnect using last-seen message id. Group chat: fan-out on write for small groups, limit large groups. Delivery states: sent, delivered, read. Use message ids and ordering per conversation.

### Q56. Denormalization
Duplicating data to avoid joins and speed reads (store `author_name` on posts). Trade-off: more storage and update complexity. Common in NoSQL and read-heavy systems.

### Q57. Hashing vs encryption vs encoding
Hash: one-way (passwords with bcrypt/argon2, integrity). Encryption: reversible with a key (TLS, data at rest). Encoding: format change only (base64). Do not confuse them.

### Q58. Time-to-live (TTL) and data retention
Define how long data lives to control cost and risk (logs 30 days, sessions 24 h). Use storage tiers (hot, warm, cold/archive) and lifecycle rules.

### Q59. Serialization formats
JSON (readable, bigger), Protocol Buffers/Avro/Thrift (compact, schema, fast), MessagePack. Use gRPC with protobuf for internal services; REST/JSON for public APIs. Plan for schema evolution (add optional fields, never reuse tags).

### Q60. Basic capacity planning
Estimate peak QPS, per-server capacity (load test), add headroom (30–50%), plan N+1 or N+2 redundancy, autoscale on CPU/queue depth, and check database limits (connections, IOPS) before app limits.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Design a news feed / timeline *(Must-know)*
- **Fan-out on write (push):** when a user posts, write the post id to followers' feed lists (Redis list/sorted set). Fast reads, expensive for users with millions of followers.
- **Fan-out on read (pull):** compute feed at read time by merging followed users' posts. Cheap writes, slow reads.
- **Hybrid:** push for normal users, pull for celebrities, merge at read time.
- Store posts in a sharded DB, feed ids in cache, media in object storage + CDN; rank with a ranking service; paginate by cursor; cache aggressively; handle deletes and privacy filters.

### Q62. Rate limiter algorithms in detail
Token bucket in Redis (Lua for atomicity):
```lua
-- KEYS[1]=bucket key; ARGV: rate, capacity, now, cost
local data = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(data[1]) or tonumber(ARGV[2])
local ts = tonumber(data[2]) or tonumber(ARGV[3])
tokens = math.min(tonumber(ARGV[2]), tokens + (tonumber(ARGV[3]) - ts) * tonumber(ARGV[1]))
local allowed = tokens >= tonumber(ARGV[4])
if allowed then tokens = tokens - tonumber(ARGV[4]) end
redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', ARGV[3])
redis.call('EXPIRE', KEYS[1], 3600)
return allowed and 1 or 0
```
Use per-user, per-IP and per-endpoint limits; local counters + periodic sync for very high QPS.

### Q63. Design Instagram / photo sharing
Upload: client → API → object storage (pre-signed URL) → async workers (resize, thumbnails, moderation) → metadata DB. Feed: hybrid fan-out. Media delivery via CDN with multiple resolutions. Likes/comments counters via sharded counters or approximate counts. Search via Elasticsearch. Storage estimate: 100M photos/day × 2 MB ≈ 200 TB/day raw (needs tiering and compression).

### Q64. Design YouTube / video streaming *(Must-know)*
Upload to object storage → transcoding pipeline (queue + workers) producing multiple bitrates/codecs, split into segments (HLS/DASH) → store in object storage → CDN delivery with adaptive bitrate (client chooses quality). Metadata in SQL/NoSQL, search index, recommendations offline + online, view count via stream aggregation. Handle large uploads (chunked, resumable), copyright checks, and cost (egress is the largest bill; use CDN and tiered storage).

### Q65. Design a ride-hailing service (Uber)
Drivers send location every few seconds → location service (in-memory geo index: geohash/quadtree/S2/H3) → matching service finds nearby drivers, ranks by ETA, and offers rides → trip service (state machine) → pricing (surge via demand/supply per cell) → payments. Use WebSockets/push for live updates, Kafka for events, and shard by city/geocell.

### Q66. Geospatial indexing
Geohash (string prefix = area; edge cases at borders), quadtree (adaptive), S2/H3 (hex cells, uniform neighbours). Query: find cell + neighbouring cells, then filter by distance. Redis `GEOADD/GEOSEARCH`, PostGIS for relational.

### Q67. Design a distributed cache
Partition with consistent hashing, replicate for availability, choose eviction (LRU), handle hot keys, client-side vs proxy-based routing (Twemproxy, Redis Cluster slots 16384), warmup, monitoring of hit ratio, and cache-aside from services.

### Q68. Design a search autocomplete (typeahead)
Trie or prefix index of popular queries with scores; precompute top-K suggestions per prefix and store in a fast store (Redis/Elasticsearch/in-memory); update offline from query logs (batch + streaming); serve in < 100 ms with CDN/local caching; filter offensive terms; personalise lightly. Debounce on the client.

### Q69. Design a distributed message queue / Kafka-like log
Topics split into partitions (ordered append-only logs), replicated with leader/followers (ISR), producers choose partition by key, consumers in groups track offsets, retention by time/size, log compaction for latest-per-key. Throughput from sequential disk I/O and batching. Ordering only within a partition.

### Q70. Design a payment system *(Must-know)*
Key ideas: **idempotency keys** per payment attempt; a **ledger** with double-entry records (immutable, append-only); payment state machine (created → authorized → captured → settled/refunded); talk to PSPs (Stripe/Adyen) via async webhooks with signature verification; reconciliation jobs against PSP reports; strong consistency in the ledger DB; outbox pattern to publish events; PCI scope reduction by tokenization. Never store raw card numbers.

### Q71. Outbox pattern and CDC
Write the business change and an "event" row in the same DB transaction (outbox table); a relay (poller or Debezium CDC) publishes to Kafka. Gives reliable event publication without distributed transactions. Consumers must be idempotent.

### Q72. Saga pattern
Long-running business transaction as a sequence of local transactions with **compensating actions** if a step fails (book flight → book hotel → charge card; undo on failure). **Choreography** (events) or **orchestration** (a coordinator). Compare with 2PC: sagas are available and scalable but eventually consistent.

### Q73. Two-phase commit (2PC) vs sagas
2PC: coordinator asks participants to prepare then commit; strong consistency but blocking and poor availability under failure. Sagas: no global lock; accept intermediate states. Use 2PC only inside small trusted systems.

### Q74. Event sourcing and CQRS
Event sourcing: store every change as an event; state = replay of events (audit, time travel). CQRS: separate write model and read models (projections tailored for queries). Benefits: audit and scalable reads. Costs: complexity, eventual consistency, schema evolution of events.

### Q75. Database sharding in practice
Pick a shard key with high cardinality and even distribution that matches query patterns (user_id). Problems: cross-shard joins/transactions, hot shards, resharding. Solutions: consistent hashing, many logical shards mapped to few physical nodes, a routing layer, global secondary indexes, and avoiding sequential keys.

### Q76. Choosing a database *(Must-know)*
| Need | Candidate |
|---|---|
| Transactions, relations | PostgreSQL / MySQL |
| Huge write throughput, simple access by key | Cassandra / DynamoDB |
| Flexible documents | MongoDB |
| Cache / counters / leaderboards | Redis |
| Full-text search | Elasticsearch / OpenSearch |
| Time series | InfluxDB / TimescaleDB / Prometheus |
| Graph relations | Neo4j |
| Analytics (OLAP) | BigQuery / Snowflake / ClickHouse |
| Blobs | S3 / GCS |
Often a system uses several (polyglot persistence). See `../04_Database/`.

### Q77. OLTP vs OLAP; data pipelines
OLTP: many small transactions. OLAP: large analytical scans, columnar storage. Move data with CDC/ETL/ELT into a warehouse/lake; lambda (batch + stream) vs kappa (stream only) architectures.

### Q78. Batch vs stream processing
Batch (Spark, MapReduce): large data, high latency, simple. Stream (Flink, Kafka Streams, Spark Streaming): low latency, windows, state, exactly-once semantics with care. Use stream for fraud detection, live metrics.

### Q79. Design a leaderboard
Redis sorted sets (`ZADD`, `ZREVRANGE`, `ZRANK`) for top-N and rank; shard by game/region; periodic persistence to DB; for huge scale use score buckets and approximate ranks; handle ties with composite scores.

### Q80. Design a distributed lock / leader election
Use ZooKeeper/etcd (consensus-based), or Redis with `SET key value NX PX ttl` plus fencing tokens. Locks with TTL can expire while the holder is paused (GC), so add **fencing tokens** to protect downstream resources. Prefer avoiding locks via idempotency and partitioning.

### Q81. Consensus: Paxos and Raft (concept)
Nodes agree on a log of operations despite failures: elected leader replicates entries to a majority before commit. Tolerates `f` failures with `2f+1` nodes. Used in etcd, Consul, CockroachDB, Kafka KRaft. Interview level: explain leader election, term, majority quorum.

### Q82. Quorum reads/writes
With N replicas, write to W and read from R. If `W + R > N`, reads overlap with the latest write. Examples N=3: W=2,R=2 (balanced); W=3,R=1 (read-heavy); W=1,R=3 (write-heavy). Quorums do not by themselves guarantee linearizability.

### Q83. Clocks and ordering
Physical clocks drift. Use **logical clocks** (Lamport), **vector clocks** (detect concurrency), **hybrid logical clocks**, or TrueTime (Spanner). Do not rely on wall clock for ordering across machines.

### Q84. Bloom filter and other probabilistic structures
Bloom filter: set membership with no false negatives and tunable false positives (skip disk lookups, dedup crawler URLs). HyperLogLog: approximate unique counts. Count-Min Sketch: approximate frequencies. Great for scale at tiny memory cost.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design a global, highly available web platform *(Must-know)*
- **Edge:** DNS (latency/geo routing), CDN, WAF.
- **Compute:** stateless services across ≥3 AZs per region, autoscaling, blue/green or canary deploys.
- **Data:** primary region for strong-consistency data, cross-region replication; regional read replicas; global tables for eventual-consistency data.
- **Async:** queues/streams for decoupling; outbox for events.
- **Resilience:** timeouts, retries with jitter, circuit breakers, load shedding, graceful degradation, chaos tests.
- **Ops:** SLOs, tracing, runbooks, DR drills with explicit RPO/RTO.
- **Trade-off:** active-active gives low latency and DR but needs conflict resolution; active-passive is simpler with slower failover.

### Q86. RPO and RTO; DR strategies
RPO: how much data loss is acceptable. RTO: how long to recover. Strategies by cost: backup & restore (hours), pilot light, warm standby, active-active (minutes/seconds). Choose per system tier.

### Q87. Multi-region data: conflict resolution
Last-write-wins (simple, loses data), version vectors with app merge, CRDTs (counters, sets that merge without conflict), or route each record to a "home region" (single writer). Pick based on data type and business tolerance.

### Q88. PACELC
If there is a partition (P), choose A or C; Else (E), choose Latency or Consistency. Explains why systems such as DynamoDB/Cassandra trade consistency for latency even without partitions, and why Spanner pays latency for consistency.

### Q89. Consistency models spectrum
Linearizable (strongest) → sequential → causal → read-your-writes / monotonic reads → eventual. Know where your datastore sits and what the product needs. Causal consistency keeps cause-effect order (comment after the post it replies to).

### Q90. Isolation levels and anomalies
Read uncommitted, read committed, repeatable read, snapshot, serializable. Anomalies: dirty read, non-repeatable read, phantom, write skew. Use serializable (or explicit locking / `SELECT … FOR UPDATE`) for money and inventory.

### Q91. Handling overselling in inventory / ticket booking
Options: DB row lock with conditional update (`UPDATE stock SET qty = qty - 1 WHERE id = ? AND qty > 0`), reservation with TTL (hold seat for 10 minutes), queue requests per item (single writer), optimistic concurrency with version column. For flash sales add a waiting room and rate limit before the DB.

### Q92. Design a ticket booking system (BookMyShow)
Seat map in DB; reservation record with expiry; payment flow with idempotency; seat state machine (available → held → booked); locks via conditional updates per seat; scale reads via cache and push seat updates via SSE; flash-sale protection via virtual queue; cleanup job releases expired holds.

### Q93. Design Google Drive / Dropbox
Client chunks files (4 MB), hashes each chunk (dedup), uploads chunks to object storage, metadata service tracks file → chunk list and versions in a sharded DB; sync service notifies other clients via long-poll/WebSocket; delta sync sends only changed chunks; sharing permissions via ACLs; conflict handling creates conflicted copies; cold data tiering.

### Q94. Design Twitter/X search or log search
Ingest via Kafka → indexers → sharded inverted index (Elasticsearch/Lucene), time-based indices with ILM, query fan-out to shards and merge, near-real-time refresh (1 s), ranking by recency + relevance, caches for hot queries. See `../04_Database/032_Elasticsearch.md`.

### Q95. Design a monitoring/metrics system
Agents/SDKs push or pull metrics → collectors → stream (Kafka) → time-series DB (sharded, downsampled) → query engine → dashboards/alerts. Handle cardinality, retention tiers and alert evaluation reliability. See `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`.

### Q96. Design a real-time collaborative editor (Google Docs)
Operational Transformation (server orders operations and transforms concurrent ones) or CRDTs (Yjs, Automerge) that merge without a central order. WebSocket per document session, document sharding by id, periodic snapshots + operation log, presence/cursors via ephemeral channel, offline editing support with CRDT merge.

### Q97. Backpressure and load shedding
When consumers are slower than producers: bounded queues, reject early (429/503), shed low-priority work, adaptive concurrency limits, and drop or sample non-critical data. Unbounded queues only move failure later and increase latency.

### Q98. Retry storms and circuit breakers
Retries multiply load during outages (3 retries across 3 layers = 27×). Use retry budgets, exponential backoff with jitter, retry only idempotent calls at one layer, and circuit breakers (closed → open → half-open) to fail fast and let services recover.

### Q99. Zero-downtime deployments and schema migrations
Blue/green, canary, rolling. For DB: **expand → migrate → contract** (add nullable column, dual write, backfill, switch reads, remove old). Keep backward-compatible APIs for at least one release. Feature flags decouple deploy from release.

### Q100. Design for observability and SLOs
Define SLIs per user journey, instrument with OpenTelemetry, use RED/USE dashboards, correlation ids across services, burn-rate alerts, and runbooks. Reliability work is prioritized by error budget. See `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you approach a new large system design? *(Must-know)*
1. Understand business goals and constraints (time, team, budget, compliance).
2. Identify the top 3 quality attributes (e.g., availability, cost, time-to-market).
3. Start with the simplest architecture that could work; list explicit assumptions and numbers.
4. Find the riskiest parts (scale, consistency, vendor) and prototype them.
5. Write decision records (ADRs) with alternatives and trade-offs.
6. Plan evolution: how the design changes at 10× and 100× load.
7. Define ownership, SLOs, rollout, and migration steps.

### Q102. Monolith to microservices migration
Use the **strangler fig** pattern: route a slice of traffic to a new service, keep the monolith as fallback, extract by business capability (not technical layer), split data carefully (shared DB first, then separate), add an API gateway and observability, and stop when the benefit is gone. Avoid a "distributed monolith".

### Q103. Domain-driven design for service boundaries
Bounded contexts align services to business domains with their own models and language; context maps define relationships (anti-corruption layer, shared kernel). Boundaries follow team ownership (Conway's law).

### Q104. Build vs buy vs open-source
Weigh differentiation (build what makes you unique), total cost (people + infra + risk), lock-in, security/compliance, time-to-market and operational burden. Buy commodity (auth, email, payments); build core domain.

### Q105. Cost-aware architecture (FinOps)
Cost drivers: compute, storage, data transfer/egress, managed-service per-request fees, observability data. Techniques: right-sizing, autoscaling, spot/preemptible for batch, storage tiering, caching/CDN, compression, avoiding cross-AZ/region chatter, and reviewing unit cost (cost per order/user).

### Q106. Multi-tenancy design
Models: shared everything with `tenant_id` (cheap, risk of leaks, noisy neighbours), schema per tenant, database per tenant (isolation, costlier), cell-based (a group of tenants per fully isolated "cell"). Enforce tenant context in every query (row-level security), per-tenant rate limits and quotas.

### Q107. Cell-based architecture
Split the platform into independent cells (each a full stack serving a subset of users). A failure or bad deploy affects only one cell, which limits blast radius and enables safe rollout. A thin routing layer maps users to cells.

### Q108. Security architecture
Zero trust, least privilege IAM, mTLS between services, secrets in a vault/KMS, encryption in transit and at rest, input validation, WAF, DDoS protection, audit logs, data classification, PII minimization, regular threat modelling (STRIDE). See `../03_Backend/036_Authentication-and-Security.md`.

### Q109. Technical leadership in design reviews
Write a short design doc (context, goals, non-goals, options, decision, risks), review with stakeholders, time-box debate, record decisions, define success metrics, and revisit after launch. Mentor others to present trade-offs rather than "best" answers.

### Q110. Communicating architecture to executives
Frame in outcomes: reliability (uptime, incident rate), speed (lead time), cost (unit cost), risk (compliance, vendor), and roadmap. Example: "Moving to a cell-based design cut blast radius to 5% of users, reduced incident cost, and allowed weekly releases, at +8% infra cost."

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. LRU cache (O(1) get/put)
```ts
class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number) {}
  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);          // move to most-recent
    return val;
  }
  put(key: K, val: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const oldest = this.map.keys().next().value as K;
      this.map.delete(oldest);       // evict least-recent
    }
    this.map.set(key, val);
  }
}
```
`Map` keeps insertion order, so the first key is the least recently used.

### H2. Token bucket rate limiter (in-memory)
```ts
class TokenBucket {
  private tokens: number;
  private last = Date.now();
  constructor(private rate: number, private capacity: number) { this.tokens = capacity; }
  allow(cost = 1): boolean {
    const now = Date.now();
    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last) / 1000) * this.rate);
    this.last = now;
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }
}
const limiter = new TokenBucket(5, 10);   // 5 req/s, burst of 10
```
For many servers use the Redis Lua version from Q62.

### H3. Consistent hashing ring with virtual nodes
```ts
import { createHash } from 'crypto';
const h = (s: string) => parseInt(createHash('md5').update(s).digest('hex').slice(0, 8), 16);

class HashRing {
  private ring: { pos: number; node: string }[] = [];
  constructor(nodes: string[], private vnodes = 100) { nodes.forEach(n => this.add(n)); }
  add(node: string) {
    for (let i = 0; i < this.vnodes; i++) this.ring.push({ pos: h(`${node}#${i}`), node });
    this.ring.sort((a, b) => a.pos - b.pos);
  }
  remove(node: string) { this.ring = this.ring.filter(r => r.node !== node); }
  get(key: string): string {
    const p = h(key);
    let lo = 0, hi = this.ring.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; this.ring[mid].pos < p ? (lo = mid + 1) : (hi = mid); }
    return this.ring[lo % this.ring.length].node;   // wrap around
  }
}
```

### H4. URL shortener: base62 and schema
```ts
const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function toBase62(n: bigint): string {
  if (n === 0n) return '0';
  let s = '';
  while (n > 0n) { s = ALPHA[Number(n % 62n)] + s; n /= 62n; }
  return s;
}
```
```sql
CREATE TABLE links (
  code        VARCHAR(10) PRIMARY KEY,
  long_url    TEXT        NOT NULL,
  owner_id    BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ
);
CREATE INDEX idx_links_owner ON links(owner_id);
```
Redirect handler: check Redis `GET code` → on miss read DB → set Redis with TTL → respond `302 Location`.

### H5. Cache-aside with stampede protection
```ts
async function getUser(id: string) {
  const key = `user:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lock = await redis.set(`lock:${key}`, '1', 'NX', 'PX', 5000);
  if (!lock) { await sleep(50); return getUser(id); }       // another request is loading it
  try {
    const user = await db.users.findById(id);
    await redis.set(key, JSON.stringify(user), 'EX', 300 + Math.floor(Math.random() * 60)); // jittered TTL
    return user;
  } finally { await redis.del(`lock:${key}`); }
}
```

### H6. Idempotent payment endpoint
```ts
app.post('/payments', async (req, res) => {
  const key = req.header('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
  const prev = await db.query('SELECT response FROM idem WHERE key=$1', [key]);
  if (prev.rows[0]) return res.status(200).json(prev.rows[0].response);   // replay
  const result = await db.tx(async tx => {
    const pay = await tx.charge(req.body);
    await tx.query('INSERT INTO idem(key,response) VALUES($1,$2)', [key, pay]); // unique key
    return pay;
  });
  res.status(201).json(result);
});
```
The unique constraint on `key` makes concurrent duplicates fail safely.

### H7. Outbox table and relay
```sql
BEGIN;
  INSERT INTO orders(id, user_id, total) VALUES (101, 7, 499);
  INSERT INTO outbox(id, topic, payload) VALUES (gen_random_uuid(), 'order.created', '{"order_id":101}');
COMMIT;
```
A relay reads unsent rows (`FOR UPDATE SKIP LOCKED`), publishes to Kafka, then marks them sent; consumers dedupe by event id.

### H8. Circuit breaker
```ts
class Breaker {
  private fails = 0; private state: 'closed' | 'open' | 'half' = 'closed'; private openedAt = 0;
  constructor(private max = 5, private resetMs = 10_000) {}
  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt < this.resetMs) throw new Error('circuit open');
      this.state = 'half';
    }
    try { const r = await fn(); this.fails = 0; this.state = 'closed'; return r; }
    catch (e) {
      if (++this.fails >= this.max || this.state === 'half') { this.state = 'open'; this.openedAt = Date.now(); }
      throw e;
    }
  }
}
```

### H9. Retry with exponential backoff and jitter
```ts
async function retry<T>(fn: () => Promise<T>, tries = 4, base = 100): Promise<T> {
  for (let i = 0; ; i++) {
    try { return await fn(); }
    catch (e) {
      if (i >= tries - 1) throw e;
      const delay = Math.random() * base * 2 ** i;   // full jitter
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### H10. Snowflake-style ID generator
```ts
class Snowflake {
  private seq = 0n; private last = -1n;
  constructor(private machineId: bigint, private epoch = 1700000000000n) {}
  next(): bigint {
    let now = BigInt(Date.now());
    if (now === this.last) { this.seq = (this.seq + 1n) & 0xFFFn; if (this.seq === 0n) while ((now = BigInt(Date.now())) <= this.last); }
    else this.seq = 0n;
    this.last = now;
    return ((now - this.epoch) << 22n) | (this.machineId << 12n) | this.seq;
  }
}
```
41 bits time, 10 bits machine, 12 bits sequence.

---

# 🐞 Part 7: Debugging Scenarios

### D1. Database CPU at 100% after a new feature
Find slow queries (`pg_stat_statements`, slow log), missing indexes, N+1 queries, large offset pagination or full scans. Fix with indexes, batching, caching, read replicas, and query limits. Add a query review step in CI.

### D2. Latency spikes every hour
Look for cron jobs, cache TTL expiry stampedes, GC pauses, backups, autoscaling cold starts, or compaction. Correlate with metrics and traces; add jitter, warm-up and rate limiting for batch jobs.

### D3. Users see stale data after update
Replica lag, CDN or cache not invalidated, client caching headers, or eventual consistency by design. Use read-your-writes routing, delete-on-write, versioned URLs, and correct `Cache-Control`.

### D4. Duplicate orders or double charges
Client retried and server was not idempotent, queue redelivery, or race on concurrent requests. Add idempotency keys with unique constraints, idempotent consumers, and transactional outbox.

### D5. One shard overloaded (hot partition)
Bad shard key (timestamp, popular tenant, celebrity). Re-shard with hashed/compound key, split hot tenant, add salting (`key#0..N`), or cache and replicate the hot data.

### D6. Queue backlog growing
Consumers slower than producers, poison message looping, downstream slow, or too few partitions. Scale consumers, add DLQ and retry limits, increase partitions (Kafka), apply backpressure and fix downstream.

### D7. Cascading failure after a dependency slows down
Threads/connections exhausted waiting on the slow service. Add timeouts, bulkheads, circuit breakers, load shedding, and fallbacks. Reduce retries (retry storm).

### D8. Thundering herd on cache restart
Cold cache sends all traffic to DB. Warm the cache, use request coalescing, rate-limit DB access, stagger restarts and add stale-while-revalidate.

### D9. Split-brain in a cluster
Two nodes think they are leaders after a partition. Use quorum-based leader election (Raft/ZooKeeper), fencing tokens, and an odd number of nodes across zones.

### D10. Websocket connections drop after deploy
Connections tied to old instances; rolling restart kills them. Use graceful draining, client reconnect with backoff and jitter, session resume tokens, and connection limits per node.

### D11. Out-of-order messages
Multiple partitions or consumers process concurrently. Partition by entity key, process sequentially per key, include sequence numbers, and make handlers tolerant of reordering.

### D12. Clock skew breaks TTL or ordering
Servers' clocks differ. Run NTP/chrony, use monotonic clocks for durations, logical clocks/version numbers for ordering, and DB-generated timestamps.

### D13. Cross-region latency in a "global" app
All writes go to one region. Route users to nearest read replica, use CDN/edge caching, partition data by home region, and keep chatty calls inside a region.

### D14. Storage cost explosion
Unbounded logs, old versions, uncompressed media, duplicates. Add lifecycle policies, tiering, compression, dedup (content hashing), and retention rules.

### D15. Search results out of date
Indexing lag or failed indexer. Use CDC to update the index, monitor lag, handle retries/DLQ, and support full reindex with alias swap.

---

# 🧩 Part 8: Tricky Questions

### T1. Does CAP mean you always lose one of three?
No. It applies during a partition: choose consistency or availability. Without partitions you can have both (but see PACELC for latency trade-offs).

### T2. Is NoSQL always faster than SQL?
No. It depends on access pattern. A well-indexed SQL database handles huge loads; NoSQL helps with specific scale and schema needs.

### T3. Is microservices always better than a monolith?
No. They add network, data consistency and ops complexity. Use them when team/scale boundaries justify it.

### T4. Does adding a cache always improve the system?
No. It adds staleness, invalidation complexity, and new failure modes (stampede). Use where read ratio and hit rate justify.

### T5. Is exactly-once delivery possible?
Not end-to-end in general; you get at-least-once plus idempotent processing (effectively once). Kafka/Flink offer exactly-once within their boundary.

### T6. Is a load balancer a SPOF?
It can be; run redundant load balancers (managed LB, VRRP, anycast/DNS).

### T7. Does sharding solve all scale problems?
No. It adds cross-shard queries, hot spots and operational cost. Try indexing, caching, replicas and vertical scale first.

### T8. Are UUIDs good primary keys?
Fine for uniqueness and distribution, but random UUIDs hurt B-tree locality; prefer time-ordered IDs (UUIDv7, ULID, Snowflake) for write-heavy tables.

### T9. Is 99.99% availability just "four nines of servers"?
No. It must hold across all dependencies, deployments and human error. Serial dependencies multiply downtime.

### T10. Is eventual consistency the same as "inconsistent"?
No. Replicas converge if writes stop; the window is usually small and acceptable for many features.

### T11. Does a message queue guarantee order?
Only in specific cases (single partition/queue, FIFO queues). More parallelism usually means weaker ordering.

### T12. Is using JWT stateless and therefore revocation-free?
Stateless validation means revocation is hard; use short expiry, refresh tokens and a denylist for critical cases.

### T13. Can you scale reads and writes the same way?
No. Reads scale with replicas and caches; writes need partitioning or higher-throughput stores.

### T14. Does autoscaling fix all load issues?
No. Scaling is not instant, databases and downstreams may not scale, and cold starts cause spikes. Use queues, rate limits and headroom.

### T15. Is a 301 or 302 better for URL shorteners?
301 is cached by browsers (less load, fewer analytics). 302 gives you every click for analytics. Choose by need.

### T16. Is strong consistency always required for money?
For the ledger yes; surrounding views (dashboards, notifications) can be eventual.

### T17. Does more replicas always mean more safety?
No. Replication lag, quorum cost and correlated failures (same zone, same bug) limit the benefit.

### T18. Is the "best" design the most scalable one?
No. Over-engineering costs time and money; design for current needs with a clear path for 10× growth.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Scale out or up?** Out for growth, up for quick wins.
- **Stateless servers?** Put sessions in Redis/tokens.
- **L4 vs L7 LB?** TCP-level vs HTTP-level.
- **Cache pattern most common?** Cache-aside.
- **Eviction default?** LRU.
- **Shard strategies?** Range, hash, directory, geo.
- **Reduce rehash on node change?** Consistent hashing.
- **Replication styles?** Leader-follower, multi-leader, leaderless.
- **CAP choice in partition?** C or A.
- **Quorum rule?** W + R > N.
- **Strong vs eventual?** Money vs likes.
- **Idempotent HTTP verbs?** GET, PUT, DELETE.
- **Safe retries need?** Idempotency keys.
- **Event publish reliably?** Outbox + CDC.
- **Distributed transaction alternative?** Saga.
- **Read/write separation?** CQRS.
- **Blob storage?** S3-style object store.
- **Static content delivery?** CDN.
- **Rate limit algorithm with bursts?** Token bucket.
- **Probabilistic membership?** Bloom filter.
- **Unique counts approx?** HyperLogLog.
- **Time-ordered IDs?** Snowflake, UUIDv7, ULID.
- **Pagination at scale?** Cursor/keyset.
- **Failure containment?** Bulkhead, circuit breaker, cells.
- **Retry policy?** Exponential backoff + jitter.
- **Realtime options?** Polling, SSE, WebSockets.
- **DR metrics?** RPO and RTO.
- **Search engine?** Elasticsearch/OpenSearch.
- **Queue for big streams?** Kafka.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a system you designed for scale.
STAR: "I redesigned an order platform that peaked at 3k QPS and failed during sales. I introduced cache-aside with Redis for catalog reads, moved order events to Kafka with an outbox, sharded the orders table by customer id, and added autoscaling and load shedding. p99 dropped from 2.4 s to 380 ms and the next sale ran at 9k QPS with no incident."

### P2. Describe a trade-off you made.
"We chose eventual consistency for the activity feed but strong consistency for payments. That let us scale the feed on a cheap NoSQL store, and kept money in PostgreSQL with serializable transactions. I documented the decision and set alerts on replica lag."

### P3. A design decision you regretted.
"We split into too many microservices early. Deploy coordination and cross-service transactions slowed us. We merged three services back into one, kept clear module boundaries and reduced incidents by 40%."

### P4. How did you handle a major outage?
"A cache restart sent full traffic to the database. We enabled rate limiting and serve-stale mode, warmed the cache gradually and added request coalescing and jittered TTLs. We also load-tested cold-start scenarios."

### P5. How do you decide SQL vs NoSQL?
"I start from access patterns, consistency needs, and team skills. Relational by default; I use key-value/wide-column when I have simple key lookups at very high scale; search and analytics go to purpose-built stores fed by CDC."

### P6. How do you run a design review?
"A one-to-two-page doc with goals, non-goals, options and risks, async comments first, a short meeting for contested points, a recorded decision, and a follow-up after launch to compare predictions with reality."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** requirements, estimation, latency numbers, scalability, availability, reliability, durability.
- **Networking and edge:** DNS, CDN, load balancers (L4/L7), reverse proxy, API gateway, WebSockets/SSE.
- **Caching:** cache-aside/through/back, eviction, stampede, penetration, invalidation, hot keys.
- **Data stores:** SQL, NoSQL types, indexing, sharding, replication, consistency, isolation, OLTP/OLAP, search, time-series, blob.
- **Messaging:** queues, pub/sub, Kafka logs, delivery guarantees, DLQ, ordering, backpressure.
- **Distributed systems:** CAP/PACELC, quorum, consensus, clocks, idempotency, outbox, saga, 2PC, CRDT, leader election.
- **Reliability:** timeouts, retries, circuit breakers, bulkheads, load shedding, multi-AZ/region, DR, chaos.
- **Architecture styles:** monolith, microservices, event-driven, CQRS, event sourcing, cell-based, multi-tenant.
- **Case studies:** URL shortener, rate limiter, KV store, chat, feed, video, ride hailing, payments, search, storage, crawler, notifications, ticketing, collaborative editor.
- **Operations:** observability, deployment strategies, migrations, capacity, cost, security.
- **Leadership:** decision records, trade-off communication, migrations, build vs buy.

## Mixed topics
- System design + databases (`../04_Database/026_SQL.md` … `033_Prisma-and-ORMs.md`): schema, indexes, replication.
- System design + Redis/Elasticsearch (`../04_Database/031_Redis-and-Caching.md`, `032_Elasticsearch.md`).
- System design + backend (`../03_Backend/035_GraphQL-and-REST-APIs.md`, `037_WebSockets-and-Realtime.md`, `038_Message-Queues.md`, `039_Microservices.md`).
- System design + cloud and DevOps (`../07_DevOps_and_Cloud/046_Kubernetes.md`, `048_AWS.md`, `051_Terraform-and-IaC.md`, `052_Monitoring-and-Observability.md`).
- System design + DSA/OOP (`../08_CS_Fundamentals/022_Data-Structures-and-Algorithms.md`, `023_OOP-and-Design-Patterns.md`): LRU, tries, heaps, LLD.
- System design + security (`../03_Backend/036_Authentication-and-Security.md`).
- System design + data/ML (`../10_AI_and_ML/075_Data-Engineering.md`, `../10_AI_and_ML/074_MLOps.md`): pipelines, feature stores, serving.

---

# 🔬 Part 12: Internals

### I1. Kafka internals
Topic → partitions → segment files on disk (sequential append, page cache, zero-copy send). Each partition has a leader and followers in the **ISR**; producers use `acks=all` for durability; consumers track offsets in `__consumer_offsets`; consumer groups assign partitions; retention or compaction removes old data. KRaft replaces ZooKeeper for metadata.

### I2. LSM tree storage engines
Writes go to a WAL and in-memory memtable, flush to immutable sorted SSTables, and are merged by compaction. Bloom filters skip files on reads. Fast writes, read/write amplification; used in Cassandra, RocksDB, LevelDB, HBase.

### I3. B-tree storage engines
Page-based tree on disk, in-place updates with WAL, great for point and range reads (PostgreSQL, MySQL InnoDB). Write amplification from page updates; fragmentation over time.

### I4. Dynamo-style replication
Consistent hashing places keys on N nodes; coordinators write to W and read from R; sloppy quorum + hinted handoff for availability; vector clocks or timestamps for versions; read repair and Merkle-tree anti-entropy fix drift; gossip shares membership and failure info.

### I5. Raft in brief
Leader election by randomized timeouts and majority votes per **term**; leader appends entries and replicates; entry is committed when stored on a majority; followers apply committed entries in order. Safety: only candidates with up-to-date logs can win.

### I6. How CDNs work
DNS or anycast directs users to the nearest PoP; edge checks cache by URL + vary headers; on miss it fetches from an origin shield/origin and stores per `Cache-Control`; supports purge, signed URLs and TLS termination at the edge.

### I7. TCP/HTTP behaviours that affect design
3-way handshake and TLS cost latency (use keep-alive, HTTP/2 multiplexing, HTTP/3 QUIC); head-of-line blocking; connection pools; slow start; Nagle/delayed ACK; DNS TTL. See `../07_DevOps_and_Cloud/024_Linux-and-Networking.md`.

### I8. Database write path (PostgreSQL-like)
Transaction writes to the WAL (fsync on commit) then marks buffers dirty; background writer/checkpointer flushes pages; MVCC keeps row versions; vacuum cleans dead tuples; replication ships WAL to standbys.

### I9. Distributed tracing for design reviews
Trace ids propagate through services; sampling decides retention; critical path analysis finds what dominates latency. Use it to validate that the design meets latency budgets.

---

# 📊 Part 13: Reference Tables

### Power-of-two and sizes
| Value | Approx. | Name |
|---|---|---|
| 2^10 | 1 thousand | 1 KB |
| 2^20 | 1 million | 1 MB |
| 2^30 | 1 billion | 1 GB |
| 2^40 | 1 trillion | 1 TB |
| 2^50 | 1 quadrillion | 1 PB |

### Requests per day to QPS
| Per day | Avg QPS |
|---|---|
| 1 M | ~12 |
| 10 M | ~120 |
| 100 M | ~1,200 |
| 1 B | ~12,000 |

### Cache strategy comparison
| Strategy | Read | Write | Risk |
|---|---|---|---|
| Cache-aside | Miss → DB | DB then invalidate | Stale data |
| Read-through | Cache loads | Via DB | Cache provider dependency |
| Write-through | Fast | Slower, consistent | Extra latency |
| Write-back | Fast | Fastest | Data loss on crash |

### Consistency and system examples
| Property | Examples |
|---|---|
| CP | etcd, ZooKeeper, HBase, Spanner |
| AP | Cassandra, DynamoDB (eventual reads), Riak |
| Tunable | Cassandra, DynamoDB, MongoDB |
| Strong single-node | PostgreSQL, MySQL |

### Messaging systems
| System | Model | Ordering | Best for |
|---|---|---|---|
| Kafka | Distributed log | Per partition | Streaming, events, replay |
| RabbitMQ | Broker, queues | Per queue | Task routing |
| SQS | Managed queue | FIFO optional | Simple async jobs |
| Pub/Sub, SNS | Fan-out | Varies | Notifications |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| Kafka KRaft | ZooKeeper-free mode is the default in newer versions |
| UUIDv7 | Time-ordered UUID standardized in RFC 9562 |
| HTTP/3 | QUIC-based, wide CDN support |
| Redis licence changes | Valkey and other forks exist; check licence before choosing |
| Latency numbers | Approximate; test on your hardware and cloud |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
`hash(key) % 4` changes to `% 5` after adding a node.
**Result:** most keys (about 80%) move to different nodes; consistent hashing moves only about 1/5.

### O2.
Cache TTL is 60 s for 1M keys, all set at startup.
**Result:** all expire together; a stampede hits the DB. Add jitter.

### O3.
N=3, W=1, R=1.
**Result:** `W+R=2 ≤ 3`, so reads may miss the latest write (eventual consistency).

### O4.
N=3, W=2, R=2.
**Result:** `W+R=4 > 3`, so every read overlaps with the latest acknowledged write.

### O5.
Two services each retry 3 times against a failing third service.
**Result:** up to 16× traffic amplification on the third service (4 attempts × 4 attempts); a retry storm.

### O6.
Fixed window limit of 100/min; client sends 100 at 12:00:59 and 100 at 12:01:00.
**Result:** 200 requests within about 1 second; fixed windows allow double bursts at edges.

### O7.
`UPDATE stock SET qty = qty - 1 WHERE id = 5 AND qty > 0` run by 10 concurrent buyers with qty = 3.
**Result:** exactly 3 updates succeed (affected rows = 1), 7 get 0 rows; no overselling.

### O8.
Kafka topic with 3 partitions and 5 consumers in one group.
**Result:** only 3 consumers get partitions; 2 are idle.

### O9.
Bloom filter says "not present".
**Result:** definitely not present. If it says "present", it may be a false positive.

### O10.
Snowflake ID with machine id reused by two servers.
**Result:** possible duplicate IDs in the same millisecond and sequence.

### O11.
Leader fails in a 3-node Raft cluster, 2 nodes remain.
**Result:** they elect a new leader (majority of 3 is 2); the cluster stays available.

### O12.
Leader fails in a 4-node cluster and a partition leaves 2 and 2.
**Result:** no majority (needs 3); no leader can be elected, so writes stop. Use odd cluster sizes.

---

# ✅ Part 15: MCQs

**1. Horizontal scaling means:**
A) Bigger server  B) More servers  C) Faster disk  D) More RAM only
**Answer: B**

**2. Which cache strategy loads data on a miss from the application?**
A) Cache-aside  B) Write-back  C) Write-around only  D) Mirror
**Answer: A**

**3. Consistent hashing mainly reduces:**
A) Disk size  B) Key movement when nodes change  C) CPU  D) Bandwidth cost
**Answer: B**

**4. In CAP, during a partition you choose between:**
A) Cost and speed  B) Consistency and availability  C) Latency and size  D) SQL and NoSQL
**Answer: B**

**5. Quorum guarantees overlap when:**
A) W + R > N  B) W = R = 1  C) N = 1 only  D) W < R
**Answer: A**

**6. Safe retries of a POST payment need:**
A) Longer timeout  B) Idempotency key  C) Bigger cache  D) CDN
**Answer: B**

**7. Which pattern publishes events reliably with a DB change?**
A) Outbox  B) Singleton  C) Proxy  D) Facade
**Answer: A**

**8. Kafka guarantees ordering:**
A) Across the whole topic  B) Within a partition  C) Never  D) Only for compacted topics
**Answer: B**

**9. A Bloom filter can produce:**
A) False negatives  B) False positives  C) Both always  D) Neither
**Answer: B**

**10. Best structure for a leaderboard in Redis:**
A) List  B) Sorted set  C) Hash only  D) Stream only
**Answer: B**

**11. Keyset pagination is better than offset because it:**
A) Uses more memory  B) Stays fast and stable on large data  C) Needs no index  D) Returns random order
**Answer: B**

**12. Which is a way to reduce cache stampede?**
A) Same TTL for all  B) TTL jitter and request coalescing  C) Remove cache  D) Bigger keys
**Answer: B**

**13. 2PC is mostly avoided in microservices because it:**
A) Is too fast  B) Blocks and reduces availability  C) Has no commit  D) Needs no coordinator
**Answer: B**

**14. Snowflake IDs are made of:**
A) Random bits only  B) Timestamp + machine id + sequence  C) Hash of content  D) Counter only
**Answer: B**

**15. Which provides adaptive bitrate streaming formats?**
A) HLS/DASH  B) SMTP  C) FTP  D) SSH
**Answer: A**

**16. A circuit breaker's open state means:**
A) Requests pass normally  B) Requests fail fast  C) Cache is cleared  D) DB is read-only
**Answer: B**

**17. For a 3-node Raft cluster, how many failures are tolerated?**
A) 0  B) 1  C) 2  D) 3
**Answer: B**

**18. CDN is best for:**
A) Private transactions  B) Static and cacheable content  C) Database writes  D) Cron jobs
**Answer: B**

**19. "Read-your-writes" consistency means:**
A) You see your own recent writes  B) Everyone sees every write at once  C) Writes are ignored  D) Only admins read
**Answer: A**

**20. Sagas handle failures with:**
A) Global locks  B) Compensating actions  C) Reboots  D) Rate limits
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Jumping into boxes** without clarifying requirements and scale.
2. **Skipping estimation**, so design choices have no numbers behind them.
3. **Single points of failure** (one DB, one LB, one AZ).
4. **Choosing technology by hype** instead of access patterns.
5. **Ignoring data consistency needs** (eventual consistency for payments).
6. **No idempotency** on retried operations.
7. **Unbounded queues** and no backpressure.
8. **Cache without invalidation plan** or stampede protection.
9. **Bad shard key** (timestamp, low cardinality) creating hot spots.
10. **Retry storms** with no jitter or budget.
11. **No timeouts** on network calls.
12. **Premature microservices** and distributed monoliths.
13. **Over-engineering** for scale you will never have.
14. **Ignoring failure modes**: partitions, clock skew, partial failures.
15. **Storing blobs in the relational DB.**
16. **Ignoring cost** (egress, cross-AZ traffic, observability).
17. **Forgetting security** (auth, encryption, PII).
18. **No monitoring, SLOs or runbooks** in the design.
19. **Not discussing trade-offs** or alternatives.
20. **Ignoring migrations and rollout** (schema changes, backward compatibility).
21. **Treating the interview as a monologue** rather than a conversation.
22. **Using exactly-once claims** without explaining idempotent consumers.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You **clarify and quantify** before drawing; numbers shape your design.
- You **name trade-offs** explicitly (consistency vs latency, cost vs resilience).
- You pick data stores by **access patterns** and know why.
- You design for **failure**: timeouts, jitter, breakers, load shedding, multi-AZ, DR targets.
- You use **idempotency, outbox and sagas** instead of distributed transactions.
- You understand **sharding, replication lag and hot keys** from real incidents.
- You plan **rollout, migrations and observability** as part of the design.
- You consider **cost, security and team ownership**, not only technology.
- You can simplify: start small, show the path to 10× and 100×.
- You support claims with stories and measured results.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Interview framework (45 minutes)
```
1. Requirements (5 min): functional, non-functional, scope, users
2. Estimation (5 min): QPS, storage, bandwidth, read:write ratio
3. API + data model (5 min): endpoints, entities, keys
4. High-level design (10 min): clients → LB → services → cache → DB/queue → storage
5. Deep dive (15 min): bottlenecks, sharding, consistency, failures
6. Wrap-up (5 min): monitoring, security, cost, future scale
```

### Building-block checklist
DNS/CDN • LB • API gateway • stateless services • cache • DB (+replicas, shards) • queue/stream • object storage • search • workers • observability • security • CI/CD.

### Trade-off phrases
"If we need strong consistency here, we pay in latency and availability." • "I would start simple and shard when we reach X QPS." • "This path must be idempotent because retries will happen." • "I would not cache this because staleness is unacceptable."

### Quick numbers
1M/day ≈ 12 QPS • 1B/day ≈ 12k QPS • peak ≈ 3× avg • 1 KB × 1B = 1 TB • memory 100 ns, SSD 100 µs, DC hop 0.5 ms, cross-continent 100+ ms • 99.9% ≈ 8.76 h/yr, 99.99% ≈ 52.6 min/yr.

### Classic designs, one line each
URL shortener: base62 IDs + KV + cache • Rate limiter: token bucket in Redis • Chat: WebSockets + presence + per-conversation log • Feed: hybrid fan-out • Video: transcode + HLS + CDN • Uber: geo index + matching • Payments: ledger + idempotency + reconciliation • Search: inverted index + CDC • Drive: chunking + dedup + metadata service • Crawler: frontier + politeness + dedup.

### Final checklist before the interview
- [ ] Clarify requirements and do quick estimation.
- [ ] Explain scaling, load balancing, caching, sharding, replication.
- [ ] Explain CAP/PACELC, quorum, consistency models and isolation levels.
- [ ] Use queues, idempotency, outbox and sagas correctly.
- [ ] Design 5+ classic systems end to end (URL shortener, chat, feed, payments, video).
- [ ] Cover reliability: timeouts, retries, breakers, backpressure, DR.
- [ ] Cover security, observability, cost and rollout.
- [ ] Be ready with a scaling story, a failure story and a trade-off story with numbers.
