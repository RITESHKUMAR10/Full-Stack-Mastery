# MySQL Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **MySQL 8.0 and 8.4 LTS** (InnoDB storage engine). Features that matter in interviews are marked with the version: window functions and CTEs (8.0), `EXPLAIN ANALYZE` and hash joins (8.0.18), functional indexes (8.0.13), `INSTANT` DDL (8.0.12), descending and invisible indexes (8.0), `utf8mb4` as default charset (8.0), removal of the query cache (8.0), `caching_sha2_password` as default (8.0) and `mysql_native_password` disabled by default (8.4), `INTERSECT`/`EXCEPT` (8.0.31), and dynamic redo log sizing with `innodb_redo_log_capacity` (8.0.30). Where MariaDB differs, it is noted. Verify flags and defaults in the official docs (dev.mysql.com/doc) for your exact version. Examples use the sample name **Ritesh Kumar**.
> General SQL (joins, windows, normalization) is covered in `026_SQL.md`. This file focuses on **MySQL specifics**: architecture, storage engines, InnoDB internals, data types, indexing, query tuning, transactions and locking, replication and HA, backup, security, administration, and production practice.

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
- [Part 12: MySQL Internals](#-part-12-mysql-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is MySQL?
An open-source **relational database management system (RDBMS)** that uses SQL. Created by MySQL AB (1995), now owned by Oracle. It is widely used for web applications (the "M" in LAMP/MEAN-like stacks), runs on Linux, Windows and macOS, and is offered as a managed service (Amazon RDS/Aurora MySQL, Google Cloud SQL, Azure Database for MySQL, PlanetScale-style platforms).

### Q2. MySQL vs MariaDB
MariaDB is a community fork created in 2009 after Oracle acquired Sun/MySQL. Both are similar for basic SQL, but have diverged: different optimizers, storage engines (MariaDB has Aria, ColumnStore, Spider), replication/GTID formats, JSON implementation (MariaDB stores JSON as `LONGTEXT`), and feature sets (MySQL: InnoDB Cluster, Group Replication, Clone plugin; MariaDB: Galera, system-versioned tables). Do not assume exact compatibility.

### Q3. MySQL vs PostgreSQL (short answer)
MySQL: simple to operate, strong replication ecosystem, very common in web hosting; InnoDB clustered primary key. PostgreSQL: richer SQL and data types (arrays, range types, advanced JSONB, extensions like PostGIS and pgvector), stricter standards behavior, heap tables with MVCC in the table. Choose by requirements, team skills and ecosystem, not by slogans.

### Q4. How do you connect to MySQL?
```bash
mysql -u root -p                         # prompts for password
mysql -h 127.0.0.1 -P 3306 -u app -p mydb
mysqlsh                                   # MySQL Shell (JS/Python/SQL, admin APIs)
```
GUI tools: MySQL Workbench, DBeaver, DataGrip, phpMyAdmin.

### Q5. Basic database and table commands
```sql
SHOW DATABASES;
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE shop;
SHOW TABLES;
DESCRIBE customers;                      -- or SHOW COLUMNS FROM customers
SHOW CREATE TABLE customers\G
DROP DATABASE IF EXISTS old_db;
```

### Q6. Creating a table with common MySQL features
```sql
CREATE TABLE customers (
  customer_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  city        VARCHAR(50)  NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id),
  UNIQUE KEY uq_customers_email (email),
  KEY idx_customers_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Q7. What are storage engines? Which ones exist? *(Must-know)*
A storage engine handles how data is stored, indexed, locked and recovered. MySQL's pluggable architecture lets each table use a different one.
| Engine | Notes |
|---|---|
| **InnoDB** | Default. ACID transactions, row-level locks, MVCC, foreign keys, crash recovery. Use this. |
| MyISAM | Old: table-level locks, no transactions, no crash safety. Avoid. |
| MEMORY | In-RAM tables, lost on restart; temp/lookup use only. |
| ARCHIVE | Compressed append-only storage. |
| CSV | Text files. |
| NDB (Cluster) | Distributed, in-memory clustering product. |
Check: `SHOW ENGINES;`, `SELECT engine FROM information_schema.tables WHERE table_name='t';`.

### Q8. InnoDB vs MyISAM *(Must-know)*
| | InnoDB | MyISAM |
|---|---|---|
| Transactions | yes (ACID) | no |
| Locking | row-level | table-level |
| Foreign keys | yes | no |
| Crash recovery | yes (redo log) | poor (repair needed) |
| MVCC | yes | no |
| Full-text | yes (5.6+) | yes |
| Use today | default | legacy only |
MySQL 8 system tables are also InnoDB.

### Q9. Common data types
Integers: `TINYINT` (1 byte), `SMALLINT` (2), `MEDIUMINT` (3), `INT` (4), `BIGINT` (8), each `UNSIGNED` optional. Decimal: `DECIMAL(p,s)` exact; `FLOAT/DOUBLE` approximate. Strings: `CHAR(n)`, `VARCHAR(n)`, `TEXT` family, `BLOB` family, `ENUM`, `SET`. Date/time: `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`. Other: `JSON`, `BIT`, spatial types (`POINT`, `GEOMETRY`), `BOOLEAN` (alias of `TINYINT(1)`).

### Q10. `DATETIME` vs `TIMESTAMP` *(Must-know)*
| | DATETIME | TIMESTAMP |
|---|---|---|
| Range | `1000-01-01` to `9999-12-31` | `1970-01-01 00:00:01` UTC to `2038-01-19` UTC (ends 2038) |
| Storage | 5 bytes (+ fractional) | 4 bytes (+ fractional) |
| Time zone | stored as-is, no conversion | stored in UTC, converted using session `time_zone` |
Use `DATETIME` for far-future dates or when you manage UTC yourself; use `TIMESTAMP` for event times within range (watch the 2038 limit for long-lived data). Many teams store UTC in `DATETIME`.

### Q11. `CHAR` vs `VARCHAR` vs `TEXT`
`CHAR(n)`: fixed length (trailing spaces trimmed on read). `VARCHAR(n)`: variable (1–2 length bytes). `TEXT`: up to 64 KB (`MEDIUMTEXT` 16 MB, `LONGTEXT` 4 GB); cannot have a default value (before 8.0.13) and indexes need a prefix length. Row size limit is 65,535 bytes across all columns (excluding BLOB/TEXT pointers); `utf8mb4` uses up to 4 bytes per character, so `VARCHAR(255)` can use 1,020 bytes.

### Q12. What is `utf8` vs `utf8mb4`? *(Must-know)*
MySQL's old `utf8` is an alias for `utf8mb3`: only 3 bytes per character, so emoji and some CJK characters fail or get truncated. `utf8mb4` is real UTF-8 (up to 4 bytes). Always use `utf8mb4`. Default collation in 8.0 is `utf8mb4_0900_ai_ci` (accent- and case-insensitive, Unicode 9). For case-sensitive comparisons use `_bin` or `_as_cs` collations.

### Q13. `AUTO_INCREMENT`
Generates sequential IDs. Gaps happen (rollbacks, failed inserts, bulk insert reservations). Value is remembered across restarts in 8.0 (persisted in the redo log; in 5.7 it was recomputed as `MAX+1` on restart). Get the last ID: `SELECT LAST_INSERT_ID();` (per connection). Reset: `ALTER TABLE t AUTO_INCREMENT = 1000;`.

### Q14. Basic CRUD
```sql
INSERT INTO customers (name, email) VALUES ('Ritesh Kumar', 'ritesh@example.com');
SELECT customer_id, name FROM customers WHERE email = 'ritesh@example.com';
UPDATE customers SET city = 'Delhi' WHERE customer_id = 1;
DELETE FROM customers WHERE customer_id = 1;
```
Safety setting for clients: `mysql --safe-updates` (aka `--i-am-a-dummy`) blocks `UPDATE/DELETE` without a key `WHERE`.

### Q15. `INSERT IGNORE`, `REPLACE`, `ON DUPLICATE KEY UPDATE` *(Must-know)*
```sql
INSERT IGNORE INTO t (id, v) VALUES (1, 'a');                     -- skips duplicate-key errors (and downgrades some errors to warnings!)
REPLACE INTO t (id, v) VALUES (1, 'b');                           -- DELETE + INSERT (new row, triggers/FKs fire, auto_increment changes)
INSERT INTO t (id, v) VALUES (1, 'c')
  ON DUPLICATE KEY UPDATE v = VALUES(v);                          -- real upsert; 8.0.20+: use a row alias
-- 8.0.19+ recommended form:
INSERT INTO t (id, v) VALUES (1, 'c') AS new ON DUPLICATE KEY UPDATE v = new.v;
```
`REPLACE` can silently delete child rows with `ON DELETE CASCADE`. Prefer `ON DUPLICATE KEY UPDATE`.

### Q16. Operators and functions you must know
Strings: `CONCAT`, `CONCAT_WS`, `SUBSTRING`, `LOCATE`, `REPLACE`, `TRIM`, `LPAD`, `FORMAT`. Numbers: `ROUND`, `FLOOR`, `CEIL`, `MOD`, `DIV` (integer division). Dates: `NOW()`, `CURDATE()`, `DATE_ADD(d, INTERVAL 7 DAY)`, `DATEDIFF`, `TIMESTAMPDIFF`, `DATE_FORMAT(d, '%Y-%m-%d')`, `STR_TO_DATE`. Control: `IF(cond, a, b)`, `IFNULL`, `COALESCE`, `CASE`. Aggregates: `COUNT`, `SUM`, `AVG`, `GROUP_CONCAT`.

### Q17. `GROUP_CONCAT`
```sql
SELECT dept_id, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS people
FROM employees GROUP BY dept_id;
```
Output is truncated at `group_concat_max_len` (default 1024 bytes). Raise it for long lists: `SET SESSION group_concat_max_len = 1000000;`.

### Q18. `LIMIT` and `OFFSET`
```sql
SELECT * FROM orders ORDER BY order_id DESC LIMIT 10;          -- top 10
SELECT * FROM orders ORDER BY order_id LIMIT 20, 10;           -- skip 20, take 10 (old syntax: LIMIT offset, count)
SELECT * FROM orders ORDER BY order_id LIMIT 10 OFFSET 20;     -- same
```
Large offsets are slow. Use keyset pagination (`WHERE id < :last ORDER BY id DESC LIMIT 20`).

### Q19. Joins in MySQL
`INNER`, `LEFT`, `RIGHT`, `CROSS`, `NATURAL` are supported. **`FULL OUTER JOIN` is not supported**; emulate:
```sql
SELECT * FROM a LEFT JOIN b ON a.id = b.id
UNION
SELECT * FROM a RIGHT JOIN b ON a.id = b.id;
```
Use `UNION ALL` plus an anti-join condition on the second part if you want to keep duplicates.

### Q20. Primary key and foreign key in InnoDB
Every InnoDB table has a **clustered index**: the primary key (or the first non-null unique index, or a hidden 6-byte row id). Foreign keys require InnoDB, matching types/charsets/collations on both sides, and an index on the referencing columns (created automatically if missing).
```sql
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
  REFERENCES customers (customer_id) ON DELETE RESTRICT ON UPDATE CASCADE;
```

### Q21. Indexes: syntax and types
```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
CREATE UNIQUE INDEX uq_email ON customers (email);
CREATE FULLTEXT INDEX ft_body ON articles (title, body);
ALTER TABLE orders ADD INDEX idx_status (status), DROP INDEX old_idx;
SHOW INDEX FROM orders;
```
Types: B-tree (default), hash (MEMORY/NDB), full-text, spatial (R-tree). Hash indexes on InnoDB are internal (adaptive hash index) and not user-created.

### Q22. Transactions basics
```sql
START TRANSACTION;          -- or BEGIN
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;                     -- or ROLLBACK;
SET autocommit = 0;         -- default is 1: each statement is its own transaction
```
DDL statements cause an **implicit commit** (but in 8.0 DDL is atomic by itself).

### Q23. ACID in MySQL terms
Atomicity: undo log. Consistency: constraints + transactions. Isolation: MVCC + locks (default `REPEATABLE READ`). Durability: redo log + doublewrite buffer, controlled by `innodb_flush_log_at_trx_commit=1` and `sync_binlog=1`.

### Q24. Users, privileges and `GRANT`
```sql
CREATE USER 'app'@'10.0.%' IDENTIFIED BY 'S3cure!pass';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'app'@'10.0.%';
SHOW GRANTS FOR 'app'@'10.0.%';
REVOKE DELETE ON shop.* FROM 'app'@'10.0.%';
DROP USER 'app'@'10.0.%';
```
Accounts are `user@host`. In MySQL 8.0, `GRANT` no longer creates users implicitly. Use roles: `CREATE ROLE readonly; GRANT SELECT ON shop.* TO readonly; GRANT readonly TO 'ritesh'@'%'; SET DEFAULT ROLE readonly TO 'ritesh'@'%';`.

### Q25. Importing and exporting data
```bash
mysqldump -u root -p --single-transaction --routines --triggers shop > shop.sql
mysql -u root -p shop < shop.sql
```
```sql
SELECT * FROM customers INTO OUTFILE '/var/lib/mysql-files/customers.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
LOAD DATA INFILE '/var/lib/mysql-files/customers.csv' INTO TABLE customers FIELDS TERMINATED BY ',' ENCLOSED BY '"' IGNORE 1 LINES;
```
File access is restricted by `secure_file_priv`. `LOAD DATA LOCAL INFILE` has security implications and is off by default in 8.0 clients.

### Q26. `SHOW` and `information_schema`
```sql
SHOW PROCESSLIST;               -- active connections/queries
SHOW FULL PROCESSLIST;
SHOW STATUS LIKE 'Threads%';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW ENGINE INNODB STATUS\G
SELECT table_name, ROUND((data_length+index_length)/1024/1024,1) AS mb
FROM information_schema.tables WHERE table_schema='shop' ORDER BY mb DESC;
```

### Q27. Views, stored procedures, functions, triggers (syntax)
```sql
CREATE VIEW v_city_counts AS SELECT city, COUNT(*) AS n FROM customers GROUP BY city;

DELIMITER $$
CREATE PROCEDURE add_order(IN p_customer BIGINT, IN p_amount DECIMAL(12,2))
BEGIN
  INSERT INTO orders (customer_id, order_date, status, amount)
  VALUES (p_customer, CURDATE(), 'new', p_amount);
END$$

CREATE TRIGGER trg_orders_audit AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (table_name, row_id, action) VALUES ('orders', NEW.order_id, 'INSERT');
END$$
DELIMITER ;

CALL add_order(1, 99.50);
```
`DELIMITER` is a client command, not SQL.

### Q28. `NULL` handling quirks in MySQL
`NULL <=> NULL` is TRUE (the NULL-safe equal operator). `UNIQUE` indexes allow multiple NULLs. `IFNULL(a, b)` is the two-argument form; `COALESCE` is standard. `COUNT(col)` skips NULLs.

### Q29. Case sensitivity
Table and database names follow the file system on Linux (**case sensitive**) and are case-insensitive on Windows/macOS by default (`lower_case_table_names`). Data comparisons depend on the column collation (`_ci` insensitive, `_cs` sensitive, `_bin` binary). Use `BINARY col = 'A'` or `COLLATE utf8mb4_bin` for case-sensitive matches.

### Q30. SQL modes *(Must-know)*
`sql_mode` changes how strict MySQL is. 8.0 default: `ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_ENGINE_SUBSTITUTION`.
- `STRICT_TRANS_TABLES`: invalid data raises an error instead of silently truncating or converting.
- `ONLY_FULL_GROUP_BY`: rejects selecting non-aggregated columns not functionally dependent on the `GROUP BY` columns.
Never disable strict mode just to make a bug go away. Check with `SELECT @@sql_mode;`.

### Q31. Silent truncation and implicit conversion (non-strict mode)
Without strict mode, inserting 300 into a `TINYINT UNSIGNED` stores 255 with a warning, long strings are truncated, and `'abc'` converts to 0 in numeric contexts. `SHOW WARNINGS;` reveals them. Always keep strict mode on.

### Q32. `ENUM` and `SET`
`ENUM('new','paid','shipped')` stores one value as a 1–2 byte index. Pros: compact. Cons: adding a value can require an `ALTER`, ordering is by index position, invalid values are errors in strict mode and `''` in non-strict mode. Often a lookup table with a foreign key (or a `VARCHAR` + `CHECK`) is more flexible.

### Q33. `CHECK` constraints
Enforced from 8.0.16 (earlier versions parsed but ignored them).
```sql
ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price >= 0);
```

### Q34. Temporary tables
```sql
CREATE TEMPORARY TABLE tmp_big AS SELECT * FROM orders WHERE amount > 1000;
```
Visible only to the session, dropped automatically at disconnect. MySQL also creates internal temp tables for sorts, `GROUP BY`, `DISTINCT` and derived tables (in memory with the `TempTable` engine; spill to disk when large). Watch `Created_tmp_disk_tables`.

### Q35. Config files and variables
Main config: `/etc/my.cnf` or `/etc/mysql/my.cnf`, `[mysqld]` section. Dynamic variables: `SET GLOBAL max_connections = 500;` (lost on restart). Persist in 8.0: `SET PERSIST max_connections = 500;` (writes `mysqld-auto.cnf`). Inspect: `SHOW VARIABLES LIKE '...'`, `SELECT * FROM performance_schema.variables_info`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. MySQL architecture overview *(Must-know)*
1. **Connection layer**: connection handling, authentication, thread per connection (thread pool in Enterprise/Percona).
2. **SQL layer**: parser, privilege checks, optimizer, caches (no query cache in 8.0), built-in functions, views, triggers, stored routines.
3. **Storage engine layer**: pluggable engines (InnoDB) through a common handler API.
4. **File system**: data files (`.ibd`), redo logs, undo logs, binlog, relay logs, error and slow logs.

### Q37. Life of a query
Client sends SQL → thread parses → privileges checked → optimizer picks a plan (index choice, join order) using statistics → executor calls handler APIs on InnoDB → rows returned. Writes also go to the InnoDB redo log, undo log and (at commit) the binary log.

### Q38. InnoDB clustered index and secondary indexes *(Must-know)*
Rows live in the **primary key B+tree** leaf pages. A **secondary index** leaf stores the indexed columns plus the **primary key value**. A lookup via a secondary index does two B-tree searches (secondary → primary key → row; the second step is a "bookmark lookup"). Consequences: keep the primary key **short** (it is copied into every secondary index), prefer **monotonic** keys (append-only inserts reduce page splits), and use **covering indexes** to avoid the second lookup.

### Q39. Covering index and `Using index`
When all needed columns are in the index (including the PK), `EXPLAIN` shows `Using index` in `Extra`.
```sql
CREATE INDEX idx_cust_status_amt ON orders (customer_id, status, amount);
SELECT SUM(amount) FROM orders WHERE customer_id = 7 AND status = 'paid';   -- covered
```

### Q40. Composite index rules (leftmost prefix) and column order
An index `(a, b, c)` serves `a`, `a,b`, `a,b,c` conditions, and sorts that match its order. Range conditions stop further columns from being used for filtering (`a = 1 AND b > 5 AND c = 3` uses `a,b` for lookup; `c` only as a filter). Order columns: equality first, then range, then sort/group columns. MySQL 8.0 supports **descending** index columns, so `(a ASC, b DESC)` can serve a mixed `ORDER BY`.

### Q41. Prefix indexes
```sql
CREATE INDEX idx_email_prefix ON customers (email(20));
```
Saves space for long strings. Limits: cannot be used as a covering index for that column and cannot serve `ORDER BY` on the full value. InnoDB key length limit: 3072 bytes (`DYNAMIC` row format), so `VARCHAR(255)` in utf8mb4 (1020 bytes) is fine.

### Q42. Invisible indexes and index usage checks (8.0)
```sql
ALTER TABLE orders ALTER INDEX idx_old INVISIBLE;     -- optimizer ignores it, but it is still maintained
ALTER TABLE orders ALTER INDEX idx_old VISIBLE;
SELECT * FROM sys.schema_unused_indexes;              -- needs performance_schema data since restart
SELECT * FROM sys.schema_redundant_indexes;
```
Make an index invisible first, watch for regressions, then drop it.

### Q43. Functional indexes and generated columns (8.0)
```sql
CREATE INDEX idx_lower_email ON customers ((LOWER(email)));                 -- functional index (8.0.13+)
ALTER TABLE customers ADD COLUMN email_lc VARCHAR(255) AS (LOWER(email)) STORED, ADD INDEX (email_lc);
```
Generated columns can be `VIRTUAL` (computed on read, indexable) or `STORED`. They make JSON fields indexable.

### Q44. `EXPLAIN` in MySQL *(Must-know)*
```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 42 ORDER BY order_date DESC LIMIT 10;
EXPLAIN FORMAT=JSON SELECT ...;
EXPLAIN FORMAT=TREE SELECT ...;           -- 8.0.16+, shows iterator tree
EXPLAIN ANALYZE SELECT ...;               -- 8.0.18+, runs and shows actual rows/time
```
Key columns:
- **type** (best → worst): `system`, `const`, `eq_ref`, `ref`, `range`, `index` (full index scan), `ALL` (full table scan).
- **possible_keys / key / key_len**: candidate and chosen index; `key_len` tells how many index columns are used.
- **rows / filtered**: estimated rows examined / percent kept.
- **Extra**: `Using index` (covering), `Using where`, `Using filesort` (extra sort pass; not necessarily on disk), `Using temporary`, `Using index condition` (index condition pushdown), `Using join buffer (hash join)`.

### Q45. Fixing `Using filesort` and `Using temporary`
Add an index that matches `WHERE` equality columns followed by `ORDER BY` columns (same direction/prefix). For `GROUP BY`, an index on the grouped columns can avoid a temp table. Limit rows early (`LIMIT`), reduce selected columns, and ensure `sort_buffer_size` is reasonable (do not set it huge globally; it is per sort).

### Q46. The slow query log
```sql
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 0.5;
SET GLOBAL log_queries_not_using_indexes = ON;   -- noisy; use with min_examined_row_limit
```
Analyze with `mysqldumpslow -s t -t 10 slow.log`, `pt-query-digest slow.log` (Percona Toolkit), or `performance_schema.events_statements_summary_by_digest`.

### Q47. Performance Schema and `sys` schema
`performance_schema` instruments waits, statements, locks, memory. The `sys` schema gives readable views:
```sql
SELECT * FROM sys.statement_analysis ORDER BY total_latency DESC LIMIT 10;
SELECT * FROM sys.innodb_lock_waits;
SELECT * FROM sys.host_summary;
SELECT * FROM sys.schema_table_statistics WHERE table_schema='shop';
```

### Q48. Transaction isolation levels in InnoDB *(Must-know)*
Default: **REPEATABLE READ**. Consistent (snapshot) reads see the state at the first read in the transaction. Locking reads (`SELECT ... FOR UPDATE/SHARE`, `UPDATE`, `DELETE`) use the **latest committed** data plus next-key locks. READ COMMITTED takes a fresh snapshot per statement, takes fewer gap locks, and is popular for high-concurrency OLTP (and required for some binlog/replication setups with `ROW` format).
```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT @@transaction_isolation;
```

### Q49. Row locks, gap locks and next-key locks *(Must-know)*
- **Record lock**: locks an index record.
- **Gap lock**: locks the gap between index records to prevent inserts (REPEATABLE READ range scans).
- **Next-key lock**: record + gap before it (default in REPEATABLE READ).
Unindexed `WHERE` conditions force a scan that locks many rows (or all). Always index columns used in `UPDATE/DELETE ... WHERE`.

### Q50. `SELECT ... FOR UPDATE`, `FOR SHARE`, `SKIP LOCKED`, `NOWAIT` (8.0)
```sql
START TRANSACTION;
SELECT id FROM jobs WHERE status='pending' ORDER BY id LIMIT 5 FOR UPDATE SKIP LOCKED;
UPDATE jobs SET status='running' WHERE id IN (...);
COMMIT;
```
`SKIP LOCKED` is the standard pattern for a job queue table with multiple workers. `FOR SHARE` replaces `LOCK IN SHARE MODE`.

### Q51. Deadlocks in MySQL
InnoDB detects deadlocks and rolls back the transaction with the fewest changes (error 1213, `ER_LOCK_DEADLOCK`). Diagnose: `SHOW ENGINE INNODB STATUS\G` (section "LATEST DETECTED DEADLOCK"), enable `innodb_print_all_deadlocks`. Reduce: consistent access order, short transactions, indexes on filter columns, READ COMMITTED where acceptable, retry logic in the application.

### Q52. Lock wait timeout
Error 1205: `Lock wait timeout exceeded` after `innodb_lock_wait_timeout` seconds (default 50). Cause: another transaction holds a lock too long (often an idle open transaction). Find: `sys.innodb_lock_waits`, `information_schema.innodb_trx`, `performance_schema.data_locks`. Fix the long transaction, not just the timeout.

### Q53. Metadata locks (MDL)
DDL (`ALTER TABLE`) needs an exclusive metadata lock; it waits for all running transactions that touched the table, and while it waits it **blocks new queries** on that table, causing a pile-up. Avoid by checking for long transactions before DDL, setting `lock_wait_timeout` for DDL sessions, and using online schema change tools.

### Q54. Online DDL: `ALGORITHM` and `LOCK`
```sql
ALTER TABLE orders ADD COLUMN note VARCHAR(100), ALGORITHM=INSTANT;            -- 8.0.12+, metadata only
ALTER TABLE orders ADD INDEX idx_x (x), ALGORITHM=INPLACE, LOCK=NONE;
ALTER TABLE orders MODIFY amount DECIMAL(14,2), ALGORITHM=COPY, LOCK=SHARED;   -- full table copy
```
If the requested algorithm/lock is not possible MySQL errors instead of silently using a worse one (which is why you specify them). Even `INPLACE` uses a short MDL at start and end and builds a change log.

### Q55. Schema change on huge tables
Use `pt-online-schema-change` (triggers) or `gh-ost` (reads binlog, triggerless), or native `INSTANT/INPLACE` where possible. Watch replication lag, disk space for table copies, foreign keys complexity, and throttle.

### Q56. Backup basics: logical vs physical
- **Logical** (`mysqldump`, `mysqlpump`, MySQL Shell dump/load utilities): SQL text, portable, slower to restore.
- **Physical** (Percona XtraBackup, MySQL Enterprise Backup, file snapshots, Clone plugin): copy data files, much faster for large data.
Use `--single-transaction` with InnoDB for a consistent dump without locking; combine with binary logs for **point-in-time recovery (PITR)**.

### Q57. Point-in-time recovery
1. Restore last full backup.
2. Replay binary logs up to just before the mistake:
```bash
mysqlbinlog --start-datetime="2025-10-24 09:00:00" --stop-datetime="2025-10-24 10:14:59" binlog.000123 | mysql -u root -p
```
Requires binary logging enabled and retained (`binlog_expire_logs_seconds`).

### Q58. Binary log formats
`STATEMENT` (logs SQL; small but non-deterministic functions can diverge), `ROW` (logs changed rows; safest, default in 8.0, larger), `MIXED`. Use `ROW` with `binlog_row_image=FULL` (or `MINIMAL` to save space if all tables have PKs). Required for CDC tools like Debezium.

### Q59. Replication basics *(Must-know)*
Source (primary) writes changes to the binary log. Replica's I/O thread copies events to its **relay log**; the SQL (applier) thread executes them. Default is **asynchronous**. Terms changed in 8.0.22+: `SOURCE`/`REPLICA` (`CHANGE REPLICATION SOURCE TO`, `START REPLICA`, `SHOW REPLICA STATUS`).
```sql
CHANGE REPLICATION SOURCE TO SOURCE_HOST='10.0.0.1', SOURCE_USER='repl', SOURCE_PASSWORD='***', SOURCE_AUTO_POSITION=1;
START REPLICA;
SHOW REPLICA STATUS\G     -- check Replica_IO_Running, Replica_SQL_Running, Seconds_Behind_Source
```

### Q60. GTID (global transaction identifiers)
Each transaction gets an ID `server_uuid:sequence`. Makes failover and re-pointing replicas easy (`SOURCE_AUTO_POSITION=1`), avoids binlog file/position bookkeeping. Enable: `gtid_mode=ON`, `enforce_gtid_consistency=ON`. Some statements are disallowed (e.g. `CREATE TABLE ... SELECT`, mixed-engine transactions).

### Q61. Replication lag causes and fixes
Causes: long single-threaded transactions, big batch updates/deletes, disk I/O on replica, missing PKs (row-based apply scans), weak replica hardware, heavy reads on replica. Fixes: multi-threaded replication (`replica_parallel_workers`, `replica_parallel_type=LOGICAL_CLOCK`), batch writes in chunks, PKs on every table, better replica specs, avoid long transactions. Monitor `Seconds_Behind_Source`, plus heartbeat tools (`pt-heartbeat`) for accuracy.

### Q62. Read/write splitting and its pitfalls
Writes go to the source, reads to replicas (via app logic, ProxySQL, MySQL Router, ORM routers). Pitfalls: replication lag causes stale reads (read-your-writes violations after a write; route recent writers to the source or use GTID waits `WAIT_FOR_EXECUTED_GTID_SET`), transactions must stay on one node, and failover needs handling.

### Q63. Connection management
Each connection uses a thread and memory (`thread_stack`, `sort_buffer_size`, `join_buffer_size`, etc.). `max_connections` default 151. Too many connections cause memory pressure and context switching. Use pooling (HikariCP, `mysql2` pool), ProxySQL, or Router. Error 1040 "Too many connections" means the limit is hit (often leaks or missing pool caps).
```sql
SHOW STATUS LIKE 'Threads_connected'; SHOW STATUS LIKE 'Max_used_connections';
```

### Q64. Character set mismatches and collation errors
`Illegal mix of collations` appears when comparing columns with different collations (e.g. `utf8mb4_0900_ai_ci` vs `utf8mb4_unicode_ci`). Fix by aligning table/column collations (`ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4 COLLATE ...`) or adding `COLLATE` in the query. Also keep the connection charset right (`SET NAMES utf8mb4`).

### Q65. JSON in MySQL
```sql
CREATE TABLE events (id BIGINT PRIMARY KEY AUTO_INCREMENT, payload JSON);
INSERT INTO events (payload) VALUES ('{"user":"Ritesh Kumar","tags":["a","b"],"age":28}');
SELECT payload->>'$.user' AS user, JSON_EXTRACT(payload, '$.age') AS age FROM events;
SELECT * FROM events WHERE JSON_CONTAINS(payload->'$.tags', '"a"');
UPDATE events SET payload = JSON_SET(payload, '$.age', 29) WHERE id = 1;
-- Index a JSON path via generated column:
ALTER TABLE events ADD COLUMN user_name VARCHAR(100) AS (payload->>'$.user') STORED, ADD INDEX (user_name);
-- Multi-valued index (8.0.17+):
CREATE INDEX idx_tags ON events ((CAST(payload->'$.tags' AS CHAR(20) ARRAY)));
```
`JSON` is stored in a binary format with validation. Updates can be in place (partial update) for small changes. Do not store everything as JSON; relational columns are faster and constrained.

### Q66. Full-text search in InnoDB
```sql
CREATE FULLTEXT INDEX ft ON articles (title, body);
SELECT id, MATCH(title, body) AGAINST ('mysql tuning' IN NATURAL LANGUAGE MODE) AS score
FROM articles WHERE MATCH(title, body) AGAINST ('mysql tuning' IN NATURAL LANGUAGE MODE);
SELECT * FROM articles WHERE MATCH(title, body) AGAINST ('+mysql -oracle' IN BOOLEAN MODE);
```
Stopwords and minimum token size (`innodb_ft_min_token_size`) affect results. Use the `ngram` parser for CJK. For relevance at scale use Elasticsearch/OpenSearch/Meilisearch.

### Q67. Window functions and CTEs in MySQL 8
Supported: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `NTILE`, `FIRST_VALUE`, `SUM() OVER`, named windows, recursive CTEs. Older 5.7 needed user variables or self-joins. Check version before using.
```sql
WITH ranked AS (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees e
)
SELECT * FROM ranked WHERE rn = 1;
```

### Q68. Row-based `UPDATE` with joins and `DELETE` with joins
```sql
UPDATE orders o JOIN customers c ON c.customer_id = o.customer_id
SET o.status = 'vip' WHERE c.city = 'Delhi';

DELETE o FROM orders o LEFT JOIN customers c ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;                      -- delete orphan orders
```
MySQL does not allow `DELETE FROM t WHERE id IN (SELECT ... FROM t)` on the same table directly; wrap in a derived table (`SELECT * FROM (...) x`).

### Q69. Bulk insert performance
Use multi-row `INSERT ... VALUES (...),(...)` batches of 500–5,000 rows, `LOAD DATA INFILE`, wrap batches in transactions, avoid autocommit per row, consider dropping secondary indexes during massive loads, increase `innodb_flush_log_at_trx_commit=2` temporarily only when durability loss is acceptable, and use sorted PK order.

### Q70. Common MySQL monitoring commands
```sql
SHOW GLOBAL STATUS LIKE 'Questions';            -- queries
SHOW GLOBAL STATUS LIKE 'Slow_queries';
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';  -- reads vs read_requests -> hit ratio
SHOW GLOBAL STATUS LIKE 'Created_tmp%tables';
SHOW GLOBAL STATUS LIKE 'Handler_read%';        -- how rows are read (index vs scan)
SELECT * FROM information_schema.innodb_trx\G   -- running transactions
```

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. InnoDB architecture: the big picture *(Must-know)*
In memory: **buffer pool** (cached data and index pages, plus change buffer and adaptive hash index), **log buffer**. On disk: **tablespaces** (`.ibd` file per table by default, `innodb_file_per_table=ON`; system and undo tablespaces), **redo log** (`#innodb_redo` directory in 8.0.30+), **undo logs** (undo tablespaces), **doublewrite buffer** (protects against torn pages), and the MySQL **binary log** at the server layer.

### Q72. The InnoDB buffer pool
Caches pages using a modified LRU (young/old sublists to resist full-scan pollution). Size with `innodb_buffer_pool_size` (commonly 60–75% of RAM on a dedicated host). Use multiple instances (`innodb_buffer_pool_instances`) on large pools. Resize online (in chunks). Dump/load at restart (`innodb_buffer_pool_dump_at_shutdown`, `..._load_at_startup`) to warm the cache. Hit ratio estimate: `1 - Innodb_buffer_pool_reads / Innodb_buffer_pool_read_requests`.

### Q73. Redo log, undo log and binary log: the differences *(Must-know)*
| | Redo log | Undo log | Binary log |
|---|---|---|---|
| Layer | InnoDB | InnoDB | MySQL server |
| Purpose | crash recovery (durability) | rollback + MVCC old versions | replication, PITR, CDC |
| Content | physical page changes | previous row versions | logical events (rows/statements) |
| Written | sequentially, before commit returns | in undo tablespaces | at commit |
A commit with both enabled uses **two-phase commit** between InnoDB and the binlog so they stay consistent after a crash.

### Q74. Durability settings: `innodb_flush_log_at_trx_commit` and `sync_binlog`
- `innodb_flush_log_at_trx_commit=1` (default): write and `fsync` the redo log at every commit. Full durability.
- `=2`: write to OS cache each commit, `fsync` about every second. An OS crash or power loss can lose ~1 second.
- `=0`: write and flush about every second. A `mysqld` crash can lose ~1 second.
- `sync_binlog=1`: `fsync` the binlog at every commit (needed for safe replication). `0` leaves flushing to the OS.
For strict durability use `1` and `1`. Relax only with a conscious RPO trade-off.

### Q75. Doublewrite buffer
InnoDB pages (16 KB) are bigger than disk atomic writes (often 4 KB), so a crash can leave a half-written ("torn") page. Pages are first written to the doublewrite area, then to their place; recovery uses the intact copy. Costs some write bandwidth. Disable only on filesystems/hardware that guarantee atomic 16 KB writes.

### Q76. Change buffer and adaptive hash index
**Change buffer**: caches changes to secondary index pages not in the buffer pool (for non-unique indexes) and merges them later, reducing random I/O for writes. **Adaptive hash index (AHI)**: InnoDB builds in-memory hash indexes for hot B-tree lookups. AHI can become a contention point under some workloads (`innodb_adaptive_hash_index=OFF` is a known tuning step).

### Q77. MVCC in InnoDB
Each row has hidden columns: `DB_TRX_ID` (last modifying transaction) and `DB_ROLL_PTR` (pointer to undo record). A consistent read builds a **read view** (list of active transaction ids) and walks the undo chain to find the row version visible to it. Purge threads delete undo records no longer needed. **Long transactions** keep old versions alive, growing undo and slowing reads (history list length in `SHOW ENGINE INNODB STATUS`).

### Q78. Why is a long-running idle transaction dangerous?
It holds locks, pins an old read view (undo cannot be purged → history list length grows → performance degrades and disk fills), blocks DDL via metadata locks, and delays replication on the replica if replicated. Detect: `information_schema.innodb_trx` ordered by `trx_started`; set application timeouts and ensure `finally { commit/rollback }`.

### Q79. Page, extent, segment, tablespace
Page = 16 KB (default). Extent = 64 pages (1 MB). Segments (leaf/non-leaf per index) allocate extents. Tablespaces hold segments. Rows larger than about half a page spill long columns off-page (`DYNAMIC` row format stores only a 20-byte pointer). Page fill factor and sequential inserts influence fragmentation.

### Q80. Fragmentation and `OPTIMIZE TABLE`
Random inserts, deletes and updates leave free space in pages. `OPTIMIZE TABLE t` (or `ALTER TABLE t ENGINE=InnoDB`) rebuilds the table and indexes online (with `INPLACE`), reclaiming space. Estimate waste: `data_free` in `information_schema.tables`. Do not run blindly on large tables in peak hours.

### Q81. Choosing the primary key in InnoDB *(Must-know)*
Prefer `BIGINT UNSIGNED AUTO_INCREMENT` (compact, sequential, append-friendly). Random UUIDv4 as a clustered key causes page splits and cache misses and bloats every secondary index (16 bytes + overhead). If you need UUIDs: store as `BINARY(16)` using `UUID_TO_BIN(uuid, 1)` (swap flag makes time-based UUIDv1 monotonic), or use UUIDv7/ULID in the application. Never leave a table without an explicit primary key (breaks row-based replication efficiency and Group Replication requires it).

### Q82. Auto-increment locking and gaps in replication
`innodb_autoinc_lock_mode`: `0` traditional (table lock), `1` consecutive, `2` interleaved (default in 8.0, fastest, gaps possible, requires row-based binlog). Gaps are normal. Use `AUTO_INCREMENT` offset/increment (`auto_increment_increment`, `auto_increment_offset`) in multi-primary setups to avoid collisions.

### Q83. Optimizer features: index condition pushdown, MRR, hash join, semijoin
- **ICP**: evaluates parts of the `WHERE` inside the storage engine using index columns (`Using index condition`).
- **MRR / BKA**: batch lookups to reduce random I/O.
- **Hash join** (8.0.18+): replaces block nested loop for equi-joins without usable indexes.
- **Semijoin / subquery materialization**: rewrites `IN (subquery)`.
- **Derived table merge**: merges views/derived tables into the outer query when possible.
- **Skip scan** (8.0.13+): uses a composite index even if the leading column has a condition missing, when it has few distinct values.
Toggle with `optimizer_switch` for testing.

### Q84. Optimizer hints and index hints
```sql
SELECT /*+ INDEX(o idx_orders_cust) */ * FROM orders o WHERE customer_id = 5;       -- optimizer hint (8.0)
SELECT * FROM orders USE INDEX (idx_orders_cust) WHERE customer_id = 5;             -- index hint
SELECT /*+ JOIN_ORDER(c, o) */ ...;
SELECT /*+ MAX_EXECUTION_TIME(2000) */ * FROM big;                                 -- ms, SELECT only
```
Hints are a last resort; they can break when data changes. Prefer fixing indexes and statistics.

### Q85. Statistics, histograms and `ANALYZE TABLE`
InnoDB persistent stats are sampled (`innodb_stats_persistent_sample_pages`). `ANALYZE TABLE t;` refreshes them. 8.0 histograms help the optimizer on **non-indexed** skewed columns:
```sql
ANALYZE TABLE orders UPDATE HISTOGRAM ON status, city WITH 100 BUCKETS;
SELECT * FROM information_schema.column_statistics;
```

### Q86. `COUNT(*)` in InnoDB
There is no stored row count; InnoDB scans the smallest secondary index (or PK). It is O(n) on large tables. Use approximate counts (`information_schema.tables.table_rows` is an estimate), summary tables, or cached counters if exactness is not needed.

### Q87. Pagination strategies in MySQL
`LIMIT 100000, 20` reads and discards 100,000 rows. Better:
```sql
-- keyset
SELECT * FROM orders WHERE order_id < 987654 ORDER BY order_id DESC LIMIT 20;
-- deferred join: find ids from a narrow index, then fetch rows
SELECT o.* FROM orders o
JOIN (SELECT order_id FROM orders ORDER BY created_at DESC LIMIT 100000, 20) x USING (order_id);
```

### Q88. Handling `OR` and `IN` with indexes
`OR` on different columns may use **index merge** (`index_merge` in EXPLAIN) or fall back to a scan; a `UNION ALL` of two indexed queries is often faster and more predictable. Very long `IN (...)` lists are evaluated with binary search on sorted constants; for thousands of values use a temporary table join.

### Q89. Join order and join buffer
The optimizer chooses join order using cost estimates; small result set first with index lookups on the next table is ideal. `STRAIGHT_JOIN` forces order. Missing indexes on join columns show `type: ALL` and `Using join buffer`. Always index the join columns of the **driven (inner)** table.

### Q90. Derived tables and views performance
Since 5.7 simple views and derived tables are merged. If they cannot be merged (contain `LIMIT`, `DISTINCT`, aggregates, `UNION`), MySQL materializes them (8.0 can add an auto-generated index on the temporary table). Check with `EXPLAIN`: `DERIVED` rows.

### Q91. Partitioning in MySQL
Supported types: `RANGE`, `LIST`, `HASH`, `KEY`, subpartitioning. Only InnoDB/NDB. The partitioning column must be part of **every** unique key including the primary key. Benefits: partition pruning, fast `DROP PARTITION` for retention, maintenance per partition. Costs: no foreign keys on partitioned tables, more complex DDL, queries without the partition key scan all partitions.
```sql
CREATE TABLE logs (
  id BIGINT NOT NULL AUTO_INCREMENT, created_at DATE NOT NULL, msg TEXT,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE COLUMNS (created_at) (
  PARTITION p2025_01 VALUES LESS THAN ('2025-02-01'),
  PARTITION p2025_02 VALUES LESS THAN ('2025-03-01'),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);
ALTER TABLE logs DROP PARTITION p2025_01;
```

### Q92. Foreign keys: pros and cons at scale
Pros: integrity enforced in one place, cascades. Cons: extra locks on parent rows during child inserts (shared locks), slower bulk loads, complicates online schema change tools and sharding, cascades can lock many rows. Many large systems keep FKs in smaller internal databases and drop them in huge sharded tables (with application-level checks and reconciliation jobs).

### Q93. Stored programs and event scheduler
Procedures, functions, triggers, events. Event scheduler runs cron-like jobs inside MySQL:
```sql
SET GLOBAL event_scheduler = ON;
CREATE EVENT purge_old_logs ON SCHEDULE EVERY 1 DAY
DO DELETE FROM logs WHERE created_at < NOW() - INTERVAL 90 DAY LIMIT 10000;
```
Replicas also have the event definitions but disabled; understand where events run in failover. Heavy logic in stored code is harder to test, version and scale (it runs on the primary's CPU).

### Q94. Security features
Authentication plugins: `caching_sha2_password` (default in 8.0), `mysql_native_password` (legacy, removed by default in 8.4), LDAP/Kerberos in Enterprise. TLS: `require_secure_transport=ON`. Password policy: `validate_password` component. Roles. Encryption: InnoDB tablespace encryption (TDE with keyring), binlog encryption, redo/undo encryption. Auditing: Enterprise Audit or Percona Audit Log plugin. Use least privilege, no `root` for apps, restrict `host` patterns, rotate credentials.

### Q95. SQL injection and prepared statements in MySQL
Use server-side or driver-level parameterization. Never concatenate user input. Sanitize identifiers via whitelists. Disable `LOAD DATA LOCAL` unless needed. Limit privileges (`FILE`, `SUPER`, `PROCESS`, `SHUTDOWN` only for admins).
```js
const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);   // mysql2
```

### Q96. Time zones and `TIMESTAMP` behavior
`SELECT @@global.time_zone, @@session.time_zone;`. Named zones need the time zone tables loaded (`mysql_tzinfo_to_sql`). `TIMESTAMP` converts to UTC for storage and back on read per session zone; `DATETIME` does not. Standardize: store UTC, set `time_zone='+00:00'` for app connections, convert in the UI. Beware `NOW()` inside replicated statements (row-based replication avoids drift).

### Q97. Handling large `DELETE`/`UPDATE`
Batch to limit lock time and undo/redo size:
```sql
DELETE FROM events WHERE created_at < NOW() - INTERVAL 90 DAY ORDER BY id LIMIT 5000;   -- repeat until 0 rows
```
Sleep between batches, monitor replica lag, prefer partition drops for time-based retention.

### Q98. Archiving and retention strategy
Partition by time and drop old partitions, or move cold data to an archive table/database/object storage (`pt-archiver`), compress with `ROW_FORMAT=COMPRESSED` or page compression, keep summaries (rollups) for reporting.

### Q99. Common replication topologies
Source → replicas (read scaling), chain replication (replica of replica, more lag), multi-source replication (a replica fed by several sources, for consolidation/analytics), delayed replica (`SOURCE_DELAY`, protection against accidental deletes), circular/multi-primary (conflict risk), Group Replication / InnoDB Cluster (consensus-based), cross-region replicas for DR.

### Q100. Semi-synchronous replication
The source waits for at least one replica to acknowledge receipt of the event before committing (`rpl_semi_sync_*` plugins/variables, `AFTER_SYNC` lossless mode). Reduces data-loss risk on failover; adds commit latency and falls back to async on timeout.

### Q101. Group Replication and InnoDB Cluster *(Must-know)*
**Group Replication**: Paxos-based group communication; transactions are certified; single-primary (default) or multi-primary mode; automatic failover; requires InnoDB, primary keys, GTID, row binlog. **InnoDB Cluster** = Group Replication + **MySQL Shell** (AdminAPI) + **MySQL Router** (transparent routing). **InnoDB ClusterSet** adds cross-region async replication. Galera (MariaDB/Percona XtraDB Cluster) is a different synchronous multi-primary approach.

### Q102. MySQL Router, ProxySQL, HAProxy
Router: lightweight routing aware of InnoDB Cluster topology (read/write and read-only ports). ProxySQL: advanced proxy with query routing/rules, connection multiplexing, caching, failover handling. HAProxy: TCP load balancer with health checks. Choose based on routing needs and operational skills.

### Q103. Failover process (manual or automated)
1. Detect source failure (health checks, orchestrator).
2. Choose the most up-to-date replica (compare GTID sets / relay log applied).
3. Ensure old source cannot accept writes (fence/`super_read_only`).
4. Promote replica (`STOP REPLICA; RESET REPLICA ALL; SET GLOBAL read_only=OFF`).
5. Repoint other replicas (`CHANGE REPLICATION SOURCE TO ... SOURCE_AUTO_POSITION=1`).
6. Update routing/DNS/proxy.
7. Rebuild the old source as a replica.
Tools: Orchestrator, MHA, InnoDB Cluster AdminAPI, managed services.

### Q104. Backup tools in practice
`mysqldump` (small/medium), `mydumper/myloader` (parallel logical), MySQL Shell `util.dumpInstance/loadDump` (fast, parallel), **Percona XtraBackup** (hot physical backup, incremental), **MySQL Enterprise Backup**, **Clone plugin** (`CLONE INSTANCE FROM`, copies data directly between servers), LVM/EBS snapshots (with `FLUSH TABLES WITH READ LOCK` or InnoDB crash-consistent snapshots). Always test restores and keep binlogs for PITR.

### Q105. Corruption and recovery
InnoDB recovers from crashes using redo logs and the doublewrite buffer. Real corruption (bad hardware, bugs) shows as checksum errors in the error log. Options: restore from backup + binlogs, rebuild from a replica, `innodb_force_recovery` (1–6) to dump data from a corrupt instance (read-only, last resort), `mysqlcheck`, `CHECK TABLE`. Prevention: checksums, UPS, ECC RAM, reliable storage, monitoring SMART/I/O errors.

### Q106. Upgrade strategy (5.7 → 8.0 → 8.4)
Read release notes; run `util.checkForServerUpgrade()` in MySQL Shell; test application queries (reserved words like `RANK`, `GROUPS`, `ROW`, `LATERAL`; `utf8mb4` collation changes; removed features such as query cache, `NO_AUTO_CREATE_USER` sql_mode; auth plugin changes break old clients). Upgrade replicas first, then promote; in-place upgrade or logical/replication-based upgrade; keep rollback path (backup/replica).

### Q107. Common 8.0 gotchas for old applications
- `caching_sha2_password` requires TLS or RSA key exchange for first connect; old drivers fail ("Authentication plugin cannot be loaded").
- New reserved words break column names.
- `GROUP BY` no longer sorts implicitly; add `ORDER BY`.
- `ONLY_FULL_GROUP_BY` is enforced.
- Default collation changed (`utf8mb4_0900_ai_ci`) causing collation mix errors across old tables.
- Implicit `ASC/DESC` on `GROUP BY` removed.

### Q108. Cloud MySQL: RDS, Aurora, Cloud SQL
RDS MySQL: managed community MySQL (automated backups, Multi-AZ, read replicas, parameter groups). **Aurora MySQL**: MySQL-compatible with a shared distributed storage layer (6 copies across 3 AZs), fast failover and up to 15 low-lag replicas, different internals (no traditional binlog replication inside the cluster, optional binlog for external). Cloud SQL / Azure Database similar. Know limits: no `SUPER`, parameter groups, upgrade windows, storage autoscaling, cost model.

### Q109. Sharding MySQL
Options: application-level sharding (shard key, routing layer), **Vitess** (YouTube; sharding middleware used by PlanetScale), ProxySQL rules, NDB Cluster, or distributed MySQL-compatible databases (TiDB). Hard parts: choosing a shard key, cross-shard queries/transactions, resharding, global unique IDs (snowflake ids, auto_increment offsets), global secondary indexes.

### Q110. Observability stack
Metrics via `mysqld_exporter` → Prometheus/Grafana, Percona PMM, Datadog; logs (error, slow); traces linking queries to services; alert on connections %, replication lag, buffer pool hit ratio, disk space, history list length, deadlocks, slow query rate, `Threads_running`, QPS drop, p95 latency.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. Diagnosing a slow MySQL server (method) *(Must-know)*
1. **Is it the DB?** Check app metrics, `Threads_running` spike, CPU, I/O wait, memory/swap.
2. `SHOW FULL PROCESSLIST` / `performance_schema.threads`: many long-running or "Waiting for ... lock" states?
3. Top statements: `sys.statement_analysis` or `pt-query-digest` on the slow log.
4. Locks: `sys.innodb_lock_waits`, `SHOW ENGINE INNODB STATUS` (transactions, history list length, semaphore waits).
5. I/O: `iostat`, `Innodb_data_reads/writes`, buffer pool hit ratio, checkpoint age (redo log too small → furious flushing).
6. Plans: `EXPLAIN ANALYZE` on the top queries; fix indexes/queries.
7. Config/hardware only after workload fixes.

### Q112. Tuning memory
Global: `innodb_buffer_pool_size`, `innodb_log_buffer_size`, `key_buffer_size` (MyISAM only, small), `tmp_table_size`/`max_heap_table_size`, `temptable_max_ram`. Per-connection: `sort_buffer_size`, `join_buffer_size`, `read_buffer_size`, `read_rnd_buffer_size`, `thread_stack`. Estimated max memory ≈ global + `max_connections × per-connection buffers`. Large per-connection buffers × many connections can cause OOM kills; keep them modest.

### Q113. Tuning I/O
`innodb_io_capacity` / `innodb_io_capacity_max` (match SSD/NVMe IOPS), `innodb_flush_method=O_DIRECT` (avoid double buffering on Linux), `innodb_read_io_threads`/`write_io_threads`, `innodb_log_file_size` / `innodb_redo_log_capacity` (large enough for ~1 hour of peak writes to avoid checkpoint stalls), `innodb_flush_neighbors=0` for SSD, filesystem `noatime`, XFS/ext4, separate volumes for data and redo/binlog if helpful.

### Q114. Checkpointing and flushing stalls
If the redo log fills faster than dirty pages are flushed, InnoDB throttles writes aggressively ("async/sync flush"), causing latency spikes. Watch checkpoint age and `Innodb_buffer_pool_pages_dirty`, tune `innodb_max_dirty_pages_pct`, `innodb_io_capacity`, and make redo capacity larger (8.0.30+: `innodb_redo_log_capacity`, resizable online).

### Q115. Thread pool and connection scalability
Default: one thread per connection (fine up to a few thousand mostly idle connections). Percona/Enterprise **thread pool** limits active threads to improve scalability under many concurrent connections. Use ProxySQL multiplexing and app pools to keep `Threads_running` near CPU core count.

### Q116. `Threads_running` and CPU saturation
`Threads_connected` can be large; the key signal is `Threads_running`. If it is high (above cores × a few) the server is saturated: find the top consumers, kill or throttle runaway queries, add indexes, or limit concurrency (`max_execution_time`, proxy rate limits, backpressure).

### Q117. Temp tables, filesort and spilling to disk
`Created_tmp_disk_tables` rising means temp tables exceed memory limits (`tmp_table_size`, `max_heap_table_size`, or TempTable engine's `temptable_max_ram`, then mmap/disk). Causes: `GROUP BY`/`DISTINCT`/`UNION` on large sets, BLOB/TEXT columns in temp tables (older engines), missing indexes. Fix queries first; bumping memory is a short-term patch.

### Q118. Bulk change safely on a hot table (zero-downtime pattern)
1. Add nullable column (`ALGORITHM=INSTANT`).
2. Deploy code writing both old and new.
3. Backfill in primary-key ranges of 1–5k rows with sleeps and lag checks.
4. Add index online (`INPLACE, LOCK=NONE`) or via gh-ost.
5. Switch reads, then writes; later drop old column.
Validate on a production-size staging copy and have a rollback.

### Q119. Reading `SHOW ENGINE INNODB STATUS` *(Must-know)*
Sections: **SEMAPHORES** (mutex/rw-lock waits indicate contention), **LATEST DETECTED DEADLOCK**, **TRANSACTIONS** (active, long ones, lock structs, "history list length"), **FILE I/O**, **INSERT BUFFER AND ADAPTIVE HASH INDEX**, **LOG** (LSN, last checkpoint, pending writes), **BUFFER POOL AND MEMORY** (hit rate, free buffers, dirty pages, read-ahead), **ROW OPERATIONS** (queries inside InnoDB, reads/inserts per second). A growing history list length (hundreds of thousands+) implies purge lag from long transactions.

### Q120. Locking behavior deep dive: which locks does this statement take?
Under REPEATABLE READ:
- `SELECT ... WHERE pk = 5 FOR UPDATE` (unique index, found): record lock only.
- `... WHERE pk BETWEEN 5 AND 10 FOR UPDATE`: next-key locks over the range (including gaps).
- `UPDATE ... WHERE non_indexed_col = x`: scans the clustered index and locks every row scanned (effectively table lock).
- `INSERT`: takes an insert intention lock; conflicts with gap locks.
- Unique key duplicate check takes a shared lock → classic deadlock when two sessions insert the same key.
Use `performance_schema.data_locks` (8.0) to see actual locks.

### Q121. Gap-lock-induced deadlocks and READ COMMITTED
Many production OLTP systems use READ COMMITTED to avoid most gap locks, with `binlog_format=ROW`. Trade-offs: non-repeatable reads within a transaction; phantoms; statement-level snapshots. Make sure application logic doesn't rely on repeatable snapshots, or keep REPEATABLE READ and fix access patterns.

### Q122. Handling hot rows (counters, inventory)
A single row updated by thousands of transactions serializes on its lock. Options: shard the counter across N rows and sum, batch updates (queue + aggregate), use Redis for counters and write behind, use `UPDATE ... SET stock = stock - 1 WHERE id = ? AND stock > 0` (atomic, check affected rows), and keep transactions short around hot rows.

### Q123. Optimistic vs pessimistic locking patterns
Pessimistic: `SELECT ... FOR UPDATE`. Optimistic: version column.
```sql
UPDATE products SET stock = stock - 1, version = version + 1 WHERE id = 7 AND version = 3;
-- application checks ROW_COUNT() = 1 else retry
```
Optimistic scales better under low contention; pessimistic is simpler under high contention on a few rows.

### Q124. Exactly-once-ish writes: idempotency in MySQL
Unique key on `request_id` plus `INSERT ... ON DUPLICATE KEY UPDATE id = id` (or `INSERT IGNORE` carefully) so retries are safe. Use the outbox table pattern: write business change and outbox row in one transaction; a relay (Debezium reading the binlog) publishes to Kafka.

### Q125. Binlog-based CDC and event streaming
Debezium/Maxwell/Canal read the binlog (needs `binlog_format=ROW`, `binlog_row_image=FULL`, GTID recommended, a replication-privileged user). Use for search indexing, caches, analytics, and microservice integration. Watch binlog retention (`binlog_expire_logs_seconds`), schema change handling, and initial snapshot load.

### Q126. Sizing and capacity planning
Estimate working set (hot data + indexes) vs RAM, write rate (redo MB/s, binlog GB/day), IOPS, connections, replica count, storage growth (with indexes and fragmentation overhead ~1.2–1.5×). Load-test with production-like data. Plan for 2× headroom on peak and test failover under load.

### Q127. Security hardening checklist
`mysql_secure_installation`, remove anonymous users and test DB, bind to private interface (`bind-address`), firewall port 3306, TLS enforced, strong auth plugin, least privilege and roles, no wildcard hosts in production, disable `local_infile`, restrict `secure_file_priv`, audit logs, regular patching, encrypted backups, separate admin accounts with MFA via bastion, secrets in a vault.

### Q128. Multi-tenant designs with MySQL
Shared tables with `tenant_id` as the first column of indexes/PK (e.g. `(tenant_id, id)` to cluster tenant data), schema-per-tenant (many tables; watch table cache/open files limits), or database-per-tenant on separate servers for big tenants. Ensure noisy-neighbor controls (resource groups, rate limits), per-tenant backup/restore plan, and migration tooling that scales to thousands of schemas.

### Q129. Resource groups, `max_execution_time`, and query kill switches
```sql
SET GLOBAL max_execution_time = 5000;              -- ms, SELECT statements
SELECT /*+ MAX_EXECUTION_TIME(1000) */ ...;
KILL QUERY 12345; KILL CONNECTION 12345;
CREATE RESOURCE GROUP batch TYPE=USER VCPU=0-1 THREAD_PRIORITY=10;   -- 8.0
SELECT /*+ RESOURCE_GROUP(batch) */ ...;
```
Use these to protect OLTP from reporting queries.

### Q130. Reporting on MySQL: offloading
Run analytics on replicas (with lag awareness), summary tables or materialized-like rollups, HeatWave (OCI/Aurora-like in-memory analytics accelerator), ETL/CDC to ClickHouse/BigQuery/Snowflake. Avoid long-running reports on the primary.

### Q131. Vector search and AI-era features
MySQL 9.0 introduced a `VECTOR` data type and basic functions (check the docs for exact support and availability in your distribution/cloud); HeatWave adds vector store features. For production RAG, many teams still use PostgreSQL `pgvector` or dedicated vector databases; verify maturity before adopting.

### Q132. Release model awareness
MySQL has **LTS** releases (8.4 is the first LTS under the new model) and **Innovation** releases (9.x) every quarter. Plan upgrades with support windows: 8.0 reached end of life in April 2026 for community support (verify exact dates in Oracle's support policy). Choose LTS for stability.

### Q133. Troubleshooting replication errors
Common: 1062 duplicate key on replica (writes on replica or diverged data), 1032 row not found (drift), 1236 missing binlog (purged before replica fetched; need re-clone), DDL conflicts. Approach: `SHOW REPLICA STATUS\G` → `Last_SQL_Error`; identify the GTID; fix data (`pt-table-checksum` and `pt-table-sync` for consistency checks); avoid blindly skipping (`SET GLOBAL sql_replica_skip_counter` or empty GTID transaction injection) because it hides drift. Set replicas `super_read_only=ON`.

### Q134. Data consistency verification
`pt-table-checksum` runs checksum queries on the source and compares replica results via replication; `pt-table-sync` repairs differences. Schedule periodic checks on critical data. After failovers or crashes, verify before returning replicas to service.

### Q135. MySQL on Kubernetes and containers
Use operators (Percona Operator, MySQL Operator for Kubernetes, Vitess operator), persistent volumes with good IOPS, anti-affinity across nodes/zones, tuned `innodb_buffer_pool_size` within pod memory limits (leave headroom), graceful shutdown (`innodb_fast_shutdown`), backups to object storage, and careful readiness/liveness probes (do not kill a recovering instance).

### Q136. Capacity of `max_connections` and file limits
`open_files_limit`, `table_open_cache`, `table_definition_cache` matter with many tables/partitions (thousands of tables per tenant). Errors: "Too many open files", "Can't open file". Adjust systemd `LimitNOFILE` and MySQL variables together.

### Q137. Common performance anti-patterns
`SELECT *` with wide rows, `ORDER BY RAND()`, functions on indexed columns (`WHERE DATE(created_at) = ...`), leading wildcard `LIKE`, `OFFSET` pagination, N+1 queries, missing composite indexes, over-indexing, implicit type conversion (string vs int comparing disables index), huge `IN` lists, long transactions, large `GROUP_CONCAT`, application-level joins in loops.

### Q138. Implicit conversion trap
```sql
SELECT * FROM users WHERE phone = 9876543210;      -- phone is VARCHAR: converts every row to number, index unusable
SELECT * FROM users WHERE phone = '9876543210';    -- uses the index
```
Also mismatched collations/charsets in join columns prevent index use.

### Q139. Choosing between `INT UNSIGNED` and `BIGINT`
`INT UNSIGNED` max ~4.29 billion. High-write tables can exhaust it in a few years (auto_increment hits the max and inserts fail with duplicate key). Use `BIGINT UNSIGNED` for large/event tables. Changing later is a heavy `ALTER`. Monitor auto-increment usage.
```sql
SELECT table_name, auto_increment FROM information_schema.tables WHERE table_schema='shop' ORDER BY auto_increment DESC LIMIT 10;
```

### Q140. Writing production-grade MySQL access code
Use a connection pool with sane limits, prepared statements, explicit transactions with retries on 1213/1205/40001-like errors, timeouts (connect, read, query), idempotency, exponential backoff, read/write routing, structured logging of slow queries, and metrics for pool wait time.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do you decide MySQL vs PostgreSQL vs another store?
Match workload and team: MySQL fits simple OLTP, high read scale with replicas, mature managed offerings and Vitess for sharding; PostgreSQL fits complex queries, advanced types/extensions, strict correctness; NoSQL for specific scale/access patterns. Consider ecosystem (ORMs, tools), operations skills, cloud cost, and migration risk. Avoid switching without a measurable reason.

### Q142. HA/DR architecture for a critical MySQL service
Primary + synchronous/semi-sync standby in another AZ (or InnoDB Cluster with 3 nodes across AZs), MySQL Router/ProxySQL for routing, automated failover with fencing, PITR backups (XtraBackup/snapshots + binlogs) to another region, delayed replica for human-error recovery, cross-region replica for DR, runbooks and regular failover drills. Define RPO/RTO and test them with game days.

### Q143. Migrating to MySQL 8 / Aurora / sharded architecture (plan)
Inventory queries and dependencies, run compatibility checks, build a replica on the target version, validate with shadow/replay traffic (ProxySQL mirroring, `pt-upgrade`), compare results and latency, cut over with a short write freeze or via replication switchover, keep rollback replication back to the old cluster for some time, monitor intensively after cutover.

### Q144. Data governance and compliance
Classify PII, encrypt at rest and in transit, field-level encryption for secrets, audit access, retention and erasure workflows (GDPR "right to be forgotten" across backups and replicas), masked non-prod copies, least privilege and periodic access reviews, documented backup retention.

### Q145. Cost optimization
Right-size instances and storage IOPS, remove unused indexes and tables, compress/archive cold data, use read replicas only where needed, cache hot reads, schedule heavy jobs off-peak, use reserved instances/savings plans, monitor cross-AZ/region data transfer, consolidate small databases carefully.

### Q146. Platform standards for many MySQL services
Golden configuration templates per instance size, automated provisioning (Terraform/Ansible/operators), standard monitoring dashboards/alerts, backup policy as code, schema change pipeline (review, lint, staging test, gh-ost), naming conventions, mandatory PKs and `utf8mb4`, query review for hot paths, shared runbooks, and an on-call rotation with DBAs/SREs.

### Q147. Schema change governance
Every migration reviewed for: lock impact, algorithm (`INSTANT/INPLACE`), table size, replication lag impact, backward/forward compatibility with deployed code, rollback plan, and staging test on production-size data. CI runs a linter (Skeema, SchemaHero, gh-ost dry-run, `pt-online-schema-change --dry-run`).

### Q148. Handling a major incident (example: replication lag + primary overload)
Mitigate: shed load (disable non-critical jobs, rate limit), kill runaway queries, route reads to primary temporarily if replicas are stale (or vice versa), increase capacity if cloud-managed. Diagnose: top queries, lock waits, I/O saturation, a recent deploy or schema change. Fix root cause (index, query, batch size). Prevent: load tests, canary deploys, guardrails (`max_execution_time`), alerts for lag and `Threads_running`.

### Q149. Mentoring: the MySQL skill ladder
Junior: SQL, indexes, `EXPLAIN` basics, transactions. Mid: InnoDB behavior, locking, replication, online DDL. Senior: capacity, HA design, performance triage under pressure, upgrade planning. Teach with real slow-query case studies and "break it in a lab" exercises (deadlocks, replication lag, failover).

### Q150. Evaluating managed services vs self-managed
Managed: faster setup, backups/HA built in, patching handled, less control (no `SUPER`, limited plugins/parameters), higher unit cost, cloud lock-in. Self-managed: full control, custom plugins/tuning, lower cost at scale, higher operational burden (HA, backups, upgrades, security). Evaluate team size and maturity, compliance, and workload predictability.

### Q151. Using MySQL with ORMs in large organizations
Standardize on one or two ORMs, ban unreviewed N+1 patterns (query count assertions in tests), keep raw SQL for hot paths, generate migrations through a single pipeline, enforce naming and PK/FK rules, and provide shared libraries for pooling, retries and observability.

### Q152. MySQL and event-driven architecture
Use the outbox pattern with binlog CDC (Debezium → Kafka), idempotent consumers, schema registry, and explicit contract versioning. MySQL stays the source of truth; downstream systems (search, caches, analytics) are projections.

### Q153. When to leave MySQL for a particular workload
Time-series at huge scale (TimescaleDB/ClickHouse), full-text/ranking (Elasticsearch), graph traversals (Neo4j), global multi-region writes (Spanner/CockroachDB/Cassandra), huge analytic scans (columnar warehouses), vector search at scale (specialized stores). Keep MySQL for transactional core data.

### Q154. Staying current
Follow MySQL release notes and the MySQL Server Team blog, Percona and PlanetScale engineering blogs, conference talks (Percona Live, MySQL Summit), read bug reports for versions you run, subscribe to security advisories (Oracle Critical Patch Updates quarterly), and test upgrades early.

### Q155. Interview approach for MySQL design questions
Clarify access patterns and scale; propose schema with PKs, indexes and constraints; discuss transactions and isolation choices; explain scaling path (indexes → replicas → partitioning → sharding), HA/backup plan, and monitoring; mention trade-offs and what you would measure first.

---

# 💻 Part 6: Hands-On Tasks & Queries

### H1. Create a database, user and least-privilege grants for an app
```sql
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'shop_app'@'10.0.%' IDENTIFIED BY 'ChangeMe!123' REQUIRE SSL;
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'shop_app'@'10.0.%';
CREATE USER 'shop_ro'@'%' IDENTIFIED BY 'ChangeMe!456';
GRANT SELECT ON shop.* TO 'shop_ro'@'%';
FLUSH PRIVILEGES;        -- not needed after CREATE USER/GRANT, only after editing grant tables directly
```

### H2. Find the slowest queries from `performance_schema`
```sql
SELECT DIGEST_TEXT, COUNT_STAR AS calls,
       ROUND(SUM_TIMER_WAIT/1e12, 2) AS total_s,
       ROUND(AVG_TIMER_WAIT/1e9, 2)  AS avg_ms,
       SUM_ROWS_EXAMINED, SUM_ROWS_SENT
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;
```
Large `ROWS_EXAMINED / ROWS_SENT` ratio signals missing indexes.

### H3. Find blocking transactions
```sql
SELECT * FROM sys.innodb_lock_waits\G
SELECT trx_id, trx_state, trx_started, trx_mysql_thread_id, trx_query
FROM information_schema.innodb_trx ORDER BY trx_started;
KILL 1234;      -- thread id from trx_mysql_thread_id (after confirming it is safe)
```

### H4. List the biggest tables and indexes
```sql
SELECT table_name,
       ROUND(data_length/1024/1024) AS data_mb,
       ROUND(index_length/1024/1024) AS index_mb,
       table_rows
FROM information_schema.tables
WHERE table_schema = 'shop'
ORDER BY data_length + index_length DESC LIMIT 10;
```

### H5. Find unused and duplicate indexes
```sql
SELECT * FROM sys.schema_unused_indexes WHERE object_schema='shop';
SELECT * FROM sys.schema_redundant_indexes WHERE table_schema='shop'\G
```
Unused data resets on restart; observe over a full business cycle first. Use invisible indexes before dropping.

### H6. Optimize a slow query (worked example)
Slow:
```sql
SELECT * FROM orders WHERE YEAR(order_date) = 2025 AND status = 'paid' ORDER BY amount DESC LIMIT 20;
```
Problems: function on column, `SELECT *`, no matching index. Fix:
```sql
ALTER TABLE orders ADD INDEX idx_status_date_amt (status, order_date, amount);
SELECT order_id, customer_id, amount, order_date
FROM orders
WHERE status = 'paid' AND order_date >= '2025-01-01' AND order_date < '2026-01-01'
ORDER BY amount DESC LIMIT 20;
```
If the sort still requires a filesort over many rows, consider an index `(status, amount)` plus the date filter, or a summary approach. Verify with `EXPLAIN ANALYZE`.

### H7. Safe batch delete script (bash + mysql)
```bash
#!/usr/bin/env bash
set -euo pipefail
while true; do
  rows=$(mysql -N -e "DELETE FROM shop.events WHERE created_at < NOW() - INTERVAL 90 DAY LIMIT 5000; SELECT ROW_COUNT();")
  echo "deleted $rows"
  [[ "$rows" -eq 0 ]] && break
  sleep 0.5
done
```
Monitor replica lag; stop or slow down if lag grows.

### H8. Set up a replica (GTID, MySQL 8)
On source `my.cnf`: `server-id=1`, `log_bin=binlog`, `gtid_mode=ON`, `enforce_gtid_consistency=ON`. On replica: `server-id=2`, `relay_log=relay`, `read_only=ON`, `super_read_only=ON`, `gtid_mode=ON`, `enforce_gtid_consistency=ON`.
```sql
-- source
CREATE USER 'repl'@'10.0.%' IDENTIFIED BY '***' REQUIRE SSL;
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'10.0.%';
-- take a consistent copy (xtrabackup or clone), restore on replica, then:
CHANGE REPLICATION SOURCE TO SOURCE_HOST='10.0.0.1', SOURCE_USER='repl', SOURCE_PASSWORD='***',
  SOURCE_AUTO_POSITION=1, SOURCE_SSL=1;
START REPLICA;
SHOW REPLICA STATUS\G
```

### H9. Take a consistent logical backup and restore
```bash
mysqldump --single-transaction --quick --routines --triggers --events --set-gtid-purged=OFF \
  -u backup -p shop | gzip > shop_$(date +%F).sql.gz
gunzip -c shop_2025-10-24.sql.gz | mysql -u root -p shop_restore
```
For big data use MySQL Shell: `util.dumpSchemas(['shop'], '/backups/shop')` and `util.loadDump('/backups/shop')`.

### H10. Convert a table to utf8mb4 safely
```sql
SELECT table_name, table_collation FROM information_schema.tables WHERE table_schema='shop';
ALTER TABLE customers CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```
Check index key lengths (utf8mb4 needs 4 bytes/char), foreign key collation consistency, and test on a copy first. It rebuilds the table.

### H11. Implement a reliable job queue with `SKIP LOCKED`
```sql
CREATE TABLE jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payload JSON NOT NULL,
  status ENUM('pending','running','done','failed') NOT NULL DEFAULT 'pending',
  locked_at DATETIME NULL, attempts INT NOT NULL DEFAULT 0,
  KEY idx_status_id (status, id)
) ENGINE=InnoDB;

START TRANSACTION;
SELECT id, payload FROM jobs WHERE status='pending' ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED;
UPDATE jobs SET status='running', locked_at=NOW(), attempts=attempts+1 WHERE id IN (/* ids */);
COMMIT;
-- worker finishes: UPDATE jobs SET status='done' WHERE id = ?;
-- reaper: UPDATE jobs SET status='pending' WHERE status='running' AND locked_at < NOW() - INTERVAL 10 MINUTE;
```

### H12. Upsert counter safely
```sql
INSERT INTO page_views (page_id, views) VALUES (42, 1)
ON DUPLICATE KEY UPDATE views = views + 1;
```
For very hot counters, shard (`page_id, slot`) and sum, or use Redis with periodic flush.

### H13. Create a partitioned log table with rolling partitions
See Q91. Add monthly partitions with a scheduled job (`ALTER TABLE logs REORGANIZE PARTITION pmax INTO (PARTITION p2025_03 VALUES LESS THAN ('2025-04-01'), PARTITION pmax VALUES LESS THAN (MAXVALUE));`) and drop old ones.

### H14. Recover from an accidental `DELETE` using binlogs
```bash
mysqlbinlog --base64-output=decode-rows -vv --start-datetime="2025-10-24 10:00:00" \
  --stop-datetime="2025-10-24 10:20:00" /var/lib/mysql/binlog.000045 | less
```
Find the transaction (GTID or position), restore a backup to a side server, replay to just before the mistake, export the lost rows and re-insert them into production. (Tools like `binlog2sql`/`flashback` can generate reverse SQL for ROW format.) A **delayed replica** makes this much easier.

### H15. Check replication health quickly
```sql
SHOW REPLICA STATUS\G
-- Look at: Replica_IO_Running=Yes, Replica_SQL_Running=Yes, Seconds_Behind_Source, Last_IO_Error, Last_SQL_Error, Retrieved_Gtid_Set vs Executed_Gtid_Set
SELECT * FROM performance_schema.replication_applier_status_by_worker\G
```

### H16. Docker quick start for practice
```bash
docker run -d --name mysql8 -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=shop -p 3306:3306 \
  -v mysql_data:/var/lib/mysql mysql:8.4
docker exec -it mysql8 mysql -uroot -prootpass shop
```

### H17. Sample `my.cnf` baseline for a 16 GB dedicated OLTP server (starting point, then measure)
```ini
[mysqld]
server-id = 1
character-set-server = utf8mb4
collation-server = utf8mb4_0900_ai_ci
sql_mode = ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
max_connections = 300
innodb_buffer_pool_size = 10G
innodb_redo_log_capacity = 4G
innodb_flush_log_at_trx_commit = 1
sync_binlog = 1
innodb_flush_method = O_DIRECT
innodb_io_capacity = 2000
log_bin = binlog
binlog_format = ROW
binlog_expire_logs_seconds = 604800
gtid_mode = ON
enforce_gtid_consistency = ON
slow_query_log = ON
long_query_time = 0.5
performance_schema = ON
skip_name_resolve = ON
```
`skip_name_resolve` avoids DNS lookups for clients (use IPs in grants).

---

# 🐞 Part 7: Debugging Scenarios

### D1. `ERROR 1040: Too many connections`
Check `Threads_connected`, `Max_used_connections`, `SHOW PROCESSLIST` (who, from which host). Causes: pool leaks, too many app replicas × pool size, slow queries holding connections. Fixes: cap pools, add ProxySQL/pooler, fix leaks and slow queries, temporarily `SET GLOBAL max_connections` (note that MySQL keeps one extra connection for `SUPER`/`CONNECTION_ADMIN`).

### D2. `ERROR 1205: Lock wait timeout exceeded`
Another transaction holds a lock. Find it with `sys.innodb_lock_waits`. Often an idle transaction left open or a long batch. Fix transaction scope; add indexes so fewer rows are locked; batch big updates.

### D3. `ERROR 1213: Deadlock found`
Retry the transaction (expected occasionally). Investigate the pair of statements in `SHOW ENGINE INNODB STATUS`. Common fixes: consistent ordering, index the `WHERE` columns, avoid mixing gap-locking scans with inserts, consider READ COMMITTED.

### D4. Query is slow only after a deploy
Compare `EXPLAIN` before/after, check for a changed ORM query shape (missing `LIMIT`, `OR` conditions, implicit type conversion), missing index in the new release's migration, statistics not updated, parameter value skew. Roll back or hotfix index.

### D5. `Illegal mix of collations`
Join/compare between columns with different collations. Align with `ALTER TABLE ... CONVERT TO` or add `COLLATE` to the comparison; ensure `character_set_client/connection/results` are consistent (`SET NAMES utf8mb4`).

### D6. Emoji turned into `????` or insert fails with "Incorrect string value"
Column/table/connection is `utf8mb3` or `latin1`. Convert to `utf8mb4`, set connection charset (`charset=utf8mb4` in driver URL), and re-test.

### D7. `Data truncated for column` / values silently changed
Strict mode off or violated. Enable `STRICT_TRANS_TABLES`; fix data length/type; check ENUM values and numeric ranges; look at `SHOW WARNINGS`.

### D8. Replica shows `Seconds_Behind_Source` growing
Look for a single huge transaction, missing primary key on a big table (row-based apply does full scans), heavy reads on replica, slow disk, single-thread apply. Enable parallel workers, add PKs, throttle batch jobs, upgrade replica hardware.

### D9. Replication broke: `Error 1062 Duplicate entry` on replica
Writes happened on the replica or data drifted. Compare with `pt-table-checksum`, fix data, set `super_read_only=ON` on replicas. If necessary re-clone the replica. Don't just skip.

### D10. `ERROR 1236: Could not find first log file name in binary log index file`
The replica needs binlogs already purged on the source. Re-seed the replica from a fresh backup/clone and extend binlog retention.

### D11. Disk full on MySQL server
Common culprits: binlogs (retention too long), slow/general logs, undo growth from a long transaction, temp tables, large `ibtmp1`, backups stored locally, runaway table growth. Free space safely: `PURGE BINARY LOGS BEFORE NOW() - INTERVAL 3 DAY;` (confirm replicas have read them), fix the cause, add monitoring/alerts at 80%.

### D12. Server crashes with OOM killer
Memory estimate exceeded RAM: oversized `innodb_buffer_pool_size`, huge per-connection buffers × many connections, big temp tables, other processes. Check `dmesg`, `SHOW ENGINE INNODB STATUS` memory section, `sys.memory_global_by_current_bytes`. Reduce buffer sizes, add swap carefully, set cgroup limits, fix leaks.

### D13. `Table definition has changed, please retry transaction`
DDL happened while a transaction was reading the table (metadata change). Retry; schedule DDL off-peak; use online DDL tools.

### D14. `ERROR 1062 Duplicate entry '2147483647' for key 'PRIMARY'`
An `INT` auto-increment reached its max. Migrate the column to `BIGINT UNSIGNED` (online with gh-ost/pt-osc); monitor auto-increment headroom going forward.

### D15. Application gets "MySQL server has gone away" (2006)
Connection idle longer than `wait_timeout`, server restart, packet larger than `max_allowed_packet`, killed connection, or network/proxy idle timeout. Fixes: pool validation (`SELECT 1`) and max lifetime below `wait_timeout`, increase `max_allowed_packet` for large rows, retry on reconnect.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `utf8mb4` mean every character takes 4 bytes?
No. It is variable length: 1 byte for ASCII, up to 4 bytes for some characters. But MySQL may reserve the maximum for in-memory temp tables and index length calculations.

### T2. Is `TIMESTAMP` or `DATETIME` timezone-aware?
`TIMESTAMP` is stored as UTC and converted using the session time zone on read/write. `DATETIME` stores the literal value with no conversion. Neither stores the original zone name.

### T3. Can you roll back a `DROP TABLE`?
No. DDL in MySQL commits implicitly. (MySQL 8.0 makes DDL **atomic** so it either fully succeeds or fully rolls back internally, but you cannot roll back a completed DDL statement.)

### T4. Does `COUNT(*)` use an index?
InnoDB scans the smallest available index to count rows. Without a `WHERE` it's still O(n). MyISAM stored an exact count (instant), InnoDB doesn't.

### T5. What happens if you insert a row with an explicit `AUTO_INCREMENT` value larger than current?
The counter jumps to value + 1 for subsequent inserts. Inserting a smaller unused value does not move the counter.

### T6. Why can a `SELECT` in REPEATABLE READ still see changes made by itself?
A transaction sees its own changes. Also, locking reads and DML use the latest committed data, not the snapshot, which can surprise people ("my SELECT does not see the row but my UPDATE changes it").

### T7. Does an index on `(a, b)` make an index on `(a)` redundant?
Yes for lookups on `a` (leftmost prefix), except unique/foreign key semantics or covering needs. `sys.schema_redundant_indexes` flags these.

### T8. Why is `SELECT ... FOR UPDATE` without an index so dangerous?
It scans the clustered index and locks every row it examines (and gaps under REPEATABLE READ), effectively blocking writes to the whole table.

### T9. Is `LIMIT 1` always cheap?
Only if the engine can stop early (index order matches `ORDER BY`). `ORDER BY unindexed_col LIMIT 1` must scan and sort or maintain a top-N heap over all matching rows.

### T10. What is the difference between `DELETE` and `TRUNCATE` for auto_increment?
`TRUNCATE` recreates the table and resets `AUTO_INCREMENT` to 1 (and it's DDL: implicit commit, no triggers, fails if referenced by FKs). `DELETE` keeps the counter.

### T11. Can two different tables use different storage engines in one transaction?
Yes, but only InnoDB tables participate in transaction rollback. Mixing with MyISAM leaves non-transactional changes applied after a rollback. This also breaks GTID consistency.

### T12. What does `ON DELETE CASCADE` do to replication and locks?
The cascade runs inside the storage engine and is replicated as row events for the child deletes in ROW format (parent delete + cascaded effects), locking child rows. Large cascades can create huge transactions and replica lag.

### T13. Why can `ALTER TABLE ... ADD COLUMN` hang the entire application?
It waits for an exclusive metadata lock behind a long transaction; all new queries on the table then queue behind the waiting ALTER (a metadata lock convoy). Mitigate with `lock_wait_timeout`, check for long transactions first, use online tools.

### T14. Is `INSERT ... SELECT` safe on a busy table?
It reads from the source table with locks depending on isolation level (under REPEATABLE READ with statement-based replication it takes shared next-key locks on the source rows); use READ COMMITTED + ROW binlog or batch it.

### T15. Why does a query using `LIKE 'abc%'` sometimes not use the index?
Collation or charset mismatch (e.g. comparing a `utf8mb4` column to a `latin1` literal/variable), a function wrapper, or the optimizer estimates a scan is cheaper because the prefix matches too many rows.

### T16. What is `ONLY_FULL_GROUP_BY` protecting against?
Nondeterministic results: selecting columns that are not in `GROUP BY` or functionally dependent on it would return an arbitrary row's value. Use `ANY_VALUE()` only when you truly don't care.

### T17. Does `SHOW PROCESSLIST` show every query?
It shows current threads; use `performance_schema.threads` / `events_statements_current` for more detail (and `FULL` to avoid truncated text). Short queries may complete between samples.

### T18. Why do identical queries have different speeds on primary vs replica?
Different buffer pool contents (cold cache), different load, different statistics or index sets, replication apply contention, hardware differences. Compare `EXPLAIN` and warm the cache.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Default storage engine?** InnoDB.
- **Default isolation level?** REPEATABLE READ.
- **Default port?** 3306. **X Protocol port?** 33060.
- **Default charset in 8.0?** `utf8mb4`.
- **`utf8` alias in MySQL?** `utf8mb3` (3 bytes).
- **Exact numeric type?** `DECIMAL`.
- **UTC-stored, 2038-limited type?** `TIMESTAMP`.
- **FULL OUTER JOIN?** Not supported; emulate with `UNION`.
- **Upsert syntax?** `INSERT ... ON DUPLICATE KEY UPDATE`.
- **Replace behavior?** Delete + insert.
- **Find slow queries?** Slow query log, `performance_schema`, `sys`.
- **Explain with actual timings?** `EXPLAIN ANALYZE` (8.0.18+).
- **Covering index shows?** `Using index`.
- **Bad EXPLAIN type?** `ALL`.
- **Clustered index is?** The primary key.
- **Secondary index leaf stores?** Indexed columns + primary key.
- **Redo log purpose?** Crash recovery.
- **Undo log purpose?** Rollback + MVCC.
- **Binlog purpose?** Replication, PITR, CDC.
- **Safest binlog format?** `ROW`.
- **Replication threads?** I/O thread and SQL (applier) thread.
- **GTID benefit?** Easy failover/auto-positioning.
- **HA solution from Oracle?** InnoDB Cluster (Group Replication + Router + Shell).
- **Online DDL algorithms?** `INSTANT`, `INPLACE`, `COPY`.
- **Online schema change tools?** gh-ost, pt-online-schema-change.
- **Physical hot backup tool?** Percona XtraBackup.
- **Consistent mysqldump flag?** `--single-transaction`.
- **Queue pattern?** `FOR UPDATE SKIP LOCKED`.
- **Case sensitivity of table names on Linux?** Case-sensitive.
- **Reserve connection for admin?** `SUPER`/`CONNECTION_ADMIN`.
- **Persist a global variable?** `SET PERSIST`.
- **Avoid injection?** Prepared statements.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a MySQL performance problem you solved.
STAR: "Checkout latency jumped at peak. `performance_schema` digests showed one query examining 2M rows per call. It filtered `status` and sorted by `created_at`, but only had a single-column index on `status`. I added a composite index `(status, created_at)`, rewrote an `OFFSET` pagination to keyset, and verified with `EXPLAIN ANALYZE`. p95 fell from 2.4 s to 90 ms; I added the digest to a dashboard and an alert on rows-examined ratio."

### P2. Describe a production incident involving replication or backups.
Example: replica lag from a 40-minute batch update; reads were stale. We throttled the batch (5k-row chunks with sleep), enabled parallel replication, and moved critical reads to the primary temporarily. Prevented recurrence with batch standards and lag alerts. For backups: a restore test discovered missing binlogs, so we fixed retention and automated monthly restore drills.

### P3. How do you do zero-downtime schema changes?
Expand/contract approach with `INSTANT/INPLACE` where possible, gh-ost for heavy changes, backfills in batches with lag checks, feature flags in the application, and a tested rollback.

### P4. How do you decide on indexes?
Start from real queries (slow log/digests), consider filter + join + sort patterns, build composite indexes in the right order, verify with `EXPLAIN`, test write overhead, and review unused indexes quarterly with invisible-index trials.

### P5. How do you handle a developer asking for a risky `ALTER`?
Review table size and traffic, run the change on a clone for timing, pick algorithm/tool, schedule off-peak, set lock timeouts, monitor lag and locks, communicate, and keep a rollback plan.

### P6. How do you make MySQL highly available?
Multi-AZ replicas with automated failover (InnoDB Cluster or managed Multi-AZ), router/proxy layer, semi-sync or Group Replication for lower data-loss risk, PITR backups, regular failover drills, monitoring and runbooks.

### P7. What do you check first when MySQL is "slow"?
Whether it is the database at all (`Threads_running`, CPU, I/O, locks), then top queries and waits, then the plan of the worst offender, before touching configuration.

### P8. How do you keep data safe?
Backups (full + binlog), restore tests, replicas (including delayed), constraints and transactions, least-privilege access, encryption, change management for schema, and monitoring of integrity (checksums).

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Basics:** installation, clients, databases/tables, data types, constraints, CRUD, SQL modes, charsets/collations, time zones.
- **Architecture:** connection/SQL/storage layers, storage engines, InnoDB (buffer pool, redo, undo, doublewrite, change buffer, AHI, tablespaces, row formats), binary log.
- **Indexing and queries:** B-tree, covering, composite, prefix, functional, invisible, full-text, spatial, JSON/multi-valued indexes, histograms, optimizer hints, `EXPLAIN`/`EXPLAIN ANALYZE`, optimizer switches, join algorithms.
- **Transactions and concurrency:** ACID, isolation levels, MVCC, record/gap/next-key locks, deadlocks, metadata locks, `SKIP LOCKED`, advisory locks (`GET_LOCK`).
- **Programmability:** views, procedures, functions, triggers, events, prepared statements, CTEs, window functions, JSON functions.
- **Operations:** configuration, monitoring, `performance_schema`, `sys`, slow log, backups (logical/physical/clone), PITR, upgrades, online DDL, partitioning, archiving.
- **Scaling and HA:** replication (async/semi-sync/GTID/multi-source/delayed), Group Replication, InnoDB Cluster/ClusterSet, Router/ProxySQL, sharding (Vitess), cloud (RDS/Aurora/Cloud SQL), Galera.
- **Security:** authentication plugins, roles, TLS, encryption at rest, auditing, hardening.
- **Ecosystem:** Percona Toolkit, XtraBackup, gh-ost, Debezium, ORMs, MySQL Shell, Workbench.

## Mixed topics
- MySQL + Node/Java/Python: connection pooling (`mysql2`, HikariCP, SQLAlchemy), prepared statements, transactions, retry on deadlock, timeouts, pagination.
- MySQL + Docker/Kubernetes: volumes, operators, resource limits, backup jobs.
- MySQL + Redis/Elasticsearch/Kafka: cache-aside, search indexing via CDC, outbox pattern.
- MySQL + DevOps: Terraform for RDS/Aurora, CI migration checks (Flyway/Liquibase/Skeema), monitoring with Prometheus/PMM.
- MySQL + security/compliance: PII encryption, audit trails, retention, data masking.
- MySQL + analytics: replicas for reporting, HeatWave, ETL/ELT to warehouses.

---

# 🔬 Part 12: MySQL Internals

### I1. Directory layout
`/var/lib/mysql/`: `ibdata1` (system tablespace; data dictionary lives in `mysql.ibd` in 8.0), `<db>/<table>.ibd` (file-per-table tablespaces), `undo_001/002`, `#innodb_redo/` (redo files in 8.0.30+), `binlog.000001...`, `mysql-bin.index`, `auto.cnf` (server UUID), error log, `ib_buffer_pool`. 8.0's transactional data dictionary replaced `.frm` files.

### I2. InnoDB page structure
A 16 KB page contains a header, records in a singly linked list ordered by key with a page directory (sparse slots enabling binary search), free space, and a trailer with checksum. Index pages have levels (leaf = 0). Splits create new pages when full.

### I3. How a write happens
1. Row change applied in the buffer pool page (page loaded if needed).
2. Undo record written (old version).
3. Redo record written to the log buffer.
4. At commit: redo flushed (policy-controlled); binlog written and flushed (two-phase commit); commit marked.
5. Dirty pages flushed later by background threads and checkpoints.

### I4. Crash recovery
On startup InnoDB scans redo from the last checkpoint, replays changes to pages (using doublewrite copies to fix torn pages), then rolls back uncommitted transactions using undo. If binlog and InnoDB disagree about prepared transactions, the binlog decides during recovery (commit if in binlog, else roll back).

### I5. Optimizer architecture
Parse tree → resolution → logical transformations (constant folding, subquery to semijoin, derived merge, outer-to-inner join conversion) → cost-based access path and join-order search (greedy + dynamic programming with `optimizer_search_depth`) → iterator-based executor (8.0.16+ unified iterator model). Costs come from the cost model tables (`mysql.server_cost`, `mysql.engine_cost`) and index statistics.

### I6. Adaptive concurrency features
InnoDB limits concurrent threads inside the engine with `innodb_thread_concurrency` (0 = unlimited by default), uses spin/mutex/rw-lock implementations, background threads for purge, page cleaner, master thread, and log writer/flusher threads (redesigned in 8.0 for scalability).

### I7. Table and metadata caches
`table_open_cache` (open table handles), `table_definition_cache` (cached definitions), `innodb_open_files`, and the dictionary cache. Too small causes opens/closes churn (`Opened_tables` rising); too large uses memory.

### I8. Query cache (removed)
MySQL 5.7 had a query cache with global mutex contention and invalidation per table write; it was deprecated and removed in 8.0. Use application caching (Redis/memcached) and the buffer pool instead. Mentioning this shows version awareness.

### I9. Statement digests and the Performance Schema
Every statement is normalized (literals replaced by `?`) and hashed into a digest; the summary table aggregates counts, latencies, rows examined, temp tables, sort info. This is the basis of `sys.statement_analysis` and modern query analysis.

### I10. Clone plugin and Instant ADD COLUMN internals
Clone copies pages and redo from donor to recipient at the storage layer (physical snapshot). `INSTANT ADD COLUMN` records the new column in the data dictionary with a default; existing rows are lazily interpreted with the default, with a limit on the number of instant row versions (64) before a rebuild.

---

# 📊 Part 13: Reference Tables

### Storage engines
| Engine | Transactions | Locking | FKs | Crash-safe | Use |
|---|---|---|---|---|---|
| InnoDB | yes | row | yes | yes | default |
| MyISAM | no | table | no | no | legacy |
| MEMORY | no | table | no | no (volatile) | temp/lookup |
| ARCHIVE | no | row (insert only) | no | partial | logs |
| NDB | yes | row | limited | yes | cluster |

### Isolation levels in InnoDB
| Level | Snapshot | Gap locks | Notes |
|---|---|---|---|
| READ UNCOMMITTED | none | few | dirty reads possible |
| READ COMMITTED | per statement | mostly none | common for OLTP |
| REPEATABLE READ | per transaction | yes (next-key) | default |
| SERIALIZABLE | converts plain SELECT to `FOR SHARE` | yes | lowest concurrency |

### `EXPLAIN` access types
| type | Meaning |
|---|---|
| system/const | at most one row via PK/unique |
| eq_ref | one row per previous-table row via PK/unique |
| ref | non-unique index equality |
| range | index range scan |
| index | full index scan |
| ALL | full table scan |

### Important variables
| Variable | Purpose |
|---|---|
| `innodb_buffer_pool_size` | main memory cache |
| `innodb_redo_log_capacity` | redo size (8.0.30+) |
| `innodb_flush_log_at_trx_commit` | durability vs speed |
| `sync_binlog` | binlog fsync policy |
| `max_connections` | connection limit |
| `innodb_lock_wait_timeout` | row lock wait time |
| `long_query_time` | slow log threshold |
| `binlog_format` | statement/row/mixed |
| `sql_mode` | strictness |
| `transaction_isolation` | isolation level |
| `max_allowed_packet` | max packet/row blob |

### Data type sizes
| Type | Bytes | Range (signed) |
|---|---|---|
| TINYINT | 1 | -128 to 127 |
| SMALLINT | 2 | ±32,767 |
| MEDIUMINT | 3 | ±8,388,607 |
| INT | 4 | ±2.147 billion |
| BIGINT | 8 | ±9.22e18 |

### Replication setups
| Mode | Durability | Latency | Notes |
|---|---|---|---|
| Async | may lose last commits | lowest | default |
| Semi-sync | ack from ≥1 replica | + RTT | lossless mode available |
| Group Replication | consensus | + RTT | auto failover |
| Galera (PXC/MariaDB) | synchronous certification | + RTT | multi-primary |

### Backup tool comparison
| Tool | Type | Speed | Notes |
|---|---|---|---|
| mysqldump | logical | slow | portable, `--single-transaction` |
| mydumper / MySQL Shell dump | logical parallel | medium | good for large schemas |
| XtraBackup / MEB | physical | fast | hot backup, incrementals |
| Clone plugin | physical | fast | server to server |
| Snapshots | physical | very fast | require consistency handling |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```sql
SELECT 7 / 2, 7 DIV 2, 7 % 2, -7 DIV 2;
```
**Output:** `3.5000, 3, 1, -3`. `/` is decimal division; `DIV` truncates toward zero.

### O2.
```sql
SELECT NULL <=> NULL, NULL = NULL, 1 <=> 1;
```
**Output:** `1, NULL, 1`. `<=>` is NULL-safe equality.

### O3.
```sql
SELECT 'a' = 'A', 'a' = 'A' COLLATE utf8mb4_bin;
```
**Output (default `_ci` collation):** `1, 0`.

### O4.
```sql
SELECT '10abc' + 5, 'abc' + 5, '3' + '4';
```
**Output:** `15, 5, 7` with warnings for the first two (`Truncated incorrect DOUBLE value`). In strict mode these coercions inside `INSERT` can raise errors.

### O5.
```sql
SELECT IF(1 > 2, 'yes', 'no'), IFNULL(NULL, 'x'), COALESCE(NULL, NULL, 'z'), NULLIF(5, 5);
```
**Output:** `no, x, z, NULL`.

### O6.
Table `t(id INT AUTO_INCREMENT PRIMARY KEY, v INT)`.
```sql
INSERT INTO t (v) VALUES (1),(2),(3);
DELETE FROM t WHERE id = 3;
INSERT INTO t (v) VALUES (4);
SELECT id FROM t ORDER BY id;
```
**Output:** `1, 2, 4`. The counter does not reuse 3 (in MySQL 8.0 it persists even across restart).

### O7.
```sql
SELECT DATE_ADD('2025-01-31', INTERVAL 1 MONTH), LAST_DAY('2025-02-10'), DATEDIFF('2025-03-01', '2025-02-01');
```
**Output:** `2025-02-28, 2025-02-28, 28`.

### O8.
```sql
SELECT GROUP_CONCAT(x ORDER BY x SEPARATOR '-') FROM (SELECT 3 AS x UNION ALL SELECT 1 UNION ALL SELECT 2) t;
```
**Output:** `1-2-3`.

### O9.
Two sessions, REPEATABLE READ, table `acc(id=1, bal=100)`:
- A: `START TRANSACTION; SELECT bal FROM acc WHERE id=1;` → 100
- B: `UPDATE acc SET bal=150 WHERE id=1; COMMIT;`
- A: `SELECT bal FROM acc WHERE id=1;` → ?
- A: `SELECT bal FROM acc WHERE id=1 FOR UPDATE;` → ?
**Output:** second plain SELECT: `100` (snapshot); locking read: `150` (latest committed).

### O10.
```sql
CREATE TABLE u (id INT PRIMARY KEY, e VARCHAR(10) UNIQUE);
INSERT INTO u VALUES (1,NULL),(2,NULL);
SELECT COUNT(*) FROM u;
```
**Output:** `2`. A `UNIQUE` index allows multiple NULLs.

### O11.
```sql
SELECT CHAR_LENGTH('नमस्ते'), LENGTH('नमस्ते');
```
**Output (utf8mb4):** `6, 18`. Characters vs bytes.

### O12.
```sql
SELECT ROUND(2.5), ROUND(3.5), ROUND(2.5E0);
```
**Output:** `3, 4, 2`. Exact-value (DECIMAL) rounds half away from zero; approximate-value (float) follows the C library, typically banker's rounding (`2`).

---

# ✅ Part 15: MCQs

**1. Which is the default storage engine in MySQL 8?**
A) MyISAM  B) InnoDB  C) MEMORY  D) ARCHIVE
**Answer: B**

**2. InnoDB's default isolation level is:**
A) Read Uncommitted  B) Read Committed  C) Repeatable Read  D) Serializable
**Answer: C**

**3. Which data type stores values in UTC and ends in 2038?**
A) DATETIME  B) TIMESTAMP  C) DATE  D) YEAR
**Answer: B**

**4. Which statement is an upsert in MySQL?**
A) `MERGE`  B) `INSERT ... ON DUPLICATE KEY UPDATE`  C) `UPSERT INTO`  D) `ON CONFLICT`
**Answer: B**

**5. A secondary index in InnoDB stores:**
A) Row pointer to disk offset  B) The primary key value with the indexed columns  C) Only a hash  D) The whole row
**Answer: B**

**6. Which log is used for replication?**
A) Redo log  B) Undo log  C) Binary log  D) Error log
**Answer: C**

**7. `Using filesort` in EXPLAIN means:**
A) Data is sorted using a file always  B) An extra sort pass is needed (not necessarily on disk)  C) Index sort  D) Table is partitioned
**Answer: B**

**8. Which tool performs a hot physical backup?**
A) mysqldump  B) XtraBackup  C) mysqlcheck  D) mysqlslap
**Answer: B**

**9. Which `ALGORITHM` changes only metadata for some ADD COLUMN operations (8.0.12+)?**
A) COPY  B) INPLACE  C) INSTANT  D) SHARED
**Answer: C**

**10. Which feature lets workers skip rows locked by others?**
A) `NOWAIT`  B) `SKIP LOCKED`  C) `LOCK TABLES`  D) `GET_LOCK`
**Answer: B**

**11. What is `utf8` in MySQL?**
A) Full UTF-8  B) 3-byte subset (utf8mb3)  C) UTF-16  D) Latin1
**Answer: B**

**12. Which is NOT supported in MySQL?**
A) LEFT JOIN  B) FULL OUTER JOIN  C) CROSS JOIN  D) NATURAL JOIN
**Answer: B**

**13. The cause of "Too many connections" is usually:**
A) Too many tables  B) Reaching `max_connections`  C) Small buffer pool  D) Missing indexes
**Answer: B**

**14. Which setting gives full durability on commit?**
A) `innodb_flush_log_at_trx_commit=0`  B) `=1`  C) `=2`  D) `sync_binlog=0`
**Answer: B** (together with `sync_binlog=1` for the binlog)

**15. A long-running open transaction can cause:**
A) Faster purge  B) Undo growth and purge lag  C) Smaller binlogs  D) Auto index creation
**Answer: B**

**16. What does `EXPLAIN ANALYZE` do?**
A) Only shows estimated plan  B) Runs the query and shows actual timings and rows  C) Adds indexes  D) Updates statistics permanently
**Answer: B**

**17. The best primary key for InnoDB insert performance is usually:**
A) Random UUIDv4 as CHAR(36)  B) Sequential BIGINT  C) Email  D) Hash of row
**Answer: B**

**18. Which replication feature simplifies failover with auto-positioning?**
A) Binlog position  B) GTID  C) Relay log  D) Semi-sync
**Answer: B**

**19. Which view helps find unused indexes?**
A) `sys.schema_unused_indexes`  B) `information_schema.users`  C) `mysql.indexes`  D) `performance_schema.cache`
**Answer: A**

**20. The query cache in MySQL 8.0:**
A) Is enabled by default  B) Was removed  C) Is per-session only  D) Stores indexes
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Using `utf8` instead of `utf8mb4`.**
2. **Disabling strict `sql_mode`** to hide bad data problems.
3. **Using `INT` auto-increment for huge tables** and hitting the limit.
4. **Random UUID clustered primary keys** without considering fragmentation.
5. **`SELECT *`** and returning large `TEXT/BLOB` columns needlessly.
6. **Function calls on indexed columns** (`DATE(col)`, `LOWER(col)`) without functional indexes.
7. **`OFFSET` pagination for deep pages.**
8. **Long transactions and idle-in-transaction connections.**
9. **Running `ALTER TABLE` on huge tables without online tooling or lock timeouts.**
10. **Mixing collations** across tables/columns/joins.
11. **No primary key on a table** (replication and Group Replication problems).
12. **Over-indexing** write-heavy tables.
13. **Relying on `REPLACE` or `INSERT IGNORE` without understanding side effects.**
14. **Writing to replicas** (no `super_read_only`), causing drift.
15. **Not testing restores or PITR.**
16. **Binlog retention too short** (replica cannot catch up) or **too long** (disk full).
17. **Giant per-connection buffers** with high `max_connections`.
18. **Skipping replication errors** instead of fixing root cause.
19. **Using root for applications.**
20. **Ignoring time zone settings** across app, session and server.
21. **Assuming `COUNT(*)` is instant.**
22. **Copying configs from blogs** without measuring.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain InnoDB as a system: clustered index, buffer pool, redo/undo, MVCC, locks, and relate each to a practical symptom.
- You read `EXPLAIN`/`EXPLAIN ANALYZE`, `SHOW ENGINE INNODB STATUS`, `performance_schema` and `sys` fluently.
- You design primary keys and composite indexes deliberately (short, monotonic, leftmost-prefix aware, covering when useful).
- You run schema changes safely (`INSTANT/INPLACE`, gh-ost, expand/contract) and know metadata-lock pile-ups.
- You understand replication deeply: binlog formats, GTID, lag causes, semi-sync, Group Replication, failover, delayed replicas.
- You tune with evidence: durability trade-offs, buffer pool sizing, redo capacity, connection and temp-table behavior.
- You prevent incidents: timeouts, rate limits, idempotent retries, lag-aware batching, tested backups and PITR.
- You know version differences (5.7 vs 8.0 vs 8.4 LTS), deprecated features (query cache, `mysql_native_password`), and cloud variants (RDS, Aurora).
- You know when to use MySQL and when to offload to search/analytics/cache/other databases.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily commands
```sql
SHOW PROCESSLIST; SHOW ENGINE INNODB STATUS\G; SHOW REPLICA STATUS\G;
EXPLAIN ANALYZE SELECT ...; SHOW CREATE TABLE t\G; SHOW INDEX FROM t;
SELECT * FROM sys.innodb_lock_waits; SELECT * FROM sys.statement_analysis LIMIT 10;
SET PERSIST var = value; SELECT @@version, @@sql_mode, @@transaction_isolation;
```

### Index rules
Equality columns first → range → sort/group; leftmost prefix; avoid functions on columns; keep PK short and sequential; use covering indexes for hot reads; check with `EXPLAIN` (`type`, `key`, `rows`, `Extra`).

### Durability / performance quick table
| Goal | Setting |
|---|---|
| Full durability | `innodb_flush_log_at_trx_commit=1`, `sync_binlog=1` |
| Faster writes (accept ~1s loss) | `innodb_flush_log_at_trx_commit=2` |
| Large cache | `innodb_buffer_pool_size` ≈ 60–75% RAM |
| Avoid double buffering | `innodb_flush_method=O_DIRECT` |
| Safer SQL | `STRICT_TRANS_TABLES`, `ONLY_FULL_GROUP_BY` |

### Incident triage order
1. Is `Threads_running` / CPU / I/O saturated? 2. Which queries (digests/slow log)? 3. Locks or long transactions? 4. Replication lag or failover state? 5. Disk, memory, connections. 6. Fix the cause (index/query/batch), then tune.

### Replication checklist
`log_bin`, `server_id`, `binlog_format=ROW`, GTID on, replica `super_read_only`, PKs on all tables, monitor lag, test failover, retain binlogs, checksum periodically.

### Interview strategy
1. Define the concept in one sentence and name the MySQL/InnoDB mechanism behind it.
2. Show the SQL/config and what `EXPLAIN` or status output would reveal.
3. Mention trade-offs (durability vs speed, consistency vs lag).
4. Add version-specific notes (5.7 vs 8.0 vs 8.4).
5. Close with a real incident or optimization from your experience.

### Final checklist before the interview
- [ ] Explain InnoDB architecture: clustered index, buffer pool, redo/undo/binlog, doublewrite, MVCC.
- [ ] Explain isolation levels, gap/next-key locks, deadlocks, metadata locks.
- [ ] Design indexes and read `EXPLAIN`/`EXPLAIN ANALYZE`; fix a slow query live.
- [ ] Describe replication (async, semi-sync, GTID, Group Replication), lag fixes and failover steps.
- [ ] Describe backup and PITR strategy; online schema change approach.
- [ ] Know `utf8mb4`, `sql_mode`, `DATETIME` vs `TIMESTAMP`, `INSERT ... ON DUPLICATE KEY UPDATE`.
- [ ] Prepare a performance story and an incident story with root cause and prevention.

