# App profile log mode and log file size (zcc.app-profiles.logging)
Also called: zcc log mode; zcc log level; logMode; logLevel; log file size zcc; make zcc logs verbose; zcc debug logging

A profile's log mode defaults to the global log mode configured in Platform Settings, and can be overridden for that profile only. [zcc.app-profiles.logging:default-follows-global] The Default Global Log Mode article says a default global log mode, set on the Platform Settings tab, can be configured for new profiles, and that it can be overridden for individual profiles in App Profiles. [zcc.app-profiles.logging:global-default-for-new] Whether a change to the global mode reaches existing profiles left on the default is open [gap:zcc.app-profiles.logging:global-change-existing]. The modes are cumulative: Error logs only errors that affect functionality, Warn adds potential issues, Info adds general activity, and Debug logs all activity that could help Zscaler Support. [zcc.app-profiles.logging:log-mode-ladder]

**Size.** Log file size is 50 to 1000 MB (50 to 500 on Android), 100 MB per log type by default; at the limit the oldest logs are truncated. [zcc.app-profiles.logging:log-file-size]

**In the API.** The API fields `logMode` and `logLevel`, their codes and what is still open about them are in [Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel](kb:zcc.logging.log-modes).

Whether users can change the log mode, export or clear logs is set on the App Supportability page: [What users can do with Client Connector logs: logging controls and readable exports](kb:zcc.logging.user-access). What the app may collect and who may read the log folder is [What each User Privacy setting collects or allows](kb:zcc.web-privacy.collection).

Not known (open gaps):
- Whether changing the global log mode changes existing profiles left on the default [gap:zcc.app-profiles.logging:global-change-existing]: settled by lab-test or source-read

Area: zcc.app-profiles, its subjects in references/_meta/spine/zcc/zcc.app-profiles.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match), from zcc.app-profiles: The rule order is the order of precedence among a platform's profile rules and helps determine which rule the app downloads for a user at enrollment; precedence is by ascending number. [zcc.app-profiles.selection:ascending-precedence]
- interacts-with references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group), from zcc.app-profiles: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.logging.log-modes.md (Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows)
