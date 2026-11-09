# Mobile App Store Control: browse-but-not-download rules, default, criteria, limits and the recommended rule (zia.mobile-security.app-store-control)
Also called: Mobile App Store Control policy; app store blocking; Application Download; Not allowed the use of this Mobile App Store

The Mobile App Store Control policy protects users from inadvertently downloading mobile apps from unauthorized or risky app stores: when an app store is listed in the policy, users can browse the restricted app stores but are blocked from downloading apps from those stores. [zia.mobile-security.app-store-control:purpose-browse-not-download] When no policy is configured, the default action is to allow app downloads from all app stores. [zia.mobile-security.app-store-control:default-allow]

**Rules.** A rule's action is Allow or Block of application downloads from the app store; if an app store is blocked, users can browse it but are blocked from downloading apps from it. [zia.mobile-security.app-store-control:rule-action] A rule's App Stores criterion is Any or the app stores to block, Locations and Location Groups each take Any or up to 32, and Time Windows take Always or up to two. The page says to contact Zscaler Support to increase the limit of Users, Groups, Departments or Locations, and that any rule applying to unauthenticated traffic must apply to all Groups and Departments. [zia.mobile-security.app-store-control:criteria-and-limits] The time-window cap differs from the limits table [zia.time-intervals.limits:per-rule-cap](kb:zia.time-intervals.limits:per-rule-cap). The rule name is system-generated, editable and cannot exceed 63 characters, and the description cannot exceed 10,240 characters. Admin Rank is 0 to 7 (0 is the highest) and appears if Admin Rank is enabled on the Advanced Settings page; admin ranking is disabled by default and is enabled in Internet Access > Setting > Advanced Settings. A new rule's status is Disabled by default and it must be enabled to be enforced; disabled rules can have a rule order, and during evaluation the service skips them and moves to the successive ones. [zia.mobile-security.app-store-control:rule-details]

**The policy page.** The Mobile App Store Control page can display rules by Rule State, either Enabled or Disabled. Its columns include Admin Rank, visible only if admin ranking is enabled in the Advanced Settings, App Stores and Time Windows, and a policy rule can be duplicated. [zia.mobile-security.app-store-control:policy-page]

**Recommended rule.** Zscaler's recommended Mobile App Store Control rule has Admin Rank 1, Rule Status Enabled, App Stores Any, Time Windows Always and Application Download Allow. [zia.mobile-security.app-store-control:recommended-policy]

Which app stores a rule can select is open [gap:zia.mobile-security.app-store-control:app-store-list]. Whether the policy has an API, SDK or Terraform surface is open [gap:zia.mobile-security.app-store-control:api-surface]. The sibling policy is in [Mobile Malware Protection: the two security and six privacy actions, defaults, how it works and the recommended policy](kb:zia.mobile-security.malware-protection).

What to check:
1. Whether the app store is listed in an enabled rule, since with no policy configured the default allows app downloads from all app stores.

Not known (open gaps):
- Which app stores a Mobile App Store Control rule can select [gap:zia.mobile-security.app-store-control:app-store-list]: settled by tenant-data or source-read
- API, SDK and Terraform surface of Mobile App Store Control [gap:zia.mobile-security.app-store-control:api-surface]: settled by source-read

Area: zia.mobile-security, its subjects in references/_meta/spine/zia/zia.mobile-security.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.mobile-security.malware-protection.md (Mobile Malware Protection: the two security and six privacy actions, defaults, how it works and the recommended policy)
- links-to references/_meta/text/zia/zia.time-intervals.limits.md (Time interval limits: object cap, per-rule cap and name characters)
