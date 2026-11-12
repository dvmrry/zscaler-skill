# When a Private Service Edge is warranted (zia.private-service-edge.when-to-deploy)
Also called: do we need a private service edge; pse triggers; pse vs public service edge decision; data residency service edge; source ip service edge; pse throughput threshold

Private Service Edges typically benefit organizations that have geopolitical requirements or that use applications requiring the organization's IP address as the source IP address. [zia.private-service-edge.when-to-deploy:benefits-geo-and-source-ip] The same list recurs where Zscaler describes where it can deploy one. Zscaler can deploy Private Service Edges in locations with geopolitical requirements and regulations, locations with high latency to Public Service Edges, applications that require the organization's IP address as the source IP, users who need localized content, or where overall upload throughput is beyond 1 Gbps or download throughput is beyond 2 Gbps. Lower bandwidths can be considered as exceptions. [zia.private-service-edge.when-to-deploy:deployable-criteria]

For more than 1 Gbps of download throughput, Zscaler recommends deploying Private Service Edges. [zia.private-service-edge.when-to-deploy:recommend-above-1gbps-download] Which throughput threshold qualifies a location is open [gap:zia.private-service-edge.when-to-deploy:threshold-wording]. Size from [Choosing a Private Service Edge design and node count](kb:zia.private-service-edge.sizing).

**The comparison page.** In the vendor's Private versus Virtual Service Edge comparison, the Private Service Edge is a good choice for high throughput, especially when the overall uplink throughput traffic is above 1 Gbps; it supports remote user traffic and has inbuilt SSL inspection, at least two are required for redundancy, Cloud Operations configures, maintains and monitors it, and Zscaler provides the hardware and software. The page refers the choice to the Zscaler Account team. [zia.private-service-edge.when-to-deploy:comparison-pse] Its 1 Gbps wording is on uplink rather than download [divergence:zia.private-service-edge.when-to-deploy:uplink-or-download].

If the driver is only that the organization wants software it runs itself, the virtual form factor has the same four reasons for existing and a much lower per-instance ceiling: [Where a Virtual Service Edge runs and which platforms can cluster](kb:zia.virtual-service-edge.platforms). Source IP Anchoring is a separate feature: [Source IP Anchoring: what it needs on each side](kb:zia.forwarding-control.sipa).

What to check:
1. Start from the reasons, geopolitical, latency, source IP, localized content or throughput, before the throughput threshold alone.
2. Whether the destination keys on the source IP before choosing hardware.
3. Quote the page's throughput wording rather than a single number.

Sources disagree (name both sides):
- Whether the 1 Gbps Private Service Edge threshold is on download or on overall uplink throughput. [divergence:zia.private-service-edge.when-to-deploy:uplink-or-download]
  - zscaler-help: The understanding article recommends Private Service Edges for more than 1 Gbps of download throughput.
  - zscaler-help: The comparison page calls the Private Service Edge a good choice for high throughput, especially when overall uplink throughput traffic is above 1 Gbps.
  Impact: The same 1 Gbps figure is attached to download on one page and to overall uplink on the other, so it cannot be applied to a link without knowing which is meant; see also the open threshold-wording gap.

Not known (open gaps):
- Which throughput threshold qualifies a location for a PSE [gap:zia.private-service-edge.when-to-deploy:threshold-wording]: settled by support-ticket

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.private-service-edge: A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group]
- depends-on references/_meta/text/zia/zia.private-service-edge.ip-requirements.md (Addresses, NAT, IPv6 and ports a Private Service Edge needs), from zia.private-service-edge: The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.private-service-edge: Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.private-service-edge: If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side)
- links-to references/_meta/text/zia/zia.private-service-edge.sizing.md (Choosing a Private Service Edge design and node count)
- links-to references/_meta/text/zia/zia.virtual-service-edge.platforms.md (Where a Virtual Service Edge runs and which platforms can cluster)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.private-service-edge.md (ZIA Private Service Edge)
