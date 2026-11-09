# ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input (zia.sdk-go.service-defects)
Also called: sdk returns empty user; sublocation not found; sub-location lookup error swallowed; invalid action type ssl inspection; dc exclusion import panic; CreateDuplicate nil payload; GetVIPRecommendedList not enough vips; SDK ignores context

These are separate defects in individual ZIA SDK service packages, not one mechanism. What they share is that the SDK's own helper decides what a caller sees, and the caller cannot tell. Write-encoding and empty-reply defects live in [How the Go SDK encodes ZIA writes (omitted zero values, empty responses)](kb:zia.sdk-go.write-encoding); provider-side swallowing of errors is in [When the ZIA Terraform provider reports success after an error, or crashes](kb:zia.terraform.error-handling).

## Wrong or empty result reported as success

**Admin user update.** `UpdateAdminUser` asserts the helper's response to the value type `AdminUsers`, but the update helper builds its response object with `reflect.New`, which is a pointer. The assertion fails, its failure is discarded, and when the update call succeeds the function returns a pointer to a zero-value `AdminUsers` with a nil error, whatever body the server returned. [zia.sdk-go.service-defects:update-admin-user-zero-result] The provider's admin-user update discards the value `UpdateAdminUser` returns, so the zero-value result does not reach Terraform state. [zia.sdk-go.service-defects:admin-user-result-unused-by-provider]

**Lookups that report not found.** Sub-location lookups by ID and by name treat an API error as "keep looking". `GetSubLocationBySubID` ignores the error from each parent's lookup and only returns on success, and `GetSubLocationByName` discards the error from listing sub-locations outright. An API error on every parent, whatever its status, ends as the synthetic "not found" error (by ID) or "no sublocation found" (by name). `GetLocationOrSublocationByID` and `...ByName` do the same with their first lookup, falling through to the sub-location search on any error. By name, an error listing the parent locations themselves is still returned; only the per-parent sub-location errors are dropped. [zia.sdk-go.service-defects:sub-location-lookups-swallow-errors] The provider's location resource importer (by name, for an ID that is not an integer), read and update (by ID), and its data source call the combined location-or-sub-location lookups, so they inherit the dropped errors and the dropped context. The data source's lookup by parent and name calls `GetSubLocationByNames`, which returns its errors but also calls the API with `context.Background()`. [zia.sdk-go.service-defects:provider-location-lookups-use-these-helpers]

**URL filtering read.** For an ISOLATE rule whose GET by ID returned no `cbiProfile` but a non-zero `cbiProfileId`, `Get` calls `GetAll` to fill it in. If `GetAll` fails, the error is not examined and the incomplete rule is returned with a nil error; the same happens if the rule is absent from the list. [zia.sdk-go.service-defects:url-filtering-get-fallback-swallows-error] The rule model is in [ZIA URL Filtering](kb:zia.url-filtering).

## Input mutated or rejected

**Extranet update.** `extranet.Update` writes the ID argument into the caller's `Extranet` before sending the PUT, so the caller's object is changed even if the request then fails. After the PUT it also discards the type-assertion result and reads `updatedExtranet.ID`, which panics if the update returns an empty body (the generic updater then returns nil, nil). [zia.sdk-go.service-defects:extranet-update-mutates-input]

**SSL inspection validation.** The SSL inspection SDK validates every create and update before sending. It switches on `Action.Type` and its default branch rejects any value other than DECRYPT, DO_NOT_DECRYPT, or BLOCK, including the empty string. Under DECRYPT it also rejects an unset sub-action block or empty `ServerCertificates`, `MinClientTLSVersion`, or `MinServerTLSVersion`; under DO_NOT_DECRYPT it requires or forbids certificate and TLS fields depending on `BypassOtherPolicies`. [zia.sdk-go.service-defects:ssl-validator-requires-conditional-fields] The provider declares `action` optional on the SSL inspection rule, but its CustomizeDiff rejects a missing `action` block at plan time (`action block must be set`) and also rejects a DECRYPT action with empty server certificates or TLS versions. So the SDK validator is a second line that Terraform users do not normally reach; it matters to direct SDK callers that send a zero or partial `Action`. [zia.sdk-go.service-defects:provider-checks-ssl-action-at-plan-time] Whether the API would have accepted those bodies is open [gap:zia.sdk-go.service-defects:ssl-action-api-contract]. The product-side model is in [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline).

**Helpers that cannot complete.** `CreateDuplicate` for cloud app control rules passes a nil payload to `Create`, which (in both the OneAPI and legacy clients) returns an error for a nil payload before making any request. The helper also interpolates the new name into the query string without escaping it. [zia.sdk-go.service-defects:cloud-app-duplicate-cannot-send] `GetVIPRecommendedList`'s "ensure at least two" loop iterates the existing list and appends a VIP only if its ID is not already in that same list, which is never true, so the list cannot grow; a one-VIP response ends in the "not enough vips" error. Separately, the function calls every option callback unchecked, so a nil option panics. [zia.sdk-go.service-defects:vip-recommended-fallback-cannot-add]

## Panics

**Exclusion lookup by name.** `dc_exclusions.GetByName` loops over the listed exclusions and dereferences `DcName.Name` on each until it finds a match, but `DcName` is a pointer tagged `omitempty`. A listed exclusion without `dcName` ahead of the match makes the lookup panic instead of returning an error. The provider's importer calls it for any ID that is not an integer. [zia.sdk-go.service-defects:dc-exclusion-name-lookup-nil-deref]

## Context ignored

Several location helpers receive a caller `ctx` and then call the API with `context.Background()`, so cancellation and deadlines do not reach those requests. The sub-location lookups by ID and by names are examples. [zia.sdk-go.service-defects:sub-location-lookups-drop-caller-context] `UpdateURLReview` takes a `ctx` and sends its request with `context.Background()`. [zia.sdk-go.service-defects:url-review-update-drops-context] Within the ZIA services directory the only places that replace a caller's context with `context.Background()` are in the location management package (nine) and `UpdateURLReview` (one). [zia.sdk-go.service-defects:context-background-sites]

What to check:
1. Whether an ISOLATE rule read through the URL filtering Get carries a CBI profile, rather than trusting a nil error.
2. For an import by name, whether a DC exclusion listed ahead of the match lacks a dcName.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-go.service-defects:context-background-sites] Tier B: Search: `git -C vendor/zscaler-sdk-go grep -n 'context.Background()' <ref> -- zscaler/zia/services`, test files excluded, at v3.8.44 and HEAD. At HEAD the match counts are 9 in locationmanagement.go and 1 in urlcategories.go; at v3.8.44 the listing shows the same lines. Other ZIA packages that use a different mechanism to drop the context (for example a client constructed without it) were not searched for.
- [zia.sdk-go.service-defects:provider-checks-ssl-action-at-plan-time] Tier B: The TLS-version fields are Optional and Computed, not defaulted; the CustomizeDiff checks are read from the resource definition at v4.8.3 and the pin.

Not known (open gaps):
- Whether the ZIA API accepts the SSL inspection action bodies the SDK validator rejects [gap:zia.sdk-go.service-defects:ssl-action-api-contract]: settled by lab-test. Blocks: telling whether the SDK validator is stricter than the API or only mirrors it

Area: zia.sdk-go, its subjects in references/_meta/spine/zia/zia.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sdk-go.write-encoding.md (How the Go SDK encodes ZIA writes (omitted zero values, empty responses))
- links-to references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes))
- links-to references/_meta/text/zia/zia.terraform.error-handling.md (When the ZIA Terraform provider reports success after an error, or crashes)
- links-to references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)
