"Can I roll ZIA back to how it was?" has two halves.

1. **What will a restore do, and what will it leave alone?** It replaces the covered policies and removes anything newer from the covered policy areas, and does not restore DLP for EDM or IDM tenants: [[zia.backup-restore.restore-semantics]].
2. **Is the restore point I need still there?** Twelve points total, one golden, and scheduled backups evict the oldest: [[zia.backup-restore.restore-points]].

To find out who created a point, and when, use the audit trail: [[zia.audit-logs]]. DLP policy behavior is in [[zia.dlp]].
