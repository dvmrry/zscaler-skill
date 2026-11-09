# How the Python SDK turns ID lists into nested ZPA objects (zpa.sdk-python.id-list-reformatting)
Also called: server_group_ids; server_ids servers; add_id_groups; transform_common_id_fields; reformat_params; zpa ids as strings 19 digit

ZPA wrappers accept flat ID lists and rebuild them into the nested `{"id": ...}` lists the API takes.

**The helpers.** [`transform_common_id_fields` pops each snake_case key from the source dict and stores a list of `{"id": ...}` objects under the wire key; items that are already dicts with an id are kept.](kb:shared.sdk-python.request-handling:id-list-helper) With `coerce_ids=False` the helper passes ID values through verbatim, which its docstring says ZPA needs because its 19-digit string IDs must be preserved on the wire; `add_segment` in `application_segment.py` calls it that way. The server-group wrapper also calls it that way, but its own loops pop `server_ids` and `app_connector_group_ids` first, so the call changes nothing there and a None for either key still raises TypeError. [zpa.sdk-python.id-list-reformatting:no-coerce] `add_id_groups` reformats an entry only when the keyword value is truthy, so an empty list is left in the keyword arguments under its snake_case name. It is still called by `add_segment_provision` in `application_segment.py`, which also keeps its own `serverGroups` loop, the loop v1.11.1 removed from `add_segment` and `update_segment` (#575), and by the PRA credential pool add and update. [zpa.sdk-python.id-list-reformatting:add-id-groups-truthy]

**The key maps.** The server group wrapper maps `server_ids` to `servers` and `app_connector_group_ids` to `appConnectorGroups`. [zpa.sdk-python.id-list-reformatting:server-group-keys] The Browser Access segment wrapper lists `clientless_app_ids` to `clientlessApps` and `server_group_ids` to `serverGroups` in its key map, but `add_segment_ba` and `update_segment_ba` pop `clientless_app_ids` from the body, which is the kwargs dict transform_common_id_fields reads, before calling it: add renames it to `clientlessApps` as given, and update rebuilds it from a BROWSER_ACCESS segment lookup matched by domain, setting each app's `appId` and `id`, so transform_common_id_fields never converts clientless apps. Since v1.11.1 `server_group_ids` is mapped only by transform_common_id_fields; up to v1.11.0 each method first built `serverGroups` in its own loop. [zpa.sdk-python.id-list-reformatting:segment-keys]

What to check:
1. Whether an ID list argument was passed empty or as an already nested list, and which helper handles it.
2. Which snake_case argument name maps to which wire key for the resource.

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
