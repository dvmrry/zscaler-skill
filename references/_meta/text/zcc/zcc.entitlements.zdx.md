# Digital Experience (ZDX) entitlement (zcc.entitlements.zdx)
Also called: zdx enabled by default; upmEnableForAll; enable zdx for a group of users; enable zdx for device groups; logout zcc when zdx entitlement is enabled; logoutZCCForZDXService; computeDeviceGroupsForZDX; zdx location not collected

With ZDX Enabled by Default on, ZDX is available to all users and cannot be assigned to a group or device group. [zcc.entitlements.zdx:default-for-all] With the default off, no user has ZDX unless groups are selected, and then only the selected groups do; no groups are selected by default. [zcc.entitlements.zdx:configurations] Group-level ZDX entitlement needs Client Connector 2.2.1 or later, and device-group entitlement 3.9 or later. [zcc.entitlements.zdx:versions]

**Device groups.** With ZDX Enabled by Default disabled and the posture-based service feature enabled, Digital Experience (ZDX) can be enabled for device groups. [zcc.entitlements.zdx:posture-device-groups]

**Logging users out.** Logout Zscaler Client Connector when ZDX Entitlement is Enabled logs users out when ZDX is enabled for their device group, so that logging back in starts ZDX; it applies to customers using ZPA only or ZPA with Deception. With it off, the app runs without ZDX until the next login. [zcc.entitlements.zdx:logout-on-enable]

**Location.** The ZDX entitlement object also carries an integer `collectZdxLocation` field. [zcc.entitlements.zdx:location-field] The privacy-side switch works with this entitlement: [Collect Location Info for ZDX lets the app collect geolocation from ZDX-enabled devices; it works in conjunction with the ZDX service entitlement, is on by default, and is available only when ZDX is enabled for the company or selected groups.](kb:zcc.web-privacy.collection:zdx-location). Whether both must be on for location to be collected is open [gap:zcc.entitlements.zdx:location-both-required].

**In the API.** In the API the settings read as `upmEnableForAll` (the default), `upmGroupList` and `upmDeviceGroupList` (the selections), `computeDeviceGroupsForZDX` (device groups enabled) and `logoutZCCForZDXService` (the logout option). [zcc.entitlements.zdx:api-field-names] What the `upm` prefix stands for is open [gap:zcc.entitlements.zdx:upm-meaning].

What to check:
1. Whether ZDX Enabled by Default is on; otherwise whether the user's group or the device's group is selected.
2. Whether the client version supports group or device-group ZDX entitlement.
3. For missing location data, the entitlement's location field and the User Privacy location switch.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.entitlements.zdx:api-field-names] Tier B: The mapping of API fields to console settings is by name and position; no source states it.

Not known (open gaps):
- Whether ZDX location needs both the entitlement flag and the User Privacy switch [gap:zcc.entitlements.zdx:location-both-required]: settled by lab-test. Blocks: explaining missing ZDX location data
- What the upm prefix of the ZDX entitlement fields stands for [gap:zcc.entitlements.zdx:upm-meaning]: settled by source-read

Area: zcc.entitlements, its subjects in references/_meta/spine/zcc/zcc.entitlements.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.web-privacy.collection.md (What each User Privacy setting collects or allows): Collect Location Info for ZDX lets the app collect geolocation from ZDX-enabled devices; it works in conjunction with the ZDX service entitlement, is on by default, and is available only when ZDX is enabled for the company or selected groups. [zcc.web-privacy.collection:zdx-location]
- interacts-with references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.entitlements: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
- see-also references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group)
- see-also references/_meta/text/zdx/zdx.overview.md (ZDX at a glance: what it measures and which subject answers each question)
