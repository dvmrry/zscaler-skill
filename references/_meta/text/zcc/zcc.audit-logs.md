# Client Connector audit logs in the Admin Console: what is recorded, retention, columns, actions, categories and filters (zcc.audit-logs)
Also called: zcc audit logs; client connector audit log; mobile administration audit log; mobile admin audit log; who changed client connector settings

The Client Connector audit log is the console record of admin logins, logouts and configuration changes. Zscaler records the login name and IP address of every admin who logs in to the Admin Console and changes policies or configuration settings; the audit log shows each admin's login and logout record and any configuration changes they completed. [zcc.audit-logs:what-is-recorded]

**Where and how long.** The Client Connector admin audit records are viewed and filtered under Data Explorer > Audit Logs > Mobile Administration. [zcc.audit-logs:page] The Client Connector audit logs are stored for up to 6 months. [zcc.audit-logs:retention]

**What each record shows.** Each audit record shows Timestamp (the local time of the admin's last login or logout), Action (what the admin did), Category (where in the Admin Console the action was performed), Sub-Category (the location within the category), Resource (the location within the subcategory), Admin ID (the admin's login ID), Client IP (the admin's source IP address) and Result (the outcome). [zcc.audit-logs:columns] A successful action shows as a green circle with a check mark and a failed one as a red circle with an X. [zcc.audit-logs:result] Configuration changes can be seen for each action, with visual differences between the pre- and post-configuration state: additions and deletions, and updates. [zcc.audit-logs:config-diff]

**Actions, categories and sub-categories.** The page lists the potential actions as Create, Delete, Sign In, Sign Out and Update. [zcc.audit-logs:actions] The page lists the potential categories as Activate Policy, App Profiles, Device Overview, Device Posture, Forwarding Profile, IdP User Agent, Login, Trusted Networks, Zscaler Client Connector IdP, Zscaler Client Connector Notifications, Zscaler Client Connector Store, Zscaler Client Connector Support and Zscaler Service Entitlement. [zcc.audit-logs:categories] The page lists the potential sub-categories as Activate Policy, Advanced Configuration, Android App Profiles, App Fail Open, App Supportability, AUP Settings, Device Cleanup, Device Posture, End Point Integration, Export Enrolled Devices, Force Remove Device, Forwarding Profile, IdP User Agent, iOS App Profiles, Login, macOS App Profiles, Reminder Notification Settings, Soft Remove Device, System Tray Notification Settings, Traceroute Policy, Trusted Networks, Update Applications, User Privacy, Windows App Profiles, ZPA Service Entitlement and Zscaler Client Connector IdP. [zcc.audit-logs:subcategories] No sub-category is listed for Linux app profiles, Device Groups, Partner Devices or Deception settings [gap:zcc.audit-logs:missing-subcategories].

**Filtering and export.** The Audit Logs page filters by time range, action, category, subcategory and result, searches entries by Client IP, Resource or Admin ID, and exports the entries. [zcc.audit-logs:filters-search-export] The export format and the time zone of the timestamps are not stated [gap:zcc.audit-logs:export-format].

**Open.** Whether API calls are audited, since the page lists no Interface column, and whether the log can be read through an API are open [gap:zcc.audit-logs:interface-and-api]; the role page's Audit Logs setting is in [The Administration section's settings, each given a permission, are Client Connector App Store, Client Connector Notifications, Audit Logs, Forwarding Profile, Trusted Networks, Client Connector Support, Zscaler Service Entitlement, User Agent, Client Connector IdP, Device Posture, Business Continuity, Application Bypass Info, Dedicated Proxy Port, Public API, Platform Settings (formerly Authentication Settings), Device Groups, Private Access Partner Logins, Location-Based Policies and Administration Management. Admins must have full access to configure settings.](kb:shared.admin-rbac.zcc:administration-settings). The page describes admin actions only, so whether end-user actions such as Report an Issue, log exports or OTP use are recorded is open [gap:zcc.audit-logs:end-user-actions]; the cross-product view is in [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs).

What to check:
1. Where to look for a Client Connector configuration change: the Audit Logs page's Mobile Administration entries, filtered by action, category, sub-category and result, within the stored period.
2. Before concluding that nothing changed a setting, whether the area is among the listed sub-categories.

Not known (open gaps):
- Sub-categories for Linux app profiles, Device Groups, Partner Devices and Deception settings [gap:zcc.audit-logs:missing-subcategories]: settled by lab-test or source-read
- Export format and timestamp time zone of the Client Connector audit log [gap:zcc.audit-logs:export-format]: settled by lab-test or source-read
- Whether Client Connector API calls are audited and whether the log has an API [gap:zcc.audit-logs:interface-and-api]: settled by lab-test or support-ticket
- Whether end-user actions are recorded in the Client Connector audit log [gap:zcc.audit-logs:end-user-actions]: settled by support-ticket or lab-test

Area: zcc.audit-logs, its subjects in references/_meta/spine/zcc/zcc.audit-logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.zcc.md (Client Connector admin roles: the Administration Management page, Full, View Only, None and Customize, the permission sections and token obfuscation)
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)
