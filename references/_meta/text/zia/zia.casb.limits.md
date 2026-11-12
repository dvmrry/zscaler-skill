# CASB limits: scan capacity, log field length and rule text (zia.casb.limits)
Also called: casb limits; saas security api scans limit; 1000 buckets; bitbucket 32 repositories; sub-url 2041 characters; ranges and limitations saas security

The numeric limits that apply to CASB are in the ranges and limitations article. SaaS Security API scans cover up to 1,000 Amazon S3 buckets, and enabling that, or Amazon S3 at all, goes through the Zscaler Account team. [zia.casb.limits:s3-1000-buckets] SaaS Security API scans cover up to 1,000 Google Cloud Platform buckets and 1,000 Azure blob containers, each raised through the Zscaler Account team. [zia.casb.limits:gcp-azure-1000] SaaS Security API scans cover up to 32 Bitbucket repositories. [zia.casb.limits:bitbucket-32]

**Logs.** Sub-URLs in the Insight Logs display and CSV file are truncated beyond 2,041 characters. [zia.casb.limits:sub-url-2041] Whether it applies to SaaS Security logs is open [gap:zia.casb.limits:sub-url-in-saas-logs]. The retention, export and filter limits are in [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs).

**Rules.** A SaaS Security Data at Rest Scanning DLP rule description cannot exceed 10,240 characters. [zia.casb.limits:description-10240] The 4-engine and 32-user limits are in [CASB Data at Rest Scanning DLP rules](kb:zia.casb.dlp-rules).

**Tenants.** The 16-tenant and 32-profile limits are in [CASB tenants: connecting a SaaS application, states and reauthorization](kb:zia.casb.tenants).

What to check:
1. Whether the bucket, container or repository count of the tenant is within the scan cap before assuming a scan missed objects.
2. Whether the Sub-URL limit is being applied to a SaaS Security log.

Not known (open gaps):
- Whether the Sub-URL limit applies to SaaS Security logs [gap:zia.casb.limits:sub-url-in-saas-logs]: settled by operator-experience or source-read

Area: zia.casb, its subjects in references/_meta/spine/zia/zia.casb.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.casb.dlp-rules.md (CASB Data at Rest Scanning DLP rules), from zia.casb: Data at Rest Scanning DLP rules are evaluated in ascending rule order, and a disabled rule keeps its place in the order while the service skips it and moves to the next rule. [zia.casb.dlp-rules:rule-order-ascending]
- logged-in references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming), from zia.casb: SaaS Security Insights logs show every scan performed by the Zscaler SaaS Connector for a SaaS application tenant and are stored for 180 days on the Nanolog servers. [zia.casb.insights-logs:retention-180]
- depends-on references/_meta/text/zia/zia.casb.tenants.md (CASB tenants: connecting a SaaS application, states and reauthorization), from zia.casb: Zscaler Data at Rest Scanning provides visibility and security for the sanctioned SaaS applications used in the organization, and a SaaS application is authorized with Zscaler by adding it as a tenant. [zia.casb.tenants:tenant-authorizes-app]
- decided-by references/_meta/text/zia/zia.casb.rule-types.md (CASB rule types: the eight categories and their separate rule lists), from zia.casb: DLP rule order is defined relative to other Data at Rest Scanning DLP rules and malware rule order relative to other Data at Rest Scanning Malware rules, so the two kinds are separate ordered lists. [zia.casb.rule-types:order-separate-lists]
- depends-on references/_meta/text/zia/zia.casb.scans.md (CASB scan schedules: states, historical data, stop and restart), from zia.casb: A configured rule inspects nothing until it is added to a scan schedule: the Zscaler service does not inspect content until a scan is configured. [zia.casb:no-scan-no-inspection]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/casb-dlp-rules.md (config type)
