# Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages (zidentity.api.pagination)
Also called: zidentity pagination; ziam offset limit; next_link prev_link results_total; zidentity list only returns first page; ReadAllPagesWithPagination; zid list_users pagination

ZIdentity lists page by offset and limit rather than by page number. The list operations for users, groups, API clients, resource servers, a group's users and a user's groups take `offset`, the starting point for pagination, with the number of records that can be skipped before fetching results (minimum 0), and `limit`, the maximum number of records to return per request (minimum 0, maximum 1000). [zidentity.api.pagination:offset-limit]

**The envelope.** A list response object carries `results_total`, `pageOffset`, `pageSize`, `next_link`, `prev_link` and `records`, all marked required; the paging keys mix snake_case and camelCase. [zidentity.api.pagination:envelope-required] `next_link` is typed as a string: the URL of the next page of records, if available. [zidentity.api.pagination:next-link-string] The contract and both SDKs disagree on whether that envelope arrives as an object or inside an array [divergence:zidentity.api.pagination:list-response-shape]. No source gives the page size the API uses when `limit` is omitted [gap:zidentity.api.pagination:default-page-size].

**Go.** The Go SDK's list helper `ReadAllPagesWithPagination` requests 100 records per page when the caller passes no parameters, stops at the first page shorter than the limit or with an empty `NextLink`, advances the offset by the number of records received, and applies any JMESPath filter only after collecting every page. [zidentity.api.pagination:go-walk] The Go parameter builder turns a page size of 0 or less into 100 and caps one above 1000 at 1000; `WithLimit` keeps the previous limit when given a value outside 1 to 1000, and `WithOffset` ignores a negative offset, both without an error. [zidentity.api.pagination:go-limit-clamp] The Go name lookups page the same way and filter on the client: [The Go `GetByName` functions for API clients, groups, resource servers and users request pages of 100 records, moving the offset on by each page's record count until a page comes back short or with no next link, and keep the records whose name contains the search string, ignoring case; for users the compared field is the display name, not the login name; they return the matches collected with a nil error, so no match is not an error.](kb:zidentity.sdk-go:getbyname-client-side).

**Python.** The Python SDK's `list_users`, `list_groups`, `list_api_clients` and `list_resource_servers` each execute one request and wrap that one response body in a typed object (`Users`, `Groups`, `APIClients`, `ResourceServers`). [zidentity.api.pagination:python-single-page] For ZIdentity responses the Python response object keeps the body's `records` and `next_link`; `has_next()` is true whenever `next_link` is not None, and `next()` copies the query string of `next_link` into the request parameters, points the request at `next_link`'s scheme, host and path, and sends a GET. [zidentity.api.pagination:python-next] If the last page carries `next_link` as an empty string rather than omitting it, Python's `has_next()` stays true and `next()` repeats the request for the same page, so a loop that runs while `has_next()` never ends; the Go helper treats an empty `next_link` as the end. [zidentity.api.pagination:python-empty-next-link] What the last page carries in `next_link` is open [gap:zidentity.api.pagination:last-page-next-link]. The paging fields on the Python list objects themselves come back empty: [So on the Python list objects (`Users`, `Groups`, `APIClients`, `ResourceServers`) `results_total`, `next_link` and `prev_link` are always None: the keys reach the model as `resultsTotal`, `nextLink` and `prevLink`. `page_offset`, `page_size` and `records` are filled, since those keys have no underscore.](kb:zidentity.sdk-python:envelope-meta-lost).

What to check:
1. Whether a Python caller pages at all: a `list_*` call returns one page, so a count that stops at the first page's size points at a missing loop.
2. Whether a Python loop over `has_next()` ends, by checking what `next_link` the last page returns.
3. Whether a Go caller's limit was silently ignored because it was outside 1 to 1000.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.api.pagination:python-empty-next-link] Tier B: Conditional on the last-page value of `next_link`, which no source shows; the contract's marking it as a required string makes an empty string plausible but does not show it. `next()` changes the URL only when `next_link` is non-empty.

Sources disagree (name both sides):
- The contract types every list (and get-by-ID) 200 response as an array whose items are the envelope, while both SDKs decode a single envelope object. [divergence:zidentity.api.pagination:list-response-shape]
  - api-specs: GET /users returns an array of objects, each carrying the paging fields and `records`.
  - sdk-go: List endpoints answer with one paginated envelope object, which Go decodes into `PaginationResponse`; the secrets list is the exception that answers a bare array.
  - sdk-python: Python reads `records` and the paging keys from a ZIdentity body that is an object.
  Impact: A client generated from the contract would expect a top-level array for lists and single reads and fail to decode what the SDKs decode; hand-written callers should follow the SDKs' object envelope until a capture shows otherwise.

Not known (open gaps):
- How many records a ZIdentity list returns when `limit` is omitted [gap:zidentity.api.pagination:default-page-size] (data gap): filled by operator; settled by lab-test or tenant-data. Blocks: telling whether a Python list result is complete
- What `next_link` holds on the last page of a ZIdentity list [gap:zidentity.api.pagination:last-page-next-link] (data gap): filled by operator; settled by tenant-data or lab-test. Blocks: relying on the Python response object's `next()` to read a whole list

Area: zidentity.api, its subjects in references/_meta/spine/zidentity/zidentity.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered), from zidentity.api: The Python SDK's ZIdentity service classes set the base endpoint `/ziam/admin/api/v1`, and its request executor resolves the OneAPI gateway base URL to a dedicated gateway for a government (FedRAMP) cloud, otherwise to https://api.<cloud>.zsapi.net when a cloud other than `production` is configured, and to https://api.zsapi.net by default. [zidentity.api:python-route]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zidentity.api: Creating an API client through the API (POST /api-clients) requires a bearer token, as do the contract's other API client, group, resource server and user operations, so the first API client cannot be created through the API and has to come from the Admin Console. [zidentity.api:bearer-on-every-operation]
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths), from zidentity.api: The ZIdentity contract declares the server https://api.zsapi.net/ziam/admin/api/v1, described as the Authentication Service endpoint. [zidentity.api:contract-server]
- links-to references/_meta/text/zidentity/zidentity.sdk-go.md (Go SDK for ZIdentity (ziam services): name lookups, write models and where its paths depart from the contract)
- links-to references/_meta/text/zidentity/zidentity.sdk-python.md (Python SDK for ZIdentity (client.zid): where its models and keys depart from the API)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
- see-also references/_meta/text/zidentity/zidentity.api.query-filters.md (ZIdentity list filters on the wire: key spelling, [like] matching and list values)
