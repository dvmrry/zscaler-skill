# ZDX admin audit logs in the console: what is recorded, retention, lockout and filters (zdx.audit-logs)
Also called: zdx audit log; zdx audit logs; digital experience audit logs; zdx admin audit; zdx sign-in lockout

The ZDX audit log is the console's record of each admin session in Digital Experience; the API's report is in [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs). Zscaler records the session information for each admin that signs in to Digital Experience features; the audit log displays sign-in and sign-out attempts (for example timestamps, actions, IP addresses) and any configuration changes completed during the session, such as updates or deletes, and configuration changes can be reviewed for before-and-after comparison. [zdx.audit-logs:what-is-recorded] ZDX audit logs are stored for a period of 6 months. [zdx.audit-logs:retention] If an admin makes 5 consecutive unsuccessful attempts to sign in within 1 minute, the account is locked out for 5 minutes and the failed attempts are recorded. [zdx.audit-logs:lockout]

**Reading it.** An entry gives the Timestamp (the local time of the admin's last login or last logout), Category and Sub-Category (a location and sublocation in Digital Experience where the action was performed), the Resource (the specific location within a subcategory), the Admin ID (the admin's login ID), the Client IP (the source IP address for the admin) and a Modification view of configuration changes from an admin login. [zdx.audit-logs:columns] The Audit Logs page filters by Time Range, Action, Category, Sub-Category, Interface or Result; the default Time Range is Current Day while the other filters default to All, and the Time Range choices include Current Week, Current Month, Previous Day, Previous Week and Previous Month. [zdx.audit-logs:filters] The list of potential Actions includes Activate, Audit Operation, Download, Forced Activate, Policy Sync and Sign Out, among others. [zdx.audit-logs:actions] The list of potential Categories includes Activation, Administration, Administrator Management, Cloud Service API Key, Configuration, Inventory Management, Organization Info, Remediation, Role Management, SaaS Security API, Software Device Inventory, Traffic Forwarding Resource and ZDX Snapshot, among others. [zdx.audit-logs:categories] The list of potential Sub-Categories includes Activation, Administrator, Applications, Cloud Service API Key, Deep Tracing, Diagnostics, EUSA Info, Location, Microsoft Endpoint Analytics, Password Expiry, Remediation Jobs, Remote Assistance, Remote Script Configuration, Role Management, SAAS App Tenant, Self Service Settings, Software and Device Inventory, Wi-Fi Access Point, ZDX Snapshot, ZDX SSO Login and Zscaler Hosted Monitoring, among others. [zdx.audit-logs:subcategories] The audit log has an Interface filter with a list of potential Interface values and a Result filter, where Result is the outcome of an action in either Success or Failure. [zdx.audit-logs:interface-result] The displayed audit log can be downloaded as a CSV file whose times are in PDT, and the page can be searched by Resource (the default), Admin ID or Client IP. [zdx.audit-logs:csv-and-search]

**Open.** Whether changes made through the API appear in this log, and whether it is the data behind the API's audit report, are open [gap:zdx.audit-logs:api-changes], as is which sign-in methods the lockout covers [gap:zdx.audit-logs:lockout-methods]. Who may view it is a role permission: [One permission covers Administrator Management, Role Management, Location Management and Audit Logs, with Full allowing full access to Administrator Management; although roles are created in Role Management, they are managed by Super Admins. Separate permissions cover Zscaler locations (View Only views them) and Users, Groups and Departments in User Management (View Only views what has been set up).](kb:shared.admin-rbac.zdx:administrator-management-permission).

What to check:
1. Whether the change falls inside the 6-month retention before concluding it was not made.
2. For an admin who cannot sign in, whether repeated failed attempts locked the account and the lockout window has passed.
3. Whether an API change would be in this log before using it as the record of an API-driven change.

Not known (open gaps):
- Whether API changes appear in the ZDX audit log, and how it relates to the API's audit report [gap:zdx.audit-logs:api-changes]: settled by lab-test or source-read. Blocks: using the console log as the record of an API-driven change
- Which sign-in methods the 5-attempt lockout applies to [gap:zdx.audit-logs:lockout-methods]: settled by lab-test or support-ticket. Blocks: explaining a lockout for an admin who signs in with SAML

Area: zdx.audit-logs, its subjects in references/_meta/spine/zdx/zdx.audit-logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.zdx.md (ZDX admin roles: predefined and custom roles, permissions, obfuscation and admin scope)
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.overview.md (ZDX at a glance: what it measures and which subject answers each question)
- see-also references/_meta/text/zia/zia.audit-logs.md (ZIA audit logs: who changed what)
- see-also references/_meta/text/zpa/zpa.audit-logs.md (ZPA admin audit logs)
