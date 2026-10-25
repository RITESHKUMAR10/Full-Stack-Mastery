# Kubernetes Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Kubernetes 1.29–1.33**, **containerd** runtime, **kubectl**, **Helm 3**, **Kustomize**, **Gateway API** (GA core resources), **Argo CD / Flux** (GitOps), **KEDA**, **Karpenter / Cluster Autoscaler**, **Cilium / Calico** CNIs, and managed services (**EKS, AKS, GKE**). Features graduate and deprecate quickly (PodSecurityPolicy removed in 1.25, Pod Security Admission, sidecar containers GA in 1.33, in-place pod resize progressing): anything marked "verify" should be checked in the official docs (kubernetes.io/docs) for your cluster version. Examples use the sample name **Ritesh Kumar**.
> This file covers architecture (control plane, nodes), core objects (Pod, ReplicaSet, Deployment, StatefulSet, DaemonSet, Job/CronJob), Services, Ingress/Gateway API, DNS, ConfigMaps/Secrets, storage (PV/PVC/StorageClass/CSI), scheduling (requests/limits, affinity, taints, topology spread), autoscaling (HPA/VPA/KEDA/Cluster Autoscaler), probes and rollouts, RBAC and security (Pod Security, NetworkPolicy, admission, secrets), Helm/Kustomize/GitOps, observability, operators/CRDs, networking internals, upgrades, multi-tenancy, cost and production practice. Related topics: containers in `045_Docker.md`, CI/CD in `047_CI-CD-and-DevOps.md`, monitoring in `052_Monitoring-and-Observability.md`, IaC in `051_Terraform-and-IaC.md`, microservices in `../03_Backend/039_Microservices.md`.

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
- [Part 12: Kubernetes Internals](#-part-12-kubernetes-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Kubernetes? *(Must-know)*
An open-source **container orchestration platform** (from Google's Borg, CNCF) that automates deployment, scaling, networking, self-healing and rollout of containerized applications across a cluster of machines. You declare the **desired state** in YAML; controllers continuously reconcile actual state to match.

### Q2. Why Kubernetes over plain Docker?
Docker runs containers on one host. Kubernetes adds multi-node scheduling, self-healing (restart/replace), horizontal scaling, rolling updates and rollbacks, service discovery and load balancing, config/secret management, storage orchestration and a declarative API. See `045_Docker.md`.

### Q3. Architecture overview *(Must-know)*
**Control plane:** `kube-apiserver` (REST API, the only component talking to etcd), `etcd` (consistent key-value store of cluster state), `kube-scheduler` (assigns Pods to nodes), `kube-controller-manager` (controllers: Deployment, Node, Job...), `cloud-controller-manager`. **Worker nodes:** `kubelet` (runs Pods via CRI), `kube-proxy` (Service networking), container runtime (containerd/CRI-O), CNI plugin.

### Q4. What is a Pod? *(Must-know)*
The smallest deployable unit: one or more containers sharing a network namespace (one IP, localhost), storage volumes and lifecycle. Usually one main container plus optional sidecars/init containers. Pods are ephemeral; don't create bare Pods in production, use controllers.

### Q5. Core workload objects
| Object | Purpose |
|---|---|
| ReplicaSet | Keeps N identical Pods running |
| **Deployment** | Declarative updates, rolling updates, rollback for stateless apps |
| **StatefulSet** | Stable identity, ordered rollout, persistent storage per Pod |
| **DaemonSet** | One Pod per node (log agents, CNI) |
| **Job / CronJob** | Run-to-completion / scheduled tasks |

### Q6. Essential kubectl commands
```bash
kubectl get pods -A -o wide
kubectl describe pod web-7d9f -n prod
kubectl logs -f deploy/web -c app --since=10m
kubectl exec -it web-7d9f -- sh
kubectl apply -f deploy.yaml
kubectl rollout status deploy/web ; kubectl rollout undo deploy/web
kubectl scale deploy/web --replicas=5
kubectl port-forward svc/web 8080:80
kubectl get events --sort-by=.lastTimestamp
kubectl config get-contexts ; kubectl config use-context prod
```

### Q7. A Deployment manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: web, labels: { app: web } }
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }
  strategy: { type: RollingUpdate, rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers:
        - name: app
          image: ghcr.io/ritesh/web:1.4.2
          ports: [{ containerPort: 3000 }]
          resources: { requests: { cpu: 100m, memory: 128Mi }, limits: { memory: 256Mi } }
          readinessProbe: { httpGet: { path: /readyz, port: 3000 }, periodSeconds: 5 }
          livenessProbe: { httpGet: { path: /healthz, port: 3000 }, initialDelaySeconds: 10 }
```

### Q8. Labels, selectors and annotations
Labels are key-value tags used by selectors (Services, Deployments, NetworkPolicies, kubectl `-l`). Annotations hold non-identifying metadata (tool config, descriptions). The `selector` of a Deployment is immutable and must match the template labels.

### Q9. Namespaces
Virtual partitions for names, quotas, RBAC and policies (`default`, `kube-system`, `kube-public`). Not a security boundary alone; combine with NetworkPolicy, RBAC, quotas, Pod Security. Some resources are cluster-scoped (Nodes, PVs, Namespaces).

### Q10. Services *(Must-know)*
Stable virtual IP/DNS in front of a changing set of Pods selected by labels.
| Type | Exposure |
|---|---|
| ClusterIP (default) | Internal only |
| NodePort | Port on every node (30000–32767) |
| LoadBalancer | Cloud load balancer |
| ExternalName | DNS CNAME to external host |
| Headless (`clusterIP: None`) | No VIP; DNS returns Pod IPs (StatefulSets) |
```yaml
apiVersion: v1
kind: Service
metadata: { name: web }
spec: { selector: { app: web }, ports: [{ port: 80, targetPort: 3000 }] }
```

### Q11. Service discovery and DNS
CoreDNS resolves `web.prod.svc.cluster.local` (also `web.prod`, or `web` within the namespace). Env vars for Services are injected at Pod start (less used). Pods get `resolv.conf` with search domains and `ndots:5`.

### Q12. Ingress and Gateway API
**Ingress** routes external HTTP(S) to Services via an ingress controller (NGINX, Traefik, HAProxy, cloud ALB). **Gateway API** (GatewayClass, Gateway, HTTPRoute, GRPCRoute) is the more expressive, role-oriented successor.
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: web, annotations: { cert-manager.io/cluster-issuer: letsencrypt } }
spec:
  ingressClassName: nginx
  tls: [{ hosts: [app.example.com], secretName: web-tls }]
  rules: [{ host: app.example.com, http: { paths: [{ path: /, pathType: Prefix, backend: { service: { name: web, port: { number: 80 } } } }] } }]
```

### Q13. ConfigMaps and Secrets
ConfigMaps store non-sensitive config; Secrets store sensitive data (base64-encoded, **not encrypted by default**: enable encryption at rest, use KMS, restrict RBAC, prefer external secret stores). Consume as env vars, `envFrom`, or mounted files (mounted files update; env vars don't).
```yaml
env: [{ name: DB_PASSWORD, valueFrom: { secretKeyRef: { name: db, key: password } } }]
volumeMounts: [{ name: cfg, mountPath: /etc/app }]
```

### Q14. Probes *(Must-know)*
- **Liveness**: restart the container if failing (deadlocks).
- **Readiness**: remove from Service endpoints until ready.
- **Startup**: protects slow-starting apps; disables the other probes until it succeeds.
Types: `httpGet`, `tcpSocket`, `exec`, `grpc`. Misconfigured liveness probes cause restart loops; don't check external dependencies in liveness.

### Q15. Resource requests and limits *(Must-know)*
Requests = scheduler's guaranteed minimum; limits = cap. CPU is compressible (throttled); memory is not (OOMKilled). QoS classes: **Guaranteed** (requests = limits), **Burstable**, **BestEffort** (evicted first). Set memory limits; be careful with CPU limits (throttling) and prefer sensible requests.

### Q16. Rolling updates and rollbacks
Deployments create a new ReplicaSet and scale it up while scaling the old down per `maxSurge`/`maxUnavailable`; `kubectl rollout undo` reverts. `minReadySeconds`, `progressDeadlineSeconds` and readiness probes govern safety. `revisionHistoryLimit` keeps old ReplicaSets.

### Q17. Jobs and CronJobs
```yaml
apiVersion: batch/v1
kind: CronJob
metadata: { name: report }
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  jobTemplate: { spec: { backoffLimit: 3, ttlSecondsAfterFinished: 3600, template: { spec: { restartPolicy: OnFailure, containers: [{ name: r, image: report:1.0 }] } } } }
```
Make jobs idempotent; set `activeDeadlineSeconds`.

### Q18. Volumes: emptyDir, hostPath, PV/PVC
`emptyDir` (Pod-lifetime scratch), `hostPath` (node path; avoid), **PersistentVolume** (cluster storage resource) claimed by a **PersistentVolumeClaim**; **StorageClass** enables dynamic provisioning via CSI drivers. Access modes: RWO, ROX, RWX, RWOP.

### Q19. StatefulSet basics
Stable network IDs (`db-0`, `db-1`), ordered startup/termination, `volumeClaimTemplates` for per-Pod PVCs, headless Service for DNS. Use operators for databases (HA, backups) rather than hand-rolled StatefulSets.

### Q20. DaemonSets
Run a Pod per (selected) node: log collectors, node exporters, CNI/CSI agents. Use tolerations to run on tainted nodes and `updateStrategy` for rollouts.

### Q21. Init containers and sidecars
Init containers run to completion before app containers (migrations, waiting for dependencies, config setup). Sidecars run alongside (proxies, log shippers); native sidecar containers (init containers with `restartPolicy: Always`, GA in 1.33) have proper lifecycle ordering.

### Q22. Taints, tolerations, node selectors, affinity
Taints repel Pods from nodes unless tolerated; `nodeSelector`/node affinity attract Pods to nodes; pod (anti-)affinity co-locates or spreads Pods. **Topology spread constraints** distribute replicas across zones/nodes.
```yaml
topologySpreadConstraints: [{ maxSkew: 1, topologyKey: topology.kubernetes.io/zone, whenUnsatisfiable: DoNotSchedule, labelSelector: { matchLabels: { app: web } } }]
```

### Q23. Autoscaling overview
**HPA** scales replicas on CPU/memory/custom metrics; **VPA** adjusts requests; **Cluster Autoscaler/Karpenter** adds/removes nodes; **KEDA** scales on events (queue depth, Kafka lag). HPA needs resource requests and metrics-server.
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: web }
spec: { scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: web }, minReplicas: 3, maxReplicas: 20, metrics: [{ type: Resource, resource: { name: cpu, target: { type: Utilization, averageUtilization: 65 } } }] }
```

### Q24. RBAC basics *(Must-know)*
Role/ClusterRole (verbs on resources) bound by RoleBinding/ClusterRoleBinding to users, groups or ServiceAccounts. Principle of least privilege; avoid `cluster-admin`; each workload uses its own ServiceAccount; disable token automount when unused.

### Q25. Helm basics
Package manager: charts (templates + `values.yaml`) produce manifests; releases are tracked in-cluster. `helm install/upgrade --install/rollback/template/lint`. Alternatives: Kustomize (overlays/patches without templating), plain YAML with GitOps.

### Q26. Local clusters
kind, minikube, k3d/k3s, Docker Desktop Kubernetes, Rancher Desktop. Good for dev and CI; production uses managed (EKS/AKS/GKE) or hardened self-managed (kubeadm, Cluster API).

### Q27. Managed vs self-managed
Managed control planes (EKS, AKS, GKE, DOKS) handle etcd/API availability and upgrades; you manage nodes (or use Autopilot/Fargate-style). Self-managed gives control but significant operational burden.

### Q28. Common object lifecycle states
Pod phases: Pending, Running, Succeeded, Failed, Unknown. Container states: Waiting (ImagePullBackOff, CrashLoopBackOff), Running, Terminated. Node conditions: Ready, MemoryPressure, DiskPressure, PIDPressure.

### Q29. Graceful termination
On delete: Pod marked Terminating → removed from endpoints → `preStop` hook → `SIGTERM` → wait `terminationGracePeriodSeconds` (30 s) → `SIGKILL`. Apps must handle SIGTERM; add a short `preStop` sleep so load balancers drain.

### Q30. YAML hygiene
Use `kubectl apply --server-side`, `kubectl diff`, validate with `kubeconform`/`kubectl --dry-run=server`, lint with kube-linter/Polaris, and never keep secrets in git unencrypted (use SOPS/Sealed Secrets/External Secrets).

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. The control loop and reconciliation *(Must-know)*
Controllers watch objects via the API server (informers/watch), compare `spec` (desired) to `status` (observed), and act to converge. Level-triggered design makes the system self-healing and idempotent. Everything (Deployment→ReplicaSet→Pod) is a chain of controllers.

### Q32. What happens on `kubectl apply -f deploy.yaml`? *(Must-know)*
1. kubectl sends the object to the API server (authn → authz/RBAC → admission webhooks/validation → persisted in etcd).
2. Deployment controller creates a ReplicaSet; ReplicaSet controller creates Pods (Pending).
3. Scheduler picks nodes (filter + score) and binds Pods.
4. Kubelet on the node pulls images (via CRI), sets up volumes/network (CNI), starts containers, runs probes.
5. Endpoints/EndpointSlices update when Pods are Ready; kube-proxy/CNI programs routing; Service becomes reachable.

### Q33. Scheduling in depth
Filters (resources fit, taints, affinity, volume topology) then scores (spreading, image locality, balanced allocation). Priorities and preemption (`PriorityClass`) let important Pods evict lower ones. Custom schedulers and scheduling profiles exist. Pending Pods usually mean unsatisfied requests, taints, affinity or PVC binding.

### Q34. Requests/limits sizing
Start from observed usage (p95) plus headroom; use VPA recommendations; set memory limit ≥ request for stability; avoid very low CPU requests (starvation) and rarely set CPU limits for latency-sensitive services (throttling) unless needed for fairness. Use LimitRange/ResourceQuota for guardrails.

### Q35. ResourceQuota and LimitRange
Quotas cap aggregate resources/object counts per namespace; LimitRange sets default/min/max requests/limits per container. Combined they prevent noisy neighbours and unbounded deployments.

### Q36. PodDisruptionBudget
Limits voluntary disruptions (drains, upgrades): `minAvailable: 2` or `maxUnavailable: 1`. Protects availability during node maintenance; misconfigured PDBs (e.g., 100% available with 1 replica) block drains.

### Q37. Node maintenance
`kubectl cordon` (unschedulable), `kubectl drain --ignore-daemonsets --delete-emptydir-data` (evicts respecting PDBs), upgrade/patch, `uncordon`. Use surge node pools and automation (managed node group rolling updates).

### Q38. Networking model *(Must-know)*
Every Pod gets its own IP; Pods can reach each other without NAT; nodes can reach Pods; Services provide stable virtual IPs. Implemented by a **CNI plugin** (Calico, Cilium, Flannel, AWS VPC CNI). Cluster DNS via CoreDNS; kube-proxy (iptables/IPVS) or eBPF dataplanes implement Service load balancing.

### Q39. NetworkPolicy
Default-allow within a cluster; NetworkPolicies (enforced by the CNI) restrict ingress/egress by Pod/namespace selectors and CIDRs. Start with default-deny, then allow required flows (DNS, ingress controller, databases).
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny }
spec: { podSelector: {}, policyTypes: [Ingress, Egress] }
```

### Q40. Service types and traffic flow
Client → LB → NodePort → kube-proxy DNAT → Pod. `externalTrafficPolicy: Local` preserves client IP and avoids extra hops (needs health checks). Session affinity `ClientIP` for stickiness. `Endpoints/EndpointSlices` track ready Pod IPs.

### Q41. Ingress controllers and TLS
Controllers (NGINX, Traefik, Envoy-based like Contour/Emissary, cloud ALB/AGIC/GCE) implement Ingress/Gateway. **cert-manager** automates certificates (Let's Encrypt/ACME, internal CAs). Configure timeouts, body size, rate limits, WAF, and HTTP→HTTPS redirects via annotations/policies.

### Q42. Storage in depth
CSI drivers provision volumes (EBS, Azure Disk, GCE PD, Ceph, Longhorn). `volumeBindingMode: WaitForFirstConsumer` ensures zone-aware provisioning. `reclaimPolicy` Retain/Delete, volume expansion, snapshots (VolumeSnapshot), and backup via Velero/Kasten. RWX needs NFS/EFS/Azure Files/CephFS.

### Q43. StatefulSet operations
Ordered scaling and rolling updates (`partition` for canaries), PVCs persist after Pod deletion, headless Service gives per-Pod DNS (`db-0.db.prod.svc`). Beware node/zone failures with RWO volumes; use operators (CloudNativePG, Strimzi, Percona) for production databases.

### Q44. ConfigMap/Secret update behaviour
Mounted files update eventually (not for `subPath`); env vars require Pod restart. Trigger rollouts on config change by hashing config into a Pod annotation (Helm `checksum/config`) or using Reloader. Mark immutable ConfigMaps/Secrets to reduce API load.

### Q45. Secrets management patterns
Enable etcd encryption at rest (KMS provider), restrict `get/list secrets` RBAC, avoid committing secrets, use **External Secrets Operator** / **Secrets Store CSI Driver** (Vault, AWS Secrets Manager, Key Vault), **Sealed Secrets** or **SOPS** for GitOps, short-lived credentials via workload identity (IRSA, GKE Workload Identity, Azure WI).

### Q46. ServiceAccounts and workload identity
Pods authenticate to the API with projected, short-lived ServiceAccount tokens (audience-bound). Cloud workload identity maps ServiceAccounts to IAM roles (no static keys). Create dedicated SAs per workload and grant minimal Roles.

### Q47. Pod Security
Pod Security Admission (namespace labels: `privileged`, `baseline`, `restricted`) replaces PSP. Restricted profile: non-root, no privilege escalation, drop ALL capabilities, seccomp RuntimeDefault, no hostPath/hostNetwork. Enforce via namespace labels or policy engines (Kyverno, OPA Gatekeeper, ValidatingAdmissionPolicy).
```yaml
securityContext: { runAsNonRoot: true, runAsUser: 10001, allowPrivilegeEscalation: false, readOnlyRootFilesystem: true, capabilities: { drop: [ALL] }, seccompProfile: { type: RuntimeDefault } }
```

### Q48. Admission control
Mutating then validating admission webhooks and built-in controllers (LimitRanger, ResourceQuota, PodSecurity) can modify/reject requests. Use for defaults (sidecar injection), policy (required labels, signed images). Failure policy (`Fail` vs `Ignore`) affects cluster availability; exclude `kube-system`.

### Q49. Helm in depth
Chart structure (`Chart.yaml`, `values.yaml`, `templates/`, `_helpers.tpl`), values overrides, `helm template` for rendering, hooks (pre-upgrade jobs), dependencies/subcharts, `helm diff` plugin, OCI registries for charts, avoiding over-templating. Keep values per environment in Git.

### Q50. Kustomize
Bases + overlays (patches, `namePrefix`, `images`, `configMapGenerator` with hash suffix), no templates, built into kubectl (`kubectl apply -k`). Good for simple environment differences; Helm for packaged third-party apps.

### Q51. GitOps (Argo CD / Flux) *(Must-know)*
Git is the source of truth; an in-cluster controller continuously reconciles cluster state to the repo (pull-based). Benefits: audit trail, rollbacks via git revert, drift detection, no CI credentials in the cluster. Patterns: app-of-apps / ApplicationSets, environment promotion via PRs, image updater automation, progressive delivery with Argo Rollouts/Flagger.

### Q52. Progressive delivery
Canary/blue-green with Argo Rollouts or Flagger: traffic shifting via Ingress/Gateway/mesh, automated analysis against Prometheus metrics, auto-rollback on SLO breach. Complements readiness probes and PDBs.

### Q53. Observability stack
Metrics: metrics-server (HPA), Prometheus + kube-state-metrics + node-exporter, Grafana; logs: Fluent Bit/Vector → Loki/ELK/cloud; traces: OpenTelemetry collector → Tempo/Jaeger. Alert on Pod restarts, pending Pods, node pressure, API latency, certificate expiry, PVC usage. See `052_Monitoring-and-Observability.md`.

### Q54. Debugging workflow *(Must-know)*
`kubectl get pod` (status) → `describe pod` (events: scheduling, image pull, probes, OOM) → `logs` (`--previous` for crashed) → `exec`/`debug` ephemeral container → `get events` → check Service endpoints (`get endpointslices`), NetworkPolicy, DNS (`nslookup` from a debug pod), node conditions (`describe node`, `top`).

### Q55. `kubectl debug` and ephemeral containers
```bash
kubectl debug -it pod/web-7d9f --image=nicolaka/netshoot --target=app
kubectl debug node/ip-10-0-1-5 -it --image=ubuntu
```
Attach tooling without changing the image; for distroless/minimal images.

### Q56. Custom Resources and operators
CRDs extend the API with new kinds; **operators** are controllers encoding operational knowledge (create/upgrade/backup databases, certificates, Kafka). Built with kubebuilder/operator-sdk. Evaluate maturity, upgrade paths and RBAC footprint before adopting.

### Q57. Cluster upgrades
Upgrade one minor version at a time (control plane first, then nodes; kubelet skew policy), read deprecation notes (API removals), test in staging, check add-on compatibility (CNI, CSI, ingress), use `kubectl convert`/pluto to find deprecated APIs, drain nodes with PDBs, and keep backups (etcd snapshot/Velero). Managed services automate parts but not app compatibility.

### Q58. etcd essentials
Raft-based key-value store; odd members (3 or 5), SSD/NVMe, low latency, regular snapshots (`etcdctl snapshot save`), defrag, encryption of secrets, and size limits (~8 GB recommended max). Slow etcd → slow API. Managed clusters hide this.

### Q59. API deprecations and versions
Resources move alpha → beta → GA; removed beta APIs break manifests (e.g., `extensions/v1beta1` Ingress). Track with `kubectl get --raw /metrics | grep apiserver_requested_deprecated_apis`, scan manifests/Helm charts before upgrades.

### Q60. Multi-container Pod patterns
Sidecar (proxy/log shipper), ambassador (outbound proxy), adapter (normalize output), init container (setup). Keep Pods cohesive: containers that must scale together.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Autoscaling deep dive *(Must-know)*
HPA computes `desired = ceil(current * currentMetric / targetMetric)` with stabilization windows and `behavior` policies to avoid flapping. Scale on custom/external metrics (RPS, queue depth) via Prometheus Adapter or KEDA. VPA (Off/Initial/Auto modes) conflicts with HPA on the same CPU/memory metric. Cluster Autoscaler/Karpenter add nodes for Pending Pods and consolidate underused nodes; set PDBs and `safe-to-evict` annotations deliberately.

### Q62. Karpenter vs Cluster Autoscaler
Cluster Autoscaler scales predefined node groups; Karpenter provisions right-sized nodes just-in-time from NodePool constraints (instance types, spot/on-demand, zones), consolidates and replaces nodes, and speeds scale-out. Both need correct requests and topology constraints.

### Q63. Spot/preemptible nodes
Use for stateless, interruptible workloads with PDBs, topology spread, graceful termination handling (AWS Node Termination Handler), multiple instance types and fallback to on-demand. Keep critical/stateful workloads on stable nodes via taints/affinity.

### Q64. Multi-zone and high availability design
Spread control plane and nodes across ≥3 zones; replicas ≥ 2-3 with `topologySpreadConstraints` and anti-affinity; PDBs; zone-aware storage (WaitForFirstConsumer, regional disks); readiness gates; avoid single-AZ dependencies (NAT, LB, databases); test AZ failure.

### Q65. Pod lifecycle and disruption handling
Voluntary (drain, rollout, autoscaler) vs involuntary (node crash, OOM, eviction). Eviction order by QoS/priority. Use `preStop`, `terminationGracePeriodSeconds`, PDBs and idempotent startup. Node pressure eviction thresholds protect nodes; set requests correctly to avoid noisy-neighbour evictions.

### Q66. OOMKilled vs eviction
OOMKilled: container exceeded its memory limit (kernel cgroup OOM, exit 137). Eviction: kubelet removes Pods under node pressure (Evicted status, reason in events). Fix with right-sized limits, fixing leaks, and node capacity/headroom.

### Q67. CPU throttling
CFS quota limits cause throttling even if nodes have idle CPU; observe `container_cpu_cfs_throttled_periods_total`. Mitigate: raise/remove CPU limits for latency-critical Pods, right-size requests, tune runtime concurrency (`GOMAXPROCS`, JVM `ActiveProcessorCount`), use static CPU manager for guaranteed workloads.

### Q68. Service mesh *(Must-know)*
Sidecar or ambient data plane (Istio, Linkerd, Cilium mesh) adds mTLS, retries/timeouts, traffic splitting, authz policies and telemetry without app changes. Costs: complexity, resource overhead, debugging. Adopt when you need uniform zero-trust and traffic control across many services. See `../03_Backend/039_Microservices.md`.

### Q69. Gateway API in depth
Roles: infra provider (GatewayClass), cluster operator (Gateway: listeners, TLS), app dev (HTTPRoute/GRPCRoute: matches, filters, weights, header modifications). Supports cross-namespace references via ReferenceGrant, traffic splitting, and consistent semantics across implementations (Envoy Gateway, Istio, Cilium, NGINX Gateway Fabric).

### Q70. DNS performance and pitfalls
`ndots:5` causes multiple lookups for external names; use FQDNs with trailing dots or tune `dnsConfig`; scale CoreDNS, enable NodeLocal DNSCache, watch conntrack races/timeouts (UDP), and cache negative responses. DNS issues masquerade as random timeouts.

### Q71. Kube-proxy modes and eBPF
iptables (default; O(n) rules), IPVS (hash-based, scalable), and eBPF dataplanes (Cilium replaces kube-proxy) with better performance, observability (Hubble) and policy. Large clusters with many Services benefit from IPVS/eBPF.

### Q72. CNI choices
AWS VPC CNI (pod IPs from VPC, ENI limits), Azure CNI, GKE VPC-native, Calico (policy, BGP), Cilium (eBPF, L7 policy, mesh), Flannel (simple overlay). Consider IP exhaustion, network policy support, performance, observability and cloud integration.

### Q73. Multi-tenancy models
Namespace-per-team with RBAC, quotas, NetworkPolicies, Pod Security and admission policies (soft multi-tenancy); virtual clusters (vcluster) or dedicated clusters for stronger isolation; node pool isolation via taints; hierarchical namespaces/Capsule for governance. Kubernetes is not a hard security boundary for hostile tenants without extra sandboxing (gVisor/Kata).

### Q74. Policy as code
Kyverno or OPA Gatekeeper (and built-in ValidatingAdmissionPolicy/CEL) enforce: required labels/resources, no `latest` tags, approved registries, non-root, signed images, no privileged Pods. Roll out in audit mode first; give developers clear error messages.

### Q75. Supply chain security in clusters
Image signing/verification (cosign + policy-controller/Kyverno verifyImages), SBOMs, scanning in CI and registry, admission to block unsigned/critical-CVE images, minimal base images, runtime detection (Falco/Tetragon), and regular node patching. See `045_Docker.md`.

### Q76. Secrets rotation & workload identity
Prefer dynamic short-lived credentials (Vault, cloud IAM via workload identity); rotate DB credentials with operators/sidecars; avoid long-lived static keys in Secrets; use external-secrets with refresh intervals; restart or hot-reload apps on rotation.

### Q77. Backup and disaster recovery
Back up etcd (self-managed) and, more importantly, application state: Velero for namespaces/PVs (volume snapshots + restic/kopia), database-native backups, GitOps repo for manifests, cross-region replicas, tested restore runbooks with RTO/RPO. Clusters should be cattle: recreate from IaC + GitOps.

### Q78. Cost optimization (FinOps)
Right-size requests (VPA/Goldilocks), bin-packing, spot nodes, Karpenter consolidation, scale-to-zero (KEDA), shutting down dev clusters off-hours, storage class tiering, cost allocation (Kubecost/OpenCost, labels), avoid over-provisioned LBs, and reduce cross-AZ traffic via topology-aware routing.

### Q79. Observability at scale
Cardinality control in Prometheus, remote write (Thanos/Mimir/Cortex/Cloud), sampling for traces, log filtering at the agent, SLO-based alerting, dashboards per service/golden signals, and kube-state-metrics alerts (CrashLoopBackOff, Pending, deployment mismatch, PVC full, certificates expiring).

### Q80. Troubleshooting networking
Test from a debug Pod: DNS (`nslookup svc`), connectivity (`curl`, `nc`), Service endpoints, NetworkPolicy blocks, kube-proxy/CNI logs, MTU issues, node security groups, ingress controller logs, and cloud LB health checks. Use Hubble/tcpdump/`ksniff` when needed.

### Q81. Troubleshooting storage
PVC Pending (no StorageClass, zone mismatch, quota), attach/mount errors (`Multi-Attach` for RWO volumes on different nodes), slow I/O (volume type/IOPS), permissions (fsGroup), full disks. Check events, CSI driver logs, node/zone topology.

### Q82. Troubleshooting scheduling
Pending Pods: insufficient CPU/memory, taints, node affinity, PVC binding, topology spread impossible, quota exceeded, image pull secrets irrelevant (they're running-phase issues). `kubectl describe pod` shows the scheduler's reasons.

### Q83. CrashLoopBackOff checklist
`logs --previous`, exit code, probe failures (liveness too aggressive), config/secret missing, permissions, OOMKilled, dependency not ready, wrong command/args, read-only filesystem needing writable paths. Add startup probes and meaningful logs.

### Q84. ImagePullBackOff checklist
Wrong image/tag, private registry credentials (`imagePullSecrets`, workload identity), registry rate limits, network/DNS/egress policy, architecture mismatch. Use digests and pull-through caches.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Designing a production Kubernetes platform *(Must-know)*
- **Clusters:** per environment (and region) with IaC (Terraform/Cluster API), managed control plane, multi-AZ node pools (system, general, spot, GPU).
- **Networking:** CNI with network policy, ingress/Gateway, mesh if needed, DNS tuning, egress control.
- **Security:** RBAC least privilege, workload identity, Pod Security restricted, admission policies, image signing, secrets via external store, audit logging.
- **Delivery:** GitOps (Argo CD/Flux), progressive delivery, preview environments, Helm/Kustomize standards.
- **Operations:** Prometheus/Grafana/Loki/Tempo, SLO alerts, autoscaling (HPA/KEDA/Karpenter), backup (Velero), upgrade runbooks, cost tooling.
- **Developer experience:** golden-path templates, namespaces-as-a-service, self-service portals (Backstage).

### Q86. Zero-downtime deployment checklist
Readiness probes reflecting true readiness, `maxUnavailable: 0`, `preStop` sleep + SIGTERM handling, adequate `terminationGracePeriodSeconds`, PDBs, multiple replicas across zones, connection draining at LB (deregistration delay), backward-compatible DB migrations (expand/contract), and canary analysis.

### Q87. Stateful workloads on Kubernetes
Use operators and managed services; require fast storage, anti-affinity, PDBs, backups, careful upgrades (partitioned rollouts), resource isolation, and failure testing. Prefer cloud-managed databases unless you have strong reasons and expertise.

### Q88. Multi-cluster and multi-region strategies
Separate clusters per region/environment with GitOps fleet management (ApplicationSets, Flux multi-tenancy), global traffic management (DNS/Anycast/GSLB), cross-cluster service discovery (Istio multi-cluster, Cilium ClusterMesh, MCS API), data replication strategy per workload, and DR drills. Evaluate whether one larger cluster suffices.

### Q89. Cluster blast-radius and cell architecture
Limit failure impact with multiple smaller clusters/cells, separate system and tenant workloads, quota guards, rate limits on the API (APF), staged rollouts of platform changes (canary clusters), and careful control-plane add-on upgrades.

### Q90. API server and etcd performance
Avoid watch/list storms (inefficient controllers, large lists), use informers/caches, API Priority and Fairness, limit CRD growth, paginate lists, monitor `apiserver_request_duration_seconds` and etcd latency/DB size, reduce Event churn, and shard heavy operators.

### Q91. Scheduler tuning and advanced placement
Priority/preemption, pod topology spread, descheduler for rebalancing, node affinity for hardware (GPU, local SSD), gang scheduling for batch/ML (Volcano, Kueue), resource classes, and extended resources (device plugins). Kueue provides quota-based batch admission.

### Q92. GPU and ML workloads
NVIDIA device plugin/GPU Operator, MIG/time-slicing for sharing, node pools with taints for GPUs, Kueue/Volcano for queues, Karpenter for GPU nodes, fast image pulls (pre-pulled/ lazy loading), and cost controls. See `../11_Generative_AI/073_Model-Serving-and-Inference.md`.

### Q93. Security hardening checklist
Private API endpoint or restricted CIDRs, RBAC audit, disable anonymous auth, audit logs to SIEM, etcd encryption, kubelet auth/authorization, node OS hardening (Bottlerocket/Flatcar), Pod Security restricted, NetworkPolicy default deny, image policies, regular CIS benchmark scans (kube-bench), runtime threat detection, secrets externalization, and tight cloud IAM.

### Q94. RBAC design at scale
Group-based bindings via OIDC/SSO, namespace roles per team (view/edit/admin), break-glass cluster-admin with auditing, avoid wildcard verbs/resources, review with `kubectl auth can-i --list`, tools (rbac-lookup, KubiScan), and automated drift detection through GitOps.

### Q95. Operators and platform extensions
When to build an operator: repetitive operational toil with domain logic (reconcile loops). Use controller-runtime, finalizers for cleanup, status conditions, idempotent reconciliation, leader election, metrics, and tests with envtest. Prefer existing operators for databases/queues when mature.

### Q96. Handling upgrades at fleet scale
Blue/green clusters or in-place rolling upgrades with canary clusters first, automated pre-flight checks (deprecated APIs, add-on compatibility), PDB audits, workload readiness tests, staged node pool upgrades (surge), rollback plans (new node pool, old control plane can't downgrade), and communication windows.

### Q97. Networking performance
MTU alignment, eBPF datapath, reduce conntrack pressure, avoid overly large iptables rule sets, topology-aware routing, pod IP exhaustion planning (secondary CIDRs, prefix delegation), efficient ingress (keepalive, HTTP/2), and egress via NAT gateways with cost awareness.

### Q98. Observability for SLOs
Define SLIs per service (success rate, latency), burn-rate alerts, platform SLOs (API availability, scheduling latency, node readiness, deploy success), and exemplars linking metrics to traces. Track pod startup time and image pull duration to catch platform regressions.

### Q99. Handling noisy neighbours
Requests/limits discipline, Guaranteed QoS for critical Pods, priority classes, node pools isolation, ResourceQuota/LimitRange, I/O limits (storage classes), CPU manager/ topology manager for NUMA-sensitive apps, and eviction thresholds tuned for the node size.

### Q100. Debugging production incidents
Triage with golden signals, recent deploys/changes (GitOps history), `kubectl get events`, node health, saturation metrics, dependency status; mitigate first (rollback, scale up, cordon bad nodes, shift traffic), then root cause with logs/traces/profiles; blameless postmortem with runbook updates.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. Should we use Kubernetes? (decision framework) *(Must-know)*
Adopt when you have many services/teams needing standardized deployment, autoscaling, self-healing and portability, and the platform expertise (or budget for managed services). Avoid for a handful of simple apps where PaaS (Cloud Run, App Runner, Fargate, Heroku-like) is cheaper in effort. Evaluate total cost of ownership: platform team size, learning curve, add-ons, security burden. Start managed, keep clusters few, and invest in paved roads.

### Q102. Platform engineering and internal developer platforms
Treat the platform as a product: self-service namespace/app creation (Backstage + templates), standardized pipelines, default policies, observability dashboards per service, golden-path Helm charts/Kustomize bases, SLOs and support model, adoption metrics (lead time, deploy frequency, MTTR, developer satisfaction).

### Q103. Governance and compliance
Policy-as-code baselines mapped to CIS/NIST/SOC 2/PCI, audit logging, change management via GitOps PRs, segregation of duties, evidence automation, regular access reviews, image provenance requirements, and data residency via region-scoped clusters.

### Q104. Multi-cloud and portability reality
Kubernetes standardizes the API, not the surrounding services (IAM, LBs, storage, databases). True portability costs complexity; pursue it for specific needs (regulation, DR, M&A) using IaC, open-source data layers and abstraction at the platform boundary.

### Q105. Reliability engineering for the platform
SLOs for platform components, error budgets, chaos experiments (node/zone loss, API throttling, DNS failures), capacity planning (IP space, node limits, etcd size), runbooks, game days, and dependency mapping for add-ons (CNI, CSI, ingress, cert-manager) as critical infrastructure.

### Q106. Migration strategy to Kubernetes
Containerize stateless services first, build the platform baseline (networking, CI/CD, observability, security), migrate by risk and coupling using strangler patterns, keep stateful systems on managed services, run dual stacks with traffic shifting, and decommission legacy only after SLOs hold.

### Q107. Cost governance
Showback/chargeback via labels and OpenCost, quotas by team, mandatory requests, autoscaling baselines, commitments/spot strategy, idle environment automation, storage and egress review, and unit economics (cost per request/tenant).

### Q108. Edge, hybrid and lightweight Kubernetes
k3s/k0s/MicroK8s for edge, fleets managed with GitOps or Rancher/Fleet/Anthos/Azure Arc, intermittent connectivity design, local registries, small footprints, secure remote management and OTA updates.

### Q109. AI/ML platform on Kubernetes
Kubeflow/KServe/Ray/Argo Workflows, GPU scheduling (Kueue), model registries, autoscaling inference (KServe/Knative/KEDA), feature stores, data locality, cost controls, and security for model artifacts and data access.

### Q110. Communicating trade-offs
Present options with cost, risk, staffing and time: managed vs self-managed, one big vs many clusters, mesh vs no mesh, Helm vs Kustomize, GitOps tooling choices. Back with incident data and pilots; document decisions (ADRs) and revisit periodically.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Production-ready Deployment, Service, HPA, PDB
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api, namespace: prod }
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy: { type: RollingUpdate, rollingUpdate: { maxSurge: 25%, maxUnavailable: 0 } }
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api }, annotations: { checksum/config: "{{ sha256 }}" } }
    spec:
      serviceAccountName: api
      automountServiceAccountToken: false
      terminationGracePeriodSeconds: 45
      securityContext: { runAsNonRoot: true, seccompProfile: { type: RuntimeDefault } }
      topologySpreadConstraints:
        - { maxSkew: 1, topologyKey: topology.kubernetes.io/zone, whenUnsatisfiable: ScheduleAnyway, labelSelector: { matchLabels: { app: api } } }
      containers:
        - name: api
          image: ghcr.io/ritesh/api@sha256:abc123...
          ports: [{ containerPort: 8080 }]
          envFrom: [{ configMapRef: { name: api-config } }]
          env: [{ name: DB_PASSWORD, valueFrom: { secretKeyRef: { name: api-db, key: password } } }]
          resources: { requests: { cpu: 200m, memory: 256Mi }, limits: { memory: 512Mi } }
          securityContext: { allowPrivilegeEscalation: false, readOnlyRootFilesystem: true, capabilities: { drop: [ALL] } }
          startupProbe: { httpGet: { path: /healthz, port: 8080 }, failureThreshold: 30, periodSeconds: 2 }
          readinessProbe: { httpGet: { path: /readyz, port: 8080 }, periodSeconds: 5 }
          livenessProbe: { httpGet: { path: /healthz, port: 8080 }, periodSeconds: 10, failureThreshold: 3 }
          lifecycle: { preStop: { exec: { command: ["sleep", "10"] } } }
          volumeMounts: [{ name: tmp, mountPath: /tmp }]
      volumes: [{ name: tmp, emptyDir: {} }]
---
apiVersion: v1
kind: Service
metadata: { name: api, namespace: prod }
spec: { selector: { app: api }, ports: [{ port: 80, targetPort: 8080 }] }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: api, namespace: prod }
spec: { minAvailable: 2, selector: { matchLabels: { app: api } } }
```

### H2. RBAC for a CI deployer (namespace-scoped)
```yaml
apiVersion: v1
kind: ServiceAccount
metadata: { name: deployer, namespace: prod }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: deployer, namespace: prod }
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "patch", "update"]
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: deployer, namespace: prod }
subjects: [{ kind: ServiceAccount, name: deployer, namespace: prod }]
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: Role, name: deployer }
```
Verify with `kubectl auth can-i patch deployments --as=system:serviceaccount:prod:deployer -n prod`.

### H3. Default-deny NetworkPolicy with allowed flows
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: api-policy, namespace: prod }
spec:
  podSelector: { matchLabels: { app: api } }
  policyTypes: [Ingress, Egress]
  ingress:
    - from: [{ namespaceSelector: { matchLabels: { kubernetes.io/metadata.name: ingress-nginx } } }]
      ports: [{ port: 8080 }]
  egress:
    - to: [{ namespaceSelector: {} , podSelector: { matchLabels: { k8s-app: kube-dns } } }]
      ports: [{ port: 53, protocol: UDP }, { port: 53, protocol: TCP }]
    - to: [{ podSelector: { matchLabels: { app: postgres } } }]
      ports: [{ port: 5432 }]
```

### H4. Helm chart essentials
```yaml
# values.yaml
image: { repository: ghcr.io/ritesh/api, tag: "1.4.2" }
replicaCount: 3
resources: { requests: { cpu: 200m, memory: 256Mi }, limits: { memory: 512Mi } }
```
```yaml
# templates/deployment.yaml (excerpt)
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
resources: {{- toYaml .Values.resources | nindent 12 }}
```
```bash
helm lint ./chart && helm template api ./chart -f values-prod.yaml | kubeconform -strict
helm upgrade --install api ./chart -n prod -f values-prod.yaml --atomic --timeout 5m
```

### H5. Argo CD Application (GitOps)
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: api-prod, namespace: argocd }
spec:
  project: default
  source: { repoURL: https://github.com/acme/deploy, targetRevision: main, path: apps/api/overlays/prod }
  destination: { server: https://kubernetes.default.svc, namespace: prod }
  syncPolicy: { automated: { prune: true, selfHeal: true }, syncOptions: [CreateNamespace=true] }
```

### H6. KEDA ScaledObject for a queue consumer
```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: worker }
spec:
  scaleTargetRef: { name: worker }
  minReplicaCount: 0
  maxReplicaCount: 30
  triggers:
    - type: aws-sqs-queue
      metadata: { queueURL: https://sqs.ap-south-1.amazonaws.com/123/jobs, queueLength: "20", awsRegion: ap-south-1 }
```

### H7. Kyverno policy: require non-root and resources
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: require-nonroot-resources }
spec:
  validationFailureAction: Audit    # switch to Enforce after review
  rules:
    - name: nonroot
      match: { any: [{ resources: { kinds: [Pod] } }] }
      validate:
        message: "Containers must run as non-root and set memory limits."
        pattern:
          spec:
            securityContext: { runAsNonRoot: true }
            containers: [{ resources: { limits: { memory: "?*" } } }]
```

### H8. Debug session
```bash
kubectl get pods -n prod -l app=api -o wide
kubectl describe pod api-5c9d -n prod | sed -n '/Events/,$p'
kubectl logs api-5c9d -n prod --previous --tail=100
kubectl get endpointslices -n prod -l kubernetes.io/service-name=api
kubectl run net --rm -it --image=nicolaka/netshoot -n prod -- sh -c 'nslookup api; curl -sv http://api/healthz'
kubectl top pods -n prod --containers
```

### H9. Velero backup schedule
```bash
velero schedule create daily-prod --schedule "0 1 * * *" --include-namespaces prod --ttl 720h --snapshot-volumes
velero restore create --from-backup daily-prod-20251024010000
```

### H10. kind cluster for CI with ingress
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings: [{ containerPort: 80, hostPort: 8080 }]
  - role: worker
  - role: worker
```
```bash
kind create cluster --config kind.yaml && kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Pod stuck in Pending
Describe events: insufficient resources, untolerated taints, node affinity mismatch, unbound PVC, quota exceeded, topology spread impossible. Fix requests, add nodes (autoscaler), adjust tolerations/affinity or storage zone.

### D2. CrashLoopBackOff
`logs --previous`, exit code, probe settings, missing env/secret, permission or read-only FS issues, OOM. Add startup probe, fix config, increase memory limit.

### D3. ImagePullBackOff / ErrImagePull
Bad tag, missing pull secret/permissions, private registry DNS/egress blocked, rate limits, wrong architecture. Verify with `kubectl describe pod` and manual pull from a node.

### D4. Service has no endpoints
Selector doesn't match Pod labels, Pods not Ready (readiness failing), wrong namespace, targetPort mismatch. Check `get endpointslices` and labels.

### D5. 502/503 from ingress during deploys
Readiness not accurate, no `preStop` drain, too-low grace period, `maxUnavailable` > 0, LB deregistration delay. Add graceful shutdown and overlap.

### D6. OOMKilled loops
Limit too low or leak; JVM/Node not container-aware. Check `lastState.terminated.reason`, memory graphs, tune heap flags, raise limit, fix leak.

### D7. Node NotReady
Kubelet down, disk/memory pressure, network/CNI failure, cloud instance issue. `describe node`, kubelet logs, `journalctl`, replace the node (cattle).

### D8. DNS resolution failures/timeouts
CoreDNS overload, conntrack races, NetworkPolicy blocking DNS, bad upstream resolvers, `ndots` amplification. Scale CoreDNS, NodeLocal DNSCache, allow DNS egress.

### D9. PVC cannot attach (`Multi-Attach error`)
RWO volume still attached to another node after Pod move/zone mismatch. Wait for detach, force-delete stuck Pod carefully, use zone-aware scheduling and `WaitForFirstConsumer`.

### D10. HPA not scaling
metrics-server missing, no resource requests, wrong target, metrics unavailable (`<unknown>`), min/max bounds, stabilization windows. `kubectl describe hpa` explains.

### D11. Rollout stuck (`progressDeadlineExceeded`)
New Pods failing readiness, quota, image pull problems, PDB blocking, insufficient capacity. `rollout status`, inspect new ReplicaSet Pods, rollback.

### D12. RBAC `Forbidden`
Missing verb/resource, wrong namespace binding, ServiceAccount mismatch. Use `kubectl auth can-i` with `--as`, check Role vs ClusterRole scopes.

### D13. Certificate expired / ingress TLS errors
cert-manager issuer failing (DNS/HTTP01 challenge blocked), rate limits, expired control-plane certs (self-managed: `kubeadm certs renew`). Monitor expiry.

### D14. API server slow/throttled
Excessive list/watch from controllers, big etcd, webhook latency/timeouts, CRD explosion. Check APF metrics, webhook failurePolicy, reduce load.

### D15. Disk pressure/evictions
Logs, images, ephemeral storage; no limits. Set ephemeral-storage requests/limits, log rotation, image GC thresholds, bigger disks.

---

# 🧩 Part 8: Tricky Questions

### T1. Is a Pod the same as a container?
No. A Pod wraps one or more containers sharing network/storage.

### T2. Do Services load balance by round robin?
kube-proxy (iptables) selects backends randomly; IPVS offers algorithms. Long-lived connections (HTTP/2, gRPC) stick to one Pod; use L7 balancing/mesh.

### T3. Are Secrets encrypted?
Base64-encoded only by default; enable encryption at rest and RBAC. Anyone who can read them or exec into Pods sees them.

### T4. Does deleting a Deployment delete its PVCs?
Not for StatefulSet `volumeClaimTemplates` PVCs (retained by default); Deployment PVCs created separately also remain.

### T5. Do liveness probes check dependencies?
They shouldn't; failing dependencies would restart healthy Pods. Use readiness for dependency-aware gating (carefully).

### T6. What does `limits.cpu` do?
Throttles via CFS quota; it doesn't reserve capacity. Requests influence scheduling and CPU shares.

### T7. Does `kubectl rollout undo` restore ConfigMap changes?
No, only the Pod template of the Deployment; external ConfigMaps/Secrets aren't versioned unless referenced by name/hash.

### T8. Can a namespace isolate network traffic by itself?
No. Without NetworkPolicy all Pods can talk across namespaces.

### T9. Is `latest` tag with `imagePullPolicy: IfNotPresent` safe?
No; nodes may run stale images. Use immutable tags/digests.

### T10. What's the difference between Ingress and a LoadBalancer Service?
LoadBalancer exposes one Service at L4 via a cloud LB; Ingress/Gateway provides L7 routing for many Services behind one entry point.

### T11. Why can scaling to more replicas not improve latency?
Bottleneck elsewhere (DB, locks), CPU throttling, uneven connection distribution, cold caches.

### T12. Is Kubernetes secure by default?
Not fully: permissive pod networking, default service account tokens, no default Pod Security enforcement in all clusters; hardening is required.

### T13. Does a Pod restart change its IP?
A restarted container keeps the Pod IP; a recreated Pod gets a new IP, hence Services.

### T14. Can you downgrade a cluster?
Control plane downgrades aren't supported; plan rollbacks via blue/green clusters and backups.

### T15. Do HPA and VPA work together?
Not on the same metric (CPU/memory); use VPA for requests in recommend mode or HPA on custom metrics.

### T16. Does `kubectl delete pod` guarantee quick replacement?
The controller recreates it; speed depends on scheduling, image pull, and probes.

### T17. Is etcd just a database?
It's the cluster's single source of truth; its health determines API availability.

### T18. Are StatefulSets safe for databases by default?
They provide identity and storage but not replication, backups or failover logic: operators handle those.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Smallest unit?** Pod.
- **Stateless workload?** Deployment.
- **Stateful workload?** StatefulSet.
- **Per-node agent?** DaemonSet.
- **Expose internally?** ClusterIP Service.
- **L7 routing?** Ingress / Gateway API.
- **Config / secrets?** ConfigMap / Secret.
- **Persistent storage?** PVC → PV via StorageClass/CSI.
- **Scale pods?** HPA; **nodes?** Cluster Autoscaler/Karpenter.
- **Event-driven scaling?** KEDA.
- **Health checks?** liveness, readiness, startup.
- **Access control?** RBAC.
- **Network firewall?** NetworkPolicy.
- **Pod hardening?** Pod Security restricted + securityContext.
- **Package manager?** Helm.
- **GitOps tools?** Argo CD, Flux.
- **Policy engines?** Kyverno, OPA Gatekeeper.
- **Cluster DNS?** CoreDNS.
- **State store?** etcd.
- **Runtime?** containerd / CRI-O.
- **Debug container?** `kubectl debug`.
- **Drain a node?** `kubectl drain`.
- **Rollback?** `kubectl rollout undo`.
- **Backup tool?** Velero.
- **Cost tool?** OpenCost/Kubecost.
- **Service mesh?** Istio, Linkerd, Cilium.
- **Exit 137?** OOMKilled/SIGKILL.
- **Spread across zones?** topologySpreadConstraints.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a Kubernetes platform you built or ran.
STAR: "I migrated 40 services from VMs to EKS: Terraform-defined clusters in three AZs, Karpenter for nodes, Argo CD GitOps, Kyverno policies, Prometheus/Grafana/Loki, cert-manager and External Secrets. Deploy frequency rose from weekly to ~50/day, MTTR dropped from 90 to 20 minutes, and compute cost fell 30% via spot and right-sizing."

### P2. Describe an outage you handled.
"A bad CoreDNS config change caused cluster-wide DNS timeouts. I rolled back via GitOps, scaled CoreDNS and enabled NodeLocal DNSCache, added canary rollouts for platform add-ons and SLO alerts on DNS latency. Recovery took 18 minutes."

### P3. How do you secure a cluster?
"Private API endpoint, SSO + least-privilege RBAC, restricted Pod Security, default-deny NetworkPolicies, signed images with admission verification, external secrets with workload identity, audit logs to SIEM, regular patching and kube-bench scans."

### P4. How do you ensure zero-downtime deployments?
"Accurate readiness probes, preStop drain, `maxUnavailable: 0`, PDBs, multi-AZ spread, expand/contract migrations, and canary analysis with automatic rollback."

### P5. How do you control cost?
"Requests right-sizing with VPA recommendations, Karpenter consolidation, spot for stateless, scale-to-zero for event workers, namespace quotas and OpenCost reports per team."

### P6. Why Kubernetes (or not)?
"For many services and teams needing standardized deploys and autoscaling. For a small number of simple services I prefer managed PaaS (Cloud Run/Fargate) to avoid platform overhead."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Architecture:** control plane (API server, etcd, scheduler, controllers), nodes (kubelet, kube-proxy, runtime, CNI/CSI), declarative model and reconciliation.
- **Workloads:** Pod, ReplicaSet, Deployment, StatefulSet, DaemonSet, Job/CronJob, init containers and sidecars, lifecycle and probes.
- **Networking:** Services, DNS, Ingress/Gateway API, CNI, NetworkPolicy, service mesh, kube-proxy/eBPF.
- **Config and storage:** ConfigMaps, Secrets, PV/PVC/StorageClass/CSI, snapshots, backup.
- **Scheduling and scaling:** requests/limits, QoS, affinity, taints, topology spread, priority, HPA/VPA/KEDA, Cluster Autoscaler/Karpenter.
- **Security:** RBAC, ServiceAccounts, Pod Security, admission/policies, secrets management, supply chain, runtime detection, hardening.
- **Delivery:** Helm, Kustomize, GitOps (Argo CD/Flux), progressive delivery, CI/CD integration.
- **Operations:** observability, troubleshooting, upgrades, DR, multi-cluster, cost, multi-tenancy, operators/CRDs.

## Mixed topics
- Kubernetes + Docker (`045_Docker.md`) and CI/CD (`047_CI-CD-and-DevOps.md`).
- Kubernetes + cloud (`048_AWS.md` EKS, `049_Azure.md` AKS, `050_GCP.md` GKE).
- Kubernetes + IaC (`051_Terraform-and-IaC.md`) and monitoring (`052_Monitoring-and-Observability.md`).
- Kubernetes + microservices (`../03_Backend/039_Microservices.md`) and queues (`../03_Backend/038_Message-Queues.md`, KEDA).
- Kubernetes + databases (`../04_Database/`): operators, StatefulSets, managed alternatives.
- Kubernetes + security (`../03_Backend/036_Authentication-and-Security.md`).
- Kubernetes + AI serving (`../11_Generative_AI/073_Model-Serving-and-Inference.md`).

---

# 🔬 Part 12: Kubernetes Internals

### I1. API server request flow
Authentication (certs, tokens, OIDC) → authorization (RBAC/Node/Webhook) → mutating admission → schema validation → validating admission → persist to etcd → notify watchers. The API server is stateless and horizontally scalable; etcd is the state.

### I2. Informers and work queues
Controllers use shared informers (list+watch with local cache and resourceVersion), event handlers enqueue keys into rate-limited work queues, workers reconcile idempotently. Leader election (Lease objects) ensures one active controller instance.

### I3. Scheduler algorithm
Queue → filter plugins (feasible nodes) → score plugins (rank) → bind. Scheduling framework extension points (PreFilter, Filter, Score, Reserve, Permit, Bind). Preemption evicts lower-priority Pods if needed.

### I4. Kubelet and CRI
Kubelet syncs Pod specs from the API, talks CRI gRPC to containerd/CRI-O (sandbox + containers), manages cgroups, volumes (CSI), probes, status reporting, node heartbeat (Lease) and eviction under pressure.

### I5. Pod networking creation
Kubelet asks the runtime to create a pause (sandbox) container; the CNI plugin creates the netns, veth pair, assigns an IP, sets routes; app containers join that netns. Services map to EndpointSlices; kube-proxy or eBPF programs DNAT.

### I6. Endpoints and readiness
EndpointSlice controller adds Pod IPs when Pods are Ready; removing happens at termination start. Propagation delay to proxies/LBs explains brief errors during rollouts, hence `preStop` sleeps.

### I7. etcd and consistency
Raft quorum; linearizable writes; API server uses watches with resource versions; compaction/defragmentation maintain size; large objects/Events degrade performance.

### I8. cgroups and QoS
Kubelet maps requests/limits to cgroup settings (`cpu.weight/cpu.max`, `memory.max`); QoS classes set OOM score adjustments (`BestEffort` killed first).

### I9. Garbage collection and finalizers
Owner references cascade deletes; finalizers block deletion until cleanup controllers finish (stuck `Terminating` objects often have unfinished finalizers); image/container GC on nodes by thresholds.

---

# 📊 Part 13: Reference Tables

### Workload choice
| Need | Object |
|---|---|
| Stateless web/API | Deployment |
| Stable identity + storage | StatefulSet |
| Node agent | DaemonSet |
| One-off task | Job |
| Scheduled task | CronJob |

### Service types
| Type | Reachable from | Notes |
|---|---|---|
| ClusterIP | Cluster | Default |
| NodePort | Node IPs | Dev/limited |
| LoadBalancer | Internet/VPC | Cloud LB per Service |
| ExternalName | Cluster | DNS alias |
| Headless | Cluster | Pod DNS records |

### Probe guidance
| Probe | On failure | Use |
|---|---|---|
| Startup | Restart if never succeeds | Slow boot |
| Readiness | Remove from endpoints | Traffic gating |
| Liveness | Restart container | Deadlock recovery |

### Autoscalers
| Tool | Scales | Signal |
|---|---|---|
| HPA | Pod replicas | CPU/memory/custom |
| VPA | Pod resources | Usage history |
| KEDA | Replicas (incl. zero) | Events/queues |
| Cluster Autoscaler / Karpenter | Nodes | Pending Pods |

### Package/deploy tools
| Tool | Style | Best for |
|---|---|---|
| kubectl apply | Raw YAML | Simple |
| Helm | Templating + releases | Third-party apps, packaging |
| Kustomize | Overlays/patches | Env differences |
| Argo CD / Flux | GitOps reconcile | Continuous delivery |

### Version highlights (verify)
| Item | Notes |
|---|---|
| 1.25 | PodSecurityPolicy removed; Pod Security Admission GA |
| 1.27+ | Sidecar containers alpha→beta; in-place resize alpha |
| 1.29–1.31 | ValidatingAdmissionPolicy GA; nftables proxy mode beta |
| 1.33 | Native sidecar containers GA (verify) |
| Gateway API | v1 GA for core resources |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
`kubectl scale deploy/web --replicas=0`, then `kubectl get pods`.
**Result:** Pods terminate (Terminating) and none remain; Service has no endpoints.

### O2.
Pod with request 100m CPU / limit 200m CPU running a busy loop.
**Result:** consumes up to 200m (throttled beyond), not killed.

### O3.
Container limit 256Mi, allocates 400Mi.
**Result:** OOMKilled, exit 137, restarts per `restartPolicy`.

### O4.
Readiness probe fails on one of three replicas.
**Result:** Pod stays Running but removed from Service endpoints; no restart.

### O5.
Liveness probe fails 3 times (failureThreshold 3).
**Result:** kubelet restarts the container (`RESTARTS` increments).

### O6.
Service selector `app=web` but Pods labeled `app=webapp`.
**Result:** Service has no endpoints; requests fail/refuse.

### O7.
Deployment `maxUnavailable: 0, maxSurge: 1`, 3 replicas, new image.
**Result:** one new Pod created first, then one old removed after the new is Ready, repeating.

### O8.
PVC with `WaitForFirstConsumer` and no Pod using it.
**Result:** stays Pending until a Pod is scheduled that mounts it.

### O9.
Node drained with PDB `minAvailable: 3` and exactly 3 replicas.
**Result:** eviction blocked; drain hangs.

### O10.
`kubectl delete pod web-abc` owned by a Deployment.
**Result:** ReplicaSet creates a replacement Pod immediately.

### O11.
Secret updated; Pod uses it via env var.
**Result:** Pod keeps old value until restarted; mounted file would update eventually.

### O12.
NetworkPolicy default-deny egress applied without DNS allow.
**Result:** name resolution fails; apps time out connecting to services by name.

---

# ✅ Part 15: MCQs

**1. Which component stores cluster state?**
A) kubelet  B) etcd  C) kube-proxy  D) scheduler
**Answer: B**

**2. The smallest deployable unit is:**
A) Container  B) Pod  C) Node  D) Deployment
**Answer: B**

**3. Which object suits a database needing stable storage per replica?**
A) Deployment  B) StatefulSet  C) DaemonSet  D) Job
**Answer: B**

**4. Readiness probe failure results in:**
A) Container restart  B) Pod removed from Service endpoints  C) Node drain  D) Deletion
**Answer: B**

**5. HPA requires:**
A) Resource requests defined and metrics available  B) A DaemonSet  C) Ingress  D) Helm
**Answer: A**

**6. Exit code 137 commonly indicates:**
A) Success  B) OOMKilled / SIGKILL  C) Bad image  D) DNS failure
**Answer: B**

**7. Which resource restricts Pod-to-Pod traffic?**
A) ResourceQuota  B) NetworkPolicy  C) LimitRange  D) PDB
**Answer: B**

**8. Which tool implements GitOps pull-based delivery?**
A) Argo CD  B) kubectl exec  C) Docker Compose  D) minikube
**Answer: A**

**9. Which controls voluntary disruptions during drains?**
A) HPA  B) PodDisruptionBudget  C) Taint  D) Service
**Answer: B**

**10. Secrets in Kubernetes are by default:**
A) Encrypted at rest  B) Base64 encoded  C) Hashed  D) Stored in Vault
**Answer: B**

**11. A taint on a node means:**
A) Pods are attracted  B) Pods are repelled unless they tolerate it  C) Node is deleted  D) Node is hidden
**Answer: B**

**12. Which maps hostnames/paths to Services at L7?**
A) ClusterIP  B) Ingress / Gateway API  C) NodePort  D) ConfigMap
**Answer: B**

**13. Dynamic volume provisioning uses:**
A) StorageClass  B) Namespace  C) Role  D) Endpoint
**Answer: A**

**14. Karpenter primarily scales:**
A) Pods  B) Nodes  C) Namespaces  D) Secrets
**Answer: B**

**15. Which command shows why a Pod is Pending?**
A) `kubectl describe pod`  B) `kubectl scale`  C) `kubectl cordon`  D) `kubectl cp`
**Answer: A**

**16. Which scales on queue depth, including to zero?**
A) HPA CPU only  B) KEDA  C) VPA  D) CoreDNS
**Answer: B**

**17. Pod Security "restricted" profile requires:**
A) Privileged mode  B) Non-root, no privilege escalation, dropped caps  C) hostNetwork  D) Root user
**Answer: B**

**18. Helm release rollback command:**
A) `helm rollback`  B) `helm delete`  C) `helm lint`  D) `helm pull`
**Answer: A**

**19. Which CNI feature is required for NetworkPolicy to work?**
A) Any CNI  B) A CNI that enforces policies (Calico/Cilium etc.)  C) kube-proxy only  D) Ingress
**Answer: B**

**20. DaemonSet runs:**
A) One Pod per node (selected)  B) One Pod per cluster  C) Pods only on masters  D) Jobs
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **No resource requests/limits** (bad scheduling, noisy neighbours).
2. **Liveness probes checking dependencies** → restart storms.
3. **Using `latest` tags** and mutable images.
4. **Running as root / privileged Pods.**
5. **No PodDisruptionBudgets** or PDBs that block drains.
6. **Single replica / single zone** for critical services.
7. **Secrets in Git** or unencrypted etcd; `cluster-admin` for everyone.
8. **No NetworkPolicies** (flat network).
9. **Ignoring graceful shutdown** (no preStop/SIGTERM handling).
10. **CPU limits set too low** causing throttling.
11. **Using `hostPath`** and node-local state for apps.
12. **No monitoring/alerts** for CrashLoopBackOff, Pending, PVC usage, cert expiry.
13. **Too many `LoadBalancer` Services** instead of shared ingress.
14. **Skipping API deprecation checks** before upgrades.
15. **Mixing HPA and VPA on the same metric.**
16. **Hard-coded configuration in images** instead of ConfigMaps/Secrets.
17. **Treating namespaces as hard security boundaries.**
18. **No backup/restore tests** for PVs and cluster state.
19. **Overusing operators/CRDs** without lifecycle ownership.
20. **Manual `kubectl edit` in prod** (drift) instead of GitOps.
21. **Admission webhooks with `failurePolicy: Fail` and no HA.**
22. **Ignoring DNS `ndots`/CoreDNS capacity.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain the **control-plane request path and reconciliation loops** and use them to debug.
- You size **requests/limits**, understand QoS, throttling and OOM behaviour, and design autoscaling (HPA/KEDA/Karpenter) deliberately.
- You deliver **zero-downtime rollouts** (probes, preStop, PDBs, surge settings, expand/contract).
- You build **secure-by-default clusters**: RBAC, Pod Security, NetworkPolicy, admission policies, signed images, workload identity.
- You run **GitOps** with progressive delivery and policy checks; changes are reviewed, auditable and revertible.
- You operate with **observability and runbooks**: SLOs, golden signals, kube-state alerts, tested DR.
- You manage **upgrades, deprecations and fleet scale** safely.
- You know **when not to use Kubernetes** and when managed services/PaaS win.
- You control **cost** with data (OpenCost, right-sizing, spot, consolidation).
- You share concrete incident and migration stories with metrics.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core commands
```
kubectl get|describe|logs|exec|apply|delete|rollout|scale|top|port-forward|debug|auth can-i
kubectl get events --sort-by=.lastTimestamp
kubectl rollout status|history|undo deploy/NAME
kubectl drain NODE --ignore-daemonsets --delete-emptydir-data
helm upgrade --install REL CHART -f values.yaml --atomic
```

### Production Pod checklist
Pinned image (digest) • requests + memory limit • startup/readiness/liveness probes • non-root, drop caps, read-only FS, seccomp • SIGTERM handling + preStop • ≥3 replicas spread across zones • PDB • dedicated ServiceAccount • config/secrets externalized • NetworkPolicy • labels for ownership/cost.

### Troubleshooting flow
Pending → describe events (resources/taints/PVC) • CrashLoopBackOff → logs --previous, probes, OOM • ImagePullBackOff → tag/creds/network • No traffic → labels/endpoints/readiness/NetworkPolicy/DNS • Slow → throttling/saturation/dependencies.

### Platform checklist
Multi-AZ managed cluster • IaC • GitOps • policy engine • secrets operator • ingress/Gateway + cert-manager • monitoring/logging/tracing • Velero + tested restores • autoscaling (HPA/KEDA/Karpenter) • upgrade runbook • cost reports.

### Interview strategy
1. Clarify scale, availability needs, team skills and constraints.
2. Describe architecture (control plane/nodes) and relevant objects.
3. Show a manifest with probes, resources, security and rollout settings.
4. Explain networking, storage, scaling and security choices.
5. Cover delivery (GitOps), observability, upgrades and DR.
6. Close with an incident/migration story with metrics.

### Final checklist before the interview
- [ ] Explain control plane components and what happens on `kubectl apply`.
- [ ] Choose workload types; write Deployment/Service/Ingress/HPA/PDB manifests.
- [ ] Explain probes, requests/limits, QoS, OOM vs throttling.
- [ ] Explain Services, DNS, CNI, NetworkPolicy, Ingress/Gateway API.
- [ ] Explain storage (PV/PVC/CSI) and StatefulSets.
- [ ] Secure the cluster (RBAC, Pod Security, secrets, admission, supply chain).
- [ ] Use Helm/Kustomize/GitOps and progressive delivery.
- [ ] Troubleshoot Pending, CrashLoopBackOff, ImagePull, networking and rollout issues.
- [ ] Plan upgrades, DR, multi-AZ/multi-cluster and cost control.
- [ ] Prepare a platform story, an outage story and a migration story with numbers.
