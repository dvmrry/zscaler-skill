{{help-delete-constraint}} Use `referencedRuleCount` (see [[zia.rule-labels.api-surface]]) to see how many rules still hold a label before trying.

Terraform adds a twist. {{terraform-delete-detaches-firewall-rules-only}} The shared sweep helper and its other defects are in [[zia.terraform.delete-detach]]. So a destroy may succeed for firewall rules and still meet a label held by a URL filtering, DLP or other rule; whether the API then refuses is unproven (gap `referenced-label-delete-api`).

What to check: before a destroy, list the rules of every type in [[zia.rule-labels.rule-types]] that reference the label, clear the label from them, and re-read them after. Staged changes after the write are covered in [[zia.terraform.activation]].
