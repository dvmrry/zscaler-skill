# Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate (shared.mcp-server.tool-inventory)
Also called: --enable-write-tools; --write-tools; ZSCALER_MCP_WRITE_ENABLED; ZSCALER_MCP_WRITE_TOOLS; --toolsets; --disabled-toolsets; --no-entitlement-filter; ZSCALER_MCP_DISABLE_ENTITLEMENT_FILTER; mcp write tools missing; mcp tools disappeared; mcp entitlement filter; service-info prd; mcp tool annotations; readOnlyHint
Former IDs: shared-40

The set of tools a client sees is fixed when the server starts. Tool selection applies, in order: disabled tool-name patterns (highest precedence), service enable and disable, OneAPI entitlement downscoping, toolset selection, then the read/write gate. [shared.mcp-server.tool-inventory:precedence]

## Toolsets

`--toolsets` (`ZSCALER_MCP_TOOLSETS`) enables toolsets and `--disabled-toolsets` (`ZSCALER_MCP_DISABLED_TOOLSETS`) excludes them; both take exact toolset IDs with no wildcards (`--toolsets` also takes the keywords `all` and `default`, meaning every toolset), and the disabled list wins when both name a toolset. [shared.mcp-server.tool-inventory:toolset-flags] An unknown toolset ID is logged as a warning naming the unknown and the known IDs, and startup continues; for `--toolsets` a selection that matches nothing starts the server with zero tools. [shared.mcp-server.tool-inventory:unknown-toolsets]

## OneAPI entitlement filter

The OneAPI entitlement filter reads the `service-info` entries of the OneAPI token, maps each `prd` value (case-insensitively) to an MCP service, and keeps only tools of the mapped services; it runs once while the server is built. [shared.mcp-server.tool-inventory:entitlement-filter] The filter is non-fatal: when it cannot decide (missing credentials, a network or decode failure, an empty service-info) it applies no downscoping, leaves the tool surface untouched and logs one line. [shared.mcp-server.tool-inventory:entitlement-skip] Since 0.15.2 the filter maps `CLOUD_CONNECTOR` to `ztw`, `ZIAM` to `zid` and `ZINSIGHTS` to `zins`, the values ZIdentity emits in the token's `service-info` claim; before that it removed `ztw_*`, `zid_*` and `zins_*` tools from entitled tenants (issue #95). [shared.mcp-server.tool-inventory:entitlement-aliases] `prd` values with no known mapping are skipped, and the skipped values are named in a warning saying that if one corresponds to a product the server provides tools for, its tools are being removed by a mapping gap, not a missing entitlement. [shared.mcp-server.tool-inventory:entitlement-unmapped-warning] Whether the mapped aliases are the complete set ZIdentity emits for every tenant and token generation is open [gap:shared.mcp-server.tool-inventory:prd-alias-set]. `--no-entitlement-filter` or `ZSCALER_MCP_DISABLE_ENTITLEMENT_FILTER=true` skips the filter; the flag's help calls it an emergency override. [shared.mcp-server.tool-inventory:entitlement-disable] With the filter disabled, tools of products the OneAPI client is not entitled to are also registered, so they appear in the inventory and can fail only when called. [shared.mcp-server.tool-inventory:entitlement-disable-effect]

## Write tools

Write tools (create, update, delete) are registered only when both the master switch `--enable-write-tools` (`ZSCALER_MCP_WRITE_ENABLED`) and the allowlist `--write-tools` (`ZSCALER_MCP_WRITE_TOOLS`, fnmatch patterns) are set; then only write tools whose names match a pattern are registered. The rule is enforced in server construction, so the CLI, tests and embedding callers all fail closed. [shared.mcp-server.tool-inventory:write-gate] Either half alone registers zero write tools and logs a startup warning: the switch without an allowlist, or an allowlist with the switch off. [shared.mcp-server.tool-inventory:write-gate-warnings] Version 0.15.0 restored the two-setting requirement: from 0.13.0 either setting alone turned writes on, and the switch with a blank allowlist registered every write tool (148, deletes included). [shared.mcp-server.tool-inventory:write-gate-history] Read-only tools are always registered by the server, regardless of any flags. [shared.mcp-server.tool-inventory:read-tools-always] Once a write tool is registered, what gates each call is in [How the Zscaler MCP server confirms deletes: elicitation, HMAC tokens and request state](kb:shared.mcp-server.delete-confirmation).

## What clients are told

Every tool gets MCP annotations derived from its single action: reads are read-only; creates are not read-only, not destructive and not idempotent; updates and deletes are destructive and idempotent. `openWorldHint` is false for every tool, and the write-only hints are left unset on read tools. [shared.mcp-server.tool-inventory:annotations] The annotations are advisory hints for the client, not a security control; the server-side write allowlist and delete confirmation apply regardless of them. [shared.mcp-server.tool-inventory:annotations-advisory] `tools/list` alone carries a public cache hint of five minutes (300,000 ms), on the grounds that every filter is resolved once at registration and the inventory cannot change while a connection lives. [shared.mcp-server.tool-inventory:list-cache-hint]

Tools added on request: MCP server issue #61 asked for tools to read the ZIA Advanced Threat Protection policy, malware protection policy, advanced settings and mobile malware protection policy; it was closed as completed on 2026-05-17 with a reply signed Zscaler DevRel to upgrade to v0.12.1, and the changelog lists tools for ATP settings and security exceptions, malware protection, advanced settings and mobile advanced threat settings in the 0.12.0 section. [shared.mcp-server.tool-inventory:mcp-atp-tools-request]

What to check:
1. Whether both write settings are set (switch and a non-empty allowlist) when write tools are missing, from the startup warning.
2. When a product's tools are missing after OneAPI sign-in, the startup entitlement log line and any unmapped prd warning, compared with the token's service-info values.
3. Whether a toolset ID passed to --toolsets or --disabled-toolsets is reported as unknown at startup.

Inferred, not quoted (say so when an answer rests on one):
- [shared.mcp-server.tool-inventory:entitlement-disable-effect] Tier B: Follows from the filter being the only entitlement check at registration; that the API then refuses the calls is inferred, not shown in a source.

Not known (open gaps):
- The complete set of service-info prd values ZIdentity emits [gap:shared.mcp-server.tool-inventory:prd-alias-set]: settled by source-read or tenant-data. Blocks: trusting the entitlement filter not to hide tools a tenant is entitled to

Area: shared.mcp-server, its subjects in references/_meta/spine/shared/shared.mcp-server.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/shared/shared.mcp-server.delete-confirmation.md (How the Zscaler MCP server confirms deletes: elicitation, HMAC tokens and request state): Write tools (create, update, delete) are registered only when both the master switch `--enable-write-tools` (`ZSCALER_MCP_WRITE_ENABLED`) and the allowlist `--write-tools` (`ZSCALER_MCP_WRITE_TOOLS`, fnmatch patterns) are set; then only write tools whose names match a pattern are registered. The rule is enforced in server construction, so the CLI, tests and embedding callers all fail closed. [shared.mcp-server.tool-inventory:write-gate]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.mcp-server.md (The Zscaler MCP server: release, protocol and where its behavior is described)
