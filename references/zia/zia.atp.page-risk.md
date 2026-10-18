A Page Risk block is fixed by the threshold or an exception, not a rule. The log text "This page is unsafe (high PageRisk index)" is a documented `reason` example ([[zia.atp.block-diagnosis]]).

{{threshold-blocks-above}} {{score-composition}} {{tolerance-labels}}

Because the comparison is "higher than", {{higher-is-more-permissive}} {{recommended-35}}

**In the API** the value is a number, not a label. {{wire-range}} The ranges behind the labels are not published.

What to check: the logged riskscore of the blocked transaction against the configured value ([[zia.atp.block-diagnosis]]), whether the URL is in Security Exceptions ([[zia.atp.security-exceptions]]), and where Page Risk falls in the order ([[zia.atp.enforcement-order]]). The groups around it are in [[zia.atp.categories]].
