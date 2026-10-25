# MLOps Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, MLflow 2.x, DVC 3.x, Kubeflow Pipelines 2.x, Airflow 2.x / 3.x, Dagster, Prefect 3, Feast 0.4x, BentoML 1.x, KServe 0.1x, Seldon, Triton Inference Server, Ray Serve, Evidently 0.4+, Great Expectations 1.x, Weights & Biases, Docker, Kubernetes 1.29+, GitHub Actions, Terraform**, plus managed platforms (AWS SageMaker, Google Vertex AI, Azure ML, Databricks). Product names, features and pricing change quickly: anything marked "verify" should be checked in the official docs. Examples use the sample name **Ritesh Kumar** and small churn / fraud / recommendation style models.
> This file covers the ML lifecycle and what makes ML systems different from software, data and model versioning, experiment tracking, reproducible environments, feature engineering and feature stores, training pipelines and orchestration, CI/CD/CT for ML, model registry and promotion, testing ML (data, model, pipeline), deployment patterns (batch, online, streaming, edge, shadow, canary, A/B), serving frameworks, scalability and cost, monitoring (data / concept drift, performance, system), observability and alerting, retraining strategies, governance, security, responsible AI, LLMOps (prompts, evaluation, guardrails, RAG operations, cost), maturity models, team topology and platform design. Related topics: machine learning in `056_Machine-Learning.md`, deep learning in `057_Deep-Learning.md`, PyTorch in `058_PyTorch.md`, Hugging Face in `062_Hugging-Face.md`, data engineering in `075_Data-Engineering.md`, Docker in `../07_DevOps_and_Cloud/045_Docker.md`, Kubernetes in `../07_DevOps_and_Cloud/046_Kubernetes.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`, Terraform in `../07_DevOps_and_Cloud/051_Terraform-and-IaC.md`, monitoring in `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`, system design in `../09_System_Design/053_System-Design.md`, model serving in `../11_Generative_AI/073_Model-Serving-and-Inference.md`, LLM evaluation in `../11_Generative_AI/072_LLM-Evaluation-and-Guardrails.md`.

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

### Q1. What is MLOps? *(Must-know)*
MLOps (Machine Learning Operations) is the set of practices, tools and culture that **reliably builds, deploys, monitors and maintains ML models in production**. It combines ML, software engineering (DevOps) and data engineering so that models move from notebooks to dependable, repeatable, observable services.

### Q2. Why do we need MLOps? *(Must-know)*
Most ML projects fail at the "last mile." Without MLOps you get: models that can't be reproduced, manual deployments, silent accuracy decay, training-serving mismatches, no audit trail, slow iteration and untracked costs. MLOps provides automation, versioning, monitoring and governance.

### Q3. DevOps vs MLOps *(Must-know)*
| Aspect | DevOps | MLOps |
|---|---|---|
| Artefacts | Code | Code + **data** + **model** + config |
| Testing | Unit / integration | Plus data validation, model quality, fairness |
| Change triggers | Code commits | Code, data drift, schedule, performance decay |
| Deployment | Build → release | Train → evaluate → register → release |
| Failure modes | Crashes, bugs | Silent degradation, drift, bias |
| Monitoring | Latency, errors | Plus data/prediction/quality drift |

### Q4. The ML lifecycle
Problem framing → data collection → data validation & preparation → feature engineering → training & tuning → evaluation → packaging → deployment → monitoring → feedback/retraining. It is a loop, not a line.

### Q5. What is a model artefact?
The trained, serialised model (weights + metadata) plus everything required to use it: preprocessing code, feature schema, library versions, tokenizer/encoders, label mapping and a model card.

### Q6. What is experiment tracking? *(Must-know)*
Recording parameters, metrics, code version, data version, environment and artefacts for every run, so results are comparable and reproducible. Tools: MLflow, Weights & Biases, Neptune, Comet, TensorBoard.
```python
import mlflow
with mlflow.start_run():
    mlflow.log_params({"lr": 1e-3, "depth": 6})
    mlflow.log_metric("auc", 0.91)
    mlflow.sklearn.log_model(model, "model")
```

### Q7. Why version data and models?
Models are functions of code **and** data. Without data versioning you can't reproduce a result or explain a prediction. Use DVC, lakeFS, Delta Lake time travel or dataset snapshots; version models in a registry.

### Q8. Git vs DVC
Git tracks code (small text). DVC keeps small `.dvc` pointer files in Git while the large data/model files live in remote storage (S3, GCS, Azure Blob).
```bash
dvc init
dvc add data/train.csv
git add data/train.csv.dvc .gitignore
dvc remote add -d storage s3://my-bucket/dvc
dvc push
```

### Q9. Reproducibility basics
Pin dependencies (lock files), fix random seeds, version data/config/code, record hardware and library versions, containerise the environment, and script the pipeline end to end (no manual notebook steps).

### Q10. Containers for ML (Docker) *(Must-know)*
Package code + dependencies + runtime so training and serving run identically everywhere.
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "8000"]
```
Use slim/CUDA base images, multi-stage builds, non-root users, and pinned versions.

### Q11. Model serving (intro)
Exposing a model so applications can get predictions: **online** (REST/gRPC, milliseconds), **batch** (scheduled scoring of many records), **streaming** (events), or **embedded/edge** (on-device).

### Q12. A minimal model API with FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib, pandas as pd

app = FastAPI()
model = joblib.load("model.joblib")

class Customer(BaseModel):
    tenure: int
    monthly_charges: float
    contract: str

@app.post("/predict")
def predict(c: Customer):
    p = model.predict_proba(pd.DataFrame([c.model_dump()]))[0, 1]
    return {"churn_probability": float(p), "model_version": "v3"}

@app.get("/health")
def health(): return {"status": "ok"}
```

### Q13. CI/CD for software vs ML
CI/CD tests and ships code. ML adds **CT (Continuous Training)** that retrains on new data and **CM (Continuous Monitoring)**. A full ML pipeline automates data checks → training → evaluation gates → registry → deployment.

### Q14. Model registry *(Must-know)*
A central catalogue of model versions with metadata, lineage (data/code/run), metrics, stage/alias (staging, production), approvals and rollback. Examples: MLflow Model Registry, SageMaker Model Registry, Vertex AI Model Registry, W&B Registry.

### Q15. Feature store (intro)
A system to define, compute, store and serve features consistently for training (offline, point-in-time correct) and inference (online, low latency). Tools: Feast, Tecton, Databricks/SageMaker/Vertex feature stores.

### Q16. Training-serving skew *(Must-know)*
When features computed at training differ from those at serving (different code, data sources, timing, null handling). Causes silent accuracy loss. Prevent with shared transformation code, feature stores, schema validation and logging of served features.

### Q17. Data drift vs concept drift *(Must-know)*
- **Data (covariate) drift**: input distribution `P(X)` changes.
- **Concept drift**: relationship `P(y|X)` changes.
- **Label/prior drift**: `P(y)` changes.
Detect with statistical tests on features and predictions; confirm impact via delayed ground truth.

### Q18. What to monitor in production ML
System (latency, throughput, errors, CPU/GPU, memory), data (schema, nulls, ranges, drift), model (prediction distribution, confidence), outcome (accuracy/F1 once labels arrive, business KPIs), and fairness/segment metrics.

### Q19. Batch vs online inference
| | Batch | Online |
|---|---|---|
| Latency | Minutes–hours | Milliseconds–seconds |
| Cost | Low (scheduled) | Higher (always on) |
| Use | Nightly scores, recommendations | Fraud, search, chatbots |
| Complexity | Lower | Higher (scaling, SLAs) |

### Q20. Retraining triggers
Schedule (weekly), data volume threshold, drift alert, performance drop, new feature/label availability, or business change. Retraining must pass the same evaluation gates before promotion.

### Q21. Model evaluation gate
Automated check that a candidate beats the current production model (or a minimum threshold) on a fixed validation set and key segments before it can be deployed.

### Q22. Shadow, canary, blue-green, A/B *(Must-know)*
- **Shadow**: new model gets live traffic, responses are logged but not used.
- **Canary**: small % of traffic goes to the new model; ramp up if healthy.
- **Blue-green**: two environments, switch traffic instantly; easy rollback.
- **A/B test**: randomised comparison on business metrics.

### Q23. Rollback
Keep the previous model version deployable; use registry aliases (`@production`) or deployment revisions to switch back quickly. Automate rollback on alert conditions.

### Q24. Pipelines and orchestration
A pipeline is a DAG of steps (ingest, validate, featurise, train, evaluate, register, deploy). Orchestrators schedule, retry and track them: Airflow, Dagster, Prefect, Kubeflow Pipelines, Argo Workflows, Vertex Pipelines, SageMaker Pipelines.

### Q25. Notebook to production
Refactor notebooks into modules with functions/classes, config files, tests and a CLI/pipeline entry point; remove hidden state; parameterise paths; add logging; run in CI; package in a container.

### Q26. Config management
Keep hyper-parameters, paths and thresholds in YAML/Hydra configs, not hard-coded. Log the resolved config with every run.

### Q27. Basic project structure
```
project/
  data/            (DVC-tracked)
  src/{data,features,train,evaluate,serve}/
  tests/
  configs/
  pipelines/
  Dockerfile
  pyproject.toml / requirements.lock
  dvc.yaml  .github/workflows/
```

### Q28. Common MLOps tool categories
Tracking (MLflow, W&B), data versioning (DVC, lakeFS), orchestration (Airflow, Kubeflow), feature stores (Feast), serving (BentoML, KServe, Triton, Ray Serve), monitoring (Evidently, WhyLabs, Arize, Prometheus/Grafana), data quality (Great Expectations, Pandera), infra (Docker, Kubernetes, Terraform).

### Q29. MLOps maturity levels (Google-style)
Level 0: manual, notebook-driven. Level 1: automated training pipeline with CT and registry. Level 2: full CI/CD for pipelines plus automated testing and monitoring across many models.

### Q30. Key MLOps roles
Data scientist (modelling), ML engineer (productionisation), data engineer (pipelines/features), MLOps/platform engineer (infra, tooling), DevOps/SRE (reliability), product/domain owners, governance/risk.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. MLflow components *(Must-know)*
- **Tracking**: runs, params, metrics, artefacts.
- **Projects**: reproducible packaging.
- **Models**: standard model format ("flavors") + signature.
- **Model Registry**: versions, aliases/stages, lineage.
- **Evaluate / Deployments / Gateway** (LLM-related features; verify).
```python
mlflow.set_tracking_uri("http://mlflow:5000"); mlflow.set_experiment("churn")
mlflow.sklearn.autolog()
with mlflow.start_run(run_name="lgbm_v1") as run:
    model.fit(X_tr, y_tr)
mlflow.register_model(f"runs:/{run.info.run_id}/model", "churn-model")
```

### Q32. Model signatures and input validation
MLflow signatures (`infer_signature`) record input/output schema; enforce them at serving to catch missing columns/types. Complement with Pydantic/Pandera in the API.

### Q33. DVC pipelines (`dvc.yaml`)
```yaml
stages:
  prepare:
    cmd: python src/prepare.py
    deps: [src/prepare.py, data/raw.csv]
    outs: [data/prepared.parquet]
  train:
    cmd: python src/train.py
    deps: [src/train.py, data/prepared.parquet]
    params: [train.lr, train.depth]
    outs: [models/model.joblib]
    metrics: [metrics.json]
```
`dvc repro` re-runs only stages whose inputs changed (like `make` for ML).

### Q34. Environment management
`venv`/`conda`/`uv`/`poetry` with lock files; separate train and serve requirements; build Docker images from locked deps; avoid "works on my machine."

### Q35. Data validation *(Must-know)*
Automated checks on schema, types, ranges, null rates, uniqueness, categorical domains, distribution shifts, and referential integrity before training/inference. Tools: Great Expectations, Pandera, TFDV, Soda, Deequ.
```python
import pandera as pa
schema = pa.DataFrameSchema({"age": pa.Column(int, pa.Check.in_range(18, 100)),
                             "plan": pa.Column(str, pa.Check.isin(["basic", "pro"])),
                             "amount": pa.Column(float, nullable=False)})
schema.validate(df)
```

### Q36. Testing in ML systems (pyramid)
Unit tests (feature functions, preprocessing), data tests (schema/quality), model tests (performance threshold, invariance, directional expectation, slice metrics), integration tests (pipeline end to end on small data), serving tests (API contract, load), regression tests (golden dataset).

### Q37. Behavioural/model tests
Invariance (changing a name shouldn't change a loan score), directional (higher income shouldn't lower approval), minimum functionality, and slice performance checks (CheckList-style).

### Q38. CI for ML code
On every PR: lint, type-check, unit tests, small-data pipeline run, data-schema tests, build container, security scan. Heavy training runs happen in scheduled/triggered pipelines, not in each PR.
```yaml
name: ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "3.11"}
      - run: pip install -r requirements.lock && pytest -q
```

### Q39. CD for models
After evaluation gates pass: register model → deploy to staging → smoke/integration tests → canary in production → promote or roll back. Use GitOps (Argo CD/Flux) or pipeline stages for deployment manifests.

### Q40. Packaging models: formats
`joblib/pickle` (Python only, unsafe if untrusted), MLflow flavors, ONNX (portable), TorchScript/`torch.export`, SavedModel, safetensors (weights only), GGUF (LLMs). Prefer portable and safe formats; include a signature and pre/post-processing.

### Q41. Model cards
Document intended use, data, training procedure, metrics (overall + slices), limitations, ethical considerations, owners and version. Store with the registry entry.

### Q42. Online feature retrieval pattern
Request → fetch online features by entity ID from low-latency store (Redis/DynamoDB/Feast online) → combine with request features → model → response. Budget latency for each hop.

### Q43. Point-in-time correctness
Training sets must use feature values **as of the label timestamp**, not later values. Feature stores provide point-in-time joins (`get_historical_features`) to avoid leakage.

### Q44. Offline vs online store
Offline: large historical data (warehouse/lake/Parquet) for training and batch scoring. Online: key-value store with latest values for real-time serving. Materialisation jobs sync offline → online.

### Q45. Logging predictions for monitoring
Log request ID, timestamp, model version, input features (or hashed/redacted), prediction, score, latency and later the **ground-truth label** (joined by ID). This enables drift detection, debugging, retraining data and audits.

### Q46. Ground-truth delay
Labels may arrive days/months later (churn, fraud chargebacks). Use proxy metrics (prediction distribution, drift), delayed performance evaluation windows, and sampling/human labelling for faster feedback.

### Q47. Drift detection methods
Numerical: KS test, Wasserstein distance, PSI. Categorical: chi-square, JS divergence, PSI. Multivariate: domain classifier (train a model to separate reference vs current), embeddings drift. Pick thresholds based on false-alarm tolerance and business impact.

### Q48. Population Stability Index (PSI)
`PSI = Σ (a_i − e_i) · ln(a_i / e_i)` over bins. Common guideline: <0.1 stable, 0.1–0.25 moderate, >0.25 significant shift (rule of thumb; tune per use case).

### Q49. Alerts and dashboards
Use Prometheus/Grafana or cloud monitoring for system metrics; Evidently/WhyLabs/Arize for ML metrics. Define SLOs (p95 latency, availability, minimum quality), alert on symptoms with runbooks, and avoid alert fatigue.

### Q50. Model serving frameworks overview
FastAPI/Flask (simple), BentoML (packaging + serving), MLflow serving, TorchServe (maintenance mode; verify), Triton (multi-framework, GPU, dynamic batching), KServe/Seldon (Kubernetes-native), Ray Serve (Python-first scaling), SageMaker/Vertex endpoints (managed), vLLM/TGI (LLMs).

### Q51. Dynamic batching
Server groups concurrent requests into a batch to utilise GPUs efficiently, with a max wait time to bound latency (Triton, TorchServe, vLLM continuous batching).

### Q52. Autoscaling inference
Horizontal Pod Autoscaler on CPU/RPS/custom metrics, KEDA for queue-based scaling, GPU autoscaling with warm pools, scale-to-zero for rarely used models (watch cold start). Keep minimum replicas for latency-critical paths.

### Q53. Cold start and warm-up
Large models take time to load and compile. Use readiness probes, warm-up requests, model caching on local disk, pre-pulled images and minimum replicas.

### Q54. Secrets and config in deployment
Store tokens and credentials in secret managers (AWS Secrets Manager, Vault, K8s Secrets with encryption), never in images or Git. Pass via environment or mounted volumes.

### Q55. Reproducible training with seeds and determinism
Set seeds (`random`, `numpy`, `torch`), control data order, pin library versions, and accept that GPU ops may be non-deterministic; report variance across seeds for fair comparison.

### Q56. Hyper-parameter tuning in pipelines
Optuna/Ray Tune/Vertex Vizier/SageMaker HPO with early pruning; log every trial to the tracker; separate tuning data from final evaluation data; cap budget.

### Q57. Cost basics
Training: GPU hours, storage, data transfer. Serving: always-on instances, autoscaling, GPUs. Reduce with spot instances for training, right-sizing, batching, quantisation, caching and scheduled batch jobs.

### Q58. Model governance basics
Ownership, approval workflow for production, audit trail (who trained/approved/deployed what, with which data), access control, documentation and periodic review.

### Q59. Responsible AI checks in pipelines
Slice metrics for protected/proxy groups, fairness metrics, explainability reports (SHAP), privacy checks (PII), safety evaluations for generative models. Make them release gates when risk is high.

### Q60. Local development parity
Use docker-compose to run MLflow, a database, object storage (MinIO) and the API locally; use small sample datasets; the same container for local and cluster runs.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Designing a training pipeline (DAG) *(Must-know)*
`ingest → validate data → split (time/group aware) → featurise → train → evaluate (overall + slices) → compare with champion → register → (optional) approve → package → deploy`. Each step is idempotent, parameterised, cached by inputs, and emits artefacts + metadata (lineage).

### Q62. Orchestrator comparison
| Tool | Strength | Consider |
|---|---|---|
| Airflow | Mature, huge ecosystem, scheduling | Task-centric, heavier for ML artefacts |
| Dagster | Asset-centric, typed IO, testing | Newer ecosystem |
| Prefect | Python-native, dynamic flows | Smaller enterprise footprint |
| Kubeflow Pipelines | K8s-native ML pipelines | Ops overhead |
| Argo Workflows | K8s-native DAGs, GitOps | YAML-heavy |
| SageMaker/Vertex Pipelines | Managed, integrated | Lock-in |

### Q63. Idempotency, retries and backfills
Pipeline steps must be safe to re-run (deterministic outputs for the same inputs, atomic writes). Support retries with backoff and **backfills** over historical partitions without side effects.

### Q64. Caching and incremental processing
Cache step outputs keyed by input hashes (DVC, Kubeflow caching, Dagster assets). Process only new partitions; avoid recomputing features unnecessarily.

### Q65. Time-aware splitting in pipelines
For time-dependent problems split by time (train on past, validate on future) with expanding or rolling windows; keep group integrity (user/entity); never shuffle across time. Encode the split policy in code and test it.

### Q66. Champion/challenger evaluation
Compare the candidate against the production model on identical data (offline), including segments, calibration and cost-based metrics; then shadow/canary online. Promote only if gains exceed noise (confidence intervals) and no critical regression.

### Q67. Feature store design considerations
Entity definitions, feature views, TTLs, point-in-time joins, materialisation schedules, backfill, online/offline consistency tests, ownership and documentation, access control, and monitoring of freshness and null rates.

### Q68. Feature freshness and latency
Define freshness SLAs per feature (batch hourly, streaming seconds). Real-time features need streaming pipelines (Kafka/Flink/Spark Structured Streaming). Monitor lag; fall back gracefully when features are stale.

### Q69. Streaming inference patterns
Consume events from Kafka, compute windowed features, call a model service (or embed the model), emit predictions to another topic. Handle ordering, late events, exactly-once/at-least-once semantics and back-pressure.

### Q70. Model serving on Kubernetes
Deployment + Service + Ingress/Gateway, HPA/KEDA, resource requests/limits, GPU node pools with taints/tolerations, readiness/liveness probes, PodDisruptionBudgets, rolling updates, and observability sidecars. KServe adds InferenceService CRDs, canary, scale-to-zero and transformers (pre/post-processing).

### Q71. KServe canary example
```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata: {name: churn}
spec:
  predictor:
    canaryTrafficPercent: 10
    model:
      modelFormat: {name: sklearn}
      storageUri: s3://models/churn/v4
```
Traffic splits 90/10 between previous and new revisions; promote by removing the canary setting (verify current spec).

### Q72. Triton Inference Server
Serves TensorFlow, PyTorch, ONNX, TensorRT, Python backends with dynamic batching, model ensembles, concurrent model instances, metrics and model repository hot-reload. Great for GPU efficiency and multi-model hosting.

### Q73. Optimising inference
Quantisation, ONNX/TensorRT, operator fusion, batching, caching, smaller/distilled models, pre-computation, efficient pre/post-processing (avoid Python hot loops), and hardware selection. Measure p50/p95/p99 under realistic load.

### Q74. Load testing ML endpoints
Use k6/Locust/Vegeta with realistic payload distributions (sizes, concurrency, bursts). Measure latency percentiles, throughput, error rate, GPU/CPU utilisation, memory; find the saturation point and set autoscaling thresholds.

### Q75. Handling large model artefacts
Store in object storage with versioning; pull at startup via init containers or baked into images; use shared read-only volumes/caches; sharded loading; avoid re-downloading on each pod restart.

### Q76. Multi-model and multi-tenant serving
Consolidate many small models on shared servers (Triton multi-model, KServe ModelMesh, SageMaker multi-model endpoints) to cut cost; isolate noisy neighbours with quotas; per-tenant metrics and routing.

### Q77. Monitoring pipeline design
Log predictions/features to a stream or table → scheduled jobs compute drift, quality and segment metrics against reference data → publish to dashboards → alert on thresholds → create tickets/trigger retraining. Include data-quality metrics (null rate, cardinality, schema).

### Q78. Evidently/WhyLabs-style reports
```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
r = Report(metrics=[DataDriftPreset()])
r.run(reference_data=ref_df, current_data=cur_df)
r.save_html("drift.html")
```
Use reports for investigation and metrics export for automated alerting.

### Q79. Performance monitoring without labels
Proxy signals: prediction/score distribution drift, confidence changes, feature drift, input anomalies, downstream behavioural metrics (conversion), consistency checks between models, and periodic human-labelled samples.

### Q80. Retraining strategy design
Scheduled (simple, predictable), triggered (drift/performance), continuous/online (streaming updates for specific models), and **hybrid**. Consider label delay, training cost, risk of training on feedback-loop-biased data, and validation before promotion.

### Q81. Feedback loops
Model outputs influence future data (recommendations drive clicks that train the next model). Mitigate with exploration, holdout groups, logging propensities, debiasing/IPS and monitoring diversity.

### Q82. Handling concept drift operationally
Detect via delayed metrics and drift signals; use recency-weighted training, rolling windows, ensembles, adaptive models, more frequent retraining and fallback rules. Track seasonality to avoid false alarms.

### Q83. Data lineage and metadata
Track which datasets, code commits, features and parameters produced each model; use OpenLineage/Marquez, MLflow lineage, Dataplex/DataHub/Atlas. Required for audits, debugging and impact analysis.

### Q84. Access control and security basics
Least-privilege IAM for data and artefacts, network isolation, encryption at rest/in transit, authenticated endpoints, rate limiting, input validation, dependency scanning, and signed images/models. Treat model files (pickle) as code.

### Q85. Privacy in ML pipelines
Minimise and pseudonymise PII, restrict access, tokenise sensitive fields, apply retention policies, support deletion requests across datasets/features/models (as far as feasible), and consider differential privacy/federated learning for high-risk cases. Verify legal duties (GDPR, DPDP Act).

### Q86. Cost optimisation techniques
Spot/preemptible GPUs with checkpointing, autoscaling to zero, batch inference for non-urgent tasks, caching predictions, right-sizing instance types, model compression, scheduling heavy jobs off-peak, FinOps tagging and per-model cost dashboards.

### Q87. Infrastructure as Code for ML platforms
Terraform/Pulumi to define clusters, GPU node pools, buckets, registries, IAM and networking; Helm/Kustomize for apps; GitOps for deployments. Environments (dev/stage/prod) are reproducible and reviewed via PRs.

### Q88. Multi-environment promotion
dev → staging → prod with the same artefacts promoted (not rebuilt). Use registry aliases, environment-specific configs/secrets, automated smoke tests, and approvals for production.

### Q89. Documentation and runbooks
For each production model: purpose, owners/on-call, dependencies, SLOs, dashboards, alerts, common failures with remediation steps, rollback procedure, retraining procedure and contact paths.

### Q90. Cross-team collaboration patterns
Define interfaces: data contracts with data engineering, feature ownership, model API contracts with application teams, shared evaluation criteria with product, and platform SLAs. Use RFCs/design reviews for changes.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Designing an ML platform *(Must-know)*
Capabilities: data access & catalog, feature store, experiment tracking, scalable training (GPU scheduling), pipelines/orchestration, model registry, deployment/serving, monitoring/observability, governance (lineage, approvals), cost management, and developer experience (templates, CLI/SDK, docs). Deliver as **paved roads**: opinionated defaults that teams can extend, not a rigid monolith.

### Q92. Build vs buy for the ML platform
Managed (SageMaker/Vertex/Azure ML/Databricks): faster start, integrated security, less ops, lock-in and cost at scale. Open-source on K8s (Kubeflow, MLflow, KServe): flexibility, portability, more engineering effort. Hybrid is common: managed storage/compute with open standards (MLflow, ONNX, Kubernetes) to limit lock-in. Decide by team size, compliance, workloads, existing cloud and skills.

### Q93. Multi-tenant GPU cluster management
Kubernetes with GPU operators, queueing (Kueue/Volcano/Run:ai/SLURM), quotas and fair-share, priority and preemption, gang scheduling for distributed jobs, MIG/time-slicing for small jobs, node pools by GPU type, and utilisation dashboards.

### Q94. Reliability engineering for ML (SRE for ML)
SLOs for latency, availability and **quality**; error budgets; graceful degradation (fallback model/rules, cached predictions); circuit breakers; multi-region failover; capacity planning; chaos/failure drills; blameless post-mortems with ML-specific causes (data, drift, features).

### Q95. Designing for explainability and auditability
Persist input features, model version, explanation artefacts (SHAP) for sampled or regulated decisions; immutable logs; reproducible retraining from versioned data; documented decision logic for adverse-action notices in finance/insurance.

### Q96. Data contracts and upstream change management
Producers publish schemas, SLAs and semantic definitions; consumers validate in CI and at runtime; breaking changes require versioning and notice. Detect upstream failures early with freshness/volume/schema monitors and quarantine bad data.

### Q97. Safe deployment strategies for high-risk models
Offline validation with slices → shadow → human-in-the-loop review → canary with guardrails and auto-rollback → gradual ramp → post-launch audit. Maintain kill switches and fallback to rules or the previous model.

### Q98. Counterfactual/off-policy evaluation in production
When decisions affect outcomes (ranking, pricing), log propensities and use IPS/doubly-robust estimators to evaluate new policies offline; verify with small online tests. Without logged randomisation, offline estimates are biased.

### Q99. Experimentation platform integration
Randomisation service, consistent bucketing, metric definitions (primary, guardrail), power analysis, sequential testing corrections, CUPED variance reduction, interference/network effects, and experiment registry. ML teams must align offline metrics with online business metrics.

### Q100. Monitoring at scale for many models
Standardised metric schemas, auto-instrumentation via the serving SDK, centralised storage (time-series + warehouse), templates for dashboards/alerts, tiering of models by risk/criticality, ownership metadata, and a registry that links each model to its monitors.

### Q101. Alert design for ML
Alert on actionable symptoms: p99 latency, error rate, feature null spikes, schema violations, severe drift in top features, sudden prediction shifts, business KPI drops. Avoid per-feature drift storms by aggregating, using importance weighting, and setting severity levels with runbooks.

### Q102. Root-cause analysis for accuracy drops
Check recent changes (code/model/config/features), upstream data incidents, schema/units changes, null/default values, population shifts (new region/product), label pipeline problems, seasonality, and segment-level breakdowns. Reproduce with logged inputs; compare against shadow baselines.

### Q103. Reproducibility at organisational scale
Standard base images, lockfiles, CI-built artefacts with provenance (SLSA-like), immutable datasets/snapshots, tracked configs, deterministic pipelines, and "rebuild from scratch" drills to verify that registry entries can be regenerated.

### Q104. Handling very large-scale training infrastructure
Distributed training (DDP/FSDP/DeepSpeed), high-performance storage and data loaders, checkpointing/elastic restarts, topology-aware scheduling, job-level observability (MFU, throughput), and cost controls. See `057_Deep-Learning.md` and `058_PyTorch.md`.

### Q105. Edge and on-device MLOps
Model compression (quantisation/pruning), packaging (TFLite/Core ML/ONNX Runtime), OTA updates with staged rollout and rollback, device telemetry, local inference monitoring, privacy-preserving data collection, and fleet segmentation by hardware/version.

### Q106. Federated learning operations
Coordinate training across devices/silos without centralising raw data; manage client sampling, secure aggregation, heterogeneity, and monitoring of convergence/fairness. Operational complexity is high; use when privacy/regulation requires it.

### Q107. Security threats in ML systems
Data poisoning, model extraction/inversion, membership inference, adversarial inputs, malicious pickle/model files, supply-chain attacks (dependencies, pre-trained weights), prompt injection (LLMs). Defences: input validation, rate limiting, access control, signed artefacts, safe formats, sandboxing, anomaly detection, red-teaming.

### Q108. Compliance mapping
Model risk management frameworks (SR 11-7 in banking), EU AI Act risk tiers, GDPR/DPDP obligations, healthcare device regulation, internal audit. Map controls to pipeline stages: data provenance, validation evidence, approval records, monitoring, incident response. Verify current regulations with counsel.

### Q109. ML technical debt
Entanglement (CACE), hidden feedback loops, undeclared consumers, unstable data dependencies, glue code, pipeline jungles, dead experimental code, configuration debt. Mitigate with modular pipelines, interface contracts, ownership, tests, and deprecation processes.

### Q110. Platform adoption and developer experience
Project templates (cookiecutter), one-command local runs, SDK/CLI for registering and deploying, internal documentation and examples, office hours, migration guides, and metrics (time-to-first-model, lead time to production, % models monitored).

### Q111. DORA-style metrics for ML
Lead time for change (idea → production model), deployment frequency, change failure rate (rollbacks), time to restore, plus ML-specific: retraining cadence, drift-detection-to-fix time, % models with monitoring/owners/tests, cost per prediction.

### Q112. Release management for models
Semantic versioning for model + data + code (e.g., `churn@2.3.1`), changelogs with metric deltas, compatibility guarantees for features/API schema, deprecation notices, and staged rollouts with explicit approvers.

### Q113. Disaster recovery for ML
Backups of registries, metadata DBs, feature-store offline data and model artefacts; infrastructure recreatable from IaC; cross-region replication; RPO/RTO targets per tier; DR drills including retraining or restoring last-known-good models.

### Q114. Evaluating third-party ML/AI vendors
Benchmark on your data, check data-use and retention policies, security certifications, SLAs, explainability, portability/exit options, pricing at scale and integration effort. Keep abstraction layers to switch providers.

### Q115. Sustainability and efficiency
Track energy/carbon per training run and per 1,000 predictions; prefer efficient architectures, right-sized hardware, scheduling in low-carbon regions/times, and avoid unnecessary retraining. Report alongside cost.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. MLOps strategy and operating model
Define the target maturity per risk tier; centralise the platform and standards, decentralise model ownership ("you build it, you run it" with platform support). Establish governance forums (model review board), shared metrics, funding model (platform vs product teams), and a roadmap tied to business outcomes.

### Q117. Reference architecture
Sources → ingestion/streaming → lake/warehouse (governed) → data quality gates → feature pipelines/feature store → training (orchestrated, tracked, GPU pools) → evaluation gates → registry → deployment (batch/online/stream/edge) → monitoring → feedback/labelling → retraining. Cross-cutting: security, lineage, cost, IaC, observability, documentation.

### Q118. Standardisation vs flexibility
Provide a small set of golden paths (tabular batch, real-time API, deep-learning training, LLM app) with templates and enforced guardrails, and allow escape hatches with review. Too much freedom increases ops burden; too much rigidity blocks innovation.

### Q119. Portfolio and risk tiering
Classify models by impact (financial, safety, legal, customer harm) and autonomy. High-risk models get stricter gates: independent validation, explainability, human oversight, shadow periods, tighter monitoring and audit logs. Low-risk models use lightweight paths.

### Q120. Org design and team topologies
Stream-aligned product ML teams; an enabling team of ML engineers and researchers; a platform team providing self-service; SRE/security partnership; embedded data engineers. Clear on-call ownership for model incidents.

### Q121. Measuring ML ROI
Attribute value via A/B tests or holdouts, track avoided costs, revenue lift, productivity, and risk reduction; include total cost of ownership (data, labelling, infra, people, monitoring). Sunset low-value models.

### Q122. Hiring and capability building
Mix of ML engineers with strong software skills, data engineers, SRE/platform engineers, and domain experts; invest in training on testing, observability and statistics; create career paths for platform and applied roles.

### Q123. Vendor and technology roadmap
Track ecosystem shifts (feature stores, LLM serving, vector DBs, open standards like ONNX/OpenTelemetry/MLflow), run time-boxed evaluations, maintain exit strategies, and deprecate tools deliberately.

### Q124. Incident management for ML
Severity definitions including model-quality incidents, on-call rotations, runbooks, communication templates, rollback/kill-switch authority, blameless post-mortems, and tracking of action items (new tests, monitors, data contracts).

### Q125. Communicating with executives
Translate platform investments into lead time, reliability, cost and risk metrics; show maturity roadmap with milestones; explain trade-offs (speed vs control, build vs buy) plainly; present risks (drift, bias, security) with mitigations and owners.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Train, track and register with MLflow
```python
import mlflow, mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score
from mlflow.models import infer_signature

mlflow.set_experiment("churn")
with mlflow.start_run(run_name="rf_baseline") as run:
    params = {"n_estimators": 300, "max_depth": 8, "random_state": 42}
    model = RandomForestClassifier(**params).fit(X_tr, y_tr)
    auc = roc_auc_score(y_te, model.predict_proba(X_te)[:, 1])
    mlflow.log_params(params); mlflow.log_metric("auc", auc)
    mlflow.log_artifact("configs/train.yaml")
    mlflow.sklearn.log_model(model, "model", signature=infer_signature(X_tr, model.predict(X_tr)),
                             input_example=X_tr.head(3))
result = mlflow.register_model(f"runs:/{run.info.run_id}/model", "churn-model")
mlflow.MlflowClient().set_registered_model_alias("churn-model", "candidate", result.version)
```

### Task 2. Promotion gate script (champion vs challenger)
```python
import mlflow, sys
from mlflow import MlflowClient
c = MlflowClient()
cand = c.get_model_version_by_alias("churn-model", "candidate")
auc_c = c.get_run(cand.run_id).data.metrics["auc"]
try:
    champ = c.get_model_version_by_alias("churn-model", "production")
    auc_p = c.get_run(champ.run_id).data.metrics["auc"]
except Exception:
    auc_p = 0.0
if auc_c >= auc_p + 0.005 and auc_c >= 0.80:
    c.set_registered_model_alias("churn-model", "production", cand.version); print("promoted", cand.version)
else:
    print("rejected", auc_c, auc_p); sys.exit(1)
```

### Task 3. DVC pipeline with parameters and metrics
```yaml
# params.yaml
train: {n_estimators: 300, max_depth: 8}
# dvc.yaml (stages: prepare → train → evaluate)
```
```bash
dvc repro && dvc metrics show && dvc params diff
dvc exp run -S train.max_depth=12      # experiment
```

### Task 4. Data validation step with Pandera + fail-fast
```python
import pandera as pa, pandas as pd, sys
schema = pa.DataFrameSchema({
    "customer_id": pa.Column(str, unique=True),
    "tenure": pa.Column(int, pa.Check.ge(0)),
    "monthly_charges": pa.Column(float, pa.Check.in_range(0, 5000)),
    "contract": pa.Column(str, pa.Check.isin(["monthly", "annual"])),
    "churned": pa.Column(int, pa.Check.isin([0, 1]), nullable=False),
}, strict=True, coerce=True)
df = pd.read_parquet("data/prepared.parquet")
try: schema.validate(df, lazy=True)
except pa.errors.SchemaErrors as e:
    print(e.failure_cases.head(20)); sys.exit(1)
assert df["churned"].mean() > 0.01, "label rate collapsed"
```

### Task 5. Dockerised FastAPI model service with health checks
```dockerfile
FROM python:3.11-slim
RUN useradd -m app
WORKDIR /app
COPY requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock
COPY src/ src/
COPY model/ model/
USER app
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "src.serve:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### Task 6. Prediction logging for monitoring (structured)
```python
import json, time, uuid, logging
log = logging.getLogger("predictions")
def log_prediction(features: dict, score: float, version: str, latency_ms: float):
    log.info(json.dumps({"id": str(uuid.uuid4()), "ts": time.time(), "model_version": version,
                         "features": features, "score": score, "latency_ms": latency_ms}))
```
Ship to a stream/warehouse; later join with ground-truth labels by ID.

### Task 7. Drift check with PSI
```python
import numpy as np
def psi(ref, cur, bins=10):
    edges = np.quantile(ref, np.linspace(0, 1, bins + 1)); edges[0], edges[-1] = -np.inf, np.inf
    r = np.histogram(ref, edges)[0] / len(ref) + 1e-6
    c = np.histogram(cur, edges)[0] / len(cur) + 1e-6
    return float(((c - r) * np.log(c / r)).sum())
for col in numeric_cols:
    v = psi(ref_df[col], cur_df[col]); print(col, round(v, 3), "ALERT" if v > 0.25 else "")
```

### Task 8. GitHub Actions: test, build image, push
```yaml
name: ml-ci
on: {push: {branches: [main]}, pull_request: {}}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "3.11", cache: pip}
      - run: pip install -r requirements.lock
      - run: pytest -q --maxfail=1
      - run: python -m src.pipeline --sample --smoke      # tiny end-to-end run
      - uses: docker/build-push-action@v6
        if: github.ref == 'refs/heads/main'
        with: {push: true, tags: "ghcr.io/${{ github.repository }}/churn:${{ github.sha }}"}
```

### Task 9. Airflow (or Dagster) pipeline skeleton
```python
from airflow.decorators import dag, task
from datetime import datetime
@dag(schedule="@weekly", start_date=datetime(2025, 1, 1), catchup=False, tags=["ml"])
def churn_training():
    @task def validate(): ...
    @task def train(): ...
    @task def evaluate(): ...
    @task def register_if_better(): ...
    validate() >> train() >> evaluate() >> register_if_better()
churn_training()
```

### Task 10. Kubernetes Deployment + HPA for a model API
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: {name: churn-api}
spec:
  replicas: 2
  selector: {matchLabels: {app: churn-api}}
  template:
    metadata: {labels: {app: churn-api}}
    spec:
      containers:
        - name: api
          image: ghcr.io/org/churn:abc123
          ports: [{containerPort: 8000}]
          resources: {requests: {cpu: "500m", memory: 1Gi}, limits: {cpu: "1", memory: 2Gi}}
          readinessProbe: {httpGet: {path: /health, port: 8000}, initialDelaySeconds: 10}
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: {name: churn-api}
spec:
  scaleTargetRef: {apiVersion: apps/v1, kind: Deployment, name: churn-api}
  minReplicas: 2
  maxReplicas: 10
  metrics: [{type: Resource, resource: {name: cpu, target: {type: Utilization, averageUtilization: 60}}}]
```

### Task 11. Feast feature retrieval (offline and online)
```python
from feast import FeatureStore
fs = FeatureStore(repo_path="feature_repo")
train_df = fs.get_historical_features(entity_df=labels_df,           # entity_id + event_timestamp
        features=["user_stats:orders_30d", "user_stats:avg_basket"]).to_df()
fs.materialize_incremental(end_date=pd.Timestamp.utcnow())
online = fs.get_online_features(features=["user_stats:orders_30d"], entity_rows=[{"user_id": "u42"}]).to_dict()
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Great offline metrics but poor production performance
Training-serving skew, leakage (future features), different preprocessing, population shift, or label definition mismatch. Compare logged production features with training features, replay production inputs through the training pipeline, check point-in-time joins.

### D2. Model accuracy slowly decays
Drift or seasonality. Check feature and prediction drift, segment performance over time, delayed labels; retrain with recent data; add monitoring and scheduled retraining.

### D3. Sudden prediction shift after a deploy
Wrong model version/alias, preprocessing change, feature schema/units change upstream, default-value changes. Diff model versions, inspect null rates and ranges, roll back first, investigate second.

### D4. Pipeline passes locally but fails in CI/cluster
Missing environment pins, hidden notebook state, absolute paths, data not available in CI, secrets missing, different CPU/GPU libs. Containerise, parameterise paths, use small fixtures.

### D5. Reproducing a past model fails
Data not versioned, dependencies unpinned, randomness unseeded, config not logged. Introduce DVC/snapshots, lockfiles, seeds, and log the full config + commit SHA in the run.

### D6. Online latency spikes
Cold starts, large batch of simultaneous requests, GC pauses, slow feature lookups, thread contention, noisy neighbours. Add profiling/tracing per stage, warm pools, caching, async I/O, tune workers, set timeouts.

### D7. GPU endpoint underutilised but expensive
Low request rate, no batching, oversized instance. Enable dynamic batching, consolidate models, use autoscaling/scale-to-zero, or move to CPU/quantised models.

### D8. Retraining pipeline silently produces a worse model
No evaluation gate or weak validation set, data issue (label leakage fix/removal), time-split mistakes. Add automated gates with slices, compare to champion, alert on large metric swings.

### D9. Feature values differ between offline and online stores
Different computation logic or time windows, late data, backfill gaps. Add consistency tests (sample entities, compare), single-definition feature code, monitor freshness.

### D10. Monitoring dashboard shows no drift but business KPI dropped
Concept drift (relationship changed), upstream label change, or non-ML cause (UI change, seasonality). Evaluate with fresh labels, slice analysis, A/B holdouts and correlate with product changes.

### D11. Too many false drift alerts
Thresholds too tight, small sample windows, seasonal patterns, unimportant features. Aggregate alerts, weight by feature importance, use larger windows, seasonality-aware baselines, and tiered severity.

### D12. Container image is huge and slow to deploy
Unpruned base image, dev dependencies, cached pip layers, model baked in repeatedly. Use slim/multi-stage builds, separate model artefacts from images, layer caching, and registry pull-through caches.

### D13. Model works for one segment but fails for another
Imbalanced training data, unseen categories, distribution mismatch. Add slice metrics to gates, collect more data for the segment, tune thresholds per segment or train specialised models.

### D14. Rollback doesn't restore previous behaviour
Dependencies (feature definitions/preprocessing) changed along with the model, or cached predictions persisted. Version feature code with models, clear caches, deploy models as self-contained bundles.

### D15. Registry shows "production" model but traffic hits an older one
Deployment pins a version, not an alias, or the serving layer caches the model. Make deployment read the alias at rollout, verify with `/version` endpoints, add deployment audit checks.

---

# 🧩 Part 8: Tricky Questions

### T1. Is MLOps just DevOps for ML?
No. ML adds data and model artefacts, probabilistic behaviour, drift, evaluation uncertainty and fairness concerns that DevOps alone doesn't address.

### T2. Should every model have continuous training?
No. Retrain when justified by drift, decay or new data; unnecessary retraining adds cost and risk. Many stable models need only periodic review.

### T3. Is a feature store always required?
No. It pays off with many models sharing features, real-time features, or serious skew/leakage risks. Small teams can start with shared code and warehouse tables.

### T4. Does high AUC in monitoring guarantee business success?
No. AUC may stay stable while thresholds, calibration, costs or population change. Monitor business KPIs, calibration and segment metrics.

### T5. Can you detect all drift without labels?
No. Input drift can be benign, and concept drift can occur without input drift. Combine unsupervised signals with delayed labels and business metrics.

### T6. Is shadow deployment risk-free?
Mostly for users, but it doubles inference cost, can create side effects if the model triggers actions, and doesn't measure the effect of decisions on user behaviour.

### T7. Why not deploy the model that wins offline by 0.1% AUC?
Noise, extra complexity, latency or maintenance may outweigh the gain; confirm with confidence intervals and online tests.

### T8. Is pickle acceptable for model serialization?
Only in trusted environments. Pickle can execute code on load; prefer safer/portable formats (ONNX, safetensors, MLflow with signatures) and verify provenance.

### T9. Why can retraining on production data hurt?
Feedback loops, selection bias (labels only for accepted cases), unlabelled shifts, or data quality problems get baked into the new model. Use holdouts, exploration and validation on unbiased data.

### T10. Why should training and serving use the same code?
Duplicated logic drifts; subtle differences (rounding, null handling, time windows) cause skew. Share libraries or use a feature store/transform graph.

### T11. Does Kubernetes make ML deployment easy?
It provides primitives (scaling, rollout) but adds operational complexity; many teams are better served by managed endpoints or serverless inference until scale or control demands K8s.

### T12. Is it OK to log all inputs for monitoring?
Not if they contain PII or sensitive data. Log minimal necessary data, hash/redact, restrict access, and set retention.

### T13. Why is A/B testing ML models harder than UI tests?
Interference (shared resources, network effects), delayed outcomes, novelty effects, feedback loops, and the need for guardrail metrics beyond the primary KPI.

### T14. Can automated promotion replace human approval?
For low-risk models with strong gates, yes. High-risk models should require human review, independent validation and documented sign-off.

### T15. Is "model monitoring" the same as "observability"?
Monitoring checks known metrics; observability lets you investigate unknown issues via rich telemetry (traces, logs, features, predictions, lineage) to answer new questions.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- MLOps = DevOps + data + models + monitoring.
- Version code, data, models, configs.
- Track experiments: params, metrics, artefacts.
- Registry: versions, aliases, lineage, approvals.
- Feature store = consistent train/serve features.
- Training-serving skew kills silently.
- Data drift ≠ concept drift.
- PSI > 0.25 → investigate.
- Batch for cost; online for latency.
- Shadow → canary → ramp → rollback.
- Evaluation gates before promotion.
- CI tests code + data; CT retrains; CM monitors.
- Idempotent pipeline steps.
- Point-in-time joins prevent leakage.
- Containerise training and serving.
- Don't ship pickle from untrusted sources.
- Log predictions + later labels.
- Monitor segments, not just averages.
- Alerts need runbooks.
- Tier models by risk.
- Cost per prediction is a KPI.
- Platform = paved roads.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an MLOps pipeline you built
Use STAR: situation (manual notebook deployments, no monitoring) → goals (reproducible, automated, observable) → design (DVC/Git, MLflow tracking+registry, Airflow/Kubeflow pipeline, Docker, K8s/KServe, Evidently + Prometheus) → results (lead time 3 weeks → 2 days, rollback in minutes, drift alerts caught an upstream schema change) → lessons.

### P2. A production incident involving an ML model
Describe symptoms, detection (alert/KPI), mitigation (rollback/fallback), root cause (feature unit change upstream), fix (data contract + validation), and prevention (tests, monitors, runbook).

### P3. How did you reduce serving cost or latency?
Profiled bottlenecks; applied ONNX + quantisation, dynamic batching, caching and autoscaling; show before/after p95 latency and cost per 1,000 predictions.

### P4. How do you convince data scientists to adopt MLOps practices?
Offer templates that save time (one-command pipelines, auto-tracking), demonstrate wins (reproducing results, faster deployments), keep friction low, and provide support and documentation.

### P5. How do you decide what to automate first?
Start with biggest pain/risk: reproducibility (tracking + env), then deployment automation, then monitoring and retraining; measure lead time, failure rate and manual toil.

### P6. A disagreement between speed and governance
Explain tiering: lightweight path for low-risk models, strict gates for high-risk, with automation making compliance fast; align stakeholders through shared metrics.

### P7. How do you measure MLOps success?
Time-to-production, deployment frequency, change failure rate, time to detect/restore, % models with monitoring/owners/tests, reproducibility rate, cost per prediction, and business impact of models.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Lifecycle & principles: DevOps vs MLOps, maturity levels, roles, ML technical debt.
- Reproducibility: Git, DVC/lakeFS, environments, containers, seeds, configs.
- Tracking & registry: MLflow, W&B, model cards, lineage, aliases/stages.
- Data: validation, contracts, lineage, feature stores, point-in-time correctness.
- Pipelines: orchestration (Airflow/Dagster/Kubeflow/Argo), idempotency, caching, backfills.
- CI/CD/CT/CM: testing pyramid, evaluation gates, promotion, GitOps.
- Deployment: batch, online, streaming, edge, shadow/canary/blue-green/A-B, rollbacks.
- Serving: FastAPI, BentoML, KServe, Triton, Ray Serve, managed endpoints, batching, autoscaling.
- Monitoring: system, data, drift, performance, fairness, alerting, observability.
- Operations: retraining strategies, incident response, SRE for ML, DR, cost/FinOps.
- Security & governance: IAM, supply chain, privacy, compliance, responsible AI.
- LLMOps: prompt/version management, evaluation, guardrails, RAG ops, cost control.

## Mixed topics
- Feature store + point-in-time + online/offline consistency + skew monitoring.
- Registry + aliases + canary + rollback.
- Drift detection + alerting + retraining triggers + evaluation gates.
- Terraform/Helm/GitOps + K8s GPU pools + autoscaling.
- Data contracts + validation + lineage + incident response.
- LLM evaluation + guardrails + cost monitoring.

---

# 🔬 Part 12: Internals

### How MLflow stores things
Backend store (SQL DB or file) holds runs/params/metrics/registry metadata; artefact store (S3/GCS/Azure/local) holds files/models. A tracking server brokers access. Model format = folder with `MLmodel` (flavors, signature), env files (`conda.yaml`/`requirements.txt`) and serialised artefacts.

### How DVC works
Content-addressed cache: files are hashed (MD5/xxhash), stored in `.dvc/cache`, and referenced in `.dvc` or `dvc.lock` files committed to Git. `dvc push/pull` sync cache with a remote. Pipeline stages record deps/outs hashes to decide what to rerun.

### Feature store point-in-time join
For each `(entity, label_timestamp)` row, select the latest feature value with `feature_timestamp ≤ label_timestamp` (and within TTL). Implemented as an as-of join on the offline store; online store holds the latest value per key.

### Model serving request path
Load balancer → ingress/gateway → service → pre-processing (validation, features) → model runtime (batching queue → inference) → post-processing → response + async logging. Each hop contributes latency; tracing (OpenTelemetry) reveals the breakdown.

### Dynamic batching internals
Requests enter a queue; the scheduler waits up to `max_queue_delay` or until `preferred_batch_size` is reached, then runs one forward pass and splits outputs. Trades a bounded latency increase for higher throughput.

### Kubernetes rollout mechanics
A Deployment creates a new ReplicaSet and scales it up while scaling the old down according to `maxSurge/maxUnavailable`; readiness probes gate traffic. Canary controllers (Argo Rollouts, KServe, Istio) shift traffic weights gradually.

### Drift test mechanics
KS statistic = max distance between empirical CDFs; p-values become tiny with large samples, so use effect sizes (PSI, Wasserstein) and practical thresholds. Multivariate drift via classifier two-sample tests (AUC ≈ 0.5 means no drift).

### Pipeline caching
Step cache key = hash(code version, parameters, input artefact hashes). If unchanged, outputs are reused; otherwise the step runs. Non-deterministic steps must be seeded or excluded from caching.

### Registry aliases vs stages
Stages (Staging/Production) are deprecated in recent MLflow in favour of flexible **aliases** and tags, enabling multiple environments and custom workflows (verify per version).

### Observability data model
Metrics (aggregated numbers), logs (events), traces (request spans), plus ML-specific records (features, predictions, labels, explanations) joined via IDs and versions to support investigations.

---

# 📊 Part 13: Reference Tables

### Tool landscape
| Area | Options |
|---|---|
| Tracking | MLflow, W&B, Neptune, Comet |
| Data versioning | DVC, lakeFS, Delta Lake/Iceberg time travel |
| Orchestration | Airflow, Dagster, Prefect, Kubeflow, Argo, Vertex/SageMaker Pipelines |
| Feature store | Feast, Tecton, Databricks FS, Vertex FS, SageMaker FS |
| Serving | FastAPI, BentoML, KServe, Seldon, Triton, Ray Serve, TorchServe, SageMaker/Vertex |
| LLM serving | vLLM, TGI, TensorRT-LLM, SGLang |
| Monitoring | Evidently, WhyLabs, Arize, Fiddler, Prometheus, Grafana, OpenTelemetry |
| Data quality | Great Expectations, Pandera, Soda, TFDV, Deequ |
| Infra | Docker, Kubernetes, Terraform, Helm, Argo CD |

### Deployment patterns
| Pattern | Risk | Cost | Notes |
|---|---|---|---|
| Big-bang | High | Low | Avoid |
| Blue-green | Low | 2× infra | Instant rollback |
| Canary | Low | Small | Gradual, metric-gated |
| Shadow | Very low | Extra inference | No user impact; no behaviour feedback |
| A/B | Low | Moderate | Measures business impact |

### Drift metrics
| Metric | Best for |
|---|---|
| PSI | Binned numeric/categorical, scorecards |
| KS test | Continuous features (use effect size) |
| Wasserstein | Continuous, interpretable distance |
| Chi-square / JS divergence | Categorical |
| Domain classifier AUC | Multivariate drift |
| Embedding distance | Text/image drift |

### Testing layers
| Layer | Examples |
|---|---|
| Code | Unit tests for transforms |
| Data | Schema, ranges, nulls, distributions |
| Model | Metric thresholds, slices, invariance, calibration |
| Pipeline | End-to-end on sample data |
| Serving | API contract, load, latency |
| Governance | Fairness, explainability, documentation checks |

### Maturity levels
| Level | Characteristics |
|---|---|
| 0 | Manual notebooks, ad hoc deployment |
| 1 | Automated training pipeline, registry, basic monitoring |
| 2 | CI/CD/CT automation, feature store, systematic monitoring, governance |
| 3 | Platform at scale, self-service, risk-tiered controls, continuous optimisation |

### Key SLO examples
| SLO | Target example |
|---|---|
| Availability | 99.9% |
| p95 latency | < 150 ms |
| Feature freshness | < 5 min |
| Prediction drift alert time | < 1 hour |
| Model quality | AUC ≥ 0.82 on weekly labelled sample |
| Rollback time | < 10 min |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
PSI for reference bins `[0.5, 0.5]` and current `[0.3, 0.7]`:
`(0.3−0.5)·ln(0.3/0.5) + (0.7−0.5)·ln(0.7/0.5)` = `(−0.2)(−0.511) + (0.2)(0.336)` = `0.102 + 0.067` ≈ **0.169** (moderate shift).

### O2.
A service handles 200 requests/s; each pod sustains 50 req/s at target utilisation. Pods needed = **4** (plus headroom, e.g., 5–6).

### O3.
Canary at 10% with 1,000 requests/min: new model receives about **100 requests/min**.

### O4.
Dynamic batching: `max_batch=32`, `max_delay=10 ms`, arrival 1,000 req/s → average batch ≈ 10 (1,000 req/s × 0.01 s) before the delay expires.

### O5.
DVC: after changing only `train.py`, `dvc repro` reruns **train** (and downstream stages) but not `prepare`, because `prepare` dependencies are unchanged.

### O6.
Availability 99.9% monthly (30 days) allows about `0.001 × 43,200 min` = **43.2 minutes** of downtime.

### O7.
Model with latency p50 40 ms, p95 120 ms, p99 400 ms: SLO "p95 < 150 ms" is **met**; "p99 < 300 ms" is **violated**.

### O8.
Cost: 2 GPU instances at $2.50/hour, 720 hours/month = **$3,600/month**; at 40 req/s average (≈ 103.7M requests/month) cost per 1,000 requests ≈ **$0.035**.

### O9.
Time-travel check: feature value updated at 10:00 (=5) and 14:00 (=8). Label timestamp 12:00 → point-in-time join returns **5**.

### O10.
Registry alias `production` points to v7; you set `production` to v8 then roll back by re-pointing to **v7** (no redeploy of code needed if serving reads aliases).

### O11.
Retraining trigger: weekly schedule and drift alert. If both fire on the same day, pipelines should **deduplicate (single run)** via concurrency control/idempotency.

### O12.
A/B test sample size intuition: baseline conversion 5%, detect +0.5pp (10% relative) with 80% power, α=0.05 → roughly **31,000 users per arm** (≈ 62,000 total) using the standard two-proportion approximation.

---

# ✅ Part 15: MCQs

**1. Training-serving skew is best prevented by:**
A) Bigger models  B) Shared feature code / feature store and validation  C) Higher learning rate  D) More epochs
**Answer: B**

**2. Which describes concept drift?**
A) `P(X)` changes  B) `P(y|X)` changes  C) Only model latency changes  D) Only label count changes
**Answer: B**

**3. DVC primarily versions:**
A) Docker images  B) Large data and model files alongside Git  C) Kubernetes manifests  D) SQL queries
**Answer: B**

**4. A canary deployment:**
A) Replaces all traffic at once  B) Sends a small share of traffic to the new version first  C) Runs offline only  D) Duplicates traffic without using responses
**Answer: B**

**5. Shadow deployment:**
A) Serves new model responses to users  B) Mirrors live traffic to the new model without affecting users  C) Is the same as A/B testing  D) Requires no extra compute
**Answer: B**

**6. A model registry provides:**
A) GPU scheduling  B) Versioning, lineage, aliases/stages and approvals for models  C) Data labelling  D) Feature computation
**Answer: B**

**7. Which is a point-in-time correctness failure?**
A) Using feature values available after the label timestamp  B) Using a smaller batch  C) Logging predictions  D) Using Docker
**Answer: A**

**8. PSI above 0.25 commonly indicates:**
A) Stable distribution  B) Significant shift  C) Faster inference  D) Better accuracy
**Answer: B**

**9. Which is the right trigger for retraining?**
A) Always daily  B) Schedule, drift or performance decay combined with evaluation gates  C) Only manual requests  D) Never
**Answer: B**

**10. Dynamic batching improves:**
A) Accuracy  B) GPU utilisation/throughput at bounded latency cost  C) Data quality  D) Model size
**Answer: B**

**11. Which tool is a Kubernetes-native model serving framework?**
A) KServe  B) Pandas  C) Hydra  D) Optuna
**Answer: A**

**12. CI/CD/CT/CM: "CT" means:**
A) Continuous Testing only  B) Continuous Training  C) Container Tagging  D) Cost Tracking
**Answer: B**

**13. Which format can execute arbitrary code when loaded?**
A) ONNX  B) safetensors  C) pickle  D) JSON
**Answer: C**

**14. Best practice for promoting models across environments:**
A) Rebuild in each environment  B) Promote the same immutable artefact  C) Copy notebooks  D) Retrain in prod
**Answer: B**

**15. Which monitoring signal works without labels?**
A) Accuracy  B) Prediction/feature distribution drift  C) F1  D) AUC
**Answer: B**

**16. Data contracts are meant to:**
A) Speed up training  B) Define and enforce schema/semantics/SLAs between data producers and consumers  C) Compress data  D) Replace tests
**Answer: B**

**17. Which deployment gives instant rollback via traffic switch between two full environments?**
A) Canary  B) Blue-green  C) Shadow  D) Big-bang
**Answer: B**

**18. Which is NOT usually part of an ML pipeline gate?**
A) Data validation  B) Slice metrics  C) Comparison with champion  D) Changing the test set to improve scores
**Answer: D**

---

# ⚠️ Part 16: Common Mistakes

- Treating deployment as the finish line; no monitoring, ownership or retraining plan.
- Notebook-only workflows with hidden state and unpinned dependencies.
- Not versioning data, features and configuration with the model.
- Duplicate feature logic in training and serving (skew).
- No evaluation gate, or gates that ignore slices and calibration.
- Random splits for time-dependent data; leakage via future features.
- Relying on accuracy-only monitoring when labels are delayed or absent.
- Alerting on every tiny drift without prioritisation.
- Logging PII in prediction logs.
- Deploying pickle files from untrusted sources.
- Rebuilding artefacts per environment instead of promoting immutable ones.
- Over-engineering (Kubernetes + feature store) for a single small model.
- No rollback plan or kill switch for high-risk models.
- Ignoring cost until the cloud bill arrives.
- Not documenting ownership, runbooks and model cards.
- Training on feedback-loop-biased data without holdouts or exploration.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You think in systems: data → features → training → serving → monitoring → feedback, with clear ownership.
- You prevent skew and leakage by design (shared transforms, point-in-time joins, contracts).
- You automate evaluation gates with slices, calibration and champion/challenger comparisons.
- You choose deployment patterns by risk (shadow/canary/rollback) and measure real business impact.
- You monitor data, predictions, quality and cost, with actionable alerts and runbooks.
- You right-size the solution: managed endpoint vs Kubernetes, batch vs online, feature store vs shared code.
- You embed security, privacy and governance without killing velocity (risk tiering, paved roads).
- You quantify outcomes: lead time, failure rate, MTTR, cost per prediction, ROI.
- You can explain failures in terms of the whole pipeline, not just the model.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Pipeline template
```
ingest → validate data → time/group-aware split → featurise
 → train (tracked) → evaluate (overall + slices + calibration)
 → compare with champion → register (alias=candidate) → approve
 → package (container/ONNX) → deploy (shadow → canary → ramp)
 → monitor (system, data, prediction, quality, cost) → feedback → retrain
```

### What to version
Code (Git) • Data (DVC/lakeFS/snapshots) • Features (definitions + values) • Config/params • Environment (lockfile/image) • Model (registry) • Evaluation reports • Docs (model card).

### Monitoring checklist
Latency/errors/throughput • feature schema, nulls, ranges • feature & prediction drift • delayed accuracy/AUC • calibration • segment metrics • business KPIs • cost/GPU utilisation • fairness checks.

### Deployment checklist
Immutable artefact • signature/schema check • smoke tests • readiness probe • canary + auto-rollback • logging of predictions/versions • secrets managed • runbook + on-call.

### Key phrases to use
Training-serving skew • point-in-time correctness • champion/challenger • evaluation gate • data contract • idempotent pipeline • paved road • risk-tiered governance • error budget • blast radius.

### Final checklist before the interview
- [ ] Explain MLOps vs DevOps and the full ML lifecycle.
- [ ] Describe experiment tracking, data/model versioning and reproducibility.
- [ ] Design a training pipeline with validation, evaluation gates and registry promotion.
- [ ] Explain feature stores, training-serving skew and point-in-time joins.
- [ ] Compare batch/online/streaming/edge serving and deployment patterns.
- [ ] Describe Docker/Kubernetes/KServe/Triton serving, autoscaling, batching, cost.
- [ ] Design monitoring: data/concept drift, delayed labels, alerts, retraining triggers.
- [ ] Cover security, privacy, governance and responsible AI controls.
- [ ] Discuss LLMOps differences (prompt/version management, evaluation, guardrails, cost).
- [ ] Prepare a story with measurable improvements (lead time, reliability, cost) and a failure lesson.
