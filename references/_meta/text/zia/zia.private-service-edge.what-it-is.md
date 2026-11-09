# What a ZIA Private Service Edge is, who runs it, and what it is not (zia.private-service-edge.what-it-is)
Also called: what is a private service edge; pse vs public service edge; pse vs zpa pse; pse group zia; pse provisioning key; pse health dashboard; pse zdx

A Private Service Edge is part of the Zscaler cloud and performs the same service as the Public Service Edge, including Firewall, Sandbox and DLP. It talks to the Central Authority for user authentication and policy updates, and to the cloud routers and Nanolog clusters for logging and reporting. [zia.private-service-edge.what-it-is:same-service-as-public] Private Service Edges are installed in an organization's data center and dedicated to its traffic, but they are managed and maintained by Zscaler Cloud Operations, which monitors and maintains them with near-zero touch from the organization. [zia.private-service-edge.what-it-is:dedicated-managed-by-zscaler] Zscaler treats a Private Service Edge as an extension of the Internet and SaaS service: even when installed and maintained in the customer's data center, it is subject to maintenance, alterations, updates, enhancements, additions or improvements at any time. [zia.private-service-edge.what-it-is:zscaler-may-change-it]

The Private Service Edge is available in hardware and virtual form. The virtual form can be deployed on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V and Google Cloud Platform. [zia.private-service-edge.what-it-is:hardware-and-virtual] The software form factor is customer-operated and has its own cluster rules, covered in [ZIA Virtual Service Edge](kb:zia.virtual-service-edge). The hardware designs and their limits are in [Choosing a Private Service Edge design and node count](kb:zia.private-service-edge.sizing). The network around the hardware is in [Addresses, NAT, IPv6 and ports a Private Service Edge needs](kb:zia.private-service-edge.ip-requirements) and [Where to place a Private Service Edge and how to configure the network around it](kb:zia.private-service-edge.deployment).

The Public Service Edge throughput and routing labels in the legacy comparison are open [gap:zia.private-service-edge.what-it-is:unverified-comparison-rows].

Monitoring: The ZIA PSE Health Dashboard page shows Private Service Edge health for tenants that have a Digital Experience (ZDX) subscription. [zia.private-service-edge.what-it-is:health-dashboard-needs-zdx] What a tenant without ZDX gets instead is open [gap:zia.private-service-edge.what-it-is:no-zdx-monitoring].

**The name collides with ZPA.** The ZPA Private Service Edge is a Private Access component: a single-tenant broker that provides the functionality of a Public Service Edge for Private Access, managing the connections between Zscaler Client Connector and App Connectors. [zia.private-service-edge.what-it-is:zpa-pse-is-different] A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group] The ZIA binding is the Location, and it carries a hazard: [Binding a Private Service Edge cluster to a Location, and the open-proxy hazard](kb:zia.private-service-edge.location-binding).

Whether any API provisions a hardware PSE is open [gap:zia.private-service-edge.what-it-is:hardware-pse-api].

What to check:
1. Whether an answer about a ZIA PSE mentions a group or provisioning key, which belong to ZPA rather than ZIA.
2. Do not state that a hardware PSE can or cannot be provisioned through the API.

Inferred, not quoted (say so when an answer rests on one):
- [zia.private-service-edge.what-it-is:binds-through-location-not-group] Tier B: Rests on absence: the captured ZIA Private Service Edge pages describe the Location binding and mention neither a group object nor a provisioning key, while the group page is in the ZPA help area. A ZIA-side group object that no captured page mentions cannot be ruled out.

Not known (open gaps):
- What PSE health visibility a tenant without ZDX gets [gap:zia.private-service-edge.what-it-is:no-zdx-monitoring]: settled by lab-test or support-ticket
- Whether any API provisions hardware PSE 3 / PSE 5 [gap:zia.private-service-edge.what-it-is:hardware-pse-api]: settled by code-read or support-ticket
- Public Service Edge throughput and routing characterization [gap:zia.private-service-edge.what-it-is:unverified-comparison-rows] (data gap): filled by none; settled by source-read

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.private-service-edge.ip-requirements.md (Addresses, NAT, IPv6 and ports a Private Service Edge needs), from zia.private-service-edge: The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.private-service-edge: A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.private-service-edge: Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.private-service-edge: If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/zia/zia.private-service-edge.deployment.md (Where to place a Private Service Edge and how to configure the network around it)
- links-to references/_meta/text/zia/zia.private-service-edge.location-binding.md (Binding a Private Service Edge cluster to a Location, and the open-proxy hazard)
- links-to references/_meta/text/zia/zia.private-service-edge.sizing.md (Choosing a Private Service Edge design and node count)
- links-to references/_meta/text/zia/zia.virtual-service-edge.md (ZIA Virtual Service Edge)
