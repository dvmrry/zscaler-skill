---
product: zia
topic: vse-clusters
title: "ZIA Virtual Service Edge Clusters — HA grouping and traffic distribution for VSE VMs"
content-type: reasoning
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edges-internet-saas.md"
  - "vendor/zscaler-help/understanding-private-service-edge-internet-saas.md"
  - "vendor/zscaler-help/understanding-multi-cluster-load-sharing.md"
author-status: draft
---

# ZIA Virtual Service Edge Clusters

A VSE Cluster is the production-grade grouping construct for Virtual Service Edge (VSE) VMs. It presents a single cluster IP address to the network, distributes traffic across member VSE instances using a bundled load balancer, and provides active-active redundancy. Individual VSE instances are the raw deployment artifact; the cluster is the operational unit above them. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

For the VSE VM itself (sizing, platform support, OS hardening, inspection capabilities), see [`./private-service-edge.md § Virtual Service Edge`](./private-service-edge.md). For the broader Service Edge taxonomy — Public vs Private vs Virtual form factors, Central Authority connectivity model — see [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md).

## 1. Definition

A VSE Cluster is an admin-defined group of VSE VM instances that share a common cluster IP address and operate as an HA pool. The cluster is the object that appears in traffic-forwarding policy; member VMs are subordinate to it. The cluster IP is the single forwarding target from clients; individual VM IPs are transparent to clients during normal operation.

The cluster construct is distinct from:

- A **standalone VSE** — a single VM with no load balancer and no failover. Supported only for evaluation and test traffic, not for production. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)
- A **PSE hardware cluster** — a cluster of dedicated Zscaler-shipped appliances managed by Zscaler Cloud Operations, with different throughput ceilings and a different operator model. (Tier A — understanding-private-service-edge-internet-saas.md; see section 12 below.)

## 2. Why cluster

Three reasons to cluster VSE instances rather than deploying standalone VMs: (Tier A — about-virtual-service-edge-clusters-internet-saas.md; about-virtual-service-edges-internet-saas.md)

**N+1 redundancy.** A cluster of at least two VMs can absorb the loss of one member without a service interruption. The active load balancer detects the unhealthy VM and stops sending it traffic; surviving members absorb the load. A standalone VM has no failover partner.

**Throughput aggregation.** Each VSE VM delivers up to 600 Mbps total throughput (on VMware ESXi with the optional SSL acceleration card). With up to 16 VMs in a cluster, aggregate throughput scales horizontally. A single-VM deployment is hard-capped at 600 Mbps; a cluster is not.

**Simplified policy management.** Traffic-forwarding rules, location assignments, and auth settings are configured once at the cluster level. Adding or removing VMs does not require changes to forwarding policy; the cluster object absorbs the membership change. Managing N individual VM objects in policy would multiply the configuration surface and create drift risk.

## 3. Cluster composition

**Minimum VMs per cluster:** 2. This is the minimum for active-active redundancy. Zscaler does not support standalone VSE instances for production environments with live user traffic. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Maximum VMs per cluster:** 16. (Tier A — about-virtual-service-edge-clusters-internet-saas.md; confirmed in the sizing table in about-virtual-service-edges-internet-saas.md for ESXi and Hyper-V.)

**Licensing:** each VSE VM in a cluster requires a separate VSE subscription. The cluster object itself does not consume a license; the VMs do. Budget N licenses for an N-VM cluster. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Platform constraints on cluster size:**

| Platform | Native cluster mode | Max VMs per cluster |
|---|---|---|
| VMware ESXi 6.0+ | Supported — bundled LB | 16 |
| Microsoft Hyper-V | Supported — bundled LB | 16 |
| Microsoft Azure | Not supported | N/A (use Azure LB) |
| AWS EC2 | Not supported | N/A (use AWS LB) |
| GCP | Not supported | N/A (use GCP LB) |

(Tier A — about-virtual-service-edges-internet-saas.md, sizing table.)

## 4. Cluster vs standalone VSE

| Dimension | Standalone VSE | VSE Cluster (2–16 VMs) |
|---|---|---|
| Failover | None | Active-active; LB removes unhealthy member |
| Throughput ceiling | 600 Mbps (1 VM) | Up to 9,600 Mbps (16 VMs × 600 Mbps) |
| Zscaler support posture | Evaluation / test only | Production — supported |
| Policy object complexity | 1 VM = 1 object | N VMs behind 1 cluster object |
| Load balancer | Not included | Bundled in each VM |

Use standalone VSE only in lab or proof-of-concept scenarios where service disruption is acceptable and user traffic is synthetic. Zscaler explicitly states that standalone mode does not support failover and is not supported for production environments with live user traffic. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

## 5. Load distribution within a cluster

### On-premises (ESXi / Hyper-V) — bundled load balancer

Each VSE VM includes a bundled load balancer. The LB is designed by Zscaler specifically to distribute user traffic evenly across the VSE instances within the cluster. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

The LB pair within the cluster operates in **active-passive** mode using **CARP** (Common Address Redundancy Protocol) to share the cluster VIP. At any moment one LB instance is active; the other is passive standby. All inbound client traffic is addressed to the cluster IP. The active LB receives ingress traffic through the cluster IP and routes it to the appropriate VSE instance. If the active LB fails, the passive LB takes over automatically with no service disruption. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

The VSE instances themselves operate in **active-active** mode. The LB fans out traffic across all healthy VSE instances simultaneously. No VSE is idle while others are busy — all share the load. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Direct Server Return (DSR):** VSE instances run in DSR mode. Inbound requests go from the client to the LB, and then to the VSE. But the response flows directly from the VSE to the client — it does not return through the LB. This reduces LB bandwidth consumption and is a standard optimization at this scale. Firewall rules must account for asymmetric return flows: response traffic originates from the VSE's service IP, not the cluster VIP. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**External load balancers:** Zscaler does not recommend using an external LB with VSE clusters. The bundled LB is purpose-built for this traffic pattern. If an organization must use an external LB, Zscaler provides separate guidance in the "Using an External Load Balancer with Virtual Service Edges" article. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

### Public cloud (Azure / AWS / GCP) — cloud-native LB

On Azure, AWS, and GCP, the native VSE cluster mode (bundled LB + shared cluster VIP) is not supported. Horizontal scale and redundancy are achieved by deploying multiple VSE VMs behind a cloud-native load balancer (Azure Load Balancer, AWS ALB/NLB, GCP Load Balancing). The cluster construct as described in the on-premises model does not apply in these environments. (Tier A — about-virtual-service-edges-internet-saas.md)

In cloud environments, customers configure the cloud LB to distribute traffic across the VSE VM instances. The Zscaler Admin Console cluster object may still be used to group the VMs, but the CARP/DSR/bundled-LB mechanics documented above are exclusive to ESXi and Hyper-V deployments.

## 6. Health monitoring and auto-recovery

The active LB performs active health monitoring of the VSE instances in the cluster. An unhealthy VM is automatically removed from the LB pool. Traffic is redistributed to surviving healthy members. When the unhealthy VM recovers, the LB returns it to rotation. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

The bundled LB's active-passive failover ensures that LB-layer failure is also handled without manual intervention: if the active LB fails, the passive takes over and traffic continues to flow. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

No admin intervention is required for either VSE instance failure or LB active-passive failover.

**Monitoring surface:** the Admin Console VSE Clusters page (Infrastructure > Internet & SaaS > Traffic Forwarding > Virtual Service Edges > Virtual Service Edge Clusters) displays cluster status, member VMs, cluster IP, and IPSec local termination status per cluster. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

Note: the PSE Health Dashboard available via ZDX is specific to hardware PSE clusters and is not documented as applicable to VSE clusters. VSE health visibility relies on the Admin Console and on customer-side VM monitoring of the underlying hypervisor or cloud platform.

## 7. Cluster-level configuration

The VSE Cluster admin page surfaces the following per-cluster fields: (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

- **Name** — the cluster's display and policy-reference name.
- **Status** — enabled or disabled.
- **Virtual Service Edges** — membership list of VSE VM instances.
- **Cluster IP** — the shared VIP that clients target.
- **IPSec Local Termination** — whether IPSec termination is handled at the cluster level.

Settings that are cluster-scoped (applied uniformly across all member VMs by virtue of policy being pushed from the Central Authority) include auth policy, forwarding policy, and log forwarding. The VSE VM itself has VM-scoped items such as NTP server configuration (customer may supply NTP; if not, Zscaler uses public NTP), DNS server configuration (customer may supply DNS; if not, Zscaler uses public DNS), and network interface assignments. (Tier A — understanding-private-service-edge-internet-saas.md, by analogy; vendor VSE cluster doc does not break this out explicitly — see deferred items.)

## 8. Auto-upgrade behavior

VSEs are upgraded automatically during scheduled maintenance windows published in the Zscaler Trust Portal. No admin intervention and no Zscaler Cloud Operations intervention is required. VSEs are not monitored or managed by Zscaler Cloud Operations — the customer's VM infrastructure runs the upgrade process as initiated by the Zscaler software stack. (Tier A — about-virtual-service-edges-internet-saas.md)

**Cluster-level upgrade orchestration:** the vendor cluster document does not describe whether upgrades within a cluster are sequenced (rolling) or simultaneous. This is a gap — see Deferred items below. In the absence of documented rolling-upgrade behavior, operators planning for maintenance windows should assume that all VMs in a cluster may upgrade during the same maintenance window, and plan capacity accordingly.

## 9. IP and NAT requirements

**Per cluster:** one cluster IP (VIP). This is the address clients use and the address that appears in forwarding policy. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Per VM:** each VSE VM has its own management interface (SSH access, hypervisor console), its own service interfaces for user traffic, and — on ESXi/Hyper-V — its own LB interface. The VSE VM requires 3 virtual interfaces. (Tier A — about-virtual-service-edges-internet-saas.md)

**Outbound connectivity:** each VSE VM must have outbound access to the Zscaler cloud for control-plane communication (CA for auth and policy, cloud routers + Nanolog for logging). The required IPs are published at `config.zscaler.com/<Zscaler Cloud Name>/zia-v-sedge`. The VM must also be able to reach hub IPs at `config.zscaler.com/<Zscaler Cloud Name>/hubs`. (Tier A — about-virtual-service-edges-internet-saas.md)

**1:1 NAT:** vendor docs for VSE do not document 1:1 static NAT support the same way the PSE docs do (PSE requires 1:1 NAT with the constraint that IPv6 is not supported in NAT mode). Whether VSE supports similar NAT topologies is not confirmed from available sources — see Deferred items.

## 10. Logging and observability

VSE policy and authentication follow the same model as Public Service Edges: admins define policies in the Zscaler Admin Console once; the policy applies regardless of whether a user connects to a VSE, a PSE, or a Public SE. Logs are compressed, tokenized, and transmitted from each VSE VM to the Zscaler cloud's Nanolog cluster for storage, analysis, and NSS export. (Tier A — about-virtual-service-edges-internet-saas.md)

Each VSE VM transmits its own logs to the cloud; the cluster does not aggregate logs internally before transmission. From the admin console analytics perspective, logs are associated with the tenant's cloud account and can be filtered by the location bound to the cluster. Whether individual log entries carry a VM-level identifier versus a cluster-level identifier is not explicitly documented — see Deferred items.

**Auth log:** the VSE VM maintains an auth log at `/var/log/auth.log` that captures authentication attempts and commands run on the appliance. This is VM-local and is not transmitted to the Zscaler cloud; customers should monitor it for unauthorized access to the VM itself. (Tier A — about-virtual-service-edges-internet-saas.md)

## 11. Cluster lifecycle

**Creating a cluster:** the Admin Console VSE Clusters page (Infrastructure > Internet & SaaS > Traffic Forwarding > Virtual Service Edges > Virtual Service Edge Clusters) provides an Add action. A cluster is defined with a name, a cluster IP, and an initial membership of VSE VM instances. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Adding VMs to an existing cluster:** VM instances appear in the "Virtual Service Edges" field of the cluster record; adding a new VSE VM to the field expands the cluster. The new VM must already be provisioned and registered with the Zscaler cloud before it can be added to a cluster.

**Removing VMs:** reducing cluster membership by removing a VM from the cluster object redirects traffic away from that VM. Specific drain-before-removal behavior (connection graceful drain, quiesce window) is not documented in the vendor sources available — see Deferred items.

**Disabling a cluster:** the status field can be set to disabled, which stops the cluster from accepting traffic, without deleting it. This is the safe path for a planned maintenance window on the entire cluster.

## 12. Comparison to PSE clusters

| Dimension | VSE Cluster (ESXi/Hyper-V) | PSE Hardware Cluster |
|---|---|---|
| Operator | Customer | Zscaler Cloud Operations |
| Hardware | Customer-owned VMs | Zscaler-shipped dedicated appliances |
| Load balancer | Bundled in each VSE VM (CARP active-passive) | Bundled in each PSE node (CARP active-passive) |
| LB model | Active LB + passive standby per cluster | Active LB + passive standby per cluster |
| SE instances | Active-active (up to 16) | Active-active (up to 10 for PSE 5 Dedicated LB) |
| Max throughput | 600 Mbps per VM; 9,600 Mbps for 16-VM cluster | Up to ~24 Gbps (PSE 5 Dedicated LB design) |
| Cluster VIP | One cluster IP per cluster | One cluster VIP per cluster |
| DSR | Yes | Yes |
| Monitoring | Admin Console + customer hypervisor tooling | ZIA Admin Console + ZDX (PSE Health Dashboard requires ZDX subscription) |
| Zscaler access required | No | Yes (Cloud Ops manages) |
| Maintenance | Auto-upgrade during maintenance windows, no Cloud Ops | Zscaler Cloud Ops-initiated |
| Source IP Anchoring | Not supported | Supported |

The CARP active-passive LB architecture and DSR mode are shared between VSE clusters and PSE clusters — both products use the same underlying LB model. The operational difference is who manages it: the customer for VSE, Zscaler Cloud Ops for PSE. (Tier A — about-virtual-service-edge-clusters-internet-saas.md; understanding-private-service-edge-internet-saas.md)

## 13. Comparison to Public SE multi-cluster load sharing

Public Service Edge multi-cluster load sharing (MCLS) is a Zscaler-cloud-managed mechanism that places multiple Public SE clusters — from different network address blocks — behind a shared VIP within a data center. Traffic to that VIP can be served by any participating cluster. Customers do not configure or manage MCLS; it is an infrastructure-scale capability that Zscaler adds transparently to expand Public SE capacity without migrating customer GRE tunnels. (Tier A — understanding-multi-cluster-load-sharing.md)

VSE clusters are the opposite in every operational dimension: they are customer-private, customer-operated, and customer-configured. The cluster IP is owned and managed by the customer. There is no Zscaler-side orchestration of which VSE cluster serves a given request — that is determined entirely by the customer's network topology (which clients can reach which cluster IP).

The two constructs are not in competition; they apply to different deployment scenarios. MCLS is relevant to understanding Public SE capacity and GRE tunnel targeting. VSE clusters are relevant when the customer is deploying on-premises or cloud-hosted VSE infrastructure.

## 14. Known constraints

**Public cloud (Azure, AWS, GCP): no native cluster mode.** The bundled LB and CARP-based cluster VIP mechanism are exclusive to VMware ESXi and Microsoft Hyper-V. On Azure, AWS, and GCP, the customer must use the cloud platform's native load balancing service to distribute traffic across multiple VSE VMs. The cluster construct in the Admin Console may still be used for grouping, but the on-premises LB mechanics do not apply. (Tier A — about-virtual-service-edges-internet-saas.md)

**Source IP Anchoring (SIPA) is not supported with VSE.** This is a hard capability gap vs hardware PSE. Customers whose use case requires SIPA must use physical PSE hardware. (Tier A — about-virtual-service-edges-internet-saas.md)

**Each VM requires a separate subscription.** A 16-VM cluster requires 16 VSE licenses. This is a licensing constraint, not a technical one, but it affects cluster sizing decisions. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**Cluster minimum is 2 VMs.** A single-VM deployment is explicitly unsupported for production. Budget at minimum 2 subscriptions and 2 VMs for any production VSE footprint. (Tier A — about-virtual-service-edge-clusters-internet-saas.md)

**ESXi SSL acceleration card is not available on cloud platforms.** The Marvell NITROX SSL acceleration card — which raises per-VM throughput to 600 Mbps and SSL CPS to 3,500 — is only supported on VMware ESXi. On Azure, AWS, Hyper-V, and GCP, the per-VM SSL CPS is 400 and total throughput is not documented at the same ceiling. (Tier A — about-virtual-service-edges-internet-saas.md)

**vMotion support requires ESXi 7.0+.** Live VM migration (vMotion) is supported only on ESXi 7.0 or later. This has implications for planned maintenance and cluster upgrade scenarios on VMware infrastructure. (Tier A — about-virtual-service-edges-internet-saas.md)

## Deferred items

The following items could not be sourced from the available vendor documents. Registered in [`_clarifications.md`](../_clarifications.md) as `zia-33` through `zia-38`:

1. **Cluster-level upgrade orchestration** — whether maintenance-window upgrades within a cluster are rolled sequentially (one VM at a time, preserving capacity) or applied simultaneously. The vendor VSE cluster doc does not describe rolling upgrade behavior.

2. **VM drain-before-removal behavior** — whether removing a VM from an active cluster gracefully drains existing connections before the VM is removed from the LB pool, or whether in-flight sessions are reset immediately.

3. **Log entry VM vs cluster identifier** — whether individual web log entries carry a VM-level identifier, a cluster-level identifier, or both, when inspecting logs from a VSE cluster in NSS or the Admin Console analytics.

4. **Cluster-scoped vs VM-scoped settings boundary** — the vendor cluster doc lists the cluster-level Admin Console fields (name, status, members, cluster IP, IPSec termination) but does not enumerate which policy settings are pushed as cluster-scoped vs which must be configured per VM.

5. **VSE NAT topology support** — whether 1:1 static NAT to public IPs is supported for VSE VMs (equivalent to the PSE NAT model), and whether the same IPv6-in-NAT restriction applies.

6. **Public cloud cluster object semantics** — whether the Admin Console "VSE Cluster" object on Azure/AWS/GCP is a purely cosmetic grouping or whether it carries any behavioral configuration beyond what the cloud-native LB enforces.

## Cross-links

- VSE VM sizing, hardening, platform support, use cases — [`./private-service-edge.md`](./private-service-edge.md)
- Service Edge taxonomy (Public / Private / Virtual form factors, CA connectivity) — [`../shared/cloud-architecture.md`](../shared/cloud-architecture.md)
- Public SE multi-cluster load sharing (Zscaler-cloud-managed; contrast to VSE clusters) — [`../shared/multi-cluster-load-sharing.md`](../shared/multi-cluster-load-sharing.md) (not yet written; vendor source at `vendor/zscaler-help/understanding-multi-cluster-load-sharing.md`)
- Locations (traffic forwarding location object; binds to cluster for per-cluster policy scoping) — [`./locations.md`](./locations.md)
- Source IP Anchoring (SIPA) — not supported on VSE; requires physical PSE — [`./forwarding-control.md`](./forwarding-control.md)
