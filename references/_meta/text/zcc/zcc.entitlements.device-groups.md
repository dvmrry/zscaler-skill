# Device groups: posture-based groups of devices for service entitlement, their limits, expressions and the mobile switch (zcc.entitlements.device-groups)
Also called: device groups; Device Groups page; Use Device Groups in Service Entitlement; device posture group; different entitlements for one user's devices

Device groups let an admin assign entitlements and configure policy settings based on device posture profiles, so a user with multiple devices can be assigned different entitlements and forwarding policies; the vendor's example enrolls a personal device in one service such as Private Access and an employer-provided device in Private Access and Digital Experience. [zcc.entitlements.device-groups:what-it-is] Device groups are assigned to policies and service entitlements, such as enrolling device groups in Private Access, Internet & SaaS, Digital Experience and Zscaler Deception. [zcc.entitlements.device-groups:uses]

**Creating one.** A device group has a name, the applicable platforms, one or more device postures and an optional description; groups are managed on the Device Groups page (Infrastructure > Client Connector > Device Groups). [zcc.entitlements.device-groups:definition] Up to 4 device groups can be added. [zcc.entitlements.device-groups:limit] The limit leaves a question open [gap:zcc.entitlements.device-groups:limit-scope].

**Expressions.** When several device postures are selected, the AND operator is added after each; Add starts an OR alternative; up to 5 device postures can be added; and the page says that within a group the logic is AND and between groups it is OR. [zcc.entitlements.device-groups:expression]

**Use Device Groups in Service Entitlement.** Use Device Groups in Service Entitlement enables Zscaler services selectively, only on managed devices that meet specific posture configurations during enrollment, and applies to Internet & SaaS, Private Access and Digital Experience; Client Connector evaluates device posture during enrollment and keep-alive intervals and enables or disables services according to the user group and device group configuration set in the Admin Console. [zcc.entitlements.device-groups:mobile-evaluation]

**Android and iOS.** To create device groups for Android or iOS, Use Device Groups in Service Entitlement must first be enabled in Platform Settings (for Android, on the Platform Settings tab); that option applies to Client Connector 3.7 and later for Android and 4.4 and later for iOS. [zcc.entitlements.device-groups:mobile-prerequisite] The iOS version floors on two pages are not reconciled [gap:zcc.entitlements.device-groups:ios-floor]. The switch leaves other questions open [gap:zcc.entitlements.device-groups:mobile-switch-scope].

**Finding one.** The Device Groups page can be searched by Group Name or by Device Posture, and a Device Posture search needs the exact posture name. [zcc.entitlements.device-groups:search]

Per service: [Private Access entitlement and the machine tunnel switch](kb:zcc.entitlements.zpa), [Digital Experience (ZDX) entitlement](kb:zcc.entitlements.zdx), [Deception entitlement: the Client Connector integration, the enabled-by-default switch, user and device groups, the logout option and update timing](kb:zcc.entitlements.deception), and Internet & SaaS in [ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group](kb:zcc.entitlements). Device groups in app profile rules: [Which app profile a device gets: rule order, groups and the longest match](kb:zcc.app-profiles.selection). The posture profiles they are built from: [ZCC device posture profiles](kb:zcc.device-posture). The switch on the Platform Settings page: [Platform Settings: the per-OS console settings for sign-in, IPv6, ZDX upgrades, default UI and unattended-mode passwords](kb:zcc.platform-settings).

What to check:
1. For an Android or iOS device that gets no service by device group, whether Use Device Groups in Service Entitlement is enabled in Platform Settings and the client version meets the page's floor.
2. For a device that matches the wrong group, the device group's posture expression, where, per the page, AND joins postures inside a 'group' and OR joins 'groups'.

Not known (open gaps):
- What the 4-device-group limit counts [gap:zcc.entitlements.device-groups:limit-scope]: settled by source-read or lab-test
- Whether iOS device groups need 4.4 or 4.5 [gap:zcc.entitlements.device-groups:ios-floor]: settled by source-read or lab-test
- What the Use Device Groups in Service Entitlement pages leave out [gap:zcc.entitlements.device-groups:mobile-switch-scope]: settled by source-read or lab-test

Area: zcc.entitlements, its subjects in references/_meta/spine/zcc/zcc.entitlements.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.entitlements: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match)
- links-to references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles)
- links-to references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group)
- links-to references/_meta/text/zcc/zcc.entitlements.deception.md (Deception entitlement: the Client Connector integration, the enabled-by-default switch, user and device groups, the logout option and update timing)
- links-to references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement)
- links-to references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch)
- links-to references/_meta/text/zcc/zcc.platform-settings.md (Platform Settings: the per-OS console settings for sign-in, IPv6, ZDX upgrades, default UI and unattended-mode passwords)
