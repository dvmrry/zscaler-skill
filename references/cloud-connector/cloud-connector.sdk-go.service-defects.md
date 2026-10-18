These are defects in the Cloud and Branch Connector (ZTW) package of the Go SDK, where a helper decides what the caller sees or sends and the caller cannot tell. The ZTC provider at v0.2.0 (SDK v3.8.40) reaches some and not others; each claim says which. Each is a statement about the client; what the ZTC API returns in the triggering situation is server behavior these claims do not settle. Content-Type matching and bulk-delete handling for ZTW are in [[shared.sdk-go.request-handling]], paging in [[shared.sdk-go.list-pagination]], and omitted zero values in [[shared.sdk-go.zero-value-writes]]; the ZIA equivalents of several items here are in [[zia.sdk-go.service-defects]] and [[zia.sdk-go.write-encoding]].

## Wrong result and unusable helpers

The admin-user update returns success with an empty object, because it type-asserts a value where the shared updater returns a pointer. {{update-admin-user-zero-result}} {{admin-user-update-not-called-by-provider}}

The public-cloud change-state helper can never send a request. {{public-cloud-change-state-nil-payload}} {{change-state-not-called-by-provider}}

## Legacy routing

In legacy-client mode the generic client methods belong to ZIA. ZTW services that use them are sent to the wrong client; see [[zcc.sdk-go.legacy-routing]] for the same defect in ZCC. {{ztw-services-use-generic-legacy-path}} {{legacy-ztw-only-client-fails-generic-calls}} If a ZTC deployment uses legacy mode and activation or the provisioning URL fail with a "legacy client not set" error, this is the cause; the default OneAPI mode is not affected.

## Update results dereferenced without a check

Update functions that ignore the result of their type assertion panic if the shared updater returns nothing. {{ztw-update-deref-after-ignored-assertion}} {{ztw-update-deref-same-pattern}} {{provider-reaches-ztw-update-deref}} Whether any ZTC endpoint answers a PUT with an empty body is open, so check the live status codes before treating this as latent; the rule update path also interacts with reordering ([[cloud-connector.terraform.rule-order]]).

## Pointer arguments dereferenced before validation

{{pointer-mutators-deref-before-nil-check}} {{pointer-mutators-same-pattern}} {{provider-passes-non-nil-pointers}}

## Zero values in the written body

The location model holds its VPC information by value, so a location written without it carries an empty nested object. {{location-vpc-info-value-structs}} {{location-write-emits-empty-vpc-object}}

The location template sends `editable` as false whenever the provider does not set it. {{location-template-editable-always-false}} When a template update appears to change fields the configuration never mentions, compare the PUT body with a fresh read.
