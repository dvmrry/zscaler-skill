# Starting a deep trace through the API: the read chain, the request body, and where the clients disagree (zdx.diagnostics.start-request)
Also called: start deeptrace; start_deeptrace; CreateDeepTraceSession; start a diagnostics session via api; deeptrace payload; cloud_path_probe_id; cloudpath_probe_id; session_length_minutes; deep trace session limit; how many deep traces at once; web_probe_id
Former IDs: zdx-01, zdx-02, zdx-32

A deep trace is started with one POST per device, and the request names an application and two probes that must be read first. The endpoint and the SDK functions are generated (`node scripts/kb.mjs surface zdx`); this subject holds the body and its pitfalls.

**Limits.** The contract limits deep traces to one active session per device at any time and 15 active sessions across all devices, counting sessions started from the UI. [zdx.diagnostics.start-request:session-limits]

**Reading the IDs first.** The MCP start tool tells callers to resolve `app_id`, `web_probe_id` and `cloudpath_probe_id` with `zdx_list_applications`, `zdx_get_web_probes` and `zdx_list_cloudpath_probes` first, and the Go SDK's start example asks for the device, application, web probe and cloud-path probe IDs in that order before calling `CreateDeepTraceSession`. [zdx.diagnostics.start-request:read-chain] The probe records the web-probe and cloud-path-probe reads return carry the probe's ID under `id`, which the caller must pass on under the start request's `web_probe_id` or `cloudpath_probe_id` key. [zdx.diagnostics.start-request:probe-id-key] Whether a probe ID read for one device and application is rejected when sent for another is open [gap:zdx.diagnostics.start-request:probe-id-portability].

**The body the contract defines.** The contract's start body carries `session_name` (a string), `app_id`, `web_probe_id` and `cloudpath_probe_id` (int64 integers), `session_length_minutes` (an integer described as the session length in minutes, up to 15) and `probe_device` (a boolean for device-level stats). [zdx.diagnostics.start-request:contract-request] A started trace answers 201 or 202 with `trace_id` (an int64 integer), `status` (one of `not_started`, `in_progress`, `error` and `done`) and `expected_time`, described as the expected completion time in epoch seconds. [zdx.diagnostics.start-request:contract-response] The earlier questions about the session-name key and about concurrent sessions are closed [gap:zdx.diagnostics.start-request:session-name-key] [gap:zdx.diagnostics.start-request:concurrent-sessions].

**What the clients send.** The Python `start_deeptrace` sends its keyword arguments as the request body (`body = kwargs`), and the request executor leaves ZDX bodies in snake_case on both the OneAPI and the legacy client, so the keys go out as passed; its docstring names the probe keyword `cloudpath_probe_id`. [zdx.diagnostics.start-request:python-body-passthrough] The Go SDK's `DeepTraceSessionPayload` serializes `session_name`, `app_id`, `web_probe_id`, `cloud_path_probe_id`, `session_length_minutes` and `probe_device`, with the three IDs and the length typed as Go `int`. [zdx.diagnostics.start-request:go-payload] None of the payload's fields is tagged `omitempty`, so a Go-built start body always carries all six keys, including a zero `session_length_minutes` and `probe_device` false when the caller leaves them unset. [zdx.diagnostics.start-request:go-payload-sends-all] The cloud-path probe key differs [divergence:zdx.diagnostics.start-request:cloudpath-key]. The Python `start_deeptrace` docstring types `app_id`, `web_probe_id` and `cloudpath_probe_id` as `str`. [zdx.diagnostics.start-request:python-id-types] The Python docstring and the contract disagree on the ID type [divergence:zdx.diagnostics.start-request:id-types].

**Session length.** The Python SDK docstring and the MCP start tool describe `session_length_minutes` as defaulting to 5 minutes with supported values 5, 15, 30 and 60. [zdx.diagnostics.start-request:sdk-session-lengths] The contract describes a shorter maximum [divergence:zdx.diagnostics.start-request:session-length-range]. The OneAPI Postman collection's `POST {{ZDXBaseUrl}}/devices/{{deviceID}}/deeptraces` request (described as "Start deep trace") sends a body with `session_name`, `app_id`, `web_probe_id`, `cloudpath_probe_id`, `session_length` (300 in the example), `probe_device` and `callback_url`. [zdx.diagnostics.start-request:postman-start-body] The collection's example uses another key [divergence:zdx.diagnostics.start-request:postman-length-key].

**What comes back.** The Python `start_deeptrace` builds its result as a `TraceDetails`, which reads only `session_name`, `user_id`, `username`, `device_id`, `device_name`, `session_length_minutes` and `probe_device` from the response; it has no trace ID or status attribute. [zdx.diagnostics.start-request:python-start-result] So the object the Python `start_deeptrace` returns does not carry the `trace_id` or `status` the contract's start response holds; the caller has to find the new trace by listing the device's traces. [zdx.diagnostics.start-request:python-start-loses-trace-id] The Go start result is in [The contract types `trace_id` as an integer while the Go `DeepTraceSession` struct types `TraceID` as a string, so decoding a numeric `trace_id` with Go's JSON decoder fails and `CreateDeepTraceSession` and `GetDeepTraces` would return that error instead of the session.](kb:zdx.sdk-go.service-defects:go-trace-id-string); reading the session afterwards is in [Reading and deleting a deep trace through the API: the session record and its keys](kb:zdx.diagnostics.session-records).

What to check:
1. Whether the device already has an active deep trace, and how many are active across the tenant, including sessions started from the console.
2. Whether the web and cloud-path probe IDs were read for this same device and application, and taken from the probe record's `id`.
3. Which client built the body: a Go-built body carries `cloud_path_probe_id`, which the contract does not define.
4. Whether the requested session length is within the contract's stated maximum.
5. Where the trace ID came from: the Python start result does not carry it, so list the device's traces to find it.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.diagnostics.start-request:probe-id-key] Tier B: Rests on the Python probe models reading `id` and on the start body's key names; no source states the hand-over in one place.
- [zdx.diagnostics.start-request:python-start-loses-trace-id] Tier B: Follows from the model's attribute list against the contract's response fields; not observed against a live tenant.
- [zdx.diagnostics.start-request:go-payload-sends-all] Tier B: Follows from Go's encoding/json writing every field that lacks `omitempty`, when the struct is marshaled as is and has no MarshalJSON of its own: the writer claims behind omitempty-drops-zero-values cover ZPA, ZTW, ZCC and ZIA, and that the ZDX client marshals this payload directly was not traced here. Not observed on the wire.

Sources disagree (name both sides):
- The key for the cloud-path probe in the start body: the contract and the Python and MCP callers use `cloudpath_probe_id`; the Go payload struct sends `cloud_path_probe_id`. [divergence:zdx.diagnostics.start-request:cloudpath-key]
  - api-specs: The start body's cloud-path probe key is `cloudpath_probe_id`.
  - sdk-go: The Go SDK serializes the cloud-path probe ID as `cloud_path_probe_id`.
  Impact: A Go-built start request carries a key the contract does not define, so the cloud-path probe the caller chose may not reach the server; whether the API rejects the request, ignores the key or accepts it is not stated by any source.
- The type of the start body's application and probe IDs: the contract defines int64 integers; the Python docstring documents strings. [divergence:zdx.diagnostics.start-request:id-types]
  - api-specs: `app_id`, `web_probe_id` and `cloudpath_probe_id` are int64 integers.
  - sdk-python: The Python docstring types the IDs as `str`; the method sends whatever type the caller passes.
  Impact: A Python caller following the docstring sends the IDs as JSON strings where the contract expects integers; the MCP tool converts them to integers before calling the SDK ([[zdx.diagnostics.mcp-tools:start-tool-coerces]]).
- The allowed session length: the contract describes up to 15 minutes; the Python docstring and the MCP tool list 5, 15, 30 and 60. [divergence:zdx.diagnostics.start-request:session-length-range]
  - api-specs: `session_length_minutes` goes up to 15 minutes.
  - sdk-python: Supported values are 5, 15, 30 and 60 minutes.
  Impact: A 30- or 60-minute request that the SDK documents as supported may be refused or shortened by the API; no source shows which.
- The start body's session-length key: the contract defines `session_length_minutes` and no callback; the Postman example sends `session_length` and a `callback_url`. [divergence:zdx.diagnostics.start-request:postman-length-key]
  - api-specs: The length key is `session_length_minutes`; the body has no `callback_url`.
  - api-specs: The Postman start body sends `session_length` and `callback_url`.
  Impact: A request copied from the collection carries a length key the contract does not define, and its example value of 300 is out of the contract's range if read as minutes; no source says whether the API reads `session_length`, in which unit, or what it does with `callback_url`.

Not known (open gaps):
- What the API does with a probe ID read for a different device or application [gap:zdx.diagnostics.start-request:probe-id-portability]: settled by lab-test. Blocks: telling a caller whether a probe ID can be reused across devices or applications

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API): The MCP start tool tells callers to resolve `app_id`, `web_probe_id` and `cloudpath_probe_id` with `zdx_list_applications`, `zdx_get_web_probes` and `zdx_list_cloudpath_probes` first, and the Go SDK's start example asks for the device, application, web probe and cloud-path probe IDs in that order before calling `CreateDeepTraceSession`. [zdx.diagnostics.start-request:read-chain]
- depends-on references/_meta/text/zdx/zdx.probes.md (ZDX probes: Web and Cloud Path probes, what they measure and how they run): The MCP start tool tells callers to resolve `app_id`, `web_probe_id` and `cloudpath_probe_id` with `zdx_list_applications`, `zdx_get_web_probes` and `zdx_list_cloudpath_probes` first, and the Go SDK's start example asks for the device, application, web probe and cloud-path probe IDs in that order before calling `CreateDeepTraceSession`. [zdx.diagnostics.start-request:read-chain]
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.sdk-go.service-defects.md (Go SDK ZDX services: where the structs and functions disagree with the contract)
