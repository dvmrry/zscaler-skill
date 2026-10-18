The `zia_activation_status` resource is the provider's explicit activation step, one of the methods compared in [[zia.terraform.activation-methods]]. It is a thin wrapper over the activation call, so what it does and does not do follows from a few lines of code.

**Shape.** {{status-active-only}} {{create-posts-activation}} {{delete-is-noop}}

**When it fires.** {{activates-only-on-create}} The ordering requirement, that every resource to be activated must be listed in `depends_on`, is in [[zia.terraform.activation-methods]].

**Import.** The documentation and the code disagree {{divergence:docs-say-not-importable-code-has-importer}}.
