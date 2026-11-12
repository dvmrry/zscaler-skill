# ZCC end-user support options (App Supportability) (zcc.support-options)
Also called: zcc support options; client connector support; app supportability; report an issue; enable support access; end user ticket submission to zscaler; client connector app logs; zcc self-service; prevent users disabling zcc; supportEnabled; supportTicketEnabled; disableLoggingControls
Former IDs: zcc-34, zcc-36, zcc-37, zcc-38, zcc-65, zcc-91

The App Supportability settings decide what users can do for themselves when Client Connector misbehaves, and what an admin can collect without them. Most of the mechanics live in the logging, password and app profile subjects linked below.

The App Supportability page (Infrastructure > Advanced Settings > App Supportability) configures user access to logging controls, to support options and to the restart and repair options; Client Connector Telemetry; automatic username population for IdP authentication; automatic ZPA reauthentication; and registering devices with the ZPA IdP username. [zcc.support-options:page-settings]

## Report an Issue

Users reach the support options by clicking Report an Issue in Client Connector's More window or from its system tray icon. [zcc.support-options:entry-points] Support requests go either to the organization's support admin only, or to both the support admin and Zscaler Support. [zcc.support-options:routing] Admin Email Address to Send Logs and Enable End User Ticket Submission to Zscaler both apply only when support access is enabled. [zcc.support-options:requires-support-access] The Report an Issue option appears in the app user interface only if the IT admin has enabled it in the Client Connector support configuration. On submitting the form, depending on the organization's setup, the app might send an email to the organization's support admin or submit a ticket directly to Zscaler Support, of which the support admin receives a copy, and the user receives an email acknowledging the support request. [zcc.support-options:report-an-issue-visibility] What the form sends and who can read the logs: [A Report an Issue form sends the form data with encrypted logs attached by email to the organization's support admin and anyone in the CC field, and can also open a ticket with Zscaler Support carrying the same encrypted logs.](kb:zcc.logging.collection:report-an-issue), [Enable Support Access in Zscaler Client Connector gives users the Report an Issue form; with support access enabled, Admin Email Address to Send Logs takes one or more comma-separated addresses, and Enable End User Ticket Submission to Zscaler also sends a ticket to Zscaler Support automatically when the user chooses Report an Issue.](kb:zcc.logging.collection:support-settings), [Only Zscaler can decrypt the encrypted logs.](kb:zcc.logging.collection:only-zscaler-decrypts).

What the log bundle contains is open [gap:zcc.support-options:bundle-contents]. Whether user submissions leave an audit trail is open [gap:zcc.support-options:submission-audit]; what the console audit log records for admins is in [Client Connector audit logs in the Admin Console: what is recorded, retention, columns, actions, categories and filters](kb:zcc.audit-logs).

## Logs and log controls

The App Supportability overview says users given access to logging controls can export logs as a text file, clear logs and change the logging mode, and that a support request can go only to the organization's support admin or also directly to Zscaler Support. [zcc.support-options:user-log-controls] The overview words the export as a text file, against a ZIP file elsewhere [zcc.end-user:export-logs-format](kb:zcc.end-user:export-logs-format). The App Supportability option Client Connector App Logs is what allows collecting Client Connector logs per enrolled device, through Fetch Logs on the device's details. [zcc.support-options:app-logs-option] The fetch itself: [An admin can pull logs from an enrolled device with Fetch Logs or Fetch Lightweight Logs on its device details, once Client Connector App Logs is enabled and an email address is configured on the App Supportability tab.](kb:zcc.logging.collection:fetch-prereq), [Fetch Logs applies to all OSs and all supported versions, covers the previous 14 days and includes PCAP and crash files; Fetch Lightweight Logs is for Windows 4.7 and later, covers the previous 24 hours and includes crash files but no PCAP files.](kb:zcc.logging.collection:fetch-scope). Hide Logging Control and what users can do with logs: [Hide Logging Control on Zscaler Client Connector prevents users from exporting or clearing logs and from changing the log mode the admin set in app profiles; disabling it allows users to send an email copy of the data entered on the Report an Issue form along with encrypted logs.](kb:zcc.logging.user-access:hidden-blocks), [From Client Connector 2.1.2 for Windows and macOS, exported logs are not encrypted, while logs attached to the Report an Issue form are; before 2.1.2, exported logs are always encrypted and users cannot read them.](kb:zcc.logging.user-access:export-encryption).

## Telemetry

Client Connector Telemetry gets telemetry and device event information from devices, collecting a subset of the information Digital Experience (ZDX) already collects; it also enables device event collection, which provides reporting such as the Device Events page and the Failed Posture Devices page. [zcc.support-options:telemetry] Enabling or disabling Client Connector Telemetry for all users is a tenant setting whose default value is enabled. When enabled, the Telemetry option on all existing and new app profiles for Windows, macOS, Android and Linux is enabled and can be disabled per profile; when disabled, the option on all existing app profiles is also disabled and cannot be enabled. [zcc.support-options:telemetry-tenant-switch] On the app profile, the Telemetry settings are available only on Client Connector 4.6 and later for Windows and 4.5.1 and later for macOS and are disabled if the tenant-wide option is disabled; the profile's Zscaler Client Connector Telemetry collects metrics including device events, statistics, profile, statistics for Client Connector processes and the top 5 processes, which the page says include no personally identifiable information, and its default value is enabled. [zcc.support-options:telemetry-app-profile] What it collects beyond the app profile's metric list, and whether the tenant switch reaches iOS profiles, are not stated [gap:zcc.support-options:telemetry-scope].

## Restart, repair, disable

Restart Service and Repair App: [Restart Service and Repair App for end users](kb:zcc.support-options.restart-and-repair). Passwords on logout, disable, exit and uninstall: [ZCC uninstall, disable and logout passwords and one-time passwords](kb:zcc.passwords-and-otp). Anti-tampering and its OTP reactivation timer: [In the Windows app profile, anti-tampering prevents end users from stopping and modifying Zscaler endpoint products. If a user disables it with a one-time password, Reactivate Anti-Tampering After (In Mins), 1 to 1440 minutes, re-enables it after that time; the default 0 leaves it to the user to re-enable, or to Client Connector when the app exits and relaunches. The page marks these settings as applying to Client Connector 4.1 and later for Windows. On Windows 4.5 and later, Override Anti-tampering Install Parameter applies the profile's setting regardless of the install-time option.](kb:zcc.app-profiles.advanced-settings:anti-tampering); the install parameter: [On Windows, enableAntiTampering (MSI `ENABLEANTITAMPERING`) prevents end users from stopping, modifying or deleting Zscaler products and services; the app profile's Override Anti Tampering Install Parameter option can override it.](kb:zcc.install.precedence:anti-tampering). Users' reasons for disabling a service: [Send Disable Service Reason, off by default, lets users describe why they disabled a service; the reason shows in device details, and the API exports disable reasons as a CSV report.](kb:zcc.app-profiles.advanced-settings:send-disable-reason), exported as in [Device CSV exports: inventory, service status and disable reasons](kb:zcc.devices.exports).

Whether a per-service disable password gates only its own service is open [gap:zcc.support-options:per-service-independence]. Whether anti-tampering constrains Citrix VDI deployments is open [gap:zcc.support-options:anti-tampering-vdi].

## Sign-in settings and the command line

IdP username autofill, automatic Private Access reauthentication and registering devices with the ZPA IdP username: [App Supportability sign-in settings: IdP username autofill, automatic Private Access reauthentication and registering devices with the ZPA IdP username](kb:zcc.support-options.authentication). The command line (ZSACli and zscli): [Client Connector's command line: ZSACli on Windows and zscli on macOS, enabling it, disable passwords, commands and rate limits](kb:zcc.support-options.cli).

## API

By name, the company-info fields `supportEnabled`, `supportAdminEmail`, `supportTicketEnabled`, `disableLoggingControls` and `fetchLogsForAdminsEnabled` hold Enable Support Access, Admin Email Address to Send Logs, Enable End User Ticket Submission to Zscaler, Hide Logging Control and Client Connector App Logs. [zcc.support-options:field-ui-mapping] The read, the Go-only write and the field encodings: [ZCC company info and password management calls: who may read, and which clients can write](kb:zcc.api.company-wire). What a new tenant starts with is open [gap:zcc.support-options:toggle-defaults], and so is when a change reaches enrolled devices [gap:zcc.support-options:tenant-setting-propagation].

Telemetry collection and non-admin access to local log files are User Privacy settings: [What each User Privacy setting collects or allows](kb:zcc.web-privacy.collection).

What to check:
1. Whether support access is enabled, since the admin email and the Zscaler ticket option apply only with it.
2. Whether Client Connector App Logs is enabled before expecting Fetch Logs to work on a device.
3. When reading these settings through the API, which company-info field holds which toggle, and that the Go type holds them as integers.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.support-options:field-ui-mapping] Tier B: Matched by name between the company-info fields and the App Supportability options; no source states the mapping.

Not known (open gaps):
- What Telemetry collects beyond the app profile's metric list, and whether the tenant switch reaches iOS profiles [gap:zcc.support-options:telemetry-scope]: settled by lab-test or source-read
- What the Report an Issue log bundle contains [gap:zcc.support-options:bundle-contents]: settled by support-ticket or lab-test. Blocks: privacy and data-residency reviews of sending bundles to Zscaler Support
- Whether Report an Issue submissions and user log exports are auditable [gap:zcc.support-options:submission-audit]: settled by support-ticket. Blocks: investigations that need to know when a user submitted or exported logs
- The App Supportability settings' values on a new tenant [gap:zcc.support-options:toggle-defaults]: settled by tenant-data. Blocks: telling a tenant's deliberate choice from an untouched default in posture or hygiene reviews
- When App Supportability changes reach enrolled devices [gap:zcc.support-options:tenant-setting-propagation]: settled by lab-test. Blocks: telling an admin when a support setting change takes effect on devices
- Whether per-service disable passwords gate only their own service [gap:zcc.support-options:per-service-independence]: settled by lab-test. Blocks: predicting which user actions a partial password set still allows
- Whether anti-tampering interacts with Citrix VDI settings [gap:zcc.support-options:anti-tampering-vdi]: settled by lab-test or support-ticket. Blocks: VDI rollouts that enable anti-tampering

Area: zcc.support-options, its subjects in references/_meta/spine/zcc/zcc.support-options.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zcc/zcc.api.company-wire.md (ZCC company info and password management calls: who may read, and which clients can write)
- links-to references/_meta/text/zcc/zcc.audit-logs.md (Client Connector audit logs in the Admin Console: what is recorded, retention, columns, actions, categories and filters)
- links-to references/_meta/text/zcc/zcc.devices.exports.md (Device CSV exports: inventory, service status and disable reasons)
- links-to references/_meta/text/zcc/zcc.end-user.md (The Client Connector app as users see it: Classic UI and Modern UI menus, status, enrollment and notifications, by OS where the pages cover it)
- links-to references/_meta/text/zcc/zcc.install.precedence.md (Install parameters versus console settings: which wins, and what survives an update)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.md (ZCC uninstall, disable and logout passwords and one-time passwords)
- links-to references/_meta/text/zcc/zcc.support-options.authentication.md (App Supportability sign-in settings: IdP username autofill, automatic Private Access reauthentication and registering devices with the ZPA IdP username)
- links-to references/_meta/text/zcc/zcc.support-options.cli.md (Client Connector's command line: ZSACli on Windows and zscli on macOS, enabling it, disable passwords, commands and rate limits)
- links-to references/_meta/text/zcc/zcc.support-options.restart-and-repair.md (Restart Service and Repair App for end users)
- links-to references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zcc/company-info.md (config type)
- see-also references/_meta/text/zcc/zcc.web-privacy.md (ZCC user privacy (web privacy): what the app collects and exposes)
