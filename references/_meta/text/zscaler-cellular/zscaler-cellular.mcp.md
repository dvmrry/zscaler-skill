# The Zscaler MCP server's ZCell tools: 20 reads, the customer ID, time windows, prompts and gaps (zscaler-cellular.mcp)
Also called: zcell mcp tools; zcell_list_sims; zcell_customer_id mcp; zcell prompts; zcell_review_anomaly_policies; zcell audit mcp object_id
Former IDs: zscaler-cellular-04

The MCP server wraps the Python SDK's ZCell reads; toolsets and entitlement filtering are shared with other products ([Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate](kb:shared.mcp-server.tool-inventory)), and whether the token's product value for Cellular is the one the filter expects is open in [The complete set of service-info prd values ZIdentity emits](kb:shared.mcp-server.tool-inventory:prd-alias-set).

**Inventory.** The MCP server registers 20 ZCell tools, all read-only, and its tests assert both; its toolsets guide groups them into nine toolsets. [zscaler-cellular.mcp:inventory] MCP exposes reads only: anomaly-policy create, update, delete and status changes, customer and region updates, SIM download, tag assignment, lock, status, eSIM assignment and eSIM state refresh, SIM location group writes, tag creation and tower-location history are reachable only through the SDK or raw API. [zscaler-cellular.mcp:read-subset]

**Customer ID.** ZCell tools need `ZCELL_CUSTOMER_ID` in addition to the shared OneAPI credentials, separate from the `ZSCALER_CUSTOMER_ID` ZPA uses; the server injects it as `zcellCustomerId`, so it is not a tool parameter. [zscaler-cellular.mcp:customer-id] With `ZCELL_CUSTOMER_ID` unset, a ZCell tool fails saying the value is required for zcell tools, that it is the tenant or customer ID rather than an OneAPI credential so authentication is unaffected, and that it may not exist if the tenant is not entitled to the product. [zscaler-cellular.mcp:missing-scope-error]

**Time windows.** Time-bounded ZCell tools share a `WindowInput` model whose only field is a `days` lookback (default 7, limited to 1 through 365), which the SDK turns into a [now - days, now] epoch-seconds window, so callers only say how far back. [zscaler-cellular.mcp:days-input] Where the window is computed is described inconsistently [divergence:zscaler-cellular.mcp:days-computed-where]. The anomaly-policy logs tool's input model, `AnomalyPolicyLogsInput`, is a plain `BaseModel` (not a `WindowInput`) with only a policy ID, page and size, so it has no days window. [zscaler-cellular.mcp:logs-input] [divergence:zscaler-cellular.mcp:logs-days-doc]

**Audit search.** The MCP audit search tool's input model, `AuditSearchInput` (a `WindowInput` with its `days` lookback), takes `object_id` as a string and filters on operation type, object type, object name, object ID, visibility and modifying user ID, plus page and size; the tool sends page and size as query parameters and the filters as keyword arguments. The model has no entry ID, customer ID or sort fields. [zscaler-cellular.mcp:audit-input] [divergence:zscaler-cellular.mcp:audit-object-id] Accepted typing and the omitted filters are open [gap:zscaler-cellular.mcp:audit-request]. The audit search tool passes each `AuditDataHandling` entry the SDK's `list_audit_customers_search` returns to `shape_many` with no shaper, which preserves every attribute of every record, and the SDK audit model's request format includes `oldData` and `newData`. [zscaler-cellular.mcp:audit-returns-full] [divergence:zscaler-cellular.mcp:audit-blobs] The general result contract is in [Shaping returns the full SDK record (a dict, or an SDK model converted with `as_dict()`) with the view's normalized or computed fields merged on top; the shaper can add or normalize fields but never drop them, for single objects and for every row of a list.](kb:shared.mcp-server.results:shape-overlay).

**SIM search and violations.** SIM search paging and violation lists are affected by SDK behavior described in [ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history](kb:zscaler-cellular.api.wire-notes).

**Prompts.** Three ZCell prompts are registered: `zcell_investigate_sim` (an ICCID, and a lookback defaulting to 7 days), `zcell_audit_data_usage` (lookback default 30 days, optional country) and `zcell_review_anomaly_policies` (lookback default 30 days, optional policy type); the anomaly review's workflow inventories the policies, gets the location groups of geofencing policies and lists each policy's violations and logs with the read-only `zcell_*` tools. [zscaler-cellular.mcp:prompts] The server offers a service's prompts when at least one of that service's tools survived tool filtering. [zscaler-cellular.mcp:prompt-gating] With only some ZCell toolsets selected, a ZCell prompt can be offered whose steps call tools that are not registered, for example the anomaly review's location-group lookup when `zcell_sim_location_groups` is not selected. [zscaler-cellular.mcp:partial-toolset-prompts]

What to check:
1. Whether ZCELL_CUSTOMER_ID is set in the MCP server environment when ZCell tools fail before any API call.
2. Whether the operation is a write or tower history, which MCP does not expose.

Inferred, not quoted (say so when an answer rests on one):
- [zscaler-cellular.mcp:partial-toolset-prompts] Tier B: Follows from prompt-gating (per service, not per tool) and the prompt text naming specific tools.
- [zscaler-cellular.mcp:read-subset] Tier B: Rests on inventory (20 read-only tools) compared against the operations in the generated zcell surface.

Sources disagree (name both sides):
- The MCP field description says the days window resolves on the server; the SDK computes it on the client. [divergence:zscaler-cellular.mcp:days-computed-where]
  - mcp-server: `days` resolves to a [now - days, now] epoch-seconds range on the server.
  - sdk-python: The SDK computes start and end from the local clock before sending.
  Impact: The window follows the MCP host's clock; a skewed host shifts the window.
- The audit tool's description says before and after data is omitted; its code returns the full SDK record, which includes it. [divergence:zscaler-cellular.mcp:audit-blobs]
  - mcp-server: The before/after data blobs are omitted from the row.
  - mcp-server: Rows are the SDK audit entries passed through the record-preserving shaper; the model's format carries oldData and newData.
  Impact: Audit rows can be larger than the description suggests and do include the change data an investigation needs.
- The ZCell tool guide says anomaly-policy logs accept a days lookback; the tool has no days input. [divergence:zscaler-cellular.mcp:logs-days-doc]
  - mcp-server: Time-bounded queries, including anomaly-policy logs, accept a days shorthand.
  - mcp-server: The logs tool input is policy ID, page and size.
  Impact: Anomaly-policy logs cannot be time-bounded through MCP; page through them instead.
- MCP types the audit object ID as a string; the contract declares it int64. [divergence:zscaler-cellular.mcp:audit-object-id]
  - mcp-server: `object_id` is an optional string.
  - api-specs: `objectId` is an int64 integer.
  Impact: Whether the backend coerces a string object ID is unknown; the entry ID, root customer and sort filters cannot be used from MCP at all.

Not known (open gaps):
- Audit search typing and the filters MCP leaves out [gap:zscaler-cellular.mcp:audit-request]: settled by lab-test or code-read. Blocks: filtering ZCell audit entries by object through MCP

Area: zscaler-cellular.mcp, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.mcp.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
- depends-on references/_meta/text/zscaler-cellular/zscaler-cellular.api.md (The Zscaler Cellular (ZCell) API: customer scoping, clients and where the contract and SDK disagree): The Python SDK and the MCP server are the only clients for ZCell: no Go SDK package, Terraform resource or Ansible module covers it. [zscaler-cellular.api:python-only]
- links-to references/_meta/text/shared/shared.mcp-server.results.md (What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.api.wire-notes.md (ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history)
