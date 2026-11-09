# Workflow Automation Downloads, bulk actions and Notification Center alerts: statuses, restarts and the alert list (zwa.settings.activity-and-alerts)
Also called: zwa downloads; zwa bulk actions; notification center alerts; incident export csv

Incidents exported from the Incidents page become a CSV file on the Downloads page that is available for up to 7 days; only a file with status Complete can be downloaded, and an email notifies when the download is completed, suspended, partially completed or failed. [zwa.settings.activity-and-alerts:downloads-availability] The wider settings are in [Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release](kb:zwa.settings) and the incident actions are in [Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting](kb:zwa.incidents).

**Downloads.** A download has status Complete, Partially Complete, Suspended or Failed, and Workflow Automation automatically resumes a Suspended download when the technical issue is resolved. [zwa.settings.activity-and-alerts:downloads-statuses] A partially complete download can be resumed and a failed one retried, at most three times, after which the export must be performed again on the Incidents page. [zwa.settings.activity-and-alerts:downloads-restart]

**Bulk actions.** The bulk actions are Assign DLP Admin, Assign to Me, Close incidents, Add Labels and Update Incident Group; DLP admins with full access can perform them for all incidents on the Incidents page, and an email notifies when a bulk action is complete, suspended, partially complete or failed. [zwa.settings.activity-and-alerts:bulk-actions-list] A bulk action has status Complete, Partially Complete, Suspended or Failed, and a Suspended bulk action is automatically resumed by Workflow Automation after the technical issue is resolved. [zwa.settings.activity-and-alerts:bulk-actions-statuses] A partially complete bulk action can be resumed and a failed one retried, at most three times, after which the bulk action must be performed again on the Incidents page. [zwa.settings.activity-and-alerts:bulk-actions-restart]

**Notification Center.** The Notification Center alert table has these rows, each with severity High: Filewatcher issues, a default incident group with no admin, Incident Receiver issues, an integration not working, and no active channel for user digest or for admin digest notifications. [zwa.settings.activity-and-alerts:notification-center-alerts] Each Notification Center alert shows a unique generated sequential ID, the module (such as Filewatcher, Integration, Notification, Incident Receiver or Incident Group), severity, summary, and the First Detected and Last Detected times. [zwa.settings.activity-and-alerts:notification-center-fields] The causes behind those alerts are not given [gap:zwa.settings.activity-and-alerts:alert-causes].

What to check:
1. Which status the download or bulk action shows, since only a Complete download can be downloaded.

Not known (open gaps):
- What causes the Notification Center alerts and how to clear them [gap:zwa.settings.activity-and-alerts:alert-causes]: settled by source-read or lab-test

Area: zwa.settings, its subjects in references/_meta/spine/zwa/zwa.settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
- links-to references/_meta/text/zwa/zwa.settings.md (Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release)
