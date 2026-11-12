# Tenant-wide Client Connector notification switches (zcc.notifications.global-settings)
Also called: global eun configuration; enable notifications by default; enable zia notifications; zpa reauthentication notification interval; service status notifications; app update notifications; silence zcc notifications

When notification templates are in use, the End User Notifications tab is not displayed and its settings are configured on the Notification Templates tab instead. [zcc.notifications.global-settings:templates-replace-tab]

**What the tab switches.** Separate switches send app upgrade notifications, service status notifications (for example a service in Disaster Recovery mode) and ZIA notifications (for example DLP). [zcc.notifications.global-settings:category-toggles] Enable Notifications by Default and Enable Notifications for ZPA reauthentication are switched on when a user enrolls, and the user can turn either off in Client Connector. [zcc.notifications.global-settings:user-changeable] Show ZPA Reauthentication Notifications Every (In Minutes) repeats the reauthentication notification at a set interval of 2 to 1440 minutes, and is enabled by default. [zcc.notifications.global-settings:reauth-interval] These switches are one tenant-wide configuration; for these switches, per-group values come only from notification templates. [zcc.notifications.global-settings:global-scope] App profiles carry other notification switches of their own: [It is switched on per app profile, by Use Zscaler Notification Framework in the Windows and macOS policies; the API carries it as `policyExtension.useZscalerNotificationFramework`.](kb:zcc.notifications.framework:per-profile), [An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes.](kb:zcc.notifications:zpa-expiry-warning).

**Pop-up timing and persistence.** Those settings belong to the notification framework [The Zscaler Notification Framework: Client Connector's own pop-ups](kb:zcc.notifications.framework).

**Switches outside this tab.** The iOS install parameter that suppresses captive-portal notifications is in [iOS and Android-only install keys](kb:zcc.install.mobile-options).

**Open questions.** Whether turning off Enable Notifications by Default changes devices that are already enrolled is open [gap:zcc.notifications.global-settings:disable-effect-on-enrolled]. Whether admins can see that a user turned off reauthentication prompts is open [gap:zcc.notifications.global-settings:user-disable-record].

What to check:
1. Which notification categories are off, before assuming the user was told about an update, a service in DR mode, a DLP event or a ZPA reauthentication.
2. Whether the tenant uses notification templates, in which case the settings live in the template assigned to the user's app profile.
3. Whether the user turned off notifications or reauthentication prompts in the app.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.notifications.global-settings:global-scope] Tier B: Rests on the tab being the Global EUN Configuration tab and on templates being the documented per-group mechanism; no source states the scope in so many words. Narrowed (v5 item 4): previously said different settings for different groups come only from templates, but app profiles carry notification switches of their own (Use Zscaler Notification Framework, Bring Notification to Focus, the ZPA expiry warning).

Not known (open gaps):
- Effect of turning off Enable Notifications by Default on enrolled devices [gap:zcc.notifications.global-settings:disable-effect-on-enrolled]: settled by lab-test
- Visibility of a user's own notification opt-out [gap:zcc.notifications.global-settings:user-disable-record]: settled by lab-test or tenant-data. Blocks: explaining a user who never sees reauthentication prompts

Area: zcc.notifications, its subjects in references/_meta/spine/zcc/zcc.notifications.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings): When notification templates are in use, the End User Notifications tab is not displayed and its settings are configured on the Notification Templates tab instead. [zcc.notifications.global-settings:templates-replace-tab]
- links-to references/_meta/text/zcc/zcc.notifications.framework.md (The Zscaler Notification Framework: Client Connector's own pop-ups)
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.notifications: An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes. [zcc.notifications:zpa-expiry-warning]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zcc.notifications: URL Filtering is not among the policies that notify through Client Connector; a blocked URL category is reported by the browser-based block notification. [zcc.notifications:url-filtering-not-listed]
- links-to references/_meta/text/zcc/zcc.install.mobile-options.md (iOS and Android-only install keys)
- links-to references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
