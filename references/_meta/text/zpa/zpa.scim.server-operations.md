# The Private Access SCIM server API: operations, paging and request rules (zpa.scim.server-operations)
Also called: SCIM APIs ZPA; custom SCIM client; SCIM API examples; scim1.private.zscaler.com; userdb; SCIM Users endpoint

Custom SCIM clients can call Zscaler's SCIM server. The SCIM APIs allow custom SCIM clients to make REST API calls to Zscaler, authenticated with the Bearer Token. All SCIM APIs are rate limited, and the page directs the reader to Zscaler Support for details. The example host scim1.private.zscaler.com and the SCIM Service Provider Endpoints might differ depending on the organization's IdP configuration. [zpa.scim.server-operations:custom-clients-rate-limited]

**Operations.** The SCIM API pages list operations under a /scim/<userdb>/<idpId>/v2 path. Users: fetch all, create, fetch by ID, update by PUT or PATCH, and delete. Groups: fetch all, create, fetch by ID, fetch with pagination and sort, update by PUT or PATCH, and delete. [zpa.scim.server-operations:operations] The examples partially update a user with PATCH using the add, replace and remove operations, and a group with PATCH using the add operation. [zpa.scim.server-operations:patch-operations] The userId in a user request is the Internal User ID from the SCIM Users page and the groupId is the Internal Group ID from the SCIM Groups page (Administration > Private Access Authentication). Older SCIM users and groups can still use a numerical value, for example 290277. [zpa.scim.server-operations:ids]

**Paging.** Paging uses startIndex and count, both optional integers. If not specified, a fetch of users returns 10 users by default and at most 100. [zpa.scim.server-operations:paging] This agrees with [The Go SCIM list helper uses itemsPerPage 10 when the input is not positive and caps it at 100, sends one-based startIndex and count, and reads the envelope members Resources and totalResults. The management API's v2 IdP list instead takes page and pagesize query parameters, with a default page size of 20 and a maximum of 500.](kb:zpa.api.idp-scim-wire:scim-helper-page-limits).

**Request rules.** Group information sent in a create, update or partial update of a user is ignored; user-group memberships can only be updated with the create, update or partial update requests for groups. [zpa.scim.server-operations:groups-only-via-group-requests] Users in a group are not sent by the fetch-all-groups endpoint and are only returned by the fetch-group-by-ID endpoint. If present, the excludeAttributes query parameter is honored and the excluded attributes are not sent in the response body. [zpa.scim.server-operations:members-only-by-id] The server responds with 204 No Content on a successful user delete, group partial update and group delete. [zpa.scim.server-operations:204-responses]

**Open points.** The rate limit value [gap:zpa.scim.server-operations:rate-limit-value], the type of the active field and the request content type [gap:zpa.scim.server-operations:example-inconsistencies], and the values userdb can take [gap:zpa.scim.server-operations:userdb-values] are not stated.

Enabling SCIM and the bearer token are in [Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides](kb:zpa.scim.setup); ZIA's SCIM operations are in [ZIA SCIM server operations, paging and rate limit](kb:zia.scim.operations).

What to check:
1. Whether the user or group ID in a request is the Internal User ID or Internal Group ID from the SCIM Users or SCIM Groups page.
2. Whether a group membership change is sent as a group request, since group information in a user request is ignored.
3. Whether members of a group are being read from fetch-all-groups, which does not return them.

Not known (open gaps):
- The SCIM API rate limit value [gap:zpa.scim.server-operations:rate-limit-value]: settled by support-ticket
- Type of active and content type in the examples [gap:zpa.scim.server-operations:example-inconsistencies]: settled by lab-test
- Values the userdb path segment can take [gap:zpa.scim.server-operations:userdb-values]: settled by support-ticket or tenant-data

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zia/zia.scim.operations.md (ZIA SCIM server operations, paging and rate limit)
- links-to references/_meta/text/zpa/zpa.api.idp-scim-wire.md (IdP, SCIM and SAML attribute API: wire keys, types and the Go SCIM client)
- links-to references/_meta/text/zpa/zpa.scim.setup.md (Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides)
