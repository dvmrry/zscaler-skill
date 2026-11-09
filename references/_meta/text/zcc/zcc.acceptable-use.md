# The Client Connector acceptable use policy prompt (zcc.acceptable-use)
Also called: zcc aup; acceptable use policy zcc; aup frequency; aup message; client connector aup; show users an acceptable use screen; aup custom days; client connector acceptable use policy; aup message html; aup not showing

The Client Connector AUP is a policy users must accept before they can connect to the internet or reach internal resources from devices protected by the app. [zcc.acceptable-use:gate] How the client renders it is not sourced [gap:zcc.acceptable-use:aup-rendering].

**How often.** Its frequency is Never, After User Enrollment, Daily, Weekly or Custom. [zcc.acceptable-use:frequency] Custom repeats it every 1 to 180 days. [zcc.acceptable-use:custom-days] When each option fires is open [gap:zcc.acceptable-use:frequency-semantics]. Whether editing the message re-prompts users who already accepted is open [gap:zcc.acceptable-use:redisplay-on-change], and so is how soon a changed setting reaches connected devices [gap:zcc.acceptable-use:config-propagation].

**The message.** The message is the organization's policy text; it may contain static HTML tags and images, as long as the images are reachable from the internet, and can be previewed as users will see it. [zcc.acceptable-use:message] How long it may be is open [gap:zcc.acceptable-use:message-size], as is whether it may link out to a policy page [gap:zcc.acceptable-use:external-links], and whether it can be localized [gap:zcc.acceptable-use:localization].

**What the user can do.** Whether there is a decline choice, a checkbox or signature variant, and what declining does, is open [gap:zcc.acceptable-use:decline-and-variants]. Whether the prompt shows before any tunnel is up, and what that means for content behind Private Access, is open with how it is rendered [gap:zcc.acceptable-use:aup-rendering].

**Where it is configured.** It is configured once, under End User Notification for Client Connector, not on an app profile, so it applies to users whatever app profile they have. [zcc.acceptable-use:not-on-app-profile] The AUP settings do not distinguish platforms. [zcc.acceptable-use:no-platform-split] ZCC admin roles carry a `clientConnectorNotifications` permission, which by its name governs the notification settings where the AUP lives. [zcc.acceptable-use:admin-permission] Whether the AUP tab stays visible when notification templates are in use is open [gap:zcc.acceptable-use:notification-templates-mode].

**Automation.** The AUP frequency and message have no API operation, SDK field or Terraform resource: the ZCC API document, both SDKs' ZCC code and the ZCC provider mention no AUP. [zcc.acceptable-use:no-api] No install parameter disables or pre-accepts the AUP: the Windows, macOS, iOS and Android install parameter articles mention none, so an MDM-deployed app still shows it at the configured frequency. [zcc.acceptable-use:no-install-parameter]

**Edges.** Machine-tunnel and kiosk behavior is open [gap:zcc.acceptable-use:non-interactive-sessions]; minimum agent version is open [gap:zcc.acceptable-use:min-agent-version]; whether acceptances are logged anywhere is open [gap:zcc.acceptable-use:acceptance-logging].

The ZIA and Private Access consent screens are different objects: [Which acceptable use screen: ZCC, ZIA location, ZIA notifications or ZPA user portal](kb:zcc.acceptable-use.other-surfaces).

What to check:
1. Read the AUP frequency and, for Custom, the number of days, in the console; nothing in the API returns them.
2. If images in the message do not render, whether they are reachable from the internet.
3. Whether a complaint concerns the Client Connector AUP or the ZIA browser AUP, which logs each acceptance.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.acceptable-use:not-on-app-profile] Tier B: Absence: the app profile articles and the web policy edit body were searched for an AUP setting; none found.
- [zcc.acceptable-use:no-platform-split] Tier B: Rests on the AUP article naming no platform; per-platform rendering is not documented.
- [zcc.acceptable-use:admin-permission] Tier B: The scope of the permission is inferred from its name.
- [zcc.acceptable-use:no-api] Tier B: Absence: case-insensitive searches for 'aup' and 'acceptable use' over automate-zscaler/openapi/zcc.openapi.json, zscaler-sdk-go zscaler/zcc, zscaler-sdk-python zscaler/zcc and terraform-provider-zcc internal found nothing.
- [zcc.acceptable-use:no-install-parameter] Tier B: Absence: the four install parameter captures (supported-parameters-zscaler-client-connector-windows, -macos and -ios, and parameters-guide-zscaler-client-connector-android-and-android-chromeos) were searched for 'aup' and 'acceptable use'; none found.

Not known (open gaps):
- Whether editing the AUP message re-prompts users [gap:zcc.acceptable-use:redisplay-on-change]: settled by lab-test
- Decline button, confirmation variants and the effect of declining [gap:zcc.acceptable-use:decline-and-variants]: settled by lab-test or source-read
- Whether the AUP message can link to an external policy page [gap:zcc.acceptable-use:external-links]: settled by lab-test
- Minimum agent version for the AUP and HTML rendering [gap:zcc.acceptable-use:min-agent-version]: settled by source-read
- Whether the AUP tab is suppressed when notification templates are used [gap:zcc.acceptable-use:notification-templates-mode]: settled by lab-test
- Whether AUP acceptances are logged [gap:zcc.acceptable-use:acceptance-logging]: settled by tenant-data or operator-experience
- Whether the AUP message can be localized [gap:zcc.acceptable-use:localization]: settled by source-read
- Maximum size of the Client Connector AUP message [gap:zcc.acceptable-use:message-size]: settled by source-read or lab-test
- AUP behavior with machine tunnels and kiosks [gap:zcc.acceptable-use:non-interactive-sessions]: settled by lab-test
- When an AUP setting change reaches connected devices [gap:zcc.acceptable-use:config-propagation]: settled by lab-test or operator-experience
- What Daily, Weekly and After User Enrollment mean exactly [gap:zcc.acceptable-use:frequency-semantics]: settled by lab-test
- How the client presents its AUP, and whether it shows before any tunnel is up [gap:zcc.acceptable-use:aup-rendering]: settled by lab-test or operator-experience

Area: zcc.acceptable-use, its subjects in references/_meta/spine/zcc/zcc.acceptable-use.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.acceptable-use.other-surfaces.md (Which acceptable use screen: ZCC, ZIA location, ZIA notifications or ZPA user portal)
