# Microsoft Azure Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets current Azure services as of 2025: **Microsoft Entra ID (formerly Azure AD), Azure RBAC, Management Groups/Subscriptions/Resource Groups, Virtual Network, VMs/VMSS, App Service, Azure Functions, Container Apps, AKS, ACR, Blob/Files/Disk Storage, Azure SQL / SQL Managed Instance / PostgreSQL & MySQL Flexible Server, Cosmos DB, Redis, Service Bus, Event Grid, Event Hubs, API Management, Front Door, Application Gateway, Load Balancer, DNS, Key Vault, Monitor / Log Analytics / Application Insights, Defender for Cloud, Policy, Bicep / ARM / Terraform, Azure DevOps and GitHub Actions**, and the **Azure Well-Architected Framework / Cloud Adoption Framework**. Names, SKUs, limits and pricing change often: anything marked "verify" should be checked in the official docs (learn.microsoft.com/azure) for your region. Examples use the sample name **Ritesh Kumar** and the Central India region (`centralindia`).
> This file covers cloud fundamentals, Entra ID and RBAC, governance (management groups, Policy, Blueprints/landing zones), networking (VNets, NSGs, peering, VPN/ExpressRoute, Private Link, Front Door/App Gateway), compute (VMs, App Service, Functions, Container Apps, AKS), storage, databases, messaging and integration, observability, security (Key Vault, Defender, managed identities), IaC (Bicep/ARM/Terraform), CI/CD, HA/DR (availability zones, paired regions, Site Recovery, Backup), cost management, migration and architecture scenarios. Related topics: AWS in `048_AWS.md`, GCP in `050_GCP.md`, Docker/Kubernetes in `045_Docker.md`/`046_Kubernetes.md`, CI/CD in `047_CI-CD-and-DevOps.md`, IaC in `051_Terraform-and-IaC.md`, monitoring in `052_Monitoring-and-Observability.md`, .NET in `../03_Backend/019_DotNet.md`.

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
- [Part 12: Azure Internals](#-part-12-azure-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Azure? *(Must-know)*
Microsoft's cloud platform offering IaaS, PaaS, SaaS and serverless services across a global network of regions. Strong in enterprise/hybrid scenarios (Windows Server, Active Directory/Entra, SQL Server, .NET, Microsoft 365 integration) and also fully supports Linux, open source and Kubernetes.

### Q2. Regions, availability zones and paired regions *(Must-know)*
A **region** is a set of datacenters in a geography (e.g., Central India). **Availability Zones** are physically separate zones inside a region (power/cooling/network), usually 3. **Region pairs** (e.g., Central India ↔ South India) provide sequenced updates and geo-redundant replication priority. Use zone-redundant services for HA and paired/other regions for DR.

### Q3. Azure resource hierarchy *(Must-know)*
Tenant (Entra ID) → **Management Groups** → **Subscriptions** → **Resource Groups** → **Resources**. RBAC, Policy and budgets inherit down the hierarchy. Resource groups are lifecycle containers (deploy/delete together) and metadata locations; a resource belongs to exactly one group.

### Q4. Microsoft Entra ID vs Azure RBAC
Entra ID is the identity provider (users, groups, apps, MFA, Conditional Access). **Azure RBAC** controls access to Azure resources via role assignments (security principal + role definition + scope). Entra directory roles (Global Admin) are separate from Azure roles (Owner, Contributor, Reader).

### Q5. Built-in roles
**Owner** (full + assign roles), **Contributor** (manage resources, can't assign roles), **Reader**, **User Access Administrator**, plus service-specific roles (Storage Blob Data Contributor, Key Vault Secrets User, AcrPull). Prefer built-in or custom roles with least privilege at the narrowest scope.

### Q6. Managed identities *(Must-know)*
Automatically managed Entra identities for Azure resources (system-assigned tied to a resource; user-assigned reusable). Apps get tokens without secrets to access Key Vault, Storage, SQL, etc.
```csharp
var credential = new DefaultAzureCredential();   // uses managed identity in Azure, dev login locally
var client = new SecretClient(new Uri("https://myvault.vault.azure.net/"), credential);
```

### Q7. Virtual Machines basics
Choose image, size (series: B burstable, D general, E memory, F compute, N GPU), disks (managed disks: Premium SSD v2, Premium SSD, Standard SSD/HDD, Ultra), VNet/NSG, availability options (zones, availability sets, VMSS). Billing per second; stop (deallocate) to stop compute charges.

### Q8. Azure Virtual Network (VNet)
Private network with address space and subnets, NSGs, route tables (UDRs), service endpoints, Private Endpoints, peering, VPN/ExpressRoute. VNets are regional; subnets span zones. Azure reserves 5 IPs per subnet.

### Q9. NSG vs Azure Firewall vs ASG
NSGs: stateful L3/L4 allow/deny rules on subnets/NICs (priority-ordered). Application Security Groups: group VMs logically for NSG rules. Azure Firewall: managed L3-L7 firewall with FQDN/threat intel/TLS inspection (Premium). WAF protects web apps on App Gateway/Front Door.

### Q10. Load balancing options *(Must-know)*
| Service | Layer | Scope | Use |
|---|---|---|---|
| Load Balancer | L4 | Regional | TCP/UDP, zone-redundant |
| Application Gateway | L7 | Regional | HTTP routing, WAF, SSL offload |
| Front Door | L7 | Global | Global routing, CDN, WAF, failover |
| Traffic Manager | DNS | Global | DNS-based routing |

### Q11. Storage accounts
Blob (objects; hot/cool/cold/archive tiers), Files (SMB/NFS), Queue, Table, Data Lake Gen2 (hierarchical namespace). Redundancy: LRS, ZRS, GRS, GZRS (+RA read access). Security: Entra auth/RBAC, SAS tokens, private endpoints, encryption (Microsoft- or customer-managed keys), soft delete, versioning, immutability.

### Q12. Azure App Service
PaaS for web apps/APIs (.NET, Node, Python, Java, PHP, containers): plans (SKU) define compute, deployment slots (staging/swap), autoscale, custom domains/TLS, VNet integration, managed identity, easy CI/CD. One App Service Plan hosts multiple apps.

### Q13. Azure Functions
Serverless event-driven code: triggers (HTTP, Timer, Blob, Queue, Service Bus, Event Hubs, Cosmos DB), bindings, hosting plans (Consumption, Flex Consumption, Premium, Dedicated), Durable Functions for orchestration. Watch cold starts and timeouts.
```csharp
[Function("Hello")]
public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req) => new OkObjectResult("Hello Ritesh Kumar");
```

### Q14. Azure Container Apps vs AKS vs ACI
Container Apps: serverless containers (KEDA/Dapr, scale to zero) without managing Kubernetes. AKS: managed Kubernetes. ACI: single containers quickly, no orchestration. ACR stores images.

### Q15. Azure SQL options
Azure SQL Database (single/elastic pools, serverless), SQL Managed Instance (near 100% SQL Server compatibility), SQL on VMs (full control). Features: automated backups + PITR, geo-replication, failover groups, Hyperscale, Entra auth.

### Q16. Cosmos DB basics
Globally distributed multi-model NoSQL (NoSQL/Mongo/Cassandra/Gremlin/Table APIs). Concepts: partition key, RU/s (provisioned, autoscale, serverless), five consistency levels (strong, bounded staleness, session, consistent prefix, eventual), multi-region writes, change feed.

### Q17. Messaging services
Service Bus (enterprise queues/topics, sessions, DLQ, transactions), Storage Queues (simple), Event Grid (event routing, reactive), Event Hubs (high-throughput streaming, Kafka-compatible). See `../03_Backend/038_Message-Queues.md`.

### Q18. Azure Key Vault
Stores secrets, keys, certificates with RBAC or access policies, soft delete + purge protection, HSM-backed Premium tier, rotation policies, private endpoints. Apps read via managed identity; reference from App Service/Functions with Key Vault references.

### Q19. Azure Monitor stack
Metrics, Log Analytics workspaces (KQL), Application Insights (APM, distributed tracing, availability tests), alerts (metric/log/activity), Action Groups, Workbooks, Container Insights, Diagnostic settings to route logs. Activity Log records control-plane operations.

### Q20. Azure Policy and governance
Policy definitions/initiatives (deny, audit, modify, deployIfNotExists) assigned at management group/subscription/RG scopes for compliance (allowed regions/SKUs, required tags, encryption). Resource locks (CanNotDelete, ReadOnly) prevent accidents. Blueprints are deprecated in favor of Template Specs, Deployment Stacks and landing zone accelerators (verify).

### Q21. Infrastructure as Code on Azure
ARM templates (JSON), **Bicep** (concise DSL compiling to ARM), Terraform (azurerm/azapi), Pulumi. Bicep is first-party with day-0 resource support and `what-if`.
```bicep
param location string = resourceGroup().location
resource sa 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'stritesh${uniqueString(resourceGroup().id)}'
  location: location
  sku: { name: 'Standard_ZRS' }
  kind: 'StorageV2'
  properties: { minimumTlsVersion: 'TLS1_2', allowBlobPublicAccess: false, supportsHttpsTrafficOnly: true }
}
```

### Q22. Azure CLI and PowerShell
```bash
az login
az account set --subscription "Prod"
az group create -n rg-app -l centralindia
az vm list -o table
az webapp up --name ritesh-app --runtime "NODE:22-lts"
az role assignment create --assignee <objectId> --role "Storage Blob Data Reader" --scope <storageId>
```
Use `--query` (JMESPath) and `-o table|json|tsv`.

### Q23. Azure DevOps and GitHub Actions
Azure DevOps: Boards, Repos, Pipelines (YAML), Artifacts, Test Plans. GitHub Actions with OIDC to Azure (federated credentials) is common. Service connections should use workload identity federation, not stored secrets. See `047_CI-CD-and-DevOps.md`.

### Q24. Pricing models
Pay-as-you-go, Reservations (1/3-year), Savings Plans for compute, Spot VMs, Azure Hybrid Benefit (reuse Windows/SQL licenses), Dev/Test pricing. Cost Management + Budgets, tags, advisor recommendations. Egress and inter-region transfer cost money.

### Q25. Well-Architected Framework pillars
Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency. Use Azure Advisor and Well-Architected Review assessments. The Cloud Adoption Framework covers strategy, plan, ready (landing zone), adopt, govern, manage.

### Q26. Availability sets vs zones vs VMSS
Availability sets distribute VMs across fault/update domains in one datacenter (legacy approach); Availability Zones give datacenter-level isolation (higher SLA); Virtual Machine Scale Sets add autoscaling and instance management across zones.

### Q27. SLAs and composite availability
Each service has an SLA (e.g., VM across zones 99.99%). Composite SLA = product of dependent services' SLAs (serial dependencies reduce availability); redundancy raises it. Design with failure domains in mind.

### Q28. Azure CDN / Front Door
Front Door (Standard/Premium) provides global anycast entry, CDN caching, WAF, rules engine, private origins, health probes and failover. Classic CDN products are being retired/migrated (verify).

### Q29. DNS and domains
Azure DNS (public and private zones), Private DNS zones linked to VNets for Private Endpoints, Traffic Manager for DNS routing, custom domains with managed certificates on App Service/Front Door.

### Q30. Hybrid basics
VPN Gateway (site-to-site/point-to-site), ExpressRoute (private dedicated connectivity), Azure Arc (manage on-prem/multi-cloud resources), Azure Stack HCI, Entra Connect (sync on-prem AD), Hybrid Benefit.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. RBAC deep dive *(Must-know)*
Role assignment = principal + role + scope; permissions are additive; **deny assignments** (managed by Azure/Blueprints) are rare; actions vs `dataActions` (control plane vs data plane, e.g., `Microsoft.Storage/.../blobs/read`). Use groups for assignment, Privileged Identity Management (PIM) for just-in-time elevation, and Access Reviews.

### Q32. Conditional Access & MFA
Entra Conditional Access policies evaluate signals (user, device compliance, location, risk) to require MFA, block legacy auth, or require compliant devices. Use security defaults or CA, phishing-resistant methods (FIDO2/passkeys), break-glass accounts excluded and monitored.

### Q33. Service principals vs managed identities
Service principals are app identities with secrets/certs (manage rotation); managed identities remove credential handling. For CI/CD use **workload identity federation** (OIDC) instead of client secrets. Grant least privilege roles on specific scopes.

### Q34. VNet design *(Must-know)*
Plan non-overlapping CIDRs, subnets per tier (app, data, private endpoints, AzureFirewallSubnet, GatewaySubnet, AzureBastionSubnet), hub-and-spoke topology with a hub VNet (firewall, gateways, DNS) peered to spokes, NSGs per subnet, UDRs forcing egress through the firewall. Virtual WAN for large-scale branch connectivity.

### Q35. Private Endpoint vs Service Endpoint *(Must-know)*
Service Endpoints extend VNet identity to a service's public endpoint (still public IP). **Private Endpoints** give the PaaS resource a private IP in your VNet via Private Link (disable public access; requires Private DNS zones like `privatelink.blob.core.windows.net`). Prefer Private Endpoints for isolation.

### Q36. VNet peering and transitive routing
Peering is non-transitive; use hub with Azure Firewall/NVA + UDRs, or Virtual WAN/Route Server for transit. Global peering across regions has data transfer charges. Gateway transit lets spokes use the hub's VPN/ExpressRoute gateway.

### Q37. Azure Bastion & secure VM access
Browser-based RDP/SSH over TLS without public IPs; or JIT access via Defender for Cloud, Entra login for Linux/Windows VMs, serial console for emergencies. Avoid exposing 22/3389.

### Q38. VM management at scale
VMSS with Flexible orchestration, custom images via Azure Compute Gallery/Image Builder, Update Manager for patching, Azure Automanage, Run Command, Custom Script Extension/cloud-init, boot diagnostics, backups (Azure Backup), Site Recovery for DR.

### Q39. App Service deep dive
Plans (Free/Basic/Standard/Premium v3/Isolated v2), scale up (SKU) vs scale out (instances), autoscale rules, deployment slots with swap (warm-up) and slot settings, health checks, always-on, Easy Auth (Entra), VNet integration (outbound) vs Private Endpoint (inbound), Key Vault references, WebJobs.

### Q40. Functions hosting & scaling
Consumption/Flex: scale to zero with cold starts; Premium: pre-warmed instances + VNet; Dedicated: App Service plan. Scale controller adds instances based on trigger load (queue length). Concurrency settings, host.json, retries/poison handling (Service Bus DLQ), Durable Functions patterns (chaining, fan-out/fan-in, human interaction).

### Q41. Container Apps
Environment (VNet-integrated), apps with revisions (traffic splitting), KEDA scale rules (HTTP, queue, cron), Dapr sidecars, jobs, managed identity, ingress, secrets. Good middle ground between App Service and AKS.

### Q42. AKS essentials on Azure
Managed control plane (free/Standard/Premium tier SLA), node pools (system/user, spot), CNI options (Azure CNI, Overlay, kubenet legacy), Entra integration, workload identity, Azure Policy for Kubernetes, ACR integration, Application Gateway for Containers/Ingress, cluster autoscaler/KEDA/Karpenter (NAP), upgrade channels. See `046_Kubernetes.md`.

### Q43. ACR (Azure Container Registry)
SKUs (Basic/Standard/Premium), geo-replication, private link, content trust, vulnerability scanning via Defender, tasks for builds, retention policies. Use managed identity/AcrPull for pulls.

### Q44. Storage redundancy and performance
LRS (3 copies in one DC), ZRS (3 zones), GRS (to paired region), GZRS; RA variants for read access to secondary. Performance tiers (Standard vs Premium), access tiers (hot/cool/cold/archive) with lifecycle management policies; hierarchical namespace for analytics.

### Q45. Blob security
Disable shared key and anonymous access, use Entra RBAC data roles, user delegation SAS (preferred over account-key SAS) with short expiry and stored access policies, private endpoints, firewall rules, encryption with CMK, immutability (WORM), soft delete, versioning, Defender for Storage.

### Q46. Azure SQL operations
DTU vs vCore models, serverless auto-pause, elastic pools for many databases, zone redundancy, auto-failover groups with read-write listener, geo-replication, Query Store/Intelligent Insights, Automatic tuning, firewall + Private Endpoint, Entra-only auth, TDE (CMK optional), Always Encrypted, Ledger. See `../04_Database/026_SQL.md`.

### Q47. PostgreSQL/MySQL Flexible Server
Managed OSS DBs with zone-redundant HA, read replicas, PITR, VNet integration/private access, extensions, maintenance windows, Entra auth. Right-size and monitor connections (PgBouncer built-in option). See `../04_Database/028_PostgreSQL.md`.

### Q48. Cosmos DB design *(Must-know)*
Pick a partition key with high cardinality and even access distribution; model for queries (denormalize, embed vs reference); throughput in RUs (autoscale for spiky); choose consistency (Session default); avoid cross-partition queries; use change feed for event-driven patterns; TTL; multi-region writes need conflict policy. See `../04_Database/030_MongoDB.md` for document modelling parallels.

### Q49. Service Bus patterns
Queues (point-to-point), topics/subscriptions with filters (pub/sub), sessions (ordered FIFO per session), dead-letter queues, duplicate detection, scheduled messages, transactions, premium tier for isolation/throughput. Idempotent consumers required (at-least-once).

### Q50. Event Grid vs Event Hubs vs Service Bus *(Must-know)*
| Service | Pattern | Use |
|---|---|---|
| Event Grid | Reactive event routing (push) | Resource/event notifications, serverless triggers |
| Event Hubs | High-throughput streaming (partitions, replay) | Telemetry, logs, Kafka workloads |
| Service Bus | Reliable messaging with transactions/sessions | Business workflows, commands |

### Q51. API Management
Gateway for APIs: policies (rate limit, JWT validation, transformation, caching), products/subscriptions, developer portal, versions/revisions, backends, self-hosted gateway for hybrid, VNet integration. Place in front of Functions/App Service/AKS.

### Q52. Application Gateway vs Front Door
App Gateway: regional L7 LB/WAF, private networking inside VNet, path-based routing, SSL offload, AGIC for AKS. Front Door: global entry, edge caching, global failover, WAF at edge. Combine: Front Door → App Gateway/App Service with private origins.

### Q53. Azure Firewall & network security
Firewall Standard/Premium with DNAT/network/application rules, threat intelligence, IDPS (Premium), forced tunneling, Firewall Manager policies; DDoS Protection plans; NSG flow logs and Traffic Analytics; Network Watcher tools (connection troubleshoot, IP flow verify).

### Q54. Defender for Cloud
CSPM (secure score, recommendations, regulatory compliance dashboards) and CWPP (Defender for Servers, Containers, Storage, SQL, Key Vault, App Service). Integrates with Sentinel (SIEM/SOAR). Enable at subscription level via Policy for coverage.

### Q55. Microsoft Sentinel
Cloud-native SIEM/SOAR on Log Analytics: data connectors, analytics rules (KQL), incidents, workbooks, playbooks (Logic Apps), UEBA, threat hunting. Control costs via data tiers/retention.

### Q56. Logging and KQL
```kusto
AppRequests
| where TimeGenerated > ago(1h)
| summarize requests=count(), failed=countif(Success == false), p95=percentile(DurationMs, 95) by bin(TimeGenerated, 5m), Name
| order by TimeGenerated desc
```
Diagnostic settings send resource logs to Log Analytics/Storage/Event Hubs. Use data collection rules (DCR) with Azure Monitor Agent.

### Q57. Application Insights
Auto-instrumentation (.NET, Java, Node), distributed tracing (W3C), live metrics, availability tests, smart detection, sampling, OpenTelemetry distro. Correlate with Log Analytics workspace-based resources. See `052_Monitoring-and-Observability.md`.

### Q58. Backup and DR
Azure Backup (VMs, SQL in VM, Files, Blobs, vaulted backups, immutable vaults), Site Recovery (VM replication to another region with recovery plans), SQL failover groups, Cosmos multi-region, Traffic Manager/Front Door for traffic failover, geo-redundant storage. Test failover regularly.

### Q59. Landing zones & Cloud Adoption Framework
Enterprise-scale landing zone: management group hierarchy (platform: identity, connectivity, management; landing zones: corp/online), policy-as-code baseline, hub networking, central logging/monitoring, subscription vending, Defender and PIM. Accelerators: ALZ Bicep/Terraform modules.

### Q60. Cost management
Budgets with alerts, tag-based cost allocation, Advisor right-sizing, reservations/savings plans, Hybrid Benefit, Spot, auto-shutdown for dev VMs, storage lifecycle, delete orphaned disks/IPs, review data egress, FinOps dashboards (Cost Management exports to storage + Power BI).

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Designing highly available apps on Azure *(Must-know)*
Zone-redundant tiers: Front Door/App Gateway (zone-redundant), App Service (zone redundancy in Premium v3), AKS/VMSS across zones, Azure SQL zone-redundant, Cosmos multi-region, ZRS storage, Service Bus Premium zones. Health probes, autoscale, retry/circuit-breaker patterns (Polly), and testing via Chaos Studio.

### Q62. Multi-region architecture
Active-active (Front Door + regional stacks + Cosmos multi-write/SQL geo-replication) vs active-passive (Site Recovery, failover groups, Traffic Manager priority). Define RPO/RTO, data consistency approach, replicated Key Vault/secrets/config, DNS TTLs, and regular failover drills.

### Q63. Identity architecture
Entra ID as the IdP; app registrations/enterprise apps; OIDC/OAuth2 flows (auth code + PKCE; client credentials); B2B guests and B2C/External ID for customers; groups with RBAC; PIM; Conditional Access; workload identities; passwordless. See `../03_Backend/036_Authentication-and-Security.md`.

### Q64. Securing PaaS apps
Disable public network access, Private Endpoints + Private DNS, managed identities, Key Vault references, WAF in front, minimal CORS, HTTPS-only/TLS 1.2+, IP restrictions, diagnostic logging, Defender plans, and Policy to enforce settings.

### Q65. Zero Trust on Azure
Verify explicitly (Entra CA, MFA), least privilege (RBAC/PIM/JIT), assume breach (segmentation with NSGs/Firewall, Private Link, Defender, logging to Sentinel), device compliance via Intune, secrets in Key Vault, continuous monitoring.

### Q66. Key Vault design
Separate vaults per app/environment, RBAC authorization model, soft delete + purge protection, network restrictions/private endpoint, certificate auto-renewal, key rotation, HSM (Managed HSM) for compliance, monitoring via diagnostic logs and alerts on access anomalies, throttling limits awareness.

### Q67. Encryption at rest/in transit
Platform-managed keys by default; customer-managed keys in Key Vault/Managed HSM for SQL TDE, Storage, Disks (Disk Encryption Sets), Cosmos. Confidential computing for data in use. TLS enforcement and certificate management.

### Q68. Data platform
Azure Data Lake Gen2, Synapse/Fabric, Data Factory pipelines, Databricks, Event Hubs/Stream Analytics, Purview governance, Power BI. Medallion architecture (bronze/silver/gold). See `../10_AI_and_ML/075_Data-Engineering.md`.

### Q69. AI on Azure
Azure OpenAI Service (enterprise access to OpenAI models with Azure security/compliance), AI Foundry/Studio, AI Search (vector/hybrid retrieval), Document Intelligence, Speech, Content Safety, Azure Machine Learning (training, endpoints, MLOps). RAG patterns with AI Search + OpenAI; private networking and managed identity; token quotas and cost controls. See `../11_Generative_AI/`.

### Q70. CI/CD to Azure with OIDC
```yaml
permissions: { id-token: write, contents: read }
steps:
  - uses: azure/login@v2
    with: { client-id: ${{ vars.AZURE_CLIENT_ID }}, tenant-id: ${{ vars.AZURE_TENANT_ID }}, subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }} }
  - run: az deployment group create -g rg-app -f main.bicep -p env=prod
```
Federated credentials bind subjects (repo/branch/environment) to a user-assigned managed identity or app registration.

### Q71. Bicep/ARM deployment practices
Modules, parameter files, `what-if` previews, deployment scopes (RG/subscription/MG), Deployment Stacks to manage lifecycle/deny settings, Template Specs for sharing, linting, and testing. Avoid secrets in parameters (use Key Vault references).

### Q72. Terraform on Azure
`azurerm` provider (plus `azapi` for new features), remote state in Storage with state locking via blob lease, OIDC auth, workload separation per subscription, policy-as-code checks (Checkov), module registry. See `051_Terraform-and-IaC.md`.

### Q73. Monitoring design
Workspace-per-region/environment vs centralized (data residency, RBAC, cost trade-offs), data collection rules, retention tiers (basic/analytics/archive), alert rule hygiene (action groups, suppression), SLO dashboards in Workbooks/Grafana, OpenTelemetry to App Insights.

### Q74. Cost optimization case
Right-size via Advisor, shut down dev/test off-hours, reservations for steady state, Hybrid Benefit, storage tier lifecycle, remove idle App Service plans, use serverless/consumption tiers, optimize Log Analytics ingestion (filtering, basic logs), review egress and cross-region traffic.

### Q75. Governance at scale
Management group hierarchy, Policy initiatives (CIS, NIST, ISO), exemptions with expiry, tag enforcement, RBAC via groups/PIM, subscription vending automation, resource locks for critical assets, budgets per subscription, compliance dashboards in Defender.

### Q76. Troubleshooting networking
Network Watcher (IP flow verify, next hop, connection troubleshoot, packet capture), NSG flow logs, effective routes/security rules on NICs, DNS resolution for Private Endpoints (Private DNS zone links), firewall logs (KQL), asymmetric routing with UDR/NVA.

### Q77. Troubleshooting App Service
Log stream, Kudu console, diagnostics blade ("Diagnose and solve problems"), Application Insights failures/performance, memory/CPU of the plan, slot swap issues, outbound SNAT port exhaustion (use NAT Gateway/VNet integration + connection pooling), cold starts (Always On).

### Q78. Troubleshooting Azure Functions
Invocation logs in App Insights, scale controller logs, host.json concurrency/batch sizes, storage account connectivity (AzureWebJobsStorage), identity permissions, timeouts per plan, poison messages, cold start mitigation with Premium/Flex plans.

### Q79. Troubleshooting authentication
Wrong tenant/authority, audience/scope mismatch, consent not granted, clock skew, token lifetime, Conditional Access blocking, managed identity not assigned the role (RBAC propagation delay up to minutes), Key Vault firewall blocking. Decode tokens (jwt.ms) and check Sign-in logs.

### Q80. SNAT and outbound connectivity
Default outbound access is being retired for new VNets (verify): use NAT Gateway or Load Balancer outbound rules/Firewall for deterministic egress and SNAT port scaling. Symptoms of exhaustion: intermittent connection failures to the same destination.

### Q81. Availability and update management
Planned maintenance (maintenance configurations), scheduled events metadata service on VMs, Update Manager schedules, AKS node image upgrades, rolling upgrades for VMSS (automatic OS image upgrades), slot-based zero-downtime deployments.

### Q82. Hybrid identity and migration
Entra Connect/Cloud Sync, password hash sync vs pass-through vs federation (AD FS), Seamless SSO, hybrid join, migrate apps to Entra app proxy/SSO; Azure Migrate for servers/DBs/web apps; Database Migration Service; landing zone before migration waves.

### Q83. Azure Arc and hybrid management
Arc-enabled servers/Kubernetes/SQL apply Azure governance (Policy, RBAC, Defender, Monitor) to on-prem and other clouds; GitOps with Flux on Arc K8s; run Azure data services anywhere. Useful for consistent control planes.

### Q84. Compliance & data residency
Choose regions meeting residency (e.g., India regions), use sovereign clouds where required, Policy to restrict locations, customer-managed keys, Purview classification, compliance offerings (ISO, SOC, HIPAA BAA, PCI), Customer Lockbox.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design a secure, scalable web platform on Azure *(Must-know)*
- **Edge:** Front Door Premium + WAF (managed rules, bot protection), Private Link origins.
- **App tier:** App Service Premium v3 (zone-redundant) or Container Apps/AKS across zones; managed identity; autoscale.
- **Data:** Azure SQL zone-redundant with failover group; Cosmos DB for catalog/session (multi-region read); Redis cache; Blob (ZRS/GZRS) via Private Endpoints.
- **Async:** Service Bus topics, Functions/Container Apps jobs; Event Grid for events.
- **Security:** Entra ID (OIDC), Key Vault, Defender for Cloud, Policy, Sentinel; private networking in hub-spoke with Azure Firewall egress.
- **Ops:** Bicep/Terraform, GitHub Actions OIDC, Azure Monitor/App Insights, Backup + Site Recovery, budgets.
Trade-offs: cost of Premium/zone redundancy and Private Link, complexity of DNS, regional failover testing.

### Q86. Enterprise-scale landing zone design
Management groups: Platform (Identity, Management, Connectivity), Landing Zones (Corp, Online), Sandbox, Decommissioned. Hub VNet (Firewall, VPN/ER, Bastion, DNS resolver), spoke VNets per workload subscription, Azure Policy initiatives at MG level, central Log Analytics/Sentinel, subscription vending via IaC, PIM and break-glass, cost management per subscription.

### Q87. Network architecture options
Traditional hub-spoke (VNet peering + Firewall) vs Virtual WAN (managed hub, branch connectivity, routing intent). Use Private DNS Resolver for hybrid DNS, ExpressRoute with VPN backup, forced tunneling, segmentation with NSG/ASG and micro-segmentation via Firewall policies, inspection of east-west traffic when required.

### Q88. Securing AKS on Azure
Private cluster, Entra integration + Azure RBAC for Kubernetes, workload identity, Azure Policy (Gatekeeper), Defender for Containers, network policies (Azure/Cilium), ACR with private link + image signing, node image upgrades, restricted egress via Firewall, Key Vault CSI driver, Pod Security Standards. See `046_Kubernetes.md`.

### Q89. Data protection strategy
Classification (Purview), encryption with CMK, private connectivity, RBAC data roles, immutable backups in separate subscription/tenant (cross-tenant restore), soft delete, geo-redundancy, DLP policies, masking (SQL Dynamic Data Masking), audit logs to Sentinel.

### Q90. Reliability engineering with Azure
SLOs per service, error budgets, chaos experiments (Azure Chaos Studio), health models (Azure Monitor health model), dependency mapping (Application Map), load testing (Azure Load Testing), runbooks via Automation/Logic Apps, DR drills, capacity reservations for critical regions/SKUs.

### Q91. Event-driven & serverless architecture
Event Grid system topics (Blob created) → Functions/Logic Apps; Service Bus for reliable commands; Durable Functions orchestrations; Cosmos change feed processors; idempotency, retries, DLQs, and observability via correlation IDs. See `../03_Backend/039_Microservices.md`.

### Q92. Migration at scale
Discover/assess with Azure Migrate (dependency analysis), classify by 6 Rs, build landing zone, migrate waves (Server Migration, DMS, App Service Migration Assistant), cutover runbooks, post-migration optimization (right-size, modernize), decommission on-prem; track TCO and risk.

### Q93. Integration platform choices
Logic Apps (low-code workflows, connectors), Functions (code), API Management (gateway), Service Bus/Event Grid (messaging), Data Factory (ETL), Power Platform for citizen devs. Choose by complexity, skills, throughput and governance.

### Q94. FinOps practices
Tagging standards (cost center, owner, env), showback/chargeback, budget alerts + anomaly alerts, reservation/savings plan coverage targets, rightsizing cadence, dev/test automation, unit cost metrics, Cost Management API exports, engineering ownership reviews monthly.

### Q95. Observability at scale
Centralized Log Analytics with per-team RBAC, OpenTelemetry standardization, sampling strategies, workbook SLO dashboards, alert-processing rules, cross-workspace queries, long-term archive in Storage/ADX, cost controls (Basic logs, DCR transformations to drop noisy fields).

### Q96. Security operations
Defender for Cloud secure score + regulatory compliance, Sentinel analytics rules/UEBA, SOAR playbooks (isolate VM, disable account), vulnerability management (Defender Vulnerability Management), JIT VM access, PIM approvals, incident runbooks, purple-team exercises.

### Q97. Policy-as-code governance
Custom policies/initiatives in Bicep/Terraform repo, tested in sandbox, assigned with enforcement mode `DoNotEnforce` first, remediation tasks (deployIfNotExists), exemptions with expiry/owners, compliance reports, alignment with CIS/NIST, PR review for governance changes.

### Q98. Handling subscription limits and quotas
Per-region vCPU quotas by VM family, public IP limits, API throttling (ARM 429 with Retry-After), storage account limits; request increases early, spread workloads across subscriptions, implement retry/backoff in automation.

### Q99. Modernization patterns
Rehost → replatform (App Service, SQL MI) → refactor (containers/Functions) → rebuild; strangler fig with Front Door/API Management routing; decouple with Service Bus; migrate monolith DB carefully; adopt DevOps and IaC alongside.

### Q100. Choosing compute on Azure
| Need | Choice |
|---|---|
| Lift-and-shift, custom OS | VMs / VMSS |
| Web apps/APIs, minimal ops | App Service |
| Event-driven snippets | Functions |
| Serverless containers/microservices | Container Apps |
| Full Kubernetes | AKS |
| Batch/HPC | Azure Batch / CycleCloud |
| Quick isolated container | ACI |

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. Cloud strategy with Azure *(Must-know)*
Align with business goals via the Cloud Adoption Framework: strategy (outcomes, financial case), plan (skills, adoption plan), ready (landing zone), migrate/innovate, govern (policy, cost, security baselines), manage (operations, SLOs). Establish a platform team, product-aligned squads, and measurable KPIs (time-to-market, availability, cost per unit, compliance posture).

### Q102. Multi-cloud and vendor decisions
Use standards (Kubernetes, Terraform, OpenTelemetry, OIDC) where portability matters; accept Azure-native advantages where value is clear (Entra integration, Microsoft 365, SQL/.NET). Avoid accidental lock-in at data gravity points; keep exit plans for critical services.

### Q103. Security leadership
Zero Trust roadmap, identity as the perimeter, secure-by-default landing zones, continuous posture management, threat modelling, supply-chain security, incident response runbooks, executive reporting (secure score trends, mean time to remediate).

### Q104. Resilience and DR governance
Tiered application criticality with RTO/RPO, mandatory DR tests per tier, paired-region strategy, backup immutability and cross-tenant protections, dependency risk register, capacity planning in DR regions, and post-incident improvements.

### Q105. Operating model & team topology
Platform engineering provides landing zones, golden templates and pipelines; product teams own services end-to-end; central security/governance teams define guardrails; FinOps and SRE practices embedded. Self-service via Bicep/Terraform modules and developer portals (Backstage).

### Q106. Large-scale migration governance
Wave planning with risk scoring, rollback criteria, cutover windows, hypercare, migration factory automation, dependency mapping, license optimization (Hybrid Benefit), and benefit tracking vs business case.

### Q107. Regulated workloads
Healthcare/finance/government: sovereign/regional constraints, customer-managed keys/HSM, private-only connectivity, immutable logging, segregation of duties via PIM, continuous compliance (Policy/Defender regulatory standards), evidence automation, third-party risk reviews.

### Q108. Generative AI strategy on Azure
Use Azure OpenAI with private endpoints and content filters, RAG over enterprise data with AI Search and RBAC-trimmed retrieval, prompt/response logging policies, evaluation pipelines, rate/budget governance, model/version lifecycle management, red-teaming and responsible-AI review boards.

### Q109. Sustainability & efficiency
Right-sizing, autoscale, serverless, region selection with lower carbon intensity, data lifecycle policies, Emissions Impact Dashboard, and efficient architectures to reduce waste and cost together.

### Q110. Communicating trade-offs
Use ADRs and options analysis covering cost, risk, compliance, operability and time; present SLA math for architectures; run proofs-of-concept for risky choices; provide roadmaps with decision gates.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Bicep: App Service with managed identity, Key Vault reference and VNet integration
```bicep
param location string = resourceGroup().location
param appName string
param subnetId string

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-${appName}'
  location: location
  sku: { name: 'P1v3', tier: 'PremiumV3', capacity: 2 }
  kind: 'linux'
  properties: { reserved: true, zoneRedundant: true }
}

resource app 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    virtualNetworkSubnetId: subnetId
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      alwaysOn: true
      appSettings: [ { name: 'DB_PASSWORD', value: '@Microsoft.KeyVault(SecretUri=https://kv-demo.vault.azure.net/secrets/db-password/)' } ]
    }
  }
}
```

### H2. Storage account hardened (Bicep)
```bicep
resource st 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'stdata${uniqueString(resourceGroup().id)}'
  location: resourceGroup().location
  sku: { name: 'Standard_GZRS' }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    minimumTlsVersion: 'TLS1_2'
    publicNetworkAccess: 'Disabled'
    supportsHttpsTrafficOnly: true
    networkAcls: { defaultAction: 'Deny', bypass: 'AzureServices' }
  }
}
```

### H3. Azure CLI: private endpoint for a storage account
```bash
az network private-endpoint create -g rg-net -n pe-blob --vnet-name vnet-spoke --subnet snet-pe \
  --private-connection-resource-id $(az storage account show -n stdata123 --query id -o tsv) \
  --group-id blob --connection-name conn-blob
az network private-dns zone create -g rg-net -n privatelink.blob.core.windows.net
az network private-dns link vnet create -g rg-net -z privatelink.blob.core.windows.net -n link-spoke -v vnet-spoke -e false
az network private-endpoint dns-zone-group create -g rg-net --endpoint-name pe-blob -n default \
  --private-dns-zone privatelink.blob.core.windows.net --zone-name blob
```

### H4. Function with Service Bus trigger and managed identity (C#)
```csharp
public class OrderProcessor(ILogger<OrderProcessor> log, IOrderService svc)
{
    [Function("ProcessOrder")]
    public async Task Run([ServiceBusTrigger("orders", Connection = "SB")] ServiceBusReceivedMessage msg, ServiceBusMessageActions actions)
    {
        try { await svc.HandleAsync(msg.MessageId, msg.Body.ToString()); await actions.CompleteMessageAsync(msg); }
        catch (TransientException) { await actions.AbandonMessageAsync(msg); }
        catch (Exception ex) { log.LogError(ex, "poison {Id}", msg.MessageId); await actions.DeadLetterMessageAsync(msg, null, "processing-failed", ex.Message); }
    }
}
```
App settings: `SB__fullyQualifiedNamespace=myns.servicebus.windows.net` with the identity granted *Azure Service Bus Data Receiver*.

### H5. GitHub Actions: build, push to ACR, deploy to Container Apps (OIDC)
```yaml
name: deploy
on: { push: { branches: [main] } }
permissions: { id-token: write, contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with: { client-id: "${{ vars.AZURE_CLIENT_ID }}", tenant-id: "${{ vars.AZURE_TENANT_ID }}", subscription-id: "${{ vars.AZURE_SUBSCRIPTION_ID }}" }
      - run: az acr build -r acmeacr -t app:${{ github.sha }} .
      - run: az containerapp update -n app -g rg-app --image acmeacr.azurecr.io/app:${{ github.sha }}
```

### H6. KQL: error rate and slow requests
```kusto
AppRequests
| where TimeGenerated > ago(30m)
| summarize total=count(), errors=countif(toint(ResultCode) >= 500), p95=percentile(DurationMs, 95) by AppRoleName, bin(TimeGenerated, 5m)
| extend errorRate = todouble(errors) / total
| where errorRate > 0.02 or p95 > 800
```

### H7. Azure Policy: require tags and deny public storage
```json
{ "mode": "Indexed",
  "policyRule": {
    "if": { "allOf": [ { "field": "type", "equals": "Microsoft.Storage/storageAccounts" }, { "field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess", "notEquals": false } ] },
    "then": { "effect": "deny" } } }
```
Assign at management group scope; start with `Audit` to gauge impact.

### H8. Terraform: resource group, VNet and AKS (excerpt)
```hcl
resource "azurerm_resource_group" "rg" { name = "rg-aks" location = "centralindia" }
resource "azurerm_kubernetes_cluster" "aks" {
  name = "aks-prod" location = azurerm_resource_group.rg.location resource_group_name = azurerm_resource_group.rg.name
  dns_prefix = "aksprod"
  default_node_pool { name = "system" vm_size = "Standard_D4s_v5" min_count = 3 max_count = 6 auto_scaling_enabled = true zones = ["1","2","3"] }
  identity { type = "SystemAssigned" }
  oidc_issuer_enabled = true
  workload_identity_enabled = true
  network_profile { network_plugin = "azure" network_plugin_mode = "overlay" }
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `AuthorizationFailed` / 403 on a resource
Missing RBAC role at the right scope, role propagation delay, data-plane vs control-plane role mismatch (e.g., Contributor can't read blobs), Policy deny, resource lock, firewall/private endpoint blocking. Check `az role assignment list`, Activity Log and Policy compliance.

### D2. App can't reach PaaS through Private Endpoint
Private DNS zone not linked to the VNet, public DNS resolving to public IP, custom DNS server missing forwarders, NSG/UDR blocking, public access disabled but client outside VNet. Test with `nslookup`, Network Watcher.

### D3. App Service slow after deploy
Cold start (Always On off), slot swap without warm-up, plan CPU/memory saturated, SNAT exhaustion, dependency latency, chatty DB calls. Use App Insights, Diagnose and solve problems, scale out/up, add connection pooling.

### D4. Functions not triggering
Wrong connection settings/identity permissions, trigger disabled, storage account (AzureWebJobsStorage) unreachable, scale controller can't see queue (private networking needs runtime scale monitoring), host.json errors. Check Live Metrics and logs.

### D5. Key Vault reference unresolved
Missing managed identity permissions (Key Vault Secrets User), vault firewall blocking App Service outbound IPs, wrong URI/version, soft-deleted secret. Check app setting status in portal (Key Vault reference status).

### D6. Cosmos DB 429 (rate limited)
RU/s exhausted or hot partition. Increase RU/autoscale max, fix partition key, optimize queries/indexing policy, implement retry with `x-ms-retry-after-ms`.

### D7. Azure SQL timeouts or high DTU/CPU
Missing indexes, parameter sniffing, blocking, connection storms; use Query Store/Performance recommendations, scale tier, add retry logic for transient faults, connection pooling.

### D8. Deployment fails with quota/capacity errors
`SkuNotAvailable`, vCPU quota, zone capacity. Request quota increases, choose different SKU/zone/region, use capacity reservations for critical workloads.

### D9. Policy blocks deployment unexpectedly
Review deny message (policy name, assignment), check inherited assignments at MG/subscription, use exemptions or fix template (tags, locations, SKUs).

### D10. VPN/ExpressRoute connectivity issues
Overlapping address spaces, BGP route advertisement problems, NSG/UDR on GatewaySubnet (not allowed), MTU/MSS, shared key mismatch, firewall on-prem. Use connection monitor and gateway diagnostics.

### D11. AKS pods can't pull images from ACR
Missing AcrPull role for kubelet identity, private link DNS, firewall egress rules, wrong image path/tag. `az aks check-acr`.

### D12. Intermittent outbound failures
SNAT port exhaustion on shared outbound, ephemeral port limits, connection reuse absent. Add NAT Gateway, reuse HttpClient/connection pooling, tune keepalive.

### D13. Log Analytics bill spike
Verbose diagnostics, noisy containers, high-ingestion tables. Use DCR transformations, Basic logs tier, sampling, retention tuning, and per-table cost queries (`Usage`).

### D14. Entra token errors (AADSTS codes)
AADSTS50105 (user not assigned), 65001 (consent required), 700016 (app not found), 7000215 (invalid secret), CA blocks. Inspect sign-in logs, correct redirect URIs and API permissions.

### D15. Traffic Manager/Front Door failover not triggering
Health probe path/port wrong, probe too lenient, backend returns 200 on errors, TTL caching in clients. Align probes with real readiness and test failover.

---

# 🧩 Part 8: Tricky Questions

### T1. Is a resource group a security boundary?
It's an RBAC/Policy scope and lifecycle container, not a network boundary; subscriptions and VNets provide stronger isolation.

### T2. Does stopping a VM stop billing?
Only if deallocated (compute stops); disks, IPs and licenses may still bill. "Stopped" within the OS leaves allocation active.

### T3. Do Service Endpoints give private IP access to PaaS?
No; they use the service's public endpoint with VNet identity. Private Endpoints provide a private IP.

### T4. Is Azure RBAC the same as Entra roles?
No. Entra roles manage directory objects; Azure RBAC manages Azure resources (though Global Admin can elevate access).

### T5. Does ZRS protect against region failure?
No, only zone failures within a region; use GRS/GZRS for regional resilience.

### T6. Are managed identities usable outside Azure?
No for system/user-assigned managed identities themselves; use workload identity federation or Arc-enabled identities for other platforms.

### T7. Is Cosmos DB strongly consistent globally by default?
Default is Session consistency; Strong with multi-region writes isn't supported and has latency costs.

### T8. Can VNet peering be transitive?
Not by default; use hub NVA/Firewall with UDRs, Virtual WAN, or gateway transit.

### T9. Does Azure Functions Consumption plan support VNet integration?
Historically no (Premium/Dedicated/Flex needed); verify current plan capabilities.

### T10. Is Azure AD still the product name?
Renamed Microsoft Entra ID; APIs and tooling may still show "Azure AD" in places.

### T11. Does deleting a resource group delete everything inside?
Yes, all contained resources (unless locks prevent it); soft-delete features may allow recovery of some services.

### T12. Are Azure SLA numbers a guarantee of uptime?
They're financially backed commitments with credits, not guarantees; design redundancy to meet your own objectives.

### T13. Is Bicep a different engine than ARM?
No; Bicep compiles to ARM templates and deploys through ARM.

### T14. Does Event Grid guarantee ordering?
No; it provides at-least-once delivery without ordering. Use Service Bus sessions or Event Hubs partitions for order.

### T15. Can you move any resource between subscriptions?
Many but not all; check the move support matrix; some require recreation.

### T16. Is Key Vault free of throttling?
No; there are per-vault request limits; cache secrets and use managed identity with backoff.

### T17. Is Premium SSD v2 zonal?
Yes, it's zonal (no ZRS in some versions); verify current redundancy support.

### T18. Are Defender plans automatically on?
Only the foundational CSPM is free; workload protection plans must be enabled (and billed).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Identity provider?** Microsoft Entra ID.
- **Resource access control?** Azure RBAC.
- **Governance guardrails?** Azure Policy.
- **Hierarchy?** Management groups → subscriptions → resource groups → resources.
- **Secrets store?** Key Vault.
- **Credential-free auth?** Managed identity.
- **Private PaaS access?** Private Endpoint (Private Link).
- **L4 LB / L7 LB / global?** Load Balancer / App Gateway / Front Door.
- **PaaS web hosting?** App Service.
- **Serverless code?** Functions.
- **Serverless containers?** Container Apps.
- **Managed K8s?** AKS.
- **Registry?** ACR.
- **Relational PaaS?** Azure SQL / Flexible Server.
- **Global NoSQL?** Cosmos DB.
- **Messaging?** Service Bus; **events?** Event Grid; **streaming?** Event Hubs.
- **Monitoring?** Azure Monitor + Log Analytics + App Insights.
- **Query language?** KQL.
- **SIEM?** Microsoft Sentinel.
- **Posture/CWPP?** Defender for Cloud.
- **IaC native?** Bicep.
- **DR VMs?** Site Recovery.
- **Backups?** Azure Backup.
- **Cost tools?** Cost Management + Advisor.
- **Hybrid mgmt?** Azure Arc.
- **Dedicated link?** ExpressRoute.
- **SQL licensing savings?** Hybrid Benefit.
- **Deployment slots?** App Service.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an Azure solution you built.
STAR: "I built a B2B platform on Azure: Front Door + WAF → App Service (zone-redundant) and Container Apps for workers, Azure SQL with failover group, Cosmos DB for catalog, Service Bus for orders, Key Vault + managed identities, Private Endpoints in a hub-spoke network, Bicep + GitHub Actions OIDC, and Azure Monitor/Sentinel. We hit 99.95% availability, cut deployment time from 2 hours to 12 minutes, and lowered cost 22% with reservations and autoscale."

### P2. Describe a security improvement you led.
"We removed all client secrets by moving to managed identities and workload identity federation, disabled public network access using Private Endpoints and Policy deny rules, enforced MFA/PIM and enabled Defender plans. Secure score rose from 54% to 88% and secret-related findings dropped to zero."

### P3. How do you design for DR?
"Classify apps by tier, set RPO/RTO, use zone redundancy first, then paired-region replication (failover groups, GZRS, Cosmos multi-region), Front Door for traffic failover, Site Recovery for VMs, and run quarterly failover drills with runbooks."

### P4. Tell me about a cost optimization.
"Advisor and Cost Analysis showed idle App Service plans and oversized SQL tiers. We consolidated plans, applied reservations and Hybrid Benefit, automated dev/test shutdown, and tuned Log Analytics ingestion. Monthly spend fell by 31%."

### P5. How do you choose App Service vs Container Apps vs AKS?
"App Service for standard web workloads with minimal ops; Container Apps for microservices with scale-to-zero and KEDA; AKS when we need Kubernetes APIs, custom operators or fine-grained control, accepting more operational cost."

### P6. How do you govern many subscriptions?
"Management group hierarchy with policy initiatives, subscription vending via IaC, central logging, RBAC via groups + PIM, budgets per subscription and automated compliance reports."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** regions, zones, region pairs, subscriptions, resource groups, pricing, SLAs, Well-Architected, Cloud Adoption Framework.
- **Identity and governance:** Entra ID, RBAC, PIM, Conditional Access, managed identities, Policy, management groups, landing zones, locks.
- **Networking:** VNet, NSG/ASG, peering, Private Link, Firewall, Bastion, Load Balancer, App Gateway, Front Door, DNS, VPN/ExpressRoute, Virtual WAN.
- **Compute:** VMs/VMSS, App Service, Functions, Container Apps, AKS, ACI, Batch.
- **Data and storage:** Blob/Files/Disks, SQL family, Cosmos DB, Redis, Data Lake, Synapse/Fabric.
- **Integration:** Service Bus, Event Grid, Event Hubs, API Management, Logic Apps.
- **Security and operations:** Key Vault, Defender for Cloud, Sentinel, Monitor/Log Analytics/App Insights, Backup, Site Recovery.
- **Delivery:** Bicep/ARM/Terraform, Azure DevOps/GitHub Actions with OIDC, deployment slots.
- **Strategy:** migration, FinOps, DR, multi-region, compliance, generative AI.

## Mixed topics
- Azure + AWS/GCP (`048_AWS.md`, `050_GCP.md`): service mapping and trade-offs.
- Azure + containers/Kubernetes (`045_Docker.md`, `046_Kubernetes.md`) and CI/CD (`047_CI-CD-and-DevOps.md`).
- Azure + IaC and monitoring (`051_Terraform-and-IaC.md`, `052_Monitoring-and-Observability.md`).
- Azure + .NET (`../03_Backend/019_DotNet.md`, `../03_Backend/018_CSharp.md`) and backend security (`../03_Backend/036_Authentication-and-Security.md`).
- Azure + databases (`../04_Database/`) and messaging (`../03_Backend/038_Message-Queues.md`).
- Azure + AI (`../11_Generative_AI/`, `../10_AI_and_ML/074_MLOps.md`).

---

# 🔬 Part 12: Azure Internals

### I1. Azure Resource Manager (ARM)
All management calls go through ARM (REST): authenticate via Entra token → RBAC authorization → Policy evaluation → resource provider (e.g., `Microsoft.Compute`) executes → state persisted. Templates are declarative, idempotent deployments; deployments are tracked per scope.

### I2. Fault and update domains
Fault domains = shared power/network racks; update domains = groups rebooted together during planned maintenance. Availability sets spread VMs across both; zones add datacenter-level isolation.

### I3. Managed identity token flow
App calls the local Instance Metadata Service (IMDS) endpoint or identity endpoint → platform issues an Entra access token for the resource audience using the identity's certificate (managed by Azure) → app calls the target service. No secrets stored.

### I4. Storage architecture
Front-end → partition layer (object/table/queue namespaces) → stream layer (append-only distributed storage with replication). LRS replicates within a scale unit; ZRS across zones synchronously; GRS asynchronously to paired region.

### I5. Cosmos DB architecture
Resource partitions (physical) host logical partitions by hash of the partition key; replicas (min 4) per partition with Paxos-style quorum; RU model abstracts CPU/IO/memory; multi-region replication with configurable consistency; indexing is automatic (all properties by default).

### I6. Private Link mechanics
A Private Endpoint is a NIC with a private IP mapped to a specific PaaS resource sub-resource via Microsoft's backbone; DNS (privatelink zones) steers FQDNs to that IP; NSG/route behaviors depend on policy settings for private endpoints.

### I7. App Service architecture
Front ends (load balancers) route to worker VMs (per plan SKU) running sandboxed processes/containers; deployment slots are additional hostnames on the same workers; Kudu/SCM site manages deployments; scale-out adds workers.

### I8. Entra token validation
Apps validate JWT signatures with JWKS from the tenant's OpenID metadata, check `iss`, `aud`, `exp`, `tid`, scopes/roles (`scp`/`roles`). Access tokens are bearer; refresh tokens and PRTs are managed by the identity platform/clients.

### I9. Azure Front Door
Anycast edges terminate TLS near users, apply WAF/rules, route over Microsoft's private backbone to origins using health probes and latency/priority/weight policies; Premium adds Private Link origins.

---

# 📊 Part 13: Reference Tables

### AWS ↔ Azure ↔ GCP rough mapping
| Capability | AWS | Azure | GCP |
|---|---|---|---|
| VMs | EC2 | Virtual Machines | Compute Engine |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Managed K8s | EKS | AKS | GKE |
| Serverless functions | Lambda | Functions | Cloud Functions/Run |
| Relational PaaS | RDS/Aurora | Azure SQL/Flexible Server | Cloud SQL/AlloyDB |
| NoSQL global | DynamoDB | Cosmos DB | Firestore/Bigtable/Spanner |
| Messaging | SQS/SNS | Service Bus/Event Grid | Pub/Sub |
| Identity | IAM | Entra ID + RBAC | Cloud IAM |
| Secrets/keys | Secrets Manager/KMS | Key Vault | Secret Manager/KMS |
| IaC native | CloudFormation | ARM/Bicep | Deployment Manager (legacy)/Config Connector |
| Monitoring | CloudWatch | Azure Monitor | Cloud Operations |

### Storage redundancy
| Option | Copies | Protects against |
|---|---|---|
| LRS | 3 in one DC | Disk/rack failure |
| ZRS | 3 across zones | Zone failure |
| GRS | LRS + async to pair | Region failure |
| GZRS | ZRS + async to pair | Zone + region failure |

### Compute choice
| Service | Ops effort | Scale to zero | Best for |
|---|---|---|---|
| VM/VMSS | High | No | Legacy/custom |
| App Service | Low | No (plan) | Web apps |
| Functions | Very low | Yes | Event code |
| Container Apps | Low | Yes | Microservices |
| AKS | High | Node-level | Kubernetes |

### Messaging choice
| Need | Service |
|---|---|
| Transactional commands, ordering | Service Bus |
| Reactive event routing | Event Grid |
| Streaming/telemetry | Event Hubs |
| Simple queue | Storage Queues |

### Network exposure
| Option | Private IP | Public endpoint remains |
|---|---|---|
| Service Endpoint | No | Yes |
| Private Endpoint | Yes | Can be disabled |
| VNet integration (outbound) | N/A (egress from VNet) | N/A |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| Azure AD → Entra ID | Rebrand (2023) |
| Blueprints | Deprecated; use Template Specs/Deployment Stacks |
| Default outbound access | Being retired for new VNets |
| Flex Consumption (Functions) | Newer serverless plan |
| Azure OpenAI | Region/model availability varies |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
User has Contributor on a subscription and tries `az role assignment create`.
**Result:** fails; Contributor can't manage access (requires Owner/User Access Administrator).

### O2.
Storage account set to LRS; a zone fails.
**Result:** possible unavailability; LRS has no zone redundancy.

### O3.
Policy `deny` for locations other than `centralindia`; deploy to `eastus`.
**Result:** deployment is blocked with a policy violation error.

### O4.
App Service Free tier with Always On.
**Result:** not available; Always On requires Basic or higher.

### O5.
Private Endpoint created but DNS zone not linked to VNet.
**Result:** FQDN resolves to public IP; connection fails if public access disabled.

### O6.
Cosmos DB provisioned 400 RU/s, spike of heavy queries.
**Result:** HTTP 429 until RU consumption drops; retry with backoff or autoscale.

### O7.
Deallocated VM with Premium SSD attached.
**Result:** compute billing stops; disk still billed.

### O8.
Two peered VNets A–B and B–C, A→C traffic.
**Result:** no route unless via hub/NVA/gateway transit (non-transitive peering).

### O9.
Managed identity granted `Key Vault Secrets User` seconds ago; app fails to read secret.
**Result:** RBAC propagation delay may cause temporary 403; retry after a few minutes.

### O10.
Slot swap with slot-specific setting `ENV=staging`.
**Result:** setting stays with the slot; production keeps its own value after swap.

### O11.
Service Bus message exceeds max delivery count.
**Result:** moved to the dead-letter queue.

### O12.
Function on Consumption plan idle for hours receives HTTP request.
**Result:** cold start latency while an instance spins up.

---

# ✅ Part 15: MCQs

**1. Azure's identity service is:**
A) Active Directory Federation only  B) Microsoft Entra ID  C) IAM  D) Key Vault
**Answer: B**

**2. Which scope is highest in the Azure hierarchy (below tenant root)?**
A) Resource  B) Resource group  C) Subscription  D) Management group
**Answer: D**

**3. Managed identities eliminate the need for:**
A) RBAC  B) Stored credentials/secrets in app code  C) VNets  D) Policies
**Answer: B**

**4. Which service offers global L7 load balancing and WAF at the edge?**
A) Load Balancer  B) Application Gateway  C) Front Door  D) Traffic Manager (DNS only)
**Answer: C**

**5. Azure Policy effect that prevents non-compliant resource creation:**
A) Audit  B) Deny  C) Append  D) Disabled
**Answer: B**

**6. Which gives private IP connectivity to a PaaS service?**
A) Service Endpoint  B) Private Endpoint  C) NSG  D) UDR
**Answer: B**

**7. Which storage redundancy survives a zone outage?**
A) LRS  B) ZRS  C) None  D) Local
**Answer: B**

**8. The query language for Log Analytics is:**
A) SQL  B) KQL  C) PromQL  D) GraphQL
**Answer: B**

**9. Native IaC language for Azure:**
A) Bicep  B) Helm  C) Ansible only  D) Dockerfile
**Answer: A**

**10. Azure Functions cold start is most associated with:**
A) Premium plan always-ready  B) Consumption plan scale from zero  C) Dedicated plan  D) VMs
**Answer: B**

**11. Which service is best for ordered, transactional enterprise messaging?**
A) Event Grid  B) Service Bus  C) Event Hubs  D) Queue Storage
**Answer: B**

**12. PIM provides:**
A) Network security  B) Just-in-time privileged role activation  C) Backups  D) CDN
**Answer: B**

**13. Cosmos DB default consistency level:**
A) Strong  B) Session  C) Eventual  D) Bounded staleness
**Answer: B**

**14. Azure Hybrid Benefit reduces cost by:**
A) Reusing existing Windows/SQL licenses  B) Free storage  C) Spot discounts  D) Removing egress
**Answer: A**

**15. Which tool provides CSPM and secure score?**
A) Defender for Cloud  B) Sentinel only  C) Key Vault  D) Advisor only
**Answer: A**

**16. Deployment slots are a feature of:**
A) Functions Consumption only  B) App Service  C) AKS  D) Storage
**Answer: B**

**17. Traffic Manager works at:**
A) L4  B) L7 proxy  C) DNS level  D) Physical layer
**Answer: C**

**18. Recommended CI/CD authentication to Azure:**
A) Client secret in repo  B) Workload identity federation (OIDC)  C) Shared admin password  D) SAS in code
**Answer: B**

**19. Azure Site Recovery is used for:**
A) Cost reports  B) Replicating VMs to another region for DR  C) DNS  D) Load balancing
**Answer: B**

**20. Which role lets you manage resources but not assign roles?**
A) Owner  B) Contributor  C) Reader  D) User Access Administrator
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Using secrets/keys** instead of managed identities and OIDC federation.
2. **Public network access left on** for PaaS data services.
3. **Owner/Contributor assigned broadly** at subscription scope; no PIM.
4. **Single-zone deployments** and untested DR.
5. **Missing Private DNS configuration** for Private Endpoints.
6. **No Policy/tagging**, leading to sprawl and cost opacity.
7. **Oversized App Service plans/SQL tiers**; no autoscale or reservations.
8. **Ignoring SNAT limits** and connection pooling.
9. **Poor Cosmos DB partition keys** and cross-partition queries.
10. **Log Analytics over-ingestion** and long retention without need.
11. **Manual portal changes** instead of Bicep/Terraform.
12. **Service endpoints mistaken for private access.**
13. **Skipping Key Vault soft delete/purge protection** and RBAC hygiene.
14. **Not planning region pairs/capacity** for failover.
15. **Using Consumption Functions for latency-sensitive paths** without warm instances.
16. **Hard-coding region/SKU assumptions** that quotas or availability break.
17. **Assuming RBAC propagates instantly.**
18. **Leaving Bastion/JIT out** and exposing RDP/SSH.
19. **No backup immutability or cross-tenant protection.**
20. **Treating SLA as architecture;** ignoring composite SLA math.
21. **Mixing prod and dev in one subscription** without guardrails.
22. **Ignoring Defender recommendations** and secure score trends.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain the **management group/subscription/RG model** and design landing zones with policy and RBAC at the right scopes.
- You default to **managed identities, OIDC, Private Link and Key Vault**, eliminating secrets and public exposure.
- You pick **compute/data/messaging services** by trade-offs (Container Apps vs AKS, Service Bus vs Event Grid vs Event Hubs, SQL vs Cosmos).
- You design **zone-redundant and multi-region architectures** with explicit RPO/RTO and tested failover.
- You use **Bicep/Terraform + what-if + policy-as-code** and CI/CD with federated credentials.
- You troubleshoot with **Network Watcher, KQL, App Insights and Activity Logs** efficiently.
- You manage **cost and governance** with tags, budgets, reservations, Advisor and FinOps cadence.
- You integrate **Defender, Sentinel and Conditional Access/PIM** into a Zero Trust approach.
- You understand **hybrid** (Arc, Entra Connect, ExpressRoute) and migration waves.
- You quantify outcomes (availability, savings, secure score, deployment time).

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core mappings
```
Identity: Entra ID + RBAC + PIM + Conditional Access + Managed Identity
Governance: Management Groups → Subscriptions → Resource Groups; Policy, Locks, Tags
Network: VNet, NSG, Private Endpoint, Firewall, App Gateway, Front Door, Bastion, ExpressRoute/VPN
Compute: VM/VMSS, App Service, Functions, Container Apps, AKS • Data: Azure SQL, Cosmos DB, Blob, Redis
Messaging: Service Bus, Event Grid, Event Hubs • Ops: Monitor, Log Analytics (KQL), App Insights, Defender, Sentinel
IaC/CI-CD: Bicep/Terraform, Azure DevOps/GitHub Actions (OIDC)
```

### Architecture checklist
Zone-redundant tiers • Front Door/App Gateway + WAF • private networking (Private Endpoints + DNS) • managed identities + Key Vault • RBAC via groups/PIM • Policy guardrails • Backup + Site Recovery/failover groups • IaC + CI/CD • monitoring/alerts/runbooks • cost tags/budgets.

### Security checklist
MFA + Conditional Access • no standing admin (PIM) • no client secrets (OIDC/MI) • public access disabled on PaaS • TLS 1.2+ • CMK where required • Defender plans + secure score • Sentinel analytics • Key Vault purge protection • NSG flow logs.

### Cost checklist
Right-size (Advisor) • reservations/savings plans • Hybrid Benefit • Spot for batch • auto-shutdown dev/test • storage tiering • log ingestion control • delete orphaned disks/IPs • budgets + anomaly alerts.

### Interview strategy
1. Clarify requirements: SLA, RTO/RPO, compliance/residency, budget, team skills.
2. Draw hub-spoke/landing zone with identity and governance first.
3. Choose services with justification and alternatives.
4. Cover data, scaling, security, observability and CI/CD.
5. Address DR/failure modes and cost controls.
6. Close with measured outcomes and phased rollout.

### Final checklist before the interview
- [ ] Explain Azure hierarchy, regions/zones/pairs and Entra vs RBAC.
- [ ] Design a VNet/hub-spoke with Private Endpoints and correct DNS.
- [ ] Choose among App Service, Functions, Container Apps, AKS and VMs.
- [ ] Choose among SQL, Cosmos DB, Blob and Redis; explain redundancy options.
- [ ] Use Service Bus vs Event Grid vs Event Hubs correctly.
- [ ] Secure with managed identities, Key Vault, Defender, PIM, Conditional Access.
- [ ] Write Bicep/Terraform and CI/CD with OIDC; use what-if.
- [ ] Plan HA/DR with zones, failover groups, Site Recovery and tests.
- [ ] Troubleshoot networking/auth/performance with Network Watcher, KQL and App Insights.
- [ ] Prepare an architecture story, a security story and a cost story with numbers.
