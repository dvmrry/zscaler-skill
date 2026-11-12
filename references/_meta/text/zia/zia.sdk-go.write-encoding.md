# How the Go SDK encodes ZIA writes (omitted zero values, empty responses) (zia.sdk-go.write-encoding)
Also called: omitempty; cannot set false; cannot clear a field terraform; sdk drops false values; 204 no content nil; update panics nil pointer

These are claims about the Go SDK, the client, not about ZIA. The distinction matters: SDK code proves what the client sends and how it reacts; what ZIA does with that is server behavior that code alone cannot settle.

**Updates and rule booleans.** ZIA updates go through an `updateGeneric`, the OneAPI client's in `ziarequests.go` or, when the legacy client is configured, its own copy in `zia/v2_client.go`. Both serialize the caller's struct directly with `json.Marshal`. [zia.sdk-go.write-encoding:marshals-caller-struct] The URL Filtering rule struct tags its boolean fields `omitempty` (`blockOverride`, `enforceTimeValidity`, `ciparule`), so a false value is never sent on create or update. [zia.sdk-go.write-encoding:rule-bools-omitted-when-false] Whether that makes a field impossible to clear is open [gap:zia.sdk-go.write-encoding:rule-omission-semantics].

**Settings booleans.** The advanced URL and cloud-app settings booleans were tagged `omitempty` from v3.0.0 through v3.8.44. From v3.8.45 they are always sent, except `blockSkype` (and the `safeSearchApps` list), because, in the SDK maintainers' words, dropping a false from the body would leave the setting enabled. [zia.sdk-go.write-encoding:settings-bools-fixed-3-8-45] The advanced-settings writes are full-state writes; see [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

**Empty replies.** When an update returns an empty body (for example 204 No Content), `updateGeneric` returns a nil result and a nil error. [zia.sdk-go.write-encoding:empty-body-nil-nil] URL Filtering `Update` ignores the result of its type assertion and then reads the rule's ID from the asserted value. [zia.sdk-go.write-encoding:rule-update-panics-on-empty-body] If the server answers a URL Filtering rule update with an empty body, `Update` panics with a nil pointer dereference instead of returning an error. [zia.sdk-go.write-encoding:rule-update-empty-body-panics] Whether the rule update endpoint ever answers with an empty body is open [gap:zia.sdk-go.write-encoding:rule-update-empty-body].

What to check:
1. Before calling a rule update panic an observed failure, whether the server answers an update with an empty body. Until then it is a certain consequence of an empty body, not an observed failure.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-go.write-encoding:rule-bools-omitted-when-false] Tier B: Chain of evidence: the fields are tagged omitempty, no custom marshaller exists on the rule type, and Go's encoding/json omits a false bool so tagged. Other rule structs are not yet checked.
- [zia.sdk-go.write-encoding:rule-update-empty-body-panics] Tier B: Rests on Go semantics no source states: `updateGeneric` returns a nil result for an empty body, the unchecked assertion `resp.(*URLFilteringRule)` on a nil interface yields a nil pointer, and reading `.ID` through it panics. Whether the endpoint ever answers an update with an empty body is not stated (gap rule-update-empty-body).

Not known (open gaps):
- Whether ZIA rule updates treat an omitted field as unchanged or as reset [gap:zia.sdk-go.write-encoding:rule-omission-semantics]: settled by lab-test. Blocks: saying whether a boolean or numeric rule field can be cleared (set false or 0) through the Go SDK or Terraform
- Whether ZIA rule update endpoints ever return an empty body [gap:zia.sdk-go.write-encoding:rule-update-empty-body]: settled by lab-test. Blocks: saying whether the update panic happens in practice

Area: zia.sdk-go, its subjects in references/_meta/spine/zia/zia.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/url-filtering-rules.md (config type)
- see-also references/_meta/text/zia/zia.url-filtering.list-pagination.md (Listing URL Filtering rules and URL categories without truncation)
