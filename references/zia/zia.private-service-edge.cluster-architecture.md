{{two-components}} {{upload-download-roles}} {{integrated-vs-dedicated-lb}}

**Failover.** {{n-plus-one}} {{carp-lb-pair}} {{service-edges-active-active}} {{no-standalone}} A one-node PSE is not a smaller PSE; it is an unsupported one. The per-design minimum and maximum node counts are in [[zia.private-service-edge.sizing]].

**Addressing.** {{traffic-to-vip}} {{same-l2-fabric}} Clients and tunnels should be pointed at the VIP, never at an individual Service Edge instance.

**Direct Server Return is the part that bites.** {{dsr}} {{asymmetric-return}} A stateful device on the path should be checked for this. Return traffic that never passes back through the LB also explains why the switch-side settings in [[zia.private-service-edge.deployment]] (gratuitous ARP in particular) are not optional.

The virtual form factor uses the same CARP and DSR model with customer-operated nodes: [[zia.virtual-service-edge.load-balancing]].
