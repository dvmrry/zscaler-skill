---
product: zia
topic: "private-service-edge"
title: "ZIA Private Service Edge — on-prem cluster architecture and deployment"
content-type: reasoning
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-private-service-edge-internet-saas.md"
  - "vendor/zscaler-help/about-public-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-private-service-edges.md"
  - "vendor/zscaler-help/about-private-service-edge-groups.md"
author-status: draft
---

# ZIA Private Service Edge — on-prem cluster architecture and deployment

A Private Service Edge (PSE) extends the Zscaler cloud onto customer premises. Same full inspection stack as a Public Service Edge (Firewall, Sandbox, DLP, IPS), same control-plane connections (CA for auth/policy, cloud routers + Nanolog for logging), but **dedicated to a single organization's traffic and physically inside the customer's DC or DMZ**. Managed by Zscaler Cloud Operations; near-zero customer touch. Subject to Zscaler-initiated updates and maintenance. (Tier A — PSE help doc.)

For the broader Service Edge taxonomy (Public / Private / Virtual form factors, CA connectivity model, data-plane properties), see [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md). This doc covers the on-prem-specific mechanics: when to deploy, cluster design, tiers, IP/NAT constraints, PSE Groups (the ZIA construct), and the open-proxy deployment risk.

## PSE vs cloud enforcement nodes

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

All PSE deployments are **N+1 redundant**. Zscaler will not support a standalone PSE. Minimum two PSEs per cluster, always. (Tier A)

Two node roles in every cluster:

- **Load Balancer (LB) instances** — active-passive pair, coordinated via **CARP** (Common Address Redundancy Protocol) sharing a cluster VIP. All inbound traffic targets the cluster VIP.
- **Service Edge instances** — active-active behind the cluster VIP. The LB distributes traffic across all healthy Service Edges; unhealthy instances are removed from the pool automatically via active health monitoring.

**Direct Server Return (DSR):** response traffic does not traverse the LB on the way back. The Service Edge sends responses directly to the client. Only inbound (client → PSE) traffic passes through the LB. Firewall rules must permit asymmetric return flows: return traffic originates from service-edge IPs, not the cluster VIP. (Tier A)

## Cluster tiers and throughput ceilings

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

## Advanced DLP PSE

Customers requiring **Exact Data Match (EDM)** or **Indexed Data Match (IDM)** features get an additional hardware role: the Advanced DLP Private Service Edge. This is separate from the standard PSE instances and dedicated to EDM/IDM index hosting and matching. Deployed alongside a standard PSE cluster, not as a standalone unit. (Tier A — PSE help doc.)

## Virtual Service Edge (VSE)

VSE is the software form factor: a Zscaler OS VM running on customer-operated infrastructure. Platforms supported: VMware ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V, Google Cloud Platform. Same control-plane connections as a physical PSE; same inspection stack. Key differences from hardware PSE: (Tier A — VSE help doc)

- **Customer-managed**: Zscaler Cloud Ops does not access or monitor VSEs. Auto-upgrades run during published maintenance windows without operator or Zscaler intervention.
- **Lower throughput ceiling**: 600 Mbps per VM (ESXi with SSL acceleration card); scale horizontally with multi-VM clusters (up to 16 VMs on ESXi/Hyper-V; native clustering not available on Azure/AWS/GCP — use cloud-native LBs instead).
- Minimum 2 VSE instances for N+1 production redundancy (same principle as PSE clusters).

VSE is the right choice when the organization controls its own virtualization infrastructure and either (a) public-cloud-deployed or (b) prefers not to rack dedicated Zscaler hardware.

## IP and NAT requirements

All PSE IPs — service IPs, LB IPs, cluster VIP — **must be public IP addresses**. (Tier A)

For RFC 1918 private-address environments: 1:1 static NAT to a public IP is supported, with one constraint — **IPv6 is not supported in 1:1 static NAT mode**. In a NAT deployment, each PSE private IP must have a dedicated public mapping; shared or overloaded NAT is not supported. (Tier A)

Firewall must allow outbound to Zscaler cloud IPs at `config.zscaler.com/<Zscaler Cloud Name>/zia-sedge`.

## PSE Groups (ZIA configuration construct)

PSE Groups organize PSEs into logical units for location policy scoping and high availability. They are a ZIA Admin Console construct distinct from the physical cluster architecture. (Tier A — vendor/zscaler-help/about-private-service-edge-groups.md.)

PSE Groups provide the ability to:
- Deploy PSEs using provisioning keys
- Group PSEs based on region or functional area (each PSE belongs to a single group)
- Set the location for PSEs in the group (affects country-based policy evaluation)
- Configure and enable disaster recovery
- Set automated update schedules to off-hours maintenance windows
- Configure preferred local version profiles

**Key PSE Group fields:**

| Field | Notes |
|---|---|
| Name | Display name. |
| Location | Where the PSE group is deployed — used for country-based policy evaluation when user connects with RFC 1918 IP. |
| Publicly Accessible | If enabled, the PSE group is available for all users; if disabled, only users from mapped trusted networks can connect. |
| Client Connector Trusted Networks | ZPA Trusted Network IDs mapped to this group — used to prioritize this PSE group for users on those networks. (Note: this is a ZPA Trusted Network reference, not a ZIA construct.) |
| Disaster Recovery | Enables the PSE group for disaster recovery scenarios. |
| Public Service Edge Proximity Override | If enabled, this PSE group is prioritized over a closer Public Service Edge within a specified distance. |
| Version Profile | Controls software update cadence (default / previous_default / new_release). |
| Alternative Cloud Domain | Can override the default cloud domain for the PSE Group. |

**Provisioning keys:** each PSE Group has associated Private Service Edge Provisioning Keys. These are used to identify the PSE group to which a new PSE must deploy. (Tier A — vendor/zscaler-help/about-private-service-edge-groups.md.)

**Policy scoping:** PSE Groups are referenced in ZIA location configuration. Adding a location to a PSE cluster enables per-cluster log viewing, auth settings, IP surrogacy, XFF consumption, and location-group rule scoping. See Locations section and open-proxy risk below.

## Business Continuity Cloud and PSE

When the Business Continuity Cloud activates (during a PSE or ZIA service outage), traffic routes through Zscaler's BC infrastructure. BC Cloud is relevant to PSE operators because PSE outages are one of the triggers. BC Cloud supports only Z-Tunnel 1.0 / PAC / GRE (not Z-Tunnel 2.0), which means a tenant relying on Z-Tunnel 2.0 with a restrictive subcloud loses both during BC activation. (Tier A — `references/shared/subclouds.md`.)

PSE deployments that need to ensure business continuity should also verify their ZCC forwarding profiles include a BC Cloud fallback path.

## Locations and the open-proxy risk

Adding a **location** to a PSE cluster in the Admin Console enables per-cluster log viewing, auth settings, IP surrogacy, XFF consumption, and location-group rule scoping. See [`./locations.md`](./locations.md) for the location primitive itself.

**Load-bearing gotcha — this is where deployments go wrong:**

The CA does **not** automatically link a newly created PSE location to the actual PSE cluster. If a location is added without the manual CA linkage step, the cluster becomes an **open proxy** — any traffic source can use it without authentication. This is a misconfiguration risk, not a software bug, and it is not self-healing. (Tier A — PSE help doc.)

Correct deployment sequence:

1. Use a **Static IP address provisioned in the Admin Console** for the location. One Static IP per cluster.
2. The public IP must be **owned by the organization** and not otherwise assigned to the PSE cluster.
3. Share all **known traffic forwarding ranges** with Zscaler for allowlisting.
4. **Contact Zscaler Support** — Zscaler configures the location IP and the forwarding-range allowlist on all PSE instances in the cluster. This step cannot be self-served.

Until step 4 completes: any traffic not matching the allowlist is treated as remote-user traffic and forced to authenticate. Expect a service disruption window during the mapping. Follow NOC change protocol if configuring in production.

**Operational rule:** every PSE location add or change requires a Zscaler Support ticket. There is no Admin Console self-service path for the CA-to-cluster mapping. Operators who skip this step or assume the mapping is automatic will create an open proxy.

## SDK and API surface

ZIA PSE and PSE Groups do not have a dedicated SDK service in the Python or Go ZIA SDKs as of April 2026. PSE management is primarily done via:
- The ZIA Admin Console (UI-only management for PSE provisioning)
- Zscaler Support for CA-to-cluster linkage
- The PSE Health Dashboard (requires ZDX subscription — see below)

ZPA has a separate `ServiceEdgeGroupAPI` (`client.zpa.service_edge_group`) for ZPA Private Service Edges, which are different from ZIA PSEs. Do not conflate these:
- **ZIA PSE** — enforces ZIA policies (URL filtering, DLP, firewall) for internet/SaaS traffic
- **ZPA PSE (Private Service Edge)** — brokers ZPA sessions between ZCC and App Connectors for private application access

Both products use the term "Private Service Edge" but they serve different roles in the architecture.

## ZDX dependency — PSE Health Dashboard

The **PSE Health Dashboard** (the primary operational monitoring surface for PSE cluster health) requires a **ZDX (Zscaler Digital Experience) subscription**. It is not available to ZIA-only tenants. For tenants without ZDX, PSE monitoring falls back to Zscaler Cloud Ops telemetry and the standard ZIA Admin Console — which has no dedicated PSE health view. (Tier A — PSE help doc.)

## Gotchas summary

1. **Minimum two PSEs — no standalone.** Zscaler will not support a one-node cluster. Budget for N+1 from the start.

2. **>5 Gbps requires Dedicated LB and Cloud Ops review.** This is not a capacity you can provision via a ticket alone; Zscaler Cloud Operations reviews the design before deployment begins.

3. **DSR means return traffic does not pass through the LB.** Firewall rules must permit asymmetric return flows. Any stateful firewall between the PSE cluster and clients must be configured to expect return traffic from service-edge IPs, not the cluster VIP.

4. **1:1 NAT disables IPv6 on all PSE IPs.** If IPv6 is a requirement for client connectivity, the PSE cannot be behind NAT.

5. **Location → cluster mapping is manual, not automatic.** See open-proxy risk above. This is the most operationally dangerous step in a PSE deployment.

6. **PSE Health Dashboard requires ZDX.** Plan the monitoring stack accordingly; a PSE cluster without ZDX has no dedicated health dashboard.

7. **Location of PSE Group affects country-based policy.** When a user connects to a PSE with an RFC 1918 address, the PSE Group's location (not the user's IP) determines which country-based policies apply. Location changes do not take effect for existing connections — only new connections after the change.

8. **PSE Group location changes affect existing connections differently.** If the location of a PSE Group is updated, the PSE uses the old location until the next new connection. (Tier A — vendor/zscaler-help/about-private-service-edges.md.)

## Cross-links

- Service Edge taxonomy and CA connectivity model — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- PSE deployments bind to Locations; location primitives (forwarding methods, sublocations, XFF, Location Groups) — [`./locations.md`](./locations.md)
- Source IP Anchoring (SIPA) — the forwarding-control mechanism that routes traffic out through a specific egress IP, works with physical PSE — [`./forwarding-control.md`](./forwarding-control.md)
- Log correlation and when to query ZIA logs — [`../shared/log-correlation.md`](../shared/log-correlation.md)
- Subclouds — restricting which Service Edges handle tenant traffic — [`../shared/subclouds.md`](../shared/subclouds.md)
- ZPA Private Service Edges (different product, similar name) — [`../zpa/private-service-edges.md`](../zpa/private-service-edges.md)
