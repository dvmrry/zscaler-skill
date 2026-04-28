---
product: shared
topic: "z-tunnel"
title: "Z-Tunnel 1.0 and 2.0 — protocol differences, migration, and bypass configuration"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zscaler-client-connector/about-z-tunnel-1.0-z-tunnel-2.0"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/migrating-z-tunnel-1.0-z-tunnel-2.0"
  - "vendor/zscaler-help/migrating-z-tunnel-1.0-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/best-practices-deploying-z-tunnel-2.0"
  - "vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/best-practices-adding-bypasses-z-tunnel-2.0"
  - "vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md"
author-status: draft
---

# Z-Tunnel 1.0 and 2.0 — protocol differences, migration, and bypass configuration

This is the shared reference covering Z-Tunnel protocol architecture, the migration path from 1.0 to 2.0, Business Continuity cloud constraints, bypass configuration for Z-Tunnel 2.0, and the relationship to ZCC forwarding profiles.

The ZCC-specific depth on forwarding profile configuration and SDK fields is in [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md). This document covers the protocol and operational reference that applies across contexts — including for engineers deciding whether to migrate, and for those diagnosing why 2.0 is silently falling back to 1.0.

## Z-Tunnel 1.0 vs 2.0 — technical differences

| Dimension | Z-Tunnel 1.0 | Z-Tunnel 2.0 |
|---|---|---|
| Transport protocol | HTTP CONNECT requests (proxy) | DTLS (primary) or TLS (fallback) packet tunnel |
| Traffic scope | Proxy-aware apps, or port 80/443 only | **All ports and protocols** |
| Driver requirement | Packet Filter driver | Packet Filter driver |
| NAT requirement | Any NAT | **Single-IP NAT** — all connections from one device must share the same egress IP |
| GRE coexistence | Compatible | Performance-degrading; double-encapsulation causes MTU/fragmentation issues |
| Fallback behavior | None (1.0 is the fallback target) | Falls back to 1.0 automatically on tunnel establishment failure |
| Bypass location | App profile PAC file | VPN Gateway Bypasses, Destination Exclusions/Inclusions, port-based entries, or domain-based PAC — **not the PAC used for 1.0** |
| BC cloud support | Yes | No — Business Continuity Cloud only supports Z-Tunnel 1.0 |

### Z-Tunnel 1.0 architecture

Z-Tunnel 1.0 forwards traffic to the Zscaler cloud via CONNECT requests, functioning like a traditional proxy. It sends proxy-aware traffic, or port 80/443 traffic, depending on the forwarding profile configuration (Tier A — vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md).

Consequences:
- UDP, non-web TCP, ICMP, and non-standard-port traffic are **not forwarded**. They either go direct or are blocked depending on the local firewall policy.
- Works in environments where the network enforces HTTP proxy semantics.
- Compatible with enterprise network-layer proxies.

### Z-Tunnel 2.0 architecture

Z-Tunnel 2.0 uses DTLS or TLS to send packets to the Zscaler service. Because of this, Z-Tunnel 2.0 carries **all ports and protocols** (Tier A — vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md).

Critical NAT requirement: the NAT device in the data path must use **a single IP for all connections from a single device**. If connections from the same device egress through different NAT IPs, Z-Tunnel 2.0's control and data connections land on different Public Service Edges. Z-Tunnel 2.0 fails to establish and falls back to Z-Tunnel 1.0 silently. This is the most common reason a tenant reports "we enabled Z-Tunnel 2.0 but devices are still using 1.0" (Tier A — vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md).

## When to stay on Z-Tunnel 1.0

### Business Continuity Cloud constraint

**Business Continuity (BC) Cloud only supports Z-Tunnel 1.0.** This is a hard architectural constraint, not a configuration choice. Tenants or user populations that rely on BC mode for ZIA continuity during primary cloud outages must remain on Z-Tunnel 1.0 (at least for the BC cloud path). You can run Z-Tunnel 2.0 for normal operation and fall back to 1.0 when BC conditions are triggered — but the BC cloud itself will not establish a Z-Tunnel 2.0 session (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md, "About Business Continuity" related article).

### GRE-deployed offices

Offices with existing GRE tunnel infrastructure should stay on Z-Tunnel 1.0 for on-LAN users, or add a policy-based route to exclude Z-Tunnel 2.0 traffic from the GRE path. Double-encapsulating Z-Tunnel 2.0 DTLS/TLS traffic inside a GRE tunnel causes overhead and fragmentation that degrades performance (Tier A — vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md). See [`./gre-tunnels.md § Z-Tunnel 2.0 incompatibility`](./gre-tunnels.md).

### Mixed-OS fleets without platform parity

Z-Tunnel 2.0 port-based bypasses (Destination Exclusions with port syntax) are **only supported on Windows and macOS**. Linux, iOS, and Android do not support port-based bypass entries. Tenants with significant Linux, iOS, or Android populations need a fallback plan for those devices before fully committing to Z-Tunnel 2.0 bypass semantics (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md).

## Migration path from Z-Tunnel 1.0 to 2.0

The vendor-documented migration consists of six phases. Run them sequentially; do not skip the observation window (Tier A — vendor/zscaler-help/migrating-z-tunnel-1.0-z-tunnel-2.0.md):

| Phase | Key steps |
|---|---|
| **1 — Identify users and configure Z-Tunnel 2.0 settings** | Create a small test group. Create a new forwarding profile: `Tunnel Driver Type: Packet Filter-Based`, `On-Trusted Network: Tunnel`, `Tunnel Version: Z-Tunnel 2.0`, VPN-Trusted and Off-Trusted set to "Same as On-Trusted". Create a new app profile: `Rule Order: 1`, enable `Install Zscaler SSL Certificate`, scope to the test group. Assign a supported ZCC version to the group via the App Store. |
| **2 — Add VPN gateway bypasses** | Copy VPN gateway bypasses from the original app profile to the Z-Tunnel 2.0 app profile. |
| **3 — Add network address and range bypasses** | Gather network-address and range bypasses from the original app profile PAC file. Add them to the `Destination Exclusions` list on the Z-Tunnel 2.0 app profile — **not the PAC file**. |
| **4 — Add URL and domain-based bypasses** | Create a new forwarding profile PAC with `PROXY ${ZAPP_TUNNEL2_BYPASS}` return for bypassed domains. Create a new app profile PAC with `DIRECT` return for the same domains. |
| **5 — Test** | Verify top business applications work for the test group. Collect user feedback. |
| **6 — Batch rollout** | Roll out in batches of 100–200 users, verifying business applications after each batch. |

**Do not migrate by copying 1.0 PAC bypasses directly.** Z-Tunnel 1.0 network bypasses live in the PAC file; Z-Tunnel 2.0 network bypasses must go into `Destination Exclusions` or `VPN Gateway Bypasses`. Copying PAC-based network bypasses to a 2.0 profile has no effect on 2.0 traffic (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md).

### GRE coexistence during migration

If the site has GRE tunnels, implement one of these during migration to prevent Z-Tunnel 2.0 traffic from double-encapsulating through GRE (Tier A — vendor/zscaler-help/migrating-z-tunnel-1.0-z-tunnel-2.0.md):

- Configure the ZCC forwarding profile to fall back to Z-Tunnel 1.0 when Trusted Network Criteria are met (on-LAN users stay on 1.0).
- Configure a policy-based route on the upstream router to exclude Z-Tunnel 2.0 traffic from the GRE tunnel.

## Z-Tunnel 2.0 bypass configuration

Z-Tunnel 2.0 uses a different bypass architecture than Z-Tunnel 1.0. Network bypasses are not configured in the PAC file for Z-Tunnel 2.0 (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md).

### Bypass type hierarchy

Bypasses are evaluated in the following precedence order:

| Priority | Type | Location | Scope |
|---|---|---|---|
| 1 (highest) | VPN Gateway Bypasses | App Profile — `Hostname or IP Address Bypass for VPN Gateway` | IPs, subnets, or FQDNs; kernel-level filter; never reaches ZCC processing |
| 2 | Destination Exclusions | App Profile — `Destination Exclusions` | Subnet-based; resolved to IP at evaluation time |
| 3 | Port-based bypasses | App Profile — `Destination Exclusions` (with port syntax) | Windows and macOS only |
| 4 (lowest) | Domain-based bypasses | Forwarding profile PAC + app profile PAC | HTTP/HTTPS web traffic only; requires Z-Tunnel 1.0 listener for non-proxy-aware paths |

### VPN Gateway Bypasses

The highest-priority bypass type. Configures a kernel-level filter that ignores matching traffic before ZCC even processes it. Accepts IPs, subnets, or FQDNs. FQDN entries are DNS-resolved by ZCC at bypass evaluation time — volatile FQDN-to-IP mappings (CDN-backed, CGN) cause ongoing DNS churn. Use IP/subnet when possible (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md).

### Destination Exclusions and Inclusions

Configure using one of two patterns:

- **Allowlist mode**: add `0.0.0.0/0` to Destination Exclusions, add specific subnets to Destination Inclusions. Only listed subnets go through Z-Tunnel 2.0; everything else is direct.
- **Denylist mode**: add `0.0.0.0/0` to Destination Inclusions, add specific subnets to Destination Exclusions. All traffic goes through Z-Tunnel 2.0 except the excluded subnets.

**Conflict resolution rules** (deterministic, applied in order) (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md):

1. More-specific netmask wins: `10.0.0.0/24` beats `10.0.0.0/16`.
2. Same netmask → more fields win: `10.0.0.0/8:443:tcp` beats `10.0.0.0/8:443` beats `10.0.0.0/8`.
3. Identical specificity → Inclusion wins over Exclusion.

### Port-based bypasses

Syntax: append port or port range to a Destination Exclusions entry (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md):

```
192.168.1.0/24:80        # bypass port 80 for subnet
192.168.1.0/24:80-85     # bypass port range 80-85 for subnet
```

**Windows and macOS only.** Not supported on Linux, iOS, or Android.

### Domain-based bypasses (PAC-based)

Required for destinations that cannot be expressed as a stable IP subnet (CDN-fronted SaaS, etc.). The mechanism differs by ZCC version:

**ZCC 3.7 and earlier (Windows) — dual PAC** (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md):

Forwarding profile PAC (routes to the bypass path):
```javascript
function FindProxyForURL(url, host) {
  if (dnsDomainIs(host, ".example.com"))
    return "PROXY ${ZAPP_TUNNEL2_BYPASS}";
  return "DIRECT";
}
```

App profile PAC (sends traffic direct):
```javascript
function FindProxyForURL(url, host) {
  if (dnsDomainIs(host, ".example.com"))
    return "DIRECT";
  return "PROXY ${GATEWAY}:443";
}
```

**ZCC 3.8 and later (Windows) — forwarding profile options** (Tier A — vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md):

| `Redirect Web Traffic to ZCC Listening Proxy` | `Use Z-Tunnel 2.0 for Proxied Web Traffic` | Web traffic | Non-web traffic |
|---|---|---|---|
| Enabled | Disabled | Listening proxy via Z-Tunnel **1.0** | Z-Tunnel 2.0 |
| Disabled | Enabled | System proxy → listening proxy → Z-Tunnel 2.0; no system proxy → direct to Z-Tunnel 2.0 | Z-Tunnel 2.0 |
| Enabled | Enabled | Listening proxy via Z-Tunnel **2.0** | Z-Tunnel 2.0 |

The `Use Z-Tunnel 2.0 for Proxied Web Traffic` flag applies only to connections matching the PAC's **default return statement**. Traffic matching a specific PAC statement that routes to a particular Service Edge silently uses Z-Tunnel 1.0, regardless of this flag.

## Relationship to ZCC forwarding profiles

Z-Tunnel selection is configured per-forwarding-profile, per-network-type action. The same user can use different tunnel versions in different network contexts (Tier A — vendor/zscaler-help/migrating-z-tunnel-1.0-z-tunnel-2.0.md):

- **On-Trusted Network action** — controls tunnel version on the corporate LAN.
- **VPN-Trusted Network action** — controls tunnel version when connected via corporate VPN.
- **Off-Trusted Network action** — controls tunnel version when remote/off-network.

These are independent. The recommended migration approach sets all three to "Same as On-Trusted Network" during initial testing, then differentiates per-branch after observation.

Required forwarding profile settings to enable Z-Tunnel 2.0 (Tier A — vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md):
- `Tunnel Driver Type`: Packet Filter-Based
- `On-Trusted Network`: Tunnel
- `Tunnel version selection`: Z-Tunnel 2.0

For SDK field mapping, forwarding profile model details, and the `primary_transport` / `tunnel2_fallback` API fields, see [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md).

## Common failure modes

### Silent fallback to Z-Tunnel 1.0

Z-Tunnel 2.0 automatically falls back to 1.0 when it cannot establish. Common causes:

- **Split-landing NAT**: multiple NAT IPs for the same device; control and data connections land on different Service Edges.
- **Z-Tunnel 2.0 traffic routed through GRE**: double-encapsulation causes the session to fail.
- **Old ZCC version**: a supported ZCC version is required for Z-Tunnel 2.0. Tenants that upgraded policy before upgrading the ZCC agent continue running on 1.0.

Diagnostic: check whether the ZCC device's egress uses a single NAT IP. Check `ztunnelversion` in ZIA web logs (`ZTUNNEL_1_0` vs `ZTUNNEL_2_0`).

### Bypass mismatch after migration

PAC-based network bypasses from a Z-Tunnel 1.0 profile have **no effect** on Z-Tunnel 2.0 traffic. Tenants who migrate by copying the PAC file without adding entries to Destination Exclusions or VPN Gateway Bypasses will find their internal subnets are tunneled through ZIA when they should be going direct. The symptom is "internal applications broke after ZT2 migration."

### Mobile push notification failures

ZCC on iOS and Android must exclude APNs and FCM endpoints from Z-Tunnel 2.0 tunneling to allow push-notification delivery. See [`../zcc/z-tunnel.md § Mobile push notifications`](../zcc/z-tunnel.md) for the specific bypass entries.

## Cross-links

- GRE tunnels and Z-Tunnel 2.0 coexistence — [`./gre-tunnels.md`](./gre-tunnels.md)
- ZCC forwarding profile configuration and SDK fields — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- Forwarding profile structure (where tunnel version selection lives) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- Traffic forwarding method decision tree — [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md)
- Trusted networks (triggers On-Trusted vs Off-Trusted action branches) — [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md)
