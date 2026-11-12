# URL Filtering rule fields where the Python SDK, Terraform provider and help disagree (zia.api.url-filtering-wire)
Also called: size_quota KB or MB; url filtering isolate validation; cbi_profile required isolate; description diff suppress; ciparule vs enable_cipa_compliance; ISOLATE missing from python action; url filtering get cbiProfile missing

Three layers describe URL Filtering rule fields, and they disagree in places. The action semantics are in [URL Filtering actions and their prerequisites](kb:zia.url-filtering.actions), the tenant-wide advanced settings in [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings), and the Go SDK's defects in [ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input](kb:zia.sdk-go.service-defects).

**Actions.** The Python SDK documents the rule action as ANY, NONE, BLOCK, CAUTION, ALLOW or ICAP_RESPONSE, without ISOLATE. [zia.api.url-filtering-wire:python-action-values] The Terraform provider accepts BLOCK, CAUTION, ALLOW and ISOLATE as a URL Filtering rule action. [zia.api.url-filtering-wire:tf-action-values] The two lists differ [divergence:zia.api.url-filtering-wire:action-values-differ].

**Isolate.** The provider works around an API bug in which a GET of an ISOLATE rule returns cbiProfileId but not the cbiProfile object, by keeping the profile from state. [zia.api.url-filtering-wire:tf-isolate-get-workaround] The provider's own checks on an ISOLATE rule are in [For an ISOLATE rule the provider requires a cbi_profile, rejects the user agent type OTHER, and allows only HTTP and HTTPS protocols.](kb:zia.terraform.url-filtering-rules:isolate-validation).

**Size quota.** The console help gives the URL Filtering size quota minimum as 10 MB and maximum as 100,000 MB. [zia.api.url-filtering-wire:size-quota-help-mb] The Terraform schema description says KB, but the provider validates 10-100000 as MB (as its docs say) and converts to KB (x1024) before sending; the API wire unit is KB, per the Python docstring. [zia.api.url-filtering-wire:size-quota-code-kb] The schema label disagrees with the provider's behavior and docs [divergence:zia.api.url-filtering-wire:size-quota-unit].

**CIPA.** A URL Filtering rule has its own ciparule boolean, and the advanced URL filter and cloud app settings carry a separate enable_cipa_compliance setting. [zia.api.url-filtering-wire:per-rule-cipa-flag]

**Description round trip.** The provider suppresses a diff on a URL Filtering rule's description when the old and new text are equal after trimming each line and normalizing the trailing newline. [zia.api.url-filtering-wire:tf-description-diff-suppression] Whether the server itself rewrites whitespace is open [gap:zia.api.url-filtering-wire:description-server-normalized].

What to check:
1. Which unit a size quota is in before trusting a migrated value: help says MB, the Terraform schema text and the Python docstring say KB.
2. Whether an ISOLATE rule meets the provider's checks, which are listed in the Terraform subject.
3. Whether a plan-time description diff is whitespace only, since the provider suppresses equal-after-normalizing text.

Sources disagree (name both sides):
- The Terraform schema description labels size_quota as KB, but the provider validates and accepts it as MB, as its documentation and the console help say, and converts to KB for the wire. [divergence:zia.api.url-filtering-wire:size-quota-unit]
  - tf-zia: size_quota is in KB, validated between 10 and 100,000 (schema description).
  - tf-zia: The provider validates the value as MB (10 to 100,000) and multiplies by 1024 to send KB.
  - tf-zia: The provider documentation says the size quota is in MB.
  Impact: HCL values are megabytes; the schema label is stale. Reading the label as KB, or treating the Python SDK's KB value as an HCL value, is off by a factor of 1024.
- The Python SDK's documented action values omit ISOLATE, which the Terraform provider accepts, while the SDK adds ANY, NONE and ICAP_RESPONSE. [divergence:zia.api.url-filtering-wire:action-values-differ]
  - sdk-python: Actions are ANY, NONE, BLOCK, CAUTION, ALLOW and ICAP_RESPONSE.
  - tf-zia: Actions are BLOCK, CAUTION, ALLOW and ISOLATE.
  Impact: A tool that validates actions against the Python docstring would reject an ISOLATE rule that exists in the tenant, and one that validates against the provider would reject ICAP_RESPONSE.

Not known (open gaps):
- Whether the ZIA API rewrites a rule description's whitespace and line endings [gap:zia.api.url-filtering-wire:description-server-normalized]: settled by lab-test or tenant-data. Blocks: Whether a description round trip shows false drift from the server, or only from the provider.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.sdk-go.service-defects.md (ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input)
- links-to references/_meta/text/zia/zia.terraform.url-filtering-rules.md (Terraform user agent validation and isolation on URL Filtering rules)
- links-to references/_meta/text/zia/zia.url-filtering.actions.md (URL Filtering actions and their prerequisites)
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
