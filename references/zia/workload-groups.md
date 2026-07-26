---
product: zia
topic: "workload-groups"
title: "ZIA Workload Groups — policy-scoping primitive (sourced from SDK / TF; help portal gap)"
content-type: reasoning
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/workload_groups.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/workload_groups.py"
  - "vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
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

> **SOURCE CAVEAT:** The Zscaler help portal page at
> `help.zscaler.com/zia/about-workload-groups` is **non-functional as of April
> 2026** — the SPA reroutes to unrelated content. This document is sourced from
> the Python SDK (`vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py` and
> its model), the **Go SDK** service struct
> (`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go`,
> whose field doc-comments are first-party behavioral documentation), and the
> Terraform provider schemas. The **field shape and operator vocabulary are now
> SDK-cross-confirmed** (Go doc-comments name the operators and the
> container/tag-container nesting explicitly — see Field shape). What remains
> genuinely unverified is **live-traffic match evaluation** — how the ZIA backend
> evaluates a built expression against workload traffic — which no available
> source describes. **Confidence: medium.**

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

API endpoint: `/zia/api/v1/workloadGroups` (OneAPI base). Confirmed in both
SDKs: Python `_zia_base_endpoint = "/zia/api/v1"` +
`/workloadGroups` (`vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py:31,69`)
and Go `const workloadGroupsEndpoint = "/zia/api/v1/workloadGroups"`
(`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:15`).
The legacy Postman/OneAPI collection roots the same resource at
`{{ZIABase}}/workloadGroups` (different, pre-OneAPI base) and carries only a
GET-all read example with no request-body schema
(`vendor/zscaler-api-specs/oneapi-postman-collection.json:9943-9982`) — so
Postman confirms the resource exists but is **not** a useful source for the
write/expression schema; the SDK remains source of truth there.

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
combining tags with a logical operator. The nesting and operator roles below
are confirmed by the Go SDK struct doc-comments
(`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go`):
`WorkloadTagExpression` is "the workload group expression … represented in a
JSON format" (line 40); `expressionJson` holds an `expressionContainers[]` list
(line 42); each container carries a `tagType`, an `operator`, and a
`tagContainer` (lines 45-53); the tag-container holds `tags[]` plus its own
`operator` (lines 56-63).

```
expressionJson                  # "the workload group expression … in a JSON format" (go:40)
  └─ expressionContainers[]     # list of ExpressionContainer (go:42)
       ├─ tagType               # string enum — see tag types below (go:47)
       ├─ operator              # AND | OR — "logical relationships among tag types" (go:49)
       └─ tagContainer          # (go:53)
            ├─ operator         # AND | OR — "combine the tags within a tag type" (go:62)
            └─ tags[]           # max 8 total per group (go:59) — see Tag limits
                 ├─ key         # string — tag key (e.g. "GroupName", "Vpc-id") (go:69)
                 └─ value       # string — tag value (go:71)
```

**Operators are AND / OR at both levels (SDK-confirmed).** The Go doc-comments
scope the operator to "either AND or OR" at the container level
(`workloadgroups.go:49`) and at the tag-container level
(`workloadgroups.go:62`). This is first-party SDK documentation, not inference.

**Tag types** (from TF `ValidateFunc`):

| Value | Meaning (inferred from SDK docstring examples) |
|---|---|
| `ANY` | Matches any tag type |
| `VPC` | VPC-level cloud tag (e.g. VPC ID) |
| `SUBNET` | Subnet-level tag |
| `VM` | VM / instance tag |
| `ENI` | Elastic Network Interface tag |
| `ATTR` | Arbitrary attribute tag (e.g. `GroupName`) |

**Operator values — SDK vs TF divergence.** The Go SDK doc-comments name only
`AND` and `OR` as the operators, at both the container level
(`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:49`)
and the tag-container level
(`workloadgroups.go:62`). The Terraform provider's `ValidateFunc` additionally
accepts `OPEN_PARENTHESES` and `CLOSE_PARENTHESES` for both operator fields —
values the Go SDK comments **do not mention**. This is a genuine SDK-vs-TF
divergence: the parentheses enum is **TF-provider-only** and is not part of the
operator vocabulary the SDK documents. How (or whether) ZIA uses parentheses to
build a precedence-grouped expression is unexplained in any available source —
see Gotchas #3.

### Tag limits

| Limit | Value | Source |
|---|---|---|
| Tags per workload group | **Max 8, across all tag types** | `vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:59` (Go SDK doc-comment on `TagContainer.Tags`) |

The Go SDK doc-comment states verbatim: "A maximum of 8 tags can be added to a
workload group, irrespective of the number of tag types present"
(`workloadgroups.go:59`). This is a **total** across the whole group, not a
per-tag-type budget — so a group spanning, say, VPC, VM, and ATTR tag types
still shares one pool of 8 tags. This is a first-party SDK behavioral limit and
is **distinct** from the TF-only `MaxItems: 255` cap, which bounds how many
*workload groups* a single policy rule may reference (not how many tags a group
may hold) — see the policy-rules table.

## API operations

Full CRUD is exposed by both the SDK and TF provider:

| Operation | SDK method | HTTP |
|---|---|---|
| List all | `workload_groups.list_groups()` | `GET /workloadGroups` |
| Get by ID | `workload_groups.get_group(group_id)` | `GET /workloadGroups/{id}` |
| Create | `workload_groups.add_group(**kwargs)` | `POST /workloadGroups` |
| Update | `workload_groups.update_group(group_id, **kwargs)` | `PUT /workloadGroups/{id}` |
| Delete | `workload_groups.delete_group(group_id)` | `DELETE /workloadGroups/{id}` |

List supports `page` and `page_size` query params (default size: 250; max: 1000;
`vendor/zscaler-sdk-python/zscaler/zia/workload_groups.py:47-50`).

**Lookup-by-name is client-side only.** ZIA exposes **no server-side name query
param** on `/workloadGroups`. To resolve a group by name you list all groups and
filter locally. The Go SDK's `GetByName` does exactly this — it calls
`common.ReadAllPages` then filters in Go with `strings.EqualFold`
(`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:85-97`),
which also makes the match **case-insensitive**. MCP v0.13.4 accepts only `page`
and `page_size`, forwards those pagination keys, and exposes no `query` argument
(`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zia/workload_groups.py:22-24,81-100`).
MCP callers therefore need to page/list and filter the returned rows locally.
The current lookup workflow still recommends
`zia_list_workload_groups(query="[?name=='...']")`
(`vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md:55,176`),
which is skill drift against the executable tool.

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

All five use the shared `setIdNameSchemaCustom(255, ...)` helper
(`vendor/terraform-provider-zia/zia/common.go:113-119`), meaning the field is an
ID+name set with `MaxItems: 255`. The SDK URL Filtering model also carries
`workloadGroups` (`url_filtering.py`); the Python SDK reformat list includes it.

> **Source divergence — TF/SDK wire 5, MCP workflow names 4.** The MCP
> rule-target workflow enumerates only **four** carrier rule types —
> Cloud Firewall, URL Filtering, SSL Inspection, Web DLP — and **omits Traffic
> Capture**
> (`vendor/zscaler-mcp-server/skills/zia/look-up-rule-targets/SKILL.md:45-57,109-125`).
> The TF provider wires `workload_groups` onto all five (the table above). This
> is an MCP workflow **under-count**, not a capability contradiction: the
> authoritative set is **5** (TF/SDK > workflow commentary in the source hierarchy).

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
   serve its expected content as of April 2026. This document is sourced from
   SDK code (Go + Python), TF schemas, and MCP/Postman corroboration. Field
   shape, operator vocabulary (AND/OR), the 8-tag cap, and the
   client-side-name-lookup behavior are SDK-confirmed. What stays unverified is
   _live-traffic evaluation semantics_ (how ZIA matches a built expression
   against workload traffic) — see Open questions.

2. **`expression` vs `expression_json` relationship is unverified.** The API
   returns both a string `expression` and a structured `expressionJson`. Whether
   they are kept in sync by ZIA on write (i.e., whether writing only
   `expression_json` produces a correct `expression` string on the next read)
   is not confirmed. The TF resource omits `expression` on write entirely and
   the SDK docstring only shows `expression_json` in create examples — tier-D
   inference that `expression_json` is the canonical write form.

3. **`OPEN_PARENTHESES` / `CLOSE_PARENTHESES` are a TF-only operator enum.**
   These two values appear in the TF `ValidateFunc` for both container-level and
   tag-container-level operators, but the Go SDK doc-comments scope the operator
   to "either AND or OR" at both levels
   (`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:49,62`)
   and never mention parentheses. So this is a documented **SDK-vs-TF
   divergence**, not merely "semantics unverified": the operator *vocabulary* is
   AND/OR per the SDK; the parentheses enum is TF-provider surface only. How (or
   whether) ZIA itself uses parentheses to build a precedence-grouped expression
   against live traffic remains unconfirmed.

4. **Two distinct numeric caps — don't conflate them.**
   - **Max 8 tags per workload group**, across all tag types — first-party Go SDK
     doc-comment
     (`vendor/zscaler-sdk-go/zscaler/zia/services/workloadgroups/workloadgroups.go:59`).
     This is a concrete authoring constraint (8 tags total, *not* 8 per
     tag-type) and is now SDK-sourced, not inferred — see Tag limits.
   - **Max 255 workload groups *per rule*** — derived from
     `setIdNameSchemaCustom(255, ...)`
     (`vendor/terraform-provider-zia/zia/common.go:113-119`) on all five carrier
     rule resources. This bounds how many groups a rule references, not tags per
     group. Whether 255 is a hard ZIA API limit or a TF-provider convention
     remains **unconfirmed** (TF `MaxItems` only).

5. **Activation required.** Creating, updating, or deleting a Workload Group
   via the TF provider triggers ZIA configuration activation (if
   `ZIA_ACTIVATION=true`). Same as all other ZIA write operations.

## Open questions

These behaviors are not backed by any available source (no functional help
portal page, no live-API evidence) and should not be treated as established.
All five are tracked together as `zia-69` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-69-workload-group-runtime-expression-evaluation-expressionjson-sync-and-tag-type-enum):

- **Live-traffic match evaluation.** How the ZIA backend evaluates a built
  expression against actual workload traffic — left-to-right, precedence rules,
  short-circuiting — is undocumented in SDK, TF, MCP, and Postman sources. Field
  shape and operator vocabulary are SDK-confirmed; the *runtime semantics* are
  not.
- **`expression` (string) vs `expressionJson` sync on write.** Whether ZIA keeps
  the human-readable `expression` string in sync when only `expressionJson` is
  written (and whether `expressionJson` is truly the canonical write form) is not
  confirmed by any source — the TF resource omits the string form on write and
  the SDK examples only populate the JSON form, but neither documents the
  server-side behavior.
- **Parentheses runtime behavior.** Even granting that `OPEN_PARENTHESES` /
  `CLOSE_PARENTHESES` are a TF-only enum, how (or whether) ZIA consumes them to
  build a precedence-grouped expression is unexplained anywhere.
- **Is `MaxItems: 255` a real API limit?** The 255-groups-per-rule cap is a TF
  provider `MaxItems` convention only; no SDK comment or API reference confirms
  ZIA enforces it server-side.
- **Tag-type enum completeness and meanings.** The tag-type values
  (`ANY`/`VPC`/`SUBNET`/`VM`/`ENI`/`ATTR`) come from the TF `ValidateFunc`; their
  exact semantics (and whether the list is exhaustive) are inferred from SDK
  docstring examples, not authoritatively documented.

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
