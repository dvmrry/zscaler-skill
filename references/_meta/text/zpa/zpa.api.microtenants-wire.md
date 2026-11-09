# What the SDKs send and receive for ZPA Microtenants (zpa.api.microtenants-wire)
Also called: microtenant enabled false omitempty; microtenants search body filterGroups; microtenant update id None; domains.does.not.belong.to.customer; microtenants summary array; criteriaAttribute AuthDomain

This subject records what the SDKs send and receive for Microtenant objects beyond the field list: dropped zero values, response handling and the two search styles. The product behavior is in [Microtenant lifecycle: create, disable, delete](kb:zpa.microtenants.lifecycle), [How an API call selects a Microtenant](kb:zpa.microtenants.api-scoping) and [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move).

## Writes and responses

The Go microtenant struct sends `enabled` and `privilegedApprovalsEnabled` without omitempty, so false is always on the wire, while the embedded user's `enabled` is omitempty and a false there is dropped. The Python model leaves enabled as None when the key is absent. [zpa.api.microtenants-wire:enabled-tags] The Go struct holds the admin user under the JSON key `user` and the roles under `roles`, both omitempty. The specification defines both in the microtenant GET and create responses. [zpa.api.microtenants-wire:user-key-and-output-only]

PUT on a microtenant returns 204 No Content in the specification, and the Go SDK's Update decodes no response body (it passes nil as the response target) and its signature returns an `*http.Response` and an error, not a microtenant. [zpa.api.microtenants-wire:update-returns-204] In the Python SDK's update_microtenant, the microtenant_id argument used to build the URL is reassigned from the request body's microtenant_id key (kept in the body) before the query parameter and the 204 stand-in object are built, so a caller who does not also pass microtenant_id as a keyword gets no microtenantId query parameter and a stand-in object whose id is None. [zpa.api.microtenants-wire:update-rebinds-id]

The Go SDK's tests and the Python SDK's example set a microtenant's criteriaAttribute to `AuthDomain` with a domain in criteriaAttributeValues, and the Go test treats an error containing `domains.does.not.belong.to.customer` as the sign that the domain is not registered to the customer. [zpa.api.microtenants-wire:criteria-attribute-authdomain]

## Reads and search

GET /microtenants/summary returns a bare array of id and name objects, while GET /microtenants wraps its results in a list member; the Python SDK returns an empty list when the body is not a list. From v1.11.3 it returns that list as the first element of a (result, response, error) tuple; at v1.11.2 it returned a 2-tuple. [zpa.api.microtenants-wire:summary-bare-array] The Go microtenants package has two name lookups. GetByName lists with GET using the name as the search text and matches case-insensitively on the client; GetMicrotenantByName posts a name-equals search to /microtenants/search with the service's microtenant as a query parameter and matches case-insensitively on the client. [zpa.api.microtenants-wire:get-by-name-two-paths]

The Go POST-search helper passes the filter (the microtenant) as query parameters, not in the body, and sets pageBy to the page and a page size of 500; it sets validPage and validPageSize to 0, but both are tagged omitempty, so they are not serialized. [zpa.api.microtenants-wire:post-search-query-and-page] The body shape differs from the specification [divergence:zpa.api.microtenants-wire:search-body-shape], and so does the operator vocabulary [divergence:zpa.api.microtenants-wire:search-operator-vocabulary].

Priority has different types in the contract and Go [divergence:zpa.api.microtenants-wire:priority-type].

Whether the string form is accepted is open [gap:zpa.api.microtenants-wire:priority-string-accepted].

A microtenant read through Python does not expose roles, the admin user or priority: The Python Microtenant model reads id, modifiedTime, creationTime, modifiedBy, name, description, enabled, operator, criteriaAttribute, criteriaAttributeValues and privilegedApprovalsEnabled, and has no attribute for the `roles`, `user` or `priority` keys that the Go struct carries. [zpa.api.microtenants-wire:python-model-attributes]

The enabled default differs between the Python docstring, the Python write path and Go [divergence:zpa.api.microtenants-wire:enabled-default-sources].

What to check:
1. Whether a microtenant update meant to disable it was sent with enabled false, which the Go struct always includes.
2. Whether an update through the Python SDK passed microtenant_id as a keyword argument as well as the positional id.
3. Whether a failed create with an AuthDomain criterion named a domain registered to the customer.
4. Whether a hand-built search body followed the specification or the Go SDK's nested shape.

Sources disagree (name both sides):
- The shape of the POST /microtenants/search body: the specification and the Python docstring describe filterBy as a flat array of filter objects with values, while the Go SDK sends a nested filterGroups structure with a single value. [divergence:zpa.api.microtenants-wire:search-body-shape]
  - sdk-python: The Python get_microtenant_search docstring documents filter_by as a flat list of filter objects, each with filter_name, operator and a values list.
  - api-specs: The specification defines filterBy as an array of items with filterName, operator, values and commaSepValues.
  - sdk-go: The Go request type nests filterGroups inside filterBy, each group holding filters with a single `value` key.
  Impact: A raw search built from the specification will not match the body the Go SDK sends. The Go SDK's microtenant name lookup is the only evidence in these sources of a body that works, and its result was not observed here. See [[zpa.microtenants.api-scoping]].
- The operator words for microtenant search filters: the Go SDK sends EQ, while the Python SDK's docstring shows EQUALS and LIKE. [divergence:zpa.api.microtenants-wire:search-operator-vocabulary]
  - sdk-go: The Go microtenant name search hard-codes the operator EQ.
  - sdk-python: The Python get_microtenant_search docstring lists EQUALS and LIKE as example operators.
  Impact: The specification types operator as a free string, so neither word is confirmed by it. Use the Go word EQ only as the one an SDK actually sends; a filter with EQUALS or LIKE has no sent-and-working example in these sources.
- The OpenAPI document types a microtenant's `priority` as an int32 integer, while the Go SDK types it as a string. [divergence:zpa.api.microtenants-wire:priority-type]
  - api-specs: The contract microtenant list item has priority as an int32.
  - sdk-go: The Go MicroTenant struct declares Priority as a string.
  Impact: The Go SDK sends a JSON string where the contract has a number; whether the API coerces or rejects it is not shown.
- The Python microtenant docstring says `enabled` defaults to True, while the Python add_microtenant sends the caller's keyword arguments as the body unchanged and the Go struct always sends `enabled`. [divergence:zpa.api.microtenants-wire:enabled-default-sources]
  - sdk-python: The Python add_microtenant docstring says enabled defaults to True.
  - sdk-python: The Python add_microtenant builds the body from the caller's keyword arguments alone, so a caller that does not pass enabled sends no enabled key.
  - sdk-go: The Go struct tags enabled without omitempty, so an unset value is sent as false.
  Impact: A Go caller that leaves Enabled unset creates a disabled microtenant, while a Python caller omits the key and gets the server default; the docstring's True is not an SDK default. The docstring's default against the console's is in [[zpa.microtenants.lifecycle:enabled-default]].

Not known (open gaps):
- Whether the API accepts a string priority on a microtenant write [gap:zpa.api.microtenants-wire:priority-string-accepted]: settled by lab-test. Blocks: telling whether Go microtenant writes with a priority succeed

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant)
- links-to references/_meta/text/zpa/zpa.microtenants.lifecycle.md (Microtenant lifecycle: create, disable, delete)
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)
