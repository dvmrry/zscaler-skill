# ZIA Private Service Edge (zia.private-service-edge)
Also called: private service edge; pse; on-prem service edge; zia pse; pse 3; pse 5; pse cluster; dedicated lb; open proxy pse

A Private Service Edge (PSE) question is usually one of seven, and the answers are independent enough that skipping one is how a deployment plan goes wrong.

1. **What is it, and is it the ZIA product I think it is?** Hardware in the customer's data center, run by Zscaler, and not the same thing as the ZPA Private Service Edge: [What a ZIA Private Service Edge is, who runs it, and what it is not](kb:zia.private-service-edge.what-it-is).
2. **Do we need one at all?** The documented triggers, and the throughput thresholds that go with them: [When a Private Service Edge is warranted](kb:zia.private-service-edge.when-to-deploy).
3. **How does a cluster behave?** Load balancer pair, active-active Service Edges, Direct Server Return, minimum node counts: [How a Private Service Edge cluster is built and fails over](kb:zia.private-service-edge.cluster-architecture).
4. **Which design and how many nodes?** [Choosing a Private Service Edge design and node count](kb:zia.private-service-edge.sizing).
5. **What do we have to provide?** Public addresses per node, NAT, IPv6, switch ports: [Addresses, NAT, IPv6 and ports a Private Service Edge needs](kb:zia.private-service-edge.ip-requirements). Placement, switch settings and tunnels: [Where to place a Private Service Edge and how to configure the network around it](kb:zia.private-service-edge.deployment). Racking, ports and cabling, and the Cloud Operations handoff: [Racking and cabling Private Service Edge hardware, and the Cloud Operations handoff](kb:zia.private-service-edge.hardware-install).
6. **How does traffic reach policy?** A cluster is brought under policy through a Location, and getting that wrong makes it an open proxy: [Binding a Private Service Edge cluster to a Location, and the open-proxy hazard](kb:zia.private-service-edge.location-binding).
7. **Add-ons and failure modes.** EDM and IDM hosting: [Advanced DLP Private Service Edge for EDM and IDM](kb:zia.private-service-edge.advanced-dlp). The Business Continuity Cloud: [Private Service Edges in the Business Continuity Cloud](kb:zia.private-service-edge.business-continuity).

The software form factor and its clusters are a separate walk: [ZIA Virtual Service Edge](kb:zia.virtual-service-edge). The Location object itself is [What a ZIA location is and what the console enforces for it](kb:zia.locations.model).

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group]
- depends-on references/_meta/text/zia/zia.private-service-edge.ip-requirements.md (Addresses, NAT, IPv6 and ports a Private Service Edge needs): The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment): Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover): If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/zia/zia.private-service-edge.advanced-dlp.md (Advanced DLP Private Service Edge for EDM and IDM)
- links-to references/_meta/text/zia/zia.private-service-edge.business-continuity.md (Private Service Edges in the Business Continuity Cloud)
- links-to references/_meta/text/zia/zia.private-service-edge.cluster-architecture.md (How a Private Service Edge cluster is built and fails over)
- links-to references/_meta/text/zia/zia.private-service-edge.deployment.md (Where to place a Private Service Edge and how to configure the network around it)
- links-to references/_meta/text/zia/zia.private-service-edge.hardware-install.md (Racking and cabling Private Service Edge hardware, and the Cloud Operations handoff)
- links-to references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard)
- links-to references/_meta/text/zia/zia.private-service-edge.sizing.md (Choosing a Private Service Edge design and node count)
- links-to references/_meta/text/zia/zia.private-service-edge.what-it-is.md (What a ZIA Private Service Edge is, who runs it, and what it is not)
- links-to references/_meta/text/zia/zia.private-service-edge.when-to-deploy.md (When a Private Service Edge is warranted)
- links-to references/_meta/text/zia/zia.virtual-service-edge.md (ZIA Virtual Service Edge)
