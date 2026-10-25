# Monitoring & Observability Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the open-source and cloud observability stack as of 2025–2026: **Prometheus 3.x, Alertmanager, Grafana 11/12, Loki, Tempo, Mimir, OpenTelemetry (OTel) API/SDK/Collector with the stable traces and metrics signals and maturing logs, Jaeger 2, Elastic (ELK/EFK), Fluent Bit, Vector**, plus managed services (**Amazon CloudWatch, Azure Monitor, Google Cloud Monitoring, Datadog, New Relic, Grafana Cloud, Sentry**). Also covered: SLI/SLO/error budgets from Google SRE, RED/USE/Four Golden Signals, and incident management. Versions and product names change often: anything marked "verify" should be checked in the official docs. Examples use the sample name **Ritesh Kumar** and a service called `orders-api`.
> This file covers monitoring vs observability, the three pillars (metrics, logs, traces) and beyond (profiles, events, RUM), instrumentation, Prometheus data model and PromQL, Alertmanager, Grafana dashboards, log pipelines (Loki, ELK), distributed tracing, OpenTelemetry, SLIs/SLOs and burn-rate alerting, alert design, cardinality and cost, Kubernetes monitoring, cloud-native monitoring, synthetic and real-user monitoring, incident response and postmortems, and observability strategy. Related topics: Docker in `045_Docker.md`, Kubernetes in `046_Kubernetes.md`, CI/CD in `047_CI-CD-and-DevOps.md`, AWS/Azure/GCP in `048_AWS.md`/`049_Azure.md`/`050_GCP.md`, IaC in `051_Terraform-and-IaC.md`, system design in `../09_System_Design/053_System-Design.md`, Linux tools in `024_Linux-and-Networking.md`.

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
- [Part 12: Observability Internals](#-part-12-observability-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is monitoring? *(Must-know)*
Collecting, storing and checking known signals (CPU, error rate, latency, disk) and alerting when they cross a limit. Monitoring answers "is it working?" for problems you thought of in advance.

### Q2. What is observability? *(Must-know)*
The ability to understand what is happening inside a system by looking at the data it emits (metrics, logs, traces). It answers "why is it broken?" even for problems you did not predict. Monitoring is something you do; observability is a property of the system.

### Q3. Monitoring vs observability
| Aspect | Monitoring | Observability |
|---|---|---|
| Question | Is it up? | Why is it slow/failing? |
| Problems | Known unknowns | Unknown unknowns |
| Data | Predefined metrics and checks | Rich, high-detail telemetry you can slice |
| Output | Dashboards and alerts | Exploration and root cause |

### Q4. The three pillars *(Must-know)*
- **Metrics:** numbers over time (request rate, CPU). Cheap, good for alerting and trends.
- **Logs:** timestamped event records. Detailed, good for "what happened".
- **Traces:** the path of one request across services with timing for each step. Good for "where is the time spent".
Newer additions: **profiles** (CPU/memory by function), **events**, and **RUM** (real-user data).

### Q5. What is telemetry?
The data a system sends out about itself: metrics, logs, traces, profiles. Collected by agents, SDKs or the platform.

### Q6. What is a metric? Types
- **Counter:** only goes up (requests total). Use `rate()`.
- **Gauge:** goes up and down (memory used, queue size).
- **Histogram:** counts observations in buckets (latency); lets you compute percentiles.
- **Summary:** client-side quantiles (cannot be aggregated across instances).

### Q7. What is a log? Structured vs unstructured
Unstructured: `User 42 failed login`. Structured (JSON): `{"level":"warn","event":"login_failed","user_id":42,"trace_id":"abc"}`. Structured logs are searchable and cheaper to analyze. Include level, timestamp, service, request or trace id.

### Q8. Log levels
`TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`. Production usually runs at INFO. Do not log secrets or personal data.

### Q9. What is a trace and a span?
A **trace** is the whole journey of one request. A **span** is one unit of work inside it (an HTTP call, a DB query) with start time, duration, attributes and a parent span id. A **trace id** links all spans.

### Q10. What is an SLI, SLO and SLA? *(Must-know)*
- **SLI (indicator):** a measured number, e.g., "% of requests under 300 ms and not 5xx".
- **SLO (objective):** the target, e.g., "99.9% over 30 days".
- **SLA (agreement):** a contract with consequences (credits) if you miss a target; usually looser than the internal SLO.

### Q11. What is an error budget?
`100% − SLO`. A 99.9% SLO over 30 days allows about **43 minutes** of failure. If the budget is used up, slow down releases and focus on reliability; if there is budget left, you can take risk.

### Q12. The Four Golden Signals (Google SRE) *(Must-know)*
**Latency**, **traffic**, **errors**, **saturation**. Measure these for every user-facing service. Separate latency of successful and failed requests.

### Q13. RED and USE methods
- **RED** (services): **R**ate, **E**rrors, **D**uration.
- **USE** (resources): **U**tilization, **S**aturation, **E**rrors, for CPU, memory, disk, network.

### Q14. What is Prometheus? *(Must-know)*
An open-source metrics system. It **pulls (scrapes)** HTTP `/metrics` endpoints on a schedule, stores samples in a local time-series database, and supports the **PromQL** query language and alerting rules. Good for dynamic environments such as Kubernetes with service discovery.

### Q15. What is Grafana?
A visualization and dashboard tool that queries many data sources (Prometheus, Loki, Tempo, Elasticsearch, CloudWatch, SQL). It also has alerting and Explore for ad hoc queries.

### Q16. What is Alertmanager?
Receives alerts from Prometheus and handles **grouping, deduplication, silencing, inhibition and routing** to receivers (Slack, email, PagerDuty). Prometheus decides *when* an alert fires; Alertmanager decides *who* is told and how.

### Q17. What is the ELK / EFK stack?
**Elasticsearch** (store/search), **Logstash** (or **Fluentd/Fluent Bit** in EFK) for collecting and processing, **Kibana** for visualization. A common log stack. Alternative: **Grafana Loki**, which indexes only labels, so it is cheaper.

### Q18. What is a log shipper / agent?
A small program on each host/node that reads logs and sends them onward: Fluent Bit, Fluentd, Vector, Filebeat, the OpenTelemetry Collector. In Kubernetes it usually runs as a DaemonSet.

### Q19. What is OpenTelemetry (OTel)? *(Must-know)*
A vendor-neutral CNCF standard and set of tools for generating and collecting telemetry: **APIs, SDKs, the OTLP protocol and the Collector**. You instrument once and send data to any backend (Prometheus, Jaeger, Datadog, Grafana Cloud, etc.).

### Q20. What is the OpenTelemetry Collector?
A standalone service that receives telemetry (OTLP, Prometheus, Jaeger…), processes it (batch, filter, add attributes, sample) and exports it to backends. Pipelines: **receivers → processors → exporters**.

### Q21. What is instrumentation?
Adding code or agents so an application emits telemetry. **Automatic** (agents or libraries hook frameworks with no code change) and **manual** (you add custom spans/metrics for business logic).

### Q22. What is an alert? Good vs bad alert
An alert notifies a human (or system) that action is needed. Good: **actionable, urgent, user-impact based, with a runbook**. Bad: noisy CPU alerts nobody acts on.

### Q23. What is a dashboard for?
Quick visual understanding: a service overview (RED), infrastructure health, business KPIs. A good dashboard answers a question; a bad one has 60 random graphs.

### Q24. What is uptime and how is it calculated?
`uptime % = (total time − downtime) / total time`. 99.9% ≈ 8.76 hours downtime per year; 99.99% ≈ 52.6 minutes; 99.999% ≈ 5.26 minutes.

### Q25. Push vs pull monitoring
- **Pull (Prometheus):** server scrapes targets; easy to detect "target down", central control.
- **Push (StatsD, OTLP, CloudWatch agent):** apps send data; better for short-lived jobs and firewalled networks.
Prometheus uses **Pushgateway** only for short batch jobs.

### Q26. What is a health check? Liveness vs readiness
A probe that tells if a service is OK. **Liveness:** is the process alive (restart if not). **Readiness:** can it take traffic (remove from load balancer if not). See `046_Kubernetes.md`.

### Q27. What is latency, throughput and availability?
Latency: time per request. Throughput: requests per second. Availability: share of time or requests that succeed.

### Q28. Percentiles: p50, p95, p99
p99 = 99% of requests are faster than this value. Averages hide slow requests. Use percentiles (from histograms) for latency.

### Q29. What is APM?
Application Performance Monitoring: tracing, error tracking and performance data for application code (Datadog APM, New Relic, Dynatrace, Elastic APM, Sentry).

### Q30. What is on-call?
A rotation of engineers who respond to alerts out of hours. Tools: PagerDuty, Opsgenie, Grafana OnCall, Incident.io. Good practice: clear runbooks, fair rotation, low noise, escalation policy.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Prometheus data model *(Must-know)*
A time series is identified by a **metric name and labels**: `http_requests_total{service="orders-api",method="GET",status="200"}`. Each sample = (timestamp, float64 value). Every unique label combination is a separate series.

### Q32. Basic PromQL *(Must-know)*
```promql
# requests per second over 5 minutes
rate(http_requests_total{service="orders-api"}[5m])

# error ratio
sum(rate(http_requests_total{status=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))

# p95 latency from a histogram
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
```
`rate()` works on counters; `sum by` / `sum without` aggregate; always keep `le` when aggregating buckets.

### Q33. `rate` vs `irate` vs `increase`
`rate` = per-second average over the window (smooth, use for alerts). `irate` = based on the last two points (spiky, for fast-moving graphs). `increase` = total growth over the window.

### Q34. Scrape configuration and service discovery
```yaml
scrape_configs:
  - job_name: orders-api
    kubernetes_sd_configs: [{ role: pod }]
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"
```
Targets come from static lists, DNS, Kubernetes, Consul, EC2/GCE. **Relabeling** filters targets and rewrites labels. In Kubernetes, the Prometheus Operator uses `ServiceMonitor`/`PodMonitor` CRDs.

### Q35. Common exporters
`node_exporter` (host metrics), `kube-state-metrics` (Kubernetes object state), cAdvisor (container metrics), `blackbox_exporter` (probe HTTP/TCP/ICMP), `mysqld_exporter`, `postgres_exporter`, `redis_exporter`, `cloudwatch_exporter`.

### Q36. Recording rules and alerting rules
```yaml
groups:
- name: orders
  rules:
  - record: job:http_errors:ratio_rate5m
    expr: sum by (job)(rate(http_requests_total{status=~"5.."}[5m]))
        / sum by (job)(rate(http_requests_total[5m]))
  - alert: HighErrorRate
    expr: job:http_errors:ratio_rate5m > 0.05
    for: 10m
    labels: { severity: page }
    annotations:
      summary: "{{ $labels.job }} error ratio above 5%"
      runbook_url: https://wiki.acme.dev/runbooks/high-error-rate
```
Recording rules precompute expensive queries. `for:` avoids flapping alerts.

### Q37. Alertmanager routing example
```yaml
route:
  receiver: slack-default
  group_by: [alertname, service]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers: [severity="page"]
      receiver: pagerduty
receivers:
  - name: pagerduty
    pagerduty_configs: [{ routing_key_file: /etc/secrets/pd }]
  - name: slack-default
    slack_configs: [{ channel: "#alerts", api_url_file: /etc/secrets/slack }]
inhibit_rules:
  - source_matchers: [alertname="NodeDown"]
    target_matchers: [severity="warning"]
    equal: [instance]
```
**Silences** mute alerts for a period (maintenance). **Inhibition** suppresses lower-value alerts when a bigger one fires.

### Q38. Instrumenting an app with Prometheus client (Node.js)
```js
const client = require('prom-client');
client.collectDefaultMetrics();
const latency = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5],
});
app.use((req, res, next) => {
  const end = latency.startTimer();
  res.on('finish', () => end({ method: req.method, route: req.route?.path ?? 'unknown', status: res.statusCode }));
  next();
});
app.get('/metrics', async (_, res) => res.type(client.register.contentType).send(await client.register.metrics()));
```
Label with the **route template**, not the raw URL (avoid high cardinality).

### Q39. What is cardinality and why does it matter? *(Must-know)*
Cardinality = number of unique series. Labels like `user_id`, `request_id`, `email` or full URLs explode series count, causing high memory use, slow queries and big bills. Keep labels low and bounded; put high-detail data in logs or traces.

### Q40. Grafana basics: data sources, variables, panels
Add data sources, build panels with queries, use **variables** (`$service`, `$env`) for reusable dashboards, set thresholds and units, link panels to logs/traces. Store dashboards as code (JSON, Jsonnet/Grafonnet, Terraform, provisioning).

### Q41. Grafana Loki and LogQL
Loki stores log lines with a small index on labels (`{app="orders-api", env="prod"}`).
```logql
{app="orders-api"} |= "error" | json | status >= 500
sum by (route) (rate({app="orders-api"} |= "error" [5m]))
```
Cheaper than full-text indexing; use labels sparingly (low cardinality).

### Q42. Logging best practices
Structured JSON, consistent fields, correlation/trace ids, stdout in containers (let the platform collect), correct levels, no secrets/PII, sampling for noisy debug logs, retention by value, and time sync (NTP).

### Q43. Kubernetes monitoring basics
Metrics: node and pod CPU/memory (`metrics-server`, cAdvisor), object state (`kube-state-metrics`), control plane metrics, application metrics via `ServiceMonitor`. Key alerts: pod crash loops, OOMKilled, pending pods, node not ready, PVC full, high CPU throttling. The `kube-prometheus-stack` Helm chart installs Prometheus, Alertmanager, Grafana and rules.

### Q44. Distributed tracing: how context propagates
Each service passes trace context in headers. The W3C standard is the **`traceparent`** header: `00-<trace-id>-<parent-span-id>-<flags>`. Libraries extract it on incoming requests and inject it on outgoing calls, so spans join into one trace.

### Q45. Tracing backends
Jaeger, Grafana Tempo, Zipkin, Elastic APM, AWS X-Ray, Azure Application Insights, Google Cloud Trace, Datadog, Honeycomb. Choose by cost, scale (object storage-based Tempo is cheap), and integration.

### Q46. Sampling in tracing
Storing every trace is costly. **Head sampling** decides at the start (simple, random %). **Tail sampling** decides after the trace completes (keep errors and slow traces) and needs a Collector tier that sees whole traces.

### Q47. Correlating metrics, logs and traces
Add `trace_id` to logs; use **exemplars** (trace ids attached to histogram buckets) to jump from a latency spike to an example trace; use consistent resource attributes (`service.name`, `deployment.environment`). Grafana links Loki ↔ Tempo ↔ Prometheus.

### Q48. Black-box vs white-box monitoring
Black-box: test from outside like a user (probe a URL, synthetic checks). White-box: use internal metrics and logs. You need both: black-box tells users are hurt; white-box tells why.

### Q49. Synthetic monitoring and RUM
**Synthetic:** scripted checks from several locations (uptime, login flow). **RUM:** real user browser/mobile data (Core Web Vitals, JS errors, page load). Tools: Grafana Synthetic Monitoring, Datadog, New Relic, Sentry, Lighthouse CI, `blackbox_exporter`.

### Q50. Cloud-native monitoring services
- **AWS:** CloudWatch (metrics, logs, alarms, Logs Insights), X-Ray, CloudTrail (audit).
- **Azure:** Azure Monitor, Log Analytics (KQL), Application Insights.
- **GCP:** Cloud Monitoring, Cloud Logging, Cloud Trace.
See `048_AWS.md`, `049_Azure.md`, `050_GCP.md`.

### Q51. CloudWatch basics
Metrics (namespace, dimensions, 1-minute standard resolution; high-resolution 1 s), Alarms (OK/ALARM/INSUFFICIENT_DATA), Logs groups/streams, Logs Insights queries, EventBridge integration, Container Insights. Custom metrics cost money per metric.

### Q52. Disk, CPU, memory: what to monitor on a host
CPU (user/system/iowait, load average), memory (available, swap use), disk (usage, inodes, IOPS, latency), network (throughput, errors, drops), file descriptors, and process counts. Alert on **saturation and predicted exhaustion** (`predict_linear`) more than static percentages.

### Q53. `predict_linear` example
```promql
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) < 0
```
Fires if the disk will fill within 24 hours.

### Q54. Alert fatigue
Too many low-value alerts cause people to ignore pages. Fix: page only on user impact, delete unactionable alerts, group and deduplicate, use severities (page vs ticket), add runbooks, and review alert quality every month.

### Q55. Symptom-based vs cause-based alerts
Alert on **symptoms** users feel (error rate, latency, SLO burn). Use **cause** metrics (CPU, pool size) on dashboards for diagnosis. Cause alerts only for things that will definitely become symptoms (disk filling).

### Q56. Basic runbook
A short document linked from the alert: what the alert means, impact, quick checks, dashboards, common fixes, escalation contacts, and rollback steps.

### Q57. Metrics for databases and queues
DB: connections, query latency, slow queries, replication lag, locks, cache hit ratio. Queues: depth, age of oldest message, consumer lag (Kafka), processing rate, dead-letter count. See `../03_Backend/038_Message-Queues.md`.

### Q58. Health endpoints and dependencies
`/healthz` (liveness, cheap), `/readyz` (readiness, checks critical dependencies carefully). Avoid readiness checks that fail the whole fleet when one optional dependency is down.

### Q59. Dashboards as code
Use Grafana provisioning, Terraform (`grafana_dashboard`), Jsonnet or Grafana Foundation SDK, and keep alerts/rules in Git (PrometheusRule CRDs). Benefits: review, rollback, consistency across environments. See `051_Terraform-and-IaC.md`.

### Q60. Basic incident flow
Detect → triage (severity) → communicate → mitigate (rollback, scale, failover) → resolve → postmortem. Mitigate first, find root cause after.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. SLO design in practice *(Must-know)*
1. Choose critical user journeys (checkout, login).
2. Define SLIs: availability = good events / valid events; latency = % under threshold.
3. Set SLO from user needs and history (not 100%).
4. Compute the error budget and agree on a policy (freeze releases when exhausted).
5. Report weekly and review quarterly.
Example SLI: `sum(rate(http_requests_total{code!~"5.."}[30d])) / sum(rate(http_requests_total[30d]))`.

### Q62. Multi-window, multi-burn-rate alerts *(Must-know)*
Burn rate = how fast you consume the error budget (1 = exactly on budget). For a 99.9% SLO over 30 days, common Google SRE-style pairs:
| Severity | Burn rate | Long window | Short window | Budget used |
|---|---|---|---|---|
| Page | 14.4 | 1 h | 5 min | 2% |
| Page | 6 | 6 h | 30 min | 5% |
| Ticket | 3 | 1 day | 2 h | 10% |
| Ticket | 1 | 3 days | 6 h | 10% |
```promql
(  sum(rate(http_requests_total{code=~"5.."}[1h])) / sum(rate(http_requests_total[1h])) > (14.4 * 0.001)
and
   sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > (14.4 * 0.001) )
```
The long window gives significance; the short window makes the alert reset quickly. Tools such as **Sloth** and **Pyrra** generate these rules.

### Q63. Histogram buckets and accuracy
Percentile accuracy depends on bucket layout; choose buckets around your SLO threshold (e.g., include 0.3 s if SLO is 300 ms). Native histograms (Prometheus 3.x, still opt-in; verify) give high-resolution buckets with lower cost.

### Q64. Prometheus architecture and storage
Retrieval (scrape) → TSDB (WAL, 2-hour blocks compacted, local disk) → PromQL engine → rules → Alertmanager. Local storage is single-node, not clustered. Retention is time or size based (`--storage.tsdb.retention.time`). For long-term, HA and global view use **remote write** to Mimir, Thanos, Cortex, VictoriaMetrics or Grafana Cloud.

### Q65. High availability for Prometheus
Run two identical replicas scraping the same targets with external labels (`replica="a"`); Alertmanager deduplicates. For global queries and long retention add **Thanos** (sidecar + object store + querier) or send to **Mimir**. HA gives availability, not scale.

### Q66. Scaling Prometheus
Shard by team/job with functional sharding, use recording rules, drop unused metrics (`metric_relabel_configs`), reduce scrape frequency, use agent mode + remote write, or move to Mimir/VictoriaMetrics. Watch active series, samples per second and memory.

### Q67. Prometheus agent mode and remote write
Agent mode scrapes and forwards via remote write without local querying/alerting; reduces footprint at edge clusters. Remote write has a queue; monitor `prometheus_remote_storage_*` metrics for lag and failures.

### Q68. Thanos vs Mimir vs Cortex vs VictoriaMetrics
| Option | Idea | Notes |
|---|---|---|
| Thanos | Sidecars upload blocks to object storage, global query | Keeps Prometheus as is; query layer complexity |
| Mimir | Horizontally scalable multi-tenant TSDB on object storage | From Grafana Labs, successor to Cortex |
| VictoriaMetrics | Efficient single binary or cluster | Simple ops, PromQL-compatible (MetricsQL) |
| Managed (AMP, GMP, Grafana Cloud) | Provider runs it | Pay per series/sample |

### Q69. OpenTelemetry in practice *(Must-know)*
Instrument apps with OTel SDK/auto-instrumentation, send **OTLP** (gRPC 4317 / HTTP 4318) to a Collector, which batches and exports to backends.
```yaml
receivers:
  otlp: { protocols: { grpc: {}, http: {} } }
processors:
  memory_limiter: { check_interval: 1s, limit_mib: 512 }
  batch: {}
  resource: { attributes: [{ key: deployment.environment, value: prod, action: upsert }] }
exporters:
  otlphttp/tempo: { endpoint: http://tempo:4318 }
  prometheusremotewrite: { endpoint: http://mimir:9009/api/v1/push }
  loki: { endpoint: http://loki:3100/loki/api/v1/push }
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, resource, batch], exporters: [otlphttp/tempo] }
    metrics: { receivers: [otlp], processors: [memory_limiter, batch], exporters: [prometheusremotewrite] }
    logs:    { receivers: [otlp], processors: [memory_limiter, batch], exporters: [loki] }
```
Collector deployment patterns: **agent** (per node/sidecar), **gateway** (central pool), or both.

### Q70. OTel semantic conventions and resources
Standard attribute names (`http.request.method`, `db.system`, `service.name`, `k8s.pod.name`) make data portable and dashboards reusable. **Resource attributes** describe the entity producing data. Convention names changed in recent versions (HTTP attributes), so check the version.

### Q71. Auto vs manual instrumentation trade-offs
Auto: quick coverage of frameworks, HTTP, DB; less control, some overhead. Manual: business spans/metrics (`order.id` as a span attribute, not metric label). Best: auto first, then add manual spans where the business logic is.

### Q72. Tail sampling configuration idea
Collector `tail_sampling` processor with policies: keep all errors, keep traces slower than 1 s, keep 5% of the rest. Requires all spans of a trace to reach the same Collector instance (load-balancing exporter by trace id).

### Q73. Log pipeline design
App stdout → node agent (Fluent Bit/OTel) → parse/enrich (k8s metadata) → buffer (Kafka optional) → store (Loki/Elasticsearch/OpenSearch/cloud) → query/alerts. Add backpressure handling, retries, drop rules for noise, PII redaction, and tiered retention (hot 7–14 days, cold/archive in object storage).

### Q74. Elasticsearch/OpenSearch logging pitfalls
Mapping explosions from dynamic fields, too many shards, no ILM (index lifecycle) policies, heavy wildcard queries, large JSON fields. Use data streams, ILM/rollover, explicit mappings and shard sizing (~10–50 GB).

### Q75. Loki vs Elasticsearch
| Aspect | Loki | Elasticsearch |
|---|---|---|
| Indexing | Labels only | Full-text inverted index |
| Cost | Lower storage/index cost | Higher |
| Search | Grep-style over streams, fast with good labels | Rich full-text and aggregations |
| Best for | Kubernetes logs correlated with metrics | Search analytics, security use cases |

### Q76. Kubernetes alerts you should have
`KubePodCrashLooping`, `KubePodNotReady`, `KubeDeploymentReplicasMismatch`, `KubeNodeNotReady`, `ContainerOOMKilled`, `CPUThrottlingHigh`, `KubePersistentVolumeFillingUp`, API server latency/errors, etcd leader changes, certificate expiry. The `kubernetes-mixin` rules provide a tested starting set.

### Q77. Monitoring microservices: service maps and dependencies
Use trace-derived **service graphs** (Tempo metrics-generator, Jaeger), RED per service and per dependency edge, and golden-path dashboards. Alert at the edge (user-facing) and use traces to locate the failing dependency.

### Q78. Monitoring JVM, Node.js, Go, Python apps
JVM: heap, GC pauses, thread count (Micrometer → Prometheus). Node: event loop lag, heap, active handles. Go: goroutines, GC, memory. Python: worker count, request time, GC. Add business metrics (orders per minute). See `../03_Backend/016_Java.md` and the other language notes in `../03_Backend/`.

### Q79. Using exemplars
Histograms can attach a `trace_id` to a sample. In Grafana, click a latency spike point to open the exact trace. Needs OpenMetrics format and exemplar storage enabled (verify per version).

### Q80. Time series downsampling and retention
Raw data 15 days, 5-minute rollups for 90 days, 1-hour rollups for a year (Thanos compactor, Mimir, Datadog). Lower resolution loses short spikes; choose by use case (capacity planning vs incident debugging).

### Q81. Alert routing by ownership
Label alerts with `team`, `service`, `severity`. Route using Alertmanager matchers or the incident tool to the owning team. Keep a service catalog (Backstage) as the source of ownership.

### Q82. Dead man's switch / watchdog
An alert that **always fires**. If the receiver stops getting it, your alerting pipeline itself is broken. kube-prometheus-stack ships `Watchdog`; connect it to an external heartbeat (Healthchecks.io, PagerDuty heartbeat).

### Q83. Monitoring the monitoring
Alert on Prometheus target scrape failures (`up == 0`), rule evaluation failures, WAL corruption, remote write lag, Alertmanager notification failures, and Grafana availability. Host the meta-monitoring separately from the system it watches.

### Q84. Security and compliance in observability
Redact PII in logs/traces at the Collector, control access with RBAC (Grafana teams, Loki tenants), encrypt in transit (TLS/mTLS) and at rest, retain audit logs (CloudTrail, K8s audit), and set retention by regulation (GDPR, PCI). Avoid secrets in span attributes and labels.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design an observability platform for 100 microservices *(Must-know)*
1. **Standards:** OTel everywhere, shared semantic conventions, mandatory `service.name`, `team`, `env` attributes, structured logs with trace id.
2. **Collection:** node-level Collector agents + gateway tier; Prometheus scraping or OTel metrics.
3. **Storage:** Mimir (metrics), Loki (logs), Tempo (traces) on object storage; multi-tenant by team; hot/cold retention.
4. **Visualization:** Grafana with golden dashboards generated per service from a template.
5. **Alerting:** SLO burn-rate alerts per service from a catalog; routing by ownership; runbooks required.
6. **Governance:** cardinality limits per tenant, cost showback, sampling policy, onboarding docs.
7. **Reliability of the platform:** meta-monitoring, HA, capacity planning, backup of dashboards/rules in Git.
Trade-offs: build vs buy (Datadog/New Relic/Grafana Cloud), operational cost vs licence/per-host/per-GB cost.

### Q86. Build vs buy observability *(Must-know)*
| Factor | Self-hosted OSS | SaaS vendor |
|---|---|---|
| Cost shape | Infra + people | Per host/GB/series/user; can explode |
| Control | Full | Limited |
| Time to value | Slower | Fast |
| Lock-in | Low with OTel | Higher (agents, query languages) |
| Compliance | Data stays with you | Check residency and contracts |
Common answer: instrument with OTel to stay portable; use managed storage for the hard parts.

### Q87. Controlling observability cost
Drop unused metrics and high-cardinality labels, lower scrape intervals for noisy targets, sample traces (tail sampling), filter debug logs at the agent, tier retention, aggregate with recording rules, use Loki/object storage, set per-tenant limits, review top series/log streams monthly, and chargeback to teams. Typical savings: 30–60% without losing signal.

### Q88. Finding and fixing cardinality problems
```promql
topk(10, count by (__name__)({__name__=~".+"}))
topk(10, count by (route) (http_request_duration_seconds_bucket))
```
Use the TSDB status page (`/tsdb-status`), Grafana Mimir cardinality API, or `promtool tsdb analyze`. Fix by removing/bucketing labels in code or `metric_relabel_configs`, and set `sample_limit`/`label_limit` on scrape jobs.

### Q89. Designing SLOs for dependencies and composite services
Composite availability is roughly the product of dependency availabilities in a serial chain (99.9% × 99.9% = 99.8%). Add retries, caching, fallbacks and redundancy; define internal SLOs for dependencies; avoid depending on a component with lower reliability than your own target without a fallback.

### Q90. Event-based vs time-based SLOs
Request-based (good/total requests) fits high-traffic services. Time-based (good minutes/total minutes) suits low-traffic or batch. Choose the one that reflects user pain; low-traffic services are noisy with request ratios.

### Q91. Latency SLO design
Pick thresholds per endpoint class (read vs write); use two targets (e.g., 95% < 200 ms, 99% < 1 s); measure at the load balancer or client edge, not only in-app; exclude health checks and bot traffic.

### Q92. Debugging a latency regression with the three pillars
1. Alert: p95 up (metric). 2. Break down by route/version/region (labels). 3. Use exemplar or search traces for slow ones. 4. In traces find the slow span (DB query, downstream call). 5. Check logs for that trace id and the DB metrics (locks, connections). 6. Compare to the deploy marker; roll back or fix. 7. Add test/alert to prevent recurrence.

### Q93. Continuous profiling
Always-on, low-overhead CPU/memory/lock profiles by function (Pyroscope, Parca, Grafana Pyroscope, Datadog Profiler, Google Cloud Profiler), linked to traces. Great for "why is CPU high", finding hot code, and cost reduction. Often called the fourth pillar.

### Q94. eBPF-based observability
eBPF hooks into the Linux kernel to capture network, syscall and application-level data without code changes (Pixie, Cilium Hubble, Grafana Beyla, Parca, Odigos). Strengths: zero-instrumentation visibility and low overhead. Limits: kernel version/permissions, encrypted payload visibility, less business context.

### Q95. Multi-cluster / multi-region monitoring
Per-cluster Prometheus (agent mode) + central Mimir/Thanos for global queries; label with `cluster`, `region`; alert locally for critical paths so a central outage doesn't blind you; use federation sparingly. Consider failure domain: monitoring stack should not live only in the region it monitors.

### Q96. Alert quality framework
Measure pages per on-call shift, % actionable, time to acknowledge, false-positive rate, and flapping alerts. Each page must have: owner, user impact, runbook, and a clear first action. Delete or downgrade alerts that never led to action in 90 days.

### Q97. Chaos engineering and observability
Run controlled failures (kill pods, add latency, drop a zone) with tools such as Chaos Mesh, Litmus, Gremlin, AWS FIS; verify dashboards and alerts show it, SLO policies react, and runbooks work. Chaos tests expose observability gaps.

### Q98. Deployment observability
Annotate dashboards with deploy events, compare canary vs baseline metrics automatically (Argo Rollouts analysis, Kayenta, Flagger), tie rollback to SLO burn or error-rate thresholds, and track DORA metrics (deployment frequency, lead time, change failure rate, time to restore). See `047_CI-CD-and-DevOps.md`.

### Q99. Security observability
Audit logs (CloudTrail, Kubernetes audit, Azure Activity Log), runtime detection (Falco, Tetragon), SIEM (Splunk, Elastic Security, Sentinel, Chronicle), identity anomalies, VPC flow logs. Keep security and ops telemetry correlated but access-controlled.

### Q100. Data quality of telemetry
Check for missing service names, clock skew, broken trace context (gaps from message queues or async jobs), dropped spans, inconsistent units, and duplicate labels. Add synthetic traces and automated checks (OTel Collector `debug`/self-metrics) to validate pipelines.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. Observability strategy and maturity model *(Must-know)*
Levels: (1) reactive host monitoring, (2) service metrics and logs with alerts, (3) tracing and SLOs across teams, (4) automated detection, release verification and cost governance, (5) business-aligned reliability with error budgets driving roadmap. Plan by pain: start with golden signals and incident data, then standardize with OTel and SLOs.

### Q102. Reliability culture and error budget policy
Write an agreed policy: when budget is exhausted, feature work pauses for reliability; leadership signs it; exceptions are explicit. Run blameless postmortems; track action item completion; share SLO reports with product and business.

### Q103. Standardizing across teams without blocking them
Provide "paved road": starter libraries/OTel distros, golden dashboard and alert templates, a service scaffold, and CI checks (service has SLO, runbook, owner). Allow custom signals but require the baseline. Measure adoption and mean time to detect.

### Q104. Vendor strategy and lock-in
Use OTel for instrumentation, open formats (PromQL, OTLP, Parquet/object storage), and keep exit plans. Negotiate usage-based contracts with caps; evaluate total cost (licence, egress, engineering time). Avoid proprietary agents in application code where possible.

### Q105. Measuring the value of observability
Track MTTD, MTTA, MTTR, incident count/severity, SLO attainment, % incidents detected by alerts (vs customers), on-call load, cost per service, and developer time spent debugging. Example outcome: MTTR 90 → 25 minutes, customer-reported incidents down 60%.

### Q106. Incident management at scale
Defined severities, incident commander role, comms lead, status page, runbooks, war room tooling, post-incident review within 5 days, trend analysis across incidents, and game days. Observability should shorten each phase: detect, triage, diagnose, verify fix.

### Q107. Data governance for telemetry
Classify data (PII, secrets, business), enforce redaction at the edge, per-tenant access, retention and legal hold rules, regional storage for residency, and audit access to logs. Telemetry is production data and is often a breach path.

### Q108. Capacity planning and forecasting
Use saturation metrics and traffic growth, `predict_linear`, load tests, seasonality-aware forecasts (Grafana ML, Datadog Watchdog), and autoscaling signals (queue depth, RPS per pod). Review quarterly and before big events.

### Q109. AIOps and anomaly detection (realistic view)
Useful for: baseline anomalies, alert correlation, log clustering, change-impact hints. Risky if used as a replacement for SLOs and good alert design. Start with deterministic SLO alerts, then add ML where noise remains. Always keep explainability and human override.

### Q110. Communicating observability to leadership
Translate to business: "We detect checkout failures in 2 minutes instead of 25; error budget policy prevented two risky launches; observability spend is 6% of cloud bill after a 35% reduction; customers reported 60% fewer incidents." Show risks (blind spots, cost growth) and the roadmap.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Docker Compose: Prometheus + Alertmanager + Grafana + Loki + Tempo
```yaml
services:
  prometheus:
    image: prom/prometheus:v3.0.0
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml", "./rules:/etc/prometheus/rules"]
    ports: ["9090:9090"]
  alertmanager:
    image: prom/alertmanager:v0.27.0
    volumes: ["./alertmanager.yml:/etc/alertmanager/alertmanager.yml"]
    ports: ["9093:9093"]
  grafana:
    image: grafana/grafana:11.3.0
    ports: ["3000:3000"]
    volumes: ["./grafana/provisioning:/etc/grafana/provisioning"]
  loki:
    image: grafana/loki:3.2.0
    ports: ["3100:3100"]
  tempo:
    image: grafana/tempo:2.6.0
    command: ["-config.file=/etc/tempo.yaml"]
    volumes: ["./tempo.yaml:/etc/tempo.yaml"]
```
Pin image tags (verify current versions) and put the data sources in Grafana provisioning files.

### H2. prometheus.yml with rules and alerting
```yaml
global: { scrape_interval: 15s, evaluation_interval: 15s }
rule_files: ["/etc/prometheus/rules/*.yml"]
alerting:
  alertmanagers: [{ static_configs: [{ targets: ["alertmanager:9093"] }] }]
scrape_configs:
  - job_name: orders-api
    metrics_path: /metrics
    static_configs: [{ targets: ["orders-api:3000"] }]
  - job_name: node
    static_configs: [{ targets: ["node-exporter:9100"] }]
```

### H3. RED alert rules for orders-api
```yaml
groups:
- name: orders-api-red
  rules:
  - alert: OrdersApiHighErrorRate
    expr: |
      sum(rate(http_requests_total{job="orders-api",status=~"5.."}[5m]))
      / sum(rate(http_requests_total{job="orders-api"}[5m])) > 0.02
    for: 5m
    labels: { severity: page, team: payments }
    annotations: { summary: "orders-api 5xx above 2%", runbook_url: "https://wiki.acme.dev/rb/orders-5xx" }
  - alert: OrdersApiSlow
    expr: |
      histogram_quantile(0.95, sum by (le)
        (rate(http_request_duration_seconds_bucket{job="orders-api"}[5m]))) > 0.5
    for: 10m
    labels: { severity: ticket, team: payments }
  - alert: TargetDown
    expr: up == 0
    for: 3m
    labels: { severity: page }
```

### H4. SLO burn-rate rule pair (99.9% availability)
```yaml
- record: orders:error_ratio:rate5m
  expr: sum(rate(http_requests_total{job="orders-api",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="orders-api"}[5m]))
- record: orders:error_ratio:rate1h
  expr: sum(rate(http_requests_total{job="orders-api",status=~"5.."}[1h])) / sum(rate(http_requests_total{job="orders-api"}[1h]))
- alert: OrdersFastBurn
  expr: orders:error_ratio:rate1h > (14.4 * 0.001) and orders:error_ratio:rate5m > (14.4 * 0.001)
  labels: { severity: page }
  annotations: { summary: "Burning 2% of monthly budget per hour" }
```

### H5. OpenTelemetry in Node.js (auto-instrumentation)
```js
// tracing.js — load first: node -r ./tracing.js app.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

new NodeSDK({
  serviceName: 'orders-api',
  traceExporter: new OTLPTraceExporter({ url: 'http://otel-collector:4318/v1/traces' }),
  instrumentations: [getNodeAutoInstrumentations()],
}).start();
```
Add a manual span for business logic:
```js
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('orders');
await tracer.startActiveSpan('calculate-discount', async (span) => {
  span.setAttribute('customer.tier', 'gold');
  try { return await discount(order); }
  catch (e) { span.recordException(e); span.setStatus({ code: 2 }); throw e; }
  finally { span.end(); }
});
```

### H6. Structured logging with trace correlation (pino)
```js
const pino = require('pino');
const { trace } = require('@opentelemetry/api');
const log = pino({
  mixin() {
    const ctx = trace.getActiveSpan()?.spanContext();
    return ctx ? { trace_id: ctx.traceId, span_id: ctx.spanId } : {};
  },
  redact: ['req.headers.authorization', 'password'],
});
log.info({ event: 'order_created', order_id: 'o-981', user: 'ritesh.kumar' }, 'order created');
```

### H7. Grafana provisioning of data sources
```yaml
apiVersion: 1
datasources:
  - { name: Prometheus, type: prometheus, url: http://prometheus:9090, isDefault: true }
  - name: Loki
    type: loki
    url: http://loki:3100
    jsonData:
      derivedFields:
        - { name: trace_id, matcherRegex: '"trace_id":"(\w+)"', url: '$${__value.raw}', datasourceUid: tempo }
  - { name: Tempo, uid: tempo, type: tempo, url: http://tempo:3200 }
```

### H8. Kubernetes ServiceMonitor and PrometheusRule (Operator)
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: orders-api, labels: { release: kube-prometheus-stack } }
spec:
  selector: { matchLabels: { app: orders-api } }
  endpoints: [{ port: http, path: /metrics, interval: 15s }]
---
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata: { name: orders-api-rules, labels: { release: kube-prometheus-stack } }
spec:
  groups:
  - name: orders
    rules:
    - alert: OrdersPodCrashLooping
      expr: increase(kube_pod_container_status_restarts_total{pod=~"orders-api.*"}[15m]) > 3
      for: 5m
      labels: { severity: page }
```

### H9. Blackbox probe for an external endpoint
```yaml
scrape_configs:
  - job_name: blackbox-https
    metrics_path: /probe
    params: { module: [http_2xx] }
    static_configs: [{ targets: ["https://shop.acme.dev/health"] }]
    relabel_configs:
      - { source_labels: [__address__], target_label: __param_target }
      - { source_labels: [__param_target], target_label: instance }
      - { target_label: __address__, replacement: blackbox-exporter:9115 }
```
Alert on `probe_success == 0` and on TLS expiry `probe_ssl_earliest_cert_expiry - time() < 14*86400`.

### H10. Logs Insights / KQL style queries
```
# CloudWatch Logs Insights
fields @timestamp, level, msg, trace_id
| filter level = "error"
| stats count() as errors by bin(5m)
| sort @timestamp desc

// Azure Log Analytics (KQL)
AppRequests
| where Success == false
| summarize failures = count() by bin(TimeGenerated, 5m), Name
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Prometheus target shows `DOWN`
Check the error text on `/targets`: connection refused (wrong port, app down), timeout (scrape_timeout, firewall, slow endpoint), 401/403 (auth), TLS errors. Test with `curl` from the Prometheus pod/host. In Kubernetes check ServiceMonitor selector labels, port name and NetworkPolicy.

### D2. Alert fires but no notification arrives
Verify the alert is in Alertmanager (`/api/v2/alerts`), check routing with `amtool config routes test`, look for silences or inhibition, receiver errors (`alertmanager_notifications_failed_total`), expired webhook or API key, and rate limits.

### D3. Alert is flapping
Add `for:` duration, use a longer rate window, add hysteresis (different fire/resolve thresholds), use multi-window burn-rate logic, or fix the real instability.

### D4. Prometheus out of memory
Too many active series (cardinality), too many targets, heavy queries, or long retention in memory-mapped blocks. Check `prometheus_tsdb_head_series`, top labels, drop metrics via `metric_relabel_configs`, shard, or move to Mimir/VictoriaMetrics.

### D5. Dashboard panel shows "No data"
Wrong data source or time range, label mismatch (variable has no value), metric renamed after upgrade, scrape stopped, query returns stale series, or unit/transform hides data. Use Explore and run the raw query.

### D6. Counter graph has strange drops to zero
Counters reset on restart; `rate()` handles resets but plain graphs show drops. Use `rate()`/`increase()`. Also check `rate()` window is at least 4× scrape interval.

### D7. `histogram_quantile` returns wrong or NaN values
Missing `le` in `sum by (le)`, buckets don't cover real latency (everything in `+Inf`), aggregating summaries instead of histograms, too few samples in window, or mixed bucket schemas across versions.

### D8. Missing traces for part of a request path
Context not propagated: async queues, thread pools, unsupported HTTP client, a proxy stripping `traceparent`, or head-sampling inconsistencies. Add propagation for message headers, check Collector `debug` exporter, and verify sampler settings.

### D9. Log lines missing in Loki/Elasticsearch
Agent crash or backpressure, log rotation losing files, rate limits (`ingestion_rate_mb`), parsing errors, label limits, wrong timestamps (out-of-order rejection), disk-full on the agent buffer. Check agent metrics and server rejection reasons.

### D10. Observability bill doubled
Look for new high-cardinality labels, debug logging left on, new service with verbose traces, retention changes, or duplicate collection (two agents shipping the same logs). Use usage dashboards, top-series and top-streams reports, and add per-team limits.

### D11. High CPU alert but users are fine
Cause-based alert with no user impact. Replace with saturation measured against latency/queue growth, or move it to a ticket/dashboard.

### D12. Clock skew causing odd graphs/traces
Spans appear before their parents, logs out of order, `time()` comparisons wrong. Fix NTP/chrony on hosts and nodes; in traces rely on parent-child, not wall-clock only.

### D13. Alertmanager cluster sends duplicates
HA peers can't gossip (port 9094 blocked, wrong `--cluster.peer`), or Prometheus points to only one while another also sends. Check cluster status and ensure all Prometheus replicas send to all Alertmanagers.

### D14. Kubernetes metrics show wrong CPU
Throttling not considered (check `container_cpu_cfs_throttled_periods_total`), requests vs limits confusion, or `metrics-server` lag. Use `rate(container_cpu_usage_seconds_total[5m])` and compare to limits.

### D15. SLO dashboard says 100% but customers complain
The SLI measures the wrong place (inside service, not at the edge), excludes failures (timeouts, load-balancer 5xx), or counts health checks. Move measurement to the load balancer/client and add client-side/RUM data.

---

# 🧩 Part 8: Tricky Questions

### T1. Is monitoring the same as observability?
No. Monitoring watches known signals; observability lets you ask new questions of rich telemetry.

### T2. Does Prometheus push data?
By default no, it pulls. Remote write and Pushgateway are special cases.

### T3. Is average latency a good SLI?
No. Averages hide tail latency. Use percentiles or the share of requests under a threshold.

### T4. Can you average percentiles across instances?
No. Aggregate histogram buckets first, then compute the quantile.

### T5. Is 100% availability a good SLO?
No. It is unreachable and leaves no error budget; it blocks all change.

### T6. Does more monitoring always mean better reliability?
No. Noise, cost and alert fatigue can reduce reliability. Quality over quantity.

### T7. Is a high CPU alert always useful?
Not by itself. Page on user impact; watch CPU on dashboards.

### T8. Are logs, metrics and traces enough?
They are the base, but profiles, events, RUM, and business metrics are also important.

### T9. Is sampling traces "losing data"?
You lose some detail but keep what matters with tail sampling (errors, slow). Without sampling, cost and noise often make the system unusable.

### T10. Does Prometheus HA mean two Prometheus give a clustered database?
No. They are independent replicas; use Thanos/Mimir for a shared global view.

### T11. Can I put `user_id` as a metric label?
Not at scale; use logs/traces for per-user detail.

### T12. Is OpenTelemetry a backend?
No. It is a standard/instrumentation and collection layer; you still need storage and UI.

### T13. Does a green dashboard prove the system is healthy?
No. It proves the measured signals are healthy; check coverage and synthetic user paths.

### T14. Is the SLA the same as the SLO?
No. SLA is a customer contract; SLO is an internal target and usually stricter.

### T15. Should you alert on every error log?
No. Alert on rates and impact; individual errors go to logs and error trackers.

### T16. Does Loki index log content?
No, only labels (plus optional structured metadata); line content is scanned at query time.

### T17. Can `rate()` be used on gauges?
It is meant for counters; for gauges use `deriv()` or `delta()`.

### T18. If you have traces, do you still need metrics?
Yes. Metrics are cheap, aggregated and best for alerting and long-term trends.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Three pillars?** Metrics, logs, traces.
- **Golden signals?** Latency, traffic, errors, saturation.
- **RED?** Rate, errors, duration (services).
- **USE?** Utilization, saturation, errors (resources).
- **Metrics DB?** Prometheus.
- **Query language?** PromQL.
- **Pull or push?** Prometheus pulls.
- **Alert routing?** Alertmanager.
- **Dashboards?** Grafana.
- **Log DB (label index)?** Loki.
- **Full-text logs?** Elasticsearch/OpenSearch.
- **Trace backends?** Tempo, Jaeger, Zipkin.
- **Standard for telemetry?** OpenTelemetry (OTLP).
- **Trace header?** W3C `traceparent`.
- **Counter function?** `rate()`.
- **Percentile from histogram?** `histogram_quantile`.
- **Error budget?** 100% − SLO.
- **99.9% per 30 days?** About 43 minutes.
- **Burn rate 14.4 pairs with?** 1 h and 5 min windows.
- **Cardinality killers?** user_id, request_id, raw URL.
- **Long-term Prometheus?** Thanos, Mimir, VictoriaMetrics.
- **Always-firing alert?** Watchdog / dead man's switch.
- **Host metrics exporter?** node_exporter.
- **K8s object metrics?** kube-state-metrics.
- **Probe from outside?** blackbox_exporter / synthetic monitoring.
- **Fourth pillar?** Continuous profiling.
- **Kernel-level, no code change?** eBPF.
- **AWS metrics/logs?** CloudWatch. **Azure?** Azure Monitor. **GCP?** Cloud Monitoring.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an observability platform you built.
STAR: "Our 60 services had three different monitoring tools. I led a move to OpenTelemetry with a shared SDK wrapper, Mimir/Loki/Tempo on object storage, Grafana dashboards generated from a template, and SLO burn-rate alerts via Sloth. Detection time fell from 18 to 3 minutes, and tool cost dropped 35%."

### P2. Describe an incident you diagnosed with traces.
"Checkout p99 jumped to 6 seconds after a release. An exemplar on the histogram opened a trace showing a new N+1 query in the pricing service. We rolled back in 7 minutes, fixed the query with a batch call, and added a trace-based latency test in CI."

### P3. How did you reduce alert noise?
"We audited 420 alerts: 70% never led to action. We deleted or moved them to tickets, switched to symptom and SLO alerts, added grouping and inhibition, and required runbooks. Pages per on-call week fell from 55 to 9."

### P4. How did you control telemetry cost?
"We found one label with 2 million values, fixed it in code, dropped debug logs at the agent, introduced tail sampling (keep errors and slow traces), and set per-team limits. Monthly cost fell 40%."

### P5. How do you introduce SLOs to a team?
"Start with one critical journey, pick an SLI from data they already have, set a modest SLO from history, show the error budget on a dashboard, and agree a simple policy. Expand after the first win."

### P6. Datadog vs open-source stack?
"Depends on team size and constraints. A small team without platform engineers gets value fastest with SaaS. At scale, cost and control push toward OSS, but I would keep OpenTelemetry instrumentation so I can switch."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** monitoring vs observability, pillars, telemetry, SLI/SLO/SLA, error budgets, golden signals, RED, USE.
- **Metrics:** Prometheus model, metric types, PromQL, recording/alerting rules, exporters, histograms, exemplars, cardinality, long-term storage.
- **Logs:** structured logging, agents, Loki, ELK/EFK/OpenSearch, parsing, retention, redaction.
- **Traces:** spans, context propagation, sampling, Jaeger, Tempo, service graphs.
- **OpenTelemetry:** API, SDK, OTLP, Collector, semantic conventions, auto/manual instrumentation.
- **Alerting:** Alertmanager, routing, silences, inhibition, burn-rate alerts, runbooks, on-call.
- **Visualization:** Grafana, variables, dashboards as code, annotations.
- **Platforms:** Kubernetes monitoring, cloud monitoring (CloudWatch, Azure Monitor, Cloud Monitoring), SaaS APM.
- **User view:** synthetic checks, RUM, Core Web Vitals, error tracking.
- **Operations:** incident response, postmortems, chaos testing, capacity planning, cost control, governance.
- **Advanced:** profiling, eBPF, AIOps, multi-cluster design.

## Mixed topics
- Monitoring + Docker/Kubernetes (`045_Docker.md`, `046_Kubernetes.md`): container and cluster signals, probes.
- Monitoring + CI/CD (`047_CI-CD-and-DevOps.md`): deploy markers, canary analysis, DORA metrics.
- Monitoring + cloud (`048_AWS.md`, `049_Azure.md`, `050_GCP.md`): native services and cost.
- Monitoring + IaC (`051_Terraform-and-IaC.md`): dashboards, alerts and agents as code.
- Monitoring + system design (`../09_System_Design/053_System-Design.md`): SLOs, capacity, failure modes.
- Monitoring + databases/caches (`../04_Database/`): replication lag, slow queries, hit ratios.
- Monitoring + security (`../03_Backend/036_Authentication-and-Security.md`): audit logs, SIEM.
- Monitoring + performance (`../01_Website/007_Web-Performance-and-Browser-Internals.md`): RUM, Core Web Vitals.

---

# 🔬 Part 12: Observability Internals

### I1. Prometheus TSDB
Incoming samples go to the **head block** in memory and to a **write-ahead log (WAL)** for crash recovery. Every 2 hours the head is written as an immutable **block** (chunks, index, tombstones, meta). Blocks are compacted into larger ones. Queries read head and blocks; the inverted index maps label pairs to series ids.

### I2. Scrape and staleness
Each target is scraped at an interval with a timeout. When a series disappears, Prometheus writes a **staleness marker** so graphs stop quickly instead of showing the last value for 5 minutes. `up` is set per scrape (1 or 0).

### I3. How `rate()` works
Takes samples in the window, handles counter resets, and extrapolates to the window edges to compute a per-second rate. Needs at least two samples in the window, so the window should be ≥ 4× scrape interval.

### I4. Histogram quantile estimation
`histogram_quantile` uses cumulative bucket counts and **linear interpolation** inside the bucket where the quantile falls. Accuracy depends on bucket width; values above the highest finite bucket are reported as that bucket's upper bound.

### I5. Alert lifecycle
Rule evaluates → condition true → **pending** for the `for:` duration → **firing** → sent to Alertmanager (resent each evaluation) → Alertmanager groups, waits (`group_wait`), notifies, repeats (`repeat_interval`) → condition false → **resolved**.

### I6. Distributed trace data model
Spans: `trace_id`, `span_id`, `parent_span_id`, name, kind (client/server/producer/consumer/internal), start/end, attributes, events, links, status. Export in OTLP protobuf over gRPC/HTTP. Links connect causally related traces (e.g., batch consumers).

### I7. OTel Collector internals
Pipelines of components running in one process. Receivers decode incoming data into internal pdata structures; processors transform in order; exporters encode and send with queues and retry. The `memory_limiter` should be first in the processor list to protect the process.

### I8. Loki architecture
Distributor → ingester (in-memory chunks, WAL) → object store (chunks + index, TSDB index). Queriers read from ingesters and storage; query-frontend splits and caches queries; compactor merges and applies retention. Label sets define **streams**.

### I9. Elasticsearch log path
Documents are routed to shards by id, analyzed into inverted indexes, held in segments, merged in the background, and made searchable after a refresh (default 1 s). ILM moves indices through hot/warm/cold/delete phases.

---

# 📊 Part 13: Reference Tables

### Metric types
| Type | Example | Use | Function |
|---|---|---|---|
| Counter | `http_requests_total` | Events count | `rate`, `increase` |
| Gauge | `memory_bytes` | Current value | `avg_over_time`, `deriv` |
| Histogram | `request_duration_seconds_bucket` | Distribution | `histogram_quantile` |
| Summary | `rpc_duration_seconds{quantile}` | Client quantiles | Read directly |

### Downtime by availability
| SLO | Per 30 days | Per year |
|---|---|---|
| 99% | 7.2 h | 3.65 days |
| 99.9% | 43.2 min | 8.76 h |
| 99.95% | 21.6 min | 4.38 h |
| 99.99% | 4.32 min | 52.6 min |
| 99.999% | 26 s | 5.26 min |

### Tool selection
| Need | Open source | Managed / SaaS |
|---|---|---|
| Metrics | Prometheus, Mimir, VictoriaMetrics | CloudWatch, Datadog, Grafana Cloud, AMP |
| Logs | Loki, Elasticsearch, OpenSearch | CloudWatch Logs, Datadog, Splunk |
| Traces | Tempo, Jaeger | X-Ray, Datadog, Honeycomb |
| Dashboards | Grafana, Kibana | Datadog, New Relic |
| Alert paging | Alertmanager + OnCall | PagerDuty, Opsgenie |
| Profiling | Pyroscope, Parca | Datadog, Google Cloud Profiler |
| Errors/RUM | Sentry (self-host) | Sentry, Datadog RUM |

### Alert severity guide
| Severity | Meaning | Action |
|---|---|---|
| Page | User impact now or soon | Wake a human |
| Ticket | Needs fix this week | Create ticket |
| Info | Trend or FYI | Dashboard/log only |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| Prometheus 3.0 | Released late 2024; new UI, OTLP ingestion, native histograms improvements |
| Grafana Mimir | Successor of Cortex (Grafana Labs) |
| Jaeger v2 | Built on the OpenTelemetry Collector |
| OTel logs | API/SDK stability varies by language |
| OTel HTTP semantic conventions | Renamed attributes in recent stable versions |
| Grafana Agent | Replaced by Grafana Alloy |
| Opsgenie | Atlassian announced end-of-sale/retirement plans; verify before choosing |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
`rate(http_requests_total[1m])` with a 60 s scrape interval.
**Result:** window has about one sample, so the result is empty or unreliable; use a window of at least 4× the interval.

### O2.
Counter goes 100 → 5 after an app restart; query `rate()`.
**Result:** Prometheus detects the reset and treats it as a restart; the rate stays correct.

### O3.
Alert rule has `for: 10m`; condition true for 6 minutes then false.
**Result:** stays pending, never fires.

### O4.
Two Alertmanager routes match; first has `continue: false`.
**Result:** only the first matching route receives the alert.

### O5.
Metric `requests{user_id=...}` with 1 million users.
**Result:** 1 million series per other label combination; memory and cost explode.

### O6.
SLO 99.9% over 30 days; service fully down for 50 minutes.
**Result:** budget (43.2 min) is exceeded; SLO is missed.

### O7.
Burn rate = 14.4 for 1 hour on a 99.9%/30-day SLO.
**Result:** uses 14.4 × 1/720 = 2% of the monthly budget in that hour.

### O8.
`histogram_quantile(0.99, rate(x_bucket[5m]))` without `sum by (le)` over many instances.
**Result:** returns one value per series (per instance), not a service-wide p99.

### O9.
Head sampling at 10% and a rare error occurs.
**Result:** about 90% chance its trace is dropped; use tail sampling to keep errors.

### O10.
Service sends `traceparent` header, but a proxy removes it.
**Result:** downstream spans start a new trace; the trace is broken.

### O11.
Loki label `request_id` is added.
**Result:** a huge number of streams, slow ingestion and queries; keep it in the log line instead.

### O12.
`up == 0` alert and the Prometheus server itself crashes.
**Result:** no alert fires; you need an external watchdog/heartbeat.

---

# ✅ Part 15: MCQs

**1. Which is NOT one of the three classic pillars?**
A) Metrics  B) Logs  C) Traces  D) Invoices
**Answer: D**

**2. Prometheus gets metrics mainly by:**
A) Pushing from apps  B) Scraping HTTP endpoints  C) Reading emails  D) SNMP only
**Answer: B**

**3. A 99.9% SLO over 30 days allows roughly:**
A) 4 minutes  B) 43 minutes  C) 7 hours  D) 3 days
**Answer: B**

**4. Which function should you use on a counter?**
A) `avg()`  B) `rate()`  C) `delta()` only  D) `sort()`
**Answer: B**

**5. Which component handles routing and silencing of alerts?**
A) Grafana  B) Alertmanager  C) node_exporter  D) Tempo
**Answer: B**

**6. High-cardinality labels cause:**
A) Faster queries  B) Memory and cost problems  C) Fewer series  D) Better accuracy
**Answer: B**

**7. The W3C trace propagation header is:**
A) `x-request`  B) `traceparent`  C) `cookie`  D) `etag`
**Answer: B**

**8. Which tool stores logs by indexing labels only?**
A) Elasticsearch  B) Loki  C) MySQL  D) Redis
**Answer: B**

**9. OTLP is:**
A) A database  B) The OpenTelemetry protocol  C) A dashboard  D) A load balancer
**Answer: B**

**10. The Four Golden Signals are latency, traffic, errors and:**
A) Saturation  B) Security  C) Storage  D) Scaling
**Answer: A**

**11. Which sampling method can keep all error traces?**
A) Head sampling  B) Tail sampling  C) No sampling only  D) Random drop
**Answer: B**

**12. Error budget equals:**
A) SLO × 2  B) 100% − SLO  C) SLA + SLO  D) Latency / traffic
**Answer: B**

**13. Best alert basis for paging:**
A) CPU > 70%  B) User-facing symptom or SLO burn  C) Any log line  D) Disk name
**Answer: B**

**14. Which tool gives long-term, scalable storage for Prometheus data?**
A) Mimir/Thanos  B) Excel  C) Nginx  D) Docker
**Answer: A**

**15. Dead man's switch alert is one that:**
A) Never fires  B) Always fires to prove alerting works  C) Kills servers  D) Pages twice
**Answer: B**

**16. RED stands for:**
A) Rate, Errors, Duration  B) Read, Execute, Delete  C) Retry, Error, Drop  D) Rate, Events, Disk
**Answer: A**

**17. Which signals link a latency spike to a specific trace?**
A) Exemplars  B) Cookies  C) Snapshots  D) Cron jobs
**Answer: A**

**18. The Collector pipeline order is:**
A) exporters → processors → receivers  B) receivers → processors → exporters  C) processors → exporters only  D) none
**Answer: B**

**19. A Kubernetes readiness probe failing means:**
A) The pod is restarted  B) The pod is removed from service endpoints  C) The node is deleted  D) Logs are lost
**Answer: B**

**20. Which is a continuous profiling tool?**
A) Pyroscope  B) Postman  C) Nginx  D) Vault
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **Alerting on causes** (CPU, memory) instead of user-facing symptoms.
2. **No runbooks** or owners on alerts.
3. **High-cardinality labels** (user ids, raw URLs).
4. **Averages instead of percentiles** for latency.
5. **Averaging percentiles** across instances.
6. **Unstructured logs** without trace/request ids.
7. **Logging secrets and personal data.**
8. **Debug logging left on in production.**
9. **No `for:` duration**, causing flapping alerts.
10. **`rate()` window too small** for the scrape interval.
11. **100% SLO targets** or SLOs nobody uses.
12. **Measuring SLIs inside the service only** and missing edge failures.
13. **No tracing context propagation** through queues and async jobs.
14. **Head sampling only** and losing the errors you need.
15. **No meta-monitoring** or watchdog for the alerting pipeline.
16. **Single Prometheus with no HA or long-term plan.**
17. **Dashboards that are never reviewed**, 60 panels and no questions answered.
18. **Hand-made dashboards and alerts** not stored in Git.
19. **Ignoring cost** until the vendor invoice arrives.
20. **Vendor-specific instrumentation everywhere** (hard lock-in).
21. **Treating observability as a tooling project** only, without SLO and incident culture.
22. **No postmortem follow-through**, so the same incident repeats.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You design from **user journeys and SLOs**, not from tool lists.
- You alert on **symptoms and burn rates**, with owners and runbooks.
- You understand **cardinality, histograms and sampling** trade-offs in depth.
- You standardize on **OpenTelemetry** and keep backends replaceable.
- You **correlate** metrics, logs, traces and profiles with shared ids and exemplars.
- You monitor **the monitoring** (watchdog, remote write lag, rule failures).
- You treat **telemetry cost and security** (PII, access, retention) as first-class.
- You connect observability to **deploys, canaries, DORA metrics and incident reviews**.
- You tell stories with numbers: MTTD/MTTR, alert reduction, cost saved.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core mappings
```
Pillars: metrics • logs • traces (+ profiles, events, RUM) • Signals: latency, traffic, errors, saturation
Methods: RED (services), USE (resources) • SLI → SLO → error budget → burn-rate alerts
Stack: OTel SDK → Collector → Mimir/Prometheus (metrics), Loki (logs), Tempo/Jaeger (traces) → Grafana
Alerts: Prometheus rules → Alertmanager (group, route, silence, inhibit) → PagerDuty/Slack
```

### PromQL quick list
```promql
rate(x_total[5m])                                   # per-second rate
sum by (job)(rate(x_total[5m]))                     # aggregate
histogram_quantile(0.95, sum by (le)(rate(x_bucket[5m])))
increase(x_total[1h])                               # growth
predict_linear(node_filesystem_avail_bytes[6h], 86400) < 0
topk(5, sum by (route)(rate(x_total[5m])))
```

### Alert checklist
Symptom or SLO based • `for:` set • severity and owner labels • runbook link • grouped and routed • tested • reviewed monthly.

### Cost checklist
Drop unused metrics • cap labels • sample traces (tail) • filter debug logs • tier retention • recording rules • per-team limits and showback.

### Interview strategy
1. Clarify the system, users and what "bad" looks like.
2. Define SLIs/SLOs first, then signals.
3. Pick instrumentation (OTel) and storage with justification.
4. Design alerting (burn rate, routing, runbooks).
5. Cover scale, HA, cardinality and cost.
6. Cover incident flow and learning.
7. Close with measured outcomes.

### Final checklist before the interview
- [ ] Explain monitoring vs observability, pillars, golden signals, RED/USE.
- [ ] Explain SLI/SLO/SLA, error budgets and burn-rate alerting with numbers.
- [ ] Write PromQL for rate, error ratio and p95; explain histograms.
- [ ] Explain Prometheus architecture, HA, remote write and long-term storage.
- [ ] Explain OpenTelemetry (SDK, OTLP, Collector) and trace propagation/sampling.
- [ ] Compare Loki vs Elasticsearch and metrics-backend options.
- [ ] Design alert routing, silences, inhibition and a watchdog.
- [ ] Control cardinality and telemetry cost.
- [ ] Debug missing data, flapping alerts, broken traces and OOM.
- [ ] Prepare a platform story, an incident story and a cost story with numbers.
