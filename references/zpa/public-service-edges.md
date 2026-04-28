---
product: zpa
topic: "public-service-edges"
title: "ZPA Service Edges — Public, Virtual, and Virtual Service Edge Clusters"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-public-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edges-internet-saas.md"
  - "vendor/zscaler-help/about-virtual-service-edge-clusters-internet-saas.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/service_edges.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/service_edges.py"
  - "vendor/terraform-provider-zpa/zpa/data_source_zpa_service_edge.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_service_edge_group.go"
author-status: draft
---

# ZPA Service Edges — Public, Virtual, and Virtual Service Edge Clusters

> **Note on vendor source:** The help portal pages for ZPA-specific Public Service Edges return 404 as of April 2026. The ZIA-facing pages for Public Service Edges, Virtual Service Edges, and VSE Clusters have been vendored and are used here — the concepts and architecture apply across ZIA and ZPA Service Edge variants. ZPA-specific SDK/TF detail is sourced from code. Field-level ZPA specifics are **confidence: medium**.

---

## 1. What Public Service Edges are

A ZPA Public Service Edge (PSE) is a **Zscaler-operated, multi-tenant ZPA data-plane node** that brokers ZPA access sessions. When a ZCC client establishes a ZPA session, it connects to the nearest Public Service Edge, which manages the M-Tunnel end-to-end to the App Connector behind the tenant's firewall. This is the default path for road-warrior ZPA traffic.

Public Service Edges are **entirely Zscaler-managed**. The operator does not deploy, configure, or update them. They are geo-distributed across Zscaler PoPs and selected automatically based on the client's source IP and ZPA geo-routing logic. Operators observe them in logs and health views; they cannot alter their behavior.

**Architecture: active-active deployment** (Tier A — `about-public-service-edges-internet-saas.md`). PSEs handle hundreds of thousands of concurrent users with millions of concurrent sessions. Every inspection engine runs within the PSE; sandboxing is offloaded to dedicated Sandbox servers.

**Policy distribution:** PSEs maintain a persistent connection to the Central Authority (CA) to download policy configurations. Policy is cached on the PSE per organization; on any policy change, all cached policies are purged and rebuilt on next request. The CA heartbeats every second.

**Safe mode:** if a PSE cannot reach the CA, it switches to Safe mode — enforces all cached policies, attempts CA reconnect every second, continues full inspection. If no cached policy exists for a user/location, a default URL block policy applies.

---

## 2. Virtual Service Edges (VSEs) — customer-deployed PSEs

A Virtual Service Edge is a **customer-operated VM** running a full-featured Zscaler service gateway dedicated to the organization's traffic. VSEs provide the same service coverage as Zscaler-cloud Public Service Edges (Firewall, DLP, SSL inspection) but run on customer-owned infrastructure.

**Note on product line:** the vendored VSE documentation is from ZIA. The concept applies to ZPA Virtual Service Edges; the specific sizing/specs below may differ for ZPA VSEs. Consult Zscaler for ZPA-specific VSE sizing.

### 2.1 Use cases for VSEs

VSEs serve the same use cases as ZIA Private Service Edges:
- **Geopolitical / regulatory requirements** — traffic must remain on-premises or in a specific geography.
- **High-latency regions** — locations far from the nearest Public Service Edge where round-trip to Zscaler PoP adds unacceptable latency.
- **Apps that require the organization's IP as source** — when Source IP Anchoring (SIPA) semantics are needed at a specific egress.
- **Localized content requirements** — content delivery or licensing tied to a specific geographic IP range.

**Source IP Anchoring is NOT supported with Virtual Service Edges** (Tier A — vendor doc, `about-virtual-service-edges-internet-saas.md`).

### 2.2 Customer ownership model

- VSEs are **managed by the customer**, not by Zscaler Cloud Operations.
- Zscaler does not require access to VSEs.
- **Auto-upgrades** happen during scheduled maintenance windows without customer intervention (maintenance windows published in the Zscaler Trust Portal).
- Zscaler hardens the VSE VM as a "jailed environment" — limited commands, hardened OS, unnecessary packages removed.
- Audit log at `/var/log/auth.log` captures authentication attempts and commands. Customers should monitor this for unauthorized access.

### 2.3 Sizing and platform support

| Hypervisor / Cloud | vCPUs | Min RAM (standalone) | Min RAM (cluster) | Max VMs per cluster | Disk | Max throughput |
|---|---|---|---|---|---|---|
| VMware ESXi 6.0+ | 4 | 32 GB | 48 GB | 16 | 500 GB | 600 Mbps |
| Microsoft Hyper-V | 4 | 32 GB | 48 GB | 16 | 500 GB | — |
| Microsoft Azure | 4 | 32 GB | — | — | 500 GB | — |
| AWS EC2 | 4 | 32 GB | — | — | 500 GB | — |
| GCP | 4 | 32 GB | — | — | 500 GB | — |

SSL acceleration card (Marvell NITROX CNN3510-500-C5-NHB-2.0-G, sold separately) raises SSL CPS from 400 to 3,500 on VMware ESXi. Recommended when doing SSL inspection at >100 Mbps.

**Native cluster mode** is only supported on VMware ESXi and Hyper-V. For Azure, AWS, and GCP, use the public cloud's native load balancers for VSE redundancy — native cluster mode is not supported in those environments.

---

## 3. Virtual Service Edge Clusters — HA and load distribution

VSE Clusters are **production-grade HA deployments** consisting of 2–16 VSE instances operating active-active (Tier A — vendor doc, `about-virtual-service-edge-clusters-internet-saas.md`).

### 3.1 Cluster architecture

- **Minimum 2 VSEs** for N+1 redundancy. Standalone mode (1 VSE) is evaluation-only and does not support failover.
- **Maximum 16 VSE instances** per cluster.
- Each VSE in a cluster requires a separate VSE subscription.
- Each VSE has a **load balancer (LB) bundled in**, designed to distribute user traffic evenly.

**Load balancer HA mechanism:** Zscaler uses the **Common Address Redundancy Protocol (CARP)** for active-passive fault tolerance among LB instances. All VSE instances in the cluster are active simultaneously; only one LB instance is active at a time. The active LB receives ingress via the cluster IP address and routes to the appropriate VSE. If the active LB fails, the passive LB takes over automatically.

**Direct Server Return (DSR) mode:** VSEs operate in DSR mode. Requests flow through the LB to the VSE; responses flow from the VSE directly to the user, bypassing the LB on the return path. This reduces LB bandwidth requirements.

### 3.2 Cluster IP

The cluster exposes a single **cluster IP address** that acts as the entry point for all inbound traffic. GRE/IPsec tunnels (or ZCC forwarding) target this cluster IP. Individual VSE instance IPs are not used by clients.

### 3.3 External load balancers

Zscaler does not recommend external load balancers with VSE clusters. If an external LB is required by organizational policy, a separate Zscaler guide covers that configuration.

---

## 4. When to use PSEs vs VSEs

| Criterion | Public Service Edge | Virtual Service Edge |
|---|---|---|
| Management overhead | None — Zscaler-managed | Requires customer ops team |
| Traffic stays on-premises | No | Yes |
| Source IP Anchoring | Yes | No |
| Geopolitical / regulatory requirements | Only if Zscaler has a PoP in required region | Full control over traffic geography |
| Maximum throughput | Effectively unlimited (Zscaler scales) | 600 Mbps per VM; scale via clusters |
| HA / redundancy | Automatic (Zscaler multi-PoP) | Customer-configured cluster (2+ VSEs) |
| SSL inspection throughput >100 Mbps | Automatic | Requires Marvell NITROX SSL acceleration card |
| Setup cost | Zero | VM procurement + Zscaler VSE subscription |

**Default recommendation:** use Public Service Edges. Deploy VSEs only when regulatory requirements, data residency mandates, or latency constraints in specific geographies make on-premises processing necessary.

---

## 5. API/SDK objects for VSEs and VSE clusters

### 5.1 ServiceEdge individual instances — Python SDK

| Property | `client.zpa.service_edges` |
|---|---|
| Class | `ServiceEdgeControllerAPI` |
| File | `zscaler/zpa/service_edges.py` |
| Go parity | `serviceedgecontroller/` |

The `/serviceEdge` API exposes individual Service Edge instances — these represent enrolled **Private** Service Edge nodes registered against the operator's tenant. The same model and endpoint also surface Public Service Edge instance data when queried from a tenant context, though the operator cannot enroll or configure those.

**Methods:**

| Method | HTTP | Endpoint | Notes |
|---|---|---|---|
| `list_service_edges(query_params=None)` | GET | `.../serviceEdge` | Paginated; `search`, `page`, `page_size` |
| `get_service_edge(service_edge_id)` | GET | `.../serviceEdge/{id}` | |
| `update_service_edge(service_edge_id, **kwargs)` | PUT | `.../serviceEdge/{id}` | Only `name`, `description`, `enabled` are operator-meaningful |
| `delete_service_edge(service_edge_id, microtenant_id=None)` | DELETE | `.../serviceEdge/{id}` | Deregisters a Private SE; not applicable to Public SEs |
| `bulk_delete_service_edges(service_edge_ids, microtenant_id=None)` | POST | `.../serviceEdge/bulkDelete` | Batch deregister |

### 5.2 Key fields on the ServiceEdge model

| Python field | Wire key | Notes |
|---|---|---|
| `id` | `id` | Opaque ZPA object ID |
| `name` | `name` | Display name |
| `enabled` | `enabled` | Read-only for Public SEs; mutable on Private SEs |
| `latitude` / `longitude` / `location` | — | Geo coordinates of the PoP or customer site |
| `public_ip` / `private_ip` | `publicIp` / `privateIp` | Routable IPs of the SE node |
| `control_channel_status` | `controlChannelStatus` | CA connectivity state |
| `ctrl_broker_name` | `ctrlBrokerName` | The CA broker this SE is connected to |
| `current_version` / `expected_version` | — | Software version state |
| `upgrade_status` / `upgrade_attempt` | — | Upgrade lifecycle state |
| `last_broker_connect_time` | — | Timestamp of last CA channel establishment |
| `service_edge_group_id` / `service_edge_group_name` | — | Which Service Edge Group this instance belongs to |
| `provisioning_key_id` / `provisioning_key_name` | — | Private SE enrollment only; absent on Public SEs |
| `sarge_version` | `sargeVersion` | Internal Zscaler component version string |
| `zpn_sub_module_upgrade_list` | — | Per-module upgrade state; list of dicts |

Fields related to provisioning keys (`provisioning_key_id`, `provisioning_key_name`, `enrollment_cert`) are only populated on **operator-enrolled Private Service Edges**. On Public Service Edges these will be absent or null.

### 5.3 Service Edge Group — `ServiceEdgeGroupAPI`

For operators deploying Private Service Edges, `resource_zpa_service_edge_group` is the management surface: grouping, geo tagging (`latitude`, `longitude`, `country_code`), trusted-network binding, upgrade scheduling, and business-continuity mode (`exclusive_for_business_continuity`).

| Property | `client.zpa.service_edge_group` |
|---|---|
| Class | `ServiceEdgeGroupAPI` |
| File | `zscaler/zpa/service_edge_group.py` |
| Go parity | `serviceedgegroup/` |

**Methods:**

| Method | Notes |
|---|---|
| `list_service_edge_groups(query_params=None)` | |
| `get_service_edge_group(group_id)` | |
| `add_service_edge_group(**kwargs)` | |
| `update_service_edge_group(group_id, **kwargs)` | |
| `delete_service_edge_group(group_id, microtenant_id=None)` | |

### 5.4 Terraform

The TF provider exposes a **data source only** for individual Service Edge instances (`data.zpa_service_edge_controller`). No TF resource exists for creating or managing individual instances — enrollment is handled by the Private SE appliance via provisioning key, not by Terraform directly. The `service_edges` list field on `resource_zpa_service_edge_group` is `Computed` and carries a deprecation warning: "Service edge membership is managed externally."

---

## 6. How PSEs appear in operator workflows

**1. LSS access log records.** ZPA LSS emits per-session records that include the Service Edge that brokered the session. The operator sees the SE identity in the log but cannot influence which SE was selected.

**2. Geo-distribution and latency.** ZPA geo-routing selects the nearest Public Service Edge automatically. Operators have no direct control for Public SEs. Latency variation between sessions from different regions reflects which PoP the client was routed to.

**3. Health monitoring.** `control_channel_status` and broker connect/disconnect timestamps in the ServiceEdge object surface connectivity state. This is read-only. Health problems with Public SEs are Zscaler operational issues, not tenant configuration issues.

---

## 7. Geographic placement considerations

For Public Service Edges: Zscaler manages PoP geography. The operator selects a ZPA cloud (e.g., `zscaler.net`, `zscalertwo.net`) and traffic is automatically geo-routed.

For Private Service Edges / VSEs: the operator places the SE at a specific site (data center, branch, cloud region). Key considerations:
- Place close to App Connectors to minimize the M-Tunnel path from SE to connector.
- For regulatory data residency, ensure the SE and App Connectors are both within the required geographic boundary.
- For latency-sensitive applications, place SEs close to the user population that will connect to them.
- The `latitude`/`longitude`/`location` fields on the Service Edge Group are used by ZPA geo-routing to inform client proximity selection.

---

## Cross-links

- Service Edge form factors and M-Tunnel architecture — [`../shared/cloud-architecture.md §Service Edges`](../shared/cloud-architecture.md)
- App Connector (the other endpoint of the M-Tunnel) — [`./app-connector.md`](./app-connector.md)
- Policy precedence and session gating — [`./policy-precedence.md`](./policy-precedence.md)
- LSS access log schema (where SE identity appears) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
- ZIA Private Service Edge (different product, different concept) — [`../zia/private-service-edge.md`](../zia/private-service-edge.md)
- Trusted Networks — PSE Group ↔ Trusted Network binding — [`./trusted-networks.md`](./trusted-networks.md)
- SDK ServiceEdgeGroupAPI — [`./sdk.md §2.37 ServiceEdgeGroupAPI`](./sdk.md)
