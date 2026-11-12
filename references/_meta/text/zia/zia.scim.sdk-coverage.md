# What the Go and Python SDKs do for ZIA SCIM (zia.scim.sdk-coverage)
Also called: go sdk scim zia; scim_api; NewZIAScimService; ZIA_SCIM_API_TOKEN; GetAllUsers scim; python sdk scim zia; sdk scim patch bulk

Use this when a script built on the SDK behaves differently from the REST behavior in [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations). These claims are about the client, not the service.

**Coverage.** The Go SDK has a ZIA SCIM client with get, get by name, create (POST), update (PUT), delete and list-all functions for users, and the matching functions for groups. [zia.scim.sdk-coverage:go-surface] The Go SCIM client has no PATCH or Bulk call, so partial updates and bulk modification against ZIA need direct HTTP. [zia.scim.sdk-coverage:go-no-patch-bulk] The Python SDK has no ZIA SCIM client; the only SCIM mention under its ZIA package is the directory_sync_migrate_to_scim_enabled authentication-settings field. [zia.scim.sdk-coverage:python-none]

**What the user struct can carry.** The Go SCIMUser struct carries schemas, id, userName, displayName, the enterprise extension (department) and meta. It has no groups, active, externalId, emails or name fields. [zia.scim.sdk-coverage:user-struct] Because SCIMUser has no active, groups or externalId field, a create or update through the Go SDK cannot disable a user or set group membership from the user side or an external ID; membership can be set only through the group's members list. [zia.scim.sdk-coverage:cannot-send-active]

**Defects and traps.** GetAllUsers returns []SCIMGroup, not users, so a user list read through it is decoded into the group struct and loses userName and the department extension. [zia.scim.sdk-coverage:getall-users-type] GetUserByName and GetGroupByName take a displayName and match it case-insensitively against the display name through a search, returning the first match; GetUserByName does not match userName. [zia.scim.sdk-coverage:byname-display]

**Paging.** List-all and by-name calls use POST /Users/.search or /Groups/.search with a page size capped at 100, advance startIndex by the requested page size rather than the number returned, and stop when startIndex plus the page size exceeds totalResults or a page is empty. [zia.scim.sdk-coverage:go-paging] Because the server's totalResults is only an estimate above 10K until the last page, the SDK's stop condition can end a large list early or run past the end, and the 100-per-page search path differs from the 1,000-per-page REST GET. [zia.scim.sdk-coverage:go-paging-estimate] The ZPA SCIM helper advances the same way, see [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination).

**Connection.** The ZIA SCIM client is separate from the OneAPI client: it takes ZIA_SCIM_API_TOKEN and ZIA_SCIM_TENANT_ID (plus a cloud), builds https://scim.<cloud>.net/<tenant ID>/scim, and sends the token as a Bearer header with content type application/scim+json. [zia.scim.sdk-coverage:go-client-config] NewZIAScimService leaves the client's RateLimiter nil, and the SCIM client throttles only if one is set, so SDK loops are not paced to the server's 5 requests per second. [zia.scim.sdk-coverage:no-limiter] The SDK's URL shape differs from the help's base URL [divergence:zia.scim.sdk-coverage:scim-base-url].

Other ZIA Go SDK defects are in [ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input](kb:zia.sdk-go.service-defects).

What to check:
1. Whether the call goes through the .search path or raw REST, and the page size in use.
2. Whether a list is complete against the tenant count.
3. Whether the SCIM token, not a OneAPI credential, is configured.

Inferred, not quoted (say so when an answer rests on one):
- [zia.scim.sdk-coverage:go-no-patch-bulk] Tier B: Search run: `git -C vendor/zscaler-sdk-go grep -n -i "patch\|bulk" HEAD -- zscaler/zia/services/scim_api` returned nothing.
- [zia.scim.sdk-coverage:python-none] Tier B: Search run: `grep -rli scim vendor/zscaler-sdk-python/zscaler/zia` returned only authentication_settings.py and models/authentication_settings.py (v1.10.0 pin).
- [zia.scim.sdk-coverage:cannot-send-active] Tier B: Client-side only: derived from the struct and the omitempty request body; a caller could still reach the endpoint with their own HTTP.
- [zia.scim.sdk-coverage:go-paging-estimate] Tier B: Derived from the helper's stop rule and the documented estimate; the direction and size of the estimate error are not documented, and the ZPA helper has the same shape (see the shared list-pagination subject).
- [zia.scim.sdk-coverage:no-limiter] Tier B: Client-side: the construction leaves the limiter nil and DoRequest waits only when it is non-nil; the server limit comes from the help article.

Sources disagree (name both sides):
- The SDK builds a SCIM base URL without the IdP ID that the help's base URL carries. [divergence:zia.scim.sdk-coverage:scim-base-url]
  - zscaler-help: The base URL is scim.<cloud>/<Organization ID>/<IdP ID>/scim.
  - sdk-go: The SDK uses scim.<cloud>.net/<tenant ID>/scim, with no IdP ID.
  Impact: Whether the SDK URL reaches the same server as an IdP-specific URL, and whether the tenant ID equals the Organization ID, is not shown by either source; test against the tenant before relying on the SDK's URL.

Area: zia.scim, its subjects in references/_meta/spine/zia/zia.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ad-integration.directory-sync.md (Directory (LDAP/AD) synchronization behavior), from zia.scim: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- interacts-with references/_meta/text/zia/zia.ad-integration.saml-auto-provisioning.md (SAML auto-provisioning: what login creates and overwrites), from zia.scim: SAML auto-provisioning is to be disabled when SCIM provisioning is enabled for an IdP. [zia.ad-integration.saml-auto-provisioning:scim-excludes]
- depends-on references/_meta/text/zia/zia.authentication.methods.md (SAML and Kerberos: what each needs to work), from zia.scim: Zscaler supports only SCIM version 2.0, and SAML must be the authentication method to use SCIM for provisioning. [zia.scim.setup:scim2-and-saml]
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
- links-to references/_meta/text/zia/zia.sdk-go.service-defects.md (ZIA Go SDK service functions that return wrong results, mutate inputs, or reject valid input)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.scim.md (ZIA SCIM provisioning)
