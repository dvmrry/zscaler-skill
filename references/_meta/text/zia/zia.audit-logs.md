# ZIA audit logs: who changed what (zia.audit-logs)
Also called: zia audit logs; admin audit; who changed this setting; audit trail; change history zia

"Who changed this, and when?" is four questions in a fixed order.

1. **Is the change in the trail at all, and is it still retained?** Retention is bounded and incidental rule-order shifts are not logged: [What the ZIA admin audit log records and how the console shows it](kb:zia.audit-logs.what-is-recorded).
2. **How do I get the entries out?** Console for a look, the report API for an export, Cloud NSS for continuous delivery: [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api), [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming).
3. **Is it a service event rather than an admin action?** The event log report is a different dataset: [The ZIA event log report and how it differs from the admin audit report](kb:zia.audit-logs.event-log-report).
4. **Is the question about configuration quality, not history?** The configuration audit is a graded snapshot, not a trail: [The ZIA configuration audit (System Audit Report) endpoint](kb:zia.audit-logs.config-audit).

Restore points have their own category in the trail; what a restore does is in [ZIA Backup and Restore](kb:zia.backup-restore).

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs): Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/zia/zia.audit-logs.config-audit.md (The ZIA configuration audit (System Audit Report) endpoint)
- links-to references/_meta/text/zia/zia.audit-logs.event-log-report.md (The ZIA event log report and how it differs from the admin audit report)
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it)
- links-to references/_meta/text/zia/zia.backup-restore.md (ZIA Backup and Restore)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/nss-feeds.md (config type)
