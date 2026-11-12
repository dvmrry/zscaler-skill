# Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release (zwa.settings)
Also called: zwa account settings; workflow automation account settings; digest notifications; notification reminders; user data obfuscation; primary user data source

User digest and DLP admin digest notifications are enabled or disabled by channel (email, Slack or Microsoft Teams); the Slack and Teams channels are available only if Workflow Automation is integrated with Slack and Microsoft Teams respectively. [zwa.settings:digest-channels] The settings around it are in [Workflow Automation custom email domains: the notification sender, DNS verification, statuses and the default domain](kb:zwa.settings.email-domains), [Workflow Automation access: roles and permissions, admin assignments, approvers and integration users](kb:zwa.settings.access), [Workflow Automation user attributes: SCIM and CSV data sources, the unique identifier and the CSV import](kb:zwa.settings.user-attributes), [Workflow Automation Downloads, bulk actions and Notification Center alerts: statuses, restarts and the alert list](kb:zwa.settings.activity-and-alerts) and [Workflow Automation API keys: the Key ID and secret, expiry, disabling, regenerating and deleting](kb:zwa.settings.api-keys).

**Justification link expiry.** The expiration period of the justification links on user and escalation notifications is set in days for the End User, Manager and Approver; if none is entered it is one day, the maximum is 30 days, and a larger value is changed to 30. [zwa.settings:expiry-end-user-notifications] For the user digest notification the justification link expiration period defaults to one day when none is entered, has a maximum of 30 days, and a larger value is changed to 30. [zwa.settings:expiry-user-digest] For the DLP admin digest notification the justification link expiration period defaults to one day when none is entered, has a maximum of 30 days, and a larger value is changed to 30. [zwa.settings:expiry-admin-digest] The notification pages state a 24-hour link validity [divergence:zwa.settings:link-expiry].

**Digests.** The user digest frequency is selected from Hourly, Daily and Weekly, and is daily if none is entered. [zwa.settings:digest-frequency-user] System default digest templates exist for users (Digest - Email, Digest - Slack, Digest - Teams) and for DLP admins (DLP Admin Digest - Email, Slack and Teams); admins can clone them or create custom ones, and the Slack and Teams templates exist only when Workflow Automation is integrated with Slack or Microsoft Teams. [zwa.settings:digest-templates] The system default user digest gives the number of all open incidents and of open high-priority incidents plus a justification link to an Incidents page; the system default DLP admin digest gives the number of all new incidents, all open incidents and state changes plus a justification link to the Incident page. [zwa.settings:digest-content] Admins with full access configure the DLP admin digest frequency and the incident priorities included for each admin. [zwa.settings:digest-admin-config] The default DLP admin digest frequency is not given [gap:zwa.settings:admin-digest-defaults]. The user digest frequency is described two ways [divergence:zwa.settings:user-digest-frequency]. The per-admin digest settings are in [Workflow Automation access: roles and permissions, admin assignments, approvers and integration users](kb:zwa.settings.access).

**Reminders.** Notification reminders can be enabled or disabled, with a frequency, separately for end users, managers and approvers. [zwa.settings:reminders-scope] For end user, manager and approver reminders the interval is a number from 1 to 99 and the frequency unit is Hours, Days or Weeks. [zwa.settings:reminders-interval-end-user] The Max Reminder Count, the maximum number of reminders sent, accepts 1 to 99 for each of the end user, the manager and the approver. [zwa.settings:reminders-max-count]

**Approver domains.** Enabling Restrict Approver Email Domains in Approvers Domain Management limits approver email addresses on the Approvers page to the trusted domains, and up to 10 trusted email domains can be added. [zwa.settings:approver-domains]

**User data source.** The primary user data source is SCIM or CSV; Workflow Automation then shows only the user attributes available in that source and does not populate a missing attribute; the SCIM option is available only if SCIM provisioning is enabled in the Zscaler Admin Console. [zwa.settings:primary-data-source] The unique identifier is either Email Address or Employee ID; if the selected one is unavailable in the primary user data source the other is used, and if neither is available the user information is fetched from the unselected user data source. [zwa.settings:unique-identifier] The Retrieve User Email from Primary Data Source setting, in the Incident Management section, makes Workflow Automation retrieve and display the incident user's email address on Incident Details from the primary user data source (SCIM or CSV attributes). [zwa.settings:retrieve-user-email]

**Obfuscation.** The attributes that can be obfuscated are User Name, User Email, Recipient Email, Manager Name, Client IP, Manager Email, Device Name, Phone Number and Trigger Data; selecting Recipient Email covers the External, Internal and Triggered Recipients attributes, Obfuscate All selects all of them, and by default none is selected. [zwa.settings:obfuscation-attributes] For obfuscated user attributes, admins cannot see the values on the Incidents, Incident Details and workflow pages, the values appear as asterisks, and they cannot be searched or filtered; the organization setting can be overridden for individual admins. [zwa.settings:obfuscation-effects]

**Email quarantine release.** Three Incident Management settings configure email quarantine release: Enable Email Quarantine for End User Notification, Mark Incident as False Positive for All Recipients, and Mark Incident as False Positive for One or More Recipients, which becomes available only after the all-recipients option is enabled. [zwa.settings:quarantine-settings] For incidents of Source DLP type Email, the Release Email Quarantine action on Incident Details can release the quarantined email to all its recipients or to only certain recipients, and users can do the same when responding to an end user or escalation notification; the end user notification and escalation notification pages say the Release Email to Recipients section is available only for Email incidents with a quarantine action and if the Enable Email Quarantine Release for End Users option is enabled. [zwa.settings:quarantine-release-recipients] The setting that gates release for escalation notifications is described two ways [divergence:zwa.settings:quarantine-setting-scope].

**Customer information.** The Customer Information section of Account Settings holds the Customer GUID and AWS environment information fields, which are required parameters of the CloudFormation stack created when the DLP application integration is configured in AWS. [zwa.settings:customer-information]

What to check:
1. Whether the digest channel the notification needs is enabled, since the Slack and Teams channels are available only with those integrations.
2. Which user data source is primary and which unique identifier is selected before looking for a missing user attribute.

Sources disagree (name both sides):
- Account Settings says the justification link expiration period is configurable up to 30 days, and the end user notification page says its link is only valid for 24 hours. [divergence:zwa.settings:link-expiry]
  - zscaler-help: The expiration period is configured in days, with a one-day default and a 30-day maximum.
  - zscaler-help: The link is only valid for 24 hours.
  Impact: The pages do not say whether the 24-hour statement is the one-day default or a different link from the configurable justification link.
- Account Settings says the user digest frequency is Hourly, Daily or Weekly, and the user digest page says the digest is sent daily. [divergence:zwa.settings:user-digest-frequency]
  - zscaler-help: The frequency is Hourly, Daily or Weekly, with daily as the default.
  - zscaler-help: The user digest is sent daily.
  Impact: The user digest page does not say whether daily is the default or the only frequency.
- Account Settings describes Enable Email Quarantine for End User Notification as covering release through an end user notification, and the escalation notification page makes release in an escalation notification depend on Enable Email Quarantine Release for End Users. [divergence:zwa.settings:quarantine-setting-scope]
  - zscaler-help: The setting enables release through an end user notification.
  - zscaler-help: The Release Email to Recipients section of an escalation notification requires the Enable Email Quarantine Release for End Users option.
  Impact: The pages name the setting differently and do not say whether it also gates release from escalation notifications, or whether the two names are one setting.

Not known (open gaps):
- What the default DLP admin digest frequency is [gap:zwa.settings:admin-digest-defaults]: settled by source-read or lab-test

Area: zwa.settings, its subjects in references/_meta/spine/zwa/zwa.settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.settings.access.md (Workflow Automation access: roles and permissions, admin assignments, approvers and integration users)
- links-to references/_meta/text/zwa/zwa.settings.activity-and-alerts.md (Workflow Automation Downloads, bulk actions and Notification Center alerts: statuses, restarts and the alert list)
- links-to references/_meta/text/zwa/zwa.settings.api-keys.md (Workflow Automation API keys: the Key ID and secret, expiry, disabling, regenerating and deleting)
- links-to references/_meta/text/zwa/zwa.settings.email-domains.md (Workflow Automation custom email domains: the notification sender, DNS verification, statuses and the default domain)
- links-to references/_meta/text/zwa/zwa.settings.user-attributes.md (Workflow Automation user attributes: SCIM and CSV data sources, the unique identifier and the CSV import)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
- see-also references/_meta/text/zwa/zwa.workflows.md (Workflow Automation workflows: the nine templates, custom workflows, mappings and what the API does not cover)
