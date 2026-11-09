# How the Python SDK turns ZDX arguments into query parameters and bodies (zdx.sdk-python.request-shaping)
Also called: zdx_params; since hours; zdx since parameter; location_id loc; score_bucket; exclude_loc; user_ids userids; zdx query parameters camelcase; python zdx filters not applied; zdx software inventory; software inventory; list_softwares; list_software_keys
Former IDs: zdx-43

Most Python ZDX list and report methods carry the `zdx_params` decorator, which renames a few shorthand arguments to the API's query names before the request executor applies its own key conversion. The methods and their endpoints are generated (`node scripts/kb.mjs surface zdx`).

**The decorator.** `zdx_params` turns `since` into `from` and `to`, `search` into `q`, `location_id` into `loc`, `department_id` into `dept` and `geo_id` into `geo`, and passes `exclude_dept`, `exclude_loc`, `exclude_geo`, `score_bucket`, `limit`, `offset` and `expiry` under their own names, whether they come as keyword arguments or inside `query_params`. [zdx.sdk-python.request-shaping:decorator-mapping] A `since` value is a number of hours: the decorator sets `to` to the current Unix time and `from` to that time minus the hours times 3,600, unless the caller already set `from` or `to`. [zdx.sdk-python.request-shaping:since-to-epoch] The `zdx_params` decorator rejects a `score_bucket` other than `poor`, `okay` or `good` with a ValueError before it calls the decorated method. [zdx.sdk-python.request-shaping:score-bucket-check]

**Query names on the wire.** The request executor passes ZDX query parameters unchanged on the legacy ZDX client; otherwise, for any non-ZPA service, it runs every parameter name through `convert_keys_to_camel_case`, which maps each key with `to_lower_camel_case`: a name in `FIELD_EXCEPTIONS` takes its mapped value, any other name with an underscore is split on underscores, its first part lowercased and each later part capitalized. [zdx.sdk-python.request-shaping:params-conversion] So on the OneAPI client, multiword ZDX filter names that the decorator does not rename, such as `exclude_loc`, `exclude_dept`, `exclude_geo`, `score_bucket`, `user_ids`, `mac_address`, `private_ipv4` and `parent_geo_id`, reach the API camel-cased, while the contract names these parameters in snake_case (`exclude_loc`, `score_bucket`, `private_ipv4`, `mac_address`, `parent_geo_id`, and `userids` for user IDs). [zdx.sdk-python.request-shaping:filter-names-camel-cased] The user-ID filter's name differs across all three sources [divergence:zdx.sdk-python.request-shaping:user-ids-param]. Whether the API accepts the camel-cased names is open [gap:zdx.sdk-python.request-shaping:camel-params-accepted].

**Bodies.** Request bodies stay in snake_case: [The Python `start_deeptrace` sends its keyword arguments as the request body (`body = kwargs`), and the request executor leaves ZDX bodies in snake_case on both the OneAPI and the legacy client, so the keys go out as passed; its docstring names the probe keyword `cloudpath_probe_id`.](kb:zdx.diagnostics.start-request:python-body-passthrough).

**Methods without time ranges, and inventory.** The Python deep-trace list takes only the device ID, and the deep-trace get and metric readers (`get_deeptrace`, `get_deeptrace_webprobe_metrics`, `get_deeptrace_cloudpath_metrics`, `get_deeptrace_cloudpath`, `get_deeptrace_health_metrics`, `get_deeptrace_events`) only the device and trace IDs; none takes query parameters, so they accept no time range. [zdx.sdk-python.request-shaping:no-query-methods] The Python `list_softwares` carries `zdx_params`, so a `since` passed to it is sent as `from` and `to`, although the contract lists no time-range parameters for the software inventory endpoint. [zdx.sdk-python.request-shaping:inventory-decorated] Whether the inventory endpoint honors a time range is open [gap:zdx.sdk-python.request-shaping:inventory-time-range]. The software-key read lists all users and devices for a given software name and version, and the Python SDK's example passes a key such as `screencaptureui2` to `list_software_keys`. [zdx.sdk-python.request-shaping:software-key]

What to check:
1. Which client the Python program uses: on the OneAPI client, multiword filter names the decorator does not rename go out camel-cased.
2. Whether a filter was passed under a shorthand the decorator renames (`location_id`, `department_id`, `geo_id`, `search`, `since`) or under a name it leaves alone.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.sdk-python.request-shaping:filter-names-camel-cased] Tier B: Follows from the executor's conversion and the helper's camel-casing rule; none of these names is in the helper's exceptions map at the pin. No captured request shows the wire names.
- [zdx.sdk-python.request-shaping:inventory-decorated] Tier B: The contract's parameter list for the endpoint at the pin is `loc`, `dept`, `geo`, `userids`, `deviceids`, `offset` and `limit`; a list cannot be pinned by pointer as complete, so the absence of `from` and `to` rests on that reading.

Sources disagree (name both sides):
- The device list's user-ID filter: the contract and the Go SDK call it `userids`; the Python SDK documents `user_ids`, which the decorator does not rename. [divergence:zdx.sdk-python.request-shaping:user-ids-param]
  - api-specs: The query parameter is `userids`.
  - sdk-go: The Go filter struct sends `userids`.
  - sdk-python: The Python SDK takes `user_ids`, sent as written on the legacy client and camel-cased on the OneAPI client.
  Impact: A Python device list filtered by user ID may come back unfiltered or rejected, because neither form it sends is the contract's name.

Not known (open gaps):
- Whether the ZDX API honors camel-cased or underscored query names it does not define [gap:zdx.sdk-python.request-shaping:camel-params-accepted]: settled by lab-test. Blocks: trusting Python ZDX queries that use exclusion, score-bucket, user, MAC, IP or parent-geolocation filters
- Whether the software inventory endpoint honors a time range [gap:zdx.sdk-python.request-shaping:inventory-time-range]: settled by lab-test. Blocks: answering whether an inventory listing reflects a time window

Area: zdx.sdk-python, its subjects in references/_meta/spine/zdx/zdx.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
