# Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed (zero-trust-branch.overview)
Also called: zero trust branch; ztb; what is zero trust branch; branch sd-wan zscaler; network of one; ztb device segmentation; ztb appliance; airgap

Zero Trust Branch is a branch, factory and data-center product that combines SD-WAN forwarding with device segmentation. Zero Trust Branch protects branches, factories and data centers by combining SD-WAN capabilities with device segmentation, through Zero Trust Branch appliances deployed at the sites and the Zero Trust Exchange, without additional firewall appliances. [zero-trust-branch.overview:what-it-is]

**Forwarding.** The appliance terminates ISP connections directly and manages forwarding across multiple links; branch and cloud traffic is forwarded to the Zero Trust Exchange, where Internet & SaaS (ZIA) and Private Access (ZPA) policies are applied based on traffic destination and user identity. [zero-trust-branch.overview:zte-forwarding] Forwarding policies for internet and non-internet traffic are enforced using Internet & SaaS or Private Access. [zero-trust-branch.overview:forwarding-policies]

**Segmentation.** Device segmentation is agentless: the network-of-one technology automatically discovers, classifies and isolates each device on the branch or factory network, including IoT, OT, IoMT, headless devices and legacy systems. [zero-trust-branch.overview:network-of-one] When enabled, the Zero Trust Branch gateway becomes the default gateway for VLANs and gives every endpoint a /32 subnet mask (through its DHCP proxy, or by automation for static-IP devices), and all devices, even on the same VLAN, must communicate with each other through the gateway. [zero-trust-branch.overview:gateway-32]

**Other features.** The feature list includes automatic classification of shadow IoT devices based on traffic profiles, clientless browser-based access to SSH, RDP and VNC ports on OT assets, and Zero Touch Provisioning. [zero-trust-branch.overview:ot-access-and-classification]

**Deployment.** Zero Trust Branch has two components: Zero Trust Branch appliances (forwarding and network enforcement points in the customer environment, in physical and virtual options by throughput and scale) and the Zscaler Admin Console, which manages them. [zero-trust-branch.overview:deployment-components] The deployment overview says there are several ways to deploy and lists two: an appliance through Zero Touch Provisioning, and Zero Trust Branch as a virtual machine on VMware ESXi. [zero-trust-branch.overview:deployment-methods] Which hardware models exist is not in the captured overview [gap:zero-trust-branch.overview:appliance-models].

**Neighbours.** Zero Trust SD-WAN Devices, which the Cloud & Branch Connector help describes as using Zero Trust Branch Connectivity, are covered in [Zero Trust SD-WAN devices: gateway and one-arm modes, zero touch provisioning](kb:cloud-connector.sdwan.device-modes). The Zero Trust Branch cloud domain is in [The same list gives `goairgap.com` for Zero Trust Branch, `ztsim.com` for Zscaler Cellular, `zscalerrisk.net` for Zscaler Risk360 and `zslogin.net` for the Authentication Service.](kb:shared.cloud-architecture.cloud-names:other-services). Automating it is in [Automating Zero Trust Branch: the Python SDK client, its API-key sign-in, and what no other client covers](kb:zero-trust-branch.api).

**Deployment and operations.** Deployment preparation, installation and deployment are in [How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles](kb:zero-trust-branch.deployment); Zero Trust SD-WAN, device segmentation, analytics and troubleshooting in [Where Zero Trust Branch operations are documented: forwarding, Routed Tunnels, segmentation, integrations, logging, monitoring, the Debug Console, troubleshooting and upgrades](kb:zero-trust-branch.operations).

What to check:
1. Whether the question is about Zero Trust Branch appliances or about Cloud & Branch Connector (Branch Connector VMs and Zero Trust SD-WAN Devices), which have separate help, APIs and SDK packages.
2. Whether gateway mode is enabled when a device on the same VLAN cannot reach another directly: in that mode every endpoint gets a /32 mask and all traffic goes through the gateway.

Not known (open gaps):
- Which Zero Trust Branch hardware models and form factors exist [gap:zero-trust-branch.overview:appliance-models]: settled by source-read. Blocks: sizing or naming a Zero Trust Branch appliance for a site

Area: zero-trust-branch.overview, its subjects in references/_meta/spine/zero-trust-branch/zero-trust-branch.overview.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdwan.device-modes.md (Zero Trust SD-WAN devices: gateway and one-arm modes, zero touch provisioning)
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.api.md (Automating Zero Trust Branch: the Python SDK client, its API-key sign-in, and what no other client covers)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.deployment.md (How a Zero Trust Branch appliance is deployed: activation, ZTP, virtual machines, mainland China, upgrades and admin roles)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.operations.md (Where Zero Trust Branch operations are documented: forwarding, Routed Tunnels, segmentation, integrations, logging, monitoring, the Debug Console, troubleshooting and upgrades)
