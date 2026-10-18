A Risk Profile lets a rule match applications by attribute instead of by name. It is how "block every unsanctioned, high-risk file-sharing app" is written without listing apps. {{where-configured}}

**How a profile combines its attributes.** {{composition}} {{example}}

**What it can test.** {{core-attributes}} {{hosting-security-characteristics}} {{risk-index-overrides}}

When asked "why was this app caught by our risk rule", do not guess from the app's name. Open the rule's profile, then (inference, not stated by the sources) compare each selected criterion with the app's current attribute values: any attribute that does not satisfy the profile clears the app, and an all-match is the culprit. A rule that selects a profile applies to every matching app, so one rule can account for many blocks: [[zia.cloud-app-control.rule-criteria]]. Inference: because the Help page allows per-app risk index overrides, an app may start or stop matching without any rule edit; the sources do not say how an override interacts with matching. Where each attribute value comes from is not documented (gap `attribute-sources`).
