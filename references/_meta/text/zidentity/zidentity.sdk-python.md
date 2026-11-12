# Python SDK for ZIdentity (client.zid): where its models and keys depart from the API (zidentity.sdk-python)
Also called: client.zid; zscaler.zid; zid python sdk; zidentity python results_total None; get_api_client_secret empty; get_service_entitlement None; client_jw_ks_url; group source MANUAL

The Python SDK reaches ZIdentity as `client.zid.<service>`; its modules and methods are generated (`node scripts/kb.mjs surface zid`). The defects below come from how it converts keys and which model it builds from each response.

**Key conversion.** Before a ZIdentity model such as `Users` is built, `form_response_body` passes every key of the response, at every level, through the camel-casing helper, skipping keys whose value is None. [zidentity.sdk-python:form-response-camel] Request bodies and query keys are camel-cased the same way: [The Python request executor classifies any URL containing `/ziam/admin/api/v1` as the `ziam` service, and for every service other than ZPA it camel-cases the query parameter keys.](kb:zidentity.api.query-filters:python-params-camel-cased) and [The camel-casing helper returns a key from its exceptions table as mapped and leaves a key without an underscore unchanged; otherwise it splits on underscores, lowercases the first part, capitalizes every later part and joins them.](kb:shared.sdk-python.request-handling:camel-rule).

**List paging fields.** The ZIdentity list models read the paging fields under the API's own snake_case names: `results_total`, `next_link` and `prev_link`, beside `pageOffset`, `pageSize` and `records`. [zidentity.sdk-python:models-read-snake-envelope] So on the Python list objects (`Users`, `Groups`, `APIClients`, `ResourceServers`) `results_total`, `next_link` and `prev_link` are always None: the keys reach the model as `resultsTotal`, `nextLink` and `prevLink`. `page_offset`, `page_size` and `records` are filled, since those keys have no underscore. [zidentity.sdk-python:envelope-meta-lost] How Python pages is in [Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages](kb:zidentity.api.pagination).

**Array responses read as one object.** Listing an API client's secrets returns a JSON array of secret objects. [zidentity.sdk-python:secrets-response-array] `get_api_client_secret` builds a single `APIClientSecrets` object from the whole response body, and that model reads each of its four fields (`expiresAt`, `id`, `createdAt`, `value`) only if its key is `in` the configuration it was given. [zidentity.sdk-python:secrets-get-builds-one] So `get_api_client_secret` returns one secret object whose `id`, `created_at`, `expires_at` and `value` are all None, with no error, instead of the client's secrets: on a list, the key tests never match. [zidentity.sdk-python:secrets-list-into-object] `get_service_entitlement` builds a single `Service` model from the whole response body, and the contract returns service entitlements as an array of objects that each wrap a `service`. [zidentity.sdk-python:service-entitlement-builds-one] So `get_service_entitlement` returns one `Service` whose fields are all None, with no error, for a user who has service entitlements; the Go SDK's comment describes the same loss when it once read the array into bare service objects. [zidentity.sdk-python:service-entitlement-into-object] The administrative read is wrapped instead: `get_admin_entitlement` returns one `Entitlements` object built from the whole response; its `entitlements` attribute holds an `Entitlement` per item when the body is a list, and is empty otherwise. [zidentity.sdk-python:admin-entitlement-wrapper]

**JWKS clients.** The Python `add_api_client` docstring takes the JWKS URL as `client_jw_ks_url` in the list under `client_authentication`, and the method sends its keyword arguments as the request body. [zidentity.sdk-python:jwks-docstring-key] So a Python client created as documented sends the JWKS URL as `clientJwKsUrl`, not the contract's `clientJWKsUrl`; the model reads `clientJWKsUrl` back correctly. [zidentity.sdk-python:jwks-url-key]

**Groups.** A group's source takes the values in [A group record's source is one of UI (created or managed in a user interface), API (through API calls), SCIM (provisioned by SCIM) or JIT (created or updated by just-in-time provisioning).](kb:zidentity.groups:source-values). The SDK's docstring offers a value outside them and fields the create body does not define [divergence:zidentity.sdk-python:group-source-manual] [divergence:zidentity.sdk-python:add-group-body]. `add_users_to_group` and `replace_users_groups` turn an `id` list of user IDs into a body of objects that each hold one `id`; without an `id` list they send the keyword arguments as given. [zidentity.sdk-python:membership-id-transform]

**Return shapes and annotations.** `list_user_group_details` returns a plain list it fills item by item, building a `UserRecord` (not a group record) from each item of the response. [zidentity.sdk-python:user-group-details-list] Several signatures and docstrings disagree on ID types: `get_group` annotates `group_id` as int, and the docstrings of `get_api_client` and `get_resource_server` call the ID an int while their signatures take str; `get_resource_server` is annotated `APIResult[dict]` but returns a `ResourceServersRecord`. [zidentity.sdk-python:annotation-mismatches] `list_group_users_details` reads a group's users into a `Groups` paging object, so each member comes back as a `GroupRecord`, a model that also reads the user fields `loginName`, `displayName`, `primaryEmail` and `status`; its docstring calls the result a 'list of Groups instances'. [zidentity.sdk-python:group-users-as-group-records] The Python `UserRecord` and `GroupRecord` models set `custom_attrs_info` to the whole record they are built from, not to its `customAttrsInfo` value, and write that attribute back out as `customAttrsInfo`. [zidentity.sdk-python:custom-attrs-whole-record]

What to check:
1. Whether code reads `results_total` or `next_link` from a Python list object; they are always None, so count `records` or use the response object's paging.
2. Whether an empty result from `get_api_client_secret` or `get_service_entitlement` comes from the parsing defect rather than the tenant, by reading the raw response body.
3. For a JWKS client created through Python, whether the stored client shows the JWKS URL, since the SDK sends it under `clientJwKsUrl`.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.sdk-python:envelope-meta-lost] Tier B: Follows from the code path at the pin; none of the three keys is in the helper's exceptions table (searched). The response object's own paging (`has_next`, `next`) reads the raw body and is not affected.
- [zidentity.sdk-python:secrets-list-into-object] Tier B: Follows from Python membership tests on a list of dicts; not exercised by an SDK test at the pin.
- [zidentity.sdk-python:service-entitlement-into-object] Tier B: Follows from the code path at the pin and the contract's array shape; not exercised by an SDK test.
- [zidentity.sdk-python:jwks-url-key] Tier B: Follows from the helper's rule; `client_jw_ks_url` is not in its exceptions table (searched at the pin). Whether the API matches the key case-insensitively is not shown by any source.

Sources disagree (name both sides):
- The Python SDK's group docstrings give `MANUAL` as an example group source, which is not in the contract's source values. [divergence:zidentity.sdk-python:group-source-manual]
  - api-specs: A group's source is UI, API, SCIM or JIT.
  - sdk-python: Group sources include 'SCIM' and 'MANUAL', among others.
  Impact: Code that filters or branches on a `MANUAL` group source never matches; groups made in the console or through the API report `UI` or `API`.
- The contract's create-group body defines only `name` and `description`, while the Python `add_group` docstring offers `id`, `source`, `is_dynamic_group`, the two entitlement flags and `idp` as well. [divergence:zidentity.sdk-python:add-group-body]
  - api-specs: A group is created from a name and a description.
  - sdk-python: A group can be created with a source, a dynamic flag, entitlement flags and an IdP.
  Impact: Setting those fields through `add_group` may be ignored or rejected by the API; no source shows which, so read the group back after creating it.

Area: zidentity.sdk-python, its subjects in references/_meta/spine/zidentity/zidentity.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
- links-to references/_meta/text/zidentity/zidentity.api.pagination.md (Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages)
- links-to references/_meta/text/zidentity/zidentity.api.query-filters.md (ZIdentity list filters on the wire: key spelling, [like] matching and list values)
- links-to references/_meta/text/zidentity/zidentity.groups.md (Authentication Service user groups: predefined and custom groups, dynamic groups, membership and limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.api.client-coverage.md (Which clients cover which parts of the ZIdentity API: Python, Go and the MCP server)
- see-also references/_meta/text/zidentity/zidentity.sdk-go.md (Go SDK for ZIdentity (ziam services): name lookups, write models and where its paths depart from the contract)
