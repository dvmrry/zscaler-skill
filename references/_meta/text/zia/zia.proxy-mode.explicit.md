# Explicit proxy mode: CONNECT and the PAC file (zia.proxy-mode.explicit)
Also called: explicit proxy; connect request; connect host header; pac explicit mode; explicit mode

In explicit mode the client knows about the proxy. In explicit mode the browser is configured, manually or by a PAC file, to send its traffic directly to a Public Service Edge. For HTTPS it puts the Service Edge's IP address as the destination in the IP header and sends an HTTP CONNECT request to the Service Edge before the SSL handshake; the CONNECT names the requested domain, so the service identifies the destination host immediately. [zia.proxy-mode.explicit:how-it-works]

**Why the host is known early.** Because the domain is in the CONNECT request, domain-based policy runs before any decryption, and a block on that host header is answered with HTTP 403: [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline). SSL Inspection criteria that exist only in this mode, such as the CONNECT User-Agent, are in [SSL/TLS inspection rule criteria and the ones that silently don't match](kb:zia.ssl-inspection.criteria).

**The PAC file.** A PAC file must start with the FindProxyForURL(url, host) function, which decides which URLs, hostnames or IP addresses are redirected to a proxy; a file can return DIRECT for destinations that should bypass the service. [zia.proxy-mode.explicit:pac-function] Hosting, versions and limits are in [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac).

**Limits and authentication.** Explicit mode reaches only clients that honor the proxy setting: [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac) holds the stated limitations and the unverified claims about non-web protocols (gap `non-web-traffic` there). Authentication is in [SAML and Kerberos: what each needs to work](kb:zia.authentication.methods) (Kerberos is supported in explicit mode only) and [Requiring authentication per location and sublocation](kb:zia.authentication.location-enforcement). The list of proxy-authentication methods is open [gap:zia.proxy-mode.explicit:explicit-auth-detail], and so is the CONNECT reply text [gap:zia.proxy-mode.explicit:connect-response].

What to check:
1. Whether the client really sends CONNECT to the Service Edge, which a packet capture shows as the CONNECT line.
2. Whether the PAC file returns the proxy for the destination in question.

Not known (open gaps):
- Service Edge replies to a CONNECT request [gap:zia.proxy-mode.explicit:connect-response]: settled by lab-test
- Proxy authentication methods and caching in explicit mode [gap:zia.proxy-mode.explicit:explicit-auth-detail]: settled by lab-test

Area: zia.proxy-mode, its subjects in references/_meta/spine/zia/zia.proxy-mode.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover): A PAC file must start with the FindProxyForURL(url, host) function, which decides which URLs, hostnames or IP addresses are redirected to a proxy; a file can return DIRECT for destinations that should bypass the service. [zia.proxy-mode.explicit:pac-function]
- interacts-with references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work): Kerberos is supported only for traffic forwarded in explicit mode (a PAC file points the browser at the service). It is not supported for transparent forwarding through a GRE or IPSec tunnel when the browser is not using a PAC file, and users must already be provisioned: Kerberos authenticates, it does not provision. [zia.authentication.methods:kerberos-explicit-only]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match): The CONNECT User-Agent criterion applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel); it does not apply to transparent proxy (tunnel) or Z-Tunnel 1.0 traffic, which has no user-agent context. [zia.ssl-inspection.criteria:connect-user-agent-explicit-only]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): Under transparent forwarding, SSL inspection exemption policies are evaluated on the IP address as well as the SNI, and most IP addresses are categorized Miscellaneous or Unknown, so exempting that category exempts almost all traffic. Under explicit forwarding only the SNI is evaluated. [zia.ssl-inspection.pipeline:transparent-matches-destination-ip]
- decided-by references/_meta/text/zia/zia.proxy-mode.forwarding-map.md (Which forwarding methods produce explicit or transparent mode), from zia.proxy-mode: Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- links-to references/_meta/text/zia/zia.authentication.location-enforcement.md (Requiring authentication per location and sublocation)
