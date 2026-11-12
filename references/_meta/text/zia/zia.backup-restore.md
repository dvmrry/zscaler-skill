# ZIA Backup and Restore (zia.backup-restore)
Also called: zia backup; zia restore point; backup and restore; restore zia configuration; roll back zia policy

"Can I roll ZIA back to how it was?" has two halves.

1. **What will a restore do, and what will it leave alone?** It replaces the covered policies and removes anything newer from the covered policy areas, and does not restore DLP for EDM or IDM tenants: [What restoring a ZIA restore point does and does not revert](kb:zia.backup-restore.restore-semantics).
2. **Is the restore point I need still there?** Twelve points total, one golden, and scheduled backups evict the oldest: [ZIA restore point limits, golden point and scheduled eviction](kb:zia.backup-restore.restore-points).

To find out who created a point, and when, use the audit trail: [ZIA audit logs: who changed what](kb:zia.audit-logs). DLP policy behavior is in [ZIA Data Loss Prevention](kb:zia.dlp).

**Downloading and printing policies.** All of the organization's configured policies can be downloaded into a PDF or ZIP file; a ZIP holds a JSON representation of the policies with one JSON file for each policy type. Policies that support the View by option can be printed in either Rule Order or Rule Label view. [zia.backup-restore:download-print-policies] Whether a downloaded ZIP can be restored is open [gap:zia.backup-restore:zip-restorable].

Not known (open gaps):
- Whether the downloaded policy ZIP can be restored [gap:zia.backup-restore:zip-restorable]: settled by lab-test or source-read

Area: zia.backup-restore, its subjects in references/_meta/spine/zia/zia.backup-restore.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention): For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM) enabled, Backup and Restore does not restore Data Loss Prevention policies, so a successful restore is not evidence that DLP policy state was restored. [zia.backup-restore.restore-semantics:dlp-edm-idm]
- logged-in references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it): Category is the location in the Admin Console where an action was performed, and its potential values include Activation, Backup & Restore and Audit Logs (among others), so actions taken in the activation and Backup & Restore areas are logged under those categories. [zia.audit-logs.what-is-recorded:category-values]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): Restoring a restore point overwrites all current policies and configuration settings, including all rules and their components such as URL categories and time intervals; it is a replacement, not a merge. [zia.backup-restore.restore-semantics:overwrites-all]
- links-to references/_meta/text/zia/zia.audit-logs.md (ZIA audit logs: who changed what)
- links-to references/_meta/text/zia/zia.backup-restore.restore-points.md (ZIA restore point limits, golden point and scheduled eviction)
- links-to references/_meta/text/zia/zia.backup-restore.restore-semantics.md (What restoring a ZIA restore point does and does not revert)
