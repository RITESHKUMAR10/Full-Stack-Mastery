# Elasticsearch Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Elasticsearch 8.x** (8.x is the baseline in interviews; 9.x is noted where it differs) with the official **JavaScript client (`@elastic/elasticsearch` 8.x)**, **Kibana Dev Tools** and `curl`. Features that matter in interviews are marked with the version they arrived in: removal of mapping types (7.0 / 8.0), security on by default (8.0), data streams and ILM (7.x), `kNN` / dense vector search (8.0), ES|QL (8.11+), `semantic_text` and the inference API (8.13+), synthetic `_source` and LogsDB index mode (8.x/9.x), and the `retriever` framework for hybrid search (8.14+). Licensing: Elastic relicensed from Apache 2.0 to SSPL/Elastic License in 2021 (AGPLv3 option added in 2024); **OpenSearch** is the AWS-led Apache-2.0 fork. Anything marked "verify" should be checked in the official docs (elastic.co/docs) for your exact version and deployment (self-managed, Elastic Cloud, Serverless). Examples use the sample name **Ritesh Kumar**.
> This file covers inverted indexes and analysis, mappings, the Query DSL (match, bool, term, range, nested), aggregations, relevance scoring (BM25), indexing and the write path, shards/replicas/cluster architecture, near-real-time search, pagination (`search_after`, PIT), performance tuning, ILM and data streams, the ELK/Elastic Stack (Beats, Logstash, Kibana), vector and hybrid search, security, operations and production practice. Relational comparisons refer to `026_SQL.md` to `029_SQLite.md`; the document-store comparison refers to `030_MongoDB.md`; caching refers to `031_Redis-and-Caching.md`.

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
- [Part 12: Elasticsearch Internals](#-part-12-elasticsearch-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Elasticsearch?
A distributed, RESTful **search and analytics engine** built on **Apache Lucene**. It stores JSON documents, indexes every field in an **inverted index** by default, and returns results in near real time. Use cases: full-text search, log and metrics analytics, observability, security analytics (SIEM), e-commerce search, autocomplete, geo search and, more recently, vector/semantic search for AI. Created by Shay Banon (2010); maintained by Elastic.

### Q2. What is the Elastic Stack (ELK)?
- **Elasticsearch**: storage, search, analytics.
- **Logstash**: server-side data processing pipeline (input → filter → output).
- **Kibana**: UI for search, dashboards (Lens), Dev Tools, alerting.
- **Beats / Elastic Agent**: lightweight shippers (Filebeat, Metricbeat, Packetbeat) managed through Fleet.
The stack is usually called **ELK** (older) or the Elastic Stack.

### Q3. Why use Elasticsearch instead of a SQL database for search? *(Must-know)*
SQL `LIKE '%term%'` cannot use a normal B-tree index and has no relevance ranking, stemming, typo tolerance or synonyms. Elasticsearch uses an **inverted index** (term → documents), analyzers, BM25 relevance scoring, fuzzy matching, facets and horizontal scaling. It is a **secondary, derived** store: keep the system of record in a database and index a searchable copy.

### Q4. SQL vs Elasticsearch terminology *(Must-know)*
| Relational | Elasticsearch |
|---|---|
| Database | Cluster (and indices) |
| Table | Index |
| Row | Document (JSON) |
| Column | Field |
| Schema | Mapping |
| `SELECT ... WHERE` | Query DSL / ES|QL / SQL |
| `GROUP BY` | Aggregations |
| Index (B-tree) | Inverted index / doc values / BKD tree |
| Partition | Shard |
| Replication | Replica shards |
Mapping types (`_type`) were removed in 7.x/8.0: one index = one document structure.

### Q5. What is a document and an index?
A **document** is a JSON object with an `_id`, stored in an **index** (a logical namespace of documents split into shards). Metadata fields: `_index`, `_id`, `_source` (original JSON), `_version`, `_seq_no`, `_primary_term`.
```json
{
  "name": "Ritesh Kumar",
  "email": "ritesh@example.com",
  "skills": ["node", "elasticsearch"],
  "joined": "2025-10-24T10:00:00Z"
}
```

### Q6. What is an inverted index? *(Must-know)*
A data structure mapping each unique **term** to the list of documents (and positions) that contain it, like a book's back-of-the-book index.
```
Doc1: "quick brown fox"       term    → docs
Doc2: "quick red fox"         quick   → [1, 2]
Doc3: "lazy brown dog"        brown   → [1, 3]
                              fox     → [1, 2]
```
A query for `quick fox` looks up two terms and intersects/unions posting lists instead of scanning every document.

### Q7. Install and connect
```bash
docker run -d --name es -p 9200:9200 -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.15.0
curl http://localhost:9200
curl -u elastic:$ELASTIC_PASSWORD --cacert http_ca.crt https://localhost:9200
```
Default HTTP port **9200**, transport (node-to-node) port **9300**. In 8.x security (TLS + auth) is **on by default**; disabling it is only for local development.

### Q8. Basic CRUD with the REST API *(Must-know)*
```http
PUT   /users/_doc/1            { "name": "Ritesh Kumar", "age": 28 }     // create/replace with id
POST  /users/_doc              { "name": "Amit", "age": 30 }             // auto-generated id
GET   /users/_doc/1
POST  /users/_update/1         { "doc": { "age": 29 } }                   // partial update
DELETE /users/_doc/1
GET   /users/_search           { "query": { "match_all": {} } }
```
Documents are **immutable** in Lucene segments: an update re-indexes the whole document (new version) and marks the old one deleted.

### Q9. Index, shard, replica *(Must-know)*
An index is split into **primary shards** (each is a self-contained Lucene index). Each primary can have **replica shards** (copies) on other nodes, giving high availability and extra read throughput. In 8.x the default is 1 primary and 1 replica. The number of primary shards is fixed at creation (change via split/shrink/reindex); replicas can be changed anytime.
```http
PUT /products
{ "settings": { "number_of_shards": 3, "number_of_replicas": 1 } }
```

### Q10. What is a node and a cluster?
A **node** is one running Elasticsearch instance (JVM). A **cluster** is a group of nodes with the same `cluster.name` that share data and work. Roles: master-eligible, data (hot/warm/cold/frozen/content), ingest, coordinating (client), machine learning, transform, remote cluster client.

### Q11. Cluster health: green, yellow, red *(Must-know)*
```http
GET _cluster/health
GET _cat/indices?v
GET _cat/shards?v
```
- **Green**: all primaries and replicas allocated.
- **Yellow**: all primaries allocated, some replicas missing (common on a single node, since a replica cannot live on the same node as its primary).
- **Red**: at least one primary shard unassigned (some data unavailable).

### Q12. What is a mapping?
The schema: field names, data types and how they are indexed. Two modes: **dynamic mapping** (Elasticsearch guesses types) and **explicit mapping** (you define them). Prefer explicit mappings in production to avoid wrong guesses (for example a numeric-looking string).
```http
PUT /products
{
  "mappings": {
    "properties": {
      "name":    { "type": "text" },
      "sku":     { "type": "keyword" },
      "price":   { "type": "scaled_float", "scaling_factor": 100 },
      "created": { "type": "date" },
      "tags":    { "type": "keyword" },
      "location":{ "type": "geo_point" }
    }
  }
}
```
An existing field's type **cannot be changed**: create a new index and reindex.

### Q13. `text` vs `keyword` *(Must-know)*
| | `text` | `keyword` |
|---|---|---|
| Analyzed (tokenized) | Yes | No (exact value) |
| Used for | Full-text search (`match`) | Filtering, sorting, aggregations, exact match (`term`) |
| Example | Product description | Email, status, SKU, country code |
A string field dynamically mapped gets `text` plus a `.keyword` sub-field (`ignore_above: 256`). Use **multi-fields** to have both.

### Q14. Common field types
`text`, `keyword`, `long/integer/short/byte`, `double/float/scaled_float`, `boolean`, `date`, `object`, `nested`, `geo_point/geo_shape`, `ip`, `binary`, `dense_vector`, `completion`, `search_as_you_type`, `flattened`, `join`, `alias`, range types (`integer_range`, `date_range`), `percolator`, `semantic_text`.

### Q15. What is analysis? *(Must-know)*
The process that converts text into terms at index time and query time. An **analyzer** = zero or more **character filters** → one **tokenizer** → zero or more **token filters**.
```http
POST _analyze
{ "analyzer": "standard", "text": "The Quick-Brown Foxes!" }
// tokens: the, quick, brown, foxes
POST _analyze
{ "tokenizer": "standard", "filter": ["lowercase","stop","stemmer"], "text": "Running dogs" }
```
Built-in analyzers: `standard`, `simple`, `whitespace`, `stop`, `keyword`, `pattern`, language analyzers (`english`, `french`...).

### Q16. Basic search queries
```http
GET /products/_search
{ "query": { "match": { "name": "wireless headphones" } } }

GET /products/_search
{ "query": { "term": { "sku": "SKU-1001" } } }

GET /products/_search
{ "query": { "range": { "price": { "gte": 1000, "lte": 5000 } } } }

GET /products/_search
{ "query": { "match_phrase": { "name": "noise cancelling" } } }
```
`match` analyzes the query text (OR of terms by default); `term` does not analyze (use it on `keyword`, numbers, dates, booleans, not on `text`).

### Q17. `match` vs `term` pitfall *(Must-know)*
Indexing "Quick Fox" in a `text` field stores terms `quick`, `fox`. A `term` query for `"Quick"` finds nothing because the stored term is lowercase. Fix: use `match`, or query a `keyword` sub-field (`name.keyword`) for the exact string.

### Q18. The `bool` query *(Must-know)*
```http
GET /products/_search
{
  "query": {
    "bool": {
      "must":     [ { "match": { "name": "laptop" } } ],
      "filter":   [ { "term": { "in_stock": true } }, { "range": { "price": { "lte": 80000 } } } ],
      "should":   [ { "term": { "brand": "dell" } } ],
      "must_not": [ { "term": { "status": "discontinued" } } ],
      "minimum_should_match": 0
    }
  }
}
```
- `must`: must match, contributes to score.
- `filter`: must match, **no scoring**, cacheable (use for structured conditions).
- `should`: optional, boosts score (required if no `must`/`filter`).
- `must_not`: exclusion, no scoring.

### Q19. Query context vs filter context *(Must-know)*
Query context asks "how well does it match?" (computes `_score`). Filter context asks "does it match?" (yes/no, no score, results cached in the filter cache, faster). Put exact conditions (status, dates, ranges, tags) in `filter`.

### Q20. Sorting, pagination, source filtering
```http
GET /products/_search
{
  "query": { "match_all": {} },
  "sort": [ { "price": "asc" }, { "_score": "desc" } ],
  "from": 0, "size": 20,
  "_source": ["name", "price"],
  "track_total_hits": true
}
```
Sorting on `text` fields is not allowed (use `keyword`). `from + size` is limited by `index.max_result_window` (default 10,000). Hits total is capped at 10,000 unless `track_total_hits: true`.

### Q21. Relevance scoring: TF-IDF → BM25
Default similarity since 5.0 is **BM25**. Score depends on **term frequency** in the document (with saturation), **inverse document frequency** (rare terms weigh more), and **field length normalization** (matches in short fields score higher). Tunable via `k1` (term-frequency saturation) and `b` (length normalization). Debug with `"explain": true` or `_explain` API.

### Q22. Basic aggregations
```http
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "by_status": { "terms": { "field": "status" } },
    "avg_amount": { "avg": { "field": "amount" } },
    "per_day": { "date_histogram": { "field": "created", "calendar_interval": "day" } }
  }
}
```
Types: **metric** (`avg`, `sum`, `min`, `max`, `stats`, `cardinality`, `percentiles`), **bucket** (`terms`, `range`, `histogram`, `date_histogram`, `filters`), **pipeline** (`derivative`, `moving_avg`, `bucket_sort`). Aggregations run on **doc values**, so the field must be `keyword`/numeric/date (not analyzed `text`).

### Q23. Bulk API *(Must-know)*
```http
POST _bulk
{ "index":  { "_index": "users", "_id": "1" } }
{ "name": "Ritesh Kumar" }
{ "create": { "_index": "users", "_id": "2" } }
{ "name": "Amit" }
{ "update": { "_index": "users", "_id": "1" } }
{ "doc": { "age": 29 } }
{ "delete": { "_index": "users", "_id": "2" } }
```
NDJSON body (each line ends with `\n`, including the last). Bulk is far faster than single requests; aim for ~5-15 MB per bulk, tune empirically. Check the response `errors` flag and per-item status: HTTP 200 can still contain failed items.

### Q24. Near real-time (NRT) search *(Must-know)*
New documents are not immediately searchable. They are written to an in-memory buffer and translog, then **refreshed** into a new searchable Lucene segment every `refresh_interval` (default **1 s**). So search is *near* real-time. `GET /index/_doc/id` is real-time (reads the translog); `_search` is not unless you refresh.
```http
POST /products/_doc?refresh=wait_for        // wait until visible
POST /products/_refresh
```

### Q25. Segments, flush, merge, translog (overview)
Each refresh creates an immutable **segment**; background **merges** combine small segments and purge deleted docs. The **translog** is a write-ahead log for durability between Lucene commits; a **flush** performs a Lucene commit and clears the translog. Details in Q76 and Part 12.

### Q26. Node.js client
```js
import { Client } from "@elastic/elasticsearch";
const es = new Client({
  node: process.env.ES_URL,                         // https://localhost:9200
  auth: { apiKey: process.env.ES_API_KEY },
  tls: { ca: fs.readFileSync("http_ca.crt") },
});

await es.index({ index: "users", id: "1", document: { name: "Ritesh Kumar" }, refresh: "wait_for" });
const res = await es.search({ index: "users", query: { match: { name: "ritesh" } } });
console.log(res.hits.hits.map(h => h._source));
```
Create one client per process; it keeps connections alive and load-balances across nodes.

### Q27. Count, exists, multi-get, delete by query
```http
GET /users/_count { "query": { "term": { "active": false } } }
HEAD /users/_doc/1
GET /_mget { "docs": [ { "_index": "users", "_id": "1" }, { "_index": "users", "_id": "2" } ] }
POST /users/_delete_by_query { "query": { "range": { "last_login": { "lt": "now-1y" } } } }
POST /users/_update_by_query { "script": { "source": "ctx._source.active = false" }, "query": { "match_all": {} } }
```
By-query APIs take a snapshot, run in batches, and are not atomic across documents.

### Q28. Index aliases
```http
POST _aliases
{ "actions": [
  { "remove": { "index": "products_v1", "alias": "products" } },
  { "add":    { "index": "products_v2", "alias": "products" } }
] }
```
An alias is a pointer to one or more indices; the swap is atomic. Applications query the alias, enabling zero-downtime reindexing and filtered/routing aliases.

### Q29. Multi-match and fuzzy search
```http
GET /products/_search
{ "query": { "multi_match": { "query": "wireles hedphones", "fields": ["name^3", "description"], "fuzziness": "AUTO" } } }
```
`^3` boosts `name` three times. `fuzziness: AUTO` allows 0/1/2 edits depending on term length (Levenshtein distance) for typo tolerance.

### Q30. Highlighting and suggestions
```http
GET /articles/_search
{ "query": { "match": { "body": "elasticsearch" } }, "highlight": { "fields": { "body": {} } } }
```
Suggesters: `term`, `phrase` ("did you mean"), `completion` (fast autocomplete, in-memory FST). `search_as_you_type` field and `match_bool_prefix` are simpler autocomplete options.

### Q31. Index lifecycle basics
Time-based data (logs) is stored in rolling indices or **data streams**; old indices are moved to cheaper nodes, shrunk, force-merged and eventually deleted by **ILM** (Index Lifecycle Management) with phases hot → warm → cold → frozen → delete.

### Q32. Is Elasticsearch a database?
It can store data and persist it with replicas and snapshots, but it is not ACID, has no multi-document transactions, offers eventual visibility (NRT), and has historically needed careful handling for split-brain/consistency. Treat it as a **search index** fed from a system of record, rebuildable from the source.

### Q33. REST API conventions
Format: `<HTTP verb> /<index>/<endpoint>/<id>`. Use `?pretty` for readable output, `?filter_path=hits.hits._source` to trim responses, and `_cat` APIs for human-readable tables (`_cat/nodes?v`, `_cat/health?v`).

---

# 🔵 Part 2: Junior (1–3 years)

### Q34. Analyzers in depth: custom analyzers *(Must-know)*
```http
PUT /articles
{
  "settings": {
    "analysis": {
      "char_filter": { "strip_html": { "type": "html_strip" } },
      "filter": {
        "english_stop": { "type": "stop", "stopwords": "_english_" },
        "my_synonyms":  { "type": "synonym", "synonyms": ["laptop, notebook", "tv, television"] }
      },
      "analyzer": {
        "content_analyzer": {
          "type": "custom",
          "char_filter": ["strip_html"],
          "tokenizer": "standard",
          "filter": ["lowercase", "english_stop", "porter_stem"]
        }
      }
    }
  },
  "mappings": { "properties": { "body": { "type": "text", "analyzer": "content_analyzer", "search_analyzer": "standard" } } }
}
```
`analyzer` is used at index time; `search_analyzer` at query time (defaults to `analyzer`). Test any analyzer with `_analyze`.

### Q35. Tokenizers and token filters
Tokenizers: `standard`, `whitespace`, `keyword`, `pattern`, `ngram`, `edge_ngram`, `path_hierarchy`, `uax_url_email`. Token filters: `lowercase`, `stop`, `stemmer`/`porter_stem`, `synonym`/`synonym_graph`, `asciifolding`, `shingle`, `word_delimiter_graph`, `edge_ngram`, `phonetic`.

### Q36. Autocomplete approaches
1. **`edge_ngram` tokenizer/filter** at index time (type-ahead on prefixes) with a plain `standard` search analyzer.
2. **`search_as_you_type`** field type (built-in shingles + edge ngrams).
3. **`completion` suggester** (FST in memory, fastest, prefix only, weights).
```http
PUT /movies
{ "settings": { "analysis": {
    "filter":   { "edge": { "type": "edge_ngram", "min_gram": 2, "max_gram": 15 } },
    "analyzer": { "autocomplete": { "tokenizer": "standard", "filter": ["lowercase", "edge"] } } } },
  "mappings": { "properties": { "title": { "type": "text", "analyzer": "autocomplete", "search_analyzer": "standard" } } } }
```

### Q37. Dynamic mapping controls
`"dynamic": true` (default, adds fields), `"runtime"` (adds runtime fields), `false` (ignores unknown fields; still kept in `_source`), `"strict"` (rejects documents with unknown fields). **Dynamic templates** map new fields by name/type pattern:
```json
"dynamic_templates": [
  { "strings_as_keywords": { "match_mapping_type": "string", "mapping": { "type": "keyword", "ignore_above": 256 } } }
]
```
Mapping explosion: too many distinct field names (`index.mapping.total_fields.limit` default 1000) kills cluster state. Use `flattened` for arbitrary key sets.

### Q38. Object vs nested type *(Must-know)*
Arrays of objects are flattened by default, losing field correlation:
```json
{ "comments": [ { "user": "ritesh", "stars": 5 }, { "user": "amit", "stars": 1 } ] }
```
A query `user:ritesh AND stars:1` matches wrongly (cross-object match). Map `comments` as **`nested`** and query with the `nested` query:
```http
{ "query": { "nested": { "path": "comments", "query": { "bool": { "must": [
  { "term": { "comments.user": "ritesh" } }, { "term": { "comments.stars": 1 } } ] } } } } }
```
Each nested object is a hidden Lucene document: updates re-index the parent, and cost grows with count.

### Q39. Parent-child (`join`) vs nested vs denormalization
| | Nested | Join (parent-child) | Denormalization |
|---|---|---|---|
| Docs | Same Lucene block | Separate documents, same shard | Duplicated data |
| Update child | Re-index whole parent | Independent | Update everywhere |
| Query speed | Fast | Slower (join at query time) | Fastest |
| Use when | Few children, read-heavy | Many children, frequent child updates | Default for search |
Elasticsearch is not relational: prefer denormalizing at index time.

### Q40. Full-text query types
- `match`, `match_phrase`, `match_phrase_prefix`, `match_bool_prefix`
- `multi_match` types: `best_fields` (default), `most_fields`, `cross_fields`, `phrase`, `phrase_prefix`
- `query_string` / `simple_query_string` (user-facing query syntax; risky with untrusted input)
- `intervals`, `combined_fields`
Term-level: `term`, `terms`, `range`, `exists`, `prefix`, `wildcard`, `regexp`, `fuzzy`, `ids`.

### Q41. Term-level queries and performance
`wildcard`/`regexp`/`prefix` with a leading wildcard (`*foo`) scan the term dictionary and are slow; avoid or use the `wildcard` field type, `ngram` indexing, or reverse-field indexing. `terms` accepts up to `index.max_terms_count` (65,536) values.

### Q42. Boosting and function score
```http
{ "query": { "function_score": {
    "query": { "match": { "title": "laptop" } },
    "functions": [
      { "field_value_factor": { "field": "popularity", "modifier": "log1p", "factor": 2 } },
      { "gauss": { "created": { "origin": "now", "scale": "30d", "decay": 0.5 } } }
    ],
    "score_mode": "multiply", "boost_mode": "multiply" } } }
```
Combine text relevance with business signals (popularity, recency, distance). `boosting` query demotes instead of excluding. `rank_feature` fields give efficient static boosts.

### Q43. Pagination options *(Must-know)*
| Method | Use case | Notes |
|---|---|---|
| `from`/`size` | Shallow UI pages | Limit 10,000; deep pages cost O(from+size) per shard |
| `search_after` (+ PIT) | Deep/infinite scroll, consistent paging | Needs deterministic sort with tiebreaker (`_shard_doc`) |
| `scroll` | Legacy bulk export | Keeps a context open; replaced by PIT + `search_after` |
| `_async_search` | Long queries | Poll for results |
```http
POST /products/_pit?keep_alive=1m              // returns pit id
GET /_search
{ "size": 20, "pit": { "id": "<id>", "keep_alive": "1m" },
  "sort": [ { "price": "asc" }, { "_shard_doc": "asc" } ],
  "search_after": [ 1999, 4521 ] }
```

### Q44. Aggregations: terms accuracy and sub-aggregations
```http
{ "size": 0, "aggs": { "brands": { "terms": { "field": "brand", "size": 10 },
    "aggs": { "avg_price": { "avg": { "field": "price" } } } } } }
```
`terms` is computed per shard then merged; counts can be approximate (`doc_count_error_upper_bound`, `sum_other_doc_count`). Increase `shard_size` for accuracy. High-cardinality fields need `composite` aggregation for paging all buckets.

### Q45. `cardinality` and `percentiles` are approximate
`cardinality` uses HyperLogLog++ (tunable `precision_threshold`); `percentiles` uses t-digest/HDR. Good enough for analytics with a bounded error and constant memory.

### Q46. Doc values vs fielddata *(Must-know)*
**Doc values** are an on-disk, column-oriented structure (built at index time) used for sorting, aggregations and scripts on non-`text` fields. **Fielddata** is an in-heap structure for `text` fields, disabled by default because it can exhaust the heap; instead aggregate on a `keyword` sub-field. Disable doc values (`"doc_values": false`) only for fields never sorted/aggregated, to save disk.

### Q47. `_source`, stored fields, `_source` filtering
`_source` holds the original JSON and is needed for `update`, `reindex`, highlighting and returning fields. Excluding fields (`_source.excludes`) saves disk but breaks reindexing for them. 8.x/9.x **synthetic `_source`** reconstructs `_source` from doc values to reduce storage (with caveats on ordering/duplicates).

### Q48. Versioning and optimistic concurrency
Each write increments `_seq_no` within a `_primary_term`. Concurrent updates are protected with `if_seq_no` and `if_primary_term`:
```http
PUT /users/_doc/1?if_seq_no=7&if_primary_term=1 { "name": "Ritesh Kumar", "age": 30 }
```
A conflict returns **409 version_conflict_engine_exception**. External versioning (`version_type=external`) lets the source of truth supply the version.

### Q49. Scripted updates and upserts
```http
POST /users/_update/1
{ "script": { "source": "ctx._source.logins += params.n", "params": { "n": 1 } },
  "upsert": { "logins": 1 } }
```
Painless is the scripting language. Prefer `doc_as_upsert` and partial docs when scripts are not needed; avoid scripts in hot search paths (use runtime fields or precompute).

### Q50. Ingest pipelines
Pre-process documents on ingest nodes before indexing.
```http
PUT _ingest/pipeline/clean
{ "processors": [
  { "lowercase": { "field": "email" } },
  { "set": { "field": "ingested_at", "value": "{{_ingest.timestamp}}" } },
  { "grok": { "field": "message", "patterns": ["%{IP:client} %{WORD:method} %{URIPATHPARAM:path}"] } },
  { "date": { "field": "ts", "formats": ["ISO8601"] } },
  { "remove": { "field": "tmp", "ignore_missing": true } } ],
  "on_failure": [ { "set": { "field": "error", "value": "{{ _ingest.on_failure_message }}" } } ] }
POST /logs/_doc?pipeline=clean { ... }
```
Alternatives: Logstash (heavier, more plugins) or application-side transformation.

### Q51. Logstash basics
```conf
input  { beats { port => 5044 } }
filter { grok { match => { "message" => "%{COMBINEDAPACHELOG}" } } date { match => ["timestamp","dd/MMM/yyyy:HH:mm:ss Z"] } }
output { elasticsearch { hosts => ["https://es:9200"] index => "weblogs-%{+YYYY.MM.dd}" } }
```
Persistent queues and dead-letter queues improve resilience; use Beats/Elastic Agent for collection and Logstash for heavy transforms or routing.

### Q52. Kibana essentials
Discover (search), Lens/Visualize (charts), Dashboards, Dev Tools (console for REST), Stack Management (index patterns/data views, ILM, roles), Alerting, Maps, Observability and Security apps. Data views define which indices Kibana queries.

### Q53. Reindex API
```http
POST _reindex?wait_for_completion=false
{ "source": { "index": "products_v1", "size": 1000 },
  "dest":   { "index": "products_v2" },
  "script": { "source": "ctx._source.remove('legacy')" } }
GET _tasks/<task_id>
```
Use for mapping changes, analyzer changes, shard count changes. Pattern: create `v2` → reindex (or dual-write) → swap alias → delete `v1`. Throttle with `requests_per_second`; parallelize with `slices`.

### Q54. Split, shrink, clone
`_split` increases primary shards (multiple of original), `_shrink` reduces them (must be a factor; index read-only, shards on one node), `_clone` copies. Cheaper than reindex but constrained.

### Q55. Routing
Documents go to shard `hash(_routing) % number_of_primary_shards` (default `_routing = _id`). Custom routing (for example by tenant id) co-locates related documents so searches with the same routing hit one shard. Risk: skew/hot shards; set `index.routing_partition_size` or `routing.required`.

### Q56. Cluster allocation basics
The master assigns shards to nodes. Rules: a replica never shares a node with its primary; watermarks (`low` 85%, `high` 90%, `flood_stage` 95% disk) stop allocation and make indices read-only on flood stage; allocation awareness (zones/racks) spreads copies; `cluster.routing.allocation.*` settings, allocation filtering and `_cluster/allocation/explain` diagnose unassigned shards.

### Q57. Explain unassigned shards
```http
GET _cluster/allocation/explain
GET _cat/shards?v&h=index,shard,prirep,state,unassigned.reason
```
Typical reasons: node left, no matching data node (tier/attribute filter), disk watermark, too many shards per node (`cluster.max_shards_per_node`), corrupted shard, allocation disabled during a rolling restart.

### Q58. Snapshots and restore
```http
PUT _snapshot/s3_repo { "type": "s3", "settings": { "bucket": "my-es-backups" } }
PUT _snapshot/s3_repo/snap_2025_10_24?wait_for_completion=false
POST _snapshot/s3_repo/snap_2025_10_24/_restore { "indices": "orders-*", "rename_pattern": "(.+)", "rename_replacement": "restored-$1" }
```
Snapshots are incremental (segment-level). Replicas are **not** backups. Use SLM (snapshot lifecycle management) for schedules and retention.

### Q59. Security basics (8.x)
Security is enabled by default: TLS on HTTP and transport, the `elastic` superuser, enrollment tokens for Kibana and nodes. Use **RBAC** (roles with index/field/document-level security), **API keys** for apps, SSO (SAML/OIDC), audit logging. Never expose 9200/9300 publicly.
```http
POST _security/role/orders_reader { "indices": [ { "names": ["orders-*"], "privileges": ["read"], "field_security": { "grant": ["*"], "except": ["card_*"] } } ] }
POST _security/api_key { "name": "web-app", "role_descriptors": { ... } }
```

### Q60. Elasticsearch SQL and ES|QL
```http
POST _sql?format=txt { "query": "SELECT brand, AVG(price) FROM products GROUP BY brand ORDER BY 2 DESC LIMIT 5" }
POST _query { "query": "FROM logs-* | WHERE @timestamp > NOW() - 1 hour | STATS count = COUNT(*) BY host.name | SORT count DESC | LIMIT 10" }
```
**ES|QL** (8.11+, GA in 8.14) is a piped query language executed in a distributed engine, increasingly the way to run analytics in Kibana.

### Q61. Geo queries
```http
{ "query": { "bool": { "filter": { "geo_distance": { "distance": "5km", "location": { "lat": 28.61, "lon": 77.21 } } } } },
  "sort": [ { "_geo_distance": { "location": { "lat": 28.61, "lon": 77.21 }, "order": "asc", "unit": "km" } } ] }
```
Types: `geo_point`, `geo_shape`; queries: `geo_distance`, `geo_bounding_box`, `geo_polygon`, `geo_shape`. Aggregations: `geohash_grid`, `geotile_grid`.

### Q62. Index templates and component templates
```http
PUT _component_template/mappings_base { "template": { "mappings": { "properties": { "@timestamp": { "type": "date" } } } } }
PUT _index_template/logs_tpl { "index_patterns": ["logs-app-*"], "data_stream": {}, "composed_of": ["mappings_base"], "priority": 200, "template": { "settings": { "number_of_shards": 1 } } }
```
Templates apply settings/mappings automatically to new indices matching a pattern; the highest-priority template wins.

### Q63. Data streams
An append-only abstraction over time-series data: a single name (`logs-app-prod`) backed by hidden, auto-rolled-over **backing indices** (`.ds-logs-app-prod-2025.10.24-000001`), requiring a `@timestamp` field and only `create` operations. Replaces manual write aliases; integrates with ILM and TSDS (time series data streams).

### Q64. Rollover and ILM policy
```http
PUT _ilm/policy/logs_policy
{ "policy": { "phases": {
  "hot":    { "actions": { "rollover": { "max_primary_shard_size": "50gb", "max_age": "7d" }, "set_priority": { "priority": 100 } } },
  "warm":   { "min_age": "7d",  "actions": { "shrink": { "number_of_shards": 1 }, "forcemerge": { "max_num_segments": 1 } } },
  "cold":   { "min_age": "30d", "actions": { "searchable_snapshot": { "snapshot_repository": "s3_repo" } } },
  "delete": { "min_age": "90d", "actions": { "delete": {} } } } } }
```

### Q65. Basic performance tips for indexing
Use `_bulk`; temporarily set `refresh_interval: 30s` or `-1` and `number_of_replicas: 0` during big loads; auto-generated ids are faster than custom ids; avoid unnecessary fields/indexing (`index: false`, `doc_values: false`, `enabled: false`); right-size shards; use SSDs; parallelize clients with back-pressure on `429 es_rejected_execution_exception`.

### Q66. Basic performance tips for search
Use `filter` context and caching; return only needed `_source`; avoid wildcards with leading `*`; avoid deep pagination; prefer `keyword` for exact filters; pre-compute (rollups, runtime vs indexed fields); limit aggregation cardinality; use `routing`; keep shards moderately sized and force-merge read-only indices; use `preference` for consistent shard copy selection.

---

# 🟡 Part 3: Mid (3–5 years)

### Q67. Cluster architecture and node roles *(Must-know)*
| Role | Purpose |
|---|---|
| Master-eligible | Cluster state, index creation, shard allocation (elected master) |
| Data (hot/warm/cold/frozen/content) | Stores shards, runs search/indexing |
| Ingest | Runs ingest pipelines |
| Coordinating-only | Routes requests, reduces results (no data/master) |
| ML / Transform | Machine learning and transforms |
Production: **3 dedicated master-eligible nodes** (odd number for quorum), separate data tiers, optional coordinating nodes. Every node can act as a coordinating node for the requests it receives.

### Q68. How a search request executes (query-then-fetch) *(Must-know)*
1. The request hits a **coordinating node**.
2. **Query phase**: it forwards to one copy (primary or replica) of every relevant shard; each shard runs the query and returns a priority queue of `from+size` doc ids and scores.
3. The coordinator merges and sorts globally.
4. **Fetch phase**: it requests the actual `_source` for the final top `size` ids from the owning shards.
5. It assembles and returns the response.
Deep pagination makes each shard return `from+size` entries: costly.

### Q69. How an index (write) request executes *(Must-know)*
1. Request reaches any node (coordinating); the shard is chosen by `hash(routing) % primary_shards`.
2. The request goes to the **primary shard**, which validates, indexes into Lucene's in-memory buffer, and appends to the **translog**.
3. The primary forwards the operation to **in-sync replicas** in parallel.
4. When all in-sync copies acknowledge (`wait_for_active_shards`, default 1), the response returns.
5. A later **refresh** makes the doc searchable.

### Q70. The in-sync copies, sequence numbers and global checkpoint
Each operation has a `_seq_no`. The primary tracks the **in-sync allocation IDs** and the **global checkpoint** (highest seq no. acknowledged by all in-sync copies). On recovery, a replica only needs operations after its local checkpoint (sequence-number-based recovery) instead of copying all segment files.

### Q71. Master election and split brain
Since 7.0 the **Zen2** coordination layer uses a Raft-like quorum-based voting configuration that adapts automatically as master-eligible nodes join/leave; `minimum_master_nodes` is no longer needed. With 3 master-eligible nodes you tolerate 1 failure. Two master-eligible nodes give no extra safety. Never run an even number of masters expecting HA.

### Q72. Cluster state
A metadata structure (indices, mappings, settings, shard routing, templates) held by every node and published by the master. Large cluster state (too many indices/fields/shards) slows master updates and every node. Keep shard and field counts under control.

### Q73. Shard sizing and count *(Must-know)*
Guidance: aim for shards of roughly **10-50 GB** (up to ~50 GB for time-series/log shards), and **≤ ~20 shards per GB of heap** on a node. Too many small shards waste heap and slow the master; too few large shards slow recovery and rebalancing and limit parallelism. Plan shards from data volume × growth ÷ target size; use rollover by size (`max_primary_shard_size`) rather than by guesswork.

### Q74. Oversharding symptoms and fixes
Symptoms: high heap use at low data volume, slow cluster-state updates, long startup, `max shards open` errors. Fix: fewer primaries per index, rollover by size, shrink/force-merge old indices, merge small daily indices into monthly, use data streams with ILM, and remove unnecessary replicas on cold data.

### Q75. JVM heap and memory
Set heap (`-Xms` = `-Xmx`) to ~50% of RAM but **≤ ~30-31 GB** to keep compressed object pointers (`compressed oops`); Elasticsearch auto-sizes heap in recent versions. The rest of RAM goes to the OS **file system cache**, which Lucene depends on heavily. Use G1GC (default), avoid swapping (`bootstrap.memory_lock: true` or disable swap), set `vm.max_map_count=262144`.

### Q76. Lucene segments, merges and the translog *(Must-know)*
- Writes accumulate in an in-memory **indexing buffer**; **refresh** writes a new immutable **segment** (searchable but not fsynced).
- The **translog** records each operation and is fsynced per request (`index.translog.durability: request`, default) or every 5 s (`async`).
- **Flush** = Lucene commit (fsync segments) + translog truncation.
- **Merge** (background, `TieredMergePolicy`) combines segments and permanently removes deleted/updated docs; **force merge** to 1 segment suits read-only indices.
Many tiny segments hurt search; deletions only free space after merges.

### Q77. Refresh interval tuning
Default 1 s is for near-real-time UX. For bulk loads or log ingestion, 30 s or `-1` (manual) greatly reduces segment churn. Indices with no search in 30 s skip refreshes (`search.idle.after`). Don't call `_refresh` per document.

### Q78. Indexing throughput tuning checklist
Bulk size 5-15 MB; multiple parallel workers; `refresh_interval` 30-60 s; replicas 0 during initial load (then raise); `translog.durability: async` only if loss of the last seconds is acceptable; avoid custom `_id` when not needed; disable unneeded `_source` fields or doc values; minimize analyzed fields; increase `indices.memory.index_buffer_size` for heavy writers; use SSD/NVMe; watch `write` thread pool queue and `429` responses.

### Q79. Search latency tuning checklist
Filter context; right analyzers; avoid scripts/regex/leading wildcard; cap aggregation `size` and avoid high-cardinality `terms` on huge indices; use `eager_global_ordinals` on frequently aggregated keyword fields; routing; `search.max_buckets`; preference; adaptive replica selection (on by default); request cache (`size:0` aggregations); warm file cache with enough RAM; profile with `"profile": true`.

### Q80. Caches
- **Node query cache**: caches filter results per segment (LRU, 10% heap default).
- **Shard request cache**: caches full shard-level results of `size: 0` requests (aggregations, counts); invalidated on refresh.
- **Fielddata cache**: for text fielddata (avoid).
- **OS page cache**: the most important for Lucene.

### Q81. Circuit breakers
Protect the JVM from OOM: parent (95% heap), request, fielddata, in-flight requests, accounting breakers. A `CircuitBreakingException` / HTTP 429 means a request was rejected as too memory-hungry. Fix the cause (huge aggregations, deep pagination, giant bulk) rather than raising limits blindly.

### Q82. Thread pools and rejections
Pools: `search`, `write`, `get`, `snapshot`, `management`, `generic`, etc., each with a size and queue. When a queue is full: `es_rejected_execution_exception` (429). Respond with client back-off/retry, reduce concurrency, add nodes, optimize queries. Monitor `_cat/thread_pool?v`.

### Q83. Replica count: HA vs read scaling vs cost
Replicas add availability and read throughput but multiply storage and indexing work (each op is applied on every copy). One replica is standard; zero is acceptable for rebuildable data or during bulk loads. Use `auto_expand_replicas` for small system indices.

### Q84. Data tiers
`data_hot`, `data_warm`, `data_cold`, `data_frozen`, `data_content`. Hot: fastest SSDs for ingest/recent search. Warm/cold: cheaper storage, fewer replicas. Frozen: **searchable snapshots** with a local cache (partially mounted) for very cheap long retention. ILM migrates indices between tiers via `_tier_preference`.

### Q85. Searchable snapshots
Mount indices from a snapshot repository (S3/GCS/Azure) for search without a full local copy. **Fully mounted** (cold, local copy cached fully) or **partially mounted** (frozen, on-demand blocks). Large cost savings; higher latency on first access. Needs an enterprise-level license (verify).

### Q86. Cross-cluster search and replication
**Cross-cluster search (CCS)** queries remote clusters: `GET cluster_b:logs-*,logs-*/_search`. **Cross-cluster replication (CCR)** replicates indices from leader to follower (DR, geo-locality; licensed feature). Use API-key based remote cluster security in 8.x.

### Q87. Rolling upgrades and restarts
Steps for a node restart: disable shard allocation (`cluster.routing.allocation.enable: primaries`), `_flush/synced` (older) / flush, stop the node, upgrade, restart, re-enable allocation, wait for green; do one node at a time (masters last or per docs). Check the **Upgrade Assistant** and deprecation API; follow the supported upgrade path (for example 7.17 → 8.x).

### Q88. Monitoring essentials
Key APIs: `_cluster/health`, `_nodes/stats`, `_cat/nodes?v&h=name,heap.percent,cpu,load_1m,disk.used_percent`, `_cat/indices`, `_cat/shards`, `_cat/thread_pool`, `_tasks`, slow logs, hot threads (`_nodes/hot_threads`). Use Stack Monitoring / Elastic Agent or Prometheus exporter. Alert on: cluster red/yellow, heap > 85%, disk watermarks, rejected requests, GC time, unassigned shards, search/index latency, pending tasks.

### Q89. Slow logs
```http
PUT /products/_settings
{ "index.search.slowlog.threshold.query.warn": "2s", "index.search.slowlog.threshold.fetch.warn": "1s", "index.indexing.slowlog.threshold.index.warn": "5s" }
```
Find the heavy queries, then examine with the **Profile API** and the query shape.

### Q90. Profile API
```http
GET /products/_search
{ "profile": true, "query": { "match": { "name": "laptop" } } }
```
Shows time per Lucene query component and collector on each shard: reveals expensive clauses (wildcards, scripts, nested).

### Q91. Relevance tuning in practice *(Must-know)*
Start from a baseline (`multi_match` with field boosts), then iterate with a test set of queries and judgements. Tools: `_explain`, **Ranking Evaluation API** (`_rank_eval`) for NDCG/precision/MRR, synonyms (graph filters), stemming vs lemmatization, phrase boosts (`match_phrase` in `should`), function score for popularity/recency, `minimum_should_match`, query-time vs index-time boosts, learning-to-rank plugin or ML rerankers. Always measure changes offline before shipping.

### Q92. Synonyms handling
Prefer **query-time** synonyms with `synonym_graph` in the `search_analyzer` (no reindex when the list changes). Synonym sets API (8.10+) updates rules without closing the index. Index-time synonyms bloat the index and need reindexing for every change.

### Q93. Stemming, lemmatization, language analysis
Language analyzers (for example `english`) combine tokenization, stop words and stemming (`running` → `run`). Use ICU plugins for Unicode folding/normalization, `kuromoji` (Japanese), `smartcn`/`ik` (Chinese), `nori` (Korean). Hindi/Indic search: `hindi` analyzer, ICU normalization, transliteration (Hinglish) via `icu_transform` or custom synonyms.

### Q94. Handling typos and "did you mean"
Fuzzy queries (edit distance), phrase suggester (noisy channel model with n-gram language model), `prefix_length` and `max_expansions` to bound cost, spell-check dictionary built from your own query logs.

### Q95. Multi-tenancy strategies
| Strategy | Pros | Cons |
|---|---|---|
| Index per tenant | Strong isolation, easy deletion | Oversharding with many tenants |
| Shared index + `tenant_id` filter (filtered alias) + routing | Efficient for many small tenants | Noisy neighbours, careful security |
| Hybrid (big tenants dedicated, small shared) | Balanced | More logic |
Enforce isolation with document-level security or filtered aliases, never trust client-supplied filters.

### Q96. Handling updates at scale
Frequent small updates are expensive (each re-indexes the whole document and creates tombstones). Batch updates in `_bulk`, coalesce at the source (debounce), keep volatile fields in a separate index/document (for example inventory counters), or use `update_by_query` carefully (throttled).

### Q97. Keeping Elasticsearch in sync with the database *(Must-know)*
| Approach | Notes |
|---|---|
| Dual write in app | Simple, but inconsistent on partial failure |
| **Transactional outbox** + worker | Reliable, at-least-once, ordered per entity |
| **CDC** (Debezium → Kafka → ES sink / Logstash) | Decoupled, captures every change |
| Periodic batch (JDBC/Logstash) | Easy, delayed, deletes are hard |
| MongoDB change streams | Native event source for Mongo |
Use `version_type=external` (DB version/updated_at) to ignore out-of-order events, deterministic `_id` for idempotency, and a periodic reconciliation job.

### Q98. Index design for e-commerce search
Fields: `title` (text + keyword + edge-ngram for suggestions), `brand`/`category`/`color` (keyword, used for facets), `price` (scaled_float), `rating`, `popularity` (rank_feature), `in_stock` (boolean), `attributes` (nested or flattened), `location`. Query: `bool` with `multi_match` in `must`, hard constraints in `filter`, boosts in `should`; facets via `terms` aggregations with `post_filter` to keep facet counts independent of the selected facet.

### Q99. `post_filter` and faceted navigation
`post_filter` filters hits **after** aggregations are computed, so selecting "brand=Dell" narrows results but facet counts for other brands still show. Alternative: `filter` aggregations per facet excluding its own filter.

### Q100. Collapse, inner hits, top hits
```http
{ "query": { "match": { "title": "shoes" } },
  "collapse": { "field": "product_group", "inner_hits": { "name": "variants", "size": 3 } } }
```
`collapse` de-duplicates by a keyword field (one hit per group). `top_hits` aggregation returns top documents per bucket. `inner_hits` returns the matching nested/child docs.

### Q101. Percolator
Stores **queries** as documents and matches incoming documents against them (reverse search): alerts, saved searches, notifications.
```http
PUT /alerts { "mappings": { "properties": { "query": { "type": "percolator" }, "message": { "type": "text" } } } }
GET /alerts/_search { "query": { "percolate": { "field": "query", "document": { "message": "server down in prod" } } } }
```

### Q102. Transforms and rollups
**Transforms** continuously pivot raw data into entity-centric or aggregated summary indices (latest/pivot). Older **rollup jobs** are deprecated in favour of downsampling for time series (TSDS) and ILM `downsample` action.

### Q103. Time series data streams (TSDS) and downsampling
`index.mode: time_series` with dimensions (`time_series_dimension: true`) and metrics (`time_series_metric`) stores metrics compactly and enables downsampling old data to coarser intervals, cutting storage dramatically.

### Q104. Runtime fields
Fields computed at query time with Painless without reindexing, useful for prototyping or fixing mapping mistakes. Slower than indexed fields; promote proven ones into the mapping.
```http
{ "runtime_mappings": { "price_inr": { "type": "double", "script": "emit(doc['price_usd'].value * 83)" } },
  "query": { "range": { "price_inr": { "gte": 5000 } } } }
```

### Q105. Vector search basics (kNN) *(Must-know in 2025+)*
```http
PUT /docs { "mappings": { "properties": {
  "text": { "type": "text" },
  "embedding": { "type": "dense_vector", "dims": 768, "index": true, "similarity": "cosine" } } } }

POST /docs/_search
{ "knn": { "field": "embedding", "query_vector": [0.12, -0.04, ...], "k": 10, "num_candidates": 100,
           "filter": { "term": { "lang": "en" } } },
  "_source": ["text"] }
```
Uses **HNSW** graphs per segment for approximate nearest neighbour. Tune `m`, `ef_construction`, `num_candidates`; quantization (`int8_hnsw`, `bbq`) reduces memory.

### Q106. Hybrid search: BM25 + vectors
Combine lexical and semantic results, then fuse with **RRF** (Reciprocal Rank Fusion), via the `retriever` API:
```http
POST /docs/_search
{ "retriever": { "rrf": { "retrievers": [
    { "standard": { "query": { "match": { "text": "wireless noise cancelling" } } } },
    { "knn": { "field": "embedding", "query_vector": [ ... ], "k": 50, "num_candidates": 200 } } ],
  "rank_window_size": 50, "rank_constant": 20 } } }
```
Hybrid usually beats either alone: BM25 catches exact terms, SKUs and names; vectors catch meaning.

### Q107. RAG with Elasticsearch
Pipeline: chunk documents → embed (inference API / `semantic_text` field / external model) → index vectors with metadata → at query time embed the question, run hybrid retrieval with metadata filters (tenant, permissions) → optional rerank → pass top chunks to an LLM. Enforce document-level security so users only retrieve what they may see.

### Q108. `semantic_text` and the inference API
`semantic_text` field (8.15+) handles chunking and embedding automatically using a configured inference endpoint (ELSER sparse model, OpenAI, Cohere, Hugging Face, etc.). Query with `semantic` or `match` on that field. ELSER is Elastic's learned sparse encoder (term expansion) that works without a dense vector index.

---

# 🟠 Part 4: Senior (5–7 years)

### Q109. Designing an Elasticsearch cluster from requirements *(Must-know)*
1. Inputs: document count/size, daily ingest rate, retention, query QPS and latency SLO, query types, availability target.
2. Storage = raw size × (1 + replicas) × overhead factor (~1.1-1.5 depending on mappings, compression) with headroom for watermarks (keep disks ≤ 75-80% in steady state).
3. Shards: size 10-50 GB; count × replicas ÷ ~20 per GB heap to size heap/nodes.
4. Tiers: hot for recent writes/reads, warm/cold/frozen for retention.
5. 3 dedicated masters, data nodes across ≥ 2-3 zones with allocation awareness, coordinating nodes for heavy aggregations.
6. Benchmark with **Rally** using realistic data and queries; iterate.

### Q110. Capacity planning example
Logs: 200 GB/day, 30 days hot-warm, 1 replica, overhead 1.2 → 200 × 30 × 2 × 1.2 = 14.4 TB. With 50 GB shards and daily rollover by size, ~4 primary shards/day → ~240 primaries total (480 with replicas). At 20 shards/GB heap → ~24 GB of heap needed across nodes (fine). Disks planned for ≤ 75% usage → ~19 TB provisioned.

### Q111. Handling hot shards and uneven distribution
Causes: skewed routing key (big tenant), unbalanced shard sizes, hot indices on few nodes. Fixes: avoid routing on skewed keys or use `routing_partition_size`, more primary shards for the hot index, `index.routing.allocation.total_shards_per_node`, rebalance settings, tier placement, and rollover by size.

### Q112. Zero-downtime reindexing and mapping evolution *(Must-know)*
1. Create `products_v2` with new mapping/analyzers.
2. Start dual-writing (or capture changes with a queue / `external` versioning) to both indices.
3. `_reindex` historical data with slices and throttling.
4. Validate counts and sample queries (compare result sets).
5. Atomically swap the alias; keep `v1` for rollback.
6. Delete `v1` after a bake period.
Use the `external` version type so reindex never overwrites newer docs.

### Q113. Index-time vs query-time cost trade-offs
Index-time work (n-grams, synonyms at index time, denormalization, precomputed fields) makes queries cheaper but increases storage, indexing time and change cost. Query-time work (fuzzy, wildcards, scripts, runtime fields, nested/join) preserves flexibility with latency cost. Decide from query frequency and change frequency.

### Q114. Deep dive: BM25 formula
`score(q,d) = Σ IDF(t) × (tf × (k1 + 1)) / (tf + k1 × (1 - b + b × |d|/avgdl))` with IDF `ln(1 + (N - n + 0.5)/(n + 0.5))`. `k1` (default 1.2) controls term-frequency saturation, `b` (0.75) controls length normalization. Scores are **per shard** (IDF computed from shard-local stats), so small or skewed shards can produce slightly different relevance; use `search_type=dfs_query_then_fetch` to compute global stats at extra cost, or have fewer, bigger shards.

### Q115. Why are scores different across shards/replicas?
Local IDF and deleted-but-not-merged documents influence term statistics, and replicas may have different segment layouts. Results can flicker for tied/similar scores between requests; set `preference=<session id>` to route a user's requests to the same shard copies for stable ordering.

### Q116. Consistency and durability guarantees
Writes are acknowledged after being applied on the primary and all in-sync replicas (and written to the translog, fsynced per request by default). Reads are eventually consistent (refresh). There are no multi-document transactions. After a hard failure the cluster may lose data only in `async` translog mode or when all copies of a shard are lost. Use `wait_for_active_shards: all`/`majority` for stronger write guarantees, snapshots for DR, and the source system for rebuilds.

### Q117. Handling node failure and recovery
When a node leaves: after `index.unassigned.node_left.delayed_timeout` (default 1 m) the master promotes replicas to primaries and allocates new replicas elsewhere (peer recovery). Recoveries are throttled (`indices.recovery.max_bytes_per_sec`, `cluster.routing.allocation.node_concurrent_recoveries`). Delaying allocation prevents a storm for short restarts.

### Q118. Disk watermark incident handling
`high` watermark (90%) stops allocating to the node and moves shards away; `flood_stage` (95%) sets indices read-only-allow-delete (`index.blocks.read_only_allow_delete`). Free space (delete old indices, shrink, add nodes), then clear the block (8.x auto-removes it when space frees). Prevention: alert at 75-80%, ILM retention, capacity planning.

### Q119. Memory pressure diagnosis
Check `GET _nodes/stats/jvm,breaker`, GC logs, and `hot_threads`. Common culprits: large aggregations (`terms` with huge `size`), fielddata on text, giant bulk or `from+size` queries, too many shards/segments, scripts creating objects, big `_source` returns. Mitigate: limit aggregations, use `composite`, `search.max_buckets`, circuit breakers, smaller bulk sizes, more heap tiers/nodes.

### Q120. Security architecture
TLS everywhere (HTTP + transport), no public exposure, API keys per service with least-privilege roles, document-level and field-level security for multi-tenant/PII, audit logging, SSO for humans, IP filtering/private networking, encrypted snapshots/disks, secrets in a vault, regular key rotation, and a separate monitoring cluster. Don't embed the `elastic` superuser in applications.

### Q121. Client patterns and resilience
Single long-lived client; retries with exponential back-off + jitter on 429/503; timeouts; bulk helpers with concurrency limits; circuit breaker so a slow Elasticsearch doesn't cascade into the API; graceful degradation to a simpler DB search; idempotent writes (deterministic `_id`) so retries are safe.
```js
const result = await es.helpers.bulk({
  datasource: docs, onDocument: d => ({ index: { _index: "products", _id: d.id } }),
  flushBytes: 5_000_000, concurrency: 4, retries: 5,
  onDrop: (doc) => console.error("dropped", doc.status, doc.error),
});
```

### Q122. Search UX: autocomplete + typo tolerance + facets architecture
Dedicated suggestion index (`completion` or edge-ngram) populated from popular queries and catalogue titles; query API combines `multi_match` + fuzziness with boosts; facets via aggregations with `post_filter`; click-through data feeds popularity boosts; query rewriting (synonyms, spell fix) and logging for analytics; A/B test ranking changes.

### Q123. Logging/observability architecture (ELK at scale)
Apps/agents → Kafka (buffer, back-pressure) → Logstash/Elastic Agent ingest → data streams with ILM (hot→warm→cold/frozen→delete) → Kibana. Use ECS (Elastic Common Schema) field names, avoid mapping explosion (`flattened` for labels), sample or drop noisy debug logs, set per-index limits, and use separate clusters for observability vs product search to isolate load.

### Q124. Elasticsearch vs OpenSearch vs Solr vs database full-text
| | Elasticsearch | OpenSearch | Solr | PostgreSQL FTS | Algolia/Typesense/Meilisearch |
|---|---|---|---|---|---|
| Engine | Lucene | Lucene | Lucene | GIN + tsvector | Custom |
| Scale-out | Excellent | Excellent | Good (SolrCloud) | Limited | Managed/simple |
| Analytics/logs | Excellent | Good | Fair | Poor | Poor |
| Vector search | Yes | Yes | Yes | pgvector | Varies |
| Ops effort | Medium-high | Medium-high | Medium | Low | Low (SaaS) |
| Best for | Search + observability + analytics | AWS-centric, open license | Classic enterprise search | Small/medium app search | Instant UX search |
Choose the simplest tool that meets scale and relevance needs.

### Q125. When not to use Elasticsearch
As a primary database with strict transactions, for simple key-value lookups, for tiny datasets where Postgres FTS suffices, for heavy relational joins, or when the team cannot operate a cluster (use managed/serverless). Be explicit about the sync source of truth.

### Q126. Shard allocation awareness and zone failure
Set `node.attr.zone` and `cluster.routing.allocation.awareness.attributes: zone` so primary and replicas land in different zones; `forced awareness` prevents all replicas piling into the surviving zone after a zone loss. Capacity must cover failure of one zone (N+1 zone planning).

### Q127. Snapshots strategy and DR
SLM policy hourly/daily with retention; snapshots in object storage in a different region/account; periodic restore tests (time to restore = RTO); for near-zero RPO use CCR or dual-ingest to a standby cluster. Know restore speed limits and shard recovery throttling.

### Q128. Troubleshooting a red cluster *(Must-know)*
1. `GET _cluster/health?level=indices` → which indices are red.
2. `GET _cat/shards?v&h=index,shard,prirep,state,unassigned.reason,node` → unassigned primaries.
3. `GET _cluster/allocation/explain` → why.
4. Typical causes: node gone with no replica, disk watermark, allocation filter, corrupted shard, wrong `awareness`.
5. Recover: bring node back, fix disk, relax filters, `reroute` retry-failed, or restore from snapshot; `allocate_stale_primary` / `allocate_empty_primary` **lose data** and are last resorts.

### Q129. Tuning for high-cardinality aggregations
Use `composite` for pagination, `sampler`/`diversified_sampler` for approximate analysis, `execution_hint: map` or `global_ordinals` appropriately, lower `size`, pre-aggregate with transforms, eager global ordinals for frequently used fields, `cardinality` instead of exact distinct counts, and downsample old time series.

### Q130. Query DSL anti-patterns
Wrapping everything in `must` instead of `filter`; leading wildcards; `query_string` with user input (syntax injection, expensive); script queries on large indexes; `terms` lookups with giant lists; nested queries over huge arrays; `from` beyond 10k; sorting on analyzed fields; ignoring `track_total_hits` cost on huge indices (`true` forces exact counting).

### Q131. Rate-limiting and protecting the cluster from bad queries
Use `search.default_search_timeout`, per-request `timeout`, `terminate_after`, `max_result_window`, `max_buckets`, query allow-listing via an API layer (never expose raw DSL to clients), search throttling/queues in the app, async search for heavy analytics, and **stored/templated searches** (`_search/template`).
```http
PUT _scripts/product_search { "script": { "lang": "mustache", "source": { "query": { "multi_match": { "query": "{{q}}", "fields": ["name^3","description"] } }, "size": "{{size}}{{^size}}20{{/size}}" } } }
GET products/_search/template { "id": "product_search", "params": { "q": "laptop", "size": 10 } }
```

### Q132. Security: preventing query injection
Never concatenate user input into JSON DSL strings or `query_string`. Use the client's object API with parameters, `simple_query_string` with limited operators, field allow-lists, template params, and validate types/lengths. Apply role-based document-level filters server-side.

### Q133. Elasticsearch on Kubernetes (ECK)
The **Elastic Cloud on Kubernetes** operator manages clusters via CRDs: StatefulSets, persistent volumes, rolling upgrades, TLS certificates, node sets per role/tier, `podAntiAffinity`, resource requests=limits, `initContainers` for `vm.max_map_count`, heap ≈ 50% of container memory, PodDisruptionBudgets, and snapshots to object storage.

### Q134. Cost optimization
ILM tiering and searchable snapshots, fewer replicas on cold data, downsampling, `index: false`/`doc_values: false` for unused features, synthetic `_source`/LogsDB mode, compression (`best_compression` codec on warm/cold), drop noisy fields at ingest, right-size shards, smaller instance types with more nodes vs fewer big ones (measure), serverless for spiky loads.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q135. Architecting enterprise search
Sources → connectors/CDC → normalization pipeline (clean, enrich, chunk, embed, permissions) → Elasticsearch (lexical + vector, document-level security) → search API (query understanding, rewriting, personalization, reranking) → UI (facets, suggest, highlights) → feedback loop (clicks, zero-result queries) → evaluation (`_rank_eval`, A/B). Treat relevance as a product with owners, metrics and regression suites.

### Q136. Search relevance program
Define metrics (CTR, zero-result rate, NDCG on judged queries, conversion, time-to-first-click). Build a judged query set (head, torso, tail). Offline evaluation with `_rank_eval` + online A/B via interleaving or split traffic. Version analyzers and query templates; roll out through aliases; keep a rollback.

### Q137. Multi-region architecture
Options: (1) active-passive with CCR/snapshots for DR, (2) active-active by region with data partitioned (users local), cross-cluster search for global views, (3) dual-ingest from a log (Kafka mirror) into each region. Design for latency, data residency, failover runbooks, and consistency expectations (CCR is async).

### Q138. Migration to Elasticsearch/new version with zero downtime
Compatibility check (deprecation API, upgrade assistant), build the new cluster in parallel, replay traffic (shadow queries) and compare results, dual-write via the outbox/Kafka log, cut over reads gradually behind a feature flag, keep the old cluster as fallback, then decommission. For major versions use the supported path (for example 7.17 → 8.x) with reindex-from-remote if needed.

### Q139. Governance for shared clusters
Index naming conventions (`team-app-env-*`), ILM and templates enforced by platform, quotas (shards, fields, index size), RBAC per team via spaces/roles, cost showback, query review for expensive patterns, a central observability stack, change management for mapping updates.

### Q140. Data modeling at scale: designing for change
Version mappings (`_meta.version`), use aliases and templates, keep mappings tight, avoid dynamic explosion, use `copy_to` or multi-fields judiciously, store a denormalized "search document" distinct from the DB model, and keep a rebuild pipeline that can recreate any index from the source in hours. Treat the index as a cache of the source of truth.

### Q141. Build vs buy (Elastic Cloud, Serverless, OpenSearch Service, self-managed)
Managed: faster time to value, automated upgrades/backups/scaling, support; higher unit cost, less control (plugins, JVM flags). Self-managed: control and cost efficiency at large scale, but you need SRE capacity and 24/7 on-call. Decide on data volume, compliance, team skills and licensing (features such as searchable snapshots, CCR and advanced security require paid tiers; verify).

### Q142. Observability for the search product
Golden signals: latency (p50/p95/p99 per endpoint and per query type), error rate, saturation (CPU, heap, thread pool queues), traffic. Business: zero-result rate, abandoned search, conversion. Trace search calls in APM; log slow queries; dashboards by index/tenant; SLOs with burn-rate alerts.

### Q143. Failure drills
Kill a data node (observe recovery), take a zone out, fill a disk to watermark, drop the master, block snapshot repo access, replay a bad mapping change, overload with a heavy aggregation, and verify alerts/runbooks/client behaviour. Document RTO/RPO per scenario.

### Q144. Responsible AI search
Document-level security in retrieval, PII redaction before embedding, provenance/citations in answers, evaluation sets for retrieval quality (recall@k) and answer groundedness, caching and cost controls, guardrails against prompt injection in retrieved text, monitoring drift as the corpus and embedding model change (re-embed with versioned indices).

### Q145. Team standards
Shared client library (timeouts, retries, metrics), mapping/analyzer reviews, load-test gates with Rally/k6, reindex runbooks, an on-call guide ("red cluster", "disk watermark", "429s"), and a quarterly capacity and shard-count review.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Local Elasticsearch + Kibana with Docker Compose
```yaml
services:
  es:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.15.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false          # local dev only
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
    ports: ["9200:9200"]
    volumes: ["esdata:/usr/share/elasticsearch/data"]
    ulimits: { memlock: { soft: -1, hard: -1 } }
  kibana:
    image: docker.elastic.co/kibana/kibana:8.15.0
    environment: ["ELASTICSEARCH_HOSTS=http://es:9200"]
    ports: ["5601:5601"]
    depends_on: [es]
volumes:
  esdata:
```

### H2. Product index with analyzers, mapping and sample data
```http
PUT /products_v1
{
  "settings": {
    "number_of_shards": 1, "number_of_replicas": 0,
    "analysis": {
      "filter": { "edge": { "type": "edge_ngram", "min_gram": 2, "max_gram": 15 } },
      "analyzer": {
        "autocomplete": { "tokenizer": "standard", "filter": ["lowercase", "edge"] },
        "folding": { "tokenizer": "standard", "filter": ["lowercase", "asciifolding"] }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "name":     { "type": "text", "analyzer": "folding",
                    "fields": { "keyword": { "type": "keyword", "ignore_above": 256 },
                                "ac": { "type": "text", "analyzer": "autocomplete", "search_analyzer": "standard" } } },
      "brand":    { "type": "keyword" },
      "category": { "type": "keyword" },
      "price":    { "type": "scaled_float", "scaling_factor": 100 },
      "rating":   { "type": "half_float" },
      "in_stock": { "type": "boolean" },
      "popularity": { "type": "rank_feature" },
      "created":  { "type": "date" }
    }
  }
}
POST /_aliases { "actions": [ { "add": { "index": "products_v1", "alias": "products" } } ] }
```

### H3. Bulk loader in Node.js with back-pressure
```js
import { Client } from "@elastic/elasticsearch";
import fs from "node:fs";
import readline from "node:readline";

const es = new Client({ node: process.env.ES_URL, auth: { apiKey: process.env.ES_API_KEY } });
const rl = readline.createInterface({ input: fs.createReadStream("products.ndjson") });

async function* docs() { for await (const line of rl) if (line.trim()) yield JSON.parse(line); }

const stats = await es.helpers.bulk({
  datasource: docs(),
  onDocument: (d) => ({ index: { _index: "products", _id: d.sku } }),
  flushBytes: 5 * 1024 * 1024, flushInterval: 2000, concurrency: 4, retries: 5, wait: 1000,
  onDrop: (d) => console.error("DROP", d.status, JSON.stringify(d.error)),
});
console.log(stats);   // { total, failed, retry, successful, time, bytes, aborted }
```

### H4. Search endpoint with filters, facets and pagination
```js
app.get("/search", async (req, res) => {
  const { q = "", brand, minPrice, maxPrice, after } = req.query;
  const filter = [{ term: { in_stock: true } }];
  if (brand) filter.push({ terms: { brand: [].concat(brand) } });
  if (minPrice || maxPrice) filter.push({ range: { price: { gte: minPrice, lte: maxPrice } } });

  const body = {
    size: 20,
    track_total_hits: false,
    query: { bool: {
      must: q ? [{ multi_match: { query: q, fields: ["name^3", "name.ac", "category"], fuzziness: "AUTO", operator: "and" } }] : [{ match_all: {} }],
      filter,
      should: [{ rank_feature: { field: "popularity", boost: 2 } }],
    } },
    sort: [{ _score: "desc" }, { sku: "asc" }],
    aggs: {
      brands: { terms: { field: "brand", size: 10 } },
      price_ranges: { range: { field: "price", ranges: [{ to: 1000 }, { from: 1000, to: 5000 }, { from: 5000 }] } },
    },
    _source: ["name", "brand", "price", "rating"],
  };
  if (after) body.search_after = JSON.parse(Buffer.from(after, "base64url").toString());

  const r = await es.search({ index: "products", ...body });
  const last = r.hits.hits.at(-1);
  res.json({
    items: r.hits.hits.map((h) => ({ id: h._id, score: h._score, ...h._source })),
    facets: r.aggregations,
    next: last ? Buffer.from(JSON.stringify(last.sort)).toString("base64url") : null,
  });
});
```
The sort needs a unique tiebreaker field (`sku`); for a `sku` sort the field must be `keyword`/doc-values enabled.

### H5. Autocomplete endpoint
```http
GET /products/_search
{ "size": 5, "_source": ["name"],
  "query": { "bool": { "must": { "match": { "name.ac": { "query": "wirel", "operator": "and" } } },
                       "filter": { "term": { "in_stock": true } } } } }
```
Add debouncing in the UI (150-250 ms), a minimum prefix length (2 chars), caching of popular prefixes (Redis/CDN), and cancellation of in-flight requests.

### H6. Zero-downtime reindex with alias swap
```http
PUT /products_v2 { ...new settings and mappings... }
POST _reindex?wait_for_completion=false&slices=auto&requests_per_second=2000
{ "source": { "index": "products_v1" }, "dest": { "index": "products_v2", "version_type": "external" } }
GET _tasks/<task_id>
GET products_v1/_count   GET products_v2/_count
POST _aliases { "actions": [
  { "remove": { "index": "products_v1", "alias": "products" } },
  { "add":    { "index": "products_v2", "alias": "products" } } ] }
```

### H7. Log pipeline with data stream + ILM
```http
PUT _ilm/policy/app-logs { "policy": { "phases": {
  "hot": { "actions": { "rollover": { "max_primary_shard_size": "30gb", "max_age": "1d" } } },
  "warm": { "min_age": "3d", "actions": { "forcemerge": { "max_num_segments": 1 }, "allocate": { "number_of_replicas": 0 } } },
  "delete": { "min_age": "30d", "actions": { "delete": {} } } } } }

PUT _index_template/app-logs
{ "index_patterns": ["app-logs-*"], "data_stream": {}, "priority": 300,
  "template": { "settings": { "index.lifecycle.name": "app-logs", "number_of_shards": 1 },
                "mappings": { "properties": { "@timestamp": { "type": "date" }, "level": { "type": "keyword" },
                                              "message": { "type": "text" }, "service": { "type": "keyword" } } } } }

POST app-logs-prod/_doc { "@timestamp": "2025-10-24T10:00:00Z", "level": "ERROR", "service": "api", "message": "db timeout" }
```

### H8. Error-rate dashboard query (aggregations)
```http
GET app-logs-prod/_search
{ "size": 0,
  "query": { "range": { "@timestamp": { "gte": "now-24h" } } },
  "aggs": { "per_hour": { "date_histogram": { "field": "@timestamp", "fixed_interval": "1h" },
      "aggs": { "errors": { "filter": { "term": { "level": "ERROR" } } },
                "error_rate": { "bucket_script": { "buckets_path": { "e": "errors>_count", "t": "_count" }, "script": "params.e / params.t" } } } } } }
```

### H9. Hybrid search (BM25 + vector) with RRF
```js
const r = await es.search({
  index: "docs",
  retriever: { rrf: {
    retrievers: [
      { standard: { query: { match: { text: question } }, filter: [{ term: { tenant: tenantId } }] } },
      { knn: { field: "embedding", query_vector: queryVec, k: 50, num_candidates: 200, filter: [{ term: { tenant: tenantId } }] } },
    ],
    rank_window_size: 50, rank_constant: 20 } },
  size: 5, _source: ["text", "url"],
});
```
Pass the top chunks to an LLM; include tenant/permission filters inside **each** retriever.

### H10. Snapshot repository and SLM policy
```http
PUT _snapshot/s3_repo { "type": "s3", "settings": { "bucket": "es-backups", "base_path": "prod" } }
PUT _slm/policy/nightly
{ "schedule": "0 30 1 * * ?", "name": "<nightly-{now/d}>", "repository": "s3_repo",
  "config": { "indices": ["*"], "include_global_state": false },
  "retention": { "expire_after": "30d", "min_count": 5, "max_count": 50 } }
POST _slm/policy/nightly/_execute
```

### H11. Roles, users and API keys (least privilege)
```http
POST _security/role/catalog_search { "indices": [ { "names": ["products*"], "privileges": ["read", "view_index_metadata"] } ] }
POST _security/api_key
{ "name": "web-search", "expiration": "90d",
  "role_descriptors": { "catalog_search": { "indices": [ { "names": ["products"], "privileges": ["read"] } ] } } }
```

### H12. Sync MongoDB/Postgres to Elasticsearch via outbox
```js
// worker: polls outbox rows, upserts to ES idempotently with external version
for (const ev of await outbox.take(500)) {
  if (ev.type === "deleted") ops.push({ delete: { _index: "products", _id: ev.id, version: ev.version, version_type: "external_gte" } });
  else ops.push({ index: { _index: "products", _id: ev.id, version: ev.version, version_type: "external_gte" } }, ev.doc);
}
const r = await es.bulk({ operations: ops });
await outbox.ack(r.items.filter(i => !Object.values(i)[0].error).map(...));   // retry failures later
```
`external_gte` makes retries and re-ordering safe.

### H13. Profile and fix a slow query
```http
GET products/_search { "profile": true, "query": { "wildcard": { "name": "*phone*" } } }
```
Replace the leading wildcard with an `ngram` sub-field (or `match` on analyzed text), compare `took` and the profile breakdown, then add the change to a regression benchmark.

---

# 🐞 Part 7: Debugging Scenarios

### D1. Cluster is yellow
Replicas unassigned. On a single node it's expected (set `number_of_replicas: 0` for dev). On multi-node, check `_cluster/allocation/explain`: not enough nodes, awareness constraints, disk watermarks, allocation filters.

### D2. Cluster is red
Primary shard unassigned. Follow Q128: find the red index, the reason, restore the node/disk or restore from snapshot. Do not force-allocate stale/empty primaries unless you accept data loss.

### D3. Search returns no results for an obvious term
Analyzer mismatch (`term` on `text`, case differences), wrong field (use `.keyword`), not refreshed yet, wrong alias/index, the document was filtered by a security role, or a mapping dynamic guess (number vs text). Use `_analyze`, `_explain`, and `_validate/query?explain=true`.

### D4. `mapper_parsing_exception` / `illegal_argument_exception`
A value doesn't match the mapped type (string in a date/long field), a field exceeds limits, or `dynamic: strict` rejected a new field. Fix the source data, adjust mapping (new index + reindex), use `ignore_malformed`, or an ingest pipeline to coerce types.

### D5. `es_rejected_execution_exception` (429)
Write or search thread pool queue is full. Reduce client concurrency, back off and retry, enlarge bulk intervals, add nodes, optimize queries, check for hot shards or slow disks.

### D6. `Result window is too large, from + size must be <= 10000`
Deep pagination. Use `search_after` with a PIT, or restrict UI paging. Raising `max_result_window` only increases memory pressure.

### D7. `CircuitBreakingException: Data too large`
A request would exceed the heap budget (heavy aggregation, fielddata on text, giant response). Reduce `size`/buckets, aggregate on `keyword`, use `composite`, avoid `fielddata: true`, and scale heap/nodes.

### D8. High heap and long GC pauses
Too many shards/segments, big aggregations, fielddata, heap above ~31 GB (no compressed oops) or too small, swapping. Inspect `_nodes/stats/jvm`, GC logs, shard counts; reduce oversharding, tune queries, and give the OS cache enough RAM.

### D9. Indexing is slow
Small single-doc requests, `refresh_interval` at 1 s with heavy writes, replicas during bulk load, heavy ingest pipelines, slow disks, merge throttling, mapping explosion, hot shard (bad routing). Use bulk, batch sizing, parallel workers, relax refresh, check `_nodes/stats/indices/indexing` and hot threads.

### D10. Documents disappear or count mismatch after updates
Deleted docs are counted until merged (`_cat/indices` `docs.deleted`); `_count` vs `_search` with `track_total_hits` differences; duplicate `_id` overwrites; reindex lag; `_delete_by_query` conflicts (`conflicts=proceed`). Verify with `_count`, ids, and version info.

### D11. Version conflict (409)
Optimistic concurrency failure on `if_seq_no`/`version`. Retry with the latest, use `retry_on_conflict` for updates, or redesign to avoid hot-document contention (counters in separate docs or aggregations).

### D12. Disk flood stage: indices read-only
`cluster_block_exception: ... index has read-only-allow-delete block`. Free space, remove old data, add disk/nodes; recent versions clear the block automatically once under the high watermark. Add alerts at 75-80%.

### D13. Slow aggregations on a high-cardinality `terms`
Lower `size`, use `composite`, enable `eager_global_ordinals` when the field is queried often, filter first, use `sampler`, or pre-aggregate with transforms.

### D14. Master not discovered / `master_not_discovered_exception`
Fewer than quorum master-eligible nodes reachable, wrong `discovery.seed_hosts`, `cluster.initial_master_nodes` misconfigured at bootstrap, network/firewall on 9300, TLS mismatch. Check node logs and `_cluster/state` from a healthy master.

### D15. Relevance is off after adding synonyms/analyzers
Index and search analyzers differ, synonyms applied at index time requiring reindex, `stop` words removing meaningful terms, stemming over-aggressive. Test with `_analyze` using both analyzers and compare `_explain` output.

---

# 🧩 Part 8: Tricky Questions

### T1. Is Elasticsearch real-time?
Near real-time: documents become searchable after the next refresh (1 s default). Get-by-id is real-time via the translog.

### T2. Can I change a field's type or the number of primary shards?
Not in place. Create a new index with the new mapping/shard count and reindex (or use split/shrink for shard counts).

### T3. Why does `term` fail on a `text` field?
`text` is analyzed (lowercased/tokenized) at index time while `term` isn't analyzed at query time. Use `match` or the `keyword` sub-field.

### T4. Does deleting a document free disk immediately?
No. It's marked deleted in a bitset; space is reclaimed on segment merge. `forcemerge` with `only_expunge_deletes` or a full force-merge can help (read-only indices only).

### T5. Does an update modify a document in place?
No. Lucene segments are immutable: update = delete + reindex of the whole document (fetching `_source`, applying changes, indexing again).

### T6. Is a replica a backup?
No. Replicas protect against node failure, not against deletion, corruption or bad writes (they replicate those too). Use snapshots.

### T7. Does `size: 0` still count results?
Yes (up to 10,000 unless `track_total_hits: true`), and it skips the fetch phase; aggregations still run. Set `track_total_hits: false` if the total isn't needed.

### T8. Are Elasticsearch scores comparable across queries?
No. Scores are relative within a query and depend on corpus statistics; don't threshold on raw `_score` across queries.

### T9. Why can the same query return different order between runs?
Different shard copies (replicas) can have different segment/statistics and tie-breaking; use `preference` and deterministic secondary sort keys.

### T10. Is more shards always faster?
No. More shards add per-shard overhead and cluster-state size. Parallelism helps large indices only up to the available cores; small indices should have 1 shard.

### T11. `match` with multiple words: AND or OR?
OR by default (`operator: or`); use `operator: and` or `minimum_should_match` to tighten.

### T12. Is `nested` free?
No. Each nested object is a separate hidden Lucene document; limit nested objects per document (`index.mapping.nested_objects.limit` 10,000) and expect costlier updates and queries.

### T13. Is `wildcard`/`regexp` on `keyword` slow?
Leading wildcards are slow because they scan the term dictionary. Use `wildcard` field type, n-grams, or reverse-field indexing to optimize.

### T14. Does Elasticsearch support joins?
Limited: `nested` and `join` field types, `terms` lookup, and ES|QL `LOOKUP JOIN` (recent versions, verify). It is not designed for relational joins; denormalize.

### T15. Can I use Elasticsearch as my only database?
Technically yes for append-only/search workloads, but lack of transactions, eventual visibility, and mapping rigidity make it risky as a system of record.

### T16. Why is my aggregation count approximate?
Distributed `terms` aggregations compute top-N per shard then merge. Increase `shard_size`, or use fewer shards or `composite` when exactness matters.

### T17. What is the difference between `must_not` and `NOT` queries?
`must_not` is a filter-like clause (no scoring) inside `bool`; a pure `must_not` bool query matches everything except the excluded set because the engine adds an implicit `match_all`.

### T18. Does `refresh=true` on each write make sense?
Only for tests or rare writes. It creates a segment per request and kills indexing throughput. Use `wait_for` or accept the 1 s delay.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Underlying library?** Apache Lucene.
- **Default HTTP port?** 9200.
- **Default transport port?** 9300.
- **Core data structure?** Inverted index.
- **Default similarity?** BM25.
- **Unit of data?** JSON document.
- **Schema?** Mapping.
- **Exact match field type?** `keyword`.
- **Full-text field type?** `text`.
- **Scoring-free clause?** `filter`.
- **Visibility delay?** Refresh (1 s default).
- **Durability log?** Translog.
- **Max `from + size`?** 10,000 by default.
- **Deep paging?** `search_after` + PIT.
- **Bulk format?** NDJSON.
- **Cluster green/yellow/red?** All assigned / replicas missing / primary missing.
- **Primary shard count changeable?** No (use split/shrink/reindex).
- **Zero-downtime mapping change?** New index + reindex + alias swap.
- **Time-series storage?** Data streams + ILM.
- **Cheap long-term search?** Searchable snapshots / frozen tier.
- **Typo tolerance?** `fuzziness: AUTO`.
- **Autocomplete?** `edge_ngram`, `search_as_you_type`, `completion`.
- **Vector search?** `dense_vector` + `knn` (HNSW).
- **Hybrid fusion?** RRF.
- **Heap rule?** ≤ 50% RAM, ≤ ~31 GB.
- **Shard size target?** ~10-50 GB.
- **Masters for HA?** 3 dedicated.
- **Backups?** Snapshots (not replicas).
- **Monitoring API?** `_cluster/health`, `_cat/*`, `_nodes/stats`.
- **Fork?** OpenSearch.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an Elasticsearch project you built.
STAR: "I built product search for a catalogue of 4 million SKUs. I designed a denormalized index with explicit mappings, a custom analyzer (folding + edge-ngram), faceted navigation with `post_filter`, popularity boosts via `rank_feature`, and `search_after` pagination. Data synced from PostgreSQL via an outbox worker with external versioning. p95 search latency was 60 ms at 800 QPS and zero-result rate fell from 9% to 3% after synonym and typo tuning."

### P2. Describe a performance problem and your fix.
"Aggregations on a high-cardinality field blew heap and triggered circuit breakers. I switched to `composite` aggregations, filtered first, and pre-aggregated with a transform into a summary index. Latency fell from 8 s to 300 ms and heap stayed under 70%."

### P3. How did you handle a mapping mistake in production?
"A numeric-looking field was mapped as text. I created `v2` with the right mapping, reindexed with slices during off-peak, dual-wrote changes via the outbox, validated counts and sampled queries, then swapped the alias. Zero downtime and a rollback path via `v1`."

### P4. Describe an incident you handled.
"Disk reached the flood-stage watermark on hot nodes and indices went read-only, failing writes. I freed space by deleting expired indices, fixed ILM rollover that had stalled, and added alerts at 75%. We added a capacity review to the monthly checklist."

### P5. How do you measure search quality?
Judged query sets with `_rank_eval` (NDCG), zero-result and CTR metrics, A/B tests for ranking changes, query log analysis for synonyms and corrections.

### P6. How do you keep Elasticsearch consistent with the database?
Transactional outbox or CDC, idempotent upserts with external versions, retries with a DLQ, reconciliation jobs comparing counts and checksums, and the ability to rebuild an index from the source.

### P7. Why Elasticsearch rather than PostgreSQL full-text search?
Faceting, relevance tuning, scaling to large corpora, fuzzy/autocomplete, analytics, and vector/hybrid search; for a small corpus I'd choose PostgreSQL FTS first for operational simplicity.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** inverted index, documents, indices, shards/replicas, mappings, REST API, CRUD, bulk.
- **Text analysis:** analyzers, tokenizers, filters, synonyms, stemming, n-grams, language analysis.
- **Searching:** Query DSL, bool, match/term/range, multi_match, fuzzy, nested, function_score, highlighting, suggesters, geo.
- **Aggregations:** metric, bucket, pipeline, composite, cardinality, significant terms.
- **Relevance:** BM25, boosting, explain, rank_eval, hybrid search.
- **Data management:** aliases, templates, data streams, ILM, rollover, reindex, split/shrink, snapshots, searchable snapshots.
- **Cluster and ops:** node roles, allocation, recovery, health, capacity, JVM, caches, thread pools, upgrades, monitoring.
- **Ingestion:** ingest pipelines, Logstash, Beats/Elastic Agent, Kafka, CDC.
- **AI search:** dense vectors, kNN/HNSW, ELSER, `semantic_text`, RAG.
- **Security:** TLS, RBAC, API keys, DLS/FLS, audit.
- **Ecosystem:** Kibana, ES|QL, SQL, Rally, ECK, OpenSearch.

## Mixed topics
- Elasticsearch + Node/Express: client, search API, pagination, bulk helpers.
- Elasticsearch + MongoDB/PostgreSQL: change streams/CDC/outbox sync.
- Elasticsearch + Redis: caching popular queries and suggestions, rate limiting.
- Elasticsearch + Kafka: ingestion buffering, back-pressure, replays.
- Elasticsearch + Kubernetes: ECK, anti-affinity, persistent volumes.
- Elasticsearch + React: debounced autocomplete, facets UI, URL state.
- Elasticsearch + LLMs: hybrid retrieval, reranking, permission-aware RAG.

---

# 🔬 Part 12: Elasticsearch Internals

### I1. Lucene index structure
Per shard: a set of **segments**, each containing the **term dictionary** (FST-based), **postings lists** (doc ids, frequencies, positions, offsets), **stored fields** (`_source`), **doc values** (columnar), **points/BKD trees** (numeric/geo/date range indexes), **norms** (field length), **vectors/HNSW graphs**, and a **live-docs** bitset for deletions.

### I2. Term dictionary and FST
Terms are stored sorted with a finite-state transducer index in memory for fast prefix/term lookup, then block-compressed term data on disk; this is why prefix and term queries are fast and leading wildcards are slow.

### I3. Postings compression
Doc ids are delta-encoded and bit-packed in blocks of 128 (frame-of-reference) with skip lists to jump quickly during intersections; roaring bitmaps are used for filter caching.

### I4. Points and BKD trees
Numeric, date, IP and geo fields use a block KD-tree for fast range and geo queries instead of term dictionaries (replacing older trie-encoded terms).

### I5. Doc values and global ordinals
Doc values store per-document values column-wise; for `keyword` fields, **ordinals** map values to integers within a segment, and **global ordinals** unify them across segments of a shard for fast `terms` aggregations (built lazily on first use; `eager_global_ordinals` pre-builds them).

### I6. Write path internals
Request → primary shard → analysis & Lucene `IndexWriter` buffer + translog append → replicate operations to in-sync replicas → ack. Refresh: buffer → new segment (opened by a `SearcherManager`). Flush: Lucene commit + translog roll. Merge: background threads with throttling.

### I7. Recovery
**Peer recovery**: a new replica copies segment files from the primary (phase 1) and then replays translog operations (phase 2); with sequence numbers and retention leases, re-synchronization after short outages replays only missing operations. **Snapshot recovery** restores from a repository.

### I8. Cluster coordination
Elected master maintains cluster state, published via a two-phase commit to a quorum. Voting configuration is automatically adjusted. Nodes ping the master and followers; fault detection removes unresponsive nodes. Only the elected master changes cluster state.

### I9. Search execution internals
Per-shard searches use Lucene `IndexSearcher` over all segments in parallel (slices of segments across threads, `search.worker_threads`), `Weight`/`Scorer` iterators with skip-ahead, `Collector`s for top-N and aggregations, block-max WAND to skip non-competitive docs when `track_total_hits` is bounded.

### I10. Memory areas
JVM heap (cluster state, caches, aggregations, indexing buffers, segment metadata), off-heap file system cache (mmapped segment files via `MMapDirectory`), direct buffers for networking. This is why leaving RAM for the OS is as important as heap size.

---

# 📊 Part 13: Reference Tables

### Query types cheat table
| Goal | Query |
|---|---|
| Full-text relevance | `match`, `multi_match`, `match_phrase` |
| Exact value | `term`, `terms` on keyword/numeric |
| Range | `range` |
| Compound logic | `bool` (`must`, `filter`, `should`, `must_not`) |
| Typos | `fuzzy`, `match` with `fuzziness` |
| Prefix/autocomplete | `match_phrase_prefix`, `search_as_you_type`, `completion` |
| Nested objects | `nested` |
| Geo | `geo_distance`, `geo_bounding_box`, `geo_shape` |
| Custom ranking | `function_score`, `rank_feature` |
| Vector | `knn`, `semantic`, `sparse_vector` |

### Aggregation families
| Family | Examples |
|---|---|
| Metric | `avg`, `sum`, `min`, `max`, `stats`, `cardinality`, `percentiles` |
| Bucket | `terms`, `composite`, `range`, `histogram`, `date_histogram`, `filters`, `nested` |
| Pipeline | `derivative`, `cumulative_sum`, `moving_fn`, `bucket_script`, `bucket_sort` |

### Field type choice
| Need | Type |
|---|---|
| Searchable prose | `text` (+ `keyword` sub-field) |
| Filter / sort / facet | `keyword` |
| Money/decimals | `scaled_float` |
| Many dynamic labels | `flattened` |
| Array of objects with correlation | `nested` |
| Autocomplete | `search_as_you_type` / `completion` |
| Embeddings | `dense_vector` |
| Coordinates | `geo_point` |

### Cluster health states
| Color | Meaning | Action |
|---|---|---|
| Green | All shards allocated | None |
| Yellow | Replicas unassigned | Add nodes or reduce replicas; investigate |
| Red | Primary unassigned | Urgent: restore node/disk/snapshot |

### Pagination methods
| Method | Max depth | Consistent view | Use |
|---|---|---|---|
| `from/size` | 10k | No | Small UI pages |
| `search_after` + PIT | Unlimited | Yes (PIT) | Infinite scroll, exports |
| `scroll` | Unlimited | Yes | Legacy exports |

### Version highlights
| Version | Highlights |
|---|---|
| 5.0 | BM25 default, new shard allocation |
| 6.x | Index sorting, sequence numbers, single type per index |
| 7.0 | Zen2 coordination, `track_total_hits`, ILM GA (7.x), types deprecated |
| 7.9–7.17 | Data streams, searchable snapshots, runtime fields |
| 8.0 | Security on by default, types removed, native kNN |
| 8.11–8.15 | ES|QL, `semantic_text`, retrievers, int8 quantization |
| 9.x | LogsDB, better binary quantization (BBQ), ES|QL expansion (verify details) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Indexed: `{ "title": "Quick Brown Fox" }` in a `text` field.
```http
GET t/_search { "query": { "term": { "title": "Quick" } } }
GET t/_search { "query": { "match": { "title": "Quick" } } }
```
**Output:** first returns no hits (stored term is `quick`); second returns the document.

### O2.
```http
PUT /a/_doc/1 { "n": 1 }
PUT /a/_doc/1 { "m": 2 }
GET /a/_doc/1
```
**Output:** `_source` is `{ "m": 2 }` and `_version` is 2. `PUT` replaces the whole document (`_update` merges).

### O3.
```http
PUT /a/_create/1 { "n": 1 }
PUT /a/_create/1 { "n": 2 }
```
**Output:** second call returns **409** `version_conflict_engine_exception` (document already exists).

### O4.
Docs have `tags: ["a","b"]` and `tags: ["b"]`.
```http
{ "size": 0, "aggs": { "t": { "terms": { "field": "tags" } } } }
```
**Output:** buckets `b: 2`, `a: 1`. Arrays count once per document per value.

### O5.
Mapping `comments` as plain `object` with `[ {u:"x",s:5}, {u:"y",s:1} ]`; query `u:x AND s:1`.
**Result:** matches (incorrect cross-object match). With `nested` mapping and a `nested` query it doesn't match.

### O6.
```http
GET idx/_search { "query": { "bool": { "should": [ { "match": { "t": "a" } }, { "match": { "t": "b" } } ] } } }
```
**Output:** documents matching `a` OR `b` (when no `must`/`filter`, at least one `should` is required). Docs with both score higher.

### O7.
```http
GET idx/_search { "query": { "bool": { "filter": { "term": { "s": "open" } } } } }
```
**Output:** all matches have `_score: 0.0` (filter context adds no score; `constant_score` of 0).

### O8.
```http
GET idx/_search { "from": 9995, "size": 10 }
```
**Output:** error: `Result window is too large, from + size must be less than or equal to: [10000] but was [10005]`.

### O9.
```http
POST idx/_doc { "x": 1 }
GET idx/_search { "query": { "match_all": {} } }
```
**Output:** possibly 0 hits if run before the next refresh (≤ 1 s); `?refresh=wait_for` on the index call guarantees visibility.

### O10.
```http
POST _analyze { "analyzer": "standard", "text": "Dr. Ritesh's e-mail: ritesh@example.com" }
```
**Output (tokens):** `dr`, `ritesh's`, `e`, `mail`, `ritesh`, `example.com` (standard tokenizer splits on word boundaries following Unicode rules; verify exact tokens with `_analyze`).

### O11.
Index with 5 primary shards and 1 replica on a **single** node.
**Result:** cluster status **yellow**: 5 primaries assigned, 5 replicas unassigned (replicas cannot share a node with their primary).

### O12.
```http
GET idx/_search { "size": 0, "aggs": { "u": { "cardinality": { "field": "user_id" } } } }
```
**Output:** approximate distinct count (HyperLogLog++), accurate to within a small error; near-exact below `precision_threshold` (default 3000).

---

# ✅ Part 15: MCQs

**1. Elasticsearch is built on:**
A) Solr  B) Lucene  C) Hadoop  D) Kafka
**Answer: B**

**2. For exact matching on a status code field, use:**
A) `text` with `match`  B) `keyword` with `term`  C) `nested`  D) `geo_point`
**Answer: B**

**3. Which clause does NOT affect scoring?**
A) `must`  B) `should`  C) `filter`  D) `match`
**Answer: C**

**4. Default refresh interval:**
A) 100 ms  B) 1 s  C) 30 s  D) 5 min
**Answer: B**

**5. Cluster status yellow means:**
A) A primary is unassigned  B) Replicas are unassigned  C) Cluster is down  D) Security disabled
**Answer: B**

**6. Best method for deep pagination:**
A) Huge `from`  B) `search_after` with PIT  C) `size: 100000`  D) Increase `max_result_window`
**Answer: B**

**7. Can you change the number of primary shards of an existing index in place?**
A) Yes  B) No (split/shrink/reindex)  C) Only with replicas 0  D) Only on master
**Answer: B**

**8. To avoid cross-object matches in arrays of objects, use:**
A) `object`  B) `nested`  C) `flattened`  D) `keyword`
**Answer: B**

**9. Which tool manages time-based index rollover and retention?**
A) SLM  B) ILM  C) CCR  D) ECK
**Answer: B**

**10. Heap size guideline:**
A) 100% of RAM  B) ≤ 50% of RAM and ≤ ~31 GB  C) 4 GB always  D) 75% of RAM
**Answer: B**

**11. What fuses BM25 and vector results?**
A) RRF  B) HNSW  C) ILM  D) CCS
**Answer: A**

**12. Which is a backup?**
A) Replicas  B) Snapshots  C) Refresh  D) Translog
**Answer: B**

**13. Aggregations and sorting rely on:**
A) Inverted index only  B) Doc values  C) Translog  D) Cluster state
**Answer: B**

**14. Best HA master configuration:**
A) 1 master  B) 2 masters  C) 3 dedicated master-eligible nodes  D) All data nodes only
**Answer: C**

**15. A leading wildcard query `*phone` is:**
A) Fast  B) Slow (scans the term dictionary)  C) Not allowed  D) Cached forever
**Answer: B**

**16. `_bulk` request body format:**
A) JSON array  B) NDJSON  C) XML  D) CSV
**Answer: B**

**17. Which Elasticsearch feature stores queries as documents?**
A) Percolator  B) Transform  C) Rollup  D) Alias
**Answer: A**

**18. 429 `es_rejected_execution_exception` means:**
A) Auth failure  B) Thread pool queue is full  C) Bad mapping  D) Index missing
**Answer: B**

**19. To make a mapping change with zero downtime:**
A) Edit the field type  B) New index + reindex + alias swap  C) Restart nodes  D) Delete the index
**Answer: B**

**20. BM25 length normalization means:**
A) Longer fields score higher  B) Matches in shorter fields score higher  C) Length is ignored  D) Only numbers are normalized
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Using Elasticsearch as the only source of truth.**
2. **Relying on dynamic mapping** in production.
3. **`term` queries on `text` fields.**
4. **Putting structured conditions in `must`** instead of `filter`.
5. **Oversharding** (too many small shards).
6. **Deep pagination with `from/size`.**
7. **Leading wildcards and regexes** on large indices.
8. **Aggregating on `text`** or enabling fielddata.
9. **Mapping explosion** from dynamic keys.
10. **Single-doc indexing requests** instead of `_bulk`.
11. **`refresh=true`** on every write.
12. **No ILM**, letting indices and disks grow forever.
13. **Treating replicas as backups**; no snapshot testing.
14. **Heap too large (>31 GB) or too small**, no RAM left for page cache.
15. **Exposing 9200 publicly / security disabled.**
16. **Passing user input directly into `query_string`.**
17. **Even number of master-eligible nodes / no dedicated masters.**
18. **Ignoring disk watermarks** until indices go read-only.
19. **Not testing analyzers** with `_analyze`.
20. **Not planning reindexing** and alias-based deployments.
21. **Sorting by `_score` without a tiebreaker** in `search_after`.
22. **No monitoring** of heap, rejections, shard counts and slow logs.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You treat the index as a **derived, rebuildable view** and design the sync (outbox/CDC, external versions).
- You design **mappings and analyzers** deliberately and test them with `_analyze`.
- You use `filter` context, avoid expensive query patterns, and read `profile`/`explain` output.
- You size **shards and heap** from data and use ILM, tiers and rollover.
- You explain the **query-then-fetch**, write path, refresh/flush/merge, and consistency model correctly.
- You plan **zero-downtime reindexing** with aliases and validate it.
- You handle **cluster incidents** (red/yellow, watermarks, 429s, circuit breakers) with a method.
- You measure relevance with judged sets, `_rank_eval` and A/B tests, and know hybrid/vector search trade-offs.
- You secure clusters (TLS, RBAC, API keys, DLS) and never expose raw DSL to clients.
- You compare Elasticsearch honestly with OpenSearch, PostgreSQL FTS and SaaS search engines.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Daily requests
```http
GET _cluster/health            GET _cat/indices?v          GET _cat/shards?v
GET _cat/nodes?v               GET _cluster/allocation/explain
GET idx/_mapping               GET idx/_settings           POST idx/_refresh
POST _analyze { "analyzer": "...", "text": "..." }
GET idx/_search { "profile": true, "query": { ... } }
POST _reindex  { "source": {...}, "dest": {...} }
POST _aliases  { "actions": [ ... ] }
```

### Query checklist
`bool` with `must` for text relevance • `filter` for exact conditions • boosts in `should` • `_source` filtering • `search_after` for deep pages • `track_total_hits` only if needed • `size: 0` for pure aggregations.

### Index design checklist
Explicit mappings (`dynamic: strict`) • `keyword` vs `text` decided per field • multi-fields • analyzers tested • shard size 10-50 GB • replicas ≥ 1 • aliases + templates • ILM/data streams • `_meta.version`.

### Operations checklist
3 dedicated masters • heap ≤ 50% RAM/≤ 31 GB • swap off • zone awareness • disk alerts at 75-80% • SLM snapshots + restore drills • slow logs • monitoring dashboards • rolling-upgrade runbook • security on.

### Pattern quick picks
Autocomplete → edge-ngram/`search_as_you_type`/`completion` • Facets → `terms` agg + `post_filter` • Deep paging → PIT + `search_after` • Logs → data streams + ILM • Sync → outbox/CDC + external version • Semantic → `dense_vector`/`semantic_text` + hybrid RRF.

### Interview strategy
1. Clarify data volume, query patterns, freshness and relevance needs.
2. Propose the index design (mappings, analyzers, shards).
3. Show the key query (bool + filter + aggregation) briefly.
4. Explain sync, consistency and failure handling.
5. Discuss operations: sizing, ILM, monitoring, security, backups.
6. Close with a measured result (latency, relevance, cost).

### Final checklist before the interview
- [ ] Explain the inverted index, analysis, BM25, and why search is near real-time.
- [ ] Choose `text` vs `keyword` vs `nested` and write a `bool` query with filters.
- [ ] Explain shards, replicas, node roles, cluster health, and allocation.
- [ ] Explain query-then-fetch and the write path (translog, refresh, flush, merge).
- [ ] Do pagination correctly (`search_after` + PIT), and bulk indexing properly.
- [ ] Plan zero-downtime reindexing with aliases; use ILM and data streams.
- [ ] Size shards and heap; troubleshoot yellow/red, 429s, circuit breakers, watermarks.
- [ ] Explain hybrid/vector search and RAG retrieval with permissions.
- [ ] Describe the DB-to-Elasticsearch sync strategy and consistency risks.
- [ ] Prepare one relevance story and one incident story with numbers.
