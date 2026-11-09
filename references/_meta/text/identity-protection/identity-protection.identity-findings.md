# The Identity Findings page and finding details drawer in the Identities menu: list columns, widgets, drawer tabs, remediation and safelisting (identity-protection.identity-findings)
Also called: identity findings; identities > identity findings; identity finding details drawer; affected identities tab; affected tenants tab

Identity Findings show identity-related security issues detected across connected identity providers and directories, which security teams can review and prioritize by severity. [identity-protection.identity-findings:purpose]

**The list.** The Identity Findings page (Identities > Identity Findings) has summary widgets, including Identity Findings Severity Over Time, a trend across Critical, High, Medium or Low, and Identity Findings Severity, the distribution by those levels. [identity-protection.identity-findings:list-widgets] The identity findings list shows, for each finding, ID, Severity Score, Title, Tenant, Affected Entities, Vulnerability Exploit Ease, Techniques, Last Seen and Vulnerability Remediate Ease. [identity-protection.identity-findings:list-columns] The Identity Findings page can filter findings (for example by Title, Tenant Name and MITRE ATT&CK ID), group them (for example by Identity Finding ID, First Seen and Last Seen), export the list as a CSV file and include or exclude columns. [identity-protection.identity-findings:list-actions]

**The details drawer.** Each identity finding includes contextual information such as the risk description, severity, affected tenants, MITRE ATT&CK mapping and recommended remediation steps, and its details open in a drawer when a finding is clicked on the Identity Findings page. [identity-protection.identity-findings:detail-contents] The Details tab of the finding drawer typically includes Identity Finding, Last Seen, Tactics, Type of Risk, Techniques, Vulnerability Exploit Ease, Sub Techniques, Vulnerability Remediate Ease and Sources (the identity systems where the risk was detected, for example Active Directory or Entra ID). [identity-protection.identity-findings:detail-fields] The finding drawer's Affected Identities tab lists all identities impacted by the finding, and its Affected Tenants tab lists all tenants or identity environments impacted by it; the page gives both tabs the same sentence about applying filters, downloading the list of tenants as a CSV file and customizing columns. [identity-protection.identity-findings:affected-tabs]

**Remediation.** The Remediation tab gives recommended steps to resolve the finding; depending on the environment and configuration the guidance can include actions or a remediation workflow, and for each action the page says detailed information such as videos and scripts is available. [identity-protection.identity-findings:remediation-tab] The remediation workflow's possible actions include evaluating whether the configuration is required, implementing alternative security controls, removing insecure configurations, or applying appropriate mitigations. [identity-protection.identity-findings:remediation-workflow-actions] If a finding's configuration cannot be changed immediately, admins can choose to safelist the finding after evaluating the associated risk. [identity-protection.identity-findings:safelist-from-remediation] Where a finding is safelisted is open [gap:identity-protection.identity-findings:safelist-location]. [How the AD and Entra ID issue, object and change detection safelists work](kb:identity-protection.safelists)

**Open questions.** How these findings relate to the ITDR Admin Portal's own pages is open [gap:identity-protection.identity-findings:admin-portal-relation]. How a severity score maps to a level, and what the exploit and remediate ease ratings mean, is open [gap:identity-protection.identity-findings:severity-and-ease]. What the Affected Identities tab exports is open [gap:identity-protection.identity-findings:affected-identities-export].

What to check:
1. Which tab of the finding drawer holds the remediation guidance, and whether the page says it can include a workflow.
2. Which columns the Identity Findings list shows before reading a finding's severity, exploit ease or remediate ease.

Not known (open gaps):
- How the Identities menu findings relate to the ITDR Admin Portal pages [gap:identity-protection.identity-findings:admin-portal-relation]: settled by source-read or lab-test
- What score ranges give each severity level and what the exploit and remediate ease ratings mean [gap:identity-protection.identity-findings:severity-and-ease]: settled by source-read
- Whether the Affected Identities tab can export identities [gap:identity-protection.identity-findings:affected-identities-export]: settled by lab-test
- Where an identity finding is safelisted [gap:identity-protection.identity-findings:safelist-location]: settled by source-read or lab-test

Area: identity-protection.identity-findings, its subjects in references/_meta/spine/identity-protection/identity-protection.identity-findings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/identity-protection/identity-protection.safelists.md (How the AD and Entra ID issue, object and change detection safelists work)
