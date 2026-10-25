# Vector Databases Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **2025–2026 vector search landscape**: **pgvector 0.7 / 0.8 (HNSW, IVFFlat, halfvec, sparsevec, binary quantisation, iterative scans)**, **Qdrant 1.x**, **Weaviate 1.2x**, **Milvus 2.4 / 2.5 (and Zilliz Cloud)**, **Pinecone (serverless)**, **OpenSearch / Elasticsearch 8.x kNN and hybrid search**, **MongoDB Atlas Vector Search**, **Redis (RediSearch vector)**, **Chroma**, **LanceDB**, **FAISS / hnswlib / ScaNN / DiskANN** as libraries, plus managed offerings from the big clouds (Azure AI Search, Vertex AI Vector Search, Amazon S3 Vectors / OpenSearch Serverless / Aurora pgvector). **Product features, limits, defaults, benchmark numbers and pricing change quickly**: anything marked "verify" should be checked in the vendor's current docs. The concepts (embeddings, distance metrics, ANN indexes, recall / latency / memory trade-offs, filtering, hybrid search, sharding / replication, consistency, evaluation) are stable. Examples use the sample name **Ritesh Kumar** and small product-catalogue / support-document corpora.
> This file covers what vector databases are and why they exist, embeddings and distance metrics (cosine, dot product, Euclidean, Hamming), exact vs approximate nearest neighbour search, ANN index families (Flat, HNSW, IVF, PQ / SQ / binary quantisation, DiskANN / Vamana, LSH, ScaNN) with their parameters and trade-offs, metadata filtering (pre / post / in-index filtering), hybrid (dense + sparse / BM25) search, multi-vector / late-interaction, CRUD and consistency models, sharding / replication / multi-tenancy, storage layout (memory, disk, tiered / object storage), pgvector vs dedicated engines vs search engines, embedding model selection and migration, dimension reduction (Matryoshka), RAG integration and chunk metadata design, evaluation (recall@k against exact search, latency percentiles, throughput, filtered recall), benchmarking methodology, operations (backups, upgrades, monitoring, cost), security (RBAC, tenant isolation, encryption, PII), and architectural decisions. Related topics: LLMs and RAG in `066_LLM-and-RAG.md`, generative AI overview in `063_Generative-AI.md`, LangChain in `068_LangChain.md`, AI agents in `069_AI-Agents.md`, model serving in `073_Model-Serving-and-Inference.md`, NLP embeddings in `../10_AI_and_ML/059_NLP.md`, Hugging Face in `../10_AI_and_ML/062_Hugging-Face.md`, PostgreSQL in `../04_Database/028_PostgreSQL.md`, Elasticsearch in `../04_Database/032_Elasticsearch.md`, Redis in `../04_Database/031_Redis-and-Caching.md`, MongoDB in `../04_Database/030_MongoDB.md`, SQL in `../04_Database/026_SQL.md`, system design in `../09_System_Design/053_System-Design.md`.

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

### Q1. What is a vector database? *(Must-know)*
A database designed to **store high-dimensional vectors (embeddings) together with metadata and to answer "find the most similar vectors" queries quickly**. Instead of matching exact values (`WHERE id = 5`), it ranks items by distance or similarity in vector space. It is the retrieval layer behind semantic search, RAG, recommendations, image / audio similarity and anomaly detection.

### Q2. What is an embedding? *(Must-know)*
A dense numeric vector (e.g., 384, 768, 1024, 1536 or 3072 floats) produced by a model so that **semantically similar inputs map to nearby vectors**. Text, images, audio, code and products can all be embedded. "Refund policy" and "how to get my money back" end up close together.

### Q3. Why not just use a normal database?
Relational / document stores index scalar values with B-trees or hash indexes; they cannot efficiently answer nearest-neighbour queries in hundreds of dimensions. Scanning every row and computing distances is O(N·d), which is fine for thousands of vectors but too slow for millions at low latency. Vector DBs add **ANN indexes** designed for this.

### Q4. Distance and similarity metrics *(Must-know)*
| Metric | Formula / idea | Use |
|---|---|---|
| Cosine similarity | `a·b / (‖a‖‖b‖)`; angle only | Text embeddings (most common) |
| Dot (inner) product | `a·b`; angle + magnitude | Recommenders; same as cosine if vectors are normalised |
| Euclidean (L2) | `‖a−b‖` | Image features, some models |
| Manhattan (L1) | `Σ|aᵢ−bᵢ|` | Sparse / robust cases |
| Hamming | Differing bits | Binary-quantised vectors |
Use the metric your embedding model was trained for.

### Q5. Normalisation
Scaling a vector to unit length (`v / ‖v‖`). After normalisation, cosine similarity = dot product, and L2 distance is a monotonic function of cosine. Normalise at write time and query time so you can use fast inner-product indexes.

### Q6. Exact vs approximate nearest neighbour (kNN vs ANN) *(Must-know)*
Exact kNN (brute force / **Flat** index) compares the query to every vector: perfect recall, slow at scale. ANN indexes (HNSW, IVF, PQ…) examine only a small subset and return results that are *very likely* the true neighbours, trading a little **recall** for large gains in speed and memory.

### Q7. What is recall in ANN?
`recall@k = |ANN top-k ∩ exact top-k| / k`. A recall of 0.95 means 95% of the true nearest neighbours were returned. You tune index parameters to hit a recall target (often 0.95–0.99) at acceptable latency.

### Q8. The main building blocks of a vector DB
Vector storage, ANN index, metadata storage / payload, filtering engine, query API (similarity + filters), CRUD operations, persistence / replication, and often hybrid (keyword) search and multi-tenancy.

### Q9. A typical record
```json
{
  "id": "doc-42#chunk-3",
  "vector": [0.012, -0.044, ...],
  "payload": {"doc_id": "doc-42", "title": "Returns Policy", "tenant": "acme", "lang": "en", "updated_at": "2025-05-01", "text": "Refunds are processed within 7 days."}
}
```

### Q10. Popular options (overview)
- **Extensions / existing DBs**: pgvector (PostgreSQL), MongoDB Atlas Vector Search, Redis, OpenSearch / Elasticsearch, Cassandra / AstraDB, SQL Server, Oracle.
- **Purpose-built**: Pinecone, Qdrant, Weaviate, Milvus / Zilliz, Chroma, LanceDB, Vespa.
- **Libraries**: FAISS, hnswlib, ScaNN, Annoy, DiskANN.

### Q11. FAISS vs a vector database
FAISS is a **library** for in-process similarity search (indexes in memory, no built-in server, replication, filtering engine or CRUD durability). Vector DBs wrap ANN indexes with storage, APIs, filtering, scaling, security and operations. Use FAISS for prototypes, batch jobs or embedded search.

### Q12. Basic workflow
1. Choose an embedding model.
2. Chunk and embed documents.
3. Upsert vectors + metadata.
4. Build / maintain the index.
5. Embed the query with the **same** model.
6. Search top-k (with filters).
7. Use results (RAG prompt, recommendations, UI).

### Q13. A minimal example with FAISS
```python
import faiss, numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-small-en-v1.5")
docs = ["Refunds take 7 business days.", "Reset password in Settings.", "We ship across India."]
X = model.encode(docs, normalize_embeddings=True).astype("float32")
index = faiss.IndexFlatIP(X.shape[1])         # inner product on normalised vectors = cosine
index.add(X)
q = model.encode(["how long do refunds take?"], normalize_embeddings=True).astype("float32")
scores, ids = index.search(q, 2)
print([(docs[i], float(s)) for i, s in zip(ids[0], scores[0])])
```

### Q14. A minimal example with Chroma
```python
import chromadb
client = chromadb.PersistentClient(path="./db")
col = client.get_or_create_collection("faq", metadata={"hnsw:space": "cosine"})
col.add(ids=["1", "2"], documents=["Refunds take 7 days.", "Reset password in Settings."],
        metadatas=[{"lang": "en"}, {"lang": "en"}])
print(col.query(query_texts=["money back"], n_results=1, where={"lang": "en"}))
```

### Q15. A minimal example with pgvector
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE items (id bigserial PRIMARY KEY, content text, embedding vector(384));
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
SELECT id, content, 1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM items ORDER BY embedding <=> '[0.1, 0.2, ...]' LIMIT 5;
```
Operators: `<->` L2, `<#>` negative inner product, `<=>` cosine distance.

### Q16. Metadata filtering (why it matters)
Restrict results by attributes (tenant, language, date, category, permissions) *during* search. It's essential for multi-tenant apps, access control and relevance ("only 2025 policies").

### Q17. Hybrid search (intro)
Combine **keyword (BM25 / sparse)** and **vector (dense)** search and fuse results (e.g., reciprocal rank fusion). Improves handling of IDs, codes and rare terms while keeping semantic recall.

### Q18. Top-k and thresholds
`k` = number of results. Add a similarity threshold to avoid returning irrelevant matches. Remember that "nearest" always exists, even when nothing is truly relevant, so thresholds / re-ranking / abstention matter.

### Q19. CRUD in vector DBs
Create / upsert (insert or replace by ID), read by ID, search, update (vector and/or payload), delete (by ID or filter). Some indexes handle deletes lazily (tombstones) and need compaction / rebuilds.

### Q20. Index build time vs query time
Building an index (especially HNSW / IVF training) takes time and memory but makes queries fast. Many engines build incrementally; some require periodic optimisation / vacuum.

### Q21. Dimensionality
Dimensions = embedding length. Higher = more expressive but more storage / compute (`bytes ≈ N × d × 4` for FP32). Common: 384 (MiniLM / BGE-small), 768, 1024, 1536, 3072.

### Q22. Memory estimation (quick)
Raw vectors: `N × d × 4 bytes` (FP32). 1M × 768 × 4 ≈ 3.07 GB. HNSW adds graph links (roughly 8–64 bytes per vector per layer-0 neighbour set; commonly +20–50%). Quantisation can cut raw vector size 4–32×.

### Q23. Common use cases
RAG / semantic search, recommendations, duplicate / near-duplicate detection, image / video similarity, anomaly detection, personalization, code search, chat memory, product matching, fraud / entity resolution.

### Q24. Embedding models (examples)
OpenAI `text-embedding-3-small/large`, Cohere Embed, Voyage AI, Google embeddings, open models (BGE, E5, GTE, Nomic, Jina, Snowflake Arctic, MiniLM), multilingual variants, CLIP / SigLIP for images, code-specific models. Anthropic's Claude API doesn't provide embeddings (use a separate provider). Verify current MTEB leaders for your language.

### Q25. Same model for index and query
Vectors from different models live in incompatible spaces. Always use the **same model (and same preprocessing / prefixes)** for documents and queries; changing models requires re-embedding everything.

### Q26. Prefixes and instructions
Some models need `"query: "` / `"passage: "` prefixes or instruction strings for queries vs documents (E5, BGE, Nomic). Missing prefixes silently reduce quality.

### Q27. Chunking basics (links to RAG)
Embed meaningful chunks (200–800 tokens) with overlap and store chunk metadata (document ID, position, title, version, ACLs) so you can cite, update and delete precisely.

### Q28. IDs and idempotency
Use deterministic IDs (e.g., `doc_id#chunk_index` or content hash) so re-ingestion upserts instead of duplicating.

### Q29. Persistence
Some tools are in-memory only (default FAISS); production vector DBs persist to disk / object storage with write-ahead logs and snapshots. Know your durability guarantees before relying on it.

### Q30. How to choose as a beginner
Prototype: Chroma / FAISS / LanceDB. Already on Postgres and < ~10M vectors: **pgvector**. Need managed simplicity: Pinecone / cloud service. Need rich filtering and self-hosting: Qdrant / Weaviate / Milvus. Already on Elasticsearch / OpenSearch and want hybrid: use its vector features.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. HNSW (Hierarchical Navigable Small World) *(Must-know)*
A multi-layer proximity graph. Upper layers are sparse "express lanes"; the bottom layer contains all vectors. Search starts at the top, greedily moves toward the query, drops a layer, and at layer 0 explores a candidate set of size `efSearch`. Parameters: `M` (links per node), `efConstruction` (build-time candidate list), `efSearch` / `ef` (query-time list). Higher values → better recall, more memory / latency / build time. Default choice in most engines.

### Q32. IVF (Inverted File index) *(Must-know)*
Cluster vectors with k-means into `nlist` cells; at query time, probe the `nprobe` closest centroids and scan only vectors in those cells. Lower memory than HNSW; recall depends on `nprobe`; needs a **training** step on representative data and may need re-training as data drifts.

### Q33. Product Quantization (PQ)
Split each vector into `m` sub-vectors, learn a codebook per subspace (e.g., 256 centroids → 1 byte), and store only code IDs. Distances are approximated with lookup tables. Compression of 10–64× with some recall loss; often combined as **IVF-PQ** or with re-scoring on full vectors.

### Q34. Scalar & binary quantisation
Scalar quantisation (SQ8) stores each dimension as int8 (4× smaller). Binary quantisation stores 1 bit per dimension (32× smaller) and uses Hamming distance, then **re-scores** top candidates with full-precision vectors. Works well for high-dimensional modern embeddings; always validate recall.

### Q35. Flat index
Brute-force exact search. 100% recall, simple, great up to ~100k vectors (or more with GPUs / SIMD), and as a **ground truth** for measuring ANN recall.

### Q36. Choosing among indexes (rule of thumb)
| Scale / need | Choice |
|---|---|
| < 100k vectors | Flat |
| 100k–100M, low latency, RAM available | HNSW |
| Memory-constrained, very large | IVF-PQ / SQ / binary + re-score |
| Disk-based billion scale | DiskANN / Vamana style |
| Frequently changing data | HNSW with incremental inserts (or segment-based) |

### Q37. pgvector index choices
`ivfflat` (needs data first, set `lists`, tune `probes`) and `hnsw` (tune `m`, `ef_construction`, `hnsw.ef_search`). HNSW generally gives better speed-recall; IVFFlat builds faster and uses less memory. Types: `vector` (FP32), `halfvec` (FP16), `bit`, `sparsevec`.

### Q38. pgvector tuning examples
```sql
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
SET hnsw.ef_search = 100;                               -- per session / transaction
CREATE INDEX ON items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 1000);
SET ivfflat.probes = 20;
```
Rule of thumb for IVFFlat `lists`: rows/1000 up to ~1M rows, then `sqrt(rows)` (verify against docs).

### Q39. Filtered search approaches *(Must-know)*
- **Post-filtering**: ANN first, then filter → may return fewer than `k` (or zero) when the filter is selective.
- **Pre-filtering**: filter first, then brute-force / index within the subset → exact but slow for large subsets.
- **In-index (filtered traversal)**: engine integrates filter into graph traversal (Qdrant, Weaviate, Milvus, Elasticsearch, pgvector iterative scans) for good recall with selective filters.
Always test **filtered recall** and latency with real filters.

### Q40. Payload / metadata indexes
Create indexes on frequently filtered fields (Qdrant payload index, Milvus scalar index, Elasticsearch mappings, Postgres B-tree / GIN). Without them, filtering scans payloads and slows queries.

### Q41. Hybrid search implementations
- Pinecone: sparse-dense vectors.
- Weaviate: `hybrid` query with `alpha` (0 = BM25, 1 = vector).
- Qdrant: sparse + dense named vectors, query fusion (RRF).
- Milvus: multi-vector search with RRF / weighted rankers.
- Elasticsearch / OpenSearch: BM25 + kNN with RRF / linear combination.
- Postgres: `tsvector` full-text + pgvector, fused in SQL.

### Q42. Reciprocal Rank Fusion
`score(d) = Σ 1 / (k + rank_i(d))` (k≈60). Combine rankings from multiple retrievers without needing comparable score scales.

### Q43. Re-ranking after retrieval
Retrieve 20–100 candidates by ANN / hybrid, then re-rank with a cross-encoder or LLM to keep the best 3–8. Improves precision; adds latency.

### Q44. Named / multiple vectors per record
Store several embeddings per item (title vs body, text vs image) in named vector fields (Qdrant, Weaviate, Milvus) and query specific ones or fuse them.

### Q45. Namespaces / collections / tenants
Logical separation: Pinecone namespaces, Qdrant collections (or payload-based multitenancy), Weaviate multi-tenancy, Milvus partitions, Postgres schemas / `tenant_id` columns. Choose isolation vs efficiency trade-offs.

### Q46. Upserts and deletes
Upsert by ID replaces vector + payload. Deletes may be soft (tombstones) until compaction; HNSW graphs may degrade with many deletions, requiring rebuild or periodic optimisation. Plan for deletion workloads (GDPR).

### Q47. Consistency (basics)
Some systems are strongly consistent per write; others are eventually consistent (new vectors visible after seconds), especially managed / distributed ones. Know your engine's "read-your-writes" behaviour for user-facing flows.

### Q48. Batch ingestion
Upsert in batches (e.g., 100–1000 vectors), parallelise with workers, handle rate limits and retries idempotently, and monitor ingestion lag. Build or optimise the index after bulk loads when the engine recommends it.

### Q49. Evaluating a vector index
Create ground truth with Flat search on a sample of queries; measure recall@k, latency (p50 / p95 / p99), QPS, memory and build time while varying parameters (`efSearch`, `nprobe`). Choose the cheapest configuration meeting the recall target.

### Q50. Evaluating end-to-end retrieval
Index recall isn't enough: measure **retrieval relevance** with labelled queries (Recall@k, MRR, nDCG) because the embedding model and chunking dominate quality. See `066_LLM-and-RAG.md`.

### Q51. Python client examples (Qdrant)
```python
from qdrant_client import QdrantClient, models
qc = QdrantClient(url="http://localhost:6333")
qc.recreate_collection("faq", vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE))
qc.upsert("faq", points=[models.PointStruct(id=1, vector=vec, payload={"tenant": "acme", "lang": "en", "text": "..."})])
hits = qc.query_points("faq", query=qvec, limit=5,
        query_filter=models.Filter(must=[models.FieldCondition(key="tenant", match=models.MatchValue(value="acme"))])).points
```

### Q52. Python client examples (Pinecone, conceptual)
```python
from pinecone import Pinecone
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index = pc.Index("faq")
index.upsert(vectors=[{"id": "1", "values": vec, "metadata": {"tenant": "acme"}}], namespace="acme")
res = index.query(vector=qvec, top_k=5, include_metadata=True, namespace="acme", filter={"lang": {"$eq": "en"}})
```
(SDK details change; verify current API.)

### Q53. Python client examples (Weaviate, conceptual)
Define a collection with properties and vectorizer / vector config; `collection.query.near_vector(...)`, `collection.query.hybrid(query=..., alpha=0.5)`; filters via `Filter.by_property("lang").equal("en")`. Verify the v4 client API.

### Q54. Choosing dimension and model cost
Higher-dimensional embeddings cost more to store and search; truncated Matryoshka vectors (e.g., 3072 → 768) or quantisation can cut cost with modest quality loss. Evaluate on your data.

### Q55. Sparse vectors
High-dimensional, mostly-zero vectors (BM25 term weights, SPLADE). Stored as (index, value) pairs; support inverted-index style search. Combine with dense for hybrid.

### Q56. Image / multimodal search
Embed images with CLIP / SigLIP; embed text queries into the same space; search images by text or by image. Store thumbnails / URLs in the payload, not in the vector DB.

### Q57. Recommendation use cases
Item embeddings from collaborative filtering or two-tower models; user-vector → nearest items; filter out seen items; diversify results (MMR). Dot product often used with unnormalised vectors.

### Q58. Duplicate detection
Embed items, find neighbours above a similarity threshold, cluster, and dedupe. Combine with exact hashing for identical content.

### Q59. Storing text in the vector DB vs elsewhere
Storing chunk text in the payload simplifies RAG. For large corpora or heavy documents, store IDs + minimal payload and fetch text from an object store / relational DB to reduce index size and cost.

### Q60. Testing locally
Use Docker (Qdrant, Weaviate, Milvus standalone, pgvector image), small fixtures, deterministic embeddings (or cached) in tests, and a Flat index to validate behaviour before tuning ANN.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. HNSW internals and tuning *(Must-know)*
Insertion picks a random max layer (exponential distribution), finds neighbours via greedy search with `efConstruction`, connects up to `M` links (layer 0 often `2M`), and prunes with a heuristic that keeps diverse neighbours. Query uses `efSearch`. Memory ≈ vectors + links. Tuning: raise `M` for high-dimensional / hard data (16–64), `efConstruction` 100–400 for build quality, `efSearch` ≥ `k` and tuned per recall target. Deletes mark nodes; heavy churn warrants rebuilds.

### Q62. IVF-PQ and re-scoring pipeline
Coarse quantiser (IVF) narrows candidates, PQ codes give compact approximate distances (ADC with lookup tables), then **re-score the top candidates with full vectors** (kept on disk or in RAM) to recover accuracy. Parameters: `nlist`, `nprobe`, `m` (subquantisers), bits per code, re-score depth.

### Q63. DiskANN / Vamana
Graph index designed for SSD: store compressed vectors (PQ) in RAM for navigation and full vectors / graph on disk, minimising random reads. Enables billion-scale search on a single machine with modest RAM. Used by Azure and others (verify specific product support).

### Q64. ScaNN, LSH, Annoy
ScaNN (Google): anisotropic quantisation + efficient scoring. LSH: hash similar vectors into buckets (simple, weaker recall / efficiency in modern high-d embeddings). Annoy: random-projection trees, memory-mapped, read-mostly. HNSW / IVF-PQ / DiskANN dominate production.

### Q65. Quantisation strategies and validation
SQ8 (4×), PQ (≥16×), binary (32×) + re-score, FP16 (`halfvec`). Validate on **your embeddings** (recall@k vs FP32 Flat) because behaviour depends on model and dimension; some models are trained for quantisation-friendly output (binary / Matryoshka).

### Q66. Matryoshka representation learning
Models trained so that prefixes of the vector (e.g., first 256 of 1024 dims) are still good embeddings. Use short vectors for fast first-pass retrieval and full vectors for re-scoring (adaptive retrieval) or just to cut storage.

### Q67. Filtered ANN pitfalls *(Must-know)*
Highly selective filters can break graph connectivity or cause post-filtering to return too few results. Engines mitigate with filter-aware traversal, payload indexes, extra edges (Qdrant), partitioning, or falling back to exact scan when the filtered set is small. Measure recall by **filter selectivity** (1%, 10%, 50%).

### Q68. pgvector filtered search issues & iterative scans
With HNSW, `WHERE` filters apply after the index scan, which can return fewer rows than `LIMIT`. Fixes: raise `hnsw.ef_search`, use partial indexes / partitioning by tenant, **iterative index scans** (pgvector 0.8+: `hnsw.iterative_scan`), or exact search when filtered sets are small. Verify version behaviour.

### Q69. Partitioning strategies
Partition by tenant, time or category so each partition has its own index: smaller indexes, faster filtered search, easier retention, simpler deletes. Too many tiny partitions waste overhead.

### Q70. Multi-tenancy patterns *(Must-know)*
| Pattern | Pros | Cons |
|---|---|---|
| Collection / index per tenant | Strong isolation, easy delete / export | Overhead for many small tenants |
| Shared index + tenant filter | Efficient for many tenants | Isolation relies on filters; noisy neighbours |
| Hybrid by tenant size | Balanced | More complexity |
Enforce tenant filters server-side (never trust client-provided filters); test for cross-tenant leakage.

### Q71. Sharding and replication
Shard vectors across nodes (hash / range / by tenant) for scale; each shard has its own ANN index; queries scatter-gather and merge top-k (increase per-shard `k` slightly). Replicas improve availability and read throughput. Rebalancing and resharding are operationally heavy: plan shard counts.

### Q72. Segment-based architectures (LSM-style)
Milvus, Qdrant and others write to mutable segments, flush to immutable indexed segments, and merge / compact in the background. Benefits: fast ingestion and deletes; trade-offs: query fan-out across segments, compaction CPU / IO, brief staleness for unindexed data (brute-force scanning of growing segments).

### Q73. Consistency levels (e.g., Milvus)
Strong, bounded staleness, session, eventual: trade freshness vs latency. For RAG after document upload, choose a level that makes new content searchable when users expect it.

### Q74. Write path & durability
WAL / message queue (Pulsar / Kafka / internal log), memtable / growing segment, flush to object storage, index build, compaction. Understand where data lives at each stage for recovery and backup.

### Q75. Storage tiering and object-storage-native designs
Hot (RAM / NVMe), warm (SSD), cold (S3 / blob). Serverless designs (Pinecone serverless, Turbopuffer, LanceDB, S3 Vectors: verify) separate storage and compute for cost; first-query latency and caching behaviour differ. Great for large, infrequently queried corpora.

### Q76. Search engine vs dedicated vector DB
Elasticsearch / OpenSearch: mature lexical search, aggregations, security, ops; vector features (HNSW, quantisation, hybrid) good for many workloads. Dedicated engines: vector-first features, simpler scaling for vectors, often better filtered-vector performance. Decide by whether you already operate the search cluster, hybrid needs, scale and team skills.

### Q77. pgvector vs dedicated vector DB (decision) *(Must-know)*
pgvector: transactional consistency with relational data, simplicity, joins, existing backups / HA, great up to ~10M (sometimes 50M+ with tuning, partitioning and enough RAM). Dedicated: better at very large scale, high QPS, advanced filtering, sharding, vector-specific operations, and purpose-built tooling. Benchmark your workload; do not decide from blog posts alone.

### Q78. Embedding model migration (zero downtime)
1) Create a new index / column for the new model. 2) Backfill embeddings in batches with rate limits. 3) Dual-write new updates. 4) Shadow-query both and compare offline metrics. 5) Switch traffic with a flag. 6) Retire the old index. Store `embedding_model` and version in metadata.

### Q79. Re-embedding cost control
Hash chunk text and skip unchanged chunks, batch API calls, use cheaper models for low-value content, and cache embeddings keyed by (model, text hash).

### Q80. Query-time embedding latency & caching
Query embedding adds a network hop (API) or compute (local model). Cache embeddings for frequent queries, co-locate the embedding service, batch where possible, and consider smaller local models for latency-critical paths.

### Q81. Search quality beyond ANN
Improve with: better chunking, domain-tuned embeddings, query rewriting, hybrid + re-ranker, metadata boosting (freshness, authority), deduplication, and MMR for diversity. ANN parameter tuning rarely beats these.

### Q82. MMR (Maximal Marginal Relevance)
Select results balancing relevance and diversity: `argmax λ·sim(d, q) − (1−λ)·max sim(d, selected)`. Reduces near-duplicate results in RAG context.

### Q83. Range / threshold and radius search
Return all vectors within a distance threshold (supported in several engines). Useful for dedupe and "match / no match" decisions; choose thresholds empirically per model.

### Q84. Multi-vector (late interaction) storage
ColBERT-style: store many token vectors per document and score via MaxSim. Higher accuracy, much larger storage. Supported natively in some engines (Qdrant multivector, Vespa, Weaviate multi-vector: verify) or via compressed approximations (PLAID).

### Q85. Vector search in Redis / MongoDB / Elasticsearch / SQL engines
Pros: reuse existing infra, unified filtering / transactions, simpler ops. Cons: limits in index types, scale, tuning options, or filtered recall. Validate with benchmarks on your data.

### Q86. Observability metrics
Query latency percentiles, QPS, error rate, recall probes (periodic exact-vs-ANN checks), index memory / disk, segment counts, compaction backlog, ingestion lag, cache hit ratios, replication lag. Alert on regressions after parameter or data changes.

### Q87. Backups, restore, DR
Snapshots of vectors + payloads (or rebuild from source-of-truth + embeddings cache), point-in-time recovery if supported, cross-region replicas, tested restore procedures, and versioned metadata to rebuild indexes deterministically. Treat the vector DB as derivable when raw data and embeddings are preserved elsewhere.

### Q88. Upgrade and index rebuild planning
Index formats may change between versions; plan blue / green clusters, canary queries comparing results, and rebuild windows. Keep parameter configs in IaC.

### Q89. Security & access control
Authenticated APIs / API keys / OIDC, RBAC per collection / tenant, TLS, encryption at rest, VPC / private endpoints, audit logs, secret rotation. Remember **vectors can leak information** about the source text; treat them as sensitive as the text itself.

### Q90. PII and compliance
Avoid embedding unnecessary PII; support deletion by user / document ID (including backups per policy); track lineage from vector to source; honour retention; evaluate cross-border data transfer for managed services.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Designing a vector search platform *(Must-know)*
Requirements (QPS, latency SLO, corpus size and growth, filters, multi-tenancy, freshness, recall target, budget) → choose engine(s) → ingestion pipeline (idempotent, incremental, backfill, DLQ) → embedding service (model versions, batching, caching) → index design (HNSW / IVF-PQ params, partitions, quantisation) → query API (filters, hybrid, rerank, ACL) → observability and evaluation → capacity planning and cost → security and governance → DR and upgrade plans.

### Q92. Capacity planning
Estimate vectors `N`, dimension `d`, bytes per component (FP32 4 / FP16 2 / int8 1 / bit 1/8), index overhead (HNSW graph ≈ `N × M × 2 × 4 bytes` for layer 0 as a rough guide), replicas, and headroom (30–50%). Memory-bound engines need RAM ≈ vectors + graph; disk-based designs need fast NVMe and RAM for caches / compressed vectors. Benchmark to confirm.

### Q93. Cost modelling
Storage (vectors + payload + replicas + snapshots), compute (index build, queries), memory (dominant for HNSW), embedding costs, data transfer, managed service pricing (per read unit / storage / capacity). Compare self-hosted pgvector vs managed serverless using projected QPS and size; revisit as scale changes.

### Q94. Tuning for latency vs recall vs cost
Plot recall–latency curves while sweeping `efSearch` / `nprobe`; adopt quantisation + re-score to cut memory; use smaller dimensions via Matryoshka; shard to parallelise; add caches; adopt tiered storage for cold data. Express targets as SLOs (e.g., p95 < 80 ms at recall@10 ≥ 0.97 for filtered queries).

### Q95. Benchmarking methodology
Use realistic embeddings (your model and data), realistic filters and query distribution, warm-up and steady-state phases, concurrent clients, p50 / p95 / p99, recall vs exact ground truth, ingestion throughput, index build time, resource usage, and failure scenarios. ANN-Benchmarks and vendor charts are indicative; **your data differs**. Report with confidence intervals and configurations.

### Q96. Handling data growth
Plan shard / partition expansion, time-based hot / cold tiers, TTL for ephemeral content, periodic compaction, re-training IVF centroids when distribution shifts, and archival of low-value vectors.

### Q97. Hot-spots and noisy neighbours
Large tenants can dominate resources. Use per-tenant quotas, dedicated shards / collections for big tenants, rate limiting, and priority queues. Monitor per-tenant latency and cost.

### Q98. Consistent hashing & rebalancing
Add nodes with minimal data movement using consistent hashing or virtual shards; throttle rebalancing to protect query SLOs; verify index rebuild requirements after moves.

### Q99. Real-time vs batch freshness
Streaming ingestion (Kafka → embed → upsert) gives near-real-time search but needs backpressure and idempotency; batch ingestion is simpler and cheaper. Define freshness SLOs by use case (support tickets: seconds; policies: hours).

### Q100. Access control designs
Permission metadata on chunks (user / group / tenant IDs) with filters applied server-side; row-level security in Postgres; per-tenant API keys; policy service that expands a user's groups into filter terms (watch filter size limits). Verify no retrieval-time bypass (e.g., via caches or re-rankers).

### Q101. Vector DB + search engine + warehouse architecture
Typical: object store / warehouse as source of truth; embedding pipeline writes to vector DB (+ search index); metadata joins via IDs to relational stores; feature store for recommendations. Keep the pipeline replayable to rebuild indexes.

### Q102. Embedding drift and re-index triggers
New embedding versions, domain drift (new vocabulary), or quality regression. Monitor retrieval metrics on a golden set; schedule re-embedding when gains exceed cost; keep dual indexes during migration.

### Q103. Approximate vs exact for small filtered subsets
When a filter leaves few candidates (< a few thousand), brute-force exact search over the subset is faster and perfectly accurate than traversing a global graph. Many engines switch automatically (cardinality estimation); verify and tune thresholds.

### Q104. Index build strategies at scale
Parallel builds across segments, build offline then swap (blue / green), bulk-load then index, GPU-accelerated builds (CAGRA / cuVS, Milvus GPU indexes: verify), and limits on concurrent compaction to protect query latency.

### Q105. GPU vs CPU vector search
GPUs excel for batch / high-throughput exact or IVF searches and fast index builds; CPU HNSW is cost-effective for online low-latency queries. Consider GPU for offline similarity joins, dedupe pipelines and very high QPS clusters (verify engine support).

### Q106. Vector search for agents & memory
Short-term memory in context; long-term memory in a vector store with metadata (user, time, importance), recency decay, summarisation / consolidation, deduplication, and deletion support. Evaluate retrieval relevance of memories; avoid cross-user leakage.

### Q107. Hybrid + rerank + RAG serving SLOs
Budget latency across embedding (10–50 ms), vector / BM25 search (10–80 ms), re-ranking (30–150 ms), LLM prefill / decode (hundreds of ms+). Parallelise retrieval branches, cache hot queries, cap candidates, and stream generation.

### Q108. Failure modes and resilience
Node loss, replica lag, index corruption, compaction storms, memory pressure (OOM), slow disks, version-incompatible indexes, embedding service outages. Mitigate with replicas, health checks, circuit breakers, graceful degradation (BM25-only fallback), backups and runbooks.

### Q109. Vendor selection checklist
Scale and cost curve, filtering performance, hybrid support, consistency, multi-tenancy, deployment model (SaaS / BYOC / self-hosted), security certifications, regional availability, backup / DR, ecosystem / SDKs, lock-in and export ability, support quality, roadmap. Run a proof-of-concept with your data and queries.

### Q110. Data portability
Keep source documents, chunk definitions, embedding model versions and optionally the vectors themselves (Parquet in object storage) so you can migrate engines or rebuild indexes. Avoid designs where vectors exist only inside one vendor.

### Q111. Evaluating embeddings with the vector DB in the loop
Compare models by retrieval metrics on your labelled queries with the **production index configuration** (quantisation, filters); smaller / quantised vectors may reverse rankings between models.

### Q112. Privacy risks of embeddings
Embeddings can be inverted to partially reconstruct text in some cases; treat as sensitive data, restrict access, encrypt, and consider on-prem / private deployments for confidential corpora.

### Q113. Operational runbooks
Slow queries (check `ef`, filters, segment count, cache), high memory (quantisation, shard split), ingestion lag (batch size, rate limits, compaction), recall drop (index drift, parameter changes), cross-tenant leak (disable endpoints, audit), embedding outage (fallback). Keep dashboards and on-call ownership.

### Q114. Testing strategy
Unit tests for ingestion idempotency and ID generation; integration tests with a real engine in CI; recall regression tests using fixed vectors and ground truth; load tests; chaos tests for node failures; security tests for tenant isolation.

### Q115. Documentation & governance
Document embedding models, chunking rules, index parameters, filter schema, SLOs, owners, access policies, retention and deletion procedures. Review changes through RFCs; track configuration in version control.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Enterprise retrieval platform strategy
Provide a shared retrieval service (ingestion connectors, parsing, chunking policies, embedding service, vector + lexical indexes, ACL enforcement, evaluation harness, observability) so product teams don't each run their own stack. Offer paved-road SDKs and templates; allow exceptions with review.

### Q117. Build / buy / open-source decision
Managed SaaS accelerates delivery and offloads ops but raises cost-at-scale, data-residency and lock-in concerns. Self-hosted open-source (Qdrant, Milvus, Weaviate, pgvector, OpenSearch) offers control and portability but needs SRE capacity. Choose per workload tier; standardise interfaces so engines can change.

### Q118. Multi-region & data residency
Region-local indexes for latency and compliance; replicate globally only non-restricted data; routing by tenant region; consistent embedding versions across regions; DR failover plans; cost of cross-region replication.

### Q119. Governance of knowledge and vectors
Content ownership, quality scores, lifecycle (draft → approved → superseded → deleted), lineage from chunk to source, audit logs for access, and policies for sensitive sources. Ensure deletions propagate to indexes, caches and backups.

### Q120. Total cost of ownership & FinOps
Track cost per 1M vectors, per 1k queries, and per answered question; optimise via quantisation, tiered storage, cache hit rates, right-sized replicas, and lifecycle management. Review quarterly as workloads and vendor pricing evolve.

### Q121. Reliability engineering
SLOs per tier, error budgets, multi-AZ replicas, backpressure on ingestion, graceful fallbacks (keyword search), chaos drills, capacity buffers, runbooks, and post-incident reviews tracked to action items.

### Q122. Roadmap
Phase 1: single-tenant prototype with Flat / HNSW and evaluation set. Phase 2: production hybrid search with filters, ACLs, observability, and CI regression tests. Phase 3: multi-tenant scale, quantisation, tiered storage, migration tooling. Phase 4: advanced features (multi-vector, GPU, personalization), automated re-embedding and cost governance.

### Q123. Organisational ownership
A platform team owns the infrastructure and standards; domain teams own content quality and evaluation sets; security / privacy teams own policies; data engineering owns pipelines. Clear RACI avoids "nobody owns retrieval quality."

### Q124. Future-proofing
Keep embeddings model-agnostic (store model IDs), keep raw content and chunking configs, abstract vector DB access behind an interface, adopt open formats (Parquet) for vector exports, and watch trends (object-storage-native engines, learned sparse, multi-vector, hardware acceleration).

### Q125. Communicating trade-offs to leadership
Frame choices as recall / latency / cost / risk: e.g., "Quantised HNSW on pgvector meets p95 < 100 ms at 0.96 recall for $X/month and keeps data in our Postgres; a dedicated engine would improve filtered recall at 3× cost and add an operational dependency." Back with benchmarks on real data and a phased plan.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Exact vs ANN recall measurement (FAISS)
```python
import faiss, numpy as np
rng = np.random.default_rng(0)
N, d, k = 200_000, 128, 10
X = rng.standard_normal((N, d)).astype("float32"); faiss.normalize_L2(X)
Q = rng.standard_normal((1000, d)).astype("float32"); faiss.normalize_L2(Q)

flat = faiss.IndexFlatIP(d); flat.add(X)
_, truth = flat.search(Q, k)

hnsw = faiss.IndexHNSWFlat(d, 32, faiss.METRIC_INNER_PRODUCT)
hnsw.hnsw.efConstruction = 200; hnsw.add(X)
for ef in (16, 64, 256):
    hnsw.hnsw.efSearch = ef
    _, got = hnsw.search(Q, k)
    recall = np.mean([len(set(a) & set(b)) / k for a, b in zip(got, truth)])
    print(f"efSearch={ef}: recall@{k}={recall:.3f}")
```

### Task 2. IVF-PQ with training and re-scoring idea
```python
nlist, m, nbits = 1024, 16, 8
quant = faiss.IndexFlatIP(d)
ivfpq = faiss.IndexIVFPQ(quant, d, nlist, m, nbits, faiss.METRIC_INNER_PRODUCT)
ivfpq.train(X[:100_000]); ivfpq.add(X)
ivfpq.nprobe = 32
D, I = ivfpq.search(Q, 100)                                        # approximate candidates
# re-score with exact vectors
rescored = [sorted(I[i], key=lambda j: -float(X[j] @ Q[i]))[:k] for i in range(len(Q))]
```

### Task 3. pgvector schema with HNSW, filters and tenant isolation
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE chunks (
  id          bigserial PRIMARY KEY,
  doc_id      text NOT NULL,
  tenant_id   text NOT NULL,
  lang        text NOT NULL,
  updated_at  date NOT NULL,
  content     text NOT NULL,
  embedding   vector(768) NOT NULL
);
CREATE INDEX chunks_hnsw ON chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 128);
CREATE INDEX chunks_tenant ON chunks (tenant_id, lang);

SET hnsw.ef_search = 100;
SET hnsw.iterative_scan = relaxed_order;      -- pgvector 0.8+: keep scanning to satisfy filters (verify)
SELECT id, doc_id, content, 1 - (embedding <=> $1) AS score
FROM chunks
WHERE tenant_id = $2 AND lang = 'en' AND updated_at >= DATE '2025-01-01'
ORDER BY embedding <=> $1
LIMIT 10;
```

### Task 4. Hybrid search in Postgres (full-text + vector, RRF)
```sql
WITH vec AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> $1) AS r
  FROM chunks WHERE tenant_id = $3 ORDER BY embedding <=> $1 LIMIT 40
), txt AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(tsv, plainto_tsquery('english', $2)) DESC) AS r
  FROM chunks WHERE tenant_id = $3 AND tsv @@ plainto_tsquery('english', $2) LIMIT 40
)
SELECT c.id, c.content,
       COALESCE(1.0/(60+vec.r), 0) + COALESCE(1.0/(60+txt.r), 0) AS rrf
FROM chunks c LEFT JOIN vec ON vec.id = c.id LEFT JOIN txt ON txt.id = c.id
WHERE vec.id IS NOT NULL OR txt.id IS NOT NULL
ORDER BY rrf DESC LIMIT 10;
```
(Requires a `tsv tsvector` column with a GIN index.)

### Task 5. Qdrant: collection with quantisation, payload index and filtered search
```python
from qdrant_client import QdrantClient, models
qc = QdrantClient(url="http://localhost:6333")
qc.recreate_collection(
    "docs",
    vectors_config=models.VectorParams(size=768, distance=models.Distance.COSINE),
    hnsw_config=models.HnswConfigDiff(m=16, ef_construct=128),
    quantization_config=models.ScalarQuantization(scalar=models.ScalarQuantizationConfig(
        type=models.ScalarType.INT8, quantile=0.99, always_ram=True)),
)
qc.create_payload_index("docs", field_name="tenant_id", field_schema=models.PayloadSchemaType.KEYWORD)
res = qc.query_points(
    "docs", query=qvec, limit=10,
    query_filter=models.Filter(must=[models.FieldCondition(key="tenant_id", match=models.MatchValue(value="acme"))]),
    search_params=models.SearchParams(hnsw_ef=128, quantization=models.QuantizationSearchParams(rescore=True)),
).points
```

### Task 6. Idempotent ingestion pipeline with content hashing
```python
import hashlib, itertools

def chunk_id(doc_id, idx): return f"{doc_id}#{idx:05d}"
def text_hash(t): return hashlib.sha256(t.encode()).hexdigest()

def ingest(doc_id, chunks, store, embed, model_name, batch=64):
    existing = store.get_hashes(doc_id)                              # {chunk_id: hash}
    todo = [(chunk_id(doc_id, i), c) for i, c in enumerate(chunks) if existing.get(chunk_id(doc_id, i)) != text_hash(c)]
    for i in range(0, len(todo), batch):
        part = todo[i:i + batch]
        vecs = embed([c for _, c in part])
        store.upsert([{"id": cid, "vector": v, "payload": {"doc_id": doc_id, "text": c, "hash": text_hash(c),
                       "embedding_model": model_name}} for (cid, c), v in zip(part, vecs)])
    store.delete_stale(doc_id, keep_ids={chunk_id(doc_id, i) for i in range(len(chunks))})   # removed chunks
```

### Task 7. MMR re-selection for diverse context
```python
import numpy as np
def mmr(q, cands, vecs, k=5, lam=0.7):
    sel, rest = [], list(range(len(cands)))
    sims = vecs @ q
    while rest and len(sel) < k:
        def score(i):
            div = max((vecs[i] @ vecs[j] for j in sel), default=0)
            return lam * sims[i] - (1 - lam) * div
        best = max(rest, key=score); sel.append(best); rest.remove(best)
    return [cands[i] for i in sel]
```

### Task 8. Binary quantisation with re-score (NumPy sketch)
```python
def to_bits(X): return np.packbits((X > 0).astype(np.uint8), axis=1)
def hamming(a, B): return np.unpackbits(np.bitwise_xor(B, a), axis=1).sum(1)

Xb = to_bits(X); qb = to_bits(Q[:1])[0]
cand = np.argsort(hamming(qb, Xb))[:200]                        # coarse: 32x smaller, very fast
final = cand[np.argsort(-(X[cand] @ Q[0]))[:10]]                # re-score with full vectors
```

### Task 9. Embedding migration with dual index and shadow comparison
```python
def shadow_compare(queries, old_search, new_search, labelled, k=5):
    def mrr(search): 
        rr = []
        for q in queries:
            ids = search(q, k); rel = labelled[q]
            rr.append(next((1/(i+1) for i, x in enumerate(ids) if x in rel), 0))
        return sum(rr)/len(rr)
    return {"old_mrr": mrr(old_search), "new_mrr": mrr(new_search)}
# switch via a feature flag only when new >= old on the golden set AND latency/cost are acceptable
```

### Task 10. Load test harness (latency percentiles)
```python
import time, statistics, concurrent.futures as cf
def timed(search, q):
    t = time.perf_counter(); search(q); return (time.perf_counter() - t) * 1000

def load_test(search, queries, concurrency=16, duration_s=30):
    lat, end = [], time.time() + duration_s
    with cf.ThreadPoolExecutor(concurrency) as ex:
        while time.time() < end:
            lat += list(ex.map(lambda q: timed(search, q), queries[:concurrency * 4]))
    lat.sort()
    return {"qps": len(lat) / duration_s, "p50": lat[len(lat)//2], "p95": lat[int(len(lat)*.95)], "p99": lat[int(len(lat)*.99)]}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Results look irrelevant or random
Mismatched embedding model between index and query, missing normalisation / wrong metric, missing prefixes, or corrupted ingestion. Verify the model name stored with vectors, metric config, and test a known pair (query/document) manually.

### D2. Fewer than `k` results with a filter
Post-filtering after ANN, highly selective filter, or graph connectivity issues. Use filter-aware search, raise `ef` / candidate limits, enable iterative scans (pgvector), partition by filter, or fall back to exact search.

### D3. Recall dropped after adding data
IVF centroids stale, HNSW parameters no longer sufficient, or segment fragmentation. Re-train IVF, raise `efSearch`, run optimisation / compaction, measure recall against exact ground truth.

### D4. Latency spikes during ingestion
Compaction / index builds compete with queries, or memory pressure. Throttle ingestion, schedule compaction, add replicas for reads, size RAM properly, and separate ingest and query nodes if supported.

### D5. Out-of-memory (OOM)
HNSW + full-precision vectors exceed RAM, too many collections, or large payloads in memory. Quantise (SQ8 / binary + re-score), move payloads to disk, use mmap / disk indexes, shard, or reduce `M`.

### D6. Deleted documents still appear
Soft deletes not yet compacted, cache serving old results, or delete only targeted the document not all chunk IDs. Delete by `doc_id` filter, refresh / optimise, invalidate caches, verify with exact search.

### D7. Duplicate results
Multiple chunk versions indexed, overlapping chunks, or re-ingestion without idempotent IDs. Use deterministic IDs, delete stale chunks, apply MMR / dedupe by `doc_id`.

### D8. Cross-tenant data leakage
Missing or client-controlled filter, shared cache, or global namespace. Enforce tenant filter server-side, namespace caches by tenant, add automated leakage tests, and review RBAC.

### D9. pgvector query ignores the index
Wrong operator class / operator (`<->` vs `<=>` mismatch), `ORDER BY` expression different, planner chose seq scan, or missing `LIMIT`. Match opclass and operator, run `EXPLAIN (ANALYZE, BUFFERS)`, update stats, and adjust `enable_seqscan` only for testing.

### D10. Index build is extremely slow or fails
Low `maintenance_work_mem` (Postgres), huge `ef_construction`, insufficient RAM. Increase build memory, lower parameters, build after bulk load, use parallel builds if supported.

### D11. Managed service costs spike
Unbounded `top_k`, excessive read units from filters/scans, chatty clients, or oversized replicas. Cap `top_k`, batch queries, cache, review index/namespace design, set budgets/alerts.

### D12. Hybrid results dominated by one retriever
Score scales not comparable. Use RRF or normalise scores, tune weights (`alpha`), evaluate on labelled queries.

### D13. Query embedding API timeouts
Rate limits or network latency. Cache embeddings, add retries with backoff, batch, use a local model, and set timeouts/fallbacks (BM25-only mode).

### D14. Good offline metrics but poor user feedback
Evaluation set unrepresentative or queries differ (short, misspelled, multilingual). Add real query logs to evaluation, include difficult cases, add query rewriting and spell correction, and monitor online feedback.

### D15. Upgrade broke index compatibility
Index format changed. Follow upgrade notes, restore from snapshot into a test cluster first, rebuild indexes in a blue / green deployment, and canary compare results.

---

# 🧩 Part 8: Tricky Questions

### T1. Is a vector database just a normal database with a vector column?
Partly (pgvector proves it works), but dedicated engines add ANN indexes tuned for scale, filtering strategies, sharding, quantisation and operations. The distinction is about capability and scale, not magic.

### T2. Does higher dimensionality always improve search quality?
No. Beyond a point gains are small, costs rise, and some models are trained for specific dimensions; truncated Matryoshka vectors often perform nearly as well.

### T3. Is 100% recall required?
Usually not. 95–99% is typical because downstream re-ranking / LLM tolerance and costs justify approximation. Safety-critical dedupe or legal discovery may need higher or exact search.

### T4. Does cosine distance equal 1 − cosine similarity?
In pgvector `<=>` returns cosine **distance** (`1 − similarity`). Convert before thresholding. Other engines return similarity directly; read docs carefully.

### T5. Can I mix embeddings from two models in one index?
No. Different spaces make distances meaningless. Use separate indexes (or named vectors) per model.

### T6. Are ANN results deterministic?
Mostly for a fixed index, but parallel builds, insertion order, and concurrent updates can alter graph structure and results slightly. Compare via recall metrics, not exact equality.

### T7. Does a vector DB make documents "searchable by meaning" automatically?
Only as well as the embeddings, chunking and queries allow. Poor chunking or a weak model yields poor results regardless of the database.

### T8. Do I need GPUs to run a vector DB?
No for most online workloads (CPU HNSW). GPUs help for large-batch indexing / search and some engines' GPU indexes.

### T9. Is a larger `efSearch` always better?
It improves recall up to a point but increases latency; beyond the plateau it's wasted cost. Tune with a recall–latency curve.

### T10. Is storing vectors safe because they are "just numbers"?
No. Embeddings can leak semantic information and, in some cases, be partially inverted. Apply the same security controls as for source text.

### T11. Is deleting a vector immediate and complete?
Often not: tombstones, caches, replicas, snapshots and backups may retain data. Design deletion workflows and verify.

### T12. Can I rely on vector search alone for exact identifiers?
No. Order numbers, SKUs and error codes are better served by lexical or exact matching. Use hybrid search or filters.

### T13. Do metadata filters always speed up search?
No. Selective filters can slow ANN or reduce recall depending on the engine. Index payload fields and test filtered performance.

### T14. If recall@10 vs exact is 0.99, is retrieval quality 99%?
No. That only says the index matches exact search on the embedding space; relevance to user intent depends on the embedding model and chunking.

### T15. Is cheaper always better with serverless vector databases?
Not necessarily: cold-start latency, per-read pricing at high QPS, and limited tuning can make sustained high-throughput workloads costlier than provisioned clusters. Model your traffic.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Vector DB = embeddings + ANN index + metadata + filters.
- Cosine on normalised vectors = dot product.
- Same embedding model for index and query.
- Flat = exact; HNSW = graph, fast; IVF = clusters; PQ = compression.
- recall@k vs exact search is the index quality metric.
- HNSW knobs: `M`, `efConstruction`, `efSearch`.
- IVF knobs: `nlist`, `nprobe`.
- Quantise + re-score to save memory.
- Test filtered recall, not just unfiltered.
- Hybrid = BM25 + vectors (RRF).
- Re-rank top candidates with a cross-encoder.
- Deterministic IDs → idempotent upserts.
- Store `embedding_model` in metadata.
- Changing models = re-embed everything.
- Enforce tenant filters server-side.
- Embeddings are sensitive data.
- pgvector for moderate scale with relational needs.
- Keep raw data so indexes are rebuildable.
- Monitor latency percentiles, recall probes, ingestion lag.
- Benchmark on your own data.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a vector search system you built
Use STAR: use case and SLOs → data and embedding model choice → index design (HNSW params, quantisation, partitions) → filtering/hybrid/re-ranking → evaluation (labelled queries, recall vs exact) → operations (monitoring, backups, cost) → results. Example: "Support search over 4M chunks on pgvector HNSW with tenant partitions; hybrid + re-ranker raised nDCG@10 from 0.58 to 0.74; p95 70 ms; halfvec cut storage 50%."

### P2. A retrieval quality problem you diagnosed
Describe symptoms, how you separated embedding / chunking / index issues (exact search baseline, labelled queries), the fix (hybrid, better chunking, filters) and how you prevented regressions (CI recall tests).

### P3. How did you choose the database?
Compared pgvector, dedicated engine and managed service using benchmarks on real embeddings and filters, operational skills, cost projections, security needs and migration paths; documented the decision (ADR) and exit strategy.

### P4. How did you handle an embedding model upgrade?
Dual indexes, backfill with rate limits, shadow evaluation, feature-flag cutover, rollback plan, and cost tracking.

### P5. How did you secure multi-tenant data?
Server-enforced tenant filters, separate collections for large tenants, per-tenant keys, leakage tests, audit logs, and cache namespacing.

### P6. How did you control cost?
Quantisation, dimension reduction, tiered storage, caching, right-sizing replicas, and monitoring cost per query / per answered question.

### P7. How do you work with data scientists and product teams?
Shared golden evaluation sets, dashboards for retrieval quality, clear ownership for content and index changes, and release gates for model / chunking changes.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Foundations: embeddings, metrics, normalisation, kNN vs ANN, recall.
- Index algorithms: Flat, HNSW, IVF, PQ/SQ/binary, DiskANN, LSH, ScaNN, multi-vector.
- Features: metadata filtering, hybrid search, sparse vectors, named vectors, range search, MMR, re-ranking.
- Systems: CRUD, consistency, segments/compaction, sharding, replication, multi-tenancy, tiered/object-storage designs, GPU search.
- Products: pgvector, Qdrant, Weaviate, Milvus, Pinecone, Elasticsearch/OpenSearch, MongoDB, Redis, Chroma, LanceDB, FAISS.
- Operations: capacity planning, benchmarking, monitoring, backups/DR, upgrades, cost, security, privacy, governance.
- Integration: chunking, embedding pipelines, RAG, recommendations, agent memory, evaluation.

## Mixed topics
- Filtered search + partitioning + iterative scans.
- Quantisation + re-scoring + Matryoshka.
- Embedding migration + dual indexes + shadow evaluation.
- Multi-tenancy + ACLs + caches + leakage tests.
- Hybrid search + RRF + cross-encoder re-ranking.
- Capacity planning + cost modelling + SLOs.

---

# 🔬 Part 12: Internals

### HNSW insertion and search
Insertion: sample level `l = ⌊−ln(U)·mL⌋`; from the top entry point greedily descend to level `l+1`; at levels `l..0` run `search_layer` with `efConstruction` to find neighbours; connect up to `M` (layer 0: `M0 = 2M`) using the neighbour-selection heuristic; shrink neighbours' lists when exceeded. Search: greedy descend to layer 0, then best-first search with a bounded priority queue of size `ef`.

### Why high-dimensional search is hard
"Curse of dimensionality": distances concentrate, tree-based exact structures (k-d trees) degrade toward linear scan. Graph and quantisation methods exploit data's intrinsic low dimension and approximate scoring.

### Product quantisation details
Vector `x ∈ R^d` split into `m` chunks of `d/m` dims; k-means (k=2^nbits) per chunk gives codebooks; code = indices of nearest centroids. Asymmetric distance computation: precompute distances from the query sub-vectors to all centroids (`m × 2^nbits` table), then sum table lookups per database code.

### IVF training and probing
k-means over a sample yields centroids; each vector is assigned to the nearest centroid's inverted list. Query: compute distances to centroids, take the `nprobe` nearest, scan those lists. Recall rises with `nprobe`; empty/unbalanced cells hurt.

### Binary quantisation
`bit_i = 1 if x_i > 0` (or threshold learned); Hamming distance via XOR + popcount is extremely fast (SIMD). Works because high-dimensional modern embeddings preserve neighbourhoods under sign quantisation; re-score restores precision.

### Filtering inside HNSW
During traversal, nodes failing the filter are not returned but may still be traversed to keep connectivity (ACORN-style and engine-specific approaches), or extra links are added per payload value (Qdrant), or a brute-force path is used for small filtered sets using cardinality estimates.

### LSM-style segments
Writes go to an in-memory growing segment; flush creates immutable segments with their own ANN index; searches fan out across segments and merge; compaction merges small segments and drops tombstones, rebuilding indexes.

### pgvector storage
Vectors are stored in heap tuples (TOAST for large); HNSW index pages store graph edges; ANN scans return candidate TIDs which the executor re-checks against filters and MVCC visibility. WAL and replication work like any Postgres index.

### Distance computation optimisations
SIMD (AVX2 / AVX-512 / NEON), batched GEMM for Flat search, FP16/int8 kernels, memory-mapped files, prefetching, and caching of hot graph regions.

### Score normalisation
Cosine similarity ∈ [−1, 1]; L2 distance unbounded; inner product unbounded. For fusion with BM25, rank-based fusion (RRF) avoids scale issues; otherwise min-max or z-score normalise per query.

---

# 📊 Part 13: Reference Tables

### Engine comparison (indicative; verify)
| Engine | Type | Notable strengths | Consider |
|---|---|---|---|
| pgvector | Postgres extension | SQL, transactions, simplicity | Scale ceiling, filtered ANN tuning |
| Qdrant | Dedicated (Rust) | Filtering, quantisation, payload indexes | Ops for clusters |
| Weaviate | Dedicated | Hybrid, modules, multi-tenancy | Resource usage |
| Milvus / Zilliz | Dedicated, distributed | Very large scale, many index types, GPU | Operational complexity |
| Pinecone | Managed SaaS | Simplicity, serverless | Cost at scale, lock-in |
| Elasticsearch / OpenSearch | Search engine | Lexical + vector, ecosystem | Tuning, memory |
| MongoDB Atlas | Document DB | Unified data + vectors | Feature depth |
| Redis | In-memory | Very low latency | Memory cost |
| Chroma / LanceDB | Embedded/local | Easy prototyping, local | Production scale |
| FAISS | Library | Speed, index variety | No DB features |

### Index trade-offs
| Index | Recall | Latency | Memory | Updates | Build |
|---|---|---|---|---|---|
| Flat | 100% | High (scale) | Vectors only | Easy | None |
| HNSW | High | Low | High | Good (incremental) | Moderate |
| IVF-Flat | Tunable | Low–mid | Vectors + centroids | Needs retrain over time | Training |
| IVF-PQ | Lower (re-score helps) | Low | Very low | Needs retrain | Training |
| DiskANN | High | Mid (SSD) | Low RAM | Batch-friendly | Heavy |
| Binary + re-score | Good | Very low | Very low | Easy | Light |

### Memory formulas
| Item | Estimate |
|---|---|
| FP32 vectors | `N × d × 4` bytes |
| FP16 | `N × d × 2` |
| int8 | `N × d × 1` |
| Binary | `N × d / 8` |
| HNSW layer-0 links | ~`N × 2M × 4` bytes (+ upper layers) |
| PQ codes | `N × m × nbits/8` |

### Metric selection
| Embedding source | Metric |
|---|---|
| Most text models (normalised) | Cosine / dot |
| Models documented for L2 (some image) | L2 |
| Binary codes | Hamming |
| Recommenders with magnitude | Inner product |

### Evaluation checklist
| Aspect | Measure |
|---|---|
| Index quality | recall@k vs Flat (unfiltered + filtered) |
| Search quality | Recall@k / MRR / nDCG on labelled queries |
| Performance | p50/p95/p99, QPS, concurrency scaling |
| Ingestion | Throughput, freshness lag |
| Resources | RAM, disk, CPU, cost |
| Reliability | Failover time, restore tests |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Memory for 5,000,000 vectors of 1024 dims in FP32: `5e6 × 1024 × 4` = 20,480,000,000 bytes ≈ **20.5 GB**; in int8 ≈ **5.1 GB**; as binary ≈ **0.64 GB**.

### O2.
HNSW with `M=16` on 10M vectors: layer-0 neighbour storage ≈ `10e6 × (2×16) × 4 bytes` = 1.28 GB (plus upper layers and overhead).

### O3.
Cosine similarity of normalised vectors `[0.6, 0.8]` and `[0.8, 0.6]` = `0.48 + 0.48` = **0.96**; cosine distance = **0.04**.

### O4.
pgvector: `embedding <=> q` returns **cosine distance**. A row with distance 0.12 has similarity **0.88**.

### O5.
ANN returns top-10: 9 of the true top-10 are present → recall@10 = **0.9**.

### O6.
IVF with `nlist=1000`, `nprobe=10`: the query scans roughly **1%** of the vectors (assuming balanced lists).

### O7.
Binary quantisation of 1024-dim FP32 vectors reduces size by **32×** (4096 bytes → 128 bytes per vector).

### O8.
RRF with `k=60`: item ranked #1 in list A and absent from list B scores `1/61` ≈ **0.0164**; item ranked #10 in both scores `2/70` ≈ **0.0286** (higher).

### O9.
A filter keeps 0.5% of 20M vectors (100k vectors). Brute-force exact search over those 100k at d=768 is ≈ `100k × 768` multiply-adds ≈ **77M** flops-ish: typically a few ms with SIMD, so exact fallback is attractive.

### O10.
Query p50 = 20 ms, p95 = 90 ms, p99 = 400 ms at 200 QPS. An SLO of "p99 < 200 ms" is **violated**; investigate tail causes (compaction, GC, cold cache, filters).

### O11.
Shard top-k merge: 8 shards, need global top-10. Query each shard for top-10 (or slightly more, e.g. 20) and merge: worst case needs **at most 10 per shard** to be exact for top-10 under exact per-shard scoring (ANN adds approximation).

### O12.
Switching from 1536-dim FP32 to a 512-dim Matryoshka-truncated FP16 vector reduces per-vector size from 6,144 bytes to **1,024 bytes** (6× smaller), subject to quality validation.

---

# ✅ Part 15: MCQs

**1. A vector database is optimised for:**
A) Exact-match lookups on strings  B) Nearest-neighbour search over embeddings  C) Graph transactions only  D) Time-series compression
**Answer: B**

**2. For normalised embeddings, cosine similarity equals:**
A) Euclidean distance  B) Dot product  C) Hamming distance  D) Manhattan distance
**Answer: B**

**3. Which index is a graph-based ANN structure?**
A) IVF  B) HNSW  C) PQ  D) Flat
**Answer: B**

**4. Increasing `efSearch` in HNSW generally:**
A) Lowers recall  B) Raises recall and latency  C) Reduces memory  D) Rebuilds the index
**Answer: B**

**5. recall@k for ANN is measured against:**
A) Human labels  B) Exact (Flat) search results  C) BM25 results  D) Random vectors
**Answer: B**

**6. Product quantisation primarily:**
A) Increases recall  B) Compresses vectors to save memory  C) Normalises vectors  D) Adds filters
**Answer: B**

**7. Post-filtering after ANN can cause:**
A) More than `k` results  B) Fewer than `k` results when filters are selective  C) Faster inserts  D) Lower memory
**Answer: B**

**8. Which is true when changing embedding models?**
A) Old vectors still work  B) You must re-embed and re-index  C) Only queries need re-embedding  D) Nothing changes
**Answer: B**

**9. Hybrid search commonly combines:**
A) Two vector indexes only  B) Keyword (BM25) and vector search  C) SQL and NoSQL  D) CPU and GPU
**Answer: B**

**10. pgvector's `<=>` operator is:**
A) L2 distance  B) Cosine distance  C) Inner product  D) Hamming
**Answer: B**

**11. For billion-scale vectors with limited RAM, a suitable approach is:**
A) Flat index  B) Disk-based graph (DiskANN-style) or IVF-PQ with re-scoring  C) Brute force  D) Hash table
**Answer: B**

**12. Multi-tenant safety requires:**
A) Client-provided filters  B) Server-enforced tenant filters/isolation and leakage tests  C) Ignoring caches  D) Shared API keys
**Answer: B**

**13. Matryoshka embeddings allow:**
A) Truncating vectors with graceful quality loss  B) Encrypting vectors  C) Faster tokenisation  D) Removing metadata
**Answer: A**

**14. Reciprocal Rank Fusion merges:**
A) Embeddings  B) Rankings from multiple retrievers  C) Payloads  D) Index shards
**Answer: B**

**15. Deterministic chunk IDs are useful because they:**
A) Reduce embedding size  B) Make upserts idempotent and updates/deletes precise  C) Improve recall  D) Remove need for metadata
**Answer: B**

**16. Which statement about embeddings and privacy is correct?**
A) Vectors cannot reveal source info  B) Vectors should be treated as sensitive as the source text  C) Encryption is unnecessary  D) Deletion is automatic
**Answer: B**

**17. A Flat index is best used for:**
A) Billions of vectors online  B) Small datasets and as exact ground truth  C) Disk-only search  D) Sparse vectors
**Answer: B**

**18. The best way to compare vector DBs for your project is:**
A) Vendor marketing charts  B) Benchmark with your embeddings, filters, scale and SLOs  C) GitHub stars  D) Pick the newest
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Using different embedding models (or missing prefixes) for indexing and querying.
- Forgetting normalisation or using the wrong distance metric for the model.
- Tuning only unfiltered recall and ignoring filtered queries.
- Relying on post-filtering that returns too few results.
- No ground-truth (Flat) comparison; tuning ANN parameters blindly.
- Over-indexing metadata or storing huge payloads in RAM-resident structures.
- Non-idempotent ingestion creating duplicates; no cleanup of removed chunks.
- Ignoring deletes/compaction effects on HNSW quality and storage.
- Letting clients control tenant filters; shared caches across tenants.
- No plan for embedding model migration (no model/version metadata, no dual indexes).
- Treating vector similarity as sufficient for IDs/codes: no hybrid.
- Choosing a database by hype instead of benchmarking on your workload.
- Skipping re-ranking and retrieval evaluation; focusing on index speed only.
- Underestimating memory (HNSW graph overhead, replicas, headroom).
- Not monitoring latency percentiles, ingestion lag and recall drift.
- Embedding PII unnecessarily; no deletion workflow for vectors/backups.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You separate embedding quality, chunking quality and index quality, and measure each.
- You use exact search as ground truth and tune to explicit recall / latency / cost targets.
- You understand filtered ANN pitfalls and test by filter selectivity.
- You size memory and cost from first principles and validate with benchmarks.
- You design multi-tenancy, ACLs, deletion and lineage from day one.
- You plan embedding upgrades, index rebuilds and DR before they're needed.
- You combine hybrid search, re-ranking and MMR instead of over-tuning ANN.
- You choose pgvector vs dedicated vs search-engine based on evidence and operations, not fashion.
- You keep data portable and pipelines replayable to avoid lock-in.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Pipeline
```
chunk → embed (model@version, prefixes) → upsert (deterministic id + payload{tenant, acl, doc_id, hash, model})
query → embed (same model) → hybrid search (BM25 + ANN, filters/ACL) → re-rank → MMR/dedupe → context
```

### Index quick guide
Flat < ~100k • HNSW (M 16–32, efC 100–400, efS ≥ k, tune to recall) • IVF-PQ for memory limits (+ re-score) • binary/SQ for 4–32× savings • DiskANN for SSD scale • partition by tenant/time.

### Memory math
`N × d × bytes(type)` + graph/overhead (+20–50%) × replicas × headroom.

### Metrics to track
recall@k vs exact (unfiltered + filtered) • nDCG/MRR on labelled queries • p50/p95/p99 • QPS • ingestion lag • memory/disk • cost per 1k queries • per-tenant latency.

### Security checklist
Server-side tenant/ACL filters • RBAC + TLS + encryption at rest • private networking • audit logs • deletion pipeline • PII minimisation • leakage tests • vectors treated as sensitive.

### Final checklist before the interview
- [ ] Explain embeddings, metrics, normalisation, kNN vs ANN and recall.
- [ ] Describe HNSW, IVF, PQ/SQ/binary and DiskANN, with parameters and trade-offs.
- [ ] Explain filtered search strategies and their pitfalls; design partitioning/multi-tenancy.
- [ ] Implement hybrid search with RRF and re-ranking; use MMR for diversity.
- [ ] Choose between pgvector, dedicated engines, search engines and managed services with benchmarks.
- [ ] Plan capacity, cost, sharding/replication, backups and upgrades.
- [ ] Handle embedding model migration, idempotent ingestion, deletes and freshness.
- [ ] Evaluate with exact ground truth plus labelled relevance sets; monitor in production.
- [ ] Secure vectors and tenants; handle PII and compliance.
- [ ] Prepare a project story with data scale, trade-offs, metrics and a failure lesson.
