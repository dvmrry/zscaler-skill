# ZIdentity resource servers (API resources): a read-only registry of the scopes API clients can select (zidentity.resource-servers)
Also called: zidentity resource servers; api resources zidentity; list_resource_servers; serviceScopes; defaultApi resource server; primaryAud; zapsOnboarded; create resource server
Former IDs: zid-23, zid-24, zid-25

Resource servers are what the console calls API resources: the scopes an API client can be given. API resources are the Zscaler APIs available through the OneAPI gateway: collections of Zscaler API endpoints representing data entities, services or functions that API clients can access. [zidentity.resource-servers:definition]

**Where they come from.** API resources are created automatically, based on the RBAC roles applicable to the APIs within the various Zscaler services. [zidentity.resource-servers:auto-created] API resources exist for the Zscaler services linked to Authentication Service, and an API client can access the API resources of those linked services. [zidentity.resource-servers:linked-services] The contract offers only GET on the resource server collection and on a single resource server: neither path has an operation to create, change or delete a resource server. [zidentity.resource-servers:read-only] The contract has no operation to create, change or delete a resource server's scopes either. [zidentity.resource-servers:scopes-no-write-path]

**The record.** A resource server record carries `id`, `name`, `displayName`, `description`, `primaryAud`, `defaultApi` and `serviceScopes`, all marked required; each service scope pairs a `service` with its `scopes`. [zidentity.resource-servers:record-required] The contract describes `primaryAud` as the resource server's primary audience, and `defaultApi` only as whether the resource server is set as the default API. [zidentity.resource-servers:primary-aud-and-default-api] What `defaultApi` changes is open [gap:zidentity.resource-servers:default-api-behavior], as is what a resource server with no service scopes means [gap:zidentity.resource-servers:empty-service-scopes].

**Services inside a record.** The contract marks a service's `cloudName` (the cloud hosting it) and `orgName` (the organization associated with it) as required. [zidentity.resource-servers:service-cloud-org-required] The Go SDK has seen services without those two fields [divergence:zidentity.resource-servers:service-cloud-org]. The Go SDK's service model also carries `externalName`, which has matched `name` in every response its authors observed, and `zapsOnboarded`, which is undocumented and was observed false for every service on the tenants examined. [zidentity.resource-servers:go-extra-service-fields] Neither `externalName` nor `zapsOnboarded` is in the contract's service schema, and the Python service model reads only `id`, `name`, `displayName`, `cloudName` and `orgName`. [zidentity.resource-servers:extra-fields-not-in-contract]

**Linking to API clients.** An API client's `clientResources` lists the resource servers it may reach and the scopes selected on each; the Go SDK says to resolve those resource and scope IDs with its resource servers package. [zidentity.resource-servers:clients-reference-resources] A resource server record does not list the API clients that use it, so finding them means reading each client's `clientResources`. [zidentity.resource-servers:no-back-reference] The scope IDs are passed to the client unchanged: [A selected scope's ID is the composite ID the resource servers report, passed through unchanged: its shape is `<serviceId>:<zpaScopeId>:<id>` with the middle segment empty for every service except ZPA. The Go SDK records, as confirmed against a tenant, that splitting it into separate fields is rejected with "400 Invalid Input for clientResources".](kb:zidentity.api-clients:scope-id-composite).

**Listing them.** Lists page like every ZIdentity list: [Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages](kb:zidentity.api.pagination). Whether the list shows every resource server or hides internal ones is open [gap:zidentity.resource-servers:enumerability]. Go's name lookup filters on the client: [The Go `GetByName` functions for API clients, groups, resource servers and users request pages of 100 records, moving the offset on by each page's record count until a page comes back short or with no next link, and keep the records whose name contains the search string, ignoring case; for users the compared field is the display name, not the login name; they return the matches collected with a nil error, so no match is not an error.](kb:zidentity.sdk-go:getbyname-client-side). Python's get method is annotated loosely: [Several signatures and docstrings disagree on ID types: `get_group` annotates `group_id` as int, and the docstrings of `get_api_client` and `get_resource_server` call the ID an int while their signatures take str; `get_resource_server` is annotated `APIResult[dict]` but returns a `ResourceServersRecord`.](kb:zidentity.sdk-python:annotation-mismatches).

What to check:
1. For a resource or scope missing when building an API client, whether the product is linked to Authentication Service and has an API role, since resources are created from those roles.
2. Which API clients use a resource server, by reading the clients' `clientResources`, since the resource server lists none.
3. Whether code reading a service's `cloudName` or `orgName` tolerates them being absent for the ZIdentity and Z-Insights services.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.resource-servers:scopes-no-write-path] Tier B: Rests on a search of every path in zid.openapi.json: the only paths naming resource servers or scopes are /resource-servers and /resource-servers/{id}, both GET-only; no scope path exists to check directly.
- [zidentity.resource-servers:no-back-reference] Tier B: The record's required list is also its complete property list in the contract at the pin; no client field appears.

Sources disagree (name both sides):
- The contract requires `cloudName` and `orgName` on every service in a resource server, while the Go SDK records that services that are not cloud-scoped, ZIAM and ZINSIGHTS, come without either. [divergence:zidentity.resource-servers:service-cloud-org]
  - api-specs: Both fields are always present.
  - sdk-go: The ZIAM and ZINSIGHTS services carry neither field.
  Impact: A strict client generated from the contract can fail to decode a resource server that includes the ZIdentity or Z-Insights service; treat both fields as optional.

Not known (open gaps):
- What a resource server's `defaultApi` flag changes [gap:zidentity.resource-servers:default-api-behavior]: settled by source-read or lab-test. Blocks: explaining why a client reaches a resource it was not given explicitly
- What a resource server with an empty `serviceScopes` list means [gap:zidentity.resource-servers:empty-service-scopes]: settled by tenant-data. Blocks: building an API client from a resource server that lists no scopes
- Whether listing resource servers returns all of them, or hides Zscaler-internal ones [gap:zidentity.resource-servers:enumerability] (data gap): filled by live or operator; run `zscalerctl zidentity resource-servers list`; settled by tenant-data. Blocks: treating the API's list as the full set of selectable resources

Area: zidentity.resource-servers, its subjects in references/_meta/spine/zidentity/zidentity.resource-servers.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
- links-to references/_meta/text/zidentity/zidentity.api.pagination.md (Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages)
- links-to references/_meta/text/zidentity/zidentity.sdk-go.md (Go SDK for ZIdentity (ziam services): name lookups, write models and where its paths depart from the contract)
- links-to references/_meta/text/zidentity/zidentity.sdk-python.md (Python SDK for ZIdentity (client.zid): where its models and keys depart from the API)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
