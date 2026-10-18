Three questions come up: which rules take the field, how many groups a rule can hold, and how many groups can exist.

**Which rules.** {{contract-carriers}} {{help-four-policies}} {{no-other-rule-types}} The Terraform provider goes further: {{terraform-five-carriers}} {{traffic-capture-not-in-contract}} Tooling that follows only the MCP workflow will under-count: {{mcp-names-four}}

**Forwarding.** {{forwarding-control-not-in-sources}} The rule type is described in [[zia.forwarding-control.rules]]. Cloud Connector forwarding is separate: {{cloud-connector-source-dest}}

**What an empty field means.** {{empty-ignores-criterion}} How the criterion is combined with the rule's other criteria is in [[zia.url-filtering.criteria]] for URL Filtering.

**How many per rule.** {{help-8-per-rule}} {{tf-maxitems-255}} The two disagree (see the divergence), so write 8 as the working limit; no source shows what the API does above 8. This is not the 8-tags-per-group limit in [[zia.workload-groups.expressions]].

**How many groups.** {{org-limit-1024}} A second figure of 64 appears in the same page under a different product heading, and is unexplained.

Rule changes made through Terraform follow the activation rules in [[zia.terraform.activation]].
