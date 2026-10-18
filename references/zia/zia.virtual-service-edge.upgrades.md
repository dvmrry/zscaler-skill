{{automatic-in-windows}} Customers do not run the upgrade, but they can influence its timing.

**In a cluster.** {{cluster-consecutive}} That "no down time" holds only if the nodes really do go one at a time, which is what the stagger rule protects. {{delay-upgrade-command}} {{stagger-one-hour}} (Inference: identical delay times on every node would likely defeat the sequencing, so check each node.) Note the wording: the by-design sequencing is described as "no down time", while the stagger advice aims for "minimal downtime".

**Trial versus production.** {{trial-before-production}} A lab Virtual Service Edge marked Trial is a useful canary, and marking a production node Trial does not change how it behaves, except upgrade order.

The earlier worry that every node of a cluster may upgrade in the same window is answered by the consecutive-update statement ([[zia.virtual-service-edge.upgrades:cluster-update-sequencing]]). For cluster limits and structure see [[zia.virtual-service-edge.clusters]].
