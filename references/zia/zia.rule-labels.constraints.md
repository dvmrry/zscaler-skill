Sizes first. {{tenant-limit-listed}} What that number counts is not clear from the page (gap `tenant-cap`), and there is a separate per-rule question (gap `per-rule-label-cap`), so size label schemes well under 1,024 until it is settled.

**Provider length checks.** {{terraform-length-validation}} Whether the server enforces the same lengths is open {{gap:description-max-length}}.

**Names.** Nothing registered restricts the characters in a name {{gap:name-charset}}. Whether names must be unique is open {{gap:name-uniqueness}}.

The provider documentation and its schema disagree on whether `name` is required {{divergence:name-required}}.

For what the API exposes and how name lookups behave, see [[zia.rule-labels.api-surface]]; for the rule type whose provider docs set a per-rule limit, [[zia.rule-labels.rule-types]].
