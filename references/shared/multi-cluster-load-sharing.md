---
product: shared
topic: multi-cluster-load-sharing
title: "ZIA multi-cluster load sharing — policy enforcement and traffic distribution across data center clusters"
content-type: reasoning
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-multi-cluster-load-sharing.md"
  - "vendor/zscaler-help/understanding-zscaler-cloud-architecture.md"
  - "vendor/zscaler-help/about-public-service-edges-internet-saas.md"
  - "vendor/zscaler-help/understanding-business-continuity-cloud-components.md"
  - "vendor/zscaler-help/understanding-source-ip-anchoring.md"
  - "references/shared/cloud-architecture.md"
  - "references/shared/subclouds.md"
  - "references/zia/private-service-edge.md"
author-status: draft
---

# ZIA multi-cluster load sharing

Multi-cluster load sharing (MCLS) is the mechanism by which a single Virtual IP (VIP) at a Zscaler data center is served by **multiple Public Service Edge clusters from different network address blocks**. Traffic arriving at the VIP can enter and be processed by any participating cluster. The feature is infrastructural — it is not an opt-in per organization and does not require tenant configuration. (Tier A — vendor/zscaler-help/understanding-multi-cluster-load-sharing.md)

This document covers the mechanics, policy implications, failure behavior, and operational gotchas of MCLS for ZIA tenants. For the broader cloud component model (Central Authority, Nanolog, Business Continuity Cloud), see [`./cloud-architecture.md`](./cloud-architecture.md). For the subcloud mechanism that can restrict which clusters serve a tenant, see [`./subclouds.md`](./subclouds.md). For Private Service Edge clusters — which operate outside the MCLS pool — see [`../zia/private-service-edge.md`](../zia/private-service-edge.md).

---

## 1. Definition

A Zscaler data center does not necessarily run a single cluster. Zscaler deploys multiple Service Edge clusters, each from a **different network address block**, behind a **shared VIP**. All clusters behind a VIP participate equally: any cluster's load balancer (LB) instances can accept traffic arriving at the VIP, and any LB can forward that traffic to any service node in any participating cluster at that data center.

Example from vendor documentation (Tier A — understanding-multi-cluster-load-sharing.md):

| Cluster | VIP | Cluster Type | Network address block |
|---|---|---|---|
| ZSC Cluster 1 | 165.225.80.36 | GRE | 165.225.80.0/23 |
| ZSC Cluster 1 | 165.225.80.37 | VPN | 165.225.80.0/23 |
| ZSC Cluster 1 | 165.225.81.247 | PAC | 165.225.80.0/23 |
| ZSC Cluster 3 (shared VIPs with Cluster 1) | 165.225.80.36 | GRE | 147.161.166.0/23 |
| ZSC Cluster 3 | 165.225.80.37 | VPN | 147.161.166.0/23 |
| ZSC Cluster 3 | 165.225.81.247 | PAC | 147.161.166.0/23 |

Both clusters serve the same GRE VIP (`165.225.80.36`) from different network address blocks. A customer's GRE tunnel terminating at that VIP can be served by either cluster. (Tier A — understanding-multi-cluster-load-sharing.md)

---

## 2. Why multi-cluster exists

MCLS solves a capacity-scaling problem for Zscaler cloud operators, and provides availability benefits to tenants:

**Capacity without migration.** Zscaler can add a new cluster to an existing VIP without requiring customers to reconfigure GRE tunnels, change IPSec endpoints, or update PAC files. The customer's configuration remains stable; only the pool of clusters behind the VIP expands. (Tier A — understanding-multi-cluster-load-sharing.md)

**Active-active availability.** Public Service Edges run in active-active load balancing mode worldwide. The Central Authority monitors health and can remove unhealthy instances from the pool. Multiple clusters behind a single VIP extend this redundancy to the cluster level within a data center. (Tier A — about-public-service-edges-internet-saas.md)

**Latency-based routing to the nearest PoP.** Zscaler uses advanced geo-IP resolution to direct traffic to the nearest Public Service Edge for the tenant's cloud. Within the chosen data center, MCLS handles intra-DC distribution across clusters. The geo-IP routing happens before a packet reaches the VIP; MCLS handles distribution after. (Tier A — understanding-zscaler-cloud-architecture.md)

**Policy follows the user.** When a user moves locations, the new Public Service Edge downloads the appropriate policy from the Central Authority. The MCLS pool does not create a "wrong cluster holding stale policy" failure mode — each cluster pulls policy per-user from the CA on first connection. (Tier A — about-public-service-edges-internet-saas.md)

---

## 3. Traffic distribution mechanism

The vendor documentation describes MCLS as a **shared VIP with multiple clusters from different network address blocks**. The load distribution operates at the load balancer layer within the data center:

- Each participating cluster contributes LB instances to the shared VIP.
- Traffic arriving at the VIP is handled by any participating cluster's LB.
- That LB can then forward the traffic to any service node in **any participating cluster** — not only its own. The inter-cluster forwarding is the distinctive property of MCLS versus a standard single-cluster active-active pool. (Tier A — understanding-multi-cluster-load-sharing.md)

**Configuration data endpoint.** Per-cloud MCLS configuration — including which clusters participate in which VIPs, and the network address blocks per cluster — is published at:

```
config.zscaler.com/<Zscaler cloud name>/cenr
```

For example: `config.zscaler.com/zscalertwo.net/cenr`. The cloud name can be derived from the admin login URL (e.g., `admin.zscalertwo.net` → cloud name `zscalertwo.net`). (Tier A — understanding-multi-cluster-load-sharing.md)

**VIP types.** The vendor documentation explicitly shows separate VIPs per protocol: GRE, VPN (IPSec), and PAC. Clusters participate in all three VIP types within a data center. A customer using both GRE and VPN tunnels to the same DC will have both tunnel types subject to MCLS distribution. (Tier A — understanding-multi-cluster-load-sharing.md)

**Note on IPSec / Z-Tunnel 2.0.** The vendor MCLS capture explicitly shows VPN (IPSec) VIPs in the MCLS table alongside GRE. Z-Tunnel 2.0 specific behavior under MCLS is not separately documented. The table implies IPSec tunnels participate similarly to GRE tunnels. Verify if Z-Tunnel 2.0 session semantics (stateful TLS multiplexing) interact differently with the cross-cluster forwarding path.

---

## 4. Policy synchronization across clusters

Policy propagation in ZIA is driven by the Central Authority (CA), not by the individual clusters. The mechanism: (Tier A — about-public-service-edges-internet-saas.md)

1. An admin makes a configuration change in the Admin Console.
2. All of the organization's cached policies are **purged cloud-wide**.
3. The Zscaler cloud heartbeats every second — all Service Edge nodes across all clusters are informed of the policy change.
4. On the next request from a user, the cluster serving that user pulls the updated policy from the CA as a **highly compressed bitmap**.
5. The updated policy is then cached at the Service Edge until the next policy change.

The key consequence for MCLS: policy is pulled on demand, not pushed to specific clusters. There is no "primary cluster" that receives policy first. After an admin activation, all clusters in the VIP pool are in the same state: their cached policy for the organization is purged, and each cluster will fetch fresh policy from the CA on the next user request it handles.

**Propagation latency.** Policy purge notification travels at the heartbeat interval (every second). The effective propagation window is therefore sub-second for the purge, with the new policy arriving on the next request handled by each node. There is no documented minimum window before a policy change is "fully propagated" across all clusters — the pull-on-demand model means any cluster serving a request after the heartbeat will use the updated policy.

**Partial-propagation behavior.** Because policy is per-user and pulled per-request, there is a window during a policy change where some users mid-session are using policy fetched before the change and new requests fetch the new policy. This is the standard ZIA eventual-consistency window. It is not specific to MCLS but is relevant when clusters are under different load: a heavily loaded cluster may serve fewer new requests in the window, extending the time before all active users in that cluster refresh their cached policy.

---

## 5. Session affinity and stickiness

The vendor MCLS documentation describes any LB being able to forward to any service node in **any participating cluster**. This implies that a single TCP flow or tunnel session may be handled by service nodes across clusters within the VIP pool. (Tier A — understanding-multi-cluster-load-sharing.md)

**What this means for stateful inspection:**

- **Sandbox / file behavioral analysis.** Sandbox is offloaded from the Service Edge to dedicated Sandbox servers — not co-located with the service node. A file sent for analysis is routed to Sandbox servers regardless of which cluster's node initiated the send. MCLS does not fragment sandbox analysis. (Tier A — about-public-service-edges-internet-saas.md)
- **No disk storage.** Service Edges never write data to disk. Traffic held in memory for inspection is not persisted. If a session migrates between service nodes mid-analysis, there is no residual state on the originating node. (Tier A — about-public-service-edges-internet-saas.md; understanding-zscaler-cloud-architecture.md)
- **DLP large-object scanning and file reassembly.** These are in-memory operations at the Service Edge. The vendor documentation does not address whether MCLS LB provides session-level stickiness within a VIP that would keep all packets of a single TCP flow on the same service node. This is an unresolved question — see the clarifications note at the end of this document.

**GRE and IPSec tunnels.** A GRE or IPSec tunnel established to a VIP is a persistent tunnel; the LB at the VIP terminates and distributes flows, not packets. Individual HTTP(S) transactions within the tunnel may be distributed across service nodes in different clusters. Session-level stickiness (if any) would operate at the tunnel-flow granularity, not at the packet level.

---

## 6. Logging and observability

Service Edges do not store logs locally — they compress, tokenize, and export log data over TLS to Log Routers, which direct logs to the Nanolog cluster assigned to the tenant's geographic region. (Tier A — about-public-service-edges-internet-saas.md; understanding-zscaler-cloud-architecture.md)

Under MCLS, traffic from the same tenant may be processed by service nodes across multiple clusters. Those nodes all export to the same Log Router infrastructure, which correlates logs to the correct Nanolog cluster by tenant. From the tenant's perspective, all logs appear in a unified log store in the Admin Console and NSS streams — there is no per-cluster log partition visible to admins.

**Correlation.** Log records include source information (user, location, IP) that can be used to correlate activity regardless of which cluster processed the request. The cluster or service node identity is not exposed in the standard ZIA web log schema as a customer-visible field.

---

## 7. Failure modes and client re-routing

**Single cluster failure within a VIP.** If one cluster in an MCLS pool becomes unhealthy, the CA's health monitoring removes it from the active pool. Traffic continues to flow through the remaining healthy clusters behind the same VIP. Clients (ZCC, GRE tunnels, IPSec tunnels) do not need to reconfigure — the VIP remains available, and traffic redistributes across the healthy clusters. (Tier A — understanding-zscaler-cloud-architecture.md, cloud-architecture.md reasoning)

**Single Service Edge node failure within a cluster.** The cluster's LB actively monitors service node health and removes unhealthy nodes from rotation. Sub-minute impact. The LB continues distributing to healthy nodes in its own and peer clusters. (Tier A — about-public-service-edges-internet-saas.md)

**Safe mode (CA unreachable).** If a Service Edge cannot reach the CA, it enters Safe mode: it enforces all cached policies, continues full security inspection, and attempts to reconnect to the CA every second. If a user or location policy is not in the cache, a default policy applies that blocks access to all URLs in the Legal Liability URL Category. Authentication is not requested in Safe mode. (Tier A — about-public-service-edges-internet-saas.md)

**Whole-DC VIP failure.** If the VIP itself (and all clusters behind it) becomes unreachable, clients must re-resolve to a new endpoint. The mechanism depends on the client type:

- **ZCC with PAC file (Zscaler-hosted).** The Zscaler-hosted PAC resolves `${GATEWAY}` to the geolocation-nearest healthy Service Edge on each PAC evaluation. A DC failure causes subsequent PAC evaluations to return an alternate endpoint. The PAC re-evaluation cadence determines the client's TTR.
- **GRE / IPSec tunnels.** Static tunnels pointed at a VIP require manual reconfiguration or router-side failover logic to redirect to a secondary VIP. There is no automatic client-side failover for router-terminated GRE/IPSec tunnels absent a configured secondary tunnel or dynamic routing failover.
- **ZCC (tunnel mode).** ZCC detects cloud unreachability via the fail-open policy configured in the Forwarding Profile. Depending on configuration, it either passes traffic direct (fail-open) or blocks it (strict mode). The Business Continuity Cloud can intercept before the fail-open decision if BC is provisioned — PAC redirects to the BC Cloud site nearest the client's IP. (Tier A — understanding-business-continuity-cloud-components.md)

**Specific timeout windows** for VIP-level detection by ZCC or GRE/IPSec tunnel endpoints are not documented in the vendor MCLS or architecture sources. This is an unresolved gap — see clarifications.

---

## 8. Identity and auth-state across clusters

Policy for a user is computed by the Central Authority and distributed to Service Edges per-user on first request. When a user is routed to a different cluster within the MCLS VIP pool — whether on a new connection or as a result of LB redistribution — the new cluster's service node requests the user's policy from the CA on first connection.

**Auth state replication.** The vendor documentation does not describe explicit auth-state replication between clusters at the data-plane level. The CA serves as the authoritative auth and policy source. A user who authenticated at one service node and is subsequently served by a node in a different cluster in the pool is re-authenticated by virtue of the CA issuing policy in response to the new service node's request. Whether this represents a fully transparent handoff (no re-prompt to the user) or a re-auth event depends on the auth method (IP surrogacy, cookie, Kerberos, SAML) and whether the CA's session state persists across the re-query. This is an unresolved gap — see clarifications.

---

## 9. SIPA and static egress IPs under MCLS

Source IP Anchoring (SIPA) routes ZIA-inspected traffic to a ZPA App Connector, making the App Connector's IP the egress IP at the destination. SIPA is implemented via a Forwarding Control rule with `forward_method = ZPA`, independent of which cluster inspects the traffic. (Tier A — references/zia/forwarding-control.md; understanding-source-ip-anchoring.md)

For tenants using the default ZIA egress path (`forward_method = ZIA` / no SIPA), traffic exits from the IP address pool of whichever Public Service Edge cluster processes the request. Under MCLS, this means the egress IP can be from any cluster participating in the VIP pool, and the source network address block will reflect that cluster's range — not a fixed tenant-owned IP.

**Operational implications:**

- **Azure AD Conditional Access Named Locations** (IP-based): these allowlists must include IP ranges from all clusters that could serve the tenant's traffic for the relevant locations. The CENR endpoint (`config.zscaler.com/<cloud>/cenr`) lists the network address blocks per cluster. Under MCLS, any block in the participating cluster list is a candidate egress source for non-SIPA traffic. (Tier A — understanding-multi-cluster-load-sharing.md)
- **Vendor IP allowlists.** Any third-party service that restricts access by source IP must allowlist the full set of Zscaler IP ranges for the tenant's cloud, not a single fixed range. The full IP list is available via the CENR endpoint and Zscaler's published IP range feeds.
- **SIPA isolates egress IP from cluster selection.** Tenants with strict egress IP requirements should use SIPA or a dedicated egress method (`ENATDEDIP`). These forward methods anchor the egress IP independently of which cluster performs the inspection.

---

## 10. PSE deployments and MCLS

Private Service Edge (PSE) clusters are **not participants in the MCLS Public Service Edge pool**. A PSE cluster is a dedicated cluster for a single organization, operated on-premises, serving traffic from the locations explicitly assigned to it in the Admin Console. (Tier A — references/zia/private-service-edge.md)

The MCLS pool consists exclusively of Public Service Edges operated by Zscaler. Traffic routed to a PSE cluster goes to that specific cluster's VIP — there is no cross-cluster LB pool at the PSE level that spans multiple PSE clusters or mixes PSE with Public SE nodes.

Within a PSE cluster, the analogous construct is: an active-passive LB pair sharing a cluster VIP, distributing traffic to active-active service nodes. This is single-cluster redundancy, not multi-cluster load sharing. The LB uses CARP for VIP failover, and responses use Direct Server Return (DSR) — return traffic does not pass through the LB. (Tier A — references/zia/private-service-edge.md)

**Traffic path under a subcloud that includes Private SEs.** A subcloud can mix Private Service Edges and Public Service Edges as preferred vs overflow. In that configuration, traffic first targets the Private SE cluster(s); if unavailable, it overflows to the Public SE members of the subcloud. The Public SE members are subject to MCLS within their respective data centers. (Tier A — references/shared/subclouds.md)

---

## 11. MCLS vs subclouds

These are distinct mechanisms that operate at different layers:

| Concept | Layer | What it does | Who configures it |
|---|---|---|---|
| **MCLS** | Intra-DC, data plane | Distributes traffic across multiple clusters behind a shared VIP within a data center | Zscaler infrastructure (not tenant-configurable) |
| **Subcloud** | Geo/DC selection, forwarding path | Restricts which data centers and Service Edges serve a tenant's traffic | Zscaler Support on tenant request |

MCLS applies after a data center has been selected. If a subcloud restricts a tenant to two specific data centers, MCLS still operates within each of those data centers across the clusters behind each VIP. The subcloud determines which VIPs are in scope; MCLS handles distribution within each VIP.

A tenant using an unqualified `${GATEWAY}` PAC variable receives geolocation-default PSE selection with no subcloud restriction. MCLS operates transparently within whatever data center the geo-IP resolution selects.

**Business Continuity and subclouds.** When BC mode activates, traffic routes through Zscaler's BC infrastructure regardless of subcloud configuration. BC mode bypasses both subcloud restrictions and the normal MCLS pool. (Tier A — references/shared/subclouds.md)

---

## 12. Constraints and known limits

**Rollout model.** MCLS cluster additions follow the monthly Zscaler infrastructure upgrade schedule, described in the Zscaler Service Continuity Customer Notification Protocol. It is not per-organization opt-in, and tenants receive no direct notification when a new cluster joins the VIP pool behind their assigned data centers. (Tier A — understanding-multi-cluster-load-sharing.md)

**No per-tenant cluster pinning.** There is no documented mechanism to pin a tenant or a GRE tunnel to a specific cluster within an MCLS pool. The subcloud mechanism can restrict which DCs serve a tenant, but within a DC the cluster selection is at the LB's discretion.

**CENR data.** The complete MCLS configuration — VIPs, cluster names, cluster types, and network address blocks — is machine-readable at `config.zscaler.com/<cloud>/cenr`. This is the authoritative source for IP planning (firewall rules, allowlists, CENR-based IP feed tooling). It is updated as Zscaler adds or removes clusters from the pool.

**Government and special clouds.** Cloud names `zscalergov` and `zspreview` are valid cloud domains in the Zscaler ecosystem (confirmed in Terraform provider sources). Whether these clouds operate an equivalent MCLS model or have different cluster topologies is not documented in the available vendor sources.

**Z-Tunnel 2.0 and BC mode.** The Business Continuity Cloud supports only Z-Tunnel 1.0, PAC files, and GRE tunnels. A tenant that has migrated to Z-Tunnel 2.0 reverts to Z-Tunnel 1.0 during BC operations. This is not an MCLS constraint but is relevant when reasoning about failure cascades: a Z-Tunnel 2.0 tenant whose DC VIP becomes unreachable and triggers BC activation will experience the tunnel downgrade. (Tier A — understanding-business-continuity-cloud-components.md)

---

## 13. Cross-links

- Cloud architecture (Central Authority, Service Edges, Nanolog, BC Cloud, activation) — [`./cloud-architecture.md`](./cloud-architecture.md)
- Subclouds (DC restriction for GDPR, private-DC enforcement, PAC variable forms) — [`./subclouds.md`](./subclouds.md)
- Private Service Edge (PSE cluster design, DSR, tiers, open-proxy risk) — [`../zia/private-service-edge.md`](../zia/private-service-edge.md)
- Forwarding Control + SIPA (forward methods, egress IP anchoring) — [`../zia/forwarding-control.md`](../zia/forwarding-control.md)
- ZCC fail-open and Forwarding Profile (client behavior when cloud is unreachable) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
