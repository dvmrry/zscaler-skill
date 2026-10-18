Bandwidth Control is fully API-manageable; the console is not the only plane. This subject holds names and enums; behavior is in the sibling subjects.

**Operations.** {{class-endpoints}} {{rule-endpoints}}

**Rule fields.** {{min-max-fields}} Those are the console's guaranteed and maximum percentages ([[zia.bandwidth-control.allocation]]). {{rule-scope-fields}} {{protocols-spec}} {{protocols-terraform}} The two lists disagree; see the protocol-vocabulary divergence. {{tf-location-caps}} The Help limit differs; see the locations-per-rule divergence. Rule order, state and rank semantics: [[zia.bandwidth-control.rules]]; provider reorder behavior: [[zia.terraform.rule-order.registry]].

**Class typing.** {{class-type-enum}} {{types-match-predefined}} The Large Files, Web Conferencing and VoIP tabs plausibly correspond to these typed classes; no source states the mapping. {{file-size-enum}} {{application-values}}

**Terraform.** {{tf-class-resources}} {{tf-wrappers-update-existing}} Terraform destroy semantics in general: [[zia.terraform.delete-detach]]. The Large Files size field is named differently in the schema and the SDK; see the file-size-field-name divergence.

What to check: the live response for a class before relying on type or size names, and the protocol values against what the service accepts.
