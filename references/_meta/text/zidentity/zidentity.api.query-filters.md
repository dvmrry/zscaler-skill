# ZIdentity list filters on the wire: key spelling, [like] matching and list values (zidentity.api.query-filters)
Also called: excludedynamicgroups; excludeDynamicGroups; loginname[like]; zidentity filter not working; zid list_users login_name filter; zidentity query parameter spelling

The filter names are generated with each list operation; what matters here is how each client spells them on the wire. The contract spells the user filters in run-together lowercase (`loginname`, `loginname[like]`, `displayname[like]`, `primaryemail[like]`, `domainname`, `idpname`) and the group filter as `excludedynamicgroups`; `name[like]` filters API clients, groups and resource servers. [zidentity.api.query-filters:contract-keys]

**Go.** The Go SDK sets the query keys `excludedynamicgroups`, `loginname`, `loginname[like]`, `displayname[like]`, `primaryemail[like]`, `domainname`, `idpname` and `name[like]`, written with the brackets in the key string. [zidentity.api.query-filters:go-keys]

**Python.** The Python SDK's docstrings name the filters in snake_case: `login_name`, `login_name[like]`, `display_name[like]`, `primary_email[like]`, `domain_name` and `idp_name` for users, and `exclude_dynamic_groups` for groups. [zidentity.api.query-filters:python-docstring-keys] The Python request executor classifies any URL containing `/ziam/admin/api/v1` as the `ziam` service, and for every service other than ZPA it camel-cases the query parameter keys. [zidentity.api.query-filters:python-params-camel-cased] [The camel-casing helper returns a key from its exceptions table as mapped and leaves a key without an underscore unchanged; otherwise it splits on underscores, lowercases the first part, capitalizes every later part and joins them.](kb:shared.sdk-python.request-handling:camel-rule) So a Python caller using the docstring names sends `loginName`, `loginName[like]`, `displayName[like]`, `primaryEmail[like]`, `domainName`, `idpName` and `excludeDynamicGroups`; only `name[like]`, `offset` and `limit` go out as the contract spells them. [zidentity.api.query-filters:python-wire-keys] The Python keys therefore differ from the contract's [divergence:zidentity.api.query-filters:filter-key-spelling], and whether the server accepts them anyway is open [gap:zidentity.api.query-filters:filter-key-case]. A Python caller can send the contract's spelling by passing it as the key (`loginname`, `excludedynamicgroups`), since a key without an underscore is not changed. [zidentity.api.query-filters:python-contract-spelling-passes]

**List-valued filters.** The contract and Go encode several login names, domains or identity providers differently [divergence:zidentity.api.query-filters:array-encoding].

**Partial matches.** The contract describes the user (`loginname[like]`, `displayname[like]`, `primaryemail[like]`), group and resource-server `[like]` filters as case-insensitive partial matches, but the API-client `name[like]` only as a partial match. [zidentity.api.query-filters:like-descriptions] The Go API-client `GetByName` does not use the server-side `name[like]` filter because its matching semantics are undocumented; it pages through all clients and matches on the client instead. [zidentity.api.query-filters:go-getbyname-avoids-like]

What to check:
1. Whether a Python filter on users or groups was passed with the contract's spelling (`loginname`, `excludedynamicgroups`) rather than the SDK docstring's snake_case, which goes out camel-cased.
2. Whether a filter on several login names, domains or identity providers matched only one value, which points at the list encoding.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.api.query-filters:python-wire-keys] Tier B: Follows from applying the helper's rule to the docstring keys; none of these keys appears in the exceptions table at the pin (searched).
- [zidentity.api.query-filters:python-contract-spelling-passes] Tier B: Follows from the helper's rule; not exercised by an SDK test or example.

Sources disagree (name both sides):
- The contract and Go spell the user and group filters in run-together lowercase, while the Python SDK, called with its documented snake_case names, sends camelCase keys. [divergence:zidentity.api.query-filters:filter-key-spelling]
  - api-specs: The query keys are `excludedynamicgroups`, `loginname`, `domainname`, `idpname` and the lowercase `[like]` forms.
  - sdk-go: Go sends the contract's spellings.
  - sdk-python: Python documents `exclude_dynamic_groups`, which its executor sends as `excludeDynamicGroups`.
  Impact: If the server matches query keys exactly, a Python filter written as documented is ignored and the call returns the unfiltered list, with no error; a Go call and a raw call following the contract filter as intended.
- For list-valued filters the contract sets `explode` to false, which in OpenAPI's default form style means one comma-separated value, while the Go SDK repeats the key once per value. [divergence:zidentity.api.query-filters:array-encoding]
  - api-specs: `loginname` (and `domainname`, `idpname`) is an array parameter with `explode` false.
  - sdk-go: Go adds one `loginname` (or `domainname`, `idpname`) pair per value.
  Impact: With more than one value, a server that follows the contract may read only one of Go's repeated keys, and a server that expects repeated keys may read a comma-separated value as one name. A single value is sent the same way by both.

Not known (open gaps):
- Whether the ZIdentity API accepts camelCase or snake_case filter keys [gap:zidentity.api.query-filters:filter-key-case] (data gap): filled by operator; settled by lab-test. Blocks: trusting a filtered Python list result

Area: zidentity.api, its subjects in references/_meta/spine/zidentity/zidentity.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered), from zidentity.api: The Python SDK's ZIdentity service classes set the base endpoint `/ziam/admin/api/v1`, and its request executor resolves the OneAPI gateway base URL to a dedicated gateway for a government (FedRAMP) cloud, otherwise to https://api.<cloud>.zsapi.net when a cloud other than `production` is configured, and to https://api.zsapi.net by default. [zidentity.api:python-route]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zidentity.api: Creating an API client through the API (POST /api-clients) requires a bearer token, as do the contract's other API client, group, resource server and user operations, so the first API client cannot be created through the API and has to come from the Admin Console. [zidentity.api:bearer-on-every-operation]
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths), from zidentity.api: The ZIdentity contract declares the server https://api.zsapi.net/ziam/admin/api/v1, described as the Authentication Service endpoint. [zidentity.api:contract-server]
- links-to references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
