# AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach (zpa.appprotection.api-surface)
Also called: app_protection python sdk; predefined_controls_version OWASP_CRS 3.3.0; list_predef_controls version required; list_predef_control_adp; ADP_PREDEFINED; associateAllPredefinedControls; inspectionControls api
Former IDs: zpa-09

The profile and control calls are the programmable form of [AppProtection profiles: control selection, paranoia level, actions and the default profile](kb:zpa.appprotection.profiles) and [AppProtection controls: kinds, OWASP groups and versions](kb:zpa.appprotection.controls). Names in the SDK and API follow [AppProtection and the older Inspection names](kb:zpa.appprotection.naming).

**Versions.** In the Python SDK, add_profile and update_profile default predefined_controls_version to OWASP_CRS/3.3.0, and profile_control_attach defaults its version to OWASP_CRS/3.3.0. [zpa.appprotection.api-surface:sdk-default-version] list_predef_controls requires a version in query_params and accepts OWASP_CRS/4.8.0, OWASP_CRS/3.3.5 and OWASP_CRS/3.3.0. [zpa.appprotection.api-surface:supported-versions] The console default differs [divergence:zpa.appprotection.api-surface:sdk-default-vs-console].

**Active Directory controls.** list_predef_control_adp calls inspectionControls/predefined/adp, which the API names Get Predefined Ad Controls and describes as returning the predefined ADP inspection controls. [zpa.appprotection.api-surface:adp-endpoint] The control types in an AppProtection profile include ADP_PREDEFINED alongside API_PREDEFINED, PREDEFINED, THREATLABZ, CUSTOM and the two WebSocket types. [zpa.appprotection.api-surface:adp-control-type]

**Attach and detach.** Attaching all predefined controls to a profile is a PUT to associateAllPredefinedControls and detaching is a PUT to deAssociateAllPredefinedControls, and the Python profile_control_attach chooses between them by its action. [zpa.appprotection.api-surface:attach-detach]

**Valid values.** The API serves the control action types, severity types and control types from actionTypes, severityTypes and controlTypes endpoints. [zpa.appprotection.api-surface:enum-endpoints] The API action enum for controls is PASS, BLOCK, REDIRECT and ALLOW. [zpa.appprotection.api-surface:action-enum]

**Go.** The Go SDK has an applicationsegmentinspection package for inspection application segments. [zpa.appprotection.api-surface:go-segment-package] Go SDK and Terraform defects are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects) and [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle). The per-segment switch through the SDK is in [Enabling AppProtection on an application segment](kb:zpa.appprotection.segment-opt-in).

What to check:
1. The predefined_controls_version the profile call sends, since the Python SDK default is not the console default.
2. Whether the Active Directory controls are reached through the adp endpoint and the ADP_PREDEFINED control type.
3. Which attach or detach endpoint matches the intended direction.

Sources disagree (name both sides):
- The Python SDK defaults a new profile to OWASP_CRS/3.3.0 while the console shows OWASP_CRS/4.8.0 by default. [divergence:zpa.appprotection.api-surface:sdk-default-vs-console]
  - sdk-python: add_profile uses OWASP_CRS/3.3.0 unless predefined_controls_version is passed.
  - zscaler-help: The OWASP predefined controls page is on OWASP_CRS/4.8.0 by default.
  Impact: A profile created through the Python SDK without an explicit version selects the 3.3.0 predefined controls, so it can differ from one created in the console. Pass predefined_controls_version explicitly.

Not known (open gaps):
- Whether an API_PREDEFINED control can be attached to an inspection profile from Terraform [gap:zpa.appprotection.api-surface:profile-api-predefined]: settled by lab-test

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile), from zpa.appprotection: A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields), from zpa.appprotection: A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.controls.md (AppProtection controls: kinds, OWASP groups and versions)
- links-to references/_meta/text/zpa/zpa.appprotection.naming.md (AppProtection and the older Inspection names)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.appprotection.active-directory.md (Active Directory controls: Kerberos, SMB and LDAP inspection)
