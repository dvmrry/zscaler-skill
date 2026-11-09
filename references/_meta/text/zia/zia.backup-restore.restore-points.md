# ZIA restore point limits, golden point and scheduled eviction (zia.backup-restore.restore-points)
Also called: 12 restore points; golden restore point; restore point limit; scheduled backup deletes oldest; restore point name length

Restore points are a bounded set with different rules for manual and scheduled creation. Whether a failed scheduled backup is logged or alerted is not stated [gap:zia.backup-restore.restore-points:scheduled-failure-logging].

Creation: Backups are created manually on demand or automatically on a schedule in the Admin Console; each restore point records the date and time its backup was created. [zia.backup-restore.restore-points:manual-or-scheduled] Scheduled backups must be requested from the Zscaler Account team: the Creating Scheduled Backup Configuration page says to contact the Zscaler Account team to access the feature. [zia.backup-restore.restore-points:scheduled-access] A scheduled backup configuration has a Restore Point Prefix Name, a Frequency of Weekly (with a Day of the week) or Monthly (with a Date), a Restore Point Creation Time and a Time Zone in which the configuration is valid. [zia.backup-restore.restore-points:schedule-fields] The page that lists them: The Backup & Restore page lists each restore point with Restore Point Name, Description, Created By and Created On, and marks the golden one with a flag icon. [zia.backup-restore.restore-points:page-columns] Name and description limits: A restore point name is limited to 128 characters and its description to 10,240 bytes. [zia.backup-restore.restore-points:field-limits]

The cap: An organization can have up to 12 restore points, counting manual and scheduled backups together. [zia.backup-restore.restore-points:limit-12] One restore point can be designated the Golden Restore Point; it exists indefinitely and cannot be deleted, and only one can exist at a time. [zia.backup-restore.restore-points:golden]

**At the cap.** At 12 restore points a new restore point cannot be added manually until an existing one is deleted. [zia.backup-restore.restore-points:manual-blocked-at-limit] When a scheduled backup would exceed the limit, the oldest restore point is removed to make room; if the oldest is the golden one, the next oldest is removed instead. [zia.backup-restore.restore-points:scheduled-evicts] A scheduled backup at the limit removes the oldest non-golden restore point without any administrator choosing it, while the Golden Restore Point is never evicted or deleted; designating the point to retain as golden is what protects it. [zia.backup-restore.restore-points:golden-survives-eviction]

A Backup & Restore category exists in the audit log filters: [What the ZIA admin audit log records and how the console shows it](kb:zia.audit-logs.what-is-recorded). What a restore does to the live configuration is in [What restoring a ZIA restore point does and does not revert](kb:zia.backup-restore.restore-semantics).

What to check:
1. How many restore points exist, and whether the point you need is the golden one, before a change window.
2. Whether a scheduled backup is due that would evict the point you need, since the oldest point is removed to make room.

Inferred, not quoted (say so when an answer rests on one):
- [zia.backup-restore.restore-points:golden-survives-eviction] Tier B: Only one golden point can exist, so only one point can be protected this way.

Not known (open gaps):
- Whether a failed scheduled backup is logged or alerted [gap:zia.backup-restore.restore-points:scheduled-failure-logging]: settled by lab-test or source-read

Area: zia.backup-restore, its subjects in references/_meta/spine/zia/zia.backup-restore.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it): Category is the location in the Admin Console where an action was performed, and its potential values include Activation, Backup & Restore and Audit Logs (among others), so actions taken in the activation and Backup & Restore areas are logged under those categories. [zia.audit-logs.what-is-recorded:category-values]
- interacts-with references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention), from zia.backup-restore: For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM) enabled, Backup and Restore does not restore Data Loss Prevention policies, so a successful restore is not evidence that DLP policy state was restored. [zia.backup-restore.restore-semantics:dlp-edm-idm]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.backup-restore: Restoring a restore point overwrites all current policies and configuration settings, including all rules and their components such as URL categories and time intervals; it is a replacement, not a merge. [zia.backup-restore.restore-semantics:overwrites-all]
- links-to references/_meta/text/zia/zia.backup-restore.restore-semantics.md (What restoring a ZIA restore point does and does not revert)
