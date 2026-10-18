These are defects in the Cloud and Branch Connector (ZTW) package of the Go SDK, where a helper decides what the caller sees or sends and the caller cannot tell. The ZTC provider at v0.2.0 (SDK v3.8.40) reaches some and not others; each claim says which. Content-Type matching and bulk-delete handling for ZTW are in [[shared.sdk-go.request-handling]], paging in [[shared.sdk-go.list-pagination]], and omitted zero values in [[shared.sdk-go.zero-value-writes]]; the ZIA equivalents of several items here are in [[zia.sdk-go.service-defects]] and [[zia.sdk-go.write-encoding]].

## Wrong result and unusable helpers

**Admin user update.** {{update-admin-user-zero-result}} {{admin-user-update-not-called-by-provider}}

**Public-cloud change state.** {{public-cloud-change-state-nil-payload}} {{change-state-not-called-by-provider}}

## Legacy routing

**Generic calls in legacy mode.** {{ztw-services-use-generic-legacy-path}} {{legacy-ztw-only-client-fails-generic-calls}} The same defect in ZCC is in [[zcc.sdk-go.legacy-routing]].

## Update results dereferenced without a check

**Ignored assertion before dereference.** {{ztw-update-deref-after-ignored-assertion}} {{ztw-update-deref-same-pattern}} {{provider-reaches-ztw-update-deref}} Whether any ZTC endpoint answers a PUT with an empty body is open {{gap:ztw-update-empty-reply}}. The rule update path also interacts with reordering; see [[cloud-connector.terraform.rule-order]].

## Pointer arguments dereferenced before validation

{{pointer-mutators-deref-before-nil-check}} {{pointer-mutators-same-pattern}} {{provider-passes-non-nil-pointers}}

## Zero values in the written body

**VPC information.** {{location-vpc-info-value-structs}} {{location-write-emits-empty-vpc-object}} What the location API does with an empty object is open {{gap:ztw-empty-vpc-object-semantics}}.

**Location template.** {{location-template-editable-always-false}} Whether a template PUT replaces the whole object or merges is open {{gap:ztw-update-replaces-template}}.
