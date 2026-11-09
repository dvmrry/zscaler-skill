# Client Connector pop-up messages: type, meaning, user action and duplicate suppression (zcc.notifications.pop-ups)
Also called: zcc pop-up messages; pop-up notifications; client connector message list; Internet Security is Connected; Private Access Safe Mode has started; Application access is blocked by Private Access policy

The vendor's pop-up message list applies only to Client Connector 4.4 and later for Windows and 4.3 and later for macOS. Its types are Default (general notifications), Service Status (the status of a Zscaler service, such as a service in Disaster Recovery mode), App Updates (the upgrade process), Internet & SaaS Notifications (for example Data Loss Prevention or device posture), Private Access Reauthentication, and Critical, which display regardless of end user notification configuration and cannot be turned off. The types that display are based on the end user notifications configuration in the Admin Console, and users can disable or pause notifications. [zcc.notifications.pop-ups:scope-and-types] If a customizable Strict Enforcement Notification is configured, an additional notification is displayed when users try to access the internet before enrolling in Client Connector. [zcc.notifications.pop-ups:strict-enforcement-notification]

**Critical messages.** The vendor's pop-up table has these rows of type Critical: Captive Portal detected (the user clicks Open Browser to access the internet), Started capturing packets, Finished capturing packets, and Private Access is Connected with either (Business Continuity mode) or (Exited Business Continuity mode). [zcc.notifications.pop-ups:critical-messages]

**Private Access messages.** Private Access pop-ups include: Access to all or certain private applications will expire soon, where the user clicks Authenticate Early on the Private Access window; Access to certain applications requires you to reauthenticate, where the user clicks Authenticate on the Private Access window; and the Default message Application access is blocked by Private Access policy, whose action is to contact the organization's support admin, which usually indicates a posture block and can be customized in the Admin Console. [zcc.notifications.pop-ups:private-access-messages]

**Driver and re-login messages.** Internet Security is in Driver Error and Private Access is in Driver Error report that Client Connector experienced an error after the user clicked Repair App on the More window, and the action is Click Restart Service on the More window, as it is for Please restart the system for driver repair to complete. Internet Security is Enabled as per latest policy and Digital Experience is Enabled as per latest policy ask the user to log out of the app and log back in again. [zcc.notifications.pop-ups:driver-and-relogin-messages]

**Other messages.** Other listed pop-ups include Service has been administratively disabled, Services are down because the network is disconnected, Failed to report issue, Issue reported, the App Updates messages (Failed to check for updates, ZDX updates or ZDP updates, to retry later; Latest available app is already running; New update is available, which auto-updates the app now), the Internet & SaaS Data Loss Protection notification, where Learn More opens a report of the violation and the message can be customized in the Admin Console, and, for macOS only, The SSL certificate could not be trusted automatically, asking the user to trust the certificate from the keychain. [zcc.notifications.pop-ups:other-messages] Whether other platforms show a certificate trust message is open [Notification for a certificate trust failure](kb:zcc.notifications:cert-trust-ux).

**Duplicates.** The Connected and Disconnected Service Status pop-ups for Internet Security and for Private Access list duplicates within a 1-minute interval as suppressed, and the Internet Security Safe Mode has started and Private Access Safe Mode has started pop-ups list duplicates within a 12-hour interval as suppressed. [zcc.notifications.pop-ups:suppression-intervals] The framework pages give one interval for all duplicates [divergence:zcc.notifications.pop-ups:duplicate-interval]; the framework itself is in [The Zscaler Notification Framework: Client Connector's own pop-ups](kb:zcc.notifications.framework). The partner login messages are in [Client Connector shows Partner Private Access is Connected and Partner Private Access is Disconnected as Service Status pop-ups for Private Access, and duplicates of each that display within a 1-minute interval are suppressed. The pop-up list applies to Client Connector 4.4 and later for Windows and 4.3 and later for macOS.](kb:zcc.partner-tenants:partner-pop-ups).

**Open questions.** Whether the list applies on Linux or mobile is not stated [gap:zcc.notifications.pop-ups:other-platforms]. What the DLP pop-up's message text shows beyond its Learn More report is not stated [gap:zcc.notifications.pop-ups:dlp-message-text].

What to check:
1. The device's OS and Client Connector version against the list's scope before treating a message as expected or missing.
2. Whether a pop-up a user says never appeared was a duplicate suppressed within its interval, using the divergence for the interval of the message type.
3. For an Application access is blocked message, whether a posture block is the cause, since the vendor says it usually indicates one.

Sources disagree (name both sides):
- The pop-up message table suppresses duplicates within 1 minute for connected and disconnected messages and within 12 hours for Safe Mode messages, while the Notification Framework pages state a single 2-minute interval for duplicate messages. [divergence:zcc.notifications.pop-ups:duplicate-interval]
  - zscaler-help: Duplicates of the Internet Security Connected message within a 1-minute interval are suppressed.
  - zscaler-help: Duplicates of the Internet Security Safe Mode message within a 12-hour interval are suppressed.
  - zscaler-help: The Notification Framework suppresses duplicate messages within a 2-minute interval, stated for duplicates generally (existing claim zcc.notifications.framework:duplicates).
  - zscaler-help: The notification templates page states a two-minute interval for duplicate messages, again without per-message exceptions.
  Impact: Whether a repeated pop-up is shown depends on which interval governs it; the pages do not say whether the per-message intervals replace the framework-wide one or the framework applies a further limit.

Not known (open gaps):
- Whether the pop-up list applies on Linux or mobile [gap:zcc.notifications.pop-ups:other-platforms]: settled by source-read or lab-test
- What the Data Loss Protection pop-up shows [gap:zcc.notifications.pop-ups:dlp-message-text]: settled by lab-test

Area: zcc.notifications, its subjects in references/_meta/spine/zcc/zcc.notifications.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.notifications: An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes. [zcc.notifications:zpa-expiry-warning]
- decided-by references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings), from zcc.notifications: Enabling templates removes the End User Notifications tab and copies its settings into a Legacy Notification Settings template, whose name cannot be changed. [zcc.notifications.templates:replaces-tab]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zcc.notifications: URL Filtering is not among the policies that notify through Client Connector; a blocked URL category is reported by the browser-based block notification. [zcc.notifications:url-filtering-not-listed]
- links-to references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
- links-to references/_meta/text/zcc/zcc.notifications.framework.md (The Zscaler Notification Framework: Client Connector's own pop-ups)
- links-to references/_meta/text/zcc/zcc.partner-tenants.md (Private Access partner logins: who may log in to whose tenant, and what the user does and sees)
