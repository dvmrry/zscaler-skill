# The two Python Browser Access segment modules and the by-type helper (zpa.sdk-python.browser-access-modules)
Also called: app_segments_ba vs app_segments_ba_v2; common_apps_dto apps_config; get_segments_by_type; getAppsByType; browser access segment python sdk which module

The Python SDK has two Browser Access segment modules that call the same routes and differ in how they take the Browser Access applications. The Go package and other segment kinds are in [What the Python and Go SDKs send for application segments](kb:zpa.app-segments.sdk-behavior).

**Same route.** `list_segments_ba` in both modules and `list_segments` in `application_segment.py` issue GET on `/application` and pass the caller's query parameters; `list_segments_ba` adds no type parameter. [zpa.sdk-python.browser-access-modules:same-route] The type filter lives in `ApplicationSegmentByTypeAPI.get_segments_by_type` in `app_segment_by_type.py`, which calls `/application/getAppsByType` and sends the application type as a query parameter; `application_segment.py` imports and calls it. [zpa.sdk-python.browser-access-modules:by-type-helper]

**v1 module.** In the `app_segments_ba` module (`ApplicationSegmentBAAPI`, as opposed to `AppSegmentsBAV2API` in `app_segments_ba_v2`), `update_segment_ba` expands `clientless_app_ids` by fetching the BROWSER_ACCESS segments and matching on domain and on the ID of the segment being updated. [zpa.sdk-python.browser-access-modules:v1-clientless-lookup]

**v2 module.** The v2 module sends the Browser Access applications as `commonAppsDto` built from `common_apps_dto.apps_config` and adds `app_types` of BROWSER_ACCESS to entries that lack it; its changelog entry calls this the newly recommended format. [zpa.sdk-python.browser-access-modules:v2-apps-config] [The Python PRA, Inspection and Browser Access v2 segment updates fetch the existing sub-applications by type (SECURE_REMOTE_ACCESS, INSPECT, BROWSER_ACCESS), match each `apps_config` entry to them by domain, set the matched ID (or an empty string when the domain is new), and set `deleted_pra_apps`, `deleted_inspect_apps` or `deleted_ba_apps` to the existing sub-applications whose domain is no longer listed.](kb:zpa.api.app-segments-wire:python-update-matches-by-domain) [The Python PRA, Inspection, Browser Access and Browser Access v2 segment updates set each of `tcpPortRanges`, `tcpPortRange`, `udpPortRanges` and `udpPortRange` to an empty list when it is not passed, so omitting ports in an update clears them.](kb:zpa.api.app-segments-wire:python-update-clears-ports-all-variants)

What the API does with the `deleted_ba_apps` list the v2 update sends is only partly known [gap:zpa.sdk-python.browser-access-modules:ba-deleted-apps-effect].

What to check:
1. Whether the code passes common_apps_dto.apps_config, which only the v2 module accepts, or clientless_app_ids, which the v1 module expands.
2. Whether the list was assumed to return only Browser Access segments, since the list wrappers send the caller's parameters to the generic /application route.
3. Whether a v2 update dropped port ranges by omitting them.

Not known (open gaps):
- Whether the API deletes the Browser Access apps listed in deletedBaApps on a v2 segment update [gap:zpa.sdk-python.browser-access-modules:ba-deleted-apps-effect]: settled by lab-test. Blocks: telling whether leaving a domain out of a v2 update removes its Browser Access app

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.api.app-segments-wire.md (Application segment wire behavior: what each SDK sends, drops and matches across the four segment kinds)
- links-to references/_meta/text/zpa/zpa.app-segments.sdk-behavior.md (What the Python and Go SDKs send for application segments)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.browser-access.tooling.md (Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform)
- see-also references/_meta/text/zpa/zpa.app-segments.api-fields.md (Application segment fields in the API and SDK models)
