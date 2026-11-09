# Which app profile a device gets: rule order, groups and the longest match (zcc.app-profiles.selection)
Also called: app profile rule order; which app profile applies; app profile precedence; wrong app profile; app profile device group; default app profile; web policy rule order
Former IDs: zcc-07

Each platform has its own list of profile rules, and a device receives one of them. When a user enrolls, the app uses the order of precedence and the user's identity to download an app profile with the appropriate policy rule. [zcc.app-profiles.selection:enrollment-download] The rule order is the order of precedence among a platform's profile rules and helps determine which rule the app downloads for a user at enrollment; precedence is by ascending number. [zcc.app-profiles.selection:ascending-precedence] The vendor's example walks the rules in order: the app checks whether rule 1 applies to the user, moves on to rule 2 and, finding that it applies, downloads that rule's profile. [zcc.app-profiles.selection:first-applicable]

**Disabled rules.** A rule whose status is Disabled is not enforced. [zcc.app-profiles.selection:disabled-not-enforced]

**The exception to rule order.** If a user's group is assigned to two profiles and one of them also names a device group, the app applies the profile matching both the user group and the device group, because the longest match has priority, regardless of rule order. [zcc.app-profiles.selection:longest-match]

**Who a rule names.** A rule names selected user groups (with no limit on how many) or all groups; newly added groups are selected automatically and must be cleared to exclude them. Groups are synced from Internet & SaaS and may not appear if it is not enabled and configured. [zcc.app-profiles.selection:user-groups] The Python SDK documents `group_all` as 0 or 1: whether the policy applies to all groups. [zcc.app-profiles.selection:group-all-docstring] The API document says all device groups instead: [zcc.api.web-policy-wire:group-all-scope](kb:zcc.api.web-policy-wire:group-all-scope). The directory groups configured in Internet & SaaS are automatically available for selection when configuring an app profile, and Client Connector's groups sync with the Internet & SaaS groups every three hours. The next sync time (Next Directory Group Sync Time) and a manual Sync Groups are under Infrastructure > Advanced Settings > Custom Root Cert. [zcc.app-profiles.selection:group-sync] A rule can also name specific users, up to 50; none are selected by default. [zcc.app-profiles.selection:users-limit] A rule can name device groups; on mobile they require Client Connector 4.5 or later for iOS and 3.7 or later for Android. [zcc.app-profiles.selection:device-group-versions] A rule can be saved with no user or user group, to create it before applying it. [zcc.app-profiles.selection:unassigned-rule] Whether `groupAll` makes a populated group list irrelevant, and whether a disabled device-group switch ignores its list, is open [gap:zcc.app-profiles.selection:group-flags].

**Names on the edit body.** Besides the ID lists, the API document's web policy edit body has string-array name lists: `userNames`, `groupNames`, `deviceGroupNames`, `appIdentityNames` and `appServiceNames`. It does not describe them. [zcc.app-profiles.selection:name-lists]

**The default policy.** Each platform's App Profiles page shows a default policy alongside the configured rules. [zcc.app-profiles.selection:default-policy-page] When a device receives it, and how it appears in the API, is open [gap:zcc.app-profiles.selection:default-policy].

Whether the rule order numbers must be contiguous is open [gap:zcc.app-profiles.selection:rule-order-contiguity].

A device keeps the profile it downloaded until it downloads again: [When an app profile change reaches a device](kb:zcc.app-profiles.propagation).

What to check:
1. List the enabled rules for the device's platform that name the user, one of the user's groups, or all groups.
2. If one of those rules also names the device's device group, it wins over a lower-numbered rule that matches the user group only.
3. Otherwise the applicable rule with the lowest rule order applies.
4. If no rule applies, the platform's default policy; how that is chosen is open.

Not known (open gaps):
- When the default app profile applies, and where it lives in the API [gap:zcc.app-profiles.selection:default-policy]: settled by tenant-data or lab-test. Blocks: answers about which settings an unmatched user or device gets
- Whether groupAll and a disabled device-group switch override populated lists [gap:zcc.app-profiles.selection:group-flags]: settled by lab-test or tenant-data. Blocks: audits that flag a rule's group list as dormant
- Whether app profile rule order must be contiguous [gap:zcc.app-profiles.selection:rule-order-contiguity]: settled by lab-test. Blocks: scripts that insert a rule at a chosen position

Area: zcc.app-profiles, its subjects in references/_meta/spine/zcc/zcc.app-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group), from zcc.app-profiles: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.app-profiles.propagation.md (When an app profile change reaches a device)
