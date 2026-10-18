{{automatic-in-windows}} Customers do not run the upgrade, but they can influence its timing.

**In a cluster.** {{cluster-consecutive}} {{delay-upgrade-command}} {{stagger-one-hour}}

**Trial versus production.** {{trial-before-production}}

The earlier worry that every node of a cluster may upgrade in the same window is answered by the consecutive-update statement ([[zia.virtual-service-edge.upgrades:cluster-update-sequencing]]). For cluster limits and structure see [[zia.virtual-service-edge.clusters]].
