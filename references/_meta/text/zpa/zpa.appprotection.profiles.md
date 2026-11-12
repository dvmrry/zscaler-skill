# AppProtection profiles: control selection, paranoia level, actions and the default profile (zpa.appprotection.profiles)
Also called: appprotection profile; paranoia level; recommended owasp top 10 profile; default appprotection profile read-only; override controls allow block redirect; cannot edit default profile appprotection; appprotection execution order

A profile is the unit a policy rule applies. A profile determines how traffic is inspected and managed: it selects controls and the action taken for them, and is then added to an AppProtection policy. [zpa.appprotection.profiles:profile-purpose] A profile can select OWASP predefined controls, custom controls, ThreatLabZ controls, WebSocket controls, API controls and Active Directory controls. [zpa.appprotection.profiles:control-mix]

**Default profile.** A default AppProtection profile is included with the setup of a Private Access account. [zpa.appprotection.profiles:default-profile-ships] The default profile is named Recommended OWASP Top 10 Profile in the AppProtection profile table. [zpa.appprotection.profiles:default-profile-name] The default profile cannot be edited or deleted. [zpa.appprotection.profiles:default-profile-readonly] Using the default template selects the recommended OWASP predefined and ThreatLabZ controls automatically, and some controls are excluded from it for higher efficacy. [zpa.appprotection.profiles:default-profile-contents] The default profile is meant as a template for custom profiles, and any existing profile can be copied to create a new one. [zpa.appprotection.profiles:copy-profile] What paranoia level the default profile is set to is open [gap:zpa.appprotection.profiles:default-profile-paranoia], as is whether a policy rule can use it directly [gap:zpa.appprotection.profiles:default-profile-direct-use].

**Always-on controls.** Every profile automatically has some OWASP predefined controls from the Internal Error category enabled, with the action Block, and that action cannot be overridden. [zpa.appprotection.profiles:internal-error-block]

**Paranoia level.** A profile uses a paranoia level for API controls, ThreatLabZ predefined controls, OWASP predefined controls and WebSocket predefined controls. [zpa.appprotection.profiles:paranoia-applies-to] The Predefined Paranoia Level is chosen from 1 to 4, with 1 described as the highest level of concern and 4 as the least. [zpa.appprotection.profiles:paranoia-range] Higher paranoia levels check with a wide net of matches and raise the chance of false positives; lower levels use a precise set of matches and give fewer. [zpa.appprotection.profiles:paranoia-false-positives] Custom controls, HTTP or WebSocket, have a paranoia level of 1. [zpa.appprotection.profiles:custom-paranoia-1] The profile API schema also carries a paranoia level on custom control items [gap:zpa.appprotection.profiles:custom-paranoia-schema]. The log fields that record it are in [Where AppProtection events go: the LSS log type and its fields](kb:zpa.appprotection.logging).

**Execution order.** When a profile mixes custom and predefined controls, Private Access runs API controls first, then ThreatLabZ, then custom, then the other predefined controls (OWASP, Active Directory and WebSocket). [zpa.appprotection.profiles:execution-order]

**Actions and overrides.** A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes] The override actions are Allow, which lets the user proceed to the current URL, Block, which returns a 403 response code, and Redirect, which sends the user to a URL entered in the profile. [zpa.appprotection.profiles:action-choices] A profile subscribed to automatic updates for ThreatLabZ controls can only use Override All Controls. [zpa.appprotection.profiles:override-all-for-auto-updates]

**Versions and updates.** The profile table shows the OWASP_CRS version selected for each profile. [zpa.appprotection.profiles:owasp-version-per-profile] Selecting ThreatLabZ controls offers an Automatically include new control on publish checkbox, and the profile table shows Subscribed to ThreatLabZ as Yes or No. [zpa.appprotection.profiles:threatlabz-subscription]

Controls themselves: [AppProtection controls: kinds, OWASP groups and versions](kb:zpa.appprotection.controls). Using a profile in a rule: [AppProtection policy rules: actions, criteria and operators](kb:zpa.appprotection.policy).

What to check:
1. Which profile the rule uses, and whether it is the read-only default, a copy or a custom profile.
2. The profile's paranoia level and which control kinds it applies to.
3. Which override option is set, and the action each control ends up with.
4. Whether a blocked request matches an always-on Internal Error control that cannot be overridden.

Not known (open gaps):
- Paranoia level of the default Recommended OWASP Top 10 Profile [gap:zpa.appprotection.profiles:default-profile-paranoia] (data gap): filled by operator; settled by tenant-data
- Whether a policy rule can use the default profile directly [gap:zpa.appprotection.profiles:default-profile-direct-use]: settled by lab-test or tenant-data
- Custom controls carry a paranoia level in the profile API schema [gap:zpa.appprotection.profiles:custom-paranoia-schema]: settled by lab-test or support-ticket

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields): The default AppProtection log fields include InspectionPolicy, InspectionProfile, ParanoiaLevel and InspectionControlsHitCount, and the log content can be edited to specific fields with a custom template. [zpa.appprotection.logging:field-set]
- depends-on references/_meta/text/zpa/zpa.appprotection.controls.md (AppProtection controls: kinds, OWASP groups and versions): A profile can select OWASP predefined controls, custom controls, ThreatLabZ controls, WebSocket controls, API controls and Active Directory controls. [zpa.appprotection.profiles:control-mix]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.appprotection.api-surface.md (AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach)
