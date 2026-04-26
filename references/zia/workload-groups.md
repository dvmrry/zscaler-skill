---
product: zia
topic: "workload-groups"
title: "ZIA Workload Groups — policy-scoping primitive (sourced from SDK / TF; help portal gap)"
content-type: reasoning
last-verified: "2026-04-26"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/workload_groups.py"
  - "vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_workload_groups.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_url_filtering_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_firewall_filtering_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_ssl_inspection_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_dlp_web_rules.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_traffic_capture_rules.go"
  - "vendor/terraform-provider-zia/zia/common.go"
author-status: draft
---

# ZIA Workload Groups

> **SOURCE CAVEAT (load-bearing):** The Zscaler help portal page at
> `help.zscaler.com/zia/about-workload-groups` is **non-functional as of April
> 2026** — the SPA reroutes to unrelated content. This document is sourced
> entirely from the Python SDK (`vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py`
> and its model) and the Terraform provider schemas. **Confidence: medium.**
> Semantic intent (especially how the ZIA backend evaluates expressions against
> live traffic) cannot be confirmed without live-API or upstream-doc evidence.

## Orientation

Workload Groups are a ZIA **policy-scoping primitive** distinct from Locations
and Location Groups. Where Location Groups aggregate forwarding endpoints by
network topology or attribute, Workload Groups aggregate **cloud-workload
identities** — expressed as tag-based conditions (VPC ID, ENI ID, VM tags,
arbitrary cloud attributes). They let operators scope URL Filtering, Firewall,
SSL Inspection, DLP, and Traffic Capture rules at workloads rather than
subnets.

They are a counterpart to the predefined **Workload Traffic Group** dynamic
Location Group (see [`./locations.md § Predefined dynamic groups`](./locations.md)):
Workload Traffic Group answers "which _locations_ carry workload traffic";
Workload Groups answer "which _workloads within those locations_ match this
policy."

API endpoint: `/zia/api/v1/workloadGroups`.

## Why this matters

Workload Groups appear as a `workloadGroups` array field on multiple policy
rule types. Operators reading SDK or snapshot JSON will see this field on URL
Filtering rules and may encounter it on Firewall, SSL Inspection, DLP, and
Traffic Capture rules as well. Without knowing what a Workload Group is, the
field looks opaque — it is not a Location Group and not a user/group identity.

Understanding this object is required to:

- Reason about which cloud workloads a rule targets.
- Debug rules that appear scoped correctly by location but are over- or
  under-matching on workload traffic.
- Manage Workload Groups via TF or the SDK without guessing the expression
  schema.

## Field shape

### Top-level object (`WorkloadGroups`)

| Field | API key | Type | Notes |
|---|---|---|---|
| `id` | `id` | int | Assigned by ZIA on create. |
| `name` | `name` | str | Required on create (SDK enforces via `add_group`). |
| `description` | `description` | str | Optional free text. |
| `expression` | `expression` | str | Human-readable expression string. Read-only on data source; present on both read and write. Exact format is unverified — SDK passes it through without normalization. |
| `expression_json` | `expressionJson` | nested | Structured form of the expression. See below. |
| `last_modified_time` | `lastModifiedTime` | int (epoch) | Read-only; set by ZIA. |
| `last_modified_by` | `lastModifiedBy` | CommonBlocks (id/name) | Read-only; set by ZIA. |

The TF resource schema exposes `id`, `group_id` (computed int alias for the
numeric ID), `name`, `description`, and `expression_json`. It does not expose
`expression` (string form) as writable — the TF resource omits it on write,
while the data source reads and surfaces it.

### Expression structure (`expressionJson` / `expression_json`)

The expression is a tree of **containers**, each targeting a tag type and
combining tags with a logical operator.

```
expressionJson
  └─ expressionContainers[]     # list of ExpressionContainer
       ├─ tagType               # string enum — see tag types below
       ├─ operator              # AND | OR | OPEN_PARENTHESES | CLOSE_PARENTHESES
       └─ tagContainer
            ├─ operator         # AND | OR | OPEN_PARENTHESES | CLOSE_PARENTHESES
            └─ tags[]
                 ├─ key         # string — tag key (e.g. "GroupName", "Vpc-id")
                 └─ value       # string — tag value
```

**Tag types** (from TF `ValidateFunc`):

| Value | Meaning (inferred from SDK docstring examples) |
|---|---|
| `ANY` | Matches any tag type |
| `VPC` | VPC-level cloud tag (e.g. VPC ID) |
| `SUBNET` | Subnet-level tag |
| `VM` | VM / instance tag |
| `ENI` | Elastic Network Interface tag |
| `ATTR` | Arbitrary attribute tag (e.g. `GroupName`) |

**Container-level operator values:** `AND`, `OR`, `OPEN_PARENTHESES`,
`CLOSE_PARENTHESES`. The parentheses values suggest the expression tree
supports grouping, but the exact evaluation semantics are unverified (source:
TF `ValidateFunc` only — tier D inference).

## API operations

Full CRUD is exposed by both the SDK and TF provider:

| Operation | SDK method | HTTP |
|---|---|---|
| List all | `workload_groups.list_groups()` | `GET /workloadGroups` |
| Get by ID | `workload_groups.get_group(group_id)` | `GET /workloadGroups/{id}` |
| Create | `workload_groups.add_group(**kwargs)` | `POST /workloadGroups` |
| Update | `workload_groups.update_group(group_id, **kwargs)` | `PUT /workloadGroups/{id}` |
| Delete | `workload_groups.delete_group(group_id)` | `DELETE /workloadGroups/{id}` |

List supports `page` and `page_size` query params (default size: 250; max: 1000).

TF `zia_workload_groups` resource: supports create, read, update, delete, and
import by either numeric ID or name. Changes trigger `ZIA_ACTIVATION` if the
env var is set.

## Policy rules that carry `workloadGroups`

Verified from TF resource and data source files:

| Policy module | TF resource | Field |
|---|---|---|
| **URL Filtering** | `zia_url_filtering_rules` | `workload_groups` |
| **Firewall Filtering** | `zia_firewall_filtering_rules` | `workload_groups` |
| **SSL Inspection** | `zia_ssl_inspection_rules` | `workload_groups` |
| **DLP Web Rules** | `zia_dlp_web_rules` | `workload_groups` |
| **Traffic Capture** | `zia_traffic_capture_rules` | `workload_groups` |

All five use the shared `setIdNameSchemaCustom(255, ...)` helper, meaning the
field is an ID+name set, max 255 members. The SDK URL Filtering model also
carries `workloadGroups` (`url_filtering.py`); the Python SDK reformat list
includes it.

Forwarding Control rules do **not** carry `workload_groups` in the TF source.
Bandwidth Control, Cloud App Control, and other rule types were not observed
with this field — absence in TF source is consistent with not having it, but
is not definitive (tier D).

## Cross-product context: Cloud Connector integration

Workload Groups are populated in the context of **Cloud Connector** deployments.
Cloud Connector creates sublocations with `Location Type = Workload traffic`,
which auto-enroll them into the predefined **Workload Traffic Group** dynamic
Location Group. Workload Groups layer on top of that: while the Workload
Traffic Group scopes by the forwarding endpoint (the Cloud Connector
sublocation), Workload Groups scope by the workload's cloud identity tags
(VPC, ENI, VM labels, etc.) as reported by Cloud Connector.

This means a rule can simultaneously scope by:

- `location_groups` → Workload Traffic Group (which locations carry workload traffic)
- `workload_groups` → a Workload Group (which workloads within those locations)

For operators not using Cloud Connector, Workload Groups will be absent or
empty in most policy rules — their presence in the schema is a Cloud Connector
feature surface, not a general-purpose tagging system for user traffic.

## Gotchas and source-citation gaps

1. **Help portal gap.** `help.zscaler.com/zia/about-workload-groups` does not
   serve its expected content as of April 2026. All semantic claims in this
   document derive from SDK/TF code only. Treat everything about _evaluation
   semantics_ (how ZIA matches an expression against live traffic) as
   unverified until a functional help-portal page or API reference confirms it.

2. **`expression` vs `expression_json` relationship is unverified.** The API
   returns both a string `expression` and a structured `expressionJson`. Whether
   they are kept in sync by ZIA on write (i.e., whether writing only
   `expression_json` produces a correct `expression` string on the next read)
   is not confirmed. The TF resource omits `expression` on write entirely and
   the SDK docstring only shows `expression_json` in create examples — tier-D
   inference that `expression_json` is the canonical write form.

3. **`OPEN_PARENTHESES` / `CLOSE_PARENTHESES` operator values.** Exposed in
   TF ValidateFunc for both container-level and tag-container-level operators.
   How ZIA uses these to build a precedence-grouped expression is not explained
   in any available source. Tier D — present in schema, semantics unverified.

4. **Max 255 workload groups per rule.** Derived from `setIdNameSchemaCustom(255,
   ...)` in all rule resources. Whether this is a hard ZIA API limit or a TF
   provider convention is unconfirmed.

5. **Activation required.** Creating, updating, or deleting a Workload Group
   via the TF provider triggers ZIA configuration activation (if
   `ZIA_ACTIVATION=true`). Same as all other ZIA write operations.

## Cross-links

- **Workload Traffic Group (predefined dynamic Location Group):**
  [`./locations.md § Predefined dynamic groups`](./locations.md) — explains
  how `Location Type = Workload traffic` auto-populates the dynamic LG that
  Cloud Connector sublocations land in.
- **URL Filtering rules:** [`./url-filtering.md`](./url-filtering.md) — lists
  `workloadGroups` as an SDK-visible criteria field.
- **Cloud Connector:** [`../cloud-connector/overview.md`](../cloud-connector/overview.md)
  — the product that creates the workload sublocations and populates cloud
  identity tags consumed by Workload Group expressions.
- **Forwarding Control:** [`./forwarding-control.md`](./forwarding-control.md)
  — does not carry `workload_groups` in the TF source (confirmed absent).
