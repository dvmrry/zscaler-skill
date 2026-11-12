# Python SDK application segment, Browser Access and by-type helpers: ID remapping, delete, export and update lookups (zpa.sdk-python.application-segment-helpers)
Also called: force_delete application segment python; deleted_ba_apps; application_segment_export csv; add_id_groups; server_group_ids serverGroups python; bulk_update_multimatch response; update_segment_ba domain lookup; weighted lb config empty response; application_segment_export; ZPA csv export python; Accept text/csv zpa

These are claims about individual Python SDK helpers for ZPA application segments. Port range handling, the BROWSER_ACCESS lookup on update and microtenant move and share are in [What the Python and Go SDKs send for application segments](kb:zpa.app-segments.sdk-behavior) and [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move).

**ID lists.** `add_segment` and `update_segment` turn `server_group_ids` into a `serverGroups` list with transform_common_id_fields and coerce_ids=False, so the ID strings are sent as given; since v1.11.1 this is the only mapping and `server_group_ids=None` is treated as not supplied, where up to v1.11.0 each method first built `serverGroups` in its own loop, which raised TypeError on None (#575). `clientless_app_ids` is taken out before that call: `add_segment` renames it to `clientlessApps` as given and `update_segment` pops it for a Browser Access lookup. [zpa.sdk-python.application-segment-helpers:id-lists-add-update] The helper behaviors are in [How the Python SDK turns ID lists into nested ZPA objects](kb:zpa.sdk-python.id-list-reformatting).

**Delete and export.** `delete_segment` sends `forceDelete=true` as a query parameter only when `force_delete` is true; its docstring says this deletes the mapping between the application segment and the segment group. [zpa.sdk-python.application-segment-helpers:force-delete-param] `application_segment_export` sends GET to `/application/export` with an `Accept: text/csv` header and accepts `single` and `microtenant_id` query parameters. [zpa.sdk-python.application-segment-helpers:export-accept-csv] It returns the response body as a raw string with the response and error, and no model is built. [zpa.sdk-python.application-segment-helpers:export-returns-raw]

**Multimatch and load balancing.** `get_multimatch_unsupported_references` sends the list of domains itself as the request body, because the API expects a plain array of domain strings. [zpa.sdk-python.application-segment-helpers:multimatch-unsupported-body] `bulk_update_multimatch` returns a fixed message dictionary when the response is None; otherwise it parses the body as a MultiMatchUnsupportedReferences model. [zpa.sdk-python.application-segment-helpers:bulk-multimatch-message] `update_weighted_lb_config` returns a WeightedLBConfig holding only the segment ID when the response has no body. [zpa.sdk-python.application-segment-helpers:weighted-lb-empty-body]

**Browser Access updates.** The v1 and v2 update lookups are in [The two Python Browser Access segment modules and the by-type helper](kb:zpa.sdk-python.browser-access-modules).

What to check:
1. Whether a delete removed the segment-group mapping, which is controlled by force_delete.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants): The Python SDK's `app_segment_move` posts to `/application/{id}/move` with `targetSegmentGroupId`, `targetMicrotenantId` and `targetServerGroupId` in the body and the source scope as the `microtenantId` query parameter. [zpa.microtenants.share-and-move:python-move]
- links-to references/_meta/text/zpa/zpa.app-segments.sdk-behavior.md (What the Python and Go SDKs send for application segments)
- links-to references/_meta/text/zpa/zpa.sdk-python.browser-access-modules.md (The two Python Browser Access segment modules and the by-type helper)
- links-to references/_meta/text/zpa/zpa.sdk-python.id-list-reformatting.md (How the Python SDK turns ID lists into nested ZPA objects)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.browser-access.tooling.md (Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform)
- see-also references/_meta/text/zpa/zpa.sdk-python.return-shapes.md (What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors)
- see-also references/_meta/text/zpa/zpa.sdk-python.pagination.md (Paging through ZPA lists with the Python SDK)
