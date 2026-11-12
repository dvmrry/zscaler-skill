# Restart Service and Repair App for end users (zcc.support-options.restart-and-repair)
Also called: restart service zcc; repair app zcc; enable end user to restart services and repair app; zcc fail open on restart

Users can restart or repair Client Connector from its More window if the admin allows it. Both actions briefly change how traffic is handled.

**The options.** Users troubleshoot Client Connector with Restart Service or Repair App in its More window; Repair App exists only on Windows. [zcc.support-options.restart-and-repair:options] The options are turned on with Enable End User to Restart Services and Repair App on the App Supportability page. [zcc.support-options.restart-and-repair:enable-setting] Repair App tries to repair Client Connector by reinstalling what the page calls its app drives and services. [zcc.support-options.restart-and-repair:repair-reinstalls]

**Effect on enforcement.** The vendor's article contradicts itself on this, saying both that a restart does not affect enforcement and that a restart or repair fails open briefly: The vendor says restarting Client Connector does not affect security enforcement; on Android and Android on ChromeOS 3.8 and later, Restart Service can be clicked only once in 30 seconds. [zcc.support-options.restart-and-repair:restart-enforcement] Restart Service and Repair App make Client Connector fail open briefly; the vendor's advice is to disable access to them where that is not acceptable. [zcc.support-options.restart-and-repair:brief-fail-open] An app profile can make the restart fail closed instead: [A fail-close option makes the app fail close while a tunnel is starting or restarting, for example after login, Repair App or Restart Service.](kb:zcc.app-profiles.advanced-settings:fail-close-lockdown).

What to check:
1. Whether a short unfiltered window lines up with a user's restart or repair, and whether the app profile's Lockdown on Tunnel Process Exit was on.

Area: zcc.support-options, its subjects in references/_meta/spine/zcc/zcc.support-options.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.forwarding-profiles.fail-open.md (Client Connector fail-open: captive portals, unreachable Service Edges and tunnel failures): Restart Service and Repair App make Client Connector fail open briefly; the vendor's advice is to disable access to them where that is not acceptable. [zcc.support-options.restart-and-repair:brief-fail-open]
- links-to references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))
