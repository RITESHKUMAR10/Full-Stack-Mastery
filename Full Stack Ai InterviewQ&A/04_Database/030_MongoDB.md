# MongoDB Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **MongoDB 6.0, 7.0 and 8.0** (self-managed and MongoDB Atlas) with the current **Node.js driver (6.x)** and **mongosh**. Features that matter in interviews are marked with the version they arrived in: multi-document ACID transactions (4.0 replica sets, 4.2 sharded clusters), wildcard indexes and update with aggregation pipeline (4.2), time series collections, online resharding and `$setWindowFields` (5.0), clustered collections (5.3), Queryable Encryption (6.0 preview, 7.0 GA), `analyzeShardKey` (7.0). Anything marked "verify" should be checked in the official docs (mongodb.com/docs) for your exact version and deployment (Atlas vs self-hosted). Examples use the sample name **Ritesh Kumar**.
> This file covers the document model and BSON, CRUD and operators, query and aggregation language, indexing and the ESR rule, schema design patterns (embed vs reference), transactions, replication (write/read concern), sharding, change streams, WiredTiger internals, security, performance tuning, backups, operations, Atlas features (Search, Vector Search), Mongoose, and production practice. Relational comparisons refer to `026_SQL.md` to `029_SQLite.md`.

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
- [Part 12: MongoDB Internals](#-part-12-mongodb-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is MongoDB?
An open-source, **document-oriented NoSQL database**. Data is stored as flexible, JSON-like **BSON documents** inside **collections** (instead of rows in tables). It supports rich queries, secondary indexes, an aggregation framework, replication for high availability, sharding for horizontal scale, and multi-document ACID transactions. Created by 10gen (now MongoDB, Inc.) in 2009; available self-managed or as the managed cloud service **MongoDB Atlas**.

### Q2. Why use MongoDB? Typical use cases
Flexible/evolving schemas, nested data that is read together (profiles, catalogs, content, orders with line items), high write throughput, horizontal scaling, JSON-native APIs (MERN stack), event/IoT/time-series data, mobile and real-time apps, and search/vector use cases on Atlas. Not ideal for data with heavy many-to-many relationships and complex multi-table joins/transactions as the main workload (relational databases fit better).

### Q3. SQL vs MongoDB terminology *(Must-know)*
| Relational | MongoDB |
|---|---|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary key | `_id` (always present, unique per collection) |
| Index | Index |
| JOIN | `$lookup` (or embedding) |
| `GROUP BY` | `$group` stage in aggregation |
| Foreign key | Reference (manual; not enforced) |
| Schema (fixed) | Flexible schema (optional validation) |

### Q4. What is BSON?
**Binary JSON**: the binary serialization format MongoDB stores and transmits. It extends JSON with more types (`ObjectId`, `Date`, `Int32`, `Int64`, `Double`, `Decimal128`, `BinData`, `Timestamp`, `Regex`, etc.), is traversable/fast to scan and keeps field order. Documents are limited to **16 MB**; deeper nesting beyond 100 levels is not allowed.

### Q5. What is a document? Example
```js
{
  _id: ObjectId("66f1a2b3c4d5e6f708192a3b"),
  name: "Ritesh Kumar",
  email: "ritesh@example.com",
  age: 28,
  address: { city: "Delhi", pin: "110001" },       // embedded document
  skills: ["node", "react", "mongodb"],            // array
  createdAt: ISODate("2025-10-24T10:00:00Z")
}
```
Documents in the same collection can have different fields.

### Q6. What is `_id` and `ObjectId`? *(Must-know)*
Every document needs a unique `_id` (primary key). If you do not provide one, the driver generates an **ObjectId**, a 12-byte value: 4-byte timestamp (seconds) + 5-byte random value (per process) + 3-byte incrementing counter. It is roughly time-ordered, globally unique without coordination, and indexed automatically. `_id` is immutable. You may use any non-array type as `_id` (string, number, UUID, compound object).
```js
ObjectId("66f1a2b3c4d5e6f708192a3b").getTimestamp();   // ISODate of creation
```

### Q7. Install and connect
```bash
mongosh "mongodb://localhost:27017"
mongosh "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/shop"
```
```js
use shop                 // switch (lazy-creates DB on first write)
show dbs; show collections
db.getName(); db.stats()
```
Default port 27017. Databases and collections are created implicitly on first insert.

### Q8. Basic CRUD in mongosh *(Must-know)*
```js
db.users.insertOne({ name: "Ritesh Kumar", email: "ritesh@example.com", age: 28 })
db.users.insertMany([{ name: "A", age: 20 }, { name: "B", age: 30 }])
db.users.find({ age: { $gte: 25 } }, { name: 1, _id: 0 }).sort({ age: -1 }).limit(10)
db.users.findOne({ email: "ritesh@example.com" })
db.users.updateOne({ email: "ritesh@example.com" }, { $set: { city: "Delhi" }, $inc: { logins: 1 } })
db.users.updateMany({ age: { $lt: 18 } }, { $set: { minor: true } })
db.users.replaceOne({ _id: id }, { name: "New doc" })          // replaces the whole document (except _id)
db.users.deleteOne({ email: "x@y.com" })
db.users.deleteMany({ active: false })
db.users.countDocuments({ age: { $gte: 18 } })
```
Updates without an update operator (`$set`, etc.) are replacements in `replaceOne` and errors in `updateOne`.

### Q9. Query operators
Comparison: `$eq $ne $gt $gte $lt $lte $in $nin`. Logical: `$and $or $nor $not`. Element: `$exists $type`. Evaluation: `$regex $expr $mod $text $where`. Array: `$all $elemMatch $size`. Geospatial: `$near $geoWithin $geoIntersects`.
```js
db.users.find({ $or: [{ age: { $lt: 18 } }, { city: "Delhi" }] })
db.users.find({ skills: { $all: ["node", "react"] } })
db.users.find({ name: /^rit/i })                      // regex (case-insensitive)
db.users.find({ nickname: { $exists: false } })
db.users.find({ age: { $type: "number" } })
```

### Q10. Querying nested fields and arrays
```js
db.users.find({ "address.city": "Delhi" })                    // dot notation (quotes required)
db.users.find({ skills: "node" })                             // array contains
db.users.find({ skills: { $size: 3 } })
db.orders.find({ items: { $elemMatch: { sku: "A1", qty: { $gte: 2 } } } })   // same element must match both
```
Without `$elemMatch`, conditions on array-of-objects fields can be satisfied by different elements.

### Q11. Projection
```js
db.users.find({}, { name: 1, email: 1 })        // include only (plus _id by default)
db.users.find({}, { _id: 0, password: 0 })      // exclude
db.posts.find({}, { comments: { $slice: 3 } })  // first 3 array elements
```
You cannot mix inclusion and exclusion except for `_id`. Projection reduces network and memory use and enables **covered queries**.

### Q12. Sorting, limit, skip
```js
db.users.find().sort({ age: -1, name: 1 }).skip(20).limit(10)
```
`skip()` scans and discards documents: slow for large offsets. Use range-based pagination (`_id` or a sort key).

### Q13. Update operators *(Must-know)*
| Operator | Effect |
|---|---|
| `$set` / `$unset` | set / remove fields |
| `$inc` / `$mul` | add / multiply numbers |
| `$min` / `$max` | update only if smaller / larger |
| `$rename` | rename a field |
| `$currentDate` | set to now |
| `$push` / `$addToSet` | append / append if absent |
| `$pull` / `$pullAll` / `$pop` | remove matching / remove first or last |
| `$setOnInsert` | set only during upsert insert |
```js
db.users.updateOne({ _id }, { $push: { skills: { $each: ["go", "rust"], $slice: -10 } } })
db.counters.updateOne({ _id: "visits" }, { $inc: { n: 1 } }, { upsert: true })
```

### Q14. Upsert and `findOneAndUpdate`
```js
db.users.updateOne({ email: "a@b.com" }, { $set: { name: "A" }, $setOnInsert: { createdAt: new Date() } }, { upsert: true })
db.jobs.findOneAndUpdate({ status: "pending" }, { $set: { status: "running" } }, { sort: { createdAt: 1 }, returnDocument: "after" })
```
`findOneAndUpdate` is atomic and the standard way to build queues or counters. Upserts on a field without a unique index can create duplicates under concurrency: always back them with a unique index.

### Q15. Array update operators with positional syntax
```js
db.orders.updateOne({ _id, "items.sku": "A1" }, { $set: { "items.$.qty": 5 } })               // first matched element
db.orders.updateOne({ _id }, { $inc: { "items.$[].qty": 1 } })                                // all elements
db.orders.updateOne({ _id }, { $set: { "items.$[e].price": 99 } }, { arrayFilters: [{ "e.sku": "A1" }] })   // filtered
```

### Q16. Bulk operations
```js
db.users.bulkWrite([
  { insertOne: { document: { name: "A" } } },
  { updateOne: { filter: { name: "B" }, update: { $set: { age: 31 } } } },
  { deleteOne: { filter: { name: "C" } } },
], { ordered: false })
```
`ordered: false` continues after errors and lets the server parallelize. Batch sizes are limited (100,000 operations per batch by the server; drivers split automatically).

### Q17. Data types to remember
`String`, `Int32`, `Int64` (`NumberLong`), `Double`, `Decimal128` (use for money: `NumberDecimal("19.99")`), `Boolean`, `Date`, `ObjectId`, `Array`, `Object`, `Null`, `Binary`, `Timestamp`, `Regex`, `UUID`. JavaScript numbers become `Double` by default in mongosh/Node, which causes surprises with large integers or exact decimals.

### Q18. Schema validation
```js
db.createCollection("users", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["name", "email"],
    properties: {
      name: { bsonType: "string", minLength: 1 },
      email: { bsonType: "string", pattern: "^.+@.+$" },
      age: { bsonType: "int", minimum: 0, maximum: 150 }
    }
  } },
  validationLevel: "strict", validationAction: "error"
})
```
MongoDB is schema-flexible, but production systems should still enforce a schema with validation or an ODM. `collMod` changes validators later.

### Q19. Indexes basics *(Must-know)*
Without an index MongoDB does a **collection scan (COLLSCAN)**. Indexes are B-trees.
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.orders.createIndex({ customerId: 1, createdAt: -1 })
db.users.getIndexes()
db.users.dropIndex("email_1")
db.users.find({ email: "x" }).explain("executionStats")
```
Every collection has a default unique index on `_id`.

### Q20. Index types
Single field, compound, multikey (arrays), text, hashed, geospatial (`2d`, `2dsphere`), wildcard, partial, sparse, TTL, unique, hidden, clustered (5.3), and Atlas Search / Vector Search indexes (managed separately).

### Q21. Reading `explain()`
Key fields in `executionStats`: `winningPlan.stage` (`IXSCAN`, `COLLSCAN`, `FETCH`, `SORT`, `PROJECTION_COVERED`), `totalKeysExamined`, `totalDocsExamined`, `nReturned`, `executionTimeMillis`. A healthy query has `totalDocsExamined` close to `nReturned` and uses `IXSCAN`. A `SORT` stage in the plan means an in-memory sort (limit 100 MB unless `allowDiskUse`).

### Q22. Aggregation framework basics *(Must-know)*
A pipeline of stages; each stage transforms the stream of documents.
```js
db.orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: ISODate("2025-01-01") } } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" }, orders: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 5 },
  { $project: { _id: 0, customerId: "$_id", total: 1, orders: 1 } }
])
```
Common stages: `$match`, `$project`, `$addFields`/`$set`, `$unset`, `$group`, `$sort`, `$limit`, `$skip`, `$unwind`, `$lookup`, `$count`, `$facet`, `$bucket`, `$out`, `$merge`. Put `$match` and `$sort` early so they can use indexes.

### Q23. `$lookup` (join) and `$unwind`
```js
db.orders.aggregate([
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { amount: 1, "customer.name": 1 } }
])
```
`$lookup` is a left outer join and can be expensive; index the `foreignField`. If you need joins on most reads, reconsider the schema (embedding) or use a relational database.

### Q24. Counting
`countDocuments(filter)` is accurate (uses an aggregation `$match`+`$group`); `estimatedDocumentCount()` uses collection metadata (fast, ignores filters, may be slightly off after unclean shutdown or in sharded clusters with orphans). Legacy `count()` is deprecated.

### Q25. Transactions overview
Since 4.0 (replica sets) and 4.2 (sharded clusters), MongoDB supports multi-document ACID transactions with snapshot isolation.
```js
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne({ _id: 1 }, { $inc: { balance: -500 } }, { session });
    await accounts.updateOne({ _id: 2 }, { $inc: { balance: 500 } }, { session });
  }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
} finally { await session.endSession(); }
```
Single-document operations are always atomic, so a good schema (embedding related data) avoids most transactions.

### Q26. Replication in one minute *(Must-know)*
A **replica set** is a group of `mongod` nodes holding the same data: one **primary** (accepts writes) and several **secondaries** (replicate the primary's **oplog**). If the primary fails, the secondaries hold an **election** and one becomes the new primary (typically within seconds). Minimum production setup: 3 voting members (primary + 2 secondaries, or primary + secondary + arbiter, though arbiters are discouraged).

### Q27. Sharding in one minute
**Sharding** distributes data across multiple shards (each usually a replica set) using a **shard key**. Components: **mongos** (query router), **config servers** (cluster metadata, a replica set), **shards**. Data is split into **chunks** by shard key ranges (or hashes) and a **balancer** migrates chunks. Use it when data or throughput exceeds one replica set; the shard key choice is the most important decision.

### Q28. Write concern *(Must-know)*
How many nodes must acknowledge a write: `w: 1` (primary only), `w: "majority"` (a majority of voting data-bearing members; default for most deployments since 5.0), `w: 0` (no ack), plus `j: true` (journaled) and `wtimeout`. `majority` protects against **rollback** after failover.

### Q29. Read concern and read preference
Read concern: `local` (default on primary), `available`, `majority` (only majority-committed data), `linearizable`, `snapshot` (for transactions). Read preference: `primary` (default), `primaryPreferred`, `secondary`, `secondaryPreferred`, `nearest`. Reading from secondaries scales reads but may return stale data (replication lag).

### Q30. TTL indexes
Automatically delete documents after a time:
```js
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
db.tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })    // expire at the date stored in the field
```
A background thread runs about every 60 seconds, so deletion is not instant. Works only on `Date` (or arrays of dates) fields.

### Q31. Capped and time series collections
**Capped collections**: fixed size, insertion-ordered, oldest documents overwritten (logs, caches); no deletes of individual docs. **Time series collections** (5.0+): optimized storage for measurements with `timeField`, `metaField`, `granularity`.
```js
db.createCollection("readings", { timeseries: { timeField: "ts", metaField: "sensor", granularity: "minutes" } })
```

### Q32. Text search and regex
```js
db.articles.createIndex({ title: "text", body: "text" })
db.articles.find({ $text: { $search: "mongodb tuning" } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } })
```
One text index per collection. For relevance, fuzzy search, facets, autocomplete use **Atlas Search** (Lucene-based). Anchored case-sensitive regex (`/^abc/`) can use an index; unanchored or case-insensitive regex scans.

### Q33. Embedding vs referencing (intro) *(Must-know)*
**Embed** data that is read together, has a one-to-few relationship, and is bounded (address inside user, line items inside order). **Reference** (store `_id`s) when data is large, unbounded, shared across many parents, or updated independently (user → posts). Rule of thumb: model data the way the application reads it.

### Q34. Mongoose basics (Node.js ODM)
```js
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGO_URI);
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age:   { type: Number, min: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
const u = await User.create({ name: 'Ritesh Kumar', email: 'ritesh@example.com', age: 28 });
const found = await User.findOne({ email: 'ritesh@example.com' }).populate('posts').lean();
```
`unique: true` creates an index, not a validator. `.lean()` returns plain objects (faster, no getters/methods). `populate` runs extra queries (it is not a database join).

### Q35. MongoDB drivers and the Node.js driver
Official drivers exist for Node.js, Python (PyMongo/Motor), Java, Go, C#, Rust, PHP, Ruby and more. Node example:
```js
import { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.MONGO_URI, { maxPoolSize: 50 });
await client.connect();
const col = client.db('shop').collection('users');
const doc = await col.findOne({ email: 'ritesh@example.com' });
```
Create **one** `MongoClient` per process and reuse it (it manages a connection pool).

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Compound indexes and the ESR rule *(Must-know)*
Order the keys of a compound index by **E**quality, **S**ort, **R**ange.
```js
// query: { status: "paid", createdAt: { $gte: d } } sorted by { amount: -1 }
// ESR index: equality(status), sort(amount), range(createdAt)
db.orders.createIndex({ status: 1, amount: -1, createdAt: 1 })
```
An index `{a:1, b:1, c:1}` supports queries on `a`, `a,b`, `a,b,c` (prefixes) and can provide sort order for matching prefixes with equality predicates. Sort direction must match the index (or its exact reverse for all fields).

### Q37. Covered queries
A query is covered when all filter and projected fields are in the index and `_id` is excluded (or in the index): `totalDocsExamined: 0`, `PROJECTION_COVERED` in the plan.
```js
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "x@y.com" }, { _id: 0, email: 1, name: 1 })
```
Multikey indexes cannot cover queries on the array field.

### Q38. Multikey, partial, sparse, unique indexes
- **Multikey**: index on an array field creates an entry per element. A compound index can contain at most one array field.
- **Partial**: index only documents matching a filter (smaller, faster): `createIndex({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } })`.
- **Sparse**: skip documents missing the field (partial is more general and preferred).
- **Unique** + `null`: multiple missing fields collide on a plain unique index (treated as null) unless the index is partial/sparse.

### Q39. Index build and maintenance
Since 4.2 index builds hold an exclusive lock only briefly at the start and end (earlier versions had foreground/background modes). Still, big builds consume I/O and memory; build during low traffic, monitor with `db.currentOp()`. Use rolling index builds in replica sets for large production collections on older versions. Check usage with `db.coll.aggregate([{ $indexStats: {} }])` and remove unused indexes; hide an index first (`db.coll.hideIndex("name")`) to test the impact.

### Q40. Wildcard and text alternatives
Wildcard index (4.2): `createIndex({ "attributes.$**": 1 })` indexes arbitrary subfields for dynamic attribute patterns. It is flexible but larger and less efficient than targeted compound indexes. For search use cases use Atlas Search.

### Q41. Aggregation: `$group` details
Accumulators: `$sum`, `$avg`, `$min`, `$max`, `$first`, `$last`, `$push`, `$addToSet`, `$count`, `$stdDevPop`, `$top`/`$bottom`/`$topN` (5.2).
```js
db.orders.aggregate([
  { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, revenue: { $sum: "$amount" }, avg: { $avg: "$amount" } } },
  { $sort: { "_id.y": 1, "_id.m": 1 } }
])
```
`$group` is blocking and memory-limited (100 MB per stage unless `allowDiskUse: true`).

### Q42. `$project` vs `$addFields`/`$set` vs `$unset`
`$project` decides the final shape (include/exclude, computed fields). `$addFields`/`$set` adds or overwrites fields while keeping all others. `$unset` removes fields. Use `$replaceRoot`/`$replaceWith` to promote an embedded document.

### Q43. `$facet`, `$bucket`, `$sortByCount`
```js
db.products.aggregate([{ $facet: {
  byCategory: [{ $sortByCount: "$category" }],
  priceBands: [{ $bucket: { groupBy: "$price", boundaries: [0, 500, 1000, 5000], default: "5000+" } }],
  top5: [{ $sort: { rating: -1 } }, { $limit: 5 }]
} }])
```
`$facet` runs sub-pipelines on the same input (good for faceted navigation); each sub-pipeline's output must fit in 16 MB.

### Q44. Window functions: `$setWindowFields` (5.0)
```js
db.sales.aggregate([{ $setWindowFields: {
  partitionBy: "$region", sortBy: { date: 1 },
  output: { runningTotal: { $sum: "$amount", window: { documents: ["unbounded", "current"] } },
            rank: { $rank: {} } } } }])
```
Supports ranking, running totals, moving averages, `$shift`, `$derivative`, `$integral`.

### Q45. `$lookup` variants (pipeline form, correlated)
```js
db.orders.aggregate([{ $lookup: {
  from: "items", let: { oid: "$_id" },
  pipeline: [{ $match: { $expr: { $eq: ["$orderId", "$$oid"] } } }, { $project: { sku: 1, qty: 1 } }],
  as: "items" } }])
```
Prefer the localField/foreignField form when possible; ensure the foreign side is indexed. `$graphLookup` handles recursive hierarchies (org charts, categories).

### Q46. `$merge` and `$out`
`$out` replaces a collection with the pipeline output; `$merge` upserts into an existing collection (incremental materialized views). Useful for pre-aggregated reporting collections refreshed by scheduled jobs.

### Q47. Expression operators
String (`$concat`, `$substr`, `$toLower`, `$split`, `$regexMatch`), date (`$dateToString`, `$dateTrunc`, `$dateDiff`, `$dateAdd`), arithmetic, conditional (`$cond`, `$switch`, `$ifNull`), array (`$filter`, `$map`, `$reduce`, `$size`, `$arrayElemAt`, `$slice`, `$in`), type conversion (`$toInt`, `$toDecimal`, `$convert`), object (`$mergeObjects`, `$objectToArray`).
```js
{ $set: { activeSkills: { $filter: { input: "$skills", as: "s", cond: { $ne: ["$$s.level", "none"] } } } } }
```

### Q48. Update with aggregation pipeline (4.2)
```js
db.users.updateMany({}, [{ $set: { fullName: { $concat: ["$first", " ", "$last"] } } }])
```
Allows computed updates referencing other fields in the same document.

### Q49. Pagination patterns
Offset: `skip/limit` (slow for deep pages). Range (keyset):
```js
db.posts.find({ _id: { $lt: lastId } }).sort({ _id: -1 }).limit(20)
db.posts.find({ $or: [{ createdAt: { $lt: ts } }, { createdAt: ts, _id: { $lt: lastId } }] }).sort({ createdAt: -1, _id: -1 }).limit(20)
```
Back the sort with an index `{ createdAt: -1, _id: -1 }`.

### Q50. Duplicate key errors (E11000) and idempotency
Unique index violation returns error code 11000. Handle by catching it (treat as "already exists") or using upserts with unique keys for idempotent processing. Bulk inserts with `ordered: false` report partial failures in `writeErrors`.

### Q51. Working with dates
Store dates as BSON `Date` (UTC), not strings. Use `ISODate()` in mongosh and `new Date()` in Node. Query ranges with `$gte`/`$lt`. Convert time zones in aggregation (`$dateToString` with `timezone`). Mixing strings and Dates in one field breaks sorting and range queries.

### Q52. Working with money
Use `Decimal128` (`NumberDecimal`) or integer minor units. Avoid `Double`. In Node: `Decimal128.fromString("19.99")`. Mongoose: `mongoose.Types.Decimal128`.

### Q53. Relationships: one-to-one, one-to-many, many-to-many
- One-to-few: embed an array of subdocuments.
- One-to-many (bounded): embed or reference from the parent; one-to-many (unbounded): reference from the child (`post.userId`).
- Many-to-many: arrays of references on one or both sides (`student.courseIds`, `course.studentIds`) or a junction collection.
Model for read patterns and growth.

### Q54. Common schema design patterns *(Must-know)*
**Subset** (embed only the most-used items, e.g. last 10 reviews), **Bucket** (group time-series/IoT data into per-hour documents), **Computed** (store precomputed values like totals), **Extended Reference** (copy a few fields from the referenced doc to avoid `$lookup`), **Outlier** (flag docs with huge arrays and handle separately), **Attribute** (key/value array for sparse fields, indexed together), **Polymorphic** (different shapes in one collection with a `type` field), **Schema versioning** (`schemaVersion` field for gradual migration), **Tree** patterns (parent ref, child refs, materialized path, nested sets).

### Q55. Schema anti-patterns
Unbounded arrays (documents grow until the 16 MB limit and updates get slower), massive arrays with multikey indexes, bloated documents (fetching KBs when you need a few fields), too many collections or indexes, unnecessary indexes (slow writes, RAM), `$lookup`-heavy relational modeling, storing everything as strings, and case-insensitive regex scans.

### Q56. Document growth and padding
WiredTiger writes a new version of a document on update (copy-on-write at the page level), so document growth no longer causes the "padding factor" problems of MMAPv1. Still, frequent growth of large documents increases I/O and fragmentation; prefer bounded arrays.

### Q57. Atomicity and "single-document transactions"
Operations on a single document, including its embedded arrays and subdocuments, are atomic. This is the main reason to embed related data: many invariants are enforced without multi-document transactions.

### Q58. Optimistic concurrency with a version field
```js
const r = await col.updateOne({ _id, version: 3 }, { $set: { title: "New" }, $inc: { version: 1 } });
if (r.modifiedCount === 0) throw new Error("Conflict: reload and retry");
```
Mongoose's `versionKey` (`__v`) and `optimisticConcurrency: true` do this for arrays/whole docs.

### Q59. Change streams (3.6) *(Must-know)*
Real-time notifications of changes via the oplog (requires a replica set or sharded cluster).
```js
const stream = db.collection('orders').watch([{ $match: { operationType: { $in: ['insert', 'update'] } } }], { fullDocument: 'updateLookup' });
for await (const change of stream) { console.log(change.operationType, change.documentKey, change.fullDocument); }
```
Use a **resume token** (`change._id`) to continue after restarts. Common uses: cache invalidation, search index sync, event-driven microservices, ETL. Pre/post images (6.0) require enabling `changeStreamPreAndPostImages`.

### Q60. Security basics
Enable authentication (`security.authorization: enabled`), create users with least-privilege roles, bind to private IPs (`bindIp`), use TLS, firewall port 27017, rotate credentials, enable auditing in Enterprise/Atlas. Self-hosted MongoDB historically shipped with auth disabled; exposed instances were mass-ransomed. Atlas enforces auth, TLS and IP access lists by default.
```js
db.createUser({ user: "app", pwd: passwordPrompt(), roles: [{ role: "readWrite", db: "shop" }] })
```

### Q61. NoSQL injection
User-supplied JSON inserted into queries can contain operators.
```js
// Vulnerable: req.body = { "email": { "$ne": null }, "password": { "$ne": null } }
User.findOne({ email: req.body.email, password: req.body.password });
```
Defenses: validate input types (zod/Joi), cast to strings explicitly, `mongo-sanitize`/`express-mongo-sanitize`, never use `$where` or JavaScript evaluation with user input, hash passwords (bcrypt/argon2) and compare in code.

### Q62. Backups: tools
`mongodump`/`mongorestore` (logical, BSON; good for small DBs), `mongoexport`/`mongoimport` (JSON/CSV), filesystem or cloud snapshots with journaling (consistent per volume), Atlas Cloud Backup with point-in-time restore, Ops Manager/Cloud Manager, Percona Backup for MongoDB (PBM). Always test restores.
```bash
mongodump --uri="mongodb://localhost:27017/shop" --gzip --archive=shop.gz
mongorestore --uri="mongodb://localhost:27017" --gzip --archive=shop.gz --drop
```

### Q63. Monitoring essentials
`db.serverStatus()`, `db.currentOp()`, `rs.status()`, `db.collection.stats()`, `mongostat`, `mongotop`, the database profiler (`db.setProfilingLevel(1, { slowms: 100 })`, collection `system.profile`), Atlas metrics/Performance Advisor, Prometheus `mongodb_exporter`. Track opcounters, connections, WiredTiger cache usage and evictions, replication lag, page faults, queued operations, slow queries.

### Q64. Connection management
Drivers use a pool (`maxPoolSize` default 100 in the Node driver). Use a single client per process; in serverless functions, cache the client in module scope across invocations to avoid connection storms. Atlas has per-tier connection limits. Set `serverSelectionTimeoutMS`, `socketTimeoutMS`, and `retryWrites=true`, `w=majority` in the URI.

### Q65. Retryable writes and reads
Drivers automatically retry certain write operations once after transient network errors or elections (`retryWrites=true` default) using transaction ids to prevent double application. Retryable reads exist too. Not retried: `updateMany` with `multi`, and operations with `w:0`.

### Q66. GridFS
Stores files larger than 16 MB by splitting into chunks (255 KB default) in `fs.chunks` plus metadata in `fs.files`. For most web apps, object storage (S3) with a URL stored in MongoDB is simpler and cheaper.

### Q67. Geospatial queries
```js
db.places.createIndex({ location: "2dsphere" })        // GeoJSON points
db.places.insertOne({ name: "Cafe", location: { type: "Point", coordinates: [77.2090, 28.6139] } })   // [lng, lat]
db.places.find({ location: { $near: { $geometry: { type: "Point", coordinates: [77.21, 28.61] }, $maxDistance: 2000 } } })
```
GeoJSON uses **longitude first**. `$near` sorts by distance; `$geoWithin` finds items in a shape.

### Q68. Collations and case-insensitive queries
```js
db.users.createIndex({ email: 1 }, { collation: { locale: "en", strength: 2 }, unique: true })
db.users.find({ email: "RITESH@EXAMPLE.COM" }).collation({ locale: "en", strength: 2 })
```
The query's collation must match the index collation to use it. Alternatively store a normalized lowercase field.

### Q69. Import data and sample datasets
`mongoimport --db shop --collection users --file users.json --jsonArray`; Atlas has sample datasets. Use `--mode upsert --upsertFields email` for idempotent imports.

### Q70. Mongoose pitfalls
`autoIndex` builds indexes on startup (disable in production and manage indexes via migrations), buffering commands before connect, `populate` N+1 patterns, using `save()` vs `updateOne` semantics (validators and middleware differ), `lean()` for read performance, schema `strict` mode dropping unknown fields silently, virtuals not stored, and `findByIdAndUpdate` skipping validators unless `runValidators: true`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. WiredTiger storage engine *(Must-know)*
Default since 3.2. Features: **document-level concurrency** (optimistic concurrency control, so writers to different documents do not block each other), **MVCC snapshots**, **compression** (Snappy for collections by default, zstd/zlib options; prefix compression for indexes), a **write-ahead journal** for durability between checkpoints, and **checkpoints** (default every 60 seconds) that write a consistent snapshot to data files. Memory: the WiredTiger cache defaults to the larger of 50% of (RAM − 1 GB) or 256 MB; the OS file cache holds compressed data. Write conflicts on the same document cause automatic retries internally or `WriteConflict` errors in transactions.

### Q72. Journaling and durability
Writes go to the in-memory cache and the journal (flushed every 100 ms by default, or immediately with `j: true`/`w: majority` with journaling). After a crash, MongoDB recovers from the last checkpoint and replays the journal. In replica sets, `w: "majority"` + `j: true` is the durable choice.

### Q73. Replica set elections *(Must-know)*
Heartbeats every 2 seconds; if a secondary cannot reach the primary for `electionTimeoutMillis` (10 s default), it calls an election. Uses a Raft-like protocol (protocol version 1): a candidate needs votes from a **majority** of voting members; terms prevent split-brain. Eligible members: priority > 0, up to date in oplog. Settings: `priority`, `votes`, `hidden`, `secondaryDelaySecs` (delayed member), tags. Max 7 voting members (50 members total). Always use an odd number of voters.

### Q74. Replica set member types
- **Primary**: accepts writes.
- **Secondary**: replicates and can serve reads (with a secondary read preference).
- **Hidden** (`hidden: true, priority: 0`): invisible to clients; used for backups and analytics.
- **Delayed** (`secondaryDelaySecs`, formerly `slaveDelay`): hidden and intentionally behind; protection against human error such as dropping a collection.
- **Arbiter**: votes but holds no data. Avoid: it weakens `w: majority` guarantees and cannot help recovery.
- **Priority 0** members never become primary (useful in remote data centers).
Reconfigure online with `rs.reconfig()`; add or remove one voting member at a time.

### Q75. Oplog
A capped collection `local.oplog.rs` on every member holding idempotent operations in order. Secondaries tail the primary's (or another member's) oplog and apply entries. Oplog window = time span the oplog covers; if a secondary falls behind past the window it needs a full **resync**. Size it for maintenance windows and peak writes (`replSetResizeOplog`, default 5% of free disk up to 50 GB).

### Q76. Rollback
If a primary accepted writes not replicated to a majority and then steps down, those writes are rolled back when it rejoins (saved to `rollback` files). Prevent data loss with `w: "majority"`. Rollbacks are rare but the reason majority write concern matters.

### Q77. Read/write concern combinations for correctness
- **Casual apps**: `w: 1`, `readConcern: local`.
- **Default safe**: `w: majority`, `readConcern: majority` (or local).
- **Read your own writes**: use **causal consistency** sessions (`causalConsistency: true`) when reading from secondaries.
- **Strict single-document linearizability**: `readConcern: linearizable` (primary only, slower).
- **Multi-document consistency**: transactions with `snapshot` read concern and `majority` write concern.

### Q78. Read preference and replication lag
Reading from secondaries scales reads but exposes you to lag (`rs.printSecondaryReplicationInfo()`). Use `maxStalenessSeconds` (minimum 90 s) to avoid very stale members, tag sets for locality, and `hedged reads` (4.4+, sharded) to reduce tail latency. Analytics workloads can use dedicated hidden or analytics-tagged members.

### Q79. Sharding: choosing a shard key *(Must-know)*
A good shard key has **high cardinality**, **even distribution** (no hot shard), and supports **targeted queries** (most queries include the key). Types: **ranged** (good for range queries, risk of hotspots with monotonically increasing keys such as `_id` or timestamps), **hashed** (even writes, poor range queries), **compound** (e.g. `{ tenantId: 1, _id: 1 }`; or `{ userId: "hashed" }`). Since 4.2 the value of a document's shard key field can be updated (the update must run as a retryable write or inside a transaction), 4.4 added `refineCollectionShardKey`, and 5.0 added online resharding. Use `analyzeShardKey` (7.0) to evaluate candidates before choosing.

### Q80. Query routing: targeted vs scatter-gather
If the query includes the shard key (or a prefix), `mongos` routes to the relevant shard(s) (**targeted**). Otherwise it sends the query to all shards (**scatter-gather**), which increases latency and load. Sorts and aggregations merge results at `mongos` or a chosen shard. Design the shard key to match the dominant access pattern.

### Q81. Chunks, balancer, jumbo chunks
Data is partitioned into chunks (default max 128 MB). The balancer moves chunks to even out data distribution. A **jumbo chunk** (a range with a single shard key value too large to split) cannot be split or moved: cause of imbalance; fix by choosing a higher-cardinality key (compound with a suffix) or resharding. Balancer windows (`setBalancerState`, schedule) avoid peak hours. Zones (tag-aware sharding) pin ranges to specific shards (data locality, tiering).

### Q82. Resharding and shard key refinement
`reshardCollection` (5.0) changes the shard key online (copies data in the background; needs spare capacity). `refineCollectionShardKey` (4.4) adds suffix fields to an existing key. Plan maintenance, monitor `currentOp`, ensure enough disk and oplog space.

### Q83. Transactions: how they work and their limits
Snapshot isolation using WiredTiger snapshots; writes buffered until commit; conflicts produce `WriteConflict` (transient error, retry the whole transaction). Default max runtime 60 s (`transactionLifetimeLimitSeconds`); size limited by the 16 MB oplog entry in older versions (4.2+ splits into multiple oplog entries). Performance costs: holds snapshot history in cache, increases contention, cross-shard transactions use two-phase commit. Best practice: keep transactions short, avoid long reads, design schemas that need few transactions, and use `withTransaction` (handles `TransientTransactionError` and `UnknownTransactionCommitResult` retries).

### Q84. Common transaction errors
`TransientTransactionError` (retry the whole transaction), `UnknownTransactionCommitResult` (retry commit), `WriteConflict` (another transaction modified the doc), `NoSuchTransaction` (session expired), `TransactionTooLarge`, `MaxTimeMSExpired`. DDL (creating collections/indexes) inside transactions has restrictions (allowed for collection creation since 4.4 if the collection does not exist... verify per version).

### Q85. Indexing strategy for production
Create indexes from real query patterns (profiler, slow logs, Performance Advisor), follow ESR, prefer fewer wide compound indexes to many single-field indexes, keep total index size in RAM (working set), use partial indexes for subsets, TTL for expiry, unique indexes for invariants, and drop duplicates (prefix redundancy: `{a:1}` is redundant with `{a:1,b:1}`). Review `$indexStats` regularly.

### Q86. Working set and memory sizing
The **working set** is the data and index pages used frequently. If it fits in RAM (WiredTiger cache + OS cache), performance is good; if not, page faults and disk reads spike latency. Check cache metrics (`wiredTiger.cache` bytes currently in cache, `pages read into cache`, evictions), `db.collection.stats().indexSizes`. Fix by adding RAM, trimming indexes, archiving data, sharding.

### Q87. Aggregation pipeline optimization
The optimizer reorders and combines stages (e.g. `$match` before `$project`, `$sort + $limit` coalescing, `$lookup + $unwind` coalescing). Guidelines: `$match` early, `$project` only needed fields, use indexes for the first `$match`/`$sort`, avoid `$unwind` on huge arrays when `$filter`/`$reduce` suffice, bound `$group` cardinality, use `allowDiskUse` carefully, and inspect with `explain("executionStats")`. 6.0+/slot-based execution engine accelerates many pipelines.

### Q88. `$lookup` performance and alternatives
Index `foreignField`. For many lookups, denormalize with the Extended Reference pattern, precompute with `$merge`, or use application-side batching (`find({ _id: { $in: ids } })`). In sharded clusters, `$lookup` on sharded foreign collections is supported with caveats (5.1+/verify). Consider whether the relationship should be embedded.

### Q89. Handling large arrays
Use the Bucket or Subset pattern; paginate with `$slice`; avoid `$push` forever onto the same document (set a cap with `$push` + `$slice`); move to a child collection when the array exceeds a few hundred to few thousand elements; avoid indexing huge arrays (multikey index growth).

### Q90. Time series collections (5.0) in depth
Stored in a bucketed columnar-like format internally; automatic compression; query using normal operators/aggregation; supports secondary indexes on `metaField` and time (compound index on meta+time is automatic), TTL via `expireAfterSeconds`, `$densify`/`$fill`, window functions. Limits and behaviors improved across versions (updates/deletes more restricted, verify). Choose a good `metaField` (device id) and granularity.

### Q91. Atlas Search and Vector Search *(awareness)*
**Atlas Search** (Lucene): full-text with scoring, fuzzy, autocomplete, facets, highlighting, synonyms via `$search` stage and a search index definition. **Atlas Vector Search**: store embeddings in a field and query with `$vectorSearch` (approximate nearest neighbor, HNSW) with pre-filtering; used for RAG and semantic search. Indexes are defined separately from regular indexes and run on the `mongot` process. Available in Atlas and (preview/community options, verify) self-managed.

### Q92. Schema versioning and migrations
Add `schemaVersion` to documents; make code handle old and new shapes; migrate lazily on read/write or with background batch jobs (cursor + `bulkWrite` in batches, checkpointing progress); keep validators permissive until migration finishes; use tools like `migrate-mongo` or custom scripts; test with production-size data and a rollback plan.

### Q93. Bulk data operations at scale
Batch `insertMany` (`ordered:false`), use `bulkWrite`, disable unnecessary indexes during large loads, load in `_id` order for fewer page splits, tune write concern (`w:1`) for initial loads only, avoid single huge `updateMany` that blocks replication (process in batches of 1–10k with `_id` ranges), monitor oplog window and lag.

### Q94. Query anti-patterns
`$where` and JS evaluation, `$regex` without anchors, `$ne`/`$nin`/`$not` (poor index selectivity), `skip` with big values, sorting without an index, unindexed `$or` branches (each branch needs an index), `$exists:false` scans, very large `$in` lists, and fetching entire documents when projecting would do.

### Q95. Handling duplicates and uniqueness across fields
Unique compound indexes (`{ tenantId:1, email:1 }`), partial unique indexes for soft-deleted data (`partialFilterExpression: { deletedAt: { $exists: false } }`), collation for case-insensitive uniqueness, and idempotency keys with unique indexes for deduplicating events.

### Q96. Soft delete, archiving and retention
Soft delete flag + partial indexes; move cold data to archive collections (`$merge`), **Atlas Online Archive** (S3-backed), TTL indexes for ephemeral data, time series expiry, and legal-hold considerations.

### Q97. Multi-tenancy patterns
Shared collection with `tenantId` as the leading key in compound indexes (and shard key prefix), collection per tenant (limits: too many collections/indexes strain the catalog; good for a modest number of large tenants), database per tenant (strong isolation, more connections/resources). Add row-level safeguards in the app (query helper that always injects `tenantId`) and Atlas/Mongo RBAC where possible.

### Q98. Client-side field-level encryption and Queryable Encryption
**CSFLE** encrypts selected fields in the driver before sending (deterministic for equality queries, random otherwise) using keys from a KMS; the server never sees plaintext. **Queryable Encryption** (7.0 GA) supports equality (and range in 8.0, verify) queries over encrypted data with randomized encryption. Use for PII/PHI/payment data; consider key management and operational complexity.

### Q99. Auditing and compliance
Enterprise/Atlas auditing logs authentication, authorization and DDL/DML events; use RBAC with custom roles, network isolation (VPC peering/PrivateLink), encryption at rest (WiredTiger encryption or cloud KMS), TLS 1.2+, data residency and backup retention aligned with GDPR/PCI/HIPAA, and field-level encryption for the most sensitive data.

### Q100. Performance Advisor, profiler and slow query hunting
Profiler: `db.setProfilingLevel(1, { slowms: 100 })`; query `system.profile` sorted by `millis`, look for `planSummary: COLLSCAN`, high `docsExamined/nreturned` ratio, `hasSortStage`, `keysExamined`. Atlas Performance Advisor suggests indexes; Query Profiler visualizes slow operations. Check `currentOp({ secs_running: { $gt: 5 } })` for long ones and `db.killOp()` when needed.

### Q101. Connection storms and pool tuning
Symptoms: spikes in connections, `connection refused`, increased latency. Causes: creating a client per request/function invocation, large app fleets × `maxPoolSize`, slow queries holding connections. Fixes: reuse clients, cap pool sizes, `maxIdleTimeMS`, use connection-limiting proxies (Atlas has per-tier limits), and optimize query latency.

### Q102. Idempotent consumers and exactly-once patterns
Use unique indexes on event ids, upserts with deterministic `_id`, change stream resume tokens stored transactionally with processed offsets, and the **outbox pattern** (write the event in the same transaction/document as the state change, then a publisher reads and publishes it).

### Q103. Mongoose in depth
Schemas, validation (built-in and custom), middleware (`pre/post` hooks), virtuals, statics/methods, discriminators (inheritance), subdocuments vs refs, `populate` options (`select`, `match`, `options`), transactions with sessions (`mongoose.startSession()`), `lean`, plugins, indexes via `schema.index()`, `timestamps`, `versionKey`, `strictQuery`, and error handling for `ValidationError`, `CastError`, duplicate key (11000). Disable `autoIndex` in production.

### Q104. Prisma, Typeorm and other ODMs
Prisma supports MongoDB (replica set required, relations by ObjectId, limited features such as no `@@unique` composite quirks, verify); TypeORM and MikroORM have MongoDB drivers; Spring Data MongoDB for Java; Motor/Beanie for Python. Choose based on team stack; always inspect generated queries and indexes.

### Q105. Testing with MongoDB
`mongodb-memory-server` for fast tests (spins a real `mongod` in a temp directory), Testcontainers for realistic versions/replica sets (needed for transactions/change streams), fixtures + `deleteMany` between tests, seed scripts, and schema validation tests. Avoid mocking the driver for query correctness.

### Q106. Docker and local replica set
```bash
docker run -d --name mongo -p 27017:27017 mongo:7 --replSet rs0 --bind_ip_all
docker exec mongo mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```
A single-node replica set enables transactions and change streams locally.

### Q107. `mongos`, config servers, and cluster maintenance
Upgrade order: config servers → shards (secondaries first, then step down primaries) → `mongos`. Use `sh.status()`, `db.adminCommand({ balancerStatus: 1 })`, `flushRouterConfig`, and monitor chunk migrations, orphaned documents (`cleanupOrphaned`, automatic in 4.4+).

### Q108. Capacity planning for MongoDB
Estimate document size and count, index sizes, growth per month, QPS, read/write ratios, working set vs RAM, oplog window, storage compression ratio (typically 2–5x), IOPS needs. Load test with production-like data. Plan scaling tiers (vertical on Atlas M-tiers, storage auto-scale, sharding when beyond single replica set or ~2–5 TB per shard guidance, verify).

### Q109. Atlas basics
Managed service on AWS/Azure/GCP: clusters (shared M0/M2/M5 free/low tiers, dedicated M10+), auto-scaling, backups with point-in-time restore, global clusters, VPC peering/PrivateLink, IP access list, database users, Performance Advisor, Charts, Data API/App Services (some products have been retired or changed; verify), Search/Vector Search, serverless instances (evolving; verify), Online Archive.

### Q110. MongoDB vs relational: decision matrix
| Need | Prefer |
|---|---|
| Evolving schema, nested documents | MongoDB |
| Complex multi-table joins and reporting | Relational |
| Strong cross-entity ACID everywhere | Relational (Mongo OK for contained transactions) |
| Horizontal write scale with sharding | MongoDB (or distributed SQL) |
| Ad-hoc analytics on normalized data | Relational / warehouse |
| Geo, time series, search/vector in one platform | MongoDB Atlas |

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. Designing a schema from access patterns (method) *(Must-know)*
1. List entities and relationships with cardinalities (1:1, 1:few, 1:many, 1:squillions, many:many).
2. List queries/updates with frequency and latency targets.
3. Decide embed vs reference per relationship using read together / write independently / growth bounds.
4. Apply patterns (subset, bucket, computed, extended reference).
5. Design indexes (ESR) and shard key early.
6. Validate with realistic data volumes, `explain`, and load tests; iterate.
Document the model (diagrams, rationale) and plan schema versioning.

### Q112. Case study: e-commerce data model
`products` (embed variants and a subset of reviews; reference full reviews in `reviews` collection), `orders` (embed line items with snapshot of price/name; reference `customerId`; store computed `total`), `customers` (embed addresses array bounded), `inventory` (separate collection for high-churn stock counts with atomic `$inc` and conditional updates `{ stock: { $gte: qty } }`). Use transactions only for cross-collection invariants (order + inventory) or implement reservation workflows (sagas).

### Q113. Atomic inventory decrement without transactions
```js
const r = await inventory.updateOne({ sku, stock: { $gte: qty } }, { $inc: { stock: -qty } });
if (r.modifiedCount !== 1) throw new Error("Out of stock");
```
Single-document atomic conditional update prevents overselling.

### Q114. Case study: social feed
Fan-out on write (push post ids into followers' feed documents/collection, bucketed) vs fan-out on read (query posts by followed users). Hybrid for celebrities. Bucket feed per user per day; cap list length; use `Subset` for recent items; index `{ userId: 1, createdAt: -1 }`; shard by `userId` hashed.

### Q115. Case study: chat messages
Collection `messages` with `{ roomId, ts, sender, text }`; compound index `{ roomId: 1, ts: -1 }`; shard key `{ roomId: 1, ts: 1 }` or hashed `roomId` with care for hot rooms; bucket messages per room per hour for read efficiency; TTL for ephemeral rooms; change streams for real-time delivery.

### Q116. Case study: IoT/time series
Time series collection `{ ts, deviceId (meta), temp }`, TTL of 90 days, rollups via `$merge` to hourly/daily collections, index on `{ deviceId: 1, ts: 1 }` automatically via meta/time; ingest with `insertMany` unordered batches; downsample older data; alerting via change streams or Atlas triggers.

### Q117. Case study: multi-tenant SaaS
`tenantId` first in all compound indexes; shard key `{ tenantId: 1, _id: 1 }` (or hashed tenant plus zone sharding for big tenants); per-tenant quotas and rate limits; application-level tenant guard; backup/restore per tenant by filtered export; separate clusters for noisy or regulated tenants.

### Q118. WiredTiger cache behavior and eviction
When cache usage exceeds ~80% eviction threads work; at ~95% application threads help evict, causing latency spikes. Dirty data > 20% triggers aggressive eviction. Monitor `bytes currently in the cache`, `tracked dirty bytes`, `pages evicted by application threads`. Reduce by indexing properly, limiting large sorts/aggregations, increasing RAM, and tuning `storage.wiredTiger.engineConfig.cacheSizeGB` only when co-locating with other services.

### Q119. Checkpoints, I/O and disk configuration
Use SSD/NVMe, XFS filesystem with `noatime`, separate disks for data and journal if possible, read-ahead 8–32 KB (not large), disable transparent huge pages (THP), set `ulimit -n` high (64000), `vm.swappiness=1`, NTP time sync, and avoid NFS. These come from the MongoDB production notes.

### Q120. Memory and OOM issues
Large in-memory sorts and `$group` over huge sets, too many open cursors, big `$in` lists, and many connections (each ~1 MB) contribute. Use indexes for sorts, `allowDiskUse`, limit result sizes, add RAM, and monitor `resident memory` vs available. The Linux OOM killer may kill `mongod`; reserve memory headroom and set cgroup limits carefully (WiredTiger cache aware of container limits).

### Q121. Troubleshooting replication lag
Check `rs.printSecondaryReplicationInfo()`, `rs.status()` (optimeDate diffs), secondary disk I/O and CPU, network, large batches/index builds (secondaries build indexes too), slow single-threaded apply on specific collections (hot documents), oplog window, long-running operations on secondaries (reads blocking replication batch application, `flow control`). Mitigate: flow control, scale secondary hardware, spread writes, reduce index count, schedule maintenance.

### Q122. Flow control (4.2+)
Throttles primary writes when a majority commit point lag exceeds a threshold (`flowControlTargetLagSeconds`, default 10 s) to keep secondaries from falling too far behind. Visible as write latency spikes. Address the underlying lag instead of disabling flow control.

### Q123. Majority commit point and "majority read concern" mechanics
The majority commit point is the latest oplog entry replicated to a majority; `readConcern: majority` reads from a snapshot at or before that point. Using `majority` reads increases memory pressure slightly (snapshot history). `writeConcernMajorityJournalDefault` ensures durable majority writes.

### Q124. Failover behavior of applications
Drivers detect topology changes via SDAM (server discovery and monitoring), re-route writes to the new primary, and retry eligible operations once. Applications must handle `NotWritablePrimary`, `PrimarySteppedDown`, and network errors with retries/backoff; use `retryWrites=true`, appropriate timeouts, idempotent operations, and `w: majority`. Test failover (`rs.stepDown()`) in staging regularly.

### Q125. Upgrades and compatibility
Rolling upgrade one major version at a time (e.g. 6.0 → 7.0 → 8.0), set `featureCompatibilityVersion` (FCV) only after validating (downgrade needs FCV rollback). Test drivers, deprecated commands, and removed features (e.g. legacy `mongo` shell replaced by `mongosh`; `mapReduce` deprecated since 5.0; `$where` discouraged). Use Atlas auto-upgrade windows or Ops Manager.

### Q126. Security architecture
Private networking (VPC peering/PrivateLink), TLS with certificate rotation, x.509 or SCRAM users, per-service users with custom roles, IP access lists, encryption at rest (KMIP/cloud KMS), CSFLE/QE for sensitive fields, secrets in a vault, auditing, least privilege for operational users (e.g. `clusterMonitor`), regular user/role audits, and no public exposure.

### Q127. Handling 16 MB limit and large documents
Split large documents (bucket, child collections), store big blobs externally, avoid ever-growing arrays, project fields, compress large text if needed, and monitor document size distribution (`$bsonSize` in aggregation). Failures show as `BSONObj size ... is invalid`.

### Q128. Handling hot documents and counters
Many updates to one document serialize (document-level lock) and cause write conflicts in transactions. Solutions: shard counters (N sub-docs summed on read), batching increments, using buffering in Redis, approximate counters, or event-sourcing with periodic aggregation.

### Q129. Sorting and index intersections
MongoDB can use index intersection but rarely does effectively; a purpose-built compound index is better. A `SORT` stage in the plan with limit uses top-k sort; without a limit large sorts exceed 100 MB unless `allowDiskUse`. Design compound indexes to deliver sort order after equality fields.

### Q130. Operational runbooks you should know
Replica set add/remove member, resync a secondary (initial sync), change oplog size, step down primary, index rebuild on production, add shard and balance, move primary shard, drain a shard (`removeShard`), restore from backup with point-in-time, rotate keys/certs, recover from a lost majority (reconfig with `force: true`: last resort), and handle full disk (free space, scale storage, drop old data).

### Q131. Disk full scenarios
Mongod may crash or become read-only. Remedy: add disk, remove data (TTL/delete + compact, noting deletion alone may not shrink files), `compact` command (rewrites; may block), resync a secondary to reclaim space, move to larger volume. Plan alerts at 70–80%. WiredTiger reuses freed space internally but returns space to the OS only via compaction/resync.

### Q132. Capped collection oplog and change stream retention
Change streams depend on the oplog window; if a consumer lags beyond the window, resume fails (`ChangeStreamHistoryLost`). Persist resume tokens, size oplog generously (24–72 h window), and have a re-sync strategy (full reload).

### Q133. Data modeling with references and consistency
When using references, there are no FK constraints: handle orphan cleanup (jobs), maintain denormalized copies (extended reference) via change streams or application logic, and use transactions or sagas for multi-collection invariants. Document ownership of data and update paths.

### Q134. Migrating from relational to MongoDB
Don't copy tables one-to-one. Redesign around access patterns (embed joined data), choose `_id` strategy, convert types (dates, decimals), plan ETL (Debezium, MongoDB Relational Migrator, custom scripts), run in parallel with dual reads/writes or CDC, verify counts/aggregates, then cut over. Retire joins by denormalizing and keep an analytical store for BI.

### Q135. Migrating from MongoDB to relational (or elsewhere)
Reasons: heavy joins, strict relational integrity, BI. Steps: infer schema (document variety analysis), define relational schema, flatten arrays into child tables, convert ObjectIds, migrate in batches, handle polymorphic docs, validate with checksums, and update application data access. Evaluate hybrid (Mongo for operational docs + warehouse for analytics).

### Q136. Using MongoDB with Kafka/streaming
Debezium MongoDB connector or the official MongoDB Kafka Connector (source reads change streams, sink writes). Use for CDC to search, caches, analytics. Handle schema evolution, resume tokens, ordering per key, and idempotent sinks.

### Q137. Caching strategies with Redis
Cache-aside for hot reads, TTL aligned to staleness tolerance, invalidation via change streams, and avoid caching unbounded query results. Don't treat Redis as the source of truth for money or inventory.

### Q138. Observability stack
Metrics (Prometheus + `mongodb_exporter`, Atlas metrics API, Datadog/New Relic), logs (structured JSON logs; `slowms` thresholds), tracing (driver command monitoring events), alerts (replication lag, connections, cache pressure, queue length, disk, elections). Dashboard per workload with p95/p99 latency and ops/sec.

### Q139. Testing failure modes
Chaos tests: kill primary, network partition, disk full, slow disk, oplog truncation, large index build under load. Verify app behavior (retries, timeouts, idempotency) and recovery time. Document results.

### Q140. Common production incidents
1. Missing index after a release → COLLSCAN, CPU spike.
2. Unbounded array growth → slow updates, 16 MB failures.
3. Hot shard from monotonically increasing shard key.
4. Connection storm from serverless functions.
5. Replication lag from heavy index builds or analytic queries on secondaries.
6. Elections due to network flaps or overloaded primary.
7. Disk full from oplog/journal/data growth.
8. NoSQL injection leading to auth bypass.
9. Exposed 27017 without auth → ransomware.
Each has standard fixes in this guide.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. When would you choose MongoDB for a new system?
When data is document-shaped, read together, evolves frequently, and requires horizontal scale; when you need flexible schemas for varied entities (catalogs, CMS, user profiles, event logs), or combined operational + search + vector + time series in Atlas. Avoid when core is complex relational reporting with many-to-many joins and cross-entity constraints; consider PostgreSQL (with JSONB) first for mixed needs.

### Q142. Architecture for a high-scale MongoDB platform
Atlas (or self-managed) multi-AZ replica sets (3–5 nodes), sharding for scale with a carefully chosen shard key, read replicas/analytics nodes, Atlas Search, private networking, backups with PITR, cross-region replicas or global clusters for DR/data locality, observability, infrastructure as code (Terraform Atlas provider), schema/index change pipelines, and runbooks.

### Q143. Multi-region strategies
Single primary region with secondaries elsewhere (read locality, DR), Global Clusters with zone sharding (write locality by region key), cross-region election priority tuned to preferred primary region, latency-aware read preference, data residency via zones. Understand trade-offs: cross-region `majority` writes add latency; consider `w:1` for non-critical data only with eyes open.

### Q144. DR planning
RPO/RTO per tier; continuous cloud backup with PITR; cross-region snapshots; restore drills (measured time-to-restore); runbooks for region loss (promote secondary region, repoint apps); validate application idempotency after failover; test oplog window sufficiency.

### Q145. Governance for many MongoDB clusters
Standard cluster templates, naming and tagging, index review process, schema validation requirements, user/role model, security baselines, backup policies, cost reports, upgrade cadence, architectural decision records, and service owners. Automate with IaC and CI checks (index linting, query plans for critical queries).

### Q146. Cost optimization
Right-size tiers, enable compression (zstd), reduce index bloat, archive cold data (Online Archive/object storage), avoid over-provisioned IOPS, use auto-scaling with limits, reduce cross-region data transfer, consolidate small clusters thoughtfully, and prune unused collections. Measure cost per feature/tenant.

### Q147. Team standards for MongoDB usage
Query/index review in PRs, naming conventions, required `tenantId` filters, projection and pagination rules, ban unbounded arrays, ban `$where`, retry/timeouts defaults in a shared data-access library, standard error handling for E11000/transient errors, migrations framework, test strategy with real `mongod`.

### Q148. Evaluating Atlas vs self-managed
Atlas: faster operations (backups, scaling, upgrades, monitoring), integrated Search/Vector/Charts, security defaults; cost premium and vendor dependence. Self-managed (Ops Manager, Percona, Kubernetes operators): control, potentially lower cost at scale, higher operational burden. Evaluate compliance, team skills, and workloads.

### Q149. Technology radar: MongoDB-related trends to watch
Queryable Encryption range queries, vector search maturity, time series improvements, Atlas stream processing, columnstore indexes for analytics (preview/verify), improved sharding/resharding automation, SQL interface (BI Connector, Atlas SQL), and ecosystem tools. Evaluate using prototypes and benchmarks.

### Q150. Mentoring MongoDB engineers
Teach to design from queries, read `explain`, understand write/read concerns, avoid anti-patterns, practice incidents (kill primary, missing index, hot shard), and review real schemas with seniors. Offer a "schema design review checklist" and a catalog of patterns.

### Q151. Incident story template (MongoDB)
Symptom: p99 spike and CPU 100% on primary after release. Detection: Atlas alerts, profiler. Diagnosis: new query used `$or` with an unindexed branch causing COLLSCAN. Mitigation: create the index (background build in 4.2+), roll back release flag. Prevention: query plan checks in CI, index review, load tests, `slowms` alerts.

### Q152. Compliance and privacy design
Data classification, field-level encryption for PII, retention TTLs, deletion workflows (right to erasure across backups per policy), auditing, region pinning with zones, access reviews, secrets rotation. Document processing in privacy impact assessments.

### Q153. Interview perspective: what strong answers look like
They explain embed vs reference with growth bounds and access patterns, ESR and covered queries, write/read concerns and elections, shard key selection and hotspots, transactions' costs, and real incidents. Weak signals: "MongoDB is schemaless so no design needed", ignoring indexes, or using transactions everywhere.

### Q154. When to say no to MongoDB
If data is highly relational with strict integrity needs and complex reporting; if the team lacks capacity to manage schema discipline; if requirements demand SQL tooling everywhere; or when a simpler PostgreSQL/JSONB solution suffices. Be pragmatic.

### Q155. Interview approach for MongoDB design questions
Clarify entities, queries, growth, consistency and latency. Propose collections and documents, indexes (ESR), sharding/shard key if needed, replication settings (write/read concerns), transaction usage only where necessary, and operational plans (monitoring, backups, migrations). State trade-offs explicitly.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Local 3-node replica set with Docker Compose
```yaml
# docker-compose.yml
services:
  mongo1: { image: mongo:7, command: ["--replSet","rs0","--bind_ip_all"], ports: ["27017:27017"], volumes: ["m1:/data/db"] }
  mongo2: { image: mongo:7, command: ["--replSet","rs0","--bind_ip_all"], ports: ["27018:27017"], volumes: ["m2:/data/db"] }
  mongo3: { image: mongo:7, command: ["--replSet","rs0","--bind_ip_all"], ports: ["27019:27017"], volumes: ["m3:/data/db"] }
volumes: { m1: {}, m2: {}, m3: {} }
```
```bash
docker compose up -d
docker exec mongo-mongo1-1 mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"mongo1:27017"},{_id:1,host:"mongo2:27017"},{_id:2,host:"mongo3:27017"}]})'
docker exec mongo-mongo1-1 mongosh --eval 'rs.status().members.map(m => [m.name, m.stateStr])'
```
Test failover with `rs.stepDown()` while your app runs.

### H2. Create users and roles with least privilege
```js
use admin
db.createUser({ user: "root", pwd: passwordPrompt(), roles: ["root"] })
use shop
db.createUser({ user: "app", pwd: passwordPrompt(), roles: [{ role: "readWrite", db: "shop" }] })
db.createUser({ user: "report", pwd: passwordPrompt(), roles: [{ role: "read", db: "shop" }] })
db.createRole({ role: "orderWriter", privileges: [{ resource: { db: "shop", collection: "orders" }, actions: ["find","insert","update"] }], roles: [] })
```
Start `mongod` with `--auth` (or `security.authorization: enabled`) and connect using credentials and TLS.

### H3. Collection with validation and indexes
```js
db.createCollection("orders", { validator: { $jsonSchema: {
  bsonType: "object", required: ["customerId","items","status","total","createdAt"],
  properties: {
    customerId: { bsonType: "objectId" },
    status: { enum: ["new","paid","shipped","cancelled"] },
    items: { bsonType: "array", minItems: 1, items: { bsonType: "object", required: ["sku","qty","price"],
      properties: { sku: { bsonType: "string" }, qty: { bsonType: "int", minimum: 1 }, price: { bsonType: "decimal" } } } },
    total: { bsonType: "decimal" },
    createdAt: { bsonType: "date" }
  } } } })
db.orders.createIndex({ customerId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1, createdAt: -1 }, { partialFilterExpression: { status: { $in: ["new","paid"] } } })
```

### H4. Fix a slow query with `explain` (worked example)
```js
db.orders.find({ status: "paid", createdAt: { $gte: ISODate("2025-10-01") } }).sort({ total: -1 }).limit(20).explain("executionStats")
// COLLSCAN: totalDocsExamined 2,000,000, nReturned 20, SORT stage in memory
db.orders.createIndex({ status: 1, total: -1, createdAt: 1 })     // ESR: equality, sort, range
// IXSCAN, totalKeysExamined small, no SORT stage
```
Verify with `explain` again and check the `winningPlan` and `executionTimeMillis`.

### H5. Revenue report aggregation with `$lookup` and `$facet`
```js
db.orders.aggregate([
  { $match: { status: "paid", createdAt: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } } },
  { $facet: {
      monthly: [
        { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "month" } }, revenue: { $sum: { $toDouble: "$total" } }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } } ],
      topCustomers: [
        { $group: { _id: "$customerId", spent: { $sum: { $toDouble: "$total" } } } },
        { $sort: { spent: -1 } }, { $limit: 5 },
        { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "c" } },
        { $unwind: "$c" }, { $project: { _id: 0, name: "$c.name", spent: 1 } } ]
  } }
])
```
Convert `Decimal128` carefully for display; for exact sums keep it as decimal (`$sum` supports Decimal128).

### H6. Atomic job queue with `findOneAndUpdate`
```js
const job = await jobs.findOneAndUpdate(
  { status: "pending", runAt: { $lte: new Date() } },
  { $set: { status: "running", lockedAt: new Date(), workerId } , $inc: { attempts: 1 } },
  { sort: { runAt: 1 }, returnDocument: "after" });
// completion: updateOne({ _id: job._id, workerId }, { $set: { status: "done" } })
// reaper: updateMany({ status: "running", lockedAt: { $lt: new Date(Date.now() - 10*60*1000) } }, { $set: { status: "pending" } })
await jobs.createIndex({ status: 1, runAt: 1 });
```

### H7. Multi-document transaction with retry (Node.js)
```js
async function transfer(client, fromId, toId, amount) {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const accounts = client.db("bank").collection("accounts");
      const from = await accounts.findOneAndUpdate({ _id: fromId, balance: { $gte: amount } }, { $inc: { balance: -amount } }, { session });
      if (!from) throw new Error("Insufficient funds");
      await accounts.updateOne({ _id: toId }, { $inc: { balance: amount } }, { session });
      await client.db("bank").collection("ledger").insertOne({ fromId, toId, amount, at: new Date() }, { session });
    }, { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } });
  } finally { await session.endSession(); }
}
```
`withTransaction` retries on `TransientTransactionError`. Throwing inside aborts the transaction.

### H8. Change stream consumer with resume token
```js
let resumeAfter = await loadToken();                 // from a durable store (e.g. a 'checkpoints' collection)
const stream = orders.watch([{ $match: { operationType: { $in: ["insert","update"] } } }], { resumeAfter, fullDocument: "updateLookup" });
for await (const ev of stream) {
  await handle(ev);                                  // must be idempotent
  await saveToken(ev._id);                           // persist after successful handling
}
```
On `ChangeStreamHistoryLost`, perform a full re-sync and start a new stream.

### H9. Mongoose model with indexes, validation and hooks
```js
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
  items: { type: [{ sku: String, qty: { type: Number, min: 1 }, price: mongoose.Schema.Types.Decimal128 }], validate: v => v.length > 0 },
  status: { type: String, enum: ["new","paid","shipped","cancelled"], default: "new" },
}, { timestamps: true, optimisticConcurrency: true });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.pre("save", function (next) { this.total = this.items.reduce((s, i) => s + Number(i.price) * i.qty, 0); next(); });
export const Order = mongoose.model("Order", orderSchema);
// production: mongoose.set("autoIndex", false) and manage indexes via migrations
```

### H10. Sharding commands (self-managed cluster)
```js
sh.enableSharding("shop")
db.orders.createIndex({ customerId: "hashed" })
sh.shardCollection("shop.orders", { customerId: "hashed" })
sh.status()
db.orders.getShardDistribution()
sh.addShardToZone("shard-eu", "EU")
sh.updateZoneKeyRange("shop.users", { region: "EU", _id: MinKey }, { region: "EU", _id: MaxKey }, "EU")
```
Run `db.adminCommand({ analyzeShardKey: "shop.orders", key: { customerId: 1 } })` (7.0) before choosing.

### H11. Backup and restore with PITR thinking
```bash
mongodump --uri "$MONGO_URI" --gzip --archive=/backups/shop-$(date +%F).gz --oplog   # --oplog: consistent point-in-time dump (replica set)
mongorestore --uri "$TARGET_URI" --gzip --archive=/backups/shop-2025-10-24.gz --oplogReplay
```
For larger systems use Atlas Cloud Backup, Percona Backup for MongoDB, or storage snapshots with journaling; run scheduled restore tests and compare counts and checksums.

### H12. Profiling slow operations
```js
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 }).limit(5).pretty()
db.system.profile.aggregate([{ $group: { _id: "$ns", n: { $sum: 1 }, avg: { $avg: "$millis" } } }, { $sort: { avg: -1 } }])
db.currentOp({ active: true, secs_running: { $gt: 5 } })
db.killOp(opid)
```
Profiling level 2 (all ops) is heavy: use only briefly.

### H13. Bucket pattern for time series without the native type
```js
db.readings.updateOne(
  { sensorId: "s1", hour: ISODate("2025-10-24T10:00:00Z"), count: { $lt: 200 } },
  { $push: { samples: { t: new Date(), v: 23.4 } }, $inc: { count: 1 }, $min: { minV: 23.4 }, $max: { maxV: 23.4 } },
  { upsert: true })
```
Fewer, larger documents reduce index size and read overhead; cap each bucket's size.

### H14. Cursor-based pagination API (Express + Node driver)
```js
app.get("/posts", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const filter = req.query.after ? { _id: { $lt: new ObjectId(String(req.query.after)) } } : {};
  const posts = await col.find(filter, { projection: { body: 0 } }).sort({ _id: -1 }).limit(limit + 1).toArray();
  const hasMore = posts.length > limit;
  res.json({ data: posts.slice(0, limit), next: hasMore ? posts[limit - 1]._id : null });
});
```

### H15. Safe schema migration script (batches)
```js
const cursor = users.find({ schemaVersion: { $ne: 2 } }).batchSize(1000);
let ops = [];
for await (const u of cursor) {
  ops.push({ updateOne: { filter: { _id: u._id }, update: { $set: { fullName: `${u.first} ${u.last}`, schemaVersion: 2 }, $unset: { first: "", last: "" } } } });
  if (ops.length === 1000) { await users.bulkWrite(ops, { ordered: false }); ops = []; }
}
if (ops.length) await users.bulkWrite(ops, { ordered: false });
```
Make it idempotent (`schemaVersion` filter), run off-peak, monitor lag, and keep code compatible with both versions during rollout.

---

# 🐞 Part 7: Debugging Scenarios

### D1. Query is suddenly slow after a release
Check `explain("executionStats")`: `COLLSCAN` and `docsExamined >> nReturned` means a missing or unused index. Compare the query shape with existing indexes (ESR). Create the proper index (Atlas Performance Advisor can suggest), roll out safely, and add query plan checks to CI.

### D2. `E11000 duplicate key error`
A unique index was violated. Identify the index (`index: email_1 dup key: { email: "x" }`). Causes: retries without idempotency, race conditions in "check then insert", or multiple documents missing a unique field (null collisions). Fix with upserts/idempotency keys or partial unique indexes.

### D3. `MongoServerSelectionError: connection timed out`
Network/firewall/IP allow list, wrong URI (SRV/DNS), replica set without a primary, TLS misconfiguration, DNS failure in the container, Atlas IP access list missing the client's IP. Check `mongosh` from the same host and `serverSelectionTimeoutMS`.

### D4. `NotWritablePrimary` / `not master` errors during failover
Expected briefly during elections. Use `retryWrites=true`, handle retry/backoff, idempotent writes, `w: majority`. If frequent, investigate primary instability (CPU/disk saturation, network flaps).

### D5. Replication lag grows
Heavy writes, secondaries on weaker hardware, index builds, long queries on secondaries, network latency. Check `rs.printSecondaryReplicationInfo()`, `db.serverStatus().wiredTiger`, I/O wait; scale the secondary, reduce indexes, schedule index builds, enable/adjust flow control.

### D6. `WriteConflict` in transactions
Two transactions updated the same document. Retry the whole transaction (use `withTransaction`), shorten transactions, reduce contention (shard counters), reorder operations.

### D7. Documents appear missing after upsert
Filter used a different type (string `"123"` vs number `123`, or string `_id` vs `ObjectId`). MongoDB is type-sensitive: `ObjectId("...") !== "..."`. Normalize types in the application/ODM and validate with schema.

### D8. Sort fails: `Sort exceeded memory limit of 104857600 bytes`
No supporting index for the sort. Add an index matching filter + sort (ESR), add `limit`, or use `allowDiskUse: true` as a stopgap.

### D9. Aggregation returns `$group exceeded memory limit`
Use `allowDiskUse`, reduce cardinality by filtering earlier, project fewer fields, pre-aggregate with `$merge`, or redesign the report.

### D10. Mongoose: `Cast to ObjectId failed`
An invalid id string was passed. Validate with `mongoose.isValidObjectId()` or `ObjectId.isValid`. Return 400 instead of 500.

### D11. Change stream stops after restarts
Resume token not persisted or oplog window too small. Persist tokens after processing; increase oplog size; handle `ChangeStreamHistoryLost` with a full reload.

### D12. Too many connections
Client created per request, serverless fan-out, or large app fleet. Reuse one client, tune `maxPoolSize`, set `maxIdleTimeMS`, and add `connectTimeoutMS`. Check `db.serverStatus().connections`.

### D13. Disk usage does not shrink after deleting data
WiredTiger reuses freed space but doesn't return it to the OS. Run `compact` (blocks the collection in older versions), resync a secondary, or restore into a new volume; use TTL/time series/partitioning strategies to avoid mass deletes.

### D14. Hot shard / unbalanced cluster
Monotonically increasing shard key (ObjectId/timestamp) funnels all inserts to one shard. Choose hashed or compound key with a high-cardinality prefix; reshard (5.0+) or refine; check `getShardDistribution()` and balancer status.

### D15. Authentication failed after enabling auth
User defined in a different `authSource` database. Use `mongodb://user:pass@host/db?authSource=admin`. Check SCRAM mechanism, password special characters (URL-encode), and role grants.

---

# 🧩 Part 8: Tricky Questions

### T1. Is MongoDB "schemaless"?
Schema-flexible, not schemaless. The schema lives in your application and optionally in `$jsonSchema` validation. Every query pattern still depends on consistent field names and types.

### T2. Does `{ field: null }` match missing fields?
Yes. `{ a: null }` matches documents where `a` is null or does not exist. Use `{ a: { $type: "null" } }` for only explicit null, `{ a: { $exists: false } }` for missing.

### T3. Does `$ne` match documents that lack the field?
Yes. `{ a: { $ne: 5 } }` returns documents where `a` is not 5, including those without `a`. Combine with `$exists: true` if needed. Also `$ne` and `$nin` are poor for index use.

### T4. Are query results ordered by insertion?
Not guaranteed without `sort`. Natural order often resembles insertion order but changes with updates, moves and storage engine behavior (except in capped collections). Always sort explicitly.

### T5. Can I use `ObjectId` as a creation timestamp?
It contains seconds precision creation time, but depending on it for business logic is fragile (clock skew, imports with custom ids). Store an explicit `createdAt`.

### T6. Is `updateMany` atomic?
No. Each document update is atomic, but the multi-document operation is not atomic as a whole (unless in a transaction). A failure may leave some documents updated.

### T7. Are transactions required for atomic updates of nested data?
No. Single-document updates (including embedded arrays and subdocuments) are atomic. Transactions are for multiple documents/collections.

### T8. What is the difference between `$set` on a field vs replacing the document?
`$set` modifies only given fields; `replaceOne` replaces the full document (except `_id`), dropping fields not included. Using update without operators in some drivers/ODMs can unintentionally replace.

### T9. Why does `find({ tags: ["a","b"] })` behave differently from `$all`?
An exact array match requires the same elements in the same order. `$all: ["a","b"]` matches arrays containing both elements in any order and with other elements. `{ tags: "a" }` matches arrays containing `a`.

### T10. What is type bracketing in comparisons?
Range comparisons only match values of the same BSON type "bracket": `{ a: { $gt: 5 } }` doesn't match string `"10"`. Sorting across types follows a defined BSON type order (null < numbers < strings < objects < arrays < binary < ObjectId < boolean < date < timestamp < regex).

### T11. Why can a unique index allow only one missing field?
Documents missing the indexed field are indexed as `null`, so two such documents conflict. Use a partial unique index with `{ field: { $exists: true } }` or a sparse unique index.

### T12. Is `w: 1` safe?
It acknowledges after the primary applies the write; if the primary fails before replication, the write may be rolled back. Use `w: majority` for important data.

### T13. Does reading from a secondary guarantee latest data?
No. It can be stale by replication lag. Use causal consistency or read from the primary for read-your-writes-critical paths.

### T14. Why shouldn't the shard key be `_id` (ObjectId) in ranged mode?
ObjectIds increase monotonically, so all inserts target the max chunk on one shard (hot spot). Use hashed `_id` or a compound key that spreads writes.

### T15. Does deleting a document free memory/disk immediately?
No. Space is reused internally by WiredTiger; file size shrinks only after compaction or resync. Indexes also keep space.

### T16. `$lookup` vs population (Mongoose)
`$lookup` is a server-side join in an aggregation; `populate` issues additional queries from the application and stitches results. Populate is simpler but can multiply round trips.

### T17. Does MongoDB support joins and transactions? Then why NoSQL?
Yes to both, with limitations. "NoSQL" refers to the document model and flexible scaling, not the absence of those features. Design still prefers embedding to minimize joins and transactions.

### T18. Is `count()` the same as `countDocuments()`?
No. `count()` is deprecated and could be inaccurate in sharded clusters; `countDocuments` runs a filtered aggregation (accurate, slower); `estimatedDocumentCount` reads metadata (fast, no filter).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Data format?** BSON (documents in collections).
- **Primary key?** `_id` (ObjectId by default).
- **Max document size?** 16 MB.
- **Default port?** 27017.
- **Default storage engine?** WiredTiger.
- **Join equivalent?** `$lookup`.
- **Group equivalent?** `$group`.
- **Insert one / many?** `insertOne` / `insertMany`.
- **Update operators?** `$set`, `$inc`, `$push`, `$pull`, `$unset`, `$addToSet`.
- **Array exact element match?** `$elemMatch`.
- **Index order rule?** ESR: Equality, Sort, Range.
- **See query plan?** `explain("executionStats")`.
- **Avoid large skips?** Use range/keyset pagination.
- **Replica set minimum?** 3 voting members.
- **Write durability option?** `w: "majority"`, `j: true`.
- **Stale reads?** Secondary read preference.
- **Real-time events?** Change streams.
- **Auto-expire docs?** TTL index.
- **Time series?** Time series collections (5.0).
- **Sharding key quality?** High cardinality, even, query-aligned.
- **Router / metadata?** `mongos` / config servers.
- **Atomicity scope?** Single document (transactions for multi).
- **Money type?** `Decimal128`.
- **Case-insensitive unique?** Collation strength 2 index.
- **Text/semantic search?** Atlas Search / Vector Search.
- **Backup tools?** mongodump, snapshots, Atlas backup, PBM.
- **NoSQL injection prevention?** Validate types, sanitize, avoid `$where`.
- **ODM for Node?** Mongoose.
- **Hot shard cause?** Monotonic shard key.
- **Oplog?** Capped collection of operations for replication.
- **Connection reuse?** One MongoClient per process.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a MongoDB project you built.
STAR: "I built the data layer for an e-commerce catalog and orders service on MongoDB. Products embedded variants and a subset of recent reviews; orders embedded line items with price snapshots; inventory used atomic conditional updates. I designed ESR indexes from the top 10 queries, used change streams to sync Elasticsearch, and added schema validation. p95 read latency stayed under 40 ms at 2k requests/second."

### P2. Describe a performance issue and your fix.
"A listing endpoint took 4 s. `explain` showed COLLSCAN with an in-memory sort. I created a compound index `(status, createdAt)` following ESR, switched `skip/limit` to keyset pagination, and projected only needed fields. Latency dropped to 30 ms. I added the query to our CI plan checks."

### P3. How do you choose embedding vs referencing?
By access pattern and growth: embed when data is read together and bounded; reference for unbounded or independently updated data; use the Extended Reference pattern for a few frequently needed fields. I validate with realistic data sizes and measure.

### P4. Describe an incident you handled.
Example: connection storm after moving to serverless. Each invocation created a new client. We cached the client at module scope, capped pool size, added `maxIdleTimeMS`, and set alerts on connection counts. Connection count fell from 6k to 300.

### P5. How do you handle schema changes safely?
Add `schemaVersion`, deploy code that reads both shapes, migrate in batches with idempotent bulk updates off-peak, monitor replication lag, then remove old-shape support and tighten validation.

### P6. How do you ensure data consistency across collections?
Prefer embedding; use transactions for true multi-document invariants; otherwise sagas/outbox with idempotent operations, unique indexes for deduplication, and reconciliation jobs. Document the consistency model.

### P7. How do you secure a MongoDB deployment?
Auth + RBAC least privilege, TLS, private networking/IP allow lists, encryption at rest, field-level encryption for sensitive data, input validation to prevent NoSQL injection, auditing, regular patching, and tested backups.

### P8. Why MongoDB over PostgreSQL for this project?
Document-shaped data with variable attributes, high write volume with sharding potential, and team familiarity with the JSON model. We evaluated PostgreSQL JSONB too; we accepted trade-offs around joins and reporting by exporting analytics to a warehouse.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** documents, BSON, collections, `_id`/ObjectId, data types, CRUD, operators, projection, sorting, cursors.
- **Querying:** comparison/logical/element/array operators, regex, geospatial, text, `$expr`, collations, pagination.
- **Aggregation:** pipeline stages, expressions, `$lookup`, `$unwind`, `$facet`, `$bucket`, `$setWindowFields`, `$merge`/`$out`, `$graphLookup`, optimization, `allowDiskUse`.
- **Indexing:** single/compound/multikey/text/hashed/geo/wildcard/partial/sparse/TTL/unique/hidden/clustered, ESR, covered queries, `explain`, index builds, `$indexStats`.
- **Data modeling:** embed vs reference, patterns (subset, bucket, computed, extended reference, outlier, attribute, polymorphic, versioning), anti-patterns, tree structures, validation.
- **Transactions and consistency:** single-document atomicity, multi-document transactions, read/write concern, causal consistency, retryable writes, idempotency, optimistic concurrency.
- **Replication and HA:** replica sets, oplog, elections, member types, rollback, flow control, failover handling.
- **Sharding:** shard keys, chunks, balancer, zones, resharding, targeted vs scatter-gather, hot shards, jumbo chunks.
- **Operations:** WiredTiger, journaling, checkpoints, monitoring, profiler, backups/restore, upgrades/FCV, security/auditing, encryption (CSFLE/QE), capacity planning, Atlas features.
- **Ecosystem:** Mongoose, Prisma, drivers, Compass, mongosh, change streams, Kafka connector, Atlas Search/Vector Search, Charts, Relational Migrator.

## Mixed topics
- MongoDB + Node/Express/React (MERN): connection reuse, Mongoose models, validation, pagination, auth (JWT) with hashed passwords, input sanitization.
- MongoDB + Redis: cache-aside, invalidation via change streams, rate limiting counters.
- MongoDB + Elasticsearch/Atlas Search: sync via change streams or native search indexes.
- MongoDB + Kafka: CDC and event-driven microservices, outbox.
- MongoDB + Kubernetes: operators (Community/Enterprise/Percona), persistent volumes, anti-affinity, backups.
- MongoDB + AI: embeddings in documents, vector search, hybrid search, RAG metadata filters.
- MongoDB + serverless: client reuse, connection limits, Atlas Data API changes (verify).

---

# 🔬 Part 12: MongoDB Internals

### I1. Process architecture
`mongod` (data node) runs threads for client connections (thread-per-connection with an optimized service executor), WiredTiger eviction/checkpoint threads, replication (oplog fetcher/applier), background index builders, TTL monitor, and the balancer (on the config server primary). `mongos` is a stateless router with a cached view of cluster metadata. `mongot` serves Atlas Search/Vector Search.

### I2. Query execution
Parse → canonicalize → plan enumeration using available indexes → plan trial ("multi-planner") ranking by early results → winning plan cached by query shape → execution via stages (`COLLSCAN`, `IXSCAN`, `FETCH`, `SORT`, `PROJECTION`). The plan cache is invalidated when indexes change or after enough writes. Slot-based execution (SBE) in newer versions speeds many queries.

### I3. WiredTiger data layout
B-tree per collection and per index in separate files (`collection-*.wt`, `index-*.wt`). Records keyed by an internal 64-bit RecordId; `_id` index maps `_id` → RecordId (unless clustered collections use `_id` as the key). Pages are compressed on disk; updates create in-memory update chains (MVCC) reconciled at checkpoint/eviction.

### I4. Oplog and replication internals
Each write transaction on the primary generates oplog entries with timestamps (`ts` = seconds + increment) and a term. Secondaries pull batches, apply them in parallel by namespace/document with ordering constraints, and advance the **majority commit point** based on replicated progress reported via heartbeats. Entries are idempotent (e.g. `$inc` is logged as `$set` of the result).

### I5. Elections
Raft-inspired: terms, votes, candidate must have up-to-date oplog. Pre-vote avoids disruptions from partitioned nodes. Priority takeover lets a higher-priority node regain primacy. Step-down on losing majority prevents split-brain.

### I6. Sharded cluster internals
Config servers store chunk ranges (`config.chunks`), shards, zones. `mongos` caches routing tables and refreshes on `StaleConfig`. Chunk migration steps: clone documents, apply modifications in the catch-up phase, critical section commit, delete orphans from the donor. Transactions across shards use a two-phase commit coordinated by a transaction coordinator.

### I7. Transactions internals
Each operation in a transaction uses the same WiredTiger snapshot (`snapshot` read concern). Writes create uncommitted updates in memory; commit atomically makes them visible and writes oplog entries (a single `applyOps` entry or chained entries). Conflicts are detected at write time (first writer wins; the other gets `WriteConflict`).

### I8. Journaling and checkpoints
Journal records are group-committed (default 100 ms interval; sync on `j:true`). Checkpoints (every 60 s or 2 GB) write all dirty pages to new locations then switch the root atomically. Recovery = last checkpoint + journal replay.

### I9. Compression
Collections default to Snappy (fast, moderate ratio); zstd gives better ratios with more CPU; zlib is older. Indexes use prefix compression. Network compression (`snappy`, `zstd`, `zlib`) can reduce traffic. Typical storage compression 2–5x depending on data.

### I10. Memory use
WiredTiger cache (configurable) + filesystem cache + per-connection stacks + in-memory sorts/aggregations + index builds. `db.serverStatus().mem` and `wiredTiger.cache` show details. In containers, set cache size explicitly if needed.

---

# 📊 Part 13: Reference Tables

### Write concern levels
| Setting | Meaning | Durability / latency |
|---|---|---|
| `w: 0` | no acknowledgement | fastest, can lose silently |
| `w: 1` | primary acknowledged | may roll back on failover |
| `w: "majority"` | majority acknowledged | safe, slower |
| `j: true` | journaled on the node(s) | durability against crashes |
| `wtimeout` | max wait for acknowledgement | avoids infinite waits |

### Read concern levels
| Level | Guarantee |
|---|---|
| `local` | latest data on the node, may roll back |
| `available` | lowest latency; sharded clusters may return orphans |
| `majority` | data acknowledged by a majority; won't roll back |
| `linearizable` | reflects all majority-acknowledged writes before the read |
| `snapshot` | consistent snapshot (transactions) |

### Index types
| Type | Use |
|---|---|
| Single/compound | equality, range, sort |
| Multikey | arrays |
| Text | basic text search (one per collection) |
| Hashed | even distribution; equality only; hashed shard keys |
| 2dsphere | GeoJSON queries |
| TTL | auto-expiry |
| Partial / sparse | subset indexing |
| Wildcard | dynamic subfields |
| Clustered (5.3) | collection stored in `_id`/key order |
| Atlas Search / Vector | Lucene / ANN |

### Embed vs reference
| Factor | Embed | Reference |
|---|---|---|
| Read pattern | read together | read separately |
| Cardinality | 1:1, 1:few | 1:many unbounded, many:many |
| Update pattern | updated together | updated independently |
| Document growth | bounded | unbounded |
| Consistency | single-doc atomic | needs transactions/sagas |

### Common aggregation stages
| Stage | Purpose |
|---|---|
| `$match` | filter (use first, indexed) |
| `$group` | aggregate by key |
| `$project` / `$set` / `$unset` | shape fields |
| `$sort` / `$limit` / `$skip` | order and paginate |
| `$lookup` | join |
| `$unwind` | flatten arrays |
| `$facet` / `$bucket` | multi-output / histograms |
| `$setWindowFields` | window functions |
| `$merge` / `$out` | write results |

### Version highlights
| Version | Highlight |
|---|---|
| 3.6 | change streams |
| 4.0 | multi-document transactions (replica set) |
| 4.2 | distributed transactions, wildcard indexes, update pipelines |
| 4.4 | hedged reads, refineCollectionShardKey |
| 5.0 | time series, resharding, window functions, versioned API |
| 6.0 | Queryable Encryption preview, change stream pre/post images |
| 7.0 | Queryable Encryption GA, `analyzeShardKey` |
| 8.0 | performance and scaling improvements (verify specifics) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Collection `t`: `{_id:1, v:5}`, `{_id:2}`, `{_id:3, v:null}`.
```js
db.t.find({ v: null })              // ?
db.t.find({ v: { $exists: true } }) // ?
db.t.find({ v: { $ne: 5 } })        // ?
```
**Output:** `_id` 2 and 3; `_id` 1 and 3; `_id` 2 and 3. `null` matches both missing and null; `$ne` also matches missing fields.

### O2.
```js
db.c.insertOne({ _id: 1 })
db.c.insertOne({ _id: 1 })
```
**Result:** the second throws `E11000 duplicate key error collection: c index: _id_ dup key: { _id: 1 }`.

### O3.
Collection `orders`: `{c:"A",amt:10}`, `{c:"A",amt:20}`, `{c:"B",amt:5}`.
```js
db.orders.aggregate([{ $group: { _id: "$c", t: { $sum: "$amt" } } }, { $sort: { t: -1 } }])
```
**Output:** `{ _id: "A", t: 30 }`, `{ _id: "B", t: 5 }`.

### O4.
Doc `{ _id: 1, tags: ["x","y"] }`, `{ _id: 2, tags: [] }`, `{ _id: 3 }`.
```js
db.d.aggregate([{ $unwind: "$tags" }])
```
**Output:** two documents for `_id: 1` (tags `x` and `y`). Documents 2 and 3 produce nothing unless `preserveNullAndEmptyArrays: true`.

### O5.
```js
db.s.updateOne({ _id: 1 }, { $set: { a: 1 } }, { upsert: true })
db.s.findOne({ _id: 1 })
```
**Output (when no doc existed):** `{ _id: 1, a: 1 }` (upserted; the equality field of the filter is included).

### O6.
Doc `{ _id: 1, arr: [1, 2, 3] }`.
```js
db.p.updateOne({ _id: 1 }, { $push: { arr: { $each: [4], $slice: -2 } } })
```
**Result:** `arr` becomes `[3, 4]` (keeps the last two).

### O7.
Doc `{ _id: 1, a: "10" }`.
```js
db.q.find({ a: { $gt: 5 } })
```
**Output:** no documents. A string is not comparable to a number (type bracketing).

### O8.
Docs with `v`: `"b"`, `2`, `null`, `true`.
```js
db.m.find({}, { _id: 0, v: 1 }).sort({ v: 1 })
```
**Output order:** `null`, `2`, `"b"`, `true` (BSON order: null < numbers < strings < ... < booleans).

### O9.
Doc `{ _id: 1, set: [1, 2] }`.
```js
db.z.updateOne({ _id: 1 }, { $addToSet: { set: 2 } })   // no change
db.z.updateOne({ _id: 1 }, { $addToSet: { set: 3 } })   // set: [1, 2, 3]
```
**Result:** first reports `modifiedCount: 0`, second `modifiedCount: 1`.

### O10.
```js
db.users.createIndex({ a: 1, b: 1 })
db.users.find({ b: 5 }).explain("queryPlanner").queryPlanner.winningPlan.stage
```
**Answer:** typically `COLLSCAN` (or a full index scan) because the query does not use the index prefix `a`. An index on `{a:1,b:1}` serves `a` and `a,b`, not `b` alone.

### O11.
```js
db.items.find({ tags: { $size: 2 } })        // docs where tags has exactly 2 elements
db.items.find({ "tags.1": { $exists: true } }) // docs with at least 2 elements
```
**Note:** `$size` accepts only exact numbers, not ranges.

### O12.
```js
db.n.insertOne({ _id: 1, v: NumberDecimal("0.1") })
db.n.aggregate([{ $project: { s: { $add: ["$v", NumberDecimal("0.2")] } } }])
```
**Output:** `s: NumberDecimal("0.3")`. Decimal128 avoids binary floating-point errors (`0.1 + 0.2` in doubles is `0.30000000000000004`).

---

# ✅ Part 15: MCQs

**1. MongoDB stores data in which format?**
A) JSON text  B) BSON  C) XML  D) CSV
**Answer: B**

**2. What is the maximum BSON document size?**
A) 1 MB  B) 16 MB  C) 100 MB  D) Unlimited
**Answer: B**

**3. Which operator performs a join in the aggregation framework?**
A) `$join`  B) `$lookup`  C) `$merge`  D) `$match`
**Answer: B**

**4. The ESR rule orders compound index keys as:**
A) Equality, Sort, Range  B) Range, Sort, Equality  C) Sort, Range, Equality  D) Equality, Range, Sort
**Answer: A**

**5. Which write concern is safest against rollback?**
A) `w: 0`  B) `w: 1`  C) `w: "majority"`  D) `j: false`
**Answer: C**

**6. Single-document operations in MongoDB are:**
A) Not atomic  B) Atomic  C) Atomic only with transactions  D) Atomic only on primaries in sharded clusters
**Answer: B**

**7. A shard key that increases monotonically (like ObjectId in ranged sharding) causes:**
A) Perfect balance  B) A hot shard for inserts  C) Faster reads everywhere  D) No effect
**Answer: B**

**8. Which feature gives real-time notifications of changes?**
A) Triggers only  B) Change streams  C) Profiler  D) Oplog tailing is impossible
**Answer: B**

**9. Which index automatically expires documents?**
A) Sparse  B) TTL  C) Hashed  D) Text
**Answer: B**

**10. Default storage engine:**
A) MMAPv1  B) WiredTiger  C) InnoDB  D) RocksDB
**Answer: B**

**11. What does `explain("executionStats")` `COLLSCAN` indicate?**
A) Index used  B) Full collection scan  C) Covered query  D) Sharded query
**Answer: B**

**12. Which statement about `$ne` is true?**
A) Excludes documents missing the field  B) Includes documents missing the field  C) Always uses an index efficiently  D) Only works on numbers
**Answer: B**

**13. Where does Mongoose `unique: true` act?**
A) It is a validator  B) It creates a unique index  C) It validates in memory only  D) It prevents duplicates without an index
**Answer: B**

**14. The oplog is:**
A) A user collection  B) A capped collection of operations used for replication  C) A backup file  D) A shard key
**Answer: B**

**15. Which type is best for money?**
A) Double  B) Decimal128  C) String  D) Int32 always
**Answer: B**

**16. A minimal production replica set should have:**
A) 1 node  B) 2 nodes  C) 3 voting nodes  D) 4 nodes
**Answer: C**

**17. `skip()` with large values is slow because:**
A) It locks the collection  B) The server scans and discards skipped documents  C) It disables indexes  D) It forces sorting on disk
**Answer: B**

**18. Which pattern copies a few fields of a referenced document to avoid `$lookup`?**
A) Bucket  B) Extended Reference  C) Outlier  D) Polymorphic
**Answer: B**

**19. A covered query has:**
A) `totalDocsExamined` equal to 0 for matching documents (served from the index)  B) A `COLLSCAN`  C) A `SORT` stage  D) No projection
**Answer: A**

**20. Which is a NoSQL injection mitigation?**
A) Use `$where` for flexibility  B) Validate and cast inputs, sanitize operators  C) Disable auth  D) Store passwords in plain text
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Treating MongoDB as schemaless** and skipping validation and design.
2. **Missing or wrong indexes** (COLLSCAN, ignoring ESR).
3. **Unbounded arrays** inside documents.
4. **Modeling like relational tables** with many `$lookup`s.
5. **Using `skip()` pagination** for deep pages.
6. **Creating a new `MongoClient` per request** or per function invocation.
7. **Not using `w: "majority"`** for important writes.
8. **Reading from secondaries without accounting for lag.**
9. **Monotonic shard keys** causing hot shards.
10. **Storing dates and numbers as strings.**
11. **Using `Double` for money.**
12. **Trusting user JSON in queries** (NoSQL injection).
13. **Leaving MongoDB exposed** without auth or network restrictions.
14. **Running long or large transactions** instead of redesigning.
15. **Ignoring write conflicts and not retrying** transient transaction errors.
16. **Too many indexes** (write overhead, RAM).
17. **Unanchored/case-insensitive regex** on large collections.
18. **Deleting huge amounts of data without a plan** (use TTL, partitioning, time series, archive).
19. **No backups tested** or no PITR.
20. **Using Mongoose `autoIndex` in production** and surprising index builds.
21. **Mixing `ObjectId` and string ids.**
22. **No monitoring** of replication lag, cache pressure, connections.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You design schemas from **access patterns**, choosing embed vs reference with growth bounds and known patterns.
- You can build indexes with ESR, read `explain`, and aim for covered queries.
- You explain replication (oplog, elections, rollback) and choose **write/read concerns** deliberately.
- You select **shard keys** with cardinality, distribution and query targeting in mind, and know hot-shard and jumbo-chunk fixes.
- You use transactions sparingly and handle transient errors with retries.
- You know WiredTiger cache, checkpoints, compression, and working-set sizing.
- You protect against NoSQL injection and secure deployments (auth, TLS, network, encryption).
- You operate clusters: monitoring, profiling, backups/PITR, upgrades with FCV, runbooks, failover tests.
- You compare MongoDB honestly with PostgreSQL and know when not to use it.
- You bring concrete incidents and measured improvements to the discussion.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands (mongosh)
```js
show dbs; use shop; show collections
db.col.find(filter, projection).sort().limit()
db.col.aggregate([{ $match }, { $group }, { $sort }])
db.col.createIndex({ a: 1, b: -1 }); db.col.getIndexes()
db.col.find(q).explain("executionStats")
rs.status(); rs.printSecondaryReplicationInfo(); sh.status()
db.currentOp(); db.setProfilingLevel(1, { slowms: 100 })
```

### Modeling checklist
Queries first • embed bounded read-together data • reference unbounded/independent data • patterns (subset, bucket, extended reference, computed) • schema validation • schemaVersion • avoid unbounded arrays.

### Index checklist
ESR order • covered queries where hot • partial/TTL/unique as needed • remove redundant prefixes • check `$indexStats` • build off-peak • keep index size within RAM.

### Reliability checklist
3+ member replica set • `w: majority` • retryable writes • tested failover • backups with PITR and restore drills • oplog window sized • monitoring and alerts (lag, cache, connections, disk).

### Security checklist
Auth + RBAC • TLS • private network/IP allow list • encryption at rest • CSFLE/QE for sensitive fields • input validation • no `$where` • auditing • patching.

### Interview strategy
1. State the concept and the access pattern it serves.
2. Show a short query/schema/index example.
3. Explain trade-offs (embed vs reference, consistency vs latency).
4. Mention operational aspects (monitoring, failover, backups).
5. Tell a short real incident and the lesson.

### Final checklist before the interview
- [ ] Explain BSON, `_id`, document model, and embed vs reference with patterns.
- [ ] Write CRUD, array updates, and aggregation pipelines including `$lookup` and `$group`.
- [ ] Apply ESR, read `explain`, and fix a slow query.
- [ ] Explain replica sets, oplog, elections, write/read concern, rollback.
- [ ] Explain sharding, shard key choice, hot shards, balancer, targeted queries.
- [ ] Explain transactions, limitations, and retry handling.
- [ ] Describe change streams, TTL, time series, Atlas Search/Vector Search.
- [ ] Prepare a modeling story and an incident story with root cause and prevention.

