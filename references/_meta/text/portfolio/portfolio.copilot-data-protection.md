# Microsoft Copilot data protection: Zscaler Copilot Security for Microsoft (portfolio.copilot-data-protection)
Also called: copilot data protection; copilot security; zscaler copilot security; zscaler copilot security for microsoft; microsoft copilot; microsoft copilot security; m365 copilot; copilot oversharing; copilot prompt dlp

The page's headline is Control Data Security and Oversharing in Microsoft Copilot; its breadcrumb names it Microsoft Copilot Data Protection, and it links a data sheet titled Zscaler Copilot Security for Microsoft. [portfolio.copilot-data-protection:cdp-marketed] The page's product overview lists four capabilities: see and control prompts (visibility into Copilot user prompts and blocking sensitive data inputs with DLP), fix OneDrive data permissions, update Purview labels, and close dangerous misconfigurations in Copilot or Microsoft 365 configurations. [portfolio.copilot-data-protection:cdp-four]

The page names OneDrive permissions as a challenge, saying improperly permissioned data can be consumed and shared too widely, and its product details say to remove overpermissioned OneDrive access. [portfolio.copilot-data-protection:cdp-onedrive] The page says Zscaler takes an approach to API and inline security that enables control over Copilot deployments, ensuring access constraints around sensitive data across the Microsoft tenant. [portfolio.copilot-data-protection:cdp-paths] Which capability uses which path is open [gap:portfolio.copilot-data-protection:cdp-api-inline].

The page says Copilot can overconsume and share sensitive data with underprivileged users and that, although Microsoft provides Copilot Security options, challenges remain: besides OneDrive permissions, sensitive data users fail to label is open to access by Copilot prompts, and gaps in Microsoft 365 and Copilot configurations can expose data. [portfolio.copilot-data-protection:cdp-risk] How the product relates to Zscaler's DLP, CASB and DSPM offerings is open [gap:portfolio.copilot-data-protection:cdp-pillar]. The DSPM and CASB subjects are [Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated](kb:dspm.overview) and [CASB: ZIA inline controls plus out-of-band SaaS security, not one product](kb:portfolio.casb).

Whether the deployment guide is captured is open [gap:portfolio.copilot-data-protection:cdp-guide]. Whether Copilot indexes SharePoint and Teams data too is open [gap:portfolio.copilot-data-protection:cdp-sources]. Whether the product has its own SDK is open [gap:portfolio.copilot-data-protection:cdp-sdk].

What to check:
1. Before stating a Copilot deployment step, check whether the deployment guide is captured; if it is not, say the step is open.
2. For a question about which Copilot data sources are covered, answer with OneDrive only and name the SharePoint and Teams question as open.

Not known (open gaps):
- Whether the Copilot deployment guide is captured and canonical [gap:portfolio.copilot-data-protection:cdp-guide]: settled by source-read
- Which Microsoft data sources Copilot indexes [gap:portfolio.copilot-data-protection:cdp-sources]: settled by source-read
- Which Copilot capability uses the API path and which the inline path [gap:portfolio.copilot-data-protection:cdp-api-inline]: settled by source-read
- Whether the Copilot product has its own SDK surface [gap:portfolio.copilot-data-protection:cdp-sdk]: settled by source-read
- Whether Copilot security sits in a Data Security pillar alongside DLP, CASB and DSPM [gap:portfolio.copilot-data-protection:cdp-pillar]: settled by source-read

Area: portfolio.copilot-data-protection, its subjects in references/_meta/spine/portfolio/portfolio.copilot-data-protection.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)
- links-to references/_meta/text/portfolio/portfolio.casb.md (CASB: ZIA inline controls plus out-of-band SaaS security, not one product)
