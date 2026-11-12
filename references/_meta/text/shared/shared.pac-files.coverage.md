# What PAC forwarding leaves uncovered: non-web applications, mobile users and private-application destinations (shared.pac-files.coverage)
Also called: pac non-browser clients; pac curl python docker; pac mobile users; pac ios android; pac ipv6; pac and zpa; pac browser access bypass; pac road warriors
Former IDs: shared-26, shared-27

A PAC file only steers applications that read it, so its coverage is decided on the client. What PAC forwarding cannot do inside the service (no Bandwidth Control or Firewall, no sublocations without XFF) is in [PAC forwarding cannot use features that need a tunnel (Bandwidth Control and Firewall), covers only applications that support PAC files, can be bypassed by end users disabling the file, loses internal IP visibility and sublocation policy unless XFF headers are inserted (group and user policy still apply), and can affect SLAs and performance without GRE or IPSec.](kb:zia.traffic-forwarding.pac:limitations).

**Where the vendor places PAC files.** The reference architecture calls PAC files an older technology, designed before most stations were mobile and when computer systems generally had a single network interface, and recommends them only where traffic is all web-based and no other forwarding option (Client Connector, GRE, IPSec or a dedicated proxy port) is feasible for the device. [shared.pac-files.coverage:web-only] Because the browser itself fetches the PAC file and forwards accordingly, traffic reaches the service on any network, and Zscaler recommends a PAC file for each user in addition to a GRE or IPSec tunnel to cover users outside the corporate network. [shared.pac-files.coverage:per-user-coverage]

**Applications that do not read PAC files.** Not all applications support PAC files; for native non-web applications that reach internet hosts, the reference architecture says to check PAC support with the application's vendor. [shared.pac-files.coverage:not-all-apps] Which common clients and runtimes honor a PAC file, and what Zscaler recommends for them, is open [gap:shared.pac-files.coverage:non-browser-clients]. QUIC, which a TCP-only path does not carry, is [So when the only traffic sent to Zscaler is Client Connector traffic on Z-Tunnel 1.0, or TCP 80 and 443 over a tunnel, QUIC UDP does not reach Zscaler at all, and no Zscaler Firewall Filtering rule inspects or blocks it.](kb:zia.saas-apps.quic-conferencing:tunnel1-udp-leaves), and PAC forwarding beyond HTTP and HTTPS is open in [What PAC forwarding carries beyond HTTP and HTTPS](kb:zia.traffic-forwarding.pac:non-web-traffic).

**Mobile users.** Zscaler offers Client Connector or PAC files to connect mobile users and recommends Client Connector, with PAC files a last resort when Client Connector cannot be installed; Client Connector is included in the subscription and is required for other services such as ZPA and ZDX. [shared.pac-files.coverage:mobile-zcc-preferred] Zscaler's Google Workspace deployment of Client Connector on Android sets it as the always-on VPN app. [shared.pac-files.coverage:android-always-on] Per-network proxy settings on iOS and Android are open [gap:shared.pac-files.coverage:mobile-os-pac]. What Client Connector does on a captive portal is [The app may need to disable its Internet Security service and let users reach the internet directly in three situations: a captive portal requires payment or acceptance before connecting, the app cannot reach ZIA Public Service Edges, or it cannot set up its Z-Tunnel.](kb:zcc.forwarding-profiles.fail-open:situations).

**IPv6.** Forwarding IPv6 through a PAC file needs the host-name variables: [The ${GATEWAY_HOST} variable resolves to a host name instead of an IP address, and the page's example returns ${GATEWAY_HOST} with ${SECONDARY_GATEWAY_HOST} as the fallback proxy. It is a recommended configuration for Kerberos authentication and for IPv6: Zscaler recommends the host-name variable to forward IPv6 traffic, with IPv6 support enabled for the organization and its locations and Enable IPv6 Resolution for Zscaler Domain enabled.](kb:shared.pac-files.variables:gateway-host). The rest of PAC and IPv6 handling is open [gap:shared.pac-files.coverage:ipv6].

**Private applications.** How a PAC file should treat Private Access application segments and Browser Access hostnames is open [gap:shared.pac-files.coverage:private-app-destinations]. The segment model is [ZPA application segments](kb:zpa.app-segments) and Browser Access is [Browser Access: clientless ZPA access to web applications](kb:zpa.browser-access); Source IP Anchoring, which forwards selected traffic from ZIA to ZPA on purpose, is in [Source IP Anchoring across ZIA and Private Access: path, pieces and interactions](kb:shared.source-ip-anchoring).

**Client Connector modes.** Client Connector has four Internet & SaaS actions, of which Tunnel with Local Proxy installs a PAC file: [For each network type (On-Trusted, VPN-Trusted, Off-Trusted, Split VPN-Trusted) the profile sets one Internet & SaaS action: Tunnel, Tunnel with Local Proxy, Enforce Proxy or None.](kb:zcc.forwarding-profiles.internet-actions:four-actions), [In Tunnel with Local Proxy mode the app sets proxy settings on the device so that all proxy-aware traffic is tunneled to Zscaler, by installing a PAC file that sends all traffic to the local host.](kb:zcc.forwarding-profiles.internet-actions:local-proxy-mode).

**An existing proxy.** Chaining an on-premises proxy to the service, which the vendor treats as transitional, is [Proxy chaining to ZIA: setup, XFF handling and limits](kb:zia.traffic-forwarding.proxy-chaining); the service sending traffic on to a customer proxy is a Forwarding Control action: [Forwarding methods and their required fields](kb:zia.forwarding-control.methods).

What to check:
1. Whether the application in question reads the system or browser PAC file at all; if not, the traffic does not reach the service through PAC forwarding.
2. For mobile users, whether Client Connector can be deployed instead of a PAC file.

Not known (open gaps):
- Non-browser HTTP clients and PAC files [gap:shared.pac-files.coverage:non-browser-clients]: settled by support-ticket or lab-test. Blocks: deciding how scripts, build agents and containers reach the service in a PAC-forwarded environment
- PAC files and IPv6 [gap:shared.pac-files.coverage:ipv6]: settled by support-ticket or lab-test. Blocks: PAC design for dual-stack and IPv6-only clients
- Private Access and Browser Access destinations in a PAC file [gap:shared.pac-files.coverage:private-app-destinations]: settled by lab-test or support-ticket. Blocks: PAC files for tenants that run Internet Access and Private Access together
- PAC files on iOS and Android [gap:shared.pac-files.coverage:mobile-os-pac]: settled by lab-test or operator-experience. Blocks: estimating coverage of PAC-only mobile and BYOD devices

Area: shared.pac-files, its subjects in references/_meta/spine/shared/shared.pac-files.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)
- interacts-with references/_meta/text/zcc/zcc.z-tunnel.bypasses.md (Bypasses for Z-Tunnel 2.0: VPN gateway bypasses, destination exclusions and inclusions, domain bypasses), from shared.pac-files: For Z-Tunnel 1.0, network bypasses can go in the app profile PAC file; for Z-Tunnel 2.0 the vendor says not to put them there and to add them as VPN gateway bypasses or destination exclusions. [zcc.z-tunnel.bypasses:pac-not-for-2]
- links-to references/_meta/text/shared/shared.pac-files.variables.md (Zscaler PAC file variables: gateways, hosts, load-balancing tokens, subclouds and Client Connector)
- links-to references/_meta/text/shared/shared.source-ip-anchoring.md (Source IP Anchoring across ZIA and Private Access: path, pieces and interactions)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures)
- links-to references/_meta/text/zia/zia.forwarding-control.methods.md (Forwarding methods and their required fields)
- links-to references/_meta/text/zia/zia.saas-apps.quic-conferencing.md (QUIC and HTTP/3 behind ZIA: where it escapes and how to block it)
- links-to references/_meta/text/zia/zia.traffic-forwarding.proxy-chaining.md (Proxy chaining to ZIA: setup, XFF handling and limits)
- links-to references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- links-to references/_meta/text/zpa/zpa.browser-access.md (Browser Access: clientless ZPA access to web applications)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.pac-files.md (PAC files across Zscaler: where each question is answered)
- see-also references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes)
