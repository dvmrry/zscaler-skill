Three layers describe URL Filtering rule fields, and they disagree in places. The action semantics are in [[zia.url-filtering.actions]], the tenant-wide advanced settings in [[zia.url-filtering.advanced-settings]], and the Go SDK's defects in [[zia.sdk-go.service-defects]].

**Actions.** {{python-action-values}} {{tf-action-values}} The two lists differ {{divergence:action-values-differ}}.

**Isolate.** {{tf-isolate-get-workaround}} The provider's own checks on an ISOLATE rule are in [[zia.terraform.url-filtering-rules:isolate-validation]].

**Size quota.** {{size-quota-help-mb}} {{size-quota-code-kb}} The schema label disagrees with the provider's behavior and docs {{divergence:size-quota-unit}}.

**CIPA.** {{per-rule-cipa-flag}}

**Description round trip.** {{tf-description-diff-suppression}} Whether the server itself rewrites whitespace is open {{gap:description-server-normalized}}.
