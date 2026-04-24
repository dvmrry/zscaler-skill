---
product: zcc
topic: "zcc-trusted-networks"
title: "ZCC trusted networks — detection criteria and evaluation"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
sources:
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/trustednetworks.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/trusted_networks.py"
author-status: draft
---

# ZCC trusted networks — detection criteria and evaluation

A **TrustedNetwork** is a named set of criteria ZCC uses to answer the question "am I on a known corporate-trusted network right now?" The answer flows directly into the active forwarding profile's TRUSTED vs UNTRUSTED action branch (see [`./forwarding-profile.md`](./forwarding-profile.md)).

## Summary

A TrustedNetwork is effectively a ruleset of environmental checks (DNS servers, SSID, DHCP server, etc.) — when the endpoint's current network state matches, the network is "trusted" for the purposes of any forwarding profile referencing it. Multiple criteria within one TrustedNetwork combine per a `condition_type` enum whose exact semantics are not fully documented.

Trusted-network evaluation is **continuous** on the endpoint. ZCC re-evaluates when it detects a network change (adapter up/down, DHCP renewal, SSID switch), which can flip the active action branch and change where traffic goes mid-session.

## Mechanics

### Criteria fields

From `zscaler/zcc/models/trustednetworks.py`, a TrustedNetwork object's criteria fields:

| Field | Wire key | Meaning | Format |
|---|---|---|---|
| `network_name` | `networkName` | Display name for the TrustedNetwork. | String. |
| `dns_servers` | `dnsServers` | Active DNS servers must include one of these IPs. | CSV string (per SDK example: `'10.11.12.13, 10.11.12.14'`). |
| `dns_search_domains` | `dnsSearchDomains` | DNS search domain must include one of these. | CSV string. |
| `hostnames` | `hostnames` | Hostnames the endpoint should be able to resolve as proof-of-network. | CSV string. |
| `resolved_ips_for_hostname` | `resolvedIpsForHostname` | When the above hostnames resolve, the IPs must be in this list — guards against DNS hijack ("I resolved `corp.internal` but to a random public IP"). | CSV string. |
| `ssids` | `ssids` | Active Wi-Fi SSID must be one of these (Wi-Fi-connected clients only). | CSV string. |
| `trusted_dhcp_servers` | `trustedDhcpServers` | DHCP server that handed out the current lease must be one of these IPs. | CSV string. |
| `trusted_gateways` | `trustedGateways` | Active default gateway must be one of these IPs. | CSV string. |
| `trusted_subnets` | `trustedSubnets` | Endpoint's current IP must fall within one of these CIDRs. | CSV string of CIDRs. |
| `trusted_egress_ips` | `trustedEgressIps` | Endpoint's observed egress IP (public IP the network NATs to) must be one of these. | CSV string. Requires ZCC to learn the egress IP — usually via a Zscaler service probe. |

The CSV-string wire format (not a JSON array) is the main wire-format quirk — callers writing API payloads need to serialize the criteria as comma-separated strings, not lists. Consumers parsing snapshot JSON should split on `,` and trim whitespace per field.

### Metadata / lifecycle fields

| Field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Tenant-scoped integer identifier — referenced by `ForwardingProfile.trusted_network_ids`. |
| `guid` | `guid` | Stable UUID; survives rename. |
| `active` | `active` | Whether this TrustedNetwork is live. Inactive TrustedNetworks still appear in list responses; filter client-side when auditing. |
| `company_id` | `companyId` | Tenant ID. |
| `created_by` / `edited_by` | `createdBy` / `editedBy` | Admin audit fields. |
| `condition_type` | `conditionType` | How the criteria within this TrustedNetwork combine. See below. |

### `condition_type` — how criteria combine within a TrustedNetwork

The `condition_type` field decides whether ZCC requires **all** configured criteria to match (AND — strict) or **any** one of them (OR — permissive). The SDK does not enumerate valid values. Lab-test both behaviors against a real tenant to confirm; see [`clarification zcc-06`](../_clarifications.md#zcc-06-trustednetwork-condition_type-enum).

**Operationally this is the critical field.** A TrustedNetwork with OR semantics across (DNS server = `10.11.12.13`) OR (SSID = `CorpGuest`) would classify a user on the guest Wi-Fi as trusted — probably not what was intended. A TrustedNetwork with AND semantics over many criteria can silently never match if *any* criterion is misconfigured (e.g., an unused `ssids` field left empty but not null).

### Evaluation timing

ZCC re-evaluates trusted-network state on:

- Network adapter up/down.
- DHCP lease renewal.
- Wi-Fi SSID change.
- Manual force-check (available in ZCC's tray menu on most platforms).

A user who moves between networks (office → coffee shop → home) flips TRUSTED ↔ UNTRUSTED multiple times, each transition re-applying the forwarding profile's corresponding action branch. In-flight connections may or may not survive the transition depending on the transport (Z-Tunnel 2.0 session resumption vs. fresh handshake).

### Criteria field truthiness

A criterion field that is null/empty is **ignored** (not treated as "match nothing"). A TrustedNetwork with only `dns_servers` populated and all other fields empty will match on DNS server alone. This matches the "unset criteria are ignored" pattern used by ZIA URL filtering rules (see `references/zia/url-filtering.md § Rule criteria logic`).

Do not pass empty strings vs. null interchangeably, though — the SDK surfaces both as "empty" but the wire format may be different. When writing criteria programmatically, explicitly null out unused fields.

## Common patterns

- **Corporate LAN identification**: `trusted_dhcp_servers` + `dns_search_domains` + `trusted_gateways` AND-ed. Three orthogonal signals; hard to spoof on a hostile network.
- **VPN-attached-trusted**: `hostnames` + `resolved_ips_for_hostname` — resolve an internal-only hostname and check the response comes from the expected internal IP range. Works because the hostname only resolves when the VPN is connected (or when already on-LAN).
- **Wi-Fi-specific**: `ssids` alone — weak signal (SSIDs are trivially forged) but useful as a sub-criterion in an AND.
- **Egress IP signature**: `trusted_egress_ips` — the tenant's corporate network NATs to a small set of public IPs; ZCC probes its egress IP and compares. Works well for branch offices with stable egress but fails for home users behind carrier-grade NAT.

## Edge cases

- **DNS rewriters break DNS-based criteria.** Corporate malware protection tools that inject DNS responses (NextDNS, OpenDNS on home networks) can make `dns_servers = 10.11.12.13` look like `dns_servers = 208.67.222.222` to ZCC. The TrustedNetwork fails to match even though the user is on the expected network. Point operators toward hostname-resolution or egress-IP criteria instead of DNS server when DNS rewriting is suspected.
- **VPN split-tunnel confusion.** Split-tunnel VPNs may route corporate DNS through the tunnel while leaving other traffic direct. ZCC sees corporate DNS servers (looks trusted) but the endpoint's primary interface is still the untrusted one. Combine `dns_servers` with `trusted_subnets` or `trusted_gateways` to cross-check.
- **Wi-Fi SSID on wired clients.** `ssids` doesn't match on a wired connection because there is no SSID. Don't mix `ssids` as a required criterion in AND-style trusted networks that are supposed to work on both wired and wireless.
- **Criteria with trailing whitespace.** The SDK stores criteria as CSV strings; whitespace handling on the match side isn't specified. Safest to not include spaces after commas when writing programmatically.
- **Egress IP unknown early in boot.** Immediately after network bring-up, ZCC may not have probed the egress IP yet. Rules depending on `trusted_egress_ips` can spuriously fail-untrusted for the first few seconds. ZPA/ZIA policy decisions made in that window may stick until the next re-evaluation trigger.

## API surface

From `zscaler/zcc/trusted_networks.py`, all methods hang off `client.zcc.trusted_networks`:

- `list_by_company(query_params={...})` → `GET /zcc/papi/public/v1/webTrustedNetwork/listByCompany`. Response body has the list nested under `trustedNetworkContracts` (not the outer array you'd expect). Query params: `page`, `page_size`, `search`.
- `add_trusted_network(**kwargs)` → `POST /zcc/papi/public/v1/webTrustedNetwork/create`.
- `update_trusted_network(**kwargs)` → `PUT /zcc/papi/public/v1/webTrustedNetwork/edit`.
- `delete_trusted_network(network_id)` → `DELETE /zcc/papi/public/v1/webTrustedNetwork/{id}/delete`.

The list endpoint wrapping under `trustedNetworkContracts` is a wire-format gotcha — `snapshot-refresh.py` or any custom lister needs to know about it.

## Open questions

- `condition_type` enum values and AND/OR semantics within a TrustedNetwork — [clarification `zcc-06`](../_clarifications.md#zcc-06-trustednetwork-condition_type-enum).
- Whether trusted-network evaluation is stateful across network transitions (does ZCC debounce rapid changes? cache the previous result?) — not surfaced by SDK.
- Precedence when multiple TrustedNetworks referenced by a single profile both partially match — not documented.

## Cross-links

- How trusted-network results flow into forwarding actions — [`./forwarding-profile.md`](./forwarding-profile.md)
- ZCC API surface summary — [`./api.md`](./api.md)
- ZPA's `TRUSTED_NETWORK` access-policy condition (fed from here via `sendTrustedNetworkResultToZpa`) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
