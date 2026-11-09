# What a Virtual Service Edge does not support (zia.virtual-service-edge.limits)
Also called: vse source ip anchoring; vse sipa; vse not supported; vse limitations

The Source IP Anchoring feature is not supported with Virtual Service Edges. [zia.virtual-service-edge.limits:no-sipa] So a tenant whose use case is Source IP Anchoring cannot get it from a Virtual Service Edge, and how Source IP Anchoring works and what it needs is [Source IP Anchoring: what it needs on each side](kb:zia.forwarding-control.sipa). The legacy advice that the hardware Private Service Edge supports it instead is not backed by any captured page ([Whether Source IP Anchoring is supported on the hardware Private Service Edge](kb:zia.virtual-service-edge.limits:pse-sipa-support)).

Other limits are tied to the platform and are covered where they arise: native clustering unambiguously only on ESXi (Hyper-V is an open divergence, [Where a Virtual Service Edge runs and which platforms can cluster](kb:zia.virtual-service-edge.platforms)), the SSL card only on ESXi and the memory floor ([How much a Virtual Service Edge VM can do](kb:zia.virtual-service-edge.sizing)), and no standalone in production ([The Virtual Service Edge cluster: limits, object, build order and Location binding](kb:zia.virtual-service-edge.clusters)).

What to check:
1. Whether the hardware Private Service Edge supports Source IP Anchoring, before recommending hardware for that reason.

Not known (open gaps):
- Whether Source IP Anchoring is supported on the hardware Private Service Edge [gap:zia.virtual-service-edge.limits:pse-sipa-support]: settled by source-read or support-ticket

Area: zia.virtual-service-edge, its subjects in references/_meta/spine/zia/zia.virtual-service-edge.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side): The Source IP Anchoring feature is not supported with Virtual Service Edges. [zia.virtual-service-edge.limits:no-sipa]
- depends-on references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.virtual-service-edge: For production, a Virtual Service Edge is deployed in a cluster. A cluster requires at least two Virtual Service Edges for active-active redundancy and load balancing, which provides N+1 redundancy for production. [zia.virtual-service-edge.clusters:production-needs-cluster]
- depends-on references/_meta/text/zia/zia.virtual-service-edge.platforms.md (Where a Virtual Service Edge runs and which platforms can cluster), from zia.virtual-service-edge: Virtual Service Edges are supported on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V and Google Cloud Platform. [zia.virtual-service-edge.platforms:supported-platforms]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.virtual-service-edge: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- links-to references/_meta/text/zia/zia.virtual-service-edge.sizing.md (How much a Virtual Service Edge VM can do)
