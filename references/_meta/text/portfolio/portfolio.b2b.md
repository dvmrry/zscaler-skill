# Zero Trust Exchange for B2B: site-to-site, partner and B2C access to private applications (portfolio.b2b)
Also called: zscaler b2b; b2b; zero trust b2b; b2b exchange; zscaler b2b exchange; b2b partner access; partner access; partner portal; site-to-site ztna; b2c mobile access

The Zscaler B2B page says B2B is a cloud service that gives business customers secure and fast access to B2B applications; its solution details are site-to-site B2B connectivity based on zero trust network access (ZTNA), B2B partner portal access and B2C mobile app access. [portfolio.b2b:b2b-what] The page says zero trust network access limits partner access to only authorized private applications, without putting partners on the network, and delivers visibility into all partner activity down to the user, device and named app level; browser-based access lets partners reach authorized applications from any location, on any device. [portfolio.b2b:b2b-vs-zpa] How B2B differs from standard ZPA is open [gap:portfolio.b2b:b2b-zpa-contrast].

The page says Zscaler B2B provides site-to-site connectivity without requiring inbound DMZs and open ports, that it hides B2B apps from the internet, and that a direct-to-cloud architecture eliminates complex site-to-site VPNs or hub-and-spoke networks. [portfolio.b2b:b2b-no-inbound] The page says Zscaler's proxy architecture, built on the principle of least privilege, enables full TLS/SSL inspection at scale, with connections brokered between users and applications based on identity, context and business policies. [portfolio.b2b:b2b-inspection]

The ZPA federation feature with a similar name is in [ZPA Business-to-Business Federation](kb:zpa.b2b-federation).

Whether B2B handles identity and trust across organizations, and not only across segments of one organization, is open [gap:portfolio.b2b:b2b-cross-org]. The vendored Python SDK defines a ZPA TenantFederationProvisioningAPI class. [portfolio.b2b:b2b-sdk-class] Whether that is the B2B surface, distinct from ZPA, is open [gap:portfolio.b2b:b2b-sdk].

What to check:
1. For a question about partner or B2C access, check whether the scenario is site-to-site, partner portal or B2C mobile before answering from the solution-details claim.

Not known (open gaps):
- Whether B2B handles cross-organization identity and trust [gap:portfolio.b2b:b2b-cross-org]: settled by source-read
- Whether Zscaler B2B has an SDK surface distinct from ZPA [gap:portfolio.b2b:b2b-sdk]: settled by source-read
- How Zscaler B2B differs from standard ZPA [gap:portfolio.b2b:b2b-zpa-contrast]: settled by source-read

Area: portfolio.b2b, its subjects in references/_meta/spine/portfolio/portfolio.b2b.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.b2b-federation.md (ZPA Business-to-Business Federation)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- see-also references/_meta/text/portfolio/portfolio.platform.md (Zscaler platform pillars: Zero Trust Exchange, Data Fabric for Security, Agentic SecOps and the customer-segment framing)
