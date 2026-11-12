# ZCC user privacy (web privacy): what the app collects and exposes (zcc.web-privacy)
Also called: web privacy; WebPrivacy; zcc user privacy; user privacy page; getWebPrivacyInfo; setWebPrivacyInfo; zcc gdpr; zcc pii collection

User Privacy is one tenant-wide settings object that decides what end-user and device data Client Connector collects and who on the device can reach logs and packet capture. User Privacy settings let an organization comply with GDPR by turning collection of device owner and machine hostname on or off, enable packet capture and non-administrator access to log files, restrict packet capture to administrators, stop automatic crash report uploads, collect location for ZDX-enabled devices, let users override Z-Tunnel 2.0 or Private Access protocol settings, and enforce secure PAC URLs. [zcc.web-privacy:purpose] In the API the object is web privacy information, "the configuration information for end user and device-related PII", read and written as one object. [zcc.web-privacy:api-object]

What each setting does: [What each User Privacy setting collects or allows](kb:zcc.web-privacy.collection). Reading and writing it through the API and SDKs: [ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing](kb:zcc.api.web-privacy-wire).

**Not here.** Whether users can see where logs are stored, export or clear logs, change the log mode, or use Report an Issue is set on a different page, App Supportability. [zcc.web-privacy:separate-app-supportability] App Supportability settings are not in the web privacy object; by name they are company-info fields. [zcc.web-privacy:app-supportability-no-api] The mapping is [By name, the company-info fields `supportEnabled`, `supportAdminEmail`, `supportTicketEnabled`, `disableLoggingControls` and `fetchLogsForAdminsEnabled` hold Enable Support Access, Admin Email Address to Send Logs, Enable End User Ticket Submission to Zscaler, Hide Logging Control and Client Connector App Logs.](kb:zcc.support-options:field-ui-mapping); the settings themselves are in [What users can do with Client Connector logs: logging controls and readable exports](kb:zcc.logging.user-access) and [ZCC end-user support options (App Supportability)](kb:zcc.support-options). How verbose the app's own logs are is set per app profile: [App profile log mode and log file size](kb:zcc.app-profiles.logging).

Inferred, not quoted (say so when an answer rests on one):
- [zcc.web-privacy:app-supportability-no-api] Tier B: The absence from the web privacy body is pinned; the company-info side is a name match.

Area: zcc.web-privacy, its subjects in references/_meta/spine/zcc/zcc.web-privacy.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))
- interacts-with references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement): Collect Location Info for ZDX lets the app collect geolocation from ZDX-enabled devices; it works in conjunction with the ZDX service entitlement, is on by default, and is available only when ZDX is enabled for the company or selected groups. [zcc.web-privacy.collection:zdx-location]
- links-to references/_meta/text/zcc/zcc.api.web-privacy-wire.md (ZCC web privacy (User Privacy) calls: string flags, fields the contract lacks, and key casing)
- links-to references/_meta/text/zcc/zcc.app-profiles.logging.md (App profile log mode and log file size)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows)
