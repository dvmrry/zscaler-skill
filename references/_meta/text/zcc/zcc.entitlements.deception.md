# Deception entitlement: the Client Connector integration, the enabled-by-default switch, user and device groups, the logout option and update timing (zcc.entitlements.deception)
Also called: Zscaler Deception Enabled by Default; enable deception for a group of users; enable deception for device groups; Logout Zscaler Client Connector when Zscaler Deception Entitlement is Enabled; deception entitlement; Zscaler Deception Service Status window

Integrating Client Connector with Zscaler Deception enhances Client Connector's ability to manage the Deception process on endpoints; the Admin Console receives Deception configuration updates automatically, Sync updates them manually, and a password can be required to disable Deception. [zcc.entitlements.deception:integration] The per-device Deception Settings password is in [One-time passwords for an enrolled device](kb:zcc.passwords-and-otp.otp). What the disable password and Sync do is open [gap:zcc.entitlements.deception:password-and-sync].

**Requirements.** Enabling Deception for a select group of users or for device groups needs Client Connector 3.9 or later for Windows. [zcc.entitlements.deception:windows-3-9] Other platforms are not described [gap:zcc.entitlements.deception:other-platforms].

**Who gets Deception.** Deception is assigned to a group of users or to device groups only with Zscaler Deception Enabled by Default disabled; if it is enabled, Deception is available for all users and cannot be assigned to a group or a device group. [zcc.entitlements.deception:default-switch] With Zscaler Deception Enabled by Default enabled, Deception is enabled for all users; disabled with no groups specified, it is disabled for users; disabled with groups specified, it is enabled only for the specified groups. [zcc.entitlements.deception:configurations] By default no groups are selected, which indicates that no groups have access to Deception and allows users to keep their current settings; if groups do not appear, the page says to ensure they are synced between Internet & SaaS and Client Connector. [zcc.entitlements.deception:groups-default] Groups are synced as in [The directory groups configured in Internet & SaaS are automatically available for selection when configuring an app profile, and Client Connector's groups sync with the Internet & SaaS groups every three hours. The next sync time (Next Directory Group Sync Time) and a manual Sync Groups are under Infrastructure > Advanced Settings > Custom Root Cert.](kb:zcc.app-profiles.selection:group-sync).

**Device groups.** Configuring Deception for device groups assigns entitlements and policy settings based on ownership through device posture profiles; the vendor's example enrolls a personal device in Deception and an employer-provided device in Deception and Private Access. [zcc.entitlements.deception:device-groups] The groups themselves are defined in [Device groups: posture-based groups of devices for service entitlement, their limits, expressions and the mobile switch](kb:zcc.entitlements.device-groups).

**Logging users out.** On the Deception for device groups page, Logout Zscaler Client Connector when Zscaler Deception Entitlement is Enabled automatically logs users out of Client Connector when Deception is enabled for a device group, and users can then log in again to enable the Deception service. [zcc.entitlements.deception:logout-option] The two Deception pages give the option different scopes [divergence:zcc.entitlements.deception:logout-scope] and name different services as missing when it is off [divergence:zcc.entitlements.deception:logout-off-service]. The ZDX page has the same option for ZDX: [Logout Zscaler Client Connector when ZDX Entitlement is Enabled logs users out when ZDX is enabled for their device group, so that logging back in starts ZDX; it applies to customers using ZPA only or ZPA with Deception. With it off, the app runs without ZDX until the next login.](kb:zcc.entitlements.zdx:logout-on-enable).

**When a change lands.** On the Deception for user groups page, users' devices are updated the next time they connect and, if already connected, automatically in 60 minutes; users can instead click Update Policy from the More window, after which they must reauthenticate in the Zscaler Deception Service Status window. [zcc.entitlements.deception:update-timing] The two Deception pages name different places for the reauthentication [divergence:zcc.entitlements.deception:reauth-place].

What to check:
1. Whether Zscaler Deception Enabled by Default is on; if it is, groups cannot be used, otherwise whether the user's group or device group is selected.
2. Whether the client is Windows 3.9 or later before expecting group-based Deception.
3. Before telling an admin whom the logout option applies to, which service runs without it, or where users reauthenticate, the divergences rather than either Deception page alone.

Sources disagree (name both sides):
- The two Deception entitlement pages give the logout option different scopes: the device groups page says it applies to customers using Private Access only, the user groups page to customers using Private Access only or Private Access and Deception. [divergence:zcc.entitlements.deception:logout-scope]
  - zscaler-help: Deception for device groups: the option applies to customers using Private Access only.
  - zscaler-help: Deception for user groups: the option applies to customers using Private Access only or Private Access and Deception.
  Impact: Whether a customer using Private Access and Deception is covered by the logout option depends on which page is read.
- With the logout option off, the device groups page says Client Connector runs without the Deception service until the next login, while the user groups page names the Digital Experience service. [divergence:zcc.entitlements.deception:logout-off-service]
  - zscaler-help: Deception for device groups: without the option, the app runs without the Deception service until the next login.
  - zscaler-help: Deception for user groups: without the option, the app runs without the Digital Experience service until the next login.
  Impact: The user groups page names Digital Experience in a Deception article, so the service that stays off until the next login is not settled by the pages; the ZDX page has the same sentence for ZDX.
- After Update Policy for a Deception change, the user groups page has users reauthenticate in the Zscaler Deception Service Status window and the device groups page on the Private Access page. [divergence:zcc.entitlements.deception:reauth-place]
  - zscaler-help: Deception for user groups: users reauthenticate in the Zscaler Deception Service Status window.
  - zscaler-help: Deception for device groups: users reauthenticate on the Private Access page.
  Impact: Which window a user reauthenticates in after refreshing the policy is not settled by the pages: each names a different place, and neither says the two differ in the product.

Not known (open gaps):
- Where the Deception disable password is configured and what Sync pulls [gap:zcc.entitlements.deception:password-and-sync]: settled by source-read
- Deception entitlement on platforms other than Windows [gap:zcc.entitlements.deception:other-platforms]: settled by source-read or lab-test

Area: zcc.entitlements, its subjects in references/_meta/spine/zcc/zcc.entitlements.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.entitlements: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match)
- links-to references/_meta/text/zcc/zcc.entitlements.device-groups.md (Device groups: posture-based groups of devices for service entitlement, their limits, expressions and the mobile switch)
- links-to references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.otp.md (One-time passwords for an enrolled device)
