# The zia_activation_status resource: when it activates and what it cannot do (zia.terraform.activation-resource)
Also called: zia_activation_status; activation resource terraform; activation not triggered second apply; import zia_activation_status; depends_on activation

The `zia_activation_status` resource is the provider's explicit activation step, one of the methods compared in [Activating ZIA changes from Terraform: methods, session end and concurrent applies](kb:zia.terraform.activation-methods). It is a thin wrapper over the activation call, so what it does and does not do follows from a few lines of code.

**Shape.** The `zia_activation_status` resource has one required attribute, `status`, whose only accepted value is ACTIVE; changing it forces a new resource, and the resource defines create, read and delete but no update. [zia.terraform.activation-resource:status-active-only] Create posts an activation request with the configured status, sets the resource ID to the fixed string "activation", and then reads the activation status back. [zia.terraform.activation-resource:create-posts-activation] Delete does nothing: the code comments that an activation cannot be deleted and returns without calling ZIA. [zia.terraform.activation-resource:delete-is-noop]

**When it fires.** So the activation call is made on create or replacement; the resource defines no update, but a refreshed status other than ACTIVE would plan a replacement. [zia.terraform.activation-resource:activates-only-on-create] The ordering requirement, that every resource to be activated must be listed in `depends_on`, is in [Activating ZIA changes from Terraform: methods, session end and concurrent applies](kb:zia.terraform.activation-methods).

**Import.** The documentation and the code disagree [divergence:zia.terraform.activation-resource:docs-say-not-importable-code-has-importer].

What to check:
1. Whether the activation resource was already in state when a later apply changed other resources, since it only activates when created or replaced.
2. Whether the apply used the activation resource at all, or the environment variable or the out-of-band activator.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.activation-resource:activates-only-on-create] Tier B: Inferred from the resource having no update function, one force-new attribute with a single valid value, and the activation call living only in Create. Not stated in the provider documentation or confirmed on a tenant. Read refreshes `status` from ZIA; a non-ACTIVE refreshed value would diff against the ForceNew `status` and plan a replacement.

Sources disagree (name both sides):
- Whether `zia_activation_status` can be imported. [divergence:zia.terraform.activation-resource:docs-say-not-importable-code-has-importer]
  - tf-zia: The provider documentation says the activation resource is not importable.
  - tf-zia: The resource definition registers an importer, an empty one with no import function.
  Impact: The documentation tells an agent not to import it, while the code does not reject an import command at the schema level. What an import would store is not shown by the sources, so do not rely on importing this resource.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
