{{two-components}} {{upload-download-roles}} {{integrated-vs-dedicated-lb}}

**Failover.** {{n-plus-one}} {{carp-lb-pair}} {{service-edges-active-active}} {{no-standalone}} The per-design minimum and maximum node counts are in [[zia.private-service-edge.sizing]].

**Addressing.** {{traffic-to-vip}} {{same-l2-fabric}}

**Return path.** {{dsr}} {{asymmetric-return}} Switch-side settings for this are in [[zia.private-service-edge.deployment]].

The virtual form factor uses the same CARP and DSR model with customer-operated nodes: [[zia.virtual-service-edge.load-balancing]].
