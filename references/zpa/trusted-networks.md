---
product: zpa
topic: "trusted-networks"
title: "ZPA Trusted Networks — policy-side network identifiers"
content-type: reasoning
last-verified: "2026-04-28"
confidence: medium
source-tier: code
sources:
  - "vendor/zscaler-sdk-python/zscaler/zpa/trusted_networks.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/trusted_network.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/trustednetwork/zpa_trusted_network.go"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_trusted_network.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"
  - "vendor/terraform-provider-zpa/zpa/common.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_forwarding_rule.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_inspection_rule.go"
author-status: draft
---

# ZPA Trusted Networks — policy-side network identifiers

> **Disambiguation — two layers, similar names:**
> [`references/zcc/trusted-networks.md`](../zcc/trusted-networks.md) documents the **ZCC agent's detection** of whether an endpoint is on a trusted network (DNS, SSID, DHCP, subnet, egress-IP checks). That is a client-side detection primitive.
> **This document** covers the ZPA-side `TrustedNetwork` object — a named identifier that ZPA policy rules use as a match criterion. The two are related but separately configured and separately sourced. Operators frequently conflate them. Read both.

## Source-side caveat

The Zscaler help-portal page for ZPA Trusted Networks was returning 404 as of April 2026. This document is sourced entirely from SDK source code and Terraform provider source. Confidence is `medium` — field semantics are inferred from code, not from official documentation.

## What ZPA Trusted Networks are

A ZPA Trusted Network is a **named, read-only network identity object** stored in the ZPA management plane. It represents a specific network (typically a corporate site, branch, or cloud environment) that ZPA knows about. Policy rules use Trusted Network objects as match criteria: "apply this rule only when the user's ZPA session is associated with Trusted Network X."

Trusted Networks are **not created by operators** through the normal admin UI flow — they are provisioned by Zscaler when the tenant's networks are registered (often tied to App Connector deployment or PSE group configuration). Operators reference them; they do not define their network-detection criteria. That detection job belongs to ZCC (see disambiguation note above).

## How ZPA uses Trusted Network detection for on-network users

ZPA Trusted Network detection affects policy evaluation for on-network users in a specific way: when a user's ZPA session is established from a known trusted network, ZPA can apply different policy logic — for example, routing traffic through a local Private Service Edge rather than a distant Public Service Edge, or relaxing authentication requirements for specific apps.

The detection signal flows as follows:
1. ZCC evaluates its TrustedNetwork detection criteria (DNS servers, SSID, DHCP server, subnet, egress IP) on the endpoint.
2. When a match occurs, ZCC signals to ZPA at session establishment: "this user is on Trusted Network X."
3. ZPA policy conditions with `objectType = TRUSTED_NETWORK` evaluate against those signals.
4. Policy rules matching on trusted network status can route traffic differently (e.g., prefer a nearby PSE) or grant access that would otherwise require additional authentication.

This is the primary operational use case: on-network users connecting to ZPA can be routed through on-premises Private Service Edges (PSEs) rather than Public Service Edges. The PSE Group's `trusted_networks` field maps the PSE Group to the networks for which it should be preferred. See the PSE Group section below.

## The two-layer model

```
ZCC (endpoint agent)                        ZPA (policy plane)
────────────────────                        ──────────────────
TrustedNetwork detection criteria           TrustedNetwork object
  dns_servers, ssid, dhcp, subnets,   ──►   id, network_id, name, domain
  egress_ips, condition_type               
  → evaluates: "am I on network X?"        Policy condition:
  → signals ZPA at session setup             objectType=TRUSTED_NETWORK
                                             lhs=<networkId>
                                             rhs="true"
```

The ZCC layer runs on the endpoint and produces a yes/no signal per registered Trusted Network. That signal is passed to ZPA at tunnel establishment. The ZPA policy engine evaluates `TRUSTED_NETWORK` conditions against those signals to gate or route access.

**Configuration is independent.** A ZPA Trusted Network object can exist with no corresponding ZCC TrustedNetwork detection criteria (the signal is never sent, condition never matches). A ZCC TrustedNetwork detection ruleset can exist with no ZPA policy rule referencing its network — the detection happens but has no policy effect. Both must be configured for the complete flow.

## Object schema

From `models/trusted_network.py` (Python SDK) and `zpa_trusted_network.go` (Go SDK):

| Python field | Wire key | Go field | Notes |
|---|---|---|---|
| `id` | `id` | `ID` | ZPA tenant-scoped opaque string ID. Used to reference the object in list responses. Do not use in policy conditions. |
| `network_id` | `networkId` | `NetworkID` | The stable network identifier used as the `lhs` value in `TRUSTED_NETWORK` policy conditions. This is what policy rules reference, not `id`. |
| `name` | `name` | `Name` | Display name. May include a cloud-suffix in parentheses, e.g. `"Corp-HQ (zscalerthree.net)"` — the Go SDK strips this suffix via `RemoveCloudSuffix` before name comparison. |
| `domain` | `domain` | `Domain` | Domain associated with the network. |
| `zscaler_cloud` | `zscalerCloud` | `ZscalerCloud` | Zscaler cloud instance this network is homed to (e.g. `zscalerthree.net`). |
| `master_customer_id` | `masterCustomerId` | `MasterCustomerID` | Parent tenant ID in a multi-tenant hierarchy. Present when the object is inherited from a parent tenant. Read-only. |
| `creation_time` | `creationTime` | `CreationTime` | Audit timestamp. Read-only. |
| `modified_time` | `modifiedTime` | `ModifiedTime` | Audit timestamp. Read-only. |
| `modified_by` | `modifiedBy` | `ModifiedBy` | Admin ID of last modifier. Read-only. |

**Important:** ZPA Trusted Networks are read-only from the operator's perspective. The TF provider exposes only a **data source** (`data_source_zpa_trusted_network.go`), not a resource — there is no `resource_zpa_trusted_network.go`. Operators look up existing Trusted Network objects; they cannot create or delete them via API.

## API endpoints

From `trusted_networks.py` and `zpa_trusted_network.go`:

- List: `GET /zpa/mgmtconfig/v2/admin/customers/{customerId}/network` — paginated; supports `search`, `page`, `page_size`.
- Get by ID: `GET /zpa/mgmtconfig/v1/admin/customers/{customerId}/network/{networkId}` — note v1 for single-object fetch, v2 for list.
- Lookup by `networkId` value: no dedicated endpoint; requires client-side scan of list results (`GetByNetID` in Go SDK iterates the full list).

**SDK service** (`client.zpa.trusted_networks`): `list_trusted_networks`, `get_trusted_network`. Read-only. (Tier A — `trusted_networks.py`.)

## PSE Group mapping

Source (Tier A): `resource_zpa_service_edge_group.go` lines 152–168. ZPA Private Service Edge (PSE) Groups carry a `trusted_networks` field — a list of Trusted Network IDs. This maps a PSE Group to specific networks: the PSE Group is associated with those trusted network identities and is preferred or exclusively used when users connect from those networks.

The `publicly_accessible` field on a PSE Group controls whether the PSE is also available for users outside the mapped trusted networks. If `publicly_accessible = false`, only users whose ZCC signals an associated Trusted Network will connect through this PSE Group; remote users will connect to Public Service Edges instead. (Tier A — vendor/zscaler-help/about-private-service-edge-groups.md: "Choose if the Private Service Edge group with specific trusted networks mapping is also available publicly for all users outside of these trusted networks.")

This is the most direct structural coupling between a Trusted Network object and a ZPA resource. Operators deploying PSE Groups at branch sites will typically bind the PSE Group to the Trusted Network(s) representing those sites.

## How policy rules reference Trusted Networks

ZPA access policy conditions use the `TRUSTED_NETWORK` object type. Confirmed across:
- ACCESS_POLICY (`resource_zpa_policy_access_rule.go`, `resource_zpa_policy_access_rule_v2.go`)
- CLIENT_FORWARDING_POLICY (`resource_zpa_policy_access_forwarding_rule.go`, `resource_zpa_policy_access_forwarding_rule_v2.go`)
- INSPECTION_POLICY (`resource_zpa_policy_access_inspection_rule.go`, `resource_zpa_policy_access_inspection_rule_v2.go`)

Condition shape (from `common.go` validator at lines 1111–1127):

```
objectType = "TRUSTED_NETWORK"
lhs        = <networkId value>       // the network_id field, NOT the object id field
rhs        = "true"                  // always "true"; "false" is accepted by v1 schema but
                                     // validators in v2 schema enforce only "true"
```

The TF provider validates `lhs` by calling `GetByNetID` at plan time — a plan with an invalid `networkId` will fail at `terraform plan`. Source: `common.go` line 151.

## Interaction with ZCC trusted network detection

Both ZCC and ZPA maintain "trusted network" objects, and both can independently detect the same physical network:

- **ZCC detection** runs continuously on the endpoint. When it matches a configured TrustedNetwork ruleset, it sets the forwarding profile's trusted-network action (e.g., change tunnel mode, apply different proxy settings, stop/start ZCC tunnel).
- **ZPA policy evaluation** happens at session establishment and per-request (for policy re-evaluation). It checks the `TRUSTED_NETWORK` signals sent by ZCC.

A single corporate network can be registered in both systems:
- In ZCC: as a TrustedNetwork with DNS server + DHCP server + subnet criteria (`references/zcc/trusted-networks.md`)
- In ZPA: as a TrustedNetwork object referenced in PSE Group and access policy conditions

These are independent configurations with no automatic sync. Operators must configure both if they want both ZCC behavior changes (forwarding profile switching) and ZPA policy changes (PSE routing, access rules) to trigger when a user is on the corporate network.

**Key operational point:** the same network can be configured as trusted in ZCC (causing ZCC to switch forwarding behavior) while not being registered as a ZPA TrustedNetwork (no ZPA policy effect). Conversely, a ZPA TrustedNetwork can exist without a ZCC detection ruleset (ZPA object exists but the signal is never sent). Audit both layers when troubleshooting unexpected behavior for on-network users.

## Gotchas

**1. `network_id` vs `id` — the most common SDK mistake.**
Policy conditions reference `networkId` (the `network_id` field), not the object's `id`. The SDK docstring for `list_trusted_networks` explicitly calls this out: "Retrieve posture profiles udid with: `if profile.network_id: print(profile.network_id)`". If you set `lhs` to the object `id` instead of `network_id`, the condition silently never matches.

**2. Name collision with ZCC Trusted Networks.**
ZCC has its own `TrustedNetwork` objects (detection criteria) and ZPA has its own (policy identifiers). Both appear in operator dashboards and SDK responses. An operator who finds `client.zcc.trusted_networks.list_by_company()` and `client.zpa.trusted_networks.list_trusted_networks()` returning objects with similar names is looking at two completely different things. See [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md).

**3. Trusted Networks are read-only — no create/update/delete.**
The TF provider provides only a data source, not a resource. Attempting to manage Trusted Network objects via the API will fail. Operators create ZCC detection rules (via the ZCC API) and Zscaler provisions the ZPA Trusted Network objects as part of the network registration workflow. The exact provisioning trigger is not documented in source code.

**4. Cloud suffix in names.**
Trusted Network names often include a parenthetical cloud suffix, e.g. `"Corp-HQ (zscalerthree.net)"`. The Go SDK's `GetByName` strips this suffix via `RemoveCloudSuffix` before comparison (source: `zpa_trusted_network.go` lines 57, 71). The Python SDK does not strip it. When searching by name via the Python SDK, callers must either strip the suffix themselves or use exact match.

**5. `master_customer_id` signals inheritance.**
If `master_customer_id` is populated, the Trusted Network was inherited from a parent tenant in a multi-tenant hierarchy. Operators cannot modify inherited objects at the child tenant level.

**6. RHS semantics — "true" only in v2 policy schema.**
The v1 policy condition schema accepts `rhs = "true"` or `rhs = "false"` for `TRUSTED_NETWORK`. The v2 schema validator enforces `rhs = "true"` only (source: `common.go` lines 1124–1125). The intended semantic of `"false"` (i.e., "user is NOT on this trusted network") is present in the v1 validator but removed from v2 enforcement. Use `"true"` exclusively.

**7. PSE Group `publicly_accessible` interacts with trusted network scoping.**
If a PSE Group has trusted networks configured but `publicly_accessible = false`, remote users (whose ZCC does not signal those trusted networks) will not route through that PSE. This is intentional for on-prem-only PSE deployments but can be a surprise when testing from off-network.

## Cross-links

- ZCC Trusted Networks (the endpoint detection layer — read this first): [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md)
- Policy rule types and precedence: [`./policy-precedence.md`](./policy-precedence.md)
- App Connector and Connector Groups (analogous network-infrastructure binding): [`./app-connector.md`](./app-connector.md)
- Segment Groups and Server Groups (similar SDK-sourced doc pattern): [`./segment-server-groups.md`](./segment-server-groups.md)
- ZPA Private Service Edges (PSE Groups carry trusted_networks field): [`./private-service-edges.md`](./private-service-edges.md)
- TrustedNetworksAPI in SDK catalog — [`./sdk.md`](./sdk.md) §2.39
