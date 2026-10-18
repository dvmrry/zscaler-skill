**Inside the cluster.** {{bundled-lb}} {{carp-active-passive}} {{dsr}} This is the same CARP and DSR model as the hardware cluster ([[zia.private-service-edge.cluster-architecture]]); the difference is that the customer runs it. As with the hardware cluster, the return path does not come back through the load balancer, so stateful devices between the cluster and clients must tolerate it.

**What must be true on ESXi for CARP to work.** {{esxi-vswitch-settings}} {{esxi-reverse-path-check}} These are the usual cause of a cluster that comes up but never elects or flaps.

**Probes.** The load balancer checks each member (see [[zia.virtual-service-edge.clusters]]). {{health-probe-firewall-rule}} Firewall policy semantics are [[zia.firewall]].

**Which platform gets which model.** {{inbuilt-lb-recommended-on-esxi}} Platform cluster support, including the Hyper-V disagreement, is [[zia.virtual-service-edge.platforms]].

**External load balancers.** {{external-lb-discouraged}} {{standalone-needs-external-lb-for-ha}} The referenced article is not captured ([[zia.virtual-service-edge.load-balancing:external-lb-article]]).

**Do not confuse it with Multi-Cluster Load Sharing.** {{mcls-is-public-se-only}}
