# PostgreSQL Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **PostgreSQL 15, 16 and 17**, with notes on 18 where marked "verify". Features that matter in interviews are tagged with the version: `MERGE` (15), `SECURITY INVOKER` views (15), logical replication from standbys and `pg_stat_io` (16), `JSON_TABLE`, `MERGE ... RETURNING` and incremental `pg_basebackup` (17), `INCLUDE` indexes (11), instant `ADD COLUMN ... DEFAULT` (11), declarative partitioning (10+), generated columns (12), CTE inlining (12), `GENERATED ... AS IDENTITY` (10), `SKIP LOCKED` (9.5), `UUIDv7`, virtual generated columns and asynchronous I/O (18, verify in the release notes). Verify exact behavior in the official docs (postgresql.org/docs) for your major version. Examples use the sample name **Ritesh Kumar**.
> General SQL (joins, windows, normalization) is covered in `026_SQL.md` and MySQL specifics in `027_MySQL.md`. This file focuses on **PostgreSQL specifics**: architecture, MVCC and vacuum, WAL, data types (JSONB, arrays, ranges), index types, query planning, concurrency and locking, partitioning, replication and HA, backup/PITR, security, extensions, operations and tuning.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Queries](#-part-6-hands-on-tasks--queries)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Topics + Mixed)](#-part-11-complete-coverage-topics--mixed)
- [Part 12: PostgreSQL Internals](#-part-12-postgresql-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is PostgreSQL?
An open-source, object-relational database system with a strong focus on standards compliance, extensibility and reliability. It began as POSTGRES at UC Berkeley (1986) and has been developed by a global community since 1996 under the permissive **PostgreSQL License**. It supports ACID transactions, MVCC, rich SQL, JSON, full-text search, extensions and many index types. Common managed offerings: Amazon RDS/Aurora PostgreSQL, Google Cloud SQL/AlloyDB, Azure Database for PostgreSQL, Supabase, Neon, Crunchy Bridge.

### Q2. Why do teams choose PostgreSQL?
Correctness (strict typing, constraints, transactional DDL), advanced SQL (CTEs, window functions, `LATERAL`), rich data types (JSONB, arrays, ranges, UUID, network types, geometric), extensibility (PostGIS, pgvector, TimescaleDB, Citus), strong concurrency through MVCC, and a mature ecosystem. It is often the default choice for new applications.

### Q3. PostgreSQL vs MySQL (quick comparison)
| | PostgreSQL | MySQL (InnoDB) |
|---|---|---|
| Table storage | heap + separate indexes | clustered by primary key |
| MVCC | old versions in the table; needs VACUUM | undo logs; purge threads |
| DDL in transactions | yes (transactional DDL) | implicit commit (atomic but not rollbackable) |
| Types | arrays, ranges, JSONB, enums, custom types | fewer built-ins |
| Extensions | very rich | limited plugins |
| Connections | process per connection | thread per connection |
| Standards | strict | lenient historically |

### Q4. Connecting with `psql` and essential meta-commands
```bash
psql -h localhost -U app -d shop
```
```
\l           list databases        \c shop      connect
\dt          list tables           \dt+         with sizes
\d customers describe table        \di          indexes
\dn          schemas               \du          roles
\df          functions             \dx          extensions
\x           expanded output       \timing      show query time
\i file.sql  run file              \copy        client-side COPY
\watch 2     repeat last query     \q           quit
```

### Q5. Create database, schema and table
```sql
CREATE DATABASE shop ENCODING 'UTF8';
\c shop
CREATE SCHEMA app;
CREATE TABLE app.customers (
  customer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  city        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
Use `TEXT` freely (no performance difference from `VARCHAR(n)`); use `VARCHAR(n)` only when a length limit is a real rule.

### Q6. What are schemas and `search_path`?
A schema is a namespace inside a database (like a folder for tables, functions, types). `search_path` (default `"$user", public`) decides which schemas are searched for unqualified names. Security: since PostgreSQL 15, `public` no longer grants `CREATE` to all users by default. Always schema-qualify objects in functions that run with elevated rights and set `search_path` explicitly in `SECURITY DEFINER` functions.

### Q7. Common data types
`SMALLINT`, `INTEGER`, `BIGINT`, `NUMERIC(p,s)` (exact), `REAL/DOUBLE PRECISION`, `TEXT`, `VARCHAR(n)`, `CHAR(n)` (avoid), `BOOLEAN` (a real type), `DATE`, `TIME`, `TIMESTAMP`, `TIMESTAMPTZ`, `INTERVAL`, `UUID`, `JSON`/`JSONB`, `BYTEA`, arrays (`INT[]`), range types (`tstzrange`), `ENUM`, `INET/CIDR/MACADDR`, `TSVECTOR`, geometric types, composite and domain types.

### Q8. `TIMESTAMP` vs `TIMESTAMPTZ` *(Must-know)*
Despite the name, `timestamptz` does **not** store a time zone. It stores an absolute instant (internally UTC) and converts to the session `TimeZone` setting on output and for input literals with zones. `timestamp` (without time zone) stores the literal wall-clock value with no conversion. Use `timestamptz` for events; use `timestamp` only for "local wall time" concepts (e.g. a store opening time).
```sql
SET TIME ZONE 'Asia/Kolkata';
SELECT now(), now() AT TIME ZONE 'UTC';
```

### Q9. Identity columns vs `serial`
`SERIAL` is shorthand for an integer column with a sequence default (ownership is loose). Prefer `GENERATED ALWAYS AS IDENTITY` (standard SQL; the sequence is tied to the column, can block manual inserts unless `OVERRIDING SYSTEM VALUE`). Sequences are not transactional: values are consumed even if the transaction rolls back, so gaps are normal.

### Q10. Basic CRUD with `RETURNING`
```sql
INSERT INTO app.customers (name, email) VALUES ('Ritesh Kumar', 'ritesh@example.com') RETURNING customer_id, created_at;
UPDATE app.customers SET city = 'Delhi' WHERE customer_id = 1 RETURNING *;
DELETE FROM app.customers WHERE customer_id = 1 RETURNING name;
```
`RETURNING` saves a round trip and gives generated values.

### Q11. Upsert with `ON CONFLICT` *(Must-know)*
```sql
INSERT INTO app.customers (email, name) VALUES ('ritesh@example.com', 'Ritesh Kumar')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
RETURNING *;

INSERT INTO app.customers (email, name) VALUES ('x@y.com', 'X') ON CONFLICT DO NOTHING;
```
`EXCLUDED` refers to the row proposed for insertion. A conflict target needs a unique index or constraint. `MERGE` (15+) offers the standard SQL alternative with more flexibility but weaker concurrency guarantees than `ON CONFLICT` (it can raise unique violations under concurrent inserts).

### Q12. `COPY` for bulk load/export
```sql
COPY customers (name, email) FROM '/tmp/customers.csv' WITH (FORMAT csv, HEADER true);   -- server-side file
COPY (SELECT * FROM orders WHERE order_date >= '2025-01-01') TO STDOUT WITH CSV HEADER;
\copy customers FROM 'customers.csv' CSV HEADER                                          -- client-side, psql
```
`COPY` is far faster than row-by-row `INSERT`. Server-side `COPY` needs superuser or `pg_read_server_files`.

### Q13. Constraints in PostgreSQL
`NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `EXCLUDE` (exclusion constraints, unique to PostgreSQL). Constraints can be `DEFERRABLE INITIALLY DEFERRED` (checked at commit).
```sql
CREATE EXTENSION btree_gist;
CREATE TABLE bookings (
  room_id INT, during tstzrange,
  EXCLUDE USING gist (room_id WITH =, during WITH &&)      -- no overlapping bookings per room
);
```

### Q14. NULL, `IS DISTINCT FROM`, and `NULLS NOT DISTINCT`
`a IS DISTINCT FROM b` is NULL-safe inequality. By default unique indexes allow multiple NULLs; PostgreSQL 15 adds `UNIQUE NULLS NOT DISTINCT` to treat NULLs as equal.
```sql
CREATE TABLE t (a INT, UNIQUE NULLS NOT DISTINCT (a));
```

### Q15. Transactions and DDL
```sql
BEGIN;
ALTER TABLE orders ADD COLUMN note TEXT;
CREATE INDEX idx_orders_note ON orders (note);
ROLLBACK;                    -- both DDL statements are undone
```
Transactional DDL is a key PostgreSQL strength (migrations can be all-or-nothing). Exceptions: `CREATE INDEX CONCURRENTLY`, `VACUUM`, `CREATE DATABASE` cannot run inside a transaction block.

### Q16. Default isolation level and the others
Default: `READ COMMITTED`. PostgreSQL implements three distinct levels: `READ COMMITTED`, `REPEATABLE READ` (snapshot isolation, no phantoms in practice), `SERIALIZABLE` (SSI: serializable snapshot isolation). `READ UNCOMMITTED` behaves like `READ COMMITTED` (no dirty reads in PostgreSQL).
```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
```

### Q17. Roles and privileges
Users and groups are both **roles**.
```sql
CREATE ROLE app_user LOGIN PASSWORD '***';
CREATE ROLE readonly NOLOGIN;
GRANT CONNECT ON DATABASE shop TO readonly;
GRANT USAGE ON SCHEMA app TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT ON TABLES TO readonly;   -- future tables
GRANT readonly TO app_user;
```
Remember schema `USAGE` is needed in addition to table privileges.

### Q18. `pg_hba.conf` and `postgresql.conf`
`postgresql.conf`: server settings (`shared_buffers`, `work_mem`, `max_connections`, WAL, logging). `pg_hba.conf`: host-based authentication rules (who can connect from where using which method: `scram-sha-256`, `cert`, `peer`, `md5` legacy, `trust` unsafe). Reload without restart: `SELECT pg_reload_conf();` or `pg_ctl reload`. Change settings online with `ALTER SYSTEM SET ...;` then reload; some need a restart (`shared_buffers`, `max_connections`).
```
# TYPE  DATABASE  USER      ADDRESS        METHOD
hostssl shop      app_user  10.0.0.0/16    scram-sha-256
```

### Q19. Views and materialized views
```sql
CREATE VIEW app.v_active AS SELECT * FROM app.customers WHERE city IS NOT NULL;
CREATE MATERIALIZED VIEW app.mv_daily AS SELECT date_trunc('day', created_at) d, count(*) FROM app.orders GROUP BY 1;
CREATE UNIQUE INDEX ON app.mv_daily (d);
REFRESH MATERIALIZED VIEW CONCURRENTLY app.mv_daily;      -- readers are not blocked; needs a unique index
```
Materialized views store data and do not refresh automatically; schedule refreshes (cron/pg_cron).

### Q20. Functions and procedures (PL/pgSQL)
```sql
CREATE FUNCTION add_tax(price NUMERIC) RETURNS NUMERIC
LANGUAGE sql IMMUTABLE AS $$ SELECT price * 1.18 $$;

CREATE PROCEDURE transfer(from_id INT, to_id INT, amt NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE accounts SET balance = balance - amt WHERE id = from_id;
  UPDATE accounts SET balance = balance + amt WHERE id = to_id;
  COMMIT;                     -- procedures (11+) can control transactions
END $$;
CALL transfer(1, 2, 500);
```
Function volatility: `IMMUTABLE` (same input → same output, indexable), `STABLE` (same within a statement), `VOLATILE` (default; can change anytime). Wrong volatility breaks index use or correctness.

### Q21. Triggers
```sql
CREATE FUNCTION touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER trg_touch BEFORE UPDATE ON app.customers
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```
Types: `BEFORE/AFTER/INSTEAD OF`, row-level or statement-level, `WHEN` conditions, transition tables. Event triggers react to DDL. Use sparingly; they add hidden behavior.

### Q22. Sequences and ownership
```sql
CREATE SEQUENCE invoice_no START 1000;
SELECT nextval('invoice_no'), currval('invoice_no');
SELECT setval('app.customers_customer_id_seq', (SELECT max(customer_id) FROM app.customers));   -- fix after bulk import
```
Sequence values cached with `CACHE n` per session can skip values.

### Q23. Case sensitivity and quoting
Unquoted identifiers are folded to lowercase (`CREATE TABLE Users` → `users`). Quoted identifiers (`"Users"`) are case-sensitive and must be quoted everywhere. Prefer lowercase `snake_case`. String comparison is case-sensitive by default; use `ILIKE`, `LOWER()`, `citext`, or case-insensitive ICU collations.

### Q24. Text search operators
`LIKE`/`ILIKE`, regex (`~`, `~*`, `!~`), `SIMILAR TO`, `||` concat, `position()`, `split_part()`, `regexp_replace()`, `string_agg()`, `format()` (like printf), `left()/right()`, `lpad()`.
```sql
SELECT format('Hello %s, you have %s orders', name, n) FROM ...;
SELECT string_agg(name, ', ' ORDER BY name) FROM employees;
```

### Q25. Date and time utilities
```sql
SELECT now(), current_date, current_timestamp;
SELECT date_trunc('month', now()), extract(year FROM now()), age(now(), '2000-01-01');
SELECT now() + INTERVAL '7 days', now() - INTERVAL '2 hours';
SELECT generate_series('2025-01-01'::date, '2025-01-07', '1 day');
SELECT to_char(now(), 'YYYY-MM-DD HH24:MI'), to_timestamp('2025-10-24', 'YYYY-MM-DD');
```

### Q26. `generate_series` and set-returning functions
```sql
SELECT g AS n FROM generate_series(1, 5) g;
SELECT * FROM unnest(ARRAY[1,2,3]) AS t(x);
SELECT d::date FROM generate_series('2025-01-01'::date, '2025-01-31', '1 day') d;
```
Great for calendar tables, test data (`INSERT ... SELECT ... FROM generate_series(1, 1000000)`).

### Q27. `LIMIT`, `OFFSET`, `FETCH FIRST`
```sql
SELECT * FROM orders ORDER BY order_id DESC LIMIT 10 OFFSET 20;
SELECT * FROM orders ORDER BY order_id DESC FETCH FIRST 10 ROWS ONLY;
SELECT * FROM orders ORDER BY amount DESC FETCH FIRST 3 ROWS WITH TIES;      -- includes ties (13+)
```

### Q28. `DISTINCT ON` (PostgreSQL-specific)
Keep the first row per group in a given order:
```sql
SELECT DISTINCT ON (customer_id) customer_id, order_id, order_date, amount
FROM orders
ORDER BY customer_id, order_date DESC;           -- latest order per customer
```
The `ORDER BY` must start with the `DISTINCT ON` columns. Concise and often fast with a matching index.

### Q29. `FILTER` clause and `GROUPING SETS`
```sql
SELECT count(*) FILTER (WHERE status = 'paid') AS paid,
       count(*) FILTER (WHERE status = 'cancelled') AS cancelled,
       sum(amount) FILTER (WHERE order_date >= current_date - 30) AS last_30
FROM orders;
```
`ROLLUP`, `CUBE` and `GROUPING SETS` produce subtotals.

### Q30. `LATERAL` joins
A subquery in `FROM` can reference earlier tables.
```sql
SELECT c.name, o.*
FROM customers c
CROSS JOIN LATERAL (
  SELECT order_id, amount FROM orders o WHERE o.customer_id = c.customer_id ORDER BY order_date DESC LIMIT 3
) o;                                               -- top 3 orders per customer
```
Useful for top-N per group with index-friendly plans.

### Q31. Arrays
```sql
CREATE TABLE posts (id SERIAL PRIMARY KEY, tags TEXT[]);
INSERT INTO posts (tags) VALUES (ARRAY['sql','pg']), ('{db,index}');
SELECT * FROM posts WHERE 'sql' = ANY(tags);
SELECT * FROM posts WHERE tags @> ARRAY['pg'];            -- contains
CREATE INDEX idx_posts_tags ON posts USING gin (tags);
SELECT array_agg(name) FROM employees;
```
Arrays are handy for small tag lists, but use a junction table when you need relational integrity or frequent per-element updates.

### Q32. Enums and domains
```sql
CREATE TYPE order_status AS ENUM ('new','paid','shipped','cancelled');
CREATE DOMAIN email_address AS TEXT CHECK (VALUE ~* '^[^@]+@[^@]+\.[^@]+$');
```
Adding enum values is possible (`ALTER TYPE ... ADD VALUE`), removing is not. Many teams prefer `TEXT` + `CHECK` or a lookup table for flexibility.

### Q33. UUIDs
```sql
CREATE TABLE sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id BIGINT);
```
`gen_random_uuid()` is built in (13+). UUIDv4 is random, making B-tree inserts scattered (index bloat and cache misses); prefer time-ordered UUIDv7 (built-in `uuidv7()` in PostgreSQL 18, verify; or generated by the app/extension) for large write-heavy tables.

### Q34. Backups basics: `pg_dump` and `pg_restore`
```bash
pg_dump -Fc -f shop.dump shop                 # custom format (compressed, parallel restore)
pg_dump -Fd -j 4 -f shop_dir shop             # directory format, parallel
pg_restore -d shop_new -j 4 shop.dump
pg_dumpall --globals-only > globals.sql       # roles and tablespaces
```
Logical backups are consistent snapshots (single transaction) but slow for huge databases. For large systems use physical backups (`pg_basebackup`, pgBackRest, Barman) with WAL archiving for PITR.

### Q35. Essential admin queries
```sql
SELECT version();
SELECT pg_size_pretty(pg_database_size(current_database()));
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 10;
SELECT pid, usename, state, now() - query_start AS runtime, query FROM pg_stat_activity WHERE state <> 'idle' ORDER BY runtime DESC;
SELECT pg_cancel_backend(pid);     -- cancel the query
SELECT pg_terminate_backend(pid);  -- kill the session
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. PostgreSQL process architecture *(Must-know)*
A **postmaster** process listens for connections and forks a dedicated **backend process** per client connection (not threads). Background processes: **checkpointer**, **background writer**, **WAL writer**, **autovacuum launcher/workers**, **stats collector** (cumulative statistics in shared memory since 15), **archiver** (WAL archiving), **walsender/walreceiver** (replication), **logical replication launcher**. Shared memory holds `shared_buffers`, WAL buffers and lock tables. Since each connection is a process, large connection counts are expensive: use a pooler.

### Q37. Memory settings (`shared_buffers`, `work_mem`, `maintenance_work_mem`, `effective_cache_size`)
- `shared_buffers`: PostgreSQL's own page cache; start around 25% of RAM (the OS cache also helps).
- `work_mem`: memory **per sort/hash operation per query node** (not per connection). A complex query can use several times this; many connections × several nodes can exhaust RAM. Typical 4–64 MB; raise per session for reporting.
- `maintenance_work_mem`: for `VACUUM`, `CREATE INDEX`.
- `effective_cache_size`: a planner hint (shared_buffers + OS cache), not an allocation; commonly 50–75% of RAM.
- `max_connections`: keep modest (100–300) and pool.

### Q38. MVCC: how PostgreSQL implements it *(Must-know)*
Each row version (tuple) has system columns `xmin` (creating transaction id) and `xmax` (deleting/updating transaction id). An `UPDATE` writes a **new tuple version** and marks the old one with `xmax`. A snapshot decides which versions are visible. Readers never block writers. Dead versions remain until `VACUUM` removes them.
```sql
SELECT xmin, xmax, ctid, * FROM customers LIMIT 3;
```

### Q39. What is `VACUUM`? What does `autovacuum` do? *(Must-know)*
`VACUUM` removes dead tuples (making space reusable inside the table file), updates the visibility map and free space map, and freezes old transaction ids. `VACUUM FULL` rewrites the table to return space to the OS (takes an `ACCESS EXCLUSIVE` lock; avoid on busy tables; use `pg_repack` instead). `ANALYZE` updates planner statistics. **Autovacuum** runs both automatically based on thresholds (`autovacuum_vacuum_scale_factor` default 0.2, `autovacuum_vacuum_threshold` 50).
```sql
VACUUM (VERBOSE, ANALYZE) orders;
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;
```

### Q40. Table and index bloat
Bloat is wasted space from dead tuples and fragmentation. Causes: long-running transactions (prevent cleanup), autovacuum too slow, heavy updates, abandoned replication slots. Detect: `pgstattuple`, bloat estimation queries, table size growth with stable row counts. Fix: tune autovacuum, remove long transactions, `REINDEX CONCURRENTLY`, `pg_repack`, partitioning for time-based data.

### Q41. HOT updates and `fillfactor`
A **HOT (heap-only tuple)** update happens when no indexed column changes and there is free space in the same page: no index entries need updating, and pruning is cheap. Lower `fillfactor` (e.g. 80–90) on frequently updated tables to leave room: `ALTER TABLE t SET (fillfactor = 85);`. Check `n_tup_hot_upd` in `pg_stat_user_tables`.

### Q42. Transaction ID wraparound *(Must-know)*
Transaction ids are 32-bit and compared circularly; after ~2 billion transactions old tuples would appear "in the future". `VACUUM` **freezes** old tuples. If freezing falls behind, PostgreSQL emits warnings and finally **shuts down writes** to prevent corruption. Monitor `age(datfrozenxid)` and `age(relfrozenxid)`; the aggressive autovacuum triggers at `autovacuum_freeze_max_age` (200 million). Causes of trouble: long transactions, prepared transactions, replication slots, disabled autovacuum.
```sql
SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;
```

### Q43. Index types in PostgreSQL *(Must-know)*
| Type | Use |
|---|---|
| **B-tree** | default; equality, ranges, sorting, `LIKE 'abc%'` (with C collation or `text_pattern_ops`) |
| **Hash** | equality only (WAL-logged since 10) |
| **GIN** | many keys per row: arrays, JSONB, full text, trigrams |
| **GiST** | geometric, ranges, nearest-neighbor, exclusion constraints, full text |
| **SP-GiST** | partitioned search trees (IP ranges, quadtrees, tries) |
| **BRIN** | tiny index for huge, naturally ordered tables (time series) |
| **Bloom** (extension) | multi-column equality filtering |
Also: **partial**, **expression**, **covering (`INCLUDE`)**, **multicolumn**, **unique**, and `pgvector` HNSW/IVFFlat for vectors.

### Q44. Creating indexes safely
```sql
CREATE INDEX CONCURRENTLY idx_orders_cust_date ON orders (customer_id, order_date DESC);
CREATE INDEX idx_active ON users (email) WHERE active;                     -- partial
CREATE INDEX idx_lower_email ON users (lower(email));                      -- expression
CREATE INDEX idx_cov ON orders (customer_id) INCLUDE (amount, order_date); -- covering (11+)
REINDEX INDEX CONCURRENTLY idx_orders_cust_date;                           -- 12+
DROP INDEX CONCURRENTLY idx_old;
```
`CONCURRENTLY` avoids blocking writes but takes longer, cannot run in a transaction, and can leave an `INVALID` index on failure (drop and retry).

### Q45. `EXPLAIN` and `EXPLAIN (ANALYZE, BUFFERS)` *(Must-know)*
```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS) SELECT ...;
```
Read bottom-up (child nodes feed parents). Compare `rows=` estimate vs `actual rows=`. Key node types: `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Heap/Index Scan`, `Nested Loop`, `Hash Join`, `Merge Join`, `Sort`, `HashAggregate`, `GroupAggregate`, `Limit`, `Gather` (parallel). Useful hints in the output: `Rows Removed by Filter`, `Heap Fetches` (index-only scan visibility), `Sort Method: external merge Disk`, `Buffers: shared hit/read/dirtied`, `loops`.
`EXPLAIN ANALYZE` executes the statement: wrap `INSERT/UPDATE/DELETE` in `BEGIN; ... ROLLBACK;`.

### Q46. Planner statistics and `ANALYZE`
`pg_statistic` / `pg_stats` hold per-column histograms, most common values (MCV), n_distinct, null fraction and correlation. `default_statistics_target` (100) controls detail; raise per column for skewed data: `ALTER TABLE t ALTER COLUMN c SET STATISTICS 500;`. Extended statistics for correlated columns: `CREATE STATISTICS s (dependencies, ndistinct, mcv) ON a, b FROM t;`.

### Q47. Why the planner chooses a sequential scan
Table is small, the query returns a large fraction of rows, stats are stale, the index is not usable (function on column, type mismatch, wrong operator class), or planner cost settings (`random_page_cost` default 4.0 suits spinning disks; SSD often 1.1–1.5) favor scanning. Test with `SET enable_seqscan = off;` (diagnostic only).

### Q48. JSON vs JSONB *(Must-know)*
`JSON` stores the exact text (preserves whitespace, key order, duplicates); `JSONB` stores a decomposed binary format (faster queries, supports indexing, removes duplicate keys, no key order). Use `JSONB` almost always.
```sql
CREATE TABLE events (id BIGINT GENERATED ALWAYS AS IDENTITY, payload JSONB NOT NULL);
INSERT INTO events (payload) VALUES ('{"user":"Ritesh Kumar","age":28,"tags":["a","b"]}');
SELECT payload->>'user' AS user, (payload->>'age')::int AS age FROM events;
SELECT * FROM events WHERE payload @> '{"tags":["a"]}';          -- containment (GIN-friendly)
SELECT * FROM events WHERE payload ? 'user';                     -- key exists
UPDATE events SET payload = jsonb_set(payload, '{age}', '29');
CREATE INDEX idx_events_payload ON events USING gin (payload jsonb_path_ops);
CREATE INDEX idx_events_user ON events ((payload->>'user'));     -- btree on one key
```
Operators: `->` (json), `->>` (text), `#>`, `#>>` (paths), `@>`, `<@`, `?`, `?|`, `?&`, `@?`/`@@` (jsonpath). 17 adds `JSON_TABLE` and more SQL/JSON functions.

### Q49. Full-text search
```sql
ALTER TABLE articles ADD COLUMN tsv tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english', coalesce(body,'')), 'B')) STORED;
CREATE INDEX idx_articles_tsv ON articles USING gin (tsv);
SELECT title, ts_rank(tsv, q) AS rank
FROM articles, websearch_to_tsquery('english', 'postgres "index tuning" -mysql') q
WHERE tsv @@ q ORDER BY rank DESC LIMIT 10;
```
For fuzzy matching and `LIKE '%x%'` use `pg_trgm` + GIN/GiST. For heavy relevance, facets, typo tolerance at scale use Elasticsearch/OpenSearch/Typesense.

### Q50. `pg_trgm` for `LIKE`/`ILIKE` and similarity
```sql
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_name_trgm ON customers USING gin (name gin_trgm_ops);
SELECT * FROM customers WHERE name ILIKE '%ritesh%';
SELECT name, similarity(name, 'Ritesh Kumr') FROM customers WHERE name % 'Ritesh Kumr' ORDER BY 2 DESC;
```

### Q51. Range types and multirange
```sql
SELECT tstzrange('2025-01-01', '2025-02-01') @> '2025-01-15'::timestamptz;   -- true
CREATE TABLE reservations (room INT, period tstzrange, EXCLUDE USING gist (room WITH =, period WITH &&));
```
Operators: `@>` contains, `&&` overlaps, `-|-` adjacent, `*` intersection. Perfect for scheduling and temporal logic.

### Q52. Common table expressions (CTEs): materialization behavior
Since PostgreSQL 12 a non-recursive, side-effect-free CTE referenced once is **inlined** into the outer query. Control it:
```sql
WITH x AS MATERIALIZED (SELECT ...)      -- force a separate evaluation (optimization fence)
WITH x AS NOT MATERIALIZED (SELECT ...)  -- force inlining
```
Writable CTEs (`WITH ins AS (INSERT ... RETURNING *) SELECT ...`) are always evaluated once.

### Q53. Window function specifics
Everything from `026_SQL.md` applies. PostgreSQL extras: `FILTER` on window aggregates, named windows (`WINDOW w AS (...)`), `GROUPS` frames, `EXCLUDE` clauses, `percentile_cont/disc`, `mode()`, `ntile`, `cume_dist`.

### Q54. Locks overview *(Must-know)*
Table-level lock modes (weak → strong): `ACCESS SHARE` (SELECT), `ROW SHARE` (SELECT FOR UPDATE), `ROW EXCLUSIVE` (INSERT/UPDATE/DELETE), `SHARE UPDATE EXCLUSIVE` (VACUUM, CREATE INDEX CONCURRENTLY), `SHARE` (CREATE INDEX), `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, `ACCESS EXCLUSIVE` (most `ALTER TABLE`, `DROP`, `TRUNCATE`, `VACUUM FULL`). `ACCESS EXCLUSIVE` conflicts with everything, including plain `SELECT`. Row-level locks: `FOR UPDATE`, `FOR NO KEY UPDATE`, `FOR SHARE`, `FOR KEY SHARE`; they live in tuple headers.

### Q55. Lock queues and why a harmless `ALTER TABLE` can freeze an app
An `ALTER TABLE` needing `ACCESS EXCLUSIVE` waits behind a long-running query/transaction; **every new query then queues behind the waiting ALTER**, so the table appears frozen. Mitigate: set `lock_timeout` for migrations (`SET lock_timeout = '3s'`), retry, avoid long transactions, use concurrent variants.

### Q56. `SELECT ... FOR UPDATE SKIP LOCKED`, `NOWAIT`, advisory locks
```sql
SELECT id FROM jobs WHERE status='pending' ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED;
SELECT pg_try_advisory_lock(42);          -- app-defined lock; session level
SELECT pg_advisory_xact_lock(hashtext('nightly-report'));   -- transaction level, auto released
```

### Q57. Deadlocks
Detected after `deadlock_timeout` (1 s); one transaction aborts with SQLSTATE `40P01`. Prevent by consistent lock ordering and short transactions; log with `log_lock_waits = on`. Handle with retries.

### Q58. Useful timeouts
```sql
SET statement_timeout = '30s';
SET lock_timeout = '5s';
SET idle_in_transaction_session_timeout = '60s';
SET idle_session_timeout = '15min';       -- 14+
```
Set sane defaults per role: `ALTER ROLE app_user SET statement_timeout = '30s';`.

### Q59. Connection pooling with PgBouncer *(Must-know)*
Because each connection is a process (~5–10 MB or more), use **PgBouncer** (or Odyssey, pgcat, RDS Proxy). Modes: **session** (safest), **transaction** (best multiplexing; breaks session features: `SET`, advisory session locks, `LISTEN/NOTIFY`, temp tables, prepared statements unless supported in newer PgBouncer), **statement**. App pools size by DB capacity (e.g. 20–50 server connections for many hundreds of clients).

### Q60. Prepared statements and plan caching
After 5 executions PostgreSQL may choose a **generic plan** if its estimated cost is close to custom plans. Skewed parameters can then cause bad plans. Control with `plan_cache_mode = force_custom_plan` for problem queries. With PgBouncer transaction pooling, use drivers/settings compatible with it.

### Q61. Partitioning (declarative) *(Must-know)*
```sql
CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY, created_at TIMESTAMPTZ NOT NULL, payload JSONB,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
CREATE TABLE events_2025_10 PARTITION OF events FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE events_default PARTITION OF events DEFAULT;
CREATE INDEX ON events (created_at);                       -- creates per-partition indexes
ALTER TABLE events DETACH PARTITION events_2025_10 CONCURRENTLY;   -- 14+
```
Types: `RANGE`, `LIST`, `HASH`. Benefits: partition pruning, fast retention (`DROP`/`DETACH`), smaller indexes, parallel maintenance. Unique keys must include the partition key. Automate partition creation with `pg_partman` or cron.

### Q62. Table inheritance and foreign tables
Inheritance (`INHERITS`) is the legacy approach to partitioning; use declarative partitioning today. **Foreign Data Wrappers** (`postgres_fdw`, `file_fdw`, `mysql_fdw`) query external data as local tables. Beware performance: use pushdown-friendly queries.

### Q63. Unlogged and temporary tables
`CREATE UNLOGGED TABLE` skips WAL (fast, truncated after a crash, not replicated). `CREATE TEMP TABLE` lives for the session. Both are good for staging/ETL. Temp tables need `ANALYZE` manually for good plans.

### Q64. Generated columns (12+)
```sql
ALTER TABLE orders ADD COLUMN total_with_tax NUMERIC GENERATED ALWAYS AS (amount * 1.18) STORED;
```
`STORED` only (virtual generated columns arrive in PostgreSQL 18, verify). Cannot be written directly.

### Q65. `MERGE` (15+) and its caveats
```sql
MERGE INTO inventory t USING staging s ON t.sku = s.sku
WHEN MATCHED THEN UPDATE SET qty = t.qty + s.qty
WHEN NOT MATCHED THEN INSERT (sku, qty) VALUES (s.sku, s.qty)
WHEN MATCHED AND s.qty = 0 THEN DELETE;
```
`MERGE` can fail with unique violations if rows are inserted concurrently; for high-concurrency upserts prefer `INSERT ... ON CONFLICT`. 17 adds `RETURNING` for MERGE.

### Q66. LISTEN/NOTIFY
```sql
LISTEN order_created;
NOTIFY order_created, '{"id": 42}';
SELECT pg_notify('order_created', '{"id": 42}');
```
Lightweight pub/sub within the database (payload ≤ 8000 bytes, not durable). Good for cache invalidation and wake-ups; use Kafka/Redis/SQS for durable queues.

### Q67. Row Level Security (RLS)
```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON documents
  USING (tenant_id = current_setting('app.tenant_id')::bigint)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::bigint);
```
Table owners and superusers bypass RLS unless `FORCE ROW LEVEL SECURITY`. Combine with per-request `SET LOCAL app.tenant_id = ...` for multi-tenant isolation. Index `tenant_id` first.

### Q68. Extensions you should know
`pg_stat_statements` (query stats), `pgcrypto`, `uuid-ossp`, `citext`, `hstore`, `pg_trgm`, `btree_gin/gist`, `postgis`, `pgvector`, `timescaledb`, `citus`, `pg_partman`, `pg_cron`, `pg_repack`, `pgaudit`, `auto_explain`, `postgres_fdw`, `pg_buffercache`, `pgstattuple`, `amcheck`, `hypopg` (hypothetical indexes).
```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT query, calls, mean_exec_time, total_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```
`pg_stat_statements` must be in `shared_preload_libraries` (restart required).

### Q69. Logging for diagnostics
```
log_min_duration_statement = 500       # ms; log slow queries
log_lock_waits = on
log_temp_files = 0                     # log temp file usage
log_autovacuum_min_duration = 1000
log_checkpoints = on
log_line_prefix = '%m [%p] %q%u@%d '
```
Analyze logs with `pgBadger`. Use `auto_explain` to capture plans of slow queries.

### Q70. Stats views to know
`pg_stat_activity` (sessions), `pg_stat_user_tables`/`indexes` (scans, tuples, dead tuples), `pg_stat_database`, `pg_stat_statements`, `pg_stat_replication`, `pg_stat_bgwriter`/`pg_stat_checkpointer` (17), `pg_stat_io` (16), `pg_locks`, `pg_stat_progress_vacuum/create_index`, `pg_statio_*`.
```sql
SELECT relname, seq_scan, idx_scan, n_tup_ins, n_tup_upd, n_tup_hot_upd, n_dead_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC LIMIT 10;
SELECT indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0;       -- unused index candidates
```

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. WAL (Write-Ahead Log) *(Must-know)*
Every change is first described in the WAL (sequential log in `pg_wal/`, 16 MB segments) and flushed before the transaction commits; data pages are written later. WAL gives durability (crash recovery replays WAL from the last checkpoint), enables **streaming replication**, **PITR**, and **logical decoding**. Key settings: `wal_level` (`minimal`/`replica`/`logical`), `synchronous_commit`, `max_wal_size`, `min_wal_size`, `checkpoint_timeout`, `wal_compression`, `full_page_writes`.

### Q72. Checkpoints and background writer
A **checkpoint** flushes all dirty buffers and records a safe recovery start point. Frequent checkpoints (small `max_wal_size`) cause I/O spikes and many full-page writes; infrequent ones lengthen crash recovery. Tune `checkpoint_timeout` (5–15 min), `max_wal_size` (several GB), `checkpoint_completion_target` (0.9). Watch `checkpoints_req` vs `checkpoints_timed` (many requested checkpoints = WAL size too small).

### Q73. `synchronous_commit` and durability trade-offs
`on` (default): commit waits for WAL flush to disk (and sync standbys per config). `off`: commit returns before flush; a crash can lose the last ~3x`wal_writer_delay` of commits but **never corrupts** the database. `remote_write`, `remote_apply`, `local` control sync replica behavior. Use `off` per transaction for low-value, high-rate writes (`SET LOCAL synchronous_commit = off`).

### Q74. Streaming replication *(Must-know)*
A standby connects to the primary's **walsender** and receives WAL continuously (physical, byte-for-byte). Standbys can serve read-only queries (`hot_standby = on`). Setup outline:
```bash
# primary: wal_level=replica, max_wal_senders=10, replication user, pg_hba entry
pg_basebackup -h primary -U replicator -D /var/lib/postgresql/data -R -X stream -P
# -R writes standby.signal and primary_conninfo
```
Monitor: `SELECT * FROM pg_stat_replication;` (primary) and `pg_stat_wal_receiver` (standby). Lag: `replay_lag`, `pg_wal_lsn_diff(sent_lsn, replay_lsn)`.

### Q75. Synchronous replication
```
synchronous_standby_names = 'FIRST 1 (standby1, standby2)'    # or ANY 1 (...)
synchronous_commit = on
```
Commit waits for at least one standby, reducing data loss risk (RPO ≈ 0) but increasing latency, and writes block if no sync standby is available (design for that). Quorum commit (`ANY`) improves availability.

### Q76. Replication slots
Slots make the primary retain WAL until the consumer has received it (physical or logical). Good for standbys and CDC, but an **abandoned slot makes WAL pile up and can fill the disk** (set `max_slot_wal_keep_size` to cap). Monitor `pg_replication_slots` (`active`, `restart_lsn`, retained WAL).

### Q77. Hot standby conflicts and `hot_standby_feedback`
Long queries on a standby can conflict with WAL replay (e.g. vacuum cleaning rows the query needs) and get canceled ("canceling statement due to conflict with recovery"). Options: `max_standby_streaming_delay`, `hot_standby_feedback = on` (tells primary to keep old versions; can cause bloat on primary), dedicated reporting replica.

### Q78. Logical replication *(Must-know)*
Row-level change streaming through **publications** and **subscriptions** using logical decoding (`wal_level = logical`).
```sql
-- publisher
CREATE PUBLICATION pub_orders FOR TABLE orders, customers;
-- subscriber
CREATE SUBSCRIPTION sub_orders CONNECTION 'host=pub dbname=shop user=repl' PUBLICATION pub_orders;
```
Use cases: major-version upgrades with near-zero downtime, selective replication, consolidating databases, CDC to other systems. Limits: DDL and sequences are not replicated automatically; tables need replica identity (primary key); large objects not replicated. 15+ supports row filters and column lists; 16+ can subscribe from a standby; 17 improves slot failover and `pg_upgrade` retains logical slots.

### Q79. Logical decoding and CDC (Debezium)
Output plugins (`pgoutput`, `wal2json`, `decoderbufs`) turn WAL into change events. Debezium reads from a replication slot and streams to Kafka. Concerns: slot lag, schema changes, initial snapshot, heartbeats to advance LSN on idle databases, publication scope, TOASTed values (REPLICA IDENTITY).

### Q80. Backup and PITR *(Must-know)*
Physical backup + continuous WAL archiving allows restoring to any point in time.
```
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
```
Restore: restore base backup, set `restore_command`, `recovery_target_time = '2025-10-24 10:14:59'`, create `recovery.signal`, start the server. Tools: **pgBackRest** (most popular: parallel, incremental, retention, S3), **Barman**, **WAL-G**, cloud snapshots. 17 adds native incremental backups via `pg_basebackup --incremental` and `pg_combinebackup`. Always test restores; monitor archive failures (`pg_stat_archiver`).

### Q81. High availability: Patroni, repmgr, cloud services
**Patroni** (with etcd/Consul/ZooKeeper) manages leader election, automatic failover, config, and standby bootstrapping; routing via HAProxy/VIP/DNS/PgBouncer. **repmgr** simpler. Cloud: RDS Multi-AZ, Aurora, Cloud SQL HA, Azure flexible server HA. Essentials: fencing/avoiding split brain, `pg_rewind` to resync the old primary, tested failover runbooks, synchronous replication for zero data loss when needed.

### Q82. `pg_rewind`, `pg_upgrade`
`pg_rewind` brings a diverged old primary back in sync by copying only changed blocks (needs `wal_log_hints` or data checksums). `pg_upgrade --link` upgrades major versions in minutes (hard links), then run `ANALYZE` (stats are not carried over in older versions; 18 retains some, verify) and test extensions. Alternative with minimal downtime: logical replication to a new-version cluster.

### Q83. Autovacuum tuning *(Must-know)*
Defaults are conservative for big/hot tables.
```sql
ALTER TABLE events SET (
  autovacuum_vacuum_scale_factor = 0.02,       -- instead of 0.2
  autovacuum_analyze_scale_factor = 0.01,
  autovacuum_vacuum_cost_limit = 2000);
```
Global knobs: `autovacuum_max_workers`, `autovacuum_naptime`, `autovacuum_vacuum_cost_delay` (2 ms default in 12+), `autovacuum_work_mem`. Watch for tables that never finish vacuuming, "to prevent wraparound" vacuums, and blocking by long transactions (`backend_xmin` in `pg_stat_activity`). Insert-only tables get vacuumed via `autovacuum_vacuum_insert_threshold` (13+) to set visibility maps.

### Q84. The visibility map and index-only scans
The visibility map marks pages where all tuples are visible to all transactions. **Index-only scans** can skip heap fetches for those pages. If the table isn't vacuumed regularly, `Heap Fetches` stays high and index-only scans lose their advantage.

### Q85. TOAST
Large values (over ~2 KB) are compressed and/or stored out-of-line in a TOAST table (max 1 GB per value). Storage strategies per column: `PLAIN`, `MAIN`, `EXTERNAL`, `EXTENDED`. Wide JSONB or text columns can slow `SELECT *`; fetch only needed columns. Updating a row without changing the TOASTed column avoids rewriting it.

### Q86. Planner cost parameters
`seq_page_cost` (1.0), `random_page_cost` (4.0 default; SSD ~1.1), `cpu_tuple_cost`, `cpu_index_tuple_cost`, `cpu_operator_cost`, `effective_io_concurrency`, `parallel_setup_cost`, `jit` thresholds. JIT compilation can hurt short OLTP queries: consider `jit = off` if you see JIT time dominating.

### Q87. Parallel query
Gather nodes use background workers for parallel seq scans, index scans (B-tree), joins, aggregates, and some partition scans. Controlled by `max_parallel_workers_per_gather`, `max_worker_processes`, `max_parallel_workers`, and table size thresholds (`min_parallel_table_scan_size`). Not used for writes (except `CREATE INDEX`, `CREATE TABLE AS`, `REFRESH MATVIEW`), cursors, or functions marked `PARALLEL UNSAFE`.

### Q88. Join algorithms and when each wins
**Nested Loop**: small outer rows with an index on inner; **Hash Join**: equi-join on large unsorted inputs (needs `work_mem`, can spill in batches); **Merge Join**: both inputs sorted (or index-ordered). Bad estimates lead to nested loops over huge sets: fix statistics, add indexes, rewrite.

### Q89. Common plan problems and fixes
| Symptom in plan | Likely fix |
|---|---|
| Seq Scan on big table, selective filter | add/adjust index; check types and functions on column |
| Rows estimate off by 100x | `ANALYZE`, raise statistics target, extended statistics |
| Sort spills to disk | raise `work_mem` for session, add index to provide order |
| Nested Loop with huge loops | missing index on join key; stale stats |
| Bitmap Heap Scan with many lossy blocks | increase `work_mem` |
| Filter removing most rows after index scan | better composite/partial index |
| Heap Fetches high on Index Only Scan | vacuum more often |

### Q90. Join collapse, CTE and subquery tips
`join_collapse_limit` and `from_collapse_limit` (default 8) restrict reordering for many-table joins; genetic optimizer `geqo_threshold` (12). Pre-aggregate, split into temp tables, or use CTEs with `MATERIALIZED` to guide when the planner struggles.

### Q91. Pagination in PostgreSQL
Keyset pagination with row-value comparison:
```sql
SELECT * FROM orders WHERE (order_date, order_id) < ('2025-06-01', 9000)
ORDER BY order_date DESC, order_id DESC LIMIT 20;
```
Back it with `CREATE INDEX ON orders (order_date DESC, order_id DESC);`. OFFSET for deep pages is O(offset).

### Q92. Bulk operations best practices
`COPY` for load; drop/recreate non-essential indexes for huge initial loads; `UNLOGGED` staging; batch updates (`WHERE id BETWEEN ...` ranges) with commits between; avoid one giant transaction that bloats and delays vacuum; `ANALYZE` after load; `SET LOCAL synchronous_commit = off` for importer sessions.

### Q93. Online schema changes in PostgreSQL
Safe patterns:
- Add nullable column: instant. Add with constant default: instant in 11+.
- Add `NOT NULL` safely: add `CHECK (col IS NOT NULL) NOT VALID`, then `VALIDATE CONSTRAINT` (no long lock), then `SET NOT NULL` (14+ uses the validated check to skip scan).
- Foreign keys: `ADD CONSTRAINT ... NOT VALID` then `VALIDATE CONSTRAINT`.
- Indexes: `CREATE INDEX CONCURRENTLY`.
- Change type: may rewrite the table; use new column + backfill + swap.
- Always `SET lock_timeout` and retry. Tools: `pg_repack`, `pgroll`, Reshape.

### Q94. Sequences, identity and large-scale ids
`bigint` ids from the start. Avoid hot sequence contention using `CACHE` for high insert rates. Distributed ids: UUIDv7/ULID/Snowflake. When migrating from `int` to `bigint`, plan a backfilled swap since `ALTER ... TYPE bigint` rewrites the table.

### Q95. Multi-tenancy patterns in PostgreSQL
Shared schema with `tenant_id` + RLS; schema-per-tenant (use `search_path`; many schemas strain catalog and migrations); database-per-tenant (best isolation, more connections); Citus for sharded multi-tenant. Index `tenant_id` first; consider partitioning by tenant for large tenants.

### Q96. Security hardening *(Must-know)*
`scram-sha-256` auth, TLS (`ssl = on`, `hostssl` rules), restrictive `pg_hba.conf`, no `trust` over network, revoke `CREATE` on `public` schema (default in 15+), least-privilege roles, separate migration role from app role, `pgaudit` for audit logs, RLS for tenant isolation, encrypted backups, patching (minor releases quarterly), disable superuser remote login, secrets in a vault, `SECURITY DEFINER` functions with fixed `search_path`.

### Q97. SQL injection and `format()`/`quote_*`
Use parameterized queries from drivers. In PL/pgSQL dynamic SQL use `EXECUTE format('SELECT * FROM %I WHERE id = $1', tbl) USING id;` with `%I` for identifiers and `%L` for literals. Never concatenate untrusted text.

### Q98. Monitoring essentials
Metrics: connections (active/idle/idle in transaction), TPS, cache hit ratio (`blks_hit/(blks_hit+blks_read)`), replication lag, checkpoint stats, WAL generation, dead tuples/bloat, oldest transaction age, lock waits, slow queries, disk space, temp file usage, vacuum progress, wraparound age. Tools: `pg_stat_statements`, Prometheus `postgres_exporter`, pgBadger, pganalyze, Datadog, Grafana.

### Q99. Finding blockers
```sql
SELECT blocked.pid AS blocked_pid, blocked.query AS blocked_query,
       blocking.pid AS blocking_pid, blocking.query AS blocking_query, blocking.state
FROM pg_stat_activity blocked
JOIN LATERAL unnest(pg_blocking_pids(blocked.pid)) AS b(pid) ON true
JOIN pg_stat_activity blocking ON blocking.pid = b.pid;
```
Cancel with `pg_cancel_backend(pid)` first; terminate if needed.

### Q100. Idle-in-transaction sessions
They hold locks and snapshots, block vacuum and cause bloat. Detect: `state = 'idle in transaction'` in `pg_stat_activity` with old `xact_start`. Prevent: `idle_in_transaction_session_timeout`, correct application transaction handling (commit/rollback in `finally`).

### Q101. Handling hot rows and counters
Single hot rows serialize on row locks and create many dead tuples. Options: batch increments through a queue, use `INSERT` rows into a counter table and aggregate later, shard counters (n slots), use Redis for volatile counters, or reduce `fillfactor` for HOT updates.

### Q102. Queue patterns in PostgreSQL
`FOR UPDATE SKIP LOCKED` job tables; `LISTEN/NOTIFY` to wake workers; partitioned or periodically cleaned job tables (avoid bloat); consider Kafka/SQS/RabbitMQ at larger scale. Tools: `pgmq`, `river`, `graphile-worker`, `pg-boss`.

### Q103. Time-series on PostgreSQL
Partition by time, BRIN indexes, compression via TimescaleDB, rollups with continuous aggregates, retention by dropping partitions, `date_bin()` (14+) for bucketing, avoid indexing every column, batch inserts with `COPY`.

### Q104. Geospatial with PostGIS
`geometry`/`geography` types, GiST indexes, functions like `ST_DWithin`, `ST_Intersects`, `ST_Distance`. Use `geography` for lat/lon distance in meters, `geometry` for projected data and speed.

### Q105. Vector search with pgvector
```sql
CREATE EXTENSION vector;
CREATE TABLE docs (id BIGSERIAL PRIMARY KEY, content TEXT, embedding vector(1536));
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);
SELECT id FROM docs ORDER BY embedding <=> '[0.1,0.2,...]' LIMIT 5;
```
HNSW (high recall, more memory/build time) vs IVFFlat (needs training, lists/probes). Combine with SQL filters, but filtered ANN needs care (iterative scans in newer versions). Good for RAG at moderate scale; dedicated vector DBs for very large scale.

### Q106. Foreign keys and performance
Index the referencing column (not automatic). `ON DELETE CASCADE` can be heavy. Deferrable FKs help bulk loads. `NOT VALID` + `VALIDATE` for safe adds. Partitioned tables support FKs (as referencing, and referenced from 12+).

### Q107. Naming, schema design and conventions
`snake_case`, singular or plural consistently, `*_id` keys, `created_at/updated_at timestamptz`, FK names, explicit constraint names, `bigint` PKs, `text` + `CHECK` over arbitrary `varchar(n)`, comments (`COMMENT ON`), migrations versioned (Flyway, Liquibase, Sqitch, Alembic, Prisma, Atlas, golang-migrate).

### Q108. Data integrity tools beyond constraints
Exclusion constraints, deferrable constraints, domains, triggers, `CHECK` with functions (IMMUTABLE), `amcheck` for index integrity, data checksums (`initdb --data-checksums` or `pg_checksums`) to detect storage corruption.

### Q109. Collations and locale
Collation affects sorting, comparisons and index usability (`LIKE` prefix searches with non-C collations need `text_pattern_ops`). ICU collations (`CREATE COLLATION ... PROVIDER icu`) are portable across OS versions; glibc upgrades can change sort order and **corrupt indexes** (rebuild after OS locale updates). 15+ supports ICU as the database default; 17 adds a builtin C.UTF-8 provider.

### Q110. Time zone best practices
Store `timestamptz`; set application sessions to UTC; convert at presentation (`AT TIME ZONE 'Asia/Kolkata'`). Avoid `timestamp without time zone` for instants. DST: use `date_trunc('day', ts, 'Asia/Kolkata')` (12+ third argument) for local-day boundaries.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. Slow query investigation workflow *(Must-know)*
1. Find offenders: `pg_stat_statements` (total time, mean time, calls, rows, shared_blks_read, temp blocks) and logs (`log_min_duration_statement`, `auto_explain`).
2. Reproduce with real parameters: `EXPLAIN (ANALYZE, BUFFERS, SETTINGS)`.
3. Read bottom-up; find the node with the largest actual time and the biggest estimate mismatch.
4. Check indexes, statistics (`pg_stats`), vacuum status, bloat, `work_mem`, parallelism, locks/waits (`wait_event` in `pg_stat_activity`).
5. Fix: rewrite, index (test with `hypopg`), stats, partitioning, configuration, data model.
6. Verify with before/after metrics; add a regression alarm.

### Q112. Wait events
`pg_stat_activity.wait_event_type/wait_event`: `Lock` (relation, tuple, transactionid), `LWLock` (BufferMapping, WALWrite), `IO` (DataFileRead, WALSync), `Client` (waiting for client), `IPC`, `Timeout`. Sampling wait events shows where sessions spend time.

### Q113. Estimation errors: causes and defenses
Correlated columns, skewed distributions, expressions on columns, parameter-dependent selectivity, stale stats, joins across multiple filters, functions with unknown selectivity. Defenses: extended statistics, higher statistics targets, partial/expression indexes (expression stats), rewriting predicates, `CREATE STATISTICS ... (mcv)`, query hints via `pg_hint_plan` (extension, last resort).

### Q114. Index bloat, reindexing and index maintenance
B-tree pages do not merge easily; heavy random updates leave sparse pages. Use `REINDEX CONCURRENTLY` or `pg_repack`. 13+ B-tree deduplication reduces size for duplicate keys; 14+ bottom-up deletion reduces bloat. Drop unused or duplicate indexes (check `pg_stat_user_indexes`).

### Q115. Multicolumn and partial index design for real queries
For `WHERE tenant_id = ? AND status = 'open' ORDER BY created_at DESC LIMIT 50`: `CREATE INDEX ON tickets (tenant_id, created_at DESC) WHERE status = 'open';` Small, ordered, selective. Use `INCLUDE` for index-only needs. Verify the planner picks it with realistic parameters.

### Q116. MVCC anomalies and isolation in PostgreSQL
`REPEATABLE READ` = snapshot isolation: prevents dirty, non-repeatable and phantom reads but allows **write skew**. `SERIALIZABLE` (SSI) adds predicate-lock tracking and may abort with `40001`; applications must retry. `READ COMMITTED` re-evaluates `WHERE` on updated rows (EvalPlanQual), which prevents lost updates for simple `UPDATE ... WHERE` but not read-modify-write at the application level. Use atomic updates or `SELECT ... FOR UPDATE`.

### Q117. Lost update prevention patterns
```sql
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;      -- atomic check + write
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;                              -- pessimistic
UPDATE docs SET body = $1, version = version + 1 WHERE id = $2 AND version = $3;  -- optimistic; check row count
```

### Q118. Serializable usage in practice
Use `SERIALIZABLE` for invariants spanning rows (booking with capacity, double-entry checks) when constraints cannot express them; wrap in a retry loop on SQLSTATE `40001`/`40P01`. Keep transactions short and read-only transactions `DEFERRABLE` where suitable. Test under concurrency.

### Q119. Advisory locks vs row locks vs constraints
Advisory locks coordinate application-level critical sections (cron singletons, per-tenant migrations). Row locks protect data rows. Constraints (unique, exclusion) provide durable declarative guarantees and are preferable when applicable. Beware advisory locks with transaction-mode poolers (use `pg_advisory_xact_lock`).

### Q120. Large table maintenance strategy
Partition for retention; autovacuum per-table tuning; `pg_repack` for bloat; `CLUSTER` only for one-time ordering (locks table); monitoring `pg_stat_progress_*`; keep indexes minimal; archive cold partitions to cheaper storage (tablespaces, foreign tables, data lake).

### Q121. Handling extremely high write rates
Batch inserts (`COPY`, multi-row), partition by time, reduce indexes, `UNLOGGED` staging, larger `max_wal_size`, tune `wal_compression`, `wal_buffers`, fast storage (NVMe), `synchronous_commit` per workload, separate WAL volume, avoid wide rows and frequent updates (HOT), use Citus/sharding when a single node is saturated.

### Q122. Handling read scaling
Streaming replicas with load balancing (pgpool-II, HAProxy, driver-level), connection pooling, caching (Redis), materialized views, read-your-writes routing using LSN waits (`pg_current_wal_lsn()` vs replica `pg_last_wal_replay_lsn()`), CQRS read models. Beware replica lag and conflict cancellations.

### Q123. Sharding with Citus and application sharding
**Citus** (extension) distributes tables across worker nodes by a distribution column (colocation for joins), supports reference tables, parallel queries; best for multi-tenant SaaS (`tenant_id`) and real-time analytics. Application-level sharding or Postgres-compatible distributed databases (CockroachDB, YugabyteDB, AlloyDB Omni variations) are alternatives. Plan shard key, rebalancing, cross-shard transaction limits.

### Q124. Foreign data wrappers and federation
`postgres_fdw` pushes down filters/joins where possible; check `EXPLAIN VERBOSE` for "Remote SQL". Useful for migrations and cross-database reads, not for high-QPS cross-service joins. Import schemas with `IMPORT FOREIGN SCHEMA`.

### Q125. Extension and upgrade management
Pin extension versions, test `ALTER EXTENSION ... UPDATE`, check managed-service support lists, plan upgrades with extensions' compatibility (PostGIS, TimescaleDB require specific procedures). Minor upgrades (security/bugfix) are binary swaps with a restart; schedule quarterly. Major upgrades annually using `pg_upgrade` or logical replication.

### Q126. PostgreSQL major-version upgrade runbook
1. Read release notes; check deprecated features, extension support.
2. Test on a production-like clone with the application test suite and query regression comparison (`pg_stat_statements` plans).
3. Choose method: `pg_upgrade --link` (short downtime) or logical replication (near-zero downtime).
4. Take a backup; confirm replication state; stop writes (or switch).
5. Upgrade; run `ANALYZE` (or `vacuumdb --analyze-in-stages`); rebuild indexes if collation changed.
6. Switch traffic; rebuild standbys; monitor; keep rollback window.

### Q127. Memory and OOM issues
Too many connections × `work_mem × nodes`, large `maintenance_work_mem` with parallel maintenance, huge `hash_mem_multiplier`, in-memory temp tables. Linux OOM killer kills a backend, forcing crash recovery. Mitigate: pooler, lower `work_mem` globally with per-query overrides, `vm.overcommit_memory=2` guidance, cgroup limits awareness, monitor RSS per backend.

### Q128. Disk and I/O tuning
Separate volumes for data, WAL and temp when helpful; XFS/ext4 with `noatime`; `random_page_cost` for SSD; `effective_io_concurrency`; `wal_compression`; checkpoint spreading; `huge_pages = try`; monitor `pg_stat_io` (16+), `iostat`. Use `fsync = on` always in production.

### Q129. Corruption and data checksums
Enable checksums at `initdb` (or `pg_checksums --enable` offline). Detect with `amcheck` (`bt_index_check`), `pg_dump` to /dev/null, `pg_verifybackup`. Causes: storage faults, memory errors, bugs, collation changes. Response: restore from backup/replica, `REINDEX`, never "zero_damaged_pages" without understanding data loss.

### Q130. Troubleshooting replication lag
Check `pg_stat_replication` write/flush/replay lag; causes: network, slow disk on standby, long-running queries conflicting with replay, huge transactions, vacuum activity generating WAL, single-threaded replay. Fix: faster standby storage, `max_standby_streaming_delay` choices, reduce WAL volume (batching, `wal_compression`), separate reporting replica.

### Q131. Troubleshooting WAL accumulation (disk full)
Causes: inactive replication slot, failing `archive_command`, long-lag standby with `wal_keep_size`, `max_wal_size` bursts. Check `pg_replication_slots`, `pg_stat_archiver`, `pg_wal` size. Resolve: drop unneeded slot, fix archiving, add disk; never delete WAL files manually. Alert at 70–80% and set `max_slot_wal_keep_size`.

### Q132. Handling ORMs with PostgreSQL
Inspect SQL, avoid N+1 (`prefetch`, `JOIN FETCH`, DataLoader), use `RETURNING`, batch inserts (`COPY`/`unnest`), tune pool sizes, use server-side cursors only when needed, set `statement_timeout`, map `timestamptz` correctly, ensure migrations use `CONCURRENTLY` and `lock_timeout`.

### Q133. Observability for large fleets
Standard dashboards and alerts, `pg_stat_statements` snapshots over time (query regression detection), wait event sampling, log shipping, automated bloat and wraparound checks, per-tenant metrics, synthetic checks, and runbooks for common incidents.

### Q134. Cost of idle connections and prepared statements
Each backend holds memory for catalog caches and plans; thousands of idle backends add up. Use poolers, `idle_session_timeout`, and limit per-role connections (`ALTER ROLE app CONNECTION LIMIT 100`).

### Q135. JSONB design guidelines
Use JSONB for sparse, evolving attributes; store core relational fields in columns. Index with GIN (`jsonb_ops` vs `jsonb_path_ops`) for containment, expression indexes for hot keys. Large JSONB updates rewrite the whole value (TOAST); keep documents small, avoid hot-updating huge documents. Validate with `CHECK` and JSON Schema extensions (`pg_jsonschema`).

### Q136. Full-text vs `pg_trgm` vs external search
Built-in FTS: stemming, ranking, stop words, good for moderate scale. `pg_trgm`: fuzzy/`LIKE` search. External engines: advanced relevance, facets, typo tolerance, scale. Choose by requirements and operational budget; keep Postgres as source of truth, index via CDC.

### Q137. Event sourcing / outbox with PostgreSQL
Append-only event tables (partitioned by time, indexed by aggregate id and version with unique constraint for optimistic concurrency), outbox table written in the same transaction and published via CDC or a poller using `SKIP LOCKED`; consumers idempotent. Use logical decoding for low-latency, low-load publishing.

### Q138. Auditing and temporal data
`pgaudit` for statement audit; trigger-based row history tables (`jsonb` old/new); temporal modeling with range types (`valid_period tstzrange`) and exclusion constraints; extensions `temporal_tables`; or CDC into an immutable log.

### Q139. Zero-downtime migration patterns
Expand → backfill in batches (small transactions, sleep) → dual-write or triggers → switch reads → contract. Use `NOT VALID` constraints, concurrent indexes, logical replication for cross-version/cloud moves, and verify with row counts/checksums (`pg_comparator`, custom hash queries).

### Q140. Common anti-patterns
`SELECT *`, unbounded `OFFSET`, long idle transactions, `FLOAT` for money, using `serial`/`int` ids for huge tables, enum abuse, giant JSONB blobs, missing FK indexes, too many connections without pooling, `VACUUM FULL` in production, disabling autovacuum, ignoring wraparound warnings, un-reviewed triggers with side effects, relying on implicit casts.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. Why choose PostgreSQL as the default and when not to?
Default because of correctness, features, extensibility, open governance and cloud availability. Not ideal: massive write-scale needing automatic multi-region sharding (consider Cassandra/Spanner/Cockroach/DynamoDB), pure key-value ultra-low-latency (Redis/DynamoDB), heavy analytics scans at petabyte scale (columnar warehouses), unstructured search relevance (OpenSearch). A hybrid with CDC is common.

### Q142. Designing HA/DR for a critical PostgreSQL service
Patroni (or managed Multi-AZ) with synchronous standby in another AZ for RPO≈0, async cross-region replica for DR, pgBackRest to object storage with PITR and retention, delayed replica (e.g. 1 hour) for human error, connection routing via HAProxy/PgBouncer, regular failover and restore drills, runbooks, monitoring of lag/slots/archive, defined RPO/RTO per service.

### Q143. Capacity planning
Working set vs RAM (hot data + indexes), TPS and WAL volume (MB/s), connection counts (pooled), storage growth including bloat and indexes, vacuum throughput, replication bandwidth. Benchmark with `pgbench` or production replays (pgreplay-go), plan 30–50% headroom, define scaling triggers (vertical, replicas, partitioning, sharding).

### Q144. Data platform architecture with PostgreSQL at the center
OLTP PostgreSQL → logical decoding/Debezium → Kafka → search index, caches, warehouse (Snowflake/BigQuery/ClickHouse), ML feature store/vector indexes. Contracts for schemas, idempotent consumers, replay capability, data quality checks, PII handling per sink.

### Q145. Governance for many PostgreSQL clusters
Standardized provisioning (Terraform/Ansible/operators), baseline parameter groups, mandatory extensions list, role model (owner, migrator, app, readonly, monitoring), automated backups and restore tests, migration pipeline with lint (squawk, sqlfluff, Atlas), SLO dashboards, patching cadence, cost tagging, access reviews, incident playbooks.

### Q146. Kubernetes and PostgreSQL
Use mature operators (CloudNativePG, Crunchy PGO, Zalando postgres-operator, Percona) for HA, backups (WAL to object storage), rolling updates, pooler sidecars. Requirements: fast persistent volumes, anti-affinity across zones, resource requests/limits matching `shared_buffers` + overhead, graceful shutdown, careful liveness probes. Many orgs keep production databases on managed services and run only dev/test in clusters.

### Q147. Managed service selection: RDS vs Aurora vs AlloyDB vs Cloud SQL vs Neon/Supabase
Evaluate: extension support, version lag, HA/failover time, read replica model, storage architecture (Aurora/AlloyDB separate compute/storage with faster replicas), scaling (serverless options), backup/PITR, networking, cost model, lock-in, observability access (`pg_stat_*`, logs), compliance. Prove with load tests and failover drills.

### Q148. Security and compliance program
Encryption in transit and at rest (KMS), column-level encryption for secrets (`pgcrypto` caution with key handling; prefer app-level/KMS), RLS, auditing (`pgaudit`), data masking in non-prod (`postgresql_anonymizer`), retention and deletion workflows (GDPR erasure across backups/replicas/CDC sinks), access reviews, break-glass accounts, vulnerability patching SLAs.

### Q149. Cost optimization
Right-size instances, use storage tiers, remove unused indexes, partition/archive cold data, enable compression (`lz4` TOAST compression 14+, `wal_compression`), tune autovacuum to limit bloat, reserved instances, avoid cross-AZ chatter, reduce replica count by caching, measure cost per tenant.

### Q150. Mentoring: the PostgreSQL skill ladder
Junior: SQL, indexes, transactions, `EXPLAIN`. Mid: MVCC/vacuum, locking, replication basics, migrations. Senior: planner internals, tuning, HA/PITR, capacity, incident handling. Lead: architecture, governance, upgrade strategy. Teach through real incidents: bloat from a forgotten transaction, replication slot filling disks, lock queue from `ALTER TABLE`.

### Q151. Incident story template (PostgreSQL)
Example: "Writes stalled after a deploy." Symptoms: p99 latency spike, connections maxed. Diagnosis: `pg_stat_activity` showed many sessions waiting on `relation` locks behind an `ALTER TABLE` queued behind a long report query. Mitigation: cancel the report, set `lock_timeout` on migrations, rerun. Prevention: migration linter (squawk), statement/idle timeouts, separate reporting replica, runbook.

### Q152. Evolving trends to know
Extensions as platform (pgvector, pg_duckdb, ParadeDB, pg_search), serverless/branching Postgres (Neon), disaggregated storage (Aurora/AlloyDB), improved logical replication (failover slots), incremental backups, asynchronous I/O and UUIDv7 (18, verify), OrioleDB/columnar experiments, Postgres-compatible distributed databases. Evaluate with benchmarks and operational risk.

### Q153. When to say no to a database feature
Triggers with cross-table side effects, giant stored procedures for business logic, using LISTEN/NOTIFY as a durable queue, using PostgreSQL as a blob store for large files, using JSONB for entire domain models, or enabling an extension unsupported by your DR provider. Explain risks and propose alternatives.

### Q154. Hiring/interview perspective
Strong candidates explain MVCC and vacuum plainly, read `EXPLAIN (ANALYZE, BUFFERS)`, describe safe migrations, discuss replication slots/WAL/PITR, and bring concrete incident stories. Weak signals: only ORM knowledge, believing "add more indexes" solves everything, unaware of bloat or wraparound.

### Q155. Interview approach for design questions with PostgreSQL
Clarify workload, data size and growth, consistency needs, availability goals. Propose schema and indexes, discuss transactions and isolation, scaling path (indexes → pooling → replicas → partitioning → sharding), HA/backup/PITR, observability, and trade-offs. Mention what you would measure first.

---

# 💻 Part 6: Hands-On Tasks & Queries

### H1. Set up roles for an application (least privilege)
```sql
CREATE ROLE app_owner NOLOGIN;
CREATE DATABASE shop OWNER app_owner;
\c shop
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE SCHEMA app AUTHORIZATION app_owner;

CREATE ROLE app_rw LOGIN PASSWORD '***' CONNECTION LIMIT 100;
CREATE ROLE app_ro LOGIN PASSWORD '***';
GRANT CONNECT ON DATABASE shop TO app_rw, app_ro;
GRANT USAGE ON SCHEMA app TO app_rw, app_ro;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app GRANT USAGE, SELECT ON SEQUENCES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app GRANT SELECT ON TABLES TO app_ro;
ALTER ROLE app_rw SET statement_timeout = '30s';
ALTER ROLE app_rw SET idle_in_transaction_session_timeout = '60s';
```
Run migrations as `app_owner` (or a dedicated migrator role), not as the app user.

### H2. Find the top slow queries
```sql
SELECT left(query, 80) AS q, calls,
       round(total_exec_time::numeric, 1) AS total_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms,
       rows, shared_blks_read, temp_blks_written
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 10;
SELECT pg_stat_statements_reset();     -- after a deploy to measure fresh
```

### H3. Find unused and duplicate indexes
```sql
SELECT s.schemaname, s.relname, s.indexrelname, pg_size_pretty(pg_relation_size(s.indexrelid)) AS size, s.idx_scan
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0 AND NOT i.indisunique AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC;
```
Observe over a full business cycle; stats reset on `pg_stat_reset()`; replicas have their own counters.

### H4. Find tables needing vacuum, and long transactions that block it
```sql
SELECT relname, n_live_tup, n_dead_tup,
       round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 1) AS dead_pct,
       last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 15;

SELECT pid, usename, state, xact_start, now() - xact_start AS xact_age, backend_xmin, left(query, 60)
FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY xact_start LIMIT 10;
```

### H5. Check wraparound risk
```sql
SELECT datname, age(datfrozenxid) AS xid_age,
       round(100.0 * age(datfrozenxid) / 2000000000, 1) AS pct_of_limit
FROM pg_database ORDER BY 2 DESC;
SELECT c.oid::regclass, age(c.relfrozenxid) FROM pg_class c WHERE relkind IN ('r','m','t') ORDER BY 2 DESC LIMIT 10;
```

### H6. Estimate table and index sizes
```sql
SELECT c.relname,
       pg_size_pretty(pg_table_size(c.oid))   AS table_size,
       pg_size_pretty(pg_indexes_size(c.oid)) AS index_size,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'app' AND c.relkind = 'r' ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 10;
```

### H7. Optimize a slow query (worked example)
Slow:
```sql
SELECT * FROM orders WHERE lower(status) = 'paid' AND created_at::date = '2025-10-01' ORDER BY amount DESC LIMIT 20;
```
Issues: function on column (`lower(status)`), cast on column (`created_at::date`), `SELECT *`. Fix:
```sql
CREATE INDEX CONCURRENTLY idx_orders_paid_created ON orders (created_at, amount DESC) WHERE status = 'paid';
SELECT order_id, customer_id, amount
FROM orders
WHERE status = 'paid' AND created_at >= '2025-10-01' AND created_at < '2025-10-02'
ORDER BY amount DESC LIMIT 20;
```
Verify with `EXPLAIN (ANALYZE, BUFFERS)`.

### H8. Safe migration template
```sql
SET lock_timeout = '3s';
SET statement_timeout = '15min';
BEGIN;
ALTER TABLE orders ADD COLUMN currency TEXT;                     -- instant
COMMIT;

-- backfill in batches (repeat until 0 rows)
UPDATE orders SET currency = 'INR' WHERE order_id IN (
  SELECT order_id FROM orders WHERE currency IS NULL ORDER BY order_id LIMIT 5000 FOR UPDATE SKIP LOCKED);

ALTER TABLE orders ADD CONSTRAINT orders_currency_nn CHECK (currency IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_currency_nn;        -- does not block writes
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;            -- fast with the validated check (12+)
ALTER TABLE orders DROP CONSTRAINT orders_currency_nn;
```

### H9. Streaming replica setup (outline commands)
```bash
# primary postgresql.conf
wal_level = replica ; max_wal_senders = 10 ; hot_standby = on ; wal_keep_size = '2GB'
# primary: CREATE ROLE replicator REPLICATION LOGIN PASSWORD '***';  + pg_hba.conf entry for the standby
# standby:
pg_basebackup -h 10.0.0.1 -U replicator -D /var/lib/postgresql/16/main -R -X stream -C -S standby1 -P
systemctl start postgresql
# verify on primary
psql -c "SELECT client_addr, state, sync_state, replay_lag FROM pg_stat_replication;"
```

### H10. Logical replication for a zero-downtime upgrade (outline)
1. New cluster (new major version) with the same schema (`pg_dump --schema-only`).
2. Publisher: `wal_level=logical`; `CREATE PUBLICATION p FOR ALL TABLES;` (ensure all tables have PKs/replica identity).
3. Subscriber: `CREATE SUBSCRIPTION s CONNECTION '...' PUBLICATION p;`
4. Wait for initial sync + catch-up; compare counts/checksums.
5. Stop writes briefly, sync sequences (`setval` from source), verify lag 0, point the app to the new cluster.
6. Keep reverse replication or backups for rollback.

### H11. Backup with pgBackRest and PITR restore (outline)
```bash
# /etc/pgbackrest.conf: repo1-path or S3, retention-full=2, compress-type=zst
pgbackrest --stanza=main stanza-create
pgbackrest --stanza=main --type=full backup
pgbackrest --stanza=main --type=incr backup
# restore to a point in time
pgbackrest --stanza=main --delta --type=time --target="2025-10-24 10:14:59+05:30" --target-action=promote restore
```
Test regularly on a separate host and verify with application-level checks.

### H12. Job queue with `SKIP LOCKED`
```sql
CREATE TABLE jobs (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', run_at TIMESTAMPTZ NOT NULL DEFAULT now(), attempts INT NOT NULL DEFAULT 0);
CREATE INDEX ON jobs (run_at) WHERE status = 'pending';

WITH next AS (
  SELECT id FROM jobs WHERE status = 'pending' AND run_at <= now()
  ORDER BY run_at LIMIT 10 FOR UPDATE SKIP LOCKED)
UPDATE jobs j SET status = 'running', attempts = attempts + 1
FROM next WHERE j.id = next.id RETURNING j.*;
```

### H13. Top-N per group using `LATERAL` and `DISTINCT ON`
```sql
SELECT DISTINCT ON (customer_id) * FROM orders ORDER BY customer_id, created_at DESC;             -- latest 1

SELECT c.customer_id, o.*
FROM customers c, LATERAL (SELECT * FROM orders o WHERE o.customer_id = c.customer_id
                           ORDER BY created_at DESC LIMIT 3) o;                                   -- latest 3
```

### H14. Use `pg_trgm` for typo-tolerant search
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY idx_cust_name_trgm ON customers USING gin (name gin_trgm_ops);
SELECT name, similarity(name, 'Ritsh Kumr') AS s FROM customers WHERE name % 'Ritsh Kumr' ORDER BY s DESC LIMIT 5;
```

### H15. Partition maintenance routine (monthly)
```sql
CREATE TABLE IF NOT EXISTS events_2025_11 PARTITION OF events FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
ALTER TABLE events DETACH PARTITION events_2025_07 CONCURRENTLY;
-- archive: pg_dump -t events_2025_07 ... then DROP TABLE events_2025_07;
```
Automate with `pg_partman` + `pg_cron`.

### H16. Quick Docker lab
```bash
docker run -d --name pg16 -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=shop -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data postgres:16
docker exec -it pg16 psql -U postgres -d shop
```

### H17. Baseline `postgresql.conf` for a 16 GB OLTP server (starting point; measure)
```ini
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 11GB
work_mem = 16MB
maintenance_work_mem = 1GB
wal_compression = on
max_wal_size = 8GB
min_wal_size = 2GB
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
random_page_cost = 1.1
effective_io_concurrency = 200
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_scale_factor = 0.02
log_min_duration_statement = 500ms
log_lock_waits = on
log_temp_files = 0
shared_preload_libraries = 'pg_stat_statements,auto_explain'
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Everything is slow; `pg_stat_activity` shows hundreds of connections
Connection storm or missing pool. Check state counts: `SELECT state, count(*) FROM pg_stat_activity GROUP BY 1;`. Fix: PgBouncer, cap app pools, lower `max_connections`, kill idle sessions with `idle_session_timeout`.

### D2. Disk fills up rapidly, `pg_wal` is huge
Inactive replication slot or failing archiving. `SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) FROM pg_replication_slots;` and `SELECT * FROM pg_stat_archiver;`. Drop the dead slot, fix `archive_command`, add disk, set `max_slot_wal_keep_size`.

### D3. Table is huge but has few rows
Bloat from long transactions or insufficient autovacuum. Check dead tuples and oldest xmin; fix transactions, tune autovacuum, then `pg_repack` (or `VACUUM FULL` in a maintenance window).

### D4. Query uses Seq Scan although an index exists
Check selectivity, stats (`ANALYZE`), type mismatch (`WHERE id = '5'::text`), function on column, wrong operator class (`LIKE 'a%'` with non-C collation), `random_page_cost`, partial index predicate mismatch, `enable_*` flags. Compare plans with `SET enable_seqscan = off`.

### D5. `ERROR: deadlock detected`
Read the log (processes, relations, queries). Normalize update order, shorten transactions, index FK columns, use `SELECT ... FOR UPDATE` in a consistent order, retry on `40P01`.

### D6. `ERROR: canceling statement due to conflict with recovery` on a standby
Long query vs WAL replay. Options: `hot_standby_feedback = on` (bloat risk), `max_standby_streaming_delay` larger, use a dedicated reporting replica, shorten queries.

### D7. `FATAL: sorry, too many clients already`
`max_connections` reached. Add pooling; find leaks (`application_name`, `client_addr` grouping); for emergencies use reserved `superuser_reserved_connections` to log in and kill sessions.

### D8. `ERROR: could not resize shared memory segment` / OOM kills
Too much `work_mem`/parallel workers or containers with small `/dev/shm`. Lower `work_mem`, increase `/dev/shm` in Docker/K8s (`--shm-size`), limit parallel workers.

### D9. Migration hangs production
`ALTER TABLE` waiting for a lock queued behind a long transaction; all queries pile up. Cancel the migration, set `lock_timeout`, find and end the blocker, retry in a quiet window or use concurrent/online patterns.

### D10. Sequences out of sync after restoring data
Duplicate key errors on insert. `SELECT setval(pg_get_serial_sequence('t', 'id'), COALESCE(MAX(id), 1)) FROM t;` for each table after bulk loads or logical replication cutover.

### D11. `ERROR: could not serialize access due to concurrent update`
Happens in `REPEATABLE READ`/`SERIALIZABLE` when another transaction modified a row. Application must retry the entire transaction. Keep transactions short; consider `READ COMMITTED` with atomic updates if semantics allow.

### D12. Autovacuum never finishes on a big table
Cost limits too low, many indexes, long transactions or replication slot holding xmin, or the table is constantly updated. Increase `autovacuum_vacuum_cost_limit`/lower delay for that table, partition, remove blockers, add workers, run manual `VACUUM` with higher `maintenance_work_mem`.

### D13. Index creation fails or leaves `INVALID` index
`CREATE INDEX CONCURRENTLY` interrupted or conflicting with unique violation. Find `SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;`, drop with `DROP INDEX CONCURRENTLY`, fix data/locks, retry.

### D14. Wrong results after OS upgrade (sorting/index issues)
glibc collation changed; B-tree indexes on text are inconsistent. Run `amcheck` (`bt_index_check`), `REINDEX` affected indexes, consider ICU collations pinned to a version.

### D15. High CPU with low QPS
Possible causes: JIT compile overhead, bad plan (nested loop), regex/pattern scans, huge sorts, parallel workers, extension overhead, too many context switches from connections. Check `pg_stat_statements`, `EXPLAIN (ANALYZE)` for JIT time, `top -H`, and wait events.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `UPDATE` change a row in place?
No. It inserts a new row version and marks the old one dead (except HOT chains reuse space in the same page). That's why heavy updates create bloat and why `VACUUM` exists.

### T2. Does `DELETE` free disk space immediately?
No. Dead tuples remain until vacuum marks the space reusable; the file shrinks only if the tail pages are empty (`VACUUM` can truncate trailing empty pages) or after `VACUUM FULL`/rewrite.

### T3. Does `TRUNCATE` run inside a transaction and roll back?
Yes in PostgreSQL (transactional), but it takes `ACCESS EXCLUSIVE`, is not MVCC-safe for concurrent snapshots that started earlier (those transactions can see an empty table), and doesn't fire row triggers.

### T4. Is `COUNT(*)` fast?
Not on large tables: it must check tuple visibility. Index-only scans help if the visibility map is current. For estimates use `pg_class.reltuples` or `pg_stat_user_tables.n_live_tup`; for exactness at scale maintain counters/summary tables.

### T5. Is `timestamptz` storing the time zone?
No. It stores UTC instant; display depends on session time zone. Information about the original zone is lost.

### T6. Are sequences transactional?
No. `nextval` is never rolled back, so rolled-back inserts leave gaps and concurrent transactions get interleaved values. Don't use sequences for gap-free numbering (use a counter table with row locks).

### T7. Is `SELECT ... FOR UPDATE` needed to avoid lost updates in `READ COMMITTED`?
For `UPDATE t SET x = x + 1`, no (row-level lock and re-check handle it). For read-modify-write in the app (SELECT then UPDATE with computed value), yes (or use optimistic versioning or atomic SQL).

### T8. Can an index make a query slower?
Yes: wrong plan choice due to estimates, write overhead, lock contention on index pages, bloat, or planner picking an index scan over a better seq/bitmap scan. Verify with `EXPLAIN ANALYZE`.

### T9. What is the difference between `VACUUM` and `VACUUM FULL`?
`VACUUM` marks dead space reusable without blocking normal reads/writes. `VACUUM FULL` rewrites the entire table into new files, returning space to the OS, but takes an `ACCESS EXCLUSIVE` lock and needs extra disk space.

### T10. Why does `NOT IN` perform terribly or return nothing?
NULLs in the subquery return UNKNOWN for all comparisons; and `NOT IN (subquery)` often prevents efficient anti-join plans. Use `NOT EXISTS`.

### T11. Why can two identical queries have different plans?
Different parameter values (generic vs custom plans), statistics changes, `work_mem`, parallel settings, different data distribution (replica vs primary), or session settings.

### T12. Why doesn't `LIKE 'abc%'` use my B-tree index?
Non-C locale collation requires `text_pattern_ops` (or `varchar_pattern_ops`) operator class; or the function wrapper (`lower()`) requires a matching expression index.

### T13. Are foreign keys indexed automatically?
No, only the referenced PK/unique side is. Always index the referencing columns, otherwise parent deletes/updates scan the child table.

### T14. Does `ANALYZE` lock the table?
It takes a `SHARE UPDATE EXCLUSIVE` lock: concurrent reads/writes continue, but DDL and other vacuums wait.

### T15. Are `CHECK` constraints validated on existing rows when added?
Yes (full scan, blocking writes during the check) unless added `NOT VALID`; then new rows are checked immediately and you validate later with a weaker lock.

### T16. Is DDL replicated by logical replication?
No. Schema changes must be applied on both sides in a compatible order. Physical replication replicates everything including DDL.

### T17. What does `SELECT FOR UPDATE` lock in joins?
Rows from all tables in the query unless you specify `OF table`. Use `FOR UPDATE OF orders` to limit.

### T18. Why might `pg_dump` be consistent but slow?
It runs in a single transaction snapshot (repeatable read), reading everything. It also holds back vacuum cleanup via its snapshot for the duration, so dumps of huge DBs can cause bloat. Use parallel directory format or physical backups.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Process model?** Process per connection (postmaster forks backends).
- **Default isolation?** Read Committed.
- **MVCC cleanup?** `VACUUM` / autovacuum.
- **Planner stats refresh?** `ANALYZE`.
- **Row version columns?** `xmin`, `xmax`.
- **Write-ahead log purpose?** Durability, replication, PITR.
- **Physical replication?** Streaming WAL to standbys.
- **Logical replication?** Publications/subscriptions of row changes.
- **Best JSON type?** `JSONB`.
- **Index for JSONB/array containment?** GIN.
- **Index for huge ordered time-series?** BRIN.
- **Index for ranges/geometry/exclusion?** GiST.
- **Case-insensitive search?** `ILIKE`, `citext`, `lower()` index, trigram.
- **Upsert?** `INSERT ... ON CONFLICT`.
- **Latest row per group?** `DISTINCT ON` or window function.
- **Per-row subquery join?** `LATERAL`.
- **Bulk load?** `COPY`.
- **Online index build?** `CREATE INDEX CONCURRENTLY`.
- **Online table repack?** `pg_repack`.
- **Pooler?** PgBouncer.
- **HA tool?** Patroni.
- **Backup/PITR tool?** pgBackRest, Barman, WAL-G.
- **Query stats extension?** `pg_stat_statements`.
- **Vector extension?** `pgvector`.
- **Geospatial extension?** PostGIS.
- **Multi-tenant isolation feature?** Row Level Security.
- **Slow query log setting?** `log_min_duration_statement`.
- **Transaction ID problem?** Wraparound; freeze via vacuum.
- **Replication slot danger?** WAL retention filling disk.
- **Connection limit fix?** Pooling.
- **Fast safe `NOT NULL` add?** `CHECK ... NOT VALID` + validate.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a PostgreSQL performance problem you solved.
STAR: "Our orders API p95 reached 3 s. `pg_stat_statements` showed one query consuming 40% of total time. `EXPLAIN (ANALYZE, BUFFERS)` showed a nested loop with a 200k-row misestimate, caused by correlated filters. I added extended statistics on `(tenant_id, status)`, a partial composite index, and a keyset pagination query. p95 dropped to 120 ms. I added the query to our regression dashboard and enabled `auto_explain` for slow plans."

### P2. Describe a production incident (bloat, locks, replication, wraparound).
Example: replication slot left by a decommissioned consumer retained 400 GB of WAL and filled the disk. We dropped the slot, expanded storage, added alerts on retained WAL and `max_slot_wal_keep_size`, and documented consumer decommission steps.

### P3. How do you run zero-downtime migrations?
Use `lock_timeout`, expand/backfill/contract, `CONCURRENTLY` indexes, `NOT VALID` constraints, batch backfills with `SKIP LOCKED`, feature flags in the app, and staging rehearsals on production-size data.

### P4. How do you decide between JSONB and relational columns?
Relational for core, queried, constrained attributes (integrity, joins, statistics). JSONB for sparse, evolving or externally-shaped attributes, with GIN/expression indexes on hot keys. Revisit if a JSON key becomes core; migrate it to a column.

### P5. How do you ensure backups are reliable?
pgBackRest with WAL archiving, retention policy, monitoring `pg_stat_archiver`, scheduled automated restore tests to a scratch environment with integrity checks and a documented RTO.

### P6. How do you choose between sync and async replication?
By RPO/RTO and latency tolerance: sync (quorum) for critical financial data, async for performance-sensitive or cross-region replicas, plus delayed replica for human errors.

### P7. How do you review a SQL PR?
Check correctness (NULLs, joins), indexes and `EXPLAIN` on realistic data, lock impact of DDL, `lock_timeout`, backward compatibility with running code, rollback plan, and naming/standards.

### P8. What do you do first when "the database is slow"?
Check whether it's saturated (`pg_stat_activity` by state and wait events, CPU, I/O, connections), find top queries, check locks/blockers and replication/vacuum status, then analyze the worst plan before changing settings.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Basics:** psql, schemas, roles, data types, constraints, identity/sequences, transactions, `RETURNING`, `ON CONFLICT`, `COPY`.
- **Advanced SQL:** CTEs, recursive CTEs, windows, `LATERAL`, `DISTINCT ON`, `FILTER`, grouping sets, arrays, ranges, JSONB, full-text search, `MERGE`, generated columns, domains, enums, views/materialized views, functions/procedures/triggers (PL/pgSQL), foreign data wrappers.
- **Architecture:** postmaster/backends, shared buffers, WAL, checkpoints, bgwriter, autovacuum, statistics collector/cumulative stats, TOAST, visibility map/free space map, heap/ctid.
- **MVCC and concurrency:** snapshots, isolation levels, SSI, table/row/advisory locks, deadlocks, lock queues, `SKIP LOCKED`, wraparound.
- **Indexing and planning:** B-tree, Hash, GIN, GiST, SP-GiST, BRIN, partial/expression/covering, `EXPLAIN`, cost model, statistics/extended stats, joins, parallel query, JIT.
- **Scale and HA:** partitioning, replication (physical/logical/sync), slots, Patroni, PgBouncer, Citus, read replicas, failover, `pg_rewind`, backups and PITR, `pg_upgrade`.
- **Operations and security:** configuration, logging, monitoring, extensions, RLS, `pg_hba.conf`, TLS, `pgaudit`, hardening, migrations, upgrades.
- **Ecosystem:** PostGIS, pgvector, TimescaleDB, pg_partman, pg_cron, pg_repack, Debezium, ORMs (Prisma, SQLAlchemy, Hibernate, Sequelize, Drizzle).

## Mixed topics
- PostgreSQL + backend: pooling, prepared statements, transactions with retries, pagination, idempotency, outbox.
- PostgreSQL + analytics: materialized views, columnar extensions (Citus columnar, pg_duckdb), CDC to warehouses.
- PostgreSQL + AI: pgvector for embeddings and RAG, hybrid search (FTS + vectors), text-to-SQL safety (read-only roles, `statement_timeout`).
- PostgreSQL + cloud: RDS/Aurora/AlloyDB/Cloud SQL/Neon/Supabase trade-offs, IAM auth, Multi-AZ, read replicas.
- PostgreSQL + Kubernetes: operators, storage classes, backups to object storage.
- PostgreSQL + security: RLS, least privilege, audit logging, encryption, secrets rotation.

---

# 🔬 Part 12: PostgreSQL Internals

### I1. Data directory layout (`PGDATA`)
`base/` (database directories, one file per relation segment up to 1 GB), `global/` (shared catalogs), `pg_wal/` (WAL), `pg_xact/` (commit status), `pg_multixact/`, `pg_stat/`, `pg_tblspc/`, `postgresql.conf`, `pg_hba.conf`, `postgresql.auto.conf` (from `ALTER SYSTEM`), `PG_VERSION`. Each table has a main fork plus `_fsm` (free space map) and `_vm` (visibility map) forks.

### I2. Page layout
8 KB pages: header, line pointer array (item ids) growing forward, free space, tuples growing backward. `ctid` = (page, item). Tuple header holds `xmin`, `xmax`, `cmin/cmax`, `ctid` (next version), infomask bits, null bitmap. HOT chains link versions within a page via line pointer redirects.

### I3. Commit log and hint bits
`pg_xact` stores commit/abort status per transaction id. To avoid repeated lookups, the first reader that checks sets **hint bits** on the tuple (which can dirty pages during reads). This explains write activity after bulk loads (first read writes hint bits; `VACUUM` or `COPY FREEZE` help).

### I4. Snapshot and visibility
A snapshot = (`xmin`, `xmax`, list of in-progress xids). A tuple is visible if its `xmin` committed before the snapshot and `xmax` is not committed (or is in progress/after the snapshot). Old snapshots (long transactions, replication feedback, slots) hold back the global `xmin` horizon, preventing vacuum from removing dead tuples.

### I5. Query execution pipeline
Parser → rewriter (views, rules) → planner/optimizer (path generation, cost estimation, join order via DP or GEQO) → executor (Volcano/iterator model with plan nodes; JIT can compile expression evaluation and tuple deforming).

### I6. Buffer manager
Shared buffer pool with clock-sweep replacement, pin/usage counts, buffer mapping partitions (LWLocks), ring buffers for large sequential scans and vacuum to avoid polluting the cache, and the OS page cache underneath (double buffering). `pg_buffercache` shows contents.

### I7. WAL record and recovery
WAL records describe changes (with full-page images after a checkpoint for torn-page protection). Recovery starts at the last checkpoint's redo pointer and replays forward until the end of WAL (or a recovery target). Standbys continuously replay. LSN (log sequence number) identifies positions.

### I8. Autovacuum architecture
Launcher wakes every `autovacuum_naptime`, starts workers per database; workers choose tables by dead-tuple/insert/analyze thresholds and wraparound age; cost-based delay throttles I/O. Anti-wraparound vacuums cannot be canceled by lock conflicts as easily and are mandatory.

### I9. Locks implementation
Heavyweight locks (relations, tuples, transaction ids) managed by the lock manager with a wait-for graph checked after `deadlock_timeout`. Lightweight locks (LWLocks) protect shared memory structures. Row locks are stored in tuple headers (`xmax` + flags) and **multixacts** when several transactions lock the same row.

### I10. Replication internals
Walsender streams WAL from the primary's WAL buffers/files; walreceiver on the standby writes to its WAL and the startup process replays it. Logical decoding reads WAL, reconstructs row changes via the catalog snapshot, and outputs through a plugin; slots track consumers' progress.

### I11. Extensibility
Custom types, operators, operator classes/families, index access methods, procedural languages (PL/pgSQL, PL/Python, PL/V8), foreign data wrappers, background workers, hooks. This is why PostGIS, pgvector and TimescaleDB integrate deeply.

### I12. Catalogs and introspection
`pg_catalog` tables (`pg_class`, `pg_attribute`, `pg_index`, `pg_constraint`, `pg_proc`, `pg_type`, `pg_namespace`), `information_schema` (standard), and helper functions (`pg_get_indexdef`, `pg_relation_size`, `pg_get_viewdef`). Useful for tooling and audits.

---

# 📊 Part 13: Reference Tables

### Index type chooser
| Index | Operators | Best for |
|---|---|---|
| B-tree | `= < <= > >= BETWEEN`, sort | general purpose |
| Hash | `=` | equality only (rarely better than B-tree) |
| GIN | `@> <@ ? @@ &&` | arrays, JSONB, full text, trigram |
| GiST | `&& @> <-> <<` | ranges, geometry, KNN, exclusion |
| SP-GiST | prefix, point, network | tries, quadtrees |
| BRIN | min/max per block range | huge append-only ordered tables |

### Lock modes (table level) conflict highlights
| Operation | Typical lock |
|---|---|
| SELECT | ACCESS SHARE |
| SELECT FOR UPDATE | ROW SHARE |
| INSERT/UPDATE/DELETE | ROW EXCLUSIVE |
| VACUUM, ANALYZE, CREATE INDEX CONCURRENTLY | SHARE UPDATE EXCLUSIVE |
| CREATE INDEX | SHARE |
| ALTER TABLE (most), DROP, TRUNCATE, VACUUM FULL | ACCESS EXCLUSIVE |

### Isolation levels in PostgreSQL
| Level | Dirty | Non-repeatable | Phantom | Write skew |
|---|---|---|---|---|
| READ COMMITTED | no | possible | possible | possible |
| REPEATABLE READ | no | no | no (in practice) | possible |
| SERIALIZABLE | no | no | no | prevented (SSI, may abort) |

### Key configuration cheat table
| Parameter | Typical guidance |
|---|---|
| `shared_buffers` | ~25% RAM |
| `effective_cache_size` | 50–75% RAM |
| `work_mem` | 4–64 MB (per node!) |
| `maintenance_work_mem` | 512 MB–2 GB |
| `max_wal_size` | several GB (reduce forced checkpoints) |
| `random_page_cost` | 1.1 for SSD |
| `max_connections` | 100–300 + pooler |
| `autovacuum_vacuum_scale_factor` | 0.01–0.05 for big hot tables |

### Replication options
| Type | Granularity | Version flexibility | Typical use |
|---|---|---|---|
| Streaming (physical) | whole cluster | same major version | HA, read replicas |
| Logical | tables/rows | cross-version | upgrades, CDC, selective |
| Cascading | physical via standby | same | reduce primary load |
| Synchronous | physical (quorum) | same | zero data loss goals |

### Backup options
| Method | Pros | Cons |
|---|---|---|
| `pg_dump` | portable, selective | slow restore for large DBs, no PITR |
| `pg_basebackup` | physical, simple | full copy; incremental only in 17+ |
| pgBackRest/Barman/WAL-G | parallel, incremental, PITR | setup effort |
| Snapshots | very fast | need WAL for consistency/PITR |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```sql
SELECT NULL IS DISTINCT FROM NULL, 1 IS DISTINCT FROM NULL, NULL = NULL;
```
**Output:** `false, true, NULL`.

### O2.
```sql
SELECT 7 / 2, 7 % 2, 7 / 2.0, -7 / 2;
```
**Output:** `3, 1, 3.5000000000000000, -3`. Integer division truncates toward zero.

### O3.
```sql
SELECT '2025-10-24 10:00+05:30'::timestamptz AT TIME ZONE 'UTC';
```
**Output:** `2025-10-24 04:30:00` (a `timestamp` without zone, UTC wall time).

### O4.
```sql
SELECT ARRAY[1,2,3] @> ARRAY[2], ARRAY[1,2] && ARRAY[2,5], 3 = ANY(ARRAY[1,2,3]);
```
**Output:** `true, true, true`.

### O5.
```sql
SELECT '{"a":1,"b":[1,2]}'::jsonb -> 'b' ->> 0, '{"a":1}'::jsonb @> '{"a":1}', '{"a":1}'::jsonb ? 'b';
```
**Output:** `1, true, false`.

### O6.
```sql
CREATE TABLE t (id INT GENERATED ALWAYS AS IDENTITY, v INT);
INSERT INTO t (v) VALUES (1);
BEGIN; INSERT INTO t (v) VALUES (2); ROLLBACK;
INSERT INTO t (v) VALUES (3);
SELECT id FROM t ORDER BY id;
```
**Output:** `1, 3`. The rolled-back insert consumed id 2.

### O7.
```sql
SELECT date_trunc('month', timestamp '2025-10-24 15:45'), extract(dow FROM date '2025-10-24'), age(date '2025-10-24', date '2000-01-01');
```
**Output:** `2025-10-01 00:00:00`, `5` (Friday; Sunday = 0), `25 years 9 mons 23 days`.

### O8.
```sql
SELECT string_agg(x::text, ',' ORDER BY x DESC) FROM generate_series(1,4) x;
```
**Output:** `4,3,2,1`.

### O9.
Two sessions, `READ COMMITTED`, `accounts(id=1, bal=100)`:
- S1: `BEGIN; UPDATE accounts SET bal = bal + 50 WHERE id = 1;`
- S2: `UPDATE accounts SET bal = bal + 20 WHERE id = 1;` (blocks)
- S1: `COMMIT;`
**Result:** S2 proceeds after S1 commits, re-evaluates against the new row version, and ends with `bal = 170`.

### O10.
```sql
SELECT COUNT(*), COUNT(x), AVG(x) FROM (VALUES (1),(NULL),(5)) v(x);
```
**Output:** `3, 2, 3.0000000000000000`.

### O11.
```sql
EXPLAIN SELECT * FROM users WHERE lower(email) = 'a@b.com';
```
**Result:** `Seq Scan` unless an index on `lower(email)` exists, in which case `Index Scan using idx_lower_email`.

### O12.
```sql
SELECT 'abc' < 'abd', 'B' < 'a', 'B' < 'a' COLLATE "C";
```
**Output:** the first is `true`. The second and third depend on collation: with the `C` collation `'B' < 'a'` is `true` (uppercase letters sort before lowercase by byte value), while with a locale such as `en_US.UTF-8` it is typically `false` (`a` sorts before `B`). Text ordering depends on collation, so test with your database's actual collation.

---

# ✅ Part 15: MCQs

**1. Which PostgreSQL process model is used for client connections?**
A) Thread per connection  B) Process per connection  C) Single process  D) Coroutines
**Answer: B**

**2. What does `VACUUM` do?**
A) Rebuilds all indexes  B) Removes dead tuples and updates the visibility map  C) Encrypts tables  D) Compresses WAL
**Answer: B**

**3. Which index type fits `jsonb @> '{"a":1}'`?**
A) B-tree  B) GIN  C) BRIN  D) Hash
**Answer: B**

**4. Which clause performs an upsert?**
A) `ON DUPLICATE KEY UPDATE`  B) `ON CONFLICT DO UPDATE`  C) `REPLACE INTO`  D) `UPSERT`
**Answer: B**

**5. `timestamptz` stores:**
A) Time zone name with timestamp  B) A UTC instant, displayed in the session time zone  C) Local time only  D) Seconds since 2000
**Answer: B**

**6. What lets you build an index without blocking writes?**
A) `CREATE INDEX ONLINE`  B) `CREATE INDEX CONCURRENTLY`  C) `CREATE INDEX NOWAIT`  D) `CREATE UNLOGGED INDEX`
**Answer: B**

**7. What does an abandoned replication slot cause?**
A) Faster vacuum  B) WAL retention that can fill the disk  C) Automatic failover  D) Index bloat only
**Answer: B**

**8. Default isolation level:**
A) Read Uncommitted  B) Read Committed  C) Repeatable Read  D) Serializable
**Answer: B**

**9. Which tool commonly manages HA/failover for PostgreSQL?**
A) Patroni  B) Flyway  C) Redis Sentinel  D) HAProxy only
**Answer: A**

**10. The best index for huge append-only time-ordered tables with low overhead:**
A) GIN  B) BRIN  C) Hash  D) SP-GiST
**Answer: B**

**11. `EXPLAIN ANALYZE` on an `UPDATE` will:**
A) Only estimate  B) Execute the update  C) Roll back automatically  D) Lock the database
**Answer: B**

**12. Which setting is allocated per sort/hash node per query?**
A) `shared_buffers`  B) `work_mem`  C) `wal_buffers`  D) `max_wal_size`
**Answer: B**

**13. Transaction ID wraparound is prevented by:**
A) Reindexing  B) Freezing via VACUUM  C) Increasing `work_mem`  D) Using UUIDs
**Answer: B**

**14. Which statement is true about DDL in PostgreSQL?**
A) It auto-commits  B) It is transactional  C) It cannot be rolled back  D) It never locks
**Answer: B**

**15. A PgBouncer pool mode that multiplexes best:**
A) Session  B) Transaction  C) Statement only for ORMs  D) None
**Answer: B**

**16. What does `FOR UPDATE SKIP LOCKED` do?**
A) Skips locked rows to allow parallel workers  B) Locks the table  C) Waits forever  D) Removes locks
**Answer: A**

**17. How do you make `LIKE 'abc%'` use a B-tree on text with a non-C collation?**
A) Use `text_pattern_ops`  B) Use GIN  C) Use BRIN  D) Cannot
**Answer: A**

**18. Which extension tracks per-query execution statistics?**
A) pg_trgm  B) pg_stat_statements  C) postgis  D) pgcrypto
**Answer: B**

**19. Logical replication cannot automatically replicate:**
A) Row inserts  B) DDL changes  C) Updates  D) Deletes
**Answer: B**

**20. Row Level Security is used for:**
A) Compressing rows  B) Per-row access policies (e.g. tenant isolation)  C) Faster joins  D) Replication
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Running without a connection pooler** and with high `max_connections`.
2. **Leaving transactions open** (idle in transaction), blocking vacuum and holding locks.
3. **Disabling autovacuum** or leaving defaults on huge hot tables.
4. **Ignoring bloat and wraparound age** until an emergency.
5. **`VACUUM FULL` on production tables** during business hours.
6. **No `lock_timeout` in migrations**, causing lock queue outages.
7. **Adding indexes without `CONCURRENTLY`** on busy tables.
8. **Forgetting FK indexes** on referencing columns.
9. **Using `timestamp` instead of `timestamptz`** for events.
10. **Using `float` for money.** Use `numeric` or integer minor units.
11. **Using random UUIDv4 primary keys for huge tables** without considering index locality.
12. **Large `OFFSET` pagination.**
13. **`SELECT *` on wide/TOASTed rows.**
14. **Putting everything in JSONB.**
15. **Setting `work_mem` globally too high.**
16. **Abandoned replication slots.**
17. **Not testing restores or PITR.**
18. **Granting superuser to applications.**
19. **Skipping `ANALYZE` after bulk loads or major version upgrades.**
20. **Relying on sequence values being gap-free.**
21. **Using `NOT IN` with nullable subqueries.**
22. **Running `EXPLAIN ANALYZE` on DML without a transaction rollback.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain MVCC, vacuum, bloat, HOT updates, freezing and wraparound clearly and tie them to real symptoms.
- You read `EXPLAIN (ANALYZE, BUFFERS)` and fix root causes (statistics, indexes, rewrites) before tuning knobs.
- You choose the right index type (partial, covering, GIN, BRIN, GiST) and know the cost of each.
- You perform migrations safely (`lock_timeout`, `NOT VALID`, concurrent indexes, batch backfills).
- You operate replication, slots, WAL, backups and PITR with monitoring and tested runbooks.
- You size memory correctly (`work_mem` per node) and use poolers instead of raising `max_connections`.
- You use PostgreSQL features instead of reinventing them: exclusion constraints, RLS, `SKIP LOCKED`, `ON CONFLICT`, `LATERAL`, range types, generated columns.
- You plan major upgrades with `pg_upgrade` or logical replication and validate plans and extensions.
- You know when to extend (pgvector, PostGIS, Timescale, Citus) and when to use another system.
- You document incidents and add guardrails (timeouts, alerts, linters).

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands
```sql
SELECT pid, state, wait_event_type, wait_event, now()-query_start AS age, left(query,80) FROM pg_stat_activity WHERE state <> 'idle' ORDER BY age DESC;
EXPLAIN (ANALYZE, BUFFERS) <query>;
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;
SELECT slot_name, active, restart_lsn FROM pg_replication_slots;
\d+ table   \di+   \x   \timing
```

### MVCC in 30 seconds
Updates create new tuple versions; readers see snapshots; old versions linger until vacuum; long transactions block cleanup; freeze before 2 billion xids; HOT updates + fillfactor reduce bloat.

### Migration checklist
`SET lock_timeout` • `CREATE INDEX CONCURRENTLY` • add columns nullable (or constant default) • `NOT VALID` then `VALIDATE` • backfill in batches • avoid table rewrites • test on production-size data • rollback plan.

### Performance checklist
Slow query from `pg_stat_statements` → `EXPLAIN (ANALYZE, BUFFERS)` → compare estimate vs actual → stats/indexes/rewrite → check vacuum/bloat → config last.

### HA/DR checklist
Streaming replicas (sync where needed) • Patroni or managed failover • PgBouncer routing • WAL archiving + base backups (pgBackRest) • PITR tested • delayed replica • slot and lag alerts • failover drills.

### Interview strategy
1. Define the concept in one sentence and name the PostgreSQL mechanism (MVCC, WAL, planner, etc.).
2. Show the SQL or config and the system view you would check.
3. Mention trade-offs (durability vs speed, bloat vs updates, sync vs async).
4. Add version specifics (12, 15, 16, 17).
5. Close with a concrete incident or optimization story.

### Final checklist before the interview
- [ ] Explain MVCC, vacuum/autovacuum, bloat, HOT, freezing/wraparound.
- [ ] Explain WAL, checkpoints, streaming vs logical replication, slots, PITR.
- [ ] Choose among B-tree, GIN, GiST, BRIN, partial and covering indexes; read an `EXPLAIN (ANALYZE, BUFFERS)` plan.
- [ ] Describe locks, lock queues, deadlocks, isolation levels, `SKIP LOCKED`, advisory locks.
- [ ] Write safe migrations and explain pooling with PgBouncer.
- [ ] Explain JSONB, arrays, ranges, full-text search, RLS and extensions (pg_stat_statements, pgvector, PostGIS).
- [ ] Prepare a performance story and an incident story with root cause and prevention.

