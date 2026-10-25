# Redis & Caching Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Redis 7.x and 8.0** (self-managed, Redis Cloud, AWS ElastiCache/MemoryDB, Azure Cache) with the Node.js clients **ioredis** and **node-redis (v4/v5)** and `redis-cli`. Features that matter in interviews are marked with the version they arrived in: ACLs and RESP3 (6.0), client-side caching and I/O threading (6.0), Streams (5.0), Functions, sharded Pub/Sub and ACL v2 (7.0), `LMPOP`/`SINTERCARD` (7.0), hash-field expiration `HEXPIRE` (7.4), and the integration of JSON, Search/Query, TimeSeries, probabilistic structures and Vector Sets into the core distribution (8.0). Redis 7.4+ changed licensing (RSALv2/SSPL, then AGPLv3 option from 8.0); **Valkey** is the Linux Foundation fork that stays BSD. Anything marked "verify" should be checked in the official docs (redis.io/docs) for your exact version and provider. Examples use the sample name **Ritesh Kumar**.
> This file covers Redis data types and commands, expiry and eviction, persistence (RDB/AOF), replication, Sentinel, Cluster, transactions and Lua, Pub/Sub and Streams, caching strategies (cache-aside, write-through, write-back), cache invalidation, stampede/penetration/avalanche, distributed locks, rate limiting, sessions, queues, security, performance tuning, monitoring, HTTP/CDN/browser caching, and production practice. Relational comparisons refer to `026_SQL.md` to `029_SQLite.md`; the document-store comparison refers to `030_MongoDB.md`.

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
- [Part 12: Redis Internals](#-part-12-redis-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Redis?
**Re**mote **Di**ctionary **S**erver: an open-source, **in-memory data structure store** used as a cache, database, message broker and streaming engine. Data lives in RAM (hence microsecond-level latency) and can optionally be persisted to disk. It supports rich types (strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geospatial, and more), replication, Sentinel for failover, Cluster for sharding, Lua scripting and Pub/Sub. Created by Salvatore Sanfilippo in 2009.

### Q2. Why is Redis so fast?
1. Data is in **memory** (no disk seek on reads).
2. Efficient, purpose-built **data structures** (SDS strings, listpack, skiplist, hash table).
3. **Single-threaded command execution** (no locks/context-switch overhead for commands).
4. **I/O multiplexing** (`epoll`/`kqueue`) to serve thousands of connections from one thread.
5. A simple text protocol (**RESP**), pipelining support, and C implementation.
Since 6.0, optional **I/O threads** parallelize socket reads/writes, but commands still execute on one main thread.

### Q3. What is caching and why do we need it?
Caching stores copies of frequently read or expensive-to-compute data in a faster layer so repeated requests avoid the slower source (database, API, computation). Benefits: lower latency, lower load on the database, higher throughput, cost savings. Costs: **staleness**, invalidation complexity, extra infrastructure and memory.

### Q4. Redis vs a traditional database (SQL/MongoDB)
| | Redis | SQL / MongoDB |
|---|---|---|
| Primary storage | RAM (optional persistence) | Disk (with buffer cache) |
| Query model | Key-based commands | SQL / rich query language |
| Latency | Sub-millisecond | Milliseconds |
| Joins / ad-hoc queries | No (secondary indexing via Search module) | Yes |
| Data size | Limited by RAM (cost) | Limited by disk |
| Best for | Cache, sessions, counters, queues, leaderboards, rate limits | System of record |

### Q5. Redis vs Memcached *(Must-know)*
| | Redis | Memcached |
|---|---|---|
| Data types | Rich structures | Strings only |
| Persistence | RDB/AOF | None |
| Replication / HA | Yes (Sentinel, Cluster) | Client-side sharding only |
| Threading | Single-threaded commands (+ I/O threads) | Multi-threaded |
| Pub/Sub, Streams, Lua, transactions | Yes | No |
| Eviction | Multiple policies (LRU/LFU/TTL/random) | LRU |
Pick Memcached for a pure, simple, multi-core string cache; pick Redis for nearly everything else.

### Q6. Install and connect
```bash
docker run -d --name redis -p 6379:6379 redis:7
redis-cli -h 127.0.0.1 -p 6379
redis-cli -u redis://default:password@host:6379/0
```
```
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET name "Ritesh Kumar"
OK
127.0.0.1:6379> GET name
"Ritesh Kumar"
```
Default port **6379**. Databases are numbered `0–15` by default (`SELECT 1`); Cluster mode supports only DB 0.

### Q7. Basic string commands *(Must-know)*
```
SET user:1:name "Ritesh Kumar"
GET user:1:name
SET counter 10
INCR counter            # 11 (atomic)
INCRBY counter 5        # 16
DECR counter            # 15
APPEND user:1:name " Jr"
STRLEN user:1:name
MSET a 1 b 2 c 3
MGET a b c
SETNX lock:1 "x"        # set only if not exists
SET k v NX EX 30        # modern atomic "set if not exists + expiry"
GETDEL k                # get and delete (6.2)
```
Strings are binary-safe and up to **512 MB**.

### Q8. Key naming conventions
Use a readable, hierarchical namespace separated by colons: `app:entity:id:field`, for example `shop:user:42:profile`, `shop:cart:42`. Benefits: easy scanning, tooling, ACL key patterns (`~shop:*`), and avoiding collisions. Keep keys short but meaningful (the key is stored in memory for every entry). Never put unbounded user input in keys without sanitization.

### Q9. Key expiration (TTL) *(Must-know)*
```
SET session:abc "data" EX 3600     # seconds
SET session:abc "data" PX 5000     # milliseconds
EXPIRE session:abc 600
PEXPIRE session:abc 600000
EXPIREAT key 1893456000            # unix timestamp
TTL session:abc                    # seconds left; -1 = no expiry, -2 = key doesn't exist
PTTL session:abc
PERSIST session:abc                # remove the expiry
```
Expired keys are removed by **passive** expiry (checked on access) and **active** expiry (a background cycle sampling keys with TTLs). Overwriting a key with `SET` (without `KEEPTTL`) clears its TTL.

### Q10. Core data types (overview) *(Must-know)*
| Type | Use cases |
|---|---|
| String | Cache values, counters, flags, serialized JSON |
| Hash | Objects/records (user profile), field-level updates |
| List | Queues, recent activity, timelines |
| Set | Unique members, tags, relationships, set algebra |
| Sorted Set (ZSET) | Leaderboards, priority queues, time-ordered indexes, rate-limit windows |
| Stream | Event log, message queue with consumer groups |
| Bitmap | Compact boolean flags (daily active users) |
| HyperLogLog | Approximate unique counts (12 KB max) |
| Geospatial | Nearby search using sorted sets |
| Bloom/Cuckoo/Top-K/t-digest (8.0 core, earlier module) | Probabilistic membership/counting |
| JSON, TimeSeries, Search, Vector Set (8.0) | Document, time-series, full-text/vector search |

### Q11. Hashes
```
HSET user:1 name "Ritesh Kumar" email ritesh@example.com age 28
HGET user:1 name
HMGET user:1 name email
HGETALL user:1
HINCRBY user:1 age 1
HDEL user:1 email
HEXISTS user:1 name
HLEN user:1
```
Hashes store small objects compactly (listpack encoding for small hashes). Prefer a hash over a serialized JSON string when you update individual fields. Redis 7.4 adds per-field expiry (`HEXPIRE`).

### Q12. Lists
```
LPUSH queue "job1"           # push left
RPUSH queue "job2"           # push right
LPOP queue; RPOP queue
LRANGE queue 0 -1            # all elements
LLEN queue
LTRIM recent 0 99            # keep only the 100 newest
BLPOP queue 5                # blocking pop, wait up to 5 s
LMOVE src dst LEFT RIGHT     # atomic move (6.2); replaces RPOPLPUSH
```
Lists are linked lists of listpacks (quicklist): O(1) push/pop at both ends, O(N) indexed access in the middle.

### Q13. Sets
```
SADD tags:post:1 redis cache nodejs
SMEMBERS tags:post:1
SISMEMBER tags:post:1 redis
SCARD tags:post:1
SREM tags:post:1 cache
SINTER tags:post:1 tags:post:2     # intersection
SUNION a b; SDIFF a b
SRANDMEMBER tags:post:1 2
SPOP tags:post:1
```
Unordered, unique members. `SMEMBERS` on a huge set blocks the server: use `SSCAN`.

### Q14. Sorted sets (ZSET) *(Must-know)*
```
ZADD leaderboard 1500 "ritesh" 1200 "amit" 1800 "neha"
ZRANGE leaderboard 0 2 REV WITHSCORES      # top 3 (6.2 syntax)
ZREVRANK leaderboard "ritesh"              # 0-based rank from top
ZSCORE leaderboard "ritesh"
ZINCRBY leaderboard 50 "ritesh"
ZRANGEBYSCORE leaderboard 1000 1600        # legacy; use ZRANGE ... BYSCORE
ZREM leaderboard "amit"
ZCARD leaderboard
```
Each member is unique with a floating-point score; ordered by score then lexicographically. Operations are O(log N) via a **skiplist + hash table**.

### Q15. Deleting and inspecting keys
```
DEL key1 key2           # synchronous delete (O(N) for big collections)
UNLINK key1             # asynchronous delete (non-blocking), preferred for big keys
EXISTS key
TYPE key
RENAME old new
KEYS user:*             # O(N), blocks the server: avoid in production
SCAN 0 MATCH user:* COUNT 100   # incremental, safe
```

### Q16. `KEYS` vs `SCAN` *(Must-know)*
`KEYS pattern` walks the whole keyspace in one blocking call (O(N)), freezing a single-threaded server for large datasets. `SCAN cursor [MATCH] [COUNT]` iterates incrementally with a cursor; it may return duplicates and gives no snapshot guarantee, but never blocks for long. Related: `SSCAN`, `HSCAN`, `ZSCAN`. Loop until the returned cursor is `0`.

### Q17. What is persistence in Redis?
Redis is in-memory, but it can write data to disk so it survives restarts:
- **RDB**: point-in-time snapshots (`dump.rdb`).
- **AOF** (Append Only File): logs every write command.
- **RDB + AOF** together, or **none** (pure cache).
Persistence trades performance and disk for durability. Detailed comparison in Q40.

### Q18. What are Redis databases (`SELECT`)?
Logical keyspaces numbered 0 to `databases - 1` (default 16) inside one instance. They share memory, config, and persistence; they are **not** isolated for security or performance. Cluster mode supports only DB 0. Modern practice: use key prefixes or separate instances instead.

### Q19. Common use cases
Caching (DB query results, API responses, rendered pages), session store, rate limiting, leaderboards, real-time analytics counters, job queues (BullMQ), pub/sub messaging, distributed locks, geospatial lookups, feature flags, unique visitor counts (HyperLogLog), deduplication, and vector/semantic caching for LLM apps.

### Q20. Atomicity of Redis commands
Each command is **atomic** because commands run one at a time on the main thread. `INCR`, `HSET`, `LPUSH`, `SET NX` etc. cannot interleave with another client's command. Multi-command atomicity needs `MULTI/EXEC`, Lua scripts or Functions.

### Q21. `INCR` for counters and why not GET+SET?
```
INCR page:views          # atomic, returns new value
```
Doing `GET` then `SET` in the client has a race: two clients read 5 and both write 6 (lost update). `INCR` does the read-modify-write on the server atomically. A non-existent key is treated as 0.

### Q22. Pipelining *(Must-know)*
Send many commands without waiting for each reply, then read all replies. This cuts network **round-trip time (RTT)**, not server work.
```js
const pipeline = redis.pipeline();      // ioredis
pipeline.set("a", 1).incr("a").get("a");
const results = await pipeline.exec();  // [[null,"OK"],[null,2],[null,"2"]]
```
Pipelining is **not** atomic (other clients' commands can interleave) unlike `MULTI/EXEC`. Batch in chunks (for example 1000 commands) to avoid huge buffers.

### Q23. Pub/Sub basics
```
# subscriber
SUBSCRIBE news
# publisher
PUBLISH news "hello"
PSUBSCRIBE news:*
```
Fire-and-forget: messages are delivered to currently connected subscribers only; no persistence, no replay, no acknowledgements. If the subscriber is offline the message is lost. Use **Streams** when you need durability.

### Q24. Basic Node.js usage (ioredis)
```js
import Redis from "ioredis";
const redis = new Redis({ host: "127.0.0.1", port: 6379, password: process.env.REDIS_PASSWORD });

await redis.set("user:1", JSON.stringify({ name: "Ritesh Kumar" }), "EX", 3600);
const user = JSON.parse(await redis.get("user:1"));
await redis.hset("user:2", { name: "Amit", age: 30 });
console.log(await redis.hgetall("user:2"));
```
```js
// node-redis v4+
import { createClient } from "redis";
const client = createClient({ url: process.env.REDIS_URL });
client.on("error", (e) => console.error("Redis error", e));
await client.connect();
await client.set("k", "v", { EX: 60 });
```
Create **one client per process**, reuse it, and handle `error` events (an unhandled `error` event crashes Node).

### Q25. Serialization
Redis stores bytes. Use `JSON.stringify/parse` (simple, human-readable), MessagePack/Protobuf (compact, faster), or hashes for flat objects. Remember `Date`, `BigInt`, `undefined` do not round-trip through JSON. Version your serialized schema to survive deployments.

### Q26. What happens when Redis runs out of memory?
Governed by `maxmemory` and `maxmemory-policy`. With `noeviction` (default for a plain server) writes fail with `OOM command not allowed when used memory > 'maxmemory'`. With an eviction policy (`allkeys-lru`, `allkeys-lfu`, `volatile-ttl`, ...) Redis evicts keys to make room. If `maxmemory` is unset, Redis uses all RAM and the OS may swap or the OOM killer may kill it. See Q44.

### Q27. What is RESP?
**REdis Serialization Protocol**: a simple text/binary-safe request-response protocol (RESP2; RESP3 since 6.0 adds richer types like maps, sets, doubles, push messages). Easy to implement and debug with `telnet`/`nc`. Example: `*2\r\n$3\r\nGET\r\n$1\r\na\r\n`.

### Q28. Monitoring basics
```
INFO                      # all sections
INFO memory; INFO stats; INFO replication; INFO clients
DBSIZE
MONITOR                   # streams all commands (debug only; high overhead!)
SLOWLOG GET 10            # slow commands
CLIENT LIST
```
Key metrics: `used_memory`, `mem_fragmentation_ratio`, `connected_clients`, `instantaneous_ops_per_sec`, `keyspace_hits/misses`, `evicted_keys`, `rejected_connections`, replication lag.

### Q29. Cache hit ratio
`hit ratio = keyspace_hits / (keyspace_hits + keyspace_misses)` from `INFO stats`. Aim for high values (90%+ for typical read caches), but interpret in context: a low ratio means keys are too short-lived, caches are too small, keys are poorly designed, or access is not repetitive.

### Q30. TTL best practices
Always set a TTL on cached data (unbounded caches become memory leaks). Add **jitter** (random +/-10-20%) so keys do not expire together (avalanche). Pick TTLs from data volatility and acceptable staleness, not guesses.

### Q31. Bitmaps
```
SETBIT active:2025-10-24 1001 1       # user 1001 was active
GETBIT active:2025-10-24 1001
BITCOUNT active:2025-10-24            # number of active users
BITOP AND both active:2025-10-24 active:2025-10-25
```
Compact: 1 bit per user (100M users ≈ 12.5 MB).

### Q32. HyperLogLog
```
PFADD visitors:today u1 u2 u3
PFCOUNT visitors:today          # approx unique count, ~0.81% standard error
PFMERGE visitors:week visitors:mon visitors:tue
```
Fixed ~12 KB per key regardless of cardinality. Use for approximate unique counts where exactness is not required.

### Q33. Geospatial
```
GEOADD shops 77.2090 28.6139 "delhi-store" 72.8777 19.0760 "mumbai-store"
GEODIST shops delhi-store mumbai-store km
GEOSEARCH shops FROMLONLAT 77.2 28.6 BYRADIUS 50 km ASC WITHDIST   # 6.2
```
Stored as a sorted set with geohash scores.

### Q34. `EXPIRE` vs `SET ... EX`
`SET key v EX 60` is a single atomic command. `SET` then `EXPIRE` as two commands has a window where the process can crash between them leaving a **key that never expires** (classic lock/cache bug). Prefer the atomic form.

### Q35. What is a cache key and how do you design one?
A unique string that identifies cached content. Include everything the response depends on: entity, id, version, locale, user role/tenant, query params. Example: `v2:product:123:lang=en:currency=INR`. Missing a dimension (for example tenant) causes **cache poisoning / data leakage** between users.

### Q36. What is a session store and why Redis?
HTTP is stateless; sessions keep login state. Storing sessions in app memory breaks with multiple servers and restarts. Redis offers fast shared access with automatic TTL expiry.
```js
// express-session + connect-redis
import session from "express-session";
import { RedisStore } from "connect-redis";
app.use(session({
  store: new RedisStore({ client, prefix: "sess:" }),
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 86_400_000 },
}));
```

### Q37. Basic rate limiter (fixed window)
```js
async function allow(userId, limit = 100, windowSec = 60) {
  const key = `rl:${userId}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, windowSec);
  return n <= limit;
}
```
Simple but allows bursts at window edges (up to 2x). Better algorithms in Q61. Note the INCR+EXPIRE pair is not atomic; use Lua or `SET NX EX` + `INCR` to be safe.

### Q38. Redis CLI useful flags
```bash
redis-cli --scan --pattern 'user:*' | head
redis-cli --bigkeys               # sample biggest keys per type
redis-cli --memkeys               # memory usage by key (7.x)
redis-cli --latency               # measure latency
redis-cli --stat                  # rolling stats
redis-cli -x SET key < file.txt
redis-cli --pipe < commands.txt   # mass insert
```

### Q39. What is `FLUSHDB` / `FLUSHALL`?
`FLUSHDB` removes all keys in the current DB; `FLUSHALL` removes all keys in all DBs. Both are destructive; use `ASYNC` mode to avoid blocking and restrict them with ACLs or `rename-command`/ACL denial in production.

---

# 🔵 Part 2: Junior (1–3 years)

### Q40. RDB vs AOF persistence *(Must-know)*
| | RDB | AOF |
|---|---|---|
| What | Compact binary snapshot at intervals | Log of every write command |
| Trigger | `save 3600 1 300 100 60 10000`, `BGSAVE` | `appendonly yes`, `appendfsync` policy |
| Durability | Can lose minutes of data | At most ~1 s (`everysec`) or near zero (`always`) |
| Restart speed | Fast | Slower (replay), mitigated by RDB preamble |
| File size | Small | Larger; rewritten by `BGREWRITEAOF` |
| Impact | Fork + copy-on-write memory spike | Disk I/O, fsync latency |
Recommended for durability: **AOF with `everysec`** (7.0 uses multi-part AOF with an RDB base). For pure caches: disable persistence.
```
appendonly yes
appendfsync everysec     # always | everysec | no
aof-use-rdb-preamble yes
```

### Q41. How does `BGSAVE` work (fork + copy-on-write)?
Redis `fork()`s a child process. The child writes the snapshot from its frozen view of memory while the parent keeps serving requests; pages modified by the parent are copied lazily (**copy-on-write**). Under heavy writes, memory can nearly double and the fork itself can pause the server (milliseconds to seconds on huge datasets or some virtualized hosts). Mitigate: leave headroom, disable Transparent Huge Pages, schedule snapshots off-peak, snapshot on a replica.

### Q42. Eviction policies *(Must-know)*
Set with `maxmemory-policy`:
- `noeviction`: reject writes when full.
- `allkeys-lru` / `allkeys-lfu` / `allkeys-random`: evict from all keys.
- `volatile-lru` / `volatile-lfu` / `volatile-random` / `volatile-ttl`: evict only keys with a TTL.
Redis uses **approximated LRU/LFU** by sampling (`maxmemory-samples`, default 5). For a general cache use `allkeys-lru` or `allkeys-lfu` (LFU handles scan-resistant hot sets better). `volatile-*` policies behave like `noeviction` if no key has a TTL.

### Q43. `maxmemory` sizing
Set `maxmemory` below physical RAM to leave room for the OS, fork copy-on-write, replication/client output buffers and fragmentation (often 60-75% of RAM on a persistent instance; more on a pure cache). Monitor `used_memory_rss` vs `used_memory` (fragmentation ratio) and `evicted_keys`.

### Q44. Cache-aside (lazy loading) pattern *(Must-know)*
The application checks the cache first; on a miss it reads the database, then populates the cache.
```js
async function getUser(id) {
  const key = `user:${id}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);                 // hit

  const user = await db.users.findById(id);              // miss → source of truth
  if (user) await redis.set(key, JSON.stringify(user), "EX", 300);
  return user;
}
async function updateUser(id, data) {
  await db.users.update(id, data);
  await redis.del(`user:${id}`);                         // invalidate
}
```
Pros: only requested data is cached; resilient to cache failure. Cons: first request is slow (cold start), staleness windows, race conditions (Q58).

### Q45. Write-through, write-back (write-behind), write-around *(Must-know)*
| Strategy | Flow | Pros | Cons |
|---|---|---|---|
| **Write-through** | Write to cache and DB synchronously | Cache is always fresh | Higher write latency; caches data never read |
| **Write-back / write-behind** | Write to cache, flush to DB asynchronously | Very fast writes, batching | Data loss risk if cache dies before flush; complexity |
| **Write-around** | Write to DB only, cache fills on read | Avoids cache pollution | Reads after write miss |
| **Read-through** | Cache layer fetches from DB itself on miss | Simpler app code | Needs a cache library/provider |
| **Refresh-ahead** | Proactively refresh before expiry | No miss latency for hot keys | Wasted work for cold keys |

### Q46. Cache invalidation: why is it hard?
"There are only two hard things in computer science: cache invalidation and naming things." You must decide when cached data is wrong. Strategies: **TTL** (simple, bounded staleness), **explicit invalidation** on write (`DEL`), **versioned keys** (`user:42:v7`; bump version instead of deleting), **event-driven** (DB change streams/CDC/Pub/Sub publish invalidations), **tag-based** (set of keys per tag). Combine TTL as a safety net with explicit invalidation for freshness.

### Q47. Cache stampede (thundering herd / dog-piling) *(Must-know)*
When a hot key expires, many concurrent requests miss simultaneously and all hit the database to recompute the same value, possibly overloading it.
Mitigations:
1. **Mutex / single-flight lock** so only one request rebuilds.
2. **Stale-while-revalidate**: serve slightly stale data while one worker refreshes.
3. **Probabilistic early refresh** (XFetch).
4. **TTL jitter** and refresh-ahead for hot keys.
5. In-process request coalescing (promise sharing).
```js
const inflight = new Map();
async function getCached(key, loader, ttl = 300) {
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  if (inflight.has(key)) return inflight.get(key);      // coalesce in this process
  const p = (async () => {
    const lock = await redis.set(`lock:${key}`, "1", "EX", 10, "NX");
    if (!lock) { await sleep(50); return getCached(key, loader, ttl); }   // someone else rebuilds
    try {
      const v = await loader();
      await redis.set(key, JSON.stringify(v), "EX", ttl + Math.floor(Math.random() * 30));
      return v;
    } finally { await redis.del(`lock:${key}`); }
  })().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
```

### Q48. Cache penetration
Repeated requests for keys that **do not exist** (invalid ids, attacks) always miss the cache and hit the DB.
Fixes: **cache negative results** briefly (`"null"` marker with short TTL), validate input early, use a **Bloom filter** of valid ids, rate limit abusive clients.

### Q49. Cache avalanche
Many keys expire at the same instant (or the cache goes down), sending a flood to the database.
Fixes: **TTL jitter**, staggered warm-up, high availability (replicas/Sentinel/Cluster), circuit breakers and request shedding, multi-level caching (local + Redis), graceful degradation.

### Q50. Hot key and big key problems
- **Hot key**: one key receives disproportionate traffic (celebrity profile). Single shard/CPU bottleneck. Fix: local in-process cache, replicate key under multiple names (`key#1..N`) and pick randomly, client-side caching, read from replicas.
- **Big key**: a huge value/collection (multi-MB string, hash with millions of fields). Causes latency spikes on `DEL`, replication, and serialization. Fix: split into smaller keys/shards, use `UNLINK`, scan with `--bigkeys`, set size limits.

### Q51. Transactions: `MULTI` / `EXEC` / `WATCH` *(Must-know)*
```
MULTI
INCR a
SET b 1
EXEC          # all queued commands run sequentially, without interleaving
```
Commands are **queued** and executed atomically in one block. Redis has **no rollback**: if a command fails at runtime (wrong type), others still run; syntax errors at queue time abort the whole transaction. **Optimistic locking** with `WATCH`:
```
WATCH balance
val = GET balance
MULTI
SET balance (val - 10)
EXEC          # returns nil if "balance" changed since WATCH → retry
```

### Q52. Lua scripting with `EVAL`
```
EVAL "local c = redis.call('INCR', KEYS[1]) if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end return c" 1 rl:user1 60
```
Scripts run **atomically** on the server (no other command interleaves), reducing round trips. Rules: pass keys via `KEYS[]` (needed for Cluster routing) and values via `ARGV[]`; keep scripts short (they block the server); cache with `EVALSHA`/`SCRIPT LOAD`. Redis 7 adds **Functions** (`FUNCTION LOAD`/`FCALL`): named, persisted, replicated libraries.

### Q53. Distributed lock with `SET NX PX` *(Must-know)*
```js
const token = crypto.randomUUID();
const ok = await redis.set("lock:invoice:42", token, "PX", 30000, "NX");
if (ok) {
  try { /* critical section */ }
  finally {
    // release only if we still own it (atomic compare-and-delete)
    await redis.eval(
      `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`,
      1, "lock:invoice:42", token);
  }
}
```
Rules: unique token per holder, always set an expiry (a crashed holder cannot deadlock the system), release via compare-and-delete. Caveats about correctness are in Q94 (Redlock debate).

### Q54. Optimistic vs pessimistic concurrency in Redis
**Pessimistic:** take a lock (`SET NX PX`) before touching shared data. **Optimistic:** `WATCH` keys, run `MULTI/EXEC`, and retry if `EXEC` returns `nil`. Optimistic is cheaper under low contention; locks are simpler when the critical section spans external systems. A single Lua script is often better than either for pure-Redis read-modify-write.

### Q55. Pub/Sub vs Streams vs Lists as queues
| | Pub/Sub | List (`LPUSH`/`BRPOP`) | Stream |
|---|---|---|---|
| Persistence | No | Yes (in memory/AOF) | Yes |
| Replay | No | No (popped) | Yes (by ID) |
| Consumer groups / ack | No | No | Yes (`XREADGROUP`, `XACK`) |
| Fan-out | Yes | No (one consumer pops) | Yes (multiple groups) |
| Best for | Ephemeral notifications | Simple work queue | Reliable event log / queue |

### Q56. Streams *(Must-know)*
```
XADD orders * userId 42 amount 999         # * = auto ID like 1729760000000-0
XLEN orders
XRANGE orders - + COUNT 10
XREAD COUNT 10 BLOCK 5000 STREAMS orders $
XGROUP CREATE orders workers $ MKSTREAM
XREADGROUP GROUP workers c1 COUNT 10 BLOCK 5000 STREAMS orders >
XACK orders workers 1729760000000-0
XPENDING orders workers
XAUTOCLAIM orders workers c2 60000 0-0     # take over messages idle > 60 s (6.2)
XTRIM orders MAXLEN ~ 100000                # cap size
```
An append-only log with unique ordered IDs. **Consumer groups** distribute messages across consumers with at-least-once delivery, a pending entries list (PEL), acknowledgements and re-claiming of dead consumers' messages.

### Q57. Leaderboard example
```js
await redis.zadd("lb:game1", 2500, "ritesh");
await redis.zincrby("lb:game1", 100, "ritesh");
const top10 = await redis.zrevrange("lb:game1", 0, 9, "WITHSCORES");
const rank  = await redis.zrevrank("lb:game1", "ritesh");   // 0-based
```
All operations are O(log N): millions of players are fine.

### Q58. Race conditions in cache-aside
Sequence: A reads DB (old value) → B updates DB and deletes cache → A writes the old value into cache. Cache now stale until TTL. Mitigations: short TTLs, **delete after write** (not update), delayed double delete, versioned values/compare-and-set, serialize writes per key, or change-data-capture driven invalidation. Accept bounded staleness or use stronger patterns for critical data.

### Q59. Delete vs update the cache on write
Prefer **invalidating (deleting)** over updating: updates risk races (two writers write out of order), cache wrong-shaped data, and waste work for unread keys. The next read repopulates from the source of truth.

### Q60. Connection pooling and connections in Node
Redis clients multiplex many commands over **one TCP connection** with pipelining, so a single client per process is usually enough. Exceptions: blocking commands (`BLPOP`, `XREAD BLOCK`) and Pub/Sub subscribers need **dedicated connections**. In serverless, reuse the client across invocations and cap connections (`maxclients` default 10000).

### Q61. Rate limiting algorithms
| Algorithm | Idea | Notes |
|---|---|---|
| Fixed window | `INCR` per time bucket | Simple, boundary bursts |
| Sliding window log | ZSET of timestamps per user | Accurate, memory per request |
| Sliding window counter | Weighted previous + current window | Good compromise |
| Token bucket | Refill rate + burst capacity | Smooth, allows bursts |
| Leaky bucket | Constant drain rate | Smooths traffic |
```js
// Sliding window log with ZSET (atomic via Lua in production)
const now = Date.now(), win = 60_000;
await redis.zremrangebyscore(key, 0, now - win);
const count = await redis.zcard(key);
if (count < limit) { await redis.zadd(key, now, `${now}-${Math.random()}`); await redis.pexpire(key, win); }
```
Wrap the multi-step logic in a Lua script/Function for atomicity.

### Q62. Atomic counter with expiry in one step
```lua
-- KEYS[1]=key, ARGV[1]=ttl seconds
local c = redis.call("INCR", KEYS[1])
if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
return c
```
Or Redis 7+: `EXPIRE key 60 NX` (set expiry only if none) pipelined with `INCR`.

### Q63. `EXPIRE` options (7.0)
`EXPIRE key 60 NX` (only if no expiry), `XX` (only if has expiry), `GT` (only if new TTL greater), `LT` (only if less). Useful for sliding sessions (`GT`) without race conditions.

### Q64. Memory optimization basics
Use hashes for many small objects (listpack encoding: `hash-max-listpack-entries`, `hash-max-listpack-value`), short keys, integers where possible, compress large values client-side (gzip/LZ4/zstd), set TTLs, avoid giant collections, choose `ziplist`/listpack-friendly sizes, and check `MEMORY USAGE key` and `OBJECT ENCODING key`.

### Q65. `OBJECT ENCODING` and why it matters
Redis picks compact encodings for small values (`int`, `embstr`, `listpack`, `intset`) and switches to general ones (`raw`, `hashtable`, `skiplist`, `quicklist`) as size grows. Compact encodings save memory but are O(N) to scan; thresholds are tunable.

### Q66. Replication basics *(Must-know)*
Asynchronous leader-follower: a **replica** (`REPLICAOF host port`) connects to the **primary**, performs a full sync (RDB transfer) then streams the command stream. Replicas are read-only by default and can serve reads (with possibly stale data). Partial resync uses the replication backlog and replication ID/offset after short disconnects. `WAIT numreplicas timeout` blocks until replicas ack (still not strong consistency).

### Q67. Sentinel *(Must-know)*
**Redis Sentinel** provides high availability for non-clustered Redis: monitoring, notification, automatic **failover**, and service discovery. Run **3 or more** Sentinels (odd number, on separate hosts) with a `quorum` (for example 2 of 3) to agree the primary is down (SDOWN → ODOWN), elect a leader, promote a replica, and reconfigure others. Clients ask Sentinels for the current primary (ioredis: `sentinels: [...]`, `name: "mymaster"`).

### Q68. Redis Cluster *(Must-know)*
Horizontal sharding: the keyspace is split into **16384 hash slots**; `slot = CRC16(key) mod 16384`. Each primary owns a slot range and can have replicas. Clients get redirected with `-MOVED slot host:port` (permanent) or `-ASK` (during migration). Cluster-aware clients cache the slot map. Minimum recommended: **3 primaries + 3 replicas**. Multi-key commands work only if all keys hash to the same slot; use **hash tags** `{user:42}:cart` and `{user:42}:profile` to colocate.

### Q69. Sentinel vs Cluster
| | Sentinel | Cluster |
|---|---|---|
| Purpose | HA (failover) | HA + sharding |
| Data size | Limited to one node's RAM | Scales with shards |
| Multi-key ops | All allowed | Same-slot only |
| Databases | 0-15 | DB 0 only |
| Complexity | Lower | Higher |
Use Sentinel when data fits one node; Cluster when you need to scale memory/throughput.

### Q70. ACLs and authentication
```
ACL SETUSER app on >S3cretPass ~shop:* +@read +@write -@dangerous
ACL SETUSER readonly on >pass ~* +@read
ACL LIST; ACL WHOAMI
AUTH app S3cretPass
```
Redis 6+ ACLs control users, passwords, allowed commands/categories, key patterns and Pub/Sub channels. Disable the `default` user or give it a strong password, and never expose Redis to the public internet.

### Q71. Basic security checklist
Bind to private interfaces (`bind`), keep `protected-mode yes`, firewall port 6379, enable **TLS** (`tls-port`), use ACL users with least privilege, disable/rename dangerous commands (`FLUSHALL`, `CONFIG`, `DEBUG`, `KEYS`), don't run as root, keep patched. An open Redis has historically been exploited for remote code execution via `CONFIG SET dir` + `SAVE`.

### Q72. `MONITOR`, `SLOWLOG` and latency tools
`MONITOR` prints every command (use for seconds only; it can halve throughput). `SLOWLOG GET` lists commands exceeding `slowlog-log-slower-than` (microseconds). `LATENCY DOCTOR`, `LATENCY HISTORY`, and `redis-cli --latency` help with intrinsic latency and spike analysis.

### Q73. Time complexity awareness
Know Big-O: `GET/SET/INCR/HGET/LPUSH/SADD/ZADD` O(1) or O(log N); `KEYS`, `SMEMBERS`, `HGETALL`, `LRANGE 0 -1`, `ZRANGE 0 -1`, `DEL` on big collections, `FLUSHALL` are O(N) and can block. Documentation lists complexity for every command.

### Q74. HTTP caching basics (client/CDN layer)
`Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=60`, `ETag`/`If-None-Match` (conditional requests returning `304 Not Modified`), `Last-Modified`, `Vary`. The browser cache and CDN absorb traffic before it reaches your servers or Redis; use fingerprinted filenames (`app.3f9a1c.js`) with `immutable` for static assets.

### Q75. Cache layers in a typical web stack
Browser cache → CDN/edge → reverse proxy (Nginx/Varnish) → application in-process cache (LRU map) → distributed cache (Redis) → database buffer cache. Each layer trades freshness for speed; place data in the layer closest to the user that its freshness requirements allow.

### Q76. In-process cache vs Redis
| | In-process (Map/LRU) | Redis |
|---|---|---|
| Latency | Nanoseconds | ~0.2-1 ms (network) |
| Shared across instances | No | Yes |
| Consistency | Each instance differs | Single shared view |
| Memory | Competes with app heap | Dedicated |
| Invalidation | Needs broadcast (Pub/Sub) | Central |
Combine them: tiny local TTL (1-5 s) in front of Redis for hot keys.

### Q77. Using Redis with Express (middleware cache)
```js
const cache = (ttl) => async (req, res, next) => {
  const key = `http:${req.originalUrl}`;
  const hit = await redis.get(key);
  if (hit) { res.set("X-Cache", "HIT"); return res.type("json").send(hit); }
  const send = res.send.bind(res);
  res.send = (body) => { if (res.statusCode === 200) redis.set(key, body, "EX", ttl); res.set("X-Cache", "MISS"); return send(body); };
  next();
};
app.get("/api/products", cache(60), listProducts);
```
Do not cache per-user/private responses under a shared key; include user identity or skip caching.

### Q78. Mongoose / SQL query result caching
Cache the **result of an expensive query** keyed by a normalized hash of the query + params. Invalidate by tag/version when underlying collections change. Avoid hiding N+1 problems behind a cache: fix the query first.

---

# 🟡 Part 3: Mid (3–5 years)

### Q79. Redis single-threaded model: details *(Must-know)*
Command execution happens on **one main thread**, so commands are serialized and atomic; slow commands block everyone. Background threads handle `UNLINK`/lazy free, `fsync` for AOF, closing files, and (optional) **I/O threads** (`io-threads 4`) for socket read/write and protocol parsing. Scale CPU by running more shards/instances, not by expecting parallel command execution.

### Q80. Lazy freeing
`UNLINK`, `FLUSHALL ASYNC`, and config options `lazyfree-lazy-eviction`, `lazyfree-lazy-expire`, `lazyfree-lazy-server-del`, `replica-lazy-flush` free memory of big objects in a background thread so the main thread isn't blocked. In Redis 7+, several of these default to `yes`.

### Q81. Expiration internals
Keys with a TTL are tracked in an expires dictionary. **Passive**: expired on access. **Active**: about 10 times per second Redis samples 20 keys with TTLs per DB; if more than 25% are expired it repeats. So expired keys can still occupy memory briefly. On replicas, keys are not expired independently: the primary sends `DEL`.

### Q82. Eviction internals: approximate LRU and LFU
Redis keeps a 24-bit field per object. **LRU** stores last access time; Redis samples `maxmemory-samples` keys (default 5, raise to 10 for accuracy) and evicts the least recently used. **LFU** stores an 8-bit logarithmic counter (`lfu-log-factor`) with time decay (`lfu-decay-time`). LFU keeps frequently used keys even after bursts of one-time scans.

### Q83. Persistence trade-offs in practice
- Pure cache: no persistence; accept cold start after restart; rely on replicas.
- Cache with warm restart: RDB every few minutes.
- Primary data store: AOF `everysec` + RDB snapshots + replicas + off-host backups. For near-zero loss, `appendfsync always` plus `WAIT`, at big throughput cost; if you truly need that, reconsider using a durable database as the source of truth.

### Q84. AOF rewrite and multi-part AOF (7.0)
`BGREWRITEAOF` compacts the AOF by writing the minimal commands (or an RDB-format base) to rebuild current state. Redis 7.0 stores AOF as a **base file + incremental files + manifest** in `appenddirname`. Auto-rewrite triggers via `auto-aof-rewrite-percentage` and `auto-aof-rewrite-min-size`. Use `redis-check-aof --fix` for a truncated tail after a crash.

### Q85. Replication in depth: full vs partial resync
- **Full sync**: replica sends `PSYNC ? -1`; primary forks, creates an RDB (disk or diskless), streams it, then sends the writes buffered meanwhile.
- **Partial resync**: replica sends `PSYNC <replid> <offset>`; if the offset is still inside the primary's **replication backlog** (`repl-backlog-size`), only missed commands are sent.
Size the backlog for your longest expected disconnect × write rate. Replication is **asynchronous**: acknowledged writes can be lost on failover.

### Q86. `min-replicas-to-write` and data-loss windows
```
min-replicas-to-write 1
min-replicas-max-lag 10
```
The primary refuses writes if fewer than N replicas are connected with lag ≤ M seconds. This narrows (but does not eliminate) the loss window during partitions. `WAIT 1 100` after critical writes confirms that at least one replica received them.

### Q87. Sentinel failover steps
1. Sentinels mark the primary **SDOWN** (subjectively down) after `down-after-milliseconds`.
2. When `quorum` Sentinels agree → **ODOWN**.
3. Sentinels elect a leader (majority of all Sentinels).
4. The leader picks the best replica (priority, replication offset, run ID) and sends `REPLICAOF NO ONE`.
5. Other replicas are reconfigured; clients are notified (`+switch-master`).
Clients must be Sentinel-aware and retry during the failover window (typically 10–30 s).

### Q88. Cluster details: slots, gossip, failover
Nodes communicate over the **cluster bus** (port + 10000) using a gossip protocol. A primary is marked `PFAIL`, then `FAIL` when a majority of primaries agree. Its replica requests votes and is promoted. `cluster-require-full-coverage yes` makes the cluster stop accepting writes if any slot lacks an owner (set `no` for partial availability). Resharding moves slots live (`redis-cli --cluster reshard`) using `MIGRATE`; keys in transit cause `-ASK` redirects.

### Q89. Hash tags and cross-slot errors
`CROSSSLOT Keys in request don't hash to the same slot` occurs for `MGET a b`, `MULTI` with keys in different slots, and Lua scripts touching keys in different slots. Fix with hash tags: only the substring inside `{}` is hashed.
```
SET {user:42}:profile "..."
SET {user:42}:cart "..."
MGET {user:42}:profile {user:42}:cart       # same slot → OK
```
Caution: overusing one tag creates a hot slot.

### Q90. Pipelining in Cluster
Clients group commands per node. ioredis `cluster.pipeline()` handles this; commands in a single `MULTI` must share a slot. A large `MGET` across slots should be split per slot/node by the client.

### Q91. Pub/Sub details: patterns, sharded Pub/Sub (7.0)
Classic Pub/Sub broadcasts to **all nodes** in a cluster (costly at scale). **Sharded Pub/Sub** (`SSUBSCRIBE`, `SPUBLISH`) routes channels by hash slot like keys, so messages stay within a shard. In RESP2 a subscribed connection can only run (P/S)SUBSCRIBE, (P/S)UNSUBSCRIBE, PING and QUIT. Slow subscribers can be disconnected by `client-output-buffer-limit pubsub`.

### Q92. Stream consumer groups: delivery semantics
Each message is delivered to **one consumer per group** (at-least-once). Unacked messages sit in the **PEL**. If a consumer dies, others reclaim with `XAUTOCLAIM`/`XCLAIM` after an idle threshold. Handlers must be **idempotent**. For dead-letter handling, check the delivery count from `XPENDING` and move poison messages to a DLQ stream. Trim with `XTRIM MAXLEN ~` or `MINID` to bound memory.

### Q93. Job queues on Redis: BullMQ
```js
import { Queue, Worker } from "bullmq";
const connection = { host: "127.0.0.1", port: 6379 };
const emailQueue = new Queue("emails", { connection });
await emailQueue.add("welcome", { to: "ritesh@example.com" },
  { attempts: 3, backoff: { type: "exponential", delay: 1000 }, removeOnComplete: 1000 });
new Worker("emails", async (job) => sendEmail(job.data), { connection, concurrency: 10 });
```
Features: retries, delays, priorities, rate limits, repeatable jobs, flows. BullMQ needs `maxmemory-policy noeviction` (evicting queue keys corrupts state).

### Q94. Distributed locks: Redlock and the correctness debate *(Must-know)*
**Redlock** acquires the same lock on N (usually 5) independent Redis primaries; success if a majority is acquired within a validity time. Martin Kleppmann's critique: lock expiry plus process pauses (GC, network delay) mean two clients can believe they hold the lock; for correctness you need **fencing tokens** (monotonically increasing numbers checked by the protected resource). Practical stance: use Redis locks for **efficiency** (avoid duplicate work); for **correctness** use fencing tokens, database constraints/transactions, or a consensus system (ZooKeeper/etcd). Keep critical sections short and renew the lease with a watchdog if needed.

### Q95. Idempotency keys with Redis
```js
const first = await redis.set(`idem:${key}`, "processing", "EX", 86400, "NX");
if (!first) return await redis.get(`result:${key}`);   // replay stored response
// ... process, then store result
await redis.set(`result:${key}`, JSON.stringify(res), "EX", 86400);
```
Protects payment/order APIs from duplicate submissions; store the final response and handle the in-progress state.

### Q96. Client-side caching / tracking (6.0)
`CLIENT TRACKING ON` (RESP3) lets the server remember which keys a client read and push **invalidation messages** when they change. The client keeps a local cache with near-zero latency and stays correct via invalidations. Modes: default (per-key), broadcasting (prefix), opt-in/opt-out. Costs server memory for the tracking table.

### Q97. Redis modules, Redis Stack and Redis 8
Historically separate modules: **RedisJSON**, **RediSearch**, **RedisTimeSeries**, **RedisBloom**, **RedisGraph** (deprecated). Redis 8 bundles JSON, Search & Query (including vector search), TimeSeries and probabilistic data types in the core distribution, plus new **Vector Sets** (beta). Verify availability and licensing for your provider.

### Q98. RedisJSON basics
```
JSON.SET user:1 $ '{"name":"Ritesh Kumar","skills":["node","redis"],"addr":{"city":"Delhi"}}'
JSON.GET user:1 $.addr.city
JSON.ARRAPPEND user:1 $.skills '"mongodb"'
JSON.NUMINCRBY user:1 $.visits 1
```
Gives path-based partial reads/updates of documents without client-side parse/serialize.

### Q99. RediSearch (secondary indexes and full-text)
```
FT.CREATE idx:products ON JSON PREFIX 1 product: SCHEMA $.name AS name TEXT $.price AS price NUMERIC SORTABLE $.tags[*] AS tags TAG
FT.SEARCH idx:products "@name:laptop @price:[500 1500]" SORTBY price LIMIT 0 10
FT.AGGREGATE idx:products "*" GROUPBY 1 @tags REDUCE COUNT 0 AS n
```
Adds SQL-like querying, full-text search, aggregation and **vector similarity** (`VECTOR` fields, `KNN`) on Redis data.

### Q100. Semantic caching for LLM apps
Store embeddings of prompts with responses; for a new prompt, run a vector similarity search and return the cached answer when similarity exceeds a threshold. Saves cost and latency. Risks: wrong hits (tune the threshold; include model/version/system-prompt/user scope in the key or filter), staleness, privacy leakage across users.

### Q101. Cache warming and cold start
Pre-populate hot keys after deploy or failover (batch job, replaying top queries). Rate limit warmers so they don't overload the DB. Use **persistence + replicas** so a restart doesn't begin from empty, and shift traffic gradually onto a cold cache.

### Q102. Multi-level (L1/L2) caching
L1 = in-process (tiny TTL, size-bounded LRU such as `lru-cache`), L2 = Redis, L3 = DB. Invalidate L1 across instances via Redis Pub/Sub or client tracking. Provide metrics per layer. Beware inconsistent reads between instances.

### Q103. Serialization and compression trade-offs
JSON is portable; MessagePack/Protobuf/CBOR are smaller and faster; compressing values over ~1 KB with LZ4/zstd cuts memory and network at some CPU cost. Never deserialize untrusted data with formats that can execute code (language-specific pickle/Java serialization).

### Q104. Multi-tenancy
Prefix keys with the tenant (`t:{tenantId}:...`), enforce via ACL key patterns, consider separate instances for noisy or regulated tenants, set per-tenant quotas, and watch for hot tenants.

### Q105. Memory fragmentation
`mem_fragmentation_ratio = used_memory_rss / used_memory`. Above ~1.5 means fragmentation (wasted RSS); below 1 means swapping. Causes: many deletes/resizes, varied value sizes. Fix: enable `activedefrag yes` (jemalloc), fail over to a fresh replica, reduce churn.

### Q106. Transparent Huge Pages and latency
THP makes `fork()` copy-on-write expensive (copying 2 MB pages) and causes latency spikes. Redis warns on startup; disable with `echo never > /sys/kernel/mm/transparent_hugepage/enabled`. Also set `vm.overcommit_memory = 1` so `fork` doesn't fail under memory pressure, and tune `tcp-backlog`/`somaxconn`.

### Q107. Common latency causes
Slow O(N) commands, big keys, fork during `BGSAVE`/AOF rewrite, AOF `fsync` with `always`, swapping, THP, noisy neighbours, network RTT (use pipelining), too many connections, client output buffer overflows, expiry storms (many keys with identical TTL), `MONITOR` left running, CPU contention with other processes.

### Q108. `SCAN`-based maintenance jobs
Use `SCAN` with `COUNT` and `UNLINK` in batches to delete by pattern:
```js
let cursor = "0";
do {
  const [next, keys] = await redis.scan(cursor, "MATCH", "tmp:*", "COUNT", 500);
  cursor = next;
  if (keys.length) await redis.unlink(...keys);       // in Cluster: scan each node
} while (cursor !== "0");
```

### Q109. Security: TLS, ACL categories, protected mode
`tls-port 6380`, `tls-cert-file`, `tls-key-file`, `tls-ca-cert-file`, `tls-auth-clients yes`. ACL categories (`@read`, `@write`, `@admin`, `@dangerous`, `@pubsub`, `@scripting`) simplify least privilege. Use separate users for app, read-only analytics, and admin; store secrets in a vault; rotate passwords; audit with `ACL LOG`.

### Q110. HTTP and CDN caching in more depth
- `Cache-Control: no-store` (never store), `no-cache` (store but revalidate), `private` (browser only), `public`, `max-age`/`s-maxage`, `immutable`, `stale-while-revalidate`, `stale-if-error`.
- `Vary: Accept-Encoding, Accept-Language` keys variants; avoid `Vary: Cookie` unless necessary (kills hit ratio).
- Purge via CDN APIs or surrogate keys/tags; use versioned URLs for assets.
- `ETag` and `If-None-Match` cut bandwidth, not latency to origin.

### Q111. Database-level caches you should know
InnoDB buffer pool, PostgreSQL `shared_buffers` + OS page cache, MongoDB WiredTiger cache, query plan caches. They cache **pages**, not application results: still useful, but not a substitute for an application cache for expensive computed results.

---

# 🟠 Part 4: Senior (5–7 years)

### Q112. Designing a caching strategy for a new service *(Must-know)*
1. Identify read-heavy, expensive, staleness-tolerant data (measure with APM).
2. Choose a pattern per data class: cache-aside by default; write-through where read-after-write matters; short TTL for volatile data.
3. Define keys (namespace, version, tenant, locale) and TTLs with jitter.
4. Plan invalidation (events/CDC + TTL backstop).
5. Protect the DB: stampede control, negative caching, rate limits, circuit breaker.
6. Size memory, choose eviction policy and HA topology (Sentinel/Cluster/managed).
7. Observability: hit ratio, latency, evictions, memory, key cardinality, error rate.
8. Failure mode: the app must keep working (degraded) if Redis is down.

### Q113. Handling Redis outages gracefully
Treat the cache as optional: short client timeouts (`commandTimeout`, `connectTimeout`), a **circuit breaker**, fallback to the DB with load shedding, `enableOfflineQueue: false` to fail fast, and alerts on error rate. Never let cache failures turn into full outages or DB meltdowns.

### Q114. Choosing a topology
| Need | Choose |
|---|---|
| Dev/test, small cache | Single instance |
| HA, dataset fits one node | Primary + replicas + Sentinel (or managed Multi-AZ) |
| Large dataset / high throughput | Redis Cluster (or managed cluster mode) |
| Multi-region active-active | Redis Enterprise/Cloud active-active (CRDT) or app-level design |
| Durable primary store | Redis with AOF + replicas, or MemoryDB (multi-AZ durable log) |

### Q115. Capacity planning
Estimate: entries × (key size + value size + ~50–100 B overhead) × 1.3–2.0 (fragmentation/overheads) + replication buffers + fork headroom. Measure with `MEMORY USAGE` on samples. Plan for peak ops/sec (a single node often does 100k+ ops/s), network bandwidth (value size × ops), and connection counts.

### Q116. Hot key mitigation in depth
Detect: `redis-cli --hotkeys` (needs an LFU policy), `MONITOR` sampling, client-side metrics, `OBJECT FREQ`. Mitigate: local L1 cache with short TTL, key splitting (`product:1:{0..N}` with random read), replicas for reads, request coalescing, CDN for public content, and batched aggregation of write counters.

### Q117. Big key mitigation
Find with `--bigkeys`/`--memkeys`/`MEMORY USAGE`. Split large hashes/lists into buckets (`hash:{id % 1024}`), page large JSON into chunks, store blobs in object storage with a pointer, use `UNLINK`, cap list/stream length (`LTRIM`, `XTRIM`), and use `HSCAN`/`SSCAN` instead of `HGETALL`/`SMEMBERS`.

### Q118. Consistency models of a Redis cache + DB
You almost always get **eventual consistency** with bounded staleness. Ways to tighten it: short TTL; delete-on-write; write-through with versioning; CDC from the DB's binlog/WAL/change stream to invalidate (Debezium, MongoDB change streams); read-your-writes by bypassing the cache for the writing user for N seconds; compare-and-set using a `version`/`updatedAt`.

### Q119. Cache invalidation with CDC (change data capture)
DB commit log → Debezium/Kafka (or change streams) → consumer deletes/updates cache keys. Pros: decoupled from application code, catches all writers (batch jobs, admin tools). Cons: extra infrastructure, ordering/lag, need for idempotent handlers. Use the same key builder in the consumer.

### Q120. Transactions vs Lua vs Functions
| | MULTI/EXEC | Lua EVAL | Functions (7.0) |
|---|---|---|---|
| Conditional logic | No (only WATCH retry) | Yes | Yes |
| Round trips | 1 | 1 | 1 |
| Deployment | Client code | Script text/SHA at runtime | Server-side library, replicated and persisted |
| Blocking | Yes, atomic | Yes, atomic | Yes, atomic |
Keep scripts cheap, declare all keys in `KEYS`, and never call blocking commands. Long scripts hit the busy-script limit and block everyone (`SCRIPT KILL`).

### Q121. Token bucket rate limiter in Lua
```lua
-- KEYS[1]=bucket  ARGV: capacity, refill_per_sec, now_ms, cost
local d = redis.call("HMGET", KEYS[1], "tokens", "ts")
local tokens = tonumber(d[1]) or tonumber(ARGV[1])
local ts = tonumber(d[2]) or tonumber(ARGV[3])
local delta = math.max(0, tonumber(ARGV[3]) - ts) / 1000 * tonumber(ARGV[2])
tokens = math.min(tonumber(ARGV[1]), tokens + delta)
local ok = tokens >= tonumber(ARGV[4])
if ok then tokens = tokens - tonumber(ARGV[4]) end
redis.call("HSET", KEYS[1], "tokens", tokens, "ts", ARGV[3])
redis.call("PEXPIRE", KEYS[1], math.ceil(tonumber(ARGV[1]) / tonumber(ARGV[2]) * 1000) * 2)
return ok and 1 or 0
```
In Cluster, one bucket = one key = one slot, so it scales by sharding users.

### Q122. Global rate limiting across regions
Options: per-region limits (simple, approximate), a central limiter (latency and SPOF), or eventually-consistent counters with periodic sync (CRDT counters in Redis Enterprise). Choose accuracy vs latency consciously.

### Q123. Real-time analytics with Redis
Counters (`INCR`/`HINCRBY` with time buckets), HyperLogLog for uniques, bitmaps for cohorts, sorted sets for top-N, Streams as an ingest buffer, TimeSeries (`TS.ADD`, `TS.RANGE` with aggregation, retention, compaction rules). Roll up into a warehouse for history.

### Q124. Tuning persistence for performance
Use `appendfsync everysec`; put the AOF on fast disks; avoid snapshots on the primary (snapshot on a replica); `no-appendfsync-on-rewrite yes` trades safety during rewrites for lower latency; schedule `BGSAVE` off-peak; use diskless replication (`repl-diskless-sync yes`) on fast networks.

### Q125. Backups and disaster recovery
Copy `dump.rdb` or the AOF directory from a replica to object storage with retention; test restores regularly; document RPO/RTO. Managed services provide snapshots (verify PITR support). For cross-region DR use replicas in another region (async) or active-active (Enterprise).

### Q126. Upgrading Redis safely
Read release notes (breaking changes, licensing), upgrade replicas first, `FAILOVER` (or a Sentinel failover) to swap roles, then upgrade the old primary. In Cluster, upgrade shard by shard. Keep client library compatibility (RESP3, ACL). Test on staging with a production-like RDB.

### Q127. Valkey and the licensing story
In 2024 Redis moved from BSD to RSALv2/SSPL; the Linux Foundation forked **Valkey** (BSD-3) with contributors from AWS, Google, Oracle and others; Redis 8 later added an AGPLv3 option. Clients are mostly protocol-compatible. When evaluating migration look at compatibility, module needs, managed-service roadmap and support.

### Q128. Observability for Redis
Metrics: ops/sec, latency percentiles (`INFO commandstats`, `LATENCY`), hit rate, evictions, expired keys, memory used/RSS/fragmentation, connections/blocked clients, replication offset lag, persistence status (last save, AOF rewrite duration), CPU, network. Tools: Prometheus `redis_exporter`, Grafana, RedisInsight, Datadog/CloudWatch. Alert on: memory > 80%, evictions on non-cache workloads, replication lag, rejected connections, p99 latency, failovers.

### Q129. Debugging with `INFO commandstats` and `SLOWLOG`
`commandstats` shows calls and total/avg microseconds per command; find unexpectedly heavy ones (`KEYS`, `HGETALL`, `ZRANGE`). `SLOWLOG` shows exact args and clients (`slowlog-max-len`). Set `slowlog-log-slower-than 10000` (10 ms) in production.

### Q130. Redis in Kubernetes
Use an operator or Helm chart with StatefulSets, PersistentVolumes, anti-affinity across zones, requests = limits (Guaranteed QoS), `maxmemory` well below the container limit (leave room for fork/overheads), PodDisruptionBudgets, headless services for stable DNS, Sentinel/Cluster bootstrap, readiness probes (`redis-cli ping` plus role check), and careful handling of IP changes (announce hostnames).

### Q131. Security hardening in depth
Network isolation (VPC/private subnets/security groups), TLS everywhere, ACL users per service, disable dangerous commands, no public exposure, secrets rotation, file permissions on AOF/RDB, disk encryption, audit `ACL LOG`, don't build Lua from untrusted input, validate anything used to build keys (key injection), and patch CVEs promptly.

### Q132. Cache poisoning and data leakage
Shared keys that omit user/tenant/role/locale can serve one user's data to another. Defend: include identity dimensions in keys, never cache responses with `Set-Cookie`/personalized content at shared layers, use `Vary` correctly and `Cache-Control: private`, and test with two users. Don't cache attacker-controlled error pages.

### Q133. Choosing TTLs systematically
Weigh staleness cost against recomputation cost. Reference data (countries): hours/days. Product details: minutes. Inventory/price at checkout: do not cache, or very short TTL with verification. User-specific: seconds to minutes. Tune with metrics (hit ratio vs TTL), add jitter, and consider soft TTL (serve stale while refreshing) plus hard TTL.

### Q134. Stale-while-revalidate implementation
Store `{ value, soft }` with a longer hard TTL. On read: if now < soft return it; else return the stale value immediately and trigger a **single** background refresh (lock). This hides latency and shields the DB during spikes.
```js
const entry = JSON.parse((await redis.get(key)) ?? "null");
if (entry && Date.now() < entry.soft) return entry.value;
if (entry) { refreshOnce(key); return entry.value; }   // stale but served
return await loadAndStore(key);                          // cold miss
```

### Q135. XFetch / probabilistic early expiration
Recompute early with probability increasing as expiry nears: refresh if `now - delta * beta * ln(rand()) >= expiry`, where `delta` is the recompute time. Spreads refreshes without locks and avoids stampedes.

### Q136. Bloom filters for cache penetration
Pre-load all valid ids into a Bloom filter (`BF.ADD`, `BF.EXISTS`; RedisBloom, in core from Redis 8). If `BF.EXISTS` says no, the id is definitely absent: return 404 without touching the DB. False positives only cost one extra DB check. Cuckoo filters support deletion; Count-Min Sketch and Top-K support frequency/hot-item detection.

### Q137. Redis as a primary database: when and how
Appropriate for small/medium, latency-critical, structure-friendly data (sessions, leaderboards, real-time counters, game state) with AOF + replicas + backups, or via MemoryDB/Enterprise durability. Inappropriate for large cold datasets (RAM cost), complex relational queries, or strict multi-key ACID. Be explicit about durability guarantees (async replication means possible loss).

### Q138. Redis vs Kafka vs RabbitMQ (messaging)
| | Redis Pub/Sub / Streams | Kafka | RabbitMQ |
|---|---|---|---|
| Throughput | High (memory-bound) | Very high (disk, partitions) | Medium-high |
| Retention | Limited by memory | Long (days/forever) | Until consumed |
| Ordering | Per stream | Per partition | Per queue |
| Replay | Streams: yes | Yes | No (typically) |
| Routing features | Basic | Topics/partitions | Rich exchanges |
| Operational weight | Light | Heavy | Medium |
Use Redis Streams for lightweight pipelines inside a system; Kafka for durable, high-volume event backbones.

### Q139. Hash slot design for multi-key atomicity
Design keys so entities that need atomic multi-key operations share a hash tag (`{order:991}:items`, `{order:991}:status`). Avoid putting an entire tenant in one tag. For cross-slot workflows, use sagas or a single "owner" key plus Lua on that slot.

### Q140. Resharding and rebalancing
Add nodes, then `redis-cli --cluster add-node` and `reshard`/`rebalance` slots. Migration is online but raises latency; run off-peak and ensure clients handle `MOVED/ASK`. Remove nodes by draining their slots first.

### Q141. Cross-region and active-active
Open-source replication across regions is asynchronous and single-writer. Active-active needs CRDT-based Enterprise databases or application-level strategies (regional caches with event propagation, per-region ownership). Design conflict resolution (last-writer-wins, counter merge) explicitly.

### Q142. Cost optimization
Right-size by key sampling; shorten TTLs or evict cold data; compress big values; use hashes (listpack) for small objects; offload cold data to a database; use auto-tiering (Redis Enterprise on Flash) or a tiered cache (CDN → Redis); use reserved instances; skip replicas in dev; monitor memory per feature to catch regressions.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q143. Architecting caching for a high-traffic system (flash sale)
Layers: CDN for static + cacheable API responses with short `s-maxage` + `stale-while-revalidate`; gateway rate limiting; in-process L1 with tiny TTL for hot product pages; Redis Cluster L2 with jittered TTLs; stock counters in Redis via Lua with asynchronous reconciliation to the DB; queueing (Streams/Kafka) for order creation; circuit breakers, load shedding, and a "waiting room" fallback. Rehearse with load tests including cache failure.

### Q144. Inventory/oversell prevention with Redis
```lua
-- KEYS[1] = stock:sku123, ARGV[1] = qty
local s = tonumber(redis.call("GET", KEYS[1]) or "0")
if s >= tonumber(ARGV[1]) then redis.call("DECRBY", KEYS[1], ARGV[1]) return 1 else return 0 end
```
Redis gates admission atomically; the database remains the source of truth. Reserve with a TTL (hold stock for N minutes), release on payment failure/expiry, and reconcile. Log reservations to a Stream for audit/recovery.

### Q145. Exactly-once is a myth: designing idempotent consumers
Streams/queues give at-least-once. Make handlers idempotent using dedupe keys (`SET NX` per message id with TTL), natural idempotence (upsert), or an outbox table. Combine with retries/backoff and a DLQ. Explain the failure window (crash after the side effect but before `XACK`).

### Q146. Cache design for microservices
Avoid sharing one cache across services' private data (coupling); each service owns its keyspace (or instance) and invalidation contracts. Publish domain events (`ProductUpdated`) for others to invalidate. Version cache keys with schema version. Run a shared platform (managed Redis) with quotas, ACLs, and dashboards per team.

### Q147. Evaluating build vs buy (managed Redis)
Managed (ElastiCache, MemoryDB, Redis Cloud, Azure Cache, Upstash, Memorystore): automated failover/patching/backups, scaling, support; costs more, limited config/modules, version lag, vendor lock-in. Self-managed: control and lower cost at scale, but you own ops, upgrades, security and on-call. Decide with SLOs, team capacity and compliance needs.

### Q148. SLOs for a cache tier
Examples: p99 latency < 5 ms; availability 99.95%; hit ratio > 90%; replication lag < 1 s; session store with documented loss tolerance. Define error budgets, failure drills (kill primary, partition, flush) and runbooks.

### Q149. Failure modes and chaos testing
Primary crash → failover time; network partition (split-brain risk, mitigated by `min-replicas-to-write`); replica lag; OOM; disk full for AOF; slow `fsync`; client reconnect storms; DNS TTL issues; Sentinel quorum loss; cluster slot coverage loss. Test them in staging; ensure clients reconnect with backoff + jitter.

### Q150. Data modeling in Redis (query-first)
Design from access patterns: choose the structure that makes each query O(1)/O(log N); denormalize with multiple indexes (hash for the object, set for membership, sorted set for ordering) maintained atomically via Lua/transactions. Example: `user:{id}` (hash), `users:by_email` (hash email→id), `users:active` (ZSET by lastSeen), `user:{id}:friends` (set). Use RediSearch when ad-hoc querying is required.

### Q151. Migration strategies: Redis to Redis (zero downtime)
Dual-write + backfill (`SCAN` + `DUMP`/`RESTORE`, or tools like RIOT/redis-shake), compare, switch reads, stop writes to the old. Or use replication: make the new node a replica of the old, then promote it. For cross-provider moves, use snapshot restore plus a catch-up stream.

### Q152. Compliance and PII in caches
Cache what you must: avoid raw PII/PCI; encrypt in transit (TLS) and at rest; short TTLs; right-to-erasure requires invalidating cached copies; audit access; avoid logging values; separate instance/ACL for sensitive data; know the data residency of replicas and backups.

### Q153. Strategy for LLM/AI workloads
Prompt/response caching (exact + semantic), embedding cache (hash of text → vector), conversation memory in Streams/JSON with TTL, vector search for RAG, per-user rate limiting and token budgets, queueing for GPU-bound jobs, and cost tracking via counters. Include model + prompt version in keys.

### Q154. Consistent hashing vs Redis Cluster slots
Client-side consistent hashing (ketama) shards across independent nodes without cluster coordination (fine for pure caches; resharding remaps a fraction of keys, no failover). Redis Cluster adds server-side slots, replication and failover, with slot-based migration. Choose Cluster for stateful data; client-side hashing only for simple, disposable caches.

### Q155. Team standards and governance
Central key naming and TTL policy docs, a shared client library with timeouts/metrics/circuit breakers, lint rules against `KEYS`/unbounded collections, a review checklist (TTL set? key includes tenant? failure fallback?), load-test gates, ownership of dashboards/alerts, and quarterly game days.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Local Redis with Docker Compose (persistence + password)
```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7
    command: ["redis-server", "--appendonly", "yes", "--requirepass", "devpass", "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    ports: ["6379:6379"]
    volumes: ["redis-data:/data"]
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "devpass", "ping"]
      interval: 5s
volumes:
  redis-data:
```

### H2. Reusable cache-aside helper with stampede protection
```js
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL);
const inflight = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function cached(key, ttlSec, loader) {
  const hit = await redis.get(key);
  if (hit !== null) return JSON.parse(hit);
  if (inflight.has(key)) return inflight.get(key);

  const p = (async () => {
    const lockKey = `lock:${key}`;
    const token = crypto.randomUUID();
    const got = await redis.set(lockKey, token, "PX", 10_000, "NX");
    if (!got) {                                    // another node is rebuilding: wait briefly
      for (let i = 0; i < 20; i++) {
        await sleep(50);
        const v = await redis.get(key);
        if (v !== null) return JSON.parse(v);
      }
    }
    try {
      const value = await loader();
      const jitter = Math.floor(Math.random() * ttlSec * 0.1);
      await redis.set(key, JSON.stringify(value ?? null), "EX", (value == null ? 30 : ttlSec) + jitter);
      return value;
    } finally {
      if (got) await redis.eval(
        `if redis.call("get",KEYS[1])==ARGV[1] then return redis.call("del",KEYS[1]) end return 0`, 1, lockKey, token);
    }
  })().finally(() => inflight.delete(key));

  inflight.set(key, p);
  return p;
}
```
Handles: local coalescing, cross-node lock, jitter, negative caching (short TTL for `null`), safe lock release.

### H3. Sliding-window rate limiter (Lua, atomic)
```js
const script = `
local key, now, window, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)
local count = redis.call("ZCARD", key)
if count < limit then
  redis.call("ZADD", key, now, ARGV[4])
  redis.call("PEXPIRE", key, window)
  return {1, limit - count - 1}
end
return {0, 0}`;
redis.defineCommand("slide", { numberOfKeys: 1, lua: script });

app.use(async (req, res, next) => {
  const [ok, remaining] = await redis.slide(`rl:${req.ip}`, Date.now(), 60_000, 100, `${Date.now()}-${Math.random()}`);
  res.set("X-RateLimit-Remaining", remaining);
  return ok ? next() : res.status(429).set("Retry-After", "60").json({ error: "Too many requests" });
});
```

### H4. Leaderboard API
```js
app.post("/score", async (req, res) => {
  const { userId, points } = req.body;
  const score = await redis.zincrby("lb:global", points, userId);
  res.json({ score: Number(score) });
});
app.get("/leaderboard", async (req, res) => {
  const rows = await redis.zrevrange("lb:global", 0, 9, "WITHSCORES");
  const board = [];
  for (let i = 0; i < rows.length; i += 2) board.push({ rank: i / 2 + 1, userId: rows[i], score: Number(rows[i + 1]) });
  res.json(board);
});
app.get("/rank/:id", async (req, res) => {
  const rank = await redis.zrevrank("lb:global", req.params.id);
  res.json({ rank: rank === null ? null : rank + 1 });
});
```

### H5. Session store with Express
See Q36. Add `rolling: true` for sliding expiry, `proxy: true` behind a load balancer, and regenerate the session on login (`req.session.regenerate`) to prevent fixation.

### H6. Job queue with BullMQ + graceful shutdown
```js
import { Queue, Worker, QueueEvents } from "bullmq";
const connection = { host: process.env.REDIS_HOST, port: 6379, maxRetriesPerRequest: null };
export const imageQueue = new Queue("image", { connection, defaultJobOptions: { attempts: 5, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: { age: 3600 }, removeOnFail: { age: 86400 } } });

const worker = new Worker("image", async (job) => {
  await job.updateProgress(10);
  await resize(job.data.url);
  return { ok: true };
}, { connection, concurrency: 5 });

worker.on("failed", (job, err) => console.error("job failed", job?.id, err.message));
process.on("SIGTERM", async () => { await worker.close(); process.exit(0); });
```

### H7. Streams consumer group worker
```js
const STREAM = "orders", GROUP = "billing", ME = `c-${process.pid}`;
try { await redis.xgroup("CREATE", STREAM, GROUP, "$", "MKSTREAM"); } catch (e) { if (!String(e).includes("BUSYGROUP")) throw e; }

while (true) {
  const res = await redis.xreadgroup("GROUP", GROUP, ME, "COUNT", 10, "BLOCK", 5000, "STREAMS", STREAM, ">");
  if (!res) continue;
  for (const [, entries] of res) {
    for (const [id, fields] of entries) {
      try { await handle(Object.fromEntries(chunk(fields, 2))); await redis.xack(STREAM, GROUP, id); }
      catch (err) { console.error("failed", id, err); /* stays pending for XAUTOCLAIM */ }
    }
  }
}
```
A reaper periodically runs `XAUTOCLAIM orders billing reaper 60000 0-0 COUNT 50` and moves messages with too many deliveries to `orders:dlq`.

### H8. Pub/Sub cache invalidation across instances (L1 + Redis)
```js
import { LRUCache } from "lru-cache";
const local = new LRUCache({ max: 5000, ttl: 5000 });
const sub = redis.duplicate();                       // dedicated connection for subscribe
await sub.subscribe("invalidate");
sub.on("message", (_, key) => local.delete(key));

async function get(key, loader) {
  const l1 = local.get(key); if (l1 !== undefined) return l1;
  const v = await cached(key, 300, loader);          // from H2
  local.set(key, v);
  return v;
}
async function invalidate(key) {
  await redis.del(key);
  await redis.publish("invalidate", key);
}
```

### H9. Distributed lock helper with auto-release and fencing token
```js
async function withLock(name, ttlMs, fn) {
  const token = crypto.randomUUID();
  const fence = await redis.incr(`fence:${name}`);                  // monotonic number
  const ok = await redis.set(`lock:${name}`, token, "PX", ttlMs, "NX");
  if (!ok) throw new Error("lock busy");
  try { return await fn(fence); }                                    // pass fence to the protected resource
  finally {
    await redis.eval(`if redis.call("get",KEYS[1])==ARGV[1] then return redis.call("del",KEYS[1]) end return 0`, 1, `lock:${name}`, token);
  }
}
```
The protected resource must reject writes with a smaller fence than it has already seen.

### H10. Cache hit/miss metrics with Prometheus
```js
import client from "prom-client";
const hits = new client.Counter({ name: "cache_hits_total", help: "hits", labelNames: ["cache"] });
const misses = new client.Counter({ name: "cache_misses_total", help: "misses", labelNames: ["cache"] });
// in the cache helper: hits.inc({ cache: "user" }) on hit, misses.inc(...) on miss
```
Dashboard: `rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))`.

### H11. Redis Cluster local setup and checks
```bash
# create 6 nodes on ports 7000-7005 (cluster-enabled yes), then:
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1
redis-cli -c -p 7000 cluster nodes
redis-cli -c -p 7000 cluster slots
redis-cli -c -p 7000 cluster keyslot user:42
redis-cli --cluster check 127.0.0.1:7000
```
`-c` makes redis-cli follow `MOVED` redirects. In Node use `new Redis.Cluster([{ host, port }])`.

### H12. Backup and restore drill
```bash
redis-cli --rdb /backup/dump-$(date +%F).rdb            # remote RDB dump
# restore: stop redis, place file as dump.rdb in the data dir, start redis
redis-cli DBSIZE                                        # sanity check
redis-check-rdb /data/dump.rdb                          # verify file
```
Automate, ship to object storage, and rehearse the restore (measure RTO).

### H13. Pipelining benchmark
```bash
redis-benchmark -q -n 100000 -c 50 -t set,get
redis-benchmark -q -n 100000 -P 16 -t set,get          # pipeline 16: throughput jumps several times
```
Shows that RTT, not CPU, usually limits throughput.

---

# 🐞 Part 7: Debugging Scenarios

### D1. `OOM command not allowed when used memory > 'maxmemory'`
Policy is `noeviction` (or `volatile-*` with no TTL keys) and memory is full. Check `INFO memory`, `--bigkeys`, `MEMORY STATS`. Fix: set TTLs, switch to `allkeys-lru/lfu` for caches, add memory/shards, delete or shrink big keys, fix leaks (keys without TTL).

### D2. Latency spikes every few minutes
Likely `BGSAVE`/AOF rewrite `fork` (check `INFO stats` `latest_fork_usec`, `LATENCY DOCTOR`), THP enabled, a periodic job running `KEYS`/`SMEMBERS`, or a mass expiry. Disable THP, snapshot on replicas, replace O(N) commands with `SCAN`, add jitter to TTLs.

### D3. `ECONNREFUSED` / `ETIMEDOUT` from Node
Wrong host/port, Redis not bound to that interface, firewall/security group, TLS mismatch (`rediss://`), `maxclients` reached, DNS issue in containers. Test with `redis-cli -h ... ping` from the same host. Add client `retryStrategy` with backoff.

### D4. `MaxRetriesPerRequestError` (ioredis)
Commands retried too many times while the connection is down. Set `maxRetriesPerRequest: null` for blocking/queue clients (BullMQ requires it), or handle reconnection and use `enableOfflineQueue: false` for fail-fast behaviour in request paths.

### D5. `NOAUTH Authentication required` / `WRONGPASS`
Password/ACL user not provided or wrong, or the `default` user changed. Include `username`/`password` in the URL (`redis://user:pass@host`), URL-encode special characters, and check `ACL LIST`.

### D6. `READONLY You can't write against a read only replica`
The client points at a replica (after failover or wrong endpoint). Use the Sentinel/cluster-aware client or the managed primary endpoint; ensure failover re-resolves DNS (watch long DNS TTLs and connection pooling).

### D7. `CROSSSLOT Keys in request don't hash to the same slot`
Multi-key command across slots in Cluster. Use hash tags, split the command per key, or avoid multi-key ops (see Q89).

### D8. `MOVED` loops or `CLUSTERDOWN`
Client not cluster-aware, stale slot map, or the cluster lacks full slot coverage (a shard lost both primary and replica). Use a cluster client; run `redis-cli --cluster check` and `fix`; consider `cluster-require-full-coverage no` for partial availability.

### D9. Keys not expiring / memory not dropping
`SET` after `EXPIRE` removes the TTL; `PERSIST` was called; TTL set on wrong key; `RENAME` retains TTL; expired keys not yet reclaimed (active expiry lag); deleted memory returned to the allocator but not the OS (RSS stays high). Verify with `TTL`, `INFO keyspace` (`expires` count), `MEMORY PURGE`.

### D10. Stale data after update
Cache-aside race (Q58), forgotten invalidation path (admin script, another service), long TTL, replica reads lagging, CDN/browser cache layered on top, or wrong key (missing version/locale). Trace with `X-Cache` headers and key logging; add CDC-based invalidation or shorter TTL.

### D11. Replication keeps restarting (full resync loop)
Replica's output buffer limit exceeded during full sync (`client-output-buffer-limit replica`), backlog too small, slow network, or huge dataset. Increase buffer limits and `repl-backlog-size`, use diskless sync, reduce write rate during sync, check `INFO replication` (`master_link_status`, `master_repl_offset`).

### D12. Redis is slow but CPU is low
Network RTT with chatty clients (pipeline!), swap use, slow disk fsync, big values, blocked by `MONITOR`, client-side serialization cost. Use `--latency`, `--intrinsic-latency`, `INFO commandstats`, host metrics.

### D13. Memory usage grows after releases
New key patterns without TTL, unbounded lists/streams/sets, per-request unique keys (cardinality explosion), larger payloads, disabled compression. Compare `INFO keyspace`, sample with `SCAN` + `MEMORY USAGE`, group by prefix, set TTLs and caps.

### D14. Pub/Sub messages lost
Subscriber was disconnected, too slow (output buffer limit killed it), subscribed after publish, or running a command on the subscribe connection. Pub/Sub is at-most-once; use Streams if loss is unacceptable.

### D15. Lock never released / duplicates processing
Holder crashed without TTL (set no expiry), TTL shorter than the job (lock expired, second worker entered), unlock without ownership check deleted another holder's lock. Use `SET NX PX`, token compare-and-delete, renewal, and fencing.

---

# 🧩 Part 8: Tricky Questions

### T1. Is Redis really single-threaded?
Command execution: yes, one main thread. But Redis also uses background threads (lazy free, AOF fsync, close file) and optional I/O threads, and persistence uses forked child processes. "Single-threaded for commands" is the accurate statement.

### T2. Is Redis durable?
Only as durable as configured. Without persistence: no. RDB: can lose minutes. AOF `everysec`: about a second. Replication is asynchronous, so failover can lose acknowledged writes even with AOF.

### T3. Does `EXPIRE` survive a `SET`?
No. `SET key value` removes the existing TTL unless you use `KEEPTTL`. `INCR`, `APPEND`, `HSET` keep the TTL; `RENAME` transfers it; `GETSET`/`SET` reset it.

### T4. Are `MULTI/EXEC` transactions ACID?
Atomic in the sense of isolation (no interleaving) and all-or-nothing queuing, but there is **no rollback** on runtime errors, and durability depends on persistence. There is no Consistency enforcement like constraints.

### T5. Does `WATCH` block other clients?
No. It is optimistic: if a watched key changes before `EXEC`, the transaction aborts (returns nil) and the client retries.

### T6. Why can `SMEMBERS` or `HGETALL` hurt production?
They are O(N) and return everything in one reply, blocking the single thread and filling output buffers for big collections. Use `SSCAN`/`HSCAN` or design smaller keys.

### T7. Does a cache always make things faster?
No. A low hit ratio adds an extra network hop for every miss; serialization, memory pressure, evictions and invalidation bugs add cost. Measure hit ratio and end-to-end latency.

### T8. Is `DEL` always instant?
No. `DEL` on a large hash/list/set/zset frees memory synchronously in O(N). Use `UNLINK`.

### T9. What happens to `KEYS *` on a replica?
Still blocks that replica. Not a safe workaround for production scans.

### T10. Does `SELECT` isolate databases?
Not for memory, CPU, configuration or security: one slow command in DB 0 blocks DB 5. Not supported in Cluster.

### T11. Why is `INCR` safe but `GET` then `SET` not?
`INCR` is a single atomic server-side read-modify-write; the two-step version has a race window between the commands.

### T12. Does Redis Cluster guarantee strong consistency?
No. It uses asynchronous replication; a primary can acknowledge a write and fail before replicating, losing it after failover. Partitions can also let a minority-side primary accept writes for a while (`cluster-node-timeout` bounds it).

### T13. Is `volatile-lru` safe for a cache with no TTLs?
No. With no volatile keys nothing can be evicted, so it acts like `noeviction` and writes start failing.

### T14. Is Redlock safe for correctness?
Not on its own: clock jumps and pauses can break mutual exclusion. Use fencing tokens or a DB constraint for correctness-critical sections (Q94).

### T15. Does `MONITOR` affect performance?
Yes, significantly: it copies every command to the monitoring client and can cut throughput by half or more. Use briefly, never leave on in production.

### T16. Are Redis keys case-sensitive and binary-safe?
Yes to both. `User:1` and `user:1` are different keys; keys can be any byte sequence up to 512 MB (keep them short).

### T17. Does cache-aside guarantee the cache never serves stale data?
No; it bounds staleness by TTL and invalidation. Races between readers and writers can leave stale entries until expiry.

### T18. Memcached vs Redis: is Redis always better?
For features, yes. For a pure multi-threaded string cache with huge simple workloads, Memcached can use many cores with simpler operations; Redis scales by sharding instead.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Default port?** 6379.
- **Max string value?** 512 MB.
- **Hash slots in Cluster?** 16384.
- **Slot function?** `CRC16(key) mod 16384`.
- **Atomic set-if-absent with TTL?** `SET key val NX EX seconds`.
- **Safe key iteration?** `SCAN`.
- **Non-blocking delete?** `UNLINK`.
- **Counter?** `INCR`/`INCRBY`.
- **Leaderboard type?** Sorted set.
- **Queue types?** List (`BRPOP`) or Stream with consumer groups.
- **Approximate unique count?** HyperLogLog (`PFADD`/`PFCOUNT`).
- **Boolean flags per user?** Bitmap.
- **Persistence modes?** RDB, AOF, both, none.
- **Recommended AOF fsync?** `everysec`.
- **HA without sharding?** Sentinel.
- **Sharding?** Redis Cluster.
- **Co-locate keys in Cluster?** Hash tags `{...}`.
- **Run Lua?** `EVAL` / `EVALSHA` / `FCALL`.
- **No rollback?** Right, `MULTI/EXEC` has no rollback.
- **Optimistic lock?** `WATCH`.
- **Fire-and-forget messaging?** Pub/Sub.
- **Reliable messaging?** Streams.
- **Pattern for reads?** Cache-aside.
- **Stampede fix?** Locking, SWR, jitter, early refresh.
- **Penetration fix?** Negative caching, Bloom filter.
- **Avalanche fix?** TTL jitter, HA, multi-level cache.
- **Eviction for caches?** `allkeys-lru` / `allkeys-lfu`.
- **Hit ratio formula?** hits / (hits + misses).
- **Debug slow commands?** `SLOWLOG GET`.
- **See memory of a key?** `MEMORY USAGE key`.
- **Find big keys?** `redis-cli --bigkeys`.
- **Client library for Node?** ioredis, node-redis.
- **Job queue for Node?** BullMQ.
- **Open-source fork?** Valkey.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a Redis project you built.
STAR: "I added Redis to a product-catalog API handling 3k req/s. I used cache-aside with versioned keys and TTL jitter, a Lua-based rate limiter, and a leaderboard on sorted sets. Hit ratio reached 94%, p95 latency dropped from 180 ms to 25 ms, and the database CPU fell by 60%. I added metrics for hits, misses and evictions, and a circuit breaker so the API served from the DB if Redis was down."

### P2. Describe a cache stampede or outage you handled.
"A hot product page key expired during a campaign and 800 requests hit the DB at once. We added a single-flight lock, stale-while-revalidate with a soft TTL, and TTL jitter. We also load-tested expiry of the top 100 keys. DB peak queries fell by 90%."

### P3. How do you decide what to cache?
By measured read:write ratio, cost to compute, tolerance for staleness, and cardinality. I avoid caching rarely read or highly personalized data and verify benefit with hit ratio and end-to-end latency.

### P4. How did you handle cache invalidation?
"TTL as the safety net, delete-on-write in the service, and a change-stream consumer to invalidate keys when other writers update the DB. Keys had a version prefix so we could invalidate a whole class by bumping the version."

### P5. A time Redis memory filled up.
"A feature stored per-request keys without TTL. Writes began failing under `noeviction`. I found the prefix with `SCAN` + `MEMORY USAGE`, deleted with `UNLINK` in batches, added TTLs, switched the cache instance to `allkeys-lfu`, and added a lint rule plus alerts at 80% memory."

### P6. Why Redis over a database for this feature?
"The access pattern was key-based with very high read rates and tolerable staleness; sub-millisecond latency and TTL support fit. We kept the database as the source of truth and designed fallbacks."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** in-memory store, RESP, single-threaded model, data types, keys and naming, TTL.
- **Data structures:** strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geo, JSON, Search, TimeSeries, Bloom/Cuckoo/Top-K, Vector Sets.
- **Caching patterns:** cache-aside, read-through, write-through, write-back, write-around, refresh-ahead, stale-while-revalidate.
- **Cache problems:** stampede, penetration, avalanche, hot keys, big keys, poisoning, stale reads, invalidation races.
- **Persistence and durability:** RDB, AOF, multi-part AOF, fsync policies, fork/COW, backups.
- **High availability and scale:** replication, PSYNC, Sentinel, Cluster, hash tags, resharding, active-active.
- **Atomicity and scripting:** `MULTI/EXEC`, `WATCH`, Lua, Functions, pipelining.
- **Messaging:** Pub/Sub, sharded Pub/Sub, Streams, BullMQ.
- **Patterns:** sessions, rate limiting, locks, leaderboards, idempotency, counters, queues.
- **Operations:** eviction, memory tuning, fragmentation, monitoring, slowlog, security (ACL/TLS), upgrades, Kubernetes.
- **Web caching:** HTTP cache headers, CDN, ETag, browser cache, service workers.

## Mixed topics
- Redis + Node/Express: client reuse, sessions, rate limiting, queue workers, graceful shutdown.
- Redis + MongoDB/PostgreSQL: cache-aside, change streams/CDC invalidation, outbox, read replicas.
- Redis + Kafka: Streams vs topics, deduplication, backpressure buffers.
- Redis + Kubernetes: StatefulSets, operators, PDBs, resource limits.
- Redis + Next.js/React: ISR/server-side caches, edge caching, SWR on the client.
- Redis + AI: semantic cache, embeddings, vector search, conversation memory.
- Redis + CDN: layered caching, purge strategies, `s-maxage`.

---

# 🔬 Part 12: Redis Internals

### I1. Event loop
Redis uses an event loop (`ae`) over `epoll`/`kqueue`/`select`. Each iteration processes readable sockets, parses commands, executes them, queues replies, and handles timers (`serverCron`: expiry cycles, stats, replication/cluster housekeeping, persistence triggers). Blocking commands park the client without blocking the loop.

### I2. Core data structures
- **SDS** (Simple Dynamic String): length-prefixed binary-safe string with pre-allocation.
- **Hashtable** (`dict`): incremental rehashing spreads resize cost over operations.
- **Listpack** (replaces ziplist): compact contiguous encoding for small hashes, lists, sets, zsets.
- **Quicklist**: linked list of listpacks (lists).
- **Intset**: sorted array of integers (small integer sets).
- **Skiplist + dict**: sorted sets (O(log N) rank/range, O(1) score lookup).
- **Radix tree (rax)**: streams, cluster key indexes.

### I3. Object encoding and conversion
`OBJECT ENCODING` reveals the representation. Types convert upward when thresholds are crossed (for example `hash-max-listpack-entries 128`, `hash-max-listpack-value 64`, `zset-max-listpack-entries 128`, `set-max-intset-entries 512`). Conversion back down does not happen automatically.

### I4. Memory model
Every key has a `redisObject` header (type, encoding, LRU/LFU field, refcount). Allocation uses **jemalloc**. Shared integers 0–9999 are cached. Memory overhead per key is roughly 50–100 bytes plus key/value, which is why millions of tiny keys cost more than a hash of fields.

### I5. Persistence internals
**RDB**: `fork()` → child serializes the dataset with copy-on-write; a temporary file is renamed atomically. **AOF**: commands appended to an in-memory buffer, written with `write()` then `fsync` per policy; the rewrite creates a new base while incremental files record concurrent writes (7.0 multi-part AOF).

### I6. Replication internals
Primary keeps a **replication ID** and **offset**, a **backlog** ring buffer of recent writes, and per-replica output buffers. Replicas ack offsets periodically (`REPLCONF ACK`). On promotion, a new replication ID is created while the old ID is remembered (`replid2`) so other replicas can partial-resync.

### I7. Cluster internals
Cluster state per node: slot→node map, epoch numbers (`currentEpoch`, `configEpoch`) used to resolve conflicts; failure detection via gossip (`PFAIL`→`FAIL`); replica elections use votes from primaries; slot migration uses `MIGRATING`/`IMPORTING` states and `ASK` redirects.

### I8. Expiry and eviction internals
The expires dictionary maps key→absolute ms timestamp. Active expiry samples keys per `serverCron` tick with a CPU budget. Eviction runs before executing a write command when `used_memory > maxmemory`, evicting until under the limit; the approximated algorithms use an eviction pool of candidates to improve accuracy.

### I9. Client handling
Each client has input/output buffers. `client-output-buffer-limit` (normal / replica / pubsub) disconnects clients whose output buffers grow too large (slow consumers). `maxclients` caps connections; `timeout` closes idle clients. `tracking-table-max-keys` bounds client-side caching state.

### I10. Lua and Functions execution
Scripts run in an embedded Lua interpreter with a restricted API (`redis.call`, `redis.pcall`, `cjson`, `struct`, `cmsgpack`, `bit`). They execute atomically on the main thread; replication ships the script effects (effects replication by default since 5.0/7.0) so non-determinism is safe.

---

# 📊 Part 13: Reference Tables

### Data type → typical commands
| Type | Core commands | Complexity highlights |
|---|---|---|
| String | `SET GET INCR APPEND` | O(1) |
| Hash | `HSET HGET HGETALL HINCRBY` | O(1) per field, `HGETALL` O(N) |
| List | `LPUSH RPOP LRANGE BLPOP` | O(1) ends, O(N) middle |
| Set | `SADD SISMEMBER SINTER` | O(1) add/check, `SMEMBERS` O(N) |
| Sorted set | `ZADD ZRANGE ZRANK ZINCRBY` | O(log N) |
| Stream | `XADD XREADGROUP XACK XTRIM` | O(1) append |
| Bitmap | `SETBIT GETBIT BITCOUNT` | O(1)/O(N) |
| HyperLogLog | `PFADD PFCOUNT` | O(1) |
| Geo | `GEOADD GEOSEARCH` | O(log N) |

### Eviction policies
| Policy | Scope | Algorithm |
|---|---|---|
| `noeviction` | – | Reject writes |
| `allkeys-lru` | All keys | Least recently used |
| `allkeys-lfu` | All keys | Least frequently used |
| `allkeys-random` | All keys | Random |
| `volatile-lru` | Keys with TTL | LRU |
| `volatile-lfu` | Keys with TTL | LFU |
| `volatile-random` | Keys with TTL | Random |
| `volatile-ttl` | Keys with TTL | Shortest TTL first |

### Caching strategies
| Strategy | Read path | Write path | Consistency | Risk |
|---|---|---|---|---|
| Cache-aside | App checks cache, then DB | DB write, invalidate cache | Eventual | Stale race |
| Read-through | Cache loads from DB | – | Eventual | Library dependency |
| Write-through | Cache | Cache + DB sync | Strong-ish | Write latency |
| Write-back | Cache | Cache, async DB | Eventual | Data loss |
| Write-around | Cache on miss | DB only | Eventual | Cold reads |

### Persistence comparison
| Option | Data-loss window | Perf impact | Restart time |
|---|---|---|---|
| None | Everything | None | Instant |
| RDB | Minutes | Fork spikes | Fast |
| AOF everysec | ~1 s | Low | Medium |
| AOF always | ~0 | High | Medium |
| RDB + AOF | ~1 s | Medium | Medium |

### Sentinel vs Cluster vs Replication only
| Feature | Replication only | Sentinel | Cluster |
|---|---|---|---|
| Auto failover | No | Yes | Yes |
| Sharding | No | No | Yes |
| Read scaling | Yes | Yes | Yes (replicas) |
| Multi-key ops | Yes | Yes | Same slot |

### HTTP cache headers
| Header | Meaning |
|---|---|
| `Cache-Control: max-age=N` | Fresh for N seconds (browser and shared) |
| `s-maxage=N` | Fresh for N seconds in shared caches (CDN) |
| `no-store` | Do not store |
| `no-cache` | Store but revalidate before use |
| `private` / `public` | Browser only / any cache |
| `ETag` + `If-None-Match` | Conditional request → `304` |
| `stale-while-revalidate=N` | Serve stale while refreshing |

### Version highlights
| Version | Highlights |
|---|---|
| 5.0 | Streams, consumer groups |
| 6.0 | ACLs, TLS, RESP3, client-side caching, I/O threads |
| 6.2 | `GETDEL`, `GEOSEARCH`, `LMOVE`, `XAUTOCLAIM` |
| 7.0 | Functions, sharded Pub/Sub, multi-part AOF, `EXPIRE NX/XX/GT/LT`, ACL v2 |
| 7.2–7.4 | Performance, `HEXPIRE` (7.4), license change |
| 8.0 | Integrated JSON/Search/TimeSeries/probabilistic types, Vector Sets, AGPL option, faster I/O |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```
SET a 10
INCR a
GET a
```
**Output:** `OK`, `(integer) 11`, `"11"`. Values are strings; `INCR` parses integers.

### O2.
```
SET k v EX 100
SET k v2
TTL k
```
**Output:** `-1`. The second `SET` removed the TTL (use `KEEPTTL` to retain it).

### O3.
```
RPUSH l a b c
LPUSH l z
LRANGE l 0 -1
LPOP l
```
**Output:** `z a b c`, then `"z"`.

### O4.
```
ZADD z 1 a 2 b 2 c
ZRANGE z 0 -1 WITHSCORES
ZRANK z c
```
**Output:** `a 1 b 2 c 2`; rank of `c` is `2`. Equal scores sort lexicographically by member.

### O5.
```
SADD s1 a b c
SADD s2 b c d
SINTER s1 s2
SDIFF s1 s2
```
**Output:** `b c` and `a`.

### O6.
```
MULTI
SET x 1
LPUSH x 2
SET y 3
EXEC
```
**Output:** `OK`, `QUEUED`, `QUEUED`, `QUEUED`, then EXEC returns `OK`, an error (`WRONGTYPE`) for `LPUSH`, `OK`. There is no rollback: `x` stays `1` and `y` is `3`.

### O7.
```
SET lock a NX EX 10
SET lock b NX EX 10
```
**Output:** `OK`, then `(nil)`. The second call fails because the key exists.

### O8.
```
HSET h f1 v1 f2 v2
HDEL h f1
HLEN h
```
**Output:** `(integer) 2`, `(integer) 1`, `(integer) 1`.

### O9.
```
PFADD hll a b c a
PFCOUNT hll
```
**Output:** `3` (approximate algorithm, exact for tiny sets).

### O10.
```
SET n 5
EXPIRE n 100
PERSIST n
TTL n
EXPIRE missing 100
```
**Output:** `-1`; and `(integer) 0` for the missing key (nothing to expire).

### O11.
```
GET nokey
INCR nokey
```
**Output:** `(nil)`, then `(integer) 1` (missing keys behave as 0 for `INCR`).

### O12.
```js
const [a, b] = await Promise.all([redis.incr("c"), redis.incr("c")]);
```
**Output:** `{a, b}` are `1` and `2` in some order; atomic increments never produce duplicates.

---

# ✅ Part 15: MCQs

**1. Redis stores its primary dataset in:**
A) Disk pages  B) RAM  C) Object storage  D) CDN
**Answer: B**

**2. Which command safely iterates keys without blocking?**
A) `KEYS *`  B) `SCAN`  C) `FLUSHALL`  D) `MONITOR`
**Answer: B**

**3. The atomic way to acquire a lock with expiry:**
A) `SETNX` then `EXPIRE`  B) `SET key val NX PX 30000`  C) `GET` then `SET`  D) `INCR`
**Answer: B**

**4. Redis Cluster has how many hash slots?**
A) 1024  B) 4096  C) 16384  D) 65536
**Answer: C**

**5. Which data type is best for a leaderboard?**
A) List  B) Set  C) Sorted set  D) Bitmap
**Answer: C**

**6. Which persistence has the smaller data-loss window with `everysec`?**
A) RDB  B) AOF  C) Neither  D) Pub/Sub
**Answer: B**

**7. Cache-aside means:**
A) Cache loads from DB itself  B) App checks the cache and fills it on a miss  C) Writes go only to cache  D) DB is bypassed
**Answer: B**

**8. A cache stampede is:**
A) Memory exhaustion  B) Many requests rebuilding the same expired key at once  C) Replica lag  D) Eviction of LFU keys
**Answer: B**

**9. Which policy evicts from keys with TTL only?**
A) `allkeys-lru`  B) `volatile-lru`  C) `allkeys-random`  D) `noeviction`
**Answer: B**

**10. `MULTI/EXEC` on a runtime error in one command:**
A) Rolls back all  B) Other commands still execute  C) Cluster restarts  D) Locks the DB
**Answer: B**

**11. Which gives at-least-once delivery with acknowledgements?**
A) Pub/Sub  B) Streams consumer groups  C) `PUBLISH`  D) `MONITOR`
**Answer: B**

**12. What causes `CROSSSLOT` errors?**
A) Wrong password  B) Multi-key command spanning slots  C) Missing TLS  D) OOM
**Answer: B**

**13. Sentinel provides:**
A) Sharding  B) Monitoring and automatic failover  C) SQL queries  D) Compression
**Answer: B**

**14. `UNLINK` differs from `DEL` by:**
A) Not removing the key  B) Freeing memory asynchronously  C) Only for strings  D) Persisting the key
**Answer: B**

**15. Best fix for cache penetration with invalid ids:**
A) Longer TTL  B) Negative caching or a Bloom filter  C) More replicas  D) Disable cache
**Answer: B**

**16. Which header lets a CDN cache longer than the browser?**
A) `max-age`  B) `s-maxage`  C) `no-store`  D) `private`
**Answer: B**

**17. TTL returns `-2` when:**
A) No expiry is set  B) The key does not exist  C) TTL expired exactly now and persisted  D) Cluster is down
**Answer: B**

**18. Why does adding TTL jitter help?**
A) Saves memory  B) Prevents many keys expiring together (avalanche)  C) Speeds up AOF  D) Encrypts keys
**Answer: B**

**19. Pipelining mainly reduces:**
A) CPU on the server  B) Network round-trip overhead  C) Memory usage  D) Disk writes
**Answer: B**

**20. A Redis lock used for correctness-critical writes should also use:**
A) Longer TTL only  B) Fencing tokens  C) Pub/Sub  D) `KEYS`
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **No TTL on cache keys**, causing unbounded memory growth.
2. **Using `KEYS *`** in production.
3. **Caching without an invalidation plan.**
4. **Identical TTLs** that expire together.
5. **No stampede protection** on hot keys.
6. **Treating Redis as durable** without AOF/replication/backups.
7. **Storing huge values or giant collections** (big keys).
8. **`SMEMBERS`/`HGETALL`/`LRANGE 0 -1` on large structures.**
9. **Creating a new client per request.**
10. **No `error` event handler** on the client (process crash).
11. **Using `SETNX` + `EXPIRE` separately.**
12. **Releasing a lock without checking ownership.**
13. **Caching personalized data under shared keys.**
14. **Cross-slot multi-key commands** in Cluster.
15. **Leaving `MONITOR` running.**
16. **Public exposure / no auth / no TLS.**
17. **`maxmemory` unset or set too close to RAM** (fork OOM).
18. **`noeviction` for a cache** or `allkeys-*` for a queue store.
19. **Assuming Pub/Sub is reliable.**
20. **Using Redis as a source of truth for large cold data.**
21. **No fallback when Redis is down** (cascading failure).
22. **Ignoring hit ratio and evictions in monitoring.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You choose the **cache pattern per data class** and can argue staleness vs complexity.
- You protect the database from **stampede, penetration and avalanche** with concrete techniques.
- You know **eviction, TTL and memory behaviour**, fragmentation, big/hot keys, and how to find them.
- You explain **durability honestly** (RDB/AOF/replication) and design for failure and failover.
- You pick **Sentinel vs Cluster** correctly, use hash tags, and understand resharding.
- You write **atomic Lua**, know the cost of blocking scripts, and use pipelining.
- You treat **distributed locks** carefully (TTL, tokens, fencing) and know the Redlock debate.
- You pick **Streams vs Pub/Sub vs Kafka** based on delivery guarantees.
- You secure Redis (ACLs, TLS, network isolation) and plan upgrades and licensing (Valkey).
- You bring **metrics and incident stories** with before/after numbers.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands
```
SET k v EX 60 NX         GET k           DEL / UNLINK k
INCR k                   EXPIRE k 60     TTL k
HSET h f v               HGETALL h       LPUSH / RPOP / BRPOP
SADD s m                 ZADD z score m  ZREVRANGE z 0 9 WITHSCORES
XADD s * f v             XREADGROUP      XACK
SCAN 0 MATCH p:* COUNT 100
INFO memory | stats | replication       SLOWLOG GET 10
MEMORY USAGE k           OBJECT ENCODING k
```

### Caching checklist
Cache-aside default • TTL + jitter • versioned keys • include tenant/locale in key • delete (don't update) on write • stampede lock/SWR • negative caching • local L1 for hot keys • metrics on hit ratio • fallback when Redis is down.

### Redis ops checklist
`maxmemory` + policy • persistence matches use case • replicas + Sentinel/Cluster • THP off • `overcommit_memory=1` • slowlog on • alerts (memory, evictions, lag, latency) • backups tested • TLS + ACL + private network.

### Pattern quick picks
Sessions → String/Hash + TTL • Rate limit → Lua + ZSET/INCR • Leaderboard → ZSET • Queue → Stream/BullMQ • Lock → `SET NX PX` + token • Uniques → HyperLogLog • Flags → Bitmap • Search → RediSearch.

### Interview strategy
1. Clarify access pattern, staleness tolerance, and failure impact.
2. Name the pattern and the Redis structure.
3. Show a short command/code example.
4. Discuss failure modes (stampede, outage, stale reads) and mitigations.
5. Mention ops: memory, eviction, persistence, monitoring.
6. Close with a measured result from a real project.

### Final checklist before the interview
- [ ] Explain why Redis is fast and what single-threaded means.
- [ ] Use all core data types and give a use case for each.
- [ ] Explain cache-aside, write-through, write-back, and their trade-offs.
- [ ] Explain stampede, penetration, avalanche, hot/big keys with fixes.
- [ ] Explain TTL, eviction policies, and maxmemory behaviour.
- [ ] Compare RDB vs AOF, replication, Sentinel vs Cluster, hash slots/tags.
- [ ] Write a Lua rate limiter and a safe distributed lock; know Redlock limits.
- [ ] Compare Pub/Sub vs Streams vs Kafka; explain at-least-once and idempotency.
- [ ] Describe HTTP/CDN caching headers and layered caches.
- [ ] Prepare one performance story and one incident story with numbers.
