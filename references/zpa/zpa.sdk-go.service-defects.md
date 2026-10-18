These are separate defects in individual ZPA SDK service packages and the shared search helpers, not one mechanism. What they share is that the SDK's own helper decides what a caller sees, and the caller cannot tell. Each is a statement about the client; what ZPA returns in the triggering situation is server behavior these claims do not settle. Zero-value writes are in [[shared.sdk-go.zero-value-writes]], paging is in [[shared.sdk-go.list-pagination]], and policy rule ordering (including the `BulkReorder` context defect) is in [[zpa.terraform.rule-order]]. The ZIA counterpart is [[zia.sdk-go.service-defects]].

## Partial or incomplete results reported as success

Provisioning keys have no list-all endpoint, so the SDK probes a fixed list of association types. {{provisioning-key-all-associations-fixed-list}} The provider offers more types than the list covers, and its importer is the one place that depends on the list. {{provider-provisioning-key-schema-and-importer}} Keys of the two unprobed association types cannot be imported by name or ID through this importer; manage them by creating them in Terraform, or leave them unmanaged.

The list-all form is worse, because a failed endpoint becomes a shorter list. {{provisioning-key-get-all-discards-errors}}

## Wrong keys on the wire

{{segment-group-udp-key-misspelled}} {{provider-segment-group-data-source-omits-udp}} A segment group's UDP ranges therefore cannot be read through either layer, and the provider never writes `applications` beyond their IDs.

## Valid input rejected before any request

{{assistant-schedule-update-rejects-disabled}} {{provider-schedule-resources-pass-enabled-through}} To turn an existing schedule off through Terraform at v4.4.10 the update never reaches the API (and `frequency_interval` must also be valid, or the update fails earlier); check the error text `cannot update a disabled schedule` before blaming the server.

## Search and query encoding

All named-object lookups in the ZPA SDK go through the shared pager and its search rewriting, so a wire-format defect there affects many products at once. Paging itself is covered in [[shared.sdk-go.list-pagination]].

{{application-type-lookup-duplicate-search}}

{{predefined-control-name-escaped-twice}}

{{search-sanitizer-strips-name-characters}} {{provider-segment-group-lookups-use-sanitized-search}} A lookup by a name containing punctuation that fails with "no ... named ... was found" is a candidate for this.

{{query-encoder-emits-plus-for-space}}

## Context ignored

Cancellation and deadlines do not reach these requests. {{policy-type-lookups-drop-context}} {{zpa-context-background-sites}}

## Panics on nil input

The provider passes non-nil pointers at every call site read, so these matter to direct SDK callers. A panic ends the provider process rather than producing a diagnostic. {{policy-update-rule-nil-deref}} {{other-mutators-dereference-unchecked-pointers}}

## Response shape

{{application-validation-cannot-return-typed-error}}

{{weighted-lb-update-returns-nil-object}}
