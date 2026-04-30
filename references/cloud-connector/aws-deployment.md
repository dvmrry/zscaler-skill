---
product: ztw
topic: "aws-deployment"
title: "Cloud Connector on AWS — deployment shape, ENI model, scaling, HA"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md"
  - "vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-amazon-web-services-auto-scaling-groups.md"
  - "vendor/zscaler-help/cbc-troubleshooting-cloud-connector-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_provisioning_url.go (cloud_provider_type enum)"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go (AWS account integration schema)"
  - "github.com/zscaler/terraform-aws-cloud-connector-modules (repo name confirmed; captures not vendored)"
author-status: draft
---

# Cloud Connector on AWS — deployment shape, ENI model, scaling, HA

The AWS-specific deployment of [Cloud Connector](./overview.md). For the cloud-agnostic architecture (CC Groups, forwarding rules, HA concept), start with [`./overview.md`](./overview.md). This doc captures the AWS-specific ENI model, networking requirements, Auto Scaling Group (ASG) patterns, and the failure modes specific to AWS deployments.

> **Reference IaC vs production IaC.** Most claims below are derived from **Zscaler's published Terraform modules** at `github.com/zscaler/terraform-aws-cloud-connector-modules` and the **Zscaler-provided CloudFormation templates** available via the deployment guide. Those are **reference implementations** — one valid way to deploy, what Zscaler considers idiomatic. They are *not* product specification. The runtime requirements of the Cloud Connector AMI vs. the patterns Zscaler's TF/CFN templates choose to enforce aren't separately documented; where the distinction matters, this doc tries to flag it. A different working IaC implementation (yours, or another vendor's) isn't wrong because it diverges from the reference. **Fork admins:** if `iac/` is populated for this fork, treat it as production truth and use this doc for context, not as the deployment spec.

## Disambiguation — Cloud Connector vs ZCC-on-EC2

These are different products:

| Product | What it is |
|---|---|
| **Cloud Connector (CC)** | Zscaler-published AMI — a purpose-built virtual appliance that forwards *workload* traffic (from EC2 instances, containers, etc.) to ZIA/ZPA. Managed through the ZIA Admin Console, not the ZCC client console. |
| **Zscaler Client Connector (ZCC) on EC2** | The end-user agent installed on an EC2 that is acting as a user desktop (e.g., a developer's cloud workstation). ZCC is for *user* traffic; CC is for *workload* traffic. |

Cloud Connector is the correct product for server workloads, CI/CD pipelines, data plane services, and any EC2 that is not a user desktop.

## AWS Marketplace listing

Cloud Connector is deployed as an AMI from the AWS Marketplace. The following details are sourced from Zscaler's published deployment guide:

| Field | Value |
|---|---|
| Publisher / Seller | Zscaler |
| Product | Zscaler Cloud Connector |
| Deployment artifact | Amazon Machine Image (AMI) |
| Default instance type (reference) | Tier D — not specified in available captures; see note |

> **Tier D — instance type defaults:** The Zscaler help captures confirm Cloud Connector runs as an EC2 instance (AMI) but do not enumerate default instance types in the text-extractable captures. The reference Terraform module (`terraform-aws-cloud-connector-modules`) likely specifies defaults, but that repo's contents are not vendored. Operators should check the module's `variables.tf` or the CloudFormation template parameters directly. Treat any instance type figure from third-party sources as a reference default, not a runtime hard requirement.

## Deployment paths

Zscaler publishes two IaC paths for AWS:

**Terraform** — `github.com/zscaler/terraform-aws-cloud-connector-modules`. This is Zscaler's reference Terraform module. The repo name was confirmed from the deployment guide's related-articles section. Module contents are not vendored in this skill repo; treat claims about specific TF module defaults as Tier D unless captured.

**CloudFormation** — Zscaler provides downloadable CloudFormation templates via the help portal ("Download the deployment templates" in the prerequisites). The templates are not separately published as a public GitHub repo. Two flavors exist: a non-ASG template and an ASG template. The deployment guide explicitly states: *"only deploy an autoscaling group (ASG) with an ASG template or a non-ASG with a non-ASG template"* — mixing the two in the same VPC is documented as unsupported.

The provisioning URL's `cloud_provider_type` field accepts `"AWS"`, `"AZURE"`, or `"GCP"` (confirmed from the ZTC Terraform provider source at `resource_ztc_provisioning_url.go`).

## Reference architecture — Transit/Egress VPC

Zscaler's AWS reference architecture places Cloud Connectors in a dedicated **transit/egress VPC** (sometimes called the security VPC), separate from workload VPCs. The reference architecture guide exists at `help.zscaler.com/downloads/cloud-branch-connector/reference-architecture/zero-trust-security-aws-workloads-zscaler-cloud-connector/` but is a PDF and was not text-extractable at capture time.

From the hub-spoke topology described in the ASG deployment guide:

| Pattern | Description |
|---|---|
| **Transit/egress VPC (hub)** | CC instances live here; GWLB distributes traffic across AZs; workload VPCs route through VPC endpoints or peering |
| **Hub-spoke with GWLB** | Preferred pattern for multi-VPC, multi-AZ. GWLB distributes across CC instances; VPC endpoint in each spoke VPC sends traffic to the GWLB |
| **Single-VPC** | CC deployed in the same VPC as workloads; simpler but no isolation; suited for POC or single-account environments |

The Zscaler ASG help article cites GWLB as the load balancer for multi-CC deployments: *"A Gateway Load Balancer (GWLB) distributes traffic among the VMs."* The single-ENI / non-GWLB path is also supported (see § GWLB vs ENI endpoint patterns below).

## Dual-ENI architecture (reference pattern)

Cloud Connector on AWS uses **two Elastic Network Interfaces (ENIs) per instance** in a fixed role assignment, mirroring the Azure dual-NIC pattern:

| ENI | Role | IP Forwarding | Notes |
|---|---|---|---|
| **Management ENI** | Control plane — SSH, registration, health reporting | Not required | Reachable via bastion host, Elastic IP, or AWS Session Manager |
| **Service ENI** | Data plane — workload traffic forwarding | **Required** | Attached to GWLB backend or used as route target for non-GWLB deployments |

The deployment guide's route-table step distinguishes these: *"For non-GWLB-based deployments, select Network Interface and choose the ENI associated with your Cloud Connector service interface instance."* This confirms the service ENI is a distinct, named interface — not the primary instance ENI.

Whether the ENI role assignment is a hard runtime requirement of the CC AMI or an enforced convention of Zscaler's reference deployment templates isn't separately documented. Treat dual-ENI with a dedicated service interface as load-bearing for any deployment derived from the reference; validate deviations independently.

## GWLB vs ENI endpoint patterns

This is the key AWS-specific traffic path distinction:

**Gateway Load Balancer (GWLB) pattern**
- GWLB sits in front of CC instances; workload VPCs route to a **GWLB VPC Endpoint** (a PrivateLink-based endpoint that injects traffic into the GWLB target group).
- Supports transparent bump-in-the-wire forwarding; the source IP of workload traffic is preserved to the CC.
- Required for multi-AZ HA at scale; the ASG deployment is built around GWLB.
- Route-table target: **Gateway Load Balancer Endpoint** (the `GWLBe` ID), not an ENI.

**ENI endpoint pattern (non-GWLB)**
- Route table points directly to the CC's **service ENI** (Network Interface target).
- Simpler; no GWLB required; suited for single-CC or single-AZ low-scale deployments.
- Not HA by itself — a failed CC instance means its ENI disappears; route table must be updated manually or by automation.
- Route-table target: **Network Interface** (the ENI ID of the CC service interface).

Zscaler's CloudFormation deployment guide covers both paths in the route-table modification step, quoted above. The reference architecture PDF (binary, not captured) describes the GWLB pattern as the production-recommended approach for multi-AZ.

## Provisioning URL handoff

The ZIA Admin Console generates a per-template provisioning URL that bootstraps each CC instance. The flow mirrors the Azure pattern:

1. ZIA Admin Console → **Infrastructure > Connectors > Cloud > Management > Provisioning** → create a Cloud Provisioning Template; select AWS as the cloud provider (`cloud_provider_type = "AWS"` in the TF provider).
2. Save → ZIA generates a `prov_url`. The `ztc_provisioning_url` Terraform resource creates this programmatically.
3. The URL is injected into the EC2 instance via `user_data` at launch time. For ASG deployments, the URL is embedded in the **Launch Template** — scale-out events inherit it automatically.
4. Credentials are stored in **AWS Secrets Manager** (a documented prerequisite): the deployment guide step "Store your credentials in AWS Secrets Manager" confirms this is required, not optional. The CC AMI reads from Secrets Manager at boot.

If the provisioning URL is regenerated in the ZIA console and the Launch Template is not updated, scale-out events will produce CCs that fail to register. (Tier D — structural inference; follows from the bootstrap flow; not an explicitly documented failure scenario.)

## Auto Scaling Groups (ASG)

Zscaler's ASG deployment for AWS is described in the help article *Understanding Cloud Connector Deployments with Amazon Web Services Autoscaling Groups*.

### Custom CloudWatch CPU metrics

CCs do not use the standard EC2 CPU utilization CloudWatch metric for scaling decisions. Instead, each CC instance independently reports **custom CPU utilization metrics** to CloudWatch at one-minute intervals. The ASG scaling policy uses the aggregate of these custom metrics across all instances, not VM-level metrics. The help article states: *"Autoscaling uses custom metrics instead of VM-level metrics because custom metrics provide more detailed and precise information about CPU usage."*

This means scaling decisions reflect CC-application-level load (tunnel throughput, connection table pressure) rather than raw hypervisor CPU. The practical implication: do not substitute the standard `CPUUtilization` EC2 metric in a custom ASG policy — the CC-published custom metrics are what the reference deployment is built around.

### Scale parameters

The help article documents the following ASG configuration surface (reference defaults not specified in available captures — see Tier D note below):

| Parameter | Notes |
|---|---|
| Desired capacity | Set at stack creation; configurable post-deploy in EC2 Console |
| Minimum | Defines floor for scale-in |
| Maximum | Defines ceiling for scale-out |
| Scaling policy | Based on aggregate custom CloudWatch CPU across the group |
| Cooldown period | Prevents rapid oscillation; configurable |
| Grace period | Time allowed for a new instance to become healthy before health checks count |

> **Tier D — numeric defaults:** The ASG help article references these parameters but the text-extractable capture omits specific numeric values (e.g., default min/max/thresholds). These would be present in the CloudFormation template parameters or the TF module's `variables.tf`. Operators should read the published template directly for reference defaults.

### Warm pool and lifecycle hooks

The ASG help article explicitly covers **warm pool** and **lifecycle hook** patterns. Warm pools allow pre-initialized CC instances to sit in a ready state, dramatically reducing scale-out latency. Lifecycle hooks let the CC complete registration with the ZIA Admin Console before the ASG marks the instance `InService`. Both are described in the deployment article as part of the production-grade ASG configuration. Exact configuration details are not in the text-extractable captures — treat as Tier B (structure confirmed; specifics require reading the rendered help page).

### Health monitoring

The ASG uses health checks to monitor instances in the `InService` state. Unhealthy instances are automatically removed and replaced. The help article explicitly warns: *"stopping or rebooting a VM that is part of an ASG from the Amazon EC2 Console could cause the VM to be terminated."* Operators should manage CC lifecycle through the ASG, not directly via the EC2 Console.

## CloudFormation deployment flow

The CloudFormation deployment path creates a **stack** containing all CC and supporting resources. Key steps from the help article:

1. Create an EC2 key pair and store credentials in AWS Secrets Manager.
2. Upload the CloudFormation template (non-ASG or ASG — must match; not interchangeable).
3. Create the stack in the CloudFormation console. The stack provisions the CC instance(s), ENIs, security groups, and (for ASG deployments) the Auto Scaling Group and Launch Template.
4. **Route-table modification (critical post-deploy step):** After stack creation, you must manually update the workload subnet's route table:
   - For non-GWLB: `0.0.0.0/0` → Network Interface → CC service ENI
   - For GWLB: `0.0.0.0/0` → Gateway Load Balancer Endpoint → GWLB endpoint ID

   The help article states this explicitly: *"After you finish deploying the Cloud Connector from the AWS CloudFormation console, modify your route table and associated subnet to ensure that traffic is sent from the private workload subnet to Cloud Connector."* This step is not automated by the CloudFormation stack — it is a manual post-deploy action and a common omission in failed deployments.

5. Verify deployment in the ZIA Admin Console (Monitoring page; CC should appear with status).

## Workload discovery and sublocation scopes

For deployments integrated with Zscaler's workload discovery feature, the help capture for sublocation scopes (`cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md`) documents four scope types for grouping workloads under a CC location:

| Scope type | Requires workload discovery |
|---|---|
| VPC Endpoint | No |
| VPC | Yes |
| Account | Yes |
| Namespace | Yes |

Sublocations allow different ZIA / Internet & SaaS policies per workload group, and correct source identification when multiple workloads share IP space. Authentication is not supported for these sublocation types.

The `ztc_public_cloud_info` Terraform resource (confirmed from `resource_ztc_public_cloud_info.go`) registers AWS account details with Zscaler for workload discovery. Required fields include `aws_account_id`, `aws_role_name`, and optionally `cloud_watch_group_arn` and `event_bus_name` for EventBridge-based discovery.

## HA model in AWS

| Layer | Documented pattern | Notes |
|---|---|---|
| CC instances | Multiple per AZ, across multiple AZs | ASG handles placement; GWLB distributes across AZs |
| Load balancer | GWLB (ASG pattern); direct ENI (non-ASG) | GWLB is the HA-capable path; ENI routing is single-point-of-failure without additional automation |
| Tunnel failover (CC → ZIA) | Runtime-managed; primary/secondary/tertiary gateway selection by geolocation | Same as Azure; not IaC-derived |
| Default behavior on CC failure | ASG replaces unhealthy instances automatically | Grace period + lifecycle hooks control timing |
| Route-table failover (non-GWLB) | Not automated by CloudFormation | Requires Lambda or similar to update route table when CC instance is replaced |
| Upgrade window | Configurable per CC Group (Admin Console) | Maintains redundancy during Zscaler-managed upgrades |

The ASG article explicitly states the GWLB path as the HA-capable topology: multi-AZ distribution is handled by GWLB, not by the operator's route tables.

## Common failure modes

**Documented (Tier A — from help captures):**
- **Route table not modified after CloudFormation deployment** — the most frequently cited gotcha in the deployment guide. The stack does not update route tables automatically; forgetting this step leaves workload traffic taking its default path (direct internet egress or blackhole).
- **ASG template / non-ASG template mismatch** — deploying an ASG CloudFormation template in a VPC that already has a non-ASG deployment (or vice versa) is explicitly documented as unsupported.
- **Stopping/rebooting an ASG instance via EC2 Console** — documented as potentially triggering termination and replacement. Manage lifecycle through the ASG.
- **Secrets Manager credentials not stored / inaccessible** — the help doc lists this as a prerequisite step; missing or IAM-blocked Secrets Manager access will prevent the CC AMI from bootstrapping.

**Inferred (Tier D — verify against your deployment):**
- **Provisioning URL stale in Launch Template** — if the ZIA provisioning URL is regenerated and the Launch Template is not updated, scale-out events produce CCs that fail to register with the ZIA Admin Console.
- **Service ENI without ip_forwarding enabled** — analogous to Azure; the CC instance appears healthy from AWS's perspective but passes no workload traffic. Health probe (if GWLB) will eventually mark it unhealthy, but the root cause is the ENI setting.
- **GWLB endpoint not in workload VPC route table** — GWLB is deployed in the egress VPC but the workload VPC route table still points to a NAT gateway or IGW; CC is bypassed entirely.
- **Secrets Manager IAM role missing** — the EC2 instance profile attached to CC instances must have `secretsmanager:GetSecretValue` for the CC credentials secret. Missing this produces a startup failure that looks like a network issue.
- **Custom CloudWatch metric namespace mismatch** — if operators add a second ASG policy using the standard `CPUUtilization` metric alongside the CC custom metric, the policies may conflict, causing oscillation.

## Source-citation gaps (future capture targets)

These pages were captured but the reference architecture PDF is binary and not text-extractable:

- `help.zscaler.com/downloads/cloud-branch-connector/reference-architecture/zero-trust-security-aws-workloads-zscaler-cloud-connector/` — the primary reference architecture guide; covers detailed GWLB topology, multi-account patterns, and Transit Gateway integration
- `github.com/zscaler/terraform-aws-cloud-connector-modules` — Terraform module repo; instance type defaults, module scenario list, exact ASG scale thresholds, and Secrets Manager integration details are in this repo but not vendored
- Zscaler CloudFormation templates — downloadable via the help portal but not separately published; CloudFormation parameter defaults (instance types, ASG min/max/thresholds) are Tier D until captured
- Transit Gateway integration with Cloud Connector — referenced in community material but not confirmed in available captures; Tier D

The ASG help article's numeric scaling defaults (min instances, max instances, CPU thresholds, cooldown period) were described structurally but not enumerated in the text-extractable capture. These are Tier D until the CloudFormation template or TF module variables are inspected.

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- Forwarding rules + methods: [`./forwarding.md`](./forwarding.md)
- API + Terraform surface: [`./api.md`](./api.md)
- Azure deployment (parallel doc): [`./azure-deployment.md`](./azure-deployment.md)
- Portfolio context: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
