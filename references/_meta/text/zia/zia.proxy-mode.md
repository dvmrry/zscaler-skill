# ZIA proxy modes: explicit and transparent (zia.proxy-mode)
Also called: proxy mode; explicit vs transparent; explicit proxy mode; transparent proxy mode; how does zia identify the destination

"How does ZIA know where this connection is going?" depends on how the traffic arrived.

1. **Did the client send it to the service as a proxy?** Then the CONNECT request names the host before TLS: [Explicit proxy mode: CONNECT and the PAC file](kb:zia.proxy-mode.explicit).
2. **Was it redirected without the client knowing?** Then the host comes from SNI, or the server certificate when SNI is absent: [Transparent proxy mode: how the host is found from SNI or certificate](kb:zia.proxy-mode.transparent).
3. **Which one is this flow?** The forwarding method does not settle it (a tunnel can carry PAC traffic): [Which forwarding methods produce explicit or transparent mode](kb:zia.proxy-mode.forwarding-map).

What the mode changes in policy is held by the SSL Inspection subjects, not here: first-pass evaluation on the CONNECT host or SNI ([Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline)) and the criteria that exist in one mode only ([SSL/TLS inspection rule criteria and the ones that silently don't match](kb:zia.ssl-inspection.criteria)). How traffic gets to the service in the first place is [How traffic reaches ZIA](kb:zia.traffic-forwarding). Why proxy caching helps less today, and the alternatives Zscaler lists, are in [Web caching through a proxy and the alternatives to it that the article lists](kb:zia.proxy-mode.caching).

Area: zia.proxy-mode, its subjects in references/_meta/spine/zia/zia.proxy-mode.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.proxy-mode.forwarding-map.md (Which forwarding methods produce explicit or transparent mode): Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match): The CONNECT User-Agent criterion applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel); it does not apply to transparent proxy (tunnel) or Z-Tunnel 1.0 traffic, which has no user-agent context. [zia.ssl-inspection.criteria:connect-user-agent-explicit-only]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): Under transparent forwarding, SSL inspection exemption policies are evaluated on the IP address as well as the SNI, and most IP addresses are categorized Miscellaneous or Unknown, so exempting that category exempts almost all traffic. Under explicit forwarding only the SNI is evaluated. [zia.ssl-inspection.pipeline:transparent-matches-destination-ip]
- interacts-with references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): Kerberos is supported only for traffic forwarded in explicit mode (a PAC file points the browser at the service). It is not supported for transparent forwarding through a GRE or IPSec tunnel when the browser is not using a PAC file, and users must already be provisioned: Kerberos authenticates, it does not provision. [zia.authentication.methods:kerberos-explicit-only]
- links-to references/_meta/text/zia/zia.proxy-mode.caching.md (Web caching through a proxy and the alternatives to it that the article lists)
- links-to references/_meta/text/zia/zia.proxy-mode.explicit.md (Explicit proxy mode: CONNECT and the PAC file)
- links-to references/_meta/text/zia/zia.proxy-mode.transparent.md (Transparent proxy mode: how the host is found from SNI or certificate)
- links-to references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA)
