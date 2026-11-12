# Constraints shared by ZIA Terraform rule resources: order and predefined rules (zia.terraform.rule-resources)
Also called: terraform rule order must be positive; terraform order gaps zia; terraform destroy predefined rule; zia rule order zero terraform

Rule-based ZIA resources share order and predefined-rule constraints. The `zia_dlp_web_rules` documentation says `order` must always be a positive whole number starting at 1, with negative numbers and zero unsupported and an error, and the `zia_url_filtering_rules` and `zia_firewall_filtering_rules` schemas validate it with `IntAtLeast(1)`. [zia.terraform.rule-resources:order-positive-integer] What a non-positive order does at the API is open [gap:zia.terraform.rule-resources:nonpositive-order-effect].

**Order.** The provider documents that rule orders must be contiguous with no gaps. Up to v4.8.13 its page said deleting a rule must be followed by renumbering the remaining rules so the API honours the order; from v4.8.14 it says to renumber the remaining rules so the orders stay contiguous, and that the deletion and the renumbering can be applied together in one `terraform apply`. [zia.terraform.rule-resources:order-contiguous] How orders are applied and what can go wrong: [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order).

**Predefined rules.** Predefined rules can be managed through the provider for reordering, but destroy is not supported for them and not every attribute of a custom rule applies. Up to v4.8.13 the rule page also said to delete a custom rule with `-target`; the v4.8.14 changelog says deleting the rule with `-target` first is no longer needed. [zia.terraform.rule-resources:predefined-reorder-not-destroy] For firewall filtering rules the documentation says predefined rules cannot be deleted and the provider reorders around them. [zia.terraform.rule-resources:firewall-predefined-ordering-automatic] Deleting a predefined firewall filtering rule through the provider returns an error, both for a fixed list of predefined rule names and for any rule whose `predefined` flag is set. [zia.terraform.rule-resources:firewall-predefined-delete-errors] A predefined firewall rule can be imported into state, but `terraform destroy` then fails; the documented route is to remove the rules you want to delete and re-run `terraform apply`. [zia.terraform.rule-resources:firewall-predefined-import-then-destroy-fails]

What to check:
1. Whether configured orders start at 1 and have no gaps, including after a custom rule was deleted.
2. Whether a failed destroy was a predefined rule that the provider refuses to delete.

Not known (open gaps):
- Whether a zero or negative order can reach ZIA and create undeletable internal rules [gap:zia.terraform.rule-resources:nonpositive-order-effect]: settled by lab-test. Blocks: saying that a non-positive order creates undeletable rules

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.terraform.url-filtering-rules.md (Terraform user agent validation and isolation on URL Filtering rules)
