# Understanding Multi-Cluster Load Sharing

**Source:** https://help.zscaler.com/zia/understanding-multi-cluster-load-sharing
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Traffic Forwarding — Understanding Multi-Cluster Load Sharing

**Multi-Cluster Load Sharing** allows multiple ZIA Public Service Edge clusters in **different network address blocks** to participate in a single Virtual IP (VIP) at a data center.

Traffic to a given VIP can enter and be handled by **any instance of the Service Edge clusters** from any of the network address blocks listed for the data center. Complete DC information is published at `config.zscaler.com/<Zscaler Cloud Name>/cenr`.

To find your cloud name: check the URL admins use to log in (e.g., `admin.zscalertwo.net` → cloud name `zscalertwo.net`). See *What is my cloud name for ZIA?*.

## Operational Effect

Traffic is distributed across every participating cluster load balancer (LB) instance; any LB can forward traffic to any service node in any participating cluster.

This lets Zscaler **scale data centers without migrating your clusters**: new Service Edge capacity can be added to existing VIPs. Customers don't need to move GRE tunnels to a new VIP when a new cluster is added to a DC.

## Example

| Cluster | VIP | Cluster Type | Network address block |
|---|---|---|---|
| ZSC Cluster 1 | 165.225.80.36 | GRE | 165.225.80.0/23 |
| ZSC Cluster 1 | 165.225.80.37 | VPN | 165.225.80.0/23 |
| ZSC Cluster 1 | 165.225.81.247 | PAC | 165.225.80.0/23 |
| ZSC Cluster 3 (shared VIPs with Cluster 1) | 165.225.80.36 | GRE | 147.161.166.0/23 |
| ZSC Cluster 3 | 165.225.80.37 | VPN | 147.161.166.0/23 |
| ZSC Cluster 3 | 165.225.81.247 | PAC | 147.161.166.0/23 |

Both clusters serve the GRE VIP `165.225.80.36` from *different* network address blocks. A customer's GRE tunnel pointed at that VIP can be served by either cluster.

## Rollout

Feature rollout follows the monthly infrastructure upgrade schedule per the Zscaler Service Continuity Customer Notification Protocol — not an opt-in feature per organization.
