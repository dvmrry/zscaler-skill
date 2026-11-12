# Which clients cover which parts of the ZIdentity API: Python, Go and the MCP server (zidentity.api.client-coverage)
Also called: zidentity sdk coverage; zid mcp tools; zid_list_users; zidentity reset password sdk; zidentity automation options; zidentity terraform

ZIdentity is automated through the Python SDK's `zid` package, the Go SDK's `ziam` services and, for reads, the MCP server. Each SDK's modules and functions are generated (`node scripts/kb.mjs surface zid`); this subject records the coverage differences an agent needs when choosing between them.

**User actions.** The Go users package wraps three user actions: `SetSkipMFA`, `ResetPassword` and `UpdatePassword`. [zidentity.api.client-coverage:go-user-actions] Besides `__init__`, the Python users module (`UsersAPI`) defines only `list_users`, `get_user`, `add_user`, `update_user`, `delete_user` and `list_user_group_details`; none of them sets skip MFA, resets a password or updates one. [zidentity.api.client-coverage:python-no-user-actions] The Go paths for these actions differ from the contract's: [zidentity.sdk-go:user-action-paths](kb:zidentity.sdk-go:user-action-paths).

**Python SDK line.** [The Python SDK's legacy (non-OneAPI) clients cover ZPA, ZIA, ZTW, ZCC, AI Guard, ZDX, ZWA and ZTB.](kb:shared.sdk-python.client-configuration:legacy-clients) The Python v2 beta covers ZIdentity together with ZIA and ZDX: [The Python SDK's v2.x beta (`2.0.0bN`), announced in release 1.9.23, covers ZIA, ZDX and ZIdentity only; ZPA, ZCC, ZTW, ZTB and ZWA remain on v1.x, which stays the recommended GA release.](kb:cloud-connector.api.client-coverage:python-v2-excludes-ztw).

**MCP server.** The MCP server's ZIdentity toolsets are `zid_groups` and `zid_users`, five tools each: get, list and search for groups and users, plus a group's members and a user's groups, which each have one tool by ID and one by name. [zidentity.api.client-coverage:mcp-toolsets] The MCP tool catalog marks all ten ZIdentity tools Read-only. [zidentity.api.client-coverage:mcp-read-only] The MCP list tools `zid_list_users` and `zid_list_groups` return lean summaries rather than the full SDK record: users as id, login name, display name and primary email, groups as id, name, description, dynamic flag and source IdP. [zidentity.api.client-coverage:mcp-lean-summaries] No MCP tool reads or writes ZIdentity API clients, resource servers or user entitlements, and none writes users or groups. [zidentity.api.client-coverage:mcp-no-admin-objects] The MCP server keeps ZIdentity tools only when the token's service list maps `ZIAM` to them: [Since 0.15.2 the filter maps `CLOUD_CONNECTOR` to `ztw`, `ZIAM` to `zid` and `ZINSIGHTS` to `zins`, the values ZIdentity emits in the token's `service-info` claim; before that it removed `ztw_*`, `zid_*` and `zins_*` tools from entitled tenants (issue #95).](kb:shared.mcp-server.tool-inventory:entitlement-aliases).

What to check:
1. Whether the task needs a user action (password reset, skip MFA, password update), which only the Go SDK wraps.
2. Whether the task needs API clients, resource servers or entitlements, which no MCP tool reads.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.api.client-coverage:mcp-no-admin-objects] Tier B: The toolsets guide lists only these two ZIdentity toolsets, and the server's ZIdentity tool directory holds only groups.py and users.py at the pin.

Area: zidentity.api, its subjects in references/_meta/spine/zidentity/zidentity.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered), from zidentity.api: The Python SDK's ZIdentity service classes set the base endpoint `/ziam/admin/api/v1`, and its request executor resolves the OneAPI gateway base URL to a dedicated gateway for a government (FedRAMP) cloud, otherwise to https://api.<cloud>.zsapi.net when a cloud other than `production` is configured, and to https://api.zsapi.net by default. [zidentity.api:python-route]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zidentity.api: Creating an API client through the API (POST /api-clients) requires a bearer token, as do the contract's other API client, group, resource server and user operations, so the first API client cannot be created through the API and has to come from the Admin Console. [zidentity.api:bearer-on-every-operation]
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths), from zidentity.api: The ZIdentity contract declares the server https://api.zsapi.net/ziam/admin/api/v1, described as the Authentication Service endpoint. [zidentity.api:contract-server]
- links-to references/_meta/text/cloud-connector/cloud-connector.api.client-coverage.md (Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform)
- links-to references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
- links-to references/_meta/text/shared/shared.sdk-python.client-configuration.md (How the Python SDK's unified client is configured: OneAPI or legacy, settings, environment variables)
- links-to references/_meta/text/zidentity/zidentity.sdk-go.md (Go SDK for ZIdentity (ziam services): name lookups, write models and where its paths depart from the contract)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
- see-also references/_meta/text/zidentity/zidentity.sdk-python.md (Python SDK for ZIdentity (client.zid): where its models and keys depart from the API)
