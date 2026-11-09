# The Zscaler MCP server: release, protocol and where its behavior is described (shared.mcp-server)
Also called: zscaler mcp; zscaler-mcp; zscaler mcp server; mcp server version; zscaler_mcp; mcp 2026-07-28; mcp protocol revision

This walks the subjects that describe the Zscaler MCP server as a tool: which tools it registers, how writes and deletes are gated, what a tool result contains, and how an HTTP deployment is secured. Product-specific MCP tool behavior is described in the product subjects that use it. The pinned MCP server tree declares package version 0.15.4 and requires Python >=3.11,<4.0. [shared.mcp-server:release]

**Under the tools.** The MCP server calls Zscaler through the Python SDK, which does every API call, token exchange, pagination and retry; the server's package metadata leaves `zscaler-sdk-python` unconstrained so installs pull the latest SDK. [shared.mcp-server:sdk-does-api-calls] The server requires `mcp[cli]>=2.0.0,<3`; 2.0.0 is the floor because the `2026-07-28` revision features (`InputRequiredResult`, `RequestStateSecurity`, `cache_hints`) land there. Standalone `fastmcp` is not a dependency of any auth mode, and a test fails if it becomes a base dependency. [shared.mcp-server:dependency-floor] The MCP tree's generated requirements resolve `mcp==2.0.0` and `zscaler-sdk-python==1.9.43`, while the Python SDK vendored in this repository is version 1.11.3; the lock file's own editable entry for `zscaler-mcp` still says 0.15.3, where the package's pyproject.toml says 0.15.4. [shared.mcp-server:lock-resolution]

**Protocol revision.** Version 0.15.0 adopted the `2026-07-28` MCP revision; clients on older revisions keep working because the revision is negotiated per connection, with nothing to configure. [shared.mcp-server:protocol-negotiated] CI gates on the conformance scenarios of the published 2025-11-25 revision; a separate baseline for the 2026-07-28 revision runs on a prerelease runner and does not gate CI. [shared.mcp-server:conformance-gate]

**Where to read next.** Which tools exist on a given server is in [Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate](kb:shared.mcp-server.tool-inventory); how creates, updates and deletes are gated is in [How the Zscaler MCP server confirms deletes: elicitation, HMAC tokens and request state](kb:shared.mcp-server.delete-confirmation); what a result carries (full records, untrusted-content banners, JMESPath, CSV) is in [What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV](kb:shared.mcp-server.results); TLS, Host validation, client authentication, logging and cloud secrets are in [Running the Zscaler MCP server over HTTP: TLS, Host validation, client authentication, logging and cloud secrets](kb:shared.mcp-server.http-deployment); where the server's argument converters drop or choose silently (ZPA policy conditions, ZTW country names) is in [Where the Zscaler MCP server's argument converters drop or choose silently: ZPA policy conditions and ZTW country names](kb:shared.mcp-server.argument-conversion).

**Product examples.** ZPA list paging through MCP is in [ZPA list pagination, search syntax and client-side filtering](kb:zpa.api.pagination), and the Sandbox report banner in [Sandbox reports, quota, and trusting report content](kb:zia.sandbox.report).

What to check:
1. Which MCP server release the deployment runs, since the write gate and the confirmation channels changed in 0.15.0.
2. Which Python SDK version the MCP installation actually resolved, before tracing a tool's behavior to SDK code.

Area: shared.mcp-server, its subjects in references/_meta/spine/shared/shared.mcp-server.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.mcp-server.argument-conversion.md (Where the Zscaler MCP server's argument converters drop or choose silently: ZPA policy conditions and ZTW country names)
- links-to references/_meta/text/shared/shared.mcp-server.delete-confirmation.md (How the Zscaler MCP server confirms deletes: elicitation, HMAC tokens and request state)
- links-to references/_meta/text/shared/shared.mcp-server.http-deployment.md (Running the Zscaler MCP server over HTTP: TLS, Host validation, client authentication, logging and cloud secrets)
- links-to references/_meta/text/shared/shared.mcp-server.results.md (What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV)
- links-to references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
- links-to references/_meta/text/zia/zia.sandbox.report.md (Sandbox reports, quota, and trusting report content)
- links-to references/_meta/text/zpa/zpa.api.pagination.md (ZPA list pagination, search syntax and client-side filtering)
