# Cloud Connector placement across regions: centralized, decentralized, overlapping address space (cloud-connector.regions.topology)
Also called: cloud connector hub and spoke; cloud connector transit gateway; cloud connector virtual wan; cloud connector cross-region failover; cloud connector overlapping cidr; cloud connector vnet peering

**Centralized or decentralized.** In most cases Cloud Connector is deployed into groups or locations that serve the same internet egress. [cloud-connector.regions.topology:egress-groups] Each region serves a number of different egress points for Cloud Connector and does not affect other regions even if there is a cloud provider outage, whether the deployment is centralized, using AWS Transit Gateway or Azure Virtual WAN Hub, or decentralized, with each VPC or VNet having direct internet access. [cloud-connector.regions.topology:region-independence]

**Failure across regions.** Failover between Service Edges is described per Cloud Connector, not across cloud regions: [Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open](kb:cloud-connector.overview.gateway-failover). Whether workloads in one region can fail over to Cloud Connectors in another, other than by routing changes, is not stated [gap:cloud-connector.regions.topology:cross-region-failover].

**Overlapping address space.** How namespaces keep tag mappings apart when AWS address ranges overlap: [Namespaces and the zs:namespace VPC tag: overlapping IPs in workload discovery](kb:cloud-connector.workload-discovery.namespaces). In Azure the same CIDR block can be reused in a deployment, but with VPC peering endpoints cannot separate the traffic, so the Cloud Connector group stack must be duplicated. [cloud-connector.regions.topology:azure-peering-duplicate-stack]

Cost and latency trade-offs of each layout are cloud-provider matters the captured sources do not state [gap:cloud-connector.regions.topology:placement-guidance].

What to check:
1. Whether the workload's region has its own Cloud Connector group or reaches one in a hub region through a transit gateway or virtual WAN hub.
2. In Azure with VNet peering and overlapping CIDRs, whether a separate Cloud Connector group stack serves each overlapping set.

Not known (open gaps):
- Failover of workloads to Cloud Connectors in another region [gap:cloud-connector.regions.topology:cross-region-failover]: settled by support-ticket or lab-test. Blocks: regional disaster-recovery answers
- Same-region placement and the cost of centralized egress [gap:cloud-connector.regions.topology:placement-guidance]: settled by source-read or operator-experience. Blocks: design recommendations on region placement

Area: cloud-connector.regions, its subjects in references/_meta/spine/cloud-connector/cloud-connector.regions.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.gateway-failover.md (Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.namespaces.md (Namespaces and the zs:namespace VPC tag: overlapping IPs in workload discovery)
