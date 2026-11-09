# When the ZIA Terraform provider activates configuration (zia.terraform.activation)
Also called: terraform activation zia; ZIA_ACTIVATION; changes went live without activation; unexpected activation; auth settings urls activation

ZIA stages configuration until it is activated, and the Terraform provider decides when to activate. The ZIA provider gates its in-flight activation after a write on the `ZIA_ACTIVATION` environment variable: `shouldActivate()` returns false unless the variable is set and parses as true, and ZIA saves the changes a write makes in a pending state. Update in `zia_auth_settings_urls` activates without this check. [zia.terraform.activation:activation-env-gate] The provider activates by posting an activation whose only field is a status of `ACTIVE`; the request names no particular change. [zia.terraform.activation:activation-call-selects-nothing] So a provider activation publishes pending ZIA configuration, not only the change Terraform just wrote. The sources do not say whether pending changes are per admin or tenant-wide. [zia.terraform.activation:activation-is-tenant-wide]

**The auth settings URLs resource.** In `zia_auth_settings_urls`, create calls `triggerActivation` inside `if shouldActivate() {`, the helper that reads `ZIA_ACTIVATION`; update calls `triggerActivation` straight after `user_authentication_settings.Update` returns without an error. [zia.terraform.activation:auth-settings-update-unconditional] So an update of `zia_auth_settings_urls` activates whether or not `ZIA_ACTIVATION` is set, while its create activates only when the variable parses as true. [zia.terraform.activation:auth-settings-update-activates-ungated] Every other implicit activation (`triggerActivation` after a write) is guarded by `ZIA_ACTIVATION`: 220 guarded calls at v4.8.3 and 223 at the pin, with this update the only unguarded one at both. The explicit `zia_activation_status` resource activates unconditionally by design. [zia.terraform.activation:only-unguarded-call] Updating `zia_auth_settings_urls` therefore publishes pending ZIA changes beyond its own, even when `ZIA_ACTIVATION` is unset and the operator expects changes to stay staged. [zia.terraform.activation:update-publishes-unrelated-changes]

What to check:
1. Whether a plan updated `zia_auth_settings_urls` when changes went live that nobody activated, before suspecting the platform.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.activation:activation-is-tenant-wide] Tier B: Inferred from the request having no change selection and from ZIA requiring an explicit activation for configuration changes.
- [zia.terraform.activation:auth-settings-update-activates-ungated] Tier B: Read from the whole update function, which has no shouldActivate call before triggerActivation, and from triggerActivation, which posts the activation without reading the variable; the provider does not state it.
- [zia.terraform.activation:only-unguarded-call] Tier B: Counted by scanning every resource file at v4.8.3 and HEAD for triggerActivation calls preceded within five lines by shouldActivate(); counts cannot be quoted.
- [zia.terraform.activation:update-publishes-unrelated-changes] Tier B: Chain of evidence: the update path activates unconditionally, and activation publishes every pending change in the tenant (the claims derived from). Not observed on a tenant.

Not known (open gaps):
- Whether a ZIA activation publishes only the caller's pending changes or every admin's [gap:zia.terraform.activation:activation-scope]: settled by lab-test or support-ticket. Blocks: saying whether an implicit activation can publish another admin's staged work

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating): The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status. [zia.api.activation:saved-not-live]
