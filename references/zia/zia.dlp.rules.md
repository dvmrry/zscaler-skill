A DLP rule answers "who, where, and what happens when an engine triggers". The detection itself lives in the engines the rule references ([[zia.dlp.engines]]). Before reasoning about a rule, confirm the tenant is not in Evaluate All Rules mode; the order and exception behavior below is the default mode ([[zia.dlp.evaluation]]).

**Order and rank.** {{ascending-order}} {{admin-rank}} Disabled rules still hold their slot, the same convention as [[zia.url-filtering.rule-order]]. {{rule-cap}} {{rule-label}} Terraform's ordering of DLP rules has its own behavior, covered in [[zia.terraform.rule-order]].

**Choosing engines.** {{engine-selection}} {{no-engines-filter-mode}} {{match-only}} Match Only is one reason a rule that "should" fire stays quiet: a transaction that also trips an engine from another rule is excluded. Note that some SDK docstrings describe `matchOnly` differently; see [[zia.dlp.rule-wire-shape]].

**How criteria combine.** {{criteria-and-or}} A rule with a URL category and a cloud application selected needs both to be seen, so an operator who adds a second field expecting "either" gets a rule that rarely matches. {{scope-limits}}

**Constraints that fail only at save time.** {{unauthenticated-needs-any}} {{inspect-downloads}} These are the first things to check when a rule will not save or when download coverage is missing for EDM or IDM engines.

**Other criteria.** {{http-get-query-parameters}} The prompt-capture settings that pair with this are in [[zia.url-filtering.advanced-settings]]. {{content-locations}} {{file-type-precedence}} {{minimum-data-size}} {{user-risk-levels}} {{protocols}}

**Actions.** {{actions}} {{confirm-timeout-cancels}} {{description-limit}}

Where a rule's size and archive limits stop inspection is in [[zia.dlp.inspection-limits]]; where matches are sent is in [[zia.dlp.incident-forwarding]]; the API field names, enums and sub-rules are in [[zia.dlp.rule-wire-shape]].
