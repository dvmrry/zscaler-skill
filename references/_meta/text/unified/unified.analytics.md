# Experience Center Analytics: the dashboard and report families and which subject owns each (unified.analytics)
Also called: analytics menu; experience center analytics; understanding analytics; analytics dashboards and reports

Analytics in the Zscaler Admin Console is a set of dashboards and reports for monitoring end-user digital experience, cyber risk and deployment health, among others. Which dashboards and reports an admin has access to depends on the organization's Zscaler subscriptions. [unified.analytics:purpose] The Analytics section's families are Health360, Risk360, Business Insights, Cybersecurity, Data Security, Digital Experience, Infrastructure, Custom Dashboards and Reports. [unified.analytics:families]

**Health360.** Deployment health scores and Best Practices are in [Health360: deployment health scores and bands, categories, Best Practices and Connectors Health](kb:unified.analytics.health360); license adoption and the executive views are in [Health360 Adoption and Executive Insights: license utilization, deployment status, and executive traffic, peer and incident views](kb:unified.analytics.health360.adoption).

**Risk360 and Business Insights.** Under Risk360, Analytics lists Factors, Assets, Insights, Financial Risk, Alerts and MITRE ATT&CK, and compliance views for PCI DSS, NIST CSF, NIST SP 800-53, NIS2, ISO 27001, HITRUST, HIPAA, DORA, CIS, CAF, SOC 2 and GDPR. [unified.analytics:risk360-views] The Risk360 product is in [Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated](kb:risk360.overview). Under Business Insights, Analytics lists Application Insights, All Applications, Application Settings (for configuring an application connector or customer application signature), Workplace Insights, Offices and Locations (data for Internet & SaaS locations and inferred IP addresses), Workplace Settings and Data Explorer (attendance and operations metrics for configured offices). [unified.analytics:business-insights-views] The Business Insights product is in [Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources](kb:business-insights.overview).

**Cybersecurity and Data Security.** The Cybersecurity dashboards are in [Cybersecurity dashboards: Transactional Activity, Advanced Threats, Sandbox Threats, Threat Locations and SSL Inspection](kb:unified.analytics.cybersecurity), and the Data Security dashboards in [Data Security dashboards: channel views (Inline CASB, Inline DLP, SaaS, Endpoint, Email) and sensitive data at rest](kb:unified.analytics.data-security). The Data Security Incidents view is described in [Workflow Automation Incident Analytics dashboard: access by workflow permission, time ranges, KPI tiles, triage and resolve times, and top-10 views](kb:zwa.incident-analytics).

**Digital Experience.** Under Digital Experience, Analytics lists Incidents, Network Intelligence, Applications Overview and Devices Overview. [unified.analytics:digital-experience-views] The ZDX pages behind them are in [ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service](kb:zdx.dashboards).

**Infrastructure.** Under Infrastructure, Analytics lists the Client Connector entries Platform Details, Device Overview, Device Posture (criteria evaluated on devices) and Device Events (Private Access and Internet & SaaS service status), plus Connector Activity (Cloud Connector and Branch Connector activity) and Zero Trust Branch (widgets on assets, VLANs, gateways and devices). [unified.analytics:infrastructure-views] The Client Connector dashboard is described in [The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs](kb:zcc.devices.dashboard); how its pages relate to the four Client Connector entries here is open [gap:unified.analytics:zcc-dashboard-count]. The Connector Activity dashboard is in [Networking and Connector Activity dashboards: traffic, data-center and connector maps, discovered devices, Cloud and Branch Connector activity](kb:unified.analytics.networking), and Zero Trust Branch in [Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed](kb:zero-trust-branch.overview).

**Reports.** Under Reports, Analytics lists Industry Peer Comparison, System Audit Report, Security Policy Audit Report, Sandbox Activity Report, SaaS Security Report, Configuration Risk Report, IOT Discovery Report, Risk360 Reports, ZPA QBR Reports, ZDX QBR Reports and Interactive Reports. [unified.analytics:reports-views] The System Audit Report highlights the status of GRE tunnels, PAC files, authentication frequency, PAC file sizes, Microsoft 365 One Click and IP visibility. [unified.analytics:system-audit-report] Interactive Reports provides standard reports based on the organization's subscriptions and the ability to create up to 500 custom reports. [unified.analytics:interactive-500] The ZIA reports are in [ZIA reports: which subject describes each report family](kb:zia.reports) and [Interactive Reports: standard, custom and scheduled reports, export, import and printing](kb:zia.reports.interactive).

**Custom dashboards.** Dashboards that an admin builds are in [Experience Center custom dashboards: data sources, templates, sharing roles, delete and PDF export](kb:unified.analytics.custom-dashboards).

What to check:
1. Which Analytics family a dashboard belongs to, and whether the tenant's subscriptions give the admin access to it, before treating a missing dashboard as a fault.

Not known (open gaps):
- How the Client Connector dashboard's pages relate to the four Client Connector entries under Infrastructure [gap:unified.analytics:zcc-dashboard-count]: settled by tenant-data or source-read

Area: unified.analytics, its subjects in references/_meta/spine/unified/unified.analytics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/business-insights/business-insights.overview.md (Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources)
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- links-to references/_meta/text/unified/unified.analytics.custom-dashboards.md (Experience Center custom dashboards: data sources, templates, sharing roles, delete and PDF export)
- links-to references/_meta/text/unified/unified.analytics.cybersecurity.md (Cybersecurity dashboards: Transactional Activity, Advanced Threats, Sandbox Threats, Threat Locations and SSL Inspection)
- links-to references/_meta/text/unified/unified.analytics.data-security.md (Data Security dashboards: channel views (Inline CASB, Inline DLP, SaaS, Endpoint, Email) and sensitive data at rest)
- links-to references/_meta/text/unified/unified.analytics.health360.md (Health360: deployment health scores and bands, categories, Best Practices and Connectors Health)
- links-to references/_meta/text/unified/unified.analytics.health360.adoption.md (Health360 Adoption and Executive Insights: license utilization, deployment status, and executive traffic, peer and incident views)
- links-to references/_meta/text/unified/unified.analytics.networking.md (Networking and Connector Activity dashboards: traffic, data-center and connector maps, discovered devices, Cloud and Branch Connector activity)
- links-to references/_meta/text/zcc/zcc.devices.dashboard.md (The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs)
- links-to references/_meta/text/zdx/zdx.dashboards.md (ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.overview.md (Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed)
- links-to references/_meta/text/zia/zia.reports.md (ZIA reports: which subject describes each report family)
- links-to references/_meta/text/zia/zia.reports.interactive.md (Interactive Reports: standard, custom and scheduled reports, export, import and printing)
- links-to references/_meta/text/zwa/zwa.incident-analytics.md (Workflow Automation Incident Analytics dashboard: access by workflow permission, time ranges, KPI tiles, triage and resolve times, and top-10 views)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/unified/unified.overview.md (Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated)
