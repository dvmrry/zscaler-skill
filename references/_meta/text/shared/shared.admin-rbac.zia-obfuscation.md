# Who sees real user names, device information and Gen AI prompts in ZIA: role obfuscation and auditors (shared.admin-rbac.zia-obfuscation)
Also called: zia auditor; obfuscate user names admins; obfuscating device information; auditor override obfuscated; user name obfuscation role; gen ai prompt obfuscation

ZIA hides user names, device information and Gen AI prompts from an admin according to the admin's role, and an auditor can reveal obfuscated user names and device information for a session. An admin role sets User Names (real user names in dashboards, reports and insights), Device Information (device name, device hostname and device owner in dashboards, reports and insights) and Gen AI Prompt (prompts in the Web Insights Logs) each to Visible or Obfuscated. [shared.admin-rbac.zia-obfuscation:role-settings] Obfuscation is enabled on the role assigned to the admin, so editing that role changes every admin who holds it; the user-name page and the device-information page each say so. [shared.admin-rbac.zia-obfuscation:set-on-the-role]

**Setting it.** To set user-name or device-information obfuscation for an admin account, the configuring admin needs a role with Full permission to Administrators Access and organizational admin scope; with admin rank enabled, another admin being configured must have a rank lower than or equal to the configuring admin's. The user-name page and the device-information page give the same three conditions. [shared.admin-rbac.zia-obfuscation:configure-prerequisites] The rank condition there differs from the admin rank page [divergence:shared.admin-rbac.zia-obfuscation:equal-rank-vs-lower-rank]. User names can also be obfuscated in NSS feeds; the user-names page points to the articles on adding NSS feeds for web, firewall and DNS logs. [shared.admin-rbac.zia-obfuscation:nss-feeds]

**Auditors.** Some regions have legal requirements that user names always remain obfuscated in reports and logs for admins; an admin who needs real user names, or device information, must have an auditor grant permission. [shared.admin-rbac.zia-obfuscation:auditor-needed] A super admin can create an account for the auditor in the Admin Console and share the credentials; the credentials only let the auditor permit admins to view obfuscated user names and device information and cannot be used to log in to the Admin Console. [shared.admin-rbac.zia-obfuscation:auditor-account] A message in the top-right corner tells an admin that some information is obfuscated; an auditor can click Override and enter credentials to reveal it. The data is visible for the duration of the session, and obfuscation begins again the next time the admin signs in to the Admin Console. [shared.admin-rbac.zia-obfuscation:override-per-session]

**Managing auditors.** Adding, editing or deleting auditors needs a super admin role and organizational scope. [shared.admin-rbac.zia-obfuscation:manage-auditors] An auditor's login ID is the one the auditor uses from the SSO provider portal, with a domain name from those provided to Zscaler. Disabling an auditor clears its password, so a new one is needed on re-enabling, and with SAML enabled setting a password is optional. Comments cannot exceed 10,240 characters. The password, which the auditor must enter to give an admin permission to view user names, is 8 to 100 characters with at least one number, one special character and one uppercase letter. [shared.admin-rbac.zia-obfuscation:auditor-fields] The vendor lists as auditor benefits an additional layer of security for user name visibility, control over who can access obfuscated user names, and keeping track of the admins who request access to user names. [shared.admin-rbac.zia-obfuscation:auditor-benefits]

**Executive Insights App.** In the Executive Insights App role, User Names, Device Information and Gen AI Prompt are each set to Visible or Obfuscated for admins with the role when they view data in the Executive Insights App. [shared.admin-rbac.zia-obfuscation:executive-insights-obfuscation] The role's other permissions are in [ZIA admin role permissions: logs limit, dashboard, reporting, insights and alerts access, and the feature categories](kb:shared.admin-rbac.zia-permissions).

**Open questions.** Where an override is recorded is open [gap:shared.admin-rbac.zia-obfuscation:override-recorded]. How an auditor is identified when SAML is on is open [gap:shared.admin-rbac.zia-obfuscation:auditor-saml]. Whether obfuscation reaches API responses is open [gap:shared.admin-rbac.zia-obfuscation:api-responses].

What to check:
1. For an admin who sees obfuscated user names or device information, the obfuscation setting on the role the admin holds, and who else holds that role.
2. For an admin who needs real user names or device information, whether an auditor can grant permission, and that the permission lasts for the session.
3. For a failure to set obfuscation on another admin account, the configuring admin's Administrators Access permission, scope and rank, using the divergence over equal rank.

Sources disagree (name both sides):
- Whether an admin can manage another admin account of equal rank: the admin rank page limits account management to lower-ranked accounts, while the two obfuscation pages allow a rank lower than or equal to the configuring admin's. The rank page's claim is [[shared.admin-rbac.zia:rank-roles-and-accounts]]. [divergence:shared.admin-rbac.zia-obfuscation:equal-rank-vs-lower-rank]
  - zscaler-help: Admins permitted to manage admin accounts can create, edit or view only accounts with a lower rank.
  - zscaler-help: For user-name obfuscation on another admin account, that admin's rank may be lower than or equal to the configuring admin's.
  - zscaler-help: For device-information obfuscation on another admin account, that admin's rank may be lower than or equal to the configuring admin's.
  Impact: Whether an admin of the same rank can have obfuscation set, or an account edited, is not settled by the pages; the obfuscation pages may describe only that setting, which they do not say.

Not known (open gaps):
- Where an auditor override, or a request for one, is recorded [gap:shared.admin-rbac.zia-obfuscation:override-recorded]: settled by source-read or lab-test
- How an auditor proves identity when SAML is enabled and no password is set [gap:shared.admin-rbac.zia-obfuscation:auditor-saml]: settled by source-read or lab-test
- Whether obfuscation applies to API responses [gap:shared.admin-rbac.zia-obfuscation:api-responses]: settled by source-read or lab-test

Area: shared.admin-rbac, its subjects in references/_meta/spine/shared/shared.admin-rbac.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.zia-permissions.md (ZIA admin role permissions: logs limit, dashboard, reporting, insights and alerts access, and the feature categories)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.admin-rbac.md (Admin roles across ZIA, ZPA and Authentication Service, and how admins are entitled)
- see-also references/_meta/text/shared/shared.admin-rbac.zia.md (ZIA admin roles and scope: rank, permissions, functional scope and the one-scope rule)
- see-also references/_meta/text/zia/zia.insights.logs.md (ZIA Insights Logs: log families, time frame, export and background queries, filters and console-only columns)
