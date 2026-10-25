# Terraform & Infrastructure as Code (IaC) Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Terraform 1.9 – 1.13** and **OpenTofu 1.8 – 1.10** as of 2025–2026, with the AWS, Google and AzureRM providers. Key features covered: `moved`, `import`, `removed` and `check` blocks, `precondition`/`postcondition`, `optional()` attributes, `terraform test` with mock providers, `terraform_data`, S3 native state locking (`use_lockfile`), ephemeral resources and write-only attributes, and OpenTofu state encryption. Licensing and product names change (Terraform moved to the BSL license in 2023, OpenTofu is the open-source fork, HashiCorp is now part of IBM, Terraform Cloud is now **HCP Terraform**). Anything marked "verify" should be checked in the official docs (developer.hashicorp.com/terraform, opentofu.org). Examples use the sample name **Ritesh Kumar**, the AWS Mumbai region (`ap-south-1`) and the GCP region `asia-south1`.
> This file covers IaC concepts (declarative vs imperative, idempotency, drift), the Terraform workflow, HCL language (variables, locals, outputs, expressions, `for_each`, `count`, dynamic blocks, functions), providers, state (remote backends, locking, encryption, state surgery), modules and registries, workspaces vs directories vs Terragrunt, lifecycle rules, import and refactoring, testing and policy as code, CI/CD pipelines (Atlantis, HCP Terraform, GitHub Actions), secrets handling, multi-account/multi-region design, upgrades and drift, internals (graph, plan/apply, provider protocol), comparisons (OpenTofu, Pulumi, CloudFormation/CDK, Bicep, Crossplane, Ansible), and debugging. Related topics: AWS in `048_AWS.md`, Azure in `049_Azure.md`, GCP in `050_GCP.md`, Docker/Kubernetes in `045_Docker.md`/`046_Kubernetes.md`, CI/CD in `047_CI-CD-and-DevOps.md`, monitoring in `052_Monitoring-and-Observability.md`, Git in `025_Git-and-GitHub.md`.

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
- [Part 12: Terraform Internals](#-part-12-terraform-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Infrastructure as Code (IaC)? *(Must-know)*
IaC means you describe servers, networks, databases and permissions in text files and let a tool create them. The files live in Git, so you get review, history, repeatability and rollback. Benefits: no manual console clicks, the same setup in dev/stage/prod, faster recovery, audit trail, and less human error.

### Q2. What is Terraform? *(Must-know)*
An open-source-style (BSL-licensed since 1.6) IaC tool from HashiCorp. You write **HCL** (HashiCorp Configuration Language) files that declare the desired infrastructure. Terraform talks to cloud APIs through **providers** (AWS, GCP, Azure, Kubernetes, GitHub, Datadog and thousands more) and keeps a **state** file that maps your code to real resources.

### Q3. Declarative vs imperative *(Must-know)*
- **Declarative (Terraform, CloudFormation, Bicep):** you say *what* you want ("3 servers"). The tool works out the steps.
- **Imperative (shell scripts, AWS CLI, some SDK code):** you say *how* ("create server, then create another…").
Declarative tools are easier to re-run because they compare desired state with current state and change only the difference.

### Q4. Core Terraform workflow *(Must-know)*
`write → init → plan → apply → (destroy)`.
```bash
terraform init      # download providers/modules, configure backend
terraform fmt       # format code
terraform validate  # check syntax and references
terraform plan      # show what will change
terraform apply     # make the changes
terraform destroy   # remove everything in this state
```

### Q5. What does `terraform init` do?
Initializes the working directory: installs providers into `.terraform/`, downloads modules, configures the backend, and writes the dependency lock file `.terraform.lock.hcl`. You re-run it after changing providers, modules or backend.

### Q6. What does `terraform plan` do?
Reads config, refreshes state from the real world, builds a dependency graph and shows the diff: `+` create, `-` destroy, `~` update in place, `-/+` replace. It changes nothing. Always read the plan before apply.

### Q7. What does `terraform apply` do?
Executes the plan. It asks for confirmation unless you use `-auto-approve`. Best practice: save the plan (`plan -out=tfplan`) and apply that exact file, so what you reviewed is what runs.

### Q8. What is a provider? *(Must-know)*
A plugin that knows how to call one platform's API. You declare it in `required_providers`, and configure it in a `provider` block.
```hcl
terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}
provider "aws" { region = "ap-south-1" }
```

### Q9. Resources and data sources
A **resource** creates and manages something. A **data source** only reads existing information (an AMI id, a VPC created elsewhere).
```hcl
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter { name = "name", values = ["al2023-ami-*-x86_64"] }
}
resource "aws_instance" "web" {
  ami           = data.aws_ami.al2023.id
  instance_type = "t3.micro"
}
```

### Q10. What is the Terraform state? *(Must-know)*
A JSON file (`terraform.tfstate`) that records which real resource each block manages, plus attributes. Terraform needs it to know what exists, to compute diffs and to order deletes. Losing it means Terraform thinks nothing exists and may try to create duplicates.

### Q11. Why not keep state in Git?
State can hold **secrets in plain text** (passwords, keys), it changes on every apply (merge conflicts), and Git has no locking. Use a **remote backend** (S3, GCS, Azure Blob, HCP Terraform) with locking and encryption.

### Q12. What is a remote backend?
Stores state outside your laptop so a team can share it, with **locking** (stops two applies at once), versioning and encryption.
```hcl
terraform {
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "prod/network/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true   # native S3 locking (1.10+), replaces DynamoDB table
  }
}
```

### Q13. Variables, outputs and locals *(Must-know)*
```hcl
variable "env" { type = string, default = "dev" }
locals { name_prefix = "ritesh-${var.env}" }
output "bucket_arn" { value = aws_s3_bucket.logs.arn }
```
- **Variable:** input to a module/root. **Local:** named expression inside the module. **Output:** value exposed to the CLI or a parent module.

### Q14. Ways to set variable values
Precedence from lowest to highest: the `default` in the variable block → `TF_VAR_name` environment variable → `terraform.tfvars` (and `.json`) → `*.auto.tfvars` (alphabetical) → `-var` and `-var-file` on the command line (later flags win). Key idea: command-line values win.

### Q15. Variable types and validation
Types: `string`, `number`, `bool`, `list(...)`, `set(...)`, `map(...)`, `object({...})`, `tuple`, `any`.
```hcl
variable "env" {
  type = string
  validation {
    condition     = contains(["dev","stage","prod"], var.env)
    error_message = "env must be dev, stage or prod."
  }
}
```

### Q16. `count` vs `for_each` *(Must-know)*
- `count = N` creates N copies indexed `0..N-1`. Removing item 0 shifts all others, causing destroy/recreate.
- `for_each` takes a map or set and keys each instance by a stable key. Safer for collections.
```hcl
resource "aws_iam_user" "u" {
  for_each = toset(["ritesh", "asha", "vikram"])
  name     = each.key
}
```

### Q17. Resource dependencies
**Implicit:** referencing `aws_vpc.main.id` makes Terraform create the VPC first. **Explicit:** `depends_on = [aws_iam_role_policy.x]` when the dependency is hidden (for example an IAM policy that is needed but not referenced).

### Q18. Output of `terraform fmt` and `validate`
`fmt` rewrites files to canonical style (use `-check` in CI). `validate` checks syntax, types and references without calling cloud APIs (needs `init` first).

### Q19. What is `.terraform.lock.hcl`?
Pins exact provider versions and checksums so every machine and CI run uses the same binaries. Commit it to Git. Update with `terraform init -upgrade`.

### Q20. What files should go in `.gitignore`?
`.terraform/`, `*.tfstate`, `*.tfstate.*`, `crash.log`, `*.tfplan`, and any `*.tfvars` with secrets. Do **not** ignore `.terraform.lock.hcl`.

### Q21. What is a module? *(Must-know)*
A folder of `.tf` files used as a reusable unit. Every Terraform directory is already a module (the **root module**). A **child module** is called with a `module` block.
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.13"
  name    = "app"
  cidr    = "10.0.0.0/16"
}
```

### Q22. Typical project file layout
`main.tf` (resources), `variables.tf`, `outputs.tf`, `versions.tf` (terraform and provider blocks), `locals.tf`, `backend.tf`, `terraform.tfvars`. Terraform loads all `.tf` files in the folder; names are only convention.

### Q23. `terraform destroy` and safety
Plans and deletes every resource in the state. Protect production with `prevent_destroy`, separate states, IAM limits on the pipeline role, and approval gates.

### Q24. What is drift?
When real infrastructure changes outside Terraform (someone edits in the console). `plan` shows the difference, because it refreshes state. Fix by re-applying (revert), or update the code (accept).

### Q25. HCL basics: blocks, arguments, expressions
```hcl
resource "aws_s3_bucket" "logs" {       # block type, labels
  bucket = "ritesh-logs-${var.env}"      # argument = expression
  tags   = merge(local.common_tags, { Name = "logs" })
}
```
String interpolation `"${...}"`, conditionals `cond ? a : b`, splat `aws_instance.web[*].id`, `for` expressions `[for s in var.list : upper(s)]`.

### Q26. Common built-in functions
`length`, `lookup`, `merge`, `concat`, `join`, `split`, `format`, `toset`, `tolist`, `keys`, `values`, `flatten`, `cidrsubnet`, `file`, `templatefile`, `jsonencode`, `try`, `coalesce`, `contains`, `zipmap`. Test them in `terraform console`.

### Q27. Tags and naming
Apply consistent tags (`Owner`, `Env`, `CostCenter`, `ManagedBy = "terraform"`) using provider `default_tags` or a `locals` map.
```hcl
provider "aws" {
  region = "ap-south-1"
  default_tags { tags = { Owner = "ritesh.kumar", ManagedBy = "terraform" } }
}
```

### Q28. Terraform vs configuration management (Ansible, Chef)
Terraform **provisions** infrastructure (create VMs, networks). Ansible **configures** what is inside machines (install packages) and is procedural. They are often used together; with immutable images (Packer, containers) you need less in-VM configuration.

### Q29. Terraform vs OpenTofu (basic)
OpenTofu is a community fork of Terraform 1.5 under the Linux Foundation with the MPL-2.0 license. Commands and HCL are almost the same (`tofu` instead of `terraform`). It adds features such as native state encryption.

### Q30. Is Terraform cloud-agnostic?
The **workflow and language** are the same everywhere, but resources are provider-specific (`aws_instance` is not `google_compute_instance`). You cannot move one config between clouds without rewriting resources.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. State locking and why it matters *(Must-know)*
Locking prevents two `apply` runs from writing state together, which corrupts it. S3 used a DynamoDB table (`dynamodb_table`, now deprecated) and now supports native lock files (`use_lockfile = true`). GCS, Azure Blob and HCP Terraform lock natively. If a run crashes, use `terraform force-unlock <ID>` only after confirming nobody is applying.

### Q32. Secure the S3 state bucket
Versioning on (recover old state), server-side encryption (KMS), block public access, bucket policy limiting to the CI role and platform team, MFA delete or object lock for critical accounts, access logging, and a separate account for state.

### Q33. `terraform import` and `import` blocks *(Must-know)*
Brings an existing resource under Terraform. Modern way (1.5+) is a declarative block that can also **generate config**:
```hcl
import {
  to = aws_s3_bucket.legacy
  id = "ritesh-legacy-bucket"
}
```
```bash
terraform plan -generate-config-out=generated.tf
```
Review the generated code, clean it, then apply. The old CLI `terraform import ADDR ID` only updates state.

### Q34. `moved` blocks: refactor without recreate *(Must-know)*
When you rename a resource or move it into a module, Terraform would destroy and create. A `moved` block tells it the address changed.
```hcl
moved {
  from = aws_instance.web
  to   = module.compute.aws_instance.web
}
```
This is better than `terraform state mv` because it is code-reviewed and works for every consumer of a shared module.

### Q35. `removed` block (1.7+)
Stops managing a resource **without destroying it**.
```hcl
removed {
  from = aws_s3_bucket.old
  lifecycle { destroy = false }
}
```

### Q36. Lifecycle meta-arguments *(Must-know)*
```hcl
resource "aws_instance" "web" {
  lifecycle {
    create_before_destroy = true          # new first, then delete old
    prevent_destroy       = true          # error if plan would delete
    ignore_changes        = [tags["Last"], user_data]
    replace_triggered_by  = [aws_launch_template.lt.latest_version]
  }
}
```
Use `ignore_changes` for fields changed by other systems (autoscaling `desired_capacity`).

### Q37. `precondition` and `postcondition`
Custom checks that fail the plan/apply with a clear message.
```hcl
resource "aws_instance" "web" {
  instance_type = var.type
  lifecycle {
    precondition {
      condition     = contains(["t3.micro","t3.small"], var.type)
      error_message = "Use a small instance type in this account."
    }
  }
}
```
A `check` block (1.5+) runs assertions as warnings after apply, e.g. "is the site returning 200".

### Q38. Dynamic blocks
Generate repeated nested blocks from a collection.
```hcl
resource "aws_security_group" "web" {
  name = "web"
  dynamic "ingress" {
    for_each = var.ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}
```
Do not overuse; it hurts readability.

### Q39. `for` expressions and conditionals
```hcl
locals {
  upper_names = [for n in var.names : upper(n)]
  by_name     = { for u in var.users : u.name => u }
  prod_only   = { for k, v in var.apps : k => v if v.env == "prod" }
}
```
Conditional resource: `count = var.enable_nat ? 1 : 0`.

### Q40. Workspaces: what they are and are not *(Must-know)*
CLI workspaces give multiple state files for one config (`terraform workspace new stage`). They share the same backend and code, so they are **weak isolation** (same credentials). Many teams prefer separate **directories/root modules per environment** with separate backends and accounts. HCP Terraform workspaces are different: each is a full unit with its own variables and state.

### Q41. Module inputs, outputs and versioning
Pass inputs as arguments, read outputs with `module.vpc.private_subnet_ids`. Pin versions: `version = "~> 5.13"` for registry, `?ref=v1.4.0` for Git sources. Outputs not exported cannot be read by the parent.

### Q42. Module design principles
Small and focused, sensible defaults, required inputs minimal, validated variables, no hidden provider blocks inside child modules, clear outputs, a README and examples, semantic versioning, and tests.

### Q43. Provider configuration in modules
Do not put `provider` blocks in reusable modules. Declare `required_providers` in the module and pass configured providers with `providers = { aws = aws.mumbai }`. Use **aliases** for multi-region/account.
```hcl
provider "aws" { alias = "dr" region = "ap-southeast-1" }
module "replica" { source = "./modules/bucket", providers = { aws = aws.dr } }
```

### Q44. Version constraints
`= 1.2.3` exact, `>= 1.2`, `~> 1.2` (allows 1.x, at least 1.2), `~> 1.2.3` (allows 1.2.x). Use `required_version` for Terraform itself and `~>` for providers; the lock file pins the exact result.

### Q45. Handling sensitive values
`sensitive = true` on variables and outputs hides them in CLI output, **but they are still stored in state in plain text**. Protect state, avoid putting secrets in code, and read secrets at runtime from a secret manager.

### Q46. Remote state data source
```hcl
data "terraform_remote_state" "net" {
  backend = "s3"
  config  = { bucket = "acme-tf-state", key = "prod/network/terraform.tfstate", region = "ap-south-1" }
}
# data.terraform_remote_state.net.outputs.vpc_id
```
It couples stacks and exposes all outputs. A looser option is to read through provider data sources (tags, SSM Parameter Store).

### Q47. `terraform state` commands
`state list`, `state show ADDR`, `state mv A B`, `state rm ADDR` (forget, do not destroy), `state pull/push`, `state replace-provider`. Always back up state first and prefer `moved`/`removed`/`import` blocks.

### Q48. `-target`, `-replace` and `-refresh-only`
- `-target=ADDR` limits the plan; use for emergencies only, it skips dependency safety.
- `-replace=ADDR` forces recreation (replaces old `taint`).
- `-refresh-only` updates state to match reality without changing infrastructure.

### Q49. `terraform_data` and provisioners
`terraform_data` (1.4+) replaces `null_resource`: a place to store values and trigger actions with `triggers_replace`. Provisioners (`local-exec`, `remote-exec`) are a **last resort** because they are not declarative and are not tracked in state. Prefer cloud-init, user data, Packer images or configuration tools.

### Q50. `templatefile` and `jsonencode`
```hcl
user_data = templatefile("${path.module}/boot.sh.tftpl", { env = var.env })
policy    = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Action = "s3:GetObject", Resource = "${aws_s3_bucket.logs.arn}/*" }] })
```
Use `jsonencode` or `aws_iam_policy_document` instead of hand-written JSON strings.

### Q51. Common patterns for conditionally creating things
`count = var.create ? 1 : 0`, `for_each = var.create ? { x = 1 } : {}`, and `try(aws_x.this[0].id, null)` to read optional resources.

### Q52. Provider authentication best practices
Never hardcode keys. Use environment credentials, **OIDC federation** from CI (GitHub Actions to AWS role, Workload Identity Federation on GCP, federated credentials on Azure), or instance/role identity. Use least-privilege roles per environment.

### Q53. Using `terraform console`
An interactive shell to test expressions against current state: `cidrsubnet("10.0.0.0/16", 8, 2)`.

### Q54. Dependency graph tools
`terraform graph | dot -Tpng > g.png` draws the graph. Terraform creates independent resources in parallel (default `-parallelism=10`).

### Q55. Splitting state: why and how
One huge state is slow, risky (big blast radius) and hard to permission. Split by lifecycle and ownership: `network`, `data`, `platform`, `app-team-x`. Connect through outputs, data sources or SSM parameters.

### Q56. Environments strategy options
1. **Directories per env** with shared modules (clear, explicit, DRY with modules).
2. **Workspaces** (simple, weak isolation).
3. **Terragrunt** or similar wrapper (DRY backend/provider config).
4. **HCP Terraform / Stacks** (managed multi-deployment).
Choose by blast-radius needs and team size.

### Q57. Meta-argument `provider` and `depends_on` for modules
Modules accept `count`, `for_each`, `depends_on` and `providers`. A `depends_on` on a module makes all its data sources defer to apply time, which can cause extra diff noise, so use sparingly.

### Q58. `try`, `can`, `coalesce`, `lookup`
`try(a.b, "default")` returns the first expression that does not error. `can(expr)` returns true/false (good in validation). `lookup(map, key, default)` reads maps safely.

### Q59. Tags that cause constant diffs
Provider-managed tags (autoscaling, `default_tags` overlap) can show perpetual diffs. Fix with `ignore_changes`, correct `default_tags` usage, or `tags_all` awareness.

### Q60. Basic Terraform CI pipeline
`fmt -check` → `init -backend=false` + `validate` → `tflint` → security scan (Trivy/Checkov) → `plan -out` posted to the PR → human approval → `apply tfplan` on merge to main.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Design a multi-environment, multi-account layout *(Must-know)*
- One AWS account (or GCP project / Azure subscription) per environment and per sensitive domain.
- Repo structure: `modules/` (versioned, reusable), `live/<account>/<region>/<stack>/` (roots).
- Each root has its own backend key and role; CI assumes a role per account through OIDC.
- Promote changes dev → stage → prod by merging the same module version bump.
- Keep a thin "bootstrap" stack that creates state buckets, OIDC roles and baseline guardrails.

### Q62. Remote state security and access model
State bucket in a dedicated tooling account, KMS key, access limited to pipeline roles and a small admin group, read-only role for developers who need `plan`, and no human write access in production. Enable object versioning plus alerts on unusual access.

### Q63. Handling secrets properly *(Must-know)*
Options: pass secrets as environment variables from the CI secret store; read from AWS Secrets Manager / Parameter Store / Vault with a data source (the value still lands in state); generate with `random_password` and write it **directly** into the secret manager; use **ephemeral resources and write-only attributes** (1.10/1.11+) so values never enter state; use OpenTofu state encryption; or let the service manage its own password (for example RDS `manage_master_user_password = true`).

### Q64. Ephemeral resources and write-only arguments
New in Terraform 1.10–1.11: an `ephemeral` block or variable is available during a run but is **not stored** in plan or state.
```hcl
ephemeral "aws_secretsmanager_secret_version" "db" { secret_id = aws_secretsmanager_secret.db.id }
resource "aws_db_instance" "main" {
  password_wo         = ephemeral.aws_secretsmanager_secret_version.db.secret_string
  password_wo_version = 1
}
```
Support depends on provider and resource version (verify).

### Q65. Refactoring a large codebase safely
Add `moved` blocks, run plan and confirm there are **no destroys**, use `import` blocks for adopted resources, split state with `removed` + `import` in two steps (remove from old state without destroy, import into the new), and run changes in dev first.

### Q66. Zero-downtime replacements
Use `create_before_destroy`, unique-name patterns (`name_prefix`) to avoid naming conflicts, blue/green modules (two ASGs or target groups with a weight variable), and load balancer health checks. Understand which attribute changes force replacement (look for `# forces replacement` in the plan).

### Q67. Testing Terraform code *(Must-know)*
Layers:
1. `fmt`, `validate`, `tflint`.
2. Policy and security static scans (Checkov, Trivy, OPA/Conftest, Sentinel).
3. Native **`terraform test`** (`.tftest.hcl`, 1.6+) with `command = plan` (fast, no cloud) or `apply` (real resources), plus **mock providers** (1.7+).
4. Integration tests with real cloud: **Terratest** (Go), Kitchen-Terraform, or `terraform test` in a sandbox account with auto-cleanup.
```hcl
# tests/vpc.tftest.hcl
run "creates_three_subnets" {
  command = plan
  variables { az_count = 3 }
  assert {
    condition     = length(aws_subnet.private) == 3
    error_message = "Expected 3 private subnets"
  }
}
```

### Q68. Policy as code
- **Sentinel** (HCP Terraform, paid), **OPA/Rego** via `conftest` on `terraform show -json tfplan`, **Checkov**, **Trivy** (replaced tfsec), **tflint** with cloud rulesets, and cloud-native guardrails (AWS SCPs, GCP Org Policy, Azure Policy).
- Examples: "no public S3 buckets", "all resources must have owner tag", "only approved instance types".
- Enforce both pre-merge (plan checks) and runtime (cloud policies), since Terraform checks cannot stop console changes.

### Q69. Terragrunt: when and why
A wrapper that keeps backend/provider config DRY, orchestrates dependencies between stacks (`dependency` blocks, `run-all`), and generates files. Useful with many accounts/regions. Trade-off: another tool, another layer to debug. Alternatives: Terraform Stacks (HCP), Terramate, plain scripts, or Terraform with generated backend config.

### Q70. Atlantis vs HCP Terraform vs GitHub Actions
| Option | How it works | Notes |
|---|---|---|
| Atlantis | Self-hosted; comments `atlantis plan/apply` on PRs | Free, you run and secure it |
| HCP Terraform / TFE | Managed runs, state, policy, private registry, SSO | Paid tiers, remote execution |
| GitHub Actions/GitLab CI | Your own workflow | Flexible; you build locking, approvals, drift jobs |
| Spacelift / env0 / Scalr | Commercial TACOS | Policies, drift detection, stacks |

### Q71. Provider version upgrades
Read the changelog and upgrade guide, bump the constraint in a branch, run `init -upgrade`, run plan in every environment, fix deprecations, commit the lock file, roll out dev → prod. Use Renovate/Dependabot to automate PRs.

### Q72. Upgrading Terraform itself
Minor versions are safe in general, but state is upgraded one-way (older binaries may refuse the new state). Pin `required_version`, upgrade CI and developers together, and avoid skipping major versions.

### Q73. Terraform on Kubernetes and Helm
`kubernetes` and `helm` providers can deploy to clusters, but split **cluster creation** from **in-cluster apps** into separate states (provider configuration depends on the cluster existing). For app delivery many teams prefer GitOps (Argo CD, Flux) and keep Terraform for the cluster and cloud resources. See `046_Kubernetes.md`.

### Q74. Managing IAM and permissions at scale
Create roles and policies as modules with `aws_iam_policy_document`, use permission boundaries, separate "plan" (read) and "apply" (write) roles, deliver roles per stack, and avoid wildcards. Use Access Analyzer / IAM Recommender to tighten later.

### Q75. Handling dependencies between stacks
Prefer explicit contracts: outputs → SSM Parameter Store / Secrets / `terraform_remote_state` / data sources by tag. Use pipeline ordering (network before app). Avoid circular references between stacks.

### Q76. Performance of large plans
Reduce state size (split), use `-refresh=false` only when safe, increase `-parallelism`, avoid expensive data sources in loops, cache providers (`TF_PLUGIN_CACHE_DIR`), and watch provider rate limits (add retry settings).

### Q77. Handling API rate limiting and eventual consistency
Retry with provider options (`max_retries`), reduce parallelism, split large states, and add `time_sleep` (from the `time` provider) only when a resource needs settle time, after confirming the real cause.

### Q78. Resource naming collisions and global names
S3 bucket names, DNS names and storage accounts are global. Use a prefix with account id/org, `random_id` stored in state, or `bucket_prefix`. Changing a random keeper forces replacement, so protect it.

### Q79. Migrating from console-built infrastructure
Inventory resources, write modules for the target design, `import` blocks with `-generate-config-out`, plan until it shows no diff, then move to the pipeline. Do not try to import everything in one weekend; migrate by service or application.

### Q80. Handling drift detection at scale
Scheduled `plan -detailed-exitcode` (0 none, 1 error, 2 changes) per stack in CI; HCP Terraform health assessments; tickets or Slack alerts on drift. Decide per resource: revert, accept in code, or `ignore_changes`.

### Q81. Blast-radius control
Small states, separate credentials per stack, `prevent_destroy` on data stores, required approvals for destroys, plan review for `-/+`, deletion protection flags on cloud resources, and backups.

### Q82. Cost control with Terraform
Run **Infracost** on PRs to show monthly cost deltas, enforce tags for cost allocation, use budgets as code, restrict instance classes with validation or policy, and schedule non-prod shutdown.

### Q83. Module registries
Public Terraform Registry, private registry (HCP Terraform, Artifactory, GitLab, GitHub via Git tags). Use semantic versions, changelogs, and example folders. Consume community modules (`terraform-aws-modules`) carefully: read the code, pin the version, check maintenance.

### Q84. OpenTofu-specific features (verify per version)
State and plan **encryption**, provider iteration with `for_each` in provider blocks (1.9), early variable/local evaluation in backend and module `source` (1.8), `-exclude` flag, the `tofu` binary and a separate registry. Most HCL is compatible with Terraform 1.5/1.6 features; newer Terraform features may not exist in OpenTofu.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design a platform for 50 teams using Terraform *(Must-know)*
1. **Account vending** (control tower / landing zone) via Terraform: accounts, baseline guardrails, OIDC roles, state locations.
2. **Golden modules** owned by a platform team, versioned in a private registry, with tests and policy checks.
3. **Self-service**: teams create a stack by PR from a template; pipeline plans/applies with per-stack roles.
4. **Guardrails** at three layers: static scan in PR, policy engine at plan, cloud policies (SCP/Org Policy/Azure Policy) at runtime.
5. **Observability**: run metrics, drift jobs, cost deltas, ownership tags.
6. **Escape hatches**: allow teams to write their own modules inside a safe boundary.
Trade-off: strong standardization vs. team autonomy; measure adoption and lead time.

### Q86. Terraform vs Pulumi vs CloudFormation/CDK vs Bicep vs Crossplane *(Must-know)*
| Tool | Language | State | Strength | Weakness |
|---|---|---|---|---|
| Terraform/OpenTofu | HCL | Own state (remote) | Multi-cloud, huge ecosystem | Limited language logic, state ops |
| Pulumi | TS/Python/Go/C# | Own state or service | Real programming languages | Smaller ecosystem, harder to enforce simplicity |
| CloudFormation | YAML/JSON | AWS-managed | Deep AWS support, no state to manage, rollbacks | AWS only, verbose |
| AWS CDK | TS/Python/Java… | Via CloudFormation | Constructs, typed code | AWS only, CFN limits |
| Bicep / ARM | Bicep DSL | Azure-managed | Day-0 Azure support | Azure only |
| Crossplane | K8s CRDs | Kubernetes etcd | Continuous reconciliation, platform APIs | Kubernetes expertise, learning curve |
Pick by cloud footprint, team skills and the need for continuous reconciliation. CDKTF was announced for sunset by HashiCorp (verify current status).

### Q87. Advanced state surgery
Cases: splitting a state, merging states, moving resources between backends, and recovering from a corrupted state.
- Prefer declarative `moved`/`import`/`removed` blocks.
- For cross-state moves: `terraform state pull` both, back up, `state rm` from source (or `removed` block with `destroy=false`), `import` into the target, then plan until clean.
- Corrupted state: restore a previous S3 object version, then plan; re-import anything missing.
- Always freeze pipelines while doing surgery.

### Q88. Safe changes to resources that force replacement
Look for `# forces replacement`. Options: create the new resource beside the old (new name), switch traffic, then remove the old; use `create_before_destroy`; use `moved` if only addresses changed; for data stores, use snapshot restore and promote. Never apply a `-/+` on a database without a backup plan.

### Q89. Designing a module API that lasts
Few, meaningful inputs; use `object` variables with `optional()` defaults so you can add fields without breaking callers:
```hcl
variable "db" {
  type = object({
    engine_version = string
    instance_class = optional(string, "db.t4g.medium")
    multi_az       = optional(bool, true)
    backup_days    = optional(number, 7)
  })
}
```
Keep outputs stable, deprecate with notes, version with semver, and write an upgrade guide for breaking changes (`moved` blocks inside the module help consumers).

### Q90. Multi-region and disaster recovery with Terraform
Provider aliases per region, module with `providers` map, replicated resources (S3 CRR, Aurora global, DynamoDB global tables), DNS failover. Keep DR stack in a **separate state** and region so a regional outage does not block you from applying. Practice running a DR apply from a clean machine.

### Q91. Breaking the "chicken and egg" bootstrap
The state bucket and CI role must exist before Terraform manages them. Bootstrap once with local state (or a CLI script), create the bucket and role, then migrate state with `terraform init -migrate-state`. Optionally import the bootstrap resources into a protected stack.

### Q92. Secure supply chain for Terraform
Pin providers/modules by version and lock file checksums; mirror providers into an internal registry (`provider_installation` network mirror); verify signatures; review third-party modules; scan with Trivy/Checkov; sign module releases; limit outbound network from CI runners; restrict who can change pipeline definitions.

### Q93. Pipeline security for apply
Short-lived OIDC credentials, one role per stack/environment, separate plan and apply identities, protected branches, required reviewers, no `-auto-approve` in prod except via approved apply of the saved plan, audit logs, and no secrets in plan output (mask sensitive values).

### Q94. Plan-file integrity
A saved plan can contain sensitive data. Store it encrypted with short retention, apply the same plan that was approved, and make sure it expires if state changes (Terraform rejects a stale plan whose state serial changed).

### Q95. Handling large `for_each` maps and unknown values
`for_each` keys must be known at plan time. If keys come from a resource not yet created, you get "Invalid for_each argument". Fixes: use static keys (names from input), split into two applies/stacks, or restructure so keys are inputs and values come from resources.

### Q96. Managing Kubernetes/EKS/GKE platforms with Terraform
Use cloud-provider modules for the cluster, separate state for add-ons, avoid circular provider config, manage IAM for service accounts (IRSA/Workload Identity), and hand application delivery to GitOps. Upgrades: change `kubernetes_version` one minor at a time, test node group replacement behavior.

### Q97. Choosing between Terraform workspaces, directories and Stacks
- Few similar envs, small team → directories with shared module, or workspaces with disciplined variables.
- Many accounts/regions with same shape → Terragrunt, Terramate, or HCP Terraform **Stacks** (declare components and deployments once).
- Whatever you choose: separate credentials and state per environment.

### Q98. Observability for IaC
Track: run duration, failure rate, drift count, mean time to apply, number of manual console changes (CloudTrail), policy violations, module version spread. Alert on failed prod applies and unexpected destroys.

### Q99. Moving from Terraform to OpenTofu or back
Check feature use: for versions up to 1.5 the state format is compatible; later Terraform-only features may not exist. Steps: pin versions, run `tofu init`, run plan and confirm no diff, update CI images and registry sources, then test rollback. Evaluate licensing, support and ecosystem needs rather than switching only for fashion.

### Q100. Preventing unsafe deletes
`prevent_destroy` (code-level, stops plan, but is removed if the block is deleted), cloud deletion protection (RDS, ALB, S3 object lock), IAM that denies destructive actions to the pipeline role in prod, plan checks that fail on `delete` actions in JSON plan for protected types, and break-glass approval.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. IaC strategy and operating model *(Must-know)*
Define: what is codified (everything in prod), who owns modules (platform team) and stacks (product teams), how changes flow (PR → plan → policy → approval → apply), how exceptions work, how drift is handled, and what metrics prove value (lead time, change failure rate, manual-change count). Start with the highest-risk areas (network, IAM, data) and grow.

### Q102. Governance without slowing teams
Paved roads: ready modules and templates, automated checks that give fast feedback, policy with clear messages, tiered approvals (low-risk auto, high-risk human), and a documented exception path with expiry. Review rules quarterly using violation data.

### Q103. Multi-cloud IaC decisions
Use one tool for consistency (Terraform/OpenTofu) but do not pretend clouds are the same. Abstract only where the concept is truly shared (DNS, Kubernetes, observability). Keep cloud-specific modules separate. Count the real cost: skills, tooling and incident complexity.

### Q104. State at enterprise scale
Tens of thousands of resources: split by ownership and change rate, central state platform (HCP Terraform or object store with strict IAM), retention and backup policy, break-glass procedure, regular restore drills, and a naming scheme for state keys.

### Q105. Compliance and audit
Map controls (CIS, SOC 2, ISO 27001, PCI) to policy checks; keep Git history and run logs as evidence; separate duties (authors cannot approve their own prod apply); log every apply with commit SHA; use cloud config rules to detect out-of-band changes.

### Q106. Migration programme from ClickOps to IaC
Phase 1 inventory and standards. Phase 2 baseline stacks (accounts, network, IAM). Phase 3 import and codify by domain with "no manual change" rules. Phase 4 enforce with SCPs/read-only console for prod. Measure: percentage of resources managed, drift events, incidents caused by manual change.

### Q107. Build vs buy: HCP Terraform / TACOS vs self-hosted
Self-hosted (Atlantis, GitHub Actions) is cheap in licence cost but costs engineering time for locking, policy, RBAC and support. Managed platforms give SSO, audit, policy, private registry and drift detection. Decide by team size, compliance needs and licensing/vendor-risk appetite (including BSL and IBM ownership).

### Q108. Disaster recovery for the IaC platform itself
If the pipeline or state is lost, can you rebuild? Keep state versioned and replicated cross-region, keep code in a mirrored Git, document a break-glass local apply path with a hardware-protected role, and run a game day.

### Q109. Developer experience
Fast feedback (pre-commit hooks, `terraform test` with mocks), good module docs (`terraform-docs`), examples, a `make` or task runner, ephemeral dev environments with auto-destroy, and templates for new services.

### Q110. Communicating IaC decisions to leadership
Use outcomes: "Provisioning time went from 3 days to 20 minutes, 0 prod incidents from manual changes in 2 quarters, 35% cost saved through tag enforcement and rightsizing, audit evidence generated automatically." Present risks (state, secrets, vendor/licence) with mitigations and a roadmap.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Versions, backend and provider baseline
```hcl
terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "prod/app/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    kms_key_id   = "alias/tf-state"
    use_lockfile = true
  }
}
provider "aws" {
  region = "ap-south-1"
  default_tags { tags = { Owner = "ritesh.kumar", ManagedBy = "terraform", Env = var.env } }
}
```

### H2. Reusable VPC-style module with validation and optional() inputs
```hcl
# modules/network/variables.tf
variable "name" { type = string }
variable "cidr" {
  type = string
  validation {
    condition     = can(cidrnetmask(var.cidr))
    error_message = "cidr must be a valid IPv4 CIDR."
  }
}
variable "azs" { type = list(string) }

# modules/network/main.tf
resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true
  tags                 = { Name = var.name }
}
resource "aws_subnet" "private" {
  for_each          = { for i, az in var.azs : az => i }
  vpc_id            = aws_vpc.this.id
  availability_zone = each.key
  cidr_block        = cidrsubnet(var.cidr, 4, each.value)
  tags              = { Name = "${var.name}-private-${each.key}" }
}

# modules/network/outputs.tf
output "vpc_id"             { value = aws_vpc.this.id }
output "private_subnet_ids" { value = [for s in aws_subnet.private : s.id] }
```

### H3. Calling the module per environment
```hcl
module "network" {
  source = "git::https://github.com/acme/tf-modules.git//network?ref=v1.4.0"
  name   = "app-${var.env}"
  cidr   = "10.20.0.0/16"
  azs    = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
}
```

### H4. Security group with dynamic block and for_each
```hcl
variable "ingress" {
  type = map(object({ port = number, cidrs = list(string) }))
  default = {
    https = { port = 443, cidrs = ["0.0.0.0/0"] }
    admin = { port = 22,  cidrs = ["10.0.0.0/8"] }
  }
}
resource "aws_security_group" "web" {
  name   = "web-${var.env}"
  vpc_id = module.network.vpc_id
  dynamic "ingress" {
    for_each = var.ingress
    content {
      description = ingress.key
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = ingress.value.cidrs
    }
  }
}
```

### H5. Hardened S3 bucket with protected lifecycle
```hcl
resource "aws_s3_bucket" "data" {
  bucket = "acme-data-${var.env}-${data.aws_caller_identity.me.account_id}"
  lifecycle { prevent_destroy = true }
}
resource "aws_s3_bucket_public_access_block" "data" {
  bucket                  = aws_s3_bucket.data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "aws:kms" } }
}
```

### H6. Refactor with moved and import blocks
```hcl
moved {
  from = aws_s3_bucket.logs
  to   = module.logging.aws_s3_bucket.this
}
import {
  to = aws_iam_role.legacy_ci
  id = "legacy-ci-role"
}
```
Run `terraform plan` and check it shows **0 to destroy**.

### H7. Native test with mock provider
```hcl
# tests/bucket.tftest.hcl
mock_provider "aws" {}
variables { env = "test" }

run "bucket_blocks_public_access" {
  command = plan
  assert {
    condition     = aws_s3_bucket_public_access_block.data.block_public_policy == true
    error_message = "Public policy must be blocked"
  }
}
```
Run with `terraform test`.

### H8. GitHub Actions pipeline with OIDC (no static keys)
```yaml
name: terraform
on:
  pull_request:
  push: { branches: [main] }
permissions: { id-token: write, contents: read, pull-requests: write }
jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with: { terraform_version: 1.9.8 }
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111122223333:role/tf-plan
          aws-region: ap-south-1
      - run: terraform fmt -check -recursive
      - run: terraform init -input=false
      - run: terraform validate
      - run: terraform plan -input=false -out=tfplan
      - uses: actions/upload-artifact@v4
        with: { name: tfplan, path: tfplan, retention-days: 3 }
  apply:
    if: github.ref == 'refs/heads/main'
    needs: plan
    environment: production   # required reviewers
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::111122223333:role/tf-apply
          aws-region: ap-south-1
      - uses: actions/download-artifact@v4
        with: { name: tfplan }
      - run: terraform init -input=false && terraform apply -input=false tfplan
```

### H9. Policy check on JSON plan with OPA/Conftest
```bash
terraform show -json tfplan > plan.json
conftest test plan.json -p policy/
```
```rego
package main
deny[msg] {
  r := input.resource_changes[_]
  r.type == "aws_s3_bucket"
  r.change.after.tags.Owner == null
  msg := sprintf("%s is missing Owner tag", [r.address])
}
```

### H10. Drift detection job
```bash
terraform plan -detailed-exitcode -input=false
# exit 0 = no changes, 1 = error, 2 = drift (notify Slack)
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `Error acquiring the state lock`
Another run holds the lock, or a crashed run left it. Check the lock info (ID, who, when). If truly stale, `terraform force-unlock <ID>`. With S3 lock files, delete only after confirming no process is running.

### D2. Plan wants to destroy and recreate a resource
Read `# forces replacement` to find the attribute. Causes: renamed address (use `moved`), changed immutable field, provider upgrade, changed `for_each` key. Revert the change, add `moved`, or accept replacement with a safe strategy.

### D3. "Invalid for_each argument ... depends on resource attributes that cannot be determined until apply"
Keys come from values not known at plan. Use static keys, split into two stacks/applies, or use a `-target` apply only as a one-time bootstrap.

### D4. Cycle error: "Cycle: aws_security_group.a, aws_security_group.b"
Two resources reference each other. Break it with separate `aws_security_group_rule` resources instead of inline rules.

### D5. State and reality disagree (resource deleted manually)
`plan` shows creation. If you do want it back, apply. If it should be gone, `terraform state rm` or a `removed` block.

### D6. "Resource already exists" (409 / AlreadyExists)
The resource was created outside Terraform or state was lost. Import it with an `import` block, then plan until clean.

### D7. Perpetual diff on every plan
Provider normalizes values (JSON ordering, case, trailing dots), tags set by another system, or computed fields. Fix with `jsonencode`, correct casing, `ignore_changes`, or upgrade the provider.

### D8. `Error: Provider produced inconsistent result after apply`
Provider bug or eventual consistency. Re-run plan/apply, upgrade/downgrade the provider, and report a bug with `TF_LOG=DEBUG` output.

### D9. `Error: Failed to query available provider packages` / lock file mismatch
Network or mirror issue, or the lock file lacks checksums for the current platform. Run `terraform providers lock -platform=linux_amd64 -platform=darwin_arm64`.

### D10. Access denied during apply
Wrong role or missing permission. Check which identity is used (`aws sts get-caller-identity`), read the exact denied action, update the IAM policy for the pipeline role, check SCPs and permission boundaries.

### D11. Sensitive value leaked in logs or plan
Mark variables/outputs `sensitive`, never print secrets in `local-exec`, mask in CI, rotate the secret, and remember state still stores it. Restrict state and plan artifact access.

### D12. Slow plan (30+ minutes)
Huge state, many data sources, throttled APIs. Split the state, reduce data lookups, raise `-parallelism` carefully, use `-refresh=false` for known-safe runs, and cache providers.

### D13. Partial apply left half-built stack
Terraform records what succeeded. Fix the error and run apply again; it continues. Do not delete state. If a resource is tainted/failed, plan shows replace.

### D14. Module upgrade shows a big diff
Read the module changelog, compare inputs, add `moved` blocks (maintainer should supply them), pin back to the previous version, and test in dev first.

### D15. `terraform destroy` fails (resource in use)
Dependencies outside Terraform (non-empty S3 bucket, ENIs attached, security group used elsewhere). Empty the bucket (`force_destroy` where allowed), detach, then retry.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `sensitive = true` encrypt the value in state?
No. It only hides it in CLI output. State stores plain text, so secure the backend.

### T2. Does `terraform plan` change anything?
It does not change infrastructure. With some backends it takes a lock, and it refreshes in memory, but it does not write resources (`-refresh-only apply` writes state).

### T3. Is `terraform destroy` the same as deleting the state file?
No. Deleting state leaves real resources running but forgotten (orphaned).

### T4. Does `count = 0` delete the resource?
Yes, instances beyond the count are destroyed on next apply.

### T5. Can you use variables in `backend` blocks?
Not in Terraform (backend is evaluated early); use `-backend-config` files or partial config. OpenTofu 1.8+ allows variables/locals there.

### T6. Is `depends_on` needed most of the time?
No. Implicit references are enough. Overusing `depends_on` hides intent and slows plans.

### T7. Do workspaces give security isolation?
No. They share the same backend and credentials by default.

### T8. Does `prevent_destroy` stop a `terraform destroy` if you delete the block?
No. If you remove the resource block (or the lifecycle line), the protection is gone. Use cloud deletion protection too.

### T9. Does `ignore_changes` hide drift forever?
It ignores listed attributes on updates. Terraform will not revert them, so you can lose track of intended config.

### T10. Does `terraform apply` always create resources in the order written in the file?
No. Order follows the dependency graph; independent resources run in parallel.

### T11. Is Terraform "idempotent"?
Yes: applying the same config twice yields no changes the second time, if the provider and config are well-behaved.

### T12. Can Terraform manage resources that already exist?
Yes, after `import` (block or CLI). Without import it tries to create and may fail or duplicate.

### T13. Is `terraform taint` still recommended?
No. It is deprecated; use `terraform apply -replace=ADDR`.

### T14. Can two teams use the same state file safely?
Not recommended. Locks serialize runs, but one big state creates blast radius and permission problems.

### T15. Is OpenTofu a drop-in replacement forever?
Mostly for older HCL, but the projects diverge (state encryption in OpenTofu, ephemeral resources in Terraform). Verify per version.

### T16. Does changing a module version always update resources?
Only if the new code changes resource arguments or addresses. Always read the plan.

### T17. Does `null_resource` still make sense?
Prefer `terraform_data`. Both are escape hatches, not primary patterns.

### T18. Can outputs reference sensitive values without marking them?
No; Terraform errors unless the output is marked `sensitive = true` (or you use `nonsensitive()` knowingly).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **IaC language of Terraform?** HCL.
- **Download providers?** `terraform init`.
- **Show diff?** `terraform plan`.
- **Make changes?** `terraform apply`.
- **Format code?** `terraform fmt`.
- **Check syntax?** `terraform validate`.
- **Where is state kept?** Local file or remote backend.
- **Lock state in S3?** `use_lockfile = true` (older: DynamoDB).
- **Stable collection loops?** `for_each`.
- **Rename without recreate?** `moved` block.
- **Adopt existing resource?** `import` block.
- **Stop managing, keep resource?** `removed` block / `state rm`.
- **Force recreate?** `-replace=ADDR`.
- **Protect from delete?** `prevent_destroy` + cloud deletion protection.
- **Reusable unit?** Module.
- **Pin providers?** `required_providers` + lock file.
- **Hide output?** `sensitive = true`.
- **Run tests?** `terraform test`.
- **Static security scan?** Trivy, Checkov.
- **Lint?** tflint.
- **Policy as code?** Sentinel, OPA.
- **PR automation?** Atlantis / HCP Terraform / Actions.
- **Cost on PR?** Infracost.
- **Drift check exit code?** `plan -detailed-exitcode` → 2.
- **Fork of Terraform?** OpenTofu.
- **Python/TS alternative?** Pulumi.
- **AWS-native IaC?** CloudFormation / CDK.
- **Azure-native IaC?** Bicep.
- **K8s-native IaC?** Crossplane.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an IaC platform you built.
STAR: "Our infra was built by hand across 12 AWS accounts. I led a move to Terraform: an account bootstrap, a private registry with 25 versioned modules, a GitHub Actions pipeline using OIDC, Conftest policies and Infracost. New environment time dropped from 3 days to 40 minutes, manual console changes fell 90%, and audit evidence came from Git history."

### P2. Describe a risky state change you handled.
"We had to split a 4,000-resource state. I froze the pipeline, backed up versions, used `removed` blocks with `destroy=false` plus `import` blocks in the new stack, checked plans showed zero changes in both, and rolled out dev first. No downtime."

### P3. How did you handle secrets in Terraform?
"We removed passwords from variables. RDS used managed master passwords, other secrets came from Secrets Manager via ephemeral resources, state was KMS-encrypted with narrow access, and CI masked values. A scan found zero plain-text secrets in code."

### P4. Describe an incident caused by Terraform.
"A module bump renamed a security group and the plan showed `-/+` that we missed in a large diff. Production traffic dropped for 4 minutes. We added a policy that fails on destroys for protected types, required `moved` blocks in module releases, and summarised plan actions in the PR comment."

### P5. Workspaces vs directories?
"Directories (or separate roots) per environment with shared versioned modules, because each gets its own backend, credentials and approvals. Workspaces are fine for short-lived feature environments."

### P6. How do you keep teams from drifting?
"Read-only console in prod, SCP/Org Policy guardrails, nightly drift plans with alerts, and a rule that every manual hotfix gets a follow-up PR within a day."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Foundations:** IaC concepts, declarative vs imperative, idempotency, drift, immutable infrastructure.
- **Workflow and CLI:** init, fmt, validate, plan, apply, destroy, console, graph, providers lock, `-target`, `-replace`, `-refresh-only`, `-detailed-exitcode`.
- **Language:** blocks, variables (types, validation, sensitive), locals, outputs, expressions, `for` expressions, conditionals, functions, `count`, `for_each`, `dynamic`, `optional()`.
- **Providers and versions:** required_providers, aliases, lock file, mirrors, upgrade strategy.
- **State:** local vs remote, locking, encryption, versioning, `state` subcommands, `moved`, `import`, `removed`, splitting and merging.
- **Modules:** structure, versioning, registries, interface design, testing.
- **Environments:** directories, workspaces, Terragrunt, HCP Terraform, Stacks.
- **Lifecycle:** `create_before_destroy`, `prevent_destroy`, `ignore_changes`, `replace_triggered_by`, pre/postconditions, `check`.
- **Quality and security:** tflint, Trivy, Checkov, OPA, Sentinel, `terraform test`, Terratest, Infracost.
- **Delivery:** GitHub Actions, GitLab CI, Atlantis, HCP Terraform, OIDC, approvals, drift jobs.
- **Secrets:** sensitive values, ephemeral resources, write-only arguments, secret managers, state encryption.
- **Alternatives:** OpenTofu, Pulumi, CloudFormation/CDK, Bicep, Crossplane, Ansible, Packer.

## Mixed topics
- Terraform + AWS/Azure/GCP (`048_AWS.md`, `049_Azure.md`, `050_GCP.md`): provider specifics, landing zones, OIDC federation.
- Terraform + containers/Kubernetes (`045_Docker.md`, `046_Kubernetes.md`): clusters, Helm provider, GitOps boundary.
- Terraform + CI/CD (`047_CI-CD-and-DevOps.md`): pipelines, approvals, environments.
- Terraform + monitoring (`052_Monitoring-and-Observability.md`): dashboards and alerts as code.
- Terraform + Git (`025_Git-and-GitHub.md`): branching, PR review, tags for module releases.
- Terraform + security (`../03_Backend/036_Authentication-and-Security.md`): least privilege, secrets, supply chain.

---

# 🔬 Part 12: Terraform Internals

### I1. Core and providers
Terraform has a **core** (CLI, config parser, graph engine, state manager) and **providers** that run as separate processes. Core talks to providers over gRPC using the plugin protocol (`GetProviderSchema`, `ValidateResourceConfig`, `PlanResourceChange`, `ApplyResourceChange`, `ReadResource`, `ImportResourceState`). Providers wrap cloud SDKs.

### I2. Dependency graph
Core builds a directed acyclic graph from references, `depends_on`, module relationships and provider configuration. Nodes are resources, data sources, variables, outputs and providers. Walks the graph in parallel (default 10), with create order forward and destroy order reversed.

### I3. Plan phases
Load config → load state → refresh (read real objects) → compare desired and prior state → provider computes planned changes (including "known after apply" values) → render plan. A saved plan file contains the config snapshot, prior state and actions.

### I4. Apply phase
Walks the graph, calls providers to create/update/delete, writes state incrementally after each resource (so partial failures are recorded), then writes outputs. Errors stop new work but let running operations finish.

### I5. State format
JSON with `version`, `terraform_version`, `serial` (increments on change), `lineage` (unique id), `outputs` and `resources` (each with `mode`, `type`, `name`, `provider`, and `instances` with attributes). Serial and lineage let backends detect stale or foreign state.

### I6. Locking mechanics
Backends implement a lock (S3 conditional-write lock file or DynamoDB item, blob lease, GCS object). The lock stores an ID, operation, who and when. Only the holder can write state.

### I7. Unknown values and `for_each` timing
During planning, attributes computed by the cloud are "unknown". Expressions with unknowns propagate, but `count`/`for_each` need known values because Terraform must decide instance addresses before applying.

### I8. Provider lock and registry protocol
`.terraform.lock.hcl` stores provider version and hashes (`h1:` from zip contents, `zh:` from registry zip). Registry protocol serves versions and download URLs, signed with GPG. A network mirror or filesystem mirror can replace direct registry access.

### I9. Module loading
`init` downloads module sources (registry, Git, local, S3, GCS) into `.terraform/modules` and tracks them in `modules.json`. Modules are expanded into the same graph with module-qualified addresses (`module.net.aws_vpc.this`).

---

# 📊 Part 13: Reference Tables

### Core commands
| Command | Purpose |
|---|---|
| `init` | Install providers/modules, set backend |
| `plan` / `apply` / `destroy` | Preview / change / remove |
| `fmt` / `validate` | Style / syntax check |
| `state list/show/mv/rm` | Inspect and edit state |
| `import` | Adopt existing resource |
| `output` | Show outputs |
| `console` | Evaluate expressions |
| `providers lock` | Add platform hashes |
| `test` | Run `.tftest.hcl` tests |
| `force-unlock` | Release a stuck lock |

### count vs for_each
| Aspect | `count` | `for_each` |
|---|---|---|
| Input | number | map or set of strings |
| Address | `res[0]` | `res["key"]` |
| Remove middle item | Shifts others (recreates) | Only that item |
| Best for | on/off switches | collections |

### State backends
| Backend | Locking | Notes |
|---|---|---|
| Local | File lock | Only for learning |
| S3 | `use_lockfile` (or DynamoDB) | Enable versioning + KMS |
| GCS | Native | Versioning on bucket |
| azurerm | Blob lease | Storage account + RBAC |
| HCP Terraform | Native | Runs, policy, history |
| PostgreSQL / Consul | Native | Self-managed |

### Tool comparison
| Tool | Language | State | Cloud scope |
|---|---|---|---|
| Terraform / OpenTofu | HCL | Yes | Multi |
| Pulumi | General languages | Yes | Multi |
| CloudFormation / CDK | YAML / code | AWS-managed | AWS |
| Bicep | DSL | Azure-managed | Azure |
| Crossplane | K8s YAML | etcd | Multi |
| Ansible | YAML | None | Config mgmt, some provisioning |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| `import` block | Terraform 1.5 |
| `check` block | 1.5 |
| `terraform test` | 1.6 (mocks in 1.7) |
| `removed` block | 1.7 |
| S3 `use_lockfile` | 1.10 experimental, stable in 1.11; DynamoDB lock deprecated |
| Ephemeral resources / write-only | 1.10 / 1.11 |
| `terraform taint` | Deprecated, use `-replace` |
| OpenTofu state encryption | 1.7 |
| Terraform Cloud | Renamed HCP Terraform |
| CDKTF | Sunset announced (verify) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
`count = 3` on a list of users; first user is removed from the list.
**Result:** indexes shift, so instances 0, 1 change and the last is destroyed (use `for_each`).

### O2.
Plan output shows `~ instance_type: "t3.micro" -> "t3.small"` and no `forces replacement`.
**Result:** updated in place.

### O3.
Rename `aws_instance.web` to `aws_instance.app` with no `moved` block.
**Result:** plan shows destroy of old and create of new.

### O4.
`terraform apply` fails midway on resource 5 of 10.
**Result:** resources 1–4 stay created and recorded in state; fixing and re-running continues.

### O5.
Two engineers run `apply` at the same time on S3 backend with locking.
**Result:** the second gets "Error acquiring the state lock".

### O6.
Variable `env` has validation allowing only dev/stage/prod; `-var env=qa`.
**Result:** error with the custom message at plan time.

### O7.
`terraform plan -detailed-exitcode` when drift exists.
**Result:** exit code 2.

### O8.
`ignore_changes = [tags]` and someone edits tags in the console.
**Result:** next plan shows no change; the manual tag stays.

### O9.
`prevent_destroy = true` and you run `terraform destroy`.
**Result:** error, nothing is destroyed.

### O10.
Output marked `sensitive = true`; run `terraform output name`.
**Result:** hides in plan, but `terraform output name` prints the raw value; `-json` also shows it. State still has it.

### O11.
`for_each = toset(["a","a","b"])`.
**Result:** set removes duplicates, so two instances (`a`, `b`).

### O12.
`cidrsubnet("10.0.0.0/16", 8, 3)`.
**Result:** `10.0.3.0/24`.

---

# ✅ Part 15: MCQs

**1. Which command downloads providers and sets up the backend?**
A) plan  B) init  C) apply  D) fmt
**Answer: B**

**2. State should be stored in:**
A) Git  B) Remote backend with locking  C) Slack  D) Container image
**Answer: B**

**3. Best way to avoid recreating items when a middle element is removed:**
A) count  B) for_each  C) depends_on  D) taint
**Answer: B**

**4. To rename a resource without destroying it:**
A) `moved` block  B) `-target`  C) `ignore_changes`  D) `fmt`
**Answer: A**

**5. `sensitive = true` means the value is:**
A) Encrypted in state  B) Hidden in CLI output only  C) Removed from state  D) Not stored anywhere
**Answer: B**

**6. Declarative IaC means you describe:**
A) Steps  B) Desired end state  C) Only scripts  D) Only logs
**Answer: B**

**7. The lock file `.terraform.lock.hcl` should be:**
A) Ignored in Git  B) Committed  C) Deleted after init  D) Encrypted
**Answer: B**

**8. Replacement for `terraform taint`:**
A) `-replace=ADDR`  B) `-target`  C) `state rm`  D) `refresh`
**Answer: A**

**9. Which block adopts an existing resource declaratively?**
A) moved  B) import  C) removed  D) check
**Answer: B**

**10. Which exit code means changes (drift) with `-detailed-exitcode`?**
A) 0  B) 1  C) 2  D) 3
**Answer: C**

**11. Do `provider` blocks belong inside reusable child modules?**
A) Yes, always  B) No; pass providers from the root  C) Only for AWS  D) Only in tests
**Answer: B**

**12. Which tool is a community fork of Terraform?**
A) Pulumi  B) OpenTofu  C) Bicep  D) Crossplane
**Answer: B**

**13. `terraform test` files use the extension:**
A) .tfvars  B) .tftest.hcl  C) .tfstate  D) .tfplan
**Answer: B**

**14. Best CI authentication to AWS:**
A) Long-lived access keys in repo  B) OIDC role assumption  C) Root account keys  D) Shared password
**Answer: B**

**15. `create_before_destroy` does what?**
A) Deletes first  B) Creates replacement before deleting old  C) Skips changes  D) Locks state
**Answer: B**

**16. A data source:**
A) Creates a resource  B) Reads existing information  C) Deletes state  D) Defines a provider
**Answer: B**

**17. Which command shows only a summary of what would change and does not modify infrastructure?**
A) apply  B) destroy  C) plan  D) import
**Answer: C**

**18. Why avoid putting all environments in one state?**
A) Cost  B) Large blast radius and slow runs  C) HCL limits  D) Providers disallow it
**Answer: B**

**19. Which scanner replaced tfsec in the Aqua ecosystem?**
A) Trivy  B) Sentinel  C) Packer  D) Vault
**Answer: A**

**20. `terraform state rm` does what to the real resource?**
A) Deletes it  B) Nothing; only forgets it  C) Recreates it  D) Moves it
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Local state** or state committed to Git.
2. **No locking** on the remote backend.
3. **Secrets in `.tfvars`/code** and unprotected state.
4. **Using `count` for collections** instead of `for_each`.
5. **Not reading the plan**, especially `-/+` lines.
6. **`-auto-approve` in production** without a reviewed saved plan.
7. **One giant state** for everything.
8. **Unpinned providers/modules** and uncommitted lock file.
9. **Renaming without `moved` blocks.**
10. **Overusing `-target`** and leaving state inconsistent.
11. **Overusing `depends_on`, provisioners and `null_resource`.**
12. **Provider blocks inside reusable modules.**
13. **Workspaces treated as security boundaries.**
14. **Wildcard IAM** for the pipeline role.
15. **No `prevent_destroy` or deletion protection** on databases.
16. **Hardcoded account IDs, regions and AMIs.**
17. **No tagging standard** or `default_tags`.
18. **Ignoring drift** until an incident.
19. **No tests or policy checks** before merge.
20. **Mega-modules** with dozens of toggles and no versioning.
21. **Manual `state` edits without a backup.**
22. **Using `remote_state` everywhere** and tightly coupling stacks.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You treat **state** as critical data: remote, locked, versioned, encrypted, with restore drills.
- You split stacks by **blast radius and ownership**, and connect them through clear contracts.
- You refactor safely with **`moved`, `import` and `removed`** and prove "0 to destroy" in the plan.
- You use **OIDC, short-lived credentials** and separate plan/apply identities.
- You design **module interfaces** with validation, `optional()` defaults, semantic versions and tests.
- You layer **static scans, policy as code, `terraform test`** and cloud guardrails.
- You handle **secrets** with ephemeral values, secret managers and managed passwords.
- You detect **drift** on a schedule and have a policy for fixing it.
- You compare **Terraform, OpenTofu, Pulumi, CloudFormation, Crossplane** honestly, including licence and skills trade-offs.
- You bring measured outcomes (provisioning time, incidents avoided, cost saved).

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core mappings
```
Workflow: init → fmt → validate → plan -out → apply tfplan • State: remote + lock + encrypt + version
Loops: for_each (keys) > count (toggle) • Refactor: moved / import / removed • Replace: -replace=ADDR
Safety: prevent_destroy, deletion protection, approvals • Auth: OIDC, no static keys • Secrets: managed/ephemeral
Quality: fmt, validate, tflint, Trivy/Checkov, OPA/Sentinel, terraform test, Infracost • Drift: plan -detailed-exitcode
```

### State checklist
Remote backend • locking on • versioning on • KMS encryption • tight IAM • small stacks • backups and restore drill • no secrets in outputs.

### Module checklist
Clear inputs with types/validation • `optional()` defaults • stable outputs • no provider blocks • README + examples • semver tags • tests • `moved` blocks for renames.

### Pipeline checklist
`fmt -check` • `validate` • lint • security scan • plan saved and posted to PR • policy check • cost diff • human approval • apply the saved plan • drift job.

### Interview strategy
1. Start with the problem: repeatability, safety, speed, audit.
2. Explain state, workflow and graph clearly.
3. Show module design and environment strategy.
4. Cover security: secrets, OIDC, policy, supply chain.
5. Discuss failure cases: drift, locks, replacements, state recovery.
6. Close with measured outcomes.

### Final checklist before the interview
- [ ] Explain init/plan/apply, state, providers and the dependency graph.
- [ ] Choose `for_each` vs `count`; explain lifecycle rules.
- [ ] Refactor with `moved`/`import`/`removed` without destroys.
- [ ] Design remote state, locking, encryption and stack splitting.
- [ ] Design modules, versions, registries and environment layout.
- [ ] Build a CI/CD pipeline with OIDC, scans, policy and approvals.
- [ ] Handle secrets and sensitive values correctly.
- [ ] Debug lock errors, forced replacements, cycles, unknown `for_each` and drift.
- [ ] Compare Terraform with OpenTofu, Pulumi, CloudFormation/CDK, Bicep and Crossplane.
- [ ] Prepare a platform story, a risky-change story and a cost/security story with numbers.
