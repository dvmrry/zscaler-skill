---
product: zpa
topic: "zpa-scim-policy-mapping"
title: "ZPA SCIM groups in policy — IDP attribute to access decision"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-scim-zpa.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_attribute.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_saml.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_timeout_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_scim_groups.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_scim_attribute_header.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_idp_controller.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_saml_attribute.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/scim_groups.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/scimattributeheader/zpa_scim_attribute_header.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/idpcontroller/zpa_idp_controller.go"
  - "references/shared/scim-provisioning.md"
  - "references/zpa/policy-precedence.md"
author-status: draft
---

# ZPA SCIM groups in policy — IDP attribute to access decision

This document covers how groups synchronized from an identity provider (IdP) via SCIM become criteria in ZPA policy rules, the full chain from the IdP through to an allow-or-deny decision, and the operational and programmatic surface for managing that chain.

For the general SCIM provisioning lifecycle (user/group create, update, delete, cross-product comparison with ZIA), see [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md). For policy evaluation order, first-match semantics, and how SCIM-based rules interact with other rule types, see [`./policy-precedence.md`](./policy-precedence.md).

---

## Overview

SCIM groups in ZPA serve a different function than in most identity systems. In ZPA, a SCIM group is not a container that grants entitlements directly — it is a **read-only label** that ZPA mirrors from an IdP and makes available as a matching criterion in policy rules. The ZPA policy engine compares a user's current group memberships (as known to ZPA from SCIM sync) against the groups referenced in a rule's conditions, then allows or denies access accordingly.

### How SCIM groups arrive in ZPA

Two distinct processes must both be active for SCIM group membership to influence policy:

1. **The IdP pushes SCIM data to ZPA.** When SCIM is enabled on an IdP controller (`scimEnabled: true`), the IdP authenticates to ZPA's SCIM endpoint (`scimServiceProviderEndpoint` on the IdP controller object) and pushes user and group records. ZPA does not poll the IdP; the IdP initiates every sync. This is sometimes called "IDP push" — the IdP is the provisioning source of truth.

2. **ZPA stores group membership on the user record.** As the IdP syncs group changes (members added or removed, group renamed, group deleted), ZPA updates its internal representation. These group objects are exposed at the `userconfig` API endpoint, not the `mgmtconfig` endpoint used for policy resources.

The SCIM groups visible in the ZPA admin console and API are **mirrors only** — they cannot be created, renamed, or deleted from the ZPA side. Only the IdP controls the authoritative group definition.

### Group vs. attribute distinction

ZPA exposes two distinct SCIM-based policy operand types:

- **`SCIM_GROUP`** — matches a user's group memberships. The unit of match is a group object identified by its ZPA-assigned numeric ID and an IdP reference. The match is a membership check: "is this user currently a member of this group according to ZPA's SCIM database?"

- **`SCIM`** (SCIM attribute) — matches a flat string value on the user's SCIM record. The unit of match is an attribute header (a field name, such as `department` or `division`) paired with an expected string value. The match is a string equality check: "does this user's SCIM `department` field equal `Engineering`?"

SAML attributes (`SAML` operand type) are a third related concept. They are populated at login time from the SAML assertion, not from SCIM sync, and are therefore always current at session start. SCIM data, in contrast, reflects the last sync cycle and may lag behind IdP state by minutes to hours.

### Refresh cadence

SCIM sync cadence is controlled by the IdP, not by ZPA. The ZPA API exposes `creation_time` and `modified_time` on SCIM group objects, which reflect when the group was last written to ZPA — useful for diagnosing staleness. There is no ZPA-side mechanism to force an immediate re-sync; the operator must trigger a resync from the IdP side. Per [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md), Zscaler recommends waiting at minimum 48 hours after enabling SCIM before activating SCIM-based policy criteria, to ensure sync is complete.

---

## The chain: IDP to policy decision

### Step 1 — IdP SCIM push to ZPA SCIM endpoint

The IdP (Okta, Entra ID, PingFederate, SailPoint, or any SCIM-2.0-compliant provider) authenticates to the per-IdP SCIM service-provider endpoint. The endpoint URL and shared-secret credentials are configured in the ZPA IdP controller record (`scimServiceProviderEndpoint`, `scimSharedSecretExists`). The IdP sends SCIM `/Groups` and `/Users` operations to create, update, or delete records in ZPA.

**What can break here:**
- The shared secret is rotated in ZPA but not updated in the IdP, causing 401s on every push attempt.
- The IdP does not enumerate all groups before users; if a user record references a group that ZPA has not yet received, ZPA stores the user without that group membership. The membership is backfilled on the next sync cycle.
- The IdP's SCIM provisioning app is scoped to a subset of groups or users; groups outside the scope are never sent to ZPA.

### Step 2 — ZPA stores group objects in userconfig

ZPA stores received SCIM groups under the `userconfig` API (`/zpa/userconfig/v1/customers/{customerId}/scimgroup/`), separate from management-config resources. Each group gets a Zscaler-generated numeric `id`, an `idpGroupId` (the IdP's own identifier for the group), the parent `idpId`, `idpName`, and the group's display name.

The group `name` is a display-only label for admin convenience. The `id` (Zscaler numeric ID) is the stable, policy-relevant identifier. If the IdP renames a group, the display name in ZPA updates on the next sync, but the Zscaler `id` is unchanged — policy rules referencing the old name in TF data-source lookups will silently resolve to the same group as before, which is correct behavior. The risk is the reverse: human-readable policy descriptions that reference the old name become misleading.

**What can break here:**
- The Zscaler `id` (numeric, `int64`) differs from the `idp_group_id` (string, the IdP's own ID). Code that conflates these two identifiers will produce errors that are hard to diagnose because both look like plausible identifiers.
- `internal_id` is a separate field on the group object (present in both Go SDK `ScimGroup` struct and Python SDK `SCIMGroup` model) whose semantics are not documented in available source material.

### Step 3 — policy rule references the group as an operand

Access policy rules (and other rule families — see the next section) reference SCIM groups through an operand with:
- `object_type = "SCIM_GROUP"`
- `lhs` = the IdP's ZPA ID (the `id` field of the IdP controller record)
- `rhs` = the SCIM group's ZPA ID (the `id` field of the SCIM group record)

This `lhs`/`rhs` encoding is the v1 API form. The v2 API uses `entry_values` blocks with the same `lhs`/`rhs` semantics but a different wrapper structure. See the API/SDK section below.

When a user authenticates, ZPA resolves their current SCIM group memberships from the `userconfig` store and evaluates each `SCIM_GROUP` operand as a membership check against that snapshot.

**What can break here:**
- The policy rule stores the Zscaler group `id`, not the group name. If an admin looks at the rule in a UI or API snapshot, they see a numeric ID that requires a separate lookup to resolve to a human-readable group name.
- The group `id` in the rule is a reference to a snapshot-in-time object. If the group is deleted in the IdP and the IdP sends a `DELETE /Groups/{id}` to ZPA, the group object is removed from `userconfig`. The policy rule still contains the now-dangling reference; ZPA evaluates `SCIM_GROUP` membership against a group that no longer exists, which means no user will ever match that operand. The rule does not error — it silently never matches.
- `enable_scim_based_policy` must be `true` on the IdP controller for ZPA to evaluate SCIM-based conditions for users from that IdP. If it is `false`, SCIM group criteria are ignored for those users even if SCIM sync is active.

### Step 4 — policy decision

The evaluated operand contributes `true` or `false` to the rule's condition tree. The tree is evaluated with AND/OR semantics (described in the next section). The first matching rule in evaluation order fires its action (ALLOW, DENY, BYPASS, RE_AUTH, INSPECT, etc.). Default when no rule matches is deny. See [`./policy-precedence.md`](./policy-precedence.md) for the full evaluation model.

---

## Policy criteria: which rule families accept SCIM_GROUP and SCIM operands

The following policy families accept both `SCIM_GROUP` and `SCIM` operand types. This is confirmed from TF provider v2 resource documentation.

| Policy family | TF resource (v2) | Action values | SCIM_GROUP | SCIM | SAML |
|---|---|---|---|---|---|
| Access Policy | `zpa_policy_access_rule` | `ALLOW`, `DENY` | Yes | Yes | Yes |
| Forwarding Policy | `zpa_policy_forwarding_rule_v2` | `BYPASS`, `INTERCEPT`, `INTERCEPT_ACCESSIBLE` | Yes | Yes | Yes |
| Timeout Policy | `zpa_policy_timeout_rule_v2` | `RE_AUTH` | Yes | Yes | Yes |
| Inspection Policy | `zpa_policy_inspection_rule_v2` | `INSPECT`, `BYPASS_INSPECT` | Yes | Yes | Yes |
| Isolation Policy | `zpa_policy_isolation_rule_v2` | `ISOLATE`, `BYPASS_ISOLATE` | Yes (inferred from same pattern) | Yes (inferred) | Yes |

Source: the Forwarding, Timeout, and Inspection v2 TF resource docs all show identical `SCIM_GROUP` and `SCIM` schema blocks with the same `lhs`/`rhs` entry-values semantics. The Isolation policy resource follows the same pattern in the codebase.

### Operator semantics

The condition structure is shared across all policy families:

- **Between condition blocks** (separate `conditions` blocks in TF, separate operand entries in the API): **AND**. A user must satisfy every condition block.
- **Between operands within a single condition block**: **OR**. A user satisfying any operand in the block satisfies that block.
- **Mixed object types within a block**: supported. A single block can contain both `SAML` and `SCIM_GROUP` operands, making the block satisfied if the user matches the SAML attribute value OR is a member of the SCIM group.

Example: allow Engineering SCIM group OR employees with SAML `department=Engineering` (belt-and-suspenders for tenants that have partial SCIM adoption):

```terraform
conditions {
  operator = "OR"
  operands {
    object_type = "SCIM_GROUP"
    lhs         = data.zpa_idp_controller.corp.id
    rhs         = data.zpa_scim_groups.engineering.id
  }
  operands {
    object_type = "SAML"
    lhs         = data.zpa_saml_attribute.department.id
    rhs         = "Engineering"
    idp_id      = data.zpa_idp_controller.corp.id
  }
}
```

For `SCIM` (flat attribute) operands, the `rhs` value must exactly match one of the string values that ZPA has observed for that attribute across all synced users. The TF `zpa_scim_attribute_header` data source exposes a `values` set containing all observed values — use this to validate that the string used in a policy rule is a known value.

---

## Multiple-IDP scenarios

### Per-IDP SCIM endpoints and group namespaces

Each IdP controller in ZPA has its own SCIM endpoint, its own `idpId`, and its own group namespace. SCIM groups from IdP A and SCIM groups from IdP B are stored separately, even if they have the same display name. In policy rules, the `lhs` field (the IdP ID) is what disambiguates which IdP's group namespace is being referenced.

A tenant with two IdPs — one for corporate employees and one for contractors — can write policies that reference each IdP's groups independently without collision:

```terraform
# Corporate Engineering group from IdP A
operands {
  object_type = "SCIM_GROUP"
  lhs         = data.zpa_idp_controller.corporate.id
  rhs         = data.zpa_scim_groups.eng_corporate.id
}

# Contractor Engineering group from IdP B
operands {
  object_type = "SCIM_GROUP"
  lhs         = data.zpa_idp_controller.contractor.id
  rhs         = data.zpa_scim_groups.eng_contractor.id
}
```

### Group namespace collisions

If two IdPs both provision a group named `Engineering`, ZPA stores two separate group objects with different `id` values and different `idpId` values. The display name collision is harmless at the API level but creates confusion when human-readable policy descriptions or TF resource names use the group display name as the disambiguator. Use the IdP name as part of the TF resource identifier: `data.zpa_scim_groups.engineering_corporate` vs `data.zpa_scim_groups.engineering_contractor`.

### Attribute precedence with multiple IDPs

When a user's session arrives and SCIM-based policy conditions are evaluated, ZPA evaluates the conditions against the user's SCIM data from the specific IdP that authenticated them. A user who authenticates via IdP A will not match a `SCIM_GROUP` operand that references an IdP B group, even if both groups have the same display name and contain the same users. The `lhs` (IdP ID) is part of the operand tuple and must match.

This also applies to `SCIM` flat attribute operands: the attribute header is scoped to an `idpId`, and the match only fires if the authenticating user's IdP matches.

---

## Common gotchas

### Stale groups after IdP rename

If an IdP admin renames a group (e.g., `Engineering` becomes `Platform Engineering`), the IdP sends an update to ZPA that changes the `name` field on the group object. ZPA's stored Zscaler `id` for the group does not change. Policy rules that reference the group by its Zscaler `id` continue to work correctly.

The gotcha is in TF data-source lookups: `data.zpa_scim_groups` resolves by display `name` at plan/apply time. If a TF configuration references the old display name (`name = "Engineering"`), the lookup will fail with "not found" after the rename, breaking applies. TF configurations that use the group name as the lookup key need to be updated to reflect the new display name.

### Soft-delete behavior and dangling references

SCIM does not have a native concept of "archive." When an IdP deletes a group, it sends a `DELETE /Groups/{id}` to ZPA. ZPA removes the group from its `userconfig` store. Any policy rules that reference the deleted group's Zscaler `id` now hold a dangling reference. ZPA does not surface an error — the operand simply never evaluates true for any user, which silently restricts or opens access depending on the rule structure.

The Go SDK's `list_scim_groups` / `GetAllByIdpId` supports an `all_entries` parameter that, when true, includes deleted groups in the result. This allows auditing for dangling references before they cause access issues.

### Group ID vs. group name in policy

Policy rules store the Zscaler numeric `id` of the SCIM group, not the display name. The API and policy snapshots show the numeric ID. When reading a policy snapshot (e.g., `snapshot/zpa/access-policy-rules.json`), resolving group IDs to display names requires a separate call to the SCIM group API. Automation that reads policy rules and reports on them in human-readable form must implement this join.

### SCIM policy requires `enable_scim_based_policy`

The IdP controller has two distinct SCIM-related booleans:
- `scim_enabled` — whether SCIM provisioning is active for this IdP (controls whether user/group data is synced from the IdP).
- `enable_scim_based_policy` — whether ZPA evaluates SCIM-based policy conditions for users from this IdP.

Both must be true for SCIM group criteria to influence access decisions. An admin who enables SCIM sync but leaves `enable_scim_based_policy` false will see groups appearing in the admin console but no effect on policy.

### Microtenant SCIM scoping

SCIM group and SCIM attribute operands within `conditions` blocks do **not** support `microtenant_id` on the operand itself. Per the TF provider documentation: "The attribute `microtenant_id` is NOT supported within the `operands` block when the `object_type` is set to `SCIM_GROUP`. IDP Information is controlled at the parent tenant level."

This means SCIM groups are resolved at the parent-tenant level regardless of which microtenant the policy rule lives in. A microtenant policy rule can reference a SCIM group, but the group itself is a parent-tenant resource. Operationally: SCIM group memberships are visible globally across all microtenants. There is no mechanism to restrict a SCIM group to a specific microtenant's scope.

### SCIM sync timing and policy activation

From the Access Policy Deployment and Operations Guide (cited in `policy-precedence.md`): "Ensure the SCIM user sync is complete before enabling SCIM policies for these users. If not, the ZPA service evaluates policies on the users it does not recognize. After SCIM sync is enabled, Zscaler recommends waiting for a minimum of 48 hours (sometimes up to a week) before enabling SCIM policies."

A user who authenticates before their SCIM record has arrived in ZPA will not match any SCIM-based criteria. Depending on rule structure (ALLOW or DENY action, default-deny behavior), this can manifest as unexpected access denial during a SCIM-rollout window.

### Source IP Anchoring interaction

From `vendor/zscaler-help/configuring-source-ip-anchoring.md`: "If Source IP Anchoring traffic is restricted to certain users in the ZIA Admin Portal, do not add user-based SAML/SCIM criteria when configuring the access policy in the ZPA Admin Portal." For SIPA traffic, ZPA's country-based criteria use the ZIA PSE's IP rather than the user's IP; SCIM/SAML criteria remain user-bound, but the combination can produce unexpected results when SIPA restricts access at the ZIA layer.

---

## API / SDK / Terraform surface

### API endpoints

All SCIM group and attribute operations use two distinct base paths:

| Resource | Base path | Notes |
|---|---|---|
| SCIM groups list by IdP | `GET /zpa/userconfig/v1/customers/{customerId}/scimgroup/idpId/{idpId}` | Paginated; default page size 20, max 500 |
| SCIM group by ID | `GET /zpa/userconfig/v1/customers/{customerId}/scimgroup/{scimGroupId}` | |
| SCIM attribute headers by IdP | `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/idp/{idpId}/scimattribute` | |
| SCIM attribute header by ID | `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/idp/{idpId}/scimattribute/{id}` | |
| SCIM attribute values | `GET /zpa/userconfig/v1/customers/{customerId}/scimattribute/idpId/{idpId}/attributeId/{id}` | Returns observed string values for that attribute across all synced users |
| IdP controller | `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/idp/{idpId}` | Contains `scimEnabled`, `enableScimBasedPolicy`, `scimServiceProviderEndpoint` |

All are read-only from the ZPA API side — SCIM group objects cannot be created, updated, or deleted via ZPA's own management API.

### Go SDK

Package `scimgroup` (`vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/`):
- `Get(ctx, service, scimGroupID)` — single group by Zscaler numeric ID
- `GetByName(ctx, service, scimName, idpId)` — name lookup within an IdP's namespace
- `GetAllByIdpId(ctx, service, idpId)` — full list for one IdP

Package `scimattributeheader`:
- `Get(ctx, service, idpId, scimAttrHeaderID)` — single attribute header
- `GetByName(ctx, service, scimAttributeName, idpId)` — name lookup
- `GetAllByIdpId(ctx, service, idpId)` — full list for one IdP
- `GetValues(ctx, service, idpId, scimAttrHeaderID)` — observed string values for one attribute
- `SearchValues(ctx, service, idpId, scimAttrHeaderID, searchQuery)` — filtered values; strips `@domain` suffix from email-shaped queries before searching

Package `idpcontroller`:
- `Get`, `GetByName`, `GetAll` — returns `IdpController` with `ScimEnabled bool`, `EnableScimBasedPolicy bool`, `ScimServiceProviderEndpoint string`, `ScimSharedSecretExists bool`

### Python SDK

Package `zscaler.zpa.scim_groups` (`SCIMGroupsAPI`):
- `list_scim_groups(idp_id, query_params)` — paginated list; supports `start_time`/`end_time` for filtering by `modified_time`, `all_entries` bool to include deleted groups
- `get_scim_group(group_id, query_params)` — single group by Zscaler ID

Package `zscaler.zpa.scim_attributes`: provides read access to SCIM attribute headers per IdP. (Database locked on this read during research — exact method signature sourced from the Go SDK parity table in `scim-provisioning.md`.)

No write operations are exposed in either SDK — consistent with SCIM groups being IdP-provisioned objects.

### Terraform Provider

**Data sources** (read — required as inputs to policy rules):
- `zpa_scim_groups` — requires `name` and `idp_name`; returns `id`, `idp_id`, `idp_group_id`, timestamps
- `zpa_scim_attribute_header` — requires `name` and `idp_name`; returns `id`, `idp_id`, `values` (observed string values), and full attribute metadata
- `zpa_idp_controller` — requires `name`; returns full controller record including SCIM flags
- `zpa_saml_attribute` — requires `name`; optionally `idp_name` (required when multiple IdPs exist)

**Resources** (write — construct rules that include SCIM criteria):
- `zpa_policy_access_rule` — v1 API; operands use top-level `lhs`/`rhs` fields
- `zpa_policy_forwarding_rule_v2` — v2 API; operands use `entry_values` blocks
- `zpa_policy_timeout_rule_v2` — same v2 pattern
- `zpa_policy_inspection_rule_v2` — same v2 pattern

The v1 and v2 resources use different wire formats for the same semantic content. The v2 resources are recommended when a rule needs more than 1,000 resource criteria.

**Minimal Terraform pattern for an SCIM_GROUP-scoped access rule:**

```terraform
data "zpa_idp_controller" "corp" {
  name = "CorporateIdP"
}

data "zpa_scim_groups" "engineering" {
  name     = "Engineering"
  idp_name = "CorporateIdP"
}

resource "zpa_policy_access_rule" "eng_access" {
  name     = "Allow Engineering SCIM group"
  action   = "ALLOW"
  operator = "AND"

  conditions {
    operator = "OR"
    operands {
      object_type = "SCIM_GROUP"
      lhs         = data.zpa_idp_controller.corp.id
      rhs         = data.zpa_scim_groups.engineering.id
    }
  }
}
```

**Minimal pattern for a flat SCIM attribute condition:**

```terraform
data "zpa_scim_attribute_header" "dept" {
  name     = "department"
  idp_name = "CorporateIdP"
}

resource "zpa_policy_access_rule" "eng_dept_access" {
  name     = "Allow Engineering department attribute"
  action   = "ALLOW"
  operator = "AND"

  conditions {
    operator = "OR"
    operands {
      object_type = "SCIM"
      idp_id      = data.zpa_scim_attribute_header.dept.idp_id
      lhs         = data.zpa_scim_attribute_header.dept.id
      rhs         = "Engineering"
    }
  }
}
```

Note: `rhs` must exactly match a value present in `data.zpa_scim_attribute_header.dept.values`. If it does not match any observed value, the operand will never evaluate true.

---

## Open questions register

- **Exact behavior when `SCIM_GROUP` operand references a deleted group.** The operand is expected to never match, but the API/docs do not confirm whether ZPA surfaces an error at policy evaluation time, at rule read time, or silently passes. The `all_entries` query parameter on the SCIM group API suggests deleted groups can be retrieved — whether ZPA's policy engine uses this same store is not documented.

- **`internal_id` field semantics.** Present on both Go (`ScimGroup.InternalID`) and Python (`SCIMGroup`) models; not documented in available source material. Relationship to `id` and `idp_group_id` is unclear.

- **`enable_scim_based_policy` fallback behavior.** When this flag is false on an IdP controller, SCIM criteria are not evaluated for users from that IdP. What the policy engine does with those conditions — skip them (treat as not-present, potentially opening access) vs. evaluate them as false (potentially denying access) — is not stated in available documentation.

- **SCIM attribute value matching case sensitivity.** The `ScimAttributeHeader` struct exposes a `case_sensitive` bool. The TF docs note that `rhs` must exactly match an observed value. Whether "exactly" means case-insensitive when `case_sensitive = false`, or whether the policy engine applies a different matching rule than the SCIM-attribute-values API, is not documented.

- **SCIM group membership resolution at session time vs. policy evaluation time.** It is not confirmed whether ZPA re-queries the `userconfig` SCIM store on every policy evaluation within a session, or whether group membership is resolved once at session start and cached for the session duration. This matters for users who are added to or removed from a SCIM group mid-session.

- **Isolation policy v2 SCIM support.** The Isolation rule v2 resource follows the same TF pattern as the other v2 rule families; SCIM_GROUP and SCIM support is inferred but not directly confirmed from the isolation-rule v2 TF source read in this research pass.

---

## Cross-links

- SCIM provisioning lifecycle (user/group sync, ZIA/ZPA differences, Okta gotchas) — [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md)
- Policy evaluation order, first-match semantics, AND/OR condition model — [`./policy-precedence.md`](./policy-precedence.md)
- Microtenant resource scoping — [`./microtenants.md`](./microtenants.md)
- Snapshot schema (how policy operands appear in JSON snapshots) — [`./snapshot-schema.md`](./snapshot-schema.md)
- Source IP Anchoring cross-product interaction — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
