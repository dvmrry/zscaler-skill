# ZPA posture profiles (zpa.posture-profiles)
Also called: posture profiles; zpa posture profile; device posture in zpa policy; client connector posture profile; posture_udid; posture profile object

"Why does a posture rule match, or not, for this device?" takes four questions in order.

1. **What is the object, and where is it defined?** Origin, fields and name handling: [The ZPA posture profile object and where it comes from](kb:zpa.posture-profiles.object-model).
2. **How does the rule refer to it?** The POSTURE operand, its identifier and values, and provider checks: [The POSTURE operand in ZPA policy rules](kb:zpa.posture-profiles.policy-operand).
3. **How current is the result?** Evaluation schedule, triggers and existing connections: [When and how often posture is evaluated](kb:zpa.posture-profiles.evaluation).
4. **What do the API and tooling show?** Endpoints, SDKs and the data source: [The posture profile API, SDK and Terraform data source](kb:zpa.posture-profiles.api-surface).

The posture check types and their platform support are defined on the Client Connector side, and the pre-login subsets are in [Device posture on the ZPA machine tunnel](kb:zpa.machine-tunnels.posture). Chrome posture profiles for the Chrome Enterprise browser: [Chrome posture profiles and the Chrome Enterprise Browser connector settings](kb:zpa.posture-profiles.chrome).

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles): Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined]
- links-to references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel)
- links-to references/_meta/text/zpa/zpa.posture-profiles.api-surface.md (The posture profile API, SDK and Terraform data source)
- links-to references/_meta/text/zpa/zpa.posture-profiles.chrome.md (Chrome posture profiles and the Chrome Enterprise Browser connector settings)
- links-to references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated)
- links-to references/_meta/text/zpa/zpa.posture-profiles.object-model.md (The ZPA posture profile object and where it comes from)
- links-to references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/posture-profiles.md (config type)
