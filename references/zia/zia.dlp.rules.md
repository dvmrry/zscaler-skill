A DLP rule answers "who, where, and what happens when an engine triggers". The detection itself lives in the engines the rule references ([[zia.dlp.engines]]). The order below holds in the default mode; Evaluate All Rules mode changes it ([[zia.dlp.evaluation]]).

**Order and rank.** {{ascending-order}} {{admin-rank}} Disabled rules still hold their slot, the same convention as [[zia.url-filtering.rule-order]]. {{rule-cap}} The provider docs state an API cap of 127 web DLP rules {{tf-docs-web-rule-cap-127}}, which does not match the generic 1,024-rule limit {{divergence:web-rule-cap-127-vs-1024}}. {{rule-label}} Terraform's ordering of DLP rules has its own behavior, covered in [[zia.terraform.rule-order]].

**Choosing engines.** {{engine-selection}} {{no-engines-filter-mode}} {{match-only}} Some SDK docstrings describe `matchOnly` differently: [[zia.dlp.rule-wire-shape:match-only-docstring]].

**How criteria combine.** {{criteria-and-or}} {{scope-limits}}

**Constraints that fail only at save time.** {{unauthenticated-needs-any}} {{inspect-downloads}}

**Other criteria.** {{http-get-query-parameters}} The prompt-capture settings that pair with this are in [[zia.url-filtering.advanced-settings]]. {{content-locations}} {{file-type-precedence}} {{minimum-data-size}} {{user-risk-levels}} {{protocols}}

**Actions.** {{actions}} {{confirm-timeout-cancels}} {{description-limit}}

Where a rule's size and archive limits stop inspection is in [[zia.dlp.inspection-limits]]; where matches are sent is in [[zia.dlp.incident-forwarding]]; the API field names, enums and sub-rules are in [[zia.dlp.rule-wire-shape]].
