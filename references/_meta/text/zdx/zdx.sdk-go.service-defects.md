# Go SDK ZDX services: where the structs and functions disagree with the contract (zdx.sdk-go.service-defects)
Also called: zdx go sdk bugs; GetDeepTraceSession; CreateAnalysis; DeviceEvents instances; GetDeviceApp; go zdx trace_id string; go zdx device id int string
Former IDs: zdx-06, zdx-07

The Go SDK's ZDX packages decode responses into hand-written structs, and several of them differ from the published contract. The packages and functions are generated (`node scripts/kb.mjs surface zdx`); request handling shared by all Go products is in [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling).

**Deep traces.** The contract types `trace_id` as an integer while the Go `DeepTraceSession` struct types `TraceID` as a string, so decoding a numeric `trace_id` with Go's JSON decoder fails and `CreateDeepTraceSession` and `GetDeepTraces` would return that error instead of the session. [zdx.sdk-go.service-defects:go-trace-id-string] The start body's probe key is in [The Go SDK's `DeepTraceSessionPayload` serializes `session_name`, `app_id`, `web_probe_id`, `cloud_path_probe_id`, `session_length_minutes` and `probe_device`, with the three IDs and the length typed as Go `int`.](kb:zdx.diagnostics.start-request:go-payload).

**Functions that return nothing decoded.** `GetDeepTraceSession` and `CreateAnalysis` pass no decode target to `NewRequestDo` and return only the `*http.Response`, so neither hands back the session record or the new `analysis_id` as a struct. [zdx.sdk-go.service-defects:no-decode-functions] What that response holds is in [The ZPA, ZCC and ZDX request helpers discard the response object that `ExecuteRequest` returns and build a new `http.Response` holding only `StatusCode: http.StatusOK` and the body. Whatever success status the API sent, such as Created or No Content, reaches the caller as `http.StatusOK`, and response headers are lost.](kb:shared.sdk-go.request-handling:request-do-fabricates-200).

**ID types.** The four Go deep-trace functions (`GetDeepTraces`, `GetDeepTraceSession`, `CreateDeepTraceSession`, `DeleteDeepTraceSession`) take the device ID as an `int` and format it with `%d`, while in `reports/devices` the device ID type varies: `GetDevice`, `GetDeviceApp` and `GetDeviceAllApps` take it as a `string`, and functions such as `GetEvents` take it as an `int`. [zdx.sdk-go.service-defects:device-id-types] The Go application functions disagree on the application ID's type: `GetApp` takes `appID` as a string, while `GetAppScores` and `GetAppMetrics` take it as an `int`, as the `Apps` struct types its `ID`. [zdx.sdk-go.service-defects:app-id-types]

**Report shapes.** The Go `DeviceEvents` struct reads the device's events from a JSON key `instances`. [zdx.sdk-go.service-defects:go-events-key] The key differs from the contract's [divergence:zdx.sdk-go.service-defects:events-key], and no live response has settled it [gap:zdx.sdk-go.service-defects:events-key-live]. The Go `GetDeviceApp` decodes the device's application score into a single `App` record of `id`, `name` and `score`. [zdx.sdk-go.service-defects:go-device-app-shape] The contract describes a time series [divergence:zdx.sdk-go.service-defects:device-app-shape], also unconfirmed live [gap:zdx.sdk-go.service-defects:device-app-shape-live]. `GetAppScores`, `GetAppMetrics` and `GetWebProbes` first decode the response as a list of `common.Metric`; when that call returns any error, they send the same GET again and decode it as a single `Metric`, returned as a one-element list. [zdx.sdk-go.service-defects:single-metric-fallback] So a request to these functions that fails for a reason other than the response's shape, such as a 429, a 5xx or a timeout, is sent a second time at once, and the caller gets the second attempt's error. [zdx.sdk-go.service-defects:fallback-repeats-failures]

**Lists.** `GetAllDevices` and `GetAllUsers` decode the list response into a local struct that holds `next_offset` and return only the list, so the caller never receives `next_offset`. [zdx.sdk-go.service-defects:list-drops-next-offset] So through these functions a Go caller gets only the first batch of devices or users (up to `limit`, 1000 by default) with no `next_offset` to request the rest, and the SDK does not page on its own. [zdx.sdk-go.service-defects:go-list-first-batch] `GetAllDevices` decodes each listed device into the `DeviceDetail` struct of the device detail read (`id`, `name` and nested `hardware`, `network` and `software`), while the contract's device-list entries are flat records with keys such as `userid`, `os`, `hw_model`, `private_ip` and `client_conn_ver`. [zdx.sdk-go.service-defects:go-device-list-struct] So the Go device list gives each device's ID and name but no user ID, and its hardware, network and software stay empty, since the flat list keys match none of the struct's nested fields. [zdx.sdk-go.service-defects:go-device-list-loses-fields] The Python list model reads the ID, name and user ID instead: [The Python `list_devices` returns a `Devices` wrapper whose `devices` list is formed of `DeviceDetail` objects, which read only `id`, `name` and `userid`; the contract's device-list entries also carry fields such as `os`, `hw_model`, `private_ip` and `client_conn_ver`.](kb:zdx.sdk-python.response-models:python-device-list-fields).

**Top processes.** The Go `GetDeviceTopProcesses` decodes the response into a list of `DeviceTopProcesses` and sends a `GetFromToFilters` time range, while the contract's response is a single object (`timestamp` and `top_processes`) and the operation defines only the `id` and `traceId` path parameters. [zdx.sdk-go.service-defects:go-top-processes-shape] So if the API answers with the contract's single object, Go's decoder cannot place it in a list and `GetDeviceTopProcesses` returns that decode error instead of the processes; the Python `list_top_processes` builds one model from the object. [zdx.sdk-go.service-defects:go-top-processes-decode-fails] The read itself is in [The contract's top-processes read gets the top processes from a deep tracing session, addressed by the device ID and the session's trace ID; it returns a `timestamp` in epoch seconds and `top_processes`, each a `category` of metrics (for example disk, memory, wifi, network) with its `processes`, each a process identifier and a process name.](kb:zdx.diagnostics.session-records:top-processes).

**Device fields.** The Go `Software` struct reads `os_name`, `os_ver`, `hostname`, `netbios`, `user`, `client_conn_ver` and `zdx_ver` but not `os_build`, so a Go device read drops the OS build version the contract defines; the Python `Software` model reads it. [zdx.sdk-go.service-defects:go-software-no-os-build] The Wi-Fi fields go the other way: [The Python `Network` model reads `net_type`, `status`, `ipv4`, `ipv6`, `dns_srvs`, `dns_suffix`, `gateway`, `mac` and `guid` but none of the Wi-Fi fields the contract defines for a device's network (`wifi_adapter`, `wifi_type`, `ssid`, `channel`, `bssid`), which the Go `Network` struct does read.](kb:zdx.sdk-python.response-models:python-network-no-wifi).

What to check:
1. Whether a Go deep-trace call failed on decoding `trace_id` rather than on the request itself.
2. Whether a Go caller read the session or the analysis ID from the raw response body, since those functions decode nothing.
3. Whether empty Go device events or a single-point device-app score come from the struct shape rather than the data.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.sdk-go.service-defects:go-trace-id-string] Tier B: Follows from Go's encoding/json refusing a JSON number for a string field and from the contract's integer type; not observed against a live response.
- [zdx.sdk-go.service-defects:go-software-no-os-build] Tier B: The seven quoted fields are the whole `Software` struct at the pin.
- [zdx.sdk-go.service-defects:fallback-repeats-failures] Tier B: Follows from the functions retrying on any error from `NewRequestDo`, not only a decode error; not observed against a live API.
- [zdx.sdk-go.service-defects:go-list-first-batch] Tier B: Follows from the two functions discarding `next_offset` and sending one request each; the offset is an opaque string the API issues, so a caller cannot compute it.
- [zdx.sdk-go.service-defects:go-device-list-loses-fields] Tier B: Follows from Go's JSON decoder ignoring keys a struct does not declare; not observed against a live response.
- [zdx.sdk-go.service-defects:go-top-processes-decode-fails] Tier B: Follows from Go's encoding/json refusing a JSON object for a slice target and from the contract's object type; not observed against a live response.

Sources disagree (name both sides):
- The key holding a device's events: the contract and the Python model use `events`; the Go struct reads `instances`. [divergence:zdx.sdk-go.service-defects:events-key]
  - api-specs: The device-events response holds `events` and `timestamp`.
  - sdk-python: The Python model reads `events`.
  - sdk-go: The Go struct reads `instances`.
  Impact: If the live response follows the contract, Go callers get an empty events list for every device and may conclude nothing changed.
- The device-application score response: the contract and the Python model describe a time series; the Go function decodes a single score record. [divergence:zdx.sdk-go.service-defects:device-app-shape]
  - api-specs: The endpoint returns the application's score trend for the device: a series of `metric`, `unit` and `datapoints`.
  - sdk-python: The Python method wraps the body in `DeviceAppScoreTrend`.
  - sdk-go: The Go function decodes a single `App` of `id`, `name` and `score`.
  Impact: A Go caller expecting a trend gets at most one value, and empty fields if the live body is the contract's series.

Not known (open gaps):
- Which key the live device-events response uses [gap:zdx.sdk-go.service-defects:events-key-live]: settled by tenant-data or lab-test. Blocks: trusting Go device-event reads
- What shape the live device-application response has [gap:zdx.sdk-go.service-defects:device-app-shape-live]: settled by tenant-data or lab-test. Blocks: trusting Go device-application score reads

Area: zdx.sdk-go, its subjects in references/_meta/spine/zdx/zdx.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
