These are claims about the Go SDK (the same client whose retries are in [[shared.sdk-go.retries]])'s request and response handling, shared by the Terraform providers built on it. They are about what the client does with options, bodies and status codes.

**Client options.** {{clients-built-before-options}} {{proxy-and-tls-options-only-set-fields}} {{rate-and-timeout-options-rebuild-clients}} {{custom-http-client-not-used-for-service-endpoints}}

**Proxy options in providers.** {{providers-append-proxy-after-rebuilds}} Whether a configured proxy is used for service requests is open {{gap:proxy-effect}}.

**Request bodies and response status.** {{zcc-request-do-double-marshals}} {{zcc-double-marshal-not-reached-by-provider}} {{request-do-fabricates-200}} {{fabricated-200-disables-status-checks}} {{empty-success-body-decoded-as-eof}}

**Create responses.** {{ztw-create-requires-exact-content-type}} {{ztw-create-type-assert-fails-after-post}} {{zia-create-same-exact-content-type}} Whether the APIs send the parameterized content types or empty bodies that trigger these is open {{gap:server-response-shapes}}. The same post-write failure is described in [[shared.sdk-go.retries]].

**Bulk deletes.** {{bulk-delete-rejects-nonempty-success}} {{bulk-delete-helpers-reach}} {{bulk-delete-helpers-truncate-ids}} {{bulk-delete-truncation-scope}}

Two retry-loop details are not covered by [[shared.sdk-go.retries]]. {{retry-paths-replace-body-without-closing}} {{retry-sleeps-ignore-cancellation}}

Related: empty-body handling for ZIA updates is in [[zia.sdk-go.write-encoding]]; token handling in [[shared.sdk-go.auth-lifecycle]]; response caching in [[shared.sdk-go.cache]].
