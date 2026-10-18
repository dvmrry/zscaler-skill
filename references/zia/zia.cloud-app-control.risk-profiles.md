A Risk Profile lets a rule match applications by attribute instead of by name. It is how "block every unsanctioned, high-risk file-sharing app" is written without listing apps. {{where-configured}}

**How a profile combines its attributes.** {{composition}} {{example}}

**What it can test.** {{core-attributes}} {{hosting-security-characteristics}} {{risk-index-overrides}}

A rule that selects a profile applies to every matching app, so one rule can account for many blocks: [[zia.cloud-app-control.rule-criteria]]. Where each attribute value comes from is open {{gap:attribute-sources}}.
