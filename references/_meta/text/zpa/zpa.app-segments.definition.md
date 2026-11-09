# What an application segment can contain: entries, wildcards and ports (zpa.app-segments.definition)
Also called: domain_names; wildcard only application; hyphenated ip range application segment; browser access port range; idp application segment; application segment local domain

This subject covers what an application segment may contain and the port rules for Browser Access.

**What an application is.** An application is an FQDN, local domain name or IP address defined on a standard set of ports, and applications must be defined within an application segment, a grouping of defined applications based on access type or user privileges; features such as double encryption and health reporting are configured per application segment. [zpa.app-segments.definition:def-what-is-application] Double Encryption is set per segment but applies at the FQDN level: [What Double Encryption does, when to use it and what it costs](kb:zpa.app-segments.double-encryption).

**Entries.** An application entry is an FQDN, an IP address, a local domain or a wildcard domain such as `*.safemarch.com`; hyphenated IP address ranges cannot be defined. [zpa.app-segments.definition:entry-forms] A wildcard-only entry (`*`) should be the only application in its segment, needs Zscaler approval, and is not available for application discovery. [zpa.app-segments.definition:wildcard-only] Zscaler recommends excluding DNS traffic (port 53) from TCP and UDP port ranges. [zpa.app-segments.definition:def-exclude-port-53] Wildcards and subnets used for discovery: [How application discovery works and how a discovered application is defined](kb:zpa.app-segments.discovery).

**Application Scaling.** Application Scaling is a limited-availability feature that lets tenants scale to approximately 100,000 applications by delivering aggregated domain information to endpoints instead of the complete application inventory; deployments using Source IP Anchoring or Zero Trust Branch should continue to use the standard Private Access application access. [zpa.app-segments.definition:app-scaling] Application Scaling needs App Connectors or Private Service Edges at version 24.298.1 or later and Client Connector at Windows 4.7.0.88 or 4.6.0.282 or later, macOS 4.5.2.98, iOS 4.4.1 (with the Use Tunnel SDK Version 4.3 or above setting enabled), Android 3.10 or Linux 4.2 or later, and it is enabled at the tenant level by contacting Zscaler Support. [zpa.app-segments.definition:app-scaling-prerequisites]

**Browser Access.** Applications defined for Browser Access can only be FQDNs. [zpa.app-segments.definition:ba-fqdn-only] For a Browser Access application the TCP port range must include the specified port, and UDP port ranges cannot be used. [zpa.app-segments.definition:ba-ports] Segment-level settings that interact with Browser Access are in [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings).

**IPv6.** Private Access supports IPv4 for TCP-, UDP- and ICMP-based connections and IPv6 only for TCP-based applications. App Connectors and Private Service Edges are dual stack aware, so IPv4 and IPv6 run alongside each other. An IPv4 or an IPv6 endpoint through Client Connector reaching an IPv4 application is supported for TCP-, UDP- and ICMP-based connections; for direct IPv6 communication from an App Connector to a server only TCP is supported and UDP is not. [zpa.app-segments.definition:ipv6-support] Users can access IPv6 applications defined using an FQDN or hostname if they use browser-based connections or Zscaler Client Connector. [zpa.app-segments.definition:ipv6-fqdn-access] Whether ICMP reaches IPv6 applications is open [gap:zpa.app-segments.definition:ipv6-icmp].

**Identity providers.** If the IdP is defined as an application within a segment, its Authentication Timeout must be Never, and an IdP domain that overlaps a domain configured for application discovery must be bypassed in Private Access to avoid user reauthentication failure. [zpa.app-segments.definition:idp-overlap]

**Group membership.** Every segment must be placed in a segment group: [Which application segments belong to a segment group](kb:zpa.segment-groups.membership). How entries and ports decide which segment matches is in [Which application segment a destination maps to when several overlap](kb:zpa.app-segments.matching), and the field names are in [Application segment fields in the API and SDK models](kb:zpa.app-segments.api-fields).

What to check:
1. Whether a wildcard-only entry shares a segment with other entries, and whether Zscaler approved it.
2. Whether a Browser Access application has its port inside a TCP range, and that no UDP range was used.
3. Whether the IdP is defined in a segment, and if so its Authentication Timeout and any overlap with application discovery.

Not known (open gaps):
- Whether ICMP reaches IPv6 applications [gap:zpa.app-segments.definition:ipv6-icmp]: settled by lab-test or support-ticket

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.api-fields.md (Application segment fields in the API and SDK models)
- links-to references/_meta/text/zpa/zpa.app-segments.discovery.md (How application discovery works and how a discovered application is defined)
- links-to references/_meta/text/zpa/zpa.app-segments.double-encryption.md (What Double Encryption does, when to use it and what it costs)
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- links-to references/_meta/text/zpa/zpa.segment-groups.membership.md (Which application segments belong to a segment group)
