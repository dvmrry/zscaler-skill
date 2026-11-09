# VPN network segments: LAN subnets or FQDNs assigned to Network Connector groups (zpa.vpn.network-segments)
Also called: network segment; network segments; vpn network segment; lan ip subnet segment

A Network segment is a local area network (LAN) IP subnet assigned to a Network Connector group to define access to servers that are accessed via the VPN tunnel. Each Network segment has a LAN IP address range for a data center with running servers, and an FQDN and domain name server can also be assigned. [zpa.vpn.network-segments:definition] Network segments define the traffic flow between Zscaler Client Connector and the server IP address, and handle exception traffic for transformation towards Zero Trust access. [zpa.vpn.network-segments:purpose] The application segments are in [Which application segment a destination maps to when several overlap](kb:zpa.app-segments.matching).

**Placement.** When a Network segment is assigned to a Network Connector group, the Network Connector and the server associated with the LAN IP address must be from the same data center. [zpa.vpn.network-segments:same-data-center] The About Network Connector Groups page says a Network segment is mapped to one or multiple Network Connector groups for traffic forwarding. The add form selects the Network Connector Group to assign the segment to, and in the Edit Network Segment drawer any field can be modified. [zpa.vpn.network-segments:group-mapping]

**Addressing.** A Network segment is associated either with an IP address or IP subnet, or with an FQDN. An FQDN segment takes a Primary DNS Server used to resolve the configured FQDN and an optional Secondary DNS Server, and multiple IP addresses or IP subnets can be entered in a Network segment. [zpa.vpn.network-segments:ip-or-fqdn] Matching DNS requests destined for the default adapter's secondary DNS server are routed by Zscaler Client Connector to the Network segment's configured secondary DNS server. [zpa.vpn.network-segments:secondary-dns-routing]

**BGP.** The routes advertised by the BGP routers must match the IP subnets defined in the Network segments for BGP to work. [zpa.vpn.network-segments:bgp-routes-match] BGP is in [BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers](kb:zpa.vpn.bgp) and [VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors](kb:zpa.vpn.redundancy).

**Open.** The number of Network segments allowed is open [gap:zpa.vpn.network-segments:segment-limits].

The Network Connector groups are in [Network Connectors and Network Connector groups (VPN for Legacy Apps)](kb:zpa.vpn.network-connectors), the rules that allow the traffic in [VPN access policy rules: source, destination, default block, rule order and limits](kb:zpa.vpn.access-policy) and the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Whether the Network Connector and the server for a LAN IP address are in the same data center.
2. Whether the routes the BGP routers advertise match the IP subnets defined in the Network segments.

Not known (open gaps):
- How many Network segments a tenant or group may have [gap:zpa.vpn.network-segments:segment-limits]: settled by source-read

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.access-policy.md (VPN access policy rules: source, destination, default block, rule order and limits)
- links-to references/_meta/text/zpa/zpa.vpn.bgp.md (BGP for VPN Service Edges and Network Connectors: AS numbers, failure detection, external routers)
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.md (Network Connectors and Network Connector groups (VPN for Legacy Apps))
- links-to references/_meta/text/zpa/zpa.vpn.redundancy.md (VPN redundancy: failure scenarios, BGP group settings, platform settings, replacing and migrating Network Connectors)
