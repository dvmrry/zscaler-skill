# Understanding Generic Routing Encapsulation (GRE)

**Source:** https://help.zscaler.com/zia/understanding-generic-routing-encapsulation-gre
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — GRE — Understanding Generic Routing Encapsulation (GRE)

## GRE Tunnel Overview

A Generic Routing Encapsulation (GRE) tunnel is ideal for forwarding internet-bound traffic from your corporate network to the Zscaler service. GRE is a tunneling protocol for encapsulating packets inside a transport protocol; a GRE-capable router encapsulates a payload packet inside a GRE packet, then encapsulates the GRE packet in a transport protocol such as IP.

**A GRE tunnel functions like a VPN but without encryption** — transports packets between endpoints through the public network.

GRE tunnels typically use **keepalive packets** to determine if a tunnel is up. The source creates keepalive request/response packets, encapsulates them, and sends them to the tunnel destination. The destination decapsulates and sends the inner response back. See RFC 2784.

## Benefits of GRE Tunneling (Zscaler's framing)

If your corporate router supports GRE and its egress port has a static IP, Zscaler recommends GRE tunneling to forward internet traffic to the Zscaler service:

- Supports internet traffic.
- Supports failover if the primary Public Service Edge becomes unavailable.
- Minimal overhead.
- No configuration required on user computers/laptops.
- Users on the corporate network cannot bypass the service.
- Provides internal IP address information to Zscaler — useful for policy enforcement and source IP logging.

## Best-Practice Forwarding Combination

Zscaler recommends a **combination** of: GRE tunneling + PAC files + Surrogate IP + Zscaler Client Connector.

- Configure **two GRE tunnels from an internal router behind the firewall** to provide visibility into internal IP addresses (used for policy enforcement and source-IP logging).
- Deploy **IP SLA** (or equivalent) to monitor tunnel health and enable fast failover.
- Install a **PAC file for each user** to ensure coverage outside the corporate network.

## Supported Bandwidth per GRE Tunnel

| Condition | Max supported bandwidth |
|---|---|
| Internal tunnel endpoint IPs **not NATed** | **1 Gbps** per tunnel |
| Internal tunnel endpoint IPs **NATed** | **250 Mbps** per tunnel |

**Why:** Zscaler uses the internal IP addresses of the GRE tunnel to **load-balance GRE traffic across multiple servers**. If the internal source IP is identical for all traffic across multiple GRE tunnels, the load-balancer can't effectively distribute traffic across nodes — bottleneck.

**Scaling guidance:** for more than 1 Gbps, configure more GRE tunnels with **different public source IP addresses**. Example: 2 Gbps = 2 primary + 2 backup tunnels; 3 Gbps = 3 primary + 3 backup.

**Why 1 Gbps per tunnel:** significant internet infrastructure uses 1 Gbps links; multilink technologies (LACP) still rely on aggregating multiple 1 Gbps interfaces; >1 Gbps from a single source IP hits infrastructure bottlenecks.

## Virtual Service Edge Special Case

GRE tunnels configured on Virtual Service Edges are **dynamically established with no internal IP addresses**, similar to unnumbered GRE tunnels. See *About Virtual Service Edges* and *Forwarding Traffic to Virtual Service Edges*.
