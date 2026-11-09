# Reading and deleting a deep trace through the API: the session record and its keys (zdx.diagnostics.session-records)
Also called: get deeptrace; list deeptraces; delete deeptrace; deep trace session record; session_length; cloud_path_nane; stop a deep trace; deeptrace metrics after completion
Former IDs: zdx-33

After a start, the session is read back per device and trace, and its metric readers become useful once it has run. The list, get, delete and metric endpoints are generated (`node scripts/kb.mjs surface zdx`).

**The record.** In the contract's session record, `trace_id` is an int64 integer, `status` has the same four-value enum as the start response's `status`, `created_at`, `started_at` and `ended_at` are epoch seconds, and `trace_details` holds the session's `session_name`, user, device and probe IDs, with the length under `session_length`, described as 'Session length in seconds (upto 60 seconds)', and the cloud-path probe's name under `cloud_path_nane`. [zdx.diagnostics.session-records:record-shape] The earlier question about the length key is closed by the contract [gap:zdx.diagnostics.session-records:session-length-key]. The Go SDK's `TraceDetails` reads the length from `session_length` and the cloud-path probe from `cloudpath_probe_id` and `cloud_path_name`, and its `DeepTraceSession` types `TraceID` (`trace_id`) as a string. [zdx.diagnostics.session-records:go-record-keys] The Go probe-name key and the contract's differ [divergence:zdx.diagnostics.session-records:probe-name-key].

**Results.** The legacy ZDX getting-started guide says that after a successful start, GET requests retrieve Web probe metrics, Cloud Path probe metrics and health metrics from the completed deep tracing session. [zdx.diagnostics.session-records:metric-readers] The Python readers and their result shapes are in [What the Python SDK's ZDX results contain: envelopes, missing fields and paging](kb:zdx.sdk-python.response-models).

**Top processes.** The contract's top-processes read gets the top processes from a deep tracing session, addressed by the device ID and the session's trace ID; it returns a `timestamp` in epoch seconds and `top_processes`, each a `category` of metrics (for example disk, memory, wifi, network) with its `processes`, each a process identifier and a process name. [zdx.diagnostics.session-records:top-processes] So top processes are read per deep trace, not per device: the trace ID comes from starting a session or listing the device's sessions, and a device with no session has none to read. [zdx.diagnostics.session-records:top-processes-needs-trace] The Go function sits in the device reports package and expects another shape, [The Go `GetDeviceTopProcesses` decodes the response into a list of `DeviceTopProcesses` and sends a `GetFromToFilters` time range, while the contract's response is a single object (`timestamp` and `top_processes`) and the operation defines only the `id` and `traceId` path parameters.](kb:zdx.sdk-go.service-defects:go-top-processes-shape).

**Deleting.** Deleting a trace deletes the session and its associated data, and the legacy guide says a DELETE also stops a deep trace before its duration expires; the contract answers 200 with the `trace_id` or 204 with no content. [zdx.diagnostics.session-records:delete-semantics]

What to check:
1. Which key the client read for the session length: the record uses `session_length`, not the start request's `session_length_minutes`.
2. Whether the session had finished before its metric readers were called.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.diagnostics.session-records:top-processes-needs-trace] Tier B: Follows from the read being addressed by a session's trace ID; no source describes a top-processes read outside a deep tracing session.

Sources disagree (name both sides):
- The key for the cloud-path probe's name in the session record: the contract spells it `cloud_path_nane`; the Go SDK reads `cloud_path_name`. [divergence:zdx.diagnostics.session-records:probe-name-key]
  - api-specs: The record's key is `cloud_path_nane`.
  - sdk-go: The Go SDK reads `cloud_path_name`.
  Impact: If the live record uses the contract's spelling, the Go `CloudPathProbeName` stays empty; if the contract has a typo, a hand-written client that follows it reads nothing. A live response would settle it.

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.sdk-go.service-defects.md (Go SDK ZDX services: where the structs and functions disagree with the contract)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
