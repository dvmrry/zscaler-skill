# How Virtual Service Edges and their clusters upgrade (zia.virtual-service-edge.upgrades)
Also called: vse upgrade; vse maintenance window; vse delay-upgrade; vse rolling upgrade; vse trial production upgrade order; vse cluster upgrade downtime

The Zscaler service automatically upgrades Virtual Service Edges during scheduled maintenance windows. The dates are published in the Zscaler Trust Portal, and no admin or Zscaler Cloud Operations intervention is required. [zia.virtual-service-edge.upgrades:automatic-in-windows] Customers do not run the upgrade, but they can influence its timing.

**In a cluster.** By design, Virtual Service Edges in a cluster are updated consecutively, so there is no down time. [zia.virtual-service-edge.upgrades:cluster-consecutive] Updates can be scheduled to begin no later than 24 hours after the maintenance window for the cloud the Virtual Service Edge is part of, by running `sudo vzen delay-upgrade HH:MM` (UTC, 24-hour) on each node. [zia.virtual-service-edge.upgrades:delay-upgrade-command] In a cluster, the delay-upgrade times configured on the nodes should differ by at least one hour to minimize downtime; for standalone nodes behind an external load balancer, split them into two logical groups at least an hour apart. [zia.virtual-service-edge.upgrades:stagger-one-hour]

**Trial versus production.** Trial Virtual Service Edge instances are upgraded first during a maintenance window, followed by production instances. The Deployment Status setting does not affect behavior, functionality or performance. [zia.virtual-service-edge.upgrades:trial-before-production]

The earlier worry that every node of a cluster may upgrade in the same window is answered by the consecutive-update statement ([Whether cluster upgrades are rolling or simultaneous](kb:zia.virtual-service-edge.upgrades:cluster-update-sequencing)). For cluster limits and structure see [The Virtual Service Edge cluster: limits, object, build order and Location binding](kb:zia.virtual-service-edge.clusters).

What to check:
1. Whether the delay-upgrade times on the cluster's nodes differ by at least an hour, since the no-downtime statement depends on the nodes upgrading one at a time.
2. Whether any two nodes share a delay-upgrade time, because identical times may defeat the staggering.
3. Whether a lab node marked Trial is an upgrade canary ahead of production nodes.

Area: zia.virtual-service-edge, its subjects in references/_meta/spine/zia/zia.virtual-service-edge.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.virtual-service-edge: For production, a Virtual Service Edge is deployed in a cluster. A cluster requires at least two Virtual Service Edges for active-active redundancy and load balancing, which provides N+1 redundancy for production. [zia.virtual-service-edge.clusters:production-needs-cluster]
- interacts-with references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side), from zia.virtual-service-edge: The Source IP Anchoring feature is not supported with Virtual Service Edges. [zia.virtual-service-edge.limits:no-sipa]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.virtual-service-edge: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- depends-on references/_meta/text/zia/zia.virtual-service-edge.platforms.md (Where a Virtual Service Edge runs and which platforms can cluster), from zia.virtual-service-edge: Virtual Service Edges are supported on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V and Google Cloud Platform. [zia.virtual-service-edge.platforms:supported-platforms]
