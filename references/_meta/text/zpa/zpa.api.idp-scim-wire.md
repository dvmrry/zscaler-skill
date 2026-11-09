# IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client (zpa.api.idp-scim-wire)
Also called: useCustomSPMetadata; autoProvision string; ssoType USER ADMIN; SCIM base url cloud; application/scim+json; scim user active false; scim attribute header delta; sortOrder DSC

Wire details of the IdP, SAML attribute and SCIM objects and the Go SCIM protocol client. Endpoint lists and model fields are in [The SCIM API, SDK and Terraform read surface in ZPA](kb:zpa.scim.api-surface) and [The SAML attribute API, SDK and Terraform surface](kb:zpa.saml-attributes.api-surface); the SearchValues domain stripping and the page-advance defects are in [The SCIM API, SDK and Terraform read surface in ZPA](kb:zpa.scim.api-surface) and [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination).

## IdP

The Go IdP service reads a single IdP from the mgmtconfig v1 path and lists IdPs, and resolves them by name, from the v2 path; the OpenAPI document lists the same split. [zpa.api.idp-scim-wire:idp-v1-get-v2-list] The IdP key for custom SP metadata is `useCustomSPMetadata` with SP fully uppercased, in the Go struct tag, the Python model and the OpenAPI schema. [zpa.api.idp-scim-wire:idp-use-custom-sp-metadata-key] The IdP domain list key is `domainList`, although the Go field is named Domainlist; a recorded response for an ADMIN-type IdP lists domains ending in .zslogin.net and .zpa-customer.com next to the customer's own domain. [zpa.api.idp-scim-wire:idp-domainlist-key-and-synthetic-domains]

[divergence:zpa.api.idp-scim-wire:idp-numeric-fields-string-or-integer] Recorded IdP responses carry ssoType ["USER"] for one IdP and ["ADMIN"] for another; the OpenAPI schema types ssoType as an array of strings. [zpa.api.idp-scim-wire:idp-sso-type-observed-values] Whether SCIM reads depend on a USER IdP is open [gap:zpa.api.idp-scim-wire:scim-needs-user-sso-type].

In the Go IdP structs every AdminMetadata field is serialized without omitempty, while in UserMetadata only spBaseUrl is, and the Python ServiceProvider model defaults spEntityId, spMetadataUrl and spPostUrl to boolean False when the key is absent. [zpa.api.idp-scim-wire:idp-metadata-serialization] The Python IDPController model and the OpenAPI IdP schema carry delta, iamIdpId, migrationDetail, oneIdentityEnabled and certificates; the Go IdpController struct has none of them, so a Go read drops them. [zpa.api.idp-scim-wire:idp-fields-python-and-api-only]

## SCIM and SAML attributes

The SCIM group list documents sortOrder as ascending (ASC) or descending (DSC) and defaults to DSC. [zpa.api.idp-scim-wire:scim-group-sort-order-dsc] In the OpenAPI document the SCIM group list by IdP (/userconfig/v1/.../scimgroup/idpId/{idpId}) returns list, totalCount and totalPages with no currentCount, while the mgmtconfig SAML attribute and SCIM attribute lists also carry currentCount. [zpa.api.idp-scim-wire:scim-group-list-envelope] The Go ScimAttributeHeader struct tags creationTime as `creationTime,omitempty,` with a trailing comma. [zpa.api.idp-scim-wire:scim-attribute-header-creation-time-tag] The Python SCIMAttributeHeader model and the OpenAPI schema carry a delta field; the Go ScimAttributeHeader struct has none. [zpa.api.idp-scim-wire:scim-attribute-header-delta] The Go SAML attribute GetByName compares names with ==, so it is case-sensitive, unlike the SCIM attribute header lookup, which uses strings.EqualFold. [zpa.api.idp-scim-wire:saml-attribute-by-name-exact]

## Go SCIM protocol client

The Go SCIM configuration is built once per process inside a sync.Once and every later NewScimConfig call returns that same configuration, so one process targets one IdP ID. [zpa.api.idp-scim-wire:scim-config-singleton] The Go SCIM client maps the cloud name to a base URL: PRODUCTION (the default) scim1.private.zscaler.com, BETA scim1.zpabeta.net, ZPATWO scim1.zpatwo.net, GOV scim1.zpagov.net, GOVUS scim1.zpagov.us and PREVIEW scim1.zpapreview.net, each under /scim/1/ followed by the IdP ID. [zpa.api.idp-scim-wire:scim-cloud-base-urls] The Go SCIM client always sends Content-Type application/scim+json and a bearer token, a different client from the one that sends application/json to the ZPA management API. [zpa.api.idp-scim-wire:scim-requests-use-scim-json]

The Go SCIM list helper uses itemsPerPage 10 when the input is not positive and caps it at 100, sends one-based startIndex and count, and reads the envelope members Resources and totalResults. The management API's v2 IdP list instead takes page and pagesize query parameters, with a default page size of 20 and a maximum of 500. [zpa.api.idp-scim-wire:scim-helper-page-limits] The Go GetUserByName takes a userName argument but matches it against DisplayName, so a user whose display name differs from the login name is not found by login name. [zpa.api.idp-scim-wire:scim-user-lookup-by-display-name] The Go ScimUser tags active with omitempty and UpdateUser sends the struct in a PUT, so an update that sets Active false sends no active member. [zpa.api.idp-scim-wire:scim-user-active-omitempty]

The Go IdpName, IamIdpID and IamIdpName fields have no counterpart in the contract's SCIM group or the recorded response: The Go ScimGroup struct has an `idpName` field, while the OpenAPI SCIM group response lists creationTime, id, idpGroupId, idpId, internalId, modifiedTime and name, and a recorded SCIM group list in the Python integration cassette carries id, modifiedTime, creationTime, name, idpId, idpGroupId and internalId with no idpName. The Go struct also carries `iamIdpId` and `iamIdpName`, used by a `GetByNameAndIamIdp` lookup, and neither the contract's SCIM group response nor the recorded list has them. [zpa.api.idp-scim-wire:scim-group-idpname]

Listing a SCIM group set by IdP returns every group and leaves name filtering to the caller: The Go `GetAllByIdpId` for SCIM groups passes only SortBy and SortOrder in its filter, while `GetByName` passes the name as Search, so listing all groups of an IdP applies no server-side name filter. [zpa.api.idp-scim-wire:scim-get-all-by-idp-no-search]

What to check:
1. Whether an IdP number field was decoded as a string, as the recordings and the Go SDK do.
2. Whether a Go IdP read lacks delta, iamIdpId, migrationDetail, oneIdentityEnabled or certificates because the struct drops them.
3. Whether a SCIM user was looked up by display name rather than login name.
4. Which SCIM cloud and IdP ID the process-wide configuration was built with.
5. Whether a SCIM user deactivation through the Go SDK sent active at all.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.idp-scim-wire:scim-group-idpname] Tier B: Absence claim: the contract schema and the recorded list entry do not contain idpName; the Python model has no such attribute either. The iamIdpId and iamIdpName fields are in the Go SDK since v3.8.50; the contract has iamIdpId only on the IdP object, not on SCIM groups (read from the whole OpenAPI document).

Sources disagree (name both sides):
- autoProvision and signSamlRequest are integers in the OpenAPI schema but strings in the Go struct and in a recorded response. [divergence:zpa.api.idp-scim-wire:idp-numeric-fields-string-or-integer]
  - api-specs: The OpenAPI schema types autoProvision (defaults to 0) and signSamlRequest (defaults to 1) as int32 integers.
  - sdk-python: A recorded response carries autoProvision "0" and signSamlRequest "1" as strings.
  - sdk-go: The Go IdpController struct types AutoProvision and SignSamlRequest as strings.
  Impact: A client that decodes these two members as integers fails on the recorded wire form; the Go SDK follows the string form. Compare the type before comparing values.

Not known (open gaps):
- Whether SCIM reads need an IdP whose ssoType includes USER [gap:zpa.api.idp-scim-wire:scim-needs-user-sso-type]: settled by lab-test. Blocks: choosing the IdP ID to pass to SCIM group and attribute calls

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.scim.api-surface.md (The SCIM API, SDK and Terraform read surface in ZPA)
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zpa/zpa.saml-attributes.api-surface.md (The SAML attribute API, SDK and Terraform surface)
