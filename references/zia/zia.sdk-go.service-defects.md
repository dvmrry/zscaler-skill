These are separate defects in individual ZIA SDK service packages, not one mechanism. What they share is that the SDK's own helper decides what a caller sees, and the caller cannot tell. Each is a statement about the client; what ZIA returns in the triggering situation is server behavior these claims do not settle. Write-encoding and empty-reply defects live in [[zia.sdk-go.write-encoding]]; provider-side swallowing of errors is in [[zia.terraform.error-handling]].

## Wrong or empty result reported as success

These return normally while having done less than they claim. {{update-admin-user-zero-result}} {{admin-user-result-unused-by-provider}}

Lookups that treat an API error as "not found" are the more dangerous form, because a diagnostic or an import then blames the object rather than the call. {{sub-location-lookups-swallow-errors}} {{provider-location-lookups-use-these-helpers}}

The URL filtering read is the same shape for one field. {{url-filtering-get-fallback-swallows-error}} When the rule is an ISOLATE rule, check the read's CBI profile rather than trusting a nil error; the rule model is in [[zia.url-filtering]].

## Input mutated or rejected

{{extranet-update-mutates-input}}

The SSL inspection validator is the case where the SDK rejects before any request is sent. {{ssl-validator-requires-conditional-fields}} {{provider-checks-ssl-action-at-plan-time}} Whether the API would have accepted those bodies is open; the product-side model is in [[zia.ssl-inspection.pipeline]].

A helper that can never send: {{cloud-app-duplicate-cannot-send}} {{vip-recommended-fallback-cannot-add}}

## Panics

{{dc-exclusion-name-lookup-nil-deref}} A panic in an importer ends the provider process rather than producing a diagnostic, so for an import by name check that no listed exclusion lacks a `dcName`.

## Context ignored

Cancellation and deadlines do not reach these requests. {{sub-location-lookups-drop-caller-context}} {{url-review-update-drops-context}} {{context-background-sites}}
