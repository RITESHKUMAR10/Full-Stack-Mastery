# SQLite Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **SQLite 3.40 to 3.47** (the version bundled in your language or OS can be older; check with `SELECT sqlite_version();`). Features that matter in interviews are marked with the version they arrived in: `UPSERT` (3.24), window functions (3.25), `RENAME COLUMN` (3.25), generated columns (3.31), `RETURNING`, `DROP COLUMN` and built-in math functions (3.35), `STRICT` tables (3.37), built-in JSON and the `->` / `->>` operators (3.38), `unixepoch()` (3.38), `RIGHT` and `FULL JOIN` and `IS DISTINCT FROM` (3.39), binary `JSONB` (3.45). Verify details in the official docs (sqlite.org/docs.html) for the version you ship. Examples use the sample name **Ritesh Kumar**.
> General SQL (joins, windows, normalization) is covered in `026_SQL.md`, MySQL in `027_MySQL.md` and PostgreSQL in `028_PostgreSQL.md`. This file focuses on **SQLite specifics**: the embedded architecture, dynamic typing and type affinity, rowid tables, PRAGMAs, journal modes and WAL, locking and concurrency, `BUSY` errors, transactions, JSON and FTS5, performance tuning, backups, replication tools (Litestream, LiteFS, libSQL), usage from Python, Node.js, Go and mobile, security, internals, and when to choose SQLite (or not).

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
- [Part 12: SQLite Internals](#-part-12-sqlite-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is SQLite?
A **self-contained, serverless, zero-configuration, transactional SQL database engine** delivered as a C library. The whole database (tables, indexes, triggers, views) lives in a **single ordinary file**. There is no separate server process: your application links the library and reads and writes the file directly. SQLite is in the public domain, is the most widely deployed database in the world (phones, browsers, operating systems, airplanes, desktop apps), and is also a popular application file format.

### Q2. How is SQLite different from MySQL or PostgreSQL? *(Must-know)*
| | SQLite | MySQL / PostgreSQL |
|---|---|---|
| Architecture | library inside your process | separate server process(es) over a network |
| Storage | one file (plus temporary `-wal`/`-journal` files) | data directory managed by a server |
| Setup | none | install, configure, users, ports |
| Users / auth | none (file permissions only) | users, roles, grants |
| Concurrency | many readers, **one writer at a time** | many concurrent writers (row-level MVCC) |
| Typing | dynamic (type affinity) | strict static types |
| Scale-out | single machine, single file | replicas, clustering, sharding |
| Best for | embedded, local, edge, small-to-medium sites, tests | multi-user server workloads |

### Q3. Where is SQLite used?
Mobile apps (Android and iOS store data in SQLite, e.g. Android Room), web browsers (Chrome, Firefox, Safari store history and cookies), desktop apps (Git GUIs, Skype, Photos), operating systems, IoT devices and cars, application file formats (instead of ZIP-of-XML), unit tests and prototypes, command-line tools, edge platforms (Cloudflare D1, Turso/libSQL, Fly.io with LiteFS) and read-heavy production websites.

### Q4. How do you create and open a database?
```bash
sqlite3 shop.db              # creates the file on first write if it does not exist
sqlite3 :memory:             # in-memory database, lost when the connection closes
sqlite3 "file:shop.db?mode=ro" --uri  # read-only open using a URI
```
There is no `CREATE DATABASE` statement. Opening a path is what creates (or opens) a database.

### Q5. Essential `sqlite3` shell dot-commands
```
.help                      list commands            .open shop.db     open file
.tables                    list tables              .schema users     show CREATE statements
.headers on                show column names        .mode column      aligned output (also csv, json, box, table)
.read file.sql             run a script             .import data.csv users   import CSV
.output out.txt            redirect output          .dump             SQL text dump of the database
.backup backup.db          online backup            .indexes users    list indexes
.timer on                  show timing              .quit             exit
```
Dot-commands are shell features, not SQL, and have no trailing semicolon.

### Q6. Create a table with typical SQLite features
```sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,           -- alias of rowid, auto-assigned
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  city        TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))   -- ISO-8601 UTC text
);
```
A default that is an expression needs parentheses. There is no `AUTO_INCREMENT` keyword needed for `INTEGER PRIMARY KEY`.

### Q7. What are SQLite's storage classes? *(Must-know)*
Every stored value has one of five **storage classes**: `NULL`, `INTEGER` (1–8 bytes, signed), `REAL` (8-byte IEEE float), `TEXT` (UTF-8, UTF-16LE or UTF-16BE), and `BLOB` (raw bytes). `typeof(x)` returns the class of a value.
```sql
SELECT typeof(1), typeof(1.5), typeof('a'), typeof(x'FF'), typeof(NULL);
-- integer | real | text | blob | null
```

### Q8. What is dynamic typing / type affinity? *(Must-know)*
In most databases the **column** decides the type of every value. In SQLite the **value** carries its type; the column declares only a preferred **type affinity** that influences conversion on insert. The five affinities and how a declared type maps to one:
| Declared type contains... | Affinity |
|---|---|
| `INT` | INTEGER |
| `CHAR`, `CLOB`, `TEXT` | TEXT |
| `BLOB` or no type | BLOB (also called NONE) |
| `REAL`, `FLOA`, `DOUB` | REAL |
| anything else (`NUMERIC`, `DECIMAL`, `BOOLEAN`, `DATE`) | NUMERIC |
So `VARCHAR(10)` is TEXT affinity and the `(10)` is **ignored**: a longer string is stored in full. A `BOOLEAN` or `DATETIME` column has NUMERIC affinity.

### Q9. What happens when you insert text into an INTEGER column?
With INTEGER affinity, SQLite tries to convert the text to an integer if it looks like one. `'42'` becomes `42`, but `'abc'` is stored as text without an error (in a normal table).
```sql
CREATE TABLE t (n INTEGER);
INSERT INTO t VALUES ('42'), ('abc'), (4.0), (4.5);
SELECT n, typeof(n) FROM t;
-- 42 integer | abc text | 4 integer | 4.5 real
```
Use **STRICT tables** to reject wrong types (Q10).

### Q10. STRICT tables (3.37) *(Must-know)*
```sql
CREATE TABLE orders (
  order_id    INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  amount      REAL    NOT NULL,
  note        TEXT
) STRICT;
INSERT INTO orders (customer_id, amount) VALUES ('x', 10);   -- error: cannot store TEXT value in INTEGER column
```
Allowed STRICT types: `INT`, `INTEGER`, `REAL`, `TEXT`, `BLOB`, `ANY`. STRICT gives type safety like other databases and is recommended for new schemas. Older SQLite versions cannot open databases that use STRICT tables.

### Q11. Does SQLite have BOOLEAN, DATE, DECIMAL types?
No native types. Booleans are stored as integers `0`/`1` (the keywords `TRUE` and `FALSE` are aliases for 1 and 0 since 3.23). Dates and times are stored as **TEXT** (ISO-8601: `'2025-10-24 10:30:00'`), **REAL** (Julian day number) or **INTEGER** (Unix time) and handled by built-in functions. For money use **INTEGER minor units** (paise or cents) because floats are inexact and there is no exact decimal type.

### Q12. `rowid` and `INTEGER PRIMARY KEY`
Every ordinary table has a hidden 64-bit signed `rowid` (also `oid`, `_rowid_`). If you declare a column exactly as `INTEGER PRIMARY KEY` it **becomes an alias** for `rowid`, which makes lookups by it the fastest possible (a direct B-tree search with no separate index). New rows get `max(rowid)+1`. `INT PRIMARY KEY` or `BIGINT PRIMARY KEY` is **not** an alias (a common trap): it creates a separate unique index.

### Q13. `AUTOINCREMENT` vs plain `INTEGER PRIMARY KEY`
Without `AUTOINCREMENT`, SQLite picks `max(rowid)+1` and may **reuse** the id of a deleted last row. With `AUTOINCREMENT`, ids are never reused (tracked in the `sqlite_sequence` table), at a small CPU and I/O cost. The docs advise to omit it unless you need the no-reuse guarantee.

### Q14. Get the id of the last inserted row
```sql
INSERT INTO customers (name, email) VALUES ('Ritesh Kumar', 'ritesh@example.com') RETURNING customer_id;   -- 3.35+
SELECT last_insert_rowid();      -- per connection
```
`RETURNING` is the safer way (it works with several rows and avoids connection-sharing mistakes).

### Q15. Foreign keys are OFF by default *(Must-know)*
Foreign key enforcement is a per-connection setting, disabled by default for backward compatibility. Turn it on **every time you open a connection**:
```sql
PRAGMA foreign_keys = ON;
```
Without it, `REFERENCES` clauses are parsed but not enforced. Check with `PRAGMA foreign_keys;` and audit existing data with `PRAGMA foreign_key_check;`. Changing the setting inside a transaction has no effect.

### Q16. Basic CRUD
```sql
INSERT INTO customers (name, email, city) VALUES ('Ritesh Kumar', 'ritesh@example.com', 'Delhi');
SELECT customer_id, name FROM customers WHERE city = 'Delhi' ORDER BY name LIMIT 10;
UPDATE customers SET city = 'Noida' WHERE customer_id = 1;
DELETE FROM customers WHERE customer_id = 1;
```
`LIMIT x OFFSET y` or `LIMIT y, x` (note the reversed order in the comma form). There is no `TOP`.

### Q17. Strings in SQLite: quoting rules
Single quotes are string literals (`'text'`). Double quotes are for identifiers (`"column name"`). SQLite has a legacy misfeature: if a double-quoted token matches no column it is treated as a string literal, hiding typos. Disable it in applications with `sqlite3_db_config(SQLITE_DBCONFIG_DQS_DML, 0)` or compile options; always use single quotes for strings. Also supports `[brackets]` and backticks for identifiers (compatibility).

### Q18. Operators and quirks
- `||` is string concatenation (not logical OR). `CONCAT()` and `concat_ws()` exist from 3.44.
- `=` and `==` are the same. `<>` and `!=` are the same.
- `/` on two integers is **integer division**: `7/2 = 3`. Use `7/2.0` or `CAST`.
- `x IS y` compares NULL-safely; `IS DISTINCT FROM` exists from 3.39.
- Comparison between different storage classes sorts `NULL < numbers < TEXT < BLOB`.
- `LIKE` is **case-insensitive for ASCII** by default; `GLOB` is case-sensitive with Unix wildcards (`*`, `?`, `[a-z]`).

### Q19. Date and time functions *(Must-know)*
```sql
SELECT date('now'), time('now'), datetime('now'), datetime('now', 'localtime');
SELECT datetime('now', '+7 days'), datetime('now', 'start of month'), date('2025-10-24', '-1 month');
SELECT strftime('%Y-%m-%d %H:%M', 'now'), strftime('%w', '2025-10-24');     -- %w: weekday, Sunday = 0
SELECT julianday('2025-12-25') - julianday('now') AS days_left;
SELECT unixepoch('now'), datetime(1761300000, 'unixepoch');                  -- 3.38+ for unixepoch()
```
'now' is **UTC**. Use the `'localtime'` modifier only when you really need local time. Because dates are plain text, store them in a sortable ISO format (`YYYY-MM-DD HH:MM:SS`) so text comparison and indexes work.

### Q20. Useful built-in functions
Text: `length`, `substr`, `instr`, `replace`, `trim`, `upper`, `lower`, `printf`/`format`, `like`, `glob`. Numeric: `abs`, `round`, `max`, `min` (scalar with several args), math functions (3.35+: `ceil`, `floor`, `sqrt`, `pow`, `ln`, `log10`; need the math option, enabled in most builds). Aggregates: `count`, `sum`, `total`, `avg`, `group_concat`, `min`, `max`. Others: `coalesce`, `ifnull`, `nullif`, `iif`, `typeof`, `random()`, `randomblob(n)`, `hex`, `quote`, `json_*`.
`sum()` of no rows is `NULL`; `total()` returns `0.0`.

### Q21. Aggregation and `GROUP BY`
Standard, but SQLite is lenient: a bare (non-aggregated) column in an aggregate query returns a value from an arbitrary row (except that with a single `min()` or `max()` aggregate, bare columns come from the row that held the min or max):
```sql
SELECT name, max(salary) FROM employees;       -- name belongs to the highest-paid row (SQLite specific)
```
Do not rely on this in portable code.

### Q22. JOINs supported
`INNER`, `LEFT [OUTER]`, `CROSS`, `NATURAL`. `RIGHT` and `FULL OUTER JOIN` have been supported since 3.39 (2022); before that, emulate with `UNION` of `LEFT JOIN`s. `USING (col)` is supported.

### Q23. Subqueries, CTEs, window functions
All supported: CTEs (`WITH`, `WITH RECURSIVE`) since 3.8.3, window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `NTILE`, `SUM() OVER`, frames) since 3.25.
```sql
SELECT name, dept, salary,
       RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
FROM employees;
```
SQLite does not support stored procedures, user-defined SQL functions written in SQL, or `CREATE USER`/`GRANT`.

### Q24. UPSERT (3.24)
```sql
INSERT INTO page_views (page_id, views) VALUES (7, 1)
ON CONFLICT (page_id) DO UPDATE SET views = views + 1;

INSERT INTO customers (email, name) VALUES ('ritesh@example.com', 'Ritesh Kumar')
ON CONFLICT (email) DO UPDATE SET name = excluded.name;
```
Older alternatives: `INSERT OR REPLACE` (deletes and reinserts, so it can reset other columns and cascade deletes), `INSERT OR IGNORE`, `REPLACE INTO`.

### Q25. Conflict clauses: `OR ABORT / FAIL / IGNORE / REPLACE / ROLLBACK`
```sql
INSERT OR IGNORE INTO tags (name) VALUES ('sql');       -- skip rows that violate constraints
INSERT OR REPLACE INTO tags (id, name) VALUES (1, 'x'); -- delete conflicting row then insert
UPDATE OR FAIL ...
```
Default is `ABORT` (statement rolled back, transaction continues). `REPLACE` is destructive: it silently removes the old row.

### Q26. Constraints
`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `FOREIGN KEY ... ON DELETE CASCADE | SET NULL | RESTRICT | NO ACTION`, `COLLATE NOCASE`, generated columns. A `PRIMARY KEY` on a non-INTEGER column does **not** imply `NOT NULL` in ordinary tables (a historical bug kept for compatibility); always add `NOT NULL`.

### Q27. Indexes
```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
CREATE UNIQUE INDEX uq_customers_email ON customers (email COLLATE NOCASE);
CREATE INDEX idx_active ON users (email) WHERE active = 1;           -- partial index
CREATE INDEX idx_lower_name ON customers (lower(name));              -- expression index
```
All indexes are B-trees. Covering indexes happen automatically when all needed columns are in the index (SQLite reports `COVERING INDEX` in the query plan). Index columns are descending-capable and collation-aware.

### Q28. `EXPLAIN QUERY PLAN` *(Must-know)*
```sql
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 7 ORDER BY order_date;
-- SEARCH orders USING INDEX idx_orders_customer_date (customer_id=?)
```
Words to know: `SCAN` (full table scan: O(n)), `SEARCH ... USING INDEX` / `USING INTEGER PRIMARY KEY` (index lookup), `USING COVERING INDEX` (no table access), `USE TEMP B-TREE FOR ORDER BY` (a sort), `AUTOMATIC INDEX` (SQLite built a temporary index: you probably need a real one), `CORRELATED SCALAR SUBQUERY`. Plain `EXPLAIN` shows VDBE bytecode instead.

### Q29. `ALTER TABLE` limitations
Supported: `RENAME TO`, `RENAME COLUMN` (3.25), `ADD COLUMN` (must be nullable or have a constant default; cannot be `PRIMARY KEY` or `UNIQUE`), `DROP COLUMN` (3.35; fails if the column is indexed, in a constraint, etc.). Not supported: changing a column type, adding or dropping constraints. Use the **12-step table rebuild**: create new table, copy data, drop old, rename (with foreign keys temporarily off and inside a transaction).

### Q30. Views and triggers
Views are read-only unless you add `INSTEAD OF` triggers. Triggers: `BEFORE/AFTER/INSTEAD OF` on `INSERT/UPDATE/DELETE`, row-level only, with `NEW` and `OLD`, `WHEN` conditions and `RAISE(ABORT, 'msg')`.
```sql
CREATE TRIGGER trg_orders_audit AFTER INSERT ON orders
BEGIN
  INSERT INTO audit_log (table_name, row_id, at) VALUES ('orders', NEW.order_id, datetime('now'));
END;
```

### Q31. Transactions basics
```sql
BEGIN;                       -- same as BEGIN DEFERRED
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;                      -- or ROLLBACK;
SAVEPOINT s1; ... ROLLBACK TO s1; RELEASE s1;
```
Without `BEGIN`, each statement runs in its own implicit transaction (autocommit), and each one costs a disk sync. **Batch many writes inside one transaction** for speed: it can be 100x faster. DDL statements (`CREATE TABLE`, `ALTER`) are transactional in SQLite.

### Q32. ACID in SQLite
SQLite is fully ACID, even across power failures, if the OS and disk honor `fsync`. Atomic commit and rollback use either a **rollback journal** or a **write-ahead log (WAL)**. Isolation is effectively `SERIALIZABLE` (one writer, readers see a consistent snapshot).

### Q33. Limits worth knowing (defaults)
Max database size about **281 TB** (page count × page size), max row or BLOB/TEXT size **1,000,000,000 bytes** (compile-time `SQLITE_MAX_LENGTH`), max columns per table **2000**, max SQL statement length **1,000,000 bytes**, max bound parameters **32766** (since 3.32), max attached databases **10** (up to 125 with compile option). Real limits are usually disk, memory and write concurrency, not these numbers.

### Q34. Attaching multiple databases
```sql
ATTACH DATABASE 'archive.db' AS arch;
INSERT INTO arch.orders SELECT * FROM main.orders WHERE order_date < '2024-01-01';
DETACH DATABASE arch;
```
A transaction across attached databases is atomic in rollback-journal mode; in WAL mode it is atomic per database but not guaranteed across all files after a crash.

### Q35. SQL injection and parameterized queries
SQLite has no users, but injection still destroys data. Always bind parameters:
```python
cur.execute("SELECT * FROM users WHERE email = ?", (email,))            # positional
cur.execute("SELECT * FROM users WHERE email = :e", {"e": email})       # named
```
Never concatenate user input. Identifiers (table or column names) cannot be bound: whitelist them.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. PRAGMAs: what they are and the important ones *(Must-know)*
`PRAGMA` statements query or change SQLite's operating parameters. Some are persistent (stored in the file), most are **per connection**.
| PRAGMA | Purpose |
|---|---|
| `foreign_keys = ON` | enforce FKs (per connection) |
| `journal_mode = WAL` | switch journaling (persistent for WAL) |
| `synchronous = NORMAL / FULL / OFF / EXTRA` | durability vs speed |
| `busy_timeout = 5000` | wait up to 5 s on lock instead of failing |
| `cache_size = -64000` | page cache: negative = KiB (here 64 MB) |
| `temp_store = MEMORY` | temp tables and indexes in RAM |
| `mmap_size = 268435456` | memory-map up to 256 MB of the file |
| `page_size = 4096` | set before the database is created or via `VACUUM` |
| `user_version = 7` | your own schema version number (stored in the header) |
| `application_id` | identifies a file format |
| `integrity_check` / `quick_check` | verify database structure |
| `foreign_key_check` | list FK violations |
| `table_info(t)` / `table_xinfo` / `index_list(t)` / `index_info(i)` | schema introspection |
| `optimize` | cheap, run periodically or before closing; updates planner stats |
| `wal_checkpoint(TRUNCATE)` | force a WAL checkpoint |

### Q37. Journal modes *(Must-know)*
- **DELETE** (default): old pages are copied to a `-journal` file before changes; deleted at commit.
- **TRUNCATE / PERSIST**: variants that avoid deleting the journal file.
- **MEMORY**: journal in RAM (fast, unsafe if the process crashes mid-transaction).
- **WAL**: changes are appended to a `-wal` file; readers use the main file plus the WAL.
- **OFF**: no journal; rollback and crash safety are lost.

### Q38. WAL mode: why and how *(Must-know)*
```sql
PRAGMA journal_mode = WAL;        -- returns 'wal'; the setting persists in the database file
PRAGMA synchronous = NORMAL;      -- recommended pairing for WAL
```
Benefits: **readers do not block the writer and the writer does not block readers**, fewer fsyncs (faster commits), good for web apps. Costs: two extra files (`-wal`, `-shm`), the WAL must be checkpointed back into the main file, all processes must be on the **same host** (shared memory file; it does not work over network filesystems), and very large transactions can make the WAL big.

### Q39. WAL checkpoints
A **checkpoint** copies committed pages from the WAL back into the main database file. Automatic by default when the WAL reaches about **1000 pages** (`wal_autocheckpoint`). A checkpoint cannot finish past a page still needed by an active reader, so **long-running read transactions** stop the WAL from shrinking ("WAL growth" problem). Modes: `PASSIVE` (default, never waits), `FULL`, `RESTART`, `TRUNCATE` (also empties the file).

### Q40. `synchronous` levels
`FULL` (2, default): fsync at critical moments; safest. `NORMAL` (1): fewer syncs; in WAL mode a power loss can lose the most recent commits but the database stays consistent (no corruption). `OFF` (0): no syncs, fast, risk of corruption on power loss. `EXTRA` (3): extra syncs for the rollback journal directory. Choose `WAL + NORMAL` for most apps; use `FULL` for money-critical data.

### Q41. Locking and concurrency model (rollback-journal mode) *(Must-know)*
Lock states escalate: `UNLOCKED → SHARED` (reading) `→ RESERVED` (intend to write; only one allowed) `→ PENDING` (waiting for readers to finish; new readers blocked) `→ EXCLUSIVE` (writing; no readers). So in the default mode, a writer must wait for readers, and readers wait during the exclusive phase. Many readers can overlap, but **only one writer at any time**. This is why WAL mode is usually better.

### Q42. `SQLITE_BUSY` and `SQLITE_LOCKED`
`SQLITE_BUSY` (error 5, "database is locked"): another connection (often another process or connection in the same process) holds a conflicting lock. `SQLITE_LOCKED` (6, "database table is locked"): a conflict inside the same connection or shared cache. Fixes: set `PRAGMA busy_timeout` (or the driver's `timeout`), keep transactions short, use WAL, use `BEGIN IMMEDIATE` for write transactions, and ensure statements are finalized or reset (an unfinished `SELECT` keeps a read lock).

### Q43. Transaction types: DEFERRED, IMMEDIATE, EXCLUSIVE *(Must-know)*
- `BEGIN DEFERRED` (default): no lock until the first read (SHARED) or write (tries RESERVED).
- `BEGIN IMMEDIATE`: takes the write lock (RESERVED) at once. If you plan to write, use this: it fails early with BUSY (and waits per `busy_timeout`) instead of failing in the middle.
- `BEGIN EXCLUSIVE`: like IMMEDIATE in WAL mode; in rollback mode it also blocks readers.
A classic bug: a deferred transaction reads, then tries to upgrade to write while another writer is active, causing an immediate BUSY that `busy_timeout` cannot resolve (deadlock avoidance). Start write transactions with `BEGIN IMMEDIATE`.

### Q44. Connection patterns for web apps
A proven pattern: **one dedicated writer connection** (serialize writes through a queue or mutex) plus **a pool of read-only connections**, in WAL mode, with `busy_timeout`, `foreign_keys=ON`, and `synchronous=NORMAL`. Don't share a single connection across threads without the driver's thread-safety guarantees (serialized mode). Set pragmas on every new connection.

### Q45. Using SQLite from Python
```python
import sqlite3
con = sqlite3.connect("shop.db", timeout=5.0)          # timeout = busy_timeout in seconds
con.row_factory = sqlite3.Row                           # access columns by name
con.execute("PRAGMA foreign_keys = ON")
con.execute("PRAGMA journal_mode = WAL")
with con:                                               # transaction: commit on success, rollback on exception
    con.execute("INSERT INTO customers (name, email) VALUES (?, ?)", ("Ritesh Kumar", "ritesh@example.com"))
for row in con.execute("SELECT customer_id, name FROM customers"):
    print(row["customer_id"], row["name"])
con.close()
```
Note: the `with con` block commits or rolls back but does **not** close the connection. Python 3.12 added the `autocommit` attribute; the legacy implicit-transaction behavior (opening a transaction before DML) can surprise you, so read the docs for your version.

### Q46. Using SQLite from Node.js
```js
import Database from 'better-sqlite3';                   // synchronous, fast, popular
const db = new Database('shop.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
const insert = db.prepare('INSERT INTO customers (name, email) VALUES (@name, @email)');
const many = db.transaction((rows) => { for (const r of rows) insert.run(r); });
many([{ name: 'Ritesh Kumar', email: 'ritesh@example.com' }]);
console.log(db.prepare('SELECT * FROM customers WHERE email = ?').get('ritesh@example.com'));
```
Others: `sqlite3` (async callback API), `node:sqlite` (built into Node 22.5+, experimental), `Bun` has a built-in `bun:sqlite`, `libsql` client for Turso. `better-sqlite3` is synchronous on purpose: SQLite calls are microseconds on local disk, and sync code avoids thread-pool overhead.

### Q47. Using SQLite from Go, Java, .NET
Go: `modernc.org/sqlite` (pure Go, no cgo) or `mattn/go-sqlite3` (cgo). Java/Kotlin: `sqlite-jdbc`, Android's built-in `SQLiteDatabase` and Room. .NET: `Microsoft.Data.Sqlite`. Rust: `rusqlite`, `sqlx`. Always check which SQLite version the binding bundles.

### Q48. Importing and exporting data
```bash
sqlite3 shop.db ".mode csv" ".headers on" ".import customers.csv customers"
sqlite3 shop.db ".headers on" ".mode csv" "SELECT * FROM customers;" > customers.csv
sqlite3 shop.db .dump > shop.sql          # text dump
sqlite3 new.db < shop.sql                 # restore from dump
```
`.import` into an existing table treats the first row as data unless you use `--skip 1`. Wrap big imports in a transaction (the shell does this for `.import`).

### Q49. Backups: the right ways *(Must-know)*
Do **not** copy the database file with `cp` while it is being written (you may get a torn copy; in WAL mode you must also handle the `-wal`). Use:
```bash
sqlite3 shop.db ".backup backup.db"                 # online backup API (consistent)
sqlite3 shop.db "VACUUM INTO 'backup.db'"           # 3.27+, writes a compacted consistent copy
```
Or the C/driver backup API (`sqlite3_backup_init`, Python `con.backup(dest)`). Verify with `PRAGMA integrity_check` on the copy. For continuous protection use Litestream (Q104).

### Q50. `VACUUM` and `auto_vacuum`
Deleted rows leave free pages inside the file; the file does not shrink by itself. `VACUUM` rebuilds the whole database into a fresh file (needs about 2x free disk and an exclusive lock). `PRAGMA auto_vacuum = INCREMENTAL` (set before creating tables) lets you reclaim space with `PRAGMA incremental_vacuum(N)`. `PRAGMA freelist_count` shows free pages.

### Q51. JSON support (built in since 3.38)
```sql
CREATE TABLE events (id INTEGER PRIMARY KEY, payload TEXT NOT NULL CHECK (json_valid(payload)));
INSERT INTO events (payload) VALUES ('{"user":"Ritesh Kumar","age":28,"tags":["a","b"]}');
SELECT payload ->> '$.user' AS user, payload -> '$.tags' AS tags FROM events;      -- 3.38+
SELECT json_extract(payload, '$.age'), json_array_length(payload, '$.tags') FROM events;
UPDATE events SET payload = json_set(payload, '$.age', 29) WHERE id = 1;
SELECT value FROM events, json_each(events.payload, '$.tags');                     -- explode an array
CREATE INDEX idx_events_user ON events (payload ->> '$.user');                     -- expression index
```
`->` returns JSON text, `->>` returns an SQL value (text, integer, real, NULL). SQLite 3.45 added a binary `JSONB` encoding (functions `jsonb_*`) that is faster to process; store it as BLOB.

### Q52. Generated columns (3.31)
```sql
CREATE TABLE products (
  price_cents INTEGER NOT NULL,
  tax_pct     REAL    NOT NULL,
  total_cents INTEGER GENERATED ALWAYS AS (CAST(round(price_cents * (1 + tax_pct / 100)) AS INTEGER)) VIRTUAL
);
```
`VIRTUAL` (default) is computed on read; `STORED` is saved on write. Both can be indexed. Useful to index JSON fields or normalized text.

### Q53. Full-text search with FTS5 *(Must-know)*
```sql
CREATE VIRTUAL TABLE articles_fts USING fts5(title, body, tokenize = 'porter unicode61');
INSERT INTO articles_fts (title, body) VALUES ('SQLite tips', 'Use WAL mode for concurrency');
SELECT title, bm25(articles_fts) AS score, snippet(articles_fts, 1, '<b>', '</b>', '…', 10)
FROM articles_fts WHERE articles_fts MATCH 'wal AND concurrency' ORDER BY score LIMIT 10;
```
Supports phrase queries (`"exact phrase"`), prefix (`conc*`), `NEAR`, column filters (`title:sqlite`), BM25 ranking, highlight and snippet functions. **External-content** tables (`content='articles'`) plus triggers keep the index in sync without duplicating text. FTS5 is the modern choice; FTS3/FTS4 are older.

### Q54. Other built-in modules
**R*Tree** (spatial range queries on bounding boxes), **Geopoly**, **DBSTAT** virtual table (`dbstat` for page usage), **session** and **sqldiff**/**sqlite3_analyzer** tools, **Math** functions, **Window functions**, **ICU** (optional unicode collation), **Carray**, **Spellfix1**. Community extension collections: **sqlean**, **sqlite-vec** (vector search), **sqlite-vss**, **cr-sqlite** (CRDT sync).

### Q55. Collations
Built in: `BINARY` (default), `NOCASE` (ASCII case-insensitive only), `RTRIM`. Declare per column or per expression: `email TEXT COLLATE NOCASE`. `NOCASE` does not fold non-ASCII (`É` vs `é`); use ICU or store a normalized lowercase column. Indexes use the collation of the column unless overridden.

### Q56. Query results order and `rowid`
Without `ORDER BY`, order is whatever the plan produces (often rowid order for a plain scan), but it is not guaranteed. A query using an index may return rows in index order. Always sort explicitly.

### Q57. Efficient pagination in SQLite
Large `OFFSET` scans and discards rows. Use keyset pagination:
```sql
SELECT id, title FROM posts WHERE id < :last_id ORDER BY id DESC LIMIT 20;
SELECT id, created_at FROM posts WHERE (created_at, id) < (:ts, :id) ORDER BY created_at DESC, id DESC LIMIT 20;   -- row values, 3.15+
```

### Q58. Temp tables, views and CTE materialization
`CREATE TEMP TABLE` lives in a separate temp database for the connection (RAM if `temp_store=MEMORY`). CTEs are inlined when referenced once, and materialized when referenced several times or marked `AS MATERIALIZED` (3.35+); use `AS NOT MATERIALIZED` to force inlining.

### Q59. Unit testing with SQLite
`:memory:` databases are fast and isolated per connection. For multi-connection tests use a shared in-memory DB (`file:memdb1?mode=memory&cache=shared`) or a temp file. Caveat: if production uses PostgreSQL or MySQL, SQLite-based tests miss dialect and concurrency differences; run integration tests on the real engine too.

### Q60. SQLite in the browser and on mobile
Browser: SQLite compiled to **WebAssembly** (official `sqlite-wasm`), persistent via **OPFS** (Origin Private File System) or in-memory; used with workers. Mobile: Android (`SQLiteOpenHelper`, **Room**, SQLDelight), iOS (SQLite.swift, GRDB, Core Data and SwiftData sit on SQLite), React Native/Expo (`expo-sqlite`, WatermelonDB, op-sqlite). Handle schema migrations with `PRAGMA user_version`.

### Q61. Schema migrations with `user_version`
```sql
PRAGMA user_version;               -- read current version (0 for a new file)
BEGIN IMMEDIATE;
-- apply migration N+1 statements
PRAGMA user_version = 3;
COMMIT;
```
Pragmas that change the header work inside a transaction. Frameworks: Alembic, Flyway, Prisma, Drizzle, Room migrations, golang-migrate.

### Q62. The 12-step `ALTER TABLE` rebuild
```sql
PRAGMA foreign_keys = OFF;
BEGIN;
CREATE TABLE users_new (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, age INTEGER) STRICT;
INSERT INTO users_new (id, email, age) SELECT id, email, CAST(age AS INTEGER) FROM users;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
-- recreate indexes, triggers, views
PRAGMA foreign_key_check;
COMMIT;
PRAGMA foreign_keys = ON;
```
Because SQLite cannot alter column types or constraints in place.

### Q63. Why is my write loop slow?
Each autocommit write pays an fsync (milliseconds on SSD, much more on spinning disks). Fix: wrap loops in one transaction, prepare the statement once, use multi-row inserts, `WAL` + `synchronous=NORMAL`, and create indexes **after** a bulk load. Typical gains: from hundreds of rows/sec to hundreds of thousands per second.

### Q64. Prepared statements
Compile once (`sqlite3_prepare_v2`), bind and step many times, then reset or finalize. Drivers hide this, but reuse cursors or `prepare()` objects (as in `better-sqlite3`). Unfinalized or un-reset statements hold locks and prevent `DROP TABLE` or checkpoints.

### Q65. Concurrency mistakes with multiple threads
`SQLITE_THREADSAFE`: single-thread, multi-thread (one connection per thread) or serialized (connections shareable). Python's `sqlite3` by default forbids using a connection in another thread (`check_same_thread=True`). Best practice: one connection per thread, or an explicit write queue.

### Q66. Case: handling `database is locked`
Checklist: (1) set `busy_timeout`; (2) switch to WAL; (3) use `BEGIN IMMEDIATE` for writes; (4) shorten transactions and do not hold a read cursor open while doing slow work; (5) ensure one writer connection or serialized writes; (6) avoid network filesystems (NFS, SMB, some Docker bind mounts on Windows/macOS); (7) check for other processes (backup tools, GUI browsers) holding locks.

### Q67. Network filesystems and containers
SQLite relies on correct file locking and shared memory; NFS and many network or FUSE/virtual file systems have broken or slow locks, causing corruption or `database is locked`. Keep the database on a local disk or volume with POSIX locks; for multi-host access put a server in front (or use LiteFS, rqlite, libSQL server). In Docker use a named volume for the data directory.

### Q68. Reading the schema
```sql
SELECT type, name, tbl_name, sql FROM sqlite_schema;             -- 3.33+ alias of sqlite_master
PRAGMA table_info(customers);
PRAGMA index_list(customers);
PRAGMA foreign_key_list(orders);
```
`sqlite_schema` stores the original `CREATE` text. Don't edit it by hand (`writable_schema` is dangerous).

### Q69. Security considerations in short
No authentication or network surface; protect the file with OS permissions. For encryption at rest use **SQLCipher** (open source) or the commercial SEE. Keep `load_extension` disabled unless needed. Use `SQLITE_DBCONFIG_DEFENSIVE`, `PRAGMA trusted_schema=OFF`, parameterized queries, and treat untrusted `.db` files as hostile input (they can be crafted to trigger bugs).

### Q70. When is SQLite the wrong choice?
Many concurrent writers (write-heavy OLTP), multiple application servers needing the same live database over a network, very large datasets that need sharding/replication, fine-grained access control, heavy analytics across huge columnar data (consider DuckDB), or when you need server-side features like stored procedures, row-level security or logical replication.

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. SQLite architecture (layers) *(Must-know)*
From top to bottom: **interface** (C API: `sqlite3_open`, `prepare`, `step`, `bind`, `column`) → **SQL compiler** (tokenizer, parser (Lemon), code generator, **query planner**) → **VDBE** (virtual machine that runs bytecode) → **B-tree** layer (table and index trees) → **pager** (page cache, transactions, journal/WAL, locking) → **OS interface / VFS** (file I/O, locks, memory mapping; replaceable, which is how SQLite runs on browsers, embedded OSes, and encrypted/remote storage). Everything lives in one library; there is no server or IPC.

### Q72. The database file format
A 100-byte header (magic string `SQLite format 3\0`, page size, file change counter, schema cookie, text encoding, `user_version`, `application_id`) followed by fixed-size **pages** (default 4096 bytes; 512–65536, powers of two). Page types: B-tree interior/leaf pages for tables and indexes, overflow pages for large values, freelist pages, pointer-map pages (auto-vacuum), lock-byte page. The format is stable and documented: the Library of Congress recommends it for long-term data archiving, and SQLite promises backward compatibility through at least the year 2050.

### Q73. Tables are B+trees keyed by rowid; indexes are B-trees
A rowid table is a B+tree whose key is the `rowid` and whose leaves hold the whole row. A secondary index is a B-tree keyed by the indexed columns plus the `rowid`. A lookup through a secondary index finds the rowid, then does a second search in the table tree (unless the index covers the query). This is similar to InnoDB, but the clustered key is the hidden `rowid` unless you use `WITHOUT ROWID`.

### Q74. `WITHOUT ROWID` tables
```sql
CREATE TABLE kv (k TEXT PRIMARY KEY, v BLOB NOT NULL) WITHOUT ROWID;
```
The table itself is organized as a B-tree keyed by the declared `PRIMARY KEY` (no separate rowid and no extra index). Good when the primary key is non-integer or composite, rows are small, and you mostly look up by the key; saves space and one lookup. Not good for very wide rows (over ~1/20 of a page) because the key is repeated in the tree structure. A `PRIMARY KEY` is required and implies `NOT NULL`.

### Q75. How SQLite stores values (record format)
Each row is a record: a header with a varint type code per column followed by the data. Integers use the smallest of 1, 2, 3, 4, 6, 8 bytes; `0` and `1` use zero data bytes. `NULL` trailing columns can be omitted. Hence column order matters slightly (put frequently accessed small columns first, large blobs last) and `ALTER TABLE ADD COLUMN` is cheap (old rows lack the column and return the default).

### Q76. Page cache and memory settings
`PRAGMA cache_size = -65536` sets a 64 MB per-connection page cache (negative = KiB). `PRAGMA mmap_size` uses memory-mapped I/O for reads (can speed read-heavy workloads; avoid on unreliable filesystems). `PRAGMA temp_store = MEMORY`. `PRAGMA page_size` (set before creating content, or follow with `VACUUM`): 4096 is a good default, larger pages (8–16 KB) can help big sequential scans or large rows, smaller pages (1–2 KB) help many tiny rows with random access. Memory limit options: `soft_heap_limit`, `hard_heap_limit`.

### Q77. Recommended pragmas for a typical server-side app
```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
PRAGMA cache_size = -64000;
PRAGMA temp_store = MEMORY;
PRAGMA mmap_size = 268435456;     -- optional; measure
PRAGMA wal_autocheckpoint = 1000; -- default; tune if WAL grows
PRAGMA optimize;                  -- before closing a long-lived connection (or periodically)
```
`journal_mode=WAL` persists in the file; the others must be set for **each connection**.

### Q78. The query planner and `ANALYZE` / `PRAGMA optimize`
SQLite uses a cost-based **Next-Generation Query Planner (NGQP)**. Without statistics it makes assumptions about index selectivity. `ANALYZE` stores statistics in `sqlite_stat1` (and optionally `sqlite_stat4`), improving index choices. `PRAGMA optimize` runs `ANALYZE` only where it seems useful and is cheap; the docs recommend running it just before closing short-lived connections and periodically (for example, every few hours) for long-lived ones. After a major schema or data change run `ANALYZE` manually.

### Q79. Index usage rules in SQLite
- Leftmost-prefix rule for multi-column indexes.
- Equality columns first, then one range column, then sort columns.
- Expressions must match the indexed expression exactly (`lower(name)` index needs `WHERE lower(name) = ?`).
- `LIKE 'abc%'` uses an index only if the column has `COLLATE NOCASE` and the index uses it, or if you use `GLOB`/`>=`/`<` ranges with `BINARY` collation (case-sensitive `LIKE` via `PRAGMA case_sensitive_like`).
- Type affinity matters: comparing a TEXT column to an integer parameter may disable the index; bind the right type.
- Multiple indexes: SQLite uses **one index per table per query** in most cases (it can use OR-optimization, which unions separate index lookups).

### Q80. Covering indexes and the "index only" trick
`EXPLAIN QUERY PLAN` shows `USING COVERING INDEX`. Create a composite index containing all selected columns: `CREATE INDEX i ON orders (customer_id, order_date, amount);`. Since SQLite has no `INCLUDE` clause, extra columns are appended to the key (making the index larger). Partial indexes reduce size.

### Q81. Automatic indexes
When SQLite sees a join without a usable index it may build a transient **automatic index** for the duration of the query (`AUTOMATIC COVERING INDEX` in the plan). It signals a missing index; create a permanent one. Disable with `PRAGMA automatic_index = OFF` to find such queries during tuning.

### Q82. Query tuning workflow
1. Measure: `.timer on`, application timing, `sqlite3_stmt_status`, the `sqlite3_profile`/trace hooks.
2. `EXPLAIN QUERY PLAN` for `SCAN` on big tables, temp B-tree sorts, automatic indexes.
3. Add or fix indexes (order, covering, partial, expression).
4. Run `ANALYZE` / `PRAGMA optimize`.
5. Reduce data: select only needed columns (avoid `SELECT *` on rows with big blobs because overflow pages are read only if you touch the column).
6. Batch writes in transactions; WAL; prepared statements.
7. Re-measure on realistic data sizes.

### Q83. Handling large BLOBs
Rows larger than a page spill to **overflow pages**. SQLite handles BLOBs up to 1 GB, but for files larger than ~100 KB the filesystem is often faster; for files under ~10–100 KB inside the database can be faster than separate files (the "Internal Versus External BLOBs" article reports small blobs reading faster from SQLite). Use incremental BLOB I/O (`sqlite3_blob_open`) to avoid loading all bytes. Keep BLOBs in a separate table so scans of the metadata table stay small.

### Q84. UPDATE, DELETE, and free space behavior
Updates rewrite the row in the B-tree; deleted space goes to the freelist and is reused by later inserts. The file never shrinks until `VACUUM` (or incremental auto-vacuum). Large deletes in one transaction inflate the journal/WAL; delete in batches (`DELETE ... WHERE rowid IN (SELECT rowid ... LIMIT 5000)`). `PRAGMA secure_delete = ON` overwrites deleted content (privacy, slower).

### Q85. Triggers and recursion
`PRAGMA recursive_triggers` is OFF by default (a trigger does not fire itself). Triggers run inside the same transaction. Avoid heavy logic; they are invisible to ORMs and can make bulk operations slow. Use them for audit tables, maintaining FTS indexes, and enforcing complex invariants (`RAISE(ABORT, 'message')`).

### Q86. Handling time zones and dates robustly
Store UTC as ISO-8601 text with a `Z`, or Unix epoch integers. Convert to local time in the application. If you need ordering and range queries, both ISO text and integers index well. Avoid storing local times without an offset. `strftime('%s','now')` returns a text seconds count; `unixepoch()` returns an integer (3.38+).

### Q87. Precision and money
Use integer minor units (e.g. paise/cents) or store decimal strings plus an application decimal library. `REAL` is a binary double: `SELECT 0.1 + 0.2` returns `0.30000000000000004`. `NUMERIC` affinity stores integers when possible, so `DECIMAL(10,2)` columns can hold either type; do not expect fixed scale.

### Q88. Unicode, case and collation limitations
Default `LIKE`/`NOCASE` handle ASCII only. `upper()`/`lower()` only change ASCII letters unless the ICU extension is loaded. For Unicode-aware comparisons, normalize in the application (NFC, case-fold) and store a normalized column, or use ICU/FTS5 `unicode61` tokenizers with `remove_diacritics`.

### Q89. Savepoints and nested transactions
`SAVEPOINT name` / `ROLLBACK TO name` / `RELEASE name` create nested transactions. If no `BEGIN` is active, the outermost savepoint starts a transaction. ORMs use them to emulate nested transactions. A `ROLLBACK TO` does not end the transaction; you still need `COMMIT` or `RELEASE` of the outermost savepoint.

### Q90. Isolation and visibility
In WAL mode a reader's snapshot starts at its first read of the transaction and does not see later commits (snapshot isolation, effectively serializable since writers are serialized). In rollback mode, readers and the writer exclude each other at commit time. There are no dirty reads, except in **shared-cache** mode with `PRAGMA read_uncommitted = 1` (shared cache is discouraged and deprecated).

### Q91. Shared-cache mode: avoid it
`cache=shared` allows connections in one process to share a page cache and uses table-level locks (`SQLITE_LOCKED` errors). The docs discourage it; it exists mostly for memory-constrained embedded devices and shared in-memory databases (`file::memory:?cache=shared`). Prefer WAL with separate connections.

### Q92. Checking and repairing a database
```sql
PRAGMA integrity_check;         -- thorough, slower, returns 'ok' or a list of problems
PRAGMA quick_check;             -- skips index/content cross-checks
PRAGMA foreign_key_check;
```
Recovery: `sqlite3 broken.db ".recover" | sqlite3 fixed.db` salvages readable data (3.29+), or `.dump` into a fresh file. Prevent corruption: avoid network file systems, never delete `-journal`/`-wal` files of a live database, do not copy the file during a write, avoid `synchronous=OFF` and `journal_mode=OFF/MEMORY` for valuable data, keep disk and RAM healthy, don't use SQLite across `fork()`.

### Q93. Hot journals and crash recovery
If the process or machine crashes mid-transaction in rollback mode, a **hot journal** file remains. The next connection detects it and rolls the database back to the last committed state automatically. In WAL mode, recovery replays the committed frames in the WAL on first open. Never delete `-wal`/`-journal` files by hand: you would lose committed data or corrupt the database.

### Q94. Window functions and CTE specifics in SQLite
All standard frames and functions work. `WITH RECURSIVE` can generate series (SQLite has no `generate_series` built in, but the `generate_series` table-valued function exists in the `series` extension; many builds include it):
```sql
WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < 10) SELECT x FROM n;
```
Recursion depth is not limited by default (watch for infinite loops: always include a terminating `WHERE` or `LIMIT`).

### Q95. User-defined functions and extensions
Applications can register custom SQL functions (Python `con.create_function`, `create_aggregate`, `better-sqlite3` `db.function`). Loadable extensions (`load_extension`) are disabled by default for security; enable only when needed and from trusted paths. Popular: sqlean (regex, crypto, fuzzy), sqlite-vec (vectors), sqlite-zstd (compression), cr-sqlite (CRDT).

### Q96. Vector search and AI uses
Embeddings can be stored as BLOBs. Extensions like **sqlite-vec** add vector types and k-NN search (flat scan and ANN variants). Pattern: local-first RAG/semantic search for desktop and mobile apps, or per-tenant indexes at the edge. FTS5 + vectors give hybrid search. Check extension maturity and platform support before depending on it.

### Q97. Deployment on the edge and serverless
Cloudflare **D1** (SQLite at the edge with read replicas), **Turso/libSQL** (fork of SQLite with server mode, replicas, embedded replicas), **Fly.io + LiteFS**, **Bunny/Expo/EdgeDB-like** offerings. Pros: low latency, simple model, cheap per-tenant databases. Cons: write throughput limited to a single primary per database, consistency/replica lag tradeoffs, vendor-specific limits.

### Q98. Litestream *(Must-know)*
Open-source tool that continuously streams a SQLite database's WAL changes to object storage (S3, GCS, Azure Blob, SFTP) for **disaster recovery and point-in-time restore**. Runs as a sidecar process; requires WAL mode; keeps its own checkpoint control. Restore with `litestream restore -o shop.db s3://bucket/shop`. It gives durability across machine loss, not high availability by itself (restores take time). Write latency is unaffected because replication is asynchronous (potential loss of the last few seconds).

### Q99. LiteFS, rqlite, dqlite, libSQL, Turso
- **LiteFS** (Fly.io): FUSE-based distributed file system replicating SQLite to read replicas with a single primary (lease via Consul).
- **rqlite**: lightweight distributed relational DB using SQLite as storage and Raft for consensus (HTTP API).
- **dqlite** (Canonical): Raft + SQLite in a C library (used by LXD).
- **libSQL**: open-contribution fork of SQLite adding features (server mode, replication hooks, extensions like vector search, ALTER improvements).
- **Turso**: hosted libSQL with many small databases and embedded replicas.
Pick based on whether you need replication, HA, or just a managed SQLite.

### Q100. Multi-tenant pattern: database per tenant
SQLite makes "one database file per tenant" cheap: isolation, simple backups, tenant-level restore, easy deletion (GDPR), per-tenant schema versions. Costs: migrations must run across thousands of files, cross-tenant analytics need aggregation pipelines, file-handle and connection management, and many small WAL files. Use a registry database that maps tenants to files, lazily open connections with an LRU cache.

### Q101. Using SQLite as an application file format
Benefits (from sqlite.org's "Appropriate Uses"): atomic updates of complex data, queryable, one file, cross-platform and language-neutral, incremental updates (no rewriting a big ZIP), schema evolution through migrations, versioning with `application_id`/`user_version`. Examples: Adobe Lightroom catalogs, Apple Photos, Git GUIs, Fossil SCM, iTunes. Use `PRAGMA application_id` to mark your type.

### Q102. SQLite vs DuckDB vs PostgreSQL vs files (decision)
| Need | Choose |
|---|---|
| Embedded OLTP, local storage, small servers | SQLite |
| Embedded analytics over columnar/Parquet | DuckDB |
| Many concurrent writers, network clients, rich features | PostgreSQL/MySQL |
| Config or small static data | JSON/TOML files |
| Cache / ephemeral | Redis / in-process |
SQLite can handle surprisingly large workloads: the official "Appropriate Uses" page says sites with fewer than about 100K hits per day usually work fine (and many busier sites do too); with WAL and a single writer it can sustain thousands of write transactions per second on SSD when batched.

### Q103. Performance expectations (rules of thumb)
On a modern SSD with WAL and `synchronous=NORMAL`: tens of thousands of single-row transactions per second are possible; hundreds of thousands to millions of rows per second in batched transactions; reads of indexed lookups in microseconds. Real results depend on hardware, schema and I/O. Always benchmark your own workload with realistic data.

### Q104. Operational runbook: running SQLite in production
Enable WAL; set `busy_timeout`; one writer queue; monitor WAL size and checkpoint lag; run `PRAGMA optimize` periodically; back up with `.backup`/`VACUUM INTO` or Litestream; test restores; place the DB on a local SSD volume; set file permissions; log slow queries in the app; plan schema migrations with `user_version`; alert on `SQLITE_BUSY` rates and disk usage; keep SQLite library patched (pin the version in your container).

### Q105. Docker and Kubernetes notes
Mount a persistent volume for the database directory (not just the file: WAL and SHM files live beside it). One pod per database writer (ReadWriteOnce); multiple replicas writing to the same file is unsafe. Use StatefulSets, graceful shutdown that closes connections and checkpoints, and sidecars like Litestream. Avoid network-attached filesystems with poor locking.

### Q106. Testing concurrency
Write tests that run multiple connections/processes doing reads and writes with random delays; ensure `busy_timeout` is set and `BEGIN IMMEDIATE` is used; check for lost updates (read-modify-write in application code must be inside `BEGIN IMMEDIATE`). Tools: stress scripts, `sqlite3_stmt_status`, and fault injection (kill -9 during writes) to validate crash safety.

### Q107. Common SQLite-specific query patterns
```sql
-- latest row per group using bare column behavior with max()
SELECT customer_id, max(order_date), amount FROM orders GROUP BY customer_id;     -- amount from the max row (SQLite-specific)
-- random sample
SELECT * FROM products ORDER BY random() LIMIT 5;
-- upsert counter with RETURNING
INSERT INTO counters (name, n) VALUES ('hits', 1) ON CONFLICT (name) DO UPDATE SET n = n + 1 RETURNING n;
-- conditional insert
INSERT INTO tags (name) SELECT 'sql' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'sql');
-- delete duplicates keeping smallest rowid
DELETE FROM t WHERE rowid NOT IN (SELECT min(rowid) FROM t GROUP BY email);
```

### Q108. Differences from other databases that surprise people
Dynamic typing, `VARCHAR(n)` not enforced, FKs off by default, `ALTER TABLE` limits, no `RIGHT JOIN` before 3.39, no stored procedures, single writer, `LIMIT` with `OFFSET` syntax variants, case-insensitive `LIKE`, integer division, `'now'` in UTC, no boolean type, `true`/`false` are 1/0, double-quoted strings as literals, `NULL` handling in `UNIQUE` (multiple NULLs allowed), `PRIMARY KEY` allowing NULL in rowid tables.

### Q109. Migrating from SQLite to PostgreSQL/MySQL
Reasons: write concurrency, multiple servers, richer features. Steps: normalize types (dates to proper types, booleans), enable STRICT/CHECKs first to surface dirty data, export via CSV or tools (pgloader, `sqlite3 .dump` with edits), recreate schema with constraints and sequences, load, verify counts/checksums, fix sequences, switch connection strings and test queries (dialect differences: `datetime('now')`, `||`, `INSERT OR REPLACE`, case-insensitive LIKE). ORMs like Prisma/SQLAlchemy ease this but not entirely.

### Q110. Migrating from PostgreSQL/MySQL down to SQLite for local-first apps
Keep schema simple, replace server-specific types, embrace integer ids and ISO dates, add sync logic (CRDTs like cr-sqlite, change-log tables, or server-authoritative sync with per-row `updated_at` and tombstones). Conflict resolution policy is the hard part, not storage.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. How WAL really works *(Must-know)*
Writers append **frames** (page images) to the `-wal` file and mark the transaction end with a commit frame. Readers consult the **wal-index** (in the `-shm` shared-memory file) to find the newest frame for each page at their snapshot's "end mark"; if the page is not in the WAL, they read the main file. Checkpoints copy frames to the main file for pages up to a safe mark (not beyond the oldest reader's mark). The WAL restarts from the beginning once all readers have moved past the checkpointed frames (so it is reused rather than growing forever). Only one connection can write at a time (the WAL write lock), but readers never take it.

### Q112. WAL growth and "checkpoint starvation"
If at least one reader is always active (overlapping long read transactions), the checkpoint can never complete past that reader's mark, the WAL cannot be reset, and the file grows (and read performance degrades because lookup into a huge WAL is slower). Fixes: keep read transactions short (finalize cursors), run `PRAGMA wal_checkpoint(TRUNCATE)` during quiet periods, set `journal_size_limit`, and make sure every statement is reset or finalized.

### Q113. Locking details in WAL mode
Readers: shared lock on a "read-mark" slot in the wal-index. Writer: `WAL_WRITE_LOCK`. Checkpointer: `WAL_CKPT_LOCK`. Recovery: `WAL_RECOVER_LOCK`. A writer waiting for the write lock respects `busy_timeout`. If a deferred transaction has already read from an older snapshot and then wants to write after another writer committed, SQLite returns `SQLITE_BUSY_SNAPSHOT` (it cannot upgrade a stale snapshot); retry the entire transaction.

### Q114. `SQLITE_BUSY` extended codes
`SQLITE_BUSY_RECOVERY` (another connection is recovering the WAL), `SQLITE_BUSY_SNAPSHOT` (cannot upgrade stale read snapshot), `SQLITE_BUSY_TIMEOUT`. Retry strategies: bounded retries with jittered backoff for the whole transaction; do not just retry the failing statement because the transaction state may be invalid.

### Q115. Designing a single-writer queue
Because SQLite has one writer, serialize writes in the application: a goroutine/thread/event loop that pulls write jobs from a channel, groups them into **batched transactions** (e.g. up to N jobs or T milliseconds), and commits once (group commit). This increases throughput dramatically (fewer fsyncs) and eliminates `SQLITE_BUSY` among your own writers. Reads use separate connections.

### Q116. Choosing transaction granularity
Too small: fsync overhead dominates. Too large: long write lock blocks other writers and grows the WAL and memory. A common sweet spot is batches of 100–10,000 rows or a few milliseconds' worth of work. For user-facing requests, keep each write transaction under tens of milliseconds.

### Q117. Understanding `fsync` and durability guarantees
SQLite relies on the OS honoring `fsync` (and on disks honoring cache flush). Consumer SSDs/VMs/network storage may lie, which breaks durability promises. On macOS, `PRAGMA fullfsync = ON` uses `F_FULLFSYNC`. `synchronous=NORMAL` + WAL can lose the last transactions on power loss but not corrupt; `FULL` syncs the WAL at each commit.

### Q118. Memory management and large queries
Sorting and temporary tables spill to temp files beyond memory limits. `PRAGMA temp_store`, `cache_size`, `soft_heap_limit`, `PRAGMA threads` (auxiliary sorter threads). Large `IN (...)` lists are limited by `SQLITE_MAX_VARIABLE_NUMBER` (32766); use temp tables, `json_each('[...]')`, or `carray` for big lists.

### Q119. Using `EXPLAIN` (VDBE bytecode)
`EXPLAIN SELECT ...` prints opcodes (`OpenRead`, `Rewind`, `Column`, `Next`, `SeekGE`, `ResultRow`, `Halt`). Useful for understanding exactly how the planner executes a query, how many loops run, and where sorters or ephemeral tables appear. `sqlite3_stmt_status(SQLITE_STMTSTATUS_FULLSCAN_STEP / SORT / AUTOINDEX)` counts these at runtime: helpful in production metrics.

### Q120. Query planner pitfalls
Data skew with stale stats, `OR` conditions across columns, correlated subqueries, expression indexes not matching, implicit type coercions, `LIKE` with leading wildcard, and CTEs that are repeatedly materialized. Remedies: `ANALYZE`, `INDEXED BY` (forces an index: fragile, use as last resort), `+column` or `likelihood()/unlikely()` hints to discourage the planner from using an index, rewriting queries, or splitting into steps with temp tables.

### Q121. The SQLite test and quality story (credibility points)
100% branch coverage and MC/DC coverage in the proprietary test harness (TH3), over 600 times more test code than library code, fuzzing (OSS-Fuzz, dbsqlfuzz), crash and I/O error injection testing, extensive assert checks, and long-term support commitments. This is why it is trusted in avionics and phones.

### Q122. Compile-time options that matter
`SQLITE_ENABLE_FTS5`, `SQLITE_ENABLE_JSON1` (built-in since 3.38), `SQLITE_ENABLE_RTREE`, `SQLITE_ENABLE_MATH_FUNCTIONS`, `SQLITE_DEFAULT_WAL_SYNCHRONOUS=1`, `SQLITE_THREADSAFE`, `SQLITE_DQS=0` (disable double-quoted string literals), `SQLITE_OMIT_LOAD_EXTENSION`, `SQLITE_DEFAULT_FOREIGN_KEYS=1`, `SQLITE_USE_URI`. Python's and Node's bundled builds may differ from the CLI; list with `PRAGMA compile_options;`.

### Q123. Using the C API correctly (what drivers hide)
Lifecycle: `sqlite3_open_v2` → `sqlite3_prepare_v2` → `sqlite3_bind_*` → loop `sqlite3_step` (`SQLITE_ROW`/`SQLITE_DONE`) with `sqlite3_column_*` → `sqlite3_reset`/`sqlite3_finalize` → `sqlite3_close_v2`. Check every return code, copy text/blob data before the next `step`, and never use a connection after a fork without reopening it. Use `sqlite3_errmsg` and extended result codes.

### Q124. Virtual tables and table-valued functions
A **virtual table** is a module-backed table whose rows come from code, not the B-tree file. Built-in examples: FTS5, R*Tree, `dbstat`, `json_each`/`json_tree`, `pragma_*` functions (`SELECT * FROM pragma_table_info('users')`). You can write your own modules (in C, or via bindings such as Python's `apsw`) to expose CSV files, APIs or computed data as SQL tables. They cannot have normal indexes or triggers, and their planner cost estimates come from the module's `xBestIndex`.

### Q125. Sessions, changesets and sync (awareness)
The **session extension** records changes to tables as compact **changesets/patchsets** that can be applied to another database with conflict callbacks: useful for sync, replication and undo. Projects like **cr-sqlite** (CRDT-based merging), **ElectricSQL**, **PowerSync**, **Replicache**-style systems and **Turso embedded replicas** build local-first sync on SQLite.

### Q126. Local-first architecture with SQLite
The client has a full local SQLite database (via WASM/OPFS in browsers, native on mobile). The app reads and writes locally (instant UI, offline). A sync engine pushes mutations to the server and pulls changes. Design points: stable client-generated ids (UUIDv7/ULID), per-row version or hybrid logical clocks, tombstones for deletes, conflict policy (last-writer-wins, field-level merge, CRDT), schema migrations across versions of the client, partial replication (only the user's data), and security (row-level filtering on the server).

### Q127. Reliability engineering for SQLite-backed services
Single machine = single point of failure unless you replicate: Litestream for backups and fast restore, LiteFS or libSQL for replicas, a warm standby that restores from object storage, health checks, deploy strategies that avoid two writers (rolling deploys must stop the old writer before starting the new one, or use a lease), and runbooks for restore drills with measured RTO.

### Q128. Scaling beyond one file
Vertical scaling (faster NVMe, more RAM for page cache), read replicas via Litestream/LiteFS/libSQL, sharding by tenant or key into many databases, `ATTACH` for limited cross-database queries, moving heavy analytics to DuckDB or a warehouse via periodic export. If sustained writes exceed a single writer's capacity after batching, move that dataset to a client-server database.

### Q129. Security hardening checklist
File permissions (owner-only), dedicated service account, encrypted volumes or SQLCipher, no untrusted `ATTACH` paths (an attacker-controlled path can create files), `SQLITE_DBCONFIG_DEFENSIVE`, disable extension loading, limit SQL length and complexity with `sqlite3_limit()` when accepting untrusted SQL, run in a sandbox for untrusted databases, keep SQLite updated (CVE feed), parameterized queries, and treat `PRAGMA writable_schema` as dangerous.

### Q130. SQL injection against SQLite
Beyond data theft: `ATTACH DATABASE '/var/www/shell.php' AS x; CREATE TABLE x.t(c TEXT); INSERT INTO x.t VALUES ('<?php ...')` can create arbitrary files in vulnerable stacks. Defense: parameterization, least-privilege OS permissions, disallow multiple statements per call (most drivers prepare one statement at a time), and set authorizer callbacks (`sqlite3_set_authorizer`) for untrusted queries.

### Q131. The authorizer, limits and running untrusted SQL
`sqlite3_set_authorizer` lets the host deny or allow operations per statement (e.g. permit only `SELECT` on specific tables). `sqlite3_limit` caps SQL length, expression depth, joined tables, etc. Combine with a read-only connection (`mode=ro`), a progress handler (`sqlite3_progress_handler`) to enforce timeouts, and memory limits. This is how sandboxed "run user SQL" features can be built more safely.

### Q132. Observability: what to measure
Query latency percentiles per statement, rows read vs returned, `SQLITE_BUSY` count, transaction duration, WAL size and checkpoint duration, `PRAGMA page_count/freelist_count` (fragmentation), database file size growth, cache hit rate (`sqlite3_db_status` `CACHE_HIT/MISS`), slow-query logs via trace callbacks, and backup/restore success.

### Q133. Handling schema evolution with multiple app versions
In mobile/desktop apps users may skip versions. Maintain ordered idempotent migrations keyed by `user_version`, wrap each in a transaction, back up the file before migrating, test upgrade paths from every released version with fixture databases, and never edit old migrations. For server deployments use expand/contract so old and new code can overlap.

### Q134. Index and schema design for SQLite
Prefer `INTEGER PRIMARY KEY` ids, `STRICT` tables, `NOT NULL` where possible, narrow rows, small indexes, partial indexes for hot subsets, covering indexes for hot reads, avoid wide tables with big text in the same table as hot columns, store JSON for flexible attributes with generated-column indexes on hot paths, and use `WITHOUT ROWID` for key-value-like tables with compound keys.

### Q135. Bulk loading best practices
Single transaction; prepared statement; `PRAGMA synchronous = OFF` and `journal_mode = MEMORY/OFF` **only** for a disposable rebuildable load (then restore safe settings); sort input by primary key; create indexes after loading; larger `cache_size`; `.import` or `sqlite3 .read`; run `ANALYZE` and `VACUUM` (optional) at the end. Expect millions of rows per second in the best case on SSD.

### Q136. Using SQLite with ORMs
Prisma, Drizzle, SQLAlchemy, TypeORM, Sequelize, Django, Rails, Entity Framework, GORM, Diesel all support SQLite. Cautions: ORMs may not set `foreign_keys=ON`, WAL or `busy_timeout`; migrations that alter columns need table rebuilds (supported by Django, Alembic batch mode, Prisma with warnings); dynamic typing hides type bugs (use STRICT where the ORM allows); connection pools may open many writers (limit to one writer).

### Q137. Choosing between `INSERT OR REPLACE` and `ON CONFLICT DO UPDATE`
`OR REPLACE` deletes the conflicting row and inserts a new one: it resets columns you did not supply, fires delete triggers (only if recursive triggers are on), cascades `ON DELETE` foreign key actions, and changes the `rowid` for tables with non-alias keys. `ON CONFLICT DO UPDATE` modifies the existing row in place. Prefer upsert.

### Q138. Common production incidents with SQLite
1. `database is locked` storms after traffic increases (no WAL/busy_timeout, long transactions).
2. WAL file grows to GBs because of a leaked read transaction.
3. Corruption from network storage or copying a live DB file.
4. Lost writes after a deployment that ran two writers on the same volume.
5. Data loss from `synchronous=OFF` and power failure.
6. Disk full during `VACUUM` (needs free space ≈ DB size).
7. Foreign keys silently not enforced (pragma missing on new connections).
Each has a standard fix from the sections above.

### Q139. How SQLite handles very large databases
Tested with databases of hundreds of GB to TB. Costs: `VACUUM` and `integrity_check` take long, backups are heavy, B-tree depth stays small. Use partial/covering indexes, avoid giant single transactions, run `.backup` with the incremental pattern (Python `con.backup(pages=...)`) or Litestream, and consider `sqlite3_analyzer` to inspect space use per table.

### Q140. `sqlite3_analyzer`, `sqldiff`, `dbhash`, and other tools
`sqlite3_analyzer` prints storage statistics (pages per table/index, fragmentation); `sqldiff` compares two databases and outputs SQL to transform one into the other; `dbhash` computes a content hash independent of physical layout; `sqlite3_rsync` (3.47+) efficiently syncs a live database to a replica over SSH. GUI tools: DB Browser for SQLite, DBeaver, DataGrip, TablePlus, Beekeeper Studio, sqlite-web, Datasette (publishing SQLite as a browsable API).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do you decide if SQLite is right for a production service?
Ask: How many writes per second at peak (after batching)? Does the data fit comfortably on one machine? Is a single node acceptable for availability (RTO/RPO), or do we have replication/restore tooling? Do we need multi-region writes? Are clients co-located with the data (same process or host)? If yes to a small-to-mid, mostly-read or single-writer workload and acceptable restore times, SQLite can reduce cost and complexity dramatically. If the answer includes "many app servers must write the same DB", use a client-server database.

### Q142. Architecture: SQLite as the primary datastore for a web product
Single binary with embedded SQLite (WAL), a write queue with batching, read pool, Litestream to object storage, blue/green deploys with a write lease to avoid dual writers, background jobs in the same DB (SKIP-less queue using `BEGIN IMMEDIATE` and status columns), periodic `PRAGMA optimize`, monitoring of WAL and BUSY rates, and a documented path to migrate to PostgreSQL if write load grows (use portable SQL, avoid SQLite-only quirks, keep ids and timestamps portable).

### Q143. Designing for portability and an exit strategy
Use an ORM or query layer that targets both SQLite and PostgreSQL, restrict yourself to portable SQL in core paths, avoid relying on dynamic typing and `INSERT OR REPLACE`, enable STRICT, keep money as integers, use UTC timestamps, and run the test suite against both engines in CI. This keeps a later migration a project, not a rewrite.

### Q144. Local-first product architecture decisions
Choose sync model (server-authoritative with mutation log vs CRDT), identity (client ids), conflict policy per entity, partial replication rules, offline migration policy, encryption of the local database (SQLCipher), data retention on devices, observability (client-side error reporting for migrations/sync), and server scaling (the sync server may use PostgreSQL while clients use SQLite).

### Q145. Per-tenant database fleet management
Provisioning (create file from template + `user_version`), migration orchestration (run in waves with health checks and a ledger table), backup/restore per tenant (Litestream or `.backup` + object storage lifecycle), routing (tenant→node mapping), capacity (inode/file handle limits, cache sizing per open DB), noisy neighbor control, and observability aggregated across files. Consider Turso/D1-like platforms if you don't want to operate this yourself.

### Q146. Cost model: SQLite vs managed PostgreSQL
SQLite on a single VM/volume: lowest infra cost, zero network hop (microsecond queries), simple ops. Managed PostgreSQL: higher cost but built-in HA, scaling and tooling. Compare total cost including engineering time for backup, failover and migration tooling you must build around SQLite. Quantify downtime tolerance.

### Q147. Compliance and data-governance with file-based databases
Encrypt at rest (SQLCipher or volume encryption), manage keys in KMS, audit access to files and backups, implement tenant-level deletion by deleting files (and backups per retention policy), pseudonymization, and logging. Understand that SQLite itself has no audit log or row-level security; implement in the application layer.

### Q148. Team standards for SQLite usage
Mandatory pragmas wrapper (WAL, FK, busy_timeout), STRICT tables, migration framework, query review with `EXPLAIN QUERY PLAN`, a single-writer rule, banned patterns (`INSERT OR REPLACE` without review, `SELECT *`, DQS), backup and restore drills, version pinning of the SQLite library, and a shared test harness for concurrency/crash scenarios.

### Q149. Risk register for SQLite in production
| Risk | Mitigation |
|---|---|
| Single point of failure | Litestream/replicas, fast restore, runbooks |
| Writer saturation | batching, queue, partitioning by tenant, migrate to client-server |
| Corruption | local disk only, no live copies, integrity checks on backups |
| Dual writers in deploy | leases, deploy ordering, one pod |
| Library version drift | pin & upgrade policy |
| Operational unfamiliarity | docs, drills, on-call training |

### Q150. Mentoring: SQLite skill ladder
Junior: types/affinity, PRAGMAs, transactions, WAL basics. Mid: locking and BUSY handling, indexes and query plans, FTS5/JSON, backups. Senior: WAL internals, write-queue designs, replication/sync, performance tuning, failure modes. Lead: architecture decisions, exit strategy, fleet management, risk management. Teach with experiments: induce `database is locked`, grow a WAL with a stuck reader, corrupt a copy and recover with `.recover`.

### Q151. Evaluating SQLite-derived platforms (D1, Turso, LiteFS, rqlite)
Check consistency model (single-writer with replicas = eventual reads), write limits, per-database size limits, regional behavior, backup/PITR, client libraries, extension support (FTS5, vectors), pricing model, lock-in (libSQL is open source, D1 API specifics), and operational tooling.

### Q152. Observability and SLOs for embedded databases
Define SLOs on user-visible latency, write error rate (BUSY), restore time objective, and backup freshness (time since last successful replica upload). Export WAL size, checkpoint durations, transaction time, query counts and slow queries as metrics; alert before disk fills or the WAL grows abnormally.

### Q153. Evolution: what's new and what to watch
JSONB, `->`/`->>` operators, STRICT tables, RIGHT/FULL JOIN, `sqlite3_rsync`, `unixepoch`, `concat_ws`, improved query planner and `PRAGMA optimize`, WASM + OPFS persistence, vector extensions, libSQL features (async I/O, replication hooks), and ecosystem tools (Litestream improvements, Turso embedded replicas, Datasette). Re-evaluate each year; read the release notes at sqlite.org/changes.html.

### Q154. Hiring/interview perspective
Strong candidates explain dynamic typing, WAL vs rollback journal, single-writer behavior with `BEGIN IMMEDIATE` and `busy_timeout`, safe backups, foreign key pragma, STRICT tables, and know when not to use SQLite. Weak signals: believing "SQLite is only for toy apps" or "it can't do concurrency at all", or ignoring that FKs are off by default.

### Q155. Interview approach for SQLite design questions
Clarify read/write ratio and concurrency, deployment topology (single host vs many), durability requirements, and data size. Propose WAL + write queue + read pool + backups (Litestream), schema with STRICT and portable types, indexes with query-plan verification, a migration strategy, and an explicit escape hatch to a client-server database if requirements grow.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. A safe connection factory (Python) with the recommended pragmas
```python
import sqlite3

def connect(path: str, readonly: bool = False) -> sqlite3.Connection:
    uri = f"file:{path}?mode={'ro' if readonly else 'rwc'}"
    con = sqlite3.connect(uri, uri=True, timeout=5.0, isolation_level=None)   # isolation_level=None: we control BEGIN
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    con.execute("PRAGMA busy_timeout = 5000")
    if not readonly:
        con.execute("PRAGMA journal_mode = WAL")
        con.execute("PRAGMA synchronous = NORMAL")
    con.execute("PRAGMA cache_size = -64000")
    con.execute("PRAGMA temp_store = MEMORY")
    return con

con = connect("shop.db")
con.execute("BEGIN IMMEDIATE")            # take the write lock up front
try:
    con.execute("INSERT INTO customers (name, email) VALUES (?, ?)", ("Ritesh Kumar", "ritesh@example.com"))
    con.execute("COMMIT")
except Exception:
    con.execute("ROLLBACK")
    raise
```

### H2. Create a modern STRICT schema with indexes
```sql
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL COLLATE NOCASE UNIQUE,
  city        TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

CREATE TABLE orders (
  order_id    INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  order_date  TEXT    NOT NULL,
  status      TEXT    NOT NULL CHECK (status IN ('new','paid','shipped','cancelled')),
  amount_paise INTEGER NOT NULL CHECK (amount_paise >= 0)
) STRICT;
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
CREATE INDEX idx_orders_open ON orders (order_date) WHERE status IN ('new','paid');
```

### H3. Reproduce and fix `database is locked` (Python threads)
```python
import sqlite3, threading, time

def writer(i, timeout):
    con = sqlite3.connect("lock_test.db", timeout=timeout, isolation_level=None)
    try:
        con.execute("BEGIN IMMEDIATE")
        con.execute("INSERT INTO t VALUES (?)", (i,))
        time.sleep(0.5)                       # simulate slow work inside the transaction
        con.execute("COMMIT")
    except sqlite3.OperationalError as e:
        print("writer", i, "failed:", e)

sqlite3.connect("lock_test.db").execute("CREATE TABLE IF NOT EXISTS t (x INTEGER)")
for timeout in (0.0, 5.0):                    # 0.0 = fail at once; 5.0 = wait for the lock
    ts = [threading.Thread(target=writer, args=(i, timeout)) for i in range(4)]
    [t.start() for t in ts]; [t.join() for t in ts]
```
With `timeout=0` three writers fail with "database is locked"; with a timeout they queue and succeed. The real fix is to keep the transaction short (remove the sleep) and use a writer queue.

### H4. A batching single-writer queue (Python)
```python
import queue, threading

class Writer:
    def __init__(self, con, batch=500, wait=0.01):
        self.q, self.con, self.batch, self.wait = queue.Queue(), con, batch, wait
        threading.Thread(target=self.run, daemon=True).start()

    def submit(self, sql, params=()):
        self.q.put((sql, params))

    def run(self):
        while True:
            items = [self.q.get()]                       # block for the first job
            try:
                while len(items) < self.batch:
                    items.append(self.q.get(timeout=self.wait))
            except queue.Empty:
                pass
            self.con.execute("BEGIN IMMEDIATE")
            try:
                for sql, params in items:
                    self.con.execute(sql, params)
                self.con.execute("COMMIT")                # one fsync for the whole batch (group commit)
            except Exception:
                self.con.execute("ROLLBACK")
                raise
```
Production code would also return futures/results and handle per-job errors.

### H5. Node.js: WAL, transaction helper and prepared statements (`better-sqlite3`)
```js
import Database from 'better-sqlite3';
const db = new Database('shop.db');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

const insertOrder = db.prepare(
  'INSERT INTO orders (customer_id, order_date, status, amount_paise) VALUES (@customer_id, @order_date, @status, @amount_paise)'
);
const insertMany = db.transaction((rows) => { for (const r of rows) insertOrder.run(r); });  // BEGIN/COMMIT handled
insertMany(Array.from({ length: 100000 }, (_, i) => ({
  customer_id: 1, order_date: '2025-10-24', status: 'paid', amount_paise: 100 + (i % 500),
})));
console.log(db.prepare('SELECT count(*) AS n FROM orders').get());
```
Use `db.transaction(...).immediate(rows)` for `BEGIN IMMEDIATE`.

### H6. Full-text search with external content and sync triggers
```sql
CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL) STRICT;
CREATE VIRTUAL TABLE notes_fts USING fts5(title, body, content='notes', content_rowid='id', tokenize='porter unicode61 remove_diacritics 2');

CREATE TRIGGER notes_ai AFTER INSERT ON notes BEGIN
  INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
END;
CREATE TRIGGER notes_ad AFTER DELETE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.id, old.title, old.body);
END;
CREATE TRIGGER notes_au AFTER UPDATE ON notes BEGIN
  INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES ('delete', old.id, old.title, old.body);
  INSERT INTO notes_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
END;

SELECT n.id, n.title, bm25(notes_fts, 5.0, 1.0) AS score
FROM notes_fts JOIN notes n ON n.id = notes_fts.rowid
WHERE notes_fts MATCH 'wal OR "write-ahead"' ORDER BY score LIMIT 10;   -- bm25 returns smaller (more negative) = better
INSERT INTO notes_fts(notes_fts) VALUES ('rebuild');                  -- rebuild the index if it drifts
```

### H7. JSON column with validation and indexed access
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  kind TEXT GENERATED ALWAYS AS (payload ->> '$.kind') VIRTUAL
) STRICT;
CREATE INDEX idx_events_kind ON events (kind);
INSERT INTO events (payload) VALUES ('{"kind":"login","user":"Ritesh Kumar","ip":"10.0.0.5"}');
SELECT payload ->> '$.user' AS user FROM events WHERE kind = 'login';
SELECT kind, count(*) FROM events GROUP BY kind;
```

### H8. Schema migration runner keyed by `user_version` (Python)
```python
MIGRATIONS = [
    "CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL) STRICT;",
    "ALTER TABLE customers ADD COLUMN email TEXT;",
    "CREATE UNIQUE INDEX uq_customers_email ON customers(email);",
]

def migrate(con):
    current = con.execute("PRAGMA user_version").fetchone()[0]
    for version, sql in enumerate(MIGRATIONS[current:], start=current + 1):
        con.execute("BEGIN IMMEDIATE")
        try:
            for stmt in sql.split(";"):          # one statement at a time, inside our transaction
                if stmt.strip():
                    con.execute(stmt)
            con.execute(f"PRAGMA user_version = {version}")
            con.execute("COMMIT")
        except Exception:
            con.execute("ROLLBACK")
            raise
```
Back up the file before migrating on user devices. (`executescript` issues an implicit COMMIT first, so this example executes statements one by one inside the transaction.)

### H9. Online backup and verification
```bash
sqlite3 shop.db ".backup '/backups/shop-$(date +%F).db'"
sqlite3 "/backups/shop-$(date +%F).db" "PRAGMA integrity_check;"       # expect: ok
# or
sqlite3 shop.db "VACUUM INTO '/backups/shop-compact.db'"
```
Python:
```python
src = sqlite3.connect("shop.db"); dst = sqlite3.connect("backup.db")
with dst: src.backup(dst, pages=1000, sleep=0.05)    # incremental: lets writers progress between chunks
```

### H10. Litestream configuration for continuous replication to S3
```yaml
# /etc/litestream.yml
dbs:
  - path: /data/shop.db
    replicas:
      - url: s3://my-bucket/shop
        retention: 72h
        sync-interval: 1s
```
```bash
litestream replicate                           # run as a service (systemd/sidecar)
litestream restore -o /data/shop.db s3://my-bucket/shop
litestream restore -timestamp 2025-10-24T10:14:00Z -o /tmp/shop.db s3://my-bucket/shop    # point in time
```
Test restores regularly. The application must use WAL mode and avoid manual checkpoints that conflict with Litestream.

### H11. Rebuild a table to change a column type (12-step pattern)
See Q62. Always run `PRAGMA foreign_key_check;` before committing and recreate indexes, triggers and views that referenced the old table.

### H12. Inspect space usage and fragmentation
```sql
PRAGMA page_size; PRAGMA page_count; PRAGMA freelist_count;
SELECT name, sum(pgsize) AS bytes FROM dbstat GROUP BY name ORDER BY bytes DESC LIMIT 10;   -- needs dbstat support
```
```bash
sqlite3_analyzer shop.db | head -60
```
High `freelist_count / page_count` suggests running `VACUUM` in a quiet window.

### H13. Recover a damaged database
```bash
sqlite3 broken.db "PRAGMA integrity_check;"
sqlite3 broken.db ".recover" | sqlite3 recovered.db
sqlite3 recovered.db "PRAGMA integrity_check; PRAGMA foreign_key_check;"
```
Compare row counts with the last good backup; salvage any rows in the `lost_and_found` table that `.recover` creates.

### H14. Measure a query properly
```sql
.timer on
EXPLAIN QUERY PLAN
SELECT c.name, sum(o.amount_paise) FROM orders o JOIN customers c USING (customer_id)
WHERE o.order_date >= '2025-10-01' GROUP BY c.customer_id;
ANALYZE;
PRAGMA optimize;
```
Look for `SCAN` on large tables, `USE TEMP B-TREE`, and `AUTOMATIC INDEX`.

### H15. Quick Docker lab and data directory layout
```bash
docker run --rm -it -v "$PWD/data:/data" keinos/sqlite3 sqlite3 /data/shop.db
ls -l data/    # shop.db  shop.db-wal  shop.db-shm   (WAL mode)
```
Back up and move all three files together if the database is open; or checkpoint first with `PRAGMA wal_checkpoint(TRUNCATE);` and close connections.

---

# 🐞 Part 7: Debugging Scenarios

### D1. `sqlite3.OperationalError: database is locked`
Another writer holds the lock or a connection has an open read cursor. Set `busy_timeout`, enable WAL, use `BEGIN IMMEDIATE`, shorten transactions, close cursors/finalize statements, check for other processes (DB browser GUI left open), and verify the file is not on NFS/SMB.

### D2. Foreign keys are not enforced
`PRAGMA foreign_keys` is OFF on that connection (default). Turn it on right after opening each connection (connection pools: use an on-connect hook). Run `PRAGMA foreign_key_check` to find existing violations.

### D3. Wrong ordering or comparison results
Mixed types in a column (text numbers vs integers). `'10' < '9'` is true as text. Use STRICT tables or `CAST`, and fix the data. Check with `SELECT typeof(col), count(*) FROM t GROUP BY 1;`.

### D4. Index is not used
Check `EXPLAIN QUERY PLAN`. Causes: affinity mismatch (binding a string to an INTEGER column comparison), function wrapping the column, collation mismatch (`NOCASE` index vs `BINARY` comparison), `LIKE` with leading wildcard, stale stats, or the planner judging a scan cheaper. Fix the predicate, align collation, run `ANALYZE`.

### D5. The `-wal` file is huge
A long-running read transaction (or unfinalized statement) blocks checkpoints. Find and close it; run `PRAGMA wal_checkpoint(TRUNCATE)`; set `journal_size_limit`; ensure cursors are reset. Check for backup tools holding a read lock for a long time.

### D6. `no such table` right after creating it
Different database file/path (relative path resolved from a different working directory), `:memory:` database per connection, uncommitted DDL on another connection, or the app connected to a read-only snapshot. Print the absolute path and `PRAGMA database_list`.

### D7. Data lost after a crash with `synchronous = OFF` / `journal_mode = OFF`
These settings trade safety for speed. Return to `WAL + NORMAL` (or `FULL`) and restore from backup. Add integrity checks on startup.

### D8. Dates compare incorrectly
Mixed formats (`'2025-1-5'` vs `'2025-01-05'`, or `T` vs space separators, or local vs UTC). Normalize to ISO-8601 with zero padding, validate with `CHECK (datetime(col) IS NOT NULL)`, and store UTC.

### D9. Insert silently stores the wrong thing
Non-STRICT table: `INSERT INTO t(age) VALUES ('abc')` into `INTEGER` stores text. Switch to STRICT, add `CHECK (typeof(age) = 'integer')`, or validate in the application.

### D10. Unique constraint allows duplicates
`NULL` values never conflict in `UNIQUE`; or the collation differs (`'A'` vs `'a'` under BINARY). Use `COLLATE NOCASE` on the column or index, add `NOT NULL`.

### D11. `SQLITE_BUSY_SNAPSHOT` in WAL mode
A deferred transaction read from an older snapshot, then tried to write after another writer committed. Start write transactions with `BEGIN IMMEDIATE`, or retry the whole transaction.

### D12. `database disk image is malformed`
Corruption: network filesystem, copying a live file, disk/RAM faults, killed `fsync`-less writes, deleting `-wal` or `-journal`. Run `.recover`, restore from backup, then fix the root cause (local disk, safe backup method).

### D13. Python: changes not saved
Forgot `con.commit()` (legacy mode opens a transaction on DML) or used `with con:` but never closed; or the process exits while a transaction is open. Use context managers consistently or set `isolation_level=None` and manage transactions explicitly.

### D14. `too many SQL variables`
More than `SQLITE_MAX_VARIABLE_NUMBER` bound parameters (32766 in modern builds; 999 in older ones, including some Android versions). Chunk the `IN (...)` list, or pass a JSON array: `WHERE id IN (SELECT value FROM json_each(?))`.

### D15. `VACUUM` fails or takes forever
Needs free disk space about the size of the database (and an exclusive lock). Free space first, stop writers, or use `VACUUM INTO` to a new file on a bigger disk, then swap. Use `incremental_vacuum` if configured.

---

# 🧩 Part 8: Tricky Questions

### T1. Is SQLite "not a real database" because it has no server?
No. It implements full ACID transactions, indexes, triggers, views, CTEs, windows, and is exhaustively tested. "Serverless" means the engine runs inside your process; it still provides durable, transactional storage.

### T2. Does `VARCHAR(10)` limit the length?
No. The length is ignored; the column has TEXT affinity. Add `CHECK (length(col) <= 10)` or use a STRICT table with `CHECK`.

### T3. Can multiple processes use the same SQLite file at the same time?
Yes, on a local filesystem. Many can read concurrently; writers are serialized with file locks. With WAL, readers do not block the writer.

### T4. Why is `INSERT` in a loop so slow without `BEGIN`?
Each statement is its own transaction with an `fsync`. Wrap loops in a single transaction.

### T5. Is `INTEGER PRIMARY KEY` the same as `INT PRIMARY KEY`?
No. Only the exact type name `INTEGER` makes the column an alias for `rowid`. `INT PRIMARY KEY` creates a separate unique index and values can be NULL in non-STRICT tables.

### T6. Does `AUTOINCREMENT` make ids faster?
No, it makes them slightly slower and only guarantees ids are never reused. Plain `INTEGER PRIMARY KEY` is usually what you want.

### T7. Does SQLite support concurrent writes?
No, one writer at a time per database file. With short, batched transactions this still handles substantial write loads; "concurrent" writers simply queue.

### T8. What does `PRAGMA journal_mode = WAL` change on disk?
It persists in the database header; two sidecar files appear (`-wal`, `-shm`). The mode applies to all later connections. Switching back (`DELETE`) requires no other connections.

### T9. Is it safe to copy a `.db` file?
Only when no write is in progress and (in WAL mode) the WAL has been checkpointed, or when you copy `db`, `-wal` and `-shm` consistently with no writers. Safer: `.backup`, `VACUUM INTO`, or filesystem snapshots with WAL handling.

### T10. What happens to `NULL` in `ORDER BY`?
`NULL` sorts first in ascending order and last in descending order (NULLs are considered smaller than everything). Use `NULLS FIRST/LAST` (3.30+) to be explicit.

### T11. Why can a row's type be different from its column's?
Type affinity only suggests a conversion. In non-STRICT tables any value can be stored in any column when it cannot be converted. That flexibility is deliberate (and enables things like storing a number and a string in the same column).

### T12. Do `UNIQUE` constraints allow multiple NULLs?
Yes. SQLite follows the SQL standard here: NULLs are considered distinct from each other.

### T13. Is `LIKE` case-sensitive?
Not for ASCII by default. `'a' LIKE 'A'` is true. `GLOB` is case-sensitive. For non-ASCII letters `LIKE` is case-sensitive unless ICU is loaded.

### T14. Why does `SELECT sum(x)` return NULL on an empty table?
`sum()` returns NULL when no non-NULL values exist; use `total(x)` (returns 0.0) or `coalesce(sum(x), 0)`.

### T15. Does `DROP TABLE` immediately shrink the file?
No. Pages go to the freelist and are reused; run `VACUUM` to shrink.

### T16. Can SQLite do `RIGHT JOIN`?
Yes since 3.39 (June 2022), also `FULL OUTER JOIN`. Before that emulate with `LEFT JOIN` swapped or `UNION`.

### T17. What is the difference between `sqlite_master` and `sqlite_schema`?
Same table; `sqlite_schema` is the newer, clearer name (3.33). Both work.

### T18. Is the order of `GROUP BY` output sorted?
Often (because the planner sorts to group), but it is not guaranteed. Add `ORDER BY` for deterministic results.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **SQLite architecture?** Embedded library, serverless, single file.
- **Default page size?** 4096 bytes.
- **Max writers at once?** One.
- **Alias of rowid?** `INTEGER PRIMARY KEY`.
- **Typing model?** Dynamic with type affinity.
- **Strict typing?** `CREATE TABLE ... STRICT` (3.37).
- **Storage classes?** NULL, INTEGER, REAL, TEXT, BLOB.
- **Boolean storage?** Integer 0 or 1.
- **Date storage?** TEXT (ISO-8601), REAL (Julian), or INTEGER (Unix).
- **Money storage?** Integer minor units.
- **Foreign keys by default?** Off; `PRAGMA foreign_keys = ON`.
- **Faster concurrency mode?** `PRAGMA journal_mode = WAL`.
- **Pair with WAL?** `synchronous = NORMAL`.
- **Wait on lock?** `PRAGMA busy_timeout`.
- **Start a write transaction safely?** `BEGIN IMMEDIATE`.
- **Speed up bulk insert?** One transaction + prepared statement.
- **See the query plan?** `EXPLAIN QUERY PLAN`.
- **Update planner stats?** `ANALYZE` / `PRAGMA optimize`.
- **Reclaim space?** `VACUUM`.
- **Online backup?** `.backup` / `VACUUM INTO` / backup API.
- **Continuous replication to S3?** Litestream.
- **Full-text search?** FTS5.
- **JSON operators?** `->` and `->>` (3.38).
- **Upsert?** `ON CONFLICT DO UPDATE`.
- **Return inserted values?** `RETURNING` (3.35).
- **Schema version storage?** `PRAGMA user_version`.
- **Integrity check?** `PRAGMA integrity_check`.
- **Recover corrupt DB?** `.recover`.
- **Encryption at rest?** SQLCipher or SEE.
- **Not for?** High write concurrency, multi-server shared writes.
- **Fork with server/replication?** libSQL (Turso).

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a project where you used SQLite.
STAR example: "We built a field-service mobile app that had to work offline. I used SQLite via Room with STRICT-like constraints, a `user_version` migration ladder, and a sync table with `updated_at` and tombstones. Sync batches ran inside single transactions; we measured start-up time and reduced it from 2.1 s to 0.4 s by moving heavy index creation out of the first launch and enabling WAL."

### P2. Why did you choose SQLite instead of PostgreSQL?
"Single-node workload with ~95% reads, one writer service, data under 20 GB, and a strong need for zero-ops deployment on small VMs. We used WAL, a write queue, and Litestream to S3. We documented a migration path to PostgreSQL if writes exceeded a threshold."

### P3. Describe a `database is locked` incident.
Example: traffic grew and background jobs started writing in parallel with API requests. We saw sporadic 500s. Fix: WAL, `busy_timeout`, shortened transactions, a single writer queue with batching, and metrics on BUSY rates. Errors dropped to zero and throughput doubled.

### P4. How did you handle backups and restores?
Litestream streamed WAL to S3 with 72 h retention, plus nightly `VACUUM INTO` snapshots verified with `integrity_check`. Quarterly restore drills measured RTO (about 4 minutes for 8 GB) and validated application startup on the restored file.

### P5. How do you handle schema changes on user devices?
Ordered migrations keyed by `user_version`, wrapped in transactions, pre-migration backups, fixture databases from each released version in CI, and telemetry for migration failures with rollback to the backup.

### P6. How do you decide when to move off SQLite?
Triggers: sustained write queue latency, multiple application servers needing writes, regional write requirements, operational risks from single-node restore times, or features like row-level security. Keep a portable schema and run tests on both engines to make the move incremental.

### P7. How do you test SQLite-backed code?
Unit tests with in-memory databases, integration tests with a file database in WAL, concurrency tests with multiple processes, crash tests (kill -9 during writes), migration tests from old fixtures, and performance tests with realistic data sizes.

### P8. Describe a performance win.
"A report query took 6 s. `EXPLAIN QUERY PLAN` showed a `SCAN` and a temp B-tree sort. Adding a composite covering index `(customer_id, order_date, amount)` and replacing `SELECT *` brought it to 15 ms. I ran `PRAGMA optimize` on a schedule and added a plan check to CI for the top queries."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** embedded architecture, single file, CLI, dot-commands, storage classes, type affinity, STRICT tables, rowid, `INTEGER PRIMARY KEY`, `AUTOINCREMENT`, `WITHOUT ROWID`.
- **SQL dialect:** SELECT/DML/DDL, joins (incl. RIGHT/FULL), CTEs, recursive CTEs, windows, upsert, `RETURNING`, conflict clauses, triggers, views, generated columns, date/time functions, JSON functions, FTS5, R*Tree, math functions, `ALTER TABLE` limits.
- **Transactions and concurrency:** ACID, autocommit, DEFERRED/IMMEDIATE/EXCLUSIVE, savepoints, rollback journal, WAL, checkpoints, locking states, `SQLITE_BUSY`, `busy_timeout`, snapshot isolation, shared cache (avoid).
- **Performance:** indexes (partial, expression, covering), `EXPLAIN QUERY PLAN`, `ANALYZE`, `PRAGMA optimize`, cache and mmap settings, batching, prepared statements, page size, vacuum.
- **Operations:** PRAGMAs, backup methods, Litestream, restore drills, integrity checks, `.recover`, monitoring, container and cloud deployment, file permissions, encryption (SQLCipher).
- **Ecosystem:** bindings (Python, Node, Go, Java, .NET, Rust), ORMs and migration tools, WASM/OPFS, mobile frameworks, libSQL/Turso, D1, LiteFS, rqlite, dqlite, DuckDB (analytics), Datasette, DB Browser.
- **Architecture:** single-writer design, write queues, read pools, per-tenant databases, local-first and sync (CRDT, changesets), edge deployments, exit strategies.

## Mixed topics
- SQLite + web backends (Django, Rails, Laravel, Express, FastAPI, Phoenix) with WAL and write queues.
- SQLite + mobile (Room, Core Data/SwiftData internals, Expo, React Native) and migrations.
- SQLite + desktop apps (Electron, Tauri) and application file formats.
- SQLite + CI/testing (in-memory DBs, fixtures, snapshot testing of schema).
- SQLite + AI (vector extensions, FTS5 hybrid search, local RAG).
- SQLite + data science (pandas `to_sql`, Datasette, Parquet via DuckDB).
- SQLite + DevOps (Docker volumes, Litestream sidecar, backups to object storage).

---

# 🔬 Part 12: SQLite Internals

### I1. The library at a glance
A single C source file amalgamation (`sqlite3.c`, about 250K lines in the amalgamation including comments) plus `sqlite3.h`. Roughly: tokenizer → Lemon-generated parser → code generator → VDBE bytecode program → VDBE executes using B-tree module → pager → VFS. Default VFS implementations: unix, win32, plus in-memory and many third-party VFS for encryption, remote storage, WASM/OPFS.

### I2. VDBE: the virtual machine
Each prepared statement compiles to a program of opcodes executed by VDBE. Registers hold values; cursors iterate B-trees. Seeing opcodes like `OpenRead`, `SeekGE`, `Column`, `ResultRow`, `Next`, `Halt` with `EXPLAIN` clarifies how a query runs. A prepared statement can be re-run with different bindings without recompiling.

### I3. B-tree details
Table B-tree: key is a 64-bit rowid, data in leaves (B+tree). Index B-tree: key is the record of the indexed columns plus rowid. Interior pages hold keys and child pointers. Cells use varints. Large payloads overflow to linked overflow pages. A page's first byte tells its type (0x02 interior index, 0x05 interior table, 0x0a leaf index, 0x0d leaf table).

### I4. Pager and cache
The pager manages the page cache, locking and journaling. Pages are cached per connection (unless shared cache). Dirty pages are written at commit (rollback mode: after the journal is synced; WAL mode: appended to the WAL). Memory-mapped I/O can bypass the cache for reads.

### I5. Rollback journal protocol (simplified)
1. Acquire RESERVED lock; copy original pages about to be modified into the journal; `fsync` the journal.
2. Acquire EXCLUSIVE lock; write modified pages to the database file; `fsync`.
3. Delete (or truncate/zero) the journal: this atomically commits.
On crash, a "hot journal" is rolled back at next open. The design assumes sector-atomic-enough writes and honest `fsync`.

### I6. WAL file format
A 32-byte header (magic, version, page size, checkpoint sequence, salts, checksums) followed by frames: a 24-byte frame header (page number, database size after commit for commit frames, salt, checksum) + one page of data. Checksums chain across frames so recovery can find the last valid commit. The `-shm` file holds the wal-index: a hash table mapping page numbers to the latest frame plus read-mark slots and locks.

### I7. The query planner
Estimates costs for each possible loop order and index choice using built-in heuristics and `sqlite_stat1/4`. Optimizations include: constant folding, index selection, covering-index detection, skip-scan (with stat1 data when the leading column has few distinct values), OR-optimization, subquery flattening, LIKE optimization, min/max optimization, automatic indexes, transitive constraints, and co-routines to avoid materializing subqueries. Joins are nested loops (no hash join or merge join).

### I8. Why no hash joins?
SQLite's design favors small code, low memory and predictable behavior. It uses nested-loop joins with indexes (including automatic indexes). For big analytic joins without indexes, performance is not its goal; use DuckDB or a server database.

### I9. Memory allocation and limits
Configurable allocators (`sqlite3_config`), lookaside memory per connection for small allocations, page cache memory pooling, soft/hard heap limits. SQLite is designed to run in memory-constrained devices (tens of KB of stack/heap in minimal builds).

### I10. Safety and testing infrastructure
Extensive assertions, fault-injection (I/O error, out-of-memory), power-loss simulation, fuzzing, coverage-guided testing. Release process includes a cross-platform test matrix. The project has a long-term support commitment, small team stewardship (Hipp, Wyrick & Company), and publishes timely patches.

---

# 📊 Part 13: Reference Tables

### Type affinity mapping
| Declared type contains | Affinity | Example |
|---|---|---|
| "INT" | INTEGER | `INT`, `BIGINT`, `UNSIGNED BIG INT` |
| "CHAR", "CLOB", "TEXT" | TEXT | `VARCHAR(255)`, `NCHAR` |
| "BLOB" or empty | BLOB | `BLOB`, (none) |
| "REAL", "FLOA", "DOUB" | REAL | `DOUBLE`, `FLOAT` |
| otherwise | NUMERIC | `DECIMAL(10,2)`, `BOOLEAN`, `DATE` |

### Journal modes
| Mode | Safety | Concurrency | Notes |
|---|---|---|---|
| DELETE | high | readers block writer at commit | default |
| TRUNCATE / PERSIST | high | same | avoid file delete cost |
| MEMORY | low on crash | same | journal in RAM |
| WAL | high | readers don't block writer | needs same-host shared memory |
| OFF | none | n/a | no rollback; dangerous |

### `synchronous` settings
| Value | Name | Meaning |
|---|---|---|
| 0 | OFF | no syncs; fastest; corruption risk on power loss |
| 1 | NORMAL | fewer syncs; with WAL safe from corruption, may lose recent commits |
| 2 | FULL | syncs at critical points (default) |
| 3 | EXTRA | adds directory syncs for the rollback journal |

### Transaction types
| Statement | Lock acquired | Use |
|---|---|---|
| `BEGIN` / `BEGIN DEFERRED` | on first read/write | read-only work |
| `BEGIN IMMEDIATE` | write (RESERVED) now | planned writes |
| `BEGIN EXCLUSIVE` | exclusive now | rare; blocks readers in rollback mode |

### Feature versions cheat table
| Feature | Version |
|---|---|
| CTEs | 3.8.3 |
| Partial indexes | 3.8.0 |
| Row values | 3.15 |
| UPSERT | 3.24 |
| Window functions | 3.25 |
| `RENAME COLUMN` | 3.25 |
| Generated columns | 3.31 |
| `RETURNING`, `DROP COLUMN`, math functions | 3.35 |
| STRICT tables | 3.37 |
| JSON `->` `->>`, `unixepoch()` | 3.38 |
| RIGHT / FULL JOIN, `IS DISTINCT FROM` | 3.39 |
| JSONB | 3.45 |

### PRAGMA scope
| Persistent in file | Per connection |
|---|---|
| `journal_mode=WAL`, `page_size`, `auto_vacuum`, `user_version`, `application_id`, `encoding` | `foreign_keys`, `synchronous`, `busy_timeout`, `cache_size`, `temp_store`, `mmap_size`, `recursive_triggers` |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```sql
SELECT 7/2, 7/2.0, 7%2, -7/2, typeof(7/2);
```
**Output:** `3, 3.5, 1, -3, integer`. Integer division truncates toward zero.

### O2.
```sql
SELECT 'a' || 1 || NULL, 'a' || 1;
```
**Output:** `NULL, a1`. Concatenating with NULL yields NULL.

### O3.
```sql
SELECT 10 < '9', '10' < 9;
```
**Output:** `1, 0`. With no column affinity involved, any number is less than any text.

### O4.
```sql
CREATE TABLE t (a INTEGER);
INSERT INTO t VALUES ('10'), ('abc');
SELECT a, typeof(a), a < 9 FROM t ORDER BY rowid;
```
**Output:** `10 | integer | 0` and `abc | text | 0`. Text `'10'` converts to integer; `'abc'` stays text; text compares greater than numbers, so `a < 9` is 0 for both.

### O5.
```sql
SELECT NULL = NULL, NULL IS NULL, 1 IS 1, 1 IS NOT NULL;
```
**Output:** `NULL, 1, 1, 1`.

### O6.
```sql
SELECT 'abc' LIKE 'ABC', 'abc' GLOB 'ABC', 'abc' GLOB 'a*';
```
**Output:** `1, 0, 1`.

### O7.
```sql
SELECT length('héllo'), length(x'0102'), length(NULL);
```
**Output:** `5, 2, NULL`. Text length counts characters, blob length counts bytes.

### O8.
```sql
SELECT round(2.5), round(3.5), round(-2.5), round(2.567, 2);
```
**Output:** `3.0, 4.0, -3.0, 2.57`. Rounds half away from zero and returns REAL.

### O9.
```sql
CREATE TABLE a (id INTEGER PRIMARY KEY);              -- no AUTOINCREMENT
INSERT INTO a DEFAULT VALUES; INSERT INTO a DEFAULT VALUES; INSERT INTO a DEFAULT VALUES;
DELETE FROM a WHERE id = 3;
INSERT INTO a DEFAULT VALUES;
SELECT max(id) FROM a;
```
**Output:** `3`. The id is reused. With `AUTOINCREMENT` the result would be `4`.

### O10.
```sql
SELECT date('2025-01-31', '+1 month'), strftime('%w', '2025-10-24'), date('2025-10-24', 'start of month', '+1 month', '-1 day');
```
**Output:** `2025-03-03` (Feb 31 normalizes forward), `5` (Friday), `2025-10-31`.

### O11.
```sql
SELECT sum(x), total(x), count(x), count(*) FROM (SELECT 1 AS x WHERE 0);
```
**Output:** `NULL, 0.0, 0, 0`.

### O12.
```sql
CREATE TABLE u (id INTEGER PRIMARY KEY, e TEXT UNIQUE);
INSERT INTO u (e) VALUES (NULL), (NULL), ('a');
INSERT OR IGNORE INTO u (e) VALUES ('a');
SELECT count(*) FROM u;
```
**Output:** `3`. Multiple NULLs are allowed in `UNIQUE`; the duplicate `'a'` is ignored.

### O13.
```sql
CREATE TABLE s (n INTEGER) STRICT;
INSERT INTO s VALUES ('42');
INSERT INTO s VALUES ('abc');
SELECT n FROM s;
```
**Result:** the first insert succeeds (`'42'` converts to 42); the second fails with `cannot store TEXT value in INTEGER column s.n`; `SELECT` returns `42`.

---

# ✅ Part 15: MCQs

**1. SQLite is best described as:**
A) A client-server RDBMS  B) An embedded serverless SQL database library  C) A NoSQL store  D) A cache server
**Answer: B**

**2. How many simultaneous writers can SQLite have per database file?**
A) Unlimited  B) One  C) One per table  D) One per thread
**Answer: B**

**3. Which makes a column an alias for `rowid`?**
A) `INT PRIMARY KEY`  B) `INTEGER PRIMARY KEY`  C) `BIGINT PRIMARY KEY`  D) `UNIQUE`
**Answer: B**

**4. Foreign key enforcement is:**
A) Always on  B) Off by default per connection; enable with `PRAGMA foreign_keys = ON`  C) Impossible  D) Only in WAL mode
**Answer: B**

**5. In WAL mode:**
A) Readers block the writer  B) Readers and the writer do not block each other  C) Multiple writers run in parallel  D) No extra files are created
**Answer: B**

**6. What does `VARCHAR(10)` enforce in SQLite?**
A) Max 10 characters  B) Nothing; length is ignored  C) Exactly 10  D) Minimum 10
**Answer: B**

**7. Which statement starts a transaction that takes the write lock immediately?**
A) `BEGIN`  B) `BEGIN DEFERRED`  C) `BEGIN IMMEDIATE`  D) `START`
**Answer: C**

**8. The safe way to copy a live database is:**
A) `cp`  B) `.backup` or `VACUUM INTO`  C) `mv`  D) Delete the `-wal`
**Answer: B**

**9. Which makes a table reject wrong types?**
A) `WITHOUT ROWID`  B) `STRICT`  C) `TEMP`  D) `UNIQUE`
**Answer: B**

**10. `7/2` in SQLite equals:**
A) 3.5  B) 3  C) 4  D) Error
**Answer: B**

**11. What stores your own schema version number in the file header?**
A) `PRAGMA schema_version`  B) `PRAGMA user_version`  C) `PRAGMA page_size`  D) `PRAGMA encoding`
**Answer: B**

**12. Which tool streams SQLite WAL changes to S3?**
A) Debezium  B) Litestream  C) pgBackRest  D) Redis
**Answer: B**

**13. `SQLITE_BUSY` means:**
A) Disk is full  B) Another connection holds a conflicting lock  C) Syntax error  D) Corrupt file
**Answer: B**

**14. Which function module provides full-text search?**
A) JSON1  B) FTS5  C) RTREE  D) DBSTAT
**Answer: B**

**15. `PRAGMA optimize` does what?**
A) Rewrites the whole file  B) Runs `ANALYZE` where useful, cheaply  C) Compresses data  D) Enables WAL
**Answer: B**

**16. SQLite date values are stored as:**
A) A native DATE type  B) TEXT, REAL or INTEGER  C) Only text  D) A struct
**Answer: B**

**17. A hot journal is:**
A) A fast cache  B) A leftover journal from a crash that triggers rollback on next open  C) A WAL checkpoint  D) A backup
**Answer: B**

**18. Which feature arrived in 3.38?**
A) Window functions  B) `->` and `->>` JSON operators  C) STRICT tables  D) UPSERT
**Answer: B**

**19. Which is NOT safe for a live SQLite database?**
A) Local SSD  B) NFS share  C) Docker named volume  D) Local ext4
**Answer: B**

**20. `INSERT OR REPLACE` differs from `ON CONFLICT DO UPDATE` because it:**
A) Updates in place  B) Deletes the conflicting row and inserts a new one  C) Ignores the new row  D) Locks the table
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Forgetting `PRAGMA foreign_keys = ON`** on each new connection.
2. **Many tiny autocommit writes** instead of batched transactions.
3. **No `busy_timeout`** and no WAL, leading to constant `database is locked`.
4. **Using deferred transactions for writes** (`BEGIN` then read then write), causing BUSY_SNAPSHOT.
5. **Holding read cursors/transactions open** and blocking WAL checkpoints.
6. **Copying a live database file** (or deleting `-wal`/`-journal`) as a "backup".
7. **Placing the database on NFS/SMB** or other unreliable file locking.
8. **Relying on `VARCHAR(n)` length and `DECIMAL(p,s)` scale** being enforced.
9. **Storing money as floats.**
10. **Using `INT PRIMARY KEY` instead of `INTEGER PRIMARY KEY`.**
11. **Using `INSERT OR REPLACE` as an upsert** and silently deleting related data.
12. **Mixed date formats** that break sorting and comparisons.
13. **Double-quoted strings** (DQS) hiding typos in column names.
14. **Not using STRICT** in new schemas, then discovering text in numeric columns.
15. **Running multiple writer processes on one file during deploys** (blue/green overlap).
16. **Skipping `ANALYZE`/`PRAGMA optimize`** and trusting default planner assumptions on big tables.
17. **Ignoring SQLite version differences** between environments (old Android/system builds).
18. **Sharing one connection across threads unsafely.**
19. **No restore drills** for backups or Litestream replicas.
20. **Using SQLite for workloads that need many concurrent writers across servers.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain **why** SQLite is a serious database (ACID, testing, file format stability) and **where** it fits and doesn't.
- You can describe dynamic typing and type affinity precisely, and use STRICT tables to regain safety.
- You know WAL vs rollback journal, checkpoints, `synchronous`, `busy_timeout`, `BEGIN IMMEDIATE`, and how a single-writer queue with batching solves concurrency.
- You set the standard pragmas on every connection and know which ones are persistent.
- You verify queries with `EXPLAIN QUERY PLAN`, design partial/covering/expression indexes, and run `PRAGMA optimize`.
- You back up correctly (`.backup`, `VACUUM INTO`, Litestream) and rehearse restores.
- You can design local-first sync, per-tenant databases and edge deployments, and plan an exit to PostgreSQL.
- You know the sharp edges: FKs off by default, `ALTER TABLE` limits, `INSERT OR REPLACE`, NULL uniqueness, case-insensitive `LIKE`, integer division, UTC `'now'`.
- You monitor WAL size, BUSY rates and disk usage, and handle incidents calmly.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Connection checklist (run on every new connection)
```sql
PRAGMA journal_mode = WAL;       -- persistent
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
PRAGMA cache_size = -64000;
PRAGMA temp_store = MEMORY;
```

### Write pattern
`BEGIN IMMEDIATE` → statements (prepared) → `COMMIT`; keep it short; batch rows; single writer queue; retry the whole transaction on `BUSY`.

### Type model
Five storage classes; affinity guides conversion; use `STRICT`; booleans 0/1; dates as ISO text or Unix integers; money as integers.

### Debug commands
```sql
EXPLAIN QUERY PLAN <sql>;   PRAGMA integrity_check;   PRAGMA foreign_key_check;
PRAGMA table_info(t);       PRAGMA index_list(t);     PRAGMA compile_options;
PRAGMA wal_checkpoint(TRUNCATE);   PRAGMA freelist_count;   SELECT sqlite_version();
```

### Backup/restore
`sqlite3 db ".backup file"` • `VACUUM INTO 'file'` • Litestream replicate/restore • always `integrity_check` the backup • practice restores.

### When to choose SQLite
Embedded/mobile/desktop, local-first, edge/read-heavy sites, single-node services with modest write rates, test databases, app file formats. **Not** for multi-server shared writes or high write concurrency.

### Interview strategy
1. Say what SQLite is (embedded, serverless, ACID) in one sentence.
2. Explain the relevant mechanism (WAL, affinity, locking) and show the pragma or SQL.
3. Mention trade-offs (single writer, no network access, limited ALTER).
4. Give a production-ready pattern (write queue, backups, monitoring).
5. State clearly when you would pick PostgreSQL instead.

### Final checklist before the interview
- [ ] Explain dynamic typing, affinity, STRICT tables, rowid and `INTEGER PRIMARY KEY`.
- [ ] Explain rollback journal vs WAL, checkpoints, `synchronous`, locking states, `SQLITE_BUSY`.
- [ ] Write a robust connection setup and a batched write transaction.
- [ ] Read `EXPLAIN QUERY PLAN`; design indexes; use FTS5 and JSON functions.
- [ ] Describe backups (`.backup`, `VACUUM INTO`, Litestream) and corruption recovery (`.recover`).
- [ ] Discuss local-first, per-tenant, edge deployments and libSQL/Turso/D1.
- [ ] Prepare a concurrency incident story and a "why SQLite" decision story.

