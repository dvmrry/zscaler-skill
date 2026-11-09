# ZIA reports: which subject describes each report family (zia.reports)
Also called: zia reports; analytics reports; interactive reports; which report shows; report families

An administrator's role and scope define which reports the administrator can view, and standard reports are available based on the organization's subscriptions; for example, mobile security reports can be viewed only with a Mobile Security subscription. [zia.reports:role-and-scope-gate-reports] Interactive reports support real-time interactive analysis, and a user can drill down from any report to the logs, where details such as the specific URLs users requested and the risk score of each URL are visible. [zia.reports:drill-down-to-logs]

**Which subject describes which report?**
- **How reports are built, scheduled, exported and printed.** [Interactive Reports: standard, custom and scheduled reports, export, import and printing](kb:zia.reports.interactive).
- **Executive Insights, the CIO and CSO company summaries, the QBR, Industry Peer Comparison and CIPA Compliance.** [Executive Insights, company summary (CIO, CSO), QBR, Industry Peer Comparison and CIPA Compliance reports](kb:zia.reports.executive). The Executive Insights mobile app is [Executive Insights mobile app: access errors, data freshness and widgets](kb:zia.reports.executive-insights-app).
- **Company Risk Score, User Risk, Configuration Risk, Security Policy Audit and the Attack Surface Report.** [Risk and posture scoring reports: Company Risk Score, User Risk, Configuration Risk, Security Policy Audit and the Attack Surface Report](kb:zia.reports.risk).
- **Cybersecurity Insights and the Sandbox Activity and Sandbox Files Found Malicious reports.** [Threat reports: Cybersecurity Insights, Sandbox Activity and Sandbox Files Found Malicious](kb:zia.reports.security). The API detail report by MD5 is in [Sandbox reports, quota, and trusting report content](kb:zia.sandbox.report).
- **Post-Quantum Cryptography Visibility, Instance and Resource Discovery and Gen AI Security.** [Web and cloud app reports: Post-Quantum Cryptography Visibility, Instance and Resource Discovery, and Gen AI Security](kb:zia.reports.web-and-cloud-apps).
- **The SaaS Security report pages: assets, activities, Copilot readiness and workflows.** [SaaS Security report pages: SaaS Assets Summary, Assets and Assets with Incidents, Activities, Copilot Readiness Assessment and SaaS Workflows](kb:zia.reports.saas-security). The scan log they drill into is [CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming](kb:zia.casb.insights-logs); the Posture Management page is covered in [SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM](kb:zia.sspm) and the 3rd-Party App Governance page in [3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard](kb:zia.app-governance).
- **Email Security (Email DLP), Endpoint DLP and Data Discovery.** [DLP reports: Email Security (Email DLP), Endpoint DLP and Data Discovery](kb:zia.reports.data-protection). Endpoint data scan is in [Endpoint Data Scan reports: the daily data-at-rest report, User and Device Investigation, DLP Operational and the End User Report](kb:zia.dlp.endpoint-data-scan).

**Reports that live elsewhere.** The admin audit log export API is [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api) and the event log export is [The ZIA event log report and how it differs from the admin audit report](kb:zia.audit-logs.event-log-report). The Shadow IT report is [Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface](kb:portfolio.saas-security-report), the IoT report is [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery), and Risk360's own scoring is [Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated](kb:risk360.overview). The programmatic analytics route is [The Analytics (Z-Insights) GraphQL API: endpoint, access and scope](kb:shared.analytics.graphql); no source maps its domains to these reports.

What to check:
1. Whether the administrator's role and scope, and the organization's subscriptions, allow the report to be seen before treating a missing report as removed.

Area: zia.reports, its subjects in references/_meta/spine/zia/zia.reports.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/portfolio/portfolio.saas-security-report.md (Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface)
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- links-to references/_meta/text/shared/shared.analytics.graphql.md (The Analytics (Z-Insights) GraphQL API: endpoint, access and scope)
- links-to references/_meta/text/zia/zia.app-governance.md (3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard)
- links-to references/_meta/text/zia/zia.audit-logs.event-log-report.md (The ZIA event log report and how it differs from the admin audit report)
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming)
- links-to references/_meta/text/zia/zia.dlp.endpoint-data-scan.md (Endpoint Data Scan reports: the daily data-at-rest report, User and Device Investigation, DLP Operational and the End User Report)
- links-to references/_meta/text/zia/zia.iot.discovery.md (What the IoT Report discovers, and what it takes to get data)
- links-to references/_meta/text/zia/zia.reports.data-protection.md (DLP reports: Email Security (Email DLP), Endpoint DLP and Data Discovery)
- links-to references/_meta/text/zia/zia.reports.executive.md (Executive Insights, company summary (CIO, CSO), QBR, Industry Peer Comparison and CIPA Compliance reports)
- links-to references/_meta/text/zia/zia.reports.executive-insights-app.md (Executive Insights mobile app: access errors, data freshness and widgets)
- links-to references/_meta/text/zia/zia.reports.interactive.md (Interactive Reports: standard, custom and scheduled reports, export, import and printing)
- links-to references/_meta/text/zia/zia.reports.risk.md (Risk and posture scoring reports: Company Risk Score, User Risk, Configuration Risk, Security Policy Audit and the Attack Surface Report)
- links-to references/_meta/text/zia/zia.reports.saas-security.md (SaaS Security report pages: SaaS Assets Summary, Assets and Assets with Incidents, Activities, Copilot Readiness Assessment and SaaS Workflows)
- links-to references/_meta/text/zia/zia.reports.security.md (Threat reports: Cybersecurity Insights, Sandbox Activity and Sandbox Files Found Malicious)
- links-to references/_meta/text/zia/zia.reports.web-and-cloud-apps.md (Web and cloud app reports: Post-Quantum Cryptography Visibility, Instance and Resource Discovery, and Gen AI Security)
- links-to references/_meta/text/zia/zia.sandbox.report.md (Sandbox reports, quota, and trusting report content)
- links-to references/_meta/text/zia/zia.sspm.md (SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM)
