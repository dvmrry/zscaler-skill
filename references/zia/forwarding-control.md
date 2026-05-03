---
product: zia
topic: "forwarding-control"
title: "Forwarding Control + Source IP Anchoring (SIPA) — egress routing decisions"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-sdk-python/zscaler/zia/forwarding_control.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/zpa_gateway.py"
  - "vendor/zscaler-help/configuring-forwarding-policies-source-ip-anchoring-using-zpa.md"
  - "vendor/zscaler-help/configuring-source-ip-anchoring.md"
  - "vendor/zscaler-help/understanding-source-ip-anchoring.md"
  - "vendor/zscaler-help/understanding-source-ip-anchoring-direct.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_rule.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_forwarding_control_zpa_gateway.go"
  - "vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt"
author-status: draft
---

# Forwarding Control + Source IP Anchoring (SIPA)

Forwarding Control is the ZIA policy that decides **what happens to traffic after inspection** — it governs egress routing, not content decisions. It sits at the end of the ZIA pipeline, after URL Filtering, SSL Inspection, CAC, DLP, and all other content-inspection modules have had their say. When traffic clears those gates, a Forwarding Control rule determines where it goes next.

Pipeline position:

```
traffic hits ZIA PSE
      ↓
Firewall Control
      ↓
SSL Inspection (decrypt/bypass decision)
      ↓
URL Filtering / CAC / DLP / Sandbox / Malware / ATP
      ↓
[Forwarding Control]  ←── you are here
      ↓
egress (internet / ZPA / direct / drop)
```

Because Forwarding Control fires after content inspection, a ZPA-forwarded flow still traverses DLP, SSL Inspection, and IPS. Forwarding Control chooses the exit ramp; it doesn't bypass the inspection pipeline before it.

## Forward methods (the `forward_method` field)

From the TF provider schema and Python SDK (Tier A — both sources):

| `forward_method` | Behavior |
|---|---|
| `ZIA` | Default egress via Zscaler's cloud egress IPs. No special config required. |
| `ZPA` | Route traffic to a ZPA App Connector via a configured ZPA Gateway. Used for SIPA. `zpa_gateway` + `zpa_app_segments` required. |
| `ECZPA` | Like `ZPA` but for Zscaler Cloud Connector (Edge Connector) deployments. Uses `zpa_application_segments` / `zpa_application_segment_groups`, not `zpa_app_segments`. |
| `DIRECT` | Bypass ZIA's egress infrastructure; send traffic directly to the destination from the ZIA service edge. |
| `PROXYCHAIN` | Forward to a downstream proxy. `proxy_gateway` required. |
| `DROP` | Silently discard matching traffic. |
| `ENATDEDIP` | Egress using a dedicated IP (Dedicated IP gateway). |
| `GEOIP` | Route based on geo-IP destination classification. |
| `ECSELF` | Cloud Connector self-forwarding. |
| `INVALID` | Placeholder / unconfigured state — not a valid production action. |

`dest_addresses`, `dest_countries`, and `dest_ip_categories` can only be set on `DIRECT`, `PROXYCHAIN`, `ENATDEDIP`, and `GEOIP` rules — the TF provider enforces this at plan time (Tier A).

**Default when no rule matches:** traffic falls to the `ZIA` forward method — standard ZIA cloud egress. There is no implicit drop.

## Predefined rules

Four predefined forwarding rules ship with every ZIA tenant. The TF provider enforces that these cannot be deleted (Tier A — `validatePredefinedRules` in the Go source):

| Rule name | Purpose |
|---|---|
| `ZIA Inspected ZPA Apps` | Forwards ZPA app-segment traffic with "Inspect Traffic with ZIA" enabled back through ZIA for inspection. Enabled by default; cannot be edited. Requires ZPA App Inspection license. |
| `Fallback mode of ZPA Forwarding` | Fallback handling when the primary ZPA forwarding path is unavailable. |
| `Client Connector Traffic Direct` | Applies direct forwarding for ZCC-originated traffic matching defined criteria. |
| `ZPA Pool For Stray Traffic` | Catches ZPA-destined traffic that doesn't match any configured forwarding rule. |

## Source IP Anchoring (SIPA)

### What problem it solves

When ZIA forwards traffic to the internet, egress comes from Zscaler's shared cloud IPs — not the user's corporate IP. For applications that enforce IP-based allowlists, geo-IP checks, or conditional-access policies keyed to "internal network" IPs, this breaks access. SIPA is the solution: traffic exits through a ZPA App Connector inside the customer's network (or in a chosen data center), so the apparent source IP is the connector's IP, not a Zscaler cloud IP.

### Mechanism (Tier A — help docs)

1. A SIPA-scoped forwarding rule in ZIA matches the traffic (by destination app segment, source user/group, etc.) and routes it to a configured ZPA Gateway with `forward_method = ZPA`.
2. The ZPA Gateway in ZIA references a ZPA Server Group — the connector pool that will carry the traffic. The gateway also enumerates the ZPA App Segments covered.
3. On the ZPA side, the App Connector in that Server Group acts as the exit point. The destination server sees the connector's IP as the source.

The App Connector must have the **Source IP Anchor** option enabled on the ZPA Application Segment, and the ZPA Client Forwarding Policy must route the `ZIA Service Edge` client type to ZPA (not bypass it) for domain-based apps.

Traffic still passes through ZIA's full content-inspection pipeline before being handed off to ZPA. ZPA is the egress path, not an inspection bypass.

### SIPA does not require a ZPA license

A Source IP Anchoring subscription is required, but a full ZPA license is not. An org can use SIPA with ZPA App Connectors deployed solely for this purpose. (Tier A — *Understanding Source IP Anchoring* help doc.)

### Protocol limitations

- RTSP is not supported.
- ICMP echo request/response is supported on ICMP-enabled ZPA app segments; max payload 990 bytes. ICMP traceroute is not supported.

### The two SIPA flavors

**SIPA-via-ZPA (normal mode)**

The standard configuration. ZIA routes matching traffic to ZPA connectors. ZIA remains the active inspection plane. Client Forwarding Policy in ZPA is configured to:
- For IP-based app segments: `Only Forward Allowed Applications` action.
- For domain-based app segments: two rules — `Bypass ZPA` for all client types except `ZIA Service Edge`, and `Forward to ZPA` for `ZIA Service Edge` only.

**SIPA Direct (disaster-recovery mode)**

SIPA Direct is a ZPA-side configuration change that activates when ZIA is in disaster recovery mode. When ZIA is offline or in DR, the normal SIPA path breaks because ZIA cannot forward traffic to ZPA. SIPA Direct reconfigures ZPA's Client Forwarding Policy to route traffic directly through ZPA connectors, bypassing ZIA temporarily. (Tier A — *Understanding Source IP Anchoring Direct* help doc.)

To activate SIPA Direct during a ZIA DR event:
- Change the domain-based app rule from `Bypass ZPA` → `Forward to ZPA`.
- Change the IP-based app rule from `Only Forward Allowed Applications` → `Forward to ZPA`.

Revert both changes when ZIA recovers.

## ZPA Gateway — the ZIA-side cross-product handle

The ZPA Gateway is a ZIA resource that serves as the reference point connecting a Forwarding Control rule to the ZPA side. It does **not** live in ZPA Admin Portal; it is configured entirely within ZIA.

ZPA Gateway fields (Tier A — TF provider + Python SDK):

| Field | Purpose |
|---|---|
| `name` | Friendly name. Referenced by forwarding rules. |
| `type` | `ZPA` (for ZIA → ZPA SIPA) or `ECZPA` (for Cloud Connector deployments). |
| `zpa_server_group` | The ZPA Server Group configured for SIPA. Referenced by `external_id` (the ZPA-side ID) + `name`. |
| `zpa_app_segments` | The ZPA Application Segments covered by this gateway. Each segment referenced by `external_id` + `name`. |
| `zpa_tenant_id` | The ZPA tenant ID where SIPA is configured. |

The `external_id` values are ZPA-side identifiers — they cross the product boundary. When provisioning via Terraform, the ZPA resources (Server Group, App Segments) must exist in ZPA before the ZIA Gateway can reference them.

A forwarding rule with `forward_method = ZPA` requires both `zpa_gateway` and `zpa_app_segments` on the rule itself (Tier A — TF CustomizeDiff validation). The `zpa_app_segments` on the rule must be a subset of (or match) the app segments registered on the referenced gateway.

**Auto ZPA Gateway:** A predefined gateway named `Auto ZPA Gateway` exists in every tenant. It cannot be deleted (Tier A — `validatePredefinedObject` in Go source). Its behavior and linkage to ZPA are managed by Zscaler; it is not operator-configurable.

**`zpaBrokerRule` field on the wire:** the SDK model carries a `zpaBrokerRule` field on `ForwardingControlRule` (`forwarding_control_policy.py:52`). Related to ZPA broker integration. Will appear in snapshot JSON; not operator-configurable through the standard rule schema.

## Rule criteria

Forwarding Control rules share the standard ZIA rule-criteria model. From the TF schema and Python SDK (Tier A):

- Identity scoping: `users`, `groups`, `departments`, `device_groups`
- Location scoping: `locations` (up to 32), `location_groups` (up to 32)
- Source: `src_ips`, `src_ip_groups`, `src_ipv6_groups`
- Destination: `dest_addresses`, `dest_ip_groups`, `dest_ip_categories`, `dest_countries`, `res_categories`
- Network: `nw_services`, `nw_service_groups`, `nw_application_groups`
- App: `zpa_app_segments` (for ZPA method), `app_service_groups`

Rule evaluation is first-match-wins in ascending Rule Order, with Admin Rank as a structural gate — same model as URL Filtering and Firewall. See [`./url-filtering.md`](./url-filtering.md).

## DNS configuration for SIPA

SIPA requires matching DNS forwarding rules to function end-to-end. ZIA ships two predefined DNS Control rules (Tier A — *Configuring Source IP Anchoring* help doc):

- **ZPA Resolver for Road Warrior** — for ZCC remote users.
- **ZPA Resolver for Locations** — for office/tunnel users.

Both must be enabled and ordered correctly: Road Warrior rule must have higher rule precedence than Locations rule. If Road Warrior is disabled, road-warrior SIPA traffic falls under the Locations rule instead of being blocked — the traffic is resolved by the wrong IP pool and not routed as intended.

## Gotchas

1. **ZPA Gateway health dependency.** If the ZPA Server Group referenced by the gateway has no healthy connectors, traffic matching the ZPA forwarding rule has nowhere to go. The fallback behavior is not documented in the sources reviewed — the `Fallback mode of ZPA Forwarding` predefined rule exists to catch this case, but its exact action is not source-confirmed. Treat traffic delivery as unreliable if connectors are unhealthy. (Tier D inference from predefined rule name; actual fallback semantics unverified.)

2. **Z-Tunnel 1.0 / PAC gating for SIPA.** To support SIPA for Z-Tunnel 1.0 traffic, `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` must be on in Advanced Settings — same gate as Firewall Control. Without this toggle, ZT1.0/PAC traffic bypasses the forwarding-control evaluation for road warriors. (Tier A — *Configuring Source IP Anchoring* help doc.)

3. **ZPA forwarding rule create/update has a 60-second delay.** The TF provider sleeps for 60 seconds before creating or updating a rule with `forward_method = ZPA`, and retries up to 3 times on the specific error "is no longer an active Source IP Anchored App Segment." This is an undocumented API propagation delay for ZPA-side segment activation. (Tier A — TF Go source `resource_zia_forwarding_control_rule.go`.)

4. **`dest_addresses` / `dest_countries` / `dest_ip_categories` are mutually exclusive with ZPA method.** The TF provider CustomizeDiff blocks these fields when `forward_method = ZPA`. Only `DIRECT`, `PROXYCHAIN`, `ENATDEDIP`, and `GEOIP` rules can scope by destination address/country/category. ZPA rules scope by `zpa_app_segments` instead.

5. **ZPA App Segment must have `Source IP Anchor` enabled in ZPA.** Configuring the ZIA side correctly is not sufficient. The ZPA App Segment must have the Source IP Anchor option enabled, and the `Use Client Forwarding Policy` bypass setting must be selected. If the ZPA-side config is missing, ZIA will forward traffic to ZPA but the connector won't anchor the source IP as expected. (Tier A — *Configuring Source IP Anchoring* help doc.)

6. **SIPA user-based policy and ZPA Access Policy don't mix.** If SIPA traffic is user-scoped in ZIA, do not add user-based SAML/SCIM criteria in the ZPA Access Policy for those same segments — it creates conflicting identity evaluation across products. (Tier A — *Configuring Source IP Anchoring* help doc.)

7. **GetAll vs GetByID bug in ZPA Gateway reads.** The TF provider's Read function explicitly fetches all gateways and filters client-side rather than calling GetByID, with an inline comment noting "API bug where Get by ID returns incorrect app segments." (Tier A — TF Go source.) This means `terraform import` uses a GetAll scan, not a direct lookup.

## Cross-links

- Traffic pipeline position (Firewall → Web module → Forwarding Control): [`./firewall.md`](./firewall.md), [`./url-filtering.md`](./url-filtering.md).
- Z-Tunnel 1.0/PAC forwarding gate for road warriors: [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md).
- ZPA App Segments (ZPA-side counterpart to `zpa_app_segments` references): [`../zpa/app-segments.md`](../zpa/app-segments.md).
- ZPA App Connectors (the physical egress point for SIPA): [`../zpa/app-connector.md`](../zpa/app-connector.md).
- Location / Location Group scoping for forwarding rules: [`./locations.md`](./locations.md).
