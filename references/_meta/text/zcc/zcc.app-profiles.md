# ZCC app profiles (web policies) (zcc.app-profiles)
Also called: app profile; zcc app profile; web policy; zcc web policy; WebPolicy; client connector profile; app profile rule; application profile; app profiles; application profiles

An app profile is the policy object Client Connector downloads to govern the app itself, as distinct from the cloud policy that inspects traffic. This page walks the area and links the subject for each question. App profiles control whether users must enter an admin-provided password to log out of, disable, exit or uninstall the app; select the forwarding profile for Internet & SaaS and Private Access; and control how the app generates logs and the maximum size of its log files for the Internet & SaaS service. [zcc.app-profiles:controls]

**Per platform, and its API name.** A profile policy rule is added per device platform: Windows, macOS, Linux, iOS and Android each have their own rules. [zcc.app-profiles:per-platform] In the API the object is a web policy: the `/web/policy` operations add or update, enable or disable, and delete "a policy or app profile for the company by platform". [zcc.app-profiles:api-name]

**Questions, in the order they usually come up.**
1. **Which profile does this device get?** Rule order, user and device groups, and the longest-match exception: [Which app profile a device gets: rule order, groups and the longest match](kb:zcc.app-profiles.selection).
2. **Has the change reached the device?** [When an app profile change reaches a device](kb:zcc.app-profiles.propagation).
3. **Where does its traffic go?** The rule names one forwarding profile: [Which forwarding profile a device uses, and when a change reaches it](kb:zcc.forwarding-profiles.assignment).
4. **Why do users see certificate errors?** [Whether Client Connector installs the Zscaler root certificate](kb:zcc.app-profiles.ssl-certificate).
5. **Can users disable, exit or remove the app?** [App profile passwords: logout, disable, exit and uninstall, per platform](kb:zcc.passwords-and-otp.app-profile-passwords).
6. **How much does it log?** [App profile log mode and log file size](kb:zcc.app-profiles.logging).
7. **What happens when the cloud or the tunnel is unreachable?** [App profile failover: disaster recovery, cloud unreachable, captive portals](kb:zcc.app-profiles.failover).
8. **Which applications bypass the tunnel?** The predefined, custom IP-based and process-based applications an app profile can bypass: [Application Bypass: adding custom IP-based and process-based applications for an app profile to bypass](kb:zcc.app-profiles.application-bypass).
9. **What do the remaining settings do?** [What the less common app profile settings do](kb:zcc.app-profiles.advanced-settings).
10. **How do I change one through the API?** [What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate](kb:zcc.api.web-policy-wire), with Python's key handling in [How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper](kb:zcc.sdk-python.wire-keys).

**Configured elsewhere.** Privacy collection is the User Privacy object, [ZCC user privacy (web privacy): what the app collects and exposes](kb:zcc.web-privacy); which users get Private Access and ZDX is service entitlement, [ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group](kb:zcc.entitlements); the acceptable use prompt is [The Client Connector acceptable use policy prompt](kb:zcc.acceptable-use). What a forwarding profile does per network type is in [ZCC forwarding profiles](kb:zcc.forwarding-profiles).

**Finding and copying a profile.** The App Profiles tab's Search field can find an app profile by selecting criteria: Policy Name, Group Name, Policy Token or Location Ruleset. [zcc.app-profiles:search] An app profile can be copied by duplicating an existing profile, so a profile can be tested before it is deployed. The default profile cannot be copied, the copy appears under the profile that was copied, and a maximum of 10 profiles can be copied at the same time. [zcc.app-profiles:copy] What the copy limit counts is open [gap:zcc.app-profiles:copy-limit].

On the Windows, macOS and Linux app profiles, a Custom PAC URL is entered when Client Connector should forward internet traffic to the Zscaler service with exceptions for certain types of traffic. [zcc.app-profiles:custom-pac-url] In the custom PAC file of the Windows app profile's Internet & SaaS disaster recovery options (Policy Based Access, Web only and All Ports), DIRECT allows a destination and BLOCK, or any return value other than DIRECT, blocks it; Zscaler's sample files set var drop = "BLOCK" and allow listed hosts matched with localHostOrDomainIs. [zcc.app-profiles:dr-pac-block] The disaster recovery options themselves are in [App profile failover: disaster recovery, cloud unreachable, captive portals](kb:zcc.app-profiles.failover).

Not known (open gaps):
- What the limit of 10 profiles copied at the same time counts [gap:zcc.app-profiles:copy-limit]: settled by lab-test or source-read

Area: zcc.app-profiles, its subjects in references/_meta/spine/zcc/zcc.app-profiles.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match): The rule order is the order of precedence among a platform's profile rules and helps determine which rule the app downloads for a user at enrollment; precedence is by ascending number. [zcc.app-profiles.selection:ascending-precedence]
- interacts-with references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group): Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.app-profiles.failover.md (App profile failover: disaster recovery, cloud unreachable, captive portals)
- links-to references/_meta/text/zcc/zcc.acceptable-use.md (The Client Connector acceptable use policy prompt)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.app-profiles.advanced-settings.md (What the less common app profile settings do)
- links-to references/_meta/text/zcc/zcc.app-profiles.application-bypass.md (Application Bypass: adding custom IP-based and process-based applications for an app profile to bypass)
- links-to references/_meta/text/zcc/zcc.app-profiles.logging.md (App profile log mode and log file size)
- links-to references/_meta/text/zcc/zcc.app-profiles.propagation.md (When an app profile change reaches a device)
- links-to references/_meta/text/zcc/zcc.app-profiles.ssl-certificate.md (Whether Client Connector installs the Zscaler root certificate)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.assignment.md (Which forwarding profile a device uses, and when a change reaches it)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.app-profile-passwords.md (App profile passwords: logout, disable, exit and uninstall, per platform)
- links-to references/_meta/text/zcc/zcc.sdk-python.wire-keys.md (How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper)
- links-to references/_meta/text/zcc/zcc.web-privacy.md (ZCC user privacy (web privacy): what the app collects and exposes)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zcc/application-profiles.md (config type)
