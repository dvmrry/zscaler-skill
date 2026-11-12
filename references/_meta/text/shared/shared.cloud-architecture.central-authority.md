# The Central Authority: what it holds, and how ZIA and ZPA cluster it differently (shared.cloud-architecture.central-authority)
Also called: central authority; CA; zscaler control plane; ca failover; active passive central authority; zpa central authority

Both services call their Central Authority (CA) the control-plane brain, but they build it differently, so an answer about CA failover has to name the product.

**Internet & SaaS (ZIA).** The Internet & SaaS Central Authority is the brain and nervous system of a Zscaler cloud: it monitors the cloud and provides a central location for software and database updates, policy and configuration settings, and threat intelligence. [shared.cloud-architecture.central-authority:zia-ca-role] The ZIA CA consists of one active server and two servers in passive standby. The active CA replicates data to both standbys in real time, so any of them can become active at any time, and each server is hosted in a separate location for fault tolerance. [shared.cloud-architecture.central-authority:zia-ca-active-passive]

**Private Access (ZPA).** The Private Access Central Authority is the brain and nervous system of the Zero Trust Exchange: a geographically distributed system of in-sync nodes that all actively service requests. [shared.cloud-architecture.central-authority:zpa-ca-active-active] [The Central Authority provides a central location for software and database updates and for policy and configuration settings, and policy is distributed across all of its components.](kb:zpa.troubleshooting.access-path:ca-distributes) Each component of the Private Access system is aware of the health of the entire Zero Trust Exchange. The Private Access CA includes user interfaces connected via APIs to configuration components, and distributed dispatchers that track real-time application states. [shared.cloud-architecture.central-authority:zpa-ca-components]

**The difference.** The two Central Authorities use different availability models: ZIA runs one active server with two passive standbys that can take over, while every ZPA CA node actively services requests. A ZIA CA failover is a standby promotion; ZPA has no standby to promote. [shared.cloud-architecture.central-authority:different-models]

**How policy reaches the edges (ZIA).** The ZIA CA hosts all customer policy and configuration settings and is redundant and backed up in multiple Zscaler data centers. Public Service Edges keep a persistent connection to the CA to download policy: when a new user connects to an edge, a policy request goes to the CA, which calculates the policies that apply to that user and sends them to the edge as a highly compressed bitmap. [shared.cloud-architecture.central-authority:policy-download] A downloaded policy is cached until a policy change is made in the Admin Console; then all of the organization's cached policies are purged, and the Public Service Edge requests the new policy when the user next makes a request. [shared.cloud-architecture.central-authority:policy-cache-purge] The Zscaler cloud heartbeats every second, so all nodes learn of a policy change; any Public Service Edge can pull the changed policy when it sees a new request from the organization, so users get the new policy when they next connect, wherever they are. [shared.cloud-architecture.central-authority:heartbeat] What an edge does when it cannot reach the CA is in [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains).

**What it does not carry.** The ZIA CA holds control-plane state and does not carry customer traffic: the architecture article says customer traffic is not passed from the Public Service Edge to any other component. [shared.cloud-architecture.central-authority:ca-not-data-plane] Threat and URL feeds reach the edges through the CA: [Feed Central distributes its threat intelligence and other feeds to the Central Authority, which sends updates to the Public Service Edges, so that every Public Service Edge has the latest URL database and malware and threat information.](kb:shared.cloud-architecture.support-systems:feed-path).

**Open.** Whether a CA is shared by all tenants of a cloud or partitioned per tenant is open [gap:shared.cloud-architecture.central-authority:ca-tenancy], and so is whether admin API traffic terminates at the CA [gap:shared.cloud-architecture.central-authority:api-entry-point]. What a CA failover does to traffic is in [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains).

What to check:
1. Name the product before describing a CA failover: ZIA promotes a standby, ZPA has no standby.
2. Do not attribute a traffic outage to the CA alone; customer traffic stays on the Service Edge.
3. For a ZIA policy change that a user does not see yet, check whether the user has made a new request since the change; edges pull the new policy on the next request.

Inferred, not quoted (say so when an answer rests on one):
- [shared.cloud-architecture.central-authority:different-models] Tier B: Follows from the two architecture articles read side by side; neither article compares them.
- [shared.cloud-architecture.central-authority:ca-not-data-plane] Tier B: The article states that customer traffic stays on the Public Service Edge and lists the CA's functions; it does not say in so many words that the CA carries no traffic.

Not known (open gaps):
- Whether a Central Authority is shared per cloud or partitioned per tenant [gap:shared.cloud-architecture.central-authority:ca-tenancy]: settled by support-ticket or source-read. Blocks: blast-radius answers for a CA incident: whether it touches every tenant of a cloud or only some
- Whether admin API traffic terminates at the Central Authority [gap:shared.cloud-architecture.central-authority:api-entry-point]: settled by source-read or support-ticket. Blocks: reasoning about whether a CA failover affects admin API or Terraform runs

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.cloud-architecture.failure-domains.md (What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs)
- interacts-with references/_meta/text/shared/shared.cloud-architecture.service-edges.md (Service Edges: the data plane, its form factors, and how traffic reaches one): The ZIA CA hosts all customer policy and configuration settings and is redundant and backed up in multiple Zscaler data centers. Public Service Edges keep a persistent connection to the CA to download policy: when a new user connects to an edge, a policy request goes to the CA, which calculates the policies that apply to that user and sends them to the edge as a highly compressed bitmap. [shared.cloud-architecture.central-authority:policy-download]
- links-to references/_meta/text/shared/shared.cloud-architecture.support-systems.md (Support systems of a Zscaler cloud, and Feed Central)
- links-to references/_meta/text/zpa/zpa.troubleshooting.access-path.md (The hops of a ZPA access request and where each can fail)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.cloud-architecture.md (Zscaler cloud architecture)
