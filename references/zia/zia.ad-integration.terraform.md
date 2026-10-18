Terraform's coverage of authentication is narrow. {{provider-surface}}

The exempted-URL list resource has its own write-order and no-op-delete traps, recorded in [[zia.authentication.exemptions]]; user enrollment of authentication methods is a separate call that can fail silently, recorded in [[zia.terraform.multi-step-writes]]. The org settings object that Terraform does not manage is described in [[zia.authentication.settings]].
