{{purpose}} {{grouped-on-policy-page}} {{console-page}}

**Tagging and matching.** {{label-model-is-metadata-only}} Rule order and rank are decided elsewhere ([[zia.url-filtering.rule-order]], [[zia.firewall.rule-order]], [[zia.terraform.rule-order]]).

1. **Which rule types can carry a label, and how do rules reference one?** [[zia.rule-labels.rule-types]].
2. **What does the API expose, and which calls are only in one SDK?** [[zia.rule-labels.api-surface]].
3. **Why can't I delete this label?** [[zia.rule-labels.delete]], and for Terraform destroys [[zia.terraform.delete-detach]].
4. **What are the limits on names, descriptions and counts?** [[zia.rule-labels.constraints]].

**Traffic logs.** {{web-log-rulelabel-fields-are-rule-names}} For which of those fields fills in when, see [[zia.logs.web-rule-attribution]]. Whether the audit log records label names is open {{gap:audit-log-label-names}}. Terraform writes that stage rather than publish are covered in [[zia.terraform.activation]].

The "duplicate" action in older notes is open {{gap:duplicate-action}}.
