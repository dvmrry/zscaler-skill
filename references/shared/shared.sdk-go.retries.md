These are claims about the Go SDK's HTTP client, shared by every product's OneAPI calls and so by the Terraform providers built on it.

The retry decision never looks at what the request does. {{retry-policy-ignores-method}} {{default-retries-connection-errors}} {{body-buffered-for-replay}} That is safe for reads and for rate limiting, where nothing was committed, and unsafe for writes whose response is lost. {{write-replay-on-lost-response}}

Separately, older SDK builds hid the API's own error when retries ran out. {{exhaustion-hid-api-error-before-3-8-43}} The same release fixed a latent problem in the SDK's own outer retry loop. {{outer-retry-reused-consumed-body-before-3-8-43}} {{empty-body-resend-rarely-reached}} So whether an operator sees a useful error or a bare "giving up" message, and whether a retried write keeps its body, depends on which SDK a provider build carries. {{provider-sdk-pins}}
