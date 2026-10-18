{{purpose}} {{grouped-on-policy-page}} {{console-page}}

A label is a tag, not a policy object. {{label-model-is-metadata-only}} That is the answer to "does labelling this rule change what it matches?": the tag does not, and rule order and rank are decided elsewhere ([[zia.url-filtering.rule-order]], [[zia.firewall.rule-order]], [[zia.terraform.rule-order]]).

Walk the questions in this order.

1. **Which rule types can carry a label, and how do rules reference one?** [[zia.rule-labels.rule-types]].
2. **What does the API expose, and which calls are only in one SDK?** [[zia.rule-labels.api-surface]].
3. **Why can't I delete this label?** [[zia.rule-labels.delete]], and for Terraform destroys [[zia.terraform.delete-detach]].
4. **What are the limits on names, descriptions and counts?** [[zia.rule-labels.constraints]].

Do not look for a label in traffic logs. {{web-log-rulelabel-fields-are-rule-names}} For which of those fields fills in when, see [[zia.logs.web-rule-attribution]]. Whether the audit log records label names is unconfirmed (gap `audit-log-label-names`). Terraform writes that stage rather than publish are covered in [[zia.terraform.activation]].

What to check: the console path is given in the Rule Labels page citation{{console-page|ref}}. The "duplicate" action in older notes is not in the captured help page (gap `duplicate-action`).
