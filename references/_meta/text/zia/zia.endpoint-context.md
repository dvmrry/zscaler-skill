# Endpoint Context: endpoint application telemetry from Client Connector, the policies that use it, and the Application Investigation page (zia.endpoint-context)
Also called: endpoint context; endpoint application telemetry; application investigation; endpoint resources page

Endpoint Context uses application data collected from Zscaler Client Connector to add endpoint telemetry to the identity, network and cloud telemetry the Zero Trust Exchange already has. The service inventories commonly abused OS applications and all non-OS applications on each endpoint, running or at rest, with a data set for each. [zia.endpoint-context:what-it-is] Regardless of licensing, Endpoint Context gives every Internet & SaaS customer additional endpoint application and process metadata for the threat detection engines. [zia.endpoint-context:threat-engines-all-customers]

**Policy use.** Endpoint application metadata is available as policy criteria, so a policy can act on the source endpoint application, a list of endpoint applications, or the application's risk from the risk-quantification process; the page points to the Firewall Filtering, DNS Control and SSL/TLS Inspection policies. [zia.endpoint-context:policy-criteria] How a rule matches an endpoint application is open [gap:zia.endpoint-context:rule-matching]. The criteria are in [SSL/TLS inspection rule criteria and the ones that silently don't match](kb:zia.ssl-inspection.criteria), [What a DNS Control rule can match on](kb:zia.dns-control.criteria) and [Firewall Filtering rule criteria](kb:zia.firewall.criteria).

**Access and licensing.** The page says to contact Zscaler Support to learn more about accessing Endpoint Context for the organization. [zia.endpoint-context:access-via-support] The page names by licence are in [The resources page is called DLP Resources if the organization has licensed only Endpoint DLP, Endpoint Resources if it has licensed only Endpoint Context, and DLP & Endpoint Resources if it has licensed both.](kb:zia.dlp.endpoint-resources:page-name-by-license). With Endpoint Context licensed but not Endpoint DLP, tags cannot be created for network shares, network printers or removable storage devices, and the Endpoint Resources page is available. [zia.endpoint-context:context-only-tags] Which features need a licence is open [gap:zia.endpoint-context:licence-split].

**Customizing the data.** For Endpoint Context, administrators can add endpoint application details as part of its endpoint telemetry, and can use resource tags to build custom application lists. [zia.endpoint-context:customizing-data] The resources and tags are in [Endpoint DLP resources and resource tags: network shares, printers, removable storage, endpoint applications](kb:zia.dlp.endpoint-resources).

**Application Investigation.** Endpoint Context's console page is Application Investigation (Cyberthreat Protection > Policy > Endpoint Context), with an Overview page and an Inventory page. [zia.endpoint-context:application-investigation-page] The Overview page shows detected applications by OS, certificate status, instances by threat type, top application versions with vulnerabilities (filterable by critical, high, medium or low), and top applications by category (for example AI Assistance, Browsers, File Sharing), by threat category, with a custom certificate trust store, by installs, and among AI applications. [zia.endpoint-context:overview-widgets] The Inventory page lists each detected application with Application Name, Product Name, Last Execution (the last time an executable ran on an endpoint), Code Signing, Category, Distinct Versions, Instances, Threat Type (malicious, suspicious, benign, unknown) and Vulnerabilities by CVE severity (critical, high, medium, low). [zia.endpoint-context:inventory-columns] The detail pages are in [Endpoint inventory and Application Investigation: detected removable storage, printers, portable devices and applications](kb:zia.dlp.endpoint-inventory). Which operating systems are inventoried is open [gap:zia.endpoint-context:inventoried-os].

What to check:
1. Which resources page the tenant has, from whether Endpoint Context, Endpoint DLP or both are licensed.
2. Whether a rule that matches an endpoint application is read from the policy's own criteria page, since how it matches is open.

Not known (open gaps):
- Which operating-system applications count as commonly abused [gap:zia.endpoint-context:commonly-abused-os]: settled by source-read or support-ticket
- Which endpoint operating systems are inventoried [gap:zia.endpoint-context:inventoried-os]: settled by source-read
- How the endpoint application risk level is quantified [gap:zia.endpoint-context:risk-quantification]: settled by source-read or support-ticket
- Which Endpoint Context features need a licence [gap:zia.endpoint-context:licence-split]: settled by source-read or support-ticket
- How a Firewall Filtering, DNS Control or SSL/TLS Inspection rule matches an endpoint application [gap:zia.endpoint-context:rule-matching]: settled by source-read or lab-test

Area: zia.endpoint-context, its subjects in references/_meta/spine/zia/zia.endpoint-context.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.dlp.endpoint-resources.md (Endpoint DLP resources and resource tags: network shares, printers, removable storage, endpoint applications)
- links-to references/_meta/text/zia/zia.dlp.endpoint-inventory.md (Endpoint inventory and Application Investigation: detected removable storage, printers, portable devices and applications)
- links-to references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on)
- links-to references/_meta/text/zia/zia.firewall.criteria.md (Firewall Filtering rule criteria)
- links-to references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention)
