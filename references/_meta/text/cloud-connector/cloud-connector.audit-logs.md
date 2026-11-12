# Cloud & Branch Connector audit logs in the console: what is recorded, retention, lockout, filters and CSV (cloud-connector.audit-logs)
Also called: cloud connector audit log; branch connector audit logs; cbc audit logs; data explorer audit logs branch and cloud; cloud connector admin lockout

The Cloud & Branch Connector audit log is the console's record of admin sign-ins and the configuration changes they make; the API's report is in [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs). Zscaler records the login name and IP address of every admin who logs in to the Admin Console and changes policies or configuration settings; the audit log displays login and logout records and any configuration changes the admin completed. [cloud-connector.audit-logs:what-is-recorded] The Cloud & Branch Connector console stores audit logs for up to 6 months. [cloud-connector.audit-logs:retention] If an admin account makes 5 unsuccessful attempts to log in within one minute, the account is locked out for 5 minutes and the failed attempts are recorded. [cloud-connector.audit-logs:lockout]

**Reading it.** The Audit Logs page (Data Explorer > Audit Logs > Branch and Cloud) filters by Time Range, Action, Category, Sub-Category, Interface and Result, and searches by Resource, Admin ID or Client IP. [cloud-connector.audit-logs:page-filters] An entry gives the Timestamp (the local time of the admin's last login or logout), Actions (performed in the Admin Console or API), Category (a location in the portal), Resource (the location within a subcategory), Admin ID (the admin's login ID), Client IP (the admin's source IP address) and Interface (the Admin UI or an API). [cloud-connector.audit-logs:columns] The actions the log can record include Sign Out, Audit Operation, Activate, Force Activate, Import and Report. [cloud-connector.audit-logs:actions] The categories the log can record include Traffic Forwarding Resource, Provisioning Management, Firewall Access Control, Forwarding Type and Firewall Resource. [cloud-connector.audit-logs:categories] The sub-categories the log can record include Location Template, Provisioning Template, Location Group, Cloud & Branch Connector Group, Network Service Group, NSS Server, Password Expiry, Source IP Group, Destination Group, Firewall Forwarding, NSS FEED and Cloud & Branch Connector Location. [cloud-connector.audit-logs:subcategories] A successful action shows as a green circle with a checkmark and a failed one as a red circle with an X. [cloud-connector.audit-logs:result] Selecting a configuration change lets the admin view visual differences between the pre-configuration and post-configuration changes; the page says there are two types of changes to view. [cloud-connector.audit-logs:config-diff] The Audit Logs page downloads a CSV file whose times are in PDT. [cloud-connector.audit-logs:csv-pdt]

**Open.** The two types of configuration change view are not named in the capture [gap:cloud-connector.audit-logs:change-view-types], nor is whether the lockout covers SAML sign-in [gap:cloud-connector.audit-logs:lockout-methods] or whether remote assistance sessions are audited [gap:cloud-connector.audit-logs:remote-assistance-audited]. Which role permission grants access to the log is open [gap:cloud-connector.audit-logs:audit-log-permission]; the role categories are in [Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC](kb:shared.admin-rbac.cloud-connector).

What to check:
1. Whether the change falls inside the 6-month retention before concluding it was not made.
2. For an admin who cannot sign in, whether 5 failed attempts within one minute locked the account and the 5-minute lockout has passed; for SAML sign-in the page does not say whether the lockout applies.
3. When comparing times with the CSV download, that its times are in PDT.

Not known (open gaps):
- The two types of configuration change view [gap:cloud-connector.audit-logs:change-view-types]: settled by source-read or lab-test
- Which sign-in methods the 5-attempt lockout covers [gap:cloud-connector.audit-logs:lockout-methods]: settled by lab-test or support-ticket
- Whether Zscaler Support remote assistance sessions are audited [gap:cloud-connector.audit-logs:remote-assistance-audited]: settled by support-ticket or lab-test
- Which role permission governs the Audit Logs page [gap:cloud-connector.audit-logs:audit-log-permission]: settled by source-read or tenant-data

Area: cloud-connector.audit-logs, its subjects in references/_meta/spine/cloud-connector/cloud-connector.audit-logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- see-also references/_meta/text/zdx/zdx.audit-logs.md (ZDX admin audit logs in the console: what is recorded, retention, lockout and filters)
- see-also references/_meta/text/cloud-connector/cloud-connector.admin-sso.md (SAML SSO for Cloud & Branch Connector admins: IdP-initiated sign-in, the break-glass super admin and the Okta, Azure AD and AD FS settings)
