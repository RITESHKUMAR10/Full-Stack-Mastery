# Data Engineering Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, SQL (ANSI + PostgreSQL / Spark SQL / BigQuery / Snowflake dialects), Apache Spark 3.5 / 4.0, Apache Kafka 3.x / 4.0 (KRaft), Apache Flink 1.18+/2.0, Apache Airflow 2.x / 3.x, Dagster, dbt Core 1.8+, Delta Lake 3.x, Apache Iceberg 1.5+, Apache Hudi, Parquet / ORC / Avro, Trino, DuckDB, Polars, Great Expectations, OpenLineage**, plus cloud platforms (AWS Glue / EMR / Redshift / Kinesis, GCP BigQuery / Dataflow / Pub/Sub, Azure Synapse / Data Factory / Fabric, Databricks, Snowflake). Product names, features, defaults and pricing change quickly: anything marked "verify" should be checked in the official docs. Examples use the sample name **Ritesh Kumar** and small orders / events / customers style data.
> This file covers the data engineer's role, data modelling (OLTP vs OLAP, normalisation, star / snowflake schemas, Data Vault, SCDs), SQL for analytics (joins, window functions, CTEs, optimisation), file formats (Parquet / ORC / Avro / JSON / CSV), ETL vs ELT, batch processing with Spark (RDD / DataFrame, partitioning, shuffles, skew, caching, AQE), streaming (Kafka, Flink, Spark Structured Streaming, windows, watermarks, exactly-once), orchestration (Airflow, Dagster), data lakes / warehouses / lakehouses (Delta, Iceberg, Hudi), dbt and the modern data stack, CDC, data quality and contracts, lineage and catalogues, governance and security, performance and cost optimisation, feature pipelines for ML, and system design for data platforms. Related topics: pandas / NumPy in `055_Pandas-and-NumPy.md`, MLOps in `074_MLOps.md`, SQL in `../04_Database/026_SQL.md`, PostgreSQL in `../04_Database/028_PostgreSQL.md`, Redis in `../04_Database/031_Redis-and-Caching.md`, Elasticsearch in `../04_Database/032_Elasticsearch.md`, message queues in `../03_Backend/038_Message-Queues.md`, Python in `../03_Backend/014_Python.md`, Docker in `../07_DevOps_and_Cloud/045_Docker.md`, Kubernetes in `../07_DevOps_and_Cloud/046_Kubernetes.md`, AWS in `../07_DevOps_and_Cloud/048_AWS.md`, Terraform in `../07_DevOps_and_Cloud/051_Terraform-and-IaC.md`, system design in `../09_System_Design/053_System-Design.md`.

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

### Q1. What is data engineering? *(Must-know)*
Data engineering is designing, building and operating the **systems that collect, move, store, transform and serve data** so analysts, data scientists, applications and ML models can use it reliably. The output is trustworthy, timely, well-modelled data, not the analysis itself.

### Q2. Data engineer vs data analyst vs data scientist vs ML engineer
| Role | Focus |
|---|---|
| Data engineer | Pipelines, storage, modelling, quality, platform |
| Data analyst | Queries, dashboards, business insight |
| Data scientist | Statistical modelling, experimentation |
| ML engineer | Productionising models (see `074_MLOps.md`) |
| Analytics engineer | dbt-style transformations, semantic layer |

### Q3. What is a data pipeline?
An automated sequence of steps that moves data from sources (databases, APIs, files, events) through processing (cleaning, joining, aggregating) to destinations (warehouse, lake, serving store). Key qualities: reliable, idempotent, observable, scalable, cost-efficient.

### Q4. ETL vs ELT *(Must-know)*
| | ETL | ELT |
|---|---|---|
| Order | Transform before loading | Load raw first, transform inside the warehouse/lakehouse |
| Compute | Separate ETL engine | Warehouse/lakehouse engine (Snowflake, BigQuery, Spark) |
| Raw data kept? | Often no | Yes (replayable) |
| Fit | Legacy, strict pre-load rules, PII scrubbing | Modern cloud stacks, flexibility |
Many real systems are hybrid (light cleaning/PII masking before load, heavy modelling after).

### Q5. OLTP vs OLAP *(Must-know)*
OLTP: many small transactions (insert/update), normalised, row-oriented (PostgreSQL, MySQL). OLAP: large scans and aggregations, denormalised/columnar (BigQuery, Snowflake, Redshift, ClickHouse). Don't run heavy analytics on the OLTP primary.

### Q6. Data warehouse vs data lake vs lakehouse
- **Warehouse**: curated, structured, schema-on-write, SQL-first.
- **Lake**: cheap object storage holding raw structured/semi/unstructured data, schema-on-read.
- **Lakehouse**: lake storage + table formats (Delta/Iceberg/Hudi) giving ACID, schema evolution and warehouse-like SQL.

### Q7. Structured, semi-structured and unstructured data
Structured: tables (SQL). Semi-structured: JSON, XML, Avro, logs (flexible schema). Unstructured: text, images, audio, video, PDFs.

### Q8. Batch vs streaming processing *(Must-know)*
Batch processes bounded data on a schedule (hourly/daily): simpler, cheaper, high throughput. Streaming processes unbounded events continuously with low latency: more complex (state, ordering, late data). Choose by freshness requirements, not fashion.

### Q9. Common file formats *(Must-know)*
| Format | Type | Notes |
|---|---|---|
| CSV | Row, text | Human readable; no types, poor for big data |
| JSON / JSONL | Row, text | Flexible, verbose, schema drift |
| Avro | Row, binary | Embedded schema, schema evolution; great for Kafka |
| Parquet | Columnar, binary | Compression, predicate pushdown, analytics default |
| ORC | Columnar, binary | Hive ecosystem, similar to Parquet |

### Q10. Why Parquet for analytics?
Columnar layout reads only needed columns, stores similar values together (high compression, dictionary/RLE encodings), keeps min/max statistics per row group for **predicate pushdown**, and carries schema. Partitioning + Parquet makes scans cheap.

### Q11. What is partitioning in storage?
Splitting a dataset into directories/files by a column (e.g., `date=2025-05-01/`) so queries filter by partition and skip irrelevant data. Pick low-to-medium cardinality columns; avoid millions of tiny partitions.

### Q12. Normalisation vs denormalisation
Normalisation (1NF–3NF) reduces redundancy and update anomalies, best for OLTP. Denormalisation duplicates data to reduce joins and speed analytics queries, best for OLAP.

### Q13. Star schema *(Must-know)*
A central **fact table** (measurable events: sales, clicks with foreign keys and measures) surrounded by **dimension tables** (descriptive context: customer, product, date). Simple, fast for BI. Snowflake schema normalises dimensions further (less redundancy, more joins).

### Q14. Fact table types
Transaction facts (one row per event), periodic snapshot (state at regular intervals), accumulating snapshot (process milestones), and factless facts (events with no measures). Declare the **grain** first (one row = what?).

### Q15. Slowly Changing Dimensions (SCD) *(Must-know)*
- **Type 1**: overwrite (no history).
- **Type 2**: add a new row with `valid_from`, `valid_to`, `is_current` (full history).
- **Type 3**: keep previous value in an extra column (limited history).
Type 2 is the standard for auditable history.

### Q16. Primary key, foreign key, surrogate key
Primary key uniquely identifies a row; foreign key references another table's key; **surrogate key** is a system-generated key (integer/hash) independent of business keys, useful in warehouses with SCD2 and multiple sources.

### Q17. SQL essentials for data engineers
`SELECT/WHERE/GROUP BY/HAVING/ORDER BY`, joins, subqueries, CTEs, `UNION`, `CASE`, window functions, date handling, `MERGE/UPSERT`, `EXPLAIN`. SQL remains the core data-engineering skill.

### Q18. Join types
`INNER` (matches only), `LEFT/RIGHT` (all from one side), `FULL OUTER`, `CROSS`, `SEMI/ANTI` (exists / not exists). Watch for row explosion with many-to-many joins and for `NULL` keys never matching.

### Q19. Window functions *(Must-know)*
Compute across related rows without collapsing them.
```sql
SELECT customer_id, order_ts, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_ts) AS running_total,
       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_ts DESC) AS rn,
       LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_ts) AS prev_amount
FROM orders;
```

### Q20. Deduplicate keeping the latest record
```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) rn
  FROM customers_raw
) t WHERE rn = 1;
```

### Q21. CTEs vs subqueries vs temp tables
CTEs (`WITH`) improve readability; some engines inline them, others materialise. Temp tables persist within a session and can have indexes/statistics. Choose based on reuse and engine behaviour.

### Q22. What is idempotency? *(Must-know)*
Running a pipeline step multiple times produces the same result as running it once (no duplicates, no corruption). Achieved with overwrite-by-partition, `MERGE/UPSERT`, deterministic keys and atomic commits. Essential for retries and backfills.

### Q23. What is a data warehouse layer model (medallion)?
Bronze (raw, as ingested), Silver (cleaned, conformed, deduplicated), Gold (business-level aggregates/marts). Similar to raw → staging → core → marts in warehouse practice.

### Q24. Orchestration basics
Orchestrators schedule tasks, manage dependencies (DAGs), retries, alerts, backfills and SLAs. Airflow, Dagster, Prefect, Azure Data Factory, AWS Step Functions/MWAA, Cloud Composer.

### Q25. Basic Airflow DAG
```python
from airflow.decorators import dag, task
from datetime import datetime, timedelta

@dag(schedule="@daily", start_date=datetime(2025, 1, 1), catchup=False,
     default_args={"retries": 2, "retry_delay": timedelta(minutes=5)})
def orders_daily():
    @task
    def extract(ds=None): ...
    @task
    def transform(path): ...
    @task
    def load(path): ...
    load(transform(extract()))
orders_daily()
```

### Q26. Data quality dimensions
Completeness, validity, uniqueness, consistency, accuracy, timeliness (freshness), integrity. Automate checks on every pipeline run.

### Q27. Apache Spark in one paragraph *(Must-know)*
A distributed engine for large-scale data processing with in-memory execution, DataFrame/SQL APIs, and libraries for streaming, ML and graphs. It splits data into **partitions**, runs **tasks** on executors, and plans work lazily (transformations build a plan; actions trigger execution).

### Q28. Transformations vs actions (Spark)
Transformations (`select`, `filter`, `groupBy`, `join`) are lazy; actions (`count`, `collect`, `write`, `show`) trigger execution. Narrow transformations don't shuffle; wide ones (`groupBy`, `join`) do.

### Q29. A simple PySpark job
```python
from pyspark.sql import SparkSession, functions as F
spark = SparkSession.builder.appName("orders").getOrCreate()
df = spark.read.parquet("s3://lake/bronze/orders/")
daily = (df.filter(F.col("status") == "PAID")
           .groupBy(F.to_date("order_ts").alias("dt"))
           .agg(F.sum("amount").alias("revenue"), F.countDistinct("customer_id").alias("customers")))
daily.write.mode("overwrite").partitionBy("dt").parquet("s3://lake/gold/daily_revenue/")
```

### Q30. Kafka in one paragraph *(Must-know)*
A distributed, durable, partitioned **event log**. Producers write to topics; consumers read at their own pace within consumer groups; messages are retained for a configured time and can be replayed. Used for decoupling services, event streaming and CDC pipelines.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Dimensional modelling process (Kimball)
Pick the business process → declare the grain → identify dimensions → identify facts/measures. Conform dimensions across marts (shared `dim_customer`, `dim_date`) for consistent reporting.

### Q32. Implementing SCD Type 2 with MERGE
```sql
MERGE INTO dim_customer d
USING stg_customer s ON d.customer_id = s.customer_id AND d.is_current = TRUE
WHEN MATCHED AND (d.email <> s.email OR d.city <> s.city) THEN
  UPDATE SET is_current = FALSE, valid_to = s.updated_at
WHEN NOT MATCHED THEN
  INSERT (customer_id, email, city, valid_from, valid_to, is_current)
  VALUES (s.customer_id, s.email, s.city, s.updated_at, NULL, TRUE);
-- then insert new current rows for changed customers (second statement)
```
Many engines/tools (dbt snapshots, Delta MERGE) simplify this.

### Q33. Incremental loading strategies *(Must-know)*
- **Full refresh**: reload everything (simple, expensive).
- **Incremental by watermark**: `WHERE updated_at > last_watermark`.
- **Partition overwrite**: rewrite the affected partitions.
- **CDC**: apply inserts/updates/deletes from the transaction log.
Handle late-arriving data with lookback windows and deletes with soft-delete flags or CDC.

### Q34. Change Data Capture (CDC) *(Must-know)*
Capture row-level changes from a source database's transaction log (MySQL binlog, PostgreSQL WAL) with tools like Debezium, AWS DMS, Fivetran, Airbyte. Pros: low source load, includes deletes, near real-time. Cons: schema changes, ordering, initial snapshot handling, operations complexity.

### Q35. Debezium + Kafka pattern
Debezium connectors read the DB log → publish change events (before/after, op type, LSN) to Kafka topics → sinks write to the lake/warehouse (Kafka Connect, Flink, Spark) → apply `MERGE` to maintain current-state tables.

### Q36. Handling schema evolution
Add nullable columns safely; avoid renames/type changes without versioning. Use Avro/Protobuf with a schema registry (compatibility modes: backward, forward, full), table formats with schema evolution (Delta/Iceberg), and contracts/alerts for breaking changes.

### Q37. Late-arriving and out-of-order data
Batch: reprocess recent partitions (lookback), use event time not ingestion time. Streaming: use **event-time windows with watermarks** and allowed lateness; route very late events to a correction path.

### Q38. Spark partitions and parallelism
Parallelism = number of partitions (tasks). Too few → underutilised cluster; too many → scheduling overhead. Typical target: 100–200 MB per partition after shuffle; `spark.sql.shuffle.partitions` (default 200) or AQE auto-coalescing.

### Q39. `repartition` vs `coalesce`
`repartition(n)` does a full shuffle to increase/decrease/redistribute evenly (can partition by columns). `coalesce(n)` only reduces partitions without a full shuffle (may leave imbalance). Use `coalesce` before writing fewer files.

### Q40. Shuffle: what and why costly *(Must-know)*
Redistribution of data across executors for wide operations (join, groupBy, distinct, repartition). It writes shuffle files to disk, moves data over the network and can spill; it's usually the main performance bottleneck. Reduce data first (filter/select early), use broadcast joins, and avoid unnecessary shuffles.

### Q41. Join strategies in Spark
- **Broadcast hash join**: small table broadcast to all executors (fast, no shuffle of the big side).
- **Sort-merge join**: default for large-large joins (both sides shuffled and sorted).
- **Shuffle hash join**, **broadcast nested loop** (cartesian-like).
```python
from pyspark.sql.functions import broadcast
fact.join(broadcast(dim), "product_id")
```

### Q42. Data skew *(Must-know)*
Some keys have far more rows (e.g., `null`, a celebrity user), so one task runs much longer. Fixes: AQE skew-join handling, salting keys, broadcast small side, filter/handle null keys separately, pre-aggregate, or repartition differently.

### Q43. Caching and persistence
`df.cache()` / `persist(StorageLevel.MEMORY_AND_DISK)` keeps results for reuse across actions. Cache only data reused multiple times, and `unpersist()` when done. Caching a one-time-use DataFrame wastes memory.

### Q44. Adaptive Query Execution (AQE)
Spark 3+ re-optimises plans at runtime using shuffle statistics: coalesces small shuffle partitions, switches join strategies, and splits skewed partitions. Enable (`spark.sql.adaptive.enabled=true`, default in recent versions).

### Q45. Small files problem
Many tiny files overwhelm metadata/listing and slow queries. Fix by compaction (`OPTIMIZE` in Delta, `rewrite_data_files` in Iceberg), controlling output partitions, batching writes, and choosing sensible partition granularity. Target file sizes ~128 MB–1 GB.

### Q46. Writing partitioned output safely
```python
(df.repartition("dt")
   .write.mode("overwrite")
   .option("partitionOverwriteMode", "dynamic")
   .partitionBy("dt").parquet(path))
```
Dynamic partition overwrite replaces only the partitions present in the DataFrame.

### Q47. Delta Lake / Iceberg / Hudi: what do they add?
ACID transactions on object storage, snapshot isolation, time travel, schema enforcement/evolution, upserts/deletes (`MERGE`), compaction, and efficient metadata (manifest/transaction logs). They enable lakehouse architectures.

### Q48. Time travel use cases
Reproduce past training data, audit changes, roll back bad writes, debug incidents. Example (Delta): `SELECT * FROM t VERSION AS OF 42` or `TIMESTAMP AS OF`.

### Q49. dbt basics *(Must-know)*
dbt (data build tool) manages SQL transformations in the warehouse with software practices: models (`SELECT` statements), `ref()` dependencies, tests, docs, snapshots (SCD2), seeds, incremental models and macros (Jinja).
```sql
-- models/marts/fct_orders.sql
{{ config(materialized='incremental', unique_key='order_id') }}
select o.order_id, o.customer_id, o.amount, o.order_ts
from {{ ref('stg_orders') }} o
{% if is_incremental() %} where o.order_ts > (select max(order_ts) from {{ this }}) {% endif %}
```

### Q50. dbt tests and documentation
Generic tests: `unique`, `not_null`, `accepted_values`, `relationships`; custom SQL tests; `dbt docs generate` creates lineage graphs. Run `dbt build` in CI.

### Q51. Airflow concepts *(Must-know)*
DAG, task, operator, sensor, hook, connection, XCom (small metadata between tasks), pool, executor (Local/Celery/Kubernetes), scheduler, `catchup`, `backfill`, data interval (`logical_date`, `data_interval_start/end`). Keep tasks idempotent and avoid heavy compute inside the Airflow worker (push to Spark/warehouse).

### Q52. Airflow best practices
Small deterministic tasks; no top-level heavy code in DAG files; parameterise by data interval; retries with backoff; SLAs and alerts; secrets in backends; pools to limit concurrency; avoid XCom for big data; test DAG import in CI.

### Q53. Sensors and deferrable operators
Sensors wait for conditions (file arrival, partition). Deferrable operators/triggers free worker slots while waiting. Use timeouts and reschedule mode to avoid starving the cluster.

### Q54. Kafka core concepts *(Must-know)*
Topic, partition (unit of parallelism and ordering), offset, broker, replication factor, ISR, producer (acks, idempotence), consumer group (partitions are divided among consumers), retention/compaction, schema registry, Kafka Connect, Kafka Streams.

### Q55. Kafka delivery semantics
At-most-once (commit before processing), at-least-once (commit after; duplicates possible), exactly-once (idempotent producers + transactions, read-process-write atomically, `isolation.level=read_committed`). End-to-end exactly-once needs idempotent/transactional sinks too.

### Q56. Kafka partitioning and ordering
Order is guaranteed only within a partition. Use a meaningful key (e.g., `customer_id`) so related events land in the same partition. More partitions → more parallelism but more overhead and rebalance cost.

### Q57. Consumer lag
Difference between latest offset and the consumer's committed offset; a key health metric. Rising lag → consumers too slow, rebalance storms or downstream backpressure. Alert on lag growth and time-lag.

### Q58. Streaming concepts: windows and watermarks *(Must-know)*
Windows: tumbling (fixed, non-overlapping), sliding (overlapping), session (gap-based). **Watermark** = how late events may arrive; the engine drops/handles events older than `max_event_time − allowed_lateness` and can finalise window results.

### Q59. Spark Structured Streaming example
```python
events = (spark.readStream.format("kafka")
          .option("kafka.bootstrap.servers", "broker:9092").option("subscribe", "clicks").load())
parsed = events.select(F.from_json(F.col("value").cast("string"), schema).alias("e")).select("e.*")
agg = (parsed.withWatermark("event_ts", "10 minutes")
             .groupBy(F.window("event_ts", "5 minutes"), "page").count())
(agg.writeStream.outputMode("update").format("delta")
    .option("checkpointLocation", "s3://chk/clicks/").start("s3://lake/silver/clicks_5m/"))
```
Checkpoints store offsets and state for recovery.

### Q60. Lambda vs Kappa architecture
Lambda: separate batch layer (accuracy) and speed layer (low latency) merged at serving, which means duplicate logic. Kappa: a single streaming pipeline with replay from the log. Modern lakehouses often unify batch and streaming with the same engine/table format.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Designing a batch pipeline end to end *(Must-know)*
Source extraction (incremental/CDC) → land raw (immutable, partitioned by ingestion date) → validate (schema, nulls, volume) → clean/conform (types, dedupe, standardise) → model (facts/dimensions) → publish (tables, marts) → quality + freshness monitors → lineage/catalog updates → alert on failures with ownership.

### Q62. Idempotent load patterns
Partition overwrite, `MERGE` on natural/surrogate keys, write-to-temp-then-swap (atomic rename/commit), deterministic file names, de-duplication with `ROW_NUMBER()` on keys, and exactly-once sinks via transactional table formats.

### Q63. Handling deletes and updates in lakes
Use table formats with `MERGE`/`DELETE`, soft deletes via flags/tombstones, CDC delete events, and periodic compaction/vacuum. Regulatory deletes (GDPR "right to erasure") require rewriting files and expiring old snapshots/time travel.

### Q64. Data modelling for ML/feature pipelines
Entity-centric tables keyed by `(entity_id, event_time)`, point-in-time-correct joins, windowed aggregates (7/30/90 days), consistent definitions shared by training and serving, and feature freshness SLAs. See `074_MLOps.md` for feature stores.

### Q65. Data Vault modelling
Hubs (business keys), Links (relationships), Satellites (descriptive attributes with history). Good for auditability and integrating many sources with change; requires a presentation layer (star schemas) for BI. More complex than Kimball.

### Q66. Choosing a modelling approach
Kimball star for BI-centric teams and speed; Data Vault for large, regulated, multi-source enterprises; wide denormalised tables ("One Big Table") for simple analytics and ML features. Match to team skills and query patterns.

### Q67. Partitioning & clustering in warehouses
BigQuery: partition (date/ingestion/integer) + clustering (sorted blocks by columns). Snowflake: micro-partitions with automatic clustering and optional clustering keys. Redshift: distribution (KEY/EVEN/ALL) and sort keys. Choose based on filter and join patterns.

### Q68. Query optimisation checklist
Select only needed columns; filter on partition/cluster columns early; avoid `SELECT *`; pre-aggregate large facts; replace correlated subqueries with joins/window functions; avoid cross joins and exploding joins; use appropriate data types; inspect `EXPLAIN`/query profile; materialise reused heavy CTEs.

### Q69. Spark tuning essentials *(Must-know)*
Right-size executors (cores 4–5, memory with overhead), use Kryo serialisation, enable AQE, set `spark.sql.shuffle.partitions` appropriately, broadcast small tables, avoid Python UDFs (use built-ins or pandas UDF/Arrow), push filters/projection, use Parquet/Delta, handle skew, avoid `collect()` on big data, watch GC and spill metrics in the Spark UI.

### Q70. Reading the Spark UI
Jobs → stages → tasks. Look for skewed tasks (max ≫ median duration), large shuffle read/write, spill to disk, GC time, straggler executors, small tasks overhead, and the SQL tab's physical plan (join types, scans, pushdown).

### Q71. UDF performance
Python UDFs serialise rows between JVM and Python (slow). Prefer built-in functions, SQL expressions, **pandas UDFs** (vectorised with Arrow), or Scala/Java UDFs when needed.

### Q72. Flink vs Spark Structured Streaming vs Kafka Streams
| | Flink | Spark SS | Kafka Streams |
|---|---|---|---|
| Model | True streaming (event-at-a-time) | Micro-batch (and continuous mode) | Library inside your app |
| Latency | Very low (ms) | Seconds typical | Low |
| State | Rich, managed, large state | Supported | RocksDB-based |
| Best for | Complex event processing, low latency | Unified batch+stream, SQL, lakehouse | Kafka-centric microservices |

### Q73. Exactly-once in practice
Idempotent writes (upsert keys), transactional sinks, checkpoint + offset commit coordination (Flink two-phase commit, Kafka transactions), and deduplication by event ID within a retention window. "Effectively once" is usually the goal.

### Q74. Backpressure
When consumers/downstream can't keep up, upstream buffers fill. Handle by scaling consumers, tuning batch/poll sizes, rate-limiting producers, using buffering topics, and monitoring lag and processing time.

### Q75. State management in streaming
State (aggregations, joins, dedupe) stored in RocksDB/managed state with checkpoints. Control growth with TTL, watermarks, bounded windows, and compaction. Plan for state migration on code changes (schema/operators UIDs in Flink).

### Q76. Stream-stream and stream-table joins
Stream-stream joins need time bounds (interval joins) and watermarks to limit state. Stream-table (enrichment) joins use broadcast/lookup tables or changelog topics (KTable); beware stale reference data.

### Q77. Schema registry and compatibility
Central service storing Avro/Protobuf/JSON schemas with compatibility checks (BACKWARD, FORWARD, FULL). Producers register schemas; consumers fetch by ID. Prevents breaking changes from reaching consumers.

### Q78. Data contracts
Formal agreements between producers and consumers covering schema, semantics, quality expectations, SLAs and ownership, enforced in CI and runtime. Reduce "surprise" breaking changes and shift quality responsibility upstream.

### Q79. Data quality framework
Define expectations per dataset (schema, uniqueness, null rate, referential integrity, ranges, freshness, volume anomalies, distribution drift), run them in pipelines (Great Expectations, dbt tests, Soda, Deequ), classify severity (block vs warn), quarantine bad records, publish quality metrics and alert owners.
```python
import great_expectations as gx
# expect_column_values_to_not_be_null("order_id"); expect_column_values_to_be_unique("order_id")
# expect_column_values_to_be_between("amount", 0, 100000)
```

### Q80. Data lineage and cataloguing
Lineage tracks how data flows from sources to dashboards/models (column-level ideally) using OpenLineage/Marquez, dbt docs, DataHub, Atlan, Collibra, Unity Catalog, Dataplex. Catalogues add ownership, descriptions, tags, glossary and usage metrics for discoverability and impact analysis.

### Q81. Observability for data (data observability)
Monitor freshness, volume, schema changes, distribution, and lineage-aware incident impact (Monte Carlo, Bigeye, Soda, Elementary for dbt). Pair with pipeline metrics (duration, retries, cost).

### Q82. Security for data platforms
IAM least privilege, encryption at rest/in transit, network isolation (private endpoints/VPC), secrets management, column/row-level security and masking, tokenisation of PII, audit logs, data classification, and access reviews. Separate environments.

### Q83. PII handling
Classify PII, minimise collection, hash/tokenise/mask in lower layers, restrict raw access, apply retention and deletion workflows, and support subject access/erasure requests. Verify obligations (GDPR, India's DPDP Act, sector rules).

### Q84. Cost optimisation in the cloud
Partition/cluster to cut scanned bytes, columnar formats and compression, right-size and auto-scale clusters, spot instances for batch, storage lifecycle policies (tiering/expiry), caching and materialised views, avoid repeated full refreshes, set query/slot quotas, tag resources, and monitor cost per pipeline/team.

### Q85. Warehouse choices
| Platform | Strength |
|---|---|
| BigQuery | Serverless, per-byte scan pricing, strong ML integration |
| Snowflake | Separation of storage/compute, multi-cloud, easy scaling |
| Redshift | AWS-native, tuned MPP, RA3/serverless |
| Databricks | Lakehouse, Spark/Delta, ML integration |
| ClickHouse / Druid / Pinot | Real-time OLAP, low-latency analytics |
| DuckDB | In-process analytics for local/embedded use |

### Q86. Serving layer options
Warehouse BI marts, OLAP engines (ClickHouse/Pinot/Druid) for real-time dashboards, key-value stores (Redis/DynamoDB) for features/lookups, search (Elasticsearch/OpenSearch), APIs over curated tables, and semantic/metrics layers (dbt Semantic Layer, Cube, LookML).

### Q87. Semantic/metrics layer
A governed definition of business metrics (revenue, active users) reused across BI, notebooks and apps to avoid inconsistent numbers. Implement via dbt metrics/semantic layer, Cube, LookML or warehouse views.

### Q88. Testing data pipelines
Unit tests for transformation functions, SQL tests on small fixtures, contract/schema tests, data-quality tests in production, integration tests of the pipeline in a sandbox, regression tests comparing outputs across versions, and idempotency tests (run twice).

### Q89. CI/CD for data
Version-controlled SQL/DAGs, PR checks (lint, compile, `dbt build` on slim CI with state deferral), ephemeral dev schemas/branches, automated deployments (GitHub Actions/GitLab), environment promotion, and rollback via Git/time travel. See `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

### Q90. Infrastructure as code
Terraform/Pulumi/CloudFormation for storage, clusters, IAM, networking, warehouses; Helm/Kustomize for Kubernetes deployments (Airflow/Flink/Kafka operators). Environments are reproducible and reviewable. See `../07_DevOps_and_Cloud/051_Terraform-and-IaC.md`.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Designing a modern data platform *(Must-know)*
Sources (apps, DBs, SaaS, events) → ingestion (CDC, Fivetran/Airbyte, Kafka, APIs) → raw storage (object store, bronze) → processing (Spark/Flink/dbt/SQL) → curated layers (silver/gold, marts) → serving (BI, APIs, feature stores, reverse ETL) → cross-cutting: orchestration, quality, lineage/catalogue, security/governance, observability, cost control. Prefer open table formats and decoupled storage/compute.

### Q92. Real-time analytics architecture
Events → Kafka → stream processing (Flink/Spark) for enrichment/aggregation → serving store (Pinot/ClickHouse/Druid or Redis) + lakehouse sink for history. Define latency SLOs, handle late data, exactly-once semantics, replay/backfill from the log, and degrade gracefully.

### Q93. Designing a CDC-based replication pipeline
Initial snapshot + log-based CDC (consistent cut-over by LSN/offset) → Kafka with schema registry → apply to lakehouse via MERGE with ordering keys (LSN/ts) and tombstones → handle schema changes, replays, and out-of-order events → reconciliation jobs (row counts/checksums) → monitoring of lag and drift.

### Q94. Reconciliation and data validation across systems
Compare row counts, sums, hashes by partition/key range between source and target; use sampling for large tables; alert on mismatch beyond tolerance; automate re-sync of discrepancies. Essential for financial and compliance-grade data.

### Q95. Handling extremely large joins and aggregations
Reduce input early, bucket/co-partition tables on join keys, broadcast dimension tables, handle skew (salting/AQE), pre-aggregate in stages, use approximate algorithms (HyperLogLog, t-digest) when acceptable, and materialise intermediate results to avoid recomputation.

### Q96. Approximate algorithms
HyperLogLog (distinct counts), Count-Min Sketch (frequencies), Bloom filters (membership), t-digest/KLL (quantiles). Trade small error for big memory/time savings; common in streaming and warehouses (`APPROX_COUNT_DISTINCT`).

### Q97. Lakehouse table maintenance
Compaction (small files → large), Z-ordering/clustering for locality, vacuum/expire snapshots, statistics collection, partition evolution (Iceberg), metadata cleanup, and retention policies. Schedule and monitor maintenance as first-class pipelines.

### Q98. Delta vs Iceberg vs Hudi (selection)
| | Delta | Iceberg | Hudi |
|---|---|---|---|
| Strength | Databricks/Spark integration, simple | Engine-agnostic, hidden partitioning, partition evolution | Upsert-heavy, streaming ingestion |
| Catalog/engines | Spark, Trino, Flink, etc. (UniForm for interop) | Spark, Trino, Flink, Snowflake, BigQuery, Athena | Spark, Flink, Trino |
Choose by engine ecosystem, catalog strategy and workload; interoperability is improving (verify current support).

### Q99. Multi-region and disaster recovery for data
Replicate object storage and metadata (cross-region), define RPO/RTO per dataset tier, keep infrastructure as code, test restores, make pipelines region-aware, and plan for catalogue/metastore backup. Be careful with data residency rules.

### Q100. Backfills and reprocessing at scale
Design pipelines to be parameterised by time range; run backfills with isolated resources and throttling; keep immutable raw data; validate outputs before swapping into production tables; communicate downstream impact; support dual-writes or shadow tables for safe cutover.

### Q101. Handling data incidents
Detect (freshness/volume/quality alerts) → triage (impact via lineage) → mitigate (pause downstream, rollback via time travel, serve last-known-good) → fix root cause → backfill → communicate with stakeholders → post-mortem with action items (tests, contracts, monitors).

### Q102. SLA/SLO/SLI for data
SLIs: freshness (time since latest data), completeness, accuracy checks passed, pipeline success rate. SLOs: e.g., "daily revenue mart ready by 07:00 IST 99% of days." Error budgets guide investments; publish status to consumers.

### Q103. Data mesh vs centralised platform
Mesh: domain-owned data products, federated governance, self-service platform, interoperable standards. Pros: scalability of ownership, domain knowledge. Cons: requires maturity, risk of inconsistency. Many orgs adopt a hybrid: central platform + domain data product owners.

### Q104. Data products
Curated datasets with clear owners, SLAs, documentation, schema/contract, quality guarantees, discoverability and versioning, treated like products with consumers and feedback loops.

### Q105. Reverse ETL
Syncing warehouse data back to operational tools (CRM, ads, support) via Hightouch/Census or custom jobs. Needs idempotent upserts, rate limiting, error handling, and governance on what leaves the warehouse.

### Q106. Feature engineering pipelines at scale
Batch feature jobs (Spark/dbt) writing to offline stores; streaming features via Flink/Kafka into online stores; shared definitions and tests; backfill support; point-in-time joins for training sets; freshness monitoring; consistency tests offline vs online. See `074_MLOps.md`.

### Q107. Vector and unstructured data pipelines (AI era)
Ingest documents/images → parse/OCR → clean → chunk → embed (batch/stream) → store vectors + metadata in a vector DB (pgvector, Pinecone, Milvus, OpenSearch) and raw in the lake. Handle re-embedding on model change, deduplication, access control, PII, and incremental updates. See `../11_Generative_AI/067_Vector-Databases.md`.

### Q108. Cost governance (FinOps for data)
Tag everything; attribute cost per pipeline/team/dataset; budgets and alerts; query governance (quotas, cost estimates before running, dry runs); storage tiering and TTLs; reservation/commit discounts; kill idle clusters; review top-N expensive queries/jobs monthly.

### Q109. Performance engineering for warehouses
Use clustering/partition pruning, materialised views, result caching, search optimisation (Snowflake), BI engine (BigQuery), pre-aggregations, incremental models, denormalised marts for dashboards, concurrency scaling, and workload isolation (warehouses/slots per team).

### Q110. Compliance and auditing
Retention schedules, legal holds, immutable audit logs, access reviews, lineage evidence, encryption key management (KMS/HSM), data residency, DPIAs, and automated policy enforcement (tags + policies). Verify with legal/compliance teams.

### Q111. Metadata-driven pipelines
Config tables or YAML define sources, targets, transformations and quality rules; generic frameworks execute them. Pros: fast onboarding, consistency. Cons: complexity, harder debugging; keep an escape hatch for custom logic.

### Q112. Handling semi-structured data
Ingest JSON as raw, parse with schema inference carefully (prefer explicit schemas), flatten nested arrays with `EXPLODE`/`LATERAL FLATTEN`, store typed columns in silver, keep raw payload for replay, and monitor schema drift.

### Q113. API ingestion patterns
Pagination, rate limits/backoff, incremental cursors, idempotent upserts, retries, secrets, raw JSON landing, and handling of schema changes. Use frameworks (Airbyte, dlt, Singer) or custom operators.

### Q114. Evaluating build vs buy for ingestion
Managed connectors (Fivetran/Airbyte Cloud) save time and maintenance for standard SaaS sources but cost per row/credit; custom pipelines for unusual sources, strict controls, or high volume. Consider reliability, security, schema handling and total cost.

### Q115. Capacity planning
Estimate data growth, peak throughput, concurrency, SLA windows; benchmark representative workloads; plan autoscaling limits, storage growth and cost; revisit quarterly. Include headroom for backfills and incidents.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Data strategy and roadmap
Align platform capabilities with business priorities: foundation (ingestion, storage, orchestration, quality), consumption (BI, self-service, ML), governance (catalogue, security, privacy), and optimisation (cost, performance). Define milestones, owners, success metrics and sequencing; avoid boiling the ocean.

### Q117. Operating model and team topology
Platform team (tools/infra), data product teams in domains, analytics engineers, governance/steward roles, and SRE/DataOps for reliability. Define RACI for data ownership, on-call, and incident response. Invest in documentation and onboarding.

### Q118. Architecture decision records and standards
Document key decisions (table format, orchestration, warehouse, streaming engine, modelling approach) with context, options, trade-offs and consequences. Set standards (naming, layering, testing, contracts) and enforce via templates and CI.

### Q119. Governance framework
Data classification, ownership and stewardship, access policies (RBAC/ABAC), quality standards, retention, lineage requirements, privacy by design, and approval workflows. Automate policy enforcement via tags and platform controls rather than manual reviews.

### Q120. Build, buy and vendor management
Evaluate vendors on fit, openness (formats, APIs), security, TCO, ecosystem and exit strategy. Prefer open formats (Parquet, Iceberg/Delta) and standard SQL to reduce lock-in. Negotiate commitments carefully; run pilots on real workloads.

### Q121. Platform reliability and resilience
Define tiered SLOs; redundancy for critical components (Kafka multi-AZ, replicated metastore); chaos/failure drills; capacity buffers; runbooks; automated recovery; dependency maps; blast-radius limits (isolated workloads).

### Q122. Migration strategy (on-prem to cloud, warehouse to lakehouse)
Inventory and prioritise workloads; establish landing zones/security; replicate data (CDC/bulk); run parallel pipelines with reconciliation; migrate consumers in waves; decommission old systems; manage cost and training. Avoid lift-and-shift without optimisation; validate correctness with automated diffing.

### Q123. Enabling analytics and ML consumers
Self-service tools, curated gold datasets, semantic layer, notebooks with governed access, feature stores, documentation and training, support SLAs. Measure adoption, time-to-insight and satisfaction.

### Q124. Measuring platform success
Pipeline reliability (success rate, MTTR), data freshness SLA attainment, data quality incident count, time-to-onboard new source, cost per TB/query, consumer adoption, and business outcomes enabled. Report regularly to stakeholders.

### Q125. Communicating with executives
Frame investments in terms of risk reduction, speed to insight, cost efficiency and compliance. Use concrete before/after examples ("revenue dashboard ready 6 hours earlier; audit evidence in minutes"), clear roadmaps and explicit trade-offs.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Top-N per group, running totals and retention (SQL)
```sql
-- Top 3 products per category by revenue
SELECT * FROM (
  SELECT category, product_id, SUM(amount) AS revenue,
         DENSE_RANK() OVER (PARTITION BY category ORDER BY SUM(amount) DESC) AS rnk
  FROM sales GROUP BY category, product_id
) t WHERE rnk <= 3;

-- Day-1 retention
SELECT a.signup_date,
       COUNT(DISTINCT a.user_id) AS users,
       COUNT(DISTINCT b.user_id) * 1.0 / COUNT(DISTINCT a.user_id) AS d1_retention
FROM signups a
LEFT JOIN activity b ON b.user_id = a.user_id AND b.activity_date = a.signup_date + INTERVAL '1 day'
GROUP BY a.signup_date;
```

### Task 2. Sessionization with window functions
```sql
WITH ordered AS (
  SELECT user_id, event_ts,
         LAG(event_ts) OVER (PARTITION BY user_id ORDER BY event_ts) AS prev_ts
  FROM events
), flagged AS (
  SELECT *, CASE WHEN prev_ts IS NULL OR event_ts - prev_ts > INTERVAL '30 minutes' THEN 1 ELSE 0 END AS new_session
  FROM ordered
)
SELECT user_id, event_ts,
       SUM(new_session) OVER (PARTITION BY user_id ORDER BY event_ts) AS session_id
FROM flagged;
```

### Task 3. PySpark ETL with dedupe, quality checks and partitioned write
```python
from pyspark.sql import SparkSession, functions as F, Window

spark = SparkSession.builder.appName("orders_silver").getOrCreate()
raw = spark.read.json("s3://lake/bronze/orders/dt=2025-05-01/")
w = Window.partitionBy("order_id").orderBy(F.col("updated_at").desc())
clean = (raw.withColumn("rn", F.row_number().over(w)).filter("rn = 1").drop("rn")
            .withColumn("amount", F.col("amount").cast("decimal(18,2)"))
            .withColumn("order_ts", F.to_timestamp("order_ts"))
            .filter(F.col("order_id").isNotNull() & (F.col("amount") >= 0)))
bad = raw.count() - clean.count()
assert bad / max(raw.count(), 1) < 0.02, f"too many rejected rows: {bad}"
(clean.withColumn("dt", F.to_date("order_ts")).write.mode("overwrite")
      .option("partitionOverwriteMode", "dynamic").partitionBy("dt").parquet("s3://lake/silver/orders/"))
```

### Task 4. Fix data skew with salting
```python
from pyspark.sql import functions as F
N = 16
big = big.withColumn("salt", (F.rand() * N).cast("int"))
small = small.withColumn("salt", F.explode(F.array([F.lit(i) for i in range(N)])))
joined = big.join(small, ["join_key", "salt"]).drop("salt")
```
Prefer AQE skew handling first; salt only when needed.

### Task 5. Delta Lake MERGE upsert (CDC apply)
```python
from delta.tables import DeltaTable
tgt = DeltaTable.forPath(spark, "s3://lake/silver/customers")
(tgt.alias("t").merge(changes.alias("s"), "t.customer_id = s.customer_id")
    .whenMatchedDelete(condition="s.op = 'D'")
    .whenMatchedUpdateAll(condition="s.op IN ('U','I') AND s.lsn > t.lsn")
    .whenNotMatchedInsertAll(condition="s.op <> 'D'").execute())
spark.sql("OPTIMIZE delta.`s3://lake/silver/customers` ZORDER BY (customer_id)")
```

### Task 6. Structured Streaming from Kafka with watermark and dedupe
```python
from pyspark.sql import functions as F
schema = "event_id string, user_id string, page string, event_ts timestamp"
stream = (spark.readStream.format("kafka").option("kafka.bootstrap.servers", "b:9092")
          .option("subscribe", "clicks").option("startingOffsets", "latest").load()
          .select(F.from_json(F.col("value").cast("string"), schema).alias("e")).select("e.*"))
dedup = stream.withWatermark("event_ts", "15 minutes").dropDuplicates(["event_id"])
out = dedup.groupBy(F.window("event_ts", "1 minute"), "page").count()
(out.writeStream.outputMode("append").format("delta")
    .option("checkpointLocation", "s3://chk/clicks_1m").trigger(processingTime="30 seconds")
    .start("s3://lake/silver/clicks_1m"))
```

### Task 7. Kafka producer/consumer (Python, idempotent, manual commit)
```python
from confluent_kafka import Producer, Consumer
import json
p = Producer({"bootstrap.servers": "b:9092", "enable.idempotence": True, "acks": "all"})
p.produce("orders", key="c42", value=json.dumps({"order_id": "o1", "amount": 499.0})); p.flush()

c = Consumer({"bootstrap.servers": "b:9092", "group.id": "orders-sink",
              "enable.auto.commit": False, "auto.offset.reset": "earliest"})
c.subscribe(["orders"])
while True:
    msg = c.poll(1.0)
    if msg is None or msg.error(): continue
    process(json.loads(msg.value()))      # must be idempotent
    c.commit(msg)                         # at-least-once
```

### Task 8. Airflow DAG with idempotent partition load and quality gate
```python
from airflow.decorators import dag, task
from datetime import datetime, timedelta

@dag(schedule="0 2 * * *", start_date=datetime(2025, 1, 1), catchup=True, max_active_runs=1,
     default_args={"retries": 3, "retry_delay": timedelta(minutes=10)}, tags=["orders"])
def orders_pipeline():
    @task
    def extract(data_interval_start=None):
        ds = data_interval_start.strftime("%Y-%m-%d"); ...           # land raw into dt=ds
        return ds
    @task
    def transform(ds): ...                                           # overwrite partition dt=ds
    @task
    def quality_gate(ds): ...                                        # raise on failed expectations
    @task
    def publish(ds): ...                                             # swap/merge into gold
    publish(quality_gate(transform(extract())))
orders_pipeline()
```

### Task 9. dbt project snippets (tests + snapshot)
```yaml
# models/staging/schema.yml
models:
  - name: stg_orders
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: customer_id
        tests:
          - relationships: {to: ref('stg_customers'), field: customer_id}
      - name: status
        tests:
          - accepted_values: {values: ['PLACED','PAID','SHIPPED','CANCELLED']}
```
```sql
-- snapshots/customers_snapshot.sql
{% snapshot customers_snapshot %}
{{ config(target_schema='snapshots', unique_key='customer_id', strategy='timestamp', updated_at='updated_at') }}
select * from {{ source('app', 'customers') }}
{% endsnapshot %}
```

### Task 10. Fast local analytics with DuckDB/Polars
```python
import duckdb
duckdb.sql("""
  SELECT date_trunc('day', order_ts) AS dt, SUM(amount) AS revenue
  FROM read_parquet('s3://lake/silver/orders/*/*.parquet')
  WHERE order_ts >= DATE '2025-05-01'
  GROUP BY 1 ORDER BY 1""").show()

import polars as pl
lf = pl.scan_parquet("orders/*.parquet").filter(pl.col("status") == "PAID") \
       .group_by("customer_id").agg(pl.col("amount").sum().alias("ltv"))
print(lf.collect().head())
```

### Task 11. Reconciliation query between source and target
```sql
SELECT s.dt, s.cnt AS src_cnt, t.cnt AS tgt_cnt, s.total AS src_total, t.total AS tgt_total
FROM (SELECT order_date AS dt, COUNT(*) cnt, SUM(amount) total FROM src.orders GROUP BY 1) s
FULL JOIN (SELECT dt, COUNT(*) cnt, SUM(amount) total FROM lake.silver_orders GROUP BY 1) t USING (dt)
WHERE COALESCE(s.cnt,0) <> COALESCE(t.cnt,0) OR ABS(COALESCE(s.total,0) - COALESCE(t.total,0)) > 0.01;
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Daily report numbers don't match the source system
Check duplicates after retries (non-idempotent loads), late-arriving data outside the lookback window, timezone/date boundary issues, filters dropping nulls, join fan-out, and currency/decimal casting. Reconcile counts and sums by partition to isolate the layer.

### D2. Spark job is very slow, one task runs for hours
Data skew. Check task duration distribution in the UI; enable AQE skew join, salt hot keys, handle null keys separately, broadcast small tables, repartition by a better key.

### D3. Spark `OutOfMemoryError` / executor lost
Too-large partitions, wide rows, `collect()` on big data, exploding joins, insufficient memory overhead. Increase partitions, filter/select early, avoid collect, tune executor memory/overhead, fix join cardinality.

### D4. Millions of tiny files in the lake
Over-partitioning or streaming micro-batches writing small files. Compact (OPTIMIZE/rewrite), coarsen partitions, increase trigger intervals, use auto-compaction.

### D5. Airflow DAG not running / tasks stuck in queued
Scheduler overloaded, pool/concurrency limits, missing worker capacity, import errors, `max_active_runs`, sensors hogging slots. Check scheduler logs, DAG parse time, pools, switch sensors to reschedule/deferrable.

### D6. Duplicate rows after a retry
Append-only writes without keys. Make writes idempotent: partition overwrite, MERGE by key, dedupe step, transactional sinks.

### D7. Kafka consumer lag keeps growing
Consumers slower than producers, rebalances, slow downstream sink, partition skew. Scale consumers (up to partition count), optimise processing, batch writes, increase partitions, check GC and network.

### D8. Streaming job state grows unbounded
Missing watermark/TTL, unbounded keys, stream-stream joins without time bounds. Add watermarks, TTL, bounded windows, and monitor state size.

### D9. Schema change broke the pipeline
Producer added/renamed/changed a column type. Use schema registry compatibility, contracts, permissive parsing for new fields, alerting on drift, and versioned schemas.

### D10. Time zone bugs in daily aggregates
Mixed UTC/local timestamps, date truncation in different zones, DST transitions. Store UTC, convert at the presentation layer with explicit zone, document business-day definitions.

### D11. Query cost exploded in BigQuery/Snowflake
Unpartitioned scans, `SELECT *`, repeated full refreshes, cross joins, no clustering, BI tools issuing heavy queries. Add partition filters, incremental models, materialisations, cost alerts and query quotas.

### D12. Backfill overloaded production
Backfills competed for resources with live jobs. Throttle concurrency, use separate pools/clusters, schedule off-peak, run in partitions, validate before swapping.

### D13. dbt incremental model drifts from source
Late updates not captured by watermark, deletes missed, or logic changes without full refresh. Use lookback windows, `unique_key` merges, periodic full refreshes and reconciliation tests.

### D14. Join produces more rows than expected
Many-to-many keys or duplicates in the dimension. Check uniqueness of join keys, dedupe dimensions (SCD current flag), add tests for uniqueness and relationships.

### D15. Data arrives but dashboards show stale values
Caching in BI, materialised views not refreshed, pipeline success but downstream not triggered, upstream delays. Track freshness per layer and expose "last updated" in dashboards.

---

# 🧩 Part 8: Tricky Questions

### T1. Is ELT always better than ETL?
No. ETL is appropriate when sensitive data must be masked before landing, when targets can't transform efficiently, or for strict conformance. Many stacks mix both.

### T2. Does exactly-once mean no duplicates anywhere?
Only within a defined scope. End-to-end guarantees require idempotent or transactional sinks and coordinated offsets/checkpoints; external side effects (emails, APIs) can still duplicate.

### T3. Is more partitions always better in Spark?
No. Too many tiny tasks increase overhead; too few underutilise the cluster. Aim for balanced partition sizes (~100–200 MB) and use AQE.

### T4. Is `cache()` always an optimisation?
No. Caching data used once wastes memory and may cause evictions. Cache only reused, expensive intermediate results.

### T5. Why can a `LEFT JOIN` filter in `WHERE` behave like an inner join?
Conditions on the right table in `WHERE` remove null-extended rows. Put them in the `ON` clause to preserve left rows.

### T6. Is NULL = NULL in SQL?
No; comparisons with NULL yield unknown. Use `IS NULL`, `IS NOT DISTINCT FROM`, or `COALESCE`. In `GROUP BY`/`DISTINCT`, NULLs are grouped together.

### T7. Why does `COUNT(DISTINCT)` at scale hurt?
It needs global dedupe state/shuffle. Use pre-aggregation, approximate distinct, or HyperLogLog sketches when exactness isn't required.

### T8. Can Kafka guarantee global ordering?
Only within a partition. Global order requires a single partition (limits throughput) or downstream re-ordering with sequence numbers.

### T9. Are CSV files OK for a data lake?
For interchange maybe, but not for analytics at scale: no types/schema, no compression benefits, slow scans. Convert to Parquet/Delta/Iceberg.

### T10. Does a data lake replace a warehouse?
Not necessarily. Lakes are flexible/cheap but need governance and table formats for reliability; warehouses/lakehouses add performance, governance and SQL ergonomics. Many orgs use both or a lakehouse.

### T11. Is SCD Type 2 always needed?
No. Use it when history matters for reporting/audits. Type 1 is enough for corrections or attributes where history is irrelevant; excess history adds complexity.

### T12. Why can `ORDER BY` on a huge table be dangerous?
Global sort requires shuffling all data to one stage/partition ordering and may be unnecessary; use `LIMIT`, top-N window functions, or sort within partitions.

### T13. Is real-time always better than batch?
No. Real-time costs more and is harder to operate. Choose latency based on decision value; micro-batch or hourly batch is often enough.

### T14. Why do two engines return different results for the same SQL?
Differences in NULL ordering, integer division, timestamp/timezone handling, decimal precision, string collation, and function semantics. Test critical logic on the target engine.

### T15. Do data quality tests guarantee correct data?
No. They catch known failure modes. Combine with reconciliation, anomaly detection, lineage and business validation.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- ETL transforms before load; ELT after.
- OLTP = transactions; OLAP = analytics.
- Parquet = columnar, compressed, pushdown.
- Star schema = fact + dimensions.
- Declare the grain first.
- SCD2 = history with valid_from/to.
- Idempotent = safe to rerun.
- Bronze → Silver → Gold.
- Spark: transformations lazy, actions eager.
- Shuffle is the expensive part.
- Broadcast small tables in joins.
- AQE fixes skew and partition counts.
- Compact small files.
- Kafka ordering is per partition.
- At-least-once + idempotent sink ≈ effectively-once.
- Watermark bounds lateness and state.
- CDC reads the transaction log.
- Schema registry prevents breaking changes.
- dbt = SQL + tests + lineage.
- Delta/Iceberg give ACID on object storage.
- Partition on filter columns, not high-cardinality keys.
- Reconcile counts and sums.
- Observe freshness, volume, schema, quality.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a data pipeline/platform you built
Use STAR: problem (slow, unreliable reporting) → design (CDC + Kafka → lakehouse bronze/silver/gold, dbt models, Airflow orchestration, quality tests, lineage) → scale (volume, latency, cost) → results (freshness from 24h to 15 min, 99.5% success, cost -35%) → lessons (contracts, backfill design).

### P2. A major data incident and how you handled it
Describe detection, impact analysis via lineage, containment (pause/rollback with time travel), root cause (upstream schema/unit change), fix and backfill, communication, and prevention (contracts, tests, alerts).

### P3. How did you optimise a slow or expensive pipeline?
Profile (Spark UI/query profile), identify bottleneck (skew, shuffle, scans), apply fixes (partition pruning, broadcast, incremental models, file compaction), and report before/after runtime and cost.

### P4. How do you ensure data quality?
Expectations at ingestion and transformation layers, contracts with producers, severity levels with quarantine, reconciliation against sources, monitoring and ownership, and feedback channels with consumers.

### P5. How do you handle conflicting stakeholder requests?
Clarify business goals and SLAs, quantify cost/benefit and effort, propose tiered solutions (quick win now, robust later), document decisions, and align through a prioritisation forum.

### P6. How do you mentor and set standards in a data team?
Templates and CI checks, code reviews on SQL/DAGs, pairing, runbooks, brown-bag sessions, ADRs, and clear definitions of done (tests, docs, monitoring).

### P7. How do you balance speed with governance?
Automate controls (tags, policies, tests), provide self-service paved roads, apply stricter controls to sensitive/high-impact data, and make compliance the easy path.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Fundamentals: roles, pipelines, ETL/ELT, batch vs streaming, OLTP vs OLAP, lake/warehouse/lakehouse.
- Modelling: normalisation, star/snowflake, Kimball, Data Vault, SCDs, grain, keys, medallion layers.
- SQL: joins, windows, CTEs, MERGE, optimisation, dialect differences.
- Storage & formats: Parquet/ORC/Avro/JSON/CSV, partitioning, clustering, compression, table formats (Delta/Iceberg/Hudi).
- Processing: Spark (RDD/DF/SQL, shuffle, skew, AQE, tuning), pandas/Polars/DuckDB, UDFs.
- Streaming: Kafka, Flink, Spark Structured Streaming, windows, watermarks, state, exactly-once, CDC.
- Orchestration: Airflow, Dagster, Prefect, scheduling, backfills, retries, SLAs.
- Transformation tooling: dbt, testing, snapshots, incremental models, semantic layers.
- Quality & governance: contracts, expectations, lineage, catalogues, observability, security, privacy, compliance.
- Platform & ops: cloud services, IaC, CI/CD, cost optimisation, DR, capacity planning, FinOps.
- AI/ML adjacency: feature pipelines, vector pipelines, training datasets, reverse ETL.

## Mixed topics
- CDC + Kafka + Delta MERGE + reconciliation.
- Spark skew + AQE + broadcast + file compaction.
- dbt incremental + late data + full-refresh strategy.
- Streaming dedupe + watermark + exactly-once sinks.
- Data contracts + schema registry + lineage + incident response.
- Cost governance + partition pruning + materialisation strategy.

---

# 🔬 Part 12: Internals

### Parquet file layout
File → row groups → column chunks → pages. Footer holds schema and row-group/column statistics (min/max, null counts). Readers prune row groups using stats and read only needed column chunks. Encodings: dictionary, RLE, bit-packing, delta; compression: Snappy/ZSTD/Gzip.

### Spark execution model
Logical plan → optimised plan (Catalyst: predicate pushdown, column pruning, join reordering) → physical plan → stages split at shuffle boundaries → tasks per partition scheduled on executors. Tungsten provides binary memory format and whole-stage codegen. AQE adjusts plans at stage boundaries.

### Shuffle internals
Map tasks write partitioned shuffle files (sorted/hashed) locally; reduce tasks fetch their blocks over the network (shuffle service). Spills occur when memory is insufficient. Push-based shuffle and remote shuffle services improve scale.

### Kafka internals
Topics split into partitions, each an append-only segmented log on disk with sparse indexes; leaders handle reads/writes, followers replicate (ISR). Consumers track offsets in `__consumer_offsets`. KRaft replaces ZooKeeper for metadata. Retention by time/size; compaction keeps the latest value per key.

### Delta/Iceberg transaction mechanics
Delta: JSON transaction log + periodic Parquet checkpoints; optimistic concurrency control with conflict detection. Iceberg: metadata files → manifest lists → manifests → data files with column stats; snapshots enable time travel; atomic commit by swapping the metadata pointer in the catalog.

### Flink checkpointing
Chandy–Lamport-style barriers flow through the dataflow; operators snapshot state to durable storage; on failure, restart from the last checkpoint and replay sources from stored offsets. Two-phase commit sinks give end-to-end exactly-once.

### Airflow architecture
Scheduler parses DAGs, creates DAG runs/task instances in the metadata DB; executor dispatches tasks to workers (Celery/Kubernetes); workers run operators; web server shows state. XCom stores small values in the metadata DB. Data interval semantics define what period a run covers.

### Columnar warehouse execution
Vectorised execution over column batches, partition/micro-partition pruning with metadata, dictionary-encoded scans, distributed MPP with shuffles for joins/aggregations, result and metadata caches.

### Query optimiser basics
Cost-based optimisers use table/column statistics (cardinality, NDV, histograms) to choose join order and algorithms. Stale statistics produce bad plans: refresh stats (`ANALYZE`, auto-stats).

### Watermark algorithm
Watermark = max observed event time − allowed delay; windows with end ≤ watermark are finalised, state for them is dropped, and later events for those windows are discarded or routed to side outputs.

---

# 📊 Part 13: Reference Tables

### Batch vs streaming trade-offs
| Aspect | Batch | Streaming |
|---|---|---|
| Latency | Minutes–hours | Seconds–sub-second |
| Complexity | Lower | Higher (state, ordering, lateness) |
| Cost | Efficient bursts | Always-on resources |
| Reprocessing | Simple | Replay from log required |
| Best for | Reports, ML training sets | Alerts, personalisation, monitoring |

### File format comparison
| Format | Schema | Columnar | Splittable | Best use |
|---|---|---|---|---|
| CSV | No | No | Yes (uncompressed) | Exchange |
| JSON | Loose | No | Line-delimited yes | APIs, raw logs |
| Avro | Embedded | No | Yes | Kafka, row-wise pipelines |
| Parquet | Embedded | Yes | Yes | Analytics lakes |
| ORC | Embedded | Yes | Yes | Hive ecosystems |

### Join strategy guide (Spark)
| Situation | Strategy |
|---|---|
| Small dim (≤ ~10–100 MB) | Broadcast hash join |
| Two large tables | Sort-merge join (consider bucketing) |
| Skewed key | AQE skew join / salting |
| Non-equi join | Broadcast nested loop (expensive) |

### Delivery guarantees
| Guarantee | Meaning | How |
|---|---|---|
| At-most-once | May lose | Commit before processing |
| At-least-once | May duplicate | Commit after processing |
| Exactly-once | No loss/dupes (scoped) | Idempotent/transactional producer + sink |

### SCD types
| Type | Behaviour | Use |
|---|---|---|
| 0 | Never changes | Static attributes |
| 1 | Overwrite | Corrections |
| 2 | New row per change | Full history |
| 3 | Previous value column | Limited history |
| 6 | Hybrid 1+2+3 | Current + history views |

### Orchestrator comparison
| Tool | Style | Strength |
|---|---|---|
| Airflow | Task DAGs | Ecosystem, maturity |
| Dagster | Software-defined assets | Testing, lineage |
| Prefect | Python flows | Simplicity, dynamic |
| ADF / Step Functions | Managed cloud | Integration |
| Argo / Kubeflow | K8s-native | Containers, ML |

### Data quality checks
| Check | Example |
|---|---|
| Schema | Columns/types match contract |
| Completeness | `order_id` null rate = 0 |
| Uniqueness | `order_id` unique |
| Validity | `amount` between 0 and 100000 |
| Referential | Every `customer_id` exists in dim |
| Freshness | Latest `updated_at` < 2 h old |
| Volume | Rows within ±30% of 7-day average |
| Distribution | PSI of key columns below threshold |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```sql
SELECT COUNT(*), COUNT(col) FROM (VALUES (1), (NULL), (3)) t(col);
```
**`3, 2`** (`COUNT(*)` counts rows; `COUNT(col)` ignores NULLs).

### O2.
Table A has keys `[1,1,2]`, table B has keys `[1,1,3]`. `INNER JOIN` on key returns **4 rows** (2×2 for key 1). `LEFT JOIN` returns **5 rows** (4 + 1 for key 2).

### O3.
```sql
SELECT ROW_NUMBER() OVER (ORDER BY x), RANK() OVER (ORDER BY x), DENSE_RANK() OVER (ORDER BY x)
FROM (VALUES (10),(10),(20)) t(x);
```
`ROW_NUMBER`: 1,2,3 • `RANK`: 1,1,3 • `DENSE_RANK`: 1,1,2.

### O4.
```sql
SELECT NULL = NULL, NULL IS NULL, COALESCE(NULL, 5);
```
**`NULL, TRUE, 5`**

### O5.
A 10 GB Parquet table partitioned by `dt` (365 partitions, ~27 MB each). A query filtering a single day scans about **27 MB** (one partition) plus only the selected columns, not 10 GB.

### O6.
Spark: `df.repartition(10).coalesce(2)` results in **2 partitions** (coalesce reduces without extra shuffle after the first repartition).

### O7.
Kafka topic with 6 partitions and a consumer group of 8 consumers: **6 consumers are active**, 2 are idle.

### O8.
Window of 5 minutes (tumbling) and an event at 10:07:30 → window **[10:05, 10:10)**. With a 10-minute watermark and max event time 10:20, windows ending ≤ **10:10** are finalised.

### O9.
Throughput estimate: 50 million events/day ≈ 579 events/s average; with a 5× peak factor ≈ **2,900 events/s** to design for.

### O10.
Storage estimate: 1 KB per event × 50M/day = 50 GB/day raw; Parquet+ZSTD at ~5:1 compression ≈ **10 GB/day**, ≈ 3.65 TB/year.

### O11.
Airflow `@daily` run with `data_interval_start=2025-05-01`, `data_interval_end=2025-05-02` executes **after** 2025-05-02 00:00 and processes the 1 May data.

### O12.
dbt incremental model with `unique_key='order_id'` and a source row updated later with the same `order_id`: the row is **updated (merged)**, not duplicated.

---

# ✅ Part 15: MCQs

**1. Which format is columnar and supports predicate pushdown?**
A) CSV  B) JSON  C) Parquet  D) XML
**Answer: C**

**2. In a star schema, measurements such as revenue live in:**
A) Dimension tables  B) Fact tables  C) Lookup caches  D) Staging only
**Answer: B**

**3. SCD Type 2 preserves history by:**
A) Overwriting values  B) Adding new rows with validity ranges  C) Dropping old rows  D) Adding one extra column only
**Answer: B**

**4. What makes a pipeline step idempotent?**
A) It runs faster  B) Re-running yields the same result without duplicates  C) It uses Spark  D) It runs hourly
**Answer: B**

**5. Which Spark operation triggers execution?**
A) `select`  B) `filter`  C) `count`  D) `withColumn`
**Answer: C**

**6. Best fix for a small dimension table joined to a huge fact in Spark:**
A) Sort-merge join with more shuffles  B) Broadcast join  C) Cartesian join  D) Collect to driver
**Answer: B**

**7. Kafka guarantees ordering:**
A) Across the whole topic  B) Within a partition  C) Across consumer groups  D) Never
**Answer: B**

**8. A watermark in streaming is used to:**
A) Encrypt data  B) Bound lateness and finalise windows/state  C) Speed up Kafka  D) Compress files
**Answer: B**

**9. CDC typically reads from:**
A) Application logs  B) Database transaction log  C) CSV exports  D) BI dashboards
**Answer: B**

**10. The small files problem is best solved by:**
A) More partitions  B) Compaction / larger file targets  C) Using CSV  D) Disabling AQE
**Answer: B**

**11. Which table format provides ACID transactions on object storage?**
A) Plain Parquet folder  B) Delta Lake / Iceberg / Hudi  C) CSV  D) Avro files only
**Answer: B**

**12. Which is a wide transformation (causes shuffle)?**
A) `filter`  B) `map`  C) `groupBy().agg()`  D) `select`
**Answer: C**

**13. Medallion architecture layers are:**
A) Raw, Clean, Final  B) Bronze, Silver, Gold  C) Source, Hub, Link  D) Stage, Dim, Fact
**Answer: B**

**14. dbt `ref()` is used to:**
A) Reference external APIs  B) Declare model dependencies and build lineage  C) Schedule jobs  D) Create indexes
**Answer: B**

**15. Which approach prevents breaking schema changes between producers and consumers?**
A) Hope  B) Schema registry with compatibility checks and data contracts  C) Larger clusters  D) CSV exports
**Answer: B**

**16. Exactly-once end to end requires:**
A) Only Kafka  B) Idempotent or transactional sinks plus coordinated offsets/checkpoints  C) More partitions  D) Faster networks
**Answer: B**

**17. Which tool is primarily an orchestrator?**
A) Airflow  B) Parquet  C) Debezium  D) Great Expectations
**Answer: A**

**18. Partitioning a table by a high-cardinality column like `user_id` typically causes:**
A) Better pruning always  B) Too many small partitions/files  C) Less metadata  D) Faster writes
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Building non-idempotent pipelines (append-only reruns create duplicates).
- Using ingestion time instead of event time for business metrics.
- Over-partitioning and creating millions of small files.
- `SELECT *` and full-table scans in cloud warehouses.
- Ignoring data skew and null join keys.
- Python UDFs everywhere in Spark when built-ins exist.
- No schema contract or registry; surprise breaking changes.
- Treating quality tests as optional; no alerts or ownership.
- Hard-coded dates/paths instead of parameterised data intervals.
- Mixing time zones; storing local time without zone.
- Running heavy analytics on OLTP replicas or primaries.
- Keeping only transformed data (no replayable raw layer).
- Using XCom/Airflow workers for heavy compute.
- Choosing streaming when hourly batch suffices.
- No backfill strategy or reconciliation against sources.
- Ignoring PII classification, retention and access controls.
- Not monitoring cost per pipeline/query.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You ask about consumers, SLAs, grain and freshness before designing pipelines.
- You design idempotent, replayable, backfill-friendly pipelines with immutable raw data.
- You read Spark/warehouse plans and fix skew, shuffles, scans and small files with evidence.
- You use contracts, schema registries, quality gates and lineage to prevent and contain incidents.
- You choose batch vs streaming, ETL vs ELT, and table formats using trade-offs, not trends.
- You reconcile data across systems and can prove correctness.
- You treat cost, security, privacy and governance as design requirements.
- You automate with CI/CD, IaC and tests; you document ownership and runbooks.
- You communicate in business impact: freshness, trust, cost and risk.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Reference pipeline
```
Sources → ingest (CDC/batch/stream) → Bronze (raw, immutable)
 → validate + clean + dedupe → Silver (typed, conformed)
 → model (facts/dims, marts) → Gold (business-ready)
 → serve (BI, APIs, features, reverse ETL)
Cross-cutting: orchestration • quality • lineage/catalog • security • observability • cost
```

### SQL patterns to know
Dedupe with `ROW_NUMBER()` • top-N per group • running totals • `LAG/LEAD` deltas • sessionization • gaps-and-islands • SCD2 `MERGE` • anti-join for missing rows • cohort retention • percentile/approx distinct.

### Spark tuning quick list
AQE on • filter/select early • broadcast small side • avoid UDFs • handle skew • right partition counts (~128 MB) • cache only reused data • compact output files • use Parquet/Delta • inspect Spark UI (skew, spill, GC).

### Streaming quick list
Event time + watermark • idempotent sink or transactional commits • checkpointing • key by entity • monitor lag/state size • plan replay/backfill • schema registry.

### Quality & governance quick list
Schema/null/unique/range/freshness/volume checks • contracts • owners • lineage • PII classification • RBAC + masking • retention • audit logs • cost tags.

### Final checklist before the interview
- [ ] Explain ETL vs ELT, OLTP vs OLAP, lake vs warehouse vs lakehouse.
- [ ] Model a business process with star schema, grain, SCD2.
- [ ] Write advanced SQL: windows, dedupe, sessionisation, MERGE, optimisation.
- [ ] Explain Parquet, partitioning, table formats (Delta/Iceberg/Hudi), small files.
- [ ] Explain Spark internals: shuffle, joins, skew, AQE, tuning, UI.
- [ ] Explain Kafka (partitions, offsets, delivery semantics) and streaming (windows, watermarks, state, exactly-once).
- [ ] Design CDC and incremental pipelines that are idempotent and backfillable.
- [ ] Use Airflow/Dagster/dbt with tests, CI/CD and IaC.
- [ ] Cover data quality, contracts, lineage, security, privacy and cost control.
- [ ] Prepare a project story with scale, architecture, incident lesson and measurable results.
