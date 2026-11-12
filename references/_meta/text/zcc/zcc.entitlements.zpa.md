# Private Access entitlement and the machine tunnel switch (zcc.entitlements.zpa)
Also called: zpa enabled by default for user tunnel; zpaEnableForAll; enable zpa for a group of users; enable zpa for device groups; enable machine tunnel for all; machineTunEnabledForAll; computeDeviceGroupsForZPA; zpa disconnects device group

With ZPA Enabled by Default for User Tunnel on, Private Access is available to all users and cannot be assigned to a group. [zcc.entitlements.zpa:default-for-all] With the default off, no user has Private Access unless groups are selected, and then only the selected groups do; by default no user groups are selected. [zcc.entitlements.zpa:configurations] Private Access instances created before July 2017 have it enabled for all users by default; instances created after July 2017 have it disabled. [zcc.entitlements.zpa:default-by-tenant-age] Group-level Private Access entitlement needs Client Connector 1.2.4 or later; earlier versions always have Private Access enabled regardless of the setting. [zcc.entitlements.zpa:min-version]

**Device groups.** When device groups are used, the user must belong to both the device group and the user group, or Private Access disconnects. [zcc.entitlements.zpa:device-and-user-group]

**Machine tunnels.** With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all] Turning it off does not drop existing machine tunnels: they stay connected until the user's app profile policy is updated and the user logs out. [zcc.entitlements.zpa:machine-tunnel-disable] Changing the machine token, or applying a different app profile, does not override existing machine tunnels; the token must be removed from the app profile and the tunnel removed in Enrolled Devices, or the app reinstalled. [zcc.entitlements.zpa:machine-token-change] The machine token is a machine provisioning key: [A machine provisioning key is a text string generated when the key is added in the Admin Console. Added to a Zscaler Client Connector profile rule, it works as an ID for the machine and lets the Private Access cloud verify the machine's authenticity before Windows or macOS login.](kb:zpa.machine-tunnels.provisioning-keys:key-form).

**In the API.** In the API these settings read as `zpaEnableForAll` (the user-tunnel default), `groupList` and `deviceGroupList` (the selections), `computeDeviceGroupsForZPA` (device groups enabled) and `machineTunEnabledForAll`. [zcc.entitlements.zpa:api-field-names] Whether the group list survives while the all-users switch is on, and becomes effective again when it is turned off, is open [gap:zcc.entitlements.zpa:stale-group-list]. What the machine tunnel switch does without a Private Access subscription is open [gap:zcc.entitlements.zpa:machine-tunnel-without-zpa].

Whether the machine tunnel can be limited to some devices is open [gap:zcc.entitlements.zpa:machine-tunnel-subset].

What to check:
1. Whether ZPA Enabled by Default for User Tunnel is on; if so every user is entitled.
2. Otherwise whether one of the user's groups is selected, and, where device groups are used, whether the device is in a selected device group as well.
3. For a pre-login tunnel, whether Enable Machine Tunnel for All is on and the user's app profile carries a machine token.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.entitlements.zpa:api-field-names] Tier B: The mapping of API fields to console settings is by name and position; no source states it.

Not known (open gaps):
- Whether selected groups persist while ZPA is enabled for all users [gap:zcc.entitlements.zpa:stale-group-list]: settled by lab-test. Blocks: auditing who gains Private Access when the all-users default is turned off
- What the machine tunnel switch does without a Private Access subscription [gap:zcc.entitlements.zpa:machine-tunnel-without-zpa]: settled by source-read
- Whether the machine tunnel can be enabled for some devices only [gap:zcc.entitlements.zpa:machine-tunnel-subset]: settled by source-read or tenant-data. Blocks: advising how to roll the machine tunnel out to a subset of devices

Area: zcc.entitlements, its subjects in references/_meta/spine/zcc/zcc.entitlements.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.entitlements: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect): The tenant-wide switch is Enable Machine Tunnel for All, under Administration > Client Connector Entitlement > Private Access, where Edit opens the setting. When it is on, every user with a Machine Token in the app profile can connect to Private Access without being logged in. [zpa.machine-tunnels.requirements:enable-for-all]
- links-to references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
- see-also references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group)
