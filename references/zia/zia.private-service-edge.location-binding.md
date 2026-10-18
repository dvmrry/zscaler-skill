Adding a Location to a cluster is what brings the cluster's traffic under per-location settings. {{location-benefits}} The Location object itself, including forwarding methods, sublocations and Location Groups, is [[zia.locations.model]].

**The hazard.** {{open-proxy-risk}} This is an operational gap in the binding, created by the act of adding the Location.

**The sequence that avoids it.** {{static-ip-per-cluster}} {{support-completes-mapping}} {{off-allowlist-is-remote-user}} {{mapping-disruption}}

When reviewing an existing PSE, check the pieces in order: a Static IP exists per cluster, it is owned by the organization, the forwarding ranges were shared, and Zscaler confirmed the mapping on every instance. A Location with no confirmed mapping can be the open-proxy case. Whether later edits to a mapped Location need another ticket is not stated ([[zia.private-service-edge.location-binding:ticket-for-every-change]]); ask rather than assume.

The virtual form factor's Location binding is in [[zia.virtual-service-edge.clusters]].
