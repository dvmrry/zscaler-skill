# When an app profile change reaches a device (zcc.app-profiles.propagation)
Also called: app profile change not applied; app profile propagation; zcc policy update; when does zcc download the app profile; update policy zcc

The app checks for app profile updates and downloads changes whenever the user logs out and back into the app or restarts the computer. [zcc.app-profiles.propagation:download-on-relogin] Settings held on the app profile, among them the forwarding profile choice, passwords, SSL certificate installation and log mode, therefore reach a device when it next downloads the profile, not when they are saved. [zcc.app-profiles.propagation:settings-ride-the-profile]

App profile edits also reach a device without a logout or restart: the help describes the device checking in to download a modified app profile, an automatic policy update, and Update Policy in the app as a manual refresh. [zcc.app-profiles.propagation:connected-without-relogin] How often a connected device checks in is open [gap:zcc.app-profiles.propagation:connected-refresh]. Whether an edit through the API also needs an activate call is open in [Whether an edit is served without calling activate](kb:zcc.api.web-policy-wire:edit-needs-activate).

Whether a device has downloaded its profile since a change shows on its device details: [Configuration Download Count is the number of times the app profile was updated on the device since enrollment, and Last Configuration Download Time is the last such update.](kb:zcc.devices.record-fields:config-download).

Service entitlement changes follow their own update timing: [An entitlement change reaches devices the next time they connect; connected devices update automatically within 60 minutes, or when the user clicks Update Policy, after which the user must reauthenticate.](kb:zcc.entitlements:update-timing).

What to check:
1. Whether the user has logged out and back in, or restarted, since the change.
2. If not, have the user click Update Policy, or wait for the next check-in; the check-in interval is open.
3. Compare the device's Last Configuration Download Time with the time of the change.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.app-profiles.propagation:settings-ride-the-profile] Tier B: Derived: the help gives the download timing for the profile as a whole; no source gives a per-setting timing.
- [zcc.app-profiles.propagation:connected-without-relogin] Tier B: The certificate-install events name a check-in that downloads a modified app profile, and the force-removal article names an automatic policy update. Neither source gives the check-in interval.

Not known (open gaps):
- How often a connected device checks in for app profile changes [gap:zcc.app-profiles.propagation:connected-refresh]: settled by lab-test. Blocks: telling a user whether to wait, click Update Policy, or log out

Area: zcc.app-profiles, its subjects in references/_meta/spine/zcc/zcc.app-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group), from zcc.app-profiles: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- decided-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match), from zcc.app-profiles: The rule order is the order of precedence among a platform's profile rules and helps determine which rule the app downloads for a user at enrollment; precedence is by ascending number. [zcc.app-profiles.selection:ascending-precedence]
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.devices.record-fields.md (What a device record's fields mean, and how the list and detail calls return them)
