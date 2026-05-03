---
product: shared
topic: "gre-tunnels"
title: "GRE tunnels — deployment, constraints, and best practices"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/understanding-generic-routing-encapsulation-gre"
  - "vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md"
  - "https://help.zscaler.com/zia/gre-deployment-scenarios"
  - "vendor/zscaler-help/gre-deployment-scenarios.md"
  - "https://help.zscaler.com/zia/best-practices-deploying-gre-tunnels"
  - "vendor/zscaler-help/best-practices-deploying-gre-tunnels.md"
  - "vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt"
author-status: draft
---

# GRE tunnels — deployment, constraints, and best practices

GRE is a statically configured forwarding method for sending internet-bound traffic from a corporate site to ZIA Public Service Edges. It requires no per-user software and no ZCC deployment. This document covers what GRE is in the Zscaler context, when to use it over other forwarding methods, deployment scenarios, key technical constraints, and operational best practices.

For the forwarding method decision tree (GRE vs IPsec vs PAC vs ZCC), see [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md). For how Z-Tunnel 2.0 interacts with GRE, see [`./z-tunnel.md`](./z-tunnel.md).

## What GRE is in the Zscaler context

GRE (Generic Routing Encapsulation, RFC 2784) encapsulates IP packets inside another IP packet with a 4-byte GRE header. A GRE-capable router encapsulates internet-bound traffic and sends it to Zscaler's Public Service Edge VIP. GRE has **no built-in encryption** — it functions like a VPN from a topology standpoint but without the IPsec overhead (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).

Key properties that make GRE appropriate for ZIA:

- **Static forwarding**: the router sends all matched traffic to Zscaler; no per-request proxy negotiation.
- **No ZCC required**: users on the corporate network cannot bypass the service — all internet-bound traffic is unconditionally encapsulated regardless of browser or application (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).
- **Internal IP visibility**: GRE preserves the client's internal IP address. Zscaler uses the inner source IP for policy enforcement, sublocation matching, and logging. Without GRE, NATed traffic shows only the site's public IP (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).
- **Static public IP required**: Zscaler identifies the location by the tunnel's source IP. A dynamic IP breaks the location binding when the IP changes.

## GRE vs IPsec vs Z-Tunnel decision matrix

| Criterion | GRE | IPsec | ZCC + Z-Tunnel 2.0 |
|---|---|---|---|
| Encryption in transit | None | Yes (ESP) | Yes (DTLS/TLS) |
| Per-user software | Not required | Not required | Required (agent) |
| Dynamic IP support | No (static IP required) | Yes (UFQDN credential type) | Yes |
| Max throughput per tunnel | 1 Gbps (non-NAT) / 250 Mbps (NAT) | Lower than GRE (ESP overhead) | Per-device |
| Protocol coverage | All IP (encapsulated at IP layer) | All IP | All ports/protocols (Z-Tunnel 2.0) |
| Primary use case | High-throughput fixed branch | Smaller branch, dynamic IP, or encrypted path required | Mobile/remote users, off-LAN |
| ZIA identity enforcement | Source IP + Surrogate IP | Source IP + Surrogate IP | Per-user (ZCC handles auth) |
| GRE coexistence | Native | Separate tunnels | Avoid routing ZT2 through GRE |

Choose GRE when: the site has a router that supports GRE, the public egress IP is static, throughput needs are ≥500 Mbps, and in-flight encryption is not a compliance requirement. Choose IPsec when the path traverses untrusted networks or the site has a dynamic IP. Use ZCC for users who leave the corporate network (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md; references/zia/traffic-forwarding-methods.md).

## Deployment scenarios

### Scenario 1: Internal router to Public Service Edges (preferred)

Configure two GRE tunnels from a **router behind the firewall** (not the border router) to two Public Service Edges in different data centers (Tier A — vendor/zscaler-help/gre-deployment-scenarios.md):

- Primary tunnel → PSE in data center A.
- Secondary tunnel → PSE in data center B (different city).
- Firewall must allow outbound GRE traffic from the router.
- GRE tunnel source: a **public IP configured on the router's loopback interface**.

This placement provides inner IP visibility to Zscaler — the encapsulated traffic carries real client IPs, enabling sublocation matching and per-user logging.

### Scenario 2: Border router to Public Service Edges (fallback)

Use when internal-router GRE is not feasible. The border router sends internet-bound traffic directly to the PSE. **NAT must be disabled on the firewall** to preserve inner IP visibility. If NAT cannot be disabled, inner IPs are masked and Zscaler sees only the border router's IP — sublocations and per-user logging are degraded (Tier A — vendor/zscaler-help/gre-deployment-scenarios.md).

### Scenario 3: Explicit proxy via GRE (no-default-route environments)

Sites that have no default internet route can use GRE in explicit proxy mode by targeting Zscaler's Global Public Service Edge IPs directly (Tier A — vendor/zscaler-help/gre-deployment-scenarios.md):

```
185.46.212.88 – 185.46.212.93
185.46.212.97 – 185.46.212.98
```

See Zscaler's *About Global Public Service Edges* documentation for the full list and current availability.

### Scenario 4: Virtual Service Edge

GRE tunnels configured against Virtual Service Edges are **dynamically established with no internal IP addresses** — equivalent to unnumbered GRE tunnels. See *About Virtual Service Edges* documentation for provisioning requirements (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).

## Key constraints

### MTU and MSS

GRE adds a **4-byte header** to each packet. Mismatched MTU causes IP fragmentation, which degrades throughput and breaks large-file transfers. Correct calculation for a 1,500-byte WAN interface (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md):

```
WAN Interface MTU  = 1,500
WAN Interface MSS  = 1,500 − IP(20) − TCP(20) = 1,460

GRE MTU            = 1,500 − IP(20) − GRE(4)  = 1,476
GRE MSS            = 1,476 − IP(20) − TCP(20)  = 1,436
```

Set MSS clamping to **1436** on the GRE tunnel interface. The symptom of misconfigured MSS is "browsing works but large file downloads hang or stall."

### Source IP requirement

The tunnel source IP must be **static** and **publicly routable**. Zscaler maps inbound GRE traffic to a location by source IP. Configure the source IP as a `TrafficStaticIP` object in ZIA before provisioning the tunnel. SDK: `client.zia.traffic_static_ip.list_static_ips(query_params={"available_for_gre_tunnel": True})` filters to IPs not yet assigned.

### Throughput per tunnel

| Condition | Max per tunnel |
|---|---|
| Inner endpoint IPs **not NATed** | **1 Gbps** |
| Inner endpoint IPs **NATed** | **250 Mbps** |

The limit arises from Zscaler's load-balancing mechanism: the inner source IP is used to distribute traffic across backend servers. When the inner IP is NATed, all traffic appears to originate from the same IP and cannot be distributed effectively (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).

**Scaling beyond 1 Gbps**: configure additional GRE tunnels with **different public source IPs**. Each additional pair (primary + backup) adds up to 1 Gbps. For 2 Gbps, use 2 primary + 2 backup tunnels from two distinct public IPs. When using multiple source IPs, maintain **client session persistence** at the load-balancer or ECMP layer — a server tracking session state rejects connections arriving from a different egress IP mid-session (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md).

### Health probes

GRE interfaces have **no built-in failure detection**. Two monitoring layers are required (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md):

1. **GRE keepalives** on the tunnel interface — detect tunnel-level failure (interface down, far-end unreachable).
2. **Layer 7 health checks** (Cisco IP SLA, Juniper RPM, or equivalent) — detect service failure beyond the tunnel interface.

Health check target URL:
```
http://gateway.<Zscaler-cloud-name>.net/vpntest
```

**Do not use `www.google.com` or other public sites as health check targets.** Google rate-limits or CAPTCHA-blocks source IPs that repeatedly probe from the same address, affecting all users egressing through that ZIA IP (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md).

### Data center selection constraints

Zscaler's provisioning UI excludes **premium and surcharge data centers** from the VIP picker. Tunnels to these DCs require a Zscaler Support ticket. The SDK's `get_closest_diverse_vip_ids` call auto-selects the geographically closest diverse VIPs from the standard pool (references/zia/traffic-forwarding-methods.md).

### Z-Tunnel 2.0 incompatibility

**Do not route Z-Tunnel 2.0 traffic through GRE tunnels.** Z-Tunnel 2.0 requires a single-IP NAT device; GRE tunnels with ECMP or multiple egress IPs cause Z-Tunnel 2.0's control and data connections to land on different Service Edges, causing 2.0 to fail and fall back to 1.0. For offices with existing GRE, either configure the ZCC forwarding profile to use Z-Tunnel 1.0 when Trusted Network Criteria are met (on-LAN → 1.0), or add a policy-based route that excludes Z-Tunnel 2.0 traffic from the GRE tunnel path (Tier A — vendor/zscaler-help/best-practices-deploying-z-tunnel-2.0.md). See [`./z-tunnel.md § GRE + Z-Tunnel 2.0`](./z-tunnel.md).

## Best practices

### Tunnel provisioning

- Configure **two GRE tunnels per egress location** — one to DC-A, one to DC-B (different city).
- Build primary and backup tunnels from **every internet egress location** and from each ISP in redundant-ISP setups (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md).
- Self-provision via the ZIA Admin Console or submit a Zscaler Support ticket.

### Failover configuration

The failover timing decision is a tradeoff between detection speed and false-positive risk (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md):

| Parameter | Fast Failover | Conservative Failover |
|---|---|---|
| GRE Keepalive | `keepalive 10 3` (30s detect) | `keepalive 30 4` (120s detect) |
| IP SLA Type | ICMP Echo | HTTP Raw |
| IP SLA Frequency | 10 s | 60 s |
| IP SLA Timeout | 2,000 ms | 5,000 ms |
| Track Delay Down | 30 s | 120 s |
| Track Delay Up | 45 s | 180 s |
| Best-Case Failover | 30–32 s | 120–125 s |
| Worst-Case Failover | 40–42 s | 180–185 s |
| False Positive Risk | Higher | Lower |
| Application Layer Test | No (L3 only) | Yes (HTTP service) |

Choose fast failover when app latency-tolerance is low. Choose conservative when router CPU budget is limited or when false positives cause more harm than brief outages.

### Sample Cisco IP SLA config (conservative model)

```
ip sla 1
 http raw http://<Primary PSE IP>
 timeout 5000
 threshold 500
 http-raw-request
  GET http://gateway.<ZscalerCloud>.net/vpntest HTTP/1.0\r\n
  User-Agent: Cisco IP SLA\r\n
  end\r\n
  \r\n
  exit
ip sla schedule 1 life forever start-time now

track 1 ip sla 1
 delay down 120 up 180
```

Tie failover to the track object via policy-based routing or a route-map with `set ip next-hop verify-availability` (Tier A — vendor/zscaler-help/best-practices-deploying-gre-tunnels.md).

### Recommended full-coverage combination

Zscaler's recommended enterprise model is: **GRE + PAC files + Surrogate IP + ZCC**. GRE covers on-network users; PAC + ZCC covers off-network users. Surrogate IP enables identity-based policies for GRE-forwarded traffic (Tier A — vendor/zscaler-help/understanding-generic-routing-encapsulation-gre.md).

## API and SDK surface

GRE tunnel configuration is managed via the ZIA API and SDK. There is no Terraform or SDK surface for the network device configuration (router GRE interface, IP SLA, etc.) — that is router/SD-WAN side and handled through normal network device management.

| Operation | API endpoint | SDK / Terraform |
|---|---|---|
| Tunnel CRUD | `GET/POST/PUT /zia/api/v1/greTunnels` | `client.zia.gre_tunnel` |
| VIP recommendation | `GET /zia/api/v1/vips/recommendedList` | `get_closest_diverse_vip_ids()` |
| VIPs grouped by DC | `GET /zia/api/v1/vips/groupByDatacenter` | — |
| IP-to-tunnel mapping | `GET /zia/api/v1/orgProvisioning/ipGreTunnelInfo` | — |
| Static IP registration | `GET/POST /zia/api/v1/staticIP` | `client.zia.traffic_static_ip` |
| Terraform resource | — | `resource_zia_traffic_forwarding_gre_tunnels` |

Key tunnel object fields: `source_ip` (the registered static IP), `primary_dest_vip` and `secondary_dest_vip` (VIP object references), `within_country` (restrict VIP selection to same country as source), `ip_unnumbered` (SD-WAN unnumbered tunnel mode).

## Cross-links

- Forwarding method comparison (GRE vs IPsec vs PAC vs ZCC) — [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md)
- Z-Tunnel 1.0 vs 2.0 and GRE coexistence — [`./z-tunnel.md`](./z-tunnel.md)
- SSL inspection behavior under transparent (GRE) vs explicit forwarding — [`../zia/ssl-inspection.md § Transparent vs explicit`](../zia/ssl-inspection.md)
- Location and Sublocation model (how GRE source IPs map to policy scope) — [`../zia/locations.md`](../zia/locations.md)
- Cloud architecture (PSE VIPs, data center topology) — [`./cloud-architecture.md`](./cloud-architecture.md)
