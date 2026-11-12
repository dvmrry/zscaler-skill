# ZIA CASB (SaaS Security API): scanning data at rest in sanctioned SaaS applications (zia.casb)
Also called: casb; api casb; saas security api; out-of-band casb; data at rest scanning; saas security; is this saas file scanned; casb quarantine

"Is this SaaS content being scanned, and what does the rule do to it?" needs these questions answered in order.

1. **What is scanned?** The Data at Rest Scanning DLP policy discovers and protects sensitive data at rest in sanctioned SaaS applications, and the Malware Detection policy discovers threats to data at rest in them. [zia.casb:scans-saas-data-at-rest] Whether scanning needs user traffic or SSL Inspection is open [gap:zia.casb:traffic-path-and-ssl].
2. **Is anything scanning?** A configured rule inspects nothing until it is added to a scan schedule: the Zscaler service does not inspect content until a scan is configured. [zia.casb:no-scan-no-inspection] Schedules, states and restarts: [CASB scan schedules: states, historical data, stop and restart](kb:zia.casb.scans).
3. **Is the application connected?** Tenant states, reauthorization and limits: [CASB tenants: connecting a SaaS application, states and reauthorization](kb:zia.casb.tenants). Credentials and permissions for custom connectors: [Custom Zscaler connectors for Slack, Salesforce, Microsoft and Google tenants: credentials, scopes and permissions](kb:zia.casb.custom-connectors). What each application supports: [SaaS Security per-application capabilities: onboarding privileges, webhooks, historical scan, licensing, scanned content, actions and activities](kb:zia.casb.app-capabilities).
4. **Which rule applies?** Categories and separate lists: [CASB rule types: the eight categories and their separate rule lists](kb:zia.casb.rule-types). Where the rule sits in the order: [DLP rule order is defined relative to other Data at Rest Scanning DLP rules and malware rule order relative to other Data at Rest Scanning Malware rules, so the two kinds are separate ordered lists.](kb:zia.casb.rule-types:order-separate-lists). DLP rules: [CASB Data at Rest Scanning DLP rules](kb:zia.casb.dlp-rules); malware rules: [CASB Data at Rest Scanning malware rules](kb:zia.casb.malware-rules). Watermark and redaction profiles a DLP rule can use: [Watermark and redaction profiles for Data at Rest Scanning DLP](kb:zia.casb.rights-management).
5. **What happened to the file?** Quarantine and tombstones: [CASB quarantine and tombstone files](kb:zia.casb.quarantine). What the records mean: [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs).

**Email labels.** Email labels add response actions to Gmail and Microsoft Exchange clients based on email content: applying them creates categories in users' mail accounts automatically, and they tell users the type and sensitivity of the content. [zia.casb:email-labels-what] Under the Data at Rest Scanning policy, email labels (tags) can be applied by DLP policies, for content categorized as sensitive, or by Malware policies, for unsafe attachments, based on the DLP and Malware scans. [zia.casb:email-labels-data-at-rest] The Add Email Label page says email labels serve as indications to users about the email content and do not relate to any policy directly. The service creates a label in users' accounts if it does not already exist, and a deleted label can be created again. [zia.casb:email-labels-not-policy-bound] An email label has a name, a description and a color chosen from a drop-down, and can be edited or deleted at any time; the Email Labels page lists label name and description. [zia.casb:email-labels-fields] What the Label Color choices are and whether labels can be created through the API is open [gap:zia.casb:email-label-details].

**Reference.** Calls, SDKs and Terraform: [CASB API, SDK and Terraform surface](kb:zia.casb.api-surface). Numeric limits: [CASB limits: scan capacity, log field length and rule text](kb:zia.casb.limits).

**Related areas.** Inline controls on live traffic are a different feature: [ZIA Cloud App Control](kb:zia.cloud-app-control), [ZIA Data Loss Prevention](kb:zia.dlp) and [ZIA SSL/TLS inspection](kb:zia.ssl-inspection). Tenant restriction is [Tenant Profiles: SaaS tenant restriction](kb:zia.tenant-profiles). Third-party apps connected to SaaS platforms: [3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard](kb:zia.app-governance).

What to check:
1. Whether a scan schedule exists and runs for the tenant; without one no rule inspects anything.
2. Whether the tenant is Active and the rule category and tenant scope match the application.
3. Whether the question assumes CASB is independent of inline inspection, which no source states.

Not known (open gaps):
- The Label Color choices and whether email labels can be created through the API [gap:zia.casb:email-label-details]: settled by source-read or code-read. Blocks: listing label colors or saying how to create a label as code
- Whether CASB scanning sees user traffic or depends on SSL Inspection [gap:zia.casb:traffic-path-and-ssl]: settled by support-ticket or lab-test. Blocks: stating that CASB scanning is independent of inline inspection

Area: zia.casb, its subjects in references/_meta/spine/zia/zia.casb.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.casb.rule-types.md (CASB rule types: the eight categories and their separate rule lists): DLP rule order is defined relative to other Data at Rest Scanning DLP rules and malware rule order relative to other Data at Rest Scanning Malware rules, so the two kinds are separate ordered lists. [zia.casb.rule-types:order-separate-lists]
- decided-by references/_meta/text/zia/zia.casb.dlp-rules.md (CASB Data at Rest Scanning DLP rules): Data at Rest Scanning DLP rules are evaluated in ascending rule order, and a disabled rule keeps its place in the order while the service skips it and moves to the next rule. [zia.casb.dlp-rules:rule-order-ascending]
- logged-in references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming): SaaS Security Insights logs show every scan performed by the Zscaler SaaS Connector for a SaaS application tenant and are stored for 180 days on the Nanolog servers. [zia.casb.insights-logs:retention-180]
- depends-on references/_meta/text/zia/zia.casb.scans.md (CASB scan schedules: states, historical data, stop and restart): A configured rule inspects nothing until it is added to a scan schedule: the Zscaler service does not inspect content until a scan is configured. [zia.casb:no-scan-no-inspection]
- depends-on references/_meta/text/zia/zia.casb.tenants.md (CASB tenants: connecting a SaaS application, states and reauthorization): Zscaler Data at Rest Scanning provides visibility and security for the sanctioned SaaS applications used in the organization, and a SaaS application is authorized with Zscaler by adding it as a tenant. [zia.casb.tenants:tenant-authorizes-app]
- links-to references/_meta/text/zia/zia.app-governance.md (3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard)
- links-to references/_meta/text/zia/zia.casb.api-surface.md (CASB API, SDK and Terraform surface)
- links-to references/_meta/text/zia/zia.casb.app-capabilities.md (SaaS Security per-application capabilities: onboarding privileges, webhooks, historical scan, licensing, scanned content, actions and activities)
- links-to references/_meta/text/zia/zia.casb.custom-connectors.md (Custom Zscaler connectors for Slack, Salesforce, Microsoft and Google tenants: credentials, scopes and permissions)
- links-to references/_meta/text/zia/zia.casb.limits.md (CASB limits: scan capacity, log field length and rule text)
- links-to references/_meta/text/zia/zia.casb.malware-rules.md (CASB Data at Rest Scanning malware rules)
- links-to references/_meta/text/zia/zia.casb.quarantine.md (CASB quarantine and tombstone files)
- links-to references/_meta/text/zia/zia.casb.rights-management.md (Watermark and redaction profiles for Data at Rest Scanning DLP)
- links-to references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
- links-to references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention)
- links-to references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/casb-dlp-rules.md (config type)
- configured-via references/_meta/text/types/zia/casb-malware-rules.md (config type)
- configured-via references/_meta/text/types/zia/casb-tenants.md (config type)
- configured-via references/_meta/text/types/zia/casb-email-labels.md (config type)
- see-also references/_meta/text/portfolio/portfolio.casb.md (CASB: ZIA inline controls plus out-of-band SaaS security, not one product)
- see-also references/_meta/text/zia/zia.dlp.mip-labels.md (Microsoft Information Protection (MIP) accounts and label retrieval)
