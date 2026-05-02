---
product: zcc
topic: "zcc-trusted-networks"
title: "ZCC trusted networks — detection criteria and evaluation"
content-type: reference
last-verified: "2026-05-01"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/trustednetworks.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go"
  - "vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md"
author-status: draft
---

# ZCC trusted networks — detection criteria and evaluation

A **TrustedNetwork** is a named set of criteria ZCC uses to answer the question "am I on a known corporate-trusted network right now?" The answer flows directly into the active Forwarding Profile's TRUSTED vs UNTRUSTED action branch, which in turn determines whether traffic is sent to ZIA via Z-Tunnel, bypassed, or handled via PAC.

## What trusted networks are

Trusted networks are conditions under which ZCC changes its forwarding behavior. When a device's current network environment matches a TrustedNetwork's criteria, ZCC applies the "On-Trusted Network" action branch of its Forwarding Profile instead of the "Off-Trusted Network" branch. This is the mechanism that allows ZCC to, for example:

- Bypass ZIA inspection on the corporate LAN (where a perimeter firewall handles it) while still tunneling when off-network.
- Use Z-Tunnel on all networks including corporate (full always-on ZIA inspection).
- Apply different ZPA behaviors on corporate vs. home networks.

**Trusted network detection is continuous.** ZCC re-evaluates when network conditions change — adapter up/down, DHCP renewal, SSID switch, or manual trigger. A user who moves between networks (office → coffee shop → home) flips TRUSTED ↔ UNTRUSTED multiple times per day.

---

## Detection methods — all TrustedNetwork criteria fields

From `vendor/zscaler-sdk-python/zscaler/zcc/models/trustednetworks.py` (lines 37–53) and confirmed against `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go` (lines 18–35):

| Python field | Wire key | Meaning | Format | Go type |
|---|---|---|---|---|
| `dns_servers` | `dnsServers` | Active DNS servers must include one of these IPs. | CSV string (e.g., `'10.11.12.13, 10.11.12.14'` — `trusted_networks.py:127`) | `string` |
| `dns_search_domains` | `dnsSearchDomains` | DNS search domain suffix must include one of these. | CSV string (`trusted_networks.py:128`) | `string` |
| `hostnames` | `hostnames` | Hostnames the endpoint should be able to resolve as proof-of-network. | CSV string | `string` |
| `resolved_ips_for_hostname` | `resolvedIpsForHostname` | When the hostnames above resolve, the IPs must be in this list. Guards against DNS hijack. | CSV string | `string` |
| `ssids` | `ssids` | Active Wi-Fi SSID must be one of these. Applies only to Wi-Fi-connected clients. | CSV string | `string`, **`omitempty` in Go** (`trusted_network.go:31`) |
| `trusted_dhcp_servers` | `trustedDhcpServers` | DHCP server that handed out the current lease must be one of these IPs. | CSV string | `string` |
| `trusted_gateways` | `trustedGateways` | Active default gateway must be one of these IPs. | CSV string | `string` |
| `trusted_subnets` | `trustedSubnets` | Endpoint's current IP must fall within one of these CIDRs. | CSV string of CIDRs | `string` |
| `trusted_egress_ips` | `trustedEgressIps` | Endpoint's observed egress IP (the public IP the network NATs to) must be one of these. Requires ZCC to probe and learn the egress IP via a Zscaler service probe. | CSV string | `string`, **`omitempty` in Go** (`trusted_network.go:33`) |

### The CSV-string wire format

All criteria fields are comma-separated strings on the wire, **not JSON arrays**. This is a wire-format quirk specific to TrustedNetwork objects. Callers writing API payloads must serialize criteria as comma-separated strings. Consumers parsing snapshot JSON must split on `,` and trim whitespace per field. Confirmed in Python SDK examples: `trusted_networks.py:127–132` shows `dns_servers='10.11.12.13, 10.11.12.14'`, `dns_search_domains='network1.acme.com, network2.acme.com'`, and empty criteria as `''` (empty string) not `None`.

### Criterion field truthiness

A criterion field that is null or empty is **ignored**, not treated as "match nothing." A TrustedNetwork with only `dns_servers` populated and all other fields empty will match on DNS server alone — the empty fields are irrelevant to evaluation. This matches the "unset criteria are ignored" pattern used by ZIA URL filtering rules.

Do not pass empty strings vs. null interchangeably — the SDK surfaces both as "empty" but the wire format may differ. When writing criteria programmatically, explicitly null out unused fields rather than passing empty strings.

---

## Metadata and lifecycle fields

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Tenant-scoped integer identifier. Referenced by `ForwardingProfile.trusted_network_ids`. |
| `guid` | `guid` | Stable UUID; survives rename. Preferred for durable cross-references. |
| `network_name` | `networkName` | Display name for the TrustedNetwork. |
| `active` | `active` | Whether this TrustedNetwork is live. Inactive TrustedNetworks still appear in list responses — filter client-side when auditing. |
| `company_id` | `companyId` | Tenant ID. |
| `created_by` / `edited_by` | `createdBy` / `editedBy` | Admin audit fields. |
| `condition_type` | `conditionType` | How criteria within this TrustedNetwork combine (AND vs OR). **Integer on the wire** — not a string. See below. |

---

## `condition_type` — how criteria combine

The `condition_type` field on a TrustedNetwork decides whether ZCC requires **all** configured criteria within this TrustedNetwork to match (AND — strict) or **any** one of them (OR — permissive). **Distinct from the `conditionType` field on `ForwardingProfile`** — that one combines the profile's inline criteria with its referenced TrustedNetworks at a higher level. See [`./forwarding-profile.md § The profile object`](./forwarding-profile.md). The two fields share a wire name but operate at different levels of the criteria tree.

**Critical type note**: The Go SDK (`trusted_network.go:22`) declares this field as `int` with no `omitempty` — zero is a valid wire value. **The Python client docstring (`trusted_networks.py:102`) incorrectly documents it as `condition_type (str):`** — this is a bug in the Python docs. The Python model (`trustednetworks.py:39`) reads it as untyped `Any` (`config["conditionType"]`) so doesn't enforce either. The Go struct is the ground-truth wire definition: send `int`, not string. **The specific integer-to-meaning mapping is not enumerated in either SDK** — see [`clarification zcc-06`](../_meta/clarifications.md#zcc-06-trustednetwork-condition_type-enum). Lab-test against a real tenant to determine which int maps to AND vs OR.

**Operationally this is the critical field.**

| `condition_type` behavior | Risk |
|---|---|
| OR semantics | A user on a guest Wi-Fi that matches any single criterion (e.g., SSID = "CorpGuest") is classified as trusted. Broad; common misconfiguration. |
| AND semantics | All configured criteria must match. More secure but a single misconfigured criterion (wrong IP, unused SSID field left empty-but-non-null) causes the TrustedNetwork to never match. |

---

## How trusted network status affects forwarding mode

Trusted network evaluation feeds directly into the Forwarding Profile action branches. The full evaluation chain:

```
ZCC detects network change
    └── Evaluates TrustedNetwork criteria (condition_type: AND or OR)
            └── Result: TRUSTED or UNTRUSTED (or VPN_TRUSTED, SPLIT_VPN_TRUSTED)
                    └── Forwarding Profile selects corresponding action branch
                            ├── ZIA action: Tunnel / PAC / None (direct)
                            └── ZPA action: Tunnel / None
```

The Forwarding Profile also recognizes VPN-Trusted and Split VPN-Trusted network types, which are detected independently of TrustedNetwork criteria objects (via VPN interface detection). See [`./forwarding-profile.md`](./forwarding-profile.md) for the full network type taxonomy.

**`evaluate_trusted_network = false` is the master off switch.** If false on the Forwarding Profile, trusted-network evaluation is skipped entirely and ZCC always behaves as if on an untrusted network. A tenant where all users appear to be treated as untrusted even on corporate LAN should check this flag on their Forwarding Profile first.

### Effect on split tunneling

When ZCC's Forwarding Profile has `actionType = NONE` (bypass ZIA) on the On-Trusted branch, the device is effectively on a split-traffic configuration while on the corporate network — ZCC forwards ZPA traffic through the microtunnel but sends internet traffic direct. This is the intended design for offices with on-prem internet gateways; it is also the most common cause of "traffic bypassed ZIA inspection" findings when trusted-network criteria are misconfigured.

---

## Z-Tunnel 2.0 deployment and trusted networks

From the Z-Tunnel 2.0 best practices vendor source (Tier A — vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md):

Z-Tunnel 2.0 best practices prescribe creating a dedicated Forwarding Profile for Z-Tunnel 2.0 testing with:

- Tunnel Driver Type: Packet Filter-Based
- On-Trusted Network: Tunnel (send through Z-Tunnel 2.0)
- Tunnel version selection: Z-Tunnel 2.0
- VPN-Trusted Network and Off-Trusted Network: Same as "On-Trusted Network"

This configuration means all network types — trusted, VPN-trusted, and off-trusted — use Z-Tunnel 2.0. There is no bypass on trusted networks in this test posture. The recommendation is **not** to configure VPN-Trusted and Off-Trusted differently during initial testing to reduce variable complexity.

**Don't route Z-Tunnel 2.0 through GRE tunnels.** For on-premises environments with existing GRE infrastructure, implement one of:
- Configure the ZCC Forwarding Profile to fall back to Z-Tunnel 1.0 when Trusted Network Criteria are met (on-trusted = Z-Tunnel 1.0, off-trusted = Z-Tunnel 2.0).
- Configure a policy-based route to exclude Z-Tunnel 2.0 traffic from the GRE tunnel.

This is a common operational pattern: a tenant that has corporate offices with GRE-based Zscaler connectivity and remote/home workers on Z-Tunnel 2.0 will have On-Trusted action = Z-Tunnel 1.0 (or None) and Off-Trusted action = Z-Tunnel 2.0.

---

## Common trusted network patterns

### Corporate LAN (strongest)

Three orthogonal signals that are hard to spoof simultaneously:

```
trusted_dhcp_servers = 10.1.1.1, 10.1.1.2
dns_search_domains = corp.example.com
trusted_gateways = 10.1.0.1
condition_type = AND (all three must match)
```

### VPN-attached trusted (hostname proof)

Resolve an internal-only hostname and verify the response comes from the expected internal IP range. Works because the hostname only resolves when the VPN is connected or when already on-LAN:

```
hostnames = dc01.corp.example.com
resolved_ips_for_hostname = 10.10.1.10, 10.10.1.11
condition_type = AND
```

### Egress IP signature (branch offices with stable NAT)

```
trusted_egress_ips = 203.0.113.10, 203.0.113.11
```

Reliable for offices with stable NAT egress. Fails for home users behind carrier-grade NAT or dynamic ISP IPs. With a single criterion, AND vs OR is semantically identical.

### Weak single-criterion (Wi-Fi SSID only)

```
ssids = Corp-WiFi
```

Weak alone — SSIDs are trivially forged. Use as a sub-criterion within an AND alongside DHCP or gateway checks.

---

## Common misconfiguration patterns

### Detecting the wrong DNS suffix

**Pattern**: `dns_search_domains = example.com` instead of `corp.example.com`. Home users who have `example.com` appearing in their DHCP search list (e.g., from a home ISP that appends the domain) match the TrustedNetwork and bypass ZIA.

**Fix**: Use the most specific internal-only DNS suffix. Check that the suffix does not appear in consumer ISP configurations.

### Overly broad trusted subnet

**Pattern**: `trusted_subnets = 192.168.0.0/16`. Most consumer Wi-Fi routers use `192.168.x.x` addressing. Home users on their home Wi-Fi match the subnet and are classified as trusted.

**Fix**: Use office-specific RFC 1918 ranges that are not consumer defaults. Prefer `/24` or more specific. Combine with additional criteria (gateway IP, DHCP server) in an AND.

### VPN overlap with on-LAN detection

**Pattern**: A split-tunnel VPN routes corporate DNS through the tunnel. ZCC sees corporate DNS servers (`dns_servers` matches) while the endpoint's primary interface is still the home ISP. ZCC classifies as trusted (ZIA bypassed) but the user is actually on an untrusted network.

**Fix**: Combine `dns_servers` with `trusted_subnets` or `trusted_gateways` in an AND. DNS server visibility alone is not sufficient when split-tunnel VPN is in use.

### OR semantics with guest SSID included

**Pattern**: TrustedNetwork has condition_type = OR, and one criterion is the corporate guest SSID. Any device connecting to the guest SSID (visitors, unmanaged devices) is classified as trusted and bypasses ZIA.

**Fix**: Use AND semantics. Remove SSIDs as a standalone criterion unless it is the only possible network type (e.g., office has a unique SSID that cannot be replicated outside).

### SSID criterion on wired clients

**Pattern**: TrustedNetwork uses `ssids` as a required criterion in AND mode. Wired desktop users have no SSID — the criterion never matches. Wired users are always classified as untrusted.

**Fix**: Do not include `ssids` as a required AND criterion in TrustedNetworks that must work for both wired and wireless users. Use SSID as an OR criterion or in a separate TrustedNetwork scoped to Wi-Fi users.

### Trailing whitespace in criteria

**Pattern**: CSV string `'10.11.12.13 , 10.11.12.14'` (space before comma). Whitespace handling on the match side is not specified in available sources. A criterion of `10.11.12.13 ` (trailing space) may not match against a detected server of `10.11.12.13`.

**Fix**: Write criteria without spaces before or after commas. `'10.11.12.13,10.11.12.14'` is safest.

### Egress IP unknown early in boot

ZCC probes for egress IP after network bring-up. Immediately after network establishment, `trusted_egress_ips`-dependent TrustedNetworks may fail to match (egress IP not yet known). ZPA or ZIA policy decisions made in that early window apply the untrusted branch and may stick until the next re-evaluation trigger.

**Fix**: Use egress IP as one of multiple AND criteria rather than the sole criterion, so the evaluation can proceed on other criteria while egress IP is being probed.

---

## SDK fields — metadata and API

### TrustedNetwork object metadata

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Tenant-scoped integer. Referenced by `ForwardingProfile.trusted_network_ids`. |
| `guid` | `guid` | UUID. Stable across renames. |
| `network_name` | `networkName` | Display name. |
| `active` | `active` | Live/inactive toggle. Inactive objects are still returned by list; filter client-side. |
| `condition_type` | `conditionType` | int. AND vs OR — exact enum values undocumented. See zcc-06. |

### API surface

From `vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py` and confirmed against `vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go`, all methods on `client.zcc.trusted_networks`:

| Method | HTTP | Path | Source lines |
|---|---|---|---|
| `list_by_company(query_params={})` | GET | `/zcc/papi/public/v1/webTrustedNetwork/listByCompany` | `trusted_networks.py:64–68`, `trusted_network.go:60` |
| `add_trusted_network(**kwargs)` | POST | `/zcc/papi/public/v1/webTrustedNetwork/create` | `trusted_networks.py:138–142`, `trusted_network.go:143` |
| `update_trusted_network(**kwargs)` | PUT | `/zcc/papi/public/v1/webTrustedNetwork/edit` | `trusted_networks.py:194–198`, `trusted_network.go:183` |
| `delete_trusted_network(network_id)` | DELETE | `/zcc/papi/public/v1/webTrustedNetwork/{id}/delete` | `trusted_networks.py:236–239`, `trusted_network.go:210` |

Query params for `list_by_company`: `page` (int), `page_size` (int), `search` (str) — `trusted_networks.py:32`.

### API gotchas

**Response envelope**: The list endpoint wraps results under `trustedNetworkContracts`, not at the top-level array. The Go SDK unwraps it via `TrustedNetworksResponse.TrustedNetworkContracts []TrustedNetwork` (`trusted_network.go:38–41`); the Python SDK unwraps it at `trusted_networks.py:86`: `trusted_networks = response_body.get("trustedNetworkContracts", [])`. Any custom lister (snapshot-refresh.py or similar) must unwrap this key.

**Create doesn't return the new object**: POST `/create` returns only `{success, errorCode}` — not the created TrustedNetwork. Documented in the Go SDK comment block at `trusted_network.go:43–46` ("The contract (id, networkName, etc.) is not returned; resolve the resource via `GetTrustedNetworkByName` after create"); struct definition at `trusted_network.go:47–50`. The Go SDK works around this by retrying `GetTrustedNetworkByName` up to 6 times with 2-second delays after create (`trusted_network.go:154–166`). The Python SDK doesn't implement this retry — callers using the Python SDK must re-fetch manually after create.

**Update requires ID on the request body**: PUT `/edit` validates that `id` is non-empty before sending (`trusted_network.go:179–181`). Omitting the ID returns an error. The Python SDK passes kwargs straight to the request body via `body.update(kwargs)` (`trusted_networks.py:201`) without checking for `id` — callers must include `id` themselves or the API will reject the call without a clear client-side error.

**Error code semantics**: The mutation response treats `errorCode = "0"` as success; any other non-empty string is a failure (`trusted_network.go:53`). Don't test `errorCode` for truthiness alone — `"0"` is truthy in Python but means success.

**`omitempty` divergence between Go and Python**: `ssids` and `trustedEgressIps` have `omitempty` in the Go struct (`trusted_network.go:31, 33`) — they are omitted from the JSON payload when empty. The Python `request_format()` (`trustednetworks.py:73–98`) always serializes all 17 fields, including empty strings. If the API behaves differently depending on field presence vs. empty-string, this divergence could cause unexpected behavior in Python-written payloads. Treat this as unverified until confirmed against a live tenant.

**Pagination for name/ID lookups**: The Go SDK uses a hard-coded `pageSize = 1000` (`trusted_network.go:88`) when scanning by name, stopping when the page returns fewer than 1000 results (`trusted_network.go:103`). Tenants with more than 1000 TrustedNetworks (unusual but possible for very large deployments) would need multi-page handling.

---

## Open questions

- `condition_type` enum values and AND/OR semantics within a TrustedNetwork — [clarification `zcc-06`](../_meta/clarifications.md#zcc-06-trustednetwork-condition_type-enum).
- Whether trusted-network evaluation is stateful across network transitions (does ZCC debounce rapid changes? cache the previous result?) — not surfaced by SDK.
- Precedence when multiple TrustedNetworks referenced by a single Forwarding Profile both partially match — not documented.

---

## Cross-links

- How trusted-network results flow into forwarding actions — [`./forwarding-profile.md`](./forwarding-profile.md)
- Forwarding Profiles portal configuration (network type taxonomy) — [`./forwarding-profiles.md`](./forwarding-profiles.md)
- Z-Tunnel 2.0 deployment (trusted network role in Z-Tunnel 2.0 rollout) — [`./z-tunnel.md`](./z-tunnel.md)
- ZCC API surface summary — [`./api.md`](./api.md)
- ZPA's `TRUSTED_NETWORK` access-policy condition (fed from here via `sendTrustedNetworkResultToZpa`) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
