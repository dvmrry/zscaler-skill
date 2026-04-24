# About Virtual Service Edges for Internet & SaaS

**Source:** https://help.zscaler.com/zia/about-virtual-service-edges-internet-saas
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — Service Edges — Virtual Service Edge — About Virtual Service Edges for Internet & SaaS

New/clean deployment requires a VM image running Zscaler OS version 24.

## Positioning vs Public / Private Service Edge

Virtual Service Edge (VSE) is the third Service Edge form factor. It uses a **customer-operated VM** to run a full-featured Public Service Edge dedicated to the organization's traffic. Same service coverage (Firewall, Sandbox, DLP) as the Zscaler-cloud Public Service Edge.

**Customer ownership model:** VSEs are **managed by the customer**, not Zscaler Cloud Operations. Zscaler does not require access to them. Auto-upgrades happen during scheduled maintenance windows without customer intervention.

**Source IP Anchoring is NOT supported with Virtual Service Edges.**

## Use Cases

Same as Private Service Edge:
- Geopolitical / regulatory (traffic stays on-prem).
- High-latency regions far from a Public Service Edge.
- Apps that require the organization's IP as source IP.
- Localized-content requirements.

## Sizing and Spec

| | VMware ESXi 6.0+ | Microsoft Azure | AWS EC2 | Microsoft Hyper-V | GCP |
|---|---|---|---|---|---|
| Public Service Edge instances per VM | 1 | 1 | 1 | 1 | 1 |
| Load Balancers per VM | 1 | 1 | 1 | 1 | — |
| Max VMs per Cluster | 16 | — | — | 16 | — |
| vMotion Support | VMware ESXi 7.0+ | — | — | — | — |
| V-CPUs | 4 | 4 | 4 | 4 | 4 |
| Min memory (standalone) | 32 GB | 32 GB | 32 GB | 32 GB | 32 GB |
| Min memory (cluster) | 48 GB | — | — | 48 GB | — |
| Recommended memory | 48 GB | 48 GB | 48 GB | 48 GB | 48 GB |
| Virtual interfaces | 3 | 3 | 3 | 3 | 3 |
| SSL acceleration card | 1× Marvell NITROX CNN3510-500-C5-NHB-2.0-G | — | — | — | — |
| Disk space | 500 GB | 500 GB | 500 GB | 500 GB | 500 GB |
| Total throughput | 600 Mbps | — | — | — | — |
| SSL CPS with acceleration card | 3,500 | — | — | — | — |
| SSL CPS without acceleration card | 400 | 400 | 400 | 400 | 400 |

Single-size VM per instance — scale horizontally for more throughput.

**SSL acceleration card** (Marvell NITROX, sold separately) recommended when doing SSL inspection at >100 Mbps.

### Clustering

- Recommended: **at least 2 VSE instances** for N+1 redundancy in production.
- VMware ESXi and Hyper-V: in-built load balancer for cluster mode; External Load Balancer optional.
- Public cloud (Azure, AWS, Hyper-V, GCP): **native cluster mode not supported**; use public cloud load balancers for VSE redundancy.

## Firewall / Connectivity Requirements

- Outbound connections listed at `config.zscaler.com/<Zscaler Cloud Name>/zia-v-sedge`.
- Allow access to/from IPs on `config.zscaler.com/<Zscaler Cloud Name>/hubs`.

## Maintenance

Zscaler automatically upgrades VSEs during scheduled maintenance windows published in the Zscaler Trust Portal. **No admin or Zscaler Cloud Ops intervention required.** VSEs are **not monitored or managed by Zscaler Cloud Operations**.

## Hardening

VSE VM is a **"jailed environment"** — limited commands, hardened OS with unnecessary packages/libraries removed. Zscaler hardens the TCP stack, tracks disclosed CVEs, auto-downloads and applies patches.

Access limited to:
- VMware / Azure web console / Hyper-V Manager console view
- Management interface for SSH access

**Audit log at `/var/log/auth.log`** captures authentication attempts and commands run on the appliance. Customer should monitor this for unauthorized activity.

## Policy Model

VSEs are part of the Zscaler cloud:
- Admins define policies once via the Zscaler Admin Console.
- After user sign-in and authentication, the service applies the user's policies whether they connect to a VSE, a Private Service Edge, or a Public Service Edge anywhere in the world.
- Logs transmit to and store on the Zscaler cloud as central repository for analytics.

## Form Factor Comparison

| | Public Service Edge | Private Service Edge | Virtual Service Edge |
|---|---|---|---|
| Operator | Zscaler | Zscaler Cloud Ops (on customer premise) | Customer |
| Throughput ceiling | Per Zscaler cloud capacity | Up to ~24 Gbps (PSE 5 Dedicated LB) | 600 Mbps per VM; scale via multi-VM clusters |
| Hardware | Zscaler data centers | Dedicated Zscaler-shipped hardware (PSE 3, PSE 5) | Customer-owned VM (ESXi/Hyper-V/AWS/Azure/GCP) |
| Customer access | None | None (monitor via ZDX) | Full customer access |
| Zscaler access | Full | Full (Cloud Ops manages) | Not required |
| Maintenance | Zscaler | Zscaler Cloud Ops | Auto-upgrade during maintenance windows |
| Source IP Anchoring | Yes | Yes | **No** |
