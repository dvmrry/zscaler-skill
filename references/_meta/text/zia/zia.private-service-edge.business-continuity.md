# Private Service Edges in the Business Continuity Cloud (zia.private-service-edge.business-continuity)
Also called: business continuity cloud; bc cloud; private policy cache; private pac server; business continuity mode; pse outage; z-tunnel 2.0 business continuity

The Zscaler-managed Business Continuity Cloud is a limited-availability feature; tenants subscribe to it through their Zscaler Sales Representative. [zia.private-service-edge.business-continuity:limited-availability] The Business Continuity Cloud has a private data plane that leverages Private Service Edges for Internet and SaaS (and for Private Access) and a private control plane that includes the Private Policy Cache and Private PAC Server. The Private Policy Cache is integrated into the Private Service Edge infrastructure and applies the last known good policy to traffic. [zia.private-service-edge.business-continuity:uses-pse-data-plane]

**When it applies.** The service mainly helps organizations stay connected and protected during critical failure scenarios in which the public clouds are unreachable. [zia.private-service-edge.business-continuity:trigger-is-critical-failure] Whether a PSE or ZIA service outage activates it is open [gap:zia.private-service-edge.business-continuity:bc-trigger-pse-outage].

**Prerequisites and tunnels.** Prerequisites for Internet and SaaS business continuity include Zscaler Client Connector 4.6 or later for Windows, Zscaler disaster recovery enabled in Client Connector, all security policies configured before entering business continuity, and GRE tunnel locations configured with authentication disabled. [zia.private-service-edge.business-continuity:prerequisites] Zscaler Tunnel 2.0 is not supported in business continuity mode. [zia.private-service-edge.business-continuity:z-tunnel-2-unsupported] The two vendor pages disagree about IPSec [divergence:zia.private-service-edge.business-continuity:supported-connectivity-methods].

How Z-Tunnel 2.0 interacts with a restrictive subcloud is in the [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds).

**What it will not do.** Only the last known good policy configuration applies to outgoing traffic in business continuity mode: recent policy updates might not take effect immediately, and new user authentication or enrollment is not supported. [zia.private-service-edge.business-continuity:last-known-good-policy]

Private Policy Cache and Private PAC Servers are deployed in redundant pairs in each Business Continuity Cloud site; they are managed by Zscaler and subject to ongoing updates and enhancements at any time. [zia.private-service-edge.business-continuity:redundant-pairs]

During public cloud software upgrades the Business Continuity Cloud upgrade is delayed on purpose to prevent upgrade-related issues; this also delays the update of new policies or configurations, for fault isolation. [zia.private-service-edge.business-continuity:upgrade-delay]

During normal operations the Private Policy Cache fetches, stores and regularly syncs tenant-specific configurations from the cloud so they are available in business continuity mode, and serves as the primary control path for local Service Edge instances; during business continuity it operates independently of public clouds to maintain security policies. [zia.private-service-edge.business-continuity:policy-cache-roles]

Private PAC Servers receive and locally store PAC files from the public cloud for each Business Continuity Cloud site; during business continuity they host disaster recovery PAC files that redirect client requests to the appropriate Business Continuity Cloud, and their geo-awareness lets Zscaler Client Connector connect to the nearest Business Continuity Cloud based on its IP address or location. [zia.private-service-edge.business-continuity:pac-servers]

What a Z-Tunnel 2.0 client does when the mode starts is open [gap:zia.private-service-edge.business-continuity:z-tunnel-2-fallback].

What to check:
1. Whether the prerequisites are in place before entering business continuity mode, including Client Connector 4.6 or later and disaster recovery enabled in Client Connector.
2. Whether the Z-Tunnel 2.0 path is in use, since it is not supported in this mode.

Sources disagree (name both sides):
- Whether IPSec tunnels are supported in business continuity mode. [divergence:zia.private-service-edge.business-continuity:supported-connectivity-methods]
  - zscaler-help: Z-Tunnel 1.0, PAC files, IPSec tunnel and GRE tunnel connectivity are supported.
  - zscaler-help: Only Z-Tunnel 1.0, PAC files and GRE tunnels are supported; IPSec is not listed.
  Impact: A tenant that forwards to the Business Continuity Cloud over IPSec cannot rely on either page alone. Both pages agree that Z-Tunnel 2.0 is not supported and that GRE, PAC and Z-Tunnel 1.0 are.

Not known (open gaps):
- Whether a PSE or ZIA service outage triggers business continuity mode [gap:zia.private-service-edge.business-continuity:bc-trigger-pse-outage]: settled by source-read or support-ticket
- What a Z-Tunnel 2.0 client does when business continuity mode starts [gap:zia.private-service-edge.business-continuity:z-tunnel-2-fallback]: settled by lab-test or support-ticket. Blocks: planning business continuity for a Z-Tunnel 2.0 fleet

Area: zia.private-service-edge, its subjects in references/_meta/spine/zia/zia.private-service-edge.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.private-service-edge: A ZIA Private Service Edge cluster is brought under policy by adding a Location to it. The ZIA pages describe no Private Service Edge group object and no provisioning key; groups and provisioning keys are a ZPA construct. [zia.private-service-edge.what-it-is:binds-through-location-not-group]
- depends-on references/_meta/text/zia/zia.private-service-edge.md (ZIA Private Service Edge): The Business Continuity Cloud has a private data plane that leverages Private Service Edges for Internet and SaaS (and for Private Access) and a private control plane that includes the Private Policy Cache and Private PAC Server. The Private Policy Cache is integrated into the Private Service Edge infrastructure and applies the last known good policy to traffic. [zia.private-service-edge.business-continuity:uses-pse-data-plane]
- depends-on references/_meta/text/zia/zia.private-service-edge.ip-requirements.md (Addresses, NAT, IPv6 and ports a Private Service Edge needs), from zia.private-service-edge: The Private Service Edge IP addresses must be public. [zia.private-service-edge.ip-requirements:addresses-must-be-public]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment), from zia.private-service-edge: Deploying outside the corporate firewall: Zscaler highly recommends sending HTTP/HTTPS traffic through a GRE or IPSec tunnel from the firewall to the Private Service Edges, which needs no firewall changes for the Private Service Edge's communications. Only HTTP/HTTPS goes to the Private Service Edges, all other traffic goes directly to the internet, and the traffic sent through the tunnels should be un-NATed for visibility. [zia.private-service-edge.deployment:outside-firewall-tunnels]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover), from zia.private-service-edge: If the organization uses PAC files to forward traffic to the Zscaler service, the PAC variables that point to the Private Service Edges must specify the subcloud Zscaler configured for the organization. [zia.private-service-edge.deployment:pac-subcloud]
- links-to references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/portfolio/portfolio.business-continuity-cloud.md (Business Continuity Cloud: components, constraints and what is open)
- see-also references/_meta/text/zia/zia.private-service-edge.cluster-architecture.md (How a Private Service Edge cluster is built and fails over)
