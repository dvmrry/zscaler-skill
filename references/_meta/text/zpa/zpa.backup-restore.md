# ZPA Backup and Restore: what a backup covers, the 10-backup limit, the golden backup, expiry, schedules and the PRA-tenant exclusion (zpa.backup-restore)
Also called: zpa backup; zpa restore; private access backup and restore; golden backup; scheduled backup; backup expiry; backup limit

Private Access Backup and Restore, a feature in limited availability, creates backups of application segments, policies and configuration settings and restores them; a backup represents the date and time it was created, and backups are automated using schedules or created manually on demand in the Admin Console. [zpa.backup-restore:what-it-is]

**Who cannot use it.** The ability to create, restore, edit or schedule a backup is not supported if the tenant has Privileged Remote Access; the actions appear grayed out on the page and Zscaler Support must be contacted to disable PRA for the tenant. [zpa.backup-restore:pra-tenants-unsupported]

**Coverage.** The service backs up application segments, Browser Access, Client Hostname Validation, DNS Search Domains, segment groups, servers and server groups. [zpa.backup-restore:coverage-application-management] The article's list of features unavailable for the backup and restore service opens with AppProtection; Deception-enabled applications, segment groups, servers, server groups and access policies; extranet application support; Privileged Remote Access; Internet & SaaS-referenced server groups; and Zscaler-managed certificates and DNS, which makes Browser Access applications, user portals and PRA portals using them unavailable. [zpa.backup-restore:coverage-excluded] The same article's unavailable and backed-up lists disagree about policies, certificates and user portals [divergence:zpa.backup-restore:backup-coverage], and both name segment groups, servers and server groups [divergence:zpa.backup-restore:segment-group-coverage].

**Limits and expiry.** An organization can have up to 10 backups, including manual and scheduled backups. At the limit a backup cannot be added manually without deleting an existing one, while a scheduled backup is created by removing the oldest backup; if the oldest backup is a golden backup, the next oldest is removed. [zpa.backup-restore:limit-10] Backups expire after 10 days. If a backup has expired its Restore action is disabled, and a backup with less than 3 days before expiration shows a yellow Caution icon. [zpa.backup-restore:expiry-10-days] Whether a golden backup also expires is open [gap:zpa.backup-restore:golden-expiry].

**Golden backup.** One of the backups can be designated the golden backup, which is the last known good backup of policies and configuration settings; there can be only one at any given point in time. A backup with a failed status cannot be marked as a golden backup, and for a golden backup with a failed status Zscaler recommends selecting a new backup with a completed status as the golden backup. [zpa.backup-restore:golden-backup] Whether a golden backup can be deleted is worded two ways [divergence:zpa.backup-restore:golden-deletion].

**Creating and managing backups.** The backup page lists each backup's Created By (the admin that created it), Creation Date, Expiration Date, and Status, which refreshes automatically every minute; clicking the backup name opens its Restore Activities window, and a Flag icon marks a golden backup. [zpa.backup-restore:page-columns] The automatic backup scheduler is disabled by default. A schedule takes a Backup Prefix Name, a Frequency of Daily, Weekly or Monthly (Monthly by default) with a Date for Monthly or a Day of the week for Weekly, a Backup Creation Time and a Time Zone. The creation time in a scheduled backup's name might differ from the creation date on the page because of the user's selected time zone. [zpa.backup-restore:scheduled-backups] A manual backup takes a Name, a Golden Backup option and an optional Description; in the Edit Backup drawer only the name, the Golden Backup setting and the description can be modified. [zpa.backup-restore:manual-and-edit-fields] Deleting a backup also deletes the linked restore activities; for example, information about who restored the backup and the restore reports are deleted. [zpa.backup-restore:delete-removes-activities] The backup status values are open [gap:zpa.backup-restore:status-values].

What a restore overwrites, its reports and its inconsistencies are in [What restoring a ZPA backup does: overwrite and removal, legacy backups, reports, the pre-restore backup, the documented inconsistencies and failure reasons](kb:zpa.backup-restore.restore-semantics); the ZIA counterpart is [ZIA Backup and Restore](kb:zia.backup-restore) (the ZIA limit is in its restore-points subject).

What to check:
1. Whether the tenant has Privileged Remote Access, since create, restore, edit and schedule are then unsupported.
2. Whether an answer about what is backed up for policies, certificates and user portals rests on the disagreeing lists.
3. Whether a backup is within 10 days of creation and under the 10-backup count, since expired backups cannot be restored and a manual add is refused at 10.
4. Whether a failed backup is being treated as the golden backup, and how deletion of the golden backup is documented.

Sources disagree (name both sides):
- About Backup and Restore lists access, client forwarding and timeout policies, certificates and user portals as unavailable, then lists Certificate Management, Policy and User Portals as backed up; the restoring article documents restore inconsistencies for those same objects. [divergence:zpa.backup-restore:backup-coverage]
  - zscaler-help: The list introduced as features unavailable for the backup and restore service continues with Browser Access certificates, access policy, client forwarding policy, timeout policy and portal links.
  - zscaler-help: After that list the same article lists Certificate Management at the top level, next to the backed-up items.
  - zscaler-help: The restoring article documents restore inconsistencies for access policies, client forwarding policies, timeout policies, certificates and user portals.
  Impact: Whether access, client forwarding and timeout policies, certificates and user portals are backed up and restored is unsettled. The captured list structure suggests the trailing items may have been children of the second list mis-nested under the unavailable note, but no source says so. Do not state either coverage as settled.
- The same article lists segment groups, servers and server groups as backed up and, in the unavailable list, lists Deception-enabled segment groups, servers and server groups. [divergence:zpa.backup-restore:segment-group-coverage]
  - zscaler-help: Segment groups, servers and server groups are in the list of what the service backs up.
  - zscaler-help: Deception-enabled applications, segment groups, servers, server groups and access policies are unavailable.
  Impact: The articles do not say whether the unavailable entries are only the Deception-enabled objects or whether the plain objects overlap; the application-management coverage claim and the unavailable-list claim both name these objects. Do not state segment group, server or server group coverage without both lists.
- The same article says the golden backup cannot be deleted and also recommends deleting a failed golden backup. [divergence:zpa.backup-restore:golden-deletion]
  - zscaler-help: The golden backup cannot be deleted.
  - zscaler-help: For a golden backup with a failed status Zscaler recommends deleting the backup and selecting a new completed backup as golden.
  Impact: The article does not say whether the golden flag must be cleared before a failed golden backup is deleted. Do not state that a golden backup can or cannot be deleted without both sentences.

Not known (open gaps):
- Whether the golden backup also expires after 10 days [gap:zpa.backup-restore:golden-expiry]: settled by source-read or lab-test
- The backup Status values and name and description limits [gap:zpa.backup-restore:status-values]: settled by source-read or lab-test

Area: zpa.backup-restore, its subjects in references/_meta/spine/zpa/zpa.backup-restore.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.backup-restore.md (ZIA Backup and Restore)
- links-to references/_meta/text/zpa/zpa.backup-restore.restore-semantics.md (What restoring a ZPA backup does: overwrite and removal, legacy backups, reports, the pre-restore backup, the documented inconsistencies and failure reasons)
