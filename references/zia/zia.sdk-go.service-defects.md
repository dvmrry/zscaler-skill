These are separate defects in individual ZIA SDK service packages, not one mechanism. What they share is that the SDK's own helper decides what a caller sees, and the caller cannot tell. Write-encoding and empty-reply defects live in [[zia.sdk-go.write-encoding]]; provider-side swallowing of errors is in [[zia.terraform.error-handling]].

## Wrong or empty result reported as success

**Admin user update.** {{update-admin-user-zero-result}} {{admin-user-result-unused-by-provider}}

**Lookups that report not found.** {{sub-location-lookups-swallow-errors}} {{provider-location-lookups-use-these-helpers}}

**URL filtering read.** {{url-filtering-get-fallback-swallows-error}} The rule model is in [[zia.url-filtering]].

## Input mutated or rejected

**Extranet update.** {{extranet-update-mutates-input}}

**SSL inspection validation.** {{ssl-validator-requires-conditional-fields}} {{provider-checks-ssl-action-at-plan-time}} Whether the API would have accepted those bodies is open {{gap:ssl-action-api-contract}}. The product-side model is in [[zia.ssl-inspection.pipeline]].

**Helpers that cannot complete.** {{cloud-app-duplicate-cannot-send}} {{vip-recommended-fallback-cannot-add}}

## Panics

**Exclusion lookup by name.** {{dc-exclusion-name-lookup-nil-deref}}

## Context ignored

{{sub-location-lookups-drop-caller-context}} {{url-review-update-drops-context}} {{context-background-sites}}
