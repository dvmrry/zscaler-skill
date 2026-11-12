# The Zscaler Notification Framework: Client Connector's own pop-ups (zcc.notifications.framework)
Also called: zscaler notification framework; use zscaler notification framework; persistent notifications; custom timer; zia notification persistent; bring notification to focus; zcc notification timeout; useZscalerNotificationFramework
Former IDs: zcc-31, zcc-32

The framework is the pop-up system Client Connector can use on desktops instead of the operating system's. On Windows and macOS the framework overrides the Windows-based and macOS-based notification systems. [zcc.notifications.framework:overrides-os] Its settings exist for Windows and macOS only. [zcc.notifications.framework:windows-macos-only] It is switched on per app profile, by Use Zscaler Notification Framework in the Windows and macOS policies; the API carries it as `policyExtension.useZscalerNotificationFramework`. [zcc.notifications.framework:per-profile]

**Which versions.** The framework page says the feature is only available for Zscaler Client Connector version 3.8 and later for Windows and for Zscaler Client Connector version 4.1 and later for macOS. The end user notifications page says enabling the framework in app profiles needs Client Connector 4.2 or later on Windows and macOS. [zcc.notifications.framework:versions]

**How pop-ups behave.** Framework notifications appear in the bottom right corner of the screen, up to five at a time, and time out after 5 seconds; they can also be read in the Client Connector Notifications window. [zcc.notifications.framework:display] Duplicate messages within a two-minute interval are suppressed. [zcc.notifications.framework:duplicates] Custom Timer sets how long a notification stays on screen, from 5 to 60 seconds. [zcc.notifications.framework:custom-timer] Enable Persistent Notifications overrides the timer and keeps critical notifications on screen until the user dismisses them: Private Access reauthentication, captive portal detection and requests for a system reboot. [zcc.notifications.framework:persistent] ZIA Notification Persistent overrides the timer for certain ZIA notifications, currently only DLP notifications. [zcc.notifications.framework:zia-persistent] On Windows 4.7 and later, Bring Notification to Focus (enabled by default) moves focus, including a screen reader's, to framework notifications; it also resets the Windows idle timer, which can delay the device locking. [zcc.notifications.framework:bring-to-focus]

**What depends on it.** The framework is required for DLP notifications. [zcc.notifications.framework:dlp-requires] With the embedded captive portal enabled, the vendor recommends enabling the framework so that users get a pop-up that opens the captive portal with one click. [zcc.notifications.framework:captive-portal-popup]

**Open questions.** Whether the operating system can still hide or delay Client Connector notifications is not sourced [gap:zcc.notifications.framework:os-suppression]. Which notifications platforms other than Windows and macOS show is only partly known [gap:zcc.notifications.framework:platform-support]: Linux, iOS and Android have the expiry warning [An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes.](kb:zcc.notifications:zpa-expiry-warning), and iOS a tunnel notification [On iOS, Show per-app VPN Tunnel Notification tells the user that a per-app VPN tunnel is being established.](kb:zcc.notifications:ios-per-app-vpn-notification).

What to check:
1. Whether the user's app profile enables the framework, since DLP notifications need it.
2. The device's Client Connector version against the version each framework-only notification needs (Persistence from 4.7 for Windows, Do not Disturb from 4.9, all of them from 5.0 for macOS) before relying on it.
3. Whether a notification the user says never appeared was a duplicate suppressed within two minutes.

Not known (open gaps):
- Operating-system suppression of Client Connector notifications [gap:zcc.notifications.framework:os-suppression]: settled by lab-test
- Client Connector notifications on Linux, ChromeOS, iOS and Android [gap:zcc.notifications.framework:platform-support]: settled by lab-test or operator-experience

Area: zcc.notifications, its subjects in references/_meta/spine/zcc/zcc.notifications.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)): It is switched on per app profile, by Use Zscaler Notification Framework in the Windows and macOS policies; the API carries it as `policyExtension.useZscalerNotificationFramework`. [zcc.notifications.framework:per-profile]
- links-to references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
- decided-by references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings), from zcc.notifications: Existing settings from the End User Notifications tab were migrated to a Legacy Notification Settings template, whose name cannot be changed. [zcc.notifications.templates:replaces-tab]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zcc.notifications: URL Filtering is not among the policies that notify through Client Connector; a blocked URL category is reported by the browser-based block notification. [zcc.notifications:url-filtering-not-listed]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.notifications.global-settings.md (Tenant-wide Client Connector notification switches)
