# AppProtection and the older Inspection names (zpa.appprotection.naming)
Also called: zpa inspection profile; inspection policy appprotection; zpa_inspection terraform appprotection; InspectionControllerAPI; zpn_inspection_profile_id; is inspection the same as appprotection

The console and help say AppProtection, while the SDKs, API paths and Terraform resources still say Inspection.

**SDK.** In the Python SDK, client.zpa.app_protection returns an InspectionControllerAPI, and its docstring calls it the ZPA Inspection interface. [zpa.appprotection.naming:property-vs-class]

**API.** The management API serves AppProtection profiles under inspectionProfile and AppProtection controls under inspectionControls. [zpa.appprotection.naming:api-path-names] The inspectionProfile request schema describes its objects as AppProtection profiles and AppProtection controls. [zpa.appprotection.naming:schema-says-appprotection]

**Terraform and Go.** The Terraform provider registers AppProtection profiles and custom controls as zpa_inspection_profile and zpa_inspection_custom_controls. [zpa.appprotection.naming:terraform-names] The Go SDK keeps the inspection name in its package layout: inspection_profile, under services/inspectioncontrol. [zpa.appprotection.naming:go-package-names] Provider and SDK defects for these objects are in [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle) and [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

**Reading them as one product.** The objects named Inspection in the SDK, API and Terraform are the AppProtection profiles and controls of the console. [zpa.appprotection.naming:same-product]

What to check:
1. Which name the object in front of you uses, and map it: SDK class and API path say inspection, console and help say AppProtection.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.appprotection.naming:same-product] Tier B: Inferred from the API schema describing inspectionProfile objects as AppProtection profiles. No captured source states a rename or its date, or that every Inspection-named object is AppProtection.

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.appprotection.entitlement.md (Which AppProtection capabilities depend on the subscription), from zpa.appprotection: Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields), from zpa.appprotection: A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile), from zpa.appprotection: A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
