Bandwidth Control is fully API-manageable; the console is not the only plane. This subject holds names and enums; behavior is in the sibling subjects.

**Operations.** {{class-endpoints}} {{rule-endpoints}}

**Rule fields.** {{min-max-fields}} Those are the console's guaranteed and maximum percentages ([[zia.bandwidth-control.allocation]]). {{rule-scope-fields}} {{protocols-spec}} {{protocols-terraform}} The two protocol lists disagree {{divergence:protocol-vocabulary}}. {{tf-location-caps}} The Help location limit differs {{divergence:locations-per-rule}}. Rule order, state and rank semantics: [[zia.bandwidth-control.rules]]; provider reorder behavior: [[zia.terraform.rule-order.registry]].

**Class typing.** {{class-type-enum}} {{types-match-predefined}} {{file-size-enum}} {{application-values}}

**Terraform.** {{tf-class-resources}} {{tf-wrappers-update-existing}} The Terraform bandwidth control rule resource is documented as OneAPI-only {{tf-rule-oneapi-only}}, and whether the class resources share the restriction is not stated {{gap:tf-classes-oneapi-only}}. Terraform destroy semantics in general: [[zia.terraform.delete-detach]]. The Large Files size field is named differently in the schema and the SDK {{divergence:file-size-field-name}}.
