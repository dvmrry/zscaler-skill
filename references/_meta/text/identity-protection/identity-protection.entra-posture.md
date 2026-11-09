# Entra ID posture in Identity Protection: dashboard, issues, roadmap, reports and remediation (identity-protection.entra-posture)
Also called: entra id posture; entra id posture dashboard; entra id vulnerability report; entra id executive summary report; entra id delta report

The Entra ID Posture dashboard shows tenant risk severity (Critical, High, Medium or Low), the top 5 issues and the top 10 identities with the highest risks, and filters by tenant and timestamp. [identity-protection.entra-posture:dashboard-top-lists] An Entra ID tenant configured for a vulnerability scan is scanned at the scheduled time, and an on-demand scan can be triggered instead; deleting a scan report deletes all vulnerability results for that tenant. [identity-protection.entra-posture:dashboard-scan-actions]

**Issues.** Zscaler ITDR detects five risk types in an Entra ID tenant: Best Practice Violations, Hybrid Environment Risk, Insecure Privilege Management, Access Control Issues and Weak Authentication Measures. [identity-protection.entra-posture:risk-types] The vendor's Best Practice Violations examples are enabling security defaults, enforcing MFA, limiting guest user permissions, revoking deprecated user roles, and limiting the number of global administrators to less than 5. [identity-protection.entra-posture:best-practice-examples] An Entra ID issue's detail page shows a remediation assessment of Easy, Moderate or Difficult and MITRE ATT&CK tactics, and can start Entra ID remediation or add objects to the safelist. [identity-protection.entra-posture:issue-detail-fields] How a severity rating is assigned is not stated [gap:identity-protection.entra-posture:severity-rating-method].

**Top identities.** Clicking Top 10 Identities lists Identity and Principal ID, and Download Identities exports the issue details in Excel format. [identity-protection.entra-posture:top-identities-columns]

**Risk Reduction Roadmap.** The Entra ID Risk Reduction Roadmap uses a slider to view the current severity level and set a target severity level, and categorizes severity as Critical, High, Medium or Low. [identity-protection.entra-posture:risk-reduction-roadmap]

**Reports.** The Entra ID vulnerability report shows issues for identities, service principals and configuration settings, can be downloaded as an Excel report or raise a ServiceNow ticket, and is permanently deleted when the retention policy period expires. [identity-protection.entra-posture:scan-report] The Entra ID Executive Summary report downloads as a PDF; its Tenant Security Rating is Critical or High if a single critical or high issue is found, and Total Changes Detected covers the last 30 days. [identity-protection.entra-posture:executive-summary] The Entra ID delta report compares two historical scans, and its Excel version reports identity-level information and calls the first scan Scan B and the second Scan A. [identity-protection.entra-posture:delta-report]

**Remediation.** Entra ID remediation actions include Disable User and Revoke Session (bulk remediation supported), and Remove Active Role Assignment and Remove Group Membership (specific identity only). [identity-protection.entra-posture:remediation-actions] Revoke Session does not revoke guest user sessions. [identity-protection.entra-posture:revoke-session-guests] Enforce MFA creates a conditional access policy requiring MFA for all applications; Enforce phishing-resistant MFA uses FIDO2 keys or similar methods and can be run on global admin-level users only; for both actions, subsequent users are appended to the existing policy. [identity-protection.entra-posture:remediation-mfa-actions] Entra ID remediation history shows a Failure Reason column, and Download CSV returns the latest 5,000 results. [identity-protection.entra-posture:remediation-history]

What to check:
1. Whether a Revoke Session remediation applies to a guest user, since it does not revoke guest user sessions.
2. Whether Remove Active Role Assignment or Remove Group Membership is run for one identity, since neither supports bulk.

Not known (open gaps):
- How an Entra ID issue or tenant gets its Critical, High, Medium or Low rating [gap:identity-protection.entra-posture:severity-rating-method]: settled by source-read or support-ticket

Area: identity-protection.entra-posture, its subjects in references/_meta/spine/identity-protection/identity-protection.entra-posture.json
