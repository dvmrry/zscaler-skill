# ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return (zdx.diagnostics.analysis)
Also called: start_analysis; get_analysis; CreateAnalysis; score analysis; zdx analysis job; analysis_id; t0 t1

A score analysis is an asynchronous job: one call starts it and returns an ID, and another reads its progress and result. The endpoints and client functions are generated (`node scripts/kb.mjs surface zdx`).

**The contract.** The contract's analysis start takes `device_id`, `app_id` and `t0` (required) and `t1`, all int64 integers, for a score analysis of an app between t0 and t1, and answers with `analysis_id`, the ID used to track progress and get the result, and a `status`. [zdx.diagnostics.analysis:contract-start] Reading an analysis returns `analysis_id`, `status`, `err_msg` and a `result` holding `issue`, `confidence`, `message` and `times`, the time points where the issue is seen. [zdx.diagnostics.analysis:contract-result] The OneAPI Postman collection's Start Score Analysis request sends `deviceid` (a quoted string), `appid` (filled from `{{appID}}`), `t0` and `t1`. [zdx.diagnostics.analysis:postman-start-body] Its keys differ from the contract's [divergence:zdx.diagnostics.analysis:postman-body-keys].

**Python.** The Python `start_analysis` sends its keyword arguments as the body and builds its result as a `DeviceApplicationAnalysis`, which reads only `device_id`, `app_id`, `t0` and `t1`. [zdx.diagnostics.analysis:python-start] So the object the Python `start_analysis` returns carries none of the `analysis_id` and `status` the contract's start response holds, and the ID needed to poll the job has to be read from the raw response. [zdx.diagnostics.analysis:python-start-loses-id] The Python `get_analysis` returns a one-element list holding `form_response_body` applied to the response body, with no model class around it; for a JSON object body `form_response_body` builds and returns a dict. [zdx.diagnostics.analysis:python-get-raw]

**Go and MCP.** The Go start function returns no decoded body: [`GetDeepTraceSession` and `CreateAnalysis` pass no decode target to `NewRequestDo` and return only the `*http.Response`, so neither hands back the session record or the new `analysis_id` as a struct.](kb:zdx.sdk-go.service-defects:no-decode-functions). The MCP analysis reader is the only ZDX tool that converts timestamps: [Among the ZDX tools, only the analysis reader converts epoch timestamps to ISO strings (`convert_timestamps`); the deep-trace get tool's docstring says its timestamps are ISO-normalized, but its body passes the SDK record through unconverted.](kb:zdx.diagnostics.mcp-tools:timestamp-conversion).

What to check:
1. Where the analysis ID came from: neither the Python start result nor the Go start function hands it back decoded.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.diagnostics.analysis:python-start-loses-id] Tier B: Follows from the model's attribute list against the contract's response fields; not observed against a live tenant.

Sources disagree (name both sides):
- The analysis start body's ID keys: the contract requires `device_id` and `app_id`; the Postman example sends `deviceid` and `appid`. [divergence:zdx.diagnostics.analysis:postman-body-keys]
  - api-specs: `device_id`, `app_id` and `t0` are required.
  - api-specs: The Postman start body names the IDs `deviceid` and `appid`.
  Impact: A request copied from the collection lacks two keys the contract marks required; no source says whether the API accepts the unseparated names.

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.diagnostics.mcp-tools.md (The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches)
- links-to references/_meta/text/zdx/zdx.sdk-go.service-defects.md (Go SDK ZDX services: where the structs and functions disagree with the contract)
