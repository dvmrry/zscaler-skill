# Understanding Private Service Edge for Internet & SaaS

**Source:** https://help.zscaler.com/zia/understanding-private-service-edge-internet-saas
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — Service Edges — Private Service Edge — Understanding Private Service Edge for Internet & SaaS

**ZIA Private Service Edge** extends the Zscaler cloud architecture onto customer premises. Same functional service as a Public Service Edge (Firewall, Sandbox, DLP), communicates with the same Zscaler cloud components (CA for auth/policy, cloud routers + Nanolog for logging), but **dedicated to the organization's traffic and physically inside the organization's DC or DMZ**.

Managed by Zscaler Cloud Operations with near-zero customer touch, but still **subject to Zscaler-initiated updates/changes**. Subject to *Terms and Conditions: Private Service Edge for Internet & SaaS*.

## Use Cases

- Geopolitical / regulatory requirements (traffic must not leave the organization's DC).
- Applications requiring the organization's IP address as source IP.
- Locations with high Public-Service-Edge latency.
- Localized-content needs.
- Throughput above ~1 Gbps download / 2 Gbps total.

**Advanced DLP Private Service Edges** are a complementary hardware role for customers who also need Advanced DLP features (Exact Data Match, Indexed Data Match).

**Monitoring:** ZIA PSE Health Dashboard available only with a ZDX subscription.

## Cluster Architecture

All ZIA PSE cluster designs are **N+1 redundant**; minimum **2 PSEs per cluster** — Zscaler does not support standalone deployments.

Two components: **Service Edge instances** (traffic processing) and **Zscaler load balancers (LBs)**.

- LB instances: **active-passive** with **CARP** shared VIP.
- Service Edge instances: **active-active** behind the cluster VIP; automatic removal from LB pool via active health monitoring.
- All traffic destined for the cluster must target the cluster VIP.
- **Direct Server Return (DSR)** load balancing — response **does not traverse the LB on return**. Service Edge sends response directly to user.

## Cluster Designs and Throughput

| Cluster Design | Service Edge Instances | LB Instances | Max Upload per Cluster | Max Total Throughput (indicative) | Interface |
|---|---|---|---|---|---|
| Private Service Edge 3 with Integrated LB | 3 | 1 | 800 Mbps | ~1.2 Gbps download / 2 Gbps total | 1GE |
| Private Service Edge 5 with Integrated LB | 5 | 1 | 2.5 Gbps | ~3.9 Gbps download / 5 Gbps total | 10GE |
| Private Service Edge 5 with Dedicated LB | 6 | Up to 4 (6 Gbps per LB instance) | Up to 24 Gbps (dedicated) | >5 Gbps (requires this model) | 10GE |

- Max PSE per cluster: 3 (for PSE 3 or PSE 5 Integrated LB) or 10 (for PSE 5 Dedicated LB).
- Min 2 PSEs per cluster always.
- Dedicated LB deployments require minimum 2 Dedicated LBs.

### Sizing assumption

Upload throughput assumed at **30% of download** when upload is unknown. Sizing example: 1.8 Gbps download → 540 Mbps upload → 2.34 Gbps total → 2× PSE 5.

For >5 Gbps total throughput, Dedicated LB design is **required** and deployment reviewed by Zscaler Cloud Operations.

### Form factors

- Hardware PSE (dedicated appliance) — sizes above.
- Virtual Service Edge (VSE) — runs on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V, Google Cloud Platform. See *About Virtual Service Edge for Internet & SaaS*.

## Network and IP Requirements

PSE communicates with Zscaler cloud:

- CA (auth + policy)
- Cloud routers + Nanolog (logs)
- Zscaler Cloud Operations (monitoring/maintenance/updates)

Firewall must allow Zscaler cloud IPs listed at `config.zscaler.com/<Zscaler Cloud Name>/zia-sedge`.

Deployment options:

- Inside the DMZ
- Outside the corporate firewall
- Behind the network firewall

### PSE 3 / PSE 5 (Integrated LB) — per node

| | PSE 3 | PSE 5 |
|---|---|---|
| Service IPs | 3 IPv4 + 3 IPv6 per node | 5 IPv4 + 5 IPv6 per node |
| Management IP | 1 | 1 |
| IPMI IP | 1 | 1 |
| Integrated LB IP | 1 IPv4 + 1 IPv6 per node | 1 IPv4 + 1 IPv6 per node |
| Cluster VIP | 1 IPv4 + 1 IPv6 per node | 1 IPv4 + 1 IPv6 per node |
| Switch Ports | 6× 1GE | 2× 10GE, 3× 1GE |

### PSE 5 Dedicated LB — per node

| | PSE 5 Dedicated LB |
|---|---|
| Service IPs | 6 IPv4 + 6 IPv6 per node |
| LB IP | 1:1 IPv4/IPv6, up to 4 total |
| MTS IP | 1 |
| Management IP | 1 |
| IPMI IP | 1 |
| Cluster VIP | 1:1 IPv4/IPv6, up to 4 total |
| Switch Ports | 3× 1GE, up to 8× 10GE |

**All IPs must be public.** For RFC 1918 + NAT: PSE IPs must have 1:1 static NAT to a public IP (**IPv6 not supported in this deployment mode**).

Customer must provide gateway address, NTP servers (else Zscaler uses public NTP), DNS servers (else Zscaler uses public DNS), install-location address + contact details.

SFPs are **not shipped** with servers.

## Locations for Private Service Edges

Adding a "location" to a PSE cluster in the Admin Console enables:

- Per-cluster transaction log viewing/categorization/reports
- Per-cluster auth settings, IP Surrogacy, XFF consumption, Location group settings for SSL inspection & web filtering
- NAT-environment traffic mapping

**Open-proxy warning:** The CA does not automatically link a newly created PSE location to your actual PSE cluster. If you add a location, follow these best practices to avoid the cluster becoming an open proxy:

1. Use a Static IP address provisioned in the Admin Console for the location; one Static IP per cluster.
2. The public IP must be **owned by your organization** and not otherwise assigned to the PSE cluster.
3. Share your known traffic forwarding ranges with Zscaler for allowlisting.
4. **Contact Zscaler Support** to map the location to the PSE; Zscaler configures the location IP and your allowlist on all PSE instances for that cluster.

Any traffic not from your allowlist is treated as remote-user traffic and **forced to authenticate**. Expect service disruption during mapping — follow NOC change protocol if in production.
