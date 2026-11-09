# The SSPM policy page: predefined policies, compliance types, risk levels and statuses (zia.sspm.policies)
Also called: sspm policies; SaaS Security Posture Report; policy details drawer

The SSPM policies are included in the SaaS Security Posture Report, which evaluates the enabled policies against the organization's security posture. By default all policies are enabled; any supported policy can be disabled or re-enabled, and disabled policies are not evaluated in the subsequent scans. [zia.sspm.policies:report-and-defaults] The SaaS Security Posture Management page lists all predefined policies for the chosen SaaS application and tenant, and the list can be filtered by Compliance Check, Risk Level and Status. [zia.sspm.policies:page-scope-and-filters] The Policy Details drawer shows the policy name, resource type, risk level, description, the potential threat if the policy is not implemented, policy status and applicable compliance. After disabling or re-enabling the status, Save and activate the change. [zia.sspm.policies:policy-details]

**Risk levels and statuses.** A policy's risk level is High, Medium or Low. [zia.sspm.policies:risk-levels] If a policy is enabled, SSPM evaluates it for the selected application and tenant and shows its current status as Pass, Fail or Partial on the SaaS Security Reports page. If it is disabled, SSPM does not evaluate it and shows the Disabled status. By default all policies are enabled. [zia.sspm.policies:statuses] The report page's filter names the same statuses as Passed, Failed, Partial and Disabled: [zia.sspm.policies:report-filters].

**Compliance types.** The SSPM policies support FFIEC, GDPR, HIPAA, PCI DSS v3.2, ISO 27001:2013, SOC2 AICPA TSC 2017, NIST 800-53 Rev.5, CIS Microsoft 365 v1.4, CIS Microsoft 365 v3.0 and CIS Google Workspace V1.0.0 compliance types, based on the selected tenant. [zia.sspm.policies:compliance-types]

**The Posture Management Report page.** The Posture Management Report can be filtered by Policy Status (All, Passed, Failed, Partial or Disabled) and Risk Level (All, High, Low or Medium); the Compliance widget lists all the compliances whichever compliance filter is chosen, as policies can apply to multiple compliances, and the risk pie chart does not show risk levels of disabled policies. [zia.sspm.policies:report-filters] Partial means not all the assets scanned against the policy have posture control configured correctly (for example, MFA enabled for only a subset of 100 users); Pending appears in the Policy Status column until the first posture scan is complete after onboarding for SaaS Security Posture Control, and can appear whenever a scan is in progress. [zia.sspm.policies:report-statuses] The report can be downloaded to a PDF file and the Policies table exported to an Excel file showing the data as filtered. A policy can be enabled or disabled for SSPM analysis at the tenant level, Exclude removes an asset from the SSPM report analysis with logs populated when exclude or do not exclude actions are performed, and the entire API response can be copied or downloaded as a JSON file. [zia.sspm.policies:report-exports]

**Applications.** The SSPM policy page says SSPM can be configured while onboarding tenants for Bitbucket, Confluence, GitHub, Google Workspace, Jira, Microsoft 365, Okta, Salesforce and ServiceNow. [zia.sspm.policies:onboarding-apps] The other pages list the applications differently, see [SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM](kb:zia.sspm). How often the later scans run is open [gap:zia.sspm.policies:scan-cadence].

What to check:
1. Whether a policy that is not Pass is Disabled rather than failing, since a disabled policy is not evaluated.

Not known (open gaps):
- How often SSPM re-evaluates policies [gap:zia.sspm.policies:scan-cadence]: settled by support-ticket or tenant-data

Area: zia.sspm, its subjects in references/_meta/spine/zia/zia.sspm.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sspm.md (SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM)
