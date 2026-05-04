---
product: ztw
topic: "aws-deployment"
title: "Cloud Connector on AWS — deployment shape, ENI model, scaling, HA"
content-type: reasoning
last-verified: "2026-05-03"
verified-against:
  vendor/terraform-provider-ztc: 92f2d7c686b53c7bb5421d07581de9ae90be136b
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
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/ (instance + ENI model)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/ (ASG, scaling policy, lifecycle hooks)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-lambda-aws/ (Lambda lifecycle helper)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-gwlb-aws/ (GWLB, target group, health probe)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-iam-aws/ (CC instance IAM policies)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-sg-aws/ (mgmt + service SG rules)"
  - "vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-network-aws/ (VPC / subnet / AZ defaults)"
author-status: draft
---

# Cloud Connector on AWS — deployment shape, ENI model, scaling, HA

The AWS-specific deployment of [Cloud Connector](./overview.md). For the cloud-agnostic architecture (CC Groups, forwarding rules, HA concept), start with [`./overview.md`](./overview.md). This doc captures the AWS-specific ENI model, networking requirements, Auto Scaling Group (ASG) patterns, and the failure modes specific to AWS deployments.

> **Reference IaC vs production IaC.** Most claims below are derived from **Zscaler's published Terraform modules** at `github.com/zscaler/terraform-aws-cloud-connector-modules` and the **Zscaler-provided CloudFormation templates** available via the deployment guide. Those are **reference implementations** — one valid way to deploy, what Zscaler considers idiomatic. They are *not* product specification. The runtime requirements of the Cloud Connector AMI vs. the patterns Zscaler's TF/CFN templates choose to enforce aren't separately documented; where the distinction matters, this doc tries to flag it. A different working IaC implementation (yours, or another vendor's) isn't wrong because it diverges from the reference. **Fork admins:** if `_data/iac/` is populated for this fork, treat it as production truth and use this doc for context, not as the deployment spec.

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
| Default instance type (reference TF module) | `m6i.large` (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/variables.tf:42`) |

The Terraform module's `ccvm_instance_type` variable enforces a closed set of approved instance types via validation. Anything outside this list fails plan-time validation (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/variables.tf:43-58`):

| Tier | Instance types |
|---|---|
| Small (default `cc_instance_size = "small"`) | `t3.medium`, `m5n.large`, `c5a.large`, `m6i.large`, `c6i.large`, `c6in.large`, `m5n.4xlarge`, `m6i.4xlarge`, `c6i.4xlarge`, `c6in.4xlarge` |
| Medium / Large | `m5n.4xlarge`, `m6i.4xlarge`, `c6i.4xlarge`, `c6in.4xlarge` only (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/variables.tf:76-78`) |

`cc_instance_size` (`small` / `medium` / `large`, default `small`) must match the size selected in the **Cloud Connector Portal provisioning template** (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/variables.tf:60-72`). The size determines ENI count (see § ENI count by instance size below).

## Deployment paths

Zscaler publishes two IaC paths for AWS:

**Terraform** — `github.com/zscaler/terraform-aws-cloud-connector-modules`. This is Zscaler's reference Terraform module. Module contents are vendored in this skill repo at `vendor/terraform-aws-cloud-connector-modules/`; specific defaults below are cited inline. The module is composed of submodules under `modules/` (CCVM, ASG, GWLB, IAM, SG, network, ASG Lambda, GWLB endpoint) and a set of example deployments under `examples/` covering the matrix of greenfield/brownfield × single-CC/static-multi-CC/GWLB/GWLB+ASG with optional ZPA Route 53 add-ons (`vendor/terraform-aws-cloud-connector-modules/README.md:55-95`). See § Reference deployment examples below.

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

## ENI architecture (reference pattern)

Cloud Connector on AWS uses **multiple Elastic Network Interfaces (ENIs) per instance**, with role assignment driven by `source_dest_check`:

| ENI | Role | `source_dest_check` | Citation |
|---|---|---|---|
| Index 0 | Service / forwarding interface (CC next-hop) | `false` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:87-96` |
| Index 1 | Management interface (control plane — SSH, registration, health reporting) | `true` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:102-116` |
| Index 2 | Service interface #1 (medium/large only) | `false` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:122-136` |
| Index 3 | Service interface #2 (medium/large only) | `false` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:142-156` |
| Index 4 | Service interface #3 (large) / dedicated LB interface (medium) | `false` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:164-178` |
| Index 5 | Dedicated LB interface (large only) | `false` | `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:185-199` |

Service ENIs disable `source_dest_check` so the instance can forward traffic that is not destined to its own IP; the management ENI keeps the AWS default `source_dest_check = true`.

### ENI count by instance size

The total ENI count per CC instance is determined by `cc_instance_size`. ENIs at indexes 2, 3, and 4 are created whenever `cc_instance_size != "small"`; the index-5 ENI is created only for `large` (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-ccvm-aws/main.tf:122-199`):

| Size | Total ENIs | Indexes created |
|---|---|---|
| `small` | 2 | 0, 1 |
| `medium` | 5 | 0, 1, 2, 3, 4 (index 4 is the LB interface) |
| `large` | 6 | 0, 1, 2, 3, 4, 5 (index 5 is the dedicated LB interface) |

The deployment guide's route-table step distinguishes service vs management: *"For non-GWLB-based deployments, select Network Interface and choose the ENI associated with your Cloud Connector service interface instance."*

Whether the ENI role assignment is a hard runtime requirement of the CC AMI or an enforced convention of Zscaler's reference deployment templates isn't separately documented. Treat the multi-ENI layout with a dedicated service interface as load-bearing for any deployment derived from the reference; validate deviations independently.

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

The Terraform module configures the scaling policy explicitly as a **Target Tracking Scaling** policy on a customized metric (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/main.tf:216-235`):

| Property | Value |
|---|---|
| Policy type | `TargetTrackingScaling` |
| Namespace | `Zscaler/CloudConnectors` |
| Metric name | `smedge_cpu_utilization` |
| Dimension | `AutoScalingGroupName` |
| Statistic | `Average` |
| Unit | `Percent` |
| Default target value | `80` (`var.target_cpu_util_value`, `vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/variables.tf:187-191`) |

CC instances are granted `cloudwatch:PutMetricData` with an IAM condition restricting writes to the `Zscaler/CloudConnectors` namespace (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-iam-aws/main.tf:138-172`).

This means scaling decisions reflect CC-application-level load (tunnel throughput, connection table pressure) rather than raw hypervisor CPU. The practical implication: do not substitute the standard `CPUUtilization` EC2 metric in a custom ASG policy — the CC-published custom metrics are what the reference deployment is built around.

### Scale parameters

The reference Terraform module exposes these ASG defaults (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/variables.tf`):

| Variable | Default | Notes | Citation |
|---|---|---|---|
| `min_size` | `2` | Floor for scale-in | `variables.tf:108-112` |
| `max_size` | `4` | Ceiling for scale-out; validation range 1–10 | `variables.tf:114-124` |
| `health_check_type` | `EC2` | `EC2` or `ELB` | `variables.tf:138-149` |
| `health_check_grace_period` | `900` (seconds) | Minimum time a new instance is kept in service before health checks can terminate it | `variables.tf:126-130` |
| `target_cpu_util_value` | `80` (percent) | Target tracking value on the custom CPU metric | `variables.tf:187-191` |
| `lifecyclehook_instance_launch_wait_time` | `1800` (seconds) | Pending:wait timeout on launch (lifecycle hook `default_result = "ABANDON"`) | `variables.tf:193-197`; hook config at `main.tf:155-160` |
| `lifecyclehook_instance_terminate_wait_time` | `900` (seconds) | Terminating:wait timeout (lifecycle hook `default_result = "CONTINUE"`) | `variables.tf:199-203`; hook config at `main.tf:163-168` |
| `instance_warmup` | `0` | Time before a new instance contributes to CloudWatch metrics | `variables.tf:132-136` |
| `protect_from_scale_in` | `false` | Whether new instances get scale-in protection | `variables.tf:229-233` |
| `zonal_asg_enabled` | `false` | When `true`, creates one ASG per AZ instead of one ASG spanning subnets | `variables.tf:270-274`; placement at `main.tf:114-117` |

Lifecycle hook semantics from the source: launch-failure default is **ABANDON** (an instance that times out during pending:wait is abandoned, not retained); terminate-default is **CONTINUE** (terminate completes after the hook timeout regardless of acknowledgement) (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/main.tf:155-168`).

### Warm pool and lifecycle hooks

The ASG help article explicitly covers **warm pool** and **lifecycle hook** patterns. Warm pools allow pre-initialized CC instances to sit in a ready state, reducing scale-out latency. Lifecycle hooks let the CC complete registration with the ZIA Admin Console before the ASG marks the instance `InService`.

Reference Terraform module surface for warm pools (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/variables.tf:151-179`):

| Variable | Default | Notes |
|---|---|---|
| `warm_pool_enabled` | `false` | Master switch |
| `warm_pool_state` | `Stopped` | Either `Stopped` or `Running` |
| `warm_pool_min_size` | `0` | Minimum warm pool size |
| `warm_pool_max_group_prepared_capacity` | `null` | Maximum total instances allowed in any non-terminated state |
| `reuse_on_scale_in` | `false` | Whether scale-in instances return to the warm pool |

The warm pool resource is rendered into the ASG only when `warm_pool_enabled = true` (`main.tf:170-180`).

### Health monitoring

The ASG uses health checks to monitor instances in the `InService` state. Unhealthy instances are automatically removed and replaced. The help article explicitly warns: *"stopping or rebooting a VM that is part of an ASG from the Amazon EC2 Console could cause the VM to be terminated."* Operators should manage CC lifecycle through the ASG, not directly via the EC2 Console.

### Lambda-driven health and lifecycle helper

The reference ASG deployment includes a Lambda function (`terraform-zscc-asg-lambda-aws`) that augments raw EC2/ELB health checks. It is wired up to:

- A scheduled EventBridge rule firing every 1 minute (`schedule_expression = "rate(1 minute)"`) (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-lambda-aws/main.tf:202-206`).
- An ASG lifecycle event rule on `EC2 Instance-terminate Lifecycle Action` (`main.tf:226-239`).
- An EC2 state-change rule on `terminated` (`main.tf:259-272`).

Lambda configuration: `timeout = 180` seconds, `memory_size = 256` MB, with hardcoded health-evaluation environment variables (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-lambda-aws/main.tf:172-196`):

| Env var | Value | Meaning |
|---|---|---|
| `HC_DATA_POINTS` | `10` | Most recent CloudWatch datapoints to evaluate |
| `HC_UNHEALTHY_THRESHOLD` | `7` | Total unhealthy datapoints (out of 10) that mark the instance unhealthy |
| `HC_UNHEALTHY_CONTIGUOUS_DP` | `5` | Contiguous unhealthy datapoint count that marks the instance unhealthy |
| `MISSING_DATAPOINTS_UNHEALTHY` | `true` | Treat missing datapoints as unhealthy |

Lambda IAM (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-lambda-aws/main.tf:33-153`):

- `secretsmanager:GetSecretValue` on the provisioning secret ARN (`main.tf:34-42`).
- `autoscaling:CompleteLifecycleAction`, `RecordLifecycleActionHeartbeat`, `SetInstanceHealth`, `DescribeWarmPool`, `Describe*`; `ec2:DescribeInstanceStatus`, `DescribeInstances` (`main.tf:62-89`).
- `cloudwatch:GetMetricStatistics`, `ListMetrics`, `GetMetricData`; `ec2:DescribeTags` (`main.tf:109-122`).
- `logs:CreateLogStream`, `PutLogEvents` on the Lambda log group (`main.tf:142-153`).

### GWLB topology and target group

The reference GWLB module (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-gwlb-aws/`) creates the GWLB, target group, VPC Endpoint Service, and (in `terraform-zscc-gwlbendpoint-aws/`) a VPC Endpoint per subnet.

GWLB target group defaults (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-gwlb-aws/variables.tf`):

| Variable | Default | Notes |
|---|---|---|
| `http_probe_port` | `50000` | TCP port the CC listens on for GWLB HTTP health probes; allowed values: `80` or `1024–65535` (`variables.tf:12-23`) |
| `health_check_interval` | `10` (seconds) | Probe interval; allowed range 5–300 (`variables.tf:25-29`) |
| `healthy_threshold` | `2` | Successful probes before a target becomes healthy; range 2–10 (`variables.tf:31-35`) |
| `unhealthy_threshold` | `3` | Failed probes before a target becomes unhealthy; range 2–10 (`variables.tf:37-41`) |
| `cross_zone_lb_enabled` | `false` | Cross-zone load balancing off by default (`variables.tf:43-47`) |
| `flow_stickiness` | `5-tuple` | Hash key for flow stickiness; allowed: `5-tuple`, `3-tuple`, `2-tuple` (`variables.tf:90-103`) |
| `rebalance_enabled` | `true` | Whether GWLB rebalances flows when targets change (`variables.tf:105-109`) |
| `deregistration_delay` | `0` (seconds) | Wait before draining → unused; range 0–3600 (`variables.tf:84-88`) |

ASG instances are auto-attached to the GWLB target group via `aws_autoscaling_attachment` (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-asg-aws/main.tf:205-209`).

### Subnet / AZ defaults

`terraform-zscc-network-aws` defaults: `vpc_cidr = 10.1.0.0/16`, `az_count = 2` with validation `1 ≤ az_count ≤ 3` (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-network-aws/variables.tf:19-23, 79-89`). Subnet types created by the module include public, CC private, workload private, and (when `zpa_enabled = true`) Route 53 outbound resolver subnets.

## Security groups (reference module)

The `terraform-zscc-sg-aws` module defines two security groups: a **management SG** for the CC management ENI and a **service SG** for the service / forwarding ENIs.

Management SG (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-sg-aws/main.tf:30-90`):

| Rule | Direction | Port / Protocol | Destination | Notes |
|---|---|---|---|---|
| SSH | Ingress | TCP 22 | VPC CIDR | Optional; gated on `mgmt_ssh_enabled` (default `true`). Disable to force SSM-only access. |
| Control plane | Egress | TCP 443 | `0.0.0.0/0` | Required |
| NTP | Egress | UDP 123 | `0.0.0.0/0` | Required |
| Zscaler package repo | Egress | TCP all (0–65535) | `167.103.95.222/32` | Required: outbound to Zscaler Repo Server |
| DNS | Egress | UDP 53 | `0.0.0.0/0` | Recommended |
| Zscaler Remote Support | Egress | TCP 12002 | `var.zssupport_server` | Optional; gated on `support_access_enabled` |

Service SG (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-sg-aws/main.tf:102-224`):

| Rule | Direction | Port / Protocol | Source/Destination | Notes |
|---|---|---|---|---|
| Health probe | Ingress | TCP `var.http_probe_port` (default 50000) | VPC CIDR | Required for GWLB target group probes |
| Internal HTTPS | Ingress | TCP 443 | VPC CIDR | Required for intra-VPC CC cluster communication |
| GENEVE | Ingress | UDP 6081 | VPC CIDR | Required when `gwlb_enabled = true` |
| Internal all | Ingress | All protocols | VPC CIDR | Permits intra-VPC service-interface traffic |
| Internet HTTPS | Egress | TCP 443 | `0.0.0.0/0` | Required |
| DTLS / QUIC | Egress | UDP 443 | `0.0.0.0/0` | Required |
| NTP | Egress | UDP 123 | `0.0.0.0/0` | Required |
| DNS | Egress | UDP 53 | `0.0.0.0/0` | Recommended |
| GENEVE | Egress | UDP 6081 | VPC CIDR | Required when `gwlb_enabled = true` |
| All-ports egress | Egress | All | `0.0.0.0/0` | Optional; gated on `all_ports_egress_enabled` (for direct/bypass non-HTTPS traffic) |

## IAM permissions (reference module)

The `terraform-zscc-iam-aws` module attaches an instance profile to each CC EC2 with the following policies (`vendor/terraform-aws-cloud-connector-modules/modules/terraform-zscc-iam-aws/main.tf`):

| Policy | Actions | Scope | Citation |
|---|---|---|---|
| Get Secrets | `secretsmanager:GetSecretValue` | Provisioning secret ARN only | `main.tf:32-40` |
| SSM Session Manager | `ssm:UpdateInstanceInformation`, `ssmmessages:CreateControlChannel`, `CreateDataChannel`, `OpenControlChannel`, `OpenDataChannel` | `*` | `main.tf:61-75` |
| ASG lifecycle | `autoscaling:DescribeInstanceStatus`, `DescribeLifecycleHookTypes`, `DescribeLifecycleHooks`, `DescribeAutoScalingInstances`, `CompleteLifecycleAction`, `RecordLifecycleActionHeartbeat` | Restricted to `var.asg_arns` if provided, else `*` | `main.tf:96-118` |
| CloudWatch metrics RW | `cloudwatch:PutMetricData` | Conditioned to `cloudwatch:namespace = "Zscaler/CloudConnectors"` | `main.tf:138-153` |
| CloudWatch metrics RO + tags | `cloudwatch:GetMetricStatistics`, `ListMetrics`, `ec2:DescribeTags` | `*` | `main.tf:155-172` |
| Cloud Tags subscription (optional) | `sns:ListTopics`, `ListSubscriptions`, `Subscribe`, `Unsubscribe`, `sqs:CreateQueue`, `DeleteQueue` | `*` (with optional `var.iam_tags_condition` conditions); only when `cloud_tags_enabled = true` | `main.tf:191-216` |

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

## Reference deployment examples

The vendored Terraform module ships with example deployments under `examples/` (`vendor/terraform-aws-cloud-connector-modules/README.md:55-95` lists all directories; per-example topology details are cited from each example's own `README.md`):

| Example | Topology | Citation |
|---|---|---|
| `base_1cc` | Single CC, greenfield (1 VPC, 2 AZs, 1 instance, bastion, test workloads) | `vendor/terraform-aws-cloud-connector-modules/examples/base_1cc/README.md:1-5` |
| `base_1cc_zpa` | `base_1cc` plus Route 53 outbound resolver for ZPA DNS | `vendor/terraform-aws-cloud-connector-modules/examples/base_1cc_zpa/README.md:1-5` |
| `base_2cc` | **Deprecated.** 2 static CCs (no LB), one per AZ; route tables point at individual CC ENIs. Zscaler recommends `base_cc_gwlb` instead | `vendor/terraform-aws-cloud-connector-modules/examples/base_2cc/README.md:1-3` |
| `base_2cc_zpa` | `base_2cc` plus Route 53 | `vendor/terraform-aws-cloud-connector-modules/examples/base_2cc_zpa/README.md:1-5` |
| `base_cc_gwlb` | GWLB greenfield: 2 CCs, workload subnets routing via GWLB endpoints | `vendor/terraform-aws-cloud-connector-modules/examples/base_cc_gwlb/README.md:1-5` |
| `base_cc_gwlb_asg` | GWLB plus ASG (default `min_size = 2`, `max_size = 4`) | `vendor/terraform-aws-cloud-connector-modules/examples/base_cc_gwlb_asg/README.md:1-5` |
| `base_cc_gwlb_asg_zpa` | GWLB plus ASG plus Route 53 | `vendor/terraform-aws-cloud-connector-modules/examples/base_cc_gwlb_asg_zpa/README.md:1-5` |
| `base_cc_gwlb_zpa` | GWLB plus Route 53 | `vendor/terraform-aws-cloud-connector-modules/examples/base_cc_gwlb_zpa/README.md:1-5` |
| `cc_gwlb` | Brownfield: static 2–4 CCs, GWLB, BYO VPC/subnets | `vendor/terraform-aws-cloud-connector-modules/examples/cc_gwlb/README.md:1-5` |
| `cc_gwlb_asg` | Brownfield: GWLB plus ASG | `vendor/terraform-aws-cloud-connector-modules/examples/cc_gwlb_asg/README.md:1-5` |
| `cc_ha` | **Deprecated.** Non-GWLB HA: 2 static CCs per AZ with Lambda failover. Zscaler recommends `cc_gwlb` instead | `vendor/terraform-aws-cloud-connector-modules/examples/cc_ha/README.md:1-3` |

## Source-citation gaps (future capture targets)

- `help.zscaler.com/downloads/cloud-branch-connector/reference-architecture/zero-trust-security-aws-workloads-zscaler-cloud-connector/` — the primary reference architecture guide; covers detailed GWLB topology, multi-account patterns, and Transit Gateway integration. PDF, binary, not text-extractable at capture time.
- Zscaler CloudFormation templates — downloadable via the help portal but not separately published; CloudFormation parameter defaults (instance types, ASG min/max/thresholds) are Tier D until captured. Note that the Terraform module's defaults are now vendored and authoritative for the TF path.
- Transit Gateway integration with Cloud Connector — referenced in community material but not confirmed in available captures; Tier D.

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- Forwarding rules + methods: [`./forwarding.md`](./forwarding.md)
- API + Terraform surface: [`./api.md`](./api.md)
- Azure deployment (parallel doc): [`./azure-deployment.md`](./azure-deployment.md)
- Portfolio context: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
