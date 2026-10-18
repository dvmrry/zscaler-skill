A ZIA data source is supposed to be a faithful read-only view of an object. In the provider it is a hand-written pair of a schema and a flattener, fed by an SDK model, and the three drift apart in a few repeatable ways. When a data source gives a surprising answer, compare the schema, the flattener and the SDK model before suspecting the tenant (the write-side version of this is in [[zia.terraform.field-fidelity]]).

## Reads that crash or fail

**Panicking reads.** {{sandbox-rss-signature-sources-scalar-in-set}} {{sandbox-rss-scalar-set-panics}} {{gre-vip-negative-required-count-slices}}

**Undeclared keys.** {{dlp-web-excluded-lists-emit-undeclared-name}} {{forwarding-control-segment-key-misspelled-and-extensions}} {{static-ip-managed-by-emits-undeclared-extensions}} {{flatten-schema-shape-mismatch-elsewhere}} {{browser-control-data-source-sets-undeclared-keys}} {{undeclared-key-write-errors}} Whether real responses contain the objects that trigger these is open {{gap:api-response-shape-for-flattener-failures}}.

**Endpoint resource group tag.** {{endpoint-tag-multi-result-id-not-numeric}} {{endpoint-tag-id-lookup-uses-association-endpoint}}

## Selectors that do not select

**Ignored selectors.** {{devices-unused-selectors-fall-back-to-first-device}} {{domain-profiles-id-selector-never-read}} {{dc-exclusions-invalid-id-selects-everything}} {{predefined-rule-count-never-sent}}

**Conflicting selectors.** {{id-and-name-first-match-wins}}

**Filters built with GetOk.** {{gre-vip-false-and-zero-filters-dropped}}

**GRE VIP source IP.** {{gre-vip-empty-id-without-source-ip}} Whether the SDK and Terraform accept an empty ID is open {{gap:nonnumeric-or-empty-id-outcome}}.

**Name matching and required fields.** {{case-sensitive-name-lookups-diverge-from-sdk}} {{rule-type-optional-in-schema-required-at-read}}

## Success-shaped empty and partial results

**Empty lookups.** {{cloud-applications-name-filter-empty-success}} {{datacenter-lookups-no-match-succeed}}

**Partial searches.** {{file-type-categories-swallow-enum-failure}}

**Objects the API did not send.** {{value-structs-flattened-into-present-blocks}} {{browser-control-pin-skips-empty-profile}}

## Fields declared but not returned

**Omitted criteria.** {{url-filtering-criteria-dropped}} {{traffic-capture-ipv6-groups-dropped}} {{location-association-arrays-dropped}}

**Switched-off and unfillable fields.** {{ssl-inspection-fields-switched-off-in-source}} {{workload-group-blocks-flattened-to-id-and-name}} {{external-id-attributes-cannot-be-populated}}

**Collection output.** {{firewall-filtering-collection-mode-omits-fields}}

**Other omissions.** {{declared-or-sdk-fields-never-populated}}

Secrets exposed by data sources are in [[shared.terraform.credential-handling]]; the resource-side counterparts of these fidelity gaps are in [[zia.terraform.field-fidelity]], swallowed read errors in [[zia.terraform.error-handling]], and the ZPA equivalents in [[zpa.terraform.data-source-fidelity]] and [[zpa.terraform.data-source-selection]].
