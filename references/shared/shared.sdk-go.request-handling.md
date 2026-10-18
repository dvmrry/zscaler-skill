These are claims about the Go SDK (the same client whose retries are in [[shared.sdk-go.retries]])'s request and response handling, shared by the Terraform providers built on it. They are about what the client does with options, bodies and status codes. What each API sends back is server behavior and is marked as open where it matters.

Client options are order-sensitive. {{clients-built-before-options}} {{proxy-and-tls-options-only-set-fields}} {{rate-and-timeout-options-rebuild-clients}} {{custom-http-client-not-used-for-service-endpoints}} In the audited providers the proxy options come last. {{providers-append-proxy-after-rebuilds}} The practical check: if a provider is meant to send traffic through a proxy or inspection point, confirm it at the proxy rather than from the provider's `http_proxy` setting. Proxy environment variables are still honored by the default transport, and so are the SDK's own `ZSCALER_CLIENT_PROXY_HOST` and `_PORT`, which are read before the first client build; the proxy set in the provider's configuration is not.

Request bodies and response status are rewritten by the ZCC, ZPA and ZDX helpers. {{zcc-request-do-double-marshals}} {{zcc-double-marshal-not-reached-by-provider}} {{request-do-fabricates-200}} {{fabricated-200-disables-status-checks}} {{empty-success-body-decoded-as-eof}}

Success-shaped responses can be turned into errors. {{ztw-create-requires-exact-content-type}} {{ztw-create-type-assert-fails-after-post}} {{zia-create-same-exact-content-type}} A create that errors after the POST is the same trap described in [[shared.sdk-go.retries]]: the caller sees a failure for a write that may have succeeded, so check the tenant before retrying. {{bulk-delete-rejects-nonempty-success}} {{bulk-delete-helpers-reach}}

Bulk deletes can also do less than asked without saying so. {{bulk-delete-helpers-truncate-ids}} {{bulk-delete-truncation-scope}}

Two retry-loop details are not covered by [[shared.sdk-go.retries]]. {{retry-paths-replace-body-without-closing}} {{retry-sleeps-ignore-cancellation}}

Related: empty-body handling for ZIA updates is in [[zia.sdk-go.write-encoding]]; token handling in [[shared.sdk-go.auth-lifecycle]]; response caching in [[shared.sdk-go.cache]].
