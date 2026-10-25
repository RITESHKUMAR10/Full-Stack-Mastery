# Prisma & ORMs Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Prisma ORM 5.x and 6.x** with Node.js 18+/TypeScript 5, PostgreSQL/MySQL/SQLite/MongoDB, and compares it with **TypeORM 0.3**, **Sequelize 6**, **Drizzle ORM**, **Knex/Kysely** (query builders) and **Mongoose** (see `030_MongoDB.md`). Prisma moves fast: features such as `driverAdapters`, `relationJoins` (join-based relation loading), `omit`, TypedSQL, the `prisma.config.ts` file and the Rust-free client (default in **Prisma 7**) arrived across 5.x–7.x. Anything marked "verify" should be checked in the official docs (prisma.io/docs) for your exact version. Examples use the sample name **Ritesh Kumar**.
> This file covers ORM fundamentals (Active Record vs Data Mapper, Unit of Work, N+1), the Prisma schema language, Prisma Client CRUD and relations, filtering/pagination/aggregation, transactions, raw SQL, migrations (`migrate dev` vs `migrate deploy`), connection management (serverless, pooling, Accelerate), performance tuning, testing, security, comparisons with other ORMs and production practice. SQL fundamentals refer to `026_SQL.md` to `029_SQLite.md`; caching refers to `031_Redis-and-Caching.md`.

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
- [Part 12: Prisma & ORM Internals](#-part-12-prisma--orm-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is an ORM?
**Object-Relational Mapper**: a library that maps database tables/rows to objects/classes in your language so you can read and write data with code instead of hand-written SQL strings. It handles query generation, result mapping, relations, migrations (often) and type safety. Examples: Prisma, TypeORM, Sequelize, Drizzle, Hibernate, SQLAlchemy, Entity Framework, ActiveRecord.

### Q2. What is Prisma?
A **next-generation ORM** for Node.js and TypeScript. You describe your data model in a declarative **Prisma schema** (`schema.prisma`); Prisma generates a fully **type-safe client** (`@prisma/client`) and handles **migrations** (`prisma migrate`) and a GUI (**Prisma Studio**). It supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, CockroachDB and MongoDB.

### Q3. Prisma's main components *(Must-know)*
| Component | Purpose |
|---|---|
| **Prisma Schema** | Single source of truth: datasource, generator, models, enums |
| **Prisma Client** | Auto-generated, type-safe query builder |
| **Prisma Migrate** | Declarative migration system generating SQL files |
| **Prisma Studio** | Browser GUI to view/edit data |
| **Prisma Accelerate / Optimize / Postgres** | Managed connection pool + cache, query insights, hosted DB (optional products) |

### Q4. Why use an ORM? Pros and cons *(Must-know)*
**Pros:** productivity, type safety, less boilerplate, protection against SQL injection through parameterization, consistent relation handling, migrations, portability across databases.
**Cons:** abstraction leaks, hidden inefficient queries (N+1), harder complex/analytical SQL, extra learning curve, performance overhead, vendor-specific features not exposed. A pragmatic stance: use the ORM for 90% CRUD and drop to raw SQL for the hard 10%.

### Q5. Install and initialize Prisma
```bash
npm init -y
npm i -D prisma typescript tsx
npm i @prisma/client
npx prisma init --datasource-provider postgresql
```
This creates `prisma/schema.prisma` and `.env` with `DATABASE_URL`. After editing the schema:
```bash
npx prisma migrate dev --name init   # create + apply migration, regenerate client
npx prisma generate                  # regenerate client only
npx prisma studio
```

### Q6. A basic Prisma schema *(Must-know)*
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  @@index([authorId])
}

enum Role {
  USER
  ADMIN
}
```
`?` makes a field optional (nullable); `[]` makes it a list (the relation's other side). `@relation(fields, references)` defines the foreign key on the side that holds it.

### Q7. Scalar types and native types
Prisma scalars: `String`, `Boolean`, `Int`, `BigInt`, `Float`, `Decimal`, `DateTime`, `Json`, `Bytes`, `Unsupported("...")`. Use `@db.*` native attributes for precise DB types: `@db.VarChar(255)`, `@db.Text`, `@db.Decimal(10,2)`, `@db.Uuid`, `@db.Timestamptz(6)`. Use `Decimal` (not `Float`) for money.

### Q8. Common field attributes
`@id`, `@default(...)` (`autoincrement()`, `uuid()`, `cuid()`, `now()`, `dbgenerated()`), `@unique`, `@updatedAt`, `@map("col")`, `@relation`, `@ignore`; model attributes: `@@id([a,b])` (composite key), `@@unique([a,b])`, `@@index([a,b])`, `@@map("table")`, `@@fulltext` (MySQL/Mongo), `@@schema`.

### Q9. Create a client and basic CRUD *(Must-know)*
```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({ data: { email: "ritesh@example.com", name: "Ritesh Kumar" } });

// Read
const one  = await prisma.user.findUnique({ where: { email: "ritesh@example.com" } });
const many = await prisma.user.findMany({ where: { role: "ADMIN" }, orderBy: { createdAt: "desc" }, take: 10 });

// Update
await prisma.user.update({ where: { id: user.id }, data: { name: "Ritesh K." } });

// Delete
await prisma.user.delete({ where: { id: user.id } });
```
Every method is `async` and returns typed results.

### Q10. `findUnique` vs `findFirst` vs `findMany`
- `findUnique`/`findUniqueOrThrow`: lookup by a unique field/`@id`/compound unique; returns one or `null` (or throws).
- `findFirst`/`findFirstOrThrow`: first record matching any filter (with ordering).
- `findMany`: list with filters, ordering, pagination.
`findUnique` only accepts unique fields in `where` (in newer versions extra non-unique filters are allowed alongside a unique one).

### Q11. `select` vs `include` *(Must-know)*
```ts
// include: all scalar fields + chosen relations
const u1 = await prisma.user.findUnique({ where: { id: 1 }, include: { posts: true } });

// select: only listed fields (can nest relation selects)
const u2 = await prisma.user.findUnique({
  where: { id: 1 },
  select: { id: true, name: true, posts: { select: { title: true }, where: { published: true } } },
});
```
You can't use `select` and `include` at the same level. Prefer `select` to avoid over-fetching.

### Q12. Filtering operators
```ts
await prisma.user.findMany({
  where: {
    AND: [{ createdAt: { gte: new Date("2025-01-01") } }, { email: { endsWith: "@example.com" } }],
    OR:  [{ name: { contains: "ritesh", mode: "insensitive" } }, { role: { in: ["ADMIN", "USER"] } }],
    NOT: { name: null },
  },
});
```
Operators: `equals`, `not`, `in`, `notIn`, `lt/lte/gt/gte`, `contains`, `startsWith`, `endsWith`, `mode: "insensitive"` (Postgres/Mongo), relation filters `some`, `every`, `none`, `is`, `isNot`.

### Q13. Relation filters
```ts
// users who have at least one published post
await prisma.user.findMany({ where: { posts: { some: { published: true } } } });
// users with no posts
await prisma.user.findMany({ where: { posts: { none: {} } } });
```

### Q14. Pagination: offset and cursor *(Must-know)*
```ts
// Offset
await prisma.post.findMany({ skip: 20, take: 10, orderBy: { id: "asc" } });

// Cursor (keyset-like, scales better)
await prisma.post.findMany({ take: 10, skip: 1, cursor: { id: lastId }, orderBy: { id: "asc" } });
```
Large `skip` values scan and discard rows; cursor pagination relies on an indexed, deterministic sort.

### Q15. Create with nested relations
```ts
await prisma.user.create({
  data: {
    email: "amit@example.com",
    posts: { create: [{ title: "Hello" }, { title: "Second" }] },
  },
  include: { posts: true },
});
```
Nested writes run inside an implicit transaction. Also `connect`, `connectOrCreate`, `createMany`, `set`, `disconnect`, `delete`.

### Q16. `connect` vs `create` vs `connectOrCreate`
```ts
await prisma.post.create({
  data: {
    title: "T",
    author: { connect: { email: "ritesh@example.com" } },        // link existing
    // author: { create: { email: "new@x.com" } },                // create and link
    // author: { connectOrCreate: { where: { email }, create: { email } } },
  },
});
```

### Q17. `upsert`, `updateMany`, `deleteMany`, `createMany`
```ts
await prisma.user.upsert({ where: { email: "a@x.com" }, update: { name: "A" }, create: { email: "a@x.com", name: "A" } });
await prisma.user.updateMany({ where: { role: "USER" }, data: { role: "ADMIN" } });   // returns { count }
await prisma.user.deleteMany({ where: { createdAt: { lt: cutoff } } });                // returns { count }
await prisma.user.createMany({ data: [{ email: "a@x.com" }, { email: "b@x.com" }], skipDuplicates: true });
```
`createMany` doesn't return created records on all databases (use `createManyAndReturn` in 5.14+ for Postgres/SQLite/CockroachDB).

### Q18. Atomic number operations
```ts
await prisma.product.update({ where: { id: 1 }, data: { stock: { decrement: 1 }, views: { increment: 1 } } });
```
Operators: `increment`, `decrement`, `multiply`, `divide`, `set`. They compile to `SET stock = stock - 1`, avoiding the read-modify-write race.

### Q19. Counting and aggregations
```ts
const total = await prisma.post.count({ where: { published: true } });
const agg = await prisma.order.aggregate({ _sum: { amount: true }, _avg: { amount: true }, _count: true });
const byUser = await prisma.order.groupBy({ by: ["userId"], _sum: { amount: true }, having: { amount: { _sum: { gt: 1000 } } } });
const withCounts = await prisma.user.findMany({ include: { _count: { select: { posts: true } } } });
```

### Q20. Sorting
```ts
orderBy: [{ role: "asc" }, { createdAt: "desc" }]
orderBy: { posts: { _count: "desc" } }        // order by relation count
orderBy: { name: { sort: "asc", nulls: "last" } }
```

### Q21. Raw queries
```ts
const rows = await prisma.$queryRaw`SELECT id, email FROM "User" WHERE email = ${email}`;   // parameterized (safe)
const n = await prisma.$executeRaw`UPDATE "User" SET name = ${name} WHERE id = ${id}`;
// UNSAFE with user input:
await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE email = '${email}'`);
```
Tagged template literals are parameterized automatically; `*Unsafe` variants concatenate strings and risk SQL injection.

### Q22. Logging queries
```ts
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
// or event-based:
const prisma2 = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
prisma2.$on("query", (e) => console.log(e.query, e.params, `${e.duration}ms`));
```
Use during development to catch N+1 and slow queries.

### Q23. Prisma Studio and `db pull` / `db push`
- `prisma studio`: browse/edit data.
- `prisma db pull`: introspect an existing database into the schema.
- `prisma db push`: sync the schema to the DB without creating migration files (prototyping).
- `prisma migrate dev`: creates migration SQL files, applies them (development).
- `prisma migrate deploy`: applies pending migrations (CI/production).

### Q24. Environment variables and config
`DATABASE_URL` in `.env` (never commit secrets). For multi-environment setups use separate `.env` files or secret managers. Connection string example: `postgresql://user:pass@localhost:5432/mydb?schema=public&connection_limit=10`. Special characters in passwords must be URL-encoded.

### Q25. Handling errors
```ts
import { Prisma } from "@prisma/client";
try {
  await prisma.user.create({ data: { email } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") throw new Error(`Unique constraint failed on ${e.meta?.target}`);
    if (e.code === "P2025") throw new Error("Record not found");
    if (e.code === "P2003") throw new Error("Foreign key constraint failed");
  }
  throw e;
}
```
Common codes: **P2002** unique violation, **P2025** record to update/delete not found, **P2003** FK violation, **P2000** value too long, **P2034** transaction conflict/deadlock, **P1001** can't reach DB, **P2024** pool timeout.

### Q26. Singleton client in development
Hot reloading (Next.js, nodemon) re-runs modules and creates many clients, exhausting connections.
```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```

### Q27. Graceful shutdown
```ts
process.on("SIGTERM", async () => { await prisma.$disconnect(); process.exit(0); });
```
Prisma connects lazily on the first query; call `$connect()` to fail fast at startup if desired.

### Q28. Relation types in Prisma
- **One-to-one:** `profile Profile?` + `user User @relation(fields: [userId], references: [id])` with `userId Int @unique`.
- **One-to-many:** `posts Post[]` on the parent; FK on the child.
- **Many-to-many (implicit):** `categories Category[]` on both sides; Prisma manages a hidden join table (`_CategoryToPost`).
- **Many-to-many (explicit):** a model with two FKs and optional extra columns (`role`, `assignedAt`).
- **Self-relations:** `parent Category? @relation("Tree", fields:[parentId], references:[id])` + `children Category[] @relation("Tree")`.

### Q29. Explicit vs implicit many-to-many
Implicit: simple, no extra columns, convenient `connect`. Explicit: needed when the join carries data (quantity, role, timestamps) or when you need to query the join table directly. Prefer explicit in real systems for flexibility.
```prisma
model PostCategory {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  assignedAt DateTime @default(now())
  @@id([postId, categoryId])
}
```

### Q30. Referential actions
```prisma
author User @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Restrict)
```
Options: `Cascade`, `Restrict`, `NoAction`, `SetNull`, `SetDefault`. Defaults: required relations `onDelete: Restrict`, optional `SetNull`; `onUpdate: Cascade`. With `relationMode = "prisma"` (PlanetScale/Vitess-style) Prisma emulates these in the client.

### Q31. Enums
Defined in the schema (native enums in PostgreSQL/MySQL; emulated as strings in SQLite). Changing enum values requires a migration (Postgres cannot easily remove values). TypeScript gets a matching `enum`-like object.

### Q32. JSON fields
```prisma
model Event { id Int @id @default(autoincrement()) payload Json }
```
```ts
await prisma.event.findMany({ where: { payload: { path: ["user", "id"], equals: 42 } } });  // Postgres/MySQL
```
JSON is untyped in TypeScript (`Prisma.JsonValue`); validate with Zod. Don't use JSON to avoid modelling relational data.

### Q33. Soft delete (concept)
Add `deletedAt DateTime?` and filter `deletedAt: null` everywhere. Prisma has no built-in soft delete: implement with **client extensions** (query extension overriding `findMany`, `delete` → `update`) or repository helpers; remember unique constraints and cascades interact with soft-deleted rows.

### Q34. `$transaction` basics
```ts
const [a, b] = await prisma.$transaction([
  prisma.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } }),
  prisma.account.update({ where: { id: 2 }, data: { balance: { increment: 100 } } }),
]);
```
All operations run in one DB transaction; if any fails, everything rolls back. Interactive transactions in Q50.

### Q35. Prisma vs raw SQL, in one sentence
Prisma gives type-safe, productive CRUD and relations; raw SQL (via `$queryRaw`, TypedSQL or a query builder like Kysely) is the tool for complex reports, window functions, CTEs and DB-specific features.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. ORM patterns: Active Record vs Data Mapper *(Must-know)*
| | Active Record | Data Mapper |
|---|---|---|
| Model knows how to persist itself | Yes (`user.save()`) | No; a separate mapper/repository persists |
| Domain logic vs persistence | Coupled | Separated |
| Examples | Rails ActiveRecord, Sequelize models, TypeORM `BaseEntity` | Hibernate, TypeORM repositories, MikroORM |
| Prisma | Neither exactly: a **query-builder-style client** over plain data (results are plain objects, no identity map or change tracking) |
Prisma returns plain objects, so there is no lazy loading, no entity change tracking and no unit-of-work flush.

### Q37. The N+1 query problem *(Must-know)*
Fetching a list (1 query) and then querying a relation for each item (N queries).
```ts
// BAD: 1 + N queries
const users = await prisma.user.findMany();
for (const u of users) u.posts = await prisma.post.findMany({ where: { authorId: u.id } });

// GOOD: Prisma batches relation loading
const users2 = await prisma.user.findMany({ include: { posts: true } });
```
Prisma loads relations with separate batched queries (`WHERE authorId IN (...)`) by default, or one query with a `JOIN` using `relationJoins` (`relationLoadStrategy: "join"`, Postgres/MySQL). Also Prisma's **dataloader** batches `findUnique` calls in the same tick. In GraphQL resolvers, N+1 appears when each resolver issues its own query: use `include`, DataLoader, or `fluent-api` batching.

### Q38. `relationLoadStrategy`: `join` vs `query`
```ts
await prisma.user.findMany({ relationLoadStrategy: "join", include: { posts: true } });
```
`join` pushes the work into the database using lateral joins/JSON aggregation (fewer round trips); `query` runs multiple queries and merges in the Prisma engine. Choose by measuring; `join` is often better for latency, `query` for huge fan-out.

### Q39. Over-fetching and `select`
`include` returns all columns of the relation. For lists, use `select` to fetch only needed fields (reduces bandwidth, memory and JSON parsing). `omit` (5.16+) excludes sensitive fields (like `passwordHash`) globally or per query.
```ts
const prisma = new PrismaClient({ omit: { user: { passwordHash: true } } });
```

### Q40. Indexes in Prisma
```prisma
model Post {
  id        Int @id @default(autoincrement())
  authorId  Int
  published Boolean
  createdAt DateTime @default(now())
  title     String
  @@index([authorId, createdAt(sort: Desc)])
  @@index([published])
  @@unique([authorId, title])
}
```
Foreign keys are **not** automatically indexed in PostgreSQL (MySQL does); add `@@index` on FK columns used in joins/filters. Index types (`type: Hash/Gin/Gist/Brin`) and `ops` are available for PostgreSQL.

### Q41. Migrations workflow *(Must-know)*
1. Edit `schema.prisma`.
2. `prisma migrate dev --name add_posts`: creates `prisma/migrations/<timestamp>_add_posts/migration.sql`, applies it to the dev DB (and uses a **shadow database** to detect drift), regenerates the client.
3. Commit the migration files.
4. CI/Prod: `prisma migrate deploy` applies pending migrations without prompting or resetting.
Never use `migrate dev` or `migrate reset` against production.

### Q42. Shadow database and drift
`migrate dev` creates a temporary **shadow database**, replays all migrations, and compares with the schema to produce the next migration and detect **drift** (DB differs from migration history). Managed DBs sometimes need `shadowDatabaseUrl` or permission to create DBs.

### Q43. Editing a migration before applying (custom SQL)
```bash
npx prisma migrate dev --create-only --name backfill_slug
# edit migration.sql to add UPDATE statements, data backfills, CREATE INDEX CONCURRENTLY (separate migration), etc.
npx prisma migrate dev
```
Data migrations belong in migration SQL or one-off scripts; Prisma does not generate data backfills.

### Q44. Safe schema changes (expand/contract)
Rename or drop columns in steps: add the new column (nullable) → deploy code writing both → backfill → switch reads → make required / drop old. Prisma by default generates DROP + ADD for renames (data loss!); edit the SQL to `ALTER TABLE ... RENAME COLUMN` or use `@map`.

### Q45. `@map` and `@@map`
```prisma
model UserAccount {
  id        Int    @id
  firstName String @map("first_name")
  @@map("user_accounts")
}
```
Keep idiomatic TypeScript names (camelCase) while matching legacy snake_case DB names.

### Q46. Composite IDs and compound uniques
```prisma
model Enrollment { studentId Int  courseId Int  @@id([studentId, courseId]) }
model Tag { name String  postId Int  @@unique([postId, name]) }
```
```ts
await prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: 1, courseId: 2 } } });
```

### Q47. Optional relations and null handling
`user User?` means nullable FK; querying `where: { userId: null }` finds unlinked rows. `findUnique` returns `null` for not found; use `OrThrow` variants to get `P2025` errors. Narrow types after checking null.

### Q48. Type utilities from Prisma
```ts
import { Prisma } from "@prisma/client";
type UserWithPosts = Prisma.UserGetPayload<{ include: { posts: true } }>;
const userSelect = { id: true, name: true } satisfies Prisma.UserSelect;
type UserPreview = Prisma.UserGetPayload<{ select: typeof userSelect }>;
function where(input: Prisma.UserWhereInput) {}
```
`Prisma.validator` and `satisfies` keep reusable query fragments type-checked.

### Q49. Validation: DB constraints vs app validation
Prisma schema enforces types, `@unique`, FKs, required fields, but not business rules (email format, ranges). Validate input at the API boundary (Zod/Joi/class-validator), and add DB `CHECK` constraints via migration SQL where needed. Both layers are needed.

### Q50. Interactive transactions *(Must-know)*
```ts
await prisma.$transaction(async (tx) => {
  const acc = await tx.account.findUnique({ where: { id: 1 } });
  if (!acc || acc.balance < 100) throw new Error("Insufficient funds");     // throwing rolls back
  await tx.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } });
  await tx.account.update({ where: { id: 2 }, data: { balance: { increment: 100 } } });
}, { maxWait: 5000, timeout: 10000, isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
```
Defaults: `maxWait` 2 s (waiting for a connection), `timeout` 5 s. Don't make network calls (HTTP, email) inside a transaction: they hold a connection and locks. Use `tx`, not the global `prisma`, inside the callback.

### Q51. Sequential vs interactive transactions
| | `$transaction([ ... ])` | `$transaction(async tx => ...)` |
|---|---|---|
| Logic between queries | No | Yes |
| Performance | Single batch, lighter | Holds a connection, longer |
| Use for | Independent writes that must be atomic | Read-then-write workflows |

### Q52. Isolation levels and concurrency problems
`ReadUncommitted`, `ReadCommitted`, `RepeatableRead`, `Snapshot` (SQL Server), `Serializable`. Higher levels prevent anomalies (non-repeatable reads, phantoms, write skew) at the cost of conflicts (`P2034` write conflict/deadlock → **retry** the transaction). Default is the DB's default (Postgres `ReadCommitted`, MySQL `RepeatableRead`).

### Q53. Optimistic concurrency with a version column
```prisma
model Doc { id Int @id  content String  version Int @default(0) }
```
```ts
const r = await prisma.doc.updateMany({ where: { id, version }, data: { content, version: { increment: 1 } } });
if (r.count === 0) throw new Error("Conflict: reload and retry");
```

### Q54. Pessimistic locking (`FOR UPDATE`)
Prisma has no first-class API; use raw SQL inside an interactive transaction:
```ts
await prisma.$transaction(async (tx) => {
  const [row] = await tx.$queryRaw<{ stock: number }[]>`SELECT stock FROM "Product" WHERE id = ${id} FOR UPDATE`;
  if (row.stock < qty) throw new Error("Out of stock");
  await tx.product.update({ where: { id }, data: { stock: { decrement: qty } } });
});
```
Often an atomic conditional `updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })` avoids locks entirely: check `count`.

### Q55. Pagination total counts
`count()` on large tables is expensive (full scan). Use approximate counts, cache, "has next page" via `take: n+1`, or avoid showing totals.

### Q56. Full-text search
PostgreSQL: `previewFeatures = ["fullTextSearchPostgres"]` (GA in later versions) with `search` filter or raw `to_tsvector`. MySQL: `@@fulltext`. For serious search use Elasticsearch/OpenSearch (see `032_Elasticsearch.md`) or Postgres FTS via raw SQL with a GIN index.

### Q57. Dates, time zones and `DateTime`
Prisma `DateTime` maps to `timestamp(3)` (Postgres, **without** time zone) by default and treats values as UTC. Use `@db.Timestamptz(6)` for time-zone aware columns. Store UTC; convert in the UI. Be careful with `@db.Date` (JS Date is a timestamp).

### Q58. BigInt and Decimal in JSON
`BigInt` and `Decimal` don't serialize with `JSON.stringify`. Convert (`toString()`), add a global `BigInt.prototype.toJSON`, or map in the API layer. Use `Prisma.Decimal` (decimal.js) for money arithmetic.

### Q59. Seeding data
```json
// package.json
"prisma": { "seed": "tsx prisma/seed.ts" }
```
```ts
// prisma/seed.ts
await prisma.user.upsert({ where: { email: "ritesh@example.com" }, update: {}, create: { email: "ritesh@example.com", name: "Ritesh Kumar" } });
```
Run with `npx prisma db seed` (also runs after `migrate reset`). Make seeds idempotent with `upsert`.

### Q60. Client extensions
```ts
const xprisma = prisma.$extends({
  result: { user: { fullName: { needs: { firstName: true, lastName: true }, compute: (u) => `${u.firstName} ${u.lastName}` } } },
  model: { user: { async findByEmail(email: string) { return prisma.user.findUnique({ where: { email } }); } } },
  query: { $allModels: { async findMany({ args, query }) { args.take ??= 100; return query(args); } } },
});
```
Extension components: `result` (computed fields), `model` (custom methods), `query` (intercept operations), `client` (client-level methods). They replace the deprecated `$use` middleware.

### Q61. Middleware (`$use`) vs extensions
`prisma.$use` (deprecated/removed in recent versions) wrapped every query; use `$extends({ query })` for logging, soft delete, multitenancy, and timing.

### Q62. Multi-schema and multi-database
`@@schema("auth")` with `schemas = ["public","auth"]` (multiSchema) for PostgreSQL/SQL Server. For multiple databases, use multiple Prisma schemas/clients with `output` paths (a single client can't span databases).

### Q63. Views and unsupported features
`view` blocks (`previewFeatures = ["views"]`) map DB views. Unsupported DB types use `Unsupported("tsvector")` and can only be queried by raw SQL. Features like partial indexes, check constraints, triggers, exclusion constraints, and generated columns are managed in migration SQL.

### Q64. MongoDB with Prisma
`provider = "mongodb"`, `@id @default(auto()) @map("_id") @db.ObjectId`, embedded docs via `type` composites, `db push` instead of `migrate` (no SQL migrations), transactions require a replica set. Relations are references (no FKs enforced). See `030_MongoDB.md`; Mongoose is the more common Node ODM.

### Q65. Prisma in Express/REST
```ts
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select: { id: true, name: true, email: true } });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (e) { next(e); }
});
```
Validate params, `select` only public fields, centralize error mapping (P2002 → 409, P2025 → 404).

### Q66. Prisma with NestJS / Next.js
NestJS: a `PrismaService extends PrismaClient implements OnModuleInit` registered as a provider; `enableShutdownHooks`. Next.js: use the singleton pattern (Q26); in Server Components/Route Handlers call Prisma directly; use the `edge` runtime only with driver adapters/Accelerate.

### Q67. Testing with Prisma
Options: (1) integration tests against a real DB in Docker (Testcontainers) with `migrate deploy` and per-test truncation/transactions; (2) mocking with `jest-mock-extended` (`mockDeep<PrismaClient>()`) for pure unit tests; (3) in-memory SQLite is inexpensive but behaves differently from Postgres. Prefer real DB integration tests for data logic.

### Q68. Prisma vs TypeORM vs Sequelize vs Drizzle (quick) *(Must-know)*
| | Prisma | TypeORM | Sequelize | Drizzle |
|---|---|---|---|---|
| Schema | `schema.prisma` (DSL) | Decorated classes | Models JS/TS | TypeScript schema code |
| Type safety | Excellent (generated) | Good (decorators, weaker query types) | Weak-moderate | Excellent (inferred) |
| Pattern | Client/query builder | Active Record + Data Mapper | Active Record | SQL-like builder |
| Migrations | Built-in (declarative) | Built-in | Built-in (manual) | `drizzle-kit` |
| Raw SQL | Good | Good | Good | Native (SQL-first) |
| Bundle/runtime | Query engine (Rust, or JS in v7) | Pure JS | Pure JS | Very light |
| Edge/serverless | Needs adapters/Accelerate (v7 improves) | Limited | Limited | Excellent |
| Learning curve | Low | Medium | Medium | Medium (SQL knowledge) |

### Q69. Query builders vs ORMs
Query builders (Knex, Kysely) generate SQL with a fluent API and map rows, without entity/relation modelling or identity maps. ORMs add modelling, relations, migrations, and conveniences. Kysely gives end-to-end TypeScript types for SQL-first teams; Drizzle sits between.

### Q70. SQL injection and ORMs
ORMs parameterize queries, so normal API use is safe. Risks: `$queryRawUnsafe`/string concatenation, dynamic `orderBy` fields from user input, building JSON filters from raw request bodies (mass assignment of `where` conditions). Allow-list sortable fields and validate filter shapes.
```ts
const SORTABLE = new Set(["createdAt", "name"]);
const field = SORTABLE.has(req.query.sort as string) ? (req.query.sort as string) : "createdAt";
```

### Q71. Mass assignment
Never pass `req.body` directly to `create`/`update` (`role: "ADMIN"` injection). Pick allowed fields explicitly or parse with a Zod schema.
```ts
const data = createUserSchema.parse(req.body);   // strips unknown keys
await prisma.user.create({ data });
```

### Q72. Idempotent writes and unique constraints
Rely on DB uniqueness (`@@unique`) plus `upsert` or catch `P2002` instead of "check then insert" (race condition). For payments use an idempotency key column with a unique index.

### Q73. Bulk operations performance
`createMany` generates one multi-row INSERT (fast); `updateMany`/`deleteMany` use set-based SQL. Loops of single `create`s are slow. For very large imports use `COPY` (Postgres) via raw SQL or batch in chunks (for example 1,000 rows) to respect parameter limits (Postgres 32,767 bind parameters, SQLite 999/32,766).

### Q74. Prisma Client generation and bundling
`prisma generate` writes the client to `node_modules/.prisma/client` (or a custom `output`). In CI/Docker run `prisma generate` after `npm ci` (and a postinstall). In monorepos set `output` and ensure binary targets (`binaryTargets = ["native", "linux-musl-openssl-3.0.x"]`) for Docker/Alpine/Lambda.

### Q75. Prisma Studio and safety
Studio edits data directly: never expose it publicly; bind to localhost; use read-only credentials for production inspection.

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. Connection management and pooling *(Must-know)*
Prisma Client keeps a **connection pool** per client instance. Default pool size = `num_physical_cpus * 2 + 1`. Configure via the URL: `?connection_limit=10&pool_timeout=10`. With N app instances × pool size you must stay under the database `max_connections` (Postgres default 100). One `PrismaClient` per process; never create one per request.

### Q77. Serverless and connection exhaustion
Each Lambda/edge/Vercel function instance has its own pool; spikes open hundreds of connections. Solutions: set `connection_limit=1` per function, use an external pooler (**PgBouncer** in transaction mode with `?pgbouncer=true`, RDS Proxy, Supabase pooler), or **Prisma Accelerate** (managed pool + cache), or serverless-friendly drivers via **driver adapters** (Neon, PlanetScale, Turso, D1).

### Q78. PgBouncer caveats
In **transaction mode** prepared statements and session features don't work: add `pgbouncer=true` to the URL, use a direct connection (`directUrl`) for `migrate` because migrations need session-level locks.
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")     // pooled
  directUrl = env("DIRECT_URL")       // direct, used by migrate
}
```

### Q79. Driver adapters and edge runtimes
`previewFeatures = ["driverAdapters"]` (GA in later versions) lets Prisma use JS database drivers (`@prisma/adapter-pg`, `-neon`, `-planetscale`, `-libsql`, `-d1`) instead of the Rust query engine's native connection, enabling Cloudflare Workers/Vercel Edge. In Prisma 7 the Rust engine is removed from the default client and adapters become the standard path (verify for your version).
```ts
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

### Q80. Prisma Accelerate
A managed global connection pool and optional **query cache** via `cacheStrategy: { ttl: 60, swr: 120 }`; requires `@prisma/extension-accelerate`. Good for serverless/edge; adds a network hop and vendor dependency. Cache only data that tolerates staleness.

### Q81. Performance: finding slow queries
Enable query logging with durations, use `EXPLAIN ANALYZE` on the generated SQL, add indexes, replace `include` fan-out with `select`, use `relationLoadStrategy: "join"` where beneficial, and use Prisma Optimize or APM/OpenTelemetry tracing (`previewFeatures = ["tracing"]` / `@prisma/instrumentation`).

### Q82. Typical performance pitfalls
1. N+1 loops. 2. Missing indexes on FKs and filters. 3. `findMany` without `take`. 4. Huge `include` trees. 5. Offset pagination on big tables. 6. `count` on every request. 7. `contains` (LIKE `%x%`) on large tables. 8. Transactions that hold connections too long. 9. Sorting without an index. 10. Fetching large JSON/Bytes columns unnecessarily.

### Q83. Batching and DataLoader
Prisma's built-in batching merges concurrent `findUnique` calls on the same model/unique field into a single `IN` query within the same tick. For GraphQL, still use DataLoader for non-unique relations and custom keys.
```ts
const postsByUser = new DataLoader(async (ids: readonly number[]) => {
  const posts = await prisma.post.findMany({ where: { authorId: { in: [...ids] } } });
  return ids.map(id => posts.filter(p => p.authorId === id));
});
```

### Q84. Raw SQL with types: TypedSQL (5.19+)
Write `.sql` files in `prisma/sql/` and `prisma generate --sql` creates typed functions:
```ts
import { getTopCustomers } from "@prisma/client/sql";
const rows = await prisma.$queryRawTyped(getTopCustomers(100));
```
Gives compile-time types for raw SQL parameters and results.

### Q85. Complex reports: when to leave the ORM
Window functions, CTEs, recursive queries, lateral joins, `GROUP BY ROLLUP`, geospatial queries, full-text ranking, bulk upserts with `ON CONFLICT ... DO UPDATE`. Use `$queryRaw`/TypedSQL/Kysely, or database views mapped as models.

### Q86. Upsert and race conditions
`upsert` maps to `INSERT ... ON CONFLICT` only when conditions match (single unique field in `where`, create/update use the same unique value, no nested writes, etc.); otherwise Prisma emulates it with select + insert/update and can fail with `P2002` under concurrency. Catch `P2002` and retry as an update.

### Q87. Soft delete with extensions (example)
```ts
const prismaSoft = prisma.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) { args.where = { ...args.where, deletedAt: null }; return query(args); },
      async delete({ model, args }) { return (prisma as any)[model].update({ ...args, data: { deletedAt: new Date() } }); },
    },
  },
});
```
Beware: relation includes, `count`, `aggregate`, `findUnique` also need filtering; unique constraints on soft-deleted rows; cascades don't apply. Many teams prefer explicit repository methods or DB views.

### Q88. Multi-tenancy patterns
| Pattern | Notes |
|---|---|
| Row-level `tenantId` column (+ composite indexes) | Simplest; enforce via client extension that injects `tenantId` |
| Postgres Row-Level Security (RLS) | `SET LOCAL app.tenant = ...` per transaction; safest isolation |
| Schema-per-tenant | Isolation, many schemas, migration complexity |
| Database-per-tenant | Strongest isolation; many Prisma clients/connections |
```ts
const forTenant = (tenantId: string) => prisma.$extends({ query: { $allModels: { async $allOperations({ args, query }) { (args as any).where = { ...(args as any).where, tenantId }; return query(args); } } } });
```
Test cross-tenant leakage explicitly; extensions don't cover raw queries.

### Q89. Auditing, timestamps and `updatedAt`
`@updatedAt` is set by Prisma Client (not a DB trigger), so raw SQL updates won't change it. Add `createdBy`/`updatedBy` via extensions; for tamper-resistant audit use DB triggers or a dedicated audit table written inside the same transaction.

### Q90. Migrations in CI/CD *(Must-know)*
Pipeline: `npm ci` → `prisma generate` → tests (against a migrated test DB) → build → deploy step runs `prisma migrate deploy` **before** the new app version receives traffic (or as an init job), guarded by a single-runner lock. Use `prisma migrate status` to check state. Keep migration files immutable once merged; fix forward with new migrations.

### Q91. Zero-downtime migrations
Use expand/contract; avoid long locks (`ALTER TABLE` with rewrites, adding NOT NULL with default on huge tables in old Postgres, non-concurrent index builds). Create indexes with `CREATE INDEX CONCURRENTLY` in a hand-edited, separate migration (cannot run inside a transaction), backfill in batches, add constraints as `NOT VALID` then `VALIDATE CONSTRAINT`.

### Q92. Baselining an existing database
For a DB that already has tables: `prisma db pull` → create the initial migration SQL via `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > 0_init/migration.sql` → mark it applied with `prisma migrate resolve --applied 0_init`. Subsequent changes use normal `migrate dev`.

### Q93. Resolving failed migrations
A failed migration leaves `_prisma_migrations` in a failed state. Fix the DB manually (roll back partial changes), then `prisma migrate resolve --rolled-back <name>` (re-run after fixing the SQL) or `--applied <name>` if you completed it manually. Never edit applied migration files in shared environments (checksum mismatch).

### Q94. `prisma migrate diff`
Compares any two schema sources (DB, schema file, migrations directory) and outputs SQL or a summary. Useful for baselining, drift checks in CI (`--exit-code`), and generating rollback SQL.

### Q95. Schema design with Prisma: modelling tips
Use surrogate keys (`Int`/`BigInt` autoincrement, `uuid()`/`cuid()`/UUIDv7); enforce uniqueness in the DB; use `Decimal` for money; use enums for fixed sets; model many-to-many explicitly when attributes exist; add `createdAt`/`updatedAt`; consider `@@index` for every FK and hot filter; avoid giant JSON blobs for relational data; name relations when multiple exist between two models.

### Q96. UUID vs autoincrement vs cuid vs ULID
Autoincrement: compact, ordered, enumerable (leaks counts). UUIDv4: unguessable, random (index fragmentation). `cuid`/`ulid`/UUIDv7: roughly time-ordered, better index locality. Prisma `@default(uuid(7))` is available in recent versions (verify). Use `BigInt` for very large tables.

### Q97. Data validation layer with Zod + Prisma
Define Zod schemas as the API contract; derive TypeScript types with `z.infer`; parse request bodies; pass parsed data to Prisma. Libraries like `zod-prisma-types` generate Zod schemas from `schema.prisma` but separate API shapes from DB models in larger apps.

### Q98. Repository / service layer
Wrap Prisma in repositories or services to avoid leaking ORM types across layers, centralize queries (`select` shapes), enable testing (mock the repository), and enforce policies (tenant filters). Don't build a heavy abstraction that only re-exports Prisma.

### Q99. Transactions across services / sagas
Database transactions don't span services or external APIs. Use the **transactional outbox** (write business data and an outbox row in one Prisma transaction; a worker publishes events), idempotent consumers, and sagas for multi-step workflows.

### Q100. Retrying transactions
```ts
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let i = 0; ; i++) {
    try { return await fn(); }
    catch (e: any) {
      const retryable = e?.code === "P2034" || e?.code === "P2028";
      if (!retryable || i >= tries - 1) throw e;
      await new Promise(r => setTimeout(r, 50 * 2 ** i + Math.random() * 25));
    }
  }
}
await withRetry(() => prisma.$transaction(async tx => { /* ... */ }, { isolationLevel: "Serializable" }));
```

### Q101. Handling `P2028` and transaction timeouts
"Transaction API error": the interactive transaction timed out or the connection closed. Reduce work in the transaction, increase `timeout`, avoid slow external calls, raise pool size/limits appropriately, and make the code idempotent for retry.

### Q102. Observability
Prisma metrics (`previewFeatures = ["metrics"]`, `prisma.$metrics.prometheus()`), tracing with OpenTelemetry, query logs with durations, pool stats (active/idle/wait), DB-side `pg_stat_statements`, alerts on slow queries and pool timeouts (`P2024`).

### Q103. Security best practices
Least-privilege DB roles (app role without DDL; migration role separate), secrets in a vault, TLS (`sslmode=require`), no raw user input in raw queries, allow-listed sort/filter fields, `omit` sensitive columns, row-level access checks in the service layer (or RLS), rate limiting, and dependency updates.

### Q104. Prisma vs Mongoose (for Mongo)
Mongoose: mature ODM with schemas, middleware, population, discriminators and rich Mongo features. Prisma on MongoDB: type-safe client, but limited (no migrations, fewer operators, replica-set transactions). For Mongo-first apps Mongoose or the native driver is usually the better fit.

### Q105. When should you NOT use Prisma?
Heavy analytic SQL, DB-specific features dominating the workload, ultra-light edge bundles where Drizzle is lighter (before Prisma 7's smaller client), existing large TypeORM/Hibernate codebases where migration cost outweighs benefits, or when the team prefers writing SQL (Kysely/Drizzle/sqlc).

---

# 🟠 Part 4: Senior (5–7 years)

### Q106. Prisma architecture (pre-7 vs 7) *(Must-know)*
Classic: `@prisma/client` (generated TypeScript) talks to the **query engine** (Rust, loaded as a native library or binary), which builds SQL, manages the pool and returns JSON. Costs: larger bundle (≈ 10-15 MB engine), platform-specific binaries, cold starts. Prisma 6.x added the Rust-free preview (`queryCompiler` + driver adapters); **Prisma 7** makes the TypeScript/WASM query compiler the default, generating smaller bundles, faster cold starts and requiring driver adapters and a `prisma.config.ts` (verify specifics for your version).

### Q107. How a Prisma query executes
1. TypeScript call → client validates/serializes into a JSON protocol request.
2. Query engine/compiler converts to a query plan, generating one or more SQL statements (batched relation loading or joins).
3. Executes with parameterized SQL via the pool/adapter.
4. Results are assembled into nested objects and returned.
Understanding this explains why `include` can issue several queries and why logging reveals the real SQL.

### Q108. Designing for read/write splitting
Use the `@prisma/extension-read-replicas` client extension: `prisma.$extends(readReplicas({ url: [...] }))` routes reads to replicas and writes to the primary; `$primary()`/`$replica()` force a target. Handle replication lag (read-your-writes) by reading from primary after writes within the same request.

### Q109. Sharding and partitioning
Prisma doesn't shard. Options: Postgres native partitioning (managed in SQL; map the parent table as a model), application-level routing across multiple clients keyed by shard, or distributed SQL (CockroachDB, Citus, Vitess/PlanetScale). Keep shard keys in every query and in primary keys.

### Q110. Large tables: batching and streaming
Process in keyset-paginated batches instead of loading everything:
```ts
let cursor: number | undefined;
for (;;) {
  const rows = await prisma.user.findMany({ take: 1000, ...(cursor && { skip: 1, cursor: { id: cursor } }), orderBy: { id: "asc" } });
  if (!rows.length) break;
  await process(rows);
  cursor = rows.at(-1)!.id;
}
```
For massive exports use database cursors/`COPY` via raw SQL or streaming drivers.

### Q111. Handling concurrency: counters, inventory, booking
Prefer atomic SQL (`decrement` with conditional `updateMany`), unique constraints (double-booking prevented by `@@unique([resourceId, slot])`), exclusion constraints in SQL (Postgres ranges), `SELECT ... FOR UPDATE SKIP LOCKED` for queues, and serializable transactions + retry for complex invariants.

### Q112. Job queue on Postgres with Prisma
```ts
const job = await prisma.$transaction(async (tx) => {
  const [j] = await tx.$queryRaw<{ id: number }[]>`
    SELECT id FROM "Job" WHERE status = 'PENDING' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1`;
  if (!j) return null;
  return tx.job.update({ where: { id: j.id }, data: { status: "RUNNING", startedAt: new Date() } });
});
```
`SKIP LOCKED` lets many workers pull distinct jobs without blocking each other.

### Q113. Caching with Prisma
Cache-aside with Redis (`031_Redis-and-Caching.md`): key by model + normalized args, invalidate on writes (tags/versions), or use Accelerate's `cacheStrategy`. Beware caching results of queries with user-specific filters under shared keys. A client extension can centralize read-through caching.

### Q114. Schema organization at scale
Prisma supports multi-file schemas (`prismaSchemaFolder`, GA in 6.x): split models by domain in `prisma/schema/*.prisma` with one `generator`/`datasource` file. Keep naming conventions, shared enums, and CODEOWNERS for schema changes.

### Q115. Monorepo setups
Share one Prisma package (`packages/db`) exporting the generated client and types; set `output`, run `prisma generate` in the build pipeline (Turborepo task dependency), and ensure each app deploys with the right `binaryTargets`. Avoid duplicating clients across packages (version drift).

### Q116. Testing strategy at scale
Pyramid: unit tests mock the repository layer; integration tests use Testcontainers Postgres with real migrations; per-test isolation via transaction rollback (tricky with Prisma: use schema-per-worker or truncate tables with `TRUNCATE ... RESTART IDENTITY CASCADE`); contract tests for queries with `EXPLAIN` assertions on hot paths; load tests for pool sizing.

### Q117. Database migrations for large teams
Branch-based schema changes cause migration conflicts (two PRs with same timestamp ordering). Practices: rebase and regenerate migration before merge, CI check `migrate diff --exit-code`, linear history, migrations reviewed by DB owners, backward-compatible changes only, feature flags for behaviour changes.

### Q118. Handling soft failures: deadlocks and serialization failures
Under concurrency you will see deadlocks (`P2034`). Reduce by ordering updates consistently (always lock rows in the same order), keeping transactions short, using appropriate indexes, and retrying with backoff. Log `e.meta` and DB logs.

### Q119. Data integrity strategy
Rely on DB constraints (FKs, uniques, checks, NOT NULL) as the last line of defence; transactions for invariants; avoid denormalization without a reconciliation plan; use `relationMode = "prisma"` only when the DB can't enforce FKs (PlanetScale), and add indexes for the emulated relations.

### Q120. Handling large JSON and file data
Store files in object storage with a URL/key in the DB. Use `Json` for semi-structured attributes you query rarely, and promote frequently filtered keys to columns or generated columns with indexes (Postgres GIN indexes on JSONB: `@@index([payload], type: Gin)`).

### Q121. PostGIS and special types
Use `Unsupported("geometry(Point,4326)")` and raw SQL for spatial queries, or keep lat/lng floats plus a GiST index created in migration SQL. Same approach for `tsvector`, `ltree`, `citext` (extension via `extensions = [citext]` in the datasource with `previewFeatures = ["postgresqlExtensions"]`).

### Q122. Handling time and money correctly
Store UTC `timestamptz`; money as integer minor units (paise/cents) or `Decimal(19,4)`; never `Float`. Use `Prisma.Decimal` for calculations and serialize as strings in APIs.

### Q123. GraphQL + Prisma
Resolvers map to `select`/`include` derived from the GraphQL selection set (libraries: Pothos Prisma plugin, Nexus, `prisma-select`/`graphql-fields`), DataLoader for non-batched relations, query depth/complexity limits, and pagination via cursors (Relay connections). Avoid exposing raw `where` inputs.

### Q124. tRPC / type sharing
With tRPC, Prisma-derived types flow end-to-end to the React client. Don't leak DB models directly: define output types with `select` to prevent exposing sensitive columns.

### Q125. Drizzle vs Prisma: the senior view
Drizzle: SQL-like, no codegen step (types inferred from TS schema), tiny runtime, great for edge, you write joins explicitly. Prisma: higher-level, consistent API, nested writes and relation loading, richer tooling (Studio, Migrate), steeper hidden-SQL awareness needed. Choose Drizzle for SQL-fluent teams/edge-first apps; Prisma for productivity and larger teams that value convention.

### Q126. TypeORM pitfalls (for comparison)
Decorator-based entities with `synchronize: true` (dangerous in prod), lazy relations and eager loading surprises, `QueryBuilder` string-based types, migrations generated from entity diff needing review, and historically slow maintenance cadence. Strengths: Data Mapper & Active Record support, mature DB coverage, familiar to Java/.NET developers.

### Q127. Sequelize pitfalls (for comparison)
Weak TypeScript support, implicit magic (`include` creating huge joins/cartesian explosions), `paranoid` soft delete conventions, manual migrations via CLI. Strengths: mature, flexible, huge community.

### Q128. Hibernate/JPA concepts that interviewers compare
First-level cache (persistence context), lazy loading, dirty checking and unit of work, `LazyInitializationException`, `@OneToMany` fetch types, `JOIN FETCH`, second-level cache, optimistic locking via `@Version`. Prisma has none of the implicit session state: every call is explicit and returns detached plain objects.

### Q129. Performance budget for data access
Per request: ≤ 3-5 DB round trips on hot paths, indexes for every filter/sort, p95 query time targets (for example < 20 ms OLTP), pool utilization < 70%, no unbounded `findMany`. Verify with query logging in tests (assert query counts) and dashboards.

### Q130. Technical debt in ORMs
Leaky abstractions: `select`-less lists, repeated include trees, model-per-table coupling to API, migrations without review, `any`-typed raw queries. Mitigate with query helpers, lint rules (ban `$queryRawUnsafe`), `strict` TS, and regular `EXPLAIN` reviews.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q131. Choosing a data access strategy for a new platform
Evaluate: team SQL skill, type-safety needs, runtime (Node server vs edge), DB features required, migration tooling, performance targets, ecosystem (NestJS/Next.js/tRPC), and vendor risk. Common outcomes: Prisma for product teams building CRUD-heavy TypeScript services; Drizzle/Kysely for edge/SQL-heavy; SQL + codegen (sqlc/TypedSQL) for performance-critical cores. Pilot with real queries and measure.

### Q132. Domain-driven design with Prisma
Treat Prisma models as persistence models, separate from domain entities/value objects. Repositories map between them; aggregates define transaction boundaries (one aggregate per transaction); domain events use the outbox. Avoid anemic code that passes Prisma types through the whole stack.

### Q133. Multi-region and global data
Single-writer primary with read replicas near users, or distributed SQL (CockroachDB, Spanner-like) with Prisma's CockroachDB provider; use Accelerate/edge-friendly drivers for latency; plan for replica lag, conflict resolution and data residency. Keep migrations compatible with rolling multi-region deploys.

### Q134. Governance of schema change
Schema as code with ownership, migration review checklist (locks, backfills, rollbacks, compatibility), automated drift detection, staging with production-sized data for migration rehearsal, and a deprecation policy for columns/enums.

### Q135. Upgrading Prisma across majors
Read the upgrade guide, pin versions, upgrade in a branch, run codemods/`prisma validate`, regenerate client, test all raw queries and extensions (breaking changes to `$use`, `Buffer` vs `Uint8Array`, `NotFoundError` removal, etc.), run integration tests, and roll out progressively. Keep `prisma` CLI and `@prisma/client` versions identical.

### Q136. Reliability: handling database outages
Timeouts and retries at the app edge, circuit breakers, graceful degradation (serve cached reads), health checks that verify DB connectivity (`SELECT 1` via `$queryRaw`), connection pool recovery, and backpressure/queueing for writes. Document RPO/RTO and test failover.

### Q137. Cost and scale planning
Estimate QPS per endpoint × queries per request, pool sizes per instance × instance count vs DB connection limits, add a pooler, scale replicas for reads, partition hot tables, archive cold data, and watch ORM-induced chattiness in cloud DB bills (per-request pricing for serverless DBs).

### Q138. Security and compliance
Encrypt in transit/at rest, field-level encryption for PII (application-level or DB extensions), audit trails, GDPR erasure (hard delete vs anonymize and cascades), least privilege roles, secret rotation, SAST for raw query misuse, and DB activity monitoring.

### Q139. Team standards for a Prisma codebase
Single shared client module; `select` by default; ban `findMany` without `take`; naming conventions with `@map`; review checklist for migrations; error-mapping layer for Prisma error codes; integration tests required for data logic; query-count assertions on critical endpoints; documented patterns for transactions and retries.

### Q140. Build vs buy for data layers
Prisma Postgres/Accelerate/Optimize reduce operations but add vendor coupling; self-managed Postgres + PgBouncer keeps control. Decide by team capacity, latency geography, compliance and exit strategy (the schema and migrations remain portable SQL).

### Q141. Migration away from an ORM (or to Prisma)
Strangler approach: introspect the existing DB (`db pull`), baseline migrations, route new features through Prisma while legacy code continues, compare query results in shadow mode, then retire the old layer. Reverse direction is easier because Prisma's migrations are plain SQL.

### Q142. Evaluating AI-assisted data access
LLM-generated queries need review: verify indexes and query plans, ban unsafe raw SQL, test on realistic data, and restrict text-to-SQL agents to read-only roles on views with row limits and timeouts.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Blog schema with relations, indexes and seed
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
}
model Post {
  id          Int        @id @default(autoincrement())
  title       String
  slug        String     @unique
  body        String
  published   Boolean    @default(false)
  publishedAt DateTime?
  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    Int
  tags        PostTag[]
  comments    Comment[]
  @@index([authorId, publishedAt(sort: Desc)])
  @@index([published, publishedAt(sort: Desc)])
}
model Tag { id Int @id @default(autoincrement()) name String @unique posts PostTag[] }
model PostTag {
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId Int
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  Int
  @@id([postId, tagId])
  @@index([tagId])
}
model Comment {
  id       Int    @id @default(autoincrement())
  text     String
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId   Int
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
  @@index([postId])
}
```
```ts
await prisma.user.create({ data: { email: "ritesh@example.com", name: "Ritesh Kumar",
  posts: { create: { title: "Hello Prisma", slug: "hello-prisma", body: "...", published: true, publishedAt: new Date(),
    tags: { create: [{ tag: { connectOrCreate: { where: { name: "orm" }, create: { name: "orm" } } } }] } } } } });
```

### H2. Paginated, filtered list endpoint (cursor)
```ts
const PAGE = 20;
export async function listPosts({ cursor, tag, q }: { cursor?: number; tag?: string; q?: string }) {
  const rows = await prisma.post.findMany({
    where: {
      published: true,
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
      ...(q && { title: { contains: q, mode: "insensitive" } }),
    },
    select: { id: true, title: true, slug: true, publishedAt: true, author: { select: { name: true } },
              _count: { select: { comments: true } } },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: PAGE + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
  });
  const hasNext = rows.length > PAGE;
  const items = hasNext ? rows.slice(0, PAGE) : rows;
  return { items, nextCursor: hasNext ? items.at(-1)!.id : null };
}
```
Fetching `take: PAGE + 1` detects the next page without a `count`.

### H3. Money transfer with an interactive transaction and retry
```ts
export async function transfer(from: number, to: number, amount: Prisma.Decimal) {
  return withRetry(() =>
    prisma.$transaction(async (tx) => {
      const debited = await tx.account.updateMany({
        where: { id: from, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      });
      if (debited.count === 0) throw new Error("Insufficient funds");
      await tx.account.update({ where: { id: to }, data: { balance: { increment: amount } } });
      await tx.ledger.create({ data: { fromId: from, toId: to, amount } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10_000 })
  );
}
```
(`withRetry` from the Mid-level section.) The conditional `updateMany` prevents overdrafts atomically.

### H4. Global error handler mapping Prisma errors (Express)
```ts
import { Prisma } from "@prisma/client";
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": return res.status(409).json({ error: "Already exists", fields: err.meta?.target });
      case "P2025": return res.status(404).json({ error: "Not found" });
      case "P2003": return res.status(400).json({ error: "Invalid reference" });
      case "P2024": return res.status(503).json({ error: "Database busy, try again" });
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) return res.status(400).json({ error: "Invalid query input" });
  console.error(err);
  res.status(500).json({ error: "Internal error" });
}
```

### H5. Client extension for multi-tenancy
```ts
export const tenantClient = (tenantId: string) =>
  prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          const a = args as any;
          if (["findMany", "findFirst", "count", "updateMany", "deleteMany", "aggregate"].includes(operation)) a.where = { ...a.where, tenantId };
          if (operation === "create") a.data = { ...a.data, tenantId };
          if (operation === "createMany") a.data = [].concat(a.data).map((d: any) => ({ ...d, tenantId }));
          return query(a);
        },
      },
    },
  });
```
Caveats: `findUnique`/`update`/`delete` need compound unique `{ id, tenantId }` or prior verification; raw queries bypass it. Combine with Postgres RLS for defense in depth.

### H6. Repository with `select` shapes and tests
```ts
const userPublic = { id: true, name: true, email: true } satisfies Prisma.UserSelect;
export const userRepo = {
  byId: (id: number) => prisma.user.findUnique({ where: { id }, select: userPublic }),
  search: (q: string, take = 20) => prisma.user.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: userPublic, take }),
};
```
```ts
// unit test with a mock
import { mockDeep } from "jest-mock-extended";
const prismaMock = mockDeep<PrismaClient>();
prismaMock.user.findUnique.mockResolvedValue({ id: 1, name: "Ritesh Kumar", email: "r@x.com" } as any);
```

### H7. Integration test with Testcontainers
```ts
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
let container, prisma: PrismaClient;
beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16").start();
  process.env.DATABASE_URL = container.getConnectionUri();
  execSync("npx prisma migrate deploy", { env: process.env, stdio: "inherit" });
  prisma = new PrismaClient();
}, 60_000);
afterEach(async () => { await prisma.$executeRawUnsafe(`TRUNCATE "User", "Post" RESTART IDENTITY CASCADE`); });
afterAll(async () => { await prisma.$disconnect(); await container.stop(); });
```
(`$executeRawUnsafe` is fine here: static SQL with no user input.)

### H8. Fix an N+1 and prove it with logging
```ts
let count = 0;
const p = new PrismaClient({ log: [{ emit: "event", level: "query" }] });
p.$on("query", () => count++);
await listUsersWithPostsBad(p);   // count = 1 + N
count = 0;
await p.user.findMany({ select: { id: true, posts: { select: { id: true, title: true } } } });   // count = 2 (or 1 with join strategy)
```
Turn it into a test asserting query counts on hot endpoints.

### H9. Soft delete extension with restore
```ts
export const soft = prisma.$extends({
  model: { $allModels: {
    async softDelete<T>(this: T, where: any) { return (this as any).update({ where, data: { deletedAt: new Date() } }); },
    async restore<T>(this: T, where: any)    { return (this as any).update({ where, data: { deletedAt: null } }); },
  } },
  query: { $allModels: {
    async findMany({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args); },
    async findFirst({ args, query }) { args.where = { deletedAt: null, ...args.where }; return query(args); },
  } },
});
```

### H10. Safe production migration script
```bash
# CI/CD deploy job
npx prisma migrate status || true
npx prisma migrate deploy            # applies only pending migrations, never resets
npx prisma generate
```
Pre-deploy checklist: backup/snapshot, migration reviewed for locks, tested on production-size data, feature flag for dependent code, rollback plan (forward fix migration).

### H11. Raw SQL report with TypedSQL
```sql
-- prisma/sql/topCustomers.sql
-- @param {Int} $1:limit
SELECT u.id, u.name, SUM(o.amount) AS total
FROM "User" u JOIN "Order" o ON o."userId" = u.id
GROUP BY u.id ORDER BY total DESC LIMIT $1
```
```ts
import { topCustomers } from "@prisma/client/sql";
const rows = await prisma.$queryRawTyped(topCustomers(10));
```

### H12. Read replicas
```ts
import { readReplicas } from "@prisma/extension-read-replicas";
const db = new PrismaClient().$extends(readReplicas({ url: [process.env.REPLICA_1!, process.env.REPLICA_2!] }));
await db.user.findMany();                  // replica
await db.user.create({ data: { ... } });   // primary
await db.$primary().user.findUnique({ where: { id } });   // read-your-write
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `P2002 Unique constraint failed on the fields: (email)`
Duplicate insert or concurrent "check then insert" race. Use `upsert`, catch `P2002` → 409, add idempotency keys, and check for duplicate seed runs.

### D2. `P2025 An operation failed because it depends on one or more records that were required but not found`
`update`/`delete` where the record doesn't exist (or a connected record is missing). Use `updateMany` when "not found" is acceptable, or map to 404.

### D3. `P2003 Foreign key constraint failed`
Inserting a child with a non-existent parent id, or deleting a parent with children and `Restrict`. Fix ordering, use `connect`, set `onDelete` appropriately.

### D4. `P1001 Can't reach database server`
Wrong host/port, DB down, firewall/security group, SSL requirements, Docker networking (`localhost` vs service name), IP allow list on managed DBs.

### D5. `P2024 Timed out fetching a new connection from the connection pool`
Pool exhausted by slow queries, leaked long transactions, too many parallel requests, or a pool too small. Increase `connection_limit`, shorten transactions, fix N+1/slow queries, add pooling infrastructure.

### D6. `Too many connections` (`53300` / `remaining connection slots are reserved`)
Multiple Prisma clients (hot reload), many serverless instances, or instances × pool size > DB limit. Use the singleton pattern, PgBouncer/Accelerate/RDS Proxy, `connection_limit=1` in serverless.

### D7. `Environment variable not found: DATABASE_URL`
`.env` missing or not loaded in that environment (Docker, CI, Vercel), wrong working directory when running the CLI, or using a monorepo path. Set env vars in the deploy environment; use `dotenv-cli` or `--schema` path flags.

### D8. `The table does not exist` / client out of date after pulling code
Migrations weren't applied (`migrate deploy`) or the client wasn't regenerated (`prisma generate`). Add generation to `postinstall` and CI.

### D9. Drift detected / `migrate dev` wants to reset the database
The dev DB differs from migration history (manual changes, edited migration). For dev: `migrate reset`. For shared/prod: investigate with `migrate diff`, then baseline or write a corrective migration. Never reset production.

### D10. Prisma works locally but fails on AWS Lambda/Docker Alpine
Missing binary target (`linux-musl-openssl-3.0.x`, `rhel-openssl-3.0.x`), OpenSSL not installed in Alpine, or the engine file not bundled. Set `binaryTargets`, install `openssl`, include the engine in the bundle (or use driver adapters/Prisma 7).

### D11. `Invalid prisma.user.findMany() invocation` validation errors
Type/shape mismatch (passing `undefined` vs `null` semantics, wrong field name, missing required field). Remember `undefined` means "ignore this filter" while `null` means SQL `IS NULL`, a classic cause of accidentally returning all rows.

### D12. A `where: { id: undefined }` update affects the wrong rows
With `updateMany`/`deleteMany`/`findMany`, an `undefined` filter is dropped, so the query matches **everything**. Validate inputs (throw if `id` is undefined) and prefer unique-field methods (`update`/`delete`) which require a defined unique value.

### D13. BigInt serialization error: `Do not know how to serialize a BigInt`
Convert to string/number in the API layer, use a replacer in `JSON.stringify`, or define `BigInt.prototype.toJSON`.

### D14. Slow `findMany` with `contains`
`LIKE '%term%'` can't use a B-tree index. Use trigram GIN index (`pg_trgm`) via migration SQL, Postgres FTS, or a search engine (`032_Elasticsearch.md`).

### D15. Transaction timeout `P2028`
Interactive transaction exceeded `timeout` or lost its connection. Remove external calls from the transaction, batch work, increase timeout cautiously, make the operation idempotent and retry.

---

# 🧩 Part 8: Tricky Questions

### T1. Is Prisma an Active Record or Data Mapper ORM?
Neither in the classic sense: results are plain objects with no identity map, no change tracking and no unit of work. It's a typed query client with a declarative schema.

### T2. Does `include` always do a SQL JOIN?
No. By default Prisma issues separate batched queries and stitches results. With `relationLoadStrategy: "join"` (or `relationJoins`) it uses a single query with lateral joins/JSON aggregation on supported databases.

### T3. What is the difference between `undefined` and `null` in a Prisma filter?
`undefined` means "do nothing / ignore this field"; `null` means "match SQL NULL" (or set to NULL). Confusing them can broadcast updates/deletes to all rows.

### T4. Does Prisma create indexes on foreign keys?
Not for PostgreSQL (the DB doesn't create them either); MySQL/InnoDB does. Add `@@index` on FK columns.

### T5. Are nested writes atomic?
Yes: a single `create`/`update` with nested relation operations runs in one implicit transaction.

### T6. Is `findMany` without `take` safe?
No. It loads the entire table into memory. Always paginate or stream.

### T7. Does `@updatedAt` work with raw SQL?
No. It's applied by Prisma Client at write time, not by a DB trigger. Raw `UPDATE`s leave it unchanged unless you set it.

### T8. Can `migrate dev` be used in production?
No. It can prompt to reset and requires a shadow DB. Use `migrate deploy`.

### T9. What does `prisma db push` do and why not use it in production?
It syncs schema to DB without migration history and may drop data to make the schema match. Good for prototypes, not for controlled releases.

### T10. Is `count()` cheap?
Not on large tables: `COUNT(*)` scans an index or the table (Postgres MVCC). Cache or approximate when totals are not critical.

### T11. Does Prisma prevent SQL injection entirely?
Normal API calls and tagged `$queryRaw` are parameterized; `$queryRawUnsafe`, string-built identifiers (dynamic `orderBy`/table names) and trusting arbitrary filter objects can still be exploited.

### T12. Why can two simultaneous `upsert` calls throw `P2002`?
If the upsert can't be compiled to native `ON CONFLICT`, Prisma performs find-then-create/update; a race lets both try to create. Retry on `P2002` or ensure native upsert conditions.

### T13. Implicit many-to-many vs explicit: which is better?
Implicit is shorter but inflexible (no extra columns, harder migrations). Explicit gives control (extra fields, indexes, direct queries). Prefer explicit unless the relation is trivial.

### T14. Does Prisma support lazy loading?
No. You must request relations explicitly (`include`/`select`); accessing an unrequested relation is a type error. This prevents hidden N+1.

### T15. Is Prisma slower than raw SQL?
Slight overhead for query building and result mapping (and a Rust engine hop pre-7); usually negligible compared to network/DB time. Bad access patterns (N+1, over-fetching) cost far more than the ORM itself.

### T16. Can one PrismaClient talk to multiple databases?
No. One datasource per schema; use multiple clients (separate schemas/outputs) or multi-schema support within one Postgres database.

### T17. Why is the Prisma client generated, and why must I re-run `generate`?
Types and the query API are generated from your schema; if the schema changes and you don't regenerate, code and types are stale (runtime errors for missing fields).

### T18. Does a `Float` field work for money?
Technically, but you'll hit binary rounding errors. Use `Decimal` or integer minor units.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Schema file?** `schema.prisma`.
- **Generate client?** `prisma generate`.
- **Dev migration?** `prisma migrate dev`.
- **Prod migration?** `prisma migrate deploy`.
- **Prototype sync?** `prisma db push`.
- **Introspect DB?** `prisma db pull`.
- **GUI?** `prisma studio`.
- **Get one by unique?** `findUnique`.
- **Return only some fields?** `select` (or `omit`).
- **Load relations?** `include`.
- **Bulk insert?** `createMany`.
- **Atomic increment?** `{ increment: 1 }`.
- **Transaction (batch)?** `$transaction([...])`.
- **Transaction (interactive)?** `$transaction(async tx => ...)`.
- **Raw query (safe)?** `$queryRaw` tagged template.
- **Unique violation code?** P2002.
- **Record not found code?** P2025.
- **FK violation code?** P2003.
- **Pool timeout code?** P2024.
- **Pagination for scale?** Cursor-based.
- **N+1 fix?** `include`/`select`, join strategy, DataLoader.
- **Soft delete?** Client extension or filters.
- **Serverless pooling?** PgBouncer / Accelerate / adapters.
- **Alpine Docker needs?** `binaryTargets` + OpenSSL.
- **Money type?** `Decimal`.
- **Singleton client?** `globalThis` pattern.
- **Alternatives?** Drizzle, TypeORM, Sequelize, Kysely, Knex, MikroORM.
- **ODM for Mongo?** Mongoose.
- **Baseline existing DB?** `migrate diff` + `migrate resolve --applied`.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a project where you used Prisma.
STAR: "I built the data layer for a SaaS invoicing API in TypeScript with Prisma and PostgreSQL. I modelled tenants, invoices and line items, enforced tenant isolation through a client extension plus RLS, used explicit join tables, and cursor pagination. CI ran `migrate deploy` against Testcontainers and production. We cut data-layer bugs by about 40% after type-safe queries replaced hand-written SQL strings."

### P2. Describe a performance issue you fixed.
"A dashboard endpoint triggered 1,200 queries (N+1 through nested loops). Query logging showed it; I replaced loops with a `select`-based nested read and a raw SQL aggregate for totals, added a composite index, and capped the page size. Latency dropped from 4.2 s to 180 ms and DB CPU from 70% to 25%."

### P3. How did you roll out a risky migration?
"Renaming a column on a 50M-row table: expand/contract. Added the new column, dual-wrote in code, backfilled in batches of 10k with throttling, switched reads behind a flag, then dropped the old column two releases later. I edited the generated SQL to avoid a drop/add and created indexes concurrently."

### P4. How do you handle connection issues in serverless?
"Lambda spikes exhausted Postgres connections. I set `connection_limit=1`, moved to RDS Proxy, kept one client per container, and added alerts on connection counts. Errors disappeared and p99 stabilized."

### P5. Why Prisma instead of TypeORM/Sequelize/Drizzle?
"We valued end-to-end type safety, a clear schema, and good migrations for a team of mixed seniority. We accepted that complex reports would use raw SQL/TypedSQL. For an edge service we evaluated Drizzle because of bundle size."

### P6. How do you test data-access code?
"Unit tests mock the repository; integration tests run against real Postgres in containers using real migrations; hot endpoints assert query counts; a nightly job runs `EXPLAIN` checks for key queries."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **ORM fundamentals:** mapping, Active Record vs Data Mapper, identity map, unit of work, lazy vs eager loading, N+1, query builders vs ORMs.
- **Prisma schema:** models, scalars, native types, enums, attributes, relations (1:1, 1:n, m:n, self), referential actions, indexes, composite keys, multi-schema, views.
- **Prisma Client:** CRUD, filters, relation filters, nested writes, select/include/omit, pagination, aggregations, groupBy, raw queries, TypedSQL, extensions, middleware history.
- **Transactions and concurrency:** batch/interactive, isolation levels, optimistic/pessimistic locking, retries, deadlocks, idempotency, outbox.
- **Migrations:** `migrate dev/deploy/reset/resolve/diff`, shadow DB, drift, baselining, expand/contract, CI/CD.
- **Operations:** pooling, serverless, PgBouncer, Accelerate, adapters, read replicas, observability, logging, tracing, metrics.
- **Security:** injection, mass assignment, least privilege, multi-tenancy, RLS, PII.
- **Ecosystem:** Express, NestJS, Next.js, tRPC, GraphQL, Zod, Testcontainers, Drizzle, TypeORM, Sequelize, Kysely, Mongoose.

## Mixed topics
- Prisma + PostgreSQL features (JSONB, GIN, extensions, partitions, RLS).
- Prisma + Redis: caching and rate limiting (`031_Redis-and-Caching.md`).
- Prisma + Elasticsearch: outbox/CDC sync (`032_Elasticsearch.md`).
- Prisma + MongoDB: limitations and Mongoose comparison (`030_MongoDB.md`).
- Prisma + Docker/Kubernetes: migration jobs, binary targets, health checks.
- Prisma + Next.js/React Server Components: singleton client, edge adapters.
- Prisma + AI apps: pgvector via raw SQL, storing embeddings, metadata filters.

---

# 🔬 Part 12: Prisma & ORM Internals

### I1. Prisma schema → DMMF → generated client
The schema is parsed into an AST and a **DMMF** (Data Model Meta Format). The generator emits TypeScript types and a client that serializes operations into the engine's JSON protocol.

### I2. Query engine responsibilities
Validates requests, builds a query graph (including nested writes and transaction handling), generates SQL for the target connector, manages connection pooling, executes, and maps rows to nested JSON. In Prisma 7 the query compilation moves to a TypeScript/WASM compiler with execution via driver adapters.

### I3. Relation loading algorithms
`query` strategy: fetch parents, collect keys, run `WHERE fk IN (...)` for each relation level, join in memory. `join` strategy: a single SQL using `LEFT JOIN LATERAL` + JSON aggregation (Postgres) or correlated subqueries (MySQL).

### I4. Transaction protocol
Batch transactions send all operations in one request, run in a single DB transaction. Interactive transactions open a transaction on a dedicated connection with a transaction id; each `tx.*` call routes to that connection until commit/rollback or timeout.

### I5. Migrate internals
Migrations are SQL files in order; `_prisma_migrations` table stores name, checksum, timestamps and logs. `migrate dev` uses a shadow DB to compute the diff between migration history and schema; `migrate deploy` just runs unapplied files after verifying checksums.

### I6. Identity map and unit of work (contrast)
Hibernate/TypeORM track entities in a persistence context; modifications are flushed on commit. Prisma has no such state: every operation is an explicit SQL round trip, so it is predictable but requires explicit batching.

### I7. Prepared statements and caching
Drivers use prepared statements; PgBouncer transaction mode breaks named prepared statements (hence `pgbouncer=true`). The engine caches query plans/compiled queries by shape.

### I8. Type generation details
`Prisma.UserGetPayload<...>`, `UserCreateInput` vs `UserUncheckedCreateInput` (relation scalar FKs vs nested `connect`), `XOR` types ensure either checked or unchecked inputs, not both.

---

# 📊 Part 13: Reference Tables

### CLI commands
| Command | When | Notes |
|---|---|---|
| `prisma init` | New project | Creates schema and `.env` |
| `prisma generate` | After schema change / install | Regenerates the client |
| `prisma migrate dev` | Local dev | Creates + applies migrations, may reset |
| `prisma migrate deploy` | CI / prod | Applies pending migrations only |
| `prisma migrate reset` | Local dev | Drops DB, reapplies, seeds |
| `prisma migrate status` | CI / debugging | Shows pending/failed |
| `prisma migrate resolve` | Fix failed/baseline | `--applied` / `--rolled-back` |
| `prisma migrate diff` | Baselines / drift | Compare any two sources |
| `prisma db push` | Prototyping | No migration files |
| `prisma db pull` | Existing DB | Introspection |
| `prisma db seed` | Seed data | Uses `prisma.seed` config |
| `prisma studio` | Inspect data | Local GUI |
| `prisma validate` / `format` | Lint schema | In CI |

### Common error codes
| Code | Meaning |
|---|---|
| P1001 | Can't reach database |
| P1008 | Operation timed out |
| P2000 | Value too long for column |
| P2002 | Unique constraint failed |
| P2003 | Foreign key constraint failed |
| P2014 | Relation violation (required relation would be broken) |
| P2024 | Pool timeout |
| P2025 | Record not found |
| P2028 | Transaction API error |
| P2034 | Write conflict / deadlock (retry) |

### ORM comparison
| | Prisma | TypeORM | Sequelize | Drizzle | Kysely |
|---|---|---|---|---|---|
| Style | Schema DSL + client | Decorators | Models | SQL-like TS | Typed query builder |
| Types | Generated | Decorator-based | Weak | Inferred | Inferred from DB types |
| Relations | First-class | First-class | First-class | Relational API + joins | Manual joins |
| Migrations | Built-in | Built-in | CLI | drizzle-kit | External |
| Edge-friendly | v7 / adapters | Poor | Poor | Excellent | Good |

### Referential actions
| Action | On parent delete |
|---|---|
| Cascade | Delete children |
| Restrict | Block deletion |
| NoAction | Block (checked at end of statement in some DBs) |
| SetNull | Child FK set to NULL (needs optional FK) |
| SetDefault | Child FK set to default |

### Pagination methods
| Method | Pros | Cons |
|---|---|---|
| `skip/take` | Simple, jump to page N | Slow at depth, unstable under writes |
| Cursor | Fast, stable | No random page jump; needs unique ordered key |

### Version highlights (verify)
| Version | Highlights |
|---|---|
| 4.x | Interactive transactions GA, extensions preview |
| 5.0 | Performance improvements, `$extends` GA, `NotFoundError` removed |
| 5.x | `relationJoins` preview (5.8), `omit` (5.16), `createManyAndReturn` (5.14), TypedSQL (5.19) |
| 6.x | Multi-file schemas GA, ESM/Rust-free previews, `queryCompiler` |
| 7.x | Rust-free default client, `prisma.config.ts`, driver adapters standard |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```ts
const u = await prisma.user.findUnique({ where: { id: 999 } });
console.log(u);
```
**Output:** `null` (use `findUniqueOrThrow` to get a `P2025` error).

### O2.
```ts
await prisma.user.update({ where: { id: 999 }, data: { name: "x" } });
```
**Output:** throws `PrismaClientKnownRequestError` with code **P2025** (record to update not found).

### O3.
```ts
const r = await prisma.user.updateMany({ where: { role: "GHOST" as any }, data: { name: "x" } });
console.log(r);
```
**Output:** `{ count: 0 }` when no rows match (no error); an invalid enum value would fail validation first.

### O4.
```ts
const id: number | undefined = undefined;
const r = await prisma.user.deleteMany({ where: { id } });
```
**Result:** deletes **all** users (an `undefined` filter is ignored). Always validate `id`.

### O5.
```ts
await prisma.user.create({ data: { email: "a@x.com" } });
await prisma.user.create({ data: { email: "a@x.com" } });
```
**Result:** second call throws **P2002**; `err.meta.target` contains `['email']` (or the constraint name).

### O6.
```ts
const users = await prisma.user.findMany({ include: { posts: true } });
```
**Queries logged (default strategy):** 2 — `SELECT ... FROM "User"` and `SELECT ... FROM "Post" WHERE "authorId" IN (...)`.

### O7.
```ts
const [a, b] = await prisma.$transaction([
  prisma.account.update({ where: { id: 1 }, data: { balance: { decrement: 50 } } }),
  prisma.account.update({ where: { id: 999 }, data: { balance: { increment: 50 } } }),
]);
```
**Result:** the second update fails (P2025) → the whole transaction rolls back; account 1 keeps its original balance.

### O8.
```ts
await prisma.post.findMany({ skip: 5, take: 3, orderBy: { id: "asc" } });
```
**Result:** rows 6-8 by id (skip the first five, take three).

### O9.
```ts
const g = await prisma.order.groupBy({ by: ["userId"], _sum: { amount: true } });
```
**Result:** array like `[{ userId: 1, _sum: { amount: Decimal('200.00') } }, ...]`; `Decimal` objects, not numbers.

### O10.
```ts
const row = await prisma.$queryRaw`SELECT COUNT(*) AS c FROM "User"`;
console.log(row);
```
**Output (Postgres):** `[ { c: 42n } ]` — `COUNT` returns a **BigInt**; cast in SQL (`COUNT(*)::int`) or convert before JSON serialization.

### O11.
```ts
await prisma.product.update({ where: { id: 1 }, data: { stock: { decrement: 1 } } });  // run 100 times concurrently, stock starts at 100
```
**Result:** final stock is `0` (atomic SQL decrement); a read-modify-write in JS would lose updates.

### O12.
```ts
prisma.user.findMany({ where: { name: undefined } })   // vs { name: null }
```
**Result:** the first returns all users (filter ignored); the second returns users whose `name IS NULL`.

---

# ✅ Part 15: MCQs

**1. Which command applies pending migrations in production?**
A) `migrate dev`  B) `migrate deploy`  C) `db push`  D) `migrate reset`
**Answer: B**

**2. `findUnique` can filter on:**
A) Any field  B) Unique or ID fields  C) Only relations  D) Only enums
**Answer: B**

**3. Prisma error code for a unique constraint violation:**
A) P2025  B) P2003  C) P2002  D) P1001
**Answer: C**

**4. Best way to avoid N+1 in Prisma:**
A) Loop with `findMany`  B) `include`/`select` nested relations (or join strategy)  C) Use `$queryRawUnsafe`  D) Disable logging
**Answer: B**

**5. Where is Prisma Client generated from?**
A) The database only  B) `schema.prisma`  C) `.env`  D) `package.json`
**Answer: B**

**6. In a filter, `undefined` means:**
A) SQL NULL  B) Ignore the condition  C) Throw  D) Empty string
**Answer: B**

**7. Which is the safe raw query form?**
A) `$queryRawUnsafe` with string concat  B) `$queryRaw` tagged template  C) Template string passed to `$executeRawUnsafe`  D) `eval`
**Answer: B**

**8. Which type should store money in Prisma?**
A) `Float`  B) `Decimal`  C) `Json`  D) `DateTime`
**Answer: B**

**9. Interactive transactions are created with:**
A) `$transaction([ ... ])`  B) `$transaction(async (tx) => ...)`  C) `$begin()`  D) `$lock()`
**Answer: B**

**10. Pool exhaustion error:**
A) P2002  B) P2024  C) P2025  D) P2003
**Answer: B**

**11. For serverless connection limits, a good option is:**
A) One client per request  B) Pooler (PgBouncer/Accelerate/RDS Proxy)  C) Disable pooling  D) Larger `connection_limit` per function
**Answer: B**

**12. Which strategy scales best for deep pagination?**
A) `skip` large  B) Cursor-based  C) `count` first  D) Random order
**Answer: B**

**13. `prisma db push` is best for:**
A) Production deploys  B) Prototyping without migration files  C) Rollbacks  D) Seeding
**Answer: B**

**14. `@updatedAt` is maintained by:**
A) A DB trigger  B) Prisma Client at write time  C) The shadow database  D) Prisma Studio
**Answer: B**

**15. Implicit many-to-many relations:**
A) Allow extra columns on the join table  B) Use a hidden join table without extra columns  C) Require raw SQL  D) Only work in MongoDB
**Answer: B**

**16. Which pattern separates domain logic from persistence?**
A) Active Record  B) Data Mapper / Repository  C) Singleton  D) Observer
**Answer: B**

**17. A deadlock/write conflict in a transaction is surfaced as:**
A) P2034  B) P2000  C) P1001  D) P2014
**Answer: A**

**18. Which tool replaces Prisma `$use` middleware?**
A) Client extensions (`$extends`)  B) Studio  C) `db pull`  D) Accelerate only
**Answer: A**

**19. Why add `@@index` on FK columns in PostgreSQL?**
A) Postgres doesn't auto-index FKs; indexes speed joins/filters/cascades  B) Required by Prisma  C) Prevents SQL injection  D) Enables migrations
**Answer: A**

**20. What does `relationLoadStrategy: "join"` do?**
A) Loads relations with a single DB-level join query  B) Disables relations  C) Turns off transactions  D) Forces raw SQL
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **Creating a new `PrismaClient` per request** or on every hot reload.
2. **Using `migrate dev` / `db push` against production.**
3. **`findMany` without `take`.**
4. **N+1 loops** and `include` trees that over-fetch.
5. **Passing `req.body` straight to `create`/`update`** (mass assignment).
6. **Passing `undefined` in `where`** and broadcasting updates/deletes.
7. **Missing indexes on foreign keys and filters.**
8. **Using `Float` for money.**
9. **`$queryRawUnsafe` with user input.**
10. **Long interactive transactions with external calls.**
11. **No retry on `P2034` (deadlocks/serialization failures).**
12. **Editing applied migration files.**
13. **Renaming columns via drop/add** (data loss).
14. **Forgetting `prisma generate` in CI/Docker**; missing `binaryTargets`.
15. **Ignoring connection limits** in serverless/multi-instance deployments.
16. **Offset pagination on huge tables** and `count` on every request.
17. **Leaking DB models/sensitive fields directly in API responses.**
18. **Implicit many-to-many when extra attributes will be needed.**
19. **No tests against a real database.**
20. **Soft delete implemented inconsistently** (aggregates, uniques, cascades).
21. **Serializing `BigInt`/`Decimal` incorrectly.**
22. **Version mismatch between `prisma` CLI and `@prisma/client`.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You think in **SQL first** and use Prisma knowing the queries it generates (logging, `EXPLAIN`).
- You spot and fix **N+1**, over-fetching and missing indexes, and assert query counts in tests.
- You design schemas with constraints, explicit join tables and sensible keys.
- You run **safe migrations** (expand/contract, concurrent indexes, `migrate deploy`, baselining) and never edit history.
- You handle **transactions and concurrency** correctly: atomic updates, isolation levels, retries, `SKIP LOCKED`, idempotency, outbox.
- You manage **connections** for serverless and scaled deployments (poolers, adapters, limits).
- You protect against **injection and mass assignment** and use least-privilege roles and tenancy isolation.
- You know when to drop to **raw SQL/TypedSQL/Kysely** and compare ORMs honestly (Prisma, Drizzle, TypeORM, Sequelize).
- You separate persistence from domain/API models and map Prisma errors cleanly.
- You bring numbers: query counts, p95 latency, pool utilization, migration durations.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands
```bash
npx prisma init            npx prisma validate        npx prisma format
npx prisma migrate dev --name <name>                   npx prisma migrate deploy
npx prisma migrate status  npx prisma migrate reset    npx prisma generate
npx prisma db pull         npx prisma db push          npx prisma db seed
npx prisma studio
```

### Client cheat sheet
```ts
prisma.model.findUnique({ where, select|include })     prisma.model.findMany({ where, orderBy, take, skip, cursor })
prisma.model.create({ data })      prisma.model.createMany({ data, skipDuplicates })
prisma.model.update({ where, data })   prisma.model.upsert({ where, update, create })
prisma.model.delete({ where })     prisma.model.count({ where })     prisma.model.aggregate/groupBy
prisma.$transaction([...]) | prisma.$transaction(async tx => {...})
prisma.$queryRaw`...`  prisma.$executeRaw`...`
```

### Schema checklist
Explicit `@relation` + `onDelete` • `@@index` on FKs and hot filters • `@@unique` for business keys • `Decimal` for money • `@db.Timestamptz` for time zones • `@map/@@map` naming • enums for fixed sets • `createdAt/updatedAt`.

### Production checklist
One client per process • connection limits vs DB max • poolers for serverless • `migrate deploy` in CI/CD • backups before migrations • query logging/metrics • error code mapping (P2002/P2025/P2034) • retries for transactions • allow-listed sorting • `select` public fields only • tests on real DB.

### Pattern quick picks
Pagination → cursor • Counters → atomic `increment` • Inventory → conditional `updateMany` • Queue → `FOR UPDATE SKIP LOCKED` • Multi-tenant → extension + RLS • Reports → TypedSQL/raw • Caching → Redis/Accelerate • Edge → adapters/Prisma 7 or Drizzle.

### Interview strategy
1. Clarify entities, relations, read/write patterns and scale.
2. Sketch the Prisma schema (keys, relations, indexes).
3. Show the key queries (`select`, pagination, transaction) and the SQL they imply.
4. Discuss N+1, indexes, connection pooling and migrations.
5. Cover concurrency, security (injection, mass assignment, tenancy) and testing.
6. Close with a measured result (query count, latency, incident fixed).

### Final checklist before the interview
- [ ] Explain what an ORM is, Active Record vs Data Mapper, and Prisma's position.
- [ ] Write a schema with 1:n, m:n (explicit), indexes and referential actions.
- [ ] Do CRUD, nested writes, `select` vs `include`, filtering, cursor pagination.
- [ ] Explain and fix N+1; know relationLoadStrategy.
- [ ] Use transactions (batch vs interactive), isolation levels, retries, optimistic locking.
- [ ] Describe `migrate dev` vs `deploy`, shadow DB, drift, baselining, expand/contract.
- [ ] Handle connection pooling in serverless (PgBouncer/Accelerate/adapters).
- [ ] Map Prisma error codes; prevent injection and mass assignment.
- [ ] Compare Prisma vs Drizzle vs TypeORM vs Sequelize vs Kysely.
- [ ] Prepare a performance story and a migration story with numbers.
