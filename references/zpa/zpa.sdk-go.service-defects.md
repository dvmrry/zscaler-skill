These are separate defects in individual ZPA SDK service packages and the shared search helpers, not one mechanism. What they share is that the SDK's own helper decides what a caller sees, and the caller cannot tell. Zero-value writes are in [[shared.sdk-go.zero-value-writes]], paging is in [[shared.sdk-go.list-pagination]], and policy rule ordering (including the `BulkReorder` context defect) is in [[zpa.terraform.rule-order]]. The ZIA counterpart is [[zia.sdk-go.service-defects]].

## Partial or incomplete results reported as success

{{provisioning-key-api-requires-association-type}} {{provisioning-key-all-associations-fixed-list}} {{provider-provisioning-key-schema-and-importer}} Keys of the two unprobed association types cannot be imported by name or by numeric ID without `association_type` set {{provisioning-key-all-associations-fixed-list|ref}}. Whether keys are stored under those two types, and how the API lists them, is open {{gap:provisioning-key-association-types}}.

{{provisioning-key-get-all-discards-errors}}

## Wrong keys on the wire

{{segment-group-udp-key-misspelled}} {{provider-segment-group-data-source-omits-udp}} {{provider-segment-group-resource-writes-application-ids-only}}

## Valid input rejected before any request

{{assistant-schedule-update-rejects-disabled}} {{provider-schedule-resources-pass-enabled-through}} Whether the API accepts `enabled = false` on a schedule update is open {{gap:schedule-disable-contract}}.

## Search and query encoding

Paging itself is covered in [[shared.sdk-go.list-pagination]].

{{application-type-lookup-duplicate-search}}

{{predefined-control-name-escaped-twice}}

{{search-sanitizer-strips-name-characters}} {{provider-segment-group-lookups-use-sanitized-search}}

{{query-encoder-emits-plus-for-space}} How the list search treats `+` versus `%20` and the removed characters is open {{gap:search-filter-semantics}}.

## Context ignored

{{policy-type-lookups-drop-context}} {{zpa-context-background-sites}}

## Panics on nil input

{{policy-update-rule-nil-deref}} {{other-mutators-dereference-unchecked-pointers}} What such a panic does to the provider process is open {{gap:panic-effect}}.

## Response shape

{{application-validation-cannot-return-typed-error}}

{{weighted-lb-update-returns-nil-object}}
