# The ZPA Terraform provider: where its behavior is described (zpa.terraform)
Also called: zpa terraform; terraform-provider-zpa; zpa terraform provider

This walks the subjects that describe what the ZPA Terraform provider sends, reads and reports. Which API paths and SDK packages each resource uses, and its arguments (type, required or optional, computed, ForceNew, defaults, enum values and validators, nested blocks), are generated from the provider code: run `node scripts/kb.mjs surface <resource name>`; `provider:zpa` gives the provider's own settings.

**Configuring the provider.** Credentials, clouds and rate limits are in [ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits](kb:zpa.terraform.provider-config).

**Policy rules.** The v1 and v2 rule resources and their conditions are in [ZPA Terraform policy rule resources: v1 and v2 conditions, operand types and provider changes](kb:zpa.terraform.policy-rule-resources), what a rule write sends and loses in [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes), and how `rule_order` is applied in [How the ZPA Terraform provider applies policy rule order (BulkReorder)](kb:zpa.terraform.rule-order).

**What reaches the API.** Per-resource constraints are in [Constraints the ZPA Terraform docs and provider code place on individual resources](kb:zpa.terraform.resource-constraints). Fields not sent, not read back or written in several steps are in [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity), application segments and their associations in [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle), enrollment certificate lookup for groups in [How the ZPA Terraform provider resolves the enrollment certificate for connector, service edge and private cloud groups](kb:zpa.terraform.group-enrollment), and deletes with dependents in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths). Data sources are in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection) and [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity).

Area: zpa.terraform, its subjects in references/_meta/spine/zpa/zpa.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.terraform.provider-config.md (ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits): The provider chooses the legacy ZPA client when use_legacy_client is true, from the provider attribute or, when that is unset, from ZSCALER_USE_LEGACY_CLIENT being the string true. [zpa.terraform.provider-config:legacy-client-switch]
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
- links-to references/_meta/text/zpa/zpa.terraform.group-enrollment.md (How the ZPA Terraform provider resolves the enrollment certificate for connector, service edge and private cloud groups)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-resources.md (ZPA Terraform policy rule resources: v1 and v2 conditions, operand types and provider changes)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)
- links-to references/_meta/text/zpa/zpa.terraform.resource-constraints.md (Constraints the ZPA Terraform docs and provider code place on individual resources)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
- links-to references/_meta/text/zpa/zpa.terraform.rule-order.md (How the ZPA Terraform provider applies policy rule order (BulkReorder))
