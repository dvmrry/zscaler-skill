**Interfaces and addresses.** {{three-interfaces}} {{four-address-roles}} Cluster-level fields are in [[zia.virtual-service-edge.clusters]]; the API names are in [[zia.virtual-service-edge.api-surface]].

**Reaching the Zscaler cloud.** {{outbound-only}} The configuration article points to a different published list (`config.zscaler.com/<cloud>/fcr`) for firewall requirements, so check both pages for the tenant's cloud. {{default-ports-and-443}}

**IPv6.** {{ipv6-tunnel-only}} The hardware form factor has different, native IPv6 options: [[zia.private-service-edge.ip-requirements]].

**NAT.** Not established ([[zia.virtual-service-edge.network-requirements:vse-nat-topology]]). Do not apply the hardware 1:1 static NAT rule to a Virtual Service Edge without confirming it.
