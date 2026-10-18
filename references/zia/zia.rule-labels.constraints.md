Sizes first. {{tenant-limit-listed}} What that number counts is not clear from the page (gap `tenant-cap`), and there is a separate per-rule question (gap `per-rule-label-cap`), so size label schemes well under 1,024 until it is settled.

Field limits: {{terraform-length-validation}} That is the provider guarding the request, not the server's rule (gap `description-max-length`), and nothing registered restricts the characters in a name (gap `name-charset`). Names may not be unique (gap `name-uniqueness`); do not use a name as a key. Whether `name` is required differs between the provider documentation and its schema (divergence `name-required`); always set it.

For what the API exposes and how name lookups behave, see [[zia.rule-labels.api-surface]]; for the rule type whose provider docs set a per-rule limit, [[zia.rule-labels.rule-types]].
