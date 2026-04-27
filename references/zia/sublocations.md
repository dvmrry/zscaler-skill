---
product: zia
topic: sublocations
title: "ZIA Sublocations — nested location hierarchy, IP scoping, shared bandwidth"
content-type: reasoning
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-sublocations.md"
  - "vendor/zscaler-help/about-location-groups.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/locations.py"
  - "vendor/terraform-provider-zia/docs/resources/zia_location_management.md"
  - "references/zia/locations.md"
  - "references/zia/bandwidth-control.md"
  - "references/zia/sdk.md"
  - "references/zia/terraform.md"
author-status: draft
---

# ZIA Sublocations

A focused reference for the sublocation construct in ZIA. For the broader three-tier model (Location / Sublocation / Location Group), see [`./locations.md`](./locations.md). This document provides the sublocation-specific depth that `locations.md` deliberately omits.

---

## 1. What a sublocation is

A sublocation is a child location nested under a parent location. It scopes a subset of the parent location's traffic by IP range — specifically the inner (private) IP addresses that arrive at the Zscaler service inside a GRE or IPSec tunnel or via X-Forwarded-For (XFF) headers. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)

The parent location represents the forwarding endpoint (egress IP, GRE tunnel source, or IPSec SA). Sublocations do not define a new forwarding path; they subdivide traffic already arriving via the parent's forwarding method and apply differentiated policy to it.

### Parent-child relationship semantics

- **Cardinality:** one parent location can have multiple sublocations (1:N). The vendor source does not document a hard limit on the count of sublocations per parent (see [Constraints](#9-constraints)).
- **Depth limit:** sublocations are a single level deep. A sublocation cannot itself have sublocations — the hierarchy is parent location → sublocation only. (Tier C — inferred from the flat structure of the API and SDK; the vendor help doc does not explicitly enumerate depth, but all examples and the API shape show a two-level hierarchy with no nesting beyond that.)
- **Auto-created catch-all sublocations:** when any user-defined sublocation is created under a parent, the Zscaler service automatically creates a sublocation named `other`. When IPv6 is enabled on the parent location, it also creates `other6`. Both catch traffic from IPs that do not match any explicit sublocation range. Both can be renamed. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)

### Use cases

Sublocations exist to address three distinct problems that share the same egress point:

1. **Policy differentiation within a shared tunnel.** Corporate-network traffic and guest-WiFi traffic arrive via the same GRE tunnel but must receive different URL Filtering, authentication, and firewall policy. Sublocations let each get a separate policy scope. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)
2. **Bandwidth partitioning.** Per-sublocation upload/download bandwidth limits allow contention management within the parent's pipe. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)
3. **Reporting granularity.** Multiple branch offices or network segments sharing a single egress IP can be reported on separately in ZIA Analytics. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)

---

## 2. Sublocations vs location groups

These two constructs are routinely conflated. The distinction is structural:

| Attribute | Sublocation | Location Group |
|---|---|---|
| **Nature** | Structural nesting — a location *contains* sublocations | Tagging mechanism — groups reference locations/sublocations as members |
| **Membership** | A sublocation belongs to exactly one parent location | A location or sublocation can belong to many groups simultaneously |
| **Purpose** | Subdivide traffic within a forwarding path by IP range | Aggregate locations/sublocations for rule scoping and admin scope |
| **Creation** | Created directly under a parent location (or auto-created) | Created independently; members assigned or matched by attribute |
| **API object type** | Same `LocationManagement` shape as a location, distinguished by `parent_id` | Separate `LocationGroup` object at `/locationGroup` |

A location group does not care about the parent-child structure of its members. A sublocation can be in a group independently of its parent location. (Tier A — `vendor/zscaler-help/about-location-groups.md`)

**The operator confusion pattern:** an admin creates a sublocation to segregate guest traffic, then creates a location group thinking it replaces or overrides the sublocation. They are additive. The sublocation controls which policy scope the traffic is evaluated against based on source IP. The location group controls which rules include or exclude that sublocation as a match criterion.

---

## 3. IP scope: inheritance vs. override

Sublocations do not inherit or extend the parent's IP range — they define an independent, non-overlapping subset of addresses within the parent's forwarding context.

- **Matching source:** the IP address matched against sublocation ranges is the inner IP inside the GRE/IPSec tunnel, or the client IP extracted from the X-Forwarded-For header (when `xff_forward_enabled` is set on the parent or sublocation). It is not the parent location's public egress IP. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)
- **Non-overlapping constraint:** IP addresses across all sublocations of a single parent location must not overlap. The same IP address can appear in sublocations under different parent locations (different forwarding paths). (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)
- **IP address formats for sublocations:** single IP, CIDR (e.g., `10.10.33.0/24`), or range (e.g., `10.10.33.1-10.10.33.10`). Parent locations use public egress IPs; sublocations use private/internal or tunnel inner IPs. (Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py` — `add_location` docstring, `ip_addresses` field description for sub-locations)
- **Gaps in coverage:** any IP that arrives from the parent's forwarding path and does not match a defined sublocation range is caught by the `other` sublocation. If IPv6 is enabled, `other6` catches unmatched IPv6 traffic.

---

## 4. Bandwidth pool sharing

Bandwidth enforcement for sublocations operates within the parent location's total bandwidth budget.

- Sublocation bandwidth limits (`up_bandwidth` / `dn_bandwidth` in kbps; value `0` means no enforcement) bound that sublocation's usage during contention. (Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py`)
- Unused sublocation bandwidth is shared back to the parent location's pool and can be consumed by sibling sublocations or the parent. This is not strict isolation — a sublocation configured with a cap can receive burst traffic from idle siblings during contention relief. (Tier A — `references/zia/bandwidth-control.md`; `references/zia/locations.md`)
- The parent location's `Enforce Bandwidth Control` toggle must be enabled for any bandwidth limit to have effect. Bandwidth rules at the Bandwidth Control policy level additionally require the toggle to be on. (Tier A — `references/zia/bandwidth-control.md`)

**Operational implication:** if a guest sublocation consuming streaming traffic needs to be truly isolated from a corporate sublocation during bandwidth contention, separate parent locations (with separate forwarding paths) are required. Sublocation bandwidth limits are guidance under contention, not walls. (Tier A — `references/zia/bandwidth-control.md`)

The TF resource expresses bandwidth per-sublocation using `up_bandwidth` and `dn_bandwidth` in the same `zia_location_management` resource block as the sublocation. (Tier A — `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

---

## 5. Policy enforcement at sublocation level

ZIA rules that scope by "location" can reference both parent locations and sublocations. The following policy modules evaluate at sublocation granularity when a sublocation is included in the rule's `locations` or `location_groups` scope:

| Policy module | Sublocation-level scoping |
|---|---|
| URL Filtering rules | Yes — `locations` and `location_groups` arrays accept sublocation IDs |
| SSL Inspection rules | Yes |
| Cloud App Control rules | Yes |
| Firewall Control rules | Yes |
| DLP web rules | Yes |
| Bandwidth Control rules | Yes (indirectly — via `Enforce Bandwidth Control` toggle per location/sublocation) |
| Authentication Policy | Per-location/sublocation toggle (`auth_required`), not a separate rule |

(Tier A — `references/zia/locations.md` policy-module table; `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

**Default-policy fallthrough:** when no explicit rule matches a sublocation, the rule engine falls through to the default rule for that policy module (last in the rule list, first-match-wins). This default rule applies to traffic from the sublocation the same way it applies to any other unmatched traffic. The `other` sublocation is subject to the same fallthrough — leaving `other` without an explicit policy scope means traffic from unmatched IPs gets the default policy, which may be more permissive than intended if other sublocations have been tightened.

---

## 6. Identity and authentication scoping

Sublocations carry their own per-toggle settings for authentication. Sublocations do not automatically inherit the parent location's authentication configuration; each sublocation has its own `auth_required` flag. (Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py` — `add_location` docstring listing `auth_required` as applicable to both locations and sub-locations)

This is the mechanism that supports the canonical guest-network use case: the parent location has `auth_required = true` for the corporate sublocation and `auth_required = false` for the guest sublocation, even though both arrive via the same GRE tunnel. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)

Other per-location settings that can be configured independently on a sublocation include:

- `ssl_scan_enabled` — Enable SSL Inspection
- `ofw_enabled` — Enable Firewall
- `ips_control` — Enable IPS Control
- `aup_enabled` — Enable AUP
- `caution_enabled` — Enable Caution
- `surrogate_ip` — Enable IP Surrogate
- `xff_forward_enabled` — Enable XFF Forwarding
- `dn_bandwidth` / `up_bandwidth` — Bandwidth limits

(Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py`; `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

Because these settings are independent and not inherited from the parent, operators must explicitly configure each sublocation. A newly created sublocation does not automatically pick up the parent's auth, firewall, or SSL settings.

---

## 7. Forwarding method: sublocation vs. parent

A sublocation does not define its own forwarding method. It reuses the parent location's forwarding method (GRE tunnel, IPSec SA, static IP/XFF). The sublocation's `ip_addresses` field identifies the inner/private IP ranges within that tunnel, not a separate forwarding endpoint.

Specifically:

- **GRE/IPSec parent:** sublocations reference private (RFC 1918 or internal-routable) addresses that arrive as inner IPs inside the parent's tunnel. The Zscaler service extracts the inner IP for sublocation matching.
- **XFF parent:** sublocations reference the client IPs extracted from the `X-Forwarded-For` header. The parent must have `xff_forward_enabled = true`. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`)
- **Static IP parent (no tunnel):** sublocations are not applicable in the same way — static IP locations identify traffic by public egress IP only. Sublocation differentiation within a static-IP location requires XFF to carry inner IPs.

The sublocation can set `xff_forward_enabled` independently of its parent. A sublocation can have its own XFF setting when the parent's XFF is off, or vice versa. (Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py`)

There is no mechanism to assign a different GRE tunnel or IPSec SA to a sublocation versus its parent. Forwarding method differentiation requires separate parent locations.

---

## 8. CRUD via API, SDK, and Terraform

### API shape

Sublocations use the same `/locations` endpoint as parent locations. A sublocation is distinguished by a non-zero `parentId` field in the request body. To enumerate all sublocations for a specific parent, the dedicated endpoint is:

```
GET /zia/api/v1/locations/{parentLocationId}/sublocations
```

(Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py` — `list_sub_locations` method, line 626)

### Python SDK

The `LocationsAPI` service (`client.zia.locations`) provides:

| Method | Notes |
|---|---|
| `list_sub_locations(location_id, query_params=None)` | GET `/locations/{id}/sublocations`. Filters: `auth_required`, `bw_enforced`, `enable_firewall`, `enforce_aup`, `xff_enabled`, `search`. |
| `add_location(**kwargs)` | POST `/locations`. Pass `parent_id=<int>` to create a sublocation. If `parent_id` is absent or 0, a parent location is created. |
| `update_location(location_id, **kwargs)` | PUT `/locations/{id}`. The `parent_id` field is writable; see promotion/demotion notes below. |
| `delete_location(location_id)` | DELETE `/locations/{id}`. Same endpoint for both parent and sublocation deletion. |
| `bulk_delete_locations(location_ids)` | POST `/locations/bulkDelete`. Accepts sublocation IDs; maximum 100 IDs per request. |

(Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py`)

The data source `zia_sub_location_management` in the TF provider reads a sublocation by name or ID. (Tier A — `references/zia/terraform.md`)

### Terraform

The `zia_location_management` resource manages both parent locations and sublocations. A sublocation is created by specifying `parent_id`:

```hcl
resource "zia_location_management" "corp_sublocation" {
  name             = "USA_SJC37_Corp"
  country          = "UNITED_STATES"
  tz               = "UNITED_STATES_AMERICA_LOS_ANGELES"
  parent_id        = zia_location_management.usa_sjc37.id
  auth_required    = true
  ofw_enabled      = true
  surrogate_ip     = true
  ip_addresses     = ["10.5.0.0-10.5.255.255"]
  up_bandwidth     = 10000
  dn_bandwidth     = 10000
  depends_on       = [zia_location_management.usa_sjc37]
}
```

(Tier A — `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

Key field notes:

- `parent_id` (Number) — parent location ID. If absent or `0`, the resource is a parent location. Annotated `x-applicableTo: SUB` in the TF provider schema.
- `ip_addresses` — for sublocations, accepts single IP, CIDR, or range; for parent locations, accepts public egress IPs.
- `other_sub_location` (Boolean) — read-flag indicating this is the auto-created `other` catch-all. Can be set explicitly but is normally system-managed.
- `other6_sub_location` (Boolean) — same for the IPv6 `other6` catch-all.

(Tier A — `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

Import by numeric ID or name:

```shell
terraform import zia_location_management.corp_sublocation <sublocation_id>
```

### Parent deletion behavior

The vendor source does not explicitly document what happens to sublocations when their parent location is deleted. This is an unresolved question — see [Deferred items](#deferred-items). Operationally, deleting a parent location while sublocations exist is likely blocked by the API (cascade-delete risk) or results in orphaned records; treat parent deletion as requiring prior deletion of all child sublocations until confirmed otherwise.

### Promotion and demotion

The API/SDK `parent_id` field is writable on update. Setting `parent_id = 0` on an existing sublocation would, in principle, promote it to a parent location. Setting a non-zero `parent_id` on an existing parent location would demote it to a sublocation. Whether the API enforces constraints on this (e.g., requiring no existing sublocations before demotion) is not documented in available sources — see [Deferred items](#deferred-items).

---

## 9. Constraints

| Constraint | Value | Confidence |
|---|---|---|
| Nesting depth | 2 levels (parent → sublocation only; sublocations cannot have their own sublocations) | Tier C — inferred from API/SDK shape; not explicitly stated in vendor help doc |
| IP overlap within a parent | Not permitted — sublocation IP ranges must be non-overlapping within a single parent | Tier A — `vendor/zscaler-help/understanding-sublocations.md` |
| Same IP in multiple parents | Permitted — the same IP address can exist in sublocations under different parent locations | Tier A — `vendor/zscaler-help/understanding-sublocations.md` |
| Max sublocations per parent | Not documented in available vendor sources | Unresolved — see deferred items |
| Naming uniqueness scope | Not explicitly documented; likely per-tenant (not per-parent) based on standard ZIA naming conventions | Tier C — inferred; unresolved |
| Bulk delete max | 100 IDs per request | Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py` |
| Description max length | 1024 characters | Tier A — `vendor/zscaler-sdk-python/zscaler/zia/locations.py`; `vendor/terraform-provider-zia/docs/resources/zia_location_management.md` |

---

## 10. Surprises worth flagging

1. **The `other` sublocation is not a no-op.** Once any user-defined sublocation is created, the `other` sublocation catches all unmatched IPs from the parent and applies its own policy scope. If `other` inherits default (permissive) policy while explicit sublocations have tighter rules, traffic from unmatched IPs escapes the tight policy. Always review `other`'s policy membership when tightening sublocation rules. (Tier A — `vendor/zscaler-help/understanding-sublocations.md`; `references/zia/locations.md`)

2. **Sublocation bandwidth is not isolation.** Setting `dn_bandwidth = 10000` on a sublocation does not guarantee the sublocation stays within 10 Mbps. Unused bandwidth from sibling sublocations flows back to the parent pool and can be consumed by any sublocation. True bandwidth isolation requires separate parent locations. (Tier A — `references/zia/bandwidth-control.md`)

3. **Auth and policy toggles are independent per sublocation — not inherited.** A newly created sublocation does not inherit the parent's `auth_required`, `ofw_enabled`, `ssl_scan_enabled`, or other toggles. Each sublocation must be explicitly configured. Missing one toggle (e.g., forgetting to enable `auth_required` on a corporate sublocation) results in a policy gap that the parent location's setting does not fill.

4. **`other` sublocation membership in dynamic Location Groups.** The `other` sublocation is a normal ZIA location object. If a dynamic Location Group has conditions that match its attributes (e.g., `Location Type = Corporate user traffic`), `other` can be enrolled in the group and become subject to rules scoped to that group. Check dynamic-group conditions before assuming `other` is policy-neutral. (Tier A — `references/zia/locations.md § Predefined dynamic groups`)

5. **Cloud Connector workload sublocations carry an implicit group membership.** When a sublocation is created with `profile = "WORKLOAD"` (via the Cloud & Branch Connector Admin Portal or via `sub_loc_scope`), it is automatically enrolled in the predefined **Workload Traffic Group** dynamic Location Group. This is a write-time side effect — not an explicit group-membership choice. All policies scoped to the Workload Traffic Group immediately apply. (Tier A — `references/zia/locations.md § Predefined dynamic groups`)

6. **Sublocation scope fields (`sub_loc_scope`, `sub_loc_scope_values`, `sub_loc_acc_ids`) are AWS-specific.** These fields apply only to Workload traffic type sublocations whose parent locations are associated with AWS Cloud Connector groups. The `sub_loc_scope` options are: `VPC_ENDPOINT`, `VPC`, `NAMESPACE`, `ACCOUNT`. Using these fields on non-workload or non-AWS sublocations has no defined effect. (Tier A — `vendor/terraform-provider-zia/docs/resources/zia_location_management.md`)

---

## Deferred items

The following questions could not be resolved from available vendor sources. Registered in [`_clarifications.md`](../_clarifications.md).

| Clarification ID | Question |
|---|---|
| [`zia-16`](../_clarifications.md#zia-16-sublocation-count-cap-per-parent) | Maximum number of sublocations per parent location |
| [`zia-17`](../_clarifications.md#zia-17-sublocation-name-uniqueness-scope) | Naming uniqueness scope — per-parent or tenant-global |
| [`zia-18`](../_clarifications.md#zia-18-parent-location-deletion-behavior-with-sublocations) | Parent deletion behavior when sublocations exist (block, cascade-delete, or error) |
| [`zia-19`](../_clarifications.md#zia-19-sublocation-reparenting-via-parent_id-update) | Sublocation promotion/demotion via `parent_id` update — API preconditions |
| [`zia-20`](../_clarifications.md#zia-20-explicit-depth-limit-prohibition-text) | Explicit vendor statement confirming sublocations cannot have their own sublocations |

---

## Cross-links

- Three-tier location model (Location / Sublocation / Location Group): [`./locations.md`](./locations.md)
- Bandwidth enforcement at sublocation level and shared-pool behavior: [`./bandwidth-control.md`](./bandwidth-control.md)
- Python SDK — `LocationsAPI` service and `list_sub_locations`: [`./sdk.md`](./sdk.md)
- Terraform — `zia_location_management` resource and `zia_sub_location_management` data source: [`./terraform.md`](./terraform.md)
- Cloud Connector workload sublocation scopes (AWS): `vendor/zscaler-help/cbc-using-sublocation-scopes-group-cloud-connector-workloads-amazon-web.md`
