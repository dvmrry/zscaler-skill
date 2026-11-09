# ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group (zcc.entitlements)
Also called: zcc entitlements; service entitlement; client connector entitlement; zpa entitlement; zdx entitlement; zpa not enabled for user; zdx no data for user; why isn't zpa working for this user

Entitlement decides whether the app enrolls a user or device into a service at all; the service's own policy decides what happens after. Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated] The entitlement page can also enable ZIA for device groups. [zcc.entitlements:zia-device-groups] If the Service Entitlement page is missing from the menu, the organization may not have the subscriptions for it. [zcc.entitlements:needs-subscription]

**Internet & SaaS for device groups.** Enabling Internet & SaaS for device groups needs Client Connector 3.9 or later and Zscaler Support to enable the feature; it needs ZIA Enabled by Default disabled, since if that setting is enabled Internet & SaaS is available for all users and cannot be assigned to a device group. The groups are defined in the Device Groups section of the Admin Console. [zcc.entitlements:zia-device-groups-config] Logout Zscaler Client Connector when ZIA Entitlement is Enabled automatically logs users out of Client Connector when Internet & SaaS is enabled for a device group, and users can then log in again to enable the Internet & SaaS service; the page says it applies to customers using Private Access only or Private Access and Deception, and that when it is disabled the app runs without the Internet & SaaS service until the next login. [zcc.entitlements:zia-logout-option]

**When a change lands.** An entitlement change reaches devices the next time they connect; connected devices update automatically within 60 minutes, or when the user clicks Update Policy, after which the user must reauthenticate. [zcc.entitlements:update-timing] Whether a de-entitled user's active Private Access session drops at that update or stays up until the next login is open [gap:zcc.entitlements:active-session-on-removal].

**Per service.** Private Access, including the machine tunnel switch: [Private Access entitlement and the machine tunnel switch](kb:zcc.entitlements.zpa). Digital Experience: [Digital Experience (ZDX) entitlement](kb:zcc.entitlements.zdx). Deception: [Deception entitlement: the Client Connector integration, the enabled-by-default switch, user and device groups, the logout option and update timing](kb:zcc.entitlements.deception). The device groups they can be assigned to: [Device groups: posture-based groups of devices for service entitlement, their limits, expressions and the mobile switch](kb:zcc.entitlements.device-groups). Reading and writing entitlements through the API: [ZCC entitlement calls: response and update body shapes](kb:zcc.api.entitlements-wire); through the Python SDK: [The Python SDK's ZCC entitlement methods: what they read and why they cannot write](kb:zcc.sdk-python.entitlements). Terraform has no entitlement resource: [The ZCC Terraform provider registers no resource or data source for entitlements.](kb:zcc.terraform.coverage:no-entitlement-resource).

**After entitlement.** An entitled user still reaches a private application only through the app profile's forwarding profile, [Which forwarding profile a device uses, and when a change reaches it](kb:zcc.forwarding-profiles.assignment), and a matching access rule, since [If no access policy rule matches, or no rule is defined at all, access to the application is implicitly set to Block Access.](kb:zpa.policy.evaluation-order:default-access-block). What a user who is not entitled looks like in logs is open [gap:zcc.entitlements:not-entitled-signals].

What to check:
1. Whether the user, or the user and the device, is entitled to the service, from the entitlement settings for that service.
2. Whether the device has picked up the entitlement change: next connect, within 60 minutes if connected, or after Update Policy and reauthentication.
3. For Internet & SaaS assigned by device group, whether ZIA Enabled by Default is disabled and the client is 3.9 or later.
4. For Private Access, then the forwarding profile on the user's app profile, then the access policy.

Not known (open gaps):
- Whether removing Private Access entitlement ends an active session [gap:zcc.entitlements:active-session-on-removal]: settled by lab-test. Blocks: telling an admin how fast removing a user's Private Access takes effect
- What a user who is not entitled to Private Access looks like in logs [gap:zcc.entitlements:not-entitled-signals]: settled by lab-test or tenant-data. Blocks: telling an unentitled user from a denied one by their logs

Area: zcc.entitlements, its subjects in references/_meta/spine/zcc/zcc.entitlements.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)): Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
- links-to references/_meta/text/zcc/zcc.entitlements.deception.md (Deception entitlement: the Client Connector integration, the enabled-by-default switch, user and device groups, the logout option and update timing)
- links-to references/_meta/text/zcc/zcc.entitlements.device-groups.md (Device groups: posture-based groups of devices for service entitlement, their limits, expressions and the mobile switch)
- links-to references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement)
- links-to references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.assignment.md (Which forwarding profile a device uses, and when a change reaches it)
- links-to references/_meta/text/zcc/zcc.sdk-python.entitlements.md (The Python SDK's ZCC entitlement methods: what they read and why they cannot write)
- links-to references/_meta/text/zcc/zcc.terraform.coverage.md (What the ZCC Terraform provider covers, and what it leaves to the console)
- links-to references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types)
