A ZIA data source is supposed to be a faithful read-only view of an object. In the provider it is a hand-written pair of a schema and a flattener, fed by an SDK model, and the three drift apart in a few repeatable ways. When a data source gives a surprising answer, compare the schema, the flattener and the SDK model before suspecting the tenant (the write-side version of this is in [[zia.terraform.field-fidelity]]). What the ZIA API returns for any given object is server behavior; the claims below say what the client code does with whatever comes back (the open questions are in the gaps).

## Reads that crash or fail

Two reads can take the provider process down. {{sandbox-rss-signature-sources-scalar-in-set}} {{sandbox-rss-scalar-set-panics}} {{gre-vip-negative-required-count-slices}}

Another failure mode is a read that fails because the flattener emits a key the schema does not declare, or the wrong shape for one it does. {{dlp-web-excluded-lists-emit-undeclared-name}} {{forwarding-control-segment-key-misspelled-and-extensions}} {{static-ip-managed-by-emits-undeclared-extensions}} {{flatten-schema-shape-mismatch-elsewhere}} {{browser-control-data-source-sets-undeclared-keys}} {{undeclared-key-write-errors}}

The consequence is data-dependent, so the same data source can work on one tenant and fail on another, except browser control, which fails whenever the API responds, depending on whether the object has the offending element. Check the failing object's shape before concluding the data source is broken everywhere. The DLP endpoint resource group tag data source has two separate defects. {{endpoint-tag-multi-result-id-not-numeric}} {{endpoint-tag-id-lookup-uses-association-endpoint}}

## Selectors that do not select

A data source that accepts a selector and ignores it returns another object or ignores the filter without complaint, which is the worst case for a reference used in policy. {{devices-unused-selectors-fall-back-to-first-device}} {{domain-profiles-id-selector-never-read}} {{dc-exclusions-invalid-id-selects-everything}} {{predefined-rule-count-never-sent}}

When two selectors are given, check what the code does with disagreement. {{id-and-name-first-match-wins}}

Boolean and numeric filters built with `GetOk` cannot express false or zero. {{gre-vip-false-and-zero-filters-dropped}} {{gre-vip-empty-id-without-source-ip}}

Name matching is also inconsistent with the SDK's own helpers, and a schema can accept a configuration the read then refuses. {{case-sensitive-name-lookups-diverge-from-sdk}} {{rule-type-optional-in-schema-required-at-read}}

## Success-shaped empty and partial results

A lookup that finds nothing should be an error. Several are not, so downstream expressions receive an empty list and carry on. {{cloud-applications-name-filter-empty-success}} {{datacenter-lookups-no-match-succeed}} A different case is a search that drops errors part-way: it still errors when nothing is found, but can miss an entry in a scope whose request failed. {{file-type-categories-swallow-enum-failure}}

The reverse also happens: an object the API did not send is shown as present. {{value-structs-flattened-into-present-blocks}} {{browser-control-pin-skips-empty-profile}} For the pinned commit, only the browser control case is fixed; the others are unchanged.

## Fields declared but not returned

This is the largest group, and the most consequential instances are policy criteria: a data source that omits a restriction makes a narrower rule look broader. The URL filtering, traffic capture and location cases are the ones to check first. {{url-filtering-criteria-dropped}} {{traffic-capture-ipv6-groups-dropped}} {{location-association-arrays-dropped}}

Some fields are switched off in the source, and some richly declared blocks can never be filled. {{ssl-inspection-fields-switched-off-in-source}} {{workload-group-blocks-flattened-to-id-and-name}} {{external-id-attributes-cannot-be-populated}}

The collection output of the firewall filtering rule data source is a poorer copy of its single-rule output. {{firewall-filtering-collection-mode-omits-fields}}

The remaining omissions follow the same pattern. {{declared-or-sdk-fields-never-populated}} When a data source attribute is empty, search the data source file for the snake_case key: one hit, in the schema, means it is never set.

Secrets exposed by data sources are in [[shared.terraform.credential-handling]]; the resource-side counterparts of these fidelity gaps are in [[zia.terraform.field-fidelity]], swallowed read errors in [[zia.terraform.error-handling]], and the ZPA equivalents in [[zpa.terraform.data-source-fidelity]] and [[zpa.terraform.data-source-selection]].
