---
product: zia
topic: "private-service-edge"
title: "ZIA Private Service Edge — on-prem cluster architecture and deployment"
content-type: reasoning
last-verified: "2026-06-15"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-private-service-edge-internet-saas.md"
  - "vendor/zscaler-help/about-public-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md"
author-status: draft
---

# ZIA Private Service Edge — on-prem cluster architecture and deployment

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`; `vendor/zscaler-help/about-public-service-edges-internet-saas.md`; `vendor/zscaler-help/about-virtual-service-edges-internet-saas.md`.

A Private Service Edge (PSE) extends the Zscaler cloud onto customer premises. Same full inspection stack as a Public Service Edge (Firewall, Sandbox, DLP, IPS), same control-plane connections (CA for auth/policy, cloud routers + Nanolog for logging), but **dedicated to a single organization's traffic and physically inside the customer's DC or DMZ**. Managed by Zscaler Cloud Operations; near-zero customer touch. Subject to Zscaler-initiated updates and maintenance. (Tier A — PSE help doc.)

For the broader Service Edge taxonomy (Public / Private / Virtual form factors, CA connectivity model, data-plane properties), see [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md). This doc covers the on-prem-specific mechanics: when to deploy, cluster design, tiers, per-node IP/hardware budget, IP/NAT constraints, how a cluster binds to a ZIA Location, and the open-proxy deployment risk.

> **Naming caution — "PSE Groups" is a ZPA construct, not ZIA.** ZIA does **not** have a "Private Service Edge Group" admin object or a PSE "provisioning key." A ZIA PSE cluster binds to a single **Location** (Static IP, manual CA-to-cluster mapping via Support) — see the Locations section below. The "Private Service Edge Groups" page and provisioning keys belong to ZPA (`help.zscaler.com/zpa/about-private-service-edge-groups`, body opens "deploying Private Service Edges for Private Access (ZPA) in groups" — `vendor/zscaler-help/about-private-service-edge-groups.md:3`,`:8`). For that product see [`../zpa/private-service-edges.md`](../zpa/private-service-edges.md).

## PSE vs cloud enforcement nodes

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`; `vendor/zscaler-help/about-public-service-edges-internet-saas.md`; `vendor/zscaler-help/about-virtual-service-edges-internet-saas.md`.

| Dimension | Public Service Edge | Private Service Edge | Virtual Service Edge |
|---|---|---|---|
| Location | Zscaler data centers worldwide | Customer DC/DMZ | Customer VM infrastructure |
| Management | Zscaler Cloud Ops | Zscaler Cloud Ops | Customer-managed |
| Tenant isolation | Shared (multi-tenant) | Dedicated (single-tenant) | Dedicated (single-tenant) |
| Traffic routing | Geolocation-based | On-premises direct | Customer-controlled |
| Upgrade control | Zscaler-managed | Zscaler-managed | Auto-upgrade during maintenance windows |
| Throughput ceiling | ~1 Gbps download (shared) | Up to ~24 Gbps (Dedicated LB design) | 600 Mbps per VM |
| IPv6 support | Yes | Yes (unless behind 1:1 NAT) | Yes |

PSE is appropriate when geolocation routing is wrong for the use case (see "When PSE makes sense" below). VSE is appropriate when the organization controls its own virtualization and wants customer-managed software.

## When PSE makes sense

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

Deploy a PSE cluster (rather than relying on Public Service Edges) when one or more of the following apply: (Tier A)

| Trigger | Why PSE |
|---|---|
| Regulatory / geopolitical data residency | Traffic must not leave the customer's DC; cannot traverse shared Zscaler cloud infrastructure |
| Source-IP requirements | Applications enforce IP-based allowlists or geo-IP checks keyed to the organization's own egress IPs |
| High latency to nearest Public SE | PSE inspects inside the network — no transit to a distant Zscaler PoP |
| Localized content delivery | CDN / content licensed to specific egress ranges |
| Throughput >~1 Gbps download / >~2 Gbps total | The Public SE threshold; PSE 5 clusters go to 3.9 Gbps+ |

The Public SE threshold (~1 Gbps download) is the sizing break-point above which a PSE cluster is required. See cluster tiers below.

## Cluster architecture

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

All PSE deployments are **N+1 redundant**. Zscaler will not support a standalone PSE. Minimum two PSEs per cluster, always. (Tier A)

Two node roles in every cluster:

- **Load Balancer (LB) instances** — active-passive pair, coordinated via **CARP** (Common Address Redundancy Protocol) sharing a cluster VIP. All inbound traffic targets the cluster VIP.
- **Service Edge instances** — active-active behind the cluster VIP. The LB distributes traffic across all healthy Service Edges; unhealthy instances are removed from the pool automatically via active health monitoring.

**Direct Server Return (DSR):** response traffic does not traverse the LB on the way back. The Service Edge sends responses directly to the client. Only inbound (client → PSE) traffic passes through the LB. Firewall rules must permit asymmetric return flows: return traffic originates from service-edge IPs, not the cluster VIP. (Tier A)

## Cluster tiers and throughput ceilings

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

Three documented hardware configurations: (Tier A)

| Cluster design | Service Edge nodes | LB nodes | Max download | Max total | Interface |
|---|---|---|---|---|---|
| **PSE 3 — Integrated LB** | 3 | 1 | ~1.2 Gbps | ~2 Gbps | 1GE |
| **PSE 5 — Integrated LB** | 5 | 1 | ~3.9 Gbps | ~5 Gbps | 10GE |
| **PSE 5 — Dedicated LB** | 6 | Up to 4 | >5 Gbps | Up to ~24 Gbps dedicated | 10GE |

Minimum and maximum per cluster:

- PSE 3 and PSE 5 Integrated LB: min 2, max 3 PSEs per cluster.
- PSE 5 Dedicated LB: min 2 PSEs, min 2 dedicated LBs; max 10 PSEs. Each Dedicated LB handles up to 6 Gbps.
- Any deployment requiring >5 Gbps total throughput **must use the Dedicated LB design** and is reviewed by Zscaler Cloud Operations before provisioning.

**Sizing rule of thumb:** upload throughput is assumed at 30% of download when unknown. Example: 1.8 Gbps download → 540 Mbps upload → 2.34 Gbps total → requires at minimum PSE 5 Integrated LB. (Tier A)

## Per-node IP and hardware budget

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

Each PSE node has a fixed per-node IP and switch-port footprint. Budget the public-IP pool and switch capacity from these counts before ordering — and note **SFPs are not shipped with the servers** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:103`). (Tier A)

**PSE 3 / PSE 5 — Integrated LB (per node)** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:78`-`85`):

| Resource (per node) | PSE 3 | PSE 5 |
|---|---|---|
| Service IPs | 3 IPv4 + 3 IPv6 | 5 IPv4 + 5 IPv6 |
| Management IP | 1 | 1 |
| IPMI IP | 1 | 1 |
| Integrated LB IP | 1 IPv4 + 1 IPv6 | 1 IPv4 + 1 IPv6 |
| Cluster VIP | 1 IPv4 + 1 IPv6 | 1 IPv4 + 1 IPv6 |
| Switch ports | 6× 1GE | 2× 10GE, 3× 1GE |

**PSE 5 — Dedicated LB (per node)** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:88`-`97`):

| Resource (per node) | PSE 5 Dedicated LB |
|---|---|
| Service IPs | 6 IPv4 + 6 IPv6 |
| LB IP | 1:1 IPv4/IPv6, up to 4 total |
| MTS IP | 1 |
| Management IP | 1 |
| IPMI IP | 1 |
| Cluster VIP | 1:1 IPv4/IPv6, up to 4 total |
| Switch ports | 3× 1GE, up to 8× 10GE |

Beyond IPs, the customer must supply a gateway address, NTP servers (else Zscaler uses public NTP), DNS servers (else Zscaler uses public DNS), and the install-location address plus contact details (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:101`). All these IPs must be public; the 1:1-NAT / no-IPv6 constraint is covered under IP and NAT requirements below.

## Advanced DLP PSE

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

Customers requiring **Exact Data Match (EDM)** or **Indexed Data Match (IDM)** features get an additional hardware role: the Advanced DLP Private Service Edge. This is separate from the standard PSE instances and dedicated to EDM/IDM index hosting and matching. Deployed alongside a standard PSE cluster, not as a standalone unit. (Tier A — PSE help doc.)

## Virtual Service Edge (VSE)

Source: `vendor/zscaler-help/about-virtual-service-edges-internet-saas.md`; `vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md`.

VSE is the software form factor: a Zscaler OS VM running on customer-operated infrastructure. Platforms supported: VMware ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V, Google Cloud Platform. Same control-plane connections as a physical PSE; same inspection stack. Key differences from hardware PSE: (Tier A — VSE help doc)

- **Customer-managed**: Zscaler Cloud Ops does not access or monitor VSEs. Auto-upgrades run during published maintenance windows without operator or Zscaler intervention.
- **Lower throughput ceiling**: 600 Mbps per VM (ESXi with SSL acceleration card); scale horizontally with multi-VM clusters (up to 16 VMs on ESXi/Hyper-V; native clustering not available on Azure/AWS/GCP — use cloud-native LBs instead).
- Minimum 2 VSE instances for N+1 production redundancy (same principle as PSE clusters).

VSE is the right choice when the organization controls its own virtualization infrastructure and either (a) public-cloud-deployed or (b) prefers not to rack dedicated Zscaler hardware.

**VSE cluster mechanics** (`vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md:10`-`18`): a production VSE deployment is a cluster of at least 2 and at most **16** Virtual Service Edges, and **each VSE in the cluster needs its own VSE subscription**. Each VSE has a bundled load balancer; LBs run **active-passive via CARP** sharing the cluster IP, while all VSE instances are active. Like the hardware PSE, VSEs run **DSR** — requests pass through the LB to the VSE, but the response goes straight from the VSE to the user, skipping the LB on return. A **standalone** (single, no-failover) VSE is supported only for evaluation with test traffic, never for production live-user traffic. The cluster page also surfaces an **IPSec Local Termination** status per cluster (`vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md:31`).

## IP and NAT requirements

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

All PSE IPs — service IPs, LB IPs, cluster VIP — **must be public IP addresses**. For RFC 1918 private-address environments, PSE IPs must have **1:1 static NAT** to a public IP, with one constraint — **IPv6 is not supported in this 1:1 static NAT mode** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:99`). (Tier A)

Firewall must allow outbound to the Zscaler cloud IPs listed at `config.zscaler.com/<Zscaler Cloud Name>/zia-sedge` (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:68`).

## How a ZIA PSE cluster is configured (Location binding)

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

ZIA has **no "PSE Group" admin object and no PSE provisioning key** — those are ZPA constructs (see the naming caution at the top of this doc). A ZIA PSE cluster is brought under policy by binding it to a **Location** in the Admin Console. Adding a location to a PSE cluster enables, per the ZIA PSE help page (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:107`): (Tier A)

- Per-cluster transaction log viewing, categorization, and reports.
- Per-cluster auth settings, IP Surrogacy, XFF consumption, and Location-group settings for SSL inspection and web filtering.
- NAT-environment traffic mapping.

The binding itself is a **Static IP** provisioned in the console (one per cluster) plus a manual CA-to-cluster mapping that only Zscaler Support can complete — the mechanics, sequence, and the open-proxy hazard if you skip it are in the Locations section below (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:113`-`120`). See [`./locations.md`](./locations.md) for the Location primitive itself (forwarding methods, sublocations, XFF, Location Groups).

## Business Continuity Cloud and PSE

When the Business Continuity Cloud activates (during a PSE or ZIA service outage), traffic routes through Zscaler's BC infrastructure. BC Cloud is relevant to PSE operators because PSE outages are one of the triggers. BC Cloud supports only Z-Tunnel 1.0 / PAC / GRE (not Z-Tunnel 2.0), which means a tenant relying on Z-Tunnel 2.0 with a restrictive subcloud loses both during BC activation. (Tier A — `references/shared/subclouds.md`.)

PSE deployments that need to ensure business continuity should also verify their ZCC forwarding profiles include a BC Cloud fallback path.

## Locations and the open-proxy risk

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

Adding a **location** to a PSE cluster in the Admin Console enables per-cluster transaction-log viewing/categorization/reports, per-cluster auth settings, IP Surrogacy, XFF consumption, Location-group settings for SSL inspection and web filtering, and NAT-environment traffic mapping (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:107`-`112`). See [`./locations.md`](./locations.md) for the location primitive itself.

**Load-bearing gotcha — this is where deployments go wrong:**

The CA does **not** automatically link a newly created PSE location to the actual PSE cluster. If a location is added without the manual CA linkage step, the cluster becomes an **open proxy** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:113`). This is a misconfiguration risk, not a software bug, and it is not self-healing. (Tier A)

Correct deployment sequence:

1. Use a **Static IP address provisioned in the Admin Console** for the location. One Static IP per cluster.
2. The public IP must be **owned by the organization** and not otherwise assigned to the PSE cluster.
3. Share all **known traffic forwarding ranges** with Zscaler for allowlisting.
4. **Contact Zscaler Support** — Zscaler configures the location IP and the forwarding-range allowlist on all PSE instances in the cluster. This step cannot be self-served.

Until step 4 completes: any traffic not matching the allowlist is treated as remote-user traffic and forced to authenticate. Expect a service disruption window during the mapping. Follow NOC change protocol if configuring in production.

**Operational rule:** every PSE location add or change requires a Zscaler Support ticket. There is no Admin Console self-service path for the CA-to-cluster mapping. Operators who skip this step or assume the mapping is automatic will create an open proxy.

## SDK and API surface

Source: `vendor/zscaler-sdk-go/zscaler/zia/services/vzen_clusters/vzen_clusters.go`; `vendor/zscaler-sdk-go/zscaler/zia/services/vzen_nodes/vzen_nodes.go`; `vendor/zscaler-sdk-python/zscaler/zia/vzen_clusters.py`; `vendor/zscaler-sdk-python/zscaler/zia/vzen_nodes.py`.

The ZIA management surface for Service Edges is the **Virtual Zscaler Enforcement Node (vZEN)** API — vZEN is the internal name for the **Virtual Service Edge**. Both the Go and Python ZIA SDKs ship full CRUD services for it: (Tier A — SDK service layer)

| Object | Endpoint | Go service | Python service |
|---|---|---|---|
| VSE cluster | `/zia/api/v1/virtualZenClusters` (`vendor/zscaler-sdk-go/zscaler/zia/services/vzen_clusters/vzen_clusters.go:15`) | `vzen_clusters` (Get/GetAll/Create/Update/Delete) | `vzen_clusters.py` (`vendor/zscaler-sdk-python/zscaler/zia/vzen_clusters.py:72`) |
| VSE node | `/zia/api/v1/virtualZenNodes` (`vendor/zscaler-sdk-go/zscaler/zia/services/vzen_nodes/vzen_nodes.go:15`) | `vzen_nodes` | `vzen_nodes.py` (`vendor/zscaler-sdk-python/zscaler/zia/vzen_nodes.py:72`) |

The VSE cluster object carries the `ipSecEnabled` flag (the IPSec-local-termination status seen on the cluster page) and a `virtualZenNodes` member list (`vendor/zscaler-sdk-go/zscaler/zia/services/vzen_clusters/vzen_clusters.go:46`,`:50`).

What is **not** SDK-managed is the **hardware** PSE: there is no `virtualZen*`-equivalent service for PSE 3 / PSE 5 appliance provisioning. A hardware PSE cluster is brought online via the Admin Console plus the Zscaler Support CA-to-cluster Location mapping described above — there is no self-serve API for that step. Operational monitoring is the PSE Health Dashboard, which requires a ZDX subscription (see below).

**Do not conflate with ZPA.** ZPA has its own, separate `ServiceEdgeGroupAPI` (`client.zpa.service_edge_group`) for ZPA Private Service Edges. The two products share the "Service Edge" name but serve different roles:
- **ZIA PSE / VSE (vZEN)** — enforces ZIA policies (URL filtering, DLP, firewall) for internet/SaaS traffic.
- **ZPA Private Service Edge** — brokers ZPA sessions between Zscaler Client Connector and App Connectors for private application access (`vendor/zscaler-help/about-private-service-edges.md:10`,`:12`).

## ZDX dependency — PSE Health Dashboard

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`.

The **ZIA PSE Health Dashboard** is available **only with a ZDX (Zscaler Digital Experience) subscription** (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:24`). A ZIA tenant without ZDX therefore does not get that dashboard. (Tier A)

## Gotchas summary

Source: `vendor/zscaler-help/understanding-private-service-edge-internet-saas.md`; `vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md`.

1. **Minimum two PSEs — no standalone.** Zscaler will not support a one-node cluster. Budget for N+1 from the start.

2. **>5 Gbps requires Dedicated LB and Cloud Ops review.** This is not a capacity you can provision via a ticket alone; Zscaler Cloud Operations reviews the design before deployment begins.

3. **DSR means return traffic does not pass through the LB.** Firewall rules must permit asymmetric return flows. Any stateful firewall between the PSE cluster and clients must be configured to expect return traffic from service-edge IPs, not the cluster VIP.

4. **1:1 NAT disables IPv6 on all PSE IPs.** If IPv6 is a requirement for client connectivity, the PSE cannot be behind NAT.

5. **Location → cluster mapping is manual, not automatic.** See open-proxy risk above. This is the most operationally dangerous step in a PSE deployment.

6. **PSE Health Dashboard requires ZDX.** Plan the monitoring stack accordingly; a PSE cluster without ZDX has no dedicated health dashboard.

7. **Budget the public-IP pool per node, not per cluster.** Each PSE node needs its own block — e.g. a PSE 5 node is 5 service IPs + management + IPMI + integrated-LB IP + cluster VIP, each in both IPv4 and IPv6 (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:78`-`85`). And **SFPs are not shipped with the servers** — order optics separately (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:103`).

8. **A standalone VSE is for evaluation only.** A single, no-failover VSE is supported for test traffic, but never for production live-user traffic — production VSE must be a cluster of 2–16 instances, each with its own VSE subscription (`vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md:10`,`:18`).

> The "PSE Group location → country-based policy" and "old-location-until-new-connection" behaviors that earlier appeared here are **ZPA** Private Service Edge behaviors (`vendor/zscaler-help/about-private-service-edges.md:34`,`:36`), not ZIA — they live in [`../zpa/private-service-edges.md`](../zpa/private-service-edges.md).

## Cross-links

- Service Edge taxonomy and CA connectivity model — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- PSE deployments bind to Locations; location primitives (forwarding methods, sublocations, XFF, Location Groups) — [`./locations.md`](./locations.md)
- Source IP Anchoring (SIPA) — the forwarding-control mechanism that routes traffic out through a specific egress IP, works with physical PSE — [`./forwarding-control.md`](./forwarding-control.md)
- Log correlation and when to query ZIA logs — [`../shared/log-correlation.md`](../shared/log-correlation.md)
- Subclouds — restricting which Service Edges handle tenant traffic — [`../shared/subclouds.md`](../shared/subclouds.md)
- ZPA Private Service Edges (different product, similar name) — [`../zpa/private-service-edges.md`](../zpa/private-service-edges.md)

## Open questions

- **Does shared / overloaded (PAT) NAT break a PSE, or only forfeit IPv6?** The ZIA source states PSE IPs "must have 1:1 static NAT to a public IP" with IPv6 unsupported in that mode (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:99`), but does not explicitly say a shared/overloaded NAT mapping is rejected. An earlier draft asserted shared/overloaded NAT is "not supported" — that stronger claim is not in the captured source and was removed pending confirmation.
- **What monitoring does a ZIA-only (no-ZDX) tenant actually get for PSE health?** The source confirms the PSE Health Dashboard requires ZDX (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:24`) but does not describe the fallback. An earlier draft claimed monitoring "falls back to Zscaler Cloud Ops telemetry and the standard Admin Console (no dedicated PSE health view)" — unbacked by the captured pages and removed.
- **Is there an SDK/API surface for hardware PSE (PSE 3 / PSE 5) provisioning?** The ZIA SDKs ship `vzen_clusters` / `vzen_nodes` for the Virtual Service Edge, but no equivalent service was found for hardware-appliance provisioning in the captured SDK source — consistent with the Support-ticket Location-binding path, but worth re-checking against a newer SDK release before treating "no API" as permanent.

These three PSE questions are tracked together as `zia-62` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-62-pse-shared-nat-rejection-zia-only-health-monitoring-hardware-pse-api).
