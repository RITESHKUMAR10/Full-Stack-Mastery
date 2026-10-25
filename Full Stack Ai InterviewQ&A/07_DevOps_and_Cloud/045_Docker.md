# Docker & Containers Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Docker Engine 25–28**, **Docker Desktop 4.x**, **BuildKit / `docker buildx`** (default builder), **Docker Compose v2** (`docker compose`, Compose Specification), **OCI image and runtime specs**, **containerd/runc**, and comparisons with **Podman, Buildah, Kubernetes** and registries (Docker Hub, GHCR, ECR, GCR/Artifact Registry, ACR). Docker's licensing (Docker Desktop paid tiers for larger companies), rate limits on Docker Hub and feature names change: anything marked "verify" should be checked in the official docs (docs.docker.com) for your version. Examples use the sample name **Ritesh Kumar**.
> This file covers containers vs VMs, images, layers and the build cache, Dockerfile best practices (multi-stage, non-root, `.dockerignore`), networking, volumes and bind mounts, Compose, registries, security (rootless, capabilities, seccomp, scanning, SBOM, signing), resource limits, logging, health checks, multi-arch builds, CI/CD usage, performance tuning, debugging, internals (namespaces, cgroups, union filesystems, runc/containerd) and production practice. Related topics: orchestration in `046_Kubernetes.md`, CI/CD in `047_CI-CD-and-DevOps.md`, Linux/networking in `../08_CS_Fundamentals/` and `024_Linux-and-Networking.md`, microservices in `../03_Backend/039_Microservices.md`, security in `../03_Backend/036_Authentication-and-Security.md`.

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
- [Part 12: Container Internals](#-part-12-container-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Docker? *(Must-know)*
A platform for building, shipping and running applications in **containers**: lightweight, isolated processes that package an app with its dependencies (libraries, runtime, config) so it runs the same on a laptop, CI and production. Docker provides the CLI, daemon (`dockerd`), image format/build tooling and registry integration.

### Q2. Container vs virtual machine *(Must-know)*
| | Container | VM |
|---|---|---|
| Isolation | Process-level (namespaces, cgroups) on a shared kernel | Full guest OS on a hypervisor |
| Size | MBs | GBs |
| Start time | Milliseconds–seconds | Seconds–minutes |
| Overhead | Very low | Higher |
| Security boundary | Weaker (shared kernel) | Stronger |
| Use | Microservices, CI, dense packing | Strong isolation, different OS kernels |

### Q3. Image vs container
An **image** is an immutable, layered, read-only template (filesystem + metadata). A **container** is a running (or stopped) instance of an image with a thin writable layer, its own process tree, network and mounts.

### Q4. Dockerfile, image, container, registry, volume
Dockerfile = recipe; `docker build` makes an image; `docker run` creates a container; registry stores/distributes images (Docker Hub, ECR, GHCR); volumes persist data beyond a container's life.

### Q5. Essential commands *(Must-know)*
```bash
docker pull node:22-alpine
docker build -t myapp:1.0 .
docker run -d --name web -p 8080:3000 -e NODE_ENV=production myapp:1.0
docker ps -a                    # list containers
docker logs -f web              # follow logs
docker exec -it web sh          # shell into a running container
docker stop web && docker rm web
docker images; docker rmi myapp:1.0
docker system prune -af --volumes   # DANGEROUS: removes unused data
```

### Q6. A basic Dockerfile
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```
Copy dependency manifests first so the install layer is cached until they change.

### Q7. Dockerfile instructions
`FROM` (base), `WORKDIR`, `COPY`/`ADD`, `RUN` (build-time command, new layer), `ENV`, `ARG` (build-time variable), `EXPOSE` (documentation), `USER`, `VOLUME`, `ENTRYPOINT`, `CMD`, `HEALTHCHECK`, `LABEL`, `SHELL`. Prefer `COPY` over `ADD` (ADD auto-extracts and fetches URLs).

### Q8. CMD vs ENTRYPOINT *(Must-know)*
`ENTRYPOINT` defines the executable; `CMD` supplies default arguments (overridable at `docker run`). Together: `ENTRYPOINT ["node"]` + `CMD ["server.js"]`. Use **exec form** (JSON array) so the process receives signals directly as PID 1; shell form wraps in `/bin/sh -c` and swallows signals.

### Q9. `-p` port mapping and `EXPOSE`
`-p host:container` publishes a port on the host (`-p 8080:3000`, bind to loopback with `-p 127.0.0.1:8080:3000`). `EXPOSE` only documents the port; it doesn't publish it. `-P` publishes all exposed ports to random host ports.

### Q10. Environment variables and secrets
`-e KEY=value`, `--env-file .env`, `ENV` in Dockerfile (baked into image: don't put secrets there). Use secret managers, Docker/Swarm secrets, Compose `secrets`, BuildKit `--mount=type=secret` for build-time secrets. Anything in an image layer or `docker inspect` is visible.

### Q11. Volumes vs bind mounts vs tmpfs *(Must-know)*
| | Volume | Bind mount | tmpfs |
|---|---|---|---|
| Managed by | Docker | Host path | Memory |
| Persistence | Yes | Yes (host files) | No |
| Use | Databases, shared data | Dev source code, configs | Secrets, scratch |
```bash
docker run -v pgdata:/var/lib/postgresql/data postgres:16
docker run -v "$PWD":/app -w /app node:22 npm test
docker run --tmpfs /tmp:rw,size=64m myapp
```

### Q12. Container networking basics
Default **bridge** network (containers reach each other by IP; user-defined bridges add DNS names), **host** (shares the host network stack), **none**, **overlay** (multi-host, Swarm), **macvlan**. Use user-defined networks so containers resolve each other by name.
```bash
docker network create appnet
docker run -d --network appnet --name db postgres:16
docker run -d --network appnet -e DB_HOST=db myapp
```

### Q13. Docker Compose basics *(Must-know)*
Defines multi-container apps in YAML.
```yaml
services:
  web:
    build: .
    ports: ["8080:3000"]
    environment: [DATABASE_URL=postgres://app:pw@db:5432/app]
    depends_on: { db: { condition: service_healthy } }
  db:
    image: postgres:16
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD: pw, POSTGRES_DB: app }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U app"], interval: 5s, retries: 10 }
volumes:
  pgdata:
```
`docker compose up -d`, `down` (add `-v` to remove volumes), `logs -f`, `ps`, `exec`, `build`, `config`.

### Q14. `.dockerignore`
Excludes files from the build context (`node_modules`, `.git`, `.env`, logs, build outputs) to speed builds, shrink context, avoid leaking secrets and improve cache hits.

### Q15. Image layers and caching *(Must-know)*
Each `RUN`, `COPY`, `ADD` creates a layer; unchanged layers are reused from cache until an instruction or its inputs change, invalidating all later layers. Order Dockerfile from least to most frequently changing: base → system deps → dependency manifests/install → source code.

### Q16. Tags, digests and versioning
Tags (`node:22-alpine`) are mutable pointers; **digests** (`node@sha256:...`) are immutable. Pin versions (or digests) for reproducibility; avoid `latest` in production. Tag images with git SHA and semantic versions.

### Q17. Base image choices
`alpine` (tiny, musl libc: compatibility caveats), `debian-slim` (balanced, glibc), `distroless` (no shell/package manager, minimal attack surface), `scratch` (empty, for static binaries), Ubuntu (familiar, larger). Choose by compatibility, size, and security patch cadence.

### Q18. Logs
Containers log stdout/stderr, captured by the logging driver (`json-file` default). `docker logs`, `--tail`, `--since`. Don't write logs to files inside the container; ship stdout to a collector (Fluent Bit, Loki, CloudWatch). Configure rotation (`max-size`, `max-file`).

### Q19. Container lifecycle
created → running → paused/stopped (exited) → removed. `docker stop` sends `SIGTERM` then `SIGKILL` after the timeout (default 10 s); `docker kill` sends `SIGKILL`. Restart policies: `no`, `on-failure[:n]`, `always`, `unless-stopped`.

### Q20. Inspecting and cleaning up
`docker inspect`, `docker stats`, `docker top`, `docker diff`, `docker history <image>`, `docker system df`; prune carefully: `docker container prune`, `docker image prune`, `docker volume prune` (data loss risk).

### Q21. Registry workflow
```bash
docker login ghcr.io
docker tag myapp:1.0 ghcr.io/ritesh/myapp:1.0
docker push ghcr.io/ritesh/myapp:1.0
```
Use private registries, access tokens (not passwords), retention policies and vulnerability scanning on push.

### Q22. Healthchecks
`HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost:3000/health || exit 1`. Status `healthy/unhealthy` informs Compose/Swarm (Kubernetes uses its own probes). Keep checks cheap and meaningful.

### Q23. Running as non-root
Create/use an unprivileged user (`USER node` or `adduser`), set file ownership (`COPY --chown`), avoid privileged ports (<1024) unless necessary. Root in a container is root-equivalent on a kernel escape.

### Q24. Resource limits
`--memory 512m`, `--cpus 1.5`, `--pids-limit`, `--memory-swap`; Compose `deploy.resources` (Swarm) or `mem_limit`/`cpus`. Without limits one container can starve the host; exceeding memory → OOM kill (exit code 137).

### Q25. Exit codes
`0` success, `1` generic error, `125/126/127` docker/exec errors, `137` SIGKILL (often OOM), `139` segfault, `143` SIGTERM. Check `docker inspect --format '{{.State.OOMKilled}}' c`.

### Q26. Containers are ephemeral
Treat containers as disposable: no state in the writable layer, config via env/volumes, one main process per container (not a rule, but a guideline), and replace rather than patch in place.

### Q27. Docker vs Kubernetes
Docker builds/runs containers (single host; Compose for multi-container dev). Kubernetes orchestrates containers across clusters (scheduling, scaling, self-healing, service discovery, rollouts). See `046_Kubernetes.md`.

### Q28. Docker Desktop and alternatives
Docker Desktop (macOS/Windows/Linux, VM-based; licensing for larger orgs), **Podman** (daemonless, rootless-first, Docker-compatible CLI), **Rancher Desktop**, **Colima/Lima**, **OrbStack** (macOS). Choose by license, performance and tooling.

### Q29. Pulling and running common services
```bash
docker run -d --name redis -p 6379:6379 redis:7
docker run -d --name pg -e POSTGRES_PASSWORD=pw -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16
docker run -d --name mongo -p 27017:27017 mongo:7
```
Great for local dev and tests (see `../04_Database/`).

### Q30. Dev workflow with bind mounts and hot reload
Mount source (`-v "$PWD":/app`), keep `node_modules` in an anonymous volume (`-v /app/node_modules`), run a watcher (nodemon, Vite), and use Compose `develop.watch` (sync/rebuild) for modern workflows.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Multi-stage builds *(Must-know)*
Use one stage to build and a minimal stage to run, copying only artifacts.
```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]
```
Results: smaller images, no compilers or dev dependencies in production, better cache reuse. Target a stage with `--target build`.

### Q32. Go/Java/Python multi-stage examples
```dockerfile
# Go: static binary on distroless
FROM golang:1.23 AS b
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /app ./cmd/server
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=b /app /app
ENTRYPOINT ["/app"]
```
```dockerfile
# Python: wheels built in builder, slim runtime
FROM python:3.12-slim AS b
RUN pip wheel --wheel-dir /wheels -r requirements.txt
FROM python:3.12-slim
COPY --from=b /wheels /wheels
RUN pip install --no-index --find-links=/wheels -r requirements.txt
```

### Q33. BuildKit features
Parallel stage builds, better caching, `--mount=type=cache` (persist package caches), `--mount=type=secret`, `--mount=type=ssh`, heredocs in Dockerfiles, inline cache export/import, `docker buildx` with multi-platform and remote builders.
```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=cache,target=/root/.npm npm ci
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```
`docker build --secret id=npmrc,src=$HOME/.npmrc .`

### Q34. Reducing image size
Multi-stage builds, slim/distroless bases, combine `RUN` steps and clean caches in the same layer (`apt-get install --no-install-recommends && rm -rf /var/lib/apt/lists/*`), `.dockerignore`, install only production deps, avoid copying build tools, use `docker history`/`dive` to inspect layers.

### Q35. Layer ordering and cache busting
Put volatile steps late. Use `ARG CACHEBUST` sparingly. Pin package versions to keep builds deterministic. In CI, use registry/inline cache (`--cache-from type=registry,ref=...` / `--cache-to`) because runners start cold.

### Q36. ARG vs ENV
`ARG` exists only at build time (visible in `docker history`); `ENV` persists into the container runtime. Neither is secret-safe. `ARG` before `FROM` is available only to `FROM`.

### Q37. COPY vs ADD; WORKDIR; chown
`COPY --chown=node:node . .` sets ownership without extra layers. `ADD` handles tar auto-extraction and URLs (avoid URLs; use `curl` with checksum). `WORKDIR` creates directories and sets the working directory for later instructions.

### Q38. PID 1 and signal handling
The first process is PID 1; it must handle `SIGTERM` and reap zombies. Use exec-form commands, handle signals in the app (graceful shutdown), or use `--init` (tini) to forward signals and reap children. Node: listen for `SIGTERM`; shell scripts: `exec "$@"` at the end of entrypoints.

### Q39. Entrypoint scripts
```bash
#!/bin/sh
set -e
if [ "$1" = "server" ]; then
  python manage.py migrate --noinput
  exec gunicorn app.wsgi:application -b 0.0.0.0:8000
fi
exec "$@"
```
`exec` keeps the app as PID 1. Avoid heavy logic and secrets in entrypoints.

### Q40. Container networking in depth *(Must-know)*
Bridge: veth pairs plug containers into a Linux bridge (`docker0`/user-defined) with NAT (iptables/nftables masquerade) for outbound and DNAT for published ports. User-defined bridges include an embedded DNS server (127.0.0.11) resolving service/container names and aliases. Host networking skips NAT (Linux only). Overlay networks use VXLAN for multi-host.

### Q41. Service discovery in Compose
Services reach each other by service name on the Compose default network (`db:5432`). Container ports are used inside the network (not published host ports). `depends_on` controls start order but not readiness unless `condition: service_healthy`.

### Q42. Compose features
Profiles (`--profile debug`), `extends`/`include`, `env_file`, `.env` interpolation, multiple files (`-f compose.yml -f compose.prod.yml`), `healthcheck`, `restart`, `deploy` (limits), `secrets`/`configs`, `develop.watch`, `docker compose config` to render the final config.

### Q43. Volumes in depth
Named volumes live under `/var/lib/docker/volumes`; drivers (local, NFS, cloud plugins); backup by running a helper container (`docker run --rm -v vol:/data -v $PWD:/backup alpine tar czf /backup/vol.tgz -C /data .`). Bind mounts depend on host paths and permissions (UID/GID mismatches common). On Docker Desktop, bind mount I/O can be slow.

### Q44. File permissions and UID/GID
Containers use numeric UIDs; host-mounted files keep host ownership. Match UID/GID (`--user $(id -u):$(id -g)`), set `chown` in images, or use user namespaces/rootless mode. Permission-denied errors on mounts are usually UID mismatches or SELinux labels (`:z`/`:Z`).

### Q45. Docker security basics *(Must-know)*
Run as non-root, minimal images, drop capabilities (`--cap-drop ALL --cap-add NET_BIND_SERVICE`), read-only root filesystem (`--read-only` + tmpfs), no `--privileged`, don't mount `/var/run/docker.sock`, use seccomp/AppArmor defaults, scan images, pin and update bases, never bake secrets, keep Docker updated.

### Q46. Image scanning, SBOM and signing
Scanners: Trivy, Grype, Docker Scout, Snyk, Clair. Generate SBOMs (Syft; `docker buildx build --sbom=true`), attestations/provenance (`--provenance=true`), and sign images with cosign/Sigstore or Docker Content Trust; verify signatures in admission policies. Fail CI on critical vulnerabilities with allow-list governance.

### Q47. Rootless Docker and Podman
Rootless mode runs the daemon and containers without root using user namespaces, reducing blast radius (limitations: privileged ports, some network features, performance). Podman is daemonless and rootless by default, compatible with most Docker commands and Compose files (`podman compose`).

### Q48. Docker socket danger
Mounting `/var/run/docker.sock` grants control of the Docker daemon (equivalent to root on the host). Avoid in containers; for CI use rootless/remote builders, Kaniko, BuildKit, or socket proxies with strict ACLs.

### Q49. Logging drivers and rotation
Drivers: `json-file` (default), `local`, `syslog`, `journald`, `fluentd`, `gelf`, cloud-specific. Configure rotation in `daemon.json`: `{"log-driver":"local","log-opts":{"max-size":"10m","max-file":"3"}}` to prevent disk exhaustion.

### Q50. Monitoring containers
`docker stats` for quick checks; cAdvisor + Prometheus + Grafana, Datadog, or cloud agents for metrics; alert on restarts, OOM kills, CPU throttling, disk usage. Export app metrics (`/metrics`) and trace with OpenTelemetry. See `052_Monitoring-and-Observability.md`.

### Q51. Docker in CI
Build with BuildKit caching, tag with commit SHA, scan, push, then deploy. GitHub Actions: `docker/setup-buildx-action`, `docker/build-push-action` with `cache-from/to: type=gha`. Use ephemeral runners and registry credentials from OIDC/tokens.
```yaml
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v6
  with: { context: ., push: true, tags: "ghcr.io/acme/app:${{ github.sha }}", cache-from: type=gha, cache-to: "type=gha,mode=max", platforms: "linux/amd64,linux/arm64" }
```

### Q52. Multi-architecture images
Build for `linux/amd64` and `linux/arm64` with `docker buildx build --platform ...` (QEMU emulation or native builders); push a manifest list so clients pull the right architecture. Test on Apple Silicon vs x86 servers; watch for architecture-specific binaries.

### Q53. Docker Hub rate limits and mirrors
Anonymous/free pulls are rate-limited (verify limits); authenticate, use a pull-through cache/mirror (registry proxy, ECR pull-through cache), or mirror critical base images to your registry for reliability and supply-chain control.

### Q54. Garbage and disk usage
Images, stopped containers, build cache, and volumes accumulate. `docker system df`, `docker builder prune`, scheduled pruning on build hosts, log rotation, and avoiding huge layers. Overlay2 directory `/var/lib/docker` must be monitored.

### Q55. Environment parity and 12-factor
Config via environment, logs to stdout, stateless processes, backing services as attached resources, build/release/run separation, dev/prod parity. Containers make these practices easier but don't enforce them.

### Q56. Debugging a container that exits immediately
`docker logs`, `docker inspect` (exit code, OOMKilled), run with `--entrypoint sh -it`, check CMD/ENTRYPOINT form, missing files/permissions, wrong architecture, healthcheck loops, config/env errors. Use `docker run --rm -it image sh` to explore.

### Q57. `docker exec` vs `docker attach` vs `docker run`
`exec` starts an additional process in a running container; `attach` connects to the main process's stdin/stdout; `run` creates and starts a new container. Use `exec` for debugging; avoid changing containers manually in production.

### Q58. Copying files and committing
`docker cp` copies between host and container. `docker commit` creates an image from a container's state (avoid for production; not reproducible). Prefer Dockerfiles.

### Q59. Docker contexts and remote hosts
`docker context create` and `docker -H ssh://user@host` to run commands on remote engines securely via SSH; avoid exposing the daemon's TCP port without TLS.

### Q60. Alternatives to Dockerfile builds
Buildpacks (Cloud Native Buildpacks/Paketo: `pack build`), Jib (Java), ko (Go), Nix, Bazel rules, Kaniko/BuildKit in CI without a daemon. They provide reproducibility and security defaults without writing Dockerfiles.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Linux primitives behind containers *(Must-know)*
Containers are ordinary processes isolated by: **namespaces** (PID, NET, MNT, UTS, IPC, USER, CGROUP, TIME) controlling what a process sees; **cgroups** (v1/v2) limiting CPU, memory, I/O, PIDs; **capabilities** splitting root powers; **seccomp** filtering syscalls; **LSMs** (AppArmor/SELinux); and a **union filesystem** (overlayfs) providing layered root filesystems. See `024_Linux-and-Networking.md`.

### Q62. Docker architecture
CLI → `dockerd` (API, images, networks, volumes) → `containerd` (container lifecycle, image pull/snapshots) → `containerd-shim` → `runc` (OCI runtime that creates namespaces/cgroups and execs the process). Kubernetes uses containerd/CRI-O directly, without dockerd.

### Q63. OCI standards
**OCI Image Spec** (manifest, config, layers as tar+gzip/zstd), **OCI Runtime Spec** (`config.json`, lifecycle), **OCI Distribution Spec** (registry API). They make images portable across Docker, Podman, containerd, Kubernetes.

### Q64. Overlay2 and copy-on-write
Image layers are read-only lower dirs; the container adds an upper writable dir; reads fall through, first write copies the file up (CoW). Heavy writes to the container layer are slow and ephemeral: use volumes for write-intensive paths (databases, logs).

### Q65. cgroups: memory and CPU behaviour
Memory limit exceed → OOM killer terminates the process (exit 137). CPU `--cpus` uses CFS quota → throttling (latency spikes) rather than killing; `--cpu-shares` are relative weights. JVM/Node/Go need container-aware settings (e.g., `-XX:MaxRAMPercentage`, `GOMAXPROCS`/automaxprocs, `--max-old-space-size`).

### Q66. Networking internals and troubleshooting
Check `docker network inspect`, `ip a`, `iptables -t nat -L`, `ss -lntp` (inside via `nsenter`), DNS (`getent hosts svc`), MTU mismatches (overlay/VPN), port conflicts, firewall (`ufw`/`firewalld`) interfering with Docker iptables rules, and published ports bypassing host firewall rules (Docker manipulates iptables).

### Q67. Docker and firewall pitfalls
Published ports (`-p 5432:5432`) bind to `0.0.0.0` and are reachable externally even with `ufw` rules, because Docker inserts its own iptables rules. Bind to `127.0.0.1`, use `DOCKER-USER` chain rules, or avoid publishing databases.

### Q68. Image provenance and supply-chain security *(Must-know)*
Pin base images by digest, build in trusted CI, generate SBOM + provenance (SLSA), sign (cosign), verify at deploy (Kyverno/OPA/Sigstore policy-controller), scan continuously, restrict registries, use minimal images, and rebuild regularly to pick up patches. Protect CI credentials and use OIDC for registry auth.

### Q69. Secrets handling patterns
Build-time: BuildKit secret mounts (never `ARG`/`COPY`). Runtime: orchestrator secrets (Kubernetes Secrets with KMS, Docker/Swarm secrets as files under `/run/secrets`), external managers (Vault, AWS Secrets Manager) via sidecars/init, short-lived credentials via workload identity. Avoid env vars for highly sensitive data where possible (visible via `docker inspect`, process env, crash dumps).

### Q70. Hardening profile for production containers
```bash
docker run --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges:true \
  --pids-limit 200 --memory 512m --cpus 1 --user 10001:10001 myapp:1.4.2
```
Plus custom seccomp, AppArmor profile, user namespace remap, network policies, no host mounts, and runtime detection (Falco).

### Q71. Compose for production?
Compose suits single-host deployments, small apps and dev/test. Limits: no multi-node scheduling, rolling updates and autoscaling. Options: Docker Swarm (simple orchestration), Kubernetes, Nomad, ECS/Fargate, Cloud Run. Use Compose `restart: unless-stopped`, healthchecks, resource limits and a reverse proxy (Traefik/Nginx/Caddy) when going single-host.

### Q72. Reverse proxy and TLS with Compose
```yaml
services:
  traefik:
    image: traefik:v3
    command: ["--providers.docker=true", "--entrypoints.websecure.address=:443", "--certificatesresolvers.le.acme.tlschallenge=true", "--certificatesresolvers.le.acme.email=ops@example.com", "--certificatesresolvers.le.acme.storage=/acme/acme.json"]
    ports: ["443:443"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock:ro", "acme:/acme"]
  app:
    image: myapp:1.0
    labels: ["traefik.http.routers.app.rule=Host(`app.example.com`)", "traefik.http.routers.app.tls.certresolver=le"]
volumes: { acme: {} }
```
(Socket mount noted as a risk: use a socket proxy.)

### Q73. Zero-downtime deploy on a single host
Run new version alongside old behind a proxy, wait for healthchecks, switch traffic (blue/green), drain old container. Tools: Traefik/Nginx upstream swaps, `docker rollout` plugin, `docker compose up --no-deps --scale app=2` then remove old. For real rolling updates use Kubernetes/ECS.

### Q74. Build performance tuning
Slim contexts, effective layer order, BuildKit cache mounts, parallel stages, remote/shared cache, avoid `COPY . .` before dependency install, use `--target` for test stages, and builders with more CPU/RAM. Measure with `docker buildx build --progress=plain`.

### Q75. Testing images
Container structure tests (`container-structure-test`), smoke tests in CI (`docker run` + curl), Testcontainers for integration tests, scan results as gates, Dockerfile linting (hadolint), and verifying non-root, healthchecks and image size budgets.

### Q76. Dockerfile linting & policy
Hadolint rules (pin versions, avoid `latest`, `apt-get` hygiene), Conftest/OPA policies (no root, approved bases, no `ADD` from URLs), Docker Scout policy evaluation. Run in CI and pre-commit.

### Q77. Dev containers and reproducible dev environments
`devcontainer.json` (VS Code/Codespaces) defines the IDE environment inside a container with extensions, tools and services; improves onboarding and parity. Combine with Compose for dependencies.

### Q78. Windows and macOS specifics
Docker Desktop runs Linux containers in a VM (WSL2/Hyper-V/Apple Virtualization); file sharing performance differs (VirtioFS, gRPC FUSE); Windows containers are separate (Windows base images). Apple Silicon: choose `arm64` images or emulate `amd64` (slower).

### Q79. Container storage drivers & volumes on cloud
Use cloud block storage (EBS/Persistent Disk) or managed DBs for stateful workloads instead of local volumes; snapshot and back up; avoid networked filesystems for databases unless validated. Local volumes tie data to a host.

### Q80. Logs, metrics and tracing in containers
Stdout JSON logs with trace IDs, sidecar/agent collection, Prometheus scraping `/metrics`, OTel SDK + collector, cAdvisor for container metrics, node-level metrics (node_exporter), alert on restarts/OOM/CPU throttle/disk. See `052_Monitoring-and-Observability.md`.

### Q81. Healthchecks vs readiness
Docker `HEALTHCHECK` marks container health locally; Kubernetes ignores it and uses liveness/readiness/startup probes. Design endpoints: liveness (process alive), readiness (dependencies OK/ready to serve), startup (slow boot).

### Q82. Graceful shutdown
Handle `SIGTERM`: stop accepting connections, finish in-flight work, close pools, exit within the stop timeout (`stop_grace_period` / `--stop-timeout`). Verify with `docker stop` timing; otherwise SIGKILL causes dropped requests and corrupted writes.

### Q83. Init processes and zombies
`docker run --init` (tini) or `init: true` in Compose reaps zombies and forwards signals. Needed when the app spawns children or doesn't handle PID 1 duties.

### Q84. Common base-image security pitfalls
Stale bases with known CVEs, large images with shells/package managers, `latest` tags changing unexpectedly, unmaintained community images, and typosquatted images. Prefer official/verified publishers and rebuild automatically on base updates (Renovate/Dependabot).

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Designing a container build and release pipeline *(Must-know)*
1. PR: lint (hadolint), unit tests, build with cache, scan (Trivy), SBOM, container tests.
2. Main: build multi-arch, push with immutable tags (git SHA) + semver, sign (cosign), attach provenance.
3. Deploy: GitOps updates image digest; admission policy verifies signature; progressive rollout; auto rollback on SLO regression.
4. Maintenance: scheduled rebuilds for base updates, retention policies, vulnerability dashboards with SLAs.

### Q86. Image size and startup strategy for serverless/autoscaling
Smaller images pull faster; use slim/distroless, strip debug symbols, lazy-loading (eStargz/SOCI), pre-pulled images/caches on nodes, regional registries/pull-through caches, and fast app startup (AOT/native images, avoiding heavy init).

### Q87. Rootless, user namespaces and sandboxed runtimes
For untrusted code use stronger isolation: gVisor (user-space kernel), Kata Containers/Firecracker microVMs, rootless containers, user namespace remapping, strict seccomp. Understand trade-offs: performance, syscall compatibility, operational complexity.

### Q88. Container escape risks
Privileged containers, host mounts (`/`, docker.sock), excessive capabilities (`SYS_ADMIN`), kernel vulnerabilities, misconfigured cgroups/devices. Mitigate: no privileged mode, drop caps, seccomp, patch kernels, isolate sensitive workloads on dedicated nodes, runtime detection.

### Q89. Multi-tenant build infrastructure
Isolated ephemeral builders, no shared Docker socket, per-tenant caches with access controls, resource quotas, rootless BuildKit/Kaniko, network egress policies, and registry credentials scoped per pipeline.

### Q90. Registry architecture
Private registries with replication across regions, immutable tags, retention/garbage collection, vulnerability scanning on push, RBAC and audit logs, pull-through caches, signature verification, and DR plans. Self-hosted (Harbor, Distribution) vs managed (ECR, GAR, ACR, GHCR).

### Q91. Debugging containers in production safely
Ephemeral debug containers (`kubectl debug`), read-only root filesystems with tmpfs for tools, `nsenter`/`nicolaka/netshoot` sidecars, avoiding SSH into containers, capturing diagnostics (thread dumps, `pprof`, core dumps) via controlled endpoints, and never changing running containers manually.

### Q92. Performance tuning containers
Right-size CPU/memory, avoid CPU throttling (set requests/limits thoughtfully), use `hostNetwork` rarely, tune ulimits (`nofile`), choose efficient logging, use tmpfs for temp data, avoid overlayfs for hot write paths, and profile with `perf`/eBPF tools. Align runtime flags with cgroup limits.

### Q93. Storage and databases in containers
Possible but needs care: persistent volumes, fsync-safe storage, backups, resource isolation, and operators for HA. For production most teams prefer managed databases; containers for dev/test via Testcontainers.

### Q94. Dependency and base image governance
Approved base image catalog (golden images) maintained centrally, automatic patch rebuilds, SBOM inventory, policy to block unapproved registries, deprecation of EOL OS versions, and ownership per image. Track CVE exposure by service.

### Q95. Cost optimization
Smaller images reduce transfer/storage; right-sized resources; scale-to-zero (Cloud Run/KEDA); build cache reuse; spot instances for CI; prune registries; share base layers across services to improve node cache hit rates.

### Q96. Migration from VMs to containers
Containerize stateless services first, externalize state/config, adopt CI/CD and observability, use strangler patterns, run in parallel with VMs, then move stateful components with managed services. Address licensing, kernel dependencies and legacy init scripts.

### Q97. Compose vs Kubernetes vs Nomad vs ECS decision
| Need | Choice |
|---|---|
| Local dev, single host | Compose |
| Small prod, minimal ops | Compose + proxy, or managed PaaS |
| Industry-standard orchestration | Kubernetes |
| Simpler scheduler, mixed workloads | Nomad |
| AWS-native, less ops | ECS/Fargate |
| Serverless containers | Cloud Run / Azure Container Apps |

### Q98. Observability and SLOs for containerized services
Golden signals per service, container-level saturation (CPU throttling, memory working set, restarts), node health, image pull latency, deployment success rate, mean time to rollback. Alert on symptoms (SLO burn) not just causes.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q99. Container platform strategy *(Must-know)*
Standardize on OCI images and a small set of golden bases; provide paved-road templates (Dockerfile, CI, scanning, signing); choose an orchestrator (usually managed Kubernetes or ECS/Cloud Run); enforce policy as code (admission control); centralize registry, secrets, observability; define SLOs for the platform; and treat developer experience (build time, local parity) as a metric.

### Q100. Securing the software supply chain end to end
Source integrity (branch protection, signed commits), hermetic reproducible builds, dependency pinning and scanning, SBOMs, SLSA provenance, image signing and verification at admission, registry hardening, secrets hygiene, least-privilege CI, runtime detection and rapid patch pipelines. Measure patch latency and coverage.

### Q101. Governance and compliance
Policies for approved registries, base images, non-root, resource limits and labels; evidence from CI (scan reports, SBOMs, provenance); audit logs; vulnerability SLAs by severity; exception processes with expiry; periodic reviews for SOC 2/ISO 27001/PCI requirements.

### Q102. Multi-cloud/hybrid container portability
OCI images are portable; portability limits come from storage, networking, IAM, managed services and operators. Use abstraction (Kubernetes, Terraform, Helm), avoid unnecessary lock-in, test DR across providers selectively, and weigh portability against cost and complexity.

### Q103. Developer productivity at scale
Fast local environments (dev containers, Tilt/Skaffold, Compose watch), remote build caches, shared base layers, preview environments per PR, standard CLIs/templates, and metrics (build time, cache hit rate, time-to-first-deploy).

### Q104. Evaluating Docker alternatives
Podman/Buildah (daemonless, rootless), containerd + nerdctl, Kaniko/BuildKit (CI builds), Buildpacks (secure defaults), Nix (reproducibility), Wasm runtimes (WasmEdge, Spin) for lightweight sandboxes. Consider ecosystem maturity, tooling compatibility and team skills.

### Q105. Risk register
Vulnerable/unmaintained bases, supply-chain compromise, secret leakage in layers, container escapes via privileged configs, registry outages/rate limits, disk exhaustion on build hosts, drift between environments, and single points of failure in CI builders. Mitigate via mirrors, signing, scanning, policy, capacity monitoring and DR drills.

### Q106. Communicating trade-offs
Explain isolation vs density, simplicity (Compose) vs capability (Kubernetes), build speed vs reproducibility, security hardening vs developer friction, and managed vs self-hosted costs, using metrics and incident history.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Production Dockerfile for a Node/TypeScript API
```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache tini

FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
```
`.dockerignore`: `node_modules`, `.git`, `.env*`, `dist`, `*.md`, `coverage`.

### H2. Compose stack: API + Postgres + Redis with healthchecks and watch
```yaml
services:
  api:
    build: { context: ., target: runtime }
    ports: ["127.0.0.1:3000:3000"]
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }
    restart: unless-stopped
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    mem_limit: 512m
    develop:
      watch:
        - { action: sync, path: ./src, target: /app/src }
        - { action: rebuild, path: package.json }
  db:
    image: postgres:16-alpine
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD_FILE: /run/secrets/db_pw, POSTGRES_DB: app }
    secrets: [db_pw]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U app -d app"], interval: 5s, timeout: 3s, retries: 10 }
  cache:
    image: redis:7-alpine
    command: ["redis-server", "--maxmemory", "128mb", "--maxmemory-policy", "allkeys-lru"]
secrets:
  db_pw: { file: ./secrets/db_pw.txt }
volumes: { pgdata: {} }
```

### H3. Multi-arch build and push with provenance
```bash
docker buildx create --use --name multi
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/ritesh/app:1.4.2 -t ghcr.io/ritesh/app:latest \
  --sbom=true --provenance=mode=max --push .
docker buildx imagetools inspect ghcr.io/ritesh/app:1.4.2
cosign sign --yes ghcr.io/ritesh/app@sha256:<digest>
```

### H4. Secure build-time secret usage
```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci
```
```bash
docker build --secret id=npm_token,env=NPM_TOKEN -t app .
```
The token never lands in an image layer or `history`.

### H5. CI pipeline (GitHub Actions) with scan and gate
```yaml
name: image
on: { push: { branches: [main] }, pull_request: {} }
permissions: { contents: read, packages: write, id-token: write, security-events: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: "${{ github.actor }}", password: "${{ secrets.GITHUB_TOKEN }}" }
      - uses: docker/build-push-action@v6
        with: { context: ., load: true, tags: "app:ci", cache-from: type=gha, cache-to: "type=gha,mode=max" }
      - uses: aquasecurity/trivy-action@0.28.0
        with: { image-ref: app:ci, severity: "CRITICAL,HIGH", exit-code: "1", ignore-unfixed: true }
      - if: github.ref == 'refs/heads/main'
        uses: docker/build-push-action@v6
        with: { context: ., push: true, tags: "ghcr.io/${{ github.repository }}:${{ github.sha }}", platforms: "linux/amd64,linux/arm64", cache-from: type=gha }
```

### H6. Backup and restore a volume
```bash
docker run --rm -v pgdata:/data -v "$PWD":/backup alpine tar czf /backup/pgdata-$(date +%F).tgz -C /data .
docker run --rm -v pgdata_restore:/data -v "$PWD":/backup alpine tar xzf /backup/pgdata-2025-10-24.tgz -C /data
```
For databases prefer logical backups (`pg_dump`) or snapshots taken consistently.

### H7. Debug toolkit
```bash
docker run --rm -it --network container:web nicolaka/netshoot   # share network namespace of "web"
docker run --rm -it --pid container:web --cap-add SYS_PTRACE alpine sh   # inspect processes (debug only)
docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}' web
docker events --since 10m --filter container=web
```

### H8. Image analysis
```bash
docker history --no-trunc app:1.4.2
dive app:1.4.2                 # explore layers and wasted space
trivy image app:1.4.2          # CVEs
syft app:1.4.2 -o spdx-json > sbom.json
hadolint Dockerfile
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Container exits immediately
Check `docker logs`, exit code, and entrypoint form. Common causes: foreground process missing (daemonizing), wrong CMD path, missing env/config, permission denied, architecture mismatch (`exec format error`). Run `docker run --rm -it --entrypoint sh image`.

### D2. `exec format error`
Image built for a different CPU architecture (arm64 vs amd64), or script missing a shebang / has CRLF line endings. Build multi-arch or use `--platform`, fix shebang and line endings.

### D3. Port is published but unreachable
App bound to `127.0.0.1` inside the container (must bind `0.0.0.0`), wrong container port in `-p`, firewall/security group, port already in use on host. Check `ss -lnt` inside the container and `docker port`.

### D4. Containers can't resolve each other by name
Using the default bridge network (no DNS) instead of a user-defined network; typos in service names; different Compose projects/networks; custom DNS config. Attach to the same user-defined network.

### D5. Build cache never hits
`COPY . .` before dependency install, changing files in the context (timestamps, `.git`), `ARG` changes, cold CI runners without cache export. Reorder layers, use `.dockerignore`, enable registry/GHA cache.

### D6. Image is huge
Build tools and dev dependencies included, apt caches, copying `node_modules`/`.git`, large base. Use multi-stage, slim/distroless, `.dockerignore`, clean in the same `RUN`.

### D7. Permission denied on volume/bind mount
UID/GID mismatch, SELinux labels, read-only mounts, Docker Desktop file sharing settings. Match user IDs, use `:z/:Z`, chown at build, or run with `--user`.

### D8. OOMKilled (exit 137)
Memory limit too low or leak; JVM/Node unaware of cgroup limits. Raise limit, set runtime memory flags, profile memory, check `dmesg`/`docker inspect`.

### D9. Slow builds on CI
No cache, large context, serial steps, network-bound installs. Use BuildKit cache mounts, registry cache, smaller context, parallel stages, faster runners.

### D10. Disk full on Docker host
Accumulated images, build cache, logs without rotation, volumes. `docker system df`, prune build cache, set log rotation, monitor `/var/lib/docker`.

### D11. "Cannot connect to the Docker daemon"
Daemon not running, user not in `docker` group, wrong `DOCKER_HOST`/context, rootless socket path. Start the service, check permissions and context.

### D12. Time and locale differences
Containers use UTC by default; set `TZ` and install tzdata; ensure locale packages for apps needing them.

### D13. Compose `depends_on` doesn't wait
It only orders start. Add healthchecks with `condition: service_healthy` or retry logic in the app.

### D14. Zombie processes / slow stop
App not PID 1 aware; `docker stop` waits 10 s then SIGKILL. Use exec form, handle SIGTERM, add `init: true`.

### D15. Secrets leaked in image
Found via `docker history` or layer inspection. Rotate secrets immediately, rebuild with BuildKit secret mounts, add secret scanning to CI.

---

# 🧩 Part 8: Tricky Questions

### T1. Is a container a lightweight VM?
No. It's an isolated process on the host kernel; there is no guest kernel, which explains speed and weaker isolation.

### T2. Does `EXPOSE` open a port?
No, it only documents it. Publishing requires `-p`/`-P`.

### T3. Do containers persist data after removal?
Writable-layer data is lost on removal. Data in named volumes persists until the volume is deleted.

### T4. Does `docker stop` kill instantly?
It sends SIGTERM, waits (default 10 s), then SIGKILL.

### T5. Are environment variables secure for secrets?
They are visible via `docker inspect`, `/proc`, and logs/crash dumps. Better than baking in images, but prefer secret managers/files with tight permissions.

### T6. Can two containers share a volume safely?
Yes mechanically, but concurrent writers need application-level coordination (databases must not share data files).

### T7. Does deleting a file in a later layer shrink the image?
No. Earlier layers still contain it; delete in the same `RUN` or use multi-stage.

### T8. Is `latest` the newest version?
It's just a tag; it may be stale or moved arbitrarily.

### T9. Does Alpine always make images better?
Smaller, but musl libc causes compatibility/performance issues (DNS, glibc-only binaries, Python wheels). Slim Debian is often safer.

### T10. Can containers run different OS kernels?
No; they share the host kernel (Linux containers on Linux kernel). Docker Desktop uses a Linux VM on macOS/Windows.

### T11. Is `--privileged` just more permissions?
It disables most isolation (all devices, capabilities, no seccomp); effectively root on the host.

### T12. `CMD` in shell form vs exec form?
Shell form wraps in `/bin/sh -c`, so the app isn't PID 1 and may miss signals; exec form runs directly.

### T13. Does Docker Compose manage multi-host clusters?
No; Compose targets a single Docker host. Use Swarm, Kubernetes or others for clusters.

### T14. Why might container CPU limits hurt latency even with free cores?
CFS quota throttling pauses processes when they exceed their quota within a period, causing latency spikes.

### T15. Can I rely on image tags for immutability?
No; tags can be re-pushed. Use digests or immutable tag settings in the registry.

### T16. Is Docker rootless fully equivalent?
Mostly, but with limits (privileged ports, some networking modes, performance overhead).

### T17. Does `COPY` respect `.gitignore`?
No, only `.dockerignore`.

### T18. Are containers secure by default?
They offer isolation but share a kernel; security depends on configuration (non-root, caps, seccomp, patching).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Image vs container?** Template vs running instance.
- **Build image?** `docker build -t name .`
- **Run detached?** `docker run -d`.
- **Publish port?** `-p host:container`.
- **Shell into container?** `docker exec -it c sh`.
- **Persist data?** Volumes.
- **Multi-container local?** Docker Compose.
- **Smaller images?** Multi-stage + slim/distroless.
- **Avoid root?** `USER` non-root.
- **Signals-friendly form?** Exec form `CMD ["..."]`.
- **Build secrets?** BuildKit `--mount=type=secret`.
- **Cache mounts?** `--mount=type=cache`.
- **Multi-arch?** `buildx --platform`.
- **Scan images?** Trivy / Scout / Grype.
- **Sign images?** cosign.
- **SBOM tool?** Syft.
- **Lint Dockerfile?** hadolint.
- **Explore layers?** dive.
- **Exit 137?** SIGKILL, often OOM.
- **Container runtime?** containerd + runc.
- **Isolation primitives?** Namespaces + cgroups.
- **Filesystem driver?** overlay2.
- **Rootless alternative?** Podman.
- **Orchestrator?** Kubernetes.
- **Log driver default?** json-file.
- **Cleanup?** `docker system prune`.
- **Immutable reference?** Digest.
- **Zombie reaper?** `--init` / tini.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about how you containerized an application.
STAR: "I containerized a Node/Postgres monolith and 5 services: multi-stage Dockerfiles with non-root users and tini, Compose for local dev with healthchecks and watch mode, and a GitHub Actions pipeline that builds multi-arch images, scans with Trivy, generates SBOMs and signs with cosign. Image sizes dropped from 1.1 GB to 140 MB, builds from 9 min to 2.5 min with cache, and onboarding went from a day to 15 minutes."

### P2. Describe a production container incident.
"A service was OOM-killed repeatedly because the JVM ignored cgroup limits. I found exit 137 and OOMKilled in `docker inspect`, set `-XX:MaxRAMPercentage=70`, raised the limit based on profiling, added memory alerts and a load test in CI. Restarts dropped to zero."

### P3. How do you secure containers?
"Minimal pinned bases, non-root, dropped capabilities, read-only filesystems, no docker.sock, BuildKit secrets, Trivy gates, SBOM + signing with admission verification, and regular base rebuilds."

### P4. How do you speed up builds?
"Layer ordering, `.dockerignore`, BuildKit cache mounts, registry cache in CI, parallel stages, smaller bases, and measuring with `--progress=plain`."

### P5. Docker vs Kubernetes: when to use which?
"Docker/Compose for dev and small single-host deployments; Kubernetes (or ECS/Cloud Run) when I need scaling, rolling updates, self-healing and multi-node scheduling."

### P6. How do you manage image versions?
"Immutable tags with git SHA, semantic version tags on releases, digest pinning in deployments, retention policies, and automated base-image updates through Renovate."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** containers vs VMs, images, layers, registries, lifecycle, commands.
- **Dockerfile:** instructions, CMD vs ENTRYPOINT, multi-stage builds, caching, `.dockerignore`, BuildKit features, base image choice.
- **Runtime:** networking (bridge/host/overlay), volumes/bind mounts/tmpfs, resource limits, healthchecks, logging, restart policies, init/PID 1.
- **Compose:** services, networks, volumes, profiles, watch, healthchecks, secrets.
- **Security:** non-root, capabilities, seccomp/AppArmor, rootless, scanning, SBOM, signing, secrets, docker.sock risks, supply chain.
- **Internals:** namespaces, cgroups, overlayfs, containerd/runc, OCI specs.
- **Operations:** CI/CD, multi-arch, registries, cost, observability, debugging, disk management.
- **Leadership:** platform strategy, governance, alternatives (Podman, Buildpacks, Wasm), risk.

## Mixed topics
- Docker + Kubernetes (`046_Kubernetes.md`) and CI/CD (`047_CI-CD-and-DevOps.md`).
- Docker + monitoring (`052_Monitoring-and-Observability.md`) and IaC (`051_Terraform-and-IaC.md`).
- Docker + cloud (`048_AWS.md`, `049_Azure.md`, `050_GCP.md`): ECS/Fargate, ACI/Container Apps, Cloud Run, registries.
- Docker + backend/microservices (`../03_Backend/039_Microservices.md`) and databases (`../04_Database/`).
- Docker + testing (`../06_Testing/040_Testing.md`): Testcontainers, E2E environments.
- Docker + security (`../03_Backend/036_Authentication-and-Security.md`).

---

# 🔬 Part 12: Container Internals

### I1. What `docker run` does
CLI calls the daemon API → pulls the image if missing → containerd unpacks layers into a snapshot (overlayfs) → creates an OCI bundle (`config.json`) → runc sets up namespaces, cgroups, mounts, capabilities and seccomp → execs the entrypoint as PID 1 in the new PID namespace → networking is wired (veth into a bridge) and logs attached.

### I2. Namespaces
`clone()/unshare()` flags: `CLONE_NEWPID` (own PID tree), `NEWNET` (own interfaces), `NEWNS` (mounts), `NEWUTS` (hostname), `NEWIPC`, `NEWUSER` (UID mapping), `NEWCGROUP`. Inspect via `/proc/<pid>/ns` and `lsns`; enter with `nsenter`.

### I3. cgroups v2
Unified hierarchy at `/sys/fs/cgroup`; controllers `cpu`, `memory`, `io`, `pids`; `memory.max`, `memory.high`, `cpu.max` (quota/period), `cpu.weight`. Docker/containerd create a cgroup per container; PSI metrics expose pressure.

### I4. Image format
Manifest → config JSON (env, cmd, history, diff_ids) → ordered layer tarballs addressed by content digest. Layers are content-addressable and shared across images. Manifest lists/OCI indexes map platforms to manifests.

### I5. Union filesystems
overlayfs merges `lowerdir` (read-only layers), `upperdir` (container layer) and `workdir` into a `merged` view; whiteout files mark deletions. Other drivers: btrfs, zfs, fuse-overlayfs (rootless).

### I6. Container networking plumbing
Per-container NET namespace with `eth0` veth peer attached to a bridge; iptables/nftables NAT (MASQUERADE out, DNAT for published ports); embedded DNS at 127.0.0.11; conntrack tracks flows. Overlay uses VXLAN with a key-value/gossip control plane.

### I7. Seccomp, capabilities and LSMs
Default seccomp profile blocks ~40-50 risky syscalls; capabilities default to a reduced set (e.g., `CHOWN`, `NET_BIND_SERVICE`, not `SYS_ADMIN`); AppArmor/SELinux add mandatory access control. `no-new-privileges` prevents setuid escalation.

### I8. Build internals (BuildKit)
Frontend parses the Dockerfile into LLB (low-level build graph); solver executes vertices in parallel with content-addressed caching; exporters produce images/OCI tarballs; supports remote caches and attestations.

### I9. Registry protocol
Distribution API: `GET /v2/<name>/manifests/<ref>`, blobs by digest (`/blobs/sha256:...`), chunked uploads, tag listing; authentication via bearer tokens; content trust via signatures/attestations stored as OCI artifacts.

---

# 📊 Part 13: Reference Tables

### VM vs container vs serverless
| | VM | Container | Serverless function |
|---|---|---|---|
| Unit | OS instance | Process with dependencies | Code snippet |
| Startup | Minutes | Seconds | ms–s (cold start) |
| Control | Full OS | App + deps | Code only |
| Isolation | Strong | Medium | Provider-managed |

### Network drivers
| Driver | Scope | Use |
|---|---|---|
| bridge | Single host | Default, user-defined for DNS |
| host | Single host | Max performance, no isolation |
| none | Single host | No networking |
| overlay | Multi-host | Swarm/clusters |
| macvlan | Single host | Container with its own MAC/IP on LAN |

### Storage types
| Type | Persistence | Performance | Use |
|---|---|---|---|
| Volume | Yes | Good | DB data |
| Bind mount | Host files | Host FS | Dev, configs |
| tmpfs | No | RAM-fast | Temp/secret scratch |
| Container layer | No | CoW overhead | Ephemeral writes |

### Base images
| Base | Size | Pros | Cons |
|---|---|---|---|
| scratch | ~0 | Minimal | Static binaries only |
| distroless | Small | Few CVEs, no shell | Harder debugging |
| alpine | Small | Tiny | musl quirks |
| debian-slim | Medium | glibc compat | Larger |
| ubuntu | Larger | Familiar | More packages/CVEs |

### Common flags
| Flag | Purpose |
|---|---|
| `-d` | Detached |
| `-it` | Interactive TTY |
| `--rm` | Remove on exit |
| `-p` | Publish port |
| `-v` | Mount |
| `-e` / `--env-file` | Env vars |
| `--network` | Attach network |
| `--memory` / `--cpus` | Limits |
| `--read-only` | Read-only root FS |
| `--init` | Add init process |
| `--restart` | Restart policy |

### Version highlights (verify)
| Item | Notes |
|---|---|
| BuildKit | Default builder since Docker 23 |
| Compose v2 | `docker compose`; v1 retired |
| Docker Scout | Integrated vulnerability/policy analysis |
| `compose watch` | File sync/rebuild for dev |
| containerd image store | Default in newer Docker versions on fresh installs |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```bash
docker run --rm alpine echo hi
docker ps -a
```
**Result:** prints `hi`; the container is removed (`--rm`), so `ps -a` doesn't list it.

### O2.
Dockerfile: `COPY . .` then `RUN npm ci`, edit one source file, rebuild.
**Result:** cache miss at `COPY` invalidates `npm ci`, so dependencies reinstall every build; copy `package*.json` first.

### O3.
`CMD ["node","app.js"]` vs `CMD node app.js` and `docker stop`.
**Result:** exec form receives SIGTERM directly; shell form may not forward it, waiting 10 s then SIGKILL.

### O4.
```bash
docker run -d -p 8080:3000 app   # app listens on 127.0.0.1:3000 inside
```
**Result:** host connection resets: the app must bind `0.0.0.0` inside the container.

### O5.
`docker run -v mydata:/data alpine sh -c "echo a > /data/f"` then run again with the same volume.
**Output:** file `f` persists across runs.

### O6.
Container with `--memory 256m` allocates 400 MB.
**Result:** OOM-killed, exit code 137, `OOMKilled=true`.

### O7.
```dockerfile
RUN echo secret > /tmp/s
RUN rm /tmp/s
```
**Result:** the secret remains recoverable from the first layer.

### O8.
Two containers on the default bridge ping each other by name.
**Result:** fails (no DNS on default bridge); works on a user-defined network.

### O9.
`docker compose down -v`.
**Result:** removes containers, networks and named volumes defined in the file (data loss).

### O10.
`FROM node:22-alpine` built on Apple Silicon, deployed to x86.
**Result:** `exec format error` unless built multi-arch or with `--platform linux/amd64`.

### O11.
`docker run --cpus 0.5 app` running a CPU-bound task.
**Result:** process is throttled to ~50% of one CPU, increasing latency but not killed.

### O12.
`HEALTHCHECK` failing three times.
**Result:** container status `unhealthy` (Docker doesn't restart it automatically unless an orchestrator/policy acts on it).

---

# ✅ Part 15: MCQs

**1. A Docker image is:**
A) A running process  B) A read-only layered template  C) A VM  D) A network
**Answer: B**

**2. Which instruction defines default arguments that can be overridden?**
A) ENTRYPOINT  B) CMD  C) RUN  D) EXPOSE
**Answer: B**

**3. Persistent data should be stored in:**
A) The container's writable layer  B) Volumes  C) ENV variables  D) Image layers
**Answer: B**

**4. Multi-stage builds mainly help to:**
A) Run multiple containers  B) Produce smaller, cleaner final images  C) Speed up pulls only  D) Encrypt images
**Answer: B**

**5. Exit code 137 usually means:**
A) Success  B) SIGKILL (often OOM)  C) Syntax error  D) Segfault
**Answer: B**

**6. Container isolation relies on:**
A) Hypervisors  B) Namespaces and cgroups  C) BIOS  D) Firewalls only
**Answer: B**

**7. Best practice for secrets at build time:**
A) ARG  B) ENV  C) BuildKit secret mounts  D) COPY .env
**Answer: C**

**8. `docker compose` is intended for:**
A) Multi-host orchestration  B) Defining and running multi-container apps (typically single host)  C) Building kernels  D) Scanning images
**Answer: B**

**9. Which is immutable?**
A) Tag  B) Digest  C) `latest`  D) Container name
**Answer: B**

**10. To let containers resolve each other by name use:**
A) Default bridge  B) User-defined network  C) Host IP only  D) `EXPOSE`
**Answer: B**

**11. Mounting `docker.sock` into a container is:**
A) Safe  B) Equivalent to giving root control of the host  C) Required  D) Read-only always
**Answer: B**

**12. The OCI runtime used by Docker is:**
A) runc  B) systemd  C) kubelet  D) nginx
**Answer: A**

**13. `.dockerignore` affects:**
A) Runtime mounts  B) Build context  C) Network rules  D) Registry
**Answer: B**

**14. Which base typically has the fewest packages/CVEs?**
A) ubuntu  B) debian  C) distroless  D) fedora
**Answer: C**

**15. `--init` adds:**
A) A VPN  B) A tiny init process to forward signals and reap zombies  C) A database  D) TLS
**Answer: B**

**16. To publish a port only on localhost:**
A) `-p 8080:80`  B) `-p 127.0.0.1:8080:80`  C) `EXPOSE 8080`  D) `--network host`
**Answer: B**

**17. Which tool signs container images?**
A) cosign  B) Syft  C) hadolint  D) dive
**Answer: A**

**18. Layer ordering for cache efficiency: put**
A) Frequently changing steps first  B) Rarely changing steps first  C) Random order  D) COPY . . first
**Answer: B**

**19. Which statement about `EXPOSE` is true?**
A) Publishes the port  B) Documents the port  C) Opens firewall  D) Maps to host automatically
**Answer: B**

**20. Docker Desktop on macOS runs containers:**
A) Natively on macOS  B) Inside a Linux VM  C) In Safari  D) On Windows kernel
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Running as root** and using `--privileged`.
2. **Using `latest`** and unpinned dependencies.
3. **Baking secrets** into layers, ARG/ENV or images.
4. **`COPY . .` before dependency install** (cache busting).
5. **No `.dockerignore`** (huge context, leaked files).
6. **Shell-form CMD** so signals aren't delivered.
7. **Storing state in containers** instead of volumes/managed services.
8. **No resource limits or healthchecks.**
9. **Mounting docker.sock** or host root into containers.
10. **Publishing databases publicly** (`0.0.0.0` bindings bypassing host firewall).
11. **Ignoring log rotation** and disk usage.
12. **Huge images** with compilers and dev dependencies.
13. **Alpine without testing musl compatibility.**
14. **Assuming `depends_on` waits for readiness.**
15. **Not scanning/patching base images** regularly.
16. **Building on Apple Silicon but deploying x86** without multi-arch.
17. **Editing running containers manually** (drift).
18. **Using `docker commit` for production images.**
19. **Relying on Docker Hub anonymously** (rate limits) without mirrors.
20. **One giant container running many processes** without a supervisor strategy.
21. **Ignoring JVM/Node memory settings** versus cgroup limits.
22. **Not testing graceful shutdown.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain containers as **namespaces + cgroups + layered filesystems**, not "light VMs".
- You write **small, cache-friendly, non-root, multi-stage Dockerfiles** with healthchecks and proper signal handling.
- You manage **secrets, SBOMs, signing and scanning** as part of a supply-chain strategy.
- You tune **networking, volumes, resources and logging** for reliability and diagnose OOM/throttling issues.
- You design **CI pipelines** with BuildKit caching, multi-arch builds and gated promotion.
- You know **when Compose is enough** and when to move to Kubernetes/ECS/Cloud Run.
- You debug with **inspect, events, nsenter/netshoot and layer analysis** instead of guessing.
- You govern **base images and registries** with automation and policy.
- You discuss **security trade-offs** (rootless, gVisor/Kata, seccomp) realistically.
- You back claims with metrics (image size, build time, restart rate).

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core commands
```
docker build -t app:1.0 .        docker run -d --name app -p 8080:3000 app:1.0
docker ps -a | logs -f | exec -it app sh | stop | rm | inspect | stats
docker compose up -d | down [-v] | logs -f | exec | config
docker buildx build --platform linux/amd64,linux/arm64 --push -t repo/app:tag .
docker system df | prune | builder prune
```

### Dockerfile checklist
Pinned slim base • multi-stage • manifests copied first • `.dockerignore` • non-root `USER` • exec-form `CMD` • `HEALTHCHECK` • no secrets in layers • cache mounts • labels/SBOM/provenance • read-only compatible.

### Runtime checklist
Limits (`--memory/--cpus/--pids-limit`) • `--cap-drop ALL` • `no-new-privileges` • read-only FS + tmpfs • user-defined network • bind ports to localhost where possible • log rotation • restart policy • graceful shutdown • `--init`.

### Security pipeline
hadolint → build → Trivy/Scout scan → SBOM → sign (cosign) → push by digest → admission verification → runtime detection → scheduled rebuilds.

### Interview strategy
1. Clarify the app, environments, scale and security requirements.
2. Show a clean Dockerfile and explain caching/size/security choices.
3. Explain networking, storage and configuration/secrets handling.
4. Cover CI/CD (cache, multi-arch, scanning, signing) and deployment target.
5. Discuss debugging and failure modes (OOM, signals, disk).
6. Close with metrics (image size, build time, incidents avoided).

### Final checklist before the interview
- [ ] Explain containers vs VMs and the Linux primitives involved.
- [ ] Write a multi-stage, non-root, cache-friendly Dockerfile.
- [ ] Explain CMD vs ENTRYPOINT, exec vs shell form, PID 1 and signals.
- [ ] Choose volumes/bind mounts/tmpfs and configure networking correctly.
- [ ] Use Compose with healthchecks, profiles and secrets.
- [ ] Apply image/runtime hardening, scanning, SBOM and signing.
- [ ] Optimize builds (BuildKit cache, registry cache, multi-arch).
- [ ] Debug exits, OOM kills, network and permission issues.
- [ ] Decide between Compose, Kubernetes and managed container services.
- [ ] Prepare a containerization story, an incident story and a security story with numbers.
