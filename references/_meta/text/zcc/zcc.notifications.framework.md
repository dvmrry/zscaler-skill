# The Zscaler Notification Framework: Client Connector's own pop-ups (zcc.notifications.framework)
Also called: zscaler notification framework; use zscaler notification framework; persistent notifications; custom timer; zia notification persistent; bring notification to focus; zcc notification timeout; useZscalerNotificationFramework

The framework is the pop-up system Client Connector can use on desktops instead of the operating system's. When enabled, the framework replaces the Windows and macOS notification systems, carrying the same informational messages. Only administrators can enable or disable it, and users cannot disable its notifications in Windows settings. [zcc.notifications.framework:overrides-os] Its settings exist for Windows and macOS only. [zcc.notifications.framework:windows-macos-only] It is switched on per app profile, by Use Zscaler Notification Framework in the Windows and macOS policies; the API carries it as `policyExtension.useZscalerNotificationFramework`. [zcc.notifications.framework:per-profile]

**Which versions.** The minimum Client Connector version differs between two vendor articles [divergence:zcc.notifications.framework:minimum-version].

**How pop-ups behave.** Framework notifications appear in the bottom right corner of the screen, up to five at a time, and time out after 5 seconds; they can also be read in the Client Connector Notifications window. [zcc.notifications.framework:display] Duplicate messages within a two-minute interval are suppressed. [zcc.notifications.framework:duplicates] Custom Timer sets how long a notification stays on screen, from 5 to 60 seconds. [zcc.notifications.framework:custom-timer] Enable Persistent Notifications overrides the timer and keeps critical notifications on screen until the user dismisses them: Private Access reauthentication, captive portal detection and requests for a system reboot. [zcc.notifications.framework:persistent] ZIA Notification Persistent overrides the timer for certain ZIA notifications, currently only DLP notifications. [zcc.notifications.framework:zia-persistent] On Windows 4.7 and later, Bring Notification to Focus (enabled by default) moves focus, including a screen reader's, to framework notifications; it also resets the Windows idle timer, which can delay the device locking. [zcc.notifications.framework:bring-to-focus]

**What depends on it.** The framework is required for DLP notifications. [zcc.notifications.framework:dlp-requires] With the embedded captive portal enabled, the vendor recommends enabling the framework so that users get a pop-up that opens the captive portal with one click. [zcc.notifications.framework:captive-portal-popup]

**Open questions.** Whether the operating system can still hide or delay Client Connector notifications is not sourced [gap:zcc.notifications.framework:os-suppression]. Which notifications platforms other than Windows and macOS show is only partly known [gap:zcc.notifications.framework:platform-support]: Linux, iOS and Android have the expiry warning [An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes.](kb:zcc.notifications:zpa-expiry-warning), and iOS a tunnel notification [On iOS, Show per-app VPN Tunnel Notification tells the user that a per-app VPN tunnel is being established.](kb:zcc.notifications:ios-per-app-vpn-notification).

What to check:
1. Whether the user's app profile enables the framework, since DLP notifications need it.
2. The device's Client Connector version against both stated minimums before relying on timer or persistence settings.
3. Whether a notification the user says never appeared was a duplicate suppressed within two minutes.

Sources disagree (name both sides):
- The minimum Client Connector version for the framework. [divergence:zcc.notifications.framework:minimum-version]
  - zscaler-help: The framework is available from 3.8 on Windows and 4.1 on macOS.
  - zscaler-help: Enabling the framework in app profiles needs 4.2 on both Windows and macOS.
  Impact: For Windows 3.8 to 4.1 and macOS 4.1 clients, one article says the framework runs and the other says it cannot be enabled, so whether the timer and persistence settings apply to those clients is unsettled.

Not known (open gaps):
- Operating-system suppression of Client Connector notifications [gap:zcc.notifications.framework:os-suppression]: settled by lab-test
- Client Connector notifications on Linux, ChromeOS, iOS and Android [gap:zcc.notifications.framework:platform-support]: settled by lab-test or operator-experience

Area: zcc.notifications, its subjects in references/_meta/spine/zcc/zcc.notifications.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)): It is switched on per app profile, by Use Zscaler Notification Framework in the Windows and macOS policies; the API carries it as `policyExtension.useZscalerNotificationFramework`. [zcc.notifications.framework:per-profile]
- links-to references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
- decided-by references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings), from zcc.notifications: Enabling templates removes the End User Notifications tab and copies its settings into a Legacy Notification Settings template, whose name cannot be changed. [zcc.notifications.templates:replaces-tab]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zcc.notifications: URL Filtering is not among the policies that notify through Client Connector; a blocked URL category is reported by the browser-based block notification. [zcc.notifications:url-filtering-not-listed]
