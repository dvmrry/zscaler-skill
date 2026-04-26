---
product: ztw
topic: "aws-workload-discovery"
title: "AWS workload discovery — account trust, EventBridge, namespace tagging"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-about-amazon-web-services-accounts.md"
  - "vendor/zscaler-help/cbc-adding-amazon-web-services-account.md"
  - "vendor/zscaler-help/cbc-about-amazon-web-services-account-groups.md"
  - "vendor/zscaler-help/cbc-adding-amazon-web-services-account-group.md"
  - "vendor/zscaler-help/cbc-analyzing-amazon-web-services-account-details.md"
  - "vendor/zscaler-help/cbc-analyzing-amazon-web-services-account-group-details.md"
  - "vendor/zscaler-help/cbc-registering-endpoint-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-configuring-workload-discovery-workloads-amazon-web-services.md"
  - "vendor/zscaler-help/cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md"
  - "vendor/zscaler-help/cbc-understanding-namespaces-amazon-web-services-and-microsoft-azure-accounts.md"
author-status: draft
---

# AWS workload discovery — account trust, EventBridge, namespace tagging

This doc covers the AWS account-level integration that feeds tag-based policy and workload visibility into Cloud Connector. It is **not** about deploying the Cloud Connector VMs themselves — that's `./aws-deployment.md`. Workload discovery is a separate data-plane concern: it gives Zscaler read access to your AWS account so that policies can reference workload identity (tags, VPC IDs, security groups) rather than raw IP addresses.

> **Reference IaC vs production IaC.** Where CloudFormation or Terraform is mentioned below, references are to **Zscaler's published example templates** — reference implementations illustrating one valid onboarding path. They are not product specification. Runtime requirements and reference defaults are not always separately documented; this doc flags the distinction where it matters. **Fork agents:** if `iac/` is populated for this fork, treat it as production truth. Use this doc for context and reasoning, not as a deployment spec.

> **Feature gating.** AWS partner integrations (workload discovery) must be enabled by Zscaler Support before the Partner Integrations menu is visible. Do not assume it is on by default.

## Why workload discovery exists

Cloud Connector forwards traffic and applies policy to it. Useful policy — "block this workload because it has tag `env=dev`," "route this VPC's traffic differently" — requires Zscaler to know which IP address corresponds to which workload identity at any given moment. AWS workloads are ephemeral: IPs change, autoscaling groups cycle, containers come and go.

Workload discovery is the mechanism Zscaler uses to maintain a live mapping of `IP address → workload tags + attributes`. Without it, policy is limited to network primitives (IP ranges, VPC IDs). With it, operators can write policies that reference user-defined tags and cloud-provider-generated attributes — security group IDs, IAM instance profile ARNs, VPC IDs, platform details — and have those policies follow workloads as they move.

This is **distinct from Cloud Connector deployment**. A CC can be deployed in a VPC and forwarding traffic without workload discovery being configured at all. Discovery is an additive integration that enriches policy-matching capability.

## The AWS account model

### What "adding an AWS account" means

Adding an AWS account to the Zscaler Admin Console (`Infrastructure > Connectors > Cloud > Management > Partner Integrations > AWS > Accounts`) registers that account as a discovery target. Zscaler stores the account ID, an IAM role name it will assume, and a set of regions to scan. The account is not usable until the corresponding IAM trust is deployed on the AWS side.

Each account entry carries:

| Field | Purpose |
|---|---|
| AWS Account ID | The account where workloads are deployed |
| AWS Role Name | The IAM role in the operator's account that Zscaler will assume |
| External ID | Unique per-account ID used in the IAM trust relationship; prevents confused-deputy attacks |
| Trusted Account ID | The Zscaler AWS account ID; must appear in the operator's IAM trust policy |
| Trusted Role | The Zscaler-side role that performs the `AssumeRole` call |
| Event Bus Name | The EventBridge bus in the Zscaler account; target for real-time event forwarding |
| Regions | The AWS regions Zscaler is permitted to scan |

### Three-party trust pattern

The IAM setup is a cross-account `AssumeRole` arrangement:

```
Zscaler AWS account (Trusted Account ID)
  └─ Trusted Role
        └─ AssumeRole →  Operator's AWS account
                           └─ Operator IAM Role (AWS Role Name)
                                └─ Trust policy: principal = Zscaler Trusted Role
                                                  condition: sts:ExternalId = External ID
```

The External ID is a per-account secret that Zscaler generates and displays in the console. It must be written into the `Condition` block of the operator's IAM trust policy. If it is missing or wrong, the `AssumeRole` call is rejected. The Zscaler help doc notes: *"If this ID is regenerated, update it in your AWS account."* — regeneration breaks the existing trust until the AWS role is updated.

### IAM permissions scope

The CloudFormation template Zscaler provides creates the required IAM role. The capture does not enumerate the exact permission set inline, but the workload discovery configuration doc lists the **attributes Zscaler fetches**: security group IDs and names, AMI IDs, platform details, VPC IDs, IAM instance profile ARNs, and Lambda function metadata (via ENI). This implies read-only EC2 and Lambda describe-level permissions scoped to the configured regions. The exact managed policy or inline policy document is in the CloudFormation template — not separately enumerated in the help text captured here.

**Source-citation gap:** the precise IAM policy document is embedded in the CloudFormation template, which is not captured as plain text. Operators should inspect the template before execution rather than inferring permissions from discovery attribute names alone.

## Permission states

After adding an account, the permission column in the Zscaler console shows one of three states:

| State | Meaning |
|---|---|
| **Pending** | Account registered in Zscaler; IAM role not yet deployed or not yet synced. The Zscaler discovery service has not attempted or not yet completed an `AssumeRole` validation. |
| **Allowed** | IAM role correctly deployed; Zscaler can assume it and discover tags. |
| **Denied** | Zscaler attempted `AssumeRole` and was rejected. Role not deployed, trust policy wrong, External ID mismatch, or incorrect Trusted Account ID / Trusted Role. |

The transition from Pending to Allowed/Denied is not automatic on role deployment — an operator must click **Refresh** on the account in the Zscaler console. The "Latest Sync" column reflects the time the Refresh was last triggered, not real-time sync status.

A **Denied** account in an Account Group blocks tag discovery for that account across all CC groups that reference the group. An account can remain in a group in Denied state — the group UI shows per-account permission status.

## EventBridge integration

The workload discovery configuration requires setting up AWS EventBridge in the operator's account to forward events to Zscaler. The Event Bus Name field in the Zscaler account config is the target event bus in the **Zscaler** AWS account. The operator creates EventBridge rules in their own account that route relevant EC2/ECS/Lambda lifecycle events to that cross-account bus.

This provides the real-time update path: rather than polling for tag changes on a schedule, Zscaler receives event notifications as workloads start, stop, change tags, or move. The Zscaler workload discovery config doc identifies EventBridge configuration as one of four required setup steps (alongside role creation, CC role SQS permissions update, and namespace/duplicate IP configuration).

**Source-citation gap:** the specific EventBridge event patterns (which event types, which source services) and the cross-account bus target ARN format are not enumerated in the captured help text. This detail lives in the CloudFormation template. The captures confirm that EventBridge is the real-time metadata pipeline and that the Event Bus Name in the Zscaler console is the target, but do not reproduce the event rule JSON.

## AWS Account Groups

### What a group is

An AWS Account Group bundles multiple AWS accounts so that a single Cloud Connector group can receive tag information from all of them. The core purpose: Cloud Connector is not tied to the single account in which it is deployed. In an AWS Organizations model, workloads span many accounts; a CC in a transit/security account needs tag data from spoke accounts where the actual workloads run.

Account Groups are the indirection layer between "which accounts has Zscaler discovered" and "which CC groups consume that tag data."

### Group-to-CC Group binding

An Account Group is associated with one or more **Cloud Connector Groups** at group-creation time. The help doc describes this as: *"select the Cloud Connector groups where tag information is sent."* This is the linkage that determines which CCs receive the tag-to-IP mapping database for these accounts. A CC group that is not associated with any Account Group has no workload tag visibility, even if individual AWS accounts are onboarded.

### Account Group membership

Individual accounts are added to a group either at account-creation time (optional Account Group field) or via the Account Group edit UI. Each account appears in the group table with its own Permission status — a group can mix Allowed and Denied/Pending accounts. Only Allowed accounts contribute tag data.

## Endpoint registration

Registering an endpoint in AWS (`Infrastructure > Connectors > Cloud > Zero Trust Gateway Management`) is a separate operation from workload discovery account onboarding. It involves:

1. Copying the endpoint service name from a Zero Trust Gateway entry in the Zscaler console.
2. Creating a VPC Endpoint in the operator's AWS account pointing to that service name.
3. Configuring route tables to direct traffic to the endpoint.

This enables the **VPC Endpoint sublocation scope** — the one scope type that does not require workload discovery to be configured. It supports policy-based routing and workload separation purely through VPC Endpoint identity, without needing tag data.

## Workload discovery configuration

### Attributes Zscaler discovers

The discovery service fetches the following per-workload attributes (from the configuration doc):

| Attribute | Source |
|---|---|
| `GroupId` | Security group ID on the attached ENI |
| `GroupName` | Security group name on the attached ENI |
| `ImageId` | AMI ID used to launch the instance |
| `PlatformDetails` | Platform string; also covers Lambda and non-EC2 services |
| `Vpc-id` | VPC ID of the ENI |
| `IamInstanceProfile-Arn` | ARN of the IAM instance profile |

These are usable in Zscaler security policies as workload identity signals — the principal use case for setting up discovery at all.

### Region scoping

Discovery is region-scoped. Operators select one or more AWS regions during account onboarding. The help doc is explicit: *"If you do not select one or more regions where you have workloads deployed, the Zscaler discovery service does not discover the workloads."* Adding a region after initial onboarding is possible via account edit.

Supported regions (per the account details capture):

`us-east-1`, `us-east-2`, `us-west-1`, `us-west-2`, `eu-central-1`, `eu-west-1`, `eu-west-2`, `ap-southeast-1`, `ap-south-1`, `ap-southeast-2`

This list may not be exhaustive — it reflects what was enumerated in the captured help page at time of capture.

### Discovery service status (per region)

The account details page shows a per-region discovery status:

| Status | Meaning |
|---|---|
| `Success` | Discovery running normally |
| `Disabled` | Data collection disabled; re-enable from the Accounts page |
| `Error` | Discovery encountered a problem |
| `Starting Discovery` | Data collection not yet started |

The "No of Duplicates IP" counter in the region view is the operational signal for namespace configuration. If this is non-zero, namespaces are needed (see below).

### Data collection toggle

Operators can disable and re-enable data collection per account (`Disable Data Collection` / `Enable Data Collection` from the account action menu). Disabling stops tag discovery; policy that referenced discovered tags loses its workload-identity binding for that account until re-enabled.

## Sublocation scopes

Sublocations in an AWS Cloud Connector deployment are automatically created when CCs are deployed; they have `Location Type = Workload traffic`. Sublocation scopes subdivide that location to apply differentiated policy based on workload origin.

Four scope types exist:

| Scope Type | Requires Workload Discovery |
|---|---|
| VPC Endpoint | **No** |
| VPC | Yes |
| Account | Yes |
| Namespace | Yes |

**VPC Endpoint scope is the only type that does not require workload discovery.** This is the operationally significant split: if an operator needs sublocation-level policy differentiation but has not (or cannot) onboard workload discovery, VPC Endpoint scope is the only available path.

All sublocations within a location must use the same scoping strategy — scope only, scope + IP range, or IP range only. You cannot mix strategies across sublocations within a location. A scope can be added to an existing IP-range-only sublocation after the fact.

Authentication is explicitly not supported for the workload-traffic sublocations described here. This is a documented constraint, not a configuration gap.

## The `zs:namespace` VPC tag

### What it is

A namespace is a named grouping of VPC endpoints. Within a namespace, every CIDR block must be unique. A namespace is Zscaler's mechanism for resolving overlapping IP address spaces across multi-account or multi-VPC deployments.

The tag key is `zs:namespace`. The value is an operator-chosen string (e.g., `project-green`, `project-blue`). This tag is applied to each **VPC** (not to individual instances) whose workloads should be mapped together under that namespace.

### How the mapping works

The discovery service reads the `zs:namespace` VPC tag and constructs a two-level mapping:

1. **VPC endpoint → namespace**: each VPC endpoint associated with a tagged VPC inherits the namespace value.
2. **IP + namespace → tag list**: for a given IP address, the tuple `(ip, namespace)` produces a unique tag set.

Without namespace tags, the same IP address appearing in two VPCs produces an ambiguous mapping — Zscaler cannot determine which tag set applies. The account details page surfaces this as "No of Duplicates IP." Once namespace tags are applied and synced, the discovery service can resolve the ambiguity.

### Default behavior without tags

If `zs:namespace` is not detected on a VPC, all workloads in that VPC are assigned to the **default namespace**. In a deployment with no overlapping IPs across any VPC or account, the default namespace works fine. The problem surfaces only when two VPCs — whether in the same account or different accounts — have overlapping CIDR blocks that route to the same Cloud Connector.

### Failure modes

- **Missing tag on one of two overlapping VPCs:** Zscaler cannot distinguish the duplicate IPs. The "No of Duplicates IP" counter increases; policy applied to those IPs becomes nondeterministic.
- **Same namespace value on two VPCs that have overlapping CIDRs:** a namespace is only valid if the VPCs within it have non-overlapping IPs. Assigning the same namespace value to two VPCs that overlap defeats the purpose — the ambiguity remains.
- **Tag applied to instance rather than VPC:** the discovery service reads VPC-level tags for namespace assignment. Instance-level `zs:namespace` tags have no effect on namespace resolution.

## Common failure modes

**IAM trust misconfiguration (Tier A — directly described in help docs):**
- External ID not added to the IAM trust policy condition block → `AssumeRole` rejected → Denied status immediately.
- Wrong Trusted Account ID or Trusted Role in the trust policy → same outcome.
- External ID regenerated in the Zscaler console but not updated in the IAM role → transitions from Allowed to Denied on next validation.

**Stuck Pending (Tier A):**
- IAM role deployed but operator has not clicked Refresh in the Zscaler console → status stays Pending indefinitely. The console does not poll; the operator must trigger the sync.
- Role deployed in wrong account (typo in Account ID during onboarding) → Refresh will not find it.

**EventBridge delivery failures (Tier D — inferred from architecture; not a directly enumerated failure in the captured docs):**
- EventBridge rules not created in the operator's account → discovery falls back to polling (or fails to pick up real-time changes); tag data may lag significantly behind workload state changes.
- Cross-account EventBridge target ARN uses wrong bus name → events silently dropped by AWS routing.

**Namespace tag absent or duplicated:**
- Described above under `zs:namespace` failure modes. The "No of Duplicates IP" counter in the account details region view is the primary signal.

**CC group not associated with Account Group:**
- Tag data is discovered and stored but never delivered to the Cloud Connector group handling traffic. Policy evaluation falls back to network primitives. No error surfaced — it is a silent configuration gap.

**Region not selected at account onboarding:**
- Workloads in that region are not discovered. No error; discovery is simply absent for that region. Re-add the region via account edit and re-sync.

## Source-citation gaps

The following items are referenced structurally in the help docs but not fully captured:

- **IAM policy document** — the exact permissions in the CloudFormation-generated IAM role are not enumerated in the help text. The CloudFormation template itself contains the policy. Operators should review it before execution.
- **EventBridge event patterns** — which event types (EC2 state changes, tag changes, Lambda events) are included in the EventBridge rules, and the exact cross-account event bus target ARN format, are not captured.
- **SQS permissions update for the CC role** — the workload discovery config doc lists "Update the Cloud Connector Role for SQS Permissions" as a required setup step, but the captured text does not describe the specific SQS permissions or the queue ARN format.
- **Supported region list completeness** — the captured account details page lists 10 regions; whether additional regions are supported is unverified.

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- AWS CC VM deployment: [`./aws-deployment.md`](./aws-deployment.md) (parallel doc — link assumed)
- Forwarding rules + methods: [`./forwarding.md`](./forwarding.md)
- Portfolio context: [`../_portfolio-map.md`](../_portfolio-map.md)
