# The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches (zdx.diagnostics.mcp-tools)
Also called: zdx_start_deeptrace; zdx_delete_deeptrace; zdx_list_device_deep_traces; zdx_get_device_deep_trace; zdx_troubleshoot_user_experience; mcp zdx deep trace; mcp zdx prompt

The MCP server wraps the Python SDK's ZDX troubleshooting calls as tools and ships a guided prompt that chains them. Its general behavior is in [The Zscaler MCP server: release, protocol and where its behavior is described](kb:shared.mcp-server); this subject covers the ZDX deep-trace tools.

**Starting.** The MCP start tool takes `device_id` as a string, `app_id`, `web_probe_id` and `cloudpath_probe_id` as integers, `session_length_minutes` defaulting to 5 and `probe_device` defaulting to true. [zdx.diagnostics.mcp-tools:start-tool-inputs] The start tool converts the three IDs to integers and passes `session_name`, `app_id`, `web_probe_id`, `cloudpath_probe_id`, `session_length_minutes` and `probe_device` to the Python `start_deeptrace`. [zdx.diagnostics.mcp-tools:start-tool-coerces] The tool reads the trace ID from the SDK result's `trace_id`, `traceId` or `id` and falls back to `started` for the status; since the Python start result carries none of those keys, the tool returns no trace ID and the status `started` whatever the API answered. [zdx.diagnostics.mcp-tools:start-tool-trace-id]

**Writes are gated.** The start and delete tools are disabled unless the operator passes `--write-tools`, and the server bridge confirms a delete before the tool body runs. [zdx.diagnostics.mcp-tools:write-gating] The delete tool refuses a call without both `device_id` and `trace_id`. [zdx.diagnostics.mcp-tools:delete-requires-ids]

**Reading.** The deep-trace list tool returns each trace's SDK record (`as_dict()`) as one row, and the get tool returns the first element of the SDK's result, so their fields are whatever the Python models expose. [zdx.diagnostics.mcp-tools:list-tool-records] Among the ZDX tools, only the analysis reader converts epoch timestamps to ISO strings (`convert_timestamps`); the deep-trace get tool's docstring says its timestamps are ISO-normalized, but its body passes the SDK record through unconverted. [zdx.diagnostics.mcp-tools:timestamp-conversion] The device and probe tools take `since` as an optional look-back in hours of at least 1, described as defaulting to 2 hours in ZDX. [zdx.diagnostics.mcp-tools:probe-since]

**The guided prompt.** The ZDX troubleshooting prompt tells the agent to call `zdx_list_devices(search=...)`, but the device-list tool's input has no `search` field; it filters by emails, user IDs, MAC address, private IPv4, location, department, geolocation, `since` and `offset`. [zdx.diagnostics.mcp-tools:prompt-search-arg] The prompt also says to pass all IDs as strings, which disagrees with the start tool's integer application and probe IDs. [zdx.diagnostics.mcp-tools:prompt-string-ids]

What to check:
1. Whether the started trace's ID came from the tool result, which comes back empty, or from a follow-up listing.
2. Whether the server was started with write tools enabled before a start or delete was attempted.
3. Whether calls built from the guided prompt use the registered tool arguments rather than the prompt's `search` and string IDs.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.diagnostics.mcp-tools:start-tool-trace-id] Tier B: Follows from the tool's key lookup against the attributes the Python result model exposes; not observed against a live tenant.
- [zdx.diagnostics.mcp-tools:timestamp-conversion] Tier B: A search of `src/zscaler_mcp/` at the pin finds `convert_timestamps(` called only in `deeptrace_analysis.py`.
- [zdx.diagnostics.mcp-tools:prompt-search-arg] Tier B: The nine quoted fields are every field `ListDevicesInput` declares at the pin; how the server treats an undeclared argument was not traced.
- [zdx.diagnostics.mcp-tools:prompt-string-ids] Tier B: A comparison of the prompt text with the start tool's input model.

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.mcp-server.md (The Zscaler MCP server: release, protocol and where its behavior is described): Write tools (create, update, delete) are registered only when both the master switch `--enable-write-tools` (`ZSCALER_MCP_WRITE_ENABLED`) and the allowlist `--write-tools` (`ZSCALER_MCP_WRITE_TOOLS`, fnmatch patterns) are set; then only write tools whose names match a pattern are registered. The rule is enforced in server construction, so the CLI, tests and embedding callers all fail closed. [shared.mcp-server.tool-inventory:write-gate]
