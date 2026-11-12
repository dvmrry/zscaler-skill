# Deleting a ZIA rule label (zia.rule-labels.delete)
Also called: cannot delete rule label; rule label in use; delete rule label; terraform destroy rule label; label still associated with a policy rule

The help text states that a rule label can be deleted only if it is not associated with any policy rule. [zia.rule-labels.delete:help-delete-constraint]

**Terraform destroys.** Destroying `zia_rule_labels` first strips the label from Cloud Firewall filtering rules only, then deletes the label; rules of other types that still hold it are not touched by the provider. [zia.rule-labels.delete:terraform-delete-detaches-firewall-rules-only] The shared sweep helper and its other defects are in [How the ZIA Terraform provider detaches references before deleting objects](kb:zia.terraform.delete-detach). Whether the API refuses a destroy that still meets a label held by another rule type is open [gap:zia.rule-labels.delete:referenced-label-delete-api].

Staged changes after the write are covered in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation).

What to check:
1. How many rules still hold the label, by reading `referencedRuleCount`, before trying a delete.
2. Which rules of each rule type still reference the label before a destroy, and clear the label from them.
3. Whether those rules were re-read after the destroy.

Not known (open gaps):
- What the API does when a label that rules still reference is deleted [gap:zia.rule-labels.delete:referenced-label-delete-api]: settled by lab-test. Blocks: saying whether a Terraform destroy fails or leaves a dangling reference when a non-firewall rule still holds the label

Area: zia.rule-labels, its subjects in references/_meta/spine/zia/zia.rule-labels.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
- links-to references/_meta/text/zia/zia.terraform.delete-detach.md (How the ZIA Terraform provider detaches references before deleting objects)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/rule-labels.md (config type)
- see-also references/_meta/text/zia/zia.rule-labels.md (ZIA Rule Labels)
