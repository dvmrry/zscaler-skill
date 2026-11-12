# The Users page and the user details drawer in the admin portal (unified.secops-platform.console.users)
Also called: secops platform Users page; user details drawer

**Users page.** The Users page (Agentic SOC > Users, Identities > Users or AEM > Users) lists only active users, aggregated from different sources, and exports the list to CSV. [unified.secops-platform.console.users:users-page] User list columns include Is Admin, Total Identity Findings (critical, high, medium and low), Sources (for example Active Directory, Microsoft Entra ID), Identity Type (User, Service Principal or Special Identities), State (Active or Inactive) and Type (Internal or External). [unified.secops-platform.console.users:users-columns] The active-only listing and the State column are unreconciled [gap:unified.secops-platform.console.users:users-state-column]. The page's filter wording is unclear [gap:unified.secops-platform.console.users:users-filter-wording].

**User details drawer.** The user details drawer has Details, Identity Findings, Alerts, Tenants and Groups tabs, and the Identity Findings, Alerts, Tenants and Groups tabs each have an Export as CSV icon. [unified.secops-platform.console.users:user-drawer-tabs] In the Identity Findings tab, severity is Critical, High, Medium or Low with Critical and High listed first, and Type of Risk gives categories such as Kerberos Abuse, Account Management and Credential Exposure. [unified.secops-platform.console.users:user-drawer-findings] In the Alerts tab, the severity score ranges from 0 to 10 (higher is more critical), and the Alert Verdict takes values such as Accepted, Executed, Partial, Proposed, Scheduled, Success, under Review or Recommendation Status Unspecified. [unified.secops-platform.console.users:user-drawer-alerts] The verdict values differ from the Agentic SOC Alerts page [divergence:unified.secops-platform.console.users:alert-verdict-values]. The Tenants tab shows Tenant Severity (Critical, High, Medium or Low), total identity findings and total alerts; the Groups tab shows the Group Key (a unique identifier for the group associated with a user) and when the group was last updated. [unified.secops-platform.console.users:user-drawer-tenants-groups] The Details tab lists two Name fields [gap:unified.secops-platform.console.users:details-name-fields].

Sources disagree (name both sides):
- The user details drawer lists Alert Verdict values Accepted, Executed, Partial, Proposed, Scheduled, Success, under Review and Recommendation Status Unspecified, while the Agentic SOC Alerts page gives Malicious, Suspicious and Benign as example verdicts; the drawer opens from Agentic SOC > Users as well. [divergence:unified.secops-platform.console.users:alert-verdict-values]
  - zscaler-help: Alert Verdict takes recommendation-status values such as Accepted, Executed and Success.
  - zscaler-help: An alert's verdict is, for example, Malicious, Suspicious or Benign.
  Impact: Which verdict values an analyst sees in the user drawer's Alerts tab, versus the Alerts page, is unclear; the Accepted/Executed list may be a copy of recommendation statuses.

Not known (open gaps):
- Why a State column (Active or Inactive) exists if only active users are listed [gap:unified.secops-platform.console.users:users-state-column]: settled by lab-test or source-read
- What the Users page filter line covers [gap:unified.secops-platform.console.users:users-filter-wording]: settled by lab-test or source-read
- What the two Name fields on the user details drawer's Details tab hold [gap:unified.secops-platform.console.users:details-name-fields]: settled by lab-test or source-read

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/unified/unified.secops-platform.console.md (The Agentic SecOps Platform admin portal: supported browsers, egress IPs, status board, account settings, failure emails, AI capabilities and audit logs)
- see-also references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
