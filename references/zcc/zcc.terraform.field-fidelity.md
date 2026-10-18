The ZCC provider is a Plugin Framework provider whose forwarding profile resource round-trips a large nested object through a hand-written expand function (plan to request) and flatten function (response to state). Most defects here come from the two halves disagreeing: a setting that can be read but not written, or one that is written but never read.

**Accepted but never sent.** {{action-fields-exposed-and-read}} {{tunnel-fields-exposed-and-read}} {{action-fields-never-sent}} {{tunnel-fields-never-sent}} {{trusted-network-lists-read-only}} {{configured-values-silently-ignored}} What the API does with a setting it never receives is open {{gap:ignored-field-server-effect}}. Zero-value clears on the fields that are sent are in [[shared.sdk-go.zero-value-writes]].

**Settings hidden from drift.** {{zpa-latency-overlay-masks-drift}} {{unified-tunnel-overlay-covers-every-attribute}} {{prior-state-overlays-elsewhere}} Whether the list and GET responses really omit the fields the provider restores from state is open {{gap:api-field-drop-claims}}.

**Data sources.** {{data-sources-report-false-for-dropped-fields}} {{strict-versus-lenient-boolean-strings}}

**Failed reads and creates.** {{failopen-read-error-removes-state}} {{create-ignores-success-flag}} {{create-can-adopt-same-name-profile}} Whether the edit endpoint returns HTTP 200 with `success` false is open {{gap:success-false-response}}. Reads removed because an ID is outside the first page of a list are in [[shared.sdk-go.list-pagination]].

**Blocks that collapse.** {{duplicate-network-type-collapses}} {{duplicate-network-type-not-rejected}}

**Defects on the SDK side.** {{intorstring-truncates-fractions}} {{trusted-network-create-sleeps-blindly}} {{emergency-access-create-clears-activate-now}} {{sdk-defects-reach}} {{v1-backend-serves-tenants-without-v2}} Legacy-client routing for the same package is in [[zcc.sdk-go.legacy-routing]]; ZIA's equivalent field-fidelity mechanisms are in [[zia.terraform.field-fidelity]].

Whether the ZCC v2 create and update responses carry every field is open {{gap:partial-create-update-response}}.
