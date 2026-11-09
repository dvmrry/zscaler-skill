# Web caching through a proxy and the alternatives to it that the article lists (zia.proxy-mode.caching)
Also called: web caching; caching proxy; alternatives to caching web traffic; alternative solutions to caching

The article says caching was useful when pages were mostly static, but most web traffic today includes dynamic content, created on the fly and delivered to specific users, for which caching provides no benefit; the Cache-Control header lets developers say whether and how long a page is cached, and many sites send Cache-Control: no cache or no-store. [zia.proxy-mode.caching:why-less-effective]

**HTTPS.** A proxy that does not decrypt HTTPS cannot cache HTTPS content, because proxies cannot cache encrypted data; a proxy that decrypts HTTPS may cache it in some products, which the article says risks storing sensitive data on a multiuser machine with virtually no control over who receives it. [zia.proxy-mode.caching:https]

**Browsers and file size.** All modern browsers cache in memory and on disk, so a caching proxy is only a secondary cache. Proxies cache files only up to a maximum size: too small (the example is 1 MB) and most files are not cached, too large and fewer files fit, and the optimal setting can change from day to day or hour to hour. [zia.proxy-mode.caching:browser-and-size]

**Streaming media.** Streaming media and CDNs make caching less effective: the same content is stored at multiple URLs or hosts, so one video can be cached several times, and dynamic resolution changes can cache a video at several resolutions, filling the cache and reducing hits. [zia.proxy-mode.caching:streaming]

**Alternatives.** As alternatives to caching for reducing bandwidth and improving user experience, the article names Streaming Media as the number one bandwidth category and lists: a policy that prioritizes business traffic over Streaming Media, large file downloads and other less-critical sites; traffic shaping; per-user network quotas on Streaming Media sites (example: 50 MB per day); URL Filtering policy to block Streaming Media or specific sites such as YouTube or Vimeo; and Direct to Net, local internet connections instead of backhauling over a WAN. [zia.proxy-mode.caching:alternatives] Whether the ZIA proxy itself caches content is not stated [gap:zia.proxy-mode.caching:zia-caches]. The Streaming Media class is in [Bandwidth classes: what a class is and which exist](kb:zia.bandwidth-control.classes) and blocking sites is in [ZIA URL Filtering](kb:zia.url-filtering).

Not known (open gaps):
- Whether the ZIA proxy caches content [gap:zia.proxy-mode.caching:zia-caches]: settled by source-read or support-ticket

Area: zia.proxy-mode, its subjects in references/_meta/spine/zia/zia.proxy-mode.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.proxy-mode: Kerberos is supported only for traffic forwarded in explicit mode (a PAC file points the browser at the service). It is not supported for transparent forwarding through a GRE or IPSec tunnel when the browser is not using a PAC file, and users must already be provisioned: Kerberos authenticates, it does not provision. [zia.authentication.methods:kerberos-explicit-only]
- decided-by references/_meta/text/zia/zia.proxy-mode.forwarding-map.md (Which forwarding methods produce explicit or transparent mode), from zia.proxy-mode: Proxy mode is not a setting an admin turns on: it follows from how the traffic arrives (a configured browser versus a redirected flow), and one forwarding method can carry either mode. [zia.proxy-mode.forwarding-map:not-a-setting]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match), from zia.proxy-mode: The CONNECT User-Agent criterion applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel); it does not apply to transparent proxy (tunnel) or Z-Tunnel 1.0 traffic, which has no user-agent context. [zia.ssl-inspection.criteria:connect-user-agent-explicit-only]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.proxy-mode: Under transparent forwarding, SSL inspection exemption policies are evaluated on the IP address as well as the SNI, and most IP addresses are categorized Miscellaneous or Unknown, so exempting that category exempts almost all traffic. Under explicit forwarding only the SNI is evaluated. [zia.ssl-inspection.pipeline:transparent-matches-destination-ip]
- links-to references/_meta/text/zia/zia.bandwidth-control.classes.md (Bandwidth classes: what a class is and which exist)
- links-to references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)
