# What the Python SDK does with a response: key casing, models, the response object (shared.sdk-python.response-handling)
Also called: form_response_body; python sdk response keys; ZscalerAPIResponse; as_dict; request_format; jmespath search; python sdk model attributes none

Python SDK methods return `(result, response, error)`; the result is built from a response body whose keys the SDK has already rewritten.

**Key casing.** `form_response_body` camel-cases every key of a response body, recursing into nested objects and into objects inside lists, and leaves out keys whose value is None. [shared.sdk-python.response-handling:response-keys-camel-cased] Where a product's models then look up snake_case keys, multi-word fields come back empty unless FIELD_EXCEPTIONS yields their key: [`form_response_body` passes every key of a response through `to_lower_camel_case`, so a model attribute looked up under a snake_case key is not found on that path unless FIELD_EXCEPTIONS yields that key: `exit_password` maps to itself, and the camelCase `tunnelTwoForiOSDevices` maps to `tunnel_two_fori_os_devices`; `list_by_company` for web policies instead reads the response with `get_results()`.](kb:zcc.sdk-python.wire-keys:response-keys-camel-cased), [Before a ZIdentity model such as `Users` is built, `form_response_body` passes every key of the response, at every level, through the camel-casing helper, skipping keys whose value is None.](kb:zidentity.sdk-python:form-response-camel), [So on those methods a model attribute whose lookup key contains an underscore (a deep trace's `trace_id`, a device list's `next_offset`, an application's `total_users`, and the like) comes back None, and the MCP tools that return these models' records omit those fields. A key with no underscore passes through unchanged, so single-word keys such as `id`, `name` and `score` survive, and so do the camelCase keys some models read: the affected-devices `DeviceDetails` reads `userName` and `userEmail`, the form the contract returns, while `next_offset` on the same `list_affected_devices` result is lost.](kb:zdx.sdk-python.response-models:multiword-attrs-lost).

**Models.** A model's as_dict returns snake_case keys and omits attributes whose value is None, while its request_format method is the camelCase form the API expects. [shared.sdk-python.response-handling:as-dict] Result models subclass the SDK's object base class: [The Python ZPA result models, for example ApplicationSegments, subclass the SDK's ZscalerObject base class, which defines `__getitem__` and `get` by attribute name, so a result is not a plain dictionary.](kb:zpa.sdk-python.return-shapes:result-models-subclass).

**The response object.** `ZscalerAPIResponse` keeps the HTTP status in `_status`, reads it from the underlying response once in its constructor, and exposes it through `get_status()`. [shared.sdk-python.response-handling:status-accessor] `ZscalerAPIResponse` defines no `status_code` attribute or property of its own, so callers read the status through `get_status()`. [shared.sdk-python.response-handling:no-status-code-attr] The response object's search method applies a JMESPath expression to the current page of results only, so filtering across a collection means searching each page. [shared.sdk-python.response-handling:search-current-page] Paging is in [How the Python SDK pages a list: has_next, next and the per-service branches](kb:shared.sdk-python.pagination).

Python SDK methods return a three-element tuple of result, response and error rather than a bare result. [shared.sdk-python.response-handling:tuple-return]

What to check:
1. Whether a None model attribute is really absent from the response, or a multi-word key the model looked up under its snake_case name after the response was camel-cased.

Inferred, not quoted (say so when an answer rests on one):
- [shared.sdk-python.response-handling:no-status-code-attr] Tier B: An absence: a search of zscaler/oneapi_response.py at the pin finds status_code only in the constructor line that reads res_details.status_code into _status.

Area: shared.sdk-python, its subjects in references/_meta/spine/shared/shared.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.pagination.md (How the Python SDK pages a list: has_next, next and the per-service branches)
- links-to references/_meta/text/zcc/zcc.sdk-python.wire-keys.md (How the Python SDK names ZCC keys on the wire: the model serializer and the parameter mapper)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
- links-to references/_meta/text/zidentity/zidentity.sdk-python.md (Python SDK for ZIdentity (client.zid): where its models and keys depart from the API)
- links-to references/_meta/text/zpa/zpa.sdk-python.return-shapes.md (What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
