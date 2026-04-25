---
product: zia
topic: "locations"
title: "Locations, sublocations, and Location Groups"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-location-groups.md"
  - "vendor/zscaler-help/understanding-sublocations.md"
  - "vendor/zscaler-help/configuring-manual-location-groups.md"
  - "vendor/zscaler-help/configuring-dynamic-location-groups.md"
author-status: draft
---

# Locations, sublocations, and Location Groups

Locations are ZIA's **forwarding-grouping primitive** — the aggregation point that binds a forwarding method (GRE tunnel, IPSec tunnel, PAC, ZCC) to a set of client IPs. Sublocations are subdivisions of a location. Location Groups are a higher-level policy-scoping construct that bundles locations/sublocations for rule application.

Understanding the Location / Sublocation / Location Group distinction is prerequisite for reasoning about any ZIA rule that scopes by "location" — and that's most of them (URL Filtering, SSL Inspection, Firewall Control, DLP, CAC, Bandwidth Control, Authentication Policy).

## The three-tier model

```
Location Group       ←  what rules scope by
   ├─ Location       ←  forwarding method + egress binding
   │    ├─ Sublocation (corporate)
   │    ├─ Sublocation (guest)
   │    └─ Sublocation (other)      ← auto-created catch-all
   └─ Location
        └─ ...
```

### Location

A **forwarding endpoint**. Maps a tenant-visible name to a forwarding path:

- A public egress IP (for IP-anchored forwarding).
- A GRE tunnel source IP.
- An IPSec SA.
- Optional dedicated proxy port.
- Forwarding-method-specific config (MTU, authentication toggle, SSL-inspection toggle).

Each location carries settings that rules later scope by: `Enable SSL Inspection`, `Enforce Authentication`, `Enforce Firewall Control`, `Enforce Bandwidth Control`, `Enable AUP`, `Enable Caution`, `Use XFF from Client Request`, etc.

### Sublocation

A **subdivision inside a location** that references a non-overlapping IP range. Reasons to create a sublocation:

- **Policy granularity within a shared tunnel.** Guest-network traffic and corporate-network traffic share a GRE tunnel, but guest traffic should get different URL Filtering + authentication handling.
- **Bandwidth partitioning.** Sublocation bandwidth limits let the parent location absorb unused bandwidth.
- **Reporting granularity.** Two offices share an egress IP — sublocations preserve per-office reporting.

**Matching rules:**

- Sublocation IP ranges **cannot overlap within a location**.
- The same IP address **can exist in multiple locations** (different egress paths, different tenants/VPCs).
- Matching source: GRE/IPSec encapsulated inner IP OR X-Forwarded-For header.

**Auto-created sublocations:**

| Name | Purpose |
|---|---|
| `other` | Catch-all for IPs sent from this location that don't match any defined sublocation range. |
| `other6` | IPv6 equivalent of `other`, created when IPv6 is enabled on the parent location. |

Both can be renamed. Both receive traffic that doesn't match explicit sublocation ranges — so they function as a default policy scope if you use sublocations at all.

### Location Group

A **policy-scoping container**. Groups contain locations and/or sublocations. Rules reference location groups (not individual locations) to target policy at a population.

**Group types:**

- **Manual Location Group** — explicitly assigned members. Up to 32K locations/sublocations per group.
- **Dynamic Location Group** — attribute-based membership. Auto-updates as location attributes change.

Dynamic groups match on the **intersection** of configured conditions. A location must match ALL the group's conditions, but can have additional attributes and still qualify (e.g., group requires "name starts with NYC AND SSL Inspection on"; location "NYC Office 1" with SSL Inspection and Firewall Control both on qualifies).

Membership independence: a location can be in a group independently of its sublocations, and vice versa. A location/sublocation can belong to multiple groups (manual and dynamic simultaneously).

**Limit:** 256 location groups per organization (manual + dynamic combined).

### Predefined dynamic groups

Zscaler ships 5 view-only predefined dynamic groups:

| Group | Populated for |
|---|---|
| **Corporate User Traffic Group** | Locations with Location Type = Corporate user traffic |
| **Guest Wifi Group** | Location Type = Guest Wi-Fi traffic |
| **IoT Traffic Group** | Location Type = IoT traffic |
| **Server Traffic Group** | Location Type = Server traffic |
| **Workload Traffic Group** | Location Type = Workload traffic — auto-populated for sublocations created via the Cloud & Branch Connector Admin Portal |

The Location Type field on a location/sublocation drives which predefined group it lands in. Workload Traffic Group membership is a cross-product signal: it indicates traffic originated from Cloud Connector, not from ZCC or a tunnel.

## Dynamic group condition attributes

Available attributes for dynamic-group matching:

| Attribute | Operator | Notes |
|---|---|---|
| **City / State / Province** | Contains / Ends With / Equals / Starts With | Requires ≥3-letter prefix |
| **Country** | Multi-select | Countries from a dropdown |
| **Enable AUP / Caution / Authentication / Bandwidth Control / Firewall Control** | on/off | Scopes by location's own toggles |
| **Location Type** | Select | Corporate / Guest Wi-Fi / IoT / Server / Workload / Extranet |
| **Extranet Resource** | Select | All locations in the extranet, minus exclusions |
| **Managed By** | Search | SD-WAN partner name (if tenant is partner-managed) |
| **Name** | Boolean op + text | Exact or pattern match |
| **Use XFF from Client Request** | on/off | Surfaces locations using XFF to identify sublocations |

## What policy modules scope by Location vs Location Group

| Policy surface | Scopes by |
|---|---|
| **URL Filtering rules** | Location + Location Group (rule's `locations` / `location_groups` arrays) |
| **SSL Inspection rules** | Location + Location Group |
| **Cloud App Control rules** | Location + Location Group |
| **Firewall Control rules** | Location + Location Group |
| **DLP rules** | Location + Location Group |
| **Bandwidth Control rules** | Location (primarily; also bandwidth class) |
| **Authentication Policy (`Enforce Authentication`)** | Per-Location toggle, not a separate rule |
| **Admin scope** | Location Group (determines which admins can edit which locations) |

**Design implication:** if you want a rule to apply to "NYC corporate users," don't scope by location — scope by a dynamic Location Group matching Name starts-with NYC + Type = Corporate User Traffic. This way a new NYC location auto-inherits without editing the rule.

## The XFF mechanic

When a tenant's upstream proxy / CDN / WAF inserts an X-Forwarded-For header, ZIA can honor it to attribute traffic to a sublocation. Toggled per-location by **Use XFF from Client Request**. Use cases:

- CDN / reverse-proxy terminates TLS then forwards to ZIA — native source IP is the CDN's; XFF carries the client IP.
- B2B extranet — partner traffic arrives from a VPN with shared egress; XFF preserves the partner-tenant identity.

XFF is opt-in per location because accepting unauthenticated headers is a spoofing risk.

## Extranet locations

An **Extranet Location Type** groups locations assigned to a specific extranet (third-party network connected via Zscaler). Used for B2B traffic segregation. Extranet groups let you write rules that apply only to partner traffic without coupling those rules to per-partner location IDs.

## Surprises worth flagging

1. **A location can change policy scope without being edited.** If rules scope by dynamic Location Groups with attribute conditions, toggling the location's SSL Inspection flag from off to on can silently enroll it into a different group and a different policy. Review dynamic-group attribute conditions before changing per-location toggles.

2. **`other` sublocation is not a no-op.** Unless you set a sublocation range that covers every IP in the parent, traffic from unmatched IPs lands in `other` — and `other` has its own policy scope. Leaving `other` with default policy while tightening other sublocations means some traffic escapes the tighter rules.

3. **Bandwidth at sublocation cascades to parent.** Sublocation bandwidth enforcement is bounded by the parent location's total bandwidth, and unused sublocation bandwidth is shared back to the parent. This is not a strict isolation boundary — burst behavior can cross sublocation lines.

4. **Manual groups cap at 32K members.** For very large organizations, a single manual group can fill up. Dynamic groups have no equivalent cap (membership derives from attribute matching).

5. **A single location/sublocation can be in many groups.** No mutual-exclusion check at the group level — a location can be in the Corporate User Traffic predefined group + a Manual group for US + a Dynamic group for "has SSL Inspection on" simultaneously. Rules across all three groups all apply. This is powerful but makes "which rules apply to this location" non-obvious; the skill should always recommend enumerating all group memberships before reasoning about policy coverage.

6. **`Location Type` selection auto-populates predefined Dynamic Groups at write time.** Creating a location/sublocation with `Location Type = Workload traffic` silently adds it to the **Workload Traffic Group** at creation time — no explicit group-membership choice required. Same for `Corporate user traffic` (→ Corporate User Traffic Group), `Guest Wi-Fi traffic`, `IoT traffic`, `Server traffic`. An admin creating a sublocation for Cloud Connector workloads doesn't see this happen explicitly — it's a write-time side effect — and immediately becomes subject to all policies scoped to that predefined group. Always check predefined-group memberships of newly-created locations before considering them "policy-isolated." Source: *Configuring Dynamic Location Groups* lines 18–21.

## Cross-links

- Rule scoping examples: [`./url-filtering.md`](./url-filtering.md), [`./ssl-inspection.md`](./ssl-inspection.md), [`./cloud-app-control.md`](./cloud-app-control.md).
- Cloud Connector Workload sublocations: [`../cloud-connector/overview.md`](../cloud-connector/overview.md).
- Forwarding methods that terminate at locations (GRE/IPSec): [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md) and the captured GRE deployment docs under `vendor/zscaler-help/`.
- Extranet-specific behavior: not yet covered as a dedicated doc — see help article *About Extranet* if needed.
