# Managing the AWS DLP integration in Workflow Automation: who can configure it, statuses, edit, delete and disable rules, and the Integrations dashboard (zwa.aws-dlp-integration.management)
Also called: manage dlp aws integration; integration status enabled disabled failed deleted; delete aws dlp integration; disable aws dlp integration; integrations dashboard workflow automation; connected accounts aws dlp

Super admins, or admins with Full or Restricted access to Workflow Automation, can configure the DLP application integration. [zwa.aws-dlp-integration.management:who-configures] For a tenant using the AWS integration, the DLP AWS application integration must be configured before DLP incidents are available for review and remediation on the Incidents page. [zwa.aws-dlp-integration.management:required-for-incidents]

**Statuses.** On the Zscaler DLP Integration details page, the Connected Accounts section shows each integration's status as Enabled, Disabled or Failed; deleted integrations appear when Show Deleted Accounts is selected at the top right of that section. [zwa.aws-dlp-integration.management:statuses] The Configuration tab lists the DLP AWS application integration accounts with each account's status and the date it was last modified. [zwa.aws-dlp-integration.management:configuration-tab]

**Changing an integration.** When editing, all displayed fields can be edited except IAM-Cross-Account Role External ID; for integrations with a Deleted status only the data privacy field settings can be edited. [zwa.aws-dlp-integration.management:edit-rules] Editing an integration also requires Validate to pass, and after a validation failure the admin must disable and re-enable the integration once the values are corrected. [zwa.aws-dlp-integration.management:validate-on-edit] Disable Integration applies to a connected account with an Enabled status and Enable Integration to one with a Disabled status, and the status changes accordingly. [zwa.aws-dlp-integration.management:disable-enable] Only connected accounts with a status of Enabled, Disabled or Failed can be deleted; Delete Integration changes the status to Deleted. [zwa.aws-dlp-integration.management:delete-rules]

**Dashboard.** The Integrations dashboard displays all integrations by default (Connected filters to connected ones) and defaults to the tile view; the Connected status count excludes accounts with a Failed or Deleted status in both the tile and list views. [zwa.aws-dlp-integration.management:dashboard-view] What Failed means is open [gap:zwa.aws-dlp-integration.management:failed-status-meaning]. The settings edited here are in [The Hide privacy checkboxes on the AWS DLP integration: per-role defaults for admins, end users and managers or approvers, and their dependencies](kb:zwa.aws-dlp-integration.privacy-settings), and the integration is described in [The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation](kb:zwa.aws-dlp-integration).

What to check:
1. Whether the integration's status is Enabled, Disabled, Failed or Deleted before changing it, since only some statuses can be deleted and a Deleted integration allows only privacy field edits.
2. Whether the admin has Full or Restricted Workflow Automation access, or is a super admin.

Not known (open gaps):
- What does the Failed status mean and what causes it? [gap:zwa.aws-dlp-integration.management:failed-status-meaning]: settled by lab-test or support-ticket

Area: zwa.aws-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.aws-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.md (The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation)
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.privacy-settings.md (The Hide privacy checkboxes on the AWS DLP integration: per-role defaults for admins, end users and managers or approvers, and their dependencies)
