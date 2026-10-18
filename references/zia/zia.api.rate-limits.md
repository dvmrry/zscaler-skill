ZIA enforces per-endpoint limits and answers 429 when they are exceeded; the Python SDK retries a small set of statuses on its own. The Go SDK's retry behavior is in [[shared.sdk-go.retries]], and the SCIM limit is in [[zia.scim.operations]].

**The limits.** {{zia-two-bounds}} {{zia-default-weights}} {{zia-429-headers}}

**SDK retries.** {{sdk-max-retries-default}} Which statuses the executor retries is in [[zia.sdk-python.request-conventions:retry-statuses-docstring-mismatch]]. The SDK's two lists of retryable statuses disagree {{divergence:retryable-status-sets}}. {{sdk-wait-from-headers}} {{sdk-max-retry-seconds}}

**Edit lock.** {{zia-edit-lock-retry}}
