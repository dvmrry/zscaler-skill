# The ZIA configuration audit (System Audit Report) endpoint (zia.audit-logs.config-audit)
Also called: configAudit; system audit report; zia config grade; ConfigAudit python; RBA_LIMITED

Despite the name, this is not a change history. The configAudit endpoint returns the System Audit Report, which grades the configuration overall and in each area it checks: GRE tunnels, PAC files, authentication frequency, PAC file sizes, Microsoft 365 One Click and IP visibility. [zia.audit-logs.config-audit:not-a-trail] For who-changed-what use [What the ZIA admin audit log records and how the console shows it](kb:zia.audit-logs.what-is-recorded).

**Access.** The configAudit, configAudit/ipVisibility and configAudit/pacFile endpoints are accessible via Zscaler OneAPI only. [zia.audit-logs.config-audit:oneapi-only] The Python SDK comment states that the config audit returns the code RBA_LIMITED with the message "Functional scope restriction requires Reports" when the Reports functional scope is missing. [zia.audit-logs.config-audit:rba-limited] The scope behavior is documented for this endpoint only; the audit-report endpoints are an open question in [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api) (gap `reports-scope`).

**Timing.** The report runs on the first of every month and presents the analysis as of that date; if the previous month's report is unavailable the console shows the month before it. [zia.audit-logs.config-audit:monthly] A System Audit Report grade describes the configuration as of the date the report was run, not the configuration as it is now. [zia.audit-logs.config-audit:grade-is-snapshot]

**Response.** The response carries an overallGrade plus highAvailabilityGrade, userPerformanceGrade, otherGrade, greTunnelGrade, pacFileGrade, authFrequencyGrade, pacfileSizeGrade, office365Grade and ipVisibilityGrade, each A, B, C or NONE. [zia.audit-logs.config-audit:grades] Each area also has a free-text recommended-configuration field (greTunnelRecommendedConfiguration, pacFileRecommendedConfiguration, authFrequencyRecommendedConfiguration, pacFileSizeRecommendedConfiguration, office365RecommendedConfiguration, ipVisibilityRecommendedConfiguration); the response also has office365Flag, dataPresent, reportTimestamp and an authFrequency object with authFrequency and authCustomFrequency. [zia.audit-logs.config-audit:recommendations] GRE tunnel and PAC file grades are A when issues affect under 10% of the items, B between 10% and 90%, and C above 90%; with none present the grade is No Grade. [zia.audit-logs.config-audit:grade-rubric]

**SDK.** The Python SDK exposes the report as SystemAuditReportAPI.get_config_audit (client.zia.system_audit) and models the nested objects AuthFrequency, IPVisibility (totalGreLocations, recommendation, details, locationsWithNat) and PacFile (totalPacFiles, pacWithStaticIPs). [zia.audit-logs.config-audit:python-models]

What to check:
1. Whether a grade is quoted with its `reportTimestamp` and `dataPresent`, which show the date it describes and whether data was present.

Inferred, not quoted (say so when an answer rests on one):
- [zia.audit-logs.config-audit:grade-is-snapshot] Tier B: The report is generated on the first of the month and presents analysis as of that date; assumes no on-demand refresh exists, which no source mentions.

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.admin-rbac.zia.md (ZIA admin roles and scope: rank, permissions, functional scope and the one-scope rule): The Python SDK comment states that the config audit returns the code RBA_LIMITED with the message "Functional scope restriction requires Reports" when the Reports functional scope is missing. [zia.audit-logs.config-audit:rba-limited]
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs), from zia.audit-logs: Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): The configAudit, configAudit/ipVisibility and configAudit/pacFile endpoints are accessible via Zscaler OneAPI only. [zia.audit-logs.config-audit:oneapi-only]
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.audit-logs.md (ZIA audit logs: who changed what)
