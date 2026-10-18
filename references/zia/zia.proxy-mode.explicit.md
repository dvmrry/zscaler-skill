In explicit mode the client knows about the proxy. {{how-it-works}}

**Why the host is known early.** Because the domain is in the CONNECT request, domain-based policy runs before any decryption, and a block on that host header is answered with HTTP 403: [[zia.ssl-inspection.pipeline]]. SSL Inspection criteria that exist only in this mode, such as the CONNECT User-Agent, are in [[zia.ssl-inspection.criteria]].

**The PAC file.** {{pac-function}} Hosting, versions and limits are in [[zia.traffic-forwarding.pac]].

**Limits and authentication.** Explicit mode reaches only clients that honor the proxy setting: [[zia.traffic-forwarding.pac]] holds the stated limitations and the unverified claims about non-web protocols (gap `non-web-traffic` there). Authentication is in [[zia.authentication.methods]] (Kerberos is supported in explicit mode only) and [[zia.authentication.location-enforcement]]. The list of proxy-authentication methods is open {{gap:explicit-auth-detail}}, and so is the CONNECT reply text {{gap:connect-response}}.
