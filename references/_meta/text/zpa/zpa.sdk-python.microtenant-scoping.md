# How the Python SDK sends the microtenant ID on ZPA calls (zpa.sdk-python.microtenant-scoping)
Also called: microtenant_id python sdk; microtenantId query parameter; default microtenant client config; microtenant in request body zpa sdk

The Python SDK turns a microtenant ID into the `microtenantId` query parameter on ZPA calls, from several places. The product behavior is in [How an API call selects a Microtenant](kb:zpa.microtenants.api-scoping).

**Where it comes from.** In `segment_groups.py` the list and get wrappers read `microtenant_id` from `query_params`, the create wrapper reads it from its keyword arguments, and the delete wrapper takes it as an argument; each copies it to `microtenantId`. [zpa.sdk-python.microtenant-scoping:wrapper-sources] The executor picks the microtenant ID from the request body's `microtenantId` first, then from the params' `microtenantId`, then from the client configuration. [zpa.sdk-python.microtenant-scoping:executor-precedence] The executor reads an optional `microtenantId` from the client configuration and falls back to it when a request names none. [zpa.sdk-python.microtenant-scoping:config-default]

**Where it goes.** For a ZPA request the executor sets the `microtenantId` query parameter whenever it finds a microtenant ID. [zpa.sdk-python.microtenant-scoping:executor-query-param] For a non-ZPA request the executor removes `microtenantId` from the parameters. [zpa.sdk-python.microtenant-scoping:non-zpa-pop] [For a dictionary request body, the request executor camel-cases the keys with `convert_keys_to_camel_case`, except on the ZDX and ZTB legacy clients and on endpoints containing `/zdx/`, `/easm/` or `/ztb/`, whose bodies it sends as given. For `/zcc/` it converts selectively, leaving `WebPolicy.SNAKE_CASE_KEYS` as they are, and a body the ZCC serializer already produced (`_ZccWireBody`) is sent unchanged.](kb:shared.sdk-python.request-handling:body-camel-case) So a `microtenant_id` key left in the body is sent as `microtenantId`. [zpa.sdk-python.microtenant-scoping:body-camel-microtenant] A write wrapper that reads the microtenant ID with `body.get` and sends `body = kwargs` still sends the microtenant ID in the JSON body in addition to the query parameter. [zpa.sdk-python.microtenant-scoping:body-keeps-key]

What to check:
1. Whether the client was configured with a default microtenantId, since it applies to every ZPA call that names none.
2. Whether a list or get call passed microtenant_id inside query_params, because those wrappers read it nowhere else.
3. Whether a write also carried microtenant_id in its keyword arguments, which the wrapper leaves in the body.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.sdk-python.microtenant-scoping:body-camel-microtenant] Tier B: Applies the quoted camel-casing rule to the key; `microtenant_id` is not in the `FIELD_EXCEPTIONS` table of `to_lower_camel_case` (read at HEAD). Not observed in a captured request.
- [zpa.sdk-python.microtenant-scoping:body-keeps-key] Tier B: Follows from the wrapper using get, not pop, on the body it sends. Whether the service accepts or ignores the extra body field is not shown.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant): For a ZPA request the executor sets the `microtenantId` query parameter whenever it finds a microtenant ID. [zpa.sdk-python.microtenant-scoping:executor-query-param]
- links-to references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.sdk-python.pagination.md (Paging through ZPA lists with the Python SDK)
