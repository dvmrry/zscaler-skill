Authentication and provisioning are mostly console or API work, with two exceptions. {{provider-surface}}

The exempted-URL list resource has its own write-order and no-op-delete traps, recorded in [[zia.authentication.exemptions]]; user enrollment of authentication methods is a separate call that can fail silently, recorded in [[zia.terraform.multi-step-writes]]. The org settings object that Terraform does not manage is described in [[zia.authentication.settings]].

What to check: whether a drift report on authentication mode can come from Terraform at all (it cannot), and which of the two resources a configuration actually uses.
