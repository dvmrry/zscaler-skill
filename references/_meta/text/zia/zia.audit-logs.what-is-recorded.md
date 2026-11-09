# What the ZIA admin audit log records and how the console shows it (zia.audit-logs.what-is-recorded)
Also called: zia audit log; admin audit log retention; who changed this config; audit log columns; audit log 6 months; failed login lockout audit

The admin audit log answers "who changed what, when, from where, and with what result". ZIA records the actions of every admin in the Admin Console and the actions that occur through the cloud service APIs, so a change made by an API client appears in the same trail as a console change. [zia.audit-logs.what-is-recorded:scope] The documented uses are viewing the alterations made to the console (such as PAC file modifications or URL Filtering policy alterations), viewing everything an admin changed during a login session, demonstrating compliance, and detecting suspicious activity or unauthorized access to the admin interface. [zia.audit-logs.what-is-recorded:purposes] Failed sign-in attempts that lead to a lockout are recorded: An admin account that makes 5 unsuccessful login attempts within 1 minute is locked out for 5 minutes, and the failed attempts are recorded in the audit log. [zia.audit-logs.what-is-recorded:lockout-recorded]

**Retention.** Audit logs are stored for up to 6 months. [zia.audit-logs.what-is-recorded:retention] Whether that window can be extended is open [gap:zia.audit-logs.what-is-recorded:retention-window], and so is how it compares with traffic log retention [gap:zia.audit-logs.what-is-recorded:retention-scope].

Reading it in the console: The Internet & SaaS audit log page is at Data Explorer > Audit Logs > Internet & SaaS; it filters by time range, action, category, sub-category, interface and result. [zia.audit-logs.what-is-recorded:console-page] Console search over resource, admin ID, client IP, trace ID or configuration changes returns only entries that start with or exactly match the search string, so a substring search misses entries. [zia.audit-logs.what-is-recorded:search-prefix-only] The console's CSV download expresses times in PDT, while the on-screen Timestamp is the local time of the action. [zia.audit-logs.what-is-recorded:csv-timezone]

What each entry carries: Each entry shows Timestamp, Action, Category, Sub-Category, Resource, Admin ID, Client IP, Interface (Admin UI or API), Trace ID and Result (success or failure). [zia.audit-logs.what-is-recorded:columns] Resource is the specific subject within a sub-category: when an admin adds a new admin, the resource is the name of the admin that was added. [zia.audit-logs.what-is-recorded:resource-meaning] Admin ID is the admin's login ID, or the internal API user `oauth-<rolename>$@<orgid>.<cloud-domain>` when an API action was authenticated by an external OAuth 2.0 server; Client IP is the admin's source address or the API client application's address. [zia.audit-logs.what-is-recorded:oauth-admin-id] Trace ID is generated and logged for transactions associated with Internet & SaaS API requests made via Zscaler OneAPI; it correlates API transactions with the OneAPI platform. [zia.audit-logs.what-is-recorded:trace-id-oneapi]

**Filters.** The Action filter's list of all potential values includes Activate, Forced Activate, Sign Out, and PAC file operations such as Create New PAC Version, Stage PAC Version and Change Deployed PAC Version. [zia.audit-logs.what-is-recorded:action-values] Category is the location in the Admin Console where an action was performed, and its potential values include Activation, Backup & Restore and Audit Logs (among others), so actions taken in the activation and Backup & Restore areas are logged under those categories. [zia.audit-logs.what-is-recorded:category-values] The category list is also how to find the change history of an area such as restore points, which are covered in [ZIA Backup and Restore](kb:zia.backup-restore).

**Incidental changes.** Rule-order shifts caused incidentally by creating a rule at a higher order are not shown in the audit log (only the new rule creation is), although the rule-list API response reflects them. [zia.audit-logs.what-is-recorded:incidental-rule-changes] An entry's configuration changes can be opened to show the pre-change and post-change difference, as an addition or deletion, or as an update. [zia.audit-logs.what-is-recorded:config-diff]

To pull the same data programmatically see [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api); to stream it to a SIEM see [Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT)](kb:zia.audit-logs.streaming).

What to check:
1. Whether the time window fits the 6-month retention before relying on the trail.
2. Whether the CSV's PDT times match the timezone of the incident timeline.
3. Whether a change in the trail was a direct action or an incidental rule-order shift: an entry shows only the rule created, so for the full effect read the rule list.

Not known (open gaps):
- Whether the 6-month audit retention is rolling or extendable [gap:zia.audit-logs.what-is-recorded:retention-window] (data gap): filled by operator; settled by support-ticket or tenant-data. Blocks: telling an investigator how far back an audit trail can be pulled
- Whether the 6-month retention is specific to admin audit logs [gap:zia.audit-logs.what-is-recorded:retention-scope]: settled by support-ticket or source-read

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs), from zia.audit-logs: Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zia/zia.audit-logs.streaming.md (Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT))
- links-to references/_meta/text/zia/zia.backup-restore.md (ZIA Backup and Restore)
