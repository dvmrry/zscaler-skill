# Which forwarding methods produce explicit or transparent mode (zia.proxy-mode.forwarding-map)
Also called: proxy mode per forwarding method; pac over tunnel; gre explicit; z-tunnel proxy mode; is this explicit or transparent

The mode is a property of how a flow arrives, not a setting: Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]

| Arrival | Mode | Claim |
| --- | --- | --- |
| Browser with a PAC file or manual proxy | Explicit | A browser sent to the Service Edge by manual proxy settings or a PAC file is in explicit mode. [zia.proxy-mode.forwarding-map:pac-explicit] |
| GRE or IPSec tunnel, no browser configuration | Transparent | Traffic directed to a Service Edge by a GRE or IPSec tunnel at the egress router, with no browser configuration, is in transparent mode. [zia.proxy-mode.forwarding-map:tunnel-transparent] |
| Tunnel carrying PAC-directed traffic | Explicit | A tunnel can also carry explicit-mode traffic: GRE tunnels can be configured with the explicit proxy mode in a no default route environment, and the SSL Inspection User Agent criterion applies to SSL/TLS traffic forwarded in explicit proxy mode by PAC or PAC over a tunnel. A tunnel therefore does not by itself make traffic transparent. [zia.proxy-mode.forwarding-map:explicit-over-tunnel] |
| Z-Tunnel 1.0 | Not labeled | Z-Tunnel 1.0 forwards by CONNECT requests like a traditional proxy, but the SSL Inspection User Agent criterion does not apply to it, for lack of user agent context; that criterion's description names Z-Tunnel 1.0 separately from both explicit proxy mode (PAC or PAC over tunnel) and transparent proxy (tunnel). [zia.proxy-mode.forwarding-map:z-tunnel-1-connect] |
| Z-Tunnel 2.0 | Not stated | [gap:zia.proxy-mode.forwarding-map:z-tunnel-2-mode] |
| Chained on-premises proxy | Not stated | [gap:zia.proxy-mode.forwarding-map:chained-proxy-mode] |

Mode details are in [Explicit proxy mode: CONNECT and the PAC file](kb:zia.proxy-mode.explicit) and [Transparent proxy mode: how the host is found from SNI or certificate](kb:zia.proxy-mode.transparent); the methods are in [GRE tunnels to ZIA: requirements, bandwidth and deployment](kb:zia.traffic-forwarding.gre), [IPSec tunnels to ZIA: limits, IKE and device settings](kb:zia.traffic-forwarding.ipsec), [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac), [Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes](kb:zia.traffic-forwarding.zcc) and [Proxy chaining to ZIA: setup, XFF handling and limits](kb:zia.traffic-forwarding.proxy-chaining).

What to check:
1. How the specific flow arrives, since PAC traffic over a tunnel is explicit mode, before applying an explicit-only or transparent-only rule criterion.

Inferred, not quoted (say so when an answer rests on one):
- [zia.proxy-mode.forwarding-map:not-a-setting] Tier B: No source says there is no proxy-mode setting; it is concluded from the vendor describing each mode by how traffic is delivered.

Not known (open gaps):
- Proxy mode of chained proxy traffic [gap:zia.proxy-mode.forwarding-map:chained-proxy-mode]: settled by lab-test
- Proxy mode of Z-Tunnel 2.0 traffic [gap:zia.proxy-mode.forwarding-map:z-tunnel-2-mode]: settled by lab-test

Area: zia.proxy-mode, its subjects in references/_meta/spine/zia/zia.proxy-mode.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match): A tunnel can also carry explicit-mode traffic: GRE tunnels can be configured with the explicit proxy mode in a no default route environment, and the SSL Inspection User Agent criterion applies to SSL/TLS traffic forwarded in explicit proxy mode by PAC or PAC over a tunnel. A tunnel therefore does not by itself make traffic transparent. [zia.proxy-mode.forwarding-map:explicit-over-tunnel]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment): Traffic directed to a Service Edge by a GRE or IPSec tunnel at the egress router, with no browser configuration, is in transparent mode. [zia.proxy-mode.forwarding-map:tunnel-transparent]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings): Traffic directed to a Service Edge by a GRE or IPSec tunnel at the egress router, with no browser configuration, is in transparent mode. [zia.proxy-mode.forwarding-map:tunnel-transparent]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover): A browser sent to the Service Edge by manual proxy settings or a PAC file is in explicit mode. [zia.proxy-mode.forwarding-map:pac-explicit]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.zcc.md (Client Connector as a forwarding method: benefits, limits and Z-Tunnel modes): Z-Tunnel 1.0 forwards by CONNECT requests like a traditional proxy, but the SSL Inspection User Agent criterion does not apply to it, for lack of user agent context; that criterion's description names Z-Tunnel 1.0 separately from both explicit proxy mode (PAC or PAC over tunnel) and transparent proxy (tunnel). [zia.proxy-mode.forwarding-map:z-tunnel-1-connect]
- interacts-with references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.proxy-mode: Kerberos is supported only for traffic forwarded in explicit mode (a PAC file points the browser at the service). It is not supported for transparent forwarding through a GRE or IPSec tunnel when the browser is not using a PAC file, and users must already be provisioned: Kerberos authenticates, it does not provision. [zia.authentication.methods:kerberos-explicit-only]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.proxy-mode: Under transparent forwarding, SSL inspection exemption policies are evaluated on the IP address as well as the SNI, and most IP addresses are categorized Miscellaneous or Unknown, so exempting that category exempts almost all traffic. Under explicit forwarding only the SNI is evaluated. [zia.ssl-inspection.pipeline:transparent-matches-destination-ip]
- links-to references/_meta/text/zia/zia.proxy-mode.explicit.md (Explicit proxy mode: CONNECT and the PAC file)
- links-to references/_meta/text/zia/zia.proxy-mode.transparent.md (Transparent proxy mode: how the host is found from SNI or certificate)
- links-to references/_meta/text/zia/zia.traffic-forwarding.proxy-chaining.md (Proxy chaining to ZIA: setup, XFF handling and limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.proxy-mode.md (ZIA proxy modes: explicit and transparent)
