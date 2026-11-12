# Managing DLP Azure integrations in Workflow Automation: statuses, delete, enable and disable, dashboard counts and defaults (zwa.azure-dlp-integration.management)
Also called: manage dlp azure integration; show deleted accounts; connected accounts azure

**Statuses.** The Zscaler DLP Azure Integration details page lists the integrations with their statuses Enabled, Disabled and Failed, and deleted integrations are shown by selecting Show Deleted Accounts. [zwa.azure-dlp-integration.management:status-values] The Configuration tab of the DLP Azure integration details page lists the integration accounts with the status of each account and the date each was last modified; the Configuration Steps tab has the configuration instructions, a link to download the bash script and links to download the resource manager template files. [zwa.azure-dlp-integration.management:configuration-tab-contents] The meaning of Failed is open [gap:zwa.azure-dlp-integration.management:failed-status].

**Changing an integration.** An integration with an Enabled status can be disabled and one with a Disabled status can be enabled, from the edit page with Disable Integration or Enable Integration. [zwa.azure-dlp-integration.management:enable-disable] Only DLP Azure connected accounts with a status of Enabled, Disabled or Failed can be deleted, and Delete Integration changes the status to Deleted; for an integration with a Deleted status only the data privacy field settings can be edited. [zwa.azure-dlp-integration.management:delete-rules]

**Dashboard.** In both the tile and list views the status oval on the Integrations dashboard shows the number of enabled accounts with the status Connected, and that number does not include accounts with a Failed or Deleted status. [zwa.azure-dlp-integration.management:dashboard-status-count] On the Integrations dashboard all integrations are displayed by default (the filter can be set to Connected only), and the dashboard is displayed in the tile view by default. [zwa.azure-dlp-integration.management:dashboard-defaults]

The integration object is in [The Azure DLP application integration for Workflow Automation: the two forwarding methods, required outputs, fields, validation and privacy settings](kb:zwa.azure-dlp-integration); the AWS equivalent is [Managing the AWS DLP integration in Workflow Automation: who can configure it, statuses, edit, delete and disable rules, and the Integrations dashboard](kb:zwa.aws-dlp-integration.management).

What to check:
1. The status of the integration before deleting it: only Enabled, Disabled or Failed accounts can be deleted.
2. Whether a missing integration is shown only under Show Deleted Accounts, and whether the dashboard count excludes Failed and Deleted accounts.

Not known (open gaps):
- What causes the Failed status of a DLP Azure integration, and how does an integration leave it? [gap:zwa.azure-dlp-integration.management:failed-status]: settled by lab-test or support-ticket

Area: zwa.azure-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.azure-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.management.md (Managing the AWS DLP integration in Workflow Automation: who can configure it, statuses, edit, delete and disable rules, and the Integrations dashboard)
- links-to references/_meta/text/zwa/zwa.azure-dlp-integration.md (The Azure DLP application integration for Workflow Automation: the two forwarding methods, required outputs, fields, validation and privacy settings)
