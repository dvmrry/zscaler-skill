Restore points are a bounded set with different rules for manual and scheduled creation.

Creation: {{manual-or-scheduled}} The page that lists them: {{page-columns}} Name and description limits: {{field-limits}}

The cap: {{limit-12}} {{golden}} What happens at the cap depends on how the new point is made. {{manual-blocked-at-limit}} {{scheduled-evicts}} A scheduled run can therefore delete a point nobody chose to delete, so keep the one you must retain as the golden point.

A Backup & Restore category exists in the audit log filters: [[zia.audit-logs.what-is-recorded]]. What a restore does to the live configuration is in [[zia.backup-restore.restore-semantics]].

Check before a change window: how many points exist, whether the point you need is golden, and whether a scheduled backup is due that would evict it.
