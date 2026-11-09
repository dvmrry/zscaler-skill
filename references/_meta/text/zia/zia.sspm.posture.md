# Advanced SSPM Posture, Control Panel and Compliance pages: control and asset statuses, severity, complexity (zia.sspm.posture)
Also called: posture page; control panel; failed controls remediation; control severity; posture drift; drift over time; compliance page

The Posture page shows the current state of the organization's security posture for SaaS applications and how it drifts from Zscaler best practices and industry standards such as GDPR and PCI. Controls can be filtered by tenant and by label, and the controls report exported to CSV. [zia.sspm.posture:posture-page] When one or more tenants are onboarded for Advanced SSPM, a message displays that the tenants are still being processed. [zia.sspm.posture:processing-message] The Failed Controls Remediation graph displays the severity and implementation complexity of failed controls. Implementation complexity is the amount of work required to fix or improve a control to address identified issues or vulnerabilities. [zia.sspm.posture:failed-controls-graph] The Drift over time widget does not appear when the screen width is under 1,750 pixels with the Posture Drift drawer displayed, or under 1,550 pixels with the drawer hidden. [zia.sspm.posture:drift-widget-width]

**Control statuses.** The Posture page's control statuses are Pass (correctly configured), Fail (incorrectly configured), Partial (not all scanned assets configured correctly), Disabled (excluded from scans) and Pending (not yet evaluated due to missing permissions, connector issues, rate limits and the like). All controls are enabled by default. [zia.sspm.posture:control-statuses] Whether a Pending control is shown on the Posture page is stated both ways [divergence:zia.sspm.posture:pending-visibility]. Which limits count as rate limits is open [gap:zia.sspm.posture:pending-causes].

**Severity and complexity.** Control severity is determined from the MITRE technique severity score, whose calculation considers the actual prevalence and risk level of associated CVEs. A defined control severity overrides future system recalculations, the default can be reverted, and the update is recorded on the Audit Log tab. [zia.sspm.posture:severity] The severity levels are not listed on these pages [gap:zia.sspm.posture:severity-values]. A control's Complexity is the ease of implementation and the effort to deploy and configure it, and hovering over it shows a breakdown by categories such as Monitoring and Maintenance, Technical Effort, User Impact, and Documentation and Training. Failed Assets is the number of assets that failed to comply with the policy against the total number of scanned assets. [zia.sspm.posture:complexity-and-failed-assets]

**The control panel and assets.** A control's panel describes the impact on the user's experience after remediation, the MITRE ATT&CK tactic and techniques, a link to remediation steps in the application's help documentation and the compliance control number within the framework. Its Audit Log tab shows all changes made to the control, and adding notes needs user or admin permissions under the 3rd-Party App Governance roles. [zia.sspm.posture:control-panel-tabs] An asset's status is Fail, Partial, Pass or Disabled; the page's example of Partial is a GitHub repository with some misconfigured branches. Controls are evaluated per individual asset or on global configuration depending on what the SaaS platform supports, and no assets are displayed for a global configuration. Asset evidence can be copied or downloaded as a JSON file, and the assets report exported to CSV. [zia.sspm.posture:asset-statuses]

**Compliance.** The Compliance page maps controls to compliance frameworks and helps verify whether they are enforced according to the security checks. Each framework expands to its platforms and the number of failed controls for each, and a framework's status is Failed, Partial or Success. [zia.sspm.posture:compliance-page] The subscription it needs is in [SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM](kb:zia.sspm).

What to check:
1. Whether a Pending control should be on the Posture page, since the vendor's two pages disagree.

Sources disagree (name both sides):
- The About Posture page lists Pending as a control status, while the About the Control Panel page says a policy with pending status is not displayed on the Posture page. [divergence:zia.sspm.posture:pending-visibility]
  - zscaler-help: Pending is one of the statuses a control has on the Posture page.
  - zscaler-help: A policy whose status is pending is not displayed on the Posture page.
  Impact: Whether a control that has not been evaluated appears on the Posture page, as Pending or not at all, differs by page; an answer about why a control is missing cannot rest on either.

Not known (open gaps):
- The rate limits behind a Pending control [gap:zia.sspm.posture:pending-causes]: settled by support-ticket or tenant-data
- The control severity levels on the Advanced SSPM Posture pages [gap:zia.sspm.posture:severity-values]: settled by source-read or tenant-data

Area: zia.sspm, its subjects in references/_meta/spine/zia/zia.sspm.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sspm.md (SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM)
