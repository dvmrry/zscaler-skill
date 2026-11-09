# IPSec tunnels to Zscaler: where each question is answered (shared.ipsec)
Also called: ipsec tunnel; ipsec tunnels; ipsec vpn to zscaler; ipsec redundancy; ipsec virtual service edge; when to use ipsec

IPSec is the encrypted site tunnel to a ZIA Public or Private Service Edge. The answers live in a few subjects, and the vendor's reference architecture adds requirements the help articles state more softly.

1. **Is IPSec the right method?** The reference architecture recommends IPSec when it is mandated by policy or regulation, when the internet gateway does not support GRE tunnels, or when the gateway does not have a static IP address. [shared.ipsec:when-to-choose] The help article's version, with the GRE comparison, is [IPSec tunnels are the option when the router does not support GRE or the site has dynamic IP addresses. Compared with GRE it adds processing overhead on the customer's equipment, and the vendor must provide a VPN failover mechanism.](kb:zia.traffic-forwarding.ipsec:when-ipsec) and [Forwarding methods Zscaler supports and how to choose](kb:zia.traffic-forwarding.methods).
2. **How much can one tunnel carry?** Per-tunnel throughput and how to scale past it: [IPSec tunnels support 400 Mbps per public source IP address. Above that, use multiple tunnels with different public source IPs, or multiple tunnels from the same public source IP with NAT-T and source port randomization using IKEv2; 800 Mbps is two primary and two backup tunnels.](kb:zia.traffic-forwarding.ipsec:bandwidth-limit).
3. **How many tunnels, to where?** The reference architecture says Zscaler requires redundant IPSec tunnels to two different data centers, one active and one in standby, and requires primary and secondary tunnels from each internet egress point and, where a location has several ISPs, from each ISP. [shared.ipsec:required-redundancy] The help article words the same design as a recommendation: [Zscaler recommends two IPSec tunnels to two different Public Service Edges, a primary and a backup; if the primary or an intermediate connection fails, traffic is rerouted through the backup tunnel.](kb:zia.traffic-forwarding.ipsec:two-tunnels).
4. **Which credential identifies the site?** The two authentication types, FQDN and IP, each with a pre-shared key: [Zscaler no longer supports adding a new XAUTH VPN credential; existing ones can be edited or deleted. The console's Authentication Type choices for adding are FQDN and IP; each takes a pre-shared key.](kb:zia.traffic-forwarding.vpn-credentials:xauth-legacy). In the reference architecture the FQDN credential has a user ID field while the IP credential simply uses the peer's public IP address, and both take a pre-shared key of up to 255 characters. [shared.ipsec:credential-types] Credential limits and immutability are in [VPN credentials for IPSec: types, immutability and keys](kb:zia.traffic-forwarding.vpn-credentials).
5. **What does the device negotiate?** Recommended ciphers, PFS, NAT-T and DPD, and where the two vendor sources disagree: [IPSec device settings Zscaler recommends: ciphers, PFS, NAT-T and DPD](kb:shared.ipsec.device-settings). Supported parameter ranges, MTU and IPv6 selectors: [IPSec tunnels to ZIA: limits, IKE and device settings](kb:zia.traffic-forwarding.ipsec).

**Addressing inside the tunnel.** The reference architecture notes that with IPSec the site connects to its own network from a remote location, so station addresses need no translation, and that ensuring NAT is not in use allows more granular policy and enables Surrogate IP. [shared.ipsec:no-nat-inside] How Surrogate IP maps users to addresses is [Surrogate IP: mapping a private IP to an authenticated user](kb:zia.authentication.surrogate-ip).

**Virtual Service Edges.** Whether a ZIA Virtual Service Edge terminates IPSec depends on which vendor document is read [divergence:shared.ipsec:vse-termination]. The cluster setting itself is [IPSec Local Termination, off by default, terminates client IPSec traffic at the selected Virtual Service Edge instances of the cluster. For an instance in Cluster deployment mode the instance-level option is read-only and shows the actual status; it is changed on the Virtual Service Edge Clusters page.](kb:zia.virtual-service-edge.clusters:ipsec-local-termination); GRE to a Virtual Service Edge is covered from [GRE tunnels to Zscaler: where each question is answered](kb:shared.gre).

What to check:
1. Whether the site has primary and secondary tunnels to two data centers from every egress point and every ISP.
2. Whether the IPSec peer is a Virtual Service Edge, and if so whether IPSec Local Termination is enabled on its cluster.

Sources disagree (name both sides):
- Whether a ZIA Virtual Service Edge can terminate IPSec. [divergence:shared.ipsec:vse-termination]
  - zscaler-help: The reference architecture says a Virtual Service Edge does not terminate IPSec, so tunnels to it must be GRE or Client Connector.
  - zscaler-help: The Virtual Service Edge cluster article documents an IPSec Local Termination option that terminates client IPSec traffic at selected instances of the cluster.
  - zscaler-help: The cluster configuration article treats IPSec as a way traffic reaches a Virtual Service Edge.
  Impact: Read alone, the reference architecture rules out IPSec to a Virtual Service Edge; the cluster articles describe a setting that enables it, so a design built on the older statement may avoid an option the console offers.

Area: shared.ipsec, its subjects in references/_meta/spine/shared/shared.ipsec.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings)
- depends-on references/_meta/text/zia/zia.traffic-forwarding.vpn-credentials.md (VPN credentials for IPSec: types, immutability and keys): In the reference architecture the FQDN credential has a user ID field while the IP credential simply uses the peer's public IP address, and both take a pre-shared key of up to 255 characters. [shared.ipsec:credential-types]
- links-to references/_meta/text/shared/shared.gre.md (GRE tunnels to Zscaler: where each question is answered)
- links-to references/_meta/text/shared/shared.ipsec.device-settings.md (IPSec device settings Zscaler recommends: ciphers, PFS, NAT-T and DPD)
- links-to references/_meta/text/zia/zia.authentication.surrogate-ip.md (Surrogate IP: mapping a private IP to an authenticated user)
- links-to references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose)
- links-to references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding)
