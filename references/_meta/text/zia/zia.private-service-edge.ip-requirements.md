# Addresses, NAT, IPv6 and ports a Private Service Edge needs (zia.private-service-edge.ip-requirements)
Also called: pse ip addresses; pse public ip; pse nat; pse 1:1 nat; pse ipv6; pse switch ports; pse sfp; pse ntp dns; pse ipmi; pse mts ip; rfc 1918 pse
Former IDs: zia-62

**Everything is public.** The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]

**The per-node budget** depends on the design from [Choosing a Private Service Edge design and node count](kb:zia.private-service-edge.sizing). Private Service Edge 3 with Integrated LB: 3 IPv4 and 3 IPv6 service addresses per node, 1 management address, 1 IPMI address, an integrated LB address (1 IPv4 and 1 IPv6 per node), a cluster virtual IP (1 IPv4 and 1 IPv6 per node), and 6 x 1GE switch ports. Private Service Edge 5 with Integrated LB: 5 IPv4 and 5 IPv6 service addresses per node, the same management, IPMI, LB and virtual IP counts, and 2 x 10GE plus 3 x 1GE switch ports. [zia.private-service-edge.ip-requirements:integrated-lb-budget] Private Service Edge 5 with Dedicated LB: 6 IPv4 and 6 IPv6 service addresses per node, an LB address and a cluster virtual IP each mapped 1:1 between IPv4 and IPv6 up to 4 in total, 1 MTS address, 1 management address, 1 IPMI address, and 3 x 1GE plus up to 8 x 10GE switch ports. [zia.private-service-edge.ip-requirements:dedicated-lb-budget] The cluster VIP is labelled per cluster but counted per node [gap:zia.private-service-edge.ip-requirements:vip-count-wording]. Small form-factor pluggables (SFPs) are not shipped with the server. [zia.private-service-edge.ip-requirements:sfps-not-shipped]

**IPv6.** IPv6 service addresses are required only if the organization needs IPv6 traffic to egress its Private Service Edges, and the Dedicated LB does not need any IPv6 address. For dual-stack IPv6 support the organization must provide IPv6 addresses and ensure the upstream network path supports IPv6. [zia.private-service-edge.ip-requirements:ipv6-optional] Forwarding IPv6 traffic through the IPv4-based IPSec tunnel requires an additional IPv4 or IPv6 address for each Private Service Edge node; IPv6 native traffic can also be forwarded to the cluster VIP addresses. [zia.private-service-edge.ip-requirements:ipv6-tunnel-extra-address]

**NAT.** If the deployment requires RFC 1918 addresses and NAT, the Private Service Edge addresses must have 1:1 static NAT to a public IP address, and IPv6 is not supported in this type of deployment. [zia.private-service-edge.ip-requirements:nat-one-to-one-no-ipv6] Whether a many-to-one (overloaded) NAT merely forfeits IPv6 or breaks the PSE outright is open [gap:zia.private-service-edge.ip-requirements:shared-nat-behavior].

**What Zscaler needs from you.** The organization must give Zscaler the gateway address, its NTP server addresses (otherwise Zscaler uses public NTP servers), its DNS server addresses (otherwise Zscaler uses public DNS servers), and the installation location address and contact details. [zia.private-service-edge.ip-requirements:customer-supplied-network-info]

**Firewall.** Zscaler Cloud Operations needs remote access to the Private Service Edge for monitoring, maintenance and updates as the cloud expands, so Zscaler recommends deploying inside the DMZ and restricting access to the Zscaler IP addresses listed at config.zscaler.com/<Zscaler Cloud Name>/zia-sedge. [zia.private-service-edge.ip-requirements:cloud-ops-remote-access] Which published firewall list applies is open [Which published firewall list applies to a PSE](kb:zia.private-service-edge.deployment:firewall-list-source).

What to check:
1. Budget the address pool per node, multiplied by the node count, plus the switch ports.
2. Confirm the cluster VIP count with Zscaler before ordering address space.
3. Use 1:1 static NAT for RFC 1918 addresses, not many-to-one NAT.

Not known (open gaps):
- Whether shared or overloaded (PAT) NAT breaks a PSE or only forfeits IPv6 [gap:zia.private-service-edge.ip-requirements:shared-nat-behavior]: settled by support-ticket
- Whether the cluster virtual IP is counted per node or per cluster [gap:zia.private-service-edge.ip-requirements:vip-count-wording] (data gap): filled by operator; settled by support-ticket

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.private-service-edge: A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.private-service-edge: Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.private-service-edge: If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/zia/zia.private-service-edge.deployment.md (Where to place a Private Service Edge and how to configure the network around it)
- links-to references/_meta/text/zia/zia.private-service-edge.sizing.md (Choosing a Private Service Edge design and node count)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.private-service-edge.md (ZIA Private Service Edge)
