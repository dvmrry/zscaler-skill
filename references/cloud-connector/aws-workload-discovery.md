---
product: ztw
topic: "aws-workload-discovery"
title: "AWS workload discovery — account trust, EventBridge, namespace tagging"
content-type: reasoning
last-verified: "2026-06-15"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/discovery_service.py"
  - "vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go"
  - "vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go"
  - "vendor/terraform-provider-ztc/ztc/resource_ztc_account_groups.go"
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

> **Reference IaC vs production IaC.** Where CloudFormation or Terraform is mentioned below, references are to **Zscaler's published example templates** — reference implementations illustrating one valid onboarding path. They are not product specification. Runtime requirements and reference defaults are not always separately documented; this doc flags the distinction where it matters. **Fork agents:** if `_data/iac/` is populated for this fork, treat it as production truth. Use this doc for context and reasoning, not as a deployment spec.

> **Feature gating.** AWS partner integrations (workload discovery) must be enabled by Zscaler Support before the Partner Integrations menu is visible (*"To enable this feature, contact Zscaler Support."* — `vendor/zscaler-help/cbc-about-amazon-web-services-accounts.md:18`). Do not assume it is on by default.

> **This is not a console-only feature.** Every onboarding concept below has a backing REST endpoint; most have an SDK call (Python and/or Go), and some — but not all — have a Terraform resource. See [§ SDK / Terraform / API surface](#sdk-terraform-api-surface) below for the per-concept availability matrix — several operations (permission verification, Zscaler-side trust settings, data-collection enable/disable) are SDK/API-only with no Terraform resource. The console screens described here are one front-end over that API.

## Why workload discovery exists

Cloud Connector forwards traffic and applies policy to it. Useful policy — "block this workload because it has tag `env=dev`," "route this VPC's traffic differently" — requires Zscaler to know which IP address corresponds to which workload identity at any given moment. AWS workloads are ephemeral: IPs change, autoscaling groups cycle, containers come and go.

Workload discovery is the mechanism Zscaler uses to maintain a live mapping of `IP address → workload tags + attributes`. Without it, policy is limited to network primitives (IP ranges, VPC IDs). With it, operators can write policies that reference user-defined tags and cloud-provider-generated attributes — security group IDs, IAM instance profile ARNs, VPC IDs, platform details — and have those policies follow workloads as they move.

This is **distinct from Cloud Connector deployment**. A CC can be deployed in a VPC and forwarding traffic without workload discovery being configured at all. Discovery is an additive integration that enriches policy-matching capability.

## SDK / Terraform / API surface

The whole onboarding flow is automatable — console screens are one front-end over the `/ztw/api/v1` partner-integrations API. The table maps each console concept to its backing call. (Python client paths are `client.ztw.<service>`; the Go service package is `partner_integrations`; Terraform resources are in the `ztc` provider.)

| Console concept | REST endpoint | Python | Go | Terraform |
|---|---|---|---|---|
| Add / read / update / delete AWS account | `/publicCloudInfo` (+`/{id}`) | `ztw.public_cloud_info.{add,get,update,delete}_public_cloud_info` | `public_cloud_info.{Create,Get,Update,Delete}PublicCloudInfo` | `ztc_public_cloud_info` |
| Lightweight account list / count | `/publicCloudInfo/lite`, `/publicCloudInfo/count` | `list_public_cloud_info_lite`, `get_public_cloud_info_count` | — | — |
| Generate External ID | `POST /publicCloudInfo/generateExternalId` | `generate_external_id` | — | (Computed `external_id`) |
| Get CloudFormation template URL | `GET /publicCloudInfo/cloudFormationTemplate?awsAccountId=N` | `get_cloud_formation_template` | `GetCloudFormationTemplateURL` | — |
| List supported regions | `GET /publicCloudInfo/supportedRegions` | (region IDs via account onboarding) | `GetSupportedRegions` / `GetSupportedRegionsByName` | `ztc_supported_regions` data source |
| Enable / disable data collection | `PUT /publicCloudInfo/{id}/changeState?enable=` | `change_state_public_cloud_info` | — | — |
| Verify account permissions | `PUT /discoveryService/{awsAccountID}/permissions` | `discovery_service.update_discovery_service_permissions` | `UpdateDiscoveryPermissions` | — |
| Zscaler-side trust settings | `GET /discoveryService/workloadDiscoverySettings` | `discovery_service.get_discovery_settings` | `GetWorkloadDiscoverySettings` | — |
| Account Groups CRUD | `/accountGroups` (+`/{id}`, `/lite`, `/count`) | `ztw.account_groups.{list,get,add,update,delete}_account_group` | `account_groups.{Create,Get,Update,Delete}AccountGroups` | `ztc_account_groups` |

Citations: `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:34,114,182,227,311,389,424,506,548,618`; `vendor/zscaler-sdk-python/zscaler/ztw/discovery_service.py:32,73`; `vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py:34,100,156,201,257,308,343`; `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:33,42,56,72,81`; `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go:14,26,50,59,74,89`; `vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go:16`; `vendor/terraform-provider-ztc/ztc/resource_ztc_account_groups.go` (resource `ztc_account_groups`).

Two operational notes from source: a maximum of **512 AWS accounts per organization** (`vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:230`); the `cloudWatchGroupArn` field accepts the literal `"DISABLED"` to turn off CloudWatch logging (`vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:239`).

## The AWS account model

### What "adding an AWS account" means

Adding an AWS account to the Zscaler Admin Console (`Infrastructure > Connectors > Cloud > Management > Partner Integrations > AWS > Accounts`) registers that account as a discovery target. Zscaler stores the account ID, an IAM role name it will assume, and a set of regions to scan. The account is not usable until the corresponding IAM trust is deployed on the AWS side.

Each account entry carries:

| Field | SDK/TF field | Purpose |
|---|---|---|
| AWS Account ID | `awsAccountId` / `aws_account_id` | The account where workloads are deployed (12 digits) |
| AWS Role Name | `awsRoleName` / `aws_role_name` | The IAM role in the operator's account that Zscaler will assume |
| External ID | `externalId` / `external_id` | Unique per-account ID used in the IAM trust relationship; prevents confused-deputy attacks |
| Trusted Account ID | `trustedAccountId` / `trusted_account_id` | The Zscaler AWS account ID; must appear in the operator's IAM trust policy |
| Trusted Role | `trustedRole` / `trusted_role` | The Zscaler-side role that performs the `AssumeRole` call |
| Event Bus Name | `eventBusName` / `event_bus_name` | The EventBridge bus in the Zscaler account; target for real-time event forwarding |
| CloudWatch Group ARN | `cloudWatchGroupArn` / `cloud_watch_group_arn` | ARN of the AWS CloudWatch log group; `"DISABLED"` to disable |
| Regions | `supportedRegions` / `supported_regions` | The AWS regions Zscaler is permitted to scan |

Every field above is defined in the `AccountDetails` schema, not just the console UI: the Terraform `account_details` block (`vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go:68-120`), the Go `AccountDetails` struct (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go:55-85`), and the Python `AccountDetails` model (`vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py:38-46`). The two Zscaler-side trust values are also exposed standalone via a workload-discovery-settings read as `WorkloadDiscoverySettings{TrustedAccountId, TrustedRoleName}` (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:16-23`).

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

The External ID is a per-account secret that Zscaler generates server-side. The console is one front-end for that; the API exposes it directly via `POST /publicCloudInfo/generateExternalId` (taking `awsAccountId` + `awsRoleName`, returning the external ID string — `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:548-616`). The value lands in the `externalId` / `external_id` field, which is **Computed** in the Terraform schema — Zscaler assigns it, you do not set it (`vendor/terraform-provider-ztc/ztc/resource_ztc_public_cloud_info.go:63-67,93-97`). It must be written into the `Condition` block of the operator's IAM trust policy. If it is missing or wrong, the `AssumeRole` call is rejected. The Zscaler help doc notes: *"If this ID is regenerated, update it in your AWS account."* — regeneration breaks the existing trust until the AWS role is updated.

### IAM permissions scope

The CloudFormation template Zscaler provides creates the required IAM role. The capture does not enumerate the exact permission set inline, but the workload discovery configuration doc lists the **attributes Zscaler fetches**: security group IDs and names, AMI IDs, platform details, VPC IDs, IAM instance profile ARNs, and Lambda function metadata (via ENI). This implies read-only EC2 and Lambda describe-level permissions scoped to the configured regions.

**The template itself is API-retrievable** — it is not an opaque console artifact. `GET /publicCloudInfo/cloudFormationTemplate?awsAccountId=N` returns a URL pointing to the template (the optional `awsAccountId` query parameter customizes it with account-specific values; omit it for a generic template). This is wired as `GetCloudFormationTemplateURL` in Go (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:56-70`) and `get_cloud_formation_template` in Python (`vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:424-504`). Both note the endpoint returns a plain-text URL string even though the Content-Type is `application/json`.

**Source-citation gap (narrowed):** the *template URL* is API-retrievable, but the **policy JSON inside the rendered template** is not reproduced in the SDK or help text. Operators should fetch the template via the endpoint above (or the console) and inspect the policy document before execution rather than inferring permissions from discovery attribute names alone.

## Permission states

The permission state is carried by the `permissionStatus` field on the account object (Python `PublicCloudInfo.permission_status` ← `permissionStatus`, `vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py:104`; the Python service documents it as a settable keyword arg with example value `"TBD"`, `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:247`). The Go struct carries the same field but currently leaves it commented out (`...public_cloud_info.go:36-37`), so for state reads use the Python client. The verify-on-demand action is a real endpoint: `PUT /discoveryService/{awsAccountID}/permissions`, supplying the discovery role and external ID (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:81-91`; Python `update_discovery_service_permissions`, `vendor/zscaler-sdk-python/zscaler/ztw/discovery_service.py:73-110`). The three state *labels* below are enumerated in the help text — *"Permission: The permission status of the account (i.e., Pending, Allowed, or Denied)."* (`vendor/zscaler-help/cbc-about-amazon-web-services-accounts.md:38`); the SDK confirms the field exists but does not itself enumerate its string values.

After adding an account, the permission column in the Zscaler console shows one of three states:

| State | Meaning |
|---|---|
| **Pending** | Account registered in Zscaler; IAM role not yet deployed or not yet synced. The Zscaler discovery service has not attempted or not yet completed an `AssumeRole` validation. |
| **Allowed** | IAM role correctly deployed; Zscaler can assume it and discover tags. |
| **Denied** | Zscaler attempted `AssumeRole` and was rejected. Role not deployed, trust policy wrong, External ID mismatch, or incorrect Trusted Account ID / Trusted Role. |

The transition from Pending to Allowed/Denied is not automatic on role deployment — an operator must click **Refresh** on the account in the Zscaler console (or programmatically re-run the permissions verification PUT above). The "Latest Sync" column reflects the time the Refresh was last triggered, not real-time sync status; it maps to the account object's `lastSyncTime` / `last_sync_time` field (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go:34`; Python `vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py:103`).

A **Denied** account in an Account Group blocks tag discovery for that account across all CC groups that reference the group. An account can remain in a group in Denied state — the group UI shows per-account permission status.

## EventBridge integration

The workload discovery configuration requires setting up AWS EventBridge in the operator's account to forward events to Zscaler. The Event Bus Name field in the Zscaler account config is the target event bus in the **Zscaler** AWS account, and it is a first-class API field — `eventBusName` / `event_bus_name` on `AccountDetails`, described in source as *"the name of the event bus that sends notifications to the Zscaler service using EventBridge"* (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go:68-69`; Python `vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py:41`; the Python service example uses a value like `zscaler-bus-24326813-zscalerthree.net`, `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:269`). The operator creates EventBridge rules in their own account that route relevant EC2/ECS/Lambda lifecycle events to that cross-account bus.

This provides the real-time update path: rather than polling for tag changes on a schedule, Zscaler receives event notifications as workloads start, stop, change tags, or move. The Zscaler workload discovery config doc identifies EventBridge configuration as one of four required setup steps (alongside role creation, CC role SQS permissions update, and namespace/duplicate IP configuration).

**Source-citation gap:** the specific EventBridge event patterns (which event types, which source services) and the cross-account bus target ARN format are not enumerated in the captured help text. This detail lives in the CloudFormation template. The captures confirm that EventBridge is the real-time metadata pipeline and that the Event Bus Name in the Zscaler console is the target, but do not reproduce the event rule JSON.

## AWS Account Groups

### What a group is

An AWS Account Group bundles multiple AWS accounts so that a single Cloud Connector group can receive tag information from all of them. This maps directly to the `AccountGroups` object, whose two relationship fields are `publicCloudAccounts` (the member AWS accounts) and `cloudConnectorGroups` (the consuming CC groups) — Go struct `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go:17-24`, Python model `vendor/zscaler-sdk-python/zscaler/ztw/models/account_groups.py:44,47`, Terraform `ztc_account_groups` resource `vendor/terraform-provider-ztc/ztc/resource_ztc_account_groups.go:69`. The full CRUD surface lives at `/ztw/api/v1/accountGroups` (`...account_groups.go:14`; Python `vendor/zscaler-sdk-python/zscaler/ztw/account_groups.py:73-75`). The core purpose: Cloud Connector is not tied to the single account in which it is deployed. In an AWS Organizations model, workloads span many accounts; a CC in a transit/security account needs tag data from spoke accounts where the actual workloads run.

Account Groups are the indirection layer between "which accounts has Zscaler discovered" and "which CC groups consume that tag data."

### Group-to-CC Group binding

An Account Group is associated with one or more **Cloud Connector Groups** at group-creation time. The help doc describes this as: *"select the Cloud Connector groups where tag information is sent."* In the API this is the `cloudConnectorGroups` list on the `AccountGroups` object (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/account_groups/account_groups.go:23`; Terraform field `cloud_connector_groups`, `vendor/terraform-provider-ztc/ztc/resource_ztc_account_groups.go:69,185`). This is the linkage that determines which CCs receive the tag-to-IP mapping database for these accounts. A CC group that is not associated with any Account Group has no workload tag visibility, even if individual AWS accounts are onboarded.

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

**The authoritative list is API-listable — don't treat the snapshot above as the source of truth.** The set of supported regions is served by `GET /publicCloudInfo/supportedRegions` (Go `GetSupportedRegions` / `GetSupportedRegionsByName`, `vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:33-54`). Each entry is an `{id, name, cloudType}` object (`SupportedRegions` struct, `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:168-178`); account onboarding references regions by their numeric IDs (`supported_region_ids`), not region names. Query the endpoint for the current canonical list rather than relying on the captured snapshot.

### Discovery service status (per region)

Per-region status is carried by the `regionStatus` collection on the account object (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/public_cloud_info/public_cloud_info.go:46`; Python `region_status`, `vendor/zscaler-sdk-python/zscaler/ztw/models/public_cloud_info.py:106-108`). Note the Go SDK models each region's `status` as a **boolean** ("indicates the operational status of the region" — `RegionStatus` struct, `vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go:154-166`); the four granular status *strings* below come from the console/account-details help capture, not the SDK type.

The account details page shows a per-region discovery status:

| Status | Meaning |
|---|---|
| `Success` | Discovery running normally |
| `Disabled` | Data collection disabled; re-enable from the Accounts page |
| `Error` | Discovery encountered a problem |
| `Starting Discovery` | Data collection not yet started |

The "No of Duplicates IP" counter in the region view is the operational signal for namespace configuration. If this is non-zero, namespaces are needed (see below).

### Data collection toggle

Operators can disable and re-enable data collection per account (`Disable Data Collection` / `Enable Data Collection` from the account action menu). This is the `changeState` API behind the menu item: `PUT /publicCloudInfo/{cloud_id}/changeState` with `enable=true|false` enables/disables the account *in all regions* (`change_state_public_cloud_info`, `vendor/zscaler-sdk-python/zscaler/ztw/public_cloud_info.py:618-668`). Disabling stops tag discovery; policy that referenced discovered tags loses its workload-identity binding for that account until re-enabled.

## Sublocation scopes

Sublocations in an AWS Cloud Connector deployment are automatically created when CCs are deployed; they have `Location Type = Workload traffic`. Sublocation scopes subdivide that location to apply differentiated policy based on workload origin.

Four scope types exist:

| Scope Type | Requires Workload Discovery |
|---|---|
| VPC Endpoint | **No** |
| VPC | Yes |
| Account | Yes |
| Namespace | Yes |

**VPC Endpoint scope is the only type that does not require workload discovery** (`cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md:21`). The other three scope types — VPC, Account, and Namespace — all require workload discovery to be configured.

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

The following items are referenced structurally but not fully captured even in the SDK/TF source. (Several items the earlier draft listed here — supported regions, trust-field definitions, the CloudFormation template URL, permission verification — are now source-answered above and have been removed from this list.)

- **IAM policy JSON inside the CloudFormation template** — the template *URL* is API-retrievable (`GET /publicCloudInfo/cloudFormationTemplate`, see above), but the actual permission document rendered inside that template is not reproduced in the SDK or help text. Fetch and inspect the template before execution.
- **EventBridge event patterns** — which event types (EC2 state changes, tag changes, Lambda events) the EventBridge rules match, and the cross-account event-bus target ARN format, are not in source. The SDK exposes `eventBusName` as a string field but not the rule/pattern body; that lives in the CloudFormation template.
- **SQS permissions update for the CC role** — the workload discovery config doc lists "Update the Cloud Connector Role for SQS Permissions" as a required setup step, but neither the captured text nor the SDK describes the specific SQS permissions or the queue ARN format.

## Open questions

These are not answered by the SDK service layer, Terraform provider, or captured help text, and should not be asserted without a primary source:

- **Per-region `status` representation.** The Go `RegionStatus.status` is typed as a boolean, while the help capture shows four strings (`Success` / `Disabled` / `Error` / `Starting Discovery`). Whether the API actually returns a richer status (and the SDK under-models it) or the console derives the strings from a boolean plus other fields is unresolved. See [clarification `cloud-connector-01`](../_meta/clarifications.md#cloud-connector-01-per-region-status-representation-regionstatusstatus).
- **EventBridge / IAM / SQS body inside the CloudFormation template.** The `eventBusName` field is API-modeled, but the event-pattern JSON (which EC2/ECS/Lambda event types are matched) and the cross-account target ARN format live inside the CloudFormation template, which is not reproduced as text in source. Likewise the rendered IAM permission document, and the SQS permissions added by the "Update the Cloud Connector Role for SQS Permissions" setup step (no SDK/TF surface, no enumerated permission/queue-ARN detail in captured text), live only in the template URL. See [clarification `cloud-connector-02`](../_meta/clarifications.md#cloud-connector-02-aws-workload-discovery-cloudformation-body-eventbridge-iam-sqs).

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- AWS CC VM deployment: [`./aws-deployment.md`](./aws-deployment.md) (parallel doc — link assumed)
- Forwarding rules + methods: [`./forwarding.md`](./forwarding.md)
- Portfolio context: [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md)
