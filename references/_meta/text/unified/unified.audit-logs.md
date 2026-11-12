# Experience Center and Role Management audit logs: what is recorded, categories, actions, record fields, lockout, retention, search and export (unified.audit-logs)
Also called: experience center audit logs; admin console audit logs; role management audit logs; Data Explorer audit logs

The Experience Center audit log records the session of each admin who signs in to the Zscaler Admin Console: sign-in and sign-out attempts and the configuration changes, such as updates or deletes, completed during the session. [unified.audit-logs:what-is-recorded] An admin account that makes five unsuccessful attempts to log in within one minute is locked out for five minutes and the failed attempts are recorded in the audit log; the audit logs are stored for up to 6 months. [unified.audit-logs:lockout-retention]

**Reading an entry.** On the Audit Logs page (Data Explorer > Audit Logs > Experience Center), the Category is a location in the Zscaler Admin Console where a user or an API performed the action, the actions that can be filtered depend on the category, and the possible categories are Authentication, Unified Locations, User Preference, Home Page Personalization, Onboarding, Remote Assistance, Subsystem Clouds and Unified RBAC. [unified.audit-logs:categories] The possible actions are Create, Delete, Recently Visited, Sign In, Sign Out and Update, performed by an admin in the Zscaler Admin Console or by an API. [unified.audit-logs:actions] Besides Category and Action, each entry has a Timestamp (the date and local time the action occurred), a User (the admin's login ID, or the internal API user oauth-<rolename>$@<orgid>.<cloud-domain> if an API action was authenticated by an external OAuth 2.0 authentication server), a Resource (the specific subject within a sub-category, for example the name of an admin that was added), a Client IP (the admin's source IP address or the client application's IP address that executed the API) and a Result of Success, Failure or Partially Failed. [unified.audit-logs:record-fields]

**Searching and exporting.** The log can be searched by resource, user or client IP, and the search shows only results starting with or completely matching the search string; it can be downloaded as a CSV file; and a configuration change shows visual differences between the pre-configuration and post-configuration, for additions or deletions and for updates. [unified.audit-logs:search-export-diff] No API, NSS or streaming path is described for it [gap:unified.audit-logs:api-stream-path], and the CSV's time zone is open [gap:unified.audit-logs:csv-time-zone].

**Role Management.** A separate audit log records the activity of each admin who uses the Role Management page: creating, updating and deleting admin roles. Its page (Data Explorer > Audit Logs > Role Management) filters by timestamp, action and result; the actions are Create Role, Update Role and Delete Role; each entry has a Target Role Name (the administrator role that was created, updated or deleted), a User (the admin's login ID or the internal API user), a Client IP and a Result of Success or Failure; and the changes made to a role can be viewed if it was updated. [unified.audit-logs:role-management-log] The role pages are in [Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled](kb:shared.admin-rbac). What the log leaves out is open [gap:unified.audit-logs:role-log-scope].

**Lockout.** The sign-in page words the lockout differently: [Signing in to the Zscaler Admin Console: URLs, sign-in methods, lockouts, password and MFA reset, and the upgrade to Experience Center](kb:unified.admin-console.sign-in). Which sign-in methods the lockout covers is open [gap:unified.audit-logs:lockout-methods].

What to check:
1. Whether the change falls under the Experience Center audit log or the Role Management audit log, and its category and action.

Not known (open gaps):
- Whether the Experience Center audit log has an API, NSS or streaming path [gap:unified.audit-logs:api-stream-path]: settled by support-ticket or source-read
- What the Role Management audit log leaves out [gap:unified.audit-logs:role-log-scope]: settled by lab-test or support-ticket
- Which time zone the CSV download uses [gap:unified.audit-logs:csv-time-zone]: settled by lab-test
- Which sign-in methods the admin lockout covers [gap:unified.audit-logs:lockout-methods]: settled by lab-test or support-ticket

Area: unified.audit-logs, its subjects in references/_meta/spine/unified/unified.audit-logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.md (Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled)
- links-to references/_meta/text/unified/unified.admin-console.sign-in.md (Signing in to the Zscaler Admin Console: URLs, sign-in methods, lockouts, password and MFA reset, and the upgrade to Experience Center)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)
- see-also references/_meta/text/unified/unified.overview.md (Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated)
