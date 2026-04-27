---
product: zpa
topic: "zpa-segment-groups"
title: "ZPA Segment Groups — semantics, membership, policy use"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-segment-groups.md"
  - "vendor/zscaler-help/zsdk-about-segment-groups.md"
  - "vendor/zscaler-help/zsdk-about-access-policy.md"
  - "vendor/zscaler-help/about-microtenants.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_segment_group.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_segment_group.md"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_segment_group.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/segmentgroup/zpa_segment_group.go"
  - "vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py"
author-status: draft
---

# ZPA Segment Groups — semantics, membership, policy use

A Segment Group is a **policy-scoping and administrative-grouping container for App Segments**. It is a label that gives policy rules a stable, named handle to target a set of applications. Beyond policy targeting it provides no traffic-routing function.

The existing [`./segment-server-groups.md`](./segment-server-groups.md) compares Segment Groups and Server Groups side-by-side at a high level. This document provides the full reference treatment for Segment Groups specifically.

---

## 1. What a Segment Group IS and IS NOT

### What it IS

- A named, enable/disable-able container that holds a list of App Segments.
- The primary targeting primitive for access policy, forwarding policy, inspection policy, and timeout policy rules. Rules reference Segment Groups via the `APP_GROUP` object type in their condition operands.
- An administrative organizing unit. Logical groupings such as "Sales Applications" or "HR Tools" make policy authoring and auditing human-readable and reduce per-segment rule proliferation.
- A required assignment for every App Segment. The API and help portal both state: "You must place each application segment you configure into a segment group." An App Segment without a Segment Group cannot be targeted by any `APP_GROUP`-based policy rule. Source: `about-segment-groups.md`.

### What it IS NOT

- A **Server Group** (different concept). A Server Group controls *traffic delivery* — it binds App Connector Groups to backend servers and determines which connectors proxy connections. A Segment Group controls *policy targeting*. Both objects have "Group" in their name; confusing them is the most common source of ZPA misconfiguration. Full comparison: [`./segment-server-groups.md`](./segment-server-groups.md).
- A **Connector Group** or **Server Group**. Segment Groups have no knowledge of connectors, servers, or network topology.
- An enforcement point. Disabling a Segment Group's `enabled` flag does not re-route or drop traffic at the connector level. Its effect is policy-layer only: an access rule whose `APP_GROUP` condition points to a disabled Segment Group's semantics at the connector level are not confirmed by source code (Tier-D: likely the rule stops matching, making the group's App Segments unreachable via that rule; this is inference, not documented API contract).

---

## 2. Membership — how App Segments associate with Segment Groups

### One-to-one constraint (hard limit)

An App Segment can belong to **exactly one Segment Group**. The help portal is explicit:

> "You cannot assign an application segment to multiple segment groups. For example, if you place Salesforce in the 'Sales Applications Group,' you cannot add Salesforce to another group." — `about-segment-groups.md`

This is a first-class API constraint, not just a UI convention.

### Bidirectional reference model

The relationship is maintained from both sides:

| Object | Field | Content |
|---|---|---|
| App Segment | `segment_group_id` (string) | ID of the owning Segment Group |
| Segment Group | `applications[]` | Array of App Segment objects belonging to the group |

When you add an App Segment to a Segment Group, both the App Segment's `segment_group_id` and the Segment Group's `applications[]` are updated by the API. The TF resource reflects this: `resource_zpa_segment_group.go` reads back the `applications` list on every plan/apply cycle, and the data source exports a full `applications` block containing the segment's domain names, port ranges, server groups, and other attributes.

### Membership lifecycle

- **At App Segment creation**: `segment_group_id` is set. If omitted in Terraform (`Optional + Computed` per TF schema for `zpa_application_segment`), TF will not error, but the segment will have no policy-targetable group.
- **Moving a segment between groups**: reassign `segment_group_id` on the App Segment. The old group's `applications[]` automatically loses the entry; the new group gains it.
- **Deleting a Segment Group**: the TF provider's `resourceSegmentGroupDelete` calls `detachSegmentGroupFromAllPolicyRules` first (see Section 4 below), then deletes the group. App Segments formerly in the group are not deleted, but they are effectively orphaned — their `segment_group_id` points to a now-nonexistent object. Source: `resource_zpa_segment_group.go` lines 212–216.
- **API-only deletion** (SDK or direct HTTP, not via TF): does not call `detachSegmentGroupFromAllPolicyRules`. Policy rules that reference the deleted group's ID are left with stale `APP_GROUP` operands. This is a known operational hazard (see Section 6).

### A Segment Group can be empty

A Segment Group with zero App Segments is valid and can be created without any `applications[]` entries. Empty groups referenced in policy rules contribute no matching scope — effectively making the rule a no-op for the `APP_GROUP` dimension.

---

## 3. Policy interaction

### Object type in policy conditions

Policy rules reference Segment Groups via conditions with `objectType = "APP_GROUP"`. This is the API wire-level identifier. In v1 policy rules the operand carries `lhs: "id"` and `rhs: "<segment_group_id>"`. In v2 policy rules the operand carries `objectType: "APP_GROUP"` and a `values: ["<segment_group_id>"]` array.

Source: `resource_zpa_segment_group.go` — `detachSegmentGroupFromV1Policies` filters for `op.ObjectType == "APP_GROUP" && op.LHS == "id" && op.RHS == id`, and `detachSegmentGroupFromV2Policies` filters for `strings.EqualFold(op.ObjectType, "APP_GROUP")` checking `op.Values`.

### Policy types that use Segment Groups

The TF provider's deletion cleanup code documents exactly which policy types scan for `APP_GROUP` references:

| Policy type | API identifier |
|---|---|
| Access Policy | `ACCESS_POLICY` |
| Timeout Policy | `TIMEOUT_POLICY` |
| SIEM Policy | `SIEM_POLICY` |
| Client Forwarding Policy | `CLIENT_FORWARDING_POLICY` |
| Inspection Policy | `INSPECTION_POLICY` |

Both v1 and v2 policy API versions are searched. Source: `detachSegmentGroupFromV1Policies` and `detachSegmentGroupFromV2Policies` in `resource_zpa_segment_group.go`.

### AND/OR semantics within a rule

From `zsdk-about-access-policy.md` and [`./policy-precedence.md`](./policy-precedence.md):

- Multiple Segment Groups within a single rule condition block: implicit **OR**. The rule fires if the request's App Segment belongs to *any* of the listed groups.
- A Segment Group condition combined with an Application Segment condition in the same rule: **OR** between the two application-scope criteria.
- Segment Group criteria combined with non-application criteria (SAML attributes, country, client type, etc.): **AND**. All criterion types must evaluate true.

Structural summary:

```
(app_segments OR segment_groups)  AND
(saml_attrs)                       AND
(countries)                        AND
(client_types)                     AND
...
```

### Relationship to App Segment vs Segment Group targeting

A rule can specify application scope using individual App Segments, one or more Segment Groups, or a mix of both. Using a Segment Group is the recommended pattern when:

- Multiple application segments need the same access policy applied.
- The set of applications governed by a policy may grow over time (adding an App Segment to the group automatically extends the policy without modifying the rule).
- Operator wants policy readability — `Sales Applications` is more auditable than an enumeration of twelve individual segment IDs.

Individual App Segment targeting in a rule is appropriate when:

- A specific exception rule must apply to one segment within a group (but not the others in that group).
- Fine-grained "block `app_X` for all" rules alongside a "allow `group_Y` for `sales_dept`" rule.

### Policy evaluation order context

Segment Groups participate in normal ZPA policy evaluation: first-match-wins, top-down, after segment selection has already occurred client-side. Full mechanics in [`./policy-precedence.md`](./policy-precedence.md).

---

## 4. Configuration surface

### API endpoint

```
GET/POST /zpa/mgmtconfig/v1/admin/customers/{customerId}/segmentGroup
GET/PUT/DELETE /zpa/mgmtconfig/v1/admin/customers/{customerId}/segmentGroup/{id}
PUT /zpa/mgmtconfig/v2/admin/customers/{customerId}/segmentGroup/{id}  (update-only v2 variant)
```

Updates use v2 for the PUT (both Go SDK `UpdateV2` and Python SDK `update_group_v2` route to the v2 endpoint). The v2 update endpoint is the current-preferred form. Source: `zpa_segment_group.go` lines 123–130, `segment_groups.py` lines 297–310.

### API model fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | System-assigned UUID on creation |
| `name` | string | Required |
| `description` | string | Optional |
| `enabled` | bool | No `omitempty` — false is a meaningful value |
| `configSpace` | string | Typically `DEFAULT`; not user-settable in standard configs |
| `policyMigrated` | bool | Tracks whether legacy policies have been migrated; no `omitempty` |
| `tcpKeepAliveEnabled` | string | Optional; presence/absence controls TCP keepalive behavior |
| `microtenantId` | string | Optional; scopes the group to a microtenant |
| `microtenantName` | string | Read-only; populated by the API when `microtenantId` is set |
| `applications[]` | array | App Segment stubs — on read, contains full segment details; on write via TF, contains only `{id}` objects |
| `addedApps` / `deletedApps` | string | API delta fields; not user-settable directly |

Source: `zpa_segment_group.go` struct definition lines 19–36.

### Terraform resource (`zpa_segment_group`)

```terraform
resource "zpa_segment_group" "example" {
  name        = "Sales Applications"
  description = "All sales-related application segments"
  enabled     = true
  # microtenant_id = "..." # only if microtenant feature is enabled
}
```

**Required:** `name` only. All other fields are optional.

**Schema fields (resource):**

| TF argument | Type | Required? | Notes |
|---|---|---|---|
| `name` | string | Yes | |
| `description` | string | No | |
| `enabled` | bool | No | |
| `applications` | list of `{id}` | No / Computed | TF manages via App Segment's `segment_group_id`; rarely set directly on the group resource |
| `microtenant_id` | string | No / Computed | Requires microtenant license; can also be set via env var `ZPA_MICROTENANT_ID` |

**Important**: The TF resource sends App Segment IDs as `applications: [{id: "..."}]` objects on write, but reads back full Application objects. On update, `expandSegmentGroup` only sends the `ID` field of each application, not the full segment definition. Source: `resource_zpa_segment_group.go` lines 237–249.

**Update uses v2 API**: `resourceSegmentGroupUpdate` calls `segmentgroup.UpdateV2`. Source: line 185.

**Import**: by ID or by name.

```shell
terraform import zpa_segment_group.example <segment_group_id>
terraform import zpa_segment_group.example "Sales Applications"
```

### Terraform data source (`zpa_segment_group`)

```terraform
data "zpa_segment_group" "example" {
  name = "Sales Applications"
}
```

The data source exports the full `applications[]` block (domain names, port ranges, health check type, server groups, microtenant attributes) plus `policy_migrated`, `tcp_keep_alive_enabled`, and `config_space`. Use this to reference a Segment Group created outside of TF in policy rules.

### Go SDK (`segmentgroup` package)

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/zpa/services/segmentgroup"

// CRUD
segmentgroup.Get(ctx, service, id)
segmentgroup.GetByName(ctx, service, name)
segmentgroup.Create(ctx, service, &sg)
segmentgroup.Update(ctx, service, id, &sg)    // v1 PUT
segmentgroup.UpdateV2(ctx, service, id, &sg)  // v2 PUT (preferred)
segmentgroup.Delete(ctx, service, id)
segmentgroup.GetAll(ctx, service)
```

All calls must include `common.Filter{MicroTenantID: service.MicroTenantID()}` — the helpers do this internally. Source: `zpa_segment_group.go` lines 81–148.

### Python SDK (`segment_groups` module)

```python
# List all
groups, _, err = client.zpa.segment_groups.list_groups()

# Get by ID
group, _, err = client.zpa.segment_groups.get_group("216196257331370181")

# Create
group, _, err = client.zpa.segment_groups.add_group(
    name="Sales Applications",
    description="Sales apps",
    enabled=True,
)

# Update (v1 PUT)
group, _, err = client.zpa.segment_groups.update_group(group_id, name="Renamed")

# Update (v2 PUT — preferred)
group, _, err = client.zpa.segment_groups.update_group_v2(group_id, name="Renamed")

# Delete
_, _, err = client.zpa.segment_groups.delete_group(group_id)

# JMESPath client-side filter
groups, resp, err = client.zpa.segment_groups.list_groups()
enabled = resp.search("list[?enabled==`true`].{name: name, id: id}")
```

Source: `segment_groups.py`.

### Console path

**Resource Management > Application Management > Segment Groups**

From the page you can view, add, filter, edit, delete, expand rows to see member App Segments, and view a configuration graph of connected objects. The "Incomplete Configuration" icon appears next to a group with missing required fields. Source: `about-segment-groups.md`.

---

## 5. Common gotchas

### 5.1 Orphaned App Segments (no Segment Group assigned)

The TF resource for `zpa_application_segment` marks `segment_group_id` as `Optional + Computed`. TF will not error if it is absent. Result: the App Segment exists, the API accepts it, but **no policy rule using `APP_GROUP` conditions can target it** — users cannot reach the application. The segment shows in the admin portal but is silently unreachable. Always verify `segment_group_id` is populated and that the group is referenced in at least one enabled access policy rule.

### 5.2 Group rename does not break policy rules (but does break data source lookups by name)

Policy rules store the Segment Group's **ID** as their `APP_GROUP` operand value, not the name. Renaming a Segment Group does not invalidate any policy rules — the ID is stable across renames.

However, Terraform data sources that look up a group by name (`data "zpa_segment_group" { name = "Old Name" }`) will fail after a rename until the TF code is updated. If group names are used as lookup keys in external tooling or scripts, renames require updating all callers.

### 5.3 Deleting a Segment Group via SDK or direct API (not TF) leaves stale policy operands

The TF provider's delete path calls `detachSegmentGroupFromAllPolicyRules` which scans all five policy types across both v1 and v2 APIs, removes every `APP_GROUP` operand referencing the deleted group's ID, and updates each affected rule. **This cleanup does not happen when you delete a group via the SDK or direct API.** Stale `APP_GROUP` operands referencing a nonexistent group ID remain in the affected rules. The behavioral impact of a stale operand is not documented (Tier D: the rule may fail to match, or the platform may silently ignore the dangling reference at eval time). When deleting Segment Groups programmatically outside of TF, manually audit and clean up policy rules first, or replicate the TF detach logic.

### 5.4 An empty Segment Group silently makes referencing rules a no-op

A rule whose only application-scope criterion is an empty Segment Group (no App Segments assigned) has no matchable applications. It will never fire. This can happen after bulk-moving App Segments between groups during a restructuring exercise. Always verify group membership after reorganizations.

### 5.5 `enabled = false` on a Segment Group — confirmed behavior is not documented

The API model carries `enabled` as a meaningful boolean. The Zscaler help docs state that a disabled Segment Group shows "Status: disabled" in the console but do not specify the policy-evaluation effect. The TF resource sets `enabled` as Optional (defaulting to `false` if unset). If `enabled = false` is the same as removing the group from all policy matching, then disabling is a quick way to take all member App Segments out of policy scope simultaneously — but this is Tier-D inference, not confirmed from API documentation or source code. Do not rely on the `enabled` toggle for access control without first validating behavior in a non-production tenant.

### 5.6 Segment Group + microtenant scoping

Segment Groups are microtenant-scoped when created with a `microtenant_id`. A group created in Microtenant A is not visible to Microtenant B's admin — and cannot be referenced in Microtenant B's policy rules. The default microtenant admin can see and manage all microtenant Segment Groups. The `about-microtenants.md` help article lists "segment groups" as one of the objects that can be independently managed per microtenant. Source: `about-microtenants.md`.

When the microtenant license is not active, `microtenant_id` on the Segment Group is ignored (TF warns if the field is set without the feature flag). Source: TF resource doc warning at the `microtenant_id` field.

### 5.7 Zscaler Deception and Segment Groups

If a Segment Group is configured in conjunction with Zscaler Deception, the ZPA console marks it as non-editable and non-deletable ("the edit and delete options are unavailable"). These groups are managed from the Deception Admin Portal. Attempting to modify them via TF or SDK will result in an API error. Source: `about-segment-groups.md`.

### 5.8 `policyMigrated` flag — meaning is opaque

The Segment Group model carries a `policyMigrated` bool (no `omitempty`, so it is always serialized). The field is present in both the Go SDK struct and the Python model. Its semantics are not documented in any captured help article; it appears to track whether legacy policy migration has been run on the group. Treat as read-only — do not set it programmatically.

---

## 6. Open questions register

| ID | Question | Status |
|---|---|---|
| sg-01 | What is the exact policy-evaluation effect when `enabled = false` on a Segment Group? Does the policy rule containing the group simply not match, or is the group's presence in the rule ignored silently? | Open — not confirmed by source or doc |
| sg-02 | What happens at the API level when a policy rule's only application-scope criterion is an `APP_GROUP` operand pointing to a nonexistent (deleted) Segment Group ID? Does the API return an error on read, does the rule evaluate as "no match always", or does the API silently drop the operand? | Open |
| sg-03 | Can the `tcpKeepAliveEnabled` field on a Segment Group override per-App-Segment TCP keepalive settings, or is it always inherited from the App Segment level? | Open |
| sg-04 | Is there any documented limit on the number of App Segments a single Segment Group can contain? | Open — not found in sources |
| sg-05 | Can a Segment Group be shared across microtenants (analogous to shared App Segments described in `about-microtenants.md`)? | Open — the microtenant doc mentions shared App Segments but does not explicitly mention shared Segment Groups |

---

## Cross-links

- Server Groups (the other ZPA "Group" — traffic delivery, not policy scoping): [`./segment-server-groups.md`](./segment-server-groups.md)
- App Segments (what goes inside a Segment Group; FQDN matching, port ranges, Multimatch): [`./app-segments.md`](./app-segments.md)
- Policy rule evaluation — AND/OR semantics, first-match-wins, rule order, Deception constraints: [`./policy-precedence.md`](./policy-precedence.md)
