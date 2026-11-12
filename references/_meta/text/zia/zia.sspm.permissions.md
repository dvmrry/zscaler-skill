# Permissions and admin roles needed to onboard each SaaS application for SSPM (zia.sspm.permissions)
Also called: sspm permissions; onboarding permissions; scope requested; sspm remediation support

SaaS applications can be onboarded for the SSPM scan with read-only permissions, and the page says SSPM typically requires read-only access for posture assessments. The page's tables give the scope requested, the onboarding user role, whether the scope is read-only, and whether it is required for onboarding validation, the SSPM scan and SSPM remediation support. The Okta table has no read-only column. [zia.sspm.permissions:read-only-basis] The application lists differ between the vendor's pages, see [SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM](kb:zia.sspm).

**Onboarding roles.** The onboarding role differs per application: GitHub needs an Authenticated User, Repository Owner or Organization Owner; Google Workspace a Super Administrator; Jira/Confluence an Administrator to create the Organization API Key; Microsoft 365 a Global Administrator; Okta a Super Administrator; Salesforce a System Administrator User; Workday an Integration System User; Box, Twilio and Trello a user with Administrator privileges; ServiceNow a System Administrator User to configure the ACLs; Webex Teams an Organization Admin with the Full Admin, Compliance Officer and Webex Site Admin roles; Zoom the account owner. [zia.sspm.permissions:onboarding-roles]

**Per application.**
- **GitHub.** GitHub's repo scope is not read-only: it requires write, maintain or admin privileges for the authenticated user and is required for onboarding validation, the SSPM scan and remediation (as write). The admin:org_hook scope, used to create webhooks, needs admin permissions for orgs and is marked not required for validation, the scan or remediation. [zia.sspm.permissions:github-non-read-only]
- **Google Workspace.** For Google Workspace the page marks read-only equivalents when read-only mode is chosen. The drive scope is marked required for onboarding validation when write scopes are chosen (and not for the scan or remediation), and serves an unsupported policy. The https://mail.google.com/ scope, whose read-only equivalent is gmail.readonly, fetches Gmail auto-forward, IMAP and POP policies and is required for remediation support. [zia.sspm.permissions:google-write-scopes]
- **Jira and Confluence.** For Jira/Confluence the page marks scoped permissions as not valid for SSPM, since an Organization API Key with FULL scope is required. [zia.sspm.permissions:jira-confluence-full-scope]
- **Microsoft 365.** For Microsoft 365, Exchange.ManageAsApp, Sites.ReadWrite.All and Sites.FullControl.All are Application (Admin) permissions that are not read-only and are required for both the SSPM scan and remediation; Sites.FullControl.All is for PowerShell access to attributes not available through the API. [zia.sspm.permissions:m365-non-read-only]
- **Okta.** For Okta, the okta.threats.manage, okta.policies.manage and okta.roles.manage scopes are listed with the Super Admin role, each marked No for the SSPM scan and Yes for remediation support, to manage threat insights configurations, policies and role assignments in the organization. [zia.sspm.permissions:okta-manage-for-remediation]
- **Salesforce.** For Salesforce the page says Manage Sharing and Manage Certificates are not read-only and inevitable because Salesforce has no granular permission for them, and that the Metadata API permission is inevitable because no read-only equivalent exists. Modify All Data is marked required only for remediation. [zia.sspm.permissions:salesforce-inevitable-write]
- **ServiceNow.** ServiceNow is onboarded through table ACLs that require a role such as zscaler_admin. The page's read ACLs include those on the v_plugin and ip_access tables, and a write ACL is listed to update configurations as per policy recommendation during remediation. [zia.sspm.permissions:servicenow-acls]
- **Zoom and Twilio.** Zoom's account:read:settings:admin scope (Owner) is for the SSPM scan to get SSPM settings, and account:update:settings:admin updates SSPM settings and is marked required for the scan and remediation. For Twilio the page lists a check that the Account Sid and Secret can fetch the account details. [zia.sspm.permissions:zoom-and-twilio]

**DLP scopes in the same tables.** The same tables list scopes whose stated purpose is DLP or message deletion rather than SSPM, for example Webex scopes marked as required for inline DLP, a ServiceNow scope used during DLP scanning, and a Zoom scope to delete user messages as part of the Delete Message policy action. [zia.sspm.permissions:tables-include-dlp-scopes] Whether the access granted exceeds what Data at Rest scanning needs is not answered by these tables [gap:zia.sspm.permissions:dlp-scopes-compared].

What to check:
1. Whether a scope is needed for the SSPM scan or only for remediation, taken from the application's own table row rather than from a rule across applications.

Not known (open gaps):
- Whether the access granted exceeds what Data at Rest scanning needs [gap:zia.sspm.permissions:dlp-scopes-compared]: settled by source-read or support-ticket

Area: zia.sspm, its subjects in references/_meta/spine/zia/zia.sspm.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sspm.md (SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.sspm.policies.md (The SSPM policy page: predefined policies, compliance types, risk levels and statuses)
- see-also references/_meta/text/zia/zia.casb.tenants.md (CASB tenants: connecting a SaaS application, states and reauthorization)
