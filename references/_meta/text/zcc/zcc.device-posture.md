# ZCC device posture profiles (zcc.device-posture)
Also called: zcc device posture; device posture profile; posture profile zcc; device trust level; zia posture profile app profile; posture requirements

Device posture profiles are defined on the Client Connector side and consumed by Private Access policy and Internet & SaaS trust levels. A device posture profile is a set of criteria evaluated on the device, and policies in both Internet & SaaS and Private Access can act on the outcome. [zcc.device-posture:evaluated-on-device]

1. **Where is the profile defined, and who uses it?** One definition serves both products: [Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels.](kb:zpa.posture-profiles.object-model:zcc-defined).
2. **What does each type check?** Pass conditions and version floors: [Device posture check types: what each checks, where it applies, and how it passes](kb:zcc.device-posture.check-types); per platform: [Which device posture types each platform supports](kb:zcc.device-posture.platform-support); Linux certificates: [Setting up the Client Certificate posture check on Linux](kb:zcc.device-posture.linux-client-certificate).
3. **When is it evaluated?** Schedule, immediate types and triggers: [When and how often posture is evaluated](kb:zpa.posture-profiles.evaluation); the pre-login machine tunnel: [Device posture on the ZPA machine tunnel](kb:zpa.machine-tunnels.posture).
4. **Why is it failing?** [Why a device fails posture, and what the user sees](kb:zcc.device-posture.failure-modes). Which devices are failing: [Which devices are failing posture: the Failed Posture Devices page and the dashboard's Device Posture page](kb:zcc.device-posture.failed-devices).

**Private Access.** Access rules refer to a profile through the POSTURE operand: [The POSTURE operand in ZPA policy rules](kb:zpa.posture-profiles.policy-operand).

**Internet & SaaS.** Each app profile rule can apply one: An app profile, on each platform's policy page (Windows, macOS, Linux, iOS and Android), can apply an Internet & SaaS (ZIA) posture profile. [zcc.device-posture:zia-posture-profile] A device's details page shows its Device Trust Level, Low, Medium, High or Unknown, based on the levels configured in Internet & SaaS posture profiles. [zcc.device-posture:trust-level-shown] Whether posture also drives forwarding or app-profile selection is open [gap:zcc.device-posture:posture-and-forwarding].

The cross-product overview has not been converted yet: [Device posture across products: Client Connector evaluates, Private Access and Internet & SaaS consume](kb:shared.device-posture).

What to check:
1. Which product consumes the result in question: a Private Access rule's POSTURE condition, or an Internet & SaaS trust level through the app profile's ZIA posture profile.
2. The device's trust level on its details page when an Internet & SaaS posture question comes up.

Not known (open gaps):
- Whether posture results feed forwarding or app-profile selection [gap:zcc.device-posture:posture-and-forwarding]: settled by support-ticket or tenant-data. Blocks: answering whether a posture change can change a device's app profile or forwarding

Area: zcc.device-posture, its subjects in references/_meta/spine/zcc/zcc.device-posture.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated): Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.evaluation:cadence]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules): In the console each posture profile in a condition set is set to VERIFIED, meaning Zscaler Client Connector verified the device against the profile's criteria, or VERIFICATION FAILED, meaning it was unable to verify the device against them. [zpa.posture-profiles.policy-operand:console-states]
- decided-by references/_meta/text/shared/shared.device-posture.trust-levels.md (Internet & SaaS device trust levels: how posture becomes a policy criterion): An Internet & SaaS posture profile holds an expression for each of High Trust, Medium Trust and Low Trust; Client Connector evaluates the checks of all levels on the device and the highest matching level is used. [shared.device-posture.trust-levels:level-expressions]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)): An app profile, on each platform's policy page (Windows, macOS, Linux, iOS and Android), can apply an Internet & SaaS (ZIA) posture profile. [zcc.device-posture:zia-posture-profile]
- links-to references/_meta/text/shared/shared.device-posture.md (Device posture across products: Client Connector evaluates, Private Access and Internet & SaaS consume)
- links-to references/_meta/text/zcc/zcc.device-posture.check-types.md (Device posture check types: what each checks, where it applies, and how it passes)
- links-to references/_meta/text/zcc/zcc.device-posture.failed-devices.md (Which devices are failing posture: the Failed Posture Devices page and the dashboard's Device Posture page)
- links-to references/_meta/text/zcc/zcc.device-posture.failure-modes.md (Why a device fails posture, and what the user sees)
- links-to references/_meta/text/zcc/zcc.device-posture.linux-client-certificate.md (Setting up the Client Certificate posture check on Linux)
- links-to references/_meta/text/zcc/zcc.device-posture.platform-support.md (Which device posture types each platform supports)
- links-to references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel)
- links-to references/_meta/text/zpa/zpa.posture-profiles.object-model.md (The ZPA posture profile object and where it comes from)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zcc/zcc.api.v2-wire.md (The ZCC v2 API: RESTful paths, offset paging and the list envelope)
- configured-via references/_meta/text/types/zcc/application-profiles.md (config type)
- see-also references/_meta/text/zpa/zpa.posture-profiles.md (ZPA posture profiles)
