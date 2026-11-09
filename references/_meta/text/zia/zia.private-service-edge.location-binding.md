# Binding a Private Service Edge cluster to a Location, and the open-proxy hazard (zia.private-service-edge.location-binding)
Also called: pse open proxy; pse location; pse static ip location; pse support ticket location; pse location mapping; location pse cluster; pse forced to authenticate

Adding a Location to a cluster is what brings the cluster's traffic under per-location settings. Adding a location to a Private Service Edge cluster allows transaction logs to be viewed, categorized and reported per cluster, lets the organization manage authentication settings, IP Surrogacy settings, XFF consumption and Location group settings for SSL inspection and web filtering policies, and maps traffic and enforcement in a NAT environment. [zia.private-service-edge.location-binding:location-benefits] The Location object itself, including forwarding methods, sublocations and Location Groups, is [What a ZIA location is and what the console enforces for it](kb:zia.locations.model).

**The hazard.** Creating a new location for the Private Service Edges can make the cluster an open proxy, because the Central Authority has no automatic link between newly created Private Service Edge locations and the organization's actual Private Service Edge clusters. [zia.private-service-edge.location-binding:open-proxy-risk]

**The sequence that avoids it.** The location should use a Static IP address that the organization provisioned in the Admin Console, one per cluster. That public IP must be owned by the organization and must not be in use or assigned in any way to the Private Service Edge cluster. [zia.private-service-edge.location-binding:static-ip-per-cluster] The organization shares its known traffic forwarding ranges for the allowlist and contacts Zscaler Support to map the location to the Private Service Edges. Zscaler adds the location IP address and the known traffic forwarding ranges to all the Private Service Edge instances of that cluster. [zia.private-service-edge.location-binding:support-completes-mapping] With the mapping in place, only the organization's traffic is mapped to the Private Service Edge location's policies; any traffic not coming from the organization's allowlist is treated as a remote user and forced to authenticate. [zia.private-service-edge.location-binding:off-allowlist-is-remote-user] There can be a disruption in service while Zscaler maps the location to the Private Service Edges, so standard Network Operations Center change protocols apply if the cluster is already in production. [zia.private-service-edge.location-binding:mapping-disruption]

Whether later edits to a mapped Location need another ticket is open [gap:zia.private-service-edge.location-binding:ticket-for-every-change].

The virtual form factor's Location binding is in [The Virtual Service Edge cluster: limits, object, build order and Location binding](kb:zia.virtual-service-edge.clusters).

What to check:
1. Whether a Static IP exists for each cluster and is owned by the organization.
2. Whether the forwarding ranges were shared and Zscaler confirmed the mapping on every instance.
3. Whether any Location has no confirmed mapping, since that can be the open-proxy case.
4. Ask Zscaler whether later edits to a mapped Location need a ticket, rather than assuming either way.

Not known (open gaps):
- Whether every Location add or change needs a Support ticket [gap:zia.private-service-edge.location-binding:ticket-for-every-change]: settled by support-ticket

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): With the mapping in place, only the organization's traffic is mapped to the Private Service Edge location's policies; any traffic not coming from the organization's allowlist is treated as a remote user and forced to authenticate. [zia.private-service-edge.location-binding:off-allowlist-is-remote-user]
- depends-on references/_meta/text/zia/zia.private-service-edge.ip-requirements.md (Addresses, NAT, IPv6 and ports a Private Service Edge needs), from zia.private-service-edge: The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.private-service-edge: Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.private-service-edge: If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding)
