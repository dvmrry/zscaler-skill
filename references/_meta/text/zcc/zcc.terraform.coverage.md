# What the ZCC Terraform provider covers, and what it leaves to the console (zcc.terraform.coverage)
Also called: zcc terraform missing resource; zcc terraform aup; zcc terraform app profile; zcc terraform entitlements; zcc provider api parity; zcc_notification_template scope

The list of resources and data sources is generated: run `node scripts/kb.mjs surface zcc` and read the `terraform` entries. This subject holds why some configuration has no resource and what the notification resource does and does not manage.

**Public API only.** The provider documentation says it keeps parity with the publicly available API endpoints and implements only what that API exposes, so a setting available in the console but not through the API cannot be in the provider. [zcc.terraform.coverage:api-parity] The ZCC Terraform provider registers no resource or data source for app profiles or web policies: the per-OS app profile resources and the application profiles data source are intentionally deregistered. [zcc.terraform.coverage:no-terraform-resource] The ZCC Terraform provider registers no resource or data source for entitlements. [zcc.terraform.coverage:no-entitlement-resource] The web policy API itself is [What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate](kb:zcc.api.web-policy-wire).

**Notification templates.** `zcc_notification_template` manages a notification template through `/zcc/papi/public/v2/notification-templates`: which end-user notifications Client Connector raises (application updates, service-status changes, ZIA firewall, DNS and IPS blocks, ZPA reauthentication prompts and posture-failure messages). The per-service toggles are the single nested attributes `zia_notification_template` and `zpa_notification_template`, written `zia_notification_template = { ... }`; the documentation calls them nested blocks while its own example uses `=`. [zcc.terraform.coverage:notification-template-scope] The acceptable use policy is a separate setting, described in [The Client Connector acceptable use policy prompt](kb:zcc.acceptable-use), and the generated resource list (`node scripts/kb.mjs surface zcc`) has no AUP resource.

What to check:
1. Whether the setting is exposed by the public API at all before looking for a provider resource for it.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.terraform.coverage:no-entitlement-resource] Tier B: Moved from zcc.entitlements.api:no-terraform-resource (renamed: the ID collides with the app profile claim here). Absence: the provider's resource and data source registrations were searched at the pin for entitlement; none found.

Area: zcc.terraform, its subjects in references/_meta/spine/zcc/zcc.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.acceptable-use.md (The Client Connector acceptable use policy prompt)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings)
- see-also references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
