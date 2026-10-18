Three questions come up: which rules take the field, how many groups a rule can hold, and how many groups can exist.

**Which rules.** {{contract-carriers}} {{help-four-policies}} {{no-other-rule-types}} The Terraform provider goes further: {{terraform-five-carriers}} {{traffic-capture-not-in-contract}} Tooling that follows only the MCP workflow will under-count: {{mcp-names-four}}

**Forwarding.** {{forwarding-control-not-in-sources}} The rule type is described in [[zia.forwarding-control.rules]]. Cloud Connector forwarding is separate: {{cloud-connector-source-dest}}

**What an empty field means.** {{empty-ignores-criterion}} How the criterion is combined with the rule's other criteria is in [[zia.url-filtering.criteria]] for URL Filtering.

**How many per rule.** {{help-8-per-rule}} {{tf-maxitems-255}} The two disagree {{divergence:per-rule-limit}}, and whether ZIA rejects more than 8 on a rule is open {{gap:server-enforced-rule-limit}}. This is not the 8-tags-per-group limit in [[zia.workload-groups.expressions]].

**How many groups.** {{org-limit-1024}} What the 64 figure under Cloud Connector Management means is open {{gap:org-limit-64}}.

Rule changes made through Terraform follow the activation rules in [[zia.terraform.activation]].
