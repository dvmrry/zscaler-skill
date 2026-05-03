---
product: shared
topic: "ipsec-tunnels"
title: "IPSec tunnels — cipher suites, NAT-T, DPD, and ZIA-specific constraints"
content-type: reference
last-verified: "2026-05-03"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/Traffic_Forwarding_in_ZIA_Reference_Architecture.txt"
author-status: draft
---

# IPSec tunnels — cipher suites, NAT-T, DPD, and ZIA-specific constraints

IPSec is a forwarding method for sending site traffic to ZIA Public Service Edges (or Private Service Edges) inside an encrypted tunnel. This reference covers cipher-suite selection, NAT-Traversal mechanics, PFS and DPD recommendations, the per-tunnel bandwidth ceiling, the Virtual Service Edge constraint, and the redundancy requirement Zscaler enforces for production tunnels.

For the forwarding-method decision tree (GRE vs IPSec vs PAC vs ZCC), see [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md). For GRE specifics, see [`./gre-tunnels.md`](./gre-tunnels.md).

## Cipher suites — IKEv1 vs IKEv2

Zscaler recommends using IKEv2 wherever possible. IKEv2 has better performance and fixes vulnerabilities that have been found in IKEv1 (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:856`).

IPSec negotiation operates in two phases (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:862`):

- **Phase 1** — authenticate peers and set up a secure channel for exchange of Phase 2 messages.
- **Phase 2** — negotiate parameters and set up security associations (SA).

Zscaler recommends using pre-shared keys (PSK) with long keys (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:871`). PSK supports up to 255 characters (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1022`), and a tenant can hold up to 16,000 VPN credentials on the platform (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1016`). Two identification methods are supported: FQDN and IP address (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1018`).

### Cipher table

| Setting | IKEv2 Phase 1 | IKEv2 Phase 2 | IKEv1 Phase 1 | IKEv1 Phase 2 |
|---|---|---|---|---|
| Integrity | SHA-256 or SHA-1 | MD5 | SHA-1 | MD5 |
| Confidentiality | AES-256 | NULL | AES-128 | NULL |

Source: `Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:877`.

Phase 2 confidentiality is `NULL` because the ESP payload is already inside an authenticated, integrity-protected channel. This is the rationale Zscaler cites for disabling PFS (see below).

## NAT Traversal (NAT-T)

Zscaler supports IPSec when the originating endpoint is placed behind a NAT device — called NAT Traversal or NAT-T (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:912`).

When NAT-T is enabled, peers detect if a NAT is present in the path during Phase 1 negotiations. They then verify that both peers support NAT-T. If so, they encapsulate the packet inside a new set of NAT-T headers (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:916`).

The encapsulation adds (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:930`):

- A **new IP header** retaining the same tunnel destination but changing the protocol to UDP.
- A **UDP header** with source port 500 and the original IPSec peer's destination port.
- A **NAT-T header** inserted behind the UDP header.

The resulting packet structure is `New IP / UDP / NAT-T / ESP / IP / Data / ESP Trailer / ESP Auth` (Figure 15, `Traffic_Forwarding_in_ZIA_Reference_Architecture.txt`).

Zscaler recommends enabling NAT-T (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:933`).

## Perfect Forward Secrecy (PFS)

PFS is a feature where the SA keys negotiated in Phase 2 are automatically renewed (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:907`).

**Zscaler recommends disabling PFS** as we are using NULL encryption, so there is no reason to refresh the key (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:910`).

## Dead Peer Detection (DPD)

IPSec supports a protocol called Dead Peer Detection (DPD) to assist with failover (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1033`). Instead of waiting for the SA to expire, the systems check periodically for station responses using a HELLO message (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1034`).

DPD is used only when a peer needs to send traffic after the tunnel has been inactive for some time. When the systems are exchanging valid IPSec traffic, there is no need to continue to check that the peer is active (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1043`).

Zscaler recommends enabling DPD on your connections so that any downtime due to a lost connection is minimal (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1047`).

## Per-tunnel bandwidth limit

Each IPSec tunnel to a ZIA Public Service Edge or ZIA Private Service Edge is formed from a single IP address. Each tunnel configured has a maximum throughput of **400 Mbps** (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:945`).

If you need additional throughput from your site, you can add additional IP addresses and tunnels (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:946`).

## Virtual Service Edge does not terminate IPSec

The ZIA Virtual Service Edge does not support termination of IPSec connections. If your organization is using a ZIA Virtual Service Edge, you need to build tunnels using GRE or the Zscaler Client Connector software (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:969`).

See [`./cloud-architecture.md`](./cloud-architecture.md) for the VSE form factor in the broader Service Edge model, and [`./gre-tunnels.md`](./gre-tunnels.md) for the GRE alternative.

## Redundancy and setup

Zscaler **requires** that you configure redundant tunnels to two different data centers. One tunnel will operate in active mode, and another in standby mode (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:983`).

Zscaler **requires** that you build primary and secondary IPSec tunnels from each internet egress point. Additionally, if you have multiple ISPs at a single location, primary and secondary tunnels must be built from each ISP (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:999`).

### Setup sequence

You must first add VPN credentials and select an authentication type. Zscaler supports adding up to 16,000 credentials on the platform (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1016`). Zscaler supports two identification methods: FQDN and IP address (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1018`).

## When to choose IPSec

IPSec is appropriate when (`Traffic_Forwarding_in_ZIA_Reference_Architecture.txt:1055`):

- Encrypted forwarding is mandated by policy or regulation.
- The gateway does not support GRE.
- The gateway does not have a static IP address.

## Cross-links

- GRE tunnels — the unencrypted alternative for fixed sites with static IPs: [`./gre-tunnels.md`](./gre-tunnels.md)
- Forwarding method decision tree: [`../zia/traffic-forwarding-methods.md`](../zia/traffic-forwarding-methods.md)
- Source IP Anchoring (separate from Surrogate IP) and Surrogate IP for fixed-site auth-mapping: [`./source-ip-anchoring.md`](./source-ip-anchoring.md)
- VSE form factor and Service Edge architecture: [`./cloud-architecture.md`](./cloud-architecture.md)
