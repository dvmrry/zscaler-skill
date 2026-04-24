---
product: zcc
topic: "zcc-z-tunnel"
title: "Z-Tunnel 1.0 vs 2.0 — architecture, deployment, and bypass semantics"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zscaler-client-connector/about-z-tunnel-1.0-z-tunnel-2.0"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/best-practices-deploying-z-tunnel-2.0"
  - "vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/best-practices-adding-bypasses-z-tunnel-2.0"
  - "vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md"
  - "https://help.zscaler.com/zscaler-client-connector/migrating-z-tunnel-1.0-z-tunnel-2.0"
  - "vendor/zscaler-help/migrating-z-tunnel-1.0-z-tunnel-2.0.md"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py"
author-status: draft
---

# Z-Tunnel 1.0 vs 2.0 — architecture, deployment, and bypass semantics

The **tunnel** between Zscaler Client Connector and the Public Service Edge. Choice of 1.0 vs 2.0 is made per-forwarding-profile (per-network-type) and has structural consequences: Z-Tunnel 1.0 is a HTTP CONNECT-based proxy (web traffic only); Z-Tunnel 2.0 is a DTLS/TLS packet tunnel (all ports and protocols). Questions about transport failures, bypass behavior, or "why did this specific traffic not tunnel" almost always land here.

## Summary

Two very different tunneling architectures:

| Dimension | Z-Tunnel 1.0 | Z-Tunnel 2.0 |
|---|---|---|
| Transport model | HTTP CONNECT-request-based proxy | DTLS or TLS packet tunnel |
| Scope of traffic carried | Proxy-aware traffic, or port 80/443 only | **All ports and protocols** |
| Driver requirement | Packet Filter driver | Packet Filter driver |
| Fallback behavior | N/A (the fallback target) | Falls back to 1.0 on tunnel failure |
| Primary use case today | Legacy tenants, GRE-adjacent offices, specific-PAC-routed traffic | Default for new deployments |
| Bypass location | App-profile PAC | **VPN Gateway Bypasses + Destination Exclusions/Inclusions + Port-based + Domain-based (PAC)** — fundamentally different |

Z-Tunnel 2.0 requires a **single-IP NAT** — all connections from one device must egress through the same NAT IP. Otherwise control and data connections can land on different Public Service Edges, Z-Tunnel 2.0 fails to establish, and falls back to Z-Tunnel 1.0 silently. This is the #1 misconfiguration when a tenant reports "we deployed 2.0 but users keep running on 1.0."

## Mechanics

### Z-Tunnel 1.0 architecture

From the *About Z-Tunnel 1.0 & Z-Tunnel 2.0* help article:

> Z-Tunnel 1.0 forwards traffic to the Zscaler cloud via CONNECT requests, much like a traditional proxy. Z-Tunnel 1.0 sends all proxy-aware traffic or port 80/443 traffic to the Zscaler service, depending on the forwarding profile configuration.

Key implications:

- **HTTP/HTTPS only** (proxy-aware + 80/443). UDP, non-web TCP, ICMP, etc. are not carried by 1.0 — they either pass direct or are blocked at the local firewall, depending on policy.
- A CONNECT-based tunnel is compatible with enterprise network-layer proxies and appliances that understand HTTP proxies. Easier to thread through existing infrastructure.
- Not suitable for applications that use non-standard ports or protocols (many SaaS desktop clients, voice apps, some gaming traffic). Those get bypassed if not explicitly covered.

### Z-Tunnel 2.0 architecture

> Z-Tunnel 2.0 has a tunneling architecture that uses DTLS or TLS to send packets to the Zscaler service. Because of this, Z-Tunnel 2.0 is capable of sending all ports and protocols.

- **DTLS primary, TLS fallback** (the `allow_tls_fallback` flag on forwarding profile actions controls this — see [`./forwarding-profile.md § ForwardingProfileActions`](./forwarding-profile.md)).
- Packet-level tunnel carries **all** IP protocols — UDP, non-standard TCP ports, ICMP, etc. The whole endpoint's traffic can be covered.
- Requires NAT with single egress IP per device (strict requirement, not a soft recommendation).
- **Do not route Z-Tunnel 2.0 through GRE tunnels.** Double-encapsulation causes performance issues. Workarounds: (a) configure the forwarding profile to fall back to Z-Tunnel 1.0 when Trusted Network Criteria are met (keeping the corporate-LAN flow on the simpler 1.0), or (b) add a policy-based route on the upstream router that excludes Z-Tunnel 2.0 traffic from the GRE tunnel.

### Configuring which tunnel applies

In the forwarding profile's per-network-type action (see [`./forwarding-profile.md`](./forwarding-profile.md)):

- **Tunnel Driver Type**: Packet Filter-Based (required for 2.0).
- **Network-type action**: Tunnel.
- **Tunnel Version**: explicit selection of 1.0 or 2.0.

These map to the SDK's `ForwardingProfileActions` object: `primary_transport` controls the transport preference (ZTUNNEL = 2.0, others likely DTLS / TLS markers for 1.0), `enable_packet_tunnel` toggles the packet-tunnel capability, and `tunnel2_fallback` configures the fallback behavior when 2.0 fails. See [`clarification zcc-04`](../_clarifications.md#zcc-04-forwarding-profile-primary_transport-enum) for the enum string specifics — first tenant snapshot will surface the observed values.

The typical best-practice config (from the 5-phase deployment guide): set all three network-type branches (On-Trusted Network, VPN-Trusted Network, Off-Trusted Network) to "Same as On-Trusted Network" during initial testing; diversify per branch only after a 1-2 week observation window.

### Bypass semantics — the biggest gotcha

**Z-Tunnel 1.0 and Z-Tunnel 2.0 use fundamentally different bypass architectures.** A tenant migrating 1.0 → 2.0 who keeps the old app-profile PAC bypasses gets broken behavior: 1.0-style PAC bypasses don't work for 2.0.

For Z-Tunnel 2.0, bypasses live in **four distinct places**, in order of evaluation precedence:

#### 1. VPN Gateway Bypasses (highest priority)

Field: "Hostname or IP Address Bypass for VPN Gateway" on the App Profile.

- Accepts IPs, subnets, or FQDNs.
- When configured, the endpoint's kernel filter **ignores matching traffic entirely** — it never reaches ZCC's processing pipeline. Maximum-speed bypass.
- FQDN entries are DNS-resolved by ZCC at bypass-evaluation time, adding DNS-resolution steps. A hostname with volatile IPs (CDN, CGN) creates ongoing DNS-resolution churn.
- **Highest priority over all other bypass types.** If an IP is in VPN Gateway Bypasses and also in Destination Exclusions, VPN Gateway wins.

#### 2. Destination Exclusions and Inclusions (subnet-based)

Fields: "Destination Exclusions" and "Destination Inclusions" on the App Profile.

Two common patterns:

- **Allowlist mode** (exclude everything, include specific): `0.0.0.0/0` in Destination Exclusions + specific subnets in Destination Inclusions. Only listed subnets go through Z-Tunnel 2.0; everything else is direct.
- **Denylist mode** (include everything, exclude specific): `0.0.0.0/0` in Destination Inclusions + specific subnets in Destination Exclusions. All traffic goes through Z-Tunnel 2.0 except the listed subnets.

**Conflict resolution rules (critical):**

1. **More-specific netmask wins.** `10.0.0.0/24` beats `10.0.0.0/16`.
2. **Same netmask → more fields wins.** `10.0.0.0/8:443:tcp` beats `10.0.0.0/8:443` beats `10.0.0.0/8`. Port, port range, and protocol all count as fields.
3. **Identical rules → Inclusions win.** If a rule is in both Exclusions and Inclusions with the same specificity, the Inclusion is honored.

This is a specificity-wins pattern, parallel to URL Filtering's cross-category specificity rule ([`../zia/url-filtering.md § The specificity rule`](../zia/url-filtering.md)) and ZPA's segment specificity ([`../zpa/app-segments.md`](../zpa/app-segments.md)). **Specificity-wins is the recurring Zscaler pattern.**

#### 3. Port-based bypasses (Windows and macOS only)

Syntax: append port to a Destination Exclusions entry — `192.168.1.0/24:80` bypasses port 80 for that subnet only. Port ranges: `192.168.1.0/24:80-85`. **Not supported on Linux, iOS, or Android.** A tenant relying on port-based bypasses on mixed-OS fleets needs a fallback plan for non-Windows/macOS devices.

#### 4. Domain-based bypasses (PAC-based)

Needed because domain-name apps (CDN-fronted SaaS like `*.salesforce.com`) can't be expressed as a single IP subnet for Destination Exclusions. Two mechanisms depending on ZCC version:

**ZCC 3.7 and earlier (Windows)** — dual PAC:

- Forwarding profile PAC: returns `PROXY ${ZAPP_TUNNEL2_BYPASS}` for the bypassed domain (routes it through the bypass path instead of 2.0).
- App profile PAC: returns `DIRECT` for the same domain.
- Wildcard syntax in `dnsDomainIs()` uses **leading period** (`.domain.com`) — same convention as URL Filtering. `shExpMatch(host, "*.domain.com")` also supported but distinct function.

**ZCC 3.8+ (Windows)** — forwarding-profile options:

- **Redirect Web Traffic to Zscaler Client Connector Listening Proxy** — TCP 80/443 traffic goes through ZCC's local listening proxy; other ports/protocols go direct to 2.0. The bypass rules in the app-profile PAC apply to the listening proxy's traffic — no forwarding-profile PAC needed.
- **Use Z-Tunnel 2.0 for Proxied Web Traffic** — web traffic arriving at the listening proxy is tunneled via 2.0 protocol. **Only applies to the PAC's default return statement**; traffic matching a specific PAC statement that routes to a particular Service Edge silently uses Z-Tunnel 1.0. This is the subtle interaction that the PAC author needs to know about.

Truth table for the two 3.8+ flags, from the Bypasses article:

| `Redirect Web Traffic to ZCC Listening Proxy` | `Use Z-Tunnel 2.0 for Proxied Web Traffic` | Web traffic | Non-web traffic |
|---|---|---|---|
| Enabled | Disabled | Forwarded to listening proxy, tunneled via **Z-Tunnel 1.0** | Z-Tunnel 2.0 |
| Disabled | Enabled | System-proxy-aware: via listening proxy → Z-Tunnel 2.0. No system proxy: direct to Z-Tunnel 2.0 | Z-Tunnel 2.0 |
| Enabled | Enabled | Forwarded to listening proxy, tunneled via **Z-Tunnel 2.0** | Z-Tunnel 2.0 |

This truth table **partially resolves [`clarification zcc-05`](../_clarifications.md#zcc-05-forwarding-profile-system-proxy-precedence)** for the `redirectWebTraffic` / `useTunnel2ForProxiedWebTraffic` interaction. The broader `systemProxyData` precedence question (OS-level proxy settings vs native forwarding actions) is a related but separate concern.

### Migration and fallback behavior

From the Migration article:

- **Tunnel mode and driver are per-forwarding-profile.** Tenants can run Z-Tunnel 1.0 and 2.0 simultaneously by maintaining two forwarding profiles scoped to different user/device groups.
- **Z-Tunnel 2.0 → 1.0 fallback is automatic.** When 2.0 can't establish (single-IP NAT failure, Service Edge split-landing, etc.), ZCC falls back to 1.0 on the same connection attempt. `tunnel2_fallback` on the `ForwardingProfileActions` controls whether fallback is allowed at all.
- **Phased rollout pattern** (recommended by Zscaler): (1) create test group + test forwarding profile + test app profile; (2) block ICMP as a baseline test for 2.0 covering non-web traffic; (3) exclude internal network ranges via Destination Exclusions; (4) 1-2 weeks observation; (5) batch rollout in 100-200-user increments.

### 5-Phase deployment checklist

Codified from the Deployment Best Practices article for quick reference in skill answers:

| Phase | Step |
|---|---|
| 1 | Create a test user group (synced between ZIA User Management and ZCC Directory Sync) |
| 1 | Create a new forwarding profile — `Tunnel Driver Type: Packet Filter-Based`, `On-Trusted Network: Tunnel`, `Tunnel Version: Z-Tunnel 2.0`, VPN-Trusted and Off-Trusted set to "Same as On-Trusted" |
| 1 | Create a new app profile — `Rule Order: 1`, enable `Install Zscaler SSL Certificate`, link to the test forwarding profile, scope to the test user group |
| 1 | Assign a supported ZCC version to the test users via App Store app-update config |
| 2 | Initial ICMP test — ping baseline, create firewall rule to block ICMP, verify block |
| 3 | Exclude internal network ranges via IPv4/IPv6 Exclusion list on app profile |
| 4 | 1-2 week observation window — top business-application testing |
| 5 | Batch rollout in 100-200-user increments, with business-app verification per batch |

## Edge cases

- **Z-Tunnel 2.0 silently falls back to 1.0 under split-landing NAT.** Tenants see "we deployed 2.0" dashboards but traffic stays on 1.0. First diagnostic: confirm single-IP NAT via `trusted_egress_ips` observation and compare against actual connection IPs in the Service Edge logs.
- **GRE + Z-Tunnel 2.0 = performance pain.** The help-site guidance is explicit. Offices with existing GRE should either stay on 1.0 for on-LAN users (via Trusted Network branch) or add a policy-based route to exclude 2.0.
- **Application bypass (process-based) is distinct from network bypass.** The "Application Bypass" feature (see `About Application Bypass`, `Adding IP-Based Applications to Bypass Traffic`, `Adding Process-Based Applications to Bypass Traffic`) matches specific process names / executables and bypasses them regardless of Destination Exclusions config. A tenant reporting "this specific app bypasses Zscaler but the destination should be tunneled" often has a process-based bypass in effect. Not yet written up as a dedicated doc — gap in current coverage.
- **Z-Tunnel 1.0 is still in use even on 2.0-enabled tenants.** Specific PAC statements that route to a particular Service Edge, `Redirect Web Traffic to ZCC Listening Proxy` with the 2.0-for-proxied-web toggle off, and traffic that doesn't match any 2.0 rule all use 1.0 on a 2.0-configured profile. "We're fully on 2.0" is almost never literally true.
- **Packet filter driver is required for both** — Tunnel Driver Type selection of anything else (e.g. Route-Based on some legacy configs) disables Z-Tunnel 2.0 capability.
- **Protocol internals are not fully documented.** The Zscaler help site describes what Z-Tunnel 2.0 does (DTLS/TLS, packet-level) but not the wire-format internals (framing, reconnection, keepalive mechanics). Wireshark captures against a Public Service Edge are the only way to inspect lower-level behavior — Zscaler Support engagements cover the protocol's exact shape under NDA.

## Open questions

- Wire-format protocol details (framing, keepalive, session resumption) — not customer-documented. Zscaler Support / SE engagement territory.
- Exact Service-Edge-side behavior on split-landing (does the control connection stay up while data reroutes, or does the whole session tear down?) — not documented.
- Z-Tunnel 2.0 behavior under IPv6-only networks — the SDK has IPv6-specific flags (`drop_ipv6_traffic`, `drop_ipv6_traffic_in_ipv6_network`, `drop_ipv6_include_traffic_in_t2`) but the help-site docs focus on IPv4. Worth a tenant-specific lab if IPv6 is an operational concern.

## Cross-links

- Forwarding Profile (where Z-Tunnel selection lives) — [`./forwarding-profile.md`](./forwarding-profile.md)
- Web Policy / App Profile (where bypass lists live) — [`./web-policy.md`](./web-policy.md)
- Trusted Networks (triggers On-Trusted vs Off-Trusted action branches) — [`./trusted-networks.md`](./trusted-networks.md)
- ZIA SSL Inspection (HTTP/2 inspection interaction — HTTP/2 in Bandwidth-Control-enabled locations falls back to HTTP/1.1 regardless of tunnel mode) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- URL wildcard semantics (leading-period syntax shared between PAC `dnsDomainIs` and URL Filter entries) — [`../zia/wildcard-semantics.md`](../zia/wildcard-semantics.md)
