"Who changed this, and when?" is four questions in a fixed order.

1. **Is the change in the trail at all, and is it still retained?** Retention is bounded and incidental rule-order shifts are not logged: [[zia.audit-logs.what-is-recorded]].
2. **How do I get the entries out?** Console for a look, the report API for an export, Cloud NSS for continuous delivery: [[zia.audit-logs.report-api]], [[zia.audit-logs.streaming]].
3. **Is it a service event rather than an admin action?** The event log report is a different dataset: [[zia.audit-logs.event-log-report]].
4. **Is the question about configuration quality, not history?** The configuration audit is a graded snapshot, not a trail: [[zia.audit-logs.config-audit]].

Restore points have their own category in the trail; what a restore does is in [[zia.backup-restore]].
