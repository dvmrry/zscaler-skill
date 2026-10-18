The report is how an agent attributes a Sandbox decision to a file. {{report-endpoints}} {{no-report-means-not-analyzed}}

**Quota.** {{quota-shape}} What the quota counts is open {{gap:quota-meaning}}.

**Sample-authored content.** {{verdict-from-classification}} {{sample-controlled-surfaces}} {{banner-is-a-hint}} {{treat-samples-as-evidence}}

Provider and SDK defects on this surface (the report data source panicking on `signature_sources`, the update path indexing an empty list) are in [[zia.terraform.data-source-fidelity]] and [[zia.terraform.error-handling]]. Interpreting the classification type is in [[zia.sandbox.verdicts]].
