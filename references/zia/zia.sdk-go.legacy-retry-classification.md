These are details of the Go legacy ZIA client's retry and error handling at the pinned SDK. The general retry policy and the OneAPI client are in [[shared.sdk-go.retries]].

**Budget.** {{legacy-retry-budget-ten}}

**Which 5xx are retried.** {{five-xx-classification}} {{five-xx-unparsed-bodies-retried}}

**When retries run out.** {{legacy-exhaustion-returns-response}} {{error-response-consumes-body}}
