# How traffic reaches ZIA (zia.traffic-forwarding)
Also called: traffic forwarding; how does traffic get to zia; forwarding methods; gre ipsec pac zcc; ingestion

"How does this traffic get to ZIA?" splits into questions answered in order.

1. **Which methods exist, and which fits the site or user?** [Forwarding methods Zscaler supports and how to choose](kb:zia.traffic-forwarding.methods).
2. **Tunnels from a site.** GRE needs a static IP and has per-tunnel bandwidth limits: [GRE tunnels to ZIA: requirements, bandwidth and deployment](kb:zia.traffic-forwarding.gre), with health and failover in [GRE tunnel health checks and failover](kb:zia.traffic-forwarding.gre-failover). IPSec is the option for routers without GRE and for dynamic IPs: [IPSec tunnels to ZIA: limits, IKE and device settings](kb:zia.traffic-forwarding.ipsec), with its credential object in [VPN credentials for IPSec: types, immutability and keys](kb:zia.traffic-forwarding.vpn-credentials). The static IP a GRE tunnel needs, and an IPSec VPN credential needs only for IP-based PSK, is [Static IPs: when one is needed, provisioning, region mapping, CSV import and limits](kb:zia.traffic-forwarding.static-ips), and taking a data center's IPSec tunnels out of service for a period is [Excluding a data center from a forwarding method (IPSec tunnels) for a period](kb:zia.traffic-forwarding.dc-exclusion).
3. **Browsers and existing proxies.** [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac) and [Proxy chaining to ZIA: setup, XFF handling and limits](kb:zia.traffic-forwarding.proxy-chaining).
4. **Users who leave the network.** [Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes](kb:zia.traffic-forwarding.zcc).
5. **Several at once.** [Mixed forwarding deployments and where they break](kb:zia.traffic-forwarding.mixed-deployments).
6. **Networks with no default route.** [ZIA in a no-default-route network: PAC options, tunnels and where the SLA stops](kb:zia.traffic-forwarding.no-default-route).
7. **IPv6 clients.** Which method carries IPv6, and what it needs, is [IPv6 through ZIA: forwarding per method, prerequisites, processing and policy](kb:zia.traffic-forwarding.ipv6); the NAT64 and DNS64 prefixes are [NAT64 and DNS64 prefixes: custom prefixes, selection order and limits](kb:zia.traffic-forwarding.ipv6-prefixes).
8. **Special deployments.** Azure Virtual WAN hubs are [Azure Virtual WAN integration: prerequisites, limitations, service principal, hub sync and errors](kb:zia.traffic-forwarding.azure-vwan); China Premium Access, for organizations whose users work from mainland China, is [China Premium and Premium Plus Internet Access: service model, provisioning, backup, licensing and DNS](kb:zia.traffic-forwarding.china-premium); partner networks reached through Private Access are [Extranet Application Support: extranets, traffic selectors, extranet locations and traffic flow](kb:zia.traffic-forwarding.extranet); Citrix workloads are [Forwarding Citrix XenDesktop and XenApp workloads to ZIA](kb:zia.traffic-forwarding.citrix-workloads).
9. **Who resolves DNS for each method.** [Who resolves DNS for each forwarding method](kb:zia.traffic-forwarding.dns-resolution).
10. **Is the traffic arriving, and at the nearest edge?** [ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge](kb:zia.traffic-forwarding.verification).

**Once the traffic arrives.** How it learns the destination host (explicit versus transparent) is [ZIA proxy modes: explicit and transparent](kb:zia.proxy-mode); where ZIA sends traffic onward is [ZIA Forwarding Control and Source IP Anchoring](kb:zia.forwarding-control); how users are identified on each path is [ZIA authentication: how a request gets a user identity](kb:zia.authentication); which source networks are known is [ZIA locations, sublocations and location groups](kb:zia.locations); and how the firewall sees each path is [Where the firewall sits in the traffic path](kb:zia.firewall.traffic-path).

Area: zia.traffic-forwarding, its subjects in references/_meta/spine/zia/zia.traffic-forwarding.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.firewall.traffic-path.md (Where the firewall sits in the traffic path): For Z-Tunnel 1.0 and PAC traffic, the firewall must be enabled in Advanced Settings for this type of traffic: the option is Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors. [zia.firewall.traffic-path:ztunnel-pac-opt-in]
- interacts-with references/_meta/text/zia/zia.forwarding-control.md (ZIA Forwarding Control and Source IP Anchoring): Forwarding Control policy forwards selected Zscaler traffic to specific endpoints: directly, through a third-party proxy service, through a Zscaler-assigned dedicated IP address or GeoIP address, or to a Private Access App Connector through a Private Access gateway. [zia.forwarding-control:overview]
- interacts-with references/_meta/text/zia/zia.proxy-mode.md (ZIA proxy modes: explicit and transparent): Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- interacts-with references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user): Surrogate IP requires one IP per user as the service sees it, so NAT cannot be used: all users behind it look like one address. Supported forwarding is a GRE or IPSec tunnel without NAT, forward proxy chaining with XFF forwarding turned on for the location or sublocation, or a dedicated proxy port, and Enforce Authentication must be on for the location or sublocation. [zia.authentication.surrogate-ip:no-nat]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it): A location identifies a network from which the organization sends internet traffic; the service checks whether arriving traffic comes from a configured (known) location or an unknown one (remote user traffic), and processes known-location traffic by the location's settings. [zia.locations.model:identifies-networks]
- links-to references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity)
- links-to references/_meta/text/zia/zia.locations.md (ZIA locations, sublocations and location groups)
- links-to references/_meta/text/zia/zia.traffic-forwarding.azure-vwan.md (Azure Virtual WAN integration: prerequisites, limitations, service principal, hub sync and errors)
- links-to references/_meta/text/zia/zia.traffic-forwarding.china-premium.md (China Premium and Premium Plus Internet Access: service model, provisioning, backup, licensing and DNS)
- links-to references/_meta/text/zia/zia.traffic-forwarding.citrix-workloads.md (Forwarding Citrix XenDesktop and XenApp workloads to ZIA)
- links-to references/_meta/text/zia/zia.traffic-forwarding.dc-exclusion.md (Excluding a data center from a forwarding method (IPSec tunnels) for a period)
- links-to references/_meta/text/zia/zia.traffic-forwarding.dns-resolution.md (Who resolves DNS for each forwarding method)
- links-to references/_meta/text/zia/zia.traffic-forwarding.extranet.md (Extranet Application Support: extranets, traffic selectors, extranet locations and traffic flow)
- links-to references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment)
- links-to references/_meta/text/zia/zia.traffic-forwarding.gre-failover.md (GRE tunnel health checks and failover)
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings)
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipv6.md (IPv6 through ZIA: forwarding per method, prerequisites, processing and policy)
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipv6-prefixes.md (NAT64 and DNS64 prefixes: custom prefixes, selection order and limits)
- links-to references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose)
- links-to references/_meta/text/zia/zia.traffic-forwarding.mixed-deployments.md (Mixed forwarding deployments and where they break)
- links-to references/_meta/text/zia/zia.traffic-forwarding.no-default-route.md (ZIA in a no-default-route network: PAC options, tunnels and where the SLA stops)
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)
- links-to references/_meta/text/zia/zia.traffic-forwarding.proxy-chaining.md (Proxy chaining to ZIA: setup, XFF handling and limits)
- links-to references/_meta/text/zia/zia.traffic-forwarding.static-ips.md (Static IPs: when one is needed, provisioning, region mapping, CSV import and limits)
- links-to references/_meta/text/zia/zia.traffic-forwarding.verification.md (ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge)
- links-to references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys)
- links-to references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zia/zia.terraform.traffic-forwarding-resources.md (Terraform GRE tunnel, static IP, VPN credential and location resources)
- see-also references/_meta/text/zia/zia.traffic-forwarding.runbook.md (How the Internet & SaaS traffic forwarding troubleshooting runbook triages a case and routes it to its pages)
