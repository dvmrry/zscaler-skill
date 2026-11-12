# Multi-Cluster Load Sharing: several Public Service Edge clusters behind one VIP (shared.multi-cluster)
Also called: multi-cluster load sharing; mcls; shared vip; cenr; config.zscaler.com cenr; which cluster handled my traffic; new cluster added to data center
Former IDs: shared-07, shared-08, shared-09, shared-10, shared-11

A Zscaler data center can run more than one Public Service Edge cluster behind the same tunnel and PAC addresses. Multi-Cluster Load Sharing lets several Internet & SaaS Public Service Edge clusters in different network address blocks participate in a VIP address from any network address block in a data center. Ingress traffic enters a given VIP and reaches the end destination through any instance of the Service Edge clusters from any of the network address blocks listed for the data center. [shared.multi-cluster:definition] All traffic is distributed across every participating cluster's load balancer instances, and those load balancers can forward traffic to any service node in any participating cluster. [shared.multi-cluster:any-node] Zscaler states the purpose as adding capacity without customers moving their tunnels [Multi-Cluster Load Sharing is described for Public Service Edge clusters in Zscaler data centers: several clusters in different network address blocks serve the same VIP, so Zscaler can add capacity without customers moving their GRE tunnels.](kb:zia.virtual-service-edge.load-balancing:mcls-is-public-se-only).

**Example.** In Zscaler's example, ZSC Cluster 1 is in 165.225.80.0/23 and ZSC Cluster 3 in 147.161.166.0/23, and both serve the GRE VIP 165.225.80.36; the table shows Cluster 3 sharing all three of Cluster 1's VIP addresses (GRE 165.225.80.36, VPN 165.225.80.37, PAC 165.225.81.247). [shared.multi-cluster:example]

**Where the clusters are listed.** The complete data center list for a cloud is at config.zscaler.com/<Zscaler Cloud Name>/cenr; for an organization on zscalertwo.net it is config.zscaler.com/zscalertwo.net/cenr. [shared.multi-cluster:cenr] The cloud name comes from the admin login host [The cloud name is also in the URL admins use to log in: an organization that logs in to admin.zscalertwo.net is on zscalertwo.net.](kb:shared.cloud-architecture.cloud-names:name-from-admin-url). The feature's rollout follows the monthly infrastructure upgrade schedule under the Zscaler Service Continuity Customer Notification Protocol. [shared.multi-cluster:rollout] Whether tenants are told when a cluster joins their data center is open [gap:shared.multi-cluster:cluster-change-notice].

**Seeing which edge handled traffic.** The NSS web log names the data center that handled a transaction (datacenter, datacentercity, datacentercountry); its field table has no cluster or service node field. [shared.multi-cluster:datacenter-in-logs]

**Private Service Edges.** A Private Service Edge cluster is not described as taking part in Multi-Cluster Load Sharing: the vendor describes the feature for Public Service Edge clusters only, and a Private Service Edge cluster takes its traffic on its own VIP, held by an active-passive load balancer pair. [shared.multi-cluster:pse-outside]

**Policy, logging and continuity.** How policy reaches whichever edge serves a user is in [When a user moves to a different location, the policy follows the user: the Public Service Edge downloads the appropriate policy.](kb:shared.cloud-architecture.service-edges:policy-follows-user) and [The Central Authority: what it holds, and how ZIA and ZPA cluster it differently](kb:shared.cloud-architecture.central-authority), and Safe mode and the Business Continuity Cloud in [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains). Every edge exports its logs the same way: [Log data generated for every transaction on a ZIA Public Service Edge is compressed, tokenized and exported over TLS to Log Routers, which direct each organization's logs to the Nanolog cluster hosted in the appropriate geographical region.](kb:shared.cloud-architecture.logging-path:edge-log-export). Subclouds, which restrict the Service Edges that serve a tenant, are [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds).

**Open.** Whether one flow stays on one service node is open [gap:shared.multi-cluster:flow-stickiness], and so is whether moving to a node in another cluster re-prompts authentication [gap:shared.multi-cluster:auth-state]. What happens when one cluster or node behind a VIP fails is open [gap:shared.multi-cluster:unhealthy-cluster], as is how long clients take to notice a whole VIP failing [gap:shared.multi-cluster:vip-failure-detection]. Pinning a tenant or tunnel to one cluster is open [gap:shared.multi-cluster:cluster-pinning]; Z-Tunnel 2.0 under load sharing [gap:shared.multi-cluster:ztunnel2] and the government and preview clouds [gap:shared.multi-cluster:other-clouds] are open too.

What to check:
1. List the clusters, VIPs and network address blocks of the data centers in use from config.zscaler.com/<cloud name>/cenr, taking the cloud name from the admin login host.
2. To tell which edge handled a transaction, read the data center fields of the web log; do not expect a cluster or node identifier.

Inferred, not quoted (say so when an answer rests on one):
- [shared.multi-cluster:datacenter-in-logs] Tier B: The absence rests on a search of the web feed field table (and the zia/web-log type built from it) for cluster, node and edge fields; only the data center fields were found. Firewall and DNS feeds were not checked for this claim.
- [shared.multi-cluster:pse-outside] Tier B: Inference from the absence of Private Service Edges in the Multi-Cluster Load Sharing page and the single-cluster design on the Private Service Edge pages; no page says Private Service Edges are excluded.

Not known (open gaps):
- Whether a flow stays on one service node under load sharing [gap:shared.multi-cluster:flow-stickiness]: settled by operator-experience or support-ticket. Blocks: saying whether a large upload or a tunnel's transactions can be split across nodes in different clusters
- Whether moving to a node in another cluster re-prompts authentication [gap:shared.multi-cluster:auth-state]: settled by operator-experience or support-ticket. Blocks: explaining unexpected authentication prompts at a data center with several clusters
- How long clients take to detect a whole data center VIP failing [gap:shared.multi-cluster:vip-failure-detection]: settled by operator-experience or support-ticket. Blocks: stating a failover time for a whole data center outage
- Z-Tunnel 2.0 under Multi-Cluster Load Sharing [gap:shared.multi-cluster:ztunnel2]: settled by source-read or operator-experience. Blocks: saying whether Client Connector tunnels behave like GRE tunnels at a shared VIP
- Load sharing in the government and preview clouds [gap:shared.multi-cluster:other-clouds]: settled by source-read or support-ticket. Blocks: applying the shared-VIP model to tenants on those clouds
- What happens when one cluster or node behind a shared VIP fails [gap:shared.multi-cluster:unhealthy-cluster]: settled by support-ticket or operator-experience. Blocks: predicting client impact when part of a data center fails
- Pinning a tenant or tunnel to one cluster [gap:shared.multi-cluster:cluster-pinning]: settled by support-ticket. Blocks: answering requests to keep a site's traffic on one cluster or address block
- Whether tenants are told when a cluster joins their data center [gap:shared.multi-cluster:cluster-change-notice]: settled by source-read or support-ticket. Blocks: planning allowlist updates around new address blocks

Area: shared.multi-cluster, its subjects in references/_meta/spine/shared/shared.multi-cluster.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): The NSS web log names the data center that handled a transaction (datacenter, datacentercity, datacentercountry); its field table has no cluster or service node field. [shared.multi-cluster:datacenter-in-logs]
- interacts-with references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment): With several egress IPs, client persistence should be maintained (load balancer, ECMP or other), because a server that checks persistence refuses connections arriving from a different egress IP. [zia.traffic-forwarding.gre:client-persistence]
- links-to references/_meta/text/shared/shared.cloud-architecture.central-authority.md (The Central Authority: what it holds, and how ZIA and ZPA cluster it differently)
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/shared/shared.cloud-architecture.failure-domains.md (What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs)
- links-to references/_meta/text/shared/shared.cloud-architecture.logging-path.md (Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS)
- links-to references/_meta/text/shared/shared.cloud-architecture.service-edges.md (Service Edges: the data plane, its form factors, and how traffic reaches one)
- links-to references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)
- links-to references/_meta/text/zia/zia.virtual-service-edge.load-balancing.md (How a Virtual Service Edge cluster spreads and returns traffic)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.multi-cluster.egress-addresses.md (Which Zscaler source addresses a destination can see, and what to allowlist)
- see-also references/_meta/text/zia/zia.private-service-edge.cluster-architecture.md (How a Private Service Edge cluster is built and fails over)
