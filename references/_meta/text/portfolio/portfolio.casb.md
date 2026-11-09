# CASB: ZIA inline controls plus out-of-band SaaS security, not one product (portfolio.casb)
Also called: casb; cloud access security broker; inline casb; out-of-band casb; api casb; saas security; casb product; casb sku

The inline path is a Zscaler Admin Console menu: In the Zscaler Admin Console, the navigation for SaaS and cloud app policy is Data Security > Inline CASB > SaaS/Cloud App Policy. [portfolio.casb:casb-inline-path] Out-of-band scanning of data at rest in sanctioned SaaS applications is a ZIA surface [The Data at Rest Scanning DLP policy discovers and protects sensitive data at rest in sanctioned SaaS applications, and the Malware Detection policy discovers threats to data at rest in them.](kb:zia.casb:scans-saas-data-at-rest), and inline cloud app rules are in [ZIA Cloud App Control](kb:zia.cloud-app-control).

Whether the inline feature set is Cloud App Control, Tenant Profiles, SaaS application visibility and in-line DLP is open [gap:portfolio.casb:casb-inline-list]. Whether CASB is sold as a standalone SKU is open [gap:portfolio.casb:casb-sku]. Whether out-of-band CASB runs through DSPM and the SaaS Security Report is open [gap:portfolio.casb:casb-oob]. Whether Zscaler markets a Multi-Mode CASB as part of its Data Security platform is open [gap:portfolio.casb:casb-data-security].

Data at rest in cloud and on-premises stores is covered by [Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated](kb:dspm.overview), and shadow IT discovery by [Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface](kb:portfolio.saas-security-report). Third-party apps connected to SaaS platforms: [3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard](kb:zia.app-governance).

What to check:
1. Route a CASB question by what the customer needs: inline policy on cloud apps to ZIA Cloud App Control, scanning of data at rest in sanctioned SaaS to ZIA CASB, data at rest in stores to DSPM, and shadow IT discovery to the SaaS Security Report.

Not known (open gaps):
- Whether CASB is sold as a standalone SKU [gap:portfolio.casb:casb-sku]: settled by source-read
- Whether DSPM or the SaaS Security Report also delivers out-of-band CASB [gap:portfolio.casb:casb-oob]: settled by source-read
- Which features make up ZIA's inline CASB [gap:portfolio.casb:casb-inline-list]: settled by source-read
- Whether Zscaler markets a Multi-Mode CASB as part of its Data Security platform [gap:portfolio.casb:casb-data-security]: settled by source-read

Area: portfolio.casb, its subjects in references/_meta/spine/portfolio/portfolio.casb.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)
- links-to references/_meta/text/portfolio/portfolio.saas-security-report.md (Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface)
- links-to references/_meta/text/zia/zia.app-governance.md (3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard)
- links-to references/_meta/text/zia/zia.casb.md (ZIA CASB (SaaS Security API): scanning data at rest in sanctioned SaaS applications)
- links-to references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
