# Language of the Client Connector app, its notifications and the AUP (zcc.notifications.localization)
Also called: zcc language; zcc localization; notification language; aup multiple languages; use system language
Former IDs: zcc-30

Client Connector can switch its user interface language to match the system language. [zcc.notifications.localization:system-language] French is supported from 4.5 on Windows, 4.3 on macOS and 5.0 on Android and Android on ChromeOS, and German from 5.0 on Windows and on Android and Android on ChromeOS; the vendor lists Chinese (Taiwan), Japanese and Spanish on all three, and German on macOS, as not currently supported. [zcc.notifications.localization:languages]

**Choosing the language.** On Windows 4.8 and later, an app profile sets the default display language for the app and the Notifications window text: Use System Language (the default) or English. Users can change it in the More window; the user-facing article says this applies if the organization has enabled the option, and that the app UI and pop-up notifications change to the language selected. [zcc.notifications.localization:display-language-setting]

**Messages from ZIA.** ZIA notifications delivered through Client Connector can be customized in multiple supported languages. [zcc.notifications.localization:zia-eun-languages]

**Templates and the AUP.** The notification template model has no language or locale field. [zcc.notifications.localization:template-no-locale] Whether the AUP can be localized is open: [Whether the AUP message can be localized](kb:zcc.acceptable-use:localization). Which language is used when the system language is not supported is open [gap:zcc.notifications.localization:fallback-language].

What to check:
1. Whether the user's system language is one Client Connector supports at the installed version.
2. Whether the app profile forces English or the user changed the language in the More window.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.notifications.localization:template-no-locale] Tier B: Rests on absence: the Go SDK's NotificationTemplate struct at the pin has no language field, and the template article lists none.

Not known (open gaps):
- Language used when the system language is unsupported [gap:zcc.notifications.localization:fallback-language]: settled by lab-test

Area: zcc.notifications, its subjects in references/_meta/spine/zcc/zcc.notifications.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.notifications: An app profile can warn users that their Private Access authentication is about to expire, as Notify Users before ZPA Authentication Expires on Windows and ZPA ReAuth Notification on Linux, iOS and Android; the Advanced Notification time sets how far ahead, from 5 to 1440 minutes. [zcc.notifications:zpa-expiry-warning]
- decided-by references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings), from zcc.notifications: Enabling templates removes the End User Notifications tab and copies its settings into a Legacy Notification Settings template, whose name cannot be changed. [zcc.notifications.templates:replaces-tab]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zcc.notifications: URL Filtering is not among the policies that notify through Client Connector; a blocked URL category is reported by the browser-based block notification. [zcc.notifications:url-filtering-not-listed]
- links-to references/_meta/text/zcc/zcc.acceptable-use.md (The Client Connector acceptable use policy prompt)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
