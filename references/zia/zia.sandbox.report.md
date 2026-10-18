The report is how an agent attributes a Sandbox decision to a file. {{report-endpoints}} {{no-report-means-not-analyzed}}

Quota is the part to be careful with. {{quota-shape}} The strongest hint is the Go SDK's log line, which calls it the quota "for retrieving Sandbox Detail Reports"; the MCP skill ties it to files sent for analysis. Do not state either as fact.

A detonation report is partly attacker-authored. {{verdict-from-classification}} {{sample-controlled-surfaces}} {{banner-is-a-hint}} {{treat-samples-as-evidence}}

Provider and SDK defects on this surface (the report data source panicking on `signature_sources`, the update path indexing an empty list) are in [[zia.terraform.data-source-fidelity]] and [[zia.terraform.error-handling]]. Interpreting the classification type is in [[zia.sandbox.verdicts]].

What to check: the MD5 comes from the transaction log, a summary or full report can be requested, and read only the Classification block for the verdict.
