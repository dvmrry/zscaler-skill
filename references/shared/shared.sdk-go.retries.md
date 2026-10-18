These are claims about the Go SDK's HTTP client, shared by every product's OneAPI calls and so by the Terraform providers built on it.

**Retry policy.** {{retry-policy-ignores-method}} {{default-retries-connection-errors}} {{body-buffered-for-replay}} {{write-replay-on-lost-response}} {{replay-hazard-limited-to-writes}} Whether a replayed create is rejected as a duplicate or creates a second object is open {{gap:replay-outcome}}.

**Older SDK builds.** {{exhaustion-hid-api-error-before-3-8-43}} {{outer-retry-reused-consumed-body-before-3-8-43}} {{empty-body-resend-rarely-reached}} {{provider-sdk-pins}}
