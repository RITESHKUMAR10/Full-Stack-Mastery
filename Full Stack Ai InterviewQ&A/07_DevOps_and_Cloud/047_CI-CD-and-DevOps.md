# CI/CD & DevOps Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide covers DevOps culture and practice with tooling current to **GitHub Actions, GitLab CI/CD, Jenkins (Pipeline/Jenkinsfile), CircleCI, Azure DevOps, Argo CD / Flux, Argo Rollouts, Terraform, Ansible, Docker, Kubernetes, SonarQube, Trivy, cosign / Sigstore, Prometheus / Grafana**, plus **DORA metrics, SRE, DevSecOps and platform engineering**. Tool UIs, action versions and pricing change often: anything marked "verify" should be checked in the official docs for your version. Examples use the sample name **Ritesh Kumar**.
> This file covers DevOps fundamentals (culture, lifecycle, CALMS), version control workflows (trunk-based, GitFlow), CI (build, test, caching, artifacts), CD (delivery vs deployment, environments, promotion), pipeline design and security, deployment strategies (rolling, blue/green, canary, feature flags), GitOps, IaC and configuration management, release management, DevSecOps (SAST/DAST/SCA/secrets/SBOM/signing), observability and incident management, SRE (SLOs, error budgets), DORA metrics, platform engineering, cost (FinOps), and leadership topics. Related topics: Git in `024`/`025_Git-and-GitHub.md`, Docker in `045_Docker.md`, Kubernetes in `046_Kubernetes.md`, IaC in `051_Terraform-and-IaC.md`, monitoring in `052_Monitoring-and-Observability.md`, testing in `../06_Testing/040_Testing.md`, security in `../03_Backend/036_Authentication-and-Security.md`.

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
- [Part 12: Pipeline Internals](#-part-12-pipeline-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is DevOps? *(Must-know)*
A culture, set of practices and tooling that unites development and operations to deliver software **faster, more reliably and safely**: shared ownership, automation, fast feedback, continuous improvement. It is not a job title or a single tool.

### Q2. DevOps lifecycle
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → (feedback to Plan). Often drawn as an infinity loop; each stage is automated and measured.

### Q3. CALMS framework
**C**ulture (collaboration, blamelessness), **A**utomation, **L**ean (small batches, flow), **M**easurement (metrics), **S**haring (knowledge, tooling).

### Q4. CI vs Continuous Delivery vs Continuous Deployment *(Must-know)*
- **Continuous Integration:** developers merge to a shared branch frequently; every change triggers automated build + tests.
- **Continuous Delivery:** every change is automatically built, tested and **ready to release**; production release is a manual approval.
- **Continuous Deployment:** every change that passes the pipeline is **released to production automatically**.

### Q5. Why CI/CD?
Faster feedback, fewer integration problems, smaller riskier-less releases, repeatable deployments, audit trail, higher developer productivity and quality, quicker recovery (roll forward/back).

### Q6. A typical pipeline
Commit → lint/format → unit tests → build artifact/image → integration tests → security scans → publish artifact → deploy to staging → smoke/E2E → approval (delivery) → deploy to production → verify/monitor → rollback if needed.

### Q7. Version control basics for DevOps
Everything as code in Git: app code, pipeline definitions, infrastructure, configuration, docs. Pull requests with review and required checks; protected main branch; conventional commits; tags/releases for versions. See `025_Git-and-GitHub.md`.

### Q8. Branching strategies *(Must-know)*
| Strategy | Idea | Fit |
|---|---|---|
| **Trunk-based** | Short-lived branches (≤1-2 days), merge to main often, feature flags | High-performing CI/CD teams |
| GitHub Flow | Feature branch → PR → main → deploy | Web apps, continuous deploy |
| GitFlow | main/develop/release/hotfix branches | Versioned releases, slower cadence |
Long-lived branches cause painful merges and delayed feedback.

### Q9. Build artifacts and registries
Pipelines produce immutable, versioned artifacts (JARs, wheels, npm packages, Docker images) stored in registries (Artifactory, Nexus, GitHub Packages, ECR, GHCR). Build once, deploy the same artifact to every environment; promote, don't rebuild.

### Q10. Environments
Dev → test/QA → staging (production-like) → production. Keep configuration external (env vars, config maps, secret stores); keep parity via IaC and containers; use ephemeral preview environments per PR where possible.

### Q11. GitHub Actions basics
```yaml
name: ci
on: { push: { branches: [main] }, pull_request: {} }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test -- --ci
      - run: npm run build
```
Concepts: workflow, event, job, step, runner, action, matrix, secrets, artifacts, caches, environments.

### Q12. Jenkins basics
Self-hosted automation server; pipelines as code via `Jenkinsfile` (Declarative or Scripted), agents/nodes, plugins, shared libraries.
```groovy
pipeline {
  agent any
  stages {
    stage('Build') { steps { sh 'npm ci && npm run build' } }
    stage('Test')  { steps { sh 'npm test' } }
    stage('Deploy'){ when { branch 'main' } steps { sh './deploy.sh' } }
  }
}
```
Pros: flexibility; cons: maintenance (plugins, security, scaling agents).

### Q13. GitLab CI basics
`.gitlab-ci.yml` with stages, jobs, runners, `rules`, `needs`, artifacts, caches, environments and built-in container registry/security scanning.
```yaml
stages: [test, build, deploy]
test: { stage: test, image: node:22, script: [npm ci, npm test] }
```

### Q14. Secrets in pipelines
Store in the CI secret store or an external vault; inject as masked env vars; never print or commit; use OIDC federation to cloud providers instead of long-lived keys; limit secret scope per environment/branch; rotate regularly.

### Q15. Caching and artifacts
Cache dependency directories keyed by lockfile hash (`actions/cache`, setup actions' `cache`); artifacts pass build outputs between jobs and retain reports. Caches speed builds; artifacts guarantee deliverables.

### Q16. Test types in CI
Static analysis, unit tests (fast, on every commit), integration/contract tests, E2E smoke, security scans, performance checks. Fail fast: cheap checks first. See `../06_Testing/040_Testing.md`.

### Q17. Infrastructure as Code (IaC)
Define infrastructure declaratively in version-controlled files (Terraform, Pulumi, CloudFormation/CDK, Bicep). Benefits: repeatability, review, drift detection, disaster recovery. See `051_Terraform-and-IaC.md`.

### Q18. Configuration management
Tools (Ansible, Chef, Puppet, Salt) configure servers idempotently; in containerized/cloud-native setups much of this moves to images + Kubernetes + IaC. Ansible uses agentless SSH and YAML playbooks.

### Q19. Monitoring and logging basics
Metrics (Prometheus), logs (ELK/Loki), traces (OpenTelemetry/Jaeger), dashboards (Grafana), alerts (Alertmanager/PagerDuty). Monitor the pipeline too (duration, failure rate). See `052_Monitoring-and-Observability.md`.

### Q20. Deployment strategies overview *(Must-know)*
| Strategy | How | Pros | Cons |
|---|---|---|---|
| Recreate | Stop old, start new | Simple | Downtime |
| Rolling | Replace instances gradually | No downtime, low cost | Mixed versions, slower rollback |
| Blue/Green | Two environments, switch traffic | Instant rollback | 2× capacity |
| Canary | Small % of traffic first | Safe, data-driven | Needs metrics/automation |
| Shadow | Mirror traffic | Zero user risk | Extra load, side-effect care |
| Feature flags | Deploy dark, release by flag | Decouple deploy/release | Flag debt |

### Q21. Rollback vs roll-forward
Rollback reverts to the previous version (fast, but needs backward-compatible data/schema). Roll-forward ships a fix quickly. Prepare both; automated rollback on health/SLO regression is ideal.

### Q22. Release versioning
Semantic Versioning `MAJOR.MINOR.PATCH`; tag releases; changelogs from conventional commits; immutable artifact tags (git SHA); avoid `latest` in deployments.

### Q23. Linux and scripting skills for DevOps
Shell scripting (bash: `set -euo pipefail`), `curl`, `jq`, `grep/sed/awk`, `systemd`, SSH, permissions, networking basics, cron. Python/Go for tooling. See `024_Linux-and-Networking.md`.

### Q24. Common DevOps tools map
| Area | Tools |
|---|---|
| SCM | Git, GitHub, GitLab |
| CI/CD | Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps |
| Containers | Docker, Kubernetes, Helm |
| IaC | Terraform, Pulumi, CloudFormation |
| Config | Ansible |
| GitOps | Argo CD, Flux |
| Security | Trivy, Snyk, SonarQube, Vault, cosign |
| Observability | Prometheus, Grafana, Loki, OpenTelemetry |

### Q25. Shift-left
Move testing, security and quality checks earlier (IDE, pre-commit, PR) where fixes are cheaper.

### Q26. Pre-commit hooks and quality gates
Linters/formatters/secret scanners on commit (pre-commit, husky) and required checks on PRs (tests, coverage on changed lines, SAST). Gates must be fast and reliable or teams bypass them.

### Q27. Immutable infrastructure
Replace servers/containers with new versions instead of patching in place; reduces drift and enables reproducibility. Pairs with golden images (Packer), containers and autoscaling groups.

### Q28. Idempotency in automation
Running the same script/playbook/plan multiple times yields the same end state. Essential for safe retries and drift correction (Terraform, Ansible, Kubernetes apply).

### Q29. Webhooks and triggers
Pipelines trigger on push, PR, tag, schedule (cron), manual dispatch, or external events (webhook, `repository_dispatch`, artifact published). Use path filters to avoid unnecessary runs in monorepos.

### Q30. What is a runner/agent?
The machine that executes jobs: hosted (managed, ephemeral) or self-hosted (custom hardware, network access, caches). Self-hosted runners need hardening: ephemeral, least privilege, isolated from sensitive networks.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Designing a good CI pipeline *(Must-know)*
Goals: fast (<10 min for PR feedback), reliable, reproducible, secure. Techniques: parallel jobs, dependency/layer caching, test sharding, path filters, fail-fast ordering, hermetic builds with pinned tool versions, ephemeral runners, clear logs and artifacts, flaky test quarantine.

### Q32. GitHub Actions: advanced features
Matrix builds, reusable workflows (`workflow_call`), composite actions, environments with required reviewers and secrets, concurrency groups (cancel superseded runs), `permissions` (least privilege `GITHUB_TOKEN`), `needs` for job DAGs, caching, artifacts, OIDC to cloud.
```yaml
concurrency: { group: deploy-${{ github.ref }}, cancel-in-progress: true }
permissions: { contents: read, id-token: write }
jobs:
  deploy:
    environment: production      # approvals + environment secrets
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: arn:aws:iam::123456789012:role/deploy, aws-region: ap-south-1 }
```

### Q33. Pin and secure third-party actions
Pin actions by full commit SHA (tags are mutable), restrict allowed actions at org level, review marketplace actions, use Dependabot to update, avoid `pull_request_target` with untrusted code checkout, and never echo secrets. Supply-chain attacks on CI are common.

### Q34. OIDC instead of static cloud credentials
CI obtains a short-lived token from the platform's OIDC provider; the cloud IAM trust policy maps repo/branch/environment claims to a role. No long-lived keys stored in secrets; narrower blast radius; audit via claims.

### Q35. Monorepo CI
Path filters, affected-only builds (Nx, Turborepo, Bazel), remote caching, per-package versioning (Changesets), shared pipeline templates, CODEOWNERS. Avoid running everything on every change.

### Q36. Test parallelization and flakiness
Shard tests across runners, use test timing data to balance, isolate state, retry only as a diagnostic aid, track flake rate and quarantine; flaky pipelines destroy trust. See `../06_Testing/040_Testing.md`.

### Q37. Docker in CI
Build with BuildKit and registry/GHA cache, tag with commit SHA, scan (Trivy), SBOM, sign (cosign), push, deploy by digest. Avoid Docker-in-Docker privileged mode where possible (use rootless BuildKit/Kaniko). See `045_Docker.md`.

### Q38. Artifact promotion and immutability
Promote the exact artifact (by digest/version) across environments with approvals and verification gates; never rebuild per environment. Store provenance (who/what/when built) and SBOMs.

### Q39. Environment configuration management
Separate config from code (12-factor); per-environment values in Helm values/Kustomize overlays/Terraform workspaces; secrets via vault or cloud secret managers; avoid environment-specific branches; validate config in CI (schema checks).

### Q40. Database migrations in pipelines
Run migrations as a controlled step (job/init container) with backward-compatible expand/contract changes, locks/timeouts, backups, and rollback plan; avoid destructive changes in the same release as code that depends on them. Tools: Flyway, Liquibase, Prisma Migrate, Alembic.

### Q41. Feature flags
Decouple deploy from release: dark launches, gradual rollouts, kill switches, A/B tests (LaunchDarkly, Unleash, Flagsmith, OpenFeature). Manage lifecycle (owners, expiry), test both flag states, and keep flags out of long-term code paths.

### Q42. Blue/green and canary on Kubernetes
Blue/green: two Deployments/Services, switch via Service selector or Ingress/Gateway weights. Canary: Argo Rollouts/Flagger shift traffic in steps (5% → 25% → 100%) with automated metric analysis (error rate, latency) and rollback. See `046_Kubernetes.md`.

### Q43. GitOps vs push-based CD
Push: CI deploys by running `kubectl/helm` with cluster credentials. GitOps (pull): an in-cluster controller (Argo CD/Flux) syncs from Git; CI only updates manifests. Benefits: no cluster credentials in CI, drift correction, audit via Git history, easy rollback (revert commit).

### Q44. Argo CD essentials
`Application` CRDs map repo path → cluster namespace; sync policies (auto-sync, prune, self-heal), health checks, ApplicationSets for fleets, app-of-apps pattern, RBAC/SSO, notifications. Image updates via Argo CD Image Updater or CI PRs.

### Q45. Terraform in pipelines
`fmt`/`validate`/`tflint` → `plan` on PR (comment diff) → manual approval → `apply` on merge with locked remote state (S3+DynamoDB, GCS, Terraform Cloud). Use workspaces/directories per environment, modules, policy checks (OPA/Sentinel/Checkov), least-privileged roles. See `051_Terraform-and-IaC.md`.

### Q46. Ansible essentials
Inventory, playbooks, roles, modules, handlers, idempotent tasks, Vault for secrets, dynamic inventory for cloud, `--check`/`--diff` dry runs. Use for OS/config management, not for replacing IaC or Kubernetes.
```yaml
- hosts: web
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.package: { name: nginx, state: present }
    - name: Ensure running
      ansible.builtin.service: { name: nginx, state: started, enabled: true }
```

### Q47. Packer and golden images
Build machine images (AMI, VHD) with baked dependencies and hardening for faster, consistent boots; schedule rebuilds for patches; test images (InSpec/Goss). In container-first setups the container image plays this role.

### Q48. DevSecOps pipeline stages *(Must-know)*
Pre-commit secret scan → SAST (CodeQL, Semgrep, SonarQube) → SCA/dependency scan (Dependabot, Snyk, OSV) → IaC scan (Checkov, tfsec) → container scan (Trivy/Grype) → SBOM (Syft) → sign (cosign) → DAST on staging (ZAP) → policy gates (OPA/Kyverno) → runtime monitoring. See `../03_Backend/036_Authentication-and-Security.md`.

### Q49. SAST vs DAST vs SCA vs IAST
SAST analyzes source without running it; DAST probes a running app; SCA finds vulnerable dependencies/licenses; IAST instruments the app during tests. Combine; triage by exploitability and reachability to reduce noise.

### Q50. Supply-chain security (SLSA)
Protect source (branch protection, signed commits), build (hermetic, ephemeral, isolated), dependencies (pin, verify, private proxies), artifacts (provenance attestations, signing, verification at deploy). SLSA levels describe maturity. Respond to dependency-confusion and typosquatting risks.

### Q51. Release management
Release trains vs continuous, release branches/tags, change approvals proportional to risk, release notes automation, communication, freeze windows (minimize), hotfix path, post-release verification, and DORA tracking.

### Q52. Observability in deployments
Annotate dashboards with deploy markers, track error rate/latency per version, automated verification (smoke tests, synthetic checks, canary analysis), SLO burn alerts, and quick links from alerts to runbooks and recent changes.

### Q53. Incident management basics *(Must-know)*
Detect (alerts) → triage and declare severity → assign incident commander/comms/ops → mitigate (rollback, failover, scale, feature flag off) → resolve → blameless postmortem with timeline, root causes, action items. Maintain on-call rotations, runbooks and status pages.

### Q54. Blameless postmortems
Focus on systems and process, not individuals: timeline, impact, detection, contributing factors (5 whys), what went well, action items with owners and deadlines, shared learning. Track action completion.

### Q55. SLI, SLO, SLA and error budgets *(Must-know)*
SLI = measured indicator (availability, latency). SLO = internal target (99.9% over 30 days). SLA = contractual commitment. **Error budget** = 100% − SLO; when exhausted, prioritize reliability work over features. Burn-rate alerts catch fast and slow burns.

### Q56. DORA metrics *(Must-know)*
Deployment frequency, lead time for changes, change failure rate, time to restore service (MTTR; recently also rework rate/reliability). Elite teams deploy on demand with short lead times and low failure rates. Use them to improve flow, not to rank people.

### Q57. Toil and automation
Toil = manual, repetitive, automatable, tactical work that scales with service size. SRE aims to keep toil under ~50% and automate away repeatable tasks (runbooks → scripts → self-healing).

### Q58. Capacity and cost awareness
Right-size resources, autoscale, schedule non-prod shutdowns, spot instances for CI, cache to cut build minutes, tag resources for cost allocation, monitor pipeline cost. See FinOps in Part 4.

### Q59. Documentation and runbooks
Docs-as-code in repos, README per service, runbooks for alerts (symptoms, diagnosis, mitigation, escalation), architecture diagrams (C4), decision records. Good runbooks reduce MTTR.

### Q60. ChatOps and notifications
Pipeline and deploy notifications to Slack/Teams, approval buttons, slash commands for rollbacks, alert routing by service ownership. Keep noise low and actionable.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. End-to-end CI/CD architecture for microservices *(Must-know)*
Per-service pipelines from a shared template: PR checks (lint, unit, contract, scan) → build/sign image tagged by SHA → push → update the GitOps repo (PR/auto-commit) → Argo CD syncs to staging → automated smoke/contract/E2E → promotion PR to prod → canary rollout with analysis → verification. Cross-service compatibility via Pact `can-i-deploy`. See `../03_Backend/039_Microservices.md`.

### Q62. Pipeline as code reuse
Shared libraries/templates: GitHub reusable workflows and composite actions, GitLab `include`/components, Jenkins shared libraries, CircleCI orbs. Version templates, document inputs, and test them. Avoid copy-paste drift across hundreds of repos.

### Q63. Pipeline security hardening *(Must-know)*
Least-privilege tokens (`permissions:`), no secrets in logs, environment protection rules, branch protections, required reviews, ephemeral/isolated runners, no untrusted code with secrets (fork PRs), pinned actions, OIDC auth, artifact attestation, audit logs, and separation between build and deploy credentials.

### Q64. Handling secrets at scale
Central vault (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager), dynamic short-lived credentials, workload identity, secret scanning (gitleaks/trufflehog), rotation automation, access via CSI/External Secrets, SOPS/Sealed Secrets for GitOps. Remove secrets from env dumps and logs.

### Q65. Progressive delivery with automated analysis
Argo Rollouts / Flagger / Spinnaker Kayenta: define steps (setWeight, pause), analysis templates querying Prometheus (error rate < 1%, p95 < 300 ms), automatic abort and rollback. Pair with feature flags for fine-grained exposure.

### Q66. Database change strategies
Expand/contract (add nullable column → dual write → backfill → switch reads → drop old), online schema change tools (gh-ost, pt-osc, `CREATE INDEX CONCURRENTLY`), versioned migrations in CI, tested rollback or roll-forward, and decoupling migrations from app deploy when risky.

### Q67. Environment strategy and preview environments
Ephemeral per-PR environments (namespaces, Vercel/Netlify previews, ephemeral cloud stacks) with seeded data and auto-teardown; shared staging for integration; production with canaries; cost controls (TTL, schedules). Environment parity via IaC/GitOps.

### Q68. Test data and environments for CI
Containerized dependencies (Testcontainers/service containers), synthetic seeded data, anonymized snapshots, contract stubs for third parties, deterministic time/randomness, per-test isolation.

### Q69. Release orchestration across teams
Release calendars, dependency maps, coordinated feature flags, backward-compatible APIs to avoid lockstep releases, release managers/tooling (Spinnaker, Octopus, Harness), change records automatically generated for audits.

### Q70. Compliance & audit in CI/CD
Required approvals (4-eyes) for production, immutable logs, traceability from ticket → commit → build → deploy, SBOM/provenance retention, policy-as-code gates, evidence collection (SOC 2, ISO 27001, PCI), segregation of duties without slowing delivery.

### Q71. Infrastructure pipelines
Separate pipelines for infra: plan/apply with state locking, drift detection (scheduled `plan`), module versioning, policy checks (Checkov, OPA/Conftest, Sentinel), cost estimation (Infracost), blast-radius control (per-env/per-stack state), break-glass procedures. See `051_Terraform-and-IaC.md`.

### Q72. Terraform state & collaboration
Remote state with locking and encryption, small state files per component, no secrets in state when avoidable, `terraform import`/moved blocks for refactors, drift handling, workspaces vs directories, and CI-only applies.

### Q73. Configuration drift
Causes: manual console changes, hotfixes on servers, unmanaged resources. Detect with scheduled plans / `kubectl diff` / Argo CD drift status / AWS Config; prevent with least-privilege human access, GitOps self-heal, and policy guardrails.

### Q74. Build reproducibility
Pin base images by digest and toolchain versions, lockfiles, deterministic build flags, hermetic builds (Bazel/Nix), avoid fetching `latest`, capture build metadata, verify by rebuilding and comparing hashes for critical artifacts.

### Q75. Artifact management
Registries with retention policies, immutable tags, vulnerability scanning on push, replication across regions, proxy caches for dependencies (Artifactory/Nexus) to protect against upstream outages and malicious packages.

### Q76. Handling flaky infrastructure in CI
Retries with backoff on network steps (not on test failures blindly), mirrors/caches for package registries, rate-limit handling (Docker Hub), timeouts, runner health checks, auto-scaling runner pools (Actions Runner Controller, GitLab autoscaler, Buildkite), and monitoring queue times.

### Q77. Metrics for the pipeline
Queue time, build duration (p50/p95), failure rate by cause, flake rate, cache hit rate, cost per build, change failure rate, and time from merge to production. Dashboards guide optimization.

### Q78. Chaos engineering in DevOps
Controlled fault injection (Chaos Mesh, Litmus, Gremlin, AWS FIS) to validate resilience: pod/node kills, latency, dependency outage, AZ failure. Define steady-state hypotheses, limit blast radius, automate in staging, then run game days in production carefully.

### Q79. Load and performance tests in the pipeline
k6/JMeter/Gatling stages with SLO thresholds on staging or ephemeral environments; compare against baselines; fail on regression; synthetic monitoring post-deploy. Avoid noisy shared environments for benchmarks.

### Q80. Disaster recovery in DevOps terms
RPO/RTO targets, backups (tested restores), multi-AZ/region designs, infrastructure recreatable from code, runbooks, DR drills, data replication strategy, DNS failover, and ownership of recovery steps.

### Q81. Kubernetes deployment automation
Helm/Kustomize manifests in Git, image tag/digest updates by automation, policy checks (kubeconform, Kyverno), `--atomic` rollouts or GitOps health checks, PDBs/probes validated in CI, namespace-per-env with quotas. See `046_Kubernetes.md`.

### Q82. Serverless and PaaS deployments
Pipelines deploy functions/containers to Lambda, Cloud Run, Azure Functions, App Runner using IaC (SAM, CDK, Terraform, Serverless Framework), versions/aliases for canary traffic shifting, and environment config via parameter stores.

### Q83. Mobile and frontend CD
Mobile: signing automation, TestFlight/Play tracks, phased rollouts, OTA updates (see `../05_Mobile_Application/`). Frontend: build once, immutable hashed assets to CDN, cache invalidation strategy, preview deployments, feature flags, rollback by pointing to the previous build.

### Q84. Multi-region deployments
Deploy region by region (canary region first), health-gated promotion, global traffic management (DNS weights/Anycast), data replication considerations, consistent config across regions, and region isolation to limit blast radius.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Designing a CI/CD platform for an organization *(Must-know)*
- **Standardization:** golden pipelines (templates) for languages/frameworks with security, quality and compliance baked in.
- **Scale:** autoscaling ephemeral runners, remote caches, artifact proxies, queue-time SLOs.
- **Security:** OIDC, signed commits/artifacts, provenance, policy gates, isolated build environments, secret management.
- **Delivery:** GitOps with progressive delivery, preview environments, environment promotion rules.
- **Governance:** audit trails, approvals by risk tier, DORA dashboards per team.
- **Developer experience:** fast feedback, clear failures, self-service onboarding, documentation, support channels.

### Q86. Improving lead time (case-study approach)
Measure value stream (commit → prod), find waits (queue, manual approvals, slow tests, release trains), then: parallelize/shard tests, cache, trunk-based development, feature flags, automated approvals for low-risk changes, smaller batch sizes, progressive delivery to remove manual verification.

### Q87. Reducing change failure rate
Improve test quality (contract/integration), canary analysis, feature flags, automated rollbacks, pre-prod parity, better code review focus on risk, post-incident learnings into checks, smaller changes, ownership of operability (alerts/runbooks).

### Q88. Reducing MTTR
Fast detection (SLO alerts), clear ownership and escalation, runbooks, quick rollback paths, deploy markers in dashboards, distributed tracing, feature kill switches, rehearsed incident response, and automation for common mitigations.

### Q89. SRE practices and error budget policy
Define SLOs with product stakeholders; budget policy (freeze risky launches when exhausted); reliability reviews; toil reduction goals; production readiness reviews (PRR); capacity planning; blameless postmortems; on-call health (load, rotation fairness).

### Q90. Alerting philosophy
Alert on symptoms (user-visible SLO burn) not causes; page only for actionable, urgent issues; multi-window multi-burn-rate alerts; route by service ownership; reduce noise via grouping/inhibition; ticket for non-urgent. Review alert quality regularly (precision/recall, pages per shift).

### Q91. Platform engineering and IDPs
Build an internal developer platform as a product: service catalog (Backstage), scaffolding templates, self-service environments, standardized pipelines, golden paths for deploy/observability/security, paved-road defaults with escape hatches, and adoption/satisfaction metrics. See `046_Kubernetes.md`.

### Q92. FinOps in CI/CD and cloud
Tag and attribute costs by team/service, budget alerts, rightsizing, autoscaling, spot for CI, idle environment cleanup, build cache to cut minutes, storage lifecycle for artifacts/logs, and showback dashboards. Make cost visible in PRs for IaC changes (Infracost).

### Q93. Policy as code
OPA/Conftest, Kyverno, Sentinel, Checkov enforce rules in CI and at admission: no public buckets, required tags, approved registries, non-root containers, signed images, encryption on. Start in audit mode, provide clear remediation, version policies like code.

### Q94. Security incident response in the pipeline context
Compromised credential: revoke/rotate, review audit logs for misuse, rebuild affected artifacts, invalidate caches, assess supply-chain impact (SBOM lookup of affected component), notify stakeholders, add detection (secret scanning, anomaly alerts) and prevention (OIDC, shorter lifetimes).

### Q95. Zero-downtime and backward compatibility discipline
Expand/contract for schemas and APIs, versioned events, tolerant readers, feature flags for behavior changes, canaries, and compatibility tests across N-1 versions. Deploy order matters (consumers before producers for additive changes).

### Q96. Managing multiple environments and tenants
Environment-specific overlays, tenant-aware configuration, cell-based deployment (deploy to a cell at a time), per-tenant feature flags, and consistent observability tagging (env, tenant, version).

### Q97. Handling legacy systems in DevOps adoption
Start with version control, automated builds and tests around the legacy codebase (characterization tests), containerize/package, introduce IaC for environments, strangler patterns for modernization, and incremental pipeline gates. Avoid big-bang transformations.

### Q98. Building a DevOps culture
Shared on-call, blameless reviews, cross-functional teams, visible metrics, small experiments, internal communities of practice, leadership support for automation time, and aligning incentives to stability and delivery speed.

### Q99. Tooling selection criteria
Fit to workflow, ecosystem and integrations, scalability, security posture, cost model, vendor lock-in, community/maintenance, learning curve, and migration path. Prefer fewer well-supported tools; avoid resume-driven adoption.

### Q100. Migrating CI systems (e.g., Jenkins → GitHub Actions)
Inventory pipelines, categorize by complexity, create shared templates, migrate high-value/low-risk first, run old and new in parallel for comparison, replicate secrets/credentials safely (OIDC), train teams, decommission with deadlines, and track success via build time and failure rates.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. Building a delivery strategy aligned to business goals *(Must-know)*
Translate objectives (time-to-market, reliability, compliance, cost) into measurable engineering outcomes (DORA metrics, SLOs, audit pass rates, unit costs). Invest in the constraints: test automation, trunk-based development, platform self-service, observability, and progressive delivery. Review quarterly with data; fund platform work as product.

### Q102. Governance without friction
Risk-tiered controls: low-risk changes auto-approved with automated evidence; high-risk (payments, auth) require review and staged rollouts. Policy-as-code embedded in the paved road; exceptions time-boxed and tracked.

### Q103. Resilience and release safety at scale
Cell-based architecture, regional staged rollouts, automated canary analysis, global kill switches, rate-limited deploys (no mass concurrent rollouts), dependency health checks before deploy, change freezes only when necessary, and chaos drills.

### Q104. Measuring and improving developer productivity
Combine DORA with SPACE/DevEx signals: build/test wait time, PR cycle time, flaky test rate, onboarding time, satisfaction surveys. Avoid individual output metrics. Invest in the biggest friction points identified by data.

### Q105. Platform team operating model
Product mindset: roadmap, SLAs/SLOs for the platform, user research with developers, documentation, support rotations, deprecation policy, opt-in adoption with incentives, and clear boundaries (platform provides capabilities; teams own services).

### Q106. Multi-cloud and vendor strategy for delivery tooling
Prefer open standards (OCI, OpenTelemetry, OIDC, Terraform/OpenTofu, Kubernetes) at boundaries; abstract provider-specific bits behind modules; evaluate lock-in versus productivity; plan exit paths for critical SaaS (CI, artifact registry, secret manager).

### Q107. Regulatory environments
Healthcare/finance/government: audit trails, segregation of duties, validated pipelines, change approvals, data residency, controlled access to prod, evidence retention, and risk assessments; automate compliance checks to keep velocity.

### Q108. AI in DevOps
Assistants for pipeline authoring, log triage, incident summarization, test generation, code review, anomaly detection, runbook suggestions. Guardrails: human review, no secret exposure, accuracy validation, access controls, audit logging. AI-generated infra changes pass the same policy gates.

### Q109. Succession, on-call and sustainability
Healthy on-call (rotation size, follow-the-sun, compensation, handoffs), reducing pages via reliability work, escalation clarity, runbook quality, burnout monitoring, and training new on-call engineers with shadowing and game days.

### Q110. Communicating trade-offs
Explain speed vs safety, cost vs resilience, standardization vs autonomy with data: incident history, DORA trends, cost per deploy, audit findings. Offer options with risk and effort, and set decision checkpoints.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Full GitHub Actions pipeline: test → build image → scan → deploy via GitOps
```yaml
name: service-ci
on:
  push: { branches: [main] }
  pull_request:
permissions: { contents: read, packages: write, id-token: write, security-events: write }
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint && npm run typecheck && npm test -- --ci --coverage
      - uses: github/codeql-action/init@v3
        with: { languages: javascript-typescript }
      - uses: github/codeql-action/analyze@v3

  image:
    needs: test
    runs-on: ubuntu-latest
    outputs: { digest: "${{ steps.push.outputs.digest }}" }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: "${{ github.actor }}", password: "${{ secrets.GITHUB_TOKEN }}" }
      - id: push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          sbom: true
          provenance: mode=max
      - uses: aquasecurity/trivy-action@0.28.0
        with: { image-ref: "ghcr.io/${{ github.repository }}:${{ github.sha }}", severity: "CRITICAL,HIGH", exit-code: "1", ignore-unfixed: true }
        if: github.ref == 'refs/heads/main'
      - uses: sigstore/cosign-installer@v3
        if: github.ref == 'refs/heads/main'
      - run: cosign sign --yes ghcr.io/${{ github.repository }}@${{ steps.push.outputs.digest }}
        if: github.ref == 'refs/heads/main'

  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: image
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
        with: { repository: acme/deploy-config, token: "${{ secrets.DEPLOY_REPO_TOKEN }}" }
      - run: |
          cd apps/service/overlays/staging
          kustomize edit set image service=ghcr.io/${{ github.repository }}@${{ needs.image.outputs.digest }}
          git config user.name ci-bot && git config user.email ci@example.com
          git commit -am "deploy service ${{ github.sha }} to staging" && git push
```
(Pin third-party actions by commit SHA in real pipelines.)

### H2. Jenkins declarative pipeline with parallel stages and approval
```groovy
pipeline {
  agent { kubernetes { yamlFile 'ci/pod.yaml' } }
  options { timeout(time: 30, unit: 'MINUTES'); disableConcurrentBuilds(abortPrevious: true) }
  environment { IMAGE = "registry.example.com/app:${env.GIT_COMMIT}" }
  stages {
    stage('Checks') {
      parallel {
        stage('Lint')  { steps { sh 'npm ci && npm run lint' } }
        stage('Unit')  { steps { sh 'npm ci && npm test -- --ci' } }
        stage('Audit') { steps { sh 'npm audit --audit-level=high' } }
      }
    }
    stage('Build & Push') { steps { container('kaniko') { sh '/kaniko/executor --context . --destination $IMAGE --cache=true' } } }
    stage('Approve Prod') { when { branch 'main' } steps { input message: 'Deploy to production?', submitter: 'release-managers' } }
    stage('Deploy') { when { branch 'main' } steps { sh 'helm upgrade --install app ./chart --set image.tag=$GIT_COMMIT --atomic -n prod' } }
  }
  post { failure { slackSend channel: '#ci', message: "Build failed: ${env.BUILD_URL}" } }
}
```

### H3. GitLab CI with environments and manual production gate
```yaml
stages: [test, build, deploy]
default: { image: node:22 }
test: { stage: test, script: [npm ci, npm test], cache: { key: { files: [package-lock.json] }, paths: [node_modules/] } }
build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
deploy_staging: { stage: deploy, script: [./deploy.sh staging $CI_COMMIT_SHA], environment: staging, rules: [{ if: '$CI_COMMIT_BRANCH == "main"' }] }
deploy_prod: { stage: deploy, script: [./deploy.sh prod $CI_COMMIT_SHA], environment: production, when: manual, rules: [{ if: '$CI_COMMIT_BRANCH == "main"' }] }
```

### H4. Argo Rollouts canary with Prometheus analysis
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata: { name: api }
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 2m }
        - analysis: { templates: [{ templateName: error-rate }] }
        - setWeight: 50
        - pause: { duration: 5m }
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec: { containers: [{ name: api, image: ghcr.io/acme/api:1.5.0 }] }
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata: { name: error-rate }
spec:
  metrics:
    - name: error-rate
      interval: 1m
      failureLimit: 1
      successCondition: result[0] < 0.01
      provider: { prometheus: { address: http://prometheus:9090, query: 'sum(rate(http_requests_total{app="api",code=~"5.."}[2m])) / sum(rate(http_requests_total{app="api"}[2m]))' } }
```

### H5. Terraform pipeline (plan on PR, apply on merge)
```yaml
name: terraform
on: { pull_request: { paths: ["infra/**"] }, push: { branches: [main], paths: ["infra/**"] } }
permissions: { id-token: write, contents: read, pull-requests: write }
jobs:
  plan:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: infra } }
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: "${{ vars.TF_PLAN_ROLE }}", aws-region: ap-south-1 }
      - run: terraform fmt -check && terraform init -input=false && terraform validate
      - run: terraform plan -input=false -out=tfplan
      - uses: bridgecrewio/checkov-action@v12
        with: { directory: infra }
  apply:
    if: github.ref == 'refs/heads/main'
    needs: plan
    runs-on: ubuntu-latest
    environment: production
    defaults: { run: { working-directory: infra } }
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with: { role-to-assume: "${{ vars.TF_APPLY_ROLE }}", aws-region: ap-south-1 }
      - run: terraform init -input=false && terraform apply -input=false -auto-approve
```

### H6. Ansible playbook with role and Vault variable
```yaml
- name: Configure web servers
  hosts: web
  become: true
  vars_files: [secrets.vault.yml]
  roles: [common, nginx]
  tasks:
    - name: Deploy config
      ansible.builtin.template: { src: app.conf.j2, dest: /etc/nginx/conf.d/app.conf, mode: "0644" }
      notify: reload nginx
  handlers:
    - name: reload nginx
      ansible.builtin.service: { name: nginx, state: reloaded }
```
`ansible-playbook site.yml --check --diff` before applying.

### H7. Multi-burn-rate SLO alert (Prometheus)
```yaml
groups:
- name: slo
  rules:
  - alert: ErrorBudgetFastBurn
    expr: (sum(rate(http_requests_total{code=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))) > (14.4 * 0.001)
          and (sum(rate(http_requests_total{code=~"5.."}[1h])) / sum(rate(http_requests_total[1h]))) > (14.4 * 0.001)
    labels: { severity: page }
    annotations: { summary: "Burning 99.9% SLO error budget 14x too fast", runbook: "https://wiki/runbooks/api-errors" }
```

### H8. Safe bash for deploy scripts
```bash
#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "deploy failed at line $LINENO" >&2' ERR
ENV="${1:?env required}"; TAG="${2:?tag required}"
kubectl --context "$ENV" -n app set image deploy/api api="ghcr.io/acme/api:${TAG}"
kubectl --context "$ENV" -n app rollout status deploy/api --timeout=180s || { kubectl --context "$ENV" -n app rollout undo deploy/api; exit 1; }
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Pipeline passes locally but fails in CI
Different tool versions, missing env vars, filesystem case sensitivity, timezone/locale, network restrictions, parallelism exposing shared state. Reproduce in the same container image, pin versions, print environment info, and enable debug logging.

### D2. Flaky tests blocking merges
Collect failure history, rerun with seeds/trace, isolate shared state/time/network dependencies, quarantine with an owner and deadline, fix root cause; do not normalize reruns.

### D3. Builds suddenly slow
Cache misses (key changed), larger context, runner capacity/queueing, rate limits (registry), new heavy steps, noisy neighbours on shared runners. Compare timing breakdowns; restore caches; scale runners.

### D4. "Permission denied" pushing images / deploying
Expired/insufficient token, wrong registry namespace, missing `packages: write`/IAM role trust, OIDC subject claim mismatch (branch/environment), protected environment approvals pending.

### D5. Deployment succeeded but app is broken
Missing config/secret, migration not applied, readiness probe too lenient, dependency mismatch, wrong image digest. Add post-deploy smoke tests, canary analysis, and automatic rollback.

### D6. Rollback fails
Irreversible schema change, incompatible data format, old image garbage-collected, configuration drift. Enforce backward-compatible migrations and artifact retention; rehearse rollbacks.

### D7. Secrets leaked in logs or repo
Rotate immediately, purge history if needed, audit usage, add masking and secret scanning (pre-commit + CI), move to OIDC/short-lived creds.

### D8. Terraform plan shows unexpected destroys
State drift, renamed resources without `moved` blocks, provider upgrades, changed variable defaults, wrong workspace/backend. Review plan, use `terraform state` tools, pin providers, protect critical resources (`prevent_destroy`).

### D9. Argo CD app OutOfSync/Degraded loop
Controllers mutating fields (HPA replicas, webhook-injected sidecars) vs Git; use `ignoreDifferences`, server-side apply, correct health checks; check hooks and sync waves.

### D10. Self-hosted runner compromised or unstable
Persistent runners keep state/secrets between jobs. Use ephemeral runners, isolate networks, restrict fork PR access, patch frequently, and monitor runner activity.

### D11. Docker build rate-limited or flaky
Registry rate limits/outages. Authenticate, mirror base images, use pull-through caches, retry with backoff, pin digests.

### D12. Deployment stuck waiting for approval/environment
Protection rules, reviewers unavailable, stale concurrency group. Configure fallback reviewers and timeouts, cancel superseded runs.

### D13. Monorepo triggers everything
Missing path filters/affected logic. Add filters, change detection (Nx/Turbo), and split pipelines by package.

### D14. Alert fatigue
Too many cause-based or flapping alerts. Move to SLO burn-rate alerts, add `for:` durations, group/inhibit, review top pages weekly, delete or fix noisy alerts.

### D15. Canary passes but full rollout fails
Low traffic canary misses issues (cache cold, rare paths, scale-related limits). Increase steps/duration, use realistic synthetic load, monitor resource saturation, add automated pause on saturation signals.

---

# 🧩 Part 8: Tricky Questions

### T1. Is CI/CD just tooling?
No. Tools enable it, but trunk-based development, test quality, small batches and ownership determine results.

### T2. Is Continuous Deployment required for DevOps?
No. Many regulated teams practice continuous delivery with approvals while maintaining DevOps principles.

### T3. Should we rebuild per environment?
No. Build once and promote the same artifact to preserve what was tested.

### T4. Is 100% test automation the goal?
No. Automate valuable, stable checks; keep exploratory testing; measure outcomes (change failure rate), not test counts.

### T5. Does GitOps mean CI doesn't deploy?
CI builds and updates Git; the in-cluster controller deploys. Both still matter.

### T6. Are feature flags free?
No. They add complexity and debt; manage lifecycle and test combinations.

### T7. Is a lower MTTR always better than a lower failure rate?
Both matter; DORA balances throughput and stability. Fast recovery enables safe frequent change, but prevention reduces user harm.

### T8. Is blue/green always safest?
It has instant rollback, but database changes and long-lived sessions complicate it, and it costs double capacity.

### T9. Can you rely on `latest` tags in CD?
No: non-deterministic and non-auditable. Use immutable tags/digests.

### T10. Should developers have production access?
Provide least-privilege, time-bound, audited access (break-glass) and rely on pipelines; "you build it, you run it" doesn't mean unrestricted admin.

### T11. Does DevOps eliminate operations teams?
It changes roles: platform/SRE teams enable self-service and reliability while product teams own their services.

### T12. Is Jenkins obsolete?
Not obsolete, but maintenance-heavy; many migrate to managed/YAML-native systems. Choice depends on needs and legacy.

### T13. Why can more parallel jobs make pipelines slower?
Queueing, cache contention, shared resource limits, and overhead of setup per job; measure end-to-end time.

### T14. Is infrastructure drift only a Terraform problem?
No, it affects any manually changed system; detect with scheduled plans, GitOps drift checks and config audits.

### T15. Does SBOM prevent supply-chain attacks?
No; it provides visibility to respond faster. Prevention requires pinning, scanning, signing and verification.

### T16. Is Docker-in-Docker secure?
It typically needs privileged mode; prefer rootless BuildKit/Kaniko or remote builders.

### T17. Should every repo have its own pipeline logic?
Prefer shared templates with local overrides to reduce drift and improve security patching.

### T18. Are DORA metrics comparable across teams?
Only with consistent definitions and context; use for trends and improvement, not team ranking.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **CI means?** Frequent merging with automated build/test.
- **CD means?** Delivery (ready to release) or deployment (auto release).
- **Best branching for CI/CD?** Trunk-based.
- **Build once?** Promote the same artifact.
- **Immutable tags?** Git SHA / digest.
- **Secrets in CI?** Vault/OIDC, never in repo.
- **Deploy strategies?** Rolling, blue/green, canary, shadow.
- **Decouple deploy from release?** Feature flags.
- **Pull-based CD?** GitOps (Argo CD, Flux).
- **IaC tools?** Terraform, Pulumi, CloudFormation.
- **Config management?** Ansible.
- **Policy tools?** OPA, Kyverno, Checkov.
- **SAST/DAST/SCA?** Source / running app / dependencies.
- **Sign images?** cosign.
- **SBOM tool?** Syft.
- **DORA metrics?** Frequency, lead time, change failure rate, MTTR.
- **SLO vs SLA?** Internal target vs contract.
- **Error budget?** 1 − SLO.
- **Alert on?** Symptoms / SLO burn.
- **Postmortem style?** Blameless.
- **Rollback prerequisite?** Backward-compatible changes.
- **DB change pattern?** Expand/contract.
- **Cache key?** Lockfile hash.
- **Flaky tests fix?** Isolate, deterministic, quarantine.
- **Runner hardening?** Ephemeral + least privilege.
- **Drift detection?** Scheduled plan / GitOps diff.
- **Chaos tools?** Chaos Mesh, Litmus, Gremlin.
- **IDP portal?** Backstage.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a CI/CD pipeline you built.
STAR: "I replaced a 45-minute Jenkins job with GitHub Actions: reusable workflows, test sharding, BuildKit cache, Trivy + CodeQL gates, cosign signing, OIDC to AWS, and GitOps deploys via Argo CD with canary analysis. PR feedback dropped to 8 minutes, deploys went from weekly to ~25/day, change failure rate fell from 18% to 6%, and secrets storage in CI was eliminated."

### P2. Describe a production incident and your role.
"A faulty config rollout increased 5xx errors. Alerts fired on SLO burn; I led as incident commander, rolled back via Argo CD within 6 minutes, communicated status, and ran a blameless postmortem. Actions: config validation in CI, canary for config changes, and a runbook update. MTTR was 14 minutes."

### P3. How do you handle secrets and security in pipelines?
"OIDC federation for cloud, vault-backed dynamic secrets, pinned actions, least-privilege tokens, ephemeral runners, secret scanning pre-commit and in CI, SBOM + provenance + signing with admission verification."

### P4. How did you improve DORA metrics?
"Measured the value stream, removed manual approvals for low-risk changes, adopted trunk-based development with flags, parallelized tests, and added automated canary analysis. Lead time fell from 5 days to 6 hours."

### P5. How do you ensure safe database changes?
"Expand/contract migrations, backward-compatible code deployed first, online schema tools, backups and tested rollbacks, feature flags to switch reads, and monitoring for lock contention."

### P6. Tell me about reducing toil.
"Automated environment provisioning with Terraform modules and a Backstage template, replaced manual DNS/cert requests with cert-manager and ExternalDNS, and cut onboarding of a new service from 2 days to 30 minutes."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Culture and metrics:** DevOps principles, CALMS, DORA, SRE (SLI/SLO/error budgets), toil, blameless postmortems, platform engineering.
- **Source and branching:** trunk-based, GitHub Flow, GitFlow, PR workflows, conventional commits, monorepo CI.
- **CI:** build, test, caching, artifacts, parallelization, flaky tests, quality gates, pre-commit.
- **CD:** delivery vs deployment, environments, promotion, rollouts (rolling, blue/green, canary, shadow), feature flags, GitOps, progressive delivery.
- **Tooling:** GitHub Actions, GitLab CI, Jenkins, Azure DevOps, CircleCI, Argo CD/Flux, Argo Rollouts, Helm/Kustomize.
- **IaC and config:** Terraform, Ansible, Packer, drift, state, policy as code.
- **Security:** DevSecOps (SAST/DAST/SCA/secrets/IaC/container scans), SBOM, signing, SLSA, OIDC, runner hardening.
- **Operations:** observability, alerting, incident management, DR, chaos engineering, capacity and FinOps.
- **Leadership:** delivery strategy, governance, migrations, productivity, compliance.

## Mixed topics
- CI/CD + Git (`025_Git-and-GitHub.md`), Docker (`045_Docker.md`), Kubernetes (`046_Kubernetes.md`).
- CI/CD + clouds (`048_AWS.md`, `049_Azure.md`, `050_GCP.md`) and IaC (`051_Terraform-and-IaC.md`).
- CI/CD + monitoring (`052_Monitoring-and-Observability.md`) and testing (`../06_Testing/040_Testing.md`).
- CI/CD + security (`../03_Backend/036_Authentication-and-Security.md`), microservices (`../03_Backend/039_Microservices.md`).
- CI/CD + mobile (`../05_Mobile_Application/`): signing, store releases, OTA.
- CI/CD + ML (`../10_AI_and_ML/074_MLOps.md`): model pipelines, registries, evaluation gates.

---

# 🔬 Part 12: Pipeline Internals

### I1. How a hosted runner job executes
Event → workflow scheduler queues a job → a runner (VM/container) is provisioned/assigned → checks out code, runs steps in a shell/containers sharing a workspace → streams logs → uploads artifacts/caches → reports status checks to the PR → runner is destroyed (ephemeral).

### I2. Cache semantics
Keys computed from lockfile hashes with restore-key fallbacks; caches are immutable per key (write once), scoped by branch (feature branches read default-branch caches but not vice versa), and evicted by size/age. Poisoned caches are a supply-chain risk, so scope and verify.

### I3. Build graph and DAGs
Jobs form a DAG via `needs`/`dependencies`; independent jobs run in parallel; artifacts pass outputs; matrix expands combinatorially. Critical-path analysis reveals the minimum possible pipeline duration.

### I4. GitOps reconciliation loop
Controller fetches desired manifests from Git, renders (Helm/Kustomize), diffs against live objects, applies (server-side apply), reports health, and repeats on interval/webhook. Self-heal reverts out-of-band changes; prune removes resources not in Git.

### I5. Terraform execution model
Parse config → build dependency graph → refresh state → compute plan (diff) → apply in parallel respecting dependencies → update state. State is the mapping between config and real resources; locking prevents concurrent writers.

### I6. OIDC federation flow
Runner requests a signed JWT (claims: repo, ref, environment) from the CI OIDC issuer → presents it to the cloud STS → trust policy validates issuer/audience/claims → returns short-lived credentials. No stored secrets.

### I7. Image signing and verification
`cosign sign` creates a signature/attestation stored in the registry (OCI artifact) bound to the image digest (keyless via OIDC identity + Rekor transparency log). Admission policies verify signature and identity before pods start.

### I8. Canary analysis mechanics
Controller shifts traffic weight, waits, queries metrics providers, compares to thresholds or baseline, then proceeds or aborts and reverts weights. Statistical tests (Kayenta) reduce false positives from noise.

### I9. Error budget math
SLO 99.9% over 30 days → budget 0.1% ≈ 43.2 minutes downtime. Burn rate 1 consumes the budget exactly in the window; burn rate 14.4 consumes 2% in 1 hour (page-worthy). Multi-window rules combine short and long windows.

---

# 📊 Part 13: Reference Tables

### Deployment strategies
| Strategy | Downtime | Rollback speed | Cost | Risk |
|---|---|---|---|---|
| Recreate | Yes | Redeploy | Low | High |
| Rolling | No | Moderate | Low | Medium |
| Blue/Green | No | Instant | 2× | Low |
| Canary | No | Fast | Low–medium | Lowest (with metrics) |

### CI/CD tools
| Tool | Hosting | Config | Strength |
|---|---|---|---|
| GitHub Actions | SaaS/self-hosted runners | YAML | Ecosystem, GitHub integration |
| GitLab CI | SaaS/self-managed | YAML | All-in-one DevSecOps |
| Jenkins | Self-hosted | Groovy | Flexibility, plugins |
| CircleCI | SaaS | YAML | Speed, orbs |
| Azure DevOps | SaaS/server | YAML | Microsoft ecosystem |
| Argo CD / Flux | In-cluster | YAML/CRDs | GitOps CD |

### Security scans
| Scan | Finds | When |
|---|---|---|
| Secrets | Leaked credentials | Pre-commit + CI |
| SAST | Code vulns | PR |
| SCA | Vulnerable deps/licenses | PR + scheduled |
| IaC | Misconfig | PR |
| Container | OS/package CVEs | Build + registry |
| DAST | Runtime vulns | Staging |

### DORA performance bands (approximate; verify latest report)
| Metric | Elite | Low |
|---|---|---|
| Deployment frequency | On demand (multiple/day) | Monthly or less |
| Lead time | < 1 day | > 1 month |
| Change failure rate | 0–15% | > 45% |
| MTTR | < 1 hour | > 1 week |

### SLO budget table (30 days)
| SLO | Allowed downtime |
|---|---|
| 99% | ~7.2 h |
| 99.9% | ~43 min |
| 99.95% | ~21.6 min |
| 99.99% | ~4.3 min |

### Version/feature highlights (verify)
| Item | Notes |
|---|---|
| GitHub Actions | Reusable workflows, OIDC, environments, artifact attestations |
| Terraform → OpenTofu | License change led to OpenTofu fork |
| SLSA | Supply-chain levels for build integrity |
| Sigstore | Keyless signing, transparency log |
| Argo Rollouts | Progressive delivery CRDs |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Two pushes to `main` in quick succession with `concurrency: {group: deploy, cancel-in-progress: true}`.
**Result:** the first run is cancelled; only the latest deploys.

### O2.
Cache key `npm-${{ hashFiles('package-lock.json') }}`; lockfile unchanged.
**Result:** cache hit; `npm ci` is fast.

### O3.
Fork PR workflow referencing `secrets.DEPLOY_KEY`.
**Result:** secrets are not exposed to fork PR runs by default (value is empty).

### O4.
SLO 99.9%, outage of 60 minutes in 30 days.
**Result:** error budget exceeded (43.2 min allowed): freeze risky changes, prioritize reliability.

### O5.
Canary at 10% with 2% error rate vs 0.2% baseline, analysis threshold 1%.
**Result:** analysis fails and the rollout aborts/rolls back.

### O6.
Terraform plan: `-/+ aws_db_instance.main (forces replacement)`.
**Result:** apply would destroy and recreate the DB: review carefully, use `prevent_destroy` and backups.

### O7.
Argo CD self-heal enabled; an engineer edits a Deployment with kubectl.
**Result:** Argo reverts the change to match Git.

### O8.
Image deployed as `app:latest` after a new push.
**Result:** nodes may keep the cached older image (`IfNotPresent`) → inconsistent versions.

### O9.
Pipeline uses a mutable action tag `@v3` and the tag is moved to malicious code.
**Result:** compromised workflow executes with your secrets; pin SHAs.

### O10.
Tests are retried 3× and pass on 2nd attempt frequently.
**Result:** flaky tests masked; rising flake rate and hidden defects.

### O11.
Database migration drops a column in the same release as code that stops using it, and rollout is rolling.
**Result:** old pods still using the column fail during rollout; use expand/contract.

### O12.
Alert fires when CPU > 80% for 1 minute, pages nightly.
**Result:** noisy cause-based alert; replace with SLO burn-rate alert.

---

# ✅ Part 15: MCQs

**1. Continuous Delivery means:**
A) Every change auto-deploys to prod  B) Every change is releasable, with manual release approval  C) No tests  D) Monthly releases
**Answer: B**

**2. Best branching model for CI/CD speed:**
A) Long-lived feature branches  B) Trunk-based development  C) One branch per developer for a year  D) Release branches only
**Answer: B**

**3. "Build once, deploy many" means:**
A) Rebuild per environment  B) Promote the same artifact across environments  C) Never build  D) Build in prod
**Answer: B**

**4. Which is a pull-based CD approach?**
A) `scp` scripts  B) GitOps with Argo CD  C) Manual SSH  D) FTP
**Answer: B**

**5. Error budget equals:**
A) SLO  B) 100% − SLO  C) SLA  D) MTTR
**Answer: B**

**6. OIDC in CI replaces:**
A) Tests  B) Long-lived cloud credentials  C) Docker  D) Git
**Answer: B**

**7. Which deployment gives instant rollback via traffic switch?**
A) Recreate  B) Blue/green  C) Rolling  D) Manual
**Answer: B**

**8. Which tool signs container images keylessly?**
A) cosign  B) hadolint  C) dive  D) kubectl
**Answer: A**

**9. DORA's four key metrics include:**
A) Lines of code  B) Deployment frequency, lead time, change failure rate, MTTR  C) Story points  D) Bug count
**Answer: B**

**10. Terraform state locking prevents:**
A) Syntax errors  B) Concurrent conflicting applies  C) Provider updates  D) Plan output
**Answer: B**

**11. A flaky test is best handled by:**
A) Ignoring  B) Root-cause fix or quarantine with owner  C) Always rerunning  D) Deleting all tests
**Answer: B**

**12. Feature flags primarily enable:**
A) Faster compilation  B) Decoupling deploy from release  C) Encrypting data  D) DNS routing
**Answer: B**

**13. Expand/contract is used for:**
A) CSS layout  B) Backward-compatible schema/API changes  C) Docker layers  D) Caching
**Answer: B**

**14. Alerts should primarily be based on:**
A) CPU spikes  B) User-impacting symptoms/SLO burn  C) Disk names  D) Developer preference
**Answer: B**

**15. A blameless postmortem focuses on:**
A) Who to punish  B) Systemic causes and improvements  C) Hiding incidents  D) Only code bugs
**Answer: B**

**16. SAST analyzes:**
A) Running app traffic  B) Source code without executing  C) Network packets  D) Containers at runtime
**Answer: B**

**17. Which reduces pipeline time most reliably?**
A) More logs  B) Caching, parallelism, test sharding  C) Bigger commit messages  D) Disabling tests
**Answer: B**

**18. Ephemeral runners help by:**
A) Persisting secrets  B) Providing clean isolated environments per job  C) Slower builds  D) Avoiding Git
**Answer: B**

**19. Which tool is an agentless config management tool using SSH/YAML?**
A) Ansible  B) Prometheus  C) Helm  D) Packer
**Answer: A**

**20. Canary release analysis typically uses:**
A) Manual guesses  B) Metrics comparison (errors, latency) with automated rollback  C) Random choice  D) Compiler flags
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Rebuilding artifacts per environment** instead of promoting.
2. **Long-lived branches** and big-bang merges.
3. **Secrets in repos, logs or long-lived CI variables.**
4. **Unpinned third-party actions/images** and `latest` tags.
5. **Slow, flaky pipelines** developers bypass.
6. **Manual production changes** causing drift.
7. **No rollback plan** or incompatible migrations.
8. **Alerting on causes** instead of SLO symptoms.
9. **Skipping post-deploy verification** and canary analysis.
10. **Over-permissive CI tokens** and persistent self-hosted runners.
11. **No ownership/runbooks** for services and pipelines.
12. **Treating DevOps as a team/title** rather than shared responsibility.
13. **Tool sprawl** without standards or paved roads.
14. **Measuring individuals** with DORA/velocity metrics.
15. **Ignoring database changes** in deployment design.
16. **No IaC state hygiene** (shared state, no locking, secrets in state).
17. **Testing only in prod-unlike environments.**
18. **Not scanning dependencies/containers** or ignoring results.
19. **Feature flags never cleaned up.**
20. **No incident reviews** or untracked action items.
21. **Monolithic pipelines** that run everything for every change.
22. **No cost visibility** for CI minutes, environments and cloud.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You optimize the **whole value stream** (DORA), not just tools, and know where time is lost.
- You design **fast, reliable, secure pipelines** (caching, sharding, OIDC, pinned actions, signing, policy gates).
- You choose **deployment strategies** by risk and compatibility, with automated analysis and rollback.
- You treat **databases and config** as first-class parts of releases (expand/contract, validation).
- You operate with **SLOs, error budgets and burn-rate alerts**, and run blameless incident reviews.
- You use **GitOps/IaC** with drift control, state hygiene and policy as code.
- You build **platforms and paved roads** that developers adopt, with metrics for adoption and satisfaction.
- You manage **supply-chain security** end to end (SBOM, provenance, verification).
- You balance **speed, safety, cost and compliance** and communicate trade-offs with data.
- You share concrete before/after numbers from real improvements.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Principles
```
Trunk-based • small batches • build once, promote • everything as code • immutable artifacts
Automate tests early (shift-left) • progressive delivery + automated rollback • observability + SLOs
Least privilege + OIDC • sign/scan/SBOM • blameless learning • measure DORA
```

### Pipeline skeleton
lint/typecheck → unit → build → integration/contract → scans (SAST/SCA/secrets/IaC/container) → publish + sign → deploy staging → smoke/E2E → approval (if needed) → canary prod → verify → monitor/rollback.

### Quick picks
Safe release → canary + flags • Instant rollback → blue/green • Cluster CD → GitOps (Argo CD) • Cloud auth in CI → OIDC • Infra → Terraform + plan/apply pipeline • Server config → Ansible • Alerts → SLO burn rate • DB change → expand/contract • Monorepo → affected builds.

### Interview strategy
1. Clarify team size, release cadence, compliance and pain points.
2. Outline pipeline stages with quality/security gates and promotion flow.
3. Choose a deployment strategy and rollback approach with reasons.
4. Cover IaC/GitOps, secrets, and environment strategy.
5. Add observability, SLOs, incident process and DORA metrics.
6. Share a measured improvement story.

### Final checklist before the interview
- [ ] Explain CI vs continuous delivery vs continuous deployment.
- [ ] Design a pipeline with caching, parallelism, security scans and promotion.
- [ ] Compare rolling, blue/green, canary, shadow; explain flags and rollback.
- [ ] Explain GitOps and tools (Argo CD/Flux), IaC (Terraform) and Ansible.
- [ ] Secure the pipeline (OIDC, secrets, pinned actions, signing, SBOM, runners).
- [ ] Handle DB migrations safely (expand/contract).
- [ ] Define SLI/SLO/error budgets and burn-rate alerting; run incidents/postmortems.
- [ ] Explain DORA metrics and how to improve each.
- [ ] Debug failing/flaky/slow pipelines and drift.
- [ ] Prepare a pipeline story, an incident story and an improvement story with numbers.
