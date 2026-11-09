# The Tenants page and tenant details drawer in the Identities menu: list columns, views, drawer tabs and which tenants are shown (identity-protection.tenants)
Also called: identities > tenants; tenant details drawer; identity protection tenants

The Tenants page (Identities > Tenants) lists tenant accounts and their identities with identity findings per tenant, and the page text says only tenants in an active state are displayed. [identity-protection.tenants:page-scope] Whether an Inactive tenant is ever shown differs between sentences [divergence:identity-protection.tenants:inactive-state]; what makes a tenant Inactive is open [gap:identity-protection.tenants:inactive-tenants]. The Tenants page shows the number of tenants grouped by severity level (for example Critical, High, Medium, Low), the total identity findings across all tenants, and the total active identity providers with identity findings. [identity-protection.tenants:page-summaries] The Tenants page supports system-saved and user-saved views, search, saved current view, filters, grouping (for example by Tenant First Seen, Tenant Last Seen, Tenant Tags), refresh, a CSV export of tenants and their details, and column changes. [identity-protection.tenants:page-actions]

**The list.** The tenant list shows ID, Name, Severity Score, Total Identity Findings (critical, high, medium and low), Sources (the source of the identity finding, for example ITDR Change Detection AD, ITDR Domains AD), Last Seen, State (Active or Inactive), Identity Provider (for example AD, Entra ID) and Next Scan. [identity-protection.tenants:list-columns] How Next Scan relates to the AD and Entra ID scan schedules is open [gap:identity-protection.tenants:scan-schedule].

**The details drawer.** The tenant details drawer's Details tab shows Tenant ID, Last Scan (date and time of the last scan for a data sync), Scan Frequency (for example Daily, Weekly), icons whose source is shown on hover, and the total of Critical, High, Medium and Low identity findings. [identity-protection.tenants:details-tab] The tenant drawer's Identity Findings tab lists findings with Severity (Critical and High are prioritized), Name, Type of Risk (for example Kerberos Abuse, Account Management, Credential Exposure), MITRE Tactics and MITRE Techniques, and can be exported to CSV. [identity-protection.tenants:findings-tab] The tenant drawer's Identities tab shows each identity's Name, Identity Type (User, Service Principal, or Special Identities), Is Admin (true if the user is an admin) and Type (Internal or External). [identity-protection.tenants:identities-tab] The tenant drawer's MITRE ATT&CK tab shows the tenant's identity findings categorized in MITRE ATT&CK tactics, with a Read more icon on hover that opens the MITRE tactics web page. [identity-protection.tenants:mitre-tab]

What to check:
1. Whether the tenant being asked about is Active, since the page text says only tenants in an active state are displayed.

Sources disagree (name both sides):
- The Tenants page says only tenants in an active state are displayed, while its State column is described as Active or Inactive. [divergence:identity-protection.tenants:inactive-state]
  - zscaler-help: Only tenants in an active state are displayed on the Tenants page.
  - zscaler-help: The State column is the state of the tenant's account (Active or Inactive).
  Impact: An answer saying whether an Inactive tenant appears in the list depends on which sentence is followed.

Not known (open gaps):
- What makes a tenant Inactive and whether an Inactive tenant is ever displayed [gap:identity-protection.tenants:inactive-tenants]: settled by lab-test
- How Scan Frequency and Next Scan relate to the AD and Entra ID scan schedules, and which values exist [gap:identity-protection.tenants:scan-schedule]: settled by source-read or lab-test

Area: identity-protection.tenants, its subjects in references/_meta/spine/identity-protection/identity-protection.tenants.json
