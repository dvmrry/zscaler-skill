---
product: zpa
topic: machine-groups
title: "ZPA Machine Groups — enrollment-driven device grouping for Machine Tunnel policy"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-machine-groups.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule_v2.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_policy_browser_protection_rule.md"
  - "vendor/terraform-provider-zpa/examples/zpa_machine_group/README.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go"
  - "references/zpa/machine-tunnels.md"
  - "references/zpa/policy-precedence.md"
  - "references/zpa/terraform.md"
author-status: draft
---

# ZPA Machine Groups

> **Product note:** Machine Groups are a ZPA-only construct. The vendor help article lives at `help.zscaler.com/zpa/about-machine-groups`; all SDK/Terraform artifacts (`zscaler-sdk-python/zscaler/zpa/machine_groups.py`, `zscaler-sdk-go/zscaler/zpa/services/machinegroup/`, `terraform-provider-zpa`) are under the ZPA surface. There is no Machine Groups entity in ZIA. The April 2026 coverage audit (`_meta/archive/audits/2026-04-26.md` line 70) mis-classified this as a ZIA gap; this doc lives under ZPA where it belongs.

---

## What a Machine Group is

A machine group is a named collection of enrolled internal devices (Windows or macOS) that have registered with Zscaler Private Access using a machine provisioning key. The group is the unit of machine identity in ZPA policy — it allows policy rules to scope access by device set rather than (or in addition to) user identity. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)

Machine groups exist to support **Machine Tunnels**: ZPA connections established before a user logs in to Zscaler Client Connector. The tunnel runs as a machine-identity session so that domain controllers, Group Policy, and cached-credential infrastructure are reachable at the Windows or macOS pre-login stage. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)

Key facts from the vendor documentation:

- A machine group is associated with one or more **machine provisioning keys**. Zscaler recommends deploying one machine group per provisioning key. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)
- Devices in a machine group can use Machine Tunnels to access internal applications even when the device's Zscaler Client Connector is not connected to ZPA as a user-authenticated session. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)
- The machine provisioning key must be added to the Zscaler Client Connector app profile rule for Machine Tunnel enrollment to succeed. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)
- Machine groups are visible in the ZPA Admin Console at **Administration > Identity > Private Access > Machine Groups**. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)

### How membership is determined

Membership is determined by enrollment, not by hostname patterns or certificate criteria authored in the group definition itself. When ZCC enrolls a device using a provisioning key that is linked to a machine group, ZPA issues a machine-specific token and adds the device to that group. The device's identity anchor is a signing certificate (`signingCert`) plus a fingerprint (`fingerprint`) stored on the enrolled machine record. (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`; `vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md`)

The attributes visible per enrolled machine record are: `id`, `name`, `description`, `fingerprint`, `issuedCertId`, `machineGroupId`, `machineGroupName`, `machineTokenId`, `signingCert`, `creationTime`, `modifiedTime`, `modifiedBy`. (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

There is no operator-specified hostname glob or certificate subject pattern on a machine group definition itself. Matching is token/certificate enrollment-driven. (Tier C — inferred from SDK read-only model and enrollment documentation; see Deferred questions.)

---

## Where Machine Groups are used as a policy match condition

Machine Groups surface as the `MACHINE_GRP` object type in ZPA policy rule conditions. The operand shape is `lhs = "id"`, `rhs = <machine_group_id>`. (Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md`, table row for `MACHINE_GRP`)

The following ZPA policy rule types accept `MACHINE_GRP` as a condition operand:

| Policy Rule Resource | Source |
|---|---|
| `zpa_policy_access_rule` (v1) | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md` |
| `zpa_policy_access_rule_v2` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md` |
| `zpa_policy_access_rule_browser_access` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_browser_access.md` |
| `zpa_policy_access_rule_application_segment` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_application_segment.md` |
| `zpa_policy_access_rule_posture_profile` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_posture_profile.md` |
| `zpa_policy_access_rule_risk_factor` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_risk_factor.md` |
| `zpa_policy_access_rule_saml` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_saml.md` |
| `zpa_policy_access_rule_scim_attribute` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_attribute.md` |
| `zpa_policy_access_rule_scim_group` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_scim_group.md` |
| `zpa_policy_access_rule_trusted_networks` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_trusted_networks.md` |
| `zpa_policy_forwarding_rule` (v1) | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule.md` |
| `zpa_policy_forwarding_rule_v2` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_forwarding_rule_v2.md` |
| `zpa_policy_inspection_rule` (v1) | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule.md` |
| `zpa_policy_inspection_rule_v2` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md` |
| `zpa_policy_isolation_rule` (v1) | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule.md` |
| `zpa_policy_isolation_rule_v2` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_isolation_rule_v2.md` |
| `zpa_policy_browser_protection_rule` | Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_browser_protection_rule.md` |

`MACHINE_GRP` is also listed in the `policy-precedence.md` reference as a first-class criterion type on ZPA access policy rules, under the same AND/OR operator model as other criterion types. (Tier A — `references/zpa/policy-precedence.md`)

**Policy rule v1 operand shape:**

```terraform
conditions {
  operator = "OR"
  operands {
    object_type = "MACHINE_GRP"
    lhs         = "id"
    rhs         = data.zpa_machine_group.example.id
  }
}
```

**Policy rule v2 operand shape** (the v2 resource uses a different schema; `lhs`/`rhs` are replaced by inline `values`):

```terraform
conditions {
  operands {
    object_type = "MACHINE_GRP"
    values      = [data.zpa_machine_group.example.id]
  }
}
```

(Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule_v2.md`; `vendor/terraform-provider-zpa/docs/resources/zpa_policy_inspection_rule_v2.md`)

### Machine Tunnel client type interaction

Machine Groups as a criterion scope which device groups a rule applies to. The `CLIENT_TYPE` criterion, specifically `zpn_client_type_machine_tunnel`, scopes a rule to pre-login machine sessions versus post-login user sessions. These two criteria are typically combined on the same rule: `MACHINE_GRP` narrows to a specific device set, and `CLIENT_TYPE = zpn_client_type_machine_tunnel` narrows to only the pre-login phase of those devices. (Tier A — `references/zpa/machine-tunnels.md`)

A policy rule that includes `MACHINE_GRP` but does not include `CLIENT_TYPE` applies to both machine tunnel sessions and user sessions on matching devices. A rule that includes only `CLIENT_TYPE = zpn_client_type_machine_tunnel` applies to all machine tunnel sessions regardless of which machine group the device belongs to.

---

## Lifecycle: creation, update, deletion

### Admin Console

Machine Groups are created in the ZPA Admin Console at **Administration > Identity > Private Access > Machine Groups**. The console supports:

- Viewing, filtering, and expanding the list of configured machine groups
- Creating a new machine group (typically one per provisioning key)
- Editing a configured machine group (name, description)
- Deleting a machine group

(Tier A — `vendor/zscaler-help/about-machine-groups.md`)

### API / SDK: read-only

Machine Groups are **read-only** through the ZPA management API and both SDKs. Neither the Python SDK nor the Go SDK exposes Create, Update, or Delete operations for machine groups. Group membership is driven by ZCC enrollment, not direct API writes.

**API endpoints:**

```
GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup
GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup/{id}
GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup/summary
```

(Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

**Python SDK** (`zscaler.zpa.machine_groups`, accessed via `client.zpa.machine_groups`):

```python
# List all machine groups (paginated)
groups, _, err = client.zpa.machine_groups.list_machine_groups(
    query_params={'search': 'MGRP01', 'page': '1', 'page_size': '100'}
)

# Get name+ID summary only
summary, _, err = client.zpa.machine_groups.list_machine_group_summary()

# Get a specific group by ID
group, _, err = client.zpa.machine_groups.get_group('999999')
```

Available methods: `list_machine_groups`, `list_machine_group_summary`, `get_group`. No write operations. (Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py`)

The `MachineGroup` Python model fields: `id` (str), `name` (str), `enabled` (bool, default True), `description` (str), `creation_time`, `modified_time`, `modified_by`. The `machines` sub-list is exposed in the Go SDK's `MachineGroup.Machines` slice but is not present in the Python model's `__init__`; it may appear in raw API responses. (Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

**Go SDK** (`machinegroup` package):

```go
group, _, err := machinegroup.Get(ctx, service, machineGroupID)
group, _, err := machinegroup.GetByName(ctx, service, "MGRP01")
groups, _, err := machinegroup.GetAll(ctx, service)
summary, _, err := machinegroup.GetMachineGroupSummary(ctx, service)
```

All calls pass `common.Filter{MicroTenantID: service.MicroTenantID()}` per ZPA SDK convention. (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

The Go SDK's `MachineGroup` struct carries a `Machines []Machines` field. Each `Machines` entry includes `ID`, `Name`, `Description`, `Fingerprint`, `IssuedCertID`, `MachineGroupID`, `MachineGroupName`, `MachineTokenID`, `ModifiedBy`, `ModifiedTime`, `MicroTenantID`, `MicroTenantName`, and `SigningCert` (map). (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

**ZCC device removal:**

The only write path for machine-tunnel-enrolled devices is a delete via the ZCC portal API:

```
DELETE /zcc/papi/public/v1/devices/machineTunnel
```

This removes an enrolled device from ZCC tracking. It does not mutate the machine group definition itself. (Tier A — `references/zpa/machine-tunnels.md`)

### Terraform: data source only

There is no `zpa_machine_group` **resource** in the Terraform provider. Machine groups are enrollment-driven and cannot be created or managed via Terraform. The provider exposes only a **data source** for lookups:

```terraform
# Look up by name
data "zpa_machine_group" "example" {
  name = "MGRP01"
}

# Look up by ID
data "zpa_machine_group" "example" {
  id = "1234567890"
}
```

Exported read-only attributes from the data source: `id`, `creation_time`, `description`, `enabled`, `modified_by`, `modified_name`, `microtenant_id`, `microtenant_name`, and the nested `machines` list (each entry exposes `fingerprint`, `issued_cert_id`, `machine_group_id`, `machine_group_name`, `machine_token_id`, `signing_cert`). (Tier A — `vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md`)

The data source is used to resolve machine group IDs for referencing in policy rule `operands`:

```terraform
resource "zpa_policy_access_rule" "machine_rule" {
  name     = "Pre-login DC access"
  action   = "ALLOW"
  operator = "AND"

  conditions {
    operator = "OR"
    operands {
      object_type = "CLIENT_TYPE"
      lhs         = "id"
      rhs         = "zpn_client_type_machine_tunnel"
    }
  }
  conditions {
    operator = "OR"
    operands {
      object_type = "MACHINE_GRP"
      lhs         = "id"
      rhs         = data.zpa_machine_group.example.id
    }
  }
}
```

(Tier A — `vendor/terraform-provider-zpa/docs/resources/zpa_policy_access_rule.md`; `vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md`)

---

## Constraints and gotchas

### No write operations via API or SDK

Neither the Python SDK nor the Go SDK provides Create, Update, or Delete for machine groups. Group membership is a by-product of ZCC enrollment. Attempts to manage group contents via the management API are not supported through the available SDK surfaces reviewed. (Tier A — confirmed by absence of write methods in both SDKs)

### Machine provisioning key linkage is required

A machine group is inert until a provisioning key is associated with it and embedded in a ZCC app profile rule. Without the provisioning key, no device can enroll into the group, and the group will have zero member machines. Zscaler recommends one provisioning key per machine group. (Tier A — `vendor/zscaler-help/about-machine-groups.md`)

### Platform restriction: Windows and macOS only

Machine Tunnels — the primary use case for machine groups in ZPA policy — are supported only on Windows and macOS. A `MACHINE_GRP` criterion on a policy rule has no effect for Linux, iOS, or Android device sessions. Policy rules combining `MACHINE_GRP` with `CLIENT_TYPE = zpn_client_type_machine_tunnel` will never match on unsupported platforms. (Tier A — `references/zpa/machine-tunnels.md`)

### Machine tunnel vs user session policy applies independently

After a user logs in to ZCC, both the machine tunnel session and the user session can be active simultaneously. ZPA evaluates policy for each session independently. A policy rule scoped to `MACHINE_GRP` without `CLIENT_TYPE = zpn_client_type_machine_tunnel` will match during both the pre-login machine tunnel phase and the post-login user session if the device is in the referenced group. An operator intending to restrict a rule to only the pre-login phase must include the `CLIENT_TYPE = zpn_client_type_machine_tunnel` condition. (Tier A — `references/zpa/machine-tunnels.md`)

### Python model does not expose the `machines` sub-list

The Python `MachineGroup` model class maps only top-level fields (`id`, `name`, `enabled`, `description`, timestamps). The nested `machines` list (which contains per-device fingerprints and certificates) is present in the Go SDK struct and in the Terraform data source schema, but is not mapped in the Python model's `__init__`. It may be accessible via raw API response bodies but is not surfaced through the Python model object. (Tier A — `vendor/zscaler-sdk-python/zscaler/zpa/models/machine_groups.py`; `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

### GetByName uses case-insensitive string comparison

The Go SDK's `GetByName` function uses `strings.EqualFold` for name matching. Name lookup is case-insensitive. (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`)

### Terraform data source search note

The Terraform provider documentation states: "To ensure consistent search results across data sources, please avoid using multiple spaces or special characters in your search queries." (Tier A — `vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md`)

### No `MACHINE_GRP` operand in ZIA policy

ZIA Forwarding Control rules and ZIA Firewall rules do not accept machine groups as a criterion operand. The ZIA Terraform provider and ZIA SDKs contain no machine group type. Any reference to "ZIA machine groups" in coverage audit notes reflects a misclassification of the vendor source URL (`/zpa/about-machine-groups`). Machine Groups are exclusively a ZPA construct.

### Microtenant scoping

Machine group API calls require the standard ZPA microtenant filter parameter. In the Go SDK this is `common.Filter{MicroTenantID: service.MicroTenantID()}`. In the Python SDK the `microtenant_id` query parameter maps to the `microtenantId` API parameter. The data source also exposes `microtenant_id` and `microtenant_name` on the group object. (Tier A — `vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go`; `vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py`; `vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md`)

---

## Deferred open questions

Open questions registered in [`_meta/clarifications.md`](../_meta/clarifications.md):

1. [`zpa-11`](../_meta/clarifications.md#zpa-11-machine-group-creation-endpoint) — **Whether a direct POST `/machineGroup` endpoint exists** — both SDKs expose only read operations. The documentation implies groups are created in the Admin Console and populated via provisioning enrollment.

2. [`zpa-12`](../_meta/clarifications.md#zpa-12-machine-group-matching-criteria) — **What the machine group's matching criteria are, beyond provisioning key enrollment** — the vendor doc describes groups as provisioning-key-linked. Whether the API returns additional matching criteria (hostname pattern, OS type, certificate subject) is not confirmed.

3. [`zpa-13`](../_meta/clarifications.md#zpa-13-machine_grp-in-user-session-access-rules) — **Machine group capability in non-machine-tunnel contexts** — whether machine groups can also scope user-session ZPA policy is not explicitly confirmed or denied in the reviewed sources.

4. [`zpa-14`](../_meta/clarifications.md#zpa-14-machine-group-capacity-limits) — **Limits on machine groups per tenant, provisioning keys per group, or enrolled machines per group** — no capacity/limit figures found in reviewed sources.

5. [`zpa-15`](../_meta/clarifications.md#zpa-15-machine-groups-file-path-correction) — **Product path mis-classification** — *resolved 2026-04-27.* The file was moved from `references/zia/machine-groups.md` to `references/zpa/machine-groups.md`; the coverage audit entry was corrected.

---

## Cross-links

- Machine Tunnel transport and policy detail (pre-login ZPA tunnel mechanics, enrollment, posture checks): [`../zpa/machine-tunnels.md`](../zpa/machine-tunnels.md)
- ZPA policy precedence, AND/OR criterion model, and full object-type enum: [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZPA Terraform resources for access, forwarding, inspection, and isolation rules that accept `MACHINE_GRP`: [`../zpa/terraform.md`](../zpa/terraform.md)
- ZPA Python and Go SDK reference including `MachineGroupsAPI` surface: [`../zpa/sdk.md`](../zpa/sdk.md)
- Device Posture Profiles (the "Apply to Machine Tunnel" toggle that applies posture checks to machine sessions): [`../zpa/posture-profiles.md`](../zpa/posture-profiles.md)
- Z-Tunnel transport layer (how the pre-login tunnel connection is physically established at the ZCC level): [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
